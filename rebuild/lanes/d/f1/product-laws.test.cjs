'use strict';
// Product-level public proof, not a conformance replacement or reviewer verdict.
// Run against current named runtime factories, or F1_SOURCE_REF=964f183 for
// RED-first. F1-C controls must pass on both. No private or seeded engine import.
const test = require('node:test');
const assert = require('node:assert/strict');
const { BASE, DAY, loadProduct, map, exercise, setup, state, orderedState } = require('./product-fixture.cjs');
const P = loadProduct();
const B = loadProduct(BASE);
const ids = session => session.ex.map(e => e.id);
const deep = value => JSON.stringify(value);
const slp = { last: null };
const nextDay = (E, d, delta) => E.isoOf(new Date(E.mk(d).getTime() + delta * E.DAY));

test('F1-01a F-only constructor preserves families, configured sets and unknown loads', () => {
  const input = setup({ 1: 'F', 4: 'F' });
  const before = deep(input);
  const s = P.createCleanInitState({ setup: input });
  assert.equal(deep(input), before);
  assert.deepEqual(s.split, [input.split]);
  assert.deepEqual(s.exercises.map(e => [e.id, e.day, e.sets, e.w]),
    [['f1-upper', 'U', 3, null], ['f1-lower', 'L', 2, null]]);
  assert.deepEqual(s.exOrder, { U: ['f1-upper'], L: ['f1-lower'] });
  assert.deepEqual(s.sessionLog, {});
  assert.deepEqual(s.sleep.nights, []);
  assert.equal(Object.hasOwn(s, 'model'), false);
  assert(Object.isFrozen(s.exercises[0]));
});

test('F1-01b malformed F shapes refuse atomically after a valid F control', () => {
  assert(P.createCleanInitState({ setup: setup({ 1: 'F' }) }));
  const variants = [
    ['CLEAN_INIT_SPLIT_REQUIRED', x => { x.split.map[1] = 'FULL'; }],
    ['CLEAN_INIT_EXERCISE_REQUIRED', x => { x.exercises[0].day = 'F'; }],
    ['CLEAN_INIT_EXERCISE_REQUIRED', x => { x.exercises.push(structuredClone(x.exercises[0])); }],
    ['CLEAN_INIT_FULL_BODY_FAMILY_REQUIRED', x => { x.exercises = x.exercises.filter(e => e.day === 'U'); }],
    ['CLEAN_INIT_FULL_BODY_FAMILY_REQUIRED', x => { x.exercises = x.exercises.filter(e => e.day === 'L'); }],
  ];
  for (const [code, change] of variants) {
    const input = setup({ 1: 'F' }); change(input); const before = deep(input);
    assert.throws(() => P.createCleanInitState({ setup: input }), { code });
    assert.equal(deep(input), before);
  }
});

test('F1-02a F is a session kind, never a new exercise family', () => {
  const E = P.engine(); const s = state(P);
  assert.equal(E.dayType(DAY, s), 'F');
  assert.equal(E.dayType('2026-09-15', s), 'REST');
  for (const k of ['U', 'L', 'F']) assert.equal(E.isTrainingKind(k), true);
  for (const k of ['REST', 'REFEED', 'Full body', null, undefined]) assert.equal(E.isTrainingKind(k), false);
  assert.equal(E.exerciseOnDay(s.exercises[0], 'F'), true);
  assert.equal(E.exerciseOnDay(s.exercises[1], 'F'), true);
  assert.equal(E.exerciseOnDay(s.exercises[0], 'L'), false);
  assert.equal(E.exerciseOnDay({ day: 'F' }, 'F'), false);
});

test('F1-02b query week selects the latest dated split on each date, irrespective of insertion order', () => {
  const E = P.engine('2026-09-16'); const s = state(P);
  s.split = [
    { from: '2026-09-18', map: map({ 5: 'L', 6: 'F' }) },
    { from: '2026-09-01', map: map({ 1: 'U', 3: 'L' }) },
    { from: '2026-09-16', map: map({ 3: 'F', 4: 'F' }) },
    { from: '2026-09-21', map: map({ 1: 'F' }) },
  ];
  const before = deep(s);
  assert.deepEqual(E.trainingWeek(s, '2026-09-16'), { from: DAY,
    kinds: ['U', 'REST', 'F', 'F', 'L', 'F', 'REST'], sessions: 5,
    exposure: { U: 4, L: 4 }, hasFullBody: true });
  assert.equal(E.dayType('2026-09-15', s), 'REST');
  assert.equal(E.dayType('2026-09-16', s), 'F');
  assert.equal(E.dayType('2026-09-18', s), 'L');
  assert.equal(deep(s), before);
});

test('F1-03a real runtime interleaves stable family orders and retains unmatched tails once', () => {
  const s = orderedState(P); const before = deep(s); const E = P.engine();
  const expected = ['f1-u-b', 'f1-l-b', 'f1-u-a', 'f1-l-a', 'f1-u-tail'];
  assert.deepEqual(E.orderedExercisesForDay(s, 'F').map(e => e.id), expected);
  const session = P.host(DAY).genSession(s, DAY, slp);
  assert(session); assert.equal(session.name, 'FULL BODY');
  assert.deepEqual(ids(session), expected);
  assert.equal(new Set(ids(session)).size, expected.length);
  assert.equal(deep(s), before);
});

test('F1-03b retired and quarantined F records survive but leave the generated pool', () => {
  const s = orderedState(P);
  s.retirements['f1-u-b'] = '2026-09-12';
  s.exercises.find(e => e.id === 'f1-l-a').quarantined = 'synthetic-invalid';
  s.exOrder.U.push('f1-u-a', 'synthetic-missing-order-id');
  const before = deep(s);
  const session = P.host(DAY).genSession(s, DAY, slp);
  assert(session);
  assert.deepEqual(ids(session), ['f1-u-a', 'f1-l-b', 'f1-u-tail']);
  assert.equal(s.exercises.length, 5);
  assert.equal(deep(s), before);
});

test('F1-03c retiring either whole family refuses F by name before issuing a workout', () => {
  for (const family of ['U', 'L']) {
    const s = state(P);
    for (const e of s.exercises.filter(e => e.day === family)) s.retirements[e.id] = '2026-09-12';
    const before = deep(s);
    assert.throws(() => P.host(DAY).genSession(s, DAY, slp), { code: 'FULL_BODY_FAMILY_MISSING' });
    assert.equal(deep(s), before);
  }
});

test('F1-04a every appearance keeps configured debut slots and no manufactured target or load', () => {
  const s = orderedState(P); const before = deep(s);
  const runtime = P.host(DAY);
  for (const date of [DAY, '2026-09-16', '2026-09-17', '2026-09-19']) {
    const session = runtime.genSession(s, date, slp); assert(session);
    for (const card of session.ex) {
      const e = s.exercises.find(x => x.id === card.id);
      assert.equal(card.tgt.length, e.sets);
      assert.deepEqual(card.tgt, Array(e.sets).fill(0));
      assert.equal(card.baselineAsk, true);
      assert.equal(card.w, null);
    }
  }
  assert.equal(deep(s), before);
});

test('F1-04b a supplied working load keeps the same target vector across U and F appearances', () => {
  const E = P.engine(); const s = state(P, { 1: 'U', 3: 'F', 5: 'L' });
  for (const e of s.exercises) { e.w = 20; e.last = Array(e.sets).fill(8); }
  const before = deep(s);
  const u = E.genSession(s, DAY, slp);
  const f = E.genSession(s, '2026-09-16', slp);
  const l = E.genSession(s, '2026-09-18', slp);
  assert(f); assert.equal(f.name, 'FULL BODY');
  for (const card of [...u.ex, ...l.ex]) {
    const full = f.ex.find(e => e.id === card.id);
    assert.deepEqual(full.tgt, card.tgt);
    assert.equal(full.tgt.length, s.exercises.find(e => e.id === card.id).sets);
    assert.equal(full.w, card.w);
  }
  assert.equal(deep(s), before);
});

test('F1-05 structural selection spends one main budget across both families plus existing riders', () => {
  const E = P.engine(); const s = orderedState(P);
  const q = (id, exId, extra = {}) => ({ id, exId, kind: 'debut', t: 'Synthetic ' + id, ...extra });
  s.queue = [q('main-l', 'f1-l-a'), q('competing-u', 'f1-u-a'),
    q('rider-u', 'f1-u-b', { coApproved: true }), q('proposed-l', 'f1-l-b', { state: 'PROPOSED' }),
    q('done-u', 'f1-u-tail', { done: true })];
  const before = deep(s);
  const picked = E.pickStructural(s, DAY, slp);
  assert.equal(picked.main.id, 'main-l');
  assert.deepEqual(picked.riders.map(q => q.id), ['rider-u']);
  const session = E.genSession(s, DAY, slp);
  assert.equal(session.structuralId, 'main-l');
  assert.deepEqual(session.riderIds, ['rider-u']);
  assert.deepEqual(session.ex.filter(e => e.isDebutNow).map(e => e.id).sort(), ['f1-l-a', 'f1-u-b']);
  assert.equal(deep(s), before);
});

for (const [suffix, training, sessions, upper, lower, total] of [
  ['two-F', { 1: 'F', 4: 'F' }, 2, 2, 2, 10],
  ['three-F', { 1: 'F', 3: 'F', 5: 'F' }, 3, 3, 3, 15],
  ['U-F-L', { 1: 'U', 3: 'F', 5: 'L' }, 3, 2, 2, 10],
  ['U-F-F', { 1: 'U', 3: 'F', 5: 'F' }, 3, 3, 2, 13],
]) test('F1-06-' + suffix + ' calendar sessions, family exposure and designed work agree', () => {
  const E = P.engine(); const s = state(P, training); const before = deep(s);
  const week = E.trainingWeek(s, DAY);
  assert.equal(week.from, DAY); assert.equal(week.sessions, sessions);
  assert.deepEqual(week.exposure, { U: upper, L: lower }); assert.equal(week.hasFullBody, true);
  const pv = E.programmeVolume(s);
  assert.equal(pv.find(x => x.mg === 'chest').sets, 3 * upper);
  assert.equal(pv.find(x => x.mg === 'quads').sets, 2 * lower);
  let actual = 0;
  for (let i = 0; i < 7; i++) actual += (E.genSession(s, nextDay(E, DAY, i), slp)?.ex || []).reduce((n, e) => n + e.tgt.length, 0);
  assert.equal(actual, total);
  assert.equal(pv.reduce((n, x) => n + x.sets, 0), total);
  assert.equal(deep(s), before);
});

test('F1-06-energy scheduled F counts once, and unlogged body state stays gated', () => {
  const E = P.engine('2026-09-20'); const s = state(P, { 1: 'U', 3: 'F', 5: 'F' });
  assert.equal(E.energyAvailability(s).gated, true);
  s.trend = 180;
  s.model = { lean: 140, anchorISO: '2026-09-20', src: 'DEXA', drip: 0 };
  for (let i = 0; i < 14; i++) s.dailyLogs[nextDay(E, '2026-09-20', -i)] = { cal: 2400, steps: 6500 };
  const ea = E.energyAvailability(s);
  assert.equal(ea.gated, false); assert.equal(ea.sessPerWk, 3);
  assert.equal(ea.trainKcal, Math.round(3 * E.EA_KCAL_PER_SESSION / 7));
  assert.deepEqual(s.sessionLog, {});
});

test('F1-07a adaptive frequency prices each family in U,F,F and its dated transition', () => {
  const E = P.engine(); const s = state(P, { 1: 'U', 3: 'F', 5: 'F' });
  assert.equal(E._weeklyFreq('U', s, DAY), 3);
  assert.equal(E._weeklyFreq('L', s, DAY), 2);
  s.split = [{ from: '2026-09-01', map: map({ 1: 'U' }) },
    { from: '2026-09-18', map: map({ 0: 'F' }) }];
  assert.equal(E._weeklyFreq('L', s, '2026-09-14'), 1);
});

// Isolate the proposal arithmetic with explicit synthetic upstream instrument
// answers. Calendar, pool, programmeVolume, structural budget, review state and
// volumePush are the real factories. These cells do not claim that a cold-start
// athlete has earned a proposal or that the health instruments are qualified.
function proposalEngine() {
  const E = P.engine();
  Object.assign(E, { energyBalanceTarget: () => ({ regime: 'free', regimeConfirmed: true }),
    progressionTrend: () => ({ state: 'stable' }), phaseArc: () => ({ key: 'cut' }),
    regime: () => ({ rate: { lo: 0.1, hi: 0.4 } }),
    recoveryIndex: () => ({ band: 'GREEN', flags: [] }), sleepMean3At: () => true,
    liftTrend: () => null });
  return E;
}

test('F1-07b proposal cap aggregates a muscle across the complete F pool', () => {
  const E = proposalEngine();
  const pair = [exercise('f1-upper-core', 'U', 4, 'abs'), exercise('f1-lower-core', 'L', 4, 'abs')];
  const full = state(P, { 1: 'F' }, pair);
  full.exercises.forEach(e => { e.w = 20; });
  const fullBefore = deep(full);
  const blocked = E.volumePush(full);
  assert.equal(blocked.mode, 'WITHHELD');
  assert(blocked.skips.some(x => x.mg === 'abs' && /per-session cap/.test(x.why)));
  assert.equal(deep(full), fullBefore);
  const room = structuredClone(full); room.exercises[0].sets = 3;
  const roomBefore = deep(room);
  const allowed = E.volumePush(room);
  assert.equal(allowed.mode, 'PUSH'); assert.equal(allowed.dSess, 1);
  assert.equal(allowed.exId, 'f1-upper-core');
  assert.equal(allowed.fromWk, 7); assert.equal(allowed.toWk, 8);
  assert.equal(allowed.toSess, 4);
  assert.equal(deep(room), roomBefore);
});

test('F1-07c real proposal consequence prices one upper set as three and one lower as two weekly', () => {
  for (const [family, expectedDelta] of [['U', 3], ['L', 2]]) {
    const E = proposalEngine(); const s = state(P, { 1: 'U', 3: 'F', 5: 'F' });
    s.exercises.find(e => e.day === family).w = 20;
    const before = deep(s); const result = E.volumePush(s);
    assert.equal(result.mode, 'PUSH'); assert.equal(result.day, family);
    assert.equal(result.dSess, 1); assert.equal(result.freq, expectedDelta);
    assert.equal(result.toWk - result.fromWk, expectedDelta);
    assert.equal(deep(s), before);
  }
});

test('F1-11 next-training lookup finds F, skips a finished F and respects REST', () => {
  const E = P.engine(); const s = state(P);
  assert.equal(E.nextTrainingISO(s), DAY);
  s.sessionLog[DAY] = { entries: [] };
  assert.equal(E.nextTrainingISO(s), '2026-09-17');
  s.sessionLog['2026-09-17'] = { entries: [] };
  assert.equal(E.nextTrainingISO(s), '2026-09-21');
});

test('F1-11-books F completeness requires the session in both today and yesterday readers', () => {
  const s = state(P);
  s.blackout = { until: '2026-08-01' };
  s.dailyLogs[DAY] = { cal: 2400 };
  s.sleep.nights = [{ d: '2026-09-13', h: 8 }, { d: DAY, h: 8 }];
  s.reads = [{ d: DAY, w: 180 }];
  const now = P.engine(DAY); const tomorrow = P.engine('2026-09-15');
  const before = deep(s);
  for (const book of [now.booksToday(s), tomorrow.liveBooks(s)]) {
    assert.deepEqual(book.items.find(x => x.k === 'session'), { k: 'session', ok: false });
    assert.equal(book.complete, false);
    assert.deepEqual(book.items.filter(x => !x.ok).map(x => x.k), ['session']);
  }
  assert.equal(deep(s), before);
  s.sessionLog[DAY] = { entries: [] };
  for (const book of [now.booksToday(s), tomorrow.liveBooks(s)]) assert.equal(book.complete, true);
  assert.equal(tomorrow.booksToday(s).items.some(x => x.k === 'session'), false);
});

for (const [tier, spike, action] of [
  ['AMBER', 7, /^Session runs, one rule changed:/],
  ['RED', 10, /^Session: convert to a walk or push it a day/],
]) test('F1-11-alarm-' + tier + ' existing health advice recognizes an unfinished F session', () => {
  const E = P.engine(); const s = state(P);
  s.trend = 180; s.model = { lean: 140, anchorISO: DAY, src: 'DEXA', drip: 0 };
  s.sleep.cleanH = 8;
  s.sleep.nights = [{ d: '2026-09-13', h: 8 }];
  s.pulse = Array.from({ length: 9 }, (_, i) => ({ d: nextDay(E, DAY, i - 8), bpm: i === 8 ? 60 + spike : 60 }));
  // Unrelated optional canary presentation is absent. pulseRead and the alarm
  // signal execute on the actual synthetic observations, without gate stubs.
  E.labGroupsM = () => [];
  const before = deep(s);
  assert.equal(E.bodyAlarmSignal(s).tier, tier);
  const alarm = E.bodyAlarm(s, slp);
  assert.equal(alarm.tier, tier); assert(alarm.lines.some(line => action.test(line)));
  assert.equal(deep(s), before);
  s.sessionLog[DAY] = { entries: [] };
  assert.equal(E.bodyAlarm(s, slp).lines.some(line => action.test(line)), false);
});

test('F1-12 training progress uses the same rolling seven dates on both sides across a split change', () => {
  const E = P.engine('2026-09-16'); const s = state(P);
  s.trend = 180; s.model = { lean: 140, anchorISO: '2026-09-16', src: 'DEXA', drip: 0 };
  s.split = [
    { from: '2026-09-01', map: map({ 0: 'L', 1: 'F', 4: 'F', 6: 'U' }) },
    { from: '2026-09-15', map: map({ 2: 'F', 4: 'F' }) },
  ];
  // Sep 10..16 schedules F, REST, U, L, F, F, REST = five sessions.
  // The current calendar week schedules only three; it is not this numerator's
  // calendar. Out-of-window/future logs exercise both ends of the date filter.
  for (const d of ['2026-09-09', '2026-09-10', '2026-09-12', '2026-09-14', '2026-09-15', '2026-09-17'])
    s.sessionLog[d] = { entries: [] };
  const before = deep(s);
  assert.deepEqual(E.fiveLevers(s).training, { label: 'TRAINING', state: 'quiet', detail: '4 of 5 this week' });
  assert.equal(deep(s), before);
  s.sessionLog['2026-09-13'] = { entries: [] };
  assert.deepEqual(E.fiveLevers(s).training, { label: 'TRAINING', state: 'good', detail: '5 of 5 · complete' });
});

test('F1-C01 ordinary U/L setup has byte-identical empty history and validation controls', () => {
  const input = setup();
  assert.equal(deep(P.createCleanInitState({ setup: input })), deep(B.createCleanInitState({ setup: input })));
  for (const product of [P, B]) {
    const invalid = setup({ 1: 'U' }); const before = deep(invalid);
    assert.throws(() => product.createCleanInitState({ setup: invalid }), { code: 'CLEAN_INIT_SPLIT_REQUIRED' });
    assert.equal(deep(invalid), before);
  }
});

test('F1-C02 U/L sessions and rest retain byte-identical product outputs', () => {
  const s = orderedState(B);
  s.split = [{ from: '2026-09-07', map: map({ 1: 'U', 4: 'L' }) }];
  s.retirements['f1-u-b'] = '2026-09-12';
  const before = deep(s);
  for (const d of [DAY, '2026-09-15', '2026-09-17']) {
    assert.equal(deep(P.host(DAY).genSession(s, d, slp)), deep(B.host(DAY).genSession(s, d, slp)));
  }
  assert.equal(deep(s), before);
});

test('F1-C03 no-F volume and frequency stay byte-identical, including legacy absent and unsorted split cases', () => {
  const candidate = P.engine(); const baseline = B.engine();
  for (const shape of ['normal', 'absent', 'unsorted']) {
    const s = state(B, { 1: 'U', 3: 'L', 5: 'U' });
    if (shape === 'absent') delete s.split;
    if (shape === 'unsorted') s.split = [
      { from: '2026-07-20', map: map({ 2: 'L' }) },
      { from: '2026-07-01', map: map({ 1: 'U', 4: 'L' }) },
    ];
    assert.equal(deep(candidate.programmeVolume(s)), deep(baseline.programmeVolume(s)));
    for (const k of ['U', 'L']) assert.equal(candidate._weeklyFreq(k, s), baseline._weeklyFreq(k, s));
    for (let i = 0; i < 7; i++) assert.equal(candidate.dayType(nextDay(candidate, DAY, i), s), baseline.dayType(nextDay(baseline, DAY, i), s));
  }
});

test('F1-C04 actual recorded sets remain observations with an F label', () => {
  const s = state(B); const E = P.engine('2026-09-20');
  s.sessionLog['2026-09-18'] = { name: 'FULL BODY', entries: [
    { id: 'f1-upper', w: 20, reps: [8], rir: null },
    { id: 'f1-lower', w: 25, reps: [9, 8], rir: null },
  ] };
  const before = deep(s);
  const actual = E.muscleVolume(s);
  assert.equal(actual.find(x => x.mg === 'chest').n7, 1);
  assert.equal(actual.find(x => x.mg === 'quads').n7, 2);
  assert.equal(deep(actual), deep(B.engine('2026-09-20').muscleVolume(s)));
  assert.equal(deep(s), before);
});

test('F1-C05 no-F training progress keeps the exact parent denominator and whole lever output', () => {
  const s = state(B, { 1: 'U', 4: 'L' });
  s.trend = 180; s.model = { lean: 140, anchorISO: '2026-09-16', src: 'DEXA', drip: 0 };
  s.sessionLog['2026-09-10'] = { entries: [] };
  s.sessionLog['2026-09-14'] = { entries: [] };
  const before = deep(s);
  const candidate = P.engine('2026-09-16').fiveLevers(s);
  assert.equal(deep(candidate), deep(B.engine('2026-09-16').fiveLevers(s)));
  assert.deepEqual(candidate.training, { label: 'TRAINING', state: 'quiet', detail: '2 of 4 this week' });
  assert.equal(deep(s), before);
});
