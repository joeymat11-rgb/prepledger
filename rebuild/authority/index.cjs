"use strict";
/* index.cjs — createAuthority(config): the composition root of the server authority's core.
   config: { authorityKey (required), backend (store backend; default in-memory), clock { now() → ISO instant } (required),
             athletes: { id: { devices: { deviceId: { lease } }, plan? } }, identityKeyFor?(athleteId) | identityKeys? }
   Every public method opens ONE store transaction (or a read-only view). A storage failure inside admit() surfaces as
   { status: "UNAVAILABLE", retry: true } — nothing durable moved, the client retries the same op_id. */
const Crypto = require("./crypto.cjs");
const { createStore, memoryBackend, rowKey } = require("./store.cjs");
const Reduce = require("./reduce.cjs");
const Plan = require("./plan.cjs");
const Issue = require("./issue.cjs");
const Admit = require("./admit.cjs");
const { createLocalCommitter } = require("./committer.cjs");
function createAuthority(config) {
  const cfg = config || {};
  if (!cfg.authorityKey) throw new Error("createAuthority: config.authorityKey is required");
  if (!cfg.clock || typeof cfg.clock.now !== "function") throw new Error("createAuthority: config.clock.now() is required");
  const store = createStore(cfg.backend || memoryBackend());
  const ctx = { key: cfg.authorityKey, clock: cfg.clock, crypto: Crypto, identityKeyFor: typeof cfg.identityKeyFor === "function" ? cfg.identityKeyFor : (cfg.identityKeys ? (a) => cfg.identityKeys[a] : () => undefined) };
  ctx.log = Reduce.make(ctx); ctx.plan = Plan.make(ctx); ctx.issue = Issue.make(ctx); const admission = Admit.make(ctx);
  function enrol(t, id, a) {
    const ath = a || {};
    if (!t.get("athletes", id)) { t.put("athletes", id, { id }); t.put("plan", id, { ...Plan.DEFAULT_PLAN, ...(ath.plan || {}) }); }
    for (const [dev, d] of Object.entries(ath.devices || {})) t.put("devices", rowKey(id, dev), { device_id: dev, lease: d && d.lease ? d.lease : null });
  }
  const init = store.transaction((t) => { for (const [id, a] of Object.entries(cfg.athletes || {})) enrol(t, id, a); });
  if (!init.ok) throw init.error;
  const write = (fn) => { const r = store.transaction(fn); if (!r.ok) throw r.error; return r.value; };
  const read = (fn) => fn(store.view());
  const unavailable = (r, extra) => ({ status: "UNAVAILABLE", retry: true, reason: r.error.message, ...extra });
  return {
    /* enrolment and capability */
    enrolAthlete: (id, a) => write((t) => enrol(t, id, a)),
    grantLease: (A, lease) => write((t) => { if (!t.get("athletes", A)) throw new Error("unknown athlete " + A); t.put("devices", rowKey(A, lease.device_id), { device_id: lease.device_id, lease }); return lease; }),
    signLease: (lease) => Crypto.signLease(cfg.authorityKey, lease),
    revokeDevice: (A, dev) => write((t) => admission.revokeDevice(t, A, dev)),
    /* admission */
    admit(A, op, meta) { const r = store.transaction((t) => admission.admit(t, A, op, meta)); return r.ok ? r.value : unavailable(r, { op_id: op && op.op_id }); },
    disposition: (A, dev, seq) => read((t) => admission.disposition(t, A, dev, seq)),
    dispositionHistory: (A, dev, seq) => read((t) => admission.dispositionHistory(t, A, dev, seq)),
    verifyDisposition: (d) => Crypto.verifyDisposition(cfg.authorityKey, d),
    /* the log */
    log: (A) => read((t) => ctx.log.logOps(t, A)),
    frontier: (A) => read((t) => ctx.log.frontier(t, A)),
    receiptsAfter: (A, W) => read((t) => ctx.log.receiptsAfter(t, A, W)),
    exportSnapshot: (A, o) => read((t) => ctx.log.exportSnapshot(t, A, o)),
    /* the plan */
    plan: (A) => read((t) => ctx.plan.planOf(t, A)),
    planTransactions: (A) => read((t) => ctx.plan.transactions(t, A)),
    planOfDomain: (A, d) => read((t) => ctx.plan.planOfDomain(t, A, d)),
    planState: (A, d) => read((t) => ctx.plan.planState(t, A, d)),
    txnDigests: (A, txnId) => read((t) => ctx.plan.txnDigests(t, A, txnId)),
    /* proposals */
    issue: (A, iss) => write((t) => ctx.issue.issue(t, A, iss)),
    apply(A, req) { const r = store.transaction((t) => ctx.issue.apply(t, A, req)); return r.ok ? r.value : unavailable(r, { apply_request_id: req && req.apply_request_id }); },
    confirmBasis: (A, inst, unchanged) => write((t) => ctx.issue.confirmBasis(t, A, inst, unchanged)),
    instanceOf: (A, issuanceId) => read((t) => ctx.issue.instanceOf(t, A, issuanceId)),
    instanceState: (A, inst) => read((t) => ctx.issue.instanceState(t, A, inst)),
    /* the device-side validator, bound to this authority's key */
    localCommitter: (o) => createLocalCommitter({ authorityKey: cfg.authorityKey, ...(o || {}) }),
    CODES: Admit.CODES,
  };
}
module.exports = { createAuthority, createLocalCommitter, memoryBackend, createStore, canonical: require("./canonical.cjs"), crypto: Crypto, shapeDefect: Admit.shapeDefect, cmpKey: Plan.cmpKey, CODES: Admit.CODES };
