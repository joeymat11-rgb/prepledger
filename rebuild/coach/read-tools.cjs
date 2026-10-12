"use strict";

/* read-tools.cjs - the coach's seven TIER.READ tools (Coach v1, S19 amend), moved byte for byte out of tools.cjs
   createCoachTools, which now takes them from here. createReadTools(world) is the same shape createCoachTools
   returns ({ TOOLS, TIERS, TIER, openTurn, day }) with the read tools only: no FACT tool, no proposal, no consent
   path. It is what the page composes (page-coach.cjs), so the Today page carries the coach's reads and none of
   its writers. It requires only tool-kernel.cjs. */

const K = require("./tool-kernel.cjs");
const {
  provenance, UNKNOWN_TOOL_COPY, COMPLETE_REFUSALS, refusalHasOwnEnding, TIER, tagged, blank, isNum, num, text,
  TOKEN, numericTokens, collectTagged, UNIT_WORDS, FIELD_WORDS, UNIT_FILLER, STOP_PUNCT, ATOM, ISO_DATE,
  UNKNOWN_UNIT, unknownNoun, BARE_SPEAKABLE, perWeek, unitAfter, unitBefore, parseUnits, allowedTokens,
  untraceable, traceable, CHARTER_BANNED, escapeRe, charterRe, CHARTER_PATTERNS, charterViolations,
  NEVER_VIA_COACH, TIER3_TOPICS, ok, unavailable, CODES, FORBIDDEN_KEYS, assertNoLeak, carriesNumber,
} = K;

function createReadTools(world) {
  if (!world || !world.today || typeof world.today.read !== "function") {
    throw new TypeError("createReadTools requires the slice's today adapter");
  }
  const today = world.today;
  const gym = world.gym || null;
  const checkin = world.checkin || null;
  const E = today.engine;
  const st = () => today.stateFromOps();
  const day = today.today;

  /* ------------------------------------------------------------- tier 0 -- */

  async function today_plan(_args, turn_id) {
    const view = today.read();
    const cal = view.calorieTarget, pro = view.proteinTarget;
    const values = {
      day: tagged(turn_id, "today-model.read.today", view.today, "date", view.today),
      kcalLo: num(turn_id, "energy.calorieTarget.lo", cal?.lo, "kcal"),
      kcalHi: num(turn_id, "energy.calorieTarget.hi", cal?.hi, "kcal"),
      proteinG: num(turn_id, "energy.proteinTarget.g", pro?.g, "g"),
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

  /* The recovery check-in. On the current tip it IS wired — the accepted A3 lane
     (checkin-host.mjs + checkin-model.mjs). The read is the model's own
     read-back: the approved design's question wording beside the athlete's own
     answer, with no adjective and no judgement added here.
     Blank is unknown. A day with no stored check-in answers `answered:false` and
     the model's own sentence — never "fine", never zero, and never yesterday's
     answers (the model enforces the date law). */
  async function today_checkin(_args, turn_id) {
    if (!checkin || typeof checkin.read !== "function") {
      return unavailable("today_checkin", TIER.READ, turn_id, CODES.CHECKIN_SURFACE_ABSENT,
        "No recovery check-in lane is open on this device, so there is nothing recorded to read back.",
        "rebuild/m3/w7-preview/today/checkin-model.mjs createCheckInModel");
    }
    if (typeof checkin.refresh === "function") await checkin.refresh();
    const view = checkin.read();
    const rec = view.recorded;
    return assertNoLeak(ok("today_checkin", TIER.READ, turn_id, {
      date: tagged(turn_id, "checkin-model.read.day", view.day, "date", view.day),
      answered: tagged(turn_id, "checkin-model.read.recorded", !!rec, "flag", ""),
      note: text(turn_id, "checkin-model.read.note", view.note),
      provenance: rec ? text(turn_id, "checkin-model.recorded.provenance", rec.provenance)
        : blank(turn_id, "checkin-model.recorded.provenance", "text", "nothing is recorded for this day"),
      lines: rec ? rec.lines.map((line, i) =>
        text(turn_id, "checkin-model.recordedLines[" + i + "]", line)) : [],
      /* The dated night the sleep record ALREADY holds, with its provenance —
         so the coach can state it rather than ask the same question twice
         (approved handoff, point 4). */
      sleepRecordHours: view.sleepRecord
        ? num(turn_id, "checkin-model.sleepNightFor (engine sleep.nights)", view.sleepRecord.hours, "h")
        : blank(turn_id, "checkin-model.sleepNightFor", "h", "the sleep record has no night for last night"),
      sleepRecordDate: view.sleepRecord
        ? tagged(turn_id, "checkin-model.sleepNightFor.date", view.sleepRecord.date, "date", view.sleepRecord.date)
        : blank(turn_id, "checkin-model.sleepNightFor.date", "date", "no dated night"),
    }));
  }

  const TOOLS = Object.freeze({
    today_plan, current_set, next_set, last_comparable_performance, weight_trend,
    today_checkin, why_this_instruction,
  });
  const TIERS = Object.freeze({
    today_plan: TIER.READ, current_set: TIER.READ, next_set: TIER.READ,
    last_comparable_performance: TIER.READ, weight_trend: TIER.READ, today_checkin: TIER.READ,
    why_this_instruction: TIER.READ,
  });

  /* A TURN, exactly as tools.cjs openTurn: one id, one results array, and the traceability check scoped to it. */
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

  return Object.freeze({ TOOLS, TIERS, TIER, openTurn, day });
}

module.exports = { createReadTools };
