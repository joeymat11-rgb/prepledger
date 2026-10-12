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

/* The kernel (tool-kernel.cjs), the same objects tools.cjs re-exports: this module ships in the page. */
const T = require("./tool-kernel.cjs");
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
   results of the turn that asked. `today_plan` and `why_weight` read today's session as the engine composes it
   (today_session); `last_time` reads that session and the gym card's last sets of each of its lifts (last_times,
   batch 2); `machine_seat` reads that session and the settings already saved for each of its lifts (seat_settings,
   the seat read). With no session composed, each says so in its own plain sentence (the
   polish batch's PLAIN_REFUSALS below). */
/* WEEKLY REVIEW (S19 amend, Coach v1 piece 2, PM ruling option A). The words of the "This week" review, on the Today
   card and in the Coach answer. A lift the engine offers a new weight for says so, with the offer said in plain words
   behind Why? (batch 2, offerWhy below; it was the engine's earnReason / adoptReason). A lift it does not raise says ONE plain sentence per
   refusal code, each true to the line of rebuild/engine/native-load.cjs that refuses it (cited); a hold says one per
   held notice (today-entry.mjs noticesOf: BASIS_REPAIR_REQUIRED is "disputed", EFFECT_CONFLICT on load_basis is
   "conflict"); any other code says WEEK_FALLBACK, which names no cause. PM-approved short plain copy (:913 (5)). A
   lift's display name is prefixed as "Name: ", as for the notices; the name is the athlete's data, not copy. */
const WEEK_WORDS = Object.freeze({
  thisWeek: "This week",
  lastWeek: "Last week",
  workouts: "Workouts done: ",
  of: " of ",
  up: "ready for a new weight.",
  noLifts: "No lift finished a workout in this week.",
  liftsUnknown: "Your lifts could not be checked on this device.",
  suggestion: "Suggestion waiting on Today: ",
  trend: "Trend weight: ",
});
const WEEK_CODE_WORDS = Object.freeze({
  // native-load.cjs:232 - a new weight the athlete agreed to is queued for a later workout.
  NATIVE_LOAD_TARGET_QUEUED: "going up. The new weight you agreed to starts on a later workout.",
  // native-load.cjs:235 - this completion is the one that landed the agreed weight.
  NATIVE_LOAD_DEBUT_LANDED: "went up. This was your first workout at the new weight.",
  // native-load.cjs:326 (the first session under a changed setup) and :368 (one sighting at the top of the range).
  NATIVE_LOAD_PROVISIONAL: "not raised yet. Not enough workouts yet to judge a change.",
  // native-load.cjs:327 - the reps did not reach the top of the rep window at this load.
  NATIVE_LOAD_WINDOW_NOT_TOP: "not raised yet. You have not reached the top of your rep range at this weight.",
  // native-load.cjs:359 and :367 - hot is the opener rated at 0 in reserve, or the governor's hold on the lift.
  NATIVE_LOAD_HELD_OR_HOT: "held. Your first set was taken to failure, or this weight is on hold, so it stays where it is.",
  // native-load.cjs:366 - no next load is on file for the lift.
  NATIVE_LOAD_NO_NEXT_LOAD: "not raised. There is no heavier weight on file for this lift.",
  // native-load.cjs:329 - the first set carries no effort rating the engine can read.
  NATIVE_LOAD_EFFORT_UNRESOLVED: "not raised. The first set has no effort rating to judge from.",
  // native-load.cjs:281 - the approved S14 R4 line (today-entry.mjs NATIVE_LOAD_BODYWEIGHT_COPY), word for word.
  NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT: "bodyweight sets have no weight to agree to. Your sets are saved.",
});
const WEEK_HOLD_WORDS = Object.freeze({
  disputed: "held. A workout behind your agreed weight was corrected, so this lift is paused.",
  conflict: "held. Your working weight changed after you agreed to a new one, so this lift is paused.",
});
const WEEK_FALLBACK = "no new weight from its latest workout.";
/* COACH V1 BATCH 2 (PM, item 4): an offer's Why? in plain words, from the offer's own facts (read-tools.cjs week_review:
   its kind, its day as "Oct 6", the weight it offers and the weight it was earned at, each in pounds only when every set
   carries the same). The day is said last in its clause, so the number check reads it as the tool said it. An offer
   whose weights are not one per workout (or not in pounds) says the plain fallback, which names no figure. PM-approved
   short plain copy (:913 (5)). */
const WEEK_WHY = Object.freeze({
  did: "You did every set at ",
  topped: "You reached the top of your rep range at ",
  on: " lb on ",
  make: ". Make ",
  yours: " lb your working weight?",
  baseline: " This sets your starting point; it is not an increase. Nothing changes unless you say yes.",
  observed: " This sets your working weight to what you lifted; it is not an earned increase. Nothing changes unless you say yes.",
  earned: " Nothing changes unless you say yes; it then applies on a later workout.",
  fallback: "Your last workout here earned a new weight. Nothing changes unless you say yes.",
});
function offerWhy(lift) {
  const kind = lift.kind && lift.kind.value;
  const day = has(lift.day) ? d(lift.day, "text") : "";
  if (!day || !has(lift.targetLb)) return WEEK_WHY.fallback;
  const target = d(lift.targetLb, "lb");
  if (kind === "adopt-baseline" || kind === "adopt-observed") {
    return WEEK_WHY.did + target + WEEK_WHY.on + day + WEEK_WHY.make + target + WEEK_WHY.yours
      + (kind === "adopt-baseline" ? WEEK_WHY.baseline : WEEK_WHY.observed);
  }
  if (kind === "earn" && has(lift.baseLb)) {
    return WEEK_WHY.topped + d(lift.baseLb, "lb") + WEEK_WHY.on + day + WEEK_WHY.make + target + WEEK_WHY.yours + WEEK_WHY.earned;
  }
  return WEEK_WHY.fallback;
}
/* The review as lines: { text, why } where `why` is the offer said plainly (offerWhy above), shown behind Why?. Every number in a
   line or a why is a tool result of the turn (ask() checks the whole draft, whys included). */
function weekLines(v) {
  const lines = [{ text: v.which && v.which.value === "last" ? WEEK_WORDS.lastWeek : WEEK_WORDS.thisWeek, why: null, heading: true }];
  lines.push({ text: WEEK_WORDS.workouts + d(v.done, "?") + WEEK_WORDS.of + d(v.planned, "?") + ".", why: null });
  const lifts = Array.isArray(v.lifts) ? v.lifts : [];
  if (!(v.liftsKnown && v.liftsKnown.value === true)) lines.push({ text: WEEK_WORDS.liftsUnknown, why: null });
  else if (!lifts.length) lines.push({ text: WEEK_WORDS.noLifts, why: null });
  for (const lift of lifts) {
    const status = lift.status && lift.status.value, code = lift.code && lift.code.value;
    const said = status === "offer" ? WEEK_WORDS.up
      : status === "held" ? (Object.hasOwn(WEEK_HOLD_WORDS, code) ? WEEK_HOLD_WORDS[code] : WEEK_FALLBACK)
      : (Object.hasOwn(WEEK_CODE_WORDS, code) ? WEEK_CODE_WORDS[code] : WEEK_FALLBACK);
    lines.push({ text: d(lift.name, "text") + ": " + said, why: status === "offer" ? offerWhy(lift) : null });
  }
  if (v.suggestion && has(v.suggestion.title)) {
    lines.push({ text: WEEK_WORDS.suggestion + d(v.suggestion.title, "text") + (has(v.suggestion.lift) ? " (" + d(v.suggestion.lift, "text") + ")" : "") + ".",
      why: has(v.suggestion.why) ? d(v.suggestion.why, "text") : null });
  }
  /* The bodyweight line (polish batch): one short line when the device holds a trend weight, and none without one. */
  if (v.trend && has(v.trend.trend)) lines.push({ text: WEEK_WORDS.trend + d(v.trend.trend, "lb") + " lb.", why: null });
  return lines;
}
/* The Coach answer: the lines, without the whys (a subset of what ask() checked), one line per item. */
const weekAnswer = (lines) => lines.map((line) => (line.heading ? line.text + "." : line.text)).join("\n");

/* ----------------------------------------------------- the plain answers -- */

/* COACH PLAIN ANSWERS (polish batch on rebuild/c-weekly). What the Coach screen says is plain language: no engine
   code, no engine shorthand (the card notes' DEBUT, "baseline ask", "IS the line"; the tools' "qualified comparable
   performance"; the check-in model's "never none, never zero") ever reaches it. Each page answer is built from the
   turn's own tool VALUES by the templates below, one item per line; a tool's refusal is never shown in the tool's
   words but as the intent's own plain sentence (PLAIN_REFUSALS), whatever its code. Every number is still a tagged
   tool result of the turn, and ask() still discards a draft the untraceable() check or the charter refuses.
   PM-approved short plain copy under :913 (5). */
const PLAIN = Object.freeze({
  sessionNames: Object.freeze({ UPPER: "Upper body", LOWER: "Lower body" }),
  today: "Today: ",
  todaysWorkout: "your workout",
  noWorkout: "No workout is planned today.",
  setOne: " set of ",
  setMany: " sets of ",
  reps: " reps",
  at: " at ",
  bodyweightTail: ", bodyweight",
  firstTimeShort: ": first time, find your weight.",
  calories: "Eat between ",
  caloriesAnd: " and ",
  caloriesTail: " calories.",
  protein: "Protein: at least ",
  proteinTail: " grams.",
  /* "Why this weight?" */
  firstTime: ": first time. Pick a weight you can control for about ",
  firstTimeTail: " reps; what you log becomes your starting point.",
  firstTimeNoTop: ": first time. Pick a weight you can control for every set; what you log becomes your starting point.",
  /* polish 3: a lift with an earlier session (or none known) but no working weight is not a first time */
  noWorking: ": no working weight set yet. Pick a weight you can control for about ",
  noWorkingNoTop: ": no working weight set yet. Pick a weight you can control for every set; what you log becomes your starting point.",
  working: " lb is your working weight. A new weight can be offered once you reach the top of your rep range",
  newWeight: " lb is your new weight, and this is its first workout.",
  held: ", held for now. Your first set went to failure twice, so the weight stays until a first set ends with a rep or more in reserve.",
  heldNoLoad: ": held for now. Your first set went to failure twice, so the weight stays until a first set ends with a rep or more in reserve.",
  /* the setting is said LAST: a setting's own figure ("Pin 7") is then bare at the end of its clause, as the tool said it */
  setting: ": your working setting is ",
  bodyweight: ": bodyweight, so there is no weight to set.",
  noLoad: ": no weight is set for this lift yet.",
  noWorkoutWhy: "No workout is planned today, so there is no weight to explain.",
  /* "What did I do last time?" */
  noEarlier: "No earlier session of ",
  noEarlierTail: " yet.",
  noWorkoutLast: "No workout is planned today, so there is no lift to look back on.",
  /* "Where's my seat set?" (the seat read) */
  noWorkoutSeat: "No workout is planned today, so there are no machine settings to look up.",
  noSeat: "No machine settings saved for ",
  noSeatTail: " yet.",
  lastTime: ": last time ",
  lbFor: " lb for ",
  /* The check-in. */
  notCheckedIn: "You have not checked in today.",
  sleepKnown: "Your sleep record already has last night: ",
  sleepKnownTail: " hours.",
  leftBlank: "You left ",
  leftBlankTail: " blank.",
});
/* The check-in's core questions: checkin-model.mjs LABELS (the approved wording each recorded line starts with, as
   "Label: answer"), beside the plain word for a blank one. coach.test.mjs holds this list to checkin-model.mjs. */
const CHECKIN_CORE = Object.freeze([
  Object.freeze(["Last night\u2019s sleep", "sleep"]),
  Object.freeze(["How was the quality?", "sleep quality"]),
  Object.freeze(["Energy right now", "energy"]),
  Object.freeze(["Muscle soreness right now", "soreness"]),
  Object.freeze(["Stress right now", "stress"]),
]);
/* A tool's refusal, said as the intent's own plain sentence (never the tool's words, whatever the code). */
const PLAIN_REFUSALS = Object.freeze({
  today_plan: "Today's workout could not be prepared on this device.",
  why_weight: "Today's workout could not be prepared on this device.",
  last_time: "There is no workout open right now, so there is no lift to look back on.",
  my_checkin: "Your check-in could not be read on this device.",
  machine_seat: "Your machine settings could not be read on this device.",
  week_review: "No workout record is open on this device, so there is no week to review.",
  weight_trend: "Your weight could not be read on this device.",
});
const PLAIN_DISCARDED = "I cannot answer that from what the app holds.";

const sentence = (line) => (/[.?!]$/.test(line) ? line : line + ".");
const listWords = (words) => (words.length < 2 ? words.join("")
  : words.slice(0, -1).join(", ") + " and " + words[words.length - 1]);
const flag = (tag) => !!(tag && tag.value === true);
function sessionTitle(v) {
  const code = v.name && v.name.value;
  return typeof code === "string" && Object.hasOwn(PLAIN.sessionNames, code) ? PLAIN.sessionNames[code] : PLAIN.todaysWorkout;
}
/* One exercise's set target: "Chest press: 3 sets of 10 reps at 100 lb." (or "of 10, 10, 9 reps"), or the first-time
   line when the engine asks for a first weight. */
function targetLine(ex) {
  const name = d(ex.name, "text");
  if (flag(ex.firstTime)) return name + PLAIN.firstTimeShort;
  const reps = (ex.reps || []).filter(has);
  const same = reps.length > 0 && reps.every((r) => r.display === reps[0].display);
  const repWords = !reps.length ? "" : (same ? d(reps[0], "rep") : reps.map((r) => d(r, "rep")).join(", ")) + PLAIN.reps;
  const sets = has(ex.sets) ? d(ex.sets, "set") + (repWords ? (ex.sets.value === 1 ? PLAIN.setOne : PLAIN.setMany) + repWords
    : (ex.sets.value === 1 ? " set" : " sets")) : repWords;
  const load = has(ex.load) ? PLAIN.at + d(ex.load, "lb") + " lb"
    : has(ex.textLoad) ? PLAIN.at + d(ex.textLoad, "text")
    : flag(ex.bodyweight) ? PLAIN.bodyweightTail : "";
  return sentence(name + ": " + sets + load);
}
/* One exercise's "why this weight", in plain words: what follows its name (": first time. ...", ": 200 lb is your
   working weight. ..."). */
function whyAfterName(ex, earlier) {
  /* POLISH 3 (PM, ui-pass9 shot 03): "first time" only for a lift with NO earlier session (the gym card's own last sets,
     the same read "What did I do last time?" says); a lift that has one, or whose history could not be read, has no
     working weight set yet, which is true either way. */
  if (flag(ex.firstTime) && earlier === false) {
    return has(ex.repTop) ? PLAIN.firstTime + d(ex.repTop, "rep") + PLAIN.firstTimeTail : PLAIN.firstTimeNoTop;
  }
  if (flag(ex.firstTime)) {
    return has(ex.repTop) ? PLAIN.noWorking + d(ex.repTop, "rep") + PLAIN.firstTimeTail : PLAIN.noWorkingNoTop;
  }
  if (flag(ex.held)) return has(ex.load) ? ": " + d(ex.load, "lb") + " lb" + PLAIN.held : PLAIN.heldNoLoad;
  if (has(ex.load) && flag(ex.newWeight)) return ": " + d(ex.load, "lb") + PLAIN.newWeight;
  if (has(ex.load)) {
    return ": " + d(ex.load, "lb") + PLAIN.working + (has(ex.repTop) ? " (" + d(ex.repTop, "rep") + " reps)." : ".");
  }
  if (has(ex.textLoad)) return sentence(PLAIN.setting + d(ex.textLoad, "text"));
  if (flag(ex.bodyweight)) return PLAIN.bodyweight;
  return PLAIN.noLoad;
}
/* COACH V1 BATCH 2 (PM, item 2): lifts whose reasons read the same say it once, on one line, their names listed in
   the workout's order ("Plank, Leg press, Nordic curl: first time. ..."); a line keeps the place of its first lift. */
function whyLines(lifts, earlierOf = () => null) {
  const groups = new Map();
  for (const ex of lifts) {
    const after = whyAfterName(ex, earlierOf(ex));
    if (!groups.has(after)) groups.set(after, []);
    groups.get(after).push(d(ex.name, "text"));
  }
  return [...groups].map(([after, names]) => names.join(", ") + after);
}
const planned = (v) => !!(v && flag(v.available) && Array.isArray(v.lifts) && v.lifts.length);

/* Each page template takes the turn's results by tool name and returns the answer's lines, or null when a tool
   refused (the intent's PLAIN_REFUSALS sentence is said instead). */
const PAGE_TEMPLATES = Object.freeze({
  /* "What am I hitting today?": the workout, each exercise with its set target, then the calorie band and the
     protein target only when the engine holds one. No marching order. */
  plan: (got) => {
    const s = got.today_session, t = got.today_plan;
    if (!s || !s.ok) return null;
    const lines = planned(s.values) ? [PLAIN.today + sessionTitle(s.values) + ".", ...s.values.lifts.map(targetLine)] : [PLAIN.noWorkout];
    const v = t && t.ok ? t.values : {};
    if (has(v.kcalLo) && has(v.kcalHi)) lines.push(PLAIN.calories + d(v.kcalLo, "kcal") + PLAIN.caloriesAnd + d(v.kcalHi, "kcal") + PLAIN.caloriesTail);
    if (has(v.proteinG)) lines.push(PLAIN.protein + d(v.proteinG, "g") + PLAIN.proteinTail);
    return lines;
  },
  /* "Why this weight?": one plain line per reason, the lifts that share it named together (batch 2). */
  why_weight: (got) => {
    const s = got.today_session;
    if (!s || !s.ok) return null;
    if (!planned(s.values)) return [PLAIN.noWorkoutWhy];
    /* polish 3: each lift's earlier session, from the gym card's own last sets when the card could be read (true or
       false), else unknown (null) */
    const l = got.last_times;
    const sets = l && l.ok ? new Map((l.values.lifts || []).map((row) => [row.id && row.id.value, (row.sets || []).length > 0])) : null;
    return whyLines(s.values.lifts, (ex) => (sets && ex.id ? (sets.has(ex.id.value) ? sets.get(ex.id.value) : null) : null));
  },
  /* "What did I do last time?" (batch 2): every lift of today's workout, one line each, in the workout's order: its
     "Last time" sets as the gym card reads them, or that there is no earlier session of it yet. */
  last_time: (got) => {
    const s = got.today_session, l = got.last_times;
    if (!s || !s.ok) return null;
    if (!planned(s.values)) return [PLAIN.noWorkoutLast];
    if (!l || !l.ok) return null;
    const byId = new Map((l.values.lifts || []).map((row) => [row.id && row.id.value, row]));
    return s.values.lifts.map((ex) => {
      const name = d(ex.name, "text");
      const row = ex.id ? byId.get(ex.id.value) : null;
      const sets = row ? (row.sets || []).filter((set) => has(set.load) && has(set.reps)) : [];
      if (!sets.length) return PLAIN.noEarlier + name + PLAIN.noEarlierTail;
      const same = sets.every((set) => set.load.display === sets[0].load.display);
      const said = same
        ? d(sets[0].load, "lb") + PLAIN.lbFor + sets.map((set) => d(set.reps, "rep")).join(", ") + PLAIN.reps
        : sets.map((set) => d(set.load, "lb") + PLAIN.lbFor + d(set.reps, "rep") + PLAIN.reps).join(", ");
      return name + PLAIN.lastTime + said + ".";
    });
  },
  /* The trend sentences, one per line (a sentence ends at a full stop followed by a capital, so "1.19" stays whole). */
  weight_trend: (got) => (got.weight_trend && got.weight_trend.ok
    ? TEMPLATES_2.weight_trend(got.weight_trend.values).split(/(?<=\.) (?=[A-Z])/) : null),
  /* The check-in: what is recorded, in the model's own "Label: answer" lines, and which core question was left blank. */
  checkin: (got) => {
    const r = got.today_checkin;
    if (!r || !r.ok) return null;
    const v = r.values;
    if (!flag(v.answered)) {
      const lines = [PLAIN.notCheckedIn];
      if (has(v.sleepRecordHours)) lines.push(PLAIN.sleepKnown + d(v.sleepRecordHours, "h") + PLAIN.sleepKnownTail);
      return lines;
    }
    const said = (v.lines || []).filter(has).map((l) => d(l, "text"));
    const blank = CHECKIN_CORE.filter(([label]) => !said.some((l) => l.startsWith(label + ": "))).map(([, word]) => word);
    const lines = [];
    if (has(v.provenance)) lines.push(sentence(d(v.provenance, "text")));
    lines.push(...said.map(sentence));
    if (blank.length) lines.push(PLAIN.leftBlank + listWords(blank) + PLAIN.leftBlankTail);
    if (has(v.note)) lines.push(sentence(d(v.note, "text")));
    return lines;
  },
  /* "Where's my seat set?" (Coach v1 seat read): every lift of today's workout, one line each, in the workout's order:
     the settings the athlete saved for it, as he wrote them, each ended by a semicolon so the number check reads a
     figure in it exactly as the tool carried it ("Leg press: seat 4; back pad 2."), then his cue; or that none is saved. */
  machine_seat: (got) => {
    const s = got.today_session, m = got.seat_settings;
    if (!s || !s.ok) return null;
    if (!planned(s.values)) return [PLAIN.noWorkoutSeat];
    if (!m || !m.ok) return null;
    const byId = new Map((m.values.lifts || []).map((row) => [row.id && row.id.value, row]));
    return s.values.lifts.map((ex) => {
      const name = d(ex.name, "text");
      const row = ex.id ? byId.get(ex.id.value) : null;
      const pairs = row ? (row.settings || []).filter(has).map((pair) => d(pair, "text")) : [];
      const cue = row && has(row.cues) ? sentence(d(row.cues, "text")) : "";
      if (!pairs.length && !cue) return PLAIN.noSeat + name + PLAIN.noSeatTail;
      return name + ": " + [pairs.length ? pairs.join("; ") + "." : "", cue].filter(Boolean).join(" ");
    });
  },
  /* The weekly review (Coach v1 piece 2): every line and every why, so the turn's check covers all of it. */
  week_review: (got) => (got.week_review && got.week_review.ok
    ? weekLines(got.week_review.values).flatMap((line) => [line.text, line.why || ""]).filter(Boolean) : null),
});

/* One page question: the tools it reads, in order, and its template. A later tool is not called once one refuses. */
const PAGE_INTENTS = Object.freeze({
  today_plan: Object.freeze({ tools: Object.freeze(["today_session", "today_plan"]), template: "plan" }),
  why_weight: Object.freeze({ tools: Object.freeze(["today_session", "last_times"]), template: "why_weight" }),
  last_time: Object.freeze({ tools: Object.freeze(["today_session", "last_times"]), template: "last_time" }),
  weight_trend: Object.freeze({ tools: Object.freeze(["weight_trend"]), template: "weight_trend" }),
  my_checkin: Object.freeze({ tools: Object.freeze(["today_checkin"]), template: "checkin" }),
  machine_seat: Object.freeze({ tools: Object.freeze(["today_session", "seat_settings"]), template: "machine_seat" }),
  week_review: Object.freeze({ tools: Object.freeze(["week_review"]), template: "week_review" }),
});
const PAGE_INTENT_IDS = Object.freeze(Object.keys(PAGE_INTENTS));

/* ONE TAP, ONE TURN. `tools` is createWave1Tools(...) (its openTurn binds the read tools and the wave-one four into
   one results array); `liftId` answers the id of the lift on the gym card, or null. The returned `answer` is what
   the screen may show: the template's lines (joined one per line) when the turn is clean, the intent's plain refusal
   when a tool refused, or the general refusal when a number in the draft is not among the turn's own tool results or
   the charter forbids a phrase (the draft is kept as `draft` for the test, never shown). */
async function ask(tools, intent, { turnId, liftId = async () => null } = {}) {
  const spec = PAGE_INTENTS[intent];
  if (!spec) throw new Error("COACH_UNKNOWN_PAGE_INTENT:" + intent);
  if (!tools || typeof tools.openTurn !== "function") throw new TypeError("ask: the coach tools are required");
  const turn = tools.openTurn(turnId || "page-" + intent);
  const got = {};
  for (const name of spec.tools) {
    let args = {};
    if (name === "machine_settings") { const id = await liftId(); args = { exercise_id: typeof id === "string" ? id : "" }; }
    const r = await turn.call[name](args);
    got[name] = r;
    /* A refusal ends the reads; the template decides whether it is an answer ("No earlier session of X yet" is). */
    if (!r.ok) break;
  }
  const lines = PAGE_TEMPLATES[spec.template](got);
  const answered = Array.isArray(lines) && lines.length > 0;
  const draft = answered ? lines.join("\n") : PLAIN_REFUSALS[intent] || PLAIN_DISCARDED;
  const untraceable = turn.untraceable(draft);
  const charter = T.charterViolations(draft);
  const shipped = untraceable.length === 0 && charter.length === 0 && typeof draft === "string" && draft !== "";
  /* The weekly review also hands back its lines (the Today card draws them, whys behind Why?), and its answer is the
     lines without the whys; only a shipped, answered turn has lines. */
  const week = intent === "week_review" && shipped && answered ? weekLines(got.week_review.values) : null;
  /* `answered` is false when a tool refused (no session, no lane, nothing kept): the sentence is then the intent's
     plain refusal, and the screen shows it as one. */
  return Object.freeze({ intent, turn_id: turn.turn_id, results: turn.results.slice(), draft, untraceable, charter,
    shipped, answered: shipped && answered, lines: week,
    answer: !shipped ? ALL_TEMPLATES.unavailable({ code: "COACH_ANSWER_DISCARDED", reason: null }) : week ? weekAnswer(week) : draft });
}

module.exports = {
  d, has, join, list, TEMPLATES, TEMPLATES_2, ALL_TEMPLATES, READ_INTENTS, FACT_INTENTS, TIER3_INTENTS, answerOne,
  WAVE1_TEMPLATES, PAGE_TEMPLATES, PAGE_INTENTS, PAGE_INTENT_IDS, ask,
  WEEK_WORDS, WEEK_CODE_WORDS, WEEK_HOLD_WORDS, WEEK_FALLBACK, weekLines,
  PLAIN, CHECKIN_CORE, PLAIN_REFUSALS, PLAIN_DISCARDED, WEEK_WHY,
};
