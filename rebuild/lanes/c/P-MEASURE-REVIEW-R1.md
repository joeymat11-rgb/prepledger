# P-MEASURE v1 - INDEPENDENT REVIEW R1

VERDICT: REJECT

Reviewer: cowork (Earned PM), independent, round 1. Subject sha ba58902df0be69dcd93f97f53a83c62f573382c4
on rebuild/c-measure-v1 (parent 806749e1, over tip 7b7400a4). Worktree %TEMP%\earned-measure-rv,
detached, junctions to %TEMP%\earned-ci. Synthetic data only; no measurement datum appears below.
The arithmetic built is correct and the suites are green; the ticket is rejected because the three
things plan section 4 asks the app to DO were not built. What landed is a pure library and a test.

## Findings

1. BLOCKING - nothing is recorded on the device; the waist entry is not an entry.
   Plan 4(1) and the ticket: waist gets "its own small entry, stored in the device store like the
   others". measure-model.mjs has waistRefusalFor/waistFromEntry/projectWaist, but no command, no
   host, no operation, no store. Cell R15b (comments stripped from the source first, because the
   author's own store cell scans text that is almost all comment): no record/commit/save/append call
   and no op_id or device_seq anywhere in measure-model.mjs or measure-view.mjs. Cell R19: no other
   .mjs/.cjs under rebuild/m3/w7-preview/today names waist at all. waistFromEntry returns a plain
   object that no code in the repository ever hands to a store. The shipped Today build still tells
   the athlete "Waist is still an unlogged input ... until entries exist, it changes nothing"
   (.tmp\w7-today-dist\app.js), which is still true after this commit.

2. BLOCKING - there is no comparison view; measure-view.mjs renders nothing.
   Plan 4(3) and the ticket: "ONE comparison view ... the new screen must pass build.mjs (A1)".
   Cell R12: the two modules export no mount/render/paint/open of any kind. Cell R13: neither module
   contains createElement, replaceChildren, appendChild or a data-slot; no approved-design helper from
   today-app.cjs is used. Cell R14b: neither today-app.cjs nor today-entry.mjs imports measure-model
   or measure-view, so no route reaches it. Cell R17: the A1 build's own output does not contain the
   view's text, because these files are not among its 114 pinned inputs. A1 TODAY BUILD PASS is
   therefore not evidence about this work; it passed without looking at it. Same for A5.
   The author's stated reason ("today-app.cjs/today-entry.mjs are pinned") is half wrong:
   today-app.cjs is unfrozen for this ticket. Only today-entry.mjs is pinned.

3. BLOCKING - the baseline window is never taken from local-source-basis.
   Plan 3 and the ticket: the baseline comes from the imported history via local-source-basis, empty
   until P3. Cell R16b: local-source-basis is named only in a comment; buildComparisonView takes
   baselineWeeks as a caller-supplied array and trusts it. The "No baseline yet" string is produced
   by `baselineWeeks.length === 0`, which is true for any caller that passes nothing, import or no
   import. Nothing in the commit can distinguish "no import yet" from "caller forgot the argument",
   and there is no executed cell that shows an imported window appearing after a synthetic C2b
   import. The bar's baseline half is unverified.

4. BLOCKING - b-package S4 fails differently at this sha than at the tip, and the report
   mis-attributes it. At 7b7400a4 (clean, reviewer-run): FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP.
   At ba58902: FAIL SEALED-PROFILE-RECOMPUTATION - a later, product-content gate. Cause is
   arithmetic and does not need the withheld diagnostics: S4.json declares
   rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs with post sha256
   89b8c2577e81201429aad705eb631ca7f1bd4d4ed4d978dccc4ebce75fa33cd2; certutil on the file at
   ba58902 gives 75c66d007b05f24a5762e191f347303a6df175cc09494e88a8179a481835fb21. The file is
   editable under this ticket, but the package must be re-sealed for it, and the report's
   "confirmed unrelated by stashing" is not what the two runs show. Separately, measure-model.mjs,
   measure-view.mjs and measure-fixture.json are undeclared in S4.json's 90 product files, so
   "0 unlisted drift" remains unproven: the run never reaches the drift check.

5. MAJOR - the fixture cannot fail. measure-fixture.json is a regular ramp: a weigh-in on all 84
   days, a waist entry every week, all four markers every week. Every null branch (weightAvg with a
   gap, waist for a missed week, a marker with no set, a zero denominator) is never exercised, so
   "correct arithmetic" is asserted only on the easy path. My own fixture (gaps in weeks 2 and 6,
   missed waist week 4, Bench absent week 6) exercises them and cells R1-R4 pass, which is to the
   author's credit, but the committed evidence does not contain them.

6. MAJOR - logging adherence divides by a hardcoded 7, so a partial week is wrong.
   computeWeek passes the literal 7 to loggingAdherencePct; plan section 2 says "days in week".
   Cell R6: a truncated final week with 3 elapsed days and 3 food days reads 42.9 percent, not 100.
   Cell R7: 8 logged days over a 7-day denominator reads 114.3 percent; nothing clamps it. Joe's
   day one is an install day (DECISIONS :432 c, :452), so a short first week is the expected case,
   not an edge case.

7. MAJOR - "7-day rolling average" is a calendar-block average with an all-or-nothing rule.
   weeklyWeightAverage returns null unless all seven dates have a read, and divides by a fixed 7.
   Cell R2: one missed weigh-in in a week voids that week's weight row entirely ("Not enough data
   yet"). Weight is the plan's primary measure; on real N=1 use most weeks will have a gap and most
   weight rows will be blank. Average the reads present and disclose the count, or say in the view
   why the row is blank; do not silently void the measure.

8. MAJOR - the 3 to 4 strength markers are not "chosen ONCE and stored on device".
   Plan section 2 and the ticket both require a fixed pick held on the device. `markers` is a plain
   argument to computeWeek and buildComparisonView; nothing stores it and nothing stops a caller
   changing it mid-window, which is exactly what plan section 5 tells Joe not to do.

9. MINOR - run-in is flagged by array position, not by week number. measure-view.mjs:
   `trialWeeks.map((w, i) => ({ ...w, runIn: i < 2 }))`. A caller that passes weeks 3 to 12 (the
   comparison window plan section 3 actually reads) gets weeks 3 and 4 labelled "(run in)". Key it
   off `w.week <= 2`.

10. MINOR - weeklyWaistValue takes the first entry in the week, not the last. The module's own
    comment promises "latest recorded operation wins". Cell R8: two entries in one week, 34.5 on the
    Monday and 34.0 on the Thursday, returns 34.5. Re-measuring later in the week is normal.

11. MINOR - a blank waist value with a date is refused as OUT_OF_RANGE (cell R10): the athlete who
    tabs past the box is told the number is out of range. WAIST_REFUSALS already has NOTHING.

12. NOTE - the "no path outside the device store" cell is vacuous as written: it greps two files
    that touch no store at all, so it passes for the wrong reason and keeps passing when the wiring
    lands in a third file. The bar wants the store instrumented, not the library grepped.

13. NOTE - verified good: LF only and no U+2013/U+2014 in the new sources (cell R18); diff confined
    to unfrozen paths (5 files, 703 insertions, 0 deletions, no pinned path); Epley correct and named
    (cell R4, 225 x (1 + 5/30) = 262.5); no verdict or coaching sentence in the view's strings.

## Suite tails (reviewer runs, this worktree, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York)

- Today, 13 by name: `tests 652 / pass 652 / fail 0`
- W6 (w6/test, w6/host/test, w6/local/test globs): `tests 633 / pass 633 / fail 0`
- coach: `tests 218 / pass 218 / fail 0`
- A1: `A1 TODAY BUILD PASS: 3 assets; 114 pinned inputs ... free of any network reference`
- A5: `A5 PWA BUILD PASS: 13 files ... no network reference in any shipped byte`
- rig187: `rig187 => PASS`
- b-package S4 at ba58902: `B PACKAGE S4 FAIL SEALED-PROFILE-RECOMPUTATION`
- b-package S4 at 7b7400a4 (clean): `B PACKAGE S4 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`

## What round 2 needs

Findings 1, 2, 3 are the ticket. Wire the waist entry through a command and a host into the device
store, mount the comparison view on Today through unfrozen today-app.cjs so A1 actually scans it,
and read the baseline from local-source-basis with a cell that shows an empty window before a
synthetic C2b import and the imported window after it. Then fix 6, 7, 8, commit the harder fixture,
and hand the seal question (finding 4) to the PM with both b-package tails named.
