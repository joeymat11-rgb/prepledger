# REVIEW S9 FINAL SPEC, l3 (reviewer claude-fable-5-1, 2026-09-23). Review only; nothing under review modified.
Inputs by sha256: S9.json e86215fb (uncommitted, diff HEAD 105/25), report aa854b90, staticcheck.cjs 419a77aa; chain
origin/rebuild/t2-client-core 94eebbc, DECISIONS 790 lines, no CR, ends LF. Disclosed slip: my first command ran git fetch -q
origin inside earned-s9int (remote refs only; the ref already stood at 94eebbc); no worktree switched, nothing written.
## VERDICT: ACCEPT WITH NAMED DEBTS (bytes correct vs chain and runner; F1 false prose, fix before commit; F2 sequencing)
## Chain lines and shas (chk7.cjs at 94eebbc, git show by explicit path)
:786 RFS 339 B 46a64dc0, :787 GS 657 B b8d088af, :788 THEME 810 B ff25c85a, :789 BRIEF 315 B 04b0f897: each line's bytes ==
the R2 draft line verified in l2, each sha == the draft sha, each unique on the chain; tags "cowork (PM)" / "cowork", verbs
the terminal clause. release.rulingLineSha256 == sha(:786); coverage.superseded.rulingLineSha256 == sha(:787). Claims theme and
brief.acceptedLedgerLine carry S8's four keys in S8's order, ledgerLine 788/789 == found positions, role cowork, line
byte-equal to the chain line, self-hash true; status BRIEF-ACCEPTED satisfies :1873/:1880; brief.sha256 == disk abf3f670.
## staticcheck.cjs re-run myself under %TEMP%\earned-runtime.lock (taken, released). Before running: it requires only
rebuild/conform/v4/postfix/{legacy-gates,strict-json}.cjs -> target.cjs -> trace-v2.cjs; their top-level require() lines are
node builtins and those two relatives (target.cjs:87-88/:130, legacy-gates.cjs:102 name loaders inside functions never
called here); its first check prints require.cache: five files, none under rebuild/engine, no b-package.cjs. Result 23 PASS,
1 REFUSED "CHILD-NEEDLE-EMPTY b-lom", exactly :1951. Its releaseRuling restatement finds :786 granting the two declared
released paths (pre == parent post pins, no argv/execution-pin collision); supersessionRuling finds :787 granting the five
carriers == superseded.gates keys; spec sha e86215fb.
## Break attempts. Whole-spec placeholder scan: no <LN_*>, TO_COMPLETE or NONFINAL. Structural diff vs HEAD (28 paths):
status, brief.acceptedLedgerLine, superseded.status removed, superseded.rulingLineSha256 and gates, theme, the 19 hunk-A
needle indexes (0,2,4-8,11-18,20,21,23,24), notes[0], notes[1], release. Nothing else moved: 18 needles still equal the
l1 receipt counters, children[4] is "# pass 4". b-lom null is correct: the receipt says HELD_SPLIT_REQUIRED, counters null;
the runner refuses by name and an invented needle would be a fabricated observation. notes[1] states the prediction and the
b-lom refusal plainly; "# pass 4" is admissible only as a prediction a green run confirms (SUP-4 :180-183; :2808, :2824).
F1 (fix before commit): all five coverage.superseded.gates[*].why still say "(PROPOSED: not yet on the chain, so
rulingLineSha256 stays null and the runner refuses GATE-SUPERSESSION-RULING-NOT-CITED until the PM writes it)": false now
(:787 cited). The runner reads why for shape only (:1630-1634), so nothing refuses, but a sealed spec would carry a false
statement; write "DECISIONS:787 (RULED), located by its own sha256 b8d088af..." as S8's whys do. notes[1] opens with the
label "PROPOSED notes[1]:" beside status BRIEF-ACCEPTED; drop the label.
## Hosted standing step as execution of record (rebuild.yml, :627, :565): YES, no new owner grant, on four conditions.
rebuild.yml:150 runs `b-package.cjs --ci --package S8` on push/pull_request to rebuild/** (:3-7), both OS (:19-24), Node 22
(:39); children() runs in --ci (:3850, :2794-2846) and already spawns S8's equivalent source-carriers child on every push, so
the protected loads there are the standing CI the RULES name ("CI is where the full suites run"), not local execution and
not the hosted20 packet. (i) The S8 -> S9 flip lives INSIDE S9's post (rebuild.yml is a declared product file; VERDICT-S6
rule (a), :498). (ii) It passes only where the chain tip stands in HEAD's first-parent chain (SEAL-BASE-IS-NOT-THE-CHAIN-TIP
:3534): at the merge-forward, which :627 makes the measuring point and :565 keeps valid when only DECISIONS/STATUS follow.
(iii) The artifact must be committed first or release-object's REAL ROW is red (release-object.test.mjs:295, :324-331), and
b-lom filled. (iv) --ci prints PUBLIC CI EVIDENCE PASS, never the verdict (:3897); PASS and --full stay owner-gated; a CI
sentence names run id and conclusion (:627). F2: the report's step list must state (i)-(iv) in that order.
