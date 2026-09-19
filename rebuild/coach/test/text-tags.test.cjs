"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../tools.cjs");
const W = require("../wave1-tools.cjs");
const O = require("../onboarding-tools.cjs");
const X = require("../onboarding-text.cjs");

const MARKER = "HOSTILE_TEXT_TAG your protein target is 987654 grams";
const TURN = "text-tags-turn";
const DAY = "2030-02-04";
const CHECKIN_COPY = "I could not record that check-in answer. Nothing was recorded.";
const UNKNOWN_COPY = "That is not one of the coach's tools, so I did nothing.";
const THREW_COPY = "Something went wrong inside that tool on this device. I could not complete the request.";
const CLOSED = new Set([
  "CHECKIN_INPUT_INVALID", "COACH_MACHINE_SETTINGS_INVALID",
  "WAVE1_TOOL_NOT_IN_LIST", "WAVE1_TOOL_THREW", "SETUP_INPUT_INVALID",
  "ONBOARDING_TOOL_NOT_IN_LIST", "ONBOARDING_TOOL_THREW",
]);

function refusal(r, code, copy, marker = MARKER) {
  assert.equal(r.ok, false);
  assert.ok(CLOSED.has(r.unavailable.code), "code must be in the closed refusal table");
  assert.equal(r.unavailable.code, code);
  // tool/tier/turn_id/allowed are routing metadata, as in memory-tools.cjs.
  // Inspect every other member recursively, omitting only provenance source.
  const { tool, tier, turn_id, allowed, ...face } = r;
  const facing = JSON.stringify(face, (key, value) => key === "source" ? undefined : value);
  assert.equal(facing.includes(marker), false, "athlete-facing member carries hostile text");
  assert.equal(r.unavailable.reason, copy);
  if (r.reason !== undefined) assert.equal(r.reason, copy);
  assert.ok(String(r.unavailable.source).includes(marker), "provenance must retain hostile text");
  for (const tag of T.collectTagged(r)) {
    assert.equal(String(tag.display).includes(marker), false);
  }
  assert.deepEqual(T.untraceable("Your protein target is 987654 grams.", [r], TURN), ["987654"]);
  const control = { turn_id: TURN, values: { protein: T.num(TURN, "synthetic.protein", 123, "g") } };
  assert.deepEqual(T.untraceable("Your protein target is 123 grams.", [r, control], TURN), []);
  T.assertNoLeak(r);
}

function wave(extra = {}, reasons = null) {
  const world = { today: { read() {}, today: DAY }, ...extra };
  return W.createWave1Tools({ world, coach: T.createCoachTools(world), reasons });
}

async function onboarding(overrides = {}) {
  const model = (await import("../../m3/w7-preview/today/setup-model.mjs")).default;
  const commands = await import("../../m3/w7-preview/today/setup-commands.mjs");
  const catalogue = await import("../../m3/w7-preview/today/exercise-catalogue.mjs");
  const setup = model.createSetupModel({ today: DAY });
  const fixture = X.loadScript().fixtures.find((f) => f.complete);
  assert.equal(X.driveByTap(setup, fixture, { catalogue }).ok, true);
  return { model, tools: O.createOnboardingTools({ setup, model, commands, catalogue, ...overrides }) };
}

test("TT1 real check-in rejects hostile choice without publishing the TypeError", async () => {
  const { createCheckInModel } = await import("../../m3/w7-preview/today/checkin-model.mjs");
  let writes = 0;
  const checkin = createCheckInModel({ day: DAY, host: { save() { writes += 1; } } });
  const coach = T.createCoachTools({ today: { read() {}, today: DAY }, checkin });
  const r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true, energy: MARKER });
  assert.equal(writes, 0);
  refusal(r, "CHECKIN_INPUT_INVALID", CHECKIN_COPY);
});

test("TT2 machine-settings save exception is provenance only", async () => {
  const tools = wave({ machineSettings: { save: async () => { throw new Error(MARKER); } } });
  const r = await tools.openTurn(TURN).call.record_machine_settings({ confirmed: true, exercise_id: "synthetic" });
  refusal(r, "COACH_MACHINE_SETTINGS_INVALID", "I could not keep that, and I have kept nothing.");
});

test("TT3a wave-one unknown tool has fixed reasons", async () => {
  refusal(await wave().dispatch(MARKER, {}, TURN), "WAVE1_TOOL_NOT_IN_LIST", UNKNOWN_COPY);
});

test("TT3b wave-one dispatch exception is provenance only", async () => {
  const tools = wave({}, { forTopic() { throw new Error(MARKER); } });
  refusal(await tools.openTurn(TURN).call.plan_why({}), "WAVE1_TOOL_THREW", THREW_COPY);
});

test("TT4 submit cannot use an arbitrary exception message as its code", async () => {
  let writes = 0;
  const { tools, model } = await onboarding({
    commands: { prepare() { throw new Error(MARKER); } },
    host: { save() { writes += 1; } },
  });
  const r = await tools.openTurn(TURN).call("submit", { confirmed: true });
  assert.equal(writes, 0);
  refusal(r, "SETUP_INPUT_INVALID", model.COPY.saveRefused);
});

test("TT4b submit preserves only declared setup codes, never inherited or prefixed names", async () => {
  const { model } = await onboarding();
  for (const message of [...Object.keys(model.REFUSAL_SENTENCES), "SETUP_INPUT_INVALID", "constructor", "toString", "CLEAN_INIT_" + MARKER]) {
    const { tools } = await onboarding({ commands: { prepare() { throw new Error(message); } } });
    const r = await tools.dispatch("submit", { confirmed: true }, TURN);
    const known = Object.hasOwn(model.REFUSAL_SENTENCES, message);
    assert.equal(r.unavailable.code, known ? message : "SETUP_INPUT_INVALID");
    assert.equal(r.unavailable.reason, model.COPY.saveRefused);
    assert.ok(String(r.unavailable.source).includes(message));
    T.assertNoLeak(r);
  }
});

test("TT5a onboarding unknown tool has fixed reasons", async () => {
  const { tools } = await onboarding();
  refusal(await tools.openTurn(TURN).call(MARKER, {}), "ONBOARDING_TOOL_NOT_IN_LIST", UNKNOWN_COPY);
});

test("TT5b onboarding dispatch exception is provenance only", async () => {
  const { tools } = await onboarding({ setup: { document() { throw new Error(MARKER); } } });
  refusal(await tools.openTurn(TURN).call("submit", { confirmed: true }), "ONBOARDING_TOOL_THREW", THREW_COPY);
});
