# S6-C SMALL ITEMS - INDEPENDENT REVIEW R1 (Opus high)

VERDICT: REJECT

Reviewed c0a4e6cf478ab60ad10e4eaba075ca36a29f8c04, base 0ac72ea. Detached worktree
%TEMP%\earned-s6c-rv, junctions only, no npm. My cells are OUTSIDE the repo, under
%TEMP%\s6c-rv\ (rv*.test.mjs, mutate.mjs, red.cmd, scan*.mjs); stub-free, driving boot()
over fake-indexeddb and the shipped template. Synthetic only; no engine byte moved.

DRIFT reproduced exactly - 7 files, each findstr'd vs packages/S5.json. PINNED BY S5 (4):
w6/test/local-today-journey.test.mjs, today/today-entry.mjs, today/today-app.cjs,
today/test/problem.test.mjs. NOT IN S5 (3): today/build.mjs, today/problem-report.cjs,
lanes/c/S6-SMALL-AUTHOR-REPORT.md. No new file under today/test. b-package S5 red is the
expected seal fact (:455/:467).

## 1. BLOCKING - item 4 does not work on the built page: it prints "Build unknown"
injectCommit() replaces the LITERAL "commitnotinjected", whose only occurrence in the
bundle is the declaration of COMMIT_PLACEHOLDER itself. .tmp/w7-today-dist/app.js at
c0a4e6c, verbatim:

    var COMMIT_PLACEHOLDER = "c0a4e6c";
    var COMMIT = COMMIT_PLACEHOLDER;
    function buildFooterLine(commit) {
      const named = typeof commit === "string" && commit && commit !== COMMIT_PLACEHOLDER;
      return "Build " + (named ? commit : COMMIT_UNKNOWN); }

COMMIT === COMMIT_PLACEHOLDER is STILL true after injection, so `named` is false and the
SERVED page prints "Build unknown" while A1 stdout says "commit c0a4e6c". Evaluated, not
argued: %TEMP%\s6c-rv\scan3.mjs runs that exact snippet under node:vm ->
    --- WHAT THE SHIPPED PAGE PRINTS: "Build unknown" ---
:468 (b) asked for the one thing this does not deliver. WHY THE CELL IS GREEN: S6C.7b
asserts only that the sha is SOMEWHERE in the bundle; it never renders the built footer.
The build id beside it survives the same aliasing only because problem-report prints
`"build": BUILD` with NO comparison - the new code added an equality test against the
very constant the injection rewrites. Fix: compare against something replace() cannot
touch (or test the sha shape), and assert the BUILT footer text.

## 2. MAJOR - item 3 leaves the gym stub screen with an EMPTY heading
sessionTitle is now null whenever the stamp is not today's. The report and the new comment
both say gym-app falls back to `view.title || view.session.instruction.display`. That
exists at gym-app.mjs 310, 444, 466 - NOT at gym-app.mjs:216, the stub() screen, which is
`put(map, 'workout-title', view.title || '')` and serves BOTH the refusal screen and the
"workout recorded" screen. RV7 (rv4.test.mjs), real boot, enrolled, 2026-09-16:
    RV7 view: {"day":"2026-09-16","phase":"blocked","title":null}
    RV7 workout-title on the gym screen: ""
At base that heading read "LOWER BODY · TOMORROW". Trading a misleading head for a blank
one may be right, but it is unstated, no cell covers it, and the stated mechanism does
not hold on this path. Give stub() the same fallback, or state the empty heading.
## 3. MINOR - a tautological assertion in S6C.7b
`assert.equal(app.split('Build ' + result.commit).length - 1 >= 0, true)` is true for
every input; `assert(app.includes('"Build "') || app.includes('Build '))` is satisfied by
the format literal alone. Neither can fail - and they are the two that look like they
guard finding 1 (they are what should have caught it).
## 4. MINOR - the build now embeds HEAD, so every commit rotates the PWA cache
app.js bytes are now a function of the commit: a docs-only commit changes every asset
hash and the sw cache name and forces a full re-download for every installed client, and
a build tail stops being reproducible across commits. The report's A5 tail
(earned-slice-7f1a05...) does not reproduce; two clean runs at c0a4e6c both give
earned-slice-f661d62e810b8288f7847c126836f1d4.
## 5-7. MINOR / NOTE
(5) RESUME_TODAYS_WORKOUT is "Resume today's workout" with an ASCII apostrophe, against
the page's own "Earned could not prepare today's workout" (U+2019 there): two
apostrophes on one screen. (6) local-today-journey.test.mjs:676 names three guard cells
holding their own chain-reader copy; there are four - food.test.mjs:792,
machine-settings-ui.test.mjs:709, setup.test.mjs:2315, measure/boundary.test.mjs:83.
(7) today-app.cjs ~2205 still reads "making setup the landing screen would change what
every merged suite and check boots into" - the A4 residual this ticket closes.

## CONFIRMED GREEN
Item 1: RV1 real boot, fresh store, live clock -> screen() 'setup', screen1Head painted,
zero sample strings. RV2 enrolled -> 'today', athlete_label Dad, no mark. firstRun() is
`host && enrolled === false` = the ticket's "setup summary NOT enrolled". No existing cell
amended; declared-day callers keep the preview (S4's trick). Item 2: RV3 - the LIVE
?screen=today preview carries the mark, byte-equal to "Sample data. Set up your week to
start your own.", above [data-slot=kcal]; absent on every enrolled frame.
Item 3 mechanism verified against engine/today.cjs:588-598 (`today: k9 === 0`; pure in
day+split, no hour). RV6 drives ONE live page through the shipped rollover watcher across
local midnight: 23:59 {"day":"2026-09-17","title":"UPPER BODY · TODAY"} -> 00:01
{"day":"2026-09-18","title":"LOWER BODY · TODAY"}. No stale stamp survives midnight.
Item 5: the export was imported by nothing (tree-wide findstr). NO ASSERTION REMOVED
ANYWHERE: all 36 deleted lines are comments, two re-pinned shas, the dead export, and
four expressions replaced in place. RED SIDE, each applied then reverted (red.cmd):
M1 revert the landing -> 3/12 S6C red + RV1; M2 drop sampleNote() -> 2/12 + RV3; M3
revert the sessionTitle guard -> S6C.6c; M4 drop the footer append -> S6C.7 + RV4;
M5 flatten resumeLabel -> S6C.6b. HYGIENE: 0 CRLF, 0 U+2013/U+2014 in any new
user-facing string across the 7 files.

## TAILS (mine, this worktree)
today-17 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York), split in two runs: part A
(7 files) `tests 276 / suites 0 / pass 275 / fail 1`; part B (10 files) `tests 402 /
pass 398 / fail 4` => 678 / 673 / 5, as reported. The 5 reds are the declared-bytes guard
only (food N1.18, boundary P-MEASURE (g), machine-settings-ui S10, setup re-pin x2),
each naming an undeclared path, closed by packages/S6.json. W6 `tests 586 / pass 586 /
fail 0`. coach `tests 231 / pass 231 / fail 0`. client `tests 18 / pass 18 / fail 0`.
lane B tooling `tests 91 / pass 91 / fail 0`. measure hermetic `tests 11 / pass 11 /
fail 0`. rig187 `rig187 ⇒ PASS`.
A1 `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build
earned-f6d049be68e4; commit c0a4e6c; approved design pinned; 69 bound classes; ...`
A5 `A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by
sha256; cache name earned-slice-f661d62e810b8288f7847c126836f1d4 ...`
