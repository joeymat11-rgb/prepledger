/* rig180 — Sol pass 31's three witnesses on appendix v1.31 (→ v1.32).
   Adversarial-read notes (not executed): X1 the generic response is the SAME bytes for a hit, a miss and a refused miss, so
   the refusal itself is not an oracle; X2 an INACTIVE registration's connector keeps receiving exact results (a pause is the
   athlete's, not a revocation) and its new content is still admitted (active flag read at evaluation, rig172 Y3); X3 the
   §D14-G epoch list names REVOKED and a credential-epoch change; "currently admitted" = a current registration declaring RECORD. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const H = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };

/* one content I = {x, c} carried by two legal transport identities T1, T2 (different non-volatile envelope) */
const P = { kind: "record", cell: "d", eee_high: 500 };
const sub = (batch) => ({ id: "x", payload: P, claimed: H(P), batch });
const R = sub("b1"), R_T2 = sub("b2");
const tid = (s) => H({ id: s.id, payload: s.payload, claimed: s.claimed, batch: s.batch });
const cid = (s) => s.id + "|" + s.claimed;

console.log("== T1 — content-identity replay behind the current-registration door partitions one content identity by transport");
{
  const mk = () => ({ reg: true, byT: new Map(), byC: new Map(), receipt: 0 });
  const ingest31 = (st, s) => {                       /* v1.31 order: transport replay → DOOR on a miss → verification → content replay */
    const t = tid(s); if (st.byT.has(t)) return "ORIGINAL_RESULT";
    if (!st.reg) return "REFUSED_CURRENT_DOOR";
    if (H(s.payload) !== s.claimed) { st.byT.set(t, "STUB"); return "STUB"; }
    const c = cid(s); if (st.byC.has(c)) { st.byT.set(t, st.byC.get(c)); return "ORIGINAL_RESULT"; }
    st.receipt++; st.byC.set(c, "STORED#" + st.receipt); st.byT.set(t, "STORED#" + st.receipt); return "STORED";
  };
  const ingest32 = (st, s) => {                       /* v1.32 order: transport replay → verification → content replay → DOOR only if BOTH miss */
    const t = tid(s); if (st.byT.has(t)) return "ORIGINAL_RESULT";
    if (H(s.payload) !== s.claimed) { if (!st.reg) return "REFUSED_NO_STUB"; st.byT.set(t, "STUB"); return "STUB"; }
    const c = cid(s); if (st.byC.has(c)) { st.byT.set(t, st.byC.get(c)); return "ORIGINAL_RESULT"; }
    if (!st.reg) return "REFUSED_CURRENT_DOOR";
    st.receipt++; st.byC.set(c, "STORED#" + st.receipt); st.byT.set(t, "STORED#" + st.receipt); return "STORED";
  };
  const run = (ingest) => {
    const a = mk(); ingest(a, R); a.reg = false; const sameT = ingest(a, R), newT = ingest(a, R_T2);
    const b = mk(); ingest(b, R); const newTcurrent = ingest(b, R_T2);
    return { sameT_afterRemoval: sameT, newT_afterRemoval: newT, newT_whileCurrent: newTcurrent };
  };
  const r31 = run(ingest31), r32 = run(ingest32);
  console.log("   v1.31:", JP(r31)); console.log("   v1.32:", JP(r32));
  ok(r31.sameT_afterRemoval === "ORIGINAL_RESULT" && r31.newT_afterRemoval === "REFUSED_CURRENT_DOOR" && r31.newT_whileCurrent === "ORIGINAL_RESULT",
     "v1.31: one content identity answers ORIGINAL / REFUSED / ORIGINAL depending on transport and registry — the declared single ingestion state is partitioned by transport representation");
  ok(Object.values(r32).every((v) => v === "ORIGINAL_RESULT"),
     "v1.32: verification and the content-replay lookup precede the door, so every representation of I returns the holder's original result; only a miss on BOTH lookups meets the door");
  /* an unverifiable transport miss: unregistered → refused without a stub; admitted → transport-keyed stub */
  const G = { id: "x", payload: { ...P, eee_high: 300 }, claimed: H(P), batch: "b3" };
  const u = mk(); u.reg = false; const v = mk();
  ok(ingest32(u, G) === "REFUSED_NO_STUB" && ingest32(v, G) === "STUB", "v1.32: an unverifiable transport miss is REFUSED without a stub for an unregistered source and a transport-keyed stub for an admitted one");
}

console.log("\n== T2 — a removed principal holding its old credential as a replay-hit / disposition oracle");
{
  const replies31 = { hit: "receipt 7 · STORED", miss: "REFUSED" };                    /* v1.31: the hit is disclosed whatever the registry says */
  const authorized = (p) => p.epoch === p.registryEpoch && (p.state === "ACTIVE" || p.state === "INACTIVE");
  const reply32 = (p, internal) => authorized(p) ? internal : "ACKNOWLEDGED";       /* v1.32: one generic non-oracular response when unauthorized */
  const removed = { epoch: 3, registryEpoch: 4, state: "REMOVED" }, revoked = { epoch: 3, registryEpoch: 4, state: "REVOKED" }, live = { epoch: 4, registryEpoch: 4, state: "ACTIVE" }, paused = { epoch: 4, registryEpoch: 4, state: "INACTIVE" };
  const probe31 = [replies31.hit, replies31.miss], probe32 = [reply32(removed, "receipt 7 · STORED"), reply32(removed, "MISS")];
  console.log("   v1.31 removed principal probing {hit, miss}:", JP(probe31), "| v1.32:", JP(probe32), "| revoked:", JP([reply32(revoked, "receipt 7 · STORED"), reply32(revoked, "MISS")]));
  ok(probe31[0] !== probe31[1], "v1.31: a removed connector distinguishes a hit from a miss and reads the receipt and disposition — an indefinite oracle");
  ok(probe32[0] === probe32[1] && reply32(revoked, "receipt 7 · STORED") === reply32(revoked, "MISS"), "v1.32: historical_principal_verified permits the internal lookup and recovery, but direct_replay_response_authorized is false for REMOVED and REVOKED — the response is one identical ACKNOWLEDGED for hit and miss alike");
  ok(reply32(live, "receipt 7 · STORED") === "receipt 7 · STORED" && reply32(paused, "MISS") === "MISS", "v1.32: an ACTIVE or routinely INACTIVE registration under the current credential epoch still receives its exact receipt and disposition");
  const stale = { epoch: 3, registryEpoch: 4, state: "ACTIVE" };                       /* re-registered with a new credential epoch; the old credential is presented */
  ok(!authorized(stale), "v1.32: after re-registration the OLD credential epoch is below the signed cutoff — historical only, generic response");
}

console.log("\n== T3 — RESULT CONTRACT's 'a keyed content identity, never the receipt' re-creates the claimed-{id, commitment} alias");
{
  const key = "athlete-secret";
  const hmac = (c) => crypto.createHmac("sha256", key).update(JP(c)).digest("hex").slice(0, 8);
  const G = { id: "x", payload: { ...P, eee_high: 300 }, claimed: H(P), batch: "b9" };   /* unverifiable: claims R's commitment over different bytes */
  const rowByContent = hmac({ src: "S", id: G.id, c: G.claimed });                        /* "keyed content identity" for a submission that HAS no content identity */
  const rIdentity = hmac({ src: "S", id: R.id, c: R.claimed });
  const rowByTransport = hmac({ src: "S", t: tid(G) });
  console.log("   R's keyed identity:", rIdentity, "| G's row keyed by claimed content:", rowByContent, "| by transport:", rowByTransport);
  ok(rowByContent === rIdentity, "v1.31 RESULT CONTRACT wording: the stub's ledger identity ALIASES the stored record's identity — the alias rig178 T1 closed, back through the contract");
  ok(rowByTransport !== rIdentity, "v1.32: the applicable replay identity — verified content identity for a verified shape stub, otherwise the content-bound transport identity — keeps the stub's row distinct");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
