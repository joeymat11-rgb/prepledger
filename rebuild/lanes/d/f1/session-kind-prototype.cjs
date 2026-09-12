'use strict';

// Speculative, isolated F1 arithmetic. Not imported by product code.
// BRIEF-F1-FULL-BODY v0.1 section 3: the caller supplies the engine's active,
// ordered U/L pools and its already-resolved query week. No calendar, clock,
// seed, athlete store or alternative progression engine lives here.
const fail = code => { const error = new TypeError(code); error.code = code; throw error; };
const positive = value => Number.isSafeInteger(value) && value > 0;
const checkedSum = values => {
  const result = values.reduce((a, b) => a + b, 0);
  if (!Number.isSafeInteger(result)) fail('F1_SET_COUNT_OVERFLOW');
  return result;
};

function composeFullBody(upper, lower) {
  if (!Array.isArray(upper) || !Array.isArray(lower)) fail('F1_ORDERED_POOLS_REQUIRED');
  if (!upper.length || !lower.length) fail('F1_BOTH_FAMILIES_REQUIRED');
  const seen = new Set();
  for (const [family, pool] of [['U', upper], ['L', lower]]) {
    for (const exercise of pool) {
      if (!exercise || exercise.day !== family || typeof exercise.id !== 'string' || !exercise.id.trim())
        fail('F1_EXERCISE_IDENTITY_REQUIRED');
      if (seen.has(exercise.id)) fail('F1_DUPLICATE_EXERCISE');
      if (!positive(exercise.sets)) fail('F1_CONFIGURED_SETS_REQUIRED');
      seen.add(exercise.id);
    }
  }
  const ordered = [];
  for (let i = 0; i < Math.max(upper.length, lower.length); i++) {
    if (i < upper.length) ordered.push(upper[i]);
    if (i < lower.length) ordered.push(lower[i]);
  }
  return ordered;
}

function weeklyExposure(resolvedKinds) {
  if (!Array.isArray(resolvedKinds) || resolvedKinds.length !== 7)
    fail('F1_RESOLVED_QUERY_WEEK_REQUIRED');
  const count = { U: 0, L: 0, F: 0, sessions: 0 };
  for (const kind of resolvedKinds) {
    if (!['U', 'L', 'F', 'REST', 'REFEED'].includes(kind)) fail('F1_SESSION_KIND_INVALID');
    if (kind === 'REST' || kind === 'REFEED') continue;
    count.sessions++;
    if (kind === 'F') { count.F++; count.U++; count.L++; }
    else count[kind]++;
  }
  return count;
}

function fullBodyTotals(upper, lower, resolvedKinds) {
  const ordered = composeFullBody(upper, lower);
  const exposures = weeklyExposure(resolvedKinds);
  const byExercise = ordered.map(exercise => ({
    id: exercise.id,
    perAppearance: exercise.sets,
    weekly: checkedSum(Array(exposures[exercise.day]).fill(exercise.sets)),
  }));
  return {
    ids: ordered.map(exercise => exercise.id),
    perFullBodySession: checkedSum(ordered.map(exercise => exercise.sets)),
    weeklyTotal: checkedSum(byExercise.map(row => row.weekly)),
    exposures,
    byExercise,
  };
}

// This describes a potential proposal. It never mutates a plan or records a set.
// The cap is supplied from the accepted engine, not invented in this module.
function fullBodyAddition(upper, lower, resolvedKinds, { exerciseId, delta, directSessionCap } = {}) {
  if (!positive(delta) || !positive(directSessionCap)) fail('F1_ADDITION_ARGUMENTS_REQUIRED');
  const ordered = composeFullBody(upper, lower);
  const exposures = weeklyExposure(resolvedKinds);
  if (!exposures.F) fail('F1_FULL_BODY_CONTEXT_REQUIRED');
  const exercise = ordered.find(row => row.id === exerciseId);
  if (!exercise) fail('F1_EXERCISE_NOT_IN_SESSION');
  const bucket = row => row.head || row.mg;
  if (ordered.some(row => typeof bucket(row) !== 'string' || !bucket(row).trim()))
    fail('F1_ENGINE_BUCKET_REQUIRED');
  const before = checkedSum(ordered.filter(row => bucket(row) === bucket(exercise)).map(row => row.sets));
  const after = checkedSum([before, delta]);
  return {
    allowed: after <= directSessionCap,
    directBucketBefore: before,
    directBucketAfter: after,
    addedPerAppearance: delta,
    addedWeekly: checkedSum(Array(exposures[exercise.day]).fill(delta)),
    exposure: exposures[exercise.day],
  };
}

// A proposed setup standard, not a physiological threshold. The caller supplies
// the parent's band.lo; the PM has not yet accepted choosing that edge.
function proposedStarterSets(resolvedKinds, bandLow) {
  const count = weeklyExposure(resolvedKinds);
  if (!positive(bandLow)) fail('F1_BAND_LOW_REQUIRED');
  if (![2, 3].includes(count.F) || count.sessions !== count.F) fail('F1_ALL_FULL_BODY_STARTER_REQUIRED');
  return Math.ceil(bandLow / count.F);
}

module.exports = { composeFullBody, weeklyExposure, fullBodyTotals, fullBodyAddition, proposedStarterSets };
