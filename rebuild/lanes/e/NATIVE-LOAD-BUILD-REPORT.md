# NATIVE-LOAD build (common part + YES-only + route B): builder report
Builder claude-opus-5-5, 2026-09-23. Worktree earned-nlr. Round 1 = ec0dbff (tests c772499), round 2 = f007506, round 3 UNCOMMITTED on f007506. Grant DECISIONS:784-785; spec R7 6ddf7af (sha256 98c0cf7a..., verified). Consent constant 'yes-only'; adoption asks first (H6); route B = FB01 trigger + A button. No [NO-ONLY] clause built. Protected five never loaded or read (preload guard refuses load AND fs reads; every run reports "protected-in-cache: none").

## Round 1 (ec0dbff), condensed
- Red first: FC12 38 rows (1 pass GUARD, 37 red at RED NATIVE_LOAD_MODULE_ABSENT / UPDATE_OPENER_HOLD_NOT_EXPORTED / NATIVE_LOAD_EFFECTS_ABSENT); FA03 A01, A02, B01, B02 red at RED NATIVE_LOAD_HOST_ABSENT (%TEMP%\nlr-build\step1-red-*.txt). Green 38/38 + 4/4.
- Files: FC01 rebuild/engine/native-load.cjs (evaluator/transition), FG01 writers.cjs (pure move of :234-239 into updateOpenerHold, +14/-7), FC03 rebuild/m4/workout/native-load-effects.cjs (fold/check/issuance), FC04 engine-runtime.cjs, FC05 engine-runtime-host.cjs, FC14 build-host.mjs, FC06 t2-stage.cjs, FC07 local-client.mjs, FC08 today-bindings.mjs, FB01 gym-model.mjs, FA02 today-entry.mjs, FC13 rebuild.yml.
- Declared encodings: spend_id = JSON ['native-load', lift, native authority spend|null, last reset-fork date|null, consumes]; root = JSON [start, lift, close].
- Red pins outside the inventory (not edited; successor re-pin owed): local-today-journey PAGE_PINS; host journey.test.mjs:414-417; food N1.18/N1.17; machine-settings-ui S10/S14; problem N2-08/N2-16; build R3/S6C.7b.
- CI-only (load or name a protected module): m4/workout/test/{h3,s3..s9}-supersede-*, s3-companion-*, engine-history, h3-clean-init, engine-capture, native-next-targets-assembly; m4/spec/load-write*, workout-edit-model; m4/import/test/{engine-provider,production-mapping,production-admission,prepare,reading-replay,browser-parity,s3/harness}; m3/w6/test/{local-source-admission,local-source-commit,local-source-consumer,import-custody/engine-join,recovery-stage/source-import}; today/test/{adapter,catalogue,copy,package,setup,view,design}; S8 package step and build tests.

## Round 2 (f007506), condensed
- R2 rows (ERA, REFS, DIGEST, CONFLICT, DEVICE, REVISION, PERLIFT) red then green; five planted mutants killed (%TEMP%\nlr-build\r2).
- PRODUCER_REVISION bound to bytes: sha256 over "rebuild/engine/<m>.cjs" NUL sha256(bytes) LF for the 13 runtime modules then entered-load; row R2-REVISION recomputes it.
- Per lift (spec :156): RECORD_INVALID / EFFECT_CONFLICT refuse only their lift; the programme always projects.
- Five pin files restored to S9 bytes; their exact transforms are owed to the successor package as role "edited" (%TEMP%\nlr-build\r2\carrier-*.diff). Expected red until then: engine-equivalence, native-trend-context (local), journey, s3-companion-membership, s3-supersede-defect-witnesses (CI).
- Import (D-B-1): imported generations refuse NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN; the legacy-mapped lane reaches PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED. FC09/FC10 not built.

## Round 3 (answers Astra NATIVE-LOAD-BUILD-REVIEW-L1 REJECT, sha E63139E0...)
Everything below was measured on f007506 first. Red: FC12 50/56 (6 red), FA03 4/8 (4 red) (r3\red-fc12.txt 9A22E3EA, r3\red-fa03.txt 6FB9111F). Green: FC12 56/56, FA03 8/8 (r3\green-fc12.txt 42414400, r3\green-fa03.txt 5B819D93). The tests were not edited between the red and green runs.
- B1 (landing through the host): red R3-B1 fold "100 !== 105" and FA03 R3-B1 "40 !== 45". Cause: the fold compared per-slot prescribed_load, which host v1 slots lack. Fix: the fold reads the capture from the authenticated Start op's prescription_capture cells (the engine-capture.cjs loadCell shape) as spec :122 requires ("using the immutable Start capture"). FC01 landing checks context.completion.capture, plus any typed prescribed_load.
- B2 (disputed basis, spec :157): red R3-B2 fold "105 !== 100" (it landed) and FA03 R3-B2 (card 'ready', "45 lb x 9 reps"). Fix:
  - The fold keeps the effect and the BASIS_REPAIR_REQUIRED issue (now carrying spend_id) and never lands that spend.
  - The FC08 registrar refuses the day's new prescription by code when a lift on that day's card (runtime.sessionMembership) has BASIS_REPAIR_REQUIRED or a blocking issue; for a dispute the refusal carries a "Disputed: ..." reason.
  - Check refuses everything on that lift except the compensation of the disputed spend. The compensating yes resolves the dispute (FA03 row: card 40 again).
- B3 (compensation unreachable): red R3-B3 "TARGET_QUEUED". Fix in FC01: compensation is dispatched before the pending-entry refusal (spec :153); descendants still refuse COMPENSATION_DESCENDANTS.
- B4 (false dispute on the second lift): red R3-B4 (BASIS_REPAIR_REQUIRED lift fx-row) and FA03 R3-B4. Fix: sessionOf(facts, close, lift) matches the lift in evidenceChanged, dayOf and check.
- B5 (Today versus gym on reopen): red FA03 R3-B5 (model queue []). Fix in FA02: reconcile() folds from the immutable basis and adopts the result.
  - It runs on the entry's exported refresh (today-app.cjs:2503 calls it after its adoption chain), after a yes, and after a checked Close.
  - With no native effect nothing is adopted, so the adoption gate is never lifted by it.
  - A failed projection is carried as summary.nativeCode.
- B6 (proven cross-device debut): red R3-B6 "100 !== 105". Deciding lines: spec :151 "Require acceptance before Start by proven causality" and :156 "same-lift dependencies follow witnessed causal/source order"; :150 "established causal acceptance order".
  - Events are now ordered by source cut, never by a device-local sequence number. An accept sits after the Starts of its issue cut; a Close sits at its Start's rank.
  - Proof means the accept is an ancestor of the Start through causal_parents or device_predecessor_op_id, or it precedes the Start in one device's own sequence. The round-2 rule required the same device, which was sufficient but too narrow. Without proof the result is still the DEBUT_BASIS_UNPROVEN issue (R2-DEVICE unchanged, R3-B6 second half).
- B7: STOP (no carrier admitted).
  - The spec requires the projection: step 6 (:135) "Fold projects only the resulting holdFlag into engine state"; :93 "Only the resulting holdFlag leaves"; :155 reconstruct the "governor view".
  - It also closes every route to that projection:
    - :93 N20 "asserts by NAME that updateOpenerHold and _deriveSightingFull are absent from both returned objects".
    - :91 Evaluation is exactly {profile,status,basis,offers,refusal}.
    - :92 event='accept'|'close' and "decision is the exact validated issuance body".
    - :97 "No further exported helper, effect store, file or API is necessary".
  - Evaluated (r3\b7-probe.txt 2BAD6A9E): the runtime exposes 7 names, updateOpenerHold is undefined, and a Transition without a decision or with another event refuses RECORD_INVALID 'decision'. FC03 therefore cannot obtain a hold for a lift with no accept.
  - Owner/spec choice needed: admit ONE carrier, for example an applyNativeLoadDecision event 'governor' with no decision that returns state with only holdFlag projected, or a holdFlag member on the Evaluation.
- B8 (single-clause mutants, all KILLED; r3\mutants-summary.txt 9BF573ED):
  - M3 spent.push -> R3-M3 (plus B2/B3/B4 rows).
  - M6 original-count clause -> R3-M6 (v1 two slots vs sets 3 -> PLAN_CHANGED; R2-REVISION also reddens).
  - M11 changed=false -> R3-M11, R3-B2.
  - M12 answer check -> R3-M12.
  - New fixes: provenBefore -> R2-DEVICE, R3-B6; repair no-landing -> R3-B2; sessionOf lift match -> R3-B4.
- D5: R3-B3 durable compensation plus cold replay; R3-D5 conflict convergence in both delivery orders. D7a: R3-D7a (red RECORD_INVALID) re-validates an accepted record with the issued steps/inc (spec :154 "at its ORIGINAL cut"); load, vector, count and window are not restored.
- Regression: 18 local suites around the changed files show identical failures on f007506 and on this tree (18/666 each: pins, esbuild, guard-refused engine-capture and native-next-targets-assembly) (r3\regress-base.txt 90E4F919, r3\regress-head.txt C2505B88; temporary worktree removed).
- PRODUCER_REVISION re-bound: earned/native-load/v1+sha256:ff3788ecd4791721391f840f3ade805085975bbffec9c5f34668bbc1d5bf1957.
- Carried:
  - D7b: a later w=102.5 after a yes. Spec :156 asks for EFFECT_CONFLICT for "accepts versus incomparable plan edits", but no authenticated plan op exists to prove order, so today R1 drops the effect (PLAN_CHANGED) while R2 applies it. This needs a ruling.
  - D1 import family (FC09/FC10).
  - D2 N01/repaired parent.
  - D3 successor carriers and exact-head CI.
  - D4 bundle and phone pages.
  - D5 import rows and a kill during an open IDB transaction.
  - D6.
  - The panel has no compensation (undo) control: the host supports it, and FA02 does not specify one.
- Round-3 sha256: native-load.cjs 24d84b13...ddd6 (458); native-load-effects.cjs 7cec6b2a...cb52 (409); today-bindings.mjs 3139ab93...4a8c (1070); today-entry.mjs 40aa0e08...0722 (715); FC12 test 2877352f...942d (933, +138); FA03 test 658ca74f...289f (285, +85). All LF, with no added non-ASCII. Scratch: %TEMP%\nlr-build\r3.
