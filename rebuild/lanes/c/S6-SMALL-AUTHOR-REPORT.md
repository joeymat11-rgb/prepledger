# S6-C SMALL ITEMS - AUTHOR REPORT (ROUND 3)
Branch `rebuild/c-s6-small` off `origin/rebuild/t2-client-core` 0ac72ea (DECISIONS:468 point 17, extended by
the PM). Lane C, Opus high. Supersedes rounds 1 and 2. No `rebuild/engine` byte moves; no test file was added
(the 13-name rule under `today/test` holds) and every new cell is in `today/test/problem.test.mjs`; round 3
also declares one option inside an existing w6 host cell, which is finding 1.
## THE FIVE ITEMS AT THIS HEAD
1 SETUP FIRST ON A FRESH INSTALL (:463, "A fresh install should open on setup first"). boot() computes
`setupFirst` (default `!!live`; `live` is non-null only for the shipped page, which declares no day) and hands
it to mountToday: `render(requestedScreen() || (setupFirst && firstRun() ? "setup" : "today"))`. Nothing else
moves - `firstRun()` is false for an enrolled device, a store that did not open and RESTORE_REQUIRED, and a
declared-day caller keeps the preview byte for byte. Cells S6C.1, S6C.2, S6C.2b, S6C.3, S6C.4.
2 SAMPLE LABEL (:468 (c)). `SAMPLE_DATA_NOTE` = "Sample data. Set up your week to start your own.", built in
code not in the template, above the first figure, shown exactly while `firstRun()`. Cells S6C.5, S6C.5b.
3 LATE-EVENING HEADER (:452, :468 (d)). MECHANISM as this tree executes it (corrected at R2-3): `view.workout`
(rebuild/engine/today.cjs:591-597) is the NEXT SCHEDULED SESSION, whose title stamps the day it lands on
("· TODAY", "· TOMORROW", "· MON 9/21") and is no function of the hour (S6C.6, S6C.6b). THE CARD: on
2026-09-16, the fixture's REFEED day, the engine schedules nothing, `gym.read()` is `blocked` and `gym.start()`
refuses ENGINE_CAPTURE_NO_WORKOUT - so NO lift is logged that day, and the wrong day sat on the REFUSAL card's
heading: "UPPER BODY · TOMORROW" before, "Today’s workout cannot open" now. THE CTA: a session stays open
across the local midnight the page re-boots on, so Resume could name another day over a workout in hand. FIX,
page side only: `sessionTitle` is passed only when `view.workout.today === true` (gym-app.mjs's fallback then
names the session), and `resumeLabel()` / `RESUME_TODAYS_WORKOUT` ("Resume today’s workout", U+2019) replaces
the echoed stamp. Cells S6C.6, S6C.6b, S6C.6c, S6C.6d, S6C.6e.
4 BUILD ID IN THE FOOTER (:468 (b)). `buildFooterLine(commit)` asks "is this a commit" (`SHORT_SHA =
/^[0-9a-f]{4,40}$/`, the shape build.mjs admits at injection), never "is this still the placeholder" - a
replace() reaches the constant that NAMES the placeholder, which is why the BUILT page printed "Build unknown"
in round 1. Cells S6C.7, S6C.7b (the built app.js bytes under node:vm).
5 DEAD EXPORT. `CHILD_SPECS` / `declaredPostIn` deleted from local-today-journey.test.mjs; nothing imported
them, and the four chain readers (food:792, machine-settings-ui:709, setup:2315, measure/boundary:83) each keep
their own copy. No assertion moved.
## ROUND 3 DISPOSITIONS (review `rebuild/lanes/c/S6-SMALL-REVIEW-R2.md`, VERDICT REJECT)
R2-1 BLOCKING, CLOSED - and the reviewer is right that round 2 never ran this suite. `local-real-day.test.mjs`
S4/8 boots the LIVE path over an unenrolled store, so item 1 landed it on setup and `'setup' !== 'today'`
failed at what is now :458. CHOSEN: `setupFirst: false` at that boot, commented with DECISIONS:463 - NOT
enrolment, which would change what the cell measures (its primary tap at :472 carries an UNENROLLED Today
through the weigh-in sheet to a dated record) while its subject, the midnight re-boot, is indifferent to the
landing; boot()'s reopen carries `{...options}`, so all three mounts land alike. The ticket names this option
and it already existed for exactly this: nothing was weakened, no assertion moved, and the two comments
claiming EVERY caller declares its day now name the exception. rebuild.yml:138 step: 38 / 38 / 0.
R2-2 MAJOR, CLOSED by a new cell, S6C.6e: a session started on 2026-09-17 through the real store, still open,
with Today mounted on 2026-09-16 over the shipped template - the shape gym.test.mjs:606 drives one model apart.
`[data-slot="primary-label"]` reads "Resume today’s workout" (U+2019). RED SIDE EXECUTED: with the pre-fix line
restored in renderToday (`"Resume " + view.workout.title`) problem.test.mjs is `tests 131 / pass 130 / fail 1`,
the one red S6C.6e: `+ 'Resume UPPER BODY · TOMORROW'` against `- 'Resume today’s workout'`. Mutant reverted;
today-app.cjs is back at sha dbb10ced.
R2-3 MINOR, CLOSED: the mechanism sentences in today-entry.mjs, today-app.cjs and item 3 now say what runs.
R2-4 MINOR, CLOSED: S6C.6b varies the hour for real now - two live-clock boots on ONE local day, 08:00 and
23:59, both standing on the 16th and both carrying the same stamp.
R2-5 round-1 MINORs, re-verified: RESUME_TODAYS_WORKOUT already carries U+2019 (today-app.cjs:299); the
dead-export comment already names all four chain readers, boundary.test.mjs:83 included. The A4 residual
comment near today-app.cjs:2204 is NOT false - it records that the residual is CLOSED and how - so it is KEPT,
its "every fixture declares its day" clause amended for finding 1.
RE-PIN. today-entry.mjs moves by COMMENT ONLY, so PAGE_PINS is re-pinned to
`ae04f1131bdd068ae7cfec501a308530fd15d24a9a8e2c62a57d4278bbe32393` with the re-read its own message requires.
That hash is what N2-08 (problem.test.mjs:1602) and machine-settings-ui's PAGE_PINS cell read, so both are
green again; no declared hash was loosened.
## TAILS AT THIS HEAD (Node 24, junctions only, no npm; MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)
rebuild.yml:138 (journey.test.mjs, engine-equivalence.test.cjs, local-real-day.test.mjs) `tests 38 / pass 38 /
fail 0`. today-17 in two runs: part A `330 / 328 / 2`, part B `350 / 347 / 3` => `tests 680 / pass 675 / fail 5`
- the declared-bytes guards by name: food N1.18; machine-settings-ui S10 (its journey-suite clause);
measure/boundary P-MEASURE (g), whose actual list is now FIVE names, local-real-day.test.mjs joining it as
finding 1's cost; setup re-pin x2. Each closes when packages/S6.json declares those paths. W6 `586 / 586 / 0`.
coach `231 / 231 / 0`. client `18 / 18 / 0`. rig187 `rig187 ⇒ PASS`. problem.test.mjs alone `131 / 131 / 0`.
A1 `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-247e4d042b74; commit
185195a; approved design pinned; 69 bound classes; 2 pinned typefaces inlined; no literal figure in the
template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the athlete can see`.
A5 `A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name
earned-slice-0ca3474b32acd1946b9d5d5fcfdd6851 derived from those bytes (no version constant); 13 exact header
rules, no-store on sw.js`. BOTH BUILD TAILS WERE TAKEN AT THE PRE-REBASE HEAD 185195a - a commit cannot contain
a build of itself, and the rebase onto the tip rewrote that sha - so by R1-4 re-run A1 at the head under review
and compare its `commit` with `git rev-parse --short HEAD`. `b-package --ci --package S5` stays the expected red
(:455/:467); this work lands in the S6 reseal.
## DRIFT (git diff --name-only against the tip after the rebase, vs packages/S5.json) - NINE paths. S5 PINS (5):
`m3/w6/test/local-today-journey.test.mjs`; `today/today-entry.mjs`; `today/today-app.cjs`;
`today/test/problem.test.mjs`; and NEW `m3/w6/host/test/local-real-day.test.mjs`, the fifth S5-pinned path the
review predicted finding 1 would add. NOT IN S5 (4): `today/build.mjs`; `today/problem-report.cjs`;
`today/gym-app.mjs`; this report. No engine byte, no new file under `today/test`, nothing outside lane C's
custody. Round 3 hygiene, all 189 added lines: 0 CRLF, 0 U+2013/U+2014, 0 tabs. STOPS: none - no engine,
ledger, private, rebuild/conform or soak path was opened, and every figure is synthetic.
