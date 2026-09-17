/* P3-PORT-FIX-2 (lane D, CELLS). CELL (f): THE INNER CODES SURFACE UNDER THEIR
   OWN NAMES, and THE PROVENANCE OF A RECORDED CAPTURE.

   source-admission.mjs used to bind `e` and never read `e.code`, so all four
   refusals raised inside the recorded-workout try came out renamed
   LOCAL_SOURCE_WORKOUT_UNRESOLVED. P3-PORT-FIX fixed that behind an ALLOWLIST
   and gave each inner refusal a field of its own.

   WHAT P3-PORT-FIX-2 CHANGES HERE (DECISIONS:509 Q1, option b). The capture the
   phone wrote BEFORE the import was prescribed by the phone's own first-run
   DOCUMENT, so its slot count per lift is the DOCUMENT's set count. The check at
   source-admission.mjs:332 used to compare it with the ADMITTED state's count,
   which after P3-PORT-FIX is the FILE's, so the owner's own path refused. The PM
   ruled the check against the programme that PRODUCED the capture: the document.

   D-PF-f1 THEREFORE INVERTS: it asserted the refusal and now asserts ADMISSION.
   f2 and f3 stay as the controls they were, with their meaning restated below.
   f4 is new and carries the PM's bar: the next morning on the booted page.
   f5 is new and is the capture_sets copy, on a capture that matches NEITHER.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, liveAt, carry, material,
  producerRegistryFor, shippedSetup, firstRunWith, variedProgramme, variedLegacyState,
  Entry, shellWindow }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';
import Screen from '../../../m3/w7-preview/import/import-screen.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';

/* THE CALENDAR. f1, f2, f3 and f5 import on the Saturday after a Friday
   workout; f4 imports on the Friday evening it recorded that workout, so the
   NEXT MORNING is the Saturday the week calls L and a card is prescribed at
   all. `2026-09-20` is on the mapping only so a day the mapping does not name
   still refuses SOURCE_ENGINE_CONTEXT_UNPROVEN rather than passing quietly. */
const SETUP_DAY = '2026-09-16', WORKOUT_DAY = '2026-09-18', IMPORT_DAY = '2026-09-19';
const MORNING_DAY = '2026-09-19';
const clone = value => JSON.parse(JSON.stringify(value));
const DAYS = ['2026-08-14', '2026-08-17', '2026-08-18', '2026-08-21', '2026-08-24',
  '2026-08-31', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'];
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
const instantOn = day => day + 'T16:00:00.000Z';
const scopeFor = tag => ({ databaseName: 'p3-pfc-' + tag, namespace: 'joe/p3-pfc-' + tag,
  athleteId: 'ath-p3-pfc', deviceId: 'dev-p3-pfc' });
const sumSets = (setup, kind) => setup.exercises
  .filter(e => e.day === kind).reduce((n, e) => n + e.sets, 0);

const PHONE = shippedSetup({ today: SETUP_DAY });
/* THE FILE: the same shape, its own retained numbers. */
const FILE = variedProgramme(PHONE.setup);
const SEALED = sealInventedBundle(FILE, { state: variedLegacyState(FILE) });
/* THE CONTROL: the same file with the DOCUMENT's set counts restored and every
   other retained field still the file's own. */
const CONTROL_FILE = (() => {
  const varied = clone(FILE);
  for (const ex of varied.exercises)
    ex.sets = PHONE.setup.exercises.find(e => e.id === ex.id).sets;
  return varied;
})();
const CONTROL = sealInventedBundle(CONTROL_FILE, { state: variedLegacyState(CONTROL_FILE) });
/* THE MIXED FILE (fix round, review R1 NOTE 1): the same programme with the two
   day kinds of the phone's WEEK swapped, so the file disagrees about the week
   itself. programme() throws at its first fault, so this file raises exactly one
   issue of its own, `split.map`, and it is raised BEFORE any capture issue.
   Nothing is hand-written: the swap is read off the phone's own map. */
const SWAPPED_WEEK = Object.fromEntries(Object.entries(PHONE.setup.split.map)
  .map(([day, kind]) => [day, kind === 'U' ? 'L' : 'U']));
const MIXED_FILE = variedProgramme(PHONE.setup,
  { split: { from: FILE.split.from, map: SWAPPED_WEEK } });
const MIXED = sealInventedBundle(MIXED_FILE, { state: variedLegacyState(MIXED_FILE) });

/* THE STATE THE GYM CARD PRESCRIBES FROM. Plain, it is the phone's own
   document, so the capture's slot count per lift IS the document's set count,
   which is the whole point of f1 to f4. `override` exists for f5 alone, which
   needs a capture whose slot count matches NEITHER side. */
function phoneState(override = null) {
  const state = clone(createCleanInitState({ setup: PHONE.setup }));
  for (const ex of state.exercises) {
    ex.w = ex.steps[0];
    if (override && Object.hasOwn(override, ex.id)) ex.sets = override[ex.id];
  }
  return state;
}

/* ONE WHOLE SESSION on the gym card, on a day the phone's split calls U. */
async function recordAWorkout(era, day, engineState) {
  const open = on => era.createGymHost({ day: on, engineState,
    plannedSplitSlotId: 'earned-today-preview/' + on });
  const gymHost = await open(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready',
    'the gym card would not prepare: ' + (ready.code || ready.phase));
  assert.equal((await gym.start()).ok, true);
  let view = await gym.read();
  const startId = view.startId, total = view.total;
  for (let n = 0; n <= total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    assert.equal((await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
      load: view.entry.load, reps: view.entry.reps, effort: EFFORT })).ok, true);
    view = await gym.read();
  }
  assert.equal(view.complete === true || view.phase === 'complete', true,
    'the card did not reach a complete session: ' + view.phase);
  assert.equal((await gym.finish({ startId })).ok, true);
  gymHost.close();
  return total;
}

/* THE WHOLE PATH, once: set the phone up, record a workout on it, then import.
   `keepOpen` leaves the IndexedDB and the era alone so f4 can reopen the page
   on the following local day over the SAME store. */
async function importAfterAWorkout(tag, sealed, { workout = true, workoutState = null,
  day = IMPORT_DAY, keepOpen = false } = {}) {
  const scope = scopeFor(tag);
  const indexedDB = new IDBFactory();
  const era = await eraFor({ indexedDB, live: liveAt(instantOn(WORKOUT_DAY)), ...scope });
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  let recordedSlots = null;
  if (workout) recordedSlots = await recordAWorkout(era, WORKOUT_DAY, workoutState || phoneState());
  const { carried, platform } = await carry(era, sealed);
  assert.equal(carried.imported, true, 'custody refused: ' + carried.code);
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository,
    ...scope, producerRegistry: producerRegistryFor({ platform, context: held.context,
      materialDigest: held.materialDigest }, { days: DAYS }),
    asOf: () => day, platform });
  const review = await controller.reviewSource(carried.name);
  const prepared = await controller.prepareSource(review,
    { identityConfirmed: true, prefixAnswer: true });
  const admitted = prepared.profile === 'earned/local-source-qualification/v1';
  let view = null;
  if (admitted) {
    view = clone(await controller.view(prepared));
    const capability = localSourceCommitCapability(prepared);
    await capability.publish(); await capability.reconcile();
  }
  if (!keepOpen) era.close();
  return { admitted, issues: clone(prepared.issues || []), view, recordedSlots,
    era, indexedDB, scope };
}

/* D-PF-f1, REWRITTEN BY P3-PORT-FIX-2 (DECISIONS:509 Q1, option b). IT USED TO
   ASSERT THE REFUSAL; IT NOW ASSERTS THE ADMISSION.

   This is the owner's own shape: a phone set up on the shipped screens, ONE
   Earned workout recorded on it before the import, and a file whose per-lift set
   counts are not the one number the setup flow can write. The capture was
   prescribed by the DOCUMENT, so it is proved against the DOCUMENT, and the
   file's own counts are no longer the right-hand side of a check about the
   capture's provenance. The refusal this cell used to measure is gone. */
test('D-PF-f1 (the owner\'s path, INVERTED by P3-PORT-FIX-2) - a phone that '
  + 'recorded a workout before importing ADMITS a file whose set counts differ '
  + 'from the document, and the pre-import session rides in AS RECORDED', async () => {
  const result = await importAfterAWorkout('sets-differ', SEALED);
  assert.equal(result.admitted, true,
    'the capture set-count check still refuses the owner\'s own path: '
    + JSON.stringify(result.issues));
  assert.notDeepEqual(FILE.exercises.map(e => e.sets),
    PHONE.setup.exercises.map(e => e.sets),
    'the file must still differ in sets, or this cell proves nothing');

  /* THE PROJECTED PRE-IMPORT SESSION RIDES IN AS RECORDED (the PM's words).
     Its slot count is the DOCUMENT's, not the file's, because that is what he
     actually performed; admission records it, it does not rebase it. */
  const sessions = [...(result.view.workout_facts?.sessions || []),
    ...(result.view.workout_facts?.incomplete_sessions || [])];
  assert.equal(sessions.length, 1, 'the pre-import session is not in the record');
  const slots = sessions[0].record.entries.reduce((n, e) => n + e.slots.length, 0);
  assert.equal(slots, sumSets(PHONE.setup, 'U'),
    'the recorded session was rebased: it carries ' + slots + ' slots and he '
    + 'performed ' + sumSets(PHONE.setup, 'U'));
  assert.notEqual(sumSets(PHONE.setup, 'U'), sumSets(FILE, 'U'),
    'the two documents must disagree on the U day, or this proves nothing');
  assert.equal(result.recordedSlots, sumSets(PHONE.setup, 'U'));
});

/* D-PF-f2, KEPT AS A CONTROL, ITS MEANING RESTATED (P3-PORT-FIX-2).

   BEFORE: it was the control that proved f1's refusal was the SET COUNTS and
   not the workout, by restoring the document's counts and watching the same
   phone admit. AFTER: f1 admits too, so this cell no longer brackets a refusal.
   What it still proves, and why it is not deleted: a file whose set counts
   AGREE with the document admits exactly as it always did, so the change at
   :332 widened nothing on the side that already worked. It is the regression
   half of the pair; f1 is the new half. */
test('D-PF-f2 (the control, meaning restated) - the SAME phone and the SAME '
  + 'recorded workout still admit a file whose set counts AGREE, with every '
  + 'other retained field still the file\'s own', async () => {
  const result = await importAfterAWorkout('sets-agree', CONTROL);
  assert.equal(result.admitted, true,
    'the control was refused: ' + JSON.stringify(result.issues));
  assert.notDeepEqual(CONTROL_FILE.exercises.map(e => e.hi),
    PHONE.setup.exercises.map(e => e.hi), 'the control still differs in hi');
  assert.notEqual(CONTROL_FILE.split.from, PHONE.setup.split.from,
    'the control still differs in split.from');
});

/* D-PF-f3, KEPT AS A CONTROL, ITS MEANING RESTATED (P3-PORT-FIX-2).

   BEFORE: it was the PM gate's trip-wire. It held everything fixed and removed
   the pre-import workout, and the same file admitted, which proved the refusal
   was the PAIR (a recorded workout) AND (differing set counts). AFTER: the PM
   ruled that pair, so f1 and f3 now agree - both admit. What it still proves is
   that the two paths have not diverged: a phone with no recorded workout and a
   phone with one reach the SAME answer on the SAME file, which is what "the
   capture is proved against the document" means when there is no capture. */
test('D-PF-f3 (the no-workout control, meaning restated) - the SAME phone, the '
  + 'SAME file and the SAME answers admit with NO workout recorded before the '
  + 'import, so the recorded workout no longer changes the answer', async () => {
  const result = await importAfterAWorkout('sets-differ-no-workout', SEALED,
    { workout: false });
  assert.equal(result.admitted, true,
    'the file was refused with no recorded workout: ' + JSON.stringify(result.issues));
  assert.notDeepEqual(FILE.exercises.map(e => e.sets),
    PHONE.setup.exercises.map(e => e.sets),
    'the file must still differ in sets, or this cell proves nothing');
  assert.equal(result.recordedSlots, null, 'this control records no workout');
});

/* THE PAGE ITSELF, reopened on a later local day over the SAME IndexedDB. This
   is the technique cell (a) / D-PRR-2 use: not a frozen clock and not a 24 hour
   wait, the same store read at a second instant by a second boot. */
async function reopenPage(indexedDB, scope, at) {
  const era = await eraFor({ indexedDB, live: liveAt(instantOn(at)), ...scope });
  const win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const booted = await Entry.boot({ document: win.document, hosts: era,
    now: liveAt(instantOn(at)) });
  await booted.api.ready;
  return { era, win, booted,
    close: () => { booted.rollover.stop(); booted.teardown(); era.close(); } };
}

/* D-PF-f4, NEW (DECISIONS:509 Q1: "the bar must show the next morning opens").

   The PM's ruling admits a projected pre-import session onto a basis that is no
   longer the one that prescribed it. The question that ruling leaves open is
   whether the ENGINE is happy with that the following morning, and the PM said
   in as many words that a blocked card or ENGINE_CAPTURE_SESSION_INVALID is a
   STOP and comes back to him rather than being widened away. This cell is that
   measurement, on the booted page, over the same store. */
test('D-PF-f4 (the next morning, on the booted page) - after the import a phone '
  + 'that recorded a workout under the DOCUMENT opens the following morning on '
  + 'the FILE\'s set count, is not blocked, and starts', async () => {
  const kit = await importAfterAWorkout('next-morning', SEALED,
    { day: WORKOUT_DAY, keepOpen: true });
  assert.equal(kit.admitted, true,
    'the import was refused, so the morning after proves nothing: '
    + JSON.stringify(kit.issues));
  kit.era.close();

  const next = await reopenPage(kit.indexedDB, kit.scope, MORNING_DAY);
  assert.ok(next.booted.workout, 'the page booted without a workout entry');
  const card = await next.booted.workout.gym.read();
  assert.notEqual(card.code, 'ENGINE_CAPTURE_SESSION_INVALID',
    'the engine refused the projected pre-import session the morning after the '
    + 'import. THIS IS THE STOP DECISIONS:509 Q1 names: do not widen anything, '
    + 'record the code and the line and take it to the PM');
  assert.equal(card.phase, 'ready',
    'the card the page holds did not open: ' + (card.code || card.phase));
  assert.equal(card.total, sumSets(FILE, 'L'),
    'the card prescribed ' + card.total + ' sets; the FILE says '
    + sumSets(FILE, 'L') + ' for this day');
  assert.notEqual(sumSets(FILE, 'L'), sumSets(PHONE.setup, 'L'),
    'the two documents must disagree on the L day, or this proves nothing');
  const started = await next.booted.workout.gym.start();
  assert.equal(started.ok, true,
    'the start was refused the morning after: ' + (started.code || started.copy));
  next.close();

  /* AND THE PRE-IMPORT SESSION IS STILL IN THE RECORD AS RECORDED. */
  const sessions = [...(kit.view.workout_facts?.sessions || []),
    ...(kit.view.workout_facts?.incomplete_sessions || [])];
  assert.equal(sessions.length, 1, 'the pre-import session is not in the record');
  assert.equal(sessions[0].record.entries.reduce((n, e) => n + e.slots.length, 0),
    sumSets(PHONE.setup, 'U'), 'the recorded session was rebased');
});

/* D-PF-f5, NEW (DECISIONS:509 Q5 + Q2, the capture_sets copy).

   WHAT STILL REFUSES after the provenance change, and it is the case the check
   was always for: a capture whose slot count matches NEITHER the document nor
   the file. Here the phone prescribed seven slots for db-bench, its document
   says three and the file says two, so no programme in the story produced that
   capture and admission says so by name. (The other thing that still refuses is
   a lift the DOCUMENT does not carry: that can only arise when programme()
   itself has already refused, and its own issue is raised alongside.)

   This is where the capture_sets SENTENCE is measured, because f1 no longer
   refuses. The sentence is keyed on the FIELD now, not on the code: nothing is
   wrong with his training week on this path, and the copy says what is.

   THIS CELL IS THE PM GATE'S TRIP-WIRE (fix round, review R1 NOTE 5). The old
   D-PF-f3 carried that role while f1 asserted a refusal; now that f1, f2 and f3
   all ADMIT, this cell and D-PF-n4 are the two that still measure a refusal on
   this path. If a later change makes it pass for any other reason, or makes it
   inconvenient, it must not be edited away: it is the only cell that proves the
   capture check still refuses a capture no programme in the story produced. */
test('D-PF-f5 (the capture_sets refusal and its own sentence) - a capture whose '
  + 'slot count matches neither the document nor the file refuses by name, and '
  + 'the screen renders the FIELD\'s sentence, not the training-week one', async () => {
  const STRAY = { 'db-bench': 7 };
  const document = PHONE.setup.exercises.find(e => e.id === 'db-bench').sets;
  const file = FILE.exercises.find(e => e.id === 'db-bench').sets;
  assert.equal(STRAY['db-bench'] === document || STRAY['db-bench'] === file, false,
    'the stray capture must match neither side, or this cell proves nothing');
  const result = await importAfterAWorkout('sets-stray', SEALED,
    { workoutState: phoneState(STRAY) });
  assert.equal(result.admitted, false, 'a capture matching neither side admitted');
  assert.deepEqual([...new Set(result.issues.map(i => i.code))],
    ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED'],
    'the inner refusal is renamed on the way out: ' + JSON.stringify(result.issues));
  const issue = result.issues.find(i => i.field === 'capture_sets');
  assert.ok(issue, 'no issue carried field capture_sets: ' + JSON.stringify(result.issues));
  assert.equal(issue.exercise_id, 'db-bench');

  /* The detail string is assembled here the way import-screen.mjs assembles it
     (the codes after the first, then each issue's `field` and `exercise_id`,
     deduplicated); the RENDERING is the screen's own refusalLines(), called the
     way the screen calls it: with the LEADING issue's field (fix round, review
     R1 NOTE 1). Here the leading issue IS the capture, so the PM's capture
     sentence is what must come out. */
  const parts = [];
  for (const row of result.issues)
    for (const key of ['field', 'exercise_id'])
      if (typeof row[key] === 'string' && row[key] && !parts.includes(row[key]))
        parts.push(row[key]);
  assert.equal(result.issues[0].field, 'capture_sets',
    'the capture is not the leading fault here: ' + JSON.stringify(result.issues));
  const rendered = Screen.refusalLines(issue.code, parts.join(' '),
    result.issues[0].field).join(' ');
  assert.equal(rendered, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED (capture_sets db-bench) '
    + 'A workout you already recorded on this phone has a different number of '
    + 'sets than this file has for that lift. Nothing on this phone was changed.',
  'the capture_sets copy is not the PM\'s words: ' + rendered);
  assert.equal(new RegExp('[\\u2013\\u2014]').test(rendered), false,
    'no en dash and no em dash reaches the athlete');
  assert.equal(/[0-9]/.test(rendered), false, 'no number reaches him');
  for (const secret of [String(PHONE.setup.athlete_label), FILE.split.from,
    String(file), String(document), String(STRAY['db-bench'])])
    assert.equal(rendered.includes(secret), false,
      'a value rode out on the refusal: ' + secret);
});

/* D-PF-f6, NEW IN THE FIX ROUND (independent review R1, NOTE 1).

   THE SENTENCE DESCRIBES THE FAULT THE CODE LINE LEADS WITH, OR IT IS THE
   CODE'S OWN SENTENCE. The reviewer found that refusalLines() took the first
   token it RECOGNISED out of the whole joined detail, so a refusal whose
   leading fault was the training WEEK and whose second fault was the capture
   printed the CAPTURE sentence under a code line that led with `split.map`. The
   athlete was then told his recorded workout disagreed about a lift when what
   actually refused first was his week: a true code line with a false sentence
   under it, which is the class of untruth DECISIONS:509 Q5 ruled against, one
   level down. The fix round keys the sentence on the FIRST issue's field, which
   is the fault the code line leads with, and leaves every other field - and a
   leading issue that carries no field at all - on the code's own sentence.

   This file carries a WEEK the phone does not have (its two day kinds swapped)
   and the capture is the same stray seven-slot one D-PF-f5 uses, so admission
   raises `split.map` first (programme() throws at its first fault) and
   `capture_sets` after it. Both fields still ride out on the code line: nothing
   is hidden from him, and only the SENTENCE changes. */
test('D-PF-f6 (review R1 NOTE 1) - a refusal that leads with a WEEK fault and '
  + 'carries a capture fault behind it prints the training-week sentence, not '
  + 'the capture one', async () => {
  const STRAY = { 'db-bench': 7 };
  const document = PHONE.setup.exercises.find(e => e.id === 'db-bench').sets;
  const file = MIXED_FILE.exercises.find(e => e.id === 'db-bench').sets;
  assert.equal(STRAY['db-bench'] === document || STRAY['db-bench'] === file, false,
    'the stray capture must match neither side, or this cell proves nothing');
  assert.notEqual(JSON.stringify(MIXED_FILE.split.map),
    JSON.stringify(PHONE.setup.split.map),
    'the file must disagree about the week, or this cell proves nothing');
  const result = await importAfterAWorkout('week-and-capture', MIXED,
    { workoutState: phoneState(STRAY) });
  assert.equal(result.admitted, false, 'a file with another week admitted');
  assert.equal(result.issues[0] && result.issues[0].field, 'split.map',
    'the leading fault is not the week: ' + JSON.stringify(result.issues));
  assert.ok(result.issues.some(i => i.field === 'capture_sets'),
    'no capture fault behind it, so this cell proves nothing: '
    + JSON.stringify(result.issues));

  /* The detail, assembled the way import-screen.mjs assembles it, and rendered
     by the screen's own refusalLines() with the LEADING issue's field. */
  const codes = [...new Set(result.issues.map(i => i.code))];
  const parts = codes.slice(1);
  for (const row of result.issues)
    for (const key of ['field', 'exercise_id'])
      if (typeof row[key] === 'string' && row[key] && !parts.includes(row[key]))
        parts.push(row[key]);
  const lines = Screen.refusalLines(codes[0], parts.join(' '), result.issues[0].field);
  const rendered = lines.join(' ');
  assert.equal(lines.length, 2, 'the box is not one code line and one sentence: ' + rendered);
  assert.ok(lines[0].startsWith('LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split.map'),
    'the code line does not lead with the week: ' + rendered);
  assert.ok(lines[0].includes('capture_sets'),
    'the capture fault is hidden from him: ' + rendered);
  assert.equal(lines[1], Screen.COPY.programmeMismatch,
    'the sentence does not describe the leading fault: ' + rendered);
  assert.equal(rendered.includes(Screen.COPY.captureSetsMismatch), false,
    'the capture sentence is printed under a refusal that led with the week: '
    + rendered);
  assert.equal(new RegExp('[\\u2013\\u2014]').test(rendered), false,
    'no en dash and no em dash reaches the athlete');
});
