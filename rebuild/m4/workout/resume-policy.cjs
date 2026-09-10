'use strict';
// workoutResumePolicy provider (rebuild/m3/w6/public-client.mjs
// prepareWorkoutContinuation). The client calls
//   workoutResumePolicy(generation, {...resumed, ...expected, ...facts})
// and requires a closed record {allowed_actions, reason, current_capture}:
//   * allowed_actions — a duplicate-free subset of ['set','skip','close'];
//   * reason          — a non-empty string shown beside the current guidance;
//   * current_capture — a capture the client re-validates with the SAME
//     prescriptionCapture and expected context as a fresh preparation, and
//     whose slots must map one-for-one, in order, onto the resumed session's
//     slots by logical_set_slot and lift_lineage_id.
// Nothing beyond that is invented here.
//
// The policy re-runs the SAME producer over today's registered projection. It
// therefore states today's assessment for a session recorded earlier; the
// stored original capture is untouched and the client keeps the two apart.
const ACTIONS = Object.freeze(['set', 'skip', 'close']);
const fail = code => { const e = new Error(code); e.code = code; throw e; };

// produceCapture(generation, context) is the host's workoutProducer — the same
// function, not a copy of its behaviour, so a resumed screen can never be
// assessed by a different rule than a fresh one.
function createWorkoutResumePolicy({ produceCapture, reason } = {}) {
  if (typeof produceCapture !== 'function') throw new TypeError('Explicit capture producer required');
  if (typeof reason !== 'string' || !reason.trim()) throw new TypeError('Explicit labelled resume reason required');
  return function workoutResumePolicy(generation, context) {
    if (!context || typeof context !== 'object') fail('WORKOUT_RESUME_CONTEXT_REQUIRED');
    if (typeof context.planned_split_slot_id !== 'string' || !context.planned_split_slot_id.trim())
      fail('WORKOUT_RESUME_CONTEXT_REQUIRED');
    // The producer's own contract: the planned slot plus the client's expected
    // producer/basis/source_basis and the authenticated workout facts.
    const current_capture = produceCapture(generation, {
      planned_split_slot_id: context.planned_split_slot_id,
      producer: context.producer, basis: context.basis,
      ...(Object.hasOwn(context, 'source_basis') ? { source_basis: context.source_basis } : {}),
      ...(Object.hasOwn(context, 'workoutFacts') ? { workoutFacts: context.workoutFacts } : {}),
    });
    return { allowed_actions: ACTIONS.slice(), reason, current_capture };
  };
}

module.exports = { createWorkoutResumePolicy, ACTIONS };
