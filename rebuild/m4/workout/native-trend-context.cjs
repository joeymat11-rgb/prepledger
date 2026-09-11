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
//
//       WHAT IS NOT ENFORCEABLE, STATED FIRST (review r1, F1). Object IDENTITY
//       across the engine seam is NOT enforceable, and this module no longer
//       claims it. The accepted adapter clones the state before the engine sees
//       it — `const input=copy(captureState)` at
//       rebuild/m4/workout/engine-capture.cjs:52, where `copy` is
//       structuredClone — so `genSession` can never hold the object a host
//       bound, and the request the engine builds carries VALUES only
//       (performed.cjs:196 `effective:structuredClone(session.effective)`). A
//       structurally equal but different facts object is therefore
//       indistinguishable here, and pretending otherwise would be a claim the
//       code cannot keep.
//
//       WHAT IS ENFORCED — the strongest binding available at this seam, and
//       all three are re-checked on EVERY request:
//         (a) SCOPE. `bound` is a LIVE REFERENCE to the producer's own facts
//             object, held only for the window the host opens (withFacts, i.e.
//             bind … finally restore). Outside that window every request
//             refuses `no_bound_source_facts`; a stale or replayed request
//             cannot be answered from a previous preparation.
//         (b) A CONTENT DIGEST of the bound facts, taken at bind time and
//             recomputed at answer time (`bindingDigest`, below). Because the
//             binding is a live reference, a facts object that MOVES under the
//             binding — a revision bumped, an effective tuple rewritten, a pace
//             label added — is caught as `bound_facts_digest_mismatch` before
//             anything is read out of it.
//         (c) VALUE CORRESPONDENCE, in the engine's own terms: the request's
//             `source_revision` must equal the bound revision, exactly ONE
//             bound session must carry the request's `start_op_id`, and that
//             session's whole `effective` tuple must equal the request's,
//             key-count and value-for-value.
//       Digest + revision + unique Start key is the binding this module proves.
//       It is not identity, and it is not described as identity anywhere.
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
// This module nevertheless does NOT restate them and does NOT copy them.
// `rebuild/m4/workout/engine-runtime.cjs:11` exposes exactly ['genSession',
// 'rirPlan'] and that surface is PINNED by the accepted M2-NATIVE-CARRIERS
// artifact (rebuild/m4/spec/native-carriers-witnesses.cjs:16 asserts
// `COMPOSITION.exposed.slice().sort()` equals ['genSession','rirPlan']), so a
// host cannot obtain `dayWeather` / `cleanAtDate` today without reopening an
// accepted package, and composing a second engine to get them is forbidden
// (A2: "no second engine"). Copying the two bodies here would be the "copied
// second implementation" PERFORMED-ENGINE-v1 §6 forbids. So the day reader is a
// REQUIRED injected collaborator with no fallback, and this module ships TWO —
// see createEmptyHistoryDayFacts (the proof over an empty history, which is
// what runs today) and createEnginePredicateDayFacts (the engine's OWN two
// predicates, reachable only if a re-seal ever exposes them). Which one a host
// gets is decided by createDayFactsReader's option, which is OFF by default.
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
// and it is guarded twice: an unrecognised value REFUSES rather than being read
// as "not rushed", and (review r1, F6) BOTH possible holders are read —
// `session.pace` and `session.record.pace` — with a DISAGREEMENT between them
// refused rather than silently resolved by precedence.
//
// ONE MORE THING A READER SHOULD KNOW. `bound()` hands out the LIVE bound
// object, not a copy. It exists for tests and for a host that wants to assert
// the window is closed; writing through it is writing on the engine's own
// input, and the digest check in `resolve` is what makes such a write visible
// rather than silent.
const REFUSAL = 'NATIVE_TREND_CONTEXT_UNQUALIFIED';
const ISO = /^\d{4}-\d{2}-\d{2}$/;
// The two engine predicates this seam needs. They are NOT on the pinned
// EXPOSED surface today; a host may only pass them if a future re-seal adds
// them, and `createDayFactsReader` checks for them at runtime rather than
// assuming either way.
const ENGINE_DAY_PREDICATES = Object.freeze(['dayWeather', 'cleanAtDate']);

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

// THE CONTENT DIGEST (review r1, C1 — what replaced the identity claim).
//
// A deterministic 64-bit CHANGE DETECTOR over exactly the members `resolve`
// reads out of the bound facts, and nothing else:
//
//   profile · source_revision · sessions.length ·
//   for each session, in list order: start_op_id · the whole `effective` tuple
//   (keys sorted, values as encoded) · an own `pace` on the session · an own
//   `pace` on its record.
//
// It is NOT cryptographic and is not described as a commitment: there is no
// adversary inside one process, and the job here is to notice that the object
// the binding still points at has MOVED since it was bound. Scoping it to the
// members `resolve` reads keeps it O(sessions) with small constants — a
// mutation anywhere else cannot change any answer this module gives, so it
// would be a refusal with no meaning.
function canonicalBoundFields(workoutFacts) {
  const sessions = (workoutFacts.sessions || []).map(entry => {
    const session = entry && typeof entry === 'object' ? entry : null;
    const effective = session && session.effective && typeof session.effective === 'object' ? session.effective : null;
    const record = session && session.record && typeof session.record === 'object' ? session.record : null;
    return [
      session ? session.start_op_id : null,
      effective ? Object.keys(effective).sort().map(k => [k, effective[k]]) : null,
      session && Object.hasOwn(session, 'pace') ? ['session', session.pace] : null,
      record && Object.hasOwn(record, 'pace') ? ['record', record.pace] : null,
    ];
  });
  return JSON.stringify([workoutFacts.profile, workoutFacts.source_revision,
    (workoutFacts.sessions || []).length, sessions]);
}
function bindingDigest(workoutFacts) {
  const text = canonicalBoundFields(workoutFacts);
  // Two independent 32-bit FNV-1a-style lanes, printed as one 16-hex-digit
  // value. Integer-only, synchronous, no Node builtin: this module is bundled
  // for the phone, where node:crypto is refused and crypto.subtle is async.
  let a = 0x811c9dc5, b = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    a = Math.imul(a ^ code, 0x01000193);
    b = Math.imul(b ^ (code + i), 0x85ebca6b);
  }
  return (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
}

// The pace forward-guard described above. Returns a boolean or refuses; never
// interprets an unknown label as "not rushed", and never reads only one of the
// two places a declaration could sit (review r1, F6).
function rushedOf(session) {
  const record = session && typeof session === 'object' ? session.record : null;
  const declarations = [];
  for (const holder of [session, record && typeof record === 'object' ? record : null]) {
    if (!holder || typeof holder !== 'object' || !Object.hasOwn(holder, 'pace')) continue;
    const pace = holder.pace;
    if (pace === 'rushed') declarations.push(true);
    else if (pace === 'normal' || pace === null) declarations.push(false);
    else unqualified('session_pace_unrecognised');
  }
  // Two declarations that disagree are not resolved by precedence: the module's
  // whole claim is that it reads what the athlete declared, and two different
  // declarations are not a fact about one session.
  if (declarations.length === 2 && declarations[0] !== declarations[1])
    unqualified('session_pace_disagreement');
  if (declarations.length) return declarations[0];
  // No pace member anywhere on the record: paceRushed's literal value.
  return false;
}

// THE DAY READER THIS PACKAGE CAN PROVE TODAY.
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
// semantics"). Closing it needs the engine's own two readers at this seam —
// which is what createEnginePredicateDayFacts below is, and which needs the
// pinned runtime surface reopened (PM question Q1).
//
// MEASURED, AND THE REASON THAT OPTION EXISTS (review r1, F2): the athlete the
// shipped gym card and rebuild/m3/w7-preview/today/today-entry.mjs:26 actually
// pass to createGymHost — `createTodayModel({}).stateFromOps()` — carries 28
// RECORDED SLEEP NIGHTS, so this reader refuses `recorded_sleep_unmapped` for
// every date and B-NTC alone does not open the product's own gym card.
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

// THE DAY READER FOR AN ATHLETE WHO HAS RECORDED NIGHTS AND EVENTS — the S2
// path, option A (PM question Q1(a)).
//
// It calls the ENGINE's own two predicates at the row's own date. It restates
// nothing, approximates nothing and copies no body: `dayWeather` and
// `cleanAtDate` are passed in, and if they are not passed in this constructor
// REFUSES to exist. That is the whole difference from the empty-history reader
// — the same two questions, asked of the engine instead of answered from a
// constant.
//
// It is NOT reachable on the accepted tree. `EXPOSED` is
// `['genSession','rirPlan']` (engine-runtime.cjs:11, mirrored at
// engine-runtime-host.cjs:45) and that list is pinned by
// native-carriers-witnesses.cjs:16, so no accepted host can hand these two in.
// Adding them is a re-seal of the accepted artifact — the PM's decision, not
// lane B's. Until that happens `createDayFactsReader` finds them absent and
// keeps the existing refusal, which is why this code changes nothing on the
// committed tree.
//
// ONE DELIBERATE DIFFERENCE FROM THE LEGACY BRANCH, stated because it is a
// difference: `progression.cjs:702,704` wraps each predicate in
// `catch (e) { hard = false; }` / `catch (e) { debt = false; }`. This reader
// does NOT. PERFORMED-ENGINE-v1.md:254 forbids "caught exceptions interpreted
// as false" on the native branch, so a predicate that throws here REFUSES by
// name. That is the stricter direction and it is the contract's own words.
function createEnginePredicateDayFacts({ state, engine } = {}) {
  if (!state || typeof state !== 'object' || Array.isArray(state))
    throw new TypeError('createEnginePredicateDayFacts requires the athlete engine state');
  if (!engine || ENGINE_DAY_PREDICATES.some(name => typeof engine[name] !== 'function'))
    throw new TypeError('createEnginePredicateDayFacts requires the engine\'s own '
      + ENGINE_DAY_PREDICATES.join(' and ') + ' readers; they are not on the pinned EXPOSED surface');
  return function dayFacts(iso) {
    if (typeof iso !== 'string' || !ISO.test(iso)) unqualified('day_key_invalid');
    let weather;
    try { weather = engine.dayWeather(state, iso); }
    catch (_) { unqualified('day_weather_unreadable', { day: iso }); }
    if (!weather || typeof weather !== 'object' || typeof weather.hardSession !== 'boolean')
      unqualified('day_weather_not_boolean', { day: iso });
    let clean;
    try { clean = engine.cleanAtDate(state, iso); }
    catch (_) { unqualified('clean_at_date_unreadable', { day: iso }); }
    if (typeof clean !== 'boolean') unqualified('clean_at_date_not_boolean', { day: iso });
    return { hard: weather.hardSession, debt: !clean };
  };
}

// THE ONE PLACE A HOST CHOOSES A DAY READER — and the option is OFF.
//
// `mapRecordedDaysWithEnginePredicates` is the S2 unblocking path, default
// FALSE. With it false, or with the engine's two predicates absent at runtime,
// the empty-history reader is returned and a day with a recorded night refuses
// `recorded_sleep_unmapped` exactly as it does today. With it true AND both
// predicates present, recorded nights and events are mapped through the
// ENGINE's own readers and a day with 28 recorded nights can be qualified.
//
// Both conditions are checked at composition time and reported by
// `enginePredicatesAvailable`, so a host can say which reader it got instead of
// guessing. Turning the option on when the predicates are absent is NOT an
// error and NOT a silent downgrade to something weaker: it lands on the same
// honest refusal the tree ships today.
function createDayFactsReader({ state, engine, mapRecordedDaysWithEnginePredicates = false } = {}) {
  if (typeof mapRecordedDaysWithEnginePredicates !== 'boolean')
    throw new TypeError('createDayFactsReader: mapRecordedDaysWithEnginePredicates must be a boolean');
  const available = enginePredicatesAvailable(engine);
  const enginePredicates = mapRecordedDaysWithEnginePredicates && available;
  const dayFacts = enginePredicates
    ? createEnginePredicateDayFacts({ state, engine })
    : createEmptyHistoryDayFacts({ state });
  return Object.freeze({ dayFacts, enginePredicates, enginePredicatesAvailable: available,
    optionRequested: mapRecordedDaysWithEnginePredicates });
}
function enginePredicatesAvailable(engine) {
  return !!engine && ENGINE_DAY_PREDICATES.every(name => typeof engine[name] === 'function');
}

// THE BINDING.
//
// `bind(workoutFacts)` is called with the very object a host is about to place
// on the engine state; `resolve` then answers only inside that window, only for
// the revision and Start the binding carries, and only while the digest taken
// at bind time still describes the object. `unbind()` closes the window.
//
// `withFacts(workoutFacts, run)` is the window a host should normally use
// (review r1, F3/C3): bind … finally RESTORE the previous binding. It is
// re-entrant, so a host may open a window per engine read — `genSession` inside
// the producer AND `genSession` again later for previous performance — without
// one closing the other. An absent `workoutFacts` opens an explicitly UNBOUND
// window rather than leaving the last one standing.
function createNativeTrendContextBinding({ dayFacts } = {}) {
  if (typeof dayFacts !== 'function')
    throw new TypeError('createNativeTrendContextBinding requires an injected dayFacts(iso) reader');
  let bound = null;
  let digest = null;

  function bind(workoutFacts) {
    // review r1, F7/C7: bind REFUSES rather than silently unbinding. Clearing a
    // binding is `unbind()` — one name, one meaning — so a caller that passes
    // an absent facts object by accident cannot quietly disarm the resolver.
    if (workoutFacts === undefined || workoutFacts === null)
      throw new TypeError('createNativeTrendContextBinding.bind requires a facts object; use unbind() to clear');
    if (typeof workoutFacts !== 'object' || Array.isArray(workoutFacts) ||
        workoutFacts.profile !== 'earned/workout-facts/v1' ||
        !Number.isSafeInteger(workoutFacts.source_revision) || workoutFacts.source_revision < 1 ||
        !Array.isArray(workoutFacts.sessions))
      throw new TypeError('createNativeTrendContextBinding.bind requires earned/workout-facts/v1 read at a revision');
    bound = workoutFacts;
    digest = bindingDigest(workoutFacts);
    return workoutFacts;
  }
  function unbind() { bound = null; digest = null; }

  function withFacts(workoutFacts, run) {
    if (typeof run !== 'function')
      throw new TypeError('createNativeTrendContextBinding.withFacts requires the read to run');
    const previousBound = bound, previousDigest = digest;
    try {
      if (workoutFacts === undefined || workoutFacts === null) unbind();
      else bind(workoutFacts);
      return run();
    } finally { bound = previousBound; digest = previousDigest; }
  }

  // The resolver handed to createEngineRuntime({nativeTrendContext}). Every
  // path out of it is either an echoed binding with three proven booleans, or a
  // throw. There is no third outcome.
  function resolve(request) {
    if (!bound) unqualified('no_bound_source_facts');
    // The binding is a live reference, so the object may have moved since it was
    // bound. Check that FIRST: nothing below should be read out of a facts
    // object that is no longer the one this window was opened over.
    if (bindingDigest(bound) !== digest) unqualified('bound_facts_digest_mismatch', { digest });
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
    // Echo the binding the engine asked with, plus the three proven flags. The
    // digest is deliberately NOT echoed: performed.cjs:200-204 compares the
    // answer against the request it built, and this module emits no key the
    // engine did not ask for.
    return { start_op_id: start, source_revision: revision, effective: { ...effective },
      hard: facts.hard, rushed, debt: facts.debt };
  }

  return Object.freeze({ resolve, bind, unbind, withFacts,
    // The LIVE bound object, not a copy — see the header note.
    bound: () => bound,
    // The digest taken when this window was opened, or null outside one.
    digest: () => digest, REFUSAL });
}

module.exports = { createNativeTrendContextBinding, createEmptyHistoryDayFacts,
  createEnginePredicateDayFacts, createDayFactsReader, enginePredicatesAvailable,
  bindingDigest, ENGINE_DAY_PREDICATES, REFUSAL };
