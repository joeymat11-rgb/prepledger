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
