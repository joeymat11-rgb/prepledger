// Inactive import originals and a named checkpoint in the existing generations
// store. Local encryption/custody is not an authority activation or a K1 fence.
const PROFILE = 'earned/local-import-custody/v1', STORE = 'generations';
const encoder = new TextEncoder();
const clone = value => structuredClone(value);
const exact = (value, fields) => value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).length === fields.length && fields.every(field => Object.hasOwn(value, field));
const validId = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(value);

export function createImportCustody({db, namespace, crypto, key, loadActive, activeToken,
  parseStrictJson, validateContext, StorageFailure}) {
  const fail = (code, state = 18, retryable = false) => { throw new StorageFailure(code, state, retryable); };
  if (typeof parseStrictJson !== 'function' || typeof validateContext !== 'function') fail('IMPORT_CUSTODY_CONFIGURATION');
  const checkContext = () => {
    let result;
    try { result = validateContext(); } catch { fail('IMPORT_CUSTODY_GUARD_FAILED', 18); }
    if (result?.then) fail('IMPORT_CUSTODY_ASYNC_GUARD', 3);
    if (result) fail(result.code || 'IMPORT_CUSTODY_REFUSED', result.state || 18);
  };
  const recordKey = id => [PROFILE, id];
  const aad = id => encoder.encode(JSON.stringify([PROFILE, namespace, id]));
  const read = id => new Promise((resolve, reject) => {
    let tx, value;
    try {
      tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(recordKey(id));
      request.onsuccess = () => { value = request.result; };
    } catch { reject(new StorageFailure('IMPORT_CUSTODY_READ_FAILED', 18)); return; }
    tx.oncomplete = () => resolve(value);
    tx.onabort = () => reject(new StorageFailure('IMPORT_CUSTODY_READ_FAILED', 18));
    tx.onerror = () => {};
  });
  function text(bytes) {
    if (!(bytes instanceof Uint8Array)) fail('IMPORT_CUSTODY_BYTES_REQUIRED');
    try {
      const value = new TextDecoder('utf-8', {fatal: true, ignoreBOM: true}).decode(bytes);
      // Check without normalizing: original spacing, Unicode and key order stay.
      parseStrictJson(value);
      return value;
    } catch { fail('IMPORT_CUSTODY_JSON_INVALID'); }
  }
  function material(input) {
    try {
      if (!exact(input, ['sourceBytes', 'candidateBytes', 'localBytes', 'engineContextJson']) ||
          typeof input.engineContextJson !== 'string') fail('IMPORT_CUSTODY_INPUT');
      parseStrictJson(input.engineContextJson);
      return {source_json: text(input.sourceBytes), candidate_json: text(input.candidateBytes),
        local_json: input.localBytes === null ? null : text(input.localBytes), engine_context_json: input.engineContextJson};
    } catch (error) {
      if (error instanceof StorageFailure) throw error;
      fail('IMPORT_CUSTODY_INPUT');
    }
  }
  function shape(value, id) {
    if (!exact(value, ['profile', 'source_id', 'material', 'checkpoint']) || value.profile !== PROFILE || value.source_id !== id ||
        !exact(value.material, ['source_json', 'candidate_json', 'local_json', 'engine_context_json']) ||
        !exact(value.checkpoint, ['revision', 'token', 'generation']) ||
        !Number.isSafeInteger(value.checkpoint.revision) || value.checkpoint.revision < 1 || typeof value.checkpoint.token !== 'string' ||
        !value.checkpoint.generation?.collections || !value.checkpoint.generation?.metadata) fail('IMPORT_CUSTODY_INTEGRITY');
    for (const field of ['source_json', 'candidate_json', 'engine_context_json']) {
      if (typeof value.material[field] !== 'string') fail('IMPORT_CUSTODY_INTEGRITY');
      parseStrictJson(value.material[field]);
    }
    if (value.material.local_json !== null) {
      if (typeof value.material.local_json !== 'string') fail('IMPORT_CUSTODY_INTEGRITY');
      parseStrictJson(value.material.local_json);
    }
    return value;
  }
  async function unseal(record, id) {
    try {
      if (!exact(record, ['profile', 'source_id', 'iv', 'ciphertext']) || record.profile !== PROFILE || record.source_id !== id ||
          !(record.iv instanceof Uint8Array) || record.iv.length !== 12 || !(record.ciphertext instanceof ArrayBuffer)) fail('IMPORT_CUSTODY_INTEGRITY');
      const bytes = await crypto.subtle.decrypt({name: 'AES-GCM', iv: record.iv, additionalData: aad(id)}, await key(), record.ciphertext);
      return shape(parseStrictJson(new Uint8Array(bytes)), id);
    } catch (error) {
      if (error instanceof StorageFailure && error.code === 'DECRYPTION_UNAVAILABLE') throw error;
      fail('IMPORT_CUSTODY_INTEGRITY');
    }
  }
  async function seal(value) {
    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await crypto.subtle.encrypt({name: 'AES-GCM', iv, additionalData: aad(value.source_id)},
        await key(), encoder.encode(JSON.stringify(value)));
      return {profile: PROFILE, source_id: value.source_id, iv, ciphertext};
    } catch (error) {
      if (error instanceof StorageFailure) throw error;
      fail('IMPORT_CUSTODY_SEAL_FAILED', 3);
    }
  }
  function publish(expected, record) {
    return new Promise((resolve, reject) => {
      let tx, refusal;
      const abort = error => { refusal = error; try { tx.abort(); } catch {} };
      try { tx = db.transaction(STORE, 'readwrite', {durability: 'strict'}); }
      catch { reject(new StorageFailure('IMPORT_CUSTODY_BEGIN_FAILED', 3)); return; }
      const store = tx.objectStore(STORE), current = store.get('active');
      current.onsuccess = () => {
        try {
          if (current.result?.revision !== expected.revision || activeToken(current.result) !== expected.token)
            fail('IMPORT_CUSTODY_STALE_BASIS', 3, true);
          const prior = store.get(recordKey(record.source_id));
          prior.onsuccess = () => {
            try {
              if (prior.result !== undefined) fail('IMPORT_CUSTODY_CHANGED', 3, true);
              checkContext();
              store.add(record, recordKey(record.source_id));
            } catch (error) { abort(error instanceof StorageFailure ? error : new StorageFailure('IMPORT_CUSTODY_WRITE_FAILED', 3)); }
          };
        } catch (error) { abort(error instanceof StorageFailure ? error : new StorageFailure('IMPORT_CUSTODY_WRITE_FAILED', 3)); }
      };
      tx.oncomplete = resolve;
      tx.onabort = () => reject(refusal || new StorageFailure('IMPORT_CUSTODY_ABORTED', 3));
      tx.onerror = () => {};
    });
  }
  const receipt = value => Object.freeze({source_id: value.source_id,
    checkpoint_revision: value.checkpoint.revision, staged: true, activation: 'pending'});
  return Object.freeze({
    async stage(id, expected, input) {
      if (!validId(id) || !Number.isSafeInteger(expected?.revision) || expected.revision < 1 || typeof expected.token !== 'string')
        fail('IMPORT_CUSTODY_INPUT');
      const basis = {revision: expected.revision, token: expected.token}, captured = material(input);
      checkContext();
      const existing = await read(id);
      if (existing !== undefined) {
        const value = await unseal(existing, id);
        if (value.checkpoint.revision !== basis.revision || value.checkpoint.token !== basis.token ||
            JSON.stringify(value.material) !== JSON.stringify(captured)) fail('IMPORT_CUSTODY_ID_CONFLICT');
        checkContext(); return receipt(value);
      }
      // Get the checkpoint from the actual encrypted active record, never from
      // a caller-supplied expected.generation or derived preview state.
      const checkpoint = await loadActive();
      if (checkpoint.revision !== basis.revision || checkpoint.token !== basis.token) fail('IMPORT_CUSTODY_STALE_BASIS', 3, true);
      const value = {profile: PROFILE, source_id: id, material: captured, checkpoint};
      const record = await seal(value);
      await publish(basis, record);
      return receipt(value);
    },
    async load(id) {
      if (!validId(id)) fail('IMPORT_CUSTODY_INPUT');
      checkContext();
      const record = await read(id);
      if (record === undefined) fail('IMPORT_CUSTODY_MISSING');
      const value = await unseal(record, id);
      checkContext();
      return {...receipt(value), sourceBytes: encoder.encode(value.material.source_json),
        candidateBytes: encoder.encode(value.material.candidate_json),
        localBytes: value.material.local_json === null ? null : encoder.encode(value.material.local_json),
        engineContextJson: value.material.engine_context_json, checkpoint: clone(value.checkpoint)};
    },
  });
}
