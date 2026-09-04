/* adapters/client.cjs — TRANCHE T2: the PRODUCT client (/home/claude/rebuild/client) behind the suite's §B adapter
   contract. This file maps the suite's synthetic opts onto createClient(config), supplies the faulty backend, the test
   clock and a tiny fake authority transport, and returns the normalized API the laws call. `hooks` is ignored (mutants
   apply only to the suite's own in-memory model). It requires ../lib/ops.cjs ONLY for the shared test constants
   (AUTH_KEY, K_IDENTITY, the default lease, and the signing primitive the fake authority uses) — nothing else from the
   suite, and nothing from the suite's model directory. */
const O = require("../lib/ops.cjs");
const path = require("node:path"), fs = require("node:fs");
/* the product's location: EARNED_CLIENT_DIR, else the repo layout rebuild/client next to rebuild/conform, else the cowork tree */
const CLIENT_DIR = process.env.EARNED_CLIENT_DIR || [path.join(__dirname, "..", "..", "client"), "/home/claude/rebuild/client"].find((d) => fs.existsSync(path.join(d, "index.cjs")));
if (!CLIENT_DIR) throw new Error("adapters/client.cjs: the product client was not found (set EARNED_CLIENT_DIR)");
const Client = require(CLIENT_DIR);

/* ---- fault injection from OUTSIDE the product: a backend that fails the way the law's storage mode says ---- */
function faultyBackend(inner, mode) {
  if (!mode) return inner;
  const fail = (what) => { const e = new Error("storage: " + what); e.storage = true; throw e; };
  return {
    begin: (...a) => inner.begin(...a), remove: (...a) => inner.remove(...a), commit: (...a) => inner.commit(...a), rollback: (...a) => inner.rollback(...a),
    get: (...a) => inner.get(...a), keys: (...a) => inner.keys(...a), clear: (...a) => inner.clear(...a), collections: () => inner.collections(),
    write(h, collection, key, value) {
      if (mode === "refuse-writes") fail("write refused (storage full or denied)");
      if (mode === "crash-after-op-before-outbox" && collection === "outbox") fail("crashed after the operation write, before the outbox write");
      if (mode === "crash-in-rejected-ledger" && collection === "rejected") fail("crashed in the rejected-ledger write");
      return inner.write(h, collection, key, value);
    },
  };
}

/* ---- a fake authority transport: lost acknowledgements by default; accepting when the law goes online that way ---- */
function fakeAuthority(seedW, nowIso) {
  const log = []; for (let s = 1; s <= seedW; s++) log.push({ seq: s, op_id: null, accepted_at: nowIso });
  const st = { logSeq: seedW, accepting: false };
  const sign = (d) => ({ ...d, authority_signature: O.hmac(O.AUTH_KEY, "earned/disposition/v1" + O.canonicalEncode({ ...d, authority_signature: undefined })) });
  return {
    st,
    transport: {
      send(op) {
        if (!st.accepting) return undefined;   /* the acknowledgement is lost: the SAME op_id retries on the next eligible tick */
        const seq = ++st.logSeq; log.push({ seq, op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, accepted_at: nowIso });
        return { disposition: sign({ op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, device_id: op.device_id, device_seq: op.device_seq, status: "ACCEPTED", athlete_log_seq: seq, decided_at: "2026-09-04T00:00:00Z" }) };
      },
      pull(W) { return { receipts: log.filter((r) => r.seq > W) }; },
    },
  };
}

function create(opts = {}, _hooks) {
  const dev = opts.device_id || "dev-A"; const athlete = "ath-1"; const K = opts.identityKey || O.K_IDENTITY;
  const today = opts.today || "2026-09-04"; const nowIso = opts.now || "2026-09-04T00:00:00Z"; const tz = opts.tz || "-04:00";
  let mono = 0; const clock = { now: () => nowIso, today: () => today, tz, monotonicMs: () => mono };
  const last = opts.lastSync || {};
  /* the store as the previous run of the product would have left it: the last-sync snapshot, the known authority frontier */
  const snapshot = { plan: last.plan, planProvenance: last.planProvenance, planVersion: last.planVersion, trend: last.trend, rate: last.rate, maintenance: last.maintenance, asOf: last.asOf, time: last.time, instruction: last.instruction, instructionDeps: last.instructionDeps, outputs: last.outputs, proposals: last.proposals, actionLoci: last.actionLoci, proposal: last.proposal, reads: opts.reads || [today] };
  const seed = { sync: { snapshot, frontier: { W: 0, authorityW: last.W || 0 } } };
  if (opts.hiddenAcceptedPlan) seed.plan = { accepted: { members: Object.keys(opts.hiddenAcceptedPlan).map((f) => ({ field: f, value: opts.hiddenAcceptedPlan[f], provenance: "athlete_edited" })), provenance: "consented", version: "hidden" } };   /* NO consent transaction */
  if (opts.restoreRequired) seed.meta = { checkpoint: { counts: { ops: 1, outbox: 0 } } };   /* a checkpoint the (empty) store contradicts → integrity fails */
  const inner = Client.memoryBackend(seed); const backend = faultyBackend(inner, opts.storage);
  const auth = fakeAuthority(last.W || 0, nowIso);
  const c = Client.createClient({ deviceId: dev, athleteId: athlete, identityKey: K, authorityKey: O.AUTH_KEY, backend, clock, lease: opts.lease || O.lease(dev), transport: auth.transport, online: opts.online !== false, contract: opts.contractObsolete ? { client: "1", required: "2" } : { client: "1", required: "1" }, standing: opts.revoked ? "revoked" : "enrolled", signInRequired: !!opts.signInRequired });
  if (!opts.coldStart) c.boot();
  if (opts.loggedIntake && !opts.coldStart) {
    const base = last.W || 0;
    c.deliverReceipts(opts.loggedIntake.map((x, i) => { const op = { op_id: x.op_id, athlete_id: athlete, device_id: "dev-food", device_seq: i + 1, device_predecessor_op_id: null, causal_parents: [], class: "food-day", kind: "fact", effective: { local_date: x.date, local_time: "20:00", utc_offset: tz }, schema_version: 1, lease_id: "L-dev-food", payload: { kcal: { value: x.kcal, unit: "kcal" } } }; op.canonical_content_commitment = Client.ops.commitmentOf(op, K); return { seq: base + i + 1, op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, op }; }));
  }
  return {
    weighIn: c.weighIn, logSet: c.logSet, decision: c.decision, correction: c.correction, tombstone: c.tombstone, undoRequest: c.undoRequest, finishSession: c.finishSession, planEdit: c.planEdit, respond: c.respond,
    face: c.face, faceLabel: c.faceLabel, plan: c.plan, stateOf: c.stateOf,
    goOnline: (o = {}) => { auth.st.accepting = !!o.acceptButDoNotReduce; c.goOnline(); }, goOffline: c.goOffline,
    tick: (ms) => { mono += ms; }, syncOnce: c.syncOnce, outbox: c.outbox, sentLog: c.sentLog,
    deliverDisposition: c.deliverDisposition, deliverReceipts: c.deliverReceipts, frontier: c.frontier, reduceThroughW: c.reduceThroughW,
    authorityPlanTransaction: (op_id, r) => c.receivePlanTransaction(op_id, r), authorityDeliverDisposition: (_op_id, d) => c.deliverDisposition(d),
    envelope: c.envelope, leanFromEstimate: c.leanFromEstimate, logSession: c.logSession, proposals: c.proposals, acceptInitialPlan: c.acceptInitialPlan,
    dayFacts: c.dayFacts, maintenanceInputs: () => c.maintenanceInputs(opts.maintenanceDays),
    sessionsFromDevices: (list) => c.receiveSessionStarts(list), ambiguity: c.ambiguity, resolveAmbiguity: c.resolveAmbiguity,
    fieldValue: c.fieldValue, issue: (proposal, accepted, instance) => c.recordIssuance({ id: proposal.id, accepted, instance }), issuedInstance: c.issuedInstance,
    conflictSuspend: (txn) => c.conflictSuspend(txn),   /* the product derives the fallback itself */
    rejectedLedger: c.rejectedLedger, fixRejected: c.fixRejected, retryEligible: c.retryEligible, commitmentOf: c.commitmentOf,
    revoke: c.revoke, outboxRetained: c.outboxRetained, signInRequired: c.signInRequired, syncStatus: c.syncStatus,
    storageLost: (o = {}) => { inner.clear("ops"); if (!o.ledgerSurvived) inner.clear("outbox"); c.restart(); },   /* eviction happens to the backend; the app restarts on it */
    restoreFlow: c.restoreFlow,
    resumeAfterKill: (o = {}) => { if (o.durableDraftMarker) c.beginEntry({ kind: "set" }); return c.resumeAfterKill(); },
    acceptedPlanTransactions: c.acceptedPlanTransactions, deriveInstance: c.deriveInstance, planHistory: c.planHistory, fallbackBefore: c.fallbackBefore,
    candidateComponent: c.candidateComponent, advanceGeneration: c.advanceGeneration, resolveSameWorkout: c.resolveSameWorkout, resolveCollisions: c.resolveCollisions, conflictFace: c.conflictFace,
  };
}
module.exports = { create };
