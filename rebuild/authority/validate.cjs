"use strict";

const KINDS = new Set(["fact", "correction", "reclassification", "tombstone", "plan-mutation", "lineage", "session-start", "session-set", "session-skip", "session-close", "session-relationship-resolution", "set-slot-resolution", "proposal-response", "undo-request", "conflict-resolution", "conflict-selection"]);
const CLASSES = new Set(["reading", "food-day", "steps", "sleep", "event", "illness", "pain-attestation", "setup-note", "body-composition-source", "plan", "session"]);
const TARGET_KINDS = new Set(["correction", "reclassification", "tombstone"]);
const PLAN_KINDS = new Set(["plan-mutation", "conflict-selection", "undo-request"]);
const text = x => typeof x === "string" && x.trim().length > 0;
const quantity = q => q !== null && typeof q === "object" && Number.isFinite(q.value) && text(q.unit);
function quantitiesValid(value) {
  if (value === null) return true;
  if (typeof value === "number") return false;
  if (typeof value !== "object") return ["string", "boolean", "undefined"].includes(typeof value);
  if (Array.isArray(value)) return value.every(quantitiesValid);
  if (Object.hasOwn(value, "value") || Object.hasOwn(value, "unit")) return quantity(value);
  return Object.values(value).every(quantitiesValid);
}
function effectiveValid(e) {
  return e && text(e.local_date) && text(e.local_time) && /^[+-]\d{2}:\d{2}$/.test(e.utc_offset || "");
}
function payloadValid(cls, p) {
  if (!p || typeof p !== "object" || !quantitiesValid(p)) return false;
  switch (cls) {
    case "reading": return quantity(p.lb);
    case "steps": return quantity(p.count);
    case "sleep": return quantity(p.hours);
    case "event": return text(p.type) && interval(p.interval);
    case "illness": return interval(p.interval);
    case "pain-attestation": return p.scope != null;
    case "setup-note": return text(p.text);
    case "body-composition-source": return text(p.kind) && text(p.quantity) && text(p.provenance) && text(p.effective_date)
      && quantity(p.low) && quantity(p.high) && p.low.unit === p.high.unit && p.low.value <= p.high.value
      && (p.point === undefined || quantity(p.point) && p.point.unit === p.low.unit && p.low.value <= p.point.value && p.point.value <= p.high.value);
    default: return true;
  }
}
const interval = x => x && text(x.start) && text(x.end);
const present = (o, fields) => fields.every(k => o[k] !== undefined && o[k] !== null);
function validShape(op) {
  if (!op || typeof op !== "object" || Array.isArray(op)) return false;
  if (!["op_id", "athlete_id", "device_id", "lease_id", "canonical_content_commitment"].every(k => text(op[k]))) return false;
  if (!KINDS.has(op.kind) || !CLASSES.has(op.class) || !Number.isSafeInteger(op.device_seq) || op.device_seq < 1) return false;
  if (!Number.isSafeInteger(op.schema_version) || op.schema_version < 1 || !Object.hasOwn(op, "payload") || !effectiveValid(op.effective)) return false;
  if (!Array.isArray(op.causal_parents) || !op.causal_parents.every(text) || !Object.hasOwn(op, "device_predecessor_op_id")) return false;
  if (op.device_predecessor_op_id !== null && !text(op.device_predecessor_op_id)) return false;
  if (TARGET_KINDS.has(op.kind) ? !text(op.target_op_id) : op.target_op_id !== undefined) return false;
  if (!PLAN_KINDS.has(op.kind) && !quantitiesValid(op.payload)) return false;
  if (op.kind === "fact" && !payloadValid(op.class, op.payload)) return false;
  if (op.kind === "plan-mutation") return present(op, ["conflict_domain_id", "conflict_domain_lineage_id", "requested_transaction_id", "seen_plan_basis", "member_set_commitment"])
    && Array.isArray(op.members) && op.members.length > 0
    && new Set(op.members.map(m => m && m.field)).size === op.members.length
    && op.members.every(m => m && text(m.field) && text(m.unit) && Number.isFinite(m.value) && ["athlete_edited", "inherited"].includes(m.provenance));
  if (op.kind === "conflict-selection") return present(op, ["conflict_domain_id", "conflict_domain_lineage_id", "requested_transaction_id", "seen_conflict_basis", "chosen_alternative_commitment"]);
  if (op.kind === "undo-request") return present(op, ["target_plan_transaction_id", "seen_plan_basis", "target_effect_digest", "compensating_group_commitment"]);
  if (op.kind === "correction") return op.payload && op.payload.replacement_fields && Object.keys(op.payload.replacement_fields).length > 0;
  if (op.kind === "tombstone") return op.payload && text(op.payload.reason);
  if (op.kind === "reclassification") return op.payload && CLASSES.has(op.payload.replacement_class);
  if (op.kind === "proposal-response") return op.payload && present(op.payload, ["issuance_id", "chosen_outcome_id", "consent_digest"])
    && ["APPLY", "KEEP", "NO"].includes(op.payload.chosen_outcome_id);
  return true;
}
function validReclassification(op, target) {
  const to = op.payload.replacement_class;
  if (["reading", "food-day"].includes(target.class) && target.class === to) return true;
  return effectiveValid(op.payload.destination_effective) && payloadValid(to, op.payload.destination_payload);
}
module.exports = { validShape, validReclassification, payloadValid, quantitiesValid, PLAN_KINDS };
