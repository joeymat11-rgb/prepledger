"use strict";

/* sleep-model.cjs - N2's pure half: what the screen may refuse, and THE PROJECTOR,
   which is the thing seam S2 exists for.

   WHY THIS PROJECTOR BUILDS THE ROW ITSELF. N1 could hand its day to an engine writer
   (writers.cjs writeDaily). There is NO engine function that appends a sleep night -
   DECISIONS:107 names that absence as seam S2 and checkin-model.mjs:89 states it in
   the product's own words - so this module constructs the row in the ARRAY shape
   rebuild/engine/sleep.cjs already reads: `state.sleep.nights` holding `{d, h, ...}`,
   with `n.d` the date of the night and `n.h` its hours (sleep.cjs:240, :576, :585).
   That is the WHOLE of what N2 adds to the engine's state, and it is disclosed rather
   than smuggled in.

   THE ONE NUMBER THIS FILE MAY NOT COMPUTE. For a night given as two clock times, `h`
   is `engine.sleepSpanH(bed, wake, awakeMin)` and nothing else: the midnight wrap, the
   awake subtraction and the two-decimal precision are the engine's, not the screen's.
   For a night given as a duration, `h` is the athlete's own number, unchanged.

   LATEST OP WINS, PER NIGHT DATE. Ops are append-only, so a correction is a NEW op for
   the same night. `winningNights` keeps the last row for each date in the log's own
   order (device sequence, then op id) and only that row is projected. A night whose
   winning op is the hours form carries NO bed/wake: switching to a duration REMOVES
   the obsolete clock fields rather than leaving a stale pair behind. */

const SleepCommands = require("./sleep-commands.cjs");

const { PROFILE, DAY_RE } = SleepCommands;

/* THE REFUSALS ARE CODES HERE AND SENTENCES IN THE VIEW. The words live in
   today-app.cjs, which is one of design.cjs's VIEW_SOURCES; this module owns the RULE
   and names each refusal, never the wording. */
const REFUSALS = Object.freeze({
  NOTHING: "NOTHING", BOTH_TIMES: "BOTH_TIMES", TIME_FORM: "TIME_FORM",
  SAME_TIME: "SAME_TIME", AWAKE: "AWAKE", HOURS: "HOURS", NIGHT_DATE: "NIGHT_DATE",
});

const trimmed = (v) => (v === undefined || v === null ? "" : String(v).trim());

/* The date of the NIGHT for a morning on `day`: the day before it, which is exactly
   what checkin-model.mjs dayBefore computes for the check-in that reads it back. */
function nightDateFor(day) {
  if (typeof day !== "string" || !DAY_RE.test(day)) return null;
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
}

/* The refusal for an entry in the TIMES mode, decided BEFORE anything is written and
   before sleepSpanH is invoked. Null means the entry is recordable. */
function timesRefusal(entry, today) {
  const bed = trimmed(entry && entry.bed);
  const wake = trimmed(entry && entry.wake);
  const awake = trimmed(entry && entry.awake_min);
  if (bed === "" && wake === "") return REFUSALS.NOTHING;
  if (bed === "" || wake === "") return REFUSALS.BOTH_TIMES;
  if (!SleepCommands.HM_RE.test(bed) || !SleepCommands.HM_RE.test(wake)) return REFUSALS.TIME_FORM;
  if (bed === wake) return REFUSALS.SAME_TIME;
  if (awake !== "") {
    const minutes = Number(awake);
    if (!/^\d+$/.test(awake) || !Number.isFinite(minutes)
      || minutes > SleepCommands.spanMinutes(bed, wake)) return REFUSALS.AWAKE;
  }
  return dateRefusal(entry, today);
}

/* The refusal for an entry in the HOURS mode. An explicit 0 is an ANSWER; a blank is
   unknown and is refused rather than becoming a zero. */
function hoursRefusal(entry, today) {
  const raw = trimmed(entry && entry.hours);
  if (raw === "") return REFUSALS.NOTHING;
  const hours = Number(raw);
  const ok = /^\d+(\.\d{1,2})?$/.test(raw) && Number.isFinite(hours)
    && hours >= SleepCommands.HOURS_MIN && hours <= SleepCommands.HOURS_MAX;
  if (!ok) return REFUSALS.HOURS;
  return dateRefusal(entry, today);
}

/* A night must be a real, COMPLETED date: a future night has not happened yet. */
function dateRefusal(entry, today) {
  const date = trimmed(entry && entry.date);
  if (!SleepCommands.isRealDate(date)) return REFUSALS.NIGHT_DATE;
  if (typeof today === "string" && DAY_RE.test(today) && date >= today) return REFUSALS.NIGHT_DATE;
  return null;
}

function refusalFor(entry, today) {
  const mode = entry && entry.mode === "hours" ? "hours" : "times";
  return mode === "hours" ? hoursRefusal(entry, today) : timesRefusal(entry, today);
}

/* The screen's boxes turned into the producer's `night`, with an unanswered box ABSENT
   rather than null or zero. Returns null when the entry is refused. */
function nightFromEntry(entry, today) {
  if (refusalFor(entry, today)) return null;
  const out = { date: trimmed(entry.date) };
  if (entry.mode === "hours") {
    out.hours = Number(trimmed(entry.hours));
    const source = trimmed(entry.from_checkin_op_id);
    if (source) out.from_checkin_op_id = source;
    return out;
  }
  out.bed = trimmed(entry.bed);
  out.wake = trimmed(entry.wake);
  const awake = trimmed(entry.awake_min);
  if (awake !== "") out.awake_min = Number(awake);
  return out;
}

/* LATEST WINS, per night date. `rows` arrive in the log's own order (the host sorts by
   device sequence, then op id), so the last row for a date is the winning one. */
function winningNights(rows) {
  const byDate = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || !row.night || typeof row.night !== "object") continue;
    if (typeof row.night.date !== "string" || !DAY_RE.test(row.night.date)) continue;
    byDate.set(row.night.date, row);
  }
  return [...byDate.values()].sort((a, b) => (a.night.date < b.night.date ? -1
    : a.night.date > b.night.date ? 1 : 0));
}

/* ONE stored night -> the engine's own row. `h` comes from the ENGINE for the times
   form and from the athlete for the hours form; nothing else is derived. */
function rowFor(night, engine) {
  if (Object.hasOwn(night, "hours")) return { d: night.date, h: night.hours };
  const awake = Object.hasOwn(night, "awake_min") ? night.awake_min : 0;
  const row = { d: night.date, h: engine.sleepSpanH(night.bed, night.wake, awake),
    bed: night.bed, wake: night.wake };
  if (Object.hasOwn(night, "awake_min")) row.awakeMin = night.awake_min;
  return row;
}

/* op log -> engine state. The basis is CLONED at the members this touches and every
   other date and every unrelated member survives; a date this log holds replaces the
   basis row for that date WHOLE, so an obsolete bed/wake pair cannot survive a switch
   to the hours form. Sorted ascending by `d`, because sleep.cjs:240 takes the LAST
   five nights and :585 pairs a night with the next day's session. */
function projectSleepNights(state, rows, engine) {
  const winning = winningNights(rows);
  if (winning.length === 0) return state;
  const previous = (state && state.sleep && Array.isArray(state.sleep.nights))
    ? state.sleep.nights : [];
  const byDate = new Map();
  for (const row of previous) if (row && typeof row.d === "string") byDate.set(row.d, row);
  for (const row of winning) byDate.set(row.night.date, rowFor(row.night, engine));
  const nights = [...byDate.values()]
    .sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
  return { ...state, sleep: { ...(state && state.sleep), nights } };
}

/* What the ENGINE holds for one night, read back out of the projected state rather
   than out of the screen's memory. */
function loggedNight(state, date) {
  const nights = (state && state.sleep && Array.isArray(state.sleep.nights))
    ? state.sleep.nights : [];
  const row = nights.find((n) => n && n.d === date);
  return row ? { ...row } : null;
}

/* The winning OPERATION for a night, as the log holds it: provenance, and the
   athlete's own answer in the shape he gave it. */
function recordedNight(rows, date) {
  for (const row of winningNights(rows)) if (row.night.date === date) return row;
  return null;
}

module.exports = { REFUSALS, refusalFor, timesRefusal, hoursRefusal, nightFromEntry,
  nightDateFor, winningNights, rowFor, projectSleepNights, loggedNight, recordedNight,
  PROFILE, DAY_RE };
