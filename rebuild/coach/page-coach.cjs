"use strict";
/* COACH V1 (owner ruling 2026-10-12, "No-AI coach first"; brief rebuild/lanes/b/S19-LIVE-BRIEF.md, Coach v1).
 *
 * The page's coach: the tested tools (tools.cjs, wave1-tools.cjs) composed over the world a page hands in, and
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
const { createCoachTools } = require("./tools.cjs");
const { createWave1Tools } = require("./wave1-tools.cjs");
const { ask } = require("./coach-intents.cjs");

/* READ-ONLY WRAPPERS (Fable D1). The tools are handed NOT the page's models but frozen wrappers carrying only the
   read methods the page's READ intents call (tools.cjs today_plan, weight_trend, current_set,
   last_comparable_performance, today_checkin): the Today model's read() and stateFromOps() and its day string, the
   gym card's read(), and the check-in's refresh() (a re-read of its own store) and read(). No writer of any of the
   three (weighIn, reopen, setFoodDays, start, logSet, finish, discardOpenedEmpty, undo, save, adoptEngineState, the
   check-in's live draft ...) is reachable from what the coach holds, whatever a later tool tries. */
const READS = Object.freeze({
  today: Object.freeze(["read", "stateFromOps"]),
  gym: Object.freeze(["read"]),
  checkin: Object.freeze(["refresh", "read"]),
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
  });
}

function createPageCoach(world) {
  const held = readOnlyWorld(world);
  const tools = createWave1Tools({ world: held, coach: createCoachTools(held) });
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
  });
}

module.exports = { createPageCoach, readOnlyWorld, READS };
