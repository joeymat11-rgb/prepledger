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

const { LIMITS, MEMBERS, ENGINE_MEMBERS, PROFILE } = FoodCommands;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* THE REFUSALS ARE CODES HERE, AND SENTENCES IN THE VIEW. The words this screen shows
   live in today-app.cjs, which is one of design.cjs's VIEW_SOURCES and is where the
   copy binding can see them; this module owns the RULE and names the refusal, never
   the wording. That split is also why a copy edit cannot change what is recorded and
   a rule change cannot quietly reword a refusal. */
const REFUSALS = Object.freeze({ NOTHING: "NOTHING", CAL_RANGE: "CAL_RANGE", PRO_RANGE: "PRO_RANGE" });

// N3-A adds optional-entry refusals separately from the sealed page's copy contract.
// PROPOSED, NOT OWNER-APPROVED: exact section 7 sentences of N3-MACROS-DATA-SPEC.
// N3-B must bind these in the view's copy inventory before exposing macro inputs.
const MACRO_REFUSAL_COPY = Object.freeze({
  FAT_RANGE: "Enter fat as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded.",
  CARBS_RANGE: "Enter carbs as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded.",
});
const MACRO_REFUSALS = Object.freeze({ fat: "FAT_RANGE", carbs: "CARBS_RANGE" });

/* The refusal for an entry, decided BEFORE anything is written. Null means the entry
   is recordable. Nothing is ever clamped into range: a figure outside the bounds is
   refused by name and no operation is made. */
function refusalFor(entry) {
  const given = MEMBERS.filter((key) => entry && entry[key] !== undefined && entry[key] !== "");
  if (!given.some((key) => ENGINE_MEMBERS.includes(key))) return REFUSALS.NOTHING;
  for (const key of given) {
    if (MACRO_REFUSALS[key] && typeof entry[key] !== "number" && typeof entry[key] !== "string") {
      return MACRO_REFUSALS[key];
    }
    const raw = String(entry[key]).trim();
    const value = Number(raw);
    const limit = LIMITS[key];
    const ok = raw !== "" && /^\d+$/.test(raw) && Number.isFinite(value)
      && Number.isInteger(value) && value >= limit.min && value <= limit.max;
    if (!ok) return MACRO_REFUSALS[key] || (key === "cal" ? REFUSALS.CAL_RANGE : REFUSALS.PRO_RANGE);
  }
  return null;
}

/* Entry fields turned into the producer's `day`, with an unanswered field
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

/* op log -> engine state, through the ACCEPTED writer and nothing else.

   D2 ROUND 1, FINDING 1 - THE WRITER CAN REFUSE A STATE, AND A REFUSAL IS NOT A CRASH.
   `writeDaily` merges the day and then, for a day that carries `pro`, consults the
   OWED LEDGER: `proteinTarget(s)`, out of energy.cjs, on a state that may have no
   body-composition estimate at all. For a clean-init athlete that call THROWS, so a
   protein intake this page durably recorded took the whole projection down with it and
   the screen went with it. The op is the athlete's fact and it stays recorded; what
   the ENGINE cannot hold it does not hold, and this projector says which days those
   are instead of pretending they do not exist or inventing a target to make the writer
   agree. `next` is only advanced by a writer that RETURNED, so nothing is half applied:
   writeDaily builds its whole next state before the ledger guard runs. */
function foodProjection(state, rows, engine) {
  let next = state;
  const unavailable = [];
  for (const row of winningRows(rows)) {
    const partial = {};
    for (const key of ENGINE_MEMBERS) if (Object.hasOwn(row.day, key)) partial[key] = row.day[key];
    if (Object.keys(partial).length === 0) continue;
    try { next = engine.writeDaily(next, row.date, partial); }
    catch (_) { unavailable.push(row.date); }
  }
  return { state: next, unavailable };
}

function projectFoodDays(state, rows, engine) {
  return foodProjection(state, rows, engine).state;
}

/* The WINNING operation for a date, as the log holds it: the athlete's own figures and
   the effective stamp they were recorded under. This is the record, not a reading of
   it, and it is what the screen shows when the engine could not take the day. */
function recordedDay(rows, date) {
  for (const row of winningRows(rows)) if (row.date === date) return row;
  return null;
}

/* What the engine holds for one day, read back out of the projected state rather than
   out of the screen's memory. `null` members mean the engine has no figure, which is
   what "not entered" looks like to every reader. */
function loggedDay(state, date) {
  const logs = (state && state.dailyLogs) || {};
  const row = logs[date];
  if (!row) return null;
  const out = {};
  for (const key of ENGINE_MEMBERS) out[key] = row[key] === undefined ? null : row[key];
  return out;
}

module.exports = { REFUSALS, MACRO_REFUSALS, MACRO_REFUSAL_COPY, refusalFor, dayFromEntry, winningRows, foodProjection,
  projectFoodDays, recordedDay, loggedDay, LIMITS, MEMBERS, PROFILE, DAY_RE };
