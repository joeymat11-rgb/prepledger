/* PASSPHRASE-NORMALIZE (lane C, DECISIONS:520) - THE FORMS, AGAINST A REAL SEAL.

   One SYNTHETIC bundle, sealed by the REAL rebuild/m3/setup/port/port.cjs with
   the passphrase port.cjs itself minted, through the same harness the import
   corpus uses (import/test/support.mjs sealInventedBundle). Nothing here types
   an owner passphrase, reads the owner's bundle or touches
   C:\\Users\\joeym\\EarnedPort: the six words these cells use are the ones the
   port wrote into a fresh OS temp folder one second earlier.

   BOTH DECODERS RUN. unseal.cjs is the Node reference decoder; import-bundle.mjs
   is the one the phone runs on WebCrypto. The defect this lane fixes is two
   implementations of one idea disagreeing, so every claim below is made against
   both and the cells compare them to each other.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto, pbkdf2Sync } from 'node:crypto';
import { createRequire } from 'node:module';
import { sealInventedBundle } from '../../../m3/w7-preview/import/test/support.mjs';
import { unsealBundle, BUNDLE_FAILURE } from '../../../m3/w6/local/import-bundle.mjs';

const require = createRequire(import.meta.url);
const Unseal = require('../../../m3/setup/port/unseal.cjs');
const { normalisePassphrase } = require('../../../m3/setup/port/passphrase.cjs');

const NBSP = '\u00a0';
const EN_DASH = '\u2013';
const EM_DASH = '\u2014';
const MINUS = '\u2212';

/* ONE REAL SEAL for the whole file. port.cjs runs its own gate and migration on
   every call, so a second seal would cost minutes and prove nothing new. */
const SEALED = sealInventedBundle();
const PC_FORM = SEALED.passphrase;
const SIX = PC_FORM.split('-');

/* THE FORMS THE OWNER AND HIS FATHER CAN TYPE OFF THE PIECE OF PAPER. Each is
   a [label, typed] pair so a failure names the keyboard, not an index. */
const ACCEPTED = Object.freeze([
  ['the hyphen form the PC writes (regression)', PC_FORM],
  ['spaces, which is what the owner typed on 2026-09-17', SIX.join(' ')],
  ['capitals with hyphens', PC_FORM.toUpperCase()],
  ['autocapitalised words with spaces', SIX.map(w => w[0].toUpperCase() + w.slice(1)).join(' ')],
  ['non-breaking spaces from a paste', SIX.join(NBSP)],
  ['an en dash between words (iOS smart punctuation)', SIX.join(EN_DASH)],
  ['an em dash between words', SIX.join(EM_DASH)],
  ['a minus sign between words', SIX.join(MINUS)],
  ['leading and trailing space', '  ' + SIX.join(' ') + '  '],
  ['doubled separators', SIX.join(' - ')],
  ['underscores', SIX.join('_')],
]);

/* THE FORMS THAT MUST STILL REFUSE. Not one of them is a separator or a case
   variant of the right six words: each is a DIFFERENT passphrase. */
const REFUSED = Object.freeze([
  ['five words', SIX.slice(0, 5).join(' ')],
  ['seven words', [...SIX, SIX[0]].join(' ')],
  ['the right words in the wrong order', [SIX[1], SIX[0], ...SIX.slice(2)].join(' ')],
  ['one wrong word', [...SIX.slice(0, 5), 'zzzzzz'].join(' ')],
  ['nothing typed at all', ''],
  ['separators only', ' - - '],
]);

const openNode = typed => Unseal.unseal(Buffer.from(SEALED.bytes), typed);
const openPhone = typed => unsealBundle(SEALED.bytes, typed,
  { crypto: webcrypto, allowUnqualified: true });

async function refusalOf(open) {
  try { await open(); } catch (error) { return error; }
  return null;
}

test('C-PN-8 - the bundle this file stands on was sealed by the REAL port.cjs, '
  + 'and the six words it minted are the hyphen form', () => {
  assert.equal(SIX.length, 6, 'port.cjs did not mint six words');
  assert.equal(PC_FORM, normalisePassphrase(PC_FORM),
    'what port.cjs writes is not already the canonical form');
  assert.match(PC_FORM, /^[a-z]+(-[a-z]+){5}$/);
});

test('C-PN-9 - EVERY accepted form opens the real bundle through the PHONE\'s '
  + 'decoder, which is the one the athlete runs', async () => {
  for (const [label, typed] of ACCEPTED) {
    const open = await openPhone(typed);
    assert.equal(open.payload.profile, 'earned/local-import-bundle/v1', label);
    assert.match(open.payload.source.sha256, /^[0-9a-f]{64}$/, label);
  }
});

test('C-PN-10 - EVERY accepted form opens the same bundle through the NODE '
  + 'reference decoder, and both decoders return the same source', async () => {
  const phone = await openPhone(PC_FORM);
  for (const [label, typed] of ACCEPTED) {
    const payload = openNode(typed);
    assert.equal(payload.source.sha256, phone.payload.source.sha256, label);
  }
});

test('C-PN-11 - a DIFFERENT passphrase still refuses, with the same code and '
  + 'the same sentence as today, on both decoders', async () => {
  for (const [label, typed] of REFUSED) {
    const node = await refusalOf(() => openNode(typed));
    assert.ok(node, label + ' opened the bundle on the node decoder');
    assert.equal(node.code, 'BUNDLE_AUTH_FAILED', label);
    assert.equal(node.message, 'BUNDLE_AUTH_FAILED', label);
    const phone = await refusalOf(() => openPhone(typed));
    assert.ok(phone, label + ' opened the bundle on the phone decoder');
    assert.equal(phone.code, BUNDLE_FAILURE, label);
    assert.equal(phone.code, node.code, label + ': the two decoders disagree');
  }
});

/* THE SEALING SIDE DOES NOT MOVE. port.cjs seals with unseal.cjs's exported
   deriveKey (port.cjs:195), so if the fold had been put THERE it would have
   changed what every future bundle is sealed with, and a bundle sealed before
   the change and opened after it would be a different question every time. It
   was not put there: deriveKey still derives from NFKD alone, and the fold sits
   at the two IMPORT entries. This cell is that claim, measured. */
test('C-PN-12 - deriveKey, the function port.cjs seals with, is byte for byte '
  + 'what it was: NFKD and nothing else', () => {
  const salt = Buffer.alloc(Unseal.KDF.saltBytes, 7);
  const before = phrase => pbkdf2Sync(Buffer.from(phrase.normalize('NFKD'), 'utf8'),
    salt, Unseal.KDF.iterations, Unseal.KDF.keyBits / 8, 'sha256');
  for (const phrase of [PC_FORM, PC_FORM.toUpperCase(), SIX.join(' '), 'café-x'])
    assert.deepEqual(Unseal.deriveKey(phrase, salt), before(phrase),
      'deriveKey moved for ' + JSON.stringify(phrase) + ': bundles already sealed are at risk');
  assert.equal(Unseal.KDF.iterations, 600000);
  assert.equal(Unseal.KDF.saltBytes, 16);
  assert.equal(Unseal.KDF.hash, 'SHA-256');
  assert.equal(Unseal.CIPHER.name, 'AES-GCM');
});

/* THE WORDLIST IS PUBLIC, so knowing a word is in it is worth nothing. Knowing
   WHICH of the six is wrong is worth 2048-to-1 per word, and no refusal here
   may be worth that. */
test('C-PN-13 - a refusal says which HALF of the problem it is not: no field, '
  + 'no index, no word, no count', async () => {
  const typed = [...SIX.slice(0, 5), 'zzzzzz'].join(' ');
  for (const refusal of [await refusalOf(() => openNode(typed)),
    await refusalOf(() => openPhone(typed))]) {
    const seen = JSON.stringify({ message: refusal.message, code: refusal.code,
      field: refusal.field ?? null, detail: refusal.detail ?? null });
    assert.equal(refusal.field ?? null, null, 'a passphrase refusal names a field');
    for (const word of [...SIX, 'zzzzzz'])
      assert.equal(seen.includes(word), false, 'the refusal carries the word ' + word);
    assert.equal(/\b[0-9]\b/.test(seen), false, 'the refusal carries a number');
  }
});
