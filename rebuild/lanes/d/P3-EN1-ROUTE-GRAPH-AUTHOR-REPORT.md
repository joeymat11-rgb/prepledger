# P3-EN1-ROUTE-GRAPH - AUTHOR REPORT (lane D, size S)
`rebuild/d-en1-route-graph` off tip `2a269bd`; `%TEMP%\earned-en1`, three junctions, Node 24.19, TZ=America/New_York. MERGED tree = throwaway detached worktree at tip + `origin/rebuild/c-p3-import-ui-2` (`4c3a547`); its one conflict, lane C's `import/test/page-bundle.test.mjs`, resolved `--theirs` (no cell here reads it). My branch carries lane D files only.
## 1. The red, verbatim, on the merged tree before the fix (`tests 26 / pass 25 / fail 1`)
```
✖ P3-EN1 - EVERY writer the shipped page has is registered, and every registered writer is really in the page: the register and the page graph agree name for name (144.3911ms)
  AssertionError [ERR_ASSERTION]: a writer in the shipped page has NO replay family and no declared reason
  + actual - expected
  + [
  +   'rebuild/m4/import/body-composition-class.cjs#body-composition-source',
  +   'rebuild/m4/import/measure-replay.cjs#body-composition-source',
  +   'rebuild/m4/import/sleep-replay.cjs#sleep'
  + ]
  - []
```
Cause, measured: the route's dynamic edge puts `rebuild/m4/import/**` in the page graph, and each of those three carries `const OP_CLASS = '<class>'` for `op.class === OP_CLASS` comparisons only. The old net read a NAME as a WRITE.
## 2. The classification rule
TWO GRAPHS, split exactly as `today/build.mjs assertImportRouteIsolation()` does, over esbuild's own metafile (`buildBrowser` writes it beside the bundle): BOOT is the walk from `today-entry.mjs` across every static and dynamic edge EXCEPT the one into `import/import-screen.mjs`; ROUTE is the rest. Measured: tip 112 own modules (boot 112, route 0); merged 130 (boot 112, route 18), which with the 9 node_modules/font entries is build.mjs's own `121 pinned inputs` and `Today boot graph 121 modules`.
A WRITER BUILDS an op: a `class` and a `kind` in ONE object literal (either order, `class` quoted or the module's own `OP_CLASS`, `kind` may be shorthand) - the envelope `client/ops.cjs build()` takes. BOTH sets are enumerated, so a writer in the route chunk reddens P3-EN1 too. Ten pairs found, ten registered, name for name.
A FAMILY (READER) is proved in P3-EN4 BY MEASUREMENT: no module of `rebuild/m4/import/` builds an op, none calls `Ops.build`/`.commit`/`.commitBatch`, and the register is the only lane module carrying a `class:` property at all (its rows are rules, not envelopes). The reach is refused, not assumed: a site whose class cannot be resolved in its own module, and a `class:` property of a page module that could not be paired with a kind, each fail P3-EN1 by name.
## 3. Files, hunks, cells
`rebuild/lanes/d/p3-replay-all/writer-enumeration.test.mjs` +235/-27, 14 hunks (header law; `ENTRY_REL`/`ROUTE`/`LANE`/`ROUTE_ONLY`; `OP_CLASS_RE`,`SITE`,`builderRes`,`commitRe`,`propertyRe`,`buildsIn`; `pinnedInputs`->`pageGraph` with the boot walk; `writersInPage`->`scan`+`writerRows`; EN1 body; EN3 comment; new EN4, EN5), plus this report.
`replay-registry.cjs` needed NO change: a family is not a writer, so the register has nothing to declare for one.
CELLS 26 -> 28. EN1 both graphs, builder evidence; EN2 unchanged; EN3 now over boot+route; EN4 NEW, family-reader by measurement, reddening on any builder or commit call in the lane; EN5 NEW, the split is the bundler's - boot starts at the entry and carries no migrate.cjs, no merge.cjs and none of the lane, one importer and it is dynamic, and on a tree with no route the old outright ban still holds over the whole page.
## 4. Mutants (applied, run, reverted, sha256 byte-equal, tree clean)
A `{ class: "steps", kind: "fact" }` appended to `today/food-model.cjs` (pinned BOOT module), on the TIP AND MERGED: EN1 RED `rebuild/m3/w7-preview/today/food-model.cjs#steps`, 4/5.
B `{ class: OP_CLASS, kind: 'fact' }` appended to `m4/import/sleep-replay.cjs` (ROUTE, lane), merged: EN1 RED `...sleep-replay.cjs#sleep` AND EN4 RED `... builds sleep`, 3/5.
D `{ class: 'steps', kind: 'fact' }` appended to `import-screen.mjs` (ROUTE, not lane), merged: EN1 RED `...import-screen.mjs#steps` AND EN4 RED `not a classified reader`, 3/5.
C bare `const OP_CLASS = "steps";` on `food-model.cjs`, merged: GREEN 5/5, deliberately - stop 1.
## 5. Tails
TIP: `lanes/d/p3-replay-all/*.test.mjs` **28/28**; p3-replay-measure 9/9; `w7-preview/import/test` 15/15; `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-e30c5b13ec2e`.
MERGED, same cell file: `lanes/d/p3-replay-all/*.test.mjs` **28/28**; p3-replay-measure 9/9; `A1 TODAY BUILD PASS: 3 assets; 139 pinned inputs (15 engine, 12 client); build earned-dd86d3f0e1b0; Today boot graph 121 modules, carrying no migrate.cjs, no merge.cjs and none of the m4/import lane`; `w7-preview/import/test` 35 / pass 31 / fail 4 (stop 2).
## 6. Stops
1. THE R3 RV-4 NEEDLE NO LONGER REDDENS, and that is this ticket's own narrowing said out loud: a bare `const OP_CLASS = "steps"` with no builder beside it is a NAME, not a write (mutant C). Mutant A, a real writer literal, buys the red side instead; any successor re-pointing that needle must use a class/kind pair.
2. LANE C, NOT MINE, FOR S6. On the merged tree four cells of `import/test/{page-bundle,route}.test.mjs` fail on counts pinned against the branch's older base (`the Import graph is 140 modules, not the measured 138`; `the Import route costs the page exactly these modules and no others`; `the delta is 16 modules`). That file is 7/7 GREEN on `4c3a547` alone (run in `%TEMP%\earned-iu2`): rebase drift in lane C's own figures, not a defect of this ticket and not lane D's to re-pin.
3. CARRIED: R1-6/R3-6 is now STATED in the cell and half-closed (an unresolvable site is refused rather than read as nothing), but a fully indirect `class: Model.X` writer still needs import resolution to be seen. R3 MINOR 4, 5, 7 and 8 are untouched. S6 must still enumerate `lanes/d/p3-replay-all/*.test.mjs` in `rebuild.yml`.
SYNTHETIC ONLY: no `rebuild/conform/private`, `ledger/`, `src/history.js` or EarnedPort path opened, listed or named; every build output went to a `mkdtemp` under `%TEMP%`.
CI note (integrator): run 35177163180 at 196717cf was red on windows-latest only, S5 --ci CHILD-REQUIRED-EXIT-ZERO in the sealed today child (the one-OS flake class of DECISIONS:467 whose cause S6 fixes), ubuntu green, PC green; retriggered with this line.
