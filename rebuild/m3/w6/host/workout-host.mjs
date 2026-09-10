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
  // The producer never hands the adapter a state of its own: it registers the
  // supplied state through the null registrar and lets the adapter consume ONLY
  // the registered projection.
  function workoutProducer(generation, context) {
    lastProjection = registrar.register({ generation, state: engineState, workoutFacts: context.workoutFacts });
    return adapter.prepare({ day: clock.today(), basis: context.basis,
      sourceProjection: lastProjection, source_basis: context.source_basis }).capture;
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
    lastProjection: () => lastProjection, mount });
}
