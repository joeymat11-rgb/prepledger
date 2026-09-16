# P3-IMPORT-UI-2 REVIEW R3 (Fable final, independent; DECISIONS:439)

VERDICT: REJECT - two executed MAJOR defects on the athlete's own path, each a
small fix with a cell; everything else the ticket asked for holds and is
re-proven below with my own cells, bundles, graph walk and Edge run.

Subject: 78eb15f on rebuild/c-p3-import-ui-2 (author round 2), reviewed on a
detached worktree at f84c2cd (= 78eb15f + REVIEW-R2.md, product byte-identical),
three junctions, tree clean before and after. Re-fetched before reporting:
origin/rebuild/d-p3-followons 26ab3ab3 UNMOVED, no rebase; tip e4c1bd6b (:479-
:480 ledger only); no P3-REPLAY-MEASURE-FAMILY branch on origin yet. Bundles
SYNTHETIC (port.cjs over the accepted clean-init constructor); no private
fixture, ledger, src/history.js or real folder opened.

## What I executed myself (%TEMP%\iu2-rv\, TZ=America/New_York)
rv3-route.test.mjs 9/9, the phone's ONE store (gym-host openTodayHosts, one
IDBFactory), the SHIPPED route by taps, my own bundles (own, LABEL-ONLY
stranger, programme stranger):
- RV3-1 summer: Today link -> pick -> words -> Unlock -> the question, typed by
  me from source-admission.mjs:96, verbatim; every consumer read (revision, ops,
  outbox, listImports, boot flag, page basis, P2 join, companion gate) is
  byte-identical through pick, Unlock and the painted question; custody null
  and the production registry NOT yet built while the question stands; Yes ->
  custody, then Production.createProductionProducerRegistry called once with
  {hash} and no digest (spied on the module object the screen imports); the
  review repeats the controller's question and prints
  M2-S5-TODAY-CHILD@0df73b01f3d2d935; confirm -> done; no op minted, outbox
  unchanged, applied+basis true, no TEST-ONLY string in the generation; Today
  and the gym card on the imported loads, Measure baseline non-empty, note
  hidden, Trial day one 2026-09-16, ops all -04:00; History imported on Today,
  on Measure and after a dispose/reopen; no trap fired.
- RV3-2 winter: the same at -05:00; a set saved after; dispose+reopen keeps the
  three imported days and the set.
- RV3-3 wrong words: BUNDLE_AUTH_FAILED once + the one sentence, nothing
  written, words and file kept, the right words then unlock the kept draft;
  flipped byte: same code, nothing written (and finding 2 below).
- RV3-4 label-only stranger: No writes nothing; Yes is ADMITTED to review by
  the machinery (the identity question is the only guard, executed); Back on
  the review retracts: every consumer read equal to pre-stage, revision +2.
- RV3-5 programme stranger: LOCAL_SOURCE_PROGRAMME_UNRESOLVED once, retracted,
  nothing left but the retract record. RV3-6: a registry that refuses paints
  SOURCE_ENGINE_CONTEXT_UNPROVEN verbatim and retracts; MAPPING_ID not TEST-ONLY.
- RV3-8: the Measure link on one store after the markers pick (4 ops on the
  store) refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED, prints it once, retracts clean.
- RV3-9: after admission both links read History imported, the summary names
  the import, the route paints no pick; a different file through the machinery
  is LOCAL_IMPORT_REBASE_REQUIRED, the same file LOCAL_IMPORT_ALREADY_PRESENT.
rv3-graph.mjs: my own walk of esbuild's metafile from today-entry.mjs, never
into import-screen.mjs: 136 inputs, boot 121, route-only EXACTLY 15 (migrate
121,552 B, merge 34,935 B, seven m4/import files incl. production-mapping
10,905 B and replay-core 36,395 B, source-admission, source-platform,
browser-entry, reading-history, coach/engine-revision, import-screen 16,638 B);
app.js 1,961,495 B on disk, 1,953,002 accounted, route-only 287,887 B (14.7%),
boot 1,665,115 B; ONE output file, init_import_screen() has one call site. Four
metafile mutants refused (boot imports merge; second importer; static import of
the route; boot requires engine-provider) and ONE REAL mutant (today-entry.mjs
imports merge.cjs, restored): A1 REFUSED naming file and importer. A5's
app.e37f0cb4e4852e60.js is byte-identical to my A1 app.js, carries the route,
sw.js precaches it; no second chunk. Edge: the author's edge-route.mjs run by
me, real msedge.exe, real clock: PASS, 15 labels, all matching the runbook; my
own probe read the served Today link at 44 px and the inputs at 16 px.

## Findings
1. MAJOR - THE TODAY LINK IS OFFERED ON AN UNENROLLED INSTALLATION, and from it
   the walk can only refuse. RV3-7: phoneDevice with no first run, Today paints
   "Import my history"; the whole sequence takes custody, refuses
   LOCAL_SOURCE_PROGRAMME_UNRESOLVED at confirm, retracts, revision 2 -> 4 and
   a permanent "Files you took back" entry. This is the exact trap the author
   removed from setup's last screen (P3-U5) re-created on the screen setup's
   Back lands on, and on this branch (before S6-C's setup-first) it is the
   first screen a fresh install shows. Fix: paint importLink on Today only
   while !firstRun(), with P3-U5's red side moved to that frame.
2. MAJOR - AFTER BUNDLE_AUTH_FAILED ON A DAMAGED FILE THERE IS NO WAY TO PICK
   ANOTHER FILE. RV3-3: the words step keeps the file and offers no re-pick;
   Back (no custody) leaves the cached screen at step "words"; the link again
   paints the same step, the same file and the STALE refusal; only a page reload
   recovers. The screen says "Check the six words and the file"; the runbook
   says "Retype and try again". Fix: reopen() (or Back without custody) resets
   to "pick" and clears the refusal; cell: refused file -> Back -> link -> pick.
3. MINOR - a stale "Working." note stays painted beside a refusal at confirm:
   RV3-5/RV3-7 paint "LOCAL_SOURCE_PROGRAMME_UNRESOLVED" then "Working." (note
   is set at confirm() start and cleared only on success or a refused retract).
4. MINOR - edge-route.mjs's 44 px check is a race, not a product fact: twice,
   with the suites running, it FAILED "the served entry link is under the 44 px
   tap minimum" over a #phone dump with no Measure tile (a first Today frame,
   then repainted); idle it PASSED, and my probe reads 44 px on every settled
   frame. Wait for the settled rect; the operator reads this verdict on the day.
5. MINOR - runbook: (a) no pre-check for a phone that has ALREADY opened Measure
   (P-MEASURE is live since :467; on that phone step 6 is a certain NO-GO that
   costs a permanent retract record); (b) step 4's "Retype and try again" is
   impossible for a damaged file (finding 2); (c) "takes the file back ... and
   says so" is not what a refusal paints (the code, "Working.", and the list).
6. NOTE - carried from R2, re-measured: :480 RULING 1 half-overridden and
   uncited (PM call); the Measure entry cannot admit until the replay family
   lands (RV3-8); the first Today frame on a reopen of an admitted device reads
   "Import my history" before ready (RV3-1). New: opened.bytes stays in the
   closure through review and after done until the next reset; a second entry
   staged through the machinery leaves the boot flag IMPORT_REBASE_REQUIRED
   while Today still adopts the admitted basis (RV3-9); route cannot reach it.

## Drift, law, tails
Drift 17 files (git diff --name-only 26ab3ab 78eb15f), six matched in
rebuild/lanes/b/tooling/packages/S5.json (local-today-journey.test.mjs,
boundary.test.mjs, copy.test.mjs, package.test.cjs, today-app.cjs,
today-entry.mjs); no rebuild/engine, src/, ledger or w6 product byte; no CR;
one added line carries U+2013/U+2014 (the detector's regex). The amended cells
(page-bundle B1-B7, package.test 13 -> 15 with a red side, boundary (g) named
set declared UNPROVEN) state their rule in place; nothing deleted unreplaced.
Tails: my cells 9/9 | import/test 34/34/0 | retract 13/13/0 | production-*
24/24/0 | local-source-consumer 6/6/0 | client 18/18/0 | m4/import 86/86/0 |
port 65/65/0 | coach 231/231/0 | w6/host 38/38/0 | W6 586/586/0 | today-17
(MEASURED_TEST_NOW=2026-09-03) 667/662/5: P-MEASURE (g), N1.18, S10, two
setup.test re-pins, all sealed-byte declaration reds | A5 suites 56/56/0 |
rig187 PASS | A1 "A1 TODAY BUILD PASS: 3 assets; 136 pinned inputs (15 engine,
12 client); build earned-669539fe19ae; Today boot graph 121 modules, carrying
no migrate.cjs, no merge.cjs and none of the m4/import lane" | A5 "A5 PWA BUILD
PASS: 13 files; 11 precached and pinned by sha256" | b-package --ci --package
S5 exit 1 "B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION" (expected, S6) | Edge
"P3 EDGE-ROUTE PASS - the shipped A1 dist, real msedge.exe, real clock, America/New_York, 15 labels recorded".
