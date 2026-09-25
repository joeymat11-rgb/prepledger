"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../tools.cjs");
const W = require("../wave1-tools.cjs");
const O = require("../onboarding-tools.cjs");
const X = require("../onboarding-text.cjs");

// Each line is this head's refusal envelope rendered by the 24503919 renderer and its refusalHasOwnEnding: the lane's sentence with the base's ending. It is not a transcript of what 24503919 printed.
const BASE_LINES = {
  "CHECKIN_NOT_RECORDED": {
    "coach": {
      "model:ALREADY_RECORDED": "Today\u2019s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing changed.",
      "model:NOTHING_ANSWERED": "Answer at least one question, or leave the check-in for today. Nothing was recorded. Nothing changed.",
      "model:NO_STORE": "This device could not open its encrypted local store, so no check-in can be recorded here. Nothing changed.",
      "model:HOURS_OUT_OF_RANGE": "An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded. Nothing changed.",
      "model:DAYS_INVALID": "Days away from training is recorded as a whole number of days. Nothing was recorded. Nothing changed.",
      "model:SAVE_REFUSED": "This check-in could not be recorded on this device, and no part of it was recorded. Nothing changed.",
      "B3:12": "I could not record that check-in answer. Nothing was recorded. Nothing changed.",
      "tails:already": "Today\u2019s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing changed."
    },
    "wave1": {
      "model:ALREADY_RECORDED": "Today\u2019s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing was recorded.",
      "model:NOTHING_ANSWERED": "Answer at least one question, or leave the check-in for today. Nothing was recorded.",
      "model:NO_STORE": "This device could not open its encrypted local store, so no check-in can be recorded here. Nothing was recorded.",
      "model:HOURS_OUT_OF_RANGE": "An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded.",
      "model:DAYS_INVALID": "Days away from training is recorded as a whole number of days. Nothing was recorded.",
      "model:SAVE_REFUSED": "This check-in could not be recorded on this device, and no part of it was recorded. Nothing was recorded.",
      "B3:12": "I could not record that check-in answer. Nothing was recorded.",
      "tails:already": "Today\u2019s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing was recorded."
    },
    "onboarding": {
      "model:ALREADY_RECORDED": "Today\u2019s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing was recorded.",
      "model:NOTHING_ANSWERED": "Answer at least one question, or leave the check-in for today. Nothing was recorded.",
      "model:NO_STORE": "This device could not open its encrypted local store, so no check-in can be recorded here. Nothing was recorded.",
      "model:HOURS_OUT_OF_RANGE": "An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded.",
      "model:DAYS_INVALID": "Days away from training is recorded as a whole number of days. Nothing was recorded.",
      "model:SAVE_REFUSED": "This check-in could not be recorded on this device, and no part of it was recorded. Nothing was recorded.",
      "B3:12": "I could not record that check-in answer. Nothing was recorded.",
      "tails:already": "Today\u2019s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing was recorded."
    }
  },
  "CHECKIN_INPUT_INVALID": {
    "coach": {
      "B3:0": "I could not record that check-in answer. Nothing was recorded. Nothing changed."
    },
    "wave1": {
      "B3:0": "I could not record that check-in answer. Nothing was recorded."
    },
    "onboarding": {
      "B3:0": "I could not record that check-in answer. Nothing was recorded."
    }
  },
  "COACH_MACHINE_SETTINGS_INVALID": {
    "coach": {
      "B3:1": "I could not keep that, and I have kept nothing. Nothing changed.",
      "tails:machine read": "I need to know which machine you mean. Nothing changed.",
      "tails:machine host": "Your device would not accept that write. Nothing changed."
    },
    "wave1": {
      "B3:1": "I could not keep that, and I have kept nothing.",
      "tails:machine read": "I need to know which machine you mean. Nothing was recorded.",
      "tails:machine host": "Your device would not accept that write. Nothing was recorded."
    },
    "onboarding": {
      "B3:1": "I could not keep that, and I have kept nothing. Nothing was recorded.",
      "tails:machine read": "I need to know which machine you mean. Nothing was recorded.",
      "tails:machine host": "Your device would not accept that write. Nothing was recorded."
    }
  },
  "WAVE1_TOOL_NOT_IN_LIST": {
    "coach": {
      "B3:2": "I cannot use that tool here, so I did nothing. Nothing changed."
    },
    "wave1": {
      "B3:2": "I cannot use that tool here, so I did nothing. Nothing was recorded."
    },
    "onboarding": {
      "B3:2": "I cannot use that tool here, so I did nothing. Nothing was recorded."
    }
  },
  "ONBOARDING_TOOL_NOT_IN_LIST": {
    "coach": {
      "B3:3": "I cannot use that tool here, so I did nothing. Nothing changed."
    },
    "wave1": {
      "B3:3": "I cannot use that tool here, so I did nothing. Nothing was recorded."
    },
    "onboarding": {
      "B3:3": "I cannot use that tool here, so I did nothing. Nothing was recorded."
    }
  },
  "CLEAN_INIT_SETUP_REQUIRED": {
    "coach": {
      "B3:6": "Your week could not be recorded on this device, and no part of it was recorded. Nothing changed."
    },
    "wave1": {
      "B3:6": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    },
    "onboarding": {
      "B3:6": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    }
  },
  "CLEAN_INIT_SPLIT_REQUIRED": {
    "coach": {
      "B3:7": "Your week could not be recorded on this device, and no part of it was recorded. Nothing changed."
    },
    "wave1": {
      "B3:7": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    },
    "onboarding": {
      "B3:7": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    }
  },
  "CLEAN_INIT_EXERCISES_REQUIRED": {
    "coach": {
      "B3:8": "Your week could not be recorded on this device, and no part of it was recorded. Nothing changed."
    },
    "wave1": {
      "B3:8": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    },
    "onboarding": {
      "B3:8": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    }
  },
  "CLEAN_INIT_EXERCISE_REQUIRED": {
    "coach": {
      "B3:9": "Your week could not be recorded on this device, and no part of it was recorded. Nothing changed."
    },
    "wave1": {
      "B3:9": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    },
    "onboarding": {
      "B3:9": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    }
  },
  "CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED": {
    "coach": {
      "B3:10": "Your week could not be recorded on this device, and no part of it was recorded. Nothing changed."
    },
    "wave1": {
      "B3:10": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    },
    "onboarding": {
      "B3:10": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    }
  },
  "SETUP_INPUT_INVALID": {
    "coach": {
      "B3:11": "Your week could not be recorded on this device, and no part of it was recorded. Nothing changed."
    },
    "wave1": {
      "B3:11": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    },
    "onboarding": {
      "B3:11": "Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded."
    }
  },
  "COACH_SET_NOT_RECORDED": {
    "coach": {
      "B3:14": "Tell me the weight and the reps you actually did. Nothing changed."
    },
    "wave1": {
      "B3:14": "Tell me the weight and the reps you actually did. Nothing was recorded."
    },
    "onboarding": {
      "B3:14": "Tell me the weight and the reps you actually did. Nothing was recorded."
    }
  },
  "MEMORY_TOOL_NOT_IN_LIST": {
    "coach": {
      "B3:15": "I cannot use that tool here, so I did nothing. Nothing changed."
    },
    "wave1": {
      "B3:15": "I cannot use that tool here, so I did nothing. Nothing was recorded."
    },
    "onboarding": {
      "B3:15": "I cannot use that tool here, so I did nothing. Nothing was recorded."
    }
  },
  "CHECKIN_SOURCE_UNAVAILABLE": {
    "coach": {
      "wrapper": "The check-in could not be read on this device. Nothing was recorded. Nothing changed."
    },
    "wave1": {
      "wrapper": "The check-in could not be read on this device. Nothing was recorded."
    },
    "onboarding": {
      "wrapper": "The check-in could not be read on this device. Nothing was recorded."
    }
  },
  "COACH_EFFORT_REQUIRED": {
    "coach": {
      "B3:16": "Tell me how many clean reps you had left, or say you are unsure. Nothing changed."
    },
    "wave1": {
      "B3:16": "Tell me how many clean reps you had left, or say you are unsure. Nothing was recorded."
    },
    "onboarding": {
      "B3:16": "Tell me how many clean reps you had left, or say you are unsure. Nothing was recorded."
    }
  },
  "SLEEP_NIGHT_CHANGED": {
    "coach": {
      "wrapper": "This night changed while you were editing. Review the saved record before trying again. Nothing was recorded. Nothing changed."
    },
    "wave1": {
      "wrapper": "This night changed while you were editing. Review the saved record before trying again. Nothing was recorded."
    },
    "onboarding": {
      "wrapper": "This night changed while you were editing. Review the saved record before trying again. Nothing was recorded."
    }
  }
};

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

test("R3 N4 TT4b submit preserves declared bare-string codes and rejects an undeclared string", async () => {
  const { model } = await onboarding();
  for (const message of [...Object.keys(model.REFUSAL_SENTENCES), MARKER]) {
    const { tools } = await onboarding({ commands: { prepare() { throw message; } } });
    const r = await tools.dispatch("submit", { confirmed: true }, TURN);
    assert.equal(r.unavailable.code, Object.hasOwn(model.REFUSAL_SENTENCES, message) ? message : "SETUP_INPUT_INVALID");
    assert.equal(r.unavailable.reason, model.COPY.saveRefused);
    assert.ok(r.unavailable.source.includes(message));
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
const R2 = require("./review-r2-support.cjs");
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

// The sealed model alone returns these six copies without codes; the wrapper adds two pairs.
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
    for (const [i, renderer] of [C, Y, X].entries()) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), BASE_LINES[r.unavailable.code][["coach", "wave1", "onboarding"][i]]["model:" + name]);
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

test("R1 B3 real refusal envelopes follow base endings and catch-all exceptions", async () => {
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
  const effort = await tools.dispatch("log_set", { confirmed: true, load: 110, reps: 8 }, TURN);
  assert.equal(effort.unavailable.code, "COACH_EFFORT_REQUIRED");
  rows.push([effort, "Tell me how many clean reps you had left, or say you are unsure."]);
  for (const [rowIndex, [r, expected]] of rows.entries()) for (const [name, renderer] of [["coach", C], ["wave1", Y], ["onboarding", X]]) {
    const line = renderer.ALL_TEMPLATES.unavailable(r.unavailable);
    const want = ["WAVE1_TOOL_THREW", "ONBOARDING_TOOL_THREW", "COACH_CONFIRMATION_REQUIRED"].includes(r.unavailable.code)
      ? expected : BASE_LINES[r.unavailable.code][name]["B3:" + rowIndex];
    assert.equal(line, want, name + " " + r.unavailable.code);
  }
});

test("R2 memory catch after synthetic write makes no state claim or tail", async () => {
  const world = { today: { read() {}, today: DAY } };
  // R2: a synthetic write completes before the memory lane throws.
  const writes = [];
  const memory = M.createMemoryTools({ world: { ...world, memory: { save(value) { writes.push(value); throw new Error(MARKER); } } }, coach: T.createCoachTools(world) });
  const fact = { memory_id: "synthetic", kind: "preference", topic: "coaching", text: "I prefer quiet cues." };
  const ask = await memory.dispatch("remember", { memory: fact }, TURN);
  const r = await memory.dispatch("remember", { memory: fact, confirmed: true, confirmation_id: ask.confirmation.confirmation_id }, TURN);
  assert.deepEqual(writes, [fact]);
  assert.equal(r.unavailable.code, "COACH_MEMORY_TOOL_THREW");
  assert.equal(r.unavailable.reason, THREW_COPY);
  assert.equal(Object.hasOwn(r, "state_unchanged"), false);
  for (const renderer of [C, Y, X]) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), THREW_COPY);
  const reader = M.createMemoryTools({ world: { ...world, memory: { forTopic() { throw new Error(MARKER); } } }, coach: T.createCoachTools(world) });
  const read = await reader.dispatch("recall", { topic: "training" }, TURN);
  assert.equal(read.unavailable.code, "COACH_MEMORY_TOOL_THREW");
  assert.equal(read.unavailable.reason, THREW_COPY);
  assert.equal(Object.hasOwn(read, "state_unchanged"), false);
  for (const renderer of [C, Y, X]) assert.equal(renderer.ALL_TEMPLATES.unavailable(read.unavailable), THREW_COPY);
  assert.ok(T.refusalHasOwnEnding(M.MEMORY_CODES.MEMORY_TOOL_THREW));
});
// Review R2: new cells, executed against unchanged product first.
const PAIRS = [
  { code: "CHECKIN_SOURCE_UNAVAILABLE", copy: "The check-in could not be read on this device. Nothing was recorded." },
  { code: "SLEEP_NIGHT_CHANGED", copy: "This night changed while you were editing. Review the saved record before trying again. Nothing was recorded." },
];
async function realWrapper() {
  const { webcrypto } = require("node:crypto");
  const support = await import("../../m3/w6/test/support.mjs");
  const { openCoachWorld } = await import("../local-world.mjs");
  const host = await import("../../m3/w7-preview/today/gym-host.mjs");
  const pair = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.publicKey);
  const storeKey = await webcrypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  return openCoachWorld({ indexedDB: support.faultDatabase().indexedDB, crypto: webcrypto, day: DAY,
    checkInDeviceKeys: { kid: host.AUTHORITY_KID, storeKey, signingKey: pair.privateKey,
      publicKey: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y, key_ops: ["verify"], ext: true } } });
}
for (const pair of PAIRS) test("R2 B1 real wrapper preserves " + pair.code, async () => {
  const w = await realWrapper();
  try {
    if (pair.code === "CHECKIN_SOURCE_UNAVAILABLE") w.close();
    else {
      assert.equal((await w.sleepHost.save({ date: "2030-02-03", hours: 7 })).ok, true);
      await w.checkin.refresh();
      w.checkin.draft().confirmSleep();
      assert.equal((await w.sleepHost.save({ date: "2030-02-03", hours: 6 })).ok, true);
    }
    const r = await T.createCoachTools(w).openTurn(TURN).call.answer_checkin({ confirmed: true });
    assert.equal(r.unavailable.code, pair.code);
    assert.equal(r.unavailable.reason, pair.copy);
    assert.equal(r.unavailable.source, "local-world.mjs save(): code=" + pair.code + "; copy=" + pair.copy);
    for (const [i, renderer] of [C, Y, X].entries()) {
      assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), BASE_LINES[pair.code][["coach", "wave1", "onboarding"][i]].wrapper);
    }
  } finally { w.close(); }
});
for (const pair of PAIRS) for (const wrong of ["code", "copy"]) test("R2 B1 mismatched wrapper " + pair.code + " " + wrong + " collapses", async () => {
  const { coach, checkin } = await checkinWorld();
  const saved = { ok: false, ...pair, [wrong]: MARKER };
  checkin.save = async () => saved;
  const r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true });
  assert.equal(r.unavailable.code, "CHECKIN_NOT_RECORDED");
  assert.equal(r.unavailable.reason, SAVE_COPY);
  assert.ok(r.unavailable.source.includes(MARKER));
  assert.deepEqual(T.untraceable("It was 987654.", [r], TURN), ["987654"]);
});
for (const kind of ["already", "machine read", "machine host"]) test("R2 B2 base tails: " + kind, async () => {
  let r;
  if (kind === "already") {
    const { coach, checkin } = await checkinWorld({ forDate: () => [{ date: DAY, answers: {}, op_id: "synthetic" }] });
    await checkin.refresh();
    r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true });
  } else {
    const tools = wave({ machineSettings: { read() {}, save: () => ({ ok: false, copy: "Your device would not accept that write." }) } });
    r = await tools.dispatch(kind === "machine read" ? "machine_settings" : "record_machine_settings", { confirmed: true }, TURN);
    assert.equal(r.unavailable.code, "COACH_MACHINE_SETTINGS_INVALID");
  }
  for (const [i, renderer] of [C, Y, X].entries()) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), BASE_LINES[r.unavailable.code][["coach", "wave1", "onboarding"][i]]["tails:" + kind]);
});
for (const site of ["waveDispatchCatch", "onbDispatchCatch", "checkinApplyCatch"]) test("R2 N7 throwing message getter: " + site, async () => {
  const error = { get message() { throw new Error("MSG GETTER"); } };
  let r;
  if (site === "waveDispatchCatch") r = await wave({}, { forTopic() { throw error; } }).dispatch("plan_why", {}, TURN);
  else if (site === "onbDispatchCatch") r = await (await onboarding({ setup: { document() { throw error; } } })).tools.dispatch("submit", { confirmed: true }, TURN);
  else {
    const { checkin, coach } = await checkinWorld();
    checkin.draft().choose = () => { throw error; };
    r = await coach.openTurn(TURN).call.answer_checkin({ confirmed: true, energy: "Good" });
  }
  assert.equal(r.ok, false);
  assert.equal(r.unavailable.code, { waveDispatchCatch: "WAVE1_TOOL_THREW", onbDispatchCatch: "ONBOARDING_TOOL_THREW", checkinApplyCatch: "CHECKIN_INPUT_INVALID" }[site]);
  assert.ok(r.unavailable.source.includes("(unprintable)"));
});
for (const site of ["wave", "onboarding", "memory"]) test("R2 N8 revoked Proxy name: " + site, async () => {
  const { proxy, revoke } = Proxy.revocable({}, {}); revoke();
  const world = { today: { read() {}, today: DAY } };
  const tools = site === "wave" ? wave() : site === "onboarding" ? (await onboarding()).tools : M.createMemoryTools({ world, coach: T.createCoachTools(world) });
  const r = await tools.dispatch(proxy, {}, TURN);
  assert.equal(r.ok, false);
  assert.equal(r.tool, "(not a tool name)");
  assert.equal(r.unavailable.reason, NEUTRAL);
  assert.equal(r.unavailable.code, { wave: "WAVE1_TOOL_NOT_IN_LIST", onboarding: "ONBOARDING_TOOL_NOT_IN_LIST", memory: "MEMORY_TOOL_NOT_IN_LIST" }[site]);
  assert.ok(r.unavailable.source.includes("(unprintable)"));
  T.assertNoLeak(r);
});
for (const name of ["NO_STORE", "ALREADY_RECORDED", ...PAIRS.map(pair => pair.code)]) test("R2 N4 check-in vocabulary import rejection is contained: " + name, async () => {
  const fs = require("node:fs");
  const source = fs.readFileSync(require.resolve("../tools.cjs"), "utf8");
  const specifier = 'import("../m3/w7-preview/today/checkin-model.mjs")';
  assert.ok(source.includes(specifier));
  const injected = source.replace(specifier, 'import("data:text/javascript,throw new Error(\'SYNTHETIC_IMPORT_FAILURE\')")');
  const isolated = R2.fromSource("tools.cjs", injected);
  const { checkin, model } = await checkinWorld(null);
  const pair = PAIRS.find(pair => pair.code === name);
  if (pair) checkin.save = async () => ({ ok: false, ...pair });
  else if (name === "ALREADY_RECORDED") checkin.save = async () => ({ ok: false, copy: model.ALREADY_RECORDED });
  const r = await isolated.createCoachTools({ today: { read() {}, today: DAY }, checkin }).openTurn(TURN).call.answer_checkin({ confirmed: true });
  assert.equal(r.unavailable.code, pair ? pair.code : "CHECKIN_NOT_RECORDED");
  assert.equal(r.unavailable.reason, pair ? pair.copy : SAVE_COPY);
  if (!pair) assert.ok(r.unavailable.source.includes("SYNTHETIC_IMPORT_FAILURE"));
});
test("R2 N1 own ending is independent of confirmation code", () => {
  for (const renderer of [C, Y, X]) assert.equal(renderer.ALL_TEMPLATES.unavailable({ code: "SYNTHETIC", reason: ASK_COPY }), ASK_COPY);
});

test("R3 N2 rejected model import retains import error and host code and copy via provenance", async () => {
  const source = require("node:fs").readFileSync(require.resolve("../tools.cjs"), "utf8");
  const specifier = 'import("../m3/w7-preview/today/checkin-model.mjs")';
  assert.ok(source.includes(specifier));
  const isolated = R2.fromSource("tools.cjs", source.replace(specifier, 'import("data:text/javascript,throw new Error(\'SYNTHETIC_IMPORT_FAILURE\')")'));
  const { checkin } = await checkinWorld();
  checkin.save = async () => ({ ok: false, code: { message: "SYNTHETIC_HOST_CODE" }, copy: { message: MARKER } });
  const r = await isolated.createCoachTools({ today: { read() {}, today: DAY }, checkin }).openTurn(TURN).call.answer_checkin({ confirmed: true });
  assert.equal(r.unavailable.code, "CHECKIN_NOT_RECORDED");
  assert.equal(r.unavailable.reason, SAVE_COPY);
  assert.equal(r.unavailable.source, "tools.cjs check-in vocabulary import: SYNTHETIC_IMPORT_FAILURE; code=SYNTHETIC_HOST_CODE; copy=" + MARKER);
  assert.equal(JSON.stringify(r, (key, value) => key === "source" ? undefined : value).includes(MARKER), false);
  assert.deepEqual(T.untraceable("It was 987654.", [r], TURN), ["987654"]);
  T.assertNoLeak(r);
});
test("R2 N5 invalid set copy names its coach source", async () => {
  const { tools } = activeWave();
  const r = await tools.dispatch("log_set", { load: "bad", reps: 8 }, TURN);
  assert.equal(r.unavailable.reason, SET_COPY);
  assert.equal(r.unavailable.source, "wave1-tools.cjs log_set invalid-input refusal");
});

test("R2 N4 tools source does not import local-world", () => {
  const source = require("node:fs").readFileSync(require.resolve("../tools.cjs"), "utf8");
  assert.doesNotMatch(source, /import\s*\([^)]*local-world/);
});
