"use strict";

const { encode } = require("./canonical.cjs");
const { hmac } = require("./crypto.cjs");
const Plan = require("./plan.cjs");
const { receipts, frontier } = require("./reduce.cjs");
const scalar = value => value && typeof value === "object" && Object.hasOwn(value, "value") ? value.value : value;
const OUTCOMES = new Set(["APPLY", "KEEP", "NO"]);
function issuanceContent(issuance) {
  const { issuance_id, ...content } = issuance;
  return encode(content);
}

function deriveInstance(issuance) {
  return "inst-" + hmac("instance", encode({
    f: issuance.proposal_family_id, g: issuance.evidence_generation, o: issuance.offer_digest,
  }));
}

function issue(tx, issuance) {
  const W = issuance && issuance.computed_through_watermark, currentW = frontier(tx);
  if (!Number.isSafeInteger(W) || W < 0 || W > currentW)
    return { accepted: false, reason_code: "INVALID_WATERMARK" };
  const previous = tx.get("issuances", issuance.issuance_id);
  if (previous) {
    const { instance, accepted_at_seq, ...content } = previous;
    return encode(content) === encode(issuance)
      ? { instance, accepted: true }
      : { accepted: false, reason_code: "ISSUANCE_COLLISION" };
  }
  const instance = deriveInstance(issuance);
  const record = { ...issuance, instance, accepted_at_seq: currentW };
  const current = tx.get("instances", instance);
  if (current && current.issuanceContent !== issuanceContent(issuance))
    return { accepted: false, reason_code: "INSTANCE_COLLISION" };
  const state = current || {
    issuances: [], effect: null, apply: null,
    basisConfirmedThrough: issuance.computed_through_watermark,
    issuanceContent: issuanceContent(issuance),
  };
  state.issuances.push(issuance.issuance_id);
  tx.insert("issuances", issuance.issuance_id, record);
  tx.put("instances", instance, state);
  return { instance, accepted: true };
}

// Responses are derived from accepted operation rows. Admission and response
// visibility therefore share one transaction, with no mutable object registry.
// A later issuance cannot retroactively authorize an earlier unknown response.
function responses(tx, instance, entries = receipts(tx)) {
  return entries.flatMap(({ op, seq }) => {
    if (op.kind !== "proposal-response" || !op.payload) return [];
    const issuance = tx.get("issuances", scalar(op.payload.issuance_id));
    return issuance && seq > issuance.accepted_at_seq && issuance.instance === instance ? [{
      op_id: op.op_id, outcome: scalar(op.payload.chosen_outcome_id),
      consent_digest: scalar(op.payload.consent_digest), seq,
    }] : [];
  });
}

function maximalResponses(answers, entries) {
  const byId = new Map(entries.map(row => [row.op.op_id, row.op]));
  const superseded = new Set();
  for (const answer of answers) {
    const pending = [...(byId.get(answer.op_id).causal_parents || [])], visited = new Set();
    while (pending.length) {
      const id = pending.pop();
      if (visited.has(id)) continue;
      visited.add(id); superseded.add(id);
      const op = byId.get(id);
      if (op) pending.push(...(op.causal_parents || []));
    }
  }
  return answers.filter(answer => !superseded.has(answer.op_id));
}

// Called inside the admission transaction after its log append. A contradictory
// decision and suspension become visible together, including before any retry.
function acceptedResponse(tx, op) {
  if (op.kind !== "proposal-response" || !op.payload) return {};
  const issuance = tx.get("issuances", scalar(op.payload.issuance_id));
  if (!issuance) return { applied: false, reason_code: "UNKNOWN_ISSUANCE" };
  const state = tx.get("instances", issuance.instance);
  const entries = receipts(tx), answers = responses(tx, issuance.instance, entries);
  const outcomes = new Set(maximalResponses(answers, entries).map(answer => answer.outcome));
  if (state.effect && outcomes.size > 1) Plan.suspend(tx, state.effect);
  return { instance: issuance.instance };
}

function apply(tx, request) {
  const existing = tx.get("applies", request.apply_request_id);
  // Preserve the stored result and effect identity. The lost-reply exception
  // overlays current suspension/supersession so an old success cannot paint an
  // effect that no longer governs; an unchanged instance replays byte-for-byte.
  if (existing) {
    const current = existing.instance && existing.result.status === "effective" && instanceState(tx, existing.instance);
    if (current && ["conflict_suspended", "terminally_superseded"].includes(current.status)) return {
      status: current.status,
      reason_code: current.status === "conflict_suspended" ? "CONTRADICTORY_RESPONSES" : "BASIS_CHANGED",
      evaluated_through_W: current.evaluated_through_W,
    };
    return existing.result;
  }
  const entries = receipts(tx), W = frontier(tx);
  const response = entries.find(row => row.op.op_id === request.response_op_id);
  const issuance = response && response.op.kind === "proposal-response"
    && tx.get("issuances", scalar(response.op.payload.issuance_id));
  if (!issuance || !(response.seq > issuance.accepted_at_seq)) {
    const result = { status: "non_applied", reason_code: "UNKNOWN_RESPONSE", evaluated_through_W: W };
    tx.insert("applies", request.apply_request_id, { request, result });
    return result;
  }
  const instance = issuance.instance, state = tx.get("instances", instance);
  const answers = responses(tx, instance, entries);
  const outcomes = new Set(maximalResponses(answers, entries).map(answer => answer.outcome));
  let result;
  if ([...outcomes].some(outcome => !OUTCOMES.has(outcome)) || !outcomes.size) {
    result = { status: "non_applied", reason_code: "UNKNOWN_OUTCOME", evaluated_through_W: W };
  } else if (outcomes.size > 1 || state.effect && tx.get("suspensions", state.effect)) {
    if (state.effect) Plan.suspend(tx, state.effect);
    result = { status: "conflict_suspended", reason_code: "CONTRADICTORY_RESPONSES", evaluated_through_W: W };
  } else if (state.superseded) {
    result = { status: "terminally_superseded", reason_code: "BASIS_CHANGED", evaluated_through_W: W };
  } else {
    const ownDecisions = new Set(answers.map(answer => answer.op_id));
    const uncovered = entries.some(row => row.seq > state.basisConfirmedThrough && !ownDecisions.has(row.op.op_id));
    if (uncovered) {
      result = { status: "non_applied", reason_code: "PAUSED_COVERAGE", paused: true, evaluated_through_W: W,
        copy: "Your answer from earlier couldn't be applied yet — new entries arrived first. Here is the current picture." };
    } else if (state.effect) {
      result = { status: "effective", reason_code: "EXISTING_TRANSACTION", plan_transaction_id: state.effect, evaluated_through_W: W };
    } else if (outcomes.has("KEEP") || outcomes.has("NO")) {
      result = { status: "decision_settled_no_effect", reason_code: "KEEP_OR_NO", evaluated_through_W: W };
    } else {
      const transaction = Plan.appendConsented(tx, {
        instance, response_op_id: request.response_op_id, seq: tx.get("metadata", "state").seq,
        domain: issuance.conflict_domain_id || "protein", lineage: issuance.conflict_domain_lineage_id || "lin-protein-1",
      }, issuance.apply_members || []);
      state.effect = transaction.txn_id;
      result = { status: "effective", reason_code: "APPLIED", plan_transaction_id: transaction.txn_id, evaluated_through_W: W };
    }
  }
  state.apply = request.apply_request_id;
  tx.put("instances", instance, state);
  tx.insert("applies", request.apply_request_id, { request, instance, result });
  return result;
}

function confirmBasis(tx, instance, recomputedUnchanged) {
  const state = tx.get("instances", instance);
  if (!state) return null;
  if (recomputedUnchanged) {
    state.basisConfirmedThrough = frontier(tx);
    tx.put("instances", instance, state);
    return { confirmed: true, through: state.basisConfirmedThrough };
  }
  state.superseded = true;
  tx.put("instances", instance, state);
  return { confirmed: false, reissue: true, oldAnswerNonApplied: true };
}

function instanceOf(tx, issuanceId) { return (tx.get("issuances", issuanceId) || {}).instance; }
function instanceState(tx, instance) {
  const state = tx.get("instances", instance);
  if (!state) return state;
  const entries = receipts(tx), answers = responses(tx, instance, entries);
  const outcomes = new Set(maximalResponses(answers, entries).map(answer => answer.outcome));
  const status = state.superseded ? "terminally_superseded"
    : outcomes.size > 1 || state.effect && tx.get("suspensions", state.effect) ? "conflict_suspended"
    : [...outcomes].some(outcome => !OUTCOMES.has(outcome)) ? "non_applied" : state.effect ? "effective"
    : outcomes.has("KEEP") || outcomes.has("NO") ? "decision_settled_no_effect" : "non_applied";
  return { ...state, responses: answers, status, evaluated_through_W: frontier(tx) };
}

module.exports = { issue, apply, confirmBasis, instanceOf, instanceState, deriveInstance, acceptedResponse };
