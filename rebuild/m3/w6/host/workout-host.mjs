// Real host composition for workout capture. BINDING ONLY.
//
// This module constructs nothing of its own: every collaborator is injected,
// and a missing one is a specific TypeError naming it, never a substitute.
// It contains no engine rule, no capture format, no athlete data, no default
// identity, no default state and no fallback provider. Its whole job is to
// wire the pieces the way the accepted fixture wires them
// (rebuild/m4/spec/native-next-target-candidate/fixture.cjs durable()), so
// that a host page and a host test compose the SAME product graph.
//
// What it wires:
//   supplied engine state (clean-init for a new athlete)
//        -> null-lane registrar (rebuild/m4/workout/source-projection.cjs)
//        -> composite source-projection reader (null + optional string lane)
//        -> engine workout capture adapter (rebuild/m4/workout/engine-capture.cjs)
//        -> workoutProducer + workoutResumePolicy
//        -> createDurablePublicClient (schemaVersion 2, v2 capture profile)
//   engine history projector -> projectWorkoutHistory
//
// What it deliberately does NOT do: verify a source frontier, mint an
// identity, decide currentness, issue or admit anything, or fabricate a
// nativeTrendContext. Those are the caller's providers.

const V2_CAPTURE_PROFILE = 'earned/workout-prescription/v2';
const need = name => { throw new TypeError('composeWorkoutHost requires an injected ' + name); };

// A0 review R1. rebuild/engine/plan.cjs dayType(iso, s) picks the LAST split
// entry whose `from <= iso`; when it finds none it falls back to a fixed
// Mon/Thu = U, Tue/Fri = L, Wed = REFEED week. That fallback is one athlete's
// week. A state can carry a perfectly valid split whose `from` is still in the
// future — a plan that starts next Monday — and on today's date the engine
// would silently serve the fallback instead.
//
// Only this seam holds BOTH the state and the day, so the guard lives here and
// runs on every preparation rather than once at construction: as the clock
// moves, a split that was not yet in force becomes in force, and nothing else
// re-checks. A state whose split is not yet in force is refused; the host
// never serves a day the athlete's own split did not name.
function splitInForceOn(state, day) {
  const entries = Array.isArray(state?.split) ? state.split : [];
  return entries.some(entry => entry && typeof entry.from === 'string' && entry.from <= day);
}
function refuseSplitNotInForce(day) {
  const error = new Error('WORKOUT_SPLIT_NOT_IN_FORCE');
  error.code = 'WORKOUT_SPLIT_NOT_IN_FORCE';
  error.reason = 'no split entry has from <= ' + day + ', so the engine would fall back to a week this athlete never chose';
  throw error;
}

// The honest refusal for a provider this branch cannot qualify. Handing this
// to createEngineRuntime is not a stub that answers: every call throws, and
// rebuild/engine/performed.cjs contains the throw as
// PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED / reason "resolver_failed", which
// makes the numeric trend explicitly unavailable without dropping any
// factual logging. It never returns a guessed hard/rushed/debt.
export function createUnavailableNativeTrendContext({ reason = 'no qualified native trend snapshot is composed in this host' } = {}) {
  return function nativeTrendContext() {
    const error = new Error('NATIVE_TREND_CONTEXT_UNAVAILABLE');
    error.code = 'NATIVE_TREND_CONTEXT_UNAVAILABLE';
    error.reason = reason;
    throw error;
  };
}

export function composeWorkoutHost({
  // --- durable client scope (all synthetic labels are the caller's) ---
  repository, stage, namespace, athleteId, deviceId, sessionEpoch,
  isCurrentSession, observationEpoch, observationGuard, validateCommit,
  keys, crypto,
  // --- constructors, injected so this module imports no product graph ---
  createDurablePublicClient,
  createNullSelectionRegistrar, createSourceProjectionReader,
  createEngineWorkoutCapture, createEngineHistoryProjector,
  createWorkoutResumePolicy, parseStrictJson, projectWorkoutRecords,
  // --- providers ---
  prescriptionCapture,          // v2, built over the real source codec
  sourceCodec,                  // rebuild/m3/w5/source/codec.cjs
  engine,                       // {genSession, rirPlan} from createEngineRuntime
  engineState,                  // the athlete's engine state
  clock,                        // {today()} — the host's day, never derived here
  workoutProducerIdentity,
  resolveWorkoutBasis,
  resumeReason,
  // B-NTC, optional. The qualified nativeTrendContext binding
  // (rebuild/m4/workout/native-trend-context.cjs). Its `resolve` is what the
  // caller handed createEngineRuntime; this host's only job is to tell it
  // WHICH facts object the engine is about to read, for exactly as long as it
  // is reading them, and to restore the previous window when the read returns.
  // Absent, nothing changes: the host keeps whatever resolver the caller
  // composed, including A0's honest refusal createUnavailableNativeTrendContext.
  //
  // NOTE FOR ANY OTHER CALLER OF THE SAME ENGINE (review r1, F3). This host
  // opens the window around its OWN engine read — adapter.prepare. A caller
  // that re-runs the same accepted reader later over the same facts (the gym
  // card's previous-performance read is exactly that) must open its own window
  // with `nativeTrendBinding.withFacts(facts, run)`; otherwise the resolver has
  // nothing bound and the engine refuses, silently, wherever that refusal is
  // swallowed. `withFacts` is re-entrant for precisely this reason.
  nativeTrendBinding,
  stringSelectionRegistrar,     // optional: reading-replay's own projectLineage registrar
  mountPreparedWorkoutPanel,    // optional: only needed by a page host
  plannedSplitSlotId,
} = {}) {
  // Every required provider, named individually so a refusal says which.
  if (!repository) need('repository');
  if (typeof stage !== 'function') need('stage');
  if (typeof namespace !== 'string' || !namespace.trim()) need('namespace');
  if (typeof athleteId !== 'string' || !athleteId.trim()) need('athleteId');
  if (typeof deviceId !== 'string' || !deviceId.trim()) need('deviceId');
  if (sessionEpoch === undefined) need('sessionEpoch');
  if (typeof isCurrentSession !== 'function') need('isCurrentSession');
  if (typeof observationEpoch !== 'function') need('observationEpoch');
  if (typeof observationGuard?.run !== 'function') need('observationGuard.run');
  if (typeof validateCommit !== 'function') need('validateCommit');
  if (!Array.isArray(keys) || !keys.length) need('keys');
  if (!crypto || typeof crypto.getRandomValues !== 'function') need('crypto');
  if (typeof createDurablePublicClient !== 'function') need('createDurablePublicClient');
  if (typeof createNullSelectionRegistrar !== 'function') need('createNullSelectionRegistrar');
  if (typeof createSourceProjectionReader !== 'function') need('createSourceProjectionReader');
  if (typeof createEngineWorkoutCapture !== 'function') need('createEngineWorkoutCapture');
  if (typeof createEngineHistoryProjector !== 'function') need('createEngineHistoryProjector');
  if (typeof createWorkoutResumePolicy !== 'function') need('createWorkoutResumePolicy');
  if (typeof parseStrictJson !== 'function') need('parseStrictJson');
  if (typeof projectWorkoutRecords !== 'function') need('projectWorkoutRecords');
  if (typeof prescriptionCapture?.prepare !== 'function') need('prescriptionCapture');
  if (prescriptionCapture.profile !== V2_CAPTURE_PROFILE)
    throw new TypeError('composeWorkoutHost requires the source-aware capture profile ' + V2_CAPTURE_PROFILE);
  if (sourceCodec?.PROFILE !== 'earned/source-import/v1') need('sourceCodec (earned/source-import/v1)');
  if (typeof engine?.genSession !== 'function' || typeof engine?.rirPlan !== 'function') need('engine {genSession, rirPlan}');
  if (!engineState || typeof engineState !== 'object' || !Array.isArray(engineState.exercises)) need('engineState');
  if (typeof clock?.today !== 'function') need('clock.today()');
  if (!workoutProducerIdentity) need('workoutProducerIdentity');
  if (typeof resolveWorkoutBasis !== 'function') need('resolveWorkoutBasis');
  if (typeof resumeReason !== 'string' || !resumeReason.trim()) need('resumeReason');
  if (typeof plannedSplitSlotId !== 'string' || !plannedSplitSlotId.trim()) need('plannedSplitSlotId');
  if (nativeTrendBinding !== undefined &&
      (typeof nativeTrendBinding?.bind !== 'function' || typeof nativeTrendBinding?.unbind !== 'function' ||
       typeof nativeTrendBinding?.withFacts !== 'function'))
    throw new TypeError('composeWorkoutHost requires a {bind, unbind, withFacts} native trend binding when one is supplied');
  if (stringSelectionRegistrar !== undefined && typeof stringSelectionRegistrar?.workoutInput !== 'function')
    throw new TypeError('composeWorkoutHost requires a registered string-lane registrar when one is supplied');

  // Null lane: the product registrar. It is the only thing that decides the
  // zero-import frontier, and it refuses any generation that is not zero-import.
  const registrar = createNullSelectionRegistrar({ sourceCodec });
  // Composite reader. The string lane is reading-replay's own registrar when a
  // caller composes it; nothing here duplicates or substitutes for it. When it
  // is absent, a string claim is refused (SOURCE_PROJECTION_LANE_UNAVAILABLE).
  const reader = createSourceProjectionReader({ nullSelection: registrar,
    ...(stringSelectionRegistrar === undefined ? {} : { stringSelection: stringSelectionRegistrar }) });
  const adapter = createEngineWorkoutCapture({ engine, prescriptionCapture,
    producerIdentity: workoutProducerIdentity, sourceProjectionReader: reader });
  const historyProjector = createEngineHistoryProjector({ athleteId, deviceId, parseStrictJson,
    projectWorkoutRecords, prescriptionCapture,
    resolveCapturedLayout: ({ start }) => adapter.readLayout(start.prescription_capture) });

  let lastProjection = null;
  // A2. The durable client CONTAINS whatever the producer throws and answers the
  // caller with its own generic WORKOUT_PREPARATION_INVALID (public-client.mjs
  // prepareWorkout's catch: only a StorageFailure keeps its code). That is correct
  // for the client — a producer refusal is not a storage state — but it means the
  // specific refusal the athlete needs to read (WORKOUT_SPLIT_NOT_IN_FORCE, or an
  // engine refusal such as PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED) is lost at the
  // seam. A screen cannot recover it from the client, and public-client.mjs is
  // accepted and unchanged, so the smallest honest place to keep it is here, where
  // the throw happens. This RECORDS; it never substitutes, softens or invents a
  // refusal, and the throw still propagates unchanged.
  let lastRefusal = null;
  // The producer never hands the adapter a state of its own: it registers the
  // supplied state through the null registrar and lets the adapter consume ONLY
  // the registered projection.
  function workoutProducer(generation, context) {
    const day = clock.today();
    lastRefusal = null;
    try {
      // R1: refuse before anything is registered or prepared, so the engine's
      // fallback week is unreachable from this host on a day the athlete's own
      // split does not cover. The throw is contained by the client's
      // prepareWorkout / prepareWorkoutContinuation and stores nothing.
      if (!splitInForceOn(engineState, day)) refuseSplitNotInForce(day);
      lastProjection = registrar.register({ generation, state: engineState, workoutFacts: context.workoutFacts });
      // B-NTC. Open the trend-context window over the VERY facts object this
      // preparation is about to give the engine, for exactly the engine read it
      // wraps, and restore the previous window when that read returns.
      //
      // The window does NOT claim object identity across the engine seam: the
      // accepted adapter hands genSession a structuredClone
      // (rebuild/m4/workout/engine-capture.cjs:52), so the engine never holds
      // the object bound here. What the window buys is SCOPE (outside it every
      // request refuses), a content digest that catches a facts object moving
      // under the binding, and the value correspondence performed.cjs itself
      // checks — revision, unique Start, whole effective tuple.
      const prepare = () => adapter.prepare({ day, basis: context.basis,
        sourceProjection: lastProjection, source_basis: context.source_basis }).capture;
      // withFacts restores rather than clears, so a caller that has already
      // opened a window over the same facts (the gym card's previous-performance
      // read) is not disarmed by this one returning.
      return nativeTrendBinding ? nativeTrendBinding.withFacts(context.workoutFacts, prepare) : prepare();
    } catch (error) {
      lastRefusal = Object.freeze({ code: error?.code || null, reason: error?.reason || null,
        message: typeof error?.message === 'string' ? error.message : null });
      throw error;
    }
  }
  const workoutResumePolicy = createWorkoutResumePolicy({ produceCapture: workoutProducer, reason: resumeReason });

  const client = createDurablePublicClient({
    repository, stage, namespace, athleteId, deviceId, sessionEpoch,
    isCurrentSession, observationEpoch, observationGuard, validateCommit,
    keys, crypto, schemaVersion: 2,
    prescriptionCapture, workoutProducerIdentity, resolveWorkoutBasis,
    workoutProducer, workoutResumePolicy,
    projectWorkoutHistory: ({ history, generation, source_revision }) =>
      historyProjector.project(history, generation, { sourceRevision: source_revision }),
  });

  function mount(root) {
    if (typeof mountPreparedWorkoutPanel !== 'function') need('mountPreparedWorkoutPanel (to mount a screen)');
    if (!root) throw new TypeError('composeWorkoutHost mount(root) requires a root element');
    return mountPreparedWorkoutPanel(root, { client, plannedSplitSlotId, enableContinuation: true });
  }

  return Object.freeze({ client, adapter, registrar, reader, historyProjector,
    workoutProducer, workoutResumePolicy, plannedSplitSlotId,
    lastProjection: () => lastProjection,
    // The last refusal this host's own producer threw, or null when the last
    // producer run did not refuse. Read-only, and never a substitute for the
    // client's own answer: a caller reports BOTH.
    lastProducerRefusal: () => lastRefusal, mount });
}
