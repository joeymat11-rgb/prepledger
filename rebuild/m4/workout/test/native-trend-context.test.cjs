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
const { createNativeTrendContextBinding, createEmptyHistoryDayFacts,
  createEnginePredicateDayFacts, createDayFactsReader, enginePredicatesAvailable,
  bindingDigest, ENGINE_DAY_PREDICATES, REFUSAL } = require('../native-trend-context.cjs');

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
  // review r1, F7/C7: bind REFUSES an absent facts object; it never doubles as
  // a silent unbind. Clearing a binding has exactly one name.
  assert.throws(() => binding.bind(null), TypeError);
  assert.throws(() => binding.bind(undefined), TypeError);
  binding.bind(factsFor());
  binding.unbind();
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

// ------------------------------------------------------------------------
// F. REVIEW r1 — WHAT THE BINDING ACTUALLY ENFORCES (C1), THE WINDOW (C3),
//    THE PACE PRECEDENCE (C6) AND bind(null) (C7).
// ------------------------------------------------------------------------

test('identity is NOT enforced at this seam, and the module does not claim it', () => {
  // review r1, F1 / B1a, committed as a cell so no later reader has to rediscover
  // it: the accepted adapter hands genSession a structuredClone
  // (rebuild/m4/workout/engine-capture.cjs:52), so the engine never holds the
  // bound object and a structurally equal, DIFFERENT object is indistinguishable
  // here. It is answered, not refused. That is the honest behaviour.
  const facts = factsFor();
  const binding = bindingOver(emptyState(), facts);
  const twin = structuredClone(facts);
  const fromTwin = { start_op_id: twin.sessions[0].start_op_id, source_revision: twin.source_revision,
    effective: { ...twin.sessions[0].effective } };
  assert.notEqual(twin, facts, 'a different object');
  const answer = binding.resolve(fromTwin);
  assert.equal(answer.start_op_id, START);
  assert.equal(answer.source_revision, 7);
});

test('the content digest catches a facts object that MOVES under the binding', () => {
  // What the live reference genuinely buys, and what the digest turns into a
  // named refusal instead of a silent answer over changed bytes.
  for (const move of [
    f => { f.source_revision = 8; },
    f => { f.sessions[0].effective.local_time = '10:01'; },
    f => { f.sessions[0].record.pace = 'rushed'; },
    f => { f.sessions.push({ start_op_id: 'op-second', effective: { ...EFFECTIVE }, record: {} }); },
  ]) {
    const facts = factsFor();
    const binding = bindingOver(emptyState(), facts);
    assert.ok(binding.resolve(requestFor()), 'qualified before the move');
    move(facts);
    refuses(() => binding.resolve(requestFor()), 'bound_facts_digest_mismatch');
  }
});

test('the digest covers exactly the members resolve reads, and nothing else', () => {
  const facts = factsFor();
  const before = bindingDigest(facts);
  assert.match(before, /^[0-9a-f]{16}$/, 'a 16-hex-digit change detector');
  assert.equal(bindingDigest(structuredClone(facts)), before, 'deterministic, and not identity-based');
  // A member no answer depends on moves: the digest does not move, so the
  // binding does not manufacture a refusal it cannot justify.
  facts.sessions[0].record.entries.push({ anything: true });
  assert.equal(bindingDigest(facts), before, 'an unread member is not part of the binding');
  // Each read member moves the digest.
  for (const move of [f => { f.source_revision = 9; }, f => { f.sessions[0].start_op_id = 'op-other'; },
    f => { f.sessions[0].effective.utc_offset = '+01:00'; }, f => { f.sessions[0].pace = 'normal'; },
    f => { f.profile = 'earned/workout-facts/v9'; }]) {
    const moved = factsFor();
    move(moved);
    assert.notEqual(bindingDigest(moved), before);
  }
});

test('withFacts is the bind…finally window, and it RESTORES rather than clears', () => {
  const facts = factsFor();
  const binding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state: emptyState() }) });
  refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts');
  const answered = binding.withFacts(facts, () => binding.resolve(requestFor()));
  assert.equal(answered.start_op_id, START);
  assert.equal(binding.bound(), null, 'the window closed');
  assert.equal(binding.digest(), null);
  refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts');
  // Re-entrant: an inner window over the same facts does not disarm the outer
  // one when it returns. This is the previous-performance read (review r1, F3).
  binding.withFacts(facts, () => {
    assert.equal(binding.bound(), facts);
    binding.withFacts(structuredClone(facts), () => assert.notEqual(binding.bound(), facts));
    assert.equal(binding.bound(), facts, 'the outer window is restored, not cleared');
    assert.ok(binding.resolve(requestFor()), 'and it still answers');
  });
  assert.equal(binding.bound(), null);
  // A throw inside the read still closes the window.
  assert.throws(() => binding.withFacts(facts, () => { throw new Error('read failed'); }), /read failed/);
  assert.equal(binding.bound(), null);
  // An absent facts object opens an explicitly UNBOUND window, never leaving
  // the previous binding standing.
  binding.withFacts(facts, () => {
    binding.withFacts(undefined, () => refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts'));
    assert.equal(binding.bound(), facts);
  });
  assert.throws(() => binding.withFacts(facts, 'not a function'), TypeError);
});

test('a second engine read over the same facts is answered INSIDE its own window, and refused outside it', () => {
  // The exact shape the gym card's readPrevious needs: the producer's window
  // has already closed, so the later read must open its own.
  const facts = factsFor();
  const binding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state: emptyState() }) });
  binding.withFacts(facts, () => binding.resolve(requestFor()));       // the producer's read
  refuses(() => binding.resolve(requestFor()), 'no_bound_source_facts'); // readPrevious without a window
  const again = binding.withFacts(facts, () => binding.resolve(requestFor()));
  assert.deepEqual(again, { start_op_id: START, source_revision: 7, effective: { ...EFFECTIVE },
    hard: false, rushed: false, debt: false });
});

test('two pace declarations that disagree are refused, never resolved by precedence', () => {
  // review r1, F6: session.pace:'normal' used to mask session.record.pace:'rushed'.
  const facts = factsFor();
  facts.sessions[0].pace = 'normal';
  facts.sessions[0].record.pace = 'rushed';
  refuses(() => bindingOver(emptyState(), facts).resolve(requestFor()), 'session_pace_disagreement');
  const other = factsFor();
  other.sessions[0].pace = 'rushed';
  other.sessions[0].record.pace = 'normal';
  refuses(() => bindingOver(emptyState(), other).resolve(requestFor()), 'session_pace_disagreement');
  // Two declarations that AGREE are the athlete's one declaration, and answer.
  const agreeing = factsFor();
  agreeing.sessions[0].pace = 'rushed';
  agreeing.sessions[0].record.pace = 'rushed';
  assert.equal(bindingOver(emptyState(), agreeing).resolve(requestFor()).rushed, true);
  // A declaration in EITHER place alone is read — neither is ignored.
  const onlySession = factsFor();
  onlySession.sessions[0].pace = 'rushed';
  assert.equal(bindingOver(emptyState(), onlySession).resolve(requestFor()).rushed, true);
  const onlyRecord = factsFor();
  onlyRecord.sessions[0].record.pace = 'rushed';
  assert.equal(bindingOver(emptyState(), onlyRecord).resolve(requestFor()).rushed, true);
  // And an unrecognised label refuses from either place.
  const badOnSession = factsFor();
  badOnSession.sessions[0].pace = 'brisk';
  refuses(() => bindingOver(emptyState(), badOnSession).resolve(requestFor()), 'session_pace_unrecognised');
});

// ------------------------------------------------------------------------
// G. THE S2 PATH — recorded nights and events mapped through the ENGINE's own
//    predicates, behind an option that is OFF by default (PM question Q1(a)).
// ------------------------------------------------------------------------

// The athlete shape the shipped gym card actually carries: recorded nights.
const nightsState = (count = 28) => ({ events: [],
  sleep: { nights: Array.from({ length: count },
    (_, i) => ({ d: '2026-08-' + String(i + 1).padStart(2, '0'), h: 7 })) } });

test('the option is OFF by default: a day with recorded nights refuses exactly as today', () => {
  const reader = createDayFactsReader({ state: nightsState() });
  assert.equal(reader.optionRequested, false, 'default OFF');
  assert.equal(reader.enginePredicates, false);
  const binding = createNativeTrendContextBinding({ dayFacts: reader.dayFacts });
  binding.bind(factsFor());
  refuses(() => binding.resolve(requestFor()), 'recorded_sleep_unmapped');
});

test('the option ON without the engine predicates keeps the SAME refusal — never a silent downgrade', () => {
  assert.equal(enginePredicatesAvailable(undefined), false);
  assert.equal(enginePredicatesAvailable({ genSession: () => null, rirPlan: () => null }), false,
    'the pinned EXPOSED surface does not carry them');
  assert.deepEqual(ENGINE_DAY_PREDICATES.slice(), ['dayWeather', 'cleanAtDate']);
  const reader = createDayFactsReader({ state: nightsState(),
    engine: { genSession: () => null, rirPlan: () => null },
    mapRecordedDaysWithEnginePredicates: true });
  assert.equal(reader.optionRequested, true);
  assert.equal(reader.enginePredicatesAvailable, false);
  assert.equal(reader.enginePredicates, false, 'it fell back rather than guessing');
  const binding = createNativeTrendContextBinding({ dayFacts: reader.dayFacts });
  binding.bind(factsFor());
  refuses(() => binding.resolve(requestFor()), 'recorded_sleep_unmapped');
  assert.throws(() => createDayFactsReader({ state: nightsState(), mapRecordedDaysWithEnginePredicates: 'yes' }),
    TypeError);
});

test('the engine-predicate reader refuses to exist without the engine\'s own two readers', () => {
  assert.throws(() => createEnginePredicateDayFacts({ state: nightsState() }), TypeError);
  assert.throws(() => createEnginePredicateDayFacts({ state: nightsState(), engine: { dayWeather: () => ({}) } }),
    TypeError);
  assert.throws(() => createEnginePredicateDayFacts({ engine: { dayWeather: () => ({}), cleanAtDate: () => true } }),
    TypeError);
});

// The engine's OWN two predicates, taken off the real twelve-module
// composition. This is the surface a re-seal would have to add to EXPOSED
// (engine-runtime.cjs:11); nothing here reopens it, the test simply composes
// the engine itself, which is what every other cell in group E already does.
const ENGINE = composeEngine(undefined);
const enginePredicates = { dayWeather: ENGINE.dayWeather, cleanAtDate: ENGINE.cleanAtDate };

test('the engine composes dayWeather and cleanAtDate — they exist, they are just not EXPOSED', () => {
  for (const name of ENGINE_DAY_PREDICATES) assert.equal(typeof ENGINE[name], 'function', name);
  assert.equal(enginePredicatesAvailable(enginePredicates), true);
});

test('option ON + the engine\'s own predicates: a day with 28 RECORDED NIGHTS is qualified', () => {
  const state = { exercises: [], ...nightsState(28) };
  const reader = createDayFactsReader({ state, engine: enginePredicates,
    mapRecordedDaysWithEnginePredicates: true });
  assert.equal(reader.enginePredicates, true, 'the engine\'s own readers were used');
  const binding = createNativeTrendContextBinding({ dayFacts: reader.dayFacts });
  binding.bind(factsFor());
  const answer = binding.resolve(requestFor());
  // The answer is not a constant: it is exactly what the engine's own two
  // predicates say at this row's own date, asked directly, in the other order.
  assert.deepEqual({ hard: answer.hard, debt: answer.debt },
    { hard: !!ENGINE.dayWeather(state, DAY).hardSession, debt: !ENGINE.cleanAtDate(state, DAY) });
  assert.equal(typeof answer.hard, 'boolean');
  assert.equal(typeof answer.debt, 'boolean');
  // …and the SAME athlete, with the option off, still refuses. One option, one
  // difference.
  const off = createDayFactsReader({ state, engine: enginePredicates });
  const refusing = createNativeTrendContextBinding({ dayFacts: off.dayFacts });
  refusing.bind(factsFor());
  refuses(() => refusing.resolve(requestFor()), 'recorded_sleep_unmapped');
});

test('option ON: a recorded EVENT on the day answers hard:true — not a constant false', () => {
  const state = { exercises: [], events: [{ d: DAY, t: 'wedding' }], sleep: { nights: [] } };
  const reader = createDayFactsReader({ state, engine: enginePredicates,
    mapRecordedDaysWithEnginePredicates: true });
  const binding = createNativeTrendContextBinding({ dayFacts: reader.dayFacts });
  binding.bind(factsFor());
  const answer = binding.resolve(requestFor());
  assert.equal(answer.hard, true, 'the engine\'s own dayWeather says this day was hard');
  assert.equal(answer.hard, !!ENGINE.dayWeather(state, DAY).hardSession);
  // The empty-history reader refuses the same athlete rather than reading him
  // as not-hard, which is the whole reason the option exists.
  const empty = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state }) });
  empty.bind(factsFor());
  refuses(() => empty.resolve(requestFor()), 'recorded_events_unmapped');
});

test('option ON: a predicate that throws REFUSES — a caught exception is never read as false', () => {
  // PERFORMED-ENGINE-v1.md:254 forbids "caught exceptions interpreted as false"
  // on the native branch, so this reader does NOT copy progression.cjs:702,704's
  // `catch (e) { hard = false; }`.
  const state = { exercises: [], ...nightsState(3) };
  const throwing = { dayWeather: () => { throw new Error('boom'); }, cleanAtDate: () => true };
  const b1 = createNativeTrendContextBinding({ dayFacts: createEnginePredicateDayFacts({ state, engine: throwing }) });
  b1.bind(factsFor());
  refuses(() => b1.resolve(requestFor()), 'day_weather_unreadable');
  const throwingClean = { dayWeather: () => ({ hardSession: false }), cleanAtDate: () => { throw new Error('boom'); } };
  const b2 = createNativeTrendContextBinding({ dayFacts: createEnginePredicateDayFacts({ state, engine: throwingClean }) });
  b2.bind(factsFor());
  refuses(() => b2.resolve(requestFor()), 'clean_at_date_unreadable');
  // A predicate that answers with something that is not a boolean is refused
  // too, rather than coerced.
  const vague = { dayWeather: () => ({ hardSession: 'yes' }), cleanAtDate: () => true };
  const b3 = createNativeTrendContextBinding({ dayFacts: createEnginePredicateDayFacts({ state, engine: vague }) });
  b3.bind(factsFor());
  refuses(() => b3.resolve(requestFor()), 'day_weather_not_boolean');
  const vagueClean = { dayWeather: () => ({ hardSession: false }), cleanAtDate: () => 1 };
  const b4 = createNativeTrendContextBinding({ dayFacts: createEnginePredicateDayFacts({ state, engine: vagueClean }) });
  b4.bind(factsFor());
  refuses(() => b4.resolve(requestFor()), 'clean_at_date_not_boolean');
});

test('the ENGINE accepts the option-ON answer for an athlete with 28 recorded nights', () => {
  const facts = factsFor();
  const state = { exercises: [], ...nightsState(28), workoutFacts: facts };
  const row = { d: DAY, rec: facts.sessions[0].record, source: 'performed', start_op_id: START };
  // Control: the same athlete with the option OFF is the tree's current
  // behaviour — the engine refuses, containing this module's refusal.
  const off = createNativeTrendContextBinding({
    dayFacts: createDayFactsReader({ state, engine: enginePredicates }).dayFacts });
  off.bind(facts);
  assert.throws(() => composeEngine(off.resolve).performedTrendContext(state, row),
    { code: 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED', reason: 'resolver_failed' });
  // With the option on and the engine's own predicates present, the engine gets
  // three booleans and does not refuse.
  const on = createNativeTrendContextBinding({
    dayFacts: createDayFactsReader({ state, engine: enginePredicates,
      mapRecordedDaysWithEnginePredicates: true }).dayFacts });
  on.bind(facts);
  const flags = composeEngine(on.resolve).performedTrendContext(state, row);
  assert.deepEqual(Object.keys(flags).sort(), ['debt', 'hard', 'rushed']);
  for (const key of ['hard', 'rushed', 'debt']) assert.equal(typeof flags[key], 'boolean', key);
  assert.deepEqual({ hard: flags.hard, debt: flags.debt },
    { hard: !!ENGINE.dayWeather(state, DAY).hardSession, debt: !ENGINE.cleanAtDate(state, DAY) });
});
