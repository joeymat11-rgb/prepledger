"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
// The full engine is only a local oracle. It is never a browser-build dependency.
const { createEngine } = require("../../../engine/index.cjs");
const { createPreviewModel, previewClock, projectState } = require("../model.cjs");
const { createSyntheticState, SYNTHETIC_DAY, dayOffset } = require("../fixtures.cjs");
const plain = (v) => JSON.parse(JSON.stringify(v));

for (const mode of ["native", "frozen"]) {
  test(`actual engine exact projection parity: morning, logged and reset (${mode} Date)`, () => {
    const NativeDate = global.Date;
    if (mode === "frozen") global.Date = class FrozenDate extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [Date.UTC(2030, 1, 4, 8)])); }
      static now() { return Date.UTC(2030, 1, 4, 8); }
    };
    try {
      const actual = createPreviewModel({ engineFactory: createEngine });
      const preview = createPreviewModel();
      assert.deepEqual(preview.read(), actual.read());
      assert.equal(preview.read().nowModel.status.word, "ON COURSE");
      assert.equal(preview.read().hasReadToday, false);
      assert.deepEqual(preview.previewWeighIn(180), actual.previewWeighIn(180));
      assert.equal(preview.read().hasReadToday, true);
      assert.deepEqual(preview.reset(), actual.reset());
      assert.deepEqual(preview.reset("logged"), actual.reset("logged"));
    } finally { global.Date = NativeDate; }
  });
}

test("all exposed reader DTOs exactly match independently projected actual engine", () => {
  const model = createPreviewModel();
  const engine = createEngine({ clock: previewClock(SYNTHETIC_DAY) });
  const expected = plain(projectState(engine, model.getSnapshot()));
  for (const key of Object.keys(expected)) assert.deepEqual(model.read()[key], expected[key], key);
});

test("preview-only morning edit equals actual applyRead for quiet, noise and spike inputs", () => {
  for (const weight of [60, 100, 178.9, 180, 180.3, 180.4, 180.6, 181.9, 250, 400]) {
    const model = createPreviewModel();
    const snapshot = model.getSnapshot();
    const engine = createEngine({ clock: previewClock(SYNTHETIC_DAY) });
    const expected = engine.applyRead(snapshot, SYNTHETIC_DAY, weight, { hour: 8 });
    assert.equal(model.previewWeighIn(weight).ok, true);
    assert.deepEqual(model.getSnapshot(), plain(expected), `weight ${weight}`);
    assert.deepEqual(snapshot, createSyntheticState(), "caller snapshot was not mutated");
  }
});

test("yesterday plan has its own as-of clock and does not change after today's preview entry", () => {
  const model = createPreviewModel();
  const before = model.read();
  assert.equal(before.yesterdayPlan.nowModel.tISO, dayOffset(SYNTHETIC_DAY, -1));
  assert.equal(before.yesterdayPlan.readRecency.days, 0);
  const historical = createSyntheticState();
  historical.trend = 180.5;
  assert.deepEqual(before.yesterdayPlan, plain(projectState(createEngine({ clock: previewClock(before.yesterday) }), historical)));
  model.previewWeighIn(182);
  assert.deepEqual(model.read().yesterdayPlan, before.yesterdayPlan);
});

test("reset and a new page model discard edits without persistence or sync claims", () => {
  const model = createPreviewModel();
  const baseline = model.read();
  const result = model.previewWeighIn(182);
  assert.equal(result.ok, true);
  assert.equal(result.message, "Preview updated — resets on reload");
  assert.equal(model.read().persistence, "memory-only");
  assert.deepEqual(createPreviewModel().read(), baseline);
  assert.deepEqual(model.reset(), baseline);
  assert.equal(model.reset("logged").scenario, "logged");
  assert.throws(() => model.reset("invented"), /Unknown/);
});

test("invalid or duplicate preview inputs leave every state byte unchanged", () => {
  const model = createPreviewModel();
  for (const invalid of [undefined, null, "180", "", NaN, Infinity, -Infinity, 0, -10, 59.9, 400.1, 180.01, {}, []]) {
    const before = JSON.stringify(model.getSnapshot());
    assert.equal(model.previewWeighIn(invalid).ok, false);
    assert.equal(JSON.stringify(model.getSnapshot()), before);
  }
  model.previewWeighIn(180);
  const once = JSON.stringify(model.getSnapshot());
  assert.equal(model.previewWeighIn(181).ok, false);
  assert.equal(JSON.stringify(model.getSnapshot()), once);
});

test("returned views and snapshots cannot mutate the model", () => {
  const model = createPreviewModel();
  const before = model.read();
  model.getSnapshot().reads.length = 0;
  model.read().nowModel.eat.lo = -1;
  model.read().yesterdayPlan.nowModel.eat.hi = -1;
  assert.deepEqual(model.read(), before);
});
