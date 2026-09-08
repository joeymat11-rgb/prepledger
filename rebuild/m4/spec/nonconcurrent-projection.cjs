'use strict';
// REVIEW MODEL ONLY. Identifiers/commitments/receipts are model-only placeholders.
// Inputs explicitly ASSUME an authenticated, accepted, complete synthetic graph.
// This module does not verify signatures, admit operations, allocate a schema,
// run a training engine, persist data, or implement concurrent correction policy.
// Proposed observation types: BRIEF-OWNER-WORKOUT lines59/64/105. Reps' complete
// integer/range domain and reserve prompt eligibility remain OPEN, not inferred.
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
function reserve(value) {
  if (!map(value)) return false;
  if (['unknown', 'skipped', 'not_asked'].includes(value.tag)) return shape(value, ['tag']);
  return shape(value, ['tag', 'value', 'unit']) && value.unit === 'rep' &&
    (value.tag === 'exact' ? [0, 1, 2].includes(value.value) : value.tag === 'at_least' && value.value === 3);
}
function observations(value) {
  return shape(value, ['load', 'reps'], ['reserve']) && quantity(value.load, 'lb') && value.load.value > 0 &&
    quantity(value.reps, 'rep') && (!Object.hasOwn(value, 'reserve') || reserve(value.reserve));
}
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
  const ancestry = new Map();
  for (const row of ordered) {
    const parents = new Set();
    for (const id of row.op.causal_parents) {
      const parent = identities.get(id); need(parent, 'MISSING_DEPENDENCY');
      need(parent.receipt.athlete_log_seq < row.receipt.athlete_log_seq, 'INVALID_CAUSAL_GRAPH');
      parents.add(id); for (const ancestor of ancestry.get(id)) parents.add(ancestor);
    }
    ancestry.set(row.op.op_id, parents);
  }
  // Receipt positions validate this assumed accepted DAG; they do not establish
  // edit causality. Each prior same-target edit must be in actual parent closure.
  const coversEdits = (op, fact) => fact.provenance.correction_op_ids.every(id => ancestry.get(op.op_id).has(id));
  const starts = new Map(), facts = new Map(), slots = new Set();
  for (const row of ordered) {
    const op = row.op;
    if (op.kind === 'session-start') {
      need(shape(op.payload, []) && text(op.planned_split_slot_id) && text(op.plan_basis), 'MALFORMED');
      need(starts.size === 0, 'UNSUPPORTED_WORKOUT_RELATIONSHIP'); starts.set(op.op_id, op); continue;
    }
    if (op.kind === 'session-set') {
      need(observations(op.payload), 'UNSUPPORTED_SET_FIELDS');
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
      need(shape(op.payload, ['replacement_fields']) && shape(op.payload.replacement_fields, [], ['load', 'reps', 'reserve']) &&
        Object.keys(op.payload.replacement_fields).length > 0, 'UNSUPPORTED_REPLACEMENT');
      need(observations({...fact.observations, ...op.payload.replacement_fields}), 'UNSUPPORTED_REPLACEMENT');
      need(fact.included && coversEdits(op, fact), 'UNSUPPORTED_CONFLICT');
      Object.assign(fact.observations, clone(op.payload.replacement_fields)); // MUTATION: ignore-correction
      fact.provenance.correction_op_ids.push(op.op_id);
    } else {
      need(shape(op.payload, ['reason']) && text(op.payload.reason), 'MALFORMED');
      need(fact.included && fact.provenance.tombstone_op_ids.length === 0, 'UNSUPPORTED_CONFLICT');
      need(coversEdits(op, fact), 'UNSUPPORTED_CONFLICT');
      fact.included = false; fact.provenance.tombstone_op_ids.push(op.op_id);
    }
  }
  need(starts.size === 1, 'MISSING_DEPENDENCY');
  return {model: 'REVIEW_MODEL_ONLY', watermark: input.watermark,
    planBytes: input.planBytes, // MUTATION: change-plan
    retained: ordered.map(row => ({operationBytes: row.operationBytes, receiptBytes: row.receiptBytes})), // MUTATION: delete-original
    facts: [...facts.values()]};
}
// C1 NON-SHIPPING SPECIFICATION. This is NOT the missing authenticated decoder.
// It assumes complete, supported normalized START views and their provenance.
// The harness injects unchanged, source-pinned client/session.cjs candidateEdge;
// the classifier derives EVERY edge itself, never trusts a caller edge subset.
// No generation allocation, answer applicability (Q1/Q3), persistence or wire
// schema is implemented. Returned classifications cannot qualify product output.
// ONE pinned relation applies to both snapshots: changed version labels prove
// invalidation, not compatibility across different relation implementations.
// A live-view rejoin is assumed input, not permission to resurrect a tombstone.
const START_ASSUMPTION = 'ASSUMED_AUTHENTICATED_COMPLETE_NORMALIZED_START_GRAPH';
function createStartClassifier(candidateEdge) {
  need(typeof candidateEdge === 'function', 'RELATION_REQUIRED');
  const key = members => JSON.stringify(members); // Complete array, not delimiter joining.
  const sorted = xs => xs.slice().sort();
  const orderText = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  const sameFields = (a, b, fields) => fields.every(k => a[k] === b[k]);
  function snapshot(s, athlete) {
    need(shape(s, ['complete', 'supported', 'ruleVersion', 'normalizerVersion', 'starts']) &&
      s.complete === true && s.supported === true && text(s.ruleVersion) && text(s.normalizerVersion) &&
      Array.isArray(s.starts), 'NORMALIZATION_BLOCKED');
    const rows = new Map();
    for (const x of s.starts) {
      need(shape(x, ['id', 'athlete', 'device', 'live', 'eligible', 'relation', 'source']) &&
        text(x.id) && x.athlete === athlete && text(x.device) &&
        typeof x.live === 'boolean' && typeof x.eligible === 'boolean', 'NORMALIZATION_BLOCKED');
      need(shape(x.relation, ['slot', 'date', 'time']) && Object.values(x.relation).every(text) &&
        /^\d{4}-\d{2}-\d{2}$/.test(x.relation.date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(x.relation.time),
      'NORMALIZATION_BLOCKED');
      const day = Date.parse(x.relation.date + 'T00:00:00Z');
      need(Number.isFinite(day) && new Date(day).toISOString().slice(0, 10) === x.relation.date, 'NORMALIZATION_BLOCKED');
      need(shape(x.source, ['opId', 'commitment', 'schemaVersion', 'operationBytes', 'receiptBytes', 'planBasis']) &&
        x.source.opId === x.id && text(x.source.commitment) && Number.isSafeInteger(x.source.schemaVersion) &&
        x.source.schemaVersion > 0 && ['operationBytes', 'receiptBytes', 'planBasis'].every(k => text(x.source[k])),
      'NORMALIZATION_BLOCKED');
      need(!rows.has(x.id), 'START_IDENTITY_CONFLICT'); rows.set(x.id, clone(x));
    }
    // Eligibility is relevant metadata, never an invented live-vertex filter.
    const members = sorted([...rows.values()].filter(x => x.live).map(x => x.id));
    const edges = [], adjacent = new Map(members.map(id => [id, new Set()]));
    for (let i = 0; i < members.length; i++) for (let j = i + 1; j < members.length; j++) {
      const a = members[i], b = members[j];
      const forward = candidateEdge(rows.get(a).relation, rows.get(b).relation);
      const reverse = candidateEdge(rows.get(b).relation, rows.get(a).relation);
      need(typeof forward === 'boolean' && forward === reverse, 'RELATION_BLOCKED');
      if (forward) { edges.push([a, b]); adjacent.get(a).add(b); adjacent.get(b).add(a); }
    }
    const remaining = new Set(members), components = [];
    for (const id of members) {
      if (!remaining.delete(id)) continue;
      const group = [id];
      for (let i = 0; i < group.length; i++) for (const next of adjacent.get(group[i])) {
        if (remaining.delete(next)) group.push(next);
      }
      const m = sorted(group); components.push({key: key(m), members: m});
    }
    return {rows, edges, components, ruleVersion: s.ruleVersion, normalizerVersion: s.normalizerVersion};
  }
  return function classifyStartTransition(input) {
    need(shape(input, ['assumption', 'athlete', 'cause', 'before', 'after']) &&
      input.assumption === START_ASSUMPTION && text(input.athlete), 'NORMALIZATION_BLOCKED');
    need(['START_TRANSITION', 'VERSION_ACTIVATION', 'UNRELATED', 'SET_DISPLAY_ONLY'].includes(input.cause), 'NORMALIZATION_BLOCKED');
    const before = snapshot(input.before, input.athlete), after = snapshot(input.after, input.athlete);
    for (const [id, x] of before.rows) {
      need(after.rows.has(id), 'MISSING_RETAINED_START');
      const y = after.rows.get(id);
      need(x.athlete === y.athlete && x.device === y.device && sameFields(x.source, y.source,
        ['opId', 'commitment', 'schemaVersion', 'operationBytes', 'receiptBytes', 'planBasis']), 'START_PROVENANCE_CHANGED');
    }
    const versionChanged = before.ruleVersion !== after.ruleVersion || before.normalizerVersion !== after.normalizerVersion;
    need(!versionChanged || input.cause === 'VERSION_ACTIVATION', 'VERSION_ACTIVATION_REQUIRED');
    const reasons = new Map(), changed = new Set();
    const note = (id, reason) => { changed.add(id); if (!reasons.has(id)) reasons.set(id, new Set()); reasons.get(id).add(reason); };
    for (const [id, y] of after.rows) {
      const x = before.rows.get(id);
      if (!x) { note(id, 'START_ADDED'); continue; }
      if (x.live !== y.live) note(id, 'LIVENESS');
      if (x.eligible !== y.eligible) note(id, 'ELIGIBILITY');
      if (!sameFields(x.relation, y.relation, ['slot', 'date', 'time'])) note(id, 'RELATION_INPUT');
    }
    const oldEdges = new Set(before.edges.map(key)), newEdges = new Set(after.edges.map(key));
    for (const e of before.edges) if (!newEdges.has(key(e))) for (const id of e) note(id, 'EDGE_REMOVED');
    for (const e of after.edges) if (!oldEdges.has(key(e))) for (const id of e) note(id, 'EDGE_ADDED');
    if (versionChanged) for (const id of after.rows.keys()) note(id, 'VERSION');
    if (['UNRELATED', 'SET_DISPLAY_ONLY'].includes(input.cause)) {
      need(!changed.size, 'UNRELATED_START_CHANGE');
    }
    const all = [...before.components.map(c => ({side: 'before', ...c})), ...after.components.map(c => ({side: 'after', ...c}))];
    const remaining = new Set(all.map((_, i) => i)), lineages = [], unchanged = [];
    // Transitive overlap union includes BOTH snapshots: split/rejoin can connect
    // components indirectly even when a changed endpoint is not their member.
    for (let i = 0; i < all.length; i++) {
      if (!remaining.delete(i)) continue;
      const indices = [i], members = new Set(all[i].members);
      for (let n = 0; n < indices.length; n++) for (const j of [...remaining]) {
        if (all[j].members.some(id => members.has(id))) {
          remaining.delete(j); indices.push(j); for (const id of all[j].members) members.add(id);
        }
      }
      const old = indices.filter(j => all[j].side === 'before').map(j => all[j].members).sort((a, b) => orderText(key(a), key(b)));
      const next = indices.filter(j => all[j].side === 'after').map(j => all[j].members).sort((a, b) => orderText(key(a), key(b)));
      const ids = sorted([...members]);
      const affected = ids.some(id => changed.has(id)); // MUTATION: membership-only-classifier
      if (!affected) { unchanged.push(...old.map(m => ({key: key(m), members: m}))); continue; }
      const why = sorted([...new Set(ids.flatMap(id => [...(reasons.get(id) || [])]))]);
      lineages.push({members: ids, before: old, after: next, reasons: why});
    }
    const order = (a, b) => orderText(key(a.members), key(b.members));
    lineages.sort(order); unchanged.sort(order);
    return {model: 'REVIEW_CLASSIFIER_ONLY', inputQualification: 'ASSUMPTION_ONLY',
      before: {ruleVersion: before.ruleVersion, normalizerVersion: before.normalizerVersion, components: before.components, edges: before.edges},
      after: {ruleVersion: after.ruleVersion, normalizerVersion: after.normalizerVersion, components: after.components, edges: after.edges},
      affectedLineages: lineages, unchangedComponents: unchanged};
  };
}
module.exports = {ASSUMPTION, Refusal, project, START_ASSUMPTION, createStartClassifier};
