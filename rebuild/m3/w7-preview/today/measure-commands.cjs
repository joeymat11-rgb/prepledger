"use strict";

/* measure-commands.cjs - the waist entry's CLOSED command (round 2, closing
   reviewer finding 1: "nothing records"). One weekly waist value becomes ONE
   operation of rebuild/client's own envelope. Kind "fact", class
   "body-composition-source" - already a member of rebuild/client/ops.cjs
   CLASSES (:20) and unused by any other lane on this device, so this producer
   writes an accepted class for exactly this fact and edits no client byte.

   Same shape as sleep-commands.cjs and checkin-commands.cjs: prepare() builds
   the envelope's payload from the screen's entry, validate() re-checks the
   envelope the client actually built, synchronously, immediately before the
   one local transaction that writes it (rebuild/client/index.cjs:228-233).
   Nothing here interprets a waist value: no trend, no verdict, no target. */

const PROFILE = "earned/waist/v1";
const ACTION = "waist-entry";
const OP_CLASS = "body-composition-source";
const OP_KIND = "fact";

const WAIST_MIN = 20, WAIST_MAX = 65;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("WAIST_INPUT_INVALID"); };

function isRealDate(iso) {
  if (!DAY_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const when = new Date(Date.UTC(y, m - 1, d));
  return when.getUTCFullYear() === y && when.getUTCMonth() === m - 1 && when.getUTCDate() === d;
}

/* Two decimal places, the same precision measure-model.mjs's waistRefusalFor
   accepts (`/^\d+(\.\d{1,2})?$/`). */
function twoDecimalsOk(raw) { return /^\d+(\.\d{1,2})?$/.test(raw); }

/* One waist entry, validated member by member. Mirrors
   measure-model.mjs waistRefusalFor so the producer refuses independently of
   whatever the screen already checked - the store never trusts the caller. */
function entryOf(input) {
  if (!isMap(input)) bad();
  for (const key of Object.keys(input)) if (key !== "date" && key !== "in") bad();
  if (typeof input.date !== "string" || !isRealDate(input.date)) bad();
  if (typeof input.in !== "number" || !Number.isFinite(input.in)) bad();
  const raw = String(input.in);
  if (!twoDecimalsOk(raw)) bad();
  if (input.in < WAIST_MIN || input.in > WAIST_MAX) bad();
  return { date: input.date, in: input.in };
}

function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) if (key !== "entry") bad();
  return { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: PROFILE, entry: entryOf(input.entry) },
    parents: [] };
}

/* The shape the client re-checks on the envelope it actually built, after its
   own Ops.build. A waist value must have been recorded on or before the
   client's actual save day - a future date is refused at the commit, not
   only in the screen's own words (measure-model.mjs WEEK_DATE). */
function validate(op, readOperation) {
  if (!op || op.kind !== OP_KIND || op.class !== OP_CLASS) return false;
  if (!op.effective || typeof op.effective.local_date !== "string"
    || !isRealDate(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.entry)) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { entryOf(JSON.parse(JSON.stringify(op.payload.entry))); } catch { return false; }
  if (op.payload.entry.date > op.effective.local_date) return false;
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

/* ---------------------------------------------------------------------------
   ROUND 2, CLOSING FINDING 8 - "the 3-4 markers are a plain function argument,
   not a fixed pick stored on device." The pick is made ONCE, the same shape
   setup-commands.mjs's first run is: a fact of this same accepted class, its
   own profile, refused a second time by measure-host.mjs's own read-before-
   write (SAME pattern as createSetupHost's "already recorded" guard). */
const MARKERS_PROFILE = "earned/measure-markers/v1";
const MARKERS_ACTION = "measure-markers-pick";
const MARKERS_MIN = 3, MARKERS_MAX = 4;

function markersOf(input) {
  if (!Array.isArray(input)) bad();
  if (input.length < MARKERS_MIN || input.length > MARKERS_MAX) bad();
  const seen = new Set();
  const out = [];
  for (const raw of input) {
    if (typeof raw !== "string") bad();
    const name = raw.trim();
    if (!name || name.length > 40) bad();
    if (seen.has(name)) bad();
    seen.add(name);
    out.push(name);
  }
  return out;
}

function prepareMarkers(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== MARKERS_ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) if (key !== "markers") bad();
  return { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: MARKERS_PROFILE, markers: markersOf(input.markers) },
    parents: [] };
}

function validateMarkers(op, readOperation) {
  if (!op || op.kind !== OP_KIND || op.class !== OP_CLASS) return false;
  if (!op.effective || typeof op.effective.local_date !== "string"
    || !isRealDate(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== MARKERS_PROFILE) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { markersOf(JSON.parse(JSON.stringify(op.payload.markers))); } catch { return false; }
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function createMeasureCommands() {
  /* schemaVersion 2, the accepted client's requirement for a producer-injected
     command - the same schema the check-in, the first run and the sleep night
     ride (this device's local era carries exactly one lease at that schema).
     ONE producer, TWO actions: the waist entry and the once-only markers pick,
     the same way sleep-commands.cjs's single producer handles a night's two
     accepted shapes. */
  return Object.freeze({ schemaVersion: 2,
    prepare(request) {
      if (isMap(request) && request.action === MARKERS_ACTION) return prepareMarkers(request);
      return prepare(request);
    },
    validate(op, readOperation) {
      if (op && isMap(op.payload) && op.payload.profile === MARKERS_PROFILE) return validateMarkers(op, readOperation);
      return validate(op, readOperation);
    } });
}

module.exports = { createMeasureCommands, prepare, validate, entryOf, isRealDate,
  markersOf, prepareMarkers, validateMarkers,
  PROFILE, ACTION, OP_CLASS, OP_KIND, WAIST_MIN, WAIST_MAX, DAY_RE,
  MARKERS_PROFILE, MARKERS_ACTION, MARKERS_MIN, MARKERS_MAX };
