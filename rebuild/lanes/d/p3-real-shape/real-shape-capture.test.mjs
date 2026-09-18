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
/* INVERTED. BEFORE: this raised TWO issues against a file with the old app's
   handle ids - `exercise_id` from the programme rule AND `capture_lift` from
   the capture provenance block, because the admitted state did not carry the
   lift the athlete's own recorded session named, and the screen told him his
   own lift id back. AFTER: the file's lifts ARE the athlete's lifts, and the
   slot is RE-KEYED to the file's lift by normalised name (spec 2.5 rule 1). */
test('D-RS-g1 (gap 2 closed, both consequences) - a phone that recorded one '
  + 'Earned workout before importing ADMITS a file with the old app\'s handle '
  + 'ids, and the recorded slots are re-attached to the FILE\'s lifts', async () => {
  const result = await importAfterAWorkout('handles', 1);
  assert.deepEqual(result.issues, []);
  assert.equal(result.admitted, true);
  const sessions = [...(result.view.workout_facts?.sessions || []),
    ...(result.view.workout_facts?.incomplete_sessions || [])];
  assert.equal(sessions.length, 1);
  const handles = new Set(variant(1).exercises.map(e => e.id));
  /* press, pulldown, tricep and calves are the four ids the file and the phone
     genuinely share, BY THE SAME NAME, so for those the re-key is the identity.
     The claim is that every entry names a FILE lift and that at least one
     moved off the slug his own setup minted. */
  const entries = sessions[0].record.entries;
  for (const entry of entries)
    assert.equal(handles.has(entry.lift_lineage_id), true,
      'a slot is still keyed to the phone\'s own slug: ' + entry.lift_lineage_id);
  assert.equal(entries.some(e => handles.has(e.lift_lineage_id)
    && !Object.values(PHONE_ID).includes(e.lift_lineage_id)), true, 'no slot was re-keyed at all');
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
  /* P3-REAL-SHAPE: THIS CELL STAYS GREEN AND GAINS THE RE-KEY ASSERTION
     (spec 3.3). Here the file's ids already ARE the phone's slugs, so the
     correspondence maps each document lift to a file lift with the SAME id and
     the re-key is the identity: every slot still names a lift the admitted
     state carries, and nothing moved. */
  const held = new Set(result.view.state.exercises.map(e => e.id));
  for (const entry of sessions[0].record.entries) {
    assert.equal(held.has(entry.lift_lineage_id), true, entry.lift_lineage_id);
    assert.equal(Object.values(PHONE_ID).includes(entry.lift_lineage_id), true,
      'the re-key moved a slot that had nowhere to go');
  }
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
/* INVERTED, ALL THREE ASSERTIONS (spec 3.3). BEFORE: the companion refused
   PLAN_EDIT_ORIGIN_UNPROVEN on an adopted basis whose periods carry the file's
   `why`, again on one whose lift ids are the file's own handles, and again on
   one with no athlete_label. AFTER: `why` is accepted as the file's own note,
   the row is matched to the basis lift by its own id and then by normalised
   name, and the label always arrives from admission. */
test('D-RS-k (gap 1 and gap 2 closed, third consequence) - the Edit My Week '
  + 'companion OPENS on an adopted basis whose periods carry the file\'s `why` '
  + 'and whose lift ids are the file\'s own handles', async () => {
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

  /* THE CONTROL: the basis as it stands here (slug ids, no `why`) opens, and
     still opens after this ticket - the first-run shape is untouched. */
  assert.doesNotThrow(() => build(clone(adopted)));

  /* PART ONE: the file's own note retained on the period. `splitShapeOk` now
     accepts `why` as a string it never reads (spec 2.6). */
  const withWhy = clone(adopted);
  for (const p of withWhy.split) p.why = 'SYNTHETIC note the file carried';
  assert.doesNotThrow(() => build(withWhy));

  /* PART TWO: the file's own lift ids. The document row is matched to the basis
     lift BY ITS OWN ID FIRST and then by NORMALISED NAME (spec 2.6), which is
     the same correspondence admission recorded. */
  const withHandles = clone(adopted);
  const back = Object.fromEntries(Object.entries(PHONE_ID).map(([handle, slug]) => [slug, handle]));
  for (const e of withHandles.exercises) e.id = back[e.id] || e.id;
  assert.doesNotThrow(() => build(withHandles));

  /* PART THREE: the label. It always arrives from admission now (spec 2.4), so
     a basis WITHOUT one cannot be reached from the admission path at all - and
     the companion's own label comparison (plan-edit-model.cjs:75) is UNCHANGED
     and still refuses one, which is the guard that must not be weakened. */
  const withoutLabel = clone(adopted);
  delete withoutLabel.athlete_label;
  assert.throws(() => build(withoutLabel), { code: 'PLAN_EDIT_ORIGIN_UNPROVEN' });
  assert.equal(result.view.state.athlete_label, PHONE.setup.athlete_label);
  result.era.close();
});
