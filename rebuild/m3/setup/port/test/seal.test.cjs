'use strict';
/* The seal, on its own: no engine, no oracle, no fixtures. Every case here is
   about the envelope refusing to open when something about it has changed. */
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { seal, makePassphrase, PASSPHRASE_WORDS } = require('../port.cjs');
const { unseal, PROFILE, KDF, CIPHER, FAILURE } = require('../unseal.cjs');
const { WORDS, SIZE } = require('../wordlist.cjs');

const SHA = createHash('sha256').update('synthetic-source-bytes').digest('hex');
const OTHER = createHash('sha256').update('a different ledger entirely').digest('hex');
const payload = () => ({
  profile: PROFILE,
  createdAt: '2026-09-10T00:00:00.000Z',
  engine: { sha256: SHA, schemaV: 60 },
  source: { sha256: SHA, bytes: Buffer.from('{"v":60}').toString('base64') },
  migrated: { sha256: OTHER, state: { v: 60, reads: [{ d: '2029-12-01', w: 180 }] } },
  oracle: { verdict: 'PASS', gate: { laws: 7 } },
  dataLoss: { safe: true, lost: 0 },
});
const bytes = envelope => Buffer.from(JSON.stringify(envelope), 'utf8');

test('a sealed bundle opens with its own passphrase and returns the payload unchanged', () => {
  const pass = makePassphrase();
  const envelope = seal(payload(), pass, SHA);
  assert.equal(envelope.profile, PROFILE);
  assert.equal(envelope.kdf.iterations, KDF.iterations);
  assert.equal(envelope.cipher.name, CIPHER.name);
  assert.deepEqual(envelope.aad, [PROFILE, SHA]);
  assert.deepEqual(unseal(bytes(envelope), pass), payload());
  assert.deepEqual(unseal(JSON.stringify(envelope), pass), payload(), 'a string bundle reads the same');
});

test('a different passphrase is refused with the one code', () => {
  const envelope = seal(payload(), 'able-baker-charlie-delta-echo-foxtrot', SHA);
  assert.throws(() => unseal(bytes(envelope), 'able-baker-charlie-delta-echo-golf'), { code: FAILURE });
  assert.throws(() => unseal(bytes(envelope), ''), { code: FAILURE });
});

test('one flipped byte anywhere in the ciphertext is refused', () => {
  const pass = makePassphrase();
  const envelope = seal(payload(), pass, SHA);
  const raw = Buffer.from(envelope.ciphertext, 'base64');
  for (const at of [0, Math.floor(raw.length / 2), raw.length - 1]) {
    const flipped = Buffer.from(raw);
    flipped[at] ^= 0x01;
    const tampered = { ...envelope, ciphertext: flipped.toString('base64') };
    assert.throws(() => unseal(bytes(tampered), pass), { code: FAILURE }, `flip at ${at}`);
  }
});

test('re-pointing the bundle at another source (the AAD) is refused', () => {
  const pass = makePassphrase();
  const envelope = seal(payload(), pass, SHA);
  const moved = { ...envelope, aad: [PROFILE, OTHER] };
  assert.throws(() => unseal(bytes(moved), pass), { code: FAILURE });
  // and the same with the payload's own claim rewritten to agree with it
  assert.throws(() => unseal(bytes({ ...envelope, aad: [PROFILE, OTHER], ciphertext: envelope.ciphertext }), pass), { code: FAILURE });
});

test('a changed profile, salt, iv or KDF parameter is refused', () => {
  const pass = makePassphrase();
  const envelope = seal(payload(), pass, SHA);
  const swaps = [
    { profile: 'earned/local-import-bundle/v2' },
    { kdf: { ...envelope.kdf, iterations: 100000 } },
    { kdf: { ...envelope.kdf, salt: Buffer.alloc(KDF.saltBytes).toString('base64') } },
    { cipher: { ...envelope.cipher, iv: Buffer.alloc(CIPHER.ivBytes).toString('base64') } },
    { cipher: { ...envelope.cipher, tagBits: 96 } },
    { aad: [PROFILE] },
    { ciphertext: 'not base64 at all !!' },
  ];
  for (const swap of swaps) {
    assert.throws(() => unseal(bytes({ ...envelope, ...swap }), pass), { code: FAILURE }, JSON.stringify(Object.keys(swap)));
  }
  assert.throws(() => unseal(Buffer.from('not json'), pass), { code: FAILURE });
});

test('the word list is 2048 distinct typable words and the passphrase draws from it', () => {
  assert.equal(WORDS.length, SIZE);
  assert.equal(SIZE, 2048);
  assert.equal(new Set(WORDS).size, WORDS.length, 'a duplicate would cost entropy silently');
  for (const word of WORDS) assert.match(word, /^[a-z]{2,8}$/);
  const phrase = makePassphrase();
  const picked = phrase.split('-');
  assert.equal(picked.length, PASSPHRASE_WORDS);
  for (const word of picked) assert.ok(WORDS.includes(word), word);
  const many = new Set();
  for (let i = 0; i < 64; i++) many.add(makePassphrase());
  assert.equal(many.size, 64, 'every passphrase is freshly drawn');
});
