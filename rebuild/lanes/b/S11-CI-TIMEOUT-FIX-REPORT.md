# S11 CI timeout fix (rebuild-public 30 -> 60), D-TM-1 comment, line count kept

Tree: C:\Users\joeym\AppData\Local\Temp\earned-s11int, branch rebuild/b-s11-integration, HEAD d7b4cc2. Uncommitted edit only.
`git status --porcelain` = ` M .github/workflows/rebuild.yml` (nothing else).

## Diff (git diff; touches only :25-28)
```
index d92305c..1304747 100644
@@ -22,10 +22,10 @@ jobs:
-    # Raised from 15 with the 2026-09-11 CI re-seal: the native-carriers package now
-    # actually completes (it used to die in ~1 min at the `focused` child), and six new
-    # suites plus two pnpm installs run alongside it on both runners.
-    timeout-minutes: 30
+    # Raised 15 -> 30 at the 2026-09-11 re-seal (native-carriers package now runs to completion), then
+    # 30 -> 60 at the S11 CI-2 STOP (2026-10-03): windows ran 29.3-29.5 min and was cancelled twice at 30;
+    # the 39 S11 children alone take ~20 min on windows (T5b run 37108132701).
+    timeout-minutes: 60
```
LF (0 CR), ASCII, 4-space indent; 48685 -> 48731 bytes; line count unchanged (584), `timeout-minutes: 60` on :28, `timeout-minutes: 10` still on :572.

## sha256 of .github/workflows/rebuild.yml
- OLD (HEAD blob d92305c): 0c861be9d3d0f448676e699094141ed14f33abf9962a1d8fed0c7fa7121bb9d6
- NEW (working tree, blob 1304747): 10177a0fc37a35038b12a496fae2e3799464195cfb76d567d1ea197685670b17
- Superseded interims (never pin): 009174b1... (value only), df020f15... (+3 comment lines).

## Consumers (git grep, private/src/ledger/soak/app.js excluded)
Pins of OLD sha 0c861be9: NEED RE-PIN by PM REGEN to 10177a0f... (not edited by me):
- rebuild/lanes/b/tooling/packages/S11.json:50 product[rebuild.yml].post
- rebuild/m4/spec/acceptance-s11-native-load.json:203 product[rebuild.yml].post (specSha256 / artifactSha256 / envelope chain follow)
- rebuild/lanes/b/tooling/receipts/S11.json:12 sealedRun.product[rebuild.yml]
- Until then CI step 13 (`b-package.cjs --ci --package S11`) refuses the rebuild.yml product pin. S11-REGEN.cjs:78 SCOPE admits rebuild.yml.
- Prose quoting 0c861be9 (no gate): S11-SEAL-RUNBOOK.md:33 (also says 584 lines: still true), S11-NATIVE-LOAD-BRIEF.md:25,143. Line anchors stay valid.
- Older S3..S10/H3/B-NTC/B1/B2 files pin their own historic shas: no change.
Readers of `timeout-minutes`: NO CHANGE. shared-preflight-ci-registration.test.cjs:57,60 bounds 1..20 only for shared-preflight.yml's job. Nothing bounds rebuild-public. The removed comment text is not quoted by any test (grep of its phrases: prose docs only).
Tests parsing rebuild.yml text (fence, pack-pin, release-object, engine-revision, h3-clean-init, pwa workflow, production-mapping/-admission): match by step path / `--package` / condition, not by line. NO CHANGE.

## Line-number / anchor readers in the S11 runner and tests (rebuild/lanes/b/tooling, S11-REGEN*, b-package.cjs)
- `.github/workflows/s11-observe.yml` does not exist in this tree (ls-files: deploy, prod-check, rebuild, shared-preflight, slice-host, soak).
- b-package.cjs:524 comment `(rebuild.yml:127)`: comment only, not code; unaffected (no line moved).
- S11-REGEN.cjs:78 names rebuild.yml in SCOPE by path only; S11-REGEN.test.cjs:291-299,351-366 use synthetic bytes.
- No code in scope indexes rebuild.yml by line number (grep `yml[N]`, `.yml:N`, `split()[N]`, `slice(N,M)`: all hits are sha/string slices).

## Tests run on the final bytes (node <file>; MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, git on PATH)
- shared-preflight-ci-registration 22/22; engine-revision 6/6; slice/pwa workflow 8/8; h3-clean-init 14/14
- release-object 14/14; pack-pin 74/74; sealed-inventory-fence 62/62. fail 0 everywhere (same on both interim versions).
- production-mapping/-admission not run (load rebuild/engine/oracle-shim.cjs); production-admission ran once in an early pass before this was noticed.

## Risk
- Pending REGEN only: S11 package --ci fails on the rebuild.yml post pin until S11.json / acceptance-s11 / receipt carry 10177a0f....
- 60 min doubles worst-case runner burn on a hang; observed ~29.5 min gives ~2x headroom.
