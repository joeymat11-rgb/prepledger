# CLAUDE REVIEW: NATIVE-LOAD red cells round 2 (A) and NATIVE-LOAD-SPEC R5 delta (B)
Reviewer: Claude (claude-fable-5-1), independent, review only. Builders: Claude Opus (cells and spec). Lock taken per run, released.
HASHES VERIFIED: native-load-options.test.cjs fca9b555...3638e (470 lines); NATIVE-LOAD-RED-REPORT.md 901d0fdb...96eac (59 lines,
matches this time); NATIVE-LOAD-SPEC.md 5da5bbdd...6afa51 (uncommitted M in earned-astra-96; diff vs 60bb5e9 = exactly :126, :195,
:274). NOTE: the cells report cites spec R5 as sha 29dbde56...; the R5 on disk (5da5bbdd) added the :126/:195 TARGET_QUEUED change
AFTER the builder read it. That ordering produces D-NLR-3. Nothing modified in either worktree.

## (A) VERDICT: ACCEPT WITH NAMED DEBTS (D-NLR-3 must be paid before commit; D-NLR-4 small)
Red run on the unchanged engine: 23 tests, 1 pass, 22 fail, every failure one of the two RED gate strings and nothing else
  (red-run-2.txt in my folder); loader contract unchanged (non-module errors rethrown).
D-NLR-1 PAID, verified by execution. expectOffers (:152-160) checks Decision.basis deepEqual request.basis and per-slot evidence
  (:129-145: keys {close,sets,start}, each item deep-equal to the registered typed entry, checked completion present); refs pinned to
  [Close Ref] in N02b, N03a, N04a, N07, N08, N13, N18, N19a, N19b. My meta copy wrapping the builder's current stub: baseline 23/23;
  builder defects reproduce (empty-evidence, basis-drift -> the 8 offer rows; refs-empty -> 9; no-comparator -> N04c). Mine:
  drop-last-slot, origin-added, current-original, evidence-extra-close -> 8 offer rows; eval-basis-drift -> 21; refs-start (Start
  Ref for Close Ref) -> 10; consumes-three -> N04b,N04c,N11. NOT caught: edits-hidden (edit Refs dropped) -> 23/23, because no
  OFFER row carries a corrected slot (N08's edit ends in a refusal). D-NLR-4: add one offer variant with a correction that still
  tops (e.g. C2 terminal corrected 7 -> 8) and assert its evidence edits equal [edit Ref].
N04c aligned to R5, confirmed on the unchanged readers before its gate (:296-301): _deriveSightingFull(V_pre) {null,0,[]};
  performedLoadMatches(C2,[100,100,100]) true; beatsNoise [true,2,1.8,0.37,n 6]; canonical earnWalk [DEBUT 105]; consumes length 2
  asserted (:310), values [fx-start-2, fx-start-3] in the stub (root encoding unspecified); no-comparator turns it red.
D-NLR-3 (must pay): N02c :240 asserts the spend_id string appears in the Evaluation (G4). Spec R5 :126 now says TARGET_QUEUED
  refs are the effect's authority Refs (accept response_refs / automatic record Ref / pending Close Ref), field null, and spend_id
  has NO slot: a conforming R5 evaluator FAILS N02c. The fixture also gives effect_frontier [] and a bare queue entry, so no
  conforming evaluator can produce the response Ref. PAYS: put the queued effect into basis.effect_frontier ({spend_id,
  response_refs:[ref('fx-resp-q')]}), assert refs deepEqual [ref('fx-resp-q')], drop :240, retire G4 at :18; tighten N05 :328 alike.
G5 (absent origin -> null): faithful. performed.cjs:74 treats a slot without origin as original, and the Decision is all-fields
  strict JSON (:60), so null is the only representation; but :60 also says keep null distinct from absent, so the spec must say it.
G6 (refs = [current Close Ref]): an invention where the spec is silent; sound for the completion-judging codes (WINDOW_NOT_TOP,
  PROVISIONAL, HELD_OR_HOT, NO_NEXT_LOAD, EFFORT_UNRESOLVED, PREFIX_UNRESOLVED), debatable for PLAN_CHANGED (the newer plan op is
  the implicated ref) and ERA_ORDER_BRIDGE_UNPROVEN (the fork). The spec must settle it. Deferrals, guard, D1 values and the pinned
  list are unchanged from round 1 and still right.

## (B) VERDICT: ACCEPT
N04 row (:274): re-derived: deltas 0,0,0 and 1,1,0 give sd 0.37 (progression.cjs:580-586), need 2*SQRT2*0.37*sqrt(3) = 1.8 (:603),
  margin 2, so beatsNoise clear and earnWalk :88 emits DEBUT 105; openRir9 2 never hot (earn.cjs:45); consumes [C2,C3] follows :121
  (noise comparator clause; citation correct); C4 unanswered -> [C3,C4], C3 COMPLETION_SUPERSEDED, consistent with step 2; [N]
  automatic record then TARGET_QUEUED. Matches my l1 execution and the cells' pins.
TARGET_QUEUED (:126, :195): inside the unchanged {code,refs,field} (:176 cited correctly); refs = authority Refs in canonical order
  from three named sources, field null; spend_id resolved via the fold's effects, which basis.effect_frontier carries, so a pure
  evaluator can produce them. One gap: refs when the frontier lacks the queued effect are unstated; [] is natural and should be
  written. No other line changed; rounds 1-4 content intact.

## What the spec should now state explicitly
G4: nothing more; R5 settled it and the cells must follow. G5: yes, one clause in :108 ("origin is the typed slot's origin, or null
  when it carries none"). G6: yes, one clause in :176 ("evaluation refusals about the checked completion carry [its Close Ref];
  PLAN_CHANGED adds the superseding plan op Ref, ERA_ORDER_BRIDGE_UNPROVEN the fork Ref, LEGACY_PENDING the queue reference,
  TARGET_QUEUED as :126"). Until then G6 is the cells' declared seam, not the spec's.
NOT DONE: no existing suite, product or engine byte, protected file, commit. Scratch under earned-nls-review\meta (write_file only).
