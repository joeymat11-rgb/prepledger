"use strict";

/* read-tools.cjs - the coach's seven TIER.READ tools (Coach v1, S19 amend), moved byte for byte out of tools.cjs, and
   the page's weekly review read (week_review, Coach v1 piece 2, written here; not in tools.cjs) and today's session
   read for the page's plain answers (today_session, the polish batch, written here; not in tools.cjs). tools.cjs
   createCoachTools takes the seven from here. createReadTools(world) is the same shape createCoachTools
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

/* N2 (Fable's N1 debt D1): a local date in Today's own words (today-app.cjs dayLabel: en-US, weekday, month and day of
   the local calendar date at noon), so the coach and the food card say the same day. Held equal by problem.test.mjs
   N2-D3. */
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const dayWords = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date(y, m - 1, d, 12));
};

function createReadTools(world) {
  if (!world || !world.today || typeof world.today.read !== "function") {
    throw new TypeError("createReadTools requires the slice's today adapter");
  }
  const today = world.today;
  const gym = world.gym || null;
  const checkin = world.checkin || null;
  /* Coach v1 piece 2: the workout lane's per-lift read (today-entry.mjs weekLifts), when that lane is open. */
  const week = world.week || null;
  /* Coach v1 seat read: the page's one read of the machine settings already saved (today-entry.mjs seatSettings). */
  const seats = world.seats || null;
  const SEAT_LANE_ABSENT = "COACH_MACHINE_SETTINGS_LANE_ABSENT";
  const E = today.engine;
  const st = () => today.stateFromOps();
  const day = today.today;

  /* ------------------------------------------------------------- tier 0 -- */

  async function today_plan(_args, turn_id) {
    const view = today.read();
    const cal = view.calorieTarget, pro = view.proteinTarget;
    const values = {
      day: tagged(turn_id, "today-model.read.today", view.today, "date", view.today),
      /* E1 (Fable fd80cb84 D1; the PM's ruling at DECISIONS:989, which reverses DECISIONS:980's estimate for the gated state): a gated band's figures never reach
         the coach. While the engine's band is gated its two ends are blanks, so no calorie figure of it is a result of
         the turn at all; the flag says it is gated, and the counts say what will measure his range. */
      kcalLo: cal && cal.gated === true ? blank(turn_id, "energy.calorieTarget.lo", "kcal", "the band is gated, and a gated band is never shown")
        : num(turn_id, "energy.calorieTarget.lo", cal?.lo, "kcal"),
      kcalHi: cal && cal.gated === true ? blank(turn_id, "energy.calorieTarget.hi", "kcal", "the band is gated, and a gated band is never shown")
        : num(turn_id, "energy.calorieTarget.hi", cal?.hi, "kcal"),
      /* NUTRI 1: what will make it measured, in the counts today-model.cjs calorieGateOf reads off the engine's own
         gate inputs: days with calories logged ("day") and weigh-ins, said as "times" (the kernel's unknownNoun). */
      kcalGated: tagged(turn_id, "energy.calorieTarget.gated", !!(cal && cal.gated === true), "flag", ""),
      foodDaysLeft: num(turn_id, "today-model.calorieGate.foodLeft", view.calorieGate ? view.calorieGate.foodLeft : null, "day"),
      weighInsLeft: num(turn_id, "today-model.calorieGate.weighLeft", view.calorieGate ? view.calorieGate.weighLeft : null,
        K.unknownNoun(view.calorieGate && view.calorieGate.weighLeft === 1 ? "time" : "times")),
      /* N2 (Fable's N1 debt D1): in a blackout, the day the range is measured again (calorieGateOf blackoutUntil),
         in the words Today's food card says it (dayWords below, today-app.cjs dayLabel's own format), as text. */
      measuredAgainOn: text(turn_id, "today-model.calorieGate.blackoutUntil",
        view.calorieGate && ISO_DAY.test(view.calorieGate.blackoutUntil || "") ? dayWords(view.calorieGate.blackoutUntil) : null),
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

  /* COACH PLAIN ANSWERS (polish batch on rebuild/c-weekly). Today's session as the engine composes it, card by card
     (today-model.cjs sessionPlan, rebuild/engine/today.cjs genSession): the page's "What am I hitting today?" and
     "Why this weight?" read it. Every figure is tagged in the unit it is spoken in: a set count as "set", reps per
     set and the top of the rep range as "rep", a numeric load as "lb"; a text load (a machine setting) is carried as
     text and a bodyweight marker as a flag. It writes nothing. */
  const BODYWEIGHT_KEYS = Object.freeze(["bw", "bodyweight"]);
  /* UI-PASS13 (item 2; shot 04: "3 sets of 8 reps at 95 lb" for every lift while the set screen said 95 x 10). The
     sets, reps and loads come from the SET SCREEN'S OWN SOURCE whenever the gym card holds one: the capture its own
     read() prepared (gym-model.mjs prescriptions), lift by lift, set by set. The engine plan above stands on the Today
     model's state, which carries no native workout history and no native-load spend, so its targets are not the card's
     once a lift has history. The plan still names the session and each lift and carries the flags the "why" needs; with
     no gym lane on this device (no store) it is the only source, and its figures are said as before.
     N2 Part A (Fable 86af076c D1): the capture is a SNAPSHOT of the card's own last read, and the coach never calls
     gym.read() for it. A read is not free: it hands back and clears the card's one-shot message (a refusal the athlete
     has not yet seen) and re-prepares the card's preparedId, so a coach question would eat the card's refusal. Until
     the card has read once there is no snapshot, and the plan's figures stand as with no gym lane. */
  async function capturedSets() {
    if (!gym || typeof gym.prescriptions !== "function") return null;
    let rows = null;
    try { rows = gym.prescriptions(); } catch (_) { return null; }
    return Array.isArray(rows) && rows.length ? rows : null;
  }
  async function today_session(_args, turn_id) {
    const plan = typeof today.sessionPlan === "function" ? today.sessionPlan() : null;
    if (!plan || plan.available !== true) {
      if (plan && plan.code) {
        return unavailable("today_session", TIER.READ, turn_id, plan.code, null, "today-model.sessionPlan (engine genSession)");
      }
      return assertNoLeak(ok("today_session", TIER.READ, turn_id, {
        available: tagged(turn_id, "today-model.sessionPlan.available", false, "flag", ""),
        name: blank(turn_id, "today-model.sessionPlan.name", "code", "no session is planned today"),
        lifts: [],
      }));
    }
    const captured = await capturedSets();
    const exercises = plan.exercises.map((ex, i) => {
      const at = "today-model.sessionPlan.exercises[" + i + "]";
      const ci = captured ? captured.findIndex((row) => row && row.lift === ex.id) : -1;
      const row = ci >= 0 ? captured[ci] : null;
      const cat = "gym-model.prescriptions[" + ci + "]";
      /* the capture's loads, set by set: one figure when every set carries the same one, each set's otherwise */
      const loads = row ? row.sets.map((s) => s.load) : [];
      const oneLoad = row && loads.length > 0 && loads.every((v) => typeof v === "number" && v === loads[0]) ? loads[0] : null;
      const setting = row ? (row.sets.map((s) => s.setting).find((v) => typeof v === "string" && v.trim()) || "") : "";
      const textLoad = row ? setting.trim() : typeof ex.weight === "string" ? ex.weight.trim() : "";
      const bodyweight = textLoad !== "" && BODYWEIGHT_KEYS.includes(textLoad.toLowerCase());
      const numericLoad = row ? oneLoad : typeof ex.weight === "number" ? ex.weight : null;
      return Object.freeze({
        /* batch 2: the card's lift id, so "What did I do last time?" matches each lift to the gym card's last sets */
        id: tagged(turn_id, at + ".id (genSession card.id)", ex.id, "id", ""),
        name: text(turn_id, at + ".name (genSession card.n)", ex.name),
        sets: row ? num(turn_id, cat + ".sets length (capture slots)", row.sets.length, "set")
          : num(turn_id, at + ".sets (genSession card.tgt length)", ex.sets, "set"),
        reps: row ? row.sets.map((s, k) => num(turn_id, cat + ".sets[" + k + "].reps (capture reps cell)", s.reps, "rep"))
          : ex.reps.map((r, k) => num(turn_id, at + ".reps[" + k + "] (genSession card.tgt)", r, "rep")),
        load: typeof numericLoad === "number" ? num(turn_id, row ? cat + ".sets[0].load (capture load cell)" : at + ".weight (genSession card.w)", numericLoad, "lb")
          : blank(turn_id, at + ".weight", "lb", "no numeric load"),
        /* the capture's per-set loads when they differ, so the line says each set as the set screen does */
        setLoads: row && oneLoad === null && loads.length > 1 && loads.every((v) => typeof v === "number")
          ? loads.map((v, k) => num(turn_id, cat + ".sets[" + k + "].load (capture load cell)", v, "lb")) : [],
        textLoad: textLoad !== "" && !bodyweight ? text(turn_id, row ? cat + ".sets.setting (capture load cell, a setting)" : at + ".weight (genSession card.w, a setting)", textLoad)
          : blank(turn_id, at + ".weight", "text", "no text load"),
        bodyweight: tagged(turn_id, at + ".weight (bodyweight marker)", bodyweight, "flag", ""),
        /* with the capture, a first time is what the set screen shows as one: no set carries a load or a setting */
        firstTime: row ? tagged(turn_id, cat + ".sets (no load cell specified)", row.sets.every((s) => s.load === null && !s.setting), "flag", "")
          : tagged(turn_id, at + ".firstTime (genSession card.baselineAsk)", ex.firstTime === true, "flag", ""),
        newWeight: tagged(turn_id, at + ".newWeight (genSession card.isDebutNow)", ex.newWeight === true, "flag", ""),
        held: tagged(turn_id, at + ".held (engine lift holdFlag)", ex.held === true, "flag", ""),
        repTop: num(turn_id, at + ".repTop (engine lift hi)", ex.repTop, "rep"),
      });
    });
    return assertNoLeak(ok("today_session", TIER.READ, turn_id, {
      available: tagged(turn_id, "today-model.sessionPlan.available", true, "flag", ""),
      name: tagged(turn_id, "today-model.sessionPlan.name (genSession name)", plan.name, "code", ""),
      /* `lifts`, not `exercises`: the leak check refuses a key the engine state uses (tool-kernel FORBIDDEN_KEYS). */
      lifts: exercises,
    }));
  }

  /* COACH V1 BATCH 2 ("What did I do last time?", every lift). The "Last time" sets of every lift the engine composes
     today, as the gym card reads them (gym-model.mjs lastTimes: card.prev through previousAt, the same reader the card's
     own "Last time" line uses). The card's last read is taken first, as current_set takes it, so its projection is today's. Each set's
     load is tagged "lb" and its reps "rep"; a lift with no earlier session has no sets. It writes nothing. */
  async function last_times(_args, turn_id) {
    const got = await gymView("last_times", turn_id);
    if (got.fail) return got.fail;
    if (typeof gym.lastTimes !== "function") {
      return unavailable("last_times", TIER.READ, turn_id, CODES.GYM_SESSION_ABSENT, null, "gym-model.mjs lastTimes");
    }
    const rows = gym.lastTimes();
    return assertNoLeak(ok("last_times", TIER.READ, turn_id, {
      lifts: (Array.isArray(rows) ? rows : []).map((row, i) => Object.freeze({
        id: tagged(turn_id, "gym-model.lastTimes[" + i + "].lift", row.lift, "id", ""),
        sets: (row.sets || []).map((set, k) => Object.freeze({
          load: num(turn_id, "gym-model.lastTimes[" + i + "].sets[" + k + "].load (card.prev)", set.load, "lb"),
          reps: num(turn_id, "gym-model.lastTimes[" + i + "].sets[" + k + "].reps (card.prev)", set.reps, "rep"),
        })),
      })),
    }));
  }

  /* COACH V1 SEAT READ (PM ruling option A). The machine settings already saved for each lift of today's workout, read
     through the page's one read of the sealed gym lane (world.seats.read: today-entry.mjs seatSettings over
     gym-settings-lane.mjs readSavedSettings, the lane's own single store handle). Each setting is carried as the athlete
     wrote it, its name and value together as one text ("seat 4"), so the number check reads a figure in it exactly as it
     is said; the cue as its own text. A lift with nothing saved has no settings. It writes nothing. */
  async function seat_settings(_args, turn_id) {
    if (!seats || typeof seats.read !== "function") {
      return unavailable("seat_settings", TIER.READ, turn_id, SEAT_LANE_ABSENT, null, "today-entry.mjs seatSettings");
    }
    const plan = typeof today.sessionPlan === "function" ? today.sessionPlan() : null;
    const ids = plan && plan.available === true ? plan.exercises.map((ex) => ex.id).filter((id) => typeof id === "string" && id) : [];
    const got = await seats.read(ids);
    if (!got || got.ok !== true || !Array.isArray(got.rows)) {
      return unavailable("seat_settings", TIER.READ, turn_id, SEAT_LANE_ABSENT, null, "gym-settings-lane.mjs readSavedSettings");
    }
    return assertNoLeak(ok("seat_settings", TIER.READ, turn_id, {
      lifts: got.rows.map((row, i) => {
        const machine = row.latest && row.latest.machine ? row.latest.machine : null;
        const from = "machine-settings" + (row.latest && row.latest.op_id ? ".op " + row.latest.op_id : "") + " [" + i + "]";
        return Object.freeze({
          id: tagged(turn_id, from + " lift", row.lift, "id", ""),
          settings: (machine && Array.isArray(machine.settings) ? machine.settings : []).map((pair, k) =>
            text(turn_id, from + " settings[" + k + "]", [pair && pair.name, pair && pair.value].filter((s) => typeof s === "string" && s.trim()).join(" "))),
          cues: machine && typeof machine.cues === "string" && machine.cues.trim() ? text(turn_id, from + " cues", machine.cues)
            : blank(turn_id, from + " cues", "text", "no cue is saved for this lift"),
        });
      }),
    }));
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
      /* DECISIONS:982: with no lean-mass estimate the floor is not a number and its own sentence says "NaN"; that
         sentence never reaches the coach, which carries a blank instead (the band skips such a floor, energy.cjs). */
      const fl = E.calorieFloor(s);
      values.body = Number.isFinite(fl.floor) ? text(turn_id, "energy.calorieFloor.why", fl.why)
        : blank(turn_id, "energy.calorieFloor.why", "text", "no lean-mass estimate yet, so no floor is measured");
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
     gym-model.mjs lastRead(), the view the card's own last read() returned, which computes nothing of its own either.
     N2 Part A (PM, after Fable 86af076c D1): the coach never calls gym.read(), which would clear the card's one-shot
     refusal and re-prepare its preparedId; before the card has read once there is no view, and the tool says so by
     code, with no words of its own. A refusal from
     the layer is carried with the layer's own code — PERFORMED_NATIVE_TREND_-
     CONTEXT_REQUIRED, WORKOUT_PREPARATION_INVALID and the rest reach the coach
     unedited, because inventing a friendlier sentence is how a guess starts. */
  async function gymView(tool, turn_id) {
    if (!gym) return { fail: unavailable(tool, TIER.READ, turn_id, CODES.GYM_SESSION_ABSENT,
      "No gym session is composed on this device, so there is no set to read.", "rebuild/m3/w7-preview/today/gym-model.mjs") };
    const view = typeof gym.lastRead === "function" ? gym.lastRead() : null;
    if (!view) return { fail: unavailable(tool, TIER.READ, turn_id, "WORKOUT_NOT_READY", null,
      "rebuild/m3/w7-preview/today/gym-model.mjs lastRead() (the card has not read yet)") };
    if (view.phase === "blocked" || view.phase === "unfinished") {
      return { fail: unavailable(tool, TIER.READ, turn_id, view.code || "WORKOUT_UNAVAILABLE",
        view.copy || null, "rebuild/m3/w7-preview/today/gym-model.mjs lastRead()") };
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

  /* ------------------------------------------------- the weekly review -- */

  /* WEEKLY REVIEW (S19 amend, Coach v1 piece 2, PM ruling option A). NOT moved from tools.cjs: the page's own READ of
     a training week. The week runs Monday to Sunday (the engine's own week, writers.cjs propose() keys its weekly rid
     families on the Monday). On a Monday the review is of the week just ended ("last"); on any other day it is of this
     week so far ("this"). Every figure is a tool result: the workouts done are the gym card's closed sessions dated in
     the window (gym-model.mjs weekSessions), the workouts planned are the days the engine plans a workout on across the
     whole week (today-model.cjs plannedDays, engine sessionMembership), each lift's standing is the native-load host's
     own check (an offer's engine reason, or its refusal code, today-entry.mjs weekLifts), the open suggestion is the
     engine's own open proposal on Today, and the trend is weight_trend above, read in this same turn. A count has no
     unit word, so it is tagged "?" and may be said bare (tool-kernel.cjs BARE_SPEAKABLE). It writes nothing. */
  const shiftDay = (iso, n) => new Date(Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10)) + n)).toISOString().slice(0, 10);
  function weekWindow(iso) {
    const sinceMonday = (new Date(Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))).getUTCDay() + 6) % 7;
    if (sinceMonday === 0) return { which: "last", from: shiftDay(iso, -7), to: shiftDay(iso, -1), planEnd: shiftDay(iso, -1) };
    const from = shiftDay(iso, -sinceMonday);
    return { which: "this", from, to: iso, planEnd: shiftDay(from, 6) };
  }
  /* "2026-10-06" -> "Oct 6" (a calendar day, no year), or null for anything that is not an ISO day. */
  const MONTHS = Object.freeze(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  const monthDay = (iso) => (typeof iso === "string" && /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(iso)
    ? MONTHS[Number(iso.slice(5, 7)) - 1] + " " + Number(iso.slice(8, 10)) : null);
  /* One weight for every set, or null: a vector whose sets differ, or that carries a position with no pounds, has none. */
  const sameLoad = (vector) => (Array.isArray(vector) && vector.length > 0
    && vector.every((v) => typeof v === "number" && Number.isFinite(v) && v > 0 && v === vector[0]) ? vector[0] : null);
  const WEEK_NO_RECORD = "No workout record is open on this device, so there is no week to review.";
  /* POLISH 4 (PM, the owner's 7-lift Upper/Lower week: ten held lines ran the card past Start). The review is GROUPED,
     and the groups are read here from each lift's own status and code: "ready" (an offer), "news" (a held notice, or a
     new weight agreed or just landed: native-load.cjs TARGET_QUEUED, DEBUT_LANDED; the held notices are today-entry.mjs
     noticesOf's two codes) or "steady" (any other: the lift was not raised this week). The counts the review says are
     tagged here, each in the noun it is said with (a lift count in "lift"; the open suggestion, of which Today holds at
     most one, in its own word through the kernel's unknownNoun), so the number check reads every one as a tool result
     of the turn. The steady line names the first WEEK_STEADY_NAMED lifts and says how many more there are; five or
     fewer are all named. */
  const WEEK_NEWS_CODES = Object.freeze(["NATIVE_LOAD_TARGET_QUEUED", "NATIVE_LOAD_DEBUT_LANDED"]);
  const WEEK_NEWS_HOLDS = Object.freeze(["conflict", "disputed"]);
  const WEEK_STEADY_NAMED = 4;
  function planOrder(rows) {
    let todays = [], plan = [];
    try {
      const session = typeof today.sessionPlan === "function" ? today.sessionPlan() : null;
      todays = session && session.available === true && Array.isArray(session.exercises) ? session.exercises.map((ex) => ex.id) : [];
    } catch (_) { todays = []; }
    try {
      const state = typeof today.stateFromOps === "function" ? today.stateFromOps() : null;
      plan = state && Array.isArray(state.exercises) ? state.exercises.map((ex) => ex && ex.id) : [];
    } catch (_) { plan = []; }
    const rank = (row) => {
      const t = todays.indexOf(row.lift);
      if (t >= 0) return t;
      const p = plan.indexOf(row.lift);
      return p >= 0 ? todays.length + p : todays.length + plan.length;
    };
    return rows.map((row, i) => ({ row, i, r: rank(row) })).sort((a, b) => a.r - b.r || a.i - b.i).map((x) => x.row);
  }
  const weekGroup = (row) => (row.status === "offer" ? "ready"
    : (row.status === "held" ? WEEK_NEWS_HOLDS : WEEK_NEWS_CODES).includes(row.code) ? "news" : "steady");
  async function week_review(_args, turn_id) {
    if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !gym || typeof gym.weekSessions !== "function"
      || typeof today.plannedDays !== "function") {
      return unavailable("week_review", TIER.READ, turn_id, CODES.GYM_SESSION_ABSENT, WEEK_NO_RECORD, "gym-model.mjs weekSessions");
    }
    const w = weekWindow(day);
    const sessions = await gym.weekSessions(w.from, w.to);
    if (!sessions || sessions.ok !== true || typeof sessions.done !== "number") {
      return unavailable("week_review", TIER.READ, turn_id, (sessions && sessions.code) || CODES.GYM_SESSION_ABSENT,
        WEEK_NO_RECORD, "gym-model.mjs weekSessions");
    }
    const planned = today.plannedDays(w.from, w.planEnd);
    const read = week && typeof week.lifts === "function" ? await week.lifts(w.from, w.to) : null;
    /* POLISH 5 (PM, item 6): the lifts in PLAN ORDER, today's day first: today's session in the engine's own order
       (today-model.cjs sessionPlan), then every other lift in the order the plan holds them (stateFromOps). A lift
       neither names keeps the order the read gave it, after them. Nothing is dropped or added. */
    const liftsRead = read && read.ok === true && Array.isArray(read.lifts) ? { ...read, lifts: planOrder(read.lifts) } : read;
    /* POLISH 5 (PM, item 6): the first weeks. Fewer than two closed workouts on this device before the week reviewed
       is too little history for any lift to be judged, so the summary says no lift is ready YET rather than that every
       lift held steady. The same read as `done`, over everything before the window. */
    const before = await gym.weekSessions("0000-01-01", shiftDay(w.from, -1));
    const early = !!(before && before.ok === true && typeof before.done === "number" && before.done < 2);
    const trend = await weight_trend({}, turn_id);
    const view = today.read();
    const open = view && view.proposal && typeof view.proposal.title === "string" ? view.proposal : null;
    const groups = liftsRead && liftsRead.ok === true ? liftsRead.lifts.map(weekGroup) : [];
    const inGroup = (g) => groups.filter((x) => x === g).length;
    const steady = inGroup("steady");
    const values = {
      which: tagged(turn_id, "coach.week.which (Monday reviews the week just ended)", w.which, "flag", ""),
      from: tagged(turn_id, "coach.week.from", w.from, "date", w.from),
      to: tagged(turn_id, "coach.week.to", w.to, "date", w.to),
      done: tagged(turn_id, "gym-model.weekSessions.done (closed sessions in the window)", sessions.done, "?"),
      planned: tagged(turn_id, "today-model.plannedDays (engine sessionMembership)", Array.isArray(planned) ? planned.length : 0, "?"),
      liftsKnown: tagged(turn_id, "today-entry.weekLifts.ok", !!(liftsRead && liftsRead.ok === true), "flag", ""),
      firstWeeks: tagged(turn_id, "gym-model.weekSessions.done before the window (fewer than two; polish 5)", early, "flag", ""),
      lifts: liftsRead && liftsRead.ok === true ? liftsRead.lifts.map((row, i) => Object.freeze({
        name: text(turn_id, "today-entry.weekLifts[" + i + "].name", row.name),
        status: tagged(turn_id, "today-entry.weekLifts[" + i + "].status", row.status, "code", ""),
        group: tagged(turn_id, "coach.week.group (ready, news or steady; polish 4)", groups[i], "code", ""),
        code: tagged(turn_id, "today-entry.weekLifts[" + i + "].code (native-load.cjs refusal)", row.code || null, "code", ""),
        reason: row.status === "offer" ? text(turn_id, "native-load.cjs offer reason (today-entry.weekLifts[" + i + "])", row.reason)
          : blank(turn_id, "native-load.cjs offer reason", "text", "a refused or held lift carries no offer reason"),
        /* COACH V1 BATCH 2 (the plain Why?): the offer's own facts, so the card can say it in plain words. Its kind
           (native-load.cjs: earn, adopt-baseline, adopt-observed), the workout's day as "Oct 6", and the offered
           weight and the weight it was earned at, each tagged "lb" only when every set carries the same pounds (the
           offer's target_load and base_load vectors, today-bindings.mjs loads / current). */
        kind: tagged(turn_id, "today-entry.weekLifts[" + i + "].kind (native-load offer kind)", row.status === "offer" ? row.kind || null : null, "code", ""),
        day: row.status === "offer" ? text(turn_id, "today-entry.weekLifts[" + i + "].date (month and day)", monthDay(row.date))
          : blank(turn_id, "today-entry.weekLifts.date", "text", "only an offer is explained"),
        targetLb: row.status === "offer" ? num(turn_id, "today-entry.weekLifts[" + i + "].loads (offer target_load, every set)", sameLoad(row.loads), "lb")
          : blank(turn_id, "today-entry.weekLifts.loads", "lb", "only an offer carries a target"),
        baseLb: row.status === "offer" ? num(turn_id, "today-entry.weekLifts[" + i + "].current (offer base_load, every set)", sameLoad(row.current), "lb")
          : blank(turn_id, "today-entry.weekLifts.current", "lb", "only an offer carries a base"),
      })) : [],
      suggestion: open ? Object.freeze({
        title: text(turn_id, "today-model.proposal.title (engine proposal)", open.title),
        lift: text(turn_id, "today-model.proposal.lift", open.lift),
        why: text(turn_id, "today-model.proposal.why (engine proposal)", open.why),
      }) : null,
      trend: trend && trend.ok ? trend.values : null,
      counts: Object.freeze({
        ready: tagged(turn_id, "coach.week.counts.ready (lifts offered a new weight)", inGroup("ready"), "lift"),
        steadyMore: tagged(turn_id, "coach.week.counts.steadyMore (steady lifts past the ones named)",
          steady > WEEK_STEADY_NAMED + 1 ? steady - WEEK_STEADY_NAMED : 0, "lift"),
        suggestions: tagged(turn_id, "today-model.proposal (the open suggestion on Today; at most one)", open ? 1 : 0,
          unknownNoun("suggestion")),
      }),
    };
    return assertNoLeak(ok("week_review", TIER.READ, turn_id, values));
  }

  const TOOLS = Object.freeze({
    today_plan, current_set, next_set, last_comparable_performance, weight_trend,
    today_checkin, why_this_instruction, week_review, today_session, last_times, seat_settings,
  });
  const TIERS = Object.freeze({
    today_plan: TIER.READ, current_set: TIER.READ, next_set: TIER.READ,
    last_comparable_performance: TIER.READ, weight_trend: TIER.READ, today_checkin: TIER.READ,
    why_this_instruction: TIER.READ, week_review: TIER.READ, today_session: TIER.READ, last_times: TIER.READ,
    seat_settings: TIER.READ,
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
