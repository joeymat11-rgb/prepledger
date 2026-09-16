# P-MEASURE v1 - AUTHOR REPORT

Lane C, screens/plumbing, size S. Model/effort: Sonnet, medium. Author commit
806749e166f1cc03572edb895ed59f9227c8832a on rebuild/c-measure-v1, over tip
7b7400a4214a0570f1f7d2a30d619b549475b197.

## Files : hunks

- measure-model.mjs (new, 203 lines) - pure computation: the waist entry
  (refusal, from-entry, latest-by-date projector), week arithmetic, 7-day
  weight average, weekly waist and its 4-week trend, estimated 1RM, training
  and food/energy adherence percent, sleep qualifying-night count, and
  computeWeek() assembling one week's row of every measure.
- measure-view.mjs (new, 98 lines) - the one comparison view:
  buildComparisonView() lays baseline beside trial, weeks 1-2 flagged run in,
  an explicit "no baseline yet" state; exportText() is the plain-text export.
- measure-fixture.json (new, 210 lines) - synthetic 12-week history (84 daily
  weight reads, 12 waist entries, 48 sets across 4 markers, 12 weeks of
  session/logging counts, 12 weeks of sleep nights) and its hand-computed
  expected table (12 weekly rows).
- test/machine-settings-ui.test.mjs (unfrozen, +113 lines, 7 new cells).
  git diff --cached against 7b7400a4 over every pinned path named in the
  ticket is empty.

## The 1RM formula

Epley, named in the module: `1RM = load x (1 + reps / 30)`
(ONE_RM_FORMULA_NAME = "epley"). estimate1RM(200, 5) = 233.33, matches the
fixture's week 1 Back Squat row.

## Cells per bar item (plan section 4 acceptance)

1. Correct arithmetic against the fixture - `every synthetic week matches its
   hand-computed expected row` walks all 12 weeks x 8 fields against
   measure-fixture.json's `expected` array.
2. Adherence percentages match the fixture - checks the 100% and reduced
   (75%, 71.4%) weeks explicitly.
3. No measure read from or written to any path outside the device store -
   source-scans both new modules for any network call, storage API, network
   reference or filesystem access; neither file imports anything, so this
   passes on the source's own shape, not by exemption.
4. Comparison view / no baseline / run-in / no verdicts - empty baseline
   renders NO_BASELINE_YET (the window's own definition), weeks 1-2 carry
   runIn true and 3-12 false, exported text carries none of
   pass/fail/good/bad/better/worse/verdict/recommend.
5. Export - plain text table naming every measure and marker; plus a waist
   entry refusal cell (blank, future date, out of range, valid).

A1/A5 builds pass unchanged: neither pinned today-entry.mjs nor today-app.cjs
imports the new modules yet, so wiring the screen into the live router is a
follow-up ticket (today-app.cjs is pinned); the module and its own tests are
what this ticket's files list permits.

## Suite tails (this PC, this head)

Today 13 by name: `tests 652 / pass 652 / fail 0` (645 + 7 new).
machine-settings-ui.test.mjs alone: `tests 61 / pass 61 / fail 0`.
W6: `tests 586 / pass 586 / fail 0`.
Coach: `tests 218 / pass 218 / fail 0`.
rig187: `rig187 PASS`.
A1: `A1 TODAY BUILD PASS: 3 assets; 114 pinned inputs; no em/en dash`.
A5: `A5 PWA BUILD PASS: 13 files; no em/en dash in any text this build emits`.

## Open items

- `b-package.cjs --ci --package S4` on this branch fails
  SEAL-BASE-IS-NOT-THE-CHAIN-TIP: origin/rebuild/t2-client-core moved 5
  commits past 7b7400a4 while this ticket was in flight (ledger :435's
  standing procedure: the PM rebases as the last step before its own CI
  push). Confirmed unrelated to this ticket by stashing these files and
  re-running: the same failure appears on the clean base. S4's 90 declared
  product files do not include any of the three new modules.
- The comparison screen is not reachable from Today yet: today-app.cjs and
  today-entry.mjs are pinned, so wiring a route and a waist-entry sheet in
  is the next ticket's job.
- Sleep qualification is a caller-supplied `{date, clean}` boolean
  (dependency injection, the shape gym-model.mjs/sleep-model.cjs already
  use); the wiring ticket supplies `clean: engine.cleanAtDate(state, date)`
  per night rather than importing rebuild/engine into this pure module.
