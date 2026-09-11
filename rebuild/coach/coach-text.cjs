"use strict";

/* coach-text.cjs — the TEXT-FIRST coach the brief sequences before the voice
 * layer. There is NO model in here and no network: a fixed script of questions
 * (scripts/questions.json) is routed to a fixed intent, the intent calls the
 * tools, and the answer is rendered by a TEMPLATE that can only interpolate
 * tagged tool values.
 *
 * THE TEMPLATES CONTAIN NO NUMBERS. Not "about 2,300", not "roughly a pound" —
 * no digit appears in any template string, and templates.test proves it by
 * scanning their own source. Every figure in a transcript therefore arrives
 * through d(), which prints a tagged value's `display` and nothing else, and
 * tools.untraceable() can then decide mechanically whether the sentence is
 * allowed. That is the whole point: this prototype is the bar a later
 * GPT-Live-1 adapter has to clear, expressed as running code rather than prose.
 *
 * Blank is unknown. A tagged value with no display takes the template's blank
 * branch — a sentence that says the app does not know — never a zero, never a
 * filled-in default.
 */

const fs = require("node:fs");
const path = require("node:path");
const T = require("./tools.cjs");

/* EVERY INTERPOLATION DECLARES ITS UNIT (C5 review round 1, C2). `d(tag, "kcal")`
   says "a calorie figure goes here", and a tag that is not a calorie figure is a
   bug in the template, not a sentence to be rendered. That is the answer side of
   the unit-keyed traceability check in tools.cjs: the template says what field
   the slot is, the tag says what field the number is, and the two must agree
   before a single digit is printed. */
const d = (tag, unit) => {
  if (typeof unit !== "string" || !unit) {
    throw new TypeError("d(): every interpolation must declare the unit it speaks into");
  }
  if (!tag || typeof tag.display !== "string" || tag.display === "") return "";
  if (tag.unit !== unit) {
    throw new Error("COACH_UNIT_MISMATCH: a " + String(tag.unit) + " value was interpolated into a " + unit + " slot ("
      + String(tag.source) + ")");
  }
  return tag.display;
};
const has = (tag) => !!(tag && typeof tag.display === "string" && tag.display !== "");
const join = (parts) => parts.filter((p) => typeof p === "string" && p !== "").join("").replace(/\s+/g, " ").trim();

/* Every template below is a pure function of one turn's tool results. */
const TEMPLATES = Object.freeze({
  today_plan: (v) => join([
    has(v.workoutTitle) ? "Today is " + d(v.workoutTitle, "text") + ". " : "There is no training session on the board today. ",
    has(v.kcalLo) && has(v.kcalHi)
      ? "Eat between " + d(v.kcalLo, "kcal") + " and " + d(v.kcalHi, "kcal") + " calories"
      : "I do not have a calorie band for you",
    has(v.proteinG) ? ", with at least " + d(v.proteinG, "g") + " grams of protein. " : ". ",
    has(v.ifText) && has(v.thenText) ? d(v.ifText, "text") + ": " + d(v.thenText, "text") + "." : "",
  ]),
  calories: (v) => join([
    has(v.kcalLo) && has(v.kcalHi)
      ? "Between " + d(v.kcalLo, "kcal") + " and " + d(v.kcalHi, "kcal") + " calories today."
      : "I do not have a calorie band for you today, so I am not going to make one up.",
  ]),
  protein: (v) => join([
    has(v.proteinG)
      ? "At least " + d(v.proteinG, "g") + " grams. It is a floor, not a bullseye — over it is not a miss."
      : "I do not have a protein target for you today.",
  ]),
  why_calories: (v) => join([has(v.body) ? d(v.body, "text") : "The engine gave no reasoning for that number.",
    has(v.weekly) ? " " + d(v.weekly, "text") : ""]),
  why_instruction: (v) => join([
    has(v.title) ? d(v.title, "text") + ". " : "",
    has(v.body) ? d(v.body, "text") : "The engine has nothing to change right now.",
  ]),
  why_maintenance: (v) => join([has(v.body) ? d(v.body, "text") : "Maintenance is not measured yet."]),
  status: (v) => join([has(v.word) ? d(v.word, "text") + ". " : "", has(v.body) ? d(v.body, "text") : ""]),
  levers: (v) => join((v.levers || []).map((l) =>
    d(l.label, "text") + ": " + d(l.zone, "text") + ", " + d(l.detail, "text") + ". ")),
});

const TEMPLATES_2 = Object.freeze({
  weight_trend: (v) => join([
    has(v.trend) ? "Your trend weight is " + d(v.trend, "lb") + " pounds. " : "There is no trend weight on this device yet. ",
    has(v.rate) && has(v.rateLo) && has(v.rateHi) && has(v.n)
      ? "You are losing about " + d(v.rate, "lb/wk") + " pounds a week, somewhere between " + d(v.rateLo, "lb/wk") + " and "
        + d(v.rateHi, "lb/wk") + ", measured across " + d(v.n, "reading") + " readings from " + d(v.from, "text") + " to " + d(v.to, "text") + ". "
      : "The rate is not measured yet, so I have no weekly number for you. ",
    has(v.lastReadISO) ? "Your last reading was " + d(v.lastReadISO, "text") + "." : "No reading is stored yet.",
  ]),
  current_set: (v) => join([
    d(v.liftLabel, "text") + ", set " + d(v.setPosition, "set") + " of " + d(v.setCount, "set") + ". ",
    has(v.prescription) ? d(v.prescription, "text") + ". " : "",
    has(v.effort) ? d(v.effort, "text") + " " : "",
    has(v.setup) ? d(v.setup, "text") + "." : "",
  ]),
  next_set: (v) => join([
    "Next is " + d(v.liftLabel, "text") + ", set " + d(v.position, "set") + " of " + d(v.count, "set") + ". ",
    has(v.prescription) ? d(v.prescription, "text") + ". " : "",
    has(v.effort) ? d(v.effort, "text") : "",
  ]),
  last_comparable: (v) => join([has(v.line) ? d(v.line, "text") + "." : ""]),
  /* The check-in read-back is the model's own: the approved question wording
     beside the athlete's own answer, plus the engine-consequence sentence. This
     adds no adjective, no score and no judgement. */
  checkin: (v) => join([
    v.lines && v.lines.length
      ? (has(v.provenance) ? d(v.provenance, "text") + ". " : "") + v.lines.map((l) => d(l, "text")).join("; ") + ". " + d(v.note, "text")
      : "Nothing is recorded for the check-in on " + d(v.date, "date") + ". " + d(v.note, "text"),
    has(v.sleepRecordHours) && has(v.sleepRecordDate)
      ? " Your sleep record already has the night of " + d(v.sleepRecordDate, "date") + ": " + d(v.sleepRecordHours, "h")
        + " hours. I would ask you to confirm that rather than ask again."
      : "",
  ]),
  /* After a real save, state the actual plan consequence — "saved" alone is not
     evidence the engine used the answer (approved handoff). */
  recorded: (v) => join([
    "Recorded. ",
    v.lines && v.lines.length ? "What went down: " + v.lines.map((l) => d(l, "text")).join("; ") + ". " : "",
    has(v.consequence) ? d(v.consequence, "text") : "",
  ]),
  proposal: (v) => join([
    "The engine has a proposal. ",
    has(v.addWeeklySets) && has(v.muscle) && has(v.weeklySetsNow)
      ? d(v.muscle, "text") + " sits at " + d(v.weeklySetsNow, "set") + " weekly sets, and it proposes adding "
        + d(v.addWeeklySets, "set") + " sets. " : "",
    has(v.reason) ? "Its reason: " + d(v.reason, "text") + " " : "",
    "Do you want it? Until you say yes, nothing changes.",
  ]),
  accepted: (v) => join([
    "Recorded. ",
    has(v.reason) ? "The reason stored with it is the engine's own: " + d(v.reason, "text") : "",
  ]),
  declined: () => "Then nothing changes. This conversation doesn't change your plan.",
  refused: (v) => join([has(v.explanation) ? d(v.explanation, "text") : "", " This conversation doesn't change your plan."]),
  /* A refusal states what happened once. The engine's and the client's own
     refusals already end in their own words, so the closing sentence is added
     only when it is not already there. */
  unavailable: (u) => {
    const said = typeof u.reason === "string" && u.reason ? u.reason : "I cannot answer that from what the app holds.";
    return join([said, /nothing chang/i.test(said) ? "" : " Nothing changed."]);
  },
});
const ALL_TEMPLATES = Object.freeze({ ...TEMPLATES, ...TEMPLATES_2 });

/* ---------------------------------------------------------- the routing -- */

/* One intent, one fixed sequence of tool calls, one template. No matching, no
   inference, no free-form generation — a scripted stand-in whose whole job is to
   pin down the loop a real adapter has to reproduce. */
const READ_INTENTS = Object.freeze({
  today_plan: { tool: "today_plan", args: {}, template: "today_plan" },
  calories: { tool: "today_plan", args: {}, template: "calories" },
  protein: { tool: "today_plan", args: {}, template: "protein" },
  why_calories: { tool: "why_this_instruction", args: { topic: "calories" }, template: "why_calories" },
  why_instruction: { tool: "why_this_instruction", args: { topic: "instruction" }, template: "why_instruction" },
  why_maintenance: { tool: "why_this_instruction", args: { topic: "maintenance" }, template: "why_maintenance" },
  status: { tool: "why_this_instruction", args: { topic: "status" }, template: "status" },
  levers: { tool: "why_this_instruction", args: { topic: "levers" }, template: "levers" },
  weight_trend: { tool: "weight_trend", args: {}, template: "weight_trend" },
  current_set: { tool: "current_set", args: {}, template: "current_set" },
  next_set: { tool: "next_set", args: {}, template: "next_set" },
  last_comparable: { tool: "last_comparable_performance", args: {}, template: "last_comparable" },
  today_checkin: { tool: "today_checkin", args: {}, template: "checkin" },
});
const FACT_INTENTS = Object.freeze({
  record_pain: "record_pain_or_soreness",
  equipment_unavailable: "equipment_unavailable_today",
  time_away: "time_away",
  answer_checkin: "answer_checkin",
});
const TIER3_INTENTS = Object.freeze({
  tier3_phase: "phase", tier3_calorie_floor: "calorie_floor", tier3_protein_floor: "protein_floor",
  tier3_progression_rules: "progression_rules", tier3_consent_policy: "consent_policy",
});

async function answerOne(coach, question, memory, templates) {
  const tpl = templates || ALL_TEMPLATES;
  const turn = coach.openTurn("turn-" + question.id);
  const say = (textOut) => ({ id: question.id, ask: question.ask, turn_id: turn.turn_id,
    answer: textOut, results: turn.results.slice(),
    untraceable: turn.untraceable(textOut) });

  const read = READ_INTENTS[question.intent];
  if (read) {
    const r = await turn.call[read.tool](read.args);
    return say(r.ok ? tpl[read.template](r.values) : tpl.unavailable(r.unavailable));
  }
  if (FACT_INTENTS[question.intent]) {
    /* The harness sets `confirmed` — never the coach, and never the model — and
       only from its own record of the spoken yes. */
    const args = Object.assign({}, question.args, { confirmed: question.yes === true });
    const r = await turn.call[FACT_INTENTS[question.intent]](args);
    return say(r.ok ? tpl.recorded(r.values) : tpl.unavailable(r.unavailable));
  }
  if (TIER3_INTENTS[question.intent]) {
    const r = await turn.call.cannot_change_via_coach({ topic: TIER3_INTENTS[question.intent] });
    return say(tpl.refused(r.values));
  }
  if (question.intent === "request_replan_volume" || question.intent === "request_replan_volume_no_yes") {
    const r = await turn.call.request_replan({ fact: "volume" });
    if (!r.ok) return say(tpl.unavailable(r.unavailable));
    memory.lastProposalId = r.proposal.proposal_id;
    const asked = tpl.proposal(r.values);
    return say(question.intent === "request_replan_volume_no_yes" ? asked + " " + tpl.declined() : asked);
  }
  if (question.intent === "accept_replan_volume") {
    const r = await turn.call.accept_proposal({ proposal_id: memory.lastProposalId, confirmed: question.yes === true });
    return say(r.ok ? tpl.accepted(r.values) : tpl.unavailable(r.unavailable));
  }
  throw new Error("COACH_UNKNOWN_INTENT:" + question.intent);
}

/* --------------------------------------------------------- the harness -- */

const SCRIPT_PATH = path.join(__dirname, "scripts", "questions.json");
function loadScript(file) {
  return JSON.parse(fs.readFileSync(file || SCRIPT_PATH, "utf8"));
}

/* Runs the whole script and returns a transcript plus the traceability verdict
   for every turn. Nothing here decides anything: the verdict is computed by
   tools.untraceable(), the same function the tests call. */
async function runScript(coach, options) {
  const opts = options || {};
  const script = opts.script || loadScript(opts.scriptPath);
  const templates = opts.templates || ALL_TEMPLATES;
  const memory = {};
  const turns = [];
  for (const question of script.questions) turns.push(await answerOne(coach, question, memory, templates));
  const text = turns.map((t) => t.ask + "\n" + t.answer).join("\n\n");
  return {
    turns, text,
    untraceable: turns.filter((t) => t.untraceable.length).map((t) => ({ id: t.id, tokens: t.untraceable })),
    charter: T.charterViolations(text),
  };
}

/* The per-turn context budget the brief demands ("send only what the question
   needs"). It is measured here, not asserted: a turn's context is exactly the
   question plus the tool results it actually called. */
function turnContextBytes(turn) {
  return Buffer.byteLength(JSON.stringify({ ask: turn.ask, results: turn.results }), "utf8");
}

module.exports = {
  ALL_TEMPLATES, TEMPLATES, TEMPLATES_2, READ_INTENTS, FACT_INTENTS, TIER3_INTENTS,
  answerOne, runScript, loadScript, turnContextBytes, SCRIPT_PATH, d, has, join,
};

/* Run it: node rebuild/coach/coach-text.cjs  — prints the transcript and the
   verdict. It composes the slice's REAL today adapter with no durable reading
   lane (readings: null), which is the honest offline shape: every engine number
   is real, and a weigh-in would be refused in words rather than written
   somewhere that can lose it. */
if (require.main === module) {
  const { createTodayModel } = require("../m3/w7-preview/today/today-model.cjs");
  const coach = T.createCoachTools({ today: createTodayModel({}) });
  runScript(coach).then((run) => {
    for (const turn of run.turns) {
      process.stdout.write("\n> " + turn.ask + "\n  " + turn.answer + "\n");
      if (turn.untraceable.length) process.stdout.write("  !! UNTRACEABLE: " + turn.untraceable.join(", ") + "\n");
    }
    process.stdout.write("\nturns: " + run.turns.length
      + " · untraceable turns: " + run.untraceable.length
      + " · charter violations: " + run.charter.length + "\n");
    process.exitCode = run.untraceable.length || run.charter.length ? 1 : 0;
  }).catch((error) => { process.stderr.write(String(error && error.stack) + "\n"); process.exitCode = 1; });
}
