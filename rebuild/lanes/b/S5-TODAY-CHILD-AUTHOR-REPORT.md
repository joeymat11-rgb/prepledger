# M2-S5-TODAY-CHILD — author report

Lane B · Opus · high · child of `M2-S4-REAL-DAY` · size S. Branch `rebuild/b-s5-today-child`, rebased
onto `origin/rebuild/t2-client-core` `8b484c09` (merge-base `8b484c09`; ledger 462 lines). Not pushed.
Three commits: brief, package, this citation round. Nothing on the phone changes because of THIS
package: `DECISIONS:455` rules that S4 sealed all of `today/**`, so lane C's ACCEPTED P-MEASURE bytes
reach the tip only inside a reseal child. S5 pins them, gives the four page-stack measure suites a CI
home, moves the standing step `S4 -> S5`, moves no `rebuild/engine` byte, authors no product byte.

## 1. The citation round

Each of the three PM lines is matched by the sha256 of the line's EXACT bytes WITHOUT its trailing
newline — the runner's own method (`sha(Buffer.from(v.line)) === v.lineSha256`, then those bytes
located in Git on `refs/remotes/origin/rebuild/t2-client-core`, which no spec can name). Validated
before a byte of S5 moved: it reproduces S4's three values from `DECISIONS:441/442/444` —
`3fd215acc47f…`, `fb8581c0c894…`, `a1d96976ed87…`, the last being what `packages/S4.json` carries.

| spec field | ledger line | lineSha256 |
| --- | --- | --- |
| `authorizations.theme` | `:460` THEME | `00f955e7e582812708d7073055da36a73356b61300aee20eca754bd7c3ca4a20` |
| `brief.acceptedLedgerLine` | `:461` BRIEF-BY-SHA | `2e84f8499c1b634c4225f7ac6da69e99999541d946175ef71bb7463c15ae10ab` |
| `coverage.superseded.rulingLineSha256` | `:462` GATE-SUPERSESSION | `f9de6a7bc0514fd03d640370c07d005dbc91a77e12dc3ead728d5f816f176fdb` |

`status` moves `PROPOSED` -> `BRIEF-ACCEPTED` (with a cited brief line the runner refuses
`BRIEF-ACCEPTANCE-STATUS` under any other word); the five `coverage.superseded.gates[*].why` strings
now name `DECISIONS:462` and its sha prefix in S4's exact shape. The artifact came from the runner's
OWN `proposed()` path, never hand-edited; exactly nine fields move — `spec.sha256`,
`authorizations.theme`, `coverage.supersessions.rulingLineSha256`, the five `why` strings and
`executionPins["rebuild/lanes/b/tooling/packages/S5.json"]`. This round's whole diff is
`packages/S5.json`, the artifact and this report: no product byte, nothing under `today/`, `measure/`.

The artifact was proved to BE `proposed()`, not merely written by it: with a scratch
`review-s5-today-child.json` (`PENDING`, deleted again, never committed) the unmodified runner reaches
`ENVELOPE PENDING artifact=84e3430d… spec=6d986c52… runner=fdf5f550…`, past
`SEALED-PROFILE-RECOMPUTATION`. `SEAL BASE ON THE TIP` is not producible on this mode at this head:
`sealOnTheTip()` runs at `b-package.cjs:2766`, after the `PENDING` return at `:2760`, so it prints
only once the review envelope is ACCEPTED — at the lane flip. The head IS on the tip (`8b484c09`
stands in this HEAD's own first-parent chain).

## 2. Files : hunks

`edited`, all parent PRODUCT pins: `today/today-app.cjs` 49/0 (lane C's bytes, pinned not authored) ·
`.github/workflows/rebuild.yml` 41/4 · `lanes/b/tooling/b-package.cjs` 35/4 ·
`lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` 44/8 ·
`today/test/setup.test.mjs` 8/1 · `today/test/food.test.mjs` 5/1 ·
`today/test/machine-settings-ui.test.mjs` 5/1 · `packages/H3.json` 1/1 · `packages/S3.json` 1/1.
`superseded-by-child`, a parent EXECUTION pin: `packages/S4.json` 1/1 (`tooling.runnerSha256`).
`new`: the 15 files of `m3/w7-preview/measure/` (lane C's; `test/boundary.test.mjs` amended **48/7**,
§4d) · `shared-preflight.yml` and `lanes/tooling/test/shared-preflight-ci-registration.test.cjs`
(lane C's, declared not edited) · this package's six cells under `m4/workout/test/`, **976 lines**
(source-carriers 183, writers-differential 198, defect-witnesses 177, second-gate 170,
inherited-carriers 147, engine-files-differential 101). Not product: `packages/S5.json`, the artifact,
the brief, this report. Branch vs tip: 41 files, +7837/-27. All 45 tracked `rebuild/engine` files
stand at the parent's post; the 18 named are `carried` with `pre === post`.

## 3. sha256 and inventory

brief `5163b634423d0dceef4834579eb52057007a84e0a988a7175f7ed6a1a074faf9` (21744 B) · spec
`6d986c5248389f0f5f21f6501fb1cd29c245cc485da01952ded40914fd44bc0c` (51187 B) · artifact
`84e3430ddd851965d630cecffe4bf7ead88ec10ed53635c503671fd616c1169e` (51540 B) · runner
`fdf5f55052b588995d3dafb50088a3d474ed26de8171c842e3d653993dcb70eb` · parent artifact
`12779767123e5b0983bcce4028c2c3213b0a6bf05a1661909ee5949f96d8a972` (receipt `:449`) ·
`today-app.cjs` pre `1ae7fbc6…` post `016a1e4f096d24e6…`. The `proposed()` method was validated
against `S4` first: it reproduces that sealed artifact byte for byte, 44303 B, `12779767…`.
**114 declared files: 81 carried · 9 edited · 1 superseded-by-child · 23 new.** 33 at the declared
post-image, 0 at a pinned pre-image, **0 unlisted drift**, covering all **90** parent-pinned product
files. `coverage.superseded` names **5** carriers over **9** gates; `coverage.inherited` is `{}`.

## 4. Four things the ticket did not predict

**(a) `:457` says eighteen measure files. There are FIFTEEN** — seven modules, one fixture, six
`.test.mjs` cells and `test/support.mjs` (`git ls-files`). The brief corrects the count.
**(b) A null `rulingLineSha256` was a HARD REFUSAL, not a soft open obligation:** `coverage()` calls
`supersededGates()` -> `supersessionRuling(s)`, whose first assertion is `rulingLineSha256 !== null`.
All three lines of §1 are preconditions of the evidence, not obligations counted beside it.
**(c) `CHILD_ROOTS` had to gain `rebuild/m3/w7-preview/measure/test/`:** `:455` puts lane C's modules
there, and a package declaring them role `new` cannot EXECUTE them while that directory stands
outside the runner's fixed list (`CHILD-ARGV-TARGET`). Disclosed in brief §3.4; answered with a new
guard, cell `F7`, which pins the whole list — nothing did before.
**(d) One lane C cell had to be amended.** `measure/test/boundary.test.mjs` (48 added, 7 removed) (g)
asserted `drifted === ['today-app.cjs']` — false by construction on a reseal child. Red first:
`# pass 665 / # fail 1`, `the sealed-byte drift of this ticket is not today-app.cjs alone`, all nine
listed. It now reads the DECLARING SPEC (H3's licence, S3 re-pointed, S4 chained); one `deepEqual`
became three tighter assertions plus one new on the restored `machine-settings-ui.test.mjs`.

## 5. `--ci --package S5` at this head — the tail, verbatim

```
B PACKAGE S5 SUPERSEDED EVIDENCE second-gate; laws UNMOVED; red-first s5-sup-second-gate; public census the runner's own census line, which says none; legacy differential a0-journeys; writers differential today-17; engine-files differential engine-files-differential over 27 tracked rebuild/engine/ file(s) outside this package's own product, each re-compared here against the parent post; 4 named child(ren) executed green in this run
B PACKAGE S5 OPEN closed cumulative profile not sealed
B PACKAGE S5 PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time
```

exit 0. Earlier in the run: `SPEC OBSERVED … status=BRIEF-ACCEPTED … 5 byte-identity carrier(s)
declared SUPERSEDED under a PM line recorded by sha256 f9de6a7bc051`; `PRODUCT IMPLEMENTED; … 0
unlisted drift; the inventory covers all 90 parent-pinned product files`; `AUTHORITY OBSERVED … theme
DECISIONS:460 … brief acceptance DECISIONS:461 found in Git on` the chain branch; ten `CHILD` lines
`OBSERVED; exit 0`. `AUDIT RED-FIRST FAIL` is PRE-EXISTING (the tip's `--package S4` prints it and
still passes); `--package S4` here refuses `SEALED-PROFILE-RECOMPUTATION`, its `a1d96976ed87` intact.

## 6. Suites at this head (`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`)

today 17 by name `# tests 666 · # pass 666 · # fail 0` · measure hermetic `# tests 11 · # pass 11` ·
the five `s5-supersede-*` cells `# tests 16 · # pass 16` · `s5-engine-files-differential` `27 tracked
rebuild/engine file(s) … all byte-identical to the parent` · lane B tooling `# tests 91 · # pass 91`
(was 90; `F7` is new) · A1 `W7-PREVIEW BUILD PASS: 3 allowlisted assets; 16 approved browser inputs;
pinned T01/T02/T08` · A5 `A5 PWA BUILD PASS: 13 files … no em/en dash in any text this build emits` ·
`rig187 ⇒ PASS`. Every one `# fail 0`, exit 0; `git status --porcelain` empty after each. Red-first
stands from r1: one byte appended to `rebuild/engine/index.cjs` takes the five supersession cells to
`# pass 3 / # fail 4` and the differential to a named `AssertionError`; reverted, `# pass 7 / # fail 0`.

## 7. Open items, not swept

1. `m3/w6/test/local-today-journey.test.mjs` exports `CHILD_SPECS = ['H3','S3','S4']`, one name behind
   its four consumers; nothing imports it and S5 moves neither file it guards. Named for S6 (r1 MINOR).
2. `rebuild/engine/writers.cjs` `SIGNALS` still calls waist an unlogged input (`:457` (ii)) — a pinned
   engine byte, so it goes to the next engine package unchanged.
3. `review-s5-today-child.json` is deliberately absent, so `ENVELOPE ABSENT` and the non-blocking
   `closed cumulative profile not sealed` stand exactly as at S4's author head.
