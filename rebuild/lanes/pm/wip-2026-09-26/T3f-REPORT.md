# S11 T3f REPORT - REBIND S11.json onto the sealed S10 (builder, claude-opus-5-5, 2026-09-26)

Plan of record: S11 brief DRAFT rev5 (0b851be6) s11 T3f, s1, s5.1, s5.2, s12; Fable l3 of rev5 read for T3f items (none owed at T3f beyond D-S11R5-1's "counts PENDING"). DECISIONS:837-839 read (839 has no ruling on T3f or W6DIR).
Worktree: %TEMP%\earned-s11-t3f, HEAD 9288adfc782a10ea4d3de098723955db9515f3b6 (detached; parents b5bbc57 + 71cf143), not switched, nothing committed, staged, fetched or reset. Scratch: %TEMP%\s11-t3f-scratch\.
VERDICT: DONE. S11.json rebound on the sealed S10 by S11-REGEN --write at parent edb8381. S11-REGEN.test.cjs 196/196. One ruling returned (STOP-S11-W6DIR), plus two PM notes (N1 and N2 below).

## 1. What changed (one file)
- rebuild/lanes/b/tooling/packages/S11.json
  - before (HEAD blob at 9288adf): dfb5cb93674092ffd1af177ba52f1eacb8113e5f352eb45d91abe1f6d1c0990a (112124 B)
  - after hand edits, before --write: 38deace7001d56597e96c7ad1387755aca792cc79c152043870704fc0ceaf9f9
  - after S11-REGEN --write: d8e3f2b0cd474790b2b3b526afe365e8e546e8891e69e07de8e6d2510f513a4f (115165 B; ASCII only, 0 CR, 2108 LF, ends "}\n", 0 U+2013/U+2014)
  - full diff saved: %TEMP%\s11-t3f-scratch\S11-json-T3f.diff (f8013d4d87f5d7e1267cee47f4be75efa57806fb00c917c0b359b5e6f9f8f02a, 39313 B, git output via cmd redirection)
- Unchanged and not touched: S11-REGEN.cjs bf87138fd6e794f7af1c93a1de5efea679446f93add62d6291607b314bc303c9, S11-REGEN.test.cjs 77e85624e64e707bb220c710a4f28a435b03537f210d50ffad5bf2caa89326c2, packages/S10.json 0f55a704 (= edb8381 blob).

### 1a. Filled by S11-REGEN --write --parent edb8381 --receipt-line 837 --allow-stale-notes
- sourceBase = edb8381ea6a9f5373c8519ee7e9d7d8a303c2369; parent.decided true, chosen "S10".
- parent.options[0].sha256 = 42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8; reviewSha256 = 8d9132787373e9e3e9a3ee1f91be8c403867acd9b8136a6390d1029a1d6a2a0a; receiptLedgerLine = 837 (number).
- tooling.runnerSha256 = 9fbfdd2d... (runner at HEAD = the S10 runner; see N1).
- product: 310 paths {"edited":14,"carried":286,"new":9,"superseded-by-child":1}; the ONLY moved entry: packages/S10.json superseded-by-child PENDING->PENDING => 0f55a704->0f55a704 (see N1). Every other pre already equalled the sealed artifact's product map (the cushion held) and every post equals HEAD and disk.
- notes[1] PRODUCT MAP, [2] PARENT-UNPINNED PATHS, [3] EXECUTION PIN SUPERSEDED regenerated at edb8381 / HEAD 9288adf.
- Independently verified (byte-exact blobs by cmd redirection into scratch\x, Get-FileHash): artifact 42a3eb02 (112116 B), review 8d913278 (484 B, status ACCEPTED, receipt.commit ca7f676, line = the D:837 POSTFIX-ACCEPTANCE line with dcb73ec), receipts/S10.json 3c6d1f5d (envelopeKey ACCEPTED:42a3eb02...:dcb73ec...:ca7f676...), S10.json 0f55a704, runner 9fbfdd2d, all at edb8381 and equal on disk.

### 1b. Hand edits (T3f builder, before --write, via edit_block; REGEN carries them)
- parent.options[0].note (was PENDING STOP-S11-PARENT citing candidate 9849bc7), shaped exactly as S10.json's S9 note: "Accepted S10 parent artifact and review; receipt DECISIONS:837 (POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT, reviewed commit dcb73ec, receipt base ca7f676); sealed and merged at DECISIONS:838, seal tip (fast-forward) edb8381 (this spec's sourceBase)."
- child 20 ui-pack-pins and child 22 release-object: the r2 cites "S10 observed "# pass 121"/"# pass 14" at e9ff2ca (DECISIONS:834)" replaced by the sealed forms "# tests 121" / "# tests 14" (packages/S10.json 0f55a704 at edb8381; D:835 restoring the S9 form, ubuntu prints tests 121, pass 118, skipped 3; both OS at CI-2 36224004547, D:838), still PENDING STOP-S11-T4, plus "S11 inherits the '# tests N' form (brief 5.1, STOP-S11-NEEDLEFORM)".
- child 1 today-17: count now "the sealed S10 needle "# pass 726" ... plus the FA03 count at the T1 head"; FA03 count PENDING until T1 commits rounds 22-23b (47 at round 21 bd7654a named as the last committed count, D:827; no uncommitted count recorded). Still PENDING STOP-S11-T4.
- child 37 native-load-fc12: "22c 247 builder-reported; 22d in progress" removed; count PENDING until T1 commits rounds 22-23b (235 at bd7654a named as last committed, D:827). Still PENDING STOP-S11-FC12N.
- The other 32 children with a candidate cite: "S10 observed "X" at e9ff2ca (DECISIONS:834)" -> "the sealed S10 needle is "X" (packages/S10.json 0f55a704 at edb8381; both OS green at CI-2 run 36224004547, DECISIONS:838)" (mechanical, values unchanged; every one still PENDING STOP-S11-T4). Child 15 w6-local-source (no commit cite) untouched.
- notes[6]: "(DECISIONS:834)" -> "(sealed in packages/S10.json 0f55a704 at edb8381, both OS at DECISIONS:838)".

## 2. SCOPE verified before any run (static)
- S11-REGEN SCOPE = 40 entries: S10-REGEN's 36 VERBATIM and in the same order (S10-REGEN.cjs on disk 98d1cfffc1c59672fbae34e5089a29c2b0e2ece011486f18c78b6ec0934c0932 = the header's cite) plus exactly the four documented exact files (S10-TODAY-SPLIT-BRIEF.md, S11-REGEN.cjs, S11-REGEN.test.cjs, rebuild/m3/w6/t2-stage.cjs); none in S10 missing.
- Scoped diff edb8381..HEAD over SCOPE with src/, ledger/, *soak*, conform/private and the protected five EXCLUDED = 23 paths (the 20 NATIVE-LOAD product/test paths + S11-REGEN.cjs, its test, S11.json); the same diff WITHOUT exclusions counted (count only, names not shown) = 23: no forbidden or protected name enters discovery. REGEN printed "23 changed path(s) in scope, 1 of them never read", "628 path/revision pair(s) validated", "318 exact paths" reviewed inventory.
- For Astra job 142 (observations, not defects): (i) REGEN spawns `git` from PATH, so the cmd file must put the git folder on PATH (mine did); (ii) the protected five ARE S11 product keys (carried), so protectedPost ran for all five: ls-tree object ids at P and HEAD plus `git status --porcelain -- <file>`; no content is read by REGEN, but git status may stat/hash the working-tree file to refresh the index (git-internal; nothing reaches output); all five carried, no refusal.

## 3. Runs (all through pm-run.cjs shared, one slot at a time, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, NODE_OPTIONS=--require s10-t4-guard.cjs, S10_T4_CHILD=<job>, NODE_PATH as run5.ps1)
| job | what | result |
| s11-t3f-regen-dry1 | dry run on the untouched draft | EXIT 0; 1 entry would change; PENDING census 62; 5 STALE notes [0][4][5][6][7] |
| s11-t3f-regen-dry2 | dry run after hand edits; --write without --allow-stale-notes; --write without --receipt-line | EXIT 0 (census 61); EXIT 2 "S11-REGEN REFUSED: 5 carried note(s) still cite the S10 candidate or a draft-time claim ..."; EXIT 2 "S11-REGEN REFUSED: --write needs --receipt-line N ..."; S11.json 38deace7 before and after (nothing written) |
| s11-t3f-regen-write | --write --receipt-line 837 --allow-stale-notes; then dry run 3 | EXIT 0 "WROTE ... d8e3f2b0..."; dry3 EXIT 0 "0 entr(ies) would change", census 54 |
| s11-t3f-regen-test | node --test --test-reporter=tap rebuild\lanes\b\S11-REGEN.test.cjs | "# tests 196 / # pass 196 / # fail 0", EXIT 0, 0 "not ok" |
Logs: scratch\regen-dry1.log, regen-dry2.log, regen-write.log, regen-test.tap, pmrun-*.out. Guard: 0 S10-T4-GUARD lines in any log; 0 s11-t3f lines in %TEMP%\s10-t4-guard.log.

## 4. Red-first witnesses (no test, assertion, guard or pin was added or changed; S11-REGEN and its test are byte-unchanged)
- W1 REBIND. RED (dry1, before): "product: 310 paths ...; 1 entr(ies) would change" / "rebuild/lanes/b/tooling/packages/S10.json: superseded-by-child PENDING ->PENDING   =>  superseded-by-child 0f55a704->0f55a704" and census 62 incl. $.sourceBase $.parent.options[0].sha256 .reviewSha256 .receiptLedgerLine .note $.tooling.runnerSha256. GREEN (dry3, after): "product: 310 paths ...; 0 entr(ies) would change", "PENDING census on disk: 54 value(s)" with none of those paths.
- W2 WRITE GUARDS (observed red, kept): "S11-REGEN REFUSED: 5 carried note(s) still cite ..." EXIT 2 and "S11-REGEN REFUSED: --write needs --receipt-line N ..." EXIT 2, file hash unchanged; green = the --write with both conditions met.
- W3 NEEDLE CITES (static, scratch\verify-needles.ps1): 35 sealed-needle cites (children 1-36 except 15) equal S10.json 0f55a704's needle by child name and order, 0 mismatches; 0 occurrences of e9ff2ca and of DECISIONS:834 remain (34 and 35 before).
- W4 the draft's '# pass 121' / '# pass 14' r2 forms (red per D:835) now read '# tests 121' / '# tests 14' = S10.json 0f55a704 children 20/22 (W3 covers them).

## 5. Counts
- PENDING values 62 -> 54 (word PENDING 67 -> 60). Filled: sourceBase, options[0].sha256/.reviewSha256/.receiptLedgerLine/.note, tooling.runnerSha256, product[S10.json].pre/.post.
- The 54 left, each still naming its STOP: packageId, brief.file/.sha256/.acceptedLedgerLine (STOP-S11-ID/-BRIEF); coverage.superseded.rulingLineSha256 + five gates[*].why (STOP-S11-GSUP); authorizations.owner.line/.contract.line (STOP-S11-AUTH-TEXT), .theme (STOP-S11-THEME), .review.prefix (STOP-S11-ID); artifact.file/.review (STOP-S11-ID); children[0..37].needle (STOP-S11-T4 x35, child 15 STOP-R21B-1 + STOP-S11-W6ADM, child 37 STOP-S11-FC12N, child 38 STOP-S11-W6ADM). Full list: scratch\census-after.txt.
- STOP ids in the file: 19 distinct before and after. STOP-S11-PARENT gone (its five values filled and re-verified against the blobs, s1a); STOP-S11-NEEDLEFORM added (children 20, 22); counts moved RUNNER 4->1, BASE 2->1, W6ADM 5->4 (regenerated notes, N2).
- FC12 / FA03 counts: PENDING (T1 head). The product posts of FC12 and FA03 are the round-21 bytes at 9288adf; T3k re-measures.

## 6. PM notes (builder mechanics, disclosed; reversible)
- N1 STOP-S11-RUNNER values now hold T3f measurements. REGEN --write sets tooling.runnerSha256 and product[S10.json].pre/.post by measurement, so the two STOP-S11-RUNNER PENDING strings became 9fbfdd2d (the S10 runner, no S11 hunk yet) and 0f55a704 -> 0f55a704. This follows the draft's own convention (notes[5]: "Until they land every such file is declared at its S10 post here; S11-REGEN re-measures each") and T3k's REGEN --write re-measures after T3e's hunks; STOP-S11-RUNNER stays named in notes[5]. If the PM wants the two values re-marked PENDING STOP-S11-RUNNER until T3k, it is one edit each; I did not do it because REGEN's regenerated notes[3] would then disagree with the product value.
- N2 --allow-stale-notes was used, with the list printed. The five flagged notes are still TRUE at these bytes (draft status, the prep MERGE record, the T3c-T3e items not yet authored in this worktree, the GSUP ruling still open, the open-items list). The T3k/T6 final --write must run WITHOUT --allow-stale-notes after [0], [4], [5], [6], [7] are re-authored. Also for that re-author: notes[0] still names brief rev3 and says REGEN "at T3k fills sourceBase ..." (now filled at T3f, re-filled at T3k); the regenerated notes dropped three draft facts the PM may want back in a carried note: FC12/FA03 MOVING with round-21 posts (old [1]), local-source-commit.test.mjs "declared on PROPOSAL only, bytes unchanged (STOP-S11-W6ADM)" (old [2]), and "H3, S3..S9.json carried until the T3e re-pins" plus the STOP-S11-RUNNER cite (old [3]).

## 7. RULING NEEDED - STOP-S11-W6DIR (decided nowhere here)
Facts (MEASURED at 9288adf, static only; the two files were NOT run): rebuild/m4/workout/test/engine-capture.test.cjs:5 and configuration-capture.test.cjs:8 throw 'Provide retained PERFORMED_W6_DIR' at load; they import strict-json.mjs, capture.cjs (and engine-capture also public-client.mjs, test/support.mjs, w5/crypto.cjs, commands.cjs, project-history.mjs) from that root. No workflow sets it (rebuild.yml:360-361 comment, S10's wording) and no S10/S11 child names either file. NATIVE-LOAD moved both (numstat vs edb8381: engine-capture.test.cjs +8/-2, one new test 'incomplete per-set plan vectors cannot silently flatten to the scalar card load R9.10'; configuration-capture.test.cjs +8/-1, the [40] vector REMOVED from the refusal loop and a new R9.10 test asserting [40] captures fitted [40,40], D:803 (e)/:804). FC12 carries the R9.10 fit semantics without that root (44 lines cite R9.10; FIT-ORDINARY-UP :3933, FIT-ORDINARY-DOWN :3941, FIT-DEBUT-UP/DOWN :3947, FIT-IDENTITY :3960, FIT-MALFORMED :3975). rebuild/lanes/d/P3-LAYOUT-V2-AUTHOR-REPORT.md:199-205 and :252-262: nine m4/workout suites need the root, and pointing it at the LIVE tree fails configuration-capture:52-53 (expects WORKOUT_CAPTURE_INVALID from the retained capture.cjs, gets ENGINE_CAPTURE_PROFILE_INVALID), so a provisioning child needs a NAMED retained revision, which nothing I read records. Their guard status is unmeasured (the fixture loads rebuild/engine/writers.cjs through performed-proposal/source.cjs).
Question: how does S11 carry the two capture test files that need PERFORMED_W6_DIR?
- A (RECOMMENDED) Named debt D-S11-W6DIR: no child, no rebuild.yml step; S11.json note + VERDICT-S11 name both files and their two R9.10 cells (incl. the changed configuration-capture assertion) as unobserved by the package and CI; the R9.10 semantics stay CI-observed through FC12's FIT rows (child 37 + the CI FC12 step); optional PM-seat evidence at T4 (pass/fail only, under (g) if the guard trips) with a retained root; a provisioning packet after S11. Cost zero on the S11 path; same shape as S10 (rebuild.yml:360-361).
- B Provisioning child (e.g. s11-w6dir-capture, a plain-script wrapper like child 35) that materialises a PM-named retained revision, sets PERFORMED_W6_DIR and runs both files; plus a rebuild.yml step, fence row, runner/CHILD_SPECS registration (T3e) and a both-OS needle (STOP-S11-NEEDLEFORM). Makes the changed assertion seal-binding; needs the retained sha named, a guard classification at T4, T3e changes and one more review on the S11 critical path.
- C Hybrid: a CI-only rebuild.yml step with a retained root (no package child, no needle) plus the named debt of A. CI sees the cells without a new seal needle; still needs the retained sha and the T3e fence row.
Why A: FC12 already covers R9.10 in CI on both OS; B and C each need a retained revision nobody has named and a guard classification no builder seat can measure, and they add runner/fence bytes to the S11 path for cells whose semantics FC12 already pins.

## 8. STOPs and PENDING still open after T3f (none filled by guess)
STOP-S11-ID, -BRIEF, -THEME, -GSUP, -AUTH-TEXT (in the file), -T4 (35 needles), -FC12N (child 37), -NEEDLEFORM (children 20/22 and every added needle), -W6ADM (children 15/38), STOP-R21B-1, -RUNNER (N1), -W6DIR (s7), -BASE (sourceBase filled; the T3k re-measure owed), -PARENT (filled; re-verify at T3k/T6 owed per brief s1), and the brief-level STOPs outside this file. FC12 and FA03 counts PENDING until the T1 head (rounds 22-23b uncommitted; Fable R23 l1 and Astra L16 reading).

## 9. git (explicit paths)
git status --porcelain -- rebuild .github:
 M rebuild/lanes/b/tooling/packages/S11.json
git diff --stat -- rebuild/lanes/b/tooling/packages/S11.json rebuild/lanes/b/S11-REGEN.cjs rebuild/lanes/b/S11-REGEN.test.cjs:
 rebuild/lanes/b/tooling/packages/S11.json | 100 +++++++++++++++---------------
 1 file changed, 50 insertions(+), 50 deletions(-)
HEAD 9288adfc782a10ea4d3de098723955db9515f3b6 (unchanged).

## 10. Not done / limits
Nothing committed, staged or pushed; no other worktree touched; the two PERFORMED_W6_DIR files not run (no root, guard status unknown); no protected, src/, ledger, soak or private path opened; DECISIONS.md read (:835, :837-:839) not written. Scratch tools: scratch\scope-diff.ps1, parent-facts.ps1, census.ps1, verify-needles.ps1, post-write.ps1, stops.ps1, regen-*.cmd; extracted blobs in scratch\x.
