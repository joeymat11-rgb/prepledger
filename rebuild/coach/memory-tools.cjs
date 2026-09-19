"use strict";

/* memory-tools.cjs - the coach's two memory tools: a tier-0 RECALL and a tier-1
 * REMEMBER with a bound confirmation step.
 *
 * NOTHING IS WRITTEN WITHOUT AN EXPLICIT, BOUND YES (the ruling, section 3 point
 * 3). The discipline is accept_proposal's, in the same shape: the tool first
 * PROPOSES, which checks the shape and hands back a confirmation handle bound to
 * that exact memory and to nothing else; the athlete's yes then arrives carrying
 * that handle. A missing yes, a cancelled handle, a spent handle, a handle for
 * different words, an invalid shape, a forged parent or a store that cannot be
 * authenticated all write NOTHING: no operation, no outbox entry.
 *
 * THE FLAG IS THE HARNESS'S, NOT THE MODEL'S (model-adapter.md section 2). This
 * module never sets the confirmation flag on its own arguments; a cell greps
 * this source to prove it, and the remember tool sits at tier 1 in the tier map
 * so the harness knows it must hear the yes first.
 *
 * A REMEMBERED TEXT IS DATA. It is published in the envelope as a plainly
 * labelled data member and deliberately NOT as a tagged value: tools.cjs
 * collectTagged() therefore never sees it and allowedTokens() never licenses a
 * number inside it. So "my target is 210 grams" can be read back as the
 * athlete's own sentence and can still never become a figure the coach states.
 * That is design point 6 with teeth, and it is the M-H mutant's grave.
 *
 * RECALL IS BOUNDED AND BY EXPLICIT TOPIC. Five facts a turn, ordered by
 * memory-model.cjs's one stated rule, never a scan of histories and never the
 * whole store. A topic nobody named is a refusal, not an invitation to send
 * everything.
 */

const T = require("./tools.cjs");
const Memory = require("./memory-commands.cjs");
const Model = require("./memory-model.cjs");

const TIER = T.TIER;

const MEMORY_TIERS = Object.freeze({ recall: TIER.READ, remember: TIER.FACT });

const MEMORY_CODES = Object.freeze({
  CONFIRMATION_REQUIRED: T.CODES.CONFIRMATION_REQUIRED,
  CONFIRMATION_UNKNOWN: "COACH_MEMORY_CONFIRMATION_UNKNOWN",
  CONFIRMATION_CANCELLED: "COACH_MEMORY_CONFIRMATION_CANCELLED",
  CONFIRMATION_SPENT: "COACH_MEMORY_CONFIRMATION_SPENT",
  CONFIRMATION_MISMATCH: "COACH_MEMORY_CONFIRMATION_MISMATCH",
  MEMORY_INPUT_INVALID: "COACH_MEMORY_INPUT_INVALID",
  MEMORY_LANE_ABSENT: "COACH_MEMORY_LANE_ABSENT",
  MEMORY_TOPIC_REQUIRED: "COACH_MEMORY_TOPIC_REQUIRED",
  MEMORY_ABSENT: "COACH_MEMORY_ABSENT",
  MEMORY_UNREADABLE: "COACH_MEMORY_UNREADABLE",
  MEMORY_NOT_RECORDED: "COACH_MEMORY_NOT_RECORDED",
  MEMORY_READ_BACK_FAILED: "COACH_MEMORY_READ_BACK_FAILED",
  MEMORY_TOOL_THREW: "COACH_MEMORY_TOOL_THREW",
});

const ok = (tool, tier, turn_id, values, extra) =>
  Object.freeze({ tool, tier, turn_id, ok: true, values: values || {}, ...(extra || {}) });

/* The same refusal envelope tools.cjs and wave1-tools.cjs already return, with
   room for the members a memory refusal has to carry: the confirmation handle a
   propose step issues, and the truthful commit a failed read-back still holds. */
const refuse = (tool, tier, turn_id, code, reason, source, extra) =>
  Object.freeze({ tool, tier, turn_id, ok: false,
    unavailable: Object.freeze({ code, reason, source: source || null }),
    values: Object.freeze({
      code: T.tagged(turn_id, "coach.refusal.code", code, "code", ""),
      reason: T.text(turn_id, "coach.refusal." + code, reason),
    }),
    ...(extra || { state_unchanged: true }) });

/* A REMEMBERED TEXT, published as DATA. No turn_id, so it is not a tagged value
   and licenses no number in any unit; `licensed: false` says so out loud to
   anything reading the envelope. */
const dataText = (source, value) => Object.freeze({
  display: value, value, kind: "memory-text", source, licensed: false });

/* What memory-model.cjs's join takes, built from an item the recall published. */
function faceOf(item) {
  if (!item) return null;
  return { text: item.text ? item.text.display : null,
    source: item.text ? item.text.source : null,
    date: item.recordedOn ? item.recordedOn.display : null,
    kind: item.kind ? item.kind.value : null,
    topic: item.topic ? item.topic.value : null,
    label: item.label ? item.label.value : null,
    interval: item.interval || null };
}

/* world : the openCoachWorld world; world.memory is the durable lane
 * coach : createCoachTools(world), or createWave1Tools({world, coach}) over it,
 *         so ONE turn can call the C5 fifteen, the wave-one four and these two,
 *         and the traceability check sees all of them together
 */
function createMemoryTools({ world, coach } = {}) {
  if (!world || !world.today) throw new TypeError("createMemoryTools requires the coach world");
  if (!coach || typeof coach.openTurn !== "function") throw new TypeError("createMemoryTools requires the coach tools");
  const lane = world.memory || null;
  const day = world.day;

  /* The open confirmations, per INSTANCE and never durable: a yes belongs to the
     conversation it was said in, so a new coach instance after a restart knows
     nothing about it. That is what makes a replayed yes across a restart an
     unknown handle rather than a second write. */
  const pending = new Map();
  let handles = 0;
  const bindingOf = (memory) => JSON.stringify(memory);

  function cancel(confirmation_id) {
    const entry = pending.get(confirmation_id);
    if (!entry || entry.state !== "open") return false;
    entry.state = "cancelled";
    return true;
  }

  /* ------------------------------------------------------------- tier 0 -- */

  async function recall(args, turn_id) {
    if (!lane || typeof lane.forTopic !== "function") {
      return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_LANE_ABSENT,
        "There is no place on this device to keep what you tell me yet, so I have nothing to read back.",
        "local-world.mjs createMemoryHost");
    }
    const topic = Memory.topicOf(args && args.topic);
    if (!topic) {
      return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_TOPIC_REQUIRED,
        "I need to know which one you mean. Name the subject and I will read back what you told me about it.",
        "memory-commands.cjs topicOf()");
    }
    const read = await lane.forTopic(topic);
    if (!read.ok) {
      /* unreadable is NOT empty, and the athlete is told which one happened */
      return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_UNREADABLE,
        "I could not read what this device has kept, so I will not tell you it is empty. Nothing was changed.",
        "memory-host.mjs read() (" + read.code + ")");
    }
    if (!read.rows.length) {
      return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_ABSENT,
        "I have nothing kept on that subject on this device.",
        "earned/coach-memory/v1 (no memory on this topic)");
    }
    return T.assertNoLeak(envelopeFor(read.rows, topic, turn_id));
  }

  function itemFor(entry, turn_id) {
    const row = entry.row;
    const from = "coach-memory.op " + row.op_id;
    return {
      memoryId: T.tagged(turn_id, from + " memory_id", row.memory.memory_id, "id", ""),
      kind: T.tagged(turn_id, from + " kind", row.memory.kind, "kind", row.memory.kind),
      topic: T.tagged(turn_id, from + " topic", row.memory.topic, "topic", row.memory.topic),
      label: T.tagged(turn_id, "memory-model.labelFor", entry.label, "label", entry.label),
      recordedOn: T.tagged(turn_id, from + " effective.local_date", row.date, "date", row.date),
      /* DATA, not a tagged value: see the head of this file */
      text: dataText(from, row.memory.text),
    };
  }

  function envelopeFor(rows, topic, turn_id) {
    const bounded = Model.recall(rows, { day });
    const values = {
      topic: T.tagged(turn_id, "coach.request.topic", topic, "topic", topic),
      shown: T.tagged(turn_id, "memory-model.recall.shown", bounded.shown, "fact", ""),
      more: T.tagged(turn_id, "memory-model.recall.more", bounded.more, "flag", ""),
      note: T.text(turn_id, "coach.memory.bound", bounded.more
        ? "I am showing the five most recent. There are more kept on this subject."
        : "That is everything I have kept on this subject."),
      items: bounded.items.map((entry) => itemFor(entry, turn_id)),
    };
    return ok("recall", TIER.READ, turn_id, values,
      { state_unchanged: true, bounded: Model.RECALL_MAX, ordering: Model.ORDERING });
  }

  /* -------------------------------------------------- tier 1 - the MEMORY -- */

  async function remember(args, turn_id) {
    const a = args || {};
    for (const key of Object.keys(a)) {
      if (key !== "memory" && key !== "confirmed" && key !== "confirmation_id") {
        return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.MEMORY_INPUT_INVALID,
          "I could not keep that, and I have kept nothing. Tell me again in your own words.",
          "memory-tools.cjs remember() takes a memory and your yes, and nothing else");
      }
    }
    if (!lane || typeof lane.save !== "function") {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.MEMORY_LANE_ABSENT,
        "There is no place on this device to keep what you tell me yet, so I have kept nothing.",
        "local-world.mjs createMemoryHost");
    }
    /* THE ONE GATE, before anything else: a shape the producer would refuse is
       refused here, with nothing written and no confirmation offered. */
    let canonical;
    try { canonical = Memory.memoryOf(a.memory); }
    catch (error) {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.MEMORY_INPUT_INVALID,
        "I could not keep that, and I have kept nothing. Tell me again in your own words.",
        (error && error.message) || "memory-commands.cjs memoryOf()");
    }

    /* NO YES YET: propose, and hand back a handle bound to THESE words. Nothing
       is written, and the flag is never set here: it is the harness's, set only
       after it has heard him say yes (model-adapter.md section 2). */
    if (a.confirmed !== true) {
      handles += 1;
      const confirmation_id = "memconf-" + handles;
      pending.set(confirmation_id, { state: "open", binding: bindingOf(canonical) });
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.CONFIRMATION_REQUIRED,
        "I have not kept that yet. Say yes and I will keep it in these words: " + canonical.text,
        "P4B-1-CUSTODY-RULING.md section 3 point 3",
        { state_unchanged: true,
          confirmation: Object.freeze({ confirmation_id, kind: canonical.kind,
            topic: canonical.topic, text: canonical.text }) });
    }

    const entry = pending.get(a.confirmation_id);
    if (!entry) {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.CONFIRMATION_UNKNOWN,
        "I do not have a yes from this conversation for those words, so I have kept nothing. Tell me again and I will ask.",
        "memory-tools.cjs pending confirmations (per conversation, never durable)");
    }
    if (entry.state === "cancelled") {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.CONFIRMATION_CANCELLED,
        "You cancelled that one, so I have kept nothing. Tell me again if you want it after all.",
        "memory-tools.cjs cancel()");
    }
    if (entry.state === "spent") {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.CONFIRMATION_SPENT,
        "I already kept that once, and one yes keeps it once. Nothing was written a second time.",
        "memory-tools.cjs pending confirmations (one yes, one write)");
    }
    if (entry.binding !== bindingOf(canonical)) {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.CONFIRMATION_MISMATCH,
        "Those are not the words you said yes to, so I have kept nothing. Ask me again and I will read the new words back.",
        "memory-tools.cjs confirmation binding");
    }
    /* The handle is spent BEFORE the write, so a yes cannot be in flight twice.
       A save that then fails is an honest failure the athlete is told about, and
       the next attempt is a new question and a new yes. */
    entry.state = "spent";

    const saved = await lane.save(canonical);
    if (!saved.ok) {
      /* the accepted layer's OWN code and copy, carried unedited */
      return refuse("remember", TIER.FACT, turn_id, saved.code || MEMORY_CODES.MEMORY_NOT_RECORDED,
        saved.copy || "I could not keep that on this device, and I have kept nothing.",
        "memory-host.mjs save() -> client.execute('workout', {action:'coach-memory'})");
    }
    /* THE READ-BACK. A commit that landed is a commit that landed: if the store
       cannot be read afterwards the tool says BOTH of those things, names the
       operation it holds from the commit, and writes nothing a second time. */
    const read = await lane.read();
    const row = read.ok ? read.rows.find((r) => r.op_id === saved.op_id) : null;
    if (!row) {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.MEMORY_READ_BACK_FAILED,
        "I kept it: it is recorded on this device as " + saved.op_id
        + ". I could not read it back just now, so I cannot show it to you yet. It was not written twice.",
        "memory-host.mjs read() (" + (read.code || "the operation was not in the view") + ")",
        { committed: true, recorded: true, op_id: saved.op_id });
    }
    const label = Model.labelFor(row, day);
    return T.assertNoLeak(ok("remember", TIER.FACT, turn_id, {
      opId: T.tagged(turn_id, "coach-memory.save.op_id", saved.op_id, "id", ""),
      item: itemFor({ row, label }, turn_id),
      consequence: T.text(turn_id, "coach.memory.consequence",
        "I have kept that in your own words. It does not change your plan or any of your targets."),
    }, { recorded: true, committed: true, op_id: saved.op_id }));
  }

  /* -------------------------------------------------------------- wiring -- */

  const IMPL = Object.freeze({ recall, remember });
  const TIERS = Object.freeze(Object.assign({}, coach.TIERS, MEMORY_TIERS));

  async function dispatch(name, args, turn_id) {
    if (typeof turn_id !== "string" || !turn_id) throw new TypeError("dispatch: a turn_id is required");
    if (Object.prototype.hasOwnProperty.call(IMPL, name)) {
      try { return await IMPL[name](args, turn_id); }
      catch (error) {
        return refuse(name, MEMORY_TIERS[name], turn_id, MEMORY_CODES.MEMORY_TOOL_THREW,
          (error && error.message) || "the tool refused", "memory-tools.cjs dispatch");
      }
    }
    if (typeof coach.dispatch === "function") return coach.dispatch(name, args, turn_id);
    const served = coach.TOOLS && coach.TOOLS[name];
    if (typeof served === "function") return served(args, turn_id);
    return refuse(name, TIERS[name] === undefined ? null : TIERS[name], turn_id,
      "MEMORY_TOOL_NOT_IN_LIST", String(name) + " is not one of the coach's tools", "memory-tools.cjs TIERS");
  }

  /* ONE TURN, every vocabulary. The memory tools push into the SAME results
     array the coach's own tools use, so `untraceable` judges a spoken sentence
     against everything the turn actually read and nothing else. */
  function openTurn(turn_id) {
    const base = coach.openTurn(turn_id);
    const call = Object.assign({}, base.call);
    for (const name of Object.keys(IMPL)) {
      call[name] = async (args) => { const r = await dispatch(name, args, turn_id); base.results.push(r); return r; };
    }
    return Object.freeze({ turn_id, results: base.results, call,
      untraceable: base.untraceable, traceable: base.traceable });
  }

  return Object.freeze({
    TIERS, MEMORY_TIERS, TIER, MEMORY_CODES, dispatch, openTurn, coach, faceOf,
    tools: () => Object.keys(TIERS),
    memoryTools: () => Object.keys(MEMORY_TIERS),
    /* the athlete's no, spoken by the harness the same way his yes is */
    cancel,
    pending: () => Array.from(pending.entries()).map(([id, entry]) => ({ id, state: entry.state })),
    /* THE M06 PAIR, for a consumer that has read the canonical value through its
       OWN owner in this same turn. This lane never reads another lane's store. */
    beside: (canonical, item) => Model.joinOf({ canonical, memory: faceOf(item), day }),
  });
}

module.exports = { createMemoryTools, MEMORY_TIERS, MEMORY_CODES, faceOf, TIER };
