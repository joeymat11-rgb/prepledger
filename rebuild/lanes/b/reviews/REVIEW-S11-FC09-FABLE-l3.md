# REVIEW S11 FC09 round 3 (Fable l3): Today lists the Undo on the file's lift, queued-spend refs, forbidden-path exclusions

Reviewer: Fable (blind engine-tier read, round 3). Brief pm9-brief-s11-fc09-review-rf.txt as amended by the coordinator.
Head checked: worktree earned-s11-fc09-rf at 7cf4a877eedef7766e26433a3b2e0fe9dd0842e6 = 22ac52b + one commit; `git diff --stat
22ac52b 7cf4a87` = 7 files, 165/17: FC03 (+12), today-bindings (+14), today-entry (+7, one hunk), FC12 (+22), native-load-import
(+93), legacy-order.test (+20), local-today-journey.test (+14). No engine byte. Read in full: every product hunk, the four test
diffs, DECISIONS:884, FC01 :200-:280 and :372-:400 again for the queue/frontier reads. Hard limits kept as in rounds 1-2; the
m3/m4 forbidden-path counts below were taken as counts, no name listed.

VERDICT: ACCEPT WITH NAMED DEBTS. B3 is paid and proved; the Undo listing is correct under correspondence and unchanged with
shared ids; the PAGE_PINS re-pin is exact and its re-read claim is true line for line; the exclusions are by path before any
read. Nothing new in 22ac52b..7cf4a87 is reachable from genuine use as a problem.

## Runs on this seat (none loads a protected file)
- FC12 rebuild/m4/spec/native-load-options.test.cjs at 7cf4a87: 478 pass, 0 fail; R2-REVISION ok (no engine byte moved),
  FC09-LINEAGE-IDENTITY ok, FC09-LINEAGE-TQ ok.
- Scratch probe-tq3.test.cjs (my round-2 counterexample, unchanged cell, over the new FC03): page refs now
  [{op_id: fx-resp-1, ...}] on both pre-import completions, equal to the one-id twin; the fold applies the earn with no issue
  and the queue entry keeps its spend as written. B3 is paid.
- Scratch probe-r3.test.cjs, new differentials on the same history (pending pre-import earn after an unmoved renaming
  import): the Undo of the queued earn offers on both sides and the issued compensate bodies are equal after id
  normalisation (record space ['native-load-compensation','fx-press',...] on both); a post-import Close at 105 LANDS the
  debut on both (effects [landed fx-close-3], w 105, queue ESTABLISH/done); the check on that Close answers DEBUT_LANDED
  [Close] on both; the Undo after the landing answers COMPENSATION_DESCENDANTS [the Yes] on both. Output in run-probe-r3.txt.
- PM seat files, pass/fail only: r10o2 O3 0/2 red first (Q3-I), O9 478/478, O10 18/18, O11 20/20, O12 103/103, O13 25/25;
  callers-r9 C1-C4, C6, C7, C8 killed (C7 and C8 by Q3-I), C5 equivalent as ruled; r10reg2 B-H green except the page-bundle
  seat offset (B6) and the by-design EN3 mutants, and G7 127/129 = the composite run BEFORE the journey re-pin (its two reds are
  the drift pin and C4b, both the today-entry.mjs hash); r10p P1 local-today-journey 51/51 after the re-pin.

## Judgements
(1) B3 paid; can a transition or record now differ from the one-id twin? NO, on what I could reach. queueIn (FC03 :176-:180)
  re-addresses queue[].native_load_spend with the same `at` as the frontier, in evaluateNativeLoad ONLY, and only when some
  entry moves; viewOf's queue is otherwise handed on as is. FC01's evaluation reads a queue spend at :220-:222 (TARGET_QUEUED
  refs against the frontier), :245 (missedQ, by op id), :378 heldTrace and :399 (compensation, against req.intent.compensate),
  and in every evaluation those three sources - frontier, intent, queue - are now in ONE space: the base space for a current
  check, the record's own space for an Undo (at maps the whole lineage to it). Transitions are untouched: applyNativeLoadDecision
  still sees the queue as written and compares it with the decision's own ids (:566 type only, :600/:605 compensates, :633
  landing), which are in the record's space by construction, so a record's effect cannot move; my landing and Undo-after-landing
  differentials agree with the twin. Records issued from an evaluation: consumes and spend_id come from the view space (base for
  a current check, record space for an Undo), the basis is mapped back to FC03's own (round 2), so the body equals the twin's up
  to the id. q.id is not re-addressed and no evaluation reads it (grep: :633 only, a transition). With PAIRS null atLift
  returns the runtime before queueIn exists (:168), so shared ids are byte-identical (IDENTITY ok).
(2) The Undo listing: CORRECT under correspondence, UNCHANGED with shared ids, and it can neither list what FC03 refuses nor
  hide what it offers. today-entry.mjs:215-:227 builds the candidate set (effects queued/adopted, held issues, every uncancelled
  spend) and lists an Undo ONLY when h.check({lift, completion, intent:{compensate}}) answers offer, so a listed Undo is one FC03
  issued. Hiding needs a candidate missing or a wrong lookup: the set includes every spend of the fold (spent is the superset),
  the lift comes from spend_lifts (today-bindings spendLifts: effects + spent through the same shownLift and the same resolver
  p.args.lineage that check() folds with), held issues already carry FC03's resolved lift, and projected.lifts is keyed by
  shownLift (round 6), so the lookup lands on the lineage's newest normal completion; FC01's compensation path accepts any
  normal completion of the lift (:210-:216 before COMPLETION_SUPERSEDED), so "newest" cannot refuse where another would offer.
  Shared ids: shownLift with empty pairs is the identity, spend_lifts maps every spend to its own lift, shownOf returns exactly
  the former lift; the only byte change is the extra spend_lifts member on project()'s view, which no pin hashes. A missing
  spend_lifts (an older host) falls back to the former behaviour. Q3-I proves both forms on the real page path against a
  one-id twin file (an applied adoption and a queued earn), red at 22ac52b (O3) and killed mutants C7/C8.
(3) PAGE_PINS re-read claim: TRUE. today-entry.mjs sha256 on disk b3de1c31801714f800c36536cf338fade41432fee297c25f563a1c0b4b29e97d
  = the pin; `git diff 22ac52b 7cf4a87` on that file is ONE hunk inside the D9 listing; :524 `let hosts = options.hosts || null`,
  :534-:540 openTodayHosts only when none was injected, :688 `const owned = options.hosts ? null : hosts` (the comment says
  :687; off by one, harmless); the hunk reads projected.spend_lifts and opens nothing; spendLifts is a pure function of the fold
  and the resolver. gym-host/reading-host/checkin-host pins untouched. P1 51/51 at the PM seat after the re-pin.
(4) Exclusions by path before any read: YES, in both walkers. legacy-order.test.mjs callers() (:179-:186) and LOM-S6-LITERAL
  (:820-:834) test `forbidden` (src/ trees, conform/private and any private/, any soak path, ledger/, app.js, case-insensitive)
  on a directory BEFORE readdir and on every entry BEFORE descent or readFile, then the old skip; the roots are only rebuild/m3
  and rebuild/m4 (src/ and rebuild/conform/private are outside them anyway). The LITERAL cell self-tests the regex on eight
  forbidden and three allowed paths. Counts here, names not listed: tracked m3+m4 paths matching soak 16 (now excluded by both
  walkers), src/ 0, private 0, ledger 0, app.js 0; on disk no directory named src/private/ledger and no app.js under m3/m4.
  My round-2 N5 is paid.
(5) Anything else new: FC09-LINEAGE-TQ (B3 pinned, page/admission forms, with and without the imported prefix, the Undo of the
  queued earn too); native-load-import's realShapeHistory gains `prepare` (a rung ladder for the earn case), `file` (a cell-built
  sealed file, sealNamed) and reads fileLift from the ADMITTED state rather than variant(1) (a correctness fix for the twin
  file); observedWorkout gains `top` (log at the card's load at top reps); the import test now imports today-entry.mjs
  (createTodayModel/createWorkoutEntry), so Q3-I is the shipped listing, not a re-statement. No product byte beyond the three
  hunks above; PRODUCER_REVISION and treeSha256 unmoved (R2-REVISION green).

## BLOCKING
None found.

## NAMED DEBTS
N1 Carried from DECISIONS:882/884 and my rounds 1-2 (unknown lift-keyed map; post-import rename without a writer; D-S11-FC10;
   D-S11-EN3-COPY; the admission view workout_facts split; F9 superseded-only refusal; resolver refusal on two setup ops;
   F9 'applied' label for a superseded-held spend; runbook wording on PLAN_CHANGED after a moving import; B-LOM reopen law;
   no-queue file; the two re-key rules that must agree, pinned by FC09-LINEAGE-C5).
N2 queueIn re-addresses native_load_spend but not queue[].id; harmless today (no evaluation reads q.id), named so a future
   FC01 evaluation reader of q.id is caught by the TQ row's twin comparison rather than by luck.
N3 spend_lifts is derived from the fold in project(); check() re-folds and could in principle see another fold on a changed
   store (NATIVE_LOAD_STALE_OFFER already guards respond); listing and check are two reads, as they were before this change.
N4 The journey comment cites :687 for a line at :688.

## What I did not verify
- Q3-I, LOM-S6-LITERAL, callers() and local-today-journey were not run here (they load admission or boot the installation);
  judged statically plus the PM's pass/fail files and the hash on disk.
- FC03 site/base-view/boundary mutants and caller mutants were not re-run by me; the TQ, probe-tq3 and probe-r3 cells are my
  own executions on this head.
- Shared-id byte identity of the page's listing was reasoned (identity resolver), not measured against 22ac52b.
