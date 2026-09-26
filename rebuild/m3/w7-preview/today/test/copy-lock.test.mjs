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
 *   CL-CLOSURE    every design.cjs list string and every mounted state string is in the corpus
 *
 * Added by the S11 reseal child (M2-S11-NATIVE-LOAD, brief rev6 2.3, Astra L1 B2, step T3l):
 *   CL-S11-DELTA  the S11 corpus is the sealed S10 corpus plus exactly the approved S11 copy: each
 *                 new piece with its one owner, count and approving ledger line (DECISIONS:798,
 *                 :842), the three sealed words today-entry.mjs newly carries re-owned, and the
 *                 rest serializing back to the S10 corpus bytes
 *   CL-ENGINE-COPY the approved native-load explanation templates (rebuild/engine, outside
 *                 SCAN_ROOTS, which stay unwidened) pinned byte for byte (D-S11R6-3; DECISIONS:804,
 *                 :842, :843); CL-ENGINE-COPY-TEETH shows a reworded or duplicated one is refused */
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
const CORPUS_SHA256 = '58dc7a743fc883af09537a6db7692ac008ae036cb18779333e97e2f504335f8c';
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

test('CL-S11-DELTA: the S11 corpus is the S10 corpus plus exactly the approved S11 copy, each with its owner and approval', () => {
  const { corpus } = loaded();
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
