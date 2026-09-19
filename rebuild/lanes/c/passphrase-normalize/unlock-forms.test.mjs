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
  ['the right words in the wrong order', wrongOrder(SIX)],
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
   may be worth that.

   FIX ROUND, REVIEW R1 BLOCKING 1. The first version of this cell serialised
   the refusal with JSON.stringify and then searched THAT string for each of the
   six words the port had just minted. JSON.stringify writes the KEY NAMES into
   the haystack, and 'message', 'code', 'field' and 'detail' are all four words
   in wordlist.cjs, so whenever the port drew one of them the cell announced
   that the refusal "carries the word" when the refusal carried nothing of the
   sort: 1.17% of runs, measured over the real makePassphrase. A false alarm
   that is indistinguishable from the real alarm is worse than no cell, and it
   cannot be cleared by re-running.

   The claim is unchanged and its teeth are sharper. The four values the athlete
   and the route can see are compared to a FIXED constant, so a word could not
   appear in one of them without breaking that equality; the haystack is then
   asserted to carry no lower-case letter at all, and every word in the list is
   ^[a-z]+$ (C-PN-7, C-PN-8), so "no word is in it" follows by construction
   rather than by luck; and the refusals from two DIFFERENT wrong passphrases
   are compared to each other, which is the property that actually matters -
   the refusal does not depend on what was typed. */
test('C-PN-13 - a refusal says which HALF of the problem it is not: no field, '
  + 'no index, no word, no count, and nothing that depends on what was typed',
async () => {
  /* Fixed nonsense the port can never draw, so searching for these is a fact
     and not a lottery; and the two inputs share no word, so any dependence on
     the typed string shows up as a difference between the two refusals. */
  const PROBE = ['zzzzzz', 'qqqqqq', 'xxxxxx', 'wwwwww', 'vvvvvv', 'uuuuuu'];
  const oneWrongWord = [...SIX.slice(0, 5), PROBE[0]].join(' ');
  const everyWordWrong = PROBE.join(' ');
  const SURFACE = Object.freeze({ message: 'BUNDLE_AUTH_FAILED',
    code: 'BUNDLE_AUTH_FAILED', field: null, detail: null });
  const surfaceOf = refusal => ({ message: refusal.message, code: refusal.code,
    field: refusal.field ?? null, detail: refusal.detail ?? null });
  for (const [decoder, open] of [['node', openNode], ['phone', openPhone]]) {
    const refusal = surfaceOf(await refusalOf(() => open(oneWrongWord)));
    const other = surfaceOf(await refusalOf(() => open(everyWordWrong)));
    assert.deepEqual(refusal, SURFACE, decoder + ': the refusal surface moved');
    assert.deepEqual(other, refusal, decoder + ': two different wrong passphrases '
      + 'refuse differently, so a refusal carries something about what was typed');
    const seen = [refusal.message, refusal.code, refusal.field, refusal.detail]
      .map(value => value ?? '').join(' ');
    assert.equal(/[a-z]/.test(seen), false, decoder + ': a refusal carries a '
      + 'lower-case letter, so it is able to carry a word');
    for (const word of [...SIX, ...PROBE])
      assert.equal(seen.includes(word), false, 'the refusal carries the word ' + word);
    assert.equal(/[0-9]/.test(seen), false, decoder + ': the refusal carries a number');
  }
});

function wrongOrder(words) {
  const at = words.findIndex((word, index) => index + 1 < words.length && word !== words[index + 1]);
  assert.notEqual(at, -1, 'C-PN-11: no unequal adjacent words to exchange');
  const reordered = words.slice();
  [reordered[at], reordered[at + 1]] = [reordered[at + 1], reordered[at]];
  return reordered.join(' ');
}

test('C-PN-21 - wrong-order construction exchanges unequal adjacent words even when the first pair repeats', () => {
  // sealInventedBundle has no supplied-passphrase option: test construction alone.
  const repeated = ['baby', 'baby', 'close', 'soap', 'square', 'assist'];
  const typed = wrongOrder(repeated);
  assert.notEqual(normalisePassphrase(typed), repeated.join('-'),
    'C-PN-21: wrong-order construction returned the sealed phrase');
  assert.equal(typed, 'baby close baby soap square assist');
  assert.deepEqual(repeated, ['baby', 'baby', 'close', 'soap', 'square', 'assist']);
  assert.throws(() => wrongOrder(Array(6).fill('baby')),
    /C-PN-11: no unequal adjacent words/, 'the all-equal case must fail loudly by name');
});

test('C-PN-22 - U+FF0C between all six words opens on both decoders', async () => {
  const typed = SIX.join('\uff0c');
  const node = openNode(typed);
  const phone = await openPhone(typed);
  assert.equal(node.source.sha256, openNode(PC_FORM).source.sha256);
  assert.equal(phone.payload.source.sha256, node.source.sha256);
});

test('C-PN-23 - a lone U+D800 inside a word refuses on both decoders', async () => {
  const typed = PC_FORM.slice(0, 1) + '\ud800' + PC_FORM.slice(1);
  for (const [decoder, open] of [['node', openNode], ['phone', openPhone]]) {
    const refusal = await refusalOf(() => open(typed));
    assert.ok(refusal, decoder + ': a lone surrogate inside a word opened');
    assert.equal(refusal.code, 'BUNDLE_AUTH_FAILED');
  }
});

test('C-PN-24 - node whole refusal JSON is literal and independent of two typed strings', async () => {
  const first = await refusalOf(() => openNode([...SIX.slice(0, 5), 'zzzzzz'].join(' ')));
  const second = await refusalOf(() => openNode('qqqqqq xxxxxx wwwwww vvvvvv uuuuuu tttttt'));
  assert.ok(first); assert.ok(second);
  const one = JSON.stringify(first), two = JSON.stringify(second);
  assert.equal(one, '{"code":"BUNDLE_AUTH_FAILED"}');
  assert.equal(two, '{"code":"BUNDLE_AUTH_FAILED"}');
  assert.equal(two, one);
});

test('C-PN-25 - phone whole refusal JSON is literal and independent of two typed strings', async () => {
  const first = await refusalOf(() => openPhone([...SIX.slice(0, 5), 'zzzzzz'].join(' ')));
  const second = await refusalOf(() => openPhone('qqqqqq xxxxxx wwwwww vvvvvv uuuuuu tttttt'));
  assert.ok(first); assert.ok(second);
  const one = JSON.stringify(first), two = JSON.stringify(second);
  assert.equal(one, '{"name":"StorageFailure","code":"BUNDLE_AUTH_FAILED","state":3,"retryable":false}');
  assert.equal(two, '{"name":"StorageFailure","code":"BUNDLE_AUTH_FAILED","state":3,"retryable":false}');
  assert.equal(two, one);
});

test('C-PN-26 - node entry uses ECMAScript whitespace: U+FEFF opens and U+0085 refuses', async () => {
  assert.equal(openNode(SIX.join('\ufeff')).source.sha256, openNode(PC_FORM).source.sha256);
  const refusal = await refusalOf(() => openNode(SIX.join('\u0085')));
  assert.ok(refusal, 'node: U+0085 was admitted as a separator');
  assert.equal(refusal.code, 'BUNDLE_AUTH_FAILED');
});

test('C-PN-27 - phone entry uses ECMAScript whitespace: U+FEFF opens and U+0085 refuses', async () => {
  const opened = await openPhone(SIX.join('\ufeff'));
  assert.equal(opened.payload.source.sha256, openNode(PC_FORM).source.sha256);
  const refusal = await refusalOf(() => openPhone(SIX.join('\u0085')));
  assert.ok(refusal, 'phone: U+0085 was admitted as a separator');
  assert.equal(refusal.code, 'BUNDLE_AUTH_FAILED');
});
