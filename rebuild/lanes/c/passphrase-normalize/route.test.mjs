/* PASSPHRASE-NORMALIZE (lane C, DECISIONS:520) - THE ROUTE THE OWNER WALKED.

   Nothing here mounts the Import screen by hand. The cell boots the SHIPPED
   page (today-entry.mjs boot() into design.shellHtml(), over fake-indexeddb and
   the real encrypted repository), opens the Import route, chooses the file and
   types the six words THE WAY THE OWNER TYPED THEM on 2026-09-17: with spaces.

   That is the whole defect at route level. Everything under it - both decoders,
   every other separator, the refusals - is measured in unlock-forms.test.mjs;
   this cell proves the screen the athlete taps carries the fix.

   SYNTHETIC ONLY, sealed by the real port.cjs. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, Entry, shellWindow,
  slot, tap, type, textOf, pickBundle } from '../../../m3/w7-preview/import/test/support.mjs';
import { COPY } from '../../../m3/w7-preview/import/import-screen.mjs';

const SEALED = sealInventedBundle();
const SIX = SEALED.passphrase.split('-');
const WHEN = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const EN_DASH = '\u2013';
const EM_DASH = '\u2014';

async function page(tag) {
  const indexedDB = new IDBFactory();
  const era = await eraFor({ indexedDB, live: liveAt(WHEN.at), databaseName: 'c-pn-' + tag,
    namespace: 'joe/c-pn-' + tag, athleteId: 'ath-c-pn', deviceId: 'dev-c-pn' });
  await firstRun(era, WHEN.day);
  const win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(WHEN.at) });
  await booted.api.ready;
  return { era, win, doc: win.document, booted,
    close: () => { booted.rollover.stop(); booted.teardown(); era.close(); } };
}

async function afterTap(booted, node) {
  tap(node);
  const screen = booted.api.importScreen();
  if (screen) await screen.settled();
  await booted.api.render('import', false);
  return booted.api.importScreen();
}

async function unlockWith(tag, typed) {
  const kit = await page(tag);
  await kit.booted.api.render('import', true);
  pickBundle(kit.win, kit.doc.getElementById('import-file'), SEALED.bytes);
  await kit.booted.api.render('import', false);
  type(kit.doc.getElementById('import-passphrase'), typed);
  const screen = await afterTap(kit.booted, slot(kit.doc, 'import-unlock'));
  return { kit, step: screen.step(), refusal: screen.refusal(), text: textOf(kit.doc) };
}

test('C-PN-14 - the owner\'s own typing unlocks the real screen: six words with '
  + 'SPACES, on the shipped page, reaches the identity question', async () => {
  const run = await unlockWith('spaces', SIX.join(' '));
  try {
    assert.equal(run.refusal, null, 'the screen refused the six words typed with spaces');
    assert.equal(run.step, 'identity',
      'the screen stopped at ' + run.step + ' instead of asking the identity question');
  } finally { run.kit.close(); }
});

test('C-PN-15 - and the phone\'s own helpers do not break it: capitals and a '
  + 'smart-punctuation dash unlock the same screen; the hyphen form still does '
  + 'too', async () => {
  for (const [tag, typed] of [['caps', SIX.join('-').toUpperCase()],
    ['endash', SIX.join(EN_DASH)], ['hyphen', SEALED.passphrase]]) {
    const run = await unlockWith(tag, typed);
    try {
      assert.equal(run.refusal, null, tag + ' was refused by the screen');
      assert.equal(run.step, 'identity', tag + ' stopped at ' + run.step);
    } finally { run.kit.close(); }
  }
});

/* FIX ROUND, REVIEW R1 BLOCKING 1. This cell used to scan the WHOLE rendered
   page for each of the six words the port had just minted. The rendered page is
   prose, and seventeen wordlist words are substrings of it - among them 'space',
   'capital' and 'matter', which the helper sentence THIS LANE ADDED put there,
   and 'hat' out of "That", 'hen' out of "hyphens", 'phrase' out of "passphrase".
   Measured over the real makePassphrase that is a 4.88% false red per run, with
   a message - "the screen printed the word <w>" - that anybody meeting it in CI
   would read as the import screen leaking a word of the owner's passphrase.

   Two claims replace it, and both are stronger than the one they replace:

     the screen does not ECHO what was typed - asserted with six fixed nonsense
     words the port can never draw, so the scan is a fact and not a lottery; and

     the refused screen does not DEPEND on what was typed - the entire rendered
     text after a wrong-word refusal is compared, character for character, to
     the same screen refused with six completely different wrong words. A screen
     that printed any part of the typed passphrase, in prose or in a code line,
     would differ between the two. Nothing about the fixed COPY is excused, and
     no assertion was loosened to get here. */
test('C-PN-16 - a wrong word still refuses on the screen, with the sentence the '
  + 'screen already had and nothing that depends on what was typed', async () => {
  const PROBE = ['zzzzzz', 'qqqqqq', 'xxxxxx', 'wwwwww', 'vvvvvv', 'uuuuuu'];
  let run = null;
  let other = null;
  try {
    run = await unlockWith('wrong', [...SIX.slice(0, 5), PROBE[0]].join(' '));
    other = await unlockWith('wrong', PROBE.join(' '));
    assert.equal(run.step, 'words', 'a wrong word did not keep the athlete on the words step');
    assert.deepEqual(run.refusal, { code: 'BUNDLE_AUTH_FAILED', detail: null },
      'the refusal on the screen carries something it did not carry before');
    assert.ok(run.text.includes(COPY.authFailed), 'the screen changed its refusal sentence');
    for (const word of PROBE) {
      assert.equal(run.text.includes(word), false, 'the screen printed back what was typed: ' + word);
      assert.equal(other.text.includes(word), false, 'the screen printed back what was typed: ' + word);
    }
    assert.equal(other.step, run.step);
    assert.deepEqual(other.refusal, run.refusal);
    assert.equal(other.text, run.text, 'the refused screen is not the same screen for two '
      + 'different wrong passphrases, so something on it depends on what the athlete typed');
  } finally { if (run) run.kit.close(); if (other) other.kit.close(); }
});

/* THE COPY. The owner did the right thing with the wrong separator because the
   screen never said which separator. It says so now, in plain words, beside the
   box he types into - and it says the third thing too, because the phone
   keyboard capitalises the first word whether he wants it to or not. */
test('C-PN-17 - the words step SAYS the words can be typed with spaces or with '
  + 'hyphens and that capitals do not matter, on the screen and not only in a '
  + 'constant', async () => {
  const kit = await page('copy');
  try {
    await kit.booted.api.render('import', true);
    pickBundle(kit.win, kit.doc.getElementById('import-file'), SEALED.bytes);
    await kit.booted.api.render('import', false);
    const painted = textOf(kit.doc);
    assert.ok(painted.includes(COPY.wordsLabel), 'the words label is not on the screen');
    assert.equal(typeof COPY.wordsHelp, 'string', 'the words step has no helper sentence');
    assert.ok(painted.includes(COPY.wordsHelp), 'the helper sentence is not painted');
    const help = COPY.wordsHelp.toLowerCase();
    for (const term of ['spaces', 'hyphens', 'capitals'])
      assert.ok(help.includes(term), 'the helper sentence never says "' + term + '"');
    for (const [key, value] of Object.entries(COPY))
      assert.equal(new RegExp('[' + EN_DASH + EM_DASH + ']').test(value), false,
        'an en or em dash in COPY.' + key);
  } finally { kit.close(); }
});

/* THE INPUT'S OWN HELPERS. autocapitalize and autocorrect are off because the
   six words are copied off paper; they stay off. What changes is that the
   screen now SURVIVES them rather than only asking the keyboard not to, which
   C-PN-15 executes - this cell keeps the request itself from being dropped on
   the way. */
test('C-PN-18 - the passphrase box still turns the phone keyboard\'s prose '
  + 'helpers off', async () => {
  const kit = await page('input');
  try {
    await kit.booted.api.render('import', true);
    pickBundle(kit.win, kit.doc.getElementById('import-file'), SEALED.bytes);
    await kit.booted.api.render('import', false);
    const input = kit.doc.getElementById('import-passphrase');
    assert.equal(input.getAttribute('autocapitalize'), 'off');
    assert.equal(input.getAttribute('autocorrect'), 'off');
    assert.equal(input.getAttribute('autocomplete'), 'off');
    assert.equal(input.spellcheck, false);
  } finally { kit.close(); }
});


test('C-PN-29 - wrong and malformed phrases have equal refusal text and records while each input retains its draft', async () => {
  const wrong = [...SIX.slice(0, 5), 'zzzzzz'].join(' ');
  const malformed = ' - - ';
  let one = null, two = null;
  try {
    one = await unlockWith('retained-draft', wrong);
    two = await unlockWith('retained-draft', malformed);
    assert.equal(one.step, 'words');
    assert.equal(two.step, 'words');
    const content = run => (run.kit.doc.getElementById('phone') || run.kit.doc.body).textContent;
    assert.equal(content(one), content(two), 'refusal textContent depends on the typed draft');
    assert.ok(content(one).includes(COPY.authFailed));
    assert.deepEqual(one.refusal, { code: 'BUNDLE_AUTH_FAILED', detail: null });
    assert.deepEqual(two.refusal, one.refusal, 'refusal record depends on the typed draft');
    assert.equal(one.kit.doc.getElementById('import-passphrase').value, wrong);
    assert.equal(two.kit.doc.getElementById('import-passphrase').value, malformed);
  } finally { if (one) one.kit.close(); if (two) two.kit.close(); }
});
