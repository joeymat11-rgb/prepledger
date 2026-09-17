# ENGINE-REVISION-SEAL-WINDOW - independent review R1

VERDICT: ACCEPT. sha 4fcb94c5 off 45d14832, read in a detached worktree,
junctions only, the census junction never opened. Three files: the two test
files and the author report; `git diff 45d14832 HEAD` over rebuild/engine,
coach/engine-revision.cjs, production-mapping.cjs, packages/S6.json and
production-admission.test.mjs is EMPTY. All three are ASCII, LF, no dash.

THE TICKET'S FINDING IS MISFILED AND THE AUTHOR'S CORRECTION IS RIGHT: with both
test files reverted to 45d14832 the child is 24 pass / 1 fail, the one red being
P3-M3 of production-mapping.test.cjs (ENOENT on receipts/S6.json), while
production-admission.test.mjs is 8/8 and reads no receipt. Coach glob 229/2.

THE RULE IS AS STATED AND NOT WEAKER - my own mutants, real tree, all reverted:
(a) a SYNTHETIC receipts/S6.json beside the S5 constant -> 23 pass / 3 fail
    (coach 1-2 + P3-M3), refusing "must name S6": the sealed trip-wire bites.
(b) constant -> M2-S4-TODAY-CHILD@171ebcd4d4b3b2b4 -> the same 3 red, "must
    name S5"; constant -> NOT-A-PACKAGE@abcdef0123456789 -> the same 3 red.
(c) packages/S6.json held aside (no receipt, no spec) -> the same 3 red BY NAME
    ("neither a sealed receipt nor a spec"), never by ENOENT.
(d) the tree as it stands -> GREEN, state "window": S6 BRIEF-ACCEPTED, parent
    S5, receipts/S5.json present, constant == that receipt's packageId@sha16.
AND THE NEW CELLS BITE: delete the BRIEF-ACCEPTED refusal from standingSeal in
both files and P3-M3C + its coach twin go red; make the comparison accept any
constant and P3-M3A/P3-M3B + their twins go red. Load-bearing, not decoration.

COUNTS REPRODUCED (Node 24, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York):
child -> `# pass 28` / `# fail 0` (needle 25 -> 28); coach glob -> 234 / 0 with
engine-revision-gap.test.cjs in it, green. Every author figure matched mine.

TAILS, none blocking. 1. The author's handoff is the only pin that moves:
S6.json pins production-mapping.test.cjs `pinned-unchanged` (pre == post
5d7285af...) and the child needle `# pass 25`; the PM re-measures both at the
reseal - its new sha256 is
c8ac076f8260743a72e9652f6a3597ccb7365ba28a9118832d92e4a0b1539251. 2. No spec
(S4/S5/S6) names a rebuild/coach path, so the coach test's new bytes collide
with no pin. 3. Two hand-written S5 literals go red at the reseal by design, not
here: production-admission.test.mjs P3-P6 and the stale header comment of
coach/engine-revision.cjs ("Currently the standing CI step is `--package S5`").
