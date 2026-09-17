/* P3-PORT-FIX (lane D, CELLS). CELL (f): THE INNER CODES SURFACE UNDER THEIR
   OWN NAMES, and the one of them that sits on the owner's own path.

   source-admission.mjs:289 used to bind `e` and never read `e.code`, so all four
   refusals raised inside the recorded-workout try were renamed
   LOCAL_SOURCE_WORKOUT_UNRESOLVED on the way out. Spec 3.4 fixes that behind an
   ALLOWLIST and gives each inner refusal a field of its own.

   THE ONE THAT MATTERS TO THE OWNER is `capture_sets` (:273). A phone that
   recorded a workout BEFORE importing wrote its capture against the PHONE's
   document, so the slot count per lift is the DOCUMENT's set count. After
   P3-PORT-FIX the admitted state's set count is the FILE's, and :273 compares
   the two. A file whose set counts differ from the document's therefore still
   refuses on that path, now by its own name instead of silently. This is a
   finding for the PM, not something these cells edit away: the cell measures it
   and the author report names it. REVIEW R1 raised it to its one BLOCKING
   finding, and D-PF-f3 at the foot of this file was added in the fix round to
   pin the other half of its trigger.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, liveAt, carry, material,
  producerRegistryFor, shippedSetup, firstRunWith, variedProgramme, variedLegacyState }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';
import Screen from '../../../m3/w7-preview/import/import-screen.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';

const SETUP_DAY = '2026-09-16', WORKOUT_DAY = '2026-09-18', IMPORT_DAY = '2026-09-19';
const clone = value => JSON.parse(JSON.stringify(value));
const DAYS = ['2026-08-14', '2026-08-17', '2026-08-18', '2026-08-21', '2026-08-24',
  '2026-08-31', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'];
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
const instantOn = day => day + 'T16:00:00.000Z';
const scopeFor = tag => ({ databaseName: 'p3-pfc-' + tag, namespace: 'joe/p3-pfc-' + tag,
  athleteId: 'ath-p3-pfc', deviceId: 'dev-p3-pfc' });

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

function phoneState() {
  const state = clone(createCleanInitState({ setup: PHONE.setup }));
  for (const ex of state.exercises) ex.w = ex.steps[0];
  return state;
}

/* ONE WHOLE SESSION on the gym card, written by the PHONE's own document, on a
   day the phone's split calls U. */
async function recordAWorkout(era, day) {
  const open = on => era.createGymHost({ day: on, engineState: phoneState(),
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
}

async function importAfterAWorkout(tag, sealed, { workout = true } = {}) {
  const scope = scopeFor(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(),
    live: liveAt(instantOn(WORKOUT_DAY)), ...scope });
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  if (workout) await recordAWorkout(era, WORKOUT_DAY);
  const { carried, platform } = await carry(era, sealed);
  assert.equal(carried.imported, true, 'custody refused: ' + carried.code);
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository,
    ...scope, producerRegistry: producerRegistryFor({ platform, context: held.context,
      materialDigest: held.materialDigest }, { days: DAYS }),
    asOf: () => IMPORT_DAY, platform });
  const review = await controller.reviewSource(carried.name);
  const prepared = await controller.prepareSource(review,
    { identityConfirmed: true, prefixAnswer: true });
  const admitted = prepared.profile === 'earned/local-source-qualification/v1';
  if (admitted) { const c = localSourceCommitCapability(prepared); await c.publish(); await c.reconcile(); }
  era.close();
  return { admitted, issues: clone(prepared.issues || []) };
}

test('D-PF-f1 (the capture_sets code, ON THE OWNER\'S PATH) - a phone that '
  + 'recorded a workout before importing refuses a file whose set counts differ '
  + 'from the document, and now says WHICH check refused', async () => {
  const result = await importAfterAWorkout('sets-differ', SEALED);
  assert.equal(result.admitted, false,
    'the capture set-count check no longer refuses; the cell is out of date');
  assert.deepEqual([...new Set(result.issues.map(i => i.code))],
    ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED'],
    'the inner refusal is renamed on the way out: ' + JSON.stringify(result.issues));
  const issue = result.issues.find(i => i.field === 'capture_sets');
  assert.ok(issue, 'no issue carried field capture_sets: ' + JSON.stringify(result.issues));
  assert.ok(PHONE.setup.exercises.some(e => e.id === issue.exercise_id),
    'the lift named is one this phone holds: ' + issue.exercise_id);

  /* WHAT HE WOULD READ, measured in the fix round after review R1. The detail
     string is assembled here the way import-screen.mjs:381-395 assembles it
     (the codes after the first, then each issue's `field` and `exercise_id`,
     deduplicated); the RENDERING below is the screen's own refusalLines(). The
     route is not driven here, so this measures the COPY and not the routing.
     It is recorded because the one sentence spec 3.2 rules is keyed on the
     CODE, and on this path the code arrives for a reason the sentence does not
     describe: nothing is wrong with his training week. See the author report,
     review disposition (R1). */
  const parts = [];
  for (const row of result.issues)
    for (const key of ['field', 'exercise_id'])
      if (typeof row[key] === 'string' && row[key] && !parts.includes(row[key]))
        parts.push(row[key]);
  const rendered = Screen.refusalLines(issue.code, parts.join(' ')).join(' ');
  assert.equal(rendered, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED (capture_sets '
    + issue.exercise_id + ') This file was written by a different training week '
    + 'than the one you set up on this phone. Nothing on this phone was changed.',
  'the copy on the owner\'s second refusal moved: ' + rendered);
  assert.equal(new RegExp('[\\u2013\\u2014]').test(rendered), false,
    'no en dash and no em dash reaches the athlete');
  assert.equal(/[0-9]/.test(rendered), false, 'no number reaches him');
  for (const secret of [String(PHONE.setup.athlete_label), FILE.split.from,
    String(FILE.exercises[0].sets), String(PHONE.setup.exercises[0].sets)])
    assert.equal(rendered.includes(secret), false,
      'a value rode out on the refusal: ' + secret);
});

test('D-PF-f2 (the control) - the SAME phone and the SAME recorded workout admit '
  + 'a file whose set counts agree, with every other retained field still the '
  + 'file\'s own, so f1 measures the set counts and not the workout', async () => {
  const result = await importAfterAWorkout('sets-agree', CONTROL);
  assert.equal(result.admitted, true,
    'the control was refused: ' + JSON.stringify(result.issues));
  assert.notDeepEqual(CONTROL_FILE.exercises.map(e => e.hi),
    PHONE.setup.exercises.map(e => e.hi), 'the control still differs in hi');
  assert.notEqual(CONTROL_FILE.split.from, PHONE.setup.split.from,
    'the control still differs in split.from');
});

/* D-PF-f3, ADDED IN THE FIX ROUND AFTER REVIEW R1 (its one BLOCKING finding).

   The review calls the gap this pair measures the ticket's purpose left unmet,
   and asks for it to be pinned rather than argued. f1 shows the refusal and f2
   shows it is the set counts; NEITHER of them shows that the RECORDED WORKOUT
   is the other half of the trigger. This cell holds the FILE, the phone, the
   document, the scope shape and every answer FIXED and removes exactly one
   thing - the workout the phone recorded before importing - and the same file
   ADMITS. So the refusal the owner would meet is the pair (a pre-import Earned
   workout) AND (per-lift set counts that differ from the one number the setup
   flow can write), and nothing else.

   THIS CELL IS THE PM GATE'S TRIP-WIRE. The day someone changes what
   source-admission.mjs:273 compares (author report open question 1, options (b)
   and (c)), f1 goes red and this one stays green, and whoever changes it must
   come back and say which of the two is now true. It must not be edited away. */
test('D-PF-f3 (the PM gate, the other half of the trigger) - the SAME phone, '
  + 'the SAME file and the SAME answers ADMIT when no workout was recorded '
  + 'before the import, so the pre-import workout is what flips f1', async () => {
  const result = await importAfterAWorkout('sets-differ-no-workout', SEALED,
    { workout: false });
  assert.equal(result.admitted, true,
    'the file f1 refuses was refused with no recorded workout either, so f1 is '
    + 'not measuring the capture check: ' + JSON.stringify(result.issues));
  assert.notDeepEqual(FILE.exercises.map(e => e.sets),
    PHONE.setup.exercises.map(e => e.sets),
    'the file must still differ in sets, or this cell proves nothing');
});
