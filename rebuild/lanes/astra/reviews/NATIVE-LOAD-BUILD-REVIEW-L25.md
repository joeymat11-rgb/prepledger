# Native Load Build Review L25
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM under DECISIONS:777-868; blind review, round 25; highest effort; engine tier; new bar of DECISIONS:866
Head: bd7654a798592a7dae421b9d68fec850fb0993d1
SHA256 rebuild/engine/native-load.cjs: dd197849fe92a493dee86ed7c530bdc9e1c22d382004fa4ee6c04968de7e0a73
SHA256 rebuild/m4/workout/native-load-effects.cjs: 38c67a9855a698392ae6a422f5cc8a7101aa16a74592019b3021462354b9e1c3
SHA256 rebuild/m4/spec/native-load-options.test.cjs: 5de5b74e25b6d0b8707191c21a5d1ea8d9b8b8d914a0d0dc6f9a597d09a1f040
SHA256 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs: eb3693000e8349c78c83ed8fb4deddc23901153bd12e24bb1fef4dad5849b752
SHA256 rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md: 6597d9beef0688b506ee66491f2d60be667512d0bf40a85c4118013959333b5f
VERDICT: REJECT

REJECT: one genuine-use COVERAGE blocker, L25-B1. No product counterexample on the reviewed bytes was found in the executed host histories. The current implementation passes the new counterexample; the supplied suites also pass a mutant that loses its genuine earn.
All fixture values are invented. Evidence root P: C:/Users/joeym/AppData/Local/Temp/earned-l25-astra-scratch. Filenames below are relative to P.
Blind order: spec and public code, host guards, independent probes and twelve mutant choices first; author Round 30-34 product/debt/result claims last. Their reported sweeps are not counted as my measurements.

## 1. PRODUCT BYTES
Spec 7ef8291 and refs/remotes/origin/rebuild/c-native-load-spec independently hash to eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb. All commissioned clauses were read, including whole (iv) A-LEGACY-VECTOR and (v) LEGACY-OVER-NULL.
Initial status contained exactly the five announced modified files. Of 139 positively selected public product paths, 137 equal bd7654a byte-for-byte; only FC01/FC03 differ. FC01 and FA03 also equal the actual L24 worktree's round 33 files. Protected/unopened products were not separately hashed. Evidence: product-hashes.json, setup.py, explicit-path *.diff.
Round 33 -> 34 FC03 diff is +7/-2: the sameCut removed-fact loop and its response argument. FC01, issuanceFor, producer revision, templates and displayed strings did not change in this round. Independently recomputed producer digest is 3c86253710607d45b467047ec858b8780483643cd5c3b9b53306040a59099b5e, matching PRODUCER_REVISION.
Supplied FC12 446/446 and FA03 103/103 pass. Public factories/host helpers were inspected and run under a positive file/module allowlist, denied writes and denied child processes; unexpected accesses 0. No protected engine was loaded. Evidence: allowed.json, host-graph.json, host-run.mjs, host-fc12-head.json, host-fa03-paired.json.
Independent paired folds on identical inputs, previous FC03 with current FC01 versus current FC03: FC12 23,491 calls, 23,421 equal, 70 changed; FA03 4,422/4,422 equal. Every changed fold reached the new uncovered-later-removed-fact gate. Changes remove RECORD_INVALID issuance, and in 46 cases its dependent RECORD_INVALID compensates; consumed-evidence BASIS_REPAIR_REQUIRED is retained. Zero outside-boundary changes. All 446 FC12 callbacks still pass in the corrected comparison run. Evidence: comparison-fc12-paired-final.json, host-fc12-paired-final.json, comparison-fa03-paired.json.
Three stateful fault-injection callbacks run once, with no double invocation of their sentinel counters; they are not skipped. The initial double-invocation run disturbed those counters and is retained as comparison-fc12-paired.json, not counted as product failures or valid differential evidence.
Before-yes control is unchanged: the synthetic stale record remains RECORD_INVALID issuance; the REAL host removal between offer and yes gives NATIVE_LOAD_STALE_OFFER and zero writes; removal before Check offers the held-lift adoption exit instead of that earn. R34-BR33C1-CONTROL-REMOVAL-BEFORE-THE-YES passes. M07 turns its synthetic part (a) red.
The measured change conforms to :155 ORIGINAL CUT/D-R9-1 and :166: later removals preserve genuine consent; repair belongs to the record whose own evidence changed. :160 remains usable: the new two-root host case offers and accepts the earned Undo, retaining its cancelled spend. Evidence: host-two-roots-undo.json.

## 2. YOUR L24 ITEMS
L24-B4/M06 is closed: the exact FC01 removed_facts.length === 1 -> > 0 overlay is red on R34-ISSUANCE-TWO-REMOVED-FACTS-STAYS-NULL; current product passes. Evidence: L24-M06.json, host-mut-L24-M06.json (28/29 selected rows, sole failure that row).
L24-B1 needs re-log after the consumed session is closed. Both direct gym.logSet and client.prepareWorkoutContinuation refuse WORKOUT_ALREADY_CLOSED, 226/226 attempts each. No write reaches the reader.
L24-B2 needs undoing a removal after yes. Preparing an edit of the tombstone refuses WORKOUT_EDIT_TARGET_UNAVAILABLE, 226/226; editing the removed set refuses WORKOUT_EDIT_INTERPRETATION_REQUIRED, 226/226.
L24-B3 needs removing/restoring a skip after yes. The host edit preparation refuses skip targets, 119/119. The active-session probe also refuses an added slot with WORKOUT_RESUME_SLOT_UNAVAILABLE and refuses a check without a Close with NATIVE_LOAD_COMPLETION_REQUIRED; zero writes.
These are D-READER-ONLY under DECISIONS:867-868. Static joins checked: continuation.mjs:30; public-client.mjs:333-338, 378-384; gym-model.mjs:500-533. Evidence: host-own-final.json, host-guard-host.json. No current host path to B1-B3 was found.

## 3. GENUINE-USE WALK ON THE REAL HOST
Independent xorshift seeds 25050001-25050048: 48/48 pass, two lifts, four sessions per seed, 192 normal Finishes, 793 logs including re-logs, 75 skips, 111 before-Close and 235 after-Close corrections, 100 saved-set removals before Close and 226 later removals across current/earlier sessions and lifts.
Actual host answers: 174 declines writing zero operations; 129 ordinary yeses (72 adopt-observed, 48 adopt-baseline, 9 earn); 58 accepted Undos (29 observed, 23 baseline, 6 earn); 89 refused Undo attempts; 48 cold reopens.
At 1,978 projection points the oracle checks: no genuine-record refusal; every accepted non-compensation spend retained; issued payload bytes unchanged; scalar and queue loads backed by initial basis or recorded consent; null advice backed by a hold or consented Undo to the baseline ask. Immediate adoption/earn effects and Undo tombstones are asserted, and cold state/spends/issues equal warm. Zero failed invariants. Evidence: own-host.js, host-own-final.json.
All 8,220 folds paired during that walk equal round 33. The independent oracle's initial assumption that null always needs an active hold was false under :158's Undo of an exit. Its nine resulting failures, all at baseline Undos, remain in host-own-walk.json and own-host-initial-oracle.js. The corrected oracle explicitly requires a consented null Undo; it does not exempt arbitrary nulls. One later scratch parse error is retained in stdout-own-final.txt and was corrected before the successful run; no product was changed.
Copied and inspected the specified Claude scratch walk, then ran seeds 33001-33016 through the guarded real host: 16/16 pass, 64 Finishes, 229 logs, 32 saved-set Undo/re-log branches, 27 skips, 31 yeses, 8 unanswered/no branches, 40 later removals, 36 later corrections and 4 adoption Undos. Its 1,954 paired folds are identical. This copied walk's no branch only leaves an offer unanswered; the 174 actual declines above exercise respond('decline'). Evidence: claude-walk-readonly-copy.txt, claude-walk.js, host-claude-copied.json.
The supplied real-host R34 row independently regenerates seeds 33204, 33329 and 34175 and passes its exact load, issue, spend and reopen assertions. The new three-session two-root sequence also passes current bytes and keeps the earned Undo reachable. Evidence: host-two-roots-head.json, host-two-roots-undo.json.
Measured host outcomes include refusal of post-Close re-log, restoration/edit of removed records and skip editing. No hand-edited issuance or operation is presented as genuine use. Reader-only debt probes are separate below.

## 4. YOUR OWN NEW MUTANTS
Twelve independent single-clause FC03 overlays were chosen before reading the author report. All ran on the same 29 positively selected FC12 rows (R32/R33/R34 plus N08/N08b/N24); every survivor then ran whole FC12 and whole FA03. No supplied callback, assertion or expectation was weakened or removed.
Nine mutants have behavioral kills in supplied rows. M01 remains LIVE in both whole suites and has a reproduced genuine-host difference: BLOCKING coverage, L25-B1. M08/M09 remain LIVE but their differing histories cannot be written by the current host: named debts, not blockers. Byte pins are never counted as behavioral kills.
Independent two-root host sequence kills M01 and M10 while passing the product. A later-correction variant passes both the product and M11; M11 is killed by the existing R9-B24c other-lift row instead. This avoids claiming an ineffective witness as a kill.
Evidence: mutants.json, M01.json..M12.json, mutant-batch.json, host-mut-M*.json, host-full-{fc12,fa03}-M{01,08,09,11}.json, host-two-roots-M01.json, host-two-roots-M10.json, host-earlier-correction-{head,M11}.json.

## 5. THE NAMED DEBTS D-R33-1 TO D-R33-5 AND D-READER-ONLY
D-R33-1: no current-host reachability. Its consent loss requires log/remove/yes followed by a NEW fact in the closed consumed session; the post-Close re-log refusals in Q2 prevent it.
D-R33-2: four changed/re-digested record inputs (different safe prefix, different safe frontier, numeric tenure_start, fractional hi) still apply 95 on the absent-revision branch. These require record surgery. Supplying such issuance through the real host's respond does not replace the held record: the stored producer prefix is 2, hi 12 and typed states performed. No genuine-action wrong-load/refusal witness found.
D-R33-3: no current-host reachability of the specified failure. Multiple removed facts can arise before Finish, but restoring either after yes requires the refused tombstone edit. M06 now pins the unchanged multiple-removed issuance shape. L25-B1 is a different reachable sequence: re-log BEFORE Finish, removal of the remaining ACTIVE fact AFTER yes.
D-R33-4: re-labelling/re-digesting an unnamed slot to removed/unresolved is still accepted; the removed relabel suppresses repair. The real producer never accepts that caller-supplied evidence, and the reader example's post-Close log is host-refused. Named hardening debt.
D-R33-5: a payload-less correction is WORKOUT_ORIGINAL_SHAPE_INVALID in the real reader; its valid replacement_fields control resolves correctly. Real host missing/empty/fractional-rep corrections write zero records, and targeting a correction for another edit refuses WORKOUT_EDIT_TARGET_UNAVAILABLE. No faithful-host history reaching the unbound proper-prefix branch was found.
D-READER-ONLY: B1-B3 remain as reader-level cases, reopened if sync, import or second-device code can write into a closed session or restore/edit a removed set or skip. Current guards were exercised, not bypassed.
Evidence: witness24.cjs, host-debt-reader.json, debt-host.js, host-debt-host.json, host-own-final.json, host-guard-host.json.

## 6. WHAT IS OWED
Add a supplied regression row for L25-B1's real-host sequence. It must pass these product bytes, fail M01 behaviorally, retain both spends and preserve the earned Undo; pin the real producer output instead of editing/re-digesting its issuance. No product modification is demonstrated necessary by this review.
Then rerun FC12/FA03 and the named mutant on the final proposed bytes. The PM/integrator still owns the prohibited CI-only admission families and Windows/Linux checks at the exact proposed commit. This review is not merge, seal, import or deploy approval.
Carry the named debts below without presenting impossible current-host histories as product blockers. No further current-byte product defect is claimed from these finite measurements.

## BLOCKING
L25-B1 COVERAGE, FC03:846. M01 changes the removed-fact loop to inspect only removed_facts.slice(0,1). Whole FC12 446/446 and FA03 103/103 pass, zero guard denials, while the following genuine host sequence loses an accepted earn under that mutant.
INPUT/ACTIONS: D1 press 40 x 10 and Finish. D2 log first original press slot at 45 x 10, saved-set Undo removes it, re-log 45, complete original work, Finish, Check and yes adopt-observed45. D3 train 45 x 12, Finish, Check and yes earn50. Then remove D2's currently ACTIVE press slot1 through prepareWorkoutEdit/commitWorkoutEdit.
REAL PRODUCER: D2's accepted adoption names the re-logged fact; D3's earn consumes D3 alone and offers DEBUT50. Both responses are the host's unchanged durable issuance, with no field or digest rewritten. D2 slot1 now contains two removed facts: the old before-yes root and the newly removed root. The re-log occurs before Finish; only the final removal occurs after the yes.
OUTPUT: current FC03 keeps both spends, raises only the adoption's BASIS_REPAIR_REQUIRED and projects the held lift at null. M01 checks the old covered root, misses the second root's later tombstone, re-evaluates an unreproduced cut and adds RECORD_INVALID issuance for the earn; spends drop from 2 to 1. Required :155/:166 keeps that yes; :160's earned Undo is offered, accepted and cancelled on current code.
This is a reachable coverage counterexample, not a claim that the submitted product already loses this consent. Evidence: two-roots-host.js, two-roots-undo-host.js, M01.json, host-two-roots-{head,M01}.json, host-two-roots-undo.json, host-full-fc12-M01.json, host-full-fa03-M01.json. Required repair: a supplied behavioral row that kills M01.

## NAMED DEBTS
D-R33-1: S4 can lose a consent after a consumed slot is re-logged under a new fact after yes; current host refuses that closed-session write; reopen with any new writer that permits it.
D-R33-2: safe-but-different prefix/frontier and opaque programme-image values can survive edited/re-digested records; no genuine host record counterexample measured.
D-R33-3: restoring one of several removed facts after yes can lose the consent issued with original null; current host refuses restoration of a removal.
D-R33-4: unnamed no-fact state is bound only to unlogged/unresolved/removed; edited/re-digested records can suppress exact historical-state repair; current host owns the issuance.
D-R33-5: an unfaithful malformed edit history can leave proper-prefix state/current unbound; the measured malformed correction is reader-refused and the host cannot write it.
D-READER-ONLY: L24-B1/B2/B3 stay reader-only; reopen if sync, import or second-device paths write into closed sessions or restore/edit removed sets or skips.
D-L25-M08: LIVE removed-state-only sameCut mutant differs on changed removed facts beneath a live/skipped slot; current host cannot create that post-yes history.
D-L25-M09: LIVE some-to-every response-order mutant needs multiple same-spend yes records straddling a removal; two held host handles produce one response and alreadySaved on retry, including after removal.
D-L25-SCOPE: finite public fixtures, 48 new seeds, 16 copied seeds and twelve overlays do not exhaust histories, programme domains, faults or delivery orders; protected/unopened product bytes and author sweep totals were not independently reverified.
D-L25-INTEGRATION: CI-only admission, full conformance, external import/sync, installed-device recovery, physical phone/theme behavior and Windows/Linux exact-commit CI remain unverified here; earlier custody/configuration and UI-policy debts are not discharged.

## Mutation table
FC12 counts are measured pass/total. S29 is the named 29-row screen; whole means all 446 callbacks. FA03 whole is all 103 callbacks. Dash means not run after an existing behavioral kill. LIVE refers to the supplied suites, even when a new scratch witness kills it.
| ID | Changed invariant | FC12 | FA03 | Result / behavioral killer or debt |
|---|---|---:|---:|---|
| M01 | only first removed fact inspected | 446/446 whole | 103/103 | LIVE; genuine two-root witness kills; L25-B1 |
| M02 | only accepted lift inspected in sameCut | 28/29 S29 | - | KILLED R34-BR33C1-HOST-WALK-HISTORIES |
| M03 | only consumed sessions inspected | 26/29 S29 | - | KILLED R34 host walk, host minimal, fold minimal |
| M04 | removed source checked without edits | 26/29 S29 | - | KILLED same three R34 rows |
| M05 | any existing removed op treated as before yes | 26/29 S29 | - | KILLED same three R34 rows |
| M06 | covered removed root exempts later edits | 26/29 S29 | - | KILLED same three R34 rows |
| M07 | before-yes exception removed | 28/29 S29 | - | KILLED R34 control (a), a synthetic stale record |
| M08 | removed facts checked only in removed-state slots | 446/446 whole | 103/103 | LIVE; host-inaccessible difference; D-L25-M08 |
| M09 | removed op must precede every duplicate yes | 446/446 whole | 103/103 | LIVE; one host response; D-L25-M09 |
| M10 | covered old removed fact prematurely returns true | 28/29 S29 | - | KILLED R34 host walk and new two-root witness |
| M11 | live-fact edit coverage omitted | 445/446 whole | 103/103 | KILLED R9-B24c ANOTHER LIFT'S LATER CORRECTION |
| M12 | consumed removed slot suppresses repair | 24/29 S29 | - | KILLED R33-FUZZ and four R34 rows |
| L24-M06 | FC01 picks first of multiple removed facts | 28/29 S29 | - | KILLED R34-ISSUANCE-TWO-REMOVED-FACTS-STAYS-NULL |

## What I did not verify
No prohibited source/private record, legacy engine, protected soak, admission suite, full engine directory suite, build receipt, installation, import, sync, deployment or CI job was read/run. No physical phone/theme inspection; FA03 is the real application/host/repository path over synthetic IndexedDB and a DOM fixture.
The comparison of 139 public product paths is scoped, not an exhaustive hash of forbidden/unopened files. No claim of reproducing the authors' 960-seed sweep or old mutation tables. The three stateful fault-mock rows pass normally but are not double-evaluated as pure comparisons.
All five commissioned file hashes remain exactly those in the header. Only this new review file was written in the worktree; probes, overlays and evidence remain under P. Nothing committed, staged, pushed or deleted.
Final scoped Git outputs are pasted below; paths are the five commissioned files and this review file.

```text
git status --porcelain -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L25.md
 M rebuild/engine/native-load.cjs
 M rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md
 M rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs
 M rebuild/m4/spec/native-load-options.test.cjs
 M rebuild/m4/workout/native-load-effects.cjs
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L25.md

git diff --stat -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L25.md
 rebuild/engine/native-load.cjs                     |   31 +-
 rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md        | 3337 +++++++++++++++++++
 .../today/test/native-load-panel.test.mjs          | 1085 ++++++
 rebuild/m4/spec/native-load-options.test.cjs       | 3450 ++++++++++++++++++++
 rebuild/m4/workout/native-load-effects.cjs         |  182 +-
 5 files changed, 8070 insertions(+), 15 deletions(-)
```
