"use strict";
/* plan.cjs — THE ACCEPTED PLAN and everything derived from plan transactions.
   · The accepted plan is a PROJECTION of consented plan transactions (the authority's at last sync, or a local
     consent record that references its transaction). A plan record with no consent transaction is NOT an accepted
     plan and is never surfaced (state 10).
   · Layer-1 LIVE EDITS: the athlete's own plan-mutation operations not yet folded by an effective, received
     transaction; each touches its conflict domain (dependency-aware withdrawal reads this set).
   · State 5 FALLBACK: the effective COMPLETE projection immediately before a suspended transaction, excluding any
     value introduced only by it and any descendant value that INHERITED such a value (transitively).
   · State 8 ISSUANCE: the instance is derived from the stored offer content, never from a local counter.
   · State 10: after "Start from today's session", the initial-plan OFFER has equal, unselected choices. */
const crypto = require("node:crypto");
const { encode } = require("./canonical.cjs");

const UNITS = { steps: "step/day", protein: "g/day", protein_g: "g/day", calories: "kcal/day", kcal: "kcal/day", sleep: "h/night", press: "lb", squat: "lb", deadlift: "lb", bench: "lb", row: "lb", sets: "set", reps: "rep" };
const unitFor = (domain) => UNITS[domain] || "unit";

/* fold members onto a projection */
function project(base, members) { const out = Object.assign({}, base); for (const m of members) out[m.field] = m.value; return out; }

/* toposort the transaction DAG (parents before children), stable on input order */
function topo(txns) {
  const byId = new Map(txns.map((t) => [t.txn_id, t])); const out = []; const seen = new Set();
  const visit = (t, stack) => { if (seen.has(t.txn_id)) return; if (stack.has(t.txn_id)) throw new Error("plan history: cycle at " + t.txn_id); stack.add(t.txn_id); for (const p of t.parents || []) { const pt = byId.get(p); if (pt) visit(pt, stack); } stack.delete(t.txn_id); seen.add(t.txn_id); out.push(t); };
  for (const t of txns) visit(t, new Set());
  return out;
}

/* fallbackBefore(history, txnId) → { plan, excluded, source } | null */
function fallbackBefore(history, txnId) {
  const suspended = history.find((t) => t.txn_id === txnId); if (!suspended) return null;
  const order = topo(history); const tainted = new Map();   /* txn_id → Set(fields whose value derives from the suspended txn) */
  tainted.set(txnId, new Set(suspended.members.map((m) => m.field)));
  const proj = {}; const excluded = [];
  for (const t of order) {
    if (t.txn_id === txnId) continue;
    const own = new Set();
    for (const m of t.members) {
      const inheritedTaint = m.provenance === "inherited" && (t.parents || []).some((p) => tainted.has(p) && tainted.get(p).has(m.field));
      if (inheritedTaint) { own.add(m.field); excluded.push(m.field); continue; }
      proj[m.field] = m.value;
    }
    if (own.size) tainted.set(t.txn_id, own);
  }
  return { plan: proj, excluded: Array.from(new Set(excluded)), source: "effective complete projection immediately before " + txnId, complete: Object.keys(proj).length > 0 };
}

/* state 8: the issuance INSTANCE from the offer content */
function deriveInstance(offer) {
  if (!offer || typeof offer.proposal_family_id !== "string") throw new Error("deriveInstance: an offer names its proposal_family_id");
  const pre = encode({ proposal_family_id: offer.proposal_family_id, evidence_generation: offer.evidence_generation, offer_digest: offer.offer_digest });
  return "inst-" + crypto.createHash("sha256").update("earned/issuance/v1" + pre, "utf8").digest("hex").slice(0, 16);
}

/* state 10: the initial-plan OFFER after session facts were logged — equal, unselected choices */
function initialPlanOffer(sessionFacts) {
  if (!sessionFacts || !sessionFacts.length) return null;
  return { kind: "INITIAL_PLAN", id: "initial-plan", choices: [{ id: "from-session", label: "Start from today's session", selected: false }, { id: "no-plan", label: "No accepted training plan yet", selected: false }], facts: sessionFacts.map((f) => ({ date: f.date, sets: f.sets.length })) };
}
/* members for "from-session": every value the athlete selected by choosing this option is athlete_edited */
function membersFromSession(sessionFacts) {
  const byLift = new Map();
  for (const f of sessionFacts) for (const s of f.sets) { const lift = String(s.lift || "lift").toLowerCase(); const cur = byLift.get(lift) || { load: 0, sets: 0, reps: 0 }; cur.load = Math.max(cur.load, Number(s.load) || 0); cur.sets += 1; cur.reps = Math.max(cur.reps, Number(s.reps) || 0); byLift.set(lift, cur); }
  const members = [];
  for (const [lift, v] of byLift) { members.push({ field: lift, value: v.load, unit: "lb", provenance: "athlete_edited" }); members.push({ field: lift + "_sets", value: v.sets, unit: "set", provenance: "athlete_edited" }); members.push({ field: lift + "_reps", value: v.reps, unit: "rep", provenance: "athlete_edited" }); }
  return members;
}

module.exports = { unitFor, project, topo, fallbackBefore, deriveInstance, initialPlanOffer, membersFromSession };
