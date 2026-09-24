# S10 integration correctness review, round 4
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; package tier; round 4
Head checked: 62788b1244510d7ecfa1c6dfc40afcc1f1d86c28; base 6dc2596d56e0e8602ce6416f4de996d764992364.
VERDICT: REJECT

L3 B5 remains OPEN on a narrower auth-exclusion counterexample; B6 is closed.
B1-B4 remain closed. The old alias spellings are repaired, but the no-auth
invariant is still false for standard credential/key names. S9 is unsealed; section 2.1
placeholders remain STOPs. No engine behavior verdict or seal is inferred.
Authority: c58b892 brief and its three reviews; chain DECISIONS:627, :777,
:780, :785, :791, :792. The blind view preceded L1/L2/L3 and the author
report. Initial measurements were saved early; the additional auth-name
counterexamples extended them. No concurrent Claude review was used.

## Questions, measured at HEAD where inputs changed since L3
1. Automatic merges and the three clauses: unchanged integration inputs.
   L2's scoped automatic reconstruction remains applicable: 92b7487 55/55,
   9943679 36/36, aae3b27 68/68, zero conflicts/mismatches. Those immutable
   commits were not reconstructed again. Fresh byte comparisons prove that
   today.cjs, writers.cjs and engine-capture.cjs each equal 6dc2596 plus
   exactly its specified PROPOSED exclusion, with a unique insertion site.
   The engine/capture product delta is unchanged since L3; no fourth clause
   or NATIVE-LOAD change appeared. This is byte evidence, not engine execution.

2. Runner registration and standing step: runner unchanged since L3; the
   prior measured IDS/no-register/CHILD_ROOTS registration and S9 precedent
   remain applicable. The workflow delta adds only the REGEN step/comment;
   the standing S10 name/command pair remains as reviewed. All eight ancestor
   specs still differ from 6dc2596 only in tooling.runnerSha256, equal to
   the measured runner digest 9fbfdd2d9b09. No runner predicate changes here.

3. S10 supersession: all five cells and the corrected differential are
   unchanged since L3. They distinguish S10's two one-clause module moves
   from the ancestors' earlier reconstruction departures. Six fresh contained
   startups each make exactly two permitted reads and stop ENOENT at the
   absent acceptance-s9-ui-pins.json, before any reconstruction helper,
   protected engine load or child process. This is the right parent STOP.
   It does not prove the eventual carrier refusal witnesses or differential.

4. Re-pins: exactly four S10 product entries change since L3, each justified
   by changed bytes: rebuild.yml 45b286b73aa6, S10-REGEN.cjs ef535849dbee,
   S10-REGEN.test.cjs 19e0c5a3a05a, sealed-inventory-fence.test.mjs 6abf4d4db9a5.
   Each equals disk. The helper tightens refusal, its cell adds 21 rows,
   the workflow adds its execution home, and the fence adds condition row 35.
   No test row or assertion was removed; the other re-pins remain unchanged.

5. Roles for every declared path: 296/296 role/pre declarations agree with
   candidate S9 product ownership plus its runner-derived execution targets.
   Counts: 231 carried, 20 edited, 42 new, two released, one superseded-by-child.
   Zero missing parent product pins; all 289 permitted non-null posts match
   disk. The five protected modules have unchanged Git mode/object identity
   and pre=post metadata; their bytes were not read for this measurement.
   REGEN and its cell remain new/pre:null; S9.json remains superseded-by-child.
   Released views have parent pre/post:null and no child-argv collision.
   No role changes since L3; parent-released build.mjs/preview.css stay outside.
   These remain candidate declarations until the real S9 artifact is bound.

6. CI and DECISIONS:627 P-S9-3: actual condition callbacks 32-35 pass 4/4.
   REGEN now has one exact node --test workflow owner with !cancelled().
   Its new callback fails against the L3 workflow. Nine changed-workflow
   counterexamples fail: wrong path, ordinary/quoted continue-on-error,
   duplicate if, duplicate owner, absent/false/success/nested condition.
   The cell is product-pinned and invoked directly by CI, not a package child;
   no CHILD_ROOT or runner widening was needed. Registration pays B6's code
   defect, not hosted execution. Today/M4 default conditions remain inherited.

7. All earlier BLOCKING items, remeasured:
   B1 CLOSED: actual residue/dead-key callbacks at 1cf99d3 11/12, HEAD 12/12.
   The old plant fails to land; the current plant lands the same mutation
   while retaining the scanner's recorded limitation.
   B2 CLOSED AS CODE: actual R2/R3/R4 bodies and R9 with synthetic observation
   adapters pass 1/1; removing each of the four guarded assertions separately
   makes R9 red, 4/4. No protected engine was loaded or substituted. Actual
   composed-engine sensitivity remains CI-only.
   B3 CLOSED: actual H18/H18b/H18c plus extracted assertBundleInputs:
   old tests/current build source 1/3, HEAD 3/3, exact inventory 51/29.
   All 29 individual omission refusals remain. Removing each new sibling
   makes all three rows red; adding an input makes H18b/c red. No bundle built.
   B4 CLOSED NARROWLY: actual releaseAccounts accepts the real S10 view
   release; its committed control, seven refusals and re-release control pass.
   The real runner must still bind the PM grant and one-generation rule.
   B5 OPEN: standard credential/key names still reach content reads below.
   B6 CLOSED: the real execution path and condition row are measured in Q6.
   No new STOP-field fulfillment was invented; :785/:791 still authorize
   D-EPP-2 despite the older working brief's third-clause STOP.

8. Missing work and CI-only: packageId, sourceBase, final brief, parent hashes,
   receipt coordinate and token/release claims remain STOPs; 36/36 child
   needles remain null. The named debts below still govern acceptance. No
   rebuild run ID or green hosted conclusion is claimed. New registration
   does not supply section 9's prior both-system standalone execution proof.

## BLOCKING items
- B5 residual, S10-REGEN.cjs:69,83-95,142-153 (shape and read ports): the auth
  exclusion recognizes only auth|credential|token|secret substrings. It admits
  standard authentication files under its broad allowed roots, including
  rebuild/m4/spec/.netrc, rebuild/m4/spec/_netrc and
  rebuild/m4/spec/.ssh/id_ed25519. With wholly synthetic ports and regular Git
  entries, EACH is read from Git AND disk and the dry run exits 0.
  Repeated through changed paths, S10.product, parent candidate product and
  sealed parent product: 12/12 inputs reach both reads, zero writes. This
  violates the no-auth boundary even though the old case/alias cases refuse.
  No actual credential was read: only an invented marker existed in the ports.
  Refuse standard credential/key paths, or narrow admission to explicit
  reviewed public files; cover these sources red-first and re-pin the repair.
  Do not treat a regex with four words as the complete no-auth contract.

## B5 boundary measurements and limits
- Actual committed REGEN cell: 31/31 pass, exit 0, on Windows Node v24.19.0.
- Fresh unmodified whole-helper matrix: 40 invalid names through eight input
  sources, 320/320 refuse BY NAME before reading that input; zero writes.
  Sources: changed paths, S10.product, parent candidate product, artifact
  path, review path, sealed execution pins, sealed product and split sources.
  At L3 the same changed-name matrix admits 21/40 synthetic content reads.
- Names include relative traversal/dot/empty components, drive absolute and
  drive-relative paths, slash absolute, UNC/extended paths, mixed separators,
  changed root case, control characters, forbidden src/ledger/soak variants,
  auth.json/.credentials/token/secret/authorization names, trailing dot/space,
  protected case aliases, 8.3 names, and alternate data streams.
- Synthetic disk symlink/junction and Git 120000/160000 modes: 4/4 refuse
  before content. A real fresh scratch junction is detected by the actual
  diskLinks predicate without reading its target. No real symlink required.
- Real synthetic marker fixtures show absolute, case and mixed spellings
  resolve to the same Windows file. COM supplies an actual 8.3 name, which
  Node reads as the same marker; the helper refuses its exact relative short
  spelling. All 30 extra case/trailing-dot/space/ADS variants of the protected
  five refuse. Harmless canonical/case relative controls stay inside fixture.
- Node returns ENOENT for the real trailing-dot marker on this host; the
  helper refuses file/directory trailing-dot syntax before content regardless.
  This is not a claim that every exotic synthetic name can be checked out.
- Valid synthetic dry run: exit 0, zero writes. Accepted-parent write control:
  exactly S10.json is written. PENDING/null review controls: exit 2, no writes.
  No outside write was demonstrated. The additional auth-name probe DOES
  escape the permitted read set: 12/12 standard auth paths reach Git and disk.
  All such content existed only in ports; no real auth/private file was opened.
- These finite probes do not establish race resistance against concurrent
  filesystem replacement between validation and read/write, or arbitrary
  hard-link identity. No such escape is demonstrated or claimed closed here.

## NAMED DEBTS
- D-PARENT/LOCK: accepted S9 seal and section 2.1 identities; final input and
  reconciliation tables; eight copy-lock answers, composed-product and
  coordinated-deletion proof, source closure, PM tokens, receipt and needles.
  Re-run regeneration/reconciliation at the actual parent, not these pins.
- D-SPLIT: actual-parent D-SPLIT-PARENT; re-cut/independent reconstruction,
  DOM/listener evidence; D3/D5 real eslint-scope/six scope rows, D6/D7/D9's
  21 survivors, and S-R33. Candidate identity cannot close actual-parent proof.
- D-GSS: merged machine-settings-ui red/green on both systems; physical M/R/N
  accounting and destructure-aware api.lane census. TIMER/LISTEN and accepted
  transient-input/copy limitations retain their existing payers.
- D-EPP/CR: actual R9 sensitivity, synthetic oracle and D-EPP-3 gates;
  separately authorized private gate; capture/configuration with provisioned
  PERFORMED_W6_DIR. Coach ENGINE_REVISION follows the real receipt.
- D-ACCEPTANCE: independent Claude Fable final, PM exact-byte read, complete
  Today/measure/bundle/provider/supersession/conformance/package routes and
  exact-head Windows/Linux rebuild run IDs and conclusions. Real runner
  refusal on the STOP fields is still owed, not TypeError or inferred green.
- D-REGEN-NOTES remains: S10.json's final note still calls D-EPP-4 unpaid and
  the residue row red despite their code fixes. Reconcile at final binding;
  the actual engine/platform evidence remains owed independently of that note.

## Method and what I did not verify
Fixed MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York were set on separate
lines before tests, using only the commissioned Node binary, one process at
a time. Fresh positive callbacks/source slices, closed read/child/import
ports and invented marker fixtures. One harness stop during B1 root lookup
was corrected by returning false for the synthetic ancestor candidates;
no unexpected file was accessed and that stop is not product evidence.
No protected engine execution, legacy/private gate, full Today step,
package --ci/--full, generator, real receipt/artifact writer, install, deploy
or import. No tracked-file edit, dependency change, commit, push, checkout,
reset, stash, clean or fetch. Only this new review is written in the worktree.
Fresh scratch retained: %TEMP%/astra-s10-l4-20260924 (six ASCII probe scripts,
short-path metadata, invented marker fixtures and one junction). No cleanup
attempted. No real REGEN --write or dry run against repository data was run.

Author reconciliation: the report was first opened after the blind source
review/main probes; the expanded auth-name probes followed, then its round 8
and STOPs were re-read last. Its 31/31, B6 registration and re-pin claims
agree with measurement. Its auth exclusion still omits the credential/key
names above. Larger suite, dry-run and engine claims are not adopted as my
execution evidence; the named finalization/CI debts remain open.

Final command stdout (explicit reviewed paths; verified after this file write):
`git status --porcelain -- <review file and explicit reviewed public paths>`
```text
?? rebuild/lanes/astra/reviews/S10-INTEGRATION-REVIEW-L4.md
```
`git diff --stat -- <same explicit paths>`
```text
```
