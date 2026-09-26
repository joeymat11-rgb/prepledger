# NATIVE-LOAD red-first cells (common part): builder report, round 3 (final)
Builder claude-opus-5-5, 2026-09-23. Worktree earned-nlr, branch rebuild/e-native-load-red at fe9f14b, uncommitted. TEST BYTES ONLY: no engine/product byte written (Joe's engine word not given).
Spec: NATIVE-LOAD-SPEC.md at 60bb5e9 (sha256 cb68ebd2...b3cb) plus the uncommitted R6 at earned-astra-96 (sha256 55f74e1f...bb39, verified; its diff against 60bb5e9 touches only :108, :126, :176, :195, :274). Answers REVIEW-NATIVE-LOAD-RED-l1 (7c466657...91e5) and -l2 (740b5a3f...770e), both read whole.
File: rebuild/m4/spec/native-load-options.test.cjs (spec FC12 path), 497 lines, ASCII, LF, sha256 99f5bdb6a0933ebff080e47f3a70956e89c366cf2ecc1a02477a9d6b90e9d88c.
Engine under test: the 12 public factories required by explicit name (engine-runtime.cjs MODULES order) plus native-load.cjs appended after writers if present. index.cjs never required. A Module._load guard refuses seed/migrate/merge/index/oracle-shim before load; the GUARD row proves none is in require.cache.

## Rows (24 red + 1 green guard) and red evidence
Run: node --test, TZ America/New_York, runtime lock taken and released. Result: tests 25, pass 1 (GUARD), fail 24: 22 x RED NATIVE_LOAD_MODULE_ABSENT, 2 x RED UPDATE_OPENER_HOLD_NOT_EXPORTED (FG01, N04c), no other failure. Output: %TEMP%\nlr-scratch\red-run-4.txt (sha256 b7acd0d7...35c3).
Rows: FG01, N02a, N02b, N02c, N02c frontier-absent, N03a, N03b, N04a, N04b, N04c, N05 (accept transition), N07, N08, N08b, N09, N10, N11, N12, N13, N18, N19a, N19b, N19c, N20 (composition).
Each row first runs green preconditions on the unchanged engine: fixture admitted by performedHistoryRows in order, card has no debut, READ constants, unchanged earnWalk oracle for candidate strings. It then fails at a precise gate. Only a MODULE_NOT_FOUND whose first line names native-load.cjs is red; anything else is rethrown.

## Round 3 changes
- D-NLR-3, per R6 :126: G4 adapter and the old spend_id assertion removed.
  - N02c puts the queued effect in basis.effect_frontier ({spend_id, response_refs:[fx-resp-q Ref], close_ref:null}) and asserts refs deepEqual [fx-resp-q Ref], field null.
  - New row "N02c frontier-absent": the frontier lacks the effect, so refs must be [] and field null.
  - N05's re-check after accept puts the effect with [fx-resp-1 Ref] in the frontier and asserts refs [fx-resp-1 Ref].
- D-NLR-4: new row N08b. C1 [10,9,7] is corrected to [10,9,8] with e(2,2,2), so it still tops and yields offers [EARLY]. Evidence set 3 must carry edits [fx-edit-1-3 Ref], original fx-set-1-3 Ref and current reps 8. The central evidence check applies too.
- G5 now cites R6 :108 (absent typed origin -> null).
- G6 aligned to R6 :176:
  - Completion-judging codes carry [Close Ref]: WINDOW_NOT_TOP, PROVISIONAL, HELD_OR_HOT, NO_NEXT_LOAD, and now also EFFORT_UNRESOLVED (N12) and PREFIX_UNRESOLVED (N10).
  - PLAN_CHANGED (N07) = [Close Ref, fx-plan-edit-1 Ref], supplied via basis.load_basis.authority_refs.
  - ERA_ORDER_BRIDGE_UNPROVEN (N13) = [Close Ref, fx-fork-1 Ref], supplied via basis.technique.fork_refs.
  - TARGET_QUEUED as above, with no Close Ref.
  - LEGACY_PENDING has no common D1 row, so it is not asserted.
- basisFor gained ctx {frontier, authority, forks}, whose ops join coverage. The encodings stay the G1 seam.

## Sensitivity (scratch only: %TEMP%\nlr-scratch\meta, never in the worktree)
meta.cjs loads the UNCHANGED test file with a loader hook supplying a planted stub FC01 (stub-native.cjs follows the spec algorithm with unchanged engine members, YES branch), a writers wrapper adding a stub updateOpenerHold, and stub FC04/FC05 runtimes. Conforming stub: 25/25 pass. Every red row is killed by at least one planted defect:
- New in round 3: tq-no-refs -> N02c, N05 | tq-spend-ref (the old G4 behaviour) -> both N02c rows, N05 | plan-close-only -> N07 | era-close-only -> N13 | edits-hidden (the reviewer's uncaught case) -> N08b.
- Round 2: empty-evidence and basis-drift -> the 9 offer rows (N03b, N04b, N04c, N08b, N09, N10, N11, N12, N19c) | refs-empty -> 12 rows | refs-empty-all -> 14 rows | no-comparator -> N04c.
- Round 1: card-target -> N02a, N08 | precount -> N02b, N03a, N03b, N08b, N19a, N19b | no-queue-check -> both N02c, N05 | auto-apply -> 23 rows | terminal-as-opener -> N04a, N04b | no-governor -> FG01, N04c | w-on-accept -> N05, N11 | ignore-plan -> N07 | use-original -> N08, N08b | label-earned -> N09, N10 | number-null -> N10 | drop-newWSets -> N11 | cast-bound -> N11, N12 | date-key -> N13 | invent-inc -> N18 | name-spend -> N19c | expose-hold -> N20 | old-era -> N19a.
Scratch sha256: stub-native.cjs 87f52adb...0def, meta.cjs 33907381...a506, run-meta.ps1 0bc88b42...636f.

## N04c (R5, unchanged in R6)
Common part: hold released, never HELD_OR_HOT, any offer exactly ORD with consumes of length 2 ([C2,C3]). Measured on the unchanged readers before the gate: _deriveSightingFull(V_pre) = {null, 0, []}; performedLoadMatches(C2) = true; beatsNoise = [true, 2, 1.8, 0.37, n 6]. The stub yields consumes [fx-start-2, fx-start-3]; no-comparator turns the row red.

## Declared seams remaining
- G1 basisFor: Basis encodings, including the effect_frontier entry form, authority_refs and fork_refs.
- G2 decisionOf: an offer is read as the Decision body (or offer.body).
- G3: completion_op_id is the Close op id.
- Consumes root encoding: N04c pins the count 2, not the values.
- Typed facts are hand-built TYPED v2 entries (no fake-indexeddb here).
G4 is retired. G5 and G6 are now spec text (R6 :108, :176).

## Rows deferred
- YES/NO-split (not built): N02c offers/automatic Q, N03c, N04c presentation and C4, N11 DEBUT presence, N12 DEBUT-only, N13 C2 offer, N18 after inc, N21.
- Beyond FC01/FG01 (need FC03, FC06-FC10, capture, IDB): N01, N05 durable/landing, N06, N07 import orders, N08 after yes, N09 post-adoption, N14-N17, N20 bundle, N22, A/B/C rows.

## Pinned assertions that will turn red (static at fe9f14b; not edited, not run)
- rebuild/m3/w6/host/test/engine-equivalence.test.cjs:27; rebuild/m3/w6/host/test/journey.test.mjs:420-422
- rebuild/m4/workout/test/native-next-targets.test.cjs:41, :43; native-trend-context.test.cjs:453-456
- rebuild/m4/workout/test/s3-companion-membership.test.cjs:186-187, :189; s3-supersede-defect-witnesses.test.cjs:152
- rebuild/m4/workout/test/s3-supersede-inherited-carriers.test.cjs:72/74; h3-supersede-inherited-carriers.test.cjs:69/71
- rebuild/m4/spec/native-carriers-source.cjs:89; native-next-target-candidate/fixture.cjs:70; reach.cjs:8,12
- rebuild/m4/import/test/s3/run.mjs:135-136; rebuild/m4/spec/load-write.test.cjs:7
- Product edit FC14: rebuild/m3/w6/host/build-host.mjs:24-25

## Not done
No engine/product byte, commit, push, npm install or junction. No protected-five read or execution. Existing suites not run. This report cannot carry its own hash; the PM re-hashes it.
