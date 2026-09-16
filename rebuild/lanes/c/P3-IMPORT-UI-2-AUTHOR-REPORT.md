# P3-IMPORT-UI-2 - the Import route on the shipped page (lane C author, round 2)

DECISIONS:475 (1) and (4); screen :470; constraints :472 (a)-(d); carries :477. Base
rebuild/d-p3-followons 26ab3ab, re-fetched before this round: UNMOVED.

## 1. Files (17; setup-app.mjs left the set this round)
NEW (6) `import/import-screen.mjs` (the route, and the ONE module the law lets reach migrate/
merge/m4-import); `route.test.mjs` (6), `refusal-route.test.mjs` (10), `edge-route.mjs` +
`edge-seed-entry.mjs`; this report. S5-DECLARED (5): `today-app.cjs` (installation, screen case,
lazy loader, `importDeps`, `importLink()` and its TWO call sites - Today and Measure - and the
`athleteBasisState()` clause saying whether an import is admitted, awaited by `renderMeasure`);
`today-entry.mjs` (ONE pass-through, `installation: hosts`); `local-today-journey.test.mjs`
(PAGE_PINS re-pin with its own demanded re-read); `package.test.cjs` (13 engine inputs became 15
with the rule stated, nothing deleted, plus a cell running the new law and its red side);
`boundary.test.mjs` (P-MEASURE (g)'s drift set widened to four NAMED files). UNPINNED (6):
`build.mjs`, `preview.css` (16/48/44), `P3-RUNBOOK.md`, `page-bundle.test.mjs`, `import/test/
support.mjs`, `copy.test.mjs` (now passing build.mjs's dist/scratch arguments; bytes same).

## 2. The law, and the route's own rules
FORBIDDEN is split. `IMPORT_ROUTE_ONLY` holds migrate.cjs, merge.cjs and `m4/import/*`, with the OLD
reason kept above the new one: the page is a reader of migrated state EXCEPT on the Import route,
where it must reproduce the PC's walk to prove the bundle it is about to adopt. Every other
FORBIDDEN name keeps its reason and its ban. `assertImportRouteIsolation`, RUN BY THE BUILD, walks
esbuild's graph from `today-entry.mjs` over static edges only, refuses to cross the one dynamic edge
into `IMPORT_ENTRY`, refuses if any of the three is reachable (naming the file AND its importer),
and requires the route in the graph, one importer, every edge dynamic. ON THE ROUTE (labels and
order: `lanes/c/P3-RUNBOOK.md`): unseal and qualify are WRITE-FREE and the identity question is
asked before the first write, held as a constant (source-admission.mjs:96, byte for byte, with
`LOCAL_SOURCE_IDENTITY_QUESTION_CHANGED` if the controller's differs); the PRODUCTION registry is
bound, never a TEST-ONLY one; every figure is a labelled machinery field; refusals print the code
verbatim and ONCE, one added sentence for `BUNDLE_AUTH_FAILED` only; any refusal or cancel after
custody calls `retractImport`; no fetch, XHR, share, download, createObjectURL or window.open on the
route.

## 3. Bundle figures, and the "chunk" deviation
Base 26ab3ab built in its own worktree: 121 pinned inputs / 1,668,331 B. HEAD: 136 / 1,961,495 B;
+15 modules, +293,164 B (+17.6%). Today BOOT graph 121 modules, UNCHANGED. Those whole-asset figures
are HAND-MEASURED against a base build, said here rather than implied by a cell; P3-B5 proves the
route's own weight where the bundler records it - per-input `bytesInOutput`, 287,887 B of the
1,953,002 B accounted (14.7%), over the 15 modules P3-B4 proves route-only. DEVIATION, unresolved:
the ticket says "chunk", but the accepted bundler answers a dynamic import inside an `outfile` build
with a LAZILY INITIALISED module in the SAME file, so there is NO second output file and 293 KB of
admission stack rides in the one boot asset every athlete downloads whether or not he ever imports.
What IS enforced is the property that matters, that the boot path never RUNS a byte of it (P3-B6:
`init_import_screen = __esm({...})`, one call site, and it is the dynamic import); the asset it is
in is precached (P3-B7). `splitting:true` costs 25 output files for the same total, moving the asset
allowlist, design, the sw and A5. PM word due.

## 4. ROUND 2 - every review finding, and what it changed
1 (BLOCKING) is right, and worse than measured. On the phone's own configuration (ONE IDBFactory,
ONE installation via gym-host `openTodayHosts`) the FIRST render of Measure writes TWO
`earned/measure-trial-start/v1` operations before it paints and the markers pick adds
`earned/measure-markers/v1`; all three are class `body-composition-source`, and
source-admission.mjs:148 turns each into LOCAL_SOURCE_CONTEXT_UNRESOLVED - not a race the athlete
loses, a certainty. The setup-end entry was a second trap: on setup's last screen the first run is
unsaved, so the walk refuses LOCAL_SOURCE_PROGRAMME_UNRESOLVED. Both executed. FIX, in custody: the
entry that CAN admit is on TODAY, on the frame the first run lands (renderToday, one
`importLink(root, null)`); the setup-screen link is GONE and setup-app.mjs is back to the shipped
bytes; the Measure link stays where :470 put it. Cells: P3-U6 (bar a, one store, tapped on Today,
ADMITS end to end, no operation minted, basis adopted); P3-U5 (no setup screen offers it, red side
executed, device unchanged but for the two revisions retract leaves on disk); P3-X10 (the MEASURE
link itself, tapped on one store: refuses, prints the code once, retracts, every consumer
byte-identical); P3-X9 kept. edge-route.mjs no longer navigates `?screen=import`: it CLICKS the
Today link in real Edge and checks its painted height is >= 44 px. DEVIATION FROM :470, FOR THE PM:
:470 names Measure and "setup's end"; Measure is kept and proven unable to admit, and "setup's end"
is served on the screen setup ends on. The real fix for the Measure entry is a lane D replay family
for that op class, outside this ticket's custody and its sealed-drift budget. 2: section 3. 3
(P3-B5): the toothless `built - before < 400000` is REPLACED with the rule written where it stood -
per-input `bytesInOutput` over the route-only set, plus the module delta against a named base
constant. 4: `codeLine` no longer prints CODE (CODE), and `confirm()` passes the codes AFTER the
first as detail, so a multi-code refusal still shows all of them (P3-U5, P3-X10). 5: `entryLabel`
deleted, its untrue comment replaced by one naming the cells that keep the two label copies honest.
6: P-MEASURE (g)'s widening now says in place it is UNPROVEN until S6 declares the bytes. 7:
`reopen()`, called only when a LINK opened the route (P3-U6). 8: the U+2014 is gone; no added line
carries a dash but the detector's own regex. 9/10: comments corrected to source-admission.mjs:96 and
"Strength markers".

## 5. Cells per bar item, verbatim tails (TZ=America/New_York), and open items
a: P3-U6 (one store) + P3-U1. b: P3-U2. c: P3-X1-2. d: P3-X3-6 (:477 carry). e: P3-U3. f: P3-U4. g:
P3-X7. h: P3-X8. i: P3-B1-B7. j: `edge-route.mjs`. Plus P3-U5, P3-X9, P3-X10. TAILS: import/test
`tests 34 / pass 34 / fail 0`; today-17 (MEASURED_TEST_NOW=2026-09-03) `tests 667 / pass 662 / fail
5`; W6 `tests 586 / pass 586 / fail 0`; w6/host `tests 38 / pass 38 / fail 0`; m4/import `tests 86 /
pass 86 / fail 0`; port `tests 65 / pass 65 / fail 0`; coach `tests 231 / pass 231 / fail 0`; client
`tests 18 / pass 18 / fail 0`; A5 suites `tests 56 / pass 56 / fail 0`; `rig187 => PASS`. A1 `A1
TODAY BUILD PASS: 3 assets; 136 pinned inputs (15 engine, 12 client); build earned-669539fe19ae;
Today boot graph 121 modules, carrying no migrate.cjs, no merge.cjs and none of the m4/import lane`.
A5 `A5 PWA BUILD PASS: 13 files; 11 precached and pinned by sha256`. `b-package --ci --package S5`
exit 1, `B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION` - expected here, lands in S6. Edge `P3
EDGE-ROUTE PASS - the shipped A1 dist, real msedge.exe, real clock, America/New_York, 15 labels
recorded`, engine revision `M2-S5-TODAY-CHILD@0df73b01f3d2d935`. THE FIVE REDS, one cause:
local-today-journey.test.mjs, today-entry.mjs, today-app.cjs, preview.css and build.mjs move and no
package here declares the bytes they stand at; they close when packages/S6.json declares them and
CHILD_SPECS gains 'S6' in boundary, food, machine-settings-ui, problem and setup.test (S6-C's shape,
:476). OPEN ITEMS. 1. THE MEASURE ENTRY CANNOT ADMIT (section 4): fixed as far as an author may, the
rest is a replay family for class `body-composition-source` at source-admission.mjs:148, lane D's;
no guard weakened; PM ruling wanted on :470's entry wording. 2. The "chunk" deviation (section 3).
3. P3-U1/U2/U3/U4 still hand the measure lane a SEPARATE IDBFactory and say so in place. 4. Opening
Measure writes TWO trial-start operations on the first render, not one: a measure lane defect found
here, reported, untouched. 5. edge-route.mjs needs W6_BROWSER_BIN and the w6 playwright-core;
`import/test/*.test.mjs` is still absent from rebuild.yml (S6's, :476).
