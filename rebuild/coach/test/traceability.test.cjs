"use strict";

/* ACCEPTANCE (a) — TRACEABILITY.
 * "For a fixed set of scripted questions, every numeric token in the coach's
 * transcript is traceable to a tool result in the same turn (fail-closed if the
 * model emits an untraceable number)." — VOICE-COACH-BRIEF.md
 *
 * The fail-closed half is what makes this a test rather than a demo: a tampered
 * copy of a template that says a number the tools did not return must turn the
 * check RED. If it does not, the check is decorative. */

const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../tools.cjs");
const C = require("../coach-text.cjs");
const { createTodayModel } = require("../../m3/w7-preview/today/today-model.cjs");

const coach = () => T.createCoachTools({ today: createTodayModel({}) });

test("the script is the fixed set the brief asks for (>= 12 questions, unique ids)", () => {
  const script = C.loadScript();
  assert.ok(script.questions.length >= 12, "at least 12 scripted questions");
  const ids = script.questions.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of script.questions) {
    assert.equal(typeof q.ask, "string");
    assert.ok(C.READ_INTENTS[q.intent] || C.FACT_INTENTS[q.intent] || C.TIER3_INTENTS[q.intent]
      || /^(request_replan_volume|request_replan_volume_no_yes|accept_replan_volume)$/.test(q.intent),
      "intent " + q.intent + " is routed");
  }
});

test("every numeric token in every answer comes from a tool result in the SAME turn", async () => {
  const run = await C.runScript(coach());
  assert.deepEqual(run.untraceable, [], "untraceable tokens: " + JSON.stringify(run.untraceable));
  /* and the transcript really does carry numbers — a check that passes because
     nothing was said is no check at all */
  assert.ok(T.numericTokens(run.text).length > 20, "the transcript states real figures");
});

test("every turn answered from at least one tool result, and every result is tagged to that turn", async () => {
  const run = await C.runScript(coach());
  for (const turn of run.turns) {
    assert.ok(turn.results.length >= 1, turn.id + " called no tool");
    for (const r of turn.results) {
      assert.equal(r.turn_id, turn.turn_id);
      for (const tag of T.collectTagged(r)) assert.equal(tag.turn_id, turn.turn_id);
      assert.ok(typeof r.tier === "number", turn.id + " result carries no tier");
    }
  }
});

test("FAIL-CLOSED: a template copy with a literal number turns the check RED", async () => {
  const tampered = { ...C.ALL_TEMPLATES, calories: () => "Eat about 2500 calories today." };
  const run = await C.runScript(coach(), { templates: tampered });
  const bad = run.untraceable.find((u) => u.id === "q02");
  assert.ok(bad, "the injected number must be reported as untraceable");
  assert.deepEqual(bad.tokens, ["2500"]);
  /* and only that turn goes red — the check is scoped, not global */
  assert.equal(run.untraceable.length, 1);
});

test("FAIL-CLOSED: a plausible-but-wrong rounding of a real value is still untraceable", async () => {
  const tampered = { ...C.ALL_TEMPLATES, weight_trend: () => "You are losing about 1.2 pounds a week." };
  const run = await C.runScript(coach(), { templates: tampered });
  const bad = run.untraceable.find((u) => u.id === "q06");
  assert.ok(bad, "1.2 is not 1.19 and the engine never said it");
  assert.deepEqual(bad.tokens, ["1.2"]);
});

test("provenance cannot be borrowed from another turn", async () => {
  const run = await C.runScript(coach());
  const trend = run.turns.find((t) => t.id === "q06");
  const protein = run.turns.find((t) => t.id === "q03");
  assert.ok(T.numericTokens(trend.answer).length && T.numericTokens(protein.answer).length);
  /* the trend answer's numbers are not licensed by the protein turn's results */
  assert.ok(T.untraceable(trend.answer, protein.results, protein.turn_id).length > 0);
});

test("no template contains a digit — every figure arrives through a tagged value", () => {
  const STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
  for (const [name, fn] of Object.entries(C.ALL_TEMPLATES)) {
    const src = String(fn);
    for (const lit of src.match(STRING_LITERAL) || []) {
      assert.ok(!/\d/.test(lit), "template " + name + " carries a literal number: " + lit);
    }
  }
});

test("a tool never hands back the ledger", async () => {
  const run = await C.runScript(coach());
  const blob = JSON.stringify(run.turns.map((t) => t.results));
  for (const forbidden of ["dailyLogs", "sessionLog", "\"reads\"", "GH_TOKEN", "identityKey", "storeKey"]) {
    assert.ok(!blob.includes(forbidden), "a tool result leaked " + forbidden);
  }
  assert.throws(() => T.assertNoLeak({ values: { x: 1 }, sessionLog: {} }), /COACH_TOOL_LEAK/);
});

test("blank is unknown: an absent engine value never becomes a number", () => {
  const b = T.blank("turn-x", "energy.currentRate.scale", "lb/wk", "no measured rate");
  assert.equal(b.value, null);
  assert.equal(b.display, "");
  assert.deepEqual(T.numericTokens(b.display), []);
});

test("only what the question needs: a turn's context stays small", async () => {
  const run = await C.runScript(coach());
  for (const turn of run.turns) {
    assert.ok(C.turnContextBytes(turn) < 8192, turn.id + " sent too much context");
  }
});
