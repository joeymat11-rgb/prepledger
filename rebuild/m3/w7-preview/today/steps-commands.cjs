"use strict";

/* steps-commands.cjs - N2 "Log today" (the PM's N2 brief, Part A): the steps lane's CLOSED
   command. One day's step count becomes ONE operation of rebuild/client's own envelope: kind "fact", class "steps",
   both already members of the accepted rebuild/client/ops.cjs KINDS and CLASSES lists (`:19-20`), so, like N1's food
   day, this lane writes the accepted class for exactly this fact. It is food-commands.cjs's shape, member for member,
   with one member: the verb the stage spells is still "workout", the only PRODUCER-INJECTED command the accepted
   stage has.

   NOTHING HERE INTERPRETS A STEP COUNT. There is no total, no average, no target and no derived figure: the payload
   is the athlete's own count for one day. The engine's own readers (energy.cjs stepTarget, observedTDEE) read
   `dailyLogs[date].steps`, and the page's projector (steps-model.cjs) puts it there through the engine's own writer
   (writers.cjs writeDaily, whose `steps` member is "his walking step COUNT"). A correction is a NEW op for the same
   date, and the projector replays only the latest one. */

const PROFILE = "earned/steps-day/v1";
const ACTION = "steps-day";
const OP_CLASS = "steps";
const OP_KIND = "fact";

/* THE BOUND IS INVENTED, as N1's are (the engine bounds no step count): a figure outside it is refused in the page's
   own words rather than clamped, because a silent clamp would record a number the athlete did not enter. */
const LIMITS = Object.freeze({ steps: { min: 0, max: 100000, unit: "steps" } });
const MEMBERS = Object.freeze(["steps"]);

const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("STEPS_INPUT_INVALID"); };

/* One day's answer, validated member by member: a whole number of steps inside the bound, and nothing else. */
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
  /* A day with nothing in it is not a fact about anything, and is refused BEFORE anything is written. */
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

/* The shape the client re-checks on the envelope it actually built, and the shape import admission accepts
   (source-admission.mjs, family F11): a steps fact carrying a validated day, naming no parent the log does not hold. */
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

function createStepsCommands() {
  /* schemaVersion 2 is the accepted client's requirement for a producer-injected command, as N1's. */
  return Object.freeze({ schemaVersion: 2, prepare, validate });
}

module.exports = { createStepsCommands, prepare, validate, dayOf,
  PROFILE, ACTION, OP_CLASS, OP_KIND, LIMITS, MEMBERS };
