// measure-sources.mjs - P-MEASURE v1, ROUND 3. THE ONE READER BOTH WINDOWS USE.
//
// Round 2 shipped correct arithmetic that nothing fed: the screen handed
// computeWeek `reads: []`, `sets: []` and `nights: []` (review R2 finding 1)
// and the baseline handed it the same emptiness (finding 5). This module is
// the missing half: it turns ONE replayed engine state - the imported history
// for the baseline window, this device's own replayed state for the trial
// window - into the weekly rows measure-view.mjs renders, for all seven
// section-2 measures plus the chosen markers.
//
// It is PURE. No DOM, no store, no client, no network, no filesystem. Every
// field below is read out of the state the caller hands it, with the same
// member names rebuild/engine/seed.cjs seeds and rebuild/engine's own writers
// maintain:
//   state.reads         [{ d, w }]              morning weight readings
//   state.waist         [{ d, in }]             weekly waist values
//   state.sleep.nights  [{ d, h }]              nights as logged
//   state.dailyLogs     { iso: { cal, pro } }   food and energy entries
//   state.sessionLog    { iso: { entries } }    sessions completed and sets
//   state.split         [{ from, map }]         the week the athlete enrolled
//   state.exercises     [{ id, n }]             marker names to lift ids
// A member the state does not carry reads ABSENT (null), never zero.
"use strict";

import { computeWeek, weekDates } from './measure-model.mjs';

export const TRAINING_DAY_KINDS = Object.freeze(['U', 'L']);
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (v) => typeof v === 'string' && DAY_RE.test(v);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
const weekdayOf = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return String(new Date(Date.UTC(y, m - 1, d)).getUTCDay());
};

/* WEIGHT. The engine's own read rows, as measure-model.mjs wants them. */
export function readsIn(state) {
  return (Array.isArray(state && state.reads) ? state.reads : [])
    .filter((r) => r && isDay(r.d) && num(r.w) !== null)
    .map((r) => ({ date: r.d, lb: r.w }));
}

/* WAIST. The imported window carries its own `waist` array; the trial window's
   waist rows come off this device's waist operations instead (measure-host.mjs
   waistRowsIn), which the caller passes as `waistRows`. Both are the same
   { date, in } shape measure-model.mjs projects. */
export function waistIn(state) {
  return (Array.isArray(state && state.waist) ? state.waist : [])
    .filter((r) => r && isDay(r.d) && num(r.in) !== null)
    .map((r) => ({ date: r.d, in: r.in }));
}

/* THE MARKERS. A marker is picked and stored as the athlete's own words for a
   lift (measure-commands.cjs MARKERS_PROFILE). A session entry names the lift
   by its id, so a marker matches an entry when it IS that id or when it is the
   display name the state carries for that id. Nothing is matched loosely: an
   unresolved marker simply has no set, and its row reads absent. */
export function markerIdFor(state, marker) {
  const list = Array.isArray(state && state.exercises) ? state.exercises : [];
  const byName = list.find((e) => e && typeof e.n === 'string' && e.n === marker);
  if (byName && typeof byName.id === 'string') return byName.id;
  const byId = list.find((e) => e && e.id === marker);
  return byId ? byId.id : marker;
}

/* The other direction: a set row already keyed by lift id (this device's own
   session operations) carries the MARKER NAME the screen shows, so the two
   windows share one label for one lift. A row naming no chosen marker keeps
   its own id and simply matches nothing. */
export function nameForMarker(state, markers, id) {
  for (const marker of Array.isArray(markers) ? markers : []) {
    if (marker === id || markerIdFor(state, marker) === id) return marker;
  }
  return id;
}

/* THE SETS. One row per logged lift entry: its load and the reps of its TOP
   set (plan section 2, "top working set (load x reps)"). measure-model.mjs
   then takes the best estimated 1RM of the week for each marker. */
export function setsIn(state, markers) {
  const log = (state && state.sessionLog) || {};
  const wanted = new Map((Array.isArray(markers) ? markers : [])
    .map((m) => [markerIdFor(state, m), m]));
  const out = [];
  for (const date of Object.keys(log)) {
    if (!isDay(date)) continue;
    for (const entry of (log[date] && log[date].entries) || []) {
      if (!entry || !wanted.has(entry.id)) continue;
      const reps = (Array.isArray(entry.reps) ? entry.reps : []).map(num).filter((r) => r !== null);
      if (!reps.length || num(entry.w) === null) continue;
      out.push({ date, marker: wanted.get(entry.id), load: entry.w, reps: Math.max(...reps) });
    }
  }
  return out;
}

/* TRAINING ADHERENCE, numerator: the dates inside the window that carry a
   logged session. */
export function sessionDatesIn(state) {
  const log = (state && state.sessionLog) || {};
  return Object.keys(log).filter(isDay).sort();
}

/* TRAINING ADHERENCE, denominator: the athlete's OWN enrolled week. The split
   in force on a date is the latest entry whose `from` is on or before it
   (rebuild/m4/workout/athlete-state.cjs writes `split: [{from, map}]`). A
   date with no split in force is not a planned day and is not counted, which
   is why a trial that starts before the split does never over-counts. */
export function splitAt(state, date) {
  const entries = (Array.isArray(state && state.split) ? state.split : [])
    .filter((s) => s && isDay(s.from) && s.map && typeof s.map === 'object' && s.from <= date)
    .sort((a, b) => (a.from < b.from ? -1 : 1));
  return entries.length ? entries[entries.length - 1] : null;
}

export function plannedSessionsIn(state, dates) {
  if (!Array.isArray(state && state.split) || !state.split.length) return null;
  let planned = 0;
  for (const date of dates) {
    const split = splitAt(state, date);
    if (!split) continue;
    if (TRAINING_DAY_KINDS.includes(split.map[weekdayOf(date)])) planned += 1;
  }
  return planned;
}

/* LOGGING ADHERENCE. A FOOD day is a day whose record carries either figure
   the intake entry takes; an ENERGY day is one carrying the calorie figure.
   A state with no daily log member at all reads absent rather than zero. */
export function loggedDaysIn(state, dates) {
  const logs = state && state.dailyLogs;
  if (!logs || typeof logs !== 'object') return { food: null, energy: null };
  let food = 0, energy = 0;
  for (const date of dates) {
    const row = logs[date];
    if (!row || typeof row !== 'object') continue;
    const cal = num(row.cal), pro = num(row.pro);
    if (cal !== null || pro !== null) food += 1;
    if (cal !== null) energy += 1;
  }
  return { food, energy };
}

/* The same two counts off the food lane's OWN operations, for the TRIAL window.
   The engine's dailyLogs is a REPLAY, and the replay legitimately refuses a day
   on an athlete whose body composition it has no estimate for (today-app.cjs
   FOOD_KEPT_UNREADABLE): the intake is recorded and kept, and the engine simply
   has no figure to read back. Logging adherence asks whether the athlete
   LOGGED, so it counts the recorded entries, never the engine's willingness to
   replay them. Rows are the food lane's own read-back shape; the last row for a
   date wins, which is that log's own append order. */
export function loggedDaysFromRows(rows, dates) {
  const byDate = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row && isDay(row.date) && row.day && typeof row.day === 'object') byDate.set(row.date, row.day);
  }
  let food = 0, energy = 0;
  for (const date of dates) {
    const day = byDate.get(date);
    if (!day) continue;
    const cal = num(day.cal), pro = num(day.pro);
    if (cal !== null || pro !== null) food += 1;
    if (cal !== null) energy += 1;
  }
  return { food, energy };
}

/* SLEEP. The qualifying rule is THE APP'S OWN and is never re-implemented
   here: a night is qualifying when the engine's cleanAtDate says the MORNING
   AFTER it is clean, which is exactly how rebuild/engine/sleep.cjs sleepInfo
   asks the same question ("clean: cleanAtDate(s, tomorrow)"). A window with
   no logged night at all, or an engine this caller did not supply, yields NO
   nights, so the row reads absent instead of claiming zero qualifying ones. */
export function nightsIn(state, dates, engine) {
  const nights = ((state && state.sleep) || {}).nights;
  if (!Array.isArray(nights) || !engine || typeof engine.cleanAtDate !== 'function') return [];
  const have = new Set(nights.filter((n) => n && isDay(n.d)).map((n) => n.d));
  const out = [];
  for (const date of dates) {
    if (!have.has(date)) continue;
    let clean = false;
    try { clean = engine.cleanAtDate(state, addDays(date, 1)) === true; } catch (_) { clean = false; }
    out.push({ date, clean });
  }
  return out;
}

/* ONE WINDOW, EVERY WEEK, EVERY MEASURE. `waistRows` overrides the state's own
   waist array for the TRIAL window, whose waist values are this device's waist
   operations rather than anything the engine replays. `today` clamps the
   denominators of the week the athlete is standing in to the days that have
   actually elapsed (measure-model.mjs elapsedDaysInWeek). */
export function weeksFromState({ state, startDate, weeks, markers = [], engine = null,
  waistRows = null, sets: givenSets = null, sessionDates = null, foodRows = null,
  today = null } = {}) {
  if (!state || !isDay(startDate) || !(weeks > 0)) return [];
  const reads = readsIn(state);
  const waist = Array.isArray(waistRows) ? waistRows : waistIn(state);
  /* The TRIAL window's sets and session dates are this device's own recorded
     operations (measure-host.mjs sessionSetsIn); the BASELINE window's are the
     imported history the engine replayed into sessionLog. The markers are
     resolved to lift ids either way, so one marker name reads both. */
  const sets = Array.isArray(givenSets)
    ? givenSets.map((s) => ({ ...s, marker: nameForMarker(state, markers, s.marker) }))
    : setsIn(state, markers);
  const sessions = new Set(Array.isArray(sessionDates) ? sessionDates : sessionDatesIn(state));
  const out = [];
  for (let index = 0; index < weeks; index += 1) {
    const dates = weekDates(startDate, index);
    const counted = isDay(today) ? dates.filter((d) => d <= today) : dates;
    const logged = Array.isArray(foodRows)
      ? loggedDaysFromRows(foodRows, counted)
      : loggedDaysIn(state, counted);
    out.push(computeWeek({
      startDate, index, reads, waistRows: waist, sets, markers, today,
      sessionsCompleted: counted.filter((d) => sessions.has(d)).length,
      sessionsPlanned: plannedSessionsIn(state, counted),
      foodDaysLogged: logged.food, energyDaysLogged: logged.energy,
      nights: nightsIn(state, counted, engine),
    }));
  }
  return out;
}

export default { TRAINING_DAY_KINDS, readsIn, waistIn, markerIdFor, nameForMarker, setsIn,
  sessionDatesIn, splitAt, plannedSessionsIn, loggedDaysIn, loggedDaysFromRows,
  nightsIn, weeksFromState };
