/* lib/ops.cjs — SHEET-CONFORMING OPERATION FIXTURES (A3 envelope + A4 payload), the ONE boundary the §A/§B laws
   feed into every adapter. Sol suite-pass-1: "define the adapter input explicitly … or build complete A3/A4
   operations. Do not leave the boundary ambiguous." → the boundary is the A3/A4 operation, built here.
   Every op: op_id · canonical_content_commitment · athlete_id · device_id · device_seq · device_predecessor_op_id ·
   causal_parents[] · class · kind (A3 kind model) · target_op_id (correction | reclassification | tombstone ONLY) ·
   effective {local_date, local_time, utc_offset} (athlete-attested) · schema_version · lease_id · payload with
   every quantity carrying its unit · kind-specific fields (plan-mutation: conflict_domain_id,
   conflict_domain_lineage_id, requested_transaction_id, members[{field, value, unit?, provenance}],
   seen_plan_basis, member_set_commitment). The commitment = HMAC(K_identity, "earned/op/v1" || canonical_encode(
   envelope EXCLUDING the commitment, sealing transitions and authority metadata; payload)). Synthetic only. */
const crypto = require("node:crypto");
const CANON = require("./canonical.cjs");
const KINDS = ["fact", "correction", "reclassification", "tombstone", "plan-mutation", "lineage", "session-start", "session-set", "session-skip", "session-close", "session-relationship-resolution", "set-slot-resolution", "proposal-response", "undo-request", "conflict-resolution", "conflict-selection"];
const CLASSES = ["reading", "food-day", "steps", "sleep", "event", "illness", "pain-attestation", "setup-note", "body-composition-source", "plan", "session"];
const TARGET_REQUIRED = new Set(["correction", "reclassification", "tombstone"]);
function sortKeys(x) { if (Array.isArray(x)) return x.map(sortKeys); if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x).sort()) o[k] = sortKeys(x[k]); return o; } return x; }
const canonicalEncode = (o, copts) => CANON.encode(o, copts || CANON.defaults);   /* canonical-v1: NFC, sorted maps, sorted SET fields, canonical decimals, absent ≠ null ≠ value */
const hmac = (key, s) => crypto.createHmac("sha256", String(key)).update(s).digest("hex");
const AUTHORITY_METADATA = new Set(["canonical_content_commitment", "authority_signature", "athlete_log_seq", "accepted_at", "decided_at", "sealing_transitions", "sealed"]);
function commitmentOf(op, K, copts) { const env = {}; for (const k of Object.keys(op)) if (!AUTHORITY_METADATA.has(k)) env[k] = op[k]; return hmac(K, "earned/op/v1" + canonicalEncode(env, copts)); }
const K_IDENTITY = "k-identity-epoch-1";
let seq = 0;
/* build(spec) — spec.athlete_id, device_id, device_seq, pred, parents, class, kind, target, effective, lease_id, payload, plan */
function build(spec, K = K_IDENTITY) {
  const kind = spec.kind || "fact"; const cls = spec.class || "reading";
  if (KINDS.indexOf(kind) < 0) throw new Error("kind outside the A3 model: " + kind);
  if (CLASSES.indexOf(cls) < 0) throw new Error("class outside the fixture model: " + cls);
  const op = {
    op_id: spec.op_id || ("op-" + (++seq)), athlete_id: spec.athlete_id || "ath-1", device_id: spec.device_id, device_seq: spec.device_seq,
    device_predecessor_op_id: spec.pred == null ? null : spec.pred, causal_parents: (spec.parents || []).slice(),
    class: cls, kind, effective: spec.effective || { local_date: "2026-09-01", local_time: "07:05", utc_offset: "-04:00" },
    schema_version: spec.schema_version == null ? 1 : spec.schema_version, lease_id: spec.lease_id || "L-" + spec.device_id,
    payload: spec.payload === undefined ? { lb: { value: 160.0, unit: "lb" }, source: "athlete" } : spec.payload,
  };
  if (TARGET_REQUIRED.has(kind)) op.target_op_id = spec.target; else if (spec.target !== undefined) op.target_op_id = spec.target;   /* a stray target on a fact is a malformed op — kept so a law can test it */
  if (kind === "plan-mutation") {
    const p = spec.plan || {}; op.conflict_domain_id = p.domain || "protein"; op.conflict_domain_lineage_id = p.lineage || "lin-protein-1";
    op.requested_transaction_id = p.txn || ("txn-" + op.op_id); op.members = (p.members || [{ field: "protein_g", value: 155, unit: "g/day", provenance: "athlete_edited" }]).map((m) => ({ ...m }));
    op.seen_plan_basis = p.seen_plan_basis || "basis-0"; op.member_set_commitment = hmac(K, "earned/members/v1" + canonicalEncode(op.members));
  }
  if (kind === "conflict-selection") { const p = spec.plan || {}; op.conflict_domain_id = p.domain || "protein"; op.conflict_domain_lineage_id = p.lineage || "lin-protein-1"; op.requested_transaction_id = p.txn || ("txn-" + op.op_id); op.seen_conflict_basis = spec.seen_conflict_basis || p.seen_conflict_basis || null; op.chosen_alternative_commitment = spec.chosen || p.chosen || null; }
  if (kind === "undo-request") { const u = spec.undo || {}; op.target_plan_transaction_id = u.target_txn || null; op.seen_plan_basis = u.seen_plan_basis || "basis-0"; op.target_effect_digest = u.target_effect_digest || null; op.compensating_group_commitment = u.compensating_group_commitment || null; }
  if (spec.omit) for (const k of spec.omit) delete op[k];   /* for malformed-op laws */
  if (spec.extra) Object.assign(op, spec.extra);
  op.canonical_content_commitment = spec.commitment || commitmentOf(op, K);
  return op;
}
/* leases: signed by the authority key; a forged lease is signed with another key */
const AUTH_KEY = "authority-signing-key-1";
function lease(device_id, o = {}) { const l = { lease_id: o.lease_id || "L-" + device_id, device_id, athlete_id: o.athlete_id || "ath-1", schema_version: o.schema_version == null ? 1 : o.schema_version, range: o.range || [1, 500], not_before: o.not_before || "2026-09-03T00:00:00Z", not_after: o.not_after || "2026-10-03T00:00:00Z", issued_server_time: o.issued || "2026-09-03T00:00:00Z" }; l.signature = hmac(o.key || AUTH_KEY, "earned/lease/v1" + canonicalEncode({ ...l, signature: undefined })); return l; }
const leaseValid = (l) => !!l && l.signature === hmac(AUTH_KEY, "earned/lease/v1" + canonicalEncode({ ...l, signature: undefined }));
module.exports = { build, commitmentOf, canonicalEncode, hmac, sortKeys, lease, leaseValid, CANON, K_IDENTITY, AUTH_KEY, KINDS, CLASSES, TARGET_REQUIRED, AUTHORITY_METADATA, reset: () => { seq = 0; } };
