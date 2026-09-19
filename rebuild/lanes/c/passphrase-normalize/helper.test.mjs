/* PASSPHRASE-NORMALIZE (lane C, DECISIONS:520) - THE ONE CANONICAL FORM.

   The PC writes the six words joined with hyphens. The screen says "Type the
   six words from the PC" and the owner typed them with spaces, so the key was
   derived from a different string and the file refused. These cells are about
   the ONE pure helper that turns whatever was typed into the form the PC
   already wrote, and about there being exactly one of it.

   Nothing here seals, opens or reads a bundle: that is unlock-forms.test.mjs.
   These cells are pure text and source-text facts, so they cost no PBKDF2.

   SYNTHETIC ONLY. No owner data and no owner passphrase is reachable from
   here. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const REPO = fileURLToPath(new URL('../../../../', import.meta.url));
const read = rel => fs.readFileSync(REPO + rel, 'utf8');

const HELPER_REL = 'rebuild/m3/setup/port/passphrase.cjs';
const Passphrase = require('../../../m3/setup/port/passphrase.cjs');
const { normalisePassphrase, passphraseWordCount } = Passphrase;

/* The separator characters the owner's keyboards can put between two words,
   written as escapes so no U+2013 or U+2014 enters this file as a character. */
const NBSP = '\u00a0';
const HYPHEN = '\u2010';         // U+2010 HYPHEN
const NB_HYPHEN = '\u2011';      // U+2011 NON-BREAKING HYPHEN
const FIGURE_DASH = '\u2012';
const EN_DASH = '\u2013';        // what iOS smart punctuation types
const EM_DASH = '\u2014';
const HORIZONTAL_BAR = '\u2015';
const MINUS = '\u2212';
const IDEOGRAPHIC_SPACE = '\u3000';

const SIX = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'];
const PC_FORM = SIX.join('-');

test('C-PN-1 - the PC\'s own form is the canonical form: the helper is the '
  + 'identity on what port.cjs writes, so no bundle already sealed can move',
  () => {
    assert.equal(normalisePassphrase(PC_FORM), PC_FORM);
    assert.equal(normalisePassphrase(normalisePassphrase(PC_FORM)), PC_FORM,
      'the helper is not idempotent, so a second pass would derive a second key');
    assert.equal(normalisePassphrase(PC_FORM).normalize('NFKD'), normalisePassphrase(PC_FORM),
      'the output is not NFKD-stable, so the derive site\'s own NFKD is not a no-op');
  });

test('C-PN-2 - every way the six words can arrive off a phone keyboard lands on '
  + 'the one form the PC wrote', () => {
  const same = (typed, why) => assert.equal(normalisePassphrase(typed), PC_FORM, why);
  same(SIX.join(' '), 'spaces: what the owner typed on 2026-09-17');
  same(SIX.join('-'), 'the hyphen form the PC writes (regression)');
  same(SIX.map(w => w.toUpperCase()).join('-'), 'capitals with hyphens');
  same(SIX.map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    'autocapitalised first letters with spaces');
  same(SIX.join(NBSP), 'non-breaking spaces, which a paste can carry');
  same(SIX.join(EN_DASH), 'an en dash between words (iOS smart punctuation)');
  same(SIX.join(EM_DASH), 'an em dash between words');
  same(SIX.join(HYPHEN), 'U+2010 HYPHEN');
  same(SIX.join(NB_HYPHEN), 'U+2011 NON-BREAKING HYPHEN');
  same(SIX.join(FIGURE_DASH), 'U+2012 FIGURE DASH');
  same(SIX.join(HORIZONTAL_BAR), 'U+2015 HORIZONTAL BAR');
  same(SIX.join(MINUS), 'U+2212 MINUS SIGN');
  same(SIX.join('_'), 'underscores');
  same(SIX.join(', '), 'commas and spaces');
  same(SIX.join('. '), 'full stops and spaces');
  same(SIX.join(IDEOGRAPHIC_SPACE), 'U+3000 IDEOGRAPHIC SPACE');
  same('  ' + SIX.join(' ') + '  ', 'leading and trailing spaces');
  same('\t' + SIX.join('\t') + '\n', 'tabs and a trailing newline');
  same(SIX.join('   '), 'doubled and trebled spaces');
  same(SIX.join(' - '), 'a space, a hyphen and a space: a doubled separator run');
  same(SIX.join('--'), 'two hyphens');
  same('-' + SIX.join('-') + '-', 'a leading and a trailing hyphen');
  same(SIX.map(w => w.toUpperCase()).join(' ' + EM_DASH + ' '),
    'capitals, spaces and an em dash together');
});

test('C-PN-3 - the helper folds SEPARATORS and CASE and nothing else: a '
  + 'different word, a missing word, an extra word and a different ORDER all '
  + 'stay different strings', () => {
  const swapped = [SIX[1], SIX[0], ...SIX.slice(2)].join(' ');
  assert.notEqual(normalisePassphrase(swapped), PC_FORM, 'the order was folded away');
  assert.notEqual(normalisePassphrase(SIX.slice(0, 5).join(' ')), PC_FORM);
  assert.notEqual(normalisePassphrase([...SIX, 'golf'].join(' ')), PC_FORM);
  assert.notEqual(normalisePassphrase(['alpha', 'bravo', 'charlie', 'delta', 'echo',
    'foxtrott'].join(' ')), PC_FORM, 'a mistyped sixth word was folded onto the right one');
  /* The wordlist is ASCII, but the athlete's keyboard is not: an accented
     spelling must stay its own string once NFKD has run, or the helper would be
     quietly widening what unlocks. */
  assert.notEqual(normalisePassphrase('cafe-' + SIX.slice(1).join('-')),
    normalisePassphrase('café-' + SIX.slice(1).join('-')),
    'an accent was folded away: that is ASCII-folding, not normalisation');
});

test('C-PN-4 - the word COUNT is a fact the helper can state, and an empty or '
  + 'separator-only string is nothing at all', () => {
  assert.equal(passphraseWordCount(PC_FORM), 6);
  assert.equal(passphraseWordCount(SIX.join(' ')), 6);
  assert.equal(passphraseWordCount('  ' + SIX.join('  ' + EN_DASH + '  ') + ' '), 6);
  assert.equal(passphraseWordCount(SIX.slice(0, 5).join(' ')), 5);
  assert.equal(passphraseWordCount([...SIX, 'golf'].join(' ')), 7);
  assert.equal(passphraseWordCount(''), 0);
  assert.equal(passphraseWordCount('   '), 0);
  assert.equal(passphraseWordCount('---'), 0);
  assert.equal(passphraseWordCount(null), 0);
  assert.equal(passphraseWordCount(undefined), 0);
  assert.equal(normalisePassphrase(''), '');
  assert.equal(normalisePassphrase(null), '');
  assert.equal(normalisePassphrase(42), '');
});

/* --------------------------------------------------------------------------
   ONE HELPER, AND ONLY ONE. The defect this lane fixes is two implementations
   of the same idea that disagreed. A second normalisation anywhere on the
   import side would be the same defect with a new spelling, so these cells read
   the shipped sources and refuse one.
   -------------------------------------------------------------------------- */
const DERIVE_SITES = Object.freeze([
  'rebuild/m3/setup/port/unseal.cjs',
  'rebuild/m3/w6/local/import-bundle.mjs']);
/* The class itself, written once here as escapes, so this cell says WHICH
   characters it is looking for instead of matching any regex at all. */
const CLASS_SOURCE = '[\\s\\u2010-\\u2015\\u2212_,.-]+';

test('C-PN-5 - the helper is PURE and standalone: it requires nothing, reads '
  + 'nothing and writes nothing, so it can be the one copy on both sides',
  () => {
    const source = read(HELPER_REL);
    assert.equal(/\brequire\s*\(/.test(source), false,
      'the shared helper requires something, so it is not free to enter the phone bundle');
    assert.equal(/^\s*import[\s(]/m.test(source), false, 'the shared helper imports something');
    assert.equal(/\bprocess\.|\bfs\.|Math\.random|Date\.now/.test(source), false,
      'the shared helper reaches outside itself');
    assert.deepEqual(Object.keys(Passphrase).sort(),
      ['PASSPHRASE_SEPARATORS', 'normalisePassphrase', 'passphraseWordCount'],
      'the shared helper exports something this lane did not state');
    assert.ok(source.includes(CLASS_SOURCE),
      'the helper does not carry the separator class this lane states');
  });

test('C-PN-6 - EVERY site that turns a typed passphrase into key material calls '
  + 'the ONE helper, exactly once, and none of them normalises on its own',
  () => {
    for (const rel of DERIVE_SITES) {
      const source = read(rel);
      const calls = source.match(/normalisePassphrase\s*\(/g) || [];
      assert.equal(calls.length, 1, rel + ' calls normalisePassphrase ' + calls.length
        + ' times, not once');
      assert.ok(/passphrase\.cjs/.test(source), rel + ' does not read the shared helper at all');
      assert.equal(source.includes(CLASS_SOURCE), false,
        rel + ' carries its own separator class: that is the second normalisation');
      assert.equal(/\.toLowerCase\s*\(\s*\)/.test(source), false,
        rel + ' lower-cases a passphrase on its own');
    }
  });

/* --------------------------------------------------------------------------
   THE SECURITY QUESTION, MEASURED ON THE WORDLIST ITSELF.

   Folding case and separators widens the set of strings that open one bundle.
   The question that matters is whether it widens it onto ANOTHER VALID
   PASSPHRASE - that is, whether two different draws of six words can normalise
   to the same string. They cannot, and this cell is the proof rather than a
   sentence in a report: the canonical form is words joined by a character no
   word contains, and the per-word fold is injective over this list.
   -------------------------------------------------------------------------- */
test('C-PN-7 - the fold cannot map two DIFFERENT six-word draws onto one '
  + 'canonical form: no word contains a separator, and no two words collide '
  + 'under NFKD plus lower case', () => {
  const { WORDS } = require('../../../m3/setup/port/wordlist.cjs');
  assert.equal(WORDS.length, 2048, 'the wordlist moved; the entropy claim moves with it');
  assert.equal(new Set(WORDS).size, WORDS.length, 'the wordlist repeats a word');
  const separated = WORDS.filter(w => new RegExp(CLASS_SOURCE, 'u').test(w));
  assert.deepEqual(separated, [],
    'a word contains a separator character, so the joined form no longer re-splits uniquely');
  const folded = new Map();
  for (const w of WORDS) {
    const key = normalisePassphrase(w);
    assert.equal(key, w, 'the word ' + JSON.stringify(w) + ' is not already canonical');
    assert.equal(folded.has(key), false,
      'two words fold onto ' + JSON.stringify(key) + ': the fold is not injective');
    folded.set(key, w);
  }
  assert.equal(folded.size, WORDS.length);
  /* 2048 words, six draws with replacement: log2(2048) * 6 = 66 bits, and the
     fold above removes none of them. */
  assert.equal(Math.log2(WORDS.length) * 6, 66);
});

/* --------------------------------------------------------------------------
   FIX ROUND, REVIEW R1 NOTE 2. The separator class is EXPORTED, and an exported
   regex that carries the g flag carries lastIndex with it: .test() on the same
   input then answers true, false, true, false. Nothing calls it that way today,
   which is exactly when to close it - on the import path, a trap that only
   springs for the next caller is still a trap. The export is now flagless and
   the global copy the fold needs is module-private.
   -------------------------------------------------------------------------- */
test('C-PN-19 - the exported separator class is STATELESS: no g, no y, and the '
  + 'same question asked twice gets the same answer', () => {
  const { PASSPHRASE_SEPARATORS } = Passphrase;
  assert.equal(PASSPHRASE_SEPARATORS instanceof RegExp, true);
  assert.equal(PASSPHRASE_SEPARATORS.global, false,
    'the exported separator class carries lastIndex, so .test() alternates on one input');
  assert.equal(PASSPHRASE_SEPARATORS.sticky, false);
  const typed = SIX.join(' ');
  for (let i = 0; i < 4; i += 1)
    assert.equal(PASSPHRASE_SEPARATORS.test(typed), true, 'answer ' + i + ' disagrees with answer 0');
  assert.equal(PASSPHRASE_SEPARATORS.lastIndex, 0);
  /* And the fold itself is unmoved by being asked repeatedly, which is the
     thing the athlete's second attempt depends on. */
  for (let i = 0; i < 4; i += 1) assert.equal(normalisePassphrase(typed), PC_FORM);
});

/* --------------------------------------------------------------------------
   FIX ROUND, REVIEW R1 NOTE 1, and OPEN QUESTION 2 for the PM. The Unicode
   FORMAT characters (zero-width space, word joiner, soft hyphen, the
   directional marks) are not whitespace, NFKD does not remove them, and they
   are not in this lane's separator class. A paste out of a messaging app can
   carry them. They therefore REFUSE - the string is not six words, or the words
   are not the words - and they refuse with the one code, which is fail-CLOSED
   and not a leak.

   This cell states that behaviour rather than quietly leaving it unmeasured, so
   that if the PM takes open question 2 the widening is a deliberate edit to a
   cell that says what it is changing. It is NOT a pin on a defect: see the
   author report, R1 findings, N1.
   -------------------------------------------------------------------------- */
test('C-PN-20 - invisible FORMAT characters are not separators: they refuse, '
  + 'they refuse closed, and this lane did not widen the accepted set to them', () => {
  const ZWSP = '\u200b';
  const WORD_JOINER = '\u2060';
  const SOFT_HYPHEN = '\u00ad';
  const LRM = '\u200e';
  for (const [name, joiner] of [['ZERO WIDTH SPACE', ZWSP], ['WORD JOINER', WORD_JOINER],
    ['SOFT HYPHEN', SOFT_HYPHEN]]) {
    const typed = SIX.join(joiner);
    assert.notEqual(normalisePassphrase(typed), PC_FORM, name + ' was folded to a separator');
    assert.equal(passphraseWordCount(typed), 1, name + ' no longer glues the six into one');
  }
  const marked = LRM + SIX.join(' ') + LRM;
  assert.notEqual(normalisePassphrase(marked), PC_FORM,
    'a directional mark was folded away');
  assert.equal(passphraseWordCount(marked), 6,
    'the marked form is still SIX words, so a word-count pre-check would not catch it either');
  /* Fail-closed, and provably not a collision risk either way: no word in the
     list carries a format character, so stripping them (open question 2) could
     not merge two different valid passphrases. C-PN-7 owns the list itself. */
  const { WORDS } = require('../../../m3/setup/port/wordlist.cjs');
  assert.deepEqual(WORDS.filter(w => /\p{Cf}/u.test(w)), [],
    'a wordlist word carries a format character');
});


test('C-PN-28 - the helper pins ECMAScript whitespace, including U+FEFF and excluding U+0085', () => {
  assert.equal(normalisePassphrase(SIX.join('\ufeff')), PC_FORM);
  assert.equal(normalisePassphrase(SIX.join('\u0085')), SIX.join('\u0085'));
  assert.equal(Passphrase.PASSPHRASE_SEPARATORS.test('\ufeff'), true);
  assert.equal(Passphrase.PASSPHRASE_SEPARATORS.test('\u0085'), false);
});
