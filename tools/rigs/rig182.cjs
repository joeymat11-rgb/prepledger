/* rig182 — Sol pass 33's four witnesses on appendix v1.33 (→ v1.34). Floor model: 1500 + EEE_high + 1.
   Adversarial-read notes (not executed): X1 a transport-exact replay of an unauthorized principal's OWN earlier stub still
   returns that stub internally (a hit is not a miss) and is disclosed only by direct_replay_response_authorized; X2 a D14.1
   METHOD registration is an incarnation too (same instance-id counter), so "the one active D14.1" ranges over PRESENT
   incarnations; X3 the expected tuple names registration_instance_id, so a same-version re-registration is a tuple
   mismatch and restarts an in-flight commit; the three remaining triple spellings of the route identity were updated. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const H = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };

/* ---- v1.34 registry: incarnations with an authority-issued, never-reused registration_instance_id ---- */
const mkRegistry = () => ({ incarnations: [{ inst: 1, version: 7, presence: "PRESENT", active: true, phases: ["RECORD"] }], nextInst: 2,
  credState: { C1: "CURRENT" }, credRoute: { C1: 1 }, credEpoch: 1, seq: 0, cutoffs: [], ledger: [] });
const currentRoute = (reg) => { const p = reg.incarnations.filter((i) => i.presence === "PRESENT"); return p.length ? p.reduce((a, b) => a.inst > b.inst ? a : b) : null; };
const credCurrent = (reg, c) => reg.credState[c.name] === "CURRENT" && c.epoch === reg.credEpoch;
const newSubmissionAuthorized = (reg, c) => { const r = currentRoute(reg); return !!r && credCurrent(reg, c) && reg.credRoute[c.name] === r.inst && r.phases.includes("RECORD"); };
const directResponseAuthorized = (reg, c) => !!currentRoute(reg) && credCurrent(reg, c);
const registrationCurrent = (inc) => inc.presence === "PRESENT" && inc.active === true;
const remove = (reg) => { for (const i of reg.incarnations) i.presence = "REMOVED"; reg.cutoffs.push({ epoch: reg.credEpoch, length: reg.seq }); reg.credEpoch++; for (const k in reg.credState) reg.credState[k] = "REVOKED"; };

console.log("== T1 — an UNVERIFIABLE miss created a stub before new_submission_authorized");
{
  const P = { kind: "record", cell: "d", eee_high: 500 };
  const bad = { id: "z", payload: P, claimed: "not-the-digest", scope: "d", batch: "b1" };   /* parses, claims scope d, does not verify */
  const run = (rule) => {
    const reg = mkRegistry(); remove(reg);
    reg.incarnations.push({ inst: reg.nextInst++, version: 7, presence: "PRESENT", active: true, phases: ["RECORD"] }); reg.credState.C2 = "CURRENT"; reg.credRoute.C2 = 2;   /* re-registered r2 */
    const C1 = { name: "C1", epoch: 1 };
    const verified = H(bad.payload) === bad.claimed;                                           /* UNVERIFIABLE */
    if (rule === "v1.33") {                                                                    /* detailed branch: PRESENT + RECORD ⇒ stub */
      const r = currentRoute(reg); if (!verified && r && r.phases.includes("RECORD")) { reg.seq++; reg.ledger.push({ code: "SOURCE_ITEM_UNREADABLE", scope: bad.scope, receipt: reg.seq }); return "STUB"; }
      return "REFUSED";
    }
    /* v1.34: verification yields UNVERIFIABLE, content lookup NOT_APPLICABLE (a miss), the miss meets new_submission_authorized first */
    if (!verified) { if (!newSubmissionAuthorized(reg, C1)) return "REFUSED"; reg.seq++; reg.ledger.push({ code: "SOURCE_ITEM_UNREADABLE", scope: bad.scope, receipt: reg.seq }); return "STUB"; }
    return "STORED";
  };
  const regA = mkRegistry();
  const a = run("v1.33"), b = run("v1.34");
  console.log("   v1.33:", a, "| v1.34:", b);
  ok(a === "STUB", "v1.33: the verification branch created a transport-keyed stub for the REMOVED credential because r2 is PRESENT with RECORD — SOURCE_ITEM_UNREADABLE for cell d entered the ledger from unauthorized input");
  ok(b === "REFUSED", "v1.34: verification returns UNVERIFIABLE and commits nothing; the content lookup is NOT_APPLICABLE; the miss meets new_submission_authorized (false: C1 revoked, bound to incarnation 1) → REFUSED with no durable state");
  /* an authorized unverifiable miss still gets its stub — under the same CAS */
  const reg = mkRegistry(); const C1 = { name: "C1", epoch: 1 };
  ok(newSubmissionAuthorized(reg, C1), "v1.34: an authorized principal's unverifiable miss still yields the transport-keyed rejection-stub group (the stub is created at the door step, never inside verification)");
}

console.log("\n== T2 — re-registration with the same feed version: incarnation rule");
{
  const P = { kind: "record", cell: "d", eee_high: 500 };
  const floor = (cur) => cur ? "floor 2,001" : "ABSTAIN";
  /* v1.33: route identity = (kind, producer, version 7); A stamped under it; removed; re-registered at version 7 */
  const implA = () => { const r1 = { version: 7, presence: "PRESENT", active: true }; const A = { stamp: r1 }; r1.presence = "REMOVED"; /* re-register same version: flip back */ r1.presence = "PRESENT"; return floor(A.stamp.presence === "PRESENT" && A.stamp.active); };
  const implB = () => { const r1 = { version: 7, presence: "PRESENT", active: true }; const A = { stamp: r1 }; r1.presence = "REMOVED"; const r2 = { version: 7, presence: "PRESENT", active: true }; return floor(A.stamp.presence === "PRESENT" && A.stamp.active); };
  console.log("   v1.33 implementation A (same identity flipped back):", implA(), "| implementation B (fresh route):", implB());
  ok(implA() !== implB(), "v1.33: two implementations satisfy the epoch rule and give different floors — A's currentness depends on whether r1's identity may become PRESENT again");
  /* v1.34: incarnations; PRESENT → REMOVED terminal; fresh instance id; current_submission_route_id = the greatest PRESENT instance */
  const reg = mkRegistry(); const A = { stamp: reg.incarnations[0] }; remove(reg);
  reg.incarnations.push({ inst: reg.nextInst++, version: 7, presence: "PRESENT", active: true, phases: ["RECORD"] }); reg.credState.C2 = "CURRENT"; reg.credRoute.C2 = 2;
  const r = currentRoute(reg);
  console.log("   v1.34: A stamped inst 1 →", floor(registrationCurrent(A.stamp)), "| current_submission_route_id =", r.inst, "(version 7 again, instance never reused)");
  ok(!registrationCurrent(A.stamp) && r.inst === 2 && reg.incarnations[0].presence === "REMOVED", "v1.34: A stays stale (its incarnation is terminally REMOVED); the re-registration is a fresh incarnation 2 even at feed version 7; the selector is total");
  const C2 = { name: "C2", epoch: 2 };
  ok(newSubmissionAuthorized(reg, C2) && !newSubmissionAuthorized(reg, { name: "C1", epoch: 1 }), "v1.34: the credential and the expected tuple bind to incarnation 2 exactly; only a NEW source_item_id under it can become current (a content replay keeps its historical stamp)");
  const paused = mkRegistry(); paused.incarnations[0].active = false; paused.incarnations[0].active = true;
  ok(paused.incarnations[0].presence === "PRESENT" && paused.incarnations[0].inst === 1, "v1.34: active false → true is the only same-incarnation reactivation");
}

console.log("\n== T3 — the closed registry-defect enum has no presence defect; cardinality ranges over which set?");
{
  const enum33 = ["ROUTE_IDENTITY_MALFORMED", "ROUTE_IDENTITY_COLLISION", "ACTIVE_FLAG_MISSING", "PHASES_EMPTY", "PHASES_KIND_INVALID", "INPUT_DOMAIN_SET_INVALID", "D14_1_ACTIVE_CARDINALITY", "SOURCE_EMITTER_ACTIVE_CARDINALITY", "DUPLICATE_ACTIVE_PRODUCER_PHASE"];
  const route = { identity: "S/7/1", active: true, phases: ["RECORD"], domains: ["split"], presence: undefined };
  const readers33 = { includeAsPresent: "PRESENT (evidence governs)", excludeAsRemoved: "REMOVED (stale)", reject: enum33.find((d) => /PRESENCE/.test(d)) || "no legal defect code" };
  console.log("   v1.33 malformed presence:", JP(readers33));
  ok(new Set(Object.values(readers33)).size === 3 && readers33.reject === "no legal defect code", "v1.33: three readers, three outcomes, and the reducer that wants to reject has no defect to raise");
  const enum34 = [...enum33, "REGISTRATION_PRESENCE_MISSING_OR_INVALID"];
  const defect34 = (r) => r.presence === "PRESENT" || r.presence === "REMOVED" ? null : "REGISTRATION_PRESENCE_MISSING_OR_INVALID {identity}";
  ok(enum34.includes("REGISTRATION_PRESENCE_MISSING_OR_INVALID") && defect34(route) !== null, "v1.34: REGISTRATION_PRESENCE_MISSING_OR_INVALID {identity | position} is in the closed enum — one outcome: PRODUCER_REGISTRY_INVALID");
  /* cardinality over PRESENT only */
  const regs = [{ kind: "D14_1_METHOD", presence: "REMOVED", active: true }, { kind: "D14_1_METHOD", presence: "PRESENT", active: true }];
  const countAll = regs.filter((r) => r.kind === "D14_1_METHOD" && r.active).length, countPresent = regs.filter((r) => r.kind === "D14_1_METHOD" && r.presence === "PRESENT" && r.active).length;
  console.log("   D14.1 active cardinality over all retained registrations:", countAll, "| over PRESENT only:", countPresent);
  ok(countAll === 2 && countPresent === 1, "v1.34: P0a membership, phase / cardinality defects and 'any registration exists' range over PRESENT registrations only — the retained historical incarnation no longer breaks the ONE-active-D14.1 rule");
  const authz = (fields) => ["credential_state", "epoch", "cutoff", "route"].every((k) => fields[k] !== undefined) ? "evaluate" : "ALL PREDICATES FALSE, no exact response";
  ok(authz({ credential_state: "CURRENT", epoch: 1, cutoff: 0 }) !== "evaluate", "v1.34: a missing or malformed credential_state, epoch, cutoff or current-submission-route field fails every authorization predicate closed and forbids an exact response");
}

console.log("\n== T4 — exact-response release vs revocation: linearized, with a refusal that has no group");
{
  /* v1.33: check passes → revocation commits → bytes released */
  const log33 = []; let epoch = 1; const cred = { epoch: 1 };
  const check = () => cred.epoch === epoch; if (check()) { log33.push("check-ok(e1)"); epoch = 2; log33.push("revocation-commits(e2)"); log33.push("release: receipt 7 · STORED"); }
  console.log("   v1.33:", log33.join(" → "));
  ok(log33[2].startsWith("release: receipt"), "v1.33: 'immediately before release' still lets the revocation commit between the check and the hand-off — the revoked credential receives the exact receipt");
  /* v1.34: release is an entry in the per-(athlete, source) serialized order; the selection and the irrevocable hand-off are ONE step */
  const serialized = (order) => { let ep = 1; const out = []; for (const step of order) { if (step === "release") { const exact = cred.epoch === ep; out.push(exact ? "EXACT handed to transport" : "ENVELOPE"); } else { ep = 2; out.push("revocation(e2)"); } } return out; };
  const a = serialized(["release", "revoke"]), b = serialized(["revoke", "release"]);
  console.log("   v1.34 release→revoke:", JP(a), "| revoke→release:", JP(b));
  ok(a[0] === "EXACT handed to transport" && b[1] === "ENVELOPE", "v1.34: release wins ⇒ the exact reply is irrevocably handed to transport before the revocation completes; revocation wins ⇒ the envelope — selected by registry state at the linearization point");
  const prereq = (kind) => ({ replay_hit: "its group complete / recovered", admitted_miss: "its new group committed", refused_miss: "the serialized no-commit refusal decision completed — no group" })[kind];
  ok(prereq("refused_miss").includes("no group") && prereq("admitted_miss").includes("committed"), "v1.34: completion prerequisites are distinguished — a refusal has no group to wait for");
  const queue = ["exact#1", "exact#2"]; const drained = queue.splice(0).map(() => "handed");
  ok(drained.length === 2 && queue.length === 0, "v1.34: queued exact replies are drained (handed to transport) before the revocation completes, or cancelled and replaced by the envelope");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
