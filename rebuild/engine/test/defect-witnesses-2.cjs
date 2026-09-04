"use strict";

// Diagnostic observations for REPORT-M2-2-ASTRA.md, not desired-behavior laws.
// All data below is invented. These assertions preserve the frozen defects;
// a later owner ruling must supply each red-first replacement law.
const assert = require("node:assert/strict");
const { createEngine } = require("../index.cjs");
const clock = { today: () => "2026-09-03", hour: () => 12,
  dow: () => 4, nowISO: () => "2026-09-03T16:00:00.000Z",
  nowMs: () => 1788451200000, tz: "America/New_York" };
const engine = () => createEngine({ clock, ids: { fresh: () => "synthetic-id" } }).__test;
const state = () => ({ trend: 180,
  model: { lean: 150, anchorISO: "2026-08-01", drip: 0, src: "DEXA" },
  weekly: [], reads: [], dailyLogs: {}, sleep: { nights: [] }, sessionLog: {},
  blackout: { until: "2026-07-27" }, learned: { anchors: [] }, events: [],
  dayCtx: {}, plan: {}, targets: {}, exercises: [] });
let count = 0;
function witness(name, run) { run(); count++; console.log("REPRODUCED " + name); }
assert.equal(process.env.TZ, "America/New_York", "Set TZ=America/New_York for these calendar witnesses");

witness("D11 gaining rate reverses TDEE endpoints and promotes zero step drift (app.jsx:3815-3816,3840,3844)", () => {
  const T = engine(), s = state();
  s.model.src = "eye";
  for (let i = 0; i < 10; i++) {
    const d = T.isoOf(new Date(T.mk("2026-08-25").getTime() + i * T.DAY));
    s.reads.push({ d, w: 180 + i * 0.1 });
    s.dailyLogs[d] = { cal: 2000, steps: 10000 };
  }
  const td = T.observedTDEE(s);
  assert.equal(td.rate, -0.7);
  assert.equal(td.tdee, 1620);
  assert.equal(td.lo, 2000);
  assert.equal(td.hi, 1620);
  assert.ok(td.lo > td.hi);
  assert.equal(td.stepDelta, 0);
  assert.equal(td.stepPromoted, true);
});

witness("D12 step efficacy scales an already-per-thousand slope again (app.jsx:6962,7176)", () => {
  const T = engine(), s = state();
  // Test-only data substitution: this instance's seed ROLLUPS is emptied so the
  // five invented weeks are the entire athlete history. liveRollups and every
  // downstream function still run their copied bodies; no function is stubbed.
  T.ROLLUPS.length = 0;
  ["2026-07-29", "2026-08-05", "2026-08-12", "2026-08-19", "2026-08-26"].forEach((d, i) => {
    s.reads.push({ d, w: [180, 179.9, 179.7, 179.4, 179][i] });
    s.dailyLogs[d] = { cal: 2000, pro: 180, steps: 10000 + i * 1000 };
  });
  assert.deepEqual(T.liveRollups(s).map((w) => w.avgSteps), [14, 13, 12, 11, 10]);
  const step = T.stepEfficacy(s);
  assert.equal(step.slopePer1k, 100);
  assert.equal(step.boundPer1k, 0.065);
  assert.equal(step.resolved, false);
});

witness("D13 energy-density identity cache survives changed state (app.jsx:5158-5163,4798,4803)", () => {
  const T = engine(), s = state();
  const before = T.energyDensity(s);
  s.trend = 160;
  const stale = T.energyDensity(s), fresh = T.energyDensityUncached(s);
  assert.equal(stale, before);
  assert.equal(stale.perLb, 3859);
  assert.equal(fresh.perLb, 3499);
});

witness("D14 currentRate bypasses the missing-drip default and returns NaN (app.jsx:3485,3501,2835)", () => {
  const T = engine(), s = state();
  s.model = { lean: 150, anchorISO: "2026-08-01", src: "DEXA" };
  s.weekly = [{ wk: "2026-08-01", trend: 180 }, { wk: "2026-08-08", trend: 179 }, { wk: "2026-08-15", trend: 178 }];
  const rate = T.currentRate(s);
  assert.equal(T.dripOf(s), 0);
  assert.equal(rate.scale, 1);
  assert.equal(Number.isNaN(rate.fat), true);
});

witness("D15 food-row count inflates session frequency across a sparse interval (app.jsx:4435-4437)", () => {
  const T = engine(), s = state();
  ["2026-08-14", "2026-08-17", "2026-08-20", "2026-08-23", "2026-08-26", "2026-08-29", "2026-09-01", "2026-09-03"].forEach((d) => {
    s.dailyLogs[d] = { cal: 2200, steps: 10000 };
    s.sessionLog[d] = { entries: [{ id: "example", reps: [8], w: 50 }] };
  });
  const ea = T.energyAvailability(s);
  assert.equal(ea.days, 8);
  assert.equal(Object.keys(s.sessionLog).length, 8);
  assert.equal(ea.sessPerWk, 7);
  assert.equal(ea.trainKcal, 300);
});

witness("D16 a much later read is graded as a seven-day forecast hit (app.jsx:5483,5488,5491-5495)", () => {
  const T = engine();
  const r = T.trackRecord({ reads: [{ d: "2026-09-01", w: 165, pt: 165 }],
    forecasts: [{ d: "2026-08-01", pred7: 165 }], adjustments: [] });
  assert.equal(r.graded, 1);
  assert.equal(r.rows[0].hit, true);
  assert.ok(r.calibration.includes("7-day call"));
});

witness("D17 an undone adjustment is reported as applied (app.jsx:5502-5503)", () => {
  const T = engine();
  const r = T.trackRecord({ reads: [], forecasts: [],
    adjustments: [{ d: "2026-09-03", rid: "ap_test", title: "Synthetic adjustment", undone: true }] });
  assert.equal(r.decisions.length, 1);
  assert.equal(r.decisions[0].applied, true);
});

witness("D18 an eighty-row feed prefix hides a current-week volume receipt (app.jsx:8827-8830)", () => {
  const T = engine();
  const volume = { d: "2026-09-02", t: "VOLUME +1 — CHEST via Press" };
  const notes = Array.from({ length: 80 }, (_, i) => ({ d: "2026-09-03", t: "Synthetic note " + i }));
  const ex = { id: "p", n: "Press", mg: "chest" };
  const first = T.structuralMovesThisWeek({ exercises: [ex], feed: [volume, ...notes] });
  const last = T.structuralMovesThisWeek({ exercises: [ex], feed: [...notes, volume] });
  assert.equal(first.sets.length, 1);
  assert.equal(last.sets.length, 0);
});

witness("D19 break-end wording resumes the cut while the break is still active (app.jsx:5559,5594,5605)", () => {
  const T = engine();
  const s = { plan: { brk: { start: "2026-09-01", end: "2026-09-07" } } };
  // The existing phase-reader dependency seam fixes its as-of date and supplies
  // an empty supervisor result; the diagnostic isolates break interval wording.
  const b = T.dietBreakState(s, { today: "2026-09-07" });
  const p = T.phaseArc(s, { today: "2026-09-07", brk: b, sup: {} });
  assert.equal(b.status, "active");
  assert.equal(b.daysSince, 6);
  assert.equal(p.key, "break");
  assert.ok(p.line.includes("day 6 of 7, 0 to go"));
  assert.equal(p.next.when, "resumes " + T.fmtShort("2026-09-07"));
});

witness("D20 forecast identity cache retains an earlier rate (app.jsx:5202,5205,5157-5166)", () => {
  // Test-only dependency table: start from actual extracted constants/helpers,
  // then supply deterministic rate, rate-band, TDEE, body-composition, step and
  // energy-density reads. These six substitutions isolate forecast's caching,
  // not those formulas. A fresh actual policy factory creates its own cache and
  // runs the unchanged signal/forecast/digital-twin bodies against this table.
  const E = { ...engine() };
  E.currentRate = (s) => ({ measured: true, scale: s.rate, ci: 0.2,
    lo: s.rate - 0.2, hi: s.rate + 0.2, sigma: 0.1, n: 20 });
  E.cutRateBand = () => ({ redlinePct: 1 });
  E.observedTDEE = () => ({ tdee: 2500 });
  E.bfEst = () => ({ lean: 130 });
  E.stepTarget = () => ({ gated: false, recentAvg: 8000, kcalPer1k: 20 });
  E.energyDensity = () => ({ perLb: 3500 });
  Object.assign(E, require("../policy.cjs")(E, { clock, ids: {} }));
  const s = { rate: 1.4, trend: 180, reads: [] };
  const first = E.forecast(s);
  s.rate = 0.5;
  const stale = E.forecast(s), fresh = E.forecast(s, {});
  assert.equal(first.ok, true);
  assert.equal(first.rate, 1.4);
  assert.equal(stale, first);
  assert.equal(fresh.rate, 0.5);
});

witness("D21 fall-back sleepInfo skips the same-date night (app.jsx:14455)", () => {
  const T = createEngine({ clock: { ...clock, today: () => "2026-11-01" } }).__test;
  const s = { sleep: { nights: [{ d: "2026-11-01", h: 1 }], cleanH: 7.5, needed: 3 } };
  assert.equal(T.sleepInfo(s).clean, true);
  assert.equal(T.cleanAtDate(s, "2026-11-02"), false);
});

console.log("DEFECT WITNESSES 2: " + count + "/11 reproduced; behavior intentionally unchanged");
