"use strict";
/* admit.cjs — A1/A2 ADMISSION. One store transaction per operation; the disposition is durable before it is returned.
     identity   op_id + commitment: a replay (same both) returns the slot's current disposition and logs nothing; the same
                op_id with a different commitment is IDENTITY_COLLISION (transient — slot and log untouched); ownership of
                an op_id is PER ATHLETE, so two athletes may share one
     shape      MALFORMED: missing envelope fields, kind/class outside the model, effective without offset, target rules,
                bare or non-finite numbers, incomplete A4 payloads, incompatible reclassification
     capability LEASE_UNKNOWN (no lease for the device / lease id mismatch) → LEASE_FORGED (signature or binding) →
                LEASE_REVOKED_BEYOND_BARRIER (device_seq above the revocation barrier) → DEVICE_SEQ_OUT_OF_RANGE. A leased
                op arriving after not_after is still admitted — server receipt time is not the athlete's commit time
     slots      one op per (device_id, device_seq): a different op in an occupied slot is DEVICE_SEQ_REUSE, recorded under
                its own key so the original slot replays unchanged
     references causal_parents + target_op_id: owned by another athlete → CROSS_ATHLETE_REFERENCE; terminally rejected →
                REJECTED_DEPENDENCY; unknown or still WAITING → WAITING (the op is parked and re-evaluated when a parent
                lands). Transport order (device_predecessor_op_id) is never causality
     acceptance the next athlete_log_seq, the plan / selection / undo / response effects (plan.cjs, issue.cjs) and the log
                entry — all in the same transaction; then every parked op whose references are decided is released */
const { rowKey, rowPrefix, pad } = require("./store.cjs");
const KINDS = ["fact", "correction", "reclassification", "tombstone", "plan-mutation", "lineage", "session-start", "session-set", "session-skip", "session-close", "session-relationship-resolution", "set-slot-resolution", "proposal-response", "undo-request", "conflict-resolution", "conflict-selection"];
const CLASSES = ["reading", "food-day", "steps", "sleep", "event", "illness", "pain-attestation", "setup-note", "body-composition-source", "plan", "session"];
const TARGET_REQUIRED = new Set(["correction", "reclassification", "tombstone"]);
const CODES = ["CROSS_ATHLETE_REFERENCE", "IDENTITY_COLLISION", "INSTANCE_COLLISION", "MALFORMED", "LEASE_FORGED", "LEASE_UNKNOWN", "LEASE_REVOKED_BEYOND_BARRIER", "DEVICE_SEQ_OUT_OF_RANGE", "DEVICE_SEQ_REUSE", "LINEAGE_MISMATCH"];
const ENVELOPE = ["op_id", "athlete_id", "device_id", "device_seq", "class", "kind", "effective", "schema_version", "lease_id", "payload", "causal_parents"];
const PAYLOAD_REQUIRED = { reading: ["lb"], "food-day": [], steps: ["count"], sleep: ["hours"], event: ["type", "interval"], illness: ["interval"], "pain-attestation": ["scope"], "setup-note": ["text"], "body-composition-source": ["kind", "quantity", "low", "high", "provenance", "effective_date"] };
const COMPATIBLE_RECLASS = { reading: ["reading"], "food-day": ["food-day"] };
const PLAN_KINDS = new Set(["plan-mutation", "conflict-selection", "undo-request"]);
const isNum = (x) => typeof x === "number" && Number.isFinite(x);
const isQty = (q) => !!q && typeof q === "object" && isNum(q.value) && typeof q.unit === "string" && q.unit.length > 0;
/* every number in a payload is a {value, unit} quantity; a bare or non-finite number is a defect */
function quantityDefect(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? "bare number" : "non-finite number";
  if (Array.isArray(v)) { for (const x of v) { const d = quantityDefect(x); if (d) return d; } return null; }
  if (typeof v === "object") { if (isQty(v)) return null; if ("value" in v && "unit" in v) return "malformed quantity"; for (const x of Object.values(v)) { const d = quantityDefect(x); if (d) return d; } }
  return null;
}
function shapeDefect(op) {
  for (const k of ENVELOPE) if (op[k] === undefined) return "missing " + k;
  if (KINDS.indexOf(op.kind) < 0) return "kind outside the model";
  if (CLASSES.indexOf(op.class) < 0) return "class outside the model";
  const e = op.effective; if (!e || typeof e !== "object" || !e.local_date || !e.local_time || !/^[+-]\d\d:\d\d$/.test(e.utc_offset || "")) return "effective needs local_date, local_time and utc_offset";
  if (TARGET_REQUIRED.has(op.kind) ? !op.target_op_id : op.target_op_id !== undefined) return "target_op_id " + (TARGET_REQUIRED.has(op.kind) ? "required" : "forbidden");
  if (!Number.isInteger(op.device_seq) || op.device_seq < 1) return "device_seq";
  if (!Array.isArray(op.causal_parents)) return "causal_parents";
  if (!PLAN_KINDS.has(op.kind)) { const d = quantityDefect(op.payload); if (d) return "payload " + d; }
  if (op.kind === "fact") {
    const req = PAYLOAD_REQUIRED[op.class]; if (req) for (const f of req) if (!op.payload || op.payload[f] === undefined) return "payload incomplete: " + op.class + " needs " + f;
    if (op.class === "setup-note" && !(op.payload && typeof op.payload.text === "string" && op.payload.text.trim())) return "setup-note text empty";
    if (op.class === "body-composition-source") { const p = op.payload; if (!isQty(p.low) || !isQty(p.high)) return "body-composition endpoints"; if (p.point !== undefined && !(isQty(p.point) && p.low.value <= p.point.value && p.point.value <= p.high.value)) return "central estimate outside endpoints"; }
  }
  if (op.kind === "plan-mutation") { for (const k of ["conflict_domain_id", "conflict_domain_lineage_id", "requested_transaction_id", "members", "seen_plan_basis", "member_set_commitment"]) if (op[k] === undefined) return "plan-mutation missing " + k; if (!Array.isArray(op.members) || !op.members.length || op.members.some((m) => !m || typeof m.field !== "string" || !isNum(m.value) || !["athlete_edited", "inherited"].includes(m.provenance))) return "plan-mutation members"; }
  if (op.kind === "conflict-selection") for (const k of ["conflict_domain_id", "conflict_domain_lineage_id", "requested_transaction_id", "seen_conflict_basis", "chosen_alternative_commitment"]) if (op[k] === undefined || op[k] === null) return "conflict-selection missing " + k;
  if (op.kind === "undo-request") for (const k of ["target_plan_transaction_id", "seen_plan_basis", "target_effect_digest", "compensating_group_commitment"]) if (op[k] === undefined || op[k] === null) return "undo-request missing " + k;
  if (op.kind === "correction" && !(op.payload && op.payload.replacement_fields && typeof op.payload.replacement_fields === "object" && Object.keys(op.payload.replacement_fields).length)) return "correction needs replacement_fields";
  if (op.kind === "tombstone" && !(op.payload && typeof op.payload.reason === "string" && op.payload.reason)) return "tombstone needs a reason";
  if (op.kind === "reclassification" && !(op.payload && typeof op.payload.replacement_class === "string")) return "reclassification needs replacement_class";
  return null;
}
function make(ctx) {
  const { key, crypto, clock, log, plan, issue } = ctx;
  const now = () => clock.now();
  const slotRow = (A, slotKey) => rowKey(A, slotKey); const opRow = (A, id) => rowKey(A, id); const devRow = (A, dev) => rowKey(A, dev);
  const history = (t, A, slotKey) => t.get("slots", slotRow(A, slotKey)) || [];
  const known = (t, A, id) => t.get("ops", opRow(A, id)) || null;
  const current = (t, A, id) => { const k = known(t, A, id); if (!k) return null; const h = history(t, A, k.slotKey); return h.length ? h[h.length - 1] : null; };
  const base = (op) => ({ op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, device_id: op.device_id, device_seq: op.device_seq });
  const sign = (d) => crypto.signDisposition(key, d);
  /* durable record of a disposition: slot history (append-only), the op row, per-athlete ownership of the op_id */
  function record(t, A, op, d, slotKey) {
    const sk = slotKey || (op.device_id + ":" + op.device_seq);
    const h = history(t, A, sk); h.push(d); t.put("slots", slotRow(A, sk), h);
    t.put("ops", opRow(A, op.op_id), { op, commitment: op.canonical_content_commitment, slotKey: sk });
    const owners = t.get("owners", op.op_id) || []; if (!owners.includes(A)) { owners.push(A); t.put("owners", op.op_id, owners); }
    return d;
  }
  function reject(t, A, op, code) {
    const sk = op.device_id + ":" + op.device_seq; const occupied = history(t, A, sk).some((d) => d.op_id !== op.op_id);
    return record(t, A, op, sign({ ...base(op), status: "REJECTED", rejection_code: code, decided_at: now() }), occupied ? "op:" + op.op_id : undefined);
  }
  const dependencyRejected = (t, A, op) => record(t, A, op, sign({ ...base(op), status: "REJECTED_DEPENDENCY", rejection_code: "REJECTED_DEPENDENCY", decided_at: now() }));
  const refsOf = (op) => (op.causal_parents || []).concat(op.target_op_id ? [op.target_op_id] : []);
  const terminalRejected = (d) => !!d && (d.status === "REJECTED" || d.status === "REJECTED_DEPENDENCY");
  function park(t, A, op) { const c = t.get("meta", rowKey(A, "wait")) || { n: 0 }; c.n += 1; t.put("meta", rowKey(A, "wait"), c); t.put("waiting", rowKey(A, pad(c.n)), op); }
  function admit(t, A, op, meta) {
    if (!t.get("athletes", A)) throw new Error("unknown athlete " + A);
    if (!op || typeof op !== "object" || typeof op.op_id !== "string") throw new Error("admit(): an operation with an op_id");
    const k = known(t, A, op.op_id);
    if (k) { if (k.commitment === op.canonical_content_commitment) return current(t, A, op.op_id); return sign({ ...base(op), status: "REJECTED", rejection_code: "IDENTITY_COLLISION", decided_at: now() }); }
    if (op.athlete_id !== A) return reject(t, A, op, "MALFORMED");
    if (shapeDefect(op)) return reject(t, A, op, "MALFORMED");
    const idKey = ctx.identityKeyFor(A); if (idKey && crypto.commitmentOf(op, idKey) !== op.canonical_content_commitment) return reject(t, A, op, "MALFORMED");
    const dev = t.get("devices", devRow(A, op.device_id)); const lease = dev && dev.lease;
    if (!lease || lease.lease_id !== op.lease_id) return reject(t, A, op, "LEASE_UNKNOWN");
    /* binding checked here: signature + device. The lease→athlete binding is enforced on the device (committer.cjs) and
       NOT at admission — the suite's fixture leases for the second athlete's device name the first athlete (see REPORT §6) */
    if (!crypto.verifyLease(key, lease) || lease.device_id !== op.device_id) return reject(t, A, op, "LEASE_FORGED");
    const rv = t.get("revoked", devRow(A, op.device_id)); if (rv && op.device_seq > rv.barrier) return reject(t, A, op, "LEASE_REVOKED_BEYOND_BARRIER");
    if (!Array.isArray(lease.range) || op.device_seq < lease.range[0] || op.device_seq > lease.range[1]) return reject(t, A, op, "DEVICE_SEQ_OUT_OF_RANGE");
    void meta;   /* received_at is informational: a leased op arriving after not_after is never rejected for that */
    if (history(t, A, op.device_id + ":" + op.device_seq).some((d) => d.op_id !== op.op_id)) return reject(t, A, op, "DEVICE_SEQ_REUSE");
    for (const r of refsOf(op)) {
      const owners = t.get("owners", r) || []; if (owners.length && !owners.includes(A)) return reject(t, A, op, "CROSS_ATHLETE_REFERENCE");
      const cur = current(t, A, r);
      if (terminalRejected(cur)) return dependencyRejected(t, A, op);
      if (!cur || cur.status === "WAITING") { const w = record(t, A, op, sign({ ...base(op), status: "WAITING", decided_at: now() })); park(t, A, op); return w; }
    }
    if (op.kind === "reclassification") {
      const target = known(t, A, op.target_op_id); const from = target && target.op.class; const to = op.payload.replacement_class;
      const compatible = (COMPATIBLE_RECLASS[from] || []).includes(to);
      if (!compatible && !(op.payload.destination_payload && !quantityDefect(op.payload.destination_payload) && op.payload.destination_effective)) return reject(t, A, op, "MALFORMED");
    }
    return accept(t, A, op);
  }
  function accept(t, A, op) {
    const seqNo = log.frontier(t, A) + 1;
    let extra = {};
    if (op.kind === "plan-mutation") { const r = plan.mutation(t, A, op, seqNo); if (r.reject) return reject(t, A, op, r.reject); }
    else if (op.kind === "conflict-selection") { const r = plan.selection(t, A, op, seqNo); if (r.reject) return reject(t, A, op, r.reject); extra = r.disposition; }
    else if (op.kind === "undo-request") extra = plan.undo(t, A, op, seqNo);
    else if (op.kind === "proposal-response") extra = issue.respond(t, A, op, seqNo);
    log.nextSeq(t, A);
    const at = now();
    const d = record(t, A, op, sign({ ...base(op), status: "ACCEPTED", athlete_log_seq: seqNo, decided_at: at, ...extra }));
    log.appendEntry(t, A, { seq: seqNo, type: "op", op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, accepted_at: at });
    const la = t.get("last_accepted", devRow(A, op.device_id)) || { seq: 0 }; if (op.device_seq > la.seq) t.put("last_accepted", devRow(A, op.device_id), { seq: op.device_seq });
    release(t, A);
    return d;
  }
  /* every parked op whose references are all decided is released, in parking order, until none is ready */
  function release(t, A) {
    const pre = rowPrefix(A);
    for (;;) {
      let released = false;
      for (const k of t.keys("waiting").filter((x) => x.startsWith(pre))) {
        const w = t.get("waiting", k); if (!w) continue;
        const refs = refsOf(w); const decided = refs.map((r) => current(t, A, r));
        if (!decided.every((d) => d && d.status !== "WAITING")) continue;
        t.del("waiting", k);
        if (decided.some(terminalRejected)) dependencyRejected(t, A, w); else accept(t, A, w);
        released = true; break;
      }
      if (!released) return;
    }
  }
  function revokeDevice(t, A, dev) {
    const la = t.get("last_accepted", devRow(A, dev)) || { seq: 0 }; const barrier = la.seq;
    t.put("revoked", devRow(A, dev), { barrier, at: now() });
    return { barrier, declared_loss: true, copy: "This phone was removed from your account — unsynced entries on this phone will be lost." };
  }
  const disposition = (t, A, dev, seq) => { const h = history(t, A, dev + ":" + seq); return h.length ? h[h.length - 1] : null; };
  const dispositionHistory = (t, A, dev, seq) => history(t, A, dev + ":" + seq).slice();
  return { admit, revokeDevice, disposition, dispositionHistory, shapeDefect, CODES, KINDS, CLASSES, TARGET_REQUIRED };
}
module.exports = { make, shapeDefect, CODES, KINDS, CLASSES, TARGET_REQUIRED };
