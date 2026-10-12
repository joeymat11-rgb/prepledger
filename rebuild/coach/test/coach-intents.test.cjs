"use strict";

/* Coach v1: the pure layer the page bundles (coach-intents.cjs). The moved templates are the SAME objects the
   script harnesses export; the page's questions are reads only (tier 0), so a tap can never write; and ask() ships
   an answer only when every number in it is a tool result of its own turn. */
const test = require("node:test");
const assert = require("node:assert/strict");
const I = require("../coach-intents.cjs");
const C = require("../coach-text.cjs");
const Y = require("../wave1-text.cjs");
const T = require("../tools.cjs");
const W = require("../wave1-tools.cjs");
const { createTodayModel, SYNTHETIC_DAY } = require("../../m3/w7-preview/today/today-model.cjs");

/* The PAGE's composition (page-coach.cjs): the read tools, never tools.cjs's writers (Coach v1, 9fb60ed); the weekly
   review (piece 2) is one of those reads. */
const { createReadTools } = require("../read-tools.cjs");
const toolsOver = (world) => W.createWave1Tools({ world, coach: createReadTools(world) });

test("CI-1 the moved templates and routing are the very objects the harnesses export", () => {
  assert.equal(C.ALL_TEMPLATES, I.ALL_TEMPLATES);
  assert.equal(C.TEMPLATES, I.TEMPLATES);
  assert.equal(C.READ_INTENTS, I.READ_INTENTS);
  assert.equal(C.answerOne, I.answerOne);
  assert.equal(Y.TEMPLATES, I.WAVE1_TEMPLATES);
  assert.equal(Y.list, I.list);
});

test("CI-2 every page question is a read: each tool it reads is tier 0, so no tap can record, change or accept anything", () => {
  const tools = toolsOver({ today: createTodayModel({ today: SYNTHETIC_DAY }) });
  assert.deepEqual([...I.PAGE_INTENT_IDS], ["today_plan", "why_weight", "last_time", "weight_trend", "my_checkin", "machine_seat", "week_review"]);
  for (const id of I.PAGE_INTENT_IDS) {
    const spec = I.PAGE_INTENTS[id];
    /* Polish batch: a question may read more than one tool (today's plan reads the session and the day's targets); every
       one of them is a read. */
    assert.ok(Array.isArray(spec.tools) && spec.tools.length >= 1, id + " reads at least one tool");
    for (const tool of spec.tools) assert.equal(tools.TIERS[tool], T.TIER.READ, id + " runs " + tool + ", which is not a read");
    assert.equal(typeof I.PAGE_TEMPLATES[spec.template], "function", id + " has its template");
  }
});

test("CI-3 over a real Today model, each question ships a traced answer or its plain refusal, never an invented figure", async () => {
  const tools = toolsOver({ today: createTodayModel({ today: SYNTHETIC_DAY }) });
  for (const id of I.PAGE_INTENT_IDS) {
    const got = await I.ask(tools, id, { turnId: "ci3-" + id });
    assert.deepEqual(got.untraceable, [], id + " has an untraceable number");
    assert.deepEqual(got.charter, [], id + " breaks the charter");
    assert.equal(got.shipped, true, id + " did not ship");
    if (!got.answered) {
      assert.equal(/\d/.test(got.answer), false, id + ": a refusal carries a figure: " + got.answer);
      assert.equal(got.answer, I.PLAIN_REFUSALS[id], id + ": a refusal is the question's own plain sentence");
    }
    /* It read its own tools, in order, and nothing else (a refusal ends the reads). */
    const spec = I.PAGE_INTENTS[id];
    assert.ok(got.results.length >= 1, id + " read a tool");
    assert.deepEqual(got.results.map((r) => r.tool), spec.tools.slice(0, got.results.length), id + " read only its own tools");
  }
  const plan = await I.ask(tools, "today_plan", { turnId: "ci3-plan" });
  assert.equal(plan.answered, true);
  assert.ok(/\d/.test(plan.answer), "today's plan carries the model's own figures");
  assert.equal(plan.answer.split("\n")[0], "Today: Upper body.", "it names the workout first");
});

/* POLISH BATCH (plain answers). A plan with every kind of card the engine composes (genSession: a first-weight ask, a
   working load with uneven reps, the first workout at a new load, a held lift, a bodyweight lift, a text setting); the
   page's answers say each in plain words, one line per item, every number a tool result of the turn. */
const PLAN = Object.freeze({ available: true, code: null, name: "LOWER", exercises: [
  { id: "plank", name: "Plank", sets: 3, reps: [0, 0, 0], weight: null, firstTime: true, newWeight: false, held: false, repTop: 10 },
  { id: "press", name: "Leg press", sets: 3, reps: [10, 10, 9], weight: 200, firstTime: false, newWeight: false, held: false, repTop: 12 },
  { id: "curl", name: "Leg curl", sets: 2, reps: [12, 12], weight: 55, firstTime: false, newWeight: true, held: false, repTop: 12 },
  { id: "calf", name: "Calf raise", sets: 2, reps: [15, 15], weight: 90, firstTime: false, newWeight: false, held: true, repTop: 15 },
  { id: "dip", name: "Dip", sets: 2, reps: [8, 8], weight: "BW", firstTime: false, newWeight: false, held: false, repTop: 12 },
  { id: "hack", name: "Hack squat", sets: 2, reps: [10, 10], weight: "Pin 7", firstTime: false, newWeight: false, held: false, repTop: 12 },
] });
const withPlan = (plan, day = SYNTHETIC_DAY) => {
  const real = createTodayModel({ today: day });
  return Object.assign(Object.create(real), { sessionPlan: () => plan });
};
const gymAt = (label, previous, extra = {}) => ({ read: async () => ({ phase: "ready", lift: { id: "x", label, index: 1, count: 1 },
  set: { position: 1, count: 2 }, prescription: { line: "", effort: "", reason: [], setup: "" }, previous, ...extra }) });

test("CI-6 the plain answers: the workout and each set target, one plain why per exercise, last time, the check-in's blanks", async () => {
  const today = withPlan(PLAN);
  const tools = toolsOver({ today, gym: gymAt("Plank", null) });
  const plan = await I.ask(tools, "today_plan", { turnId: "ci6-plan" });
  assert.equal(plan.answered, true);
  assert.deepEqual(plan.untraceable, []);
  const view = today.read();
  assert.deepEqual(plan.answer.split("\n"), [
    "Today: Lower body.",
    "Plank: first time, find your weight.",
    "Leg press: 3 sets of 10, 10, 9 reps at 200 lb.",
    "Leg curl: 2 sets of 12 reps at 55 lb.",
    "Calf raise: 2 sets of 15 reps at 90 lb.",
    "Dip: 2 sets of 8 reps, bodyweight.",
    "Hack squat: 2 sets of 10 reps at Pin 7.",
    "Eat between " + view.calorieTarget.lo + " and " + view.calorieTarget.hi + " calories.",
    "Protein: at least " + view.proteinTarget.g + " grams.",
  ]);
  const why = await I.ask(tools, "why_weight", { turnId: "ci6-why" });
  assert.equal(why.answered, true);
  assert.deepEqual(why.untraceable, []);
  assert.deepEqual(why.answer.split("\n"), [
    "Plank: first time. Pick a weight you can control for about 10 reps; what you log becomes your starting point.",
    "Leg press: 200 lb is your working weight. A new weight can be offered once you reach the top of your rep range (12 reps).",
    "Leg curl: 55 lb is your new weight, and this is its first workout.",
    "Calf raise: 90 lb, held for now. Your first set went to failure twice, so the weight stays until a first set ends with a rep or more in reserve.",
    "Dip: bodyweight, so there is no weight to set.",
    "Hack squat: your working setting is Pin 7.",
  ]);
  const none = await I.ask(tools, "last_time", { turnId: "ci6-none" });
  assert.equal(none.answered, true, "no earlier session is an answer, so it carries the source line");
  assert.equal(none.answer, "No earlier session of Plank yet.");
  const before = await I.ask(toolsOver({ today, gym: gymAt("Leg press", "Last time: 200 lb x 10") }), "last_time", { turnId: "ci6-last" });
  assert.equal(before.answered, true);
  assert.deepEqual(before.untraceable, []);
  assert.equal(before.answer, "Leg press. Last time: 200 lb x 10.");
  /* No band and no target: no calorie or protein line at all. */
  const bare = Object.assign(Object.create(today), { read: () => ({ ...today.read(), calorieTarget: null, proteinTarget: null }) });
  const noBand = await I.ask(toolsOver({ today: bare }), "today_plan", { turnId: "ci6-noband" });
  assert.equal(noBand.answered, true);
  assert.equal(/calorie|protein/i.test(noBand.answer), false, "no calorie or protein line without a band or a target: " + noBand.answer);
  /* A rest day. */
  const rest = await I.ask(toolsOver({ today: withPlan({ available: false, code: null, name: null, exercises: [] }) }), "why_weight", { turnId: "ci6-rest" });
  assert.equal(rest.answer, I.PLAIN.noWorkoutWhy);
  /* The check-in: each core question left blank is named in plain words; nothing recorded is said plainly. */
  const checkin = (recorded, sleepRecord = null) => ({ refresh: async () => {}, read: () => ({ day: SYNTHETIC_DAY, recorded,
    note: recorded ? "Your plan is unchanged: nothing in this check-in reaches a training rule yet."
      : "Nothing is recorded yet. Every answer is blank, and blank means unknown: never none, never zero.", sleepRecord }) });
  const some = await I.ask(toolsOver({ today, checkin: checkin({ provenance: "Recorded today at 07:10",
    lines: ["Energy right now: Moderate", "Stress right now: Low"] }) }), "my_checkin", { turnId: "ci6-checkin" });
  assert.equal(some.answered, true);
  assert.deepEqual(some.answer.split("\n"), ["Recorded today at 07:10.", "Energy right now: Moderate.", "Stress right now: Low.",
    "You left sleep, sleep quality and soreness blank.", "Your plan is unchanged: nothing in this check-in reaches a training rule yet."]);
  const sleptOnly = await I.ask(toolsOver({ today, checkin: checkin({ provenance: null, lines: ["Last night\u2019s sleep: 7 h",
    "How was the quality?: Good", "Energy right now: Low", "Muscle soreness right now: None", "Stress right now: High"] }) }), "my_checkin", { turnId: "ci6-full" });
  assert.equal(/blank/.test(sleptOnly.answer), false, "nothing is called blank when every core question has an answer");
  const nothing = await I.ask(toolsOver({ today, checkin: checkin(null, { hours: 7.5, date: "2030-02-03" }) }), "my_checkin", { turnId: "ci6-nothing" });
  assert.equal(nothing.answered, true);
  assert.deepEqual(nothing.untraceable, []);
  assert.deepEqual(nothing.answer.split("\n"), ["You have not checked in today.", "Your sleep record already has last night: 7.5 hours."]);
});

/* POLISH BATCH. NO ENGINE WORD REACHES THE SCREEN. Every page question, over worlds built to carry every engine code
   and engine phrase the tools can see (a gym card the engine blocked with its own copy, a card note's DEBUT wording, a
   check-in model's "never none, never zero", every native-load refusal code and an unmapped one, a session the engine
   could not prepare), answers with no code string and none of the engine's own shorthand. */
const ENGINE_WORDS = Object.freeze(["DEBUT", "baseline ask", "IS the line", "qualified comparable", "never none", "never zero",
  "engine", "RIR", "governor"]);
const CODE_SHAPE = /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/;
test("CI-7 no engine code or engine word ever reaches a page answer", async () => {
  const codes = new Set([...Object.values(T.CODES), ...Object.keys(I.WEEK_CODE_WORDS), "WORKOUT_PREPARATION_INVALID",
    "WORKOUT_PREPARATION_UNAVAILABLE", "PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED", "NATIVE_LOAD_SOMETHING_UNMAPPED", "COACH_ANSWER_DISCARDED"]);
  const blockedCopy = "DEBUT: find the working weight; what it gives today IS the line (WORKOUT_PREPARATION_INVALID).";
  const lifts = [...Object.keys(I.WEEK_CODE_WORDS), "NATIVE_LOAD_SOMETHING_UNMAPPED"].map((code, i) => ({ name: "Lift " + String.fromCharCode(65 + i), status: "refused", code }))
    .concat([{ name: "Squat", status: "held", code: "disputed" }, { name: "Row", status: "held", code: "SOMETHING_ELSE" }]);
  const weekRead = { lifts: async () => ({ ok: true, lifts }) };
  const sessions = { weekSessions: async () => ({ ok: true, done: 1, dates: [] }) };
  const real = createTodayModel({ today: "2026-10-12" });
  const worlds = {
    bare: { today: createTodayModel({ today: SYNTHETIC_DAY }) },
    plan: { today: withPlan(PLAN), gym: { ...gymAt("Plank", null), ...sessions }, week: weekRead },
    blocked: { today: real, gym: { read: async () => ({ phase: "blocked", code: "WORKOUT_PREPARATION_INVALID", copy: blockedCopy }), ...sessions }, week: weekRead },
    unprepared: { today: withPlan({ available: false, code: "WORKOUT_PREPARATION_UNAVAILABLE", name: null, exercises: [] }),
      checkin: { refresh: async () => {}, read: () => ({ day: SYNTHETIC_DAY, recorded: null,
        note: "Nothing is recorded yet. Every answer is blank, and blank means unknown: never none, never zero.", sleepRecord: null }) } },
    done: { today: real, gym: { read: async () => ({ phase: "done" }), weekSessions: async () => ({ ok: false, code: "COACH_GYM_SESSION_ABSENT" }) } },
  };
  let asked = 0;
  for (const [name, world] of Object.entries(worlds)) {
    const tools = toolsOver(world);
    for (const id of I.PAGE_INTENT_IDS) {
      const got = await I.ask(tools, id, { turnId: "ci7-" + name + "-" + id });
      asked += 1;
      const where = name + "/" + id + ": " + JSON.stringify(got.answer);
      assert.equal(got.shipped, true, where);
      assert.equal(CODE_SHAPE.test(got.answer), false, "a code string reached the screen at " + where);
      for (const code of codes) assert.equal(got.answer.includes(code), false, code + " reached the screen at " + where);
      for (const word of ENGINE_WORDS) assert.equal(got.answer.toLowerCase().includes(word.toLowerCase()), false, '"' + word + '" reached the screen at ' + where);
    }
  }
  assert.equal(asked, Object.keys(worlds).length * I.PAGE_INTENT_IDS.length);
  /* and the check has teeth: the engine's own blocked copy and a card note would each have failed it */
  assert.equal(CODE_SHAPE.test(blockedCopy), true);
  assert.ok(ENGINE_WORDS.some((word) => blockedCopy.toLowerCase().includes(word.toLowerCase())));
});

test("CI-8 the plain words carry no figure and no dash; the check-in's core questions are the check-in model's own labels", async () => {
  const words = [...Object.values(I.PLAIN).filter((v) => typeof v === "string"), ...Object.values(I.PLAIN.sessionNames),
    ...Object.values(I.PLAIN_REFUSALS), I.PLAIN_DISCARDED, ...I.CHECKIN_CORE.map(([, word]) => word)];
  for (const w of words) {
    assert.equal(/\d/.test(w), false, w + " carries a figure of its own");
    assert.equal(/[\u2013\u2014]/.test(w), false, w + " carries a dash");
  }
  const { LABELS } = (await import("../../m3/w7-preview/today/checkin-model.mjs")).default;
  assert.deepEqual(I.CHECKIN_CORE.map(([label]) => label),
    [LABELS.sleep_hours, LABELS.sleep_quality, LABELS.energy, LABELS.soreness, LABELS.stress]);
});

test("CI-4 a draft whose numbers the turn did not read is discarded: the general refusal is said instead", async () => {
  const real = toolsOver({ today: createTodayModel({ today: SYNTHETIC_DAY }) });
  const forgetful = { openTurn(turn_id) {
    const turn = real.openTurn(turn_id);
    return { turn_id, results: [], call: turn.call, untraceable: (answer) => T.untraceable(answer, [], turn_id) };
  } };
  const got = await I.ask(forgetful, "today_plan", { turnId: "ci4" });
  assert.equal(got.shipped, false);
  assert.equal(got.answered, false);
  assert.ok(/\d/.test(got.draft));
  assert.equal(got.answer, I.ALL_TEMPLATES.unavailable({ code: "COACH_ANSWER_DISCARDED", reason: null }));
  assert.equal(/\d/.test(got.answer), false);
});

test("CI-5 an unknown question and a missing tool layer are refused, never improvised", async () => {
  const tools = toolsOver({ today: createTodayModel({ today: SYNTHETIC_DAY }) });
  await assert.rejects(() => I.ask(tools, "free_text", {}), /COACH_UNKNOWN_PAGE_INTENT/);
  await assert.rejects(() => I.ask(null, "today_plan", {}), /coach tools are required/);
});
