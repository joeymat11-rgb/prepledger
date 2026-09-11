/* A1's adapter tests, moved onto the store of record A2 review B2 requires.
   Every claim A1 made about the weigh-in is re-made here against the REAL durable
   lane — the accepted encrypted repository (AES-GCM over fake-indexeddb, the same
   storage a browser gives the page), the accepted durable public client, the T2
   stage over rebuild/client — instead of localStorage. The claims that used to be
   made against a Web Storage backend are now made against the storage the product
   actually uses, so a passing test means the athlete's reading is really safe.

   This file needs rebuild/m3/w6's own dependencies (fake-indexeddb), exactly as
   package.test.cjs, gym.test.mjs and both browser checks do, and it is .mjs
   because reading-host.mjs is ESM. */

import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { faultDatabase } from "../../../w6/test/support.mjs";
import { createReadingHost, READING_SCHEMA_VERSION, ERA_SCHEMA_VERSION } from "../reading-host.mjs";
import { createGymHost, DATABASE } from "../gym-host.mjs";
import { openLocalKeys, keysDatabaseName } from "../../../w6/local/local-keys.mjs";
import Engine from "../../../../engine/index.cjs";
import TodayModel from "../today-model.cjs";

const { createEngine } = Engine;
const { createTodayModel, createBasisState, engineClockFor, SYNTHETIC_DAY, NO_STORE } = TodayModel;
const DAY = SYNTHETIC_DAY;

/* ONE STORE (C4b). One IndexedDB factory is one device, so a "relaunch" is a new
   host over the same encrypted bytes, exactly as a new page load is. Nothing is
   minted here: the page no longer takes device keys, and the installation's own
   custody (local-keys.mjs) is what these hosts open. */
async function device(options = {}) {
  const fault = options.fault || faultDatabase();
  const day = options.day || DAY;
  async function open() {
    return createReadingHost({ day, indexedDB: fault.indexedDB, crypto: webcrypto });
  }
  const readings = await open();
  return { fault, day, open, readings, model: createTodayModel({ today: day, readings }) };
}
const generationOf = async repository => (await repository.load()).generation;
const opsOf = async repository => Object.values((await generationOf(repository)).collections.ops || {});
const outboxOf = async repository => Object.values((await generationOf(repository)).collections.outbox || {});

test("the composed engine's applyRead is byte-identical to the full engine's", () => {
  const model = createTodayModel({});
  const reference = createEngine({ clock: engineClockFor(DAY) });
  for (const lb of [160, 172.5, 179.4, 180, 191.7, 200.2, 220]) {
    const mine = model.engine.applyRead(createBasisState(DAY), DAY, lb, { hour: 8 });
    const theirs = reference.applyRead(createBasisState(DAY), DAY, lb, { hour: 8 });
    assert.equal(JSON.stringify(mine), JSON.stringify(theirs), String(lb));
  }
});

test("the screen cannot mint an operation id", async () => {
  const kit = await device();
  const result = await kit.model.weighIn(179.4);
  assert.equal(result.ok, true, result.copy);
  const ops = await opsOf(kit.readings.repository);
  assert.equal(ops.length, 1);
  assert.equal(ops[0].op_id, result.op_id, "the id on screen is the id the CLIENT minted");
  /* C4b: the device is this installation's own — minted once at random and kept
     with the local keys — so the id is pinned to THAT device, not to a constant
     the page carried in its source. Stronger than the old shape match. */
  assert.match(kit.readings.deviceId, /^device-[0-9a-f]{32}$/);
  assert.equal(ops[0].op_id, "op-" + kit.readings.deviceId + "-1");
  kit.readings.close();
});

test("a weigh-in is one durable transaction: the operation AND its outbox entry", async () => {
  const kit = await device();
  assert.deepEqual(await opsOf(kit.readings.repository), []);
  const result = await kit.model.weighIn(179.4);
  assert(result.ok, result.copy);
  const ops = await opsOf(kit.readings.repository);
  const outbox = await outboxOf(kit.readings.repository);
  assert.equal(ops.length, 1);
  assert.equal(outbox.length, 1, "the outbox entry co-exists with the operation");
  assert.equal(ops[0].class, "reading");
  assert.equal(ops[0].kind, "fact");
  assert.deepEqual(ops[0].payload.lb, { value: 179.4, unit: "lb" });
  assert.equal(typeof ops[0].canonical_content_commitment, "string");
  assert.equal(ops[0].schema_version, READING_SCHEMA_VERSION);
  kit.readings.close();
});

/* The durability rule, EXECUTED against the real storage: an injected IndexedDB
   fault at the moment of the write leaves neither the operation nor the outbox
   entry, and the screen is told. A1 proved this against a memory backend; this
   proves it against the storage the athlete's phone actually uses. */
test("the durability rule is all-or-nothing, against the real encrypted store", async () => {
  const kit = await device();
  const before = await generationOf(kit.readings.repository);
  kit.fault.state.armed = true;
  kit.fault.state.mode = "quota";
  const result = await kit.model.weighIn(181.2);
  kit.fault.state.armed = false;
  assert.equal(result.ok, false, "a failed write is never reported as saved");
  assert(result.copy && result.copy.length > 0, "it is refused in words");
  const after = await generationOf(kit.readings.repository);
  assert.equal(JSON.stringify(after), JSON.stringify(before), "zero operations, zero outbox entries");
  assert.equal(kit.model.read().hasReadToday, false, "nothing on screen claims a reading");
  // The control: with no injected failure, exactly one of each.
  const clean = await kit.model.weighIn(179.4);
  assert(clean.ok, clean.copy);
  assert.equal((await opsOf(kit.readings.repository)).length, 1);
  assert.equal((await outboxOf(kit.readings.repository)).length, 1);
  kit.readings.close();
});

test("stateFromOps equals the reference engine's own applyRead result", async () => {
  const kit = await device();
  await kit.model.weighIn(178.3);
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const expected = reference.applyRead(createBasisState(DAY), DAY, 178.3, { hour: 8 });
  assert.equal(JSON.stringify(kit.model.stateFromOps()), JSON.stringify(expected));
  kit.readings.close();
});

test("the instruction changes because the ENGINE changed", async () => {
  const kit = await device();
  const before = kit.model.read();
  await kit.model.weighIn(176.2);
  const after = kit.model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 176.2, { hour: 8 });
  assert.equal(after.nowModel.move.title, reference.nowModel(state).move.title);
  assert.notEqual(after.nowModel.headed.weight, before.nowModel.headed.weight);
  kit.readings.close();
});

test("a RELAUNCH over the same encrypted store restores every projection and writes nothing", async () => {
  const kit = await device();
  await kit.model.weighIn(177.6);
  const before = kit.model.read();
  const bytes = JSON.stringify(await generationOf(kit.readings.repository));
  kit.readings.close();

  const readings = await kit.open();
  const model = createTodayModel({ today: kit.day, readings });
  const after = model.read();
  assert.equal(JSON.stringify(after.nowModel), JSON.stringify(before.nowModel));
  assert.equal(after.morningRead.lb, 177.6);
  assert.equal(JSON.stringify(await generationOf(readings.repository)), bytes, "a relaunch writes not one byte");
  readings.close();
});

test("reopen() re-reads the lane from disk without a page reload", async () => {
  const kit = await device();
  await kit.model.weighIn(180.8);
  const view = await kit.model.reopen();
  assert.equal(view.morningRead.lb, 180.8);
  assert.equal(view.message, null, "reopening clears the last message");
  kit.readings.close();
});

test("an invalid value is refused by the CLIENT, in the client's own words", async () => {
  const kit = await device();
  const result = await kit.model.weighIn("");
  assert.equal(result.ok, false);
  assert.match(result.copy, /A weight is required/);
  assert.deepEqual(await opsOf(kit.readings.repository), []);
  kit.readings.close();
});

test("a repeat same-day weigh-in is refused, and the log and the screen never disagree", async () => {
  const kit = await device();
  assert((await kit.model.weighIn(179.4)).ok);
  const before = await opsOf(kit.readings.repository);
  const again = await kit.model.weighIn(181.0);
  assert.equal(again.ok, false);
  assert.equal(again.copy, kit.model.ALREADY_RECORDED);
  assert.deepEqual(await opsOf(kit.readings.repository), before, "no second operation");
  assert.equal(kit.model.read().morningRead.lb, 179.4);
  assert.equal(kit.model.read().unadopted, 0);
  kit.readings.close();
});

/* review F8: the entry FORM bound. The client would accept these; the form does not. */
test("an impossible weight is refused in words and reaches the log nowhere", async () => {
  const kit = await device();
  for (const value of [10000, 0, -5, 59.9, 400.1, 180.01, 1e12]) {
    const result = await kit.model.weighIn(value);
    assert.equal(result.ok, false, String(value));
    assert.equal(result.copy, kit.model.OUT_OF_RANGE, String(value));
    assert.deepEqual(await opsOf(kit.readings.repository), [], String(value));
  }
  // The control: the bound is a FORM bound, and 60 lb is inside it.
  assert((await kit.model.weighIn(60)).ok);
  assert.equal((await opsOf(kit.readings.repository)).length, 1);
  kit.readings.close();
});

/* review F1: the engine's own note on a reading reaches the DTO unreworded. */
test("the engine's note on a reading reaches the DTO verbatim, and is absent when there is none", async () => {
  const spike = await device();
  await spike.model.weighIn(191.7);
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 191.7, { hour: 8 });
  const note = state.reads.at(-1).note;
  assert(note && note.length > 0, "the accepted writer really does attach a note to a spike");
  assert.equal(spike.model.read().morningRead.note, note);
  spike.readings.close();

  const quiet = await device();
  await quiet.model.weighIn(179.4);
  assert.equal(quiet.model.read().morningRead.note, "");
  quiet.readings.close();
});

test("an evicted store refuses rather than reseeding, and paints no number", async () => {
  const kit = await device();
  await kit.model.weighIn(181.9);
  // Delete the active generation under the page, the way clearing site data does.
  await new Promise((resolve, reject) => {
    const open = kit.fault.indexedDB.open(DATABASE, 1);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("generations", "readwrite");
      tx.objectStore("generations").delete("active");
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
    open.onerror = () => reject(open.error);
  });
  kit.readings.close();
  const reopened = await kit.open().catch((error) => error);
  if (reopened instanceof Error) {
    assert.match(String(reopened.code || reopened.message), /STORE_MISSING|MISSING_ACTIVE|INTEGRITY/);
  } else {
    const model = createTodayModel({ today: kit.day, readings: reopened });
    const view = model.read();
    assert.equal(view.blocked, true, "an untrusted local record paints nothing");
    assert.equal(view.morningRead, null);
    reopened.close();
  }
});

test("an empty log produces no morning reading and no invented figure", async () => {
  const kit = await device();
  const view = kit.model.read();
  assert.equal(view.morningRead, null);
  assert.equal(view.hasReadToday, false);
  assert.equal(view.storedReadCount, 0);
  assert(Number.isFinite(view.nowModel.headed.weight), "the plan still comes from the basis");
  kit.readings.close();
});

test("every number in the view DTO is reproduced independently from the engine", async () => {
  const kit = await device();
  await kit.model.weighIn(179.4);
  const view = kit.model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 179.4, { hour: 8 });
  assert.equal(view.calorieTarget.mid, reference.calorieTarget(state).mid);
  assert.equal(view.calorieTarget.lo, reference.calorieTarget(state).lo);
  assert.equal(view.calorieTarget.hi, reference.calorieTarget(state).hi);
  assert.equal(view.proteinTarget.g, reference.proteinTarget(state).g);
  assert.equal(view.nowModel.headed.weight, reference.nowModel(state).headed.weight);
  assert.equal(view.nowModel.move.title, reference.nowModel(state).move.title);
  assert.equal(view.workout.title, reference.nowModel(state).workout.title);
  assert.equal(view.workout.exerciseCount, reference.genSession(state, DAY, null).ex.length);
  kit.readings.close();
});

test("the stored reading is the CLIENT's own projection, not this adapter's parse", async () => {
  const kit = await device();
  await kit.model.weighIn(179.4);
  const face = kit.readings.face();
  assert.equal(face.paint, "TRUTHFUL");
  assert.deepEqual(kit.model.storedReads().map((r) => ({ date: r.date, lb: r.lb })),
    face.layer1.reads.map((r) => ({ date: r.date, lb: r.lb })));
  assert.equal(kit.model.read().saveLabel, face.layer1.label, "the save label is the client's own");
  kit.readings.close();
});

/* REVIEW B2 — the executed reason the reading may NOT go through the workout's
   public client. Unchanged by C4b, and it is the whole reason the one store has
   two write paths rather than one: the PUBLIC client really does refuse a
   schema-1 reading under a schema-2 lease. What changed is the conclusion drawn
   from it — the refusal is the client's, not the store's, so the reading goes
   through rebuild/client's own bridge into the SAME generation. */
test("a weigh-in cannot ride the workout's schema-2 lane: the accepted layer refuses it", async () => {
  const fault = faultDatabase();
  const gym = await createGymHost({ day: DAY, engineState: createBasisState(DAY),
    indexedDB: fault.indexedDB, crypto: webcrypto, plannedSplitSlotId: "slot/" + DAY });
  const before = await opsOf(gym.repository);
  const refused = await gym.host.client.execute("weighIn", { date: DAY, lb: 179.4 });
  assert.equal(refused.acknowledged, false);
  assert.equal(refused.code, "OPERATION_SCHEMA_MISMATCH",
    "rebuild/client stamps a reading schema 1 and the workout lease is schema 2");
  assert.equal(refused.state, 20);
  assert.deepEqual(await opsOf(gym.repository), before, "the refusal stored nothing");
  gym.close();
});

/* C4b — WHAT REPLACED THE TWO LANES. One installation, one repository handle,
   one self-issued era lease, and the weigh-in written into the same generation
   the workout is in. */
test("the two lanes are ONE generation of this device's own local era", async () => {
  const fault = faultDatabase();
  const readings = await createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const gym = await createGymHost({ day: DAY, engineState: createBasisState(DAY),
    indexedDB: fault.indexedDB, crypto: webcrypto, plannedSplitSlotId: "slot/" + DAY });
  assert.equal(readings.databaseName, DATABASE);
  assert.equal(readings.repository, gym.repository, "one repository handle, not two");
  assert.equal(readings.deviceId, gym.deviceId, "one device");
  assert.equal(readings.athleteId, "owner", "one athlete, until Dad's first-run setup names a second");
  // The era's own lease: schema 2, self-issued, and the ONLY one in the store.
  assert.equal(readings.lease.schema_version, ERA_SCHEMA_VERSION);
  assert.equal(readings.lease.schema_version, 2);
  assert.match(readings.lease.lease_id, /^local-era:[0-9a-f]{32}$/);
  assert.equal((await generationOf(gym.repository)).metadata.authorityLease.lease_id, readings.lease.lease_id);
  // Nothing in this page holds a device key record any more.
  assert.equal(readings.device, null);
  assert.equal(readings.deviceKeyCustody, "local-keys.mjs");
  // One weigh-in and one workout Start land in the SAME generation, on ONE lease.
  const model = createTodayModel({ today: DAY, readings });
  assert((await model.weighIn(179.4)).ok);
  const ops = await opsOf(gym.repository);
  assert.equal(ops.length, 1);
  assert.equal(ops[0].class, "reading");
  assert.equal(ops[0].schema_version, READING_SCHEMA_VERSION, "a schema-1 op under a schema-2 lease");
  assert.equal(ops[0].lease_id, readings.lease.lease_id);
  readings.close();
  gym.close();
});

test("with NO encrypted store the plan still renders and a weigh-in records nothing", async () => {
  const model = createTodayModel({});                  // no readings lane at all
  const view = model.read();
  assert.equal(view.durable, false);
  assert.match(view.storageNote, /did not open/);
  assert(Number.isFinite(view.nowModel.headed.weight), "the plan is still the engine's");
  const result = await model.weighIn(179.4);
  assert.equal(result.ok, false);
  assert.equal(result.copy, NO_STORE);
  assert.equal(model.read().hasReadToday, false);
});

/* C4b — the same claim, against the custody that replaced the page's own key
   minting. The page holds no key record at all now (`device: null`), so the
   claim is made where the key actually lives: local-keys.mjs. */
test("the device key store keeps ONE enrolment across relaunches, and the key can never leave", async () => {
  const fault = faultDatabase();
  const readings = await createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  const leaseId = readings.lease.lease_id;
  const deviceId = readings.deviceId;
  readings.close();                                    // the last holder: a real relaunch follows

  const again = await createReadingHost({ day: DAY, indexedDB: fault.indexedDB, crypto: webcrypto });
  assert.equal(again.lease.lease_id, leaseId, "the same era comes back — never a re-enrolment");
  assert.equal(again.deviceId, deviceId, "and the same device identity");
  again.close();

  const keys = await openLocalKeys({ indexedDB: fault.indexedDB, crypto: webcrypto, databaseName: DATABASE });
  assert.equal(await keys.present(), true, keysDatabaseName(DATABASE) + " holds the active key");
  const key = await keys.keyProvider();
  assert.equal(key.extractable, false, "the store key can never leave this device");
  await assert.rejects(() => webcrypto.subtle.exportKey("raw", key));
  keys.close();
});
