/* rig184 — Sol appendix pass 35 / Protocol pass 1 (A1, B1, B2, B3) executed BEFORE editing. Node model; synthetic.
   ADVERSARIAL READ (X-series, cowork's own, recorded before the edits):
   X1 A1's repair choice: a NEW defect (REGISTRATION_INSTANCE_ID_REUSED) vs. widening ROUTE_IDENTITY_COLLISION to
      {producer_key, registration_instance_id}. The widening would make a same-instance different-version pair the
      SAME defect as an exact duplicate route, losing which of the two happened; the new defect keeps both
      distinguishable and carries the sorted route identities so two reducers canonicalise identically. NEW defect.
   X2 B1: does response_attempt_id leak into any identity? It must be excluded from the transport digest (else a
      replay is no longer transport-exact) and from receipts (else the stored result differs per attempt). T2
      asserts the transport identity and the stored receipt are unchanged across attempts.
   X3 B1: can two attempts of one replay both release EXACT? Yes and harmlessly — each attempt is its own state
      over the SAME immutable result; the serialized release step still selects exact vs envelope per attempt.
   X4 B2: on the authorized exact path the source learns its own disposition — that is the purpose of the path,
      not leakage; the inventory must SAY it. Inference about replay / admission / recovery from exact timing is
      ACCEPTED for the authorized principal (§P6 (c), owner-visible); an unauthorized principal never reaches it.
   X5 B3: after the rewrite the check must be clause coverage — every normative clause a complete sentence with a
      stable id — not substring presence. T4 runs that check on the new §P1/§P2 text. */
const assert = require("node:assert");
const JP = JSON.stringify;
const canon = (x) => JSON.stringify(sortKeys(x));
function sortKeys(x) { if (Array.isArray(x)) return x.map(sortKeys); if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x).sort()) o[k] = sortKeys(x[k]); return o; } return x; }
const out = []; const log = (s) => { out.push(s); console.log(s); };
let pass = 0, total = 0; const T = (name, f) => { total++; try { f(); pass++; log("PASS " + name); } catch (e) { log("FAIL " + name + " — " + (e && e.message)); } };

/* ---------- T1: registration_instance_id reuse has no closed defect (A1) ---------- */
const routeId = (r) => ({ kind: r.kind, producer_id: r.producer_id, registration_version: r.version, registration_instance_id: r.instance });
const pk = (r) => ({ kind: r.kind, producer_id: r.producer_id });
function stage1_v136(entries) {           /* the v1.36 enum: MALFORMED · COLLISION {identity} · PRESENCE_MISSING_OR_INVALID */
  const defects = []; const seen = new Map();
  entries.forEach((r, i) => {
    if (!r.kind || !r.producer_id || r.version == null || r.instance == null) { defects.push({ code: "ROUTE_IDENTITY_MALFORMED", position: i }); return; }
    const k = canon(routeId(r)); if (seen.has(k)) defects.push({ code: "ROUTE_IDENTITY_COLLISION", identity: routeId(r) }); seen.set(k, true);
    if (r.presence !== "PRESENT" && r.presence !== "REMOVED") defects.push({ code: "REGISTRATION_PRESENCE_MISSING_OR_INVALID", identity: routeId(r) });
  });
  return defects;
}
function stage1_v137(entries) {           /* v1.37: + REGISTRATION_INSTANCE_ID_REUSED {producer_key, registration_instance_id, sorted_route_identities} */
  const defects = stage1_v136(entries); const byInst = new Map();
  for (const r of entries) { if (!r.kind || !r.producer_id || r.version == null || r.instance == null) continue; const k = canon({ pk: pk(r), i: r.instance }); byInst.set(k, (byInst.get(k) || []).concat([routeId(r)])); }
  for (const [k, ids] of byInst) { const distinct = new Set(ids.map(canon)); if (distinct.size > 1) defects.push({ code: "REGISTRATION_INSTANCE_ID_REUSED", producer_key: ids[0] && pk({ kind: ids[0].kind, producer_id: ids[0].producer_id }), registration_instance_id: ids[0].registration_instance_id, sorted_route_identities: [...distinct].sort().map((s) => JSON.parse(s)) }); }
  return defects.map((d) => canon(d)).sort().map((s) => JSON.parse(s));   /* deduplicated, sorted by canonical_encode */
}
const stage3_cardinality = (entries) => { const present = entries.filter((r) => r.presence === "PRESENT"); const c = new Map(); for (const r of present) { const k = canon(pk(r)); c.set(k, (c.get(k) || 0) + 1); } return [...c.values()].some((n) => n > 1) ? [{ code: "PRESENT_INCARNATION_CARDINALITY" }] : []; };
const r1 = { kind: "AUTHORITATIVE_SOURCE", producer_id: "S", version: 7, instance: 4, presence: "REMOVED" };
const r2 = { kind: "AUTHORITATIVE_SOURCE", producer_id: "S", version: 8, instance: 4, presence: "PRESENT", active: true };
T("T1a v1.36: Sol's witness yields an EMPTY defect set although instance 4 was reused (the promised check has no defect)", () => {
  const d = stage1_v136([r1, r2]).concat(stage3_cardinality([r1, r2])); assert.deepStrictEqual(d, []);
  /* two lawful reducers under v1.36: A binds r2's bound (VALID); B honours "never reused" and abstains — the contract cannot say why */
  const A = { verdict: "VALID", bound: "r2" }, B = { verdict: "ABSTAIN", reason: "instance reused — no code for it" };
  assert.notStrictEqual(A.verdict, B.verdict);
});
T("T1b v1.37: both reducers compute the SAME canonical defect set — INVALID {REGISTRATION_INSTANCE_ID_REUSED}", () => {
  const dA = stage1_v137([r1, r2]), dB = stage1_v137([r2, r1]);   /* entry order must not matter */
  assert.strictEqual(canon(dA), canon(dB)); assert.strictEqual(dA.length, 1); assert.strictEqual(dA[0].code, "REGISTRATION_INSTANCE_ID_REUSED");
  assert.deepStrictEqual(dA[0].producer_key, { kind: "AUTHORITATIVE_SOURCE", producer_id: "S" }); assert.strictEqual(dA[0].registration_instance_id, 4);
  assert.strictEqual(dA[0].sorted_route_identities.length, 2);
  log("   defect: " + canon(dA[0]));
});
T("T1c v1.37: a lawful history (instance 4 REMOVED, instance 5 PRESENT) stays VALID; an exact duplicate route is still ROUTE_IDENTITY_COLLISION, not reuse", () => {
  const ok = [{ ...r1 }, { ...r2, instance: 5 }]; assert.deepStrictEqual(stage1_v137(ok), []);
  const dup = [{ ...r2 }, { ...r2 }]; const d = stage1_v137(dup); assert.deepStrictEqual(d.map((x) => x.code), ["ROUTE_IDENTITY_COLLISION"]);
});
T("T1d v1.37: reuse across DIFFERENT producer_keys is not reuse (allocation is per producer_key)", () => {
  const m = [{ ...r2 }, { kind: "D14_1_METHOD", producer_id: "M", version: 1, instance: 4, presence: "PRESENT", active: true }];
  assert.deepStrictEqual(stage1_v137(m), []);
});

/* ---------- T2: response state identity (B1) ---------- */
function makeAuthority(keyResponseBy) {
  const groups = new Map();      /* transport identity → { complete, receipt } */
  const responses = new Map();   /* key → state */
  let attemptSeq = 0;
  return {
    arrive(transportId, now) { const attempt = "att-" + (++attemptSeq); const key = keyResponseBy === "attempt" ? attempt : transportId;
      if (!responses.has(key)) responses.set(key, { state: "PENDING", arrived_at: now, attempt });
      if (!groups.has(transportId)) groups.set(transportId, { complete: false, receipt: null });
      return { key, attempt }; },
    complete(transportId, receipt) { const g = groups.get(transportId); g.complete = true; g.receipt = receipt; },
    tryExact(key, transportId) { const s = responses.get(key), g = groups.get(transportId); if (s.state !== "PENDING" || !g.complete) return null; s.state = "EXACT_RELEASED"; return { exact: g.receipt }; },
    deadline(key) { const s = responses.get(key); if (s.state === "PENDING") s.state = "ENVELOPE_RELEASED"; return s.state; },
    state(key) { return responses.get(key).state; }, receipt(t) { return groups.get(t).receipt; }, attempts() { return attemptSeq; },
  };
}
const transportDigest = (env) => canon({ src: env.src, body: env.body });   /* response_attempt_id is NOT in the digest */
T("T2a under v1.0 both readings fit the words and DIVERGE: keyed by transport identity the replay can never get the exact result", () => {
  const byT = makeAuthority("transport"), env = { src: "S", body: "b1" }, Tid = transportDigest(env);
  const a1 = byT.arrive(Tid, 0); assert.strictEqual(byT.deadline(a1.key), "ENVELOPE_RELEASED");   /* group unfinished at the deadline */
  byT.complete(Tid, { receipt: 11, disposition: "ACCEPTED" });
  const a2 = byT.arrive(Tid, 10); assert.strictEqual(byT.tryExact(a2.key, Tid), null); assert.strictEqual(byT.state(a2.key), "ENVELOPE_RELEASED");   /* inherited */
  const byArr = makeAuthority("attempt");
  const b1 = byArr.arrive(Tid, 0); byArr.deadline(b1.key); byArr.complete(Tid, { receipt: 11, disposition: "ACCEPTED" });
  const b2 = byArr.arrive(Tid, 10); assert.deepStrictEqual(byArr.tryExact(b2.key, Tid), { exact: { receipt: 11, disposition: "ACCEPTED" } });
  log("   keyed-by-transport: replay → " + byT.state(a2.key) + " · keyed-by-arrival: replay → " + byArr.state(b2.key));
});
T("T2b v1.1: response_attempt_id per arrival; attempt 1 ENVELOPE_RELEASED stays; attempt 2 (the replay) EXACT_RELEASED; ONE group, ONE receipt, transport identity unchanged", () => {
  const A = makeAuthority("attempt"), env = { src: "S", body: "b1" }, Tid = transportDigest(env);
  const a1 = A.arrive(Tid, 0); assert.strictEqual(A.deadline(a1.key), "ENVELOPE_RELEASED");
  A.complete(Tid, { receipt: 11, disposition: "ACCEPTED" });
  const a2 = A.arrive(Tid, 10); assert.strictEqual(transportDigest({ ...env, response_attempt_id: a2.attempt }), Tid);   /* X2: excluded from the digest */
  assert.deepStrictEqual(A.tryExact(a2.key, Tid), { exact: { receipt: 11, disposition: "ACCEPTED" } });
  assert.strictEqual(A.state(a1.key), "ENVELOPE_RELEASED"); assert.strictEqual(A.state(a2.key), "EXACT_RELEASED");
  assert.strictEqual(A.receipt(Tid).receipt, 11); assert.strictEqual(A.attempts(), 2);
  /* the deadline on attempt 2 after its exact release changes nothing: compare-and-set from PENDING only */
  assert.strictEqual(A.deadline(a2.key), "EXACT_RELEASED");
});
T("T2c v1.1: an exact release after the deadline transition is impossible for the SAME attempt (CAS from PENDING only)", () => {
  const A = makeAuthority("attempt"), Tid = "t"; const a = A.arrive(Tid, 0); A.complete(Tid, { receipt: 1 }); A.deadline(a.key); assert.strictEqual(A.tryExact(a.key, Tid), null); assert.strictEqual(A.state(a.key), "ENVELOPE_RELEASED");
});

/* ---------- T3: leakage inventory by path (B2) ---------- */
function observe(path, ready, authorized, kind) {
  const DEADLINE = 1000;
  if (authorized && ready) return { at: 250 + (kind === "recovery" ? 200 : 0), bytes: canon({ receipt: 11, disposition: kind === "refused" ? "REFUSED" : "ACCEPTED" }) };   /* the exact path */
  return { at: DEADLINE, bytes: canon({ status: 200, body: "X".repeat(64) }) };   /* the envelope: one class */
}
T("T3a the ENVELOPE path: hit, miss, recovery-then-hit, unverifiable, unauthorized — ONE observable class (same bytes, same time)", () => {
  const obs = ["hit", "miss", "recovery", "unverifiable", "unauthorized"].map((k) => observe("env", false, k !== "unauthorized", k));
  assert.strictEqual(new Set(obs.map(canon)).size, 1);
});
T("T3b the AUTHORIZED EXACT path DISCLOSES disposition and readiness time — so a global 'never disposition' is FALSE; the inventory must be by path", () => {
  const acc = observe("exact", true, true, "hit"), ref = observe("exact", true, true, "refused"), rec = observe("exact", true, true, "recovery");
  assert.notStrictEqual(acc.bytes, ref.bytes);                 /* disposition disclosed */
  assert.notStrictEqual(acc.at, rec.at);                       /* release timing distinguishes recovery on the exact path */
  assert.ok(acc.at < 1000 && observe("env", false, true, "hit").at === 1000);   /* early release distinguishes exact from envelope */
  log("   exact path leaks {receipt, disposition, release time}; envelope path leaks nothing but 'no exact before the deadline'");
});

/* ---------- T4: clause coverage of Protocol v1.1 (B3) ---------- */
T("T4 Protocol v1.1 §P1/§P2: every normative clause has a stable id, is a complete sentence, no fragment survives; registration-current stated whole", () => {
  const fs = require("node:fs"); const p = process.env.PROTOCOL || "/home/claude/sheet/EARNED-SOURCE-INGESTION-PROTOCOL-v1.1.txt";
  if (!fs.existsSync(p)) throw new Error("protocol v1.1 not written yet");
  const txt = fs.readFileSync(p, "utf8"); const norm = txt.split("\n§P3")[0];
  const clauses = [...norm.matchAll(/^[ \t]*\[(P[12]\.\d+)\][ \t]([\s\S]*?)(?=\n[ \t]*\n|(?![\s\S]))/gm)].map((m) => ({ id: m[1], text: m[2].replace(/\s+/g, " ").trim() }));
  assert.ok(clauses.length >= 20, "clauses found " + clauses.length);
  const ids = clauses.map((c) => c.id); assert.strictEqual(new Set(ids).size, ids.length, "duplicate ids");
  for (const c of clauses) { assert.ok(/[.;:]$/.test(c.text) && /^[A-Z(]/.test(c.text), "fragment: " + c.id + " → " + c.text.slice(0, 80)); assert.ok(c.text.split(" ").length >= 8, "too short: " + c.id); }
  for (const frag of ["group);", "a removal flips", "a CONTENT\n", "the same way. THREE"]) assert.ok(!norm.includes(frag), "fragment survived: " + frag);
  assert.ok(/registration-current\s*=\s*registration_presence = PRESENT AND active = true/i.test(norm.replace(/\s+/g, " ")), "registration-current not stated whole");
  assert.ok(/response_attempt_id/.test(norm) && /ENVELOPE PATH/.test(txt) && /AUTHORIZED EXACT PATH/.test(txt));
  log("   " + clauses.length + " normative clauses, all complete");
});

log(`rig184: ${pass}/${total}`);
require("node:fs").writeFileSync(__dirname + "/rig184.log", out.join("\n") + "\n");
process.exit(pass === total ? 0 : 1);
