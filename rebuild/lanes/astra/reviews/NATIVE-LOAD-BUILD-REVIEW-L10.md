# Native Load Build Review L10
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM under DECISIONS:777-794; blind review, round 10; highest effort; engine tier
Head checked: c0695e037322c5b9c850b017d8a03842b5ad58b9
VERDICT: REJECT
Two regression-coverage blockers are measured below. The unmodified implementation passes their distinguishing inputs. No unmodified wrong-load counterexample was found in the executed scope.
Spec: R9.8, origin/rebuild/c-native-load-spec at 105cc28. Range e04b8e6..c0695e0 is rounds 17/17a/17b over the round-16/16b base.
P = C:/Users/joeym/AppData/Local/Temp/earned-nls-L10-c0695e0. Every fixture and numerical input/output here is INVENTED.
Blind order: spec/rulings and implementation first; prior review findings second; author Round 16/16b, 17/17a/17b and REVIEW INDEX last. The author's report was treated as a hypothesis.

## 1. RESTORE AND RETIRE BY RECORD SHAPE (B28)
R9.8 :156 resolves L9 B31: an APPLIED adoption is undone from auth.prior regardless of compensation shape. This differs from R9.7's former no-write RETIRE rule.
Retained L9 probes: adopt100->105, issue RETIRE while an unordered102.5 holds it, replay at100 -> applied adoption105, then compensated100. Lower adoption100->95 with RETIRE97.5 likewise restores100, exactly the prior accepted image; R1/R2 agree. No result above that image was found.
RESTORE of the observed adoption replays100 over unordered102.5; baseline RESTORE replays null over45. RESTORE claiming an earn refuses RECORD_INVALID target_load; numeric-base adoption claiming baseline kind refuses base_load. The compensate exemption from movedBase is necessary and discriminating.
New input: replay the genuine scalar RESTORE over w102.5,wSets[102.5,100,97.5]. Original restores w100 and ABSENT wSets; the actual public capture adapter emits [100,100,100]. Mutant L10-M02 leaves [102.5,100,97.5] and the same adapter emits that stale vector. B35 is the missing regression row.
Evidence: P/probes.jsonl, P/equality-shape-probes.jsonl, P/new-diags.jsonl; submitted R16-B28, R17-RETIRE-MEETS-APPLIED and R17b-B31.

## 2. SPEND SUFFIX AND CANCELLATION EQUALITY (B29)
FC12: 145 submitted checks PASS. Four retained L9 checks and four new independent checks also PASS. Real durable host/DOM: 43/43 PASS.
B29: after accepting and undoing Q105, one new top is PROVISIONAL; two new tops offer105 consuming only those two. The spend-suffix mutants are discriminating.
No genuine cancellation wrongly refused by every/exact-body equality was found in restart, duplicate accept, two-device causal-fold, mixed-shape cancellation, R1/R2 or the 17000-seed walk. This is bounded evidence for the present producer.
Premise P is qualified: programme/queue digests cover the exercise and queue fields that calculate the body; the governor changes only holdFlag outside FIELDS. The record's basis, INCLUDING effect_frontier, is echoed. The digests do not independently authenticate that frontier.
Executed FRONTIER_ECHO_COPY: replace a frontier response Ref with an absent op and re-digest, retaining both cut hashes -> w100, cancelled=true, issues[]. This remains the admission residual, not a guarded-host bypass.
Counterfeit matrix: genuine RETIRE102.5 applies102.5; re-shaped RESTORE100 at its reproducible present-revision cut refuses RECORD_INVALID issuance and stays held; the same counterfeit under R2, or with only the programme digest zeroed under R1, applies100 and cancels. S1-S8/DERIVABLE do not prove issuance. D-L10-1 carries this explicitly.

## 3. EARLIEST-CUT PLACEMENT (R7-canon-cut, R16b-CANON-CUT)
The early-cut copy correctly refuses: the cancellation is placed before the fold effect it must name. Genuine RESTORE plus empty-cut copy -> RECORD_INVALID compensates naming both responses, applied w105, shown null, no cancellation; R1/R2 agree. Genuine Undo alone restores100.
NO TRAP exit (b) is executed: later baseline-ask work at95 offers adopt-baseline; yes sets/shows95 and supersedes the invalid group under both revisions. Dead Undo is refused with the hold's own code, field and both refs. B36 concerns that last clause's regression coverage.
Evidence: P/anchor-probes.jsonl EARLY_CUT_EXIT_B; submitted R17-DEAD-YES; P/new-diags.jsonl case09.

## 4. MISSED DEBUT HOLD AND ADOPT-BASELINE ANCHOR (N29-N31, B30)
Captured105/performed95 or100: no landing, held baseline ask, explicit adopt-baseline of actual equal loads; exact105 with a rep miss lands. Unequal exit work retains VECTOR_ADOPTION_UNDEFINED. Unknown lineage refuses field lift_lineage_id.
L9 B32 inputs now refuse RECORD_INVALID base_load: non-holding same-lift accept, set-op anchor, another Close, mixed valid Close plus invalid Ref, and numeric capture with its own Close but no accepted native entry/miss. Genuine missed exit still adopts95. Another-lift anchor is rejected even when this lift's conflict names it.
FC03 fills authority_refs; FC01 reads/echoes them. The fold verifies the miss against uncancelled/unlanded accepted earn records, not the current queue; later legacy PROPOSED history does not invalidate the genuine missed exit or its Undo. R17-ANCHOR-LEGACY-LATER passes.
Edited mismatch is completion/non-hold. An independently constructed skipped original also remains completion/non-hold. Original pending target remains in the projection in both cases.

## 5. NO SILENT INCREASE
No unmodified reachable guarded-local input in the executed scope showed, stored or adopted a newly higher load without yes; the direct-fold admission counterfeits in question2 remain D-L10-1. Fact save, check, decline and stale/forged-handle refusals retain consent boundaries in the host suite.
The lower-adoption L9 input restores the previous accepted image, as R9.8 explicitly rules; it is no longer a product blocker. It is not evidence of permission to exceed that image.
Retained L9 host input: accept35 on40, reopen37.5, accept RETIRE37.5, reopen40 -> working40, ready card40, zero issues, two responses. Its old R9.7 assertion expecting35 FAILS as superseded; submitted R17b-B31 PASS. The old B31 canary yields35 and passes that obsolete assertion, but current R7-B18a kills it (105 instead of required100).

## 6. MUTANTS
All nine L9 single-clause mutants are now killed by submitted behavioral rows. L9-M05 and M08 were mechanically re-anchored to the strengthened predicates; no assertion was weakened.
Ten additional mutants: eight killed by submitted behavioral rows; M02 and M09 survive all 142 deterministic behavioral rows, R7 default150 and R8 default100/expanded1000 seeds. Independent rows PASS original and FAIL separately on those mutants. Eight new mutants directly cover round-16/16b clauses; M01/M09 additionally cover the round-17 amendments.
Author inventory: 189 distinct edits (121 FC12, 31 property-labelled, 37 host), executed from a scratch manifest with in-memory overlays and positive callback lists. Final: 185 behavioral kills, 1 source-text-only failure, 3 behavioral survivors. P/author-qualified.json names every witness; the author's 187-behavioral claim is not reproduced.
R11-window-legacy-host is KILLED by submitted R17b-B33 and the retained L9 host probe: original old-factory Starts lack window_hi; after restart the current host refuses PLAN_CHANGED with zero responses, mutant offers [45,45]. L9 B33 is closed.
R7-comp-reprice-host and R16b-comp-some-host remain LIVE across all43 host callbacks. Sound CURRENT-host scope argument: responses can enter only through fresh exact-issuance comparison, and replay admission rejects tampering; generated cancellations reproduce their exact bodies at unchanged cuts. A changed cut bypasses that re-evaluation in BOTH versions. Duplicate genuine yeses do not supply a mismatching member. FC12 counterfeit rows kill both clauses. This does not prove future producer/import paths safe.
R12-decode-absent is equivalent over supported inputs: raw-wrapper equality still distinguishes absent/null; subsequent scalar/vector branches coalesce them, and nextLoad/loadRungs coalesce absent/null inc/steps. R16-registrar-source fails a source-text assertion, not a behavioral output. Neither is counted as a behavioral kill.
Driver correction: the initial deterministic manifest excluded seven rows whose descriptions mentioned property. All unresolved mutants were rerun against the complete142-row manifest. R7-P1-dependent, its -prop twin, and R13-exit-kind are killed by R7-P1: original105 with both holds, mutants110 with the child applied. No unresolved behavioral survivor was excused by the shorter manifest.

## 7. PROPERTY WALK
R8: 17000 seeds, 9100001..9117000, zero counterexamples. P/walk.jsonl.
Coverage: 716 baseline yes, 362 undo yes, 494 RESTORE yes, 171 missed-debut exit yes, 1821 same-base restore checks, 985 moved-base restore checks, 2253 spend-suffix checks (75 after a spend).
The R8 walk follows R9.8's applied-adoption prior-image rule. Its clean result does not cover every prior-vector presence shape or exact refusal-reference array, as B35/B36 demonstrate.
Separate R7 extended control: unmodified code FAILS I1 at seed20261085 (default seed20260923, zero-based offset162). Direct reconstruction: yes102.5 on prior97.5, yes RESTORE97.5, later unordered base102.5 ->97.5, cancelled=true, issues[]. This is consented RESTORE, but R7's accepted set contains only102.5. The same false alarm occurs with M02/M09 and is NOT a kill. No assertion was changed; R8 was run separately. D-L10-8 carries the oracle mismatch.

## 8. WHAT IS OWED
B35/B36 prevent acceptance. Named debts below remain separate from those blockers.
CI-only protected/transitive suites: m4/workout/test/{h3,s3..s9}-supersede-*, s3-companion-*, engine-history, h3-clean-init, engine-capture, native-next-targets-assembly; m4/spec/load-write* and workout-edit-model; m4/import/test/{engine-provider,production-mapping,production-admission,prepare,reading-replay,browser-parity,s3/harness}.
Also unrun/CI-only: m3/w6/test/{local-source-admission,local-source-commit,local-source-consumer,import-custody/engine-join,recovery-stage/source-import}; today/test/{adapter,catalogue,copy,package,setup,view,design}; package/build steps and private conformance/sensitivity. The author's broad80-file regression set was not rerun.
S11 successor/carriers, composed producer binding and green Windows/Linux CI at the final head remain owed. R2-REVISION passes locally, which is not a seal.
Owner-gated: proposed native-load copy and H11 product choice (option2 remains the implemented default); main merge, deployment, private import/history port and guard lowering each require their own authorization. None occurred here.

## BLOCKING
B35 - Regression gap, native-load.cjs:543. Single-clause L10-M02 changes the never-applied RESTORE loop from [w,wSets] to [w]. Genuine adoption100->105, genuine RESTORE100, later unordered base w102.5 with vector[102.5,100,97.5]: original restores w100 and removes wSets; mutant retains that vector, cancelled=true, and actual public engine-capture emits [102.5,100,97.5] instead of [100,100,100]. Submitted behavioral rows pass with this defect (142 deterministic, R7 default150, R8 expanded1000). The independent original row passes and mutant row fails. Preserve an absent-prior-vector restoration row through the capture boundary. P/capture-diags.jsonl, complete-det-L10-M02.json, extended-r8-L10-M02.json and independent-L10-M02.json.
B36 - Regression gap, native-load-effects.cjs:869. Single-clause L10-M09 replaces spoiled.refusal refs with []. The early-cut cancellation input yields RECORD_INVALID/compensates in both versions; original refs are [fx-resp-2,fx-resp-9], mutant refs are []. R9.8 DEAD YES requires the hold's own refs. Submitted behavioral rows pass with this changed result (142 deterministic, R7 default150, R8 expanded1000); the added exact-ref row passes original and fails mutant. This is a specified FC03 input, not a claimed host forgery path. P/capture-diags.jsonl, complete-det-L10-M09.json, extended-r8-L10-M09.json and independent-L10-M09.json.

## NAMED DEBTS
D-L10-1: FC09/FC10 remain unbuilt and native foreign admission stays shut; echoed frontier and re-digested absent/non-reproducible-cut bodies require verified issuance or complete historical proof plus a separate PM ruling before import or sync can open.
D-L10-2: N01 repaired-parent producer/card/legacy-writer equivalence and private conformance/sensitivity remain CI-only for an authorized custodian; this review does not certify them.
D-L10-3: S11 successor child, inherited pin carriers, composed producer revision binding, downstream build inventory and green Windows/Linux CI at the exact final head remain owed; no inherited assertion may be weakened.
D-L10-4: Physical phone pages in both themes, real process/power-loss recovery and physical two-device behavior remain unverified; fake-indexeddb restart and causal-fold fixtures are bounded substitutes.
D-L10-5: FC16 and native-load must ship in one seal; resuming an active pre-FC16 Start and mixed old/new producer binding remain owed despite the completed-old-Start restart witness.
D-L10-6: General unequal-vector adoption remains outside the supported recovery domain; H11 option2 and proposed native-load copy are not new owner approvals, and this review authorizes no deploy, private import/history port, main merge or guard lowering.
D-L10-7: R12-decode-absent is behavioral equivalence, not a byte-pin kill; strict-cancellation host survivors are justified only for the current guarded local provenance and producer rules and must be reconsidered when those rules change.
D-L10-8: R7 I1 omits consented Undo targets and falsely rejects original seed20261085; reconcile its oracle with R9.8 and rerun the extended control before using R7 failures as mutant sensitivity evidence.
D-L10-9: R16-registrar-source is killed only by a source-text assertion; retain the guarded-local provenance limitation and do not report that failure as behavioral sensitivity.

## Mutation table
K = behavioral kill; S = source-text assertion; L = behavioral survivor. Submitted counts exclude byte-pin-only failures. Complete per-edit inventory: P/author-qualified.json; all fixtures are synthetic.
| ID | Clause | Submitted result | Independent result |
|---|---|---|---|
| L9-M01 | RESTORE uses Undo base instead of adoption prior | K, R6-B15c | Prior preserved |
| L9-M02 | Exact target becomes missed | K, N05 | Qualified debut lands |
| L9-M03 | Edited mismatch becomes hold | K, R17-EDITED-DEBUT | L9 original probe passes |
| L9-M04 | Anchor every -> some | K, R17b-L9-M04 | Valid+invalid Ref rejected |
| L9-M05 | Remove anchor lift equality | K, R17b-L9-M05 | New holding check also rejects old orphan input |
| L9-M06 | Empty anchor list allowed | K, N29 replay/forgery | Empty anchors rejected |
| L9-M07 | Compare only Undo target | K, R17b-L9-M07 | Whole body required |
| L9-M08 | Consumed Close equality inverted | K, N29 | Genuine missed exit preserved |
| L9-M09 | Lose held-vector domain refusal | K, N30 | Domain refusal preserved |
| L10-M01 | Restore only load fields of APPLIED prior | K, R17-RETIRE-MEETS-APPLIED | Every prior field required |
| L10-M02 | Never-applied RESTORE omits wSets | L | K by new vector-presence row; B35 |
| L10-M03 | RESTORE target need not equal prior | K, R12-RESTORE | Forged150 refuses target_load |
| L10-M04 | Apply movedBase to compensate | K, R6-B15a | Genuine Undo retained |
| L10-M05 | Drop cancelled spends from frontier | K, R3-B3 | Tombstone retained |
| L10-M06 | Any original suffices for missed debut | K, R17-EDITED-DEBUT | New skipped-original control passes |
| L10-M07 | Cancelled queue entry remains unfinished | K, R3-B2 | Cancelled target retired |
| L10-M08 | Coalesced cancellation loses alternate refs | K, R16-CANON-SHAPES | All refs kept |
| L10-M09 | Dead-yes refusal drops hold refs | L | K by new exact-ref row; B36 |
| L10-M10 | Never-applied RETIRE also restores prior | K, R5-B12a | Mutant100 instead of102.5 |
| Author189 | Complete inventory | 185K, 1S, 3L | Classified above |
| R11-window-legacy-host | Admit completed pre-FC16 work after restart | K, R17b-B33 | L9 host probe also K |
| R7-comp-reprice-host | Compare only compensates | L | Current local-provenance argument above |
| R16b-comp-some-host | every -> some cancellation record | L | Same limited argument |
| R12-decode-absent | ABSENT decoded as null | L | Supported-input equivalence |
| R16-registrar-source | Omit admitted registrar source | S | No behavioral kill claimed |
| L9 B31 canary | APPLIED prior restore only for RESTORE shape | K, R7-B18a | Old expectation35 obsolete under R9.8 |

## What I did not verify
No whole Today step, whole engine test directory, protected five, protected legacy engine, private/soak/auth data, deployment, import, seal or remote CI was executed. Public helper reads were inspected before tests; fresh guarded loaders select public modules and callbacks and refuse unexpected reads/writes/children. Node processes are sequential.
No tracked file, ledger or status file was edited; no commit, push, fetch, checkout, reset, stash, clean, install or node_modules change; nothing was deleted. Only this new file was written in the worktree; probes and in-memory mutant overlays are under P.
Protocol disclosure: the initial required NEXT.md read emitted overbroad historical prose; it is excluded from this report and every fixture.
Reproduction: use the exact commissioned Node executable; set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York separately. P/harness.cjs run all-selection.json ->149PASS (145 submitted plus4 retained L9); new-custom-selection.json ->4PASS. P/host-run.mjs none suite ->43PASS. P/walk.cjs ->17000/0. Mutants are selected by L9_MUTATION=mutation-<ID>.json; P/engine-run.cjs det-complete-selection.json ->142PASS original; new-custom-selection.json distinguishes B35/B36. P/new-diags.cjs 02 or09 prints the counterexample outputs. Every Node process ran sequentially.
Seven checked public source hashes still match P/checked-hashes.json; HEAD is unchanged. No test or assertion was edited to turn a failure green. Scratch files are retained, not committed.
Final scoped status/stat outputs are recorded below.

```text
git status --porcelain -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today/today-entry.mjs rebuild/m4/workout/engine-capture.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L10.md
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L10.md
git diff --stat -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today/today-entry.mjs rebuild/m4/workout/engine-capture.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L10.md
```
Both commands exit0. Diff-stat stdout is empty (the review is untracked).
