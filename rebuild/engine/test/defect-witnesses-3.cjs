"use strict";

// Diagnostic observations for REPORT-M2-3-ASTRA.md, not desired-behavior laws.
// Every state below is invented. These assertions preserve the frozen defects;
// a later owner ruling must supply each red-first replacement law.
const assert = require("node:assert/strict");
const { createEngine } = require("../index.cjs");
const makeClock = () => ({ today: () => "2026-09-03", hour: () => 12,
  dow: () => 4, nowISO: () => "2026-09-03T16:00:00.000Z",
  nowMs: () => 1788451200000, tz: "America/New_York" });
const engine = (clock = makeClock()) => createEngine({ clock,
  ids: { fresh: () => "synthetic-id" } }).__test;
const state = () => ({ trend: 180,
  model: { lean: 150, anchorISO: "2026-08-01", drip: 0, src: "DEXA" },
  weekly: [], reads: [{ d: "2026-09-03", w: 180 }], dailyLogs: {},
  sleep: { nights: ["2026-08-31", "2026-09-01", "2026-09-02"].map((d) => ({ d, h: 8 })),
    cleanH: 7.5, needed: 3 },
  sessionLog: {}, blackout: { until: "2026-07-27" }, learned: { anchors: [] },
  events: [], dayCtx: {}, plan: {}, targets: {}, exercises: [], queue: [] });
function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
let count = 0;
function witness(name, run) { run(); count++; console.log("REPRODUCED " + name); }
assert.equal(process.env.TZ, "America/New_York", "Set TZ=America/New_York for these calendar witnesses");

witness("D23 missing sleep input hides a scheduled hack workout as REST DAY (app.jsx:1474,15484,15491)", () => {
  const T = engine(), s = state();
  s.exercises = [{ id: "hack", n: "Synthetic squat", day: "L", w: null,
    sets: 3, hi: 12, lo: 8 }];
  s.queue = [{ id: "q_test", exId: "hack", kind: "debut", state: "READY",
    done: false, newW: 100 }];
  s.split = [{ from: "2026-08-01", map: { 4: "L" } }];
  freeze(s);
  assert.equal(T.dayType("2026-09-03", s), "L");
  assert.equal(T.genSession(s, "2026-09-03", { last: null }).name, "LOWER");
  assert.throws(() => T.genSession(s, "2026-09-03"), TypeError);
  // Existing optional presentation inputs isolate the workout branch. Its real
  // dayType, genSession and pickStructural bodies are not substituted.
  const model = T.nowModel(s, {
    face: { word: "CALIBRATING", glyph: "x", cause: "Synthetic read" },
    fix: { state: "good" }, prog: { state: "unknown", why: "only 0 lifts" }
  });
  assert.equal(model.workout.title, "REST DAY");
  assert.equal(model.workout.today, false);
  assert.equal(model.workout.iso, undefined);
});

witness("D24 a partial yesterday row disappears from what is owed (app.jsx:8454,8460-8461,6875-6876)", () => {
  const T = engine(), s = state();
  s.dailyLogs = { "2026-09-01": { cal: 2000 }, "2026-09-02": { steps: 10000 } };
  freeze(s);
  const focus = T.nowFocus(s, 12);
  assert.equal(focus.clear, true);
  assert.equal(focus.owed.some((item) => item.k === "yesterday"), false);
  assert.ok(T.owedLedger(s, 12).some((item) => item.k === "day" && item.d === "2026-09-02"));
  // Removing only that partial row makes the same yesterday obligation visible.
  const noPartial = state();
  noPartial.dailyLogs = { "2026-09-01": { cal: 2000 } };
  assert.ok(T.nowFocus(freeze(noPartial), 12).owed.some((item) => item.k === "yesterday"));
});

witness("D25 zero protein on the sole logged day is GOOD 0/1 (app.jsx:8507-8512)", () => {
  const T = engine(), s = state();
  s.dailyLogs = { "2026-09-03": { cal: 2000, pro: 0, steps: 10000 } };
  freeze(s);
  assert.equal(T.proteinTarget(s).lo, 170);
  assert.equal(T.fiveLevers(s).protein.state, "good");
  assert.equal(T.fiveLevers(s).protein.detail, "0/1");
});

witness("D26 unchanged state keeps yesterday's Today model after the clock advances (app.jsx:15425,15535-15536,5158-5163)", () => {
  const clock = makeClock(), T = engine(clock), s = freeze(state());
  const first = T.nowModel(s);
  clock.today = () => "2026-09-04";
  clock.dow = () => 5;
  clock.nowISO = () => "2026-09-04T16:00:00.000Z";
  clock.nowMs = () => 1788537600000;
  const cached = T.nowModel(s), fresh = T.nowModel(s, {});
  assert.equal(cached, first);
  assert.equal(cached.tISO, "2026-09-03");
  assert.equal(fresh.tISO, "2026-09-04");
});

witness("D27 committed maintenance still receives the long-cut diet-break instruction (app.jsx:8564-8569,5579-5581,14459-14461)", () => {
  const T = engine(), s = state();
  s.plan.phase = "maintenance";
  s.weekly = [{ wk: "2026-08-20", trend: 180 }, { wk: "2026-08-27", trend: 180 },
    { wk: "2026-09-03", trend: 180 }];
  freeze(s);
  assert.equal(T.phaseArc(s).key, "maintenance");
  assert.equal(T.currentRate(s).measured, true);
  assert.equal(T.currentRate(s).scale, 0);
  assert.equal(T.weekDay().wk, 13);
  const fix = T.theOneFix(s);
  assert.equal(fix.rung, "break");
  assert.equal(fix.title, "A diet break has earned its place");
  assert.ok(fix.body.startsWith("You've held the deficit for weeks"));
});

console.log("DEFECT WITNESSES 3: " + count + "/5 reproduced; behavior intentionally unchanged");
