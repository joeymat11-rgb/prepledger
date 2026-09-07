import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { openFrameRepository, makeProof } from "../frame-repository.mjs";
import { recordBytes, REVISION_WINDOW } from "../frame-format.mjs";
import { openRepository } from "../repository.mjs";
import { frame } from "./frame-support.mjs";
import { initial, config, faultDatabase, deferred } from "./support.mjs";
import Stage from "../t2-stage.cjs";
import { readFileSync, writeFileSync, cpSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname, join, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const bytes = x => new TextEncoder().encode(JSON.stringify(x));
async function fixture(options = {}) {
  const bodyKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]), frameKey = crypto.getRandomValues(new Uint8Array(32));
  const indexedDB = options.indexedDB || new IDBFactory(), args = { indexedDB, databaseName: "synthetic-frame", namespace: "ath-1/dev-A/synthetic-frame", crypto,
    bodyKeyProvider: async () => bodyKey, frameKeyProvider: async ({ keyEpoch }) => ({ keyEpoch, keyBytes: frameKey, revisionStart: 1 }), authorizeEnrollment: () => true,
    proofValidators: { "batch/1": () => true }, ...options };
  const repo = await (options.factory || openFrameRepository)(args), generation = initial(), body = { format: 2, collections: generation.collections, retainedMetadata: generation.metadata, proofs: [] };
  await repo.commitPrepared(null, await repo.prepare(null, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), () => ({ kind: "publish", frameFields: frame() }), { enrollmentEvidence: "synthetic-only" });
  return { repo, args, body, bodyKey, frameKey, indexedDB };
}
async function staged(f, patch = {}) {
  const basis = await f.repo.load(), candidate = Stage.createT2Stage(config)({ collections: basis.body.collections, metadata: basis.body.retainedMetadata }, "logSession", { sets: [{ exercise: "squat", reps: 5, load: 100 }, { exercise: "squat", reps: 5, load: 100 }] });
  assert.equal(candidate.result.acknowledged, true);
  const batch = candidate.commit.batch, proof = makeProof("batch", 1, bytes(batch));
  const body = { format: 2, collections: candidate.generation.collections, retainedMetadata: candidate.generation.metadata, proofs: basis.body.proofs.concat(proof) };
  const capability = await f.repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, batch });
  const fields = frame({ kind: 0, U: basis.frame.U + batch.count, firstSequence: batch.firstSequence, lastSequence: batch.lastSequence, batchCount: batch.count, batchRef: proof.digest, ...patch });
  return { basis, capability, body, batch, fields };
}
function mutate(f, callback) {
  return new Promise((resolve, reject) => {
    const request = f.indexedDB.open(f.args.databaseName, 2);
    request.onsuccess = () => { const db = request.result, tx = db.transaction("generations", "readwrite"), store = tx.objectStore("generations"); callback(store); tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = () => { db.close(); reject(tx.error); }; };
    request.onerror = () => reject(request.error);
  });
}
test("mechanical frame samples genuinely later evidence after body encryption; exact actual T2 batch reopens", async () => {
  const f = await fixture(), c = await staged(f); let W = 1; W = 1234;
  const saved = await f.repo.commitPrepared(c.basis, c.capability, ctx => { assert.equal(ctx.batch.count, c.batch.count); assert(Object.isFrozen(ctx.batch)); return { kind: "publish", frameFields: { ...c.fields, H: W, W_last: W } }; });
  assert.equal(saved.durable, true); f.repo.close(); const reopened = await openFrameRepository(f.args), result = await reopened.load();
  assert.equal(JSON.stringify(result.body), JSON.stringify(c.body)); assert.equal(result.frame.H, 1234); assert.equal(result.frame.W_last, 1234); assert.equal(result.frame.U, c.batch.count); assert.equal(result.unproven, true, "synthetic mechanics did not establish a production checkpoint"); reopened.close();
});
test("control refusal preserves exact prior body and U, never staged operation body; unknown new proof refuses", async () => {
  const f = await fixture(), c = await staged(f);
  const saved = await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "control", state: 20, code: "SYNTHETIC_ROLLBACK", frameFields: frame({ state: 20, allowanceInvalidated: 1 }) }));
  assert.equal(saved.kind, "control"); const after = await f.repo.load(); assert.deepEqual(after.active.body, c.basis.active.body); assert.deepEqual(after.body.collections, c.basis.body.collections); assert.equal(after.frame.U, 0);
  const d = await staged(f); await assert.rejects(f.repo.commitPrepared(d.basis, d.capability, () => ({ kind: "control", state: 20, code: "SYNTHETIC", frameFields: frame({ state: 20, guardRef: "aa".repeat(32) }) })), e => e.state === 18);
  assert.deepEqual(await f.repo.load(), after); f.repo.close();
});
test("every retained previous field and coherent older predecessor substitution refuse18", async () => {
  const f = await fixture(), c = await staged(f); await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields }));
  const stable = await f.repo.load(), mutations = [r => r.namespace += "x", r => r.commitRevision++, r => r.frameKeyEpoch++, r => r.frameNonce[0]++, r => r.frameCiphertext[0]++, r => r.previousRecordDigest[0]++, r => r.body.keyEpoch++, r => r.body.aadRevision++, r => r.body.iv[0]++, r => new Uint8Array(r.body.ciphertext)[0]++];
  for (const change of mutations) { const previous = structuredClone(stable.previous); change(previous); await mutate(f, s => s.put(previous, "previous")); await assert.rejects(f.repo.load(), e => e.state === 18); await mutate(f, s => s.put(stable.previous, "previous")); }
  const d = await staged(f); await f.repo.commitPrepared(d.basis, d.capability, () => ({ kind: "publish", frameFields: d.fields })); const latest = await f.repo.load();
  await mutate(f, s => s.put(stable.previous, "previous")); await assert.rejects(f.repo.load(), e => e.state === 18);
  await mutate(f, s => { s.put(latest.active, "active"); s.put(latest.previous, "previous"); }); assert.equal((await f.repo.load()).revision, 3, "previous verifies with its stored parent without needing a third generation");
  await mutate(f, s => { s.put(stable.active, "active"); s.put(stable.previous, "previous"); }); assert.deepEqual((await f.repo.load()).body, stable.body, "coherent old pair remains accepted restore residual"); f.repo.close();
});
test("independent writers reject stale pair and repeat from fresh state without partial rows", async () => {
  const f = await fixture(), other = await openFrameRepository(f.args), a = await staged(f), b = await staged({ ...f, repo: other });
  const results = await Promise.allSettled([f.repo.commitPrepared(a.basis, a.capability, () => ({ kind: "publish", frameFields: a.fields })), other.commitPrepared(b.basis, b.capability, () => ({ kind: "publish", frameFields: b.fields }))]);
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1); assert.equal(results.find(r => r.status === "rejected").reason.retryable, true);
  const retry = await staged({ ...f, repo: other }); await other.commitPrepared(retry.basis, retry.capability, () => ({ kind: "publish", frameFields: retry.fields })); assert.equal((await f.repo.load()).frame.U, a.batch.count + retry.batch.count); f.repo.close(); other.close();
});
test("delayed real transaction has no success before complete; abort preserves complete pair and burns attempt", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }), c = await staged(f); faults.state.armed = true; faults.state.mode = "delay";
  let done = false; const pending = f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields })).then(x => { done = true; return x; });
  await faults.state.write.promise; assert.equal(done, false); faults.state.tx.abort(); faults.state.release = true;
  await assert.rejects(pending); faults.state.armed = false; assert.deepEqual(await f.repo.load(), c.basis);
  await assert.rejects(f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields })), e => e.code === "FRAME_PREPARED_CONSUMED"); f.repo.close();
});
test("final-cut partial charge, new epoch knowledge and asynchronous decision never publish", async () => {
  const f = await fixture();
  for (const kind of ["charge", "epoch", "async"]) {
    const c = await staged(f);
    await assert.rejects(f.repo.commitPrepared(c.basis, c.capability, () => kind === "charge" ? { kind: "publish", frameFields: { ...c.fields, U: 1 } } : kind === "epoch" ? { kind: "abort", state: 18, code: "SYNTHETIC_EPOCH_CHANGED", retryable: false } : Promise.resolve({ kind: "publish", frameFields: c.fields })));
    assert.deepEqual(await f.repo.load(), c.basis);
  } f.repo.close();
});
test("unknown proof validators and discarded active store never become first use", async () => {
  const f = await fixture(), basis = await f.repo.load(), body = structuredClone(basis.body); body.proofs.push(makeProof("checkpoint", 1, bytes({ synthetic: true })));
  await assert.rejects(f.repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), e => e.code === "FRAME_PROOF_VALIDATOR_UNAVAILABLE");
  const c = await staged(f); await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields })); await mutate(f, s => s.delete("active")); await assert.rejects(f.repo.load(), e => e.state === 18); f.repo.close();
});
test("caller mutation of loaded decoded basis cannot authorize a partial charge or alter prior-body controls", async () => {
  const f = await fixture(), c = await staged(f); await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields }));
  const basis = await f.repo.load(), original = structuredClone(basis); basis.frame.U = 0; basis.body.retainedMetadata.changed = "caller";
  const prepared = await f.repo.prepare(basis, original.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
  await assert.rejects(f.repo.commitPrepared(basis, prepared, () => ({ kind: "control", state: 20, code: "SYNTHETIC", frameFields: frame({ state: 20, U: 0 }) })), e => e.state === 18);
  assert.deepEqual(await f.repo.load(), original); await assert.rejects(f.repo.prepare(structuredClone(original), original.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), e => e.code === "FRAME_EXPECTED_INVALID"); f.repo.close();
});
test("explicit synthetic v1 conversion retains exact legacy predecessor and no inferred checkpoint", async () => {
  const indexedDB = new IDBFactory(), key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]), frameKey = crypto.getRandomValues(new Uint8Array(32));
  const common = { indexedDB, databaseName: "synthetic-v1", namespace: "synthetic-v1", crypto };
  const v1 = await openRepository({ ...common, keyProvider: async () => key, authorizeEnrollment: () => true }); const generation = initial(); await v1.initialize(generation, {}); v1.close();
  const f = await openFrameRepository({ ...common, bodyKeyProvider: async () => key, legacyKeyProvider: async () => key, frameKeyProvider: async () => ({ keyEpoch: 1, keyBytes: frameKey, revisionStart: 1 }) });
  await assert.rejects(f.load(), e => e.code === "FRAME_V1_CONVERSION_REQUIRED"); const before = await f.load({ compatibility: true }), body = { format: 2, collections: before.legacy.collections, retainedMetadata: before.legacy.metadata, proofs: [] };
  const cap = await f.prepare(before, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, compatibility: true }); await f.commitPrepared(before, cap, () => ({ kind: "publish", frameFields: frame({ kind: 3 }) }));
  const after = await f.load(); assert.equal(after.previous.format, 1); assert.deepEqual(after.body.collections, generation.collections); assert.equal(after.unproven, true); assert.equal(after.frame.state, 18);
  await assert.rejects(openRepository({ ...common, keyProvider: async () => key }), e => e.state === 18); f.close();
});
test("control persistence quota failure preserves known20 in-process but does not pretend its knowledge became durable", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }), basis = await f.repo.load();
  const cap = await f.repo.prepare(basis, basis.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }); faults.state.armed = true; faults.state.mode = "quota";
  await assert.rejects(f.repo.commitPrepared(basis, cap, () => ({ kind: "control", state: 20, code: "SYNTHETIC_ROLLBACK", frameFields: frame({ state: 20, allowanceInvalidated: 1 }) })), e => e.state === 20 && e.storageState === 3 && e.durable === false);
  faults.state.armed = false; assert.deepEqual(await f.repo.load(), basis); f.repo.close(); const reopened = await openFrameRepository(f.args); assert.equal((await reopened.load()).frame.state, 18, "no production fence or knowledge persistence was proved"); reopened.close();
});
test("durable invalidation and high-water cannot be cleared or moved backward by a later mechanical frame", async () => {
  const f = await fixture(), basis = await f.repo.load(), cap = await f.repo.prepare(basis, basis.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
  await f.repo.commitPrepared(basis, cap, () => ({ kind: "control", state: 20, code: "SYNTHETIC", frameFields: frame({ state: 20, allowanceInvalidated: 1, H: 123, W_last: 123 }) }));
  const after = await f.repo.load();
  for (const patch of [{ allowanceInvalidated: 0 }, { H: 122 }, { W_last: 122 }]) {
    const next = await f.repo.prepare(after, after.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
    await assert.rejects(f.repo.commitPrepared(after, next, () => ({ kind: "control", state: 20, code: "SYNTHETIC", frameFields: { ...after.frame, ...patch } })), e => e.code === "FRAME_EVIDENCE_ROLLBACK"); assert.deepEqual(await f.repo.load(), after);
  } f.repo.close();
});
test("same-revision predecessor mutation after prepare is caught inside the transaction, not only on load", async () => {
  const f = await fixture(), a = await staged(f); await f.repo.commitPrepared(a.basis, a.capability, () => ({ kind: "publish", frameFields: a.fields }));
  const b = await staged(f), tampered = structuredClone(b.basis.previous); tampered.frameNonce[0] ^= 1; await mutate(f, s => s.put(tampered, "previous"));
  await assert.rejects(f.repo.commitPrepared(b.basis, b.capability, () => ({ kind: "publish", frameFields: b.fields })), e => e.code === "FRAME_HEAD_CHANGED_WITHOUT_REVISION");
  await mutate(f, s => s.put(b.basis.previous, "previous")); assert.deepEqual(await f.repo.load(), b.basis); f.repo.close();
});

// These cuts occur after prepare, without an intervening load. Valid shapes must
// reach the commit-time pair comparison, rather than pass by failing the parser.
const casFields = [
  ["namespace", r => { r.namespace += "/changed"; }],
  ["commitRevision", r => { r.commitRevision++; }],
  ["frameKeyEpoch", r => { r.frameKeyEpoch++; }],
  ["frameNonce", r => { r.frameNonce[0] ^= 1; }],
  ["frameCiphertext", r => { r.frameCiphertext[0] ^= 1; }],
  ["previousRecordDigest", r => { r.previousRecordDigest[0] ^= 1; }],
  ["body.keyEpoch", r => { r.body.keyEpoch++; }],
  ["body.aadRevision", r => { r.body.aadRevision--; }],
  ["body.iv", r => { r.body.iv[0] ^= 1; }],
  ["body.ciphertext", r => { new Uint8Array(r.body.ciphertext)[0] ^= 1; }],
];
const casCases = ["active", "previous"].flatMap(slot => [
  ...casFields.map(([field, change]) => ({ slot, field, change, structural: false })),
  ...[["format", r => { r.format = 3; }], ["body.format", r => { r.body.format = 3; }]]
    .map(([field, change]) => ({ slot, field, change, structural: true })),
]).concat([
  { slot: "previous", field: "presence-removed", structural: false, changePair: pair => { pair.previous = undefined; } },
  { slot: "previous", field: "presence-inserted", structural: false, prime: 0, changePair: pair => { pair.previous = structuredClone(pair.active); } },
  { slot: "previous", field: "coherent-older-record", structural: false, olderPrevious: true, changePair: (pair, older) => { pair.previous = structuredClone(older); } },
]);
function observedDatabase() {
  const inner = new IDBFactory(), state = { armed: false, transactions: 0, writes: 0, complete: 0, abort: 0 };
  const indexedDB = { open(...args) {
    const request = inner.open(...args);
    request.addEventListener("success", () => {
      const db = request.result, transaction = db.transaction.bind(db);
      db.transaction = (...txArgs) => {
        const tx = transaction(...txArgs);
        if (!state.armed || txArgs[1] !== "readwrite") return tx;
        state.transactions++;
        tx.addEventListener("complete", () => { state.complete++; });
        tx.addEventListener("abort", () => { state.abort++; });
        const objectStore = tx.objectStore.bind(tx), store = objectStore("generations");
        for (const method of ["put", "add", "delete", "clear"]) {
          const original = store[method].bind(store);
          store[method] = (...values) => { state.writes++; return original(...values); };
        }
        tx.objectStore = name => name === "generations" ? store : objectStore(name);
        return tx;
      };
    });
    return request;
  } };
  return { inner, indexedDB, state };
}
function readStoredPair(indexedDB, databaseName) {
  return new Promise((resolvePair, reject) => {
    const request = indexedDB.open(databaseName, 2);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction("generations", "readonly"), store = tx.objectStore("generations");
      const active = store.get("active"), previous = store.get("previous");
      tx.oncomplete = () => { db.close(); resolvePair({ active: active.result, previous: previous.result }); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
    request.onerror = () => reject(request.error);
  });
}
async function observeCasCut(row, factory = openFrameRepository) {
  const observed = observedDatabase(), f = await fixture({ indexedDB: observed.indexedDB, factory });
  try {
    const older = row.olderPrevious ? (await f.repo.load()).active : undefined;
    // Both generations contain actual T2 operations and outbox entries. Their
    // body AAD revisions exceed one, so changing either downward is well formed.
    // The absent-to-present marker cut deliberately starts from generation one.
    for (let n = 0; n < (row.prime ?? 2); n++) {
      const c = await staged(f);
      assert(Object.keys(c.body.collections.ops).length > 0);
      assert(Object.keys(c.body.collections.outbox).length > 0);
      await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields }));
    }
    const c = await staged(f), original = { active: c.basis.active, previous: c.basis.previous }, injected = structuredClone(original);
    if (!row.changePair) assert(c.basis.active.body.aadRevision > 1 && c.basis.previous.body.aadRevision > 1);
    if (row.olderPrevious) {
      assert(older.commitRevision < original.previous.commitRevision, "substitution uses a genuine older complete generation");
      assert.notDeepEqual(recordBytes(older), recordBytes(original.previous));
    }
    if (row.changePair) row.changePair(injected, older); else row.change(injected[row.slot]);
    const shape = () => { recordBytes(injected.active); if (injected.previous !== undefined) recordBytes(injected.previous); };
    if (row.structural) assert.throws(shape, e => e.state === 18);
    else assert.doesNotThrow(shape, `${row.slot}.${row.field} must be structurally valid`);
    assert.notDeepEqual(injected, original, "each cut must change the stored pair");
    if (!row.structural && !row.changePair) assert.notDeepEqual(recordBytes(original[row.slot]), recordBytes(injected[row.slot]));
    await mutate(f, store => injected[row.slot] === undefined ? store.delete(row.slot) : store.put(injected[row.slot], row.slot));
    assert.deepEqual(await readStoredPair(observed.inner, f.args.databaseName), injected);
    let finalizers = 0, result, error;
    observed.state.armed = true;
    try {
      result = await f.repo.commitPrepared(c.basis, c.capability, () => { finalizers++; return { kind: "publish", frameFields: c.fields }; });
    } catch (caught) { error = caught; }
    observed.state.armed = false;
    return { f, observed, c, original, injected, finalizers, result, error };
  } catch (error) { observed.state.armed = false; f.repo.close(); throw error; }
}
function assertCasRefused(cut, row) {
  const label = `${row.slot}.${row.field}`, stale = row.slot === "active" && row.field === "commitRevision";
  assert.equal(cut.result, undefined, `${label}: no successful publication`);
  assert(cut.error, `${label}: commit must refuse`);
  assert.equal(cut.error.state, stale ? 3 : 18, `${label}: exact refusal state`);
  if (!row.structural) assert.equal(cut.error.code, stale ? "STALE_REVISION" : "FRAME_HEAD_CHANGED_WITHOUT_REVISION", `${label}: actual CAS discrimination`);
  assert.equal(cut.error.retryable, stale, `${label}: only changed active revision is retryable`);
  assert.equal(cut.finalizers, 0, `${label}: finalizer must not run`);
  assert.deepEqual(cut.observed.state, { armed: false, transactions: 1, writes: 0, complete: 0, abort: 1 }, `${label}: no repository record writes or successful transaction`);
}
async function runCasCase(row, factory = openFrameRepository) {
  const cut = await observeCasCut(row, factory), { f, observed, c } = cut;
  try {
    assertCasRefused(cut, row);
    assert.deepEqual(await readStoredPair(observed.inner, f.args.databaseName), cut.injected, "refusal preserves the complete injected pair");
    await mutate(f, store => { store.put(cut.original.active, "active"); if (cut.original.previous === undefined) store.delete("previous"); else store.put(cut.original.previous, "previous"); });
    const restored = await readStoredPair(observed.inner, f.args.databaseName);
    assert.deepEqual(restored, cut.original);
    for (const slot of ["active", "previous"]) {
      if (cut.original[slot] === undefined) assert.equal(restored[slot], undefined, `${slot}: exact absent marker restoration`);
      else assert.deepEqual(recordBytes(restored[slot]), recordBytes(cut.original[slot]), `${slot}: byte-exact restoration`);
    }
    assert.deepEqual(await f.repo.load(), c.basis);
    observed.state.armed = true;
    await assert.rejects(f.repo.commitPrepared(c.basis, c.capability, () => { assert.fail("consumed capability reached finalizer"); }), e => e.code === "FRAME_PREPARED_CONSUMED" && e.state === 3);
    observed.state.armed = false;
    assert.deepEqual(observed.state, { armed: false, transactions: 1, writes: 0, complete: 0, abort: 1 }, "consumed attempt cannot start another transaction after pair restoration");
    const fresh = await staged(f), saved = await f.repo.commitPrepared(fresh.basis, fresh.capability, () => ({ kind: "publish", frameFields: fresh.fields }));
    assert.equal(saved.durable, true); assert.equal(saved.revision, c.basis.revision + 1);
    const after = await f.repo.load();
    assert.deepEqual(after.previous, cut.original.active);
    assert.equal(JSON.stringify(after.body), JSON.stringify(fresh.body), "complete stored JSON preserves actual T2 values; serializer need not preserve internal dictionary prototypes");
    assert.equal(after.frame.U, c.basis.frame.U + fresh.batch.count);
    assert.equal(after.unproven, true); assert.equal(after.frame.state, 18); assert.equal(after.frame.checkpointRef, null);
  } finally { observed.state.armed = false; f.repo.close(); }
}
test("full-pair CAS: all ten active/previous fields, absent markers, older predecessor, distinct retry3, and fixed-format structural refusals", async t => {
  assert.equal(casCases.filter(row => !row.structural).length, 23);
  assert.equal(casCases.filter(row => row.structural).length, 4);
  for (const row of casCases) await t.test(`${row.slot}.${row.field} (${row.structural ? "structural" : "CAS"})`, () => runCasCase(row));
});
test("full-pair CAS: effective comparison omission fails behavior; byte-restored copy passes the complete matrix", async () => {
  const here = resolve(dirname(fileURLToPath(import.meta.url)), ".."), path = join(here, "frame-repository.mjs"), original = readFileSync(path);
  const sha = value => createHash("sha256").update(value).digest("hex"), originalSha = sha(original);
  const needle = 'if (pairToken(active, previous) !== p.basis.token) fail("FRAME_HEAD_CHANGED_WITHOUT_REVISION");';
  assert.equal(original.toString("utf8").split(needle).length, 2);
  const scratch = mkdtempSync(join(here, ".tmp/frame-cas-mutant-"));
  assert(resolve(scratch).startsWith(resolve(here, ".tmp") + sep), "disposable directory must remain inside this worktree");
  try {
    for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(scratch, file));
    const copy = join(scratch, "frame-repository.mjs");
    writeFileSync(copy, original.toString("utf8").replace(needle, ""));
    const changed = await import(pathToFileURL(copy).href + "?cas-omitted"), row = casCases.find(item => item.slot === "previous" && item.field === "frameNonce");
    const cut = await observeCasCut(row, changed.openFrameRepository);
    try {
      assert.throws(() => assertCasRefused(cut, row), e => e.code === "ERR_ASSERTION" && e.message.includes("no successful publication"), "the same new contract must go RED on the effective omission");
      assert.equal(cut.error, undefined); assert.equal(cut.result.durable, true); assert.equal(cut.finalizers, 1);
      assert.deepEqual(cut.observed.state, { armed: false, transactions: 1, writes: 2, complete: 1, abort: 0 });
      const wrong = await cut.f.repo.load();
      assert.equal(JSON.stringify(wrong.body), JSON.stringify(cut.c.body)); assert.deepEqual(wrong.previous, cut.original.active);
      console.log("W6 FRAME CAS BITE RED — previous.frameNonce comparison omission permitted actual durable publication");
    } finally { cut.f.repo.close(); }
    writeFileSync(copy, original);
    assert.deepEqual(readFileSync(copy), original); assert.equal(sha(readFileSync(copy)), originalSha);
    const restored = await import(pathToFileURL(copy).href + "?cas-restored");
    for (const row of casCases) await runCasCase(row, restored.openFrameRepository);
    console.log(`W6 FRAME CAS RESTORED — 20 shape-valid field cuts + 2 absent-marker cuts + 1 older predecessor + 4 structural cuts; source SHA256 ${originalSha}`);
  } finally {
    assert(resolve(scratch).startsWith(resolve(here, ".tmp") + sep));
    rmSync(scratch, { recursive: true, force: true });
    assert.deepEqual(readFileSync(path), original); assert.equal(sha(readFileSync(path)), originalSha);
  }
});
test("missing frame/body historical key refuses18 before returning any combined plaintext", async () => {
  const f = await fixture(); f.repo.close();
  for (const keyName of ["frameKeyProvider", "bodyKeyProvider"]) { const repo = await openFrameRepository({ ...f.args, [keyName]: () => { throw new Error("synthetic missing key"); } }); await assert.rejects(repo.load(), e => e.state === 18); repo.close(); }
});
test("effective disposable frame mutations detect partial charging and omitted predecessor comparison", async () => {
  const here = resolve(dirname(fileURLToPath(import.meta.url)), ".."), original = readFileSync(join(here, "frame-repository.mjs"), "utf8");
  for (const [name, needle] of [["partial-charge", "fields.U !== (p.basis?.frame.U || 0) + p.batch.count || "], ["predecessor-compare", "!sameBytes(active.previousRecordDigest, expected) || "]]) {
    assert.equal(original.split(needle).length, 2); const scratch = mkdtempSync(join(here, ".tmp/frame-mutant-"));
    try {
      for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(scratch, file));
      writeFileSync(join(scratch, "frame-repository.mjs"), original.replace(needle, "")); const changed = await import(pathToFileURL(join(scratch, "frame-repository.mjs")));
      const f = await fixture({ factory: changed.openFrameRepository }), a = await staged(f);
      if (name === "partial-charge") {
        await f.repo.commitPrepared(a.basis, a.capability, () => ({ kind: "publish", frameFields: { ...a.fields, U: 1 } })); assert.equal((await f.repo.load()).frame.U, 1); assert.notEqual(a.batch.count, 1);
      } else {
        await f.repo.commitPrepared(a.basis, a.capability, () => ({ kind: "publish", frameFields: a.fields })); const previous = (await f.repo.load()).previous;
        const b = await staged(f); await f.repo.commitPrepared(b.basis, b.capability, () => ({ kind: "publish", frameFields: b.fields })); await mutate(f, s => s.put(previous, "previous")); assert.equal((await f.repo.load()).revision, 3);
      }
      f.repo.close(); writeFileSync(join(scratch, "frame-repository.mjs"), original); assert.equal(readFileSync(join(scratch, "frame-repository.mjs"), "utf8"), original);
      console.log(`W6 FRAME MUTANT DETECTED — ${name}; actual wrong durable result witnessed; copy restored byte-for-byte`);
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  }
  assert.equal(readFileSync(join(here, "frame-repository.mjs"), "utf8"), original);
});
test("publish kind2/kind3 cannot bypass actual T2 batch charging on an existing v2 basis", async () => {
  const f = await fixture();
  for (const kind of [2, 3, 1]) {
    const c = await staged(f), hidden = await f.repo.prepare(c.basis, c.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, batch: null });
    await assert.rejects(f.repo.commitPrepared(c.basis, hidden, () => ({ kind: "publish", frameFields: frame({ kind }) })), e => e.state === 18);
    assert.deepEqual(await f.repo.load(), c.basis);
  } f.repo.close();
});
test("kind1 actual T2 incoming receipt stores remote history without a new local slot or outbox", async () => {
  const f = await fixture(), basis = await f.repo.load(), remote = { op_id: "remote-synthetic", athlete_id: "ath-1", device_id: "dev-B", device_seq: 1, canonical_content_commitment: "synthetic" };
  const candidate = Stage.createT2Stage(config, { allowInbound: true })({ collections: basis.body.collections, metadata: basis.body.retainedMetadata }, "@pull", null, { record: [{ seq: 1, op_id: remote.op_id, op: remote }], proof: { synthetic: true } });
  const body = { format: 2, collections: candidate.generation.collections, retainedMetadata: candidate.generation.metadata, proofs: [] }, cap = await f.repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
  await f.repo.commitPrepared(basis, cap, () => ({ kind: "publish", frameFields: frame({ kind: 1 }) })); const after = await f.repo.load(); assert.equal(after.frame.U, 0); assert.deepEqual(after.body.collections.ops[remote.op_id], remote); f.repo.close();
});
test("null/primitive/malformed predecessor is typed18 on read and at same-revision CAS", async () => {
  const f = await fixture(), a = await staged(f); await f.repo.commitPrepared(a.basis, a.capability, () => ({ kind: "publish", frameFields: a.fields })); const stable = await f.repo.load();
  for (const value of [null, 1, "bad", {}, { format: 2 }]) {
    const b = await staged(f); await mutate(f, s => s.put(value, "previous")); await assert.rejects(f.repo.load(), e => e.state === 18);
    await assert.rejects(f.repo.commitPrepared(b.basis, b.capability, () => ({ kind: "publish", frameFields: b.fields })), e => e.state === 18);
    await mutate(f, s => s.put(stable.previous, "previous"));
  } f.repo.close();
});
test("actual incoming history preserves a nonzero U: no non-batch charge increase or refill", async () => {
  const f = await fixture(), write = await staged(f); await f.repo.commitPrepared(write.basis, write.capability, () => ({ kind: "publish", frameFields: write.fields }));
  const basis = await f.repo.load(); assert(basis.frame.U > 0);
  const remote = { op_id: "remote-nonzero", athlete_id: "ath-1", device_id: "dev-B", device_seq: 1, canonical_content_commitment: "synthetic" };
  const incoming = Stage.createT2Stage(config, { allowInbound: true })({ collections: basis.body.collections, metadata: basis.body.retainedMetadata }, "@pull", null, { record: [{ seq: 1, op_id: remote.op_id, op: remote }], proof: { synthetic: true } });
  const body = { format: 2, collections: incoming.generation.collections, retainedMetadata: incoming.generation.metadata, proofs: basis.body.proofs };
  for (const U of [basis.frame.U - 1, basis.frame.U + 1]) {
    const cap = await f.repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
    await assert.rejects(f.repo.commitPrepared(basis, cap, () => ({ kind: "publish", frameFields: frame({ kind: 1, U }) })), e => e.code === "FRAME_NONBATCH_CHARGE_CHANGE"); assert.deepEqual(await f.repo.load(), basis);
  }
  const cap = await f.repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }); await f.repo.commitPrepared(basis, cap, () => ({ kind: "publish", frameFields: frame({ kind: 1, U: basis.frame.U }) }));
  const after = await f.repo.load(); assert.equal(after.frame.U, basis.frame.U); assert.deepEqual(after.body.collections.ops[remote.op_id], remote); f.repo.close();
});
test("body crypto failure and time spent in pending encryption cannot publish or preserve an old final sample", async () => {
  let mode = null, pendingCut = deferred(), release = deferred(), W = 10;
  const observedCrypto = { getRandomValues: crypto.getRandomValues.bind(crypto), subtle: {
    decrypt: crypto.subtle.decrypt.bind(crypto.subtle),
    async encrypt(...args) { if (mode === "fail") throw new Error("synthetic encryption fault"); if (mode === "hold") { pendingCut.resolve(); await release.promise; } return crypto.subtle.encrypt(...args); },
  } };
  const f = await fixture({ crypto: observedCrypto }), before = await f.repo.load(); mode = "fail";
  await assert.rejects(f.repo.prepare(before, before.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), e => e.state === 3); assert.deepEqual(await f.repo.load(), before);
  mode = "hold"; const preparing = f.repo.prepare(before, before.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }); await pendingCut.promise; W = 456; release.resolve();
  await f.repo.commitPrepared(before, await preparing, () => ({ kind: "publish", frameFields: frame({ kind: 1, H: W, W_last: W }) }));
  const after = await f.repo.load(); assert.equal(after.frame.H, 456); assert.equal(after.frame.W_last, 456); f.repo.close();
});
test("independent frame and body key epoch rotation retains old verification and refuses missing historical keys", async () => {
  const bodies = new Map(), frames = new Map();
  for (const epoch of [1, 2]) { bodies.set(epoch, await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])); frames.set(epoch, crypto.getRandomValues(new Uint8Array(32))); }
  const f = await fixture({ bodyKeyProvider: ({ keyEpoch }) => bodies.get(keyEpoch), frameKeyProvider: ({ keyEpoch }) => ({ keyEpoch, keyBytes: frames.get(keyEpoch), revisionStart: 1 }) });
  const before = await f.repo.load(), cap = await f.repo.prepare(before, before.body, { bodyKeyEpoch: 2, frameKeyEpoch: 2 });
  await f.repo.commitPrepared(before, cap, () => ({ kind: "publish", frameFields: frame({ kind: 1 }) })); const after = await f.repo.load();
  assert.equal(after.active.frameKeyEpoch, 2); assert.equal(after.previous.frameKeyEpoch, 1); assert.deepEqual(after.body.collections, before.body.collections);
  for (const map of [bodies, frames]) { const saved = map.get(1); map.delete(1); await assert.rejects(f.repo.load(), e => e.state === 18); map.set(1, saved); assert.deepEqual(await f.repo.load(), after); } f.repo.close();
});
test("synthetic v1 conversion abort rolls back complete pair and fresh retry preserves all legacy bytes", async () => {
  const faults = faultDatabase(), key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]), frameKey = crypto.getRandomValues(new Uint8Array(32));
  const args = { indexedDB: faults.indexedDB, databaseName: "synthetic-conversion-fault", namespace: "synthetic-conversion-fault" };
  const old = await openRepository({ ...args, keyProvider: () => key, authorizeEnrollment: () => true }); await old.initialize(initial(), {}); old.close();
  const repo = await openFrameRepository({ ...args, bodyKeyProvider: () => key, legacyKeyProvider: () => key, frameKeyProvider: () => ({ keyEpoch: 1, keyBytes: frameKey, revisionStart: 1 }) });
  const before = await repo.load({ compatibility: true }), body = { format: 2, collections: before.legacy.collections, retainedMetadata: before.legacy.metadata, proofs: [] };
  const prepare = () => repo.prepare(before, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, compatibility: true }); const first = await prepare(); faults.state.armed = true; faults.state.mode = "quota";
  await assert.rejects(repo.commitPrepared(before, first, () => ({ kind: "publish", frameFields: frame({ kind: 3 }) })), e => e.state === 3); faults.state.armed = false;
  assert.deepEqual(await repo.load({ compatibility: true }), before); await assert.rejects(repo.load(), e => e.state === 18);
  await repo.commitPrepared(before, await prepare(), () => ({ kind: "publish", frameFields: frame({ kind: 3 }) })); const after = await repo.load();
  assert.deepEqual(after.previous, before.active); assert.deepEqual(after.body.collections, before.legacy.collections); assert.equal(after.unproven, true); repo.close();
});

// Authenticated synthetic near-boundary fixture: the two v1 records use the
// unchanged v1 AAD and actual T2 generations, but their large revision numbers
// are authored here. No claim of executing 2^24 historical commits is made.
// Only the real repository loader can turn these records into a trusted basis.
async function windowFixture(factory = openFrameRepository) {
  assert.equal(REVISION_WINDOW, 2 ** 24, "the test must not reduce the operational window");
  const observed = observedDatabase(), bodies = new Map(), frames = new Map(), requests = [];
  for (const epoch of [1, 2]) {
    bodies.set(epoch, await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]));
    frames.set(epoch, { keyEpoch: epoch, keyBytes: crypto.getRandomValues(new Uint8Array(32)), revisionStart: epoch === 1 ? 1 : REVISION_WINDOW + 1 });
  }
  assert.notDeepEqual(frames.get(1).keyBytes, frames.get(2).keyBytes, "epoch rotation provisions an independent synthetic key");
  const legacyKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  const databaseName = "synthetic-authenticated-key-window", namespace = "ath-1/dev-A/synthetic-authenticated-key-window";
  const stage = Stage.createT2Stage(config), session = { sets: [{ exercise: "squat", reps: 5, load: 100 }] };
  const first = stage(initial(), "logSession", session), second = stage(first.generation, "logSession", session);
  assert.equal(first.result.acknowledged, true); assert.equal(second.result.acknowledged, true);
  for (const generation of [first.generation, second.generation]) {
    assert(Object.keys(generation.collections.ops).length > 0); assert(Object.keys(generation.collections.outbox).length > 0);
  }
  const legacyRecord = async (generation, revision) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const additionalData = bytes(["earned/local-generation/v1", 1, namespace, revision]);
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData, tagLength: 128 }, legacyKey, bytes(generation));
    return { format: 1, namespace, revision, iv, ciphertext };
  };
  const previous = await legacyRecord(first.generation, REVISION_WINDOW - 2), active = await legacyRecord(second.generation, REVISION_WINDOW - 1);
  await new Promise((resolveSeed, reject) => {
    const request = observed.inner.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("generations");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction("generations", "readwrite"), store = tx.objectStore("generations");
      store.put(active, "active"); store.put(previous, "previous");
      tx.oncomplete = () => { db.close(); resolveSeed(); }; tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
  const args = { indexedDB: observed.indexedDB, databaseName, namespace, crypto,
    bodyKeyProvider: ({ keyEpoch }) => { requests.push(["body", keyEpoch]); return bodies.get(keyEpoch); },
    frameKeyProvider: ({ keyEpoch }) => { requests.push(["frame", keyEpoch]); return frames.get(keyEpoch); },
    legacyKeyProvider: () => legacyKey,
  };
  // First validate with the original v1 loader as well as v2 compatibility.
  const v1 = await openRepository({ indexedDB: observed.indexedDB, databaseName, namespace, crypto, keyProvider: () => legacyKey });
  try { const loaded = await v1.load(); assert.equal(loaded.revision, REVISION_WINDOW - 1); assert.equal(JSON.stringify(loaded.generation), JSON.stringify(second.generation)); }
  finally { v1.close(); }
  const repo = await factory(args);
  try {
    await assert.rejects(repo.load(), e => e.code === "FRAME_V1_CONVERSION_REQUIRED" && e.state === 18);
    const basis = await repo.load({ compatibility: true });
    assert.deepEqual(basis.active, active); assert.deepEqual(basis.previous, previous);
    assert.equal(JSON.stringify(basis.legacy), JSON.stringify(second.generation));
    const body = { format: 2, collections: basis.legacy.collections, retainedMetadata: basis.legacy.metadata, proofs: [] };
    const cap = await repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, compatibility: true });
    const saved = await repo.commitPrepared(basis, cap, () => ({ kind: "publish", frameFields: frame({ kind: 3 }) }));
    assert.equal(saved.durable, true); assert.equal(saved.revision, REVISION_WINDOW);
    const last = await repo.load();
    assert.equal(last.active.frameKeyEpoch, 1); assert.equal(last.active.body.keyEpoch, 1); assert.equal(last.revision, REVISION_WINDOW);
    assert.deepEqual(last.previous, active); assert.deepEqual(last.body, body); assert.equal(last.unproven, true); assert.equal(last.frame.state, 18);
    return { repo, args, observed, bodies, frames, requests, last };
  } catch (error) { repo.close(); throw error; }
}
async function observeWindowRefusal(f) {
  const { repo, last, observed } = f;
  let capability, result, error, finalizers = 0;
  observed.state.armed = true;
  try {
    capability = await repo.prepare(last, last.body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 });
    result = await repo.commitPrepared(last, capability, () => { finalizers++; return { kind: "publish", frameFields: frame({ kind: 1 }) }; });
  } catch (caught) { error = caught; }
  finally { observed.state.armed = false; }
  return { capability, result, error, finalizers };
}
function assertWindowRefused(f, cut) {
  assert.equal(cut.result, undefined, "first out-of-window write must not publish");
  assert.equal(cut.capability, undefined, "out-of-window prepare must not issue a capability");
  assert.equal(cut.error?.code, "FRAME_KEY_WINDOW"); assert.equal(cut.error.state, 3); assert.equal(cut.error.retryable, false);
  assert.equal(cut.finalizers, 0);
  assert.deepEqual(f.observed.state, { armed: false, transactions: 0, writes: 0, complete: 0, abort: 0 }, "window refusal precedes any write transaction");
}
async function runWindowContract(factory = openFrameRepository) {
  const f = await windowFixture(factory);
  try {
    const exactPair = { active: f.last.active, previous: f.last.previous }, key1 = structuredClone(f.frames.get(1));
    const cut = await observeWindowRefusal(f); assertWindowRefused(f, cut);
    assert.deepEqual(await readStoredPair(f.observed.inner, f.args.databaseName), exactPair);
    assert.deepEqual(await f.repo.load(), f.last);
    const cap = await f.repo.prepare(f.last, f.last.body, { bodyKeyEpoch: 2, frameKeyEpoch: 2 });
    const saved = await f.repo.commitPrepared(f.last, cap, () => ({ kind: "publish", frameFields: frame({ kind: 1 }) }));
    assert.equal(saved.durable, true); assert.equal(saved.revision, REVISION_WINDOW + 1);
    const after = await f.repo.load();
    assert.equal(after.active.frameKeyEpoch, 2); assert.equal(after.active.body.keyEpoch, 2);
    assert.deepEqual(after.previous, exactPair.active); assert.deepEqual(after.body, f.last.body);
    assert.equal(after.frame.U, f.last.frame.U); assert.equal(after.unproven, true); assert.equal(after.frame.state, 18); assert.equal(after.frame.checkpointRef, null);
    assert.deepEqual(f.frames.get(1), key1, "rotation must not relabel the existing epoch or move its window");
    f.repo.close(); f.repo = await factory(f.args); f.requests.length = 0;
    assert.deepEqual(await f.repo.load(), after);
    for (const kind of ["frame", "body"]) for (const epoch of [1, 2]) assert(f.requests.some(request => request[0] === kind && request[1] === epoch), `reopen actually requests ${kind} epoch ${epoch}`);
    for (const [kind, map] of [["frame", f.frames], ["body", f.bodies]]) {
      const historical = map.get(1); map.delete(1); let returned = false;
      await assert.rejects(f.repo.load().then(value => { returned = true; return value; }), e => e.state === 18, `missing historical ${kind} key refuses18`);
      assert.equal(returned, false); assert.deepEqual(await readStoredPair(f.observed.inner, f.args.databaseName), { active: after.active, previous: after.previous });
      map.set(1, historical); assert.deepEqual(await f.repo.load(), after, `same historical ${kind} key recovers exact pair and T2 body`);
    }
  } finally { f.repo.close(); }
}
test("repository key window: last revision succeeds, first outside refuses3, next epoch and historical keys reopen", async () => {
  await runWindowContract();
});
test("repository key window: effective omitted window permits forbidden durable write; restored contract refuses", async () => {
  const here = resolve(dirname(fileURLToPath(import.meta.url)), ".."), path = join(here, "frame-format.mjs"), original = readFileSync(path);
  const source = readFileSync(join(here, "frame-repository.mjs")), sha = value => createHash("sha256").update(value).digest("hex");
  const needle = 'if (revision < value.revisionStart || revision >= value.revisionStart + REVISION_WINDOW) { keyBytes.fill(0); fail("FRAME_KEY_WINDOW", writing ? 3 : 18); }';
  assert.equal(original.toString("utf8").split(needle).length, 2);
  const scratch = mkdtempSync(join(here, ".tmp/frame-window-mutant-"));
  assert(resolve(scratch).startsWith(resolve(here, ".tmp") + sep));
  const copy = join(scratch, "frame-format.mjs");
  try {
    for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(scratch, file));
    writeFileSync(copy, original.toString("utf8").replace(needle, ""));
    const changed = await import(pathToFileURL(join(scratch, "frame-repository.mjs")).href), f = await windowFixture(changed.openFrameRepository);
    try {
      const cut = await observeWindowRefusal(f);
      assert.throws(() => assertWindowRefused(f, cut), e => e.code === "ERR_ASSERTION" && e.message.includes("must not publish"));
      assert.equal(cut.error, undefined); assert.equal(cut.result.durable, true); assert.equal(cut.result.revision, REVISION_WINDOW + 1); assert.equal(cut.finalizers, 1);
      assert.deepEqual(f.observed.state, { armed: false, transactions: 1, writes: 2, complete: 1, abort: 0 });
      const wrong = await f.repo.load(); assert.equal(wrong.active.frameKeyEpoch, 1); assert.deepEqual(wrong.body, f.last.body);
      const ordinary = await openFrameRepository(f.args);
      try { await assert.rejects(ordinary.load(), e => e.code === "FRAME_KEY_WINDOW" && e.state === 18, "real reader rejects authenticated but out-of-window stored frame"); }
      finally { ordinary.close(); }
      console.log("W6 FRAME WINDOW BITE RED — omitted window allowed epoch1 durable publication at first forbidden revision");
    } finally { f.repo.close(); }
    writeFileSync(copy, original); assert.deepEqual(readFileSync(copy), original);
    // A separate filename also gives restored relative imports a fresh module
    // graph; changing only the repository URL would retain mutated format cache.
    const restoredDir = join(scratch, "restored");
    mkdirSync(restoredDir);
    for (const file of ["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs", "strict-json.mjs", "repository.mjs"]) cpSync(join(here, file), join(restoredDir, file));
    const restored = await import(pathToFileURL(join(restoredDir, "frame-repository.mjs")).href);
    await runWindowContract(restored.openFrameRepository);
    console.log(`W6 FRAME WINDOW RESTORED — exact integrated boundary contract; format SHA256 ${sha(original)}; repository SHA256 ${sha(source)}`);
  } finally {
    if (readFileSync(copy).compare(original) !== 0) writeFileSync(copy, original);
    assert.deepEqual(readFileSync(copy), original);
    assert(resolve(scratch).startsWith(resolve(here, ".tmp") + sep)); rmSync(scratch, { recursive: true, force: true });
    assert.deepEqual(readFileSync(path), original); assert.deepEqual(readFileSync(join(here, "frame-repository.mjs")), source);
  }
});
