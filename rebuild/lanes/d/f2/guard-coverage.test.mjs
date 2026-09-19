// F2-LAND fix round. Cells for the guard terms of rebuild/m4/workout/setup-tags.cjs
// that F2-LAND-REVIEW-R1 measured as driven by NO cell, here or on the old branch.
// No byte of the module changes: every cell below is green on the unmutated module
// and red on the single-term mutant named in its comment (R1 B2, and R1 B1's M24).
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { CATALOGUE, ENGINE_MG, REGION_MG, customEntry } from '../../../m3/w7-preview/today/exercise-catalogue.mjs';
const require = createRequire(import.meta.url);
const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { createCleanInitState } = require('../../../m4/workout/athlete-state.cjs');
const { createSetupTagProjector } = require('../../../m4/workout/setup-tags.cjs');
const taxonomy = { muscles: ENGINE_MG, regions: REGION_MG };
// Defer the shared factory so construction failures can be reported by rows.
// The unchanged projector.test.mjs still exercises construction at file scope.
let projector;
const shared = () => projector ??= createSetupTagProjector({ taxonomy });
const validateSetupTags = (...args) => shared().validateSetupTags(...args);
const projectSetupTags = (...args) => shared().projectSetupTags(...args);
const validateExerciseTags = (...args) => shared().validateExerciseTags(...args);
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

// ---------------------------------------------------------------------------
// MICRO FIX ROUND 3. The rows below answer F2-LAND-REVIEW-R2's two upheld
// findings and the PM's own two, measured on the module line by line. NO BYTE
// of rebuild/m4/workout/setup-tags.cjs and none of projector.test.mjs changes:
// every row is green on the unmutated module and red on the single-term mutant
// named in its comment. F2-G22 is the one exception and says so itself.
// ---------------------------------------------------------------------------
const thrown = fn => { try { fn(); } catch (e) { return e; } return null; };
const ONE = entry => [{ mg: entry, kinds: ['U'], head: null, secondary: [] }];
const DELTS = [{ mg: 'delts', kinds: ['U'], head: 'delts_front', secondary: [] }];

// R2 B1, first term. Mutant: :79 "|| !text(e.id)" deleted. With it gone an empty,
// blank or numeric athlete-facing identity is ACCEPTED by both entry points.
test('F2-G14 the exercise identity must be non-empty text', () => {
  assert.equal(validateExerciseTags(EX, TAG), true);
  for (const id of ['', '   ', '\t\n', 42, 0, null, true, false]) {
    bad(() => validateExerciseTags(exercise({ id }), TAG));
  }
  // And through the setup document, whose snapshot is keyed to match the id.
  for (const id of ['', '   ']) {
    const f = fixture(ONE('chest'));
    f.setup.exercises[0].id = id;
    f.tags = { [id]: { head: null, secondary: [] } };
    bad(() => validateSetupTags(f.setup, f.tags));
  }
});

// R2 B1, second term. Mutant: :79 "|| !text(e.n)" deleted.
test('F2-G15 the exercise display name must be non-empty text', () => {
  for (const n of ['', '   ', '\t', 42, 0, null, true]) {
    bad(() => validateExerciseTags(exercise({ n }), TAG));
  }
  const f = fixture(ONE('chest'));
  f.setup.exercises[0].n = '';
  bad(() => validateSetupTags(f.setup, f.tags));
});

// R2 B1, third term, the sharpest of the four. Mutant: :80
// "|| !['U', 'L'].includes(e.day)" deleted. The split map separately admits F and
// REST, so with the term gone a lift parked on a rest day validates and projects.
test('F2-G16 an exercise day outside the U/L vocabulary refuses', () => {
  for (const day of ['F', 'REST', 'X', 'u', 'l', '', ' U', 1, null, ['U']]) {
    bad(() => validateExerciseTags(exercise({ day }), TAG));
  }
  assert.equal(validateExerciseTags(exercise({ day: 'L' }), TAG), true);
  const f = fixture(ONE('chest'));
  f.setup.exercises[0].day = 'REST';
  bad(() => validateSetupTags(f.setup, f.tags));
});

// R2 B1, fourth term, the re-projection tamper check. Mutant: :155
// "|| e.head !== snapshot[e.id].head" deleted. The marker carries no head, so
// equal(e.volumeTags, marker) cannot see the change and the sibling secondary
// term does not either; with the term gone the tampered head is ACCEPTED and
// silently overwritten from the snapshot at :189.
test('F2-G17 a stored primary head that disagrees with the snapshot refuses', () => {
  const t = tagged(fixture(DELTS));
  assert.equal(t.state.exercises[0].head, 'delts_front');
  for (const head of ['delts_side', 'delts_rear', null]) {
    const g = { ...t, state: copy(t.state) };
    g.state.exercises[0].head = head;
    const before = bytes(g.state);
    bad(() => project(g));
    assert.equal(bytes(g.state), before);
  }
  // The control: with the stored head left alone the same context re-projects.
  const same = { ...t, state: copy(t.state) };
  assert.equal(bytes(project(same)), bytes(same.state));
});

// R2 N1, first DEGRADING term, PINNED by the PM's order because section 7.3 of
// the author report uses exactly this argument for G11. Mutant: :82
// "|| !Array.isArray(e.steps)" deleted. With it gone a string or an array-like
// reaches e.steps.every and the caller sees a raw TypeError, not the named refusal.
test('F2-G18 a non-array progression ladder refuses by name, not by TypeError', () => {
  for (const steps of ['abc', { length: 2 }, { 0: 10, 1: 20, length: 2 }, null, 42,
    new Set([10, 20])]) {
    bad(() => validateExerciseTags(exercise({ steps }), TAG));
  }
});

// R2 N1, second DEGRADING term. Mutant: :144 "|| !Array.isArray(out.exercises)"
// deleted. An array-like of the right length then reaches for..of and the caller
// sees "out.exercises is not iterable" instead of SETUP_TAGS_INVALID.
test('F2-G19 a non-array state exercise list refuses by name, not by TypeError', () => {
  for (const exercises of [{ length: 2 }, { 0: { id: 'renamed-0' }, 1: { id: 'renamed-1' }, length: 2 },
    null, 2]) {
    const f = fixture(PAIR);
    f.state = copy(f.state);
    f.state.exercises = exercises;
    bad(() => project(f));
  }
});

// PM FINDING P-F2-1. A RECORDED LAXITY, not a rule. On the module as landed a null
// member of the setup exercises array reaches ids.has(e.id) at
// rebuild/m4/workout/setup-tags.cjs:124 BEFORE checkExerciseTag's closed() can refuse
// it, so the caller sees a raw TypeError and not SETUP_TAGS_INVALID. It still REFUSES
// and nothing is admitted, and no byte of the module may move in this round, so this
// row pins TODAY'S behaviour honestly. The day the module gains the missing guard at
// :124 this row goes RED and is rewritten on purpose to expect the named refusal.
// Two reviews and a 110-mutant sweep could not see it: it is a MISSING guard, not a
// mutable one. The consequence for EW2 is in the report: THE HOST TREATS ANY THROW
// FROM THIS MODULE AS A REFUSAL, never only err.code === 'SETUP_TAGS_INVALID'.
test('F2-G20 a null exercise row throws, and the throw is NOT the named refusal (:124)', () => {
  const f = fixture(PAIR);
  const nulled = { ...f.setup, exercises: [null] };
  for (const call of [() => validateSetupTags(nulled, f.tags),
    () => projectSetupTags(f.state, { setup: nulled, tags: f.tags, op_id: OP, date: DATE })]) {
    const e = thrown(call);
    assert.notEqual(e, null, 'it refuses, by throwing');
    assert.equal(e instanceof TypeError, true, 'today the throw is a raw TypeError');
    assert.notEqual(e.code, 'SETUP_TAGS_INVALID', 'and NOT the module\'s named refusal');
  }
  // The contrast that shows this is about null alone: a number in the same slot is
  // refused by name, because ids.has(42) reads nothing off 42.
  const numbered = { ...f.setup, exercises: [42] };
  bad(() => validateSetupTags(numbered, f.tags));
  bad(() => projectSetupTags(f.state, { setup: numbered, tags: f.tags, op_id: OP, date: DATE }));
});

// PM FINDING P-F2-2, R2's head-side-twin note made a guard. :97's rule that a COARSE
// lift (tag.head === null) may not lend to a region of its own muscle is NOT applied
// when the lift carries an IDENTITY head, so the two encodings of one coarse lift
// disagree about the very same helper. It is UNREACHABLE under the shipped taxonomy,
// and this row asserts exactly the property that makes it unreachable: no muscle of
// ENGINE_MG has BOTH an identity entry in REGION_MG and a sub-region of its own
// (rebuild/m3/w7-preview/today/exercise-catalogue.mjs:61). The day someone adds a
// biceps_long this row goes RED and names :97.
// The first assertion is a SNAPSHOT pin of the eight identity names bolted to the
// property pin: adding a ninth identity muscle with no sub-region also reds it.
test('F2-G21 no shipped muscle has both an identity region and a sub-region (:97)', () => {
  const identity = ENGINE_MG.filter(mg => REGION_MG[mg] === mg);
  assert.deepEqual([...identity].sort(),
    ['abs', 'biceps', 'calves', 'forearms', 'glutes', 'hams', 'quads', 'triceps']);
  for (const mg of identity) {
    assert.deepEqual(Object.keys(REGION_MG).filter(r => REGION_MG[r] === mg && r !== mg), [], mg);
  }
  // The two-line fixture that records WHY the property matters: invent one sub-region
  // for a muscle that also carries an identity entry, and the head:null form refuses
  // the helper while its head:'biceps' twin accepts it.
  const twin = createSetupTagProjector({ taxonomy: { muscles: ['biceps'],
    regions: { biceps: 'biceps', biceps_long: 'biceps' } } });
  const lift = { id: 'x0', n: 'Synthetic curl', mg: 'biceps', day: 'U',
    sets: 2, hi: 10, inc: 5, steps: [10, 15] };
  const helper = [{ mg: 'biceps_long', lend: 0.5 }];
  bad(() => twin.validateExerciseTags(lift, { head: null, secondary: copy(helper) }));
  assert.equal(twin.validateExerciseTags(lift, { head: 'biceps', secondary: copy(helper) }), true);
});

// PM RULING on ticket item (4). Retiring rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs is
// STOPPED and routed to the S10 brief, so until S10 rules the landed module and the lane
// copy MUST NOT DRIFT APART. No cell on this branch pins that: PE16
// (plan-edit/model.test.cjs:505) compares the LANE COPY with the published blob at
// f3e9561 and never reads the landed file from the tree at all, so an edit to
// rebuild/m4/workout/setup-tags.cjs alone reds nothing there.
// THIS ROW IS DELETED ON PURPOSE BY THE RETIREMENT TICKET, together with the copy.
// It is a BYTE-IDENTITY PIN and not a behaviour row: it is red on EVERY mutant of the
// module by construction, which is why the round-3 mutation table counts "red alone"
// over the behaviour rows and names this row's standing red beside each one.
test('F2-G22 the landed module and the lane copy do not drift apart', () => {
  const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
  const landed = sha(require.resolve('../../../m4/workout/setup-tags.cjs'));
  assert.equal(landed, sha(require.resolve('../plan-edit/f2-tag-adapter.cjs')),
    'the landed module and the lane copy are the same bytes');
  assert.equal(landed, 'd0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d',
    'and both are the blob every reader of this landing measured');
});

// ---------------------------------------------------------------------------
// FOUND BY THIS ROUND'S OWN RE-MEASUREMENT, and closed in the same round rather
// than left in the report as a hole of the class R2 called BLOCKING. The 140
// term-level mutants of section 7 of the author report left FIVE terms whose
// removal flips the module from refusing to ACCEPTING (F2-G23 to F2-G27) and
// SEVEN whose removal degrades a named refusal into a raw throw (F2-G28 to
// F2-G34). The degrading rows are pinned on the PM's own rule for G11, G18 and
// G19: a TypeError is not this module's refusal contract. Same discipline as
// above: no module byte changes and each row is red, and red alone, on the
// single-term mutant named in its comment.
// ---------------------------------------------------------------------------

// Mutant: :152 "e.mg !== authored.mg" deleted. On an ALREADY TAGGED state the
// :158 first-enrichment branch never runs, so :152 is the only check that the
// stored row still belongs to the muscle the setup authored.
test('F2-G23 a tagged state row whose muscle left the authored setup refuses', () => {
  const t = tagged(fixture(PAIR));
  for (const mg of ['back', 'quads', 'chest']) {
    const g = { ...t, state: copy(t.state) };
    if (g.state.exercises[0].mg === mg) continue;
    g.state.exercises[0].mg = mg;
    bad(() => project(g));
  }
});

// Mutant: :152 "e.day !== authored.day" deleted. The day half of the same rule.
test('F2-G24 a tagged state row whose day left the authored setup refuses', () => {
  const t = tagged(fixture(PAIR));
  for (const day of ['L', 'U']) {
    const g = { ...t, state: copy(t.state) };
    if (g.state.exercises[0].day === day) continue;
    g.state.exercises[0].day = day;
    bad(() => project(g));
  }
});

// Mutant: :158 "|| own(e, 'secondary')" deleted. The head half of the same line is
// driven; the secondary half was not, so an untagged state already carrying a
// helper list was ACCEPTED and then silently overwritten from the snapshot.
test('F2-G25 an untagged state row may not already carry a helper list', () => {
  for (const secondary of [[], [{ mg: 'triceps', lend: 0.5 }], null]) {
    const f = fixture(PAIR);
    f.state = copy(f.state);
    f.state.exercises[0].secondary = secondary;
    bad(() => project(f));
  }
});

// Mutant: :158 "|| !Array.isArray(e.forks)" deleted. The emptiness term beside it
// reads .length off the non-array and finds undefined, so nothing refused.
test('F2-G26 an untagged state row fork list must be an array', () => {
  for (const forks of [{}, { length: 0 }, 'none']) {
    const f = fixture(PAIR);
    f.state = copy(f.state);
    f.state.exercises[0].forks = forks;
    bad(() => project(f));
  }
});

// Mutant: :164 "!plain(out[key])" deleted. Object.keys() of an array is empty, so
// the emptiness term beside it passes and an ARRAY map history was accepted.
test('F2-G27 the untagged map histories must be records and not arrays', () => {
  for (const key of ['dailyLogs', 'sessionLog', 'retirements']) {
    for (const value of [[], [1, 2]]) {
      const f = fixture(PAIR);
      f.state = copy(f.state);
      f.state[key] = value;
      bad(() => project(f));
    }
  }
});

// Mutant: :163 "!Array.isArray(out[key])" deleted. .length off a record is
// undefined, so the emptiness term passes and out.reads.forEach throws raw.
test('F2-G28 the untagged array histories must be arrays', () => {
  for (const key of ['reads', 'queue', 'weekly', 'accepted']) {
    for (const value of [{}, { length: 0 }, 'none', 7]) {
      const f = fixture(PAIR);
      f.state = copy(f.state);
      f.state[key] = value;
      bad(() => project(f));
    }
  }
});

// Mutant: :165 "|| !Array.isArray(out.sleep.nights)" deleted. Same shape: the
// emptiness term passes and out.sleep.nights.forEach throws raw at :173.
test('F2-G29 the untagged sleep night list must be an array', () => {
  for (const nights of [{}, { length: 0 }, 'none', 7, null]) {
    const f = fixture(PAIR);
    f.state = copy(f.state);
    f.state.sleep = { ...f.state.sleep, nights };
    bad(() => project(f));
  }
});

// Mutant: :184 "!plain(session)" deleted. G10 drives the OTHER members of that
// line with [], 42 and a string, each of which still refuses by name through
// session.effective; a NULL session reads .effective off null and throws raw.
test('F2-G30 a null workout fact session refuses by name, not by TypeError', () => {
  for (const sessions of [[null], [{ effective: { local_date: '2026-09-15' } }, null]]) {
    const t = tagged(fixture(PAIR));
    t.state = copy(t.state);
    t.state.workoutFacts = { profile: 'earned/workout-facts/v1', sessions };
    bad(() => project(t));
  }
});

// Mutant: :58 "a === null" in equal() deleted. typeof null is 'object', so a null
// stored marker reaches Object.keys(null) and throws raw instead of comparing
// unequal. :153 reads own(e, 'volumeTags'), which a null value satisfies.
test('F2-G31 a null stored marker refuses by name, not by TypeError', () => {
  for (const volumeTags of [null, 0, '']) {
    const t = tagged(fixture(PAIR));
    t.state = copy(t.state);
    t.state.exercises[0].volumeTags = volumeTags;
    bad(() => project(t));
  }
});

// Mutant: :116 "|| !Array.isArray(source.exercises)" deleted. G06 drives {} and
// [] on the same term, and both still refuse by name through .length; a NULL
// exercise list reads .length off null and throws raw.
test('F2-G32 a null setup exercise list refuses by name, not by TypeError', () => {
  const f = fixture(PAIR);
  for (const exercises of [null, undefined]) {
    const setup = { ...f.setup, exercises };
    bad(() => validateSetupTags(setup, f.tags));
    bad(() => projectSetupTags(f.state, { setup, tags: f.tags, op_id: OP, date: DATE }));
  }
});

// Mutant: :144 "!plain(out)" deleted. R2 N2 records this term as REDUNDANT
// ("caught by the label and identity comparisons"), which is true of 42, [] and a
// string but NOT of null or undefined: those read .athlete_label off nothing and
// throw raw. Measured, not argued; the report's 7.2 carries the correction.
test('F2-G33 a null or absent state refuses by name, not by TypeError', () => {
  const f = fixture(PAIR);
  for (const state of [null, undefined]) {
    bad(() => projectSetupTags(state, context(f)));
  }
  // The members R2 measured as redundant, kept so the row states the whole rule.
  for (const state of [42, [], 'a state', true]) {
    bad(() => projectSetupTags(state, context(f)));
  }
});

// Mutant: :149 "!plain(e)" deleted. The same correction to R2 N2: a null STATE row
// reads .id off null and throws raw. Note the contrast with F2-G20: the state side
// of this rule HAS its guard at :149 and the setup side at :124 does not.
test('F2-G34 a null state exercise row refuses by name, not by TypeError', () => {
  for (const row of [null, undefined]) {
    const f = fixture(PAIR);
    f.state = copy(f.state);
    f.state.exercises[1] = row;
    bad(() => project(f));
  }
});

// R3 B1. Mutant: :116 "|| !source.exercises.length" deleted. An EMPTY snapshot
// matches the empty exercise list, so :128's count check cannot refuse it.
test('F2-G35 an empty setup exercise list with an empty snapshot refuses', () => {
  const f = fixture(PAIR);
  f.setup.exercises = [];
  bad(() => validateSetupTags(f.setup, {}));
});

// R3 B1. Mutant: :124 "ids.has(e.id) ||" deleted. The snapshot holds ONE key for
// two occurrences of that id; the Set stays size one and :128 cannot refuse it.
test('F2-G36 duplicate setup ids refuse even when the snapshot has one matching key', () => {
  const f = fixture(ONE('chest'));
  f.setup.exercises.push(copy(f.setup.exercises[0]));
  assert.equal(Object.keys(f.tags).length, 1);
  bad(() => validateSetupTags(f.setup, f.tags));
});

// R3 B1. Mutant: :165 "!plain(out.sleep) ||" deleted. Reading .nights off null
// then throws a raw TypeError instead of the named refusal.
test('F2-G37 null sleep refuses by name, not by TypeError', () => {
  const f = fixture(PAIR);
  f.state = copy(f.state);
  f.state.sleep = null;
  bad(() => project(f));
});

// R3 B1. Mutant: :177 "!plain(record) ||" deleted. On a tagged state the null
// sessionLog record reaches .entries and throws raw instead of refusing by name.
test('F2-G38 a null sessionLog record refuses by name, not by TypeError', () => {
  const f = tagged(fixture(PAIR));
  f.state.sessionLog['2026-09-15'] = null;
  bad(() => project(f));
});

// R3 extra term. Mutant: :139 "!descriptor ||" deleted. NO tags property is
// distinct from tags:null and tags:undefined; identity on this path is PM-intended.
test('F2-G39 a context with no tags property returns the state by identity', () => {
  const f = fixture(PAIR);
  const ctx = { setup: f.setup, op_id: OP, date: DATE };
  assert.equal(Object.hasOwn(ctx, 'tags'), false);
  assert.equal(projectSetupTags(f.state, ctx), f.state);
});

// Astra re-check, RECORDED LAXITY at :124: key coercion in own(snapshot, e.id)
// precedes :79's text guard. A JSON id object with no usable toString throws raw.
// Rewrite this row on purpose the day the module gains the missing id guard.
test('F2-G40 an uncoercible setup id throws and is NOT the named refusal (:124)', () => {
  const f = fixture(PAIR);
  f.setup.exercises[0].id = { toString: null };
  for (const call of [() => validateSetupTags(f.setup, f.tags), () => project(f)]) {
    const e = thrown(call);
    assert.notEqual(e, null, 'it refuses, by throwing');
    assert.equal(e instanceof TypeError, true, 'today the throw is a raw TypeError');
    assert.notEqual(e.code, 'SETUP_TAGS_INVALID', 'and NOT the module\'s named refusal');
  }
});

// Astra re-check, RECORDED LAXITY at :43: cloneData recursively visits values
// without a depth guard. Rewrite this row on purpose the day that guard arrives.
// The RangeError is the engine's stack limit, not a property of this module;
// a larger runner stack can clone this input and then refuse it BY NAME.
test('F2-G41 a setup value nested 20000 objects deep throws a raw RangeError (:43)', () => {
  const f = fixture(PAIR);
  let value = null;
  for (let i = 0; i < 20000; i++) value = { child: value };
  f.setup.priority_muscles = [value];
  for (const call of [() => validateSetupTags(f.setup, f.tags), () => project(f)]) {
    const e = thrown(call);
    assert.notEqual(e, null, 'it refuses, by throwing');
    assert.equal(e instanceof RangeError, true, 'today the throw is a raw RangeError');
    assert.notEqual(e.code, 'SETUP_TAGS_INVALID', 'and NOT the module\'s named refusal');
  }
});

// Astra continuation. Mutant: :36 "array && keys.length !== value.length + 1"
// disabled. A missing first slot with slot 1 retained reaches :124 as undefined.
test('F2-G42 a setup exercise array with a leading hole refuses by name on both setup paths', () => {
  const f = fixture(PAIR);
  const second = f.setup.exercises[1];
  delete f.setup.exercises[0];
  assert.equal(f.setup.exercises.length, 2);
  assert.equal(Object.hasOwn(f.setup.exercises, 0), false);
  assert.equal(f.setup.exercises[1], second);
  bad(() => validateSetupTags(f.setup, f.tags));
  bad(() => project(f));
});

// Astra continuation. Mutant: :59 "Array.isArray(a) !== Array.isArray(b)"
// deleted from equal(). Empty records must not compare equal to empty arrays.
test('F2-G43 record priorities and tagged secondary lists refuse when the snapshot holds arrays', () => {
  const fresh = fixture(PAIR);
  fresh.state = copy(fresh.state);
  assert.deepEqual(fresh.setup.priority_muscles, []);
  fresh.state.priority_muscles = {};
  bad(() => project(fresh));

  const marked = tagged(fixture(PAIR));
  assert.deepEqual(marked.tags['renamed-0'].secondary, []);
  marked.state.exercises[0].secondary = {};
  bad(() => project(marked));
});

// Astra continuation. Mutant: :162 "tagged && tagged !== ids.size" disabled.
// Each row is valid alone, but only the first of two carries the exact marker.
test('F2-G44 a state with only the first of two exercises tagged refuses', () => {
  const f = fixture(PAIR);
  const marked = project(f);
  f.state = copy(f.state);
  f.state.exercises[0] = copy(marked.exercises[0]);
  assert.equal(f.state.exercises.length, 2);
  assert.equal(Object.hasOwn(f.state.exercises[0], 'volumeTags'), true);
  assert.equal(Object.hasOwn(f.state.exercises[1], 'volumeTags'), false);
  bad(() => project(f));
});

// R4. Mutant: :18 "keys.every(k => own(x, k))" disabled in closed(). This
// term guards eight call sites; :120's value check cannot detect wrong day keys.
test('F2-G45 seven valid split values under keys a through g refuse', () => {
  const f = fixture(PAIR);
  f.setup.split.map = Object.fromEntries('abcdefg'.split('').map(k => [k, 'U']));
  assert.equal(Object.keys(f.setup.split.map).length, 7);
  bad(() => validateSetupTags(f.setup, f.tags));
});

// R4. Mutant: :41 "!descriptor.enumerable" deleted in cloneData(). An extra
// state member bypasses closed(); it must not be promoted into enumerable output.
test('F2-G46 a non-enumerable own state member refuses without projected output', () => {
  const f = fixture(PAIR);
  f.state = copy(f.state);
  Object.defineProperty(f.state, 'r4Hidden', { value: 'smuggled-past-the-boundary', enumerable: false });
  assert.equal(Object.hasOwn(f.state, 'r4Hidden'), true);
  assert.equal(Object.getOwnPropertyDescriptor(f.state, 'r4Hidden').enumerable, false);
  let out;
  bad(() => { out = project(f); });
  assert.equal(out, undefined, 'no projection may expose the hidden member as enumerable');
});

// R4. Mutant: :42 "array && (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >=
// value.length)" disabled. One hole plus one non-index key passes :36's count.
test('F2-G47 a priority array with one hole and one non-index property refuses', () => {
  const f = fixture(PAIR);
  f.setup.priority_muscles = [, 'chest'];
  f.setup.priority_muscles.r4Junk = 'back';
  assert.equal(Object.hasOwn(f.setup.priority_muscles, 0), false);
  assert.equal(Reflect.ownKeys(f.setup.priority_muscles).length, f.setup.priority_muscles.length + 1);
  bad(() => validateSetupTags(f.setup, f.tags));
});

// R4. Mutant: :58 "typeof a !== 'object'" deleted from equal(). Through :154,
// a primitive stored regionsByMuscle must not equal an identity taxonomy's {}.
test('F2-G48 a primitive stored taxonomy marker refuses against an empty record', () => {
  const local = createSetupTagProjector({ taxonomy: {
    muscles: ['chest', 'back'], regions: { chest: 'chest', back: 'back' } } });
  const f = fixture(PAIR);
  f.state = copy(local.projectSetupTags(f.state, context(f)));
  assert.deepEqual(f.state.exercises[0].volumeTags.regionsByMuscle, {});
  f.state.exercises[0].volumeTags.regionsByMuscle = 42;
  bad(() => local.projectSetupTags(f.state, context(f)));
});

// R4. Mutant: :58 "typeof b !== 'object'" deleted from equal(). Through :158,
// an untagged row's key-less sets object must not equal the authored number 2.
test('F2-G49 an empty sets record refuses against an authored primitive', () => {
  const f = fixture(PAIR);
  f.state = copy(f.state);
  assert.equal(f.setup.exercises[0].sets, 2);
  f.state.exercises[0].sets = {};
  bad(() => project(f));
});

// R4. Mutant: :118 "!plain(snapshot)" deleted. Text ids '0' and '1' address
// array slots and satisfy :128's count, but a tag snapshot must still be a record.
test('F2-G50 an array snapshot refuses even with matching numeric text ids', () => {
  const f = fixture(PAIR);
  f.setup.exercises.forEach((e, i) => { e.id = String(i); });
  f.tags = [f.tags['renamed-0'], f.tags['renamed-1']];
  assert.equal(Object.keys(f.tags).length, f.setup.exercises.length);
  bad(() => validateSetupTags(f.setup, f.tags));
});

// R4. Mutants: :27 the string/boolean return and :38 the array-length-key skip
// disabled, separately. Construct here so each factory stop has a named row.
test('F2-G51 the shipped taxonomy constructs a projector that accepts and projects', () => {
  let local;
  assert.doesNotThrow(() => { local = createSetupTagProjector({ taxonomy }); },
    'the shipped taxonomy must construct inside this behaviour row');
  const f = fixture(PAIR);
  assert.equal(local.validateSetupTags(f.setup, f.tags), true, 'ordinary setup acceptance');
  const out = local.projectSetupTags(f.state, context(f));
  assert.notEqual(out, f.state, 'ordinary projection creates a state');
  assert.equal(out.exercises.length, 2);
  assert.deepEqual(out.exercises[0].secondary, f.tags['renamed-0'].secondary);
  assert.equal(out.exercises[0].volumeTags.op_id, OP);
  assert.equal(Object.isFrozen(out), true);
});
