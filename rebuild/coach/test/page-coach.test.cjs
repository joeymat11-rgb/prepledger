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
  /* The page's own composition, the read tools (read-tools.cjs): since the polish batch today's plan also reads
     today_session, a page read tools.cjs does not carry (as week_review before it). */
  const tools = Wave1.createWave1Tools({ world, coach: require("../read-tools.cjs").createReadTools(world) });
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
  /* Coach v1 piece 2 adds week(), the weekly review's lines through the same ask() and the same check. */
  assert.deepEqual(Object.keys(page), ["ask", "week"], "no dispatcher is handed out");
  assert.equal(Object.isFrozen(page), true);
  await assert.rejects(() => page.ask("log_set"), /COACH_UNKNOWN_PAGE_INTENT/, "a write is not a page intent");
  await assert.rejects(() => page.ask("record_machine_settings"), /COACH_UNKNOWN_PAGE_INTENT/);
  const world = { today: fakeToday() };
  /* The page's own composition (read-tools.cjs), which carries the weekly review read tools.cjs does not. */
  const { TIERS } = Wave1.createWave1Tools({ world, coach: require("../read-tools.cjs").createReadTools(world) });
  for (const intent of Intents.PAGE_INTENT_IDS) {
    const spec = Intents.PAGE_INTENTS[intent];
    for (const tool of spec.tools) assert.equal(TIERS[tool], Tools.TIER.READ, intent + " runs " + tool + ", a READ tool");
  }
});

test("PC-3: with no lane open the lane reads refuse in plain words, and the machine seat has no lane", async () => {
  const page = createPageCoach({ today: fakeToday() });
  /* Polish batch: why_weight reads today's session from the Today model (today_session), which needs no lane, so it is
     answered here (PC-5 and coach-intents CI-6 hold its words); the three lane reads are refused, each in its question's
     own plain sentence. */
  for (const intent of ["last_time", "my_checkin", "machine_seat"]) {
    const got = await page.ask(intent);
    assert.equal(got.answered, false, intent + " is refused with no lane open");
    assert.equal(/\d/.test(got.answer), false, intent + " invents no figure");
    assert.equal(got.answer, Intents.PLAIN_REFUSALS[intent], intent + " says its own plain sentence");
  }
  const why = await page.ask("why_weight");
  assert.equal(why.answered, true, "why this weight reads the Today model's session, which needs no lane");
  assert.deepEqual(why.untraceable, []);
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
    prescription: { line: "", effort: "", reason: [], setup: "" }, previous: null }),
    weekSessions: async () => ({ ok: true, done: 1, dates: [] }), lastTimes: () => [] });
  const checkin = spyWriters({ refresh: async () => {}, read: () => ({ day: real.today, recorded: null, note: "", recordedLines: [] }) });
  const held = readOnlyWorld({ today, gym, checkin });
  assert.deepEqual(Object.keys(held), ["today", "gym", "checkin", "week"]);
  assert.deepEqual(Object.keys(held.today).sort(), [...READS.today, "today"].sort());
  assert.deepEqual(Object.keys(held.gym), [...READS.gym]);
  assert.deepEqual(Object.keys(held.checkin), [...READS.checkin]);
  assert.equal(held.week, null, "no lift read was handed in, so none is held");
  for (const part of [held, held.today, held.gym, held.checkin]) assert.equal(Object.isFrozen(part), true);
  const names = reachableNames(held);
  for (const w of WRITERS) assert.equal(names.has(w), false, w + " is reachable from the coach's world");
  const page = createPageCoach({ today, gym, checkin });
  for (const intent of Intents.PAGE_INTENT_IDS) await page.ask(intent);
  assert.deepEqual(called, [], "no writer was called by any page question");
  /* the wrappers still read through: the gym's read and the check-in's read reach the coach (polish batch: "What did I
     do last time?" is the gym wrapper's read now; why_weight reads the Today model's session) */
  const last = await page.ask("last_time");
  assert.equal(last.answered, true, "a READ through the gym wrapper is answered");
  /* batch 2: every lift of today's workout, one line each (the fake card holds no earlier sets) */
  assert.deepEqual(last.answer.split("\n"), real.sessionPlan().exercises.map((ex) => "No earlier session of " + ex.name + " yet."));
  assert.equal((await page.ask("why_weight")).answered, true, "a READ through the Today wrapper's sessionPlan is answered");
});

test("PC-4: page-coach.cjs takes no edge but the three coach modules, and no network word", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "page-coach.cjs"), "utf8");
  const edges = [...src.matchAll(/\b(?:require|import)\s*\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
  assert.deepEqual(edges, ["./read-tools.cjs", "./wave1-tools.cjs", "./coach-intents.cjs"]);
  for (const word of ["fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon", "getUserMedia", "indexedDB", "localStorage"]) {
    assert.equal(src.includes(word), false, word);
  }
});

/* PC-6 (the PM's hosted run of 9e41ef3: page-bundle P3-B4 and writer-enumeration P3-EN3 red). Everything page-coach.cjs
   reaches, walked by its literal require/import edges the way the bundler follows them, is held to the page laws a
   builder seat can check without building the page: no plan-writer call (P3-EN3's own pattern, comments included, so
   it can only over-read), none of tools.cjs, the engine revision (an Import-route-only module, P3-B4's ROUTE_MODULES),
   the proposal digest or the check-in writer's refusals, and nothing under rebuild/engine or rebuild/m4/import. The
   walk refuses a forbidden path BEFORE reading it, so it never opens a protected file. */
const REPO = path.resolve(__dirname, "..", "..", "..");
const PLAN_WRITER_CALL = /\.\s*(planEdit|respond|decision|undoRequest|acceptInitialPlan)\s*\(/g;
const OFF_PAGE = ["rebuild/coach/tools.cjs", "rebuild/coach/engine-revision.cjs", "rebuild/coach/sha256.cjs",
  "rebuild/coach/checkin-refusals.cjs"];
const FORBIDDEN_DIR = /^rebuild\/(engine|m4\/import)\//;
function coachClosure() {
  const seen = new Set(), refused = [], stack = ["rebuild/coach/page-coach.cjs"];
  while (stack.length) {
    const rel = stack.pop();
    if (seen.has(rel)) continue;
    if (FORBIDDEN_DIR.test(rel) || OFF_PAGE.includes(rel)) { refused.push(rel); continue; }
    seen.add(rel);
    const src = fs.readFileSync(path.join(REPO, rel), "utf8");
    for (const m of src.matchAll(/\b(?:require|import)\s*\(\s*["']([^"']+)["']\s*\)|\bfrom\s+["']([^"']+)["']/g)) {
      const spec = m[1] || m[2];
      if (!spec.startsWith(".")) continue;
      stack.push(path.posix.normalize(path.posix.join(path.posix.dirname(rel), spec)));
    }
  }
  return { modules: [...seen].sort(), refused: refused.sort() };
}
test("PC-6: the page's coach reaches no plan writer, no tools.cjs, no engine revision and no engine or import file", () => {
  const { modules, refused } = coachClosure();
  assert.deepEqual(refused, [], "the page's coach reaches a module the page laws keep off the Today boot graph");
  assert.deepEqual(modules, ["rebuild/coach/coach-intents.cjs", "rebuild/coach/page-coach.cjs", "rebuild/coach/read-tools.cjs",
    "rebuild/coach/tool-kernel.cjs", "rebuild/coach/wave1-tools.cjs", "rebuild/m4/workout/edit-values.cjs"],
    "the coach the page carries is exactly these modules (edit-values.cjs is already a page input)");
  const calls = modules.flatMap((rel) => [...fs.readFileSync(path.join(REPO, rel), "utf8").matchAll(PLAN_WRITER_CALL)]
    .map((m) => rel + " ." + m[1] + "("));
  assert.deepEqual(calls, [], "a module the page's coach reaches calls a plan writer");
  /* and the walk has teeth: tools.cjs itself, walked the same way, is refused and carries the consent path's respond */
  assert.equal([...fs.readFileSync(path.join(REPO, "rebuild/coach/tools.cjs"), "utf8").matchAll(PLAN_WRITER_CALL)].length > 0, true,
    "tools.cjs no longer carries the consent path's respond, so this cell stopped proving anything");
});

/* PC-7..PC-9 (Coach v1 piece 2, PM ruling option A: the weekly review). Over the real Today model and a synthetic
   gym card and lift read, the review ships with every number a tool result of its turn; each lift says the engine's
   offer reason behind Why?, or ONE plain sentence for its refusal or hold code, or the fallback for a code with no
   sentence; with no workout record the tool refuses in its own words and the card has nothing to draw. */
const WEEK_ROWS = Object.freeze([
  { lift: "a", name: "Chest press", status: "offer", kind: "earn", date: "2026-10-01", loads: [145, 145], current: [140, 140],
    reason: "Chest press: on 2026-10-01 you completed every set at 140 lb on every set. Offer: make 145 lb your working weight." },
  { lift: "b", name: "Row", status: "refused", code: "NATIVE_LOAD_WINDOW_NOT_TOP" },
  { lift: "c", name: "Curl", status: "refused", code: "NATIVE_LOAD_SOMETHING_UNMAPPED" },
  { lift: "d", name: "Squat", status: "held", code: "disputed" },
]);
const weekWorld = (day, extra = {}) => {
  const windows = [];
  const today = TodayModel.createTodayModel({ today: day });
  return { windows, today, gym: { read: async () => ({ phase: "idle" }), weekSessions: async (from, to) => { windows.push([from, to]); return { ok: true, done: 3, dates: [] }; } },
    week: { lifts: async () => ({ ok: true, lifts: WEEK_ROWS.map((row) => ({ ...row })) }) }, ...extra };
};
test("PC-7: the weekly review ships traced, Monday reviews the week just ended, and each lift says its own standing", async () => {
  const { weekStarts } = require("../page-coach.cjs");
  assert.equal(weekStarts("2026-10-12"), true, "2026-10-12 is a Monday");
  assert.equal(weekStarts("2026-10-14"), false);
  assert.equal(weekStarts("not a day"), false);
  const monday = weekWorld("2026-10-12");
  const coach = createPageCoach(monday);
  const asked = await coach.ask("week_review");
  assert.equal(asked.shipped, true);
  assert.equal(asked.answered, true);
  assert.deepEqual(asked.untraceable, [], "every number in the review, whys included, is a tool result of its turn");
  assert.deepEqual(asked.charter, []);
  assert.deepEqual(monday.windows, [["2026-10-05", "2026-10-11"]], "on a Monday the window is the week just ended");
  const lines = asked.lines;
  assert.equal(lines[0].text, Intents.WEEK_WORDS.lastWeek);
  assert.equal(lines[1].text, "Workouts done: 3 of " + monday.today.plannedDays("2026-10-05", "2026-10-11").length + ".");
  const said = (name) => lines.find((l) => l.text.startsWith(name + ": "));
  assert.equal(said("Chest press").text, "Chest press: " + Intents.WEEK_WORDS.up);
  /* batch 2 (item 4): the offer said plainly behind Why?, its figures the offer's own (the engine's reason is not shown) */
  assert.equal(said("Chest press").why, "You reached the top of your rep range at 140 lb on Oct 1. Make 145 lb your working weight? Nothing changes unless you say yes; it then applies on a later workout.");
  assert.equal(said("Row").text, "Row: " + Intents.WEEK_CODE_WORDS.NATIVE_LOAD_WINDOW_NOT_TOP);
  assert.equal(said("Row").why, null);
  assert.equal(said("Curl").text, "Curl: " + Intents.WEEK_FALLBACK, "an unmapped code names nothing of its own");
  assert.equal(said("Squat").text, "Squat: " + Intents.WEEK_HOLD_WORDS.disputed);
  assert.ok(lines.some((l) => l.text.startsWith(Intents.WEEK_WORDS.suggestion)), "the open suggestion on Today is named");
  /* Polish batch: the bodyweight paragraph is one short line when the device holds a trend weight (and none without). */
  assert.ok(lines.some((l) => /^Trend weight: \d+(\.\d+)? lb\.$/.test(l.text)), "the trend line is one short line");
  assert.equal(lines.some((l) => /rate is not measured|No reading is stored/.test(l.text)), false, "no trend paragraph");
  assert.equal(asked.answer.includes(WEEK_ROWS[0].reason), false, "the Coach answer leaves the reasons to Why?");
  assert.deepEqual(asked.answer.split("\n"), lines.map((l) => (l.heading ? l.text + "." : l.text)), "one line per item");
  const midweek = weekWorld("2026-10-14");
  const mid = await createPageCoach(midweek).week();
  assert.deepEqual(midweek.windows, [["2026-10-12", "2026-10-14"]], "midweek the window is this week so far");
  assert.equal(mid.ok, true);
  assert.equal(mid.lines[0].text, Intents.WEEK_WORDS.thisWeek);
});

test("PC-8: every refusal sentence is plain, dash free and true to a named native-load.cjs code; the hold words are the two notices", () => {
  const nl = fs.readFileSync(path.join(REPO, "rebuild/engine/native-load.cjs"), "utf8");
  for (const code of Object.keys(Intents.WEEK_CODE_WORDS)) {
    assert.ok(nl.includes("refuse('" + code.replace(/^NATIVE_LOAD_/, "") + "'"), code + " is a refusal native-load.cjs really raises");
  }
  assert.deepEqual(Object.keys(Intents.WEEK_HOLD_WORDS).sort(), ["conflict", "disputed"], "today-entry.mjs noticesOf's two notice codes");
  const all = [...Object.values(Intents.WEEK_WORDS), ...Object.values(Intents.WEEK_CODE_WORDS), ...Object.values(Intents.WEEK_HOLD_WORDS), Intents.WEEK_FALLBACK];
  for (const words of all) {
    assert.equal(/[\u2013\u2014]/.test(words), false, words + " carries a dash");
    assert.equal(/\d/.test(words), false, words + " carries a figure of its own");
  }
  const entry = fs.readFileSync(path.join(REPO, "rebuild/m3/w7-preview/today/today-entry.mjs"), "utf8");
  assert.ok(entry.includes('line: "' + Intents.WEEK_CODE_WORDS.NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT + '"'),
    "the bodyweight line is the approved S14 R4 line, word for word");
});

test("PC-9: with no workout record the review is refused in the tool's own words, and the card has nothing to draw", async () => {
  const bare = createPageCoach({ today: fakeToday() });
  const asked = await bare.ask("week_review");
  assert.equal(asked.shipped, true);
  assert.equal(asked.answered, false);
  assert.equal(/\d/.test(asked.answer), false);
  assert.deepEqual(await bare.week(), { ok: false, lines: null });
  const noLifts = createPageCoach(weekWorld("2026-10-14", { week: null }));
  const lines = (await noLifts.week()).lines;
  assert.ok(lines.some((l) => l.text === Intents.WEEK_WORDS.liftsUnknown), "with no lift read it says the lifts could not be checked");
  /* Polish batch: with no trend weight on the device the review has no bodyweight line at all. */
  const unweighed = weekWorld("2026-10-14");
  const real = unweighed.today;
  unweighed.today = Object.assign(Object.create(real), { stateFromOps: () => ({ ...real.stateFromOps(), trend: null }) });
  const quiet = (await createPageCoach(unweighed).week()).lines;
  assert.ok(quiet.length > 2, "the review is still drawn");
  assert.equal(quiet.some((l) => /trend|weight on this device|reading/i.test(l.text)), false, "no bodyweight line without a reading");
});
