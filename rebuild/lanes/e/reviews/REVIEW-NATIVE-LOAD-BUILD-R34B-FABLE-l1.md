# REVIEW NATIVE-LOAD BUILD ROUND 34B (closing read on the final bytes) - FABLE l1

Reviewer: Claude Fable, commissioned by the Earned PM (DECISIONS:868); blind; engine tier; new bar; closing read after R34 l1

Object (worktree %TEMP%\earned-nlr, HEAD bd7654a798592a7dae421b9d68fec850fb0993d1, uncommitted), sha256 measured with Get-FileHash, all equal
to the coordinator's final bytes:
- FC01 rebuild/engine/native-load.cjs dd197849fe92a493dee86ed7c530bdc9e1c22d382004fa4ee6c04968de7e0a73 (unchanged)
- FC03 rebuild/m4/workout/native-load-effects.cjs 38c67a9855a698392ae6a422f5cc8a7101aa16a74592019b3021462354b9e1c3 (unchanged; byte-equal
  to my scratch copy fc03-r34.cjs, checked by mk-m34b.cjs)
- FC12 rebuild/m4/spec/native-load-options.test.cjs 0e5ef0cb16a62d32ad4d9e32e235afd020aac24d795d3dfafd2dc59f1931fe0a (447 rows)
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752 (unchanged)
- report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md bc5b7b646a8b8947597c8728988c1f732d1115d523480df9c023e4b0f749ecf1

Review files seen in rebuild/lanes/e/reviews: REVIEW-NATIVE-LOAD-BUILD-R34-FABLE-l1.md (mine, efbf79e9...), REVIEW-NATIVE-LOAD-BUILD-R34-CLAUDE-l1.md
(listed, not read); the R33 FABLE and CLAUDE reads (read for R34 l1). No R34B file of another reviewer existed when I wrote this.

VERDICT: ACCEPT WITH NAMED DEBTS (D-R34F-1..3 carried from R34 l1; nothing new)
REQUIRED CHANGE: no

Method as in R34 l1: pm-run shared, one slot (job fable-r34b-p5), scratch %TEMP%\review-nlb-r34-fable-scratch (run34.ps1, deps-loader.mjs,
swap.cjs; earned-look-cui4 junction; TZ America/New_York, MEASURED_TEST_NOW 2026-09-03; nothing protected loaded). The mutant ran IN MEMORY
only (swap.cjs, "RVW_SWAP ... :1" in its TAP); no object file written.

## 1. Hashes: the five above, equal to the final bytes; FC01, FC03, FA03 equal to my R34 l1 object.

## 2. Only the appended row and the Round 34 section changed
- FC12: git diff 96354fe (holds 5de5b74e) -> worktree: one hunk "@@ -8587,3 +8587,61 @@", 58 insertions, 0 deletions, after the last row
  (R34-ISSUANCE-TWO-REMOVED-FACTS-STAYS-NULL): the helper r34relogScripted and the one row R34-BR34C1-TWO-REMOVED-ROOTS-KEEPS-LATER-YES.
  No existing row touched.
- Report: the sweep commit carries an older report, so the byte-exact 6597d9be copy in %TEMP%\earned-astra-163 was the base:
  git diff --no-index: 9 insertions, 6 deletions, hunks at :4254, :4301, :4310, :4324, :4366, all inside "## Round 34" (:4252 to the end,
  4372 lines; the Round 33 section ends at :4251). The changed lines are the end-bytes line, the rows table, the new row's line, the final-run
  table (FC12 447/447, FA03 103/103) and the PM summary line.

## 3. The new row (read whole, FC12:8589-8647)
- It runs the REAL durable host: D1 press 40 x10; D2 press set 1 logged at 45, undone on the saved-set screen and logged again (one removed
  fact BEFORE any yes and one live fact in that slot), Finish, Check, YES adopt-observed 45; D3 45 x12, Finish, Check, YES earn 50; then D2's
  live press set 1 REMOVED through prepareWorkoutEdit/commitWorkoutEdit (the slot now holds two removed facts, "removed-facts 2" asserted),
  then a native-load check with intent compensate on the earn's spend (a read, nothing written).
- It asserts the spec outcome: issues exactly [BASIS_REPAIR_REQUIRED, null, demo-press, [the adoption's response]] (:166, D-R9-1: the removed
  set was the adoption's consumed evidence; never RECORD_INVALID), both spends kept uncancelled (:155 "a later edit never revokes it"), and
  the earn's Undo offered (:160 EXIT (a), "demo-press compensate").
- Overlay built by me (mk-m34b.cjs): the one string "for (const r of Array.isArray(slot.removed_facts) ? slot.removed_facts : [])" ->
  the same with ".slice(0, 1)", matched exactly once in the r34 bytes, written to mut\F34B-FIRST-ONLY.cjs (6a30458625e9...), swapped in memory.
  row-final (final bytes, pattern R34-BR34C1): 1/1 green. row-mut (the mutant): 0/1 RED, failing at 'the history': the undo-check returns
  'refused' instead of 'offer', the earn's yes lost on the real host. Whole FC12 under the mutant (fc12-mut): 446/447, the only red row the new
  one, which confirms the other reviewers' finding that this mutant survived the 446 rows and that the row now kills it. (My own R34 l1
  mutant M13 was slice(1), the complementary shape, killed by the three BR33C1 rows; slice(0, 1) was not among mine.)

## 4. Whole suites on the final bytes: FC12 447/447 (fc12-final, 66 s, walks and fuzzes at defaults); FA03 103/103 (fa03-final, 37 s).

## 5. Real-host walk on the final bytes, new seeds (walk-host.test.mjs as in R34 l1, actions and invariants unchanged)
| shard | seeds | result | yes | removals after a yes | corrections | Undo ack | end issues |
|---|---|---|---|---|---|---|---|
| w5 | 39001..39120 (Opus mix) | 120/120, 0 fails, 203 s | 207 | 157 of 301 | 295 | 32 | REPAIR 77 |
| h5 | 40001..40120 (heavy mix) | 120/120, 0 fails, 228 s | 134 | 346 of 883 | 647 | 52 | REPAIR 60 |
240 new seeds, 0 counterexamples, no RECORD_INVALID at any step, every cold reopen equal, no EFFECT_CONFLICT ending in these shards.

## Debts carried (unchanged by this round; none new)
- D-R34F-1 reader-only stale yes (host-unreachable, STALE_OFFER). D-R34F-2 the spec-prescribed EFFECT_CONFLICT after a removal inside a
  landed earn's evidence following a later yes (seeds 36152, 36235; exits not exercised). D-R34F-3 a second device unmeasured.
- Not verified: CI for the new host rows' imports (the PM's hosted sweep). Nothing committed, staged or pushed; DECISIONS/STATUS untouched;
  my only writes outside scratch are the R34 l1 review and this file.
