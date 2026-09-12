"use strict";

/* food-commands.cjs - N1's CLOSED command: one day's intake becomes ONE operation of
   rebuild/client's own envelope. Kind "fact", class "food-day" - both already members
   of the accepted rebuild/client/ops.cjs KINDS and CLASSES lists (`:19-20`), so unlike
   the check-in this lane does not have to borrow the "event" class and seam S1 narrows
   rather than repeats: the verb the stage spells is still "workout", because `workout`
   is the only PRODUCER-INJECTED command the accepted stage has, but the class this
   lane writes is the accepted class for exactly this fact.

   NOTHING HERE INTERPRETS AN INTAKE. There is no total, no average, no target and no
   derived figure: the payload is the athlete's own two numbers for one day. A number
   he did not give is ABSENT - never null, never 0. The engine's own readers filter on
   `v.cal != null` (energy.cjs:394, today.cjs:244), so an absent day is absent from
   every average rather than dragging it to zero, and N1 inherits that rule rather
   than re-inventing it.

   THE WHOLE OF THAT DAY'S ANSWER TRAVELS IN ONE OP (N1 brief section 3). The engine's
   writeDaily merges a PARTIAL row, which is right for the engine and wrong for a log:
   a correction is a NEW op and the projector replays only the LAST one for a date, so
   the winning op has to carry the whole day or a replay would resurrect a figure the
   athlete has already replaced. Disclosed because it is the one place N1 deliberately
   does not lean on an engine affordance. */

const PROFILE = "earned/food-day/v1";
const ACTION = "food-day";
const OP_CLASS = "food-day";
const OP_KIND = "fact";

/* THE BOUNDS ARE INVENTED (N1 brief section 6): the engine bounds neither figure.
   They are refused in the page's own words rather than clamped, because a silent
   clamp would record a number the athlete did not enter. */
const LIMITS = Object.freeze({ cal: { min: 0, max: 20000, unit: "kcal" },
  pro: { min: 0, max: 1000, unit: "g" } });
const MEMBERS = Object.freeze(["cal", "pro"]);

const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("FOOD_INPUT_INVALID"); };

/* One day's answer, validated member by member. Returns a fresh object holding ONLY
   the members actually given. A whole number is required: the engine stores what it
   is handed, and a fractional kcal is a false precision the athlete did not mean. */
function dayOf(input) {
  if (!isMap(input)) bad();
  for (const key of Object.keys(input)) if (!MEMBERS.includes(key)) bad();
  const out = {};
  for (const key of MEMBERS) {
    if (!Object.hasOwn(input, key)) continue;
    const value = input[key];
    const limit = LIMITS[key];
    if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) bad();
    if (value < limit.min || value > limit.max) bad();
    out[key] = value;
  }
  /* A day with nothing in it is not a fact about anything, and is refused BEFORE
     anything is written - the check-in's own rule (checkin-commands.cjs:108-110). */
  if (Object.keys(out).length === 0) bad();
  return out;
}

function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) if (key !== "day" && key !== "effective") bad();
  const action = { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: PROFILE, day: dayOf(input.day) },
    parents: [] };
  if (Object.hasOwn(input, "effective")) {
    const e = input.effective;
    if (!isMap(e) || Object.keys(e).length !== 3
      || !["local_date", "local_time", "utc_offset"].every((k) => typeof e[k] === "string")) bad();
    action.effective = { local_date: e.local_date, local_time: e.local_time, utc_offset: e.utc_offset };
  }
  return action;
}

/* The shape the client re-checks on the envelope it actually built, after its own
   Ops.build. It re-derives nothing: it asserts that what is about to be written is a
   food-day fact carrying a validated day, and names no parent the log does not hold. */
function validate(op, readOperation) {
  if (!op || op.kind !== OP_KIND || op.class !== OP_CLASS) return false;
  if (!op.effective || !/^\d{4}-\d{2}-\d{2}$/.test(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.day)) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { dayOf(JSON.parse(JSON.stringify(op.payload.day))); } catch { return false; }
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function createFoodCommands() {
  /* schemaVersion 2 is the accepted client's requirement for a producer-injected
     command, and this device's local era carries exactly one lease at that schema. */
  return Object.freeze({ schemaVersion: 2, prepare, validate });
}

module.exports = { createFoodCommands, prepare, validate, dayOf,
  PROFILE, ACTION, OP_CLASS, OP_KIND, LIMITS, MEMBERS };
