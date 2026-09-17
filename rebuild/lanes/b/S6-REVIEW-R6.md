# M2-S6-TODAY-CHILD - Fable FINAL re-check R6 (scoped, DECISIONS:431 point 17, :439, :498)

VERDICT: ACCEPT. Head 8493903 on rebuild/b-s6-today-child, fetched into a detached worktree with
no private junction; scope b75e655..HEAD (my R5 ACCEPT to the author's round 5 report).

SCOPE, MEASURED. `git diff b75e655..HEAD --name-status` is exactly 13 paths: rebuild.yml (M),
DECISIONS.md (M, +2: the PM's :496 and :497), coach/test/engine-revision.test.cjs (M),
S6-AUTHOR-REPORT.md (M, +16), S6-REVIEW-R5.md (A, mine), packages/S6.json (M), the four lane D
seal-window reports and reviews (A), production-admission.test.mjs (M), production-mapping.test.cjs
(M), acceptance-s6-today-child.json (A). Nothing else. rebuild/engine, rebuild/m3, the runner and
rebuild/coach/engine-revision.cjs are EMPTY in the range; the coach constant is still the S5 literal.
receipts/S6.json, VERDICT-S6.md and review-s6-today-child.json are absent at HEAD (superseded :497).
Both lane D merges are byte-faithful (`git diff 4fcb94c 731aabc` and `git diff 40cdff8 6533858`
empty; 40cdff8 sits directly on 065bebb, merged --no-ff). rebuild.yml: one token, `--package S5`
-> `--package S6` at line 127, S6.json's post for it the disk byte 8f1d5ba2b087, inside the package.

THE TWO WINDOW RULES, NO WEAKER, RED SIDES RUN BY ME (TZ=America/New_York
MEASURED_TEST_NOW=2026-09-03, pair + coach file together, 34 cells):
- real tree (window state): pair 28/28, coach file 6/6, full coach suite 234/234, fail 0;
- receipt PRESENT + wrong constant (synthetic receipts/S6.json, constant left at S5): 30 pass /
  4 fail, P3-M3, P3-P6 and both coach real-tree cells red, each naming "must name S6 as
  M2-S6-TODAY-CHILD@<sha16>, not M2-S5-...": the sealed trip-wire is intact;
- receipt ABSENT + wrong constant (coach literal set to M2-S6-TODAY-CHILD@0123456789abcdef):
  30 / 4, the same four cells red naming S5 and the rule; P3-P6 step 1 refuses by rule;
- packages/S6.json status set to DRAFT: 27 / 4, every real-tree reading fails BY NAME ("is
  DRAFT, not BRIEF-ACCEPTED, so no sealing window is open"); the admission file refuses at load.
All fixtures restored; `git status --porcelain` empty afterwards. The three copies of standingSeal()
are the same code; the fixture cells (M3A/M3B/M3C and the coach trio) execute the sealed red, the
window red (stale grandparent, random string) and the four by-name states. S5.json pins none of
the three files, so role `new` over a real pre-image is the :496 shape.

THE ARTIFACT IS proposed(). acceptance-s6-today-child.json sha256
0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f, 80625 bytes; spec
2415c473b090e808acd7b5f646e11e9b9ae28883a1ccb1974d938afbe825be57; runner 8d9a94c20faa2e85...
(all three re-hashed by me). With a scratch PENDING review the unmodified runner passed
SEALED-PROFILE-RECOMPUTATION and printed `B PACKAGE S6 ENVELOPE PENDING artifact=0e52357e...
spec=2415c473... runner=8d9a94c2...; independent exact-artifact acceptance required`, all 23
children OBSERVED exit 0 (m4-import-production 8245 bytes, wall 2229 ms; today-17 149808 ms),
then `PUBLIC CI EVIDENCE PASS`. Scratch review deleted; never committed; tree clean.

NOTES, none blocking: (1) the tip's :498 line (78f04915) is NOT on this branch yet: HEAD..78f04915
is that one DECISIONS.md line and nothing else; :498 itself orders the tip merge after the new
receipt line, so it is the PM's step before the authorized --full, not the author's. (2) the coach
test moved under :498's dispatch and is declared by no package (coach is outside S6's product map);
no coach product byte moved. (3) the rebuild.yml step NAME still reads "Cumulative S5 today
child" (cosmetic; the rule reads the run line). (4) fakeRoot() leaves erw-*/ dirs in the OS temp.
(5) the only dash lines in the range are the PM's :496 and the two quoted :60/:49 ledger bytes the
artifact carries exactly as S5's does; every author-added line is LF, no CR, no U+2013/U+2014.
Authorship cowork (Earned PM), Co-Authored-By Claude Opus; not pushed; no npm; census never opened.
