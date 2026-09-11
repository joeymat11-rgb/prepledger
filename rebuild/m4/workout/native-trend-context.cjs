'use strict';
// QUALIFIED nativeTrendContext provider — the B-NTC package.
//
// rebuild/engine/performed.cjs:191-206 `performedTrendContext(s,row)` builds a
// request {start_op_id, source_revision, effective} for every NATIVE row the
// trend readers enumerate, hands it to the injected `nativeTrendContext`
// resolver, and refuses PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED unless the
// answer echoes that binding exactly and carries three explicit booleans:
//
//   performed.cjs:198  if(typeof nativeTrendContext!=='function')unavailable('resolver_missing');
//   performed.cjs:199  let answer;try{answer=structuredClone(nativeTrendContext(...));}catch(_){unavailable('resolver_failed');}
//   performed.cjs:202-204  start_op_id / source_revision / effective must match
//                          and ['hard','rushed','debt'] must each be a boolean.
//
// Until this module existed the only providers in the tree were
//   * the declared TEST assumption
//     `assumed = request => ({...request, hard:false, rushed:false, debt:false})`
//     (rebuild/m4/spec/native-next-target-candidate/fixture.cjs:58), which
//     HARDCODES the three flags and proves nothing about an athlete, and
//   * the honest refusal `createUnavailableNativeTrendContext`
//     (rebuild/m3/w6/host/workout-host.mjs:56), which every accepted host
//     carries and which makes day+3 of a fresh athlete unpreparable
//     (DECISIONS:102).
//
// WHAT "QUALIFIED" MEANS HERE. Two independent obligations, both of which this
// module discharges by PROOF or by REFUSAL, never by a default:
//
//   (1) CORRESPONDENCE. The answer must be about the very Start the engine
//       asked about, read at the very source revision the engine is reading.
//       This module binds to the `workoutFacts` OBJECT the producer is about to
//       hand the engine — identity, not a copy — so a stale, replayed or
//       cross-generation request cannot be answered at all.
//
//   (2) FLAG PROVENANCE. Each of hard / rushed / debt must come from a fact the
//       athlete actually recorded, read under the ENGINE's own accepted
//       predicate. Where this module cannot discharge that, it THROWS; the
//       engine contains the throw as PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED /
//       reason "resolver_failed" and nothing is written. It never guesses.
//
// WHY THE DAY READER IS INJECTED AND HAS NO DEFAULT. `hard` and `debt` are
// day-scoped readings of the athlete's own state, not properties of the session
// record:
//   * hard = rebuild/engine/sleep.cjs:1889 `dayWeather(s,iso).hardSession`
//            = `flags.some(f => f.k === "event" && !f.pre)`, where the event
//            flags come from `(s.events||[])` within a -1..+2 day halo
//            (sleep.cjs:1877).
//   * debt = `!cleanAtDate(s,iso)` (sleep.cjs:1017-1029), read over
//            `s.sleep.nights`.
// The legacy branch of `liftTrend` calls exactly those two at the row's date
// (progression.cjs:702, 704). A native row's date is already the session's own
// `effective.local_date` — the engine itself adopts that mapping at
// performed.cjs:145-157 when it builds `rows.push({d, rec, source:'performed',
// start_op_id})`. So there is no new mapping to invent: the same predicates,
// the same state, the same date key.
//
// This module nevertheless does NOT call them, and does NOT restate them.
// `rebuild/m4/workout/engine-runtime.cjs` exposes exactly ['genSession',
// 'rirPlan'] and that surface is PINNED by the accepted M2-NATIVE-CARRIERS
// artifact (rebuild/m4/spec/native-carriers-witnesses.cjs:16 asserts
// `COMPOSITION.exposed.slice().sort()` equals ['genSession','rirPlan']), so a
// host cannot obtain `dayWeather` / `cleanAtDate` without reopening an accepted
// package, and composing a second engine to get them is forbidden (A2: "no
// second engine"). Copying the two bodies here would be the "copied second
// implementation" PERFORMED-ENGINE-v1 §6 forbids. So the day reader is a
// REQUIRED injected collaborator with no fallback, and this module ships the
// one reader it can prove today — see createEmptyHistoryDayFacts.
//
// WHERE `rushed` COMES FROM. `paceRushed(sl)` is
// `!!sl && sl.pace === PACE.rushed` (progression.cjs:544). It is a test for an
// athlete's affirmative DECLARATION, written by writers.cjs:401 as
// `pace: extras.pace === "rushed" || extras.pace === "normal" ? extras.pace : null`
// and announced by writers.cjs:402 as "RUSHED SESSION — LOGGED AS SUCH". The
// native capture records no such declaration: rebuild/m4/workout/schema.cjs:112
// closes a `session-close` payload to exactly `['completion_kind']` with
// `['normal','early']`. A native session therefore carries no pace label, and
// "was not logged as rushed" is a fact about the record, not a claim about the
// athlete's rest intervals. That is the ONLY reading this module gives `false`,
// and it is guarded: if a session record ever grows an own `pace` member, an
// unrecognised value REFUSES rather than being read as "not rushed".
const REFUSAL = 'NATIVE_TREND_CONTEXT_UNQUALIFIED';
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function unqualified(reason, extra) {
  const error = new Error(REFUSAL);
  error.code = REFUSAL;
  error.reason = reason;
  if (extra) Object.assign(error, extra);
  throw error;
}

// `effective` correspondence, in the engine's own terms. performed.cjs:201-203
// compares own key COUNT and then every expected key by `Object.hasOwn` and
// `===`. This is the same comparison run in the other direction, so a bound
// session whose effective tuple differs from the request's in any way — an
// extra member, a missing member, a changed local_time — is refused here,
// BEFORE the engine's own check, with a reason that names the field.
function sameEffective(a, b) {
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every(k => Object.hasOwn(b, k) && a[k] === b[k]);
}

// The pace forward-guard described above. Returns a boolean or refuses; never
// interprets an unknown label as "not rushed".
function rushedOf(session) {
  for (const holder of [session, session && session.record]) {
    if (!holder || typeof holder !== 'object' || !Object.hasOwn(holder, 'pace')) continue;
    const pace = holder.pace;
    if (pace === 'rushed') return true;
    if (pace === 'normal' || pace === null) return false;
    unqualified('session_pace_unrecognised');
  }
  // No pace member anywhere on the record: paceRushed's literal value.
  return false;
}

// THE DAY READER THIS PACKAGE CAN PROVE.
//
// It answers only for an athlete whose state carries NO recorded event and NO
// recorded sleep night. For such a state the two engine predicates are constant
// and their values are read off their own first lines, not recomputed:
//
//   * `cleanAtDate` (sleep.cjs:1017-1019):
//       const nights = nightsBefore(s, iso);
//       if (!nights.length) return true;
//     `nightsBefore` filters `(((s||{}).sleep||{}).nights||[])`, so an empty
//     nights list makes cleanAtDate TRUE for every date ⇒ debt === false.
//
//   * `dayWeather` (sleep.cjs:1877): the ONLY producer of a `k:"event"` flag is
//       (s.events || []).forEach(...)
//     so an empty events list makes `flags.some(f => f.k === "event" && !f.pre)`
//     FALSE for every date ⇒ hardSession === false.
//
// That is a proof over an empty input, not a default, and it is exactly the
// fresh athlete DECISIONS:100 puts on Earned at S2.
//
// The moment either list is non-empty this reader REFUSES — it does not fall
// back, and it does not approximate the halo or the three-night run. Mapping a
// recorded event or a recorded night onto a native session is the open item the
// APM recorded verbatim in rebuild/m4/REPORT-OWNER-WORKOUT-BRIEF-ASTRA.md:17
// ("no accepted native hard/rushed/debt mapping ... old cleanAtDate returns
// true on no nights and native event intervals are not legacy dated-event/halo
// semantics"). Closing it needs the engine's own two readers at this seam,
// which needs the pinned runtime surface reopened — a PM decision, recorded as
// PM question Q1 in BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md.
//
// The state is read on EVERY call, never captured at construction, so a host
// that composes once and trains for weeks starts refusing the day the athlete
// records a night or an event, instead of answering from a stale proof.
function createEmptyHistoryDayFacts({ state } = {}) {
  if (!state || typeof state !== 'object' || Array.isArray(state))
    throw new TypeError('createEmptyHistoryDayFacts requires the athlete engine state');
  return function dayFacts(iso) {
    if (typeof iso !== 'string' || !ISO.test(iso)) unqualified('day_key_invalid');
    const events = state.events;
    if (events !== undefined && (!Array.isArray(events) || events.length))
      unqualified('recorded_events_unmapped', { day: iso });
    const nights = state.sleep === undefined || state.sleep === null ? undefined : state.sleep.nights;
    if (nights !== undefined && (!Array.isArray(nights) || nights.length))
      unqualified('recorded_sleep_unmapped', { day: iso });
    return { hard: false, debt: false };
  };
}

// THE BINDING.
//
// `bind(workoutFacts)` is called by the host's workoutProducer with the very
// object it is about to place on the engine state, so `resolve` compares by
// IDENTITY (===) as well as by value. `unbind()` is called when the producer
// leaves, so a request that arrives outside one preparation is refused rather
// than answered from the last one.
function createNativeTrendContextBinding({ dayFacts } = {}) {
  if (typeof dayFacts !== 'function')
    throw new TypeError('createNativeTrendContextBinding requires an injected dayFacts(iso) reader');
  let bound = null;

  function bind(workoutFacts) {
    if (workoutFacts === undefined || workoutFacts === null) { bound = null; return null; }
    if (typeof workoutFacts !== 'object' || Array.isArray(workoutFacts) ||
        workoutFacts.profile !== 'earned/workout-facts/v1' ||
        !Number.isSafeInteger(workoutFacts.source_revision) || workoutFacts.source_revision < 1 ||
        !Array.isArray(workoutFacts.sessions))
      throw new TypeError('createNativeTrendContextBinding.bind requires earned/workout-facts/v1 read at a revision');
    bound = workoutFacts;
    return workoutFacts;
  }
  function unbind() { bound = null; }

  // The resolver handed to createEngineRuntime({nativeTrendContext}). Every
  // path out of it is either an echoed binding with three proven booleans, or a
  // throw. There is no third outcome.
  function resolve(request) {
    if (!bound) unqualified('no_bound_source_facts');
    if (!request || typeof request !== 'object' || Array.isArray(request)) unqualified('request_malformed');
    const { start_op_id: start, source_revision: revision, effective } = request;
    if (typeof start !== 'string' || !start.trim()) unqualified('request_start_invalid');
    if (revision !== bound.source_revision) unqualified('source_revision_mismatch', { bound: bound.source_revision });
    const matches = bound.sessions.filter(s => s && s.start_op_id === start);
    if (matches.length !== 1) unqualified(matches.length ? 'start_not_unique_in_bound_facts' : 'start_not_in_bound_facts', { start_op_id: start });
    const session = matches[0];
    if (!sameEffective(session.effective, effective)) unqualified('effective_tuple_mismatch', { start_op_id: start });
    const day = session.effective.local_date;
    if (typeof day !== 'string' || !ISO.test(day)) unqualified('session_local_date_invalid', { start_op_id: start });
    const facts = dayFacts(day);
    if (!facts || typeof facts !== 'object' || typeof facts.hard !== 'boolean' || typeof facts.debt !== 'boolean')
      unqualified('day_facts_not_boolean', { start_op_id: start, day });
    const rushed = rushedOf(session);
    // Echo the binding the engine asked with, plus the three proven flags.
    return { start_op_id: start, source_revision: revision, effective: { ...effective },
      hard: facts.hard, rushed, debt: facts.debt };
  }

  return Object.freeze({ resolve, bind, unbind, bound: () => bound, REFUSAL });
}

module.exports = { createNativeTrendContextBinding, createEmptyHistoryDayFacts, REFUSAL };
