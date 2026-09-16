# P3-REPLAY-ALL-FAMILIES - INDEPENDENT REVIEW R1 (Opus high)

VERDICT: ACCEPT

Reviewed sha 8632507 on `rebuild/d-p3-replay-all` (off 53e1ae78) in my own detached
worktree with the three junctions, Node 24, TZ=America/New_York. Everything below I ran
or read myself; where I take the author's word I say so.

## What I re-derived rather than believed

RV-1. THE ENUMERATION IS COMPLETE. I built the SAME page graph through `buildBrowser`
(112 pinned non-node_modules modules) and scanned every module for any ACCEPTED class as a
quoted string - a wider net than the author's op-position regex - and again for classes
supplied DYNAMICALLY (`class:` not followed by a quote). The writing sites are
exactly eight modules and ten (module, class) pairs, name for name the register's:
client/index.cjs (reading, session, plan), food-commands.cjs, sleep-commands.cjs,
measure-commands.cjs, checkin-commands.cjs, setup-commands.mjs, machine-settings-
commands.cjs, m4/workout/commands.cjs. Every dynamic site resolves to an `OP_CLASS`
constant in its own file, which the author's regex does see. NO WRITER IS MISSING. The two
the ticket names by hand check out too: `today/problem-report.cjs` is a pure text builder
that writes nothing, and coach consent is not in the page graph - `recordIssuance` writes
an `issuances` COLLECTION record, not an operation, and no page module calls it.

RV-2. THE RED SIDE, TWICE, BY MY OWN MUTANTS (both reverted; tree clean at commit).
(a) A writer literal `{class: "illness", kind: "fact"}` added to a pinned page module
(`today/checkin-app.mjs`) turned P3-EN1 red and NAMED it:
`['rebuild/m3/w7-preview/today/checkin-app.mjs#illness']`. (b) Disabling the F8 route in
`source-admission.mjs` turned P3-SF1/SF2/SF3/SF5 red, SF3 failing with exactly RV-S1's
defect - "an unknown profile of the sleep class fell to
[\"LOCAL_SOURCE_CONTEXT_UNRESOLVED\"]". The cells are load-bearing.

RV-3. THE REMAINING WRITER'S CAUSE, CONFIRMED NOT ASSUMED. `replay()` swallows the
workout lane's own code (`catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED')}`), so the
attribution cannot be read off the cell. I instrumented that catch and ran the session
cell: `RV-INNER-CAUSE WORKOUT_ORDER_START_INTERPRETATION_REQUIRED` - F3's own accepted
law (integration_pending `local-capture-start-resume`), not a missing family. Reverted.

RV-4. NO LAW WEAKENED. The two new `owns()` routes sit before the generic
`!validDay(day)||day>currentDay()` guard, but nothing escapes it: the per-op engine-context
check at the TOP of `replay()` still issues LOCAL_SOURCE_CONTEXT_UNRESOLVED for every op of
every class, and F8 re-imposes the day bound itself (`recorded > asOf || dated > asOf`,
plus its own date regex). The measure cell's ONE moved expectation asserts a MORE specific
named code, keeps the never-the-catch-all assertion and leaves the other six untouched; the
page-bundle figures are honest re-measurements and P3-B3's list is still EXACT. The diff is
12 paths, I read every hunk, and none is an engine, `today/**`, `measure/**`, `sleep-*`,
`gym-*`, `client/**`, `coach/**` or `packages/*.json` byte; all 12 are LF with no BOM.

## Findings

1. MAJOR (carried, within the ticket's own allowance). ONE WRITER IS STILL CLOSED TO
   PRE-IMPORT USE: the gym card. Bar (4) asks that every writer used before importing
   admits; the session writer refuses, by F3's law (RV-3). Bar (5) permits that if the
   runbook names the remainder, pre-check 8 names it and nothing else, and P3-WO1[session]
   fails if it ever starts admitting, so the line cannot outlive its reason. But Joe TRAINS
   as regularly as he sleeps: the argument that made SLEEP critical-path puts
   `local-capture-start-resume` on the port's critical path too. PM: schedule it, or the
   port day rests on that one runbook line.
2. MAJOR (writer-side, correctly NOT fixed here). `food-host.mjs:70` and
   `machine-settings-host.mjs:56` call `clientClockFor(day)` with no `live` argument,
   while `today-bindings.mjs` passes `clientClockFor(day, live)` at all four of its own
   call sites - so those two hosts pin the NON-live branch (`tz:"-05:00"`,
   `monotonicMs:()=>0`) year round. I confirmed that in the source; I did NOT reproduce
   the author's runtime `ok:false, state 20`. If it holds, FOOD LOGGING AND MACHINE NOTES
   DO NOT SAVE on a live era - a shipped-page defect bigger than this ticket, wanting its
   own lane ticket now, and why those two P3-WO cells stand on a pinned clock (stated in
   the cell file's own header).
3. MINOR. The class router attaches `profile` to its refusal row, and both the module and
   the report say the refusal names the profile carried - but `source-admission.mjs`'s
   `issue(code,id)` keeps only `{code, op_id}`, so through the REAL controller the profile
   is dropped, and P3-CM4 pins the code only. Carry it through, or stop claiming it.
4. MINOR. P3-EN2's "admission really runs this family" assertion is vacuous: the
   disjunction ends `|| admission.includes('MeasureReplay.FAMILY') ||
   admission.includes('SleepReplay')`, both unconditionally present, so every entry passes
   that clause whatever its family name says. The `'F<n>'` literal check alone is the test.
5. MINOR. TAIL NOT REPRODUCIBLE AS STATED: `m4/import` 86/86. The six non-production files
   give me 79 tests, 78 pass; `test/s3/harness.test.mjs` needs `S3_RUN_ROOT` (unset: 13
   more fail) and then spawns a preload refusing `S3_NODE22_REQUIRED` under Node 24 - the
   environment, not the diff, since that file is untouched, but not a figure another
   reviewer lands on. Every other tail I matched or exceeded.
6. MINOR. The enumeration sees a class only as a string literal or via an `OP_CLASS`
   constant in the SAME file; a writer importing its class name from another module would
   be invisible to it. None exists today (RV-1) - but the cell should state that reach.
7. NOTE. `sleep-replay.cjs read()` dereferences `op.effective.local_date` after
   `commands.validate`; an op of the class with no `effective` would throw rather than
   refuse by name - unreachable through the real controller (`Ops.build` requires it and
   the commitment check at source-admission.mjs:104 covers it), so a nit, not a hole.
8. NOTE. `P3-RUNBOOK.md` gains one em dash (6 -> 7), matching that operator document's own
   style; no athlete-visible copy is touched and A1's dash scan passes.
9. NOTE. The S5 stop is a BASE condition, verified twice: `git merge-base --is-ancestor
   origin/rebuild/t2-client-core HEAD` answers NO and b-package refuses on position before
   reading a byte; all 12 touched paths are undeclared in `lanes/b/tooling/packages/S5.json`
   (from `m3/w6/local/` it declares only `today-bindings.mjs`). A PM rebase clears it.

## Tails I ran myself (Node 24, TZ=America/New_York)

- this lane: enumeration + F8 `tests 8 / pass 8 / fail 0`; membership + per-writer + the 9
  measure cells `tests 27 / pass 27 / fail 0` (P3-CM1..4, P3-WO1/WO2 x 7, P3-MF1..6, P3-RM1..3).
- retract + admission-swap + local-source-consumer + local-source-admission +
  production-admission + production-mapping `tests 66 / pass 66 / fail 0`.
- w7-preview/import (the 15 cells incl. the P2 witness) `tests 15 / pass 15 / fail 0`;
  m4/import six non-production files with `S3_RUN_ROOT` set `tests 79 / pass 78 / fail 1`
  (environmental `S3_NODE22_REQUIRED` - finding 5).
- W6 `tests 586 / pass 586 / fail 0`; today + w7-preview + measure test dirs (22 files, a
  superset of today-17) `tests 696 / pass 696 / fail 0`; port + port-harden + seal
  `59 + 6 = 65 / pass 65 / fail 0`; `rig187 => PASS`; `A1 TODAY BUILD PASS: 3 assets;
  121 pinned inputs (13 engine, 12 client)`; `b-package --ci --package S5` =
  `B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`.

SYNTHETIC ONLY: no rebuild/conform/private, no ledger, no `src/history.js` and no
EarnedPort path was opened, listed or named; every --out went under %TEMP%\raf-out.
