# CLAUDE REVIEW: NATIVE-LOAD red cells round 3 (A) and NATIVE-LOAD-SPEC R6 (B), final
Reviewer: Claude (claude-fable-5-1), independent, review only. Builders: Claude Opus. Lock taken per run and released; nothing modified.
HASHES VERIFIED: test 99f5bdb6...9d88c (497 lines); report 6e3cb76b...4447b; spec R6 55f74e1f...2bb39, diff vs 60bb5e9 touches
exactly :108, :126, :176, :195, :274 (checked with git diff, explicit path). Report read whole; every changed test line read.

## (A) CELLS: ACCEPT
Red run (my own, TZ America/New_York): 25 tests, 1 pass (GUARD), 24 fail; 22 x RED NATIVE_LOAD_MODULE_ABSENT, 2 x RED
  UPDATE_OPENER_HOLD_NOT_EXPORTED; no other assertion or exception in the TAP (red-run-3.txt in my folder). Both new rows and
  N08b reach their gate only after green preconditions on the unchanged engine.
D-NLR-3 PAID. N02c (:245-250) puts the queued effect in basis.effect_frontier ({spend_id,response_refs:[fx-resp-q],close_ref:null})
  and asserts refs deepEqual [ref('fx-resp-q')], field null; "N02c frontier-absent" (:251-256) asserts refs [] and field null,
  matching R6 :126's new sentence; N05 (:343-344) re-checks with the accepted effect in the frontier and asserts refs
  [ref('fx-resp-1')], field null. G4 retired (:18). The old G4 behaviour (spend_id as a ref) now turns both N02c rows and N05 red
  (builder tq-spend-ref, my tq-close-ref and tq-field, each -> N02c,N02c,N05).
D-NLR-4 PAID. N08b (:364-373): C1 [10,9,7] corrected to [10,9,8] with e(2,2,2) tops (performedLine pinned) and yields the EARLY
  offer; set 3 must carry edits [fx-edit-1-3 Ref], original fx-set-1-3 Ref and current reps 8. edits-hidden (builder's and mine)
  -> N08b only, exactly the hole I reported.
Meta (my copy, builder stub wrapped unmodified): baseline 25/25. My defects: edits-hidden -> N08b; tq-close-ref, tq-field ->
  N02c,N02c,N05; plan-ref-order -> N07; era-close-only -> N13; original-null -> the 9 offer rows; refs-start -> 12; drop-last-
  slot -> 9; eval-basis-drift -> 23; consumes-three -> N04b,N04c,N11. Nothing I planted survives.
G5/G6 match R6 exactly: origin null when absent (:129-138 vs :108); completion-judging codes carry [Close Ref] including
  EFFORT_UNRESOLVED (:440) and PREFIX_UNRESOLVED (:401); PLAN_CHANGED = [Close Ref, fx-plan-edit-1 Ref] (:354) supplied through
  load_basis.authority_refs; ERA_ORDER_BRIDGE_UNPROVEN = [Close Ref, fx-fork-1 Ref] (:449) through technique.fork_refs; TARGET_QUEUED
  without Close Ref. LEGACY_PENDING has no common D1 row and is rightly not asserted. Remaining seams (G1 encodings incl. frontier
  entry form, authority_refs, fork_refs; G2; G3; consumes root encoding) are honestly declared and are the brief's to bind.

## (B) SPEC R6: ACCEPT WITH ONE NAMED DEBT (D-NLS-8, one line)
:108 (G5) states origin null for a slot with no typed origin, citing performed.cjs:74 (verified: origin!=='added' counts it
  original) and reconciles it with :60's null/absent rule. :126 adds refs [] when the frontier lacks the effect, closing my (B)
  gap from l2. :176 (G6) names the Close-Ref default, the PLAN_CHANGED and ERA exceptions with canonical order, TARGET_QUEUED as
  :126, and the outcome table :195 and D1 :274 follow. :274's N04 row is unchanged from R5 and still right.
D-NLS-8 LEGACY_PENDING = [Close Ref, authenticated source Ref of the legacy queue entry]: a seed-carried or merge-minted legacy
  entry (the check measured mergeState minting one during import preparation) has no operation or source-member Ref of its own,
  so that clause cannot always be met. PAYS: "...or [Close Ref] alone with field 'queue' when the entry has no authenticated
  source Ref", mirroring :126's [] fallback. No cell depends on it.
NOT DONE: no existing suite, engine or product byte, protected file (guard verified again), commit. Scratch under
earned-nls-review\meta, write_file only.
