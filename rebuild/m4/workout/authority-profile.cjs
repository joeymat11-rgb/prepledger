'use strict';

// Intended static dependency for the real authority. No issuance, activation,
// registry authentication, correction fold or client permission is supplied here.
function createWorkoutProfile(validateWorkoutShape) {
  if (typeof validateWorkoutShape !== 'function') throw new TypeError('Shared shape validator required');
  return Object.freeze({
    validateShape: op => validateWorkoutShape(op).valid,
    references: op => validateWorkoutShape(op).references,
    validateRelations(op, readOperation) {
      if (op.kind === 'session-start') return true;
      const isEdit = op.kind === 'correction' || op.kind === 'tombstone';
      const target = readOperation(isEdit ? op.target_op_id : op.session_start_op_id);
      if (!target || target.athlete_id !== op.athlete_id || target.class !== 'session') return false;
      return isEdit ? target.kind === 'session-set' && target.lift_lineage_id === op.lift_lineage_id
        : target.kind === 'session-start';
    },
  });
}

module.exports = {createWorkoutProfile};
