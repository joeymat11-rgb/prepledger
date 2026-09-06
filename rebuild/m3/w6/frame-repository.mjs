import { StorageFailure } from "./repository.mjs";
import { parseStrictJson } from "./strict-json.mjs";
import { createFrameAttempt, decryptFrame } from "./frame-crypto.mjs";
import { REF_NAMES, allZero, concat, decodeFrame, digest, digestHex, encodeFrame, exactObject, fail, frameAad, keyMaterial,
  namespaceBytes, pairToken, recordBytes, safe, sameBytes, validateFrame, validateRecord, validateV1Record } from "./frame-format.mjs";

const clone = value => structuredClone(value), encoder = new TextEncoder(), STORE = "generations";
const KINDS = ["checkpoint", "lease", "batch", "guard", "session", "permission", "standing", "recovery", "wire"];
function b64(bytes) { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, ""); }
function proofBytes(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]*$/.test(value) || value.length % 4 === 1) fail();
  let out; try { out = Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), c => c.charCodeAt(0)); } catch { fail(); }
  if (b64(out) !== value) fail(); return out;
}
function jsonValue(value, path = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (!value || typeof value !== "object" || path.has(value)) fail("FRAME_BODY_INVALID");
  if (!Array.isArray(value) && ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail("FRAME_BODY_INVALID");
  path.add(value);
  const keys = Reflect.ownKeys(value);
  for (const name of keys) {
    if (Array.isArray(value) && name === "length") continue;
    const d = Object.getOwnPropertyDescriptor(value, name);
    if (typeof name !== "string" || !d || !d.enumerable || !Object.hasOwn(d, "value")) fail("FRAME_BODY_INVALID");
    jsonValue(d.value, path);
  }
  if (Array.isArray(value) && (keys.length !== value.length + 1 || keys.some(k => k !== "length" && (!/^(0|[1-9][0-9]*)$/.test(k) || Number(k) >= value.length)))) fail("FRAME_BODY_INVALID");
  path.delete(value);
}
function bodyShape(body) {
  exactObject(body, ["format", "collections", "retainedMetadata", "proofs"]); if (body.format !== 2) fail();
  jsonValue(body);
  for (const value of [body.collections, body.retainedMetadata]) if (!value || typeof value !== "object" || Array.isArray(value)) fail();
  for (const value of Object.values(body.collections)) if (!value || typeof value !== "object" || Array.isArray(value)) fail();
  if (!Array.isArray(body.proofs)) fail();
  const entries = new Map();
  for (const proof of body.proofs) {
    exactObject(proof, ["kind", "version", "digest", "bytes"]); if (!KINDS.includes(proof.kind)) fail(); safe(proof.version, true);
    const bytes = proofBytes(proof.bytes); if (digestHex(bytes) !== proof.digest || entries.has(proof.digest)) fail("FRAME_PROOF_INVALID");
    entries.set(proof.digest, { ...proof, decoded: bytes });
  }
  return entries;
}
export function makeProof(kind, version, bytes) { return { kind, version, digest: digestHex(bytes), bytes: b64(bytes) }; }
function validateProofs(body, validators, frame) {
  const entries = bodyShape(body);
  for (const entry of entries.values()) {
    const validate = validators[`${entry.kind}/${entry.version}`];
    if (typeof validate !== "function") fail("FRAME_PROOF_VALIDATOR_UNAVAILABLE");
    let good; try { good = validate(entry.decoded.slice(), clone(entry)); } catch { good = false; }
    if (good !== true) fail("FRAME_PROOF_UNPROVEN");
  }
  if (!frame) return entries;
  validateReferences(entries, frame);
  return entries;
}
function validateReferences(entries, frame) {
  validateFrame(frame);
  for (const name of REF_NAMES) if (frame[name] !== null) {
    const proof = entries.get(frame[name]); if (!proof || proof.kind !== name.slice(0, -3)) fail("FRAME_REFERENCE_UNPROVEN");
  }
  // Resolution has no meaning without its checkpoint and closure evidence; validators remain injected and unimplemented for production.
  if (frame.guard === 2 && (!frame.checkpointRef || !frame.guardRef)) fail("FRAME_CLOSURE_UNPROVEN");
}
function newOperationIds(before, after) { return Object.keys(after.ops || {}).filter(key => !Object.hasOwn(before.ops || {}, key)); }
function validateBatch(body, basis, fields, batch) {
  if (fields.kind !== 0) { if (batch !== null && batch !== undefined) fail("FRAME_BATCH_MISMATCH"); return; }
  if (!batch || batch.version !== "earned/client-batch/v1" || batch.count !== fields.batchCount || batch.firstSequence !== fields.firstSequence || batch.lastSequence !== fields.lastSequence || !Array.isArray(batch.operations) || batch.operations.length !== fields.batchCount) fail("FRAME_BATCH_MISMATCH");
  const proof = body.proofs.find(p => p.digest === fields.batchRef);
  if (!proof || proof.kind !== "batch" || JSON.stringify(parseStrictJson(proofBytes(proof.bytes))) !== JSON.stringify(batch)) fail("FRAME_BATCH_MISMATCH");
  const ids = newOperationIds(basis?.collections || {}, body.collections);
  if (ids.length !== batch.count) fail("FRAME_BATCH_MISMATCH");
  batch.operations.forEach((op, i) => {
    if (!ids.includes(op.op_id) || op.device_seq !== batch.firstSequence + i || op.device_id !== batch.deviceId || op.athlete_id !== batch.athleteId || op.lease_id !== batch.leaseId || JSON.stringify(body.collections.ops?.[op.op_id]) !== JSON.stringify(op) || body.collections.outbox?.[op.op_id]?.op_id !== op.op_id) fail("FRAME_BATCH_MISMATCH");
  });
}
function deepFreeze(value) { if (value && typeof value === "object" && !ArrayBuffer.isView(value) && !(value instanceof ArrayBuffer)) { Object.values(value).forEach(deepFreeze); Object.freeze(value); } return value; }

// This mechanical repository has no production clock/fence/permission implementation.
export async function openFrameRepository({ indexedDB = globalThis.indexedDB, crypto = globalThis.crypto, databaseName, namespace,
  bodyKeyProvider, frameKeyProvider, legacyKeyProvider, proofValidators = {}, authorizeEnrollment } = {}) {
  namespaceBytes(namespace);
  if (!indexedDB || !crypto?.subtle || !databaseName || typeof bodyKeyProvider !== "function" || typeof frameKeyProvider !== "function") fail("FRAME_REPOSITORY_CONFIGURATION");
  const validators = { ...proofValidators }, prepared = new WeakMap(), snapshots = new WeakMap();
  const remember = value => { snapshots.set(value, clone(value)); return value; };
  const db = await new Promise((resolve, reject) => {
    let refused = false; const request = indexedDB.open(databaseName, 2);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
    request.onerror = () => reject(new StorageFailure("FRAME_DATABASE_OPEN_FAILED", 18));
    request.onblocked = () => { refused = true; reject(new StorageFailure("FRAME_UPGRADE_BLOCKED", 18)); };
    request.onsuccess = () => { if (refused) { request.result.close(); return; } request.result.onversionchange = () => request.result.close(); resolve(request.result); };
  });
  async function key(epoch) {
    try { const key = await bodyKeyProvider({ namespace, format: 2, keyEpoch: epoch }); if (!key || key.algorithm?.name !== "AES-GCM" || key.algorithm.length !== 256) throw new Error(); return key; }
    catch { fail("FRAME_BODY_KEY_UNAVAILABLE"); }
  }
  const bodyAad = body => encoder.encode(JSON.stringify(["earned/local-body/v2", 2, namespace, body.keyEpoch, body.aadRevision]));
  async function unsealBody(record) {
    try { return parseStrictJson(new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: record.iv, additionalData: bodyAad(record), tagLength: 128 }, await key(record.keyEpoch), record.ciphertext))); }
    catch { fail("FRAME_BODY_UNPROVEN"); }
  }
  async function unsealV1(record) {
    validateV1Record(record); if (record.namespace !== namespace || typeof legacyKeyProvider !== "function") fail("FRAME_V1_KEY_UNAVAILABLE");
    try {
      const key = await legacyKeyProvider({ namespace, format: 1 });
      if (key.algorithm?.name !== "AES-GCM" || key.algorithm.length !== 256) throw new Error();
      return parseStrictJson(new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: record.iv, additionalData: encoder.encode(JSON.stringify(["earned/local-generation/v1", 1, namespace, record.revision])), tagLength: 128 }, key, record.ciphertext)));
    } catch { fail("FRAME_V1_INTEGRITY_UNPROVEN"); }
  }
  async function unseal(record) {
    validateRecord(record); if (record.namespace !== namespace) fail("FRAME_SCOPE_MISMATCH");
    let material; try { material = keyMaterial(await frameKeyProvider({ namespace, format: 2, keyEpoch: record.frameKeyEpoch }), record.frameKeyEpoch, record.commitRevision); }
    catch (error) { if (error instanceof StorageFailure) throw error; fail("FRAME_KEY_UNAVAILABLE"); }
    let frame; try { frame = decodeFrame(decryptFrame(material, record.frameNonce, frameAad(record), record.frameCiphertext)); } finally { material.fill(0); }
    const body = await unsealBody(record.body); validateProofs(body, validators, frame);
    return { body, frame };
  }
  function records() {
    return new Promise((resolve, reject) => {
      let tx, active, previous;
      try { tx = db.transaction(STORE, "readonly"); const store = tx.objectStore(STORE); const a = store.get("active"), p = store.get("previous"); a.onsuccess = () => { active = a.result; }; p.onsuccess = () => { previous = p.result; }; }
      catch { reject(new StorageFailure("FRAME_DATABASE_READ_FAILED", 18)); return; }
      tx.oncomplete = () => resolve({ active, previous }); tx.onabort = () => reject(new StorageFailure("FRAME_DATABASE_READ_FAILED", 18)); tx.onerror = () => {};
    });
  }
  async function load({ compatibility = false } = {}) {
    const { active, previous } = await records(); if (!active) fail("FRAME_STORE_MISSING");
    if (active.format === 1) {
      if (!compatibility) fail("FRAME_V1_CONVERSION_REQUIRED");
      const generation = await unsealV1(active); if (previous) await unsealV1(previous);
      return remember({ revision: active.revision, token: pairToken(active, previous), legacy: generation, active: clone(active), previous: clone(previous) });
    }
    validateRecord(active); const expected = previous === undefined ? new Uint8Array(32) : digest(recordBytes(previous));
    if (!sameBytes(active.previousRecordDigest, expected) || previous === undefined && active.commitRevision !== 1 || previous !== undefined && allZero(expected)) fail("FRAME_PREDECESSOR_UNPROVEN");
    const decoded = await unseal(active);
    if (previous !== undefined) {
      if (previous.format === 1) { if (decoded.frame.kind !== 3) fail("FRAME_V1_PREDECESSOR_KIND"); await unsealV1(previous); }
      else await unseal(previous); // Own stored parent digest is authenticated; no third generation is required.
    }
    return remember({ revision: active.commitRevision, token: pairToken(active, previous), ...decoded, active: clone(active), previous: clone(previous),
      unproven: !decoded.frame.checkpointRef || decoded.frame.guard !== 2 || decoded.frame.state !== 0 });
  }
  async function prepare(expected, bodyInput, { bodyKeyEpoch, frameKeyEpoch, batch = null, compatibility = false } = {}) {
    safe(bodyKeyEpoch, true); safe(frameKeyEpoch, true);
    const trusted = expected === null ? null : snapshots.get(expected);
    if (expected !== null && (!trusted || expected.revision !== trusted.revision || expected.token !== trusted.token)) fail("FRAME_EXPECTED_INVALID");
    const basis = trusted === null ? null : clone(trusted);
    if (basis) { safe(basis.revision, true); if (basis.revision >= Number.MAX_SAFE_INTEGER || typeof basis.token !== "string" || pairToken(basis.active, basis.previous) !== basis.token) fail("FRAME_EXPECTED_INVALID"); }
    bodyShape(bodyInput);
    const revision = basis ? basis.revision + 1 : 1, payload = clone(bodyInput), entries = validateProofs(payload, validators);
    if (compatibility && (!basis?.legacy || JSON.stringify(payload.collections) !== JSON.stringify(basis.legacy.collections) || JSON.stringify(payload.retainedMetadata) !== JSON.stringify(basis.legacy.metadata))) fail("FRAME_CONVERSION_LOSS");
    let material; try { material = keyMaterial(await frameKeyProvider({ namespace, format: 2, keyEpoch: frameKeyEpoch }), frameKeyEpoch, revision, true); }
    catch (error) { if (error instanceof StorageFailure) throw error; fail("FRAME_KEY_UNAVAILABLE"); }
    const attempt = createFrameAttempt(material, crypto); material.fill(0);
    try {
      const body = { format: 2, keyEpoch: bodyKeyEpoch, aadRevision: revision, iv: crypto.getRandomValues(new Uint8Array(12)), ciphertext: null };
      body.ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: body.iv, additionalData: bodyAad(body), tagLength: 128 }, await key(bodyKeyEpoch), encoder.encode(JSON.stringify(payload)));
      const batchCopy = clone(batch); let batchRef = null;
      if (batchCopy !== null) {
        batchRef = digestHex(encoder.encode(JSON.stringify(batchCopy)));
        validateBatch(payload, basis?.body, { kind: 0, batchCount: batchCopy.count, firstSequence: batchCopy.firstSequence, lastSequence: batchCopy.lastSequence, batchRef }, batchCopy);
      }
      const bodyDigest = digest(new Uint8Array(body.ciphertext)), priorBodyDigest = basis?.active.format === 2 ? digest(new Uint8Array(basis.active.body.ciphertext)) : null;
      const priorEntries = basis?.body ? validateProofs(basis.body, validators) : null;
      const capability = Object.freeze({});
      prepared.set(capability, { basis, revision, payload, body, bodyDigest, bodyDigestHex: digestHex(new Uint8Array(body.ciphertext)), priorBodyDigest, entries, priorEntries, previousDigest: basis ? digest(recordBytes(basis.active)) : new Uint8Array(32), frameKeyEpoch, attempt, batch: batchCopy, batchRef, compatibility, used: false });
      return capability;
    } catch (error) { attempt.discard(); if (error instanceof StorageFailure) throw error; fail("FRAME_PREPARE_FAILED", 3); }
  }
  async function commitPrepared(expected, capability, finalizeSync, { enrollmentEvidence } = {}) {
    const p = prepared.get(capability); if (!p || p.used) fail("FRAME_PREPARED_CONSUMED", 3); p.used = true;
    if (typeof finalizeSync !== "function" || (expected === null) !== (p.basis === null) || expected && (expected.revision !== p.basis.revision || expected.token !== p.basis.token)) { p.attempt.discard(); fail("FRAME_EXPECTED_INVALID"); }
    if (!p.basis) { let authorized = false; try { authorized = typeof authorizeEnrollment === "function" && await authorizeEnrollment(enrollmentEvidence, { namespace, databaseName }); } catch {} if (authorized !== true) { p.attempt.discard(); fail("FRAME_ENROLLMENT_UNPROVEN"); } }
    return new Promise((resolve, reject) => {
      let tx, rejected = null, outcome;
      const abort = error => { rejected = error; try { tx.abort(); } catch {} };
      try { tx = db.transaction(STORE, "readwrite", { durability: "strict" }); } catch { p.attempt.discard(); reject(new StorageFailure("FRAME_TRANSACTION_BEGIN_FAILED", 3)); return; }
      const store = tx.objectStore(STORE); let active, previous, read = 0;
      const a = store.get("active"), b = store.get("previous");
      a.onsuccess = () => { active = a.result; if (++read === 2) write(); }; b.onsuccess = () => { previous = b.result; if (++read === 2) write(); };
      function write() {
        try {
          if (p.basis === null) { if (active !== undefined || previous !== undefined) fail("FRAME_ALREADY_INITIALIZED"); }
          else {
            if (active === undefined) fail("FRAME_STORE_MISSING");
            const revision = active.format === 1 ? active.revision : active.commitRevision;
            if (revision !== p.basis.revision) throw new StorageFailure("STALE_REVISION", 3, true);
            if (pairToken(active, previous) !== p.basis.token) fail("FRAME_HEAD_CHANGED_WITHOUT_REVISION");
          }
          const decision = finalizeSync(deepFreeze(clone({ basis: p.basis && { body: p.basis.body, frame: p.basis.frame, legacy: p.basis.legacy, revision: p.basis.revision }, batch: p.batch,
            preparedBody: { keyEpoch: p.body.keyEpoch, aadRevision: p.body.aadRevision, digest: p.bodyDigestHex } })));
          if (decision?.kind === "abort") { exactObject(decision, ["kind", "state", "code", "retryable"]); if (![3, 17, 18, 19, 20].includes(decision.state) || typeof decision.code !== "string" || typeof decision.retryable !== "boolean") fail(); throw new StorageFailure(decision.code, decision.state, decision.retryable); }
          const control = decision?.kind === "control";
          exactObject(decision, control ? ["kind", "frameFields", "state", "code"] : ["kind", "frameFields"]);
          if (!control && decision.kind !== "publish") fail("FRAME_FINALIZER_INVALID", 3);
          validateFrame(decision.frameFields); const fields = clone(decision.frameFields);
          let body = p.body, entries = p.entries, bodyDigest = p.bodyDigest;
          if (control) {
            if (!p.basis?.body || active.format !== 2 || fields.kind !== 2 || ![17, 18, 19, 20].includes(decision.state) || fields.state !== decision.state || typeof decision.code !== "string" || fields.U !== p.basis.frame.U || fields.guard !== p.basis.frame.guard || fields.checkpointRef !== p.basis.frame.checkpointRef) fail("FRAME_CONTROL_INVALID");
            body = clone(active.body); entries = p.priorEntries; bodyDigest = p.priorBodyDigest;
          }
          if (p.compatibility && fields.kind !== 3 || !p.compatibility && active?.format === 1) fail("FRAME_CONVERSION_REQUIRED");
          validateReferences(entries, fields);
          if (fields.kind === 0) {
            if (!p.batch || fields.batchRef !== p.batchRef || fields.batchCount !== p.batch.count || fields.firstSequence !== p.batch.firstSequence || fields.lastSequence !== p.batch.lastSequence || fields.U !== (p.basis?.frame.U || 0) + p.batch.count || fields.checkpointRef !== (p.basis?.frame.checkpointRef ?? null)) fail("FRAME_BATCH_MISMATCH");
          } else if (!control && p.batch !== null) fail("FRAME_BATCH_MISMATCH");
          const record = { format: 2, namespace, commitRevision: p.revision, body, frameKeyEpoch: p.frameKeyEpoch, frameNonce: p.attempt.nonce(), frameCiphertext: new Uint8Array(368), previousRecordDigest: p.previousDigest };
          record.frameCiphertext = p.attempt.encrypt(frameAad(record, bodyDigest), encodeFrame(fields));
          if (active !== undefined) store.put(active, "previous"); store.put(record, "active");
          outcome = { stored: true, durable: true, revision: p.revision, kind: decision.kind, state: control ? decision.state : fields.state, code: control ? decision.code : null };
        } catch (error) { abort(error instanceof StorageFailure ? error : new StorageFailure("FRAME_FINALIZER_FAILED", 3)); }
      }
      tx.oncomplete = () => { p.attempt.discard(); resolve({ ...outcome, durability: { requested: "strict", actual: tx.durability || "unreported" } }); };
      tx.onabort = () => { p.attempt.discard(); reject(rejected || new StorageFailure("FRAME_TRANSACTION_ABORTED", 3)); }; tx.onerror = () => {};
    });
  }
  return Object.freeze({ load, prepare, commitPrepared, close() { db.close(); } });
}
