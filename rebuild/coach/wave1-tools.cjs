"use strict";

/* wave1-tools.cjs - the coach's wave-one tools (BRIEF-COACH-WAVE1-TEXT.md).
 *
 * The demo script (COACH-EXPERIENCE-BRIEF.md, DECISIONS:140) needs four things
 * the C5 contract does not already have: a WHY SLOT that is honest when the
 * engine has no reason on disk, a read and a capture for machine settings, and
 * hands-free logging through the gym card's OWN write path.
 *
 * NOTHING HERE COMPUTES. `plan_why` reads a stored reason or says `not recorded`.
 * `machine_settings` reads a stored fact and tags it with the OP it came from, so
 * "seat four" traces exactly as an engine number does. `log_set` calls
 * gym-model.mjs logSet, which is composeWorkoutHost over the installation's own
 * bindings: the operation the store holds is the gym card's operation, and
 * building one here instead is mutant D4.
 *
 * No model, no network, no key. This module requires tools.cjs for the tag and
 * traceability vocabulary; the world is injected.
 */

const T = require("./tools.cjs");

const TIER = T.TIER;
const CODES = T.CODES;

/* THE LITERAL the brief names for a why nobody has recorded. Athlete-facing, so
   dash-free, and it is a STRING CONSTANT rather than a sentence assembled at the
   call site: W4 asserts this exact value and D2 flips it. */
const NOT_RECORDED = "not recorded";

const WAVE1_TOOLS = Object.freeze([
  "plan_why", "machine_settings", "record_machine_settings", "log_set",
]);

/* The tier map, exactly as tools.cjs and onboarding-tools.cjs keep theirs. A read
   is tier 0; a fact is tier 1 and needs the spoken yes. Making
   `record_machine_settings` tier 0 is mutant D11. */
const WAVE1_TIERS = Object.freeze({
  plan_why: TIER.READ,
  machine_settings: TIER.READ,
  record_machine_settings: TIER.FACT,
  log_set: TIER.FACT,
});

const W1_CODES = Object.freeze({
  CONFIRMATION_REQUIRED: CODES.CONFIRMATION_REQUIRED,
  GYM_SESSION_ABSENT: CODES.GYM_SESSION_ABSENT,
  MACHINE_SETTINGS_ABSENT: "COACH_MACHINE_SETTINGS_ABSENT",
  MACHINE_SETTINGS_LANE_ABSENT: "COACH_MACHINE_SETTINGS_LANE_ABSENT",
  MACHINE_SETTINGS_INVALID: "COACH_MACHINE_SETTINGS_INVALID",
  EFFORT_REQUIRED: "COACH_EFFORT_REQUIRED",
  SET_NOT_RECORDED: "COACH_SET_NOT_RECORDED",
});

/* The effort words a transcript may use, mapped onto the ACCEPTED choice set and
   nothing else (gym-model.mjs EFFORT_CHOICES, which is itself checked against
   EditValues.reserve at load time). The words are INVENTED; the reserves are
   not. "Unsure" stores the accepted tag `unknown`: never a number, never an
   omission, and NOTHING is preselected, so a missing or unknown word refuses. */
const EFFORT_WORDS = Object.freeze({
  "none": "0", "none left": "0", "nothing left": "0", "zero": "0", "failure": "0",
  "one": "1", "one left": "1", "one more": "1",
  "two": "2", "two left": "2", "two more": "2",
  "three": "3+", "three or more": "3+", "three plus": "3+", "plenty": "3+", "easy": "3+",
  "unsure": "Unsure", "not sure": "Unsure", "no idea": "Unsure", "dont know": "Unsure",
});

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

/* world  : the openCoachWorld world (today, gym, machineSettings)
 * coach  : createCoachTools(world), so one turn can call the C5 fifteen and
 *          these four and the traceability check sees both
 * reasons: OPTIONAL, a reader for an engine reason ON DISK, shaped
 *          { forTopic(topic) -> { why, source } | null }. Absent means nothing is
 *          recorded, which is the true state of this build: P6 has not landed.
 * effortChoices: the ACCEPTED choice set, injected from gym-model.mjs so this
 *          module never restates a reserve the accepted layer would refuse.
 */
function createWave1Tools({ world, coach, reasons = null, effortChoices = [],
  /* gym-model.mjs effortWords, injected: the accepted layer's own sentence for a
     reserve. Without it the coach would have to invent one, which is exactly
     what it may not do. */
  effortWords = (reserve) => String((reserve && reserve.tag) || "") } = {}) {
  if (!world || !world.today) throw new TypeError("createWave1Tools requires the coach world");
  if (!coach || typeof coach.openTurn !== "function") throw new TypeError("createWave1Tools requires the C5 tools");
  const gym = world.gym || null;
  const lane = world.machineSettings || null;
  const CHOICES = effortChoices.slice();
  const say = (turn_id, source, value) => T.text(turn_id, source, value);

  function needConfirm(tool, turn_id, what) {
    return unavailable(tool, TIER.FACT, turn_id, W1_CODES.CONFIRMATION_REQUIRED,
      "Nothing is written until you say yes. I have not recorded " + what + ".",
      "BRIEF-COACH-WAVE1-TEXT.md section 2");
  }

  /* ------------------------------------------------- step 2 and step 5: WHY */

  /* THE WHY SLOT. It is always present and it is always one of exactly two
     things: the engine's own recorded words, verbatim, or the literal
     `not recorded`. It is never composed from the plan numbers (mutant D1), and
     it never says `not recorded` when a reason IS on disk (mutant D2). */
  async function plan_why(args, turn_id) {
    const topic = (args && args.topic) || "instruction";
    const found = reasons && typeof reasons.forTopic === "function" ? reasons.forTopic(topic) : null;
    const recorded = !!(found && typeof found.why === "string" && found.why.trim());
    return ok("plan_why", TIER.READ, turn_id, {
      topic: T.tagged(turn_id, "coach.request.topic", topic, "topic", ""),
      /* The tag's SOURCE names where the words came from, so a why that was
         invented has nowhere to claim it came from. */
      why: recorded
        ? say(turn_id, (found.source || "engine.reason") + " (recorded)", found.why)
        : say(turn_id, "coach.why.not-recorded", NOT_RECORDED),
      recorded: T.tagged(turn_id, "coach.why.recorded", recorded, "flag", ""),
    }, { whySlot: true, recorded });
  }

  /* ------------------------------------------ step 3: the machine settings */

  /* A RECALLED SETTING IS A STORED FACT, not an engine value, so every value
     carries the OP it came from in its `source`. Speaking one the store does not
     hold is mutant D7 and W9 kills it. */
  async function machine_settings(args, turn_id) {
    const exercise_id = args && typeof args.exercise_id === "string" ? args.exercise_id.trim() : "";
    if (!exercise_id) {
      return unavailable("machine_settings", TIER.READ, turn_id, W1_CODES.MACHINE_SETTINGS_INVALID,
        "I need to know which machine you mean.", "wave1-tools.cjs machine_settings");
    }
    if (!lane || typeof lane.latest !== "function") {
      return unavailable("machine_settings", TIER.READ, turn_id, W1_CODES.MACHINE_SETTINGS_LANE_ABSENT,
        "There is no place on this device to keep machine settings yet, so I have none to read back.",
        "local-world.mjs createMachineSettingsHost");
    }
    const row = await lane.latest(exercise_id);
    if (!row) {
      /* The brief's own sentence for a machine never captured. It offers to keep
         it; it does not guess it. */
      return unavailable("machine_settings", TIER.READ, turn_id, W1_CODES.MACHINE_SETTINGS_ABSENT,
        "I do not have it yet. Tell me while you are there and I will keep it.",
        "earned/machine-settings/v1 (no fact for this exercise)");
    }
    const from = "machine-settings.op " + row.op_id;
    const settings = (row.machine.settings || []).map((pair, i) => ({
      name: say(turn_id, from + " settings[" + i + "].name", pair.name),
      value: say(turn_id, from + " settings[" + i + "].value", pair.value),
    }));
    return ok("machine_settings", TIER.READ, turn_id, {
      exerciseId: T.tagged(turn_id, from + " exercise_id", row.machine.exercise_id, "id", ""),
      settings,
      cues: row.machine.cues
        ? say(turn_id, from + " cues", row.machine.cues)
        : T.blank(turn_id, from + " cues", "text", "no cue is stored for this lift"),
      recordedOn: T.tagged(turn_id, from + " effective.local_date", row.date, "date", row.date),
    }, { opId: row.op_id, machine: row.machine });
  }

  /* THE CAPTURE. "Seat four, pin three" becomes two pairs and nothing else: no
     number is derived from a word, no unit is invented, no name is normalised.
     Turning "four" into 4 is mutant D10. */
  async function record_machine_settings(args, turn_id) {
    if (!args || args.confirmed !== true) return needConfirm("record_machine_settings", turn_id, "those settings");
    if (!lane || typeof lane.save !== "function") {
      return unavailable("record_machine_settings", TIER.FACT, turn_id, W1_CODES.MACHINE_SETTINGS_LANE_ABSENT,
        "There is no place on this device to keep machine settings yet, so I have not kept them.",
        "local-world.mjs createMachineSettingsHost");
    }
    const machine = { exercise_id: args.exercise_id };
    if (Array.isArray(args.settings)) machine.settings = args.settings;
    if (typeof args.cues === "string" && args.cues) machine.cues = args.cues;
    let saved;
    try { saved = await lane.save(machine); }
    catch (error) {
      return unavailable("record_machine_settings", TIER.FACT, turn_id, W1_CODES.MACHINE_SETTINGS_INVALID,
        "I could not keep that, and I have kept nothing.",
        (error && error.message) || "machine-settings-commands.cjs");
    }
    if (!saved.ok) {
      return unavailable("record_machine_settings", TIER.FACT, turn_id,
        saved.code || W1_CODES.MACHINE_SETTINGS_INVALID,
        saved.copy || "I could not keep that, and I have kept nothing.",
        "local-world.mjs machineSettings.save()");
    }
    const from = "machine-settings.op " + saved.op_id;
    return ok("record_machine_settings", TIER.FACT, turn_id, {
      exerciseId: T.tagged(turn_id, from + " exercise_id", machine.exercise_id, "id", ""),
      settings: (machine.settings || []).map((pair, i) => ({
        name: say(turn_id, from + " settings[" + i + "].name", pair.name),
        value: say(turn_id, from + " settings[" + i + "].value", pair.value),
      })),
      opId: say(turn_id, "machineSettings.save.op_id", saved.op_id),
    }, { recorded: true, opId: saved.op_id });
  }

  /* --------------------------------------------- step 4: hands-free logging */

  /* THE SET GOES THROUGH THE GYM CARD'S OWN WRITE PATH. gym-model.mjs logSet is
     composeWorkoutHost over this installation's bindings: the same prepare, the
     same resumed execute, the same accepted refusals in their own words. This
     tool chooses the slot and the lift from the ACTIVE set and nothing else, and
     it builds no operation of its own (mutant D4). */
  async function log_set(args, turn_id) {
    const a = args || {};
    if (!gym || typeof gym.logSet !== "function") {
      return unavailable("log_set", TIER.FACT, turn_id, W1_CODES.GYM_SESSION_ABSENT,
        "No gym session is composed on this device, so there is no set to log.",
        "rebuild/m3/w7-preview/today/gym-model.mjs");
    }
    const view = await gym.read();
    /* NO ACTIVE SET, NO WRITE. A session that is merely ready has not started,
       and there is nothing to log against. */
    if (view.phase !== "active" || !view.startId || !view.set) {
      return unavailable("log_set", TIER.FACT, turn_id, W1_CODES.GYM_SESSION_ABSENT,
        "The session is " + view.phase + ", so there is no set to log.",
        "gym-model.read().phase");
    }
    /* The confirm NAMES THE WEIGHT AND THE REPS it is confirming (mutant D6), so
       a yes is a yes to these numbers and not to the conversation. */
    const load = a.load, reps = a.reps;
    if (load === undefined || load === null || load === "" || reps === undefined || reps === null || reps === "") {
      return unavailable("log_set", TIER.FACT, turn_id, W1_CODES.SET_NOT_RECORDED,
        "Tell me the weight and the reps you actually did.", "gym-model.mjs ENTER_PERFORMED");
    }
    if (a.confirmed !== true) {
      return unavailable("log_set", TIER.FACT, turn_id, W1_CODES.CONFIRMATION_REQUIRED,
        "Say yes and I will log " + load + " lb for " + reps + " reps. Nothing is recorded yet.",
        "BRIEF-COACH-WAVE1-TEXT.md section 2 step 4");
    }
    /* The effort word maps onto the ACCEPTED choice set, or nothing happens.
       Nothing is preselected and there is no default. */
    const word = typeof a.effort === "string" ? a.effort.trim().toLowerCase() : "";
    const label = EFFORT_WORDS[word];
    const choice = label ? CHOICES.find((c) => c.label === label) : null;
    if (!choice) {
      return unavailable("log_set", TIER.FACT, turn_id, W1_CODES.EFFORT_REQUIRED,
        "Tell me how many clean reps you had left, or say you are unsure.",
        "gym-model.mjs EFFORT_CHOICES");
    }
    const before = view.set.position;
    const result = await gym.logSet({ startId: view.startId, slot: view.set.slot,
      lift: view.set.lift, load, reps, effort: choice.reserve });
    if (!result.ok) {
      /* THE ACCEPTED LAYER'S OWN WORDS. A load bound, an effort requirement, an
         order refusal: its code and its sentence travel verbatim. */
      return unavailable("log_set", TIER.FACT, turn_id, result.code || W1_CODES.SET_NOT_RECORDED,
        result.copy || null, "gym-model.logSet -> client.executeResumedWorkout");
    }
    const after = await gym.read();
    const next = after.upNext || after.next || null;
    return ok("log_set", TIER.FACT, turn_id, {
      setNumber: T.num(turn_id, "gym-model.read.set.position (logged)", before, "set"),
      load: T.num(turn_id, "coach.log_set.load (athlete stated, client stored)", Number(load), "lb"),
      reps: T.num(turn_id, "coach.log_set.reps (athlete stated, client stored)", Number(reps), "rep"),
      /* The ACCEPTED layer's own sentence for this reserve, carried verbatim:
         the coach never puts a reserve into words of its own. */
      effort: say(turn_id, "gym-model.effortWords(reserve)", effortWords(choice.reserve)),
      opId: say(turn_id, "gym-model.logSet.opId", result.opId),
      nextLift: next ? say(turn_id, "gym-model.next.label", next.label)
        : T.blank(turn_id, "gym-model.nextAfter()", "text", "there is no further set after this one"),
      nextPosition: next ? T.num(turn_id, "gym-model.next.position", next.position, "set")
        : T.blank(turn_id, "gym-model.next.position", "set", "no further set"),
    }, { recorded: true, opId: result.opId });
  }

  /* ------------------------------------------------------------ the wiring */

  const IMPL = Object.freeze({ plan_why, machine_settings, record_machine_settings, log_set });

  /* WAVE1 review, C1. The advertised list and the SERVED list are one list.
     Before this, TIERS advertised nineteen names while dispatch served only
     these four, so the C5 fifteen came back WAVE1_TOOL_NOT_IN_LIST through
     dispatch and worked through openTurn().call - the same tool answering two
     different ways depending on which door was used. A list the mouth is told it
     may call has to be callable, so dispatch now serves all nineteen: these four
     here, and the fifteen through the C5 object's own TOOLS, unchanged and at
     their own tiers. `allowed` below is that same one list. */
  const SERVED = Object.freeze(Object.assign(Object.create(null), coach.TOOLS, IMPL));
  const TIERS = Object.freeze(Object.assign({}, coach.TIERS, WAVE1_TIERS));
  const ALLOWED = Object.freeze(Object.keys(TIERS));

  async function dispatch(name, args, turn_id) {
    if (typeof turn_id !== "string" || !turn_id) throw new TypeError("dispatch: a turn_id is required");
    if (!Object.prototype.hasOwnProperty.call(TIERS, name) || typeof SERVED[name] !== "function") {
      return Object.freeze({ ok: false, tool: name, tier: null, turn_id,
        code: "WAVE1_TOOL_NOT_IN_LIST",
        reason: String(name) + " is not one of the wave-one tools",
        allowed: ALLOWED.slice(), values: Object.freeze({}), state_unchanged: true,
        unavailable: Object.freeze({ code: "WAVE1_TOOL_NOT_IN_LIST",
          reason: String(name) + " is not one of the wave-one tools", source: "wave1-tools.cjs TIERS" }) });
    }
    try { return await SERVED[name](args, turn_id); }
    catch (error) {
      return unavailable(name, TIERS[name], turn_id, "WAVE1_TOOL_THREW",
        (error && error.message) || "the tool refused", "wave1-tools.cjs dispatch");
    }
  }

  /* ONE TURN, both vocabularies. The C5 fifteen and these four push into the
     SAME results array, so `untraceable` judges the whole sentence against
     everything the turn actually read, and nothing else. */
  function openTurn(turn_id) {
    const base = coach.openTurn(turn_id);
    const call = Object.assign({}, base.call);
    for (const name of Object.keys(IMPL)) {
      call[name] = async (args) => { const r = await dispatch(name, args, turn_id); base.results.push(r); return r; };
    }
    return Object.freeze({ turn_id, results: base.results, call,
      untraceable: base.untraceable, traceable: base.traceable });
  }

  /* `tools()` answers with the list dispatch actually serves, which is the list
     TIERS advertises: one list, one answer, whichever is asked (WAVE1 C1). */
  return Object.freeze({ TIERS, WAVE1_TIERS, TIER, dispatch, openTurn, coach,
    tools: () => ALLOWED.slice(), wave1Tools: () => WAVE1_TOOLS.slice(), NOT_RECORDED });
}

module.exports = {
  createWave1Tools, WAVE1_TOOLS, WAVE1_TIERS, W1_CODES, EFFORT_WORDS, NOT_RECORDED, TIER,
};
