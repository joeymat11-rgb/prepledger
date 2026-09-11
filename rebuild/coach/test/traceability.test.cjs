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

/* ------------------------------------------------------------------ C2 ---- */

/* C5 review round 1, C2. The instrument used to be FIELD-BLIND: it flattened
   every tagged display in the turn into one untyped set of digit strings, so any
   number the turn produced licensed any sentence. Every string below was GREEN
   at e576905 — a protein gram count minted a calorie instruction, a calorie floor
   minted a protein target, and a year out of a date tag minted a set count.
   These six strings are the reviewer's own, verbatim. */
test("a number is traceable only INTO THE FIELD THAT LICENSED IT", async () => {
  const turn = coach().openTurn("turn-units");
  await turn.call.today_plan({});
  /* what today_plan licensed, keyed on unit */
  const allowed = T.allowedTokens(turn.results, "turn-units");
  assert.deepEqual([...allowed.get("2262")], ["kcal"]);
  assert.deepEqual([...allowed.get("155")], ["g"]);
  assert.deepEqual([...allowed.get("2030")], ["date"]);

  const MUST_REFUSE = [
    ["Eat 155 calories today.", "155"],                       /* g into a kcal slot */
    ["Your protein target is 2262 grams.", "2262"],           /* kcal into a g slot */
    ["Add 2030 weekly sets.", "2030"],                        /* a date component into a set slot */
    ["Rest 155 minutes between sets.", "155"],                /* g into a min slot */
    ["Your weight is 2262 pounds.", "2262"],                  /* kcal into a lb slot */
  ];
  for (const [said, token] of MUST_REFUSE) {
    assert.deepEqual(turn.untraceable(said), [token], "STILL GREEN: " + said);
  }

  const MUST_ACCEPT = [
    "Today: 2262–2360 kcal · 155 g protein",                  /* today.marchingOrder.targetLine verbatim */
    "Your calorie band today is 2262 to 2360.",
    "Your protein target is 155 grams.",
  ];
  for (const said of MUST_ACCEPT) {
    assert.deepEqual(turn.untraceable(said), [], "WRONGLY RED: " + said);
  }
});

/* C5 review round 2, C8. The round-1 checker read only RIGHTWARD and treated an
   unrecognised noun as "no unit", so deleting the unit word restored the whole
   hole: every string below was ACCEPTED at be888dd. The first three are the
   reviewer's own red-first probes, verbatim. */
test("deleting the unit word does not make a number free: the field still binds", async () => {
  const turn = coach().openTurn("turn-c8");
  await turn.call.today_plan({});

  const MUST_REFUSE = [
    /* the reviewer's three, verbatim */
    ["Your protein target is 2262.", "2262"],      /* label to the LEFT: a kcal floor in a g slot */
    ["Rest 155 seconds.", "155"],                  /* `seconds` is not a unit this file knows */
    ["Protein: 2262. Calories: 155.", "2262"],     /* the "Field: N." label form */
    /* and the rest of the reviewer's round-2 table */
    ["Your calorie floor is 155.", "155"],
    ["You weigh 2262.", "2262"],
    ["Add 155 kilograms.", "155"],
    ["Your body fat is 2360 percent.", "2360"],
    /* a number with no field word at all is not free either */
    ["Your target is 2262.", "2262"],
    ["It is 155.", "155"],
  ];
  for (const [said, token] of MUST_REFUSE) {
    assert.ok(turn.untraceable(said).includes(token), "STILL GREEN: " + said);
  }
  /* "Protein: 2262. Calories: 155." is wrong in BOTH clauses */
  assert.deepEqual(turn.untraceable("Protein: 2262. Calories: 155."), ["2262", "155"]);

  /* the reviewer's three must-accept strings, verbatim, plus the label form used
     correctly — the fix must not buy its refusals with false reds */
  for (const said of [
    "Your protein target is 155 grams.",
    "Eat between 2262 and 2360 kcal.",
    "Today: 2262–2360 kcal · 155 g protein",
    "Your calorie band today is 2262 to 2360.",
    "Protein: 155. Calories: 2262.",
    "Eat 2,262 calories today.",
  ]) {
    assert.deepEqual(turn.untraceable(said), [], "WRONGLY RED: " + said);
  }
});

test("an unrecognised unit noun licenses nothing but itself", async () => {
  const turn = coach().openTurn("turn-c8b");
  await turn.call.today_plan({});
  /* `seconds`, `kilograms`, `stone` are not in the declared vocabulary, so they
     are units of their own that no engine value in this turn carries */
  for (const said of ["Rest 155 seconds.", "Add 155 kilograms.", "You weigh 2262 stone.",
    "That is 2360 furlongs."]) {
    assert.ok(turn.untraceable(said).length > 0, "an unknown noun was read as 'no unit': " + said);
  }
  /* and the declared vocabulary still maps its own synonyms */
  assert.deepEqual(T.parseUnits("155 grams").map((p) => p.unit), ["g"]);
  assert.deepEqual(T.parseUnits("155 g").map((p) => p.unit), ["g"]);
  assert.deepEqual(T.parseUnits("180.4 lbs").map((p) => p.unit), ["lb"]);
  assert.deepEqual(T.parseUnits("1.19 pounds a week").map((p) => p.unit), ["lb/wk"]);
  assert.deepEqual(T.parseUnits("155 seconds").map((p) => p.unit), ["!seconds"]);
});

/* C5 review round 2, C9 / surviving mutant S1. The rule "a date never licenses a
   bare number" was real but unasserted: deleting it killed no test. */
test("a date tag licenses a date, never a bare quantity", async () => {
  const turn = coach().openTurn("turn-date");
  await turn.call.today_plan({});
  /* the day is tagged `date` and its components are 2030 / 02 / 04 */
  assert.equal(turn.results[0].values.day.unit, "date");
  /* read as a date, they are fine */
  assert.deepEqual(turn.untraceable("The plan is for 2030-02-04."), []);
  /* read as anything else, they are not */
  for (const said of ["Add 2030 weekly sets.", "Do 4 sets.", "Eat 2030 calories.", "You have 4 reps left."]) {
    assert.ok(turn.untraceable(said).length > 0, "a date component licensed a quantity: " + said);
  }
  /* THE BARE CASE, which is the mutant: a date component spoken with no unit and
     no field word at all. `date` is deliberately absent from BARE_SPEAKABLE, and
     putting it back turns this RED. */
  assert.equal(T.BARE_SPEAKABLE.has("date"), false, "a date became bare-speakable");
  assert.deepEqual(T.parseUnits("Give me 2030.").map((p) => p.unit), [null], "the probe is not a bare number");
  assert.deepEqual(turn.untraceable("Give me 2030."), ["2030"],
    "a bare number borrowed its provenance from a date");
  assert.deepEqual(turn.untraceable("Do 2030 of them."), ["2030"]);
  /* and the same sentence shape IS allowed for a bare-speakable unit, so the
     test measures the date exclusion and not a blanket refusal of bare numbers */
  const sets = coach().openTurn("turn-bare-ok");
  await sets.call.request_replan({ fact: "volume" });
  assert.equal(sets.results[0].values.addWeeklySets.unit, "set");
  assert.deepEqual(sets.untraceable("Give me 6."), []);
});

test("every interpolation declares the unit it speaks into", () => {
  const kcal = T.num("t", "energy.calorieTarget.lo", 2262, "kcal");
  assert.equal(C.d(kcal, "kcal"), "2262");
  assert.throws(() => C.d(kcal), /declare the unit/);
  assert.throws(() => C.d(kcal, ""), /declare the unit/);
  assert.throws(() => C.d(kcal, "g"), /COACH_UNIT_MISMATCH/);
  /* a blank value still takes the blank branch rather than throwing */
  assert.equal(C.d(T.blank("t", "energy.currentRate.scale", "lb/wk", "no rate"), "lb/wk"), "");
});

/* ------------------------------------------------------------------ C5 ---- */

/* C5 review round 1, C5. `untraceable()` is exported and an adapter is free to
   call it with a POOLED results array; the two turn guards in allowedTokens()
   are what stop turn A's provenance licensing turn B's sentence. Deleting either
   guard left 46/46 green at e576905. This is the test that kills that mutant:
   it is measured, not asserted — ["2262"] with the guards, [] without. */
test("the turn guards are load-bearing: a POOLED results array cannot lend provenance", async () => {
  const c = coach();
  const a = c.openTurn("A");
  await a.call.today_plan({});                    /* licenses kcal:2262 in turn A */
  const b = c.openTurn("B");
  await b.call.cannot_change_via_coach({ topic: "phase" });   /* licenses no number at all */

  const pooled = a.results.concat(b.results);
  assert.deepEqual(T.untraceable("Eat 2262 calories.", pooled, "B"), ["2262"],
    "turn B borrowed turn A's provenance out of a pooled array");
  /* the same pooled array scoped to A does license it — so the test is measuring
     the guard, not the absence of the number */
  assert.deepEqual(T.untraceable("Eat 2262 calories.", pooled, "A"), []);

  /* Each guard is killed on its own, so neither can be deleted quietly.
     INNER (per tag): a result envelope forged with turn B's id whose tagged
     values still carry turn A's. */
  const smuggled = { ...a.results[0], turn_id: "B" };
  assert.deepEqual(T.untraceable("Eat 2262 calories.", [smuggled], "B"), ["2262"],
    "a tag from another turn licensed this one");

  /* OUTER (per result): the mirror image — a result that BELONGS to turn A,
     carrying one tag mis-stamped for turn B. A result from another turn is not
     this turn's evidence whatever its contents claim, so the outer guard drops
     the whole envelope before the inner one ever sees the tag. */
  const crossStamped = { ...a.results[0], turn_id: "A",
    values: { kcalLo: { ...a.results[0].values.kcalLo, turn_id: "B" } } };
  assert.deepEqual(T.untraceable("Eat 2262 calories.", [crossStamped], "B"), ["2262"],
    "a result belonging to turn A licensed turn B because one tag inside it was stamped B");
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
