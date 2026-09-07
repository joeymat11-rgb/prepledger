// Actual-browser mechanics only. Deterministic per-realm draws are test inputs,
// not a production RNG, nonce uniqueness argument or per-key security budget.
async function installRealm({ inputs, prefix, sharedKeys }) {
  const F = await import(inputs.bundle || "/frame.js");
  const check = (condition, label) => { if (!condition) throw new Error(`FRAME-NONCE ASSERT ${label}`); };
  const bytes = value => JSON.stringify(value, (_key, v) => v instanceof ArrayBuffer ? { buffer: [...new Uint8Array(v)] } : v instanceof Uint8Array ? { bytes: [...v] } : v);
  const same = (a, b) => bytes(a) === bytes(b);
  const native = globalThis.crypto;
  const bodyKey = sharedKeys
    ? await native.subtle.importKey("raw", new Uint8Array(sharedKeys.body), { name: "AES-GCM" }, true, ["encrypt", "decrypt"])
    : await native.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const frameKey = sharedKeys ? new Uint8Array(sharedKeys.frame) : native.getRandomValues(new Uint8Array(32));
  const draws = [], preparations = [], capabilities = new Map();
  let activeLabel = null, encryptedBodies = 0;
  const observedCrypto = {
    getRandomValues(target) {
      check(target instanceof Uint8Array && target.length === 12 && activeLabel !== null, "unexpected RNG call");
      const ordinal = draws.length + 1;
      target.fill(0); target[0] = prefix; new DataView(target.buffer).setUint32(8, ordinal, false);
      draws.push({ prefix, ordinal, label: activeLabel, value: [...target] });
      return target;
    },
    subtle: {
      decrypt: native.subtle.decrypt.bind(native.subtle),
      encrypt(...args) { encryptedBodies++; return native.subtle.encrypt(...args); },
    },
  };
  const cut = { armed: false, published: false, requestSucceeded: false, earlyPublication: false, aborts: 0, completes: 0, puts: [], activeRecord: null };
  const observedIdb = { open(...args) {
    const request = indexedDB.open(...args);
    request.addEventListener("success", () => {
      const db = request.result, transaction = db.transaction.bind(db);
      db.transaction = (...args) => {
        const tx = transaction(...args);
        if (!cut.armed || args[1] !== "readwrite") return tx;
        tx.addEventListener("abort", () => { cut.aborts++; });
        tx.addEventListener("complete", () => { cut.completes++; });
        const store = tx.objectStore("generations"), put = store.put.bind(store), objectStore = tx.objectStore.bind(tx);
        store.put = (value, key) => {
          cut.puts.push(key);
          if (key === "active") cut.activeRecord = structuredClone(value);
          const result = put(value, key);
          if (key === "active") result.addEventListener("success", () => {
            cut.requestSucceeded = true; cut.earlyPublication = cut.published; tx.abort();
          });
          return result;
        };
        tx.objectStore = name => name === "generations" ? store : objectStore(name);
        return tx;
      };
    });
    return request;
  } };
  const args = {
    indexedDB: observedIdb, crypto: observedCrypto, databaseName: "synthetic-frame-nonce-browser", namespace: "synthetic-frame-nonce-browser",
    bodyKeyProvider: () => bodyKey, frameKeyProvider: () => ({ keyEpoch: 1, keyBytes: frameKey, revisionStart: 1 }),
    authorizeEnrollment: () => true, proofValidators: { "batch/1": () => true },
  };
  let repo = await F.openFrameRepository(args);
  const rawPair = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(args.databaseName, 2);
    request.onerror = () => reject(new Error("FRAME-NONCE ASSERT raw open"));
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction("generations", "readonly"), store = tx.objectStore("generations");
      let active, previous;
      store.get("active").onsuccess = event => { active = event.target.result; };
      store.get("previous").onsuccess = event => { previous = event.target.result; };
      tx.oncomplete = () => { db.close(); resolve({ active, previous }); };
      tx.onabort = () => { db.close(); reject(new Error("FRAME-NONCE ASSERT raw read")); };
    };
  });
  function unproven(snapshot) {
    check(snapshot.unproven === true && snapshot.frame.state === 18 && snapshot.frame.guard === 0 && snapshot.frame.checkpointRef === null, "invented permission/checkpoint");
  }
  async function prepare(label, basis, body, batch = null) {
    check(activeLabel === null && !capabilities.has(label), "overlapping/repeated prepare label");
    const first = draws.length, encryptions = encryptedBodies; activeLabel = label;
    let capability;
    try { capability = await repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, batch }); }
    finally { activeLabel = null; }
    const observed = draws.slice(first);
    // Current accepted prepare() draws frame nonce before body IV, then encrypts
    // the body. Match both recorded values to the actual encoded record below.
    check(observed.length === 2 && observed.every(draw => draw.label === label) && encryptedBodies === encryptions + 1, "prepare must draw frame nonce and body IV exactly once");
    check(!same(observed[0].value, observed[1].value), "frame nonce and body IV draw overlap");
    const entry = { label, basis, body, batch, capability, frameDraw: observed[0], bodyDraw: observed[1] };
    preparations.push({ label, prefix, revision: basis ? basis.revision + 1 : 1, frame: observed[0].value, body: observed[1].value });
    capabilities.set(label, entry);
    return entry;
  }
  function recordDraws(record, entry) {
    check(same([...record.frameNonce], entry.frameDraw.value), "stored/attempted frame nonce did not use actual frame draw");
    check(same([...record.body.iv], entry.bodyDraw.value), "stored/attempted body IV did not use actual body draw");
  }
  function fields(entry) {
    const b = entry.batch;
    return b ? F.frame({ kind: 0, U: entry.basis.frame.U + b.count, firstSequence: b.firstSequence, lastSequence: b.lastSequence, batchCount: b.count,
      batchRef: entry.body.proofs.at(-1).digest }) : F.frame();
  }
  const stage = F.Stage.createT2Stage(() => ({ deviceId: "dev-A", athleteId: "ath-1", identityKey: "synthetic-identity", authorityKey: inputs.auth,
    lease: inputs.lease, clock: { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", monotonicMs: () => 0 } }));
  window.frameNonceTest = {
    async seed() {
      const body = { format: 2, collections: inputs.generation.collections, retainedMetadata: inputs.generation.metadata, proofs: [] };
      const entry = await prepare("seed", null, body);
      const result = await repo.commitPrepared(null, entry.capability, () => ({ kind: "publish", frameFields: fields(entry) }), { enrollmentEvidence: "synthetic-only" });
      const after = await repo.load(); unproven(after); recordDraws(after.active, entry);
      check(result.durable === true && after.revision === 1 && after.frame.U === 0 && same(after.body, body), "seed completion");
    },
    async stage(label, load) {
      const basis = await repo.load(); unproven(basis);
      const candidate = stage({ collections: basis.body.collections, metadata: basis.body.retainedMetadata }, "logSession", {
        sets: [{ exercise: "squat", reps: 5, load }, { exercise: "squat", reps: 5, load }],
      });
      check(candidate.result.acknowledged === true && candidate.commit.batch.count === 3, "actual three-operation T2 batch");
      const batch = candidate.commit.batch, proof = F.makeProof("batch", 1, new TextEncoder().encode(JSON.stringify(batch)));
      const body = { format: 2, collections: candidate.generation.collections, retainedMetadata: candidate.generation.metadata, proofs: basis.body.proofs.concat(proof) };
      const entry = await prepare(label, basis, body, batch);
      return { revision: basis.revision, token: basis.token, frameDraw: entry.frameDraw.value, bodyDraw: entry.bodyDraw.value };
    },
    async commit(label, abortAfterRequestSuccess = false) {
      const entry = capabilities.get(label); check(!!entry, "unknown prepared attempt");
      const before = await rawPair(), drawCount = draws.length; let outcome, error;
      if (abortAfterRequestSuccess) Object.assign(cut, { armed: true, published: false, requestSucceeded: false, earlyPublication: false, aborts: 0, completes: 0, puts: [], activeRecord: null });
      try { outcome = await repo.commitPrepared(entry.basis, entry.capability, () => ({ kind: "publish", frameFields: fields(entry) })); cut.published = true; }
      catch (caught) { error = { code: caught.code, state: caught.state, retryable: caught.retryable === true }; }
      finally { cut.armed = false; }
      check(draws.length === drawCount, "commit allocated additional nonce draws");
      if (abortAfterRequestSuccess) {
        check(error?.state === 3 && !outcome && cut.requestSucceeded && !cut.earlyPublication && cut.aborts === 1 && cut.completes === 0 && same(cut.puts, ["previous", "active"]), "actual request-success abort cut");
        recordDraws(cut.activeRecord, entry);
        check(same(await rawPair(), before), "aborted write changed complete pair");
        const after = await repo.load(); unproven(after);
        check(same(after.body, entry.basis.body) && after.frame.U === entry.basis.frame.U && after.revision === entry.basis.revision, "abort changed body/U/revision");
      }
      if (outcome) {
        const after = await repo.load(); unproven(after); recordDraws(after.active, entry);
        check(outcome.stored === true && outcome.durable === true && after.revision === entry.basis.revision + 1 && same(after.previous, entry.basis.active), "commit must retain exact predecessor");
        check(same(after.body, entry.body) && after.frame.U === entry.basis.frame.U + 3, "commit lost body or complete batch charge");
      }
      return outcome ? { status: "committed", revision: outcome.revision } : { status: "refused", ...error };
    },
    async consumed(label) {
      const entry = capabilities.get(label), before = await rawPair(), drawCount = draws.length; let code;
      try { await repo.commitPrepared(entry.basis, entry.capability, () => ({ kind: "publish", frameFields: fields(entry) })); } catch (error) { code = error.code; }
      check(code === "FRAME_PREPARED_CONSUMED" && draws.length === drawCount && same(await rawPair(), before), "failed capability must be consumed without new draw/effect");
      return true;
    },
    async pair() { return bytes(await rawPair()); },
    async audit(expectedU, expectedRevision) {
      const after = await repo.load(); unproven(after);
      check(after.frame.U === expectedU && after.revision === expectedRevision && Object.keys(after.body.collections.ops).length === expectedU && Object.keys(after.body.collections.outbox).length === expectedU, "complete actual T2 history/outbox/U");
      return { pair: bytes(await rawPair()), revision: after.revision, U: after.frame.U };
    },
    async reopen() {
      const before = await rawPair(), drawCount = draws.length; repo.close(); repo = await F.openFrameRepository(args);
      const after = await repo.load(); unproven(after);
      check(same({ active: after.active, previous: after.previous }, before) && draws.length === drawCount, "repository reopen changed pair or allocated nonce");
    },
    async missingRng() {
      const before = await rawPair(), drawCount = draws.length;
      const noRng = await F.openFrameRepository({ ...args, crypto: { subtle: observedCrypto.subtle } }); let state, code;
      try {
        const basis = await noRng.load(); unproven(basis);
        try { await noRng.prepare(basis, basis.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }); } catch (error) { state = error.state; code = error.code; }
      } finally { noRng.close(); }
      check(state === 3 && code === "FRAME_RANDOMNESS_UNAVAILABLE" && draws.length === drawCount && same(await rawPair(), before), "missing RNG must refuse before durable effect");
      return true;
    },
    records() { return structuredClone({ prefix, draws, preparations, encryptedBodies }); },
    close() { repo.close(); },
  };
  return sharedKeys || { body: [...new Uint8Array(await native.subtle.exportKey("raw", bodyKey))], frame: [...frameKey] };
}

export async function runFrameNonceBrowser({ browser, origin, inputs }) {
  const check = (condition, label) => { if (!condition) throw new Error(`FRAME-NONCE ASSERT ${label}`); };
  const context = await browser.newContext();
  const call = (page, name, ...args) => page.evaluate(({ name, args }) => window.frameNonceTest[name](...args), { name, args });
  try {
    await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const pages = [await context.newPage(), await context.newPage()];
    await Promise.all(pages.map(page => page.goto(origin)));
    const sharedKeys = await pages[0].evaluate(installRealm, { inputs, prefix: 1 });
    await call(pages[0], "seed");
    await pages[1].evaluate(installRealm, { inputs, prefix: 2, sharedKeys });
    const labels = ["race-A", "race-B"];
    const prepared = await Promise.all(pages.map((page, index) => call(page, "stage", labels[index], 100 + index)));
    check(prepared[0].revision === 1 && prepared[1].revision === 1 && prepared[0].token === prepared[1].token, "race must start at exact same stored pair");
    const results = await Promise.all(pages.map((page, index) => call(page, "commit", labels[index])));
    const winner = results.findIndex(result => result.status === "committed"), loser = winner === 0 ? 1 : 0;
    check(winner >= 0 && results.filter(result => result.status === "committed").length === 1 && results[loser].code === "STALE_REVISION" && results[loser].retryable, "exactly one CAS winner and stale loser");
    const audits = await Promise.all(pages.map(page => call(page, "audit", 3, 2)));
    check(audits[0].pair === audits[1].pair, "CAS loser changed winning complete pair");
    await call(pages[loser], "consumed", labels[loser]);
    const records = await Promise.all(pages.map(page => call(page, "records")));
    await call(pages[loser], "close");
    await pages[loser].reload(); // Drops capabilities and JS state; retained browser IndexedDB remains.
    await pages[loser].evaluate(installRealm, { inputs, prefix: 3, sharedKeys });
    const afterReload = await call(pages[loser], "audit", 3, 2);
    check(afterReload.pair === audits[winner].pair, "fresh realm lost winning pair");
    await call(pages[loser], "stage", "reload-retry", 102);
    check((await call(pages[loser], "commit", "reload-retry")).status === "committed", "fresh restaged retry failed");
    await call(pages[loser], "audit", 6, 3);
    const abortAttempt = await call(pages[loser], "stage", "abort", 103);
    const aborted = await call(pages[loser], "commit", "abort", true);
    check(aborted.status === "refused" && aborted.state === 3, "deliberate transaction abort did not refuse");
    await call(pages[loser], "consumed", "abort");
    await call(pages[loser], "reopen");
    const retried = await call(pages[loser], "stage", "after-reopen", 104);
    check(retried.revision === abortAttempt.revision && JSON.stringify(retried.frameDraw) !== JSON.stringify(abortAttempt.frameDraw), "abort/reopen retry must draw again without revision advancement");
    check((await call(pages[loser], "commit", "after-reopen")).status === "committed", "post-reopen fresh attempt failed");
    await call(pages[loser], "missingRng");
    const final = await call(pages[loser], "audit", 9, 4);
    check((await call(pages[winner], "audit", 9, 4)).pair === final.pair, "both pages must read the complete final pair");
    records.push(await call(pages[loser], "records"));
    const attempts = records.flatMap(record => record.preparations), draws = records.flatMap(record => record.draws);
    check(attempts.length === 6 && draws.length === 12 && records.reduce((n, record) => n + record.encryptedBodies, 0) === 6, "exact frame/body preparation inventory");
    check(new Set(draws.map(draw => JSON.stringify(draw.value))).size === 12, "observed fixture draw collision");
    check(attempts.every(attempt => draws.some(draw => draw.prefix === attempt.prefix && draw.label === attempt.label && JSON.stringify(draw.value) === JSON.stringify(attempt.frame)) && draws.some(draw => draw.prefix === attempt.prefix && draw.label === attempt.label && JSON.stringify(draw.value) === JSON.stringify(attempt.body))), "frame/body attempt not backed by observed draws");
    return { pages: 2, realms: 3, frameAttempts: 6, frameNonceDraws: 6, bodyIvDraws: 6, staleCasRefusals: 1, consumedCapabilityRefusals: 2,
      requestSuccessAborts: 1, freshRealmRetries: 1, repositoryReopens: 1, missingRngRefusals: 1, finalRevision: final.revision, finalU: final.U, unproven: true };
  } finally { await context.close(); }
}
