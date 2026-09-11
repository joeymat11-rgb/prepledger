"use strict";

// B1 GRADING & TIME WINDOW — purpose-written delta cells.
// BRIEF-B1-GRADING-TIME-WINDOW-v1.2 §A (the r1 review's C2 and C5, the r2
// review's C-r2-1, and the r3 review's C-r3-2 and C-r3-3 — see §A9).
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
// `D10-2 utc-stamp-substitution` is the one mutant no VALUE can kill — five
// independent confirmations (builder, r1, the r1 fixer, r2, the r2 fixer) that
// nothing moves — and `BRIEF-IMPORT-GUARDS.md:89` forbids earning a kill from a
// refusal. Its kill is the positive source/alias assertion BRIEF v1.2 §2 D10
// names ("an alias trace showing a UTC constructor"), and the r3 pass commits
// it as the last cell in this file so the kill lives in the repository rather
// than in a brief. The PM's C-r2-2 is unchanged: the closed profile must still
// list this file as a REQUIRED artifact and carry the assertion.
//
// The file also carries, after the mutant cells, ONE CELL PER D10 CALL SITE
// OUTSIDE B1's modules — `energy.cjs:84,228`, `sleep.cjs:634,807`,
// `migrate.cjs:301,1203`, `writers.cjs:1587,2432` — with the BEFORE value
// measured on the pre-B1 base and the AFTER value on this candidate, which is
// the PM's acceptance condition at `rebuild/DECISIONS.md:103` item 2. Those
// cells kill no named mutant; they are the enumeration, and B2's and B3's
// golden budgets are their audience.
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
// C-r3-2 (review r3) — D21's fall-back coverage, on ALL THREE fall-back years.
//
// Until this cell, exactly one fall-back date was pinned by a committed
// artifact: `2026-11-01`, inside the C2 cell above. Review r3 measured what
// that costs. A mutant that special-cases that single date —
//
//     const tomorrow = today9 === "2026-11-01" ? "2026-11-02"
//                    : isoOf(new Date(todayStart().getTime() + DAY));
//
// — survives all 23 cells, 6/6 carriers and all 45 laws including D22's frames
// parity: the whole repository passes a `sleepInfo` that is right in one year
// and wrong in every other. BRIEF v1.2 §2 D21 already names the real killer in
// its own words — its delta cells are `2026-11-01`, `2027-11-07` AND
// `2025-11-02`, and mutant (3) is "killed by requiring the ordinary and
// spring-forward controls byte-identical and the two other fall-back years to
// pass". Those two other years were measured by review r1's own battery and by
// review r3's, and committed by neither. They are committed here.
//
// On each of the three dates 86_400_000 ms after local midnight lands at 23:00
// on the SAME calendar date, so the millisecond form asks `cleanAtDate` about
// today twice and a night bed-dated today is never seen. The repaired
// two-anchor form asks at `today9` AND at `plusDays(today9, 1)`.
cell("B1-D21-the-fall-back-anchor-holds-on-every-fall-back-year",
  ["D21-3 hardcode-fallback-date"], () => {
  const withN = (nights) => { const s = state(); s.sleep.nights = nights; return s; };
  const clean = (day, nights) => engine(day).sleepInfo(withN(nights)).clean;
  // THE cells: a 1 h night bed-dated the fall-back date itself, on the two
  // fall-back years no committed artifact reached. Both read `true` on the
  // pre-B1 base (measured) — the night the athlete actually slept was invisible.
  assert.equal(clean("2027-11-07", [{ d: "2027-11-07", h: 1 }]), false);
  assert.equal(clean("2025-11-02", [{ d: "2025-11-02", h: 1 }]), false);
  // and the year the C2 cell already pins, restated so the three read as ONE
  // set: a mutant must now get all three right, not one.
  assert.equal(clean("2026-11-01", [{ d: "2026-11-01", h: 1 }]), false);
  // the primitive underneath each of them steps a calendar date, not 24 hours.
  assert.equal(engine("2027-11-07").plusDays("2027-11-07", 1), "2027-11-08");
  assert.equal(engine("2025-11-02").plusDays("2025-11-02", 1), "2025-11-03");
  // controls, identical on both engines: a GOOD same-date night is still clean
  // on each year, and a short night bed-dated the previous day still restricts.
  assert.equal(clean("2027-11-07", [{ d: "2027-11-07", h: 8 }]), true);
  assert.equal(clean("2025-11-02", [{ d: "2025-11-02", h: 8 }]), true);
  assert.equal(clean("2027-11-07", [{ d: "2027-11-06", h: 2 }]), false);
  assert.equal(clean("2025-11-02", [{ d: "2025-11-01", h: 2 }]), false);
  // control OFF any transition, so the three cells above are measuring the
  // transition and not the mechanism.
  assert.equal(clean("2026-09-03", [{ d: "2026-09-03", h: 1 }]), false);
  assert.equal(clean("2026-09-03", [{ d: "2026-09-03", h: 8 }]), true);
  // review r2's §8 bite 1 (`N1e`), folded in while this file is open: last
  // night 2 h PLUS a row bed-dated TOMORROW. Measured identical on base and
  // candidate — a coverage gap the two-anchor form already handles correctly,
  // not a defect, and now it is a committed control rather than a note.
  const n1e = [{ d: "2026-08-31", h: 8 }, { d: "2026-09-01", h: 8 },
    { d: "2026-09-02", h: 2 }, { d: "2026-09-04", h: 8 }];
  assert.equal(clean("2026-09-03", n1e), false);
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

// ---------------------------------------------------------------------------
// C-r3-3 (review r3 §5, bite 2) — D27's `phaseArc(s)` is GUARDED, and the guard
// leaves the PRE-D27 reading standing. This is a GUARD, not a semantics change.
//
// `theOneFix` is called bare by `nowModelUncached:554`, and before B1 its
// rungs-4/5 gate read `weekDay()`, which cannot throw. `phaseArc` can: it calls
// `dietBreakState(s)` bare, which reaches `daysBetween` -> `mk(brk.end)` ->
// `.split(...)` on whatever is stored. Measured by review r3 and again by this
// pass on the same fixture: with a non-ISO `plan.brk.end` or `plan.brk.start`
// on a stalled cut, the pre-B1 base RETURNS ADVICE (`rung "break"`,
// `move.kind "fix"`) and the unguarded candidate threw
// `TypeError: s.split is not a function` out of BOTH `theOneFix` and
// `nowModel` — Today's whole model. No law, carrier or cell caught it.
//
// The remedy is the idiom B1 itself uses two lines below for `sleepInfo`
// (`slp9`), and the FALL-BACK IS THE PRE-D27 READING — `key "cut"` and
// `weekDay().wk`, which is exactly what `theOneFix` read before B1 (`stalled`
// had no phase term; `longCut` was `weekDay().wk >= 10`). So where the phase
// cannot be derived the candidate is byte-for-byte the frozen engine's
// behaviour, and D27's repair applies only where `phaseArc` answers.
// `plan.brk` is written by the engine at exactly one place
// (`writers.cjs:2216`, from a proposal's `apply.start/end`), so the reachable
// route is a ported or imported row — B3/C2 territory — not the engine's own
// writes.
cell("B1-D27-a-phase-that-cannot-be-derived-leaves-the-pre-D27-reading-standing",
  ["D27-4 drop-the-phaseArc-guard (r4-authored; beyond BRIEF v1.2 §2's 32)"], () => {
  const T = engine("2026-09-03");
  const malformed = [
    ["brk.end is a number", { start: "2026-09-01", end: 1762060800000 }],
    ["brk.end is an object", { start: "2026-09-01", end: {} }],
    ["brk.start is a number", { start: 1762060800000, end: "2026-09-07" }],
  ];
  for (const [what, brk] of malformed) {
    // THE cell: no throw, and the answer is the BASE's own answer at this
    // fixture, measured on the pre-B1 base — rung "break" / move.kind "fix".
    const fix = T.theOneFix(stalled("2026-09-03", "cut", brk));
    assert.equal(fix.rung, "break", what + " must not move the rung the frozen engine gave");
    assert.equal(fix.title, "A diet break has earned its place", what);
    assert.equal(T.nowModel(stalled("2026-09-03", "cut", brk)).move.kind, "fix",
      what + " must not throw out of nowModel");
  }
  // and the pre-D27 gate is what stands in: at this fixture `weekDay().wk` is
  // 13, so `longCut` is true exactly as it was before B1.
  assert.equal(T.weekDay().wk, 13);
  // controls — D27's repair is UNCHANGED wherever the phase CAN be derived, and
  // these are what make this cell RED on the pre-B1 base (base: both "break").
  assert.equal(T.theOneFix(stalled("2026-09-03", "maintenance")).rung, "hold");
  assert.equal(T.theOneFix(stalled("2026-09-03", "cut",
    { start: "2026-09-01", end: "2026-09-07" })).rung, "hold");
  // control: a well-formed stalled cut with no break is still told to take one.
  assert.equal(T.theOneFix(stalled("2026-09-03", "cut")).rung, "break");
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

// ===========================================================================
// PM ACCEPTANCE CONDITION (rebuild/DECISIONS.md:103 item 2) — "the D10 call
// sites outside B1's modules (energy/sleep/migrate/writers) are listed as
// delta cells with before/after values in the package".
//
// D10 repairs ONE primitive — `dates.cjs weeksBetween` — and EIGHT call sites
// in four modules B1 edits no byte of consume it:
//
//   energy.cjs:84    bfEst            wks = Math.max(0, weeksBetween(anchorISO, atISO))
//   energy.cjs:228   currentRate      rate denominator Math.max(0.5, weeksBetween(wk[i-1], wk[i]))
//   sleep.cjs:634    labAnalytics     pivot-cone rate denominator, clamped to +-10
//   sleep.cjs:807    labAnalytics     lift-slope regression x-axis
//   migrate.cjs:301  reconcileTrendChain   weeksBetween(w.wk, r.d) < 1
//   migrate.cjs:1203 patchV59              weeksBetween(w.wk, r.d) < 1
//   writers.cjs:1587 runAdaptive           weeksBetween(monday, r.d) >= 0 && < 1
//   writers.cjs:2432 undoRead              weeksBetween(monday, x.d) < 1
//
// One cell per site follows, each carrying the site's coordinate on THIS tree,
// the expression it evaluates, the BEFORE value measured on the pre-B1 base
// (`origin/rebuild/t2-client-core`) and the AFTER value on this candidate.
// Every assertion's failure message names the BEFORE value and what the run
// actually produced, so a run on base reports the base's own number rather
// than only that an assertion failed.
//
// Every fixture sits on a DST transition, because that is the only place the
// two arithmetics disagree: seven calendar dates across the US spring-forward
// are 167 elapsed hours (`0.994047619047619` weeks) and across the fall-back
// 169 (`1.005952380952381`). The `< 1` weekly-window predicate therefore flips
// `true` -> `false` in a spring-forward week and is UNMOVED in a fall-back one
// — which is why the four window sites are all fixtured on spring-forward.
//
// `migrate.cjs` and `writers.cjs` are B3's files and `energy.cjs` is B2's.
// B1 edits none of them. These cells exist so those lanes' golden budgets
// ANTICIPATE the sites rather than discover them (BRIEF v1.2 §2 D10 and §5.3;
// review r2 §10 item 5). They name no BRIEF mutant: they are the enumeration
// the PM's acceptance condition asks for, and they are red on base like every
// other cell in this file.
const BASE_TIP = "origin/rebuild/t2-client-core";
const d10site = (site, before, got) => site
  + "  |  BEFORE (pre-B1 base " + BASE_TIP + ", measured) = " + JSON.stringify(before)
  + "  |  this run produced = " + JSON.stringify(got);
const SITE = [];   // a site cell kills no named mutant; it carries the PM's enumeration

// The lab fixture the two rendered `sleep.cjs` sites need: six weekly
// snapshots whose last gap crosses the US spring-forward, and three sessions
// of one invented lift across the same transition. Nothing here is read from
// anywhere; every value is invented in this file.
const richLab = () => ({ v: 60, trend: 180,
  reads: ["2026-02-09", "2026-02-16", "2026-02-23", "2026-03-02", "2026-03-09", "2026-03-16"]
    .map((d, i) => ({ d, w: 185 - i, pt: 185 - i })),
  weekly: [{ wk: "2026-02-09", trend: 185 }, { wk: "2026-02-16", trend: 184 },
    { wk: "2026-02-23", trend: 183 }, { wk: "2026-03-02", trend: 182 },
    { wk: "2026-03-09", trend: 181 }, { wk: "2026-03-16", trend: 180 }],
  dailyLogs: {},
  sessionLog: { "2026-03-02": { entries: [{ id: "press", reps: [8] }] },
    "2026-03-09": { entries: [{ id: "press", reps: [10] }] },
    "2026-03-16": { entries: [{ id: "press", reps: [12] }] } },
  sleep: { nights: [{ d: "2026-03-13", h: 8 }, { d: "2026-03-14", h: 8 }, { d: "2026-03-15", h: 8 }],
    needed: 3, debts: [], target: 8, cleanH: 7.5 },
  exercises: [{ id: "press", n: "Press", day: "U", w: 100, inc: 5, sets: 2, hi: 12, lo: 8, setup: "known", mg: "chest" }],
  queue: [], feed: [], forecasts: [], adjustments: [], proposals: [], suggestionLog: [],
  targets: {}, learned: { tdee: [], anchors: [] },
  plan: { goals: [], ifthen: [], setAt: {}, phaseLog: [], phase: "cut" },
  exOrder: { U: ["press"], L: [] }, planGen: 52, retirements: {}, insertions: {},
  waist: [], photos: [], events: [], trials: [], agentProposals: [],
  blackout: { until: "2026-01-01" },
  model: { lean: 150, drip: 0, src: "DEXA", anchorISO: "2026-01-01" }, dayCtx: {} });
const labCard = (day, id) => {
  const cards = engine(day).labAnalytics(richLab());
  return (cards || []).find((c) => c && c.id === id) || null; };

// ---------------------------------------------------------------------------
// SITE 1/8 — `energy.cjs:84` (B2's file), `bfEst`:
//   const wks = Math.max(0, weeksBetween(s.model.anchorISO, atISO));
// `wks` multiplies the lean drip, so the window's length reaches a PRINTED
// figure: `bfEst().lean`, and through it `pct`, `lo` and `hi`.
cell("B1-D10-site-energy-84-bfEst-lean-window-is-calendar-weeks", SITE, () => {
  const T = engine("2026-09-03");
  const wks = T.weeksBetween("2026-03-02", "2026-03-09");
  assert.equal(wks, 1, d10site("energy.cjs:84 bfEst — wks over the spring-forward week",
    0.994047619047619, wks));
  const s = wide(); s.model = { lean: 150, drip: 10, src: "DEXA", anchorISO: "2026-03-02" };
  const b = T.bfEst(s, 180, "2026-03-09");
  assert.equal(b.lean, 160, d10site("energy.cjs:84 bfEst — printed lean at a 10 lb/wk drip",
    159.9, b.lean));
  // control: a week that crosses no transition already agreed, and must keep agreeing.
  const c = wide(); c.model = { lean: 150, drip: 10, src: "DEXA", anchorISO: "2026-09-03" };
  const cb = T.bfEst(c, 180, "2026-09-10");
  assert.equal(T.weeksBetween("2026-09-03", "2026-09-10"), 1);
  assert.equal(cb.lean, 160);
});

// ---------------------------------------------------------------------------
// SITE 2/8 — `energy.cjs:228` (B2's file), `currentRate`:
//   rates.push((w[i-1].trend - w[i].trend) / Math.max(0.5, weeksBetween(w[i-1].wk, w[i].wk)));
// `rates` is returned raw, and the sleep laboratory's forecast card takes its
// BAND from the spread of exactly these numbers (`sleep.cjs:767-769`), so a
// spurious 0.6 % spread printed a "+-0.0" band on a perfectly steady athlete.
cell("B1-D10-site-energy-228-currentRate-rate-denominator-is-calendar-weeks", SITE, () => {
  const T = engine("2026-09-03");
  const s = wide();
  s.weekly = [{ wk: "2026-03-02", trend: 181 }, { wk: "2026-03-09", trend: 180 }];
  const r = T.currentRate(s);
  assert.deepEqual(r.rates, [1], d10site("energy.cjs:228 currentRate — rates[] over the spring-forward week",
    [1.005988023952096], r.rates));
  // the rendered reach: with every weekly rate now exactly equal, the forecast
  // card's band term is zero and the "+-" clause disappears from the row.
  const row = String((labCard("2026-03-16", "forecast").lines || [])[0]);
  assert.equal(row, "wk +1 · Mon 3/23 · 179.0 lb · 16.2% bf · lean 150.0",
    d10site("energy.cjs:228 -> sleep.cjs:798 forecast row",
      "wk +1 · Mon 3/23 · 179.0 lb ±0.0 · 16.2% bf · lean 150.0", row));
  // control: two non-transition weeks, unmoved by the repair.
  const c = wide();
  c.weekly = [{ wk: "2026-09-03", trend: 181 }, { wk: "2026-09-10", trend: 180 }];
  assert.deepEqual(T.currentRate(c).rates, [1]);
});

// ---------------------------------------------------------------------------
// SITE 3/8 — `sleep.cjs:634` (B1 owns the file, NOT this line), `labAnalytics`
// pivot-probability cone:
//   rts.push(Math.max(-10, Math.min(10, (w2[i-1].trend - w2[i].trend) / Math.max(0.5, weeksBetween(w2[i-1].wk, w2[i].wk)))));
// The site's own value moves. The CARD's printed value does not: the cone
// reports whole weeks (`spread80`, `dISO`), and a 0.6 % shift in one of the
// rates is quantised away — measured on three fixtures (flat-then-drop,
// steady 2 lb/wk, and two transitions in one series), the rendered cone was
// byte-identical on base and candidate. That is the useful fact for the
// golden budget, and it is recorded here rather than smoothed over.
cell("B1-D10-site-sleep-634-cone-rate-denominator-is-calendar-weeks", SITE, () => {
  const T = engine("2026-09-03");
  const w2 = [{ wk: "2026-03-02", trend: 181 }, { wk: "2026-03-09", trend: 180 }];
  const rt = Math.max(-10, Math.min(10,
    (w2[0].trend - w2[1].trend) / Math.max(0.5, T.weeksBetween(w2[0].wk, w2[1].wk))));
  assert.equal(rt, 1, d10site("sleep.cjs:634 labAnalytics cone — rts[0] over the spring-forward week",
    1.005988023952096, rt));
  // control: the 0.5-week floor and the +-10 clamp are untouched by D10.
  assert.equal(Math.max(0.5, T.weeksBetween("2026-03-09", "2026-03-11")), 0.5);
  const steep = [{ wk: "2026-03-02", trend: 200 }, { wk: "2026-03-09", trend: 180 }];
  assert.equal(Math.max(-10, Math.min(10,
    (steep[0].trend - steep[1].trend) / Math.max(0.5, T.weeksBetween(steep[0].wk, steep[1].wk)))), 10);
});

// ---------------------------------------------------------------------------
// SITE 4/8 — `sleep.cjs:807` (B1 owns the file, NOT this line), `labAnalytics`
// lift-slope regression:
//   const x = pts.map((q) => weeksBetween(pts[0].d, q.d)), y = pts.map((q) => q.top);
// Unlike the cone, this one DOES reach the athlete's screen: the slope is
// printed to two decimals in the forecast card's projection line.
cell("B1-D10-site-sleep-807-lift-slope-x-axis-is-calendar-weeks", SITE, () => {
  const T = engine("2026-09-03");
  const pts = [{ d: "2026-03-02", top: 8 }, { d: "2026-03-09", top: 10 }, { d: "2026-03-16", top: 12 }];
  const x = pts.map((q) => T.weeksBetween(pts[0].d, q.d)), y = pts.map((q) => q.top);
  assert.deepEqual(x, [0, 1, 2], d10site("sleep.cjs:807 labAnalytics — regression x-axis",
    [0, 0.994047619047619, 1.994047619047619], x));
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (x[i] - mx) * (y[i] - my); den += (x[i] - mx) * (x[i] - mx); }
  const slope = den > 0 ? num / den : null;
  assert.equal(slope, 2, d10site("sleep.cjs:807 labAnalytics — reps-per-week slope",
    2.005964191091732, slope));
  // the rendered reach: the printed projection line for the same three sessions.
  const line = (labCard("2026-03-16", "forecast").lines || []).filter((l) => String(l).indexOf("reps/wk") > -1)[0];
  assert.equal(String(line), "Press: 100×12 now → 130×10 in 8 wks (+2.00 reps/wk, n=3)",
    d10site("sleep.cjs:807 -> sleep.cjs:819 projection line",
      "Press: 100×12 now → 130×10 in 8 wks (+2.01 reps/wk, n=3)", String(line)));
});

// ---------------------------------------------------------------------------
// SITE 5/8 — `migrate.cjs:301` (B3's file), `reconcileTrendChain`:
//   const first = s.reads.find((r) => ... r.d >= w.wk && weeksBetween(w.wk, r.d) < 1);
// The week's FIRST clean read. Across the spring-forward the NEXT Monday's
// read used to fall inside the previous week's window, so the settle rewrote
// that week's stored snapshot from a read belonging to the following week.
// After the repair it does not, and the snapshot is left alone.
cell("B1-D10-site-migrate-301-weekly-first-clean-read-window", SITE, () => {
  const T = engine("2026-09-03");
  const s = { reads: [{ d: "2026-03-09", w: 200, pt: 190 }], weekly: [{ wk: "2026-03-02", trend: 0 }], feed: [] };
  const w = T.reconcileTrendChain(s).weekly[0];
  assert.deepEqual(w, { wk: "2026-03-02", trend: 0 },
    d10site("migrate.cjs:301 reconcileTrendChain — weekly[0] after the settle",
      { wk: "2026-03-02", trend: 190.4 }, w));
  // control: a read SIX calendar days into the same week is inside the window
  // on both engines, so the cell is measuring the boundary, not the mechanism.
  const c = { reads: [{ d: "2026-03-08", w: 200, pt: 190 }], weekly: [{ wk: "2026-03-02", trend: 0 }], feed: [] };
  assert.deepEqual(T.reconcileTrendChain(c).weekly[0], { wk: "2026-03-02", trend: 190.4 });
});

// ---------------------------------------------------------------------------
// SITE 6/8 — `migrate.cjs:1203` (B3's file), `patchV59`:
//   const first = allSorted.find((r) => ... r.d >= w.wk && weeksBetween(w.wk, r.d) < 1);
// The same window, in the re-class replay. The three attested dates come from
// the module's own exported `SCALE1_RECLASS` table rather than being retyped
// here, and the week under test is the 2027 spring-forward — the replay only
// touches weeks at or after the earliest attested date, so 2026's transition
// is out of its reach and 2027's is the nearest one that is not.
cell("B1-D10-site-migrate-1203-weekly-replay-window", SITE, () => {
  const T = engine("2027-03-20");
  const build = (lastReadISO) => {
    const reads = T.SCALE1_RECLASS.map((k, i) => ({ d: k.d, w: k.w, pt: 170 + i, offWindow: true }));
    reads.push({ d: lastReadISO, w: 180, pt: 180 });
    return { reads, weekly: [{ wk: "2027-03-08", trend: 0 }], feed: [], trend: 180 }; };
  const w = T.patchV59(build("2027-03-15")).weekly[0];
  assert.deepEqual(w, { wk: "2027-03-08", trend: 0 },
    d10site("migrate.cjs:1203 patchV59 — weekly[0] after the replay",
      { wk: "2027-03-08", trend: 169.3 }, w));
  // control: six calendar days in, inside the window on both engines.
  assert.deepEqual(T.patchV59(build("2027-03-14")).weekly[0], { wk: "2027-03-08", trend: 169.3 });
});

// ---------------------------------------------------------------------------
// SITE 7/8 — `writers.cjs:1587` (B3's file), `runAdaptive`:
//   if (!s.weekly.some((w) => w.wk === monday) && s.reads.some((r) => ... weeksBetween(monday, r.d) >= 0 && weeksBetween(monday, r.d) < 1))
//     s.weekly.push({ wk: monday, trend: s.trend });
// Two calls on one line. Before the repair a read dated the NEXT Monday
// opened a weekly snapshot for the CURRENT week; after it, it does not.
cell("B1-D10-site-writers-1587-runAdaptive-weekly-push-window", SITE, () => {
  const T = engine("2026-03-08");
  const s = wide(); s.reads = [{ d: "2026-03-09", w: 180, pt: 180 }]; s.weekly = [];
  const wk = T.runAdaptive(s, "2026-03-08").weekly;
  assert.deepEqual(wk, [],
    d10site("writers.cjs:1587 runAdaptive — weekly after the run (monday 2026-03-02)",
      [{ wk: "2026-03-02", trend: 180 }], wk));
  // control: a read inside the week still opens the snapshot on both engines.
  const c = wide(); c.reads = [{ d: "2026-03-06", w: 180, pt: 180 }]; c.weekly = [];
  assert.deepEqual(T.runAdaptive(c, "2026-03-08").weekly, [{ wk: "2026-03-02", trend: 180 }]);
});

// ---------------------------------------------------------------------------
// SITE 8/8 — `writers.cjs:2432` (B3's file), `undoRead`:
//   const stillClean = s.reads.some((x) => !x.sealed && x.d >= monday && weeksBetween(monday, x.d) < 1);
//   if (!stillClean) s.weekly = s.weekly.filter((w) => w.wk !== monday);
// The mirror of site 7. Undoing the only read genuinely inside the week used
// to leave the week's snapshot standing on the strength of a read belonging
// to the NEXT week; now the snapshot goes with the read, which is the whole
// point of `undoRead`.
cell("B1-D10-site-writers-2432-undoRead-weekly-retain-window", SITE, () => {
  const T = engine("2026-03-16");
  const s = wide();
  s.reads = [{ d: "2026-03-04", w: 181, pt: 181 }, { d: "2026-03-09", w: 180, pt: 180 }];
  s.weekly = [{ wk: "2026-03-02", trend: 181 }];
  const wk = T.undoRead(s, "2026-03-04").weekly;
  assert.deepEqual(wk, [],
    d10site("writers.cjs:2432 undoRead — weekly after undoing the week's only read",
      [{ wk: "2026-03-02", trend: 181 }], wk));
  // control: a second read genuinely inside the week keeps the snapshot on
  // both engines, so the cell is measuring the window and not the removal.
  const c = wide();
  c.reads = [{ d: "2026-03-04", w: 181, pt: 181 }, { d: "2026-03-08", w: 180, pt: 180 }];
  c.weekly = [{ wk: "2026-03-02", trend: 181 }];
  assert.deepEqual(T.undoRead(c, "2026-03-04").weekly, [{ wk: "2026-03-02", trend: 181 }]);
});

// ===========================================================================
// C4 / review r2 C-r2-2(b) — D10's SOURCE AND ALIAS ASSERTION, committed.
//
// `D10-2 utc-stamp-substitution` replaces the repaired body with the law's own
// control shape, `(Date.UTC(..) - Date.UTC(..)) / 604800000`. Five independent
// harnesses (builder, review r1, the r1 fix pass, review r2, the r2 fix pass)
// each measured that NOTHING moves behaviourally: the two forms are
// bit-identical on every date-only input, because both endpoints are stamped
// consistently. So the mutant is not killable by a value, and BRIEF v1.2 §2
// D10 names its kill exactly: "an alias trace showing a UTC constructor".
//
// This cell is that trace, and it is a POSITIVE assertion about the primitive's
// own declaration — not a source-pin refusal, which `BRIEF-IMPORT-GUARDS.md:89`
// says earns no kill. It reads ONE declaration and makes claims that only an
// edit to THAT declaration can break: measured against all 33 mutants, it fires
// on the three that edit `dates.cjs` (`D10-1`, `D10-2`, `D10-3`) and holds
// under the other thirty. A pin over the file's bytes would have "killed" all
// 33; this one is declaration-scoped, which is the difference.
//
// The PM still owns C-r2-2: the closed profile must (a) list this file as a
// REQUIRED package artifact and (b) carry this assertion. (b) is now an
// executable artifact in the repository rather than a sentence in a brief, and
// (a) is exactly what makes it binding.
cell("B1-D10-weeksBetween-is-calendar-based-by-source-and-is-the-primitives-only-definition",
  ["D10-2 utc-stamp-substitution"], () => {
  const fs = require("node:fs");
  const p = require("node:path");
  const read = (f) => fs.readFileSync(p.join(__dirname, "..", f), "utf8");
  const declOf = (src, name, where) => {
    const key = "\nconst " + name + " = ";
    const i = src.indexOf(key);
    assert.ok(i > -1, where + " must declare `" + name + "` at the top level");
    assert.equal(src.indexOf(key, i + 1), -1, where + " declares `" + name + "` more than once");
    const rest = src.slice(i + 1);
    const stops = ["\nconst ", "\nfunction ", "\nreturn ", "\nlet ", "\nvar ", "\n//", "\n/*"]
      .map((t) => rest.indexOf(t)).filter((k) => k > 0);
    return rest.slice(0, stops.length ? Math.min.apply(null, stops) : rest.length);
  };
  const forbid = (text, bad, what) => bad.forEach((b) => assert.equal(text.indexOf(b), -1,
    what + " must not contain `" + b + "` — found it in: " + text.trim()));

  const dates = read("dates.cjs");
  const wb = declOf(dates, "weeksBetween", "dates.cjs");
  const pd = declOf(dates, "plusDays", "dates.cjs");
  const mkd = declOf(dates, "mk", "dates.cjs");

  // (1) `weeksBetween` counts CALENDAR DAYS: it rounds the DAY count — never
  //     the week — and it reads both endpoints through the calendar helper.
  assert.ok(wb.indexOf("Math.round(") > -1, "weeksBetween must round the DAY count: " + wb.trim());
  assert.equal((wb.match(/\bmk\(/g) || []).length, 2, "weeksBetween must read BOTH endpoints through mk(): " + wb.trim());
  assert.ok(wb.indexOf("/ DAY)") > -1 && wb.indexOf(") / 7") > -1,
    "weeksBetween must divide the rounded DAY count by 7: " + wb.trim());
  // (2) and it does so from LOCAL calendar midnights, never a UTC stamp or an
  //     elapsed-hours constant. This is the clause that kills `D10-2`.
  forbid(wb, ["Date.UTC", "604800000", "86400000", "864e5", "getTime(", "getTimezoneOffset",
    "toISOString", "Date.parse", "new Date(", "7 * 24", "24 * 60", "168"], "weeksBetween's declaration");
  // (3) the calendar helper it calls is itself local, so the kill cannot be
  //     moved one level down into `mk`.
  assert.ok(mkd.indexOf("new Date(y, m - 1, d)") > -1, "mk must build a LOCAL midnight: " + mkd.trim());
  forbid(mkd, ["Date.UTC", "toISOString", "Date.parse"], "mk's declaration");
  // (4) `plusDays` steps the calendar date, never milliseconds (`D10-3`).
  ["setDate(", "getDate(", "mk(", "isoOf("].forEach((t) => assert.ok(pd.indexOf(t) > -1,
    "plusDays must step the calendar date: " + pd.trim()));
  forbid(pd, ["DAY", "864e5", "86400000", "getTime(", "Date.UTC", "new Date("], "plusDays's declaration");
  // (5) BRIEF v1.2 §A item 7 — `plusDays` has no frozen counterpart, so it is
  //     declared ABOVE the fe516c1:311 marker and never between the marker and
  //     `weeksBetween` (`postfix/source-proof.cjs:11 declarationRanges()` names
  //     each range by the first declaration after such a marker).
  assert.ok(dates.indexOf("// Copied from frozen src/app.jsx @ fe516c1:311-311.\nconst weeksBetween = ") > -1,
    "the fe516c1:311 marker must sit immediately above `weeksBetween`");
  assert.ok(dates.indexOf("const plusDays = ") < dates.indexOf("@ fe516c1:311-311."),
    "`plusDays` must be declared above the fe516c1:311 marker");
  // (6) the export surface: exactly the seven frozen names plus `plusDays`.
  const ret = dates.slice(dates.lastIndexOf("\nreturn {")).split(";")[0];
  assert.deepEqual(ret.replace(/[\s\n]/g, "").replace("return{", "").replace("}", "").split(","),
    ["DAY", "mk", "isoOf", "todayStart", "daysUntil", "fmtShort", "weeksBetween", "plusDays"],
    "dates.cjs's export set must be the seven frozen names plus plusDays: " + ret.trim());

  // (7) THE ALIAS TRACE. Every module that consumes the primitive delegates to
  //     the ONE definition above; none of them re-declares it. Without this a
  //     mutant could leave `dates.cjs` pristine and substitute a UTC form in a
  //     single consumer, and every value cell in this file would still hold.
  const DELEGATE = (n) => "const " + n + " = (...args) => E." + n + "(...args);";
  [["energy.cjs", "weeksBetween"], ["sleep.cjs", "weeksBetween"], ["migrate.cjs", "weeksBetween"],
   ["writers.cjs", "weeksBetween"], ["sleep.cjs", "plusDays"], ["policy.cjs", "plusDays"],
   ["today.cjs", "plusDays"]].forEach(([f, n]) => {
    const src = read(f);
    const decls = (src.match(new RegExp("^\\s*(const|let|var|function)\\s+" + n + "\\b", "gm")) || []);
    assert.equal(decls.length, 1, f + " must declare `" + n + "` exactly once (the delegate), found " + decls.length);
    assert.ok(src.indexOf(DELEGATE(n)) > -1, f + " must alias `" + n + "` to the shared table: " + DELEGATE(n));
  });
  // and the primitive is defined in exactly one engine module.
  ["energy.cjs", "sleep.cjs", "migrate.cjs", "writers.cjs", "policy.cjs", "today.cjs"].forEach((f) => {
    forbid(read(f).split("\n").filter((l) => l.indexOf("weeksBetween") > -1 || l.indexOf("plusDays") > -1)
      .filter((l) => l.indexOf("=> E.") === -1).join("\n"), ["Date.UTC", "604800000"],
      f + "'s weeksBetween/plusDays call sites");
  });
});

// ---------------------------------------------------------------------------
// Run every cell. A cell that aborts the file would hide the ones behind it, so
// failures are collected and the count is reported: N/N on the repaired
// candidate, 0/N on the pre-B1 base, and on a single-hunk revert exactly the
// cells that hunk carries.
let held = 0;
const failed = [];
for (const c of CELLS) {
  const tag = c.kills.length
    ? "  [kills: " + c.kills.join(" | ") + "]"
    : "  [D10 call site outside B1's modules — PM acceptance condition, no named mutant]";
  try { c.run(); held++; console.log("HOLD " + c.name + tag); }
  catch (e) {
    failed.push(c.name);
    console.log("FAIL " + c.name + tag);
    console.log("     " + String(e && e.message || e).split("\n").slice(0, 3).join(" / "));
  }
}
const kills = CELLS.reduce((a, c) => a + c.kills.length, 0);
const sites = CELLS.filter((c) => !c.kills.length).length;
console.log("B1 DELTA CELLS: " + held + "/" + CELLS.length + " hold; " + kills
  + " named mutants carried (D10-2 by source/alias assertion, every other by value); "
  + sites + " D10 call sites outside B1's modules enumerated with before/after values");
if (failed.length) {
  console.error("B1 DELTA CELLS FAILED: " + failed.join(", "));
  process.exitCode = 1;
}
