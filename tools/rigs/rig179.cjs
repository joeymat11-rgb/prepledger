/* rig179 — Sol pass 30's three witnesses on appendix v1.30 (→ v1.31). Floor model: 1500 + EEE_high + 1. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const H = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };

console.log("== T1 — an incomplete group stranded behind the registration door");
{
  /* authority state: registry, per-source sequence, groups {id, first, last, complete}, items */
  const mk = () => ({ reg: { S: true }, seq: 0, groups: [], items: new Map(), byT: new Map() });
  const admitInner = (st, sub, tid) => {             /* the triggering admission is durable; the derived events are NOT yet — the modeled crash cut */
    const first = ++st.seq; const g = { id: "g" + first, first, last: null, complete: false, sub, tid };
    st.groups.push(g); st.byT.set(tid, g); return g;
  };
  const finishGroup = (st, g) => { if (g.complete) return; st.seq++; g.last = st.seq; g.complete = true; st.items.set(g.sub.id, "STORED"); };
  const reduce = (st) => st.groups.some((g) => !g.complete) ? "BLOCKED (incomplete group)" : (st.items.size ? "floor " + (1500 + 500 + 1) : "ABSTAIN");
  const R = { id: "r1", payload: { kind: "record", cell: "d", eee_high: 500 } }; const tid = H(R);

  /* v1.30: DOOR (current registration) → transport replay → group recovery */
  const ingest30 = (st, sub) => {
    const t = H(sub);
    if (!st.reg.S) return "REFUSED_AT_THE_DOOR";
    if (st.byT.has(t)) { const g = st.byT.get(t); finishGroup(st, g); return "REPLAY→" + st.items.get(sub.id); }
    const g = admitInner(st, sub, t); /* crash before the derived events */ return "(reply lost; group " + g.id + " incomplete)";
  };
  const remove30 = (st) => { st.reg.S = false; };

  /* v1.31: authority-owned recovery before any action involving (athlete, source); replay lookup + recovery BEFORE the door */
  const recoverPending = (st) => { for (const g of st.groups) finishGroup(st, g); };
  const ingest31 = (st, sub) => {
    const t = H(sub);
    recoverPending(st);                                             /* before any later ingestion involving this (athlete, source) */
    if (st.byT.has(t)) { return "REPLAY→" + st.items.get(sub.id); }  /* an authenticated historical principal's replay hit: the immutable prior result */
    if (!st.reg.S) return "REFUSED_AT_THE_DOOR";                     /* only a replay MISS meets the current-registration door */
    admitInner(st, sub, t); return "(reply lost)";
  };
  const remove31 = (st) => { recoverPending(st); st.reg.S = false; };  /* a registry mutation involving the source completes the pending group first */

  const a = mk(); const a1 = ingest30(a, R); remove30(a); const a2 = ingest30(a, R); const aR = reduce(a);
  const b = mk(); const b1 = ingest31(b, R); remove31(b); const b2 = ingest31(b, R); const bR = reduce(b);
  console.log("   v1.30:", a1, "| after removal, retry:", a2, "| reduction:", aR);
  console.log("   v1.31:", b1, "| after removal, retry:", b2, "| reduction:", bR);
  ok(a2 === "REFUSED_AT_THE_DOOR" && aR.startsWith("BLOCKED"), "v1.30: the retry is refused before replay lookup or recovery — the incomplete group blocks reduction over S for ever, and even a lost-ack retry returns REFUSED instead of the original disposition");
  ok(b2 === "REPLAY→STORED" && !bR.startsWith("BLOCKED"), "v1.31: the registry mutation completed the pending group first (authority-owned), the retry is a replay HIT returning the immutable prior result, reduction proceeds");
  /* the sync path: no retry at all */
  const c = mk(); ingest31(c, R); remove31(c); ok(!reduce(c).startsWith("BLOCKED"), "v1.31: with NO retry the removal itself completes the group; the athlete client learns the result through sync");
}

console.log("\n== T2 — component_scope_current reads a route stamp the enumeration never assigned to ANSWER / WITHDRAWAL members");
{
  const reg = { r: true };
  const stampRule30 = (kind) => kind === "record" || kind === "proof";          /* "INGESTION stamps every stored proof and record" */
  const members = [{ kind: "answer", c: "c1", scope: "cellD" }, { kind: "answer", c: "c2", scope: "cellD" }];
  /* implementation A reads the enumeration literally; implementation B infers a stamp from "stored like any item" */
  const scopeCurrentA = members.some((m) => m.scope === "cellD" && stampRule30(m.kind) && reg.r);
  const scopeCurrentB = members.some((m) => m.scope === "cellD" && reg.r);
  console.log("   v1.30 two ANSWER members under one id — impl A (literal enumeration):", scopeCurrentA ? "FINDING" : "diagnostics only", "| impl B (inferred stamp):", scopeCurrentB ? "FINDING" : "diagnostics only");
  ok(scopeCurrentA !== scopeCurrentB, "v1.30: two conforming implementations disagree on whether SOURCE_ITEM_IDENTITY_COLLISION binds cell d");
  const stampRule31 = (sub) => sub.verified && sub.shapeValid && sub.identityConsuming;   /* every such submission, any kind, stamped BEFORE the identity test */
  const subs = members.map((m) => ({ ...m, verified: true, shapeValid: true, identityConsuming: true, disposition: "COLLISION_MEMBER" }));
  const stamped = subs.map((s) => ({ ...s, stamp: stampRule31(s) ? "r" : null }));
  const scopeCurrent31 = stamped.some((m) => m.scope === "cellD" && m.stamp && reg[m.stamp]);
  ok(stamped.every((s) => s.stamp === "r") && scopeCurrent31, "v1.31: both ANSWER members carry the route stamp (assigned before the identity test, COLLISION_MEMBER included) — the finding binds in every implementation");
  const withdrawal = { kind: "withdrawal", verified: true, shapeValid: true, identityConsuming: true };
  ok(stampRule31(withdrawal) && !stampRule31({ kind: "request", verified: false }), "v1.31: a WITHDRAWAL is stamped too (its currentness test reads that stamp); an authority-created REQUEST is outside the rule");
}

console.log("\n== T3 — 'every other stored answer is REQUEST_MISMATCH' contradicts the selector population");
{
  const answers = [
    { id: "a1", stored: true, shapeValid: true, outcome: "APPLIES", member: false, withdrawn: true },
    { id: "a2", stored: true, shapeValid: true, outcome: "APPLIES", member: true, withdrawn: false },
    { id: "a3", stored: true, shapeValid: true, outcome: "INERT", member: false, withdrawn: false },
    { id: "a4", stored: true, shapeValid: true, outcome: "APPLIES", member: false, withdrawn: false },
    { id: "a5", stored: true, shapeValid: true, outcome: "APPLIES", member: false, withdrawn: false },
  ];
  const population = answers.filter((a) => a.stored && a.shapeValid && a.outcome === "APPLIES" && !a.member && !a.withdrawn).sort((x, y) => x.id < y.id ? -1 : 1);
  const THE = population[0].id;
  const ownRow = (a) => a.withdrawn ? "ZERO_PROOF_INAPPLICABLE{WITHDRAWN}" : a.member ? "(hidden: the COMPONENT blocker)" : a.outcome === "INERT" ? "(source-card: INERT)" : null;
  const ledger30 = answers.filter((a) => a.id !== THE).map((a) => a.id + ":REQUEST_MISMATCH");                 /* literal: every other STORED answer */
  const ledger31 = answers.filter((a) => a.id !== THE).map((a) => a.id + ":" + (population.some((p) => p.id === a.id) ? "REQUEST_MISMATCH" : ownRow(a)));
  console.log("   THE answer:", THE); console.log("   literal reading:", JP(ledger30)); console.log("   population reading:", JP(ledger31));
  ok(ledger30.includes("a1:REQUEST_MISMATCH") && ledger30.includes("a2:REQUEST_MISMATCH") && ledger30.includes("a3:REQUEST_MISMATCH"), "v1.30 literal: the withdrawn answer, the hidden collision member and the INERT answer all get REQUEST_MISMATCH rows — contradicting WITHDRAWN, the component blocker and the INERT resolution");
  ok(ledger31.includes("a5:REQUEST_MISMATCH") && ledger31.includes("a1:ZERO_PROOF_INAPPLICABLE{WITHDRAWN}") && !ledger31.includes("a2:REQUEST_MISMATCH") && !ledger31.includes("a3:REQUEST_MISMATCH"), "v1.31: only the other MEMBERS OF THE SELECTOR POPULATION are REQUEST_MISMATCH; the excluded answers keep their own rows");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
