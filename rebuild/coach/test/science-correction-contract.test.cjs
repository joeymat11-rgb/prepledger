"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const T = require("../tools.cjs");
const C = require("../coach-text.cjs");

// Entirely invented supplied view. No real Today, engine, client or proposal path.
function suppliedView(targets = {}) {
  return {
    today: "2044-06-12", statusFace: { word: "Review", cause: "Invented observation" },
    marchingOrder: { ifText: "If the plan needs review", thenText: "Review it", targetLine: "Invented plan" },
    workout: { title: "Invented circuit", available: true }, ...targets,
  };
}
const coachFor = view => T.createCoachTools({ today: { today: view.today, read: () => view } });

test("missing target objects stay unknown while the supplied workout survives", async () => {
  const view = suppliedView(), coach = coachFor(view), turn = coach.openTurn("missing-targets");
  const result = await turn.call.today_plan();
  assert.equal(result.ok, true);
  for (const key of ["kcalLo", "kcalHi", "proteinG"]) {
    assert.equal(result.values[key].value, null);
    assert.equal(result.values[key].blank, true);
    assert.equal(result.values[key].display, "");
  }
  assert.equal(result.values.workoutTitle.value, view.workout.title);
  const answer = await C.answerOne(coach, { id: "missing", intent: "today_plan" }, {});
  assert.match(answer.answer, /Invented circuit/);
  assert.match(answer.answer, /do not have a calorie band/);
  assert.match(answer.answer, /do not have a protein target/);
  assert.deepEqual(answer.untraceable, []);
});

test("null, partial and nonfinite targets preserve every other supplied field", async t => {
  const cases = [
    { name: "null targets", targets: { calorieTarget: null, proteinTarget: null }, want: [null, null, null] },
    { name: "calories only", targets: { calorieTarget: { lo: 2137, hi: 2291 } }, want: [2137, 2291, null] },
    { name: "protein only", targets: { proteinTarget: { g: 143 } }, want: [null, null, 143] },
    { name: "null calories", targets: { calorieTarget: null, proteinTarget: { g: 143 } }, want: [null, null, 143] },
    { name: "null protein", targets: { calorieTarget: { lo: 2137, hi: 2291 }, proteinTarget: null }, want: [2137, 2291, null] },
    { name: "partial band", targets: { calorieTarget: { hi: 2291 }, proteinTarget: { g: 143 } }, want: [null, 2291, 143] },
    { name: "empty objects", targets: { calorieTarget: {}, proteinTarget: {} }, want: [null, null, null] },
    { name: "nonfinite", targets: { calorieTarget: { lo: NaN, hi: Infinity }, proteinTarget: { g: -Infinity } }, want: [null, null, null] },
    { name: "no coercion", targets: { calorieTarget: { lo: null, hi: "2291" }, proteinTarget: { g: "143" } }, want: [null, null, null] },
    { name: "partly nonfinite", targets: { calorieTarget: { lo: 2137, hi: NaN }, proteinTarget: { g: 143 } }, want: [2137, null, 143] },
  ];
  for (const scenario of cases) await t.test(scenario.name, async () => {
    const view = suppliedView(scenario.targets), before = structuredClone(view), coach = coachFor(view);
    const answer = await C.answerOne(coach, { id: scenario.name, intent: "today_plan" }, {});
    const result = answer.results[0], v = result.values;
    const specs = [["kcalLo", "energy.calorieTarget.lo", "kcal"],
      ["kcalHi", "energy.calorieTarget.hi", "kcal"], ["proteinG", "energy.proteinTarget.g", "g"]];
    specs.forEach(([key, source, unit], index) => {
      const tag = v[key], expected = scenario.want[index];
      assert.equal(tag.value, expected); assert.equal(tag.source, source);
      assert.equal(tag.unit, unit); assert.equal(tag.turn_id, answer.turn_id);
      assert.equal(tag.display, expected === null ? "" : String(expected));
      assert.equal(!!tag.blank, expected === null);
    });
    assert.equal(v.workoutTitle.value, view.workout.title);
    assert.equal(v.workoutAvailable.value, true);
    assert.equal(v.statusWord.value, view.statusFace.word);
    assert.equal(v.ifText.value, view.marchingOrder.ifText);
    assert.equal(v.thenText.value, view.marchingOrder.thenText);
    assert.equal(v.targetLine.value, view.marchingOrder.targetLine);
    assert.match(answer.answer, /Invented circuit/);
    assert.doesNotMatch(answer.answer, /NaN|Infinity|undefined/);
    if (scenario.want[0] === null || scenario.want[1] === null) assert.match(answer.answer, /do not have a calorie band/);
    else assert.match(answer.answer, /2137 and 2291 calories/);
    if (scenario.want[2] === null) assert.match(answer.answer, /do not have a protein target/);
    else assert.match(answer.answer, /at least 143 grams/);
    assert.deepEqual(answer.untraceable, []); assert.deepEqual(view, before, "view is not repaired or mutated");
  });
});

test("finite values remain exact and licensed only in their own turn and unit", async () => {
  const view = suppliedView({ calorieTarget: { lo: 2137.5, hi: 2291.25 }, proteinTarget: { g: 143.5 } });
  const coach = coachFor(view), turn = coach.openTurn("finite-turn"), result = await turn.call.today_plan();
  assert.equal(result.values.kcalLo.value, 2137.5); assert.equal(result.values.kcalHi.value, 2291.25);
  assert.equal(result.values.proteinG.value, 143.5);
  assert.equal(turn.traceable(C.TEMPLATES.today_plan(result.values)), true);
  assert.equal(turn.traceable("At least 143.5 grams."), true);
  assert.equal(turn.traceable("Eat 143.5 calories."), false);
  assert.equal(coach.openTurn("other-turn").traceable("At least 143.5 grams."), false);
  assert.equal(T.traceable("At least 143.5 grams.", [result], "other-turn"), false);
  assert.throws(() => C.TEMPLATES.protein({ proteinG: result.values.kcalLo }), /COACH_UNIT_MISMATCH/);
  const zero = await coachFor(suppliedView({ calorieTarget: { lo: 0, hi: 0 }, proteinTarget: { g: 0 } }))
    .openTurn("explicit-zero").call.today_plan();
  assert.equal(zero.values.proteinG.value, 0); assert.equal(zero.values.proteinG.display, "0");
  assert.equal(zero.values.kcalLo.value, 0, "explicit finite values are not reinterpreted by the coach");
});

test("protein is provisional without changing the at-least instruction", async () => {
  const coach = coachFor(suppliedView({ calorieTarget: { lo: 2137, hi: 2291 }, proteinTarget: { g: 143 } }));
  for (const intent of ["protein", "today_plan"]) {
    const answer = await C.answerOne(coach, { id: intent, intent }, {});
    assert.match(answer.answer, /at least 143 grams/i); assert.match(answer.answer, /provisional/i);
    assert.deepEqual(answer.untraceable, []);
  }
  const protein = await C.answerOne(coach, { id: "protein-input", intent: "protein" }, {});
  assert.match(protein.answer, /available lean-mass input/);
  assert.match(protein.answer, /not a measured personal minimum/);
});

test("all five tier-three topics remain refused with no consent or engine action", async () => {
  const forbidden = () => { throw new Error("Unexpected invented-world action"); };
  const coach = T.createCoachTools({ today: { read: forbidden, stateFromOps: forbidden, engine: {} },
    consent: { respond: forbidden, recordIssuance: forbidden } });
  const topics = ["phase", "calorie_floor", "protein_floor", "progression_rules", "consent_policy"];
  assert.deepEqual(T.TIER3_TOPICS, topics);
  for (const topic of topics) {
    const answer = await C.answerOne(coach, { id: topic, intent: "tier3_" + topic }, {});
    const result = answer.results[0];
    assert.equal(result.tier, T.TIER.REFUSED); assert.equal(result.refused, true);
    assert.equal(result.state_unchanged, true);
    assert.match(answer.answer, /doesn't change your plan/);
    assert.deepEqual(answer.untraceable, []);
    if (topic === "phase") assert.match(answer.answer, /require review in settings/);
    if (topic === "calorie_floor") assert.match(answer.answer, /not a proved personal safety boundary/);
    if (topic === "protein_floor") assert.match(answer.answer, /provisional.*available lean-mass input/);
  }
  assert.deepEqual(coach.acceptedProposals(), []); assert.deepEqual(coach.consentLedger(), []);
});

test("engine-owned reason strings pass through verbatim and whole-view failures propagate", async () => {
  const reason = "Invented engine reason: 143 grams.", state = Object.freeze({ invented: true });
  const coach = T.createCoachTools({ today: { read: () => suppliedView(), stateFromOps: () => state,
    engine: { proteinTarget: supplied => { assert.equal(supplied, state); return { why: reason }; } } } });
  const turn = coach.openTurn("engine-reason"), result = await turn.call.why_this_instruction({ topic: "protein" });
  assert.equal(result.values.body.value, reason); assert.equal(result.values.body.display, reason);
  assert.equal(result.values.body.source, "energy.proteinTarget.why"); assert.equal(turn.traceable(reason), true);
  const error = new Error("Invented view failure");
  const failed = T.createCoachTools({ today: { read() { throw error; } } });
  await assert.rejects(failed.openTurn("failed-view").call.today_plan(), err => err === error);
  await assert.rejects(coachFor(nullView()).openTurn("invalid-view").call.today_plan(), TypeError);
  function nullView() { return { today: "2044-06-12", calorieTarget: null, proteinTarget: null }; }
});

test("acceptance rendering describes an acknowledgement, not durable application or a stored reason", async () => {
  // Invented response envelopes only. Do not invoke the real proposal/consent path.
  for (const reason of ["Invented proposal reason: 6 sets.", null]) {
    let callArgs;
    const coach = { openTurn(turn_id) {
      const results = [];
      return { turn_id, results, untraceable: answer => T.untraceable(answer, results, turn_id),
        call: { accept_proposal: async args => {
          callArgs = args;
          const result = Object.freeze({ ok: true, turn_id, recorded: true,
            values: Object.freeze({
              reason: reason === null ? T.blank(turn_id, "invented.issued.reason", "text") : T.text(turn_id, "invented.issued.reason", reason),
              opId: T.text(turn_id, "invented.response.op_id", "invented-operation"),
            }) });
          results.push(result); return result;
        } } };
    } };
    const answer = await C.answerOne(coach, { id: "accepted", intent: "accept_replan_volume", yes: true },
      { lastProposalId: "invented-proposal" });
    assert.deepEqual(callArgs, { proposal_id: "invented-proposal", confirmed: true });
    assert.match(answer.answer, /acceptance was acknowledged/);
    assert.match(answer.answer, /does not confirm that the plan was applied or the reason durably saved/);
    if (reason !== null) assert(answer.answer.endsWith(reason), "reason text is unchanged");
    assert.doesNotMatch(answer.answer, /reason stored with it|plan has been|programme has been/);
    assert.equal(answer.results[0].values.opId.value, "invented-operation");
    assert.deepEqual(answer.untraceable, []);
  }
});
