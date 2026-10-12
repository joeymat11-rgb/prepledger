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

const toolsOver = (world) => W.createWave1Tools({ world, coach: T.createCoachTools(world) });

test("CI-1 the moved templates and routing are the very objects the harnesses export", () => {
  assert.equal(C.ALL_TEMPLATES, I.ALL_TEMPLATES);
  assert.equal(C.TEMPLATES, I.TEMPLATES);
  assert.equal(C.READ_INTENTS, I.READ_INTENTS);
  assert.equal(C.answerOne, I.answerOne);
  assert.equal(Y.TEMPLATES, I.WAVE1_TEMPLATES);
  assert.equal(Y.list, I.list);
});

test("CI-2 every page question is a read: its tool is tier 0, so no tap can record, change or accept anything", () => {
  const tools = toolsOver({ today: createTodayModel({ today: SYNTHETIC_DAY }) });
  assert.deepEqual([...I.PAGE_INTENT_IDS], ["today_plan", "why_weight", "last_time", "weight_trend", "my_checkin", "machine_seat"]);
  for (const id of I.PAGE_INTENT_IDS) {
    const spec = I.PAGE_INTENTS[id];
    assert.equal(tools.TIERS[spec.tool], T.TIER.READ, id + " runs " + spec.tool + ", which is not a read");
    assert.ok(typeof ({ ...I.ALL_TEMPLATES, ...I.PAGE_TEMPLATES, ...I.WAVE1_TEMPLATES })[spec.template] === "function", id + " has its template");
  }
});

test("CI-3 over a real Today model, each question ships a traced answer or the tool's own refusal, never an invented figure", async () => {
  const tools = toolsOver({ today: createTodayModel({ today: SYNTHETIC_DAY }) });
  for (const id of I.PAGE_INTENT_IDS) {
    const got = await I.ask(tools, id, { turnId: "ci3-" + id });
    assert.deepEqual(got.untraceable, [], id + " has an untraceable number");
    assert.deepEqual(got.charter, [], id + " breaks the charter");
    assert.equal(got.shipped, true, id + " did not ship");
    if (!got.answered) assert.equal(/\d/.test(got.answer), false, id + ": a refusal carries a figure: " + got.answer);
    assert.equal(got.results.length, 1, id + " read exactly one tool");
  }
  const plan = await I.ask(tools, "today_plan", { turnId: "ci3-plan" });
  assert.equal(plan.answered, true);
  assert.ok(/\d/.test(plan.answer), "today's plan carries the model's own figures");
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
