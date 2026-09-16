# P3-IMPORT-UI-2 - the Import route on the shipped page (lane C author)

DECISIONS:475 (1) and (4); screen :470; constraints :472 (a)-(d); carries :477.
## 1. Files and hunks
NEW: `import/import-screen.mjs` (the route, and the ONE module the law lets reach
migrate/merge/m4-import); `import/test/route.test.mjs` (5), `refusal-route.test.mjs` (9),
`edge-route.mjs` + `edge-seed-entry.mjs` (the real-Edge run); this report.
S5-DECLARED DRIFT (5): `today/today-app.cjs`, 4 hunks - `options.installation`; the screen
case + lazy loader + `importDeps`; `importLink()` and its two call sites; one clause in
`athleteBasisState()` recording whether an import is admitted, which `renderMeasure` awaits
before painting the link - the Edge run found the link reading "Import my history" over an
installation that already had one, because the read is the same async chain Today adopts
through and nothing repainted after it. `today/today-entry.mjs`, 2
pass-throughs - `installation: hosts` into mountToday, `importLink` to mountSetup.
`w6/test/local-today-journey.test.mjs` - the PAGE_PINS re-pin for it, with the re-read the
pin's own message demands written in place. `today/test/package.test.cjs` - the law's own
test, amended with the new rule stated (13 engine inputs became 15, and why), nothing
deleted, plus one cell running the new law and its red side.
`measure/test/boundary.test.mjs` - P-MEASURE (g)'s named drift set widened from one file to
five, each named, old reason kept above the new one; a sixth file under `today/` is still red.
UNPINNED DRIFT (7): `today/build.mjs`; `today/setup-app.mjs` (one optional link, last screen
only); `today/preview.css` (16/48/44 here); `lanes/c/P3-RUNBOOK.md`;
`import/test/page-bundle.test.mjs`; `import/test/support.mjs`; `today/test/copy.test.mjs` -
one cell was reading app.js back out of the SHARED dist while the other suites of the
directory wrote their own builds into it, and read a half-written file once the bundle grew;
it now passes the dist/scratch arguments build.mjs offers for exactly that (bytes identical).
## 2. The law (BUILD 1)
FORBIDDEN is split. `IMPORT_ROUTE_ONLY` holds migrate.cjs, merge.cjs and `m4/import/*`,
with the OLD reason kept above the new one: the page is a reader of migrated state EXCEPT
on the Import route, where it must reproduce the PC's walk to prove the bundle it is about
to adopt. Every other FORBIDDEN name keeps its reason and its outright ban.
The new law cell is `assertImportRouteIsolation(metafile)`, exported and RUN BY THE BUILD
before a byte is written: it walks esbuild's graph from `today-entry.mjs` over static edges
only, refusing to cross the one dynamic edge into `IMPORT_ENTRY` =
`rebuild/m3/w7-preview/import/import-screen.mjs`, and refuses if any of the three is
reachable, naming the file AND who reached it. It also requires the route to be in the
graph, its only importer to be today-app.cjs, and every edge into it to be dynamic.
`REQUIRED_INPUTS` gains import-screen.mjs and production-mapping.cjs.
## 3. Bundle figures, measured
before 121 modules / 1,668,330 B; after 136 / 1,961,006; delta +15 / +292,676 (+17.5%).
Today BOOT graph 121 modules, UNCHANGED, carrying none of the three. The route's 15 own
modules are named by P3-B4. The brief measured +260 KB for source-admission alone; the
extra ~33 KB is the route's own four modules its probe did not carry.
DEVIATION, stated: the ticket says "chunk". The accepted bundler answers a dynamic import
inside an `outfile` build with a LAZILY INITIALISED module in the same file - P3-B6
executes that (`init_import_screen = __esm({...})`, exactly one call site, and it is the
dynamic import). So the boot path runs none of the admission stack, the page is still three
assets, A5 is unchanged, and the asset the route is in IS precached (P3-B7). The
alternative was measured: esbuild `splitting:true` gives the same total (boot 1,672,770 +
chunk 271,508) across 25 output files, moving the asset allowlist, package.test, design,
the service worker and A5. Worth a PM word.
## 4. The tap sequence, with the served labels (all read off the page by the Edge run)
`Import my history` (Measure, beside the "No baseline yet" line; and setup's last screen) ->
`Choose the earned-port file` (file input, accept .json) -> `Type the six words from the PC`
+ `Unlock` (unsealBundle + qualifyBundle, write-free; "Unlocked. Nothing has been written to
this phone yet.") -> the identity question VERBATIM with `Yes` / `No` -> (Yes) importBundle,
then the controller review with `createProductionProducerRegistry({ hash })` bound, never a
TEST-ONLY registry, showing `Checked against engine revision ...` -> `Import this history`
-> prepareSource({identityConfirmed:true, prefixAnswer:true}) -> publish -> reconcile ->
`Imported. Today and your gym card now use it.` -> the existing local-source-basis adoption.
After admission both links read `History imported` and open the read-only summary
(`Your import`, `Files you took back`). Every displayed figure is a labelled machinery field
(sealed-at, oracle verdict, dataLossGuard safe/lost, engine schemaV and sha256, file sha256;
legacy days, native count, file size, day standing on, ordering-answer-needed,
ENGINE_REVISION); nothing composed. The screen states the question as a constant and refuses
`LOCAL_SOURCE_IDENTITY_QUESTION_CHANGED` (then retracts) if the controller's
`prefix_question` ever differs. Refusals print the code verbatim; one sentence is added, for
`BUNDLE_AUTH_FAILED` only. Any refusal or cancel after custody calls `retractImport(name,
reason)` with a label; a refused retract (seeded sibling) shows
`LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN` and the entry stays listed. No fetch, XHR, share,
download, createObjectURL or window.open anywhere on the route.
## 5. Cells per bar item
a: P3-U1. b: P3-U2. c: P3-X1, P3-X2. d: P3-X3, P3-X4, P3-X5, P3-X6 (:477 carry).
e: P3-U3. f: P3-U4. g: P3-X7. h: P3-X8. i: P3-B1..B7. j: `edge-route.mjs`.
Also P3-U5 (setup's last screen only) and P3-X9 (open item 1).
## 6. Verbatim tails
import/test `tests 32 / pass 32 / fail 0`; today-17 + 4 measure suites
(MEASURED_TEST_NOW=2026-09-03) `tests 667 / pass 662 / fail 5`; W6 `tests 586 / pass 586 /
fail 0`; m4/import `tests 86 / pass 86 / fail 0`; retract + admission-swap +
production-mapping `tests 34 / pass 34 / fail 0`; coach `tests 231 / pass 231 / fail 0`;
client `tests 18 / pass 18 / fail 0`; port `tests 65 / pass 65 / fail 0`; w6/host
`tests 33 / pass 33 / fail 0`; A5 suites `tests 56 / pass 56 / fail 0`; `rig187 => PASS`.
A1 `A1 TODAY BUILD PASS: 3 assets; 136 pinned inputs (15 engine, 12 client); Today boot
graph 121 modules, carrying no migrate.cjs, no merge.cjs and none of the m4/import lane`.
A5 `A5 PWA BUILD PASS: 13 files; 11 precached and pinned by sha256`.
`b-package --ci --package S5` exit 1, `B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION` -
expected, lands in S6. Edge `P3 EDGE-ROUTE PASS - the shipped A1 dist, real msedge.exe,
real clock, America/New_York, 14 labels recorded`.
THE FIVE REDS, one cause: local-today-journey.test.mjs, today-entry.mjs, today-app.cjs,
setup-app.mjs, preview.css and build.mjs move and no package on this branch declares the
bytes they stand at. They close when packages/S6.json declares them and CHILD_SPECS gains
'S6' in measure/test/boundary.test.mjs, today/test/food.test.mjs, machine-settings-ui.test.mjs,
problem.test.mjs and setup.test.mjs. Same shape as S6-C (DECISIONS:476 (2)).
## 7. Runbook diff
Phone half rewritten from BLOCKED to eight real steps, every label quoted from the served
page by the Edge run. Pre-check 6's caveat LIFTED with the reason: the screen binds
production-mapping.cjs's production registry and the law names the module, so a build that
lost it is refused; the live clock is proved on the page by P3-U1/U2 and by Edge. Pre-check
7, the PC section, go/no-go, reporting and rollback unchanged. One new instruction: do not
open Measure before importing (open item 1).
## 8. Open items
1. OPENING MEASURE BEFORE IMPORTING MAKES THE IMPORT REFUSE. measure-host.mjs opens the SAME
   installation and writes its trial-start operation into the generation admission replays;
   the S3 replay has no family for it, so the import refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED,
   retracts, and leaves nothing behind. Found by the real-Edge run, pinned by P3-X9, written
   into the runbook as an ordering instruction. The fix is a family in rebuild/m4/import's
   replay: the admission stack, lane D's, not an author's. No guard weakened.
2. The "chunk" deviation in section 3 - a PM word, not a defect.
3. P3-U1/U2 hand the measure lane a SEPARATE IDBFactory; P3-X9 stands on one store, and says so.
4. edge-route.mjs needs W6_BROWSER_BIN and the w6 playwright-core (exit 2 BLOCKED without
   them) and is not in rebuild.yml; the S6 author enumerates
   `rebuild/m3/w7-preview/import/test/*.test.mjs` there (carry at :476).
