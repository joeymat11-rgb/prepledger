# S9 final assembly prep, round 4 (builder claude-opus-5-5, 2026-09-23) - UNCOMMITTED, for the PM
Worktree %TEMP%/earned-s9int, rebuild/b-s9-integration at fe9f14b5 (not switched). Chain 94eebbc0 (DECISIONS 790 lines).
Reviews: l1 55bae3a0, l2 (E1 fixed), l3 (F1, F2 paid here). Nothing run except staticcheck, under the runtime lock.
- S9.json FINAL: a1f9fa38e6cb43513b82fc31f9d08852821a67f3a8cccf5a2704c831dfd83ce9 (HEAD 7dcdab1f).
- rebuild.yml: bce0594f77b7b3abe04fe05b965267ee89ad7584d201b21155cdf32ae25908f0 (HEAD 66f2ac9c).

## 1. What S9.json carries
- Hunk A: 18 observed "# pass N" from run 35815674720 job "proof" (head 7fe1c5d5, authorizedBy :784). Hunk B:
  coverage.superseded {rulingLineSha256, gates: five carriers, S8 evidence shape}. Hunk C: status BRIEF-ACCEPTED,
  notes[0] in S8's form. Hunk D: release {rulingLineSha256 = sha of :786}. GS citation = sha of :787.
- Claims in S8's form (keys, order, literal U+00B7), each line byte-equal to the chain:
  authorizations.theme {ledgerLine 788, role cowork, ff25c85a...}; brief.acceptedLedgerLine {789, cowork, 04b0f897...}.
- source-carriers "# pass 4" is a prediction (section 3). b-lom stays null (HELD_SPLIT_REQUIRED; not invented).
- l3 F1: all five gates[*].why now open "DECISIONS:153 (the standing role) and the token clause DECISIONS:787 (RULED) for
  M2-S9-UI-PINS, located by its own sha256 b8d088af3eb8...", the form S8's whys use for :527. notes[1] lost its
  "PROPOSED notes[1]:" label (it now opens "Needles are ...").
- l3 F2: rebuild.yml is declared {role edited, pre 8403d10b (= S8 artifact post = sourceBase blob), post}. The post
  moved 66f2ac9c -> bce0594f to match the flip below. It is not an S8 execution pin.

## 2. The rebuild.yml flip (F2 condition (i)), mirroring ef21153 ("S8-PREP: the standing CI step names S8, inside the package")
ef21153 replaced the S7 step name and run with a comment block ("M2-S8-REAL-SHAPE SUCCEEDS M2-S7-PORT-ADMISSION HERE ...
VERDICT-S6.md rule (a) ... DECISIONS:498 ... The step NAME moves with it"), then the S8 name and run. The S9 hunk does
exactly that at rebuild.yml:149-150 (+14 -2):
  - adds a 12-line comment "M2-S9-UI-PINS SUCCEEDS M2-S8-REAL-SHAPE HERE, by the same rule an eighth time ...", citing
    VERDICT-S6 (a), :498, ef21153, :786, :732, :787, :788/:789, and the expected pre-seal refusal;
  - name: "Cumulative S9 UI pins, S8 real shape, S7 port admission, ..., native-carrier and legacy-census evidence";
  - run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9
The S8 comment block stays, as S7's stayed in ef21153. The comment is ASCII only; the file's pre-existing dashes are
unchanged (17 at HEAD, 17 now); LF only. No test pins the step text. ef21153's second hunk (new lane cells) has no S9
analogue: S9's lane-cell steps are already in HEAD.

## 3. Proving "# pass 4" (l2 E1, l3): the hosted standing step, on l3's conditions, in this order
- (i) The S8->S9 flip lives INSIDE S9's post. Done in the tree (section 2): rebuild.yml is a declared product file
  (VERDICT-S6 rule (a), :498).
- (ii) It passes only where the chain tip stands in HEAD's first-parent chain (SEAL-BASE-IS-NOT-THE-CHAIN-TIP, b-package
  :3534). That means at the merge-forward, which :627 makes the measuring point and :565 keeps valid when only
  DECISIONS/STATUS follow.
- (iii) The artifact is committed first, or release-object's REAL ROW is red (release-object.test.mjs:295, :324-331).
  b-lom is filled with an observed needle.
- (iv) --ci prints PUBLIC CI EVIDENCE PASS, never the verdict (:3897). PASS and --full stay owner-gated. The CI sentence
  names the run id and its conclusion (:627).
The local seal run is NOT granted: Joe was asked and has not answered. :766 covers read/hash only, and :784/:785 cover
only the hosted packet 07ea6f8. SUP-3 loads the protected migrate.cjs.

## 4. Static re-run (staticcheck.cjs, lock taken and released)
- Loaded only legacy-gates, target, trace-v2 and strict-json plus node builtins. No b-package, no rebuild/engine.
- 27 PASS: parseExact; SPEC_KEYS and release keys; status; claim() for brief and theme; BRIEF-ACCEPTED coupling.
- Also PASS:
  - brief line shape; brief sha = disk; THEME " · ACCEPTED";
  - the real L.verifyReceipt(role cowork) on :788 and :789;
  - releaseRuling steps 1-7 (:786) and supersessionRuling (:787, 5 carriers);
  - supersededSpecShape, 255 pins, SUP-4, notes;
  - F1: whys cite :787 with no PROPOSED;
  - F2: rebuild.yml edited, pre = S8 post, post = disk, standing step S9 and no S8 step left.
- 1 REFUSED: CHILD-NEEDLE-EMPTY b-lom (the true state).
- Earlier negative controls on verifyReceipt all refused (RECEIPT-ROLE, RECEIPT-CONTENT, RECEIPT-EXACT-LINE-MISSING).

## 5. Exporter v3 readiness (static only; not run)
- Source: git show origin/rebuild/p-s9-exporter-v3:rebuild/lanes/astra/s9-exporter-v3/export-s9-profile-v3.cjs.txt via cmd
  redirect. I measured 576fd22ea385bbd3e0fb744526988161ebfc79f37b4b2b6015e961f374eea5a5 = the l3-reviewed bytes. Save as .cjs.
- Command, after the spec, rebuild.yml and report are COMMITTED (the exporter refuses any tracked or untracked change,
  and needs the spec at HEAD). Node 24.19.0 is the codex runtime; mkdir the scratch root first (it does not exist yet):
  mkdir C:\Users\joeym\AppData\Local\Temp\earned-s9-profile-export-results
  node export-s9-profile-v3.cjs --execute-reviewed-export C:\Users\joeym\AppData\Local\Temp\earned-s9int <HEAD40 after the commit> 5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22 s9-final-1 94eebbc00d7e961b253e6c4ae3d52deeacbace5a
  The runner sha is S9.json tooling.runnerSha256 = disk b-package.cjs. The chain arg must equal
  refs/remotes/origin/rebuild/t2-client-core at run time (re-read it if the ledger moves). The output name must match
  ^s9-[a-z0-9-]{1,80}$.
- The compiled spec phase will refuse CHILD-NEEDLE-EMPTY b-lom until b-lom is filled, so the export waits on b-lom too.
- Clean-step status (read-only, names only, forbidden-name filter hit nothing), `-- rebuild .github`: 8 entries.
  - Commit before running (3): M rebuild.yml, M S9.json, ?? this report.
  - Move aside (5, all `!!`), as l3 listed:
    - files rebuild/conform/engines/engine-main.cjs, engine-old.cjs, rebuild/conform/run.log;
    - junctions rebuild/m3/w5/node_modules and w6/node_modules (to %TEMP%\earned-adm\...; rmdir the reparse point only).
  - Whole tree: 10 entries; the 2 outside rebuild/ and .github/ are ignored and allowed.
  - Re-run the status command after the commit and the moves: it must print nothing. Restore the moved items after the run.

## 6. Remaining order: review this round -> commit (spec, rebuild.yml, report) -> b-lom split, review and grant, then its
needle -> exporter (section 5) -> artifact review and commit -> release-object exit 0 -> merge-forward -> hosted both-OS
standing step (section 3) -> Fable seal read -> owner-gated --full and POSTFIX receipt (tag "cowork", :3752).

## Round 5 (b-lom 2(b), DECISIONS:798/:799) (builder claude-opus-5-5, 2026-09-24) - UNCOMMITTED, for the PM
Worktree %TEMP%/earned-s9int, rebuild/b-s9-integration HEAD 6dc2596 = origin, clean before the edit, not switched. Chain tip
65cf85a (DECISIONS 799 lines, :777-:799 read from the PM tree). Owner :798 takes BLOM-OPTIONS 2(b); PM :799 reads brief 3.3 as
the 24 S8 children other than b-lom and corrects :798's reason. Nothing run except staticcheck, under the runtime lock.
### 5.1 What changed (S9.json, plus this section)
- children 33 -> 32: the b-lom object (HEAD :1669-1678, needle null) is deleted; the other 32 are byte-identical, same order.
- notes[1] tail "; b-lom's needle stays null (HELD_SPLIT_REQUIRED), so this spec refuses CHILD-NEEDLE-EMPTY b-lom and cannot
  seal until a reviewed and granted split supplies an observed needle." is now "; b-lom is not a child of this package (D-BLOM, below)."
- notes[4] appended (S9.json:1779): the D-BLOM note (5.4), in S8's form (caps lead sentence; S8 notes[6] "NAMED SO THE OMISSION
  IS A DECISION"), ASCII only, 1627 chars.
- Parse-compared to HEAD: every other top-level key is unchanged (needles, claims, pins, gates, coverage, tooling, release,
  authorizations, parent). numstat +3 -12; 2-space canonical form and LF kept; U+2013/U+2014 16/17 = HEAD (none added).
  No count in S9.json counts children (its only numbers are version and five ledger-line numbers).
- sha256 a1f9fa38... (89998 B) -> c05a8e34639d8545eba36d7902f442637c7037e1a1a58e077ded0e6186038c8f (91266 B, 1781 lines).
### 5.2 Rule citations (b-package.cjs 5321181a = tooling.runnerSha256 = disk; read, never loaded)
- The child schema and CHILD-NEEDLE-EMPTY (:1947-1953, :1951) iterate s.children only. children() spawns only s.children
  (:2790-2797), so CHILD-REQUIRED-EXIT-ZERO (:2808) and the line-start needle (:2824) bind declared children only.
- legacy-order.test.mjs (S9.json:188) and legacy-order-mapping.test.cjs (:903) stay role carried, pre = post = S8's pins
  f091a560 / f7a3e4a4 = disk. Carried needs only pre === post (:1929); only pinned-unchanged needs a declared child (:1963-1966).
- acceptedVerdicts (:1119-1126, the parent's children as schedule) is called only by successorProof (:2973), which returns at
  :2881 because coverage.successors is null (S9.json:1327). pins() (:2294-2297) re-asserts parent byte pins, not children.
  ownChildren (:799-800) counts children that run a role-new file; b-lom runs none. CHILD_ROOTS (:425-431) permits
  rebuild/lanes/d/b-lom/ and requires nothing.
- Brief 3.3 (:458-459, "All 25 children ... re-declared") under :799: S8's 25 map to 24 here (18 by name, 6 mirrors re-pointed
  to s9-*); b-lom is the only one not re-declared; 8 children are S9's own.
- The cells that read S9.json (six s9-* mirrors, release-object, reference-closure) match children|b-lom|legacy-order 0 times,
  so no other needle moves with the drop.
### 5.3 D-BLOM facts, re-measured
- today-bindings.mjs: S9 carried 23c11797 = S8's sealed post (S8 edited 8694a5d6 -> 23c11797) = blob at 0cd07be = HEAD.
- today-model.cjs (legacy-order.test.mjs:38): bddeeacf at 0cd07be (S9.json sourceBase, S8 artifact commit) -> 645c1bec at HEAD
  (3435fa9, 9742490, 5111716). Neither S8's artifact nor S9.json pins it.
- Walk-visible code files changed 0cd07be..6dc2596 (the walk's own filter, legacy-order.test.mjs:176-192; *soak* paths left
  out of the query by rule): EIGHT, today-model.cjs one of them: m3/setup/port/passphrase.cjs (added), m3/setup/port/unseal.cjs,
  m3/w6/local/import-bundle.mjs, m3/w7-preview/import/import-screen.mjs, m3/w7-preview/today/design.cjs,
  m3/w7-preview/today/today-app.cjs, m3/w7-preview/today/today-model.cjs, m4/workout/setup-tags.cjs (added).
  :799 says "today-model.cjs ... plus eight". The walk skips test/ (:178). A filter that keeps test/ dirs adds
  m4/workout/test/s9-engine-files-differential.cjs, which gives 1 + 8. The note states the walk's count.
- CI runs both b-lom files at rebuild.yml:331. BLOM-OPTIONS' :319 was fe9f14b, before the +14 -2 flip.
### 5.4 The D-BLOM note (S9.json notes[4]), verbatim
> D-BLOM, THE ONE PARENT CHILD THIS PACKAGE DOES NOT RE-DECLARE, NAMED SO THE OMISSION IS A DECISION. The parent's child b-lom (its two argv files rebuild/lanes/d/b-lom/legacy-order.test.mjs and rebuild/m4/workout/test/legacy-order-mapping.test.cjs, sealed at "# pass 30" in rebuild/m4/spec/acceptance-s8-real-shape.json) is not declared here: the owner chose BLOM-OPTIONS 2(b) at DECISIONS:798 and the PM read brief 3.3 as 24 children at DECISIONS:799, because its LOM-S6 walk (legacy-order.test.mjs:176-189) reads every code file under rebuild/m3 and rebuild/m4, the protected soak app included, which stays protected until 2026-10-05. Both cell files stay role carried at the parent's bytes, and CI keeps running the test at rebuild.yml:331. S8's "# pass 30" is the last sealed evidence and does NOT prove this tree: today-model.cjs (imported at legacy-order.test.mjs:38) moved after S8's seal commit 0cd07be (this spec's sourceBase), and eight m3/m4 code files the walk reads changed since (0cd07be..6dc2596, soak-named paths not measured), today-model.cjs among them: rebuild/m3/setup/port/passphrase.cjs (added), rebuild/m3/setup/port/unseal.cjs, rebuild/m3/w6/local/import-bundle.mjs, rebuild/m3/w7-preview/import/import-screen.mjs, rebuild/m3/w7-preview/today/design.cjs, rebuild/m3/w7-preview/today/today-app.cjs, rebuild/m3/w7-preview/today/today-model.cjs and rebuild/m4/workout/setup-tags.cjs (added). It is re-measured after 2026-10-05 by the hosted-blom NO-path packet once that packet is re-pointed (its runner and re-pin require exactly one b-lom child in the spec they read, and this spec has none) and reviewed.
### 5.5 Static re-run (staticcheck.cjs unchanged, lock taken and released; loads legacy-gates, target, trace-v2, strict-json only)
- Before the edit (a1f9fa38): 27 PASS, 1 REFUSED CHILD-NEEDLE-EMPTY b-lom (as in round 4).
- After the edit: 28 PASS, 0 REFUSED. The children row reads "32 children" and the sha row c05a8e34. No new refusal.
- Same checks at CHAIN = tip 65cf85a (staticcheck-attip.cjs, constant swapped in memory): 28 PASS, 0 REFUSED; :788/:789 hold.
### 5.6 Where a1f9fa38 (the old S9.json sha256) is pinned or cited. Not changed; for the PM
- This tree: this file :4 (the round 4 header, superseded by 5.1). Nothing else here pins it: no test, workflow or tool.
- origin/rebuild/b-s10-integration 62788b1: S10.json:209 pins S9.json pre a1f9fa38 (superseded-by-child). S10-REGEN.cjs:17 and
  :263 flag notes that cite a1f9fa38. S10-INTEGRATION-REPORT.md:63, REVIEW-S10-INTEGRATION-l3.md:76 and its copy of this file
  (:4) also cite it. S10.json:1819 still declares b-lom; :799 drops it when S10 re-binds to sealed S9.
- origin/rebuild/t2-client-core 65cf85a: DECISIONS.md:790 and HANDOFF-PM-2026-09-24-CLAUDE-OPUS-5-5.md:37 (history). No pin
  on p-s9-exporter-v3 9a29c3a or p-s9-hosted20-proof 7fe1c5d (the exporter reads the spec at HEAD).
- Not searched: earned-h20 hosted-blom/ (only BLOM-OPTIONS.md may be opened). By BLOM-OPTIONS, its runner and BLOM-REPIN need
  exactly one b-lom child in the S9 spec, so the re-point D-BLOM owes (:799) must feed it a spec that declares b-lom or change that check, under review.
### 5.7 Remaining seal order under 2(b)
Review this round -> commit (S9.json, this report; rebuild.yml is already in 6dc2596) -> clean step (section 5; its status must
print nothing) -> exporter v3 (section 5; chain arg = the tip at run time, now 65cf85a; it no longer waits on a b-lom needle,
because no declared child has a null needle) -> artifact review and commit -> release-object exit 0 -> merge-forward -> hosted
both-OS standing step (section 3; (iii)'s b-lom clause no longer applies) -> Fable seal read -> PM local --full under :796 (d) ->
POSTFIX receipt (tag "cowork", :3752). D-BLOM stays open past the seal until the re-pointed, reviewed hosted-blom run after 2026-10-05.

## Round 6 (Fable l1 D1, fence SPEC_KEYS) (builder claude-opus-5-5, 2026-09-24) - UNCOMMITTED, for the PM
Worktree %TEMP%/earned-s9int, rebuild/b-s9-integration HEAD ffb31c6 = origin (round 5 committed with Fable l1), clean before
the edit, not switched. Ledger :777-:799 read from the PM tree. REVIEW-S9-BLOM-2B-l1.md read whole; this round pays D1 and
answers D2-D4. The fence judged by refs/remotes/origin/rebuild/t2-client-core as last fetched, cd16a38 (not fetched by me).
Runs: fence red, fence green, staticcheck; each under %TEMP%\earned-runtime.lock, taken by New-Item and released after.
### 6.1 Load proof, read before any run
- sealed-inventory-fence.test.mjs imports (:56-63): node:assert/strict, node:test, node:child_process, node:crypto, node:fs,
  node:os, node:path, node:url. No require, no import(), no createRequire. Its only spawns are execFileSync("git", ...) (:87)
  and a deliberately absent binary (:956, row (10)). It reads b-package.cjs as TEXT at the chain ref (idsOf), packages/S9.json
  at HEAD, the chain's acceptance artifact and rebuild.yml. It loads none of the protected five and no rebuild/engine module.
### 6.2 Red first (fence unfixed, only the new row added; file b5bf8d6b..., 125492 B)
- New row "Fable l1 D1 (33)" builds eight throwaway reseal children that satisfy conditions (2)-(5) and differ only in the
  top-level key set. Must SKIP: release absent; release null; release as the block S9.json carries ({rulingLineSha256}).
  Must refuse at (1): an unknown extra key (releases); top-level freeze beside a release block; top-level released; Release;
  release standing in for a missing required key (notes), so the key COUNT still matches.
- Observed (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, node --test --test-reporter=tap <fence>, cwd the worktree):
  # tests 54, # pass 52, # fail 2, exit 1. Row (33): "release present and null: (1)" and "release present as the block
  packages/S9.json carries: (1)" where skip was expected (today's defect); release absent skipped; the five refusal worlds
  refused at (1). THE REAL ROW: not ok, "this change drew 1 refusal(s), 0 of them sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at refs/remotes/origin/rebuild/t2-client-core (cd16a38d...) does not
  release", actual ["FENCE-RESEAL-CHILD-UNVERIFIED (1) rebuild/lanes/b/tooling/packages/S9.json is not the runner's own
  SPEC_KEYS key closure (b-package.cjs:1071)"]. Log kept: %TEMP%\opus55-s9r6\red.log (sha256 9c0057fa..., 18914 B).
### 6.3 The rule and the fix
- H5 as the runner defines it: SPEC_KEYS at b-package.cjs:1172-1183 (runner 5321181a) is 22 keys; `release` (:1183) is the
  ONE optional key (H5 comment :1175-1182); spec() closes it at :1852 with keys({ ...s, release: null }, SPEC_KEYS, ...), and
  keys() (:681) deepEquals the sorted key lists. No other spec key is optional (freeze and released belong to the
  authorizations and artifact closures).
- Fence :75-87: the by-value copy is now those 22 keys ending "release"; its comment cites :1172-1183, :1183 and :1852 and says
  why it moved. Condition (1) (:287-289) applies the same freeze pattern, Object.keys({ ...spec, release: null }) against
  SPEC_KEYS; its refusal text cites "b-package.cjs:1172-1183, closed at :1852" (was :1071). Nothing else in condition (1) or
  in (2)-(5) moved; the copy stays by value (the fence still imports nothing it audits).
- specFile() fixtures now carry release: null (a present key the runner admits); row (20)'s closure assertion holds unedited.
  No assertion was weakened or removed. numstat +58 -5; 1995 lines, ASCII only, LF.
### 6.4 Green (fence 606ad877..., same env and argv)
- Whole file: # tests 54, # pass 54, # fail 0, 1..54, exit 0 (55.7 s). Row (33) ok; THE REAL ROW ok, as a VERIFIED SKIP: the red
  run shows the real branch enters the reseal claim (refusal at (1)), and inside the claim the only green return is the skip
  after condition (5). Log: %TEMP%\opus55-s9r6\green.log (sha256 5befaa9b..., 13447 B).
- S9 child sealed-inventory-fence: argv ["--test", "--test-reporter=tap", "rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs"],
  declared needle "# pass 53" (the hosted count at 7fe1c5d5, 53 rows). Observed terminal line now "# pass 54" (one new row), so
  that child's needle moved to "# pass 54" and nothing else in the child moved. The fence's lane-cell step (rebuild.yml:271)
  runs the same file.
### 6.5 Pins
- The fence is a declared S9 product file: product["rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs"], role new, pre
  null, post af7b6f34a10d6a36c2982ae0713ff127a26a4e34736ac69346b6f3e66822a29c ->
  606ad877cdd4cc297b13384c9290967cf9112fb8f6ed1ba995efb38907c4cd78 (126228 B). No other S9 place pins it: the child names it
  in argv only; no execution pin, coverage row or note in S9.json names it.
- S9.json: c05a8e34639d8545eba36d7902f442637c7037e1a1a58e077ded0e6186038c8f ->
  c5df18f1ec8a1e2d069fef4f46e396c81690167616cdd2373521d02cdffa4975 (91266 B both, 1781 lines). Parse-compared to HEAD: exactly
  two values moved (that post; children[24].needle); 22 top-level keys, same order; canonical 2-space + LF; CR 0; U+2013/U+2014
  16/17 = HEAD (none added); 32 children. numstat +2 -2.
- NOT changed, for the PM (git grep of 563 remote-tracking refs plus this worktree for af7b6f34 and c05a8e34, explicit
  pathspecs, soak/private/ledger/src/history.js/app.js excluded by glob and again in memory):
  - af7b6f34 pinned: origin/rebuild/b-s10-integration 62788b1 S10.json:344 (fence role edited, pre af7b6f34, post 6abf4d4d;
    S10's fence still cites :1071 at its :75 and :281, so it carries D1 too and must rebase over row (33) and re-pin pre to
    606ad877 when S10 re-binds to sealed S9; its fence child needle is null at :1862) and its S9.json copy :1180; older S9.json
    copies at :1175 on c-s9-fence-matrix-fix, e-native-load-build, e-native-load-red, p-s9-hosted20-proof, p-s9-hosted20-run.
  - af7b6f34 cited (history) on t2-client-core cd16a38 and p-s9-exporter-v3: HANDOFF-PM-2026-09-21-ASTRA-CURRENT.md:18,
    HANDOFF-PM-2026-09-22-CLAUDE-OPUS-5-5.md:19, astra/S9-FENCE-AND-PUBLIC-THREE-2026-09-22.md:26,
    astra/reviews/S9-FENCE-JOB-MATRIX-FIX-REVIEW-L3.md:7, astra/reviews/S9-PUBLIC-WAVE-FIVE-FIELD-REVIEW-L1.md:32.
  - c05a8e34 cited: this file :94 and :123 (round 5) and REVIEW-S9-BLOM-2B-l1.md:22 and :95; no other ref, no test, workflow
    or tool.
  - Not searched: earned-h20 hosted-blom/ (only BLOM-OPTIONS.md may be opened) and other worktrees' uncommitted files.
### 6.6 Staticcheck
- C:\Users\joeym\AppData\Local\Temp\opus55-s9prep\staticcheck.cjs (sha256 96f96984dc2caaaab26056e1e6ae19c009660c00a30e2dad2869792c89d22723,
  10918 B, unchanged since round 4), cwd the worktree: loaded only itself, legacy-gates.cjs, target.cjs, trace-v2.cjs and
  strict-json.cjs; 28 PASS, 0 REFUSED; "32 children", "255 pins", spec sha256 row c5df18f1ec8a1e2d...
- Same checks at the local chain ref cd16a38 through C:\Users\joeym\AppData\Local\Temp\opus55-s9prep\staticcheck-attip.cjs
  (sha256 1338a921..., 740 B): 28 PASS, 0 REFUSED; the :788/:789 receipts hold there.
### 6.7 Fable l1 D2-D4
- D2: the D-BLOM note (S9.json notes[4]) counts the EIGHT m3/m4 code files the LOM-S6 walk reads (legacy-order.test.mjs:176-192,
  skip rule :178), today-model.cjs one of them. :799's "today-model.cjs ... plus eight" counted a NINTH,
  rebuild/m4/workout/test/s9-engine-files-differential.cjs, which the walk skips because it sits under a test/ directory.
  The note is walk-accurate and stays as it is; amending :799's arithmetic or accepting the note's count in the seal line is
  the PM's call.
- D3, correcting 5.2: the cells that read packages/S9.json are the six s9-* mirrors, release-object and reference-closure,
  PLUS sealed-inventory-fence.test.mjs (its key closure, condition (1), now :287-289, where D1 lived) and
  rebuild/m3/w7-preview/today/test/package.test.cjs, which names packages/S9.json in a comment (:108). 5.2's conclusion
  stands: none of them counts children or names b-lom or legacy-order, and the b-lom drop left the key set unchanged.
- D4, correcting 5.6: S10-INTEGRATION-REPORT.md at 62788b1 cites a1f9fa38 at :38, :45 AND :63 (5.6 listed :63 only).
### 6.8 Observation, not changed
- O1: condition (1) compares the sorted keys joined with ",", where keys() (:681) deepEquals the sorted arrays, so a key
  containing a comma could make two different key sets join equal; the fence also parses with JSON.parse where spec() uses
  parseExact (duplicate keys). Both pre-date this round and neither is touched by D1; the runner's own spec() still refuses
  such a spec in the same CI run. A tightening would be its own reviewed edit.
### 6.9 Remaining order
5.7 unchanged, with D1 paid in the tree: review this round -> commit (fence, S9.json, this file) -> clean step -> exporter v3
-> artifact review and commit -> release-object exit 0 -> merge-forward -> hosted both-OS standing step, where the
sealed-inventory-fence child is now expected to print "# pass 54" -> Fable seal read -> PM local --full under :796 (d) ->
POSTFIX receipt. Scratch (outside the worktree): %TEMP%\opus55-s9r6 (hash.cjs, run-fence.cjs, grep-pins.cjs,
verify-s9json.cjs, red.log, green.log, pins.log, pins8.log, fence-RED-state.test.mjs.txt).

## Round 7 (UNLISTED-SOURCE-CHANGE in fidelity()) (builder claude-opus-5-5, 2026-09-24) - UNCOMMITTED, for the PM
Worktree earned-s9int at HEAD 8306c3f. b-package.cjs (5321181a) read as text, never loaded or executed.
### 7.1 The unlisted set after the runner's own allowances
- Rule: fidelity() b-package.cjs:2596-2604. changed = git diff --name-only sourceBase HEAD -- rebuild/engine rebuild/conform
  rebuild/m4/spec rebuild/lanes/b/tooling. Exempt: s.product keys; ARTIFACT/REVIEW, derived at :2056-2057 from packageId, so only
  acceptance-s9-ui-pins.json / review-s9-ui-pins.json (never the parent's); TOOLING_FILES :371-392 (31 entries: the runner, six
  docs, eleven lane-B suites, packages/<IDS and RETIRED_IDS>.json); ownReceipt = receipts/S9.json only (:2602, r8 change 2: any
  OTHER package's receipt is deliberately not exempt); child argv targets (childArgv :708); carrierSuccessor.file.
- Of the PM's seven, four are TOOLING_FILES (packages/S9.json, test/execution-targets, test/gate-supersession,
  test/seal-tip-and-byte-identity). THREE remain, identical at 6dc2596 and at HEAD (names-only replica, spec read from each rev):
  rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs, rebuild/lanes/b/tooling/receipts/S8.json,
  rebuild/m4/spec/review-s8-real-shape.json.
### 7.2 How S8 handled the class, and every earlier package
- Measured from each spec at HEAD: parent review and parent receipt are both ancestors of sourceBase for H3 (receipt n/a), S3,
  S4, S5, S6, S7 and S8, and none of those packages declares any receipts/ or m4/spec/review-* file in product. S8: sourceBase
  8ebc860 (the DECISIONS:523 dispatch commit) already contains S7's review 6e09a54 and receipt c698a18, so neither was ever in
  S8's diff. S8 therefore has NO product-declaration precedent for a parent's review or receipt.
- S9 is the first package whose sourceBase predates its parent's seal evidence: 0cd07be is "S8-REAL-SHAPE: proposed artifact";
  the review d79ebd2 and the receipt ef49245 (DECISIONS:528) came after it. P-S9-1 (DECISIONS:627) fixes 0cd07be, "re-measured
  at integration, never rebased" (brief :62-67, :864-877). So the S8 precedent (a sourceBase after the parent's seal) is not
  available to this builder: moving sourceBase is the PM's.
- S8 precedent for a file its package itself changed and that neither parent map pins: role "new", pre = the sourceBase blob,
  post = its bytes (S8.product rebuild/m4/workout/engine-history.cjs, rebuild/m3/w7-preview/today/local-source-basis.mjs).
  product() :2480-2483 admits only "new" or "pinned-unchanged" for such a file ("edited" refuses UNLISTED-PRODUCT-DRIFT).
  ci-second-gate.test.cjs is that case: S9's own edit d4a3c92 under P-S9-5 (DECISIONS:627), in neither S8 map (brief 9.8).
### 7.3 The change (S9.json only, plus this section)
- Added product["rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs"] = {pre 237dcb89279dfdbbb5c4011172c9149f8b23b7b170448b41ffa03e509ee03b2c
  (git show 0cd07be, 10191 B), post f3c470c60748e637c82130a121d18bee989b537e45a619e74ee1f63998a276a5 (HEAD = disk, 11840 B;
  equals S9-INTEGRATION-HAND-REPORT.md:541), role new}, placed after release-from-seal.test.cjs. +5 lines, nothing else moved;
  256 product pins (was 255). No child, no note, no sourceBase change. It is not executed by any child and need not be (the Y1
  own-child rule counts children, it does not require every "new" file to run).
- S9.json c5df18f1ec8a1e2d069fef4f46e396c81690167616cdd2373521d02cdffa4975 (91266 B) ->
  00e4db81c3aae9e05fa8d412c3e1073892dd23c29622fb372aa3581e4a5cf151.
### 7.4 Red first, then static (lock taken and released)
- Names-only replica %TEMP%\opus55-s9r7\unl.cjs (git names + JSON.parse; TOOLING_FILES/IDS/RETIRED_IDS read as text from the
  runner): committed spec at 6dc2596 and at HEAD -> UNLISTED 3 (the three above); working-tree spec -> UNLISTED 2
  (receipts/S8.json, review-s8-real-shape.json).
- staticcheck.cjs (opus55-s9prep, unchanged): 28 PASS, 0 REFUSED; "256 pins", "32 children", spec sha256 row 00e4db81c3aa...
- Scratch extension %TEMP%\opus55-s9r7\staticcheck-r7.cjs (not in the repo) adds five rows: TOOLING_FILES 31 entries PASS;
  fidelity replica sourceBase..HEAD REFUSED and sourceBase..worktree REFUSED, both "UNLISTED-SOURCE-CHANGE
  rebuild/lanes/b/tooling/receipts/S8.json rebuild/m4/spec/review-s8-real-shape.json"; product() role branch (every entry in
  neither S8 map is new or pinned-unchanged) PASS; ci-second-gate pre = sourceBase blob, post = disk = HEAD, pre != post PASS.
  Loaded only itself, legacy-gates.cjs, target.cjs, trace-v2.cjs, strict-json.cjs. The unlisted set is NOT empty: see 7.6.
### 7.5 Measured for the PM, not applied: a sourceBase that mirrors S8
- e8712f48b32e33738cdf81dd8d6cd72d0a72523d (the S8 seal merge, DECISIONS:529) descends from 0cd07be, d79ebd2 and ef49245 and is
  an ancestor of HEAD. S8 parent pins (product + executionPins, 227): 222 public paths hashed with node crypto at 0cd07be,
  ef49245 and e8712f48, 222 equal and 0 different at each; the protected five were NOT hashed (PM seat only, :796 (d)).
- git diff 0cd07be e8712f48 -- rebuild .github: DECISIONS.md, coach/engine-revision.cjs, lanes/b/VERDICT-S8.md, receipts/S8.json,
  review-s8-real-shape.json; none is an S9 product key, so no declared pre moves (ci-second-gate's pre is the same blob there).
- Replica with sourceBase e8712f48 and this working tree: UNLISTED 0 (15 changed).
- No executable cell names 0cd07be (git grep, explicit pathspecs, private/soak/ledger/src/protected five excluded): only
  S9.json (2), S8's receipt and review, VERDICT-S8.md, DECISIONS.md and lane reports, including Astra's source-checker reviews
  and permission record, which fix sourceBase 0cd07be for the bounded protected-five check (DECISIONS:757/:766).
### 7.6 STOP: what the PM must rule (this builder takes none of these)
- (A) Mirror S8 by moving sourceBase: "P-S9-1 AMENDED: the S9 sourceBase is e8712f48b32e33738cdf81dd8d6cd72d0a72523d (the :529
  S8 seal merge), where review-s8-real-shape.json and receipts/S8.json already stand, as S8's own sourceBase 8ebc860 stood after
  S7's review and receipt; 222 of 222 public S8 parent pins re-measured equal there, the five protected re-measured by the PM
  seat only; every pre re-measured · RULED". Cost: the S9.json sourceBase value and Astra's fixed-sourceBase checker record.
- (B) Keep P-S9-1 and declare the two files in S9.product, role new, pre null, post
  3b1b8b91dd5a6ff049dffd721ec723b9fe550b0b71ba78e37574cfc96210d409 (receipts/S8.json, 28436 B) and
  f7b9b51e38755f3364b398189b50be927e058b8606945f1a9fb51e1cd66cc632 (review-s8-real-shape.json, 480 B). The runner admits it,
  but "new" says this package wrote them and it did not; no package has done this. Needs a PM line saying so.
- (C) A reviewed runner round exempting the chosen parent's own receipt and review in fidelity(). The runner is pinned; not
  recommended this late.
### 7.7 Where c5df18f1 (the old S9.json sha256) is cited. Not changed; for the PM
- This file :188 (6.5) and :206 (6.6); rebuild/lanes/fable/reviews/REVIEW-S9-EXPORTER-CONTAINMENT-FINAL-l1.md:15;
  rebuild/lanes/fable/reviews/REVIEW-S9-FENCE-KEYS-l1.md:25 and :93; commit message 63bf01d; %TEMP%\pm-s9r6-msg.txt:4.
  Not in the ledger DECISIONS.md, in no test, workflow or other package spec. Other worktrees and remote refs not searched.

## Round 7 (b) (sourceBase moved under DECISIONS:804) (builder claude-opus-5-5, 2026-09-24) - UNCOMMITTED, for the PM
Ruling applied: DECISIONS:804 option (A), P-S9-1 (:627) AMENDED, S9 sourceBase = e8712f48b32e33738cdf81dd8d6cd72d0a72523d (the :529
S8 seal merge). Worktree earned-s9int at HEAD 8306c3f; round 7 (7.1-7.7 above) is kept, 7.6 is answered by this section.
### 7b.1 The move (S9.json only)
- S9.json:16 "sourceBase" 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f -> e8712f48b32e33738cdf81dd8d6cd72d0a72523d. e8712f48 is a commit
  ("M2-S8-REAL-SHAPE: VERDICT-S8.md terminal (byte-identity)"), descends from 0cd07be, d79ebd2 (review) and ef49245 (receipt), and is
  an ancestor of HEAD, of 6dc2596 and of refs/remotes/origin/rebuild/t2-client-core (runner ancestor() SOURCEBASE-NOT-BEHIND-HEAD holds).
- Whole-tree git diff --name-only 0cd07be e8712f48 = exactly five files: rebuild/DECISIONS.md, rebuild/coach/engine-revision.cjs,
  rebuild/lanes/b/VERDICT-S8.md, rebuild/lanes/b/tooling/receipts/S8.json, rebuild/m4/spec/review-s8-real-shape.json; none is an S9
  product key. Tree ids of rebuild/engine, rebuild/m3, rebuild/m4/workout and .github are equal at both commits.
### 7b.2 Every pre re-measured at e8712f48 (runner semantics: product() :2455-2483, held() :2241-2246, pins() :2291-2401)
- 256 S9 product entries: 251 public by node sha over git blobs (parent-pinned: pre = S8 pin = blob at e8712f48; others: pre = blob
  at e8712f48, or null and absent there); the protected five (all role carried) NOT read or hashed: git ls-tree reports the same blob
  id at 0cd07be and e8712f48 for each, so their pre is unchanged. Blob ids of all 256 are equal at both commits.
- 227 S8 parent pins (product + executionPins): 222 public equal by sha at e8712f48, 5 protected same blob id; 0 broken.
- 207 S7 grandparent pins declared in S9.product: identical held() outcome at both commits.
- Execution pins: the one superseded-by-child entry keeps pre = its S8 executionPins pin (sourceBase-independent), equal.
- PRE VALUES THAT MOVED: NONE (0 of 256).
- ci-second-gate.test.cjs KEEPS its product entry: its only later commit d4a3c92 (P-S9-5) is not an ancestor of e8712f48 and the
  file changed e8712f48..HEAD; pre 237dcb89279dfdbbb5c4011172c9149f8b23b7b170448b41ffa03e509ee03b2c = the e8712f48 blob (= the 0cd07be
  blob), post f3c470c60748e637c82130a121d18bee989b537e45a619e74ee1f63998a276a5 = HEAD = disk, role new. Unchanged from round 7.
### 7b.3 Citations of 0cd07be checked; what the move required
- S9.json: only :16 (sourceBase, moved) and the D-BLOM note :1784. D-BLOM called 0cd07be "S8's seal commit ... (this spec's
  sourceBase)"; 0cd07be is "S8-REAL-SHAPE: proposed artifact", the commit DECISIONS:528 accepted, and the seal merge is e8712f48 (:529).
  Rewritten to: "moved after S8's proposed-artifact commit 0cd07be (the commit DECISIONS:528 accepted; this spec's sourceBase until
  P-S9-1 was amended at DECISIONS:804 to the S8 seal merge e8712f48, which holds the same rebuild/m3 and rebuild/m4/workout trees as
  0cd07be) ... (0cd07be..6dc2596, equally e8712f48..6dc2596, ...)". The eight named files are the same set over e8712f48..6dc2596
  (names-only diff, soak-named paths excluded). No other note, needle or child changes.
- The two coverage "why" strings (:1363, :1389) say "this package's own sourceBase" generically; the children read SPEC.sourceBase
  (s9-supersede-*.test.cjs), and rebuild/engine is the same tree at both commits, so their text and bytes stay.
- Brief (sha-bound at :789, NOT edited): :62-67 offers 0cd07be as a MEASURED CANDIDATE "for the PM to name ... never rebased"; :864-877
  requires a sourceBase at which EVERY S8 parent pin holds. e8712f48 meets :864-877 (227 of 227, 7b.2); the "never rebased" rule is
  superseded for this package by the PM's amendment at DECISIONS:804. Brief text needs no change.
- History left as is: VERDICT-S8.md, receipts/S8.json, review-s8-real-shape.json, lane reports, Astra records, Fable reviews.
### 7b.4 Red first, then static (lock %TEMP%\earned-runtime.lock taken, released; exit 0 both)
- Red kept: names-only replica unl.cjs on this working spec with sourceBase forced to 0cd07be -> UNLISTED 2 (receipts/S8.json,
  review-s8-real-shape.json); committed spec at HEAD -> UNLISTED 3 (+ ci-second-gate). Green: working spec (e8712f48) -> 15 changed,
  UNLISTED 0.
- staticcheck.cjs (opus55-s9prep, unchanged): 28 PASS, 0 REFUSED; 256 pins, 32 children, spec sha256 row bb169a67847d....
- %TEMP%\opus55-s9r7b\staticcheck-r7b.cjs (round 7 replica plus six R7b rows, scratch): 39 PASS, 0 REFUSED; both fidelity replica
  rows now PASS "15 changed, 0 unlisted". Loaded only itself, legacy-gates.cjs, target.cjs, trace-v2.cjs, strict-json.cjs.
- S9.json 00e4db81c3aae9e05fa8d412c3e1073892dd23c29622fb372aa3581e4a5cf151 -> bb169a67847d10963fcaa0d69c14d5e157ad0a81525e22352ef116d6071ac86c
  (91741 B, LF; 33 pre-existing U+2013/U+2014 in committed "why" text, none added).
### 7b.5 What Astra's source-checker record (DECISIONS:757/:766) needs for the bounded re-check
- Helper: %TEMP%\earned-s9-source-custody-checker-sol-20260921\s9-source-custody-check-a23c079-directory-fix.cjs (sha256 83eb00a9...,
  L3 accepted, receipt S9-SOURCE-CLOSURE-PASS-2026-09-22.md). It hard-codes L7 CANDIDATE a23c079b... and L8 SOURCE_BASE 0cd07be...,
  and refuses S9_SOURCE_BASE_MISMATCH (L280) when S9.json's sourceBase differs; the earlier 1528b20 helper does the same (L8, L268).
  Run unchanged against this S9.json it REFUSES.
- Change exactly two values: L8 SOURCE_BASE -> e8712f48b32e33738cdf81dd8d6cd72d0a72523d; L7 CANDIDATE -> the PM's commit carrying
  S9.json bb169a67.... Bounded review of that two-line delta (its own record says a changed candidate/spec/helper needs one), then the
  PM runs it with --allow-protected-five under :766.
- Expected: STAGE1 PASS pins=227 protected=5 (protected five: same blob ids as the 0cd07be run); STAGE2 over the final 32 children
  (81 unique non-flag argv by my count, against 83 targets over 33 groups at a23c079; the helper's own count governs); VERDICT PASS.
- Records the PM/Astra then supersede (not edit): S9-SOURCE-CHECKER-PERMISSION-2026-09-22.md:13-14 and
  S9-SOURCE-CLOSURE-PASS-2026-09-22.md:4-5 (Candidate/Integration and SourceBase).
### 7b.6 Not done here
- No commit; S10.json not touched (it re-binds to sealed S9 later); no b-package run; protected five never loaded, read or hashed.
- Slip: the lock file's job-name line was written with PowerShell Set-Content (scratch lock only, deleted after the run).
