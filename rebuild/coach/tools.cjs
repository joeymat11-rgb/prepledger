"use strict";

const { CHECKIN_SOURCE_UNAVAILABLE, SLEEP_NIGHT_CHANGED } = require("./checkin-refusals.cjs");

/* Coach v1 (S19 amend): the kernel (tags, traceability, charter, envelopes) and the seven READ tools moved byte for
   byte to tool-kernel.cjs and read-tools.cjs, so the page can carry the reads without this file's writers. Every
   name this file exported before is still exported from here, the same objects. */
const K = require("./tool-kernel.cjs");
const {
  provenance, UNKNOWN_TOOL_COPY, COMPLETE_REFUSALS, refusalHasOwnEnding, TIER, tagged, blank, isNum, num, text,
  TOKEN, numericTokens, collectTagged, UNIT_WORDS, FIELD_WORDS, UNIT_FILLER, STOP_PUNCT, ATOM, ISO_DATE,
  UNKNOWN_UNIT, unknownNoun, BARE_SPEAKABLE, perWeek, unitAfter, unitBefore, parseUnits, allowedTokens,
  untraceable, traceable, CHARTER_BANNED, escapeRe, charterRe, CHARTER_PATTERNS, charterViolations,
  NEVER_VIA_COACH, TIER3_TOPICS, ok, unavailable, CODES, FORBIDDEN_KEYS, assertNoLeak, carriesNumber,
} = K;
const { createReadTools } = require("./read-tools.cjs");

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

/* COACH V1. The W6 browser boundary admits node:crypto for rebuild/client's own two importers and refuses it for
   everyone else, so the one digest this file takes (a proposal's id) is taken by sha256.cjs,
   rebuild/client/index.cjs's own dependency-free SHA-256 copied byte for byte: the same value as before, which the
   client reproduces. This file is NOT in the page (the page carries read-tools.cjs and tool-kernel.cjs); it stays
   free of Node imports for a later on-device adapter. */
const { sha256Hex } = require("./sha256.cjs");
const { ENGINE_REVISION } = require("./engine-revision.cjs");

/* ------------------------------------------------------------ the tools -- */

/* world = {
 *   today   : the slice's REAL adapter (rebuild/m3/w7-preview/today/today-model.cjs
 *             createTodayModel) — read()/stateFromOps()/engine
 *   gym     : OPTIONAL, the slice's REAL gym adapter (gym-model.mjs createGymModel)
 *   consent : OPTIONAL, rebuild/client's own consent surface
 *             { respond(id, answer, issuance?), recordIssuance({id,accepted,instance,
 *             producer?,revision?}), face() }
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

  /* The seven READ tools, from read-tools.cjs over this same world (Coach v1: moved there byte for byte). */
  const { today_plan, current_set, next_set, last_comparable_performance, weight_trend, today_checkin, why_this_instruction } = createReadTools(world).TOOLS;

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

  /* The staged command set is STILL exactly five. rebuild/m3/w6/t2-stage.cjs:9
     admits weighIn / logSet / logSession / finishSession / workout, and
     rebuild/m3/w6/local/local-client.mjs:49 carries the IDENTICAL set — the local
     era does NOT widen it; its execute() simply refuses an unknown command with
     LOCAL_COMMAND_UNSUPPORTED instead of the stage's throw at t2-stage.cjs:84.
     What DID change is that `workout` is the one PRODUCER-INJECTED command, and
     checkin-commands.cjs is a producer for it. So a dated non-workout fact —
     soreness, pain, time away, a check-in answer — is now writable without
     editing rebuild/client or the stage, and these tools write through that lane
     rather than refusing. Equipment has no field anywhere and still refuses. */
  const STAGE_SOURCE = "rebuild/m3/w6/t2-stage.cjs:9 COMMANDS == rebuild/m3/w6/local/local-client.mjs:49 COMMANDS (not widened)";
  function noFactCommand(tool, turn_id, what, source) {
    return unavailable(tool, TIER.FACT, turn_id, CODES.FACT_COMMAND_ABSENT,
      "There is no accepted durable field for " + what + " on this device, so I will not pretend to have recorded it.",
      source || STAGE_SOURCE);
  }

  /* ONE check-in write. The draft is the accepted sheet (checkin-model.mjs), so
     every law it carries applies to a spoken answer exactly as to a tapped one:
     blank stays absent, a cleared issue's detail cannot travel, and the closed
     command (checkin-commands.cjs) refuses anything outside its own field list.
     The coach chooses no wording of its own — `choose` only accepts the approved
     design's own labels, and an unknown one throws before anything is written. */
  async function writeCheckIn(tool, turn_id, apply) {
    if (!checkin || typeof checkin.read !== "function") {
      return unavailable(tool, TIER.FACT, turn_id, CODES.CHECKIN_SURFACE_ABSENT,
        "No recovery check-in lane is open on this device, so nothing can be recorded.",
        "rebuild/m3/w7-preview/today/checkin-model.mjs");
    }
    const draft = checkin.draft();
    const before = draft.state();
    try { apply(draft); }
    catch (error) {
      // The model holds this live draft in a closure. Restore via its public
      // setters, putting fields last because choice/issue/sleep setters clear
      // dependent fields. No await occurs between snapshot, apply and rollback.
      const after = draft.state();
      for (const [group, value] of Object.entries(before.choices)) {
        if (after.choices[group] !== value) draft.choose(group, value === null ? after.choices[group] : value);
      }
      for (const [issue, value] of Object.entries(before.issues)) {
        if (after.issues[issue] !== value) draft.toggleIssue(issue);
      }
      if (after.sleepConfirm !== before.sleepConfirm) {
        if (before.sleepConfirm === "confirmed") draft.confirmSleep();
        else if (before.sleepConfirm === "rejected") draft.answerSleepHere();
        else if (after.sleepConfirm === "confirmed") draft.confirmSleep();
        else draft.answerSleepHere();
      }
      for (const [field, value] of Object.entries(before.fields)) draft.set(field, value);
      return unavailable(tool, TIER.FACT, turn_id, CODES.CHECKIN_INPUT_INVALID,
        "I could not record that check-in answer. Nothing was recorded.",
        "checkin-commands.cjs answersOf(): " + provenance(error));
    }
    const saved = await checkin.save();
    if (!saved.ok) {
      // The wrapper's two coded pairs stay available if the model import fails.
      const wrapperPair = [CHECKIN_SOURCE_UNAVAILABLE, SLEEP_NIGHT_CHANGED]
        .some(pair => saved.code === pair.code && saved.copy === pair.copy);
      let fixed = [];
      if (!wrapperPair) {
        try {
          const model = await import("../m3/w7-preview/today/checkin-model.mjs");
          fixed = [model.ALREADY_RECORDED, model.NOTHING_ANSWERED, model.NO_STORE,
            model.HOURS_OUT_OF_RANGE, model.DAYS_INVALID, model.SAVE_REFUSED];
        } catch (error) {
          return unavailable(tool, TIER.FACT, turn_id, "CHECKIN_NOT_RECORDED",
            "I could not record that check-in answer. Nothing was recorded.",
            "tools.cjs check-in vocabulary import: " + provenance(error) +
              "; code=" + provenance(saved.code) + "; copy=" + provenance(saved.copy));
        }
      }
      const known = wrapperPair || (saved.code === undefined && fixed.includes(saved.copy));
      return unavailable(tool, TIER.FACT, turn_id, wrapperPair ? saved.code : "CHECKIN_NOT_RECORDED",
        known ? saved.copy : "I could not record that check-in answer. Nothing was recorded.",
        (wrapperPair ? "local-world.mjs" : "checkin-model.mjs") + " save(): code=" +
          provenance(saved.code) + "; copy=" + provenance(saved.copy));
    }
    const view = checkin.read();
    return assertNoLeak(ok(tool, TIER.FACT, turn_id, {
      opId: text(turn_id, "checkin-model.save.op_id", saved.op_id),
      date: tagged(turn_id, "checkin-model.read.day", view.day, "date", view.day),
      consequence: text(turn_id, "checkin-model.save.copy", saved.copy),
      lines: view.recorded ? view.recorded.lines.map((line, i) =>
        text(turn_id, "checkin-model.recordedLines[" + i + "]", line)) : [],
    }, { recorded: true }));
  }

  /* Soreness is a CHOICE from the approved set, and pain is an ISSUE with its own
     follow-ups. The coach passes the athlete's words through; it never grades
     them and never converts a choice into a number. */
  async function record_pain_or_soreness(args, turn_id) {
    const guard = needConfirm("record_pain_or_soreness", args, turn_id);
    if (guard) return guard;
    return writeCheckIn("record_pain_or_soreness", turn_id, (draft) => {
      if (args.soreness) draft.choose("soreness", args.soreness);
      if (args.soreness_location) draft.set("soreness_location", args.soreness_location);
      if (args.soreness_impact) draft.set("soreness_impact", args.soreness_impact);
      if (args.pain === true) {
        draft.toggleIssue("pain");
        if (args.pain_location) draft.set("pain_location", args.pain_location);
        if (args.pain_change) draft.set("pain_change", args.pain_change);
        if (args.pain_impact) draft.set("pain_impact", args.pain_impact);
      }
    });
  }

  async function time_away(args, turn_id) {
    const guard = needConfirm("time_away", args, turn_id);
    if (guard) return guard;
    return writeCheckIn("time_away", turn_id, (draft) => {
      draft.toggleIssue("away");
      if (args.days !== undefined && args.days !== null) draft.set("away_days", args.days);
      if (args.reason) draft.set("away_reason", args.reason);
    });
  }

  /* The check-in's own questions, answered out loud. Every label is checked
     against the approved choice list by the draft itself. */
  const CHECKIN_GROUPS = Object.freeze(["sleep_quality", "energy", "soreness", "stress"]);
  async function answer_checkin(args, turn_id) {
    const guard = needConfirm("answer_checkin", args, turn_id);
    if (guard) return guard;
    return writeCheckIn("answer_checkin", turn_id, (draft) => {
      for (const group of CHECKIN_GROUPS) if (args[group]) draft.choose(group, args[group]);
      /* SLEEP IS NOT ASKED TWICE (approved handoff, point 4). When the sleep
         record already holds last night, the sheet asks the athlete to CONFIRM it
         — and the date of that night travels with the answer. Stating a different
         number is the sheet's own explicit rejection of the record, never a
         silent overwrite. */
      if (args.confirm_sleep_record === true) draft.confirmSleep();
      if (args.sleep_hours !== undefined && args.sleep_hours !== null) {
        const sheet = draft.state();
        if (sheet.sleepRecord && sheet.sleepConfirm !== "rejected") draft.answerSleepHere();
        draft.set("sleep_hours", args.sleep_hours);
      }
      if (args.note) draft.set("note", args.note);
    });
  }

  /* STILL MISSING. `equipment unavailable today` is not a field in
     checkin-commands.cjs FIELDS, not a workout command, and not a plan verb.
     The closed command would refuse it (CHECKIN_INPUT_INVALID), so the coach
     refuses first and says why rather than filing it as a note. */
  async function equipment_unavailable_today(args, turn_id) {
    return needConfirm("equipment_unavailable_today", args, turn_id)
      || noFactCommand("equipment_unavailable_today", turn_id, "equipment being unavailable",
        "rebuild/m3/w7-preview/today/checkin-commands.cjs FIELDS (no equipment field) · " + STAGE_SOURCE);
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
  const proposalId = (obj) => "prop-" + sha256Hex("earned/coach/proposal/v1" + JSON.stringify(obj)).slice(0, 16);
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
        "rebuild/engine: no accepted replan-on-coach-facts producer exists");
    }
    if (carriesNumber(args, 0)) {
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

  /* The yes goes through the existing respond()/recordIssuance() calls, in
     that order (P6-COACH-WIRE-2, DECISIONS:456): recordIssuance() seeds the
     durable "prior" record respond()'s own digest check compares against,
     so respond() carries the whole issuance - producer, body, reason,
     ENGINE_REVISION, the turn_id and the coach's day - and nothing from
     this conversation enters it. */
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
    if (!consent || typeof consent.respond !== "function" || typeof consent.recordIssuance !== "function") {
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, CODES.CONSENT_SURFACE_ABSENT,
        "The consent surface is not reachable on this device, so your yes cannot be recorded. Nothing changed.",
        "rebuild/client/index.cjs respond()/recordIssuance()");
    }
    const record = issued.get(id);
    /* the whole issuance, sealed: only fields the engine itself produced
       (record.producer/body/reason from request_replan's own copy) plus the
       ENGINE_REVISION constant, the turn carrying it, and the coach's day -
       never a value read back off the conversation. */
    const issuance = { producer: record.producer, body: record.body, reason: record.reason,
      revision: ENGINE_REVISION, source: turn_id,
      /* day resolution per DECISIONS:456 - today.today is the coach's day
         string, not an instant; a finer moment can come later from the same
         source Today uses, never from a clock read here. */
      moment: day };
    const stored = consent.recordIssuance({ id, accepted: true, instance: null,
      producer: record.producer, revision: ENGINE_REVISION });
    if (!stored || stored.stored !== true) {
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, CODES.CONSENT_ISSUANCE_NOT_STORED,
        "Your yes could not be recorded on this device. Nothing changed.",
        "rebuild/client/index.cjs recordIssuance()");
    }
    const answered = consent.respond(id, "accept", issuance);
    if (!answered || answered.acknowledged !== true) {
      /* PM RULING (P6-COACH-WIRE-2, round 2, item 3): a refused respond()
         must not leave the durable issuances row claiming accepted:true
         with no proposal-response op behind it - compensate the write so
         the row reads accepted:false before returning unavailable. */
      /* P4b-1 folds in the residual :458 carried: that compensating write must
         CHECK ITS OWN RESULT. If it does not store, the durable row still reads
         accepted:true with no proposal-response op behind it, and the athlete is
         owed that sentence rather than a refusal that implies the record is
         clean. */
      const compensated = consent.recordIssuance({ id, accepted: false, instance: null,
        producer: record.producer, revision: ENGINE_REVISION });
      if (!compensated || compensated.stored !== true) {
        return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, CODES.CONSENT_ISSUANCE_NOT_COMPENSATED,
          "Your yes was not accepted, and I could not clear the record of it either. "
          + "Nothing changed in your plan, but the record of that yes may still say otherwise. Check it in settings.",
          "rebuild/client/index.cjs recordIssuance() (the compensating write)");
      }
      return unavailable("accept_proposal", TIER.PROPOSAL, turn_id, (answered && answered.code) || "PLAN_CONSENT_NOT_ACKNOWLEDGED",
        (answered && answered.copy) || null, "rebuild/client/index.cjs respond()");
    }
    const entry = freeze({ proposal_id: id, proposal: record, reason: record.reason,
      op_id: answered.op_id || null, issuance_stored: true, turn_id });
    accepted.set(id, entry);
    consentLedger.push(entry);
    return assertNoLeak(ok("accept_proposal", TIER.PROPOSAL, turn_id, {
      proposalId: tagged(turn_id, "coach.proposal.id", id, "id", ""),
      reason: text(turn_id, record.engine_source + " (reason from issued proposal)", record.reason),
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
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return { ok: false, code: CODES.COST_CAP_ABSENT, reason: "No cost-cap record was supplied. No live session may start." };
  }
  /* THE SHAPE EXAMPLE IS NOT A CAP (C5 review round 1, C1). cap.example.json
     says so in its own first field, and a verifier that green-lights a
     self-declared placeholder is a false green sitting exactly where fail-closed
     was required. Any annotation key — anything starting with "_" — means this
     is a document about a cap, not a cap on an account. A live record carries
     none, so there is nothing legitimate to lose by refusing here. */
  const annotations = Object.keys(record).filter((k) => k.charAt(0) === "_");
  if (annotations.length) {
    return { ok: false, code: CODES.COST_CAP_INVALID,
      reason: "this is the shape example, not a cap on any account (it carries " + annotations.join(", ") + ")" };
  }
  const missing = CAP_REQUIRED.filter((k) => record[k] === undefined || record[k] === null || record[k] === "");
  if (missing.length) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "Cap record is missing: " + missing.join(", ") };
  for (const k of ["cap_usd_month", "cap_usd_session", "per_minute_usd"]) {
    if (typeof record[k] !== "number" || !Number.isFinite(record[k]) || record[k] <= 0) {
      return { ok: false, code: CODES.COST_CAP_INVALID, reason: k + " must be a positive number" };
    }
  }
  if (record.verified !== true) return { ok: false, code: CODES.COST_CAP_INVALID, reason: "verified must be exactly true. A cap nobody checked is not a cap." };
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

/* ------------------------------------------------------ the opt-in gate -- */

/* "Explicit opt-in for each user" (owner ruling), "two named users only — Joe
   and Dad". PER USER, not per build (C5 review round 1, C4): one boolean `true`
   used to open the gate for anybody, and the user id was silently ignored. An
   opt-in is now a RECORD belonging to one named user, and it must carry the
   wording that user actually saw — wording that says plainly that the audio and
   the text leave this phone. Nothing here starts a session either way. */
const NAMED_USERS = Object.freeze(["joe", "dad"]);
const OPT_IN_REQUIRED = Object.freeze(["user", "accepted", "accepted_at", "screen_version", "wording"]);
const OPT_IN_CODE = "COACH_OPT_IN_REQUIRED";
const no = (reason) => ({ ok: false, code: OPT_IN_CODE, reason });

function verifyOptIn(optIn, user) {
  if (typeof user !== "string" || !NAMED_USERS.includes(user)) {
    return no("A live session belongs to one named user. Say who is talking (" + NAMED_USERS.join(" or ")
      + "); a session with no user is not a session anyone consented to.");
  }
  if (!optIn || typeof optIn !== "object" || Array.isArray(optIn)) {
    return no("A bare yes is not an opt-in. " + user + " opts in on a screen, and the record of that screen "
      + "saying who, when and which wording, is what opens this gate.");
  }
  const missing = OPT_IN_REQUIRED.filter((k) => optIn[k] === undefined || optIn[k] === null || optIn[k] === "");
  if (missing.length) return no("The opt-in record is missing: " + missing.join(", ") + ".");
  if (optIn.user !== user) {
    return no("That opt-in belongs to " + String(optIn.user) + ", not to " + user
      + ". One user's yes never speaks for another.");
  }
  if (optIn.accepted !== true) return no(user + " has not answered yes on the opt-in screen.");
  if (!Number.isFinite(Date.parse(optIn.accepted_at))) return no("accepted_at is not an ISO timestamp.");
  const wording = String(optIn.wording);
  const names = [[/phone/i, "that this phone is where it starts"], [/audio|voice/i, "the audio"],
    [/\btext\b|transcript/i, "the text"], [/leav|sent|send|goes|go to/i, "that it leaves the phone"]];
  const unnamed = names.filter(([re]) => !re.test(wording)).map(([, what]) => what);
  if (unnamed.length) {
    return no("The opt-in wording must name what actually happens. It does not name: " + unnamed.join(", ")
      + ". A yes to words that hide the transfer is not consent to the transfer.");
  }
  return { ok: true, code: null, reason: null, user };
}

/* The one gate in front of anything live. There is deliberately no live session
   in this task: this refuses, and a future adapter must call it first. */
function startLiveSession({ cap, now, optIn, user } = {}) {
  const verdict = verifyCostCap(cap, { now });
  if (!verdict.ok) return { started: false, code: verdict.code, reason: verdict.reason };
  const consent = verifyOptIn(optIn, user);
  if (!consent.ok) return { started: false, code: consent.code, reason: consent.reason };
  return { started: false, code: "COACH_NO_LIVE_ADAPTER", reason: "The cap and " + user + "'s opt-in are in order. No live model adapter exists in this build; the text-first prototype is the only coach here." };
}

module.exports = {
  provenance, UNKNOWN_TOOL_COPY, refusalHasOwnEnding,
  createCoachTools, TIER, CODES, NEVER_VIA_COACH, TIER3_TOPICS,
  tagged, blank, num, text, numericTokens, collectTagged, allowedTokens, untraceable, traceable,
  parseUnits, UNIT_WORDS, FIELD_WORDS, BARE_SPEAKABLE, carriesNumber,
  CHARTER_BANNED, charterViolations, FORBIDDEN_KEYS, assertNoLeak,
  verifyCostCap, startLiveSession, verifyOptIn, CAP_REQUIRED, NAMED_USERS, OPT_IN_REQUIRED,
};
