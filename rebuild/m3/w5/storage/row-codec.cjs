'use strict';

const C = require('../reconciliation/codec.cjs');
const { COLLECTIONS } = require('../reconciliation/project.cjs');
const PROFILE = 'earned/authority-row/v1';
const RAW = ['athlete', 'collection', 'row_id', 'value'];
const PHYSICAL = [...RAW, 'sealed', 'storage_revision'];
const ENVELOPE = ['profile', 'key_epoch', 'wrapped_key_b64', 'iv_b64', 'ciphertext_b64'];
const supported = new Set(COLLECTIONS);
const integrity = () => new C.R1Error('RETAINED_INTEGRITY', 500, false);
const unavailable = () => new C.R1Error('UNAVAILABLE', 503, true);

// Own data properties are captured synchronously; no caller object survives an await.
function snapshot(value, fields) {
  C.exact(value, fields);
  if (Reflect.ownKeys(value).length !== fields.length) throw integrity();
  const copy = {};
  for (const field of fields) {
    const d = Object.getOwnPropertyDescriptor(value, field);
    if (!d || !d.enumerable || !Object.hasOwn(d, 'value')) throw integrity();
    copy[field] = d.value;
  }
  return copy;
}
function string(value, nonempty = true) {
  if (typeof value !== 'string' || (nonempty && !value.length)) throw integrity();
  // Same round-trip validity as the former UTF-8 encode/copy/decode, without
  // materializing multiple full buffers for an already-owned immutable string.
  // Keep the decoder's existing leading-BOM refusal; embedded BOM/NUL and NFD
  // remain literal data. Only unmatched UTF-16 surrogates would be replaced.
  if (value.charCodeAt(0) === 0xfeff) throw integrity();
  for (let i=0;i<value.length;i++) {
    const code=value.charCodeAt(i);
    if(code>=0xd800&&code<=0xdbff){
      const next=value.charCodeAt(++i);
      if(!(next>=0xdc00&&next<=0xdfff))throw integrity();
    }else if(code>=0xdc00&&code<=0xdfff)throw integrity();
  }
  return value;
}
function parse(value) {
  string(value, false);
  // Storage limits belong to the bridge; the R1 payload default is not a storage cap.
  const parsed = C.parseOwnedText(value);
  if (!C.object(parsed)) throw integrity();
  return parsed;
}
function pick(original, fields) {
  const out = {};
  for (const field of fields) {
    if (!Object.hasOwn(original, field)) throw integrity();
    const value = original[field];
    // SQL projection fields are scalar; never copy an unexpected nested payload.
    if (value !== null && typeof value === 'object') throw integrity();
    out[field] = value;
  }
  return out;
}
function projection(collection, original) {
  let out;
  switch (collection) {
    case 'accountRegistry': out = pick(original, ['profile', 'account_epoch', 'state', 'history_origin']); break;
    case 'deviceIssuance': out = pick(original, ['device_id', 'creation_epoch', 'current_lease_id', 'issue_ordinal']); break;
    case 'issuedLeases':
      if (!C.object(original.lease)) throw integrity();
      out = { lease: pick(original.lease, ['athlete_id', 'device_id', 'lease_id']), lease_bytes_b64: 'P1_SEALED',
        ...pick(original, ['issuer_profile', 'issue_ordinal', 'issuance_intent_digest', 'account_epoch', 'creation_epoch']) };
      break;
    case 'issuanceIntents': out = pick(original, ['stable_request_digest', 'lease_id', 'result_creation_epoch']); break;
    case 'enrollmentIntents': out = pick(original, ['stable_request_digest', 'device_id', 'lease_id']); break;
    case 'standingEvents': out = { ...pick(original, ['kind', 'athlete_id', 'device_id', 'account_epoch', 'creation_epoch']), evidence: {} }; break;
    default: out = { p1: PROFILE };
  }
  return JSON.stringify(out);
}
function identity(row, sourceProfile) {
  for (const field of RAW) string(row[field], field !== 'value');
  if (!supported.has(row.collection) && !(sourceProfile === 'earned/source-import/v1' && row.collection === 'sourceImports')) throw integrity();
}
function aad(namespace, row, envelope) {
  return C.bytes(JSON.stringify(['earned/authority-row/aad/v1', namespace, row.athlete,
    row.collection, row.row_id, String(row.storage_revision), envelope.profile,
    envelope.key_epoch, row.value]));
}

function createAuthorityRowCodec({ namespace, getWrappingKey, crypto = globalThis.crypto, sourceProfile }) {
  if (sourceProfile !== undefined && sourceProfile !== 'earned/source-import/v1') throw integrity();
  try {
    string(namespace);
    if (typeof getWrappingKey !== 'function' || !crypto?.subtle || typeof crypto.getRandomValues !== 'function') throw unavailable();
  } catch (_) { throw unavailable(); }
  // Namespace and provider are trusted deployment inputs, not request authorization.
  const subtle = crypto.subtle;
  async function key(epoch, purpose) {
    try {
      const result = await getWrappingKey(Object.freeze({ namespace, epoch, purpose }));
      const usage = purpose === 'write' ? 'wrapKey' : 'unwrapKey';
      if (!result || result.type !== 'secret' || result.extractable !== false ||
          result.algorithm?.name !== 'AES-KW' || result.algorithm.length !== 256 ||
          !Array.isArray(result.usages) || !result.usages.includes(usage) ||
          result.usages.some(x => x !== 'wrapKey' && x !== 'unwrapKey')) throw unavailable();
      return result;
    } catch (_) { throw unavailable(); }
  }
  return Object.freeze({
    async seal(rawRow, context) {
      let row, writeEpoch, original;
      try {
        row = snapshot(rawRow, RAW);
        const control = snapshot(context, ['revision', 'writeEpoch']);
        if (!C.safe(control.revision) || control.revision === Number.MAX_SAFE_INTEGER) throw integrity();
        writeEpoch = string(control.writeEpoch);
        identity(row, sourceProfile);
        original = C.bytes(row.value);
        row.value = projection(row.collection, parse(row.value));
        row.storage_revision = control.revision + 1;
      } catch (_) { throw integrity(); }
      const wrappingKey = await key(writeEpoch, 'write');
      try {
        // Each invocation (including a transaction retry) creates a new DEK and IV.
        const dek = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const envelope = { profile: PROFILE, key_epoch: writeEpoch,
          wrapped_key_b64: C.encode64(await subtle.wrapKey('raw', dek, wrappingKey, 'AES-KW')),
          iv_b64: C.encode64(iv), ciphertext_b64: '' };
        envelope.ciphertext_b64 = C.encode64(await subtle.encrypt({ name: 'AES-GCM', iv,
          additionalData: aad(namespace, row, envelope), tagLength: 128 }, dek, original));
        return { athlete: row.athlete, collection: row.collection, row_id: row.row_id,
          value: row.value, sealed: JSON.stringify(envelope), storage_revision: row.storage_revision };
      } catch (_) { throw unavailable(); }
    },
    async open(physicalRow, context) {
      let row, envelope, wrapped, iv, ciphertext;
      try {
        row = snapshot(physicalRow, PHYSICAL);
        const control = snapshot(context, ['revision']);
        identity(row, sourceProfile);
        parse(row.value);
        if (!C.safe(control.revision) || !C.safe(row.storage_revision, 1) || row.storage_revision > control.revision) throw integrity();
        envelope = parse(row.sealed);
        C.exact(envelope, ENVELOPE, { ordered: true });
        if (envelope.profile !== PROFILE) throw integrity();
        string(envelope.key_epoch);
        wrapped = C.decode64(envelope.wrapped_key_b64, 40);
        iv = C.decode64(envelope.iv_b64, 12);
        ciphertext = C.decode64(envelope.ciphertext_b64, Number.MAX_SAFE_INTEGER);
        if (wrapped.length !== 40 || iv.length !== 12 || ciphertext.length < 16) throw integrity();
      } catch (_) { throw integrity(); }
      const wrappingKey = await key(envelope.key_epoch, 'read');
      let dek;
      try {
        dek = await subtle.unwrapKey('raw', wrapped, wrappingKey, 'AES-KW',
          { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      } catch (error) {
        // A malformed provider handle fails native argument conversion. A valid
        // wrong key instead fails authentication and is indistinguishable from
        // a damaged stored wrapper; neither path exposes native diagnostics.
        throw error instanceof TypeError ? unavailable() : integrity();
      }
      try {
        const plaintext = await subtle.decrypt({ name: 'AES-GCM', iv,
          additionalData: aad(namespace, row, envelope), tagLength: 128 }, dek, ciphertext);
        // decrypt produced this private ArrayBuffer; no caller can mutate it.
        // Fatal UTF-8 stays enforced; parse/string below retains BOM refusal.
        const value = new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(plaintext);
        if (projection(row.collection, parse(value)) !== row.value) throw integrity();
        return { athlete: row.athlete, collection: row.collection, row_id: row.row_id, value };
      } catch (_) { throw integrity(); }
    }
  });
}

module.exports = { createAuthorityRowCodec };
