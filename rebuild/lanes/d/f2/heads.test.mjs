// PUBLIC SYNTHETIC F2 proof for DECISIONS:170's saved helper heads.
// Manual sessionLog rows exercise the engine history view only; they are not
// native-history, saved-operation, Today, gym, reload or physical-phone proof.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { CATALOGUE, ENGINE_MG, REGION_MG } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
const require = createRequire(import.meta.url);
const { BASE, ROOT, DAY, loadProduct, exercise, setup } = require('./product-fixture.cjs');
const P = loadProduct();
const B = loadProduct(BASE);
const SOURCE = 'rebuild/m4/workout/setup-tags.cjs';
// This one public, dependency-free module is the entire projector read closure.
// Semantic mutants compile in memory; the source on disk is never changed.
function projectorSource() {
  const filename = path.join(ROOT, SOURCE);
  let source = fs.readFileSync(filename, 'utf8');
  if (process.env.F2_MUTANT) source = require('./mutants.cjs').mutate(process.env.F2_MUTANT, SOURCE, source);
  const mod = new Module(filename);
  mod.filename = filename;
  mod.require = () => { throw new Error('F2_HEADS_PROJECTOR_DEPENDENCY_REFUSED'); };
  mod._compile(source, filename);
  return mod.exports.createSetupTagProjector({ taxonomy: { muscles: ENGINE_MG, regions: REGION_MG } });
}
const projector = projectorSource();
const clone = structuredClone;
const bytes = JSON.stringify;
const selected = id => { const entry = CATALOGUE.find(e => e.id === id); assert(entry, id); return entry; };
const row = (rows, mg) => { const out = rows.find(r => r.mg === mg); assert(out, 'missing credited bucket: ' + mg); return out; };
const sorted = xs => [...xs].sort();
const amount = (n, lend) => +(n * lend).toFixed(1);
// Explicit ruling-derived census, independent of the engine's bucket helper.
const HEADED = [
  ['chest_press_machine', 'delts_front', 0.5],
  ['incline_chest_press_machine', 'delts_front', 0.5],
  ['barbell_bench_press', 'delts_front', 0.5],
  ['incline_barbell_bench_press', 'delts_front', 0.5],
  ['dumbbell_bench_press', 'delts_front', 0.5],
  ['incline_dumbbell_press', 'delts_front', 0.5],
  ['machine_fly', 'delts_front', 0.5],
  ['cable_fly', 'delts_front', 0.5],
  ['dumbbell_fly', 'delts_front', 0.5],
  ['push_up', 'delts_front', 0.5],
  ['dip_chest', 'delts_front', 0.5],
  ['close_grip_bench_press', 'delts_front', 0.5],
  ['face_pull', 'delts_rear', 0.5],
  ['upright_row', 'delts_side', 0.25],
  ['romanian_deadlift', 'lower_back', 0.5],
  ['deadlift', 'lower_back', 0.5],
];
const COARSE = ['rear_delt_fly', 'rear_delt_machine', 'cable_rear_delt_fly', 'farmers_carry', 'ab_wheel'];
function fixture(entries = CATALOGUE, training = { 1: 'F', 4: 'F' }) {
  entries = [...entries];
  // A real F constructor requires both families. Supply a neutral public
  // companion with no helper credit when one catalogue row is isolated.
  if (!entries.some(e => e.kinds[0] === 'U')) entries.push({ mg: 'chest', head: null, secondary: [], kinds: ['U'] });
  if (!entries.some(e => e.kinds[0] === 'L')) entries.push({ mg: 'quads', head: null, secondary: [], kinds: ['L'] });
  const authored = setup(training, entries.map((entry, i) =>
    exercise('saved-head-' + i, entry.kinds[0], 2, entry.mg)));
  authored.priority_muscles = [];
  const tags = Object.fromEntries(entries.map((entry, i) =>
    [authored.exercises[i].id, { head: entry.head, secondary: clone(entry.secondary) }]));
  return { state: P.createCleanInitState({ setup: authored }),
    context: { setup: authored, tags, op_id: 'synthetic-f2-heads-op', date: authored.split.from } };
}
function project(f) {
  let result;
  assert.doesNotThrow(() => { result = projector.projectSetupTags(f.state, f.context); },
    'admissible saved head snapshot must project');
  return result;
}
function observe(projected, id) {
  const out = clone(projected);
  out.sessionLog[DAY] = { name: 'SYNTHETIC ENGINE HISTORY VIEW', entries: [{ id, w: 20, reps: [8, 7], rir: null }] };
  out.sessionLog['2026-09-07'] = { name: 'SYNTHETIC ENGINE HISTORY VIEW', entries: [{ id, w: 20, reps: [8], rir: null }] };
  return out;
}
function frozen(value) {
  if (value && typeof value === 'object') { assert(Object.isFrozen(value)); Object.values(value).forEach(frozen); }
}
function refused(f) {
  const before = bytes(f);
  assert.throws(() => projector.validateSetupTags(f.context.setup, f.context.tags), { code: 'SETUP_TAGS_INVALID' });
  assert.throws(() => projector.projectSetupTags(f.state, f.context), { code: 'SETUP_TAGS_INVALID' });
  assert.equal(bytes(f), before, 'refusal must preserve source state and snapshot');
}

test('F2-CAT01 all 83 saved snapshots retain exact helper fields and immutable source bytes', () => {
  assert.equal(CATALOGUE.length, 83);
  const actualHeads = CATALOGUE.flatMap(e => e.secondary.filter(s => Object.hasOwn(s, 'head'))
    .map(s => [e.id, s.head, s.lend]));
  assert.deepEqual(sorted(actualHeads.map(bytes)), sorted(HEADED.map(bytes)));
  const f = fixture(), before = bytes(f), out = project(f);
  out.exercises.forEach(e => {
    assert.deepEqual({ head: e.head, secondary: e.secondary }, f.context.tags[e.id], e.id);
    assert.notEqual(e.secondary, f.context.tags[e.id].secondary, 'snapshot list must be detached');
    e.secondary.forEach((helper, i) => assert.notEqual(helper, f.context.tags[e.id].secondary[i]));
  });
  const stripped = clone(out);
  stripped.exercises.forEach(e => { delete e.head; delete e.secondary; delete e.volumeTags; });
  assert.equal(bytes(stripped), bytes(f.state), 'only runtime tags may change');
  assert.equal(bytes(f), before); frozen(out);
});

for (const [id, head, lend] of HEADED) test('F2-CAT02-' + id + ' helper head drives design, observed counts and touched budget', () => {
  const entry = selected(id);
  for (const [training, upper, lower] of [
    [{ 1: 'U', 2: 'L', 4: 'U', 5: 'L' }, 2, 2],
    [{ 1: 'F', 4: 'F' }, 2, 2],
    [{ 1: 'U', 3: 'F', 5: 'F' }, 3, 2],
  ]) {
    const f = fixture([entry], training), sourceBefore = bytes(f), projected = project(f);
    const ex = projected.exercises[0], E = P.engine(DAY), exposure = entry.kinds[0] === 'U' ? upper : lower;
    assert.deepEqual(ex.secondary, entry.secondary, 'saved snapshot survives athlete-id rename');
    const design = E.programmeVolume(projected, DAY), helper = row(design, head);
    assert.equal(helper.sets, amount(2 * exposure, lend));
    assert.equal(helper.qualified, true); assert.equal(helper.indirectOnly, true);
    assert.notEqual(helper.zone, null); assert.notEqual(helper.tier, null);
    assert.equal(design.some(r => r.mg === REGION_MG[head]), false, 'resolved credit must not leave a coarse duplicate');
    const observed = observe(projected, ex.id), observedBefore = bytes(observed), actual = E.muscleVolume(observed);
    assert.equal(row(actual, head).n7, amount(2, lend));
    assert.equal(row(actual, head).p7, amount(1, lend));
    assert.equal(row(actual, head).qualified, true); assert.equal(row(actual, head).indirectOnly, true);
    assert.equal(actual.some(r => r.mg === REGION_MG[head]), false);
    const expectedTouched = sorted([entry.head || entry.mg, ...entry.secondary.map(s => s.head || s.mg)]);
    assert.deepEqual(sorted(E.volumeTouched(ex)), expectedTouched);
    observed.adjustments.push({ d: DAY, rid: 'synthetic-set-change', exUndo: { field: 'sets', exId: ex.id } });
    assert.deepEqual(sorted(E.structuralMovesThisWeek(observed).mgsTouched), expectedTouched);
    observed.adjustments.pop(); assert.equal(bytes(observed), observedBefore);
    assert.equal(bytes(f), sourceBefore);
  }
});

for (const id of COARSE) test('F2-CAT03-' + id + ' ambiguous back helper stays an unresolved count and full family budget', () => {
  const entry = selected(id), back = entry.secondary.find(s => s.mg === 'back');
  assert(back); assert.equal(Object.hasOwn(back, 'head'), false);
  const f = fixture([entry]), projected = project(f), ex = projected.exercises[0], E = P.engine(DAY);
  const designed = E.programmeVolume(projected, DAY), d = row(designed, 'back');
  assert.equal(d.sets, amount(4, back.lend));
  assert.equal(d.qualified, false); assert.equal(d.qualification, 'region-unspecified');
  assert.equal(d.zone, null); assert.equal(d.tier, null);
  const actual = E.muscleVolume(observe(projected, ex.id)), a = row(actual, 'back');
  assert.equal(a.n7, amount(2, back.lend)); assert.equal(a.qualified, false); assert.equal(a.zone, null);
  const regions = Object.keys(REGION_MG).filter(k => REGION_MG[k] === 'back');
  for (const region of regions) {
    assert.equal(designed.some(r => r.mg === region), false, 'no numerical regional allocation');
    assert.equal(actual.some(r => r.mg === region), false);
    assert(E.volumeTouched(ex).includes(region), 'coarse credit still spends the regional budget');
  }
  assert(E.volumeTouched(ex).includes('back'));
});

test('F2-CAT04 headless snapshots and explicit empty press remain distinct from unchanged tagless parent', () => {
  const entry = { mg: 'chest', head: null, secondary: [{ mg: 'delts', lend: 0.5 }], kinds: ['U'] };
  const f = fixture([entry]);
  f.context.setup.exercises[0].id = 'press';
  f.context.tags.press = f.context.tags['saved-head-0']; delete f.context.tags['saved-head-0'];
  f.state = P.createCleanInitState({ setup: f.context.setup });
  const E = P.engine(DAY), parent = B.engine(DAY), legacy = observe(f.state, 'press');
  for (const fn of ['programmeVolume', 'muscleVolume', 'structuralMovesThisWeek'])
    assert.equal(bytes(E[fn](legacy)), bytes(parent[fn](legacy)), fn + ' tagless parent differential');
  const coarse = project(f);
  assert.equal(Object.hasOwn(coarse.exercises[0].secondary[0], 'head'), false);
  assert.equal(row(E.programmeVolume(coarse, DAY), 'delts').qualified, false);
  f.context.tags.press.secondary = [];
  const empty = project(f), rows = E.programmeVolume(empty, DAY);
  assert.equal(row(rows, 'chest').sets, 4);
  assert.equal(rows.some(r => ['triceps', 'delts', 'delts_front'].includes(r.mg)), false);
  assert.deepEqual(E.volumeSecondary(empty.exercises[0]), []);
});

test('F2-CAT05 incompatible, null and unknown helper heads refuse atomically', () => {
  for (const head of ['lower_back', null, '', 'unknown', false, 3]) {
    const f = fixture([selected('machine_fly')]);
    f.context.tags['saved-head-0'].secondary = [{ mg: 'delts', lend: 0.5, head }];
    refused(f);
  }
  const f = fixture([selected('machine_fly')]);
  f.context.tags['saved-head-0'].secondary = [{ mg: 'delts', lend: 0.5, head: 'delts_front', extra: true }];
  refused(f);
});

test('F2-CAT06 effective-bucket duplicates and direct overlap refuse while resolved siblings coexist', () => {
  const chest = selected('machine_fly');
  for (const secondary of [
    [{ mg: 'back', lend: 0.5, head: 'upper_back' }, { mg: 'upper_back', lend: 0.25 }],
    [{ mg: 'back', lend: 0.5, head: 'upper_back' }, { mg: 'back', lend: 0.25, head: 'upper_back' }],
  ]) { const f = fixture([chest]); f.context.tags['saved-head-0'].secondary = secondary; refused(f); }
  const lat = selected('lat_pulldown');
  for (const secondary of [[{ mg: 'back', head: 'lats', lend: 0.5 }], [{ mg: 'back', lend: 0.5 }]]) {
    const f = fixture([lat]); f.context.tags['saved-head-0'].secondary = secondary; refused(f);
  }
  const f = fixture([lat]);
  f.context.tags['saved-head-0'].secondary = [{ mg: 'back', head: 'upper_back', lend: 0.5 },
    { mg: 'back', head: 'lower_back', lend: 0.25 }];
  const out = project(f), E = P.engine(DAY), rows = E.programmeVolume(out, DAY);
  assert.equal(row(rows, 'lats').sets, 4);
  assert.equal(row(rows, 'upper_back').sets, 2);
  assert.equal(row(rows, 'lower_back').sets, 1);
  assert.deepEqual(sorted(E.volumeTouched(out.exercises[0])), ['lats', 'lower_back', 'upper_back']);
});
