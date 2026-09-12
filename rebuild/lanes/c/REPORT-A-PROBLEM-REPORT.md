# REPORT A PROBLEM - REPORT

Branch `rebuild/lane-c-report`, base `origin/rebuild/t2-client-core`, brief `REPORT-A-PROBLEM-BRIEF.md` (DECISIONS:140 (3)). Round 1 ACCEPT WITH CONDITIONS, reviewer 8fb98b8. Evidence: `REPORT-A-PROBLEM-REPORT-ANNEX.md` and `REPORT-A-PROBLEM-REVIEW.md`.

## WHAT IT COPIES

Eight fields, in this order, one `field: value` line each, and nothing else:

    screen: today                      lane open: workout, checkin, setup
    enrolment: enrolled                offline-ready: unknown
    build: earned-bc21800ed5dc         device: device-3f9a1c07
    user agent: Mozilla/5.0 (...)      at: 2026-09-12 06:41:20 -04:00

`screen` is the router's own id; `lane open` is which of boot's three handles the view holds, or `none`; `enrolment` is one of `first-run`, `enrolled`, `restore-required`, `no-store`; `offline-ready` is `ready`, `not-ready` or `unknown`; `build` is `earned-` plus the first 12 hex of sha256 over the pinned input inventory (path plus per-file sha, sorted), injected into the bundle at build time; `device` is `device-` plus the FIRST 8 HEX of this installation's id, or `none`; `at` is the same triple an operation carries.

NO health value, reading, set, check-in answer, exercise name, athlete label, operation id, payload or 32-hex id - asserted over a real store, and since round 1 asserted as a SHAPE too: eight lines, eight keys in order, every enumerated value in its own set.

## THE WORDING, AND THE FALLBACK

One sentence for both phones: **"Copied. Send it to Joe."**, and **"Select all and copy, then send it to Joe."** when the clipboard refused or is absent. The brief's "Paste it to Joe" is Joe's-phone wording; on Dad's he is not pasting into a PM chat, and the page cannot know whose phone it is before the first run has named him (C2: the lane lead posts the REQUESTS line). The box is UNCONDITIONAL, not a polyfill: it opens on success too. Whether `clipboard.writeText` works in an installed iOS app is not verifiable here (`A5-REPORT.md:524-528`) and nothing depends on the answer; in headless Edge it did copy.

## ROUND 1: C1, C3 AND C4 APPLIED

**C1** is the one that mattered. Two reviewer mutants survived, because every test here looked for a value it had PLANTED, and neither a ninth field nor a field carrying something it should not is a planted value. Two new tests look at what a field may BE instead: eight lines, the eight keys in order, every enumerated value in its own set, `user agent` byte-equal to `navigator.userAgent` and barred from carrying `{`, `}` or `"`. RED executed - **E2** (`JSON.stringify(model.read())` into `user agent`) **25 tests, 23 pass, 2 fail**; **Z4** (a ninth field) **25, 17 pass, 8 fail**; both together 17/8 - then restored **25/25**.

**C4**: the browser check now asserts the primary action is in view WITH THE BOX OPEN at both widths, measured 452 to 511 and 444 to 503 of 842 - the reviewer's own numbers. **C3**: `rebuild/coach/BRIEF-COACH-WAVE1-TEXT.md` (178 lines, docs-only) rides this branch inside lane C's own licence (LANES.md:10) but outside this build's custody list; it is named here rather than moved, and `C6-INDEX.md` is not in the diff at all. C5, the three-row hand test, is the owner's and is still owed.

## COUNTS (Windows, on this head)

`rebuild.yml`'s today step as written **164** / setup **157** / catalogue **43** / copy **36** / problem **25** / W6 **552** / journey **51** (PAGE_PINS unmoved) / A0 host **32** / w7 **19**, all 0 fail. Four msedge checks PASS. The first RED, executed: against a builder returning `""`, 23 tests, 10 pass, 13 fail. Eleven mutants killed (E1-E6, E8, E9, plus E2, Z4 and E2+Z4); E7 is executed inside R3.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package
    verdict; the 19 original gates, the private oracle and independent exact-artifact
    acceptance remain separate
    A1 TODAY BUILD PASS: 3 assets; 104 pinned inputs (13 engine, 12 client); build
    earned-bc21800ed5dc; approved design pinned; 68 bound classes; no em/en dash in
    any text the athlete can see

## WHAT THE BRIEF ASKED FOR AND THIS DOES NOT DO

`today-entry.mjs` is PINNED ON DISK by the merged B-NTC artifact through `local-today-journey.test.mjs` PAGE_PINS, with `gym-host.mjs`, `reading-host.mjs` and `checkin-host.mjs`. The brief sources two fields from boot's return; neither could go through a new `boot()` argument without turning that pinned suite red, so both are read from what the view already holds - the installation's authority lease, and the page's own status line for a state-18 refusal. Same values, no pinned byte. The control is on Today only, so `screen` reads `today` whenever it can be tapped; the gym card is a second brief.

## SERVED, AND PREFLIGHT (DECISIONS:135 (3), self-check)

http://127.0.0.1:4178/ , `serve.mjs` pid **47516**, rebuilt on this head; `/app.js` **1451893 bytes**, carrying `earned-bc21800ed5dc` and no placeholder. Diff inside custody **PASS**: 14 paths - 8 under `w7-preview/today/`, 5 under `lanes/c/` (the brief, this report and its annex, the reviewer's two files), and the disclosed `rebuild/coach/` brief; nothing under `rebuild/m3/w6/`, `m4`, `engine`, `client` or `.github`. Report <= 60 **PASS**; no U+2013/U+2014 in UI custody **PASS**; counts present **PASS**; CI run ids in the annex.
