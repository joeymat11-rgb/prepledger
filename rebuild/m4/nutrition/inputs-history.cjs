'use strict';
const Wire = require('./inputs-wire.cjs');
const copy = structuredClone;
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
function project({ collections, athleteId, deviceId }) {
  const ops = collections.ops || {}, W = collections.sync?.frontier?.W ?? 0;
  const records = Object.values(ops).filter(op => op?.payload?.profile === Wire.PROFILE).map(op => {
    if (op.athlete_id !== athleteId) throw Object.assign(new Error('NUTRITION_INPUT_SCOPE'), { code: 'NUTRITION_INPUT_SCOPE', state: 18 });
    const disposition = collections.dispositions?.[op.op_id];
    const seq = disposition?.athlete_log_seq, receipt = collections.receipts?.[String(seq)];
    const status = ['REJECTED', 'REJECTED_DEPENDENCY'].includes(disposition?.status) || collections.rejected?.[op.op_id] ? 'rejected' :
      disposition?.status === 'ACCEPTED' && Number.isSafeInteger(seq) && seq > 0 && seq <= W && receipt?.op_id === op.op_id &&
      receipt.canonical_content_commitment === op.canonical_content_commitment ? 'accepted' :
      op.device_id === deviceId && collections.outbox?.[op.op_id]?.op_id === op.op_id && !disposition ? 'pending-local' : 'unresolved';
    return { op_id: op.op_id, status, valid: Wire.validate(op, id => ops[id]), original: copy(op) };
  });
  const byId = new Map(records.map(row => [row.op_id, row]));
  function layer(acceptedOnly) {
    const included = records.filter(row => row.status === 'accepted' || !acceptedOnly && row.status === 'pending-local');
    const ids = new Set(included.map(row => row.op_id)), superseded = new Set();
    const requirements = [];
    for (const row of included) {
      if (!row.valid) requirements.push('NUTRITION_INPUT_INTERPRETATION_REQUIRED');
      const target = row.original.payload.supersedes;
      if (target !== null && !ids.has(target)) requirements.push('NUTRITION_INPUT_ANCESTRY_REQUIRED');
      if (target !== null) superseded.add(target);
      const seen = new Set([row.op_id]); let cursor = target;
      while (cursor !== null && byId.has(cursor)) {
        if (seen.has(cursor)) { requirements.push('NUTRITION_INPUT_ANCESTRY_REQUIRED'); break; }
        seen.add(cursor); cursor = byId.get(cursor).original.payload.supersedes;
      }
    }
    if (!acceptedOnly && records.some(row => row.status === 'unresolved')) requirements.push('NUTRITION_INPUT_STATUS_REQUIRED');
    const heads = included.filter(row => !superseded.has(row.op_id));
    if (heads.length > 1) requirements.push('NUTRITION_INPUT_RESOLUTION_REQUIRED');
    const selected = !requirements.length && heads.length === 1 ? heads[0] : null;
    return { current: selected ? { sourceOpId: selected.op_id, effective: copy(selected.original.effective), inputs: copy(selected.original.payload.inputs), status: selected.status } : null,
      heads: heads.map(row => row.op_id), requirements: [...new Set(requirements)] };
  }
  return freeze({ profile: Wire.PROFILE, records, accepted: layer(true), local: layer(false), advice: 'not_qualified', effectivePlan: null });
}
module.exports = { project, freeze };
