'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const vm = require('node:vm');
const F = require('./session-kind-prototype.cjs');
const PARENT = '964f18389fd930719fa0000300229f6cf4b5d15a';
const PARENT_READ_LIST = new Set([
  'rebuild/engine/plan.cjs',
  'rebuild/engine/today.cjs',
  'rebuild/m4/workout/athlete-state.cjs',
]);
// Historical RED witnesses stay on the pre-F product, even after F is built.
// These three factories are self-contained and receive no require or seed.
// Keep the caller's realm so the constructor's plain-object guard stays real.
function fromParent(file) {
  assert.ok(PARENT_READ_LIST.has(file), 'parent source is outside the read-list');
  const source = execFileSync('git', ['show', `${PARENT}:${file}`], {
    cwd: path.resolve(__dirname, '../../../..'), encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const module = { exports: {} };
  const load = vm.compileFunction(source, ['module', 'exports', 'require'], {
    filename: `${PARENT}:${file}`,
  });
  load(module, module.exports);
  return module.exports;
}
const planFactory = fromParent('rebuild/engine/plan.cjs');
const todayFactory = fromParent('rebuild/engine/today.cjs');
const { createCleanInitState } = fromParent('rebuild/m4/workout/athlete-state.cjs');

// Entirely fictional inputs. Only public, non-seed factories are loaded.
const upper = [{ id: 'test-chest', day: 'U', mg: 'chest', sets: 3 }];
const lower = [{ id: 'test-quads', day: 'L', mg: 'quads', sets: 2 }];
const week = (...kinds) => [...kinds, ...Array(7 - kinds.length).fill('REST')];
const expectCode = (run, code) => assert.throws(run, error => error.code === code);
const deepFreeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

test('parent witnesses: F is REST and has no generated session', () => {
  const E = { mk: iso => new Date(iso + 'T12:00:00Z'), memoOnState: fn => fn };
  Object.assign(E, planFactory(E, {}));
  Object.assign(E, todayFactory(E, {}));
  const state = { split: [{ from: '2026-09-01', map: { 0: 'F', 1: 'F', 2: 'F', 3: 'F', 4: 'F', 5: 'F', 6: 'F' } }] };
  assert.equal(E.dayType('2026-09-14', state), 'REST');
  assert.equal(E.genSession(state, '2026-09-14', {}), null);
});

test('parent witness: actual constructor refuses F calendar without writing', () => {
  const setup = { athlete_label: 'Synthetic F1', priority_muscles: [],
    split: { from: '2026-09-14', map: Object.fromEntries(week('F', 'F').map((kind, day) => [day, kind])) },
    exercises: [...upper, ...lower].map(e => ({ ...e, n: e.id, hi: 10, inc: 5, steps: [5, 10] })) };
  const before = JSON.stringify(setup);
  expectCode(() => createCleanInitState({ setup }), 'CLEAN_INIT_SPLIT_REQUIRED');
  assert.equal(JSON.stringify(setup), before);
});

for (const [label, kinds, total, u, l, sessions] of [
  ['two F', week('F', 'F'), 10, 2, 2, 2],
  ['three F', week('F', 'F', 'F'), 15, 3, 3, 3],
  ['mixed U/F/L', week('U', 'F', 'L'), 10, 2, 2, 3],
  ['mixed U/F/F', week('U', 'F', 'F'), 13, 3, 2, 3],
]) test('proposed arithmetic: ' + label, () => {
  const result = F.fullBodyTotals(upper, lower, kinds);
  assert.equal(result.weeklyTotal, total);
  assert.equal(result.perFullBodySession, 5);
  assert.equal(result.exposures.U, u);
  assert.equal(result.exposures.L, l);
  assert.equal(result.exposures.sessions, sessions);
  assert.deepEqual(result.byExercise.map(row => row.perAppearance), [3, 2]);
});

test('U/L counts remain literal and REFEED does not become a workout', () => {
  assert.deepEqual(F.weeklyExposure(week('U', 'L', 'REFEED', 'U', 'L')),
    { U: 2, L: 2, F: 0, sessions: 4 });
});

test('query-week transition: counts consume each resolved date, not one repeated template', () => {
  assert.deepEqual(F.weeklyExposure(week('U', 'REST', 'L', 'F', 'REST', 'F')),
    { U: 3, L: 3, F: 2, sessions: 4 });
});

test('unequal pools preserve within-family order and untouched exercise objects', () => {
  const up = deepFreeze([upper[0], { id: 'test-row', day: 'U', mg: 'back', sets: 4 },
    { id: 'test-arm', day: 'U', mg: 'biceps', sets: 1 }]);
  const lo = deepFreeze(lower);
  const before = JSON.stringify({ up, lo });
  const result = F.composeFullBody(up, lo);
  assert.deepEqual(result.map(e => e.id), ['test-chest', 'test-quads', 'test-row', 'test-arm']);
  assert.equal(result[0], up[0]);
  assert.equal(result[1], lo[0]);
  assert.equal(JSON.stringify({ up, lo }), before);
});

test('both families required, including no empty full-body session', () => {
  for (const [up, lo] of [[[], []], [upper, []], [[], lower]])
    expectCode(() => F.composeFullBody(up, lo), 'F1_BOTH_FAMILIES_REQUIRED');
});

test('duplicate ids refuse, including a duplicate across the family boundary', () => {
  expectCode(() => F.composeFullBody([upper[0], upper[0]], lower), 'F1_DUPLICATE_EXERCISE');
  expectCode(() => F.composeFullBody(upper, [{ ...lower[0], id: upper[0].id }]), 'F1_DUPLICATE_EXERCISE');
});

test('F never becomes an exercise identity and wrong-family input refuses', () => {
  expectCode(() => F.composeFullBody([{ ...upper[0], day: 'F' }], lower), 'F1_EXERCISE_IDENTITY_REQUIRED');
  expectCode(() => F.composeFullBody(lower, upper), 'F1_EXERCISE_IDENTITY_REQUIRED');
});

test('unrecorded or fractional configured sets cannot quietly become defaults', () => {
  for (const sets of [undefined, null, 0, -1, 1.5, NaN, Infinity, '3'])
    expectCode(() => F.composeFullBody([{ ...upper[0], sets }], lower), 'F1_CONFIGURED_SETS_REQUIRED');
});

test('incomplete query week and unknown calendar labels refuse', () => {
  expectCode(() => F.weeklyExposure(['F']), 'F1_RESOLVED_QUERY_WEEK_REQUIRED');
  expectCode(() => F.weeklyExposure(week('full-body')), 'F1_SESSION_KIND_INVALID');
});

test('new starter choice makes its actual workload reviewable', () => {
  assert.equal(F.proposedStarterSets(week('F', 'F'), 8), 4);
  assert.equal(F.proposedStarterSets(week('F', 'F', 'F'), 8), 3);
  assert.equal(8 * F.proposedStarterSets(week('F', 'F'), 8), 32);
  assert.equal(8 * F.proposedStarterSets(week('F', 'F', 'F'), 8), 24);
  expectCode(() => F.proposedStarterSets(week('U', 'F', 'F'), 8), 'F1_ALL_FULL_BODY_STARTER_REQUIRED');
  expectCode(() => F.proposedStarterSets(week('F'), 8), 'F1_ALL_FULL_BODY_STARTER_REQUIRED');
});

test('mixed-week addition prices the actual exercise exposure', () => {
  const stateBefore = JSON.stringify({ upper, lower });
  const common = { delta: 1, directSessionCap: 8 };
  assert.equal(F.fullBodyAddition(upper, lower, week('U', 'F', 'F'), { ...common, exerciseId: upper[0].id }).addedWeekly, 3);
  assert.equal(F.fullBodyAddition(upper, lower, week('U', 'F', 'F'), { ...common, exerciseId: lower[0].id }).addedWeekly, 2);
  assert.equal(JSON.stringify({ upper, lower }), stateBefore);
});

test('aggregate direct bucket cap cannot be bypassed with another exercise', () => {
  const up = [{ ...upper[0], sets: 4 }, { id: 'test-fly', day: 'U', mg: 'chest', sets: 4 }];
  const result = F.fullBodyAddition(up, lower, week('F', 'F'),
    { exerciseId: upper[0].id, delta: 1, directSessionCap: 8 });
  assert.equal(result.directBucketBefore, 8);
  assert.equal(result.directBucketAfter, 9);
  assert.equal(result.allowed, false);
});

test('different heads are distinct buckets and missing bucket is not a zero', () => {
  const up = [{ ...upper[0], mg: 'delts', head: 'delts_side', sets: 4 },
    { id: 'test-rear', day: 'U', mg: 'delts', head: 'delts_rear', sets: 4 }];
  const options = { exerciseId: upper[0].id, delta: 1, directSessionCap: 8 };
  assert.equal(F.fullBodyAddition(up, lower, week('F', 'F'), options).allowed, true);
  expectCode(() => F.fullBodyAddition([{ ...upper[0], mg: '' }], lower, week('F', 'F'), options), 'F1_ENGINE_BUCKET_REQUIRED');
});

test('unrelated exercise, no F context, invalid cap/delta and overflow refuse', () => {
  const options = { exerciseId: upper[0].id, delta: 1, directSessionCap: 8 };
  expectCode(() => F.fullBodyAddition(upper, lower, week('F', 'F'), { ...options, exerciseId: 'absent' }), 'F1_EXERCISE_NOT_IN_SESSION');
  expectCode(() => F.fullBodyAddition(upper, lower, week('U', 'L'), options), 'F1_FULL_BODY_CONTEXT_REQUIRED');
  expectCode(() => F.fullBodyAddition(upper, lower, week('F', 'F'), { ...options, delta: 0 }), 'F1_ADDITION_ARGUMENTS_REQUIRED');
  expectCode(() => F.fullBodyTotals([{ ...upper[0], sets: Number.MAX_SAFE_INTEGER }], lower, week('F', 'F')), 'F1_SET_COUNT_OVERFLOW');
});
