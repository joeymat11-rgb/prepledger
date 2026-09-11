// local-client.test.mjs — the LOCAL-ERA durable client against real (fake-indexeddb)
// IndexedDB. Every fault is injected at the IDB API, outside product code.
import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { webcrypto } from "node:crypto";
import { createRequire } from "node:module";
import { faultDatabase } from "./support.mjs";
import { openRepository } from "../repository.mjs";
import { openLocalDurableClient, COLLECTIONS, DERIVED, opsBasis, sidecarFailure, sidecarStale,
  markerDatabaseName } from "../local/local-client.mjs";
import { openLocalKeys, keysDatabaseName, keysPresent, probeRecord } from "../local/local-keys.mjs";
import { localEraLeaseId, readLocalEra } from "../local/local-era.mjs";
const require = createRequire(import.meta.url);
const Lease = require("../../../client/lease.cjs");

const DB = "earned-local-test", NS = "joe/phone-A", DEVICE = "dev-phone-A", ATHLETE = "ath-1";
const clock = () => ({ now: () => "2026-09-11T08:00:00.000Z", today: () => "2026-09-11", tz: "+00:00", monotonicMs: () => 0 });
const base = (indexedDB, extra = {}) => ({ indexedDB, crypto: webcrypto, databaseName: DB, namespace: NS,
  athleteId: ATHLETE, deviceId: DEVICE, clock: clock(), ...extra });

async function enrolledClient(indexedDB, extra = {}, cleanInit = undefined) {
  const client = await openLocalDurableClient(base(indexedDB, extra));
  const result = await client.enroll(cleanInit);
  assert.equal(result.enrolled, true);
  return { client, era: result };
}
// A raw repository beside the factory, using the SAME device key. Used to read the
// sealed generation and (in one case) to plant a candidate the factory refuses.
async function rawRepository(indexedDB, namespace = NS) {
  const keys = await openLocalKeys({ indexedDB, crypto: webcrypto, databaseName: DB });
  const repository = await openRepository({ indexedDB, crypto: webcrypto, databaseName: DB, namespace,
    keyProvider: keys.keyProvider, authorizeEnrollment: () => false });
  return { repository, close() { repository.close(); keys.close(); } };
}
function eraseRecord(indexedDB, name, store, key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result, tx = db.transaction(store, "readwrite");
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  });
}

test("first run enrolls once, the read survives a whole new factory, and no reseed is possible", async () => {
  const indexedDB = new IDBFactory();
  const first = await openLocalDurableClient(base(indexedDB));
  assert.deepEqual(first.status(), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  assert.equal((await first.boot()).ready, false);
  const enrolled = await first.enroll({ profile: "host-clean-init", s: { v: 1 } });
  assert.equal(enrolled.enrolled, true);
  assert.equal(enrolled.revision, 1);
  assert.equal(enrolled.leaseId, localEraLeaseId(enrolled.eraId));
  assert.deepEqual(first.status(), { state: "ready", code: "LOCAL_ENROLLED" });
  assert.equal((await first.enroll()).enrolled, false);
  const saved = await first.execute("weighIn", { date: "2026-09-11", lb: 170.6 });
  assert.equal(saved.acknowledged, true);
  assert.equal(saved.durableRevision, 2);
  assert.equal(saved.op_id, "op-dev-phone-A-1");
  first.close();
  assert.deepEqual(first.status(), { state: "closed", code: "LOCAL_CLIENT_CLOSED" });

  const second = await openLocalDurableClient(base(indexedDB));
  assert.deepEqual(second.status(), { state: "ready", code: "LOCAL_PRESENT" });
  const booted = await second.boot();
  assert.equal(booted.ready, true);
  assert.equal(booted.revision, 2);
  assert.equal(booted.ops, 1);
  assert.equal(booted.eraId, enrolled.eraId);
  assert.deepEqual(booted.view.layer1.reads, [{ date: "2026-09-11", lb: 170.6, op_id: "op-dev-phone-A-1" }]);
  assert.deepEqual(second.current().view, booted.view);
  // A second installation cannot be created over an existing one.
  const reseed = await second.enroll();
  assert.equal(reseed.enrolled, false);
  assert.equal(reseed.state, 18);
  assert.equal((await second.boot()).revision, 2);
  second.close();
});

test("enroll seals every client collection empty with an intact checkpoint and device record", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolledClient(indexedDB);
  const raw = await rawRepository(indexedDB);
  const seeded = (await raw.repository.load()).generation;
  for (const name of COLLECTIONS) assert.equal(typeof seeded.collections[name], "object", name);
  for (const name of COLLECTIONS.filter(n => n !== "meta")) assert.deepEqual(seeded.collections[name], {}, name);
  assert.deepEqual(seeded.collections.meta.checkpoint, { counts: { ops: 0, outbox: 0 } });
  assert.deepEqual(seeded.collections.meta.device, { device_id: DEVICE, athlete_id: ATHLETE, seq: 0 });
  assert.deepEqual(seeded.collections[DERIVED], { basis: { opCount: 0, lastOpId: null }, value: null });
  assert.equal(seeded.metadata.namespace, NS);
  assert.equal(typeof seeded.metadata.enrolledAt, "string");
  await client.execute("weighIn", { lb: 170.6 });
  const after = (await raw.repository.load()).generation;
  for (const name of [...COLLECTIONS, DERIVED]) assert.equal(typeof after.collections[name], "object", name);
  raw.close(); client.close();
});

test("the self-issued local lease verifies under the unchanged client lease.cjs", async () => {
  const indexedDB = new IDBFactory();
  const { client, era } = await enrolledClient(indexedDB);
  const raw = await rawRepository(indexedDB);
  const sealed = readLocalEra((await raw.repository.load()).generation.metadata);
  const checked = Lease.check(sealed.lease, { authorityKey: sealed.authorityKey, deviceId: DEVICE,
    athleteId: ATHLETE, nowIso: clock().now(), nextSeq: 1 });
  assert.deepEqual({ valid: checked.valid, reason: checked.reason, lease_id: checked.lease_id },
    { valid: true, reason: null, lease_id: localEraLeaseId(era.eraId) });
  assert.equal(Lease.verifySignature(sealed.lease, sealed.authorityKey), true);
  // A real signature, not a rubber stamp: another key does not verify it.
  assert.equal(Lease.verifySignature(sealed.lease, "not-the-local-authority-key"), false);
  assert.equal(Lease.check(sealed.lease, { authorityKey: sealed.authorityKey, deviceId: "dev-other",
    athleteId: ATHLETE, nowIso: clock().now(), nextSeq: 1 }).valid, false);
  assert.equal(sealed.lease.schema_version, 2);
  assert.deepEqual(sealed.lease.range, [1, 2 ** 31 - 1]);
  raw.close(); client.close();
});

test("every stored operation carries lease_id local-era:<eraId> and one atomic session", async () => {
  const indexedDB = new IDBFactory();
  const { client, era } = await enrolledClient(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  const session = await client.execute("logSession", { date: "2026-09-11",
    sets: [{ lift: "squat", load: 200, reps: 5 }, { lift: "squat", load: 200, reps: 4 }] });
  assert.equal(session.acknowledged, true);
  assert.equal(session.op_ids.length, 3);
  assert.equal(session.durableRevision, 3);
  const raw = await rawRepository(indexedDB);
  const durable = (await raw.repository.load()).generation.collections;
  const ops = Object.values(durable.ops);
  assert.equal(ops.length, 4);
  assert.equal(Object.keys(durable.outbox).length, 4);
  assert.deepEqual([...new Set(ops.map(op => op.lease_id))], [localEraLeaseId(era.eraId)]);
  assert.deepEqual(ops.map(op => op.device_seq).sort((a, b) => a - b), [1, 2, 3, 4]);
  assert.equal(durable.meta.device.seq, 4);
  assert.deepEqual(durable.meta.checkpoint.counts, { ops: 4, outbox: 4 });
  raw.close();
  const resumed = await client.resumeAfterKill();
  assert.equal(resumed.line, "Last saved: Set 2 of squat.");
  assert.equal(resumed.ghost, false);
  assert.equal(resumed.rebuiltFrom, 2);
  client.close();
});

test("an unsupported command is refused without touching storage", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolledClient(indexedDB);
  const refused = await client.execute("deleteEverything", {});
  assert.deepEqual({ acknowledged: refused.acknowledged, state: refused.state, code: refused.code },
    { acknowledged: false, state: 3, code: "LOCAL_COMMAND_UNSUPPORTED" });
  assert.equal((await client.boot()).revision, 1);
  client.close();
});

test("kill mid-transaction leaves no ghost, keeps the input and the previous generation exact", async () => {
  const faults = faultDatabase();
  const { client } = await enrolledClient(faults.indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  const beforeView = (await client.boot()).view;
  const raw = await rawRepository(faults.indexedDB);
  const before = await raw.repository.load();
  faults.state.armed = true; faults.state.mode = "delay";
  const command = client.execute("logSet", { lift: "squat", load: 200, reps: 5 });
  await faults.state.write.promise;
  // The write has reached IDB; the transaction is still open. Nothing is Saved.
  assert.deepEqual(client.current().view, beforeView);
  assert.deepEqual(client.current().retainedInput, { command: "logSet", args: { lift: "squat", load: 200, reps: 5 } });
  faults.state.release = true; faults.state.tx.abort();
  const result = await command;
  assert.equal(result.acknowledged, false);
  assert.equal(result.state, 3);
  assert.deepEqual(client.current().view, beforeView);
  assert.deepEqual(client.current().retainedInput.args, { lift: "squat", load: 200, reps: 5 });
  faults.state.armed = false;
  assert.deepEqual(await raw.repository.load(), before);
  raw.close(); client.close();
  const reopened = await openLocalDurableClient(base(faults.indexedDB));
  const after = await reopened.boot();
  assert.equal(after.revision, before.revision);
  assert.deepEqual(after.view, beforeView);
  assert.equal((await reopened.resumeAfterKill()).line, "No sets saved yet.");
  reopened.close();
});

test("a quota abort spends nothing: no revision, no sequence, no outbox entry", async () => {
  const faults = faultDatabase();
  const { client } = await enrolledClient(faults.indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  const raw = await rawRepository(faults.indexedDB);
  const before = await raw.repository.load();
  faults.state.armed = true; faults.state.mode = "quota";
  const result = await client.execute("logSession", { sets: [{ lift: "squat", load: 200, reps: 5 }] });
  assert.equal(result.acknowledged, false);
  assert.equal(result.state, 3);
  faults.state.armed = false;
  assert.deepEqual(await raw.repository.load(), before);
  // The next save still takes sequence 2: the aborted batch consumed nothing.
  assert.equal((await client.execute("weighIn", { lb: 170.7 })).op_id, "op-dev-phone-A-2");
  raw.close(); client.close();
});

test("two independent factories racing one revision preserve both operations", async () => {
  const indexedDB = new IDBFactory();
  const { client: a } = await enrolledClient(indexedDB);
  const b = await openLocalDurableClient(base(indexedDB));
  const results = await Promise.all([a.execute("weighIn", { lb: 170.6 }), b.execute("weighIn", { lb: 170.7 })]);
  assert.ok(results.every(result => result.acknowledged === true));
  const raw = await rawRepository(indexedDB);
  const final = await raw.repository.load();
  assert.equal(final.revision, 3);
  const ops = Object.values(final.generation.collections.ops);
  assert.deepEqual(ops.map(op => op.device_seq).sort((x, y) => x - y), [1, 2]);
  assert.deepEqual(ops.map(op => op.payload.lb.value).sort(), [170.6, 170.7]);
  assert.equal(Object.keys(final.generation.collections.outbox).length, 2);
  assert.equal(ops.find(op => op.device_seq === 2).device_predecessor_op_id, "op-dev-phone-A-1");
  raw.close(); a.close(); b.close();
});

test("partial local erasure is restore-required, never first-run; only total erasure is fresh", async () => {
  const cases = [
    ["generations record", indexedDB => eraseRecord(indexedDB, DB, "generations", "active"), "STORE_MISSING"],
    ["device key", indexedDB => eraseRecord(indexedDB, keysDatabaseName(DB), "keys", "active"), "KEY_MISSING"],
    ["enrollment marker", indexedDB => eraseRecord(indexedDB, markerDatabaseName(DB), "markers", "enrolled"), "ENROLLMENT_MARKER_MISSING"],
  ];
  for (const [label, erase, code] of cases) {
    const indexedDB = new IDBFactory();
    const { client } = await enrolledClient(indexedDB);
    assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
    client.close();
    await erase(indexedDB);
    const reopened = await openLocalDurableClient(base(indexedDB));
    assert.deepEqual(reopened.status(), { state: "restore-required", code }, label);
    assert.equal((await reopened.boot()).ready, false, label);
    assert.equal((await reopened.enroll()).enrolled, false, label);
    assert.equal((await reopened.execute("weighIn", { lb: 171 })).state, 18, label);
    // Exactly one signal was erased: the refusal neither reseeded nor re-keyed.
    const remaining = [await probeRecord({ indexedDB, name: DB, store: "generations", key: "active" }),
      await keysPresent({ indexedDB, databaseName: DB }),
      await probeRecord({ indexedDB, name: markerDatabaseName(DB), store: "markers", key: "enrolled" })];
    assert.deepEqual(remaining.filter(Boolean).length, 2, label);
    reopened.close();
  }
  const indexedDB = new IDBFactory();
  const { client } = await enrolledClient(indexedDB);
  client.close();
  await eraseRecord(indexedDB, DB, "generations", "active");
  await eraseRecord(indexedDB, keysDatabaseName(DB), "keys", "active");
  await eraseRecord(indexedDB, markerDatabaseName(DB), "markers", "enrolled");
  const wiped = await openLocalDurableClient(base(indexedDB));
  assert.deepEqual(wiped.status(), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  assert.equal((await wiped.enroll()).enrolled, true);
  wiped.close();
});

test("a different namespace over the same database is state18, not a fresh install", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolledClient(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();
  const wrong = await openLocalDurableClient(base(indexedDB, { namespace: "joe/phone-B" }));
  assert.deepEqual(wrong.status(), { state: "restore-required", code: "STORED_INTEGRITY_UNPROVEN" });
  const booted = await wrong.boot();
  assert.equal(booted.ready, false);
  assert.equal(booted.state, 18);
  assert.equal((await wrong.enroll()).enrolled, false);
  assert.equal((await wrong.execute("weighIn", { lb: 171 })).state, 18);
  wrong.close();
  const back = await openLocalDurableClient(base(indexedDB));
  assert.equal((await back.boot()).revision, 2);
  back.close();
});

test("the derived sidecar rides the same commit, reports staleness, and a basis ahead of the ops is refused", async () => {
  const indexedDB = new IDBFactory();
  const seen = [];
  const projector = (generation, { command, args, ops }) => {
    assert.equal(typeof generation.collections.ops, "object");
    seen.push({ command, count: Object.keys(ops).length });
    return { profile: "host-derived/v1", command, lb: args?.lb ?? null, ops: Object.keys(ops).length };
  };
  const { client } = await enrolledClient(indexedDB, { projector }, { profile: "host-clean-init" });
  const first = await client.boot();
  assert.deepEqual(first.derived, { profile: "host-clean-init" });
  assert.equal(first.derivedStale, false);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();
  const reopened = await openLocalDurableClient(base(indexedDB, { projector }));
  const booted = await reopened.boot();
  assert.deepEqual(booted.derived, { profile: "host-derived/v1", command: "weighIn", lb: 170.6, ops: 1 });
  assert.equal(booted.derivedStale, false);
  assert.deepEqual(seen, [{ command: "weighIn", count: 1 }]);
  reopened.close();
  // No projector: the cache is CARRIED unchanged, so the next op leaves it stale.
  const plain = await openLocalDurableClient(base(indexedDB));
  assert.equal((await plain.execute("weighIn", { lb: 170.7 })).acknowledged, true);
  const after = await plain.boot();
  assert.deepEqual(after.derived, { profile: "host-derived/v1", command: "weighIn", lb: 170.6, ops: 1 });
  assert.equal(after.derivedStale, true);
  plain.close();

  // Plant a cache claiming operations the generation does not have.
  const raw = await rawRepository(indexedDB);
  const snapshot = await raw.repository.load();
  const tampered = structuredClone(snapshot.generation);
  tampered.collections[DERIVED].basis = { opCount: 99, lastOpId: "op-dev-phone-A-99" };
  const planted = await raw.repository.commit(snapshot, tampered, null);
  const guard = await openLocalDurableClient(base(indexedDB));
  const refused = await guard.execute("weighIn", { lb: 170.8 });
  assert.equal(refused.acknowledged, false);
  assert.equal(refused.state, 3);
  assert.equal(refused.code, "DERIVED_BASIS_AHEAD_OF_OPS");
  const still = await raw.repository.load();
  assert.equal(still.revision, planted.revision);
  assert.equal(Object.keys(still.generation.collections.ops).length, 2);
  guard.close();
  // A projector refreshes the basis, so the same installation saves again.
  const fixed = await openLocalDurableClient(base(indexedDB, { projector }));
  assert.equal((await fixed.execute("weighIn", { lb: 170.9 })).acknowledged, true);
  assert.equal((await fixed.boot()).derivedStale, false);
  fixed.close(); raw.close();
});

test("sidecar helpers: malformed and ahead-of-ops refusals, behind-ops staleness", () => {
  const basis = { opCount: 2, lastOpId: "op-2", opIds: ["op-1", "op-2"] };
  assert.equal(sidecarFailure({ basis: { opCount: 2, lastOpId: "op-2" }, value: null }, basis), null);
  assert.equal(sidecarFailure({ basis: { opCount: 1, lastOpId: "op-1" }, value: null }, basis), null);
  assert.equal(sidecarFailure({ basis: { opCount: 3, lastOpId: "op-2" }, value: null }, basis).code, "DERIVED_BASIS_AHEAD_OF_OPS");
  assert.equal(sidecarFailure({ basis: { opCount: 2, lastOpId: "op-9" }, value: null }, basis).code, "DERIVED_BASIS_AHEAD_OF_OPS");
  assert.equal(sidecarFailure({ basis: { opCount: 2, lastOpId: "op-2" } }, basis).code, "DERIVED_SIDECAR_MALFORMED");
  assert.equal(sidecarFailure({ value: null }, basis).code, "DERIVED_SIDECAR_MALFORMED");
  assert.equal(sidecarFailure(null, basis).code, "DERIVED_SIDECAR_MALFORMED");
  assert.equal(sidecarStale({ basis: { opCount: 2, lastOpId: "op-2" }, value: null }, basis), false);
  assert.equal(sidecarStale({ basis: { opCount: 1, lastOpId: "op-1" }, value: null }, basis), true);
  assert.equal(sidecarStale(undefined, basis), true);
  assert.deepEqual(opsBasis({ collections: { ops: { "op-b": { device_seq: 2 }, "op-a": { device_seq: 1 } } } }),
    { opCount: 2, lastOpId: "op-b", opIds: ["op-a", "op-b"] });
});

test("presence probing works without indexedDB.databases() and creates nothing it asks about", async () => {
  const inner = new IDBFactory();
  const indexedDB = { open: (...args) => inner.open(...args) };
  const client = await openLocalDurableClient(base(indexedDB));
  assert.deepEqual(client.status(), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  // The marker database was probed and NOT brought into existence.
  assert.equal((await inner.databases()).some(entry => entry.name === markerDatabaseName(DB)), false);
  assert.equal((await client.enroll()).enrolled, true);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();
  const reopened = await openLocalDurableClient(base(indexedDB));
  assert.deepEqual(reopened.status(), { state: "ready", code: "LOCAL_PRESENT" });
  assert.equal((await reopened.boot()).revision, 2);
  reopened.close();
});

test("no era key material reaches anything the factory returns", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolledClient(indexedDB);
  const raw = await rawRepository(indexedDB);
  const era = readLocalEra((await raw.repository.load()).generation.metadata);
  raw.close();
  const booted = await client.boot();
  const saved = await client.execute("weighIn", { lb: 170.6 });
  const surface = JSON.stringify([client.status(), booted, saved, client.current(), await client.resumeAfterKill()]);
  assert.equal(surface.includes(era.identityKey), false);
  assert.equal(surface.includes(era.authorityKey), false);
  assert.equal(surface.includes(era.lease.signature), false);
  assert.equal(surface.includes(era.eraId), true);
  client.close();
});
