/* rig177 — Sol pass 28's six witnesses on the §D14-C / §D14-F / §D14-G text of appendix v1.28 (→ v1.29).
   Floor model: lean_high 50, k = 30 → floor = 1500 + EEE_high + 1. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const digest = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
const hmac = (key, c) => crypto.createHmac("sha256", key).update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };
const item = (id, content) => ({ id, content, commitment: digest(content) });
const floor = (eee) => 1500 + eee + 1;

console.log("== S1 — a VERIFIED but shape-malformed proof S(x) vs the valid proof R(x): collision by arrival order");
{
  const S = item("x", { kind: "proof", cell: "2026-09-03", domain_binding: null });          /* verifies, malformed binding */
  const R = item("x", { kind: "proof", cell: "2026-09-03", domain_binding: { mode: "OBSERVED", instant_set: "cell" } });
  const wellFormed = (s) => s.content.kind !== "proof" || !!s.content.domain_binding;
  const ingest28 = (subs) => {   /* verify → IDENTITY → shape */
    const items = new Map(), comps = new Set(), stubs = [];
    for (const s of subs) { if (s.commitment !== digest(s.content)) { stubs.push(s); continue; }
      if (items.has(s.id)) { if (items.get(s.id).commitment !== s.commitment) comps.add(s.id); continue; }
      if (!wellFormed(s)) { stubs.push(s); continue; }                                        /* shape AFTER identity */
      items.set(s.id, s); }
    return { items, comps, stubs };
  };
  const ingest29 = (subs) => {   /* verify → SHAPE (identity-consuming?) → identity */
    const items = new Map(), comps = new Set(), stubs = [];
    for (const s of subs) { if (s.commitment !== digest(s.content)) { stubs.push(s); continue; }
      if (!wellFormed(s)) { stubs.push(s); continue; }                                        /* a stub never consumes its id */
      if (items.has(s.id)) { if (items.get(s.id).commitment !== s.commitment) comps.add(s.id); continue; }
      items.set(s.id, s); }
    return { items, comps, stubs };
  };
  const read = (st) => st.comps.has("x") ? "BLOCKED SOURCE_ITEM_IDENTITY_COLLISION" : (st.items.has("x") ? "ZERO_ATTESTED via " + st.items.get("x").commitment : "NO_PROOF");
  const a = read(ingest28([S, R])), b = read(ingest28([R, S])), c = read(ingest29([S, R])), d = read(ingest29([R, S]));
  console.log("   v1.28  S→R:", a, "| R→S:", b); console.log("   v1.29  S→R:", c, "| R→S:", d);
  ok(a !== b, "v1.28: the same two submissions give STORED evidence in one order and a hard collision in the other");
  ok(c === d && c.indexOf("ZERO_ATTESTED") === 0, "v1.29: shape validation before the identity test — the malformed proof is a stub that never consumes x; R stands in both orders (" + c + ")");
}

console.log("\n== S2 — the withdrawal / reference kind rules were not one function");
{
  /* Witness A: W2 (id x) withdraws record y; W1 targets identity x */
  const y = item("y", { kind: "record", cell: "2026-09-03", eee_high: 500 });
  const readA = (rule) => {
    const w2Active = rule === "nothing-under-x-in-force" ? false : true;   /* v1.28 reading 1 disables W2; reading 2 (a withdrawal is not withdrawable) leaves it in force */
    const yLive = !w2Active; return yLive ? floor(500) : "ABSTAIN";
  };
  const r1 = readA("nothing-under-x-in-force"), r2 = readA("not-withdrawable");
  console.log("   v1.28 witness A: reading 'nothing under x in force' →", r1, "| reading 'a withdrawal is not withdrawable' →", r2);
  ok(r1 !== r2, "v1.28: the two sentences give " + r1 + " and " + r2 + " for one admitted set");
  const matrix = (referrer, targetKind) => ({ "WITHDRAWAL→RECORD": "APPLIES", "WITHDRAWAL→PROOF": "APPLIES", "WITHDRAWAL→ANSWER": "APPLIES", "WITHDRAWAL→COMPONENT": "RETIRES",
    "WITHDRAWAL→WITHDRAWAL": "INERT", "WITHDRAWAL→REQUEST": "INERT", "ANSWER→REQUEST": "APPLIES", "ANSWER→OTHER": "INERT",
    "SUPERSEDES→RECORD_SAME_SLOT": "LINEAGE", "SUPERSEDES→OTHER": "CANDIDATE_MALFORMED" })[referrer + "→" + targetKind];
  const w1 = matrix("WITHDRAWAL", "WITHDRAWAL"), w2 = matrix("WITHDRAWAL", "RECORD");
  ok(w1 === "INERT" && w2 === "APPLIES", "v1.29: the closed matrix gives ONE answer — W1→W2 is INERT, W2→y APPLIES, so y is withdrawn (ABSTAIN) in every reading");
  /* Witness B: a record's supersedes pointer that resolves to a proof */
  ok(matrix("SUPERSEDES", "OTHER") === "CANDIDATE_MALFORMED", "v1.29: a supersedes pointer to a proof is CANDIDATE_MALFORMED at the screen (v1.28 had both 'INERT, the record stands' and 'CANDIDATE_MALFORMED')");
}

console.log("\n== S3 — component retirement: durable event vs evaluation-current withdrawal");
{
  /* A, B form component x; W under route r1 retires it; r1 goes inactive while A/B's route r0 is current again */
  const registry = { r0: true, r1: true };
  const durable = { retired: true };                                        /* v1.28: retirement is content of an immutable event */
  const effective = (reg) => reg.r1;                                        /* v1.29: retirement_effective iff a CURRENT non-hidden withdrawal targets x */
  const before = { durable: durable.retired ? "no blocker" : "BLOCKED", eff: effective(registry) ? "no blocker" : "BLOCKED" };
  registry.r1 = false;
  const after = { durable: durable.retired ? "no blocker" : "BLOCKED", eff: effective(registry) ? "no blocker" : "BLOCKED" };
  console.log("   before r1 goes inactive:", JP(before), "| after:", JP(after));
  ok(after.durable !== after.eff, "v1.28: after r1 goes inactive the durable-event reading says '" + after.durable + "' and the current-withdrawal reading says '" + after.eff + "' — no rule chose");
  ok(after.eff === "BLOCKED" && before.eff === "no blocker", "v1.29: retirement_effective is derived at every basis — the blocker returns when W stops being current and is suppressed while it is; the epoch covers either transition");
}

console.log("\n== S4 — authority-atomic groups are not client-atomic without boundaries");
{
  const group = [{ n: 2, kind: "DISPOSITION/COLLISION_MEMBER" }, { n: 3, kind: "FORMATION" }];
  /* v1.28 client: reduces receipt by receipt; the sync response is cut after receipt 2 */
  const delivered = group.slice(0, 1); let frontier28 = 1; for (const e of delivered) if (e.n === frontier28 + 1) frontier28 = e.n;
  /* v1.29 client: events carry {group_id, first, last}; it stages the group and commits only when complete */
  const tagged = group.map((e) => ({ ...e, group_id: "g7", first: 2, last: 3 }));
  const staged = tagged.slice(0, 1); let frontier29 = 1;
  const complete = staged.length && staged.every((e) => e.group_id === "g7") && staged.map((e) => e.n).join() === Array.from({ length: 2 }, (_, i) => 2 + i).join();
  if (complete) frontier29 = 3;
  console.log("   cut after receipt 2 — v1.28 client frontier:", frontier28, "| v1.29 client frontier:", frontier29);
  ok(frontier28 === 2, "v1.28: consecutive numbers alone let the client reduce through receipt 2 — its frontier points INSIDE the group (the STORED item visible without the formation)");
  ok(frontier29 === 1, "v1.29: with authenticated {group_id, first, last} the client stages the group and its frontier stays at first_receipt − 1 = 1 until receipt 3 lands");
}

console.log("\n== S5 — AUTHORITATIVE_RECORD input-domain commitment: EMPTY vs the union of semantic dependency domains");
{
  const recordDomains = ["split", "lift:press"];                              /* what the record's applicability basis reads */
  const unresolved = new Set(["lift:press"]);
  const emptyReading = [], unionReading = recordDomains;
  const p0b = (domains) => domains.some((d) => unresolved.has(d)) ? "EXERCISE_PLAN_UNRESOLVED_OR_SUSPENDED {lift:press}" : "PRODUCER_DOMAINS_OK";
  console.log("   EMPTY sentence →", p0b(emptyReading), "| generic rule →", p0b(unionReading));
  ok(p0b(emptyReading) !== p0b(unionReading), "v1.28: the two definitions give different P0b bases and faces for one class held by records of two sources");
  ok(p0b(unionReading).indexOf("EXERCISE_PLAN_UNRESOLVED") === 0, "v1.29: the commitment is the canonical union of every held record's semantic dependency domains — P0b validates lift:press before P2 reports the record conflict");
}

console.log("\n== S6 — SOURCE_ITEM_UNREADABLE keyed by receipt: an unrelated stub moves day A's basis");
{
  const key = "athlete-secret";
  const A = { raw: "garbled-A", scope: "dayA" }, B = { raw: "garbled-B", scope: "dayB" };
  const ledgerByReceipt = (order) => order.map((s, i) => ({ receipt: i + 1, scope: s.scope })).filter((e) => e.scope === "dayA");
  const ledgerByIdentity = (order) => order.map((s) => ({ id: hmac(key, { src: "S", replay: digest(s.raw) }), scope: s.scope })).filter((e) => e.scope === "dayA");
  const r1 = JP(ledgerByReceipt([A, B])), r2 = JP(ledgerByReceipt([B, A])), i1 = JP(ledgerByIdentity([A, B])), i2 = JP(ledgerByIdentity([B, A]));
  console.log("   by receipt:", r1, "vs", r2, "| by keyed replay identity:", i1, "vs", i2);
  ok(r1 !== r2, "v1.28: day A's ledger record differs (receipt 1 vs 2) solely because unrelated stub B arrived first");
  ok(i1 === i2, "v1.29: keyed per-athlete per-source replay-identity commitment — day A's ledger is identical in both orders; the receipt stays in diagnostics and Why");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
