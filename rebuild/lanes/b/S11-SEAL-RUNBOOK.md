# S11 SEAL RUNBOOK - PART B (T7..T28) of the S11 brief of record, for M2-S11-NATIVE-LOAD, from "H 01a7050, T6 committed, PRODUCT FREEZE" to "S11 SEALED AND MERGED" (analyst, 2026-10-03)
Modelled on %TEMP%\S10-SEAL-RUNBOOK.md (S10 was sealed by it, DECISIONS:836-838) and its companions in %TEMP%\s10-seal-prep\ (CHECKLIST.md,
T5-make.cjs / T6-apply.cjs, VERDICT-S10.draft.md / .c2.md) plus the S10 cmd files actually run (%TEMP%\s10-{ci0,ci1,export,full1,full2,full3,t23,t23b}.cmd).
Step text of record: brief rev11 (%TEMP%\pm9-s11-brief-rev11.md = rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md, sha256 4f7d431f..., 352743 B) section 11
PART B (brief lines 293-298, T7..T28 plus the rev8-rev11 PART B NOTES), section 12 (open STOP index), section 8 (5) (carried debts).
The analyst executed nothing but read-only git (incl. the allowed fetch), listing, hashing and reading. No node program, test, b-package, REGEN
or exporter ran. Every value is MEASURED (read 2026-10-03) unless marked PREDICTED (inferred from code, the brief or the S10 run) or UNMEASURED.
ANALYST SLIP, disclosed (recorded, not excused): a names-only `git ls-tree --name-only HEAD -- .github/workflows` printed the six workflow
file NAMES, one of which is a *soak* path name; no content of it was opened, read or printed. Every later listing excluded such paths by path.

## 0. Names, grants, conventions (step numbers T7..T28 as the brief; they never collide with package names)
- W11 = C:\Users\joeym\AppData\Local\Temp\earned-s11int, branch rebuild/b-s11-integration. HEAD = H = 01a7050b6d7fcf56804734ee85352b0b98b1c32e
  = refs/remotes/origin/rebuild/b-s11-integration (pushed; MEASURED, ls-remote). git-common-dir C:/Users/joeym/Documents/prepledger-dev/.git:
  run git ONLY as `G -C W11 ...`, never with cwd prepledger-dev. `G -C W11 status --short --ignored -- rebuild .github` prints exactly 3 `!!`
  (MEASURED): rebuild/conform/run.log, rebuild/m3/w5/node_modules/, rebuild/m3/w6/node_modules/. [DIFF: S10 had 2; run.log is the same file
  S10's T9 had to remove, D:836.] Both node_modules are junctions and BOTH target
  C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\m3-w6-browser-bridge\rebuild\m3\w6\node_modules (MEASURED; see E1).
  rebuild/conform/engines exists in W11 (Test-Path True; not opened; not in git status, so the exporter clean step does not see it). No
  receipts/S11.json, no VERDICT-S11.md, no acceptance-s11-native-load.json in W11 (MEASURED).
- P = PM ledger tree C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\t2-client-core-pm (exists; HEAD not read).
- CHAIN = refs/remotes/origin/rebuild/t2-client-core = 71dc0a8347157896034922e3cbe017b1923db571 after `G -C W11 fetch origin
  rebuild/t2-client-core` today (= origin, ls-remote). rebuild/DECISIONS.md on it: 887 lines, LF only (0 CR). merge-base(H, CHAIN) =
  71cf1437e17821b89c113bff685dd35856643656; 48 chain commits and 49 lane commits since it; `git diff --name-only 71cf143 CHAIN -- rebuild
  .github` = rebuild/DECISIONS.md ONLY; `git merge-tree --write-tree H CHAIN` = one clean tree (d9fd5e27). W11's own DECISIONS.md: 839 lines.
- G = C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe (git 2.53.0.windows.3). N =
  C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe (file version 24.19.0). NEITHER git NOR node is on
  PATH (Get-Command: none, MEASURED). The runner and the exporter shell out to bare `git` (BP:92 imports legacy-gates; EXP:54 execFileSync('git'));
  rebuild/conform/run.cjs spawns bare `node` for the port oracle (D:836, D-PATH-NODE); FC09's PE16 cell needs git on PATH (D:879).
- Cites (all at H unless named): BP = rebuild/lanes/b/tooling/b-package.cjs sha256 bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3
  (317089 B, 3959 lines; last change 97a0aa6 = S10's runner + 13/-2 lines: IDS/NO_REGISTER_IDS gain S11 at :344 etc.); SP = rebuild/lanes/b/
  tooling/packages/S11.json 321967eeafef7477cacc14bb7d358a7b0bb9c81e357b094ad83db0970f2c11ed (132546 B, 2185 lines, D:887); BR = the brief
  4f7d431f97fc16f7d0df043fcce9a8339d70e1cfb3801ec1e3447bb7cba05465 (352743 B, 482 lines, committed at 1763205, unchanged at H); YML =
  .github/workflows/rebuild.yml 0c861be9d3d0f448676e699094141ed14f33abf9962a1d8fed0c7fa7121bb9d6 (584 lines); SH = slice-host.yml; ECR =
  rebuild/coach/engine-revision.cjs eb5fb2c04adb767d849c09223b540a2a53f0a187f151db7e9fef62ca526e2eb5 (literal at :25); ERT =
  rebuild/coach/test/engine-revision.test.cjs 5a489c8f8fd3e6a1af6fd23998af3e4529e81ab070111bf4b20088a4d37f921d (standingSeal :54-81); RG =
  rebuild/lanes/b/S11-REGEN.cjs a283b778...; R10 = rebuild/lanes/b/tooling/receipts/S10.json 3c6d1f5d1fba7699... (38229 B); EXP = the S11
  exporter port rebuild/lanes/astra/s11-exporter-v1/export-s11-profile-v1.cjs.txt at e93b1ed6c31c4e3b9995f40ea440315299e74fef (LOCAL branch
  rebuild/p-s11-exporter-v1, parent 9288adf, NOT on origin; 3 files) = 9e6ac28c64a64989ce5c5fbf87c2a316474a0d50c081bc68dcd921c4b26d6958 (14124 B,
  195 lines; = brief section 7's T3g value); EXP10 = S10's port at d8ffbcf (on origin) de3aeb76fc7b81d7... (13799 B), which produced 42a3eb02
  at M1 (D:836); pm-run = %TEMP%\pm-run.cjs de420908986619c8... (= S10's); pm4-ci.cjs f98d5b98..., pm4-ci-jobs.cjs 3fdf0fb8... (present).
- SP STATE (MEASURED): packageId M2-S11-NATIVE-LOAD; status BRIEF-ACCEPTED; brief {file rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md, sha256
  4f7d431f..., acceptedLedgerLine = D:875 claim, lineSha256 3eae16a8...}; authorizations {owner, contract, theme = D:874 claim lineSha256
  e3cfb1c0..., review {role cowork, prefix "POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD", terminal ACCEPTED}}; artifact {file rebuild/m4/spec/
  acceptance-s11-native-load.json, review rebuild/m4/spec/review-s11-native-load.json} (= BP:2082-2083 slug "s11-native-load"); NO `release`
  key (no RELEASE-FROM-SEAL, brief section 6); coverage.superseded.rulingLineSha256 76c110f6f3e2... = sha256 of D:873 (re-hashed today from
  the chain bytes, as are D:874 and D:875: all three claims reproduce) with the five gates source-carriers, inherited-carriers,
  defect-witnesses, writers-differential, second-gate; tooling.runnerSha256 bdbb8a93... = BP blob; sourceBase edb8381; parent S10: artifact
  42a3eb02..., review 8d913278..., receiptLedgerLine 837; 39 children, every needle set (none PENDING; child 20 '# tests 121', child 22
  '# tests 14', child 35 "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all
  byte-identical to the parent; 2 named files move, each", the other 36 '# pass N'); product 320 = 249 carried + 51 edited + 19 new + 1
  superseded-by-child, 0 released; the three FC09 files are role new (native-load-replay.cjs 82cc19d5, its test 132f8b09,
  native-load-import.test.mjs fc4c9fe6); no rebuild/coach path in product (0); 15 notes ([14] OBSERVATION).
- GRANT (g) = DECISIONS:816 (g), PM seat only, PASS/FAIL LINES ONLY, nothing leaves the PC; every b-package --ci/--full, the exporter, T23's
  tests and any guard-tripped child are (g). No builder or reviewer runs, loads or outputs the protected five.
- RUN (D:814 rules; S10 practice): every node run goes through pm-run, never a hand lock. b-package --ci/--full, the exporter and T23's
  tests are EXCLUSIVE. cmd file %TEMP%\s11-<x>.cmd, written with write_file (ASCII; LF is fine for cmd), exactly (one statement per line):
    @echo off
    cd /d %TEMP%\earned-s11int
    set "PATH=C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
    set "MEASURED_TEST_NOW=2026-09-03"
    set "TZ=America/New_York"
    set "NODE=C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
    "%NODE%" rebuild\lanes\b\tooling\b-package.cjs --<ci|full> --package S11 > %TEMP%\s11-<x>.log 2>&1
    >>%TEMP%\s11-<x>.log echo EXIT=%ERRORLEVEL%
  [DIFF D-PATH-NODE: S10's ci0/ci1/export cmd files carried git's folder only and its full1 first run FAILED on bare `node` (D:836); S10's
  full2/full3/t23 carried both. S11 puts BOTH folders on EVERY cmd file (the brief names it at T14; it is harmless elsewhere).] The cmd never
  touches earned-runtime.lock (absent now, MEASURED). Start: Start-Process -WindowStyle Hidden -FilePath <N> -ArgumentList
  "$env:TEMP\pm-run.cjs","exclusive","s11-<x>","$env:TEMP\s11-<x>.cmd" -RedirectStandardOutput "$env:TEMP\s11-<x>.pmrun.txt"; poll
  Select-String "$env:TEMP\s11-<x>.pmrun.txt" '^PM-RUN s11-<x> exit ' (S10 shape: "PM-RUN exclusive s10-ci0 holds earned-runtime.lock after 0 s",
  "PM-RUN s10-ci0 exit 0", MEASURED). Use $n-free variable names in PowerShell ($N/$n clash, D:840 (6), D:836 T11).
- FILTER, the only way a b-package log is read (never print it whole; never open W11\.tmp\b-package\S11\*.log; never print the --ci child
  diagnostic tail, BP:3950-3956):
  Select-String -LiteralPath $log -Pattern '^(EXIT=|B PACKAGE S11 (POSTFIX|SEAL BASE|ENVELOPE (ABSENT|PENDING|AUTHORIZED)|AUTHORIZED STEP|SEALED RUN|SEALED-RUN-RECEIPT-VOID|PRIVATE ORACLE PRESENT|FULL EVIDENCE|PUBLIC CI EVIDENCE PASS|CI REVIEW-PENDING|OPEN |FAIL|BLOCKED))' -CaseSensitive | % { $_.Line.Substring(0,[Math]::Min(200,$_.Line.Length)) }
  plus COUNTS only: '^B PACKAGE S11 CHILD \S+ OBSERVED; exit 0' (BP:2870) and '^LEGACY \S+ (PASS|OBSERVED) '. -CaseSensitive is mandatory
  [DIFF: S10's T24 wrapper false-halted on a case-insensitive match of 'sealed run recorded in' inside the BYTE-IDENTITY sentence, D:838].
  Line forms at H (MEASURED in BP): say() prefixes 'B PACKAGE S11 ' (BP:705); 'POSTFIX <id> AUTHORIZED|REVIEW-PENDING mode=--ci|--full'
  (BP:3858); ENVELOPE ABSENT/PENDING/AUTHORIZED (BP:3715, :3727, :3796; the ABSENT line contains a U+2014 dash, so match the prefix only);
  SEAL BASE ON THE TIP (BP:3554); PRIVATE ORACLE PRESENT (BP:3810); FULL EVIDENCE (BP:3843); BYTE-IDENTITY RE-VERIFY (BP:3894);
  SEALED-RUN-RECEIPT-VOID / AUTHORIZED STEP UNAVAILABLE (BP:3904, :3907); PUBLIC CI EVIDENCE PASS / CI REVIEW-PENDING (BP:3922-3923);
  SEALED RUN RECORDED / NEXT STEP (BP:3933, :3936); POSTFIX PACKAGE PASS / REVIEW-PENDING (BP:3938-3939); FAIL/BLOCKED on stderr (BP:3949-3950).
  Line numbers moved +11 against S10's BP:9fbfdd2d cites (the S11 runner is 3959 lines).
- TAGS (LG:19-26, as S10): a line read by L.verifyReceipt with a role must contain " <U+00B7> cowork <U+00B7> ". "<U+00B7>" in this file
  means the literal UTF-8 middle dot C2 B7 in the ledger; this runbook is ASCII and never contains it.
- lineSha256 of a ledger line: in P, <N> -e over the bytes of `git show R:rebuild/DECISIONS.md` read inside node (split /\r?\n/, sha256 of the
  line's UTF-8 bytes, no newline); never from a PowerShell `>` extract. Cross-check without node (used by this analyst today, no file
  written): read the blob through System.Diagnostics.Process StandardOutput.BaseStream into a byte array, split on 0x0A, SHA256 of the line's
  byte range. It reproduces D:837 ac7077f8... (= %TEMP%\s10-t17.json), D:873 76c110f6..., D:874 e3cfb1c0..., D:875 3eae16a8... (MEASURED).
- ENVIRONMENT FINDINGS that gate PART B (each is a STOP until the PM disposes of it; details in section 4):
  E1 SEAT BUNDLE OFFSET: rebuild/m3/w5/node_modules in W11 is a junction to a W6 node_modules (m3-w6-browser-bridge\rebuild\m3\w6\node_modules;
     the bridge has no w5 node_modules); %TEMP%\earned-adm\rebuild\m3\w{5,6}\node_modules, the targets S10 used and re-installed at T11, are
     ABSENT (MEASURED), so earned-s10int and earned-nlr hold dangling junctions to them. The PM seat measured the page-bundle counts 4 below their
     pins on BOTH 84f8421 and the FC09 head (D:879: 144/148, 22/26; D:881, :883, :885 "regression green except the page-bundle seat offset").
     CI installs W5 from its own lockfile (YML:67; SH:66-79 explains esbuild resolves @noble/hashes by walking up from rebuild/m3/w5).
     PREDICTED: every LOCAL b-package run (T8, T12, T14, T20, T24) refuses CHILD-REQUIRED-EXIT-ZERO on today-17 (argv includes
     today/test/package.test.cjs) or w7-import (argv includes import/test/page-bundle.test.mjs) until the seat's W5 node_modules is CI-equal.
  E2 PRIVATE CENSUS: %TEMP%\earned-s4\rebuild\conform\private, S10's T14 junction target in the S10 runbook, tests ABSENT today (Test-Path False;
     %TEMP%\earned-s4\rebuild\conform exists). Without a target, T14/T20 print BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING (BP:3809).
  E3 LOCAL OBSERVATION REF: origin has no obs/s11-1 or obs/s11-2 (MEASURED, ls-remote; D:887), but LOCAL branch obs/s11-2 (8bd959f) still exists,
     checked out in worktree %TEMP%\earned-s11-obs2. Brief 11 T5b (7): "deletes the observation branch on origin (and any local ref)".
  E4 EXPORTER PRECONDITIONS OWED (brief 7 rev8 EXPORTER STATUS; D:848 (4) EXPORTER; nothing in D:849-887 records them paid): the checker
     re-run with --runner-sha bdbb8a93 of the final runner, the containment delta read on the FINAL inputs (H 01a7050, SP 321967ee), and
     D-S11T3g-2's runtime red/green of EXP:115. e93b1ed is still LOCAL only.
  E5 rebuild/conform/run.log (ignored, under rebuild/) exists: the exporter clean step refuses it (EXP:59-62) until T9 removes it.

## 1. Steps T7..T28 (role in brackets; [DIFF] = S11 departs from S10; every red is RECORDED in the next ledger line and in VERDICT-S11,
## never excused, D:835; a red child goes back to T5b/T4 as the brief says, never re-observed until green)
T7 [PM] MERGE-FORWARD #1, never a rebase (D:563).
   Purpose: bring the chain tip (ledger-only delta) into the lane so the first hosted run of the full YML on the composed S11 tree (CI-M1)
   confirms the T6 needles with the unchanged runner (brief rev9/rev11 PART B NOTES; STOP-S11-NEEDLEFORM).
   Pre-check (all MEASURED today unless marked): G -C W11 rev-parse HEAD = 01a7050...; G -C W11 status --short --ignored -- rebuild .github =
   the 3 `!!` of section 0 and nothing else; SP sha 321967ee, BP sha bdbb8a93 (Get-FileHash on disk = the blobs above).
   Command: G -C W11 fetch origin rebuild/t2-client-core; $mb = G -C W11 merge-base HEAD refs/remotes/origin/rebuild/t2-client-core;
   PREFLIGHT (D:582): G -C W11 diff --name-only $mb refs/remotes/origin/rebuild/t2-client-core -- rebuild .github, intersected with SP product
   keys + the S10 artifact's product and executionPins keys (94 pins, rebuild/m4/spec/acceptance-s10-today-split.json at H) + BP + SP -> 0 hits.
   MEASURED today: mb 71cf143, delta = rebuild/DECISIONS.md only, 0 hits, merge-tree clean; re-measure at execution (PREDICTED unchanged: the
   chain is ledger-only, D:887 is the last line).
   [DIFF T5b CHECKS, brief rev9/rev10 PART B NOTES, T5b (2)/(7), 11 T6 (h)]: (a) G -C W11 merge-base --is-ancestor adafcc8 HEAD -> exit 1 and
   G -C W11 merge-base --is-ancestor 8bd959f HEAD -> exit 1 (both O commits, obs/s11-1 and obs/s11-2; MEASURED exit 1 for both);
   (b) G -C W11 ls-tree -r --name-only HEAD -- .github/workflows/s11-observe.yml -> prints nothing (MEASURED: not in H's tree; query that
   exact path only, never list the folder, see the slip above); (c) G -C W11 ls-remote origin refs/heads/obs/s11-1 refs/heads/obs/s11-2 ->
   prints nothing (MEASURED; deleted on origin at D:887); (d) G -C W11 for-each-ref refs/heads/obs/s11-* -> prints nothing: TODAY IT PRINTS
   refs/heads/obs/s11-2 8bd959f (E3) -> PM first: G -C W11 worktree remove %TEMP%\earned-s11-obs2 (only if its status is clean) then
   G -C W11 branch -D obs/s11-2, and record it. The six obs/sweep-* branches on origin are not S11 observation branches (no check).
   Merge: G -C W11 merge --no-ff refs/remotes/origin/rebuild/t2-client-core -m "S11: merge tip <7> into the lane (DECISIONS:563)"; then
   G -C W11 diff --name-only HEAD^1 HEAD -- rebuild .github = rebuild/DECISIONS.md only; push: G -C W11 push origin HEAD:refs/heads/rebuild/
   b-s11-integration (fast-forward of 01a7050) -> M1.
   CI-M1 (hosted, YML:3-7 push on rebuild/**): read with <N> %TEMP%\pm4-ci.cjs rebuild/b-s11-integration 6, then <N> %TEMP%\pm4-ci-jobs.cjs
   <id> (counts and step results only). PASS = rebuild-public (ubuntu-latest) and (windows-latest) and both "C font transport" jobs
   "completed | success", no failed step; the standing step YML:185-186 (`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S11`)
   PREDICTED "PUBLIC CI EVIDENCE PASS" (ENVELOPE ABSENT, BP:3715; the --ci path never reaches sealOnTheTip without a review); then every later
   step runs on the composed tree: NATIVE-LOAD FC12 :217, A1-A4 :282, fence :308, P3 :342, M4 :346, D :348-:371 (b-lom :371-372, D-BLOM),
   E :384/:387, Today split fence :394, S10-REGEN :404, S11-REGEN :413 (STOP-S11-REGENCI verdict), port/real-shape :421/:430, W6 :439,
   C4B w6-local-today-journey :449, coach C5 :452 (green in the window state, see T23), A5 :454/:456, pack pins :489, reference closure :492,
   release object :512, passphrase :539, W6 seal constants :555.
   STOP and record: any red step; a CHILD-NEEDLE-NOT-A-TERMINAL-LINE <child> (BP:2850) or CHILD-REQUIRED-EXIT-ZERO <child> refusal sends that
   child back to T5b (brief rev9 note: "CI-M1 is the CONFIRMATION of the T6 needles ... never their source"), then T6 again and a new T7; a
   single-OS today-17 red follows :816/:835 (empty re-run commit, recorded); UNLISTED-SOURCE-CHANGE (BP:2630) -> REGEN and T6.
   Ledger: none at T7 (S10 recorded CI-M1 in the next PM line, D:836); the run id and per-step result go in the T17-preceding PM line.
   Reads: none required; the PM reads the CI-M1 S11-REGEN, W6 and C4B step verdicts by name (brief T7).
T8 [PM, (g), OPTIONAL if CI-M1 is green on both OS] --ci AT M1 (exclusive): RUN x=ci0, FILTER.
   Expect (PREDICTED): "B PACKAGE S11 POSTFIX M2-S11-NATIVE-LOAD REVIEW-PENDING mode=--ci"; "B PACKAGE S11 ENVELOPE ABSENT;
   rebuild/m4/spec/acceptance-s11-native-load.json is not sealed yet ..."; 39 CHILD ... OBSERVED; "PUBLIC CI EVIDENCE PASS ..."; EXIT=0.
   STOP: E1 PREDICTS a local CHILD-REQUIRED-EXIT-ZERO today-17 or w7-import here until the seat's W5 node_modules is fixed: that red is an
   environment red, still RECORDED (S10's ci0 red was recorded at :835 and carried into VERDICT-S10). Any CHILD-NEEDLE-*, UNLISTED-SOURCE-CHANGE,
   GATE-SUPERSESSION-* refusal: fix, re-review, back to T7. [DIFF: S10 did not repeat T8 after its ci0 red (D:836); the PM may skip T8 when
   CI-M1 is green, but T12/T14 cannot be skipped, so E1 must be solved before T12 in any case.]
   Ledger: record the result in the next PM line. Reads: none.
T9 [PM] EXPORTER CLEAN STEP (EXP:56-64 refuse any tracked change, any untracked entry, any ignored entry under rebuild/ or .github/, any
   non-'H' index flag).
   Pre (E4, before the clean step): the containment delta read on the FINAL inputs has ACCEPTED (Fable, D:843 (2)) and the checker
   export-s11-profile-v1.containment-selfcheck.cjs.txt (on e93b1ed) has been re-run by the PM with --runner-sha bdbb8a938a9f... (brief 7:
   expected FAIL 0, PENDING only C6-SCRATCH-ROOT until its folder exists). Both are PM dispatches, not this runbook's commands.
   Command: record the two junction targets first (Get-Item -Force ... | Select LinkType,Target; today both = the m3-w6-browser-bridge W6
   node_modules, E1). Test-Path W11\rebuild\conform\private -> False (MEASURED today). Then
     foreach($j in 'rebuild\m3\w5\node_modules','rebuild\m3\w6\node_modules'){ if((Get-Item -LiteralPath "$W\$j" -Force).LinkType -ne 'Junction'){throw $j}; cmd /c rmdir "$W\$j" }
   (reparse point only; never Remove-Item a junction) and Remove-Item -LiteralPath "$W\rebuild\conform\run.log" (an ignored log the runner
   wrote; never opened; S10 did the same at T9, D:836) [DIFF: 3 entries, not 2].
   PASS: G -C W11 status --porcelain --untracked-files=all --ignored=matching -- rebuild .github prints nothing; G -C W11 ls-files -v |
   Select-String -NotMatch '^H ' prints nothing. Note EXP:60 runs status over the WHOLE tree (no pathspec): run it once without
   "-- rebuild .github" too; untracked entries anywhere refuse.
   STOP: anything printed. Ledger: none. Reads: none.
T10 [PM, (g)] EXPORT (EXPORT FREEZE). The exporter compiles BP's prefix up to the "8. main sequence" marker (BP:3850, MEASURED) and hashes the
   protected five as carried pins (EXP:21-22, :139-152); PM seat only under (g).
   [DIFF EXPORTER] S10 used d8ffbcf:rebuild/lanes/astra/s10-exporter-v1/export-s10-profile-v1.cjs.txt (de3aeb76, on origin). S11 uses the
   T3g literal port on LOCAL branch rebuild/p-s11-exporter-v1 at e93b1ed6c31c4e3b9995f40ea440315299e74fef, file
   rebuild/lanes/astra/s11-exporter-v1/export-s11-profile-v1.cjs.txt, sha256 9e6ac28c64a64989ce5c5fbf87c2a316474a0d50c081bc68dcd921c4b26d6958
   (14124 B, 195 lines, MEASURED). Its literals (MEASURED): :12 specRel packages/S11.json; :33 scratch root
   C:/Users/joeym/AppData/Local/Temp/earned-s11-profile-export-results; :45 output name ^s11-; :104 argv '--ci','--package','S11'; :115
   asserts lanePackage 'S11', artifact.file rebuild/m4/spec/acceptance-s11-native-load.json and artifact.review .../review-s11-native-load.json
   (= SP's artifact block, MEASURED); :170-172 "S11 PROFILE EXPORTED PENDING"; :182-183 the two file names; :186 "S11 PROFILE EXPORT REFUSED".
   EXP:16-19 importedRel (eight modules) = BP:90-95's imports at H (MEASURED; none of the eight changed since 9288adf).
   Command: (1) cmd /c "<G> -C %TEMP%\earned-s11int show e93b1ed6c31c4e3b9995f40ea440315299e74fef:rebuild/lanes/astra/s11-exporter-v1/export-s11-profile-v1.cjs.txt > %TEMP%\export-s11-profile-v1.cjs"
   then (Get-FileHash %TEMP%\export-s11-profile-v1.cjs -Algorithm SHA256) = 9E6AC28C... (absent today). (2) New-Item -ItemType Directory
   C:\Users\joeym\AppData\Local\Temp\earned-s11-profile-export-results (absent today, MEASURED; must be a real directory, EXP:40-42).
   (3) chain40 = G -C W11 rev-parse refs/remotes/origin/rebuild/t2-client-core; M1 40-hex = G -C W11 rev-parse HEAD.
   (4) %TEMP%\s11-export.cmd = the RUN shape with the node line replaced by
   "%NODE%" %TEMP%\export-s11-profile-v1.cjs --execute-reviewed-export C:\Users\joeym\AppData\Local\Temp\earned-s11int <M1 40-hex> bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3 s11-final-1 <chain40> > %TEMP%\s11-export.log 2>&1
   (exclusive; EXP:31 needs node major 24 and git >= 2.44: 24.19.0 and 2.53.0.windows.3 match).
   PASS: ONE line, then EXIT=0: "S11 PROFILE EXPORTED PENDING <artifact64> <review64> chain=<chain40> node=v24.19.0 git=2.53.0.windows.3"
   (S10's line, MEASURED in %TEMP%\s10-export.log: "S10 PROFILE EXPORTED PENDING 42a3eb02... 5c2811a4... chain=ed10468... node=v24.19.0
   git=2.53.0.windows.3"). The review64 is the sha of the fixed PENDING envelope; PREDICTED = S10's 5c2811a4eea3ad87b98753128d9f53b9b52c7ab3170aedca9964c8cf4204cb30
   (same bytes {"version":1,"status":"PENDING","receipt":null}, 2-space JSON + LF). Writes only ...\s11-final-1\{acceptance,review}-s11-native-load.json.
   STOP: "S11 PROFILE EXPORT REFUSED", EXIT=1 (text-free by design; attribute by one-variable difference: clean tree, HEAD, chain, runner sha,
   scratch folder, toolchain); an existing s11-final-1 folder refuses (EXP:47): use s11-final-2, recorded. D-S11T3g-2: the PM also shows the
   :115 asserts red once on a negative control before the real export (brief rev8 EXPORTER STATUS), recorded. Re-export after ANY input change.
   Ledger: none (recorded in the PM line before T17). Reads: the containment read of E4 precedes this step; after it, push e93b1ed to origin
   as rebuild/p-s11-exporter-v1 (S10's d8ffbcf is on origin; brief: "e93b1ed stays LOCAL until then", D:848 (4)) - PM decision.
T11 [PM] RESTORE + INSTALL: cmd /c mklink /J "W11\rebuild\m3\w5\node_modules" "<the w5 target recorded at T9, or the CI-equal W5 install E1
   requires>"; same for w6. [DIFF: S10 restored to %TEMP%\earned-adm\..., which no longer exists (E1).] Copy-Item the two files from
   ...\earned-s11-profile-export-results\s11-final-1\ into W11\rebuild\m4\spec\; Get-FileHash of each = the T10 line.
   PASS: G -C W11 status --short --ignored -- rebuild .github = the 2 junction `!!` plus `??` acceptance-s11-native-load.json and
   `??` review-s11-native-load.json (run.log stays absent until a runner run writes it again).
T12 [PM, (g)] --ci WITH ARTIFACT + PENDING REVIEW ON DISK: RUN x=ci1, FILTER.
   PASS: "POSTFIX M2-S11-NATIVE-LOAD REVIEW-PENDING mode=--ci"; "ENVELOPE PENDING artifact=<T10 artifact64> spec=321967ee... runner=bdbb8a93...;
   independent exact-artifact acceptance required" (BP:3727); 39 CHILD OBSERVED; "PUBLIC CI EVIDENCE PASS ..."; EXIT=0 (S10: D:836, 36
   children). Then Remove-Item W11\rebuild\m4\spec\review-s11-native-load.json (missing and PENDING are both non-authorized, D:516).
   STOP: "FAIL SEALED-PROFILE-RECOMPUTATION" (BP:3721) = an input moved since T10 -> re-export; CHILD-REQUIRED-EXIT-ZERO (E1) -> fix the seat,
   re-run, record both runs. Ledger: next PM line. Reads: none.
T13 [PM] COMMIT A: G -C W11 add rebuild/m4/spec/acceptance-s11-native-load.json (ONLY); commit "S11: proposed artifact (exporter s11 v1
   s11-final-1, sha256 <8>...)"; push the lane -> hosted CI-1. HOLD THE LEDGER until CI-1 is read (D:563). PASS: G -C W11 show --stat HEAD =
   one file. Ledger: none.
T14 [PM, (g)] --full AT A, REVIEW ABSENT, WITH THE PRIVATE CENSUS: cmd /c mklink /J "%TEMP%\earned-s11int\rebuild\conform\private" "<census
   target>" - the target by Test-Path only, never listed. [DIFF/E2: S10's runbook named %TEMP%\earned-s4\rebuild\conform\private, which tests
   ABSENT today; the PM names the target before T14.] RUN x=full1 (the cmd file's PATH line carries node's folder, D-PATH-NODE, brief T14).
   PASS (PREDICTED from D:836 T14b): "POSTFIX M2-S11-NATIVE-LOAD REVIEW-PENDING mode=--full"; "ENVELOPE ABSENT"; "PRIVATE ORACLE PRESENT;
   verdict-only reporting ..."; 39 CHILD OBSERVED; 10 LEGACY lines; "FULL EVIDENCE: 10 of the 19 original gates re-executed, ... 9 SUPERSEDED
   under DECISIONS:873 ..."; "POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s); independent exact-artifact acceptance required"; EXIT=2.
   STOP: "BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING" (BP:3809) = junction or live golden absent (E2); a conformance gate BAD with 0 PORT ids
   = node not on the cmd's PATH (S10's full1, D:836); CHILD-REQUIRED-EXIT-ZERO (E1). Every failed run is recorded with its EXIT. Junction stays
   until T24. Ledger: next PM line. Reads: none.
T15 [PM] READ CI-1: <N> %TEMP%\pm4-ci.cjs rebuild/b-s11-integration 6; <N> %TEMP%\pm4-ci-jobs.cjs <id>. PASS: rebuild-public (ubuntu-latest)
   and (windows-latest) and both "C font transport" jobs "completed | success", no failed step; the S11-REGEN (:413), W6 (:439) and C4B (:449)
   step verdicts read by name [STOP-S11-CI, STOP-S11-REGENCI]. Record id + conclusion (D:627 sentence form). STOP: any red (recorded).
T16 [REVIEWER Fable, static; D:843 (2): a Fable read, not a stand-in; Astra is NOT a gate here, D:844 (3)] FABLE SEAL READ AT A (S10: Fable
   T16 1f8ca79a, D:838). Reads: the artifact bytes at A = the T10 sha (git show A:rebuild/m4/spec/acceptance-s11-native-load.json, hashed);
   SP at A (39 children and needles vs the T5b second record a96550dc (run 37102082564, D:887) and the D:887 needle table, the D:873-875 claims and
   their lineSha256, notes [8]-[14], no release block, artifact block, the three FC09 declarations of D:886); the PM's FILTERed T12/T14 lines
   (never a raw log); the CI-M1 and CI-1 ids; the VERDICT-S10 carries; the exporter custody (e93b1ed port sha, s11-final-1, chain40).
   PASS: ACCEPT or ACCEPT WITH NAMED DEBTS -> PM. A REJECT stops the chain before L5 (nothing appended). Astra may read in parallel only if
   the PM adds one (brief T16).
T17 [PM, P] LEDGER LINE L5, POSTFIX-ACCEPTANCE - only after CI-1 green + T14 REVIEW-PENDING + T16 ACCEPT. Exactly (D:837 shape, RECEIPT regex
   BP:2114 and BP:3786-3788):
   - 2026-10-DD <U+00B7> cowork <U+00B7> POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD <A 40-hex> rebuild/m4/spec/acceptance-s11-native-load.json <artifact sha256> ACCEPTED
   (append with write_file append, LF, UTF-8; the ONLY C2 B7 bytes are the two separators). BEFORE it, one PM line records T7-T16 (CI-M1,
   T8 or its skip, T9-T15 lines, every red, the E1-E5 dispositions, the T16 read id) as D:836 did for S10, then L5 alone. Commit R ("DECISIONS:
   <n> L5 POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD (artifact <8> at A <7>); S11 chain freeze starts", S10 message shape %TEMP%\s10-t17-msg.txt);
   push HEAD:refs/heads/rebuild/t2-client-core; compute lineSha256 (section 0) and keep {R, lineNumber, line, lineSha256} as
   %TEMP%\s11-t17.json (S10: %TEMP%\s10-t17.json). CHAIN FREEZE FROM R UNTIL T28: nothing else is appended or committed to the chain; announce
   to NATIVE-LOAD, S12, cleanup and Astra (brief T17). Reads: none (T16 precedes).
T18 [PM] REVIEW ENVELOPE, lane commit V: node writes rebuild/m4/spec/review-s11-native-load.json =
   JSON.stringify({version:1,status:"ACCEPTED",receipt:{commit:"<R 40>",path:"rebuild/DECISIONS.md",line:"<exact L5>",lineSha256:"<64>"}},null,2)+"\n"
   (keys BP:3723-3724 and the receipt check BP:3782-3788). Commit "M2-S11-NATIVE-LOAD: review-s11-native-load.json ACCEPTED on the
   DECISIONS:<n> receipt (base <R 7>)". PASS: G -C W11 show --stat HEAD = that one file. Ledger: none (frozen chain).
T19 [PM] MERGE-FORWARD #2: G -C W11 fetch origin rebuild/t2-client-core; G -C W11 merge --no-ff refs/remotes/origin/rebuild/t2-client-core
   -m "S11: merge tip <7> into the lane (DECISIONS:563)" -> M2. PASS: G -C W11 diff --name-only V M2 = rebuild/DECISIONS.md ONLY, and
   explicitly G -C W11 diff --name-only V M2 -- rebuild/lanes/STATUS.md prints nothing (brief T19: no STATUS.md exists at the root or at
   rebuild/STATUS.md; rebuild/lanes/STATUS.md exists at H and is expected unchanged, MEASURED present). STOP: any other path.
   D-S11T3k-3: after this merge W11's DECISIONS.md holds the chain's lines (839 at H today); re-verify every DECISIONS:841/:842 citation in SP
   notes against it (names only), recorded for VERDICT-S11.
T20 [PM, (g)] AUTHORIZED --full AT M2: RUN x=full2, FILTER. PASS in order (PREDICTED from D:838 and BP):
   "POSTFIX M2-S11-NATIVE-LOAD AUTHORIZED mode=--full"; "SEAL BASE ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at <R 7> and that
   commit is an ancestor of this HEAD (DECISIONS:135 (4), rule=ancestor)" (BP:3554-3556; SEAL_TIP_RULE 'ancestor' BP:112); "ENVELOPE AUTHORIZED
   artifact=<64> reviewed at <A 40>; receipt base <R 40>; spec 321967ee... and runner bdbb8a93... pinned inside the artifact and re-read from
   Git" (BP:3796); "AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT; the FULL run with the private census is required" (BP:3907, :3616);
   "PRIVATE ORACLE PRESENT"; 39 CHILD; 10 LEGACY PASS (S10: 10, D:838); "FULL EVIDENCE ... 9 SUPERSEDED under DECISIONS:873"; "SEALED RUN
   RECORDED rebuild/lanes/b/tooling/receipts/S11.json; artifact=<12> spec=321967eeafef runner=bdbb8a938a9f over <n> pinned product file(s)"
   (BP:3933; n PREDICTED 320 = 320 declared, 0 released, every declared file present - writeSealedRunReceipt counts non-released files that exist, BP:3687-3700;
   record, never assert: D-S9SEAL-1); "SEALED RUN NEXT STEP commit rebuild/lanes/b/tooling/receipts/S11.json and write its sha256 <64> into
   rebuild/lanes/b/VERDICT-S11.md; ..." (BP:3704-3707); "POSTFIX PACKAGE PASS M2-S11-NATIVE-LOAD"; EXIT=0. The only write outside .tmp.
   STOP: "FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP" (BP:3560) = the chain moved after M2 (a freeze breach, recorded): repeat T19, re-run;
   "Exact independent verdict naming these artifact bytes" / "Reviewed artifact bytes" = L5 or V wrong; any red child (E1, or today-17's
   :816/:835 re-run rule, brief rev8 note: re-run and record every red).
T21 [PM] COMMIT C1 = rebuild/lanes/b/tooling/receipts/S11.json unmodified ("M2-S11-NATIVE-LOAD: sealed-run receipt of T20 (sha256 <8>...)").
   PASS: Get-FileHash of the disk file = the NEXT STEP sha; G -C W11 show --stat HEAD = that one file. (Uncommitted => T24 falls back to FULL,
   SEALED-RUN-RECEIPT-NOT-IN-GIT, BP:3625.) Between C1 and C3 the coach step (YML:452-453) is red by design (T23). Ledger: none.
T22 [BUILDER drafts from the PM's FILTERed lines only; Fable reads (D:843 (2); Astra not a gate, D:844 (3)); PM commits C2]
   rebuild/lanes/b/VERDICT-S11.md (path fixed: BP:3596 'rebuild/lanes/b/VERDICT-' + ID + '.md'). MUST contain the artifact, spec and runner
   sha256 (BP:3675-3676) and the receipt sha256 (BP:3681), or T24 stays FULL (SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-*). Sections in
   VERDICT-S10's shape (MEASURED headings: Authority; The evidence hashes this seal stands on; Sealed-run receipt; Terminals; CI; Export
   custody; Engine bytes; declared departures; Records and debts of this seal chain; carries restated; D-BLOM; The coach constant; What this
   seal carries for the athlete) with S11's own sections replacing S10's released-pair/D-EPP/D-GSS ones. No private value, count, hash or prose;
   ASCII, no U+2013/U+2014/U+00B7. What it must NAME is section 3 of this runbook. The Fable read's id goes into L6. Commit C2 = VERDICT-S11.md
   (and nothing else).
T23 [PM, (g)] COACH CONSTANT, commit C3. ERT standingSeal (:54-81, MEASURED): with the standing step `--package S11` (YML:186) and SP
   BRIEF-ACCEPTED and parent.chosen "S10", the expected literal before C1 is the PARENT receipt's = "M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699" = ECR:25
   today (window state, green); once receipts/S11.json exists it is receiptId(receipts/S11.json)+"@"+sha16 (ERT:62-64).
   [DIFF] ECR:25 moves from "M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699" to "M2-S11-NATIVE-LOAD@<first 16 hex of sha256(receipts/S11.json)>".
   Compute: <N> -e "const c=require('crypto'),f=require('fs');const r=f.readFileSync('rebuild/lanes/b/tooling/receipts/S11.json');console.log((JSON.parse(r).packageId)+'@'+c.createHash('sha256').update(r).digest('hex').slice(0,16))"
   (or: the first 16 hex of the C1 NEXT STEP sha, which is the same bytes). Edit ONLY the string literal on ECR:25. SP declares no rebuild/coach
   path (MEASURED 0), so C3 does not void the receipt. Commit C3 "M2-S11-NATIVE-LOAD: coach ENGINE_REVISION -> M2-S11-NATIVE-LOAD@<16>
   (sealed receipt of DECISIONS:<L5>)" (S10: c2135dc, same shape).
   Tests (exclusive, PM; %TEMP%\s11-t23.cmd in the RUN shape):
     "%NODE%" --test "rebuild/coach/test/*.test.cjs" > %TEMP%\s11-t23-coach.tap 2>&1   [DIFF: S10 first tried `--test rebuild\coach\test` (s10-t23.cmd)
       and re-ran with the glob (s10-t23b.cmd); the glob is YML:453's own form]
     "%NODE%" --test rebuild\m4\import\test\production-mapping.test.cjs rebuild\m4\import\test\production-admission.test.mjs > %TEMP%\s11-t23-prod.tap 2>&1
   each followed by its EXIT line. FILTER: Select-String -Pattern '(tests|pass|fail) \d+\s*$' and '^EXIT=' (the default reporter prints
   U+2139-prefixed "tests N" lines, not '# tests'; MEASURED in s10-t23-*.tap). PASS: both EXIT=0, fail 0. Counts PREDICTED: coach >= 377
   (S10 377/377), production pair 28/28 (child 7 m4-import-production needle '# pass 28' at T5b; P3-M3 opens on BRIEF-ACCEPTED, :826).
   STOP: any fail (recorded). Ledger: L6 carries the counts.
T24 [PM, (g)] BYTE-IDENTITY --full AT C3: RUN x=full3, FILTER (-CaseSensitive; D:838's false halt). PASS: AUTHORIZED mode=--full; SEAL BASE
   ON THE TIP; ENVELOPE AUTHORIZED; "AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY (DECISIONS:136 (3)); artifact, runner, spec and all <n> pinned
   product file(s) are byte-identical to the sealed run recorded in rebuild/lanes/b/tooling/receipts/S11.json <64>, ..." (BP:3894-3899)
   [DIFF: S11 has 0 released, so the ", plus 2 released and NOT re-verified here," clause is ABSENT]; no new SEALED RUN RECORDED; "POSTFIX
   PACKAGE PASS M2-S11-NATIVE-LOAD"; EXIT=0. STOP: "AUTHORIZED STEP UNAVAILABLE <code>" or "SEALED-RUN-RECEIPT-VOID" (BP:3903-3907) = it ran
   FULL: fix C1/C2, re-run; a FULL PASS is not byte identity. Then cmd /c rmdir "%TEMP%\earned-s11int\rebuild\conform\private" (reparse point
   only) and Test-Path -> False.
T25 [PM] C4 = VERDICT-S11.md made terminal for T24 (its T24 line and the coach counts) + every S11 seal review and report file not yet
   committed (S10 committed 14 at C4, D:838); push the lane (never C1-C3 alone). PASS: G -C W11 status --short -- rebuild .github shows only the
   two junction `!!` and nothing staged or untracked.
T26 [PM] CI-2 AT THE EXACT HEAD C4, THE BINDING RUN (D:563/:565; brief T26): <N> %TEMP%\pm4-ci.cjs rebuild/b-s11-integration 6, then
   pm4-ci-jobs.cjs <id>. PASS: both rebuild-public and both C font transport jobs "completed | success", no failed step, b-lom (YML:371-372)
   included (D:800: D-BLOM excuses no red public step), the S11-REGEN, W6 and C4B step verdicts read (STOP-S11-REGENCI). STOP: any red; a
   today-17 red on ONE OS only -> an empty re-run commit (D:816, :835; as S9's d7f6540), recorded with both run ids; a red on both OS is a STOP
   (as :832), never re-run around. Record the run id (D:627).
T27 [PM] FAST-FORWARD: G -C W11 fetch origin; G -C W11 merge-base --is-ancestor refs/remotes/origin/rebuild/t2-client-core HEAD -> exit 0;
   G -C W11 push origin HEAD:refs/heads/rebuild/t2-client-core (plain push, never --force). Refused: merge forward once, diff --name-only
   C4 <new> = rebuild/DECISIONS.md only, push the lane, ff at once, the chain's own run confirms (D:565). THIS PUSH DEPLOYS the slice preview
   (SH:29-35: push to rebuild/t2-client-core touching rebuild/m3/w7-preview/today/** or rebuild/slice/pwa/**): S11 changes 10 such paths vs
   edb8381 (MEASURED: today-entry.mjs, gym-model.mjs and 8 files under today/test/), so the push deploys. Owner authority: D:816 (2) "deploy at
   each seal" (brief section 1 and T27), so no fresh ask [DIFF: S10's runbook asked J2; S10's checklist and :838 used :816 (2)].
T28 [PM, P] LEDGER LINE L6 on the ff'd tip, D:838's shape (%TEMP%\s10-l6-body.txt, MEASURED), with S11 values:
   "- 2026-10-DD <U+00B7> Claude Opus 5.5 PM <U+00B7> M2-S11-NATIVE-LOAD SEALED AND MERGED: rebuild/b-s11-integration fast-forwarded onto
   rebuild/t2-client-core at <40> (tree = C4 <7>, the terminal VERDICT and the <k> seal review and report files). Authorized --full SEALED
   RUN RECORDED + POSTFIX PACKAGE PASS at M2 <7> (T20, exit 0, <n> pinned product files, 39 children, <j> legacy PASS, <re-runs or 'no
   re-run'>); byte-identity RE-VERIFY PASS at C3 <7> (T24, exit 0, <n> pinned, 39 children); sealed-run receipt rebuild/lanes/b/tooling/
   receipts/S11.json sha256 <64> (<bytes> bytes, C1 <7>); coach ENGINE_REVISION moved once to M2-S11-NATIVE-LOAD@<16> (C3; coach <x>/<x>,
   production pair <y>/<y>). CI-M1 at M1 <7> run <id> <conclusion>. CI-1 at A <7> run <id> <conclusion>. CI-2, the binding run (:563/:565),
   at <7> run <id>: rebuild-public and C font transport success on ubuntu and windows. VERDICT-S11.md (C2 <7>, terminal at C4 <7>) names the
   receipt and carries <the named debts of section 3, by name or by the VERDICT section that lists them>; every seal-run red of this chain:
   <list or 'none'>; Fable reads: T16 <id8>, VERDICT C2 <id8>. Private census junction removed after T24. What the owner gets: <plain words:
   the yes-only native next-weight offer on Today, kept through an import of his history, on the sealed S10 parent, with every new string
   approved>; this push deploys the slice preview through slice-host.yml as approved at :816 (2). Chain freeze lifted. <U+00B7> MERGED".
   Not runner-checked. Commit, push; read the confirming chain run and the SH run (pm4-ci.cjs rebuild/t2-client-core 6), recorded in the next
   PM line (S10: D:839 (1)).
LEDGER ORDER (chain): one PM record line for T7-T16 (as D:836) -> L5 POSTFIX-ACCEPTANCE (T17, freeze starts) -> nothing -> L6 SEALED AND MERGED
   (T28, freeze lifted) -> the PM's after-line with the chain and slice-host run ids. The token lines L1-L4 of S10 have S11 analogues already on
   the chain: GATE-SUPERSESSION :873, THEME :874, BRIEF ACCEPTED BY SHA :875; no RELEASE-FROM-SEAL exists or is needed (brief section 6).

## 2. S10 -> S11 differences in PART B, one line each ([DIFF] tags above point here)
- Package: M2-S11-NATIVE-LOAD (lanePackage S11), standing step `--package S11` at YML:186; slug s11-native-load; artifact
  rebuild/m4/spec/acceptance-s11-native-load.json, review rebuild/m4/spec/review-s11-native-load.json, receipt receipts/S11.json, verdict
  VERDICT-S11.md (S10: M2-S10-TODAY-SPLIT, acceptance-s10-today-split.json).
- 39 children, not 36 (S10's 36 with six-for-six s11-sup-* replacing S10's supersession children, plus native-load-fc12, w6-local-source-commit,
  w6-local-today-journey; SP notes[6]); every "36 CHILD" of S10 reads "39 CHILD". Needles came only from T5b's both-OS run 37102082564 (D:887);
  CI-M1 CONFIRMS them (brief rev9 note) - S10 took needles from a PM-seat re-observation (D:834).
- Product 320 declared (249 carried, 51 edited, 19 new, 1 superseded-by-child), 0 released (S10: 302 with 2 released): pinned n PREDICTED 320,
  T24's sentence has no "released" clause, VERDICT-S11 has no released-pair section, and there is no RELEASE-FROM-SEAL line.
- Token lines already on the chain: GATE-SUPERSESSION :873 (role "cowork (PM)"), THEME :874, BRIEF ACCEPTED BY SHA :875 (352743 B) - all three
  lineSha256 reproduced today; S10's were :829-:831.
- FC09 (D:878-885): a reachable genuine-use defect found by T5b (child 16 d-replay-all, P3-EN3 red both OS, D:877) was fixed on
  rebuild/b-s11-fc09 and fast-forwarded into W11 at 9b6d2aa (records commit; product at 7cf4a87); three NEW declared files (D:886):
  rebuild/m4/import/native-load-replay.cjs (82cc19d5), rebuild/m4/import/test/native-load-replay.test.cjs (132f8b09, CI home child 6 m4-import),
  rebuild/lanes/d/p3-replay-all/native-load-import.test.mjs (fc4c9fe6, CI home child 16 d-replay-all); 18 product posts moved (native-load.cjs
  ab2a1ca8, FC03 80393920, FC12 ced43957, today-entry b3de1c31, today-bindings 3cb27682, source-admission 902df9ff, production-mapping
  c178c0bd, s3-portable-sources 71e40171, replay-registry fe0b95a7, lift-correspondence a9640fa0, legacy-order-mapping 73bd6da7 and seven tests).
  The brief (frozen at T5, :875) predates FC09 and names none of these files (see section 4 D1).
- T7 preflight gains the T5b checks: O commits adafcc8 and 8bd959f not ancestors of the head, no .github/workflows/s11-observe.yml in the tree,
  obs/s11-1 and obs/s11-2 deleted on origin (D:887) and locally (E3: local obs/s11-2 still present).
- Exporter: the S11 literal port at LOCAL e93b1ed (9e6ac28c), not S10's d8ffbcf (de3aeb76); output "S11 PROFILE EXPORTED PENDING", folder
  earned-s11-profile-export-results, name s11-final-1; its containment delta read on final inputs and checker re-run are owed (E4).
- Clean step removes 3 entries (two junctions + rebuild/conform/run.log); the junction targets are not S10's earned-adm (E1).
- PATH: both git's and node's folders on EVERY cmd file (D-PATH-NODE, D:836); FILTER is -CaseSensitive (D:838 false halt) and adds 'OPEN '.
- Coach: ECR:25 moves from "M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699" to "M2-S11-NATIVE-LOAD@<16>"; coach test by glob (S10's t23b form).
- Reviewers: T16 and T22 are Fable reads (D:843 (2)); Astra gates nothing in PART B (D:844 (3)); S10's T16 was Fable 5.1 with Astra optional.
- Freeze announcement list: NATIVE-LOAD, S12, cleanup, Astra (brief T17). Deploy at T27 under :816 (2), 10 today/** paths (S10: 18 vs d7f6540).
- Private census target: S10's earned-s4 path is absent today (E2).

## 3. What VERDICT-S11 (T22) must NAME (brief T22 and its rev8-rev11 PART B NOTES, section 8 (5), DECISIONS:866-887; each "PAID" item is stated
## as paid and still true, each other item CARRIED by name with its owner step; nothing is excused)
EVIDENCE: artifact sha256 (T10), spec 321967ee... (or the sha at the sealed head), runner bdbb8a93..., receipt sha256 (T20 NEXT STEP), the
  T5b record (run 37102082564, attempt 1, both OS, artifacts 756552a3 / de9f3b41, record a96550dc, per-child table, every "summary withheld"
  block by child and OS) and the first T5b run 37079669559 (artifacts 0c0267d4 / 6143e5b5, record 339ce90a regenerated as 645f4555 after the
  'run undefined' record-tool correction, D:887) with its red; the T5b ledger lines :877 and :887; the run-name checks and every cancellation
  (D-S11R9-3: pipeline runs 37079669266 and 37102082581 could not be cancelled, HTTP 403 at :876, both draft-preview success, production
  skipped); the job read's (viii) finding on rebuild.yml :69-185 (D-S11R9-2) and its (vii) input differences (D-L4-INPUTS); CI-M1, CI-1, CI-2
  run ids; the exporter custody (e93b1ed, 9e6ac28c, s11-final-1, chain40).
EVERY RED (D:835): T5b run 1 child 16 d-replay-all red on both OS (P3-EN3 writer-enumeration :243, D:877) and its FC09 cure; the PM-seat T4
  candidate reds of :876 (3) (bundle-building cells on the local esbuild: today-17 803/829, w7-import 28/35, d-replay-all 24/28, package.test
  0/14; m4-import-production P3-M3 sealing-window red; d-plan-edit 89/90 builder seat) and the page-bundle seat offset of :879-:885 (E1);
  S4/2 clock cells red once (seat flake, :879); LOM-S6 red then R1 (:880-:881); I15 calibration red 2/4 on the parent (D-S11-I15CAL, :872);
  every red-first cell recorded as such (P3-M1, R2-REVISION, FC09-T5/Q1-A, Q3-B..I, M2/M3 rows) only as red-first; every red of T7-T26 itself
  (CI-M1, ci0 if run, any local CHILD-REQUIRED-EXIT-ZERO, any T14 BLOCKED, any re-run) with run ids.
EVERY INCIDENT: :883 HARD-LIMIT INCIDENT (round-8 builder regex count read files under a soak path; git ls-files listed soak path names);
  :884 (3)/:885 exclusions by path added and the debt that a symlinked path would be followed by the exclusion walkers; :876/:877 pipeline
  cancel refused HTTP 403; :877 dangling W11 junctions re-pointed (environment); :887 record-tool 'run undefined' correction; :866 PC
  unreachable 09-29..10-02 (nothing ran); :864 PC reboot during re-runs; :867 app restart killed Astra job 161; :849 (1) effort could not be set
  per agent; :851 one red-first plan held a fourth shared slot for 2 s; :847 (1) duplicate reads and (4) the finisher's append slip; :840 (6)
  launcher $n/$N clash; :842 capacity pause; this runbook analyst's names-only workflow listing (header); every PART B slip.
INHERITED FROM S10 (section 8 (5); D:838): D-BLOM (:798/:799; SP notes[8]); the released pair (:828) as S10's, not S11's; D-EPP-3's owed gates
  (port oracle, sensitivity pass, private gate, exact-head CI); D-GSS-TIMER; D-SPLIT-LISTEN; the ci0 red of :835; D-T16-1..5; D-PATH-NODE (:836);
  D-NODE-MODULES-HOME (:826) - now live again as E1; GSS-LATE-CLEAR, GSS-G5-DIAGNOSTIC, D-GSSFIX-1/-2 (:834) as VERDICT-S10 carries them.
BRIEF T22 LIST (rev7 text + rev8-rev11 notes): every carried debt of section 8 (5) (below); the parent's inherited debts by name (above);
  D-L12-CUSTODY PAID; D-L14-CI paid or carried; D-L12-CONFIG; D-L14-HOST-MUTANTS (R7-comp-reprice-host, R16b-comp-some-host LIVE on FA03 under
  the bounded current-host argument); D-L14-CALIBRATION; D-L14-OWNER (UNVERIFIED; paid only by checks the PM schedules at T29); D-L14-LEGACY-NULL
  PAID; D-R22L3-1..5, D-R22L4-1..3, D-L15-HOST-SHOW, D-R22L5-1 and L16 B1-B6 PAID (or carried by name); D-L15-EQUIVALENCE; round 24's read debts
  and every later round's; the capture-class limit (engine-capture.cjs:72-73); D-S11-W6DIR (notes[9]); D-S3-PORTABLE-STALE (notes[10]); the
  native-next-targets debt D-S11-NNT (notes[11]); D-S11-A1/A2 PAID, not carried (Astra 146); the panel copy gap D-S11-COPY-PANEL-MOUNT (alias
  D-COPYLOCK-TODAY-MOUNT, notes[13]) CARRIED as disposed at T6 (D:887); D-S10EXP-3 (and D-S11T3g-1 which carries it; D-S11T3g-2/-3 as paid or
  carried); the copy approvals D:798 (3), D:804, D:842 (2) (OWNER DELEGATED) with the re-binds :872 (92a4a0b4 -> dd197849) and the FC09 moves
  of native-load.cjs to ab2a1ca8 and today-entry.mjs to b3de1c31 (:881, :885-:886; see section 4 D2); the live equivalents (R22c-X6b, Fable
  l3 z01 and y07, the 23b live-equivalents); every seal-run red (D:835). rev8: D-R24-SPEC-SILENT (the 18 SPEC-SILENT mutants of round 24, :846
  (1), :847 (2)(a)); S24-H08's payment (L17-B6); D-S11-LSP-PORT-PINS (notes[12], :845 (3)); T3M-1..3 (T3M-1, T3M-2 carried in the ledger and
  VERDICT, not in SP, :887); D-S11T3k-1..4 (D-S11T3k-3 carried, :887; verify the cited D numbers after T19) and the open per-item debts
  D-S11T3c-4, D-S11T3d-1..3, D-S11T3e-1..3, D-S11T3g-1..3, D-S11T3l-2..3, each PAID at T6 or CARRIED; the Astra 146/148 named debts (brief
  section 15); TODAY17-HARDEN named OUTSIDE S11 (:844 (5), :847 (4); carried by the next reseal, 86eca40 on rebuild/c-today17-harden), with
  the :816/:835 re-run rule applied at T20/T26. rev9: the T5b record and ledger line (above); D-R25C-5 (alias Fable fy23) on the post-S11 list;
  the round-26 closing reads' debts; D-S11R8-1..4 as section 15 maps them; D-L3-CITES (paid in text) and D-L3-FILL (paid at T6 (g)). rev10:
  the POST-S11 SPEC CLARIFICATION LIST as one carried item; Astra L4's L4-B1/L4-B2 (paid in text), D-L4-INPUTS, D-L4-MEASURE, D-L4-DEPLOY;
  D-S11R9-1..3. rev11: Astra L5's L5-B1 (paid in text) and D-L4-INPUTS / D-S11R9-2, D-L4-MEASURE and D-L4-DEPLOY / D-S11R9-3 with their owner
  steps; Fable l8's D-S11R10-1 (the \r?\n split) and D-S11R10-2 (the :2835 error form) as paid and checked; every "summary withheld" block;
  the NATIVE-LOAD state at the S11 head (see NATIVE-LOAD below, superseding rev11's "round 28/29" text); H-05 and D-R28A-1 named debts; the
  post-S11 list extended by H-06 and H-07; SS-19 = H-05 (PM, :854 (4)).
SECTION 8 (5) HANDOFF LIST (to be named as carried or paid): D-BLOM; D-R9.10-VECTOR-COUNT-STUCK; SET_COUNT_BASIS_UNPROVEN generic copy (spec
  :481, display stays PROPOSED); RESIDUAL (iv); D-L12-ISSUANCE (imported native sources stay refused, NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN);
  D-L13-TYPED-C2; D-R13-LEGACY-OVER-NULL-ASK; D-R13L1-3; D-L14-RECOVERY; D-L14-OWNER; D-L15-EQUIVALENCE; the capture-class limit; the 17
  deferred files; the stale "PROPOSED" comments at today-entry.mjs :169 and native-load.cjs :162 (D-S11R7-4 (c), D-S11T3l-4; re-check the line
  numbers at the FC09 bytes); D-R25C-5; the round-26 items B-R25C-1..4 and L18-B1..B10; B-R26F-1..2, B-R26C-1..6, L19-B1..B6 and round-27/28
  items as PAID once the final closing reads accepted (they did, :870); round 29's product change (H-01..H-04, RECORD_INVALID, inside grant (a),
  widened at :854 and superseded by rounds 30-34b, see below).
NATIVE-LOAD AT THE S11 HEAD (D:854-:870, then composed at :871-:872): rounds 29b-34b product moves inside grant (a) (FC01 dd197849 incl. the
  L23-B5 issuance change authorized for that item only, :865-:866; FC03 38c67a98 at T1, eb8fcfe3 after the :872 re-bind, then 80393920 after FC09 (:886); PRODUCER_REVISION
  3c862537 -> a860376d on the composed engine, :872, then moved by FC09 :879); the owner's bar of :866 ("NATIVE-LOAD is done when no problem
  reachable from genuine use remains"); T1 closed at :870 on round 34b (Fable b67d7d04, Claude Opus 01a3545d, Astra L26 0f72a516), committed
  35859dc. Named debts: D-R33-1..5; D-R33F-1..5; D-R33C-1..6; D-READER-ONLY (reopens if any sync, import or second-device path writes into a
  closed session); D-R34F-1..3; D-R34C-1..3; D-L25-M08, D-L25-M09, D-L26-SCOPE; EFFECT_CONFLICT holding a later yes (D-R34F-2 = D-R34C-3)
  accepted as R8; D-R29F-1..9, D-R29C-1..6; D-R30-V43-V44, D-R30-V45, D-R30F-1..8, D-R30C-1..6, D-L21-*; D-R31F-1..4, D-R31C-1..5 (K08/K10 =
  D-R31C-3, D-R30C-5 carried); D-R32C-1..4, D-R32F-1..4; D-HSW-3 (accepted), D-HSW-4 and D-HSW2-1 (carried); D-T5B-1 (paid by the PM's read of
  all 78 rows, :859); D-S11R11-1 (round-29 citation stale; carried in the T1 line and VERDICT, :855) and D-S11R11-2; D-L6-STOP-SCOPE (:855).
  POST-S11 SPEC CLARIFICATION LIST (one carried item): D-R25C-5, D-R26C-3, K766, P1470, P1483, P428, P906, H007, H022, H026, H042, H-06, H-07,
  the round-28 run-not-classified and spec-silent ids (by classifier file sha), D-R30C-1 (P405-P413 field names), D-L21-OPAQUE, TE S1-S4 and
  D-R31C-5 (:861-:863), spec :81's refusal sentence (:872).
S11 RESEAL (D:871-:887): D-S11-I15CAL (:872, :876); the copy re-bind :872; the composition-seam test edit FC12 R25-F2 (b) (:872); the pin-search
  correction b8e8eb3d at production-mapping.cjs :63 not :56 (:876) and the engine digest's move under FC09 (P3-M1 red then green, :880);
  D-S11T3iF-1..4, D-L3-MULTI, D-L3-SPEC81, D-L3-T1-CARRY (:876); FC09 debts (:878-:885): D-S11-FC10, D-S11-EN3-COPY, D-S11-EXIT-CODE, D1 unknown
  lift-keyed map passes the boundary, D2 post-import rename without a writer, the admission view workout_facts split (no reader), F9
  superseded-only refusal (Opus N2), resolver refusal on two setup ops (Opus N3), symlinked paths followed by the exclusion walkers, and the
  question to verify before T29 (does a first-run phone without an import ever reach a native-load earn); FC09 reads (Astra L1 3dce977b REJECT,
  L2 d539449c, L3 3b26ea29; Fable l1 13c0f440, l2 905ab32f REJECT B3, l3 3204042b; Claude l1 3348e9bd, l2 a8492f04 REJECT B1, l3 78c1ef88);
  the builder-changed cell expectations judged by the readers (Q1-A -> NATIVE_LOAD_PLAN_CHANGED, Q3-G EFFECT_CONFLICT, C5 claimed equivalent);
  the PRODUCER_REVISION move ruled at :879 and option (i-b) refused; STOP-S11-WRITERS and STOP-S11-ECAP CLOSED (:887); STOP-S11-OBSERVE for
  child 16 CLOSED (:887); the remaining open S11 STOPs of section 12 each closed by this chain or carried by name (PHONE and R20B1 stay open
  for T29/T30).

## 4. PM decisions needed BEFORE the step they gate, and findings that would stop the seal
STOPPERS (each MEASURED today; none is a product defect):
S1 (E1, gates T8/T12/T14/T20/T24) The PM seat cannot reproduce CI's W5 install: W11's rebuild/m3/w5/node_modules points at a W6 node_modules,
   the S10-era earned-adm targets are gone, and the seat measured page-bundle counts 4 below their pins (:879-:885). Every local b-package run
   executes today-17 (package.test.cjs) and w7-import (page-bundle.test.mjs) and requires exit 0: PREDICTED CHILD-REQUIRED-EXIT-ZERO. PM
   decision: provide a CI-equal W5 node_modules (CI: `pnpm --dir rebuild/m3/w5 install --frozen-lockfile --ignore-workspace`, YML:67) by a
   route the rules allow (an install is outside this seat's practice; D-NODE-MODULES-HOME; Joe if an install is required), then show today-17 and
   w7-import green at the seat at H (pass/fail only) BEFORE T7, and record the junction targets used at T9/T11.
S2 (E2, gates T14) The private census junction target named by the S10 runbook (%TEMP%\earned-s4\rebuild\conform\private) is absent; the PM
   names the current target (Test-Path only, never listed) before T14, or T14/T20 BLOCK.
S3 (E4, gates T10) The exporter's pre-T10 obligations are not recorded as done: the Fable containment delta read on the FINAL inputs (H
   01a7050, SP 321967ee, runner bdbb8a93) and the PM's checker re-run with --runner-sha bdbb8a93 (D:848 (4) EXPORTER; brief 7). Dispatch both
   now; they can run in parallel with T7.
DECISIONS for the PM (no stop by themselves, but each must be ruled and recorded before the named step):
D1 (before T7) BRIEF vs FC09: :878 (5) planned "a brief amendment for the new declared files"; the brief was frozen at T5 (:875) and was not
   amended; :887 lets the :885 three-read closure stand as T6's re-review. The runner pins the brief's bytes (unchanged, 4f7d431f at H), so the
   seal can run; the PM rules whether the FC09 declarations (three new files, 18 moved posts, the native-load.cjs :443 engine-file move of :879)
   are recorded in VERDICT-S11 only (no rev12) - and says so in the T7-T16 record line. A rev12 would re-open T5 (both reads, a new BRIEF ACCEPTED
   BY SHA line), T6 and T5b.
D2 (before T16) COPY BINDING after FC09: THEME :874 states the D:842 copy approval was re-bound to native-load.cjs dd197849 (:872); FC09 moved
   native-load.cjs to ab2a1ca8 (:881/:886) and today-entry.mjs to b3de1c31 (:885 C4b PAGE_PINS re-pin), and no ledger line records the approval
   re-bound to those bytes (the s10-copy-lock child, '# pass 11', is green on both OS at T5b, so the lock holds mechanically; :856 (3) keeps the
   approval valid only if no approved string changed). The PM records the re-bind (one PM line) or names it in VERDICT-S11.
D3 (before T7) delete the local obs/s11-2 ref and its worktree (E3), recorded.
D4 (T8) run or skip the optional --ci at M1 (skippable if CI-M1 is green on both OS; S10 skipped it after its ci0, :836).
D5 (T10) push e93b1ed to origin as rebuild/p-s11-exporter-v1 after the export (S10's d8ffbcf is on origin; the brief keeps it local until T10).
D6 (T17) the wording of the T7-T16 PM record line, which must carry every red of T7-T16 and the E1-E5 dispositions before L5 (nothing may follow
   L5 but L6).
D7 (T22) VERDICT-S11's dispositions for every item of section 3 that the ledger leaves as "PAID or CARRIED" (D-S11T3c-4, T3d-1..3, T3e-1..3,
   T3g-1..3, T3l-2..3; the Astra 146/148 debts per brief section 15).
NOT A STOP (checked): preflight 0 hits; merge-tree clean; O commits not ancestors; no s11-observe.yml at H; obs/s11-1/-2 absent on origin; SP's
   three token-line claims reproduce on the chain; runner = SP runnerSha256; exporter literals and imports match H; no rebuild/coach path in SP;
   the coach constant is green in the window state today.

## 5. Order and what runs in parallel
NOW, together: S1 (seat W5 environment, then today-17 and w7-import green at H) || S2 (census target named) || S3 (containment read + checker
re-run) || D1/D2 rulings || D3. Then serial on one worktree (exclusive runs cannot overlap): T7 (CI-M1 runs while the PM does T9-T11) -> [T8]
-> T9 -> T10 -> T11 -> T12 -> T13 (CI-1 starts) -> T14 (while CI-1 runs) -> T15 -> T16 (Fable may start on A and the T12/T14 lines before CI-1
ends) -> T17 (freeze) -> T18 -> T19 -> T20 -> T21 -> T22 (builder drafts while the PM does T23; the PM can compute the T23 literal from C1) ->
T23 -> T24 -> T25 -> T26 -> T27 (deploys under :816 (2)) -> T28 (freeze lifted). Skippable without loss: T8 (if CI-M1 green). Critical path:
S1 (no local seal run passes without it) and S3 (no export without it).
