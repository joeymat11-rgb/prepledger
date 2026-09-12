"use strict";

/* wave1-text.cjs - the five-step demo, in text, over the real local-era world.
 *
 * THERE IS NO MODEL. scripts/wave1-script.json holds the five steps the owner
 * wrote (COACH-EXPERIENCE-BRIEF.md, DECISIONS:140); this driver reads them and
 * calls tools, exactly as coach-text.cjs reads scripts/questions.json today.
 *
 * THE TEMPLATES CARRY NO DIGITS and no dash. Every figure arrives through
 * `d(tag, unit)`, which prints a tagged value's display and asserts the unit the
 * sentence is speaking into, so tools.untraceable() judges each answer
 * mechanically against that turn's own tool results.
 *
 * THE WHY IS A SLOT, not a sentence. Step 2 and step 5 both render `whyLine`,
 * which prints the engine's recorded words or the literal `not recorded`. It is
 * never composed from the plan numbers and never paraphrased.
 */

const fs = require("node:fs");
const path = require("node:path");
const T = require("./tools.cjs");
const C = require("./coach-text.cjs");
const W = require("./wave1-tools.cjs");

const d = C.d;
const has = C.has;
const join = C.join;
const list = (parts) => parts.filter((p) => p !== "").join(", ");

const SCRIPT_PATH = path.join(__dirname, "scripts", "wave1-script.json");
function loadScript(file) {
  return JSON.parse(fs.readFileSync(file || SCRIPT_PATH, "utf8"));
}

/* ------------------------------------------------------------ templates -- */

const TEMPLATES = Object.freeze({
  /* Step 1. Today's own state, through the existing read. */
  open: (v) => join([
    has(v.workoutTitle) ? "Today is " + d(v.workoutTitle, "text") + ". " : "There is no training session on the board today. ",
    has(v.statusWord) ? d(v.statusWord, "text") + ". " : "",
    "Ask me anything about it.",
  ]),

  /* Step 2. The day read back, with the why SLOT beside it. */
  today_with_why: (v, why) => join([
    has(v.workoutTitle) ? d(v.workoutTitle, "text") + ". " : "",
    has(v.kcalLo) && has(v.kcalHi)
      ? "Eat between " + d(v.kcalLo, "kcal") + " and " + d(v.kcalHi, "kcal") + " calories" : "",
    has(v.proteinG) ? ", with at least " + d(v.proteinG, "g") + " grams of protein. " : ". ",
    has(v.ifText) && has(v.thenText) ? d(v.ifText, "text") + ": " + d(v.thenText, "text") + ". " : "",
    "Why: ", d(why.why, "text"), ".",
  ]),

  /* Step 5. The same slot, alone. One sentence. */
  why_only: (why) => join(["Why: ", d(why.why, "text"), "."]),

  /* Step 3, the recall. */
  machine_settings: (v) => join([
    v.settings.length
      ? v.settings.map((s) => d(s.name, "text") + " " + d(s.value, "text")).join(", ") + ". "
      : "",
    has(v.cues) ? d(v.cues, "text") + ". " : "",
    "That is what you told me, and I kept it.",
  ]),

  /* Step 3, the capture. His words back, unchanged. */
  recorded_settings: (v) => join([
    "Kept: ",
    v.settings.map((s) => d(s.name, "text") + " " + d(s.value, "text")).join(", "),
    ". I will read it back next time you ask.",
  ]),

  /* Step 4, the confirmation aloud, with the next set named. */
  /* The figures sit beside the units the tags declare: a set count next to the
     word "set", a load next to "lb", a rep count next to "reps". The effort is
     the ACCEPTED layer's own sentence (gym-model.mjs effortWords), quoted, so
     the coach never restates a reserve in words of its own. */
  logged: (v) => join([
    "Logged set ", d(v.setNumber, "set"), ". ",
    d(v.load, "lb"), " lb for ", d(v.reps, "rep"), " reps, ",
    d(v.effort, "text"), ". ",
    has(v.nextLift) ? "Next is " + d(v.nextLift, "text") + ", set " + d(v.nextPosition, "set") + "." : "That was the last set.",
  ]),

  /* Every refusal states what happened once, in the refusing layer's own words. */
  unavailable: (u) => {
    const said = typeof u.reason === "string" && u.reason ? u.reason : "I cannot answer that from what the app holds.";
    return join([said, /nothing (is|was) recorded|unchanged|I have not recorded|I have kept nothing/i.test(said)
      ? "" : " Nothing was recorded."]);
  },
});

/* --------------------------------------------------------- the five steps -- */

/* Runs the demo end to end over ONE world, in order, and returns a transcript
   plus the traceability verdict for every step. Nothing here decides anything:
   the verdict is tools.untraceable(), the same function the C5 tests call. */
async function runDemo(tools, options = {}) {
  const tpl = options.templates || TEMPLATES;
  const script = options.script || loadScript(options.scriptPath);
  const exerciseId = options.exercise_id || script.exercise_id;
  const steps = [];

  const record = (entry, turn, answer) => {
    steps.push({ ...entry, answer, turn_id: turn.turn_id, results: turn.results.slice(),
      untraceable: turn.untraceable(answer) });
  };

  for (const step of script.steps) {
    const turn = tools.openTurn("turn-" + step.id);
    const base = { id: step.id, step: step.step, ask: step.ask, intent: step.intent };

    if (step.intent === "open") {
      const r = await turn.call.today_plan({});
      record(base, turn, r.ok ? tpl.open(r.values) : tpl.unavailable(r.unavailable));
      continue;
    }

    if (step.intent === "today_with_why") {
      const plan = await turn.call.today_plan({});
      const why = await turn.call.plan_why({ topic: step.topic });
      const answer = plan.ok
        ? tpl.today_with_why(plan.values, why.values)
        : tpl.unavailable(plan.unavailable);
      /* THE SLOT IS STRUCTURAL, not a substring: the step carries the why result
         so W3 can assert its existence without matching prose. */
      record({ ...base, why: why.values, whyRecorded: why.recorded === true, whySlot: why.whySlot === true },
        turn, answer);
      continue;
    }

    if (step.intent === "why_only") {
      const why = await turn.call.plan_why({ topic: step.topic });
      record({ ...base, why: why.values, whyRecorded: why.recorded === true, whySlot: why.whySlot === true },
        turn, tpl.why_only(why.values));
      continue;
    }

    if (step.intent === "machine_settings") {
      const r = await turn.call.machine_settings({ exercise_id: exerciseId });
      record({ ...base, found: r.ok }, turn,
        r.ok ? tpl.machine_settings(r.values) : tpl.unavailable(r.unavailable));
      continue;
    }

    if (step.intent === "record_machine_settings") {
      const r = await turn.call.record_machine_settings({ exercise_id: exerciseId,
        settings: step.settings, cues: step.cues, confirmed: step.yes === true });
      record({ ...base, recorded: r.ok === true, opId: r.opId || null }, turn,
        r.ok ? tpl.recorded_settings(r.values) : tpl.unavailable(r.unavailable));
      continue;
    }

    if (step.intent === "log_set") {
      const r = await turn.call.log_set({ load: step.load, reps: step.reps, effort: step.effort,
        confirmed: step.yes === true });
      record({ ...base, logged: r.ok === true, opId: r.opId || null }, turn,
        r.ok ? tpl.logged(r.values) : tpl.unavailable(r.unavailable));
      continue;
    }

    throw new Error("WAVE1_UNKNOWN_INTENT:" + step.intent);
  }

  const text = steps.map((s) => s.ask + "\n" + s.answer).join("\n\n");
  return {
    steps, text,
    untraceable: steps.filter((s) => s.untraceable.length).map((s) => ({ id: s.id, tokens: s.untraceable })),
    charter: T.charterViolations(text),
  };
}

module.exports = {
  TEMPLATES, ALL_TEMPLATES: TEMPLATES, loadScript, SCRIPT_PATH, runDemo,
  d, has, join, list, NOT_RECORDED: W.NOT_RECORDED,
};
