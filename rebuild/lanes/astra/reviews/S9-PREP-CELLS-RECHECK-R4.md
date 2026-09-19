# S9-PREP-CELLS narrow re-check R4
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; narrow re-check
Head reviewed: 01b88efeb92435d818f672d3ed43521719a5961e
Test SHA256 (certutil): adfda4d9f4146ecb1a20490df34ec3ca15ea95c563ddd545010c6aa0682ff297

VERDICT: REJECT. A case-only inventory rename produces wrong Windows PASS/SKIP results.
Three additional, non-equivalent mutations of the changed expression survive all 37 fixture rows.

R3 BLOCKING-1: FIXED. Replace the option-null return with
`return out("skip", [], { ...here, reason: "ASTRA MUTANT stand aside" });`:
only (20) becomes newly red, with `parent is null: it SKIPPED: "ASTRA MUTANT stand aside"`.
R3 BLOCKING-2: FIXED for the rejected worlds. Restore the exact baseArtifact/carriedAtBase
block from 814d593b: only (21), (22), (23) become newly red. Widen the predicate to
`t.path.startsWith(SPEC_DIR)`: only (23) becomes newly red. No protected row changes color.
M29: FIXED. `catch { spec = {}; }` makes only (8a) newly red, reporting the key-closure
sentence about a body that is not JSON.
M43: FIXED. Removing idsOf's word boundary makes exactly (8e), (8f), (8h), (8i), (17)
newly red. The existing reordered stub passes unchanged.

Own finding 1 - BLOCKING: a case-only rename hides a deleted Git inventory path on Windows
All fixtures below use the shipped helpers and exact fence() bytes. Abbreviations:
L = rebuild/m4/spec/acceptance-s8-fixture.json
N = rebuild/m4/spec/acceptance-s9-fixture.json
U = rebuild/m4/spec/ACCEPTANCE-S8-FIXTURE.JSON
APP/CSS/TEMPLATE/RUNNER/PACKAGES retain the test file's literal values.

Exact fixture:
```
const root = chain({product:[APP,CSS]});
git(root,['mv',FIX_ART,SPEC_DIR+'temporary-case-hop.json']);
git(root,['mv',SPEC_DIR+'temporary-case-hop.json',SPEC_DIR+'ACCEPTANCE-S8-FIXTURE.JSON']);
commit(root,'case-only rename away');
fence(root,CHAIN_REF);
child(root,{alsoTouch:{[APP]:'sealed edit\n'}});
fence(root,CHAIN_REF);
```
Measured output fields, first call: status="pass", refusals=[], touched=2.
Diff: R100<TAB>L<TAB>U. HEAD:L is absent, but fsBytes(L) returns U's equal bytes.
Second call: status="skip", refusals=[], touched=5. Its diff additionally contains
M RUNNER, A PACKAGES/S9.json, M APP. This is an otherwise verified child.
Expected: FAIL with `FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s8-fixture.json`;
the child's refusal list must also contain `FENCE-SEALED-PATH-TOUCHED M ` + APP.
The ordinary non-case rename-away control DOES produce that inventory refusal.
This loses the inventory diagnostic and admits the claim; other seal gates were not assessed.
Smallest fix I see: within the artifact-touch guard, verify exact Git-path presence at
HEAD; treat its absence as tampering even when fsBytes resolves a casing alias. Retain
the worktree-byte comparison. Add both case-rename rows. No proposed fix was applied.
Linux inference: L does not resolve to U, so the current code should FAIL both worlds
with the inventory refusal (plus APP for the child). The PM must execute that half.

Own finding 2 - BLOCKING: three changed-clause mutations have no detecting row
Each substitution below was made alone against pristine code. Each full run measured
38 tests / 37 pass / 1 fail, exit 1; only THE REAL ROW failed. Thus every fixture row
stayed green. Separate executable witnesses establish that these are NOT equivalent mutants.

X7: replace `t.path === artifactPath` with
`t.path === artifactPath && t.renamedFrom === undefined` in the new touched.some predicate.
Exact witness: start chain({product:[APP,CSS]}). Commit staged-inventory.json containing
inventory({packageId:'M2-S9-FIXTURE',lanePackage:'S9',product:[],released:[APP,CSS]}).
Advance CHAIN_REF to that commit. On chainline, add N containing
inventory({packageId:'M2-S9-FIXTURE',lanePackage:'S9',product:[APP,CSS]}), commit, advance
CHAIN_REF, return to main. git mv staged-inventory.json N; commit. Measured R100, touched=2.
Shipped output: status="fail", refusals=["FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s9-fixture.json"].
X7 output: status="pass", refusals=[]. Smallest fix: add this rename-INTO-inventory row;
keep exact-path detection over both ends of the rename. The shipped predicate is correct here.

X9: replace `!worktree.equals(chainBytes)` with
`JSON.stringify(JSON.parse(worktree)) !== JSON.stringify(JSON.parse(chainBytes))`.
Exact witness: chain({product:[APP,CSS]}); read HEAD:L; append one LF byte; commit.
Shipped output: status="fail", refusals=["FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s8-fixture.json"], touched=1.
X9 output: status="pass", refusals=[], touched=1.
Smallest fix: add a whitespace-only artifact-edit row asserting the named refusal.
The current byte comparison is correct; no row protects it against semantic JSON equality.

X8: replace `t.path === artifactPath` with
`t.path.toLowerCase() === artifactPath.toLowerCase()`.
Exact witness: chain({product:[APP,CSS]}); add uppercase ACCEPTANCE-S9-FIXTURE.JSON with
inventory({packageId:'M2-S9-FIXTURE',lanePackage:'S9',product:[APP,CSS]}); commit.
On chainline rename that uppercase path via temporary-case-hop.json to N, commit and
advance CHAIN_REF; return to main. Edit only the uppercase path to inventory with the
same packageId/lanePackage, product:[], released:[APP,CSS]; commit.
Shipped output: status="pass", refusals=[], touched=1.
X8 output: status="fail", refusals=["FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s9-fixture.json"], touched=1.
The branch diff never touches N. Smallest fix: add this exact-path control beside (23).
Linux inference: shipped also PASS; X8 also FAIL (canonical worktree path absent).

Nine additional mutations, all inside the two changed tampered-expression lines
| ID | Substitution | Newly red fixture rows |
|---|---|---|
| X1 | touched.some -> touched.every | (6),(6b),(6c),(17),(19),(21),(22),(23) |
| X2 | entire touched.some predicate -> true | (8g),(19),(23) |
| X3 | entire touched.some predicate -> false | (6),(6b),(6c),(17),(19),(21),(22),(23) |
| X4 | outer && -> outer OR | (8g),(19),(23) |
| X5 | remove worktree===null OR limb | (6c),(19) |
| X6 | remove bytes-differ OR limb | (6),(6b),(17),(21),(22),(23) |
| X7 | ignore renamedFrom destinations | NONE; 37/37 fixture rows green |
| X8 | case-fold artifact-path equality | NONE; 37/37 fixture rows green |
| X9 | semantic JSON equality | NONE; 37/37 fixture rows green |
Together with the five requested mutations: 14 substitutions, 11 detected, 3 survivors.

Other own probes on the shipped code
| Exact fixture operation | Output | Assessment under DECISIONS:570 |
|---|---|---|
| chain({product:[APP,CSS]}); git mv L to spec/moved-away.json; commit | fail, named inventory refusal, touched=2 | Correct |
| X7 world, but staged bytes equal chain's N | pass, refusals=[], touched=2 | Correct byte-equal rename into place |
| chain({product:[APP,CSS]}); update-index --chmod=+x L; commit directly | pass, refusals=[], touched=1 | Equal bytes; mode-only touch |
| Same mode hunk after chainline re-seals L with packageId M2-S8-V2 | fail, named inventory refusal, touched=1 | Stale bytes plus path touch, as ruled |
| Commit widened L, then commit exact original bytes | pass, refusals=[], touched=0, diff=[] | Net diff, not historical touches |
| From common A, main edits TEMPLATE; chainline adds N; main merges CHAIN_REF --no-ff | pass, refusals=[], touched=1 | Only TEMPLATE remains in merge-base diff |
| Same merge fixture, chainline re-seals L instead | pass, refusals=[], touched=1 | Same correct result |
No other wrong shipped answer was reproduced in these probes.

Scope, baseline and execution method
- git diff --name-status 814d593b HEAD: exactly M test file and M author report.
  The report also updates earlier counts/header/13.10; its diff is not confined to section 14.
- Raw Buffer comparisons of whole test registrations through closing `});`: (6), (6b),
  (6c), (8g), (17), (19) byte-identical to 814d593b. unverified() also byte-identical.
- Actual PC baseline: 38 tests, 37 pass, 1 fail, exit 1, 36.385 s. Red row:
  `THE REAL ROW - this branch touched no sealed path the chain has not released`.
- It prints 9 FENCE-SEALED-PATH-TOUCHED M refusals, exactly the nine paths in report 14.7;
  artifact acceptance-s8-real-shape.json; chain 2d71dd049b1b25ca7645cdbd50ff38d70694e159.
- DECISIONS:569/:570 read with long lines split from that existing remote-tracking ref
  (572 lines). HEAD's DECISIONS has only 548 lines. No fetch performed.
- Node used exclusively: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
- Every run inherited these separate .cmd lines:
```
set "MEASURED_TEST_NOW=2026-09-03"
set "TZ=America/New_York"
```
- Actual command: node --test --test-reporter=tap rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs,
  with the absolute Node path above. Scratch preserves the relative layout and copied workflow
  for (18). All mutations start from pristine bytes. Required-run REAL had no scratch chain;
  it is excluded from deltas. Extra-run REAL points to the actual worktree and stays design-red.
  All 37 other registrations run; the scratch control measured 37/37 green.
- Own probes use exact fence/helpers with original test registrations removed; only synthetic
  repositories are modified. Fixtures use the test's cleanup hook; scratch cleanup was blocked.

Section 14 reconciliation
- Reproduced: code-head 6b3e6fb has exactly this test hash; base hash starts d3b57a3d;
  two-file scope, unchanged protected rows/helper, baseline counts, M29/M43 row sets,
  old-form/directory mutants, ASCII test bytes, and all nine actual Windows refusal paths.
- 14.10(1), "worktree is null" when the artifact is renamed away, is false on this PC
  for a case-only rename. The resulting general tamper claim fails as finding 1 shows.
- 14.4's "ONLY survivors" and footer's three-survivor conclusion need an explicit boundary
  to the author's declared sample: X7/X8/X9 additionally survive and are non-equivalent.
  I did not re-run all 52; their reported 52/49/3 sample count is not itself disproved.
- 14.5 arithmetic does not reconcile: 16 entries shown leaves 36 of 52, not "other 37".
  Counting the three P-F1 controls plus N7-M separately would leave 40, still not 37.
- 14.6's statement that all four new fixture worlds use git checkout -b is not literal:
  row (20) uses chain()/child() without that operation and contains four parent variants;
  (21)/(22) have one world each and (23) two. Four new ROWS, eight fixture repositories.
- My Windows elapsed time is 36.385 s, not 37.6 s; timing variation is not a correctness defect.
- No other contradiction reproduced in the portion executed/read. Historical commit-run
  counts, the complete sweep, other suites and Linux claims remain unverified, not refuted.

What I did not verify
- The Linux half is run by the PM in the cloud farm. Every Linux statement here is inference.
- Historical red-first runs, full 52-mutant sweep, sibling suites, hosted CI, real S9 reseal
  skip, or other seal gates. This review covers the requested test/fix round only.
- No private/protected data, auth files, protected soak, dependency changes, seal generators,
  receipt/artifact writers, --full, shared-repository Git mutations, commits or pushes.
- No tracked file was edited. No proposed production/test fix was applied.
- Scratch deletion was rejected by automatic approval review after absolute-target validation;
  both native PowerShell attempts were refused with the stated reason: blocked by policy.
  Retained synthetic scratch: C:\Users\joeym\AppData\Local\Temp\astra-s9-r4-9361a5c54b8a4f7890906db07b0d70f6
