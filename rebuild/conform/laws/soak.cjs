/* §C SOAK INVARIANTS as a STATEFUL PROPERTY TEST (Sol suite-pass-1: "§C soak invariants as stateful/property tests
   before the calendar soak begins"). A seeded generator drives two devices of one athlete plus a second athlete
   through random interleavings of weigh-ins, plan edits, corrections, replays, out-of-order children, revocations
   and crash injections; after every step the INVARIANTS below must hold. GREEN against the reference authority,
   RED against the absent product authority, and each invariant has a targeted mutant. sheet v1.7.38 §A + §C C3. */
const { NotImplemented, JP, canon } = require("../lib/harness.cjs");
const O = require("../lib/ops.cjs");
const mk = (B, cfg) => { if (!B || !B.authority) throw new NotImplemented("adapters/authority.cjs — the product authority (tranche T3)"); return B.authority(cfg); };
const hookMutant = (name, hooks) => ({ name, make: (ref) => ({ ...ref, authority: (cfg) => ref.authority(cfg, hooks) }) });
function rng(seed) { let x = seed >>> 0; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function drive(B, seed, steps) {
  const cfg = { athletes: { "ath-1": { devices: { "dev-A": { lease: O.lease("dev-A") }, "dev-B": { lease: O.lease("dev-B") } } }, "ath-2": { devices: { "dev-C": { lease: O.lease("dev-C") } } } } };
  const a = mk(B, cfg); const R = rng(seed); const seqs = { "dev-A": 0, "dev-B": 0, "dev-C": 0 }; const last = { "dev-A": null, "dev-B": null, "dev-C": null }; const accepted = []; const all = []; let revoked = null; const violations = [];
  const check = (label) => {
    const log = a.log("ath-1"); const seqList = log.map((op) => a.disposition("ath-1", op.device_id, op.device_seq).athlete_log_seq);
    if (!seqList.every((s, i) => i === 0 || s > seqList[i - 1])) violations.push(label + ": athlete_log_seq not strictly increasing");
    if (new Set(log.map((op) => op.device_id + ":" + op.device_seq)).size !== log.length) violations.push(label + ": two accepted ops in one slot");
    if (a.frontier("ath-1") !== log.length) violations.push(label + ": frontier ≠ contiguous accepted count");
    for (const op of all) { const d = a.disposition("ath-1", op.device_id, op.device_seq); if (d && !a.verifyDisposition(d)) violations.push(label + ": unsigned disposition"); const h = a.dispositionHistory("ath-1", op.device_id, op.device_seq); if (h.filter((x) => x.status !== "WAITING").length > 1) violations.push(label + ": more than one terminal disposition in a slot"); }
    for (const op of accepted) { const r = a.admit("ath-1", op); const d = a.disposition("ath-1", op.device_id, op.device_seq); if (canon(r) !== canon(d) || r.status !== "ACCEPTED") violations.push(label + ": replay of an accepted op not byte-identical"); }
    if (a.log("ath-1").length !== log.length) violations.push(label + ": replay changed the log");
    if (revoked != null) for (const op of log) if (op.device_id === "dev-A" && op.device_seq > revoked) violations.push(label + ": accepted beyond the revocation barrier");
  };
  for (let i = 0; i < steps; i++) {
    const r = R(); const dev = r < 0.45 ? "dev-A" : r < 0.9 ? "dev-B" : "dev-C"; const ath = dev === "dev-C" ? "ath-2" : "ath-1"; const kindR = R();
    const seq = ++seqs[dev]; let op;
    if (kindR < 0.5) op = O.build({ op_id: `op-${dev}-${seq}`, athlete_id: ath, device_id: dev, device_seq: seq, pred: last[dev], payload: { lb: { value: 160 - i * 0.01, unit: "lb" }, source: "athlete" } });
    else if (kindR < 0.7) op = O.build({ op_id: `op-${dev}-${seq}`, athlete_id: ath, device_id: dev, device_seq: seq, pred: last[dev], kind: "plan-mutation", class: "plan", payload: null, plan: { members: [{ field: "protein_g", value: 140 + Math.floor(R() * 40), unit: "g/day", provenance: "athlete_edited" }] } });
    else if (kindR < 0.8 && accepted.length) { const t = accepted[Math.floor(R() * accepted.length)]; op = O.build({ op_id: `op-${dev}-${seq}`, athlete_id: ath, device_id: dev, device_seq: seq, pred: last[dev], kind: "correction", target: ath === t.athlete_id ? t.op_id : t.op_id, payload: { replacement_fields: { lb: { value: 159, unit: "lb" } } } }); }
    else if (kindR < 0.9) op = O.build({ op_id: `op-${dev}-${seq}`, athlete_id: ath, device_id: dev, device_seq: seq, pred: last[dev], kind: "plan-mutation", class: "plan", payload: null, plan: {}, parents: [`op-${dev === "dev-A" ? "dev-B" : "dev-A"}-${seqs[dev === "dev-A" ? "dev-B" : "dev-A"] + 1}`] });   /* child before its parent */
    else if (kindR < 0.93 && seqs[dev] > 2) { seqs[dev]--; const reuse = 1 + Math.floor(R() * seqs[dev]); op = O.build({ op_id: `op-${dev}-reuse-${i}`, athlete_id: ath, device_id: dev, device_seq: reuse, pred: last[dev], payload: { lb: { value: 150, unit: "lb" }, source: "athlete" } }); const d = a.admit(ath, op); if (ath === "ath-1") all.push(op); if (i % 7 === 0) check("step " + i); continue; }   /* a buggy device reuses a slot with a different op */
    else { if (ath === "ath-1" && revoked == null && R() < 0.3 && i > steps / 2) { revoked = a.revokeDevice("ath-1", "dev-A").barrier; seqs[dev]--; continue; } if (R() < 0.5) a.injectCrash("between-admission-and-plan-transaction"); op = O.build({ op_id: `op-${dev}-${seq}`, athlete_id: ath, device_id: dev, device_seq: seq, pred: last[dev], kind: "plan-mutation", class: "plan", payload: null, plan: {} }); }
    last[dev] = op.op_id; const d = a.admit(ath, op); a.clearCrash(); if (ath === "ath-1") { all.push(op); if (d.status === "ACCEPTED") accepted.push(op); }
    if (i % 7 === 0) check("step " + i);
  }
  check("final"); return { violations, accepted: accepted.length, all: all.length, revoked };
}
const laws = [
  { id: "C-soak-property-200-steps-x-5-seeds-log-contiguous-slots-unique-dispositions-signed-one-terminal-replay-idempotent-barrier-respected", cite: "sheet §A A1–A2 + §C C3 (≥ 30 idle days soak on a store stub — these are its invariants, run before the calendar soak)", expect: "GREEN",
    run: (B) => { const out = [1, 2, 3, 4, 5].map((seed) => drive(B, seed * 7919, 200)); const v = out.flatMap((o) => o.violations); return { ok: v.length === 0 && out.every((o) => o.accepted > 40), detail: v.length ? v.slice(0, 5).join(" · ") : JP(out.map((o) => ({ accepted: o.accepted, all: o.all, revoked: o.revoked }))) }; },
    mutants: [hookMutant("seq-not-monotonic", { nextSeq: (st) => (st.seq = (st.seq % 5) + 1) }), hookMutant("slot-overwritten", { dedupSlot: false }), hookMutant("unsigned", { signDisposition: () => "" }), hookMutant("replay-re-admits", { replayIsSame: () => false, dedupSlot: false }), hookMutant("barrier-ignored", { checkRevocation: false })] },
];
const INVENTORY = laws.map((l) => l.id);
module.exports = { laws, INVENTORY, drive };
