'use strict';
/* =====================================================================
   M2-S3-COMPANION — THE sessionMembership READER
   (rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md, B custody;
   CRITICAL-PATH-2026-09-15 section 4 P1)

   today.cjs gains one private helper, _sessionPool(s, dt) — genSession's own
   exOrder / exActive / sort pool, extracted verbatim — and one returned reader,
   sessionMembership(s, iso): null for exactly the days genSession answers
   null, otherwise a fresh frozen { day, exercise_ids } carrying the complete
   ordered pool ids. It reads no sleep, calls no structural picker, computes
   no target and hands out no exercise-object alias. The runtime facade
   (rebuild/m4/workout/engine-runtime.cjs, mirrored by the W6 host) exposes it
   as the fifth name.

   THE FIXTURES are the public ones the today suites already use: the
   synthetic athlete of rebuild/m3/w7-preview/fixtures.cjs (ordinary), the
   same athlete with a lower-day lift renamed `hack` and a PENDING DEBUT queued
   for it (the pending-hack-debut construction the S3 admission harness uses,
   invented, labelled), and the journey's clean-init athlete
   (athlete-state.cjs createCleanInitState over the journey SETUP). Sleep, where
   genSession needs it, is the engine's OWN reading of the fixture's recorded
   nights (sleepInfo) — never invented.

   RED-FIRST: on the parent's today.cjs the reader does not exist (S3/SM-1),
   the runtimes expose four names (S3/SM-9), and every reader cell throws.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const { createEngine } = require('../../../engine/index.cjs');
const Runtime = require('../engine-runtime.cjs');
const HostRuntime = require('../../../m3/w6/host/engine-runtime-host.cjs');
const { createCleanInitState } = require('../athlete-state.cjs');
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require('../../../m3/w7-preview/fixtures.cjs');
const { SETUP, DAY: JOURNEY_DAY, clockFor } = require('../../../m3/w6/host/test/journey-fixture.cjs');

const clockAt = day => ({ today: () => day, hour: () => 8, now: () => new Date(day + 'T13:00:00.000Z'),
  stamp: () => day + 'T13:00:00.000Z', nowISO: () => day + 'T13:00:00.000Z', nowMs: () => Date.parse(day + 'T13:00:00.000Z'),
  dow: () => new Date(day + 'T00:00:00Z').getUTCDay() });
const engineAt = day => createEngine({ clock: clockAt(day) });
const DAY = SYNTHETIC_DAY;                 // a U day on the synthetic split
const L_DAY = dayOffset(DAY, 1);           // the L day after it
const REST_DAY = dayOffset(DAY, 2);        // REST
const REST_DAY_2 = dayOffset(DAY, -1);     // the Sunday before, REST

/* The engine's own reading of the fixture's RECORDED nights: the same object
   the writers hand genSession on the phone (sleep.cjs sleepInfo). */
const recordedFixtureSleep = (E, s) => E.sleepInfo(s);
/* The pending-hack-debut construction, on the public synthetic athlete: the
   lower-day `demo-leg` becomes `hack`, its working load is the first step, and
   ONE debut is queued for it. Same shape the S3 admission harness invents. */
function pendingHackDebut(shortSleep = false) {
  const s = createSyntheticState();
  const leg = s.exercises.find(e => e.id === 'demo-leg');
  leg.id = 'hack'; leg.n = 'SYNTHETIC hack squat'; leg.steps = [40, 45, 50]; leg.w = 40;
  for (const d of Object.keys(s.sessionLog)) for (const en of s.sessionLog[d].entries) if (en.id === 'demo-leg') en.id = 'hack';
  s.queue = [{ id: 'SYNTHETIC-hack-debut', kind: 'debut', exId: 'hack', newW: 45, done: false, state: 'READY', t: 'SYNTHETIC recorded debut' }];
  if (shortSleep) s.sleep.nights[s.sleep.nights.length - 1] = { ...s.sleep.nights[s.sleep.nights.length - 1], h: 4, bed: '02:00', wake: '06:00' };
  return s;
}
const ids = session => session === null ? null : session.ex.map(c => c.id);

test('S3/SM-1 - today.cjs returns sessionMembership beside genSession and pickStructural, and genSession keeps its own shape', () => {
  const E = engineAt(DAY);
  assert.equal(typeof E.sessionMembership, 'function');
  assert.equal(typeof E.genSession, 'function');
  assert.equal(typeof E.pickStructural, 'function');
  assert.equal(E._sessionPool, undefined, 'the pool helper is private to today.cjs, not an engine member');
  assert.equal(E.sessionMembership.length, 2, '(s, iso)');
});

test('S3/SM-2 - ORDINARY fixture: reader ids equal the real genSession(..., recordedFixtureSleep).ex ids on the U and L days', () => {
  for (const day of [DAY, L_DAY]) {
    const E = engineAt(day), s = createSyntheticState();
    const slp = recordedFixtureSleep(E, s);
    assert(slp && slp.last && slp.last.h === 8, 'the recorded last night is the fixture\'s own');
    const m = E.sessionMembership(s, day), g = E.genSession(structuredClone(s), day, slp);
    assert(g && g.ex.length, 'a session really is produced on ' + day);
    assert.deepEqual(m.exercise_ids.slice(), ids(g), 'membership ids == genSession ex ids on ' + day);
    assert.equal(m.day, E.dayType(day, s));
    assert(m.day === 'U' || m.day === 'L');
  }
});

test('S3/SM-3 - PENDING-HACK-DEBUT fixture: reader ids equal genSession ex ids whether the debut fires or is deferred by the recorded night', () => {
  for (const shortSleep of [false, true]) {
    const E = engineAt(L_DAY), s = pendingHackDebut(shortSleep);
    const slp = recordedFixtureSleep(E, s);
    assert.equal(slp.last.h, shortSleep ? 4 : 8, 'the recorded night is the one the fixture carries');
    const picked = E.pickStructural(structuredClone(s), L_DAY, slp);
    assert.equal(!!picked.main, !shortSleep, shortSleep ? 'a 4 h night defers the hack debut' : 'an 8 h night lets the hack debut fire');
    const g = E.genSession(structuredClone(s), L_DAY, slp);
    const hack = g.ex.find(c => c.id === 'hack');
    assert(hack, 'the pending lift is on the card either way');
    assert.equal(hack.w, shortSleep ? 40 : 45, shortSleep ? 'deferred: the working load stands' : 'debut: the queued load is prescribed');
    const m = E.sessionMembership(s, L_DAY);
    assert.deepEqual(m.exercise_ids.slice(), ids(g), 'membership ids == genSession ex ids, sleep-independent');
    assert.deepEqual(m.exercise_ids.slice(), ['hack', 'demo-curl']);
    assert.equal(m.day, 'L');
  }
});

test('S3/SM-4 - CLEAN-INIT fixture (the journey athlete): reader ids equal genSession ids on the journey day, null on its REST days', () => {
  const E = createEngine({ clock: clockFor(JOURNEY_DAY) });
  const s = createCleanInitState({ setup: SETUP });
  const g = E.genSession(structuredClone(s), JOURNEY_DAY, undefined);
  assert.deepEqual(ids(g), ['db-bench', 'lat-pulldown'], 'the journey day is the athlete\'s own U day');
  assert.deepEqual(E.sessionMembership(s, JOURNEY_DAY), { day: 'U', exercise_ids: ['db-bench', 'lat-pulldown'] });
  assert.deepEqual(E.sessionMembership(s, '2026-09-05'), { day: 'L', exercise_ids: ['leg-press'] });
  for (const rest of ['2026-09-06', '2026-09-07']) {
    assert.equal(E.genSession(structuredClone(s), rest, undefined), null);
    assert.equal(E.sessionMembership(s, rest), null, 'null on ' + rest + ', exactly where genSession is null');
  }
});

test('S3/SM-5 - ORDERING control: exOrder re-orders both the reader and the session identically; unknown ids sort last', () => {
  const E = engineAt(L_DAY), s = pendingHackDebut();
  s.exOrder = { L: ['demo-curl', 'hack'] };
  const slp = recordedFixtureSleep(E, s);
  assert.deepEqual(E.sessionMembership(s, L_DAY).exercise_ids.slice(), ['demo-curl', 'hack']);
  assert.deepEqual(ids(E.genSession(structuredClone(s), L_DAY, slp)), ['demo-curl', 'hack']);
  s.exOrder = { L: ['hack'] };   // an order naming one lift: the unnamed lift sorts after it
  assert.deepEqual(E.sessionMembership(s, L_DAY).exercise_ids.slice(), ['hack', 'demo-curl']);
  assert.deepEqual(ids(E.genSession(structuredClone(s), L_DAY, slp)), ['hack', 'demo-curl']);
  s.exOrder = { U: ['demo-row', 'demo-press'] };   // the OTHER day's order does not touch this day
  assert.deepEqual(E.sessionMembership(s, L_DAY).exercise_ids.slice(), ['hack', 'demo-curl']);
  const EU = engineAt(DAY);
  assert.deepEqual(EU.sessionMembership(s, DAY).exercise_ids.slice(), ['demo-row', 'demo-press']);
  assert.deepEqual(ids(EU.genSession(structuredClone(s), DAY, recordedFixtureSleep(EU, s))), ['demo-row', 'demo-press']);
});

test('S3/SM-6 - RETIREMENT control: a retired or quarantined lift leaves the pool of both, the raw record is never filtered', () => {
  const E = engineAt(DAY), s = createSyntheticState();
  s.retirements = { 'demo-row': dayOffset(DAY, -3) };
  const slp = recordedFixtureSleep(E, s);
  assert.deepEqual(E.sessionMembership(s, DAY).exercise_ids.slice(), ['demo-press']);
  assert.deepEqual(ids(E.genSession(structuredClone(s), DAY, slp)), ['demo-press']);
  assert.equal(s.exercises.length, 4, 'the raw exercise record is untouched');
  const q = createSyntheticState();
  q.exercises.find(e => e.id === 'demo-press').quarantined = true;
  assert.deepEqual(E.sessionMembership(q, DAY).exercise_ids.slice(), ['demo-row']);
  assert.deepEqual(ids(E.genSession(structuredClone(q), DAY, recordedFixtureSleep(E, q))), ['demo-row']);
  // Everything retired: an empty pool is still a membership, not null — the day is a training day.
  const all = createSyntheticState();
  all.retirements = { 'demo-press': dayOffset(DAY, -3), 'demo-row': dayOffset(DAY, -3) };
  assert.deepEqual(E.sessionMembership(all, DAY), { day: 'U', exercise_ids: [] });
  assert.deepEqual(ids(E.genSession(structuredClone(all), DAY, recordedFixtureSleep(E, all))), []);
});

test('S3/SM-7 - REST-DAY control: null exactly where the day predicate is not U/L, on both fixtures, and never an empty object', () => {
  for (const s of [createSyntheticState(), pendingHackDebut()]) {
    for (const rest of [REST_DAY, REST_DAY_2, dayOffset(DAY, 5)]) {
      const E = engineAt(rest);
      assert.equal(E.dayType(rest, s) === 'U' || E.dayType(rest, s) === 'L', false, rest + ' is not a training day');
      assert.equal(E.sessionMembership(s, rest), null);
      assert.equal(E.genSession(structuredClone(s), rest, recordedFixtureSleep(E, s)), null);
    }
  }
});

test('S3/SM-8 - the reader reads no sleep, calls no structural picker, mutates nothing and aliases nothing', () => {
  const E = engineAt(L_DAY), s = pendingHackDebut();
  const before = JSON.stringify(s);
  // Sleep and the queue are replaced by traps that throw on ANY access.
  const trap = name => new Proxy({}, { get() { throw new Error('S3-MEMBERSHIP-READ-' + name); }, has() { throw new Error('S3-MEMBERSHIP-READ-' + name); }, ownKeys() { throw new Error('S3-MEMBERSHIP-READ-' + name); } });
  const trapped = { ...s, sleep: trap('SLEEP'), queue: trap('QUEUE') };
  const m = E.sessionMembership(trapped, L_DAY);
  assert.deepEqual(m, { day: 'L', exercise_ids: ['hack', 'demo-curl'] });
  // The same trapped state makes the structural picker and genSession refuse:
  // that is the proof the reader did not go where they go.
  assert.throws(() => E.pickStructural(trapped, L_DAY, recordedFixtureSleep(E, s)), /S3-MEMBERSHIP-READ-QUEUE/);
  assert.throws(() => E.genSession(trapped, L_DAY, recordedFixtureSleep(E, s)), /S3-MEMBERSHIP-READ-QUEUE/);
  // Immutable, fresh, no aliases.
  assert(Object.isFrozen(m) && Object.isFrozen(m.exercise_ids));
  assert.notEqual(E.sessionMembership(s, L_DAY), E.sessionMembership(s, L_DAY), 'a fresh object every call');
  assert.deepEqual(E.sessionMembership(s, L_DAY), E.sessionMembership(s, L_DAY), 'with the same content');
  for (const id of m.exercise_ids) assert.equal(typeof id, 'string', 'ids, not exercise objects');
  assert.deepEqual(Object.keys(m).sort(), ['day', 'exercise_ids'], 'exactly two members');
  assert.equal(JSON.stringify(s), before, 'the state is untouched');
  // And no target, load or note leaks through: the reader carries no card fields.
  const g = E.genSession(structuredClone(s), L_DAY, recordedFixtureSleep(E, s));
  for (const k of ['tgt', 'note', 'w', 'live']) { assert.notEqual(g.ex[0][k], undefined, 'the card carries ' + k); assert.equal(m[k], undefined, k); }
});

test('S3/SM-9 - the runtime facades expose sessionMembership as the fifth name, both runtimes, forwarding to the engine\'s own reader', () => {
  // NATIVE-LOAD-SPEC R7 D inventory (s3-companion-membership.test.cjs:186-187, FC04/FC05): sessionMembership
  // stays the fifth name; the two pure native-load names follow it on both runtimes.
  const five = ['genSession', 'rirPlan', 'dayWeather', 'cleanAtDate', 'sessionMembership', 'evaluateNativeLoad', 'applyNativeLoadDecision'];
  assert.deepEqual(Runtime.COMPOSITION.exposed.slice(), five);
  assert.deepEqual(HostRuntime.EXPOSED.slice(), five);
  assert.deepEqual(HostRuntime.COMPOSITION.exposed.slice(), five);
  assert.deepEqual(Object.keys(Runtime).sort(), ['COMPOSITION', 'absentProvider', 'createEngineRuntime'], 'module exports unchanged');
  assert.deepEqual(Runtime.COMPOSITION.forbiddenImports.slice(), ['seed.cjs', 'migrate.cjs', 'merge.cjs']);
  const s = pendingHackDebut();
  for (const [label, create] of [['accepted', Runtime.createEngineRuntime], ['host mirror', HostRuntime.createEngineRuntime]]) {
    const r = create({ clock: clockAt(L_DAY) });
    assert.deepEqual(Object.keys(r).sort(), five.slice().sort(), label + ' hands out exactly the five');
    assert(Object.isFrozen(r));
    assert.deepEqual(r.sessionMembership(s, L_DAY), { day: 'L', exercise_ids: ['hack', 'demo-curl'] }, label);
    assert.equal(r.sessionMembership(s, REST_DAY), null, label + ' rest day');
    assert.deepEqual(r.sessionMembership(s, L_DAY).exercise_ids.slice(), ids(r.genSession(structuredClone(s), L_DAY, engineAt(L_DAY).sleepInfo(s))), label + ' agrees with its own genSession');
    // The forwarder swallows nothing: a state with no exercise register refuses as the engine does.
    assert.throws(() => r.sessionMembership({ ...s, exercises: undefined }, L_DAY), TypeError, label + ' forwards the engine\'s own refusal');
  }
});
