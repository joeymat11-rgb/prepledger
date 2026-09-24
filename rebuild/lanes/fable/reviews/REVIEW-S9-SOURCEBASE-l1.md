# REVIEW-S9-SOURCEBASE-l1: S9 round 7 (b), the sourceBase move under DECISIONS:804

Reviewer: Claude Fable 5.1 (independent; did not write the change). Date 2026-09-24.
Worktree C:\Users\joeym\AppData\Local\Temp\earned-s9int at HEAD 8306c3f, two uncommitted files
(git status --porcelain: M rebuild/lanes/b/S9-FINAL-ASSEMBLY-PREP.md, M rebuild/lanes/b/tooling/packages/S9.json).
Judged against: the builder's task (items 1-6), %TEMP%\opus55-RULES.txt, DECISIONS:804 (option (A), P-S9-1 :627 AMENDED),
:529 (the S8 seal at e8712f48), :627 (P-S9-1, P-S9-5), :757/:766 (Astra's source-checker record), :798/:799 (D-BLOM).
Protected five never read, hashed or loaded; compared by git ls-tree blob id only. Node sha256 over git cat-file blobs
(node crypto, no PowerShell redirection). Scratch: %TEMP%\fable-s9r7b (premeasure.cjs, shas.cjs, inspect.cjs, static.log,
static-r7b.log, the two diffs). Read-only for the two deliverables; this file is the only write.

## VERDICT: ACCEPT WITH NAMED DEBTS

Every task item is done and every measured claim I re-measured holds. The debts are disclosures and wording, none moves a byte
of S9.json.

## 1. The diff, whole (git diff -- <explicit paths>)

S9.json (+9/-2 against HEAD; HEAD still carries round 7 uncommitted, so the diff shows rounds 7 and 7(b) together):
- :16 sourceBase 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f -> e8712f48b32e33738cdf81dd8d6cd72d0a72523d (7(b)).
- product["rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs"] = {pre 237dcb89..., post f3c470c6..., role new} (round 7, kept).
- :1784 the D-BLOM note re-worded around 0cd07be (7(b)); no other line.
Working-tree S9.json sha256 bb169a67847d10963fcaa0d69c14d5e157ad0a81525e22352ef116d6071ac86c, 91741 B, LF, 33 U+2013/U+2014
(HEAD's committed copy also has 33: none added). 0cd07be appears 3 times, all inside the D-BLOM note; e8712f48 3 times.
S9-FINAL-ASSEMBLY-PREP.md (+128 lines, sections "Round 7" and "Round 7 (b)"), sha256
f5076a0a5e6acff269f37448b215b91cab8a4cd9507ab81d4e1825d7275a1df0, 38135 B, LF, 0 U+2013/U+2014.

## 2. Item by item

### Item 1, the move: DONE
e8712f48 is a commit ("M2-S8-REAL-SHAPE: VERDICT-S8.md terminal (byte-identity)", one parent 5795eba). git merge-base
--is-ancestor: 0cd07be, d79ebd2 (S8 review) and ef49245 (S8 receipt) are each ancestors of e8712f48 (exit 0); e8712f48 is an
ancestor of HEAD 8306c3f, of 6dc2596 and of refs/remotes/origin/rebuild/t2-client-core (exit 0 each). The runner's
SOURCEBASE-NOT-BEHIND-HEAD (b-package.cjs:2597, :3769) and the fence's condition (5) (sealed-inventory-fence.test.mjs:322) hold.

### Item 2, every pre re-measured: DONE, 0 moved (independently reproduced)
My premeasure.cjs, per S9.product key: git ls-tree blob id at 0cd07be and at e8712f48, then node sha256 of the e8712f48 blob
for public files only.
- 256 entries: 230 pre = sha256(blob at e8712f48); 21 pre null and absent at e8712f48; 5 protected (rebuild/engine
  seed/migrate/merge/index/oracle-shim.cjs, all role carried) with the SAME blob id at both commits; 0 blob ids differ.
  So every pre is exactly what it was: PRE VALUES THAT MOVED: NONE, as the prep says (7b.2).
- S8 parent pins (acceptance-s8-real-shape.json product + executionPins, 295 map entries over 227 unique files): 290 public
  entries equal by sha at e8712f48, 5 protected same blob id; 0 broken. held() at b-package.cjs:2242 (gitSha(sourceBase) for a
  file in S9.product) therefore answers identically at both bases, for parent and grandparent pins alike.
- The five files changed 0cd07be..e8712f48 (rebuild/DECISIONS.md, rebuild/coach/engine-revision.cjs, rebuild/lanes/b/VERDICT-S8.md,
  rebuild/lanes/b/tooling/receipts/S8.json, rebuild/m4/spec/review-s8-real-shape.json): none is an S9 product key. Whole-tree count
  with private/soak/src/ledger pathspecs excluded: 5. Tree ids equal at both commits for rebuild/engine (9049206f), rebuild/m3
  (59c8b792), rebuild/m4/workout (cb3585cb), .github (23554ca6), rebuild/conform/v4, rebuild/lanes/c, rebuild/lanes/d.
- ci-second-gate.test.cjs: blob at e8712f48 ac0806ce sha256 237dcb89279dfdbbb5c4011172c9149f8b23b7b170448b41ffa03e509ee03b2c = pre;
  blob at HEAD 15a37892 sha256 f3c470c60748e637c82130a121d18bee989b537e45a619e74ee1f63998a276a5 = post = disk. d4a3c92 (P-S9-5,
  the only S9 edit of it) is not an ancestor of e8712f48 (exit 1) and is an ancestor of HEAD (exit 0): the file changed after the new
  sourceBase, so the product entry is still needed and its pre is the e8712f48 blob. Correct.

### Item 3, citations of 0cd07be: DONE, minimal
- S9.json: :16 (moved) and the D-BLOM note :1784 (re-worded: 0cd07be is now "S8's proposed-artifact commit ... the commit
  DECISIONS:528 accepted; this spec's sourceBase until P-S9-1 was amended at DECISIONS:804"; the eight-file list is stated over
  0cd07be..6dc2596 "equally e8712f48..6dc2596"). I re-derived the eight: git diff --name-only e8712f48 6dc2596 -- rebuild/m3
  rebuild/m4 with soak, private, test and non-code paths excluded gives exactly passphrase.cjs, unseal.cjs, import-bundle.mjs,
  import-screen.mjs, design.cjs, today-app.cjs, today-model.cjs, setup-tags.cjs. The note is factual and consistent.
- The coverage "why" strings :1363 and :1389 say "this package's own sourceBase" generically; the five s9-supersede children and
  s9-engine-files-differential.cjs read SPEC.sourceBase / PARENT.sourceBase at run time (e.g. source-carriers :83, defect-witnesses
  :97, second-gate :88) and rebuild/engine is the same tree at both commits, so their bytes and outcomes stand.
- Brief (sha-bound at :789, abf3f670): :63-67 and :871-874 call 0cd07be a MEASURED CANDIDATE "for the PM to name"; :867 requires a
  sourceBase at which EVERY S8 parent pin holds, which e8712f48 does (above). The "never rebased" sentence (:67, :873) is what
  DECISIONS:804 amends. No brief edit is possible or needed. Agreed.
- No executable cell names 0cd07be: git grep over rebuild/lanes/{b,c,d}, m4/workout, m4/spec, conform/v4, m3, .github (soak and
  private excluded) hits only .md/.json history files (VERDICT-S8.md, S8 receipt and review, brief, reports, S9.json note).

### Item 4, static checks and red-first: REPRODUCED under the lock
Lock %TEMP%\earned-runtime.lock created with New-Item (job name inside), released after the run (verified absent).
- %TEMP%\opus55-s9prep\staticcheck.cjs (unchanged, 2026-09-23): 28 PASS, 0 REFUSED; "256 pins", "32 children", spec sha256 row
  bb169a67847d....
- %TEMP%\opus55-s9r7b\staticcheck-r7b.cjs: 39 PASS, 0 REFUSED. I read it before running: it loads only itself, legacy-gates.cjs
  (-> target.cjs, trace-v2.cjs), strict-json.cjs; protected five compared by ls-tree only (PROTb set, line 122-135). Its fidelity
  replica matches b-package.cjs fidelity() :2596-2604 (diff sourceBase..HEAD over rebuild/engine, rebuild/conform, rebuild/m4/spec,
  tooling; exemptions product keys, ARTIFACT/REVIEW, TOOLING_FILES, own receipt, child argv, carrierSuccessor).
- Red kept, my run of %TEMP%\opus55-s9r7\unl.cjs: working spec with SB_OVERRIDE=0cd07be -> 17 changed, UNLISTED 2
  (receipts/S8.json, review-s8-real-shape.json); committed spec at HEAD -> UNLISTED 3 (+ ci-second-gate.test.cjs).
  Green: working spec (e8712f48) -> 15 changed, UNLISTED 0 (each of the 15 classified: 9 product, 2 new, 4 TOOLING_FILES).

### Item 5, Astra's source-checker record: NAMED CORRECTLY
Helper %TEMP%\earned-s9-source-custody-checker-sol-20260921\s9-source-custody-check-a23c079-directory-fix.cjs, sha256
83eb00a95950ba68cb586268924263d36fb9e4e620347e4d2c912b2b179fdcea (matches the prep's prefix). L7 CANDIDATE = a23c079b...,
L8 SOURCE_BASE = 0cd07be7...; L280 refuse('S9_SOURCE_BASE_MISMATCH') when spec.sourceBase differs. Run unchanged on this S9.json it
refuses, exactly as 7b.5 says; the two values to change (L8 -> e8712f48..., L7 -> the PM's commit carrying S9.json bb169a67) are
the right ones, and the bounded review of that delta plus a PM-only run under :766 is the right route.

### Item 6, Round 7 (b) appended: DONE
7b.1-7b.6 present; every number I checked matches (5 files, 251/5, 227 = 222+5, 207, 15 changed / 0 unlisted, 39 PASS, both shas).

## 3. Counterexamples tried
- A product key whose blob differs between 0cd07be and e8712f48: none of 256 (ls-tree).
- A parent pin broken at e8712f48: none of 295 map entries.
- A test or workflow hard-coding 0cd07be: none.
- ci-second-gate unchanged since e8712f48 (entry removable): no, d4a3c92 is after it.
- U+2013/U+2014 or CRLF introduced: no (33 pre-existing in S9.json, 0 in the prep).
- The runner holding a role-new pre to the sourceBase blob: it does not (product() :2455-2483 compares disk to pre or post only),
  so 237dcb89 is a declared convention, not runner-enforced; the task asked for it and it is measured true. No defect.

## 4. Named debts (none blocking)
- D-SB-1 (disclosure): the builder's scratch row "R7b whole-tree 0cd07be..e8712f48" (staticcheck-r7b.cjs:146) and prep 7b.1 ran
  git diff --name-only 0cd07be e8712f48 with NO pathspec after --, against the rules' explicit-paths clause. Names only came out
  (the five public files); not disclosed in 7b.6. Owed: one disclosure line by the PM; my re-measure used explicit pathspecs with
  private/soak/src/ledger excluded and got the same five.
- D-SB-2 (wording): e8712f48 is a single-parent commit, the fast-forward tip :529 records, not a merge commit. DECISIONS:804 and
  the prep call it "the S8 seal merge"; the S9.json note says "the S8 seal merge e8712f48". Identity is exact; the word is loose.
  Suggest "S8 seal tip (:529)" in the PM's commit message; no S9.json edit required.
- D-SB-3 (ordering, for the PM): fidelity() diffs sourceBase..HEAD from the COMMITTED spec at HEAD; at 8306c3f the committed S9.json
  still says 0cd07be and refuses UNLISTED-SOURCE-CHANGE (3). The 0-unlisted result holds only once the PM commits this S9.json;
  PIN-PATHS-GIT-DISK-DISAGREE (:2614) also needs the tree clean. Commit first, then run.
- D-SB-4 (disclosed by the builder): the lock's job-name line was written with Set-Content (scratch lock only). Noted, no action.
- D-SB-5 (unverified count): 7b.5's "81 unique non-flag argv ... against 83 targets over 33 groups" is the builder's count; the
  helper's own count governs and Astra's bounded re-check will print it. Not re-derived here.

## 5. What I did not do
No commit, no b-package run, no child executed, no protected five read/hashed/loaded, no Astra helper run, brief not edited.
