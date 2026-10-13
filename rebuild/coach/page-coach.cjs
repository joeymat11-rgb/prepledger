"use strict";
/* COACH V1 (owner ruling 2026-10-12, "No-AI coach first"; brief rebuild/lanes/b/S19-LIVE-BRIEF.md, Coach v1).
 *
 * The page's coach: the tested READ tools (read-tools.cjs, wave1-tools.cjs) composed over the world a page hands in, and
 * coach-intents.cjs ask() as the only way a question is answered. One module, so the Today page takes ONE edge to the
 * coach (the writer fence pins the released view's edges) and the composition is tested where the tools are.
 *
 * world: { today, gym, checkin } - the Today model, and the gym card and the check-in when their lanes opened (null
 * otherwise; the tools then refuse in their own words). No machineSettings: the gym card keeps those in its own
 * sealed lane, and the page may not open that store a second time.
 *
 * The page gets ONE call, ask(intent), and ask() runs only the page's read intents (coach-intents.cjs PAGE_INTENTS,
 * each a TIER.READ tool); the dispatcher is not handed out, so no FACT-tier write is reachable from the page. The
 * tool layer stays the adapter seam: a later model adapter builds the same createWave1Tools dispatcher (openTurn,
 * dispatch) over the same world and is held to the same untraceable() check; ask() is the template speaker this
 * build uses instead of a model. Nothing here fetches, listens or writes. */
/* The READ tools only (read-tools.cjs), never tools.cjs: its FACT and PROPOSAL tools (the consent path's respond,
   the engine revision a proposal is stamped with) stay off the page, which the page laws require (page-bundle P3-B4,
   writer-enumeration P3-EN3). */
const { createReadTools } = require("./read-tools.cjs");
const { createWave1Tools } = require("./wave1-tools.cjs");
const { ask, WEEK_WORDS } = require("./coach-intents.cjs");

/* READ-ONLY WRAPPERS (Fable D1). The tools are handed NOT the page's models but frozen wrappers carrying only the
   read methods the page's READ intents call (tools.cjs today_plan, weight_trend, current_set,
   last_comparable_performance, today_checkin): the Today model's read() and stateFromOps() and its day string, the
   gym card's read(), and the check-in's refresh() (a re-read of its own store) and read(). No writer of any of the
   three (weighIn, reopen, setFoodDays, start, logSet, finish, discardOpenedEmpty, undo, save, adoptEngineState, the
   check-in's live draft ...) is reachable from what the coach holds, whatever a later tool tries.
   Coach v1 piece 2 (the weekly review, read-tools.cjs week_review) adds three READS and nothing else: the Today
   model's plannedDays() (the engine's planned workout days), the gym card's weekSessions() (its closed sessions in a
   window) and the workout lane's weekLifts() (each lift's check, kept as data, today-entry.mjs), as `week.lifts`.
   The polish batch (plain answers) adds one READ: the Today model's sessionPlan() (today's session as the engine
   composes it, read-tools.cjs today_session). Batch 2 adds one more: the gym card's lastTimes() (every lift's "Last
   time" sets, read-tools.cjs last_times). The seat read adds one more, and only a read: the settings already saved for
   today's lifts, `seats.read(liftIds)` (today-entry.mjs seatSettings over the sealed gym lane's readSavedSettings, the
   lane's own single store handle; read-tools.cjs seat_settings).
   UI-PASS13 (item 2) adds one more, and only a read: the gym card's prescriptions(), the cells of the slots its own
   last read() prepared, so "What am I hitting today?" says each lift's sets exactly as the set screen shows them
   (read-tools.cjs today_session). */
const READS = Object.freeze({
  today: Object.freeze(["read", "stateFromOps", "plannedDays", "sessionPlan"]),
  gym: Object.freeze(["read", "weekSessions", "lastTimes", "prescriptions"]),
  checkin: Object.freeze(["refresh", "read"]),
  week: Object.freeze(["lifts"]),
  seats: Object.freeze(["read"]),
});
function readOnly(source, methods, extra = {}) {
  if (!source || typeof source !== "object" && typeof source !== "function") return null;
  const out = Object.create(null);
  for (const name of methods) {
    if (typeof source[name] === "function") out[name] = (...args) => source[name](...args);
  }
  return Object.freeze(Object.assign(out, extra));
}
function readOnlyWorld(world) {
  const shape = world && typeof world === "object" ? world : {};
  const day = shape.today && typeof shape.today.today === "string" ? { today: shape.today.today } : {};
  return Object.freeze({
    today: readOnly(shape.today, READS.today, day),
    gym: readOnly(shape.gym, READS.gym),
    checkin: readOnly(shape.checkin, READS.checkin),
    week: readOnly(shape.week, READS.week),
    seats: readOnly(shape.seats, READS.seats),
  });
}

function createPageCoach(world) {
  const held = readOnlyWorld(world);
  const tools = createWave1Tools({ world: held, coach: createReadTools(held) });
  let turns = 0;
  const liftId = async () => {
    if (!held.gym || typeof held.gym.read !== "function") return null;
    const shown = await held.gym.read();
    return shown && shown.lift && typeof shown.lift.id === "string" ? shown.lift.id : null;
  };
  return Object.freeze({
    async ask(intent) {
      turns += 1;
      return ask(tools, intent, { turnId: "coach-" + turns, liftId });
    },
    /* The weekly review as the Today card draws it: the lines of a shipped, answered turn, or nothing. The same turn,
       the same check: a review whose numbers are not all tool results of its turn is never drawn. */
    async week() {
      turns += 1;
      const got = await ask(tools, "week_review", { turnId: "coach-" + turns, liftId });
      return got.lines ? Object.freeze({ ok: true, lines: got.lines }) : Object.freeze({ ok: false, lines: null });
    },
  });
}

/* The first day of a training week (the engine's Monday): the day the Today card shows the review of the week just
   ended. A malformed day is never one. */
function weekStarts(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return new Date(Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))).getUTCDay() === 1;
}

/* POLISH 5 (PM, item 5): the review card's heading on the first day of a week, so Today can hold the card's place in
   its own words while the review is read. */
const WEEK_HEADING = WEEK_WORDS.lastWeek;

module.exports = { createPageCoach, readOnlyWorld, READS, weekStarts, WEEK_HEADING };
