import { createRecoveryStage } from './recovery-stage.mjs';
import { createImportCustody } from './import-custody.mjs';
const FORMAT = 1;
const STORE = "generations";
// K1 — adoption evidence. recovery-stage.mjs states that the archive and the
// terminal page/head are one transaction and NEITHER IS AN ACTIVATION, so a
// completed archive is not evidence that any generation adopted it. Adoption
// is the COMMIT of a generation carrying archive proofs, and this record is
// written in that same transaction. It lives outside the sealed generation,
// so erasing the generation's own markers cannot remove it.
const ADOPTION = "recovery-adoption";
const ADOPTION_PROFILE = "earned/local-recovery-adoption/v1";
const clone = value => structuredClone(value);

export class StorageFailure extends Error {
  constructor(code, state, retryable = false) {
    super(code); this.name = "StorageFailure"; this.code = code; this.state = state; this.retryable = retryable;
  }
}

function object(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function jsonSafe(value, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number" && Number.isFinite(value)) return;
  if (typeof value !== "object" || seen.has(value)) throw new StorageFailure("NON_JSON_GENERATION", 3);
  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) throw new StorageFailure("NON_JSON_GENERATION", 3);
  seen.add(value);
  for (const item of Array.isArray(value) ? value : Object.values(value)) jsonSafe(item, seen);
  seen.delete(value);
}
function validateGeneration(value) {
  if (!object(value) || !object(value.collections) || !object(value.metadata)) throw new StorageFailure("INVALID_GENERATION", 18);
  for (const collection of Object.values(value.collections)) if (!object(collection)) throw new StorageFailure("INVALID_COLLECTION", 18);
  jsonSafe(value);
}
function validRecord(record, namespace) {
  return object(record) && record.format === FORMAT && record.namespace === namespace &&
    Number.isSafeInteger(record.revision) && record.revision > 0 &&
    record.iv instanceof Uint8Array && record.iv.length === 12 &&
    record.ciphertext instanceof ArrayBuffer && record.ciphertext.byteLength >= 16;
}
function token(record) {
  return JSON.stringify([record.format, record.namespace, record.revision,
    Array.from(record.iv), Array.from(new Uint8Array(record.ciphertext))]);
}

export async function openRepository({ indexedDB = globalThis.indexedDB, crypto = globalThis.crypto,
  databaseName, namespace, keyProvider, authorizeEnrollment } = {}) {
  if (!indexedDB || !crypto?.subtle || !databaseName || typeof namespace !== "string" || !namespace || typeof keyProvider !== "function") {
    throw new StorageFailure("REPOSITORY_CONFIGURATION_REQUIRED", 18);
  }
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, FORMAT);
    let refused = false;
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onerror = () => reject(new StorageFailure("DATABASE_OPEN_FAILED", 18));
    request.onblocked = () => { refused = true; reject(new StorageFailure("DATABASE_UPGRADE_BLOCKED", 18)); };
    request.onsuccess = () => {
      if (refused) { request.result.close(); return; }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
  const aad = revision => new TextEncoder().encode(JSON.stringify(["earned/local-generation/v1", FORMAT, namespace, revision]));
  async function key() {
    try {
      const value = await keyProvider({ namespace, format: FORMAT });
      if (!value || value.algorithm?.name !== "AES-GCM" || value.algorithm?.length !== 256) throw new Error();
      return value;
    } catch { throw new StorageFailure("DECRYPTION_UNAVAILABLE", 18); }
  }
  async function seal(generation, revision) {
    validateGeneration(generation);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const bytes = new TextEncoder().encode(JSON.stringify(generation));
    try {
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(revision), tagLength: 128 }, await key(), bytes);
      return { format: FORMAT, namespace, revision, iv, ciphertext };
    } catch (error) {
      if (error instanceof StorageFailure) throw error;
      throw new StorageFailure("SEAL_FAILED", 3);
    }
  }
  function recoveryDeclared(generation) {
    // The snapshot binding written beside every archive proof by
    // prepareRecoveryProjection (t2-stage.cjs:160,165). Its presence is the
    // generation's own declaration that its content came from a recovery.
    return generation?.collections?.sync?.snapshot?.recoveryPlan !== undefined;
  }
  function proofReferences(proofs) {
    const references = [];
    for (const proof of proofs) {
      const reference = proof?.reference;
      if (!object(reference) || typeof reference.attempt !== "string" || !reference.attempt) return null;
      references.push({ profile: typeof reference.profile === "string" ? reference.profile : null, attempt: reference.attempt });
    }
    return references;
  }
  // K1 correction-04 — adoption evidence must not be silently skippable.
  // A commit is the only adoption event, so a generation that CARRIES or
  // DECLARES recovered content but yields no usable reference used to fall
  // through as `null` and commit anyway, leaving recovered facts standing as
  // ordinary local truth with no evidence at all. Two shapes did that: a
  // proof whose `reference`/`reference.attempt` is malformed, and a candidate
  // whose proofs were stripped while its snapshot binding still declares the
  // recovery. Both are refused here, before publish() opens its transaction,
  // so neither active/previous nor the adoption record is written.
  //
  // The refusal is scoped to a lineage that has NO adoption evidence yet,
  // because that is the only state in which the omission can launder
  // recovered content: no repository method can remove an adoption record, so
  // once one exists every later read of a proof-less generation already fails
  // closed on it (recovery-history.mjs, both-absent branch). A lineage that is
  // already evidenced therefore keeps its existing commit behaviour exactly,
  // including the stored-state fixtures that install a stripped generation in
  // order to prove the read path refuses it.
  async function lineageAdopted() {
    try { return (await openAdoption(await readKey(ADOPTION))) !== null; }
    catch (error) {
      if (error instanceof StorageFailure && error.code === "DECRYPTION_UNAVAILABLE") throw error;
      // Unreadable evidence is not evidence.
      return false;
    }
  }
  async function refuseUnevidenced(code) {
    if (await lineageAdopted()) return null;
    throw new StorageFailure(code, 18);
  }
  async function adoptedReferences(generation) {
    const proofs = generation?.metadata?.recoveryArchives;
    if (proofs === undefined) {
      // Ordinary commit: nothing recovered is carried and nothing declared.
      if (!recoveryDeclared(generation)) return null;
      return refuseUnevidenced("RECOVERY_ADOPTION_PROOFS_STRIPPED");
    }
    if (!Array.isArray(proofs)) return refuseUnevidenced("RECOVERY_ADOPTION_REFERENCE_MALFORMED");
    if (!proofs.length) return refuseUnevidenced("RECOVERY_ADOPTION_PROOFS_STRIPPED");
    return proofReferences(proofs) || refuseUnevidenced("RECOVERY_ADOPTION_REFERENCE_MALFORMED");
  }
  // Sealed under the same namespace/revision-bound AAD as the generation, so
  // it is neither a caller-supplied claim nor a rewritable plain marker.
  async function sealAdoption(generation, revision) {
    const references = await adoptedReferences(generation);
    if (!references) return null;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const bytes = new TextEncoder().encode(JSON.stringify({ profile: ADOPTION_PROFILE, revision, references }));
    try {
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(revision), tagLength: 128 }, await key(), bytes);
      return { format: FORMAT, namespace, revision, iv, ciphertext };
    } catch (error) {
      if (error instanceof StorageFailure) throw error;
      throw new StorageFailure("SEAL_FAILED", 3);
    }
  }
  async function openAdoption(record) {
    if (record === undefined) return null;
    if (!validRecord(record, namespace)) throw new StorageFailure("RECOVERY_ADOPTION_INTEGRITY", 18);
    try {
      const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: record.iv, additionalData: aad(record.revision), tagLength: 128 }, await key(), record.ciphertext);
      const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      if (!object(value) || value.profile !== ADOPTION_PROFILE || value.revision !== record.revision ||
        !Array.isArray(value.references) || !value.references.length ||
        !value.references.every(reference => object(reference) && typeof reference.attempt === "string" && reference.attempt)) {
        throw new StorageFailure("RECOVERY_ADOPTION_INTEGRITY", 18);
      }
      return { revision: value.revision, references: value.references };
    } catch (error) {
      if (error instanceof StorageFailure && error.code === "DECRYPTION_UNAVAILABLE") throw error;
      throw new StorageFailure("RECOVERY_ADOPTION_INTEGRITY", 18);
    }
  }
  function readKey(storedKey) {
    return new Promise((resolve, reject) => {
      let tx, value;
      try {
        tx = db.transaction(STORE, "readonly");
        const request = tx.objectStore(STORE).get(storedKey);
        request.onsuccess = () => { value = request.result; };
      } catch { reject(new StorageFailure("DATABASE_READ_FAILED", 18)); return; }
      tx.oncomplete = () => resolve(value);
      tx.onabort = () => reject(new StorageFailure("DATABASE_READ_FAILED", 18));
      tx.onerror = () => {};
    });
  }
  async function unseal(record) {
    if (!validRecord(record, namespace)) throw new StorageFailure("STORED_INTEGRITY_UNPROVEN", 18);
    try {
      const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: record.iv, additionalData: aad(record.revision), tagLength: 128 }, await key(), record.ciphertext);
      const generation = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      validateGeneration(generation);
      return { revision: record.revision, token: token(record), generation };
    } catch (error) {
      if (error instanceof StorageFailure && error.code === "DECRYPTION_UNAVAILABLE") throw error;
      throw new StorageFailure("STORED_INTEGRITY_UNPROVEN", 18);
    }
  }
  function readRecords() {
    return new Promise((resolve, reject) => {
      let active, previous, tx;
      try {
        tx = db.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);
        const a = store.get("active"), p = store.get("previous");
        a.onsuccess = () => { active = a.result; };
        p.onsuccess = () => { previous = p.result; };
      } catch { reject(new StorageFailure("DATABASE_READ_FAILED", 18)); return; }
      tx.oncomplete = () => resolve({ active, previous });
      tx.onabort = () => reject(new StorageFailure("DATABASE_READ_FAILED", 18));
      tx.onerror = () => {};
    });
  }
  function publish(expected, record, validate, initializing = false, adoption = null) {
    return new Promise((resolve, reject) => {
      let tx, refusal = null, requestedStrict = true;
      try { tx = db.transaction(STORE, "readwrite", { durability: "strict" }); }
      catch (error) {
        if (!(error instanceof TypeError)) { reject(new StorageFailure("TRANSACTION_BEGIN_FAILED", 3)); return; }
        requestedStrict = false;
        try { tx = db.transaction(STORE, "readwrite"); }
        catch { reject(new StorageFailure("TRANSACTION_BEGIN_FAILED", 3)); return; }
      }
      const abort = error => { refusal = error; try { tx.abort(); } catch {} };
      const store = tx.objectStore(STORE);
      const request = store.get("active");
      request.onsuccess = () => {
        const current = request.result;
        if (initializing) {
          if (current !== undefined) { abort(new StorageFailure("ALREADY_INITIALIZED", 18)); return; }
          const prior = store.get("previous");
          prior.onsuccess = () => {
            if (prior.result !== undefined) { abort(new StorageFailure("MISSING_ACTIVE_GENERATION", 18)); return; }
            write(undefined);
          };
        } else {
          if (!validRecord(current, namespace)) { abort(new StorageFailure("STORED_INTEGRITY_UNPROVEN", 18)); return; }
          if (current.revision !== expected.revision) { abort(new StorageFailure("STALE_REVISION", 3, true)); return; }
          if (token(current) !== expected.token) { abort(new StorageFailure("HEAD_CHANGED_WITHOUT_REVISION", 18)); return; }
          write(current);
        }
      };
      function write(current) {
        try {
          const decision = validate?.();
          if (decision && typeof decision.then === "function") throw new StorageFailure("ASYNC_TRANSACTION_VALIDATOR", 3);
          if (decision) throw new StorageFailure(decision.code || "COMMIT_REFUSED", decision.state || 3);
          if (current) store.put(current, "previous");
          store.put(record, "active");
          // Same transaction as the active write: a refused or aborted
          // adoption writes neither, and a completed but uncommitted
          // recovery leaves no adoption evidence at all. Never cleared by a
          // later commit that omits the proofs, or dropping them would
          // become a way to discard the evidence.
          if (adoption) store.put(adoption, ADOPTION);
        } catch (error) { abort(error instanceof StorageFailure ? error : new StorageFailure("TRANSACTION_WRITE_FAILED", 3)); }
      }
      tx.oncomplete = () => resolve({ revision: record.revision, token: token(record), durability: {
        requested: requestedStrict ? "strict" : "default", actual: tx.durability || "unreported" } });
      tx.onabort = () => reject(refusal || new StorageFailure("TRANSACTION_ABORTED", 3));
      tx.onerror = () => {};
    });
  }
  async function loadActive() {
    const { active } = await readRecords();
    if (active === undefined) throw new StorageFailure("STORE_MISSING", 18);
    return unseal(active);
  }
  return {
    importCustody({parseStrictJson,validateContext}={}) {
      return createImportCustody({db,namespace,crypto,key,loadActive,parseStrictJson,validateContext,StorageFailure,
        activeToken(record) {
          if (!validRecord(record,namespace)) throw new StorageFailure('STORED_INTEGRITY_UNPROVEN',18);
          return token(record);
        }});
    },
    recovery({protocol,codec,verificationKeys,validateContext,keyRange=globalThis.IDBKeyRange}={}) {
      return createRecoveryStage({db,namespace,crypto,key,protocol,codec,verificationKeys,validateContext,keyRange,StorageFailure});
    },
    load: loadActive,
    async initialize(generation, evidence) {
      let allowed = false;
      try { allowed = typeof authorizeEnrollment === "function" && await authorizeEnrollment(evidence, { namespace, databaseName }); }
      catch {}
      if (allowed !== true) throw new StorageFailure("ENROLLMENT_UNPROVEN", 18);
      const record = await seal(clone(generation), 1);
      return publish(null, record, null, true);
    },
    async commit(expected, generation, validate) {
      if (!expected || !Number.isSafeInteger(expected.revision) || expected.revision < 1 || expected.revision >= Number.MAX_SAFE_INTEGER || typeof expected.token !== "string") {
        throw new StorageFailure("INVALID_EXPECTED_REVISION", 18);
      }
      const basis = Object.freeze({ revision: expected.revision, token: expected.token });
      // ONE immutable snapshot for both records. Sealing the active record and
      // then reading the caller's still-mutable generation for the adoption
      // record let a caller mutate between the two awaits, so the two records
      // could describe different generations. The clone is taken once,
      // synchronously, before any await, and both records are sealed from it.
      const snapshot = clone(generation);
      const record = await seal(snapshot, basis.revision + 1);
      // May refuse (RECOVERY_ADOPTION_REFERENCE_MALFORMED /
      // RECOVERY_ADOPTION_PROOFS_STRIPPED). Both refusals happen here, before
      // publish() opens its transaction, so no record of any kind is written
      // and the prior generation stays exactly as it was.
      const adoption = await sealAdoption(snapshot, basis.revision + 1);
      return publish(basis, record, validate, false, adoption);
    },
    // Authenticated evidence that a generation in THIS namespace's lineage
    // actually adopted a recovery. Absent for a never-recovered profile, for
    // a completed but uncommitted recovery, and for a failed adoption.
    async recoveryAdoption() { return openAdoption(await readKey(ADOPTION)); },
    close() { db.close(); },
  };
}
