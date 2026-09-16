# PLAN EDIT COMPANION v2 - lane D author report

Builder evidence only: no acceptance, no independent review claim, no merge, not pushed. Branch `rebuild/d-plan-edit-v2` over `origin/rebuild/t2-client-core` 0ac72eadf8cfe55c010af7f0d40034d133cdccba (:468). Authority :176 (2); brief accepted by name at :195 (`rebuild/lanes/d/BRIEF-PLAN-EDIT-COMPANION-v1.0.md`).

## 1. Cherry-picked / skipped
`-x` from `origin/rebuild/lane-d-plan-edit-r1`, in order, all clean: **12a837f** brief, **8a094da** three runtime modules + two suites + two mutant harnesses, **6b3465e** candidate report, **7b073a8** stale-ack witness, **3694645** save-retry and unproved-rejection fixes, **74920fb** r1 fix report.

Skipped **f3e9561** and the nine F1/F2 commits below it: lane D's separate, unmerged F2 package (`m4/workout/setup-tags.cjs`, `lanes/d/f2/**`, `F2-PREBUILD-REPORT.md`). Nothing of F2 is on the tip in any form, and importing its runtime would ship another package's product under this one. `validateTags` / `projectNewExerciseTags` are INJECTED collaborators in the accepted brief (section 3), so the lane keeps a byte-identical copy of the published F2 blob at f3e9561 as `lanes/d/plan-edit/f2-tag-adapter.cjs` (sha256 d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d); a cell proves that identity against the Git blob and proves no runtime file imports it. No N2 or setup-tags file was carried over in any other form.

## 2. Seams that moved, and how the companion follows them
**S4 REAL DAY (:437/:451/:467), `w6/local/today-bindings.mjs`.** `clientClockFor(day, live)` moves the INSTANT half and never the day: a host's `clock.today()` is its frozen `day` argument, so reading tomorrow off it is the :437 frozen-date defect with a day added. `createPlanEditHost` now REQUIRES `liveDay` (the installation's `liveDay()`, what `openTodayInstallation` reports and Today stands on) and derives every date through ONE reader, so no path can fall back. `clock` is unchanged and still handed to the existing `hostBindings`; when the two disagree the save refuses rather than dating an edit off a day nothing is stamped with. `Date.now()` appears nowhere.

**Stale basis shows the new result before refusing (EW-12).** `save()` on a stale review returns the authenticated read it just took: the plan actually there, its basis, its pending dates, and the date a fresh review would offer.

**P0-B adoption + P2 import (`today-app.cjs` adoptAthleteState, `today/local-source-basis.mjs`, `w6/local/source-admission.mjs`).** Today adopts `admittedLocalSourceState(setup)` when the generation carries an admitted import and `setup.athleteState()` (clean-init over the stored setup document) otherwise. The projector now takes `basisSource` ('first-run' | 'local-source'), validates it at construction, and PROVES it against the generation in `inspect()` through `admittedLocalSourceBasis` - the same join Today uses, injected because it is ESM. The host chooses nothing: it binds the projector on its first authenticated read from that generation's own import presence, and a later read that disagrees refuses. An admitted import IS the basis (his own names, renames and readings carried; edits compose onto them); an import present but not admitted refuses and is never replaced by a clean-init state; a state that is not the admitted one refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`. Import correspondence is `source-admission.mjs programme()`'s own predicate - id/day/mg/sets/hi/inc/steps plus the setup tag snapshot, matched by id and NOT over `n` - because that is exactly what admission proved.

**Closed collections.** The candidate's import guard read `collections.sourceImports`, a key no lane writes, so it never fired. Replaced by the four real markers (`metadata.imports`, `.localSources`, `.localSourceApplication`, `collections.derived.localSource`) plus a closed set equal to `local-client.mjs COLLECTIONS` + `derived`, with a :456-shaped trip-wire cell that recomputes it from that module.

**P6 (`client/index.cjs` respond / recordIssuance / notRecordedBefore).** Unchanged for this lane and proved so: the producer's closed-key validator still accepts exactly the operation `Ops.build` produces and refuses an issuance-shaped payload, an extra member and a `consented` provenance; `recordIssuance` is untouched beside a plan edit; `client.planEdit` (the scalar seam) is still not used, as the brief rules. **Engine (`engine/plan.cjs`, pinned)** is read only; rename still appends the dated `{from, prevN}` seam and `nameAt` reads it. No engine byte moves.

## 3. The three runtime paths (custody unchanged)
`m4/workout/plan-edit-commands.cjs` producer + closed-operation validator (unchanged this round); `m4/workout/plan-edit-model.cjs` dated projector (`basisSource`, `admittedBasisOf`, closed collections); `m3/w6/host/plan-edit-host.mjs` durable composition (`liveDay`, lazy generation-bound projector, stale-with-result, `athleteLabel`/`namespace` for the P2 join). No new store, clock, lease, authority or client-core change. Machine notes still go through `rebuild/coach/machine-settings-commands.cjs` unforked (PE06, real `local-world.mjs` host).

## 4. Cells per duty (executed, real fake-indexeddb stores, no stubs - :439)
| Duty | Cells |
| --- | --- |
| EW-11 | PE07 x2, PE08 x2, producer / basis-hash / descriptor / calendar / next-date / HH:MM, PE16 basis + collections, client-P6 x3 |
| EW-12 | PE09 x8 (quota abort, CAS race, cancel / close / installation-close during encryption, integrity, lapsed era, unproved rejection), PE10 x4, PE14, PE15 x4 |
| EW-13 | PE10 reopen-from-ops, PE11 (measurements, session facts, notes byte-identical), PE16 imported readings and renames survive a save |
| EW-14 half | I16 (basis follows real plan operations across projection dates and factual writes) + PE16's real-store admitted-import read. The CONSUMER half - future gym creation, preserved open workout / check-in drafts - is C's and is NOT claimed. |

New: PE15 x4 (live day vs frozen host clock; stale-with-result; disagreeing stamp clock; a local midnight with the two in step), PE16 x3 durable + x4 model (admitted import, unadmitted import, no fallback, collections trip-wire, F2 adapter identity), client-P6 x3; host mutants `frozen-host-day`, `unchecked-basis-source`; model mutants `open-collections`, `declared-basis-unchecked`, `admitted-basis-unmatched`. Every pre-existing mutant anchor was re-pointed, never removed.

## 5. Astra REJECT witnesses, re-run and closed
`lanes/d/plan-edit/astra-rerun.mjs` copies the reviewer's published files (committed unchanged beside it; ANNEX sha256 5662293f8c6f976c9ebbb1a8f19dbac4534744b085ac2ff1537cd76644732c7e, the value the r1 retest names; R1-ANNEX e88619e449f818cecb80051baaa15521addcd2673df22a31744a71a07c85fe7a) to a directory at the same depth, applies FOUR anchored, counted adaptations and nothing else, and runs them. Each is a dependency this tip does not carry, never a weakened assertion: (1) F2's `setup-tags.cjs` require -> the lane's byte-identical copy; (2) `liveDay: () => clock.today()`, exactly the value the Sept-13 host derived internally; (3) the fixture's F1 FULL-BODY split restated in the tip's `DAY_KINDS` (`['U','L']`), covering the same two families its lifts use - without it the reviewer's own first-run setup refuses before any companion code runs; (4) F1's engine `orderedExercisesForDay` (not on the tip; `rebuild/engine` is pinned) -> the tip's own ordered-pool reader, the M2-S3 companion `sessionMembership` through `m4/workout/engine-runtime.cjs`. Result **22/22 PASS**: I01-I16, including the blocking REJECT witnesses I08/I09 (R1) and I10 (R2), plus R1-A..R1-D. Both findings are closed at this head.

## 6. Verbatim tails
```text
# tests 64 / # suites 0 / # pass 64 / # fail 0 / # cancelled 0 / # skipped 0   (lane companion suites)
{"baseline":true,"total":13,"killed":13,"survived":0,"originalsUnchanged":true}
7/7 host mutants killed by selected assertions
# tests 22 / # pass 22 / # fail 0 / # cancelled 0 / # skipped 0                (Astra annex + R1 annex)
today-17 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): tests 666 / pass 666 / fail 0
W6: 586/586/0   A0 (journey+engine-equivalence+local-real-day): 38/38/0   coach: 231/231/0
client (reason-on-disk): 18/18/0   rig187 => PASS
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-c41c7b74a73f;
  approved design pinned; 69 bound classes; 2 pinned typefaces inlined; no literal figure in the
  template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the
  athlete can see
b-package --ci --package S5 at HEAD 5c2ad35, exit 0:
  B PACKAGE S5 PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 81
    carried byte-identical from the parent / ... / 0 unlisted drift; the inventory covers all 90
    parent-pinned product files
  B PACKAGE S5 PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict; the 19
    original gates, the private oracle and independent exact-artifact acceptance remain separate,
    and POSTFIX PACKAGE PASS is unavailable on this mode at any time
```
The new host file is NOT an input to the Today build: `build.mjs` still reports 121 pinned inputs, because the page imports nothing from `m3/w6/host/plan-edit-host.mjs`.

## 7. Drift list
`git diff --name-only 0ac72ea HEAD`, each `findstr`'d against `lanes/b/tooling/packages/S5.json`: **17 files, 0 named in S5.json. Pinned-by-S5: NONE.** Unpinned: `m4/workout/{plan-edit-commands.cjs, plan-edit-model.cjs}`; `m3/w6/host/plan-edit-host.mjs`; `lanes/d/{BRIEF-PLAN-EDIT-COMPANION-v1.0.md, PLAN-EDIT-CANDIDATE-REPORT.md, PLAN-EDIT-R1-FIX-REPORT.md, PLAN-EDIT-V2-AUTHOR-REPORT.md}`; `lanes/d/plan-edit/{astra-rerun.mjs, browser-build.test.mjs, client-p6.test.cjs, durable-host.test.mjs, f2-tag-adapter.cjs, host-mutants.mjs, model-mutants.cjs, model.test.cjs}`; `lanes/astra/reviews/PLAN-EDIT-{BROWSER-IMPORT.mjs, REVIEW-ANNEX.mjs, REVIEW-R1-ANNEX.mjs}`.

NO engine byte and NO `m3/w7-preview/today/**` file is touched, and no S5-declared product file moves. So `b-package --ci --package S5` does NOT go red here: the three runtime files are new under fixed roots but are not among S5's 114 declared product files, so the profile recomputes unchanged (`0 unlisted drift`, exit 0). The ticket predicted WORKTREE-SOURCE-PIN or SEALED-PROFILE-RECOMPUTATION; neither fires. Reported as observed, not argued. The custody question it raises is the PM's: whether S6 should DECLARE these three runtime files as product, which is what would make a later change to them recompute the seal.

## 8. Open items
- The editor (DOM, copy, viewport, focus; EW-16) is lane C's part 2 and D2 reviews it. Nothing here renders.
- PE12 / EW-14's CONSUMER half is a joint C proof and is NOT claimed by this package.
- CI home: `lanes/d/plan-edit/*` is named in NO workflow. `rebuild.yml` is pinned, so the enumeration - and whether the three runtime files become declared product - lands inside the S6 reseal (:455 / :467).
- F2 is still unmerged; the ACTUAL C/F2 integration is not proved here, exactly as the brief's section 3 says.
- The four annex adaptations in section 5 are the author's; an independent reviewer should re-derive them.
- Not pushed. B's cumulative profile, pins, private verdict, receipt and authorized rerun remain separate gates.
