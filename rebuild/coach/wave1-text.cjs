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
/* COACH V1: `list` and the TEMPLATES object MOVED, unchanged, to coach-intents.cjs (WAVE1_TEMPLATES), which the
   page bundles; this file keeps the demo driver, which reads its script off disk. */
const I = require("./coach-intents.cjs");
const list = I.list;

const SCRIPT_PATH = path.join(__dirname, "scripts", "wave1-script.json");
function loadScript(file) {
  return JSON.parse(fs.readFileSync(file || SCRIPT_PATH, "utf8"));
}

const TEMPLATES = I.WAVE1_TEMPLATES;

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
