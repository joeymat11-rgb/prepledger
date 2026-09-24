# S10 integration correctness review, round 3
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; package tier; round 3
Head checked: 6696062840db802fbc17f7450eb4438fcae429de; base 6dc2596d56e0e8602ce6416f4de996d764992364.
VERDICT: REJECT

B1-B4 remain closed within the measured boundaries below. B5 is only partly
repaired: the helper still admits forbidden input spellings and auth-shaped
paths. B6 is new: its regression cell has no execution home. This is a review
of the commissioned draft, not a new engine verdict or permission to seal.
S9 remains unsealed and section 2.1 values remain STOP placeholders.
Read c58b892's brief and three reviews, and chain DECISIONS:627, :780, :785,
:791, :792, :793. Formed the view from brief/commits before reading L1/L2.
The findings below were saved BEFORE opening the integration author report.

## Questions, measured only where inputs changed since L2
1. Merge fidelity and three clauses: unchanged inputs. The three merge
   commits are immutable; L2's scoped automatic reconstruction remains the
   relevant evidence (55/55, 36/36, 68/68; zero conflicts/mismatches).
   Rechecked current today.cjs, writers.cjs and engine-capture.cjs against
   6dc2596: each equals that base plus exactly its one PROPOSED exclusion at
   one unique anchor. GSS product paths are byte-unchanged since L2.
   No NATIVE-LOAD delta appeared. This is byte evidence, not engine execution.

2. Runner and standing step: byte-unchanged since L2. Its registration and
   S10 name/command flip still have L2's measured S9/ef21153 precedent and
   F6/F7 result; no rerun of the unchanged runner suite was needed.

3. Supersession: all five cells and the corrected differential are unchanged
   since L2. Their reason still distinguishes S10's two further clause moves
   from the ancestors' earlier reconstruction departures. Six fresh guarded
   startups each make two allowed reads and stop ENOENT at the missing
   acceptance-s9-ui-pins.json, before any transitive engine/helper execution.
   That is the correct parent STOP, not a passed reconstruction witness.

4. Re-pins: since L2 exactly three product entries change: S10-REGEN.cjs
   post fe1845270fc1, new S10-REGEN.test.cjs d8a9a8ff1f5d, and boundary.test.mjs
   c649d0cfc44e. All equal their actual bytes. The boundary change adds only
   the named re-release control; its predicate is unchanged. All eight
   ancestor specs still differ from base only in runnerSha256, measured
   9fbfdd2d9b09. No unchanged check was removed by these re-pins; B5/B6 are
   behavior/registration failures, not stale hashes.

5. Every role: 296/296 declarations agree with candidate S9 product ownership
   and runner-derived execution targets; zero missing parent product pins.
   Counts: 231 carried, 20 edited, 42 new, two released, one superseded-by-child.
   All 289 permitted non-null posts match disk. The five protected engine
   modules were compared by Git mode/object identity only, unchanged from
   base, with pre=post metadata; their contents were not read for this check.
   The added regression cell correctly has new/pre:null. S9.json remains
   superseded-by-child; released views keep parent pre/post:null and no child
   argv collision. The seven parent-unpinned files remain new; parent-released
   build.mjs/preview.css stay outside the product map. Final S9 remeasurement
   is still owed. A correct product role does not supply an execution home.

6. P-S9-3: workflow and condition-reading rows are byte-unchanged since L2;
   its three passing callbacks/27 refusal controls remain applicable to the
   two E steps and writer fence. New S10-REGEN.test.cjs has zero workflow
   mentions, zero child argv entries, and zero runner mentions: B6. Existing
   Today/M4 default conditions still provide no hosted evidence behind a red
   standing package step. No CI run or green conclusion is claimed here.

7. Earlier blockers, remeasured at this head:
   B1 CLOSED: actual residue/dead-key callbacks, old 1cf99d3 11/12, HEAD 12/12.
   The old helper plant fails to land; the current plant lands the same
   mutation and retains the recorded scanner limitation.
   B2 CLOSED AS CODE: actual R2/R3/R4 bodies and R9 guard, with explicitly
   synthetic observation adapters, pass 1/1; four separate assertion-removal
   mutants each fail R9. No protected engine was loaded or substituted.
   Actual composed-engine green/removal-red evidence stays CI-only.
   B3 CLOSED: actual H18/H18b/H18c plus the extracted assertBundleInputs
   predicate, old tests/current source 1/3, HEAD 3/3. Exact input inventory is
   51 total/29 Today, including all 29 individual omission refusals. No bundle
   or server was built; that output remains owed.
   B4 CLOSED NARROWLY: actual releaseAccounts accepts the real S10 release.
   Its committed control, seven refusal cases and added re-release control
   pass. The runner still owes the actual PM grant/one-generation check.
   B5 OPEN: detailed counterexamples below. D-REGEN-INPUT is paid as code:
   PENDING and missing reviews refuse --write; missing receipt-line refuses
   before a read; accepted synthetic control writes only S10.json. The actual
   committed parent-release row passes. Runner acceptance is not inferred.

8. Missing work/STOPs: packageId, sourceBase, final brief, parent hashes and
   receipt coordinate remain null, as do all 36 child needles. No release,
   token, artifact or receipt was invented. :785/:791 still authorize D-EPP-2
   despite the older working brief's third-clause STOP. B5 and B6 need repair;
   the unchanged seal/platform/behavior obligations remain below.

## BLOCKING
- B5, S10-REGEN.cjs:55-71,113-124,168-195: the positive boundary is incomplete.
  FORBIDDEN's src/ledger rules and PROTECTED are case-sensitive, while the
  allowed roots admit arbitrary descendants and contain no auth exclusion.
  With wholly synthetic Git/filesystem ports, a newly tracked changed input
  rebuild/m4/spec/LEDGER/synthetic.json, or rebuild/m4/spec/auth.json, is read
  from Git AND disk and the dry run exits 0. Both are Windows-valid names.
  A ledger spelling is also read when supplied through S10.product, the
  parent product map or the parent artifact path. Canonical lowercase ledger
  refuses before content; changing only its case bypasses the same guard.
  These are attempted forbidden reads in synthetic ports, not real private
  reads. Do not run the helper against repository data as currently bounded.
  Refuse forbidden names under filesystem equivalence, preserve the no-auth
  boundary, validate Git/disk identities without opening refused bytes, and
  add refusal controls for each input source. Re-pin the reviewed repair.
  Do not fix this by accepting a broader data scope.
- B6, S10-REGEN.test.cjs and S10.json:158: the new 10-row regression cell is
  product-only, unreachable from rebuild.yml and all 36 declared children.
  No runner dispatch names it either. Brief 4.2/4.3/9 require every new test
  to have its declared execution/CI home; section 13 stops on missing test
  registration. Register the exact cell through the accepted runner/workflow
  route, with the applicable condition-reading row, and reconcile its pins.

## B5 path-spelling measurements and limits
Fresh whole-helper matrix: 30 inputs; 17 refuse before their content read,
13 reach a synthetic content read and exit 0; zero dry-run writes.
- REFUSE: traversal, absolute drive/slash, drive-relative, UNC/extended path,
  mixed backslash separators, dot/empty segments, out-of-scope root, canonical
  ledger, uppercase soak, changed root case, control character, disk symlink,
  junction, Git symlink mode 120000 and submodule mode 160000.
- ADMIT with supplied regular Git entries: upper/mixed-case LEDGER, upper SRC,
  ledger directory trailing dot/space, upper/mixed-case protected basenames,
  protected trailing dot/8.3 spelling, auth.json, .credentials, and an ADS
  spelling. The latter exotic names are lexical-boundary observations, not
  a claim that all can be checked out or opened on this Windows host.
- Real fresh scratch junction: the helper's actual diskLinks detects it;
  no target-content read or write. Real Windows Node marker fixtures: case,
  mixed separators and a COM-obtained 8.3 short name read the same marker as
  the long name and lstat reports ordinary files, not symlinks. Node refuses
  both file and directory trailing-dot markers with ENOENT on this host
  (.NET normalizes those same spellings). No trailing-dot Node escape proved.
- Current Git metadata contains none of SEED.cjs, seed.cjs. or ORACLE~1.CJS;
  these alternate spellings alone do not obtain today's protected Git blobs.
  The blocker is the admitted changed/spec/artifact input with its own valid
  Git entry, especially LEDGER and auth.json, not an alleged current leak.
- Committed helper tests pass 10/10, but omit these case/auth counterexamples.
  Write-mode ports with an accepted synthetic parent record exactly the
  declared S10.json output. No outside write was demonstrated. No real helper
  --write, artifact creation, protected content access or receipt occurred.

## NAMED DEBTS
- D-PARENT/LOCK: accepted S9 seal and section 2.1 identities; final input and
  reconciliation tables; eight copy-lock answers, composed-product and
  coordinated-deletion proof, source closure, PM tokens, receipt and needles.
- D-SPLIT: actual-parent D-SPLIT-PARENT; re-cut and independent reconstruction,
  DOM/listener evidence; D3/D5 real eslint-scope/six scope rows, D6/D7/D9's
  21 survivors, S-R33. No substitute parser or re-used candidate pin closes it.
- D-GSS: merged machine-settings-ui red/green on both systems; physical M/R/N
  accounting and destructure-aware api.lane census. TIMER/LISTEN and accepted
  transient-input/copy limitations retain their existing payers.
- D-EPP/CR: actual R9 sensitivity, synthetic oracle, D-EPP-3 gates and the
  separately authorized private gate; capture/configuration with provisioned
  PERFORMED_W6_DIR. Coach ENGINE_REVISION follows the real receipt.
- D-ACCEPTANCE: independent Claude Fable final, PM exact-byte read, complete
  Today/measure/bundle/provider/supersession/conformance/package routes and
  exact-head Windows/Linux rebuild run IDs and conclusions. The real runner's
  named refusal on STOP fields remains owed, not a TypeError or inferred pass.
- D-REGEN-NOTES: S10.json's carried final note still says D-EPP-4 is unpaid and
  the residue row is red; measured code now pays those defects. Regeneration
  flags candidate references but not these stale claims. Reconcile at final
  input binding; this does not reopen accepted behavior or waive its CI debt.

## Method and what I did not verify
Windows Node v24.19.0 at the commissioned absolute path; fixed clock/timezone
set on separate lines before each probe, one Node process at a time. Actual
positive callbacks/pure source slices, denied unexpected imports/IO/children,
synthetic helper ports; real alias fixtures contain only an invented marker.
Harness-only stops (denied model read/module builtin, cross-realm array
identity, and Node trailing-dot ENOENT) were resolved narrowly or recorded;
none is counted as a product pass. No protected engine execution, legacy or
private gate, whole Today step, package --ci/--full, generator, tree artifact,
dependency change, commit, push, checkout, reset, stash, clean or fetch.
Only this new review file is written in the worktree. Fresh scratch retained:
%TEMP%/astra-s10-l3-20260924, four probe scripts, synthetic alias fixtures and
two probe metadata files. No cleanup attempted. L1/L2 were read after the
blind view; no concurrent Claude review was used.

Author report read LAST: its 10/10 and inventory counts agree. Round 6 itself
discloses the missing CI step and calls the cell "tooling, not product";
S10.json nevertheless declares it product, and no brief exemption is cited.
Its canonical-name controls do not measure the B5 case/auth counterexamples.
The report's larger execution claims are not adopted as independent proof.

Final command output (explicit reviewed paths):
`git status --porcelain -- .github/workflows/rebuild.yml rebuild/engine rebuild/lanes/b rebuild/lanes/c rebuild/m3/w7-preview/today rebuild/m3/w7-preview/measure rebuild/m4/import rebuild/m4/spec rebuild/m4/workout rebuild/lanes/astra/reviews/S10-INTEGRATION-REVIEW-L3.md`
```text
?? rebuild/lanes/astra/reviews/S10-INTEGRATION-REVIEW-L3.md
```
`git diff --stat -- .github/workflows/rebuild.yml rebuild/engine rebuild/lanes/b rebuild/lanes/c rebuild/m3/w7-preview/today rebuild/m3/w7-preview/measure rebuild/m4/import rebuild/m4/spec rebuild/m4/workout rebuild/lanes/astra/reviews/S10-INTEGRATION-REVIEW-L3.md`
```text
```
