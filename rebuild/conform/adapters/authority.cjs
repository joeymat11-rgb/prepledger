/* adapters/authority.cjs — TRANCHE T3: the PRODUCT authority (rebuild/authority, builder CLAUDE) behind the suite's §A / §C
   adapter contract. This file maps the suite's config (athletes → devices → signed leases) onto createAuthority(), supplies
   the in-memory backend wrapped in a fault injector and a fixed test clock, and returns the API object the laws call.
   `hooks` is ignored (mutants apply only to the suite's own model). It requires ../lib/ops.cjs ONLY for the shared test
   constant AUTH_KEY — nothing else from the suite, and nothing from the suite's model directory. */
const O = require("../lib/ops.cjs");
const path = require("node:path"), fs = require("node:fs");
const AUTH_DIR = process.env.EARNED_AUTHORITY_DIR || [path.join(__dirname, "..", "..", "authority"), "/home/claude/rebuild/authority"].find((d) => fs.existsSync(path.join(d, "index.cjs")));
if (!AUTH_DIR) throw new Error("adapters/authority.cjs: the product authority was not found (set EARNED_AUTHORITY_DIR)");
const Authority = require(AUTH_DIR);

/* ---- fault injection from OUTSIDE the product: a backend whose write fails at the named point ----
   The product writes the admission and its plan transaction in ONE store transaction; failing the plan-transaction row
   makes that whole transaction roll back — the "crash between admission and plan transaction" of the A5 law, seen from
   storage. The product has no test hook: it only sees a storage error. */
function faultyBackend(inner, faults) {
  const fail = (what) => { const e = new Error("storage: " + what); e.storage = true; throw e; };
  return {
    begin: () => inner.begin(), read: (h, c, k) => inner.read(h, c, k), keys: (h, c) => inner.keys(h, c), remove: (h, c, k) => inner.remove(h, c, k),
    commit: (h) => inner.commit(h), rollback: (h) => inner.rollback(h),
    write(h, c, k, text) {
      if (faults.point && c === "plan_txns") {
        let kind = null; try { kind = JSON.parse(text).kind; } catch (_) { /* not a transaction row */ }
        if (faults.point === "between-admission-and-plan-transaction" && kind === "plan-mutation") fail("commit failed at " + faults.point);
        if (faults.point === "between-admission-and-selection-commit" && kind === "conflict-selection") fail("commit failed at " + faults.point);
      }
      return inner.write(h, c, k, text);
    },
  };
}

function create(cfg, _hooks) {
  const faults = { point: null };
  const backend = faultyBackend(Authority.memoryBackend(), faults);
  const clock = { now: () => "2026-09-03T00:00:00Z" };
  const a = Authority.createAuthority({ authorityKey: O.AUTH_KEY, backend, clock, athletes: (cfg && cfg.athletes) || {} });
  return {
    admit: a.admit, log: a.log, frontier: a.frontier, disposition: a.disposition, dispositionHistory: a.dispositionHistory, verifyDisposition: a.verifyDisposition,
    injectCrash: (p) => { faults.point = p; }, clearCrash: () => { faults.point = null; },
    plan: a.plan, planTransactions: a.planTransactions, planState: a.planState, planOfDomain: a.planOfDomain, txnDigests: a.txnDigests,
    revokeDevice: a.revokeDevice,
    issue: a.issue, apply: a.apply, confirmBasis: a.confirmBasis, instanceOf: a.instanceOf, instanceState: a.instanceState,
    exportSnapshot: a.exportSnapshot,
    /* the laws hand the committer a lease and clock facts { mono, highWater?, serverTime?, continuityProven?, device_id?, athlete_id?, schema_version? } */
    localCommitter: (lease, clock2) => { const c = clock2 || {}; return a.localCommitter({ lease, mono: c.mono, highWater: c.highWater, serverTime: c.serverTime, continuityProven: c.continuityProven, device_id: c.device_id, athlete_id: c.athlete_id, schema_version: c.schema_version }); },
    CODES: a.CODES,
  };
}
module.exports = { create };
