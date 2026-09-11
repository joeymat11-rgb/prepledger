# LANE B — B-NTC FIX REPORT, answering B-NTC-REVIEW-r2 (REJECT)

**Review answered:** `rebuild/lanes/b/reviews/B-NTC-REVIEW-r2.md` — **REJECT**, blocking
changes 1–6, required-before-seal 7–10, recommended 11–13. The provider and its evidence were
found sound; what failed was the seal layer.
**Branch:** `rebuild/lane-b-ntc`. **Base of this pass:** `10feb1e` (= `71fb2f1` + the r2
review commit). **Author:** `lane-b-fixer5 <fixer5@earned.local>`.
**This is not a review and not an acceptance.** No PASS word is claimed for anything. Every
figure below was executed on the owner's Windows PC, node v24.18.0, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`, on the committed tree.

`ledger/` was never opened. `rebuild/conform/private` **does not exist in this worktree** and
was never sought or created; `--full` terminates on the BLOCKED line, as it must. No private
value, count, hash or golden appears in this file.

---

## 0. The ruling this pass is built on — and a correction to the brief that dispatched it

`rebuild/DECISIONS.md` grew by one line between the r2 review and this fix pass, and the two
lines do **not** say the same thing:

* **line 112** granted `MOVES_RULING`, id `DECISIONS:112`, saying "lane B authors
  `b-ntc-inherited-carriers.cjs` and **`coverage.moves` records this id**".
* **line 113** (LANE B RULINGS 6, answering REQUESTS 16:25 after this very review)
  **ratifies `MOVES_RULING B-NTC-INHERITED-1 AS WRITTEN in B-NTC-REVIEW-r2.md §E.3**, says
  "this line is its id; it particularises `DECISIONS:112 (1)`", and fixes the shape the
  other way: the child declares **`coverage.inherited`** naming a successor executable per
  parent child name, on five conditions of which the first is **"(a) `coverage.moves` stays
  `{}`"**, and the last is "(e) the tooling records this ruling id and refuses
  `coverage.inherited` in any package that does not cite it. A cumulative-profile
  supersession, not a coverage move; **X1 is not widened for any other package**."

Lane B's dispatch for this pass read line 112 and instructed the opposite shape (successors
under `coverage.moves`, id `DECISIONS:112`). **This pass follows line 113**, because the PM
appended it, it answers `TOOLING-REVIEW-r5`'s own PM question 1 in terms, and it is the
narrower rule. Consequences, all visible on every run: `MOVES_RULING` is still `null`,
`coverage.moves` is `{}` in all six package specs, X1 is untouched for everyone, and the id
the spec cites and the runner records is **`DECISIONS:113`**.

Line 113 also settles four things this review left to the PM: (3) the rebuild.yml
supersession and the pass-19 deletion are correct and are **not** to be restored; (4) the
parent wrapper is not edited and the patch file is deleted; (5) the H6 custody follows the
seam to lane C; (6) the sibling re-pin obligation rides each sibling's own rebase.

---

## 1. r2's exact changes 1–13

| # | r2's change | state | evidence |
|---|---|---|---|
| **1** | Obtain the MOVES_RULING, or withdraw the successors; teach the runner to admit a successor **only** under that id | **DONE** | `DECISIONS:113 (1)` ratified §E.3. `b-package.cjs` records `SUCCESSOR_RULING = 'DECISIONS:113'` and `SUCCESSOR_PACKAGES = {B-NTC}` as constants (W7); `packages/B-NTC.json` `coverage.successors.ruling` cites `MOVES_RULING=DECISIONS:113`; the admitted gates are **derived** from the parent artifact's own `coverage.byChild` keeping only gates whose carrier is a parent `executionPins` entry whose own closure reaches `engine-runtime.cjs` — nine, never typed. r2's proof met: `--ci --package B-NTC` → `CI REVIEW-PENDING … exit 2`; `--full --package B-NTC` → `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING … exit 2`. §3 |
| **2** | Do not ship a red CI | **RULED, and PART-OPEN** | `DECISIONS:113 (3)` rules the replacement correct and says "do NOT restore it, it would make CI permanently red on the child tree", and that the child step exits 0 **at the sealed head**. At *this* head it exits **2** (`CI REVIEW-PENDING: 3 open obligation(s)`), so the step is non-zero on the lane branch until the seal — that is the ruled pre-seal state, and it is stated rather than dressed up. Two of the three open obligations are ledger-clearable; the third is the product-phase objection in §4. |
| **3** | Restore or justify the two deleted CI steps, in the brief | **DONE** | Brief §4 now lists **all three** `rebuild.yml` hunks; §4.1 names the successor evidence for the 19 memory-only tests **cell by cell**, including the **three** that have no successor, and records that the retired file still runs 19/19 exit 0 at this head. |
| **4** | Retire `# pass 19` from the wrapper, or say it is deferred | **DONE** per `:113 (4)` | The parent wrapper is **not** edited (`git diff origin/rebuild/t2-client-core HEAD -- rebuild/m4/spec/native-carriers-package.cjs` empty); the child's spec omits the `browser-package` child; the CI step is gone; the successors are named. `rebuild/lanes/b/ntc/pass19-retirement.patch` is **deleted**, as the ruling directs — and so are `gym-host.wiring.patch` and `gym-model.previousLine.patch`, which r2 §G.1 measured at `git apply --check` exit 1 as well. |
| **5** | Correct brief §5's executable claim | **DONE** | Brief §5 is rewritten: the "`git apply --check` exit 0 … One command lands it" claim is **withdrawn by name**, r2's measured exit 1 is quoted, and the section now states the `:113 (4)` retirement with a checkable item per half. |
| **6** | Get a new brief-acceptance ledger line | **OPEN — ledger-clearable, and the reason is stated** | `DECISIONS:113 (2)` re-accepts the brief BY NAME and directs `brief.acceptedLedgerLine = 113`. **Lane B has not set it**, and did not relax the runner to let it through: line 113 does not meet the runner's own N4/X4 citation format — it does not carry `M2-B-NTC-NATIVE-TREND-CONTEXT`, does not name `rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md`, does not end in the ACCEPT terminal word, and is not present at the parent's receipt base `b045e61` where `ledger()` resolves it. `acceptedLedgerLine` stays `null` and `status` stays `PROPOSED`. §4. |
| **7** | Own the sibling breakage; correct BUILD-REPORT:146-147 | **DONE** | BUILD-REPORT:146-147 carries a CORRECTED block: B1/B2 `PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs`, B3/B4/B-LOM `UNLISTED-SOURCE-CHANGE`, both **because of** B-NTC and neither "identical". Measured at this head, and the codes are now on stderr (`TOOLING-REVIEW-r5` Z6) rather than requiring an instrumented process. The re-pin obligation is stated in brief §v1.3 S, and `DECISIONS:113 (6)` rules it rides each sibling's own rebase. |
| **8** | Fix the tooling regression; correct the Astra report's "9 passed / 0 failed" | **DONE** | `execution-targets.test.cjs` builds its own five-carrier / nine-gate fixture instead of reading the real spec; **9/9 exit 0 on `rebuild/lane-b-tooling` and on `rebuild/lane-b-ntc`**. `TOOLING-FIX-ASTRA-REPORT.md` carries a lane-B annotation recording that the 9/0 claim was 8/9 on the other branch and that the document binds nothing (`DECISIONS:112 (2)`). Both suites have a CI home question that remains open — see §5 residual 4. |
| **9** | Re-measure the BUILD-REPORT's counts at this head | **DONE** | §2 below; the same table is in `BUILD-REPORT-B-NTC.md` §0.5-r2. |
| **10** | Make `b-ntc-successors.test.cjs` safe | **DONE, and more than asked** | It no longer writes a tracked byte **in any process**. Each drift control runs in a short-lived child that installs a read-only `fs.readFileSync` overlay over one path in its own process — the same boundary `preflight()` reads at — so there is no window in which the checkout is dirty. `git status --porcelain -uno` is asserted before, after each case and at the end. **Kill proof, four times, `taskkill /T /F` (uncatchable on Windows) at 900/1800/3000/4500 ms: child exit=1 every time, `git status --porcelain -uno` empty every time.** |
| **11** | Cover the `rirPlan` bind window with a cell, or drop the scoping | **DONE — kept, with a cell** | `ntc-h6-delta.test.mjs` `B-NTC G8`. Bite: remove the scoping exactly as r2's M8 did → `ntc-h6-delta` **8 tests / 7 pass / 1 fail** (`not ok 8 - B-NTC G8`), while `gym` **64/64** and `adapter` **20/20** stay green — r2's M8/M16 reproduced, now with one cell that notices. Restored byte-identically (`b243257a…` both sides). Why it is structural and why KEEP rather than DROP: brief §v1.3 R. |
| **12** | Enumerate the retargets in `B-NTC.json`, asserted by the runner | **DONE, and there are THREE not two** | `coverage.successors.substitutions` carries all three verbatim; `b-ntc-successors.cjs` states the same three as one strict-JSON `SUBSTITUTIONS` literal; the runner `deepEqual`s the two, requires each `from` to stand exactly once in the original and each `to` not at all, and refuses any `replace()` call site in the successor's closure that is not driven by the table. The third is the SUPPORT pin re-target r2 §E.1 records separately from §E.2's two. |
| **13** | Collapse the brief's strata or annotate §4.2 | **DONE** | §4.2's `Refused.` bullet carries a SUPERSEDED block in place, and the brief's first line now reads **v1.3 — amended by lane B; acceptance line pending (BRIEF-READY)**, never "accepted". §v1.3 lists every amendment since `0ba59cca…` in one table. |

---

## 2. Re-measured at this head

Head: `rebuild/lane-b-ntc` at the commit this file is committed in. Spec
`packages/B-NTC.json` sha256 `fefb06fe…` at the run; runner `448a3352…`; brief sha256
**`5785158ede0acebf2784099257f7923be56d0e1545ab1f9f7e7fa47024721506`** (122 128 B) — the sha
the lane lead posts with BRIEF-READY.

| what | command | measured |
|---|---|---|
| provider cells | `node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs` | **39/39**, exit 0 (r2 measured 39; the BUILD-REPORT's old "36/36" is superseded) |
| the seven enumerated today files | `node --test --test-reporter=tap` over `adapter, checkin, design, gym, ntc-h6-delta, package, view` | **164/164**, exit 0 (r2 measured 163; **+1** is the new `B-NTC G8`. The BUILD-REPORT's old "123/123" and "129/129" are superseded) |
| … adapter / checkin / design / gym / ntc-h6-delta / package / view | each alone | **20 / 28 / 11 / 64 / 8 / 10 / 23**, each exit 0 |
| A0 journey + equivalence | `node --test --test-reporter=tap rebuild/m3/w6/host/test/journey.test.mjs …/engine-equivalence.test.cjs` | **23/23**, exit 0 |
| profile refusals | `node --test --test-reporter=tap rebuild/m4/spec/b-ntc-profile-refusals.test.cjs` | **13/13**, exit 0 (the original thirteen archived-parent controls) |
| successor child-pin refusals | `node --test --test-reporter=tap rebuild/m4/spec/b-ntc-successors.test.cjs` | **6/6**, exit 0 (was 4/4; two cases added — the substitution table, and the clean-checkout invariant) |
| focused | `node rebuild/m4/spec/b-ntc-focused.cjs` | `B-NTC FOCUSED: 15/15 PASS; original assertions and actual child runtime`, exit 0 |
| durable journeys | `node rebuild/m4/spec/b-ntc-journeys.cjs` | `B-NTC DURABLE JOURNEYS: 238/238 PASS; …`, exit 0 (was 237; **+1** for `B-NTC G8`) |
| the retired 19 | `node --test --test-reporter=tap rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19/19**, exit 0 — still green in Git, no CI home (brief §4.1) |
| one-store journey | `node --test --test-reporter=tap rebuild/m3/w6/test/local-today-journey.test.mjs` | **51/51**, exit 0 |
| delta cells G1–G5 | inside `ntc-h6-delta` | G1 **"the day+3 wall is GONE"** passes — the BUILD-REPORT's old "G1 UNCHANGED … blocked / PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED" is superseded; G2, G3, G4, G5 pass |
| the 45 register laws, as r2 §F.1 ran them | `node rebuild/conform/v4/run-defect-laws.cjs` with `ENGINE_MAIN`/`ENGINE_OLD` from `rebuild/conform/engines/` | `TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`, exit 1 — **identical to the base figure r1 and r2 measured** |
| the public census | `node rebuild/conform/run.cjs` | `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`, exit 1 — **character-for-character the base line** |

**Census and laws could not have moved**, and that is checkable rather than asserted:

```
$ git diff origin/rebuild/t2-client-core HEAD -- rebuild/engine rebuild/conform   → (empty)  exit 0
```

---

## 3. The two terminals r2's change 1 asked for

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
…
B PACKAGE B-NTC COVERAGE 9/19 original gate(s) covered by 5 executed child(ren) (9 inherited, the
  parent map byte-for-byte; 0 moved …); 10 re-execute under --full
B PACKAGE B-NTC SUCCESSORS 10 declared successor executable(s) PROVED against the parent original,
  of which 9 carry an inherited gate under MOVES_RULING=DECISIONS:113 (…B-NTC-INHERITED-1, ratified
  as written in B-NTC-REVIEW-r2.md E.3, particularising DECISIONS:112 (1)); coverage.moves stays {}
  and X1 is unwidened; each successor LOADS the parent carrier's own original, byte-equal to the
  parent execution pin AND to the Git blob at b95ccca (on refs/remotes/origin/rebuild/t2-client-core
  and behind HEAD), contains none of its lines, replaces only through the declared table, and prints
  the parent's own accepted verdict in full; 3 enumerated substitution(s)
… one SUCCESSOR line per carrier, and one SUCCESSOR SUBSTITUTION line per substitution, verbatim …
B PACKAGE B-NTC NO-REGISTER OBLIGATION … 15 of 15 declared child(ren) executing one of this
  package's own role:"new" product file(s) ran in this process, exit 0 … 1 required at the seal
B PACKAGE B-NTC OPEN product PARTIAL (7 declared file(s) still at the pinned pre-image)
B PACKAGE B-NTC OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE B-NTC OPEN brief rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md not accepted by a PM ledger line
B PACKAGE B-NTC OPEN closed cumulative profile not sealed
B PACKAGE B-NTC CI REVIEW-PENDING: 3 open obligation(s); public evidence only; no PASS is claimed
EXIT=2
```

```
$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC
… the same fifteen children OBSERVED, the same nine gates carried …
B PACKAGE B-NTC BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING          (stderr)
EXIT=2
```

**Both of r2's change-1 proofs are met**, and the second closes r2's open item **O4**: the
standing `DECISIONS:97` BLOCKED-private terminal is producible for this package id for the
first time. `rebuild/conform/private` does not exist here and was never sought; the private
oracle is never opened, only its absence noted.

**The three open obligations, quoted, and what clears each:**

| open | clearable by | ledger? |
|---|---|---|
| `theme ledger line accepting this brief is null` | a PM `cowork` line naming `M2-B-NTC-NATIVE-TREND-CONTEXT` and ending ` · ACCEPTED`, found at the parent's receipt base | **yes** |
| `brief … not accepted by a PM ledger line` | a PM line in the N4/X4 format — see §4 | **yes** |
| `product PARTIAL (7 declared file(s) still at the pinned pre-image)` | **not a ledger line.** See §4. | **no** |

(`closed cumulative profile not sealed` is printed but is **not** `--ci` blocking — it is the
seal itself, and it is the fourth line above.)

**The siblings, at this head, with their codes now on stderr (`TOOLING-REVIEW-r5` Z6):**

```
$ … --ci --package B1     → B PACKAGE B1 FAIL PARENT-PIN-BROKEN; required evidence missing or failed; local diagnostics withheld      EXIT=1
$ … --ci --package B2     → B PACKAGE B2 FAIL PARENT-PIN-BROKEN; …                                                                     EXIT=1
$ … --ci --package B3     → B PACKAGE B3 FAIL UNLISTED-SOURCE-CHANGE; …                                                                EXIT=1
$ … --ci --package B4     → B PACKAGE B4 FAIL UNLISTED-SOURCE-CHANGE; …                                                                EXIT=1
$ … --ci --package B-LOM  → B PACKAGE B-LOM FAIL UNLISTED-SOURCE-CHANGE; …                                                             EXIT=1
```

Exactly r2's R7 finding, now self-describing. Each is the sibling's own re-pin obligation
under `DECISIONS:113 (6)`; none is a defect in this package.

---

## 4. TWO THINGS LEFT OPEN, with the reason rather than a workaround

### 4.1 `brief.acceptedLedgerLine` stays `null` although `:113 (2)` accepts the brief

`DECISIONS:113 (2)` says "BRIEF-B-NTC RE-ACCEPTED BY NAME … `brief.acceptedLedgerLine = 113`".
Lane B has **not** set it, and did not change the runner to let it through. The runner's N4
rule (and X4's `BRIEF-ACCEPTED` implication) requires a citation whose line text:

* contains this `packageId` — line 113 contains "M2-B-NTC" but not `M2-B-NTC-NATIVE-TREND-CONTEXT`;
* contains `s.brief.file` — line 113 names "BRIEF-B-NTC", not the path;
* matches `/(?:^|[ ·])ACCEPTED$/` — line 113 ends `· RULED`;
* and is found as **exact line bytes in Git at the parent's receipt base** `b045e61` — line
  113 was written on 2026-09-11, long after that commit.

Setting `acceptedLedgerLine: 113` would refuse at `LEDGER-LINE-SHA256` / the acceptance-line
shape assert and take `--ci` from exit 2 to exit 1; relaxing any of those four is editing a
gate so a claim passes. **What clears it:** one PM line in that format, e.g. beginning
`- <date> · cowork ·` and ending ` · ACCEPTED`, naming `M2-B-NTC-NATIVE-TREND-CONTEXT`,
`rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` and the brief sha256
`5785158ede0acebf2784099257f7923be56d0e1545ab1f9f7e7fa47024721506`. The same shape is what
the theme obligation needs. This is the same residual the previous spec recorded as note [7]
("the semantic PM rulings 108/109 exist but do not match the tooling required terminal
citation format"); it is now stated with the exact four reasons.

### 4.2 `PRODUCT PARTIAL` — an objection, not a fix

Seven files are declared `role:"new"` with `pre === post === their sourceBase bytes`:
`rebuild/m3/w7-preview/today/test/{adapter,checkin,design,package,view}.test.*`,
`rebuild/m3/w6/host/test/engine-equivalence.test.cjs` and
`rebuild/m3/w6/test/local-today-journey.test.mjs`. This package **executes** them (through
`b-ntc-journeys.cjs`) and **pins** them, but does not change them.

`product()` tests `disk === pin.pre` **before** `disk === pin.post`, so a file whose declared
post-image equals its pre-image is counted as "still at the pinned pre-image" and the phase is
`PARTIAL` — permanently, whatever the package does. Consequences: the `OPEN product PARTIAL`
obligation is `--ci` blocking, so `DECISIONS:113 (3)`'s "the child step exits 0 on both
runners at the sealed head" is **not reachable** while it stands, even with both ledger lines
issued and the artifact sealed.

**Two ways to clear it, and lane B took neither in this pass:**

1. **Drop the seven from `product`.** Rejected: `b-ntc-journeys.cjs` pins all ten executed
   suites by bytes against `product[file].post`. Dropping seven deletes a real pin to make a
   phase word read better, which is the move this package must not make.
2. **Order the two branches the other way in `product()`** — ask "is the file at its declared
   post-image?" first. This changes **no refusal**, only the phase word and its note; a file
   genuinely at a pre-image with a *different* post still reports `pre`. Lane B believes this
   is a real defect in the phase computation. It is **not** done here, because neither review
   asked for it and a fix pass that moves its own gate and clears its own blocking obligation
   in the same commit is exactly what an independent reviewer should not have to untangle.

**For the r3 / r6 reviewer and the PM, in one question:** should `product()` test the declared
post-image before the pre-image, so that a package that declares and pins a file it does not
change reports `IMPLEMENTED`? If yes, it is a two-line change in `b-package.cjs` and this
obligation closes. If no, this package needs another way to pin those seven and the brief's
evidence claim needs re-shaping. Until then the obligation stands, in the open, counted.

---

## 5. Residuals carried forward

1. **Three of the nineteen retired memory-only cells have no successor** — brief §4.1 names
   them (`model 5` partial, `model 6` and `model 8` none). `DECISIONS:113 (3)` rules the step
   deleted and says not to restore it; the file is unchanged in Git and runs 19/19 today.
2. **The three substitutions are trusted, not proven** (r2 R12). The runner now catches a
   retarget weakened in the successor alone, or added, or applied outside the table. It
   cannot catch one weakened in the successor **and** the spec in the same commit. Only a
   reviewer reading brief §v1.3 S can. Stated in the brief, the spec notes and here.
3. **`rirPlan`'s window is covered structurally, not behaviourally** (r2 R11). `rirPlan`
   reaches no trend-context call on any path this product drives; brief §v1.3 R gives the
   source lines and the reasoning for keeping the scoping.
4. **Neither tooling suite has a CI home** (r2 change 8, second half).
   `test/execution-targets.test.cjs` and `test/successor-moves.test.cjs` run green and are
   `TOOLING_FILES`-exempt, but no `rebuild.yml` step runs them. Adding one is a `.github`
   edit; `DECISIONS:112 (1)`'s standing rule allows a lane branch to touch `rebuild.yml`
   only inside an engine package that re-pins it, which this package does — so it **could**
   ride this seal. It is **not** added in this pass: it was not asked for by either review,
   and the `.github` surface is the one r2 flagged for exceeding its licence. Named for the
   PM rather than taken.
5. **Every qualified answer for both athletes is still `{hard:false, rushed:false, debt:false}`**
   (r1 residual 3, r2 residual 7): 28 well-formed 8-hour nights and no events produce no debt
   and no hard day, so the engine's `hard`/`debt` branches still have no *varying* real path
   through the product. Unchanged by this pass.
6. **`node rebuild/m3/w6/test/run-current-head.cjs --all` does not run in this worktree**
   (r2 R14) — it `git archive`s into a sibling R1 checkout that does not exist here.
   Pre-existing environment prerequisite, not B-NTC's, and not attempted.

---

## 6. Scope, and what a reviewer should re-run

```
$ git diff origin/rebuild/t2-client-core HEAD -- rebuild/engine rebuild/conform        → (empty) exit 0
$ git diff origin/rebuild/t2-client-core HEAD -- rebuild/m4/spec/native-carriers-package.cjs \
      rebuild/m4/spec/acceptance-native-carriers.json rebuild/m4/spec/review-native-carriers.json \
      rebuild/m4/spec/NATIVE-CARRIERS-THEME.md                                          → (empty)
$ git diff --check 10feb1e HEAD                                                         → (empty) exit 0
$ git diff --name-only 10feb1e HEAD -- .github                                          → (empty)
$ git diff --stat 10feb1e HEAD   → 32 files changed, 2539 insertions(+), 701 deletions(-)
```

**No `.github` file was touched by this pass at all** — `rebuild.yml` already carried the
`:109` enumeration and the two supersessions `DECISIONS:113 (3)` ruled correct, and this pass
left its bytes alone. The parent's artifact, review, theme and wrapper are byte-identical to
the tip. The 32 changed paths are: the brief, the BUILD-REPORT, this report, the three deleted
patches, the `rebuild/lanes/b/tooling/**` tree merged from `rebuild/lane-b-tooling` (plus the
r5 review document), one added cell in `ntc-h6-delta.test.mjs`, and the twelve `b-ntc-*` files.

To re-measure this pass:

```
node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs
node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/{adapter,checkin,design,gym,ntc-h6-delta,package,view}.test.*
node --test --test-reporter=tap rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
node --test --test-reporter=tap rebuild/m4/spec/b-ntc-profile-refusals.test.cjs      # run alone
node --test --test-reporter=tap rebuild/m4/spec/b-ntc-successors.test.cjs            # run alone
node rebuild/m4/spec/b-ntc-focused.cjs
node rebuild/m4/spec/b-ntc-journeys.cjs
node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs
node --test rebuild/lanes/b/tooling/test/successor-moves.test.cjs
node rebuild/conform/v4/run-defect-laws.cjs          # ENGINE_MAIN/ENGINE_OLD from rebuild/conform/engines/
node rebuild/conform/run.cjs
node rebuild/lanes/b/tooling/b-package.cjs --ci   --package B-NTC     # expect exit 2, 3 open
node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC     # expect exit 2, BLOCKED
node rebuild/lanes/b/tooling/b-package.cjs --ci   --package B1|B2|B3|B4|B-LOM   # expect exit 1, named
```

`b-ntc-profile-refusals.test.cjs` and `b-ntc-successors.test.cjs` still want to be run
**alone** (r2's note): both drive the whole archived-parent preflight, and running them
against a concurrent `--full` costs minutes and can time a child out. Neither can now corrupt
the checkout under any concurrency, which was the part that mattered.

The bite that proves `B-NTC G8` bites, and the four kill proofs for
`b-ntc-successors.test.cjs`, are reproducible from
`rebuild/lanes/b/FIX-REPORT-B-NTC-r2.md` §1 rows 10 and 11; both harnesses lived outside the
repository and left `git status --porcelain -uno` empty.
