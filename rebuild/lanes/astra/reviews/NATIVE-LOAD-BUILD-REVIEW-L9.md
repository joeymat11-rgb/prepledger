# Native Load Build Review L9
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM under DECISIONS:777-794; blind review, round 9; highest effort; engine tier
Head checked: e04b8e632233b9bbf2ab66976d31993219a34943
VERDICT: REJECT
Spec: R9.7 at 912c36c088da4b8e7c593f04b5bf51584e0310f4. Reviewed range: ab445c6..e04b8e6.
P = C:/Users/joeym/AppData/Local/Temp/earned-nls-L9-e04b8e6. All numbers and fixtures below are invented.
I formed the RETIRE counterexample from the spec, code and execution before consulting L1-L8 and the author's Round 16/16b report. The report's interpretation does not override R9.7.

## 1. RESTORE AND RETIRE BY RECORD SHAPE (B28)
RESTORE of an APPLIED adoption correctly uses auth.prior when its scalar/vector are the adoption's recorded base. Shape classification is independent of replay state. A RESTORE claiming an earned target instead of an adoption refuses RECORD_INVALID target_load; an adoption claiming baseline kind over numeric base refuses base_load. P/equality-shape-results.jsonl.
Submitted R16-B28 and the baseline variant pass: accepted RESTORE 105->100 replays as100 over an unordered102.5; accepted baseline RESTORE60->null replays asnull over45, under R1/R2. The compensate exemption from movedBase is correct.
B31: a genuine RETIRE does the opposite of its contract when the cancelled adoption applies on replay. Adopt100->105; unordered102.5 holds it; accept RETIRE base=target102.5. Return to base100: before cancellation w105; after cancellation w100, cancelled=true, no active issue. R1/R2 reproduce. R9.7 DERIVABLE says RETIRE writes NO w/wSets. P/probes.jsonl.

## 2. SPEND SUFFIX AND CANCELLATION EQUALITY (B29)
Submitted FC12: 135 PASS, 0 FAIL. Submitted host: 41 PASS, 0 FAIL. B29's cancelled-spend suffix is discriminating now: one new top after Undo is PROVISIONAL; two unspent tops offer the next weight. M14-spend-suffix and its property/host variants are killed.
No genuine cancellation wrongly refused by every/exact-body equality was found in restart, duplicate-accept, two-device causal-fold, mixed-shape cancellation, R1/R2 or the independent walk. This is bounded evidence, not a promise about arbitrary future producers.
Qualified premise P holds for the body calculation: sameCut covers exercise fields and queue; the governor changes only holdFlag, outside FIELDS; b.basis is echoed verbatim, including effect_frontier. The digests do NOT independently authenticate that frontier. Altering its response Ref to an absent op, re-digesting and retaining the cut hashes still yields w100, cancelled=true, issues[]. P/anchor-results.jsonl, FRONTIER_ECHO_COPY. This is the admission residual, not a demonstrated guarded-host bypass.
Executed counterfeit matrix: genuine RETIRE at102.5 -> w102.5/cancelled; reshape it to RESTORE100 at its reproducible present-revision cut -> RECORD_INVALID issuance, shown null, not cancelled. Same counterfeit under R2 -> w100/cancelled; changing only programme_sha256 to zeroes also applies100 under R1's non-reproducible-cut rule. S1-S8/DERIVABLE do not prove issuance. D-L9-1 carries this explicitly. P/equality-shape-results.jsonl.

## 3. EARLIEST-CUT PLACEMENT (R7-canon-cut, R16b-CANON-CUT)
Refusal is correct: the empty-cut copy places the cancellation before the fold effect it must name. The genuine RESTORE plus that copy yields RECORD_INVALID compensates naming BOTH records; applied w105, shown null, cancellation unapplied. R1/R2 agree. The genuine Undo alone restores100.
NO TRAP exit (b) was executed, not inferred: a later baseline-ask completion at95 offers adopt-baseline; yes sets/shows95 and supersedes the invalid-cancellation hold under both revisions. P/anchor-results.jsonl, EARLY_CUT_EXIT_B. R7-canon-cut is killed by its submitted row.

## 4. MISSED DEBUT HOLD AND ADOPT-BASELINE ANCHOR (N29-N31, B30)
N29-N31 pass: captured105/performed95 or100 holds the lift, hides the target, and offers the actual equal loads only for explicit baseline yes; exact105 with a rep miss lands. Unequal exit work preserves VECTOR_ADOPTION_UNDEFINED; an absent lineage names lift_lineage_id. FC03 fills authority_refs at native-load-effects.cjs:885; FC01 reads/echoes them.
Independent controls: a set-op anchor, a Close other than the consumed Close, another lift's proposal, and a valid Close plus an invalid Ref refuse RECORD_INVALID base_load, w100/shown null. Edited off-target debut yields DEBUT_BASIS_UNPROVEN completion, not a missed_target hold. P/anchor-results.jsonl; P/mutation-diags.jsonl.
B32: R9.7's stronger structural proof is absent. Replacing the genuine missed Close anchor with the same lift's NON-HOLDING earn accept still adopts95 and supersedes the miss. A numeric capture100/performance95 with NO native entry or missed debut, recorded null base and its own Close Ref also adopts95 under R2. Expected: RECORD_INVALID base_load, no adoption. These are executed inputs to FC03's specified structural boundary; no local-host forgery admission is claimed. P/anchor-probes.cjs.

## 5. NO SILENT INCREASE
B31 has a real guarded-host/restart witness with two genuine response records. Train35 on the40 card and explicitly adopt35. Reopen with unordered base37.5, then explicitly accept the displayed RETIRE37.5. Reopen at original base40: projection w40, issues[], ready card '40 lb \u00d7 12 reps'. No yes to restore40 occurred. Required no-write RETIRE leaves the replayed adoption35. P/host-custom.js and host-own-original.jsonl.
Causal isolation: a scratch-only single-clause guard, `if (restore)` around the applied-adoption prior-image write, makes that same host row PASS: w35, issues[], ready card35. It makes submitted R7-B18a FAIL (105 !==100), proving that row pins the behavior R9.7 prohibits. No product fix or test expectation was written. P/b31-canary-host.jsonl; P/b31-canary-submitted.json.
No other reachable unconsented increase was found in the executed scope.

## 6. MUTANTS
All 177 author entries were exercised using fresh scratch-only loader overlays and positive callback selections. Result: 172 behavioral kills, 1 source-text assertion kill, 4 behavioral survivors. Byte-pin failures are excluded. Exact replacements/results: P/author-mutants.json, P/author-classified.json and P/result-*.json.
The author's PROPERTY target actually includes the full FC12 file. Property-only runs used R7=3000/R8=1000; R16-restore-shape-prop survived those walks but was killed by the included deterministic R6-B15c row. This is not a property-walk kill.
R11-window-legacy-host: LIVE in all41 submitted host rows; B33 below supplies a reachable distinguishing restart. R7-comp-reprice-host and R16b-comp-some-host: LIVE in all41, with a sound current-scope explanation: owned handles plus full sameIssued admit genuine bodies only; durable rewriting refuses LOCAL_HISTORY_IDENTITY_UNPROVEN; present-revision genuine bodies reproduce by qualified P; absent revisions bypass this comparison. Their FC12 mutations are killed. The argument ends when admission/producers change (D-L9-1, D-L9-7).
R12-decode-absent: behavioral LIVE, not a kill. Raw wrapper equality already preserves absent versus present-null; both decode to no numeric baseline, non-array wSets, no ladder and no increment in the supported readers. Equivalent in this domain; its byte pin is not a behavioral witness.
Nine independent single-clause mutants: five killed by submitted rows; four survived the submitted 133 deterministic rows plus both default100-seed walks. Four added distinguishing rows PASS on original bytes and each FAIL on its mutant. B34 and the table give the inputs/outputs. P/own-mutants.json, own-classified.json, engine-custom.cjs, custom-baseline.json and mutation-diags.jsonl.

## 7. PROPERTY WALK
R8: 17000 seeds, 7300001..7317000, zero counterexamples. Coverage includes 710 baseline yes, 329 undo yes, 478 restore yes, 176 missed-debut exit yes, 1594 same-base restore checks, 973 moved-base restore checks and 2146 spend-suffix probes. P/walk.jsonl.
The oracle at native-load-options.test.cjs:2584-2605 expects an applied adoption's cancelled weight to disappear even for RETIRE. Its clean result cannot discharge B31. The independent host and fold counterexamples do not use that expectation.

## 8. WHAT IS OWED
B31-B34 prevent acceptance of this head. Carry D-L9-1 through D-L9-7 verbatim; they are separate from the blockers.
CI-only protected/transitive suites remain unrun: m4/workout/test/{h3,s3..s9}-supersede-*, s3-companion-*, engine-history, h3-clean-init, engine-capture, native-next-targets-assembly; m4/spec/load-write* and workout-edit-model; m4/import/test/{engine-provider,production-mapping,production-admission,prepare,reading-replay,browser-parity,s3/harness}.
Also unrun/CI-only: m3/w6/test/{local-source-admission,local-source-commit,local-source-consumer,import-custody/engine-join,recovery-stage/source-import}; today/test/{adapter,catalogue,copy,package,setup,view,design}; package/build steps and private conformance/sensitivity. This carries the declared inventory, not a claim to have executed it. I did not run the author's broad80-file regression set.
S11 successor/carriers, producer revision binding and green Windows/Linux CI at the final head remain owed. Owner-gated: proposed NATIVE_LOAD_PROPOSED_COPY and H11 product choice (option2 is implemented as the default); any main merge, deployment, private import/history port or guard lowering requires its own authorization. No such action occurred here.

## BLOCKING
B31 - Wrong reconstructed and shown load, native-load.cjs:551. The applied-adoption branch unconditionally copies auth.prior, ignoring the computed restore flag. Genuine RETIRE changes105->100; the lower-adoption host witness changes35->40 without that yes. Enforce the record-shape invariant; reconcile the contradictory B18/property expectations with R9.7. Inputs and red/green scratch outputs are in sections1/5.
B32 - Changed result outside explicit R9.7 S8, native-load-effects.cjs:408-411. A consumed Close is accepted without proving a selected-entry miss; any same-lift proposal response passes without being classified as holding at that cut. Both independent fabricated boundary inputs adopt95 instead of refusing base_load. The general admission residual does not implement these expressly required checks; current host admission remains closed.
B33 - Reachable LIVE host mutant. Produce two old-format Starts through the public capture factory with only FC16's additive window_hi omitted, save/close, then reopen the current host. Original: PLAN_CHANGED/no offer; R11-window-legacy-host: offer[45,45]; zero responses. The independent callback passes original and fails mutant. No log rewriting/import. Current fixtures using FC16 do not make historical local Starts unreachable. P/legacy-host-mutant-result.jsonl and host-custom.js.
B34 - Submitted regression gaps for four round16/16b clauses. L9-M03: captured105/performed95 with an authenticated rep correction changes completion/non-hold to missed_target/held (held-projection w100->null). L9-M04: valid Close plus bad set Ref changes base_load refusal to adopted95. L9-M05: other-lift proposal anchor does the same. L9-M07: altering only Undo base_load.fields.last to[1,2,3] changes issuance refusal/no cancellation to no issue/cancelled. All survive submitted behavior rows; added independent rows distinguish all four. These FC03 boundary cases are not unreachable under their specified contract, although the forged cases are not admitted by the current host. Preserve corresponding discriminating rows in the authorized test lane.

## NAMED DEBTS
D-L9-1: FC09/FC10 remain unbuilt and native foreign admission stays shut; echoed frontier and re-digested absent/non-reproducible-cut bodies require verified issuance or complete historical proof plus a separate PM ruling before import or sync can open.
D-L9-2: N01 repaired-parent producer/card/legacy-writer equivalence and private conformance/sensitivity remain CI-only for an authorized custodian; this review does not certify them.
D-L9-3: S11 successor child, all inherited pin carriers, producer revision binding, downstream build inventory and green Windows/Linux CI at the exact final head remain owed; no inherited assertion may be weakened.
D-L9-4: Physical phone pages in both themes, real process/power-loss recovery and physical two-device behavior remain unverified; fake-indexeddb restart and causal-fold fixtures are bounded substitutes.
D-L9-5: FC16 and native-load must ship in one seal; resuming an active pre-FC16 Start and mixed old/new producer binding remain owed despite the completed-old-Start restart witness here.
D-L9-6: General unequal-vector adoption remains outside the supported recovery domain; H11 option2 and proposed native-load copy are not new owner approvals, and no deploy, private import/history port, main merge or guard lowering is authorized by this review.
D-L9-7: R12-decode-absent is behavioral equivalence, not a byte-pin kill; the two strict-cancellation host survivors are justified only for the current guarded local provenance and producer rules and must be reconsidered when those rules change.

## Mutation table
K = behavioral kill; S = source-text assertion only; L = behavioral survivor. Full author-ID inventory is P/author-classified.json. No failure from a harness setup error is counted.
| Set/ID | Clause | Submitted result | Independent measurement/judgment |
|---|---|---|---|
| Author FC12, 113 | Exact supplied replacements | 112 K, 1 L | L is R12-decode-absent; supported-domain equivalence |
| Author PROPERTY, 27 | Exact supplied replacements | 27 K across full FC12 scope | R16-restore-shape requires deterministic R6-B15c at these walk seeds |
| Author host, 37 | Exact supplied replacements | 33 K, 1 S, 3 L | S is R16-registrar-source, textual source-argument assertion |
| R11-window-legacy-host | Allow legacy-window earn | L, 41/41 pass | K by historical restart; B33 |
| R7-comp-reprice-host | Exact body -> same compensates | L, 41/41 pass | Current guarded provenance makes differing bodies unreachable |
| R16b-comp-some-host | Every record -> some record | L, 41/41 pass | Same bounded provenance argument; D-L9-7 |
| L9-M01 | RESTORE uses Undo base instead of adoption prior | K | R6-B15c: lost consented100 over102.5 |
| L9-M02 | Exact target classified as missed | K | N05: qualified105 debut fails to land |
| L9-M03 | Remove edit-free condition from missed predicate | L | K by independent edited-mismatch row; B34 |
| L9-M04 | Anchor every -> some | L | K: valid Close cannot mask invalid set Ref; B34 |
| L9-M05 | Remove anchor lift equality | L | K: another lift's proposal cannot anchor95; B34 |
| L9-M06 | Permit empty anchor list | K | N29 replay/forgery: empty refs must refuse base_load |
| L9-M07 | Undo equality compares only target_load | L | K: forged prior-field body must refuse issuance; B34 |
| L9-M08 | Consumed Close equality -> inequality | K | N29: genuine missed-debut exit lost |
| L9-M09 | Remove held-vector refusal pass-through | K | N30: domain refusal replaced by hold code |

## What I did not verify
No full Today step, whole engine directory, protected five, protected legacy engines, private/soak/auth data, deployment, import, seal or remote CI was read/executed. No shared product/test file, ledger or status file was edited; no commit, push, fetch, checkout, reset, stash, clean, install or node_modules change. No scratch was deleted.
Public transitive helper reads were inspected before execution. Fresh loaders positively select files/callbacks, deny the protected five and unexpected access/children; Node processes were sequential. Node: C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe. Each test command set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York on separate lines.
Retained reproduction: P/harness.cjs run all-selection.json; P/host-run.mjs none suite; P/anchor-probes.cjs; P/equality-shape-probes.cjs; P/host-run.mjs none own; P/walk.cjs. Mutants use P/engine-run.cjs with L9_MUTATION or the host runner's mutation JSON argument. Scratch setup/aggregation corrections were excluded from verdicts; assertions were not weakened. Only this new review file was written in the worktree.
Final scoped commands/output (diff-stat is empty):
```text
git status --porcelain -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today/today-entry.mjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L9.md
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L9.md
git diff --stat -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today/today-entry.mjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L9.md
(no output)
```
