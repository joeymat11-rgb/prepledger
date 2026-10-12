"use strict";

/* coach-intents.cjs - THE COACH'S PURE LAYER (Coach v1, the S19 amend that puts the coach on the phone).
 *
 * What moved here, and why. The templates, the intent routing and answerOne() lived in coach-text.cjs, and the
 * wave-one templates in wave1-text.cjs. Both of those files read their scripts off disk (node:fs, node:path), so
 * neither can enter the page bundle, whose W6 browser boundary refuses every Node import. The pure half of each is
 * MOVED here byte for byte, with no fs, no path and no network; coach-text.cjs and wave1-text.cjs require it and
 * re-export the same names, so every caller and every test reads the very same objects it read before.
 *
 * What is new here is the page's own door: PAGE_INTENTS (the tap-to-ask questions of the Coach screen, each one
 * intent, one fixed sequence of tool calls and one template) and ask(), which runs one of them in ONE turn and
 * ships the answer only when tools.untraceable() finds every number in it among that turn's own tool results and
 * the charter finds nothing; otherwise the draft is DISCARDED and the general refusal is said instead, exactly as
 * model-adapter.md section 1 requires of a model. A later model adapter calls the same tools through the same
 * dispatch (wave1-tools.cjs) and is held to the same check; this file has no adapter and no model.
 */

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
    has(v.proteinG) ? ". The provisional protein target is at least " + d(v.proteinG, "g") + " grams. " : ". I do not have a protein target for you. ",
    has(v.ifText) && has(v.thenText) ? d(v.ifText, "text") + ": " + d(v.thenText, "text") + "." : "",
  ]),
  calories: (v) => join([
    has(v.kcalLo) && has(v.kcalHi)
      ? "Between " + d(v.kcalLo, "kcal") + " and " + d(v.kcalHi, "kcal") + " calories today."
      : "I do not have a calorie band for you today, so I am not going to make one up.",
  ]),
  protein: (v) => join([
    has(v.proteinG)
      ? "At least " + d(v.proteinG, "g") + " grams is the provisional protein target, using the available lean-mass input. It is not a measured personal minimum."
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
      /* Every figure is spoken WITH its unit — the range too. A bare between-and
         range would be a rate said as a bare number, and the checker refuses
         that by design (review round 2, C8). */
      ? "You are losing about " + d(v.rate, "lb/wk") + " pounds a week, somewhere between " + d(v.rateLo, "lb/wk") + " and "
        + d(v.rateHi, "lb/wk") + " pounds a week, measured across " + d(v.n, "reading") + " readings from " + d(v.from, "text") + " to " + d(v.to, "text") + ". "
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
    "Your acceptance was acknowledged. This response does not confirm that the plan was applied or the reason durably saved. ",
    has(v.reason) ? "The engine's stated reason: " + d(v.reason, "text") : "",
  ]),
  declined: () => "Then nothing changes. This conversation doesn't change your plan.",
  refused: (v) => join([has(v.explanation) ? d(v.explanation, "text") : "", " This conversation doesn't change your plan."]),
  /* A refusal states what happened once. The engine's and the client's own
     refusals already end in their own words, so the closing sentence is added
     only when it is not already there. */
  unavailable: (u) => {
    const said = typeof u.reason === "string" && u.reason ? u.reason : "I cannot answer that from what the app holds.";
    if (T.refusalHasOwnEnding(u.code)) return said;
    return join([said, /nothing chang|nothing is recorded yet/i.test(said) ? "" : " Nothing changed."]);
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

/* ------------------------------------------------------- wave one -- */

const list = (parts) => parts.filter((p) => p !== "").join(", ");

/* ------------------------------------------------------------ templates -- */

/* wave1-text.cjs's TEMPLATES, moved here unchanged and exported as WAVE1_TEMPLATES. */
const WAVE1_TEMPLATES = Object.freeze({
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
    if (T.refusalHasOwnEnding(u.code)) return said;
    return join([said, /nothing (is|was) recorded|unchanged|I have not recorded|I have kept nothing/i.test(said)
      ? "" : " Nothing was recorded."]);
  },
});


/* ------------------------------------------------------- the page's questions -- */

/* COACH V1. The Coach screen asks by TAP, never by free text: each chip is one of these ids, and the screen's
   own words for it live in coach-app.mjs. Every answer is one of the templates above, filled only from the tool
   results of the turn that asked. `why_weight` and `last_time` read the gym card's own prescription and its
   last comparable line for the lift on the card; `machine_seat` reads the settings the athlete kept for that lift.
   With no session composed, each says so in the tool's own words. */
const PAGE_TEMPLATES = Object.freeze({
  /* The reason under today's weight for the lift on the card: the capture's own prescription line and its reason
     cells, carried unedited. With no reason cell the sentence says the engine gave none (C-20's own words). */
  why_weight: (v) => join([
    has(v.liftLabel) ? d(v.liftLabel, "text") + ". " : "",
    has(v.prescription) ? d(v.prescription, "text") + ". " : "",
    (v.reason || []).filter(has).length
      ? (v.reason || []).filter(has).map((line) => d(line, "text")).join(" ")
      : "The engine gave no reasoning for that number.",
  ]),
});

const PAGE_INTENTS = Object.freeze({
  today_plan: { tool: "today_plan", template: "today_plan" },
  why_weight: { tool: "current_set", template: "why_weight" },
  last_time: { tool: "last_comparable_performance", template: "last_comparable" },
  weight_trend: { tool: "weight_trend", template: "weight_trend" },
  my_checkin: { tool: "today_checkin", template: "checkin" },
  machine_seat: { tool: "machine_settings", template: "machine_settings" },
});
const PAGE_INTENT_IDS = Object.freeze(Object.keys(PAGE_INTENTS));

/* ONE TAP, ONE TURN. `tools` is createWave1Tools(...) (its openTurn binds the C5 fifteen and the wave-one four into
   one results array); `liftId` answers the id of the lift on the gym card, or null. The returned `answer` is what
   the screen may show: the template's sentence when the turn is clean, or the general refusal when a number in it
   is not among the turn's own tool results or the charter forbids a phrase (the draft is kept as `draft` for the
   test, never shown). */
async function ask(tools, intent, { turnId, liftId = async () => null } = {}) {
  const spec = PAGE_INTENTS[intent];
  if (!spec) throw new Error("COACH_UNKNOWN_PAGE_INTENT:" + intent);
  if (!tools || typeof tools.openTurn !== "function") throw new TypeError("ask: the coach tools are required");
  const turn = tools.openTurn(turnId || "page-" + intent);
  let draft, answered;
  if (intent === "machine_seat") {
    const id = await liftId();
    const r = await turn.call.machine_settings({ exercise_id: typeof id === "string" ? id : "" });
    answered = r.ok === true;
    draft = r.ok ? WAVE1_TEMPLATES.machine_settings(r.values) : WAVE1_TEMPLATES.unavailable(r.unavailable);
  } else {
    const r = await turn.call[spec.tool]({});
    const tpl = { ...ALL_TEMPLATES, ...PAGE_TEMPLATES };
    answered = r.ok === true;
    draft = r.ok ? tpl[spec.template](r.values) : ALL_TEMPLATES.unavailable(r.unavailable);
  }
  const untraceable = turn.untraceable(draft);
  const charter = T.charterViolations(draft);
  const shipped = untraceable.length === 0 && charter.length === 0 && typeof draft === "string" && draft !== "";
  /* `answered` is false when the tool itself refused (no session, no lane, nothing kept): the sentence is then the
     tool's own refusal, and the screen shows it as one. */
  return Object.freeze({ intent, turn_id: turn.turn_id, results: turn.results.slice(), draft, untraceable, charter,
    shipped, answered: shipped && answered, answer: shipped ? draft : ALL_TEMPLATES.unavailable({ code: "COACH_ANSWER_DISCARDED", reason: null }) });
}

module.exports = {
  d, has, join, list, TEMPLATES, TEMPLATES_2, ALL_TEMPLATES, READ_INTENTS, FACT_INTENTS, TIER3_INTENTS, answerOne,
  WAVE1_TEMPLATES, PAGE_TEMPLATES, PAGE_INTENTS, PAGE_INTENT_IDS, ask,
};
