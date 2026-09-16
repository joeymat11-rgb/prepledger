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


## ROUND 2 - responding to P-MEASURE-REVIEW-R1.md (sha 28d3b4a, on ba58902)

Author commit (this round) on rebuild/c-measure-v1, rebased onto the ACTUAL
current tip f6f3baafa77968b98a3bb8bd1676a71a7b8764ff (origin/rebuild/t2-client-core
moved from 7b7400a4 to f6f3baa - 5 commits - while round 1 was in flight; round
1's "SEAL BASE ON THE TIP" claim against 7b7400a4 was already stale the moment
it was written, which is why the reviewer found a DIFFERENT b-package failure
at that sha than my own round-1 tail did).

Round 1's line "today-app.cjs and today-entry.mjs are pinned" was wrong, and the
reviewer said so: only today-entry.mjs is pinned. That error is why findings 1
and 2 exist. Both are now closed through today-app.cjs (unfrozen), the same
lazy-lane extension point N1 (food) and N2 (sleep) already use.

### Per-finding disposition

1. BLOCKING, nothing records - CLOSED. New measure-commands.cjs (producer:
   class body-composition-source, kind fact, profile earned/waist/v1) and
   measure-host.mjs (opens through era.client.hostBindings, the same seam
   sleep-host.mjs uses) write and read a real op with op_id and device_seq.
   Proved over the real encrypted repository (fake-indexeddb): "the waist
   entry is recorded through a real op, with op_id and device_seq", and a
   store-level refusal test for a future date. today-app.cjs's new "measure"
   screen wires the entry box to host.save().
2. BLOCKING, nothing renders - CLOSED. measure-view.mjs now exports
   mountMeasureComparison() and mountWaistEntry() (createElement,
   replaceChildren, data-slot). today-app.cjs imports measure-model.mjs and
   measure-view.mjs, adds a "measure" route in render(), a Today tile
   (data-go="measure") that reaches it, and renderMeasure() that mounts both.
   Confirmed in the A1 build output: "mountMeasureComparison" and
   "Record waist" are present in .tmp/w7-today-dist/app.js (119 pinned inputs,
   up from 114).
3. BLOCKING, baseline never touches local-source-basis - CLOSED. New
   measure-baseline.mjs imports admittedLocalSourceState from
   local-source-basis.mjs and reads state.reads/state.waist (the same two
   arrays rebuild/engine/seed.cjs seeds) into computeWeek() rows. Proved with
   a synthetic C2b-shaped admitted import (one marker, one derived view,
   three identical basis copies) producing 8 non-empty baseline weeks, and a
   second case with no admitted import returning []. today-app.cjs's
   renderMeasure() calls Baseline.baselineWeeks(setup, ...) when a setup
   entry is present.
4. BLOCKING, b-package fails differently and the report mis-attributed it -
   PARTIALLY CLOSED. Rebased onto the real tip: "SEAL BASE ON THE TIP" is now
   literally true (HEAD's merge-base with origin/rebuild/t2-client-core IS
   f6f3baa). `b-package --ci --package S4` still FAILS
   SEALED-PROFILE-RECOMPUTATION. Cause, confirmed by hash: S4.json (pinned,
   rebuild/lanes/b/tooling/**) declares a fixed pre/post byte contract for
   test/machine-settings-ui.test.mjs ("post": 89b8c2577e81...) that predates
   this ticket's own edits to that file - the file is "Unfrozen" for this
   ticket's own content, but its bytes are ALSO sealed by a lane-B product map
   this ticket has no custody to update. That map's 90 declared product files
   still do not name the four new measure-*.mjs/cjs modules either. Both are
   lane-B reseal actions, outside rebuild/lanes/b/tooling/** custody; this
   round does not claim a false PASS for them. The round-1 report's own
   mis-attribution (crediting the failure to the base being stale, when the
   file-hash cause was the same at both shas) is corrected here.
5. MAJOR, fixture cannot fail - CLOSED. New cell "a fixture with gaps
   exercises every null branch": 3 missed reads in week 2, 1 missed day in
   week 6, week 4 waist never measured, week 6 has no Bench set - R1-R4's
   null branches (weightAvg, waist, waistTrend4Week, marker1RM) all execute
   and assert non-trivial values.
6. MAJOR, logging adherence divides by a hardcoded 7 - CLOSED.
   elapsedDaysInWeek(dates, today) replaces the literal 7; computeWeek takes
   an optional `today` and 3 of 3 elapsed days now reads 100, not 42.9.
7. MAJOR, unclamped adherence - CLOSED. trainingAdherencePct/
   loggingAdherencePct clamp to 100 (clampPct).
8. MAJOR, markers are a plain argument, not a device-stored pick - CLOSED.
   measure-commands.cjs adds a second profile (earned/measure-markers/v1,
   action measure-markers-pick, 3-4 unique names) and measure-host.mjs adds
   markers()/saveMarkers(), refusing a second pick with
   MEASURE_MARKERS_ALREADY_RECORDED once one is recorded (the same
   read-before-write setup-host.mjs's first run uses).
9. MINOR, run-in flagged by array index - CLOSED. buildComparisonView now
   reads `week.week <= 2`, not the array position; regression cell hands
   weeks 3-12 at positions 0-1 and checks both read false.
10. MINOR, weeklyWaistValue returns the first entry, not the latest - CLOSED.
    Picks the row with the maximum date among the week's own dates.
11. MINOR, blank value with a date reads OUT_OF_RANGE - CLOSED.
    waistRefusalFor now returns NOTHING whenever the value box is blank,
    regardless of the date box.
12. NOTE, vacuous store-only check - CLOSED. The extended cell now scans the
    files that actually touch the store (measure-host.mjs,
    measure-commands.cjs, measure-baseline.mjs) for network calls and a
    second indexedDB.open, and asserts measure-host.mjs binds through
    hostBindings rather than opening its own repository.

### Suite tails (this PC, this HEAD, rebased onto f6f3baa)

Today 13 by name: `tests 661 / pass 661 / fail 0` (652 round-1 + 9 new
round-2 cells).
W6 (all 38 test files under rebuild/m3/w6): `tests 661 / pass 653 / fail 8`.
The 8 failures are pre-existing and unrelated to this ticket - 7 in
rebuild/m3/w6/test/recovery-stage/*.test.mjs and 1 in
rebuild/m3/w6/test/import-custody/engine-join.test.mjs, all failing on a
missing external fixture (`Provide retained IMPORT_M4_DIR`), a directory this
worktree does not have and this ticket's files never touch.
Coach: `tests 218 / pass 218 / fail 0`.
rebuild/client: `tests 18 / pass 18 / fail 0`.
A1: `A1 TODAY BUILD PASS: 3 assets; 119 pinned inputs (13 engine, 12 client)`.
A5: `A5 PWA BUILD PASS: 13 files`.
rig187: `rig187 => PASS`.
b-package S4: `FAIL SEALED-PROFILE-RECOMPUTATION` (see finding 4 above; base
is now correctly the chain tip, the remaining failure is a lane-B reseal this
ticket cannot make from inside rebuild/lanes/b/tooling/**).

### Remaining, explicit

- The trial week(s) rendered on the live screen use `model.today` as a
  one-week stand-in for the trial's real day-one start date; the screen
  reads real waist rows and real markers from the device store, but a
  precise multi-week trial-side weight/session/sleep wiring across the food,
  sleep and gym lanes is left to the next ticket, named here rather than
  silently shipped as if complete.
- rebuild/engine/writers.cjs's SIGNALS string ("Waist is still an unlogged
  input") is unchanged: it is under rebuild/engine/**, pinned, and out of
  this ticket's custody even though it is now stale.
