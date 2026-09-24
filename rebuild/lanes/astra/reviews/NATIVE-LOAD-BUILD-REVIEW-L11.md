# NATIVE-LOAD-BUILD-REVIEW-L11
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM under DECISIONS:777-794; blind review, round 11; highest effort; engine tier
Head checked: dfc444522be98e770b083811fafc6b74e5fd1196
VERDICT: REJECT
Range: c0695e037322c5b9c850b017d8a03842b5ad58b9..dfc444522be98e770b083811fafc6b74e5fd1196.
Spec: R9.9 at 679567a; file SHA256 ef0f5dd8bc19fa98be6f1a64a70ba98a71d2fe5b6b4f4ccadfe4e61ae3a13e52. DECISIONS:795-802 supersede the older shape and missed-hold readings.
Method: spec/code first, then prior reviews, author report last. Every fixture value is invented. No protected engine or private fixture used.
P = C:/Users/joeym/AppData/Local/Temp/earned-nls-L11-dfc4445. Scratch retained. Only this new review file is written in the worktree.
Node = C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe. Tests used MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York, one Node process at a time.

## 1. Restore and retire by record shape (B28)
PASS: R16-B28, R16-CANON-SHAPES, R17-RETIRE-MEETS-APPLIED, R17b-B31 and R17c-B35, under R1/R2 and the rows' delivery orders.
An APPLIED adoption's Undo restores every auth.prior field under either shape. A never-applied RESTORE writes recorded w/wSets; a never-applied RETIRE writes neither. This is R9.9 and :795, which corrects :792.
Measured: RESTORE over unordered 102.5 returns 100; RETIRE over that base keeps 102.5; RETIRE meeting an APPLIED adoption restores its prior 100. Shape is determined by base/target scalar AND vector equality.
B35 now verifies an absent prior wSets through the actual capture adapter: moved [102.5,100,97.5] becomes [100,100,100], with wSets absent. L10-M02 fails specifically there.
Independent SHAPE_VS_CLAIM: a RESTORE body whose explanation claims retire still restores 100 under R2 at both bases; changing its kind/reason_key to adopt-observed refuses RECORD_INVALID spend_id, with no cancellation. P/shape.cjs.txt.

## 2. Spend suffix, cancellation equality and premise P (B29)
PASS: R16-B29 and its durable-host row. After earn yes + Undo, C3 alone is PROVISIONAL; C4 consumes exactly C3/C4. Cancelled spends never refund C1/C2.
PASS controls: R16b-COMP-REPRICE and R16b-COMP-EVERY reject the changed body at a reproducible present-revision cut; genuine single and duplicate/canonical-shape records retain their cancellation.
BLOCKING B37: a genuinely issued Undo across a set-count edit is refused target_load, including through durable respond and reopen. BLOCKING B38: a later evidence correction invalidates an already accepted cancellation. Neither failure is caused by the new every-record equality alone; both also occur under absent revision R2.
P is false literally: sameCut hashes programme/queue and fact coverage, not effect_frontier. Independent FRONTIER_ECHO_COPY replaces its response_refs with an absent invented Ref and re-digests the genuine Undo: the fold still cancels it and restores 100, with no issue.
The narrower determinism argument holds for these controls: replay passes the recorded basis back unchanged; exercises/queue determine the load image, and the governor changes only holdFlag. An echoed field is not independently authenticated merely because equality reproduces it. See D-L10-1.
N29-DEVICE also measures the explicitly specified R9.9 two-Close boundary: a second device's genuine 95 claim survives an earlier miss, but an earlier landing makes it RECORD_INVALID base_load. This is a named spec limitation, not evidence that every genuine record is preserved.

## 3. Earliest-cut placement and NO TRAP
PASS: genuine Undo alone restores 100. Add its re-digested empty-cut copy and the cancellation group precedes the adoption: RECORD_INVALID compensates, refs [fx-resp-2,fx-resp-9], adoption 105 held.
R17-DEAD-YES and R17c-B36 measure the required refusal of another Undo with exactly the holding code/field/refs. L10-M09 fails specifically at B36.
A later baseline-ask completion and explicit baseline yes restore 100 and supersede the early-cut hold. Exit (b) works for this input; accepting the early-cut copy would invent a target spend before it exists.
The independent exit-Undo/base-return input B39 exposes a different capture trap; the early-cut controls do not cover it.

## 4. Missed debut and the adoption anchor (N29-N31, B30)
PASS: the guarded FC12 control is 164/164 and FA03 control is 43/43. N29-N31, R17-ANCHOR-STRUCTURAL and L9-M04/M05 execute the wrong Close, Start, other lift, non-holding response and mixed valid/invalid Ref cases: RECORD_INVALID base_load.
R9.9 replaces the old missed-debut hold: selected scalar entries are consumed at 2, 3 or 4 slots, including all skipped; a miss writes no weight and raises no hold. Rep misses at the exact target land. A skipped slot prevents adoption; unequal actual loads refuse VECTOR_ADOPTION_UNDEFINED.
A higher actual load, 110, offers adopt-observed but leaves working 100 until yes. The claim is filled on FC03's check path; mark without claim fails PLAN_CHANGED, and a claim without the fold's structural witness fails base_load on replay.
N29-LAYOUT-MISS compares the recorded earn's base projected over captured slots; an old-count vector is refused. FLIP-YES retains a corrected Close's genuine claim without calling it forged. Vector/count mismatch remains the expressly retained D-VECTOR-SETS boundary.

## 5. No silent increase
No new reachable unconsented increase was found in the executed FC12/FA03 controls, independent probes or completed walk. Offer/no-answer, repeat check, duplicate yes, restart, higher actual loads and missed targets are exercised.
A compensation can restore the preceding accepted weight above a later lower adoption; :795 requires that prior image and an explicit Undo yes. It is not authority to invent a higher prior.
B37/B38 lose consented cancellation behavior. B39 returns an inconsistent card and refuses its capture. These failures prevent acceptance even without a silent increase.

## 6. Mutants
Independent overlays L11-M01..M10: 10/10 behavioral assertion failures. Both L10 witnesses are now killed by the submitted B35/B36 rows. No row was weakened, skipped to obtain green, or changed on disk.
Submitted inventory: 221/221 executed from copied overlays: FC12 145 K / 1 equivalent; FA03 28 K / 2 host survivors; PROPERTY 30 K / 15 walk survivors. Total 203 K / 18 surviving configurations, matching the reported totals. P/author-results.json retains every ID and first failing callback; P/property-twins.json verifies every property edit has an identical FC12 twin.
The 15 property survivors all have killed FC12 twins; no equivalence is claimed for them. Runs stop at the first failure; survivors complete both seed bounds. R8 was tried first in later runs to avoid unnecessary work after a kill. No loader, filesystem-guard or mutation-placement error is counted as a kill. Two deterministic kills, R11-S4-pairs and R11-held-order, produce TypeErrors after deleting necessary checks/state; the other 201 are assertion failures.
R11-window-legacy-host is killed by R17b-B33 after pre-FC16 Starts and reopen. The old claim that the host can never see an old capture is false.
R7-comp-reprice-host and R16b-comp-some-host have a sound, bounded non-reachability argument: current guarded admission refuses rewritten records, respond requires sameIssued with a fresh offer, and reproducible genuine compensation bodies are deterministic under the recorded request. Absent revisions bypass both mutant clauses equally. This does not justify foreign admission or future producer changes.

## 7. Property walk and L10 recheck
R8: seed0 11300001, 17000/17000 completed, one counterexample at 11301954; P/walk.json. Successful walks include 427 missed consumptions, 139 missed adoption yeses, 113 changed-count misses, 29 changed-count landings, 7991 reopen and 9378 duplicate actions.
The failed trace returns adopt-baseline where I14 expects adopt-observed. Its last generated Start is not producible: the prefix already has w null plus pending Q105 and the actual capture refuses ENGINE_CAPTURE_BASELINE_UNPROVEN. That prefix is B39; the later failure is the walk's capture-model gap, not a valid missed-Close product witness.
R7 seeds 20261085, 20265787 and 20270133 all pass independently: consented Undo targets, restoration-aware freshness and ascending device-B sequence resolve the L10 cases. No descending-sequence oracle was used to claim mutant kills.
The mutation control with exactly the R7/R8 callbacks, R7 3000 seeds from 20260923 and R8 1000 from 20261001, passes 2/2. Property mutants use the identical positive callback selection and seeds.

## 8. What is owed
No CI gate, whole Today step, conformance gate or engine directory was run. Author claims of 1135 tests / 67 inherited failures are not my executed evidence.
CI-only: any direct/transitive load of seed.cjs, migrate.cjs, merge.cjs, index.cjs or oracle-shim.cjs. Named consumers include workout engine-history, h3-clean-init, engine-capture, native-next-targets-assembly, h3/s3-s9 supersede and s3-companion suites; m4/spec load-write and workout-edit-model; import engine-provider/production-mapping/production-admission/prepare/reading-replay/browser-parity/s3 harness; w6 local-source/import-custody/recovery source suites; Today adapter/catalogue/copy/package/setup/view/design; S8 package/build tests.
Exact-head Windows/Linux CI, successor pins, the composed seal and phone pages in both themes remain owed. The missed-Close explanation is proposed copy. :798's five approved Undo/adoption strings do not approve new text.
The current R9.9 vector/count refusal is measured, not fixed; :802 retains it here and :803 authorizes later R9.10 work. This review authorizes no deploy, import, history port, main merge or guard lowering.

## BLOCKING
B37 - Genuine Undo refused after set-count change (author D-R18-SETS-RESTORE; FC01 compensation ~383 and DERIVABLE ~477).
Input: synthetic working 100, adopt 105, sets 3 -> 2, accept the issued Undo [100,100]. Output in both R1/R2: RECORD_INVALID target_load, raw w 105 retained, held projection null. The recorded prior vector is [100,100,100]. P/probes.jsonl.
Durable host input: adopt 45 over 40, sets 2 -> 1, respond yes to [40]. Acknowledgement true and two responses stored; projection and cold reopen both refuse target_load and show null. P/host-custom.js and P/host-probes.txt.
Invariant: an issued, still-eligible cancellation must apply. Issuer and DERIVABLE disagree on vector count. Being pre-existing or outside the author's edit grant does not make this reachable genuine-record refusal acceptable.
B38 - A later correction erases an accepted cancellation's fold spend/tombstone (author D-R9.9-LATER-HOLD-UNDO; FC03 refusedAccept and HELD_BACK).
Input: Q105 missed at 95; adopt 95 yes; Undo yes; correct an earlier Q-consumed completion. Before: w 100, Q MISSED, adoption cancelled, cancellation retained. After R1/R2: Q pending/held, adoption TARGET_QUEUED and absent from spent, Undo RECORD_INVALID compensates. Exit (b) recovers only after another completion and yes. P/probes.jsonl.
Durable host: Q45 missed at 35, adoption yes and Undo yes, then remove a consumed C1 set. All three responses stay stored; RECORD_INVALID compensates holds the lift before and after reopen. P/host-probes.txt.
Invariant: a permanent cancellation must not become a dead recorded yes because its cancelled effect is later held. J LATER HOLD specifies the adoption refusal but does not settle the already accepted Undo; the walk now exempts this case. PM resolution is required, not an unrecorded reviewer change to the spec.
B39 - Exit Undo followed by an original-base return makes the next workout uncapturable (new, seed 11301954).
Input: accept Q105; unordered base 97.5; complete baseline-ask 60; accept exit (b); accept its Undo; restore base 100. Output: w null, Q105 pending, no issue; the actual card reports w 105, baselineAsk true, isDebutNow true; the capture adapter refuses ENGINE_CAPTURE_BASELINE_UNPROVEN. P/diag-output.txt and P/before-c4.json.
Durable host reduction: Q45 accepted, base 42.5, baseline-ask 60 and exit yes, Undo yes, reopen at base 40. Three responses retained; w null, Q45 pending, no issue; next gym.read returns phase blocked, ENGINE_CAPTURE_BASELINE_UNPROVEN (WORKOUT_PREPARATION_INVALID). P/host-trap.txt. Direct-fold escape checks return TARGET_QUEUED for Check and COMPENSATION_DESCENDANTS for Undo of Q; another completion cannot be captured.
Invariant: the NO TRAP exits must leave a usable next capture. A pending entry cannot coexist with a baseline-ask card carrying a numeric w. The walk's direct cardOf simulation hid this earlier failure.

## NAMED DEBTS
D-L10-1: FC09/FC10 remain unbuilt and native foreign admission stays shut; echoed frontier and re-digested absent/non-reproducible-cut bodies require verified issuance or complete historical proof plus a separate PM ruling before import or sync can open.
D-L10-2: N01 repaired-parent producer/card/legacy-writer equivalence and private conformance/sensitivity remain CI-only for an authorized custodian; this review does not certify them.
D-L10-3: S11 successor child, inherited pin carriers, composed producer revision binding, downstream build inventory and green Windows/Linux CI at the exact final head remain owed; no inherited assertion may be weakened.
D-L10-4: Physical phone pages in both themes, real process/power-loss recovery and physical two-device behavior remain unverified; fake-indexeddb restart and causal-fold fixtures are bounded substitutes.
D-L10-5: FC16 and native-load must ship in one seal; resuming an active pre-FC16 Start and mixed old/new producer binding remain owed despite the completed-old-Start restart witness.
D-L10-7: R12-decode-absent is behavioral equivalence, not a byte-pin kill; strict-cancellation host survivors are justified only for the current guarded local provenance and producer rules and must be reconsidered when those rules change.
D-L10-9: R16-registrar-source is killed only by a source-text assertion; retain the guarded-local provenance limitation and do not report that failure as behavioral sensitivity.
D-L11-COPY: H11 option 1 is approved; its new missed-Close explanation remains proposed copy, and unequal-vector adoption remains outside this recovery domain.
D-L11-VECTOR: D-VECTOR-SETS retains whole-day ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED for unequal vectors at changed counts in R9.9; DECISIONS:803 assigns the later R9.10 work.
D-L11-TWO-CLOSE: R9.9 J SECOND DEVICE expressly permits a genuine missed-adoption record to become RECORD_INVALID base_load when an earlier-delivered Close landed the entry; physical sync/admission remains unverified and shut.
D-L11-MUTANTS: Fifteen fixed-bound property variants survive while identical FC12 edits are killed; do not claim the walks cover those clauses.
D-L11-TYPED-HOLD: R9.9 K OUTSIDE (2) names a typed numeric-capture versus host-v1 exit mismatch; that boundary was not independently executed here and still needs PM resolution.
D-L11-REPRESENTATION: R9.9 K OUTSIDE (1) retains w-only equal-load adoption despite w/wSets wording; the scalar card is unchanged, and the wording needs PM clarification.
D-L11-WALK: R8 cardOf can invent a numeric capture when the actual adapter refuses it; preserve seed 11301954 and test the capture boundary before judging its later I14 offer assertion.

## Mutation table
K = observable behavior/assertion failure, L = surviving variant, E = equivalent supported behavior. Source-byte pins are excluded from mutation kills. Per-edit inputs and outputs remain in P.
| ID / group | Changed clause | Measured result |
|---|---|---|
| L11-M01 | Missed marker names Start instead of Close | K, N29-R9.9 |
| L11-M02 | Missed effect loses close_ref | K, N29-R9.9 |
| L11-M03 | Miss writes last | K, N29-R9.9 |
| L11-M04 | Missed typed capture compared with current plan | K, N29-R9.9 |
| L11-M05 | FC03 claim has wrong commitment | K, N29-R9.9 |
| L11-M06 | Anchor base projects one fewer captured slot | K, N29-UNDO-LOWER |
| L11-M07 | Missed Close can reach earn | K, N29-R9.9 |
| L11-M08 | Miss writes spend.close_ref | K, N29-R9.9 |
| L11-M09 | Miss leaves entry unfinished | K, N29-R9.9 |
| L11-M10 | First matching earn anchors instead of last | K, N29-CLAIM |
| L10-M02 | Never-applied RESTORE omits wSets | K, R17c-B35 |
| L10-M09 | Dead Undo drops hold refs | K, R17c-B36 |
| Submitted FC12, 146 | Public fold/native clauses | 145 K, 1 E |
| Submitted FA03, 30 | Durable-host clauses | 28 K, 2 L with bounded argument above |
| Submitted PROPERTY, 45 | R7 3000 / R8 1000 seed bounds | 30 K, 15 L; identical FC12 twins K |
| R11-window-legacy-host | Admit old capture as fresh earning work | K, R17b-B33 |
| R7-comp-reprice-host | Compare compensated identity instead of whole body | L on guarded host; FC12 twin K |
| R16b-comp-some-host | Every cancellation member -> some | L on guarded host; FC12 twin K |
| R12-decode-absent | Decode ABSENT as null | E: wrapper equality stays; noW and wSets branches treat both alike; nextLoad treats missing/null inc/steps alike |
| R7-P1-dependent-prop | Same edit as R7-P1-dependent | L in walk; K by R7-P1 |
| R9-gate-coverage-prop | Same edit as R9-gate-coverage | L in walk; K by R9-B24c |
| R11-S-skip-prop | Same edit as R11-S-skip | L in walk; K by N25 |
| R13-active-superseded-prop | Same edit as R13-active-superseded | L in walk; K by N27 |
| R15-legacy-pending-prop | Same edit as R15-legacy-pending | L in walk; K by R15-LEGACY-ON-HELD |
| R16-restore-shape-prop | Same edit as R16-restore-shape | L in walk; K by R6-B15c |
| R16-scope-prop | Same edit as R16-scope | L in walk; K by N30 |
| R17-anchor-holding-prop | Same edit as R17-anchor-holding | L in walk; K by R17-ANCHOR-STRUCTURAL |
| R17-dead-yes-prop | Same edit as R17-dead-yes | L in walk; K by R17-DEAD-YES |
| M18-miss-closeref-prop | Same edit as M18-miss-closeref | L in walk; K by N29-R9.9 |
| M18-anchor-a2-prop | Same edit as M18-anchor-a2 | L in walk; K by N29-FLIP-YES |
| M18-infer-claim-prop | Same edit as M18-infer-claim | L in walk; K by N29 |
| M18-requeue-prop | Same edit as M18-requeue | L in walk; K by N29-R9.9 |
| M18-L-captured-after-prop | Same edit as M18-L-captured-after | L in walk; K by N29-LAYOUT-UNDO |
| M18-L-anchor-count-prop | Same edit as M18-L-anchor-count | L in walk; K by N29-LAYOUT-MISS |

## What I did not verify
No protected module, private source, protected soak, live athlete data, real device, external import/sync or CI gate was executed. No production, test, pin, ledger or status file was edited. No commit, push, checkout, reset, stash, clean, fetch, install or scratch deletion was performed.
Host plan changes use the documented engineState basis argument; the plan mutation producer admits sets-only changes, but no plan-editor UI interaction is claimed.
The test loaders positively select callbacks, allow the inspected public module graph, refuse unexpected module/filesystem access and child processes, and keep output in P. The 11 unchanged ESM mutants excluded from the author's current inventory were not rerun here; their historical source-only claim is not upgraded.
The generic historical NEXT read was unnecessarily broad; it was not used as fixture data, quoted into this report, or treated as current authority.
Final checks, explicit scope: FC01, FC03, FC12, FA03, the author report, L10 and this L11 file.
```text
git status --porcelain -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L10.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L11.md
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L11.md
git diff --stat -- rebuild/engine/native-load.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L10.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L11.md
```
The diff --stat output is empty.
