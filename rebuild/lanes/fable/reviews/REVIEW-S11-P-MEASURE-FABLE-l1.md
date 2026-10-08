# REVIEW-S11-P-MEASURE-FABLE-l1: the uncommitted typeWaist fix in measure/test/support.mjs

Tree C:\Users\joeym\AppData\Local\Temp\earned-s11int, HEAD d7b4cc2. Reviewed: rebuild/m3/w7-preview/measure/
test/support.mjs (worktree sha256 4956fa20...a6a4; HEAD = pinned f72c6176; LF, ASCII, +38/-26). rebuild.yml
ignored as instructed. Nothing edited; one stray log my first scratch invocation dropped at the tree root was
removed; git status is back to the two M rows.

## (1) Mechanism - re-derived, CONFIRMED
- measure-screen.mjs saveWaist:84 `await lane.save(...)` then repaint(); today-lanes.cjs measureDeps repaint
  -> today-app.cjs render:1694. A repaint of the SAME screen keeps mountToken (:1717), so alive() stays true
  for every earlier paint of the route. renderMeasure:471 makes a NEW section per render and show():623 does
  phone.replaceChildren(root) synchronously, before its first await.
- paint():128 mounts the waist boxes BEFORE awaiting all/sets/sessionDates/foodDays/baseline, so "boxes
  present" holds while the previous paint (marker-pick repaint, or row 1's) is still reading. Old wait: table
  text != before, then quiet() = 3 unchanged setTimeout(0) turns. '(no table)' is itself still for 3 turns in a
  slow read, so quiet() returned mid-paint; the next click's `before` was '(no table)', and the PREVIOUS paint's
  table (reads begun before this save) satisfied "changed" and "still" while the new save was in flight.
- Fits the symptom exactly: trialStart 2026-01-05, today 2026-03-25, typed rows 2026-03-16 (week 11, passes)
  and 2026-03-23 (week 12, fails); scratch red iff trace answered=10 of 11.
- Ruled out: DST - every measure date op is Date.UTC on ISO strings (model:91, sources:34/38, baseline:18,
  commands:30, trialWeekCount); 2026-11-01 is outside the window and after MEASURED_TEST_NOW=2026-09-03; the
  boundary inside the window (2026-03-08, week 10) passes; a TZ effect would be deterministic, not 1 in 25.
  Shared .tmp - journey/support build nothing and read only measure-fixture.json. Store-read race (ack before
  readable) - would survive the fix; 9/9 post runs green with answered=11, pre reds co-occur with answered=10.

## (2) Test vs product - NOT a product defect, CONFIRMED
Each render owns a fresh section; a paint begun before the save finishes into a section replaceChildren has
already detached (pick() queries '#phone ...' and cannot see it). The visible section is always the latest
render's, and the render after an answered save reads lane.all() after the write acknowledged
(measure-host.mjs save:179 resolves on execute's ack). mountMeasureComparison builds the table synchronously
and attaches it with one replaceChildren (measure-view.mjs:233), so no half table is ever shown. A user sees:
the pre-save table while the save is in flight (true to the store then), chrome-only during the reads, then the
right table. A refused save repaints with the error line and no new row, also correct. No stale final screen.

## (3) The fix removes the race; nothing weakened
- Wait 1 is the page's own fact: page() wraps the host's save (own-property closures, no `this` in
  measure-host.mjs; `{...host}` copies every method and field, close() included) and sets answered in a
  .then registered BEFORE saveWaist's await on the same native promise. On the first macrotask turn where
  answered is seen, saveWaist's continuation has already run render() and shown a table-less section, so
  wait 2 (table present) can only be met by a paint whose reads began after the ack. Verified against
  render/show; the comment's claims match the code.
- Not vacuous: `saves.length > saved` demands a NEW record from THIS click; a screen-side refusal records
  nothing and fails loudly at the unchanged 30 s MEASURE-SETTLE-DEADLINE naming the row's date. A refused
  lane save marks answered, and the week assertions then catch the missing row. Cannot hang past the deadline.
- No assertion, tolerance, deadline or check changed: waitForTrialTable, tableOf, header/row-count/
  week-by-week deepEquals untouched. Importers: journey.test.mjs (typeWaist; view.lane.trialStart/
  firstEnrolledDate work through the spread), baseline/boundary import constants only; adherence/model/lane do
  not import it. No caller injects `measure` or compares lane identity. view.saves is additive.

## (4) Red-first evidence - REAL
%TEMP%\s11-p17: delay-host.mjs delays each real lane read (P17_READ_MS) and save (P17_SAVE_MS); mk.mjs copies
the tree's support/journey and adds one trace line. Builder pre at 15/150: red1-4 `not ok 1 - P-MEASURE (a)`,
assertion `week 12 as rendered`, answered=10; red5 ok (answered=11); ctl/mild/wide ok. Post: red1-5, wide,
mild, ctl, full (a)(d)(e) all ok, answered=11. My re-run (15/150, once each way): pre-rev1.log ok (the window
is probabilistic; the builder's own rate was 4/5), post-rev1.log ok, answered=11. Red tracks answered=10
one-to-one across every pre log, which is the mechanism's fingerprint; the fix makes answered=11 by construction.

## (5) Pins
packages/S11.json:828 pins support.mjs pre=post=f72c6176, role "carried"; HEAD equals the pin, worktree is
4956fa20. The S11 REGEN --write (as 48f1f20 did for copy.test.mjs) must move post to 4956fa20... and the role
to "edited" - this package's word; "changed" is not in its vocabulary (edited 52 / carried 248 / new 19 /
cowork 4 / owner 1) - and its PRODUCT MAP note's counts and HEAD hash move with it. Other consumers of that
row: receipts/S11.json:168 (re-observed at the receipt run), rebuild/m4/spec/acceptance-s11-native-load.json
(same carried row; must agree at seal), review-s11-native-load.json (names that acceptance). S6-S10 rows are
the parent pre and stay.
Debts (not blocking): D1 pickMarkersOnScreen still ends in quiet(phone), the last stillness wait on this
route, harmless now. D2 the wrapper marks answered on rejection too; fine only because the week asserts follow.

VERDICT: ACCEPT WITH NAMED DEBTS (D1, D2; plus the S11 REGEN carried->edited step in (5))
