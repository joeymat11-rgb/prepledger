import test from "node:test";
import assert from "node:assert/strict";
import { createBridge } from "../bridge.mjs";
import { openRepository } from "../repository.mjs";
import { Client, config, initial, fixture, deferred, mutateActive, faultDatabase } from "./support.mjs";

test("original real T2 witness: Promise commit acknowledges before durable completion", () => {
  const inner = Client.memoryBackend(initial().collections);
  let durable = false;
  const backend = { ...inner, commit: handle => new Promise(resolve => { void handle; void resolve; }) };
  const client = Client.createClient({ ...config(), backend }); client.boot();
  const result = client.weighIn({ date: "2026-09-04", lb: 170.6 });
  assert.equal(result.acknowledged, true);
  assert.equal(durable, false);
  assert.equal(client.model.ops.size, 1);
});

test("missing store is state18 and enrollment is explicit; no reseed", async () => {
  const f = await fixture();
  await assert.rejects(f.repo.load(), { state: 18, code: "STORE_MISSING" });
  assert.equal((await f.bridge.reopen()).refusal.state, 18);
  await assert.rejects(f.repo.initialize(initial(), "not-authorized"), { state: 18, code: "ENROLLMENT_UNPROVEN" });
  await f.seed();
  await assert.rejects(f.repo.initialize(initial(), "synthetic-enrollment-only"), { state: 18, code: "ALREADY_INITIALIZED" });
  f.repo.close();
});

test("real T2 operation/outbox and full metadata survive fresh repository/client reopen", async () => {
  const f = await fixture(); await f.seed();
  const before = await f.repo.load();
  const result = await f.bridge.execute("weighIn", { date: "2026-09-04", lb: 170.6 });
  assert.equal(result.acknowledged, true); assert.equal(result.durableRevision, 2);
  const durable = await f.repo.load();
  assert.deepEqual(durable.generation.metadata, before.generation.metadata);
  assert.deepEqual(durable.generation.collections.futureCollection, before.generation.collections.futureCollection);
  assert.equal(Object.keys(durable.generation.collections.ops).length, 1);
  assert.equal(Object.keys(durable.generation.collections.outbox).length, 1);
  const expected = JSON.parse(JSON.stringify(f.stage(before.generation, "weighIn", { date: "2026-09-04", lb: 170.6 })));
  assert.deepEqual(durable.generation, expected.generation);
  f.repo.close();
  const fresh = await f.fresh();
  assert.deepEqual((await fresh.repository.load()).generation, expected.generation);
  assert.deepEqual((await fresh.bridge.reopen()).view, expected.view);
  assert.equal((await fresh.bridge.execute("weighIn", { date: "2026-09-04", lb: 170.7 })).op_id, "op-dev-A-2");
  fresh.repository.close();
});

test("transaction delayed after writes: no acknowledgement/view publication before complete", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
  await f.bridge.reopen(); const before = f.bridge.current().view;
  faults.state.armed = true; faults.state.mode = "delay";
  let acknowledged = false;
  const command = f.bridge.execute("weighIn", { lb: 170.6 }).then(result => { acknowledged = result.acknowledged; return result; });
  await faults.state.write.promise;
  assert.equal(acknowledged, false);
  assert.deepEqual(f.bridge.current().view, before);
  assert.deepEqual(f.bridge.current().retainedInput, { command: "weighIn", args: { lb: 170.6 } });
  faults.state.release = true;
  assert.equal((await command).acknowledged, true);
  assert.notDeepEqual(f.bridge.current().view, before);
  f.repo.close();
});

test("delayed then aborted real transaction: no ghost, typed value retained, prior generation exact", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
  await f.bridge.reopen(); const before = await f.repo.load(), oldView = f.bridge.current().view;
  faults.state.armed = true; faults.state.mode = "delay";
  const command = f.bridge.execute("weighIn", { lb: 170.6 });
  await faults.state.write.promise; faults.state.release = true; faults.state.tx.abort();
  const result = await command;
  assert.equal(result.acknowledged, false); assert.equal(result.state, 3);
  assert.deepEqual(f.bridge.current().retainedInput.args, { lb: 170.6 });
  assert.deepEqual(f.bridge.current().view, oldView);
  f.repo.close(); const fresh = await f.fresh();
  assert.deepEqual(await fresh.repository.load(), before);
  fresh.repository.close();
});

test("quota after previous write rolls both generation writes back", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
  const before = await f.repo.load(); faults.state.armed = true; faults.state.mode = "quota";
  const result = await f.bridge.execute("weighIn", { lb: 170.6 });
  assert.equal(result.acknowledged, false); assert.equal(result.state, 3);
  assert.deepEqual(await f.repo.load(), before); f.repo.close();
});

test("two independent clients racing one revision retry, preserving both exact operations", async () => {
  const f = await fixture(); await f.seed(); const second = await openRepository(f.setup);
  const staged = deferred(); let count = 0, staleAttempts = 0;
  const stage = async (...args) => { const candidate = f.stage(...args); count++; if (count === 2) staged.resolve(); if (count <= 2) await staged.promise; else staleAttempts++; return candidate; };
  const a = createBridge({ repository: f.repo, stage, validateCommit: () => null }), b = createBridge({ repository: second, stage, validateCommit: () => null });
  const results = await Promise.all([a.execute("weighIn", { lb: 170.6 }), b.execute("weighIn", { lb: 170.7 })]);
  assert.ok(results.every(result => result.acknowledged)); assert.equal(staleAttempts, 1);
  const final = await f.repo.load(), ops = Object.values(final.generation.collections.ops);
  assert.equal(final.revision, 3); assert.deepEqual(ops.map(op => op.device_seq).sort(), [1, 2]);
  assert.deepEqual(ops.map(op => op.payload.lb.value).sort(), [170.6, 170.7]);
  assert.equal(Object.keys(final.generation.collections.outbox).length, 2);
  assert.equal(ops.find(op => op.device_seq === 2).device_predecessor_op_id, "op-dev-A-1");
  f.repo.close(); second.close();
});

test("whole T2 multi-operation session commits atomically with full outbox and sequence", async () => {
  const f = await fixture(); await f.seed();
  const action = { date: "2026-09-04", sets: [{ lift: "synthetic-lift", load: 10, reps: 5 }, { lift: "synthetic-lift", load: 10, reps: 4 }] };
  const result = await f.bridge.execute("logSession", action);
  assert.equal(result.acknowledged, true); assert.equal(result.op_ids.length, 3);
  const durable = (await f.repo.load()).generation.collections;
  assert.equal(Object.keys(durable.ops).length, 3); assert.equal(Object.keys(durable.outbox).length, 3);
  assert.equal(durable.meta.device.seq, 3);
  f.repo.close();
});

test("whole multi-operation session abort consumes no sequence or budget", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
  const before = await f.repo.load(); faults.state.armed = true; faults.state.mode = "quota";
  const result = await f.bridge.execute("logSession", { sets: [{ lift: "synthetic-lift", load: 10, reps: 5 }] });
  assert.equal(result.acknowledged, false); assert.deepEqual(await f.repo.load(), before);
  f.repo.close();
});

test("tampered sealed bytes, wrong binding and unavailable decryption each refuse18", async t => {
  for (const variant of ["ciphertext", "namespace", "key"]) await t.test(variant, async () => {
    const f = await fixture(); await f.seed(); await f.bridge.reopen();
    if (variant === "key") { f.repo.close(); const repo = await openRepository({ ...f.setup, keyProvider: () => null }); await assert.rejects(repo.load(), { state: 18 }); repo.close(); }
    else {
      await mutateActive(f.indexedDB, record => { if (variant === "ciphertext") new Uint8Array(record.ciphertext)[0] ^= 1; else record.namespace = "different-installation"; return record; });
      const state = await f.bridge.reopen(); assert.equal(state.refusal.state, 18); assert.equal(state.view, null); f.repo.close();
    }
  });
});

test("deleted active generation refuses18 and cannot reseed over surviving previous generation", async () => {
  const f = await fixture(); await f.seed(); await f.bridge.execute("weighIn", { lb: 170.6 });
  await mutateActive(f.indexedDB, () => undefined);
  await assert.rejects(f.repo.load(), { state: 18 });
  await assert.rejects(f.repo.initialize(initial(), "synthetic-enrollment-only"), { state: 18, code: "MISSING_ACTIVE_GENERATION" });
  f.repo.close();
});

test("same revision with changed authenticated bytes cannot overwrite a changed head", async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load();
  await mutateActive(f.indexedDB, record => { new Uint8Array(record.ciphertext)[0] ^= 1; return record; });
  await assert.rejects(f.repo.commit(before, before.generation), { state: 18, code: "HEAD_CHANGED_WITHOUT_REVISION" });
  f.repo.close();
});

test("final transaction cut can refuse17 without publishing candidate or spending sequence", async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load();
  const bridge = createBridge({ repository: f.repo, stage: f.stage, validateCommit: () => ({ state: 17, code: "KNOWN_STANDING_LOSS" }) });
  const result = await bridge.execute("weighIn", { lb: 170.6 });
  assert.equal(result.state, 17); assert.equal(result.acknowledged, false);
  assert.deepEqual(await f.repo.load(), before); assert.equal(bridge.current().view, null); f.repo.close();
});

test("caller cannot mutate staged arguments, published view or returned record", async () => {
  const f = await fixture(); await f.seed(); const args = { lb: 170.6 };
  const pending = f.bridge.execute("weighIn", args); args.lb = 999;
  const result = await pending; result.op_ids.push("fake");
  const view = f.bridge.current(); view.view.state = 999;
  assert.notEqual(f.bridge.current().view.state, 999);
  assert.equal(Object.values((await f.repo.load()).generation.collections.ops)[0].payload.lb.value, 170.6);
  f.repo.close();
});

test("non-JSON candidate values cannot silently change on persistence", async () => {
  const f = await fixture(); await f.seed(); const snapshot = await f.repo.load();
  for (const value of [undefined, NaN, new Date(0), [, 1]]) {
    const generation = structuredClone(snapshot.generation); generation.metadata.invalid = value;
    await assert.rejects(f.repo.commit(snapshot, generation), { state: 3, code: "NON_JSON_GENERATION" });
    assert.deepEqual(await f.repo.load(), snapshot);
  }
  f.repo.close();
});

test("reopen is serialized behind a pending local command, never overwrites new view with old", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
  faults.state.armed = true; faults.state.mode = "delay";
  const saved = f.bridge.execute("weighIn", { lb: 170.6 }); await faults.state.write.promise;
  const reopened = f.bridge.reopen(); faults.state.release = true;
  assert.equal((await saved).acknowledged, true);
  assert.deepEqual((await reopened).view, f.bridge.current().view);
  assert.equal(f.bridge.current().view.layer1.reads.length, 1);
  f.repo.close();
});

test("strict durability is requested and an actual durability result is reported", async () => {
  const f = await fixture(); await f.seed();
  const result = await f.bridge.execute("weighIn", { lb: 170.6 });
  assert.equal(result.durability.requested, "strict"); assert.equal(result.durability.actual, "strict");
  f.repo.close();
});

test("caller mutation of expected revision during encryption cannot overwrite a newer acknowledged generation", async () => {
  const f = await fixture(); await f.seed();
  const entered = deferred(), release = deferred();
  const delayed = await openRepository({ ...f.setup, keyProvider: async () => { entered.resolve(); await release.promise; return f.key; } });
  const expected = await f.repo.load();
  const staleGeneration = f.stage(expected.generation, "weighIn", { lb: 170.6 }).generation;
  const staleCommit = delayed.commit(expected, staleGeneration);
  await entered.promise;
  assert.equal((await f.bridge.execute("weighIn", { lb: 170.7 })).acknowledged, true);
  const newer = await f.repo.load(); expected.revision = newer.revision; expected.token = newer.token;
  release.resolve();
  await assert.rejects(staleCommit, { code: "STALE_REVISION", retryable: true });
  assert.deepEqual(await f.repo.load(), newer);
  delayed.close(); f.repo.close();
});

test("noncloneable candidate presentation fails before any durable commit", async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load();
  const bridge = createBridge({ repository: f.repo, validateCommit: () => null, stage: (...args) => {
    const candidate = f.stage(...args); candidate.view.uncloneable = () => {}; return candidate;
  } });
  const result = await bridge.execute("weighIn", { lb: 170.6 });
  assert.equal(result.acknowledged, false); assert.equal(result.state, 3);
  assert.deepEqual(await f.repo.load(), before); f.repo.close();
});

test("initialization race cannot replace the first authorized complete generation", async () => {
  const f = await fixture(), other = await openRepository(f.setup);
  const a = initial(), b = initial(); b.metadata.checkpoint = "second-synthetic";
  const results = await Promise.allSettled([f.repo.initialize(a, "synthetic-enrollment-only"), other.initialize(b, "synthetic-enrollment-only")]);
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(results.find(r => r.status === "rejected").reason.code, "ALREADY_INITIALIZED");
  const stored = await f.repo.load(); assert.equal(stored.revision, 1);
  assert.deepEqual(stored.generation, results[0].status === "fulfilled" ? a : b);
  f.repo.close(); other.close();
});

test("returned T2 integrity18 clears prior truth and retains input without creating an operation", async () => {
  const f = await fixture(); await f.seed(); await f.bridge.execute("weighIn", { lb: 170.6 });
  assert.equal(f.bridge.current().view.paint, "TRUTHFUL");
  const before = await f.repo.load(); const broken = structuredClone(before.generation);
  broken.collections.ops = {};
  await f.repo.commit(before, broken);
  const brokenSnapshot = await f.repo.load();
  const result = await f.bridge.execute("weighIn", { lb: 170.7 });
  assert.equal(result.state, 18); assert.equal(result.acknowledged, false);
  assert.equal(f.bridge.current().view, null);
  assert.deepEqual(f.bridge.current().retainedInput.args, { lb: 170.7 });
  assert.deepEqual(await f.repo.load(), brokenSnapshot);
  f.repo.close();
});

test("authenticated but checkpoint-less generation is never inferred as first use on reopen or write", async () => {
  const f = await fixture(); await f.seed(); const before = await f.repo.load();
  await f.repo.commit(before, { collections: {}, metadata: before.generation.metadata });
  const broken = await f.repo.load();
  const state = await f.bridge.reopen(); assert.equal(state.refusal.state, 18); assert.equal(state.view, null);
  const result = await f.bridge.execute("weighIn", { lb: 170.6 }); assert.equal(result.state, 18);
  assert.deepEqual(await f.repo.load(), broken);
  f.repo.close();
});

test("all seeded collection names survive, including unknown empty collections", async () => {
  const f = await fixture(); const generation = initial(); generation.collections.futureEmpty = {};
  await f.repo.initialize(generation, "synthetic-enrollment-only");
  assert.equal((await f.bridge.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  const durable = (await f.repo.load()).generation;
  assert.ok(Object.hasOwn(durable.collections, "futureEmpty")); assert.deepEqual(durable.collections.futureEmpty, {});
  f.repo.close();
});

test("stage-owned candidate mutation during pending commit cannot change the published result or view", async () => {
  const faults = faultDatabase(), f = await fixture({ indexedDB: faults.indexedDB }); await f.seed();
  let external;
  const bridge = createBridge({ repository: f.repo, validateCommit: () => null, stage: (...args) => { external = f.stage(...args); return external; } });
  faults.state.armed = true; faults.state.mode = "delay";
  const pending = bridge.execute("weighIn", { lb: 170.6 }); await faults.state.write.promise;
  external.view.layer1.reads[0].lb = 999; external.result.op_id = "fake";
  faults.state.release = true;
  const result = await pending;
  assert.equal(result.op_id, "op-dev-A-1"); assert.equal(bridge.current().view.layer1.reads[0].lb, 170.6);
  assert.equal(Object.values((await f.repo.load()).generation.collections.ops)[0].payload.lb.value, 170.6);
  f.repo.close();
});
