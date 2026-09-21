# CLAUDE REVIEW: S9-GUARDS (D-NULL-ARTIFACT, D-CONDITION-MATCHER, the report denominators), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; not the author, not the Astra reviewer, not the PM.
Asked at DECISIONS:657, class (b): three cells to be pinned at S9. Run on Joe's word "review".
Head cf4fc766b7e7ab711eaa9a13257df3b25db70d00, base 15ab6e83a9a3f1ce8d6b3183c3280e320a294ed3, red checkpoint 6b231e3.
Owner's PC, Node v24.19.0, PC clock 2026-09-21 15:07 to 15:10 ET. Brief rebuild/lanes/b/S9-UI-PINS-BRIEF.md sha256
re-measured d8140074ccccfc2cbbbdcc011974981907e71c141a246625308adbe10c31300d (equal to :657); not read whole, scope was
held to :633 (read whole), :645, :654, :655, :656 and the five changed paths. All workflow text below is synthetic.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. The two ordered debts are closed exactly as ordered. But the five condition readers
still accept a step whose real condition is false, by two roads nobody tried, and these cells are about to be
pinned. D-S9G-DECOY is cheap now and costs a re-pin later; whether it rides S9 is the PM's call.
## EVERY HUNK, all read (5 paths, +131 -23; NO product, workflow, runner, pin or engine byte)
pack-pin.test.mjs +11 -1: the matcher, its one call site, one new row.
release-object.test.mjs +37 -10: the matcher, one call site, the real row's body lifted into releaseObjectRefusals
  with a parsed flag, the real row now calling it, two new rows.
sealed-inventory-fence.test.mjs +12 -2: the matcher, two call sites (row 18 and assertNotCancelled), one new row.
S9-INTEGRATION-HAND-REPORT.md +11 -10 and S9-GUARD-DEBTS-REPORT.md +60: read whole, after my own work.
## WHAT I RAN, under :645 and :656: NO CELL WAS RUN. Two probes of mine lift a reader's text byte for byte from the head
and execute it over synthetic input (%TEMP%\claude-epp\s9g-probe.cjs, s9g-probe2.cjs). No import, no git, no real row.
1. D-NULL-ARTIFACT, releaseObjectRefusals over 12 synthetic artifacts: null, true, a number, a string, an array each
   refuse ARTIFACT-NOT-JSON "parses, but not as a JSON object"; an empty file and a BOM before null refuse with the
   parser's words; {} refuses RELEASED-BLOCK-ABSENT; released null, array and string refuse RELEASED-NOT-AN-OBJECT-
   KEYED-BY-PATH; an absent file refuses ARTIFACT-ABSENT. One refusal each, none silent. CLOSED.
2. D-CONDITION-MATCHER, the fence's conditionOfStepRunning with the new matcher:
   A  if: ${{ !cancelled() }}                                     ACCEPTED (control)
   B  if: ${{ !cancelled() && false }}                            REFUSED  (the ordered debt: CLOSED)
   C  no if at all                                                REFUSED
   G  if: "${{ !cancelled() }}" (quoted, equivalent)              REFUSED  (a safe-side refusal; fine)
   D  env: with a variable NAMED if holding the good text, and NO step condition       ACCEPTED
   E  the same decoy key first, then the step's real  if: ${{ false }}                 ACCEPTED
   F  an earlier step that merely echoes the cell's path under a good condition, while the step that runs the
      cell has  if: ${{ false }}                                                       ACCEPTED
   D, E and F are valid workflow YAML, and in each GitHub skips the cell, or never runs it after the standing
   failure, while the row stays green: the exact silence these rows exist to end.
3. SIBLINGS. Fixed-string search of rebuild/lanes and rebuild/m4/spec (code files): cancelled( occurs only in these
   three cells, and the old loose regex occurs nowhere. rebuild.yml carries five condition lines (:258, :376, :396,
   :423, :439), every one the exact permitted text, so the strict matcher passes on the real workflow.
4. THE DENOMINATORS, re-taken with git: b9777fe4..24bef9b9 is 49 commits, 2 on the first-parent line; the two-dot
   whole-branch name count 8c2bc36e to f925b6fe is 86. As the corrected report says. "Six P4B papers" not re-counted.
## NAMED DEBT (mine)
D-S9G-DECOY THE READER TAKES THE FIRST LINE THAT LOOKS LIKE if:, AT ANY DEPTH, IN THE FIRST STEP THAT NAMES THE FILE.
  Same code at all four sites: pack-pin :1304-1311, release-object :259-266, fence :1192-1198 and :1581-1588.
  block.find(/^\s*if:/) ignores indentation (roads D and E); findIndex takes the FIRST run: line that contains the
  path, whatever that step does (road F). Smallest fix shape, a few lines per site: accept an if: only at the run:
  line's own indentation, require exactly one such line in the block, and require that EVERY run: line naming the
  file sits in a conforming step (or that exactly one does). Red first with D, E and F as the three rows.
  How bad: the workflow is itself a sealed key (S8 map, .github/workflows/rebuild.yml), so a decoy is a visible
  sealed-file diff that the PM reads; this is a tripwire that can be stepped over, not an open door. That is why
  it is a debt and not a REJECT. PAYS: before the three cells are pinned at S9 if the PM wants no re-pin, else S10.
## NOTE
Astra's L1 says plainly that no general workflow grammar is claimed; D-S9G-DECOY is outside what she claimed, not a
contradiction of her verdict. Her 40 of 40 single-clause table and her base reproduction were not re-run by me.
## NOT DONE, AND ONE THING I DID THAT I SHOULD SAY
Not run: any of the three cells, the fence or pack real rows, b-package, CI, linux, seal work. The author's
accidental fence log was not opened. DISCLOSURE: for item 4 I ran  git diff --name-only 8c2bc36e f925b6fe  with no
path after --, piped straight into a line counter. It is the same class of repository-wide name walk that got the
author's run excluded at :656. Only the number 86 reached me; no name was printed or kept. I should have scoped it.
Also: a mis-quoted git grep over rebuild and .github spilled 1351 matched lines into an overflow file; never opened.
No protected path, private fixture, ledger directory, old-app source or real measurement was opened by me.
