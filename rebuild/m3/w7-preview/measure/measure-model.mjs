// measure-model.mjs - P-MEASURE v1 (rebuild/lanes/pm/MEASUREMENT-PLAN-v1.md section 4).
//
// Pure computation only: no DOM, no store, no client, no network, nothing from
// rebuild/engine imported here. Every reader below is handed the rows it needs
// (weight reads, waist entries, sets, session counts, logged days, sleep nights) by
// its caller, the same dependency-injection shape today-model.cjs, sleep-model.cjs
// and gym-model.mjs already use. This keeps the arithmetic testable against a fixed
// synthetic fixture with no store, no clock and no engine wired in, and keeps this
// module byte-honest with plan section 4 (5): nothing here reads or writes any path
// outside whatever the caller hands it, and the caller's own store is the device's.
//
// THE ONE NEW ENTRY. Waist has no existing entry path (plan section 2), so this
// module also carries the small waist entry: a weekly value, one operation per
// recorded date, latest-by-date wins on a re-record for the same date - the same
// shape sleep-model.cjs already uses for a night, adapted to a weekly measure.
//
// THE ONE FORMULA. Estimated one-rep max uses the Epley formula, named so a reviewer
// never has to guess which one ran: 1RM = load x (1 + reps / 30).

"use strict";

export const ONE_RM_FORMULA_NAME = "epley";
export const ONE_RM_FORMULA_TEXT = "1RM = load x (1 + reps / 30)";

/* ---------------------------------------------------------------------------
   THE WAIST ENTRY. Weekly, same shape as a sleep night: a refusal decided before
   anything is written, and a pure projector that keeps the winning row per date.
   --------------------------------------------------------------------------- */
export const WAIST_MIN = 20, WAIST_MAX = 65;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const trimmed = (v) => (v === undefined || v === null ? "" : String(v).trim());

export const WAIST_REFUSALS = Object.freeze({
  NOTHING: "NOTHING", OUT_OF_RANGE: "OUT_OF_RANGE", WEEK_DATE: "WEEK_DATE",
});

/* A real, completed date and a value in a recordable range. Nothing here rounds an
   out-of-range entry into range; it is refused in words, like every other entry on
   this page. */
export function waistRefusalFor(entry, today) {
  const raw = trimmed(entry && entry.in);
  const date = trimmed(entry && entry.date);
  /* ROUND 2, FINDING 11 - a blank value is NOTHING whether or not the date box
     was touched: the athlete has entered no waist figure, and that is never an
     out-of-range one. Only a non-blank value is ever bounds-checked. */
  if (raw === "") return WAIST_REFUSALS.NOTHING;
  if (!DAY_RE.test(date) || (typeof today === "string" && DAY_RE.test(today) && date > today)) {
    return WAIST_REFUSALS.WEEK_DATE;
  }
  const value = Number(raw);
  const ok = /^\d+(\.\d{1,2})?$/.test(raw) && Number.isFinite(value) && value >= WAIST_MIN && value <= WAIST_MAX;
  if (!ok) return WAIST_REFUSALS.OUT_OF_RANGE;
  return null;
}

/* The screen's box turned into the stored operation. Returns null when the entry is
   refused, exactly as sleep-model.cjs nightFromEntry does. */
export function waistFromEntry(entry, today) {
  if (waistRefusalFor(entry, today)) return null;
  return { date: trimmed(entry.date), in: Number(trimmed(entry.in)) };
}

/* op log -> weekly waist rows, latest recorded operation per date wins. Rows are the
   durable operations as the waist lane would read them back: { date, in, op_id?,
   device_seq? }. With no ordering fact on a row the LAST one in the array wins,
   which is the log's own append order (the same convention sleep-model.cjs's
   winningNights takes for a single device). */
export function projectWaist(rows) {
  const byDate = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.date !== "string" || !DAY_RE.test(row.date)) continue;
    if (typeof row.in !== "number" || !Number.isFinite(row.in)) continue;
    byDate.set(row.date, row);
  }
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

export function loggedWaist(rows, date) {
  const hit = projectWaist(rows).find((r) => r.date === date);
  return hit ? { date: hit.date, in: hit.in } : null;
}

/* ---------------------------------------------------------------------------
   WEEK ARITHMETIC. Weeks are seven-day blocks starting on the trial's own day one
   (plan section 3: "trial: from day one of Joe's two-day trial"). Week 1 is days
   0-6 from that date, week 2 is days 7-13, and so on. Nothing here reads a clock:
   the start date is handed in by the caller.
   --------------------------------------------------------------------------- */
function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/* The seven dates of week `index` (0-based) starting on `startDate`. */
export function weekDates(startDate, index) {
  const first = addDays(startDate, index * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(first, i));
}

/* ---------------------------------------------------------------------------
   THE DERIVED MEASURES (plan section 4 (2)).
   --------------------------------------------------------------------------- */

/* 7-day rolling weight average, read weekly: a REAL rolling mean over the reads
   actually present in the trailing seven days (the week's own seven dates),
   divided by how many there are.

   ROUND 3, CLOSING REVIEW-R2 FINDING 8. Round 1 required all seven days and
   returned null otherwise, which is not a rolling average and blanks the
   primary measure in almost every real week: Joe misses a morning. It is also
   what rebuild/engine/seed.cjs's own `t7` does with the same rows - the mean of
   whatever reads fall inside the window. Null now means exactly one thing: NO
   read exists in the window at all. */
export function weeklyWeightAverage(reads, startDate, index) {
  const byDate = new Map();
  for (const r of Array.isArray(reads) ? reads : []) {
    if (r && typeof r.date === "string" && typeof r.lb === "number" && Number.isFinite(r.lb)) byDate.set(r.date, r.lb);
  }
  const dates = weekDates(startDate, index);
  const values = dates.map((d) => byDate.get(d)).filter((v) => typeof v === "number");
  if (!values.length) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

/* The weekly waist value: the entry recorded inside that week's own seven dates.
   ROUND 2, FINDING 10 - when more than one date inside the week carries a
   (already deduplicated by projectWaist) row, the LATEST date wins, matching
   this module's own "latest wins" rule rather than array order. */
export function weeklyWaistValue(waistRows, startDate, index) {
  const dates = new Set(weekDates(startDate, index));
  const inWeek = projectWaist(waistRows).filter((r) => dates.has(r.date));
  if (!inWeek.length) return null;
  return inWeek.reduce((latest, r) => (r.date > latest.date ? r : latest)).in;
}

/* The four-week waist trend: this week's value minus the value four weeks earlier,
   in inches. Null until both ends of the window have a recorded value. */
export function waistTrend4Week(waistRows, startDate, index) {
  if (index < 4) return null;
  const now = weeklyWaistValue(waistRows, startDate, index);
  const then = weeklyWaistValue(waistRows, startDate, index - 4);
  if (typeof now !== "number" || typeof then !== "number") return null;
  return Math.round((now - then) * 100) / 100;
}

/* Estimated one-rep max, Epley: load x (1 + reps / 30). Both must be positive
   finite numbers; a set missing either is not estimated. */
export function estimate1RM(load, reps) {
  if (typeof load !== "number" || !Number.isFinite(load) || load <= 0) return null;
  if (typeof reps !== "number" || !Number.isFinite(reps) || reps <= 0) return null;
  return Math.round(load * (1 + reps / 30) * 100) / 100;
}

/* The best estimated 1RM among a marker's sets inside one week. `sets` is every
   recorded set for the whole window: { date, marker, load, reps }. Null when the
   marker has no qualifying set that week. */
export function weeklyMarker1RM(sets, marker, startDate, index) {
  const dates = new Set(weekDates(startDate, index));
  let best = null;
  for (const s of Array.isArray(sets) ? sets : []) {
    if (!s || s.marker !== marker || !dates.has(s.date)) continue;
    const rm = estimate1RM(s.load, s.reps);
    if (rm !== null && (best === null || rm > best)) best = rm;
  }
  return best;
}

/* Percent, rounded to one decimal place. A zero denominator is not divided by. */
export function pct(numerator, denominator) {
  if (typeof denominator !== "number" || denominator <= 0) return null;
  if (typeof numerator !== "number" || !Number.isFinite(numerator)) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

/* ROUND 2, FINDING 7 - an adherence percentage never exceeds 100: more sessions
   or more logged days than were possible is a counting fact upstream, not a
   number this screen shows past its own ceiling. */
const clampPct = (value) => (value === null ? null : Math.min(100, value));
export const trainingAdherencePct = (completed, planned) => clampPct(pct(completed, planned));
export const loggingAdherencePct = (loggedDays, daysInWeek) => clampPct(pct(loggedDays, daysInWeek));

/* ROUND 2, FINDING 6 - the denominator is the days of the week that have
   actually ELAPSED as of `today`, not a hardcoded 7. Joe's day one is an
   install day (DECISIONS:432 c, :452): a 3-day-old week has 3 elapsed days,
   and 3 of 3 logged reads 100%, never 42.9%. With no `today` given (the
   baseline's own complete weeks, always in the past) every one of the week's
   seven dates counts, unchanged from round 1. */
export function elapsedDaysInWeek(dates, today) {
  if (typeof today !== "string" || !DAY_RE.test(today)) return dates.length;
  return dates.filter((d) => d <= today).length;
}

/* Sleep nights meeting the app's own qualifying rule. `nights` is an array of
   { date, clean } for the week's seven dates, where `clean` is the caller's own
   read of the engine's cleanAtDate(state, date) for that night - this module never
   calls the engine itself and never invents the rule; it only counts what it is
   handed, exactly as every reader above reads what it is handed. */
/* ROUND 3, CLOSING REVIEW-R2 FINDING 5. A window with NO night in it is an
   ABSENCE, not a week of zero qualifying nights: round 2's baseline column
   printed "0/7" over an imported history whose nights it had never read, which
   is a claim the frozen app made zero. No nights now reads null, which the view
   renders as "Not enough data yet". */
export function sleepQualifyingCount(nights) {
  const rows = (Array.isArray(nights) ? nights : []).filter((n) => n && typeof n.date === "string");
  if (!rows.length) return null;
  return rows.filter((n) => n.clean === true).length;
}

/* ---------------------------------------------------------------------------
   ONE WEEK, ALL MEASURES. The row the comparison view (measure-view.mjs) renders.
   --------------------------------------------------------------------------- */
export function computeWeek({ startDate, index, reads, waistRows, sets, markers,
  sessionsCompleted, sessionsPlanned, foodDaysLogged, energyDaysLogged, nights, today } = {}) {
  const marker1RM = {};
  for (const marker of Array.isArray(markers) ? markers : []) {
    marker1RM[marker] = weeklyMarker1RM(sets, marker, startDate, index);
  }
  const dates = weekDates(startDate, index);
  /* ROUND 2, FINDING 6 - the elapsed days of THIS week, from `today`. */
  const elapsed = elapsedDaysInWeek(dates, today);
  return {
    week: index + 1,
    dates,
    weightAvg: weeklyWeightAverage(reads, startDate, index),
    waist: weeklyWaistValue(waistRows, startDate, index),
    waistTrend4Week: waistTrend4Week(waistRows, startDate, index),
    marker1RM,
    trainingAdherencePct: trainingAdherencePct(sessionsCompleted, sessionsPlanned),
    foodAdherencePct: loggingAdherencePct(foodDaysLogged, elapsed),
    energyAdherencePct: loggingAdherencePct(energyDaysLogged, elapsed),
    sleepQualifyingNights: sleepQualifyingCount(nights),
  };
}

export default {
  ONE_RM_FORMULA_NAME, ONE_RM_FORMULA_TEXT,
  WAIST_MIN, WAIST_MAX, WAIST_REFUSALS, waistRefusalFor, waistFromEntry, projectWaist, loggedWaist,
  weekDates, weeklyWeightAverage, weeklyWaistValue, waistTrend4Week, estimate1RM, weeklyMarker1RM,
  pct, trainingAdherencePct, loggingAdherencePct, elapsedDaysInWeek, sleepQualifyingCount, computeWeek,
};
