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

/* ---------------------------------------------------------------------------
   ROUND 3, CLOSING REVIEW-R2 FINDING 2 - THE TRIAL'S DAY ONE, WRITTEN ONCE.
   Round 2 passed `startDate: model.today`, which re-based the whole window
   every morning: week 2 through week 12 could never exist. The ticket says day
   one is the local date of the FIRST ENROLLED RECORD, persisted once and never
   re-based. It is therefore a FACT on this device, not a clock reading: one op,
   one profile, refused a second time by measure-host.mjs's own read-before-
   write, exactly as the markers pick is.
   --------------------------------------------------------------------------- */
const TRIAL_PROFILE = "earned/measure-trial-start/v1";
const TRIAL_ACTION = "measure-trial-start";

function trialStartOf(input) {
  if (typeof input !== "string" || !isRealDate(input)) bad();
  return input;
}

function prepareTrialStart(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== TRIAL_ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) if (key !== "start") bad();
  return { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: TRIAL_PROFILE, start: trialStartOf(input.start) },
    parents: [] };
}

function validateTrialStart(op, readOperation) {
  if (!op || op.kind !== OP_KIND || op.class !== OP_CLASS) return false;
  if (!op.effective || typeof op.effective.local_date !== "string"
    || !isRealDate(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== TRIAL_PROFILE) return false;
  if (Object.keys(op.payload).length !== 2) return false;
  try { trialStartOf(op.payload.start); } catch { return false; }
  /* A trial cannot begin after the day it is recorded on. */
  if (op.payload.start > op.effective.local_date) return false;
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

/* ---------------------------------------------------------------------------
   E2a (PM, the E2 scope; no engine change). TWO MORE FACTS OF THE SAME CLASS,
   each with its own profile. An answer can be changed: each save is a new op
   and the latest wins (measure-host.mjs; the PM's ruling on E2a, as steps). The
   engine reads neither yet (E2b); they are stored and said back on Measure.

   THE BODY-FAT BAND, earned/body-fat-band/v1. The athlete's own estimate, one
   band of a fixed table per sex, or "I don't know", which is a first-class
   answer: it is stored like any other, so the question does not nag.
   payload { profile, low, high, source, table }: low and high are whole percents
   of one band in BANDS (high null for the open top band); source says where the
   value came from, "self-estimate" for a band the athlete picked and "unknown"
   for "I don't know", whose low and high are both null; table names the table
   the band was picked from, "men" or "women" (null for "I don't know"), so E2b
   never has to infer a sex from a band (Fable on E2a, D1).
   --------------------------------------------------------------------------- */
const badBody = () => { throw new TypeError("BODY_INPUT_INVALID"); };
const BAND_PROFILE = "earned/body-fat-band/v1";
const BAND_ACTION = "body-fat-band";
const BAND_SOURCES = Object.freeze({ estimate: "self-estimate", unknown: "unknown" });
const BANDS = Object.freeze({
  male: Object.freeze([[8, 11], [12, 15], [16, 20], [21, 25], [26, null]].map((b) => Object.freeze(b))),
  female: Object.freeze([[15, 19], [20, 24], [25, 29], [30, 34], [35, null]].map((b) => Object.freeze(b))),
});
/* The table a band was picked from, as the payload names it. */
const BAND_TABLES = Object.freeze({ male: "men", female: "women" });
const setOfTable = (table) => Object.keys(BAND_TABLES).find((set) => BAND_TABLES[set] === table) || null;
const isBand = (low, high, table) => {
  const set = setOfTable(table);
  return set !== null && BANDS[set].some(([lo, hi]) => lo === low && hi === high);
};

/* NOTE (Fable on E2a, D3): isBand accepts a band of EITHER table, whatever sex the
   body profile records. The producer never compares the two: the screen offers
   both tables when no sex is recorded or it is "prefer not to say", and a
   recorded sex can be changed after the band was saved. The band only has to be
   one row of the table it names; which table it came from is the payload's own
   `table`, never inferred from the band or from the profile. */
function bandOf(input) {
  if (!isMap(input)) badBody();
  for (const key of Object.keys(input)) if (key !== "low" && key !== "high" && key !== "source" && key !== "table") badBody();
  if (!Object.hasOwn(input, "table")) badBody();
  if (input.source === BAND_SOURCES.unknown) {
    if (input.low !== null || input.high !== null || input.table !== null) badBody();
    return { low: null, high: null, source: BAND_SOURCES.unknown, table: null };
  }
  if (input.source !== BAND_SOURCES.estimate) badBody();
  if (typeof input.low !== "number" || !(input.high === null || typeof input.high === "number")) badBody();
  if (!isBand(input.low, input.high, input.table)) badBody();
  return { low: input.low, high: input.high, source: BAND_SOURCES.estimate, table: input.table };
}

function prepareBand(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== BAND_ACTION || !isMap(request.input)) badBody();
  for (const key of Object.keys(request.input)) if (key !== "band") badBody();
  return { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: BAND_PROFILE, ...bandOf(request.input.band) }, parents: [] };
}

/* The one envelope check both new facts share: the class, the kind, a real
   recording day and parents of this athlete. */
function envelopeOk(op, readOperation) {
  if (!op || op.kind !== OP_KIND || op.class !== OP_CLASS) return false;
  if (!op.effective || typeof op.effective.local_date !== "string"
    || !isRealDate(op.effective.local_date)) return false;
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function validateBand(op, readOperation) {
  if (!envelopeOk(op, readOperation)) return false;
  if (!isMap(op.payload) || op.payload.profile !== BAND_PROFILE) return false;
  if (Object.keys(op.payload).length !== 5) return false;
  try {
    const { low, high, source, table } = op.payload;
    bandOf(JSON.parse(JSON.stringify({ low, high, source, table })));
  } catch { return false; }
  return true;
}

/* THE BODY PROFILE, earned/body-profile/v1: sex and height, both optional and
   asked gently. payload { profile, sex, height }: sex is "male", "female",
   "prefer-not-to-say" or null (not answered); height is { value, unit } in
   inches or centimetres, one decimal at most, or null (not given). A record with
   both null is the athlete's "Not now": it is kept so the question does not nag,
   and it can be changed like any answer. */
const BODY_PROFILE = "earned/body-profile/v1";
const BODY_ACTION = "body-profile";
const SEXES = Object.freeze(["male", "female", "prefer-not-to-say"]);
const HEIGHT_LIMITS = Object.freeze({ in: Object.freeze({ min: 36, max: 96 }), cm: Object.freeze({ min: 91, max: 244 }) });

function heightOf(input) {
  if (input === null) return null;
  if (!isMap(input)) badBody();
  for (const key of Object.keys(input)) if (key !== "value" && key !== "unit") badBody();
  const limits = HEIGHT_LIMITS[input.unit];
  if (!limits || !Object.hasOwn(HEIGHT_LIMITS, input.unit)) badBody();
  if (typeof input.value !== "number" || !Number.isFinite(input.value)) badBody();
  if (!/^\d+(\.\d)?$/.test(String(input.value))) badBody();
  if (input.value < limits.min || input.value > limits.max) badBody();
  return { value: input.value, unit: input.unit };
}

function bodyOf(input) {
  if (!isMap(input)) badBody();
  for (const key of Object.keys(input)) if (key !== "sex" && key !== "height") badBody();
  if (!(input.sex === null || SEXES.includes(input.sex))) badBody();
  if (!Object.hasOwn(input, "sex") || !Object.hasOwn(input, "height")) badBody();
  return { sex: input.sex, height: heightOf(input.height) };
}

function prepareBody(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== BODY_ACTION || !isMap(request.input)) badBody();
  for (const key of Object.keys(request.input)) if (key !== "body") badBody();
  return { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: BODY_PROFILE, ...bodyOf(request.input.body) }, parents: [] };
}

function validateBody(op, readOperation) {
  if (!envelopeOk(op, readOperation)) return false;
  if (!isMap(op.payload) || op.payload.profile !== BODY_PROFILE) return false;
  if (Object.keys(op.payload).length !== 3) return false;
  try {
    const { sex, height } = op.payload;
    bodyOf(JSON.parse(JSON.stringify({ sex, height })));
  } catch { return false; }
  return true;
}

function createMeasureCommands() {
  /* schemaVersion 2, the accepted client's requirement for a producer-injected
     command - the same schema the check-in, the first run and the sleep night
     ride (this device's local era carries exactly one lease at that schema).
     ONE producer, TWO actions: the waist entry and the once-only markers pick,
     the same way sleep-commands.cjs's single producer handles a night's two
     accepted shapes. (Round 3 added the trial start; E2a adds the body-fat band
     and the body profile, each by its own action and profile.) */
  return Object.freeze({ schemaVersion: 2,
    prepare(request) {
      if (isMap(request) && request.action === MARKERS_ACTION) return prepareMarkers(request);
      if (isMap(request) && request.action === TRIAL_ACTION) return prepareTrialStart(request);
      if (isMap(request) && request.action === BAND_ACTION) return prepareBand(request);
      if (isMap(request) && request.action === BODY_ACTION) return prepareBody(request);
      return prepare(request);
    },
    validate(op, readOperation) {
      if (op && isMap(op.payload) && op.payload.profile === MARKERS_PROFILE) return validateMarkers(op, readOperation);
      if (op && isMap(op.payload) && op.payload.profile === TRIAL_PROFILE) return validateTrialStart(op, readOperation);
      if (op && isMap(op.payload) && op.payload.profile === BAND_PROFILE) return validateBand(op, readOperation);
      if (op && isMap(op.payload) && op.payload.profile === BODY_PROFILE) return validateBody(op, readOperation);
      return validate(op, readOperation);
    } });
}

module.exports = { createMeasureCommands, prepare, validate, entryOf, isRealDate,
  markersOf, prepareMarkers, validateMarkers,
  PROFILE, ACTION, OP_CLASS, OP_KIND, WAIST_MIN, WAIST_MAX, DAY_RE,
  MARKERS_PROFILE, MARKERS_ACTION, MARKERS_MIN, MARKERS_MAX,
  prepareTrialStart, validateTrialStart, trialStartOf, TRIAL_PROFILE, TRIAL_ACTION,
  bandOf, prepareBand, validateBand, BAND_PROFILE, BAND_ACTION, BAND_SOURCES, BANDS, BAND_TABLES,
  bodyOf, heightOf, prepareBody, validateBody, BODY_PROFILE, BODY_ACTION, SEXES, HEIGHT_LIMITS };
