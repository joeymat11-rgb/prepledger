import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { CATALOGUE, ENGINE_MG, REGION_MG, GROUP_MG, customEntry } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
const require = createRequire(import.meta.url);
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createSetupTagProjector, PROFILE } = require('../../../m4/workout/setup-tags.cjs');
const taxonomy = { muscles: ENGINE_MG, regions: REGION_MG };
const projector = createSetupTagProjector({ taxonomy });
const { validateSetupTags, projectSetupTags } = projector;
const DATE = '2026-09-14', OP = 'synthetic-f2-setup-op';
const copy = structuredClone;
const bytes = JSON.stringify;
const bad = fn => assert.throws(fn, { code: 'SETUP_TAGS_INVALID', message: 'SETUP_TAGS_INVALID' });

function fixture(entries = CATALOGUE) {
  const setup = { athlete_label: 'synthetic-f2-projector',
    split: { from: DATE, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'L', 5: 'REST', 6: 'REST' } },
    exercises: entries.map((e, i) => ({ id: 'renamed-' + i, n: 'Synthetic lift ' + i,
      mg: e.mg, day: e.kinds[0], sets: 2, hi: 10, inc: 5, steps: [10, 15, 20] })),
    priority_muscles: [] };
  const tags = Object.fromEntries(entries.map((e, i) => ['renamed-' + i, { head: e.head, secondary: copy(e.secondary) }]));
  return { setup, tags, state: createCleanInitState({ setup }), op_id: OP, date: DATE };
}
const context = f => ({ setup: f.setup, tags: f.tags, op_id: f.op_id, date: f.date });
const project = f => projectSetupTags(f.state, context(f));
function stripped(state) {
  const out = copy(state);
  out.exercises.forEach(e => { delete e.head; delete e.secondary; delete e.volumeTags; });
  return out;
}
function assertFrozen(value) {
  if (value && typeof value === 'object') {
    assert(Object.isFrozen(value)); Object.values(value).forEach(assertFrozen);
  }
}

test('F2-02 all canonical catalogue snapshots project by saved athlete id', () => {
  const f = fixture(), before = bytes(f);
  assert.equal(validateSetupTags(f.setup, f.tags), true);
  const out = project(f);
  assert.notEqual(out, f.state); assert.equal(out.exercises.length, CATALOGUE.length);
  assert.equal(bytes(stripped(out)), bytes(f.state));
  for (const e of out.exercises) {
    assert.deepEqual({ head: e.head, secondary: e.secondary }, f.tags[e.id]);
    assert.deepEqual(e.volumeTags, { profile: PROFILE, op_id: OP, date: DATE,
      regionsByMuscle: Object.fromEntries(ENGINE_MG.map(mg => [mg,
        Object.keys(REGION_MG).filter(region => REGION_MG[region] === mg && region !== mg)])
        .filter(([, regions]) => regions.length)) });
  }
  assertFrozen(out); assert.equal(bytes(f), before);
});

test('F2-04 every permitted custom group, region and muscle endpoint projects', () => {
  const specs = [
    ...Object.entries(GROUP_MG).filter(([, mg]) => mg !== null).map(([group]) => ({ group })),
    ...Object.keys(REGION_MG).map(region => ({ region })),
    ...ENGINE_MG.map(mg => ({ mg })),
  ];
  const entries = specs.map((s, i) => customEntry({ ...s, name: 'Synthetic custom ' + i }));
  assert(entries.every(e => !e.error));
  const f = fixture(entries), out = project(f);
  assert.equal(out.exercises.length, specs.length);
  assert(out.exercises.every(e => e.secondary.length === 0));
  entries.forEach((entry, i) => assert.equal(out.exercises[i].head, entry.head));
});

test('F2-03 absent snapshot returns the exact legacy state; [] is explicit metadata', () => {
  const f = fixture();
  for (const tags of [undefined, null]) {
    assert.equal(validateSetupTags(f.setup, tags), true);
    assert.equal(projectSetupTags(f.state, { tags }), f.state);
  }
  const single = fixture([customEntry({ name: 'Synthetic custom press', mg: 'chest' })]);
  single.setup.exercises[0].id = 'press'; single.tags = { press: { head: null, secondary: [] } };
  single.state = createCleanInitState({ setup: single.setup });
  const out = project(single);
  assert.deepEqual(out.exercises[0].secondary, []);
  assert.equal(out.exercises[0].volumeTags.profile, PROFILE);
  assert.equal(projectSetupTags(out, { tags: null }), out);
});

test('F2-04 currently coarse catalogue helpers remain coarse after projection', () => {
  const f = fixture(), out = project(f);
  let coarse = 0;
  out.exercises.forEach((e, i) => {
    for (const helper of CATALOGUE[i].secondary) {
      if (Object.values(REGION_MG).some(mg => mg === helper.mg)
          && Object.keys(e.volumeTags.regionsByMuscle).includes(helper.mg)) {
        assert(e.secondary.some(x => x.mg === helper.mg && x.lend === helper.lend)); coarse++;
      }
    }
  });
  assert(coarse > 0);
});

test('F2-02 missing, extra and duplicate setup identities refuse without mutation', () => {
  for (const edit of [f => { delete f.tags['renamed-0']; }, f => { f.tags.extra = { head: null, secondary: [] }; },
    f => { f.setup.exercises[1].id = f.setup.exercises[0].id; }, f => { f.setup.exercises[0].id = 'wrong'; }]) {
    const f = fixture(); edit(f); const before = bytes(f);
    bad(() => validateSetupTags(f.setup, f.tags)); bad(() => project(f)); assert.equal(bytes(f), before);
  }
});

test('F2-02 head compatibility and vocabulary refuse wrong semantic types', () => {
  for (const head of ['unknown', 'lats', '', 0, false, {}, []]) {
    const f = fixture(); f.tags['renamed-0'].head = head;
    bad(() => validateSetupTags(f.setup, f.tags));
  }
  const f = fixture(); f.setup.exercises[0].mg = 'unknown';
  bad(() => validateSetupTags(f.setup, f.tags));
});

test('F2-02 helpers must be known, unique and finite positive fractions at most one', () => {
  for (const secondary of [[{ mg: 'unknown', lend: 0.5 }], [{ mg: 'biceps', lend: 0 }],
    [{ mg: 'biceps', lend: -1 }], [{ mg: 'biceps', lend: 1.01 }], [{ mg: 'biceps', lend: '0.5' }],
    [{ mg: 'biceps', lend: NaN }], [{ mg: 'biceps', lend: Infinity }],
    [{ mg: 'biceps', lend: 0.25 }, { mg: 'biceps', lend: 0.5 }]]) {
    const f = fixture(); f.tags['renamed-0'].secondary = secondary;
    bad(() => validateSetupTags(f.setup, f.tags));
  }
  const f = fixture(); f.tags['renamed-0'].secondary = [{ mg: 'biceps', lend: 1 }];
  assert.equal(validateSetupTags(f.setup, f.tags), true);
});

test('F2-02 self-credit includes coarse overlap but distinct resolved heads may help', () => {
  for (const entry of [customEntry({ name: 'Synthetic chest', mg: 'chest' }),
    customEntry({ name: 'Synthetic lats', region: 'lats' }), customEntry({ name: 'Synthetic back', mg: 'back' })]) {
    const f = fixture([entry]);
    for (const mg of new Set([entry.mg, entry.head || entry.mg])) {
      f.tags['renamed-0'].secondary = [{ mg, lend: 0.5 }]; bad(() => validateSetupTags(f.setup, f.tags));
    }
    if (entry.head === null && entry.mg === 'back') {
      f.tags['renamed-0'].secondary = [{ mg: 'lats', lend: 0.5 }]; bad(() => validateSetupTags(f.setup, f.tags));
    }
  }
  const f = fixture([customEntry({ name: 'Synthetic lats', region: 'lats' })]);
  f.tags['renamed-0'].secondary = [{ mg: 'upper_back', lend: 0.25 }];
  assert.equal(validateSetupTags(f.setup, f.tags), true);
});

test('F2-02 tags and helpers are closed, including nonenumerable and symbol fields', () => {
  for (const edit of [f => { f.tags['renamed-0'].extra = true; }, f => { f.tags['renamed-0'].secondary[0].extra = true; },
    f => { delete f.tags['renamed-0'].head; }, f => { f.tags['renamed-0'].secondary = {}; },
    f => { Object.defineProperty(f.tags['renamed-0'], 'hidden', { value: true }); },
    f => { f.tags['renamed-0'][Symbol('synthetic')] = true; }]) {
    const f = fixture(); edit(f); bad(() => validateSetupTags(f.setup, f.tags));
  }
});

test('F2-02 data getters are refused without executing them', () => {
  for (const path of ['setup', 'tags', 'tag', 'helper', 'state', 'context', 'taxonomy']) {
    const f = fixture(); let reads = 0;
    const accessor = { enumerable: true, get() { reads++; throw Error('getter executed'); } };
    let run;
    if (path === 'setup') { Object.defineProperty(f.setup, 'exercises', accessor); run = () => validateSetupTags(f.setup, f.tags); }
    if (path === 'tags') { Object.defineProperty(f.tags, 'renamed-0', accessor); run = () => validateSetupTags(f.setup, f.tags); }
    if (path === 'tag') { Object.defineProperty(f.tags['renamed-0'], 'head', accessor); run = () => validateSetupTags(f.setup, f.tags); }
    if (path === 'helper') { Object.defineProperty(f.tags['renamed-0'].secondary[0], 'lend', accessor); run = () => validateSetupTags(f.setup, f.tags); }
    if (path === 'state') { f.state = copy(f.state); Object.defineProperty(f.state.exercises[0], 'mg', accessor); run = () => project(f); }
    if (path === 'context') { const ctx = context(f); Object.defineProperty(ctx, 'tags', accessor); run = () => projectSetupTags(f.state, ctx); }
    if (path === 'taxonomy') { const tax = { muscles: ENGINE_MG }; Object.defineProperty(tax, 'regions', accessor); run = () => createSetupTagProjector({ taxonomy: tax }); }
    bad(run); assert.equal(reads, 0, path);
  }
});

test('F2-02 custom prototypes, sparse arrays, array properties and cycles refuse', () => {
  for (const edit of [f => { Object.setPrototypeOf(f.tags, { inherited: true }); },
    f => { Object.setPrototypeOf(f.tags['renamed-0'], { inherited: true }); },
    f => { Object.setPrototypeOf(f.tags['renamed-0'].secondary, class ExtraArray extends Array {}.prototype); },
    f => { delete f.tags['renamed-0'].secondary[0]; },
    f => { f.tags['renamed-0'].secondary.extra = true; },
    f => { f.tags['renamed-0'].secondary = [f.tags]; }]) {
    const f = fixture(); edit(f); bad(() => validateSetupTags(f.setup, f.tags));
  }
});

test('F2-02 null-prototype data dictionaries remain supported plain records', () => {
  const f = fixture(); f.tags = Object.assign(Object.create(null), f.tags);
  f.tags['renamed-0'] = Object.assign(Object.create(null), f.tags['renamed-0']);
  assert.equal(validateSetupTags(f.setup, f.tags), true); assertFrozen(project(f));
});

test('F2-02 projection attaches by id when state array order differs', () => {
  const f = fixture(); f.state = copy(f.state); f.state.exercises.reverse();
  const before = bytes(f.state), out = project(f);
  assert.deepEqual(out.exercises.map(e => e.id), f.state.exercises.map(e => e.id));
  out.exercises.forEach(e => assert.equal(e.head, f.tags[e.id].head));
  assert.equal(bytes(stripped(out)), before);
});

test('F2-02 state identity and source identity must agree', () => {
  for (const edit of [s => { s.athlete_label = 'different synthetic athlete'; }, s => { s.exercises.pop(); },
    s => { s.exercises[0].id = 'wrong'; }, s => { s.exercises[1].id = s.exercises[0].id; },
    s => { s.exercises[0].mg = 'back'; }, s => { s.exercises[0].day = 'L'; },
    s => { s.exercises[0].sets = 3; }, s => { s.split[0].map[1] = 'REST'; }]) {
    const f = fixture(); f.state = copy(f.state); edit(f.state); const before = bytes(f.state);
    bad(() => project(f)); assert.equal(bytes(f.state), before);
  }
});

test('F2-02 operation/date context is explicit and calendar-valid', () => {
  for (const patch of [{ op_id: '' }, { op_id: null }, { date: '' }, { date: '2026-02-29' },
    { date: '2026-09-14T00:00:00.000Z' }, { date: null }, { extra: true }]) {
    const f = fixture(); bad(() => projectSetupTags(f.state, { ...context(f), ...patch }));
  }
});

test('F2-02 first enrichment refuses existing observations, working loads and old forks', () => {
  for (const edit of [s => { s.reads.push({ d: DATE, w: 180 }); }, s => { s.dailyLogs[DATE] = { cal: 2300 }; },
    s => { s.sessionLog[DATE] = { entries: [] }; }, s => { s.sleep.nights.push({ d: DATE, h: 8 }); },
    s => { s.feed.push({ d: DATE, t: 'Synthetic previous history' }); }, s => { s.exercises[0].w = 15; },
    s => { s.exercises[0].forks.push({ from: DATE }); }, s => { s.exercises[0].head = null; }]) {
    const f = fixture(); f.state = copy(f.state); edit(f.state); const before = bytes(f.state);
    bad(() => project(f)); assert.equal(bytes(f.state), before);
  }
});

test('F2-02 matching re-projection preserves later history, edits, native carriers and outbox bytes', () => {
  const f = fixture(); f.state = copy(project(f));
  f.state.reads.push({ d: '2026-09-15', w: 180 });
  f.state.dailyLogs['2026-09-15'] = { cal: 2300 };
  f.state.sleep.nights.push({ d: '2026-09-15', h: 8 });
  f.state.sessionLog['2026-09-15'] = { entries: [{ id: 'renamed-0', w: 15, reps: [9, 8] }] };
  Object.assign(f.state.exercises[0], { w: 15, sets: 3, n: 'Synthetic later rename', last: [9, 8] });
  f.state.workoutFacts = { profile: 'earned/workout-facts/v1', source_revision: 1, sessions: [{
    start_op_id: 'synthetic-start', effective: { local_date: '2026-09-15', local_time: '12:00', utc_offset: '-04:00' },
    record: { entries: [{ lift_lineage_id: 'renamed-0', reps: [9, 8] }] } }] };
  f.state.outbox = { synthetic: { operation: 'synthetic pending operation' } };
  const before = bytes(f.state), out = project(f);
  assert.equal(bytes(out), before); assert.equal(bytes(f.state), before);
  assertFrozen(out); assert.notEqual(out, f.state);
});

test('F2-02 changed snapshot, provenance or a partial marker set refuses atomically', () => {
  for (const edit of [f => { f.op_id = 'different-synthetic-op'; }, f => { f.date = '2026-09-15'; },
    f => { f.state.exercises[0].volumeTags.profile = 'unknown'; },
    f => { f.state.exercises[0].volumeTags.extra = true; },
    f => { delete f.state.exercises[0].volumeTags; },
    f => { f.tags['renamed-0'].secondary = []; },
    f => { f.state.exercises[0].volumeTags.regionsByMuscle = {}; }]) {
    const f = fixture(); f.state = copy(project(f)); edit(f); const before = bytes(f.state);
    bad(() => project(f)); assert.equal(bytes(f.state), before);
  }
});

test('F2-02 same-marker history before setup or from unknown exercise identities refuses', () => {
  for (const edit of [s => { s.reads.push({ d: '2026-09-13', w: 180 }); },
    s => { s.sleep.nights.push({ d: '2026-09-13', h: 8 }); }, s => { s.dailyLogs['2026-09-13'] = {}; },
    s => { s.sessionLog['2026-09-13'] = { entries: [] }; },
    s => { s.sessionLog[DATE] = { entries: [{ id: 'unknown' }] }; },
    s => { s.workoutFacts = { profile: 'earned/workout-facts/v1', sessions: [{ effective: { local_date: '2026-09-13' } }] }; }]) {
    const f = fixture(); f.state = copy(project(f)); edit(f.state); bad(() => project(f));
  }
});

test('F2-04 factory snapshots injected taxonomy; later caller edits cannot rewrite provenance', () => {
  const mutable = copy(taxonomy), p = createSetupTagProjector({ taxonomy: mutable }), f = fixture();
  const before = p.projectSetupTags(f.state, context(f));
  mutable.regions.lats = 'chest'; mutable.muscles.push('synthetic-new-muscle');
  assert.equal(bytes(p.projectSetupTags(f.state, context(f))), bytes(before));
  f.tags['renamed-0'].secondary = [{ mg: 'synthetic-new-muscle', lend: 0.5 }];
  bad(() => p.validateSetupTags(f.setup, f.tags));
});

test('F2-04 projected tags are detached and deeply frozen without freezing source inputs', () => {
  const f = fixture(), out = project(f);
  assert(!Object.isFrozen(f.tags)); assert(!Object.isFrozen(f.setup));
  const before = bytes(out);
  f.tags['renamed-0'].secondary.length = 0; f.setup.exercises[0].n = 'Changed source';
  assert.equal(bytes(out), before);
  assert.throws(() => { out.exercises[0].secondary.push({ mg: 'biceps', lend: 0.5 }); }, TypeError);
  assert.throws(() => { out.exercises[0].volumeTags.regionsByMuscle.back.push('invented'); }, TypeError);
});

test('F2-02 malformed taxonomy configuration refuses at factory creation', () => {
  for (const config of [null, {}, { taxonomy: { muscles: ['back', 'back'], regions: REGION_MG } },
    { taxonomy: { muscles: ENGINE_MG, regions: { unknown: 'unknown' } } },
    { taxonomy: { muscles: ENGINE_MG, regions: REGION_MG, extra: true } }]) {
    bad(() => createSetupTagProjector(config));
  }
});
