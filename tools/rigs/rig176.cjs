/* rig176 — Sol pass 27's three witnesses on the §D14-C ingestion model (appendix v1.27 → v1.28).
   Floor model: lean_high 50, k = 30 → 1500 + EEE_high + 1. A "state" is the authority's durable event log. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const digest = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };
const rec = (id, cell, eee) => { const content = { kind: "record", cell, eee_high: eee }; return { id, content, commitment: digest(content) }; };
const wd = (id, target) => { const content = { kind: "withdrawal", target }; return { id, content, commitment: digest(content) }; };

/* ---------- v1.27 model: a withdrawal RESOLVES against one stored member; formation ignores withdrawals ---------- */
function ingest27(subs) {
  const items = new Map(), comps = new Map(), waiting = [], withdrawnMembers = new Set();
  for (const s of subs) {
    if (s.content.kind === "withdrawal") {
      const c = comps.get(s.content.target), t = items.get(s.content.target);
      if (c) c.retired = true;                                              /* v1.27: a withdrawal may target a COMPONENT and retires it */
      else if (t) withdrawnMembers.add(t.commitment);                       /* v1.27: else it targets the one stored record */
      else waiting.push(s);                                                 /* WAITING_FOR_SOURCE_ITEM */
      continue;
    }
    if (items.has(s.id)) { if (items.get(s.id).commitment !== s.commitment) { const c = comps.get(s.id) || { members: new Set([items.get(s.id).commitment]), retired: false }; c.members.add(s.commitment); comps.set(s.id, c); } continue; }
    items.set(s.id, s);
    for (const w of waiting.splice(0)) if (w.content.target === s.id) withdrawnMembers.add(s.commitment); else waiting.push(w);   /* resolution narrows W to THIS member */
  }
  return { items, comps, withdrawnMembers, waiting, withdrawnIds: new Set() };
}
/* ---------- v1.28 model: a withdrawal targets the IDENTITY; formation evaluates every stored withdrawal for x ---------- */
function ingest28(subs) {
  const items = new Map(), comps = new Map(), withdrawnIds = new Set();
  for (const s of subs) {
    if (s.content.kind === "withdrawal") { withdrawnIds.add(s.content.target); const c = comps.get(s.content.target); if (c) c.retired = true; continue; }
    if (items.has(s.id)) { if (items.get(s.id).commitment !== s.commitment) { const c = comps.get(s.id) || { members: new Set([items.get(s.id).commitment]), retired: withdrawnIds.has(s.id) }; c.members.add(s.commitment); comps.set(s.id, c); } continue; }
    items.set(s.id, s);
  }
  return { items, comps, withdrawnIds, withdrawnMembers: new Set() };
}
function floorOf(state, cell) {
  for (const [id, c] of state.comps) { const first = state.items.get(id); if (first && first.content.cell === cell && !c.retired) return "BLOCKED SOURCE_ITEM_IDENTITY_COLLISION"; }
  const live = [...state.items.values()].filter((i) => i.content.kind === "record" && i.content.cell === cell
    && !state.withdrawnIds.has(i.id) && !state.withdrawnMembers.has(i.commitment) && !(state.comps.get(i.id)));   /* a component hides its members */
  return live.length === 1 ? 1500 + live[0].content.eee_high + 1 : "ABSTAIN";
}

console.log("== W1 — collision withdrawal: A(x,c1) · B(x,c2) · W(x) in two orders");
{
  const A = rec("x", "2026-09-03", 500), B = rec("x", "2026-09-03", 300), W = wd("w1", "x");
  const o1 = floorOf(ingest27([A, B, W]), "2026-09-03"), o2 = floorOf(ingest27([W, A, B]), "2026-09-03"), o3 = floorOf(ingest27([A, W, B]), "2026-09-03");
  const n1 = floorOf(ingest28([A, B, W]), "2026-09-03"), n2 = floorOf(ingest28([W, A, B]), "2026-09-03"), n3 = floorOf(ingest28([A, W, B]), "2026-09-03");
  console.log("   v1.27  A→B→W:", o1, "| W→A→B:", o2, "| A→W→B:", o3);
  console.log("   v1.28  A→B→W:", n1, "| W→A→B:", n2, "| A→W→B:", n3);
  ok(!(o1 === o2 && o2 === o3), "v1.27: the same admitted set {A, B, W} finishes retired in one order and BLOCKING in another (" + o1 + " / " + o2 + " / " + o3 + ")");
  ok(n1 === n2 && n2 === n3 && n1 === "ABSTAIN", "v1.28: a withdrawal targets the identity x, formation evaluates stored withdrawals → every order gives " + n1 + " (component retired, nothing under x in force)");
}

console.log("\n== W2 — crash between the COLLISION_MEMBER disposition and the formation event (hidden commit)");
{
  const A = rec("x", "2026-09-03", 500), B = rec("x", "2026-09-03", 300);
  /* v1.27: two separate appends; crash after the first; replay of B returns its disposition and stores nothing */
  const log27 = [];
  const admit27 = (s, crashAfterDisposition) => {
    if (log27.some((e) => e.kind === "DISPOSITION" && e.id === s.id && e.commitment === s.commitment)) return "replay: original receipt, nothing new";
    const first = log27.find((e) => e.kind === "DISPOSITION" && e.id === s.id && e.status === "STORED");
    log27.push({ n: log27.length + 1, kind: "DISPOSITION", id: s.id, commitment: s.commitment, status: first ? "COLLISION_MEMBER" : "STORED" });
    if (crashAfterDisposition) return "CRASH";
    if (first) log27.push({ n: log27.length + 1, kind: "FORMATION", id: s.id });
    return "ok";
  };
  admit27(A, false); admit27(B, true); const afterCrash = admit27(B, false);   /* the retry */
  const visible27 = log27.some((e) => e.kind === "FORMATION" && e.id === "x");
  const stored27 = log27.filter((e) => e.kind === "DISPOSITION" && e.id === "x").map((e) => e.status);
  console.log("   v1.27 log:", JP(log27.map((e) => e.n + ":" + e.kind + (e.status ? "/" + e.status : ""))), "| retry of B →", afterCrash);
  ok(!visible27 && stored27.includes("COLLISION_MEMBER"), "v1.27: the durable prefix holds COLLISION_MEMBER with NO formation — the STORED item stays visible (floor " + (1500 + 500 + 1) + " from a colliding id) and the retry cannot repair it (" + afterCrash + ")");
  /* v1.28: ONE atomic group; the sequence advances only by the whole group; replay recovers an incomplete group */
  const log28 = []; let seqLen = 0;
  const groupFor = (s) => { const first = log28.find((e) => e.kind === "DISPOSITION" && e.id === s.id && e.status === "STORED");
    const g = [{ kind: "DISPOSITION", id: s.id, commitment: s.commitment, status: first ? "COLLISION_MEMBER" : "STORED" }];
    if (first) g.push({ kind: "FORMATION", id: s.id }); return g; };
  const admit28 = (s, crashMidGroup) => {
    const done = log28.find((e) => e.kind === "DISPOSITION" && e.id === s.id && e.commitment === s.commitment);
    if (done && done.groupComplete) return "replay: original receipt";
    const g = groupFor(s);
    if (crashMidGroup) { log28.push({ ...g[0], n: seqLen + 1, groupComplete: false }); return "CRASH (partial group, NOT visible: length stays " + seqLen + ")"; }
    /* atomic: write the whole group, then advance the length */
    for (const e of log28.filter((e) => e.id === s.id && e.groupComplete === false)) log28.splice(log28.indexOf(e), 1);
    g.forEach((e, i) => log28.push({ ...e, n: seqLen + 1 + i, groupComplete: true })); seqLen += g.length; return "ok (length " + seqLen + ")";
  };
  admit28(A, false); const crash = admit28(B, true); const recover = admit28(B, false);
  const visible28 = log28.filter((e) => e.n <= seqLen && e.groupComplete);
  console.log("   v1.28: crash →", crash, "| retry →", recover, "| visible:", JP(visible28.map((e) => e.n + ":" + e.kind + (e.status ? "/" + e.status : ""))));
  ok(crash.indexOf("length stays 1") > -1, "v1.28: a crash mid-group leaves the sequence length at 1 — the COLLISION_MEMBER disposition is not visible without its formation");
  ok(visible28.length === 3 && visible28[1].status === "COLLISION_MEMBER" && visible28[2].kind === "FORMATION", "v1.28: the retry performs GROUP RECOVERY — disposition + formation land together with consecutive receipts 2 and 3");
}

console.log("\n== W3 — answer selection after an answer identity collision");
{
  const answers = [{ id: "ans-01", request: 12, member: true }, { id: "ans-02", request: 12, member: false }];
  const old = answers.filter((a) => a.request === 12).map((a) => a.id).sort()[0];
  const neu = answers.filter((a) => a.request === 12 && !a.member).map((a) => a.id).sort()[0];
  console.log("   v1.27 selector →", old, "| v1.28 selector →", neu);
  ok(old === "ans-01", "v1.27: least id over ALL stored answers picks the hidden collision member " + old + " — the promised new-id recovery is unreachable");
  ok(neu === "ans-02", "v1.28: least id over verified, non-member, non-withdrawn answers picks " + neu);
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
