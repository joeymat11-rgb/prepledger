# REVIEW-S10-INTEGRATION-l5: the S10 rebound head f97924a (runbook T3e, Fable l5)

Reviewer: Claude Fable 5.1, independent, STATIC, read-only (this file is the only write). 2026-09-25.
Object: lane W rebuild/b-s10-integration at f97924a = cbe2bdf (merge-forward of the sealed chain tip
ace916f), 59d7fd9 (S10.json rebind), 4a96a6b (REGEN SCOPE entry, DECISIONS:812), ddd27d7 (Astra 125
ACCEPT), f97924a (REGEN-written S10.json 66df4c06). Parent P = d7f6540 (sourceBase). Every hash below
was taken byte-exact from Git objects (node crypto over `git cat-file --batch` / `git show`), never from
a PowerShell redirect. The protected five were never read, hashed, loaded or run (Git names only).

VERDICT: ACCEPT WITH NAMED DEBTS (D-S10L5-1 .. D-S10L5-6). No blocking finding at f97924a.
Scope of the verdict: the COMMITTED bytes of f97924a only. The W working tree already diverges
(round 11 in flight; see D-S10L5-4), so nothing here transfers to a later head without a re-read.

## 1. The merge-forward cbe2bdf (parents 875d46d lane, ace916f chain; merge-base 6dc2596)
- Shape: 174 paths differ from the lane parent and equal the chain side; 98 differ from the chain
  parent and equal the lane side; the two sets are exactly `git diff 6dc2596 ace916f` (174) and
  `git diff 6dc2596 875d46d` (98). Nothing outside rebuild/ and .github/ changed except NEXT.md
  (chain side). No path was invented by the merge.
- Both-sides files: exactly two, rebuild/lanes/b/tooling/packages/S9.json and
  rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs. `git merge-file` of (lane, base, chain)
  exits 0 for both and reproduces cbe2bdf's blobs byte-exact (S9.json a66530aa, fence b1afad55).
  The lane's S9.json hunk is one line, tooling.runnerSha256 5321181a -> 9fbfdd2d (S3..S8/H3 take the
  same one-line re-pin, as at S9); so W's S9.json = the sealed bb169a67 plus that line, nothing else.
  The lane's fence hunk is +26 lines (its LOOK_EDITS row and residue re-anchor), the chain's +58/-5.
- The sealed S9 state is intact in W: rebuild/m4/spec/acceptance-s9-ui-pins.json at P hashes
  f24476220ec9 (= S10.json parent.options[0].sha256, :23-33), and no chain-side file was re-edited by
  the lane after the merge (59d7fd9..f97924a touch only S10.json, S10-REGEN.cjs/.test.cjs and one
  Astra review).

## 2. The rebind 59d7fd9 and the REGEN commits 4a96a6b, ddd27d7, f97924a
- 59d7fd9 (one file): sourceBase null -> d7f6540 (:11); parent artifact/review sha and receipt line
  809 filled (:23-33); S9.json pre/post moved to bb169a67/a66530aa; fence pre/post to 606ad877/b1afad55;
  the b-lom child removed (:798/:799, note [9]); notes [0] and [8] re-authored. Consistent with :812.
- 4a96a6b: S10-REGEN.cjs SCOPE (:53-54) gains the exact file
  rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs (36 entries, 7 exact files); EXACT_REVIEWED
  (:110) is derived from SCOPE, so the :138 dot-name exemption reaches it, harmlessly (no dot segment).
  The cell has its CI home (rebuild.yml:380-382) and ran green on both OS in run 36158401022 (step 26).
- f97924a vs ddd27d7 (one file): adds the ci-second-gate.test.cjs entry carried f3c470c6 == f3c470c6
  (:53-57), re-pins S10-REGEN.cjs 98d1cfff and S10-REGEN.test.cjs fec4c039 (both equal the f97924a
  blobs), regenerates notes [1], [5], [6]. Nothing else moved.

## 3. The REGEN-written spec S10.json 66df4c06 (101881 bytes, LF, blob 1699ead2)
Measured over ALL 297 product entries, not a 25-path spot check (the protected five excepted, below):
- pre == the sealed S9 artifact's pin for every path the artifact pins: 254/254 (the artifact's whole
  product map is present in S10.product, 0 missing; b-package.cjs:2575-2577 satisfied). The one path
  not in the artifact's product map, S9.json (:213), is its execution pin bb169a67 (artifact
  executionPins), declared superseded-by-child with pre bb169a67 == the P blob, post a66530aa == the
  f97924a blob (note [6]). The other 8 parent execution pins that change at HEAD (b-package.cjs, the
  fence, boundary/food/machine-settings-ui/package/problem/setup tests) are all product-pinned and
  declared edited, so the rule "execution pins not product-pinned" yields exactly S9.json. The two
  remaining parent execution pins outside S10.product (S9-UI-PINS-BRIEF.md, catalogue.test.mjs) are
  byte-unchanged P..HEAD.
- pre == sha256 of the P blob and post == sha256 of the f97924a blob for 292/292 hashable paths;
  carried => pre == post (232), edited => pre != post (20), released => post null and pre == P blob
  (2), new => pre null (42). Zero mismatches.
- The protected five (index/merge/migrate/seed/oracle-shim under rebuild/engine): declared carried with
  pre == post == the artifact pin (5/5, string comparison) and `git diff --name-only P..HEAD` over the
  five names is empty. Not hashed by this reviewer (D-S10L5-6).
- The released pair (:928 today-app.cjs, :798 gym-app.mjs): pre efaf6c0d / 4c8ba0c9 = the S9
  artifact's posts (S9: edited / carried; S9 itself released only preview.css and build.mjs, :786),
  post null, HEAD blobs d1e1f1e7 / d41d1e5c (S10 does move them), in no child argv (0/90), not in the
  parent's executionPins. The boundary row's clauses hold at this head (pre == the youngest older
  sealed post, release block present at :1604 with rulingLineSha256 null = the STOP).
- The 7 parent-unpinned new paths (note [5], :792): exactly the 7 paths with role new that exist at P
  (blob present) and are in neither the artifact's product map nor its executionPins; the list in the
  note matches the measured set path for path. The other 35 new paths are absent at P.
- superseded-by-child S9.json: see above; W's S9.json = sealed bb169a67 + the runnerSha256 line, and
  S10.tooling.runnerSha256 (:40) == b-package.cjs post (:168) == the f97924a blob 9fbfdd2d.
- Roles for the 297: every path changed by the lane since 6dc2596 (98) is product-pinned or is a
  Markdown report outside rebuild/engine/, S10.json itself, or the parent-released build.mjs (33 such,
  all listed in note [1]'s exclusion). Child argv targets: 90 paths, 90 present at HEAD, 89 product-
  pinned plus catalogue.test.mjs (a parent execution pin, unchanged). 35 children: 32 parent children
  minus b-lom and the six s9-sup-*/s9-engine-files-differential, plus the six s10-* twins,
  epp-proposed-pick, d-epp-2-capture, today-split-fence; today-17 gains the five gss-annex files
  (24 argv entries, 22 files); m4-import gains engine-pins-unprotected.test.cjs. All needles null.
- STOP fields as expected before T3b/T5: packageId null (:4), brief nulls (:6-10), theme null,
  release.rulingLineSha256 null (:1604), superseded.rulingLineSha256 null (:1533), artifact nulls.

## 4. B1-B4 at this head (IR STOP 10; Astra L6 read them at 3f82344)
`git diff --name-status 3f82344 f97924a` over gym-app.mjs, today-split/writer-fence.test.mjs,
engine/test/proposed-pick.test.cjs, today/test/package.test.cjs, today/build.mjs,
measure/test/boundary.test.mjs, today-app.cjs, engine/today.cjs, engine/writers.cjs,
engine-capture.cjs, rebuild.yml and b-package.cjs is EMPTY: every B1-B4 byte is unchanged since L6.
- B1: gym-app.mjs:278 `const paintedDraft = settingsDraft;` and :310 `}, async (outcome) => {` are
  present; writer-fence.test.mjs:1452-1453 anchors the residue row on :278. Hosted step 25 (writer
  fence over the released view files) succeeded on both OS at f97924a (17 s each).
- B2 (D-EPP-4): proposed-pick.test.cjs unchanged. Hosted step 23 (`node --test
  rebuild/engine/test/proposed-pick.test.cjs`, rebuild.yml:360-362) succeeded on both OS at f97924a:
  the real cell's GREEN half as a step conclusion (D-S10L5-2); the four-deletion RED half on the real
  engine is still owed (D-S10I-8).
- B3: package.test.cjs:173-175 names the three inputs, :236-254 pin 51/29; build.mjs unchanged.
- B4: boundary.test.mjs:184 releaseAccounts, :292 S10 RELEASE-ACCOUNTING, :316-324 the re-release
  control; the spec-side clauses now hold on the SEALED parent (section 3). The PM grant is the STOP.
B1-B4 stay CLOSED within L4/L6's measured limits; nothing at this head re-opens them.

## 5. Hosted CI-0, run 36158401022 at f97924a (read through pm-run shared, public jobs API)
rebuild-public on ubuntu-latest and windows-latest: steps 1-12 success; step 13 "Cumulative S10 ...
`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S10`" FAILURE on both OS, 0 s each;
14, 15, 17-22, 27-32, 36, 39 skipped (no `if:`); 16, 23, 24, 25, 26, 33, 34, 35, 37, 38 success on
both OS (the `!cancelled()` steps). C font transport: success on both OS.
- EXPECTED red: step 13 only. A 0 s failure on both systems is the spec() refusal of an unfilled
  spec (packageId null, brief null, the runner's STOP fields), the same shape as the PM's disclosed
  local run (:816, FAIL at spec() in about 5 s). It proves nothing about the product (Fable fix 4);
  the log was not read (D-S10L5-1).
- REAL reds: none observed. Nothing else failed; the skipped steps are unmeasured, not red.
- Positive signal worth recording: step 16 (the sealed-inventory fence over this branch's own diff)
  is GREEN on both OS at f97924a, which answers runbook Q26 for this head (the fence admits S10's
  edits with S9's inventory at CHAIN); steps 23/24/25/26 green as above.

## 6. The chain since the merge (for T6, not a defect of f97924a)
origin/rebuild/t2-client-core is 85653f4 (:817), past 94977a9 (:816): ace916f..85653f4 = 9 commits,
158 paths, 157 deletions (3b54a72) + DECISIONS.md. Measured: 0 of the 158 are in S10.product, in any
child argv, under a fidelity root (rebuild/engine, rebuild/conform, rebuild/m4/spec,
rebuild/lanes/b/tooling) or inside the 36-entry REGEN SCOPE; they sit under rebuild/lanes/b/reviews
(106), rebuild/lanes/d2/reviews (39), rebuild/m3/w5/test (8), rebuild/m3/clock-spike/test (3),
rebuild/lanes/c/hand-proof (1). The next merge-forward should be conflict-free and pin-neutral.

## 7. Named debts
- D-S10L5-1: the cause of step 13's red is inferred from its 0 s duration on both OS and the runner's
  STOP fields, not read from the step log. Before "expected" is written into any ledger line the PM
  should show the refusal name from the log or from the disclosed local run.
- D-S10L5-2: hosted steps 23 and 26 report success at 0-1 s; they are step conclusions, not TAP row
  counts. The EPP real-cell GREEN half of D-S10I-8 is paid only as a conclusion; its 9-row count and
  the four-deletion RED half on the real engine are still owed (the round-11 note [8] draft in the
  working tree says the same and must not claim more).
- D-S10L5-3 (cosmetic, reconcile at final binding): note [1] says post is measured "at HEAD ddd27d7"
  while the spec lives at f97924a (trees equal but for S10.json); note [4] still calls today.cjs and
  writers.cjs "sealed S8 product keys" (true historically; the parent is now S9, where both are
  carried); note [7] and the superseded whys say PROPOSED, correct until T5.
- D-S10L5-4: W's working tree at review time already differs from f97924a: S10.json (note [8], 1
  line), rebuild/lanes/c/today-split-spike/cut.cjs (+27, role new) and
  rebuild/m3/w7-preview/today/test/problem.test.mjs (+93, role edited). Under runbook Q23 and Fable
  fix 6 the next commit of those re-opens REGEN --write and voids any needle taken at f97924a; this
  verdict does not extend to that head.
- D-S10L5-5: the chain is at 85653f4, two ledger lines and one cleanup commit past the merged ace916f;
  section 6 measures the delta as pin-neutral but T6's merge-forward and the T9/T26 re-reads still
  have to see it, and the chain freeze now covers every chain commit (:816).
- D-S10L5-6: the protected five's post == HEAD blob is shown by `git diff --name-only P..HEAD` (empty)
  plus pre == post == artifact pin, never by a hash this reviewer took (by rule). A PM-seat run under
  grant (g) is the only byte proof.

## 8. What I did not do
No test, harness, REGEN dry run, b-package run or child was executed; no protected file, private
tree, src/, ledger/ or soak path was opened; no fetch, checkout, commit or push; no file written but
this one. Astra L7 (job 127) reviews the same head in parallel; the two reads are independent.
