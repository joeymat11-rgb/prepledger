'use strict';
// Reconstruct a factual native starting load. This is not a programme writer:
// original setup and performed records remain immutable and no legacy record,
// recommendation, unobserved equipment rung, timestamp or earned-load receipt is created.
const performed = require('../../engine/performed.cjs')({});
const {loadRungs} = require('../../engine/progression.cjs')({}, {});
const plan = require('../../engine/plan.cjs')({}, {});
const PROFILE = 'earned/native-baseline/v1';
function required(code, reason, detail = {}) {
  const error = new Error(code);
  Object.assign(error, {code, reason}, structuredClone(detail));
  throw error;
}
function projectNativeBaseline({state, workoutFacts, day} = {}) {
  const result = {state: structuredClone(state), baseline: {profile: PROFILE, decisions: [], future_start_ids: []}};
  const fresh = result.state.exercises.filter(ex => ex.w == null);
  if (!fresh.length || !workoutFacts?.sessions?.length) return result;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
      !Number.isFinite(Date.parse(day + 'T00:00:00Z')) ||
      new Date(day + 'T00:00:00Z').toISOString().slice(0, 10) !== day)
    required('NATIVE_BASELINE_DAY_REQUIRED', 'explicit_valid_host_day');
  // Validation and chronology are the installed engine's own contract. The
  // authenticated history projector upstream establishes the order, not dates.
  const rows = performed.performedHistoryRows({...state, workoutFacts});
  for (const ex of fresh) {
    const candidates = rows.filter(row => row.source === 'performed').flatMap(row => {
      const entry = row.rec.entries.find(value => value.lift_lineage_id === ex.id);
      return entry ? [{row, entry}] : [];
    });
    const future = candidates.filter(({row}) => row.d > day);
    result.baseline.future_start_ids.push(...future.map(({row}) => row.start_op_id));
    for (const {row, entry} of candidates) {
      if (row.d > day) continue;
      if (!plan.sameEra(plan.forksOf(state, ex.id), row.d, day)) continue;
      const line = performed.performedLine(entry);
      const originals = entry.slots.filter(slot => slot.origin !== 'added');
      const detail = {lift_lineage_id: ex.id, start_op_id: row.start_op_id,
        close_op_id: entry.completion.op_id,
        original_slots: originals.map(slot => ({position: slot.position,
          logical_set_slot: slot.logical_set_slot, state: slot.state,
          ...(slot.fact ? {source_op_id: slot.fact.source_op_id, edit_op_ids: slot.fact.edit_op_ids.slice(),
            ...(slot.state === 'performed' ? {load: structuredClone(slot.fact.current.load)} : {})} : {})}))};
      if (originals.some(slot => slot.state === 'unresolved'))
        required('NATIVE_BASELINE_MAPPING_REQUIRED', 'original_slot_unresolved', {...detail,
          required_confirmation: 'Resolve the conflicting original-slot facts through the existing correction path.'});
      if (!line.positions) {
        result.baseline.decisions.push({...detail, state: 'no_original_prefix'});
        continue;
      }
      const loads = originals.filter(slot => slot.state === 'performed').map(slot => slot.fact.current.load);
      if (loads.some(load => load.kind === 'configuration'))
        required('NATIVE_BASELINE_MAPPING_REQUIRED', 'configuration_prescription_mapping', {...detail,
          required_confirmation: 'An accepted configuration-domain prescription mapping is required; the recorded key supplies no pounds.'});
      const value = loads[0].value;
      if (loads.some(load => load.unit !== 'lb' || load.value !== value) || Array.isArray(ex.wSets))
        required('NATIVE_BASELINE_MAPPING_REQUIRED', 'scalar_and_slot_working_load_mapping', {...detail,
          required_confirmation: 'Confirm an accepted working scalar and original-slot load vector mapping; unequal observations do not select a scalar.'});
      if (typeof ex.w === 'number' && ex.w !== value) {
        const rungs = loadRungs(ex);
        if (rungs && !rungs.includes(value)) ex.steps = [...new Set([...rungs, value])].sort((a, b) => a - b);
        ex.topAt = null; ex.topRun = 0;
      }
      ex.w = value;
      result.baseline.decisions.push({...detail, state: 'adopted', load: {value, unit: 'lb'}});
      // Later actual uniform loads carry the current factual basis forward.
    }
  }
  return result;
}
module.exports = {projectNativeBaseline, PROFILE};
