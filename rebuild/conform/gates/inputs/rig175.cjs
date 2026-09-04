/* rig175 — witnesses for appendix v1.27 (Sol pass 26 + the adversarial reads). Pure model of §D14-C/§D14-G rules.
   lean_high 50 kg, k = 30 → floor = 1500 + EEE_high, operative minimum = strict successor (grain 1). */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const digest = (content) => crypto.createHash("sha256").update(JP(content)).digest("hex").slice(0, 8);
const floorOf = (eeeHigh) => 1500 + eeeHigh + 1;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };

/* ---------- ingestion models ---------- */
function ingestOLD(submissions) {   /* v1.25: identity first; same id + different commitment → COLLISION STUB, the original stands */
  const items = new Map(), stubs = [];
  for (const s of submissions) {
    const verified = s.commitment === digest(s.content);
    if (items.has(s.id)) { if (items.get(s.id).commitment !== s.commitment) stubs.push({ kind: "COLLISION_STUB", id: s.id }); continue; }
    if (!verified) { stubs.push({ kind: "REJECTION_STUB", id: s.id }); continue; }
    items.set(s.id, s);
  }
  return { items, stubs };
}
function ingestNEW(submissions) {   /* v1.27: verify first; verified same-id different-commitment → COLLISION COMPONENT */
  const items = new Map(), stubs = [], components = new Map();
  for (const s of submissions) {
    const verified = s.commitment === digest(s.content);
    if (!verified) { stubs.push({ kind: "REJECTION_STUB", transport: digest(s) }); continue; }
    if (items.has(s.id)) {
      const first = items.get(s.id);
      if (first.commitment === s.commitment) continue;   /* replay → original receipt */
      const comp = components.get(s.id) || { id: s.id, members: new Set([first.commitment]) };
      comp.members.add(s.commitment); components.set(s.id, comp); continue;
    }
    items.set(s.id, s);
  }
  return { items, stubs, components };
}
function floorOLD(state, cell) {
  const recs = [...state.items.values()].filter((i) => i.content.kind === "record" && i.content.cell === cell);
  return recs.length === 1 ? floorOf(recs[0].content.eee_high) : "ABSTAIN";
}
function floorNEW(state, cell) {
  for (const c of state.components.values()) { const first = state.items.get(c.id); if (first && first.content.cell === cell) return "BLOCKED SOURCE_ITEM_IDENTITY_COLLISION"; }
  return floorOLD(state, cell);
}
const rec = (id, cell, eee) => { const content = { kind: "record", cell, eee_high: eee }; return { id, content, commitment: digest(content) }; };

console.log("== C3 — 'the original stands' is delivery-order dependent; the component is not");
{
  const A = rec("r1", "2026-09-03", 500), B = rec("r1", "2026-09-03", 300);   /* same id, two verified contents */
  const oAB = floorOLD(ingestOLD([A, B]), "2026-09-03"), oBA = floorOLD(ingestOLD([B, A]), "2026-09-03");
  const nAB = floorNEW(ingestNEW([A, B]), "2026-09-03"), nBA = floorNEW(ingestNEW([B, A]), "2026-09-03");
  console.log("   v1.25  A then B →", oAB, "| B then A →", oBA);
  console.log("   v1.27  A then B →", nAB, "| B then A →", nBA);
  ok(oAB !== oBA, "v1.25: the same two admitted items give TWO floors (" + oAB + " vs " + oBA + ") depending on arrival order");
  ok(nAB === nBA && String(nAB).indexOf("BLOCKED") === 0, "v1.27: both orders → the same hard blocker (" + nAB + ")");
}

console.log("\n== C1 — verify BEFORE the collision test: a garbled retry must not turn a valid record into a blocker");
{
  const R = rec("r1", "2026-09-03", 500);
  const garbled = { id: "r1", content: R.content, commitment: "deadbeef" };   /* same id, commitment does not verify */
  const idFirst = (subs) => {   /* the lost draft's order: identity, then verification */
    const items = new Map(), components = new Map(), stubs = [];
    for (const s of subs) { if (items.has(s.id) && items.get(s.id).commitment !== s.commitment) { components.set(s.id, { id: s.id, members: new Set([items.get(s.id).commitment, s.commitment]) }); continue; }
      if (s.commitment !== digest(s.content)) { stubs.push({ kind: "REJECTION_STUB" }); continue; } items.set(s.id, s); }
    return { items, components, stubs };
  };
  const bad = floorNEW(idFirst([R, garbled]), "2026-09-03"), good = floorNEW(ingestNEW([R, garbled]), "2026-09-03");
  console.log("   identity-first →", bad, "| verify-first →", good);
  ok(String(bad).indexOf("BLOCKED") === 0, "identity-first: the garbled retry forms a collision and the VALID record becomes a hard blocker (" + bad + ")");
  ok(good === floorOf(500), "verify-first: the garbled retry is a REJECTION STUB under its transport identity; the record stands at " + good);
}

console.log("\n== C2 — blocker params by receipts are order-dependent; by sorted member commitments they are not");
{
  const A = rec("r1", "2026-09-03", 500), B = rec("r1", "2026-09-03", 300);
  const byReceipt = (subs) => subs.map((s, i) => [s.commitment, i + 1]);            /* member → receipt */
  const bySorted = (subs) => subs.map((s) => s.commitment).sort();
  const pAB = JP(byReceipt([A, B])), pBA = JP(byReceipt([B, A])), sAB = JP(bySorted([A, B])), sBA = JP(bySorted([B, A]));
  console.log("   receipts:", pAB, "vs", pBA, "| sorted commitments:", sAB, "vs", sBA);
  ok(pAB !== pBA, "params carrying receipts differ between the two orders → two bases for one evidence set");
  ok(sAB === sBA, "params carrying sorted member commitments are identical in both orders");
}

console.log("\n== A1 — a receipt HIGH-WATER MARK is not a coverage proof; a CONTIGUOUS reduced-through frontier is");
{
  /* the (athlete, source) sequence at the authority: 1 record R(500) · 2 proof for another cell · 3 WITHDRAWAL of R · 4 rejection stub */
  const R = rec("r1", "2026-09-03", 500);
  const seq = [
    { n: 1, ev: { kind: "STORED", item: R } },
    { n: 2, ev: { kind: "STORED", item: { id: "p9", content: { kind: "proof", cell: "2026-08-30" }, commitment: "c" } } },
    { n: 3, ev: { kind: "STORED", item: { id: "w1", content: { kind: "withdrawal", target: "r1" }, commitment: "d" } } },
    { n: 4, ev: { kind: "REJECTION_STUB" } },
  ];
  const reduce = (events) => { const live = new Map(); for (const e of events) { if (e.ev.kind !== "STORED") continue; const it = e.ev.item;
      if (it.content.kind === "withdrawal") live.delete(it.content.target); else live.set(it.id, it); }
    const recs = [...live.values()].filter((i) => i.content.kind === "record" && i.content.cell === "2026-09-03"); return recs.length === 1 ? floorOf(recs[0].content.eee_high) : "ABSTAIN"; };
  const truth = reduce(seq);                                   /* the authority's current truth */
  const clientHas = seq.filter((e) => e.n !== 3);              /* receipt 3 still in flight */
  const clientFloor = reduce(clientHas);                       /* what the stale client issued against */
  const highWater = Math.max(...clientHas.map((e) => e.n)), authorityMark = seq.length;
  const contiguous = (() => { let f = 0; const have = new Set(clientHas.map((e) => e.n)); while (have.has(f + 1)) f++; return f; })();
  console.log("   authority truth:", truth, "| client issued at:", clientFloor, "| client high-water:", highWater, "authority:", authorityMark, "| client contiguous frontier:", contiguous);
  ok(highWater === authorityMark && clientFloor !== truth, "v1.25 high-water mark: counters EQUAL (" + highWater + " = " + authorityMark + ") → the stale answer applies at " + clientFloor + " while the truth is " + truth);
  ok(contiguous !== authorityMark, "v1.27 contiguous frontier: " + contiguous + " ≠ " + authorityMark + " → the attempt PAUSES until the client reduces receipt 3");
}

console.log("\n== B1 — 'the first stored answer is THE answer' was arrival-ordered; least source_item_id is not");
{
  const a1 = { id: "ans-07", content: { kind: "proof", request: 12 }, commitment: "x" }, a2 = { id: "ans-03", content: { kind: "proof", request: 12 }, commitment: "y" };
  const firstStored = (subs) => subs.find((s) => s.content.request === 12).id;
  const leastId = (subs) => subs.filter((s) => s.content.request === 12).map((s) => s.id).sort()[0];
  ok(firstStored([a1, a2]) !== firstStored([a2, a1]), "first-stored picks " + firstStored([a1, a2]) + " in one order and " + firstStored([a2, a1]) + " in the other");
  ok(leastId([a1, a2]) === leastId([a2, a1]), "least source_item_id picks " + leastId([a1, a2]) + " in both orders");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
