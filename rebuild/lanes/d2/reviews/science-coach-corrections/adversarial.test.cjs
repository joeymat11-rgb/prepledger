"use strict";
// PM394: invented supplied views/responses only, through the actual two modules.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const T = require("../../../../coach/tools.cjs");
const C = require("../../../../coach/coach-text.cjs");

const viewOf = targets => Object.freeze({
  today: "2044-06-12", statusFace: { word: "Review", cause: "Invented observation" },
  marchingOrder: { ifText: "If a question remains", thenText: "Ask it", targetLine: "Invented plan" },
  workout: { title: "Invented circuit", available: true }, ...targets,
});

test("changing target availability across turns preserves zero, decimals and independent fields", async () => {
  let view = viewOf({ calorieTarget: { lo: 0, hi: 2048.125 }, proteinTarget: { g: 0 } });
  const coach = T.createCoachTools({ today: { today: view.today, read: () => view } });
  const first = await C.answerOne(coach, { id: "first", intent: "today_plan" }, {});
  assert.match(first.answer, /between 0 and 2048\.125 calories/);
  assert.match(first.answer, /at least 0 grams/);
  assert.deepEqual(first.untraceable, []);

  view = viewOf({ calorieTarget: { lo: 2071.25 }, proteinTarget: null,
    workout: { title: "Invented rest choice", available: false, unavailableReason: "Invented missing workout" } });
  for (const intent of ["calories", "protein"]) {
    const answer = await C.answerOne(coach, { id: intent, intent }, {});
    const v = answer.results[0].values;
    assert.equal(v.kcalLo.value, 2071.25);
    assert.equal(v.kcalLo.source, "energy.calorieTarget.lo");
    assert.equal(v.kcalLo.unit, "kcal");
    assert.equal(v.kcalLo.turn_id, answer.turn_id);
    assert.equal(v.kcalHi.value, null); assert.equal(v.proteinG.value, null);
    assert.equal(v.workoutTitle.value, "Invented rest choice");
    assert.equal(v.workoutAvailable.value, false);
    assert.equal(v.workoutRefusal.value, "Invented missing workout");
    assert.match(answer.answer, /do not have a (calorie band|protein target)/);
    assert.deepEqual(answer.untraceable, []);
  }

  view = viewOf({ calorieTarget: null, proteinTarget: { g: 147.25 } });
  const last = await C.answerOne(coach, { id: "last", intent: "today_plan" }, {});
  assert.match(last.answer, /do not have a calorie band/);
  assert.match(last.answer, /at least 147\.25 grams/);
  assert.equal(last.results[0].values.proteinG.value, 147.25);
  assert.equal(last.results[0].values.proteinG.source, "energy.proteinTarget.g");
  assert.equal(last.results[0].values.proteinG.unit, "g");
  assert.equal(last.results[0].values.proteinG.turn_id, last.turn_id);
  assert.deepEqual(last.untraceable, []);
  assert.equal(T.traceable("Between 0 and 2048.125 calories.", last.results, last.turn_id), false);
  assert.deepEqual(coach.issuedProposals(), []);
  assert.deepEqual(coach.acceptedProposals(), []);
  assert.deepEqual(coach.consentLedger(), []);
});

test("whole-view exceptions reach each answering intent without an invented unavailable target", async () => {
  const sentinel = new Error("Invented whole-view failure");
  const coach = T.createCoachTools({ today: { read() { throw sentinel; } } });
  for (const intent of ["today_plan", "calories", "protein"]) {
    await assert.rejects(C.answerOne(coach, { id: intent, intent }, {}), error => error === sentinel);
  }
});

test("unsuccessful invented acceptance responses never use the acknowledgment template", async () => {
  for (const yes of [false, true]) {
    let supplied;
    const coach = { openTurn(turn_id) {
      const results = [];
      return { turn_id, results, untraceable: answer => T.untraceable(answer, results, turn_id),
        call: { accept_proposal: async args => {
          supplied = args;
          const reason = "Invented response not acknowledged. Nothing changed.";
          const result = { ok: false, turn_id,
            unavailable: { code: "INVENTED_RESPONSE_UNAVAILABLE", reason },
            values: { reason: T.text(turn_id, "invented.response.reason", reason) } };
          results.push(result); return result;
        } } };
    } };
    const answer = await C.answerOne(coach, { id: "unsuccessful", intent: "accept_replan_volume", yes },
      { lastProposalId: "invented-proposal" });
    assert.deepEqual(supplied, { proposal_id: "invented-proposal", confirmed: yes });
    assert.equal(answer.answer, "Invented response not acknowledged. Nothing changed.");
    assert.doesNotMatch(answer.answer, /acceptance was acknowledged|engine's stated reason|reason durably saved/i);
    assert.deepEqual(answer.untraceable, []);
  }
});

test.after(() => {
  const loaded = Object.keys(require.cache).map(p => path.relative(process.cwd(), p).replaceAll("\\", "/")).sort();
  const expected = ["rebuild/coach/tools.cjs", "rebuild/coach/coach-text.cjs",
    "rebuild/lanes/d2/reviews/science-coach-corrections/adversarial.test.cjs"].sort();
  fs.writeFileSync(path.join(__dirname, "adversarial-module-cache.json"), JSON.stringify({ loaded }, null, 2) + "\n");
  assert.deepEqual(loaded, expected, "only the two licensed file modules and this review test loaded");
});
