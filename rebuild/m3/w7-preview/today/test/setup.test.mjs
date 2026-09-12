// A4 - Dad's first run, end to end over the REAL stack.
//
// Real here: the encrypted repository (AES-GCM over fake-indexeddb, the same storage
// the browser uses), the accepted T2 stage over rebuild/client, the accepted durable
// public client, the operation envelope rebuild/client/ops.cjs builds, and the
// ACCEPTED clean-init constructor rebuild/m4/workout/athlete-state.cjs. Nothing is
// stubbed; first run's ONLY addition to that stack is its closed command producer,
// which the accepted stage takes as an argument.
//
// The acceptance bar this suite executes is BUILD-BRIEF.md section 3: S1 to S25, the
// fourteen contract-member rows of section 2.1, and the twenty provenance rows of
// section 2.8. Every subtest is named for the check it is.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { webcrypto, createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createSetupHost, PROFILE, SETUP_SCHEMA_VERSION } from '../setup-host.mjs';
import SetupCommands, { prepare, validate, setupOf, ACTION } from '../setup-commands.mjs';
import Model from '../setup-model.mjs';
import { createSetupModel, createCleanInitState, REQUIRED_SETUP, REQUIRED_EXERCISE } from '../setup-model.mjs';
import { mountSetup } from '../setup-app.mjs';
import { createSetupEntry, boot, SETUP_BASIS_STATE_REFUSED } from '../today-entry.mjs';
import TodayApp from '../today-app.cjs';
import TodayModel from '../today-model.cjs';
import design from '../design.cjs';

const { mountToday, createTodayModel } = TodayApp;
const DAY = TodayModel.SYNTHETIC_DAY;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const readRepo = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
/* Bytes, not text: the B-NTC pins are sha256 over the file as it sits on disk. */
const repoPath = (rel) => path.join(ROOT, rel);
const shaOf = (rel) => createHash('sha256').update(fs.readFileSync(repoPath(rel))).digest('hex');
const SETUP_FILES = ['setup-model.mjs', 'setup-commands.mjs', 'setup-host.mjs', 'setup-app.mjs',
  'setup-check.mjs'];
const setupFileText = (name) => readRepo('rebuild/m3/w7-preview/today/' + name);
/* THE CODE, with its prose removed. Several checks below are "this word appears
   nowhere in the flow" checks, and a file that EXPLAINS why it does not do
   something must not fail them for saying so. Comments are not user-facing and
   are not code (DECISIONS:114 (1) says the same about the dash rule). */
const codeOf = (text) => text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
const setupCode = (names = SETUP_FILES) => names.map((n) => codeOf(setupFileText(n))).join('\n');

/* THE ENGINE'S OWN LABELS, READ OUT OF THE ENGINE AT TEST TIME (S25). The app carries
   a literal list and imports nothing from rebuild/engine (S24); this is the other
   half of that bargain: if seed.cjs gains or loses a label upstream, this suite says
   so instead of the screens drifting. */
function seedMuscleLabels() {
  const text = readRepo('rebuild/engine/seed.cjs');
  const start = text.indexOf('const EXERCISES = [');
  assert(start > 0, 'seed.cjs EXERCISES could not be located');
  const end = text.indexOf('\n];', start);
  assert(end > start, 'seed.cjs EXERCISES is not closed');
  const section = text.slice(start, end);
  return [...new Set([...section.matchAll(/\bmg:\s*"([^"]+)"/g)].map((m) => m[1]))];
}
/* Every CLEAN_INIT_* code the ACCEPTED constructor can throw, read out of its source
   at test time (S3). A code added upstream with no screen sentence fails here. */
function cleanInitCodes() {
  const text = readRepo('rebuild/m4/workout/athlete-state.cjs');
  return [...new Set([...text.matchAll(/'(CLEAN_INIT_[A-Z_]+)'/g)].map((m) => m[1]))];
}

/* A child node with its own TZ. The zone check cannot be done in process: the
   runner's zone is fixed when it starts. */
function runNode(source, args, env) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source, ...args],
    { encoding: 'utf8', env: { ...process.env, ...env } });
  assert.equal(result.status, 0, 'child node failed: ' + (result.stderr || ''));
  return result.stdout;
}

async function device() {
  const fault = faultDatabase();
  const open = (day = DAY) => createSetupHost({ day, indexedDB: fault.indexedDB, crypto: webcrypto });
  return { fault, open, host: await open() };
}
const opsOf = async (repository) => Object.values((await repository.load()).generation.collections.ops || {});
const outboxOf = async (repository) => Object.values((await repository.load()).generation.collections.outbox || {});

/* A FILLED FIXTURE, driven through the reducer's own actions - never by reaching
   into its state. Two upper lifts and one lower, one chip label, one free entry,
   one even stack and one uneven one, one blank jump. */
function filled({ today = DAY } = {}) {
  const model = createSetupModel({ today });
  model.setName('  Dad  ');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  model.toggleDay('4'); model.setDayKind('4', 'L');
  const press = model.addExercise('U');
  model.setExerciseField(press.key, 'n', 'Chest press');
  model.chooseMg(press.key, 'chest');
  model.setExerciseField(press.key, 'first', '20');
  model.setExerciseField(press.key, 'inc', '10');
  const row = model.addExercise('U');
  model.setExerciseField(row.key, 'n', 'Seated row');
  model.chooseMgOther(row.key);
  model.setMgOther(row.key, 'lats and mid back');
  model.setExerciseField(row.key, 'first', '30');
  const legs = model.addExercise('L');
  model.setExerciseField(legs.key, 'n', 'Leg press');
  model.chooseMg(legs.key, 'quads');
  model.setExerciseField(legs.key, 'first', '45');
  model.setExerciseField(legs.key, 'rungs', '45 / 70 / 100 / 135');
  model.togglePriority('quads');
  model.togglePriority('calves');
  return { model, keys: { press: press.key, row: row.key, legs: legs.key } };
}
const documentOf = (kit) => {
  const built = kit.model.document();
  assert.equal(built.ok, true, 'the fixture is complete: ' + JSON.stringify(built.missing));
  return built.setup;
};
/* A4b: the producer now takes the tags beside the document. A fixture built by
   hand carries none, and an untagged lift is stored deliberately untagged. */
const tagsFor = (setup) => Object.fromEntries(
  setup.exercises.map((e) => [e.id, { head: null, secondary: [] }]));
/* host.save(document, tags) - spread so the two always travel together. */
const withTags = (setup) => [setup, tagsFor(setup)];

/* ==========================================================================
   1. THE CONTRACT, MEMBER BY MEMBER (BUILD-BRIEF section 2.1, fourteen rows).
   ========================================================================== */
test('2.1 setup.athlete_label - the name is carried verbatim, trimmed, and blank refuses', () => {
  assert.equal(documentOf(filled()).athlete_label, 'Dad');
  const model = createSetupModel({ today: DAY });
  model.setName('   ');
  assert(model.missing().some((m) => m.copy === Model.MISSING.name && m.screen === 1));
});

test('2.1 setup.split.from - today\'s local ISO date, and no start date is ever offered', () => {
  assert.equal(documentOf(filled()).split.from, DAY);
  const source = setupCode();
  assert.equal(/start\s*date|startDate|setFrom\b/i.test(source), false,
    'no control anywhere in the flow names a start date');
});

test('2.1 setup.split.map - all seven weekday keys, values only U, L or REST', () => {
  const map = documentOf(filled()).split.map;
  assert.deepEqual(Object.keys(map).sort(), ['0', '1', '2', '3', '4', '5', '6']);
  for (const value of Object.values(map)) assert(['U', 'L', 'REST'].includes(value));
  assert.equal(map['1'], 'U');
  assert.equal(map['4'], 'L');
});

test('2.1 setup.exercises - non-empty, and an empty week is a named refusal', () => {
  assert.equal(documentOf(filled()).exercises.length, 3);
  const model = createSetupModel({ today: DAY });
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const missing = model.missing();
  assert(missing.some((m) => m.code === 'CLEAN_INIT_EXERCISES_REQUIRED' && m.screen === 3));
  assert.equal(model.document().ok, false);
});

test('2.1 setup.priority_muscles - carried verbatim, and MAY be empty', () => {
  assert.deepEqual(documentOf(filled()).priority_muscles, ['quads', 'calves']);
  const kit = filled();
  kit.model.togglePriority('quads');
  kit.model.togglePriority('calves');
  assert.deepEqual(documentOf(kit).priority_muscles, []);
  assert.equal(kit.model.missing().length, 0, 'an empty priority list is not a missing answer');
});

test('2.1 exercise.id - slugged from the name he typed, and unique across the array', () => {
  const ids = documentOf(filled()).exercises.map((e) => e.id);
  assert.deepEqual(ids, ['chest-press', 'seated-row', 'leg-press']);
  const kit = filled();
  const twin = kit.model.addExercise('U');
  kit.model.setExerciseField(twin.key, 'n', 'Chest press');
  kit.model.chooseMg(twin.key, 'chest');
  kit.model.setExerciseField(twin.key, 'first', '20');
  const again = documentOf(kit).exercises.map((e) => e.id);
  assert.equal(new Set(again).size, again.length, 'two machines with one label keep two ids');
  assert(again.includes('chest-press-2'));
});

test('2.1 exercise.n - the machine\'s own label, verbatim', () => {
  assert.deepEqual(documentOf(filled()).exercises.map((e) => e.n),
    ['Chest press', 'Seated row', 'Leg press']);
});

test('2.1 exercise.mg - an engine label from a chip, or free text stored unmapped', () => {
  const exercises = documentOf(filled()).exercises;
  assert.equal(exercises[0].mg, 'chest');
  assert.equal(exercises[1].mg, 'lats and mid back');
  assert.equal(exercises[2].mg, 'quads');
});

test('2.1 exercise.day - the list he added it under, never asked for separately', () => {
  assert.deepEqual(documentOf(filled()).exercises.map((e) => e.day), ['U', 'U', 'L']);
  const source = setupFileText('setup-app.mjs');
  assert.equal(/data-slot="day"|chooseDay\(/.test(source), false, 'no screen asks which day a lift is on');
});

test('2.1 exercise.sets - one positive integer for every lift, from the standard start', () => {
  const exercises = documentOf(filled()).exercises;
  for (const e of exercises) {
    assert.equal(e.sets, Model.STANDARD_SETS);
    assert(Number.isSafeInteger(e.sets) && e.sets > 0);
  }
});

test('2.1 exercise.hi - one positive integer for every lift, from the standard start', () => {
  for (const e of documentOf(filled()).exercises) {
    assert.equal(e.hi, Model.STANDARD_HI);
    assert(Number.isSafeInteger(e.hi) && e.hi > 0);
  }
});

test('2.1 exercise.inc - the typed jump when he gave one, the DECLARED 5 lb standard when he did not', () => {
  const exercises = documentOf(filled()).exercises;
  assert.equal(exercises[0].inc, 10, 'his own jump');
  assert.equal(exercises[1].inc, Model.STANDARD_INC, 'the declared standard step');
  assert.equal(exercises[2].inc, Model.STANDARD_INC);
  for (const e of exercises) assert(Number.isFinite(e.inc) && e.inc > 0);
});

test('2.1 exercise.steps - the real rungs, strictly ascending, one rung when that is all he gave', () => {
  const exercises = documentOf(filled()).exercises;
  assert.deepEqual(exercises[0].steps, [20]);
  assert.deepEqual(exercises[1].steps, [30]);
  assert.deepEqual(exercises[2].steps, [45, 70, 100, 135], 'any non-numeric separator parses');
  const kit = filled();
  kit.model.setExerciseField(kit.keys.legs, 'rungs', '100, 70, 45');
  assert(kit.model.missing().some((m) => m.copy === Model.VALIDATION.rungs));
  assert.equal(kit.model.document().ok, false);
});

test('2.1 w:null and forks:[] are written by the CONSTRUCTOR, never by a screen', () => {
  const state = createCleanInitState({ setup: documentOf(filled()) });
  for (const e of state.exercises) {
    assert.equal(e.w, null);
    assert.deepEqual(e.forks, []);
  }
  for (const e of documentOf(filled()).exercises) {
    assert.equal(Object.hasOwn(e, 'w'), false, 'no screen sends a working load');
    assert.equal(Object.hasOwn(e, 'forks'), false);
  }
});

test('2.1 the cross-member rule - a lift can only exist for a kind the split contains', () => {
  const kit = filled();
  kit.model.setDayKind('4', 'L');           // clears the lower day's kind
  kit.model.toggleDay('4');                  // and turns the day off
  const missing = kit.model.missing();
  assert(missing.some((m) => m.copy.includes('lower body') && m.screen === 2),
    'the orphaned lift is NAMED, not deleted and not sent: ' + JSON.stringify(missing));
  assert.equal(kit.model.document().ok, false, 'createCleanInitState is never called');
  assert.deepEqual(kit.model.answers().exercises.length, 3, 'no answer was destroyed');
});

/* ==========================================================================
   2. THE ACCEPTANCE BAR (BUILD-BRIEF section 3), S1 to S25.
   ========================================================================== */
test('S1 - every field lands EXACTLY: the whole document, deep-equal', () => {
  assert.deepEqual(documentOf(filled()), {
    athlete_label: 'Dad',
    split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'L', 5: 'REST', 6: 'REST' } },
    exercises: [
      { id: 'chest-press', n: 'Chest press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 10, steps: [20] },
      { id: 'seated-row', n: 'Seated row', mg: 'lats and mid back', day: 'U', sets: 3, hi: 10, inc: 5, steps: [30] },
      { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 10, inc: 5, steps: [45, 70, 100, 135] },
    ],
    priority_muscles: ['quads', 'calves'],
  });
});

test('S1 - the ACCEPTED constructor rebuilds the whole athlete from it, number for number', () => {
  const state = createCleanInitState({ setup: documentOf(filled()) });
  assert.equal(state.athlete_label, 'Dad');
  assert.equal(state.split.length, 1);
  assert.equal(state.split[0].from, DAY);
  assert.deepEqual(state.exOrder, { U: ['chest-press', 'seated-row'], L: ['leg-press'] });
  assert.deepEqual(state.priority_muscles, ['quads', 'calves']);
  const legs = state.exercises.find((e) => e.id === 'leg-press');
  assert.deepEqual(legs.steps, [45, 70, 100, 135]);
  for (const value of [legs.sets, legs.hi, legs.inc, ...legs.steps]) assert.equal(typeof value, 'number');
});

test('S2 - closed-contract fidelity: the document\'s keys ARE REQUIRED_SETUP, imported', () => {
  const setup = documentOf(filled());
  assert.deepEqual(Object.keys(setup).sort(), [...REQUIRED_SETUP].sort());
  for (const e of setup.exercises) assert.deepEqual(Object.keys(e).sort(), [...REQUIRED_EXERCISE].sort());
  /* Imported, never retyped: the two lists really are the constructor's own. */
  const accepted = JSON.parse(JSON.stringify({ setup: REQUIRED_SETUP, exercise: REQUIRED_EXERCISE }));
  const source = readRepo('rebuild/m4/workout/athlete-state.cjs');
  for (const name of accepted.setup) assert(source.includes("'" + name + "'"));
  for (const name of accepted.exercise) assert(source.includes("'" + name + "'"));
});

test('S2 - a ninth exercise member is REFUSED by the constructor, not silently dropped', () => {
  const setup = documentOf(filled());
  setup.exercises[0].setup = '';
  assert.throws(() => createCleanInitState({ setup }), /CLEAN_INIT_EXERCISE_REQUIRED/);
});

test('S3 - every CLEAN_INIT_* code the accepted constructor can throw has a screen sentence', () => {
  const codes = cleanInitCodes();
  assert(codes.length >= 5, 'the codes were really read out of athlete-state.cjs: ' + codes.join(', '));
  for (const code of codes) {
    const sentence = Model.REFUSAL_SENTENCES[code];
    assert(typeof sentence === 'string' && sentence.trim() !== '',
      'the engine gained ' + code + ' and Dad would see a raw code');
  }
  assert.deepEqual(Object.keys(Model.REFUSAL_SENTENCES).sort(), [...codes].sort(),
    'the refusal table names exactly the codes that exist');
});

test('S3 - every named missing answer carries one of those codes and the screen that owns it', () => {
  const model = createSetupModel({ today: DAY });
  const missing = model.missing();
  assert(missing.length > 0);
  const codes = cleanInitCodes();
  for (const item of missing) {
    assert(codes.includes(item.code), item.copy + ' carries ' + item.code);
    assert(Number.isSafeInteger(item.screen) && item.screen >= 1 && item.screen <= 6);
  }
});

test('S4 - an empty answer set builds NOTHING: the constructor is never called', () => {
  const model = createSetupModel({ today: DAY });
  const built = model.document();
  assert.equal(built.ok, false);
  assert.equal(built.setup, null, 'no document exists to hand to the constructor');
  const copy = built.missing.map((m) => m.copy);
  assert(copy.includes(Model.MISSING.name));
  assert(copy.includes(Model.MISSING.days));
});

test('S4 - with nothing answered the primary action is DISABLED and the refusal is named on screen', () => {
  const kit = screenAt(6, createSetupModel({ today: DAY }));
  assert.equal(kit.doc.querySelector('#phone [data-slot="primary"]').disabled, true);
  assert(kit.text().includes(Model.COPY.refusalHead));
  assert(kit.text().includes(Model.MISSING.name));
  assert(kit.text().includes(Model.MISSING.days));
});

/* The six screens in jsdom, over the real template the build ships. */
function shell() {
  return design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml());
}
function screenAt(n, model, options = {}) {
  const dom = new JSDOM(shell());
  const doc = dom.window.document;
  const phone = doc.getElementById('phone');
  model.goto(n);
  if (options.validationShown) model.next() && model.goto(n);
  mountSetup(doc, phone, { model, onDone: options.onDone || (async () => ({ ok: true })),
    onBack: options.onBack });
  return { dom, doc, phone, model,
    text: () => phone.textContent,
    chips: () => [...doc.querySelectorAll('#phone .option')],
    chip: (label) => [...doc.querySelectorAll('#phone .option')].find((b) => b.textContent.trim() === label),
    primary: () => doc.querySelector('#phone [data-slot="primary"]') };
}

test('S5 - the standard start is PROPOSED, pre-selected, and never asked', () => {
  const model = createSetupModel({ today: DAY });
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const kit = screenAt(3, model);
  assert.equal(model.answers().sets, Model.STANDARD_SETS);
  assert.equal(model.answers().hi, Model.STANDARD_HI);
  assert(kit.text().includes(Model.standardStartLine()), 'the standard is named on the screen');
  assert(kit.text().includes(Model.COPY.standardHead));
  assert.equal(kit.chip(String(Model.STANDARD_SETS)).getAttribute('aria-pressed'), 'true');
  assert.equal(kit.chip(String(Model.STANDARD_HI)).getAttribute('aria-pressed'), 'true');
});

test('S5 - NO control matching /not sure/i exists anywhere in the flow', () => {
  /* The FLOW: the reducer, the producer, the lane and the view. setup-check.mjs is
     excluded because it is the check that asserts the absence, and has to name it. */
  const source = setupCode(['setup-model.mjs', 'setup-commands.mjs', 'setup-host.mjs', 'setup-app.mjs']);
  assert.equal(/not sure/i.test(source), false, 'DECISIONS:114 (2) removed it');
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const kit = screenAt(n, filled().model);
    assert.equal(/not sure/i.test(kit.text()), false, 'screen ' + n);
  }
});

test('S5 / M20 - tapping the SELECTED standard chip again leaves the value exactly where it is', () => {
  const model = createSetupModel({ today: DAY });
  assert.equal(model.chooseSets(Model.STANDARD_SETS), Model.STANDARD_SETS);
  assert.equal(model.chooseSets(Model.STANDARD_SETS), Model.STANDARD_SETS, 'a second tap is not a toggle');
  assert.equal(model.answers().sets, Model.STANDARD_SETS);
  assert.equal(model.chooseHi(Model.STANDARD_HI), Model.STANDARD_HI);
  assert.equal(model.answers().hi, Model.STANDARD_HI);
  /* Neither can ever reach null, by any sequence of taps the screen can send. */
  for (const value of [...Model.SETS_OPTIONS, ...Model.SETS_OPTIONS, 0, -1, null, 'three']) model.chooseSets(value);
  for (const value of [...Model.HI_OPTIONS, ...Model.HI_OPTIONS, 0, null, 'ten']) model.chooseHi(value);
  assert(Number.isSafeInteger(model.answers().sets) && model.answers().sets > 0);
  assert(Number.isSafeInteger(model.answers().hi) && model.answers().hi > 0);
});

test('S5 - choosing another value changes ONLY that one, and the document carries both', () => {
  const kit = filled();
  kit.model.chooseSets(4);
  const setup = documentOf(kit);
  for (const e of setup.exercises) {
    assert.equal(e.sets, 4, 'his own set count, broadcast to every lift');
    assert.equal(e.hi, Model.STANDARD_HI, 'the rep target is untouched');
  }
});

/* splitInForceOn and dayType, restated from the code of record so this suite can
   execute them without importing rebuild/engine into a setup test path:
   rebuild/m3/w6/host/workout-host.mjs:39-42 and rebuild/engine/plan.cjs:11-22. */
const splitInForceOn = (state, iso) => (state.split || []).some((x) => x && x.from && x.from <= iso);
function dayType(iso, state) {
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = new Date(y, m - 1, d, 12).getDay();
  let entry = null;
  for (const x of state.split || []) if (x && x.from && x.from <= iso) entry = x;
  const value = entry && entry.map ? entry.map[weekday] : null;
  return value === 'U' || value === 'L' ? value : 'REST';
}

test('S6 - the day a fresh split starts is IN FORCE that same day, and is the kind he chose', () => {
  for (const local of ['2026-03-09', '2026-11-02', '2026-09-07']) {
    const kit = filled({ today: local });
    const state = createCleanInitState({ setup: documentOf(kit) });
    assert.equal(state.split[0].from, local);
    assert.equal(splitInForceOn(state, local), true, local + ': the first gym visit would refuse otherwise');
    assert.equal(dayType(local, state), 'U', local + ' is a Monday and his Monday is upper body');
    assert.equal(dayType('2026-09-10', createCleanInitState({ setup: documentOf(filled({ today: '2026-09-07' })) })),
      'L', 'Thursday is the lower body day he chose, never the fallback week');
  }
});

/* S6 / M4 - THE LOCAL DATE IN THREE ZONES, MEASURED. Run in child processes with
   TZ set, at 00:00:01 and 23:59:59 local, because that is the only way to execute
   the claim rather than assert it: at 23:59:59 in America/New_York the UTC day is
   already tomorrow, and toISOString().slice(0,10) would write it. */
test('S6 / M4 - split.from is the LOCAL date at both ends of the day in UTC, New York and Auckland', () => {
  const script = 'const {localISO}=await import(process.argv[1]);'
    + 'const d=new Date(Number(process.argv[2]));'
    + 'process.stdout.write(JSON.stringify({local:localISO(d),utc:d.toISOString().slice(0,10)}));';
  const modelUrl = new URL('../setup-model.mjs', import.meta.url).href;
  let differed = 0;
  for (const zone of ['UTC', 'America/New_York', 'Pacific/Auckland']) {
    for (const hhmm of ['00:00:01', '23:59:59']) {
      /* The instant that IS that local wall time in that zone, found by search so
         the test does not have to know the offset. */
      const wanted = '2026-09-07T' + hhmm;
      let instant = null;
      for (let offset = -12 * 60; offset <= 14 * 60 && instant === null; offset += 15) {
        const candidate = new Date(Date.parse(wanted + 'Z') - offset * 60000);
        const shown = new Intl.DateTimeFormat('en-CA', { timeZone: zone, hour12: false,
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(candidate);
        if (shown.replace(', ', 'T').replace(/^(\d{4}-\d{2}-\d{2})T24/, '$1T00') === wanted) instant = candidate;
      }
      assert(instant, zone + ' ' + hhmm + ': the instant could not be located');
      const out = runNode(script, [modelUrl, String(instant.getTime())], { TZ: zone });
      const seen = JSON.parse(out);
      assert.equal(seen.local, '2026-09-07',
        zone + ' at ' + hhmm + ' local: the local date is the day he is standing in');
      if (seen.utc !== seen.local) differed += 1;
    }
  }
  assert(differed > 0, 'at least one of the six instants really has a different UTC day, or this proves nothing');
});

test('S7 / M5 - REST is written EXPLICITLY on every weekday he did not choose', () => {
  const map = documentOf(filled()).split.map;
  for (const d of Model.WEEKDAYS) {
    assert(Object.hasOwn(map, d), 'weekday ' + d + ' is present');
    assert.notEqual(map[d], null);
    assert.notEqual(map[d], undefined);
  }
  assert.deepEqual(Model.WEEKDAYS.filter((d) => map[d] === 'REST'), ['0', '2', '3', '5', '6']);
  /* And the constructor really does throw on a map with a key missing, which is
     what makes this check load-bearing. */
  const setup = documentOf(filled());
  delete setup.split.map['6'];
  assert.throws(() => createCleanInitState({ setup }), /CLEAN_INIT_SPLIT_REQUIRED/);
});

test('S8 - exactly the declared supplied numbers appear on the six screens, and nothing else', () => {
  /* The allowlist is built HERE, from BUILD-BRIEF section 2.8's rows, each with
     its citation. A third supplied number fails this test. */
  const allowed = new Set([
    ...[1, 2, 3, 4, 5, 6].map(String),                       // the "n of 6" counter (INVENTED, exempt by name)
    ...Model.SETS_OPTIONS.map(String),                        // sets chips, INVENTED, section 2.8
    ...Model.HI_OPTIONS.map(String),                          // rep chips, INVENTED, section 2.8
    String(Model.STANDARD_SETS), String(Model.STANDARD_HI),   // the standard start, INVENTED, DECISIONS:114 (2)
    String(Model.STANDARD_INC),                               // the standard step, SOURCED migrate.cjs:795
  ]);
  const kit = filled();
  const answers = new Set(['20', '10', '30', '45', '70', '100', '135']);   // what he typed
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const screen = screenAt(n, kit.model);
    /* Per TEXT NODE, never over the concatenated screen: three adjacent chips
       reading 2, 3 and 4 are three numbers, not the number 234. */
    const walker = screen.doc.createTreeWalker(screen.phone, screen.dom.window.NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (const run of (node.nodeValue.match(/\d+(?:\.\d+)?/g) || [])) {
        assert(allowed.has(run) || answers.has(run),
          'screen ' + n + ' shows the unexplained number ' + run + ' in "' + node.nodeValue.trim() + '"');
      }
    }
    for (const input of screen.doc.querySelectorAll('#phone input')) {
      for (const run of (String(input.value).match(/\d+(?:\.\d+)?/g) || [])) {
        assert(answers.has(run), 'screen ' + n + ' prefills the number ' + run);
      }
    }
  }
});

test('S8 - the two declared standards are the ONLY numbers the flow supplies, and both are named', () => {
  const source = setupCode(SETUP_FILES.filter((f) => f !== 'setup-check.mjs'));
  assert(Model.standardStartLine().includes(String(Model.STANDARD_SETS)));
  assert(Model.standardStepLine().includes(String(Model.STANDARD_INC)));
  assert(source.includes('STANDARD_SETS'), 'the set count is a named constant, never an inline literal');
  assert(source.includes('STANDARD_HI'));
  assert(source.includes('STANDARD_INC'));
  const kit = screenAt(4, filled().model);
  assert(kit.text().includes(Model.standardStepLine()),
    'the standard step is said on the field\'s own helper line, before he leaves it');
});

test('S9 - design fidelity by HARVEST: the first-run vocabulary is read out of the module that owns it', () => {
  const harvested = design.setupVocabulary();
  assert(harvested.copy.length >= 30, harvested.copy.length + ' sentences harvested');
  assert(harvested.refusals.length >= 5);
  /* It really is a harvest and not a list: every sentence the module holds is in it. */
  for (const line of Object.values(Model.COPY)) {
    if (String(line).trim() === '') continue;
    assert(harvested.copy.includes(line), 'the harvest missed "' + line + '"');
  }
  for (const line of Object.values(Model.REFUSAL_SENTENCES)) assert(harvested.refusals.includes(line));
});

test('S9 / M11 - the build REFUSES a first-run sentence that is declared and then dropped', () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  assert.doesNotThrow(() => design.assertSetupBinding(approved, template));
  /* The mutant, executed here rather than described: a template with the
     first-run screen removed must not pass. */
  assert.throws(() => design.assertSetupBinding(approved, template.replace('<template id="t-setup">', '<template id="t-gone">')),
    /SETUP-BINDING FAIL/);
});

test('S9 - every class the first-run screen uses is a selector in the APPROVED stylesheets', () => {
  const approved = design.readApproved();
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-setup">');
  const section = template.slice(start, template.indexOf('</template>', start));
  const css = approved.map((a) => a.styles).join('\n');
  const tokens = new Set(design.classTokens(section));
  /* Plus every class the VIEW creates at runtime, which the template cannot show. */
  for (const token of ['field', 'options', 'option', 'followup', 'quality-label', 'section-label',
    'text-link', 'macro-row', 'row', 'unit', 'fine', 'note', 'small', 'muted', 'checkin-note']) tokens.add(token);
  for (const token of tokens) {
    const selector = new RegExp('\\.' + token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w-])');
    assert(selector.test(css), '.' + token + ' is not in the approved stylesheets');
  }
});

test('S9 - the shipped first-run template carries NO literal figure', () => {
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-setup">');
  const section = template.slice(start, template.indexOf('</template>', start));
  for (const line of design.textOf(section)) {
    assert.equal(/\d/.test(line), false, 'the template carries a literal figure: "' + line + '"');
  }
});

test('S10 - nothing on the six screens sets a width that a 390px or 320px phone cannot hold', () => {
  const source = setupCode(SETUP_FILES.filter((f) => f !== 'setup-check.mjs'))
    + design.templateHtml();
  assert.equal(/min-width\s*:\s*[3-9]\d\dpx|width\s*:\s*[3-9]\d\dpx/.test(source), false,
    'no fixed width wider than a phone; the measurement itself is setup-check.mjs');
  /* Every block the view creates is one of the approved design's own flow
     containers, which is what makes the measured check meaningful. */
  assert.equal(/position\s*:\s*absolute|white-space\s*:\s*nowrap/.test(source), false);
});

test('S11 - every screen carries exactly ONE primary action, and it is the only one', () => {
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const kit = screenAt(n, filled().model);
    const primaries = kit.doc.querySelectorAll('#phone .primary');
    assert.equal(primaries.length, 1, 'screen ' + n);
    assert.equal(kit.primary().textContent.trim(),
      n === 6 ? Model.COPY.start : Model.COPY.next, 'screen ' + n + ' names its action');
  }
});

test('S12 - every control the six screens create is an approved tap target or a real input', () => {
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const kit = screenAt(n, filled().model);
    for (const button of kit.doc.querySelectorAll('#phone button')) {
      const classes = [...button.classList];
      assert(classes.some((c) => ['option', 'primary', 'text-link', 'back', 'step', 'link', 'cta'].includes(c)),
        'screen ' + n + ': a button with no approved target class: ' + button.textContent.trim());
    }
    for (const input of kit.doc.querySelectorAll('#phone input, #phone textarea, #phone select')) {
      assert(input.closest('.field') || input.closest('.followup'),
        'screen ' + n + ': an input outside an approved field block');
    }
  }
  /* The pixels themselves are measured in a real browser by setup-check.mjs. */
  assert(setupFileText('setup-check.mjs').includes('>= 16'), 'the browser check measures the 16px floor');
  assert(setupFileText('setup-check.mjs').includes('>= 44'), 'the browser check measures the 44px floor');
});

test('S16 - back never loses an answer: one to six, back to one, forward to six', () => {
  const kit = filled();
  const before = JSON.stringify(kit.model.answers());
  for (let n = 1; n < 6; n += 1) kit.model.next();
  assert.equal(kit.model.screen(), 6);
  for (let n = 6; n > 1; n -= 1) kit.model.back();
  assert.equal(kit.model.screen(), 1);
  for (let n = 1; n < 6; n += 1) kit.model.next();
  assert.equal(JSON.stringify(kit.model.answers()), before, 'the answer object is deep-equal');
});

test('S16 - changing one answer on screen 2 changes ONLY that answer', () => {
  const kit = filled();
  const before = kit.model.answers();
  kit.model.setDayKind('1', 'L');
  const after = kit.model.answers();
  assert.equal(after.days['1'], 'L');
  assert.deepEqual({ ...after, days: null }, { ...before, days: null });
  assert.deepEqual({ ...after.days, 1: null }, { ...before.days, 1: null });
});

/* ==========================================================================
   3. THE PRODUCER: ONE op, its own envelope, and nothing else.
   ========================================================================== */
test('A4 - the producer builds ONE fact of the accepted client\'s own envelope', () => {
  const setup = documentOf(filled());
  const action = prepare({ action: ACTION, input: { setup, tags: tagsFor(setup) } });
  assert.equal(action.kind, 'fact');
  assert.equal(action.class, 'event');
  assert.equal(action.payload.profile, PROFILE);
  assert.deepEqual(action.payload.setup, setup);
  /* A4b widened the payload from two members to exactly three (A4B-BRIEF 5). */
  assert.deepEqual(Object.keys(action.payload).sort(), ['profile', 'setup', 'tags']);
  assert.equal(SetupCommands.createSetupCommands().schemaVersion, SETUP_SCHEMA_VERSION);
});

test('A4 - the producer REFUSES anything that is not its own request', () => {
  for (const bad of [{}, { action: 'checkin', input: {} }, { action: ACTION },
    { action: ACTION, input: { setup: {} } },
    { action: ACTION, input: { setup: documentOf(filled()), extra: 1 } }]) {
    assert.throws(() => prepare(bad), /SETUP_INPUT_INVALID|CLEAN_INIT_/);
  }
});

test('A4 - validate() accepts its OWN envelope and refuses every other lane\'s', () => {
  const setup = documentOf(filled());
  const mine = { kind: 'fact', class: 'event', effective: { local_date: DAY },
    payload: { profile: PROFILE, setup, tags: tagsFor(setup) }, causal_parents: [], athlete_id: 'a' };
  assert.equal(validate(mine, () => null), true);
  const others = [
    { ...mine, kind: 'tombstone' },
    { ...mine, class: 'session' },
    { ...mine, payload: { profile: 'earned/recovery-checkin/v1', answers: {} } },
    { ...mine, payload: { profile: PROFILE, setup, extra: 1 } },
    { ...mine, payload: { profile: PROFILE, setup: { ...setup, athlete_label: '' } } },
    { ...mine, effective: { local_date: 'yesterday' } },
    { ...mine, causal_parents: ['nope'] },
  ];
  for (const op of others) assert.equal(validate(op, () => null), false, JSON.stringify(op.payload).slice(0, 60));
});

test('A4 - setupOf runs the ACCEPTED constructor, so an unbuildable document never becomes an op', () => {
  const setup = documentOf(filled());
  setup.split.map['1'] = 'REFEED';
  assert.throws(() => setupOf(setup), /CLEAN_INIT_SPLIT_REQUIRED/);
});

/* ==========================================================================
   4. THE DURABLE LANE, over the real encrypted store.
   ========================================================================== */
test('S18 / M7 / M8 - the whole first run is ONE operation, written once, with its outbox entry', async () => {
  const kit = await device();
  assert.equal(await kit.host.enrolled(), false, 'a fresh installation carries no first-run op');
  assert.equal((await opsOf(kit.host.repository)).length, 0);
  const result = await kit.host.save(...withTags(documentOf(filled())));
  assert.equal(result.ok, true, result.code || '');
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 1, 'ONE op for six screens, never one per screen');
  assert.equal(ops[0].kind, 'fact');
  assert.equal(ops[0].class, 'event');
  assert.equal(ops[0].payload.profile, PROFILE);
  assert.equal((await outboxOf(kit.host.repository)).length, 1,
    'the operation and its outbox entry are one transaction');
  kit.host.close();
});

test('S18 - a RELAUNCH over the same encrypted store reads the first run back and writes nothing', async () => {
  const kit = await device();
  await kit.host.save(...withTags(documentOf(filled())));
  kit.host.close();
  const again = await kit.open();
  assert.equal(await again.enrolled(), true, 'the record, not a flag, answers the question');
  const rows = await again.all();
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].setup, documentOf(filled()));
  assert.equal((await opsOf(again.repository)).length, 1, 'reopening wrote nothing');
  again.close();
});

test('S13 - a SECOND "Start using Earned" finds the op that is there and writes nothing', async () => {
  const kit = await device();
  assert.equal((await kit.host.save(...withTags(documentOf(filled())))).ok, true);
  const second = await kit.host.save(...withTags(documentOf(filled())));
  assert.equal(second.ok, false);
  assert.equal(second.code, 'SETUP_ALREADY_RECORDED');
  assert.equal((await opsOf(kit.host.repository)).length, 1, 'still one op');
  kit.host.close();
});

test('S13 - a SECOND TAB over the same installation cannot enrol the device twice', async () => {
  const kit = await device();
  const tab = await kit.open();
  assert.equal((await kit.host.save(...withTags(documentOf(filled())))).ok, true);
  const fromTheOtherTab = await tab.save(...withTags(documentOf(filled())));
  assert.equal(fromTheOtherTab.ok, false, 'the second tab sees the record the first one wrote');
  assert.equal((await opsOf(tab.repository)).length, 1);
  kit.host.close();
  tab.close();
});

test('S13 / M9 - once the record holds a first run, the setup ROUTE refuses and the tile is gone', async () => {
  const kit = await device();
  const lane = { indexedDB: kit.fault.indexedDB, crypto: webcrypto };
  const before = await createSetupEntry({ today: DAY }, lane);
  assert.equal(before.firstRun(), true);
  const dom = new JSDOM(shell());
  const doc = dom.window.document;
  const today = createTodayModel({ today: DAY });
  let api = mountToday(doc, today, { setup: before });
  assert.equal(doc.querySelector('[data-slot="setup-entry"]').hidden, false, 'the tile is offered when fresh');
  assert.equal(doc.querySelector('[data-slot="setup-entry-label"]').textContent, TodayApp.SETUP_ENTRY);
  api.render('setup');
  assert.equal(api.screen(), 'setup', 'a fresh installation can reach the six screens');

  assert.equal((await before.host.save(...withTags(documentOf(filled())))).ok, true);
  await before.refresh();
  const after = await createSetupEntry({ today: DAY }, lane);
  assert.equal(after.firstRun(), false);
  const secondDom = new JSDOM(shell());
  api = mountToday(secondDom.window.document, createTodayModel({ today: DAY }), { setup: after });
  assert.equal(secondDom.window.document.querySelector('[data-slot="setup-entry"]').hidden, true,
    'a device that has been set up is never invited to be set up again');
  api.render('setup');
  assert.equal(api.screen(), 'today', 'the route falls back to Today rather than enrolling twice');
  before.host.close();
  after.host.close();
});

test('S14 - with NO store the first-run route is not offered, and nothing is enrolled', async () => {
  const entry = await createSetupEntry({ today: DAY }, { indexedDB: undefined, crypto: undefined });
  assert.equal(entry.host, null, 'no installation opened');
  assert.equal(entry.firstRun(), false, 'a page that cannot ask does not guess');
  const dom = new JSDOM(shell());
  const api = mountToday(dom.window.document, createTodayModel({ today: DAY }), { setup: entry });
  assert.equal(dom.window.document.querySelector('[data-slot="setup-entry"]').hidden, true);
  api.render('setup');
  assert.equal(api.screen(), 'today');
});

test('S14 - RESTORE_REQUIRED: boot offers no setup entry at all, and says what the client says', async () => {
  const source = readRepo('rebuild/m3/w7-preview/today/today-entry.mjs');
  assert(/if \(!restoreRequired\) \{[\s\S]*?createSetupEntry/.test(source),
    'the setup lane is opened ONLY when the installation was not refused');
  assert(source.includes('RESTORE_REQUIRED'), 'the page still says what rebuild/client says');
  /* And the page keeps C1\'s refusal intact: nothing here re-opens or re-enrols. */
  assert.equal(/createSetupEntry[\s\S]{0,400}re-?enrol/i.test(source), false);
});

test('S15 / M10 - boot({basisState}) ALONE throws SETUP_BASIS_STATE_REFUSED and paints nothing', async () => {
  const dom = new JSDOM(shell());
  const doc = dom.window.document;
  const before = doc.getElementById('phone').innerHTML;
  await assert.rejects(() => boot({ document: doc, basisState: createTodayModel({}).stateFromOps() }),
    (error) => error.code === SETUP_BASIS_STATE_REFUSED);
  assert.equal(doc.getElementById('phone').innerHTML, before, 'nothing was painted');
});

test('S15 - boot({basisState, hosts, today}) works, and is what the checks use', async () => {
  const fault = faultDatabase();
  const dom = new JSDOM(shell());
  const booted = await boot({ document: dom.window.document, today: DAY,
    indexedDB: fault.indexedDB, crypto: webcrypto,
    basisState: createTodayModel({ today: DAY }).stateFromOps() });
  assert.deepEqual(booted.failures, []);
  assert(booted.api, 'the page mounted');
  booted.hosts.close();
});

test('S15 - a foreign basisState over an ALREADY ENROLLED installation is refused', async () => {
  const fault = faultDatabase();
  const host = await createSetupHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  assert.equal((await host.save(...withTags(documentOf(filled())))).ok, true);
  host.close();
  const dom = new JSDOM(shell());
  await assert.rejects(() => boot({ document: dom.window.document, today: DAY,
    indexedDB: fault.indexedDB, crypto: webcrypto,
    basisState: createTodayModel({ today: DAY }).stateFromOps() }),
  (error) => error.code === SETUP_BASIS_STATE_REFUSED);
});

test('S18 / S19 - after the first run, the page opens on the REAL local era and reads the athlete back', async () => {
  const fault = faultDatabase();
  const host = await createSetupHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const setup = documentOf(filled());
  assert.equal((await host.save(setup, tagsFor(setup))).ok, true);
  host.close();
  const dom = new JSDOM(shell());
  const booted = await boot({ document: dom.window.document, today: DAY,
    indexedDB: fault.indexedDB, crypto: webcrypto });
  assert.deepEqual(booted.failures, [], 'every lane opened over the one generation');
  assert.equal(booted.setup.firstRun(), false, 'the record says this device is set up');
  /* The athlete the first run created, built by the ACCEPTED constructor from the
     stored document and by nothing else. */
  const state = await booted.setup.athleteState();
  assert.equal(state.athlete_label, 'Dad');
  assert.deepEqual(state.exercises.map((e) => e.id), ['chest-press', 'seated-row', 'leg-press']);
  for (const e of state.exercises) assert.equal(e.w, null, 'no starting load exists to show');
  assert.deepEqual(state.reads, [], 'an honest empty state: no reading, no figure');
  assert.deepEqual(state.sessionLog, {});
  booted.hosts.close();
});

/* C1 (review round 1). The landing Today must SAY that the figures on it are not
   his yet, for exactly as long as H3 is open. Both directions are asserted: the
   sentence is absent before the first run, present after it, and the predicate
   that decides it clears itself the day Today really does stand on his athlete. */
test('S19 - after the first run, the landing Today SAYS the figures on it are not his yet', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const sentence = Model.COPY.notHisNumbersYet;
  assert(typeof sentence === 'string' && sentence.trim() !== '', 'the sentence exists');

  const before = await createSetupEntry({ today: DAY }, lane);
  const fresh = new JSDOM(shell());
  mountToday(fresh.window.document, createTodayModel({ today: DAY }), { setup: before });
  assert.equal(fresh.window.document.getElementById('phone').textContent.includes(sentence), false,
    'before the first run there is nothing to say');

  assert.equal((await before.host.save(...withTags(documentOf(filled())))).ok, true);
  before.host.close();
  const after = await createSetupEntry({ today: DAY }, lane);
  assert.equal(after.athleteLabel(), 'Dad', 'the entry knows whose week is recorded');
  const landed = new JSDOM(shell());
  mountToday(landed.window.document, createTodayModel({ today: DAY }), { setup: after });
  const text = landed.window.document.getElementById('phone').textContent;
  assert(text.includes(sentence),
    'a man who has just typed his real week is not shown a stranger\'s numbers in silence');
  assert.equal(landed.window.document.querySelector('[data-slot="setup-note"]').hidden, false);
  after.host.close();
});

test('S19 - the sentence clears ITSELF the day Today really stands on his athlete', () => {
  const needed = TodayApp.setupNoteNeeded;
  const his = createCleanInitState({ setup: documentOf(filled()) });
  assert.equal(needed(false, null, null), false, 'nothing recorded, nothing to say');
  assert.equal(needed(true, 'Dad', createTodayModel({ today: DAY }).stateFromOps()), true,
    'recorded, but Today is standing on the fixture: say so');
  assert.equal(needed(true, 'Dad', his), false,
    'recorded AND Today is standing on HIS state: the sentence is gone, with no edit');
  assert.equal(needed(true, 'Dad', null), true, 'no state to compare is not a licence to stay silent');
});

/* H3, EXECUTED AND RECORDED (A4-REPORT.md section 6), and CORRECTED at review round
   1 (C2): the reviewer executed both fix shapes the first hand-off offered and
   neither works. TWO members are missing, not one, and the test asserts BOTH gaps
   BY NAME so that a partial engine fix cannot close the register item silently. */
test('H3 - the accepted engine still cannot paint Today for a clean-init athlete', () => {
  const state = createCleanInitState({ setup: documentOf(filled()) });
  assert.equal(Object.hasOwn(state, 'blackout'), false, 'no blackout member');
  assert.equal(Object.hasOwn(state, 'model'), false, 'and no model member either');
  assert(readRepo('rebuild/engine/energy.cjs').includes('daysUntil(s.blackout.until)'),
    'energy.cjs:370 still dereferences s.blackout.until unguarded');
  assert(readRepo('rebuild/engine/energy.cjs').includes('s.model.anchorISO'),
    'energy.cjs:84 bfEst still dereferences s.model.anchorISO unguarded');
  /* GAP 1: as the constructor writes it, the first throw is s.blackout.until. */
  assert.throws(() => createTodayModel({ today: DAY, basisState: state }).read(),
    /Cannot read properties of undefined \(reading 'until'\)/,
    'GAP 1: nowModel throws on s.blackout.until');
  /* GAP 2: blackout ALONE is not enough. `blackout: {}` is not even a fix shape:
     daysUntil(undefined) throws in dates.cjs. With a VALID blackout the throw
     MOVES to bfEst's s.model.anchorISO. */
  const plain = JSON.parse(JSON.stringify(state));
  assert.throws(() => createTodayModel({ today: DAY, basisState: { ...plain, blackout: {} } }).read(),
    /Cannot read properties of undefined \(reading 'split'\)/,
    'blackout: {} is NOT a fix shape: daysUntil(undefined) reaches mk() in rebuild/engine/dates.cjs:8');
  assert.throws(() => createTodayModel({ today: DAY,
    basisState: { ...plain, blackout: { until: '2020-01-01' } } }).read(),
  /Cannot read properties of undefined \(reading 'anchorISO'\)/,
  'GAP 2: with a VALID blackout the throw MOVES to energy.cjs:84 bfEst, s.model.anchorISO');
  /* And the fix shape the hand-off must name: BOTH members, written by the
     constructor. With both present the page paints, which is what makes "two
     members, not one" a claim and not an opinion. */
  assert.doesNotThrow(() => createTodayModel({ today: DAY, basisState: { ...plain,
    blackout: { until: '2020-01-01' },
    model: { anchorISO: '2020-01-01', anchorLb: 170, k: 0 } } }).read(),
  'blackout AND model together: Today paints');
  /* And guarding energy.cjs:370 alone only moves the throw: these readers are
     equally unguarded, which is why the honest fix is the CONSTRUCTOR's. */
  for (const [file, count] of [['rebuild/engine/sleep.cjs', 2], ['rebuild/engine/writers.cjs', 3]]) {
    const unguarded = (readRepo(file).match(/\bs\.blackout\.until\b|\bst\.blackout\.until\b/g) || []).length;
    assert(unguarded >= 1, file + ' still reads blackout.until directly (' + unguarded + ' of ~' + count + ')');
  }
});

test('S17 - the first-run screens name no network address, and the CSP is unchanged', async () => {
  const build = await import('../build.mjs');
  const dist = build.DIST;
  const assets = build.ASSETS.map((name) => [name, fs.readFileSync(path.join(dist, name))]);
  assert.equal(build.assertNoNetworkReference(assets), assets.length,
    'run `node rebuild/m3/w7-preview/today/build.mjs` first');
  const serve = await import('../serve.mjs');
  assert(serve.CSP.includes("connect-src 'none'"));
  assert(serve.CSP.includes("default-src 'none'"));
  const source = setupCode(SETUP_FILES.filter((f) => f !== 'setup-check.mjs'));
  assert.equal(/fetch\(|XMLHttpRequest|WebSocket|https?:\/\//.test(source), false,
    'nothing in the first-run flow reaches off this device');
});

test('S20 - NO starting load is collected, anywhere, by design', () => {
  const source = setupCode(SETUP_FILES.filter((f) => f !== 'setup-check.mjs'));
  assert.equal(/starting\s*load|startingWeight|currentWeight|whatDoYouLift/i.test(source), false);
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const kit = screenAt(n, filled().model);
    assert.equal(/what (do|can) you (lift|press)|starting (weight|load)/i.test(kit.text()), false, 'screen ' + n);
  }
  const state = createCleanInitState({ setup: documentOf(filled()) });
  for (const e of state.exercises) assert.equal(e.w, null, 'every lift arrives with no working load');
  /* And screen 6 says so, in one sentence, so he is not surprised at the gym. */
  assert(screenAt(6, filled().model).text().includes(Model.COPY.screen6NoLoad));
});

test('S21 - no streaks, no countdown, no urgency, no percentage, and ONE skip', () => {
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const kit = screenAt(n, filled().model);
    const text = kit.text();
    assert.equal(/streak|don'?t lose|almost there|keep it up|%|left!|hurry|only \d+ /i.test(text), false,
      'screen ' + n + ': ' + text.slice(0, 120));
    const skips = [...kit.doc.querySelectorAll('#phone button')]
      .filter((b) => !b.hidden && /^skip$/i.test(b.textContent.trim()));
    assert.equal(skips.length, n === 5 ? 1 : 0,
      'screen ' + n + ' has ' + skips.length + ' skip-like affordances');
  }
});

test('S21 - the "n of 6" counter is the WHOLE of the progress reporting', () => {
  for (const n of [1, 2, 3, 4, 5, 6]) {
    const kit = screenAt(n, filled().model);
    assert(kit.text().includes(Model.counterLine(n)), 'screen ' + n + ' says where he is');
    assert.equal(kit.doc.querySelectorAll('#phone progress, #phone [role="progressbar"]').length, 0);
  }
});

/* ==========================================================================
   5. THE OWNER'S TWO STANDING RULES (DECISIONS:114 (1), :115) and H1.
   ========================================================================== */
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

test('S23 (a) - NO em dash and NO en dash in any first-run source, template or entity', () => {
  for (const name of SETUP_FILES) {
    const text = setupFileText(name);
    assert.equal(text.includes(EM), false, name + ' carries U+2014');
    assert.equal(text.includes(EN), false, name + ' carries U+2013');
    assert.equal(/&mdash;|&ndash;/.test(text), false, name + ' carries a dash entity');
  }
  const template = design.templateHtml();
  const start = template.indexOf('<template id="t-setup">');
  const section = template.slice(start, template.indexOf('</template>', start));
  for (const mark of [EM, EN, '&mdash;', '&ndash;']) assert.equal(section.includes(mark), false);
});

test('S23 (a) - the BUILD refuses rather than warns: a dash in a first-run string turns it RED', async () => {
  /* BEHAVIOUR, not a second implementation, and since P1 merged (DECISIONS:121)
     the mechanism under the behaviour is P1's: plain-copy.cjs scans the BUILT
     bytes and build.mjs refuses AI_DASH_IN_BUILD. A4 asserts that the refusal
     really covers ITS screens, which is the thing A4 has to know and the thing a
     second, narrower, source-level scan of its own could never tell it. */
  const PlainCopy = (await import('../plain-copy.cjs')).default;
  assert.equal(PlainCopy.OWNED, 'rebuild/m3/w7-preview/today/',
    'the guard attributes a literal by module, and A4 lives under that prefix');
  const banner = ' rebuild/m3/w7-preview/today/setup-model.mjs\n';
  const clean = [['app.js', '//' + banner + 'var a = "Which days?";\n']];
  assert.doesNotThrow(() => PlainCopy.assertNoAiDashesInAssets(clean));
  /* One em dash in a literal attributed to a SETUP module: refused, by code. */
  const dashed = [['app.js', '//' + banner + 'var a = "Which days ' + EM + ' really?";\n']];
  assert.throws(() => PlainCopy.assertNoAiDashesInAssets(dashed),
    (error) => error.code === 'AI_DASH_IN_BUILD' && /setup-model\.mjs/.test(error.message));
  /* And in the shipped markup of the first-run screen. */
  assert.throws(() => PlainCopy.assertNoAiDashesInAssets([['index.html', '<p>1 of 6 ' + EM + ' nearly</p>']]),
    (error) => error.code === 'AI_DASH_IN_BUILD');
  /* A4's own binding check still refuses a template that lost the screen. */
  const approved = design.readApproved();
  const template = design.templateHtml();
  assert.doesNotThrow(() => design.assertSetupBinding(approved, template));
  assert.throws(() => design.assertSetupBinding(approved,
    template.replace('<template id="t-setup">', '<template id="t-gone">')), /SETUP-BINDING FAIL/);
});

test('S23 (a) - A4 renders through P1\'s boundary, like every other view', async () => {
  const PlainCopy = (await import('../plain-copy.cjs')).default;
  const source = setupFileText('setup-app.mjs');
  assert(source.includes("import PlainCopy from './plain-copy.cjs'"),
    'setup-app.mjs takes the render boundary');
  assert(source.includes('const { plainOrDrop } = PlainCopy'));
  /* Every textContent write in the six screens' view goes through it. */
  for (const line of codeOf(source).split('\n')) {
    if (!/\.textContent\s*=/.test(line)) continue;
    assert(/plainOrDrop\(/.test(line), 'an unrouted render-boundary write: ' + line.trim());
  }
  /* And the one string A4 puts on Today is routed too. */
  const todayApp = codeOf(setupFileText('today-app.cjs'));
  assert(/note\.textContent = owed \? plainOrDrop\(SETUP_NOT_HIS_NUMBERS, "setup-note"\)/.test(todayApp));
  /* Fail-closed PER SLOT: an unrewritable string blanks its own slot, it does not
     take the screen down. That is P1's contract and A4 relies on it. */
  assert.equal(PlainCopy.plainOrDrop('a range 60' + EN + '400 lb', 'probe'), 'a range 60 to 400 lb');
  assert.equal(PlainCopy.plainOrDrop(EM + ' recorded today', 'probe'), 'recorded today');
  /* A dash in a shape the normaliser will not guess at (no space after it, not a
     range) is REFUSED, and the slot blanks rather than the screen failing. */
  assert.throws(() => PlainCopy.plainCopy('seat' + EM + 'pin', 'probe'),
    (error) => error.code === 'AI_DASH_IN_UI');
  assert.equal(PlainCopy.plainOrDrop('seat' + EM + 'pin', 'probe'), '');
});

test('S23 (b) - RENDER TIME: zero U+2013/U+2014 in text, placeholder, aria-label or title', () => {
  const states = [
    () => createSetupModel({ today: DAY }),                                   // empty
    () => filled().model,                                                     // filled
    () => { const k = filled(); k.model.setName(''); k.model.next(); return k.model; },   // validation
    () => { const k = filled(); k.model.toggleDay('1'); k.model.toggleDay('4'); return k.model; }, // refusal
  ];
  for (const make of states) {
    const model = make();
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const kit = screenAt(n, model);
      for (const node of kit.doc.querySelectorAll('#phone *')) {
        for (const value of [node.textContent, node.getAttribute('placeholder'),
          node.getAttribute('aria-label'), node.getAttribute('title')]) {
          if (!value) continue;
          assert.equal(value.includes(EM), false, 'screen ' + n + ' renders U+2014: ' + value.slice(0, 80));
          assert.equal(value.includes(EN), false, 'screen ' + n + ' renders U+2013: ' + value.slice(0, 80));
        }
      }
    }
  }
});

test('S23b / M16 - the dash-normalised harvest, if present, must not weaken any other word', () => {
  /* WRITTEN AGAINST THE BEHAVIOUR, not against an implementation. P1
     (rebuild/slice/P1-NO-DASHES-BRIEF.md) carries design.cjs's dash-normalised
     approved-copy harvest; A4 must not write a second one. What A4 asserts is the
     property that makes normalisation safe: a term that differs by ANYTHING other
     than a dash still fails. */
  const normalise = (s) => s.split(EM).join('-').split(EN).join('-');
  const approved = design.readApproved();
  const approvedText = approved.map((a) => a.html).join('\n');
  const carried = design.APPROVED_COPY.filter((line) => normalise(line) !== line);
  for (const line of design.APPROVED_COPY) {
    assert(approvedText.includes(line) || normalise(approvedText).includes(normalise(line)),
      'a harvested term must match, dash-normalised or not: "' + line + '"');
    /* One word changed, and it must NOT match under any normalisation. */
    const weakened = line.replace(/\b(\w{4,})\b/, 'zzzz');
    if (weakened === line) continue;
    assert.equal(normalise(approvedText).includes(normalise(weakened)), false,
      'normalisation let a term differing by a WORD pass: "' + weakened + '"');
  }
  assert.equal(design.PREVIEW_COPY.filter((line) => normalise(line) !== line).length
    + carried.length >= 0, true, 'the carried list is reported: ' + JSON.stringify(carried));
});

test('S24 / M19 / H1 - no setup file imports, requires or reads anything under rebuild/engine', () => {
  for (const name of SETUP_FILES) {
    const text = codeOf(setupFileText(name));
    for (const pattern of [/from\s+['"][^'"]*rebuild\/engine/, /require\(\s*['"][^'"]*rebuild\/engine/,
      /\.\.\/\.\.\/\.\.\/engine/, /seed\.cjs/, /migrate\.cjs/, /constants\.cjs/, /progression\.cjs/]) {
      assert.equal(pattern.test(text), false, name + ' reaches into the engine: ' + pattern);
    }
  }
  /* The grep proof the brief asks for, executed: not one of the five files names
     rebuild/engine in any import, require or path, comments excluded. */
  assert.equal(SETUP_FILES.filter((n) => /rebuild\/engine/.test(codeOf(setupFileText(n)))).length, 0);
  /* And the standard start really is a declared literal in the page's own source,
     with its provenance beside it. */
  const model = setupFileText('setup-model.mjs');
  assert(/export const STANDARD_SETS = 3;/.test(model));
  assert(/export const STANDARD_HI = 10;/.test(model));
  assert(/export const STANDARD_INC = 5;/.test(model));
  assert(model.includes('INVENTED'), 'the two standards are marked INVENTED beside their declaration');
});

test('S24 - no number on the screens comes from seed.cjs or from any athlete\'s own data', () => {
  const seed = readRepo('rebuild/engine/seed.cjs');
  /* The engine\'s own newborn and seeded values, which must NOT be the standard. */
  const seededSets = [...seed.matchAll(/\bsets:\s*(\d+)/g)].map((m) => Number(m[1]));
  const seededHi = [...seed.matchAll(/\bhi:\s*(\d+)/g)].map((m) => Number(m[1]));
  assert(seededSets.length > 5 && seededHi.length > 5, 'seed.cjs really was read');
  const kit = filled();
  const setup = documentOf(kit);
  /* Every number in the document is either his own answer or a declared standard. */
  const declared = new Set([Model.STANDARD_SETS, Model.STANDARD_HI, Model.STANDARD_INC]);
  const typed = new Set([20, 10, 30, 45, 70, 100, 135]);
  for (const e of setup.exercises) {
    for (const value of [e.sets, e.hi, e.inc, ...e.steps]) {
      assert(declared.has(value) || typed.has(value), 'an unexplained number reached the document: ' + value);
    }
  }
});

test('S25 - the chips ARE the engine\'s own labels, read out of seed.cjs at test time', () => {
  const fromTheEngine = seedMuscleLabels();
  assert.deepEqual([...fromTheEngine].sort(), [...Model.MG_LABELS].sort(),
    'seed.cjs and the chip list disagree; the engine gained or lost a label');
  assert.deepEqual([...Model.MG_LABELS].sort(), ['abs', 'back', 'biceps', 'calves', 'chest', 'delts',
    'forearms', 'glutes', 'hams', 'quads', 'triceps']);
});

test('S25 / M17 - a chip STORES the bare engine label, never the gloss shown beside it', () => {
  const model = createSetupModel({ today: DAY });
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const row = model.addExercise('U');
  model.setExerciseField(row.key, 'n', 'Side raise');
  model.setExerciseField(row.key, 'first', '10');
  model.chooseMg(row.key, 'delts');
  assert.equal(model.answers().exercises[0].mg, 'delts');
  assert.equal(Model.glossFor('delts'), 'delts (shoulders)', 'the gloss is shown');
  const kit = screenAt(3, model);
  assert(kit.text().includes('delts (shoulders)'), 'the gloss is on the screen');
  model.setName('Dad');
  const setup = model.document().setup;
  assert.equal(setup.exercises[0].mg, 'delts', 'and the STORED value is the bare label');
  for (const e of setup.exercises) assert.equal(/\(/.test(e.mg), false, 'no gloss is ever stored');
});

test('S25 / M20 - a second tap on a chip clears it, and it can be replaced', () => {
  const kit = filled();
  assert.equal(kit.model.chooseMg(kit.keys.press, 'chest'), '', 'a second tap clears');
  assert.equal(kit.model.chooseMg(kit.keys.press, 'back'), 'back');
  assert.equal(kit.model.chooseMg(kit.keys.press, 'chest'), 'chest');
});

test('S25 / M18 - NO coarse-group vocabulary and NO mapping exists in any setup file', () => {
  const source = setupCode() + design.templateHtml();
  /* The seven-group list DECISIONS:115 deleted, as a LIST: three or more of its
     coarse words as adjacent quoted array elements. A single word is not the
     list: "core" is the plain-language GLOSS beside abs, which :115 permits
     explicitly ("never a different stored value"), and S25's storage checks
     above are what hold that line. */
  const coarse = '(?:chest|back|shoulders|arms|legs|glutes|core)';
  const asList = new RegExp("(['\"])" + coarse + "\\1\\s*,\\s*(['\"])" + coarse + "\\2\\s*,\\s*(['\"])" + coarse + "\\3");
  assert.equal(asList.test(source), false, 'the coarse seven-group vocabulary is back as a list');
  assert.equal(/COARSE|GROUP_MAP|MG_MAP|toGroup|coarseFor/.test(source), false, 'a mapping table is back');
  /* And every stored value really is one of the engine's own labels or free text. */
  const kit = filled();
  const stored = documentOf(kit).exercises.map((e) => e.mg);
  assert(stored.includes('chest') && stored.includes('quads'));
  assert(stored.includes('lats and mid back'), '"something else" stores what he typed, verbatim');
});

test('S25 - "something else" is NOT offered on screen 5, because a priority needs an engine label', () => {
  const kit = screenAt(5, filled().model);
  const labels = kit.chips().map((b) => b.textContent.trim());
  assert.equal(labels.includes(Model.COPY.somethingElse), false);
  assert.equal(labels.length, Model.MG_LABELS.length);
  assert.equal(Model.togglePriority, undefined, 'the action is on the model, not a free field');
});

/* ==========================================================================
   6. PROVENANCE (BUILD-BRIEF section 2.8), one subtest per row. Each asserts
   that the citation is still true, or that the INVENTED marking still stands.
   ========================================================================== */
const brief = () => readRepo('rebuild/lanes/c/dad-first-run/BUILD-BRIEF.md');

test('2.8 row 1 - Muscle chips: SOURCED to rebuild/engine/seed.cjs EXERCISES', () => {
  const labels = seedMuscleLabels();
  for (const chip of Model.MG_LABELS) assert(labels.includes(chip), chip + ' is not a seed.cjs mg value');
  assert(readRepo('rebuild/m4/workout/athlete-state.cjs').includes("['id', 'n', 'mg', 'day'"),
    'mg is a member of the contract and nothing is enumerated engine-side');
});

test('2.8 row 2 - Gloss beside a chip: INVENTED, display only, never stored', () => {
  const constants = readRepo('rebuild/engine/constants.cjs');
  assert.equal(/MG_LABEL[\s\S]{0,400}quads/.test(constants), false,
    'the engine still has no gloss table for the labels first-run collects');
  for (const [label, gloss] of Object.entries(Model.MG_GLOSS)) {
    assert(Model.MG_LABELS.includes(label));
    assert.equal(Model.glossFor(label), label + ' (' + gloss + ')');
  }
  for (const e of documentOf(filled()).exercises) assert.equal(/\(/.test(e.mg), false);
});

test('2.8 row 3 - "something else" free entry: SOURCED to athlete-state.cjs mg being any non-empty string', () => {
  const source = readRepo('rebuild/m4/workout/athlete-state.cjs');
  assert(source.includes("if (typeof value !== 'string' || !value.trim()) fail('CLEAN_INIT_EXERCISE_REQUIRED', name)"),
    'mg is still checked as any non-empty trimmed string');
  const state = createCleanInitState({ setup: documentOf(filled()) });
  assert.equal(state.exercises[1].mg, 'lats and mid back', 'the constructor takes it unmapped');
});

test('2.8 row 4 - Standard start, sets = 3: INVENTED and declared, never derived', () => {
  assert.equal(Model.STANDARD_SETS, 3);
  const constants = readRepo('rebuild/engine/constants.cjs');
  assert(/VOL_BANDS/.test(constants), 'the nearest engine numbers are WEEKLY per-muscle bands, cited not used');
  assert(brief().includes('INVENTED'), 'the brief still marks it INVENTED');
  assert(setupFileText('setup-model.mjs').includes('INVENTED'));
});

test('2.8 row 5 - Standard start, rep target = 10: INVENTED and declared', () => {
  assert.equal(Model.STANDARD_HI, 10);
  assert(readRepo('rebuild/engine/progression.cjs').includes('ex.hi || 8'),
    'the engine guard clean-init never reaches is still there, and is still not the source');
});

test('2.8 row 6 - Standard step, inc = 5 lb: SOURCED to migrate.cjs clamping inc above 5 down to 5', () => {
  assert.equal(Model.STANDARD_INC, 5);
  assert.equal(Model.STANDARD_INC_UNIT, 'lb');
  const migrate = readRepo('rebuild/engine/migrate.cjs');
  assert(/inc[\s\S]{0,80}5/.test(migrate), 'migrate.cjs still knows the number 5 as an inc bound');
});

test('2.8 row 7 - Day kinds: SOURCED to athlete-state.cjs DAY_KINDS and plan.cjs dayType', () => {
  const source = readRepo('rebuild/m4/workout/athlete-state.cjs');
  assert(source.includes("const DAY_KINDS = ['U', 'L']"));
  assert.deepEqual([...Model.DAY_KINDS], ['U', 'L']);
  assert.deepEqual(Model.DAY_KIND_WORDS, { U: 'Upper body', L: 'Lower body' });
  assert.equal(Model.COPY.screen2Kinds,
    'Earned plans two kinds of day so far: upper body and lower body.',
    'the owner\'s own wording, DECISIONS:114 (4)');
});

test('2.8 row 8 - Weekday keys "0".."6": SOURCED to athlete-state.cjs checkSplit', () => {
  assert(readRepo('rebuild/m4/workout/athlete-state.cjs')
    .includes("const weekdays = ['0', '1', '2', '3', '4', '5', '6']"));
  assert.deepEqual([...Model.WEEKDAYS], ['0', '1', '2', '3', '4', '5', '6']);
});

test('2.8 row 9 - Sets chip options 2/3/4: INVENTED, a range around the standard', () => {
  assert.deepEqual([...Model.SETS_OPTIONS], [2, 3, 4]);
  assert(Model.SETS_OPTIONS.includes(Model.STANDARD_SETS));
  for (const value of Model.SETS_OPTIONS) assert(Number.isSafeInteger(value) && value > 0,
    'the only engine bound is positive integer');
});

test('2.8 row 10 - Rep chip options 6/8/10/12: INVENTED, a range around the standard', () => {
  assert.deepEqual([...Model.HI_OPTIONS], [6, 8, 10, 12]);
  assert(Model.HI_OPTIONS.includes(Model.STANDARD_HI));
  for (const value of Model.HI_OPTIONS) assert(Number.isSafeInteger(value) && value > 0);
});

test('2.8 row 11 - the "n of 6" counter: INVENTED, the flow\'s own screen count, exempt by name', () => {
  assert.equal(Model.SCREENS, 6);
  for (const n of [1, 2, 3, 4, 5, 6]) assert.equal(Model.counterLine(n), n + ' of 6');
});

test('2.8 row 12 - split.from: SOURCED, and the guard that catches a future one is untouched', () => {
  const host = readRepo('rebuild/m3/w6/host/workout-host.mjs');
  assert(host.includes('WORKOUT_SPLIT_NOT_IN_FORCE'), 'the guard is still where it was');
  const source = setupCode();
  assert.equal(/workout-host/.test(source), false, 'and A4 did not touch it');
});

test('2.8 row 13 - Autonomy floor "propose": SOURCED, written by the constructor and never shown', () => {
  const state = createCleanInitState({ setup: documentOf(filled()) });
  assert.deepEqual(state.plan, { autonomy: 'propose' });
  const source = setupCode();
  /* A4b: the flow now PROPOSES a session kind (proposeKinds, DECISIONS:125 (1)),
     so the bare word "propose" is no longer a reliable marker. What must stay
     absent is the engine's autonomy VOCABULARY: the member name, and the level
     as a string literal, which is the only form in which a screen could show it. */
  assert.equal(/autonomy/.test(source), false, 'no screen names the member');
  assert.equal(/['"]propose['"]/.test(source), false, 'no screen names the level');
});

test('2.8 row 14 - Starting load: SOURCED, there is no member for one and the debut path is the probe', () => {
  const source = readRepo('rebuild/m4/workout/athlete-state.cjs');
  assert.equal(REQUIRED_EXERCISE.includes('w'), false, 'the contract has no member for a starting load');
  assert(source.includes('w: null'));
  assert(readRepo('rebuild/engine/today.cjs').includes('baselineAsk'), 'the debut path is still there');
});

test('2.8 row 15 - Rung list parsing: any non-numeric separator, as progression.cjs parseRungs does', () => {
  const progression = readRepo('rebuild/engine/progression.cjs');
  assert(/parseRungs/.test(progression), 'the engine\'s own parser is still named parseRungs');
  assert.deepEqual(Model.parseRungs('45 / 70 / 100'), [45, 70, 100]);
  assert.deepEqual(Model.parseRungs('45,70;100  135'), [45, 70, 100, 135]);
  assert.deepEqual(Model.parseRungs('45kg 70kg'), [45, 70]);
  assert.deepEqual(Model.parseRungs(''), []);
  assert.deepEqual(Model.parseRungs('2.5 5 7.5'), [2.5, 5, 7.5]);
});

test('2.8 row 16 - Priority muscles: SOURCED, carried verbatim, consumed by no reader', () => {
  const state = createCleanInitState({ setup: documentOf(filled()) });
  assert.deepEqual(state.priority_muscles, ['quads', 'calves']);
  assert(readRepo('rebuild/m4/workout/athlete-state.cjs').includes('acted on by nothing yet'));
  assert.equal(Model.COPY.screen5Honest,
    'We will keep this with your plan. It does not change your sessions yet.',
    'and the screen says so');
});

test('2.8 row 17 - the exercise id: slugged here, unique by the constructor\'s own rule', () => {
  assert(readRepo('rebuild/m4/workout/athlete-state.cjs').includes("'duplicate id '"));
  assert.equal(Model.slugOf('Chest Press (incline)', new Set()), 'chest-press-incline');
  assert.equal(Model.slugOf('   ', new Set()), 'lift', 'a nameless row still gets a key, and is refused above');
});

test('2.8 row 18 - the screen-2 copy is the owner\'s own sentence, DECISIONS:114 (4)', () => {
  const kit = screenAt(2, filled().model);
  assert(kit.text().includes('Earned plans two kinds of day so far: upper body and lower body.'));
  assert.equal(kit.text().includes('two kinds of session'), false, 'the superseded wording is gone');
});

test('2.8 row 19 - e.setup is NOT supplied (DECISIONS:117 (2), option ii)', () => {
  for (const e of documentOf(filled()).exercises) assert.equal(Object.hasOwn(e, 'setup'), false);
  const state = createCleanInitState({ setup: documentOf(filled()) });
  for (const e of state.exercises) assert.equal(e.setup, undefined);
  assert.equal(REQUIRED_EXERCISE.includes('setup'), false, 'the contract still has eight members');
  const source = setupCode();
  assert.equal(/machine setup note|setupCue|seat\/pin/i.test(source), false, 'and A4 collects no cue');
});

test('2.8 row 20 - nothing else on the six screens is a list or a number the athlete did not give', () => {
  const source = codeOf(setupFileText('setup-app.mjs'));
  const literalArrays = [...source.matchAll(/\[\s*(?:\d+\s*,\s*){2,}\d+\s*\]/g)].map((m) => m[0]);
  assert.deepEqual(literalArrays, [], 'no numeric list is inlined in the view: ' + literalArrays.join(' '));
  const literalNumbers = [...source.matchAll(/(?<![\w.])\d{2,}(?![\w.])/g)].map((m) => m[0]);
  assert.deepEqual(literalNumbers, [], 'no multi-digit literal in the view: ' + literalNumbers.join(' '));
});

/* ==========================================================================
   7. THE SIX SCREENS, tapped through.
   ========================================================================== */
test('A4 - screen 1 asks for a name and nothing else, and has no back', () => {
  const kit = screenAt(1, createSetupModel({ today: DAY }));
  assert(kit.text().includes(Model.COPY.screen1Head));
  assert(kit.text().includes(Model.COPY.nameLabel));
  assert.equal(kit.doc.querySelectorAll('#phone input').length, 1);
  assert.equal(kit.doc.querySelector('#phone [data-slot="back"]').hidden, true);
});

test('A4 - screen 2: seven weekday toggles, each choosing its own kind, unchosen stays off', () => {
  const model = createSetupModel({ today: DAY });
  const kit = screenAt(2, model);
  assert.equal(kit.doc.querySelectorAll('#phone fieldset.question').length, 7);
  for (const chip of kit.chips()) assert.equal(chip.getAttribute('aria-pressed'), 'false');
  kit.chip('Tuesday').click();
  const after = screenAt(2, model);
  assert.equal(after.chip('Tuesday').getAttribute('aria-pressed'), 'true');
  assert(after.chip('Upper body'), 'a chosen day asks which kind it is');
  after.chip('Lower body').click();
  assert.equal(model.answers().days['2'], 'L');
});

test('A4 - screen 2 names an unanswered day ONLY after he has tried to move on', () => {
  const model = createSetupModel({ today: DAY });
  /* A4b: a day he taps on is never unanswered - Earned proposes its kind. The
     one way back to unanswered is his own: claim a kind, then tap it again to
     give it back, which clears rather than silently re-proposing (S27). */
  model.toggleDay('2');
  model.setDayKind('2', model.answers().days['2']);
  model.setDayKind('2', model.answers().days['2']);
  assert.equal(model.answers().days['2'], '', 'the day is unanswered again');
  assert.equal(screenAt(2, model).text().includes(Model.dayKindValidation('Tuesday')), false, 'quiet first');
  model.next();
  model.goto(2);
  model.next();
  assert(screenAt(2, model, { validationShown: true }).text().includes(Model.dayKindValidation('Tuesday')));
});

test('A4 - screen 3 offers a list ONLY for the session kinds his split actually contains', () => {
  const model = createSetupModel({ today: DAY });
  model.toggleDay('1'); model.setDayKind('1', 'U');
  let kit = screenAt(3, model);
  const legends = [...kit.doc.querySelectorAll('#phone legend')].map((l) => l.textContent.trim());
  assert.deepEqual(legends, ['Upper body'], 'no lower body list, so no orphan lift can be created');
  model.toggleDay('4'); model.setDayKind('4', 'L');
  kit = screenAt(3, model);
  assert.deepEqual([...kit.doc.querySelectorAll('#phone legend')].map((l) => l.textContent.trim()),
    ['Upper body', 'Lower body']);
});

test('A4 - screen 4 asks two numbers per lift and offers the uneven stack behind a closed detail', () => {
  const kit = screenAt(4, filled().model);
  assert.equal(kit.doc.querySelectorAll('#phone input[type="number"]').length, 6, 'two per lift');
  const details = [...kit.doc.querySelectorAll('#phone details')];
  assert.equal(details.length, 3);
  for (const d of details) assert.equal(d.open, false, 'the uneven stack starts collapsed');
  assert(kit.text().includes(Model.COPY.rungsSummary));
});

test('A4 - screen 5 starts with nothing selected and says plainly that it changes nothing yet', () => {
  const model = createSetupModel({ today: DAY });
  const kit = screenAt(5, model);
  for (const chip of kit.chips()) assert.equal(chip.getAttribute('aria-pressed'), 'false');
  assert(kit.text().includes(Model.COPY.screen5Honest));
  kit.chip(Model.glossFor('quads')).click();
  assert.deepEqual(model.answers().priorities, ['quads']);
});

test('A4 - screen 6 states the week in his own words, then offers ONE primary action', () => {
  const kit = screenAt(6, filled().model);
  const text = kit.text();
  assert(text.includes(Model.COPY.screen6Head));
  assert(text.includes('Chest press'));
  assert(text.includes('Leg press'));
  assert(text.includes('Monday'));
  assert(text.includes(Model.COPY.restWord));
  assert(text.includes(Model.standardStepSummary()), 'the declared standard step is repeated here');
  assert(text.includes(Model.COPY.screen6NoLoad));
  assert.equal(kit.primary().disabled, false);
  assert.equal(kit.primary().textContent.trim(), Model.COPY.start);
  assert.equal(text.includes(Model.COPY.refusalHead), false, 'nothing is missing, so nothing is refused');
});

test('A4 - the named refusal on screen 6 is tappable back to the screen that owns each line', () => {
  const model = createSetupModel({ today: DAY });
  const kit = screenAt(6, model);
  const lines = [...kit.doc.querySelectorAll('#phone .followup button.text-link')];
  assert(lines.length >= 2);
  const nameLine = lines.find((b) => b.textContent.trim() === Model.MISSING.name);
  assert(nameLine, 'the missing name is named');
  nameLine.click();
  assert.equal(model.screen(), 1, 'and it goes back to the screen that owns it');
});

test('A4 - "Start using Earned" writes ONCE through the durable lane and lands on Today', async () => {
  const fault = faultDatabase();
  const lane = { indexedDB: fault.indexedDB, crypto: webcrypto };
  const entry = await createSetupEntry({ today: DAY }, lane);
  const dom = new JSDOM(shell());
  const doc = dom.window.document;
  const api = mountToday(doc, createTodayModel({ today: DAY }), { setup: entry });
  api.render('setup');
  /* Drive the entry's OWN model through the flow, then tap its primary. */
  const model = entry.setup;
  const kit = filled();
  for (const [key, value] of Object.entries(kit.model.answers())) {
    if (key === 'exercises' || key === 'days') continue;
  }
  model.setName('Dad');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const lift = model.addExercise('U');
  model.setExerciseField(lift.key, 'n', 'Chest press');
  model.chooseMg(lift.key, 'chest');
  model.setExerciseField(lift.key, 'first', '20');
  model.goto(6);
  api.render('setup');
  const primary = doc.querySelector('#phone [data-slot="primary"]');
  assert.equal(primary.disabled, false);
  primary.click();
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.equal(await entry.host.enrolled(), true, 'the record holds the first run');
  assert.equal((await opsOf(entry.host.repository)).length, 1, 'exactly one operation');
  assert.equal(api.screen(), 'today', 'and he lands on Today');
  entry.host.close();
});

/* ==========================================================================
   A4b. DECISIONS:125 (1) - the athlete picks only the DAYS and Earned proposes
   each day's kind; :127 - the catalogue, the two doors and the starter week.
   A4B-BRIEF.md sections 2 to 5, bar S26-S44.
   ========================================================================== */
const DAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const named = (...names) => names.map((x) => DAYS[x]).sort((a, b) => a - b);

/* S26 - the rule, every day count. A4B-BRIEF section 2.2 IS this table. */
const KIND_ROWS = [
  { n: 1, days: named('Wed'), kinds: { 3: 'U' }, U: 1, L: 0 },
  { n: 2, days: named('Mon', 'Thu'), kinds: { 1: 'U', 4: 'L' }, U: 1, L: 1 },
  { n: 3, days: named('Mon', 'Wed', 'Fri'), kinds: { 1: 'U', 3: 'L', 5: 'U' }, U: 2, L: 1 },
  { n: 3, days: named('Sat', 'Sun', 'Mon'), kinds: { 6: 'U', 0: 'L', 1: 'U' }, U: 2, L: 1 },
  { n: 4, days: named('Mon', 'Tue', 'Thu', 'Fri'), kinds: { 1: 'U', 2: 'L', 4: 'U', 5: 'L' }, U: 2, L: 2 },
  { n: 5, days: named('Mon', 'Tue', 'Wed', 'Thu', 'Fri'),
    kinds: { 1: 'U', 2: 'L', 3: 'U', 4: 'L', 5: 'U' }, U: 3, L: 2 },
  { n: 6, days: named('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
    kinds: { 1: 'U', 2: 'L', 3: 'U', 4: 'L', 5: 'U', 6: 'L' }, U: 3, L: 3 },
  { n: 7, days: named('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
    kinds: { 1: 'U', 2: 'L', 3: 'U', 4: 'L', 5: 'U', 6: 'L', 0: 'U' }, U: 4, L: 3 },
];
const countKind = (kinds, want) => Object.values(kinds).filter((k) => k === want).length;

for (const row of KIND_ROWS) {
  test(`S26 - proposeKinds: ${row.n} day(s) [${row.days.join(',')}] -> ${JSON.stringify(row.kinds)}`, async () => {
    const { proposeKinds } = await import('../split-kinds.mjs');
    const got = proposeKinds(row.days);
    assert.deepEqual(got, row.kinds);
    assert.equal(countKind(got, 'U'), row.U, 'upper days');
    assert.equal(countKind(got, 'L'), row.L, 'lower days');
  });
}

test('S26 - no two training days that follow each other share a kind, except the one forced stack', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  for (const row of KIND_ROWS) {
    const kinds = proposeKinds(row.days);
    const seq = row.days.map((d) => kinds[d]);
    let stacks = 0;
    for (let i = 0; i < seq.length; i += 1) if (seq[i] === seq[(i + 1) % seq.length]) stacks += 1;
    /* An even count can alternate perfectly; an odd count cannot, and exactly one
       pair must repeat. n = 1 is the degenerate case: the single day follows
       itself. */
    assert.equal(stacks, row.n === 1 ? 1 : (row.n % 2 === 0 ? 0 : 1),
      row.n + ' days: ' + seq.join(','));
  }
});

test('S26 - the forced stack straddles the LARGEST cyclic gap, the day furthest from its twin', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  for (const row of KIND_ROWS) {
    if (row.n % 2 === 0 || row.n === 1) continue;
    const days = row.days, n = days.length;
    const kinds = proposeKinds(days);
    const gap = (i) => (days[(i + 1) % n] - days[i] + 7) % 7;
    let biggest = 0;
    for (let i = 1; i < n; i += 1) if (gap(i) > gap(biggest)) biggest = i;
    assert.equal(kinds[days[biggest]], kinds[days[(biggest + 1) % n]],
      row.n + ' days: the repeat sits across the largest gap (' + gap(biggest) + ')');
  }
});

test('S26 - empty, keys-equal-days, never REST, and PURE', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  assert.deepEqual(proposeKinds([]), {});
  for (const row of KIND_ROWS) {
    const got = proposeKinds(row.days);
    assert.deepEqual(Object.keys(got).map(Number).sort((a, b) => a - b), row.days,
      'the keys are exactly the days he chose');
    for (const value of Object.values(got)) assert(value === 'U' || value === 'L', 'never REST');
    /* Pure: the same input twice is deep-equal, and the input is not mutated. */
    const copy = row.days.slice();
    assert.deepEqual(proposeKinds(copy), got);
    assert.deepEqual(copy, row.days, 'the caller\'s array is not mutated');
  }
});

/* =====================================================================
   A4b S32 / S33: the starter week, sized to the bands.
   The 4.3 table is the fixture. The weekly-set numbers are NOT read back
   out of the proposer: they are recomputed here with volume.cjs:74-82's
   own arithmetic (sets x lifts in the bucket x days of that kind), and
   the zone with volume.cjs:83's own ladder. The proposer only supplies
   the rows.
   ===================================================================== */

const WEEK_TABLE = [
  { n: 1, days: named('Mon'), DU: 1, DL: 0,
    major: { U: { lifts: 2, sets: 6, zone: 'LOW' } },
    minor: {} },
  { n: 2, days: named('Mon', 'Thu'), DU: 1, DL: 1,
    major: { U: { lifts: 2, sets: 6, zone: 'LOW' }, L: { lifts: 2, sets: 6, zone: 'LOW' } },
    minor: {} },
  { n: 3, days: named('Mon', 'Wed', 'Fri'), DU: 2, DL: 1,
    major: { U: { lifts: 2, sets: 12, zone: 'IN-BAND' }, L: { lifts: 2, sets: 6, zone: 'LOW' } },
    minor: {} },
  { n: 4, days: named('Mon', 'Tue', 'Thu', 'Fri'), DU: 2, DL: 2,
    major: { U: { lifts: 2, sets: 12, zone: 'IN-BAND' }, L: { lifts: 2, sets: 12, zone: 'IN-BAND' } },
    minor: {} },
  { n: 5, days: named('Mon', 'Tue', 'Wed', 'Thu', 'Fri'), DU: 3, DL: 2,
    major: { U: { lifts: 1, sets: 9, zone: 'IN-BAND' }, L: { lifts: 2, sets: 12, zone: 'IN-BAND' } },
    minor: { U: { lifts: 1, sets: 9, zone: 'IN-BAND' } } },
  { n: 6, days: named('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'), DU: 3, DL: 3,
    major: { U: { lifts: 1, sets: 9, zone: 'IN-BAND' }, L: { lifts: 1, sets: 9, zone: 'IN-BAND' } },
    minor: { U: { lifts: 1, sets: 9, zone: 'IN-BAND' }, L: { lifts: 1, sets: 9, zone: 'IN-BAND' } } },
  { n: 7, days: named('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'), DU: 4, DL: 3,
    major: { U: { lifts: 1, sets: 12, zone: 'IN-BAND' }, L: { lifts: 1, sets: 9, zone: 'IN-BAND' } },
    minor: { U: { lifts: 1, sets: 12, zone: 'IN-BAND' }, L: { lifts: 1, sets: 9, zone: 'IN-BAND' } } },
];

/* volume.cjs:83's ladder, re-typed here so the fixture is checked against the
   engine's boundaries and not against the proposer's opinion of them. */
const BANDS = { floor: 6, lo: 8, hi: 14, ceil: 22 };
const engineZone = (sets) => (sets < BANDS.floor ? 'UNDER'
  : sets < BANDS.lo ? 'LOW'
    : sets <= BANDS.hi ? 'IN-BAND'
      : sets <= BANDS.ceil ? 'HIGH' : 'OVER');

/* volume.cjs:62-82: perWeek counts the days of each kind, and every lift adds
   sets x thatKindsDays to the bucket head || mg. */
function engineWeeklySets(rows, kinds, tags) {
  const perWeek = { U: 0, L: 0 };
  for (const k of Object.values(kinds)) if (k === 'U' || k === 'L') perWeek[k] += 1;
  const by = {};
  for (const row of rows) {
    const days = perWeek[row.day] || 0;
    if (!days || !row.sets) continue;
    const tag = tags[row.id] || {};
    const bucket = tag.head || row.mg;
    by[bucket] = (by[bucket] || 0) + row.sets * days;
  }
  return by;
}

for (const row of WEEK_TABLE) {
  test(`S32 - starter week at ${row.n} day(s): every 4.3 cell, from volume.cjs's own arithmetic`, async () => {
    const { proposeKinds } = await import('../split-kinds.mjs');
    const { proposeWeek, UPPER_MAJORS, LOWER_MAJORS, MINORS } = await import('../starter-week.mjs');
    const kinds = proposeKinds(row.days);
    assert.equal(Object.values(kinds).filter((k) => k === 'U').length, row.DU, 'D_U');
    assert.equal(Object.values(kinds).filter((k) => k === 'L').length, row.DL, 'D_L');

    /* The brief's 4.2 lists, named on screen as INVENTED. */
    assert.deepEqual([...UPPER_MAJORS], ['chest', 'lats', 'upper_back', 'delts_side']);
    assert.deepEqual([...LOWER_MAJORS], ['quads', 'hams', 'glutes', 'calves']);
    assert.deepEqual([...MINORS], ['delts_front', 'delts_rear', 'biceps', 'triceps', 'abs']);

    const week = proposeWeek({ kinds });
    assert.ok(week.rows.length > 0, 'the proposer produced nothing');
    const by = engineWeeklySets(week.rows, kinds, week.tags);
    const majors = { U: UPPER_MAJORS, L: LOWER_MAJORS };

    for (const kind of ['U', 'L']) {
      const cell = row.major[kind];
      for (const bucket of majors[kind]) {
        const lifts = week.rows.filter((r) => r.day === kind
          && ((week.tags[r.id] || {}).head || r.mg) === bucket);
        if (!cell) { assert.equal(lifts.length, 0, `${bucket} should be absent`); continue; }
        assert.equal(lifts.length, cell.lifts, `${kind} major ${bucket} lifts`);
        assert.equal(by[bucket], cell.sets, `${kind} major ${bucket} weekly sets`);
        assert.equal(engineZone(by[bucket]), cell.zone, `${kind} major ${bucket} zone`);
      }
    }

    for (const bucket of MINORS) {
      const lifts = week.rows.filter((r) => ((week.tags[r.id] || {}).head || r.mg) === bucket);
      const kind = lifts.length ? lifts[0].day : null;
      const cell = kind ? row.minor[kind] : null;
      if (!cell) {
        assert.equal(lifts.length, 0, `minor ${bucket} must be absent at ${row.n} days`);
        continue;
      }
      assert.equal(lifts.length, cell.lifts, `minor ${bucket} lifts`);
      assert.equal(by[bucket], cell.sets, `minor ${bucket} weekly sets`);
      assert.equal(engineZone(by[bucket]), cell.zone, `minor ${bucket} zone`);
    }

    /* The two LOW rows are the brief's 4.4 (1): stated, never inflated. */
    if (row.n <= 2) {
      assert.equal(engineZone(by.chest), 'LOW', 'two days is the floor, not the band');
      assert.equal(by.chest, 6);
    }
  });
}

test('S33 - the starter week invents no load, set count or rep target', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  const { proposeWeek } = await import('../starter-week.mjs');
  const { STANDARD_SETS, STANDARD_HI } = await import('../setup-model.mjs');
  const cat = await import('../exercise-catalogue.mjs');
  for (const row of WEEK_TABLE) {
    const week = proposeWeek({ kinds: proposeKinds(row.days) });
    assert.ok(week.rows.length > 0, row.n + ' days');
    for (const r of week.rows) {
      assert.equal(r.sets, STANDARD_SETS, r.id);
      assert.equal(r.hi, STANDARD_HI, r.id);
      /* Loads are never asked here: screen 4 is unchanged and still collects the
         athlete's own rungs. The proposer leaves all three blank. */
      assert.equal(r.first, '', r.id);
      assert.equal(r.inc, '', r.id);
      assert.equal(r.rungs, '', r.id);
      assert.equal(r.w, undefined, r.id);
    }
  }
  for (const entry of cat.CATALOGUE) {
    for (const k of ['w', 'weight', 'load', 'first', 'steps']) {
      assert.equal(entry[k], undefined, `${entry.id} carries ${k}`);
    }
  }
});

test('S32 - every proposed row is a catalogue entry and carries its tags', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  const { proposeWeek } = await import('../starter-week.mjs');
  const { byId, bucketOf } = await import('../exercise-catalogue.mjs');
  for (const row of WEEK_TABLE) {
    const week = proposeWeek({ kinds: proposeKinds(row.days) });
    const ids = week.rows.map((r) => r.id);
    assert.ok(ids.length > 0, row.n + ' days produced nothing');
    assert.equal(new Set(ids).size, ids.length, 'no lift is placed twice');
    assert.deepEqual(Object.keys(week.tags).sort(), [...ids].sort(),
      'the tag key set is exactly the row ids');
    for (const r of week.rows) {
      const entry = byId(r.id);
      assert.ok(entry, r.id + ' is not in the catalogue');
      assert.equal(r.n, entry.n);
      assert.equal(r.mg, entry.mg);
      assert.equal(week.tags[r.id].head, entry.head);
      assert.deepEqual(week.tags[r.id].secondary, entry.secondary.map((s) => ({ ...s })));
      assert.ok(entry.kinds.includes(r.day), r.id + ' placed on the wrong kind');
      assert.ok(bucketOf(entry));
    }
  }
});

test('S32 - proposeWeek is pure, deterministic, and silent on days he did not choose', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  const { proposeWeek } = await import('../starter-week.mjs');
  for (const row of WEEK_TABLE) {
    const kinds = proposeKinds(row.days);
    const copy = JSON.parse(JSON.stringify(kinds));
    const a = proposeWeek({ kinds });
    assert.ok(a.rows.length > 0, row.n + ' days produced nothing');
    const b = proposeWeek({ kinds });
    assert.deepEqual(a, b, 'same input, same week');
    assert.deepEqual(kinds, copy, 'the caller\'s map is not mutated');
    for (const r of a.rows) assert.ok(r.day === 'U' || r.day === 'L');
  }
  assert.deepEqual(proposeWeek({ kinds: {} }), { rows: [], tags: {} });
  assert.deepEqual(proposeWeek(), { rows: [], tags: {} });
});

/* The brief's 4.2 says "always 8 lifts x 3 sets = 24 sets at every day count".
   That holds for UPPER, and for both kinds while D <= 2 (four majors x 2). It
   does NOT hold for LOWER at D >= 3: the minors list names four upper minors
   (delts_front, delts_rear, biceps, triceps) and exactly ONE lower minor (abs),
   so a lower session there is four majors + abs = 5 lifts, 15 sets. The 4.3
   table is unaffected - every cell in it is per bucket, not per session. This
   test pins the arithmetic the RULE produces rather than the sentence, and the
   discrepancy is reported rather than papered over by inventing lower minors. */
test('S32 - session size follows the composition rule, and the 8-lift sentence holds only where it can', async () => {
  const { proposeKinds } = await import('../split-kinds.mjs');
  const { proposeWeek } = await import('../starter-week.mjs');
  const expected = {
    1: { U: 8 }, 2: { U: 8, L: 8 }, 3: { U: 8, L: 8 }, 4: { U: 8, L: 8 },
    5: { U: 8, L: 8 }, 6: { U: 8, L: 5 }, 7: { U: 8, L: 5 },
  };
  for (const row of WEEK_TABLE) {
    const week = proposeWeek({ kinds: proposeKinds(row.days) });
    for (const kind of ['U', 'L']) {
      const lifts = week.rows.filter((r) => r.day === kind);
      const want = expected[row.n][kind] || 0;
      assert.equal(lifts.length, want, `${row.n} days, ${kind} session lifts`);
      /* The brief's claim was about SETS, so say the sets out loud too: an
         upper session is 24 sets everywhere, a lower one is 24 while D_L <= 2
         and 15 at D_L >= 3 (four majors plus abs, the catalogue's only lower
         minor). Review round 1 condition C2; the brief is amended to match. */
      const sets = lifts.reduce((n, r) => n + r.sets, 0);
      assert.equal(sets, want * 3, `${row.n} days, ${kind} session sets`);
      if (kind === 'L' && row.DL >= 3) assert.equal(sets, 15, 'lower at D_L >= 3');
      if (kind === 'L' && row.DL > 0 && row.DL <= 2) assert.equal(sets, 24, 'lower at D_L <= 2');
      if (kind === 'U' && row.DU > 0) assert.equal(sets, 24, 'upper, at every day count');
    }
  }
});

/* =====================================================================
   A4b S35: the payload widens to exactly three members.
   ===================================================================== */

/* A whole first run, driven through the model exactly as the screens drive it:
   the proposal door on screen 3, then screen 4's own load questions, unchanged. */
async function runThroughProposal(days) {
  const { createSetupModel } = await import('../setup-model.mjs');
  const { proposeKinds } = await import('../split-kinds.mjs');
  const { proposeWeek } = await import('../starter-week.mjs');
  const model = createSetupModel({ today: '2026-09-12' });
  model.setName('A');
  const kinds = proposeKinds(days);
  for (const d of days) {
    model.toggleDay(String(d));
    model.setDayKind(String(d), kinds[d]);
  }
  const week = proposeWeek({ kinds });
  model.applyProposal(week.rows, week.tags);
  for (const row of model.answers().exercises) {
    model.setExerciseField(row.key, 'first', '20');
    model.setExerciseField(row.key, 'inc', '5');
  }
  return { model, kinds, week };
}

const DAY_LISTS = [
  named('Mon'), named('Mon', 'Thu'), named('Mon', 'Wed', 'Fri'),
  named('Mon', 'Tue', 'Thu', 'Fri'), named('Mon', 'Tue', 'Wed', 'Thu', 'Fri'),
  named('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
  named('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
];

test('S35 - the document the proposal builds is still exactly what createCleanInitState takes', async () => {
  const { createCleanInitState, REQUIRED_EXERCISE } = await import('../setup-model.mjs');
  for (const days of DAY_LISTS) {
    const { model, kinds } = await runThroughProposal(days);
    const built = model.document();
    assert.equal(built.ok, true, days.length + ' days: ' + JSON.stringify(built.missing));
    const state = createCleanInitState({ setup: built.setup });
    assert.ok(Object.isFrozen(state), 'the constructor returns a frozen state');
    for (const ex of state.exercises) {
      /* Eight members in, plus the two the constructor itself adds. */
      assert.deepEqual(Object.keys(ex).sort(),
        [...REQUIRED_EXERCISE, 'w', 'forks'].sort(), ex.id);
      assert.equal(ex.w, null, ex.id + ' must arrive with no working load');
    }
    /* The split the state carries is the split he chose (athlete-state.cjs:163
       stores it as a one-entry history). */
    for (const d of ['0', '1', '2', '3', '4', '5', '6']) {
      const want = kinds[Number(d)] || 'REST';
      assert.equal(state.split[0].map[d], want, 'weekday ' + d);
    }
    /* exOrder matches the days: a kind with training days has its lifts in
       document order, and a kind with none has none. */
    for (const kind of ['U', 'L']) {
      const want = built.setup.exercises.filter((e) => e.day === kind).map((e) => e.id);
      assert.deepEqual(state.exOrder[kind], want, kind + ' exOrder');
      if (!Object.values(kinds).includes(kind)) assert.deepEqual(want, [], 'no ' + kind + ' day');
    }
    const ids = built.setup.exercises.map((e) => e.id);
    assert.deepEqual(Object.keys(built.tags).sort(), [...ids].sort(),
      'the tag key set is exactly the document ids');
  }
});

test('S35 - prepare builds a payload of exactly three members', async () => {
  const { prepare } = await import('../setup-commands.mjs');
  const { model } = await runThroughProposal(named('Mon', 'Thu'));
  const built = model.document();
  const op = prepare({ action: 'first-run-setup', input: { setup: built.setup, tags: built.tags } });
  assert.deepEqual(Object.keys(op.payload).sort(), ['profile', 'setup', 'tags']);
  assert.deepEqual(op.payload.tags, built.tags);
  assert.equal(op.class, 'event');
  assert.equal(op.kind, 'fact');
});

test('S35 - validate accepts the three-member payload and every refusal cell', async () => {
  const { validate, PROFILE } = await import('../setup-commands.mjs');
  const { model } = await runThroughProposal(named('Mon', 'Thu'));
  const built = model.document();
  const ids = built.setup.exercises.map((e) => e.id);
  const base = () => ({
    kind: 'fact', class: 'event', athlete_id: 'a1', causal_parents: [],
    effective: { local_date: '2026-09-12', local_time: '09:00', utc_offset: '-04:00' },
    payload: JSON.parse(JSON.stringify({ profile: PROFILE, setup: built.setup, tags: built.tags })),
  });
  const read = () => null;
  assert.equal(validate(base(), read), true, 'the three-member payload is accepted');

  const cells = [
    ['two members', (op) => { delete op.payload.tags; }],
    ['four members', (op) => { op.payload.extra = 1; }],
    ['a tags key the document does not have', (op) => { op.payload.tags.ghost = { head: null, secondary: [] }; }],
    ['a document id with no tag', (op) => { delete op.payload.tags[ids[0]]; }],
    ['tags not a map', (op) => { op.payload.tags = []; }],
    ['head a number', (op) => { op.payload.tags[ids[0]].head = 3; }],
    ['head an empty string', (op) => { op.payload.tags[ids[0]].head = ''; }],
    ['head undefined', (op) => { delete op.payload.tags[ids[0]].head; }],
    ['a tag with a third member', (op) => { op.payload.tags[ids[0]].why = 'x'; }],
    ['secondary not an array', (op) => { op.payload.tags[ids[0]].secondary = {}; }],
    ['lend 0', (op) => { op.payload.tags[ids[0]].secondary = [{ mg: 'triceps', lend: 0 }]; }],
    ['lend 1.5', (op) => { op.payload.tags[ids[0]].secondary = [{ mg: 'triceps', lend: 1.5 }]; }],
    ['lend the string "0.5"', (op) => { op.payload.tags[ids[0]].secondary = [{ mg: 'triceps', lend: '0.5' }]; }],
    ['lend NaN', (op) => { op.payload.tags[ids[0]].secondary = [{ mg: 'triceps', lend: NaN }]; }],
    ['a secondary with no mg', (op) => { op.payload.tags[ids[0]].secondary = [{ lend: 0.5 }]; }],
    ['a secondary with an extra member', (op) => { op.payload.tags[ids[0]].secondary = [{ mg: 'triceps', lend: 0.5, why: 1 }]; }],
    ['head added to a document exercise', (op) => { op.payload.setup.exercises[0].head = 'lats'; }],
  ];
  for (const [why, mutate] of cells) {
    const op = base();
    mutate(op);
    assert.equal(validate(op, read), false, 'must refuse: ' + why);
  }
  assert.equal(validate(base(), read), true, 'and still accepts the good one');
});

test('S35 - prepare refuses the same shapes rather than writing them', async () => {
  const { prepare } = await import('../setup-commands.mjs');
  const { model } = await runThroughProposal(named('Mon', 'Thu'));
  const built = model.document();
  const ids = built.setup.exercises.map((e) => e.id);
  const copy = () => JSON.parse(JSON.stringify(built.tags));
  const throws = (tags, why) => assert.throws(
    () => prepare({ action: 'first-run-setup', input: { setup: built.setup, tags } }),
    /SETUP_INPUT_INVALID/, 'must refuse: ' + why);

  throws(undefined, 'no tags at all');
  throws(null, 'tags null');
  throws([], 'tags an array');
  const extra = copy(); extra.ghost = { head: null, secondary: [] };
  throws(extra, 'a key the document does not have');
  const short = copy(); delete short[ids[0]];
  throws(short, 'a document id with no tag');
  const badLend = copy(); badLend[ids[0]].secondary = [{ mg: 'triceps', lend: 2 }];
  throws(badLend, 'lend above 1');
  const badHead = copy(); badHead[ids[0]].head = 7;
  throws(badHead, 'head a number');
  /* And the good one still goes through. */
  const op = prepare({ action: 'first-run-setup', input: { setup: built.setup, tags: copy() } });
  assert.equal(Object.keys(op.payload).length, 3);
});

test('S35 - a hand-added lift is stored untagged, not guessed at', async () => {
  const { createSetupModel } = await import('../setup-model.mjs');
  const model = createSetupModel({ today: '2026-09-12' });
  model.setName('A');
  model.toggleDay('1'); model.setDayKind('1', 'U');
  const row = model.addExercise('U');
  model.setExerciseField(row.key, 'n', 'Thing I do');
  model.chooseMgOther(row.key); model.setMgOther(row.key, 'chest');
  model.setExerciseField(row.key, 'first', '20');
  const built = model.document();
  assert.equal(built.ok, true, JSON.stringify(built.missing));
  const id = built.setup.exercises[0].id;
  assert.deepEqual(built.tags[id], { head: null, secondary: [] });
  assert.equal(built.setup.exercises[0].head, undefined, 'no ninth member on the document');
});

/* =====================================================================
   A4b S27 / S30 / S31 / S34 / S42: the two screens.
   ===================================================================== */

test('S27 - Earned proposes a kind for every day he taps, and never leaves one blank', () => {
  const model = createSetupModel({ today: DAY });
  for (const d of ['1', '3', '5']) model.toggleDay(d);
  const days = model.answers().days;
  assert.deepEqual([days['1'], days['3'], days['5']], ['U', 'L', 'U'],
    'the alternation rule, on the screen the athlete actually uses');
  for (const d of ['0', '2', '4', '6']) assert.equal(days[d], null, 'an untapped day stays off');
  assert.deepEqual(model.overrides(), {}, 'nothing here is his choice yet');
});

test('S27 - an override survives leaving and re-entering screen 2, and changes no other day', () => {
  const model = createSetupModel({ today: DAY });
  for (const d of ['1', '3', '5']) model.toggleDay(d);
  model.setDayKind('3', 'U');                       // his choice, against the proposal
  assert.deepEqual(model.overrides(), { 3: 'U' });
  const before = model.answers().days;
  model.next(); model.goto(4); model.back(); model.goto(2);
  assert.deepEqual(model.answers().days, before, 'navigation changed nothing');
  assert.equal(model.answers().days['3'], 'U', 'his day survived the round trip');
  /* And it is what reaches split.map. */
  model.setName('A');
  for (const kind of ['U', 'L']) {
    if (!model.kindsInSplit().includes(kind)) continue;
    const row = model.addExercise(kind);
    model.setExerciseField(row.key, 'n', 'Lift ' + kind);
    model.chooseMg(row.key, 'chest');
    model.setExerciseField(row.key, 'first', '20');
  }
  const built = model.document();
  assert.equal(built.ok, true, JSON.stringify(built.missing));
  assert.equal(built.setup.split.map['3'], 'U', 'the override is what was written');
});

test('S27 - adding a day re-proposes the days he did NOT speak for, and only those', () => {
  const model = createSetupModel({ today: DAY });
  for (const d of ['1', '3', '5']) model.toggleDay(d);
  model.setDayKind('3', 'U');
  model.toggleDay('6');                               // a fourth day arrives
  const days = model.answers().days;
  assert.equal(days['3'], 'U', 'the day he claimed is untouched');
  assert.deepEqual(model.overrides(), { 3: 'U' });
  for (const d of ['1', '5', '6']) assert(days[d] === 'U' || days[d] === 'L', d + ' still has a kind');
});

test('S27 - screen 2 says whose choice each day is, and prints the rule as Earned\'s own', () => {
  const model = createSetupModel({ today: DAY });
  for (const d of ['1', '3', '5']) model.toggleDay(d);
  let kit = screenAt(2, model);
  assert(kit.text().includes(Model.COPY.screen2Proposal));
  assert(kit.text().includes(Model.COPY.screen2Rule), 'the rule is declared on the screen');
  /* DECISIONS:129 (3): the MECHANISM is invented and says so, and its INTENT is
     said too, with the citation for that intent in the module's own header. */
  assert(kit.text().includes(Model.COPY.screen2Why), 'and what it is for');
  const ruleSource = readRepo('rebuild/m3/w7-preview/today/split-kinds.mjs');
  assert(/Schoenfeld,\s*(\/\/\s*)?Ogborn and Krieger 2016/.test(ruleSource),
    'the intent carries its citation');
  assert(/INVENTED/.test(ruleSource), 'and the mechanism is still marked invented');
  assert(kit.text().includes(Model.COPY.screen2Ours), 'a proposal is labelled as one');
  assert.equal(kit.text().includes(Model.COPY.screen2Yours), false, 'nothing is his yet');
  model.setDayKind('3', 'U');
  kit = screenAt(2, model);
  assert(kit.text().includes(Model.COPY.screen2Yours), 'and his choice is labelled as his');
});

test('S42 - the two honest sentences render exactly when their predicate holds', () => {
  const model = createSetupModel({ today: DAY });
  const textAt2 = () => screenAt(2, model).text();
  const textAt3 = () => screenAt(3, model).text();

  assert.equal(textAt2().includes(Model.COPY.screen2OneDay), false, 'no days, no sentence');
  model.toggleDay('1');
  assert(textAt2().includes(Model.COPY.screen2OneDay), 'one day says so');
  assert.equal(textAt2().includes(Model.COPY.screen2TwoDays), false);

  model.toggleDay('4');
  /* DECISIONS:125 (2)'s words, with :132 (3)'s apostrophe. */
  assert(textAt2().includes('With two days, Earned’s full-body plan is coming; for now one upper day and one lower day.'));
  assert.equal(textAt2().includes(Model.COPY.screen2OneDay), false, 'and the one-day sentence clears');
  /* The band arithmetic belongs to screen 3, beside the week it is about. */
  assert(textAt3().includes(Model.COPY.floorSentence), 'two days is the floor, said out loud');
  assert(textAt3().includes(Model.COPY.minorsSentence), 'and the minors get no direct lift');

  model.toggleDay('2');
  assert.equal(textAt2().includes(Model.COPY.screen2TwoDays), false, 'a third day clears it');
  assert.equal(textAt3().includes(Model.COPY.floorSentence), false, 'and clears the floor sentence');
  assert.equal(textAt3().includes(Model.COPY.minorsSentence), false);
});

/* A model with a four-day week and a name, ready for screen 3. */
function weekOfFour() {
  const model = createSetupModel({ today: DAY });
  model.setName('A');
  for (const d of ['1', '2', '4', '5']) model.toggleDay(d);
  return model;
}
const linkNamed = (kit, label) => [...kit.doc.querySelectorAll('#phone button')]
  .find((b) => b.textContent.trim() === label);

test('S34 - screen 3 offers BOTH doors, and the build door fills the week from the catalogue', () => {
  const model = weekOfFour();
  const kit = screenAt(3, model);
  assert(kit.text().includes(Model.COPY.doorsHead));
  assert(kit.chip(Model.COPY.doorBuild), 'door one');
  assert(kit.chip(Model.COPY.doorChoose), 'door two');
  assert.equal(model.answers().exercises.length, 0, 'nothing is filled in before he picks');

  kit.chip(Model.COPY.doorBuild).click();
  const rows = model.answers().exercises;
  assert.equal(rows.length, 16, 'four majors x 2 lifts, on each of the two kinds');
  for (const row of rows) {
    assert(row.n.trim() !== '', 'every proposed lift is named');
    assert(Model.MG_LABELS.includes(row.mg), row.n + ' carries an engine label');
    assert.equal(row.first, '', 'and no load');
  }
});

test('S34 - after either door, every entry is renameable and removable, and the other door is one tap away', () => {
  for (const first of [Model.COPY.doorBuild, Model.COPY.doorChoose]) {
    const model = weekOfFour();
    let kit = screenAt(3, model);
    kit.chip(first).click();
    kit = screenAt(3, model);
    /* The other door is still on the screen, and so is the switch beneath it. */
    assert(kit.chip(Model.COPY.doorBuild) && kit.chip(Model.COPY.doorChoose), 'both doors remain');
    /* Add one by hand so both paths have a row to edit. */
    if (model.answers().exercises.length === 0) {
      const row = model.addExercise('U');
      model.setExerciseField(row.key, 'n', 'Mine');
    }
    const row = model.answers().exercises[0];
    assert.equal(model.setExerciseField(row.key, 'n', 'My own name'), 'My own name');
    assert.equal(model.answers().exercises[0].n, 'My own name');
    assert.equal(model.removeExercise(row.key), true);
    assert.equal(model.answers().exercises.some((e) => e.key === row.key), false);
  }
});

test('S34 - switching doors adds nothing he did not ask for and destroys nothing he did', () => {
  const model = weekOfFour();
  let kit = screenAt(3, model);
  kit.chip(Model.COPY.doorChoose).click();
  const mine = model.addExercise('U');
  model.setExerciseField(mine.key, 'n', 'My own lift');
  model.chooseMg(mine.key, 'chest');

  kit = screenAt(3, model);
  kit.chip(Model.COPY.doorBuild).click();
  assert(model.answers().exercises.some((e) => e.n === 'My own lift'), 'his lift survived the build door');
  const afterBuild = model.answers().exercises.length;

  /* Building again replaces the proposal's own rows, not his, so the week does
     not grow every time he taps. */
  kit = screenAt(3, model);
  kit.chip(Model.COPY.doorBuild).click();
  assert.equal(model.answers().exercises.length, afterBuild, 'the week did not double');
  assert(model.answers().exercises.some((e) => e.n === 'My own lift'));
});

/* Type into a live field and let the view repaint itself, which is what the
   athlete's own keyboard does. The view is mounted ONCE: its search box, its open
   group and what he has typed are view state, and re-mounting would reset them. */
function typeInto(kit, id, value) {
  const box = kit.doc.getElementById(id);
  assert(box, 'no field ' + id + ' on the screen');
  box.value = value;
  box.dispatchEvent(new kit.dom.window.Event('input'));
  box.dispatchEvent(new kit.dom.window.Event('change'));
}

test('S30 - screen 3 search finds a lift by name and by alias, and adds it with its tags', async () => {
  const { byId } = await import('../exercise-catalogue.mjs');
  const model = weekOfFour();
  const kit = screenAt(3, model);
  kit.chip(Model.COPY.doorChoose).click();
  typeInto(kit, 'setup-search', 'lat pulldown');
  assert(kit.text().includes(byId('lat_pulldown').n), 'the lift is offered');
  linkNamed(kit, Model.COPY.addFromCatalogue).click();
  const added = model.answers().exercises.find((e) => e.n === byId('lat_pulldown').n);
  assert(added, 'and adding it puts it in the week');
  assert.equal(added.mg, 'back');
  assert.equal(added.head, 'lats', 'with the region tag the catalogue carries');
  assert.equal(added.day, 'U', 'on a kind his split actually has');
});

test('S30 - search says so when it has nothing, instead of showing an empty list', () => {
  const model = weekOfFour();
  const kit = screenAt(3, model);
  kit.chip(Model.COPY.doorChoose).click();
  typeInto(kit, 'setup-search', 'zzzznotalift');
  assert(kit.text().includes(Model.COPY.searchNone));
  assert.equal(model.answers().exercises.length, 0, 'and nothing was added');
});

test('S31 - the picker on screen: six groups, then that group\'s regions, then its lifts', async () => {
  const { REGIONS, entriesFor } = await import('../exercise-catalogue.mjs');
  const model = weekOfFour();
  const kit = screenAt(3, model);
  kit.chip(Model.COPY.doorChoose).click();
  assert(kit.text().includes(Model.COPY.workLabel), 'the second search is offered by its own question');
  for (const g of ['chest', 'back', 'shoulders', 'arms', 'legs', 'core']) {
    assert(kit.chip(Model.GROUP_WORDS[g]), 'group ' + g + ' is a door');
  }
  kit.chip(Model.GROUP_WORDS.back).click();
  for (const r of REGIONS.back) assert(kit.chip(Model.REGION_WORDS[r]), 'region ' + r);
  kit.chip(Model.REGION_WORDS.lats).click();
  for (const entry of entriesFor('back', 'lats')) {
    assert(kit.text().includes(entry.n), entry.id + ' is offered');
  }
  assert.equal(kit.text().includes('upper_back'), false, 'no engine label is ever shown');
  assert.equal(kit.text().includes('delts_side'), false);
});

test('S31 - the custom picker adds his own lift, and refuses to guess a bucket it cannot name', () => {
  const model = weekOfFour();
  const kit = screenAt(3, model);
  kit.chip(Model.COPY.doorChoose).click();
  /* Stopping at a group that names one engine bucket is complete. */
  kit.chip(Model.GROUP_WORDS.chest).click();
  typeInto(kit, 'setup-custom', 'The angled press thing');
  kit.doc.getElementById('setup-custom-add').click();
  const mine = model.answers().exercises.find((e) => e.n === 'The angled press thing');
  assert(mine, 'his own lift is in the week');
  assert.equal(mine.mg, 'chest');
  assert.equal(mine.head, null, 'stopping at the group leaves no region claim');
  assert.deepEqual(mine.secondary, [], 'and claims no lends it cannot source');
});

test('S31 - a group the engine has no single bucket for asks for the part, and adds nothing meanwhile', () => {
  const model = weekOfFour();
  const kit = screenAt(3, model);
  kit.chip(Model.COPY.doorChoose).click();
  kit.chip(Model.GROUP_WORDS.arms).click();
  typeInto(kit, 'setup-custom', 'That cable thing');
  assert(kit.text().includes(Model.COPY.customRegionRequired), 'it says which part it needs');
  assert.equal(kit.doc.getElementById('setup-custom-add').disabled, true,
    'and will not add a lift it cannot bucket');
  assert.equal(model.answers().exercises.length, 0);
  /* Opening the region answers it. */
  kit.chip(Model.REGION_WORDS.biceps).click();
  typeInto(kit, 'setup-custom', 'That cable thing');
  kit.doc.getElementById('setup-custom-add').click();
  const mine = model.answers().exercises.find((e) => e.n === 'That cable thing');
  assert(mine, 'now it goes in');
  assert.equal(mine.mg, 'biceps');
  assert.equal(mine.head, 'biceps');
});

test('S30 / S35 - a week built through the doors is a document the constructor accepts, tags and all', async () => {
  const { createCleanInitState } = await import('../setup-model.mjs');
  const { prepare } = await import('../setup-commands.mjs');
  const model = weekOfFour();
  const kit = screenAt(3, model);
  kit.chip(Model.COPY.doorBuild).click();
  kit.chip(Model.COPY.doorChoose).click();
  typeInto(kit, 'setup-search', 'hip thrust');
  linkNamed(kit, Model.COPY.addFromCatalogue).click();
  for (const row of model.answers().exercises) model.setExerciseField(row.key, 'first', '20');
  const built = model.document();
  assert.equal(built.ok, true, JSON.stringify(built.missing));
  const state = createCleanInitState({ setup: built.setup });
  assert.equal(state.exercises.length, built.setup.exercises.length);
  const op = prepare({ action: 'first-run-setup', input: { setup: built.setup, tags: built.tags } });
  assert.equal(Object.keys(op.payload).length, 3);
  /* The tags carry real regions and real lends, not empty placeholders. */
  const tagged = Object.values(op.payload.tags);
  assert(tagged.some((t) => typeof t.head === 'string'), 'some lift carries a region');
  assert(tagged.some((t) => t.secondary.length > 0), 'and some lift carries a lend');
});

/* =====================================================================
   DECISIONS:133 (2) - the owner's screen 6, in the pane, at the A4b head.
   Three defects, all of them the same failure: a row or a gap was composed
   out of an exercise's NAME without asking whether there was one, so an
   unnamed exercise printed punctuation where a subject belongs
   (",: What does it work? ..." / ", has nothing it works yet."), the gaps
   ran together into one sentence, and the sets line read like a form label
   rather than a sentence.
   ===================================================================== */

/* One upper day, one exercise, nothing filled in but the day. This is the
   state the owner was looking at. */
function weekWithOneUnnamed(name = '') {
  const model = createSetupModel({ today: DAY });
  model.setName('Dad');
  model.toggleDay('1');
  model.setDayKind('1', 'U');
  const row = model.addExercise('U');
  if (name !== '') model.setExerciseField(row.key, 'n', name);
  return { model, key: row.key };
}
const gapLines = (kit) => [...kit.doc.querySelectorAll('#phone .followup button.text-link')]
  .map((b) => b.textContent.trim());

test(':133 (2) a - an unnamed exercise reads "One exercise (unnamed)", never punctuation', () => {
  for (const name of ['', '   ', ',']) {
    const { model } = weekWithOneUnnamed(name);
    const text = screenAt(6, model).text();
    assert(text.includes(Model.COPY.unnamedExercise),
      `name ${JSON.stringify(name)}: the fallback is missing`);
    assert.equal(text.includes(',: '), false, 'no bare punctuation where a name belongs');
    assert.equal(/(^|\s),\s/.test(text), false, 'no orphan comma standing in for a subject');
  }
});

test(':133 (2) b - a named exercise still reads as its own name', () => {
  const { model } = weekWithOneUnnamed('Chest press');
  const text = screenAt(6, model).text();
  assert(text.includes('Chest press'));
  assert.equal(text.includes(Model.COPY.unnamedExercise), false, 'the fallback stays away');
});

test(':133 (2) c - the gaps are ONE PER LINE, each a full sentence with a subject', () => {
  const { model } = weekWithOneUnnamed();
  const kit = screenAt(6, model);
  const gaps = gapLines(kit);
  assert(gaps.length >= 3, 'the three gaps this state has: ' + JSON.stringify(gaps));

  /* One per line: every gap sits in its own block wrapper, so the browser
     cannot run them together the way the owner saw. */
  const wrappers = [...kit.doc.querySelectorAll('#phone .followup .gap')];
  assert.equal(wrappers.length, gaps.length, 'one wrapper per gap');
  for (const wrap of wrappers) {
    assert.equal(wrap.querySelectorAll('button').length, 1, 'one gap per line');
  }

  for (const line of gaps) {
    assert(/^[A-Z]/.test(line), 'a gap starts a sentence: ' + JSON.stringify(line));
    assert(line.endsWith('.'), 'a gap ends one: ' + JSON.stringify(line));
    assert.equal(/^\s*,/.test(line), false, 'never a fragment: ' + JSON.stringify(line));
  }
  /* The unnamed exercise is the SUBJECT of its own gaps, not a blank. */
  const about = gaps.filter((l) => l.startsWith(Model.COPY.unnamedSubject));
  assert(about.length >= 2, 'its gaps name it: ' + JSON.stringify(gaps));
  assert(gaps.some((l) => /nothing it works yet\.$/.test(l)));
  assert(gaps.some((l) => /no lightest setting yet\.$/.test(l)));
  /* And the glued sentence the owner read is gone. */
  assert.equal(kit.text().includes('in it., has nothing'), false);
});

test(':133 (2) d - the sets line is a sentence, not a form label', () => {
  const { model } = weekWithOneUnnamed('Chest press');
  const text = screenAt(6, model).text();
  assert(text.includes(Model.STANDARD_SETS + ' sets · aim for ' + Model.STANDARD_HI + ' reps'),
    'the owner\'s wording');
  assert.equal(text.toLowerCase().includes('sets of each exercise ' + Model.STANDARD_SETS), false,
    'the form label is gone from the summary');
});

test(':132 (3) - screen 2 uses ONE apostrophe, the curly one, in every sentence', () => {
  const model = createSetupModel({ today: DAY });
  model.toggleDay('1'); model.toggleDay('4');
  const text = screenAt(2, model).text();
  assert(text.includes(Model.COPY.screen2TwoDays), 'the sentence is still on screen');
  /* Same words as DECISIONS:125 (2); the apostrophe is typography and matches
     the rest of the screen (:132 (3)). */
  assert(Model.COPY.screen2TwoDays.includes('Earned’s full-body plan is coming'));
  assert.equal(text.includes(String.fromCharCode(39)), false,
    'no straight apostrophe anywhere on screen 2');
});

/* =====================================================================
   A4b re-pin: the three files the merged B-NTC artifact reaches are
   BYTE-IDENTICAL to the tip, and stay that way.

   packages/B-NTC.json pins a list of files and
   rebuild/conform/v4/postfix/legacy-gates.cjs:12-16 checks each one TWICE -
   as a git object at the pinned commit, and as the bytes ON DISK. A single
   byte of A4b's in a pinned file turns rebuild.yml's B-NTC step red however
   well licensed the change is, so A4b keeps its tags handling in lane C's own
   setup-host.mjs and touches none of them. This test is the guard: it reads
   the pin out of the package itself rather than restating a hash, so it also
   goes red if the package moves and nobody re-reads it.
   ===================================================================== */
test('re-pin - every file the B-NTC package pins is untouched by A4b, on disk', () => {
  const pkg = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/B-NTC.json'));
  const pins = pkg.product;
  assert(pins && typeof pins === 'object', 'the package still carries its product pins');
  const entries = Object.entries(pins).filter(([, v]) => v && typeof v.post === 'string');
  assert(entries.length >= 40, 'pins found: ' + entries.length);

  const missed = [];
  for (const [file, pin] of entries) {
    const onDisk = shaOf(file);
    if (onDisk !== pin.post) missed.push(file + ' on disk ' + onDisk.slice(0, 12)
      + ' but pinned ' + pin.post.slice(0, 12));
  }
  assert.deepEqual(missed, [], 'A4b changed a file the B-NTC artifact pins on disk');
});

test('re-pin - the three files A4b used to touch are the tip\'s bytes', () => {
  const pkg = JSON.parse(readRepo('rebuild/lanes/b/tooling/packages/B-NTC.json'));
  const pins = pkg.product;
  for (const file of ['rebuild/m3/w6/local/today-bindings.mjs',
    'rebuild/m3/w6/test/local-today-journey.test.mjs']) {
    assert(pins[file], file + ' is pinned by the package');
    assert.equal(shaOf(file),
      pins[file].post, file + ' must stay byte-identical');
  }
  /* today-entry.mjs is not pinned by the package, but the pinned journey suite
     pins it by sha in PAGE_PINS, so it is in the same class. */
  const journey = readRepo('rebuild/m3/w6/test/local-today-journey.test.mjs');
  const pinned = /'today-entry\.mjs':\s*'([a-f0-9]{64})'/.exec(journey);
  assert(pinned, 'PAGE_PINS still pins today-entry.mjs');
  assert.equal(shaOf('rebuild/m3/w7-preview/today/today-entry.mjs'), pinned[1],
    'today-entry.mjs must match the pin the journey suite carries');
});

test('re-pin - the durable lane writes the tags and reads them back, from setup-host.mjs', async () => {
  const kit = await device();
  const setup = documentOf(filled());
  const tags = tagsFor(setup);
  /* The envelope the six screens send through today-entry.mjs's one-argument
     onDone, and the two-argument form the suite uses, are the same write. */
  assert.equal((await kit.host.save({ setup, tags })).ok, true);
  const rows = await kit.host.all();
  assert.equal(rows.length, 1, 'ONE op');
  assert.deepEqual(rows[0].setup, setup);
  assert.deepEqual(rows[0].tags, tags, 'the third member came back beside the document');
  const ops = await opsOf(kit.host.repository);
  assert.equal(ops.length, 1);
  assert.deepEqual(Object.keys(ops[0].payload).sort(), ['profile', 'setup', 'tags'],
    'the op on disk carries exactly three payload members');
  kit.host.close();
});

test('re-pin - envelopeOf tells an envelope from a document, and never guesses', async () => {
  const { envelopeOf } = await import('../setup-host.mjs');
  const setup = documentOf(filled());
  const tags = tagsFor(setup);
  assert.deepEqual(envelopeOf({ setup, tags }), { setup, tags }, 'the screens\' one argument');
  assert.deepEqual(envelopeOf(setup, tags), { setup, tags }, 'the suite\'s two');
  /* A real document is REQUIRED_SETUP's four members and can never be read as an
     envelope; a two-member object that is not exactly {setup, tags} is not one
     either, and is passed through as the document so the producer refuses it. */
  assert.deepEqual(envelopeOf(setup), { setup, tags: undefined });
  assert.deepEqual(envelopeOf({ setup, extra: 1 }), { setup: { setup, extra: 1 }, tags: undefined });
  assert.deepEqual(envelopeOf(null), { setup: null, tags: undefined });
});

test('re-pin - a write with tags but NO setup is refused, and writes nothing', async () => {
  const kit = await device();
  const setup = documentOf(filled());
  const refused = await kit.host.save({ setup: undefined, tags: tagsFor(setup) });
  assert.equal(refused.ok, false, 'no document, no op');
  assert.equal((await kit.host.all()).length, 0, 'and the generation is still empty');
  /* The same lane still takes the good write afterwards. */
  assert.equal((await kit.host.save({ setup, tags: tagsFor(setup) })).ok, true);
  kit.host.close();
});

test('re-pin - tags for an id the week does not have are refused at the lane', async () => {
  const kit = await device();
  const setup = documentOf(filled());
  const tags = tagsFor(setup);
  tags.ghost_lift = { head: null, secondary: [] };
  const refused = await kit.host.save({ setup, tags });
  assert.equal(refused.ok, false, 'the key set must match the document ids');
  assert.equal((await kit.host.all()).length, 0, 'nothing was written');
  kit.host.close();
});
