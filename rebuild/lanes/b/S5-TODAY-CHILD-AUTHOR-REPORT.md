# M2-S5-TODAY-CHILD — author report

Lane B · Opus · high · child of `M2-S4-REAL-DAY` · size S. Branch `rebuild/b-s5-today-child` rebased
onto `origin/rebuild/t2-client-core` `c76fb7f5` (merge-base `c76fb7f5`; ledger 457 lines). Not pushed.
Two commits: the brief, then the package. Nothing on the phone changes because of THIS package:
`DECISIONS:455` rules that S4 sealed all of `today/**`, so lane C's ACCEPTED P-MEASURE bytes reach the
tip only inside a reseal child. S5 pins them, gives the four page-stack measure suites a CI home,
moves the standing step `S4 -> S5`, and moves no `rebuild/engine` byte. Lane B authored no product byte.

## 1. Files : hunks

`edited`, all parent PRODUCT pins: `today/today-app.cjs` 49/0 (lane C's bytes, pinned not authored) ·
`.github/workflows/rebuild.yml` 41/4 · `lanes/b/tooling/b-package.cjs` 35/4 ·
`lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` 44/8 ·
`today/test/setup.test.mjs` 8/1 · `today/test/food.test.mjs` 5/1 ·
`today/test/machine-settings-ui.test.mjs` 5/1 · `packages/H3.json` 1/1 · `packages/S3.json` 1/1.
`superseded-by-child`, a parent EXECUTION pin: `packages/S4.json` 1/1 (`tooling.runnerSha256`).
`new`: the 15 files of `m3/w7-preview/measure/` (lane C's; `test/boundary.test.mjs` amended 44/10,
§3d) · `shared-preflight.yml` and `lanes/tooling/test/shared-preflight-ci-registration.test.cjs`
(lane C's, declared not edited) · this package's six cells under `m4/workout/test/`, 966 lines.
Not product: `packages/S5.json`, the artifact, the brief, this report. Branch vs tip: 40 files,
+7703/-27. All 45 tracked `rebuild/engine` files stand at the parent's post; the 18 named are
`carried` with `pre === post`.

## 2. sha256 and inventory

brief `5163b634423d0dceef4834579eb52057007a84e0a988a7175f7ed6a1a074faf9` (21744 B) · spec
`83726bbe5aa5bf5c707326344eb70b23ae6c32991bc67a9602632f97d75a4797` (49150 B) · artifact
`96608eac4b05defff8cc3a9f54bed552b47712bc3588ade466b659cdee378d44` (49988 B) · runner
`fdf5f55052b588995d3dafb50088a3d474ed26de8171c842e3d653993dcb70eb` · parent artifact
`12779767123e5b0983bcce4028c2c3213b0a6bf05a1661909ee5949f96d8a972` (receipt `:449`) ·
`today-app.cjs` pre `1ae7fbc6…` post `016a1e4f096d24e6…`. The artifact came from the RUNNER'S OWN
`proposed()` path, never hand-written; the method was validated first — run against `S4` it
reproduces the sealed artifact byte for byte, 44303 B, `12779767…`.

**114 declared files: 81 carried · 9 edited · 1 superseded-by-child · 23 new.** 33 at the declared
post-image, 0 at a pinned pre-image, **0 unlisted drift**, covering all **90** parent-pinned product
files. `coverage.superseded` names **5** carriers over **9** gates; `coverage.inherited` is `{}`.

## 3. Four things the ticket did not predict

**(a) `:457` says eighteen measure files. There are FIFTEEN** — seven modules, one fixture, six
`.test.mjs` cells and `test/support.mjs` (`git ls-files`). The brief corrects the count.

**(b) A null `rulingLineSha256` is a HARD REFUSAL, not a soft open obligation.** `coverage()` calls
`supersededGates()`, whose first statement is `supersessionRuling(s)`, whose first assertion is
`sup.rulingLineSha256 !== null`. The run throws before the coverage line prints, so theme and brief
are never reached and `REVIEW-PENDING` is unreachable. **All three** lines of brief §6 are
preconditions of the evidence, not obligations counted beside it.

**(c) `CHILD_ROOTS` had to gain `rebuild/m3/w7-preview/measure/test/`.** `:455` puts lane C's modules
there, and a package declaring them as role `new` cannot EXECUTE them while that directory stands
outside the runner's fixed list (`CHILD-ARGV-TARGET`). Disclosed in brief §3.4; the widening is
answered with a new guard, cell `F7`, which pins the whole list — nothing did before.

**(d) One lane C cell had to be amended.** `measure/test/boundary.test.mjs` (g) asserted
`drifted === ['today-app.cjs']` — true on lane C's branch, false by construction on a reseal child.
Red first: `# pass 665 / # fail 1`, `the sealed-byte drift of this ticket is not today-app.cjs alone`,
listing all nine. It now reads the DECLARING SPEC (H3's licence, S3 re-pointed, S4 chained): every
drift must be declared AND stand at that spec's post, and this lane's own drift under `today/` must
still be `today-app.cjs` alone. It GAINS an assertion — the restored `machine-settings-ui.test.mjs`
must now also name no byte of lane C's directory.

## 4. The predicted pre-ruling stop, verbatim

```
B PACKAGE S5 SPEC OBSERVED packages/S5.json 83726bbe5aa5bf5c707326344eb70b23ae6c32991bc67a9602632f97d75a4797; runner fdf5f55052b588995d3dafb50088a3d474ed26de8171c842e3d653993dcb70eb byte-identical on disk and in Git at HEAD; status=PROPOSED; 0 D-ids ; 114 declared product files; 10 declared child(ren), argv file-first under 8 fixed root(s) with only --test --test-reporter=tap permitted; 0 declared move(s), each naming its own original executable in a relative require specifier (moves are refused outright under this runner — TOOLING-REVIEW-r3 X1); no successor carriers declared (every inherited gate must be carried by a parent-pinned executable); 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 NOT YET CITED — the run will refuse GATE-SUPERSESSION-RULING-NOT-CITED
B PACKAGE S5 PARENT OPTION S4 M2-S4-REAL-DAY rebuild/m4/spec/acceptance-s4-real-day.json 12779767123e5b0983bcce4028c2c3213b0a6bf05a1661909ee5949f96d8a972 ACCEPTED at e0c4e3c949a5e3cdb9967c88be4543d69308dc9a (DECISIONS:449); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review rebuild/m4/spec/review-s4-real-day.json 31ab93f3c0f1 byte-identical on disk and on that branch; receipt base 03afc18 is an ancestor of it
B PACKAGE S5 PARENT BOUND S4 rebuild/m4/spec/acceptance-s4-real-day.json 12779767123e5b0983bcce4028c2c3213b0a6bf05a1661909ee5949f96d8a972; single-parent chain holds — no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent
B PACKAGE S5 POSTFIX M2-S5-TODAY-CHILD REVIEW-PENDING mode=--ci
B PACKAGE S5 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s5-today-child.json is not sealed yet — no PASS word is available
B PACKAGE S5 PARENT PINS RE-ASSERTED at run time; 3 pin(s) from rebuild/m4/spec/acceptance-s4-real-day.json plus its 90 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-s3-companion.json, byte-identical on disk AND in Git at HEAD; 91 superseded pin(s) preserved in Git at sourceBase c76fb7f; parent artifact byte-identical in Git at e0c4e3c949a5e3cdb9967c88be4543d69308dc9a
B PACKAGE S5 PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 81 carried byte-identical from the parent / 0 declared role "pinned-unchanged" — executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 90 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S4.json)
B PACKAGE S5 FIDELITY OBSERVED; sourceBase c76fb7f ancestor of HEAD <this commit>; 6 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner fdf5f55052b5 and spec 83726bbe5aa5 pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
B PACKAGE S5 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact ledger line bytes at the parent receipt base 03afc18 under their own roles; contract inherited byte-equal from the parent; theme NULL — no PASS word is available; brief acceptance NULL — the obligation stays open; this package's own two lines are resolved on the chain branch, not at its parent's receipt base — they are written after the parent was sealed and could never be found there
B PACKAGE S5 PROTECTED SURFACES 2 declared by the spec and echoed here, asserted by nothing in this line: rebuild/conform/goldens (public census and frozen goldens) | rebuild/conform/private/live.json and the private live.main golden (never opened, named-with-values, hashed or quoted)
B PACKAGE S5 PRIVATE LIVE-TRIGGERED none; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration
B PACKAGE S5 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE S5 LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase IMPLEMENTED; this package declares NO D-id, so these rows are the register BASELINE and prove nothing about it — its obligation is the Y1 own-child rule reported below
B PACKAGE S5 CARRIERS NONE DECLARED; 0 witness flip(s) declared
B PACKAGE S5 CHILD today-17 OBSERVED; exit 0, 146301 bytes of stdout, exact declared verdict at line start; ran <argv>
<the other NINE CHILD lines, identical in shape, all OBSERVED exit 0: measure-hermetic 2590 B ·
 s4-real-day 3515 B · a0-journeys 5238 B · s5-sup-source-carriers 1770 B · s5-sup-inherited-carriers
 1295 B · s5-sup-defect-witnesses 1108 B · s5-sup-writers-differential 1167 B · s5-sup-second-gate
 982 B · engine-files-differential 4726 B>
B PACKAGE S5 FAIL GATE-SUPERSESSION-RULING-NOT-CITED; required evidence missing or failed; local diagnostics withheld
```

exit 1. Three elisions, each marked in place: the HEAD sha in `FIDELITY` (a report inside a commit
cannot name that commit's own sha), each `CHILD` line's argv echo (quoted in full in
`packages/S5.json`), and nine of the ten `CHILD` lines, which differ from the one quoted only in the
name and the stdout byte count — the counts are given above and §5 carries every suite's own tail.
`AUDIT RED-FIRST FAIL` is PRE-EXISTING and not S5's: the tip's own `--ci --package S4` prints it
while still reaching `PUBLIC CI EVIDENCE PASS`.

`--ci --package S4` at this head, the whole refusal: `B PACKAGE S4 FAIL
SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld` —
exactly as H3 and S3 print under a child, because S5 re-pinned `S4.json`'s runner sha. Its SPEC line
still reads `…SUPERSEDED under a PM line recorded by sha256 a1d96976ed87`, so `:444` is untouched.

## 5. Suites at the head (`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`)

| suite | result |
| --- | --- |
| today step, 17 files by name | `# tests 666 · # pass 666 · # fail 0` exit 0 |
| measure hermetic (model + adherence) | `# pass 11 · # fail 0` exit 0 |
| `s4-real-day` + `a0-journeys` | `# tests 38 · # pass 38 · # fail 0` exit 0 |
| the five `s5-supersede-*` cells | `# tests 16 · # pass 16 · # fail 0` exit 0 (4+3+3+3+3) |
| lane B tooling `test/*.test.cjs` | `# tests 91 · # pass 91 · # fail 0` exit 0 (was 90; `F7` is new) |
| W6 `rebuild/m3/w6 --test "test/*.test.mjs"` | `# tests 586 · # pass 586 · # fail 0` exit 0 |
| coach `rebuild/coach/test/*.test.cjs` | `# pass 218 · # fail 0` exit 0 |
| shared-preflight trio + the two hermetic measure suites | `# pass 96 · # fail 0` exit 0 |
| A1 `rebuild/m3/w7-preview/build.mjs` | `W7-PREVIEW BUILD PASS: 3 allowlisted assets; 16 approved browser inputs; pinned T01/T02/T08` exit 0 |
| A5 `rebuild/slice/pwa/build-pwa.mjs` | `A5 PWA BUILD PASS: 13 files … no em/en dash in any text this build emits` exit 0 |
| `rebuild/t2/rig187.cjs` | `rig187 ⇒ PASS` exit 0 |

```
ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 18 named and NOT ONE moves, so all 45 tracked rebuild/engine file(s) stand byte-identical to the parent's own post;
```

## 6. Red-first proof of this package's own cells

One byte appended to `rebuild/engine/index.cjs` (`40ccc489…` → `d58eecbf…`), nothing else touched: the
five supersession cells go `# pass 3 / # fail 4` — `S5/SUP-1`, `S5/SUP-2`, `S5/SUP-5`, `S5/SUP-6` all
refuse, `four carried modules still ARE the declared carriers` with `index.cjs` named in the diff; and
`s5-engine-files-differential.cjs` refuses `AssertionError: and that is the byte on disk:
rebuild/engine/index.cjs`, actual `d58eecbf…`, expected `40ccc489…`, exit non-zero. Reverted from the
untouched backup: `index.cjs` back at `40ccc489…`, `git status --porcelain` empty, the two cells
`# pass 7 / # fail 0`. The identity these cells assert is a MEASUREMENT.

## 7. What the PM's run executes first, and what is already proved

The runner locates the `GATE-SUPERSESSION` line on the chain branch by its own sha256, so NO local run
can reach `coverage()`. Proved by execution here anyway: every declared carrier is a carrier of the
PARENT (cell `S5/SUP-4` reads S4's artifact retiring all five over nine gates, and the runner's own
`proposed()` independently resolved the same 5 and 9 into the artifact, so
`GATE-SUPERSESSION-CARRIER-IS-NOT-A-PARENT-CARRIER` cannot fire); every evidence child ran green; the
census is clean, so the runner's own census line is admissible; the engine-files needle states `27`,
the count the runner measures over the 27 undeclared files; and `COVERED-SET-BOUND` reduces to
`0 + 9 === 0 + 9 + 0`, the nine all `via: 'superseded'`. First executed by the PM and by nobody here:
the ledger lookup and the per-carrier grant match, decided by the bytes of brief §6's third line.

## 8. Open items, not swept

1. `m3/w6/test/local-today-journey.test.mjs` exports `CHILD_SPECS = ['H3','S3','S4']`, one name behind
   the four consumers. Nothing imports it and S5 moves neither file it guards, so moving a pinned
   journey suite for a dead export would buy no evidence. Named here for S6.
2. `rebuild/engine/writers.cjs` `SIGNALS` still calls waist an unlogged input (`:457` (ii)) — a pinned
   engine byte, so it goes to the next engine package unchanged.
3. `review-s5-today-child.json` is deliberately absent, so `ENVELOPE ABSENT` and the non-blocking
   `closed cumulative profile not sealed` stand exactly as at S4's author head.
