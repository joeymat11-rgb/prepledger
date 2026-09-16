# P-MEASURE v1 - INDEPENDENT REVIEW, ROUND 2

VERDICT: REJECT

Subject: `a19a08c` on `rebuild/c-measure-v1`. Merge base with `origin/rebuild/t2-client-core`
is `f6f3baa` (the true tip), so round 1's stale-base finding is closed: the rebase is real.
Reviewed on a detached worktree at `a19a08c` with my OWN 12-week synthetic fixture and my OWN
hand-computed expected table (weights with a missing day, a never-measured waist week, a
missing marker week, partial and over-count adherence, Epley by hand). Nothing personal was
read or written; every datum below is synthetic.

## Findings

1. BLOCKING - the shipped screen still renders nothing. `today-app.cjs` `renderMeasure()`
   calls `computeWeek({ startDate: model.today, index: 0, reads: [], waistRows: rows,
   sets: [], markers, today: model.today })`: no weight reads, no sets, no session counts,
   no food/energy day counts, no nights, and exactly ONE week. Executed: I mounted the real
   route (`mountToday` on the approved shell, an ENROLLED setup, a real `createReadingHost`
   lane over fake-indexeddb, `window.crypto`/`indexedDB` supplied), clicked the Measure tile
   and read the table out of the DOM. The whole screen is:
   header `["Week","Weight, 7 day average (lb)","Waist (in)","Waist, 4 week trend (in)",
   "Training adherence (%)","Food logging adherence (%)","Energy logging adherence (%)",
   "Sleep nights qualifying (/7)"]` and one row
   `["Week 1 (run in)","Not enough data yet","Not enough data yet","Not enough data yet",
   "Not enough data yet","Not enough data yet","Not enough data yet","0/7"]`.
   No marker column exists at all. Ticket BUILD (1), (2) and (3) are not delivered on the
   device: the arithmetic library is correct and the screen is not fed by it.

2. BLOCKING - the trial window has the wrong day one. `startDate` is `model.today`, so the
   window re-bases every morning and week 2 through week 12 can never exist; "weekly rows"
   and the run-in flag are decorative. The ticket says day one is the first enrolled
   record's local date, and MEASUREMENT-PLAN-v1 section 3 says day one of the trial.

3. BLOCKING - no export. Plan section 4 (4) and ticket BUILD (4) want a copyable text block
   on demand. `exportText` exists in `measure-view.mjs` and is called from nowhere but the
   test file: `findstr` over `today/**.cjs,**.mjs` returns only `measure-view.mjs:75`,
   `measure-view.mjs:218` and three lines in `test/machine-settings-ui.test.mjs`. The screen
   has no export control and builds no text block.

4. BLOCKING - `b-package --ci --package S4` is RED, and this branch is why. Executed here:
   `B PACKAGE S4 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed`.
   `packages/S4.json` pins `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs`
   post `89b8c2577e81201429aad705eb631ca7f1bd4d4ed4d978dccc4ebce75fa33cd2`; that is exactly
   the sha of the file at `f6f3baa`, and `a19a08c` makes it
   `a0f075263ea493c2631be0a99e4b1a27a3519fa8c95edd6118cc890cc8df5c03`. `today-app.cjs` is
   pinned the same way (post `1ae7fbc68155...`). So the seal held at the tip and this
   ticket broke it. The report's "a lane-B reseal outside this custody" is not accurate:
   the brief named a home that does not touch the S4 map (a new test under
   `rebuild/m3/w7-preview/measure/test/` wired into the unpinned
   `.github/workflows/shared-preflight.yml` with the registration test updated, as P6 did).
   Separately, none of `measure-model.mjs`, `measure-view.mjs`, `measure-host.mjs`,
   `measure-commands.cjs`, `measure-baseline.mjs` or `measure-fixture.json` appears anywhere
   in `S4.json`, so the "0 unlisted drift" half of the bar is unmet too.

5. MAJOR - the baseline window renders two of the seven measures and FABRICATES a zero.
   `measure-baseline.mjs` hands `computeWeek` `sets: []`, `sessionsCompleted: null`,
   `sessionsPlanned: null`, `foodDaysLogged: null`, `energyDaysLogged: null`, `nights: []`,
   whatever the admitted import carries. Executed over a synthetic C2b import through
   `admittedLocalSourceBasis` (8 weeks of reads plus weekly waist), the rendered baseline
   row 1 is
   `["Week 1","185.7 lb","36 in","Not enough data yet","Not enough data yet","Not enough
   data yet","Not enough data yet","0/7","Not enough data yet","Not enough data yet","Not
   enough data yet"]`. Two problems: the trial column shows numbers the baseline column
   structurally cannot, so the ONE comparison compares nothing but weight and waist; and
   sleep reads `0/7`, which is a claim that the frozen app had zero qualifying nights, not
   an absence. The imported history carries a per-day `slp`, `cal` and `steps` and per-lift
   loads and reps, so three of the four missing measures are derivable. Plan section 3
   allows a ZERO baseline only for waist and energy, and only on trend.

6. MAJOR - no cell asserts anything the athlete would see. The cell closing round-1
   finding 2 (`machine-settings-ui.test.mjs:1454`) is a source grep: it reads
   `measure-view.mjs` and `today-app.cjs` as TEXT and matches `/export function
   mountMeasureComparison/`, `/createElement|replaceChildren/`, `/measure-(model|view)/`,
   `/"measure"/`. No cell mounts the view, no cell drives the route, no cell reads a rendered
   value, and no cell ever renders or exports the baseline-present window. The bar's first
   item ("the view renders the section-2 table for BOTH windows with correct arithmetic")
   therefore has no executed rendering evidence. Findings 1 and 5 above were both caught by
   about forty lines of real mounting, so the shape is cheap.

7. MAJOR - the markers pick is storable but not pickable. `saveMarkers` is called from no
   screen; `markers()` returns null on a fresh device, so `buildComparisonView` gets `[]`
   and the live table has no 1RM column. Plan section 2 and 5 want the 3 to 4 markers chosen
   ONCE before the trial starts; there is no entry path to choose them.

8. MINOR - `weeklyWeightAverage` returns null unless ALL SEVEN days carry a read, which is
   not a "7-day rolling average" (plan section 2) and will blank the primary measure in most
   real weeks. It is also inconsistent with sleep, where a missing night silently counts as
   a non-qualifying one (finding 5).

9. MINOR - `rebuild/lanes/c/P-MEASURE-AUTHOR-REPORT.md` is 197 lines against the ticket's
   80-line cap.

10. MINOR - the report's tails do not name the suites the brief names. Executed here at
    `a19a08c`: `node --test "rebuild/m3/w6/test/*.test.mjs"` is `586 / 586 / 0`, not the
    reported `661/653/8`, and there are no failures to write off as pre-existing; the
    shared-preflight trio (`preflight`, `shared-preflight-ci-registration`,
    `client/reason-on-disk`) is `85 / 85 / 0`, not `18/18/0`.

NOTE - what is genuinely green and closed. Round-1 findings 1, 5, 6, 7, 9, 10, 11 and 12
are closed on the evidence: a real op with `op_id` and `device_seq` over the encrypted
repository, a gapped fixture that walks every null branch, `elapsedDaysInWeek`, `clampPct`,
run-in by `week.week`, latest-date-wins, blank means NOTHING, and a store scan that reads the
files that actually touch the store. My own independent 12-week fixture and hand-computed
table agree with `measure-model.mjs` cell for cell: Epley `225x5 = 262.5` and `100x10 =
133.33`, the best set in a week winning, a gap week giving null, the four-week waist trend
null when either end is missing, a partial week dividing by elapsed days, and a percentage
clamped at 100. Rendered, exported and DOM-read, the trial table and `exportText` agree cell
for cell. No en or em dash, no CRLF and no network reference in any of the five new modules.

## Suite tails, executed on this worktree at `a19a08c`

```
[today 13 by name]  tests 661  pass 661  fail 0
[W6 586]            tests 586  pass 586  fail 0
[coach]             tests 218  pass 218  fail 0
[shared-preflight]  tests  85  pass  85  fail 0
[A1]  A1 TODAY BUILD PASS: 3 assets; 119 pinned inputs (13 engine, 12 client);
      3/3 assets scanned and free of any network reference
[A5]  A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256
[rig187]  rig187 PASS
[b-package S4]  B PACKAGE S4 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing
                or failed; local diagnostics withheld
```

`git diff f6f3baa a19a08c --stat` touches only `today-app.cjs`, `test/machine-settings-ui.
test.mjs`, six new `measure-*` files and the author report: nothing on the pinned list is
edited, and no test weakened. The custody problem in finding 4 is not that a frozen file was
edited but that two S4-sealed files were, with a non-breaking home available.

## What would close this

Feed the screen from the existing entry paths (weight reads, sets, session and logging day
counts, sleep nights) over the real trial window from day one; derive the baseline's other
measures from the admitted import, or render them as absent rather than as `0/7`; put the
export on the screen; move the new cells to a home that does not break the S4 seal and
declare the new modules; and assert the RENDERED table, both windows, against the fixture.
