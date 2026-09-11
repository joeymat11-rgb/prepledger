"use strict";

/* A1 — the real adapter: a durable local operation log under the accepted engine.
   These tests prove the three things the slice claims and nothing more:
     1. an athlete action becomes a DURABLE OPERATION, and the engine reads THAT
     2. a reload restores it, byte for byte, with no second write
     3. every refusal path changes nothing and fabricates nothing */

const assert = require("node:assert/strict");
const test = require("node:test");
const { createEngine } = require("../../../../engine/index.cjs");
const { createTodayModel, createBasisState, engineClockFor, mintSyntheticLease, SYNTHETIC_DAY } = require("../today-model.cjs");
const { createTodayEngine, createRefusingIds } = require("../today-engine.cjs");
const { createWebStorageBackend, createMemoryStorage } = require("../web-storage-backend.cjs");

const DAY = SYNTHETIC_DAY;
const plain = (v) => JSON.parse(JSON.stringify(v));

test("the composed Today engine is the accepted engine: applyRead is byte-identical", () => {
  const E = createTodayEngine({ clock: engineClockFor(DAY) });
  const reference = createEngine({ clock: engineClockFor(DAY) });
  for (const weight of [60, 150, 178.2, 180, 181.3, 250, 400]) {
    assert.deepEqual(
      plain(E.applyRead(createBasisState(DAY), DAY, weight, { hour: 8 })),
      plain(reference.applyRead(createBasisState(DAY), DAY, weight, { hour: 8 })),
      "applyRead " + weight);
  }
});

test("this screen cannot mint an id: the engine gets a refusing ids provider", () => {
  const E = createTodayEngine({ clock: engineClockFor(DAY) });
  assert.equal(typeof E.applyRead, "function");
  assert.equal(typeof E.nowModel, "function");
  // Reaching for an id is a contained failure, never a fabricated identifier.
  assert.throws(() => createRefusingIds().next(), /TODAY_SCREEN_IDS_UNAVAILABLE/);
  assert.throws(() => createRefusingIds().fresh(), /TODAY_SCREEN_IDS_UNAVAILABLE/);
});

test("a weigh-in becomes a durable operation and the engine reads THAT operation", () => {
  const storage = createMemoryStorage();
  const model = createTodayModel({ storage });
  const before = model.read();
  assert.equal(before.blocked, false);
  assert.equal(before.hasReadToday, false);
  assert.equal(before.morningRead, null);
  assert.equal(before.storedReadCount, 0);

  const result = model.weighIn(181.3);
  assert.equal(result.ok, true);
  assert.match(result.op_id, /^op-/);

  // The operation really is in the log, with a commitment, as a reading fact.
  const backend = createWebStorageBackend(storage);
  const opIds = backend.keys("ops");
  assert.equal(opIds.length, 1);
  const op = backend.get("ops", opIds[0]);
  assert.equal(op.kind, "fact");
  assert.equal(op.class, "reading");
  assert.equal(op.payload.lb.value, 181.3);
  assert.equal(op.payload.lb.unit, "lb");
  assert.equal(op.effective.local_date, DAY);
  assert.match(op.canonical_content_commitment, /^[0-9a-f]{64}$/);
  assert.equal(backend.keys("outbox").length, 1, "the outbox entry is in the SAME transaction");

  // The engine's state is the accepted writer's result over that operation.
  const after = model.read();
  const expected = createEngine({ clock: engineClockFor(DAY) })
    .applyRead(createBasisState(DAY), DAY, 181.3, { hour: 8 });
  assert.deepEqual(plain(model.stateFromOps()), plain(expected));
  assert.equal(after.morningRead.lb, 181.3);
  assert.equal(after.nowModel.headed.weight, expected.trend);
  assert.equal(after.hasReadToday, true);
});

test("the instruction on screen changes because the ENGINE changed, not the adapter", () => {
  const model = createTodayModel({ storage: createMemoryStorage() });
  const before = model.read();
  model.weighIn(181.3);
  const after = model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  assert.equal(before.nowModel.move.title, reference.nowModel(createBasisState(DAY)).move.title);
  assert.equal(after.nowModel.move.title,
    reference.nowModel(reference.applyRead(createBasisState(DAY), DAY, 181.3, { hour: 8 })).move.title);
  assert.notEqual(before.nowModel.move.title, after.nowModel.move.title);
});

test("a reload over the same storage restores the same screen and writes nothing new", () => {
  const storage = createMemoryStorage();
  const first = createTodayModel({ storage });
  first.weighIn(179.8);
  const shown = first.read();
  const keysAfterSave = storage.length;
  const stored = storage.snapshot();

  const reopened = createTodayModel({ storage });
  const restored = reopened.read();
  assert.equal(storage.length, keysAfterSave, "opening the page wrote nothing");
  assert.deepEqual(storage.snapshot(), stored, "opening the page changed no stored byte");

  for (const key of ["nowModel", "calorieTarget", "proteinTarget", "currentRate", "statusFace", "marchingOrder", "workout"]) {
    assert.deepEqual(restored[key], shown[key], key + " survived the reload");
  }
  assert.equal(restored.morningRead.lb, 179.8);
  assert.equal(restored.hasReadToday, true);
  assert.equal(restored.durable, true);
});

test("restart() (the same page, re-booted from storage) restores the same screen", () => {
  const model = createTodayModel({ storage: createMemoryStorage() });
  model.weighIn(180.6);
  const shown = model.read();
  const restored = model.reopen();
  assert.equal(restored.morningRead.lb, 180.6);
  assert.deepEqual(restored.nowModel, shown.nowModel);
});

test("an invalid value is refused, records nothing and leaves the screen unchanged", () => {
  const storage = createMemoryStorage();
  const model = createTodayModel({ storage });
  const before = model.read();
  const beforeStorage = storage.snapshot();
  for (const value of [undefined, null, "180", "", NaN, Infinity, -Infinity, {}, []]) {
    const result = model.weighIn(value);
    assert.equal(result.ok, false, "refused " + String(value));
    assert.equal(result.op_id, null);
    assert(typeof result.copy === "string" && result.copy.length > 0, "the client's own copy is reported");
    assert(!/\d+\.\d/.test(result.copy), "a refusal never carries a weight");
  }
  assert.deepEqual(storage.snapshot(), beforeStorage, "no refused value reached storage");
  const after = model.read();
  assert.equal(after.hasReadToday, false);
  assert.equal(after.morningRead, null);
  assert.deepEqual(after.nowModel, before.nowModel);
  assert.equal(after.storedReadCount, 0);
});

test("a storage failure is refused with the client's copy, records nothing, invents nothing", () => {
  const storage = createMemoryStorage();
  const model = createTodayModel({
    storage,
    backend: (real) => ({ ...real, write(handle, collection, key, value) {
      if (collection === "outbox") throw new Error("disk full");
      return real.write(handle, collection, key, value);
    } }),
  });
  const before = model.read();
  const result = model.weighIn(181.3);
  assert.equal(result.ok, false);
  assert.equal(result.state, 3);
  assert.match(result.copy, /Nothing was recorded/);
  const after = model.read();
  assert.equal(after.hasReadToday, false, "a rolled-back write is not a reading");
  assert.equal(after.morningRead, null);
  assert.deepEqual(after.nowModel, before.nowModel);
  // The whole transaction rolled back: no operation survived either.
  assert.equal(createWebStorageBackend(storage).keys("ops").length, 0);
});

test("an expired lease refuses the write and the screen keeps no number it did not have", () => {
  const storage = createMemoryStorage();
  const lease = mintSyntheticLease(DAY);
  const expired = { ...lease, not_after: "2000-01-01T00:00:00.000Z" };
  const model = createTodayModel({ storage, lease: expired });
  const result = model.weighIn(181.3);
  assert.equal(result.ok, false);
  assert.equal(result.state, 20);
  assert.equal(model.read().hasReadToday, false);
  assert.equal(createWebStorageBackend(storage).keys("ops").length, 0);
});

test("a second weigh-in for the same day is refused rather than stored and ignored", () => {
  const storage = createMemoryStorage();
  const model = createTodayModel({ storage });
  assert.equal(model.weighIn(181.3).ok, true);
  const result = model.weighIn(175);
  assert.equal(result.ok, false);
  assert.match(result.copy, /correction path/);
  assert.equal(createWebStorageBackend(storage).keys("ops").length, 1, "no ignored operation was written");
  const view = model.read();
  assert.equal(view.morningRead.lb, 181.3, "the screen shows the reading the engine used");
  assert.equal(view.unadopted, 0, "the log and the screen agree");
});

test("an evicted store paints no number at all", () => {
  const storage = createMemoryStorage();
  const model = createTodayModel({ storage });
  model.weighIn(181.3);
  // Lose the operations but keep the checkpoint: exactly the state-18 condition.
  createWebStorageBackend(storage).clear("ops");
  const reopened = createTodayModel({ storage });
  const view = reopened.read();
  assert.equal(view.blocked, true);
  assert.equal(view.hasReadToday, false);
  assert.equal(view.morningRead, null);
  assert.equal(view.nowModel, undefined, "no projection is produced from an untrusted record");
  assert.equal(view.restore.step, "RESTORE_REQUIRED");
});

test("no reading is ever invented: an empty log produces no morning reading and no gated claim", () => {
  const model = createTodayModel({ storage: createMemoryStorage() });
  const view = model.read();
  assert.equal(view.storedReadCount, 0);
  assert.equal(view.morningRead, null);
  assert.equal(view.latestRead.date < DAY, true, "the newest reading is basis history, dated before today");
  assert.equal(view.marchingOrder.owed, true);
});

test("every number in the view DTO is reproducible from the engine and the stored operations", () => {
  const storage = createMemoryStorage();
  const model = createTodayModel({ storage });
  model.weighIn(178.9);
  const view = model.read();
  const reference = createEngine({ clock: engineClockFor(DAY) });
  const state = reference.applyRead(createBasisState(DAY), DAY, 178.9, { hour: 8 });
  assert.deepEqual(plain(view.nowModel), plain(reference.nowModel(state)));
  assert.deepEqual(plain(view.calorieTarget), plain(reference.calorieTarget(state)));
  assert.deepEqual(plain(view.proteinTarget), plain(reference.proteinTarget(state)));
  assert.deepEqual(plain(view.currentRate), plain(reference.currentRate(state)));
  assert.deepEqual(plain(view.statusFace), plain(reference.statusFace(state)));
  assert.deepEqual(plain(view.marchingOrder), plain(reference.marchingOrder(state)));
  assert.equal(view.workout.exerciseCount, reference.genSession(state, DAY, null).ex.length);
  assert.equal(view.morningRead.lb, 178.9);
});

test("the web-storage backend is a real all-or-nothing store", () => {
  const storage = createMemoryStorage();
  const backend = createWebStorageBackend(storage, { prefix: "t" });
  const handle = backend.begin();
  backend.write(handle, "ops", "a", { n: 1 });
  backend.write(handle, "ops", "b", { n: 2 });
  assert.deepEqual(backend.keys("ops").sort(), ["a", "b"]);
  backend.rollback(handle);
  assert.deepEqual(backend.keys("ops"), [], "rollback reverted every staged write");
  const second = backend.begin();
  backend.write(second, "ops", "a", { n: 1 });
  backend.commit(second);
  assert.deepEqual(backend.get("ops", "a"), { n: 1 });
  assert.throws(() => backend.write({}, "ops", "c", {}), /outside the open transaction/);
  backend.clear("ops");
  assert.deepEqual(backend.keys("ops"), []);
});

test("storage that denies writes is reported, not silently downgraded", () => {
  const denying = createMemoryStorage();
  denying.setItem = () => { throw new Error("QuotaExceededError"); };
  const model = createTodayModel({ storage: denying });
  const view = model.read();
  assert.equal(view.blocked, false);
  const result = model.weighIn(181.3);
  assert.equal(result.ok, false);
  assert.equal(result.state, 3);
  assert.equal(model.read().hasReadToday, false);
});
