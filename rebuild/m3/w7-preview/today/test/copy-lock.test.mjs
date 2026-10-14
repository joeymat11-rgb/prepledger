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
// S12b R6 (DECISIONS:914, :915): re-measured after the screen and layout fixes (four pieces moved; see S12_DELTA_SHA256). R9: re-measured again.
// S14 (M2-S14-HOLD, E12): re-measured for exactly one new piece, the R4 panel line (CL-S14-DELTA; the S13 value is S13_CORPUS_SHA256).
// S15 (Change my routine, PM S15 round 2): re-measured for exactly the S15 pieces and three scanned files (CL-S15-DELTA;
// the S14 value is S14_CORPUS_SHA256). S18: re-measured for exactly one more piece in gym-model.mjs, the recorded reason
// on the removal of an opened, empty workout (CL-S15-DELTA 43 -> 44; was 019b9474...), and for "Why?"'s two new owners
// (CL-S18-REOWNED; 8f8d84db... with the piece alone). S19: re-measured for exactly two more pieces in today-entry.mjs, the
// adoption offer's heading that states its weight (CL-S15-DELTA 44 -> 46; was 9bee3abe...). Coach v1 (S19 amend): re-measured
// for exactly the Coach v1 pieces and counts (CL-COACH-V1-DELTA; the value before is S19_CORPUS_SHA256). Coach v1 piece 2
// (the weekly review): re-measured for exactly one more piece, the Coach question "How did my week go?" (was e61da75a...).
// Coach v1 polish: re-measured for exactly the polish delta, "Ask Coach" in, the Talk row words out and one count
// (CL-COACH-POLISH-DELTA; the value before is PIECE2_CORPUS_SHA256, 60411337...).
// Coach v1 seat read: re-measured for exactly one more piece, the Coach question "Where's my seat set?" (CL-COACH-SEAT-DELTA;
// the value before is PRE_SEAT_CORPUS_SHA256, 218da3dc...).
// Polish 4 (the weekly review opens collapsed): re-measured for exactly three more pieces, the card's controls "See details",
// "Hide details" and "Show fewer" (CL-WEEK-POLISH4-DELTA; the value before is PRE_POLISH4_CORPUS_SHA256, 5bdf2c2e...).
// Polish 5 (the owner's 7-lift world): re-measured for exactly the polish 5 pieces, owners and mounted states
// (CL-POLISH5-DELTA; the value before is PRE_POLISH5_CORPUS_SHA256, 0f7f06de...), including Fable's D1 pieces.
// Polish 6 (ui-pass12): re-measured for exactly one more piece, the board's T-03 status line (CL-POLISH6-DELTA; the value
// before is PRE_POLISH6_CORPUS_SHA256, e63812ae...).
// Nutri 1 (the owner's labelled estimate): re-measured for exactly the estimate band and its gate line (CL-NUTRI1-DELTA;
// the value before is PRE_NUTRI1_CORPUS_SHA256, a4374f49...).
// UI-pass13 fix-forward: re-measured for exactly the nutrition screen's carbohydrate and fat wording, one sentence in
// and three out (CL-UP13-DELTA; the value before is PRE_UP13_CORPUS_SHA256, e8193158...).
// N2 "Log today", Part A: re-measured for exactly the steps lane's three files and pieces and the blackout words
// (CL-NUTRI2A-DELTA; the value before is PRE_NUTRI2A_CORPUS_SHA256, f95b7915...).
// N2 "Log today", Part B: re-measured for exactly the Log today card and sheet's words, the import screen's day words and
// three owner counts (CL-NUTRI2B-DELTA; the value before is PRE_NUTRI2B_CORPUS_SHA256, 25eefea4...).
// E1 (Fable fd80cb84 D1; DECISIONS:989): re-measured for exactly the withdrawn estimate words, three pieces out and two
// owner counts down (CL-E1-DELTA; the value before is PRE_E1_CORPUS_SHA256, 2b9c2568...).
// Polish 7 (PM, ui-pass14): re-measured for exactly the sheet's "Close" and the steps row's "Change" (CL-P7-DELTA; the
// value before is PRE_P7_CORPUS_SHA256, 975061da...).
// Polish 8 (PM, ui-pass15): re-measured for exactly Why this plan?'s gated sentence and one " lb" count (CL-P8-DELTA; the
// value before is PRE_P8_CORPUS_SHA256, ae2b1609...).
// E2a (PM, the E2 scope): re-measured for exactly Measure's About you words and the import route's two refusal
// sentences (CL-E2A-DELTA; the value before is PRE_E2A_CORPUS_SHA256, 1f393735...).
// E2b (the owner's ruling, DECISIONS:999): re-measured for exactly the import route's different-version sentence
// (CL-E2B-DELTA; the value before is PRE_E2B_CORPUS_SHA256, fe891976...).
// P9 (PM, the Today repeats; DECISIONS:1003): re-measured for exactly More and Start workout in, the Recovery row's
// invitation and Start's old head out, and one Resume owner (CL-P9-DELTA; the value before is PRE_P9_CORPUS_SHA256,
// f31847eb...).
const CORPUS_SHA256 = '8b6210cb319784f6e039949c5f4478e696e62893be41a66cfe2b299cf0295e1a';
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
/* S12b R6: the delta re-derived against the same sealed S11 corpus (S11_CORPUS_SHA256 unchanged). Four pieces moved:
   "Back to Today" (template 4 -> 5, the recorded workout's primary), "Log this morning's weight" (today-app.cjs no
   longer carries it: Start is never the weigh-in; the sheet's aria-label keeps it), "Your plan, progress and the
   reasons behind it." REMOVED and "Talk through today's plan" no longer added (the Talk row left Today,
   DECISIONS:915 (3)). No new words. S12b R9 (PM ruling): "Log this morning's weight" is today-app.cjs's again, as at the
   parent (the rest-day weigh-in primary), so it no longer moves; three pieces move. */
const S12_DELTA_SHA256 = 'df3dbc367cee51124335cb723e519f4939250939a53ee5d24337a9846b82deff';
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
  // S14: judged on the released S13 corpus, which s13View rebuilds byte for byte from this corpus (CL-S14-DELTA)
  const corpus = s13View(s14View(loaded().corpus));
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
  // S14: from the S13 corpus that s13View rebuilds first (CL-S14-DELTA)
  const corpus = s11View(s13View(s14View(loaded().corpus)));
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

/* ---------------- S14 (M2-S14-HOLD, the hold/bodyweight slice; brief S13-HOLD-BW-BRIEF.md E12) ----------------
   The S14 copy delta over the released S13 corpus (M2-S13-POLISH, 7347ba6; its corpus sha256 is the S13 value of
   CORPUS_SHA256 before this reseal): exactly ONE new piece, section 10 string 2, the R4 panel line, owned once by
   today-entry.mjs and in no design.cjs list (the lift name before it is the athlete's data). No piece removed or changed, no
   mounted state and no scanned file moved. CL-S14-DELTA proves it both ways: the piece is in the corpus as listed, and the
   corpus with it taken out serializes to the S13 corpus bytes, so CL-S12-DELTA and CL-S11-DELTA keep judging what they
   judged. The words are approved by the PM under the owner's standing Yes, DECISIONS:913 (5), the brief's ruling 12.11. */
const S13_CORPUS_SHA256 = '72f5d0da549949c0de3e6d55566cb03c86c4dd6dc77993c4ee3753eb7e29041b';
const S14_OWNER = T + '/today-entry.mjs';
const S14_NEW = Object.freeze([
  ['bodyweight sets have no weight to agree to. Your sets are saved.', 'DECISIONS:913 (5) (brief 12.11, section 10 string 2, the R4 panel line)'],
]);
const S14_COPY_APPROVAL = 'DECISIONS:913';
// The S13 view: this corpus minus the S14 piece.
function s13View(corpus) {
  const added = new Set(S14_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)) };
}

test('CL-S14-DELTA: the S14 corpus is the released S13 corpus plus exactly the approved S14 piece, both directions', () => {
  // S15: judged on the S14 corpus, which s14View rebuilds byte for byte from this corpus (CL-S15-DELTA)
  const corpus = s14View(loaded().corpus);
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, approval] of S14_NEW) {
    const want = { text, files: { [S14_OWNER]: 1 }, lists: [] };
    const got = byText.get(text) || null;
    if (JSON.stringify(got) !== JSON.stringify(want)) failed.push('CL-S14-DELTA NEW ' + approval + ' ' + JSON.stringify(text) + ' is ' + JSON.stringify(got));
  }
  const s13 = lock.sha256(Buffer.from(serialize(s13View(corpus)), 'utf8'));
  if (s13 !== S13_CORPUS_SHA256) failed.push('CL-S14-DELTA S13-VIEW ' + s13);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the S13 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-S14-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(s13View(moved)), 'utf8')) === S13_CORPUS_SHA256) failed.push('CL-S14-DELTA S13-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-S14-DELTA');
});

test('CL-S14-APPROVAL: the S14 copy delta names the ledger line that approves it', () => {
  assert.match(S14_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-S14-APPROVAL-PENDING: the S14 copy is not approved');
});

/* ---------------- S15 (Change my routine; PM S15 round 2) ----------------
   The S15 copy delta over the S14 corpus (CORPUS_SHA256 before this re-measure, S14_CORPUS_SHA256 below): exactly the
   thirty-three new pieces of the routine editor, each with its one owner (routine-model.mjs COPY; the Today link's two
   words also in today-app.cjs; the editor's internal no-host error in routine-app.mjs), plus the one Import-screen
   sentence F10 adds (import-screen.mjs COPY.routineSuperseded, PM ruling option B), plus the four round 5 polish
   pieces in gym-model.mjs (two plain entry refusals, the singular clean rep), in no design.cjs list, and
   the three new scanned files. No sealed piece removed or changed, no owner, count, list or mounted state moved.
   CL-S15-DELTA proves it both ways: every piece is in the corpus exactly as listed, and the corpus with the delta taken
   out serializes to the S14 corpus bytes, so CL-S14-DELTA, CL-S12-DELTA and CL-S11-DELTA keep judging what they judged.
   Approved by the PM under the owner's standing Yes, DECISIONS:913 (5) (PM S15 round 2: "all new strings APPROVED"). */
const S14_CORPUS_SHA256 = '3a226341aac5832d490ffa652e6cf969c5f55b1820024695c94e5713880e9a98';
const S15_MODEL = T + '/routine-model.mjs';
const S15_NEW = Object.freeze([
  ['A new exercise starts at SETS sets with no weight. Your first workout sets it.', { [S15_MODEL]: 1 }],
  ['Add it', { [S15_MODEL]: 1 }],
  ['Change', { [S15_MODEL]: 1 }],
  ['Change my days', { [S15_MODEL]: 1 }],
  ['Changes start on DATE. Today\u2019s workout stays as it is.', { [S15_MODEL]: 1 }],
  ['Each workout that has exercises needs at least one day.', { [S15_MODEL]: 1 }],
  ['Each workout with days needs at least one exercise.', { [S15_MODEL]: 1 }],
  ['Give it a name.', { [S15_MODEL]: 1 }],
  ['Keep it', { [S15_MODEL]: 1 }],
  ['Move down', { [S15_MODEL]: 1 }],
  ['Move up', { [S15_MODEL]: 1 }],
  ['New exercise', { [S15_MODEL]: 1 }],
  ['Nothing has changed yet.', { [S15_MODEL]: 1 }],
  ['Opening your routine.', { [S15_MODEL]: 1 }],
  ['Remove NAME from your routine? Its history stays.', { [S15_MODEL]: 1 }],
  ['Remove it', { [S15_MODEL]: 1 }],
  ['Replace NAME', { [S15_MODEL]: 1 }],
  ['Replace it', { [S15_MODEL]: 1 }],
  ['Save changes', { [S15_MODEL]: 1 }],
  ['Save my days', { [S15_MODEL]: 1 }],
  ['Save this order', { [S15_MODEL]: 1 }],
  ['Saved. It starts on DATE.', { [S15_MODEL]: 1 }],
  ['Sets', { [S15_MODEL]: 1 }],
  ['That change was not saved. Nothing was changed. (CODE)', { [S15_MODEL]: 1 }],
  ['Which workout?', { [S15_MODEL]: 1 }],
  ['Yes, remove it', { [S15_MODEL]: 1 }],
  ['Your routine cannot be changed on this device right now. Nothing was changed. (CODE)', { [S15_MODEL]: 1 }],
  ['Your routine changed while this was open. Look it over and save again.', { [S15_MODEL]: 1 }],
  ['Your routine needs at least one exercise.', { [S15_MODEL]: 1 }],
  ['Your week', { [S15_MODEL]: 1 }],
  // Fable l1 N2 (PM-approved, S15 round 3): the turned-day line.
  ['The day has changed. Look it over and save again.', { [S15_MODEL]: 1 }],
  ['Change my routine', { [S15_MODEL]: 1, [T + '/today-app.cjs']: 1 }],
  ['Change my routine: no host element', { [T + '/routine-app.mjs']: 1 }],
  // S15 F10 (PM ruling option B, approved under DECISIONS:913 (5)): an import replaces the routine.
  ['Your imported history brings its own routine. Changes you made to your routine before this import are kept on record but no longer used.',
    { 'rebuild/m3/w7-preview/import/import-screen.mjs': 1 }],
  // S15 round 5 polish (PM UI pass; short plain strings PM-approved under DECISIONS:913 (5)): the set card's two
  // plain entry refusals and the singular clean rep, in gym-model.mjs.
  ['That weight cannot be saved. Enter it as a number above zero, like 25.', { [T + '/gym-model.mjs']: 1 }],
  ['Enter the reps as a whole number, like 10.', { [T + '/gym-model.mjs']: 1 }],
  [' clean rep left', { [T + '/gym-model.mjs']: 1 }],
  [' clean rep left.', { [T + '/gym-model.mjs']: 1 }],
  // S17 (PM ruling, the owner's same-day routine change; short plain strings PM-approved): the editor's today or
  // tomorrow choice, the today date line and the two one-line reasons a change cannot start today.
  ['Start today', { [S15_MODEL]: 1 }],
  ['Start tomorrow', { [S15_MODEL]: 1 }],
  ['Changes start today, DATE.', { [S15_MODEL]: 1 }],
  ['Today\u2019s workout has started, so this starts tomorrow.', { [S15_MODEL]: 1 }],
  ['A change already starts tomorrow, so this starts tomorrow too.', { [S15_MODEL]: 1 }],
  // S18 (PM ruling): the reason recorded on the removal of an opened, empty workout when a change starts today.
  ['Opened on this device with nothing recorded, and removed when the routine changed for today.', { [T + '/gym-model.mjs']: 1 }],
  // S19 (UI check 6, PM-approved copy): an adoption offer's heading states the weight it sets, "Plank: make 25 lb your
  // working weight" (the lift name and the weight are data between the two pieces).
  [': make ', { [T + '/today-entry.mjs']: 1 }],
  [' your working weight', { [T + '/today-entry.mjs']: 1 }],
]);
const S15_SCANNED = Object.freeze([T + '/routine-app.mjs', T + '/routine-host.mjs', T + '/routine-model.mjs']);
const S15_COPY_APPROVAL = 'DECISIONS:913';
/* S18 (the owner's iPhone; the PM-approved word "Why?"): ONE existing piece gains two owners, the control that shows and
   hides a coach suggestion's reason on Today's proposal card (today-app.cjs) and on a next-weight offer (today-entry.mjs).
   No piece is removed and no other owner, count or list moves. beforeS18 gives every older view the piece as it stood, so
   CL-S15/S14/S12/S11-DELTA keep judging what they judged; CL-S18-REOWNED below pins both sides. */
const S18_REOWNED = Object.freeze([['Why?', Object.freeze({ [T + '/coach-app.mjs']: 2, [T + '/screens.template.html']: 1 }),
  Object.freeze({ [T + '/coach-app.mjs']: 2, [T + '/screens.template.html']: 1, [T + '/today-app.cjs']: 1, [T + '/today-entry.mjs']: 1 })]]);
function beforeS18(corpus) {
  return { ...corpus, entries: corpus.entries.map((e) => {
    const row = S18_REOWNED.find(([text]) => text === e.text);
    return row ? { ...e, files: sortedFiles(row[1]) } : e;
  }) };
}
/* Coach v1 (S19 amend, the owner's ruling "No-AI coach first"): the live coach's question chips and answer words in
   coach-app.mjs, bound to design.cjs's COACH_LIVE_APPROVED (with that binding's three refusal lines), the Coach entry
   back on Today in the board's own words (APPROVED_COPY), and four existing pieces whose counts or owners move. No piece
   is removed, no mounted state and no scanned file moves. beforeCoachV1 gives every older view the corpus as S19 sealed
   it (S19_CORPUS_SHA256), so CL-S18-REOWNED and CL-S15/S14/S12/S11-DELTA keep judging what they judged. */
const S19_CORPUS_SHA256 = 'fadf61407fcd1558ead0c49913a2c6a9b4eeedb805f3831423bf2d9ca5114a4c';
const CV1_APP = T + '/coach-app.mjs', CV1_DESIGN = T + '/design.cjs', CV1_SCREENS = T + '/screens.template.html';
const CV1_LIVE = { [CV1_APP]: 1, [CV1_DESIGN]: 1 };
const COACH_V1_NEW = Object.freeze([
  ['Why this weight?', CV1_LIVE, []],
  ['What did I do last time?', CV1_LIVE, []],
  ['How is my weight going?', CV1_LIVE, []],
  ['What did I say in my check in?', CV1_LIVE, []],
  // Coach v1 piece 2 (the weekly review): the sixth Coach question.
  ['How did my week go?', CV1_LIVE, []],
  ['Typed and spoken questions come later. Tap a question above.', CV1_LIVE, []],
  ['You asked: ', { [CV1_APP]: 1 }, []],
  ['From this device\u2019s encrypted local store.', { [CV1_APP]: 1 }, []],
  ['Talk through today\u2019s plan', { [CV1_DESIGN]: 1, [CV1_SCREENS]: 1 }, ['APPROVED_COPY']],
  ['COACH-LIVE-BINDING FAIL: "', { [CV1_DESIGN]: 1 }, []],
  ['COACH-LIVE-BINDING FAIL: the live coach words are not exactly the approved list', { [CV1_DESIGN]: 1 }, []],
  ['COACH-LIVE-BINDING FAIL: the live copy region of ', { [CV1_DESIGN]: 1 }, []],
]);
const COACH_V1_CHANGED = Object.freeze([
  ['What am I hitting today?', { [CV1_SCREENS]: 1 }, { [CV1_APP]: 1, [CV1_SCREENS]: 1 }],
  ['I cannot answer that from what the app holds.', { [CV1_APP]: 1 }, { [CV1_APP]: 2 }],
  [' could not be located', { [CV1_DESIGN]: 1 }, { [CV1_DESIGN]: 2 }],
  ['" carries a dash', { [CV1_DESIGN]: 1 }, { [CV1_DESIGN]: 2 }],
]);
const COACH_V1_COPY_APPROVAL = 'DECISIONS:964';
/* Coach v1 polish (the PM's polish batch on rebuild/c-weekly, ui-pass7 shot 02): the Coach entry on Today is a compact
   row in the feed, "Ask Coach" (preview-owned, design.cjs PREVIEW_COPY), and the board's Talk row words left Today with
   the old link (no longer declared in APPROVED_COPY; the Coach screen's own "Talk through today's plan." stays). Nothing
   else moves. beforePolish gives every older view the corpus as Coach v1 piece 2 sealed it (PIECE2_CORPUS_SHA256, the
   value CORPUS_SHA256 held before this re-measure), and beforeCoachV1 starts from that view. */
const PIECE2_CORPUS_SHA256 = '6041133783c9357c9ee64e24642e91584d77d54cede51f8d4b35a2a493832bf0';
const POLISH_NEW = Object.freeze([['Ask Coach', { [CV1_DESIGN]: 1, [CV1_SCREENS]: 1 }, ['PREVIEW_COPY']]]);
const POLISH_REMOVED = Object.freeze([['Talk through today\u2019s plan', { [CV1_DESIGN]: 1, [CV1_SCREENS]: 1 }, ['APPROVED_COPY']]]);
/* And one existing piece's count: the weekly review card is drawn in the proposal card's own classes (today-app.cjs
   paintWeekReview), so "tcard proposal" gains its second literal there. No word moves with it. */
const POLISH_CHANGED = Object.freeze([['tcard proposal', { [CV1_APP]: 1, [T + '/today-app.cjs']: 1 }, { [CV1_APP]: 1, [T + '/today-app.cjs']: 2 }]]);
/* The PM's polish brief names the words; short plain copy is PM-approved under DECISIONS:913 (5). */
const POLISH_COPY_APPROVAL = 'DECISIONS:913';
/* Coach v1 seat read (PM ruling option A): exactly one more piece, the seventh Coach question, owned by coach-app.mjs's
   live copy and design.cjs's COACH_LIVE_APPROVED. beforeSeat gives every older view the corpus as the polish sealed it
   (PRE_SEAT_CORPUS_SHA256), and beforePolish starts from that view. Short plain copy, PM-approved under :913 (5). */
const PRE_SEAT_CORPUS_SHA256 = '218da3dc82a04fca3d958679b7896093cc77a36497e15bdc4b2b5980223bedde';
const SEAT_NEW = Object.freeze([["Where's my seat set?", CV1_LIVE, []]]);
const SEAT_COPY_APPROVAL = 'DECISIONS:913';
/* N2 "Log today", Part A: the steps lane's three scanned files (steps-commands.cjs, steps-model.cjs, steps-host.mjs),
   the host's own refusal of a missing day (a TypeError, the food and sleep hosts' shape), the two existing pieces the
   new files also carry ("use strict" twice, "forDate requires a date" once), and the food card's blackout words for
   Fable's N1 debt D1 (today-app.cjs CALORIE_GATE again and notBefore; its "." is not a locked piece). beforeNutri2a
   gives every older view the corpus as the ui-pass13 fix-forward sealed it (PRE_NUTRI2A_CORPUS_SHA256), and beforeUp13
   starts from that view. Approved under DECISIONS:980 (PM ruling on N2 Part A: the blackout lines belong to the owner's estimate
   ruling); the host's refusal is a developer TypeError of the food and sleep hosts' shape, never drawn on a screen. */
const PRE_NUTRI2A_CORPUS_SHA256 = 'f95b7915202a30b5c851a97c2b4ce37e467c665c978a186f2bd66a23bea521ed';
const N2A_SCANNED = Object.freeze([T + '/steps-commands.cjs', T + '/steps-host.mjs', T + '/steps-model.cjs']);
const N2A_NEW = Object.freeze([
  ['Your range is measured again on ', { [T + '/today-app.cjs']: 1 }, []], [' Not before ', { [T + '/today-app.cjs']: 1 }, []],
  ['createStepsHost requires day', { [T + '/steps-host.mjs']: 1 }, []],
]);
const N2A_OWNERS_ADDED = Object.freeze([
  ['use strict', { [T + '/steps-commands.cjs']: 1, [T + '/steps-model.cjs']: 1 }],
  ['forDate requires a date', { [T + '/steps-host.mjs']: 1 }],
]);
const NUTRI2A_COPY_APPROVAL = 'DECISIONS:980';
/* N2 "Log today", Part B: the Log today card and its one sheet (today-app.cjs), and the import screen's day words for
   a step-count collision (Fable's Part A debt D1; import-screen.mjs COPY.stepsDayHead and stepsDayTail). Eighteen new
   pieces in today-app.cjs (fifteen also declared in design.cjs PREVIEW_RUNTIME_COPY; "Log today", "Weight" and
   " steps" are words the approved references already carry, so design.cjs's binding needs no declaration for them),
   two in import-screen.mjs, and three owner counts in today-app.cjs: the sheet's weight field says the board's
   "Your weight in pounds" and "Your weight" once each, and its Escape key is a third "Escape". No scanned file and no
   mounted state moves. beforeNutri2b gives every older view the corpus as N2 part A sealed it
   (PRE_NUTRI2B_CORPUS_SHA256), and beforeNutri2a starts from that view. Approved under DECISIONS:980 (2) (PM ruling on Part B). */
const PRE_NUTRI2B_CORPUS_SHA256 = '25eefea475523b81cd96e83638f697d57952027655bde78c9fc354adba2841ab';
const N2B_APP = { [T + '/today-app.cjs']: 1 };
const N2B_APP_DECLARED = { [T + '/design.cjs']: 1, [T + '/today-app.cjs']: 1 };
const N2B_IMPORT = { ['rebuild/m3/w7-preview/import/import-screen.mjs']: 1 };
const N2B_NEW = Object.freeze([
  ['Log today', N2B_APP, []], ['Weight', N2B_APP, []], [' steps', N2B_APP, []],
  ['Food', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']], ['Steps', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Check in', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']], ['Done', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Enter food', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']], ['Enter sleep', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Nothing logged yet.', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']], ['Steps today', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Save steps', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Steps cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep them.',
    N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['These steps could not be recorded on this device, and nothing was recorded.', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Earned could not tell whether these steps were recorded on this device. They may have been kept and they may not.',
    N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ["Recorded on this device. Earned could not read today's record back just now.", N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ["Enter today's steps. Nothing was recorded.", N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['Steps are recorded as a whole number between 0 and 100000. Nothing was recorded.', N2B_APP_DECLARED, ['PREVIEW_RUNTIME_COPY']],
  ['This phone and this file both have a step count for ', N2B_IMPORT, []],
  ['. Nothing on this phone was changed.', N2B_IMPORT, []],
]);
/* [text, owner, count before, count now] */
const N2B_OWNERS_MOVED = Object.freeze([
  ['Escape', T + '/today-app.cjs', 2, 3],
  ['Your weight', T + '/today-app.cjs', 0, 1],
  ['Your weight in pounds', T + '/today-app.cjs', 0, 1],
]);
const NUTRI2B_COPY_APPROVAL = 'DECISIONS:980';
function beforeNutri2b(corpus) {
  corpus = beforeE1(corpus);   /* E1 stands on top of N2 part B */
  const added = new Set(N2B_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const rows = N2B_OWNERS_MOVED.filter(([text]) => text === e.text);
    if (rows.length === 0) return e;
    const files = { ...e.files };
    for (const [, owner, before] of rows) { if (before === 0) delete files[owner]; else files[owner] = before; }
    return { ...e, files: sortedFiles(files) };
  }) };
}
test('CL-NUTRI2B-DELTA: the corpus is the N2 part A corpus plus exactly the Log today words and the import day words, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of N2B_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-NUTRI2B-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, owner, , now] of N2B_OWNERS_MOVED) {
    const entry = byText.get(text);
    if (!entry || entry.files[owner] !== now) failed.push('CL-NUTRI2B-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeNutri2b(corpus)), 'utf8'));
  if (before !== PRE_NUTRI2B_CORPUS_SHA256) failed.push('CL-NUTRI2B-DELTA PRE-NUTRI2B-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the part A corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-NUTRI2B-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeNutri2b(moved)), 'utf8')) === PRE_NUTRI2B_CORPUS_SHA256) failed.push('CL-NUTRI2B-DELTA PRE-NUTRI2B-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-NUTRI2B-DELTA');
});
test('CL-NUTRI2B-APPROVAL: the N2 part B copy delta names the ledger line that approves it', () => {
  assert.match(NUTRI2B_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-NUTRI2B-APPROVAL-PENDING: the N2 part B copy is not approved');
});
/* E1 (Fable fd80cb84 D1; the PM's ruling at DECISIONS:989, which reverses DECISIONS:980's estimate for the gated state):
   the engine's gated estimate band is never shown, so N1's estimate title, its one-figure form and its status line are
   withdrawn from today-app.cjs, and calorieEstimate's own " to " and two " kcal" go with them. No piece is added.
   beforeE1 gives every older view the corpus as N2 part B sealed it (PRE_E1_CORPUS_SHA256), and beforeNutri2b starts
   from that view. IDEMPOTENT, as every older view is: a withdrawn piece is put back only where it is not there. */
const PRE_E1_CORPUS_SHA256 = '2b9c25683f1e3d1a880de5f30d73f8e5d9ae61921e25203f282163949af206be';
const E1_APP = T + '/today-app.cjs';
const E1_REMOVED = Object.freeze([
  [' today. Your calorie range is an estimate for now.', { [E1_APP]: 1 }, []],
  ['Estimate: ', { [E1_APP]: 1 }, []],
  ['Estimate: about ', { [E1_APP]: 1 }, []],
]);
const E1_COUNTS = Object.freeze([
  /* [text, owner, count before, count now] */
  [' kcal', E1_APP, 4, 2],
  [' to ', E1_APP, 2, 1],
]);
const E1_COPY_APPROVAL = 'DECISIONS:989';
function beforeE1(corpus) {
  corpus = beforeP7(corpus);   /* polish 7 stands on top of E1 */
  const have = new Set(corpus.entries.map((e) => e.text));
  const back = E1_REMOVED.filter(([text]) => !have.has(text))
    .map(([text, files, lists]) => ({ text, files: sortedFiles(files), lists: [...lists] }));
  const entries = corpus.entries.map((e) => {
    const row = E1_COUNTS.find(([text]) => text === e.text);
    if (!row || e.files[row[1]] !== row[3]) return e;
    return { ...e, files: sortedFiles({ ...e.files, [row[1]]: row[2] }) };
  });
  return { ...corpus, entries: [...entries, ...back].sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0)) };
}
test('CL-E1-DELTA: the corpus is the N2 part B corpus with exactly the estimate words withdrawn, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text] of E1_REMOVED) if (byText.has(text)) failed.push('CL-E1-DELTA REMOVED ' + JSON.stringify(text) + ' is still locked');
  for (const [text, owner, , now] of E1_COUNTS) {
    const entry = byText.get(text);
    if (!entry || entry.files[owner] !== now) failed.push('CL-E1-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeE1(corpus)), 'utf8'));
  if (before !== PRE_E1_CORPUS_SHA256) failed.push('CL-E1-DELTA PRE-E1-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the N2 part B corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-E1-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeE1(moved)), 'utf8')) === PRE_E1_CORPUS_SHA256) failed.push('CL-E1-DELTA PRE-E1-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-E1-DELTA');
});
test('CL-E1-APPROVAL: the E1 copy delta names the ledger line that approves it', () => {
  assert.match(E1_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-E1-APPROVAL-PENDING: the E1 copy is not approved');
});
/* POLISH 7 (PM, ui-pass14): the Log today sheet's close control is named "Close" (its accessible name) and a kept step
   count's way back into its entry says "Change". Both words are already said upstream, so neither is declared in
   design.cjs (the N2 part B rule for "Log today", "Weight" and "Sleep"); each is locked where today-app.cjs says it: one
   new piece ("Close") and one owner count ("Change", today-app.cjs 0 -> 1). beforeP7 gives every older view the corpus
   as E1 sealed it (PRE_P7_CORPUS_SHA256), and beforeE1 starts from that view. IDEMPOTENT, as every older view is. */
const PRE_P7_CORPUS_SHA256 = '975061da864b72a87fb1967d5e24ed526d5af754046a88ffe42b8bbcc640b61c';
const P7_APP = T + '/today-app.cjs';
const P7_NEW = Object.freeze([
  ['Close', { [P7_APP]: 1 }, []],
]);
const P7_OWNERS_MOVED = Object.freeze([
  /* [text, owner, count before, count now] */
  ['Change', P7_APP, 0, 1],
]);
/* the PM's ruling on P7: both words are approved under DECISIONS:913 (5), the short-plain-copy rule */
const P7_COPY_APPROVAL = 'DECISIONS:913';
function beforeP7(corpus) {
  corpus = beforeP8(corpus);   /* polish 8 stands on top of polish 7 */
  const added = new Set(P7_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const rows = P7_OWNERS_MOVED.filter(([text, owner, , now]) => text === e.text && e.files[owner] === now);
    if (rows.length === 0) return e;
    const files = { ...e.files };
    for (const [, owner, before] of rows) { if (before === 0) delete files[owner]; else files[owner] = before; }
    return { ...e, files: sortedFiles(files) };
  }) };
}
test('CL-P7-DELTA: the corpus is the E1 corpus plus exactly the sheet\'s Close and the steps row\'s Change, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of P7_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-P7-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, owner, , now] of P7_OWNERS_MOVED) {
    const entry = byText.get(text);
    if (!entry || entry.files[owner] !== now) failed.push('CL-P7-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeP7(corpus)), 'utf8'));
  if (before !== PRE_P7_CORPUS_SHA256) failed.push('CL-P7-DELTA PRE-P7-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the E1 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-P7-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeP7(moved)), 'utf8')) === PRE_P7_CORPUS_SHA256) failed.push('CL-P7-DELTA PRE-P7-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-P7-DELTA');
});
test('CL-P7-APPROVAL: the polish 7 copy delta names the ledger line that approves it', () => {
  assert.match(P7_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-P7-APPROVAL-PENDING: the polish 7 copy is not approved');
});
/* POLISH 8 (PM, ui-pass15): while the band is gated, Why this plan?'s calorie paragraph says how the range is measured,
   in the PM's own words: one new piece, today-app.cjs WHY_CALORIES_GATED (the gate line after it is the card's, already
   locked). The sheet's weight row says the kept value without the morning card's "This morning" and tick, so the
   value's " lb" is said in one more place: one owner count (" lb", today-app.cjs 2 -> 3). The coach's copy of the
   sentence (coach-intents.cjs PLAIN.measuredFrom) is outside the scanned files, as every PLAIN line is. beforeP8 gives
   every older view the corpus as polish 7 sealed it (PRE_P8_CORPUS_SHA256), and beforeP7 starts from that view.
   IDEMPOTENT, as every older view is. */
const PRE_P8_CORPUS_SHA256 = 'ae2b1609660536eb9eae1dd7d4297e209beb2a45573c9bc70f006b2491ee7e66';
const P8_APP = T + '/today-app.cjs';
const P8_NEW = Object.freeze([
  ['Your calorie range is measured from your food logs and weigh-ins.', { [P8_APP]: 1 }, []],
]);
const P8_OWNERS_MOVED = Object.freeze([
  /* [text, owner, count before, count now] */
  [' lb', P8_APP, 2, 3],
]);
/* the PM's ruling on P8: the sentence (the PM's own wording) is approved under DECISIONS:989, the never-shown ruling */
const P8_COPY_APPROVAL = 'DECISIONS:989';
function beforeP8(corpus) {
  corpus = beforeE2A(corpus);   /* E2a stands on top of polish 8 */
  const added = new Set(P8_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const rows = P8_OWNERS_MOVED.filter(([text, owner, , now]) => text === e.text && e.files[owner] === now);
    if (rows.length === 0) return e;
    const files = { ...e.files };
    for (const [, owner, before] of rows) { if (before === 0) delete files[owner]; else files[owner] = before; }
    return { ...e, files: sortedFiles(files) };
  }) };
}
test('CL-P8-DELTA: the corpus is the polish 7 corpus plus exactly Why this plan?\'s gated sentence and one " lb", both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of P8_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-P8-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, owner, , now] of P8_OWNERS_MOVED) {
    const entry = byText.get(text);
    if (!entry || entry.files[owner] !== now) failed.push('CL-P8-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeP8(corpus)), 'utf8'));
  if (before !== PRE_P8_CORPUS_SHA256) failed.push('CL-P8-DELTA PRE-P8-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the polish 7 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-P8-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeP8(moved)), 'utf8')) === PRE_P8_CORPUS_SHA256) failed.push('CL-P8-DELTA PRE-P8-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-P8-DELTA');
});
test('CL-P8-APPROVAL: the polish 8 copy delta names the ledger line that approves it', () => {
  assert.match(P8_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-P8-APPROVAL-PENDING: the polish 8 copy is not approved');
});
/* E2a (PM, the E2 scope; no engine change): Measure's About you section (the body-fat band picker with its one plain
   line per band and "I don't know", height in feet and inches, sex, and the words each is said back in, "Body fat:
   12-15% (your estimate)"), and the import route's plain sentences for the measure family's and the shared class's
   refusals: 47 new pieces and 5 owner counts, each a piece already locked elsewhere that measure-view.mjs now
   says too ("Change" 0 -> 1, "Measure: no host element" 3 -> 4, "Not now" 0 -> 1, "Save" 0 -> 1, "small muted" 0 -> 3). beforeE2A gives every older
   view the corpus as polish 8 sealed it (PRE_E2A_CORPUS_SHA256), and beforeP8 starts from that view. IDEMPOTENT, as
   every older view is. */
const PRE_E2A_CORPUS_SHA256 = '1f393735e079410b4048195726bf705382b4a4a96d549e9e7bc8bc4a449a2965';
const E2A_VIEW = 'rebuild/m3/w7-preview/measure/measure-view.mjs';
const E2A_IMPORT = 'rebuild/m3/w7-preview/import/import-screen.mjs';
const E2A_NEW = Object.freeze([
  [' (your estimate)', { [E2A_VIEW]: 1 }, []],
  [' cm', { [E2A_VIEW]: 1 }, []],
  [' ft ', { [E2A_VIEW]: 1 }, []],
  [' in', { [E2A_VIEW]: 1 }, []],
  ['% or more', { [E2A_VIEW]: 1 }, []],
  ['A measurement saved on this phone could not be read for the ', { [E2A_IMPORT]: 1 }, []],
  ['About you', { [E2A_VIEW]: 1 }, []],
  ['Abs and the veins on your arms clearly show.', { [E2A_VIEW]: 1 }, []],
  ['Abs do not show, and muscle shape is still clear.', { [E2A_VIEW]: 1 }, []],
  ['Abs show, with little fat on the hips and thighs.', { [E2A_VIEW]: 1 }, []],
  ['Bands for men', { [E2A_VIEW]: 1 }, []],
  ['Bands for women', { [E2A_VIEW]: 1 }, []],
  ['Body fat', { [E2A_VIEW]: 1 }, []],
  ['Body fat: ', { [E2A_VIEW]: 1 }, []],
  ['Body fat: not known', { [E2A_VIEW]: 1 }, []],
  ['Change body fat', { [E2A_VIEW]: 1 }, []],
  ['Change height and sex', { [E2A_VIEW]: 1 }, []],
  ['Choose a range, or I don\'t know.', { [E2A_VIEW]: 1 }, []],
  ['Choose an answer, or Not now.', { [E2A_VIEW]: 1 }, []],
  ['Fat around the stomach, hips, thighs and arms, and no muscle shape showing.', { [E2A_VIEW]: 1 }, []],
  ['Fat around the waist, hips and chest, and no muscle shape showing.', { [E2A_VIEW]: 1 }, []],
  ['Feet', { [E2A_VIEW]: 1 }, []],
  ['Female', { [E2A_VIEW]: 1 }, []],
  ['Height', { [E2A_VIEW]: 1 }, []],
  ['Height and sex', { [E2A_VIEW]: 1 }, []],
  ['Height and sex: not given', { [E2A_VIEW]: 1 }, []],
  ['Height in feet and inches, from 3 ft to 8 ft.', { [E2A_VIEW]: 1 }, []],
  ['Height: ', { [E2A_VIEW]: 1 }, []],
  ['I don\'t know', { [E2A_VIEW]: 1 }, []],
  ['Inches', { [E2A_VIEW]: 1 }, []],
  ['Male', { [E2A_VIEW]: 1 }, []],
  ['Optional. Skip anything you like, and change it later.', { [E2A_VIEW]: 1 }, []],
  ['Pick the range that looks most like you, or say you don\'t know.', { [E2A_VIEW]: 1 }, []],
  ['Prefer not to say', { [E2A_VIEW]: 1 }, []],
  ['Save body fat', { [E2A_VIEW]: 1 }, []],
  ['Save height and sex', { [E2A_VIEW]: 1 }, []],
  ['Sex', { [E2A_VIEW]: 1 }, []],
  ['Sex: ', { [E2A_VIEW]: 1 }, []],
  ['Soft at the stomach, hips and thighs, with little muscle shape showing.', { [E2A_VIEW]: 1 }, []],
  ['Soft at the stomach, with more fat on the hips and thighs.', { [E2A_VIEW]: 1 }, []],
  ['Soft at the waist and hips, with little muscle shape showing.', { [E2A_VIEW]: 1 }, []],
  ['Some outline of the abs, with slight curves at the hips and thighs.', { [E2A_VIEW]: 1 }, []],
  ['That was not saved on this device. Try again.', { [E2A_VIEW]: 1 }, []],
  ['The outline of your abs shows, with little fat at the waist.', { [E2A_VIEW]: 1 }, []],
  ['This phone holds a body measurement Earned cannot read ', { [E2A_IMPORT]: 1 }, []],
  ['import. Nothing on this phone was changed.', { [E2A_IMPORT]: 1 }, []],
  ['yet. Nothing on this phone was changed.', { [E2A_IMPORT]: 1 }, []],
]);
const E2A_OWNERS_MOVED = Object.freeze([
  /* [text, owner, count before, count now] */
  ['Change', E2A_VIEW, 0, 1],
  ['Measure: no host element', E2A_VIEW, 3, 4],
  ['Not now', E2A_VIEW, 0, 1],
  ['Save', E2A_VIEW, 0, 1],
  ['small muted', E2A_VIEW, 0, 3],
]);
/* the PM's ruling on E2a: cite DECISIONS:913 (5), the short-plain-copy rule, until an owner line is recorded for the bands */
const E2A_COPY_APPROVAL = 'DECISIONS:913';
function beforeE2A(corpus) {
  corpus = beforeE2B(corpus);   /* E2b stands on top of E2a */
  const added = new Set(E2A_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const rows = E2A_OWNERS_MOVED.filter(([text, owner, , now]) => text === e.text && e.files[owner] === now);
    if (rows.length === 0) return e;
    const files = { ...e.files };
    for (const [, owner, before] of rows) { if (before === 0) delete files[owner]; else files[owner] = before; }
    return { ...e, files: sortedFiles(files) };
  }) };
}
test('CL-E2A-DELTA: the corpus is the polish 8 corpus plus exactly Measure\'s About you words and the import route\'s two sentences, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of E2A_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-E2A-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, owner, , now] of E2A_OWNERS_MOVED) {
    const entry = byText.get(text);
    if (!entry || entry.files[owner] !== now) failed.push('CL-E2A-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeE2A(corpus)), 'utf8'));
  if (before !== PRE_E2A_CORPUS_SHA256) failed.push('CL-E2A-DELTA PRE-E2A-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the polish 8 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-E2A-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeE2A(moved)), 'utf8')) === PRE_E2A_CORPUS_SHA256) failed.push('CL-E2A-DELTA PRE-E2A-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-E2A-DELTA');
});
test('CL-E2A-APPROVAL: the E2a copy delta names the ledger line that approves it', () => {
  assert.match(E2A_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-E2A-APPROVAL-PENDING: the E2a copy is not approved');
});
/* E2b (the owner's ruling, DECISIONS:999): the import route's one plain sentence for a file sealed by a different engine
   (import-screen.mjs COPY.otherEngine, said only when the file's sealed engine block is not this phone's): 3 new pieces,
   as the screen's literal is split, and no owner count moves. The engine's own new words (energy.cjs) are in no scanned
   file. beforeE2B gives every older view the corpus as E2a sealed it (PRE_E2B_CORPUS_SHA256), and beforeE2A starts from
   that view. IDEMPOTENT, as every older view is. */
const PRE_E2B_CORPUS_SHA256 = 'fe891976bc36c2b920072208a9285fde5bce728ce18ed2aa9f7c46bcbe433e5b';
const E2B_IMPORT = 'rebuild/m3/w7-preview/import/import-screen.mjs';
const E2B_NEW = Object.freeze([
  ['Nothing on this phone was changed.', { [E2B_IMPORT]: 1 }, []],
  ['This file was made by a different version of Earned than the one on ', { [E2B_IMPORT]: 1 }, []],
  ['this phone. Export your history again on the PC and import the new file. ', { [E2B_IMPORT]: 1 }, []],
]);
/* the PM's ruling on E2b: the import sentence is approved under DECISIONS:913 (5), the short-plain-copy rule */
const E2B_COPY_APPROVAL = 'DECISIONS:913';
function beforeE2B(corpus) {
  corpus = beforeP9(corpus);   /* P9 stands on top of E2b */
  const added = new Set(E2B_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)) };
}
test('CL-E2B-DELTA: the corpus is the E2a corpus plus exactly the import route\'s different-version sentence, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of E2B_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-E2B-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeE2B(corpus)), 'utf8'));
  if (before !== PRE_E2B_CORPUS_SHA256) failed.push('CL-E2B-DELTA PRE-E2B-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the E2a corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-E2B-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeE2B(moved)), 'utf8')) === PRE_E2B_CORPUS_SHA256) failed.push('CL-E2B-DELTA PRE-E2B-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-E2B-DELTA');
});
test('CL-E2B-APPROVAL: the E2b copy delta names the ledger line that approves it', () => {
  assert.match(E2B_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-E2B-APPROVAL-PENDING: the E2b copy is not approved');
});
/* P9 (PM, the Today repeats, calls 2 and 6; the PM records the supersession of C-UI-2 ruling 4's stack on Today in the
   ledger before the commit): Today's five quiet links are one More row, so one new piece, today-app.cjs MORE_ENTRY
   (the row's word and the sheet's title); the Recovery row left Today with its pinned bar, so its two board lines are
   withdrawn from the template and from design.cjs APPROVED_COPY (two pieces out, whole). No owner count moves: the
   More sheet's Escape shares the Log today sheet's handler (today-app.cjs closesOnEscape), so "Escape" stays at the 3
   N2 part B pinned (P9_COUNTS is empty, and held empty). beforeP9 gives every older view the corpus as E2b sealed it
   (PRE_P9_CORPUS_SHA256), and beforeE2B starts from that view. IDEMPOTENT, as every older view is: a withdrawn piece
   is put back only where it is not there.
   P9 round 2 (DECISIONS:1003 (1), (2)): Start is START_WORKOUT on the workout card, so one more new piece ("Start
   workout") and one piece withdrawn whole ("Start ", the head of the old "Start <title>" label, said nowhere else);
   Resume names the tap on every day too (resumeLabel), so today-app.cjs no longer says "Resume " as a piece of its own
   (one owner count, 1 -> 0; design.cjs RUNTIME_COPY still declares it and RESUME_TODAYS_WORKOUT still says it); and the
   Recovery row's title is back, whole and as it was, as the More sheet's first row wherever Log today is not on the
   page, so only its invitation stays withdrawn. An owner count of 0 is an owner the corpus does not list. */
const PRE_P9_CORPUS_SHA256 = 'f31847eb7ee43db789ff54ab5ea37d907879ecabd3bf676b89dc0c686b9dca8d';
const P9_APP = T + '/today-app.cjs';
const P9_NEW = Object.freeze([
  ['More', { [P9_APP]: 1 }, []],
  ['Start workout', { [P9_APP]: 1 }, []],
]);
const P9_REMOVED = Object.freeze([
  ['Optional. How are you feeling?', { [T + '/design.cjs']: 1, [T + '/screens.template.html']: 1 }, ['APPROVED_COPY']],
  ['Start ', { [P9_APP]: 1 }, []],
]);
const P9_COUNTS = Object.freeze([
  /* [text, owner, count before, count now] */
  ['Resume ', P9_APP, 1, 0],
]);
/* "More" and "Start workout" are new copy approved by the PM's P9 ruling, DECISIONS:1003 ("New copy approved under :913
   (5): More, Start workout"). The withdrawn pieces need no approval of their own. */
const P9_COPY_APPROVAL = 'DECISIONS:1003';
function beforeP9(corpus) {
  const added = new Set(P9_NEW.map(([text]) => text));
  const have = new Set(corpus.entries.map((e) => e.text));
  const back = P9_REMOVED.filter(([text]) => !have.has(text))
    .map(([text, files, lists]) => ({ text, files: sortedFiles(files), lists: [...lists] }));
  const entries = corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const rows = P9_COUNTS.filter(([text, owner, , now]) => text === e.text && (e.files[owner] || 0) === now);
    if (rows.length === 0) return e;
    const files = { ...e.files };
    for (const [, owner, before] of rows) { if (before === 0) delete files[owner]; else files[owner] = before; }
    return { ...e, files: sortedFiles(files) };
  });
  return { ...corpus, entries: [...entries, ...back].sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0)) };
}
test('CL-P9-DELTA: the corpus is the E2b corpus plus exactly More and Start workout, minus exactly the Recovery row\'s invitation and Start\'s old head, and one Resume owner, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  assert.deepEqual(P9_COUNTS.map(([text, owner, before, now]) => [text, owner, before, now]), [['Resume ', P9_APP, 1, 0]],
    'CL-P9-DELTA exactly one owner count moves');
  assert.equal(byText.get('Escape') && byText.get('Escape').files[P9_APP], 3, 'CL-P9-DELTA the More sheet adds no Escape of its own');
  /* the Recovery row's title is back exactly as E2b sealed it, so no delta row carries it */
  assert.equal(JSON.stringify(byText.get('Recovery check in') || null), JSON.stringify({ text: 'Recovery check in',
    files: sortedFiles({ [T + '/design.cjs']: 1, [T + '/screens.template.html']: 1 }), lists: ['APPROVED_COPY'] }),
  'CL-P9-DELTA the Recovery row title is locked as it was');
  for (const [text, files, lists] of P9_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-P9-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text] of P9_REMOVED) if (byText.has(text)) failed.push('CL-P9-DELTA REMOVED ' + JSON.stringify(text) + ' is still locked');
  for (const [text, owner, , now] of P9_COUNTS) {
    const entry = byText.get(text);
    if (!entry || (entry.files[owner] || 0) !== now) failed.push('CL-P9-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeP9(corpus)), 'utf8'));
  if (before !== PRE_P9_CORPUS_SHA256) failed.push('CL-P9-DELTA PRE-P9-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the E2b corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-P9-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeP9(moved)), 'utf8')) === PRE_P9_CORPUS_SHA256) failed.push('CL-P9-DELTA PRE-P9-VIEW-BLIND');
  // ... and it is idempotent: the E2b view taken twice is the E2b view
  if (lock.sha256(Buffer.from(serialize(beforeP9(beforeP9(corpus))), 'utf8')) !== PRE_P9_CORPUS_SHA256) failed.push('CL-P9-DELTA NOT-IDEMPOTENT');
  assert.deepEqual(failed, [], 'CL-P9-DELTA');
});
test('CL-P9-APPROVAL: the P9 copy delta names the ledger line that approves it', () => {
  assert.match(P9_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-P9-APPROVAL-PENDING: the P9 copy is not approved');
  assert.equal(P9_COPY_APPROVAL, 'DECISIONS:1003', 'CL-P9-APPROVAL the PM\'s P9 ruling, which names More and Start workout');
});
function beforeNutri2a(corpus) {
  corpus = beforeNutri2b(corpus);   /* N2 part B stands on top of N2 part A */
  const added = new Set(N2A_NEW.map(([text]) => text));
  return { ...corpus, scanned: corpus.scanned.filter((f) => !N2A_SCANNED.includes(f)),
    entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
      const row = N2A_OWNERS_ADDED.find(([text]) => text === e.text);
      if (!row) return e;
      const files = { ...e.files };
      for (const owner of Object.keys(row[1])) delete files[owner];
      return { ...e, files: sortedFiles(files) };
    }) };
}
test('CL-NUTRI2A-DELTA: the corpus is the ui-pass13 corpus plus exactly the steps lane\'s files and pieces and the blackout words, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const f of N2A_SCANNED) if (!corpus.scanned.includes(f)) failed.push('CL-NUTRI2A-DELTA SCANNED ' + f + ' is not scanned');
  for (const [text, files, lists] of N2A_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-NUTRI2A-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, owners] of N2A_OWNERS_ADDED) {
    const entry = byText.get(text);
    for (const [owner, count] of Object.entries(owners))
      if (!entry || entry.files[owner] !== count) failed.push('CL-NUTRI2A-DELTA OWNER ' + JSON.stringify(text) + ' ' + owner + ' is ' + JSON.stringify(entry ? entry.files[owner] : null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeNutri2a(corpus)), 'utf8'));
  if (before !== PRE_NUTRI2A_CORPUS_SHA256) failed.push('CL-NUTRI2A-DELTA PRE-NUTRI2A-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the nutri 1 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-NUTRI2A-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeNutri2a(moved)), 'utf8')) === PRE_NUTRI2A_CORPUS_SHA256) failed.push('CL-NUTRI2A-DELTA PRE-NUTRI2A-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-NUTRI2A-DELTA');
});
test('CL-NUTRI2A-APPROVAL: the N2 part A copy delta names the ledger line that approves it', () => {
  assert.match(NUTRI2A_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-NUTRI2A-APPROVAL-PENDING: the N2 part A copy is not approved');
});
/* Nutri 1 (owner ruling 2026-10-13, "Labelled estimate"): the food card's estimate band and its gate line
   (today-app.cjs CALORIE_ESTIMATE, CALORIE_GATE), and the estimate's " to " and " kcal" (calorieEstimate) as one more
   owner count each (two, with the one-figure form), the one-figure estimate and the status line's estimate words.
   beforeNutri1 gives every older view the corpus as polish 6 sealed it (PRE_NUTRI1_CORPUS_SHA256), and beforePolish6
   starts from that view. Approved under DECISIONS:980, the owner's ruling, which supersedes N05, T-19's title and
   status-line words and C-12 for the gated state. */
const PRE_NUTRI1_CORPUS_SHA256 = 'a4374f49ba1d6fc625be85bfa9c9a753e821edd7f1aef5822f705b52cb09f60c';
const N1_APP = { [T + '/today-app.cjs']: 1 };
const NUTRI1_NEW = Object.freeze([
  ['Estimate: ', N1_APP, []], ['Log food for ', N1_APP, []], ['Weigh in ', N1_APP, []], [' and weigh in ', N1_APP, []],
  [' more day', N1_APP, []], [' more days', N1_APP, []], [' more time', N1_APP, []], [' more times', N1_APP, []],
  [' to measure yours.', N1_APP, []],
  /* DECISIONS:980 (PM rulings on N1): the one-figure estimate, and the status line's words for the estimate */
  ['Estimate: about ', N1_APP, []], [' today. Your calorie range is an estimate for now.', N1_APP, []],
]);
const NUTRI1_CHANGED = Object.freeze([
  [' kcal', { [T + '/today-app.cjs']: 2 }, { [T + '/today-app.cjs']: 4 }],
  [' to ', { [T + '/today-app.cjs']: 1, [T + '/today-model.cjs']: 2 }, { [T + '/today-app.cjs']: 2, [T + '/today-model.cjs']: 2 }],
]);
const NUTRI1_COPY_APPROVAL = 'DECISIONS:980';
/* UI-PASS13 (fix-forward on f4bd98c, item 4): the nutrition screen's carbohydrate and fat wording. One new piece, the
   PM's own sentence, said once (today-app.cjs FOOD_NOT_PRESCRIBED, declared in design.cjs PREVIEW_RUNTIME_COPY), and
   the three "engine issues no ..." pieces it replaces leave the corpus. No scanned file, owner count or mounted state
   moves otherwise. beforeUp13 gives every older view the corpus as nutri 1 sealed it (PRE_UP13_CORPUS_SHA256), and
   beforeNutri1 starts from that view. Approved under DECISIONS:913 (5) (PM ruling on the ui-pass13 fix-forward: short
   plain copy under the owner's standing Yes). */
const PRE_UP13_CORPUS_SHA256 = 'e8193158be573082b5c2a8ba737a472971d12a658b09e4560654eb3437ed0b97';
const UP13_NEW = Object.freeze([
  ['No carb or fat target; protein and calories are what count.', { [T + '/design.cjs']: 1, [T + '/today-app.cjs']: 1 }, ['PREVIEW_RUNTIME_COPY']],
]);
const UP13_REMOVED = Object.freeze([
  ['Not prescribed. The engine issues no carbohydrate or fat target.', { [T + '/design.cjs']: 1, [T + '/today-app.cjs']: 1 }, ['PREVIEW_RUNTIME_COPY']],
  ['Not prescribed. The engine issues no carbohydrate target.', { [T + '/today-app.cjs']: 1 }, []],
  ['Not prescribed. The engine issues no fat target.', { [T + '/today-app.cjs']: 1 }, []],
]);
const UP13_COPY_APPROVAL = 'DECISIONS:913';
const byEntryText = (a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0);
function beforeUp13(corpus) {
  corpus = beforeNutri2a(corpus);   /* N2 part A stands on top of the ui-pass13 fix-forward */
  const added = new Set(UP13_NEW.map(([text]) => text));
  /* IDEMPOTENT, as every older view is: s14View applies the whole chain to a view already taken back, so a piece is
     put back only where it is not already there. */
  const kept = corpus.entries.filter((e) => !added.has(e.text)), have = new Set(kept.map((e) => e.text));
  const back = UP13_REMOVED.filter(([text]) => !have.has(text))
    .map(([text, files, lists]) => ({ text, files: sortedFiles(files), lists: [...lists] }));
  return { ...corpus, entries: [...kept, ...back].sort(byEntryText) };
}
test('CL-UP13-DELTA: the corpus is the nutri 1 corpus with exactly the carbohydrate and fat wording replaced, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of UP13_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-UP13-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text] of UP13_REMOVED) if (byText.has(text)) failed.push('CL-UP13-DELTA REMOVED ' + JSON.stringify(text) + ' is still locked');
  const before = lock.sha256(Buffer.from(serialize(beforeUp13(corpus)), 'utf8'));
  if (before !== PRE_UP13_CORPUS_SHA256) failed.push('CL-UP13-DELTA PRE-UP13-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the nutri 1 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-UP13-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeUp13(moved)), 'utf8')) === PRE_UP13_CORPUS_SHA256) failed.push('CL-UP13-DELTA PRE-UP13-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-UP13-DELTA');
});
test('CL-UP13-APPROVAL: the ui-pass13 copy delta names the ledger line that approves it', () => {
  assert.match(UP13_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-UP13-APPROVAL-PENDING: the ui-pass13 copy is not approved');
});
function beforeNutri1(corpus) {
  corpus = beforeUp13(corpus);   /* the ui-pass13 fix-forward stands on top of nutri 1 */
  const added = new Set(NUTRI1_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const row = NUTRI1_CHANGED.find(([text]) => text === e.text);
    return row ? { ...e, files: sortedFiles(row[1]) } : e;
  }) };
}
test('CL-NUTRI1-DELTA: the corpus is the polish 6 corpus plus exactly the estimate band and its gate line, both directions', () => {
  /* E1 (DECISIONS:989) withdrew three of these pieces and two of these counts: they are checked here as nutri 1 left
     them (beforeE1, E1's layer only), and CL-E1-DELTA holds exactly their withdrawal in the corpus as it stands. */
  const corpus = beforeE1(loaded().corpus);
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of NUTRI1_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-NUTRI1-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, , now] of NUTRI1_CHANGED) {
    const want = { text, files: sortedFiles(now), lists: [] };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-NUTRI1-DELTA CHANGED ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeNutri1(corpus)), 'utf8'));
  if (before !== PRE_NUTRI1_CORPUS_SHA256) failed.push('CL-NUTRI1-DELTA PRE-NUTRI1-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the polish 6 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-NUTRI1-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeNutri1(moved)), 'utf8')) === PRE_NUTRI1_CORPUS_SHA256) failed.push('CL-NUTRI1-DELTA PRE-NUTRI1-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-NUTRI1-DELTA');
});
test('CL-NUTRI1-APPROVAL: the nutri 1 copy delta names the ledger line that approves it', () => {
  assert.match(NUTRI1_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-NUTRI1-APPROVAL-PENDING: the nutri 1 copy is not approved');
});
/* Polish 6 (PM, ui-pass12, item 1): exactly one more piece, the board's own T-03 status line (app/states-today.js T-03,
   the C-UI-2 status-line words, DECISIONS:820 (2)), owned by today-app.cjs's status-line block and said while an
   enrolled device's adoption has not settled, and declared in design.cjs RUNTIME_COPY (Fable D1). beforePolish6 gives every older view the corpus as polish 5 sealed it
   (PRE_POLISH6_CORPUS_SHA256), and beforePolish5 starts from that view. */
const PRE_POLISH6_CORPUS_SHA256 = 'e63812aec64410a31dd34f87ead5e48a24aa74c45592e8c972a749df28378cd2';
const POLISH6_NEW = Object.freeze([
  /* Fable D1 (6d2d4c34): declared in design.cjs RUNTIME_COPY beside Today's other borrowed board status words */
  ['Your record is opening. Nothing here is measured yet.', { [T + '/design.cjs']: 1, [T + '/today-app.cjs']: 1 }, ['RUNTIME_COPY']],
]);
const POLISH6_COPY_APPROVAL = 'DECISIONS:820';
function beforePolish6(corpus) {
  corpus = beforeNutri1(corpus);   /* nutri 1 stands on top of polish 6 */
  const added = new Set(POLISH6_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)) };
}
test('CL-POLISH6-DELTA: the corpus is the polish 5 corpus plus exactly the T-03 status line, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of POLISH6_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-POLISH6-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforePolish6(corpus)), 'utf8'));
  if (before !== PRE_POLISH6_CORPUS_SHA256) failed.push('CL-POLISH6-DELTA PRE-POLISH6-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the polish 5 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-POLISH6-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforePolish6(moved)), 'utf8')) === PRE_POLISH6_CORPUS_SHA256) failed.push('CL-POLISH6-DELTA PRE-POLISH6-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-POLISH6-DELTA');
});
test('CL-POLISH6-APPROVAL: the polish 6 copy delta names the ledger line that approves it', () => {
  assert.match(POLISH6_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-POLISH6-APPROVAL-PENDING: the polish 6 copy is not approved');
});
/* Polish 5 (PM, the owner's 7-lift world, ui-pass11): the set screen's plain line (gym-app.mjs SET_PLAIN), the offer
   verb "Use " (today-entry.mjs; "Undo" gains it as a second owner), the workout line's loading state (today-app.cjs), the
   coach's plain source line (coach-app.mjs and design.cjs COACH_LIVE_APPROVED), and "Why this plan?" on its own row
   (today-app.cjs gains it as an owner; " \u00b7 Why this plan?" leaves); the pack's "From this device\u2019s encrypted local
   store." leaves the live coach. The five mounted gym states draw the plain line where they drew the fixture's reason,
   which is no longer drawn at all (the ruling: Why? opens the plain rewrite, gym-app.mjs SET_WHY). beforePolish5 gives
   every older view the corpus as polish 4 sealed it (PRE_POLISH5_CORPUS_SHA256), and beforePolish4 starts from that
   view. Short plain copy, PM-approved under :913 (5). */
const PRE_POLISH5_CORPUS_SHA256 = '0f7f06de22c15e9cdf7e811e336f4171720f8d7e6c230447b470b250e979c295';
const P5_GYM = { [T + '/gym-app.mjs']: 1 };
const POLISH5_NEW = Object.freeze([
  [' lb for ', P5_GYM, []], [' lb from ', P5_GYM, []], [' lb last time.', P5_GYM, []],
  /* the ruling's plain Why? (gym-app.mjs SET_WHY) ends four of its sentences with " lb." too */
  [' lb.', { [T + '/gym-app.mjs']: 5 }, []],
  [' fewer reps.', P5_GYM, []], [' more reps.', P5_GYM, []], [', and today repeats it.', P5_GYM, []], ['. Today keeps ', P5_GYM, []],
  ['. Today keeps the weight and asks for ', P5_GYM, []], ['. Today keeps the weight and asks for one more rep.', P5_GYM, []],
  ['. Today keeps the weight with ', P5_GYM, []], ['. Today keeps the weight with one rep fewer.', P5_GYM, []],
  ['. Today moves the weight down to ', P5_GYM, []], ['. Today moves the weight up to ', P5_GYM, []], ['Last time you did ', P5_GYM, []],
  ['There is no earlier set of this lift on this device, so today starts at the planned ', P5_GYM, []],
  ['There is no earlier set of this lift on this device. Choose a weight that stays steady for every set; what you log becomes your starting point.', P5_GYM, []],
  ['This is the weight your recent sets support.', P5_GYM, []],
  /* D1 (Fable, f2427b73): a load the plan did not set is said as the athlete's own, never as planned */
  ['Choose your weight for this set.', P5_GYM, []], ['Your plan does not set a weight for this set.', P5_GYM, []],
  [' The box starts at ', P5_GYM, []], [' lb from your recent sets; change it to what you lift.', P5_GYM, []],
  [' reps from last time.', P5_GYM, []], ['Down ', P5_GYM, []], ['Down one rep from last time.', P5_GYM, []],
  ['Down to ', P5_GYM, []], ['First time: ', P5_GYM, []], ['First time: find your weight.', P5_GYM, []],
  ['Same as last time: ', P5_GYM, []], ['Same weight as last time: ', P5_GYM, []], ['Up ', P5_GYM, []],
  ['Up one rep from last time.', P5_GYM, []], ['Up to ', P5_GYM, []],
  ['Use ', { [T + '/today-entry.mjs']: 1 }, []],
  ['Your set targets are loading', { [T + '/today-app.cjs']: 1 }, []],
  ['From your data on this phone.', { [CV1_APP]: 1, [CV1_DESIGN]: 1 }, []],
]);
const POLISH5_REMOVED = Object.freeze([
  [' \u00b7 Why this plan?', { [T + '/today-app.cjs']: 1 }, []],
  ['From this device\u2019s encrypted local store.', { [CV1_APP]: 1 }, []],
]);
const POLISH5_CHANGED = Object.freeze([
  ['Undo', { [T + '/screens.template.html']: 1 }, { [T + '/screens.template.html']: 1, [T + '/today-entry.mjs']: 1 }, []],
  ['Why this plan?', { [CV1_DESIGN]: 1, [T + '/screens.template.html']: 1 },
    { [CV1_DESIGN]: 1, [T + '/screens.template.html']: 1, [T + '/today-app.cjs']: 1 }, ['RUNTIME_COPY']],
]);
/* the mounted gym states: the plain line in, the fixture's reason (now behind Why?) out, in every one of the five */
const POLISH5_STATE_SWAP = Object.freeze(['First time: find your weight.', 'Synthetic reason']);
const POLISH5_COPY_APPROVAL = 'DECISIONS:913';
function beforePolish5(corpus) {
  corpus = beforePolish6(corpus);   /* polish 6 stands on top of polish 5 */
  const added = new Set(POLISH5_NEW.map(([text]) => text));
  /* idempotent, as the older views are read through it more than once (CL-S15-DELTA's s14View) */
  const back = POLISH5_REMOVED.filter(([text]) => !corpus.entries.some((e) => e.text === text))
    .map(([text, files, lists]) => ({ text, files: sortedFiles(files), lists }));
  const [now, was] = POLISH5_STATE_SWAP;
  const states = Object.fromEntries(Object.entries(corpus.states).map(([id, s]) =>
    [id, { ...s, texts: s.texts.includes(now) ? s.texts.filter((t) => t !== now).concat([was]).sort() : s.texts }]));
  return { ...corpus, states, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const row = POLISH5_CHANGED.find(([text]) => text === e.text);
    return row ? { ...e, files: sortedFiles(row[1]) } : e;
  }).concat(back).sort(byTextOrder) };
}
test('CL-POLISH5-DELTA: the corpus is the polish 4 corpus plus exactly the polish 5 pieces, owners and states, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of POLISH5_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-POLISH5-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text] of POLISH5_REMOVED) if (byText.has(text)) failed.push('CL-POLISH5-DELTA REMOVED-STILL-THERE ' + JSON.stringify(text));
  for (const [text, , now, lists] of POLISH5_CHANGED) {
    const want = { text, files: sortedFiles(now), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-POLISH5-DELTA CHANGED ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [id, s] of Object.entries(corpus.states)) {
    if (!s.texts.includes(POLISH5_STATE_SWAP[0]) || s.texts.includes(POLISH5_STATE_SWAP[1])) failed.push('CL-POLISH5-DELTA STATE ' + id);
  }
  const before = lock.sha256(Buffer.from(serialize(beforePolish5(corpus)), 'utf8'));
  if (before !== PRE_POLISH5_CORPUS_SHA256) failed.push('CL-POLISH5-DELTA PRE-POLISH5-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the polish 4 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-POLISH5-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforePolish5(moved)), 'utf8')) === PRE_POLISH5_CORPUS_SHA256) failed.push('CL-POLISH5-DELTA PRE-POLISH5-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-POLISH5-DELTA');
});
test('CL-POLISH5-APPROVAL: the polish 5 copy delta names the ledger line that approves it', () => {
  assert.match(POLISH5_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-POLISH5-APPROVAL-PENDING: the polish 5 copy is not approved');
});
/* Polish 4 (PM, the owner's 7-lift week): exactly three more pieces, the weekly review card's controls, owned by
   today-app.cjs paintWeekReview (WEEK_REVIEW_WORDS) and declared in no list. beforePolish4 gives every older view the
   corpus as the seat read sealed it (PRE_POLISH4_CORPUS_SHA256), and beforeSeat starts from that view. Short plain copy,
   PM-approved under :913 (5). */
const PRE_POLISH4_CORPUS_SHA256 = '5bdf2c2ef26c090681262788f951eda7a3986798b2f3678315b642a226e848e5';
const POLISH4_NEW = Object.freeze([
  ['See details', { [T + '/today-app.cjs']: 1 }, []],
  ['Hide details', { [T + '/today-app.cjs']: 1 }, []],
  ['Show fewer', { [T + '/today-app.cjs']: 1 }, []],
]);
const POLISH4_COPY_APPROVAL = 'DECISIONS:913';
function beforePolish4(sealed) {
  const corpus = beforePolish5(sealed);
  const added = new Set(POLISH4_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)) };
}
test('CL-WEEK-POLISH4-DELTA: the corpus is the seat corpus plus exactly the three review controls, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of POLISH4_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-WEEK-POLISH4-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforePolish4(corpus)), 'utf8'));
  if (before !== PRE_POLISH4_CORPUS_SHA256) failed.push('CL-WEEK-POLISH4-DELTA PRE-POLISH4-VIEW ' + before);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the seat corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-WEEK-POLISH4-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforePolish4(moved)), 'utf8')) === PRE_POLISH4_CORPUS_SHA256) failed.push('CL-WEEK-POLISH4-DELTA PRE-POLISH4-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-WEEK-POLISH4-DELTA');
});
test('CL-WEEK-POLISH4-APPROVAL: the polish 4 copy delta names the ledger line that approves it', () => {
  assert.match(POLISH4_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-WEEK-POLISH4-APPROVAL-PENDING: the polish 4 copy is not approved');
});
function beforeSeat(sealed) {
  const corpus = beforePolish4(sealed);
  const added = new Set(SEAT_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)) };
}
test('CL-COACH-SEAT-DELTA: the corpus is the polish corpus plus exactly the seat question, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of SEAT_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-COACH-SEAT-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const before = lock.sha256(Buffer.from(serialize(beforeSeat(corpus)), 'utf8'));
  if (before !== PRE_SEAT_CORPUS_SHA256) failed.push('CL-COACH-SEAT-DELTA PRE-SEAT-VIEW ' + before);
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-COACH-SEAT-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeSeat(moved)), 'utf8')) === PRE_SEAT_CORPUS_SHA256) failed.push('CL-COACH-SEAT-DELTA PRE-SEAT-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-COACH-SEAT-DELTA');
});
test('CL-COACH-SEAT-APPROVAL: the seat copy delta names the ledger line that approves it', () => {
  assert.match(SEAT_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-COACH-SEAT-APPROVAL-PENDING: the seat copy is not approved');
});
function beforePolish(sealed) {
  const corpus = beforeSeat(sealed);
  const added = new Set(POLISH_NEW.map(([text]) => text));
  const back = POLISH_REMOVED.map(([text, files, lists]) => ({ text, files: sortedFiles(files), lists }));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const row = POLISH_CHANGED.find(([text]) => text === e.text);
    return row ? { ...e, files: sortedFiles(row[1]) } : e;
  }).concat(back).sort(byTextOrder) };
}
test('CL-COACH-POLISH-DELTA: the corpus is the piece 2 corpus plus "Ask Coach" and minus the Talk row words, both directions', () => {
  const { corpus } = loaded();
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of POLISH_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-COACH-POLISH-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text] of POLISH_REMOVED) if (byText.has(text)) failed.push('CL-COACH-POLISH-DELTA REMOVED-STILL-THERE ' + JSON.stringify(text));
  for (const [text, , now] of POLISH_CHANGED) {
    const want = { text, files: sortedFiles(now), lists: [] };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-COACH-POLISH-DELTA CHANGED ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const piece2 = lock.sha256(Buffer.from(serialize(beforePolish(corpus)), 'utf8'));
  if (piece2 !== PIECE2_CORPUS_SHA256) failed.push('CL-COACH-POLISH-DELTA PIECE2-VIEW ' + piece2);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the piece 2 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-COACH-POLISH-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforePolish(moved)), 'utf8')) === PIECE2_CORPUS_SHA256) failed.push('CL-COACH-POLISH-DELTA PIECE2-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-COACH-POLISH-DELTA');
});
test('CL-COACH-POLISH-APPROVAL: the polish copy delta names the ledger line that approves it', () => {
  assert.match(POLISH_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-COACH-POLISH-APPROVAL-PENDING: the polish copy is not approved');
});
function beforeCoachV1(polished) {
  const corpus = beforePolish(polished);
  const added = new Set(COACH_V1_NEW.map(([text]) => text));
  return { ...corpus, entries: corpus.entries.filter((e) => !added.has(e.text)).map((e) => {
    const row = COACH_V1_CHANGED.find(([text]) => text === e.text);
    return row ? { ...e, files: sortedFiles(row[1]) } : e;
  }) };
}
test('CL-COACH-V1-DELTA: the corpus is the S19 corpus plus exactly the listed Coach v1 pieces and counts, both directions', () => {
  const { corpus } = loaded();
  // Polish batch: the Coach v1 pieces are judged on the piece 2 corpus, which beforePolish rebuilds byte for byte
  // (CL-COACH-POLISH-DELTA); beforeCoachV1 below starts from that same view.
  const byText = new Map(beforePolish(corpus).entries.map((e) => [e.text, e]));
  const failed = [];
  for (const [text, files, lists] of COACH_V1_NEW) {
    const want = { text, files: sortedFiles(files), lists };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-COACH-V1-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  for (const [text, , now] of COACH_V1_CHANGED) {
    const want = { text, files: sortedFiles(now), lists: [] };
    if (JSON.stringify(byText.get(text) || null) !== JSON.stringify(want)) failed.push('CL-COACH-V1-DELTA CHANGED ' + JSON.stringify(text) + ' is ' + JSON.stringify(byText.get(text) || null));
  }
  const s19 = lock.sha256(Buffer.from(serialize(beforeCoachV1(corpus)), 'utf8'));
  if (s19 !== S19_CORPUS_SHA256) failed.push('CL-COACH-V1-DELTA S19-VIEW ' + s19);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the S19 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-COACH-V1-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(beforeCoachV1(moved)), 'utf8')) === S19_CORPUS_SHA256) failed.push('CL-COACH-V1-DELTA S19-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-COACH-V1-DELTA');
});
test('CL-COACH-V1-APPROVAL: the Coach v1 copy delta names the ledger line that approves it', () => {
  assert.match(COACH_V1_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-COACH-V1-APPROVAL-PENDING: the Coach v1 copy is not approved');
});
// The S14 view: this corpus (as S19 sealed it, and as it stood before S18) minus the S15 pieces and the S15 scanned files.
function s14View(corpus) {
  const added = new Set(S15_NEW.map(([text]) => text)), before = beforeS18(beforeCoachV1(corpus));
  return { ...before, entries: before.entries.filter((e) => !added.has(e.text)),
    scanned: before.scanned.filter((f) => !S15_SCANNED.includes(f)) };
}
test('CL-S18-REOWNED: "Why?" gains exactly its two S18 owners, and the view before S18 is exactly the S17 piece', () => {
  const corpus = beforeCoachV1(loaded().corpus);
  for (const [text, was, now] of S18_REOWNED) {
    const got = corpus.entries.find((e) => e.text === text);
    assert.deepEqual(got, { text, files: sortedFiles(now), lists: [] }, 'CL-S18-REOWNED NOW ' + text);
    assert.deepEqual(beforeS18(corpus).entries.find((e) => e.text === text), { text, files: sortedFiles(was), lists: [] }, 'CL-S18-REOWNED WAS ' + text);
  }
});

test('CL-S15-DELTA: the S15 corpus is the S14 corpus plus exactly the approved S15 routine pieces, both directions', () => {
  // Coach v1: judged on the S19 corpus, which beforeCoachV1 rebuilds byte for byte from this corpus (CL-COACH-V1-DELTA)
  const corpus = beforeCoachV1(loaded().corpus);
  const byText = new Map(corpus.entries.map((e) => [e.text, e]));
  const failed = [];
  assert.equal(S15_NEW.length, 46, 'CL-S15-DELTA-COUNT');
  for (const [text, files] of S15_NEW) {
    const want = { text, files: sortedFiles(files), lists: [] };
    const got = byText.get(text) || null;
    if (JSON.stringify(got) !== JSON.stringify(want)) failed.push('CL-S15-DELTA NEW ' + JSON.stringify(text) + ' is ' + JSON.stringify(got));
  }
  for (const f of S15_SCANNED) if (!corpus.scanned.includes(f)) failed.push('CL-S15-DELTA SCANNED ' + f);
  const s14 = lock.sha256(Buffer.from(serialize(s14View(corpus)), 'utf8'));
  if (s14 !== S14_CORPUS_SHA256) failed.push('CL-S15-DELTA S14-VIEW ' + s14);
  // ... and that comparison can fail: one owner count the delta does not touch, moved, is no longer the S14 corpus
  const moved = structuredClone(corpus);
  const other = moved.entries.find((e) => e.text === 'Settings could not be read.');
  assert(other && Object.keys(other.files).length > 0, 'CL-S15-DELTA-TEETH-PRECONDITION');
  other.files[Object.keys(other.files)[0]] += 1;
  if (lock.sha256(Buffer.from(serialize(s14View(moved)), 'utf8')) === S14_CORPUS_SHA256) failed.push('CL-S15-DELTA S14-VIEW-BLIND');
  assert.deepEqual(failed, [], 'CL-S15-DELTA');
});

test('CL-S15-APPROVAL: the S15 copy delta names the ledger line that approves it', () => {
  assert.match(S15_COPY_APPROVAL, /^DECISIONS:\d+$/, 'CL-S15-APPROVAL-PENDING: the S15 copy is not approved');
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
  // S14 (M2-S14-HOLD, E1 (c) / R2b, red first): the load formats gain the R2b piece "<key> on every set" (brief
  // S13-HOLD-BW-BRIEF.md section 10; approved by the PM under the owner's standing Yes, DECISIONS:913 (5), brief 12.11):
  // a configuration position prints its own non-blank key. Every other literal of the block is unchanged.
  { id: 'NL-LOADS', at: ':164-167', approval: 'DECISIONS:842 (the load formats) and DECISIONS:913 (5) (the S14 R2b piece)', source: [
    "const setLoads = (vector) => {",
    "  const values = vector.map((x) => (x && typeof x.value === 'number' ? x.value + ' lb' : x && x.kind === 'configuration' && textLoad(x.configuration_key) ? x.configuration_key : 'no load'));",
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
// S14: a completion whose every slot was prescribed the card text hold (a configuration), as engine-capture writes it.
function fxHold(c) { for (const slot of c.session.record.entries[0].slots) slot.prescribed_load = { state: 'specified', source: { kind: 'configuration', configuration_key: 'hold' } }; return c; }
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
  // S14 (E12, red first on the round-1 engine, which printed "no load"): the R2b piece, a CONFIGURATION ADOPTION over the
  // card text hold (DECISIONS:913 (5), brief 12.11), and the Undo of its Yes.
  { id: 'S14 R2b adopt over a configuration, the card said hold', build: () => fxCase({ w: 'hold' }, [fxHold(fxC(1, { reps: FX_TOP, loads: 140, effort: fxE(2, 1, 1) }))]),
    want: ['Fx Press: on 2026-10-01 you completed every set at 140 lb on every set (the card said hold on every set)' + FX_ADOPT_TAIL] },
  { id: 'S14 R2b undo of that adoption', build: () => fxCase({ w: 'hold' }, [fxHold(fxC(1, { reps: FX_TOP, loads: 140, effort: fxE(2, 1, 1) }))], { undo: true }), want: [FX_UNDO('hold on every set')] },
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
  // 30 literals at 9288adf: NL-LOADS 5, NL-EARN 14, NL-ADOPT 9, NL-UNDO 2. S14 (R2b): 31, NL-LOADS gains 'configuration'
  // (its mutant is refused by the S14 R2b output case above).
  assert.equal(mutants.length, 31, 'CL-ENGINE-OUTPUT-TEETH-LITERAL-COUNT');
  for (const m of mutants) if (!engineOutputRefusals(m.text).length) failed.push('CL-ENGINE-OUTPUT-TEETH ' + m.label + ' passed');
  const crlf = engineOutputRefusals(original.replace(/\r?\n/g, '\r\n'));
  if (crlf.length) failed.push('CL-ENGINE-OUTPUT-TEETH CRLF checkout refused ' + JSON.stringify(crlf));
  assert.deepEqual(failed, [], 'CL-ENGINE-OUTPUT-TEETH');
});

/* ---------------- S14 (M2-S14-HOLD) CL-COMPOSED-DATA (brief S14-HOLD-BW-BRIEF.md sections 5 and 10, I-COPY) ----------------
   DECISIONS:922 (c) keeps this cell as the I-COPY cell of the slice. The S14 copy puts the athlete's own data beside approved
   words, and that data is not a copy-lock piece (brief section 10, "DATA, NOT COPY"): the lift name before the R4 panel line
   (today-entry.mjs paint(): nameOf(lift) + ": " + the line) and the card's configuration text inside the R2b piece
   ("<key> on every set", native-load.cjs setLoads). Three parts, each able to fail:
   (1) paint() composes exactly that: the composition occurs once in today-entry.mjs (read as text, never loaded) and the
       line it shows is the corpus piece, byte for byte;
   (2) the composed line is covered by the locked piece plus the lift name given as data, for invented names no piece
       carries; without the name as data it is NOT covered (the decomposition can fail); with one unlisted literal word
       in place of an approved one it is NOT covered even with the name as data;
   (3) the R2b piece passes the card's text through as data: the hold adoption run with an invented key returns the
       approved sentence with only that key changed; a literal wrapped around the key in setLoads is refused.
   Red first: (1) on the today-entry.mjs of 0043823 (no R4 line), (3) on the round-1 native-load.cjs (it printed
   "no load" for a configuration). Every value is invented. */
const R4_COMPOSE = 'nameOf(refusal.lift) + ": " + NATIVE_LOAD_BODYWEIGHT_COPY.line';
const R4_NAMES = Object.freeze(['Zqxv Press', 'Wibble row 2', 'Chest press']);
const fxHoldKey = (key) => (c) => { for (const slot of c.session.record.entries[0].slots) slot.prescribed_load = { state: 'specified', source: { kind: 'configuration', configuration_key: key } }; return c; };
const DATA_KEY = 'Zqxv';
function holdDataOutput(nativeText, key) {
  const x = fxCase({ w: key }, [fxHoldKey(key)(fxC(1, { reps: FX_TOP, loads: 140, effort: fxE(2, 1, 1) }))]);
  try { return engineOutput(composeEngine(nativeText, x.comps.at(-1).date), x); } catch (error) { return ['THREW ' + String(error && error.message)]; }
}

test('CL-COMPOSED-DATA: the lift name and the card text are shown as data beside locked S14 copy; an unlisted literal is refused', () => {
  const { corpus } = loaded();
  const pieces = corpus.entries.map((e) => e.text);
  const failed = [];
  // (1) the product composes the R4 line from the lift name (data) and the one locked piece
  const entryText = fs.readFileSync(path.join(ROOT, S14_OWNER), 'utf8').replace(/\r\n?/g, '\n');
  const line = S14_NEW[0][0];
  if (entryText.split(R4_COMPOSE).length - 1 !== 1) failed.push('CL-COMPOSED-DATA-R4-COMPOSE ' + (entryText.split(R4_COMPOSE).length - 1));
  if (entryText.split('line: ' + JSON.stringify(line)).length - 1 !== 1) failed.push('CL-COMPOSED-DATA-R4-PIECE');
  if (!pieces.includes(line)) failed.push('CL-COMPOSED-DATA-R4-NOT-LOCKED');
  // (2) covered with the name as data; not covered without it; an unlisted literal is refused even with it
  for (const name of R4_NAMES) {
    const shown = name + ': ' + line;
    const rest = lock.uncovered(shown, pieces, [name]);
    if (rest !== '') failed.push('CL-COMPOSED-DATA-R4-UNLOCKED ' + JSON.stringify(shown) + ' ' + JSON.stringify(rest));
    const literal = name + ': ' + line.replace('are saved.', 'are kept safe.');
    if (lock.uncovered(literal, pieces, [name]) === '') failed.push('CL-COMPOSED-DATA-R4-LITERAL-PASSED ' + JSON.stringify(literal));
  }
  if (lock.uncovered('Zqxv Press: ' + line, pieces, []) === '') failed.push('CL-COMPOSED-DATA-BLIND (the name is not copy)');
  // (3) the R2b piece: the card's text is data, passed through unchanged, inside the approved words only
  const nativeText = fs.readFileSync(path.join(ROOT, NATIVE_LOAD), 'utf8');
  const want = ['Fx Press: on 2026-10-01 you completed every set at 140 lb on every set (the card said ' + DATA_KEY + ' on every set)' + FX_ADOPT_TAIL];
  const got = holdDataOutput(nativeText, DATA_KEY);
  if (JSON.stringify(got) !== JSON.stringify(want)) failed.push('CL-COMPOSED-DATA-R2B-KEY ' + JSON.stringify(got));
  const wrap = nativeText.replace(/\r\n?/g, '\n').split('? x.configuration_key :');
  if (wrap.length !== 2) failed.push('CL-COMPOSED-DATA-R2B-ANCHOR ' + (wrap.length - 1));
  else if (JSON.stringify(holdDataOutput(wrap.join("? 'card ' + x.configuration_key :"), DATA_KEY)) === JSON.stringify(want)) failed.push('CL-COMPOSED-DATA-R2B-LITERAL-PASSED');
  assert.deepEqual(failed, [], 'CL-COMPOSED-DATA');
});
