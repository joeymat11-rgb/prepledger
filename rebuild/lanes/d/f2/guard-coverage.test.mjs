// F2-LAND fix round. Cells for the guard terms of rebuild/m4/workout/setup-tags.cjs
// that F2-LAND-REVIEW-R1 measured as driven by NO cell, here or on the old branch.
// No byte of the module changes: every cell below is green on the unmutated module
// and red on the single-term mutant named in its comment (R1 B2, and R1 B1's M24).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { CATALOGUE, ENGINE_MG, REGION_MG, customEntry } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
const require = createRequire(import.meta.url);
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createSetupTagProjector } = require('../../../m4/workout/setup-tags.cjs');
const taxonomy = { muscles: ENGINE_MG, regions: REGION_MG };
const projector = createSetupTagProjector({ taxonomy });
const { validateSetupTags, projectSetupTags, validateExerciseTags } = projector;
const DATE = '2026-09-14', OP = 'synthetic-f2-guard-op';
const copy = structuredClone;
const bytes = JSON.stringify;
const bad = fn => assert.throws(fn, { code: 'SETUP_TAGS_INVALID', message: 'SETUP_TAGS_INVALID' });

function fixture(entries = CATALOGUE) {
  const setup = { athlete_label: 'synthetic-f2-guard',
    split: { from: DATE, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'L', 5: 'REST', 6: 'REST' } },
    exercises: entries.map((e, i) => ({ id: 'renamed-' + i, n: 'Synthetic lift ' + i,
      mg: e.mg, day: e.kinds[0], sets: 2, hi: 10, inc: 5, steps: [10, 15, 20] })),
    priority_muscles: [] };
  const tags = Object.fromEntries(entries.map((e, i) => ['renamed-' + i, { head: e.head, secondary: copy(e.secondary) }]));
  return { setup, tags, state: createCleanInitState({ setup }), op_id: OP, date: DATE };
}
const PAIR = [customEntry({ name: 'Synthetic chest press', mg: 'chest' }),
  customEntry({ name: 'Synthetic row', mg: 'back' })];
const context = f => ({ setup: f.setup, tags: f.tags, op_id: f.op_id, date: f.date });
const project = f => projectSetupTags(f.state, context(f));
// A state already carrying this exact marker, so the re-projection paths run.
function tagged(f) { const g = { ...f, state: copy(project(f)) }; return g; }
const EX = { id: 'renamed-0', n: 'Synthetic lift 0', mg: 'chest', day: 'U',
  sets: 2, hi: 10, inc: 5, steps: [10, 15, 20] };
const TAG = { head: null, secondary: [] };
const exercise = patch => ({ ...EX, ...patch });

// R1 B2, the serious miss. Mutant: :149 "|| seen.has(e.id)" deleted. The landed cell's
// duplicate row (F2-02 missing, extra and duplicate setup identities) drives the SETUP
// side only, so the STATE side of the same rule had no cell at all.
test('F2-G01 a duplicated identity in the state exercise array refuses', () => {
  const ok = fixture(PAIR);
  assert.equal(ok.state.exercises.length, 2);
  assert(project(ok).exercises.map(e => e.id).includes('renamed-1'));
  const f = fixture(PAIR);
  f.state = copy(f.state);
  f.state.exercises[1] = copy(f.state.exercises[0]);
  const before = bytes(f.state);
  assert.equal(f.state.exercises.length, Object.keys(f.tags).length);
  assert.deepEqual(f.state.exercises.map(e => e.id), ['renamed-0', 'renamed-0']);
  bad(() => project(f));
  assert.equal(bytes(f.state), before);
  // The same state re-offered after the setup was already projected refuses too.
  const t = tagged(fixture(PAIR));
  t.state = copy(t.state);
  t.state.exercises[1] = copy(t.state.exercises[0]);
  bad(() => project(t));
});

// R1 B1. The module DOES refuse a non-record context by name at :136; nothing pinned it,
// so mutant M24 ("if (!plain(context)) fail();" disabled) survived every cell.
test('F2-G02 a non-record projection context refuses the named error', () => {
  const f = fixture(PAIR);
  for (const ctx of [null, undefined, 'a string state', 42, 0, true, false, [], [['tags', null]],
    new Map(), Object.create({ tags: null }), () => ({})]) {
    const before = bytes(f.state);
    bad(() => projectSetupTags(f.state, ctx));
    assert.equal(bytes(f.state), before);
  }
  // A null-prototype record is a record, and the absent-tags identity branch still holds.
  const ctx = Object.assign(Object.create(null), { tags: null });
  assert.equal(projectSetupTags(f.state, ctx), f.state);
});

// Mutants M09 / M09b. A duplicate muscle was only ever caught because the region map
// disagreed as well; with a consistent region map nothing refused it.
test('F2-G03 the injected taxonomy muscle list must be a non-empty array of unique names', () => {
  const ok = { muscles: ['back'], regions: { upper_back: 'back' } };
  assert(createSetupTagProjector({ taxonomy: copy(ok) }));
  for (const t of [{ muscles: ['back', 'back'], regions: { upper_back: 'back' } },
    { muscles: [], regions: {} }, { muscles: ['back', ''], regions: { upper_back: 'back' } },
    { muscles: ['back', '  '], regions: { upper_back: 'back' } },
    { muscles: ['back', 42], regions: { upper_back: 'back' } },
    { muscles: ['back', null], regions: { upper_back: 'back' } },
    { muscles: 'back', regions: {} }, { muscles: ['back'], regions: [] }]) {
    bad(() => createSetupTagProjector({ taxonomy: t }));
  }
});

// Mutant M11c. No cell fed a zero, a negative or a fractional set count through the
// shared exercise validator.
test('F2-G04 exercise set, ceiling and increment bounds refuse', () => {
  assert.equal(validateExerciseTags(EX, TAG), true);
  for (const patch of [{ sets: 0 }, { sets: -2 }, { sets: 2.5 }, { sets: '2' }, { sets: null },
    { sets: Number.MAX_SAFE_INTEGER + 2 }, { hi: 0 }, { hi: -10 }, { hi: 10.5 }, { hi: '10' },
    { inc: 0 }, { inc: -5 }, { inc: '5' }, { inc: NaN }, { inc: Infinity }, { inc: null }]) {
    bad(() => validateExerciseTags(exercise(patch), TAG));
  }
});

// Mutant M11d. Nothing drove the progression ladder itself.
test('F2-G05 exercise progression steps must be strictly ascending positive numbers', () => {
  for (const steps of [[10, 10], [20, 10], [10, 15, 15], [10, 15, 14], [0], [0, 10], [-5, 10],
    [10, '15'], [10, null], [10, NaN], [10, Infinity], [[10], [15]], []]) {
    bad(() => validateExerciseTags(exercise({ steps }), TAG));
  }
  assert.equal(validateExerciseTags(exercise({ steps: [0.5, 1, 100] }), TAG), true);
});

// Mutant M20. The setup document's own shape had no cell: every existing refusal came
// from the snapshot, the exercise rows or the state.
test('F2-G06 the setup document is closed and its label and priorities are typed', () => {
  const ok = fixture(PAIR);
  assert.equal(validateSetupTags(ok.setup, ok.tags), true);
  for (const edit of [s => { s.junk = true; }, s => { s.athlete_label = ''; },
    s => { s.athlete_label = '   '; }, s => { s.athlete_label = 42; }, s => { delete s.athlete_label; },
    s => { s.priority_muscles = ['']; }, s => { s.priority_muscles = [42]; },
    s => { s.priority_muscles = 'chest'; }, s => { delete s.priority_muscles; },
    s => { s.exercises = []; }, s => { s.exercises = {}; }]) {
    const f = fixture(PAIR); edit(f.setup); const before = bytes(f.tags);
    bad(() => validateSetupTags(f.setup, f.tags));
    assert.equal(bytes(f.tags), before);
  }
});

// Mutant M21. A malformed SOURCE split was never driven; the landed cell only ever
// mutates the STATE's split.
test('F2-G07 the source split must be a seven-day map over the known day kinds', () => {
  for (const edit of [s => { s.split.map[3] = 'X'; }, s => { s.split.map[3] = null; },
    s => { s.split.map[3] = 'u'; }, s => { delete s.split.map[6]; }, s => { s.split.map[7] = 'REST'; },
    s => { s.split.map = ['REST', 'U', 'REST', 'REST', 'L', 'REST', 'REST']; },
    s => { s.split.from = '2026-02-30'; }, s => { s.split.from = 'yesterday'; },
    s => { s.split.from = '2026-9-14'; }, s => { s.split.extra = true; }, s => { delete s.split.map; }]) {
    const f = fixture(PAIR); edit(f.setup);
    bad(() => validateSetupTags(f.setup, f.tags));
  }
  const f = fixture(PAIR); f.setup.split.map[3] = 'F';
  assert.equal(validateSetupTags(f.setup, f.tags), true);
});

// Mutant M37b. With the calendar term gone a malformed date is compared as TEXT, and a
// string that sorts after the setup day passes. Every row below sorts after 2026-09-14.
test('F2-G08 a history date that is not a calendar day refuses instead of sorting as text', () => {
  for (const d of ['9999-99-99', '2026-9-14', '2026-13-01', '2026-02-30', 'zzzz']) {
    for (const edit of [s => { s.reads.push({ d, w: 180 }); },
      s => { s.sleep.nights.push({ d, h: 8 }); }, s => { s.dailyLogs[d] = { cal: 2300 }; },
      s => { s.sessionLog[d] = { entries: [] }; },
      s => { s.workoutFacts = { profile: 'earned/workout-facts/v1', sessions: [
        { effective: { local_date: d } }] }; }]) {
      const t = tagged(fixture(PAIR)); t.state = copy(t.state); edit(t.state);
      const before = bytes(t.state);
      bad(() => project(t));
      assert.equal(bytes(t.state), before);
    }
  }
  // The control: the same rows on a real day after the setup re-project unchanged.
  const t = tagged(fixture(PAIR)); t.state = copy(t.state);
  t.state.reads.push({ d: '2026-09-15', w: 180 });
  t.state.dailyLogs['2026-09-15'] = { cal: 2300 };
  assert.equal(bytes(project(t)), bytes(t.state));
});

// Mutant M41, and the untagged-emptiness term beside it.
test('F2-G09 workoutFacts must carry the profile and an array of sessions', () => {
  for (const facts of [{ profile: 'earned/workout-facts/v2', sessions: [] },
    { profile: '', sessions: [] }, { profile: null, sessions: [] }, { sessions: [] },
    { profile: 'earned/workout-facts/v1', sessions: {} },
    { profile: 'earned/workout-facts/v1', sessions: 'none' },
    { profile: 'earned/workout-facts/v1' }]) {
    const f = fixture(PAIR); f.state = copy(f.state); f.state.workoutFacts = facts;
    bad(() => project(f));
  }
  // An untagged state carries no session at all, however well formed the session is.
  const f = fixture(PAIR); f.state = copy(f.state);
  f.state.workoutFacts = { profile: 'earned/workout-facts/v1', sessions: [
    { effective: { local_date: '2026-09-15' } }] };
  bad(() => project(f));
  // The same session on the already-tagged state is accepted.
  const t = tagged(fixture(PAIR)); t.state = copy(t.state);
  t.state.workoutFacts = { profile: 'earned/workout-facts/v1', sessions: [
    { effective: { local_date: '2026-09-15' } }] };
  assert.equal(bytes(project(t)), bytes(t.state));
});

// Mutant M42. With the shape term gone a non-record session reads local_date off
// undefined and the caller sees a raw TypeError instead of the module's own refusal.
test('F2-G10 each workout fact session and its effective record must be records', () => {
  for (const session of [[], 42, 'session', true, { effective: null }, { effective: [] },
    { effective: 'today' }, {}]) {
    const t = tagged(fixture(PAIR)); t.state = copy(t.state);
    t.state.workoutFacts = { profile: 'earned/workout-facts/v1', sessions: [session] };
    bad(() => project(t));
  }
});

// Mutants M38 / M39. R1 lists both as uncovered. Measured: they are load-bearing after
// all. A null row with the term gone reads "d" off null and the caller sees a raw
// TypeError; an inherited-prototype row is caught earlier, by cloneData.
test('F2-G11 non-record history rows and night rows refuse', () => {
  const inherited = () => Object.assign(Object.create({ inherited: true }), { d: '2026-09-15', w: 180 });
  for (const edit of [s => { s.reads.push(inherited()); }, s => { s.sleep.nights.push(inherited()); },
    s => { s.reads.push(new Date('2026-09-15')); }, s => { s.reads.push('2026-09-15'); },
    s => { s.reads.push(null); }, s => { s.sleep.nights.push(null); },
    s => { s.sleep.nights.push(42); }, s => { s.reads.push(42); },
    s => { s.sessionLog['2026-09-15'] = []; }, s => { s.sessionLog['2026-09-15'] = { entries: {} }; }]) {
    const t = tagged(fixture(PAIR)); t.state = copy(t.state); edit(t.state);
    bad(() => project(t));
  }
});

// R1's measured prototype safety, which no cell proved.
test('F2-G12 prototype-chain names are data, never structure', () => {
  for (const head of ['constructor', 'toString', 'hasOwnProperty', '__proto__', 'valueOf']) {
    const f = fixture([customEntry({ name: 'Synthetic chest press', mg: 'chest' })]);
    f.tags['renamed-0'].head = head;
    bad(() => validateSetupTags(f.setup, f.tags));
    f.tags['renamed-0'] = { head: null, secondary: [{ mg: 'biceps', lend: 0.5, head }] };
    bad(() => validateSetupTags(f.setup, f.tags));
  }
  const f = fixture([customEntry({ name: 'Synthetic chest press', mg: 'chest' })]);
  f.setup.exercises[0].id = '__proto__';
  f.tags = { ['__proto__']: { head: null, secondary: [] } };
  f.state = createCleanInitState({ setup: f.setup });
  const out = project(f);
  assert.equal(out.exercises[0].id, '__proto__');
  assert.equal(Object.prototype.volumeTags, undefined);
  assert.equal(Object.prototype.head, undefined);
  assert.equal(Object.prototype.secondary, undefined);
});

// The state-level accessor: the landed cell drives one on an exercise field only.
test('F2-G13 a state-level data accessor is refused without executing it', () => {
  for (const key of ['exercises', 'athlete_label', 'reads', 'sleep']) {
    const f = fixture(PAIR); let reads = 0;
    f.state = copy(f.state);
    const value = f.state[key];
    Object.defineProperty(f.state, key, { enumerable: true, configurable: true,
      get() { reads++; return value; } });
    bad(() => project(f));
    assert.equal(reads, 0, key);
  }
});
