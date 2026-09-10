"use strict";
// Static pure read-side declarations copied from accepted authority/plan.cjs.
// Source-equivalence test pins this closure; no authority signer/writer import.
module.exports = function createRecoveryPlanReader({hmac, canonicalEncode}) {
const digest = value => hmac("effect", canonicalEncode(value));
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

return { plan, planState, planTransactions };
};
