import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { openFrameRepository, makeProof } from "../frame-repository.mjs";
import { openRepository } from "../repository.mjs";
import { frame } from "./frame-support.mjs";
import { initial, config, faultDatabase, deferred } from "./support.mjs";
import Stage from "../t2-stage.cjs";

const bytes = x => new TextEncoder().encode(JSON.stringify(x));
async function fixture(options = {}) {
  const bodyKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]), frameKey = crypto.getRandomValues(new Uint8Array(32));
  const indexedDB = options.indexedDB || new IDBFactory(), args = { indexedDB, databaseName: "synthetic-frame", namespace: "ath-1/dev-A/synthetic-frame", crypto,
    bodyKeyProvider: async () => bodyKey, frameKeyProvider: async ({ keyEpoch }) => ({ keyEpoch, keyBytes: frameKey, revisionStart: 1 }), authorizeEnrollment: () => true,
    proofValidators: { "batch/1": () => true }, ...options };
  const repo = await openFrameRepository(args), generation = initial(), body = { format: 2, collections: generation.collections, retainedMetadata: generation.metadata, proofs: [] };
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
