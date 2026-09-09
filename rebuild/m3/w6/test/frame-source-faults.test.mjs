import test from "node:test";
import assert from "node:assert/strict";
import { createHash, webcrypto } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { IDBFactory } from "fake-indexeddb";
import { initial, config } from "./support.mjs";
import { frame } from "./frame-support.mjs";
import Stage from "../t2-stage.cjs";

// Mechanical source faults only. The injected batch validator establishes no
// production permission, signed-time, custody, epoch or knowledge-loss contract.
const root = resolve(dirname(fileURLToPath(import.meta.url)), ".."), encoder = new TextEncoder();
const files = ["frame-repository.mjs", "frame-crypto.mjs", "frame-format.mjs", "strict-json.mjs", "repository.mjs", "recovery-stage.mjs"];
const originals = new Map(files.map(name => [name, readFileSync(join(root, name))]));
const sha = value => createHash("sha256").update(value).digest("hex"), jsonBytes = value => encoder.encode(JSON.stringify(value));
function unchanged() { for (const [name, bytes] of originals) assert.deepEqual(readFileSync(join(root, name)), bytes, `real source changed: ${name}`); }
function oneChange(source, before, after) {
  assert.equal(source.split(before).length - 1, 1, "fault must have exactly one reviewed source site");
  assert.notEqual(before, after); return source.replace(before, after);
}
async function runFault(t, fault, observe, law) {
  const tempRoot = join(root, ".tmp"); mkdirSync(tempRoot, { recursive: true });
  const temp = mkdtempSync(join(tempRoot, "frame-source-faults-"));
  const expectedParent = realpathSync(tempRoot), expectedTemp = realpathSync(temp);
  try {
    for (const phase of ["original", "mutant", "restored"]) {
      if (phase === "restored") {
        const mutatedFile = join(temp, "mutant", fault.file), original = originals.get(fault.file);
        assert.notDeepEqual(readFileSync(mutatedFile), original);
        writeFileSync(mutatedFile, original);
        assert.deepEqual(readFileSync(mutatedFile), original); assert.equal(sha(readFileSync(mutatedFile)), sha(original));
      }
      const dir = join(temp, phase); mkdirSync(dir);
      for (const [name, bytes] of originals) writeFileSync(join(dir, name), bytes);
      if (phase === "mutant") writeFileSync(join(dir, fault.file), oneChange(originals.get(fault.file).toString("utf8"), fault.before, fault.after));
      else for (const [name, bytes] of originals) assert.deepEqual(readFileSync(join(dir, name)), bytes, `${phase} source is exact`);
      const [repository, format, cipher] = await Promise.all(["frame-repository.mjs", "frame-format.mjs", "frame-crypto.mjs"].map(name => import(pathToFileURL(join(dir, name)).href)));
      // Import, crypto, fixture, and observation errors escape this block. Only
      // the precise behavioral assertion below can earn mutant detection.
      const evidence = await observe({ repository, format, cipher });
      if (phase === "mutant") assert.throws(() => law(evidence), e => e.code === "ERR_ASSERTION" && e.message.includes(fault.id));
      else law(evidence);
      t.diagnostic(`${fault.id} ${phase === "mutant" ? "BEHAVIORAL-RED mutant-DETECTED" : `${phase.toUpperCase()} PASS`} source-sha256=${sha(readFileSync(join(dir, fault.file)))}`);
    }
  } finally {
    unchanged();
    const current = realpathSync(temp), rel = relative(expectedParent, current);
    assert.equal(current, expectedTemp); assert(rel && rel !== ".." && !rel.startsWith(`..${sep}`));
    assert.equal(dirname(current), expectedParent, "recursive cleanup is confined to the created .tmp child");
    rmSync(current, { recursive: true });
  }
}
async function fixture(modules) {
  const bodyKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]), frameKey = webcrypto.getRandomValues(new Uint8Array(32));
  const indexedDB = new IDBFactory(), args = { indexedDB, databaseName: "synthetic-source-fault", namespace: "ath-1/dev-A/source-fault", crypto: webcrypto,
    bodyKeyProvider: async () => bodyKey, frameKeyProvider: async ({ keyEpoch }) => ({ keyEpoch, keyBytes: frameKey, revisionStart: 1 }),
    authorizeEnrollment: evidence => evidence === "synthetic-only", proofValidators: { "batch/1": () => true } };
  const repo = await modules.repository.openFrameRepository(args), generation = initial();
  generation.collections.futureCollection.unchanged.binding = "before";
  const body = { format: 2, collections: generation.collections, retainedMetadata: generation.metadata, proofs: [] };
  await repo.commitPrepared(null, await repo.prepare(null, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1 }), () => ({ kind: "publish", frameFields: frame() }), { enrollmentEvidence: "synthetic-only" });
  return { ...modules, args, indexedDB, bodyKey, frameKey, repo };
}
async function stage(f) {
  const basis = await f.repo.load(), candidate = Stage.createT2Stage(config)({ collections: basis.body.collections, metadata: basis.body.retainedMetadata }, "logSession",
    { sets: [{ exercise: "squat", reps: 5, load: 100 }, { exercise: "squat", reps: 5, load: 100 }] });
  assert.equal(candidate.result.acknowledged, true);
  const batch = candidate.commit.batch; assert.equal(batch.count, 3, "actual T2 session plus two sets");
  const proof = f.repository.makeProof("batch", 1, jsonBytes(batch));
  const body = { format: 2, collections: candidate.generation.collections, retainedMetadata: candidate.generation.metadata, proofs: basis.body.proofs.concat(proof) };
  const capability = await f.repo.prepare(basis, body, { bodyKeyEpoch: 1, frameKeyEpoch: 1, batch });
  return { basis, body, batch, capability, fields: frame({ kind: 0, U: basis.frame.U + batch.count, firstSequence: batch.firstSequence, lastSequence: batch.lastSequence, batchCount: batch.count, batchRef: proof.digest }) };
}
async function prime(f) { const c = await stage(f); await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "publish", frameFields: c.fields })); return f.repo.load(); }
async function rawPair(f, replacement) {
  const db = await new Promise((resolve, reject) => { const r = f.indexedDB.open(f.args.databaseName, 2); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("generations", replacement ? "readwrite" : "readonly"), store = tx.objectStore("generations");
      if (replacement) store.put(replacement, "active");
      const active = store.get("active"), previous = store.get("previous");
      tx.oncomplete = () => resolve({ active: active.result, previous: previous.result }); tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}
async function freshLoad(f) { f.repo.close(); f.repo = await f.repository.openFrameRepository(f.args); return f.repo.load(); }
async function loadOutcome(f) {
  try { return { accepted: true, loaded: await freshLoad(f) }; }
  catch (e) { assert.equal(e.state, 18); return { accepted: false, code: e.code }; }
}
function sameRetainedCollections(after, before) {
  assert.deepEqual(after.collections.ops, before.collections.ops); assert.deepEqual(after.collections.outbox, before.collections.outbox);
  assert.deepEqual(after.retainedMetadata, before.retainedMetadata); assert.deepEqual(after.proofs, before.proofs);
}

test("source fault: consumed attempt refuses a second encryption after success and after throw", async t => {
  await runFault(t, { id: "FRAME-ATTEMPT-SINGLE-USE", file: "frame-crypto.mjs", before: 'if (used) fail("FRAME_ATTEMPT_CONSUMED", 3); used = true;', after: "used = true; // disposable omitted single-use check" },
    async ({ cipher, format }) => {
      const outcomes = [];
      for (const firstThrows of [false, true]) {
        const key = webcrypto.getRandomValues(new Uint8Array(32)), attempt = cipher.createFrameAttempt(key, webcrypto), aad = encoder.encode("synthetic-source-fault"), plaintext = new Uint8Array(format.FRAME_BYTES);
        if (firstThrows) assert.throws(() => attempt.encrypt(aad, plaintext.subarray(1)), e => e.code === "FRAME_ENCRYPT_FAILED" && e.state === 3);
        else { const ciphertext = attempt.encrypt(aad, plaintext); assert.deepEqual(cipher.decryptFrame(key, attempt.nonce(), aad, ciphertext), plaintext); }
        try { const ciphertext = attempt.encrypt(aad, plaintext); assert.equal(ciphertext.length, format.FRAME_CIPHERTEXT_BYTES); outcomes.push({ firstThrows, accepted: true }); }
        catch (e) { assert.equal(e.code, "FRAME_ATTEMPT_CONSUMED"); assert.equal(e.state, 3); outcomes.push({ firstThrows, accepted: false }); }
      }
      // The first call clears its key. A mutant success establishes consumed-
      // attempt reuse only, not a repeated encryption under the original key.
      return outcomes;
    }, outcomes => assert.deepEqual(outcomes.map(x => x.accepted), [false, false], "FRAME-ATTEMPT-SINGLE-USE: no second encrypt, even after throw"));
});

test("source fault: a durable control retains the prior complete body while refusing a real staged T2 batch", async t => {
  await runFault(t, { id: "FRAME-CONTROL-BODY", file: "frame-repository.mjs", before: "body = clone(active.body); entries = p.priorEntries; bodyDigest = p.priorBodyDigest;", after: "// disposable coherent omission: keep staged body, entries and digest" },
    async modules => {
      const f = await fixture(modules);
      try {
        await prime(f); const c = await stage(f), before = await rawPair(f);
        assert.equal(Object.keys(c.basis.body.collections.ops).length, 3); assert.equal(Object.keys(c.body.collections.ops).length, 6);
        for (const op of c.batch.operations) { assert.equal(c.body.collections.outbox[op.op_id].op_id, op.op_id); assert(!Object.hasOwn(c.basis.body.collections.ops, op.op_id)); }
        const result = await f.repo.commitPrepared(c.basis, c.capability, () => ({ kind: "control", state: 20, code: "SYNTHETIC_REFUSAL", frameFields: frame({ state: 20, allowanceInvalidated: 1, U: c.basis.frame.U }) }));
        assert.equal(result.kind, "control"); assert.equal(result.state, 20); assert.equal(result.durable, true);
        const raw = await rawPair(f); assert.deepEqual(raw.previous, before.active); assert.equal(raw.active.commitRevision, before.active.commitRevision + 1);
        // Capture complete raw body evidence before any loader can conceal an
        // incorrect durable write with a subsequent decryption refusal.
        const retainedRawBody = isDeepEqual(raw.active.body, before.active.body);
        const loaded = await freshLoad(f); assert.equal(loaded.frame.kind, 2); assert.equal(loaded.frame.state, 20); assert.equal(loaded.frame.U, c.basis.frame.U); assert.equal(loaded.unproven, true);
        assert.deepEqual(loaded.body.collections.futureCollection, c.basis.body.collections.futureCollection);
        assert.deepEqual(loaded.body.retainedMetadata.leaseHistory, c.basis.body.retainedMetadata.leaseHistory);
        const leaked = c.batch.operations.filter(op => Object.hasOwn(loaded.body.collections.ops, op.op_id) && Object.hasOwn(loaded.body.collections.outbox, op.op_id)).length;
        if (retainedRawBody) assert.deepEqual(loaded.body, c.basis.body); else { assert.deepEqual(jsonBytes(loaded.body), jsonBytes(c.body)); assert.equal(leaked, c.batch.count, "mutant actually published the entire staged body"); }
        return { retainedRawBody, leaked };
      } finally { f.repo.close(); }
    }, e => assert.deepEqual(e, { retainedRawBody: true, leaked: 0 }, "FRAME-CONTROL-BODY: refusal retains exact body and creates no staged operations/outbox"));
});
function isDeepEqual(a, b) { try { assert.deepEqual(a, b); return true; } catch (e) { if (e.code !== "ERR_ASSERTION") throw e; return false; } }

test("source fault: omitted ciphertext digest permits a valid encrypted body to be mixed with another frame", async t => {
  await runFault(t, { id: "FRAME-BODY-DIGEST-BINDING", file: "frame-format.mjs",
    before: "preparedBodyDigest === undefined ? digest(new Uint8Array(b.ciphertext)) : ownedBytes(preparedBodyDigest, 32)", after: "new Uint8Array(32)" },
    async modules => {
      const f = await fixture(modules);
      try {
        const before = await prime(f), originalPair = await rawPair(f), otherBody = structuredClone(before.body);
        otherBody.collections.futureCollection.unchanged.binding = "forged"; const plaintext = jsonBytes(otherBody), originalPlaintext = jsonBytes(before.body);
        assert.equal(plaintext.length, originalPlaintext.length); sameRetainedCollections(otherBody, before.body);
        const mixed = structuredClone(originalPair.active), b = mixed.body;
        const algorithm = { name: "AES-GCM", iv: b.iv, additionalData: jsonBytes(["earned/local-body/v2", 2, f.args.namespace, b.keyEpoch, b.aadRevision]), tagLength: 128 };
        // Deliberate adversarial fixture: the test knows this run's synthetic
        // key and constructs another authenticated body with identical IV/AAD.
        // This is not a product encryption operation or a nonce-safety claim.
        b.ciphertext = await webcrypto.subtle.encrypt(algorithm, f.bodyKey, plaintext);
        assert.equal(b.ciphertext.byteLength, originalPair.active.body.ciphertext.byteLength);
        assert.deepEqual(new Uint8Array(await webcrypto.subtle.decrypt(algorithm, f.bodyKey, b.ciphertext)), plaintext);
        assert.notDeepEqual(new Uint8Array(b.ciphertext), new Uint8Array(originalPair.active.body.ciphertext));
        const copy = structuredClone(mixed); copy.body.ciphertext = originalPair.active.body.ciphertext; assert.deepEqual(copy, originalPair.active);
        const stored = await rawPair(f, mixed); assert.deepEqual(stored.previous, originalPair.previous);
        const outcome = await loadOutcome(f);
        if (outcome.accepted) { assert.deepEqual(outcome.loaded.body, otherBody); assert.deepEqual(outcome.loaded.frame, before.frame); assert.equal(outcome.loaded.unproven, true); }
        else assert.equal(outcome.code, "FRAME_AUTHENTICATION_FAILED", "the frame digest binding, not independent body authentication, refuses the mix");
        return outcome.accepted;
      } finally { f.repo.close(); }
    }, accepted => assert.equal(accepted, false, "FRAME-BODY-DIGEST-BINDING: a separately valid ciphertext cannot inherit the old frame"));
});

test("source fault: an authenticated but unknown binary frame version refuses before returning stored truth", async t => {
  await runFault(t, { id: "FRAME-UNKNOWN-VERSION", file: "frame-format.mjs", before: "v.getUint16(4) !== 1", after: "false" },
    async modules => {
      const f = await fixture(modules);
      try {
        const before = await prime(f), originalPair = await rawPair(f), changed = structuredClone(originalPair.active);
        const plaintext = f.cipher.decryptFrame(f.frameKey, changed.frameNonce, f.format.frameAad(changed), changed.frameCiphertext), valid = plaintext.slice();
        assert.equal(new DataView(plaintext.buffer).getUint16(4), 1); new DataView(plaintext.buffer).setUint16(4, 2);
        const normalized = plaintext.slice(); new DataView(normalized.buffer).setUint16(4, 1); assert.deepEqual(normalized, valid);
        const attempt = f.cipher.createFrameAttempt(f.frameKey, webcrypto); changed.frameNonce = attempt.nonce(); changed.frameCiphertext = attempt.encrypt(f.format.frameAad(changed), plaintext);
        assert.deepEqual(f.cipher.decryptFrame(f.frameKey, changed.frameNonce, f.format.frameAad(changed), changed.frameCiphertext), plaintext);
        const stored = await rawPair(f, changed); assert.deepEqual(stored.previous, originalPair.previous); assert.deepEqual(stored.active.body, originalPair.active.body);
        const outcome = await loadOutcome(f);
        if (outcome.accepted) { assert.deepEqual(outcome.loaded.body, before.body); assert.deepEqual(outcome.loaded.frame, before.frame); assert.equal(outcome.loaded.unproven, true); }
        else assert.equal(outcome.code, "FRAME_INTEGRITY_UNPROVEN");
        return outcome.accepted;
      } finally { f.repo.close(); }
    }, accepted => assert.equal(accepted, false, "FRAME-UNKNOWN-VERSION: valid AEAD cannot authorize an unknown binary profile"));
});

test("source fault: the stored frame uses supplied finalizer values rather than the prior frame sample", async t => {
  await runFault(t, { id: "FRAME-FINALIZER-SAMPLE", file: "frame-repository.mjs", before: "encodeFrame(fields)",
    after: "encodeFrame(p.basis ? { ...fields, H: p.basis.frame.H, W_last: p.basis.frame.W_last } : fields)" },
    async modules => {
      const f = await fixture(modules);
      try {
        await prime(f); let suppliedObservation = 0; const c = await stage(f);
        assert.equal(c.basis.frame.H, suppliedObservation); assert.equal(c.basis.frame.W_last, suppliedObservation);
        suppliedObservation = 1234; let calls = 0;
        const result = await f.repo.commitPrepared(c.basis, c.capability, context => {
          calls++; assert.deepEqual(context.batch, c.batch);
          return { kind: "publish", frameFields: { ...c.fields, H: suppliedObservation, W_last: suppliedObservation } };
        });
        assert.equal(calls, 1); assert.equal(result.kind, "publish"); assert.equal(result.durable, true);
        const raw = await rawPair(f), loaded = await freshLoad(f);
        assert.deepEqual(raw.previous, c.basis.active); assert.equal(raw.active.commitRevision, c.basis.revision + 1);
        assert.deepEqual(jsonBytes(loaded.body), jsonBytes(c.body)); assert.equal(loaded.frame.U, c.basis.frame.U + c.batch.count);
        assert.equal(loaded.frame.batchCount, c.batch.count); assert.equal(loaded.unproven, true);
        const decoded = f.format.decodeFrame(f.cipher.decryptFrame(f.frameKey, raw.active.frameNonce, f.format.frameAad(raw.active), raw.active.frameCiphertext));
        assert.deepEqual(decoded, loaded.frame);
        // The observation is supplied synthetic data. This proves faithful
        // serialization only, not freshness, signed time, or write eligibility.
        return { H: decoded.H, W_last: decoded.W_last, suppliedObservation };
      } finally { f.repo.close(); }
    }, e => assert.deepEqual(e, { H: 1234, W_last: 1234, suppliedObservation: 1234 }, "FRAME-FINALIZER-SAMPLE: persist the actual finalizer fields, not prior values"));
});
