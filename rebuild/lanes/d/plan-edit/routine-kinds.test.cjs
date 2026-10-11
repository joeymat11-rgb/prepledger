'use strict';
/* S15 CHANGE MY ROUTINE - the two new plan-edit kinds ('reorder', 'split') and
   the data rules every routine change must keep. PUBLIC SYNTHETIC: the same
   fixture shape as model.test.cjs, no private data, injected clock only.
   Run: node --test rebuild/lanes/d/plan-edit/routine-kinds.test.cjs */
const test = require('node:test'), assert = require('node:assert/strict');
const Commands = require('../../../m4/workout/plan-edit-commands.cjs');
const { createPlanEditProjector } = require('../../../m4/workout/plan-edit-model.cjs');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createEngineRuntime } = require('../../../m4/workout/engine-runtime.cjs');
const Ops = require('../../../client/ops.cjs');
const { createHash } = require('node:crypto');
const hashBasis = text => createHash('sha256').update(text, 'utf8').digest('hex');
const copy = structuredClone;
// 2026-09-12 is a Saturday; 2026-09-13 a Sunday; 2026-09-14 a Monday.
const today = '2026-09-12', tomorrow = '2026-09-13', monday = '2026-09-14', tuesday = '2026-09-15';
const emptyTags = { head: null, secondary: [] };
let validateTags, projectNewTags;
test.before(async () => {
  const { createSetupTagProjector } = require('./f2-tag-adapter.cjs');
  const { ENGINE_MG, REGION_MG } = await import('../../../m3/w7-preview/today/exercise-catalogue.mjs');
  const api = createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
  validateTags = api.validateExerciseTags; projectNewTags = api.projectNewExerciseTags;
});
function build(action, seq, predecessor, day = today) {
  return Ops.build({ ...action, op_id: 'op-routine-' + seq, athlete_id: 'synthetic-athlete', device_id: 'synthetic-device',
    device_seq: seq, predecessor, effective: { local_date: day, local_time: '12:00', utc_offset: '+00:00' },
    lease_id: 'synthetic-lease', schema_version: 2 }, 'synthetic-test-identity');
}
const MAP = { 0: 'REST', 1: 'U', 2: 'L', 3: 'REST', 4: 'U', 5: 'L', 6: 'REST' };
function fixture({ upperOnly = false } = {}) {
  const setup = upperOnly ? { athlete_label: 'Synthetic', split: { from: '2026-09-01', map: { ...MAP, 2: 'REST', 5: 'REST' } },
    exercises: [{ id: 'press', n: 'Press', mg: 'chest', day: 'U', sets: 2, hi: 8, inc: 5, steps: [5, 10, 15] }], priority_muscles: [] }
    : { athlete_label: 'Synthetic', split: { from: '2026-09-01', map: copy(MAP) },
    exercises: [{ id: 'press', n: 'Press', mg: 'chest', day: 'U', sets: 2, hi: 8, inc: 5, steps: [5, 10, 15] },
      { id: 'row', n: 'Row', mg: 'back', day: 'U', sets: 2, hi: 8, inc: 5, steps: [5, 10, 15] },
      { id: 'raise', n: 'Raise', mg: 'delts', day: 'U', sets: 2, hi: 12, inc: 2.5, steps: [2.5, 5] },
      { id: 'legs', n: 'Legs', mg: 'quads', day: 'L', sets: 2, hi: 8, inc: 5, steps: [5, 10, 15] },
      { id: 'curl', n: 'Leg curl', mg: 'hams', day: 'L', sets: 3, hi: 10, inc: 5, steps: [10, 15] }],
    priority_muscles: [] };
  const origin = build({ kind: 'fact', class: 'event', payload: { profile: 'earned/first-run-setup/v1', setup } }, 1, null, '2026-09-01');
  const state = copy(createCleanInitState({ setup }));
  // Kept exercises carry history the routine editor must never touch.
  state.exercises[0].w = 40; state.exercises[0].forks = [{ from: '2026-09-02', kind: 'technique', why: 'Synthetic cue' }];
  state.reads = [{ d: '2026-09-02', w: 100 }];
  state.sessionLog = { '2026-09-02': { entries: [{ id: 'press', reps: [8, 8], w: 40 }, { id: 'row', reps: [9], w: 30 }] } };
  const generation = { collections: { ops: { [origin.op_id]: copy(origin) }, rejected: {}, outbox: {}, sync: { snapshot: { plan: {} } } }, metadata: {} };
  const model = createPlanEditProjector({ basisState: state, setupOperation: origin, validateTags,
    projectNewExerciseTags: projectNewTags, hashBasis });
  const commands = Commands.createPlanEditCommands({ validateTags });
  const input = (edit, id, day = today) => { const r = model.read(generation, day); return { intent_id: id, seen_plan_basis: r.plan_basis,
    starts_on: Commands.nextLocalDate(day), edit, causal_parents: r.causal_parents }; };
  function append(edit, id = 'intent-1', day = today) {
    const value = input(edit, id, day), rows = Object.values(generation.collections.ops),
      last = rows.sort((a, b) => a.device_seq - b.device_seq).at(-1);
    const op = build(commands.prepare({ action: Commands.ACTION, input: value }), last.device_seq + 1, last.op_id, day);
    assert.equal(commands.validate(op, x => generation.collections.ops[x]), true);
    generation.collections.ops[op.op_id] = op; return op;
  }
  const preview = (edit, id = 'preview-1', day = today) => model.preview(generation, Commands.nextLocalDate(day), input(edit, id, day));
  return { setup, state, origin, generation, model, commands, input, append, preview };
}
const engine = day => createEngineRuntime({ clock: { today: () => day } });
const membership = (state, day) => engine(day).sessionMembership(copy(state), day);
const byId = (state, id) => state.exercises.find(e => e.id === id);
const reorder = (day, order) => ({ kind: 'reorder', day, order });
const split = map => ({ kind: 'split', map });

test('RK-01 commands: reorder and split are closed shapes; malformed ones refuse', () => {
  const f = fixture();
  for (const edit of [reorder('U', ['row', 'press', 'raise']), split({ ...MAP, 3: 'L' })])
    assert.equal(Commands.validateInput(f.input(edit, 'ok'), { validateTags }).edit.kind, edit.kind);
  for (const edit of [reorder('F', ['row']), reorder('U', []), reorder('U', ['row', 'row']), reorder('U', ['row', ''])
    , { ...reorder('U', ['row']), extra: 1 }, { kind: 'reorder', day: 'U' },
    split({ ...MAP, 3: 'F' }), split({ 0: 'U', 1: 'L' }), split({ ...MAP, 7: 'U' }),
    split(Object.fromEntries(Object.keys(MAP).map(k => [k, 'REST']))), { ...split(MAP), day: 'U' }])
    assert.throws(() => Commands.validateInput(f.input(edit, 'bad'), { validateTags }), JSON.stringify(edit));
});

test('RK-02 reorder takes effect from tomorrow, the engine serves it, and nothing else moves', () => {
  const f = fixture(), before = f.model.read(f.generation, today).state;
  assert.deepEqual(membership(before, monday).exercise_ids, ['press', 'row', 'raise']);
  f.append(reorder('U', ['raise', 'press', 'row']));
  const now = f.model.read(f.generation, today), next = f.model.read(f.generation, tomorrow);
  assert.deepEqual(now.state, f.state, 'today keeps its basis byte for byte');
  assert.deepEqual(next.state.exOrder.U, ['raise', 'press', 'row']);
  assert.deepEqual(membership(next.state, monday).exercise_ids, ['raise', 'press', 'row'], 'the engine honours the athlete order');
  assert.deepEqual(membership(next.state, tuesday).exercise_ids, ['legs', 'curl'], 'the other workout is untouched');
  assert.deepEqual(next.state.exercises, f.state.exercises, 'every exercise keeps every field');
  assert.deepEqual(next.state.sessionLog, f.state.sessionLog, 'history is never rewritten');
  assert.deepEqual(next.state.split, f.state.split);
});

test('RK-03 reorder refuses anything but exactly that workout\'s current exercises', () => {
  const f = fixture();
  const cases = [[reorder('U', ['press', 'row']), 'PLAN_EDIT_ORDER_MISMATCH'],
    [reorder('U', ['press', 'row', 'raise', 'legs']), 'PLAN_EDIT_ORDER_MISMATCH'],
    [reorder('U', ['press', 'row', 'ghost']), 'PLAN_EDIT_ORDER_MISMATCH'],
    [reorder('L', ['curl', 'press']), 'PLAN_EDIT_ORDER_MISMATCH'],
    [reorder('U', ['press', 'row', 'raise']), 'PLAN_EDIT_NO_CHANGE']];
  for (const [edit, code] of cases) assert.throws(() => f.preview(edit), { code }, JSON.stringify(edit));
  f.append({ kind: 'remove', exercise_id: 'row' }, 'remove-row');
  // A retired lift is no longer in the workout, so an order naming it refuses.
  assert.throws(() => f.preview(reorder('U', ['raise', 'row', 'press']), 'p2', tomorrow), { code: 'PLAN_EDIT_ORDER_MISMATCH' });
});

test('RK-04 split takes effect from tomorrow; earlier weeks stay exactly as they were', () => {
  const f = fixture(), week = { 0: 'REST', 1: 'L', 2: 'U', 3: 'REST', 4: 'L', 5: 'U', 6: 'U' };
  f.append(split(week));
  const now = f.model.read(f.generation, today), next = f.model.read(f.generation, tomorrow);
  assert.deepEqual(now.state, f.state, 'today keeps its basis');
  assert.deepEqual(next.state.split, [...f.state.split, { from: tomorrow, map: week }], 'a new dated period, the old one kept');
  assert.equal(membership(now.state, monday).day, 'U', 'read on today\'s plan, Monday was Upper');
  assert.equal(membership(next.state, monday).day, 'L', 'from tomorrow Monday is Lower');
  assert.equal(membership(next.state, '2026-09-19').day, 'U', 'Saturday is now a training day');
  assert.equal(membership(next.state, '2026-09-01').day, 'L', 'a Tuesday before the change reads the old week');
  assert.equal(membership(next.state, tuesday).day, 'U', 'a Tuesday after it reads the new one');
  assert.deepEqual(next.state.exercises, f.state.exercises);
  assert.deepEqual(next.state.sessionLog, f.state.sessionLog);
});

test('RK-05 split refuses a week that leaves a workout with exercises but no day, and an unchanged week', () => {
  const f = fixture();
  assert.throws(() => f.preview(split({ ...MAP, 2: 'U', 5: 'U' })), { code: 'PLAN_EDIT_DAY_UNCOVERED' });
  assert.throws(() => f.preview(split(copy(MAP))), { code: 'PLAN_EDIT_NO_CHANGE' });
  // A week that keeps both workouts staffed is fine.
  const after = f.preview(split({ ...MAP, 3: 'L', 6: 'U' }), 'p3');
  assert.deepEqual(after.state.split.at(-1), { from: tomorrow, map: { ...MAP, 3: 'L', 6: 'U' } });
});

/* S15 R2, PM RULING (2): a workout that still has days in the week keeps at least
   one exercise, and a week may not give a day to a workout with none. Each
   refusal writes nothing, so the caller keeps the athlete's draft. */
test('RK-09 no empty workout: the last exercise of a workout with days cannot leave it, and no day goes to an empty workout', () => {
  const f = fixture();
  f.append({ kind: 'remove', exercise_id: 'legs' }, 'r1');
  const before = Object.keys(f.generation.collections.ops).length;
  const cases = [[{ kind: 'remove', exercise_id: 'curl' }, 'remove the last Lower lift'],
    [{ kind: 'update', exercise_id: 'curl', changes: { day: 'U' } }, 'move it to Upper'],
    [{ kind: 'replace', exercise_id: 'curl', exercise: { id: 'fly', n: 'Fly', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [10] },
      tags: copy(emptyTags) }, 'replace it with an Upper lift']];
  for (const [edit, why] of cases) assert.throws(() => f.preview(edit, 'p-' + why), { code: 'PLAN_EDIT_WORKOUT_EMPTY' }, why);
  // Swapping it for another Lower lift, renaming it or changing its sets is fine.
  f.preview({ kind: 'replace', exercise_id: 'curl', exercise: { id: 'ham', n: 'Ham', mg: 'hams', day: 'L', sets: 3, hi: 10, inc: 5, steps: [10] },
    tags: copy(emptyTags) }, 'ok-1');
  f.preview({ kind: 'update', exercise_id: 'curl', changes: { n: 'Curl', sets: 4 } }, 'ok-2');
  assert.equal(Object.keys(f.generation.collections.ops).length, before, 'a refusal writes nothing');
  const u = fixture({ upperOnly: true });
  assert.throws(() => u.preview(split({ ...MAP, 2: 'REST', 5: 'L' })), { code: 'PLAN_EDIT_WORKOUT_EMPTY' }, 'a Lower day with no Lower lift');
  u.preview(split({ ...MAP, 2: 'U', 5: 'REST' }), 'ok-3');
});

test('RK-06 two week changes saved the same day leave one dated period, the last one saved', () => {
  const f = fixture(), first = { ...MAP, 6: 'U' }, second = { ...MAP, 6: 'L' };
  f.append(split(first), 's1'); f.append(split(second), 's2');
  const next = f.model.read(f.generation, tomorrow).state;
  assert.deepEqual(next.split, [...f.state.split, { from: tomorrow, map: second }]);
  const intents = f.model.read(f.generation, today).intents;
  assert.deepEqual(intents.map(x => x.edit.map), [first, second], 'both saves stay on the record');
});

test('RK-07 a new exercise starts with no load and joins the end; reorder then places it; replace keeps the slot', () => {
  const f = fixture();
  const fresh = { id: 'cable-fly', n: 'Cable fly', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [10] };
  f.append({ kind: 'add', exercise: fresh, tags: copy(emptyTags) }, 'add');
  let next = f.model.read(f.generation, tomorrow).state;
  assert.equal(byId(next, 'cable-fly').w, null, 'no known load');
  assert.deepEqual(byId(next, 'cable-fly').forks, []);
  assert.equal(byId(next, 'cable-fly').sets, 3);
  assert.deepEqual(membership(next, monday).exercise_ids, ['press', 'row', 'raise', 'cable-fly']);
  f.append(reorder('U', ['cable-fly', 'press', 'row', 'raise']), 'order', tomorrow);
  next = f.model.read(f.generation, monday).state;
  assert.deepEqual(membership(next, monday).exercise_ids, ['cable-fly', 'press', 'row', 'raise']);
  const swap = { id: 'machine-row', n: 'Machine row', mg: 'back', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20] };
  f.append({ kind: 'replace', exercise_id: 'row', exercise: swap, tags: copy(emptyTags) }, 'swap', monday);
  next = f.model.read(f.generation, tuesday).state;
  assert.deepEqual(membership(next, '2026-09-17').exercise_ids, ['cable-fly', 'press', 'machine-row', 'raise']);
  assert.equal(byId(next, 'machine-row').w, null);
  // The replaced lift and its history stay on the record; it only leaves the week.
  assert.deepEqual(byId(next, 'row'), byId(f.state, 'row'));
  assert.deepEqual(next.sessionLog, f.state.sessionLog);
  for (const id of ['press', 'raise', 'legs', 'curl']) assert.deepEqual(byId(next, id), byId(f.state, id), id + ' kept every field');
});

test('RK-08 rename, sets, rep aim and moving a lift keep its id, load, forks and history', () => {
  const f = fixture();
  f.append({ kind: 'update', exercise_id: 'press', changes: { n: 'Incline press', sets: 4, hi: 12, day: 'L' } }, 'u1');
  const next = f.model.read(f.generation, tomorrow).state, was = byId(f.state, 'press'), now = byId(next, 'press');
  assert.equal(now.w, was.w); assert.deepEqual(now.forks, was.forks); assert.deepEqual(now.steps, was.steps);
  assert.equal(now.inc, was.inc); assert.equal(now.mg, was.mg);
  assert.deepEqual([now.n, now.sets, now.hi, now.day], ['Incline press', 4, 12, 'L']);
  assert.deepEqual(now.renames, [{ from: tomorrow, prevN: 'Press' }]);
  assert.deepEqual(membership(next, tuesday).exercise_ids, ['legs', 'curl', 'press']);
  assert.deepEqual(next.sessionLog, f.state.sessionLog);
});
