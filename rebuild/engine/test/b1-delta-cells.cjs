"use strict";

// B1 GRADING & TIME WINDOW — purpose-written delta cells.
// BRIEF-B1-GRADING-TIME-WINDOW-v1.2 §A (the r1 review's C2 and C5).
//
// These are NOT defect witnesses: they assert the REPAIRED behaviour, and they
// exist because the r1 independent review proved three of B1's hunks are caught
// by no v4 law and no witness carrier:
//   * D16's `dueISO = plusDays(f.d, GRADE_LAG)` (the millisecond->calendar half)
//   * D24's `yISO  = plusDays(isoOf(todayStart()), -1)` (the same half)
//   * the D8xD21 cross-case — the two-anchor `sleepInfo().clean`, whose absence
//     from every law is exactly why the one-anchor form shipped and silenced
//     `recoveryIndex`'s named sleep flag (review r1, "THE D8 ADJUDICATION").
// Each cell is chosen on a date where a 24-hour step and a calendar step DISAGREE,
// so the cell cannot pass for the wrong reason. Every state below is invented.
// No frozen law, golden or witness byte is touched by this file.
const assert = require("node:assert/strict");
const { createEngine } = require("../index.cjs");

const dowOf = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).getDay(); };
const clockAt = (iso) => ({ today: () => iso, hour: () => 12, dow: () => dowOf(iso),
  nowISO: () => iso + "T16:00:00.000Z", nowMs: () => new Date(iso + "T16:00:00.000Z").getTime(),
  tz: "America/New_York" });
const engine = (iso) => createEngine({ clock: clockAt(iso), ids: { fresh: () => "synthetic-id" } }).__test;
const state = () => ({ trend: 180,
  model: { lean: 150, anchorISO: "2026-08-01", drip: 0, src: "DEXA" },
  weekly: [], reads: [{ d: "2026-09-03", w: 180 }], dailyLogs: {}, forecasts: [], adjustments: [],
  sleep: { nights: ["2026-08-31", "2026-09-01", "2026-09-02"].map((d) => ({ d, h: 8 })),
    cleanH: 7.5, needed: 3 },
  sessionLog: {}, blackout: { until: "2026-07-27" }, learned: { anchors: [] },
  events: [], dayCtx: {}, plan: {}, targets: {}, exercises: [], queue: [] });

let count = 0;
function cell(name, run) { run(); count++; console.log("CELL " + name); }
assert.equal(process.env.TZ, "America/New_York", "Set TZ=America/New_York for these calendar cells");

// ---------------------------------------------------------------------------
// C5 (a) — D16's `dueISO`. The forecast sits on 2026-11-01, the US fall-back
// date, so 7*86_400_000 ms after local midnight lands on 2026-11-07 23:00 and
// the millisecond form grades the SIXTH calendar day. Seven calendar days is
// 2026-11-08. No v4 law and no witness carrier moves when this hunk is reverted
// (review r1 §9, "REVERT D16 dueISO calendar — NO law, NO carrier").
cell("B1-D16-due-date-is-seven-calendar-days-not-168-hours", () => {
  const T = engine("2026-11-20");
  const read = (d) => { const s = state();
    s.forecasts = [{ d: "2026-11-01", pred7: 165 }];
    s.reads = [{ d, w: 165, pt: 165 }];
    const r = T.trackRecord(s); return { graded: r.graded, hit: r.rows[0].hit }; };
  assert.equal(T.plusDays("2026-11-01", 7), "2026-11-08");
  assert.deepEqual(read("2026-11-07"), { graded: 0, hit: null });   // 6th calendar day: UNGRADED, not a hit
  assert.deepEqual(read("2026-11-08"), { graded: 1, hit: true });   // the due date itself
  assert.deepEqual(read("2026-11-09"), { graded: 1, hit: true });   // the one grace date
  assert.deepEqual(read("2026-11-10"), { graded: 0, hit: null });   // past grace: UNGRADED, not a miss
});

// ---------------------------------------------------------------------------
// C5 (b) — D24's `yISO`. On 2026-03-09, the day after the US spring-forward,
// 86_400_000 ms before local midnight is 2026-03-07 23:00, so the millisecond
// form asks about 03-07 (a steps-only row) instead of 03-08 (which has calories)
// and owes a yesterday that is already closed. Reverting this hunk moves no law
// and no carrier either (review r1 §9, "REVERT D24 yISO calendar").
cell("B1-D24-yesterday-is-the-previous-calendar-date-not-24-hours-ago", () => {
  const T = engine("2026-03-09");
  assert.equal(T.plusDays(T.isoOf(T.todayStart()), -1), "2026-03-08");
  const s = state();
  s.dailyLogs = { "2026-03-07": { steps: 1 }, "2026-03-08": { cal: 2000 } };
  assert.deepEqual(T.nowFocus(s, 12).owed.map((item) => item.k), ["night"]);
  // control: strip the calories from the real previous calendar date and the
  // same call owes yesterday again, so the cell is not passing vacuously.
  const open = state();
  open.dailyLogs = { "2026-03-07": { steps: 1 }, "2026-03-08": { steps: 1 } };
  assert.ok(T.nowFocus(open, 12).owed.some((item) => item.k === "yesterday"));
});

// ---------------------------------------------------------------------------
// C2 — the D8xD21 cross-case. D8's guard asks `last.d === plusDays(iso, -1)`;
// D21 makes `sleepInfo` ask at `tomorrow`; together, a one-anchor `sleepInfo`
// demands a night bed-dated TODAY, which the product's own dating rule
// ("a night belongs to the evening it began … never the one you haven't slept
// yet", app.jsx:12334) never produces — so `recoveryIndex`'s named sleep flag
// went silent in normal operation and D22's frozen<->candidate trace parity
// broke. The two-anchor form asks at BOTH anchors. THE assertion is the first
// one below; the three after it are the controls that keep D8's two clauses and
// D21's repair honest at the same time.
cell("B1-D8xD21-a-short-last-night-still-restricts-recovery", () => {
  const T = engine("2026-09-03");
  const withNights = (nights) => { const s = state(); s.sleep.nights = nights; return s; };
  const recent = [{ d: "2026-08-31", h: 8 }, { d: "2026-09-01", h: 8 }];
  // THE cell: the newest night is bed-dated today-1 with h < DEBT_LAST_H.
  assert.equal(T.sleepInfo(withNights([...recent, { d: "2026-09-02", h: 2 }])).clean, false);
  // and the flag reaches the product: recoveryIndex names it, as D8's ruling
  // requires ("every other recovery check still applies").
  const r = T.recoveryIndex(withNights([...recent, { d: "2026-09-02", h: 2 }]));
  assert.equal(r.band, "WATCH");
  assert.ok(r.factors.some((f) => String(f).startsWith("sleep reset")));
  // D8 clause 1 — no carry-forward: a night three days old restricts nothing.
  assert.equal(T.sleepInfo(withNights([{ d: "2026-08-31", h: 2 }])).clean, true);
  assert.equal(T.sleepInfo(withNights([])).clean, true);
  // D21 — a same-date (fall-back) row still counts, at both anchors.
  assert.equal(T.sleepInfo(withNights([...recent, { d: "2026-09-03", h: 2 }])).clean, false);
  assert.equal(engine("2026-11-01").sleepInfo(withNights([{ d: "2026-11-01", h: 1 }])).clean, false);
  // and three genuinely clean nights are still clean.
  assert.equal(T.sleepInfo(withNights([...recent, { d: "2026-09-02", h: 8 }])).clean, true);
});

console.log("B1 DELTA CELLS: " + count + "/3 hold; D16 dueISO, D24 yISO and the D8xD21 cross-case");
