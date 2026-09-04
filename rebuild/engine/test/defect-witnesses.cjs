"use strict";

// Diagnostic witnesses for REPORT-M2-1-ASTRA.md, not desired-behavior laws.
// These observations intentionally preserve defects/assumptions in the frozen
// copy. A later owner ruling must supply the red-first replacement law.
const assert = require("node:assert/strict");
const { createEngine } = require("../index.cjs");
const T = createEngine({ clock: { today: () => "2026-09-03" } }).__test;
const lift = (extra = {}) => ({ id: "press", n: "Press", w: 100, inc: 5,
  sets: 2, hi: 10, last: [8, 7], setup: "known", day: "U", mg: "chest", ...extra });
let count = 0;
function witness(id, run) { run(); count++; console.log("REPRODUCED " + id); }

witness("D1 first targets bypass the current set count (app.jsx:1123)", () => {
  assert.deepEqual(T.targetsFor(lift({ sets: 3, last: null, first: [8, 7] }),
    { sessionLog: {} }), [8, 7]);
});
witness("D2 negative sets pass validity and unquarantine, then throw (app.jsx:1858,1901)", () => {
  const ex = lift({ sets: -1, last: null, quarantined: "invalid:fixture" });
  const s = { exercises: [ex], feed: [], sessionLog: {} };
  assert.equal(T._bornValid(ex), true);
  T.canonicalizePlan(s);
  assert.equal(!!ex.quarantined, false);
  assert.throws(() => T.targetsFor(ex, s), RangeError);
});
witness("D3 a longer lift name claims another lift's volume receipt (app.jsx:1077)", () => {
  assert.deepEqual(T._volDeltas(lift(), { feed: [{ d: "2026-09-02",
    t: "VOLUME +1 — CHEST via Press incline" }] }), [["2026-09-02", 1]]);
});
witness("D4 a longer lift name clears another lift's sightings (app.jsx:2232)", () => {
  const ex = lift();
  const s = { exercises: [ex], feed: [], sessionLog: {
    "2026-08-30": { entries: [{ id: "press", w: 100, reps: [10, 9] }] },
    "2026-09-01": { entries: [{ id: "press", w: 100, reps: [10, 9] }] },
  } };
  assert.deepEqual(T.deriveSighting(s, ex), { topAt: 100, topRun: 2 });
  s.feed = [{ d: "2026-09-01", t: "PRESS INCLINE 100 EARNED" }];
  assert.deepEqual(T.deriveSighting(s, ex), { topAt: null, topRun: 0 });
});
witness("D5 duplicate-only rungs become a one-rung maximum (app.jsx:1260,1323)", () => {
  assert.deepEqual(T.parseRungs("100,100"), [100]);
  assert.deepEqual(T.loadRungs(lift({ steps: [100, 100] })), [100]);
  assert.equal(T.maxedOut(lift({ steps: [100, 100] })), true);
});
witness("D6 missing load is converted into deload 5 (app.jsx:1311)", () => {
  assert.equal(T.nextLoad({ w: null, inc: 5 }), null);
  assert.equal(T.deloadLoad({ w: null, inc: 5 }), 5);
});
witness("D7 future sessions enter an earlier anchor and trend (app.jsx:983,3188)", () => {
  const s = { exercises: [lift()], sessionLog: {}, sleep: { nights: [] } };
  for (const [i, d] of ["2026-09-10", "2026-09-11", "2026-09-12", "2026-09-13"].entries()) {
    s.sessionLog[d] = { entries: [{ id: "press", w: 100, reps: [8 + i, 7 + i] }] };
  }
  assert.deepEqual(T.progressAnchor(lift(), s), [11, 10]);
  const trend = T.liftTrend(s, "press", { asOf: "2026-09-03" });
  assert.equal(trend.n, 4);
  assert.equal(trend.from, "2026-09-10");
  assert.equal(trend.to, "2026-09-13");
});
witness("D8 an eight-month-old night controls current sleep context (app.jsx:6997)", () => {
  assert.equal(T.cleanAtDate({ sleep: { nights: [{ d: "2026-01-01", h: 5 }] } }, "2026-09-03"), false);
});
witness("D9 split selection depends on array order (app.jsx:660)", () => {
  const old = { from: "2026-08-01", map: { 4: "L" } };
  const current = { from: "2026-09-01", map: { 4: "U" } };
  assert.equal(T.dayType("2026-09-03", { split: [old, current] }), "U");
  assert.equal(T.dayType("2026-09-03", { split: [current, old] }), "L");
});
if (process.env.TZ === "America/New_York") {
  witness("D10 calendar-week arithmetic counts elapsed DST hours (app.jsx:311)", () => {
    assert.ok(Math.abs(T.weeksBetween("2026-03-08", "2026-03-15") - 167 / 168) < 1e-12);
    assert.ok(Math.abs(T.weeksBetween("2026-11-01", "2026-11-08") - 169 / 168) < 1e-12);
  });
} else {
  throw new Error("Set TZ=America/New_York to execute the DST witness");
}
console.log("DEFECT WITNESSES: " + count + "/10 reproduced; behavior intentionally unchanged");
