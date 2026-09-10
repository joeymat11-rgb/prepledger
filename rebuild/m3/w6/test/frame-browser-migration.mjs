// Serialized by Playwright into a fresh localhost context. All data/keys/validators are synthetic.
// This exercises real IDB abort/reopen cuts, not an OS crash or a production migration mapping.
export async function runFrameMigrationContract({ generation, lease, auth, bundle = "/frame.js" }) {
  const F = await import(bundle), name = "synthetic-frame-migration-cuts";
  const check = (condition, label) => { if (!condition) throw new Error(`FRAME-MIGRATION ASSERT ${label}`); };
  const bytes = value => JSON.stringify(value, (_name, v) => v instanceof ArrayBuffer ? { ArrayBuffer: [...new Uint8Array(v)] } : v instanceof Uint8Array ? { Uint8Array: [...v] } : v);
  const same = (left, right) => bytes(left) === bytes(right);
  const bodyKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const frameKey = crypto.getRandomValues(new Uint8Array(32)), legacyRequests = [];
  const raw = (change = null) => new Promise((resolve, reject) => {
    const request = indexedDB.open(name); request.onerror = () => reject(new Error("FRAME-MIGRATION raw open failed"));
    request.onsuccess = () => {
      const db = request.result, version = db.version, stores = [...db.objectStoreNames], tx = db.transaction("generations", change ? "readwrite" : "readonly"), store = tx.objectStore("generations");
      let active, previous;
      if (change) change(store);
      store.get("active").onsuccess = event => { active = event.target.result; };
      store.get("previous").onsuccess = event => { previous = event.target.result; };
      tx.oncomplete = () => { db.close(); resolve({ version, stores, active, previous }); };
      tx.onabort = () => { db.close(); reject(new Error("FRAME-MIGRATION raw transaction aborted")); };
    };
  });
  const refusal = async (action, state, code, label) => {
    let error, returned = false; try { await action(); returned = true; } catch (caught) { error = caught; }
    check(!returned && error?.state === state && (code === null || error.code === code), `${label}: expected${state}/${code ?? "typed"}, received${error?.state ?? "successful-read"}/${error?.code ?? "none"}`);
  };
  const legacyArgs = { databaseName: name, namespace: name, keyProvider: () => bodyKey, authorizeEnrollment: () => true };
  let legacy, repo;
  const cut = { upgradeArmed: false, oldVersion: null, newVersion: null, upgradeAborts: 0, upgradeCompletes: 0,
    conversionArmed: false, transactions: 0, puts: [], requestSucceeded: false, aborts: 0, completes: 0, published: false, earlyPublication: false };
  const wrapped = { open(...args) {
    const request = indexedDB.open(...args);
    request.addEventListener("upgradeneeded", event => {
      if (!cut.upgradeArmed) return;
      cut.oldVersion = event.oldVersion; cut.newVersion = event.newVersion;
      request.transaction.addEventListener("abort", () => { cut.upgradeAborts++; });
      request.transaction.addEventListener("complete", () => { cut.upgradeCompletes++; });
      request.transaction.abort();
    });
    request.addEventListener("success", () => {
      const db = request.result, transaction = db.transaction.bind(db);
      db.transaction = (...values) => {
        const tx = transaction(...values); if (!cut.conversionArmed || values[1] !== "readwrite") return tx;
        cut.transactions++; tx.addEventListener("abort", () => { cut.aborts++; }); tx.addEventListener("complete", () => { cut.completes++; });
        const store = tx.objectStore("generations"), put = store.put.bind(store), objectStore = tx.objectStore.bind(tx);
        store.put = (value, key) => {
          cut.puts.push(key); const written = put(value, key);
          if (key === "active") written.addEventListener("success", () => { cut.requestSucceeded = true; cut.earlyPublication = cut.published; tx.abort(); });
          return written;
        };
        tx.objectStore = key => key === "generations" ? store : objectStore(key); return tx;
      };
    }); return request;
  } };
  const args = { indexedDB: wrapped, databaseName: name, namespace: name, bodyKeyProvider: () => bodyKey,
    legacyKeyProvider: request => { legacyRequests.push(request); return bodyKey; },
    frameKeyProvider: () => ({ keyEpoch: 1, keyBytes: frameKey, revisionStart: 1 }), authorizeEnrollment: () => true };
  try {
    const seeded = structuredClone(generation);
    seeded.collections.syntheticUnknown = { "retained-row": { text: "synthetic \u03a9", ordered: [3, 1, null], nested: { keep: true } } };
    seeded.metadata.syntheticHistory = { entries: [{ source: "synthetic-only", H: 9000, W_last: 12000, used: 17 }], untouched: "no permission mapping" };
    legacy = await F.openRepository(legacyArgs); await legacy.initialize(seeded, "synthetic-only");
    const initial = await legacy.load(), stage = F.Stage.createT2Stage(() => ({ deviceId: "dev-A", athleteId: "ath-1", identityKey: "synthetic-identity", authorityKey: auth, lease,
      clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", monotonicMs: () => 0 } }));
    const staged = stage(initial.generation, "logSession", { sets: [{ exercise: "squat", reps: 5, load: 100 }, { exercise: "squat", reps: 5, load: 100 }] });
    check(staged.result.acknowledged, "actual T2 stage did not acknowledge");
    await legacy.commit(initial, staged.generation, () => null);
    const first = await legacy.load(), firstPair = await raw(), next = structuredClone(first.generation);
    next.metadata.syntheticAfterQueuedWrite = { note: "complete second v1 generation", keep: [false, "synthetic-only"] };
    await legacy.commit(first, next, () => null);
    const latest = await legacy.load(), oldPair = await raw(), count = staged.commit.batch.count;
    check(count > 1 && [first, latest].every(value => Object.keys(value.generation.collections.ops).length === count && Object.keys(value.generation.collections.outbox).length === count), "both v1 generations need actual T2 ops/outbox");
    check(same(oldPair.previous, firstPair.active) && !same(oldPair.active, oldPair.previous) && oldPair.version === 1 && same(oldPair.stores, ["generations"]), "distinct complete v1 pair required");
    check(same(first.generation.collections.syntheticUnknown, seeded.collections.syntheticUnknown) && same(latest.generation.metadata.syntheticHistory, seeded.metadata.syntheticHistory), "synthetic unknown/history fixture was not retained");
    const expectedGeneration = bytes(latest.generation); legacy.close(); legacy = null;

    cut.upgradeArmed = true;
    await refusal(() => F.openFrameRepository(args), 18, "FRAME_DATABASE_OPEN_FAILED", "aborted versionchange");
    cut.upgradeArmed = false;
    check(cut.oldVersion === 1 && cut.newVersion === 2 && cut.upgradeAborts === 1 && cut.upgradeCompletes === 0, "real versionchange abort not exercised");
    check(same(await raw(), oldPair), "aborted versionchange changed version/store/pair");
    legacy = await F.openRepository(legacyArgs); check(bytes((await legacy.load()).generation) === expectedGeneration, "version1 cannot reopen intact after upgrade abort"); legacy.close(); legacy = null;

    repo = await F.openFrameRepository(args);
    const upgradedPair = { ...oldPair, version: 2 };
    check(same(await raw(), upgradedPair), "version2 upgrade changed legacy records/store");
    await refusal(() => repo.load(), 18, "FRAME_V1_CONVERSION_REQUIRED", "unconverted normal load");
    let before = await repo.load({ compatibility: true });
    check(bytes(before.legacy) === expectedGeneration && same(before.active, oldPair.active) && same(before.previous, oldPair.previous) && !Object.hasOwn(before, "body") && !Object.hasOwn(before, "frame"), "explicit compatibility returned changed/proven state");
    const body = { format: 2, collections: before.legacy.collections, retainedMetadata: before.legacy.metadata, proofs: [] };
    const ordinary = await repo.prepare(before, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
    await refusal(() => repo.commitPrepared(before, ordinary, () => ({ kind: "publish", frameFields: F.frame() })), 18, "FRAME_CONVERSION_REQUIRED", "ordinary write before conversion");
    check(same(await raw(), upgradedPair), "unconverted refusal changed pair/reseeded");

    const prepare = () => repo.prepare(before, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, compatibility: true });
    const abortedCapability = await prepare(); cut.conversionArmed = true;
    await refusal(async () => { const result = await repo.commitPrepared(before, abortedCapability, () => ({ kind: "publish", frameFields: F.frame({ kind: 3 }) })); cut.published = true; return result; }, 3, "FRAME_TRANSACTION_ABORTED", "conversion request-success abort");
    check(cut.requestSucceeded && !cut.published && !cut.earlyPublication && cut.transactions === 1 && cut.aborts === 1 && cut.completes === 0, "conversion abort/ack cut not exercised");
    await refusal(() => repo.commitPrepared(before, abortedCapability, () => { throw new Error("consumed callback must not run"); }), 3, "FRAME_PREPARED_CONSUMED", "aborted conversion capability reused");
    check(cut.transactions === 1, "consumed capability opened a transaction"); cut.conversionArmed = false;
    check(same(await raw(), upgradedPair), "conversion abort changed complete legacy pair");
    repo.close(); repo = await F.openFrameRepository(args);
    await refusal(() => repo.load(), 18, "FRAME_V1_CONVERSION_REQUIRED", "post-abort normal reopen"); before = await repo.load({ compatibility: true });
    check(bytes(before.legacy) === expectedGeneration && same(before.active, oldPair.active) && same(before.previous, oldPair.previous), "post-abort compatibility changed generation/pair");
    const completed = await repo.commitPrepared(before, await prepare(), () => ({ kind: "publish", frameFields: F.frame({ kind: 3 }) }));
    check(completed.stored === true && completed.durable === true, "fresh conversion did not complete");
    const convertedPair = await raw();
    // Check this before any unseal: an omitted publish must fail behaviorally on the exact raw predecessor.
    check(convertedPair.version === 2 && convertedPair.active.format === 2 && same(convertedPair.previous, oldPair.active), "conversion did not publish exact legacy active as previous");
    const checkConverted = value => {
      check(same(value.body, body) && bytes({ collections: value.body.collections, metadata: value.body.retainedMetadata }) === expectedGeneration, "conversion changed actual T2 body/unknown/history");
      check(same(value.frame, F.frame({ kind: 3 })) && value.unproven === true && value.frame.state === 18 && value.frame.checkpointRef === null, "conversion inferred allowance/checkpoint/permission");
      check(same(value.active, convertedPair.active) && same(value.previous, convertedPair.previous), "converted reopen changed complete pair");
    };
    checkConverted(await repo.load()); repo.close(); repo = await F.openFrameRepository(args); checkConverted(await repo.load());
    check(legacyRequests.length > 0 && legacyRequests.every(request => same(request, { namespace: name, format: 1 })), "legacy key contract invented an epoch");
    await refusal(() => F.openRepository(legacyArgs), 18, "DATABASE_OPEN_FAILED", "old version1 reopen");
    check(same(await raw(), convertedPair), "old version1 refusal changed database2");

    const missing = await raw(store => store.delete("active"));
    check(missing.active === undefined && same(missing.previous, convertedPair.previous), "missing-active cut not established");
    try {
      for (const options of [{}, { compatibility: true }]) await refusal(() => repo.load(options), 18, "FRAME_STORE_MISSING", "missing active never falls back");
      check(same(await raw(), missing), "missing active load silently rewrote/reseeded");
    } finally { await raw(store => { store.put(convertedPair.active, "active"); store.put(convertedPair.previous, "previous"); }); }
    repo.close(); repo = await F.openFrameRepository(args); checkConverted(await repo.load());
    check(same(cut.puts, ["previous", "active"]), "interrupted conversion did not queue both complete records");
    return { upgradeAborts: cut.upgradeAborts, conversionAborts: cut.aborts, requestSuccessBeforeAbort: cut.requestSucceeded, consumedCapability: true,
      versionBefore: oldPair.version, versionAfter: convertedPair.version, missingActiveRefusals: 2, exactPrevious: true, t2Ops: count, unproven: true };
  } finally { cut.upgradeArmed = false; cut.conversionArmed = false; legacy?.close(); repo?.close(); }
}
