# P3-IMPORT-UI-2 REVIEW R1 (independent, Opus high)

VERDICT: REJECT - on finding 1 alone. The law, the route, the refusal paths and
the disclosure are good work and I reproduced all of them; what I cannot pass is
that the entry link this ticket puts on Measure does not work on a phone, and
that bar item (a) is green only because the cell gives Measure a second store.

Subject 4c058a2d4a9b5165bf97dcea592b5f01a9eb83e0 in %TEMP%\earned-iu2-rv
(detached). Base: I fetched; origin/rebuild/d-p3-followons is still 26ab3ab, has
NOT moved since the author rebased, and is an ancestor of the subject. 18 files
drift exactly as reported; no rebuild/engine byte, no src/, no w6 product byte.

## Findings

1. BLOCKING - THE MEASURE ENTRY LINK DOES NOT WORK ON ONE STORE, AND BAR (a) IS
   GREEN ONLY BECAUSE THE CELL GIVES MEASURE A SECOND ONE. My cell RV-2: one
   IDBFactory, one installation through gym-host.mjs openTodayHosts, first run,
   then the athlete LOOKS at Measure until the markers pick paints (ops 1 -> 3),
   taps "Import my history" and walks pick/words/Unlock/Yes/confirm. Result:
   step=pick, LOCAL_SOURCE_CONTEXT_UNRESOLVED, importAdmitted=false, imports [].
   The same tap on the FIRST frame, before the measure lane's write lands, does
   admit - so it is a race the athlete loses every time, not an edge case.
   route.test.mjs openMeasure() hands the page a SEPARATE IDBFactory, which is
   why P3-U1/U2 are green; edge-route.mjs navigates ?screen=import and never
   taps the link. So what bar (a) asks for - the whole tap sequence, from the
   Measure link, admits - is executed nowhere on the configuration a phone has.
   P3-X9 pins the collision honestly, the retract is clean (ops/outbox/imports/
   basis unchanged, I checked), and the fix IS lane D's replay family. But :470
   puts the primary entry on Measure and the runbook then tells the operator
   not to open Measure. PM ruling: teach the family, or move/withhold the link.
2. MAJOR - THE "CHUNK" DEVIATION, confirmed; the PM word the author asks for is
   due. There is no second output file: 293 KB of admission stack rides in the
   one boot asset every athlete downloads on first load whether or not he ever
   imports, so "the A5 precache lists the chunk" holds only of the asset the
   route happens to be in. The property that matters - the boot path never RUNS
   the stack - is enforced (P3-B6, the law cell); splitting costs 25 files.
3. MAJOR - P3-B5's "before" IS NOT THE PRE-ROUTE PAGE. SCRATCH/baseline/app.js
   is built at HEAD from today-entry.mjs, so it already carries the route;
   `built - before` is a few hundred bytes and `assert.ok(built - before <
   400000)` cannot fail. Only the hardcoded 121 in `assert.equal(today
   .inventory.length - 121, 15)` carries the real delta. The report's headline
   byte figures are hand-measured, not proved by a cell. They are RIGHT - I
   built the base and got 1,668,331 B / 121 - but a reader will think P3-B5
   proved them. Build the base in the cell, or say so in the comment.
4. MINOR - THE REFUSAL LINE PRINTS THE CODE TWICE. My cell RV-3 reads the
   painted box on the stranger bundle: "LOCAL_SOURCE_PROGRAMME_UNRESOLVED
   (LOCAL_SOURCE_PROGRAMME_UNRESOLVED)". confirm() passes codes[0] as the code
   and the same joined list as `detail`, and codeLine() renders CODE (detail).
   Every post-custody refusal on the confirm path reads this way. A doubled
   code is not the machinery's copy verbatim. One line: drop the duplicate.
5. MINOR - `entryLabel` (import-screen.mjs:171) is dead and its comment is
   untrue. Nothing imports it; today-app.cjs carries its own IMPORT_LINK_NEW /
   IMPORT_LINK_DONE duplicates (rightly, so a link cannot pull the chunk). The
   comment claims it exists "so the Measure line and the setup screen can never
   disagree"; what actually keeps them honest is P3-U1 and P3-U5 asserting the
   painted text against Screen.COPY. Delete it or name the cells.
6. MINOR - THE AMENDED P-MEASURE (g) NAMED SET NEVER RUNS ON THIS BRANCH. The
   cell dies first at boundary.test.mjs:105 (`undeclared` is the four sealed
   files), so the widened deepEqual over [MINE, ...P3_IMPORT_UI_2] - the part
   that keeps a sixth file under today/ red - is unexecuted until S6 declares
   the bytes. The widening is correctly reasoned in place; say it is unproven.
7. MINOR - RE-OPENING IMPORT AFTER ADMISSION SHOWS THE DONE SENTENCE AGAIN.
   importScreen is cached and paint() tests `step === 'done'` BEFORE
   `deps.admitted()`, so for the rest of the page session "History imported"
   re-opens "Imported. Today and your gym card now use it." instead of the
   read-only summary :470 asks for. Correct again after a reload.
8. MINOR - one added line carries U+2014: the runbook heading "## Move + unseal
   (phone) - the real taps". Exactly two added lines in the diff carry a dash;
   the other is the dash detector's own regex. Athlete-facing copy is clean.
9. NOTE - on a FRESH installation the link is not on a "No baseline yet" line:
   my Edge run records the line it sits on as "Strength markers" and
   importLink() appends to the end of the screen there. Handled and commented,
   just not :470's wording.
10. NOTE - the ticket cites the identity question at source-admission.mjs:80;
    it is line 96 now. The string is byte-identical to the screen's constant,
    and identityYes() refuses LOCAL_SOURCE_IDENTITY_QUESTION_CHANGED if the
    controller ever differs - a real guard, and the right one.
    Also: import/test/*.test.mjs is still absent from rebuild.yml, so none of
    the 32 cells runs in CI; page-bundle.test.mjs was absent at the base too,
    so that is carried, not introduced.

## What I executed

THE LAW, mutated twice and reverted (git status clean after): adding `import
"../../../m4/import/replay-core.cjs"` to today-entry.mjs makes A1 AND A5 refuse
- "IMPORT-ROUTE FAIL: the Today boot graph reaches rebuild/m4/import/* ->
rebuild/m4/import/replay-core.cjs (from rebuild/m3/w7-preview/today/today-entry
.mjs)" - naming the file and the importer, as promised; a SECOND static importer
of import-screen.mjs makes A1 refuse and print both importers.
THE PRODUCTION BINDING, mutated and reverted: one nibble of ENGINE.sha256 in
production-mapping.cjs and the REAL route refuses SOURCE_ENGINE_CONTEXT_UNPROVEN,
prints it verbatim, retracts itself and leaves ops/outbox/basis unchanged with
one entry in the retraction register (RV-1). The screen binds the PRODUCTION
registry, not a TEST-ONLY one.
BUNDLE, by building the base in its own worktree: base 1,668,331 B / 121 pinned
inputs; HEAD 1,961,505 B / 136; +293,174 B (+17.6%), +15 modules; Today boot
graph 121, the same set. (The report says 1,961,006 after; the 499 B does not
reproduce on this sha - not material, but re-read the figure.)
TAILS (mine, TZ=America/New_York): import/test/*.test.mjs `tests 32 / pass 32 /
fail 0`. today 13 + measure 5 (MEASURED_TEST_NOW=2026-09-03) `tests 678 / pass
673 / fail 5` - all five sealed-byte declaration reds (P-MEASURE (g), N1.18,
S10, two setup.test re-pins), none behavioural; the author's 667/662/5 is the CI
17 only. W6 `586/586/0`. w6/host `38/38/0`. m4/import `86/86/0`. coach
`231/231/0`. A5 suites `56/56/0`. port `65/65/0`. rig187 `PASS`. A1 "TODAY BUILD
PASS: 3 assets; 136 pinned inputs (15 engine, 12 client); Today boot graph 121
modules, carrying no migrate.cjs, no merge.cjs and none of the m4/import lane".
A5 "PWA BUILD PASS: 13 files; 11 precached". b-package --ci --package S5 exit 1,
"B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION" - expected. EDGE reproduced
with real msedge.exe: "P3 EDGE-ROUTE PASS ... 14 labels recorded", engine
revision M2-S5-TODAY-CHILD@0df73b01f3d2d935; every runbook label matches what I
saw. rebuild/m4/import/test/s3/* is 17/3/14 here AND identically at the base
("Actual owned dispatcher scratch required") - invocation, not a regression.

OTHER: no assertion deleted - exactly three assert lines are removed across the
four amended sealed tests, each replaced by the same fact restated wider with
its rule written where the old one stood. LF only on all 18 files; commit
authored cowork (Earned PM) with the Co-Authored-By line. S5 classification is
right: copy.test.mjs is in S5.json only as a today-17 argv entry, not in the
sealed-file map; today/build.mjs is genuinely unpinned. Synthetic bundles only.
