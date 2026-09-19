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
 * A REMEMBERED TEXT IS DATA, ON EVERY PATH IN THIS FILE. It is published in the
 * envelope as a plainly labelled data member and deliberately NOT as a tagged
 * value: tools.cjs collectTagged() therefore never sees it and allowedTokens()
 * never licenses a number inside it. So "my target is 210 grams" can be read
 * back as the athlete's own sentence and can still never become a figure the
 * coach states. That is design point 6 with teeth, and it is the M-H mutant's
 * grave.
 *
 * NO REFUSAL SENTENCE HERE INTERPOLATES CALLER TEXT OR A MINTED ID. Review round
 * one, B1: a reason is published as T.text(), whose declared unit is "text", and
 * allowedTokens() reads a "text" tag AS ENGINE PROSE and licenses every number
 * in it in whatever unit the words around it name. So a reason that quoted the
 * memory back licensed the athlete's, or the MODEL's, figures for the whole
 * turn, with nothing written and no yes given. Every reason in this file is a
 * FIXED sentence; the words awaiting a yes, the op id a commit holds, an
 * exception's message and a caller's tool name all travel beside it as untagged
 * data, in the `source` member no tag reads. The accepted layer's own copy is
 * still carried verbatim when the store refuses, because reading a client
 * refusal out loud is what tools.cjs:328 intends. The turn-local cell in
 * test/memory.test.cjs and mutant M-Q are this rule's graves; the PM's final
 * read (P-F1) closed the last two sites, the dispatch catch and the unknown
 * tool name, and mutants M-S and M-T are their graves.
 *
 * RECALL IS BOUNDED AND BY EXPLICIT TOPIC. FIVE FACTS A TURN, over every recall
 * in it and not five per call (the ruling's design point 4, as the PM's final
 * read words it): a recall takes what is LEFT of the allowance, says so when it
 * left something out, and a recall with nothing left refuses and reads nothing.
 * Outside a turn, where nobody is counting, the per-call bound is what the tool
 * holds to. The order is memory-model.cjs's one stated rule; it is never a scan
 * of histories and never the whole store. A topic nobody named is a refusal,
 * not an invitation to send everything. THE ALLOWANCE IS RESERVED BEFORE THE
 * STORE READ, not spent after it (review R3-B1): recalls that are in flight
 * together in one turn cannot each spend the same five, and what a call did not
 * use goes straight back.
 *
 * AND A TOPIC LICENSES NOTHING EITHER. Both topic tags publish an EMPTY display,
 * exactly as memoryId does, because the topic is the athlete's own word: this
 * lane bounds its length and constrains no character, and the traceability gate
 * promotes a declared unit to `date` whenever the display reads as a date, so a
 * memory filed under the topic "2019-04-17" let the coach state a date nothing
 * dated (review R3-N5/H1). The topic travels as the tag's value.
 *
 * AND THE ROWS THE READ SIDE COULD NOT READ ARE COUNTED, not hidden. The count
 * travels as untagged data on the answer and on the absence, so "nothing kept"
 * and "something on this device could not be read" stay different answers.
 */

const T = require("./tools.cjs");
const Memory = require("./memory-commands.cjs");
const Model = require("./memory-model.cjs");

const TIER = T.TIER;

const MEMORY_TIERS = Object.freeze({ recall: TIER.READ, remember: TIER.FACT });

/* How many turn accounts one coach instance keeps (review R3-N2). Small and
   fixed: the account is worth a few dozen bytes and only the turns still in
   flight can spend one. */
const TURNS_MAX = 64;

const MEMORY_CODES = Object.freeze({
  CONFIRMATION_REQUIRED: T.CODES.CONFIRMATION_REQUIRED,
  CONFIRMATION_UNKNOWN: "COACH_MEMORY_CONFIRMATION_UNKNOWN",
  CONFIRMATION_CANCELLED: "COACH_MEMORY_CONFIRMATION_CANCELLED",
  CONFIRMATION_SPENT: "COACH_MEMORY_CONFIRMATION_SPENT",
  CONFIRMATION_MISMATCH: "COACH_MEMORY_CONFIRMATION_MISMATCH",
  MEMORY_INPUT_INVALID: "COACH_MEMORY_INPUT_INVALID",
  MEMORY_LANE_ABSENT: "COACH_MEMORY_LANE_ABSENT",
  MEMORY_TOPIC_REQUIRED: "COACH_MEMORY_TOPIC_REQUIRED",
  MEMORY_TURN_BOUND: "COACH_MEMORY_TURN_BOUND",
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

/* A COUNT, published the same way and for the same reason: it is a fact about
   the store, not a figure the coach may state, so it carries no turn_id and
   licenses nothing. */
const dataCount = (source, value) => Object.freeze({
  display: String(value), value, kind: "memory-count", source, licensed: false });

/* What memory-model.cjs's join takes, built from an item the recall published. */
function faceOf(item) {
  if (!item) return null;
  return { text: item.text ? item.text.display : null,
    source: item.text ? item.text.source : null,
    date: item.recordedOn ? item.recordedOn.display : null,
    kind: item.kind ? item.kind.value : null,
    topic: item.topic ? item.topic.value : null,
    label: item.label ? item.label.value : null,
    /* DEAD FOR AN ITEM THIS TOOL PUBLISHED, and named so a later hand does not
       trust it (review R3-N4). itemFor() publishes no `interval` member, so this
       is always null for a recall item and joinOf() falls back to the published
       `label`, which already carries needs-review. The line stays because faceOf
       also takes a face built by hand from a row, where the interval is real. */
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

  /* THE TURN'S ALLOWANCE, five facts, counted here because this is the only
     place that knows how many facts a turn has already published. openTurn()
     opens the account; every recall inside that turn draws on it. A turn_id
     nobody opened has no account, and the per-call bound is what that call
     holds to: the harness that never opens a turn is not thereby given more.
     It is per INSTANCE and never durable, exactly like the pending yeses.
     IT IS ALSO BOUNDED (review R3-N2): an account is dropped when its turn is
     closed, and the map keeps at most TURNS_MAX of the most recent turns, oldest
     evicted, so a long lived process does not leak one small object per turn. An
     evicted turn that recalls again is a turn nobody opened: the per-call bound
     is what it gets, and never more. */
  const turns = new Map();
  const allowanceOf = (turn_id) => {
    const account = turns.get(turn_id);
    return account ? Math.max(0, Model.RECALL_MAX - account.used) : Model.RECALL_MAX;
  };

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
    /* THE TURN'S ALLOWANCE IS SPENT: this call reads NOTHING. The refusal is
       issued before the store is touched, so a turn that has had its five facts
       cannot go on reading and then discard what it read. */
    const account = turns.get(turn_id);
    const allowance = allowanceOf(turn_id);
    if (allowance <= 0) {
      return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_TURN_BOUND,
        "I have read back as much as I hold to in one turn, so I have not read anything else. Ask me again and I will go on.",
        "memory-model.cjs RECALL_MAX (the allowance is the turn's, not the call's)");
    }
    /* THE WHOLE REMAINING ALLOWANCE IS RESERVED HERE, BEFORE THE AWAIT (review
       R3-B1). Reading the allowance and spending it AFTER the store read let
       recalls issued together in one turn all pass the check above and each
       publish their own facts, so six concurrent recalls published twelve. This
       is remember()'s own discipline, sixty lines below: the handle is spent
       BEFORE the write. What this call does not use is refunded the moment the
       rows are known, and the finally gives the WHOLE reserve back on every
       refusal and every throw, so no path leaks allowance. A reserve is
       conservative: recalls in flight together get the facts of the one that
       took it and the turn's refusal for the rest, which is fewer than five and
       never more. */
    if (account) account.used += allowance;
    let refund = allowance;
    try {
      const read = await lane.forTopic(topic);
      if (!read.ok) {
        /* unreadable is NOT empty, and the athlete is told which one happened */
        return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_UNREADABLE,
          "I could not read what this device has kept, so I will not tell you it is empty. Nothing was changed.",
          "memory-host.mjs read() (" + read.code + ")");
      }
      if (!read.rows.length) {
        /* nothing kept on THIS subject, and the count of rows the one gate refused
           travels with it, because the two are different answers */
        return refuse("recall", TIER.READ, turn_id, MEMORY_CODES.MEMORY_ABSENT,
          "I have nothing kept on that subject on this device.",
          "earned/coach-memory/v1 (no memory on this topic)",
          { state_unchanged: true, skipped: skippedOf(read) });
      }
      const bounded = Model.recall(read.rows, { day, max: allowance });
      const envelope = T.assertNoLeak(envelopeFor(read, topic, turn_id, bounded));
      /* the facts this call published are what the turn keeps; the rest of the
         reserve goes back before the envelope leaves */
      refund = allowance - bounded.shown;
      return envelope;
    } finally {
      if (account) account.used -= refund;
    }
  }

  /* The rows the producer's own gate refused on the way out, as DATA. `null`
     when the read itself could not say. */
  const skippedOf = (read) => dataCount(
    "memory-commands.cjs readMemories() (rows the one gate refused)",
    typeof read.skipped === "number" ? read.skipped : null);

  function itemFor(entry, turn_id) {
    const row = entry.row;
    const from = "coach-memory.op " + row.op_id;
    return {
      memoryId: T.tagged(turn_id, from + " memory_id", row.memory.memory_id, "id", ""),
      kind: T.tagged(turn_id, from + " kind", row.memory.kind, "kind", row.memory.kind),
      /* AN EMPTY DISPLAY, for the reason envelopeFor() gives below */
      topic: T.tagged(turn_id, from + " topic", row.memory.topic, "topic", ""),
      label: T.tagged(turn_id, "memory-model.labelFor", entry.label, "label", entry.label),
      recordedOn: T.tagged(turn_id, from + " effective.local_date", row.date, "date", row.date),
      /* DATA, not a tagged value: see the head of this file */
      text: dataText(from, row.memory.text),
    };
  }

  function envelopeFor(read, topic, turn_id, bounded) {
    const values = {
      /* AN EMPTY DISPLAY, exactly as memoryId carries (review R3-N5/H1). The
         topic is the athlete's own word and this lane constrains no character in
         it, while allowedTokens() promotes a declared unit to `date` whenever the
         display itself reads as a date. A memory filed under the topic
         "2019-04-17" therefore licensed a date nothing dated. The topic travels
         as the tag's VALUE, which is what every reader of this envelope uses, and
         a topic carrying a figure now fails closed the way a memory text does. */
      topic: T.tagged(turn_id, "coach.request.topic", topic, "topic", ""),
      shown: T.tagged(turn_id, "memory-model.recall.shown", bounded.shown, "fact", ""),
      more: T.tagged(turn_id, "memory-model.recall.more", bounded.more, "flag", ""),
      /* THE NOTE MUST BE TRUE. The turn's allowance can clip a recall to fewer
         than five, so "I am showing the five most recent" was a sentence that
         could be false while `shown` and `more` were true. It states no number
         now, so no allowance can make it false. */
      note: T.text(turn_id, "coach.memory.bound", bounded.more
        ? "I am showing the most recent ones I can show in this turn."
          + " There are more kept on this subject."
        : "That is everything I have kept on this subject."),
      items: bounded.items.map((entry) => itemFor(entry, turn_id)),
    };
    return ok("recall", TIER.READ, turn_id, values,
      /* `shown` and `more` already say what this call published and whether it
         left something out, and memoryTools.allowance(turn_id) answers what is
         left of the turn's five. Neither is repeated here: the envelope is
         measured against a per-turn byte budget, so a member that says nothing
         new is a member that costs bytes for nothing. */
      { state_unchanged: true, bounded: Model.RECALL_MAX, ordering: Model.ORDERING,
        skipped: skippedOf(read) });
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
        "I have not kept that yet. Your own words are in this result beside the yes I am asking for: say yes and I will keep them exactly as they are.",
        "P4B-1-CUSTODY-RULING.md section 3 point 3",
        { state_unchanged: true,
          confirmation: Object.freeze({ confirmation_id, kind: canonical.kind,
            topic: canonical.topic,
            /* DATA, for the same reason the recalled text is: the reason above is
               engine prose and would license every figure inside these words */
            text: dataText("coach-memory.confirmation (your own words, not yet kept)", canonical.text) }) });
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
      /* THE ACCEPTED LAYER'S OWN CODE AND COPY, carried unedited. Both are the
         accepted layer's fixed vocabulary: see the standing condition on that
         layer in TOOL-CONTRACT.md. A save that THREW answers the host's own fixed
         COACH_MEMORY_WRITE_REFUSED with a null copy, and the exception's message
         arrives as an untagged `detail`, which travels on in `source` beside the
         fixed sentence, the same channel the dispatch catch uses (R3-N3). */
      return refuse("remember", TIER.FACT, turn_id, saved.code || MEMORY_CODES.MEMORY_NOT_RECORDED,
        saved.copy || "I could not keep that on this device, and I have kept nothing.",
        "memory-host.mjs save() -> client.execute('workout', {action:'coach-memory'})"
          + (saved.detail ? " (" + saved.detail + ")" : ""));
    }
    /* THE READ-BACK. A commit that landed is a commit that landed: if the store
       cannot be read afterwards the tool says BOTH of those things, names the
       operation it holds from the commit, and writes nothing a second time. */
    const read = await lane.read();
    const row = read.ok ? read.rows.find((r) => r.op_id === saved.op_id) : null;
    if (!row) {
      return refuse("remember", TIER.FACT, turn_id, MEMORY_CODES.MEMORY_READ_BACK_FAILED,
        "I kept it: it is recorded on this device, and this result names the record it is in."
        + " I could not read it back just now, so I cannot show it to you yet. It was not written twice.",
        "memory-host.mjs read() (" + (read.code || "the operation was not in the view") + ")",
        { committed: true, recorded: true, op_id: saved.op_id,
          /* the op id names the record without being prose: an op id carries the
             device id and its digits, and a reason tag would license them */
          recordedAs: dataText("coach-memory.save.op_id", saved.op_id) });
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
        /* THE FILE'S OWN LAW, ON THE LIVE PATH (the PM's final read, P-F1). An
           exception's message is text NOBODY HERE CONTROLS: a storage error, a
           platform error, or a message carrying words the athlete or the model
           chose. Published as the reason it became a T.text tag, which
           allowedTokens() reads as engine prose and licenses every figure in.
           The sentence is fixed; the message travels in `source`, which no tag
           reads. Mutant M-S is this line's grave. */
        return refuse(name, MEMORY_TIERS[name], turn_id, MEMORY_CODES.MEMORY_TOOL_THREW,
          "Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again.",
          "memory-tools.cjs dispatch: " + ((error && error.message) || "the tool refused"));
      }
    }
    if (typeof coach.dispatch === "function") return coach.dispatch(name, args, turn_id);
    const served = coach.TOOLS && coach.TOOLS[name];
    if (typeof served === "function") return served(args, turn_id);
    /* The same law again (P-F1, and review R2-N3). A tool name is the MODEL's
       word; wave1-tools.cjs already refuses an unknown tool without quoting it.
       The name travels in `source`. Mutant M-T is this line's grave. */
    return refuse(name, TIERS[name] === undefined ? null : TIERS[name], turn_id,
      "MEMORY_TOOL_NOT_IN_LIST", T.UNKNOWN_TOOL_COPY,
      "memory-tools.cjs TIERS: " + String(name));
  }

  /* ONE TURN, every vocabulary. The memory tools push into the SAME results
     array the coach's own tools use, so `untraceable` judges a spoken sentence
     against everything the turn actually read and nothing else. */
  function openTurn(turn_id) {
    const base = coach.openTurn(turn_id);
    /* the turn's account of memory facts, opened once and never reset by a
       second openTurn of the same id: an allowance that could be reopened is
       not an allowance */
    if (!turns.has(turn_id)) {
      turns.set(turn_id, { used: 0 });
      /* oldest first, because a Map iterates in insertion order */
      while (turns.size > TURNS_MAX) turns.delete(turns.keys().next().value);
    }
    const call = Object.assign({}, base.call);
    for (const name of Object.keys(IMPL)) {
      call[name] = async (args) => { const r = await dispatch(name, args, turn_id); base.results.push(r); return r; };
    }
    /* A CLOSED TURN GIVES ITS ACCOUNT BACK AT ONCE, when the coach's own turn
       object has a close to close. The shipped C5 and wave-one turns carry none
       today, so a turn here grows no close it did not already have. */
    const closing = typeof base.close === "function"
      ? { close: () => { turns.delete(turn_id); return base.close(); } }
      : null;
    return Object.freeze({ turn_id, results: base.results, call,
      untraceable: base.untraceable, traceable: base.traceable, ...(closing || {}) });
  }

  return Object.freeze({
    TIERS, MEMORY_TIERS, TIER, MEMORY_CODES, dispatch, openTurn, coach, faceOf,
    tools: () => Object.keys(TIERS),
    memoryTools: () => Object.keys(MEMORY_TIERS),
    /* the athlete's no, spoken by the harness the same way his yes is */
    cancel,
    pending: () => Array.from(pending.entries()).map(([id, entry]) => ({ id, state: entry.state })),
    /* what is left of a turn's five facts, for a harness that wants to ask
       before it calls rather than be refused */
    allowance: (turn_id) => allowanceOf(turn_id),
    /* THE M06 PAIR, for a consumer that has read the canonical value through its
       OWN owner in this same turn. This lane never reads another lane's store. */
    beside: (canonical, item) => Model.joinOf({ canonical, memory: faceOf(item), day }),
  });
}

module.exports = { createMemoryTools, MEMORY_TIERS, MEMORY_CODES, TURNS_MAX, faceOf, TIER };
