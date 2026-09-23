# NATIVE-LOAD-SPEC R9.1 Review L2
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; paper, engine tier; round 2
VERDICT: REJECT

B-R9-2, B-R9-3 and the original B-R9-4 counterexample are resolved at the paper boundary. The numeric B-R9-1 control is fixed, but the common correspondence clause still rejects baseline records. NO TRAP introduces a second contradiction with the descendant guard.

## Scope and evidence

- Reviewed earned-astra-96/rebuild/coach/NATIVE-LOAD-SPEC.md, SHA256 df90e70f0752491cd8a59334c71ef6340bb7300fcd3ffbbfb489258dc4e8d9c8; unchanged on recheck. Spec citations below refer to R9.1.
- Read own R9 L1 and build L7 reports, plus origin/rebuild/t2-client-core DECISIONS:784,785,793 through the explicit file path. No other reviewer's report was read.
- Requested git -C earned-astra-96 diff failed because that worktree's Git metadata was inaccessible here. Obtained the explicit-path b849508-to-working-file diff using this worktree's Git metadata and --work-tree pointing to earned-astra-96. No checkout or index change was requested.
- E = rebuild/engine; W = rebuild/m4/workout; L = rebuild/m3/w6/local. Durable record/compensation/host excerpts were read at 0e4fc74 through explicit Git file paths. Public readers/capture were read in earned-astra-96.
- Three bounded probe runs completed: unchanged progression/earn plus literal paper predicates; old/new capture readers with only FC16 substituted in memory; below-window fabrication. All quantities below are invented. Compensation and admission conclusions are paper traces, not executed product transitions or host admission tests.

## Findings with evidence

### B-R9-1 remains incomplete: correspondence rejects a genuine baseline

Invariant: DERIVABLE must admit the existing v1 shape of a genuine baseline choice (spec:110-111,156,260,294,310).
Input: N10's adopt-baseline 60 has load_basis.w={present:true,value:null}, base_load.scalar=null, vector=[null,null,null], and fields.w={present:true,value:null}. An absent w has a distinct, valid FieldImage. E/native-load.cjs:115,122-128 and W/native-load-effects.cjs:218,232-233 at0e4fc74 produce these representations.
Counterexample: :156 makes correspondence common to EVERY accept before branching on kind, but requires base_load.scalar.value with unit lb. A null scalar has neither. The independent literal-rule probe rejects both null and absent baselines at base_load.scalar. N26 exempts adoption from WINDOW BINDING only; that does not satisfy DERIVABLE. This rejects an in-scope local issuance, with either present or absent producer revision.
Additional representation boundary: numeric w100/inc5 with wSets={present:true,value:null} in both records. E/native-load.cjs:109 repeats scalar100 for non-array wSets; unchanged nextLoad returns105. :156 instead requires vector values equal dec(wSets) "when present", namely null, while its candidate translation correctly tests whether the value is an ARRAY. The literal rule rejects at base_load.vector. Local-host reach of this second shape was not measured; the contract must support it consistently or prohibit it explicitly at issuance.
Required amendment: branch correspondence by kind/Load type; preserve absent/null FieldImages and explicitly project a null baseline. For a supported non-array wSets, repeat scalar while retaining presence equality. Add genuine null/absent baseline, numeric and vector controls under R1/R2, including baseline restoration. Do not reshape v1 records.

### B-R9-5: NO TRAP promises an Undo forbidden by the descendant guard

Invariant: recovery must remain reachable without undoing a choice after descendant training (spec:154,156,158,161,208).
Input: genuine Q105 is accepted and a later qualified workout lands it; an ordinary correction to its accepted basis then causes BASIS_REPAIR_REQUIRED. The later Start and Close remain authentic. This is an in-scope edit.
Counterexample: :158 requires BOTH exits and compensation for EACH genuine accepted spend of every held lift. :154/:156/:208 require COMPENSATION_DESCENDANTS for this same spend. Dispatching compensation first cannot change eligibility. The constructed paper trace has undoRequired=true and undoAllowed=false. An authenticated new plan is the valid remaining exit.
Required amendment: offer Undo only for eligible spends; guarantee a usable owning-plan exit when descendants bar Undo, specify the panel outcome and add this case to N27. Keep the descendant guard. Also make the RETIRE/RESTORE classification explicit when an applied adoption is later disputed, so "held" alone cannot change an applied adoption into an unapplied effect.

## Round-1 counterexamples rerun

| Finding | Independent result against R9.1 |
| --- | --- |
| B-R9-1 original numeric wrappers | Unchanged nextLoad on wrappers returns null; decoded {w:100,inc:5} returns105. Absent steps stays absent; explicit null stays present. Established [100,95] translates to [105,100]. Original numeric example fixed; baseline gap above remains. |
| B-R9-2 hot opener | With ladder[100,105,110], prior sighting, reps[10,9,8], opener0 and terminal bound3, unchanged earnWalk emits only PROPOSED105. Forged110 remains rung-derivable. :157 now explicitly includes this eligibility residual and gates external admission. |
| B-R9-2 one sighting | Reps[10,9,8], effort[2,1,1], no comparator and no prior sighting emits no candidate. Forged DEBUT105 remains derivable. It is now named and gated, not incorrectly claimed structurally impossible. |
| B-R9-3 raised floor | targetsFor at hi12 with delivered[14,14] returns[14,14]; that line tops at hi14. Unlike R9, :127 now refuses every pre-FC16 NEW earn check, even currentHi=maxTarget. |
| B-R9-3 lowered window | targetsFor at hi14 with no line returns[12,12,12]; atTopOfWindow is false at14 and true at12. The same blanket legacy refusal closes this counterexample too. |
| B-R9-4 N24 | :156's RETIRE permits the genuine displayed target102.5 while requiring zero w/wSets writes; cancelled base100 no longer invalidates it. RESTORE separately targets an applied adoption's prior base. Compensation identity/empty consumes are explicit in :155. Historical replay/tombstones still need build proof. |

Earn probes use explicit synthetic noise callbacks. No noise formula or complete evaluator was substituted and claimed canonical. Window/decoder predicates are literal paper models; they do not establish a working R9.1 fold. The first combined probe stopped on a PowerShell/Node quoted-string assertion mismatch after returning the expected hot-opener result; stdin transport and property assertions completed the rerun without changing product conditions.

## Answers to the commissioned checks

1. All twelve L7 N25 variants and the forged adoption have refusal clauses, on paper, for BOTH R1 and R2:

| Case | Refusing clause/field |
| --- | --- |
| 1 body125; 2 bad programme; 3 bad queue; 5 body125 after rename | DERIVABLE / target_load:105 is the only F0 rung;125 is not eligible |
| 4 missing consumed Start from coverage | S5 / basis.coverage |
| 6 empty evidence | S4 / evidence |
| 7 other lift with original consumes | S1 / lift_lineage_id |
| 8 missing consumed Start; 9 missing Start/facts/evidence | S3 / consumes |
| 10 arbitrary spend | S2 / spend_id |
| 11 forged source | S7 / basis.source |
| 12 absent Start in order | S6 / basis.order |
| Observed105 replaced by adoption110 | S8 / target_load |

This is a refusal mapping, not 26 executed FC03 cases. The genuine numeric105 record's captured loads, roots, equipment and historical evidence survive rename/window/cache edits; the decoder still returns105, and :155 uses those recorded values. R9.1 also binds S8 to S4's accepted edit prefix, fixing the historical-load ambiguity. Actual R1/R2 application and post-accept removal remain build debt. N25's case7 changes the body's lift to fx-row, so its generic "for fx-press" expected label should be aligned with the affected-lift rule.
New fabrication: authentic completed originals at100, hi10, reps[10,9,7], known effort, complete matching roots/evidence/coverage/source, forged PROPOSED105, and a non-reproducible cut. Measured unchanged atTopOfWindow=false and nextLoad=105. S1-S8 prove correspondence; DERIVABLE permits r1 without testing top eligibility. This is covered by the widened eligibility residual, not a newly unbounded category. Local guarded issuance must refuse it; an external record must stop at admission.

2. Excluding direct modification of one's own encrypted store is a fair boundary. App bugs, ordinary edits and crafted incoming bodies remain in scope. :149 and :164-166 cover guarded local issuance/currentness; :155/161 cover historical edits; :157 explicitly gates portable/local import and future hosted sync. Gating admission rather than device IDs avoids rejecting genuine records already in the local log. No cryptographic issuance guarantee follows from authenticated membership alone.

3. FC16 is additive at the format boundary: measured source_json={value:14,unit:'rep',window_hi:12}; unchanged capture.read and engine-capture.readLayout accept it, old captures still read, display is unchanged, and an extra OUTER reps-cell key still gets WORKOUT_CAPTURE_INVALID. not_prescribed baseline cells remain unchanged; invalid hi omits the key. Unchanged resolveLayout rejects a new capture reconstructed with the old producer bytes as ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT; the corresponding modified producer agrees. Thus :387's version-binding debt is necessary; do not weaken whole-capture equality. R9.1's blanket pre-FC16 NEW-earn refusal is conservative even at equality and even if hi never changed. Baseline adoption bypasses this window refusal but still hits B-R9-1.

4. The widened RESIDUAL is correctly scoped: equipment, eligibility, ordering/context and issuance are named; an equipment anchor alone cannot lift it. Existing L/today-bindings.mjs:644-656 at0e4fc74 statically refuses a nonempty imported-source collection before folding; L7's recorded host refusal supports that installation boundary. :157 states hosted sync is absent and binds any future route to refusal. This is credible local-host containment, not a fresh proof about every deployed ingress. Do not call arbitrary fold inputs safe; N28's constructed local records deliberately still pass. Import/sync must remain closed until verified issuance or equivalent complete historical proof and the separate PM ruling exist.

5. Earlier-section conflicts: B-R9-1 versus N10/N26, and B-R9-5 versus the compensation guard, are blocking. :209 now distinguishes foreign missing frontiers from local non-reproducible cuts. :386 resolves the stale owner-question wording without asking Joe again. Earlier FC09/FC10 and N14/N22 positive import requirements cannot be counted complete while :157 is binding; retain them as future obligations behind that gate. The specific RETIRE rule resolves the original N24 mismatch with :154's general restoration wording.

## BLOCKING

- B-R9-1: finish kind-aware correspondence for genuine null/absent baseline records and define supported non-array wSets consistently.
- B-R9-5: reconcile NO TRAP's unconditional two exits with COMPENSATION_DESCENDANTS; define recovery of a disputed applied adoption without lowering the guard.

## NAMED DEBTS

- D-R9-ADMISSION: prove N28 at every real foreign admission path, preserve local guarded consent, and keep FC09/FC10/sync closed. Original-cut or issuer proof must cover eligibility and context, not equipment alone.
- D-R9-CAPTURE: producer/version binding, active pre-FC16 resume, qualified historical reconstruction, mixed/invalid/missing window values, and child pins on the actual host. The format probe used synthetic engine callbacks, generated JSON and a JSON-only clone; it is not full producer qualification.
- D-R9-EDIT/RECOVERY: after-accept correction/removal, eligible compensation, descendant refusal, explicit plan supersession and later checks through fold, host and panel. Retain consent, tombstones and facts.
- D-R9-DELIVERY: R9.1 implementation, N25 R1/R2 matrix, N26-N28, actual durable restart/card/landing, full scoped regressions, successor seal and exact-head Windows/Linux CI. No product, release or trial acceptance follows.
- Containment: four positively selected public modules only; their dependency sites inspected before execution. No require, filesystem or process capability was exposed to their VM contexts; unexpected imports refused. No forbidden module, private/legacy data, auth file, prohibited scratch, suite/generator, receipt, install, tracked edit, commit/push/fetch or deletion. One exact supplied node.exe at a time; MEASURED_TEST_NOW and TZ set on separate lines before each run. Probes stayed in memory; exactly this new review file was written.

## Final scoped commands and outputs

```text
git status --porcelain -- rebuild/coach/NATIVE-LOAD-SPEC.md rebuild/engine/progression.cjs rebuild/engine/earn.cjs rebuild/m4/workout/capture.cjs rebuild/m4/workout/engine-capture.cjs rebuild/lanes/astra/reviews/NATIVE-LOAD-SPEC-R9-REVIEW-L2.md
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-SPEC-R9-REVIEW-L2.md
```

```text
git diff --stat -- rebuild/coach/NATIVE-LOAD-SPEC.md rebuild/engine/progression.cjs rebuild/engine/earn.cjs rebuild/m4/workout/capture.cjs rebuild/m4/workout/engine-capture.cjs rebuild/lanes/astra/reviews/NATIVE-LOAD-SPEC-R9-REVIEW-L2.md
```
The diff command returned no output.
