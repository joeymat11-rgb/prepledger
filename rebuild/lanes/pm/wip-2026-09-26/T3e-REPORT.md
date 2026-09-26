# S11 T3e REPORT - runner and workflow hunks (BUILDER, Opus 5.5 subagent, 2026-09-26 04:30-05:05)

Plan of record: S11 brief DRAFT rev5 (0b851be6) sections 2.1 (FC13, FENCE), 4, 5.1, 11 T3e; Fable l3 ACCEPT WITH NAMED DEBTS.
Worktree C:\Users\joeym\AppData\Local\Temp\earned-s11-t3e, detached HEAD 9288adfc782a10ea4d3de098723955db9515f3b6, status clean on every T3e path before the first byte.
Scratch C:\Users\joeym\AppData\Local\Temp\s11-t3e-scratch (cmd files, two static witnesses, TAP/log outputs in out\, before.txt/after.txt hash lists).
Nothing committed, staged, fetched, checked out or restored. No b-package.cjs run, no exporter, no receipt, no protected-five read or load (guard log %TEMP%\s10-t4-guard.log: 56 lines before and after, 0 lines for any s11-t3e-* job). Every node run through pm-run.cjs shared, ONE slot at a time (slot 3 each time), MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, guard preload, NODE_PATH as run5.ps1. No trigger line of any workflow added, removed or reordered (rebuild.yml :3-8 on: block unchanged); no soak path read or listed (every git grep excluded **/*soak*).

## 1. What changed (sha256 before -> after, bytes; all LF, 0 CR; 0 added non-ASCII lines)

| path | before | after | +/- |
|---|---|---|---|
| .github/workflows/rebuild.yml | cdc90cf8e9dfa97b9bc685e5f99886e52ff4749391b3a0f58c07f79eb3710edb (44750) | 9cf805445866e180b0862f848ba58558bcc3ab4c4f311aa1374b6784663212cf (46294) | +20 -2 |
| rebuild/lanes/b/tooling/b-package.cjs | 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c (316207) | bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3 (317089) | +13 -2 |
| rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs | 6981b1964c0ff68193ed70ba23517bd54f6e89ba8dcf905d84fed3ed2dfb0370 (42943) | c98be22a16bfe5733855f4518243609b1adfb31c96a5490c9e0ab16ae03bb95d (43749) | +14 -5 |
| rebuild/m3/w7-preview/measure/test/boundary.test.mjs | c649d0cfc44eaf9b7ac9d127542f7592507233995f7c6c708fe9ef4bf2ee3313 (25602) | 4a0493ff78a7459f72b5c52a7735cd340d8808df66e0c527bf14e091bba0513f (26322) | +9 -1 |
| rebuild/m3/w7-preview/today/test/food.test.mjs | a7ed0609c345f722cf50706db4699980e5a33b820c502157716a1c905871af01 (69747) | 11cec2c04d91b46aece2b853028d419d70d884812cd383f1f26666b71d59436e (70467) | +9 -1 |
| rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs | e45bce7c44b42cc00f961530fe660858dba7849f9a8bb1d3d74fa21e24bf69e7 (92764) | 2fd9231d5a5d8f90e6c059c5508bd2ac51b0fef15454c6f08561a26a2ae46362 (93484) | +9 -1 |
| rebuild/m3/w7-preview/today/test/problem.test.mjs | 5fe767e02937745f22700316f8950af932977d05085ba09fe78fd068f2b1cbd8 (215071) | 598ef752de213a49bf89494f8dbccc4d9be7a395fb42506a41c50b951b769557 (215791) | +9 -1 |
| rebuild/m3/w7-preview/today/test/setup.test.mjs | e43ed642e8f3dc3ce6606a5b256064938ed3fc6d2b278f7b11a4b01ed26fdc32 (139208) | c0562fd5608cf2ac046e158727036cb8d65376f2fff5597c6c735a03a270a366 (139928) | +9 -1 |
| rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs | b1afad55b231210357da6cdcc5ada91f90ad7ceba719fc6ebab5a346f6d8769a (128174) | eb9ed230c2d1c50b78100d15ed55a28478807dd8c36937e7d636cabe643f5671 (129193) | +12 -0 |
| rebuild/lanes/b/tooling/packages/H3.json | 922a9b33b984c5e666981390072db488a40d138d03789f07b5f1281e59a820ff | bd187facbb05c04bfdb376fb0b9d8159bc9f197c9f0041af3ee1d3d98196d5dc (35228) | 1/1 |
| rebuild/lanes/b/tooling/packages/S3.json | 34bb094b138b5970bb946cfcbf8144552807b6c6e5642410ec484f47f63ffc53 | 2fcee0ce340de5d14d33605a2f3c2c17f509c693409bf7a20f544f6ac7b16a59 (38502) | 1/1 |
| rebuild/lanes/b/tooling/packages/S4.json | 3c7c9764a046bf3863702370e7a22ab53cba02d54066af73dd49de606075f6d4 | ee0bfaa3348e9cf5d596c637bcaaf36c2ec12bc9e60ecdb7ebfaef2f874f037a (42919) | 1/1 |
| rebuild/lanes/b/tooling/packages/S5.json | 978ca0afa70a9a05dfea0a24e072d4b77f6879e034b665f1bc098b0c9e31df76 | a12921f6802288e1e8ff43b4080f97df75c9305808a6eeb994b7527c317daa7c (51187) | 1/1 |
| rebuild/lanes/b/tooling/packages/S6.json | 76ec2659e3092a43c2605822bf0571f4fd1b43a581de5ff4cb572141ce3dc98e | 7a2e9970b5e2cf0c36b888f4b4de34a2c60dd9b68385eb59416498407abd58a7 (84803) | 1/1 |
| rebuild/lanes/b/tooling/packages/S7.json | 3703543a485a7ecafb4bbd1a7ddce4e02af36283108be9dc4e76f1c259916967 | 3613ebf4f647485503e1ef6d2f96c49a9b8ba97f09cd3086f865693d58074931 (83449) | 1/1 |
| rebuild/lanes/b/tooling/packages/S8.json | 1da6ef28bdcad8c3760efcf99f3a1a858b857638b4303c8bf135ebd7fbdf9c4f | 4878b448337daf05529cd78d1011ff53c7e0e735fa470c7d35f91ab195cca789 (88184) | 1/1 |
| rebuild/lanes/b/tooling/packages/S9.json | a66530aaccbd7fc463ab27e32cabfc729045ec97d900de1b45320673ec3d29b8 | a1f280444757e0994a85591cc1092197546ffce6e02a77997aff19511f464ea2 (91741) | 1/1 |
| rebuild/lanes/b/tooling/packages/S10.json | 0f55a704968f89b984c976e3ab07d105f1b1461296c13b7ddf2382ae4fdb7308 (107310, the SEALED bytes: blob bbfe0002 = edb8381 = 71cf143, MEASURED) | 566539de9e20b6eaf22a9bbca7aebcd6679540ac47d67c1b5400936b57a07ea3 (107310) | 1/1 |

Hunks, exactly:
- b-package.cjs: TWO hunks only. :187 IDS (was :181) gains 'S11' after 'S10' (+6 comment lines above it); :344 NO_REGISTER_IDS (was :333) gains 'S11' after 'S10' (+5 comment lines). No CHILD_ROOTS hunk, no other byte. Runner post = bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3.
- pinned-unchanged test (the four literal cells): :273 IDS deepEqual +'S11'; :304-305 IDS.slice(0, 15) and IDS.length 15 (were :299-300, 14/14); :346-347 sorted NO_REGISTER_IDS +'S11' after 'S10', size 11 (were :337-338, 10). Comment lines added, no assertion removed or loosened.
- five CHILD_SPECS cells: 'S11' appended as youngest (boundary :156, food :858, machine-settings-ui :780, problem :1640, setup :2381) with one 8-line comment block each; declaredPost/releaseAccounts bodies untouched.
- rebuild.yml (FC13): standing step :185-186 -> name "Cumulative S11 NATIVE-LOAD reseal, S10 Today split, S9 UI pins, ..." and `run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package S11` (+12 comment lines, S10 paragraph shape); FC12 step :217-219 gains `if: ${{ !cancelled() }}` (+5 comment lines); Today line (:283) already carries native-load-panel.test.mjs (MEASURED, unchanged); W6 step (:423-424, was :405-406 @3365c83) NOT touched: STOP-S11-W6ADM (section 4).
- fence: new row "S11 P-S9-3 (36) - the NATIVE-LOAD FC12 step exists and carries the not-cancelled condition" (:1826), assertNotCancelled on rebuild/m4/spec/native-load-options.test.cjs, with its comment. No row (37) (waits on STOP-S11-W6ADM).
- nine ancestor specs, LAST: tooling.runnerSha256 9fbfdd2d... -> bdbb8a93... only (one line each; each file held exactly one "runnerSha256" key, MEASURED; S10.json's product pin of b-package.cjs, post 9fbfdd2d, is S10's own record and left as is, as S10 left S9's).

## 2. Red-first witnesses (order of the bytes; every red observed before its fix; outputs in s11-t3e-scratch\out\)

BASELINE at the unmodified 9288adf bytes (job s11-t3e-base): pinned-unchanged 17/17 green; fence 57/58, the one red being THE REAL ROW (see 5.3), which is pre-existing and not a T3e byte.

W1. The four literal runner cells (pinned-unchanged-and-ruled-substitutions.test.cjs, test F6), red against the S10 runner, then green after each hunk:
- RED 1 (job s11-t3e-red1; test cells expecting S11, runner still 9fbfdd2d): `not ok 12 - F6 ... IDS carries the order DECISIONS:124 rules ...` with `Expected values to be strictly deep-equal: ... 'S10', -   'S11', 'B1'` at the :273 cell. 16/17. (out\red1-pinned.tap)
- RED 3 (job s11-t3e-red3; IDS hunk only): the :273 and :304-305 IDS cells pass; F6 now fails at the NO_REGISTER_IDS cell: `'H3', 'S10', -   'S11', 'S3'`. 16/17. (out\red3-pinned.tap)
- GREEN 1 (job s11-t3e-green1; both hunks): `ok 12 - F6 ...`, `# tests 17 # pass 17 # fail 0`. FINAL re-run (job s11-t3e-final, after the re-pins): 17/17.

W2. Standing step vs the runner's argv gate (scratch standing-witness.cjs: reads the rebuild.yml standing line and the runner's `IDS = [...]` literal AS TEXT and evaluates b-package.cjs:690's IDS.includes(args[2]); runs nothing of the repository):
- RED 2 (job s11-t3e-red2; standing step already --package S11, runner still 9fbfdd2d): `RED argv gate: S11 is not in the runner IDS (b-package.cjs:690 would refuse B PACKAGE USAGE REFUSED)`, standing-red=1.
- GREEN (red3, green1, final): `STANDING id=S11 ...`, `standing-red=0`.

W3. Fence row (36) (sealed-inventory-fence.test.mjs, child sealed-inventory-fence):
- RED 4 (job s11-t3e-red4; row added, FC12 step still without if:): `not ok 56 - S11 P-S9-3 (36) - the NATIVE-LOAD FC12 step exists and carries the not-cancelled condition` / `rebuild/m4/spec/native-load-options.test.cjs's step must carry exactly one step-level `if:`: - name: NATIVE-LOAD ... (FC12) / run: node --test rebuild/m4/spec/native-load-options.test.cjs / ... 0 !== 1`. 57/59.
- GREEN 2 (job s11-t3e-green2; `if: ${{ !cancelled() }}` added): `ok 56 - S11 P-S9-3 (36) ...`; 58/59. FINAL: 58/59, `ok 56`, and rows (18), (30)-(35), P-S9-5 (32) unchanged green.

W4. The five CHILD_SPECS cells (scratch childspecs-witness.cjs: reads each cell's own `const CHILD_SPECS = [...]` literal AS TEXT and walks the declaring-spec chain exactly as that file's declaredPost / releaseAccounts do, over the real packages/*.json, for the two guards the cells assert: setup 're-pin' (every B-NTC pin that moved stands at a declared post; the same rule food N1.18, machine-settings-ui S10 and problem N2-08 apply to today-bindings.mjs and local-today-journey.test.mjs) and boundary P-MEASURE (g) (every S4 pin that moved stands at a declared post or a release). It loads no test file and no product module; it never hashes the protected five, src/, conform/private, ledger/ or *soak* paths (10 such pins skipped by name, 5 in B-NTC.json and 5 in S4.json)):
- RED (job s11-t3e-red1, chains ending 'S10'): `CHILDSPECS-WITNESS before TOTAL-UNDECLARED-NON-OWN 55 RED` = 11 per cell x 5: B-NTC pins progression.cjs disk 84ca3e53 declared 7031838d, writers.cjs 8ab1387c/67033f9f, m4/workout/engine-runtime.cjs b9a655ab/95d0c675, today-bindings.mjs 91aa980f/23c11797, engine-runtime-host.cjs 06bce58c/836a369d; S4 pins the same five plus today-entry.mjs 169d5658/8b169758.
- GREEN (job s11-t3e-green3, and again at final, chains ending 'S11'): `CHILDSPECS-WITNESS after TOTAL-UNDECLARED-NON-OWN 0 GREEN`; `release today-app.cjs ok=true S10` and `release gym-app.mjs ok=true S10` before and after (packages/S11.json does not declare the two released paths, MEASURED).
- boundary.test.mjs old :298 / :324 (now :306 / :332) ['S8', 'S9', 'S10'] literals: MEASURED that both feed only synthetic loaders (`(id) => specs[id] || null`, `(id) => reSpecs[id] || null`) and read no real package, so no row there reads the youngest real id; left unchanged, as the brief expected.

W5. Runner re-pins, LAST (standing-witness.cjs evaluates the runner's own :1923 check diskSha(RUNNER) === s.tooling.runnerSha256 on each JSON, without running the runner):
- RED (red3 and green1, after the runner moved): nine lines `PIN <id>.json ... tooling.runnerSha256=9fbfdd2d9b09fe2a RED RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, pin-red=9.
- GREEN (final): nine lines `PIN <id>.json ... tooling.runnerSha256=bdbb8a938a9f8471 OK`, `STANDING-WITNESS final standing-red=0 pin-red=0`. The :1930 half (the same sha in Git at HEAD) needs the PM's commit.

Not run on this seat, on purpose: the five CHILD_SPECS test files themselves (food, machine-settings-ui, problem, setup are today-17 files: exclusive/timing-sensitive and guard-tripped as a whole, D:832; boundary.test.mjs is the measure child and imports the Today modules through measure/test/support.mjs). Their whole-file observation is T4's (PM seat / CI). They are not green from T3e alone anyway: see 5.1 and 5.2.

## 3. Counts (all builder-seat, Windows, shared slot; candidates, never needle values: STOP-S11-NEEDLEFORM)
- pinned-unchanged-and-ruled-substitutions.test.cjs: 17/17 at base, 16/17 (RED 1), 16/17 (RED 3), 17/17 (GREEN 1), 17/17 (FINAL). Test count unchanged (17).
- sealed-inventory-fence.test.mjs: 57/58 base; 57/59 RED 4; 58/59 GREEN 2 and FINAL. The one red in every run is THE REAL ROW (5.3). Child sealed-inventory-fence: S10 sealed needle '# pass 58'; S11 PREDICTED '# pass 59' once THE REAL ROW is green (after T3f's parent fill), '# pass 60' if row (37) is ruled in [MEASURE at T4, both OS].
- childspecs witness: 55 -> 0 undeclared non-own drifts; 5/5 cells carry the 10-id chain ending 'S11'.
- standing witness: argv-gate red 1 -> 0; runner-pin red 0 (base) -> 9 (runner moved) -> 0 (re-pins).
- Guard: 0 S10-T4-GUARD lines in any T3e output; guard log 56 lines before and after.
- The five CHILD_SPECS files' own test counts do not move (only a literal and a comment each); today-17 and the measure child are observed at T4.

## 4. STOP left open, returned as a question (never guessed)

STOP-S11-W6ADM. Facts (MEASURED): rebuild.yml W6 step :423-424 (:405-406 @3365c83) `- name: W6 [em dash] the local source admission and consumer cells` / `run: node --test rebuild/m3/w6/test/local-source-admission.test.mjs rebuild/m3/w6/test/local-source-consumer.test.mjs`, NO `if:`. So GitHub skips it whenever the standing `--ci --package S11` step fails (DECISIONS:826), and that step reports the runner's refusal by name in "the expected pre-seal state" (the rebuild.yml comment), so the w6 suite, including the three R913-ALV admission cells (FC09 A-LEGACY-VECTOR), runs in no hosted job of a DRY or lane push until S11's own --ci passes (at the earliest late in the seal chain; UNMEASURED which CI run first). It cannot run on any builder or reviewer seat (STOP-R21B-1: its fixture loads the protected migrate.cjs). local-source-commit.test.mjs is in no rebuild.yml step and no S10 child (brief 2.0, MEASURED there). STOP-S11-NEEDLEFORM needs every moved needle (w6-local-source, PREDICTED 29) observed on both OS in hosted CI BEFORE T6, and D-L14-CI (Astra L14/L15) says "Full source admission/commit/consumer ... and exact-head Windows/Linux CI remain owed".
QUESTION: what does S11 do with the W6 step?
- (A) RECOMMENDED: condition it AND give local-source-commit.test.mjs its CI home in the same step. Exact hunk (ASCII; the name line is left byte-identical): after the name line add `        if: ${{ !cancelled() }}` and make the run line `        run: node --test rebuild/m3/w6/test/local-source-admission.test.mjs rebuild/m3/w6/test/local-source-consumer.test.mjs rebuild/m3/w6/test/local-source-commit.test.mjs`, with a 4-line comment citing DECISIONS:792/:826 and D-L14-CI; fence row "S11 P-S9-3 (37) - the W6 local-source step exists and carries the not-cancelled condition" = assertNotCancelled(YML_LINES(), "rebuild/m3/w6/test/local-source-admission.test.mjs") plus conditionOfStepRunning(YML_LINES(), "rebuild/m3/w6/test/local-source-commit.test.mjs") (exactly one step runs it, no glob), red-first as row (36) was (about 2 min on a shared slot). T3f then keeps child 38 w6-local-source-commit (the draft's shape) or folds it into child 15, and declares local-source-commit.test.mjs. Why A: it is the only route by which the ALV admission cells and the commit cells run on both OS before T6 (NEEDLEFORM) and it pays D-L14-CI's "commit" part; cost: hosted minutes on every S11 lane push and a protected consumer running in hosted CI earlier than the seal head (CI is where protected suites are allowed to run).
- (B) Condition only (same `if:` line and row (37) for the admission file), commit file NOT added: the ALV cells get both-OS signal before T6; local-source-commit stays outside S11 and is carried as a named debt under D-L14-CI.
- (C) Leave the step as it is (runs only in a CI run where the standing step passes, late in the seal chain): no row (37); the w6 needle cannot be observed both-OS in hosted CI before T6, so under NEEDLEFORM it would have to be taken from the PM seat (g) as a candidate and confirmed later, and local-source-commit is a named debt.
Recommended answer: (A). On a yes I (or any T3e builder) apply the hunk and row (37) red-first in this worktree; the fence needle then predicts '# pass 60'.

Other STOPs this step touches, status:
- STOP-S11-RUNNER: T3e's runner post is bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3 (two hunks, final for T3e; section 10 forbids any further runner hunk). S11.json tooling.runnerSha256 still reads "PENDING STOP-S11-RUNNER ..." and is T3f's / S11-REGEN --write's to fill. Every later runner byte would re-open all nine re-pins.
- STOP-S11-FENCE: row (36) done red-first; row (37) waits on W6ADM; the child's needle moves (3 above).
- STOP-S11-NEEDLEFORM, -FC12N, -C4B, -PARENT: untouched by T3e; see 5.

## 5. Hand-offs and PENDING (what T3e alone does not make green)

5.1 T3f (owner of packages/S11.json) - the draft (dfb5cb93, 3365c83 content) still describes the pre-T3e bytes. It must declare all 18 T3e paths with the posts in section 1:
- rebuild/lanes/b/tooling/b-package.cjs: draft 'carried' 9fbfdd2d -> 'edited' pre 9fbfdd2d post bdbb8a93; and tooling.runnerSha256 = bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3.
- .github/workflows/rebuild.yml: draft 'edited' post cdc90cf8 is stale -> post 9cf80544 (pre e3b9c9d1 unchanged).
- pinned-unchanged test, the five CHILD_SPECS files and the fence file: draft 'carried' -> 'edited', posts as section 1.
- ancestor specs, by S10's own precedent (MEASURED in S10.json 0f55a704: H3..S8.json 'edited', its parent S9.json 'superseded-by-child'): H3..S9.json 'edited' (pre = the carried post, post = section 1) and S10.json 'superseded-by-child' pre 0f55a704968f89b984c976e3ab07d105f1b1461296c13b7ddf2382ae4fdb7308 post 566539de9e20b6eaf22a9bbca7aebcd6679540ac47d67c1b5400936b57a07ea3 (the draft holds two PENDING strings there).
- children: sealed-inventory-fence needle note (+1 row, 3); w6 per the W6ADM ruling.
Until then the witness's T3e-own list stays non-empty (final run, per cell): S4 pins rebuild.yml 9cf80544 vs declared cdc90cf8, b-package.cjs bdbb8a93 vs 9fbfdd2d, setup c0562fd5 vs e43ed642, pinned test c98be22a vs 6981b196, food 11cec2c0 vs a7ed0609, machine-settings-ui 2fd9231d vs e45bce7c, problem 598ef752 vs 5fe767e0; B-NTC pins rebuild.yml. So the real boundary P-MEASURE (g), setup 're-pin', food/machine-settings-ui/problem cells and b-package fidelity stay red on T3e's OWN edits until S11-REGEN --write (T3k) records these posts. That is the designed order, not a T3e defect.
5.2 T3c - food N1.18, problem N2-08 and setup's second 're-pin' cell also assert the PAGE_PINS today-entry.mjs pin at rebuild/m3/w6/test/local-today-journey.test.mjs:699 (8b169758 vs disk 169d5658), which is STOP-S11-C4B; and local-today-journey.test.mjs is a B-NTC pin, so its moved post must also land in S11.json. Those three cells go green only with T3c's pin and T3f's declaration.
5.3 THE REAL ROW of the fence - red at baseline and after every T3e byte with exactly `FENCE-RESEAL-CHILD-UNVERIFIED (2) rebuild/lanes/b/tooling/packages/S11.json names no parent option null` (condition (2); STOP-S11-PARENT fill, T3f). T3e's IDS hunk is what condition (4) ("an id in IDS in the branch's own b-package.cjs") needs once (2) and (3) hold; not observable until T3f.
5.4 Info, not changed by T3e: no workflow runs the lane-B tooling tests (git grep of .github for lanes/b/tooling/test, soak excluded: 0 hits), so the four literal cells are observed on builder/PM seats only, as at S10.
5.5 Not read: DECISIONS:839 (outside this step). One git grep for "--package S10" over .github and rebuild printed a one-line excerpt of rebuild/DECISIONS.md:816 as a hit; it was not used.
5.6 Nothing in NATIVE-LOAD rounds 22-23b is in this worktree; FC12/FA03 counts are PENDING (T1) and untouched here.

## 6. git (explicit paths)
git status --porcelain -- .github rebuild (18 lines, all ' M', nothing untracked):
 M .github/workflows/rebuild.yml
 M rebuild/lanes/b/tooling/b-package.cjs
 M rebuild/lanes/b/tooling/packages/H3.json
 M rebuild/lanes/b/tooling/packages/S10.json
 M rebuild/lanes/b/tooling/packages/S3.json
 M rebuild/lanes/b/tooling/packages/S4.json
 M rebuild/lanes/b/tooling/packages/S5.json
 M rebuild/lanes/b/tooling/packages/S6.json
 M rebuild/lanes/b/tooling/packages/S7.json
 M rebuild/lanes/b/tooling/packages/S8.json
 M rebuild/lanes/b/tooling/packages/S9.json
 M rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs
 M rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
 M rebuild/m3/w7-preview/measure/test/boundary.test.mjs
 M rebuild/m3/w7-preview/today/test/food.test.mjs
 M rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs
 M rebuild/m3/w7-preview/today/test/problem.test.mjs
 M rebuild/m3/w7-preview/today/test/setup.test.mjs
git diff --stat -- <the 18 paths above>:
 .github/workflows/rebuild.yml                      | 22 ++++++++++++++++++++--
 rebuild/lanes/b/tooling/b-package.cjs              | 15 +++++++++++++--
 rebuild/lanes/b/tooling/packages/H3.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S10.json          |  2 +-
 rebuild/lanes/b/tooling/packages/S3.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S4.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S5.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S6.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S7.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S8.json           |  2 +-
 rebuild/lanes/b/tooling/packages/S9.json           |  2 +-
 .../test/pinned-unchanged-and-ruled-substitutions.test.cjs | 19 ++++++++++++++-----
 .../c/ui-port/sealed-inventory-fence.test.mjs      | 12 ++++++++++++
 .../m3/w7-preview/measure/test/boundary.test.mjs   | 10 +++++++++-
 rebuild/m3/w7-preview/today/test/food.test.mjs     | 10 +++++++++-
 .../today/test/machine-settings-ui.test.mjs        | 10 +++++++++-
 rebuild/m3/w7-preview/today/test/problem.test.mjs  | 10 +++++++++-
 rebuild/m3/w7-preview/today/test/setup.test.mjs    | 10 +++++++++-
 18 files changed, 113 insertions(+), 23 deletions(-)
Removed lines are only the replaced literals/keys (numstat -: rebuild.yml 2 = old name+run, runner 2, pinned test 5, 1 per CHILD_SPECS file, 1 per spec, fence 0); every added line is ASCII (0 added lines with a byte > 0x7F), LF only.

VERDICT: T3e BUILT (uncommitted, worktree earned-s11-t3e) except the W6 step and fence row (37), held for the STOP-S11-W6ADM ruling (recommend A). Five witnesses (W1-W5) red-first then green; fence 58/59 and pinned 17/17 at the final bytes; the one open red (THE REAL ROW) is pre-existing and T3f's.
