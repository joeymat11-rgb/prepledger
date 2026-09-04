"use strict";
/* ops.cjs — the A3 OPERATION ENVELOPE and its A1 identity.
   Every client-created operation is immutable from its durable local commit. Its identity is
     op_id + canonical_content_commitment, where
     canonical_content_commitment = HMAC-SHA256(K_identity, "earned/op/v1" || canonical_encode(envelope EXCLUDING
       canonical_content_commitment, authority_signature, athlete_log_seq, accepted_at, decided_at,
       sealing_transitions, sealed))
   Envelope (A3): op_id · athlete_id · device_id · device_seq · device_predecessor_op_id · causal_parents[] (SET) ·
   class · kind · target_op_id (correction | reclassification | tombstone only) · effective {local_date, local_time,
   utc_offset} (athlete-attested) · schema_version · lease_id · payload (every quantity {value, unit}) · kind-specific
   fields (plan-mutation: conflict_domain_id, conflict_domain_lineage_id, requested_transaction_id, members[],
   seen_plan_basis, member_set_commitment; undo-request: target_plan_transaction_id, seen_plan_basis, …). */
const crypto = require("node:crypto");
const { encode } = require("./canonical.cjs");

const DOMAIN = "earned/op/v1";
const MEMBERS_DOMAIN = "earned/members/v1";
const SCHEMA_VERSION = 1;
const KINDS = ["fact", "correction", "reclassification", "tombstone", "plan-mutation", "lineage", "session-start", "session-set", "session-skip", "session-close", "session-relationship-resolution", "set-slot-resolution", "proposal-response", "undo-request", "conflict-resolution", "conflict-selection"];
const CLASSES = ["reading", "food-day", "steps", "sleep", "event", "illness", "pain-attestation", "setup-note", "body-composition-source", "plan", "session"];
const TARGET_REQUIRED = new Set(["correction", "reclassification", "tombstone"]);
/* authority metadata and the commitment itself never enter the commitment pre-image */
const AUTHORITY_METADATA = new Set(["canonical_content_commitment", "authority_signature", "athlete_log_seq", "accepted_at", "decided_at", "sealing_transitions", "sealed"]);

const hmac = (key, text) => crypto.createHmac("sha256", String(key)).update(text, "utf8").digest("hex");

/* the commitment over ANY object: strip the excluded fields, encode canonically, HMAC under the identity key */
function commitmentOf(envelope, identityKey) {
  if (!envelope || typeof envelope !== "object") throw new Error("commitmentOf(): envelope must be an object");
  const pre = {};
  for (const k of Object.keys(envelope)) if (!AUTHORITY_METADATA.has(k)) pre[k] = envelope[k];
  return hmac(identityKey, DOMAIN + encode(pre));
}

/* A4 presence checks that the client can decide locally (the authority's matrix is the final word) */
function validate(spec) {
  const problems = [];
  if (KINDS.indexOf(spec.kind) < 0) problems.push("kind outside the A3 model: " + spec.kind);
  if (CLASSES.indexOf(spec.class) < 0) problems.push("class outside the A4 model: " + spec.class);
  if (TARGET_REQUIRED.has(spec.kind) && (typeof spec.target !== "string" || !spec.target)) problems.push("a " + spec.kind + " must name its target operation");
  if (!TARGET_REQUIRED.has(spec.kind) && spec.target !== undefined) problems.push("only correction | reclassification | tombstone carry a target");
  if (!spec.effective || typeof spec.effective.local_date !== "string") problems.push("effective.local_date is required");
  if (spec.payload !== null && (typeof spec.payload !== "object" || Array.isArray(spec.payload))) problems.push("payload must be a map or null");
  if (spec.kind === "plan-mutation") { const m = spec.plan && spec.plan.members; if (!Array.isArray(m) || !m.length) problems.push("a plan-mutation carries at least one member"); else for (const x of m) { if (typeof x.field !== "string") problems.push("member.field required"); if (x.value === undefined) problems.push("member.value required (absent is absent)"); if (x.provenance !== "athlete_edited" && x.provenance !== "inherited") problems.push("member.provenance must be athlete_edited | inherited"); } }
  return problems;
}

/* build(spec, identityKey) → a sealed envelope. spec: { op_id, athlete_id, device_id, device_seq, predecessor, parents,
   class, kind, target, effective, lease_id, payload, plan{domain, lineage, txn, members, seen_plan_basis},
   undo{target_txn, seen_plan_basis}, extra } */
function build(spec, identityKey) {
  const problems = validate(spec); if (problems.length) { const e = new Error(problems.join("; ")); e.validation = problems; throw e; }
  const op = {
    op_id: spec.op_id, athlete_id: spec.athlete_id, device_id: spec.device_id, device_seq: spec.device_seq,
    device_predecessor_op_id: spec.predecessor == null ? null : spec.predecessor,
    causal_parents: (spec.parents || []).slice(),
    class: spec.class, kind: spec.kind,
    effective: { local_date: spec.effective.local_date, local_time: spec.effective.local_time, utc_offset: spec.effective.utc_offset },
    schema_version: spec.schema_version == null ? SCHEMA_VERSION : spec.schema_version,
    lease_id: spec.lease_id,
    payload: spec.payload === undefined ? null : spec.payload,
  };
  if (TARGET_REQUIRED.has(spec.kind)) op.target_op_id = spec.target;
  if (spec.kind === "plan-mutation") {
    const p = spec.plan;
    op.conflict_domain_id = p.domain; op.conflict_domain_lineage_id = p.lineage || ("lin-" + p.domain + "-1");
    op.requested_transaction_id = p.txn || ("txn-" + op.op_id);
    op.members = p.members.map((m) => ({ ...m }));
    op.seen_plan_basis = p.seen_plan_basis || "basis-0";
    op.member_set_commitment = hmac(identityKey, MEMBERS_DOMAIN + encode(op.members));
    if (p.group_provenance) op.group_provenance = p.group_provenance;
  }
  if (spec.kind === "undo-request") { const u = spec.undo || {}; op.target_plan_transaction_id = u.target_txn == null ? null : u.target_txn; op.seen_plan_basis = u.seen_plan_basis || "basis-0"; op.target_effect_digest = u.target_effect_digest == null ? null : u.target_effect_digest; op.compensating_group_commitment = u.compensating_group_commitment == null ? null : u.compensating_group_commitment; }
  if (spec.kind === "session-relationship-resolution" || spec.kind === "set-slot-resolution") { if (spec.component) op.component = spec.component; }
  if (spec.extra) for (const k of Object.keys(spec.extra)) if (spec.extra[k] !== undefined) op[k] = spec.extra[k];
  op.canonical_content_commitment = commitmentOf(op, identityKey);
  return op;
}

/* the same primitive the sync and lease modules use for authority-signed records */
const signatureOver = (key, domain, record, signatureField) => { const pre = {}; for (const k of Object.keys(record)) if (k !== signatureField) pre[k] = record[k]; return hmac(key, domain + encode(pre)); };

module.exports = { build, validate, commitmentOf, hmac, signatureOver, KINDS, CLASSES, TARGET_REQUIRED, AUTHORITY_METADATA, DOMAIN, SCHEMA_VERSION };
