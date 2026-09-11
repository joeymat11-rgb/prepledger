// local-witnesses.test.mjs — the Node-only half of the C3 matrix: the clock rows
// and the three RED WITNESSES, against fake-indexeddb, so the W6 suite carries
// them with no browser.
//
// WHY THIS EXISTS BESIDE local-witnesses.mjs. That runner needs a real browser
// and launches nineteen contexts; `.github/workflows/rebuild.yml` runs no W6 test
// at all (C1-REPORT "CI RELEVANCE"), so `--test rebuild/m3/w6/test/*.test.mjs` is
// the only thing anybody runs by habit. These cases are what keeps the browser
// matrix's claims from rotting between hand runs.
//
// A test that asserts a RED WITNESS is not blessing it. The C1/C11 ruling of
// 2026-09-05 is "bounded": the phone keeps writing after an unproven restart, and
// the exposure that buys is written down rather than fixed. These cases pin the
// exposure at exactly the size it was ruled to be, so a later change that makes
// it bigger — or that quietly claims to have fixed it — fails here.
import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { webcrypto } from "node:crypto";
import { openRepository } from "../repository.mjs";
import { openLocalDurableClient } from "../local/local-client.mjs";
import { openLocalKeys } from "../local/local-keys.mjs";
import { readLocalEra, LOCAL_ERA_DAYS } from "../local/local-era.mjs";

const DB = "earned-local-witness", NS = "joe/phone-A", DEVICE = "dev-phone-A", ATHLETE = "ath-1";
const ENROLLED_AT = "2026-09-11T08:00:00.000Z", DAY_MS = 86_400_000;
const SEQ_CEILING = 2 ** 31 - 1;
const dayIso = days => new Date(Date.parse(ENROLLED_AT) + days * DAY_MS).toISOString();
const clockAt = (days = 0) => ({ now: () => dayIso(days), today: () => dayIso(days).slice(0, 10),
  tz: "+00:00", monotonicMs: () => 0 });
const open = (indexedDB, days = 0) => openLocalDurableClient({ indexedDB, crypto: webcrypto, databaseName: DB,
  namespace: NS, athleteId: ATHLETE, deviceId: DEVICE, clock: clockAt(days) });

async function enrolled(indexedDB) {
  const client = await open(indexedDB);
  const era = await client.enroll({ profile: "host-clean-init" });
  assert.equal(era.enrolled, true);
  return { client, era };
}
// A raw repository beside the factory, on the SAME device key: this is how the
// sealed metadata is read without asking the client what it wants to say.
async function rawRepository(indexedDB) {
  const keys = await openLocalKeys({ indexedDB, crypto: webcrypto, databaseName: DB });
  const repository = await openRepository({ indexedDB, crypto: webcrypto, databaseName: DB, namespace: NS,
    keyProvider: keys.keyProvider, authorizeEnrollment: () => false });
  return { repository, close() { repository.close(); keys.close(); } };
}
// The sealed generation record as stored — the bytes a whole-device backup moves.
function generationsStore(indexedDB, mode, body) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      let tx, inner;
      try { tx = db.transaction("generations", mode); inner = body(tx.objectStore("generations")); }
      catch (error) { db.close(); reject(error); return; }
      tx.oncomplete = () => { db.close(); resolve(inner?.result); };
      tx.onabort = () => { db.close(); reject(tx.error); };
      tx.onerror = () => {};
    };
  });
}
const readActive = indexedDB => generationsStore(indexedDB, "readonly", store => store.get("active"));
const writeActive = (indexedDB, value) => generationsStore(indexedDB, "readwrite", store => store.put(value, "active"));
const drop = (indexedDB, name) => new Promise(resolve => {
  const request = indexedDB.deleteDatabase(name);
  request.onsuccess = request.onerror = request.onblocked = () => resolve();
});

test("the C3 clock rows without a browser: a day's gap, renewal at 201, past the cliff at 402, the lapse at 401", async () => {
  const indexedDB = new IDBFactory();
  const { client, era } = await enrolled(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();

  // A day's gap: the phone was shut, the date moved, nothing else happened.
  const tomorrow = await open(indexedDB, 1);
  const day1 = await tomorrow.boot();
  assert.equal(day1.ready, true);
  assert.equal(day1.revision, 2);
  assert.deepEqual(day1.view.layer1.reads.map(read => read.lb), [170.6]);
  assert.equal((await tomorrow.execute("weighIn", { lb: 170.4 })).op_id, "op-dev-phone-A-2");
  tomorrow.close();

  // Day 201: opening the app is what keeps writing alive.
  const renewing = await open(indexedDB, 201);
  const renewed = await renewing.boot();
  assert.equal(renewed.ready, true);
  assert.equal(renewed.leaseRenewalCode, null);
  assert.equal(renewed.leaseId, era.leaseId);
  assert.ok(Date.parse(renewed.leaseRenewedUntil) > Date.parse(era.notAfter));
  renewing.close();

  // Day 402, past the original cliff, because day 201 happened.
  const past = await open(indexedDB, LOCAL_ERA_DAYS + 2);
  assert.equal((await past.boot()).ready, true);
  assert.equal((await past.execute("weighIn", { lb: 170.2 })).acknowledged, true);
  past.close();

  // A DIFFERENT installation, never opened in between: 401 days is the cliff.
  const untouched = new IDBFactory();
  const cold = (await enrolled(untouched)).client;
  assert.equal((await cold.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  cold.close();
  const lapsed = await open(untouched, LOCAL_ERA_DAYS + 1);
  assert.deepEqual(lapsed.status(), { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" });
  const view = await lapsed.boot();
  assert.equal(view.ready, false);
  assert.equal(view.readable, true);
  assert.equal(view.leaseExpired, true);
  assert.equal(view.state, 20);
  assert.equal(view.revision, 2);
  assert.deepEqual(view.view.layer1.reads.map(read => read.lb), [170.6]);
  const refused = await lapsed.execute("weighIn", { lb: 169.9 });
  assert.equal(refused.acknowledged, false);
  assert.equal(refused.state, 20);
  assert.equal(refused.code, "LOCAL_LEASE_EXPIRED");
  assert.equal((await lapsed.boot()).revision, 2);
  lapsed.close();
});

// RED WITNESS 1 (SCORECARD-W3: "wall rollback reopens expiry",
// client/index.cjs:112, lease.cjs:24). BRIEF-W6 §1 "Observed elapsed" would have a
// hosted era invalidate its restart allowance on a detected rollback. The local
// era has no checkpoint C, no W_last and no authority to reconcile with, so there
// is nothing to detect the rollback against. This is the accepted residual, and
// this case pins its size: writing comes back, and the era on disk is untouched.
test("RED WITNESS 1 — rolling the wall clock back reopens a lapsed era", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolled(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();

  const lapsed = await open(indexedDB, LOCAL_ERA_DAYS + 1);
  assert.deepEqual(lapsed.status(), { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" });
  assert.equal((await lapsed.execute("weighIn", { lb: 169.9 })).state, 20);
  lapsed.close();

  const rolled = await open(indexedDB, 0);
  assert.deepEqual(rolled.status(), { state: "ready", code: "LOCAL_PRESENT" });
  const booted = await rolled.boot();
  assert.equal(booted.ready, true);
  assert.equal(booted.leaseExpired, false);
  // Nothing was renewed and nothing was repaired: the same sealed lease simply
  // reads as valid again against a clock that moved backwards.
  assert.equal(booted.leaseRenewedUntil, null);
  const wrote = await rolled.execute("weighIn", { lb: 169.8 });
  assert.equal(wrote.acknowledged, true);
  assert.equal(wrote.op_id, "op-dev-phone-A-2");
  rolled.close();
});

// RED WITNESS 2 ("restored continuity flag ignored"). There is no continuity flag
// to ignore: C1 persists no boot identity, no wall high-water and no slot counter,
// because BRIEF-W6's checkpoint C is only issued by an authenticated reconciled
// exchange and the local era never has one. A restart is therefore invisible, in
// both directions — the client cannot distrust it and cannot trust it either.
test("RED WITNESS 2 — a restart leaves no continuity flag anywhere on disk", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolled(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();

  const next = await open(indexedDB, 0);
  const booted = await next.boot();
  assert.equal(booted.ready, true);
  assert.deepEqual(Object.keys(booted).filter(key =>
    /continu|checkpoint|highwater|high_water|w_?last|restart|uptime|reboot/i.test(key)), []);
  next.close();

  const raw = await rawRepository(indexedDB);
  const metadata = (await raw.repository.load()).generation.metadata;
  assert.deepEqual(Object.keys(metadata).sort(), ["enrolledAt", "localEra", "namespace", "profile"]);
  assert.deepEqual(Object.keys(metadata.localEra).sort(),
    ["authorityKey", "enrolledAt", "eraId", "identityKey", "lease", "profile"]);
  raw.close();
});

// RED WITNESS 3 ("whole local erasure becomes fresh"). C1 case 9 proves each
// PARTIAL erasure stays restore-required. This is the other end: when all three
// signals go at once the installation is not damaged, it is ABSENT, and absent is
// what a new phone looks like. The app cannot warn about a history it has no
// evidence ever existed, and inventing one would be worse.
test("RED WITNESS 3 — whole local erasure is the same observation as a first run", async () => {
  const indexedDB = new IDBFactory();
  const { client, era } = await enrolled(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();

  await drop(indexedDB, DB);
  await drop(indexedDB, `${DB}-keys`);
  await drop(indexedDB, `${DB}-local`);

  const wiped = await open(indexedDB, 0);
  const virgin = await open(new IDBFactory(), 0);
  assert.deepEqual(wiped.status(), { state: "first-run", code: "LOCAL_FIRST_RUN" });
  assert.deepEqual(wiped.status(), virgin.status());
  assert.equal((await wiped.boot()).ready, false);
  assert.equal((await virgin.boot()).ready, false);

  // It enrolls, because nothing survives to say it should not — and it is a NEW
  // era: the old one went with the data it authorised.
  const reborn = await wiped.enroll({ profile: "host-clean-init" });
  assert.equal(reborn.enrolled, true);
  assert.equal(reborn.revision, 1);
  assert.notEqual(reborn.eraId, era.eraId);
  assert.equal((await wiped.boot()).ops, 0);
  wiped.close(); virgin.close();
});

// RED WITNESS 4 ("coherent old restore reuses a slot"; BRIEF-W6 W6-RESTORE-BOUND,
// "T3 rejects IDENTITY_COLLISION"). The restore below is byte-for-byte the record
// a whole-device backup holds, put back with the device key untouched, so
// everything verifies and nothing is corrupt. That is exactly what makes it
// undetectable offline.
test("RED WITNESS 4 — a coherent old restore replays a sequence slot already spent", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolled(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).op_id, "op-dev-phone-A-1");
  client.close();
  const backup = structuredClone(await readActive(indexedDB));

  const later = await open(indexedDB, 0);
  assert.equal((await later.execute("weighIn", { lb: 171.1 })).op_id, "op-dev-phone-A-2");
  assert.equal((await later.execute("weighIn", { lb: 171.2 })).op_id, "op-dev-phone-A-3");
  later.close();

  await writeActive(indexedDB, backup);
  const restored = await open(indexedDB, 0);
  assert.deepEqual(restored.status(), { state: "ready", code: "LOCAL_PRESENT" });
  const booted = await restored.boot();
  assert.equal(booted.ready, true);
  assert.equal(booted.revision, 2);
  assert.equal(booted.ops, 1);
  assert.deepEqual(booted.view.layer1.reads.map(read => read.lb), [170.6]);
  // 171.2 lb is simply gone, and op-dev-phone-A-2 is issued a second time for a
  // different reading. Offline there is nothing to compare it against.
  const collision = await restored.execute("weighIn", { lb: 177.7 });
  assert.equal(collision.acknowledged, true);
  assert.equal(collision.op_id, "op-dev-phone-A-2");
  assert.deepEqual((await restored.boot()).view.layer1.reads.map(read => read.lb), [170.6, 177.7]);
  restored.close();
});

// WITNESS 5 ("exhaustion face disagrees with refusal") has two halves. The EXPIRY
// half is reachable and is proved by local-client.test.mjs case 21 and by the
// browser matrix's W-FACE-DISAGREES. The EXHAUSTION half is unreachable here by
// construction, and that is worth pinning rather than assuming: the local era
// issues itself an unbounded range and implements no 24 h / 64-slot allowance,
// because DECISIONS:24 bounds offline writes relative to the last RECONCILED
// connection and there is no authority to have reconciled with. If a slot budget
// ever arrives, this case fails and someone has to prove the face agrees with it.
test("WITNESS 5's exhaustion half is unreachable: an unbounded range and no slot budget", async () => {
  const indexedDB = new IDBFactory();
  const { client } = await enrolled(indexedDB);
  assert.equal((await client.execute("weighIn", { lb: 170.6 })).acknowledged, true);
  client.close();

  const raw = await rawRepository(indexedDB);
  const generation = (await raw.repository.load()).generation;
  const era = readLocalEra(generation.metadata);
  assert.deepEqual(era.lease.range, [1, SEQ_CEILING]);
  assert.deepEqual(Object.keys(era.lease).sort(),
    ["athlete_id", "device_id", "lease_id", "not_after", "not_before", "range", "schema_version", "signature"]);
  // No counter anywhere claims an allowance: the checkpoint records counts of what
  // exists, never a budget of what is still permitted.
  assert.deepEqual(Object.keys(generation.collections.meta.checkpoint).sort(), ["counts"]);
  assert.deepEqual(Object.keys(generation.collections.meta.checkpoint.counts).sort(), ["ops", "outbox"]);
  assert.deepEqual(generation.collections.sync, {});
  raw.close();
});
