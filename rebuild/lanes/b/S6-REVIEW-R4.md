# M2-S6-TODAY-CHILD - independent review R4 (Fable final, DECISIONS:439), round 2

VERDICT: ACCEPT

Subject `c8abf4be879cb3e810210d3e2c155e79d3a935f0` (fetched from `%TEMP%\earned-s6`, detached in
`%TEMP%\earned-s6-rv`, tree clean before and after). Synthetic data only; no private path opened, listed or
named; no engine byte read or moved. Every mutant below was applied in this worktree and reverted with
`git checkout --` (status 0 lines after each). Node 24, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York.

## 1. The merges, byte-faithful

For each of the four merges I listed every file the second parent changed since the merge base and diffed
it against the merge result, then the same for the first parent. d87e1bd (tip 7c77d0b6, DECISIONS only),
c9c9927 (d-en1-route-graph 196717cf, 3 lane D files) and 81fb080 (tip 2364b98, :494 plus one lane D
report line) carry every file byte-identical to both heads. 36604de (d-b-lom da7d5b37, 13 files) carries
12 byte-identical to da7d5b37, and the ONE resolution is `import/test/page-bundle.test.mjs`: B-LOM's
`assert.ok(legacy-order-mapping.cjs in the graph)` carried, the figure re-measured 140/137 -> 141, the
P3-B5 delta 18 -> 19 with the boot count 121 -> 122 said in the cell. today-bindings.mjs, gym.test.mjs,
source-admission.mjs and capture-start.test.mjs are byte-identical to da7d5b37. origin/rebuild/d-en1-
route-graph has since moved to 6ba896fc (a CI note); the tip merge carries it. No rebase: f04d50f7 is an
ancestor, the tip 2364b98 is an ancestor, and `git fetch origin` at the end of this review found it unmoved.
`git diff f04d50f7 HEAD -- rebuild/engine rebuild/coach` is EMPTY.

## 2. The declaration, walked by me

`packages/S6.json`: 196 product entries; 114 = every S5 pin re-asserted (none missing); 81 first
declarations = 72 of the brief's 89 + B-LOM's 3 new files + the 6 own cells under m4/workout/test; plus
packages/S5.json. Roles 94 carried / 20 edited / 25 new / 55 pinned-unchanged / 2 superseded-by-child,
every post recomputed from disk equal to the declared byte, every carried and pinned-unchanged at pre ==
post, every edited/new/superseded with pre != post. Walked per brief root against `git ls-files`: the
undeclared set is EXACTLY 17 - w6/local/{build,source-commit}.mjs; w6/host/{build-host,esbuild-probe}.mjs
and index.html; m4/import/test/{mutations,reading-replay-faults}.cjs; the SIX test/s3 paths (engine.cjs
and fixtures.mjs of that harness ARE declared); lanes/d/plan-edit/{astra-rerun,host-mutants,model-mutants};
w6/test/local-source-consumer-browser.mjs. plan-edit-host.mjs is declared pinned-unchanged and the runner
accepts it (durable-host.test.mjs:45 `import(hostURL)`, browser-build.test.mjs:22 bundles it as an entry).
Round 2's spec moves against 36604de: 9 added (5 pinned-unchanged, 4 new), today-bindings.mjs and
gym.test.mjs carried -> edited (the two sealed moves, disclosed), source-admission.mjs, engine-order.cjs,
capture-start.test.mjs and production-admission.test.mjs pinned-unchanged -> new. 23 children, argv under
the 18 CHILD_ROOTS; PUBLIC_TAIL_ROOTS still two and now both have a consumer.

## 3. Citations and guards

DECISIONS 488 sha256 a824d88d..., 489 6044b121..., 490 f2e3fe74... computed by me over the line bytes at
HEAD and equal to authorizations.theme, brief.acceptedLedgerLine and coverage.superseded.rulingLineSha256;
the brief is 41900 bytes at 8a9a63ee... F7's title now reads "adds exactly ten" over an 18-root list whose
first eight are pinned unchanged; F8 two tail roots; F10 pins the widened walk with a control and the bound.
The executedClosure widening adds one literal form (`new URL('<relative>', ...)`) and nothing else: bare and
absolute specifiers and a computed one are asserted unseen. No law, guard or test is weakened: the old
`assert.throws(assertBundleInputs)` was ruled false at :475 (1) and its replacement executes
assertImportRouteIsolation on a planted graph AND on the real page.

## 4. Executed on this tree (my own runs)

- `--ci --package S6`: PUBLIC CI EVIDENCE PASS, EXIT 0, twice (the second after `git fetch origin`, tip
  2364b98 still an ancestor). All 23 children OBSERVED exit 0 at their needles (today-17 682, d-replay-all
  28, b-lom 30, m4-import-production 25, the rest as declared). PRODUCT IMPLEMENTED 47/0/94/55/0 unlisted
  drift; LAWS 45/45, AUDIT RED-FIRST FAIL (the :485 baseline, no D-id); COVERAGE 0/19, 9 SUPERSEDED under
  :490, 10 under --full. `--ci --package S5`: FAIL SEALED-PROFILE-RECOMPUTATION, EXIT 1, after SPEC
  OBSERVED and PARENT BOUND.
- Alone: lanes/d/p3-replay-all 28/28; b-lom pair 30/30 (LOM-A/LOM-B both seasons = bar row 4, LOM-E,
  LOM-S6 green); production-admission 8/8; pinned-unchanged test 16/16; coach 231/231 (engine-revision
  still S5); A1 TODAY BUILD PASS 140 pinned inputs, boot graph 122, build earned-8993e0805f69; A5 PWA BUILD
  PASS 13 files / 11 precached; rig187 PASS.
- BAR ROW 23, my own mutant, not the author's: `source-admission.mjs reopen()` made to refuse when the
  recorded selection's `basis.engine_digest` differs from the freshly qualified digest (a stored-versus-
  current comparison at the one place a rotated bundle re-qualifies). production-admission 7 pass / 1 fail,
  P3-P6 ALONE red with SOURCE_ENGINE_CONTEXT_UNPROVEN; reverted. The cell's rotation is real (the two
  digests differ by assertion), the durable engine_digest is untouched, reopen re-qualifies, rollback
  re-qualifies, Today adopts.
- LOM-S6 red side, my run: `importAnchor: mapping.anchor` forwarding removed in today-bindings.mjs ->
  route file 18 -> 13/5, LOM-A x2, LOM-B x2 and LOM-S6 red; reverted.
- NO-IMPORT BYTE IDENTITY, my rv4 probe (untracked, from B-LOM R4) run on this tree and on the pre-B-LOM S6
  tree c9c9927 (`%TEMP%\earned-s6-rvtip`), both seasons: candidate 8/8, base 2/6 (STRIP, BOOT, IT red at
  the base by design, NI green both). Of the 36 `RV4 NI` lines 34 are byte-identical across the two trees
  (every day's phase, code, lift, previous, governs, start_ids, loads, log, active null, localSources
  absent); the 2 that differ are the `gen` field, a sha over the whole generation, which also differs
  between two runs on the SAME tree (2d3c9540 vs 259cf2f5), so it witnesses nothing. See NOTE 3.

## 5. Findings

1. MINOR - P3-P6 step 6 asserts only `typeof refused.code === 'string'` where the report says "retract
   refuses by name". I re-ran the cell with the name asserted: the code IS
   LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED (8/8). The fact holds; the pin is looser than the claim. Re-pin
   the name when the file next moves (the ff-merge round is fine); not a reason to hold the reseal.
2. MINOR - the same cell's `assert.notEqual(rotatedMapping.id, admitted.view.basis.engine_digest ?
   Mapping.MAPPING_ID : null)` is a conditional that can only ever compare against MAPPING_ID; it is true
   and harmless, but it reads as if it tested something else. Plain `notEqual(rotatedMapping.id,
   Mapping.MAPPING_ID)` when the file next moves.
3. NOTE - the cross-tree no-import identity above is 34 of 36 lines with the two `gen` lines excluded as
   run-nondeterministic; the in-tree half is the author's LOM-E (two no-import installations byte-equal on
   the engine view). The PM's --full is the place a whole-generation identity would be measured, if wanted.
4. NOTE - dashes: FOUR added lines in `git diff f04d50f7 HEAD` carry U+2014, not the report's three: the two
   rebuild.yml step names, the PM's :493 line and the PM's :494 line (which arrived with the second tip
   merge, after the report's count was taken). None is a product string; 0 CRLF in the whole round-2 diff.
5. NOTE - the widened executedClosure reads a relative `new URL()` literal as a reach whether the target is
   then imported, bundled or merely read; plan-edit-host.mjs is imported AND bundled, so the declaration is
   right, but the lane B tooling ticket should call the walk's answer "reached", not "executed".
6. NOTE - two node processes from the round-1 starvation probes (`%TEMP%\s6work\starve*.mjs`, running since
   2026-09-16 20:47) are still alive on this PC. Not the tree's business; the PM may want them gone before
   the --full run so its timings are its own.

## 6. Tails, verbatim

```
B PACKAGE S6 PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time   S6 EXIT=0
B PACKAGE S6 PRODUCT IMPLEMENTED; 47 at the declared post-image / 0 at the pinned pre-image / 94 carried byte-identical from the parent / 55 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 114 parent-pinned product files; 2 declared role "superseded-by-child" over a parent EXECUTION pin
B PACKAGE S6 LAWS 45/45 executed | TOTAL 45 laws - 45 RED-frozen - 39 RED-candidate - 89 GREEN repair controls - 97/104 mutant executions DETECTED - 0 HARNESS_ERROR - AUDIT RED-FIRST FAIL
B PACKAGE S5 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld   S5 EXIT=1
A1 TODAY BUILD PASS: 3 assets; 140 pinned inputs (15 engine, 12 client); build earned-8993e0805f69; commit c8abf4b; Today boot graph 122 modules, carrying no migrate.cjs, no merge.cjs and none of the m4/import lane
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256   |   rig187 => PASS
COACH tests 231 / pass 231 / fail 0   |   p3-replay-all 28/28   |   b-lom 30/30   |   production-admission 8/8 (reopen() stored-vs-current mutant: 7/1, P3-P6 alone)   |   pinned-unchanged 16/16
rv4 probe: candidate 8/8, base c9c9927 2/6; RV4 NI 34 of 36 lines byte-identical, the 2 `gen` lines run-nondeterministic
```

Open for the PM's --full, unchanged from the author's list: the 10 re-executing gates, the private oracle,
m4-import-s3 (3/14 here and on the tip), the computed-specifier blind spot (lane B tooling, after S6), the
:456 trip-wire armed only at the ff-merge, row 29's 20 windows-latest runs.
