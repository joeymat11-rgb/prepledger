"use strict";

/* machine-settings-commands.cjs - the coach's CLOSED producer command for
 * `earned/machine-settings/v1` (BRIEF-COACH-WAVE1-TEXT.md section 3).
 *
 * WHY A PRODUCER AT ALL. checkin-commands.cjs:11-19 states the seam exactly:
 * `workout` is the only PRODUCER-INJECTED command createT2Stage takes, so a
 * producer module is the ONLY way to write a dated non-workout fact without
 * editing rebuild/client or t2-stage.cjs, neither of which this lane owns. This
 * module is that producer for machine settings. Seam S1 is re-cited, not
 * re-argued, and `schemaVersion: 2` is the era's own lease schema for the same
 * reason the check-in's is (checkin-commands.cjs:172-174).
 *
 * NOTHING HERE IS INTERPRETED. "Seat four" is stored as the string "four" if that
 * is what he said. There is no numeric derivation, no unit invented, no
 * normalising and no ordering of his own words: a stored setting is his sentence
 * cut into the pairs he gave, and the read tool hands it back in that order.
 *
 * ONE OP PER CHANGE, keyed by exercise id. The log is append-only, so a
 * correction is a NEW op and the reader takes the LATEST. There is no update and
 * no delete here, because there is neither in the log.
 */

const PROFILE = "earned/machine-settings/v1";
const ACTION = "machine-settings";
/* The accepted client stamps every producer-injected command schema_version 2
   and refuses a lease of any other schema (checkin-commands.cjs:172-174). */
const MACHINE_SETTINGS_SCHEMA_VERSION = 2;

/* INVENTED, declared in the brief: the profile name, the caps and the member
   names. SOURCED: TEXT_MAX 400 (checkin-commands.cjs:64), the two-key payload
   (:149, re-checked :158), the at-least-one-answer rule (:108-110). */
const EXERCISE_ID_MAX = 80;
const SETTINGS_MAX = 12;
const SETTING_TEXT_MAX = 40;
const TEXT_MAX = 400;

const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("MACHINE_SETTINGS_INPUT_INVALID"); };
const trimmed = (v, max) => {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s.length > max) return null;
  return s;
};

/* The one gate, used on the REQUEST and again on the ENVELOPE, so the two can
   never drift. It returns the canonical object or throws a named code. */
function machineOf(input) {
  if (!isMap(input)) bad();
  for (const key of Object.keys(input)) {
    if (key !== "exercise_id" && key !== "settings" && key !== "cues") bad();
  }
  const exercise_id = trimmed(input.exercise_id, EXERCISE_ID_MAX);
  if (!exercise_id) bad();

  const out = { exercise_id };

  if (Object.hasOwn(input, "settings")) {
    const list = input.settings;
    if (!Array.isArray(list) || list.length < 1 || list.length > SETTINGS_MAX) bad();
    const seen = new Set();
    out.settings = list.map((pair) => {
      if (!isMap(pair) || Object.keys(pair).length !== 2) bad();
      if (!Object.hasOwn(pair, "name") || !Object.hasOwn(pair, "value")) bad();
      const name = trimmed(pair.name, SETTING_TEXT_MAX);
      const value = trimmed(pair.value, SETTING_TEXT_MAX);
      if (!name || !value) bad();
      /* A name twice is two answers to one question, and this module has no way
         to know which one he meant. */
      if (seen.has(name)) bad();
      seen.add(name);
      return { name, value };
    });
  }
  if (Object.hasOwn(input, "cues")) {
    const cues = trimmed(input.cues, TEXT_MAX);
    if (!cues) bad();
    out.cues = cues;
  }
  /* The check-in's own rule (:108-110): a fact with no answer at all is not a
     fact about anything. */
  if (!Object.hasOwn(out, "settings") && !Object.hasOwn(out, "cues")) bad();
  return out;
}

function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) {
    if (key !== "machine" && key !== "effective") bad();
  }
  const action = { class: "event", kind: "fact",
    payload: { profile: PROFILE, machine: machineOf(input.machine) },
    parents: [] };
  if (Object.hasOwn(input, "effective")) {
    const e = input.effective;
    if (!isMap(e) || Object.keys(e).length !== 3
      || !["local_date", "local_time", "utc_offset"].every((k) => typeof e[k] === "string")) bad();
    action.effective = { local_date: e.local_date, local_time: e.local_time, utc_offset: e.utc_offset };
  }
  return action;
}

/* The shape the client re-checks on the envelope it actually built, after its
   own Ops.build. It ACCEPTS ITS OWN ENVELOPE and refuses anything else: a
   workout set, a weigh-in, a recovery check-in, a first-run setup, a payload
   with a third member, or a causal parent the log does not hold. */
function validate(op, readOperation) {
  if (!op || op.kind !== "fact" || op.class !== "event") return false;
  if (!op.effective || !/^\d{4}-\d{2}-\d{2}$/.test(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.machine)) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { machineOf(JSON.parse(JSON.stringify(op.payload.machine))); } catch { return false; }
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function createMachineSettingsCommands() {
  return Object.freeze({ schemaVersion: MACHINE_SETTINGS_SCHEMA_VERSION, prepare, validate });
}

/* THE READ-BACK, as a pure function of a generation, so the host that owns the
   store stays in local-world.mjs and this module stays testable without one.
   Narrowed by profile equality exactly as checkInsIn is: in ONE generation that
   equality is what keeps a weigh-in, a workout set, a check-in and a first-run
   setup out of this list. */
function machineSettingsIn(generation) {
  const collections = (generation && generation.collections) || {};
  const rejected = collections.rejected || {};
  const dead = new Set(Object.values(collections.ops || {})
    .filter((op) => op && op.kind === "tombstone" && typeof op.target_op_id === "string")
    .map((op) => op.target_op_id));
  return Object.values(collections.ops || {})
    .filter((op) => op && op.kind === "fact" && op.class === "event"
      && op.payload && op.payload.profile === PROFILE
      && isMap(op.payload.machine) && typeof op.payload.machine.exercise_id === "string"
      && op.effective && typeof op.effective.local_date === "string"
      && !rejected[op.op_id] && !dead.has(op.op_id))
    .sort((a, b) => (a.device_seq || 0) - (b.device_seq || 0) || (a.op_id < b.op_id ? -1 : 1))
    .map((op) => Object.freeze({
      op_id: op.op_id,
      date: op.effective.local_date,
      time: op.effective.local_time || null,
      machine: JSON.parse(JSON.stringify(op.payload.machine)),
    }));
}

/* THE LATEST for one exercise id, and nothing else. By effective date, then by
   the log's own order, which is what `machineSettingsIn` already sorted on. */
function latestFor(rows, exercise_id) {
  const id = typeof exercise_id === "string" ? exercise_id.trim() : "";
  if (!id) return null;
  let latest = null;
  for (const row of rows) {
    if (row.machine.exercise_id !== id) continue;
    if (!latest || row.date >= latest.date) latest = row;
  }
  return latest;
}

module.exports = {
  createMachineSettingsCommands, prepare, validate, machineOf, machineSettingsIn, latestFor,
  PROFILE, ACTION, MACHINE_SETTINGS_SCHEMA_VERSION,
  EXERCISE_ID_MAX, SETTINGS_MAX, SETTING_TEXT_MAX, TEXT_MAX,
};
