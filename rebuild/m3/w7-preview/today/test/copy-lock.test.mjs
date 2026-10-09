/* THE COPY LOCK (S10; S10-WORKING-BRIEF section 8; answers in rebuild/lanes/c/COPY-LOCK.md).
 *
 * A sealed cell over released and unsealed copy, in the shape of A.4 law 7 (a sealed cell
 * asserting what the product carries, against a pinned corpus). It needs no browser, and only
 * the two S11 T3m cells below load engine code (pure public factories, no protected module), so
 * it runs unchanged on windows-latest and ubuntu-latest (answers 7, 8).
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
 *   CL-CLOSURE    every design.cjs list string and every mounted state string is in the corpus
 *
 * Added by the S11 reseal child (M2-S11-NATIVE-LOAD, brief rev6 2.3, Astra L1 B2, step T3l):
 *   CL-S11-DELTA  the S11 corpus is the sealed S10 corpus plus exactly the approved S11 copy: each
 *                 new piece with its one owner, count and approving ledger line (DECISIONS:798,
 *                 :842), the three sealed words today-entry.mjs newly carries re-owned, and the
 *                 rest serializing back to the S10 corpus bytes
 *   CL-ENGINE-COPY the approved native-load explanation templates (rebuild/engine, outside
 *                 SCAN_ROOTS, which stay unwidened) pinned byte for byte (D-S11R6-3; DECISIONS:804,
 *                 :842, :843); CL-ENGINE-COPY-TEETH shows a reworded or duplicated one is refused
 *
 * Added by S11 step T3m (Astra L1 B1 of job 146: a source pin counts a template once, so a changed
 * live literal plus the old block pasted into a comment stayed green):
 *   CL-ENGINE-OUTPUT the explanations the engine RETURNS, through FC01's public evaluateNativeLoad,
 *                 equal the approved words exactly for every brief rev7 2.3 F case (F1 with each F2
 *                 reason, F3a/F3b/F3c, F4, each F5 form); the only cells here that load engine code: the
 *                 twelve public factories plus native-load.cjs, under a loader guard that refuses the
 *                 protected five and every other engine file; CL-ENGINE-OUTPUT-TEETH shows the comment
 *                 decoy and a one-character change in each template literal are each refused
 *
 * Added by S12 (M2-S12-LOOK, the 09-18 look; COPY-LOCK-ADDITIONS.md):
 *   CL-S12-DELTA  the S12 corpus is the sealed S11 corpus plus exactly copy-lock.s12-delta.json (pieces added,
 *                 removed and changed, mounted states, scanned files), proven both ways; CL-S11-DELTA runs on
 *                 the S11 corpus that delta reconstructs byte for byte
 *   CL-S12-APPROVAL the delta names the ledger line that approves its words (PENDING until the owner rules) */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { driveGymStates, harvest, STATE_IDS, FIXTURE_VALUES, GymApp } from './copy-lock-states.mjs';

const require = createRequire(import.meta.url);
const lock = require('./copy-lock.cjs');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const CORPUS_FILE = path.join(HERE, 'copy-lock.corpus.json');
// The sealed corpus, by value. A re-measure changes this literal in the same reseal child.
const CORPUS_SHA256 = '70efc98d97eba4f1b347f523a3ae8a8cb8863171c0860812d832ca80ad98e328';
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
    // S11 (T3l): the approved S11 copy is locked like the rest (both rows are red on the S10 corpus, which
    // pins neither the new sentence nor today-entry.mjs as an owner of "Yes").
    ['an S11 approved sentence reworded (today-entry.mjs NATIVE_LOAD_COPY.check)', (r) => {
      edit(r, T + '/today-entry.mjs', 'check: "Check next weight",', 'check: "Check the next weight",');
    }, [`COPY-LOCK MISSING ${T}/today-entry.mjs 1 of 1 "Check next weight"`, `COPY-LOCK UNLOCKED ${T}/today-entry.mjs "Check the next weight"`]],
    ['an S11 re-owned word dropped from its new owner (today-entry.mjs NATIVE_LOAD_COPY.yes)', (r) => {
      edit(r, T + '/today-entry.mjs', 'yes: "Yes",', 'yes: "Y" + "es",');
    }, [`COPY-LOCK MISSING ${T}/today-entry.mjs 1 of 1 "Yes"`]],
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

/* ---------------- S11 (M2-S11-NATIVE-LOAD, brief rev6 2.3, step T3l) ---------------- */

/* The S11 copy delta over the sealed S10 corpus (T3L-COPY-REPORT section 4, classes A, C, D and E). Every new
   piece is owned by today-entry.mjs alone, once, and sits in no design.cjs list; each names the ledger line that
   approves its exact words: DECISIONS:798 (the five NATIVE_LOAD_PROPOSED_COPY strings, "Approve all 5", exactly
   as at c0695e0) or DECISIONS:842 (every other string, approved as written under Joe's delegation, exactly as at
   the composed today-entry.mjs of 9288adf). */
const S10_CORPUS_SHA256 = 'e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c';
const S11_OWNER = T + '/today-entry.mjs';
const S11_NEW = Object.freeze([
  // class A: NATIVE_LOAD_PROPOSED_COPY (the Undo offer and the two hold notices)
  [': undo the agreed weight', 'DECISIONS:798'],
  ['No working weight', 'DECISIONS:798'],
  ['Undone. The agreed weight will not be used.', 'DECISIONS:798'],
  ['a workout behind your agreed weight was corrected, so this lift is left off your workouts for now. Check next weight to undo the agreed weight.', 'DECISIONS:798'],
  ['your working weight changed after you agreed to a new one, so this lift is left off your workouts for now. Check next weight to undo the agreed weight.', 'DECISIONS:798'],
  // class C: NATIVE_LOAD_COPY (the button and the six status lines)
  ['Check next weight', 'DECISIONS:842'],
  ['Checking your saved workout.', 'DECISIONS:842'],
  ['Your workout is saved. The next weight could not be checked.', 'DECISIONS:842'],
  ['Your choice is saved; the next card could not be checked.', 'DECISIONS:842'],
  ['Your saved workout changed since this offer. Check again for a current one.', 'DECISIONS:842'],
  ['No new weight to agree to yet. Your saved sets are kept.', 'DECISIONS:842'],
  ['Saved. The new weight applies on a later workout.', 'DECISIONS:842'],
  // class E: the offer card's headings after the lift name, and its set list's aria-label
  [': next weight', 'DECISIONS:842'],
  [': set your working weight', 'DECISIONS:842'],
  ['Offered weight for each set', 'DECISIONS:842'],
]);
// class D: sealed words today-entry.mjs newly carries (the offer's Yes and Not now buttons, its "Set <n>: " lines),
// approved in this use at DECISIONS:842; their S10 owners, counts and lists are unchanged.
const S11_REOWNED = Object.freeze([
  ['Yes', { 'rebuild/m3/w7-preview/import/import-screen.mjs': 1 }, [], 'DECISIONS:842'],
  ['Not now', { [T + '/design.cjs']: 1, [T + '/screens.template.html']: 1 }, ['PREVIEW_COPY'], 'DECISIONS:842'],
  ['Set ', { [T + '/gym-app.mjs']: 1, [T + '/gym-model.mjs']: 1 }, [], 'DECISIONS:842'],
]);
// The re-measure tool's serializer (copy-lock-measure.mjs), restated so the S10 view of this corpus is compared
// with the sealed S10 corpus by bytes.
const DASHES = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']', 'g');
const serialize = (c) => JSON.stringify(c, null, 1).replace(DASHES, (ch) => '\\u' + ch.charCodeAt(0).toString(16)) + '\n';
const sortedFiles = (files) => Object.fromEntries(Object.entries(files).sort((a, b) => (a[0] < b[0] ? -1 : 1)));
// The S10 view: this corpus minus the S11 pieces, with today-entry.mjs dropped as an owner of the re-owned words.
function s10View(corpus) {
  const added = new Set(S11_NEW.map(([text]) => text));
  const reowned = new Set(S11_REOWNED.map(([text]) => text));
  const entries = corpus.entries.filter((e) => !added.has(e.text)).map((e) => (reowned.has(e.text)
    ? { ...e, files: Object.fromEntries(Object.entries(e.files).filter(([f]) => f !== S11_OWNER)) } : e));
  return { ...corpus, entries };
}

/* ---------------- S12 (M2-S12-LOOK, the 09-18 look; copy re-measure) ---------------- */

/* The S12 copy delta over the sealed S11 corpus. copy-lock.s12-delta.json (sealed beside the corpus, pinned by
   S12_DELTA_SHA256) lists every piece the look ADDED, every piece it REMOVED, every piece whose owners, counts or
   lists CHANGED (before and after, whole), every mounted state whose words changed (before and after), and the
   scanned files it added. CL-S12-DELTA proves the delta is exact in both directions: each listed piece is in the
   corpus as listed, and the corpus with the delta taken back out serializes to the SEALED S11 corpus bytes
   (S11_CORPUS_SHA256), so no unlisted piece, owner, count, list, state or scanned file moved. CL-S11-DELTA below then
   runs on that reconstructed S11 corpus, unchanged in what it asserts. The words themselves are the owner's to
   approve: S12_COPY_APPROVAL names the ledger line that approves this delta (CL-S12-APPROVAL). */
const S11_CORPUS_SHA256 = '58dc7a743fc883af09537a6db7692ac008ae036cb18779333e97e2f504335f8c';
const S12_DELTA_FILE = path.join(HERE, 'copy-lock.s12-delta.json');
const S12_DELTA_SHA256 = '33d1c3cdae31c7614250442769c1a61aa7892b761dfef2654520e175fc7f6b3c';
/* DECISIONS:905 (1) (owner, 2026-10-09: "the PM approves the look's strings against the approved boards and the owner's
   words of :817/:820", option 1; the owner is sent the full list after release, and any string he flags is changed in a
   later fix). */
const S12_COPY_APPROVAL = 'DECISIONS:905';
const s12Delta = () => {
  const bytes = fs.readFileSync(S12_DELTA_FILE);
  return { delta: JSON.parse(bytes.toString('utf8')), sha256: lock.sha256(bytes) };
};
const byTextOrder = (a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0);
// The S11 view: this corpus with the S12 delta taken back out, whole entries and states restored as sealed.
function s11View(corpus, delta = s12Delta().delta) {
  const added = new Set(delta.added.map((e) => e.text));
  const before = new Map(delta.changed.map((c) => [c.text, c.before]));
  const entries = corpus.entries.filter((e) => !added.has(e.text)).map((e) => (before.has(e.text) ? before.get(e.text) : e))
    .concat(delta.removed).sort(byTextOrder);
  const states = Object.fromEntries(Object.entries(corpus.states).map(([id, s]) => [id, delta.states[id] ? delta.states[id].before : s]));
  const scanned = corpus.scanned.filter((f) => !delta.scanned.added.includes(f)).concat(delta.scanned.removed)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return { ...corpus, scanned, states, entries };
}

test('CL-S12-DELTA: the S12 corpus is the sealed S11 corpus plus exactly the listed S12 delta, both directions', () => {
  const { corpus } = loaded();
  const { delta, sha256 } = s12Delta();
  assert.equal(sha256, S12_DELTA_SHA256, 'CL-S12-DELTA-FILE-MOVED');
  assert.equal(delta.from, S11_CORPUS_SHA256, 'CL-S12-DELTA-FROM');
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const e of delta.added) if (JSON.stringify(byText.get(e.text) || null) !== JSON.stringify(e)) failed.push('CL-S12-DELTA ADDED ' + JSON.stringify(e.text));
  for (const e of delta.removed) if (byText.has(e.text)) failed.push('CL-S12-DELTA REMOVED-STILL-THERE ' + JSON.stringify(e.text));
  for (const c of delta.changed) {
    if (JSON.stringify(byText.get(c.text) || null) !== JSON.stringify(c.after)) failed.push('CL-S12-DELTA CHANGED-AFTER ' + JSON.stringify(c.text));
    if (JSON.stringify(c.before) === JSON.stringify(c.after)) failed.push('CL-S12-DELTA CHANGED-NOT-A-CHANGE ' + JSON.stringify(c.text));
  }
  for (const [id, s] of Object.entries(delta.states)) if (JSON.stringify(corpus.states[id]) !== JSON.stringify(s.after)) failed.push('CL-S12-DELTA STATE-AFTER ' + id);
  for (const f of delta.scanned.added) if (!corpus.scanned.includes(f)) failed.push('CL-S12-DELTA SCANNED-ADDED ' + f);
  const s11 = lock.sha256(Buffer.from(serialize(s11View(corpus, delta)), 'utf8'));
  if (s11 !== S11_CORPUS_SHA256) failed.push('CL-S12-DELTA S11-VIEW ' + s11);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the S11 corpus
  const touched = new Set([...delta.added, ...delta.changed].map((e) => e.text));
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => !touched.has(e.text) && Object.keys(e.files).length > 0);
  assert(other, 'CL-S12-DELTA-TEETH-PRECONDITION');
  const [owner] = Object.keys(other.files);
  other.files[owner] += 1;
  if (lock.sha256(Buffer.from(serialize(s11View(moved, delta)), 'utf8')) === S11_CORPUS_SHA256) failed.push('CL-S12-DELTA S11-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-S12-DELTA');
});

test('CL-S12-APPROVAL: the S12 copy delta names the ledger line that approves it', () => {
  assert.match(S12_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-S12-APPROVAL-PENDING: the owner has not approved the S12 copy delta');
});

test('CL-S11-DELTA: the S11 corpus is the S10 corpus plus exactly the approved S11 copy, each with its owner and approval', () => {
  // S12: judged on the sealed S11 corpus, which s11View rebuilds byte for byte from this corpus (CL-S12-DELTA)
  const corpus = s11View(loaded().corpus);
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, approval] of S11_NEW) {
    const want = { text, files: { [S11_OWNER]: 1 }, lists: [] };
    const got = byText.get(text) || null;
    if (JSON.stringify(got) !== JSON.stringify(want)) failed.push('CL-S11-DELTA NEW ' + approval + ' ' + JSON.stringify(text) + ' is ' + JSON.stringify(got));
  }
  for (const [text, s10Files, lists, approval] of S11_REOWNED) {
    const want = { text, files: sortedFiles({ ...s10Files, [S11_OWNER]: 1 }), lists };
    const got = byText.get(text) || null;
    if (JSON.stringify(got) !== JSON.stringify(want)) failed.push('CL-S11-DELTA RE-OWNED ' + approval + ' ' + JSON.stringify(text) + ' is ' + JSON.stringify(got));
  }
  // every other piece, owner, count, list, state, tool and scanned file is the sealed S10 corpus's, byte for byte
  const s10 = lock.sha256(Buffer.from(serialize(s10View(corpus)), 'utf8'));
  if (s10 !== S10_CORPUS_SHA256) failed.push('CL-S11-DELTA S10-VIEW ' + s10);
  // ... and that comparison can fail: one unrelated owner count moved is no longer the S10 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && other.files[T + '/gym-app.mjs'] === 1, 'CL-S11-DELTA-TEETH-PRECONDITION');
  other.files[T + '/gym-app.mjs'] = 2;
  if (lock.sha256(Buffer.from(serialize(s10View(moved)), 'utf8')) === S10_CORPUS_SHA256) failed.push('CL-S11-DELTA S10-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-S11-DELTA');
});

/* D-S11R6-3, PM RULED at DECISIONS:843 (2): a red-first pin per approved engine explanation template, never a
   silent SCAN_ROOTS widening. The sentence under an offer card is the engine's: today-entry.mjs shows
   offer.reason, which the W6 host copies from the native-load issuance. Those templates live in
   rebuild/engine/native-load.cjs, outside SCAN_ROOTS, so the static lock never sees them. Each approved template
   is pinned here by its exact source text (CR folded, as the lock folds it) and must occur exactly once in that one
   named file, which is read as text and never loaded. A reworded, removed or duplicated template is refused by
   name. `at` is provenance (native-load.cjs sha256 92a4a0b4 at 9288adf), never used to find a block. Not pinned:
   the queue entry's text and rule (native-load.cjs :550-551), which no screen shows (T3L-COPY-REPORT F7) and which
   were not put to the owner. */
const NATIVE_LOAD = 'rebuild/engine/native-load.cjs';
const ENGINE_TEMPLATES = Object.freeze([
  { id: 'NL-LOADS', at: ':148-151', approval: 'DECISIONS:842 (the load formats)', source: [
    "const setLoads = (vector) => {",
    "  const values = vector.map((x) => (x && typeof x.value === 'number' ? x.value + ' lb' : 'no load'));",
    "  return values.every((v) => v === values[0]) ? values[0] + ' on every set' : values.join(', ');",
    "};",
  ].join('\n') },
  { id: 'NL-EARN', at: ':152-161', approval: 'DECISIONS:842 (the earn explanation and its four increase reasons)', source: [
    "function earnReason(ex, cand, rows, target, base, terminal, hot) {",
    "  const name = String(ex.n || ex.id);",
    "  const days = rows.map((r) => r.date).join(', ');",
    "  const how = /_2r$/.test(cand.id) ? 'a two-step increase, because your last set had ' + terminal + ' reps left'",
    "    : /_1s$/.test(cand.id) ? (hot ? 'an early increase from one top of the window: your opening set was hard, your last set had ' + terminal + ' reps left'",
    "      : 'an early increase from one top of the window, with ' + terminal + ' reps left on your last set')",
    "    : 'a one-step increase after topping the rep window';",
    "  return name + ': you topped the rep window at ' + setLoads(base) + ' (workouts on ' + days + '). Offer: ' + setLoads(target) +",
    "    ', ' + how + '. Nothing changes unless you say yes; it then applies on a later ' + name + ' workout.';",
    "}",
  ].join('\n') },
  { id: 'NL-ADOPT', at: ':165-171', approval: 'DECISIONS:804 (the missed-Close parenthetical) and DECISIONS:842 (the ordinary and no-working-weight adopt explanations and the frame the three share)', source: [
    "function adoptReason(ex, row, target, baseline, missed) {",
    "  const name = String(ex.n || ex.id);",
    "  const card = missed ? ' (the card said ' + setLoads(missed.map(loadOf)) + ', your first workout at the new weight you agreed; your working weight stayed ' + setLoads(planVector(ex).map(loadOf)) + ')'",
    "    : ' (the card said ' + setLoads(planVector(ex).map(loadOf)) + ')';",
    "  return name + ': on ' + row.date + ' you completed every set at ' + setLoads(target) + (baseline ? ', and no working weight was on file'",
    "    : card) + '. Offer: make that your working weight. This sets your working weight; it is not an earned increase. Nothing changes unless you say yes.';",
    "}",
  ].join('\n') },
  { id: 'NL-UNDO', at: ':406-407', approval: 'DECISIONS:842 (the undo explanation)', source: [
    "  const name = String(ex.n || ex.id);",
    "  return [{ body, reason: name + ': undo the choice you agreed to before any workout used it. Your working weight goes back to ' + setLoads(target.vector) + '. The workouts it came from stay recorded and are not counted again.' }];",
  ].join('\n') },
]);
const engineLine = (t, state) => `ENGINE-COPY ${state} ${t.id} ${NATIVE_LOAD} ${t.at} ${t.approval}`;
function engineCopyRefusals(root) {
  const src = fs.readFileSync(path.join(root, NATIVE_LOAD), 'utf8').replace(/\r\n?/g, '\n');
  const out = [];
  for (const t of ENGINE_TEMPLATES) {
    const n = src.split(t.source).length - 1;
    if (n !== 1) out.push(engineLine(t, n === 0 ? 'CHANGED' : 'DUPLICATED ' + n));
  }
  return out;
}

test('CL-ENGINE-COPY: each approved native-load explanation template is in native-load.cjs byte for byte, once', () => {
  assert.deepEqual(engineCopyRefusals(ROOT), [], 'CL-ENGINE-COPY');
});

test('CL-ENGINE-COPY-TEETH: a reworded or duplicated template is refused by name; a CRLF checkout is not', () => {
  // one wording change per template, inside its approved words, each anchored exactly once in the file
  const plants = [
    ['NL-LOADS', "' on every set'", "' on each set'"],
    ['NL-EARN', "'a one-step increase after topping the rep window'", "'a one-step increase after topping the window'"],
    ['NL-ADOPT', 'your first workout at the new weight you agreed', 'your first workout at the weight you agreed'],
    ['NL-UNDO', 'are not counted again.', 'are not counted twice.'],
  ];
  assert.deepEqual(plants.map(([id]) => id), ENGINE_TEMPLATES.map((t) => t.id), 'CL-ENGINE-COPY-TEETH-ONE-PLANT-PER-TEMPLATE');
  const original = fs.readFileSync(path.join(ROOT, NATIVE_LOAD), 'utf8');
  const failed = [];
  const judge = (label, text, expected) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-lock-engine-'));
    try {
      write(dir, NATIVE_LOAD, text);
      const got = engineCopyRefusals(dir);
      if (JSON.stringify(got) !== JSON.stringify(expected)) failed.push('CL-ENGINE-COPY-TEETH ' + label + ': got ' + JSON.stringify(got) + ', expected ' + JSON.stringify(expected));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  };
  plants.forEach(([id, from, to], i) => {
    const t = ENGINE_TEMPLATES[i];
    assert.equal(original.split(from).length - 1, 1, 'CL-ENGINE-COPY-TEETH-ANCHOR ' + id);
    assert(t.source.includes(from), 'CL-ENGINE-COPY-TEETH-ANCHOR-OUTSIDE ' + id);
    judge('reworded ' + id, original.split(from).join(to), [engineLine(t, 'CHANGED')]);
    judge('duplicated ' + id, original + '\n' + t.source + '\n', [engineLine(t, 'DUPLICATED 2')]);
  });
  judge('CRLF checkout', original.replace(/\r?\n/g, '\r\n'), []);
  assert.deepEqual(failed, [], 'CL-ENGINE-COPY-TEETH');
});

/* ---------------- S11 T3m (Astra L1 B1 of job 146; brief rev7 2.3 F; D-S11R6-3) ----------------
   CL-ENGINE-COPY counts each approved template block once in SOURCE, so a changed live literal plus the old block
   pasted into a comment stays green (Astra L1 B1). These cells pin what the page is actually given: the offer
   explanations FC01 RETURNS through its public evaluateNativeLoad, compared as whole strings with the approved words
   of brief rev7 2.3 F (approved as written at DECISIONS:842 (2); the missed-Close parenthetical at DECISIONS:804),
   written out below by hand from those templates, never computed from the engine. The engine is composed the way
   FC12 (rebuild/m4/spec/native-load-options.test.cjs engineAt) composes it: the twelve public factories in the
   engine-runtime MODULES order, then native-load.cjs (FC12 N20 shows that composition returns Evaluations
   byte-equal to both host runtimes'). Engine files are compiled from their text by a private allow-list loader,
   never require: only the twelve, entered-load.cjs (performed.cjs's one relative require) and native-load.cjs can
   be read; the protected five (seed, migrate, merge, index, oracle-shim) and every other name are refused before
   any read. Every fixture value is invented. The source pins above stay as a supplementary check. */
const ENGINE_PUBLIC = Object.freeze(['dates', 'constants', 'plan', 'performed', 'progression', 'sleep', 'energy', 'policy', 'today', 'volume', 'earn', 'writers']);
const ENGINE_ALLOWED = new Set([...ENGINE_PUBLIC, 'entered-load'].map((n) => 'rebuild/engine/' + n + '.cjs').concat(NATIVE_LOAD));
const PROTECTED_ENGINE = /(^|\/)rebuild\/engine\/(seed|migrate|merge|index|oracle-shim)\.cjs$/;
const ENGINE_LOADED = new Set();
const ENGINE_PUBLIC_CACHE = new Map();
function engineLoader(nativeText) {
  const own = new Map();
  const load = (rel) => {
    if (PROTECTED_ENGINE.test(rel)) throw new Error('CL-ENGINE-OUTPUT-PROTECTED-REFUSED ' + rel);
    if (!ENGINE_ALLOWED.has(rel)) throw new Error('CL-ENGINE-OUTPUT-UNLISTED-REFUSED ' + rel);
    const cache = rel === NATIVE_LOAD ? own : ENGINE_PUBLIC_CACHE;
    if (cache.has(rel)) return cache.get(rel).exports;
    ENGINE_LOADED.add(rel);
    const code = rel === NATIVE_LOAD ? nativeText : fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const module = { exports: {} };
    cache.set(rel, module);
    const fn = vm.compileFunction(code, ['require', 'module', 'exports'], { filename: path.join(ROOT, rel) });
    fn((id) => {
      if (typeof id !== 'string' || !id.startsWith('./')) throw new Error('CL-ENGINE-OUTPUT-REQUIRE-REFUSED ' + id + ' from ' + rel);
      return load(path.posix.join(path.posix.dirname(rel), id));
    }, module, module.exports);
    return module.exports;
  };
  return load;
}
const engineRefusing = (name) => {
  const fail = () => { const e = new Error('ENGINE_RUNTIME_' + name + '_PROVIDER_REQUIRED'); e.code = e.message; throw e; };
  const trap = {};
  for (const k of ['filter', 'map', 'forEach', 'slice', 'find', 'some', 'every', 'reduce', 'flatMap', 'concat', 'entries', 'values', 'keys', 'at', 'includes']) trap[k] = fail;
  Object.defineProperty(trap, Symbol.iterator, { value: fail });
  Object.defineProperty(trap, 'length', { get: fail });
  return Object.freeze(trap);
};
// FC12's engineAt, restated: a fixed clock, no id minting, no drafts, the two history providers absent.
function composeEngine(nativeText, day) {
  const load = engineLoader(nativeText);
  const mint = () => { const e = new Error('ENGINE_RUNTIME_IDS_UNAVAILABLE'); e.code = e.message; throw e; };
  const clock = { today: () => day, nowISO: () => day + 'T12:00:00.000Z', nowMs: () => Date.parse(day + 'T12:00:00.000Z'), hour: () => 12, dow: () => new Date(day + 'T00:00:00Z').getUTCDay() };
  const deps = { clock, ids: Object.freeze({ next: mint, fresh: mint }), drafts: Object.freeze({ length: 0, key: () => null }) };
  const E = { HISTORY: engineRefusing('HISTORY'), ROLLUPS: engineRefusing('ROLLUPS'), exById: (s, id) => s.exercises.find((e) => e.id === id) };
  for (const name of ENGINE_PUBLIC) {
    const factory = load('rebuild/engine/' + name + '.cjs');
    Object.assign(E, name === 'performed' ? factory(E, { nativeTrendContext: (r) => ({ ...r, hard: false, rushed: false, debt: false }) }) : factory(E, deps));
  }
  Object.assign(E, load(NATIVE_LOAD)(E, deps));
  return E;
}

// The fixture (FC12's F0/C/withFacts/basisFor shapes, restated; every value invented).
const FX = require(path.join(ROOT, 'rebuild/m3/w7-preview/fixtures.cjs'));
const FX_LIFT = 'fx-press', FX_D0 = '2026-10-01', FX_CARD_DAY = '2026-10-12', FX_TOP = [10, 9, 8];
const fxLb = (value) => ({ value, unit: 'lb' });
const FX_AT_LEAST_3 = Object.freeze({ tag: 'at_least', value: 3, unit: 'rep' });
const fxE = (...xs) => xs.map((x) => (typeof x === 'number' ? { tag: 'exact', value: x, unit: 'rep' } : structuredClone(x)));
const fxRef = (id) => ({ op_id: id, commitment: 'sha256:' + createHash('sha256').update('fx-commitment|' + id).digest('hex') });
const fxDay = (i) => FX.dayOffset(FX_D0, i);
function fxState(patch = {}) {
  const s = FX.createSyntheticState(FX_CARD_DAY);
  s.sessionLog = {};
  const ex = { id: FX_LIFT, n: 'Fx Press', mg: 'chest', day: 'U', w: 100, inc: 5, sets: 3, hi: 10, holdFlag: false, topAt: null, topRun: 0, setup: 'SYNTHETIC', note: 'SYNTHETIC', forks: [] };
  for (const [k, v] of Object.entries(patch)) { if (v === undefined) delete ex[k]; else ex[k] = structuredClone(v); }
  s.exercises.push(ex);
  return s;
}
function fxC(n, { date = fxDay(n - 1), reps, loads = 100, effort, prescribed = 100 }) {
  const start = 'fx-start-' + n, close = 'fx-close-' + n, ops = [start];
  const L = Array.isArray(loads) ? loads : reps.map(() => loads), P = Array.isArray(prescribed) ? prescribed : reps.map(() => prescribed);
  const slots = reps.map((r, k) => {
    const position = k + 1, logical_set_slot = JSON.stringify([FX_LIFT, position]), id = 'fx-set-' + n + '-' + position;
    ops.push(id);
    const current = { load: fxLb(L[k]), reps: { value: r, unit: 'rep' }, reserve: structuredClone(effort[k]) };
    return { position, logical_set_slot, prescribed_load: P[k] == null ? { state: 'not_prescribed' } : { state: 'specified', source: fxLb(P[k]) }, state: 'performed',
      fact: { source_op_id: id, source_status: 'stored-on-this-device', included: true, current, current_status: 'stored-on-this-device', edit_op_ids: [], issues: [],
        original: structuredClone(current), logical_set_slot, lift_lineage_id: FX_LIFT } };
  });
  ops.push(close);
  return { start, close, date, ops, session: { start_op_id: start, effective: { local_date: date, local_time: '10:00', utc_offset: '+00:00' },
    record: { entries: [{ profile: 'earned/performed-lift/v2', start_op_id: start, lift_lineage_id: FX_LIFT, completion: { op_id: close, kind: 'normal', status: 'stored-on-this-device' }, slots }] } } };
}
function fxFacts(state, comps) {
  const s = structuredClone(state);
  s.workoutFacts = { profile: 'earned/workout-facts/v1', source_revision: 1,
    order: { profile: 'earned/workout-order/v1', frontier: comps.reduce((a, c) => a + c.ops.length, 0), start_ids: comps.map((c) => c.start) },
    sessions: comps.map((c) => structuredClone(c.session)) };
  return s;
}
function fxRequest(state, comps, c, { frontier = [], authority = [], intent = 'check' } = {}) {
  const ex = state.exercises.find((x) => x.id === FX_LIFT), opt = (k) => (Object.hasOwn(ex, k) ? { present: true, value: structuredClone(ex[k]) } : { present: false, value: null });
  const ops = [...new Set([...comps.flatMap((x) => x.ops), ...authority, ...frontier.flatMap((f) => f.response_refs.map((r) => r.op_id))])].sort();
  return { lift_lineage_id: FX_LIFT, completion_op_id: c.close, intent, basis: { athlete_id: 'ath-fx', source: { W: 0, log_digest: 'fx-empty-prefix', selection_id: null },
    coverage: ops.map((op_id) => ({ op_id, commitment: fxRef(op_id).commitment, disposition: 'stored-on-this-device', source_member: null })),
    order: { start_ids: comps.map((x) => x.start), frontier: state.workoutFacts.order.frontier },
    plan: { plan_basis: 'fx-plan', input_basis: 'fx-input', programme_sha256: 'fx-programme', capture_sha256: 'fx-capture', structural_queue_sha256: 'fx-queue' },
    technique: { forks: structuredClone(ex.forks || []), fork_refs: [] },
    load_basis: { authority_refs: authority.map(fxRef), tenure_start: null, sets: ex.sets, prefix: ex.sets, hi: ex.hi, steps: opt('steps'), inc: opt('inc'), w: opt('w'), wSets: opt('wSets') },
    effect_frontier: structuredClone(frontier) } };
}
// A yes through the public transition (FC12 applyAccept's context), then the Undo check of that yes.
function fxUndo(E, state, comps, ev) {
  const offer = ev.offers[0], body = offer.body;
  const t = E.applyNativeLoadDecision(state, body, { event: 'accept', basis: ev.basis, spent: [], completion: null,
    authority: { response_refs: [fxRef('fx-resp-1')], issuance: { producer: 'earned/native-load/v1', body, reason: offer.reason, revision: 'fx-revision-1', source: ev.basis.source, moment: '2026-10-20T12:00:00.000Z' }, source_cut: ev.basis.source } });
  if (t.status !== 'applied') return { status: 'refused', offers: [], refusal: t.refusal };
  const frontier = [{ spend_id: body.spend_id, response_refs: [fxRef('fx-resp-1')], close_ref: null }];
  return E.evaluateNativeLoad(t.state, fxRequest(t.state, comps, comps.at(-1), { frontier, intent: { compensate: body.spend_id } }));
}

/* The required cases, brief rev7 2.3 F (F6, the unit, is inside every F5 form). Each `want` is the approved template
   filled in BY HAND with this case's invented values (lift name 'Fx Press', dates, loads, reserve words); a case is
   one check and `want` lists every returned offer's reason, in order. F3a's state carries the fold's MISSED mark
   (native-load.cjs :236-241: done, state 'MISSED', native_load_missed_by the Close) written directly, and its
   request claims that Close in load_basis.authority_refs, exactly as FC12 N29 reaches it through FC03. */
const FX_NOTHING = ' Nothing changes unless you say yes; it then applies on a later Fx Press workout.';
const FX_ADOPT_TAIL = '. Offer: make that your working weight. This sets your working weight; it is not an earned increase. Nothing changes unless you say yes.';
const FX_UNDO = (loads) => 'Fx Press: undo the choice you agreed to before any workout used it. Your working weight goes back to ' + loads + '. The workouts it came from stay recorded and are not counted again.';
const FX_N11 = { w: 100, wSets: [100, 95], sets: 2, hi: 10, steps: [100, 105, 110, 115] };
const FX_SPEND_MISSED = JSON.stringify(['native-load', FX_LIFT, null, null, ['fx-root-missed']]);
function fxCase(patch, comps, opts = {}) { return { state: fxFacts(fxState(patch), comps), comps, opts }; }
const ENGINE_OUTPUT_CASES = Object.freeze([
  { id: 'F1+F2 one-step (earn.cjs:88), F5 every set', build: () => fxCase({}, [fxC(1, { reps: FX_TOP, effort: fxE(2, 1, 1) }), fxC(2, { reps: FX_TOP, effort: fxE(2, 1, 1) })]),
    want: ['Fx Press: you topped the rep window at 100 lb on every set (workouts on 2026-10-01, 2026-10-02). Offer: 105 lb on every set, a one-step increase after topping the rep window.' + FX_NOTHING] },
  { id: 'F1+F2 early (earn.cjs:97)', build: () => fxCase({}, [fxC(1, { reps: FX_TOP, effort: fxE(2, 2, 2) })]),
    want: ['Fx Press: you topped the rep window at 100 lb on every set (workouts on 2026-10-01). Offer: 105 lb on every set, an early increase from one top of the window, with 2 reps left on your last set.' + FX_NOTHING] },
  { id: 'F1+F2 early after a hard opener (earn.cjs:63)', build: () => fxCase({}, [fxC(1, { reps: FX_TOP, effort: fxE(0, 1, 1) }), fxC(2, { reps: FX_TOP, effort: fxE(0, 1, 2) })]),
    want: ['Fx Press: you topped the rep window at 100 lb on every set (workouts on 2026-10-01, 2026-10-02). Offer: 105 lb on every set, an early increase from one top of the window: your opening set was hard, your last set had 2 reps left.' + FX_NOTHING] },
  { id: 'F1+F2 two-step (earn.cjs:80) then one-step, F5 per-set list', build: () => fxCase(FX_N11, [1, 2].map((n) => fxC(n, { reps: [10, 9], loads: [100, 95], prescribed: [100, 95], effort: fxE(2, FX_AT_LEAST_3) }))),
    want: ['Fx Press: you topped the rep window at 100 lb, 95 lb (workouts on 2026-10-01, 2026-10-02). Offer: 110 lb, 105 lb, a two-step increase, because your last set had at least 3 reps left.' + FX_NOTHING,
      'Fx Press: you topped the rep window at 100 lb, 95 lb (workouts on 2026-10-01, 2026-10-02). Offer: 105 lb, 100 lb, a one-step increase after topping the rep window.' + FX_NOTHING] },
  { id: 'F3b adopt, the card said', build: () => fxCase({}, [fxC(1, { reps: FX_TOP, loads: 105, effort: fxE(2, 1, 1) })]),
    want: ['Fx Press: on 2026-10-01 you completed every set at 105 lb on every set (the card said 100 lb on every set)' + FX_ADOPT_TAIL] },
  { id: 'F3c adopt, no working weight on file', build: () => fxCase({ w: null }, [fxC(1, { reps: FX_TOP, loads: 60, prescribed: null, effort: fxE(2, 1, 1) })]),
    want: ['Fx Press: on 2026-10-01 you completed every set at 60 lb on every set, and no working weight was on file' + FX_ADOPT_TAIL] },
  { id: 'F3a adopt on a missed debut Close (DECISIONS:804)', build: () => {
    const c = fxC(1, { date: '2026-10-12', reps: [8, 7, 6], loads: 95, prescribed: 105, effort: fxE(2, 1, 1) }), x = fxCase({}, [c], { authority: [c.close] });
    x.state.queue.push({ id: FX_SPEND_MISSED, kind: 'debut', exId: FX_LIFT, newW: 105, state: 'MISSED', done: true, t: 'fixture', gate: 'fixture', rule: 'fixture', native_load_spend: FX_SPEND_MISSED, native_load_missed_by: c.close });
    return x; },
    want: ['Fx Press: on 2026-10-12 you completed every set at 95 lb on every set (the card said 105 lb on every set, your first workout at the new weight you agreed; your working weight stayed 100 lb on every set)' + FX_ADOPT_TAIL] },
  { id: 'F4 undo of an adoption', build: () => fxCase({}, [fxC(1, { reps: FX_TOP, loads: 105, effort: fxE(2, 1, 1) })], { undo: true }), want: [FX_UNDO('100 lb on every set')] },
  { id: 'F4 undo of a first adoption, F5 no load', build: () => fxCase({ w: null }, [fxC(1, { reps: FX_TOP, loads: 60, prescribed: null, effort: fxE(2, 1, 1) })], { undo: true }), want: [FX_UNDO('no load on every set')] },
  { id: 'F4 undo of a queued earn', build: () => fxCase({}, [fxC(1, { reps: FX_TOP, effort: fxE(2, 1, 1) }), fxC(2, { reps: FX_TOP, effort: fxE(2, 1, 1) })], { undo: true }), want: [FX_UNDO('100 lb on every set')] },
]);
const FX_BUILT = ENGINE_OUTPUT_CASES.map((c) => ({ ...c, ...c.build() }));
// What FC01 returns for one case: every offer's reason in order, or the refusal code.
function engineOutput(E, x) {
  const said = (ev) => (ev.status === 'offer' ? ev.offers.map((o) => o.reason) : ['REFUSED ' + (ev.refusal && ev.refusal.code)]);
  const c = x.comps.at(-1), first = E.evaluateNativeLoad(structuredClone(x.state), fxRequest(x.state, x.comps, c, { authority: x.opts.authority || [] }));
  if (!x.opts.undo) return said(first);
  if (first.status !== 'offer') return ['NO OFFER TO UNDO ' + said(first)[0]];
  return said(fxUndo(E, structuredClone(x.state), x.comps, first));
}
function engineOutputRefusals(nativeText) {
  const out = [];
  for (const x of FX_BUILT) {
    let got;
    try { got = engineOutput(composeEngine(nativeText, x.comps.at(-1).date), x); } catch (error) { got = ['THREW ' + String(error && error.message)]; }
    if (JSON.stringify(got) !== JSON.stringify(x.want)) out.push('ENGINE-OUTPUT CHANGED ' + x.id + ': ' + JSON.stringify(got));
  }
  return out;
}

test('CL-ENGINE-OUTPUT: every approved native-load explanation FC01 returns is the approved text, word for word', () => {
  assert.deepEqual(engineOutputRefusals(fs.readFileSync(path.join(ROOT, NATIVE_LOAD), 'utf8')), [], 'CL-ENGINE-OUTPUT');
  // exactly the fourteen allowed engine files were compiled: the twelve, entered-load.cjs and native-load.cjs
  assert.deepEqual([...ENGINE_LOADED].sort(), [...ENGINE_ALLOWED].sort(), 'CL-ENGINE-OUTPUT-LOADED-EXACTLY-ALLOWED');
  assert.throws(() => engineLoader('')('rebuild/engine/index.cjs'), /CL-ENGINE-OUTPUT-PROTECTED-REFUSED/, 'CL-ENGINE-OUTPUT-GUARD');
});

// Every single-quoted literal inside the approved template blocks, each changed by one character in place (the first
// letter's case flipped, else its first character swapped), one mutant per literal occurrence.
function literalMutants(original) {
  const out = [];
  const swap = { ',': ';', ')': ']', '.': '!', ' ': '_' };
  for (const t of ENGINE_TEMPLATES) {
    assert.equal(original.split(t.source).length - 1, 1, 'CL-ENGINE-OUTPUT-TEETH-BLOCK ' + t.id);
    for (const m of t.source.matchAll(/'(?:[^'\\\n]|\\.)*'/g)) {
      const body = m[0].slice(1, -1), k = body.search(/[A-Za-z]/);
      const next = k >= 0 ? body.slice(0, k) + (body[k] === body[k].toUpperCase() ? body[k].toLowerCase() : body[k].toUpperCase()) + body.slice(k + 1)
        : (swap[body[0]] || '#') + body.slice(1);
      assert.notEqual(next, body, 'CL-ENGINE-OUTPUT-TEETH-NOOP ' + t.id + ' ' + m[0]);
      const block = t.source.slice(0, m.index) + "'" + next + "'" + t.source.slice(m.index + m[0].length);
      out.push({ label: t.id + ' @' + m.index + ' ' + m[0] + ' -> ' + JSON.stringify(next), text: original.split(t.source).join(block) });
    }
  }
  return out;
}
// Astra L1 B1's counterexample (astra-s11-l1-146 copy-probe.cjs), rebuilt byte for byte: the live NL-LOADS literal
// ' on every set' -> ' on Every set', and the original NL-LOADS block appended inside a comment.
const commentDecoy = (original) => original.replace(' on every set', ' on Every set')
  + '\n/* approved template retained for documentation\n' + ENGINE_TEMPLATES.find((t) => t.id === 'NL-LOADS').source + '\n*/\n';

test('CL-ENGINE-OUTPUT-TEETH: the comment decoy and a one-character change in each template literal are refused; a CRLF checkout is not', () => {
  const original = fs.readFileSync(path.join(ROOT, NATIVE_LOAD), 'utf8').replace(/\r\n?/g, '\n');
  const failed = [];
  // Astra L1 B1: CL-ENGINE-COPY's source count alone passes this decoy; the returned explanation refuses it.
  assert.equal(original.split(' on every set').length - 1, 1, 'CL-ENGINE-OUTPUT-TEETH-DECOY-ANCHOR');
  if (!engineOutputRefusals(commentDecoy(original)).length) failed.push('CL-ENGINE-OUTPUT-TEETH comment decoy (Astra L1 B1) passed');
  const mutants = literalMutants(original);
  // 30 literals at 9288adf: NL-LOADS 5, NL-EARN 14, NL-ADOPT 9, NL-UNDO 2
  assert.equal(mutants.length, 30, 'CL-ENGINE-OUTPUT-TEETH-LITERAL-COUNT');
  for (const m of mutants) if (!engineOutputRefusals(m.text).length) failed.push('CL-ENGINE-OUTPUT-TEETH ' + m.label + ' passed');
  const crlf = engineOutputRefusals(original.replace(/\r?\n/g, '\r\n'));
  if (crlf.length) failed.push('CL-ENGINE-OUTPUT-TEETH CRLF checkout refused ' + JSON.stringify(crlf));
  assert.deepEqual(failed, [], 'CL-ENGINE-OUTPUT-TEETH');
});
