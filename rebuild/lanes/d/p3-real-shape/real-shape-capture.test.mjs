/* P3-REAL-SHAPE - THE MEASUREMENT, part 2: THE PRE-IMPORT EARNED SESSION and
   THE EDIT MY WEEK COMPANION.

   (g) One Earned workout recorded on the phone BEFORE the import, under the
   phone's own slug ids, against the real-shape file.
   (k) The companion's local-source predicate, measured against the two things
   OPTION A would put in the adopted basis: the file's own `why`, and the
   file's own short-handle lift ids.

   Everything here runs against the UNCHANGED S7 product and asserts the CURRENT
   behaviour. SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, eraFor, liveAt, firstRunWith, carry, material, producerRegistryFor }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { createPlanEditProjector } from '../../../m4/workout/plan-edit-model.cjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { sealed, variant, PHONE, PHONE_ID, AT, SETUP_DAY, clone } from './real-shape-support.mjs';

/* The phone's split calls Friday L, so 2026-09-18 is a day it prescribes. The
   file's last recorded day is 2026-08-14, so the identity Yes is true of the
   records in hand and F3's start interpretation stands. */
const WORKOUT_DAY = '2026-09-18', IMPORT_DAY = '2026-09-19';
const DAYS = ['2026-08-09', '2026-08-10', '2026-08-13', '2026-08-14', '2026-09-16',
  '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'];
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
const hashBasis = text => createHash('sha256').update(text, 'utf8').digest('hex');
const scopeFor = tag => ({ databaseName: 'p3-rsc-' + tag, namespace: 'joe/p3-rsc-' + tag,
  athleteId: 'ath-p3-rsc', deviceId: 'dev-p3-rsc' });

/* ONE WHOLE SESSION on the real gym card, from the phone's own document. */
async function recordAWorkout(era, day, engineState) {
  const open = on => era.createGymHost({ day: on, engineState,
    plannedSplitSlotId: 'earned-today-preview/' + on });
  const gymHost = await open(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready', 'the gym card would not prepare: ' + (ready.code || ready.phase));
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
  assert.equal(view.complete === true || view.phase === 'complete', true, view.phase);
  assert.equal((await gym.finish({ startId })).ok, true);
  gymHost.close();
  return total;
}

function phoneState() {
  const state = clone(createCleanInitState({ setup: PHONE.setup }));
  for (const ex of state.exercises) ex.w = ex.steps[0];
  return state;
}

/* THE WHOLE PATH: set the phone up, record one Earned workout on it, import. */
async function importAfterAWorkout(tag, level, { keepOpen = false } = {}) {
  const scope = scopeFor(tag);
  const indexedDB = new IDBFactory();
  const era = await eraFor({ indexedDB, live: liveAt(AT(WORKOUT_DAY)), ...scope });
  await firstRunWith(era, SETUP_DAY, PHONE.setup, PHONE.tags);
  const recordedSlots = await recordAWorkout(era, WORKOUT_DAY, phoneState());
  const { carried, platform } = await carry(era, sealed(level));
  assert.equal(carried.imported, true, 'custody refused: ' + carried.code);
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository, ...scope,
    producerRegistry: producerRegistryFor({ platform, context: held.context,
      materialDigest: held.materialDigest }, { days: DAYS }), asOf: () => IMPORT_DAY, platform });
  const review = await controller.reviewSource(carried.name);
  const prepared = await controller.prepareSource(review, { identityConfirmed: true, prefixAnswer: true });
  const admitted = prepared.profile === 'earned/local-source-qualification/v1';
  let view = null;
  if (admitted) {
    view = clone(await controller.view(prepared));
    const capability = localSourceCommitCapability(prepared);
    await capability.publish(); await capability.reconcile();
  }
  if (!keepOpen) era.close();
  return { admitted, issues: clone(prepared.issues || []), view, recordedSlots, era, indexedDB, scope };
}

/* (g) THE PRE-IMPORT EARNED SESSION, against the file's OWN lift ids. This is
   the shape OPTION A leaves behind: the admitted state's lifts are the FILE's
   short handles, and the capture the phone wrote names the phone's slugs. */
test('D-RS-g1 (gap 2, second consequence) - a phone that recorded one Earned '
  + 'workout before importing raises TWO issues against a file with the old '
  + 'app\'s handle ids: `exercise_id` from the programme rule AND `capture_lift` '
  + 'from the capture provenance block, because the admitted state does not '
  + 'carry the lift the athlete\'s own recorded session names', async () => {
  const result = await importAfterAWorkout('handles', 1);
  assert.equal(result.admitted, false);
  assert.deepEqual(result.issues.map(i => i.field).sort(), ['capture_lift', 'exercise_id']);
  const capture = result.issues.find(i => i.field === 'capture_lift');
  assert.equal(capture.code, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
  /* The lift it names is the PHONE's own slug: his recorded workout, told back
     to him in the id his own setup minted. */
  assert.equal(Object.values(PHONE_ID).includes(capture.exercise_id), true);
  assert.equal(result.recordedSlots,
    PHONE.setup.exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0));
});

test('D-RS-g2 (the control) - with the file\'s ids rewritten to the phone\'s '
  + 'slugs the same phone, the same recorded workout and the same file ADMIT, '
  + 'and the pre-import session rides in AS RECORDED under the document\'s '
  + 'slot count, not the file\'s', async () => {
  const result = await importAfterAWorkout('slugs', 5);
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const sessions = [...(result.view.workout_facts?.sessions || []),
    ...(result.view.workout_facts?.incomplete_sessions || [])];
  assert.equal(sessions.length, 1, 'the pre-import session is not in the record');
  const slots = sessions[0].record.entries.reduce((n, e) => n + e.slots.length, 0);
  const phoneL = PHONE.setup.exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0);
  const fileL = variant(5).exercises.filter(e => e.day === 'L').reduce((n, e) => n + e.sets, 0);
  assert.notEqual(phoneL, fileL, 'the two documents must disagree');
  assert.equal(slots, phoneL, 'the recorded session was rebased');
});

let validateTags, projectNewTags;
test.before(async () => {
  const { createSetupTagProjector } = createRequire(import.meta.url)('../plan-edit/f2-tag-adapter.cjs');
  const { ENGINE_MG, REGION_MG } = await import('../../../m3/w7-preview/today/exercise-catalogue.mjs');
  const api = createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
  validateTags = api.validateExerciseTags; projectNewTags = api.projectNewExerciseTags;
});

/* (k) THE EDIT MY WEEK COMPANION, measured against the two things option A
   would put into the adopted basis. Both are CONSTRUCTION-time refusals, so
   they happen before any projection exists and the screen cannot open. */
test('D-RS-k (gap 1 and gap 2, third consequence) - the Edit My Week companion '
  + 'refuses PLAN_EDIT_ORIGIN_UNPROVEN on an adopted basis whose split periods '
  + 'carry the file\'s `why`, and again on one whose lift ids are the file\'s '
  + 'own handles: its local-source predicate reads neither', async () => {
  const result = await importAfterAWorkout('companion', 5, { keepOpen: true });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const loaded = await result.era.generation();
  const origin = Object.values(loaded.generation.collections.ops)
    .find(op => op.payload?.profile === 'earned/first-run-setup/v1');
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: result.scope.namespace });
  assert.notEqual(adopted, null);
  const build = basisState => createPlanEditProjector({ basisState, setupOperation: origin,
    validateTags, projectNewExerciseTags: projectNewTags, hashBasis,
    basisSource: 'local-source',
    admittedBasisOf: g => admittedLocalSourceBasis(g,
      { athleteLabel: PHONE.setup.athlete_label, namespace: result.scope.namespace }) });

  /* THE CONTROL: as the file stands today (slug ids, no `why`) it opens. */
  assert.doesNotThrow(() => build(clone(adopted)));

  /* OPTION A, PART ONE: the file's own note retained on the period.
     plan-edit-model.cjs:39 splitShapeOk closes each period over {from, map}. */
  const withWhy = clone(adopted);
  for (const p of withWhy.split) p.why = 'SYNTHETIC note the file carried';
  assert.throws(() => build(withWhy), { code: 'PLAN_EDIT_ORIGIN_UNPROVEN' });

  /* OPTION A, PART TWO: the file's own lift ids. plan-edit-model.cjs:117 looks
     each DOCUMENT row's id up in the basis by id, and a handle is not a slug. */
  const withHandles = clone(adopted);
  const back = Object.fromEntries(Object.entries(PHONE_ID).map(([handle, slug]) => [slug, handle]));
  for (const e of withHandles.exercises) e.id = back[e.id] || e.id;
  assert.throws(() => build(withHandles), { code: 'PLAN_EDIT_ORIGIN_UNPROVEN' });

  /* OPTION A, PART THREE: a file with no athlete_label adopted under the
     PHONE's label still has to carry that label in the basis, or the companion
     refuses on the label comparison at plan-edit-model.cjs:75. */
  const withoutLabel = clone(adopted);
  delete withoutLabel.athlete_label;
  assert.throws(() => build(withoutLabel), { code: 'PLAN_EDIT_ORIGIN_UNPROVEN' });
  result.era.close();
});
