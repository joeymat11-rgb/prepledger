"use strict";
const { hmac } = require("./crypto.cjs");
const { canonicalEncode } = require("./canonical.cjs");

const digest = value => hmac("effect", canonicalEncode(value));
const groupDigest = value => hmac("group", canonicalEncode(value));
const basis = (domain, maxima) => hmac("basis", canonicalEncode({ d: domain, maxima: [...maxima].sort() }));
const setField = (object, field, value) => Object.defineProperty(object, field, { value, enumerable: true, writable: true, configurable: true });
const fields = members => Object.fromEntries(members.map(member => [member.field, member.value]));

function compareKeys(left, right) {
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1;
  }
  return left.length - right.length;
}

function planTransactions(tx) {
  return tx.scan("transactions").map(row => row.value).sort((a, b) => a.seq - b.seq || a.ordinal - b.ordinal);
}

// All graph identities are row keys. Causal ancestry never uses device sequence,
// predecessor, effective time, or references to mutable JavaScript objects.
function ancestry(ids, byOp) {
  const seen = new Set(), pending = [...ids];
  while (pending.length) {
    const id = pending.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    const row = byOp.get(id);
    if (row) pending.push(...row.parents);
  }
  return seen;
}

function causalPlanParents(tx, domain, parentIds, transactions) {
  const rows = new Map(transactions.map(row => [row.op_id, row]));
  const operations = new Map(tx.scan("log").map(row => [row.value.op.op_id, row.value.op]));
  const visited = new Set(), candidates = new Set(), pending = [...parentIds];
  while (pending.length) {
    const id = pending.pop();
    if (visited.has(id)) continue;
    visited.add(id);
    const transaction = rows.get(id);
    if (transaction && transaction.domain === domain) { candidates.add(id); continue; }
    const operation = operations.get(id);
    if (operation) pending.push(...operation.causal_parents);
    if (transaction) pending.push(...transaction.parents);
  }
  // Redundant explicit parents cannot turn an older ancestor into a maximum.
  const strictAncestors = new Set();
  for (const id of candidates) for (const ancestor of ancestry(rows.get(id).parents, rows)) strictAncestors.add(ancestor);
  return [...candidates].filter(id => !strictAncestors.has(id)).sort();
}

function projection(tx, extra = []) {
  const rows = [...planTransactions(tx), ...extra].sort((a, b) => a.seq - b.seq || a.ordinal - b.ordinal);
  const domains = new Map(), byOp = new Map(), blocked = new Set();
  const result = { ...tx.get("metadata", "state").initialPlan };
  for (const row of rows) {
    byOp.set(row.op_id, row);
    const inheritsSuspension = row.members.some(member => member.provenance === "inherited") &&
      [...ancestry(row.parents, byOp)].some(id => blocked.has(id));
    if (tx.get("suspensions", row.txn_id) || inheritsSuspension) blocked.add(row.op_id);
    let domain = domains.get(row.domain);
    if (!domain) {
      domain = { lineage: row.lineage, rows: [], maxima: new Set(), effective: null, fallback: {} };
      domains.set(row.domain, domain);
    }
    domain.rows.push(row);
    for (const ancestor of ancestry(row.parents, byOp)) domain.maxima.delete(ancestor);
    domain.maxima.add(row.op_id);
    const eligible = domain.rows.filter(candidate => domain.maxima.has(candidate.op_id) && !blocked.has(candidate.op_id));
    eligible.sort((a, b) => compareKeys(a.lineage_key, b.lineage_key));
    domain.effective = eligible[0] || null;
    if (domain.effective) {
      domain.fallback = fields(domain.effective.members);
      for (const member of domain.effective.members) setField(result, member.field, member.value);
      for (const field of domain.effective.removed_fields || []) delete result[field];
    }
  }
  return { rows, domains, plan: result, blocked };
}

const plan = tx => projection(tx).plan;
function domainValue(domain) { return domain ? (domain.effective ? fields(domain.effective.members) : domain.fallback) : {}; }
const planOfDomain = (tx, domain) => domainValue(projection(tx).domains.get(domain));

function conflictCopy(domain, withAlternatives) {
  const count = domain.maxima.size, values = domain.effective ? domain.effective.members.map(member => member.value) : [];
  const copy = `Earned found ${count} current versions of this plan. It is using ${JSON.stringify(values)} for now.`;
  return withAlternatives ? copy + ` ${count - 1} alternative${count === 2 ? " is" : "s are"} in History.` : copy;
}

function planState(tx, id) {
  const view = projection(tx), domain = view.domains.get(id);
  if (!domain) return { effective: null, maxima: [], basis: basis(id, []), alternatives: [], lineageKeys: {}, effectDigest: digest({}), memberSetCommitments: {}, copy: null };
  const maxima = [...domain.maxima].sort(), effective = domain.effective && domain.effective.op_id;
  return {
    effective, maxima, basis: basis(id, maxima), alternatives: maxima.filter(opId => opId !== effective),
    lineageKeys: Object.fromEntries(domain.rows.filter(row => domain.maxima.has(row.op_id)).map(row => [row.op_id, row.lineage_key])),
    effectDigest: digest(domainValue(domain)),
    memberSetCommitments: Object.fromEntries(domain.rows.map(row => [row.op_id, row.member_set_commitment])),
    copy: maxima.length > 1 ? conflictCopy(domain, true) : null,
  };
}

function append(tx, detail, view = projection(tx)) {
  const parentRows = view.rows.filter(row => row.domain === detail.domain && detail.parents.includes(row.op_id));
  parentRows.sort((a, b) => compareKeys(a.lineage_key, b.lineage_key));
  const row = {
    ...detail, members: detail.members.map(member => ({ ...member })), parents: [...detail.parents],
    before: view.plan, ordinal: view.rows.length + 1,
    lineage_key: parentRows.length ? [...parentRows[0].lineage_key, detail.seq] : [detail.seq],
  };
  row.after_digest = digest(domainValue(projection(tx, [row]).domains.get(row.domain)));
  tx.insert("transactions", row.txn_id, row);
  return row;
}

function admitPlan(tx, op, seq) {
  const view = projection(tx);
  if (op.kind === "undo-request") return undo(tx, op, seq, view);
  if (!["plan-mutation", "conflict-selection"].includes(op.kind)) return {};
  const domain = view.domains.get(op.conflict_domain_id);
  if (domain && domain.lineage !== op.conflict_domain_lineage_id) return { rejection_code: "LINEAGE_MISMATCH" };
  if (tx.get("transactions", op.requested_transaction_id)) return { rejection_code: "MALFORMED" };
  const detail = {
    txn_id: op.requested_transaction_id, op_id: op.op_id, seq, domain: op.conflict_domain_id,
    lineage: op.conflict_domain_lineage_id, kind: op.kind,
  };
  if (op.kind === "plan-mutation") {
    append(tx, { ...detail, members: op.members, member_set_commitment: op.member_set_commitment,
      parents: causalPlanParents(tx, detail.domain, op.causal_parents, view.rows),
      provenance: op.members.every(member => member.provenance === "athlete_edited") ? "authored" : "inherited" }, view);
    return {};
  }
  if (!domain) return { rejection_code: "MALFORMED" };
  // Search only current maxima: two equal member groups can occur at different
  // points in a lineage, and a matching historical group cannot authorize a CAS.
  const chosen = domain.rows.find(row => domain.maxima.has(row.op_id) && row.member_set_commitment === op.chosen_alternative_commitment);
  if (!chosen) return { rejection_code: "MALFORMED" };
  if (op.seen_conflict_basis !== basis(detail.domain, domain.maxima)) return {
    applied: false, reason_code: "BASIS_STALE", copy: conflictCopy(domain, false),
  };
  const row = append(tx, { ...detail, members: chosen.members, member_set_commitment: chosen.member_set_commitment,
    parents: [...domain.maxima].sort(), provenance: "resolved" }, view);
  return { applied: true, plan_transaction_id: row.txn_id };
}

function undo(tx, op, seq, view) {
  const target = tx.get("transactions", op.target_plan_transaction_id);
  if (!target) return { applied: false, reason_code: "TARGET_UNKNOWN" };
  const domain = view.domains.get(target.domain);
  const eligible = domain.maxima.size === 1 && domain.maxima.has(target.op_id) && !view.blocked.has(target.op_id) &&
    target.after_digest === digest(domainValue(domain)) && op.target_effect_digest === target.after_digest &&
    op.compensating_group_commitment === groupDigest(target.before) && !tx.get("undo", target.txn_id);
  if (!eligible) return { applied: false, reason_code: "PLAN_CHANGED_FIRST",
    copy: "Undo couldn't be applied — the plan changed first: " + Object.entries(domainValue(domain)).map(([field, value]) => value + " " + field).join(", ") + " is in effect." };
  const row = append(tx, {
    txn_id: "comp-" + op.op_id, op_id: op.op_id, seq, domain: target.domain, lineage: target.lineage,
    members: target.members.filter(member => Object.prototype.hasOwnProperty.call(target.before, member.field))
      .map(member => ({ field: member.field, value: target.before[member.field], provenance: "inherited" })),
    removed_fields: target.members.filter(member => !Object.prototype.hasOwnProperty.call(target.before, member.field)).map(member => member.field),
    member_set_commitment: groupDigest(target.before), parents: [target.op_id], kind: "compensation",
    references: { request: op.op_id, target: target.txn_id }, provenance: "authored",
  }, view);
  tx.insert("undo", target.txn_id, { request: op.op_id, transaction: row.txn_id });
  return { applied: true, plan_transaction_id: row.txn_id, compensation_of: target.txn_id };
}

function txnDigests(tx, id) {
  const row = tx.get("transactions", id);
  return row ? { after: row.after_digest, beforeGroupCommitment: groupDigest(row.before) } : null;
}

function appendConsented(tx, request, members, parents) {
  const id = "txn-apply-" + request.instance, existing = tx.get("transactions", id);
  if (existing) return existing;
  const view = projection(tx), domainId = request.domain || "protein", domain = view.domains.get(domainId);
  return append(tx, {
    txn_id: id, op_id: request.response_op_id, seq: request.seq == null ? tx.get("metadata", "state").seq : request.seq,
    domain: domainId, lineage: request.lineage || (domain && domain.lineage) || "lin-protein-1",
    members: members || request.members || [{ field: "protein_g", value: 160, provenance: "inherited" }],
    member_set_commitment: hmac("m", canonicalEncode(members || request.members || [])),
    parents: parents || (domain ? [...domain.maxima].sort() : []),
    kind: "consented", provenance: "consented", instance: request.instance,
  }, view);
}

function suspend(tx, txnId) {
  if (tx.get("transactions", txnId) && !tx.get("suspensions", txnId)) tx.insert("suspensions", txnId, { suspended: true });
}

module.exports = { admitPlan, plan, planTransactions, planState, planOfDomain, txnDigests, appendConsented, suspend, compareKeys };
