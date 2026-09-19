"use strict";

/* memory-commands.cjs - the coach's CLOSED producer command for
 * `earned/coach-memory/v1` (P4B-1-CUSTODY-RULING.md section 3 point 2).
 *
 * WHY A PRODUCER AT ALL. The seam is machine-settings-commands.cjs's, re-cited
 * and not re-argued: `workout` is the only PRODUCER-INJECTED command the
 * accepted stage takes (checkin-commands.cjs:11-19), so a producer module is the
 * ONLY way to write a dated non-workout fact without editing rebuild/client or
 * t2-stage.cjs, neither of which this lane owns. `schemaVersion: 2` is the era's
 * own lease schema for the same reason the check-in's is.
 *
 * NOTHING HERE IS INTERPRETED, AND THE TEXT IS NOT EVEN TRIMMED. The identifiers
 * (memory id, kind, topic) are trimmed and bounded, because they are handles the
 * product compares. The athlete's own sentence is stored EXACTLY as it was
 * confirmed: no trim, no normalising, no escaping, no case folding, no language
 * detection. A trim would eat a trailing U+FEFF, and then the store would hold
 * one string and read back another; a memory that changes on the way in is not a
 * memory of what he said.
 *
 * THERE IS NO CLOCK HERE. The effective date, the offset and the provenance come
 * from the envelope the accepted client builds, exactly as they do for a machine
 * setting. This module reads no clock, no environment and no network, and a cell
 * scans it to prove so.
 *
 * ONE OP PER CONFIRMED MEMORY, and the log is append-only. Correction and
 * retirement are P4b-2 and are deliberately absent: there is no update and no
 * delete here, because there is neither in the log.
 */

const PROFILE = "earned/coach-memory/v1";
const ACTION = "coach-memory";
/* The accepted client stamps every producer-injected command schema_version 2
   and refuses a lease of any other schema (checkin-commands.cjs:172-174). */
const MEMORY_SCHEMA_VERSION = 2;

/* SOURCED, not invented: TEXT_MAX 400 and the 80 character identifier bound are
   the existing ones (machine-settings-commands.cjs:33-36). INVENTED, declared in
   the brief and fixed by the ruling: the profile name, the four kinds and the
   member names. */
const TEXT_MAX = 400;
const ID_MAX = 80;
const PARENTS_MAX = 8;
const KINDS = Object.freeze(["goal", "preference", "constraint", "decision-note"]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("COACH_MEMORY_INPUT_INVALID"); };
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/* An identifier: trimmed at the ends, bounded, case KEPT. This is the ONE topic
   rule, and the read side uses this same function, so a topic written and a
   topic asked for cannot drift apart. There is no fuzzy match and no substring
   match anywhere in this lane. */
function topicOf(v) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s.length > ID_MAX) return null;
  return s;
}

/* The athlete's sentence, EXACTLY. Bounded, and it must carry at least one
   character that is not whitespace, because a memory of nothing is not a memory.
   A zero width space is not whitespace, so it survives that test and is stored. */
function textOf(v) {
  if (typeof v !== "string") return null;
  if (v.length < 1 || v.length > TEXT_MAX) return null;
  if (v.trim().length === 0) return null;
  return v;
}

/* THE ONE GATE, used on the REQUEST and again on the ENVELOPE, so the two can
   never drift. It returns the canonical object or throws a named code. Every
   member is read through an OWN-property check, so a member that only exists on
   a prototype is absent rather than inherited. */
function memoryOf(input) {
  if (!isMap(input)) bad();
  for (const key of Object.keys(input)) {
    if (key !== "memory_id" && key !== "kind" && key !== "topic" && key !== "text" && key !== "interval") bad();
  }
  for (const key of ["memory_id", "kind", "topic", "text"]) if (!own(input, key)) bad();

  const memory_id = topicOf(input.memory_id);
  if (!memory_id) bad();
  if (typeof input.kind !== "string" || !KINDS.includes(input.kind)) bad();
  const topic = topicOf(input.topic);
  if (!topic) bad();
  const text = textOf(input.text);
  if (text === null) bad();

  const out = { memory_id, kind: input.kind, topic, text };
  /* APPLICABILITY IS EXPLICIT (the brief, section 3 M1). A temporary constraint
     carries only the range the athlete confirmed; a constraint with no range is
     NEEDS REVIEW at read time, never an active restriction. */
  if (own(input, "interval")) {
    const i = input.interval;
    if (!isMap(i) || Object.keys(i).length !== 2 || !own(i, "from") || !own(i, "to")) bad();
    if (typeof i.from !== "string" || typeof i.to !== "string") bad();
    if (!DATE.test(i.from) || !DATE.test(i.to) || i.from > i.to) bad();
    out.interval = { from: i.from, to: i.to };
  }
  return out;
}

function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) {
    if (key !== "memory" && key !== "effective" && key !== "parents") bad();
  }
  if (!own(input, "memory")) bad();
  const action = { class: "event", kind: "fact",
    payload: { profile: PROFILE, memory: memoryOf(input.memory) },
    parents: [] };
  /* The preceding memory operations this one refers to. They are the log's own
     op ids and nothing else; validate() below checks every one of them against
     the log AND against the athlete the op belongs to. */
  if (own(input, "parents")) {
    const parents = input.parents;
    if (!Array.isArray(parents) || parents.length > PARENTS_MAX) bad();
    for (const id of parents) if (typeof id !== "string" || !id.trim() || id.length > ID_MAX) bad();
    action.parents = parents.slice();
  }
  if (own(input, "effective")) {
    const e = input.effective;
    if (!isMap(e) || Object.keys(e).length !== 3
      || !["local_date", "local_time", "utc_offset"].every((k) => typeof e[k] === "string")) bad();
    action.effective = { local_date: e.local_date, local_time: e.local_time, utc_offset: e.utc_offset };
  }
  return action;
}

/* The shape the client re-checks on the envelope it actually built, after its
   own Ops.build. It ACCEPTS ITS OWN ENVELOPE and refuses anything else: a
   workout set, a weigh-in, a machine setting, a first-run setup, a payload with
   a third member, or a causal parent the log does not hold or that belongs to
   ANOTHER athlete. */
function validate(op, readOperation) {
  if (!op || op.kind !== "fact" || op.class !== "event") return false;
  if (!op.effective || !DATE.test(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.memory)) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { memoryOf(JSON.parse(JSON.stringify(op.payload.memory))); } catch { return false; }
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function createMemoryCommands() {
  return Object.freeze({ schemaVersion: MEMORY_SCHEMA_VERSION, prepare, validate });
}

/* THE READ-BACK, as a pure function of a generation, so the host that owns the
   store stays in memory-host.mjs and this module stays testable without one.
   Narrowed by profile equality exactly as machineSettingsIn is: in ONE
   generation that equality is what keeps a weigh-in, a workout set, a check-in,
   a machine setting and a first-run setup out of this list. */
function memoriesIn(generation) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === "tombstone" && typeof op.target_op_id === "string")
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === "fact" && op.class === "event"
      && op.payload && op.payload.profile === PROFILE
      && isMap(op.payload.memory) && typeof op.payload.memory.memory_id === "string"
      && op.effective && typeof op.effective.local_date === "string"
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({
      op_id: op.op_id,
      date: op.effective.local_date,
      time: op.effective.local_time || null,
      seq: op.device_seq || 0,
      memory: JSON.parse(JSON.stringify(op.payload.memory)),
    }));
}

/* EVERY MEMORY ON ONE TOPIC, and nothing else. The topic is put through the SAME
   gate the write side used, and then compared with equality: no fuzzy match, no
   substring match, no case folding. A topic that is not a topic at all returns
   null, which is a DIFFERENT answer from "no memories on this topic" and the
   tool says so in different words. */
function forTopic(rows, topic) {
  const wanted = topicOf(topic);
  if (!wanted) return null;
  return (rows || []).filter((row) => row && row.memory && row.memory.topic === wanted);
}

module.exports = {
  createMemoryCommands, prepare, validate, memoryOf, topicOf, textOf, memoriesIn, forTopic,
  PROFILE, ACTION, MEMORY_SCHEMA_VERSION, KINDS, TEXT_MAX, ID_MAX, PARENTS_MAX,
};
