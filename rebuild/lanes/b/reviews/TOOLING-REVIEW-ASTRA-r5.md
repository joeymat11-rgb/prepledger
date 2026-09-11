# Independent tooling delta review — Astra r5

2026-09-11. VERDICT: REQUEST CHANGES. Reviewer did not build the tooling or B-NTC.
Assignment: temporary continuation ASTRA-RESUME.md, independent tooling review.

## Exact source and scope

- Reviewed candidate: 7748880701ef62246c8362c43f760ee10f86c2cc.
- Previous independently reviewed source: 477b0253d54f768103cea84983768b9a2f341761.
- Previous review report commit: 636aeaa30b6f91b5b6c2d72d1731cf0024b00f5b.
- Effective tooling delta: 636aeaa..7748880, nine files under rebuild/lanes/b/tooling;
  runner +160/-14, README, tooling report, six package specs. The difference from
  477b025 additionally includes the r4 review report itself.
- Runner SHA256: cadde14fd93d2774a12909871d75e0907bd08814b5310fe231a0ea1737d5f92f.
- Separate branch codex/astra-tooling-review, work/astra-tooling-review under the
  existing read-rebuild-t3-brief-md-and workspace. Source candidate remained unchanged.
- Runtime: Node v24.19.0, Windows. Real chain ref at review:
  refs/remotes/origin/rebuild/t2-client-core = 7b1678a4a8449053000d52a0a8e9e070f32a240e.

## Executed findings requiring changes

1. HIGH — Y1 counts an unused script argument as an executed own test.
   b-package.cjs:179,216,845,849. A bare Node script executes its FIRST positional
   file; subsequent files are application arguments. childArgv accepts multiple
   positional files, ownChildren counts any of them, and children marks that entire
   target list successful when the first file succeeds.

   Exact control: first file rebuild/m4/spec/astra-review-first.cjs contains
   `console.log('ASTRA PROBE OK\n'+'x'.repeat(240));`. Second file
   rebuild/m4/spec/astra-review-own.cjs contains
   `throw new Error('OWN TEST EXECUTED AND FAILED');` and is declared product role:new.
   Child argv is [first, second], needle ASTRA PROBE OK. Unchanged product(),
   childArgv(), children(), noRegister(), and the exact Y1 seal assertion block all
   accept. Report: NO-REGISTER OBLIGATION 1 of 1 executed; own=1, ran=true.
   The own file's exception never executes. Positive/negative discrimination:
   [second] refuses Required child; ['--test', first, second] also refuses Required
   child because Node test mode actually executes both files. A directly executed
   passing own file is accepted. An empty execution map refuses
   NO-REGISTER-PACKAGE-OWN-CHILD-DID-NOT-EXECUTE.

   Required fix: derive executable files according to Node command mode throughout
   ownership, pinning, moves and inherited coverage. For bare scripts, rejecting
   additional positional files is the narrowest rule. Preserve multiple explicitly
   executed files in --test mode. Regression controls must distinguish these modes.

2. HIGH — the same argument confusion lets inherited assertions disappear.
   b-package.cjs:737 (pre-existing logic newly relevant to Y1). In a cloned in-memory
   B-NTC spec, keep all five inherited child names and the exact nine-gate inherited
   map; set each argv to [first, ...originalFileArguments] and needle ASTRA PROBE OK.
   children executes only the first control script five times. coverage returns 9
   originals covered because each unused trailing original is parent-pinned.
   No inherited assertion executes in this synthetic control. The execution-target
   correction in finding 1 must also close this route. This does NOT claim that any
   currently declared real candidate child skipped tests, or that a full package
   PASS/authorized envelope was obtained; it demonstrates an accepted forged
   execution-evidence shape before the unchanged independent authority boundary.

3. MEDIUM — parent PRODUCT files can still be labelled new.
   b-package.cjs:526-528. Changing only plan.cjs's role from carried to new passes
   product() with unchanged parent bytes. The new ownChildren comment claims new is
   refused for ANY parent pin; only the executionPins branch enforces that. Reject
   role:new for parent product pins too. The new execution-pin checks themselves
   work: rebuild.yml with correct superseded-by-child/pre is accepted; role:new
   refuses PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED; altered pre refuses
   UNLISTED-PRODUCT-DRIFT pre-image is not the parent execution pin.

## Other focused controls and package blockers

- Y2 ACCEPT for the tested change. Genuine NATIVE-CARRIERS parent binds. Claiming
  genuine LOAD-WRITES instead refuses SINGLE-PARENT-CHAIN-SEALED because the real
  chain's acceptance-native-carriers.json already names it as parent. B-LOM claiming
  NATIVE-CARRIERS refuses SINGLE-PARENT-CHAIN on both disk and Git-at-HEAD. An
  in-memory filesystem overlay clearing B-NTC's chosen parent only for disk reads
  still refuses on the Git-at-HEAD sibling. No fake artifact, receipt or chain ref
  was created to test these cases.
- Missing own tests produce the intended CI-blocking open obligation. The exact Y1
  seal assertion block refuses NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT
  for the shipped five inherited children and zero own children. Its execution-map
  check also refuses a declared own child absent from the map. Finding 1 shows why
  these checks do not yet establish actual own-code execution.
- CHILD_ROOTS is unchanged at five roots. A real workout/test file is admitted;
  real rebuild/m3/w6/host/test/journey.test.mjs and
  rebuild/m3/w7-preview/today/test/gym.test.mjs both refuse CHILD-ARGV-TARGET.
  The intended B-NTC host/Today test declarations need narrowly reviewed roots or
  real assertion-preserving wrappers. Broader directory exemptions are unnecessary.
- MOVES_RULING remains null and coverage.moves must remain empty at 7748880.
  ASTRA-RESUME grants successor wrappers in principle, but this source cannot seal
  their changed mappings. Exact mapping and executed replacement evidence need
  separate review and the PM ledger entry required by that assignment. Execution-pin
  supersession alone is not permission to retire inherited assertions.

## Method, retained proof and limits

19 bounded controls were executed in the final probe run. The reviewer harness
loads the unchanged runner source up to its main-sequence delimiter and appends
function exports; it calls real source functions and spawns actual Node processes.
The source Y1 seal assertion block is extracted byte-for-byte and executed directly,
without constructing an ACCEPTED review or bypassing a real authority check. This is
focused component evidence, not a claim to have run the full acceptance envelope.
The disk-release Y2 control substitutes only the sibling's disk read in memory;
Git reads still use the real HEAD and real chain ref. Two public synthetic script
fixtures were created only in this review worktree, then removed in finally. No
existing candidate tooling, product, test, law or shared STATUS file was modified.

Local reproducibility: Node executable
C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
running .tmp/astra-review/probe.cjs in this worktree; output .tmp/astra-review/probe.log.
These ignored local review aids are not part of the product or committed report.

r4's unaffected source/receipt ancestry, exact-artifact envelope, X1/X2 and frozen
gate evidence are retained as attributed prior evidence, not re-executed claims.
git diff 477b025 7748880 is empty for rebuild/conform, rebuild/engine and rebuild/m4/spec.
No 50-run repetition, full package campaign, private-input access, dependency install,
push, merge, deployment or fake accepted receipt was performed. No POSTFIX PACKAGE
PASS is claimed. Private preparation, real --full execution and formal acceptance
remain the authorized engine-package/integrator obligations described by r4.

Next validation after an independent builder fixes the runner: rerun the two Node
mode controls, the inherited trailing-argument control, the parent-role control,
and positive/negative intended-root cases on the exact corrected runner. Then review
the actual B-NTC successor mappings and required test declarations at their final
candidate commit before a formal seal.
