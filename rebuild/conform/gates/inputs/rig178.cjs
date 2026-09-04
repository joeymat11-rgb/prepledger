/* rig178 — Sol pass 29's witnesses on appendix v1.29 (→ v1.30). Floor model: 1500 + EEE_high + 1.
   Adversarial-read notes (not executed): X1 the R2 carve-out and P1 must bind "every component whose finding is BOUND",
   never "every component claiming the scope"; X2 a transport replay of a submission whose group is incomplete still does
   group recovery first; X3 the title's own history summaries are annotated, not left stating old rules; X4 "bound beside
   the screen … exactly as a stub is" carries the bind condition inline. X5 / X6 below are executed. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const H = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };

console.log("== T1 — exact replay by CLAIMED identity bypasses verification");
{
  const P = { kind: "record", cell: "d", eee_high: 500 }, Pp = { kind: "record", cell: "d", eee_high: 300 };
  const R = { id: "x", payload: P, claimed: H(P) }, G = { id: "x", payload: Pp, claimed: H(P) };   /* G claims R's commitment; H(P′) ≠ c */
  const ledger29 = (subs) => {   /* v1.29 order: exact replay by {id, claimed} FIRST, then verification */
    const seen = new Map(), out = [];
    for (const s of subs) { const key = s.id + "|" + s.claimed;
      if (seen.has(key)) { out.push("REPLAY→" + seen.get(key)); continue; }
      if (H(s.payload) !== s.claimed) { out.push("REJECTION_STUB"); continue; }
      seen.set(key, "STORED"); out.push("STORED"); }
    return out;
  };
  const ledger30 = (subs) => {   /* v1.30: transport-exact replay by raw digest first; content replay only AFTER verification */
    const byTransport = new Map(), byContent = new Map(), out = [];
    for (const s of subs) { const t = H(s);
      if (byTransport.has(t)) { out.push("REPLAY→" + byTransport.get(t)); continue; }
      if (H(s.payload) !== s.claimed) { byTransport.set(t, "REJECTION_STUB"); out.push("REJECTION_STUB"); continue; }
      const key = s.id + "|" + s.claimed;
      if (byContent.has(key)) { byTransport.set(t, "REPLAY"); out.push("REPLAY→STORED"); continue; }
      byContent.set(key, "STORED"); byTransport.set(t, "STORED"); out.push("STORED"); }
    return out;
  };
  const a = ledger29([R, G]), b = ledger29([G, R]), c = ledger30([R, G]), d = ledger30([G, R]);
  console.log("   v1.29  R→G:", JP(a), "| G→R:", JP(b)); console.log("   v1.30  R→G:", JP(c), "| G→R:", JP(d));
  const stubs = (l) => l.filter((x) => x === "REJECTION_STUB").length;
  ok(stubs(a) !== stubs(b), "v1.29: R→G records NO stub (G is answered as a STORED replay for bytes that do not verify) while G→R records one — two ledgers by order");
  ok(stubs(c) === 1 && stubs(d) === 1 && c.includes("STORED") && d.includes("STORED"), "v1.30: verification precedes any content-identity replay — G is a transport-identity stub and R is STORED in both orders");
}

console.log("\n== T2 — a removed source's collision component as a permanent hard blocker");
{
  const reg = { r: true };
  const comp = { id: "x", members: [{ c: "c1", route: "r", scope: "d" }, { c: "c2", route: "r", scope: "d" }], withdrawn: false };
  const bind29 = (c, scope) => c.members.some((m) => m.scope === scope) && !c.withdrawn;                 /* every component claiming d, no currentness test */
  const scopeCurrent = (c, scope, r) => c.members.some((m) => m.scope === scope && r[m.route]);           /* hiding ignored */
  const bind30 = (c, scope, r) => scopeCurrent(c, scope, r) && !c.withdrawn;
  const before = { v29: bind29(comp, "d"), v30: bind30(comp, "d", reg) };
  reg.r = false;                                                                                        /* the registration is removed */
  const after = { v29: bind29(comp, "d"), v30: bind30(comp, "d", reg) };
  reg.r = true;
  const back = { v29: bind29(comp, "d"), v30: bind30(comp, "d", reg) };
  console.log("   route active:", JP(before), "| removed:", JP(after), "| reactivated:", JP(back));
  ok(after.v29 === true, "v1.29: with r removed the component still binds SOURCE_ITEM_IDENTITY_COLLISION on d — and the source, unregistered, cannot send the withdrawal the copy demands: a permanent blocker");
  ok(after.v30 === false && before.v30 === true && back.v30 === true, "v1.30: component_scope_current(C, d) is false once no member's stamp is registration-current → diagnostics only; reactivation brings the blocker back");
}

console.log("\n== T4 — the collision copy is false for N > 2 and for cross-kind components");
{
  const comp = { members: [{ kind: "record", c: "c1" }, { kind: "proof", c: "c2" }, { kind: "record", c: "c3" }] };
  const oldCopy = "{source} sent two different versions of one report. Earned isn't using either until {source} corrects it.";
  const newCopy = "{source} sent conflicting submissions under one item ID. Earned isn't using any of them until {source} corrects it.";
  const kinds = [...new Set(comp.members.map((m) => m.kind))];
  ok(comp.members.length === 3 && kinds.length === 2 && /two different versions|either/.test(oldCopy), "v1.29 copy says 'two' and 'either' for a legal 3-member, 2-kind component — false");
  ok(!/two|either|report\b/.test(newCopy), "v1.30 copy is count- and kind-neutral: " + JP(newCopy));
}

console.log("\n== X5 — a content replay returns the HOLDER's disposition whatever it is (member / shape stub); reduction is order-free");
{
  const P = { kind: "proof", cell: "d", domain_binding: null }, Q = { kind: "record", cell: "d", eee_high: 500 }, Q2 = { kind: "record", cell: "d", eee_high: 300 };
  const mk = (id, payload, batch) => ({ id, payload, claimed: H(payload), batch });   /* batch = a NON-volatile envelope field: in the transport digest, not in the content commitment */
  const wellFormed = (s) => s.payload.kind !== "proof" || !!s.payload.domain_binding;
  const ledger30 = (subs) => {
    const byT = new Map(), byC = new Map(), held = new Map(), comps = new Map(), out = [];
    for (const s of subs) { const t = H({ id: s.id, payload: s.payload, claimed: s.claimed, batch: s.batch });
      if (byT.has(t)) { out.push("T-REPLAY→" + byT.get(t)); continue; }
      if (H(s.payload) !== s.claimed) { byT.set(t, "REJECTION_STUB"); out.push("REJECTION_STUB"); continue; }
      const key = s.id + "|" + s.claimed;
      if (byC.has(key)) { byT.set(t, byC.get(key)); out.push("C-REPLAY→" + byC.get(key)); continue; }
      let d; if (!wellFormed(s)) d = "SHAPE_STUB";
      else if (held.has(s.id) && held.get(s.id) !== s.claimed) { d = "COLLISION_MEMBER"; comps.set(s.id, [held.get(s.id), s.claimed].sort()); }
      else { held.set(s.id, s.claimed); d = "STORED"; }
      byC.set(key, d); byT.set(t, d); out.push(d); }
    return { out, comps: JP([...comps.entries()].sort()), heldIds: JP([...held.keys()].sort()) };
  };
  const S = mk("x", P, "b1"), Sr = mk("x", P, "b9"), R = mk("y", Q, "b2"), G = mk("y", Q2, "b3"), Gr = mk("y", Q2, "b9");
  const a = ledger30([S, R, G, Sr, Gr]), b = ledger30([Gr, S, G, R, Sr]);
  console.log("   order 1:", JP(a.out), a.comps); console.log("   order 2:", JP(b.out), b.comps);
  ok(a.out.includes("C-REPLAY→SHAPE_STUB") && a.out.includes("C-REPLAY→COLLISION_MEMBER") && b.out.includes("C-REPLAY→STORED"), "v1.30: a resend in a new envelope is a CONTENT replay returning the holder's disposition — the shape stub's, the member's, the stored item's alike; nothing re-tested");
  ok(a.comps === b.comps && a.heldIds === b.heldIds && a.comps.includes("y"), "v1.30: the component for y (sorted commitments) and the held ids are identical in both orders; x is never consumed by the shape stub (which member carries the MEMBER label is arrival metadata — the reduction hides both)");
}

console.log("\n== X6 — an idempotency key ALONE vs a key bound to the canonical submission digest");
{
  const bad = { id: "z", payload: { kind: "record", cell: "d", eee_high: 100 }, claimed: "nope" };           /* unverifiable */
  const good = { id: "z", payload: { kind: "record", cell: "d", eee_high: 100 } }; good.claimed = H(good.payload);
  const keyAlone = (subs) => { const seen = new Map(), out = []; for (const s of subs) { if (seen.has(s.key)) { out.push("REPLAY→" + seen.get(s.key)); continue; } const d = H(s.payload) === s.claimed ? "STORED" : "REJECTION_STUB"; seen.set(s.key, d); out.push(d); } return out; };
  const keyBound = (subs) => { const seen = new Map(), out = []; for (const s of subs) { const t = s.key + "|" + H({ id: s.id, payload: s.payload, claimed: s.claimed }); if (seen.has(t)) { out.push("REPLAY→" + seen.get(t)); continue; } const d = H(s.payload) === s.claimed ? "STORED" : "REJECTION_STUB"; seen.set(t, d); out.push(d); } return out; };
  const subs = [{ ...bad, key: "k1" }, { ...good, key: "k1" }];                                              /* the source reuses k1 over corrected bytes */
  const a = keyAlone(subs), b = keyBound(subs);
  console.log("   key alone:", JP(a), "| key bound to digest:", JP(b));
  ok(a[1] === "REPLAY→REJECTION_STUB", "key alone: the corrected bytes are answered as a replay of the STUB — a valid record is lost behind a stale key");
  ok(b[1] === "STORED", "v1.30: the key is bound to the canonical submission digest, so the corrected bytes are a new submission and are STORED");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
