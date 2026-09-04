"use strict";
/* index.cjs — COMPOSITION ROOT: createClient(config) → the Earned client core.
   config = {
     deviceId, athleteId, identityKey (K_identity for this key epoch), authorityKey (verifies leases + dispositions),
     backend            — a durable backend (store.cjs BACKEND INTERFACE); memoryBackend() ships with the product
     clock              — { now() → ISO, today() → YYYY-MM-DD (athlete zone), tz → "-04:00", monotonicMs() → number }
     lease              — the authority-signed offline-write lease for this device (state 20 without a valid one)
     transport          — optional { send(op) → { disposition? } | undefined, pull(W) → { receipts } }
     online             — initial connectivity (default true)
     contract           — { client: "<proposal_surface_contract_version>", required: "<authority's current>" }
     standing           — "enrolled" | "revoked" (a device that already knows it was removed)
     signInRequired     — the authentication session is known to be expired (state 11)
     backoff            — outbox retry schedule (default [0, 1000, 2000, 4000] ms)
   }
   Everything the athlete does is a durable operation written with its outbox entry in ONE local transaction
   (durability rule). Everything the face shows is derived from the store's read model, rebuilt on boot(). The
   client paints a SKELETON until boot() has loaded the complete local frontier (state 9). */
const { Store, memoryBackend } = require("./store.cjs");
const Ops = require("./ops.cjs");
const Lease = require("./lease.cjs");
const { Outbox } = require("./outbox.cjs");
const { createSync } = require("./sync.cjs");
const { createFace, addDays } = require("./face.cjs");
const Plan = require("./plan.cjs");
const Session = require("./session.cjs");
const { leanFromEstimate } = require("./bodycomp.cjs");
const COPY = require("./copy.cjs");
const Canonical = require("./canonical.cjs");

const deepCopy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const localTime = (iso, tz) => { const m = /^([+-])(\d\d):(\d\d)$/.exec(tz || "+00:00"); const off = m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0; const t = new Date(Date.parse(iso) + off * 60000); return t.toISOString().slice(11, 16); };
const q = (value, unit) => ({ value, unit });

function createClient(config) {
  const cfg = config || {};
  for (const k of ["deviceId", "identityKey", "authorityKey", "clock"]) if (!cfg[k]) throw new Error("createClient: config." + k + " is required");
  if (typeof cfg.clock.now !== "function" || typeof cfg.clock.today !== "function" || typeof cfg.clock.monotonicMs !== "function") throw new Error("createClient: clock needs now(), today(), monotonicMs()");
  const clock = cfg.clock; const K = cfg.identityKey; const tz = clock.tz || "+00:00";
  const store = new Store(cfg.backend || memoryBackend());
  const outbox = new Outbox({ backoff: cfg.backoff });
  const model = {
    deviceId: cfg.deviceId, athleteId: cfg.athleteId || "ath-1", booted: false, restoreRequired: false, integrity: null,
    ops: new Map(), ownSeq: 0, lastOwnOpId: null, dispositions: new Map(), rejected: new Map(), receipts: new Map(), W: 0, authorityW: 0, planTxns: new Map(), reductions: 0,
    snapshot: null, localPlan: null, appliedPlan: [], explicitNoPlan: false, issuances: new Map(), planHistory: [], suspensions: new Map(), sessionStarts: [], sessionResolutions: new Map(), generations: {}, draft: null,
    standing: cfg.standing === "revoked" ? "revoked" : "enrolled", signInRequired: !!cfg.signInRequired, online: cfg.online !== false, lastSaveFailed: false, fields: {},
  };

  /* ---------- the read model, rebuilt from the store (boot = state 9 → truthful paint) ---------- */
  function boot() {
    const integ = store.integrity(); model.integrity = integ; model.booted = true;
    if (!integ.intact) { model.restoreRequired = true; return; }
    model.restoreRequired = false;   /* a fresh store needs no write at boot: the first operation's transaction lays down the device record */
    model.ops = new Map(); for (const op of store.list("ops")) if (op && op.op_id) model.ops.set(op.op_id, op);
    const own = Array.from(model.ops.values()).filter((o) => o.device_id === model.deviceId).sort((a, b) => a.device_seq - b.device_seq);
    const dev = store.get("meta", "device") || { seq: 0 }; model.ownSeq = Math.max(dev.seq || 0, ...own.map((o) => o.device_seq)); model.lastOwnOpId = own.length ? own[own.length - 1].op_id : null;
    outbox.load(store.list("outbox"));
    model.dispositions = new Map(store.list("dispositions").map((d) => [d.op_id, d]));
    model.rejected = new Map(store.list("rejected").map((r) => [r.op_id, r]));
    model.receipts = new Map(store.list("receipts").map((r) => [r.seq, r]));
    const fr = store.get("sync", "frontier") || { W: 0, authorityW: 0 }; let w = 0; while (model.receipts.has(w + 1)) w++; model.W = Math.max(fr.W || 0, w); model.authorityW = Math.max(fr.authorityW || 0, model.W, ...Array.from(model.receipts.keys()));
    model.planTxns = new Map(store.list("planTxns").map((p) => [p.op_id, p]));
    model.snapshot = store.get("sync", "snapshot") || null;
    const lp = store.get("plan", "accepted"); const consent = lp && lp.txn_id ? store.get("planTransactions", lp.txn_id) : null;
    model.localPlan = lp && consent ? lp : null;   /* a plan record with no consent transaction is NOT an accepted plan (state 10) */
    model.appliedPlan = (store.get("plan", "applied") || { list: [] }).list;
    const choice = store.get("plan", "choice"); model.explicitNoPlan = !!(choice && choice.id === "no-plan");
    model.issuances = new Map(store.list("issuances").map((i) => [i.id, i]));
    model.planHistory = store.list("planHistory").sort((a, b) => a.order - b.order);
    model.suspensions = new Map(store.list("suspensions").map((s) => [s.txn_id, s]));
    model.reductions = (store.get("sync", "reductions") || { n: 0 }).n;
    model.sessionStarts = store.list("sessionStarts");
    model.sessionResolutions = new Map(store.list("sessionResolutions").map((r) => [r.key, r]));
    model.draft = store.get("drafts", "active") || null;
    const standing = store.get("meta", "standing"); if (standing && standing.standing === "revoked") model.standing = "revoked";
    model.lastSaveFailed = false;
  }
  function restart() { model.fields = {}; model.booted = false; boot(); }

  /* ---------- derived views over operations ---------- */
  const ownOps = () => Array.from(model.ops.values()).filter((o) => o.device_id === model.deviceId && !model.rejected.has(o.op_id)).sort((a, b) => a.device_seq - b.device_seq);
  const tombstoned = () => new Set(ownOps().filter((o) => o.kind === "tombstone").map((o) => o.target_op_id));
  const reducedThroughW = (op) => { const d = model.dispositions.get(op.op_id); return !!(d && d.status === "ACCEPTED" && Number.isInteger(d.athlete_log_seq) && d.athlete_log_seq <= model.W); };
  const folded = (op) => { const pt = model.planTxns.get(op.op_id); return !!(pt && pt.committed && pt.effective && pt.received); };
  function reads() {
    const dead = tombstoned(); const corrections = ownOps().filter((o) => o.kind === "correction");
    return ownOps().filter((o) => o.kind === "fact" && o.class === "reading" && !dead.has(o.op_id)).map((o) => { let lb = o.payload && o.payload.lb && o.payload.lb.value; for (const c of corrections) if (c.target_op_id === o.op_id && c.payload && c.payload.replacement_fields && c.payload.replacement_fields.lb) lb = c.payload.replacement_fields.lb.value; return { date: o.effective.local_date, lb, op_id: o.op_id }; });
  }
  function liveEdits() { return ownOps().filter((o) => o.kind === "plan-mutation" && !folded(o)); }
  /* the dependency names a Layer-1 operation touches: a plan edit → its domain and member fields; a fact → "fact:<class>" —
     only while the operation is local (not yet reduced through the authenticated frontier) */
  function touched() { const t = new Set(); for (const o of liveEdits()) { t.add(o.conflict_domain_id); for (const m of o.members) t.add(m.field); } for (const o of ownOps()) if (o.kind !== "plan-mutation" && !reducedThroughW(o)) t.add("fact:" + o.class); return t; }
  function acceptedPlan() {
    const s = model.snapshot; const lp = model.localPlan; let out = null;
    if (s && s.plan) out = { plan: Object.assign({}, s.plan), provenance: s.planProvenance || null, version: s.planVersion || null, transactions: (s.planTransactionIds || []).slice() };
    for (const a of model.appliedPlan) { if (!out) out = { plan: {}, provenance: "authored", version: a.op_id, transactions: [] }; out.plan = Plan.project(out.plan, a.members); out.version = a.txn_id || a.op_id; out.transactions.push(a.txn_id || a.op_id); out.provenance = a.provenance || out.provenance; }
    if (lp) { if (!out) out = { plan: {}, provenance: null, version: null, transactions: [] }; out.plan = Plan.project(out.plan, lp.members); out.provenance = lp.provenance; out.version = lp.version || lp.txn_id; out.transactions.push(lp.txn_id); }
    return out;
  }
  function livePlan() {
    const acc = acceptedPlan(); let plan = acc ? Object.assign({}, acc.plan) : {};
    for (const sus of model.suspensions.values()) plan = Object.assign({}, sus.fallback);   /* state 5: the fallback projection governs while suspended */
    for (const o of liveEdits()) for (const m of o.members) plan[m.field] = m.value;        /* the athlete's direct edit is the sole current plan for that domain */
    return plan;
  }
  function answers() { return ownOps().filter((o) => o.kind === "proposal-response" && o.payload && o.payload.proposal_id).map((o) => ({ proposal: o.payload.proposal_id, answer: o.payload.answer, label: outbox.has(o.op_id) && !outbox.everSent(o.op_id) ? COPY.ANSWER_SAVED : sync.faceLabel(o.op_id), op_id: o.op_id })); }
  function sessionFacts() { const byDate = new Map(); for (const o of ownOps()) if (o.kind === "session-set") { const d = o.effective.local_date; if (!byDate.has(d)) byDate.set(d, { date: d, sets: [] }); const p = o.payload || {}; byDate.get(d).sets.push({ lift: p.lift, load: p.load && p.load.value, reps: p.reps && p.reps.value, op_id: o.op_id }); } return Array.from(byDate.values()); }
  function history() { return Array.from(model.suspensions.values()).map((s) => ({ txn: s.txn_id, copy: COPY.SUSPENDED_HISTORY(s.appliedAtW, s.suspendedAtW), fallback: s.fallback, excluded: s.excluded })); }
  const frontierLabel = () => Math.max(model.W, model.reductions);
  const bumpReductions = (t) => { t.put("sync", "reductions", { n: model.reductions + 1 }); };

  /* ---------- lease + contract ---------- */
  const leaseNow = (nextSeq) => Lease.check(cfg.lease, { authorityKey: cfg.authorityKey, deviceId: model.deviceId, athleteId: model.athleteId, nowIso: clock.now(), nextSeq });
  const contractObsolete = () => { const c = cfg.contract; if (!c) return false; if (typeof c.obsolete === "boolean") return c.obsolete; return !!(c.required && c.client && String(c.required) !== String(c.client)); };

  /* ---------- sessions (state 14) ---------- */
  const components = () => Session.candidateComponents(model.sessionStarts, model.generations).filter((c) => c.members.length >= 2);
  const decidedFor = (c) => { const r = model.sessionResolutions.get(c.key); return r && r.generation === c.generation ? r : null; };
  function ambiguity() {
    const comps = components(); const open = comps.find((c) => !decidedFor(c));
    if (open) return { component: open.members.slice(), decision: null, kind: "PARTITION", generation: open.generation, progressionBearing: false, candidates: open.members.slice(), components: comps.length };
    if (comps.length) return { component: comps[0].members.slice(), decision: decidedFor(comps[0]), kind: "PARTITION", generation: comps[0].generation, progressionBearing: true, components: comps.length };
    return { component: null, decision: null, generation: null, progressionBearing: true, components: 0 };
  }

  /* fold an effective, received plan transaction into the local accepted projection (inside the same transaction) */
  const onFold = (t, op_id) => { const op = model.ops.get(op_id); if (!op || op.kind !== "plan-mutation") return; const list = model.appliedPlan.filter((a) => a.op_id !== op_id).concat([{ op_id, txn_id: op.requested_transaction_id, members: op.members, provenance: op.group_provenance || "authored" }]); t.put("plan", "applied", { list }); return list; };
  const onFolded = (op_id, list) => { if (list) model.appliedPlan = list; };
  const sync = createSync({ store, model, outbox, authorityKey: cfg.authorityKey, clock, transport: cfg.transport, isOnline: () => model.online, isPaused: () => model.signInRequired || model.standing === "revoked" || model.restoreRequired, onFold, onFolded });
  const face = createFace({ model, outbox, sync, leaseNow: () => leaseNow(), contractObsolete, ambiguity, reads, touched, acceptedPlan, livePlan, answers, history, today: () => clock.today(), persistedSnapshot: () => store.get("sync", "snapshot") });

  /* ---------- the durability rule: ONE local transaction writes the operation(s) and the outbox entry(ies) ---------- */
  const effectiveOn = (date) => ({ local_date: date || clock.today(), local_time: localTime(clock.now(), tz), utc_offset: tz });
  function commitBatch(actions, batch = {}) {
    for (const a of actions) if (a.field) model.fields[a.field] = a.value;   /* the entered values stay in the field whatever happens */
    const ws = face.writeState(); if (ws) return { acknowledged: false, state: ws.state, copy: ws.copy, resolution: ws.resolution };
    const first = model.ownSeq + 1; const lastSeq = model.ownSeq + actions.length;
    const l = leaseNow(first); const l2 = l.valid ? leaseNow(lastSeq) : l;
    if (!l.valid || !l2.valid) { const bad = l.valid ? l2 : l; return { acknowledged: false, state: 20, copy: bad.reason === "no lease" || bad.reason === "lease signature does not verify" ? COPY.LEASE_MISSING : COPY.LEASE_EXPIRED(bad.not_after ? String(bad.not_after).slice(0, 10) : null), reason: bad.reason }; }
    const ops = []; let pred = model.lastOwnOpId;
    try {
      actions.forEach((a, i) => { const seq = first + i; const op = Ops.build({ op_id: "op-" + model.deviceId + "-" + seq, athlete_id: model.athleteId, device_id: model.deviceId, device_seq: seq, predecessor: pred, parents: a.parents, class: a.class, kind: a.kind, target: a.target, effective: a.effective || effectiveOn(), lease_id: l.lease_id, payload: a.payload, plan: a.plan, undo: a.undo, extra: a.extra }, K); ops.push(op); pred = op.op_id; });
    } catch (e) { return { acknowledged: false, state: 3, copy: COPY.SAVE_FAILED_INVALID(e.message), invalid: e.validation || [e.message] }; }
    const entries = ops.map((op, i) => ({ op_id: op.op_id, order: outbox.nextOrder() + i, enqueued: clock.now() }));
    const r = store.transaction((t) => { ops.forEach((op, i) => { t.put("ops", op.op_id, op); t.put("outbox", op.op_id, entries[i]); }); t.put("meta", "device", { device_id: model.deviceId, athlete_id: model.athleteId, seq: lastSeq }); return batch.also ? batch.also(t, ops) : undefined; });
    if (!r.ok) { model.lastSaveFailed = true; return { acknowledged: false, state: 3, copy: COPY.SAVE_FAILED, reason: r.error && r.error.message }; }
    ops.forEach((op, i) => { model.ops.set(op.op_id, op); outbox.add(op.op_id, entries[i].order, entries[i].enqueued); }); model.ownSeq = lastSeq; model.lastOwnOpId = ops[ops.length - 1].op_id; model.lastSaveFailed = false;
    if (batch.after) batch.after(ops, r.value);
    return { acknowledged: true, state: model.online ? 2 : 1, copy: batch.copy || COPY.SAVED, op_id: ops[0].op_id, op_ids: ops.map((o) => o.op_id) };
  }
  const commit = (action) => commitBatch([action], { copy: action.copy, also: action.also, after: action.after ? (ops, v) => action.after(ops[0], v) : undefined });
  const activeSession = () => { let start = null; for (const o of ownOps()) { if (o.kind === "session-start") start = o.op_id; if (o.kind === "session-close") start = null; } return start; };
  const setPayload = (s, startId) => { const p = { load: q(s.load, "lb"), reps: q(s.reps, "rep") }; if (s.lift != null) p.lift = String(s.lift); if (startId) p.session_start_id = startId; if (s.slot != null) p.slot = s.slot; return p; };

  /* ---------- the API ---------- */
  const api = {
    boot, restart, store, model,
    /* named actions (sheet 318–320) */
    weighIn: ({ date, lb }) => { if (typeof lb !== "number" || !Number.isFinite(lb)) { model.fields.weighIn = lb; return { acknowledged: false, state: 3, copy: COPY.SAVE_FAILED_INVALID("A weight is required.") }; } return commit({ field: "weighIn", value: lb, kind: "fact", class: "reading", payload: { lb: q(lb, "lb"), source: "athlete" }, effective: effectiveOn(date) }); },
    logSet: (p) => commit({ field: "logSet", value: p, kind: "session-set", class: "session", payload: setPayload(p, activeSession()), also: (t) => { t.del("drafts", "active"); }, after: () => { model.draft = null; } }),
    decision: (p) => { const payload = { answer: p.answer }; if (p.proposal != null) payload.proposal_id = p.proposal; return commit({ field: "decision", value: p, kind: "proposal-response", class: "plan", payload, copy: COPY.RESOLUTION_SAVED }); },
    correction: (target, fields) => commit({ field: "correction", value: { target, fields }, kind: "correction", class: "reading", target, parents: [target], payload: { replacement_fields: fields } }),
    tombstone: (target, reason) => commit({ field: "tombstone", value: { target, reason }, kind: "tombstone", class: "reading", target, parents: [target], payload: { reason: reason == null ? null : String(reason) } }),
    undoRequest: (targetTxn) => commit({ field: "undoRequest", value: targetTxn, kind: "undo-request", class: "plan", payload: { target: q(1, "txn") }, undo: { target_txn: targetTxn, seen_plan_basis: (model.snapshot && model.snapshot.planBasis) || "basis-0" }, copy: COPY.UNDO_SAVED }),
    finishSession: () => { const start = activeSession(); const payload = { closed: q(1, "flag") }; if (start) payload.session_start_id = start; return commit({ field: "finishSession", value: true, kind: "session-close", class: "session", payload }); },
    planEdit: ({ domain, value, unit }) => { const v = value && typeof value === "object" ? value.value : value; const u = value && typeof value === "object" ? value.unit : unit || Plan.unitFor(domain); return commit({ field: "planEdit", value: { domain, value: v }, kind: "plan-mutation", class: "plan", payload: null, plan: { domain, members: [{ field: domain, value: v, unit: u, provenance: "athlete_edited" }], seen_plan_basis: (model.snapshot && model.snapshot.planBasis) || "basis-0" } }); },
    respond: (proposalId, answer) => commit({ field: "respond", value: { proposalId, answer }, kind: "proposal-response", class: "plan", payload: { proposal_id: proposalId, answer: String(answer) }, copy: COPY.ANSWER_SAVED }),
    /* "Start from today's session": session FACTS only — a start and its sets, one durable transaction, never a plan */
    logSession: ({ date, sets }) => { const eff = effectiveOn(date); const startId = "op-" + model.deviceId + "-" + (model.ownSeq + 1); const actions = [{ field: "logSession", value: { date, sets }, kind: "session-start", class: "session", payload: { slot: "AD_HOC" }, effective: eff }].concat((sets || []).map((s) => ({ kind: "session-set", class: "session", payload: setPayload(s, startId), effective: eff }))); return commitBatch(actions); },
    beginEntry: (draft) => { const rec = { kind: draft.kind || "set", lift: draft.lift || null, set: draft.set == null ? null : draft.set, at: clock.now() }; const r = store.transaction((t) => { t.put("drafts", "active", rec); }); if (r.ok) model.draft = rec; return { durable: r.ok }; },
    fieldValue: (name) => model.fields[name],
    /* face */
    face: face.face, faceLabel: sync.faceLabel, stateOf: face.governing, conflictFace: face.conflictFace,
    plan: () => (acceptedPlan() ? livePlan() : null),
    acceptedPlanTransactions: () => { const out = []; const s = model.snapshot; if (s && s.plan) out.push({ source: "authority", version: s.planVersion || null, provenance: s.planProvenance || null, plan: Object.assign({}, s.plan) }); for (const a of model.appliedPlan) out.push({ txn_id: a.txn_id, provenance: a.provenance, plan: Plan.project({}, a.members), op_id: a.op_id }); if (model.localPlan) out.push({ txn_id: model.localPlan.txn_id, provenance: model.localPlan.provenance, plan: Plan.project({}, model.localPlan.members), op_id: model.localPlan.op_id }); return out; },
    proposals: () => { const out = face.layer2().proposals.slice(); if (!acceptedPlan() && !model.explicitNoPlan) { const offer = Plan.initialPlanOffer(sessionFacts()); if (offer) out.push(offer); } return out; },
    acceptInitialPlan: (choiceId) => {
      if (choiceId === "no-plan") { const r = store.transaction((t) => { t.put("plan", "choice", { id: "no-plan", at: clock.now() }); }); if (r.ok) model.explicitNoPlan = true; return { acknowledged: r.ok, choice: choiceId }; }
      if (choiceId !== "from-session") return { acknowledged: false, state: 3, copy: COPY.SAVE_FAILED_INVALID("Unknown choice " + choiceId) };
      const members = Plan.membersFromSession(sessionFacts()); if (!members.length) return { acknowledged: false, state: 3, copy: COPY.SAVE_FAILED_INVALID("No session facts to start from.") };
      return commit({ field: "acceptInitialPlan", value: choiceId, kind: "plan-mutation", class: "plan", payload: null, plan: { domain: "training", members, seen_plan_basis: "basis-0", group_provenance: "consented" }, also: (t, ops) => { const op = ops[0]; const rec = { txn_id: op.requested_transaction_id, members: op.members, provenance: "consented", version: op.requested_transaction_id, op_id: op.op_id, choice: choiceId }; t.put("planTransactions", rec.txn_id, rec); t.put("plan", "accepted", rec); return rec; }, after: (op, rec) => { model.localPlan = rec; } });
    },
    /* connectivity + sync */
    goOnline: () => { model.online = true; }, goOffline: () => { model.online = false; },
    syncOnce: sync.syncOnce, outbox: () => outbox.ids().map((op_id) => ({ op_id })), sentLog: () => outbox.sentLog(), retryEligible: (op_id) => outbox.eligible(op_id, clock.monotonicMs()),
    deliverDisposition: sync.deliverDisposition, deliverReceipts: sync.deliverReceipts, frontier: () => model.W, authorityFrontier: () => model.authorityW, reduceThroughW: sync.reduceThroughW, receivePlanTransaction: sync.receivePlanTransaction,
    receiveSnapshot: (snapshot) => { const r = store.transaction((t) => { t.put("sync", "snapshot", snapshot); }); if (r.ok) model.snapshot = deepCopy(snapshot); return { stored: r.ok }; },
    envelope: (op_id) => deepCopy(model.ops.get(op_id)) || null, commitmentOf: (o) => Ops.commitmentOf(o, K), canonicalEncode: Canonical.encode,
    /* state 19: fixing a rejected entry is a NEW standalone operation, linked locally only */
    rejectedLedger: () => Array.from(model.rejected.values()).map((r) => ({ ...r })),
    fixRejected: (op_id, payload) => { const rej = model.rejected.get(op_id); if (!rej) return { acknowledged: false, error: "not a rejected entry" }; const r = rej.kind === "fact" && rej.class === "reading" ? api.weighIn(payload) : commit({ kind: rej.kind, class: rej.class, payload }); if (!r.acknowledged) return r; const link = { ...rej, replaced_by: r.op_id }; const w = store.transaction((t) => { t.put("rejected", op_id, link); }); if (w.ok) model.rejected.set(op_id, link); return { newOp: r.op_id, isCorrectionOfRejected: false, differentOpId: r.op_id !== op_id, replaces: op_id, acknowledged: true }; },
    /* standing (17), session (11), integrity (12/18), resume (13) */
    revoke: () => { const r = store.transaction((t) => { t.put("meta", "standing", { standing: "revoked", at: clock.now() }); }); model.standing = "revoked"; return { state: 17, retained: outbox.size(), promiseSync: false, copy: COPY.DEVICE_REMOVED, durable: r.ok }; },
    outboxRetained: () => outbox.size(),
    signInRequired: () => { model.signInRequired = true; }, signedIn: () => { model.signInRequired = false; },
    syncStatus: () => (model.signInRequired ? { paused: true, line: COPY.SIGN_IN_TO_SYNC } : model.standing === "revoked" ? { paused: true, line: COPY.DEVICE_REMOVED } : { paused: !model.online, line: "" }),
    restoreFlow: () => {
      if (!model.restoreRequired) return { step: "NONE" };
      const integ = model.integrity; const cp = integ.checkpoint || {}; const actual = integ.actual || {};
      const ledgerSurvived = cp.outbox === actual.outbox;
      const decl = ledgerSurvived ? (() => { const lost = store.list("outbox").filter((e) => e && !store.get("ops", e.op_id)).length; return { unsyncedLostCount: lost, copy: COPY.UNSYNCED_LOST(lost) }; })() : { unsyncedLostCount: null, copy: COPY.UNSYNCED_UNKNOWABLE };
      return { step: "RESTORE_REQUIRED", reason: integ.reason, paintsAthleteData: false, presentedAsFirstUse: false, sequence: COPY.RESTORE_SEQUENCE.slice(), ledgerSurvived, ...decl };
    },
    resumeAfterKill: () => {
      restart();
      if (model.restoreRequired) return { line: COPY.RESTORE_REQUIRED, draftLine: null, ghost: false, state: 18 };
      let sets = []; for (const o of ownOps()) { if (o.kind === "session-close") sets = []; if (o.kind === "session-set") sets.push(o); }
      const last = sets[sets.length - 1]; const lift = last && last.payload && last.payload.lift;
      const line = last ? (lift ? COPY.LAST_SAVED_SET(sets.length, lift) : "Last saved: Set " + sets.length + ".") : COPY.NO_SETS_SAVED;
      const draftLine = model.draft ? COPY.UNFINISHED_SET(model.draft.set == null ? sets.length + 1 : model.draft.set) : null;
      return { line, draftLine, ghost: false, rebuiltFrom: sets.length };
    },
    /* state 14 */
    receiveSessionStarts: (list) => { const recs = list.map((s) => ({ start: s.start, device: s.device || null, slot: s.slot || "AD_HOC", date: s.date || clock.today(), time: s.time || localTime(clock.now(), tz), sets: s.sets == null ? null : s.sets, tombstoned: !!s.tombstoned })); const r = store.transaction((t) => { for (const s of recs) t.put("sessionStarts", s.start, s); }); if (!r.ok) return { stored: false }; for (const s of recs) { const i = model.sessionStarts.findIndex((x) => x.start === s.start); if (i >= 0) model.sessionStarts[i] = s; else model.sessionStarts.push(s); } return { stored: true }; },
    ambiguity,
    resolveAmbiguity: (decision) => {
      const comps = components(); const comp = decision && decision.component ? comps.find((c) => Session.sameSet(c.members, decision.component)) : comps.find((c) => !decidedFor(c));
      if (!comp) return { refused: true, reason: "no unresolved ambiguity component" };
      const err = Session.validatePartition(comp, decision); if (err) return { refused: true, reason: err };
      const canonical = Session.canonicalPartition(comp, decision); const rec = { ...canonical, key: comp.key };
      const r = commit({ kind: "session-relationship-resolution", class: "session", payload: { component: canonical.component, blocks: canonical.blocks, bases: canonical.bases.map((b) => (typeof b === "string" ? b : Canonical.encode(b))), generation: canonical.generation }, also: (t) => { t.put("sessionResolutions", comp.key, rec); }, after: () => { model.sessionResolutions.set(comp.key, rec); }, copy: COPY.RESOLUTION_SAVED });
      if (!r.acknowledged) return { refused: true, reason: r.copy, state: r.state };
      return { ...canonical, op_id: r.op_id };
    },
    candidateComponent: (starts) => Session.candidateComponents(starts).map((c) => ({ members: c.members, generation: c.generation })),
    advanceGeneration: (component, change) => { const next = Session.advanceGeneration(component, change); model.generations[next.key] = next.generation; return { members: next.members, generation: next.generation, supersedesPending: next.supersedesPending, change: next.change }; },
    resolveSameWorkout: Session.resolveSameWorkout, resolveCollisions: Session.resolveCollisions,
    /* state 5 */
    planHistory: (txns) => { const w = frontierLabel() + 1; const recs = txns.map((t, i) => ({ ...deepCopy(t), order: model.planHistory.length + i, appliedAtW: t.applied_at_w != null ? t.applied_at_w : t.athlete_log_seq != null ? t.athlete_log_seq : w })); const r = store.transaction((t) => { for (const rec of recs) t.put("planHistory", rec.txn_id, rec); bumpReductions(t); }); if (!r.ok) return { stored: false, reason: r.error.message }; model.reductions += 1; for (const rec of recs) { const i = model.planHistory.findIndex((x) => x.txn_id === rec.txn_id); if (i >= 0) model.planHistory[i] = rec; else model.planHistory.push(rec); } return { stored: true, appliedAtW: w }; },
    fallbackBefore: (txnId) => Plan.fallbackBefore(model.planHistory, txnId),
    conflictSuspend: (txnId) => { const fb = Plan.fallbackBefore(model.planHistory, txnId); if (!fb) return { suspended: false, reason: "unknown transaction " + txnId }; const txn = model.planHistory.find((t) => t.txn_id === txnId); const rec = { txn_id: txnId, fallback: fb.plan, excluded: fb.excluded, appliedAtW: txn.appliedAtW, suspendedAtW: frontierLabel() + 1, source: fb.source }; const r = store.transaction((t) => { t.put("suspensions", txnId, rec); bumpReductions(t); }); if (!r.ok) return { suspended: false, reason: r.error.message }; model.reductions += 1; model.suspensions.set(txnId, rec); return { suspended: true, fallback: fb.plan, history: COPY.SUSPENDED_HISTORY(rec.appliedAtW, rec.suspendedAtW) }; },
    /* state 8 */
    deriveInstance: Plan.deriveInstance,
    recordIssuance: ({ id, accepted, instance }) => { const rec = { id, accepted: !!accepted, instance: instance == null ? null : instance }; const r = store.transaction((t) => { t.put("issuances", id, rec); }); if (r.ok) model.issuances.set(id, rec); return { stored: r.ok }; },
    issuedInstance: (id) => { const i = model.issuances.get(id); return i ? i.instance : undefined; },
    /* facts (A4 presence law) */
    dayFacts: (date) => { const dead = tombstoned(); const food = Array.from(model.ops.values()).filter((o) => o.class === "food-day" && o.kind === "fact" && o.effective && o.effective.local_date === date && !model.rejected.has(o.op_id) && !dead.has(o.op_id)); if (!food.length) return { date, intakeState: "ABSENT" }; const o = food[food.length - 1]; const k = o.payload && o.payload.kcal; return { date, intake: k && k.value, unit: k && k.unit, intakeState: "ATHLETE_LOGGED", op_id: o.op_id }; },
    maintenanceInputs: (days) => { const dates = Array.isArray(days) ? days.slice() : []; if (!dates.length) { const n = (days && days.window) || 14; for (let i = n; i >= 1; i--) dates.push(addDays(clock.today(), -i)); } return dates.map((d) => { const f = api.dayFacts(d); return f.intakeState === "ATHLETE_LOGGED" ? { date: d, intake: f.intake, source: "ATHLETE_LOGGED", op_id: f.op_id } : { date: d, source: "ABSENT" }; }); },
    leanFromEstimate,
  };
  return api;
}
module.exports = { createClient, memoryBackend, Store, canonical: Canonical, ops: Ops, copy: COPY };
