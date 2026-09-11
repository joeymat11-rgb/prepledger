"use strict";

/* tools.cjs — the coach's ONLY window onto Earned.
 *
 * Binding rule (VOICE-COACH-BRIEF.md, owner ruling DECISIONS:89): voice is the
 * mouth, the engine is the brain. Every number the coach says must come from an
 * engine tool result IN THE SAME TURN. So every value this module returns is
 * TAGGED — { value, unit, source, turn_id, display } — and `traceability()`
 * below can decide mechanically whether a spoken sentence is allowed.
 *
 * There is no model here, no network, no key, no audio. This file is the
 * contract a later GPT-Live-1 adapter must satisfy (see model-adapter.md), and
 * coach-text.cjs is the text-first stand-in the brief sequences first.
 *
 * WHAT IS REAL. The engine reads are the accepted engine composed exactly as the
 * slice composes it (rebuild/m3/w7-preview/today/today-engine.cjs = the accepted
 * browser composition + rebuild/engine/writers.cjs). The gym reads are the
 * accepted capture layer through rebuild/m3/w7-preview/today/gym-model.mjs. The
 * consent path is rebuild/client's own respond()/recordIssuance().
 *
 * WHAT IS HONESTLY MISSING. Where the slice has no seam today the tool returns a
 * typed `unavailable` carrying a code — never a guess, never a plausible number.
 * The codes and their exact file:line are in TOOL-CONTRACT.md.
 */

const crypto = require("node:crypto");

const TIER = Object.freeze({ READ: 0, FACT: 1, PROPOSAL: 2, REFUSED: 3 });

/* ---------------------------------------------------------------- tagging -- */

/* A number the coach is allowed to say, and the proof of where it came from.
   `display` is the EXACT string that may appear in a spoken answer; the
   traceability check reads its numeric tokens and nothing else. */
function tagged(turn_id, source, value, unit, display) {
  if (typeof turn_id !== "string" || !turn_id) throw new TypeError("tagged: turn_id required");
  if (typeof source !== "string" || !source) throw new TypeError("tagged: source required");
  const shown = display === undefined ? (value === null || value === undefined ? "" : String(value)) : String(display);
  return Object.freeze({ value: value === undefined ? null : value, unit, source, turn_id, display: shown });
}

/* A value the engine did not produce. Blank means unknown — never zero, never
   normal, never a filled-in default (approved handoff, point 4). */
function blank(turn_id, source, unit, why) {
  return Object.freeze({ value: null, unit, source, turn_id, display: "", blank: true, why: why || null });
}

const isNum = (n) => typeof n === "number" && Number.isFinite(n);
const num = (turn_id, source, n, unit, display) =>
  (isNum(n) ? tagged(turn_id, source, n, unit, display) : blank(turn_id, source, unit, "the engine did not produce this value"));
const text = (turn_id, source, s) =>
  (typeof s === "string" && s.trim() ? tagged(turn_id, source, s, "text", s) : blank(turn_id, source, "text", "the engine produced no sentence here"));

/* ------------------------------------------------------- traceability ------ */

/* Numeric tokens, comma-normalised. Sign is deliberately not part of a token:
   the risk this check exists to catch is an INVENTED QUANTITY, not a dropped
   minus sign, and "2030-01-07" must tokenise as three ordinary numbers. */
const TOKEN = /\d[\d,]*(?:\.\d+)?/g;
function numericTokens(s) {
  const out = [];
  const src = String(s === null || s === undefined ? "" : s);
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(src)) !== null) out.push(m[0].replace(/,/g, ""));
  return out;
}

/* Every tagged value reachable in a tool result, however deeply nested. */
function collectTagged(node, out) {
  out = out || [];
  if (!node || typeof node !== "object") return out;
  if (typeof node.source === "string" && typeof node.turn_id === "string" && "display" in node) { out.push(node); return out; }
  if (Array.isArray(node)) { for (const v of node) collectTagged(v, out); return out; }
  for (const v of Object.values(node)) collectTagged(v, out);
  return out;
}

/* The set of numbers a turn is allowed to say: the tokens of every tagged value
   the tools returned IN THAT TURN, and nothing else. */
function allowedTokens(results, turn_id) {
  const allowed = new Set();
  for (const r of results || []) {
    if (turn_id && r && r.turn_id !== turn_id) continue;
    for (const t of collectTagged(r)) {
      if (turn_id && t.turn_id !== turn_id) continue;
      for (const tok of numericTokens(t.display)) allowed.add(tok);
    }
  }
  return allowed;
}

/* FAIL-CLOSED. Returns every numeric token in `answer` that no tool result from
   the same turn accounts for. An empty array is the only passing answer. */
function untraceable(answer, results, turn_id) {
  const allowed = allowedTokens(results, turn_id);
  return numericTokens(answer).filter((tok) => !allowed.has(tok));
}
const traceable = (answer, results, turn_id) => untraceable(answer, results, turn_id).length === 0;

/* ------------------------------------------------------- charter lint ------ */

/* "No urgency, streaks, gamification, nudging or dark patterns in the coach's
   voice; misses are stated plainly, never softened or dramatized." The list is
   literal and it is tested against every transcript the prototype renders.
   Words already spent on a tracked quantity are NOT in here — that is the
   RESERVED list's job in the app's own suite; this is the charter's. */
const CHARTER_BANNED = Object.freeze([
  "streak", "don't break", "keep it going", "keep the chain", "hurry", "now or never",
  "last chance", "running out of time", "only a few left", "you're on fire", "on fire",
  "crushing it", "smashed it", "level up", "levelled up", "badge", "points", "xp",
  "bonus", "unlock", "achievement", "leaderboard", "combo", "don't lose your",
  "miss out", "today only", "act fast", "urgent", "hurry up", "beast mode",
  "no excuses", "let's go!", "you got this", "proud of you", "amazing work",
  "keep the momentum", "streaks", "daily goal met",
]);
/* Word-boundary matching, not substring: "explain" contains "xp" and a lint that
   fires on that is a lint nobody keeps. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const charterRe = (phrase) => {
  const body = escapeRe(phrase).replace(/\s+/g, "\\s+");
  return new RegExp((/^\w/.test(phrase) ? "\\b" : "") + body + (/\w$/.test(phrase) ? "\\b" : ""), "i");
};
const CHARTER_PATTERNS = Object.freeze(CHARTER_BANNED.map((w) => ({ word: w, re: charterRe(w) })));
function charterViolations(transcriptText) {
  const hay = String(transcriptText || "");
  return CHARTER_PATTERNS.filter((p) => p.re.test(hay)).map((p) => p.word);
}

/* ------------------------------------------------- tier 3: never via coach -- */

const NEVER_VIA_COACH = Object.freeze({
  phase: "Phase is a detector output, not a choice — not yours and not mine. It moves when the evidence moves, and it changes in settings, never in a conversation.",
  calorie_floor: "The calorie floor is derived from your lean mass by the energy-availability formula, not set by hand. I can tell you the number and the reasoning behind it; I cannot move it.",
  protein_floor: "The protein floor is derived from your measured lean mass. I can read it out and explain it; changing it is an owner decision in settings.",
  progression_rules: "How the next target is worked out is a rule in the engine, not a setting in this conversation. I can explain what it did and why; I cannot rewrite it.",
  consent_policy: "What needs your explicit yes, and how that yes is recorded, is not something a conversation can loosen. I can explain it.",
});
const TIER3_TOPICS = Object.freeze(Object.keys(NEVER_VIA_COACH));

/* ------------------------------------------------------------- envelopes -- */

const ok = (tool, tier, turn_id, values, extra) =>
  Object.freeze({ tool, tier, turn_id, ok: true, values: values || {}, ...(extra || {}) });

/* A tool that cannot answer says so with a CODE. Where the engine or the client
   already owns a code, that code is carried verbatim (`source_code`); where the
   slice simply has no seam, the code is in the COACH_ namespace and
   TOOL-CONTRACT.md names the file:line that proves it. */
const unavailable = (tool, tier, turn_id, code, reason, source) =>
  Object.freeze({ tool, tier, turn_id, ok: false,
    unavailable: Object.freeze({ code, reason, source: source || null }),
    /* The refusal's own words are a TOOL RESULT too. Carrying them as tagged
       values is what lets the coach read a client or engine refusal out loud —
       numbers inside it included — without inventing anything. */
    values: Object.freeze({
      code: tagged(turn_id, "coach.refusal.code", code, "code", ""),
      reason: text(turn_id, "coach.refusal." + code, reason),
    }),
    state_unchanged: true });

const CODES = Object.freeze({
  CONFIRMATION_REQUIRED: "COACH_CONFIRMATION_REQUIRED",
  CHECKIN_SURFACE_ABSENT: "COACH_CHECKIN_SURFACE_ABSENT",
  GYM_SESSION_ABSENT: "COACH_GYM_SESSION_ABSENT",
  NO_QUALIFIED_COMPARISON: "COACH_NO_QUALIFIED_COMPARISON",
  FACT_COMMAND_ABSENT: "COACH_FACT_COMMAND_ABSENT",
  REPLAN_ENTRY_ABSENT: "COACH_REPLAN_ENTRY_ABSENT",
  ENGINE_ISSUED_NO_PROPOSAL: "COACH_ENGINE_ISSUED_NO_PROPOSAL",
  CONSENT_SURFACE_ABSENT: "COACH_CONSENT_SURFACE_ABSENT",
  PROPOSAL_NOT_ENGINE_ISSUED: "COACH_PROPOSAL_NOT_ENGINE_ISSUED",
  COST_CAP_ABSENT: "COACH_COST_CAP_ABSENT",
  COST_CAP_INVALID: "COACH_COST_CAP_INVALID",
});

/* Keys that must never leave the engine through this window. The coach sends
   "only what the question needs", never the ledger. */
const FORBIDDEN_KEYS = Object.freeze([
  "reads", "dailyLogs", "sessionLog", "sleep", "nights", "exercises", "feed", "queue",
  "state", "seed", "token", "GH_TOKEN", "identityKey", "storeKey", "signingKey", "lease", "authorityKey",
]);
function assertNoLeak(result) {
  const seen = [];
  (function walk(node, depth) {
    if (!node || typeof node !== "object" || depth > 8) return;
    if (Array.isArray(node)) { for (const v of node) walk(v, depth + 1); return; }
    for (const [k, v] of Object.entries(node)) {
      if (FORBIDDEN_KEYS.includes(k)) seen.push(k);
      walk(v, depth + 1);
    }
  })(result, 0);
  if (seen.length) throw new Error("COACH_TOOL_LEAK:" + [...new Set(seen)].join(","));
  return result;
}

/* ------------------------------------------------------------ the tools -- */

/* world = {
 *   today   : the slice's REAL adapter (rebuild/m3/w7-preview/today/today-model.cjs
 *             createTodayModel) — read()/stateFromOps()/engine
 *   gym     : OPTIONAL, the slice's REAL gym adapter (gym-model.mjs createGymModel)
 *   consent : OPTIONAL, rebuild/client's own consent surface
 *             { respond(id, answer), recordIssuance({id,accepted,instance}), face() }
 *   checkin : OPTIONAL, a recovery check-in reader — ABSENT in the slice today
 * }
 */
function createCoachTools(world) {
  if (!world || !world.today || typeof world.today.read !== "function") {
    throw new TypeError("createCoachTools requires the slice's today adapter");
  }
  const today = world.today;
  const gym = world.gym || null;
  const consent = world.consent || null;
  const checkin = world.checkin || null;
  const E = today.engine;

  /* Engine-issued proposals, sealed at issue. The model never writes here: the
     only writer is request_replan(), and it copies the ENGINE's own object. */
  const issued = new Map();
  const accepted = new Map();
  const consentLedger = [];

  const st = () => today.stateFromOps();
  const day = today.today;

  /* ------------------------------------------------------------- tier 0 -- */

  async function today_plan(_args, turn_id) {
    const view = today.read();
    const cal = view.calorieTarget, pro = view.proteinTarget;
    const values = {
      day: tagged(turn_id, "today-model.read.today", view.today, "date", view.today),
      kcalLo: num(turn_id, "energy.calorieTarget.lo", cal.lo, "kcal"),
      kcalHi: num(turn_id, "energy.calorieTarget.hi", cal.hi, "kcal"),
      proteinG: num(turn_id, "energy.proteinTarget.g", pro.g, "g"),
      statusWord: text(turn_id, "today.statusFace.word", view.statusFace.word),
      statusCause: text(turn_id, "today.statusFace.cause", view.statusFace.cause),
      ifText: text(turn_id, "today.marchingOrder.ifText", view.marchingOrder.ifText),
      thenText: text(turn_id, "today.marchingOrder.thenText", view.marchingOrder.thenText),
      targetLine: text(turn_id, "today.marchingOrder.targetLine", view.marchingOrder.targetLine),
      workoutTitle: text(turn_id, "today.nowModel.workout.title", view.workout.title),
      workoutAvailable: tagged(turn_id, "today.genSession", !!view.workout.available, "flag", ""),
      workoutRefusal: view.workout.available ? blank(turn_id, "today.genSession", "code", "the session generated")
        : text(turn_id, "today.genSession.refusal", view.workout.unavailableReason),
    };
    return assertNoLeak(ok("today_plan", TIER.READ, turn_id, values));
  }

  async function weight_trend(_args, turn_id) {
    const view = today.read();
    const s = st();
    const rate = view.currentRate, rec = view.readRecency;
    const values = {
      trend: num(turn_id, "engine.state.trend (writers.applyRead)", s.trend, "lb"),
      measured: tagged(turn_id, "energy.currentRate.measured", !!rate.measured, "flag", ""),
      rate: rate.measured ? num(turn_id, "energy.currentRate.scale", rate.scale, "lb/wk")
        : blank(turn_id, "energy.currentRate.scale", "lb/wk", "the engine has not measured a rate yet"),
      rateLo: rate.measured ? num(turn_id, "energy.currentRate.lo", rate.lo, "lb/wk") : blank(turn_id, "energy.currentRate.lo", "lb/wk", "no measured rate"),
      rateHi: rate.measured ? num(turn_id, "energy.currentRate.hi", rate.hi, "lb/wk") : blank(turn_id, "energy.currentRate.hi", "lb/wk", "no measured rate"),
      n: num(turn_id, "energy.currentRate.n", rate.n, "reading"),
      from: text(turn_id, "energy.currentRate.from", rate.from),
      to: text(turn_id, "energy.currentRate.to", rate.to),
      lastReadISO: text(turn_id, "energy.readRecency.lastISO", rec.lastISO),
      daysSinceRead: num(turn_id, "energy.readRecency.days", rec.days, "day"),
      stale: tagged(turn_id, "energy.readRecency.stale", !!rec.stale, "flag", ""),
      latestLb: view.latestRead ? num(turn_id, "today-model.latestRead.lb", view.latestRead.lb, "lb")
        : blank(turn_id, "today-model.latestRead", "lb", "no reading is stored on this device yet"),
      hasReadToday: tagged(turn_id, "today-model.hasReadToday", !!view.hasReadToday, "flag", ""),
    };
    return assertNoLeak(ok("weight_trend", TIER.READ, turn_id, values));
  }

  /* The REASON behind the current instruction. Every sentence here is the
     engine's own prose, carried unedited — the coach paraphrases nothing, so a
     number inside a reason is traceable to the reader that produced it. */
  const WHY_TOPICS = Object.freeze(["instruction", "calories", "protein", "maintenance", "floor", "levers", "status"]);
  async function why_this_instruction(args, turn_id) {
    const topic = (args && args.topic) || "instruction";
    if (!WHY_TOPICS.includes(topic)) {
      return unavailable("why_this_instruction", TIER.READ, turn_id, CODES.REPLAN_ENTRY_ABSENT,
        "This coach answers why only for: " + WHY_TOPICS.join(", ") + ".", null);
    }
    const s = st();
    const values = { topic: tagged(turn_id, "coach.request.topic", topic, "topic", "") };
    if (topic === "instruction") {
      const fix = E.theOneFix(s);
      values.lever = text(turn_id, "today.theOneFix.lever", fix.lever);
      values.title = text(turn_id, "today.theOneFix.title", fix.title);
      values.body = text(turn_id, "today.theOneFix.body", fix.body);
      values.whyNot = text(turn_id, "today.theOneFix.whyNot", fix.whyNot);
    } else if (topic === "calories") {
      const cal = E.calorieTarget(s);
      values.body = text(turn_id, "energy.calorieTarget.why", cal.why);
      values.weekly = text(turn_id, "energy.calorieTarget.wkWhy", cal.wkWhy);
    } else if (topic === "protein") {
      values.body = text(turn_id, "energy.proteinTarget.why", E.proteinTarget(s).why);
    } else if (topic === "maintenance") {
      const tdee = E.observedTDEE(s);
      values.body = text(turn_id, "energy.observedTDEE.stepsWhy", tdee.stepsWhy);
      values.matched = tagged(turn_id, "energy.observedTDEE.matched", !!tdee.matched, "flag", "");
      values.impossible = tagged(turn_id, "energy.observedTDEE.impossible", !!tdee.impossible, "flag", "");
    } else if (topic === "floor") {
      values.body = text(turn_id, "energy.calorieFloor.why", E.calorieFloor(s).why);
    } else if (topic === "status") {
      const face = E.statusFace(s);
      values.body = text(turn_id, "today.statusFace.cause", face.cause);
      values.word = text(turn_id, "today.statusFace.word", face.word);
    } else {
      values.levers = E.fiveLevers(s).list.map((l, i) => ({
        label: text(turn_id, "today.fiveLevers[" + i + "].label", l.label),
        zone: text(turn_id, "today.fiveLevers[" + i + "].state", l.state),
        detail: text(turn_id, "today.fiveLevers[" + i + "].detail", l.detail),
      }));
    }
    return assertNoLeak(ok("why_this_instruction", TIER.READ, turn_id, values));
  }

  /* The gym reads. The accepted capture layer is the ONLY source: this reads
     gym-model.read(), which computes nothing of its own either. A refusal from
     the layer is carried with the layer's own code — PERFORMED_NATIVE_TREND_-
     CONTEXT_REQUIRED, WORKOUT_PREPARATION_INVALID and the rest reach the coach
     unedited, because inventing a friendlier sentence is how a guess starts. */
  async function gymView(tool, turn_id) {
    if (!gym) return { fail: unavailable(tool, TIER.READ, turn_id, CODES.GYM_SESSION_ABSENT,
      "No gym session is composed on this device, so there is no set to read.", "rebuild/m3/w7-preview/today/gym-model.mjs") };
    const view = await gym.read();
    if (view.phase === "blocked" || view.phase === "unfinished") {
      return { fail: unavailable(tool, TIER.READ, turn_id, view.code || "WORKOUT_UNAVAILABLE",
        view.copy || null, "rebuild/m3/w7-preview/today/gym-model.mjs read()") };
    }
    return { view };
  }

  async function current_set(_args, turn_id) {
    const got = await gymView("current_set", turn_id);
    if (got.fail) return got.fail;
    const view = got.view;
    if (view.phase !== "active" && view.phase !== "ready") {
      return unavailable("current_set", TIER.READ, turn_id, CODES.GYM_SESSION_ABSENT,
        "The session is " + view.phase + ", so there is no current set.", "gym-model.read().phase");
    }
    const values = {
      phase: text(turn_id, "gym-model.read.phase", view.phase),
      liftLabel: text(turn_id, "gym-model.lift.label", view.lift.label),
      liftIndex: num(turn_id, "gym-model.lift.index", view.lift.index, "lift"),
      liftCount: num(turn_id, "gym-model.lift.count", view.lift.count, "lift"),
      setPosition: num(turn_id, "gym-model.set.position", view.set.position, "set"),
      setCount: num(turn_id, "gym-model.set.count", view.set.count, "set"),
      prescription: text(turn_id, "gym-model.prescriptionLine (capture cells)", view.prescription.line),
      effort: text(turn_id, "gym-model.effortInstruction (capture effort target)", view.prescription.effort),
      reason: view.prescription.reason.map((line, i) =>
        text(turn_id, "gym-model.prescription.reason[" + i + "] (capture reason cell)", line)),
      setup: text(turn_id, "gym-model.prescription.setup", view.prescription.setup),
    };
    return assertNoLeak(ok("current_set", TIER.READ, turn_id, values));
  }

  async function next_set(_args, turn_id) {
    const got = await gymView("next_set", turn_id);
    if (got.fail) return got.fail;
    const up = got.view.upNext || got.view.next || null;
    if (!up) return unavailable("next_set", TIER.READ, turn_id, CODES.GYM_SESSION_ABSENT,
      "The capture has no further set after this one.", "gym-model.nextAfter()");
    const values = {
      liftLabel: text(turn_id, "gym-model.next.label", up.label),
      position: num(turn_id, "gym-model.next.position", up.position, "set"),
      count: num(turn_id, "gym-model.next.count", up.count, "set"),
      prescription: text(turn_id, "gym-model.next.line (capture cells)", up.line),
      effort: text(turn_id, "gym-model.next.effort (capture effort target)", up.effort),
      sameLift: tagged(turn_id, "gym-model.next.sameLift", !!up.sameLift, "flag", ""),
    };
    return assertNoLeak(ok("next_set", TIER.READ, turn_id, values));
  }

  /* The engine returns card.prev as null whenever no comparison is qualified.
     That null is an ANSWER, not a gap to be filled — it reaches the coach as a
     typed unavailable and the coach says it has nothing comparable. */
  async function last_comparable_performance(_args, turn_id) {
    const got = await gymView("last_comparable_performance", turn_id);
    if (got.fail) return got.fail;
    const line = got.view.previous || null;
    if (!line) return unavailable("last_comparable_performance", TIER.READ, turn_id, CODES.NO_QUALIFIED_COMPARISON,
      "The accepted engine reports no qualified comparable performance for this lift and set.",
      "rebuild/engine/today.cjs:63 genSession -> card.prev");
    return assertNoLeak(ok("last_comparable_performance", TIER.READ, turn_id, {
      line: text(turn_id, "gym-model.previousLine (genSession card.prev)", line),
      liftLabel: text(turn_id, "gym-model.lift.label", got.view.lift && got.view.lift.label),
    }));
  }

  /* The recovery check-in is approved (Additions C, point 3) and NOT wired in the
     slice — Today's face labels it "— not wired yet". There is no reader, so
     there is no answer. Blank is unknown, never normal. */
  async function today_checkin(_args, turn_id) {
    if (!checkin || typeof checkin.read !== "function") {
      return unavailable("today_checkin", TIER.READ, turn_id, CODES.CHECKIN_SURFACE_ABSENT,
        "The recovery check-in is not wired on this device yet, so there is nothing recorded to read back.",
        "rebuild/m3/w7-preview/today/today-app.cjs — coach/recovery entries labelled not wired yet");
    }
    const read = await checkin.read({ date: day });
    return assertNoLeak(ok("today_checkin", TIER.READ, turn_id, {
      date: tagged(turn_id, "coach.checkin.date", day, "date", day),
      answered: tagged(turn_id, "checkin.read.answered", !!read.answered, "flag", ""),
      summary: text(turn_id, "checkin.read.summary", read.summary),
    }));
  }

  /* -------------------------------------------------- tier 1 — the FACTS -- */

  /* Every fact tool requires confirmed:true, and the harness sets it ONLY after
     the user's spoken yes. The guard runs before anything else, so a tool called
     without it writes nothing and reads nothing. */
  function needConfirm(tool, args, turn_id) {
    if (!args || args.confirmed !== true) {
      return unavailable(tool, TIER.FACT, turn_id, CODES.CONFIRMATION_REQUIRED,
        "A fact is recorded only after you say yes. Nothing was recorded.", "VOICE-COACH-BRIEF.md tier 1");
    }
    return null;
  }

  /* The non-workout fact commands do not exist yet. rebuild/m3/w6/t2-stage.cjs:9
     admits exactly weighIn / logSet / logSession / finishSession / workout, and
     anything else reaches `throw new Error("Unsupported staged command")` at
     t2-stage.cjs:84. So these four refuse in a named way rather than writing a
     fact somewhere that cannot survive a reload. */
  const STAGE_SOURCE = "rebuild/m3/w6/t2-stage.cjs:9 COMMANDS (and :84 Unsupported staged command)";
  function noFactCommand(tool, turn_id, what) {
    return unavailable(tool, TIER.FACT, turn_id, CODES.FACT_COMMAND_ABSENT,
      "There is no accepted durable command for " + what + " on this device yet, so I will not pretend to have recorded it.",
      STAGE_SOURCE);
  }
  async function record_pain_or_soreness(args, turn_id) {
    return needConfirm("record_pain_or_soreness", args, turn_id) || noFactCommand("record_pain_or_soreness", turn_id, "pain or soreness");
  }
  async function equipment_unavailable_today(args, turn_id) {
    return needConfirm("equipment_unavailable_today", args, turn_id) || noFactCommand("equipment_unavailable_today", turn_id, "equipment being unavailable");
  }
  async function time_away(args, turn_id) {
    return needConfirm("time_away", args, turn_id) || noFactCommand("time_away", turn_id, "time away");
  }
  async function answer_checkin(args, turn_id) {
    return needConfirm("answer_checkin", args, turn_id) || noFactCommand("answer_checkin", turn_id, "a check-in answer");
  }

  /* correct_set IS wired: the accepted durable removal edit (prepareWorkoutEdit +
     commitWorkoutEdit, gym-model.undo) followed by a fresh logSet. Nothing is
     deleted; the set operation and the removal both stay on disk. */
  async function correct_set(args, turn_id) {
    const guard = needConfirm("correct_set", args, turn_id);
    if (guard) return guard;
    if (!gym) return unavailable("correct_set", TIER.FACT, turn_id, CODES.GYM_SESSION_ABSENT,
      "No gym session is composed on this device, so there is no recorded set to correct.", "gym-model.mjs");
    const { startId, opId, slot, lift, load, reps, effort } = args;
    const undone = await gym.undo({ startId, opId });
    if (!undone.ok) return unavailable("correct_set", TIER.FACT, turn_id, undone.code || "WORKOUT_UNAVAILABLE",
      undone.copy || null, "gym-model.undo -> client.commitWorkoutEdit");
    const relogged = await gym.logSet({ startId, slot, lift, load, reps, effort });
    if (!relogged.ok) return unavailable("correct_set", TIER.FACT, turn_id, relogged.code || "WORKOUT_UNAVAILABLE",
      relogged.copy || null, "gym-model.logSet -> client.executeResumedWorkout");
    return assertNoLeak(ok("correct_set", TIER.FACT, turn_id, {
      removedOpId: text(turn_id, "gym-model.undo.opId", undone.opId),
      recordedOpId: text(turn_id, "gym-model.logSet.opId", relogged.opId),
      load: num(turn_id, "coach.correct_set.load (athlete stated, client stored)", Number(load), "lb"),
      reps: num(turn_id, "coach.correct_set.reps (athlete stated, client stored)", Number(reps), "rep"),
    }, { recorded: true }));
  }

  /* ---------------------------------------------- tier 2 — the PROPOSALS -- */

  /* THE MODEL MAY NEVER CONSTRUCT A NUMBER HERE. request_replan takes no numeric
     argument at all: its whole input is a fact KIND, an optional exercise id and
     free-text the engine never reads as a quantity. The proposal, its numbers and
     its reason come out of an accepted engine producer, are deep-frozen, and are
     identified by a digest OF THE ENGINE'S OWN OBJECT — so an accepted proposal
     can be compared byte-for-byte with what the engine issued. */
  const REPLAN_FACTS = Object.freeze(["volume", "phase", "ladder"]);
  const proposalId = (obj) => "prop-" + crypto.createHash("sha256")
    .update("earned/coach/proposal/v1" + JSON.stringify(obj)).digest("hex").slice(0, 16);
  const freeze = (v) => { const c = JSON.parse(JSON.stringify(v)); (function f(n) { if (n && typeof n === "object") { Object.values(n).forEach(f); Object.freeze(n); } })(c); return c; };

  function engineProposal(s, fact, exId) {
    if (fact === "volume") {
      const v = E.volumeImbalance(s);
      if (!v || !v.actionable || !v.taker) return null;
      const body = freeze({ kind: "sets", muscle: v.taker.mg, weeklySetsNow: v.taker.sets, addWeeklySets: v.need,
        expectedGainPct: v.gain, smallestDetectablePct: v.sdes, regime: v.regimeKey });
      return { producer: "volume.volumeImbalance", engineSource: "rebuild/engine/volume.cjs volumeImbalance", body, reason: v.why };
    }
    if (fact === "phase") {
      const p = E.phaseProposal(s);
      if (!p) return null;
      return { producer: "policy.phaseProposal", engineSource: "rebuild/engine/policy.cjs phaseProposal", body: freeze(p), reason: p.body || p.why || p.title || null };
    }
    if (fact === "ladder") {
      const l = exId ? E.proposeLadder(s, exId) : null;
      if (!l) return null;
      return { producer: "progression.proposeLadder", engineSource: "rebuild/engine/progression.cjs proposeLadder", body: freeze(l), reason: l.why || l.t || null };
    }
    return null;
  }

  async function request_replan(args, turn_id) {
    const fact = args && args.fact;
    if (!REPLAN_FACTS.includes(fact)) {
      return unavailable("request_replan", TIER.PROPOSAL, turn_id, CODES.REPLAN_ENTRY_ABSENT,
        "No accepted engine entry point re-plans on that kind of fact yet. The engine re-plans on: " + REPLAN_FACTS.join(", ") + ".",
        "rebuild/engine — no accepted replan-on-coach-facts producer exists");
    }
    if (args && Object.keys(args).some((k) => typeof args[k] === "number")) {
      return unavailable("request_replan", TIER.PROPOSAL, turn_id, CODES.PROPOSAL_NOT_ENGINE_ISSUED,
        "This tool takes no numbers. A proposal's numbers come from the engine, never from the conversation.",
        "VOICE-COACH-BRIEF.md tier 2");
    }
    const found = engineProposal(st(), fact, args && args.exerciseId);
    if (!found) {
      return unavailable("request_replan", TIER.PROPOSAL, turn_id, CODES.ENGINE_ISSUED_NO_PROPOSAL,
        "The engine has no proposal to make about that right now. Nothing changes.", "engine producer returned null");
    }
    const id = proposalId({ producer: found.producer, body: found.body, reason: found.reason });
    const record = freeze({ proposal_id: id, producer: found.producer, engine_source: found.engineSource,
      body: found.body, reason: found.reason, issued_for_day: day });
    issued.set(id, record);
    return assertNoLeak(ok("request_replan", TIER.PROPOSAL, turn_id, {
      proposalId: tagged(turn_id, "coach.proposal.id", id, "id", ""),
      producer: text(turn_id, "coach.proposal.producer", found.producer),
      reason: text(turn_id, found.engineSource + " (reason)", found.reason),
      addWeeklySets: num(turn_id, found.engineSource + ".need", found.body.addWeeklySets, "set"),
      muscle: text(turn_id, found.engineSource + ".taker.mg", found.body.muscle),
      weeklySetsNow: num(turn_id, found.engineSource + ".taker.sets", found.body.weeklySetsNow, "set"),
    }, { proposal: record, awaiting_yes: true, state_unchanged: true }));
  }

  /* The yes. It goes through the EXISTING consent path — rebuild/client
     index.cjs respond() (a durable `proposal-response` operation) and
     recordIssuance() (the issuance ledger) — and the engine's own reason is
     stored beside it, because "saved" alone is not evidence the engine used it. */
  async function accept_proposal(args, turn_id) {
    const id = args && args.proposal_id;
    if (!args || args.confirmed !== true) {
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, CODES.CONFIRMATION_REQUIRED,
        "Nothing is accepted without your yes. Your plan is unchanged.", "VOICE-COACH-BRIEF.md tier 2");
    }
    if (!id || !issued.has(id)) {
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, CODES.PROPOSAL_NOT_ENGINE_ISSUED,
        "That is not a proposal the engine issued in this conversation, so it cannot be accepted.", "coach.issued ledger");
    }
    if (!consent || typeof consent.respond !== "function") {
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, CODES.CONSENT_SURFACE_ABSENT,
        "The consent surface is not reachable on this device, so your yes cannot be recorded. Nothing changed.",
        "rebuild/client/index.cjs respond()/recordIssuance()");
    }
    const record = issued.get(id);
    const answered = consent.respond(id, "accept");
    if (!answered || answered.acknowledged !== true) {
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, (answered && answered.code) || "PLAN_CONSENT_NOT_ACKNOWLEDGED",
        (answered && answered.copy) || null, "rebuild/client/index.cjs respond()");
    }
    let issuance = null;
    if (typeof consent.recordIssuance === "function") issuance = consent.recordIssuance({ id, accepted: true, instance: null });
    const entry = freeze({ proposal_id: id, proposal: record, reason: record.reason,
      op_id: answered.op_id || null, issuance_stored: !!(issuance && issuance.stored), turn_id });
    accepted.set(id, entry);
    consentLedger.push(entry);
    return assertNoLeak(ok("accept_proposal", TIER.PROPOSAL, turn_id, {
      proposalId: tagged(turn_id, "coach.proposal.id", id, "id", ""),
      reason: text(turn_id, record.engine_source + " (reason, stored with the yes)", record.reason),
      opId: text(turn_id, "rebuild/client respond().op_id", answered.op_id),
    }, { accepted: entry, recorded: true }));
  }

  /* ------------------------------------------------- tier 3 — never here -- */

  async function cannot_change_via_coach(args, turn_id) {
    const topic = args && args.topic;
    const why = NEVER_VIA_COACH[topic];
    if (!why) {
      return assertNoLeak(ok("cannot_change_via_coach", TIER.REFUSED, turn_id, {
        topic: text(turn_id, "coach.request.topic", String(topic || "unknown")),
        explanation: text(turn_id, "coach.tier3", "That is not something this conversation changes. This conversation doesn't change your plan."),
      }, { refused: true, state_unchanged: true }));
    }
    return assertNoLeak(ok("cannot_change_via_coach", TIER.REFUSED, turn_id, {
      topic: text(turn_id, "coach.request.topic", topic),
      explanation: text(turn_id, "coach.tier3." + topic, why),
    }, { refused: true, state_unchanged: true }));
  }

  /* -------------------------------------------------------------- wiring -- */

  const TOOLS = Object.freeze({
    today_plan, current_set, next_set, last_comparable_performance, weight_trend,
    today_checkin, why_this_instruction,
    record_pain_or_soreness, equipment_unavailable_today, correct_set, time_away, answer_checkin,
    request_replan, accept_proposal, cannot_change_via_coach,
  });
  const TIERS = Object.freeze({
    today_plan: TIER.READ, current_set: TIER.READ, next_set: TIER.READ,
    last_comparable_performance: TIER.READ, weight_trend: TIER.READ, today_checkin: TIER.READ,
    why_this_instruction: TIER.READ,
    record_pain_or_soreness: TIER.FACT, equipment_unavailable_today: TIER.FACT, correct_set: TIER.FACT,
    time_away: TIER.FACT, answer_checkin: TIER.FACT,
    request_replan: TIER.PROPOSAL, accept_proposal: TIER.PROPOSAL,
    cannot_change_via_coach: TIER.REFUSED,
  });

  /* A TURN. Every result a turn produces carries its id, and the traceability
     check is scoped to exactly that turn — a number spoken now cannot borrow its
     provenance from an earlier answer. */
  function openTurn(turn_id) {
    if (typeof turn_id !== "string" || !turn_id) throw new TypeError("openTurn: a turn_id is required");
    const results = [];
    const bound = {};
    for (const [name, fn] of Object.entries(TOOLS)) {
      bound[name] = async (args) => { const r = await fn(args, turn_id); results.push(r); return r; };
    }
    return Object.freeze({ turn_id, results, call: bound,
      untraceable: (answer) => untraceable(answer, results, turn_id),
      traceable: (answer) => traceable(answer, results, turn_id) });
  }

  return Object.freeze({ TOOLS, TIERS, TIER, openTurn, day,
    issuedProposals: () => Array.from(issued.values()),
    acceptedProposals: () => Array.from(accepted.values()),
    consentLedger: () => consentLedger.slice() });
}

/* --------------------------------------------------------- the cost cap -- */

/* "Hard spending cap on the API account before the first real conversation"
   (owner ruling). NO CAP = NO SESSION. This refuses by default: an absent record,
   an unverified one, a stale one or one carrying anything credential-shaped all
   fail, and there is no override flag anywhere in this file. */
const CAP_REQUIRED = Object.freeze(["provider", "account_label", "cap_usd_month", "cap_usd_session",
  "per_minute_usd", "verified_at", "verified_by", "evidence"]);
/* Ten credential shapes, the same posture as the slice's deploy guard: a cap
   record is a receipt, never a place to park a key. */
const CREDENTIAL_SHAPES = Object.freeze([
  /\bsk-[A-Za-z0-9_-]{16,}/, /\bgh[pousr]_[A-Za-z0-9]{16,}/, /\bAKIA[0-9A-Z]{12,}/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, /\bBearer\s+[A-Za-z0-9._-]{16,}/i,
  /\bAIza[0-9A-Za-z_-]{20,}/, /\bnpm_[A-Za-z0-9]{20,}/, /\b[A-Fa-f0-9]{40,}\b/,
]);

function verifyCostCap(record, options) {
  const now = (options && options.now) || new Date().toISOString();
  const maxAgeDays = (options && options.maxAgeDays) || 30;
  if (!record || typeof record !== "object") {
    return { ok: false, code: CODES.COST_CAP_ABSENT, reason: "No cost-cap record was supplied. No live session may start." };
  }
  const missing = CAP_REQUIRED.filter((k) => record[k] === undefined || record[k] === null || record[k] === "");
  if (missing.length) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "Cap record is missing: " + missing.join(", ") };
  for (const k of ["cap_usd_month", "cap_usd_session", "per_minute_usd"]) {
    if (typeof record[k] !== "number" || !Number.isFinite(record[k]) || record[k] <= 0) {
      return { ok: false, code: CODES.COST_CAP_INVALID, reason: k + " must be a positive number" };
    }
  }
  if (record.verified !== true) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "verified must be exactly true — a cap nobody checked is not a cap" };
  const blob = JSON.stringify(record);
  for (const shape of CREDENTIAL_SHAPES) {
    if (shape.test(blob)) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "the cap record carries something credential-shaped; a cap record is a receipt, never a key" };
  }
  const at = Date.parse(record.verified_at);
  if (!Number.isFinite(at)) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "verified_at is not an ISO timestamp" };
  const ageDays = (Date.parse(now) - at) / 86400000;
  if (!Number.isFinite(ageDays) || ageDays < 0) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "verified_at is in the future" };
  if (ageDays > maxAgeDays) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "the cap was last verified " + Math.round(ageDays) + " days ago; re-verify before a live session" };
  if (record.cap_usd_session > record.cap_usd_month) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "a session cap above the monthly cap is not a cap" };
  return { ok: true, code: null, reason: null, capUsdMonth: record.cap_usd_month, capUsdSession: record.cap_usd_session };
}

/* The one gate in front of anything live. There is deliberately no live session
   in this task: this refuses, and a future adapter must call it first. */
function startLiveSession({ cap, now, optIn } = {}) {
  const verdict = verifyCostCap(cap, { now });
  if (!verdict.ok) return { started: false, code: verdict.code, reason: verdict.reason };
  if (optIn !== true) return { started: false, code: "COACH_OPT_IN_REQUIRED", reason: "Each user opts in on a screen that names what leaves the phone. Nothing starts without it." };
  return { started: false, code: "COACH_NO_LIVE_ADAPTER", reason: "The cap and the opt-in are in order. No live model adapter exists in this build; the text-first prototype is the only coach here." };
}

module.exports = {
  createCoachTools, TIER, CODES, NEVER_VIA_COACH, TIER3_TOPICS,
  tagged, blank, num, text, numericTokens, collectTagged, allowedTokens, untraceable, traceable,
  CHARTER_BANNED, charterViolations, FORBIDDEN_KEYS, assertNoLeak,
  verifyCostCap, startLiveSession, CAP_REQUIRED,
};
