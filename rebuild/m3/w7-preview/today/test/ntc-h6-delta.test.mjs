/* B-NTC — H6, THE GYM-CARD WIRING: THE A2 DELTA CELLS, MEASURED.
   ==============================================================

   These are the delta cells DECISIONS:108 (a) asks for ("A2-REPORT §9.1 table
   becomes the delta cells") and (b) licenses lane B to land beside the one
   gym-host.mjs hunk. Every figure below was MEASURED on the merged tip with the
   patch applied; none is predicted. The names G1…G7 are the cells of
   rebuild/lanes/b/ntc/gym-host.wiring.patch, in its order.

   THERE IS NO OPTION. DECISIONS:109 ruled PATH A and removed
   `mapRecordedDaysWithEnginePredicates` as an option: `createGymHost` no longer
   takes it, `createDayFactsReader` no longer takes it, and mapping an athlete's
   RECORDED nights and events through the ENGINE's own `dayWeather` +
   `cleanAtDate` is simply what the page does. `createGymHost` is called here
   exactly as today-entry.mjs calls it, so these cells describe the shipped tree.

   The surface that carries those two predicates is re-pinned BY THIS PACKAGE:
   `EXPOSED` is ['genSession','rirPlan','dayWeather','cleanAtDate'] at
   rebuild/m4/workout/engine-runtime.cjs:30 and at its host mirror
   rebuild/m3/w6/host/engine-runtime-host.cjs:45 — the child superseding the
   parent's execution pin exactly as M2-NATIVE-CARRIERS superseded
   M2-LOAD-WRITES'. The provider cells
   (rebuild/m4/workout/test/native-trend-context.test.cjs, group G) assert that
   re-pin directly; these cells assert what it does to the SCREEN.

   THE TWO ATHLETES — and DECISIONS:109 requires BOTH, through the same reader:

     * OBLIGATION (ii) · THE PRODUCT ATHLETE — `createTodayModel({}).stateFromOps()`,
       which today-entry.mjs and gym.test.mjs both pass to createGymHost. It
       carries 28 RECORDED SLEEP NIGHTS. Before this pass the qualified
       provider's empty-history day reader refused `recorded_sleep_unmapped` for
       every date and the gym card stayed shut (G1/G2/G3 were LOCKED at that
       refusal). Those three cells are now the OBSERVED opposite: day+3 prepares,
       is Started, every set is logged and it closes (G1, G4), and the days after
       it are engine rest days rather than refusals (G2).

     * OBLIGATION (i) · THE FRESH ATHLETE — `createCleanInitState`,
       DECISIONS:100's athlete: no recorded night, no recorded event. This was
       already proven at d78aff4 and it still holds, now through the SAME engine
       predicates rather than a second reader: `cleanAtDate` returns true on its
       own first line for an empty nights list and `dayWeather` produces no
       `k:"event"` flag for an empty events list. Day+3 on the same lift group
       prepares and is conducted (G5) with previous performance intact (G6). This
       is A2-REPORT §9.1's "day+3 2030-02-07 probe=blocked
       PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED", removed for both athletes.

   ONE WORKING LOAD, STATED OUT LOUD (B-NTC journey step 17; review r1 O1). A
   clean-init lift starts at `w: null`, which the engine reads as a permanent
   DEBUT, and a DEBUT never reaches liftTrend — so an untouched clean-init
   athlete never asks for a trend context at all. Nothing in the product writes
   `w` back yet (the unowned item review r1 routes to the PM). So this fixture
   sets one working load per lift from that lift's own declared `steps`, and says
   so. Nothing else about the clean-init state is changed. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { faultDatabase } from '../../../w6/test/support.mjs';
import { createGymHost } from '../gym-host.mjs';
import { createGymModel, EFFORT_CHOICES } from '../gym-model.mjs';
import TodayModel from '../today-model.cjs';
import AthleteState from '../../../../m4/workout/athlete-state.cjs';

const { createTodayModel, SYNTHETIC_DAY } = TodayModel;
const { createCleanInitState } = AthleteState;

/* Synthetic, public, non-secret — the same posture as the journey's own fixture
   (rebuild/m3/w6/host/test/journey-fixture.cjs), with ONE difference, declared:
   the split map puts the second U day at day+3 rather than day+7, so this cell
   measures the very offset A2-REPORT §9.1 names. 2026-09-04 is a Friday. */
const FRESH_DAY = '2026-09-04';
const SETUP = Object.freeze({
  athlete_label: 'synthetic B-NTC delta-cell athlete',
  split: { from: '2026-08-31', map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'REST', 5: 'U', 6: 'L' } },
  exercises: [
    { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40, 45, 50] },
    { id: 'lat-pulldown', n: 'Lat pulldown', mg: 'back', day: 'U', sets: 2, hi: 12, inc: 10, steps: [50, 60, 70, 80, 90] },
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] },
  ],
  priority_muscles: ['chest'],
});
const WORKING_LOAD = Object.freeze({ 'db-bench': 35, 'lat-pulldown': 60, 'leg-press': 100 });

function freshAthlete() {
  const state = structuredClone(createCleanInitState({ setup: SETUP }));
  for (const exercise of state.exercises) exercise.w = WORKING_LOAD[exercise.id];
  return state;
}
function productAthlete() {
  const state = createTodayModel({}).stateFromOps();
  state.sessionLog = {};            // exactly as gym.test.mjs:569-570 builds it
  return state;
}

/* `on(day)` is A PAGE LOAD — a new host over the SAME device storage and key
   store, the way A2's own lane() does it. Nothing is carried in memory between
   days, so a cell that says "day+3 prepares" is saying it about a real reopen. */
async function lane(state, label) {
  const fault = faultDatabase();
  return { async on(day) {
    const host = await createGymHost({ day, engineState: state, indexedDB: fault.indexedDB,
      crypto: webcrypto, plannedSplitSlotId: 'slot', databaseName: 'ntc-h6-' + label });
    return { host, model: createGymModel({ gymHost: host, sessionTitle: 'T' }) };
  } };
}
const opCount = async host => Object.keys((await host.repository.load()).generation.collections.ops || {}).length;
const offsetDay = (day, days) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};
const CHOSEN = EFFORT_CHOICES.find(c => c.label === '2').reserve;

/* One whole training day through the screen's own actions — probe, Start, every
   set, Finish — and a record of what was logged, so a later cell can compare the
   engine's own `card.prev` against the facts this athlete actually recorded. */
async function conductDay(handle) {
  const before = await opCount(handle.host);
  const probe = await handle.model.read();
  if (probe.phase !== 'ready') return { probe: probe.phase, code: probe.code, copy: probe.copy, before, after: before, logged: [] };
  const started = await handle.model.start();
  if (!started.ok) return { probe: probe.phase, startRefused: started.code, before, after: await opCount(handle.host), logged: [] };
  const logged = [];
  for (let guard = 0; guard < 40; guard++) {
    const view = await handle.model.read();
    if (view.phase === 'saved') { if (view.complete) break; handle.model.forget(); continue; }
    if (view.phase !== 'active') break;
    const result = await handle.model.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
      load: String(view.entry.load), reps: String(view.entry.reps), effort: CHOSEN });
    assert(result.ok, 'set refused: ' + result.code);
    logged.push({ lift: view.set.lift, position: view.set.position, load: view.entry.load, reps: view.entry.reps });
    handle.model.forget();
  }
  const last = await handle.model.read();
  const closed = await handle.model.finish({ startId: last.startId });
  const settled = await handle.model.read();
  return { probe: probe.phase, closed: closed.ok, closeCode: closed.code || null, settled: settled.phase,
    before, after: await opCount(handle.host), logged };
}

/* The two training days every fresh-athlete cell below starts from: day+0 (U)
   and day+1 (L), each on its own page load. Returns the lane and what day+0
   recorded. */
async function trainedFreshLane(label) {
  const L = await lane(freshAthlete(), label);
  let dayZero = null;
  for (const offset of [0, 1]) {
    const handle = await L.on(offsetDay(FRESH_DAY, offset));
    const done = await conductDay(handle);
    assert.equal(done.probe, 'ready', 'day+' + offset + ' prepares: ' + done.code);
    assert.equal(done.closed, true, 'day+' + offset + ' closes: ' + done.closeCode);
    if (offset === 0) dayZero = done;
    handle.host.close();
  }
  return { L, dayZero };
}

/* ---------------------------------------------------------------------------
   G1 · G2 · G3 · G4 — OBLIGATION (ii): THE 28-NIGHT PRODUCT ATHLETE OPENS.
   Brief v1 predicted these cells would flip on the wiring alone. Review r1
   measured that they did not — 28 recorded nights, the empty-history reader
   refusing `recorded_sleep_unmapped` for every date — and d78aff4 committed
   them LOCKED at that refusal, with the reason named. DECISIONS:109 ruled the
   fix (PATH A, inside this package), and these are the re-measurements: the
   engine's own two day predicates now answer for this athlete, so the wall is
   gone. Every figure below was measured on this tree; none is predicted.
   --------------------------------------------------------------------------- */

test('B-NTC G1 — OBLIGATION (ii): the product athlete\'s day+3 wall is GONE (was gym.test.mjs:621)', async () => {
  const state = productAthlete();
  assert.equal(state.sleep.nights.length, 28, 'the athlete the shipped page passes carries 28 recorded nights');
  assert.equal((state.events || []).length, 0);
  const L = await lane(state, 'g1');
  for (const offset of [0, 1]) {
    const handle = await L.on(offsetDay(SYNTHETIC_DAY, offset));
    const done = await conductDay(handle);
    assert.equal(done.probe, 'ready');
    assert.equal(done.after, (offset + 1) * 6, 'day+' + offset + ' is on disk');
    handle.host.close();
  }
  const handle = await L.on(offsetDay(SYNTHETIC_DAY, 3));
  const view = await handle.model.read();
  /* THE DELTA THIS PASS EXISTS FOR. At d78aff4 this same read returned
     phase 'blocked' / code PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED /
     copy 'resolver_failed', because 28 recorded nights could not be mapped. */
  assert.equal(view.phase, 'ready', 'day+3 prepares: ' + (view.code || ''));
  assert.equal(view.code, undefined, 'no refusal code at all');
  assert.equal(handle.host.host.lastProducerRefusal(), null, 'and the producer refused nothing');
  assert.deepEqual([view.lift.id, view.lift.count], ['demo-press', 2], 'day+3 is day+0\'s own lift group');
  const started = await handle.model.start();
  assert.equal(started.ok, true, 'Start is OFFERED and accepted: ' + (started.code || ''));
  handle.host.close();
});

test('B-NTC G2 — the days after the wall are ENGINE days now, not refusals (was gym.test.mjs:639)', async () => {
  const L = await lane(productAthlete(), 'g2');
  for (const offset of [0, 1]) {
    const handle = await L.on(offsetDay(SYNTHETIC_DAY, offset));
    assert.equal((await conductDay(handle)).closed, true);
    handle.host.close();
  }
  const seen = [];
  for (const offset of [4, 5, 6, 7, 10, 14]) {
    const handle = await L.on(offsetDay(SYNTHETIC_DAY, offset));
    const view = await handle.model.read();
    if (view.phase === 'blocked')
      assert.equal(view.code, 'ENGINE_CAPTURE_NO_WORKOUT',
        'day+' + offset + ' may only be blocked because the split has no workout: ' + view.code);
    const read = await handle.host.host.client.readWorkoutHistory();
    assert.equal(read.read, true, 'the durable history still reads on day+' + offset);
    assert.equal(read.history.sessions.length, 2);
    assert.equal(await opCount(handle.host), 12, 'day+' + offset + ' writes nothing');
    seen.push(view.phase === 'blocked' ? view.code : view.phase);
    handle.host.close();
  }
  /* MEASURED. At d78aff4 this array was
     ['PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED','ENGINE_CAPTURE_NO_WORKOUT',
      'ENGINE_CAPTURE_NO_WORKOUT','PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED',
      'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED','PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'].
     Four of the six were the trend-context wall; none is now. The two that stay
     blocked are day+5 and day+6, which the split simply gives no workout. */
  assert.deepEqual(seen, ['ready', 'ENGINE_CAPTURE_NO_WORKOUT', 'ENGINE_CAPTURE_NO_WORKOUT',
    'ready', 'ready', 'ready'],
    'the measured shape of the days after the wall, with the mapping shipped');
  assert.equal(seen.includes('PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'), false,
    'not one day refuses for want of a trend context any more');
});

test('B-NTC G3 — the composed day reader reports the ENGINE\'s own predicates (was gym.test.mjs:657)', async () => {
  const L = await lane(productAthlete(), 'g3');
  for (const offset of [0, 1]) {
    const handle = await L.on(offsetDay(SYNTHETIC_DAY, offset));
    assert.equal((await conductDay(handle)).closed, true);
    handle.host.close();
  }
  const handle = await L.on(offsetDay(SYNTHETIC_DAY, 3));
  await handle.model.read();
  assert.equal(handle.host.host.lastProducerRefusal(), null,
    'the producer refusal that stood at d78aff4 is gone');
  /* The wiring reports which reader it composed instead of leaving a reader to
     assume. EXPOSED is now ['genSession','rirPlan','dayWeather','cleanAtDate'],
     re-pinned by this package, so the engine's own two day predicates ARE
     obtainable — and there is no option left to ask for. */
  assert.deepEqual(handle.host.trendDayReader(),
    { enginePredicates: true, enginePredicatesAvailable: true });
  assert.equal(Object.hasOwn(handle.host.trendDayReader(), 'optionRequested'), false,
    'the option is removed as an option, not reported as off');
  assert.throws(() => handle.host.trendBinding.resolve({ start_op_id: 'x', source_revision: 1, effective: {} }),
    { code: 'NATIVE_TREND_CONTEXT_UNQUALIFIED', reason: 'no_bound_source_facts' },
    'outside a preparation window the resolver answers nothing at all');
  handle.host.close();
});

test('B-NTC G4 — OBLIGATION (ii) CONDUCTED: the 28-night athlete trains day+3 end to end', async () => {
  /* A probe alone proves nothing (A2 review round 2). This is the whole day, on
     its own page load, over the same device storage: Start, every set, Finish. */
  const L = await lane(productAthlete(), 'g4');
  for (const offset of [0, 1]) {
    const handle = await L.on(offsetDay(SYNTHETIC_DAY, offset));
    assert.equal((await conductDay(handle)).closed, true);
    handle.host.close();
  }
  const handle = await L.on(offsetDay(SYNTHETIC_DAY, 3));
  const done = await conductDay(handle);
  assert.equal(done.probe, 'ready');
  assert.equal(done.closed, true, 'day+3 closes: ' + done.closeCode);
  assert.equal(done.settled, 'finished');
  assert.equal(done.before, 12);
  assert.equal(done.after, 18, 'a third whole session really is on disk (12 -> 18)');
  assert.deepEqual(done.logged.map(entry => [entry.lift, entry.position]),
    [['demo-press', 1], ['demo-press', 2], ['demo-row', 1], ['demo-row', 2]],
    'every set of day+3 was logged, in order');
  const read = await handle.host.host.client.readWorkoutHistory();
  assert.equal(read.read, true);
  assert.equal(read.history.sessions.length, 3, 'three recorded sessions, none stranded');
  assert.deepEqual([...handle.model.previous().keys()].sort(), ['demo-press', 'demo-row'],
    'and the engine hands back previous performance for both of day+3\'s lifts');
  handle.host.close();
});

/* ---------------------------------------------------------------------------
   G5 — THE CELL DECISIONS:108 ASKS TO BE PROVEN.
   A2-REPORT §9.1: "a FRESH athlete gets TWO whole training days, and the first
   genuine engine wall bites on day +3 … PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED
   … day +3 comes back to day 0's lifts". With the qualified provider wired that
   day is prepared, Started, logged and closed.

   THIS CELL IS UNCHANGED IN OUTCOME by DECISIONS:109, and that is the point:
   obligation (i) was discharged at d78aff4 by the empty-history reader, and it
   is discharged here by the ENGINE's own two predicates over the same empty
   state, because `cleanAtDate` returns true on its own first line for an empty
   nights list and `dayWeather` produces no `k:"event"` flag for an empty events
   list. One reader now serves both athletes; the fresh one is not being proven
   by a mechanism that differs from the one that ships.
   --------------------------------------------------------------------------- */

test('B-NTC G5 — OBLIGATION (i): a FRESH athlete\'s day+3 on the SAME lift group prepares and is conducted', async () => {
  const { L, dayZero } = await trainedFreshLane('g5');
  assert.equal(dayZero.after, 7, 'day+0: one Start, five sets, one close');

  const rest = await L.on(offsetDay(FRESH_DAY, 2));
  const restView = await rest.model.read();
  assert.equal(restView.phase, 'blocked');
  assert.equal(restView.code, 'ENGINE_CAPTURE_NO_WORKOUT', 'day+2 is a rest day, not a refusal');
  rest.host.close();

  const handle = await L.on(offsetDay(FRESH_DAY, 3));
  const view = await handle.model.read();
  /* THE DELTA. Before this wiring the same read returned
     phase 'blocked' / code PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED /
     copy 'resolver_failed' — A2-REPORT §9.1's day+3 row. */
  assert.equal(view.phase, 'ready', 'day+3 prepares: ' + (view.code || ''));
  assert.equal(handle.host.host.lastProducerRefusal(), null, 'no producer refusal on the qualified path');
  assert.equal(handle.host.trendDayReader().enginePredicates, true,
    'and it does so through the ENGINE\'s own predicates — the same reader the 28-night athlete gets');
  assert.deepEqual([view.lift.id, view.lift.count], ['db-bench', 2], 'day+3 is day+0\'s own lift group');
  handle.host.close();

  /* A probe alone proves nothing (A2 review round 2). Conduct the whole day. */
  const conducted = await L.on(offsetDay(FRESH_DAY, 3));
  const done = await conductDay(conducted);
  assert.equal(done.probe, 'ready');
  assert.equal(done.closed, true, 'day+3 closes: ' + done.closeCode);
  assert.equal(done.settled, 'finished');
  assert.equal(done.before, 12);
  assert.equal(done.after, 19, 'a third whole session really is on disk');
  const read = await conducted.host.host.client.readWorkoutHistory();
  assert.equal(read.read, true);
  assert.equal(read.history.sessions.length, 3, 'three recorded sessions, none stranded');
  conducted.host.close();
});

/* ---------------------------------------------------------------------------
   G6 — THE BIND WINDOW (review r1 F3 / C3). gym-model.readPrevious() re-runs the
   accepted reader AFTER the producer returned. With a window that lived only
   inside workoutProducer that read threw, gym-model.mjs:136 swallowed it, and
   the card showed NO previous performance on exactly the days this package
   unblocks. The patch puts the window on the engine handle instead.
   --------------------------------------------------------------------------- */

test('B-NTC G6 — previous performance survives the bind window on the day the provider opens', async () => {
  const { L, dayZero } = await trainedFreshLane('g6');
  const handle = await L.on(offsetDay(FRESH_DAY, 3));
  const view = await handle.model.read();
  assert.equal(view.phase, 'ready');

  const previous = handle.model.previous();
  assert.equal(previous.size, 2, 'both of day+3\'s lifts carry a previous performance');
  for (const lift of ['db-bench', 'lat-pulldown']) {
    const prev = previous.get(lift);
    assert(prev, lift + ' has no previous record');
    assert.equal(prev.profile, 'earned/performed-lift/v1', 'the engine\'s own record, not a copy');
    assert.equal(prev.lift_lineage_id, lift);
    const recorded = dayZero.logged.filter(entry => entry.lift === lift);
    const performed = prev.slots.filter(slot => slot.state === 'performed');
    assert.equal(performed.length, recorded.length, lift + ': every set day+0 logged is on the record');
    assert.deepEqual(performed.map(slot => [slot.fact.current.load.value, slot.fact.current.reps.value]),
      recorded.map(entry => [entry.load, entry.reps]),
      lift + ': the previous record carries the facts this athlete actually recorded');
  }

  /* The control. The same read outside a window answers nothing — so the two
     records above are the window's doing, not an accident of ordering. */
  assert.throws(() => handle.host.trendBinding.resolve({ start_op_id: 'x', source_revision: 1, effective: {} }),
    { code: 'NATIVE_TREND_CONTEXT_UNQUALIFIED', reason: 'no_bound_source_facts' });
  assert.equal(handle.host.trendBinding.bound(), null, 'the window does not outlive the read it was opened for');
  handle.host.close();
});

/* ---------------------------------------------------------------------------
   G7 / O10 — C4's accepted reader now displays the native performed record.
   This positive join cell uses the shipped default provider and the actual
   local-era key custody. The historical absence witness remains in a1d8252.
   --------------------------------------------------------------------------- */

test('B-NTC G7/O10 — C4 Last time reads the performed shape on the default qualified local-era path', async () => {
  const { L } = await trainedFreshLane('g7');
  const handle = await L.on(offsetDay(FRESH_DAY, 3));
  assert.equal((await handle.model.read()).phase, 'ready');
  const started = await handle.model.start();
  assert.equal(started.ok, true, started.code || '');
  const active = await handle.model.read();
  assert.equal(active.phase, 'active');
  assert.equal(active.set.lift, 'db-bench');
  assert.equal(active.set.position, 1);

  const prev = handle.model.previous().get('db-bench');
  /* The data IS there … */
  assert.equal(prev.profile, 'earned/performed-lift/v1');
  assert.equal(typeof prev.slots[0].fact.current.load.value, 'number');
  assert.equal(prev.slots[0].fact.current.load.unit, 'lb');
  assert.equal(typeof prev.slots[0].fact.current.reps.value, 'number');
  /* No legacy scalar fields are invented to make the display work. */
  assert.equal(typeof prev.w, 'undefined', 'a native prev has no scalar `w`');
  assert.equal(Array.isArray(prev.reps), false, 'a native prev has no `reps` array');
  assert.equal(active.previous, 'Last time: 35 lb × 8');
  handle.host.close();
});
