"use strict";

// B1 GRADING & TIME WINDOW — purpose-written delta cells.
// BRIEF-B1-GRADING-TIME-WINDOW-v1.2 §A (the r1 review's C2 and C5, and the r2
// review's C-r2-1).
//
// These are NOT defect witnesses: they assert the REPAIRED behaviour, and they
// exist because the independent reviews proved that B1's committed artifacts
// alone — the ten v4 laws, D22's frames parity and the three witness carriers —
// do not kill every mutant BRIEF v1.2 §2 names. r1 found it for two hunks (C5);
// r2 measured it across all ten and found seventeen of the thirty-three mutants
// caught, the rest resting on scratch batteries in `rv1/` and `fx1/` that are
// never committed (review r2 §4). This file is where those kills now live, so
// that every killable mutant is killed by an artifact that is IN the repository.
//
// Each cell names the mutant(s) it kills. Every fixture is invented here; every
// calendar fixture sits on a date where a 24-hour step and a calendar step
// DISAGREE, so a cell cannot pass for the wrong reason. No frozen law, golden,
// witness or tool byte is touched or read by this file.
//
// Sole survivor by design: `D10-2 utc-stamp-substitution` is behaviourally
// unkillable — four independent confirmations (builder, r1, fixer, r2) — and
// `BRIEF-IMPORT-GUARDS.md:88` forbids earning a kill from a refusal. Its kill
// is a positive source/alias assertion and belongs to B1's closed package
// profile (review r1 C4, review r2 C-r2-2(b)), not here.
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

// The wider readers (`phaseArc`, `theOneFix`, `fiveLevers`, `nowModel`) touch
// more of the athlete record than the three original cells needed. `wide()` is
// the same kind of invented fixture, carrying the whole shape they read.
const wide = () => ({ v: 60, trend: 180, reads: [], weekly: [], dailyLogs: {}, sessionLog: {},
  sleep: { nights: [], needed: 3, debts: [], target: 8, cleanH: 7.5 }, exercises: [], queue: [],
  feed: [], forecasts: [], adjustments: [], proposals: [], suggestionLog: [], targets: {},
  learned: { tdee: [], anchors: [] }, plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [] },
  exOrder: { U: [], L: [] }, planGen: 52, retirements: {}, insertions: {}, waist: [], photos: [],
  events: [], trials: [], agentProposals: [], blackout: { until: "2026-07-27" },
  model: { lean: 150, drip: 0, src: "DEXA", anchorISO: "2026-08-01" }, dayCtx: {} });

const EM = "—";    // em dash, as the engine composes its prose
const MID = "·";   // middle dot, as the workout title composes its separator

// An INDEPENDENT calendar oracle, deliberately not the engine's `plusDays`: the
// fixtures that are merely dated relative to another date must not be built by
// the primitive several of these cells are here to test, and a cell whose
// fixture cannot be built at all on the pre-B1 base proves nothing about
// behaviour. Only the two cells that assert the primitive itself call it.
const shift = (iso, n) => { const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(y, m - 1, d + n);
  return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0")
    + "-" + String(t.getDate()).padStart(2, "0"); };

const CELLS = [];
const cell = (name, kills, run) => CELLS.push({ name, kills, run });
assert.equal(process.env.TZ, "America/New_York", "Set TZ=America/New_York for these calendar cells");

// ---------------------------------------------------------------------------
// C5 (a) — D16's `dueISO`. The forecast sits on 2026-11-01, the US fall-back
// date, so 7*86_400_000 ms after local midnight lands on 2026-11-07 23:00 and
// the millisecond form grades the SIXTH calendar day. Seven calendar days is
// 2026-11-08. No v4 law and no witness carrier moves when this hunk is reverted
// (review r1 §9, "REVERT D16 dueISO calendar — NO law, NO carrier").
cell("B1-D16-due-date-is-seven-calendar-days-not-168-hours",
  ["D16-4 calendar-add-by-milliseconds"], () => {
  const T = engine("2026-11-20");
  const read = (d) => { const s = state();
    s.forecasts = [{ d: "2026-11-01", pred7: 165 }];
    s.reads = [{ d, w: 165, pt: 165 }];
    const r = T.trackRecord(s); return { graded: r.graded, hit: r.rows[0].hit }; };
  assert.deepEqual(read("2026-11-07"), { graded: 0, hit: null });   // 6th calendar day: UNGRADED, not a hit
  assert.deepEqual(read("2026-11-08"), { graded: 1, hit: true });   // the due date itself
  assert.deepEqual(read("2026-11-09"), { graded: 1, hit: true });   // the one grace date
  assert.deepEqual(read("2026-11-10"), { graded: 0, hit: null });   // past grace: UNGRADED, not a miss
  assert.equal(T.plusDays("2026-11-01", 7), "2026-11-08");          // and the primitive underneath
});

// ---------------------------------------------------------------------------
// C5 (b) — D24's `yISO`. On 2026-03-09, the day after the US spring-forward,
// 86_400_000 ms before local midnight is 2026-03-07 23:00, so the millisecond
// form asks about 03-07 (a steps-only row) instead of 03-08 (which has calories)
// and owes a yesterday that is already closed. Reverting this hunk moves no law
// and no carrier either (review r1 §9, "REVERT D24 yISO calendar").
cell("B1-D24-yesterday-is-the-previous-calendar-date-not-24-hours-ago",
  ["D24-1 require-every-field", "D24-3 yesterday-by-milliseconds"], () => {
  const T = engine("2026-03-09");
  const s = state();
  s.dailyLogs = { "2026-03-07": { steps: 1 }, "2026-03-08": { cal: 2000 } };
  assert.deepEqual(T.nowFocus(s, 12).owed.map((item) => item.k), ["night"]);
  // control: strip the calories from the real previous calendar date and the
  // same call owes yesterday again, so the cell is not passing vacuously.
  const open = state();
  open.dailyLogs = { "2026-03-07": { steps: 1 }, "2026-03-08": { steps: 1 } };
  assert.ok(T.nowFocus(open, 12).owed.some((item) => item.k === "yesterday"));
  assert.equal(T.plusDays(T.isoOf(T.todayStart()), -1), "2026-03-08");   // the primitive underneath
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
cell("B1-D8xD21-a-short-last-night-still-restricts-recovery",
  ["D21-4 drop-the-today-anchor (the shipped one-anchor sleepInfo)"], () => {
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

// ---------------------------------------------------------------------------
// C-r2-1 (1/11) — D10. `Math.round` belongs on the DAY COUNT, not on the week.
// Rounding the week collapses every fraction to a whole number of weeks, which
// the law cannot see (its three assertions are all whole weeks) and no carrier
// exercises. The two fractional controls are the detectors; the four whole-week
// values beside them are what keeps the repaired form honest across both New
// York transitions (review r2 §4, `D10.w_0906` / `D10.w_year`).
cell("B1-D10-fractional-weeks-are-exact-sevenths-of-calendar-days",
  ["D10-1 round-the-week-not-the-days"], () => {
  const T = engine("2026-09-03");
  // THE cells: three calendar days is three sevenths of a week, not zero.
  assert.equal(T.weeksBetween("2026-09-03", "2026-09-06"), 0.42857142857142855);
  assert.equal(T.weeksBetween("2026-01-01", "2027-01-01"), 52.142857142857146);
  // controls: seven calendar dates apart is exactly one week in either
  // direction, on both transitions and off them.
  assert.equal(T.weeksBetween("2026-03-08", "2026-03-15"), 1);    // spring forward
  assert.equal(T.weeksBetween("2026-11-01", "2026-11-08"), 1);    // fall back
  assert.equal(T.weeksBetween("2026-03-15", "2026-03-08"), -1);
  assert.equal(T.weeksBetween("2026-09-03", "2026-09-10"), 1);
  assert.equal(T.weeksBetween("2026-09-03", "2026-09-03"), 0);
  // and the primitive D21/D19/D16/D24/D23 all consume steps calendar dates.
  assert.equal(T.plusDays("2026-11-01", 1), "2026-11-02");
  assert.equal(T.plusDays("2026-03-08", 1), "2026-03-09");
  assert.equal(T.plusDays("2026-03-09", -1), "2026-03-08");
});

// ---------------------------------------------------------------------------
// C-r2-1 (2/11) — D8. The recency guard returns EARLY for a stale night; the
// three-consecutive-night mean at the end of `cleanAtDate` must still run on the
// nights that do exist. A mutant that returns `true` before reaching it passes
// D8's own law (whose fixture is a stale single night) and every carrier.
// The first assertion is the stale case D8 exists for, and it is what makes this
// cell RED on the pre-B1 base; the three-6.6h run is the detector.
cell("B1-D8-the-three-night-mean-still-runs-behind-the-recency-guard",
  ["D8-3 drop-the-three-night-mean"], () => {
  const T = engine("2026-09-03");
  const n = (a) => ({ sleep: { nights: a } });
  // D8's own clause: an eight-month-old short night carries no current debt.
  assert.equal(T.cleanAtDate(n([{ d: "2026-01-01", h: 5 }]), "2026-09-03"), true);
  // THE cell: three consecutive 6.6 h nights ending LAST night are not clean,
  // even though every one of them clears DEBT_LAST_H on its own.
  assert.equal(T.cleanAtDate(n([{ d: "2026-08-31", h: 6.6 }, { d: "2026-09-01", h: 6.6 },
    { d: "2026-09-02", h: 6.6 }]), "2026-09-03"), false);
  // controls: the same run at 7 h is clean, and the DEBT_LAST_H boundary holds.
  assert.equal(T.cleanAtDate(n([{ d: "2026-08-31", h: 7 }, { d: "2026-09-01", h: 7 },
    { d: "2026-09-02", h: 7 }]), "2026-09-03"), true);
  assert.equal(T.cleanAtDate(n([{ d: "2026-09-02", h: 6.5 }]), "2026-09-03"), true);
  assert.equal(T.cleanAtDate(n([{ d: "2026-09-02", h: 6.4 }]), "2026-09-03"), false);
  assert.equal(T.cleanAtDate(n([]), "2026-09-03"), true);
});

// ---------------------------------------------------------------------------
// C-r2-1 (3/11) — D16, the owner's own words: "with no such reading the forecast
// is UNGRADED, not a miss" (DECISIONS.md:60). The law asserts the horizon but
// not the SHAPE of the ungraded row, so a mutant that writes `miss: true` on it
// passes every committed artifact while silently turning a late weigh-in into a
// failed prediction — and `miss` feeds `misses`, `cleanStreak` and `hasMiss`.
cell("B1-D16-a-late-read-leaves-the-call-ungraded-and-never-a-miss",
  ["D16-1 ungraded-counts-as-miss"], () => {
  const T = engine("2026-09-03");
  const read = (d, extra) => { const s = state();
    s.forecasts = [{ d: "2026-08-01", pred7: 165 }];
    s.reads = [{ d, w: 165, pt: 165, ...(extra || {}) }];
    const r = T.trackRecord(s);
    return { graded: r.graded, hit: r.rows[0].hit, miss: r.rows[0].miss }; };
  // THE cells: past the one grace date, and a month late.
  assert.deepEqual(read("2026-08-10"), { graded: 0, hit: null, miss: false });
  assert.deepEqual(read("2026-09-01"), { graded: 0, hit: null, miss: false });
  // and the same shape before the call has come due at all.
  assert.deepEqual(read("2026-08-07"), { graded: 0, hit: null, miss: false });
  // controls: the due date and the one grace date still grade, and still hit.
  assert.deepEqual(read("2026-08-08"), { graded: 1, hit: true, miss: false });
  assert.deepEqual(read("2026-08-09"), { graded: 1, hit: true, miss: false });
});

// ---------------------------------------------------------------------------
// C-r2-1 (4/11) — D16's other half: the eligibility filter. Every other read
// consumer in the engine refuses `sealed` and `offWindow` rows; before B1
// `trackRecord` did not. The law's fixture uses a plain read, so dropping
// `!r.sealed && !r.offWindow` leaves the law GREEN and every carrier PASS.
cell("B1-D16-only-an-eligible-read-can-grade-a-forecast",
  ["D16-3 drop-the-eligibility-filter"], () => {
  const T = engine("2026-09-03");
  const read = (d, extra) => { const s = state();
    s.forecasts = [{ d: "2026-08-01", pred7: 165 }];
    s.reads = [{ d, w: 165, pt: 165, ...(extra || {}) }];
    const r = T.trackRecord(s);
    return { graded: r.graded, hit: r.rows[0].hit, miss: r.rows[0].miss }; };
  // THE cells: an ineligible read ON the due date grades nothing.
  assert.deepEqual(read("2026-08-08", { sealed: true }), { graded: 0, hit: null, miss: false });
  assert.deepEqual(read("2026-08-08", { offWindow: true }), { graded: 0, hit: null, miss: false });
  // control: the identical read without the flag does grade, so the cell is
  // measuring eligibility and not the horizon.
  assert.deepEqual(read("2026-08-08"), { graded: 1, hit: true, miss: false });
});

// ---------------------------------------------------------------------------
// C-r2-1 (5/11) — D17. The law asserts one row with `applied === false`, which
// says nothing about `auto` and nothing about an adjustment that was never
// touched. So a mutant that also sets `auto` from `undone`, and a mutant that
// hardcodes `applied: false`, both pass it. The register's own instruction is
// that the row "stays in decision history" with its stored text: `d`, `title`
// and `auto` must be exactly what was stored.
cell("B1-D17-undone-moves-applied-only-and-a-clean-adjustment-still-reads-applied",
  ["D17-2 undone-means-auto", "D17-3 applied-always-false"], () => {
  const T = engine("2026-09-03");
  const adj = (f) => { const s = state();
    s.adjustments = [{ rid: "ap_1", d: "2026-09-03", title: "X", ...f }];
    return T.trackRecord(s).decisions; };
  // the hunk itself: undone is not applied, and the row survives intact.
  assert.deepEqual(adj({ undone: true }),
    [{ d: "2026-09-03", title: "X", applied: false, auto: false }]);
  // THE cell for D17-2: `auto` is the stored flag, never inferred from `undone`.
  assert.deepEqual(adj({ undone: true, auto: true }),
    [{ d: "2026-09-03", title: "X", applied: false, auto: true }]);
  // THE cell for D17-3: neither flag set is still an APPLIED adjustment.
  assert.deepEqual(adj({}),
    [{ d: "2026-09-03", title: "X", applied: true, auto: false }]);
  // controls: dismissed alone, and both flags, read the same as before B1.
  assert.deepEqual(adj({ dismissed: true }),
    [{ d: "2026-09-03", title: "X", applied: false, auto: false }]);
  assert.deepEqual(adj({ undone: true, dismissed: true }),
    [{ d: "2026-09-03", title: "X", applied: false, auto: false }]);
});

// ---------------------------------------------------------------------------
// C-r2-1 (6/11) — D25. The law asserts only the 0/1 case, so three different
// rules all satisfy it: the repaired one, a bare majority, and "no misses at
// all". The three fixtures below separate them. `2/4` is the only value that
// separates the repaired rule from a majority — the brief's named `1/2` and
// `6/7` do NOT move under it (review r1 C3 item 2, re-derived by r2 §6).
cell("B1-D25-good-needs-one-success-and-forgives-exactly-one-miss",
  ["D25-1 require-a-majority", "D25-2 drop-the-one-miss-allowance",
    "D25-3 zero-rows-becomes-caution"], () => {
  const T = engine("2026-09-03");
  const pro = (vals) => { const s = state();
    vals.forEach((v, i) => { s.dailyLogs["2026-08-" + String(20 + i).padStart(2, "0")] = { pro: v }; });
    const l = T.fiveLevers(s); return l.protein.state + " " + l.protein.detail; };
  // the hunk itself: a first missed day cannot read good.
  assert.equal(pro([0]), "caution 0/1");
  // THE cell for D25-1: a majority (2 of 4) is NOT the rule — one forgiven miss is.
  assert.equal(pro([200, 200, 0, 0]), "caution 2/4");
  // THE cells for D25-2: exactly one miss is forgiven, at two and at seven rows.
  assert.equal(pro([200, 0]), "good 1/2");
  assert.equal(pro([200, 200, 200, 200, 200, 200, 0]), "good 6/7");
  // THE cell for D25-3: no protein rows is QUIET, not caution.
  assert.equal((() => { const l = T.fiveLevers(state()); return l.protein.state + " " + l.protein.detail; })(),
    "quiet counting only");
  // controls: a clean single day, and two misses out of two.
  assert.equal(pro([200]), "good 1/1");
  assert.equal(pro([0, 0]), "caution 0/2");
});

// ---------------------------------------------------------------------------
// C-r2-1 (7/11) — D19. The law pins one ordinary break (2026-09-01..09-07), so
// `plusDays(brkS.end, 1)` and `isoOf(mk(brkS.end) + DAY)` agree on it and the
// millisecond form passes. They disagree on a break that ENDS on the fall-back
// date: adding 86_400_000 ms to 2026-11-01 local midnight lands back inside
// 2026-11-01, so the athlete is told the cut resumes on the day that is still
// the last active day of the break — D19's own defect, alive in one line.
cell("B1-D19-the-cut-resumes-the-calendar-date-after-an-inclusive-break-end",
  ["D19-2 resume-plus-one-millisecond-day"], () => {
  const arc = (start, end, day) => { const T = engine(day); const s = wide();
    s.plan.brk = { start, end }; return { b: T.dietBreakState(s), p: T.phaseArc(s) }; };
  // THE cell: a break ending on 2026-11-01, read on its last active day.
  const fall = arc("2026-10-26", "2026-11-01", "2026-11-01");
  assert.equal(fall.b.status, "active");
  assert.equal(fall.p.next.when, "resumes Mon 11/2");
  assert.equal(fall.p.line, "Diet break " + EM + " day 7 of 7, 0 to go. "
    + "Eating at maintenance; the cut resumes Mon 11/2.");
  // controls: the ordinary break the law pins, on two of its active days, with
  // the one-based numbering D19's other half installs.
  const d4 = arc("2026-09-01", "2026-09-07", "2026-09-04");
  assert.equal(d4.p.next.when, "resumes Tue 9/8");
  assert.equal(d4.p.line, "Diet break " + EM + " day 4 of 7, 3 to go. "
    + "Eating at maintenance; the cut resumes Tue 9/8.");
  const d7 = arc("2026-09-01", "2026-09-07", "2026-09-07");
  assert.equal(d7.p.line, "Diet break " + EM + " day 7 of 7, 0 to go. "
    + "Eating at maintenance; the cut resumes Tue 9/8.");
  // and `dietBreakState`'s own return is untouched by all of it: `daysSince`
  // stays the zero-based offset every other consumer reads.
  const after = arc("2026-09-01", "2026-09-07", "2026-09-08").b;
  assert.deepEqual({ status: after.status, start: after.start, end: after.end,
    startsIn: after.startsIn, daysLeft: after.daysLeft, daysSince: after.daysSince },
    { status: "recent", start: "2026-09-01", end: "2026-09-07", startsIn: 0, daysLeft: 0, daysSince: 1 });
});

// A stalled athlete: flat trend, three clean nights, one read. `theOneFix`
// reaches rungs 4/5 only from here, so both D27 cells build on it.
const stalled = (day, phase, brk) => { const s = wide();
  if (phase) s.plan.phase = phase;
  if (brk) s.plan.brk = brk;
  s.reads = [{ d: day, w: 180 }];
  s.sleep.nights = [-3, -2, -1].map((k) => ({ d: shift(day, k), h: 8 }));
  s.weekly = [{ wk: shift(day, -14), trend: 180 }, { wk: shift(day, -7), trend: 180 },
    { wk: day, trend: 180 }];
  return s; };

// ---------------------------------------------------------------------------
// C-r2-1 (8/11) — D27. `arc.key` is not `s.plan.phase`: `phaseArc` gives an
// ACTIVE diet break precedence over the committed phase (policy.cjs:547), and
// an athlete inside a diet break is already eating at maintenance. Reading
// `s.plan.phase` directly passes D27's law (whose fixture has no break) and
// every carrier, while telling a man on day 3 of his diet break to take a diet
// break.
cell("B1-D27-an-active-diet-break-is-not-a-cut",
  ["D27-2 read-plan-phase-directly"], () => {
  const T = engine("2026-09-03");
  const s = stalled("2026-09-03", "cut", { start: "2026-09-01", end: "2026-09-07" });
  // THE cell: `plan.phase` still says cut, but the arc says break, and the arc wins.
  assert.equal(s.plan.phase, "cut");
  assert.equal(T.phaseArc(s).key, "break");
  assert.equal(T.theOneFix(s).rung, "hold");
  // controls: the same stalled athlete NOT in a break is told to take one, and
  // a committed maintenance athlete is left alone.
  assert.equal(T.theOneFix(stalled("2026-09-03", "cut")).rung, "break");
  const quiet = T.theOneFix(stalled("2026-09-03", "maintenance"));
  assert.equal(quiet.rung, "hold");
  assert.equal(quiet.lever, null);
  assert.equal(quiet.state, "good");
  assert.equal(quiet.title, "Nothing to fix " + EM + " hold the line");
});

// ---------------------------------------------------------------------------
// C-r2-1 (9/11) — D27's second half: "long cut" is the COMMITTED PHASE's own
// age, not the global programme clock. The two only disagree for a committed cut
// younger than the programme, so the fixture is expressed relative to START, not
// as a literal: at START + 63 days the phase is 9 weeks old while the programme
// is in week 10, and the athlete must be offered the calorie trim (rung 5), not
// the diet break (rung 4). The window where they straddle the `>= 10` gate is
// START + 63 .. START + 69; START + 70 is the control on the other side.
cell("B1-D27-long-cut-is-the-committed-phases-own-age-not-the-programme-week",
  ["D27-3 gate-on-programme-week-and-phase"], () => {
  const START = engine("2026-09-03").START;
  // THE cell: phase 9 weeks old, programme week 10.
  const day9 = shift(START, 63);
  const T9 = engine(day9);
  const s9 = stalled(day9, "cut");
  assert.equal(T9.phaseArc(s9).weeks, 9);
  assert.equal(T9.weekDay().wk, 10);
  assert.equal(T9.theOneFix(s9).rung, "calories");
  // control: seven days later the phase itself is 10 weeks old and the diet
  // break is earned, so the cell is measuring the gate and not the rung.
  const day10 = shift(START, 70);
  const T10 = engine(day10);
  const s10 = stalled(day10, "cut");
  assert.equal(T10.phaseArc(s10).weeks, 10);
  assert.equal(T10.weekDay().wk, 11);
  assert.equal(T10.theOneFix(s10).rung, "break");
});

// A ready hack debut on a scheduled day, the state D23's law is named for.
const hackDebut = (map) => { const s = wide();
  s.exercises = [{ id: "hack", n: "Synthetic squat", day: "L", w: null, sets: 3, hi: 12, lo: 8 },
    { id: "press", n: "Press", day: "U", w: 100, inc: 5, sets: 2, hi: 10, lo: 8,
      last: [8, 7], setup: "known", mg: "chest" }];
  s.queue = [{ id: "q_test", exId: "hack", kind: "debut", state: "READY", done: false, newW: 100 }];
  s.split = [{ from: "2026-08-01", map }];
  return s; };
const DEPS = { face: { word: "CALIBRATING", glyph: "x", cause: "Synthetic read" },
  fix: { state: "good" }, prog: { state: "unknown", why: "only 0 lifts" } };

// ---------------------------------------------------------------------------
// C-r2-1 (10/11) — D23's control-flow half. B1 narrowed a bare `catch` around
// the WHOLE seven-day scan to a `continue` inside one iteration. Two mutants
// undo that in opposite directions and both pass D23's law, whose fixture
// succeeds on the FIRST day scanned: removing the catch lets a throw escape
// `nowModel` entirely, and keeping the outer catch abandons the remaining six
// days and prints REST DAY. The fixture that separates them is a state where
// day 0 throws and a later day does not.
cell("B1-D23-a-failed-derivation-is-neither-a-rest-day-nor-an-escaping-throw",
  ["D23-2 remove-the-catch", "D23-3 rest-day-on-any-failure"], () => {
  const s = hackDebut({ 4: "L", 6: "U" });   // Thu is LOWER, Sat is UPPER
  // day 0 (Thu 2026-09-03) is a scheduled L day whose derivation throws...
  Object.defineProperty(s.queue[0], "newW", {
    get() { throw new Error("synthetic boom"); }, enumerable: true, configurable: true });
  // THE cell: `nowModel` still returns, and it finds Saturday's UPPER day.
  const w = engine("2026-09-03").nowModel(s, DEPS).workout;
  assert.equal(w.title, "UPPER BODY " + MID + " SAT 9/5");
  assert.equal(w.today, false);
  assert.equal(w.iso, "2026-09-05");
  // control: the same schedule without the throwing accessor finds Thursday.
  const ok = engine("2026-09-03").nowModel(hackDebut({ 4: "L", 6: "U" }), DEPS).workout;
  assert.equal(ok.title, "LOWER BODY " + MID + " TODAY");
  assert.equal(ok.iso, "2026-09-03");
  // control: a genuinely empty split is still a REST DAY, with no `iso` at all.
  const rest = engine("2026-09-03").nowModel(hackDebut({}), DEPS).workout;
  assert.equal(rest.title, "REST DAY");
  assert.equal(rest.today, false);
  assert.equal(rest.iso, undefined);
});

// ---------------------------------------------------------------------------
// C-r2-1 (11/11) — D23's calendar half. The scan steps k9 = 0..6. Stepping by
// 864e5 ms from 2026-11-01 yields 2026-11-01 AGAIN, so the loop examines the
// same calendar date twice and only reaches six of the seven days. D23's law
// runs on 2026-09-03, where the two forms agree, so the millisecond step passes
// it and every carrier.
cell("B1-D23-the-seven-day-scan-steps-calendar-dates",
  ["D23-4 week-step-by-milliseconds"], () => {
  // THE cell: Sunday 2026-11-01, LOWER scheduled for Monday.
  const tom = engine("2026-11-01").nowModel(hackDebut({ 1: "L" }), DEPS).workout;
  assert.equal(tom.title, "LOWER BODY " + MID + " TOMORROW");
  assert.equal(tom.today, false);
  assert.equal(tom.iso, "2026-11-02");
  // and the seventh day of the scan is still reached from the fall-back date.
  const thu = engine("2026-11-01").nowModel(hackDebut({ 4: "L" }), DEPS).workout;
  assert.equal(thu.title, "LOWER BODY " + MID + " THU 11/5");
  assert.equal(thu.iso, "2026-11-05");
  // control: off the transition the two forms agree, and they must keep agreeing.
  const ord = engine("2026-09-03").nowModel(hackDebut({ 5: "L" }), DEPS).workout;
  assert.equal(ord.iso, "2026-09-04");
  assert.equal(ord.title, "LOWER BODY " + MID + " TOMORROW");
});

// ---------------------------------------------------------------------------
// Run every cell. A cell that aborts the file would hide the ones behind it, so
// failures are collected and the count is reported: N/N on the repaired
// candidate, 0/N on the pre-B1 base, and on a single-hunk revert exactly the
// cells that hunk carries.
let held = 0;
const failed = [];
for (const c of CELLS) {
  try { c.run(); held++; console.log("HOLD " + c.name + "  [kills: " + c.kills.join(" | ") + "]"); }
  catch (e) {
    failed.push(c.name);
    console.log("FAIL " + c.name + "  [kills: " + c.kills.join(" | ") + "]");
    console.log("     " + String(e && e.message || e).split("\n").slice(0, 3).join(" / "));
  }
}
const kills = CELLS.reduce((a, c) => a + c.kills.length, 0);
console.log("B1 DELTA CELLS: " + held + "/" + CELLS.length + " hold; " + kills
  + " named mutants carried (D10-2 excluded: unkillable behaviourally, see header)");
if (failed.length) {
  console.error("B1 DELTA CELLS FAILED: " + failed.join(", "));
  process.exitCode = 1;
}
