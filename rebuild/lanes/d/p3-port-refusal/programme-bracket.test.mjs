/* P3-PORT-REFUSAL (lane D, DIAGNOSIS). THE OWNER'S REFUSAL, BRACKETED.

   On 2026-09-17 the owner unsealed his real earned-port file on the phone and
   the Import screen answered LOCAL_SOURCE_PROGRAMME_UNRESOLVED. These cells
   reproduce that refusal SYNTHETICALLY and vary ONE thing at a time to name
   the check that issues it.

   SYNTHETIC ONLY. Every bundle here is sealed by the real
   rebuild/m3/setup/port/port.cjs from the PUBLIC journey fixture through the
   accepted clean-init constructor, with --out in the OS temp folder outside
   every git working tree. No private fixture, no ledger and no owner file is
   read, named or reachable from here.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, liveAt, durable, carry, material,
  producerRegistryFor, createSourcePlatform, SETUP, TAGS, STRANGER_SETUP }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';
import Setup from '../../../m3/w7-preview/today/setup-commands.mjs';
import CheckIn from '../../../m3/w7-preview/today/checkin-commands.cjs';
import { createSetupModel, createCleanInitState }
  from '../../../m3/w7-preview/today/setup-model.mjs';
import { createSleepHost } from '../../../m3/w7-preview/today/sleep-host.mjs';
import { createFoodHost } from '../../../m3/w7-preview/today/food-host.mjs';
import { createMeasureHost } from '../../../m3/w7-preview/measure/measure-host.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';

/* THE FILE'S PROGRAMME is the journey fixture's own, whose split began on
   2026-08-31: that is what "the OLD app's programme" looks like to admission.
   THE PHONE'S PROGRAMME is the SAME answers saved on the day the owner
   completed setup, which is the only split.from the setup flow can write
   (setup-model.mjs:633). Nothing else differs between the two documents. */
const SETUP_DAY = '2026-09-16', IMPORT_DAY = '2026-09-17';
const clone = value => JSON.parse(JSON.stringify(value));
const FILE_SETUP = clone(SETUP);
const PHONE_SETUP = clone(SETUP);
PHONE_SETUP.split = { from: SETUP_DAY, map: clone(SETUP.split.map) };

const SEALED = sealInventedBundle(FILE_SETUP);
const STRANGER = sealInventedBundle(STRANGER_SETUP);
/* Every day any operation in these cells can carry, so a day the mapping does
   not name refuses SOURCE_ENGINE_CONTEXT_UNPROVEN instead of passing quietly. */
const DAYS = ['2026-08-14', '2026-08-17', '2026-08-18', '2026-08-21', '2026-08-24',
  '2026-08-31', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'];
const scopeFor = tag => ({ databaseName: 'p3-pr-' + tag, namespace: 'joe/p3-pr-' + tag,
  athleteId: 'ath-p3-pr', deviceId: 'dev-p3-pr' });
/* THE PAGE'S OWN LIVE CLOCK, exactly as every accepted import cell opens it:
   an instant, so the era and every host under it take the device's real offset
   on the day they write. A declared clock with a constant tz makes admission
   refuse LOCAL_SOURCE_CONTEXT_UNRESOLVED on the installation's own operations,
   which is a different question from this one. */
const instantOn = day => day + 'T16:00:00.000Z';

/* THE FIRST RUN, through the real setup lane, with the document named by the
   cell. support.mjs's own firstRun always saves the fixture's document; the
   whole question here is what happens when the phone's document is the one the
   setup SCREENS would have written, so the document is a parameter. */
async function setupOn(era, day, setup) {
  const host = await era.createSetupHost({ day,
    commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup, tags: TAGS });
  host.close();
  assert.equal(saved.ok, true, 'the first run was refused: ' + (saved.code || saved.copy));
}

/* THE CALL SEQUENCE THE IMPORT SCREEN MAKES, with the day and the athlete's
   answer as parameters. Identical in order to support.mjs's admit(); it is
   restated here only so the execution calendar can carry this lane's days. */
async function admitAt(era, sealed, options) {
  const { day, namespace, athleteId, deviceId } = options;
  const answers = !Object.hasOwn(options, 'prefixAnswer')
    ? { identityConfirmed: true, prefixAnswer: true }
    : options.prefixAnswer === undefined ? { identityConfirmed: true }
      : { identityConfirmed: true, prefixAnswer: options.prefixAnswer };
  const { carried, platform } = await carry(era, sealed);
  if (!carried.imported) return { admitted: false, stage: 'custody', code: carried.code };
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository,
    namespace, athleteId, deviceId,
    producerRegistry: producerRegistryFor({ platform, context: held.context,
      materialDigest: held.materialDigest }, { days: DAYS }),
    asOf: () => day, platform });
  let review;
  try { review = await controller.reviewSource(carried.name); }
  catch (error) {
    return { admitted: false, stage: 'review', code: error.code || error.message };
  }
  const prepared = await controller.prepareSource(review, answers);
  if (prepared.profile !== 'earned/local-source-qualification/v1') {
    return { admitted: false, stage: 'prepare', name: carried.name, review,
      issues: clone(prepared.issues || []), families: clone(prepared.families || []),
      codes: (prepared.issues || []).map(issue => issue.code) };
  }
  const capability = localSourceCommitCapability(prepared);
  await capability.publish();
  const settled = await capability.reconcile();
  return { admitted: true, name: carried.name, view: await controller.view(settled) };
}

const openEra = async (tag, day) => {
  const scope = scopeFor(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(instantOn(day)), ...scope });
  return { era, scope };
};

/* THE CANDIDATE STATE the programme check compares, read out of the sealed
   bundle itself, so the claim "the file carries the old app's start date" is a
   measurement and not an assumption. */
test('D-PR-0 - the sealed file carries the OLD programme\'s own split.from, and '
  + 'the phone\'s setup document carries the day setup was completed', async () => {
  assert.equal(FILE_SETUP.split.from, '2026-08-31');
  assert.equal(PHONE_SETUP.split.from, SETUP_DAY);
  assert.notEqual(FILE_SETUP.split.from, PHONE_SETUP.split.from);
  assert.deepEqual(clone(FILE_SETUP.split.map), clone(PHONE_SETUP.split.map),
    'the two documents must differ in NOTHING but the start date');
  assert.deepEqual(clone(FILE_SETUP.exercises), clone(PHONE_SETUP.exercises));
  assert.deepEqual(clone(FILE_SETUP.priority_muscles), clone(PHONE_SETUP.priority_muscles));
});

/* THE GREEN SIDE. A phone whose setup document IS the file's programme, start
   date and all, admits. This is the shape every cell in the accepted corpus
   uses, which is why none of them ever met the owner's refusal. */
test('D-PR-1 (green) - phone setup document EQUAL to the file\'s programme: the '
  + 'import ADMITS', async () => {
  const { era, scope } = await openEra('green', SETUP_DAY);
  await setupOn(era, SETUP_DAY, FILE_SETUP);
  const result = await admitAt(era, SEALED, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, true,
    'the matching programme was refused: ' + JSON.stringify(result.codes || result.code));
  era.close();
});

/* THE OWNER'S PATH. The SAME answers, saved on the day he completed setup on
   the phone, and one refusal by name with nothing else beside it. */
test('D-PR-2 (red, the owner\'s path) - phone setup document identical except '
  + 'split.from = the day setup was completed: LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
  async () => {
    const { era, scope } = await openEra('owner', SETUP_DAY);
    await setupOn(era, SETUP_DAY, PHONE_SETUP);
    const before = await durable(era);
    const result = await admitAt(era, SEALED, { day: IMPORT_DAY, ...scope });
    assert.equal(result.admitted, false);
    assert.equal(result.stage, 'prepare');
    assert.deepEqual(result.issues, [{ code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED' }],
      'the controller answered something else: ' + JSON.stringify(result.issues));
    const setupFamily = result.families.filter(row => row.family === 'F4');
    assert.deepEqual(setupFamily.map(row => row.state), ['unresolved'],
      'the phone\'s own setup record is the one left unresolved');
    const after = await durable(era);
    assert.equal(after.ops, before.ops, 'an operation was minted');
    assert.equal(after.applied, false);
    assert.equal(after.basis, false);
    era.close();
  });

/* THE CODE CANNOT TELL THE TWO APART. A file from a DIFFERENT athlete (one
   lift carries four sets, not three) gets the same word as the owner's own
   history, so nothing the athlete reads distinguishes "this is not your file"
   from "you set this phone up again today". */
test('D-PR-3 (bracket: a different programme in the bundle) - another athlete\'s '
  + 'file refuses with the SAME code and no other field', async () => {
  const { era, scope } = await openEra('stranger', SETUP_DAY);
  await setupOn(era, SETUP_DAY, FILE_SETUP);
  const result = await admitAt(era, STRANGER, { day: IMPORT_DAY, ...scope });
  assert.equal(result.admitted, false);
  assert.deepEqual(result.issues, [{ code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED' }]);
  era.close();
});

/* THE IDENTITY / ORDERING ANSWER IS NOT THE LEVER. programme() runs before any
   answer is consulted, so every answer he can give gets the same refusal. */
for (const [label, prefixAnswer] of [['a Yes', true], ['a No', false],
  ['no answer at all', undefined]]) {
  test('D-PR-4 (bracket: identity answer path, ' + label + ') - the programme '
    + 'refusal is unchanged', async () => {
    const { era, scope } = await openEra('answer-' + String(prefixAnswer), SETUP_DAY);
    await setupOn(era, SETUP_DAY, PHONE_SETUP);
    const result = await admitAt(era, SEALED, { day: IMPORT_DAY, prefixAnswer, ...scope });
    assert.equal(result.admitted, false);
    assert.deepEqual(result.codes, ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED']);
    era.close();
  });
}

/* A PHONE HE HAS ALREADY USED. The owner recorded weigh-ins, food, sleep,
   measure, check-ins and workouts between installing and importing, so the
   bracket has to run with those writes present. Each one is written through
   its OWN real host, exactly as rebuild/lanes/d/p3-replay-all/writer-order.
   test.mjs writes them, and the comparison is between the two phone documents
   with the SAME writes on each. */
const USED_DAY = '2026-09-18', USED_IMPORT = '2026-09-19';
const PHONE_SETUP_USED = clone(SETUP);
PHONE_SETUP_USED.split = { from: USED_DAY, map: clone(SETUP.split.map) };
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
const ok = (what, result) => assert.equal(result.ok, true,
  what + ' refused: ' + (result.code || result.copy));

function nativeState(setup) {
  const state = clone(createCleanInitState({ setup }));
  for (const ex of state.exercises)
    ex.w = typeof ex.steps?.[0] === 'number' ? ex.steps[0] : 20;
  return state;
}

async function recordAWeek(era, setup, day) {
  const reading = await era.createReadingHost({ day });
  ok('the weigh-in', await reading.weighIn({ date: day, lb: 181.5 }));
  reading.close();
  const food = await createFoodHost({ day, era });
  ok('the food day', await food.save({ cal: 2350, pro: 178 }));
  food.close();
  const sleep = await createSleepHost({ day, era });
  ok('the night', await sleep.save({ date: '2026-09-17', hours: 7.25 }));
  sleep.close();
  const measure = await createMeasureHost({ day, era });
  assert.equal(await measure.ensureTrialStart(), day);
  ok('the waist reading', await measure.save({ date: day, in: 32.5 }));
  ok('the markers pick', await measure.saveMarkers(SETUP.exercises.map(e => e.id)));
  measure.close();
  const checkIn = await era.createCheckInHost({ day,
    commands: CheckIn.createCheckInCommands(), profile: CheckIn.PROFILE });
  ok('the check-in', await checkIn.save({ energy: 'Moderate', note: 'Invented answer' }));
  checkIn.close();
  await recordAWorkout(era, setup, day);
}

/* ONE WHOLE SESSION on the gym card - start, every prescribed slot, close -
   because a recorded workout is the write that used to be the hard one. */
async function recordAWorkout(era, setup, day) {
  const open = on => era.createGymHost({ day: on, engineState: nativeState(setup),
    plannedSplitSlotId: 'earned-today-preview/' + on });
  const gymHost = await open(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready',
    'the gym card would not prepare: ' + (ready.code || ready.phase));
  ok('the start', await gym.start());
  let view = await gym.read();
  const startId = view.startId, total = view.total;
  for (let n = 0; n <= total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    ok('the set', await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
      load: view.entry.load, reps: view.entry.reps, effort: EFFORT }));
    view = await gym.read();
  }
  assert.equal(view.complete === true || view.phase === 'complete', true,
    'the card did not reach a complete session: ' + view.phase);
  ok('the close', await gym.finish({ startId }));
  gymHost.close();
}

async function usedPhone(tag, setup) {
  const { era, scope } = await openEra(tag, USED_DAY);
  await setupOn(era, USED_DAY, setup);
  await recordAWeek(era, setup, USED_DAY);
  const result = await admitAt(era, SEALED, { day: USED_IMPORT, ...scope });
  era.close();
  return result;
}

test('D-PR-5 (bracket: with vs without pre-import writes) - a week of real host '
  + 'writes changes nothing: the DELTA between the two phone documents is '
  + 'exactly the programme code', async () => {
  const matching = await usedPhone('used-match', FILE_SETUP);
  const owner = await usedPhone('used-owner', PHONE_SETUP_USED);
  const matchingCodes = [...new Set(matching.codes || [])].sort();
  const ownerCodes = [...new Set(owner.codes || [])].sort();
  assert.equal(matchingCodes.includes('LOCAL_SOURCE_PROGRAMME_UNRESOLVED'), false,
    'the matching programme raised it too: ' + JSON.stringify(matchingCodes));
  assert.deepEqual(ownerCodes.filter(code => !matchingCodes.includes(code)),
    ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED'],
    'owner ' + JSON.stringify(ownerCodes) + ' vs matching ' + JSON.stringify(matchingCodes));
});

/* THE PRODUCT LAW BEHIND THE REFUSAL, driven through the REAL setup reducer
   and its own actions: whatever the athlete answers, the document it builds
   carries TODAY as split.from and the flow offers no other start date. A
   fresh-start owner therefore cannot make his phone carry the file's. */
test('D-PR-6 - the setup screens always write split.from = the day setup was '
  + 'completed, whatever is answered', () => {
  for (const today of ['2026-09-16', '2026-09-17', '2027-01-04']) {
    const model = createSetupModel({ today });
    model.setName('Owner');
    model.toggleDay('5'); model.setDayKind('5', 'U');
    model.toggleDay('6'); model.setDayKind('6', 'L');
    const press = model.addExercise('U');
    model.setExerciseField(press.key, 'n', 'Db bench');
    model.chooseMg(press.key, 'chest');
    model.setExerciseField(press.key, 'first', '45');
    const legs = model.addExercise('L');
    model.setExerciseField(legs.key, 'n', 'Leg press');
    model.chooseMg(legs.key, 'quads');
    model.setExerciseField(legs.key, 'first', '120');
    model.togglePriority('quads');
    const built = model.document();
    assert.equal(built.ok, true, JSON.stringify(built.missing));
    assert.equal(built.setup.split.from, today,
      'the flow found some other start date');
  }
});
