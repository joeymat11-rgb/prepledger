/* rig187 — what the suite's B-durability law does NOT test: what is ON DISK after a crashed transaction, seen by a
   RESTARTED client on the same backend. Two subjects: the real product, and the rig186 M6 mutant (store rollback a no-op).
   Expected: real product → after "crash-after-op-before-outbox" a restart finds 0 ops, 0 outbox, integrity intact, not
   state 18, no ghost read. Mutant → the half-written op is either a ghost (worst) or an integrity failure (state 18).
   Either way the SUITE currently says 35 GREEN for both → law-edit candidate for suite v4. */
const __p = require("node:path"), __f = require("node:fs"); const CLIENT_DIR = process.env.EARNED_CLIENT_DIR || (__f.existsSync(__p.join(__dirname, "..", "client", "index.cjs")) ? __p.join(__dirname, "..", "client") : "/home/claude/rebuild/client"); const CONFORM_DIR = process.env.EARNED_CONFORM_DIR || (__f.existsSync(__p.join(__dirname, "..", "conform", "run.cjs")) ? __p.join(__dirname, "..", "conform") : "/home/claude/conform");
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const O = require(__p.join(CONFORM_DIR, "lib/ops.cjs"));
function faulty(inner, mode) { return { ...inner, begin: (...a) => inner.begin(...a), remove: (...a) => inner.remove(...a), commit: (...a) => inner.commit(...a), rollback: (...a) => inner.rollback(...a), get: (...a) => inner.get(...a), keys: (...a) => inner.keys(...a), clear: (...a) => inner.clear(...a), collections: () => inner.collections(),
  write(h, c, k, v) { if (mode === "crash-after-op-before-outbox" && c === "outbox") { const e = new Error("storage: crash before outbox"); e.storage = true; throw e; } return inner.write(h, c, k, v); } }; }
function subject(dir) {
  const Client = require(dir);
  const inner = Client.memoryBackend({ sync: { snapshot: { plan: {}, reads: ["2026-09-04"] }, frontier: { W: 0, authorityW: 0 } } });
  const clock = { now: () => "2026-09-04T00:00:00Z", today: () => "2026-09-04", tz: "-04:00", monotonicMs: () => 0 };
  const mk = (backend) => Client.createClient({ deviceId: "dev-A", athleteId: "ath-1", identityKey: O.K_IDENTITY, authorityKey: O.AUTH_KEY, backend, clock, lease: O.lease("dev-A"), transport: { send: () => undefined, pull: () => ({ receipts: [] }) }, online: false, contract: { client: "1", required: "1" }, standing: "enrolled", signInRequired: false });
  const c1 = mk(faulty(inner, "crash-after-op-before-outbox")); c1.boot();
  const r = c1.weighIn({ date: "2026-09-04", lb: 170.6 });
  const onDisk = { ops: inner.keys("ops").length, outbox: inner.keys("outbox").length, checkpoint: inner.get("meta", "checkpoint") || null };
  const c2 = mk(inner); c2.boot();   /* the app restarts on the SAME storage, with a healthy backend */
  const f = c2.face();
  return { acknowledged: r.acknowledged, stateOnWrite: r.state, onDisk, afterRestart: { ops: c2.model.ops ? c2.model.ops.size : null, outbox: c2.outbox().length, state: f.state, reads: (f.layer1.reads || []).length, integrityIntact: c2.model.integrity && c2.model.integrity.intact, restore: c2.restoreFlow().step } };
}
const real = subject(CLIENT_DIR);
const mdir = fs.mkdtempSync(path.join(os.tmpdir(), "t2-m6-")); fs.cpSync(CLIENT_DIR, mdir, { recursive: true });
const sp = path.join(mdir, "store.cjs"); fs.writeFileSync(sp, fs.readFileSync(sp, "utf8").replace("rollback(h) { if (h !== open) return; for (let i = journal.length - 1; i >= 0; i--)", "rollback(h) { if (h !== open) return; journal.length = 0; open = null; return; for (let i = journal.length - 1; i >= 0; i--)"));
const mutant = subject(mdir);
const checks = {
  "real: the crashed write is NOT acknowledged (state 3)": real.acknowledged === false && real.stateOnWrite === 3,
  "real: nothing on disk after the crash (0 ops, 0 outbox)": real.onDisk.ops === 0 && real.onDisk.outbox === 0,
  "real: a restart on the same storage finds 0 ops, 0 outbox, integrity intact, not state 18, no ghost read": real.afterRestart.ops === 0 && real.afterRestart.outbox === 0 && real.afterRestart.state !== 18 && real.afterRestart.reads === 0 && real.afterRestart.integrityIntact === true,
  "mutant: leaves the half-written op ON DISK (1 op, 0 outbox)": mutant.onDisk.ops === 1 && mutant.onDisk.outbox === 0,
  "mutant: a restart detects it — integrity NOT intact → state 18 (never a silent ghost read)": mutant.afterRestart.integrityIntact === false && mutant.afterRestart.state === 18 && mutant.afterRestart.reads === 0,
};
console.log("rig187 — durability seen through RESTART (what the suite's B-durability law does not test)");
console.log(JSON.stringify({ real, mutant }, null, 1));
let ok = true; for (const [k, v] of Object.entries(checks)) { console.log((v ? "OK   " : "BAD  ") + k); ok = ok && v; }
console.log("rig187 ⇒ " + (ok ? "PASS" : "FAIL") + "  — SUITE GAP: both subjects are 35 GREEN under run.cjs; B-durability never restarts from the store (law-edit candidate for suite v4)");
process.exit(ok ? 0 : 1);
