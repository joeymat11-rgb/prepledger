/* reference/progression.cjs — REFERENCE MODEL for the REBUILD's progression-receipt semantics (Sol suite-pass-1,
   "PACK 3 findings carried into the rebuild"): same-day set-count maximum, former-name joint mint, earn identity,
   queue immutability, graduation canonicalization, debut reconciliation, server-authoritative order. NOT the old
   engine and NOT the product; the product's progression binding (adapters/progression.cjs) must pass the same laws. */
function create(cfg = {}, hooks = {}) {
  const H = Object.assign({ sameDayRule: "end-of-day-plus-decreases", nameScan: "all-names", earnIdentity: "fact", rewriteQueue: false, reconcile: "earliest", loserState: "SUPERSEDED", preserveDone: true, orderCanonical: true }, hooks);
  /* SAME-DAY SET-COUNT MAXIMUM — the count the lift could have required on day d, from the CURRENT count and dated ±deltas */
  function setsAtTime(currentSets, deltas, d) {
    let endOfDay = currentSets; for (const [dd, v] of deltas) if (dd > d) endOfDay -= v;          /* undo everything after d → end-of-day count on d */
    let sameDayInc = 0, sameDayDec = 0; for (const [dd, v] of deltas) if (dd === d) { if (v > 0) sameDayInc += v; else sameDayDec += -v; }
    if (H.sameDayRule === "end-of-day-plus-increases") return Math.max(1, endOfDay + sameDayInc);   /* the fix4b formula (double-counts the same-day push) */
    return Math.max(1, endOfDay + sameDayDec);                                                    /* the maximum during the day: it was higher before a same-day decrease */
  }
  /* FORMER-NAME JOINT MINT — two PROVISIONAL sightings at the same load, possibly recorded under different names */
  const namesOf = (lift) => H.nameScan === "all-names" ? [lift.name].concat((lift.renames || []).map((r) => r.prevN), (lift.forks || []).map((f) => f.prevN)).filter(Boolean) : [lift.name];
  function mintJointEarn(lift, feed) {
    const names = namesOf(lift).map((n) => n.toUpperCase()); const prov = feed.filter((f) => /TOP OF WINDOW, PROVISIONAL$/.test(f.t) && names.some((n) => f.t.toUpperCase().indexOf(n + " ") === 0) && Number(f.t.toUpperCase().replace(/^.*?\s(\d+(?:\.\d+)?)\s.*$/, "$1")) === lift.load).map((f) => f.d).sort();
    if (prov.length < 2) return null; const d = prov[prov.length - 1]; const id = H.earnIdentity === "fact" ? `earn:${lift.id}:${lift.load}:${d}` : `${lift.name.toUpperCase()} ${lift.load} EARNED`;
    return { id, d, t: `${lift.name.toUpperCase()} ${lift.load} EARNED`, debut: `debut:${lift.id}:${lift.load + (lift.inc || 5)}:${d}` };
  }
  /* QUEUE: append-only records; a graduation to (lift, load) on date d has ONE canonical id; re-earns on other dates are distinct */
  function queueAppend(queue, item) { const exists = queue.find((q) => q.id === item.id); if (exists) { if (H.rewriteQueue) Object.assign(exists, item); return queue; } return queue.concat([{ ...item }]); }
  function reconcileDebuts(queue) {
    const byKey = new Map(); for (const q of queue) if (q.kind === "debut" && !q.done) { const k = q.exId + ":" + q.newW; byKey.set(k, (byKey.get(k) || []).concat([q])); }
    const out = queue.map((q) => ({ ...q })); for (const [, items] of byKey) { if (items.length < 2) continue; const sorted = items.slice().sort((a, b) => (H.reconcile === "earliest" ? (a.d < b.d ? -1 : 1) : (a.d < b.d ? 1 : -1))); for (const loser of sorted.slice(1)) { const o = out.find((x) => x.id === loser.id); if (H.loserState === "SUPERSEDED") { o.done = true; o.state = "SUPERSEDED"; o.supersededBy = sorted[0].id; } else out.splice(out.indexOf(o), 1); } }
    return out;
  }
  function mergeQueues(a, b) { const seen = new Map(); for (const q of a.concat(b)) if (!seen.has(q.id)) seen.set(q.id, { ...q }); const merged = [...seen.values()]; return H.orderCanonical ? merged.sort((x, y) => (x.d + x.id < y.d + y.id ? -1 : 1)) : merged; }
  /* DEBUT WRITERS (PACK 3 FIX-4 §4): every writer carries the per-set vector newWSets = wSets shifted by (newW − w) */
  const vec = (lift, newW) => (Array.isArray(lift.wSets) ? lift.wSets.map((x) => x + (newW - lift.load)) : undefined);
  const writers = {
    classic: (lift, d) => ({ id: `debut:${lift.id}:${lift.load + lift.inc}:${d}`, kind: "debut", exId: lift.id, newW: lift.load + lift.inc, newWSets: H.writersCarryVector === false ? undefined : vec(lift, lift.load + lift.inc), d, done: false, state: "ESTABLISH", writer: "classic" }),
    twoRung: (lift, d) => ({ id: `debut:${lift.id}:${lift.load + 2 * lift.inc}:${d}:2r`, kind: "debut", exId: lift.id, newW: lift.load + 2 * lift.inc, newWSets: H.writersCarryVector === false ? undefined : vec(lift, lift.load + 2 * lift.inc), d, done: false, state: "PROPOSED", writer: "two-rung", t: `${lift.name} ${lift.load + 2 * lift.inc} — TWO-RUNG DEBUT PROPOSED` }),
    oneSighting: (lift, d) => ({ id: `debut:${lift.id}:${lift.load + lift.inc}:${d}:1s`, kind: "debut", exId: lift.id, newW: lift.load + lift.inc, newWSets: H.writersCarryVector === false ? undefined : vec(lift, lift.load + lift.inc), d, done: false, state: "PROPOSED", writer: "one-sighting", t: `${lift.name} ${lift.load + lift.inc} — EARN PROPOSED OFF ONE SIGHTING` }),
  };
  function takeProposedDebut(queue, id) { const out = queue.map((q) => ({ ...q })); const q = out.find((x) => x.id === id && !x.done && x.state === "PROPOSED"); if (!q) return out; q.state = "DEBUT"; q.t = String(q.t || "").replace(" — TWO-RUNG DEBUT PROPOSED", " DEBUT (two-rung, your call)").replace(" — EARN PROPOSED OFF ONE SIGHTING", " DEBUT (early, your call)"); if (H.takeSupersedesLower !== false) for (const x of out) { if (x === q || x.done || x.kind !== "debut" || x.exId !== q.exId) continue; if (typeof x.newW === "number" && x.newW < q.newW) { x.done = true; x.state = "SUPERSEDED"; } } return out; }
  function completeDebut(lift, queue, id) { const q = queue.find((x) => x.id === id && !x.done); if (!q) return { lift, queue }; const nl = { ...lift, load: q.newW, wSets: H.completionAdoptsVector === false ? lift.wSets : (q.newWSets ? q.newWSets.slice() : lift.wSets) }; return { lift: nl, queue: queue.map((x) => (x.id === id ? { ...x, done: true, state: "DONE" } : x)) }; }
  return { setsAtTime, mintJointEarn, queueAppend, reconcileDebuts, mergeQueues, namesOf, writers, takeProposedDebut, completeDebut };
}
module.exports = { create };
