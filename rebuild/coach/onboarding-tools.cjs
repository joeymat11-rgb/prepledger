"use strict";

/* onboarding-tools.cjs - the coach's ONLY window onto Dad's first run (C6 Part A,
 * BRIEF-C6-VOICE-ONBOARDING.md section 2).
 *
 * C6 IS NOT A SECOND WAY TO BUILD A WEEK. It is a second way to answer the same
 * six questions. Every tool below drives the SCREENS' OWN setters in
 * setup-model.mjs, and `submit` calls setup-commands.mjs `prepare` exactly as the
 * Start button does. The op is the same op, byte for byte, and
 * test/onboarding-parity.test.cjs proves it rather than promising it.
 *
 * THE SAFETY ARGUMENT IS STRUCTURAL, NOT PROMISED. There is no tool here that
 * sets `sets`, `hi` or a day's session kind. Those are Earned's: the standard
 * start lives in setup-model.mjs (STANDARD_SETS, STANDARD_HI) and the day-kind
 * rule in split-kinds.mjs proposeKinds. `review` READS THEM BACK, verbatim, and a
 * model that wants to change one has no tool to call, so it cannot. That is
 * DECISIONS:89 ("the model never authors plan numbers") made mechanical.
 *
 * NO MODEL, NO NETWORK, NO KEY. This module imports tools.cjs for the tag and
 * traceability vocabulary and nothing else; the setup model, the catalogue and
 * the producer command are INJECTED, so nothing here reaches for a store either.
 */

const T = require("./tools.cjs");

const TIER = T.TIER;
const CODES = T.CODES;

/* THE SEVEN, exactly the DECISIONS:134 names, in the order the six questions are
   asked. The eighth key is the tier-3 refusal, modelled on tools.cjs
   cannot_change_via_coach. */
const ONBOARDING_TOOLS = Object.freeze([
  "set_name",
  "set_days",
  "add_exercise_from_catalogue",
  "set_machine_settings",
  "set_priorities",
  "review",
  "submit",
]);

/* The frozen registry, exactly as tools.cjs does it for the fifteen daily tools.
   `dispatch` below is the ONLY entry point, and a name that is not a key here
   never reaches an implementation. */
const TIERS = Object.freeze({
  set_name: TIER.FACT,
  set_days: TIER.FACT,
  add_exercise_from_catalogue: TIER.FACT,
  set_machine_settings: TIER.FACT,
  set_priorities: TIER.FACT,
  review: TIER.READ,
  submit: TIER.FACT,
  cannot_set_via_coach: TIER.REFUSED,
});

const C6_CODES = Object.freeze({
  TOOL_NOT_IN_LIST: "ONBOARDING_TOOL_NOT_IN_LIST",
  CONFIRMATION_REQUIRED: CODES.CONFIRMATION_REQUIRED,
  ANSWER_INVALID: "ONBOARDING_ANSWER_INVALID",
  CATALOGUE_ENTRY_UNKNOWN: "ONBOARDING_CATALOGUE_ENTRY_UNKNOWN",
  SETUP_INCOMPLETE: "ONBOARDING_SETUP_INCOMPLETE",
  SETUP_HOST_ABSENT: "ONBOARDING_SETUP_HOST_ABSENT",
});

/* The fields NO onboarding tool may write. Named here so the closed-list test can
   assert it by source as well as by behaviour (A4). */
const NEVER_SET_BY_COACH = Object.freeze(["sets", "hi", "day_kind"]);

/* The tier-3 table. The five daily topics come from tools.cjs verbatim, so a
   topic added there is refused here too without an edit; the three setup topics
   are the fields above, in the athlete's words and with no dash in any of them
   (DECISIONS:114 (1)). */
const NEVER_VIA_COACH_SETUP = Object.freeze(Object.assign({}, T.NEVER_VIA_COACH, {
  sets: "How many sets you do of each exercise is Earned's standard start, not something this conversation sets. I can read it back to you, and you can change it on the screen.",
  hi: "The reps you aim for before the weight goes up is Earned's standard start. I can read it back to you; changing it is a tap on the screen, not a word to me.",
  day_kind: "Which days are upper body and which are lower body is Earned's own rule, worked out from the days you picked. I can tell you what it chose and why. Changing one is a tap on that day.",
  standard_start: "Earned's standard start is the same for every new lift. I can read it back; I cannot move it from here.",
}));
const SETUP_TIER3_TOPICS = Object.freeze(Object.keys(NEVER_VIA_COACH_SETUP));

/* ------------------------------------------------------------- envelopes -- */

/* The same two envelopes tools.cjs uses, so a C6 result reads exactly like a C5
   result and the same traceability check runs over both. */
const ok = (tool, tier, turn_id, values, extra) =>
  Object.freeze({ tool, tier, turn_id, ok: true, values: values || {}, ...(extra || {}) });

const unavailable = (tool, tier, turn_id, code, reason, source) =>
  Object.freeze({ tool, tier, turn_id, ok: false,
    unavailable: Object.freeze({ code, reason, source: source || null }),
    values: Object.freeze({
      code: T.tagged(turn_id, "coach.refusal.code", code, "code", ""),
      reason: T.text(turn_id, "coach.refusal." + code, reason),
    }),
    state_unchanged: true });

/* ----------------------------------------------------------- the factory -- */

/* setup     : a LIVE setup-model.mjs createSetupModel instance (the screens' own)
 * catalogue : exercise-catalogue.mjs
 * model     : the setup-model module itself, for the standard lines review reads
 *             back and for the weekday vocabulary
 * commands  : setup-commands.mjs (prepare / validate), the producer the screens use
 * effective : the op's effective stamp, identical on both paths
 * host      : OPTIONAL, a createSetupHost handle. Absent means submit prepares
 *             the op and refuses to pretend it stored it.
 */
function createOnboardingTools({ setup, catalogue, model, commands, effective = null, host = null } = {}) {
  if (!setup || typeof setup.document !== "function") {
    throw new TypeError("createOnboardingTools requires the screens' own setup model");
  }
  if (!model || typeof model.standardStartLine !== "function") {
    throw new TypeError("createOnboardingTools requires setup-model.mjs");
  }
  if (!commands || typeof commands.prepare !== "function") {
    throw new TypeError("createOnboardingTools requires setup-commands.mjs");
  }
  const cat = catalogue || null;
  let submitted = 0;

  /* A FACT IS RECORDED ONLY AFTER A SPOKEN YES (A6). The harness sets this from
     its own record of the confirmation, never the model, and the refusal names
     the value it was waiting to be told about. */
  function needConfirm(tool, args, turn_id, what) {
    if (!args || args.confirmed !== true) {
      return unavailable(tool, TIER.FACT, turn_id, C6_CODES.CONFIRMATION_REQUIRED,
        "Nothing is written until you say yes. I have not recorded " + what + ".",
        "BRIEF-C6-VOICE-ONBOARDING.md 2.1 tier 1");
    }
    return null;
  }

  const say = (turn_id, source, value) => T.text(turn_id, source, value);

  /* -------------------------------------------------------- the six answers */

  async function set_name(args, turn_id) {
    const guard = needConfirm("set_name", args, turn_id, "a name");
    if (guard) return guard;
    const name = args && typeof args.name === "string" ? args.name : "";
    if (!name.trim()) {
      return unavailable("set_name", TIER.FACT, turn_id, C6_CODES.ANSWER_INVALID,
        model.VALIDATION.name, "setup-model.mjs VALIDATION.name");
    }
    setup.setName(name);
    return ok("set_name", TIER.FACT, turn_id, {
      name: say(turn_id, "setup-model.setName", setup.answers().name),
    }, { recorded: true });
  }

  /* HE PICKS THE DAYS. Earned says what each one is (DECISIONS:125 (1)): this
     tool toggles days and reads the proposal back. It cannot set a kind, which
     is why `day_kind` is a tier-3 topic above. */
  async function set_days(args, turn_id) {
    const guard = needConfirm("set_days", args, turn_id, "your training days");
    if (guard) return guard;
    const days = args && Array.isArray(args.days) ? args.days : null;
    if (!days || !days.length || !days.every((d) => model.WEEKDAYS.includes(String(d)))) {
      return unavailable("set_days", TIER.FACT, turn_id, C6_CODES.ANSWER_INVALID,
        model.MISSING.days, "setup-model.mjs WEEKDAYS");
    }
    const before = setup.answers().days;
    for (const d of days) if (before[String(d)] === null) setup.toggleDay(String(d));
    const after = setup.answers().days;
    const chosen = model.WEEKDAYS.filter((d) => after[d] !== null);
    return ok("set_days", TIER.FACT, turn_id, {
      dayCount: T.num(turn_id, "setup-model.answers.days", chosen.length, "day"),
      days: chosen.map((d, i) => say(turn_id, "setup-model.WEEKDAY_NAMES[" + i + "]",
        model.WEEKDAY_NAMES[Number(d)])),
      /* Earned's own proposal, read back. The coach never chose these. */
      kinds: chosen.map((d) => say(turn_id, "split-kinds.proposeKinds",
        model.WEEKDAY_NAMES[Number(d)] + ": " + (model.DAY_KIND_WORDS[after[d]] || model.COPY.unknownWord))),
      rule: say(turn_id, "setup-model.COPY.screen2Rule", model.COPY.screen2Rule),
    }, { recorded: true });
  }

  /* ONE LIFT, by catalogue id or by the name he actually uses. Both land on the
     screens' own setters, so a voice row and a tapped row are the same row.
     `mg` is the ENGINE's own label and is never mapped from a friendlier word
     (DECISIONS:115); `mg_other` is what he typed, stored verbatim and unmapped
     exactly as the "Something else" chip stores it. */
  async function add_exercise_from_catalogue(args, turn_id) {
    const guard = needConfirm("add_exercise_from_catalogue", args, turn_id, "that exercise");
    if (guard) return guard;
    const a = args || {};
    const day = a.day;
    if (!model.DAY_KINDS.includes(day)) {
      return unavailable("add_exercise_from_catalogue", TIER.FACT, turn_id, C6_CODES.ANSWER_INVALID,
        model.dayKindValidation(model.COPY.screen2Yours), "setup-model.mjs DAY_KINDS");
    }
    let row = null;
    if (typeof a.catalogue_id === "string" && a.catalogue_id) {
      if (!cat) {
        return unavailable("add_exercise_from_catalogue", TIER.FACT, turn_id, C6_CODES.CATALOGUE_ENTRY_UNKNOWN,
          model.COPY.searchNone, "exercise-catalogue.mjs");
      }
      const entry = cat.byId(a.catalogue_id);
      if (!entry) {
        return unavailable("add_exercise_from_catalogue", TIER.FACT, turn_id, C6_CODES.CATALOGUE_ENTRY_UNKNOWN,
          model.COPY.searchNone, "exercise-catalogue.mjs byId(" + a.catalogue_id + ")");
      }
      row = setup.addFromCatalogue(day, entry);
    } else {
      /* Not in the list, or not named yet. An unnamed row is left unnamed: the
         summary names the gap (A7) and nothing is invented to fill it. */
      row = setup.addExercise(day);
      if (row && typeof a.name === "string" && a.name) setup.setExerciseField(row.key, "n", a.name);
      if (row && typeof a.mg === "string" && a.mg) setup.chooseMg(row.key, a.mg);
      else if (row && typeof a.mg_other === "string" && a.mg_other) {
        setup.chooseMgOther(row.key);
        setup.setMgOther(row.key, a.mg_other);
      }
    }
    if (!row) {
      return unavailable("add_exercise_from_catalogue", TIER.FACT, turn_id, C6_CODES.ANSWER_INVALID,
        model.MISSING.exerciseName.replace("KIND", model.DAY_KIND_WORDS[day].toLowerCase()),
        "setup-model.mjs addExercise");
    }
    const saved = setup.answers().exercises.find((e) => e.key === row.key) || row;
    return ok("add_exercise_from_catalogue", TIER.FACT, turn_id, {
      key: T.tagged(turn_id, "setup-model.answers.exercises[].key", saved.key, "id", ""),
      name: say(turn_id, "setup-model.answers.exercises[].n", model.namedExercise(saved.n)),
      works: say(turn_id, "setup-model.answers.exercises[].mg", saved.mg || model.COPY.unknownWord),
      day: say(turn_id, "setup-model.DAY_KIND_WORDS", model.DAY_KIND_WORDS[day]),
    }, { recorded: true, key: saved.key });
  }

  /* THE MACHINE, NOT THE ATHLETE (screen 4). Lightest setting, smallest jump, or
     the whole uneven stack. "I don't know" is an ANSWER: it sets nothing, and
     `missing()` names it (A7). No default is written here, ever. */
  async function set_machine_settings(args, turn_id) {
    const guard = needConfirm("set_machine_settings", args, turn_id, "those settings");
    if (guard) return guard;
    const a = args || {};
    const rows = setup.answers().exercises;
    const row = a.key ? rows.find((e) => e.key === a.key) : rows[rows.length - 1];
    if (!row) {
      return unavailable("set_machine_settings", TIER.FACT, turn_id, C6_CODES.ANSWER_INVALID,
        model.MISSING.exerciseFirst.replace("NAME", model.COPY.unnamedSubject),
        "setup-model.mjs answers.exercises");
    }
    /* `unknown: true` is how a transcript says "I don't know". Every field it
       names stays exactly as it was. */
    const unknown = a.unknown === true;
    const wrote = [];
    if (!unknown) {
      for (const field of ["first", "inc", "rungs"]) {
        if (typeof a[field] === "string" && a[field] !== "") {
          setup.setExerciseField(row.key, field, a[field]);
          wrote.push(field);
        }
      }
    }
    const after = setup.answers().exercises.find((e) => e.key === row.key) || row;
    const steps = model.parseRungs(after.rungs);
    return ok("set_machine_settings", TIER.FACT, turn_id, {
      name: say(turn_id, "setup-model.answers.exercises[].n", model.namedExercise(after.n)),
      first: after.first ? T.num(turn_id, "setup-model.answers.exercises[].first", Number(after.first), "lb")
        : T.blank(turn_id, "setup-model.answers.exercises[].first", "lb", model.COPY.unknownWord),
      inc: after.inc ? T.num(turn_id, "setup-model.answers.exercises[].inc", Number(after.inc), "lb")
        : T.blank(turn_id, "setup-model.answers.exercises[].inc", "lb", model.COPY.unknownWord),
      /* The standard step, in setup-model's own words, whenever the jump is
         blank. Read back, never re-authored (A5). */
      standardStep: after.inc ? T.blank(turn_id, "setup-model.standardStepLine", "text", "the jump is his own")
        : say(turn_id, "setup-model.standardStepLine", model.standardStepLine()),
      rungs: steps.length
        ? steps.map((s, i) => T.num(turn_id, "setup-model.parseRungs[" + i + "]", s, "lb"))
        : [],
      unknown: T.tagged(turn_id, "coach.answer.unknown", unknown, "flag", ""),
    }, { recorded: wrote.length > 0, wrote });
  }

  async function set_priorities(args, turn_id) {
    const guard = needConfirm("set_priorities", args, turn_id, "what matters most");
    if (guard) return guard;
    const list = args && Array.isArray(args.priorities) ? args.priorities : [];
    for (const label of list) {
      if (!model.MG_LABELS.includes(label)) {
        return unavailable("set_priorities", TIER.FACT, turn_id, C6_CODES.ANSWER_INVALID,
          model.REFUSAL_SENTENCES.CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED, "setup-model.mjs MG_LABELS");
      }
    }
    for (const label of list) setup.togglePriority(label);
    const now = setup.answers().priorities;
    return ok("set_priorities", TIER.FACT, turn_id, {
      priorities: now.length
        ? now.map((p, i) => say(turn_id, "setup-model.answers.priorities[" + i + "]", p))
        : [say(turn_id, "setup-model.COPY.screen6Nothing", model.COPY.screen6Nothing)],
      count: T.num(turn_id, "setup-model.answers.priorities.length", now.length, "reading"),
    }, { recorded: true });
  }

  /* ------------------------------------------------------ tier 0: review -- */

  /* READS THE WHOLE DOCUMENT BACK, including the two numbers the coach can never
     set. The standard lines are setup-model.mjs's own composed strings, taken
     verbatim: re-authoring either one here is mutant C5 and A5 kills it. */
  async function review(_args, turn_id) {
    const answers = setup.answers();
    const built = setup.document();
    const chosen = model.WEEKDAYS.filter((d) => answers.days[d] !== null);
    return ok("review", TIER.READ, turn_id, {
      name: answers.name ? say(turn_id, "setup-model.answers.name", answers.name)
        : T.blank(turn_id, "setup-model.answers.name", "text", model.MISSING.name),
      days: chosen.map((d) => say(turn_id, "setup-model.WEEKDAY_NAMES",
        model.WEEKDAY_NAMES[Number(d)] + ": "
        + (model.DAY_KIND_WORDS[answers.days[d]] || model.COPY.unknownWord))),
      /* EARNED'S, NOT THE COACH'S. */
      sets: T.num(turn_id, "setup-model.STANDARD_SETS (answers.sets)", answers.sets, "set"),
      hi: T.num(turn_id, "setup-model.STANDARD_HI (answers.hi)", answers.hi, "rep"),
      standardStart: say(turn_id, "setup-model.standardStartLine", model.standardStartLine()),
      standardStep: say(turn_id, "setup-model.standardStepLine", model.standardStepLine()),
      exercises: answers.exercises.map((row, i) => ({
        name: say(turn_id, "setup-model.namedExercise[" + i + "]", model.namedExercise(row.n)),
        works: say(turn_id, "setup-model.answers.exercises[" + i + "].mg", row.mg || model.COPY.unknownWord),
        day: say(turn_id, "setup-model.DAY_KIND_WORDS[" + i + "]", model.DAY_KIND_WORDS[row.day]),
        setsLine: say(turn_id, "setup-model.setsLine[" + i + "]", model.setsLine(answers.sets, answers.hi)),
      })),
      priorities: answers.priorities.length
        ? answers.priorities.map((p, i) => say(turn_id, "setup-model.answers.priorities[" + i + "]", p))
        : [say(turn_id, "setup-model.COPY.screen6Nothing", model.COPY.screen6Nothing)],
      /* WHAT IS STILL UNKNOWN, in setup-model's own sentences (A7). */
      missing: built.missing.map((m, i) => say(turn_id, "setup-model.missing[" + i + "]", m.copy)),
      complete: T.tagged(turn_id, "setup-model.document().ok", built.ok === true, "flag", ""),
      noLoad: say(turn_id, "setup-model.COPY.screen6NoLoad", model.COPY.screen6NoLoad),
    }, {
      /* The snapshot the parity test compares byte for byte against the tapped
         document. Reordering one key here is mutant C2. */
      document: built.ok ? { setup: built.setup, tags: built.tags } : null,
      missingCodes: built.missing.map((m) => m.code),
    });
  }

  /* ------------------------------------------------------ tier 1: submit -- */

  /* THE ONE WRITE. It builds nothing of its own: the document is the screens'
     `document()` and the envelope is setup-commands.mjs `prepare`, the same call
     the Start button makes. Building a payload here instead is mutant C1. */
  async function submit(args, turn_id) {
    const guard = needConfirm("submit", args, turn_id, "your week");
    if (guard) return guard;
    const built = setup.document();
    if (!built.ok) {
      return unavailable("submit", TIER.FACT, turn_id, C6_CODES.SETUP_INCOMPLETE,
        model.COPY.refusalHead + ". " + built.missing.map((m) => m.copy).join(" "),
        "setup-model.mjs document() missing");
    }
    const input = { setup: built.setup, tags: built.tags };
    if (effective) input.effective = effective;
    let action;
    try { action = commands.prepare({ action: commands.ACTION, input }); }
    catch (error) {
      return unavailable("submit", TIER.FACT, turn_id, (error && error.message) || "SETUP_INPUT_INVALID",
        model.COPY.saveRefused, "setup-commands.mjs prepare()");
    }
    if (!host || typeof host.save !== "function") {
      return unavailable("submit", TIER.FACT, turn_id, C6_CODES.SETUP_HOST_ABSENT,
        model.COPY.saveRefused, "today-bindings.mjs createSetupHost");
    }
    /* ONE argument, an ENVELOPE - the call setup-app.mjs:524 makes through
       today-entry.mjs:141 since A4b merged (:149). The mouth spells the write
       exactly the way the screen spells it; nothing about the envelope is the
       coach's to decide. */
    const saved = await host.save({ setup: built.setup, tags: built.tags });
    if (!saved.ok) {
      return unavailable("submit", TIER.FACT, turn_id, saved.code || "SETUP_NOT_RECORDED",
        saved.code === "SETUP_ALREADY_RECORDED" ? model.COPY.alreadyRecorded : model.COPY.saveRefused,
        "today-bindings.mjs createSetupHost save()");
    }
    submitted += 1;
    return ok("submit", TIER.FACT, turn_id, {
      opId: say(turn_id, "createSetupHost.save.op_id", saved.op_id),
      start: say(turn_id, "setup-model.COPY.start", model.COPY.start),
    }, { recorded: true, action, ops: submitted });
  }

  /* ------------------------------------------------------ tier 3: refuse -- */

  async function cannot_set_via_coach(args, turn_id) {
    const topic = args && args.topic;
    const why = NEVER_VIA_COACH_SETUP[topic];
    return ok("cannot_set_via_coach", TIER.REFUSED, turn_id, {
      topic: say(turn_id, "coach.request.topic", String(topic || "unknown")),
      explanation: say(turn_id, why ? "coach.tier3." + topic : "coach.tier3",
        why || "That is not something this conversation sets. Your week is unchanged."),
    }, { refused: true, state_unchanged: true });
  }

  /* -------------------------------------------------------- the dispatch -- */

  const IMPL = Object.freeze({
    set_name, set_days, add_exercise_from_catalogue, set_machine_settings,
    set_priorities, review, submit, cannot_set_via_coach,
  });

  /* THE ONLY ENTRY POINT, and the closed door (A3). A name that is not a key of
     TIERS gets a refusal that NAMES IT and lists the seven, and nothing throws
     past the caller: a transcript that tried an invented tool is diagnosable
     without a debugger. There is no default handler (mutant C4). */
  async function dispatch(name, args, turn_id) {
    if (typeof turn_id !== "string" || !turn_id) throw new TypeError("dispatch: a turn_id is required");
    if (!Object.prototype.hasOwnProperty.call(TIERS, name) || typeof IMPL[name] !== "function") {
      return Object.freeze({
        ok: false, tool: name, tier: null, turn_id,
        code: C6_CODES.TOOL_NOT_IN_LIST,
        reason: String(name) + " is not one of the seven onboarding tools",
        allowed: ONBOARDING_TOOLS.slice(),
        unavailable: Object.freeze({ code: C6_CODES.TOOL_NOT_IN_LIST,
          reason: String(name) + " is not one of the seven onboarding tools",
          source: "onboarding-tools.cjs TIERS" }),
        values: Object.freeze({}),
        state_unchanged: true,
      });
    }
    try { return await IMPL[name](args, turn_id); }
    catch (error) {
      /* A refusal, never a stack past the caller. */
      return unavailable(name, TIERS[name], turn_id, "ONBOARDING_TOOL_THREW",
        (error && error.message) || "the tool refused", "onboarding-tools.cjs dispatch");
    }
  }

  /* A turn, exactly as tools.cjs openTurn: one id, one results array, and the
     same traceability check scoped to that turn. */
  function openTurn(turn_id) {
    if (typeof turn_id !== "string" || !turn_id) throw new TypeError("openTurn: a turn_id is required");
    const results = [];
    return Object.freeze({
      turn_id, results,
      async call(name, args) { const r = await dispatch(name, args, turn_id); results.push(r); return r; },
      untraceable: (answer) => T.untraceable(answer, results, turn_id),
      traceable: (answer) => T.traceable(answer, results, turn_id),
    });
  }

  return Object.freeze({ TIERS, TIER, dispatch, openTurn,
    tools: () => ONBOARDING_TOOLS.slice(),
    ops: () => submitted,
    setup, model });
}

module.exports = {
  createOnboardingTools, ONBOARDING_TOOLS, TIERS, C6_CODES, TIER,
  NEVER_VIA_COACH_SETUP, SETUP_TIER3_TOPICS, NEVER_SET_BY_COACH,
};
