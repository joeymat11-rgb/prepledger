"use strict";

/* memory-model.cjs - the PURE join for `earned/coach-memory/v1`.
 *
 * Three rules live here and nowhere else, so there is one place to read them and
 * one place to break them:
 *
 * 1. THE ORDERING RULE. Most recent EFFECTIVE DATE first; a tie is broken by the
 *    log's own order, later entry first (device_seq, then op id). It is a total
 *    order over distinct operations, so the same question asked twice returns
 *    the same answer in the same order rather than whatever the store iterated.
 * 2. THE BOUND. At most FIVE facts a turn (the ruling, section 3 point 4). The
 *    envelope SAYS there are more; it never silently truncates, and the facts it
 *    left out do not travel.
 * 3. APPLICABILITY. A goal, a preference and a note are labelled as themselves.
 *    A constraint is a constraint only inside the range the athlete actually
 *    confirmed; with no range, or outside it, it is NEEDS REVIEW. The brief's own
 *    sentence: "Do not turn yesterday's unavailability into a permanent
 *    remembered limitation."
 *
 * CANONICAL TRUTH WINS (M06). joinOf() puts the canonical value FIRST, with the
 * owner's own source, and the memory beside it as the athlete's own words with
 * its own date. It never merges the two into one figure and it never says the
 * memory is mistaken. Nothing here reads a store, a clock, an environment or a
 * network: `day` is passed in, because the day is the host's to know.
 */

const RECALL_MAX = 5;
const NEEDS_REVIEW = "needs-review";
const ORDERING = "effective date, most recent first; then the log's own order, later entry first";

const SPOKEN = { goal: "goal", preference: "preference", constraint: "constraint",
  "decision-note": "note" };

function labelFor(row, day) {
  const memory = (row && row.memory) || row || {};
  if (memory.kind !== "constraint") return memory.kind;
  const interval = memory.interval;
  if (!interval || typeof day !== "string") return NEEDS_REVIEW;
  if (day < interval.from || day > interval.to) return NEEDS_REVIEW;
  return "constraint";
}

function order(rows) {
  return (rows || []).slice().sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    const seqA = a.seq || 0, seqB = b.seq || 0;
    if (seqA !== seqB) return seqB - seqA;
    if (a.op_id === b.op_id) return 0;
    return a.op_id < b.op_id ? 1 : -1;
  });
}

/* The bounded answer: the ordering rule, then the first five, then the truth
   about what was left out. */
function recall(rows, options) {
  const day = options && options.day;
  const max = options && Number.isSafeInteger(options.max) && options.max > 0 ? options.max : RECALL_MAX;
  const ordered = order(rows);
  const items = ordered.slice(0, max).map((row) => Object.freeze({ row, label: labelFor(row, day) }));
  return Object.freeze({ items: Object.freeze(items), total: ordered.length,
    shown: items.length, more: ordered.length > items.length });
}

/* A memory, however it arrives: a row from memoriesIn(), or the face the recall
   tool already published. */
function faceOf(memory) {
  if (memory && memory.memory) {
    return { text: memory.memory.text, kind: memory.memory.kind, topic: memory.memory.topic,
      interval: memory.memory.interval || null,
      source: "coach-memory.op " + memory.op_id, date: memory.date };
  }
  const m = memory || {};
  return { text: m.text, kind: m.kind, topic: m.topic, interval: m.interval || null,
    source: m.source, date: m.date, label: m.label || null };
}

/* THE M06 PAIR. The canonical value, read through its OWN owner and handed in
   here, comes first with its own source and date. The memory follows, named as
   the athlete's own words with its own date. They are never merged, and the
   memory is never graded. No long dash: a colon, a comma or a new sentence says
   the same thing. */
function joinOf({ canonical, memory, day } = {}) {
  const face = faceOf(memory);
  /* a face the recall tool already published carries the label it was given on
     the day it was read, and that label is not recomputed behind its back */
  const label = face.label || labelFor({ memory: { kind: face.kind, interval: face.interval } }, day);
  const c = canonical || {};
  const canonicalValue = c.value === undefined || c.value === null ? "" : String(c.value);
  const said = String(face.text === undefined || face.text === null ? "" : face.text);

  let sentence = "What the app holds now is " + canonicalValue;
  if (c.source) sentence += ", from " + c.source;
  if (c.date) sentence += " on " + c.date;
  sentence += ".";
  sentence += " You told me";
  if (face.date) sentence += " on " + face.date;
  sentence += ': "' + said + '".';
  if (label === NEEDS_REVIEW) {
    sentence += " I do not know whether it still applies, so I am not treating it as a restriction.";
  } else {
    sentence += " That is your own " + (SPOKEN[label] || String(label))
      + ", and it has not changed what the app holds.";
  }

  return Object.freeze({
    canonical: Object.freeze({ value: canonicalValue, source: c.source || null, date: c.date || null }),
    memory: Object.freeze({ text: said, source: face.source || null, date: face.date || null,
      kind: face.kind || null, topic: face.topic || null }),
    label, sentence,
  });
}

module.exports = { RECALL_MAX, NEEDS_REVIEW, ORDERING, SPOKEN, labelFor, order, recall, faceOf, joinOf };
