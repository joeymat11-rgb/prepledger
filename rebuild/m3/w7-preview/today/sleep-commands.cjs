"use strict";

/* sleep-commands.cjs - N2's CLOSED command: one completed night becomes ONE operation
   of rebuild/client's own envelope. Kind "fact", class "sleep" - both already members
   of the accepted rebuild/client/ops.cjs KINDS and CLASSES lists (`:19-20`), so this
   lane writes the accepted class for exactly this fact and edits no client byte.

   NOTHING HERE INTERPRETS A NIGHT. There is no score, no debt, no target and no
   derived figure in the payload: it is the athlete's own answer for one night, in one
   of exactly two shapes. The HOURS a pair of clock times comes to is not computed
   here at all - the projector asks the engine's own writers.cjs sleepSpanH for it
   (N2 brief, "the preview/result h comes ONLY from E.sleepSpanH").

   SEAM S2 IS WHY THE PROJECTOR BUILDS THE ROW. Unlike N1, where writers.cjs already
   had writeDaily, the engine has NO function that appends a sleep night; DECISIONS:107
   names that absence and checkin-model.mjs:89 states it in the product's own words. So
   sleep-model.cjs constructs the `{d, h, bed?, wake?, awakeMin?}` row itself, in the
   ARRAY shape rebuild/engine/sleep.cjs already reads. */

const PROFILE = "earned/sleep-night/v1";
const ACTION = "sleep-night";
const OP_CLASS = "sleep";
const OP_KIND = "fact";

/* THE BOUNDS ARE INVENTED (N2 brief, "Exact copy and states"): nothing upstream bounds
   an entered duration. 0 to 24 INCLUSIVE follows A3's own 0..24 precedent, and an
   explicit 0 is a legitimate answer - a blank is unknown and is refused in words
   rather than becoming a zero. Two decimals is sleepSpanH's own precision. */
const HOURS_MIN = 0;
const HOURS_MAX = 24;
const HM_RE = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_MEMBERS = Object.freeze(["bed", "wake", "awake_min"]);
const MEMBERS = Object.freeze(["date", "hours", "bed", "wake", "awake_min", "from_checkin_op_id"]);

const isMap = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const bad = () => { throw new TypeError("SLEEP_INPUT_INVALID"); };

/* A calendar-valid date, refused rather than normalised: "2026-02-30" is not a night. */
function isRealDate(iso) {
  if (!DAY_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const when = new Date(Date.UTC(y, m - 1, d));
  return when.getUTCFullYear() === y && when.getUTCMonth() === m - 1 && when.getUTCDate() === d;
}

const minutesOf = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
/* The span in WHOLE MINUTES, so an awake answer is compared against the same integer
   the athlete typed rather than against a rounded decimal hour (N2 brief). */
function spanMinutes(bed, wake) {
  let span = minutesOf(wake) - minutesOf(bed);
  if (span <= 0) span += 1440;
  return span;
}

const twoDecimals = (value) => Math.round(value * 100) === Number((value * 100).toFixed(6));

/* One night's answer, validated member by member. Returns a fresh object holding ONLY
   the members actually given, in exactly one of the two accepted shapes. */
function nightOf(input) {
  if (!isMap(input)) bad();
  for (const key of Object.keys(input)) if (!MEMBERS.includes(key)) bad();
  if (typeof input.date !== "string" || !isRealDate(input.date)) bad();
  const out = { date: input.date };

  const hasHours = Object.hasOwn(input, "hours");
  const hasBed = Object.hasOwn(input, "bed");
  const hasWake = Object.hasOwn(input, "wake");
  const hasAwake = Object.hasOwn(input, "awake_min");
  const hasSource = Object.hasOwn(input, "from_checkin_op_id");

  /* EXACTLY ONE SHAPE. Both at once, a lone time, or awake minutes with no times are
     each refused before anything is written. */
  if (hasHours && (hasBed || hasWake || hasAwake)) bad();
  if (!hasHours && !(hasBed && hasWake)) bad();
  if ((hasBed && !hasWake) || (hasWake && !hasBed)) bad();

  if (hasHours) {
    const hours = input.hours;
    if (typeof hours !== "number" || !Number.isFinite(hours)) bad();
    if (hours < HOURS_MIN || hours > HOURS_MAX) bad();
    if (!twoDecimals(hours)) bad();
    out.hours = hours;
    /* The check-in reference travels only with a duration COPIED from a check-in. */
    if (hasSource) {
      if (typeof input.from_checkin_op_id !== "string" || !input.from_checkin_op_id.trim()) bad();
      out.from_checkin_op_id = input.from_checkin_op_id;
    }
    return out;
  }

  if (hasSource) bad();
  if (typeof input.bed !== "string" || !HM_RE.test(input.bed)) bad();
  if (typeof input.wake !== "string" || !HM_RE.test(input.wake)) bad();
  /* EQUAL TIMES ARE REFUSED, never accepted as a full day: sleepSpanH wraps a zero
     span to 1440 minutes, so "23:00 to 23:00" would silently become 24 hours. The
     screen offers the hours mode for a clock-change night instead. */
  if (input.bed === input.wake) bad();
  out.bed = input.bed;
  out.wake = input.wake;
  if (hasAwake) {
    const awake = input.awake_min;
    if (typeof awake !== "number" || !Number.isFinite(awake) || !Number.isInteger(awake)) bad();
    if (awake < 0 || awake > spanMinutes(input.bed, input.wake)) bad();
    out.awake_min = awake;
  }
  return out;
}

function prepare(request) {
  if (!isMap(request) || Object.keys(request).length !== 2
    || request.action !== ACTION || !isMap(request.input)) bad();
  const input = request.input;
  for (const key of Object.keys(input)) {
    if (key !== "night" && key !== "effective" && key !== "supersedes") bad();
  }
  const action = { class: OP_CLASS, kind: OP_KIND,
    payload: { profile: PROFILE, night: nightOf(input.night) },
    parents: [] };
  /* D2 ROUND 2, FINDING 1 - THE EXPECTED REVISION TRAVELS WITH THE WRITE. A correction
     states which operation it believes it is replacing (or `null` for "this night has
     none"), and that statement is carried INTO the payload so the check can be made at
     the store, inside the commit, rather than in a read the caller did earlier. A write
     that carries no expectation at all is an ordinary append and is checked no further,
     exactly as every night written before this change was. */
  if (Object.hasOwn(input, "supersedes")) {
    const expected = input.supersedes;
    if (expected !== null && (typeof expected !== "string" || expected === "")) bad();
    action.payload.supersedes = expected;
  }
  if (Object.hasOwn(input, "effective")) {
    const e = input.effective;
    if (!isMap(e) || Object.keys(e).length !== 3
      || !["local_date", "local_time", "utc_offset"].every((k) => typeof e[k] === "string")) bad();
    action.effective = { local_date: e.local_date, local_time: e.local_time, utc_offset: e.utc_offset };
  }
  return action;
}

/* D2 ROUND 1, FINDING 1, AT THE STORE. The host refuses a forged check-in reference
   before it writes; this is the same question asked again on the envelope the client
   actually built, with the store's own reader, so a reference can never reach the log
   unauthenticated however the write was issued. Same rule, one place lower. */
const CHECKIN_PROFILE = "earned/recovery-checkin/v1";
function nextDay(iso) {
  const t = Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) + 86400000;
  return new Date(t).toISOString().slice(0, 10);
}
function citedCheckInIsReal(op, readOperation) {
  const night = op.payload.night;
  const id = night.from_checkin_op_id;
  if (typeof id !== "string" || id === "") return true;          // no claim to authenticate
  if (typeof readOperation !== "function") return false;
  const source = readOperation(id);
  if (!source || source.athlete_id !== op.athlete_id) return false;
  if (source.kind !== "fact" || source.class !== "event") return false;
  if (!isMap(source.payload) || source.payload.profile !== CHECKIN_PROFILE) return false;
  const answers = source.payload.answers;
  if (!isMap(answers)) return false;
  if (!source.effective || source.effective.local_date !== nextDay(night.date)) return false;
  if (!isMap(answers.sleep_hours) || answers.sleep_hours.value !== night.hours) return false;
  return answers.sleep_hours_source === "entered";
}

/* D2 ROUND 2, FINDING 1 - THE CHECK IS INSIDE THE COMMIT, NOT BEFORE IT.
   A read the caller did before calling the client proves nothing: two saves can both
   read the same winner and both be acknowledged, and the second replaces a night its
   editor never saw. The accepted client calls this validator on the envelope it has
   just built, SYNCHRONOUSLY, immediately before the one local transaction that writes
   the operation (rebuild/client/index.cjs:228-233), with a reader over the accepted
   operations as they stand AT THAT MOMENT. Nothing can interleave between this answer
   and that transaction, so a refusal here is a refusal at the commit.

   The reader is by op id, not an enumeration - but on this device an op id is
   `op-<device>-<sequence>` and the envelope carries its own device and sequence, so
   every earlier operation THIS DEVICE wrote can be read back one by one. That is the
   whole log for a one-device era, which is what this lane is. The rule: if the write
   states an expectation, the night's current winning operation must be exactly the one
   it names (or none, for `null`). The second of two concurrent corrections therefore
   sees the first already accepted and is refused with nothing written. */
const LIMIT = 100000;
function currentNightOp(op, readOperation, date) {
  if (typeof readOperation !== "function") return undefined;
  const device = op.device_id;
  const upto = Number(op.device_seq);
  if (typeof device !== "string" || !Number.isSafeInteger(upto) || upto < 1 || upto > LIMIT) return undefined;
  let winner = null;
  const dead = new Set();
  const nights = [];
  for (let seq = 1; seq < upto; seq += 1) {
    const earlier = readOperation("op-" + device + "-" + seq);
    if (!earlier) continue;                                  // rejected, or never written
    if (earlier.kind === "tombstone" && typeof earlier.target_op_id === "string") {
      dead.add(earlier.target_op_id); continue;
    }
    if (earlier.kind !== OP_KIND || earlier.class !== OP_CLASS) continue;
    if (!isMap(earlier.payload) || earlier.payload.profile !== PROFILE) continue;
    if (!isMap(earlier.payload.night) || earlier.payload.night.date !== date) continue;
    nights.push(earlier.op_id);
  }
  for (const id of nights) if (!dead.has(id)) winner = id;
  return winner;
}
function revisionIsCurrent(op, readOperation) {
  if (!Object.hasOwn(op.payload, "supersedes")) return true;   // no expectation stated
  const held = currentNightOp(op, readOperation, op.payload.night.date);
  if (held === undefined) return false;                        // the log cannot be read: refuse
  return held === op.payload.supersedes;
}

/* The shape the client re-checks on the envelope it actually built, after its own
   Ops.build. It re-derives nothing. */
function validate(op, readOperation) {
  if (!op || op.kind !== OP_KIND || op.class !== OP_CLASS) return false;
  if (!op.effective || !DAY_RE.test(op.effective.local_date)) return false;
  if (!isMap(op.payload) || op.payload.profile !== PROFILE || !isMap(op.payload.night)) return false;
  const members = Object.keys(op.payload).length;
  if (members !== 2 && !(members === 3 && Object.hasOwn(op.payload, "supersedes"))) return false;
  if (Object.hasOwn(op.payload, "supersedes")) {
    const expected = op.payload.supersedes;
    if (expected !== null && (typeof expected !== "string" || expected === "")) return false;
  }
  try { nightOf(JSON.parse(JSON.stringify(op.payload.night))); } catch { return false; }
  if (!citedCheckInIsReal(op, readOperation)) return false;
  if (!revisionIsCurrent(op, readOperation)) return false;
  if (!Array.isArray(op.causal_parents)) return false;
  for (const id of op.causal_parents) {
    const parent = readOperation(id);
    if (!parent || parent.athlete_id !== op.athlete_id) return false;
  }
  return true;
}

function createSleepCommands() {
  /* schemaVersion 2 is the accepted client's requirement for a producer-injected
     command, and this device's local era carries exactly one lease at that schema. */
  return Object.freeze({ schemaVersion: 2, prepare, validate });
}

module.exports = { createSleepCommands, prepare, validate, nightOf, isRealDate, spanMinutes,
  citedCheckInIsReal, CHECKIN_PROFILE, currentNightOp, revisionIsCurrent,
  PROFILE, ACTION, OP_CLASS, OP_KIND, HOURS_MIN, HOURS_MAX, HM_RE, DAY_RE, MEMBERS, TIME_MEMBERS };
