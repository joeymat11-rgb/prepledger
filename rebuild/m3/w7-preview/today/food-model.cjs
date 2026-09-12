"use strict";

/* food-model.cjs - N1's pure half: what the screen may say, what an entry may be, and
   THE PROJECTOR - the one thing this build exists to add.

   THE PROJECTOR, AND WHY IT IS THE SEAM (N1 brief 1.4). The engine's intake writer
   already exists (rebuild/engine/writers.cjs:2789 writeDaily) and the client's class
   already exists (rebuild/client/ops.cjs:20 "food-day"). What did not exist is the
   thing between them: nothing replayed a stored food-day operation into the engine's
   `dailyLogs`. A1's precedent is exact - today-model.cjs replays readings with
   `state = E.applyRead(state, r.date, r.lb, {hour: 8})` - and this is its mirror:
   `state = E.writeDaily(state, date, partial)`, date-ascending, through the engine's
   OWN writer. No figure is computed here; the adapter never adds up a day.

   LATEST OP WINS, PER DATE. Ops are append-only, so a correction is a NEW op for the
   same local_date. `winningRows` keeps the last row for each date in the log's own
   order (device sequence, then op id), and only that row is replayed. writeDaily's
   partial merge is therefore never relied on ACROSS ops: a day whose winning op
   carries only `pro` projects a row with `cal` absent, not a stale `cal` from the op
   it replaced. */

const FoodCommands = require("./food-commands.cjs");

const { LIMITS, MEMBERS, PROFILE } = FoodCommands;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* THE REFUSALS ARE CODES HERE, AND SENTENCES IN THE VIEW. The words this screen shows
   live in today-app.cjs, which is one of design.cjs's VIEW_SOURCES and is where the
   copy binding can see them; this module owns the RULE and names the refusal, never
   the wording. That split is also why a copy edit cannot change what is recorded and
   a rule change cannot quietly reword a refusal. */
const REFUSALS = Object.freeze({ NOTHING: "NOTHING", CAL_RANGE: "CAL_RANGE", PRO_RANGE: "PRO_RANGE" });

/* The refusal for an entry, decided BEFORE anything is written. Null means the entry
   is recordable. Nothing is ever clamped into range: a figure outside the bounds is
   refused by name and no operation is made. */
function refusalFor(entry) {
  const given = MEMBERS.filter((key) => entry && entry[key] !== undefined && entry[key] !== "");
  if (given.length === 0) return REFUSALS.NOTHING;
  for (const key of given) {
    const raw = String(entry[key]).trim();
    const value = Number(raw);
    const limit = LIMITS[key];
    const ok = raw !== "" && /^\d+$/.test(raw) && Number.isFinite(value)
      && Number.isInteger(value) && value >= limit.min && value <= limit.max;
    if (!ok) return key === "cal" ? REFUSALS.CAL_RANGE : REFUSALS.PRO_RANGE;
  }
  return null;
}

/* The screen's two boxes turned into the producer's `day`, with an unanswered box
   ABSENT rather than null or zero. Returns null when the entry is refused. */
function dayFromEntry(entry) {
  if (refusalFor(entry)) return null;
  const out = {};
  for (const key of MEMBERS) {
    if (!entry || entry[key] === undefined || entry[key] === "") continue;
    out[key] = Number(String(entry[key]).trim());
  }
  return out;
}

/* LATEST WINS, per date. `rows` arrive in the log's own order (the host sorts by
   device sequence, then op id), so the last row for a date is the winning one. */
function winningRows(rows) {
  const byDate = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row.date !== "string" || !DAY_RE.test(row.date)) continue;
    if (!row.day || typeof row.day !== "object") continue;
    byDate.set(row.date, row);
  }
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/* op log -> engine state, through the ACCEPTED writer and nothing else. */
function projectFoodDays(state, rows, engine) {
  let next = state;
  for (const row of winningRows(rows)) {
    const partial = {};
    for (const key of MEMBERS) if (Object.hasOwn(row.day, key)) partial[key] = row.day[key];
    if (Object.keys(partial).length === 0) continue;
    next = engine.writeDaily(next, row.date, partial);
  }
  return next;
}

/* What the engine holds for one day, read back out of the projected state rather than
   out of the screen's memory. `null` members mean the engine has no figure, which is
   what "not entered" looks like to every reader. */
function loggedDay(state, date) {
  const logs = (state && state.dailyLogs) || {};
  const row = logs[date];
  if (!row) return null;
  const out = {};
  for (const key of MEMBERS) out[key] = row[key] === undefined ? null : row[key];
  return out;
}

module.exports = { REFUSALS, refusalFor, dayFromEntry, winningRows, projectFoodDays, loggedDay,
  LIMITS, MEMBERS, PROFILE, DAY_RE };
