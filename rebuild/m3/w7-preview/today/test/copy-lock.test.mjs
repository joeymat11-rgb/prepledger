/* THE COPY LOCK (S10; S10-WORKING-BRIEF section 8; answers in rebuild/lanes/c/COPY-LOCK.md).
 *
 * A sealed cell over released and unsealed copy, in the shape of A.4 law 7 (a sealed cell
 * asserting what the product carries, against a pinned corpus). It needs no browser and no
 * engine module, so it runs unchanged on windows-latest and ubuntu-latest (answers 7, 8).
 *
 *   CL-PIN        the corpus bytes are the sealed ones
 *   CL-HOLDS      the tree carries exactly the pinned pieces, owners, counts and declarations
 *   CL-TWO-SIDED  the mandatory negative fixture: one sentence deleted from a rendered screen
 *                 AND from APPROVED_COPY in the same change is refused, naming the sentence
 *                 (red first: COPY_LOCK_UNDER_TEST=design-binding runs the same fixture
 *                 against the pre-lock guard, assertDesignBinding, which passes it)
 *   CL-PLANTS     copy moved into an unscanned file, into a new scanned file, to another
 *                 owner, duplicated, re-declared, or newly written is each refused by name, and
 *                 (review l1 F1-F3) a reworded sigil-led chunk, a sentence in an inline
 *                 <style>/<script> body, and an <input value> are each refused by name
 *   CL-COMPOSED   the released gym card mounted in the real shell and template, driven into
 *                 five named states incl. c6fb3017 N2: every word shown is locked copy or
 *                 the athlete's own fixture value, and each state's strings are the pinned set
 *   CL-CLOSURE    every design.cjs list string and every mounted state string is in the corpus */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import { driveGymStates, harvest, STATE_IDS, FIXTURE_VALUES, GymApp } from './copy-lock-states.mjs';

const require = createRequire(import.meta.url);
const lock = require('./copy-lock.cjs');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const CORPUS_FILE = path.join(HERE, 'copy-lock.corpus.json');
// The sealed corpus, by value. A re-measure changes this literal in the same reseal child.
const CORPUS_SHA256 = 'e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c';
const UNDER_TEST = process.env.COPY_LOCK_UNDER_TEST || 'lock';
const T = 'rebuild/m3/w7-preview/today';
const N2_ID = 'GYM-SETTINGS-N2';

const loaded = () => lock.readCorpus(CORPUS_FILE);

/* A private copy of every scanned file (tools included) plus the two approved 09-08
   references design.cjs's own binding reads, so a plant never touches the tree. */
function plantRoot(corpus) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-lock-'));
  const files = [...new Set([...lock.scanFiles(ROOT), ...corpus.tools,
    'rebuild/m1/approved-2026-09-08/Earned-refinement-A.html',
    'rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html'])];
  for (const f of files) {
    const to = path.join(dir, f);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(ROOT, f), to);
  }
  return dir;
}
const edit = (root, rel, from, to, times = 1) => {
  const file = path.join(root, rel);
  const text = fs.readFileSync(file, 'utf8');
  const parts = text.split(from);
  assert.equal(parts.length - 1, times, 'PLANT-ANCHOR ' + rel + ' ' + JSON.stringify(from));
  fs.writeFileSync(file, parts.join(to));
};
const write = (root, rel, text) => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), text); };

/* The guard under test on a planted root: the lock, or (red first) the guard the tree had
   before it, design.cjs's own binding over the planted design.cjs, template and views. */
function refusals(root, corpus) {
  if (UNDER_TEST === 'design-binding') {
    const d = require(path.join(root, T, 'design.cjs'));
    try { d.assertDesignBinding(d.readApproved(), d.templateHtml(), d.appSource()); return []; }
    catch (error) { return [String(error.message)]; }
  }
  assert.equal(UNDER_TEST, 'lock', 'COPY_LOCK_UNDER_TEST must be lock or design-binding');
  return lock.check(root, corpus);
}
const names = (lines, sentence) => lines.some((l) => l.includes(JSON.stringify(sentence)));

test('CL-PIN: the corpus is the sealed one', () => {
  const { corpus, sha256 } = loaded();
  assert.equal(corpus.schema, lock.SCHEMA, 'CL-PIN-SCHEMA');
  assert.equal(sha256, CORPUS_SHA256, 'CL-PIN-CORPUS-MOVED');
  assert.deepEqual(corpus.scanRoots, lock.SCAN_ROOTS, 'CL-PIN-SCAN-ROOTS');
  assert.deepEqual(STATE_IDS.slice().sort(), Object.keys(corpus.states).sort(), 'CL-PIN-STATE-SET');
});

test('CL-HOLDS: the composed tree carries exactly the locked copy', () => {
  const { corpus } = loaded();
  assert.deepEqual(lock.check(ROOT, corpus), [], 'CL-HOLDS');
});

test('CL-TWO-SIDED: a sentence deleted from a rendered screen and from APPROVED_COPY together is refused by name', () => {
  const { corpus } = loaded();
  const sentence = 'Your food plan.';
  assert(corpus.entries.some((e) => e.text === sentence && e.lists.includes('APPROVED_COPY')
    && e.files[T + '/screens.template.html'] === 1), 'CL-TWO-SIDED-PRECONDITION');
  const root = plantRoot(corpus);
  try {
    edit(root, T + '/screens.template.html', '<h1>Your food plan.</h1>', '<h1></h1>');
    edit(root, T + '/design.cjs', '"Today", "Your food plan.",', '"Today",');
    const got = refusals(root, corpus);
    assert(got.length > 0 && names(got, sentence), 'CL-TWO-SIDED-NOT-REFUSED: the coordinated deletion of '
      + JSON.stringify(sentence) + ' passed ' + UNDER_TEST);
    if (UNDER_TEST === 'lock') {
      assert(got.includes(`COPY-LOCK MISSING ${T}/screens.template.html 1 of 1 "Your food plan."`), 'CL-TWO-SIDED-SCREEN');
      assert(got.includes('COPY-LOCK DECLARATION-DROPPED APPROVED_COPY "Your food plan."'), 'CL-TWO-SIDED-LIST');
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('CL-PLANTS: moved, duplicated, re-owned, re-declared and new copy are each refused by name', { skip: UNDER_TEST !== 'lock' }, () => {
  const { corpus } = loaded();
  const S = 'Settings could not be read.';
  const G = T + '/gym-app.mjs';
  assert.equal(corpus.entries.find((e) => e.text === S)?.files[G], 1, 'CL-PLANTS-PRECONDITION');
  const cases = [
    ['control, no plant', () => {}, []],
    ['moved into a file outside every scan root', (r) => {
      edit(r, G, `'${S}'`, "'' + String.fromCharCode(83)");
      write(r, 'rebuild/m3/w7-preview/elsewhere.mjs', `export const X = '${S}';\n`);
    }, [`COPY-LOCK MISSING ${G} 1 of 1 "${S}"`]],
    ['moved into a new file under a scan root', (r) => {
      edit(r, G, `'${S}'`, "'' + String.fromCharCode(83)");
      write(r, T + '/copy-home.mjs', `export const X = '${S}';\n`);
    }, [`COPY-LOCK MISSING ${G} 1 of 1 "${S}"`, `COPY-LOCK OWNER-CHANGED ${T}/copy-home.mjs now carries 1 "${S}"`]],
    ['moved to another existing owner', (r) => {
      edit(r, G, `'${S}'`, "'' + String.fromCharCode(83)");
      fs.appendFileSync(path.join(r, T, 'today-readings.cjs'), `\nvoid '${S}';\n`);
    }, [`COPY-LOCK MISSING ${G} 1 of 1 "${S}"`, `COPY-LOCK OWNER-CHANGED ${T}/today-readings.cjs now carries 1 "${S}"`]],
    ['duplicated in its owner', (r) => { fs.appendFileSync(path.join(r, G), `\nvoid '${S}';\n`); },
      [`COPY-LOCK DUPLICATED ${G} 2 for 1 "${S}"`]],
    ['re-declared from one list to another', (r) => {
      edit(r, T + '/design.cjs', '  "Not now",\n', '');
      edit(r, T + '/design.cjs', '"Back to my plan", "Today",', '"Back to my plan", "Not now", "Today",');
    }, ['COPY-LOCK DECLARATION-ADDED APPROVED_COPY "Not now"', 'COPY-LOCK DECLARATION-DROPPED PREVIEW_COPY "Not now"']],
    ['a sentence nobody locked', (r) => { fs.appendFileSync(path.join(r, T, 'today-app.cjs'), "\nvoid 'Brand new words for the athlete.';\n"); },
      [`COPY-LOCK UNLOCKED ${T}/today-app.cjs "Brand new words for the athlete."`]],
    ['one word changed in a released sentence', (r) => { edit(r, G, `'${S}'`, "'Settings could not be loaded.'"); },
      [`COPY-LOCK MISSING ${G} 1 of 1 "${S}"`, `COPY-LOCK UNLOCKED ${G} "Settings could not be loaded."`]],
    // REVIEW-S10-COPYLOCK-l1 F1 (P1): a chunk led by a sigil and a space is words, not a selector.
    ['a dot-led boot-refusal chunk reworded (today-app.cjs athleteStateFailureCopy)', (r) => {
      edit(r, T + '/today-app.cjs', '+ ". Nothing was recorded.";', '+ ". Nothing recorded.";');
    }, [`COPY-LOCK MISSING ${T}/today-app.cjs 1 of 1 ". Nothing was recorded."`, `COPY-LOCK UNLOCKED ${T}/today-app.cjs ". Nothing recorded."`]],
    // F2 (P2): inline <style> content: text and inline <script> string literals in scanned markup.
    ['a sentence in an inline <style> content: rule of the template', (r) => {
      edit(r, T + '/screens.template.html', '<h1>Your food plan.</h1>', '<style>h1::after{content:"Brand new words for the athlete."}</style><h1>Your food plan.</h1>');
    }, [`COPY-LOCK UNLOCKED ${T}/screens.template.html "Brand new words for the athlete."`]],
    ['a sentence in an inline <script> string literal of the template', (r) => {
      edit(r, T + '/screens.template.html', '<h1>Your food plan.</h1>', "<script>void 'Brand new words in a script.';</script><h1>Your food plan.</h1>");
    }, [`COPY-LOCK UNLOCKED ${T}/screens.template.html "Brand new words in a script."`]],
    // F3 (P4): an <input value=...> is text the athlete reads, in markup and in JS-carried markup.
    ['visible text in an <input value=> of the template', (r) => {
      edit(r, T + '/screens.template.html', '<h1>Your food plan.</h1>', '<h1>Your food plan.</h1><input type="submit" value="Save it now please">');
    }, [`COPY-LOCK UNLOCKED ${T}/screens.template.html "Save it now please"`]],
    ['visible text in an <input value=> carried by a JS markup string', (r) => {
      fs.appendFileSync(path.join(r, G), "\nvoid '<input type=\"button\" value=\"Keep going now\">';\n");
    }, [`COPY-LOCK UNLOCKED ${G} "Keep going now"`]],
  ];
  // Every row is judged, and every failing row is named, so one run shows the whole red set.
  const failed = [];
  for (const [label, plant, expected] of cases) {
    const root = plantRoot(corpus);
    try {
      plant(root);
      const got = lock.check(root, corpus);
      if (!expected.length && got.length) failed.push('CL-PLANTS ' + label + ': control refused ' + JSON.stringify(got));
      for (const line of expected) if (!got.includes(line)) failed.push('CL-PLANTS ' + label + ': missing refusal ' + line + '; got ' + JSON.stringify(got));
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  }
  assert.deepEqual(failed, [], 'CL-PLANTS');
});

test('CL-COMPOSED: the mounted gym card shows only locked copy, state by state, N2 included', { skip: UNDER_TEST !== 'lock', timeout: 30000 }, async () => {
  const { corpus } = loaded();
  const driven = await driveGymStates();
  const pieces = corpus.entries.map((e) => e.text);
  // the decomposition must be able to fail: a word no piece carries is reported
  assert.equal(lock.uncovered('Synthetic lift zqxv wibble', pieces, FIXTURE_VALUES), 'zqxv wibble', 'CL-COMPOSED-DECOMPOSITION-BLIND');
  // REVIEW-S10-COPYLOCK-l1 F3 (P4), mounted side: an input's current value is text on the
  // screen; the harvest must read it (a hidden input's value is never shown and is not read).
  const probe = new JSDOM('<body><input type="submit" value="Save it now please"><input type="text">'
    + '<input type="hidden" value="Never on screen"><textarea></textarea></body>');
  const [submit, typed, , area] = probe.window.document.querySelectorAll('input, textarea');
  typed.value = 'Typed after mount'; area.value = 'Written after mount';
  const seen = harvest(probe.window.document);
  probe.window.close();
  for (const t of ['Save it now please', 'Typed after mount', 'Written after mount']) assert(seen.includes(t), 'CL-COMPOSED-HARVEST-BLIND-VALUE ' + JSON.stringify(t) + ' ' + JSON.stringify(seen));
  assert(!seen.includes('Never on screen') && submit, 'CL-COMPOSED-HARVEST-HIDDEN-VALUE');
  // on the real card: the answer typed into the settings editor is on screen in N2
  assert(driven.states[N2_ID].texts.includes('six'), 'CL-COMPOSED-N2-TYPED-VALUE-UNSEEN ' + JSON.stringify(driven.states[N2_ID].texts));
  for (const id of STATE_IDS) {
    const s = driven.states[id];
    assert(s, 'CL-COMPOSED-STATE-NOT-REACHED ' + id);
    for (const t of s.texts) assert.equal(lock.uncovered(t, pieces, FIXTURE_VALUES), '', 'CL-COMPOSED-UNLOCKED ' + id + ' ' + JSON.stringify(t));
    assert.deepEqual([...s.texts].sort(), corpus.states[id].texts, 'CL-COMPOSED-STATE-COPY ' + id);
    assert.equal(s.error, corpus.states[id].error, 'CL-COMPOSED-STATE-ERROR ' + id);
  }
  // c6fb3017 N2, as it stands: one settings record really was written, and the card keeps
  // the earlier refusal's sentence. Pinned, not repaired (no repair grant; J3 asks Joe).
  assert.equal(driven.opsAdded, 1, 'CL-COMPOSED-N2-NOT-RECORDED');
  assert.deepEqual(driven.n2Latest, { exercise_id: 'copy-lock-lift', settings: [{ name: 'Seat', value: 'four' }] }, 'CL-COMPOSED-N2-RECORD');
  assert.equal(corpus.states[N2_ID].error, GymApp.SETTINGS_NOTHING, 'CL-COMPOSED-N2-MESSAGE');
  assert.equal(corpus.states['GYM-SETTINGS-REFUSED-EMPTY'].error, GymApp.SETTINGS_NOTHING, 'CL-COMPOSED-REFUSED-MESSAGE');
  assert.equal(corpus.states['GYM-SETTINGS-SAVED'].error, '', 'CL-COMPOSED-SAVED-CLEARS');
});

test('CL-CLOSURE: every declared list string and every mounted state string is locked', { skip: UNDER_TEST !== 'lock' }, () => {
  const { corpus } = loaded();
  const design = require(path.join(ROOT, T, 'design.cjs'));
  const texts = new Set(corpus.entries.map((e) => e.text));
  for (const name of lock.LISTS) for (const s of design[name]) assert(texts.has(s), 'CL-CLOSURE-LIST ' + name + ' ' + JSON.stringify(s));
  for (const e of corpus.entries) if (!e.lists.length) assert(Object.keys(e.files).length > 0, 'CL-CLOSURE-ORPHAN ' + JSON.stringify(e.text));
  assert(corpus.entries.every((e) => Object.keys(e.files).every((f) => corpus.scanned.includes(f))), 'CL-CLOSURE-SCANNED');
});
