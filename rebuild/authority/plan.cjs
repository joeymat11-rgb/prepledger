"use strict";
/* plan.cjs — A5 plan transactions and state 4 concurrency.
     · exactly ONE plan transaction per accepted direct edit, written in the SAME store transaction as the admission
       (admit.cjs opens it; a failure anywhere leaves both or neither — A5 crash law)
     · concurrent edits are BOTH retained: the domain keeps its causal-maximal set; the effective one is the smallest
       lineage key K_g = min_lex over the parents' keys ++ [athlete_log_seq], compared as NUMERIC vectors ([2] beats [10])
     · conflict-selection commits ONE transaction by compare-and-append on seen_conflict_basis: a stale basis is retained
       as non-applied History (BASIS_STALE), never silently added as a parent; the chosen alternative must be a maximum
     · undo is eligible only while the target is the unique unsuspended maximum with an unchanged effect digest and a
       matching compensating-group commitment; then ONE compensation is appended, otherwise the request is retained with
       the governing-plan copy
   Every function takes the transaction handle t and the athlete id A; nothing is cached outside the store. */
const { rowKey, rowPrefix, pad } = require("./store.cjs");
const DEFAULT_PLAN = { protein_g: 150, steps: 8000 };
/* lexicographic order over NUMERIC vectors (state 4, sheet 369–372) */
function cmpKey(a, b) { const n = Math.max(a.length, b.length); for (let i = 0; i < n; i++) { if (a[i] === undefined) return -1; if (b[i] === undefined) return 1; if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1; } return 0; }
const copyMembers = (ms) => ms.map((m) => ({ ...m }));
function make(ctx) {
  const { key, crypto } = ctx;
  const domRow = (A, d) => rowKey(A, d);
  const domainOf = (t, A, d) => t.get("domains", domRow(A, d)) || null;
  const putDomain = (t, A, d, dom) => t.put("domains", domRow(A, d), dom);
  const newDomain = (lineage) => ({ lineage, maxima: [], txns: [], effective: null });
  const planOf = (t, A) => ({ ...(t.get("plan", A) || DEFAULT_PLAN) });
  const isSuspended = (t, A, txnId) => !!t.get("suspended", rowKey(A, txnId));
  function allTxns(t, A) { const pre = rowPrefix(A); return t.keys("plan_txns").filter((k) => k.startsWith(pre)).map((k) => t.get("plan_txns", k)); }
  function domTxns(t, A, dom) { return dom.txns.map((k) => t.get("plan_txns", k)).filter(Boolean); }
  function appendTxn(t, A, txn) { const c = t.get("meta", rowKey(A, "txn")) || { n: 0 }; c.n += 1; t.put("meta", rowKey(A, "txn"), c); const k = rowKey(A, pad(c.n)); txn.row = k; t.put("plan_txns", k, txn); return k; }
  const saveTxn = (t, txn) => t.put("plan_txns", txn.row, txn);
  function planOfDomain(t, A, domId) { const dom = domainOf(t, A, domId); const p = {}; if (!dom || !dom.effective) return p; const eff = domTxns(t, A, dom).find((x) => x.op_id === dom.effective); if (eff) for (const m of eff.members) p[m.field] = m.value; return p; }
  function lineageKey(t, A, dom, parents, seq) { const ps = domTxns(t, A, dom).filter((x) => parents.includes(x.op_id)); if (!ps.length) return [seq]; const keys = ps.map((p) => p.lineage_key).sort(cmpKey); return keys[0].concat([seq]); }
  function recomputeEffective(t, A, domId) {
    const dom = domainOf(t, A, domId); if (!dom) return;
    const maxima = domTxns(t, A, dom).filter((x) => dom.maxima.includes(x.op_id) && !isSuspended(t, A, x.txn_id)).sort((a, b) => cmpKey(a.lineage_key, b.lineage_key));
    const win = maxima[0];
    if (win) { const plan = planOf(t, A); for (const m of win.members) plan[m.field] = m.value; t.put("plan", A, plan); }
    dom.effective = win ? win.op_id : null; putDomain(t, A, domId, dom);
  }
  /* append a transaction into a domain: lineage key, maxima update, effective plan, effect digest */
  function commitTxn(t, A, domId, dom, txn, newMaxima) {
    txn.lineage_key = lineageKey(t, A, dom, txn.parents, txn.seq);
    const k = appendTxn(t, A, txn); dom.txns.push(k); dom.maxima = newMaxima; putDomain(t, A, domId, dom);
    recomputeEffective(t, A, domId);
    txn.after_digest = crypto.effectDigest(key, planOfDomain(t, A, domId)); saveTxn(t, txn);
    return txn;
  }
  /* A5 direct edit → { reject: code } | { txn } */
  function mutation(t, A, op, seqNo) {
    const domId = op.conflict_domain_id; const dom = domainOf(t, A, domId) || newDomain(op.conflict_domain_lineage_id);
    if (dom.lineage !== op.conflict_domain_lineage_id) return { reject: "LINEAGE_MISMATCH" };
    const known = new Set(domTxns(t, A, dom).map((x) => x.op_id)); const parents = (op.causal_parents || []).filter((p) => known.has(p));
    const txn = { txn_id: op.requested_transaction_id, op_id: op.op_id, seq: seqNo, domain: domId, kind: "plan-mutation", members: copyMembers(op.members), member_set_commitment: op.member_set_commitment, parents, before: planOf(t, A), provenance: op.members.every((m) => m.provenance === "athlete_edited") ? "authored" : "inherited" };
    return { txn: commitTxn(t, A, domId, dom, txn, dom.maxima.filter((m) => !parents.includes(m)).concat([op.op_id])) };
  }
  /* state 4 conflict-selection → { reject: code } | { disposition: {...} } */
  function selection(t, A, op, seqNo) {
    const domId = op.conflict_domain_id; const dom = domainOf(t, A, domId); if (!dom) return { reject: "MALFORMED" };
    if (dom.lineage !== op.conflict_domain_lineage_id) return { reject: "LINEAGE_MISMATCH" };
    const txns = domTxns(t, A, dom); const chosen = txns.find((x) => x.member_set_commitment === op.chosen_alternative_commitment);
    if (!chosen || !dom.maxima.includes(chosen.op_id)) return { reject: "MALFORMED" };
    const basisNow = crypto.basisOf(key, domId, dom.maxima);
    if (op.seen_conflict_basis !== basisNow) return { disposition: { applied: false, reason_code: "BASIS_STALE", copy: conflictCopy(t, A, domId, dom, false) } };
    const txn = { txn_id: op.requested_transaction_id, op_id: op.op_id, seq: seqNo, domain: domId, kind: "conflict-selection", members: copyMembers(chosen.members), member_set_commitment: chosen.member_set_commitment, parents: dom.maxima.slice(), before: planOf(t, A), provenance: "resolved" };
    commitTxn(t, A, domId, dom, txn, [op.op_id]);
    return { disposition: { applied: true, plan_transaction_id: txn.txn_id } };
  }
  /* undo-request → the disposition extension; retained per request id so a second evaluation is never a second effect */
  function undo(t, A, op, seqNo) {
    const prior = t.get("undos", rowKey(A, op.op_id)); if (prior) return prior;
    const target = allTxns(t, A).find((x) => x.txn_id === op.target_plan_transaction_id);
    let res;
    if (!target) res = { applied: false, reason_code: "TARGET_UNKNOWN" };
    else {
      const domId = target.domain; const dom = domainOf(t, A, domId);
      const eligible = dom.maxima.length === 1 && dom.maxima[0] === target.op_id && !isSuspended(t, A, target.txn_id) && target.after_digest === crypto.effectDigest(key, planOfDomain(t, A, domId)) && op.target_effect_digest === target.after_digest && op.compensating_group_commitment === crypto.groupCommitment(key, target.before);
      if (!eligible) { const eff = planOfDomain(t, A, domId); res = { applied: false, reason_code: "PLAN_CHANGED_FIRST", copy: "Undo couldn't be applied — the plan changed first: " + Object.entries(eff).map(([k, v]) => v + " " + k).join(", ") + " is in effect." }; }
      else {
        const fields = new Set(target.members.map((m) => m.field));
        const comp = { txn_id: "comp-" + op.op_id, op_id: op.op_id, seq: seqNo, domain: domId, kind: "compensation", members: Object.entries(target.before).filter(([k]) => fields.has(k)).map(([field, value]) => ({ field, value, provenance: "inherited" })), member_set_commitment: crypto.groupCommitment(key, target.before), parents: [target.op_id], before: planOf(t, A), references: { request: op.op_id, target: target.txn_id }, provenance: "authored" };
        commitTxn(t, A, domId, dom, comp, [op.op_id]);
        res = { applied: true, plan_transaction_id: comp.txn_id, compensation_of: target.txn_id };
      }
    }
    t.put("undos", rowKey(A, op.op_id), res); return res;
  }
  /* state 8: the consented effect of an applied proposal response */
  function consented(t, A, iss, responseOpId, seqNo) {
    const domId = iss.conflict_domain_id || "protein"; const dom = domainOf(t, A, domId) || newDomain(iss.conflict_domain_lineage_id || ("lin-" + domId + "-1"));
    const members = iss.apply_members || [{ field: "protein_g", value: 160, provenance: "inherited" }];
    const txn = { txn_id: "txn-apply-" + iss.instance, op_id: responseOpId, seq: seqNo, domain: domId, kind: "consented", members: copyMembers(members), member_set_commitment: crypto.membersCommitment(key, iss.apply_members || []), parents: dom.maxima.slice(), before: planOf(t, A), provenance: "consented", instance: iss.instance };
    return commitTxn(t, A, domId, dom, txn, [responseOpId]);
  }
  function suspend(t, A, txnId) { const txn = allTxns(t, A).find((x) => x.txn_id === txnId); if (!txn) return; t.put("suspended", rowKey(A, txnId), { txn_id: txnId }); recomputeEffective(t, A, txn.domain); }
  function conflictCopy(t, A, domId, dom, withHistory) {
    const n = dom.maxima.length; const eff = domTxns(t, A, dom).find((x) => x.op_id === dom.effective) || { members: [] };
    let s = `Earned found ${n} current versions of this plan. It is using ${JSON.stringify(eff.members.map((m) => m.value))} for now.`;
    if (withHistory) s += ` ${n - 1} alternative${n - 1 === 1 ? " is" : "s are"} in History.`;
    return s;
  }
  function planState(t, A, domId) {
    const dom = domainOf(t, A, domId) || newDomain(null); const txns = domTxns(t, A, dom);
    return { effective: dom.effective, maxima: dom.maxima.slice().sort(), basis: crypto.basisOf(key, domId, dom.maxima), alternatives: dom.maxima.filter((m) => m !== dom.effective).sort(), lineageKeys: Object.fromEntries(txns.filter((x) => dom.maxima.includes(x.op_id)).map((x) => [x.op_id, x.lineage_key])), effectDigest: crypto.effectDigest(key, planOfDomain(t, A, domId)), memberSetCommitments: Object.fromEntries(txns.map((x) => [x.op_id, x.member_set_commitment])), copy: dom.maxima.length > 1 ? conflictCopy(t, A, domId, dom, true) : null };
  }
  function txnDigests(t, A, txnId) { const x = allTxns(t, A).find((y) => y.txn_id === txnId); return x ? { after: x.after_digest, beforeGroupCommitment: crypto.groupCommitment(key, x.before) } : null; }
  const publicTxn = (x) => { const { row, ...rest } = x; return rest; };
  return { cmpKey, DEFAULT_PLAN, planOf, planOfDomain, planState, txnDigests, mutation, selection, undo, consented, suspend, transactions: (t, A) => allTxns(t, A).map(publicTxn) };
}
module.exports = { make, cmpKey, DEFAULT_PLAN };
