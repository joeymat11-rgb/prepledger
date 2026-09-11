'use strict';
// resolveWorkoutBasis providers for the source-aware (v2) capture profile.
//
// The public client calls resolveWorkoutBasis(generation, input, facts) and
// requires a closed record {plan_basis, input_basis, causal_parents} plus,
// under the v2 profile, {source_basis} closed to exactly W / log_digest /
// selection_id (rebuild/m3/w6/public-client.mjs). The client stores whatever
// this resolver claims, so a resolver that cannot prove its claim must refuse
// rather than guess: the client itself does not verify the frontier.
//
// NULL LANE (a zero-import athlete). The claim is fully determined and is not
// a guess: the only frontier such a generation has is the source codec's own
// empty accepted prefix, W 0 / the prefix hasher's digest of zero rows /
// selection null. This resolver computes it through the codec, exactly as
// rebuild/m4/workout/source-projection.cjs computes it internally, and refuses
// before the registrar would whenever the generation is not zero-import.
//
// STRING LANE (an activated imported source). NOT IMPLEMENTED here. The real
// frontier comes from an assembled local-recovery handle
// (rebuild/m3/w6/recovery-local.mjs inspect*) over the R1 runtime; nothing in
// this branch can produce or check it. `createUnavailableStringLaneResolver`
// returns an explicit refusal so a host that reaches the string lane fails
// loudly instead of storing an invented source_basis.
const fail = code => { const e = new Error(code); e.code = code; throw e; };
const copy = structuredClone;

function checkCodec(sourceCodec) {
  if (sourceCodec?.PROFILE !== 'earned/source-import/v1' || typeof sourceCodec.basis !== 'function' ||
      typeof sourceCodec.createPrefixHasher !== 'function' || typeof sourceCodec.COLLECTION !== 'string')
    throw new TypeError('Existing source frontier codec required');
  return sourceCodec;
}

// Mirrors source-projection.cjs's own domain check so the client refuses a
// generation the registrar would refuse, at the earlier seam.
function requireZeroImport(generation, sourceCodec) {
  const collections = generation?.collections;
  if (!collections || typeof collections !== 'object' || Array.isArray(collections)) fail('WORKOUT_BASIS_GENERATION_REQUIRED');
  const rows = collections[sourceCodec.COLLECTION];
  if (rows && typeof rows === 'object' && Object.keys(rows).length) fail('WORKOUT_BASIS_IMPORT_PRESENT');
  const W = collections.sync?.frontier?.W;
  if (!(W === undefined || W === 0)) fail('WORKOUT_BASIS_FRONTIER_UNPROVEN');
}

// plan_basis / input_basis are labels the client records verbatim. No product
// vocabulary for them exists in this branch (searched: rebuild/m4/spec/
// WORKOUT-SCHEMA-V2.md), so the host must supply explicit labels and they are
// carried, never derived. Refusing an absent label keeps an unlabelled Start
// off disk.
function createNullLaneWorkoutBasis({ sourceCodec, planBasis, inputBasis, causalParents } = {}) {
  checkCodec(sourceCodec);
  for (const [name, value] of [['planBasis', planBasis], ['inputBasis', inputBasis]])
    if (typeof value !== 'string' || !value.trim()) throw new TypeError('Explicit ' + name + ' label required');
  if (typeof causalParents !== 'function') throw new TypeError('Explicit causalParents() reader required');
  const emptyAcceptedPrefix = () =>
    sourceCodec.basis({ W: 0, log_digest: sourceCodec.createPrefixHasher().digest(), selection_id: null });
  return function resolveWorkoutBasis(generation) {
    requireZeroImport(generation, sourceCodec);
    const parents = causalParents();
    if (!Array.isArray(parents) || !parents.every(x => typeof x === 'string' && x.trim()) ||
        new Set(parents).size !== parents.length) fail('WORKOUT_BASIS_PARENTS_INVALID');
    return { plan_basis: planBasis, input_basis: inputBasis, causal_parents: parents.slice(),
      source_basis: copy(emptyAcceptedPrefix()) };
  };
}

// Honest refusal, never a guess. Throwing here is contained by the client's
// prepareWorkout/prepareWorkoutContinuation try/catch and surfaces as a
// refusal; nothing is written.
function createUnavailableStringLaneResolver({ reason = 'no assembled source-recovery handle is composed in this host' } = {}) {
  return function resolveWorkoutBasis() {
    const e = new Error('SOURCE_WORKOUT_BASIS_UNAVAILABLE');
    e.code = 'SOURCE_WORKOUT_BASIS_UNAVAILABLE';
    e.reason = reason;
    throw e;
  };
}

module.exports = { createNullLaneWorkoutBasis, createUnavailableStringLaneResolver };
