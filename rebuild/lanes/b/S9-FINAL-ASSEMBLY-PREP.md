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
