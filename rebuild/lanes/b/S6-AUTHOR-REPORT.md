# M2-S6-TODAY-CHILD - author report, round 1

Branch `rebuild/b-s6-today-child`, base `0635f4b6` (the tip, DECISIONS:490). Brief of
record `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md`, measured on the branch at sha256
`8a9a63ee49b5a95260c0102ec937f0d5558e979b75fc3b9da39368c0e4dd2d1d`, 41900 bytes - the
`:489` values exactly. Citation method validated first against S5's own three before it
was used on S6's: line 460 -> `00f955e7...` = `S5.json` authorizations.theme.lineSha256,
line 461 -> `2e84f849...` = brief.acceptedLedgerLine.lineSha256, line 462 -> `f9de6a7b...`
= coverage.superseded.rulingLineSha256. All three match, so the method is the one S5 was
sealed under. S6 cites 488 / 489 / 490 by the same method.

## 1. The merges, in the fixed order, and every conflict

`c-s6-small 6fad3472` clean. `b-s6-child-tail d1001da9` clean. `c-p3-import-ui-2
4c3a5474` conflicted in FIVE files - every one of them among the seven `:484` predicted
would be moved by more than one input. Each was resolved by carrying BOTH sides:

1. `today/today-entry.mjs` - `setupFirst` (c-s6-small) and `installation: hosts` (ui-2)
   are orthogonal options on one `mountToday` call. Both carried.
2. `today/today-app.cjs` - the build footer and the Import entry both append to the Today
   root. The footer's own contract is that it is LAST, below every control, so the entry
   is appended first and the footer keeps its stated place.
3. `today/build.mjs` - `commitOf`/`injectCommit` and `assertImportRouteIsolation` are
   independent exports; both carried, and the returned result and the A1 PASS line carry
   both field sets.
4. `import/test/page-bundle.test.mjs` - ui-2 does not drift off the old input law, it
   RULES it false (`DECISIONS:475 (1)`), so its rule supersedes the tip's `assert.throws`.
   The inventory is then the post-merge tree's and not ui-2's base: the m4/import list is
   the union of TEN, and the graph figure is RE-MEASURED as 133 + 1 (F7) + 2 (F8 and the
   RV-G4 router) + 4 (the route's own) = 140, not summed from the two branch values 136
   and 138, neither of which had seen the other.
5. `w6/test/local-today-journey.test.mjs` - PAGE_PINS. Both branches pinned
   today-entry.mjs at their own post, so NEITHER branch sha is true here; the pin is
   re-measured over the post-merge bytes and both narratives kept.

Two further post-merge corrections fell out of the same collision and are NOT conflicts
git reported - they are cells that were green on each branch alone and false together:
`page-bundle.test.mjs` ROUTE_MODULES (16 -> 18: the F8 family and the router are
route-only too) and its P3-B5 delta (16 -> 18, the boot count still 121).

## 2. The declaration, brief versus tree

Every root reconciles with the brief EXACTLY, walked with `git ls-tree -r` on the
post-merge head and tested with `Object.hasOwn` against the five specs: w6/local 13/1,
w6/host 13/5, w6/test 83/1, m4/import 30/0, m4/workout 3 named/0, lanes/d
8+2+4+1+1+1, w7-preview/import 9/0, measure 15/15, today 57/15. All 89 named files exist
on the tree and none is already S5-declared. No count differs from the brief.

**But only 67 of the 89 are DECLARED, and that is the first stop.** The other 22 are
files this package does not move AND that no declared child EXECUTES, and the runner's
closed role vocabulary has no honest spelling for that case: role `new` means a file that
did not exist or one this package moves, and role `pinned-unchanged` is refused by
`PRODUCT-PINNED-UNCHANGED-IS-NOT-EXECUTED-BY-A-DECLARED-CHILD` unless a declared child's
argv names the file or reaches it through a RELATIVE require. Inventing a child to make a
pin legal would be gaming that rule, so they are named here instead (section 6).

`packages/S6.json` therefore declares **187**: the 114 S5 pins re-asserted (96 carried,
18 edited), 67 new (17 `new`, 54 `pinned-unchanged`, plus this package's own six cells),
2 `superseded-by-child` over parent EXECUTION pins (`packages/S5.json` and, measured not
assumed, `today/test/copy.test.mjs` - the brief lists it among today's unpinned seven and
it is unpinned only in the parent's PRODUCT map; the parent executes it), and
`.github/workflows/rebuild.yml` at its new bytes.

## 3. The flake: cause, reproduction, fix

**Cause, measured for the first time rather than described.** `settle` was a FIXED 24-turn
macrotask drain with no condition. Instrumented on an idle PC, the trial table needs
**18 of those 24 turns** after the last waist reading; the measure screen needs 10, the
marker-pick close 8. The shipped margin was SIX TURNS on the machine where it passes.
That is the whole flake: a runner that advances the page less per turn crosses it, the
drain returns anyway, and the next line dereferences null or reads `no trial table
rendered` - both reported symptoms, from one line.

**Reproduced red on purpose.** Machine starvation does NOT reproduce it (24 spinners,
`UV_THREADPOOL_SIZE=1`, and a 6 ms-per-turn main-loop hog all stayed green at 73-91 s -
slowing the machine slows the drain too, which gives the page more wall time, not less).
The starvation that matches the mechanism is the budget itself: with the pre-fix
`settle(rounds)` cut to 12, cell (a) goes RED with `the markers pick screen is not
offered`. At 16 it passes, so the threshold on this machine sits between 12 and 16
against a shipped 24.

**Fixed at the cause, and the same starvation is green.** The wait is now the page's own
condition with a bounded deadline that FAILS LOUDLY with the slot name, the elapsed
milliseconds and the turns taken. `page()` awaits `api.ready` - today-app.cjs publishes it
for exactly this - then the named screen; `go(slot)` waits for its control, clicks, waits
for the screen to CHANGE and then for the terminal state the caller names; `typeWaist`
waits for the table to repaint AND THEN to stop repainting; `pickMarkersOnScreen` waits
for the pick screen to close; `close()` waits for the page to be still before tearing the
lane down. Run under the identical starvation (`REPRO_SETTLE_ROUNDS=12`) the fixed code is
GREEN: the variable is inert against it, because there is no budget left to starve. The
red side is executed too - with the deadline cut to 40 ms the failure reads
`MEASURE-SETTLE-DEADLINE: waited 40 ms over 4 macrotask turns for the Today screen to stop
changing after mountToday`, instead of a TypeError three frames away.

Two further faces of the same cause were found only because the condition was made
explicit, and both are fixed: the trial table repaints in STAGES, so "it changed" was true
while the last week still read `Not enough data yet`; and tearing the lane down mid-repaint
made the next paint call `markers()` on a closed client (`LOCAL_CLIENT_CLOSED` in cell (e)).
`trialDevice()` is now per cell, so (a), (d) and (e) no longer inherit one another's
half-drained state - the reason the flake always took (a) and (d) together. The file costs
147 s instead of 53 s, three real devices instead of one, and that is the honest price.

`import/test/support.mjs` was checked as the brief asks: it has NO drain at all - no
`settle`, no `setTimeout`, no fixed budget - and awaits real promises (`await
capability.reconcile()`, `await booted.api.ready`). It does not carry this race.

## 4. Files and hunks

- `b-package.cjs` - CHILD_ROOTS +9 (the brief's eight, plus `rebuild/m3/w6/test/`, the
  author's correction: the brief declares three files there and says the W6 whole-tree
  suite runs them, and rebuild.yml has no W6 whole-tree step); PUBLIC_TAIL_ROOTS +2;
  IDS and NO_REGISTER_IDS gain `S6` and lose `B-LOM`; NO_REGISTER_RULED_B_IDS drops
  `B-LOM`; new `RETIRED_IDS` (section 6, stop 4).
- `pinned-unchanged-and-ruled-substitutions.test.cjs` - F6 over the new IDS and the
  removed id, F7 over all 17 roots with the first eight re-asserted unchanged, F8 over the
  two added tail roots AND the six deliberately withheld, plus the RETIRED_IDS pin.
- CHILD_SPECS `'S6'` in `measure/test/boundary.test.mjs:83`, `today/test/food.test.mjs:792`,
  `machine-settings-ui.test.mjs:709`, `setup.test.mjs:2315`; and `problem.test.mjs:1583`
  lifted onto a module-level `const CHILD_SPECS = ['H3','S3','S4','S5','S6']` iterated
  youngest-first, with its rule stated where the old inline array stood: it never gained
  `'S5'` and stood TWO generations stale, and c-s6-small moves today-entry.mjs, which that
  cell hard-pins two ways.
- `measure/test/support.mjs`, `measure/test/journey.test.mjs` - the flake fix. Both are
  S5-sealed, so this is a disclosed sealed move inside the reseal.
- `rebuild.yml` - the A0 step gains food-live-save and host-seams; four new steps give the
  Import screen, the m4/import lane, the lane D suites and the two w6 source cells a CI
  home. The standing `--ci --package S5` step is UNTOUCHED.
- `packages/{H3,S3,S4}.json` runnerSha256 re-pinned; `packages/S5.json` runnerSha256
  re-pinned (its own product pin for the runner deliberately NOT re-targeted - S5 did not
  produce these bytes); `packages/B-LOM.json` DELETED with its id (`:487` stop 2).
- New: the five `s6-supersede-*.test.cjs` and `s6-engine-files-differential.cjs`, in S5's
  shape, declared as this package's own role `new` product.
- `import/test/page-bundle.test.mjs`, `measure/test/boundary.test.mjs` - the two
  post-merge corrections of section 1 and section 6 stop 5.

## 5. Suites

`--ci --package S6` reaches **PUBLIC CI EVIDENCE PASS, exit 0**, with all 21 declared
children OBSERVED exit 0 at their exact declared needles, PRODUCT IMPLEMENTED (37 at post
/ 0 at pre / 96 carried / 54 pinned-unchanged / 0 unlisted drift, covering all 114 parent
pins), FIDELITY OBSERVED, AUTHORITY OBSERVED (both S6 lines resolved on the chain branch),
LAWS 45/45 executed, and 9 gates SUPERSEDED under DECISIONS:490. Needles, all measured on
the post-merge head and none copied: today-17 `# pass 681`, measure-hermetic 11,
s4-real-day 15, a0-journeys 23, s6-sup-* 4/3/3/3/3, d-plan-edit 68, m4-import 62,
m4-import-production 24, d-import-retract 13, d-admission-swap 4, d-replay-measure 9,
d-capture-start 14, food-live-save 6, w7-import 35, w6-host-seams 9, w6-local-source 25,
and the engine-files differential `27 tracked ... 18 named and NOT ONE moves, so all 45
tracked rebuild/engine file(s) stand byte-identical to the parent's own post`.

## 6. Stops

1. **22 of the brief's 89 cannot be declared.** Unchanged here and executed by no declared
   child, so no role in the runner's closed vocabulary fits. Build and dev-host glue:
   `w6/local/{build,source-commit}.mjs`, `w6/host/{plan-edit-host,build-host,esbuild-probe}.mjs`,
   `w6/host/index.html` (HTML - nothing can execute it at all). Harnesses reached only by
   spawn or by a constructed path, never by a relative require:
   `m4/import/test/{mutations,reading-replay-faults}.cjs`, the four `test/s3` harness files
   and its `.json` fixture, `lanes/d/plan-edit/{model-mutants,host-mutants,astra-rerun}.mjs`,
   `w6/test/local-source-consumer-browser.mjs`. And the files whose only child is red for a
   cause this package did not make: `m4/import/replay-registry.cjs` and the four
   `lanes/d/p3-replay-all` cells. The PM rules: widen the runner's notion of "executed",
   add a role, or accept the shorter list.
2. **`d-replay-all` is a BLOCKING regression this merge makes.** 26/26 GREEN on the clean
   tip `0635f4b6`, 25/1 RED here. P3-EN1 finds three writers in the shipped page with no
   replay family and no declared reason: `body-composition-class.cjs#body-composition-source`,
   `measure-replay.cjs#body-composition-source`, `sleep-replay.cjs#sleep`. The cause is
   structural and is exactly what the custody hole was hiding: c-p3-import-ui-2 puts the
   Import route INTO the shipped page graph, so modules that were route-only when
   P3-REPLAY-ALL-FAMILIES measured its register are now, by that cell's own definition,
   writers the page has. Whether the register gains three declared reasons or the
   enumeration excludes the lazily-loaded Import route is lane D's ruling; this package
   will not edit another lane's guard to go green.
3. **`m4-import-s3` is red for an environment, not for this branch.** 3 pass / 14 fail HERE
   and 3 pass / 14 fail on the clean tip, the same `Actual owned dispatcher scratch
   required` - the IMPORT_M4_DIR class recorded at `:459` NOTE 3. Not declared as a child,
   because a child must exit 0, and named in rebuild.yml's comment as deliberately absent.
4. **PUBLIC_TAIL_ROOTS: the brief says three, `:487` says two.** The narrower reading is
   taken and the disagreement recorded, with a measured fact that cuts the same way:
   `page-bundle.test.mjs` under the third root carries the literal `ledger/` in its own
   FORBIDDEN list, so TAIL_DENYLIST's content gate would withhold that child's tail on any
   failure that prints the list anyway. Bar row 22 is executed in the adjusted form: two
   widened and argued by name, six withheld and stated.
5. **UI-2's boundary named-drift set could not have passed on any tree.** It named FOUR
   files as the sealed-byte drift under today/, but S4 pins only two of them; preview.css
   and build.mjs are among the seven files S4 left unpinned, so they can never appear in a
   drift-from-S4 set. The cell's own note says why nobody noticed: on the UI-2 branch the
   assertion above it was red, so execution never reached the list. Corrected so the guard
   is TIGHTER, not looser - the sealed set is still exact, and the two unsealed movers are
   asserted separately to be unsealed AND declared.
6. **`RETIRED_IDS` is a new runner constant and needs review.** Removing an id and deleting
   its spec is one act (`:487` stop 2), but TOOLING_FILES is derived from IDS, so the
   deleted path stops being named there while git still reports it - the runner would
   refuse `UNLISTED-SOURCE-CHANGE` for a deletion it made necessary. The product map cannot
   say it instead: a declared file with `post: null` reads as "not written yet" and puts the
   package in PARTIAL. So the list is fixed in the runner, literal, guarded (a retired id
   must not be runnable and holds no exemption) and pinned by F6.

## 7. Open items

- **B-LOM is the placeholder row and is NOT merged this round**, per the ticket: round 2
  takes it last and re-measures every post after it. `m4/workout/engine-order.cjs` and the
  two sealed files it moves are already declared here, so only `legacy-order-mapping.cjs`,
  its test and possibly `gym-model.mjs` are contingent.
- Bar row 22 (MAPPING_ID) is **executed against the S5 constant and PASSES**: `MAPPING_ID`
  and `ENGINE_REVISION` are only CONSTRUCTED (production-mapping.cjs), compared in tests
  against the same live constant, and DISPLAYED on the Import screen. No code anywhere
  compares a STORED mapping id or engine_revision against the current one, and
  `local-source-profile.cjs`'s `qualify()` never reads either - production-mapping.cjs:50
  states it and the scan over every tracked `.cjs/.mjs/.js/.json` confirms it. So the
  rotation cannot invalidate an admitted import. It is re-run in round 2 against the S6
  constant before the coach line moves, as the brief requires.
- Bar row 29's 20 consecutive windows-latest runs of (a) and (d) cannot be run from here;
  what is recorded instead is the measured margin, the deterministic red, and the green
  under the same starvation.
- The trip-wire (`:456`) is NOT armed by this branch: the standing rebuild.yml step is
  still `--package S5`, so `engine-revision.test.cjs` stays green and C5 is not red yet.
  That is the PM's flip at the ff-merge, in `:465-467`'s order.
