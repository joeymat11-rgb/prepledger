# P3-EN1-ROUTE-GRAPH - INDEPENDENT REVIEW R1 (Opus, round 1)

VERDICT: ACCEPT

Subject `9bbbe39a` on `rebuild/d-en1-route-graph`, off tip `2a269bd8`. Reviewed in my own
detached worktree `%TEMP%\earned-en1-rv` (three junctions from `%TEMP%\earned-ci`) and my own
merged worktree `%TEMP%\earned-en1-rvm` (tip + `4c3a547`; its one conflict, lane C's
`import/test/page-bundle.test.mjs`, resolved `--theirs`). Node 24.19, TZ=America/New_York
throughout. Nothing pushed; I edited no product file.

## 1. The red reproduced at the BASE on my merged tree (`tests 26 / pass 25 / fail 1`)
```
AssertionError [ERR_ASSERTION]: a writer in the shipped page has NO replay family and no declared reason
+ [
+   'rebuild/m4/import/body-composition-class.cjs#body-composition-source',
+   'rebuild/m4/import/measure-replay.cjs#body-composition-source',
+   'rebuild/m4/import/sleep-replay.cjs#sleep'
+ ]
- []
```
Byte-for-byte the report's block. The FINDING is real and the subject is what closes it.

## 2. Green on both trees, measured by me
TIP: `lanes/d/p3-replay-all/*.test.mjs` **28/28**; `p3-replay-measure` 9/9; `A1 TODAY BUILD PASS:
3 assets; 121 pinned inputs (13 engine, 12 client); build earned-e30c5b13ec2e`.
MERGED (subject cell copied in): **28/28**; `p3-replay-measure` 9/9; `A1 TODAY BUILD PASS: 3 assets;
139 pinned inputs (15 engine, 12 client); build earned-dd86d3f0e1b0; Today boot graph 121 modules,
carrying no migrate.cjs, no merge.cjs and none of the m4/import lane`. Every tail in the author
report matches mine to the digit and to the build id.

## 3. THE GUARD IS NOT WEAKENED - five mutants, applied and reverted by me
A `{class:"steps",kind:"fact"}` on BOOT `today/food-model.cjs`: EN1 RED naming
  `rebuild/m3/w7-preview/today/food-model.cjs#steps` (4/5).
D `{class:"reading",kind:"fact"}` on ROUTE non-lane `import/import-screen.mjs`: EN1 RED
  `...import-screen.mjs#reading` AND EN4 RED `not a classified reader` (3/5).
B `{class:OP_CLASS,kind:"fact"}` on ROUTE lane `m4/import/sleep-replay.cjs`: EN1 RED
  `...sleep-replay.cjs#sleep` AND EN4 RED `... builds sleep` (3/5).
E (MINE - the narrowing's worst case) `{class:"steps",at:1,kind:"fact"}` on `food-model.cjs`,
  class and kind in one literal but NOT adjacent: EN1 RED `a page module names a class in a
  building position with no kind beside it` (4/5). The narrowing leaves no SILENT hole for a
  direct literal: paired and named, or dangling and named. That assertion earns the ACCEPT.
F (MINE - the carried hole) `const MODEL={STEPS:"steps"}; {class:MODEL.STEPS,kind:"fact"}`: GREEN
  5/5 - invisible at the BASE cell too (its `classRe` also demanded a quoted literal), so R1-6/R3-6
  carried, not a regression; stop 3 states it. All mutants reverted, both worktrees clean after.

## 4. Checks of my own
- FAMILIES ARE READERS by my own grep, not the cell's: `rebuild/m4/import/*.{cjs,mjs}` has no
  `Ops.build`, no `.commit(`, no `.commitBatch(`, and its only `class:` are the ten register rows.
- THE SPLIT IS build.mjs's: I read `assertImportRouteIsolation()` beside the cell - same seed,
  same `at === route` refusal, same per-edge refusal, same `IMPORT_ROUTE_ONLY` triple.
- NOTHING WEAKENED: EN2/EN3 unchanged in substance (EN3 now wider, boot+route); EN1 GAINED two
  refusals (unresolvable site, dangling `class:`); EN4/EN5 new. The one rule removed is "a name is
  a write", the defect itself; all ten declared pairs are still FOUND, as EN1 proves on both trees.
- SCOPE: `git show --stat` is two files, both `rebuild/lanes/d/**`; no engine, `today/**` or
  `w6/local` byte; report 37 lines; LF only; zero U+2013/U+2014 in both; tree clean.
- STOP 2 IS LANE C's: on my merged tree the four `import/test/{page-bundle,route}` cells fail
  (`the Import graph is 140 modules, not the measured 138`; the route set carries two extra,
  `m4/import/body-composition-class.cjs` and `m4/import/sleep-replay.cjs`; `the delta is 16
  modules`, 18 !== 16). Both extras are on the TIP already, so lane C's figures are stale against
  its older base; no file those cells read is touched here. S6's to re-pin, with stops 1 and 3.
