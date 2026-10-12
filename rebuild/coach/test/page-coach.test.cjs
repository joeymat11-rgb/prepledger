"use strict";

/* Coach v1: page-coach.cjs is the Today page's one edge to the coach. These rows hold it to the composition the page
   relies on: ask() answers exactly as coach-intents.cjs ask() does over the same tools and world, each ask is its own
   turn, the page gets ask() and nothing else (no dispatcher, so no FACT-tier write), only page intents are asked, and
   the module takes no edge but the three coach modules. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createPageCoach, readOnlyWorld, READS } = require("../page-coach.cjs");
const Intents = require("../coach-intents.cjs");
const Tools = require("../tools.cjs");
const Wave1 = require("../wave1-tools.cjs");

/* The page's own Today model over its synthetic day (no store), as coach.test.mjs CV1 mounts it. */
const TodayModel = require("../../m3/w7-preview/today/today-model.cjs");
const fakeToday = () => TodayModel.createTodayModel({ today: TodayModel.SYNTHETIC_DAY });

test("PC-1: ask() is coach-intents ask() over the same tools and world, turn by turn", async () => {
  const today = fakeToday();
  const page = createPageCoach({ today });
  const world = { today, gym: null, checkin: null };
  const tools = Wave1.createWave1Tools({ world, coach: Tools.createCoachTools(world) });
  for (const [n, intent] of [[1, "today_plan"], [2, "weight_trend"], [3, "my_checkin"]]) {
    const got = await page.ask(intent);
    const want = await Intents.ask(tools, intent, { turnId: "coach-" + n });
    assert.equal(got.turn_id, "coach-" + n, "each ask is its own turn");
    assert.equal(got.answer, want.answer, intent);
    assert.equal(got.shipped, want.shipped, intent);
    assert.equal(got.answered, want.answered, intent);
    assert.deepEqual(got.untraceable, [], intent + ": every number is a tool result of the turn");
  }
});

test("PC-2: the page gets ask() and nothing else, and only page intents are asked", async () => {
  const page = createPageCoach({ today: fakeToday() });
  assert.deepEqual(Object.keys(page), ["ask"], "no dispatcher is handed out");
  assert.equal(Object.isFrozen(page), true);
  await assert.rejects(() => page.ask("log_set"), /COACH_UNKNOWN_PAGE_INTENT/, "a write is not a page intent");
  await assert.rejects(() => page.ask("record_machine_settings"), /COACH_UNKNOWN_PAGE_INTENT/);
  const world = { today: fakeToday() };
  const { TIERS } = Wave1.createWave1Tools({ world, coach: Tools.createCoachTools(world) });
  for (const intent of Intents.PAGE_INTENT_IDS) {
    const spec = Intents.PAGE_INTENTS[intent];
    assert.equal(TIERS[spec.tool], Tools.TIER.READ, intent + " runs a READ tool");
  }
});

test("PC-3: with no lane open the reads refuse in the tools' own words, and the machine seat has no lane", async () => {
  const page = createPageCoach({ today: fakeToday() });
  for (const intent of ["why_weight", "last_time", "my_checkin", "machine_seat"]) {
    const got = await page.ask(intent);
    assert.equal(got.answered, false, intent + " is refused with no lane open");
    assert.equal(/\d/.test(got.answer), false, intent + " invents no figure");
  }
});

/* Fable D1: the world the tools hold carries only the read methods the READ intents use, and no writer of the page's
   models is reachable from it, however far it is walked; and asking every page question over models whose writers
   record a call never calls one. */
const WRITERS = Object.freeze(["weighIn", "reopen", "setFoodDays", "setSleepNights", "start", "logSet", "finish",
  "discardOpenedEmpty", "undo", "commitWorkoutEdit", "executeResumedWorkout", "save", "answer", "adoptEngineState",
  "draft", "recordSettings", "engine", "host"]);
function reachableNames(root) {
  const names = new Set(), seen = new Set(), stack = [root];
  while (stack.length) {
    const at = stack.pop();
    if (at === null || (typeof at !== "object" && typeof at !== "function") || seen.has(at)) continue;
    seen.add(at);
    for (const key of Reflect.ownKeys(at)) {
      names.add(String(key));
      const d = Object.getOwnPropertyDescriptor(at, key);
      if (d && "value" in d) stack.push(d.value);
    }
    const proto = Object.getPrototypeOf(at);
    if (proto && proto !== Object.prototype && proto !== Function.prototype) stack.push(proto);
  }
  return names;
}
test("PC-5: the coach's world is read-only wrappers; no writer of the Today model, gym card or check-in is reachable", async () => {
  const called = [];
  const spyWriters = (obj) => { for (const w of WRITERS) obj[w] = (..._) => { called.push(w); throw new Error("WRITER " + w); }; return obj; };
  const real = fakeToday();
  const today = spyWriters(Object.assign(Object.create(real), { read: () => real.read(), stateFromOps: () => real.stateFromOps(), today: real.today }));
  const gym = spyWriters({ read: async () => ({ phase: "ready", lift: { id: "x", label: "Lift", index: 1, count: 1 }, set: { position: 1, count: 1 },
    prescription: { line: "", effort: "", reason: [], setup: "" }, previous: null }) });
  const checkin = spyWriters({ refresh: async () => {}, read: () => ({ day: real.today, recorded: null, note: "", recordedLines: [] }) });
  const held = readOnlyWorld({ today, gym, checkin });
  assert.deepEqual(Object.keys(held), ["today", "gym", "checkin"]);
  assert.deepEqual(Object.keys(held.today).sort(), [...READS.today, "today"].sort());
  assert.deepEqual(Object.keys(held.gym), [...READS.gym]);
  assert.deepEqual(Object.keys(held.checkin), [...READS.checkin]);
  for (const part of [held, held.today, held.gym, held.checkin]) assert.equal(Object.isFrozen(part), true);
  const names = reachableNames(held);
  for (const w of WRITERS) assert.equal(names.has(w), false, w + " is reachable from the coach's world");
  const page = createPageCoach({ today, gym, checkin });
  for (const intent of Intents.PAGE_INTENT_IDS) await page.ask(intent);
  assert.deepEqual(called, [], "no writer was called by any page question");
  /* the wrappers still read through: the gym's read and the check-in's read reach the coach */
  assert.equal((await page.ask("why_weight")).answered, true, "a READ through the gym wrapper is answered");
});

test("PC-4: page-coach.cjs takes no edge but the three coach modules, and no network word", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "page-coach.cjs"), "utf8");
  const edges = [...src.matchAll(/\b(?:require|import)\s*\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
  assert.deepEqual(edges, ["./tools.cjs", "./wave1-tools.cjs", "./coach-intents.cjs"]);
  for (const word of ["fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon", "getUserMedia", "indexedDB", "localStorage"]) {
    assert.equal(src.includes(word), false, word);
  }
});
