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
/* N2 "Log today" (Part A): the model's steps-lane setter, setStepDays, is held out like setFoodDays and setSleepNights. */
const WRITERS = Object.freeze(["weighIn", "reopen", "setFoodDays", "setSleepNights", "setStepDays", "start", "logSet", "finish",
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
  const shown = () => ({ phase: "ready", lift: { id: "x", label: "Lift", index: 1, count: 1 }, set: { position: 1, count: 1 },
    prescription: { line: "", effort: "", reason: [], setup: "" }, previous: null });
  const gym = spyWriters({ read: async () => shown(),
    weekSessions: async () => ({ ok: true, done: 1, dates: [] }), lastTimes: () => [],
    /* ui-pass13 item 2: the card's prepared slots, the set screen's own source (none prepared on this fake card) */
    prescriptions: () => null,
    /* N2 Part A: the view the card's own last read returned, the snapshot every coach read of the card takes */
    lastRead: () => shown() });
  const checkin = spyWriters({ refresh: async () => {}, read: () => ({ day: real.today, recorded: null, note: "", recordedLines: [] }) });
  const held = readOnlyWorld({ today, gym, checkin });
  /* the seat read (PM ruling option A) adds `seats`, its one read */
  assert.deepEqual(Object.keys(held), ["today", "gym", "checkin", "week", "seats"]);
  assert.equal(held.seats, null, "no seat read was handed in, so none is held");
  const seated = readOnlyWorld({ today, seats: spyWriters({ read: async () => ({ ok: true, rows: [] }) }) });
  assert.deepEqual(Object.keys(seated.seats), [...READS.seats], "the seat read carries read() and nothing else");
  for (const w of WRITERS) assert.equal(reachableNames(seated).has(w), false, w + " is reachable through the seat read");
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
   sentence; with no workout record the tool refuses in its own words and the card has nothing to draw.
   POLISH 4 (PM, the owner's 7-lift Upper/Lower week): the review is GROUPED. One summary line, the ready lifts each on
   its own line with its Why?, a lift with news of its own on its own line, every other lift named on ONE "Holding
   steady:" line, and the open suggestion as a count; no lift says a per-lift "not raised" sentence. PC-10 is the
   owner's shape, ten lifts last week. */
const WEEK_ROWS = Object.freeze([
  { lift: "a", name: "Chest press", status: "offer", kind: "earn", date: "2026-10-01", loads: [145, 145], current: [140, 140],
    reason: "Chest press: on 2026-10-01 you completed every set at 140 lb on every set. Offer: make 145 lb your working weight." },
  { lift: "b", name: "Row", status: "refused", code: "NATIVE_LOAD_WINDOW_NOT_TOP" },
  { lift: "c", name: "Curl", status: "refused", code: "NATIVE_LOAD_SOMETHING_UNMAPPED" },
  { lift: "d", name: "Squat", status: "held", code: "disputed" },
]);
const weekWorld = (day, extra = {}, rows = WEEK_ROWS) => {
  const windows = [];
  const today = TodayModel.createTodayModel({ today: day });
  return { windows, today, gym: { read: async () => ({ phase: "idle" }), lastRead: () => ({ phase: "idle" }), weekSessions: async (from, to) => { windows.push([from, to]); return { ok: true, done: 3, dates: [] }; } },
    week: { lifts: async () => ({ ok: true, lifts: rows.map((row) => ({ ...row })) }) }, ...extra };
};
const planned = (world) => world.today.plannedDays(world.windows[0][0], world.windows[0][1]).length;
test("PC-7: the weekly review ships traced, Monday reviews the week just ended, and its lifts are grouped", async () => {
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
  assert.deepEqual(monday.windows, [["2026-10-05", "2026-10-11"], ["0000-01-01", "2026-10-04"]],
    "on a Monday the window is the week just ended (polish 5: and the history before it, for the first weeks)");
  const lines = asked.lines;
  assert.deepEqual(lines.map((l) => l.kind), ["heading", "summary", "ready", "news", "steady", "suggestion", "trend"],
    "one summary, the ready lift, the news, one steady line, the suggestion count, the trend; in that order");
  assert.equal(lines[0].text, Intents.WEEK_WORDS.lastWeek);
  /* polish 4: the summary is the workouts and how many lifts are ready, on one line */
  assert.equal(lines[1].text, "Workouts done: 3 of " + monday.today.plannedDays("2026-10-05", "2026-10-11").length + ". 1 lift ready for a new weight.");
  const said = (name) => lines.find((l) => l.text.startsWith(name + ": "));
  assert.equal(said("Chest press").text, "Chest press: " + Intents.WEEK_WORDS.up);
  /* batch 2 (item 4): the offer said plainly behind Why?, its figures the offer's own (the engine's reason is not shown) */
  assert.equal(said("Chest press").why, "You reached the top of your rep range at 140 lb on Oct 1. Make 145 lb your working weight? Nothing changes unless you say yes; it then applies on a later workout.");
  assert.equal(said("Squat").text, "Squat: " + Intents.WEEK_HOLD_WORDS.disputed, "a paused hold keeps its own line");
  assert.equal(said("Squat").why, null);
  /* polish 4: no per-lift line for a lift that simply was not raised; both are named on the one steady line */
  assert.equal(said("Row"), undefined, "no per-lift line for Row");
  assert.equal(said("Curl"), undefined, "no per-lift line for Curl");
  assert.equal(lines.some((l) => /no new weight|not raised/.test(l.text)), false, "no per-lift not-raised sentence");
  assert.equal(lines.find((l) => l.kind === "steady").text, "Holding steady: Row and Curl.");
  assert.equal(lines.find((l) => l.kind === "steady").more, undefined, "two names need no and N more");
  /* polish 4: the open suggestion on Today is one short count, never its sentence */
  const open = monday.today.read().proposal;
  assert.equal(typeof open.title, "string", "the real Today model holds an open suggestion on this day");
  assert.equal(lines.find((l) => l.kind === "suggestion").text, "1 suggestion waiting on Today.");
  assert.equal(lines.filter((l) => /suggestion/i.test(l.text)).length, 1, "one suggestion line");
  assert.equal(lines.some((l) => l.text.includes(open.why) || (l.why || "").includes(open.why)), false,
    "the suggestion's own words stay on its card, in the review and behind no Why?");
  /* Polish batch: the bodyweight paragraph is one short line when the device holds a trend weight (and none without). */
  assert.ok(lines.some((l) => /^Trend weight: \d+(\.\d+)? lb\.$/.test(l.text)), "the trend line is one short line");
  assert.equal(lines.some((l) => /rate is not measured|No reading is stored/.test(l.text)), false, "no trend paragraph");
  assert.equal(asked.answer.includes(WEEK_ROWS[0].reason), false, "the Coach answer leaves the reasons to Why?");
  assert.deepEqual(asked.answer.split("\n"), lines.map((l) => (l.heading ? l.text + "." : l.text)), "one line per item");
  const midweek = weekWorld("2026-10-14");
  const mid = await createPageCoach(midweek).week();
  assert.deepEqual(midweek.windows, [["2026-10-12", "2026-10-14"], ["0000-01-01", "2026-10-11"]], "midweek the window is this week so far");
  assert.equal(mid.ok, true);
  assert.equal(mid.lines[0].text, Intents.WEEK_WORDS.thisWeek);
});

test("PC-8: every review sentence is plain and dash free; the news codes are real native-load.cjs codes, the hold words the two notices, and read-tools groups by exactly those", () => {
  const nl = fs.readFileSync(path.join(REPO, "rebuild/engine/native-load.cjs"), "utf8");
  for (const code of Object.keys(Intents.WEEK_CODE_WORDS)) {
    assert.ok(nl.includes("refuse('" + code.replace(/^NATIVE_LOAD_/, "") + "'"), code + " is a refusal native-load.cjs really raises");
  }
  assert.deepEqual(Object.keys(Intents.WEEK_HOLD_WORDS).sort(), ["conflict", "disputed"], "today-entry.mjs noticesOf's two notice codes");
  /* polish 4: the words and the grouping read the same codes (read-tools.cjs week_review tags each lift's group) */
  const reads = fs.readFileSync(path.join(REPO, "rebuild/coach/read-tools.cjs"), "utf8");
  assert.ok(reads.includes("const WEEK_NEWS_CODES = Object.freeze(" + JSON.stringify(Object.keys(Intents.WEEK_CODE_WORDS)).replace(/,/g, ", ") + ");"),
    "a lift has its own line exactly for the codes that have words");
  assert.ok(reads.includes("const WEEK_NEWS_HOLDS = Object.freeze(" + JSON.stringify(Object.keys(Intents.WEEK_HOLD_WORDS).sort()).replace(/,/g, ", ") + ");"),
    "and for the two held notices");
  assert.equal(Object.hasOwn(Intents, "WEEK_FALLBACK"), false, "no per-lift fallback sentence is left to say");
  const all = [...Object.values(Intents.WEEK_WORDS), ...Object.values(Intents.WEEK_CODE_WORDS), ...Object.values(Intents.WEEK_HOLD_WORDS)];
  for (const words of all) {
    assert.equal(/[\u2013\u2014]/.test(words), false, words + " carries a dash");
    assert.equal(/\d/.test(words), false, words + " carries a figure of its own");
  }
  /* the S14 R4 bodyweight line stays today-entry.mjs's own, word for word; the review names a bodyweight lift as steady */
  const entry = fs.readFileSync(path.join(REPO, "rebuild/m3/w7-preview/today/today-entry.mjs"), "utf8");
  assert.ok(entry.includes('line: "bodyweight sets have no weight to agree to. Your sets are saved."'),
    "the bodyweight line is the approved S14 R4 line, word for word");
});

test("PC-9: with no workout record the review is refused in the tool's own words, and the card has nothing to draw", async () => {
  const bare = createPageCoach({ today: fakeToday() });
  const asked = await bare.ask("week_review");
  assert.equal(asked.shipped, true);
  assert.equal(asked.answered, false);
  assert.equal(/\d/.test(asked.answer), false);
  assert.deepEqual(await bare.week(), { ok: false, lines: null });
  const unread = weekWorld("2026-10-14", { week: null });
  const lines = (await createPageCoach(unread).week()).lines;
  assert.equal(lines[1].text, "Workouts done: 3 of " + unread.today.plannedDays("2026-10-12", "2026-10-18").length + ". " + Intents.WEEK_WORDS.liftsUnknown,
    "with no lift read the summary says the lifts could not be checked");
  /* Polish batch: with no trend weight on the device the review has no bodyweight line at all. */
  const unweighed = weekWorld("2026-10-14");
  const real = unweighed.today;
  unweighed.today = Object.assign(Object.create(real), { stateFromOps: () => ({ ...real.stateFromOps(), trend: null }) });
  const quiet = (await createPageCoach(unweighed).week()).lines;
  assert.ok(quiet.length > 2, "the review is still drawn");
  assert.equal(quiet.some((l) => /trend|weight on this device|reading/i.test(l.text)), false, "no bodyweight line without a reading");
});

/* PC-10 (polish 4, the owner's shape): a 7-lift Upper/Lower week, ten lifts last week. The steady line names the first
   four and "and 6 more"; every name is in its full form; the 6, the ready count and the suggestion count are each a
   tool result of the turn (without the counts the review tags, the same answer is refused); five steady lifts are all
   named; and the summary says how many lifts are ready, that all held steady, or that none is ready when one has news. */
const OWNER_NAMES = ["Lateral machine", "Press", "Machine fly", "Pulldown", "Leg press", "Leg curl", "Calf raise",
  "Hip thrust", "Leg extension", "Row"];
const steadyRows = (names) => names.map((name, i) => ({ lift: "s" + i, name, status: "refused",
  code: i % 2 ? "NATIVE_LOAD_SOMETHING_UNMAPPED" : "NATIVE_LOAD_WINDOW_NOT_TOP" }));
test("PC-10: the owner's ten lifts make one steady line, its counts traced, and the summary is true in every case", async () => {
  const Kernel = require("../tool-kernel.cjs");
  const world = weekWorld("2026-10-12", {}, [WEEK_ROWS[0], ...steadyRows(OWNER_NAMES)]);
  const asked = await createPageCoach(world).ask("week_review");
  assert.equal(asked.shipped, true);
  assert.deepEqual(asked.untraceable, []);
  const lines = asked.lines;
  assert.deepEqual(lines.map((l) => l.kind), ["heading", "summary", "ready", "steady", "suggestion", "trend"]);
  assert.equal(lines[1].text, "Workouts done: 3 of " + planned(world) + ". 1 lift ready for a new weight.");
  const steady = lines.find((l) => l.kind === "steady");
  assert.equal(steady.text, "Holding steady: Lateral machine, Press, Machine fly, Pulldown and 6 more.", "polish 5: no comma before and 6 more");
  assert.equal(steady.short, "Holding steady: Lateral machine, Press, Machine fly, Pulldown", "polish 5: no comma left hanging");
  assert.equal(steady.more, "and 6 more");
  assert.equal(steady.full, "Holding steady: " + OWNER_NAMES.slice(0, -1).join(", ") + " and Row.");
  assert.equal(lines.filter((l) => OWNER_NAMES.some((name) => l.text.startsWith(name + ": "))).length, 0, "no per-lift steady line");
  assert.equal(asked.answer.split("\n").length, 6, "the Coach answer is six short lines, not one per lift");
  /* the counts are tool results: the same answer over the turn's results without the review's counts is refused */
  const stripped = asked.results.map((r) => (r.tool === "week_review" ? { ...r, values: { ...r.values, counts: null } } : r));
  assert.deepEqual(Kernel.untraceable(asked.answer, stripped, asked.turn_id).sort(), ["1", "1", "6"].sort(),
    "the ready count, the 6 and the suggestion count are each licensed only by the counts week_review tags");
  /* five steady lifts are all named; six name four and "and 2 more" */
  const five = (await createPageCoach(weekWorld("2026-10-12", {}, steadyRows(OWNER_NAMES.slice(0, 5)))).week()).lines;
  assert.equal(five.find((l) => l.kind === "steady").text, "Holding steady: Lateral machine, Press, Machine fly, Pulldown and Leg press.");
  assert.equal(five[1].text, "Workouts done: 3 of " + planned(world) + ". " + Intents.WEEK_WORDS.allSteady, "none ready, none with news: all held steady");
  const six = (await createPageCoach(weekWorld("2026-10-12", {}, steadyRows(OWNER_NAMES.slice(0, 6)))).week()).lines;
  assert.equal(six.find((l) => l.kind === "steady").text, "Holding steady: Lateral machine, Press, Machine fly, Pulldown and 2 more.");
  /* two ready lifts; and a lift with news but none ready is not "all held steady" */
  const two = (await createPageCoach(weekWorld("2026-10-12", {}, [WEEK_ROWS[0], { ...WEEK_ROWS[0], lift: "e", name: "Pulldown" }])).week()).lines;
  assert.equal(two[1].text, "Workouts done: 3 of " + planned(world) + ". 2 lifts ready for a new weight.");
  const news = (await createPageCoach(weekWorld("2026-10-12", {}, [WEEK_ROWS[3], { lift: "f", name: "Press", status: "refused", code: "NATIVE_LOAD_DEBUT_LANDED" }])).week()).lines;
  assert.equal(news[1].text, "Workouts done: 3 of " + planned(world) + ". " + Intents.WEEK_WORDS.noneReady);
  assert.equal(news.find((l) => l.text.startsWith("Press: ")).text, "Press: " + Intents.WEEK_CODE_WORDS.NATIVE_LOAD_DEBUT_LANDED);
  assert.equal(news.some((l) => l.kind === "steady"), false);
  const none = (await createPageCoach(weekWorld("2026-10-12", {}, [])).week()).lines;
  assert.equal(none[1].text, "Workouts done: 3 of " + planned(world) + ". " + Intents.WEEK_WORDS.noLifts);
});

/* PC-11 (polish 5, item 6): the lifts in PLAN ORDER, today's day first (today's session in the engine's order, then the
   rest in the order the plan holds them), and the first weeks: with fewer than two workouts before the week reviewed,
   no lift is ready YET (never "All lifts held steady."), whatever the lifts say. */
test("PC-11: the lifts are said in plan order, today's first, and the first weeks say not ready yet", async () => {
  const base = weekWorld("2026-10-12");
  const session = base.today.sessionPlan();
  const plan = base.today.stateFromOps().exercises.map((ex) => ex.id);
  assert.equal(session.available, true, "a session is planned on 2026-10-12");
  const todays = session.exercises.map((ex) => ex.id);
  const others = plan.filter((id) => !todays.includes(id));
  assert(todays.length >= 2 && others.length >= 1, "the plan has lifts today and on other days");
  const nameOf = (id) => "Lift " + String.fromCharCode(65 + plan.indexOf(id));
  const rows = [...others.slice().reverse(), ...todays.slice().reverse()].slice(0, 5)
    .map((id) => ({ lift: id, name: nameOf(id), status: "refused", code: "NATIVE_LOAD_WINDOW_NOT_TOP" }));
  const shown = rows.map((row) => row.lift);
  const want = [...todays, ...others].filter((id) => shown.includes(id)).map(nameOf);
  const asked = await createPageCoach(weekWorld("2026-10-12", {}, rows)).ask("week_review");
  assert.equal(asked.shipped, true);
  assert.deepEqual(asked.untraceable, []);
  const steady = asked.lines.find((l) => l.kind === "steady");
  const list = want.length < 2 ? want.join("") : want.slice(0, -1).join(", ") + " and " + want[want.length - 1];
  assert.equal(steady.text, "Holding steady: " + list + ".", "today's lifts first, then the plan's order");
  /* the first weeks */
  const early = (rowsOf) => {
    const world = weekWorld("2026-10-12", {}, rowsOf);
    world.gym = { ...world.gym, weekSessions: async (from, to) => { world.windows.push([from, to]); return { ok: true, done: from === "0000-01-01" ? 1 : 3, dates: [] }; } };
    return world;
  };
  for (const rowsOf of [rows, [WEEK_ROWS[3]]]) {
    const got = await createPageCoach(early(rowsOf)).ask("week_review");
    assert.equal(got.shipped, true);
    assert.match(got.lines[1].text, /^Workouts done: 3 of \d+\. No lift ready for a new weight yet\.$/, "not ready YET");
  }
  const ready = await createPageCoach(early([WEEK_ROWS[0]])).ask("week_review");
  assert.match(ready.lines[1].text, /1 lift ready for a new weight\.$/, "a ready lift is still said as ready");
  const settled = await createPageCoach(weekWorld("2026-10-12", {}, rows)).ask("week_review");
  assert.match(settled.lines[1].text, /All lifts held steady\.$/, "with history before the week, held steady is true");
});

/* PC-12 (NUTRI 1, owner ruling 2026-10-13, "Labelled estimate"): while the engine's band is gated it may be the engine's
   own labelled estimate (energy.cjs calorieTarget, from "mass-estimate"); "What am I hitting today?" then says it as an
   estimate and says what will make it measured, in the counts today-model.cjs calorieGateOf reads off the engine's own
   gate inputs. Every number is a tool result of the turn: the counts are licensed only by the tags today_plan adds. A
   measured band is said as before. Red first: on aa81776 the estimate is said as "Eat between ...", unmarked. */
test("PC-12: What am I hitting today? says the engine's labelled estimate as one, and what will measure it, every number traced", async () => {
  const Kernel = require("../tool-kernel.cjs");
  const DAY = TodayModel.SYNTHETIC_DAY;
  const base = TodayModel.createBasisState(DAY);
  const days = Object.keys(base.dailyLogs).sort();
  const world = (keepFood, keepReads, trend) => {
    const state = structuredClone(base);
    for (const d of days.slice(0, days.length - keepFood)) delete state.dailyLogs[d];
    state.reads = state.reads.slice(-keepReads);
    if (trend) state.trend = trend;   /* a heavier invented weight gives the estimate a band with width */
    return TodayModel.createTodayModel({ today: DAY, basisState: state });
  };
  for (const [keepFood, keepReads, gate, trend] of [[5, 9, "Log food for 3 more days and weigh in 1 more time to measure yours."],
    [7, 28, "Log food for 1 more day to measure yours."], [0, 6, "Log food for 8 more days and weigh in 4 more times to measure yours."],
    [5, 9, "Log food for 3 more days and weigh in 1 more time to measure yours.", 230]]) {
    const today = world(keepFood, keepReads, trend);
    const cal = today.read().calorieTarget;
    assert.deepEqual([cal.gated, cal.from], [true, "mass-estimate"], "fixture: the engine's labelled estimate");
    const asked = await createPageCoach({ today }).ask("today_plan");
    assert.equal(asked.shipped, true, asked.answer);
    assert.deepEqual(asked.untraceable, [], "every number is a tool result of the turn");
    const lines = asked.answer.split("\n");
    /* both ends one figure (the engine's floor binding both): "about" (PM ruling on N1); else the band */
    const said = cal.lo === cal.hi ? "Estimate: eat about " + cal.lo + " calories." : "Estimate: eat between " + cal.lo + " and " + cal.hi + " calories.";
    assert.equal(trend ? cal.lo !== cal.hi : cal.lo === cal.hi, true, "fixture: both forms are asked");
    assert(lines.includes(said), "the estimate, marked: " + asked.answer);
    assert(lines.includes(gate), "what will measure it: " + asked.answer);
    assert.equal(lines.some((line) => line.startsWith("Eat between ")), false, "never said as the measured band");
    /* the counts are tool results: without today_plan's two count tags they are refused */
    const stripped = asked.results.map((r) => (r.tool === "today_plan"
      ? { ...r, values: { ...r.values, foodDaysLeft: null, weighInsLeft: null } } : r));
    const counts = gate.match(/\d+/g);
    assert.deepEqual(Kernel.untraceable(asked.answer, stripped, asked.turn_id).filter((t) => counts.includes(t)).sort(), counts.slice().sort(),
      "each count is licensed only by its own tag");
  }
  /* measured: said exactly as before, with no estimate and no count */
  const measured = TodayModel.createTodayModel({ today: DAY });
  const mcal = measured.read().calorieTarget;
  assert.equal(mcal.gated, false, "fixture: the fixture athlete's band is measured");
  const plain = await createPageCoach({ today: measured }).ask("today_plan");
  assert.equal(plain.shipped, true);
  assert(plain.answer.split("\n").includes("Eat between " + mcal.lo + " and " + mcal.hi + " calories."), plain.answer);
  assert.doesNotMatch(plain.answer, /Estimate|to measure yours/);
});
