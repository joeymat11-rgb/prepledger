# CLAUDE REVIEW: NATIVE-LOAD red-first cells, round 1 (rebuild/e-native-load-red at fe9f14b, uncommitted)
Reviewer: Claude (claude-fable-5-1), independent, review only; reviewer of NATIVE-LOAD-SPEC l1-l3. Builder: Claude Opus.
HASHES: rebuild/m4/spec/native-load-options.test.cjs aa8d9b13...66c6f6 MATCHES (441 lines). rebuild/lanes/e/NATIVE-LOAD-RED-
REPORT.md measures 12d34235dde3936f01affbcf8c93d0ace667be0e1875ad3e8ff64a174839c07f (Get-FileHash and certutil agree); the
value I was given reads ...ddd3936f...: ONE hex character differs. Reviewed the file on disk (44 lines); flagged as D-NLR-2.

## VERDICT
ACCEPT WITH NAMED DEBTS (D-NLR-1, D-NLR-2). The 22 red rows fail at exactly the two declared gates and nowhere else; a
conforming stub turns them all green; every builder defect I re-ran and all twelve I planted turn rows red; the guard holds
transitively; the expected values are D1's; the N04c finding is confirmed by execution.

## 1. Red for the right reason (executed; lock taken and released)
node --test on the unchanged engine: 23 tests, 1 pass (GUARD), 22 fail; every failure message is one of two strings, RED
  NATIVE_LOAD_MODULE_ABSENT (20 rows) or RED UPDATE_OPENER_HOLD_NOT_EXPORTED (FG01, N04c); no other AssertionError or
  exception in the TAP (red-run.txt, my folder). Preconditions (typed reader admits the fixture in order, card not a debut,
  READ constants, canonical earnWalk oracle) ran green before each gate. Loader :31-32 turns only a MODULE_NOT_FOUND whose
  first line names native-load.cjs into the red reason; anything else is rethrown.

## 2. Sensitivity (my copy of meta.cjs; builder stub unmodified, wrapped by my-stub.cjs; all under my folder)
Baseline stub 23/23. Builder defects re-run as reported: precount -> N02b,N03a,N03b,N19a,N19b; no-queue-check -> N02c,N05;
  w-on-accept -> N05,N11; cast-bound -> N11,N12; no-governor -> FG01,N04c; auto-apply -> 21 rows.
My defects, each caught: wrong-code (WINDOW_NOT_TOP relabelled PROVISIONAL) -> N02a,N08; no-spend -> N02c; dup-consumes -> 6;
  token-leak (bound token in evidence) -> 9; order-swap (DEBUT before PROPOSED) -> N11,N12; field-w-absent -> 6;
  refusal-extra key -> 15; fake-profile -> 21; adopt-zero -> N10; mutate-apply (transition mutates input) -> N05,N09,N10,
  N11; wat-moment (adoption wAt from issuance moment) -> N09; queue-extra (coApproved invented) -> N05.
NOT caught, by construction: the builder's stub returns evidence [{start,close,sets:[]}] and passes 23/23. Rows assert only
  evidence.length>0 (:141), never spec :82's per-slot {slot,position,origin,state,original,edits,current}; decision.basis
  is never compared with request.basis; refusal refs are pinned only in N02a. D-NLR-1.

## 3. Guard
Module._load hook on the RESOLVED filename (:22-27) runs for every nested require, so transitive reach is covered; the five
  are refused by regex; GUARD asserts require.cache holds none and N20 re-asserts after both runtimes load; engine-runtime's
  computed require touches only MODULES names. No require() hole found (a raw fs read is not blocked; none occurs).

## 4-6. D1 values, deferrals, seams
Every asserted value equals spec r4 D1 (codes, refs/field on N02a, oracle-copied candidates, Q shape without newWSets, w 100
  until landing, wAt = C1 local_date, 60x3 baseline with baselineAsk removed and never 0, N11 order PROPOSED 110 [110,105]
  then DEBUT 105 [105,100], "at least 3", opener EFFORT_UNRESOLVED, ERA_ORDER_BRIDGE_UNPROVEN, NO_NEXT_LOAD, same spend_id).
Deferral correct: all [Y]/[N]-split parts and all rows needing FC03/FC06-FC10/capture/IDB, as listed in the report. G1-G3
  follow the spec's words. G4 is a real spec gap: r4 :124 says TARGET_QUEUED "with its spend_id" but {code,refs,field} has
  no slot for it; the test accepts it anywhere. The spec should name the field. Note, not a debt.

## 7. N04c finding CONFIRMED on the 12 public factories
The row pins beatsNoise(C3 [10,9,8] vs [9,8,8]) = [true, 2, 1.8, 0.37] and canonical earnWalk = [DEBUT 105] BEFORE its red
  gate; in the red run N04c failed only at UPDATE_OPENER_HOLD_NOT_EXPORTED, so both pins passed on the unchanged engine.
  Three same-load sessions give six paired deltas, so typicalError leaves the 0.9 published value (progression.cjs:581-586)
  and C3 clears the noise. D1 N04c "C3 PROVISIONAL" is wrong; the spec owes that correction.

## 8. Pinned assertions (static, fe9f14b)
Every listed line re-read; all red under FC04/FC05/FC01/FG01. Additions hold: s3-companion-membership :189 (host
  COMPOSITION.exposed equals the five; the spec listed only :186-187) and h3-supersede-inherited-carriers :64-74 (readdirSync
  over rebuild/engine, 18 files today; :71 has no blob for native-load.cjs; :69 unless CHANGED names writers.cjs).

## DEBTS
D-NLR-1 Add to expectDecision a per-slot evidence check (one Ref per original slot, original and current present, edits [] or
  the edit Ref in N08) and decision.basis deepEqual request.basis; pin refusal refs to [Close Ref] in N02b, N03a, N04a, N07,
  N08, N13, N18, N19a/b. A stub with empty evidence must go red. One function, no new row.
D-NLR-2 The report hash I was given does not match the file (one character); PM re-hashes before recording.
NOT DONE: no existing suite run; no product/engine byte; no protected file read or loaded; no commit; spec 60bb5e9 (r4) is
present; worktree untouched. Scratch (my-stub.cjs, my-meta.cjs, run.ps1, outputs) under earned-nls-review\meta, write_file only.
