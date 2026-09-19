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
const UNKNOWN_COPY = "I cannot use that tool here, so I did nothing.";
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

// Review R1: cells added before changing product. All fixtures are synthetic.
const C = require("../coach-text.cjs");
const Y = require("../wave1-text.cjs");
const M = require("../memory-tools.cjs");
const NEUTRAL = "I cannot use that tool here, so I did nothing.";
const SAVE_COPY = "I could not record that check-in answer. Nothing was recorded.";
const SET_COPY = "Tell me the weight and the reps you actually did.";
const ASK_COPY = "Nothing is recorded yet. Say yes to confirm the weight and reps.";
const shapes = {
  symbol: () => Symbol("probe"),
  nullPrototype: () => Object.create(null),
  throwingString: () => ({ toString() { throw new Error("nope"); } }),
};
async function checkinWorld(host = { save() { return { ok: true, op_id: "synthetic" }; }, forDate() { return []; } }, engineState) {
  const model = await import("../../m3/w7-preview/today/checkin-model.mjs");
  const checkin = model.createCheckInModel({ day: DAY, host, engineState });
  const coach = T.createCoachTools({ today: { read() {}, today: DAY }, checkin });
  return { model, checkin, coach };
}
for (const [shape, make] of Object.entries(shapes)) {
  for (const site of ["waveCatch", "onboardingCatch", "checkinCatch", "submitCatch", "waveName", "onboardingName"]) {
    test("R1 B1 " + site + " returns a closed refusal for " + shape, async () => {
      const value = make();
      let r, code;
      if (site === "waveCatch") {
        r = await wave({}, { forTopic() { throw { message: value }; } }).dispatch("plan_why", {}, TURN);
        code = "WAVE1_TOOL_THREW";
      } else if (site === "onboardingCatch") {
        const { tools } = await onboarding({ setup: { document() { throw { message: value }; } } });
        r = await tools.dispatch("submit", { confirmed: true }, TURN);
        code = "ONBOARDING_TOOL_THREW";
      } else if (site === "checkinCatch") {
        const { checkin, coach } = await checkinWorld();
        checkin.draft().choose = () => { throw { message: value }; };
        r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true, energy: "Good" });
        code = "CHECKIN_INPUT_INVALID";
      } else if (site === "submitCatch") {
        const { tools } = await onboarding({ commands: { prepare() { throw { message: value }; } } });
        r = await tools.dispatch("submit", { confirmed: true }, TURN);
        code = "SETUP_INPUT_INVALID";
      } else {
        const tools = site === "waveName" ? wave() : (await onboarding()).tools;
        r = await tools.dispatch(value, {}, TURN);
        code = site === "waveName" ? "WAVE1_TOOL_NOT_IN_LIST" : "ONBOARDING_TOOL_NOT_IN_LIST";
      }
      assert.equal(r.ok, false);
      assert.ok(CLOSED.has(r.unavailable.code));
      assert.equal(r.unavailable.code, code);
      assert.equal(typeof r.unavailable.source, "string");
      assert.match(r.unavailable.source, /\.cjs|\.mjs/);
      assert.ok(r.unavailable.source.includes(shape === "symbol" ? "Symbol(probe)" : "(unprintable)"));
    });
  }
}

test("R1 B2 refused mixed answer restores draft and cannot cross turns", async () => {
  const writes = [];
  const { checkin, coach } = await checkinWorld({ save(a) { writes.push(a); return { ok: true, op_id: "synthetic" }; }, forDate() { return []; } });
  const before = checkin.draft().state();
  const r = await coach.openTurn("first").call.answer_checkin({ confirmed: true, sleep_quality: "Good", energy: "NOT_A_LABEL" });
  const after = checkin.draft().state();
  assert.equal(r.ok, false);
  assert.equal(writes.length, 0);
  await coach.openTurn("second").call.answer_checkin({ confirmed: true, stress: "Low" });
  assert.deepEqual(writes, [{ stress: "Low" }]);
  assert.deepEqual(after, before);
});

test("R1 B2 rollback restores cleared details and sleep confirmation", async () => {
  for (const which of ["soreness", "away", "sleep"]) {
    const { checkin, coach } = await checkinWorld(undefined, { sleep: { nights: [{ d: "2030-02-03", h: 7 }] } });
    const draft = checkin.draft();
    draft.choose("soreness", "Mild"); draft.set("soreness_location", "legs");
    draft.toggleIssue("away"); draft.set("away_days", "3"); draft.set("away_reason", "travel");
    draft.confirmSleep();
    const before = draft.state();
    const bad = { toString() { throw new Error("probe"); } };
    const turn = coach.openTurn(TURN);
    const r = which === "soreness"
      ? await turn.call.answer_checkin({ confirmed: true, soreness: "None", stress: "INVALID" })
      : which === "away" ? await turn.call.time_away({ confirmed: true, days: bad })
      : await turn.call.answer_checkin({ confirmed: true, sleep_hours: bad });
    assert.equal(r.ok, false);
    assert.deepEqual(draft.state(), before, which);
  }
});

test("R1 B4 real save exception is provenance only and licenses no digits", async () => {
  const marker = "ZQPROBE" + String.fromCharCode(0x2014) + "777333";
  const { coach } = await checkinWorld({ save() { throw new Error(marker); }, forDate() { return []; } });
  const r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true, stress: "Low" });
  const face = JSON.stringify(r, (key, value) => key === "source" ? undefined : value);
  for (const part of ["ZQPROBE", "777333", String.fromCharCode(0x2014)]) assert.equal(face.includes(part), false);
  assert.equal(r.unavailable.code, "CHECKIN_NOT_RECORDED");
  assert.equal(r.unavailable.reason, SAVE_COPY);
  assert.ok(r.unavailable.source.includes(marker));
  assert.deepEqual(T.untraceable("It was 777333.", [r], TURN), ["777333"]);
});

// save() has NO declared refusal codes: all six fixed copies return code absent.
for (const name of ["ALREADY_RECORDED", "NOTHING_ANSWERED", "NO_STORE", "HOURS_OUT_OF_RANGE", "DAYS_INVALID", "SAVE_REFUSED"]) {
  test("R1 B4 accepted save copy stays byte-identical: " + name, async () => {
    const { model, checkin, coach } = await checkinWorld(name === "NO_STORE" ? null : {
      save() { return { ok: false }; },
      forDate() { return name === "ALREADY_RECORDED" ? [{ date: DAY, answers: {}, op_id: "synthetic" }] : []; },
    });
    if (name === "ALREADY_RECORDED") await checkin.refresh();
    const draft = checkin.draft();
    if (name !== "NOTHING_ANSWERED") draft.choose("stress", "Low");
    if (name === "HOURS_OUT_OF_RANGE") draft.set("sleep_hours", "25");
    if (name === "DAYS_INVALID") { draft.toggleIssue("away"); draft.set("away_days", "-1"); }
    const direct = await checkin.save();
    assert.equal(direct.code, undefined);
    assert.equal(direct.copy, model[name]);
    const r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true });
    assert.equal(r.unavailable.code, "CHECKIN_NOT_RECORDED");
    assert.equal(r.unavailable.reason, direct.copy);
    for (const renderer of [C, Y, X]) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), direct.copy);
  });
}

test("R1 B4 unknown code or copy cannot pass even beside a legitimate value", async () => {
  const model = await import("../../m3/w7-preview/today/checkin-model.mjs");
  for (const saved of [{ code: "UNKNOWN", copy: model.SAVE_REFUSED }, { copy: "777333" }, { code: "CHECKIN_NOT_RECORDED", copy: "777333" }]) {
    const { coach, checkin } = await checkinWorld();
    checkin.save = async () => ({ ok: false, ...saved });
    const r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true });
    assert.equal(r.unavailable.code, "CHECKIN_NOT_RECORDED");
    assert.equal(r.unavailable.reason, SAVE_COPY);
    assert.ok(r.unavailable.source.includes(String(saved.code)));
    assert.ok(r.unavailable.source.includes(saved.copy));
  }
});

function activeWave({ afterThrow = false } = {}) {
  const writes = [];
  const gym = {
    read() {
      if (afterThrow && writes.length) throw new Error("after synthetic durable write");
      return { phase: "active", startId: "synthetic", set: { position: 1, slot: "s", lift: "l" } };
    },
    logSet(input) { writes.push(input); return { ok: true, opId: "synthetic" }; },
  };
  const world = { today: { read() {}, today: DAY }, gym };
  return { writes, tools: W.createWave1Tools({ world, coach: T.createCoachTools(world),
    effortChoices: [{ label: "Unsure", reserve: { tag: "unknown" } }] }) };
}

test("R1 B3 dispatch catch after write makes no unchanged assertion", async () => {
  const { tools, writes } = activeWave({ afterThrow: true });
  const r = await tools.dispatch("log_set", { confirmed: true, load: 110, reps: 8, effort: "unsure" }, TURN);
  assert.equal(writes.length, 1);
  assert.equal(r.unavailable.code, "WAVE1_TOOL_THREW");
  assert.equal(Object.hasOwn(r, "state_unchanged"), false);
  const { tools: on } = await onboarding({ host: { save() { writes.push("setup"); throw new Error("after synthetic durable write"); } } });
  const s = await on.dispatch("submit", { confirmed: true }, TURN);
  assert.equal(writes.length, 2);
  assert.equal(s.unavailable.code, "ONBOARDING_TOOL_THREW");
  assert.equal(Object.hasOwn(s, "state_unchanged"), false);
});

test("R1 F1 confirmation numbers license nothing until yes writes the set", async () => {
  const { tools, writes } = activeWave();
  const turn = tools.openTurn(TURN);
  const r = await turn.call.log_set({ load: 987654, reps: 3210 });
  assert.deepEqual(turn.untraceable("You lifted 987654 lb."), ["987654"]);
  assert.deepEqual(turn.untraceable("That is 3210 reps."), ["3210"]);
  assert.equal(writes.length, 0);
  assert.equal(r.unavailable.reason, ASK_COPY);
  assert.equal(r.confirmation.text.display, "Say yes and I will log 987654 lb for 3210 reps. Nothing is recorded yet.");
  assert.equal(r.confirmation.text.value, r.confirmation.text.display);
  assert.equal(r.confirmation.text.licensed, false);
  assert.equal(r.confirmation.text.turn_id, undefined);
  const yes = await turn.call.log_set({ confirmed: true, load: 987654, reps: 3210, effort: "unsure" });
  assert.equal(yes.ok, true);
  assert.equal(writes.length, 1);
  assert.deepEqual(turn.untraceable("You lifted 987654 lb. That is 3210 reps."), []);
});

test("R1 F1 invalid numbers never reach a confirmation or a write", async () => {
  const badLoad = [undefined, null, "", " ", "110lb", "9876" + String.fromCharCode(0x2014) + "HOSTILE", {}, Symbol("load"), NaN, Infinity, -Infinity, 0, -0, -1];
  const badReps = [undefined, null, "", " ", "8reps", {}, Symbol("reps"), NaN, Infinity, -Infinity, -1, -0, 1.5, Number.MAX_SAFE_INTEGER + 1];
  for (const [field, values] of [["load", badLoad], ["reps", badReps]]) for (const value of values) for (const confirmed of [false, true]) {
    const { tools, writes } = activeWave();
    const r = await tools.dispatch("log_set", { load: 110, reps: 8, effort: "unsure", [field]: value, confirmed }, TURN);
    assert.equal(r.unavailable.code, "COACH_SET_NOT_RECORDED");
    assert.equal(r.unavailable.reason, SET_COPY);
    assert.equal(r.confirmation, undefined);
    assert.equal(writes.length, 0);
  }
  for (const [load, reps] of [[Number.MIN_VALUE, 0], [Number.MAX_VALUE, Number.MAX_SAFE_INTEGER], ["110", "8"]]) {
    const { tools } = activeWave();
    const r = await tools.dispatch("log_set", { load, reps }, TURN);
    assert.equal(r.unavailable.code, "COACH_CONFIRMATION_REQUIRED");
    assert.ok(r.confirmation.text);
  }
});

test("R1 F2 sibling-list names get one list-neutral sentence including memory", async () => {
  const { tools } = await onboarding();
  const world = { today: { read() {}, today: DAY } };
  const memory = M.createMemoryTools({ world, coach: T.createCoachTools(world) });
  for (const [toolset, names] of [[tools, ["today_plan", "current_set", "remember"]], [wave(), ["submit", "set_name"]], [memory, ["submit"]]]) {
    for (const name of names) {
      const r = await toolset.dispatch(name, {}, TURN);
      assert.equal(r.unavailable.reason, NEUTRAL);
      if (r.reason !== undefined) assert.equal(r.reason, NEUTRAL);
    }
  }
});

test("R1 B3 real refusal envelopes print whole fixed lines without extra tails", async () => {
  const rows = [];
  const { coach } = await checkinWorld();
  rows.push([await coach.openTurn(TURN).call.answer_checkin({ confirmed: true, energy: "INVALID" }), CHECKIN_COPY]);
  rows.push([await wave({ machineSettings: { save() { throw new Error(MARKER); } } }).dispatch("record_machine_settings", { confirmed: true }, TURN), "I could not keep that, and I have kept nothing."]);
  rows.push([await wave().dispatch("submit", {}, TURN), NEUTRAL]);
  rows.push([await (await onboarding()).tools.dispatch("today_plan", {}, TURN), NEUTRAL]);
  rows.push([await wave({}, { forTopic() { throw new Error(MARKER); } }).dispatch("plan_why", {}, TURN), THREW_COPY]);
  rows.push([await (await onboarding({ setup: { document() { throw new Error(MARKER); } } })).tools.dispatch("submit", { confirmed: true }, TURN), THREW_COPY]);
  const { model } = await onboarding();
  for (const message of [...Object.keys(model.REFUSAL_SENTENCES), "arbitrary"]) {
    rows.push([await (await onboarding({ commands: { prepare() { throw new Error(message); } } })).tools.dispatch("submit", { confirmed: true }, TURN), model.COPY.saveRefused]);
  }
  const bad = await checkinWorld({ save() { throw new Error(MARKER); }, forDate() { return []; } });
  rows.push([await bad.coach.openTurn(TURN).call.answer_checkin({ confirmed: true, stress: "Low" }), SAVE_COPY]);
  const { tools } = activeWave();
  rows.push([await tools.dispatch("log_set", { load: 110, reps: 8 }, TURN), ASK_COPY]);
  rows.push([await tools.dispatch("log_set", { load: "hostile", reps: 8 }, TURN), SET_COPY + " Nothing was recorded."]);
  const world = { today: { read() {}, today: DAY } };
  rows.push([await M.createMemoryTools({ world, coach: T.createCoachTools(world) }).dispatch("submit", {}, TURN), NEUTRAL]);
  for (const [r, expected] of rows) for (const [name, renderer] of [["coach", C], ["wave1", Y], ["onboarding", X]]) {
    const line = renderer.ALL_TEMPLATES.unavailable(r.unavailable);
    const want = r.unavailable.code === "COACH_SET_NOT_RECORDED" && name === "coach" ? SET_COPY + " Nothing changed." : expected;
    assert.equal(line, want, name + " " + r.unavailable.code);
  }
  // Accepted memory catch is a measured control, explicitly outside this fix.
  const memory = M.createMemoryTools({ world: { ...world, memory: { forTopic() { throw new Error(MARKER); } } }, coach: T.createCoachTools(world) });
  const r = await memory.dispatch("recall", { topic: "training" }, TURN);
  assert.equal(r.unavailable.code, "COACH_MEMORY_TOOL_THREW");
  assert.equal(r.unavailable.reason, "Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again.");
  assert.equal(r.state_unchanged, true);
  assert.equal(C.ALL_TEMPLATES.unavailable(r.unavailable), "Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed.");
});
