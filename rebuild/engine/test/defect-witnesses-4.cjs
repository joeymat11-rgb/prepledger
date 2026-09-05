"use strict";

// Preserved volume-reader defects, not desired-behavior acceptance laws.
// All states are invented. The full extracted engine executes without dependency
// substitutions, a parser, frozen-source imports, private fixtures or migration.
// Each later correction requires an owner ruling and a red-first replacement law.
const assert = require("node:assert/strict");
const { createEngine } = require("../index.cjs");
const clock = () => ({ today: () => "2026-09-03", hour: () => 12, dow: () => 4,
  nowISO: () => "2026-09-03T16:00:00.000Z", nowMs: () => 1788451200000,
  tz: "America/New_York" });
const engine = () => createEngine({ clock: clock(),
  ids: { fresh: () => "synthetic-id" } }).__test;
const state = () => ({ trend: 180,
  model: { lean: 150, anchorISO: "2026-01-01", drip: 0, src: "DEXA" },
  weekly: [], reads: [{ d: "2026-09-03", w: 180 }], dailyLogs: {},
  sleep: { nights: ["2026-08-31", "2026-09-01", "2026-09-02"].map(d => ({ d, h: 8 })),
    cleanH: 7.5, needed: 3 },
  sessionLog: {}, blackout: { until: "2025-01-01" }, learned: { anchors: [] },
  events: [], dayCtx: {}, plan: {}, targets: {}, exercises: [], queue: [] });
const exercise = (overrides = {}) => ({ id: "synthetic-press", n: "Synthetic press",
  w: 100, sets: 3, hi: 12, lo: 8, setup: "Invented setup", day: "U", mg: "chest",
  ...overrides });
const session = (id, reps) => ({ entries: [{ id, w: 100, reps,
  rirSets: reps.map(() => 0) }] });
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

witness("D28 fixed July week ignores a later training-frequency change (app.jsx:8676,656-666)", () => {
  const T = engine(), s = state();
  s.exercises = [exercise()];
  s.split = [{ from: "2026-08-01", map: { 1: "U" } }];
  freeze(s);
  const currentWeek = ["2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03",
    "2026-09-04", "2026-09-05", "2026-09-06"];
  const scheduled = currentWeek.filter(d => T.dayType(d, s) === "U").length;
  assert.equal(scheduled, 1);
  assert.equal(scheduled * s.exercises[0].sets, 3);
  assert.equal(T.programmeVolume(s).find(m => m.mg === "chest").sets, 6);
});

witness("D29 logged front-delt volume loses press indirect credit (app.jsx:8631,8693)", () => {
  const T = engine(), s = state();
  s.exercises = [exercise({ id: "press" }),
    exercise({ id: "front", n: "Synthetic front raise", mg: "delts", head: "delts_front", sets: 2 })];
  for (const d of ["2026-08-31", "2026-09-03"]) {
    s.sessionLog[d] = { entries: [...session("press", [10, 10, 10]).entries,
      ...session("front", [10, 10]).entries] };
  }
  freeze(s);
  const planned = T.programmeVolume(s), logged = T.muscleVolume(s);
  assert.equal(planned.find(m => m.mg === "chest").sets, 6);
  assert.equal(logged.find(m => m.mg === "chest").n7, 6);
  assert.equal(planned.find(m => m.mg === "delts_front").sets, 7);
  assert.equal(logged.find(m => m.mg === "delts_front").n7, 4);
  assert.equal(logged.some(m => m.mg === "delts"), false);
});

witness("D30 set-one trend pools sessions across a technique fork (app.jsx:8887-8893,3187-3191)", () => {
  const T = engine(), s = state();
  s.exercises = [exercise({ forks: [{ from: "2026-09-01", kind: "technique", prevN: "Other technique" }] })];
  for (const [i, d] of ["2026-08-10", "2026-08-17", "2026-08-24", "2026-09-03"].entries()) {
    s.sessionLog[d] = session("synthetic-press", [10 + i, 10 + i]);
  }
  freeze(s);
  assert.equal(T.sameEra(T.forksOf(s, "synthetic-press"), "2026-08-24", "2026-09-03"), false);
  assert.equal(T.liftTrend(s, "synthetic-press"), null);
  const result = T.setOneRead(s, "synthetic-press");
  assert.equal(result.status, "LIVE");
  assert.equal(result.n, 4);
  assert.equal(result.from, "2026-08-10");
  assert.ok(result.lo > 0);
});

witness("D31 volume tolerance is inferred entirely from pre-change sessions (app.jsx:8917-8932,3213,3237-3243)", () => {
  const T = engine(), s = state();
  s.exercises = [exercise()];
  s.events = [{ d: "2026-09-01", t: "Synthetic event", estimated: false }];
  for (const [i, d] of ["2026-08-10", "2026-08-14", "2026-08-18", "2026-08-22"].entries()) {
    s.sessionLog[d] = session("synthetic-press", [10 + i, 10 + i]);
  }
  s.sessionLog["2026-09-01"] = session("synthetic-press", [14, 14, 14]);
  freeze(s);
  assert.equal(T.dayWeather(s, "2026-09-01").hardSession, true);
  const result = T.volumeConversion(s, "synthetic-press");
  assert.equal(result.status, "LIVE");
  assert.equal(result.tier, "TOLERATED");
  assert.equal(result.changedAt, "2026-09-01");
  assert.equal(result.k, 3);
  assert.equal(result.trend.n, 4);
  assert.equal(result.trend.k, 2);
  assert.ok(result.trend.to < result.changedAt);
  assert.ok(result.trend.pts.every(point => point.d < result.changedAt));
});

witness("D32 replication claims comparable blocks from different technique eras (app.jsx:8971-8979,1798-1813)", () => {
  const T = engine(), s = state();
  s.exercises = [exercise({ forks: [{ from: "2026-04-01", kind: "technique", prevN: "Other technique" }] })];
  const oldDates = ["2026-01-01", "2026-01-20", "2026-02-10", "2026-02-28", "2026-03-15"];
  for (const [i, d] of oldDates.entries()) s.sessionLog[d] = session("synthetic-press", [8 + i, 8 + i]);
  for (const [i, d] of ["2026-07-01", "2026-07-15", "2026-08-01", "2026-08-15", "2026-09-03"].entries()) {
    s.sessionLog[d] = session("synthetic-press", [8 + i, 8 + i, 8 + i]);
  }
  freeze(s);
  assert.ok(oldDates.every(d => !T.sameEra(T.forksOf(s, "synthetic-press"), d, "2026-09-03")));
  const result = T.volumeConversion(s, "synthetic-press");
  assert.equal(result.trend.from, "2026-07-01");
  assert.equal(result.delivered, true);
  assert.equal(result.tier, "REPLICATED");
  assert.match(result.why, /comparable stable blocks/);
  // The current-era log alone contains no observed set-count change at all.
  const currentEraOnly = structuredClone(s);
  for (const d of oldDates) delete currentEraOnly.sessionLog[d];
  assert.equal(T.volumeConversion(freeze(currentEraOnly), "synthetic-press").status, "IDLE");
});

console.log("DEFECT WITNESSES 4: " + count + "/5 reproduced; behavior intentionally unchanged");
