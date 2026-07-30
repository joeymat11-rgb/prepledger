// A FROZEN CLOCK FOR THE ENGINE SUITE. Harness only — no engine code, no data.
//
// Why this exists. The engine suite built its fixtures relative to the real
// clock: `isoL(Date.now() - k * 864e5)` planted sessions 12, 10, 8, 6 and 5 days
// "ago". But the engine is weekday-driven — lift days are Tue/Fri via dayType(),
// week keys anchor to Monday, the refeed is Wednesday. So a fixed *day offset*
// lands on a different *weekday* depending on what day you ran the suite, and
// the same fixture legitimately meant different things on different days.
//
// The result was a suite that passed on Wednesday and failed on Thursday. It
// went red in CI the moment UTC rolled over to Jul 30 while the author's machine
// was still on Jul 29 — 866 assertions became 288 plus three failures, on code
// that had not changed. That is not a flaky test; it is a test whose meaning
// drifts. The engine was right every time.
//
// So the clock stops. Every date the suite derives now hangs off one anchor.
//
// Choosing the anchor was not guesswork — the window was measured by running the
// suite against a swept anchor, one day at a time:
//
//     2026-07-20 Mon   264 passed, 8 failed
//     2026-07-22 Wed   855 passed, 1 failed   <- the seed's own "as of" date
//     2026-07-24 Fri   866 PASS
//     2026-07-26 Sun   866 PASS
//     2026-07-27 Mon   866 PASS
//     2026-07-28 Tue   866 PASS
//     2026-07-29 Wed   866 PASS               <- ANCHOR
//     2026-07-30 Thu   288 passed, 3 failed   <- what broke CI
//     2026-07-31 Fri   288 passed, 3 failed
//     2026-08-05 Wed   287 passed, 1 failed
//
// Two things fall out of that table. The fixtures are pinned to an absolute
// window (2026-07-24 → 2026-07-29), not merely to a weekday — 2026-08-05 is also
// a Wednesday and still fails, because the relative offsets stop overlapping the
// hardcoded 2026-07-23/24 sessions and SEAL_UNTIL 2026-07-27. And inside that
// window every day yields the full 866, meaning the offsets land on the weekdays
// the assertions were written for.
//
// 2026-07-29 is the one Wednesday in the window, so it satisfies the app's own
// rhythm — Tue/Fri lifts, Monday week-keys, Wednesday refeed — and it is the
// exact clock the suite was passing under when it was frozen, so freezing changes
// nothing about what is verified.
//
// It does sit at the top of the window. If a future fixture edit shifts that
// window, this anchor is the first thing to fail — but it will fail the same way
// on every machine, every run, which is the whole point. Re-sweep the table above
// and move the anchor deliberately. Do not reach for the real clock again.
//
// This must be imported BEFORE ../src/app.jsx so the app module's top level sees
// the frozen clock too. ES imports evaluate in order, so keep it first.
//
// Override for debugging a specific date:  MEASURED_TEST_NOW=2026-08-05 npm test

const ANCHOR = process.env.MEASURED_TEST_NOW || "2026-07-29"; // Wednesday
const [Y, M, D] = ANCHOR.split("-").map(Number);

const RealDate = Date;

// Local noon, deliberately. Constructing from local components means the anchor's
// calendar date reads as 2026-07-29 in every timezone a runner might use, and
// noon keeps it clear of both midnight boundaries and any DST shift. This is what
// makes the suite give the same answer in America/New_York and in UTC.
const FIXED = new RealDate(Y, M - 1, D, 12, 0, 0, 0).getTime();

class FrozenDate extends RealDate {
  constructor(...args) {
    // Only the "what time is it now?" form is frozen. Every explicit form —
    // new Date(iso), new Date(y, m, d), new Date(ms) — behaves normally, which
    // the fixtures depend on heavily.
    if (args.length === 0) super(FIXED);
    else super(...args);
  }
  static now() {
    return FIXED;
  }
}

globalThis.Date = FrozenDate;

export const FIXED_NOW = FIXED;
export const FIXED_ANCHOR = ANCHOR;
