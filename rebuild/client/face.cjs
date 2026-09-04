"use strict";
/* face.cjs — THE GOVERNING STATE MACHINE AND THE TWO-LAYER FACE (sheet §B 318–345, 323–326, 342–345, 695–696).
   PRECEDENCE — data paint: 18 restore/integrity > 17 standing · write permission: 17 standing > 20 lease > 3 save ·
   machine output: session ambiguity 14 > 7 contract currency > 6/2/1 sync currency · orthogonal: the state-19 rejected
   count never replaces Today's governing state. States 7 and 20 compose (20 governs writes, 7 machine output).
   LAYER 1 — the exact locally entered facts and the LIVE athlete-authored plan (numbers included), labelled
   "Saved on this phone · not yet synced" with a running count. LAYER 2 — derived numbers and MACHINE plan state from
   the last complete AUTHENTICATED frontier only, labelled "as of <last sync>"; local operations may only WITHDRAW or
   SUPPRESS (dependency-aware), never create a derived number. The D7 ladder: no weigh-in today (<3 missing dates) ·
   stale 3–6 ("Keep for now", pace not current) · Re-entry ≥ 7 (suppresses trend, rate, maintenance, proposals). */
const COPY = require("./copy.cjs");
const DAY = 86400000;
const addDays = (d, n) => new Date(Date.parse(d + "T12:00:00Z") + n * DAY).toISOString().slice(0, 10);
const D7 = { staleFrom: 3, reentryFrom: 7, horizon: 60 };

function createFace(ctx) {
  const { model } = ctx;
  const snapshot = () => model.snapshot || {};

  /* ---- governing state (machine output + paint) ---- */
  function governing() {
    if (!model.booted) return 9;
    if (model.restoreRequired) return 18;
    if (model.standing === "revoked") return 17;
    if (!ctx.leaseNow().valid) return 20;
    if (model.lastSaveFailed) return 3;
    const amb = ctx.ambiguity(); if (amb.component && !amb.decision) return 14;
    if (ctx.contractObsolete()) return 7;
    if (model.signInRequired) return 11;
    if (ctx.outbox.size() || model.authorityW > model.W) return model.online ? (ctx.outbox.size() ? 2 : 6) : 1;
    return 0;
  }
  /* ---- write permission (18 > 17 > 20; 3 is decided by the durable write itself) ---- */
  function writeState() {
    if (!model.booted) return { state: 9, copy: COPY.LAST_SYNCED(snapshot().time || snapshot().asOf) };
    if (model.restoreRequired) return { state: 18, copy: COPY.RESTORE_REQUIRED, resolution: COPY.RESTORE_REQUIRED };
    if (model.standing === "revoked") return { state: 17, copy: COPY.SIGN_IN_TO_KEEP_SAVING, resolution: COPY.DEVICE_REMOVED };
    const l = ctx.leaseNow(); if (!l.valid) return { state: 20, copy: l.reason === "no lease" || l.reason === "lease signature does not verify" ? COPY.LEASE_MISSING : COPY.LEASE_EXPIRED(l.not_after ? String(l.not_after).slice(0, 10) : null), reason: l.reason };
    return null;
  }

  /* ---- D7: missing dates counted back from today over snapshot reads + local reads ---- */
  function missingDates() {
    const dates = new Set((snapshot().reads || []).map((r) => (typeof r === "string" ? r : r.date)).concat(ctx.reads().map((r) => r.date)));
    if (!dates.size) return null;
    let n = 0; for (let d = ctx.today(); n < D7.horizon; d = addDays(d, -1)) { if (dates.has(d)) break; n++; }
    return n;
  }
  function layer2() {
    const s = snapshot(); const missing = missingDates();
    const board = missing == null || missing < D7.staleFrom ? "NO_WEIGH_IN_TODAY" : missing < D7.reentryFrom ? "STALE" : "RE_ENTRY";
    const l2 = {
      label: s.asOf ? COPY.AS_OF(s.asOf) : null,
      trend: s.trend == null ? null : s.trend, rate: s.rate == null ? null : s.rate, maintenance: s.maintenance == null ? null : s.maintenance,
      instruction: s.instruction || null, outputs: (s.outputs || []).slice(), proposals: (s.proposals || []).slice(), actionLoci: (s.actionLoci || []).slice(),
      paceCurrent: board === "NO_WEIGH_IN_TODAY", board, missingDates: missing,
      copy: board === "NO_WEIGH_IN_TODAY" ? (missing === 0 ? "" : COPY.NO_WEIGH_IN_TODAY) : board === "STALE" ? COPY.KEEP_FOR_NOW : COPY.RE_ENTRY,
      syncLine: null,
    };
    if (board === "RE_ENTRY") { l2.trend = null; l2.rate = null; l2.maintenance = null; l2.proposals = []; l2.instruction = null; l2.actionLoci = []; }
    /* DEPENDENCY-AWARE WITHDRAWAL: a Layer-1 operation that touches an output's declared dependency set suppresses it */
    const touched = ctx.touched();
    if (touched.size) {
      const touches = (deps) => (deps || []).some((d) => touched.has(d));
      l2.outputs = l2.outputs.filter((o) => !touches(o.deps)); l2.proposals = l2.proposals.filter((p) => !touches(p.deps)); l2.actionLoci = l2.actionLoci.filter((a) => !touches(a.deps));
      if (l2.instruction && touches(s.instructionDeps)) l2.instruction = null;
      if (s.proposal && touches(s.proposal.deps)) l2.displayedProposal = null; else if (s.proposal) l2.displayedProposal = { ...s.proposal };
    } else if (s.proposal) l2.displayedProposal = { ...s.proposal };
    /* state 7: obsolete machine output is suppressed; the accepted plan and Layer 1 stay */
    if (ctx.contractObsolete()) { l2.instruction = null; l2.proposals = []; l2.actionLoci = []; l2.outputs = []; l2.copy = COPY.UPDATE_EARNED; l2.contractCurrent = false; }
    /* state 6 / 2: behind the authority → machine proposals hidden, one line */
    if (model.online && (ctx.outbox.size() || model.authorityW > model.W)) { l2.proposals = []; l2.syncLine = COPY.SYNC_TO_UPDATE; }
    /* state 8: ISSUANCE FIRST — an unissued offer is shown only once its issuance is accepted to an instance */
    l2.proposals = l2.proposals.filter((p) => !p.unissued || (model.issuances.get(p.id) && model.issuances.get(p.id).accepted)).map((p) => (model.issuances.get(p.id) ? { ...p, instance: model.issuances.get(p.id).instance } : p));
    return l2;
  }
  function skeleton() {
    const s = ctx.persistedSnapshot() || {};
    return { paint: "SKELETON", state: 9, layer1: { plan: Object.assign({}, s.plan || {}), planProvenance: s.planProvenance || null, label: COPY.LAST_SYNCED(s.time || s.asOf), reads: [], notYetSyncedCount: undefined }, layer2: { label: null, trend: null, rate: null, maintenance: null, instruction: null, outputs: [], proposals: [], actionLoci: [], board: null, missingDates: null, copy: "", syncLine: null }, answers: [], rejectedCount: 0, rejectedLine: null, today: "", resolution: null, acceptedPlan: null, history: [] };
  }
  function blocked(state) {
    return { paint: "BLOCKED", state, layer1: { plan: {}, planProvenance: null, label: "", reads: [], notYetSyncedCount: undefined }, layer2: { label: null, trend: null, rate: null, maintenance: null, instruction: null, outputs: [], proposals: [], actionLoci: [], board: null, missingDates: null, copy: "", syncLine: null }, answers: [], rejectedCount: 0, rejectedLine: null, today: state === 18 ? COPY.RESTORE_REQUIRED : "", resolution: state === 18 ? COPY.RESTORE_REQUIRED : null, acceptedPlan: null, history: [] };
  }
  function face() {
    if (!model.booted) return skeleton();
    if (model.restoreRequired) return blocked(18);
    if (!ctx.sync.recover()) return { ...blocked(governing()), copy: COPY.REJECTED_BLOCKED };
    const st = governing(); const l2 = layer2(); const s = snapshot();
    const revoked = model.standing === "revoked"; const accepted = ctx.acceptedPlan(); const rejectedN = model.rejected.size;
    const livePlan = ctx.livePlan();
    const f = {
      paint: "TRUTHFUL", state: st,
      layer1: { plan: livePlan, planProvenance: accepted ? accepted.provenance : null, label: ctx.outbox.size() ? COPY.SAVED : "", reads: ctx.reads(), notYetSyncedCount: revoked ? undefined : ctx.outbox.size() },
      layer2: l2, answers: ctx.answers(), rejectedCount: rejectedN, rejectedLine: rejectedN ? COPY.REJECTED_LINE(rejectedN) : null,
      today: !accepted ? (model.explicitNoPlan ? COPY.NO_PLAN : COPY.FIRST_USE) : (l2.instruction || COPY.PLAN_IN_EFFECT),
      resolution: revoked ? COPY.DEVICE_REMOVED : null,
      acceptedPlan: accepted ? Object.assign({}, accepted.plan, { provenance: accepted.provenance, version: accepted.version }) : null,
      history: ctx.history(),
    };
    if (revoked) f.layer1.label = ctx.outbox.size() ? COPY.RETAINED_NO_SYNC : "";   /* no label that promises a future sync */
    return f;
  }
  /* state 4 copy, parameterized (sheet 379–384) */
  function conflictFace(c) {
    const N = c.alternatives.length + 1;
    return { copy: COPY.CONFLICT(N, c.lift, c.using), actions: N === 2 ? [COPY.CONFLICT_ACTION_TWO(c.alternatives[0])] : [COPY.CONFLICT_ACTION_MANY(N - 1)], usingDevice: COPY.DEVICE_NAME(c.usingDevice), versions: N };
  }
  return { governing, writeState, missingDates, layer2, face, conflictFace, D7 };
}
module.exports = { createFace, D7, addDays };
