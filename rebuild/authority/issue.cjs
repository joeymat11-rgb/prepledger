"use strict";
/* issue.cjs — state 8: proposal ISSUANCE, INSTANCE identity, responses, the A6 COVERAGE check and APPLY results.
     · instance identity = hash(family, generation, offer digest): two devices issued the same offer share ONE instance
     · a proposal-response operation (admitted by admit.cjs) is recorded against its issuance's instance
     · apply(request): idempotent by apply_request_id; PAUSED_COVERAGE while any OTHER operation was accepted after the
       instance's confirmed basis; contradictory answers suspend the instance's effect (state 5); one successful plan
       effect per instance (EXISTING_TRANSACTION on a second answer); Keep / No settle with no effect */
const { rowKey } = require("./store.cjs");
const unwrap = (v) => (v && typeof v === "object" && "value" in v ? v.value : v);
function make(ctx) {
  const { key, crypto } = ctx;
  const issRow = (A, id) => rowKey(A, id); const instRow = (A, inst) => rowKey(A, inst);
  function issue(t, A, iss) {
    if (!iss || typeof iss.issuance_id !== "string") throw new Error("issue(): an issuance with an issuance_id");
    const instance = crypto.instanceId(key, iss);
    t.put("issuances", issRow(A, iss.issuance_id), { ...iss, instance, accepted_at_seq: ctx.log.frontier(t, A) });
    const inst = t.get("instances", instRow(A, instance)) || { instance, issuances: [], responses: [], effect: null, basisConfirmedThrough: iss.computed_through_watermark || 0, superseded: false };
    inst.issuances.push(iss.issuance_id); t.put("instances", instRow(A, instance), inst);
    return { instance, accepted: true };
  }
  /* a proposal-response operation → the disposition extension */
  function respond(t, A, op, seqNo) {
    const p = op.payload || {}; const iss = t.get("issuances", issRow(A, String(unwrap(p.issuance_id))));
    if (!iss) return { applied: false, reason_code: "UNKNOWN_ISSUANCE" };
    const inst = t.get("instances", instRow(A, iss.instance));
    inst.responses.push({ op_id: op.op_id, outcome: unwrap(p.chosen_outcome_id), consent_digest: unwrap(p.consent_digest), seq: seqNo }); t.put("instances", instRow(A, iss.instance), inst);
    return { instance: iss.instance };
  }
  function apply(t, A, req) {
    if (!req || typeof req.apply_request_id !== "string") throw new Error("apply(): an apply_request_id");
    const prior = t.get("applies", rowKey(A, req.apply_request_id)); if (prior) return prior;
    const W = () => ctx.log.frontier(t, A);
    const resp = ctx.log.logOps(t, A).find((o) => o.op_id === req.response_op_id);
    const iss = resp && resp.payload ? t.get("issuances", issRow(A, String(unwrap(resp.payload.issuance_id)))) : null;
    let result;
    if (!iss) result = { status: "non_applied", reason_code: "UNKNOWN_RESPONSE", evaluated_through_W: W() };
    else {
      const inst = t.get("instances", instRow(A, iss.instance)); const decisionOps = new Set(inst.responses.map((r) => r.op_id));
      const others = ctx.log.entries(t, A).filter((e) => e.type === "op" && e.seq > inst.basisConfirmedThrough && !decisionOps.has(e.op_id)).map((e) => ctx.log.logOps(t, A).find((o) => o.op_id === e.op_id)).filter((o) => o && o.kind !== "proposal-response");
      if (others.length) result = { status: "non_applied", reason_code: "PAUSED_COVERAGE", paused: true, evaluated_through_W: W(), copy: "Your answer from earlier couldn't be applied yet — new entries arrived first. Here is the current picture." };
      else {
        const outcomes = new Set(inst.responses.map((r) => r.outcome));
        if (outcomes.size > 1) { if (inst.effect) ctx.plan.suspend(t, A, inst.effect); result = { status: "conflict_suspended", reason_code: "CONTRADICTORY_RESPONSES", evaluated_through_W: W() }; }
        else if (inst.effect) result = { status: "effective", reason_code: "EXISTING_TRANSACTION", plan_transaction_id: inst.effect, evaluated_through_W: W() };
        else { const outcome = outcomes.values().next().value;
          if (outcome === "KEEP" || outcome === "NO") result = { status: "decision_settled_no_effect", reason_code: "KEEP_OR_NO", evaluated_through_W: W() };
          else { const seqNo = ctx.log.nextSeq(t, A); const txn = ctx.plan.consented(t, A, iss, req.response_op_id, seqNo); ctx.log.appendEntry(t, A, { seq: seqNo, type: "effect", txn_id: txn.txn_id, accepted_at: ctx.clock.now() }); inst.effect = txn.txn_id; t.put("instances", instRow(A, iss.instance), inst); result = { status: "effective", reason_code: "APPLIED", plan_transaction_id: txn.txn_id, evaluated_through_W: W() }; }
        }
      }
    }
    t.put("applies", rowKey(A, req.apply_request_id), result); return result;
  }
  function confirmBasis(t, A, instance, recomputedUnchanged) {
    const inst = t.get("instances", instRow(A, instance)); if (!inst) return null;
    if (recomputedUnchanged) { inst.basisConfirmedThrough = ctx.log.frontier(t, A); t.put("instances", instRow(A, instance), inst); return { confirmed: true, through: inst.basisConfirmedThrough }; }
    inst.superseded = true; t.put("instances", instRow(A, instance), inst); return { confirmed: false, reissue: true, oldAnswerNonApplied: true };
  }
  const instanceOf = (t, A, issuanceId) => { const iss = t.get("issuances", issRow(A, issuanceId)); return iss ? iss.instance : undefined; };
  const instanceState = (t, A, instance) => t.get("instances", instRow(A, instance)) || undefined;
  return { issue, respond, apply, confirmBasis, instanceOf, instanceState };
}
module.exports = { make };
