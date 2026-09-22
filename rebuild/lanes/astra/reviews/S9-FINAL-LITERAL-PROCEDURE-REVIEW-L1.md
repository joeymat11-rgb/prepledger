# S9 final literal procedure and PRE helper review
Verdict: ACCEPT the bounded public PRE measurement and two-cell verification route.
STATIC review only; no helper/module/test was executed and no literal was edited here.
PRE_HEAD: 8a8f39227eddef224713c36d955c7bcb662938be, independently observed clean.
S9 spec stays PROPOSED; no authority, final seal, or full-package acceptance is granted.

Frozen procedure S9-FINAL-LITERAL-PROCEDURE.md SHA256:
095a366e9c439dd955036b78ab6d494918055517adb5c806bc34acac1efe5b09
Approved helper S9-APPROVED-FINAL-MEASURE.cjs SHA256:
095720f58071966b75e0421323c91e23f9906216f9cbd3268dc9a7c15fe05cce
Both are under %TEMP%/earned-s9-spec-proposal.
PRE pack helper %TEMP%/earned-s9-pack-working-preflight-8a8f392-pre.cjs SHA256:
6efebe7ecb83b477e3372c78cacc18bd8f765693fd4a202d4b5ee99bb6c37fb4
Reverse three replacements exactly reproduces retained helper SHA256:
564579706ff25fb5b20614b59e8047d25e68e0a46d3731e44503c0a62634c984
The three changes are expected HEAD, fresh PRE output name, and exclusive wx creation.
Original helper/evidence are preserved; separate reviewed FINAL copy/output remains required.
Approved stdout now uses phase/head-qualified Out-File -NoClobber and checks native exit code.

Module and read containment:
Approved helper obtains names from actual design.APPROVED; it discards that object's digests.
Exact ordered expected names are the two 09-08 approved HTML paths; no 09-18 promotion occurs.
Component case/lstat checks reject links; final entries must be regular files and 100644 Git blobs.
Raw disk bytes must reproduce committed blob identities before their SHA256 is emitted.
The helper's data/code read set is design.cjs, plain-copy.cjs and those two public HTML files.
Module loading executes only builtin imports, declarations/constants and export assignments.
Design's other file readers, including headlineVocabulary's engine walk, are never called.
Plain-copy has no imported dependency or module-load file/network/process effect.
Helper subprocesses are read-only Git; its only explicit output is two-name/two-row JSON.
Design SHA256: 9653bed81eaad9e166a55b436accd5344c0108464260b471c9a5e09ba2263f8d
Plain-copy SHA256: a9a675061f3bc9fa791fb724b8ef111aa2a0ae45c363afd1c13ff70f9d641a73
Both source hashes match raw committed bytes at PRE_HEAD.

Cell effects and permitted focused commands:
Pack cell imports only builtins; approved cell additionally loads the two reviewed public modules.
Real rows read the pack and two approved references; pack workflow checks read public rebuild.yml.
Other callbacks use disposable temporary fixtures, links and restored fs monkeypatches.
Windows whoami/icacls calls change only those temporary fixture ACLs and restore deny entries.
No engine, fence, package runner, browser, private fixture or third-party dependency is imported.
Pre-red: pinned Node --test --test-reporter=tap --test-name-pattern=^REAL ROW: plus both cell paths.
Quote the pattern as one argument, place it before paths, and require both expected real-row reds.
Post: pinned Node --test --test-reporter=tap plus those same two paths, with no callback filter.
Paths: rebuild/lanes/c/ui-port/pack-pin.test.mjs and approved-pin.test.mjs in that directory.
Pack source SHA256: 0bf656950e277a1d25c2c79257c0b01c2ef44e1ef710b527b0bb2094e6c2d4ff
Approved source SHA256: 231e7332b66d2b0e103d6cdbc367f471255dfbb2f5cd16e7ccf1abbc8c1b618b
Both source hashes match raw committed bytes; no callbacks ran during this review.

Only each LITERAL placeholder comment may be replaced; every outside byte must remain unchanged.
The PRE pack tree is 3acba82531c863f0c3add26cbff7bdd2b3c2afef by Git metadata.
1331 rows/platform counts and approved digests still require actual PRE/FINAL measurements.
Final helper delta, literal-only diff, equal PRE/FINAL manifests and full TAP remain review inputs.
Do not treat this procedure's later package/CI sentence as clearance of those broader effects.
Exact-head both-OS execution and final independent acceptance remain owed.
