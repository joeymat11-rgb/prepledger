# NATIVE-LOAD-SPEC R9 Review L1
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; paper, engine tier; round 1
VERDICT: REJECT

R9 closes the listed oversized-target examples in principle, but its literal DERIVABLE input rejects genuine recorded earns, its legacy rule still admits ambiguous windows, and its compensation rule conflicts with N24. The named forgery residual is also too narrow.

## Scope and evidence

- Reviewed uncommitted rebuild/coach/NATIVE-LOAD-SPEC.md in earned-astra-96; HEAD/base b849508debace724271c06b31aee310815780ae7 (R8); explicit-path working diff read.
- R9 SHA256: 88371bfdbc95ed47c8cfd4b021ffa98c5d8fa80ab99ae0d46cd3a5e70a7af94f. Spec line citations below name this file, not R8.
- Read the commissioned L7 report, its synthetic probes.cjs/l7-probes.jsonl, and remote DECISIONS:784,785,793. No other reviewer's R9 report read. Historical L7 execution is reused as historical evidence, not claimed as rerun here.
- E = rebuild/engine; W = rebuild/m4/workout; L = rebuild/m3/w6/local. Existing L7 record-format/host citations were read in earned-astra-106; unchanged public readers/capture were read in earned-astra-96.
- All fixture quantities below are invented. Two bounded in-memory reader probes completed: E/progression.cjs + E/earn.cjs; W/capture.cjs + W/engine-capture.cjs with only FC16's proposed expression changed in memory. This is paper evidence, not an R9 fold/build/host acceptance run.

## Findings with evidence

### B-R9-1: DERIVABLE needs an explicit decoder for existing durable records

Invariant: a genuine issuance must remain applicable after a harmless rename/window/cache edit, under both present and absent producer revisions (:155; DECISIONS:793).
Input: the existing F0 record has load_basis.w={present:true,value:100}, inc={present:true,value:5}, steps={present:false,value:null}, wSets={present:false,value:null}; base_load.scalar={value:100,unit:'lb'}, fields.w.value=100. FC03 basisOf explicitly emits these wrappers (W/native-load-effects.cjs:218,232-233); FC01 baseLoad emits typed Loads (E/native-load.cjs:122-128).
R9:156 constructs ex' by copying those members directly. Measured unchanged E.nextLoad(ex') returns null; decoding the identical record to {w:100,inc:5} returns 105. E/progression.cjs:364-370 explains why: Number(the w wrapper) is NaN. The stated equality of load_basis.w, base_load.scalar and fields.w.value also compares three different representations. wSets.map has the same wrapper problem.
Output required by the literal new rule: every such earn is underivable, including the genuine 105 control and historical records after a seal. This is independent of any forgery.
Required amendment: specify presence-preserving decoding, unit/value comparisons, and vector/FieldImage correspondence for the existing wire shape. Keep absent distinct from null. Add unchanged old-record positive controls under R1/R2; do not silently change the v1 record shape to make this pass.

### B-R9-2: structural correspondence plus rung derivability does not prove an issued candidate

Invariant: only the exact eligible, accepted engine choice authorizes a target (:8-12,60-61,137,149). Authentication of a received operation is not an attestation that the guarded host issued its body; :18 explicitly treats incoming records as possibly crafted.
Constructed input A: authentic completed work at 100, hi10, ladder [100,105,110], original reps [10,9,8], opener exact0 and terminal at_least3. Keep equipment, loads, all slot evidence and commitments authentic. Fabricate candidate PROPOSED110/target110, with canonical consumes/spend, complete coverage, authentic order/source, and a bad programme digest or absent producer revision.
S1-S8 all hold: same lift/root/spend, real Start/normal Close, exact complete evidence/edit prefixes, covered refs, authenticated Starts/source, captured=actual=base100. DERIVABLE also holds after B-R9-1 decoding: r1=105, r2=110, ladder exists, state PROPOSED, terminal at_least3. Neither rule checks the hot-opener branch.
Measured unchanged earnWalk on that input emits ONLY PROPOSED105. E/earn.cjs:45-65 handles the hot opener; its two-rung branch :66-80 is unreachable. The probe supplied explicit synthetic noise callbacks; this branch result does not depend on their numerical values. R9 therefore structurally admits a 110 choice the canonical reader never issued, without changing inc or steps.
Constructed input B: one authentic ordinary top [10,9,8], effort [2,1,1], no comparator and no prior sighting; fabricate DEBUT105 with the same complete correspondence. DERIVABLE accepts r1, but the canonical one-sighting control emits no candidate. Below-window work similarly passes the listed structural/rung checks. These are admission-contract counterexamples, not claims of a local UI injection.
S6 also authenticates Start membership without authenticating the claimed ordering; S5 requires named refs without proving the complete historical context. Those limitations matter when the evaluator is intentionally skipped.
Required amendment: widen RESIDUAL beyond forged equipment to unproved eligibility, ordering/context and issuance. Equipment anchoring ALONE is not a sufficient closure option. Require verifiable issuance or equivalent complete historical proof before admitting any externally constructed native record, including sync as well as FC09/FC10. Preserve genuine original-cut consent; do not rerun old choices against today's inputs.

### B-R9-3: the legacy window predicate still permits ambiguous cases

Invariant: a new check cannot reuse a completion under a changed governing window (:127,188,275,307). Captured targets are not the window (N02).
Input A: hi12, earlier delivered [14,14], so a pre-FC16 Start captures targets [14,14]; its completion performs [14,14]. Raise hi to14, keep load/layout/technique unchanged, then check. Such above-window targets are legitimate: E/progression.cjs:295-306 preserves the delivered floor; FC16's source itself distinguishes target from original.hi.
Measured literal legacy predicate: target>hi is false; performed>largestTarget AND hi>largestTarget is false. Measured unchanged atTopOfWindow at hi14 is true. A prior matching top can confirm the run. The rule permits an offer although the window changed. A new FC16 capture with window_hi12 correctly refuses.
Input B: old hi14, no preceding line, ordinary initial targets [12,12,12], complete [12,12,12], then lower hi to12. Measured targetsFor returns exactly that target array; legacy refusal=false; oldTop=false; newTop=true. A known terminal2 can now justify an early one-rung offer on work that did not top its captured governing window.
Required amendment: absent window_hi is uncertainty even when current hi EQUALS the largest target. Require an authenticated historical window or refuse the ambiguous new check. Also define the empty-target/not_prescribed baseline case explicitly, so N10 remains possible without inventing a maximum. Keep already accepted records under :793 separate from NEW-check refusal.

### B-R9-4: DERIVABLE contradicts retire-only compensation

Invariant: when an unordered later base differs, compensation retires the old target and keeps the later base, without any w/wSets write (:159,201,305, N24).
Input: genuine accepted Q105 has recorded base100; current base becomes102.5 with no ordering operation. N24 requires a retire-only cancellation that leaves102.5. Existing FC01 compensation encodes its displayed target as the current load in that case (E/native-load.cjs:345-360).
R9:156 instead requires EVERY compensation target and its FieldImage to equal the cancelled effect's recorded base exactly, namely100. The valid N24 cancellation fails this test. Changing its target to100 would misdescribe the retire-only result and is not the recorded issuance. The target_load schema at :111 also has no FieldImage member; state exactly which field image the test means.
Required amendment: distinguish restoration of an applied adoption from retirement of a queued/unapplied/conflicted effect, while preserving the existing tombstone and descendant guards. Add N24 through DERIVABLE and replay, including historical compensation records. S2 must likewise respect the existing compensation identity rather than imposing an earn/adoption tuple on it.

## Answers to the commissioned checks

1. L7 matrix: assuming the representation fix, the intended checks reject all twelve N25 cases and the fabricated adoption. This is a paper mapping, not executed R9 rejection:

| N25 case(s) | Refusal condition |
| --- | --- |
| 1 body125; 2 bad programme; 3 bad queue; 5 body125 after rename | DERIVABLE: 125 is neither eligible numeric rung105 nor a qualified second rung |
| 4 missing consumed Start from coverage | S5 basis.coverage |
| 6 empty evidence | S4 evidence |
| 7 other lift, original consumes | S1 lift_lineage_id |
| 8 missing consumed Start; 9 missing Start/facts/evidence | S3 consumes |
| 10 arbitrary spend | S2 spend_id |
| 11 forged source | S7 basis.source |
| 12 absent Start in order | S6 basis.order |
| Observed105 replaced with adoption110 | S8 target_load |

The authentic rename/window/cache controls otherwise preserve their roots, evidence, stored equipment and captured loads, so S1-S8 need not revoke them; B-R9-1 currently prevents the promised positive result. L7's additional deleted-facts-kept-ops diagnostic is separate from these twelve: reconstruct authenticated facts or explicitly withhold the affected projection; do not count that stale projection as trustworthy work.

2. Excluding deliberate edits of one's own encrypted store is a fair boundary for this feature. It does not exclude malformed app output or crafted authenticated incoming records. Local opaque handles and pre-commit re-evaluation cover ordinary issuance; they do not authenticate remote engine eligibility. Post-accept corrections also need an explicit historical-value rule for S8: S4 permits the accepted edit prefix, whereas reading today's corrected loads for S8 would reject the genuine record instead of retaining it with BASIS_REPAIR_REQUIRED (:160,191,N08).

3. FC16 is additive at the FORMAT boundary. Measured source_json={value:14,unit:'rep',window_hi:12}; unchanged capture.read and engine-capture.readLayout accept it; the old capture still reads; display is unchanged. An extra OUTER reps-cell key still gets WORKOUT_CAPTURE_INVALID. Thus capture.cjs:12,54-60 exact-key checks do not block the inner key. However, unchanged resolveLayout with the same synthetic producer and original input rejects a new capture as ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT (:103-108 compares whole captures). No universal old-reader/reconstruction compatibility follows. Version binding and historical capture handling remain required; do not relax whole-capture equality. The legacy safety claim fails B-R9-3.

4. The stated inc/steps residual is real, but incomplete (B-R9-2). Current local-host containment has concrete support: L/today-bindings.mjs:644-656 refuses a nonempty imported-source collection before folding, and L7 independently measured that host refusal. No current remote-injection exploit is claimed. Stopping import ALONE is not a proof about sync, nor an adequate future gate: name the closed local-only installation and require every remote native-record admission route to stay closed until the broader residual is resolved. Portable/local import support and sync delivery were not executed here.

5. B-R9-4 is a direct normative conflict. Also reconcile :155's missing/non-reproducible-cut fallback with :208's undifferentiated "Missing cut: SOURCE_FRONTIER_UNPROVEN". B0/G/H still describe already answered owner choices as unanswered; :784-785 govern YES/B, A recovery and adoption's yes-required default. These stale sections are not grounds to ask the owner again.

## BLOCKING

- B-R9-1: preserve and decode the existing durable record representation before DERIVABLE; prove genuine R1/R2 records still apply.
- B-R9-2: describe the full forgery residual and close/gate ALL external admission paths; an equipment anchor alone is insufficient.
- B-R9-3: reject genuinely ambiguous pre-FC16 windows, including currentHi=maxTarget, without disabling valid baseline adoption by accident.
- B-R9-4: make compensation validation consistent with N24 and historical cancellation identities.

## NAMED DEBTS

- D-R9-CAPTURE: child pins, old/new capture producer binding, active pre-FC16 Start resume, qualified reconstruction and mixed/invalid/missing window fields need actual host proof. Format-reader success is narrower.
- D-R9-EDIT: state the historical S8 load projection and add after-accept load correction/removal coverage; retain consent plus BASIS_REPAIR_REQUIRED, never silent repair or deletion.
- D-R9-DELIVERY: R9 product implementation, full N25 R1/R2 matrix, N26 plus the new counterexamples, real durable host/import/sync/restart, successor seal and exact-head Windows/Linux CI remain unverified. No acceptance, ledger ruling, release or trial authorization follows.
- Containment: four positively named public modules only in bounded VM probes; no filesystem/child-process capability in their contexts, unexpected require refused. No native-load/seed/migrate/merge/index/oracle-shim execution, private/legacy data, auth file, prohibited scratch, suite, generator, receipt, install, tracked edit, commit/push/fetch or deletion. Only this new review file was written.
- The first piped probe yielded no result and was terminated; a capture-loader attempt failed on duplicate top-level PROFILE before its checks. The corrected scoped CommonJS wrapper then completed; no product/test condition was weakened. Probes and FC16 substitution stayed in memory; no scratch files to delete.
- Completed runs used the exact commissioned node.exe sequentially, with MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York set separately. Engine probes used named synthetic noise callbacks; capture probes used synthetic engine callbacks and a JSON-only clone for JSON-only fixtures. No whole-runtime/production authentication claim follows.

## Final scoped commands

R9 hash rechecked unchanged. Report before this ASCII-only footer: 94 lines, zero non-ASCII bytes, zero CR bytes, final LF. The last shell commands and their outputs follow; the empty-output annotation is not Git output.

```text
git -c safe.directory=C:/Users/joeym/AppData/Local/Temp/earned-astra-108 status --porcelain -- rebuild/coach/NATIVE-LOAD-SPEC.md rebuild/engine/progression.cjs rebuild/engine/earn.cjs rebuild/m4/workout/capture.cjs rebuild/m4/workout/engine-capture.cjs rebuild/lanes/astra/reviews/NATIVE-LOAD-SPEC-R9-REVIEW-L1.md
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-SPEC-R9-REVIEW-L1.md
```

```text
git -c safe.directory=C:/Users/joeym/AppData/Local/Temp/earned-astra-108 diff --stat -- rebuild/coach/NATIVE-LOAD-SPEC.md rebuild/engine/progression.cjs rebuild/engine/earn.cjs rebuild/m4/workout/capture.cjs rebuild/m4/workout/engine-capture.cjs rebuild/lanes/astra/reviews/NATIVE-LOAD-SPEC-R9-REVIEW-L1.md
(no output)
```
