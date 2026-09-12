'use strict';
// PUBLIC SYNTHETIC engine proof. Manual runtime enrichment isolates accounting;
// it is not proof of C's saved-operation, Today, native-history or phone seam.
const test = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { BASE, ROOT, DAY, loadProduct, map, exercise, setup, state } = require('./product-fixture.cjs');
const P = loadProduct();
const B = loadProduct(BASE);
const json = value => JSON.stringify(value);
const row = (rows, mg) => { const found = rows.find(x => x.mg === mg); assert(found, 'missing volume row: ' + mg); return found; };
const amounts = (rows, field) => Object.fromEntries(rows.map(x => [x.mg, x[field]]));
let regionsByMuscle;
test.before(async () => {
  // C owns this vocabulary. No duplicated product catalogue or seed import.
  const { REGION_MG } = await import(pathToFileURL(path.join(ROOT,
    'rebuild/m3/w7-preview/today/exercise-catalogue.mjs')));
  regionsByMuscle = {};
  for (const [region, mg] of Object.entries(REGION_MG)) if (region !== mg)
    (regionsByMuscle[mg] ||= []).push(region);
});
function tag(s, id, head = null, secondary = []) {
  const ex = s.exercises.find(x => x.id === id); assert(ex);
  Object.assign(ex, { head, secondary: structuredClone(secondary), volumeTags: {
    profile: 'earned/setup-volume-tags/v1', op_id: 'synthetic-f2-setup',
    date: '2026-07-01', regionsByMuscle: structuredClone(regionsByMuscle) } });
  return ex;
}
function trainingState(training = { 1: 'F', 4: 'F' }, product = P) {
  const s = state(product, training, [exercise('renamed-pull', 'U', 3, 'back'),
    exercise('lower-hinge', 'L', 2, 'hams')]);
  // The frozen U/L reader uses July's week. Do not hide or repair that inherited
  // date-window issue inside F2's tag arithmetic proof.
  s.split[0].from = '2026-07-01';
  return s;
}
function history(s, date, id, reps) {
  (s.sessionLog[date] ||= { name: 'SYNTHETIC ENGINE HISTORY VIEW', entries: [] })
    .entries.push({ id, w: 20, reps, rir: null });
}
// Only upstream instrument answers are synthetic overrides. The real readers,
// calendar, proposal chooser, cap and structural budget remain in execution.
function proposalEngine(product = P, day = DAY, surplus = false) {
  const E = product.engine(day);
  Object.assign(E, { energyBalanceTarget: () => ({ regime: 'free', regimeConfirmed: true }),
    progressionTrend: () => ({ state: 'stable' }), phaseArc: () => ({ key: surplus ? 'leangain' : 'cut' }),
    regime: () => ({ rate: { lo: 0.1, hi: 0.4, scale: 0, ci: 0 } }),
    recoveryIndex: () => ({ band: 'GREEN', flags: [] }), sleepMean3At: () => true,
    sleepInfo: () => ({ clean: true }), liftTrend: () => null });
  return E;
}

test('F2-03a explicit empty snapshot overrides colliding press id, absent snapshot retains legacy', () => {
  const s = state(P, { 1: 'F', 4: 'F' }, [exercise('press', 'U', 3, 'chest'), exercise('lower', 'L', 2, 'quads')]);
  const E = P.engine();
  const legacy = E.programmeVolume(s);
  assert.equal(row(legacy, 'triceps').sets, 3);
  assert.equal(row(legacy, 'delts_front').sets, 3);
  tag(s, 'press'); const before = json(s);
  const tagged = E.programmeVolume(s);
  assert.equal(row(tagged, 'chest').sets, 6);
  assert.equal(tagged.some(x => ['triceps', 'delts', 'delts_front'].includes(x.mg)), false);
  assert.equal(row(tagged, 'chest').qualified, true);
  history(s, DAY, 'press', [8, 7]);
  assert.deepEqual(amounts(E.muscleVolume(s), 'n7'), { chest: 2 });
  delete s.sessionLog[DAY]; assert.equal(json(s), before);
});

test('F2-03b authored helper follows renamed identity; names and unrelated legacy rows cannot replace snapshot', () => {
  const E = P.engine(); const s = trainingState();
  tag(s, 'renamed-pull', 'upper_back', [{ mg: 'biceps', lend: 0.5 }, { mg: 'forearms', lend: 0.25 }]);
  const expected = { upper_back: 6, hams: 4, biceps: 3, forearms: 1.5 };
  assert.deepEqual(amounts(E.programmeVolume(s), 'sets'), expected);
  s.exercises[0].id = 'completely-custom-identity'; s.exercises[0].n = 'Not a catalogue name';
  assert.deepEqual(amounts(E.programmeVolume(s), 'sets'), expected);
  assert.equal(E.volBucket(s.exercises[0]), 'upper_back');
});

for (const [label, training, upper, lower] of [
  ['UL', { 1: 'U', 2: 'L', 4: 'U', 5: 'L' }, 2, 2],
  ['two-F', { 1: 'F', 4: 'F' }, 2, 2],
  ['three-F', { 1: 'F', 3: 'F', 5: 'F' }, 3, 3],
  ['mixed-UFF', { 1: 'U', 3: 'F', 5: 'F' }, 3, 2],
]) test('F2-05-' + label + ' direct and fractional arithmetic use exact family exposure', () => {
  const E = P.engine(); const s = trainingState(training);
  tag(s, 'renamed-pull', 'upper_back', [{ mg: 'biceps', lend: 0.5 }]);
  tag(s, 'lower-hinge', null, [{ mg: 'glutes', lend: 0.25 }]);
  const before = json(s); const rows = E.programmeVolume(s);
  assert.deepEqual(amounts(rows, 'sets'), { upper_back: 3 * upper,
    hams: 2 * lower, biceps: 1.5 * upper, glutes: 0.5 * lower });
  assert(rows.every(x => x.qualified === true));
  assert.equal(row(rows, 'biceps').indirectOnly, true);
  assert.equal(row(rows, 'glutes').indirectOnly, true);
  assert.equal(row(rows, 'upper_back').indirectOnly, false);
  assert.equal(json(s), before);
});

test('F2-05-targets enriching tags leaves generated sets, unknown load and target vectors unchanged', () => {
  const s = trainingState(); const E = P.engine();
  const prior = E.genSession(s, DAY, { last: null });
  tag(s, 'renamed-pull', 'upper_back', [{ mg: 'biceps', lend: 0.5 }]);
  const before = json(s); const next = E.genSession(s, DAY, { last: null });
  const targets = session => session.ex.map(e => ({ id: e.id, w: e.w, tgt: e.tgt }));
  assert.deepEqual(targets(next), targets(prior));
  assert.deepEqual(next.ex.map(e => e.tgt.length), [3, 2]);
  assert(next.ex.every(e => e.w === null && e.tgt.every(x => x === 0)));
  assert.deepEqual(s.sessionLog, {}); assert.equal(json(s), before);
});

test('F2-06a observed partial history counts performed slots, preserves distinct prior week and design', () => {
  const E = P.engine('2026-09-20'); const s = trainingState();
  tag(s, 'renamed-pull', 'upper_back', [{ mg: 'biceps', lend: 0.5 }]);
  history(s, '2026-09-18', 'renamed-pull', [8, 7]);
  history(s, '2026-09-11', 'renamed-pull', [9]);
  history(s, '2026-09-01', 'renamed-pull', [9, 8, 7]);
  history(s, '2026-09-21', 'renamed-pull', [9, 8, 7]);
  history(s, '2026-09-18', 'lower-hinge', []);
  const before = json(s); const actual = E.muscleVolume(s);
  assert.deepEqual(amounts(actual, 'n7'), { upper_back: 2, biceps: 1 });
  assert.deepEqual(amounts(actual, 'p7'), { upper_back: 1, biceps: 0.5 });
  assert.equal(row(actual, 'biceps').indirectOnly, true);
  assert.equal(row(actual, 'upper_back').qualified, true);
  assert.equal(row(E.programmeVolume(s), 'upper_back').sets, 6);
  assert.equal(row(E.programmeVolume(s), 'biceps').sets, 3);
  assert.equal(json(s), before);
});

test('F2-06b retirement removes designed work and candidates while preserving actual tagged history', () => {
  const E = proposalEngine(P, '2026-09-20'); const s = trainingState();
  tag(s, 'renamed-pull', 'upper_back', [{ mg: 'biceps', lend: 0.5 }]);
  history(s, '2026-09-18', 'renamed-pull', [8, 7]);
  s.retirements['renamed-pull'] = '2026-09-19';
  const before = json(s);
  assert.equal(E.programmeVolume(s).some(x => ['upper_back', 'biceps'].includes(x.mg)), false);
  const actual = E.muscleVolume(s);
  assert.deepEqual(amounts(actual, 'n7'), { upper_back: 2, biceps: 1 });
  for (const m of actual) { assert.equal(m.indirectOnly, true); assert.deepEqual(m.lifts, []); }
  const push = E.volumePush(s); assert.notEqual(push.exId, 'renamed-pull');
  assert.equal(json(s), before);
});

test('F2-07a coarse helper credit is unresolved once, never front guessed or spread among regions', () => {
  const E = P.engine(); const s = state(P, { 1: 'F', 4: 'F' },
    [exercise('helper-source', 'U', 3, 'chest'), exercise('lower-hinge', 'L', 2, 'hams')]);
  tag(s, 'helper-source', null, [{ mg: 'delts', lend: 0.5 }, { mg: 'back', lend: 0.25 }]);
  const before = json(s); const designed = E.programmeVolume(s);
  assert.deepEqual(amounts(designed, 'sets'), { chest: 6, hams: 4, delts: 3, back: 1.5 });
  for (const mg of ['delts', 'back']) {
    const m = row(designed, mg); assert.equal(m.qualified, false);
    assert.equal(m.qualification, 'region-unspecified'); assert.equal(m.zone, null);
    assert.equal(m.tier, null); assert.equal(m.indirectOnly, true);
  }
  history(s, DAY, 'helper-source', [8, 7]);
  const actual = E.muscleVolume(s);
  assert.deepEqual(amounts(actual, 'n7'), { chest: 2, delts: 1, back: 0.5 });
  for (const mg of ['delts', 'back']) { assert.equal(row(actual, mg).zone, null); assert.equal(row(actual, mg).qualified, false); }
  delete s.sessionLog[DAY]; assert.equal(json(s), before);
});

test('F2-07b coarse primary has no band, tier, imbalance recommendation or adaptive offer', () => {
  const E = proposalEngine(); const s = state(P, { 1: 'F', 4: 'F' },
    [exercise('unknown-back', 'U', 1, 'back'), exercise('unknown-delt', 'L', 1, 'delts')]);
  for (const ex of s.exercises) { tag(s, ex.id); ex.w = 20; }
  const before = json(s);
  const pv = E.programmeVolume(s);
  for (const m of pv) { assert.equal(m.qualified, false); assert.equal(m.zone, null); assert.equal(m.tier, null); }
  assert.equal(E.volumeImbalance(s), null);
  assert.equal(E.volumePush(s).mode, 'WITHHELD');
  assert.equal(json(s), before);
});

test('F2-07c unresolved observed volume cannot wake a sweep while a regional control can', () => {
  const E = proposalEngine(); const s = trainingState();
  tag(s, 'renamed-pull'); s.exercises[0].w = 20;
  history(s, '2026-08-31', 'renamed-pull', [8]);
  history(s, '2026-09-07', 'renamed-pull', [8]);
  history(s, DAY, 'renamed-pull', [8]);
  const before = json(s); assert.equal(E.sweepVolume(s, 1) === null, true);
  assert.equal(json(s), before);
  tag(s, 'renamed-pull', 'upper_back');
  const control = E.sweepVolume(s, 1);
  assert(control); assert.equal(control.agentProposals.length, 1);
  assert.equal(control.agentProposals[0].mg, 'upper_back');
});

test('F2-08a structural spillover expands coarse budgets without multiplying volume', () => {
  const E = P.engine(); const s = state(P, { 1: 'F', 4: 'F' },
    [exercise('helper-source', 'U', 3, 'chest'), exercise('lower-hinge', 'L', 2, 'hams')]);
  const ex = tag(s, 'helper-source', null, [{ mg: 'delts', lend: 0.5 }, { mg: 'back', lend: 0.25 }]);
  const expected = ['chest', 'delts', ...regionsByMuscle.delts, 'back', ...regionsByMuscle.back];
  const touched = [...new Set(expected)];
  const counts = amounts(E.programmeVolume(s), 'sets');
  s.adjustments = [{ d: DAY, rid: 'synthetic-set-change', exUndo: { exId: ex.id, field: 'sets', was: 2 } }];
  s.feed = [{ d: DAY, t: 'VOLUME +1 via ' + ex.n }];
  const before = json(s); const moves = E.structuralMovesThisWeek(s);
  assert.equal(moves.sets.length, 1); assert.deepEqual(moves.mgsTouched, touched);
  assert.deepEqual(E.volumeTouched(ex), touched);
  assert.deepEqual(amounts(E.programmeVolume(s), 'sets'), counts);
  assert.equal(json(s), before);
});

test('F2-08b coarse helper blocks regional offer in surplus despite a separate candidate identity', () => {
  const E = proposalEngine(P, DAY, true); const s = state(P, { 1: 'F', 4: 'F' },
    [exercise('coarse-source', 'U', 2, 'chest'), exercise('regional-target', 'L', 2, 'delts')]);
  tag(s, 'coarse-source', null, [{ mg: 'delts', lend: 0.5 }]);
  tag(s, 'regional-target', 'delts_rear'); s.exercises[1].w = 20; s.trend = 180;
  assert.equal(E.volumePush(s).exId, 'regional-target');
  s.adjustments = [{ d: DAY, rid: 'synthetic-spill', exUndo: { exId: 'coarse-source', field: 'sets', was: 1 } }];
  const before = json(s); const result = E.volumePush(s);
  assert.equal(result.mode, 'WITHHELD');
  assert(result.skips.some(x => x.mg === 'delts_rear' && /spillover/.test(x.why)));
  assert.equal(json(s), before);
});

test('F2-08c indirect-only low bucket is counted but cannot become an imbalance taker or offered lift', () => {
  const E = proposalEngine(); const s = state(P, { 1: 'F', 4: 'F' },
    [exercise('helper-source', 'U', 4, 'chest'), exercise('lower-direct', 'L', 4, 'quads')]);
  tag(s, 'helper-source', null, [{ mg: 'biceps', lend: 0.25 }]);
  const before = json(s); const pv = E.programmeVolume(s);
  assert.equal(row(pv, 'biceps').sets, 2); assert.equal(row(pv, 'biceps').indirectOnly, true);
  assert.equal(E.volumeImbalance(s), null);
  assert.equal(E.volumePush(s).mode, 'WITHHELD');
  assert.equal(E.volumePush(s).skips.some(x => x.mg === 'biceps'), false);
  assert.equal(json(s), before);
});

test('F2-09 tagged F cap aggregates direct bucket across families and excludes secondary sets', () => {
  const E = proposalEngine(); const s = state(P, { 1: 'F' },
    [exercise('upper-region', 'U', 4, 'back'), exercise('lower-region', 'L', 4, 'back')]);
  for (const ex of s.exercises) { tag(s, ex.id, 'upper_back', [{ mg: 'biceps', lend: 0.5 }]); ex.w = 20; }
  let before = json(s); const blocked = E.volumePush(s);
  assert.equal(blocked.mode, 'WITHHELD');
  assert(blocked.skips.some(x => x.mg === 'upper_back' && /per-session cap/.test(x.why)));
  assert.equal(json(s), before);
  s.exercises[0].sets = 3; before = json(s);
  const allowed = E.volumePush(s); assert.equal(allowed.mode, 'PUSH');
  assert.equal(allowed.exId, 'upper-region'); assert.equal(allowed.mg, 'upper_back');
  assert.equal(allowed.fromWk, 7); assert.equal(allowed.toWk, 8); assert.equal(allowed.dSess, 1);
  assert.equal(row(E.programmeVolume(s), 'biceps').sets, 3.5);
  assert.equal(json(s), before);
  const other = exercise('another-back-region', 'U', 5, 'back');
  s.exercises.push({ ...other, w: null }); tag(s, other.id, 'lats');
  const separate = E.volumePush(s);
  assert.equal(separate.mode, 'PUSH'); assert.equal(separate.mg, 'upper_back');
  assert.equal(separate.toWk, 8, 'another head in the same coarse family is not direct volume for this cap');
});

test('F2-C01 tagless source constructor, sessions, volume and proposal bytes match frozen F1', () => {
  for (const training of [{ 1: 'U', 4: 'L' }, { 1: 'F', 4: 'F' }, { 1: 'U', 3: 'F', 5: 'F' }]) {
    const input = setup(training);
    assert.equal(json(P.createCleanInitState({ setup: input })), json(B.createCleanInitState({ setup: input })));
    const s = state(B, training, [exercise('press', 'U', 3, 'chest'), exercise('rows', 'U', 2, 'back'), exercise('lower', 'L', 2, 'quads')]);
    history(s, DAY, 'press', [8, 7]); history(s, '2026-09-07', 'rows', [9]);
    s.retirements.rows = DAY; const before = json(s);
    const e = proposalEngine(P), b = proposalEngine(B);
    for (const reader of ['programmeVolume', 'muscleVolume', 'volumeImbalance', 'volumePush', 'structuralMovesThisWeek', 'sweepVolume'])
      assert.equal(json(e[reader](s)), json(b[reader](s)), reader);
    for (const d of [DAY, '2026-09-15', '2026-09-17'])
      assert.equal(json(e.genSession(s, d, { last: null })), json(b.genSession(s, d, { last: null })));
    assert.equal(json(s), before);
  }
});

test('F2-C02 absent and unsorted date-edge legacy splits retain parent outputs and keys', () => {
  const E = proposalEngine(), baseline = proposalEngine(B);
  for (const shape of ['absent', 'unsorted', 'date-edge']) {
    const s = trainingState({ 1: 'U', 4: 'L' }, B);
    if (shape === 'absent') delete s.split;
    else if (shape === 'unsorted') s.split = [{ from: '2026-09-16', map: map({ 3: 'L' }) },
      { from: '2026-07-01', map: map({ 1: 'U', 4: 'L' }) }];
    else s.split = [{ from: '2026-07-01', map: map({ 1: 'U', 4: 'L' }) },
      { from: '2026-09-16', map: map({ 0: 'U', 3: 'L' }) }];
    const before = json(s);
    for (const reader of ['programmeVolume', 'muscleVolume', 'volumeImbalance', 'volumePush'])
      assert.equal(json(E[reader](s, '2026-09-16')), json(baseline[reader](s, '2026-09-16')), shape + ':' + reader);
    assert.equal(json(s), before);
  }
});

test('F2-C03 zero tagged contribution cannot add qualification to a legacy contributed row', () => {
  const E = P.engine(); const baseline = B.engine();
  const s = state(P, { 1: 'F', 4: 'F' }, [exercise('legacy-back', 'U', 3, 'back'),
    exercise('tagged-unlogged', 'U', 2, 'back'), exercise('lower', 'L', 2, 'quads')]);
  tag(s, 'tagged-unlogged');
  s.retirements['tagged-unlogged'] = '2026-09-01';
  history(s, DAY, 'legacy-back', [8]);
  const before = json(s);
  for (const reader of ['programmeVolume', 'muscleVolume'])
    assert.deepEqual(row(E[reader](s), 'back'), row(baseline[reader](s), 'back'), reader + ' retired tag is not a contributor');
  delete s.retirements['tagged-unlogged'];
  assert.deepEqual(row(E.muscleVolume(s), 'back'), row(baseline.muscleVolume(s), 'back'), 'active but unlogged tag is not an observed contributor');
  s.retirements['tagged-unlogged'] = '2026-09-01'; assert.equal(json(s), before);
});

test('F2-C04 frozen baseline loader rejects every nonallowlisted ref', () => {
  for (const ref of ['HEAD', 'main', '2d50e88^', '964f183', '']) assert.throws(() => loadProduct(ref), /F2_BASE_REF_NOT_ALLOWLISTED/);
});
