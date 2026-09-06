import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createDurablePublicClient } from "../public-client.mjs";
import { createCandidateGrant } from "../candidate-grant.mjs";
import { StorageFailure } from "../repository.mjs";
import { Client, O, config, initial, fixture, faultDatabase, deferred, createT2Stage } from "./support.mjs";
const require = createRequire(import.meta.url), Signer = require("../../w5/crypto.cjs"), W5 = require("../../w5/public-client.cjs");
const clone = value => structuredClone(value);
async function setup(options = {}) {
  const signingKey = Signer.generateSigningKey("public-run"), key = Signer.publicKeyOf(signingKey);
  const f = await fixture(options.repository || {});
  const lease = Signer.signLease({ ...O.lease("dev-A"), schema_version: 1, signature: undefined }, signingKey);
  const seed = initial(); seed.metadata.authorityLease = lease;
  await f.repo.initialize(seed, "synthetic-enrollment-only");
  const status = { session: 1, observation: 1 };
  const stage = options.stage || createT2Stage(config, { allowInbound: true });
  const args = { repository: f.repo, stage, namespace: f.setup.namespace, athleteId: "ath-1", deviceId: "dev-A", sessionEpoch: 1,
    isCurrentSession: epoch => status.session === epoch, observationEpoch: () => status.observation,
    observationGuard: { run: async (_kind, action) => action() }, // Synthetic only: does NOT implement the required durable fence.
    validateCommit: options.validateCommit || (() => null), keys: [key], ...options.client };
  const c = createDurablePublicClient(args);
  const response = body => ({ wireVersion: W5.WIRE_VERSION, body });
  const accepted = op => Signer.signDisposition({ op_id: op.op_id, device_id: op.device_id, device_seq: op.device_seq,
    canonical_content_commitment: op.canonical_content_commitment, status: "ACCEPTED", athlete_log_seq: 1, decided_at: "2026-09-04T00:00:00Z" }, signingKey);
  const pull = (receipts, extra = {}) => Signer.signPull({ athlete_id: "ath-1", device_id: "dev-A", after: 0, through: receipts.length,
    receipts, wire_version: W5.WIRE_VERSION, key_epoch: key.kid, ...extra }, signingKey);
  return { ...f, c, args, status, signingKey, key, lease, response, accepted, pull };
}
test("structural candidate grants allow repeated checks and clones, then retire; stale epoch and changed signed bytes fail", () => {
  let current = true; const lease = { signature: "synthetic", x: 1 }, op = { op_id: "a", n: 1 }, disposition = { authority_signature: "synthetic", op_id: "a" }, scope = { namespace: "n", epoch: 1 };
  const grant = createCandidateGrant({ lease, expectedOperation: op, disposition, scope, isCurrent: () => current });
  for (let i = 0; i < 4; i++) assert.equal(grant.verifyLease({ x: 1, signature: "synthetic" }), true);
  assert.equal(grant.verifyDisposition(clone(disposition), clone(op)), true);
  assert.equal(grant.verifyLease({ ...lease, x: 2 }), false); assert.equal(grant.matchesScope({ namespace: "n", epoch: 2 }), false);
  current = false; assert.equal(grant.verifyLease(lease), false); current = true; grant.retire(); assert.equal(grant.verifyLease(lease), false);
  const fresh = createCandidateGrant({ lease, scope, isCurrent: () => true }); assert.equal(fresh.verifyLease(clone(lease)), true);
});
test("actual public disposition drains only after IDB complete; exact signed proof survives reopen and replay", async () => {
  const faults = faultDatabase(), f = await setup({ repository: { indexedDB: faults.indexedDB } });
  const write = await f.c.execute("weighIn", { lb: 170 }); assert.equal(write.acknowledged, true);
  const before = await f.repo.load(), op = before.generation.collections.ops[write.op_id], d = f.accepted(op);
  faults.state.armed = true; faults.state.mode = "delay"; let finished = false;
  const pending = f.c.acceptResponse("disposition", f.response({ disposition: d })).then(result => { finished = true; return result; });
  await Promise.race([faults.state.write.promise, pending.then(() => { throw new Error("response completed before reaching delayed durable transaction"); })]);
  assert.equal(finished, false); assert.equal(f.c.current().view.layer1.notYetSyncedCount, 1);
  faults.state.release = true; const result = await pending; assert.equal(result.accepted, true); assert.equal(result.result.durable, true);
  faults.state.armed = false;
  const after = await f.repo.load(); assert.equal(Object.keys(after.generation.collections.outbox).length, 0);
  assert.deepEqual(after.generation.metadata.wireProofs.disposition[d.authority_signature], d);
  assert.equal((await f.c.acceptResponse("disposition", f.response({ disposition: d }))).accepted, true);
  assert.equal(Object.keys((await f.repo.load()).generation.collections.ops).length, 1); f.repo.close();
});
test("verified sink abort retains whole generation and underlying17/18/19/20 with nonprivate reasons", async () => {
  for (const state of [17, 18, 19, 20]) {
    let refuse = false; const f = await setup({ validateCommit: () => refuse ? { state, code: "SYNTHETIC_REFUSAL" } : null });
    const saved = await f.c.execute("weighIn", { lb: 170 }), before = await f.repo.load(); refuse = true;
    const result = await f.c.acceptResponse("disposition", f.response({ disposition: f.accepted(before.generation.collections.ops[saved.op_id]) }));
    assert.equal(result.accepted, false); assert.equal(result.state, state); assert.equal(result.result.stored, false); assert.equal(result.result.durable, false); assert(result.reason.length > 5);
    assert.deepEqual(await f.repo.load(), before); if (state !== 20) assert.equal(f.c.current().view, null); f.repo.close();
  }
});
test("numeric zero frontier is durable success; a real T2 receipt storage throw becomes reasoned3, never W5 exception12", async () => {
  const f = await setup();
  const zero = await f.c.acceptResponse("pull", f.response(f.pull([]))); assert.equal(zero.accepted, true); assert.equal(zero.result.result, 0); f.repo.close();
  const base = createT2Stage(config, { allowInbound: true });
  const failing = (...args) => {
    const original = Client.memoryBackend;
    Client.memoryBackend = data => { const b = original(data); b.commit = () => { throw new Error("synthetic storage failure"); }; return b; };
    try { return base(...args); } finally { Client.memoryBackend = original; }
  };
  const g = await setup({ stage: failing }), before = await g.repo.load();
  const result = await g.c.acceptResponse("pull", g.response(g.pull([])));
  assert.equal(result.accepted, false); assert.equal(result.state, 3); assert.equal(result.result.code, "T2_SINK_FAILED"); assert(result.reason); assert.deepEqual(await g.repo.load(), before); g.repo.close();
});
test("signed snapshot ingests exact second-device history without inventing T2 product projection", async () => {
  const f = await setup(), other = Client.createClient({ ...config(), deviceId: "dev-B", lease: O.lease("dev-B") }); other.boot();
  const saved = other.weighIn({ lb: 170.4 }), op = other.envelope(saved.op_id);
  const receipt = Signer.signReceipt({ seq: 1, op_id: op.op_id, canonical_content_commitment: op.canonical_content_commitment, accepted_at: "2026-09-04T00:00:00Z", op }, f.signingKey);
  const snapshot = Signer.signSnapshot({ athlete_id: "ath-1", device_id: "dev-A", W: 1, records: 1, entries: [receipt], wire_version: W5.WIRE_VERSION, key_epoch: f.key.kid }, f.signingKey);
  const before = await f.repo.load(), result = await f.c.acceptResponse("snapshot", f.response(snapshot), 1);
  assert.equal(result.accepted, true); const after = await f.repo.load();
  assert.deepEqual(after.generation.collections.ops[op.op_id], op); assert.equal(after.generation.collections.sync.frontier.W, 1);
  assert.deepEqual(after.generation.collections.sync.snapshot, before.generation.collections.sync.snapshot);
  assert.deepEqual(after.generation.metadata.wireProofs.snapshot[snapshot.authority_signature], snapshot); f.repo.close();
});
test("mutated/forged/incompatible responses never change disk, and account switch cannot write into new scope", async () => {
  const f = await setup(), before = await f.repo.load();
  const forged = { ...f.pull([]), authority_signature: "wrong" };
  assert.equal((await f.c.acceptResponse("pull", f.response(forged))).accepted, false);
  assert.equal((await f.c.acceptResponse("lease", { wireVersion: "other", body: { lease: f.lease } })).state, 12);
  assert.deepEqual(await f.repo.load(), before); f.status.session = 2;
  assert.equal((await f.c.acceptResponse("lease", f.response({ lease: f.lease }))).state, 17); assert.deepEqual(await f.repo.load(), before); f.repo.close();
});
test("time exchange stores a challenge-bound sample only, creates no checkpoint or allowance", async () => {
  const f = await setup(); let clock = 0;
  const c = createDurablePublicClient({ ...f.args, monotonicMs: () => ++clock });
  const before = await f.repo.load();
  const result = await c.exchangeServerTime(async ({ challenge }) => f.response(Signer.signServerTime({ athlete_id: "ath-1", device_id: "dev-A", challenge,
    server_time: "2026-09-04T00:00:00Z", wire_version: W5.WIRE_VERSION, time_profile: W5.TIME_PROFILE, key_epoch: f.key.kid }, f.signingKey)));
  assert.equal(result.accepted, true); const after = await f.repo.load();
  assert(after.generation.metadata.authenticatedTimeSample); assert.deepEqual(after.generation.metadata.budget, before.generation.metadata.budget);
  assert.deepEqual(after.generation.metadata.checkpoint, before.generation.metadata.checkpoint); assert.equal(after.generation.metadata.clockCheckpoint, undefined); f.repo.close();
});
test("independent public clients race from fresh snapshots; full actual batch metadata reaches immutable final validator", async () => {
  const seen = [], f = await setup({ validateCommit: context => { seen.push(context); assert(Object.isFrozen(context)); assert(Object.isFrozen(context.batch.operations[0])); return null; } });
  const secondRepo = await (await import("../repository.mjs")).openRepository(f.setup);
  const second = createDurablePublicClient({ ...f.args, repository: secondRepo });
  const results = await Promise.all([f.c.execute("weighIn", { lb: 170 }), second.execute("logSession", { sets: [{ load: 100, reps: 8 }] })]);
  assert(results.every(result => result.acknowledged));
  const after = await f.repo.load(); assert.equal(Object.keys(after.generation.collections.ops).length, 3); assert.equal(Object.keys(after.generation.collections.outbox).length, 3);
  assert.deepEqual(seen.map(c => c.batch.count).sort(), [1, 2]); f.repo.close(); secondRepo.close();
});
test("prepared permission is sampled once for repeated T2 predicates; renewal is not silently implemented", async () => {
  let samples = 0;
  const f = await setup({ client: { permissionNowIso: () => { samples++; return "2026-09-04T00:00:00Z"; } } });
  assert.equal((await f.c.execute("logSession", { sets: [{ load: 100, reps: 8 }] })).acknowledged, true);
  assert.equal(samples, 1);
  const before = await f.repo.load(), changed = Signer.signLease({ ...f.lease, lease_id: "new-unreconciled-lease" }, f.signingKey);
  const result = await f.c.acceptResponse("lease", f.response({ lease: changed }));
  assert.equal(result.state, 18); assert.equal(result.code, "LEASE_RENEWAL_UNIMPLEMENTED"); assert.deepEqual(await f.repo.load(), before); f.repo.close();
});
test("historical signed proof is reverified in a new client/key context, never replaced by a durable verified flag", async () => {
  const f = await setup(); await f.c.acceptResponse("pull", f.response(f.pull([])));
  const before = await f.repo.load(), altered = clone(before.generation);
  const proof = Object.values(altered.metadata.wireProofs.pull)[0]; proof.through = 1;
  await f.repo.commit(before, altered); // Valid outer seal, invalid inner signed proof.
  const fresh = createDurablePublicClient(f.args), result = await fresh.reopen();
  assert.equal(result.refusal.state, 18); assert.equal(result.view, null); f.repo.close();
});
test("new known runtime evidence invalidates a sealed candidate even without a newer durable revision", async () => {
  const f = await setup(), started = deferred(), released = deferred(), original = f.setup.crypto.subtle.encrypt.bind(f.setup.crypto.subtle);
  const crypto = { ...f.setup.crypto, getRandomValues: f.setup.crypto.getRandomValues.bind(f.setup.crypto), subtle: {
    encrypt: async (...args) => { started.resolve(); await released.promise; return original(...args); },
    decrypt: f.setup.crypto.subtle.decrypt.bind(f.setup.crypto.subtle),
  } };
  const repository = await (await import("../repository.mjs")).openRepository({ ...f.setup, crypto });
  const client = createDurablePublicClient({ ...f.args, repository });
  const before = await f.repo.load(), pending = client.execute("weighIn", { lb: 170 });
  await started.promise; f.status.observation++; released.resolve();
  const result = await pending; assert.equal(result.state, 18); assert.equal(result.code, "OBSERVATION_CHANGED"); assert.deepEqual(await f.repo.load(), before);
  repository.close(); f.repo.close();
});
test("current immediately hides prior account truth when session changes without another command", async () => {
  const f = await setup(); await f.c.execute("weighIn", { lb: 170 }); assert(f.c.current().view);
  f.status.session = 2; const now = f.c.current(); assert.equal(now.view, null); assert.equal(now.retainedInput, null); assert.equal(now.refusal.state, 17); f.repo.close();
});
test("context changes after actual IDB complete withhold Saved while preserving the completed disk facts", async () => {
  for (const kind of ["session", "observation"]) {
    const f = await setup(), completed = deferred(), release = deferred();
    const repository = { ...f.repo, async commit(...args) { const result = await f.repo.commit(...args); completed.resolve(); await release.promise; return result; } };
    const c = createDurablePublicClient({ ...f.args, repository });
    const pending = c.execute("weighIn", { lb: 170 }); await completed.promise;
    assert.equal(Object.keys((await f.repo.load()).generation.collections.ops).length, 1, "actual transaction is already complete before fault injection");
    f.status[kind]++; release.resolve(); const result = await pending;
    assert.equal(result.acknowledged, false); assert.equal(result.committed, true); assert.equal(result.durable, true); assert.equal(result.confirmed, false); assert.equal(result.state, kind === "session" ? 17 : 18);
    assert.equal(c.current().view, null); assert.equal(Object.keys((await f.repo.load()).generation.collections.outbox).length, 1);
    const reopened = await c.reopen(); assert.equal(reopened.view, null); assert.equal(reopened.refusal.state, result.state);
    const beforeRetry = await f.repo.load(), retry = await c.execute("weighIn", { lb: 171 });
    assert.equal(retry.acknowledged, false); assert.equal(retry.stored, false); assert.equal(retry.durable, false);
    assert.equal(retry.priorCommittedRevision, result.committedRevision); assert.deepEqual(await f.repo.load(), beforeRetry); f.repo.close();
  }
});
test("inbound completion changed-context uses confirmed:false without falsely reporting durable disk as aborted", async () => {
  const f = await setup(), completed = deferred(), release = deferred();
  const repository = { ...f.repo, async commit(...args) { const result = await f.repo.commit(...args); completed.resolve(); await release.promise; return result; } };
  const c = createDurablePublicClient({ ...f.args, repository });
  const pending = c.acceptResponse("pull", f.response(f.pull([]))); await completed.promise; f.status.session++; release.resolve();
  const result = await pending; assert.equal(result.accepted, false); assert.equal(result.state, 17); assert.equal(result.result.stored, true); assert.equal(result.result.durable, true); assert.equal(result.result.confirmed, false);
  assert.equal(c.current().view, null); assert((await f.repo.load()).generation.metadata.wireProofs.pull); f.repo.close();
});
test("time guard failures preserve each specific underlying17/18/19/20 instead of generic3", async () => {
  for (const state of [17, 18, 19, 20]) {
    const f = await setup({ client: { observationGuard: { run() { throw new StorageFailure("SYNTHETIC_GUARD", state); } } } });
    const before = await f.repo.load(), result = await f.c.exchangeServerTime(() => { throw new Error("must not request"); });
    assert.equal(result.state, state); assert(result.reason); assert.deepEqual(await f.repo.load(), before); f.repo.close();
  }
});
test("B11 pending time network request does not stall an allowed local write or clear its unresolved guard", async () => {
  const f = await setup(), requested = deferred(), release = deferred(); let completed = false, challenge;
  const exchange = f.c.exchangeServerTime(async value => { challenge = value.challenge; requested.resolve(); await release.promise; return f.response(Signer.signServerTime({
    athlete_id: "ath-1", device_id: "dev-A", challenge, server_time: "2026-09-04T00:00:00Z", wire_version: W5.WIRE_VERSION, time_profile: W5.TIME_PROFILE, key_epoch: f.key.kid }, f.signingKey)); }).then(value => { completed = true; return value; });
  await requested.promise;
  let timer;
  try {
    const saved = await Promise.race([f.c.execute("weighIn", { lb: 170 }), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("network wait held local queue")), 1000); })]);
    assert.equal(saved.acknowledged, true); assert.equal(completed, false); assert.equal(Object.keys((await f.repo.load()).generation.collections.outbox).length, 1);
    assert.equal((await f.c.exchangeServerTime(() => { throw new Error("must not launch a competing challenge"); })).code, "TIME_EXCHANGE_PENDING");
  } finally { clearTimeout(timer); release.resolve(); }
  assert.equal((await exchange).accepted, true); assert.equal(Object.keys((await f.repo.load()).generation.collections.outbox).length, 1); f.repo.close();
});
