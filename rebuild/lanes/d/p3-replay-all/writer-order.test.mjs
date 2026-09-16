/* P3-REPLAY-ALL-FAMILIES - EVERY WRITER THE SHIPPED PAGE HAS, ON A REAL
   INSTALLATION, IN BOTH ORDERS.

   ONE store, ONE installation: each REAL host writes its own records into the
   very generation the REAL admission controller replays, over real
   fake-indexeddb, with a real sealed bundle from the real port.cjs. Nothing is
   stubbed.

   The register the enumeration cell checks says which family answers for each
   writer; these cells stand each writer up through its own host and prove it.
   P3-RM1/RM2 on the base did this for Measure and are unchanged; the sleep half
   is the executed answer to RV-S1, which was reproduced RED through this very
   host before F8 existed (admitted:false, ["LOCAL_SOURCE_CONTEXT_UNRESOLVED"]).

   THE DAY IS 2026-11-20, AND THE INSTALLATION CLOCK IS THE PINNED ONE, for two
   reasons that are both about proving the writers rather than about replay.
   (a) It is a day in the harness's own execution calendar that the first run's
   split trains on, and a cell that cannot start a workout cannot prove the
   session writer. (b) It is an EST day, so the pinned instant's -05:00 is the
   offset really in force and admission's per-op context check is satisfied
   honestly rather than by being avoided. The pinned installation clock is what
   lets food-host.mjs and machine-settings-host.mjs write at all: both pin
   `clientClockFor(day)` of their own, and under the page's LIVE installation
   clock their save is refused state 20 before anything is written. That is a
   writer-side defect this ticket found and did NOT fix - no writer byte is
   touched here - and it is carried as an open item of the author report.

   SYNTHETIC ONLY: the bundle is invented in the OS temp folder through the
   ACCEPTED clean-init constructor and sealed by the real port.cjs with --out
   outside every git working tree. No private fixture, no ledger, no owner
   file. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, eraFor, firstRun, admit, durable,
  SETUP, IMPORTED_LOADS } from '../../../m3/w7-preview/import/test/support.mjs';
import { createSleepHost } from '../../../m3/w7-preview/today/sleep-host.mjs';
import { createFoodHost } from '../../../m3/w7-preview/today/food-host.mjs';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import { createMeasureHost } from '../../../m3/w7-preview/measure/measure-host.mjs';
import { createGymModel } from '../../../m3/w7-preview/today/gym-model.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import CheckIn from '../../../m3/w7-preview/today/checkin-commands.cjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const SEALED = sealInventedBundle();
const DAY = '2026-11-20';
/* The installation clock this page pins when no live instant is declared, byte
   for byte as today-bindings.mjs builds it: one instant on the host's own day. */
const CLOCK = { today: () => DAY, now: () => DAY + 'T13:00:00.000Z', tz: '-05:00',
  monotonicMs: () => 0 };
const NIGHT = { date: '2026-11-19', hours: 7.25 };
const WAIST = { date: DAY, in: 32.5 };
const MARKERS = SETUP.exercises.map(e => e.id);
const EFFORT = { tag: 'exact', value: 2, unit: 'rep' };
const ok = (what, r) => assert.equal(r.ok, true, what + ' refused: ' + (r.code || r.copy));
const scopeFor = tag => ({ databaseName: 'p3-raf-' + tag, namespace: 'joe/p3-raf-' + tag,
  athleteId: 'ath-p3-raf', deviceId: 'dev-p3-raf' });

/* The engine state the gym card stands on before any import: the very athlete
   the first run records, built by the ACCEPTED clean-init constructor, with a
   working load per lift so the card has something to prescribe. */
function nativeState() {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  for (const ex of state.exercises)
    ex.w = typeof ex.steps?.[0] === 'number' ? ex.steps[0] : 20;
  return state;
}

/* ONE WRITER, ONE HOST, THROUGH THE REAL LANE. Each entry is the writer exactly
   as rebuild/m4/import/replay-registry.cjs names it: the family that must
   answer for it, the host that writes it, and what the screen reads back off
   this device afterwards. `use` returns { close, read }. */
const WRITERS = {
  'reading (the morning weigh-in)': { family: 'F1', async use(era) {
    const host = await era.createReadingHost({ day: DAY });
    ok('the weigh-in', await host.weighIn({ date: DAY, lb: 181.5 }));
    return { close: () => host.close(), read: async () => host.reads().map(r => [r.date, r.lb]) };
  } },
  'food (the day\'s intake)': { family: 'F2', async use(era) {
    const host = await createFoodHost({ day: DAY, era });
    ok('the food day', await host.save({ cal: 2350, pro: 178 }));
    return { close: () => host.close(), read: async () => (await host.all()).map(r => r.date) };
  } },
  /* THE ONE WRITER THIS TICKET DOES NOT CLOSE, and it is named rather than
     hidden. A workout recorded BEFORE importing is answered by F3 - it never
     reaches the catch-all and no family is missing - but F3's own law refuses
     it: the session was prescribed from the pre-import athlete, and under the
     imported basis its start record comes back with issues, so
     rebuild/m4/workout/engine-order.cjs raises
     WORKOUT_ORDER_START_INTERPRETATION_REQUIRED and admission reports its own
     LOCAL_SOURCE_WORKOUT_UNRESOLVED. That is the accepted law of the workout
     lane (`integration_pending: ['local-capture-start-resume']`), not a replay
     gap, and it is why the runbook's ordering instruction still names the gym
     card and nothing else. The reverse order admits, which is what P3-WO2
     proves for this writer too. */
  'session (the gym card: start, every set, close)': { family: 'F3',
    refusal: 'LOCAL_SOURCE_WORKOUT_UNRESOLVED', async use(era) {
    const open = day => era.createGymHost({ day, engineState: nativeState(),
      plannedSplitSlotId: 'earned-today-preview/' + day });
    const gymHost = await open(DAY);
    const gym = createGymModel({ gymHost, sessionTitle: null, hostForDay: open });
    const ready = await gym.read();
    assert.equal(ready.phase, 'ready', 'the gym card would not prepare: ' + (ready.code || ready.phase));
    ok('the start', await gym.start());
    /* Every prescribed slot, through the card's own view each time - the layer
       refuses a close while a slot is unanswered (WORKOUT_RESUME_INCOMPLETE),
       which is its rule and not this cell's to work around. */
    let view = await gym.read();
    const startId = view.startId;
    const total = view.total;
    for (let n = 0; n <= total; n += 1) {
      /* A recorded set leaves the card on its own saved-set screen; dismissing
         it is what the athlete's next tap does. When every slot is answered the
         card stays there and says so, which is the end of the session. */
      if (view.phase === 'saved' && view.complete !== true) { gym.forget(); view = await gym.read(); }
      if (view.phase !== 'active') break;
      ok('the set', await gym.logSet({ startId, slot: view.set.slot, lift: view.set.lift,
        load: view.entry.load, reps: view.entry.reps, effort: EFFORT }));
      view = await gym.read();
    }
    assert.equal(view.complete === true || view.phase === 'complete', true,
      'the card did not reach a complete session: ' + view.phase + ' ' + view.done + '/' + view.total);
    ok('the close', await gym.finish({ startId }));
    return { close: () => gymHost.close(), read: async () => (await gym.read()).phase };
  } },
  'machine settings (the coach\'s note on a lift)': { family: 'F4', async use(era) {
    const host = await createMachineSettingsHost({ day: DAY, era });
    ok('the machine note', await host.save({ exercise_id: SETUP.exercises[0].id,
      settings: [{ name: 'Seat', value: 'four' }] }));
    return { close: () => host.close(), read: async () => (await host.all()).length };
  } },
  'check-in (the recovery answers)': { family: 'F5', async use(era) {
    const host = await era.createCheckInHost({ day: DAY,
      commands: CheckIn.createCheckInCommands(), profile: CheckIn.PROFILE });
    ok('the check-in', await host.save({ energy: 'Moderate', note: 'Invented answer' }));
    return { close: () => host.close(), read: async () => (await host.all()).map(r => r.date) };
  } },
  'measure (day one, a waist reading, the markers pick)': { family: 'F7', async use(era) {
    const host = await createMeasureHost({ day: DAY, era });
    assert.equal(await host.ensureTrialStart(), DAY);
    ok('the waist reading', await host.save(WAIST));
    ok('the markers pick', await host.saveMarkers(MARKERS));
    return { close: () => host.close(),
      read: async () => [await host.trialStart(), (await host.all()).length, (await host.markers()).length] };
  } },
  'sleep (one recorded night)': { family: 'F8', async use(era) {
    const host = await createSleepHost({ day: DAY, era });
    ok('the night', await host.save(NIGHT));
    return { close: () => host.close(), read: async () => (await host.all()).map(r => r.night.date) };
  } },
};

const importedState = async era => admittedLocalSourceBasis(
  (await era.generation()).generation, { namespace: era.namespace ?? null });
const open = async (t, tag) => {
  const scope = scopeFor(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), clock: CLOCK, ...scope });
  t.after(() => era.close());
  await firstRun(era, DAY);
  return { era, scope };
};

for (const [what, writer] of Object.entries(WRITERS)) {
  test('P3-WO1 [' + what + '] - USED BEFORE IMPORTING, the import '
    + (writer.refusal ? 'refuses ' + writer.refusal + ' BY NAME (' + writer.family
      + '\'s own law, never a missing family) and commits nothing'
      : 'ADMITS through the real controller, ' + writer.family + ' answers for it, and Today '
        + 'and the gym card read the imported history afterwards'), async t => {
      const tag = 'a-' + writer.family;
      const { era, scope } = await open(t, tag);
      const used = await writer.use(era);
      t.after(() => used.close());
      const before = await used.read();
      const staged = await durable(era);
      assert.ok(staged.ops > 1, 'this writer wrote nothing, so this cell measures nothing');

      const result = await admit(era, SEALED, { day: DAY, ...scope });
      if (writer.refusal) {
        /* NAMED, NEVER THE CATCH-ALL. This writer has a family; what refuses is
           that family's own law, stated in its own code, and nothing is
           committed. See the note beside this writer above. */
        assert.equal(result.admitted, false, 'this writer now admits: the runbook line for it '
          + 'and the open item in the author report must both go');
        assert.deepEqual(result.codes, [writer.refusal], JSON.stringify(result.codes));
        const after = await durable(era);
        assert.equal(after.applied, false);
        assert.equal(after.basis, false);
        assert.equal(after.ops, staged.ops, 'a refusal minted an operation');
        return;
      }
      assert.equal(result.admitted, true,
        'THE DEFECT: ' + JSON.stringify(result.codes || result.code || result.stage));
      assert.ok(result.view.families.some(row => row.family === writer.family),
        writer.family + ' did not answer for it: ' + JSON.stringify(result.view.families));

      /* TODAY AND THE GYM CARD, through the SAME consumer today-app adopts by. */
      const state = await importedState(era);
      assert.ok(state, 'the admitted import is not visible to Today');
      assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS,
        'the gym card is not standing on the imported lifts');
      assert.ok(state.reads.length >= 4 && Object.keys(state.sessionLog).length === 3);
      /* AND THE SCREEN THAT WROTE IT still reads what this device holds. */
      assert.deepEqual(await used.read(), before,
        'the import moved something this screen reads off the device');
    });

  test('P3-WO2 [' + what + '] - THE REVERSE ORDER, import first then the writer: it still '
    + 'admits, the writer still writes, and the imported history is still what Today reads',
    async t => {
      const tag = 'b-' + writer.family;
      const { era, scope } = await open(t, tag);
      const result = await admit(era, SEALED, { day: DAY, ...scope });
      assert.equal(result.admitted, true,
        JSON.stringify(result.codes || result.code || result.stage));
      assert.equal(result.view.families.some(row => row.family === writer.family
        && writer.family !== 'F4'), false,
        'nothing of this writer exists yet, so ' + writer.family + ' must answer for nothing');
      const used = await writer.use(era);
      t.after(() => used.close());
      assert.ok(await used.read());
      const state = await importedState(era);
      assert.ok(state, 'the admitted import stopped being visible once the screen was used');
      assert.deepEqual(state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
    });
}
