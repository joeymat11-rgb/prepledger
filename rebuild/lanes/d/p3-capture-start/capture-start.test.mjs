/* LOCAL-CAPTURE-START-RESUME - A WORKOUT RECORDED BEFORE THE IMPORT.

   ONE store, ONE installation, REAL hosts: the first run, the Measure screen
   and the gym card all write into the very generation the REAL admission
   controller replays, over real fake-indexeddb, with a real sealed bundle from
   the real port.cjs. Nothing is stubbed.

   WHAT THESE CELLS PROVE. The law is rebuild/m4/workout/engine-order.cjs:
   a Start whose record carries an issue refuses the whole order
   WORKOUT_ORDER_START_INTERPRETATION_REQUIRED, because an interpretation is
   REQUIRED and the engine will not invent one. The interpretation is the
   athlete's own answer to the identity question at source-admission.mjs:80,
   and it is carried into F3. A Yes states it; a No, an unanswered question, or
   a Yes that the records in hand contradict leave it unstated and F3 refuses by
   its own name with nothing written. No engine byte moved.

   SUMMER AND WINTER. Every case runs on an EST pair (2026-11-20/21, -05:00)
   and on an EDT pair (2026-10-16/17, -04:00), because the offset really in
   force on the day is what admission's per-op context check compares against,
   and that is what summer and winter mean to it. Both EDT days are after the
   day port.cjs seals on and before DST ends, which the mapping gate requires.

   SYNTHETIC ONLY: the bundle is invented in the OS temp folder through the
   ACCEPTED clean-init constructor and sealed by the real port.cjs with --out
   outside every git working tree. No private fixture, no ledger, no owner
   file. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, firstRun, admit, durable, liveAt,
  ownOperations, SETUP, IMPORTED_LOADS,
  SOURCE_SESSION_DAYS } from '../../../m3/w7-preview/import/test/support.mjs';
import { retractImport, listImports } from '../../../m3/w6/local/browser-entry.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { createMeasureHost } from '../../../m3/w7-preview/measure/measure-host.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

/* HIS OWN FILE, sealed once. The two extra seals below are the SAME file with a
   later last workout, which is what makes the athlete's Yes false. */
const SEALED = sealInventedBundle();
const LAST_IN_FILE = SOURCE_SESSION_DAYS[SOURCE_SESSION_DAYS.length - 1];
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };

/* The two seasons. `second` is the next day the split trains, so a second
   workout is a real one rather than a copy of the first. */
const WINTER = { name: 'winter EST', day: '2026-11-20', second: '2026-11-21',
  at: '2026-11-20T17:00:00.000Z', offset: '-05:00' };
const SUMMER = { name: 'summer EDT', day: '2026-10-16', second: '2026-10-17',
  at: '2026-10-16T16:00:00.000Z', offset: '-04:00' };
const SEASONS = [WINTER, SUMMER];

/* A file whose LAST workout is the day the phone's own workout is on, and one
   whose last workout is the day AFTER it. Under either, the athlete's Yes -
   "every workout in this file happened before this first Earned workout" - is
   FALSE, and F3 must say so rather than take the Yes at its word. */
const sealEndingOn = day => sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-17', 'L'], [day, 'U']] });
const ON_WINTER = sealEndingOn(WINTER.day), AFTER_WINTER = sealEndingOn(WINTER.second);
const ON_SUMMER = sealEndingOn(SUMMER.day), AFTER_SUMMER = sealEndingOn(SUMMER.second);
const CONTRADICTED = { [WINTER.name]: { on: ON_WINTER, after: AFTER_WINTER },
  [SUMMER.name]: { on: ON_SUMMER, after: AFTER_SUMMER } };

const ok = r => assert.equal(r.ok, true, 'the gym card refused: ' + (r.code || r.copy));

/* The engine state the gym card stands on BEFORE any import: the very athlete
   the first run records, through the ACCEPTED clean-init constructor. */
function nativeState() {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  for (const ex of state.exercises)
    ex.w = typeof ex.steps?.[0] === 'number' ? ex.steps[0] : 20;
  return state;
}

/* ONE ENROLLED INSTALLATION on the season's own day, on the S4 LIVE clock - the
   one the shipped page runs on. It matters here rather than being a preference:
   a pinned installation clock stamps -05:00 on every operation whatever the
   month (the writer-side defect P3-REPLAY-ALL carried), so only the live clock
   makes the EDT half of these cells an honest EDT. The installation scope is
   the SAME for every install so that two of them can be compared member for
   member; only the database differs. */
async function install(t, tag, season) {
  const scope = { namespace: 'joe/p3-csr', athleteId: 'ath-p3-csr', deviceId: 'dev-p3-csr' };
  const era = await eraFor({ indexedDB: new IDBFactory(), databaseName: 'p3-csr-' + tag,
    ...scope, live: liveAt(season.at) });
  t.after(() => era.close());
  await firstRun(era, season.day);
  return { era, scope: { databaseName: 'p3-csr-' + tag, ...scope } };
}

/* ONE COMPLETE WORKOUT through the REAL gym host and the REAL card model:
   start, every prescribed slot, close. The layer refuses a close while a slot
   is unanswered, which is its rule and not this cell's to work around. */
async function recordWorkout(era, day) {
  const open = d => era.createGymHost({ day: d, engineState: nativeState(),
    plannedSplitSlotId: 'earned-today-preview/' + d });
  const gymHost = await open(day);
  const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
  const ready = await gym.read();
  assert.equal(ready.phase, 'ready', day + ': ' + (ready.code || ready.phase));
  ok(await gym.start());
  let view = await gym.read();
  const startId = view.startId;
  for (let n = 0; n <= view.total; n += 1) {
    if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
    if (view.phase !== 'active') break;
    ok(await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
      load: view.entry.load, reps: view.entry.reps, effort: EFFORT }));
    view = await gym.read();
  }
  assert.equal(view.complete === true || view.phase === 'complete', true,
    'the card did not reach a complete session: ' + view.phase);
  ok(await gym.finish({ startId }));
  gymHost.close();
  return startId;
}

/* WHAT TODAY AND THE GYM CARD STAND ON, through the SAME consumer today-app
   adopts by. */
const adopted = async era => admittedLocalSourceBasis(
  (await era.generation()).generation, { namespace: era.namespace ?? null });

/* The imported history, as the athlete sees it afterwards. */
function assertImportedHistory(state) {
  assert.ok(state, 'the admitted import is not visible to Today');
  assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS,
    'the gym card is not standing on the imported lifts');
  assert.deepEqual(Object.keys(state.sessionLog).sort(), SOURCE_SESSION_DAYS,
    'the imported workout history is not what Today reads');
  assert.ok(state.reads.length >= 4, 'the imported readings did not come with it');
}

for (const season of SEASONS) {
  test('P3-CSR1 [' + season.name + '] - ONE workout recorded before the import: it ADMITS, '
    + 'Today shows the imported history AND the native workout, the native one AFTER the '
    + 'prefix, and day one is unchanged', async t => {
      const { era, scope } = await install(t, 'a-' + season.name, season);
      const measure = await createMeasureHost({ day: season.day, era });
      t.after(() => measure.close());
      const dayOne = await measure.ensureTrialStart();
      assert.equal(dayOne, season.day, 'day one is the first enrolled record\'s date');
      const startId = await recordWorkout(era, season.day);
      const staged = await durable(era);
      /* THE SEASON IS REAL, not a label: every operation this installation just
         wrote carries the offset actually in force on its own day. */
      assert.deepEqual([...new Set((await ownOperations(era)).map(o => o.utc_offset))],
        [season.offset]);

      const result = await admit(era, SEALED, { day: season.day, ...scope });
      assert.equal(result.admitted, true,
        'THE DEFECT: ' + JSON.stringify(result.codes || result.code || result.stage));
      assert.ok(result.view.families.some(r => r.family === 'F3' && r.state === 'projected'),
        'F3 did not answer for it: ' + JSON.stringify(result.view.families));

      /* THE ORDER. The imported file is the baseline, the native Start is a
         member that follows it, and its day really is after the file's last. */
      assert.deepEqual(result.view.workout_facts.order.start_ids, [startId]);
      assert.deepEqual(result.view.workout_facts.sessions.map(s => s.start_op_id), [startId]);
      assert.deepEqual(Object.keys(result.view.workout_baseline.session_log).sort(),
        SOURCE_SESSION_DAYS, 'the imported history is not the baseline');
      assert.equal(result.view.workout_facts.sessions[0].effective.local_date, season.day);
      assert.ok(season.day > LAST_IN_FILE, 'this cell is not testing what it says it is');
      assert.equal(result.view.order_map.assertion.answer, true);
      assert.equal(result.view.order_map.native_root_id, startId);
      assert.deepEqual(result.view.integration_pending, [],
        'nothing about this import is still waiting on another lane');

      assertImportedHistory(await adopted(era));
      assert.equal(await measure.trialStart(), dayOne, 'the import moved day one');
      const after = await durable(era);
      assert.equal(after.applied, true);
      assert.equal(after.ops, staged.ops, 'admission minted an operation of its own');
    });

  test('P3-CSR2 [' + season.name + '] - TWO workouts recorded before the import: both admit, '
    + 'both after the prefix, in the order the device wrote them', async t => {
      const { era, scope } = await install(t, 'b-' + season.name, season);
      const first = await recordWorkout(era, season.day);
      const second = await recordWorkout(era, season.second);
      const result = await admit(era, SEALED, { day: season.second, ...scope });
      assert.equal(result.admitted, true,
        JSON.stringify(result.codes || result.code || result.stage));
      assert.deepEqual(result.view.workout_facts.order.start_ids, [first, second]);
      assert.deepEqual(result.view.workout_facts.sessions.map(s => s.effective.local_date),
        [season.day, season.second]);
      assert.deepEqual(Object.keys(result.view.workout_baseline.session_log).sort(),
        SOURCE_SESSION_DAYS);
      assertImportedHistory(await adopted(era));
    });
}

/* THE YES THAT IS NOT TRUE. The athlete answers Yes, but the file he picked has
   a workout ON the same day as the one on the phone, or a day AFTER it, so the
   file does NOT precede it. F3 refuses by its own name, names the operation,
   writes nothing, and the entry retracts clean. */
for (const season of SEASONS) for (const where of ['on', 'after']) {
  test('P3-CSR3 [' + season.name + ', the file\'s last workout is ' + where + ' his] - a Yes '
    + 'the records contradict refuses LOCAL_SOURCE_WORKOUT_UNRESOLVED BY NAME, commits '
    + 'nothing, and retracts clean', async t => {
      const { era, scope } = await install(t, 'c-' + where + '-' + season.name, season);
      const startId = await recordWorkout(era, season.day);
      const staged = await durable(era);
      const result = await admit(era, CONTRADICTED[season.name][where],
        { day: season.second, ...scope });
      assert.equal(result.admitted, false, 'a Yes his own records contradict was taken at its word');
      assert.deepEqual(result.codes, ['LOCAL_SOURCE_WORKOUT_UNRESOLVED'],
        JSON.stringify(result.codes));
      assert.deepEqual(result.issues.map(i => i.op_id), [startId],
        'the refusal does not name the Start it is about');
      const after = await durable(era);
      assert.equal(after.applied, false);
      assert.equal(after.basis, false);
      assert.equal(after.ops, staged.ops, 'a refusal minted an operation');

      /* AND THE ENTRY LEAVES NO RESIDUE (P3-IMPORT-RETRACT). */
      const retracted = await retractImport(era.client, result.name, 'review-refused');
      assert.equal(retracted.retracted, true, JSON.stringify(retracted.code));
      assert.deepEqual(await listImports(era.client), []);
      const clean = await durable(era);
      assert.deepEqual(clean.imports, []);
      assert.equal(clean.ops, staged.ops);
      assert.equal(clean.basis, false);
    });
}

/* NO, AND THE QUESTION HE NEVER ANSWERED. Both leave the interpretation
   unstated, so F3 refuses exactly as it did before this ticket: no basis, no
   operation of admission's own, nothing for Today to adopt. */
for (const season of SEASONS) for (const answer of [false, undefined]) {
  test('P3-CSR4 [' + season.name + ', ' + (answer === false ? 'a No' : 'no answer at all')
    + '] - the pre-import workout stays uninterpreted, F3 refuses by name and NOTHING is '
    + 'written', async t => {
      const { era, scope } = await install(t, 'd-' + String(answer) + '-' + season.name, season);
      await recordWorkout(era, season.day);
      const staged = await durable(era);
      const result = await admit(era, SEALED,
        { day: season.day, ...scope, prefixAnswer: answer });
      assert.equal(result.admitted, false, 'an unstated interpretation admitted anyway');
      assert.deepEqual(result.codes, ['LOCAL_SOURCE_WORKOUT_UNRESOLVED'],
        JSON.stringify(result.codes));
      const after = await durable(era);
      assert.equal(after.applied, false);
      assert.equal(after.basis, false);
      assert.equal(after.ops, staged.ops);
      assert.equal(await adopted(era), null, 'Today adopted something from a refused import');
      /* The file is still only IN CUSTODY, never admitted: the entry is there
         and still asks to be rebased, which is the shape :472 (b) named and
         P3-IMPORT-RETRACT answered. */
      assert.deepEqual(after.rebaseRequired, [result.name]);
      assert.equal((await retractImport(era.client, result.name, 'athlete-cancelled')).retracted, true);
      const clean = await durable(era);
      assert.deepEqual(clean.imports, []);
      assert.equal(clean.ops, staged.ops);
    });
}

/* THE MIRROR. Two installations of the SAME athlete on the same day do the same
   two things in opposite orders: A records the workout and then imports; B
   imports and then records the same workout. What the athlete is left standing
   on has to be the same, and it is measured member for member rather than
   asserted. The basis RECORD cannot be identical, and the six members that
   differ are named here with their reason instead of being waved at: B's
   generation simply does not hold the workout yet when it admits. */
const MIRROR_DIFFERS = ['era_id', 'checkpoint_digest', 'local_selection_id',
  'operation_digest', 'interpretation_digest', 'order_map_digest'];

for (const season of SEASONS) {
  test('P3-CSR5 [' + season.name + '] - record then import leaves the athlete on exactly the '
    + 'state that import then record leaves him on, member for member', async t => {
      const a = await install(t, 'm-a-' + season.name, season);
      const mA = await createMeasureHost({ day: season.day, era: a.era });
      t.after(() => mA.close());
      const dayOneA = await mA.ensureTrialStart();
      await recordWorkout(a.era, season.day);
      const rA = await admit(a.era, SEALED, { day: season.day, ...a.scope });
      assert.equal(rA.admitted, true, JSON.stringify(rA.codes || rA.code || rA.stage));

      const b = await install(t, 'm-b-' + season.name, season);
      const mB = await createMeasureHost({ day: season.day, era: b.era });
      t.after(() => mB.close());
      const dayOneB = await mB.ensureTrialStart();
      const rB = await admit(b.era, SEALED, { day: season.day, ...b.scope });
      assert.equal(rB.admitted, true, JSON.stringify(rB.codes || rB.code || rB.stage));
      await recordWorkout(b.era, season.day);

      assert.deepEqual(await adopted(a.era), await adopted(b.era),
        'the two orders leave Today on different state');
      assert.equal(dayOneA, dayOneB);
      assert.equal(await mA.trialStart(), await mB.trialStart(), 'day one moved with the order');
      const differ = Object.keys(rA.view.basis).filter(k =>
        JSON.stringify(rA.view.basis[k]) !== JSON.stringify(rB.view.basis[k]));
      assert.deepEqual(differ.sort(), MIRROR_DIFFERS.slice().sort(),
        'a basis member changed with the order that should not have: ' + JSON.stringify(differ));
    });
}
