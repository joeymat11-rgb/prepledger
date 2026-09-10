'use strict';
const V=require('./edit-values.cjs');

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
      if(!isEdit)return target.kind === 'session-start';
      try {
        const root=V.rootOf(op,readOperation),lift=root.kind==='session-set'||root.kind==='session-skip';
        if(lift ? !V.text(root.lift_lineage_id)||op.lift_lineage_id!==root.lift_lineage_id : V.own(op,'lift_lineage_id'))return false;
        if(op.kind==='correction')V.assertPatch(op.payload.replacement_fields,target,readOperation);
        return true;
      } catch { return false; }
    },
  });
}

module.exports = {createWorkoutProfile};
