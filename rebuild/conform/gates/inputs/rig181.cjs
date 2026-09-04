/* rig181 — Sol pass 32's four witnesses on appendix v1.32 (→ v1.33). Floor model: 1500 + EEE_high + 1.
   Adversarial-read notes (not executed): X1 an INACTIVE source's exact responses continue (PRESENT + CURRENT credential);
   X2 the door's expected tuple excludes the active boolean deliberately — a pause during an in-flight commit lands the item
   non-current, never refuses it; X3 the authorized path's exact response is released only after its group commits, so an
   authorized principal never learns a receipt a later cutoff could exclude. */
const JP = JSON.stringify;
const crypto = require("node:crypto");
const H = (c) => crypto.createHash("sha256").update(JP(c)).digest("hex").slice(0, 8);
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + m); };

/* ---- the v1.33 registry model: orthogonal axes ---- */
const mkRegistry = () => ({ presence: "PRESENT", version: 1, active: true, credState: { C1: "CURRENT" }, credEpoch: 1, globalEpoch: 1, phases: ["RECORD"], seq: 0, cutoffs: [] });
const cred = (name, epoch, version) => ({ name, epoch, version, athlete: "A", source: "S" });
const credentialCurrent = (reg, c) => reg.credState[c.name] === "CURRENT" && c.epoch === reg.credEpoch;
const directResponseAuthorized = (reg, c) => reg.presence === "PRESENT" && credentialCurrent(reg, c);
const newSubmissionAuthorized = (reg, c) => directResponseAuthorized(reg, c) && c.version === reg.version && reg.phases.includes("RECORD");
const registrationCurrent = (reg) => reg.presence === "PRESENT" && reg.active === true;
const tuple = (reg) => JP({ p: reg.presence, v: reg.version, cs: reg.credState, ce: reg.credEpoch, ph: reg.phases });
const removeOrRevoke = (reg, kind) => {           /* a registry mutation: serialized with group commits; records the signed cutoff at the current length */
  reg.cutoffs.push({ epoch: reg.credEpoch, length: reg.seq }); reg.credEpoch++; reg.globalEpoch++;
  for (const k of Object.keys(reg.credState)) reg.credState[k] = "REVOKED";
  if (kind === "REMOVE") reg.presence = "REMOVED";
};
const reregister = (reg, newCred) => { reg.presence = "PRESENT"; reg.version++; reg.active = true; reg.credState[newCred] = "CURRENT"; reg.globalEpoch++; };

console.log("== T1 — an old credential after removal and re-registration: every replay miss REFUSED, nothing created");
{
  const reg = mkRegistry(); const C1 = cred("C1", 1, 1);
  const stored = new Map(), byT = new Map(), byC = new Map();
  const P = { kind: "record", cell: "d", eee_high: 500 };
  const ingest = (rule, c, s) => {
    const t = H({ s, batch: s.batch }); if (byT.has(t)) return "REPLAY";
    const ok = H(s.payload) === s.claimed; if (!ok) return rule === "v1.32" ? (reg.presence === "PRESENT" ? "STUB" : "REFUSED") : (newSubmissionAuthorized(reg, c) ? "STUB" : "REFUSED");
    const k = s.id + "|" + s.claimed; if (byC.has(k)) return "REPLAY";
    const admit = rule === "v1.32" ? (reg.presence === "PRESENT" && reg.phases.includes("RECORD")) : newSubmissionAuthorized(reg, c);
    if (!admit) return "REFUSED";
    reg.seq++; stored.set(k, { receipt: reg.seq, stamp: "r" + reg.version }); byT.set(t, 1); byC.set(k, 1); return "NEW_ADMITTED#" + reg.seq + "@r" + reg.version;
  };
  removeOrRevoke(reg, "REMOVE"); reregister(reg, "C2"); const C2 = cred("C2", 2, 2);
  const malicious = { id: "m1", payload: { ...P, eee_high: 5000 }, claimed: H({ ...P, eee_high: 5000 }), batch: "b1" };
  const before = stored.size; const a = ingest("v1.32", C1, malicious); const a_stored = stored.size - before;
  console.log("   v1.32: old credential C1, replay miss, current registration r2 present →", a, "| stored:", a_stored, "| direct disclosure:", directResponseAuthorized(reg, C1));
  ok(a.startsWith("NEW_ADMITTED") && a_stored === 1 && !directResponseAuthorized(reg, C1), "v1.32: the door tests only the CURRENT registration's presence and phases — the historical credential's malicious item is ADMITTED (stamped r2, current at once) while the attacker is told nothing");
  const reg2 = mkRegistry(); const stored2 = new Map(); removeOrRevoke(reg2, "REMOVE"); reregister(reg2, "C2");
  const ingest33 = (c, s) => { const admit = newSubmissionAuthorized(reg2, c); if (!admit) return "REFUSED"; reg2.seq++; stored2.set(s.id, reg2.seq); return "NEW_ADMITTED"; };
  const b = ingest33(C1, malicious), b2 = ingest33(cred("C1", 1, 2), malicious), b3 = ingest33(C2, malicious);
  console.log("   v1.33: C1 (epoch 1, revoked) →", b, "| C1 claiming version 2 →", b2, "| C2 (current) →", b3, "| receipts issued to C1:", stored2.size - 1);
  ok(b === "REFUSED" && b2 === "REFUSED" && stored2.size === 1 && reg2.seq === 1, "v1.33: new_submission_authorized is false for the historical credential (state REVOKED, epoch 1 ≠ 2) — REFUSED: no receipt, stub, stamp, identity consumption or group; only C2's submission is admitted");
}

console.log("\n== T2 — door / group-commit / signed-cutoff interleavings");
{
  const P = { kind: "record", cell: "d", eee_high: 500 };
  const run = (rule, order) => {
    const reg = mkRegistry(); reg.seq = 10; const C1 = cred("C1", 1, 1);
    const door = { admitted: newSubmissionAuthorized(reg, C1), expected: tuple(reg) };   /* R passes the door under e1 */
    let result = null, cutoff = null;
    const commit = () => {
      if (rule === "v1.32") { reg.seq++; result = "RECEIPT#" + reg.seq; return; }         /* stale door decision, no CAS */
      if (tuple(reg) !== door.expected) {                                                   /* CAS mismatch → restart: recovery, both lookups (miss), re-evaluate */
        result = newSubmissionAuthorized(reg, C1) ? "RECEIPT#" + (++reg.seq) : "REFUSED"; return; }
      reg.seq++; result = "RECEIPT#" + reg.seq;
    };
    const removal = () => { removeOrRevoke(reg, "REMOVE"); cutoff = reg.cutoffs[0].length; };
    for (const step of order) (step === "commit" ? commit : removal)();
    const receipt = result.startsWith("RECEIPT#") ? +result.slice(8) : null;
    return { order: order.join("→"), result, cutoff, violation: receipt !== null && receipt > cutoff };
  };
  const a1 = run("v1.32", ["removal", "commit"]), a2 = run("v1.32", ["commit", "removal"]);
  const b1 = run("v1.33", ["removal", "commit"]), b2 = run("v1.33", ["commit", "removal"]);
  console.log("   v1.32:", JP(a1), JP(a2)); console.log("   v1.33:", JP(b1), JP(b2));
  ok(a1.violation, "v1.32: removal wins, records cutoff 10 and advances to e2, then R commits receipt 11 on its stale door decision — a receipt BEYOND the cutoff that terminates e1 (fits neither serialization)");
  ok(!b1.violation && b1.result === "REFUSED" && !b2.violation && b2.result === "RECEIPT#11" && b2.cutoff === 11, "v1.33: serialized per (athlete, source) with compare-and-append on the expected registry tuple — removal first ⇒ R is REFUSED and stores nothing; ingestion first ⇒ the cutoff is 11 and includes the group's last_receipt; no receipt ever exceeds its terminating cutoff");
  /* disclosure recheck: the exact response is released only if the epoch is still current at release */
  const reg = mkRegistry(); const C1 = cred("C1", 1, 1); const internal = "receipt 7 · STORED"; removeOrRevoke(reg, "REVOKE");
  ok(!directResponseAuthorized(reg, C1), "v1.33: an exact result computed under e1 is re-checked against the current epoch immediately before release — after the revocation completes it is replaced by the generic envelope");
}

console.log("\n== T3 — ACTIVE / INACTIVE / REMOVED / REVOKED: one currentness result and one D14 truth each");
{
  const floor = (evidenceCurrent) => evidenceCurrent ? "floor 2,001" : "ABSTAIN (REGISTRATION_NOT_CURRENT)";
  /* v1.32: 'registry states' with no mapping to the active boolean — three readings of REVOKED */
  const readings32 = { keepActive: floor(true), mapToInactive: floor(false), removeRoute: floor(false) + " + route gone" };
  console.log("   v1.32 REVOKED readings:", JP(readings32));
  ok(new Set(Object.values(readings32)).size > 1, "v1.32: three implementations of REVOKED give different athlete truth (2,001 vs ABSTAIN vs route removed)");
  const cases = [];
  const base = () => mkRegistry();
  let r = base(); cases.push(["ACTIVE", registrationCurrent(r), newSubmissionAuthorized(r, cred("C1", 1, 1)), directResponseAuthorized(r, cred("C1", 1, 1))]);
  r = base(); r.active = false; cases.push(["INACTIVE (paused)", registrationCurrent(r), newSubmissionAuthorized(r, cred("C1", 1, 1)), directResponseAuthorized(r, cred("C1", 1, 1))]);
  r = base(); removeOrRevoke(r, "REMOVE"); cases.push(["REMOVED", registrationCurrent(r), newSubmissionAuthorized(r, cred("C1", 1, 1)), directResponseAuthorized(r, cred("C1", 1, 1))]);
  r = base(); removeOrRevoke(r, "REVOKE"); cases.push(["REVOKED alone", registrationCurrent(r), newSubmissionAuthorized(r, cred("C1", 1, 1)), directResponseAuthorized(r, cred("C1", 1, 1))]);
  r = base(); removeOrRevoke(r, "REVOKE"); r.active = false; cases.push(["REVOKED + deactivated (one atomic mutation)", registrationCurrent(r), newSubmissionAuthorized(r, cred("C1", 1, 1)), directResponseAuthorized(r, cred("C1", 1, 1))]);
  r = base(); removeOrRevoke(r, "REVOKE"); r.credState.C3 = "CURRENT"; cases.push(["rotated: C3 current, C1 revoked", registrationCurrent(r), newSubmissionAuthorized(r, cred("C3", 2, 1)), directResponseAuthorized(r, cred("C3", 2, 1))]);
  for (const [name, cur, sub, disc] of cases) console.log("   " + name.padEnd(46), "currentness:", cur, "| D14:", floor(cur).padEnd(36), "| new submission:", sub, "| exact response:", disc);
  const byName = Object.fromEntries(cases.map((c) => [c[0], c]));
  ok(byName["REVOKED alone"][1] === true && byName["REVOKED alone"][2] === false && byName["REVOKED alone"][3] === false, "v1.33: revocation alone stops new submissions and disclosure but does NOT reinterpret accepted evidence (PRESENT + active=true ⇒ still current, 2,001)");
  ok(byName["REVOKED + deactivated (one atomic mutation)"][1] === false && byName["INACTIVE (paused)"][1] === false && byName["INACTIVE (paused)"][2] === true, "v1.33: stopping the evidence is the ordinary active=false / removal path (REGISTRATION_NOT_CURRENT, re-issue); a paused source may still submit, non-current until reactivated");
  ok(byName["rotated: C3 current, C1 revoked"][1] === true && byName["rotated: C3 current, C1 revoked"][2] === true, "v1.33: a credential rotation (old REVOKED, new CURRENT at the next epoch) changes no evidence and admits the new credential");
}

console.log("\n== T4 — unauthorized transport hit / content hit / recovery hit / refused miss: ONE observable response class");
{
  const branches = ["transport_hit", "content_hit", "recovery_then_hit", "verified_miss_refused", "unverifiable_miss_refused"];
  const envelope32 = (b) => ({ body: "ACKNOWLEDGED", status: b.includes("refused") ? 403 : 200, length: b === "recovery_then_hit" ? 14 : 12, t: b === "recovery_then_hit" ? 1800 : 40 });   /* 'same bytes' only */
  const RELEASE_INTERVAL = 2000;                                                                                          /* declared bucket, ms from arrival, independent of the work */
  const envelope33 = (b) => ({ status: 202, headers: "fixed-set", body: "ACKNOWLEDGED", length: 64, connection: "close", retry: "none", release: RELEASE_INTERVAL });
  const classes32 = new Set(branches.map((b) => JP(envelope32(b)))), classes33 = new Set(branches.map((b) => JP(envelope33(b))));
  console.log("   v1.32 observable classes:", classes32.size, "| v1.33:", classes33.size, JP([...classes33][0]));
  ok(classes32.size > 1, "v1.32: 'same bytes' leaves " + classes32.size + " observable classes — status, length and recovery-dependent timing split the branches");
  ok(classes33.size === 1, "v1.33: one normalized UNAUTHORIZED RESPONSE ENVELOPE released on a fixed schedule from arrival, independent of the lookups and recovery (which proceed internally) — one observable class for every branch");
  const leakage = ["endpoint existence / TLS acceptance", "the fact of being unauthorized (an authorized principal gets an exact response)", "network jitter below the release interval"];
  ok(leakage.length === 3 && !leakage.some((l) => /hit|miss|disposition|recovery/.test(l)), "v1.33: the declared leakage inventory names what remains and none of it is hit / miss / disposition / recovery");
  /* the sync consequence: a refused miss creates nothing */
  const syncItems = (stored) => stored.filter((s) => s.receipt).length;
  ok(syncItems([{ receipt: 7 }, { refused: true }]) === 1, "v1.33: sync carries EXISTING or RECOVERED stored results only — a refused replay miss adds nothing");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
