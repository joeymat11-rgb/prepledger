"use strict";

/* steps-model.cjs - N2 "Log today", the steps lane's pure half: what an entry may be, THE PROJECTION that puts a
   recorded step count where the engine reads it, and the admission rule an import applies to the same records.

   THE PROJECTION IS FOOD-MODEL'S, BY RULE. The engine's daily row already has a `steps` member (writers.cjs, the
   daily writer's own `steps`), and the engine's readers (energy.cjs stepTarget, and the step half of the
   energy-balance rollups) read `dailyLogs[date].steps`. N1.7 holds that food-model.cjs is the ONE place this page
   writes a daily log, so this module never calls the engine's writer itself: it hands its rows to
   food-model.cjs dailyProjection with its own one member. Latest op per date wins, only what the winning op
   carries is replayed, and a day the engine refuses is named, never thrown.

   THE ADMISSION RULE (F11, source-admission.mjs). A steps op recorded on this device before an import is a fact
   about a day, like a food day (F2): the winning row per date is PROJECTED onto the replayed state through the
   same projection, and a date the imported history ALREADY holds a step count for is not overwritten; that op is
   refused LOCAL_SOURCE_DAILY_UNRESOLVED by name, which is F2's own rule for its own members. The family's NAME is
   admission's to give (the register test reads it there), so it is passed in. */

const StepsCommands = require("./steps-commands.cjs");
const FoodModel = require("./food-model.cjs");

const { LIMITS, MEMBERS, PROFILE } = StepsCommands;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/* Codes here, sentences in the view (food-model.cjs's split, for the same reason). */
const REFUSALS = Object.freeze({ NOTHING: "NOTHING", STEPS_RANGE: "STEPS_RANGE" });

/* The refusal for an entry, decided BEFORE anything is written. Null means recordable. Nothing is clamped. */
function refusalFor(entry) {
  const given = MEMBERS.filter((key) => entry && entry[key] !== undefined && entry[key] !== "");
  if (given.length === 0) return REFUSALS.NOTHING;
  for (const key of given) {
    const raw = String(entry[key]).trim();
    const value = Number(raw);
    const limit = LIMITS[key];
    const ok = raw !== "" && /^\d+$/.test(raw) && Number.isFinite(value)
      && Number.isInteger(value) && value >= limit.min && value <= limit.max;
    if (!ok) return REFUSALS.STEPS_RANGE;
  }
  return null;
}

/* The box turned into the producer's `day`. Null when the entry is refused. */
function dayFromEntry(entry) {
  if (refusalFor(entry)) return null;
  const out = {};
  for (const key of MEMBERS) {
    if (!entry || entry[key] === undefined || entry[key] === "") continue;
    out[key] = Number(String(entry[key]).trim());
  }
  return out;
}

/* op log -> engine state, through food-model's projector with this lane's one member. */
function stepsProjection(state, rows, engine) {
  return FoodModel.dailyProjection(state, rows, engine, MEMBERS);
}

/* The WINNING op for a date, as the log holds it (the record, not a reading of it). */
function recordedSteps(rows, date) {
  for (const row of FoodModel.winningRows(rows)) if (row.date === date) return row;
  return null;
}

/* What the engine holds for one day, read back out of the projected state. Null when it holds no count. */
function loggedSteps(state, date) {
  const row = ((state && state.dailyLogs) || {})[date];
  return row && row.steps != null ? row.steps : null;
}

/* F11 at admission. `rows` are { op_id, date, day } in the log's own order, each already validated by the
   producer's own validate(); `engineFor(date, hour)` is admission's replay engine for that day. Returns the next
   state, one family row per op, and the named issues. */
function admitStepRows(state, rows, engineFor, family) {
  const all = Array.isArray(rows) ? rows : [];
  const winners = FoodModel.winningRows(all);
  const families = [];
  const issues = [];
  let next = state;
  for (const row of winners) {
    const held = (next && next.dailyLogs && next.dailyLogs[row.date]) || {};
    /* A count the history HOLDS is a non-null one: a food day projected first (F2) may leave the row without a
       count, and that is not a step figure this op would overwrite. */
    if (MEMBERS.some((key) => held[key] != null)) {
      issues.push({ code: "LOCAL_SOURCE_DAILY_UNRESOLVED", op_id: row.op_id });
      continue;
    }
    const projected = stepsProjection(next, [row], engineFor(row.date, 12));
    if (projected.unavailable.length) issues.push({ code: "LOCAL_SOURCE_DAILY_UNRESOLVED", op_id: row.op_id });
    else next = projected.state;
    families.push({ family, state: projected.unavailable.length ? "retained" : "projected", op_id: row.op_id });
  }
  for (const row of all) if (!winners.includes(row)) families.push({ family, state: "retained", op_id: row.op_id });
  return { state: next, families, issues };
}

module.exports = { REFUSALS, refusalFor, dayFromEntry, stepsProjection, recordedSteps, loggedSteps,
  admitStepRows, LIMITS, MEMBERS, PROFILE, DAY_RE };
