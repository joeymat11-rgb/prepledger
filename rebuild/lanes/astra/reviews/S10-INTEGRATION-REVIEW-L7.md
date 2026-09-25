# S10 integration correctness review, round 7
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; package tier; round 7
Head checked: f97924af8be21fb68ff792d65c08fced58437032.
Rebound range: 875d46d7b2c5f2a90e95bb4578b5250250943de2..HEAD.
Sealed S9 parent: d7f654017962d35661adea8cf3688251ad686b9e.
VERDICT: ACCEPT WITH NAMED DEBTS

The merge-forward, parent rebind, exact-file REGEN scope addition and generated
inventory agree with the measured bytes. B1-B4 remain closed within the limits
below; B5/B6 remain closed. This accepts the commissioned rebound delta, not a
final S10 package, seal, release or engine-behavior verdict. Finalization STOPs
remain. S9 IS sealed: the earlier missing-parent/ENOENT conclusion is obsolete.
Authority: working brief c58b892 and its three reviews; DECISIONS:627, :777,
:780, :785, :791, :792, :798, :799, :801, :809, :810, :812 and :816.
Blind source findings and measurements were saved before earlier L1-L6 reviews;
those reviews were then used for bounded evidence reuse. Author report read LAST.

## Questions: invariants, inputs, outputs and counterexamples
1. Automatic merge fidelity and the three clauses.
   Fresh per-path reconstruction over the declared public inventory plus named
   parent artifacts: 92b7487 24/24, 9943679 10/10, aae3b27 8/8,
   cbe2bdf 5/5; zero mismatches. Actual three-way text merges: 3, 1, 0, 2.
   These counts are scoped changed paths, not whole-tree or earlier L2 counts.
   The two rebound text merges are S9.json and sealed-inventory-fence.test.mjs;
   the other three scoped changes carry the parent acceptance/review/receipt.
   cbe2bdf parents are 875d46d and ace916f; common base 6dc2596.
   S9 d7f6540 is an ancestor of HEAD; 0d38b8e is an ancestor of 5a953d5,
   both exit 0. The split/GSS/EPP second parents are their commissioned heads.
   Whole-file comparisons against sealed S9 prove today.cjs, writers.cjs and
   engine-capture.cjs each equal its parent plus exactly ONE PROPOSED-state
   exclusion at one unique anchor. No fourth clause or NATIVE-LOAD delta.
   This measures custody and composition, not engine behavior.

2. Runner registration and standing-step precedent.
   Runner and workflow are byte-identical to L6. S10 remains immediately after
   S9 in IDS and NO_REGISTER_IDS; today-split/ is appended to CHILD_ROOTS;
   PUBLIC_TAIL_ROOTS and runner predicates are unchanged. L2/L6's measured
   F6/F7 evidence and S9 precedents 085b6bc/c4224ee/ef21153 still apply.
   Standing name and command both say S10 inside its declared workflow post.
   Against sealed S9, H3 and S3-S9 specs differ ONLY in runnerSha256, 8/8.
   All bind actual runner 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c.

3. Supersession reason and present refusal boundary.
   Five supersession cells and the differential are byte-identical to L6.
   Their stated invariant distinguishes ancestors' reconstruction departures
   from S10's two further one-clause moves; it does not reuse S9's no-move reason.
   Six actual startup prefixes now ACCEPT the bound S9 artifact, two reads
   each. Six wrong-parent-sha counterexamples refuse at the hash assertion.
   No reconstruction import, engine load or child process is reached by these
   contained prefix probes. Therefore they are NOT currently ENOENT-red.
   Their downstream gate-refusal witnesses/differentials are CI-only, unrun
   here. Null S10 finalization fields remain; the real runner's named refusal
   is still owed. A sandbox stop is not counted as a product refusal or pass.

4. Re-pins follow moved bytes; checks are retained.
   All non-protected inventory bytes were independently compared with HEAD
   and disk. Rebound fence pre 606ad877/post b1afad55 preserves the sealed
   parent's optional-release key closure and S10's four condition rows.
   S9.json pre bb169a67/post a66530aa is the parent's execution pin plus the
   runner re-pin, not a rewritten S9 acceptance artifact.
   REGEN post 98d1cfff and its cell post fec4c039 match their changed bytes.
   Scope adds one exact file; eight rows are added, no old row removed.
   ci-second-gate is newly declared carried, f3c470c6 pre == post; no code change.
   Earlier provider/manifest/capture-carrier/timing-import re-pins are unchanged
   from L6, and all their current posts agree with bytes. No assertion was
   weakened to obtain these pin matches. Full invariant execution remains owed.

5. Every role, against the actual sealed parent.
   Independent reconciliation: 297/297 role/pre entries agree; zero missing
   parent product pins and zero mismatches. Counts: 232 carried, 20 edited,
   42 new, two released, one superseded-by-child. Parent: 254 product pins,
   84 execution pins. Full HEAD/disk identity measured for 292 files, including
   released views; the five protected modules use Git object identity only.
   For those five, parent/HEAD object IDs agree and pre == post; no content read.
   S9.json is superseded-by-child; seven existing parent-unpinned paths remain
   new/pre:null under :792. Both released views bind the S9 pre and post:null;
   fresh releaseAccounts probes accept both and find no child-argv collision.
   Parent-released build.mjs/preview.css remain undeclared. Parent design pins
   stay carried. b-lom child is absent under :799; both cell files stay carried.
   Thirty-five children remain and all 35 needles are null, not observed passes.

6. CI conditions and DECISIONS:627 P-S9-3.
   Fresh actual condition-reader predicates pass for the two E steps, writer
   fence and REGEN: 4/4. Forty synthetic bad workflows refuse: absent/false/
   success/nested condition, duplicate condition/owner, wrong path, and three
   continue-on-error spellings, for each step. Each real target has one owner
   with the complete !cancelled() condition. Five GSS annexes retain their
   Today workflow/child registration; inherited Today/M4 default conditions
   provide no evidence that those steps ran after a standing-step refusal.
   No hosted S10 run ID, conclusion or Linux success is claimed.

7. Recheck B1-B4 and remaining STOPs.
   B1 CLOSED: writer-fence and gym-app bytes equal the L6 reviewed bytes.
   L4's actual old-anchor 11/12 versus repaired 12/12 evidence is reused;
   the mutation and recorded scanner limitation remain. No new fence run claimed.
   B2 CLOSED AS CODE: EPP R9, its guarded assertions and the three repair
   inputs are unchanged from L6. L4's synthetic-adapter control and four
   assertion-deletion reds remain applicable. Real-engine R9 is still CI-only.
   B3 CLOSED: fresh actual H18/H18b/H18c callbacks pass 3/3 with extracted
   assertBundleInputs, exact 51/29 inventory and all 29 omission refusals.
   Inputs are synthetic inventories; no actual bundle was built.
   B4 CLOSED NARROWLY: both real rebound view declarations account for release.
   Actual committed synthetic row passes its control, seven refusal cases
   and re-release control. It does not authenticate the still-null PM grant.
   The supporting B1-B4 source/build/test files are unchanged from L6.
   D-REGEN-NOTES closes in S10.json: note [8] distinguishes code repairs from
   owed execution. D-BLOM rebinding is paid; its later proof debt remains.
   :785/:791 authorize D-EPP-2 despite the working paper's older third-clause
   STOP. :816 names M2-S10-TODAY-SPLIT; the final brief/tokens remain unfinished.

8. What remains owed and CI-only.
   Final S10 brief with every section 2.1 row filled and independently reviewed;
   exact input/reconciliation tables, copy-lock and source-closure proof,
   authorizations, actual observed needles, proposed artifact/review/receipt,
   Claude final, PM exact-byte read and required seal order. Detailed debts below.
   This review does not turn provisional declarations into a released package.

## REGEN scope and generated-output measurement
- Scope is 36 entries: 29 directory roots, seven exact files. Only the exact
  ci-second-gate path is added; no postfix/test directory or prefix is admitted.
- Committed synthetic-port suite: 191/191 pass, zero skipped/cancelled, exit 0.
  Same callbacks with untouched 875d46d helper: 189 pass, two fail, exit 1;
  precisely the two exact-file admission/carriage controls fail. Sibling,
  case-variant and below-file inputs still refuse before reading those inputs.
- Actual helper compiled on extra guarded fs/Git ports, DRY RUN only at sealed
  d7f6540: exit 0; 304 reviewed exact paths, 616 path/revision pairs,
  297 product entries, ZERO entries would change; no PROBLEM or stale note.
  Parent artifact f24476220ec9 and review 7f372d97170c match their bound hashes;
  review status ACCEPTED; receipt coordinate 809 matches the chain line.
- D-SPLIT-PARENT is freshly EQUAL at the SEALED parent for all three blobs:
  today-app ea98aef614f29dfbf3ade5206fc877120bda3c9d;
  today-model 6a146ff95a145f2f7835b35e9b86be8fcc840e5d;
  gym-app 48bf0531fdbcccffe981bd3c4d2f44a91f7abd6d.
  This closes the identity remeasurement, not Track A re-cut/DOM proof.
- The helper preserves its reviewed-declaration trust boundary. A declaration
  does not independently prove public contents. No broader privacy, race or
  hard-link guarantee is claimed. No real --write was performed by this review.

## BLOCKING items
None in the commissioned rebound delta. The following remain seal STOPs/debts.

## NAMED DEBTS
- D-FINAL/LOCK: :816 final brief/package fields, tokens, eight copy-lock answers,
  composed-product/coordinated-deletion proof, source closure and final tables.
  S9 seal and its artifact/review/receipt binding are now established; do not
  continue carrying them as absent. No final S10 authorization is inferred.
- D-SPLIT: actual-parent cut/independent reconstruction and DOM/listener proof;
  D3, D5 real eslint-scope and six scope rows, D6/D7/D9's 21 survivors, S-R33.
- D-GSS: merged machine-settings-ui red/green on both OS, physical M/R/N table,
  destructure-aware api.lane census. TIMER/LISTEN and transient/copy limitations
  retain their assigned payers. Byte fidelity does not pay runtime evidence.
- D-EPP/CR: real R9 green plus four-deletion reds; synthetic oracle, sensitivity
  and D-EPP-3 gates. :816 private grant belongs to PM only, not this reviewer.
  Provisioned PERFORMED_W6_DIR capture/configuration checks; receipt-bound coach.
- D-ACCEPTANCE: separate Claude Fable final, PM read, full Today/measure/bundle/
  provider/supersession/conformance/package checks; Windows/Linux rebuild run
  IDs/conclusions at the final composed head, plus authorized seal/reverify.
- D-BLOM: :798/:799 carries last S8 evidence only; reviewed hosted-packet re-point
  and after-2026-10-05 proof remain owed. No protected soak access here.
- D-REPORT/ORDER: author report is historical through round 10, still calling
  S9 absent and the supersession startup ENOENT-red. Reconcile before final
  acceptance. :812 orders Astra scope review before REGEN --write; supplied
  f97924a already records that write. This review validates the resulting bytes
  now and does not establish that the prior-review ordering was satisfied.

## Method and what I did not verify
Windows Node v24.19.0, commissioned absolute binary, one reviewer Node process
at a time; fixed MEASURED_TEST_NOW and TZ on separate lines. Tests/import/read
paths inspected before execution; positive source slices, synthetic fixtures,
closed read/module/child ports. First guarded helper harness refused an omitted
public S9 brief metadata path; allowance corrected narrowly, then dry run passed.
One completed probe's console output was not retained by the tool wrapper;
rerun retained its output. Neither harness issue is counted as a product defect.
No protected-five content read/load/execute, private/auth/legacy source, soak,
whole Today step, generator, b-package --ci/--full, real receipt/artifact write,
install, node_modules change, commit/push/checkout/reset/stash/clean/fetch.
Only this new worktree review was written. Scratch retained, no cleanup attempted:
%TEMP%/earned-s10-l7-astra-probes (probe.cjs, callbacks.cjs, pre-scope.cjs,
measurement.txt, three merge inputs). Merge proof is scoped, not whole-tree.
Author report read last: historical code-repair claims agree within these limits;
its larger runtime counts are not adopted as independent proof of this head.

Final commands/output (explicit reviewed paths; after the final file write):
`git status --porcelain -- <review file and explicit reviewed integration paths>`
```text
?? rebuild/lanes/astra/reviews/S10-INTEGRATION-REVIEW-L7.md
```
`git diff --stat -- <same explicit paths>`
```text
```
