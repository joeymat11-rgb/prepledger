/* B-NTC — H6, THE GYM-CARD WIRING: THE A2 DELTA CELLS, MEASURED.
   ==============================================================

   These are the delta cells DECISIONS:108 (a) asks for ("A2-REPORT §9.1 table
   becomes the delta cells") and (b) licenses lane B to land beside the one
   gym-host.mjs hunk. Every figure below was MEASURED on the merged tip with the
   patch applied; none is predicted. The names G1…G7 are the cells of
   rebuild/lanes/b/ntc/gym-host.wiring.patch, in its order.

   THE OPTION IS OFF. `createGymHost` is called exactly as the shipped page calls
   it — `mapRecordedDaysWithEnginePredicates` is never passed — so these cells
   describe the tree as it ships, not a scratch re-seal.

   THE TWO ATHLETES, and why the answer differs between them:

     * THE PRODUCT ATHLETE — `createTodayModel({}).stateFromOps()`, which
       today-entry.mjs and gym.test.mjs both pass to createGymHost. It carries 28
       RECORDED SLEEP NIGHTS, so the qualified provider's empty-history day
       reader refuses `recorded_sleep_unmapped` for every date and the wiring
       changes NOTHING for it (G1, G2, G3). Opening it needs the EXPOSED re-seal
       (PM question Q1(a)) — not this package.

     * THE FRESH ATHLETE — `createCleanInitState`, DECISIONS:100's athlete: no
       recorded night, no recorded event. The day reader answers by proof over an
       empty history, so day+3 on the same lift group PREPARES and is conducted
       (G5) with previous performance intact (G6). This is A2-REPORT §9.1's
       "day+3 2030-02-07 probe=blocked PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED",
       removed — on the athlete for whom it can be removed without a re-seal.

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
import { createGymHost, AUTHORITY_KID } from '../gym-host.mjs';
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

async function deviceKeys() {
  const pair = await webcrypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
  const jwk = await webcrypto.subtle.exportKey('jwk', pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  return { kid: AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
    publicKey: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, key_ops: ['verify'], ext: true } };
}

/* `on(day)` is A PAGE LOAD — a new host over the SAME device storage and key
   store, the way A2's own lane() does it. Nothing is carried in memory between
   days, so a cell that says "day+3 prepares" is saying it about a real reopen. */
async function lane(state, label) {
  const fault = faultDatabase();
  const keys = await deviceKeys();
  return { async on(day) {
    const host = await createGymHost({ day, engineState: state, indexedDB: fault.indexedDB,
      crypto: webcrypto, deviceKeys: keys, plannedSplitSlotId: 'slot', databaseName: 'ntc-h6-' + label });
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
   G1 · G2 · G3 — THE PRODUCT ATHLETE IS UNCHANGED BY THE WIRING.
   Brief v1 predicted these three cells would flip. Review r1 measured that they
   do not, and this is that measurement, committed: 28 recorded nights, so the
   empty-history day reader refuses for every date and the engine's own refusal
   comes back word for word. G1/G2/G3 are marked NOT OBSERVED in the patch's
   table for exactly this reason.
   --------------------------------------------------------------------------- */

test('B-NTC G1 — the product athlete\'s day+3 wall is UNCHANGED by the H6 wiring (gym.test.mjs:621)', async () => {
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
  assert.equal(view.phase, 'blocked');
  assert.equal(view.code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', 'the wall is still the wall');
  assert.equal(view.copy, 'resolver_failed', 'the engine\'s own reason, unchanged');
  const refused = await handle.model.start();
  assert.equal(refused.ok, false, 'Start is refused, not offered');
  assert.equal(await opCount(handle.host), 12, 'a refused day still writes NOTHING');
  handle.host.close();
});

test('B-NTC G2 — every day after the wall is UNCHANGED for the product athlete (gym.test.mjs:639)', async () => {
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
    assert.equal(view.phase, 'blocked', 'day+' + offset);
    assert(['ENGINE_CAPTURE_NO_WORKOUT', 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'].includes(view.code),
      'day+' + offset + ' refuses for an ENGINE reason: ' + view.code);
    const read = await handle.host.host.client.readWorkoutHistory();
    assert.equal(read.read, true, 'the durable history still reads on day+' + offset);
    assert.equal(read.history.sessions.length, 2);
    assert.equal(await opCount(handle.host), 12, 'day+' + offset + ' writes nothing');
    seen.push(view.code);
    handle.host.close();
  }
  assert.deepEqual(seen, ['PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', 'ENGINE_CAPTURE_NO_WORKOUT',
    'ENGINE_CAPTURE_NO_WORKOUT', 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED',
    'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'],
    'the measured shape of the days after the wall, unchanged by this package');
});

test('B-NTC G3 — lastProducerRefusal() is UNCHANGED, and the composed day reader says WHY (gym.test.mjs:657)', async () => {
  const L = await lane(productAthlete(), 'g3');
  for (const offset of [0, 1]) {
    const handle = await L.on(offsetDay(SYNTHETIC_DAY, offset));
    assert.equal((await conductDay(handle)).closed, true);
    handle.host.close();
  }
  const handle = await L.on(offsetDay(SYNTHETIC_DAY, 3));
  await handle.model.read();
  const produced = handle.host.host.lastProducerRefusal();
  assert.equal(produced.code, 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED');
  assert.equal(produced.reason, 'resolver_failed');
  /* The wiring reports which reader it composed instead of leaving a reader to
     assume. On this tree EXPOSED is ['genSession','rirPlan'], pinned by
     native-carriers-witnesses.cjs:16, so the engine's own two day predicates are
     not obtainable and the option was never asked for. */
  assert.deepEqual(handle.host.trendDayReader(),
    { enginePredicates: false, enginePredicatesAvailable: false, optionRequested: false });
  assert.throws(() => handle.host.trendBinding.resolve({ start_op_id: 'x', source_revision: 1, effective: {} }),
    { code: 'NATIVE_TREND_CONTEXT_UNQUALIFIED', reason: 'no_bound_source_facts' },
    'outside a preparation window the resolver answers nothing at all');
  handle.host.close();
});

/* ---------------------------------------------------------------------------
   G5 — THE CELL DECISIONS:108 ASKS TO BE PROVEN.
   A2-REPORT §9.1: "a FRESH athlete gets TWO whole training days, and the first
   genuine engine wall bites on day +3 … PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED
   … day +3 comes back to day 0's lifts". With the qualified provider wired and
   the option OFF, that day is prepared, Started, logged and closed.
   --------------------------------------------------------------------------- */

test('B-NTC G5 — A2\'s spike: a FRESH athlete\'s day+3 on the SAME lift group no longer refuses, option OFF', async () => {
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
  assert.equal(handle.host.trendDayReader().enginePredicates, false,
    'and it does so WITHOUT the EXPOSED widening — a fresh athlete has no recorded night to map');
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
   G7 / O10 — NOT FIXED HERE, AND NAMED SO IT IS NOT MISTAKEN FOR A REFUSAL.
   The data reaches gym-model (G6). The printed line does not, because
   previousLine() (gym-model.mjs:142-148) reads the LEGACY prev shape
   {w:number, reps:number[]}. gym-model.mjs is A2's file and is NOT covered by
   the DECISIONS:108 (b) licence, which names the gym-host.mjs hunk only — so the
   fix is written out, unapplied, in rebuild/lanes/b/ntc/gym-model.previousLine.patch
   and requested of the A2 builder. This cell locks the CURRENT behaviour so that
   landing that patch is a visible, deliberate change.
   --------------------------------------------------------------------------- */

test('B-NTC G7/O10 — the "Last time" line is still absent: previousLine() reads the LEGACY shape (A2 custody)', async () => {
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
  /* … and the reader cannot see it, because it looks for the legacy shape. */
  assert.equal(typeof prev.w, 'undefined', 'a native prev has no scalar `w`');
  assert.equal(Array.isArray(prev.reps), false, 'a native prev has no `reps` array');
  assert.equal(active.previous, null,
    'so the card prints no "Last time" line — O10, A2 custody. IF THIS CELL IS RED, '
    + 'rebuild/lanes/b/ntc/gym-model.previousLine.patch has landed: replace this cell with the '
    + 'positive one that patch carries (the line reads "Last time: 35 lb × 8").');
  handle.host.close();
});
