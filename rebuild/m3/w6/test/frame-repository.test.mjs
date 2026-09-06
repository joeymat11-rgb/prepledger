import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { openFrameRepository, makeProof } from "../frame-repository.mjs";
import { openRepository } from "../repository.mjs";
import { frame } from "./frame-support.mjs";
import { initial, config, faultDatabase, deferred } from "./support.mjs";
import Stage from "../t2-stage.cjs";
import { readFileSync, writeFileSync, cpSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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
