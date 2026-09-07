'use strict';
// REVIEW MODEL ONLY. Identifiers/commitments/receipts are model-only placeholders.
// Inputs explicitly ASSUME an authenticated, accepted, complete synthetic graph.
// This module does not verify signatures, admit operations, allocate a schema,
// run a training engine, persist data, or implement concurrent correction policy.
const ASSUMPTION = 'ASSUMED_AUTHENTICATED_ACCEPTED_COMPLETE_SYNTHETIC_GRAPH';
class Refusal extends Error {
  constructor(code) { super(code); this.name = 'ProjectionRefusal'; this.code = code; }
}
const need = (ok, code) => { if (!ok) throw new Refusal(code); };
const map = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && x.trim().length > 0;
function shape(x, required, optional = []) {
  return map(x) && required.every(k => Object.hasOwn(x, k)) &&
    Object.keys(x).every(k => required.includes(k) || optional.includes(k));
}
function parse(raw) {
  need(text(raw), 'MALFORMED');
  try { return JSON.parse(raw); } catch { throw new Refusal('MALFORMED'); }
}
const clone = x => JSON.parse(JSON.stringify(x));
const quantity = (q, unit) => shape(q, ['value', 'unit']) && Number.isFinite(q.value) && q.unit === unit;
const COMMON = ['op_id', 'canonical_content_commitment', 'athlete_id', 'device_id', 'device_seq',
  'device_predecessor_op_id', 'causal_parents', 'class', 'kind', 'effective', 'schema_version', 'lease_id', 'payload'];
const EXTRA = {
  'session-start': ['planned_split_slot_id', 'plan_basis'],
  'session-set': ['session_start_op_id', 'logical_set_slot', 'lift_lineage_id'],
  correction: ['target_op_id', 'lift_lineage_id'], tombstone: ['target_op_id', 'lift_lineage_id']
};
function project(input) {
  need(shape(input, ['assumption', 'athlete_id', 'watermark', 'planBytes', 'records']), 'MALFORMED');
  need(input.assumption === ASSUMPTION, 'ASSUMPTION_REQUIRED');
  need(text(input.athlete_id) && text(input.planBytes) && Number.isSafeInteger(input.watermark) &&
    input.watermark > 0 && Array.isArray(input.records), 'MALFORMED');
  const identities = new Map(), positions = new Map();
  for (const record of input.records) {
    need(shape(record, ['operationBytes', 'receiptBytes']), 'MALFORMED');
    const op = parse(record.operationBytes), receipt = parse(record.receiptBytes);
    need(map(op) && op.athlete_id === input.athlete_id, 'FOREIGN');
    need(Object.hasOwn(EXTRA, op.kind), 'UNSUPPORTED_KIND');
    need(shape(op, [...COMMON, ...EXTRA[op.kind]]), 'UNSUPPORTED_FIELDS');
    need(['op_id', 'canonical_content_commitment', 'device_id', 'lease_id'].every(k => text(op[k])) &&
      Number.isSafeInteger(op.device_seq) && op.device_seq > 0 &&
      (op.device_predecessor_op_id === null || text(op.device_predecessor_op_id)) &&
      Number.isSafeInteger(op.schema_version) && op.schema_version > 0 && op.class === 'session' &&
      shape(op.effective, ['local_date', 'local_time', 'utc_offset']) && Object.values(op.effective).every(text) &&
      Array.isArray(op.causal_parents) && op.causal_parents.every(text) &&
      new Set(op.causal_parents).size === op.causal_parents.length, 'MALFORMED');
    need(shape(receipt, ['op_id', 'canonical_content_commitment', 'athlete_log_seq', 'accepted_at']) &&
      receipt.op_id === op.op_id && receipt.canonical_content_commitment === op.canonical_content_commitment &&
      Number.isSafeInteger(receipt.athlete_log_seq) && receipt.athlete_log_seq > 0 && text(receipt.accepted_at), 'RECEIPT_MISMATCH');
    const prior = identities.get(op.op_id);
    if (prior) {
      need(prior.operationBytes === record.operationBytes && prior.receiptBytes === record.receiptBytes, 'IDENTITY_CONFLICT');
      continue;
    }
    need(!positions.has(receipt.athlete_log_seq), 'POSITION_CONFLICT');
    const row = {...record, op, receipt}; identities.set(op.op_id, row); positions.set(receipt.athlete_log_seq, row);
  }
  need(positions.size === input.watermark && Array.from({length: input.watermark}, (_, i) => positions.has(i + 1)).every(Boolean), 'PARTIAL_GRAPH');
  const ordered = [...positions.values()].sort((a, b) => a.receipt.athlete_log_seq - b.receipt.athlete_log_seq);
  for (const row of ordered) for (const id of row.op.causal_parents) {
    const parent = identities.get(id); need(parent, 'MISSING_DEPENDENCY');
    need(parent.receipt.athlete_log_seq < row.receipt.athlete_log_seq, 'INVALID_CAUSAL_GRAPH');
  }
  const starts = new Map(), facts = new Map(), slots = new Set();
  for (const row of ordered) {
    const op = row.op;
    if (op.kind === 'session-start') {
      need(shape(op.payload, []) && text(op.planned_split_slot_id) && text(op.plan_basis), 'MALFORMED');
      need(starts.size === 0, 'UNSUPPORTED_WORKOUT_RELATIONSHIP'); starts.set(op.op_id, op); continue;
    }
    if (op.kind === 'session-set') {
      need(shape(op.payload, ['load', 'reps']) && quantity(op.payload.load, 'lb') && op.payload.load.value > 0 &&
        quantity(op.payload.reps, 'rep'), 'UNSUPPORTED_SET_FIELDS');
      need(EXTRA['session-set'].every(k => text(op[k])), 'MALFORMED');
      const start = starts.get(op.session_start_op_id); need(start, 'MISSING_DEPENDENCY');
      need(op.causal_parents.includes(start.op_id), 'MISSING_CAUSAL_EDGE');
      const slot = JSON.stringify([start.op_id, op.lift_lineage_id, op.logical_set_slot]);
      need(!slots.has(slot), 'UNSUPPORTED_CONFLICT'); slots.add(slot);
      facts.set(op.op_id, {source_op_id: op.op_id, session_start_op_id: start.op_id, logical_set_slot: op.logical_set_slot,
        lift_lineage_id: op.lift_lineage_id, plan_basis: start.plan_basis, original: clone(op.payload),
        observations: clone(op.payload), included: true,
        provenance: {source_commitment: op.canonical_content_commitment, source_log_seq: row.receipt.athlete_log_seq,
          correction_op_ids: [], tombstone_op_ids: []}}); continue;
    }
    const target = identities.get(op.target_op_id); need(target, 'MISSING_DEPENDENCY');
    need(target.op.kind === 'session-set', 'UNSUPPORTED_TARGET');
    const fact = facts.get(op.target_op_id); need(fact, 'INVALID_CAUSAL_GRAPH');
    need(op.lift_lineage_id === fact.lift_lineage_id && op.causal_parents.includes(op.target_op_id), 'MISSING_CAUSAL_EDGE');
    if (op.kind === 'correction') {
      need(shape(op.payload, ['replacement_fields']) && shape(op.payload.replacement_fields, ['load']) &&
        quantity(op.payload.replacement_fields.load, fact.original.load.unit) && op.payload.replacement_fields.load.value > 0,
      'UNSUPPORTED_REPLACEMENT');
      need(fact.included && fact.provenance.correction_op_ids.length === 0, 'UNSUPPORTED_CONFLICT');
      fact.observations.load = clone(op.payload.replacement_fields.load); // MUTATION: ignore-correction
      fact.provenance.correction_op_ids.push(op.op_id);
    } else {
      need(shape(op.payload, ['reason']) && text(op.payload.reason), 'MALFORMED');
      need(fact.included && fact.provenance.tombstone_op_ids.length === 0, 'UNSUPPORTED_CONFLICT');
      need(fact.provenance.correction_op_ids.every(id => op.causal_parents.includes(id)), 'UNSUPPORTED_CONFLICT');
      fact.included = false; fact.provenance.tombstone_op_ids.push(op.op_id);
    }
  }
  need(starts.size === 1, 'MISSING_DEPENDENCY');
  return {model: 'REVIEW_MODEL_ONLY', watermark: input.watermark,
    planBytes: input.planBytes, // MUTATION: change-plan
    retained: ordered.map(row => ({operationBytes: row.operationBytes, receiptBytes: row.receiptBytes})), // MUTATION: delete-original
    facts: [...facts.values()]};
}
module.exports = {ASSUMPTION, Refusal, project};
