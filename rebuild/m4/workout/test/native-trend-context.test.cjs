'use strict';
// B-NTC — the qualified nativeTrendContext provider.
//
// Two layers of evidence:
//   (A) the provider's own cells — qualified, unqualified and boundary;
//   (B) the ENGINE's own acceptance — rebuild/engine/performed.cjs
//       performedTrendContext composed over the real twelve-module factory list
//       (the same list and order rebuild/m4/workout/engine-runtime.cjs:9 uses),
//       proving the answer survives performed.cjs:200-204 rather than refusing.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createNativeTrendContextBinding, createEmptyHistoryDayFacts, REFUSAL } =
  require('../native-trend-context.cjs');

const DAY = '2026-09-04';
const EFFECTIVE = Object.freeze({ local_date: DAY, local_time: '10:00', utc_offset: '+00:00' });
const START = 'op-dev-A-start-1';

const factsFor = (overrides = {}) => ({
  profile: 'earned/workout-facts/v1', source_revision: 7,
  sessions: [{ start_op_id: START, effective: { ...EFFECTIVE }, record: { entries: [] } }],
  ...overrides,
});
const requestFor = (overrides = {}) => ({
  start_op_id: START, source_revision: 7, effective: { ...EFFECTIVE }, ...overrides,
});
const emptyState = () => ({ events: [], sleep: { nights: [] } });
const bindingOver = (state = emptyState(), facts = factsFor()) => {
  const binding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state }) });
  binding.bind(facts);
  return binding;
};
const refuses = (fn, reason) => {
  assert.throws(fn, error => {
    assert.equal(error.code, REFUSAL, 'refusal code');
    if (reason !== undefined) assert.equal(error.reason, reason, 'refusal reason');
    return true;
  });
};

// ---------------------------------------------------------------- A. QUALIFIED

test('the qualified answer echoes the binding and carries three real booleans', () => {
  const answer = bindingOver().resolve(requestFor());
  assert.deepEqual(answer, { start_op_id: START, source_revision: 7, effective: { ...EFFECTIVE },
    hard: false, rushed: false, debt: false });
  for (const flag of ['hard', 'rushed', 'debt']) assert.equal(typeof answer[flag], 'boolean', flag);
});

test('the echo is a copy: mutating the answer cannot reach the bound facts', () => {
  const facts = factsFor();
  const answer = bindingOver(emptyState(), facts).resolve(requestFor());
  answer.effective.local_date = '1999-01-01';
  assert.equal(facts.sessions[0].effective.local_date, DAY, 'bound facts are untouched');
});

test('a session logged rushed answers rushed:true, from the record and not a default', () => {
  const facts = factsFor();
  facts.sessions[0].record.pace = 'rushed';
  assert.equal(bindingOver(emptyState(), facts).resolve(requestFor()).rushed, true);
  facts.sessions[0].record.pace = 'normal';
  assert.equal(bindingOver(emptyState(), facts).resolve(requestFor()).rushed, false);
});

// ------------------------------------------------------- B. FAILS CLOSED: BIND

test('the resolver refuses when no preparation has bound any facts', () => {
  const binding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state: emptyState() }) });
  refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts');
});

test('unbind really unbinds — a later request is never answered from the last preparation', () => {
  const binding = bindingOver();
  assert.ok(binding.resolve(requestFor()));
  binding.unbind();
  refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts');
});

test('bind refuses anything that is not earned/workout-facts/v1 read at a revision', () => {
  const binding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state: emptyState() }) });
  for (const bad of [factsFor({ profile: 'earned/workout-facts/v2' }), factsFor({ source_revision: 0 }),
    factsFor({ source_revision: 1.5 }), factsFor({ sessions: undefined }), 'facts', 7, []])
    assert.throws(() => binding.bind(bad), TypeError);
  assert.equal(binding.bind(null), null, 'an absent facts object clears the binding');
  refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts');
});

test('a dayFacts reader is required — there is no default day reader', () => {
  assert.throws(() => createNativeTrendContextBinding({}), TypeError);
  assert.throws(() => createNativeTrendContextBinding({ dayFacts: 'nope' }), TypeError);
  assert.throws(() => createEmptyHistoryDayFacts({}), TypeError);
});

// ------------------------------------------- C. FAILS CLOSED: CORRESPONDENCE

test('a stale source revision is refused, never answered from the bound one', () => {
  const binding = bindingOver();
  refuses(() => binding.resolve(requestFor({ source_revision: 8 })), 'source_revision_mismatch');
  refuses(() => binding.resolve(requestFor({ source_revision: 6 })), 'source_revision_mismatch');
  refuses(() => binding.resolve(requestFor({ source_revision: '7' })), 'source_revision_mismatch');
});

test('a Start the bound facts do not carry is refused', () => {
  refuses(() => bindingOver().resolve(requestFor({ start_op_id: 'op-elsewhere' })), 'start_not_in_bound_facts');
});

test('a Start the bound facts carry twice is refused, never resolved to the first', () => {
  const facts = factsFor();
  facts.sessions.push({ start_op_id: START, effective: { ...EFFECTIVE }, record: { entries: [] } });
  refuses(() => bindingOver(emptyState(), facts).resolve(requestFor()), 'start_not_unique_in_bound_facts');
});

test('an effective tuple that differs in any way is refused', () => {
  const binding = bindingOver();
  refuses(() => binding.resolve(requestFor({ effective: { ...EFFECTIVE, local_time: '10:01' } })), 'effective_tuple_mismatch');
  refuses(() => binding.resolve(requestFor({ effective: { ...EFFECTIVE, local_date: '2026-09-05' } })), 'effective_tuple_mismatch');
  refuses(() => binding.resolve(requestFor({ effective: { local_date: DAY, local_time: '10:00' } })), 'effective_tuple_mismatch');
  refuses(() => binding.resolve(requestFor({ effective: { ...EFFECTIVE, extra: 1 } })), 'effective_tuple_mismatch');
  refuses(() => binding.resolve(requestFor({ effective: null })), 'effective_tuple_mismatch');
});

test('a malformed request is refused before anything is read', () => {
  const binding = bindingOver();
  for (const [bad, reason] of [[null, 'request_malformed'], ['x', 'request_malformed'], [[], 'request_malformed']])
    refuses(() => binding.resolve(bad), reason);
  refuses(() => binding.resolve(requestFor({ start_op_id: '' })), 'request_start_invalid');
  refuses(() => binding.resolve(requestFor({ start_op_id: 7 })), 'request_start_invalid');
});

test('a bound session whose own local_date is malformed is refused', () => {
  const facts = factsFor();
  facts.sessions[0].effective = { local_date: '4th', local_time: '10:00', utc_offset: '+00:00' };
  refuses(() => bindingOver(emptyState(), facts).resolve(requestFor({ effective: { ...facts.sessions[0].effective } })),
    'session_local_date_invalid');
});

// ------------------------------------------------ D. FAILS CLOSED: PROVENANCE

test('a recorded event refuses rather than being mapped onto a native session', () => {
  const state = emptyState();
  state.events = [{ d: '2026-09-04', t: 'wedding' }];
  refuses(() => bindingOver(state).resolve(requestFor()), 'recorded_events_unmapped');
});

test('a recorded sleep night refuses rather than being read as clean', () => {
  const state = emptyState();
  state.sleep.nights = [{ d: '2026-09-03', h: 5 }];
  refuses(() => bindingOver(state).resolve(requestFor()), 'recorded_sleep_unmapped');
});

test('the empty proof is re-read every call, never captured at construction', () => {
  const state = emptyState();
  const binding = bindingOver(state);
  assert.ok(binding.resolve(requestFor()), 'qualified while the state is empty');
  state.sleep.nights.push({ d: '2026-09-03', h: 5 });
  refuses(() => binding.resolve(requestFor()), 'recorded_sleep_unmapped');
});

test('an absent events / sleep member is the empty proof; a malformed one refuses', () => {
  assert.ok(bindingOver({}).resolve(requestFor()), 'a state with neither member is the empty case');
  refuses(() => bindingOver({ events: 'none' }).resolve(requestFor()), 'recorded_events_unmapped');
  refuses(() => bindingOver({ sleep: { nights: {} } }).resolve(requestFor()), 'recorded_sleep_unmapped');
});

test('an unrecognised pace label refuses — it is never read as "not rushed"', () => {
  for (const pace of ['RUSHED', 'hurried', 1, true, {}]) {
    const facts = factsFor();
    facts.sessions[0].record.pace = pace;
    refuses(() => bindingOver(emptyState(), facts).resolve(requestFor()), 'session_pace_unrecognised');
  }
});

test('a dayFacts reader that answers with anything but two booleans is refused', () => {
  for (const bad of [() => null, () => ({ hard: false }), () => ({ hard: 0, debt: 0 }), () => 'clean']) {
    const binding = createNativeTrendContextBinding({ dayFacts: bad });
    binding.bind(factsFor());
    refuses(() => binding.resolve(requestFor()), 'day_facts_not_boolean');
  }
});

// ---------------------------------------- E. THE ENGINE ITSELF ACCEPTS IT

// The same twelve modules, in the same order, that engine-runtime.cjs:9 composes.
const MODULES = ['dates', 'constants', 'plan', 'performed', 'progression', 'sleep',
  'energy', 'policy', 'today', 'volume', 'earn', 'writers'];
function composeEngine(nativeTrendContext) {
  const clock = { today: () => DAY, nowISO: () => DAY + 'T12:00:00.000Z',
    nowMs: () => Date.parse(DAY + 'T12:00:00.000Z'), hour: () => 12,
    dow: () => new Date(DAY + 'T00:00:00Z').getUTCDay() };
  const mint = () => { throw new Error('no ids'); };
  const deps = { clock, ids: Object.freeze({ next: mint, fresh: mint }),
    drafts: Object.freeze({ length: 0, key: () => null }) };
  const E = { HISTORY: [], ROLLUPS: [], SEED: {}, exById: (s, id) => s.exercises.find(e => e.id === id) };
  for (const name of MODULES) {
    const create = require('../../../engine/' + name + '.cjs');
    Object.assign(E, name === 'performed' ? create(E, { nativeTrendContext }) : create(E, deps));
  }
  return E;
}

test('the engine accepts the qualified answer where it refused the absent resolver', () => {
  const facts = factsFor();
  const state = { exercises: [], events: [], sleep: { nights: [] }, workoutFacts: facts };
  const row = { d: DAY, rec: facts.sessions[0].record, source: 'performed', start_op_id: START };

  // Control 1 — no resolver at all: the engine's own refusal, reason resolver_missing.
  assert.throws(() => composeEngine(undefined).performedTrendContext(state, row),
    { code: 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', reason: 'resolver_missing' });

  // Control 2 — A0's honest refusal resolver: reason resolver_failed. This is
  // exactly what every accepted host carries today (DECISIONS:102).
  const unavailable = () => { const e = new Error('NATIVE_TREND_CONTEXT_UNAVAILABLE'); e.code = e.message; throw e; };
  assert.throws(() => composeEngine(unavailable).performedTrendContext(state, row),
    { code: 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', reason: 'resolver_failed' });

  // The package — the engine returns the three flags instead of refusing.
  const binding = bindingOver(state, facts);
  assert.deepEqual(composeEngine(binding.resolve).performedTrendContext(state, row),
    { hard: false, rushed: false, debt: false });
});

test('the engine still refuses when this provider refuses — the refusal is contained, not converted', () => {
  const facts = factsFor();
  const stateWithNight = { exercises: [], events: [], sleep: { nights: [{ d: '2026-09-03', h: 5 }] }, workoutFacts: facts };
  const row = { d: DAY, rec: facts.sessions[0].record, source: 'performed', start_op_id: START };
  const binding = bindingOver(stateWithNight, facts);
  assert.throws(() => composeEngine(binding.resolve).performedTrendContext(stateWithNight, row),
    { code: 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', reason: 'resolver_failed' });
  // And an UNBOUND resolver is the same containment, not an answer.
  binding.unbind();
  assert.throws(() => composeEngine(binding.resolve).performedTrendContext(stateWithNight, row),
    { code: 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', reason: 'resolver_failed' });
});

test('the engine rejects an answer that does not echo the binding (negative control on the echo)', () => {
  const facts = factsFor();
  const state = { exercises: [], events: [], sleep: { nights: [] }, workoutFacts: facts };
  const row = { d: DAY, rec: facts.sessions[0].record, source: 'performed', start_op_id: START };
  const binding = bindingOver(state, facts);
  for (const tamper of [a => ({ ...a, source_revision: a.source_revision + 1 }),
    a => ({ ...a, start_op_id: 'other' }), a => ({ ...a, hard: 'no' }),
    a => ({ ...a, effective: { ...a.effective, local_time: '11:00' } })]) {
    const resolver = request => tamper(binding.resolve(request));
    assert.throws(() => composeEngine(resolver).performedTrendContext(state, row),
      { code: 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', reason: 'context_binding_or_flags_invalid' });
  }
});
