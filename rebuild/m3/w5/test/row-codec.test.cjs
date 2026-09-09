'use strict';
const assert = require('node:assert/strict');
const { webcrypto: crypto } = require('node:crypto');
const C = require('../reconciliation/codec.cjs');
const { COLLECTIONS } = require('../reconciliation/project.cjs');
const { createAuthorityRowCodec } = require('../storage/row-codec.cjs');
const tests = [];
const test = (name, fn) => tests.push([name, fn]);
const P = 'earned/authority-row/v1';
const constant = '{"p1":"earned/authority-row/v1"}';
const namespace = 'synthetic:storage/ café';
const canary = 'SYNTHETIC_ONLY_SECRET_CANARY';
const keys = new Map();
const requests = [];
const provider = async request => { requests.push(request); if (!keys.has(request.epoch)) throw Error(canary); return keys.get(request.epoch); };
const make = (options = {}) => createAuthorityRowCodec({ namespace, getWrappingKey: provider, crypto, ...options });
const raw = (value = '{ "z" : "SYNTHETIC_ONLY_SECRET_CANARY / café", "a": "\\u0061", "n":1e0 }\n', collection = 'operations') =>
  ({ athlete: 'synthetic-a', collection, row_id: 'synthetic-row', value });
const seal = (codec, row = raw(), revision = 0, writeEpoch = 'old') => codec.seal(row, { revision, writeEpoch });
const open = (codec, row, revision = row.storage_revision) => codec.open(row, { revision });
const changeEnvelope = (row, change) => ({ ...row, sealed: JSON.stringify(change(JSON.parse(row.sealed))) });
async function refuses(promise, code = 'RETAINED_INTEGRITY') {
  await assert.rejects(promise, error => {
    assert.equal(error.name, 'R1Error'); assert.equal(error.message, code); assert.equal(error.code, code);
    assert.equal(error.status, code === 'UNAVAILABLE' ? 503 : 500);
    assert.equal(error.retryable, code === 'UNAVAILABLE'); assert.equal(Object.hasOwn(error, 'cause'), false);
    assert.equal(String(error).includes(canary), false); return true;
  });
}
const projections = {
  accountRegistry: { profile: 'earned/r1/v1', account_epoch: 1, state: 'ACTIVE', history_origin: 'PROFILE_GENESIS' },
  deviceIssuance: { device_id: 'synthetic-device', creation_epoch: 1, current_lease_id: 'synthetic-lease', issue_ordinal: 1 },
  issuedLeases: { lease: { athlete_id: 'synthetic-a', device_id: 'synthetic-device', lease_id: 'synthetic-lease' }, lease_bytes_b64: 'P1_SEALED', issuer_profile: 'earned/r1/v1', issue_ordinal: 1, issuance_intent_digest: 'synthetic-digest', account_epoch: 1, creation_epoch: 1 },
  issuanceIntents: { stable_request_digest: 'synthetic-digest', lease_id: 'synthetic-lease', result_creation_epoch: 1 },
  enrollmentIntents: { stable_request_digest: 'synthetic-digest', device_id: 'synthetic-device', lease_id: 'synthetic-lease' },
  standingEvents: { kind: 'DEVICE_ENROLLED', athlete_id: 'synthetic-a', device_id: 'synthetic-device', account_epoch: 1, creation_epoch: 1, evidence: {} }
};
for (const collection of COLLECTIONS) test(`roundtrip-${collection}`, async () => {
  const original = structuredClone(projections[collection] || { payload: canary });
  original.extension = { nested: canary };
  if (collection === 'issuedLeases') {
    Object.assign(original.lease, { schema_version: 1, range: [1, 10], signature: 'synthetic-signature',
      not_before: '2026-09-01T00:00:00Z', not_after: '2026-10-01T00:00:00Z', extension: { signed: canary } });
    original.lease_bytes_b64 = C.encode64(C.bytes(JSON.stringify(original.lease)));
  }
  if (collection === 'standingEvents') original.evidence = { nested: canary };
  const row = raw(' \n' + JSON.stringify(original, null, 2) + '\n', collection);
  const codec = make(), physical = await seal(codec, row);
  assert.deepEqual(Object.keys(physical), ['athlete', 'collection', 'row_id', 'value', 'sealed', 'storage_revision']);
  assert.equal(physical.value, projections[collection] ? JSON.stringify(projections[collection]) : constant);
  assert.equal(physical.value.includes(canary), false); assert.equal(physical.sealed.includes(canary), false);
  assert.deepEqual(await open(codec, physical), row);
});
test('raw-whitespace-order-escaping', async () => {
  const codec = make(), row = raw();
  assert.notEqual(row.value, JSON.stringify(JSON.parse(row.value)));
  assert.deepEqual(await open(codec, await seal(codec, row)), row);
  const escaped = raw('{"escaped":"\\ud800","unicode":"café\\u0061","n":1e0}');
  assert.deepEqual(await open(codec, await seal(codec, escaped)), escaped);
});
test('raw-strict-json-shape-utf8', async () => {
  const codec = make();
  for (const value of ['{"a":1,"a":2}', '{"x":{"a":1,"\\u0061":2}}', '[]', 'null', '{', '\ufeff{}', '{"x":"\ud800"}']) await refuses(seal(codec, raw(value)));
  await refuses(seal(codec, { ...raw(), extra: 1 }));
  await refuses(seal(codec, raw('{}', 'unknownCollection')));
  await refuses(seal(codec, { ...raw(), [Symbol('extra')]: true }));
  await refuses(seal(codec, Object.defineProperty(raw(), 'value', { get() { throw Error(canary); } })));
  await refuses(seal(codec, raw('{"profile":{"nested":"' + canary + '"}}', 'accountRegistry')));
});
test('envelope-structural-refusal-before-provider', async () => {
  const codec = make(), row = await seal(codec), env = JSON.parse(row.sealed);
  const bad = [
    '{', '\ufeff' + row.sealed, row.sealed.slice(0, -1) + ',"profile":"' + P + '"}',
    row.sealed.slice(0, -1) + ',"\\u0070rofile":"' + P + '"}',
    JSON.stringify({ ...env, extra: true }), JSON.stringify({ ...env, profile: 'wrong' }),
    JSON.stringify({ key_epoch: env.key_epoch, profile: env.profile, wrapped_key_b64: env.wrapped_key_b64, iv_b64: env.iv_b64, ciphertext_b64: env.ciphertext_b64 }),
    JSON.stringify({ ...env, key_epoch: '' }), JSON.stringify({ ...env, key_epoch: '\ud800' })
  ];
  for (const name of ['wrapped_key_b64', 'iv_b64', 'ciphertext_b64']) {
    bad.push(JSON.stringify({ ...env, [name]: env[name] + '=' }));
    bad.push(JSON.stringify({ ...env, [name]: '*' }));
    bad.push(JSON.stringify({ ...env, [name]: 'A' }));
  }
  for (const length of [39, 41]) bad.push(JSON.stringify({ ...env, wrapped_key_b64: C.encode64(new Uint8Array(length)) }));
  for (const length of [11, 13]) bad.push(JSON.stringify({ ...env, iv_b64: C.encode64(new Uint8Array(length)) }));
  bad.push(JSON.stringify({ ...env, ciphertext_b64: C.encode64(new Uint8Array(15)) }));
  // Same decoded bytes, nonzero discarded base64 pad bits.
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const wrapped = env.wrapped_key_b64;
  bad.push(JSON.stringify({ ...env, wrapped_key_b64: wrapped.slice(0, -1) + alphabet[alphabet.indexOf(wrapped.at(-1)) + 1] }));
  for (const sealed of bad) { const before = requests.length; await refuses(open(codec, { ...row, sealed })); assert.equal(requests.length, before); }
  for (const value of ['{', '{"x":1,"x":2}', '\ufeff{}', '{"x":"\ud800"}']) {
    const before = requests.length; await refuses(open(codec, { ...row, value })); assert.equal(requests.length, before);
  }
  await refuses(open(codec, { ...row, extra: true }));
});
test('aad-relocations-all-fields', async () => {
  const codec = make(), row = await seal(codec);
  await refuses(open(make({ namespace: namespace + 'other' }), row));
  for (const [field, value] of [['athlete', 'synthetic-b'], ['collection', 'history'], ['row_id', 'other-row'], ['value', ' ' + constant], ['storage_revision', 2]]) {
    await refuses(open(codec, { ...row, [field]: value }, 2));
  }
  keys.set('alias', keys.get('old'));
  await refuses(open(codec, changeEnvelope(row, env => ({ ...env, key_epoch: 'alias' }))));
});
test('ciphertext-wrapper-iv-tamper', async () => {
  const codec = make(), row = await seal(codec);
  for (const field of ['wrapped_key_b64', 'iv_b64', 'ciphertext_b64']) await refuses(open(codec, changeEnvelope(row, env => {
    const bytes = C.decode64(env[field]); bytes[0] ^= 1; return { ...env, [field]: C.encode64(bytes) };
  })));
});
test('provider-history-wrong-key-and-safe-errors', async () => {
  const codec = make(), row = await seal(codec), old = keys.get('old');
  const newer = await seal(codec, raw(), 1, 'new');
  assert.deepEqual(await open(codec, row, 2), raw()); assert.deepEqual(await open(codec, newer), raw());
  keys.delete('old'); await refuses(open(codec, row), 'UNAVAILABLE'); await refuses(seal(codec), 'UNAVAILABLE');
  keys.set('old', keys.get('new')); await refuses(open(codec, row));
  keys.set('old', old); assert.deepEqual(await open(codec, row), raw());
  const invalid = [null,
    { type: 'secret', extractable: false, algorithm: { name: 'AES-KW', length: 256 }, usages: ['wrapKey', 'unwrapKey'] },
    await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']),
    await crypto.subtle.generateKey({ name: 'AES-KW', length: 256 }, true, ['wrapKey', 'unwrapKey']),
    await crypto.subtle.generateKey({ name: 'AES-KW', length: 128 }, false, ['wrapKey', 'unwrapKey'])];
  for (const result of invalid) {
    const broken = make({ getWrappingKey: async () => result });
    await refuses(seal(broken), 'UNAVAILABLE'); await refuses(open(broken, row), 'UNAVAILABLE');
  }
  const rawKey = crypto.getRandomValues(new Uint8Array(32));
  const write = await crypto.subtle.importKey('raw', rawKey, 'AES-KW', false, ['wrapKey']);
  const read = await crypto.subtle.importKey('raw', rawKey, 'AES-KW', false, ['unwrapKey']);
  const split = make({ getWrappingKey: async ({ purpose }) => purpose === 'write' ? write : read });
  assert.deepEqual(await open(split, await seal(split)), raw());
  await refuses(seal(make({ getWrappingKey: async () => read })), 'UNAVAILABLE');
  await refuses(open(make({ getWrappingKey: async () => write }), row), 'UNAVAILABLE');
});
test('before-await-seal-and-open-snapshots', async () => {
  let release, signal;
  const entered = new Promise(resolve => { signal = resolve; });
  const codec = make({ getWrappingKey: request => { assert.equal(Object.isFrozen(request), true); signal(); return new Promise(resolve => { release = resolve; }); } });
  const row = raw(), expected = { ...row }, context = { revision: 0, writeEpoch: 'old' };
  const pending = codec.seal(row, context); await entered;
  Object.assign(row, { athlete: 'mutated', value: '{}' }); Object.assign(context, { revision: 9, writeEpoch: 'new' });
  release(keys.get('old')); const physical = await pending;
  assert.equal(physical.storage_revision, 1); assert.equal(JSON.parse(physical.sealed).key_epoch, 'old');
  assert.deepEqual(await open(make(), physical), expected);
  let releaseRead, signalRead;
  const enteredRead = new Promise(resolve => { signalRead = resolve; });
  const reader = make({ getWrappingKey: () => { signalRead(); return new Promise(resolve => { releaseRead = resolve; }); } });
  const readContext = { revision: 1 }, readPending = reader.open(physical, readContext); await enteredRead;
  Object.assign(physical, { athlete: 'mutated', value: '{}', sealed: '{}', storage_revision: 900 }); readContext.revision = 0;
  releaseRead(keys.get('old')); assert.deepEqual(await readPending, expected);
});
test('safe-integer-stamp-bounds', async () => {
  const codec = make(), row = await seal(codec);
  for (const revision of [-0, -1, 0.5, NaN, Infinity, '1', 1n, Number.MAX_SAFE_INTEGER + 1]) {
    await refuses(codec.seal(raw(), { revision, writeEpoch: 'old' })); await refuses(codec.open(row, { revision }));
  }
  const before = requests.length;
  await refuses(seal(codec, raw(), Number.MAX_SAFE_INTEGER)); assert.equal(requests.length, before);
  const maximum = await seal(codec, raw(), Number.MAX_SAFE_INTEGER - 1);
  assert.equal(maximum.storage_revision, Number.MAX_SAFE_INTEGER); assert.deepEqual(await open(codec, maximum), raw());
  for (const storage_revision of [-0, 0, -1, 1.5, NaN, Infinity, '1', Number.MAX_SAFE_INTEGER + 1]) await refuses(open(codec, { ...row, storage_revision }, 3));
  await refuses(open(codec, row, 0));
  await refuses(codec.seal(raw(), { revision: 0, writeEpoch: 'old', extra: true }));
  await refuses(codec.open(row, { revision: 1, extra: true }));
  for (const writeEpoch of ['', null, 1, '\ud800']) await refuses(codec.seal(raw(), { revision: 0, writeEpoch }));
});
test('stamp-only-substitution', async () => {
  const codec = make(), old = await seal(codec), newer = await seal(codec, raw('{"new":true}'), 1);
  assert.equal(old.value, newer.value);
  await refuses(open(codec, { ...newer, sealed: old.sealed }));
  // Explicit full-old-row residual: old seal AND stamp authenticate under a later revision.
  assert.deepEqual(await open(codec, old, 2), raw());
});
test('fresh-dek-and-native-failure-refusal', async () => {
  const codec = make(), one = JSON.parse((await seal(codec)).sealed), two = JSON.parse((await seal(codec)).sealed);
  assert.notEqual(one.wrapped_key_b64, two.wrapped_key_b64); assert.notEqual(one.iv_b64, two.iv_b64);
  for (const failure of ['generateKey', 'wrapKey', 'encrypt', 'getRandomValues']) {
    const subtle = new Proxy(crypto.subtle, { get(target, name) { return name === failure ? async () => { throw Error(canary); } : target[name].bind(target); } });
    const brokenCrypto = { subtle, getRandomValues: failure === 'getRandomValues' ? () => { throw Error(canary); } : crypto.getRandomValues.bind(crypto) };
    await refuses(seal(make({ crypto: brokenCrypto })), 'UNAVAILABLE');
  }
});
// Construct authenticated malformed originals/projections with native crypto to isolate post-auth validation.
async function crafted(plaintext, physicalValue = constant) {
  const row = { ...raw(), value: physicalValue, storage_revision: 1 };
  const dek = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const env = { profile: P, key_epoch: 'old', wrapped_key_b64: C.encode64(await crypto.subtle.wrapKey('raw', dek, keys.get('old'), 'AES-KW')), iv_b64: C.encode64(iv), ciphertext_b64: '' };
  const aad = C.bytes(JSON.stringify(['earned/authority-row/aad/v1', namespace, row.athlete, row.collection, row.row_id, '1', P, 'old', physicalValue]));
  env.ciphertext_b64 = C.encode64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 }, dek, plaintext));
  return { ...row, sealed: JSON.stringify(env) };
}
test('authenticated-projection-mismatch', async () => { await refuses(open(make(), await crafted(C.bytes(raw().value), '{"p1":"wrong"}'))); });
test('authenticated-invalid-utf8-json', async () => {
  for (const bytes of [new Uint8Array([0xc0, 0xaf]), C.bytes('\ufeff{}'), C.bytes('{"x":1,"x":2}'), C.bytes('[]'), C.bytes('{')]) await refuses(open(make(), await crafted(bytes)));
});
(async () => {
  assert.equal(COLLECTIONS.length, 20);
  for (const epoch of ['old', 'new']) keys.set(epoch, await crypto.subtle.generateKey({ name: 'AES-KW', length: 256 }, false, ['wrapKey', 'unwrapKey']));
  let passed = 0, failed = 0;
  for (const [name, fn] of tests) {
    if (process.argv[2] && name !== process.argv[2]) continue;
    try { await fn(); passed++; console.log('PASS ' + name); }
    catch (_) { failed++; console.log('FAIL ' + name); }
  }
  console.log(`P1 CODEC ${failed ? 'FAIL' : 'PASS'} ${passed}/${passed + failed}; native Node crypto; no D1/bridge/provider acceptance`);
  if (failed || passed === 0) process.exitCode = 1;
})().catch(() => { console.error('P1 CODEC HARNESS FAIL'); process.exitCode = 1; });
