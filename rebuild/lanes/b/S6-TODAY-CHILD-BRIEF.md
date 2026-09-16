# M2-S6-TODAY-CHILD - the reseal that closes the custody hole

**STATUS: DRAFT.** Not accepted by name, not accepted by sha, no token line minted; nothing here authorises a run. Lane B, ENGINE-TIER PACKAGE PROCESS, child of `M2-S5-TODAY-CHILD` (`rebuild/lanes/b/tooling/b-package.cjs`), size M. Parent artifact `rebuild/m4/spec/acceptance-s5-today-child.json` sha256 `84e3430ddd851965d630cecffe4bf7ead88ec10ed53635c503671fd616c1169e` (receipt `DECISIONS:466`, merge `:467`). Drafted at tip `c186d0f7`, `DECISIONS` 481 lines. Every count below was walked on that tip, not carried from a report.

## 1. Why

S6 has two jobs and no behaviour of its own. If a reviewer finds a behaviour change here, that is a finding.

**(1) Reseal `today/**`.** `DECISIONS:455` stands: S4 sealed the declared product under `rebuild/m3/w7-preview/today/**` and S5 re-pinned it, so any byte change there fails `SEALED-PROFILE-RECOMPUTATION` on its own branch. Three accepted or in-flight branches move those bytes and wait on this package: `rebuild/c-s6-small` (`6fad3472`), `rebuild/b-s6-child-tail` (`d1001da9`), P3-IMPORT-UI-2 round 4 (`:481`, unpushed).

**(2) Close the `DECISIONS:473` custody hole.** The runner recomputes only what a spec DECLARES, so every lane D and lane C module merged since S5 was sealed is invisible to it: `--ci --package S5` printed EXIT 0 at `:473`, `:477`, `:478` and `:481` not because nothing moved but because nothing that moved was declared. The PM ruled that a hole by design of the runner is not a licence. Measured against all five specs (`B-NTC`, `H3`, `S3`, `S4`, `S5`): **64 tracked files under the named roots that no spec declares**, plus 3 unpinned `today/` files `c-s6-small` moves.

## 2. The declaration list, walked

Method the author repeats rather than trusts: `git ls-files` per root on the tip; each path tested with `Object.hasOwn(product, path)` against all five specs; `git log --diff-filter=A` for the landing date. Roles below are product / test / pinned-unchanged; the spec's own `role` is `new` for a first declaration, `carried` for a re-pin with `pre === post`, `edited` where a byte moves.

**Counts per root (tracked / S5 declares / S6 adds).** `m3/w6/local/` 13 / 1 / **12**. `m3/w6/host/` 12 / 5 / **7**. `m4/import/` 27 / 0 / **27**. `m4/workout/plan-edit-*.cjs` 2 / 0 / **2**. `lanes/d/plan-edit/` 8 / 0 / **8**. `lanes/d/p3-replay-measure/` 2 / 0 / **2**. `lanes/d/import-retract/` 1 / 0 / **1**. `lanes/d/p3-followons/` 1 / 0 / **1**. `m3/w7-preview/import/` 4 / 0 / **4**. `m3/w7-preview/measure/` 15 / 15 / 0. `m3/w7-preview/today/` 57 / 15 / **3** moved. That is 64 in the eight hole roots, plus 3 under `today/`, plus the 114 S5 pins re-asserted. **The measure screen is fully declared by S5**: nothing is missing there, contrary to the ticket's "if S5 left any of it undeclared".

**2.1 `m3/w6/local/` - 12, role product, all `new`.** `today-bindings.mjs` is the only one S5 declares (`carried`), and that single declaration is the whole of `:473`'s complaint. Named by `:476`/`:478`: `source-admission.mjs` (2026-09-15), `import-bundle.mjs` (09-11), `local-client.mjs`, `browser-entry.mjs` (09-10). Their eight siblings, undeclared on the same rule: `build.mjs`, `host-bindings.mjs`, `host-browser-entry.mjs`, `local-era.mjs`, `local-keys.mjs`, `source-commit.mjs`, `source-platform.mjs`, `today-browser-entry.mjs`.

**2.2 `m3/w6/host/` - 7 to add, 5 standing.** S5 already declares `engine-runtime-host.cjs`, `workout-host.mjs`, `test/journey.test.mjs`, `test/engine-equivalence.test.cjs`, `test/local-real-day.test.mjs`. **`engine-runtime-host.cjs` is ALREADY declared** - the ticket lists it as a hole and it is not one; it is a `carried` re-pin, and the reviewer should be told rather than left to find the ticket wrong. Add role product: `plan-edit-host.mjs` (09-12, the third `:473` runtime file), `build-host.mjs`, `esbuild-probe.mjs`, `host-entry.mjs`, `index.html`. Add role test: `test/host-seams.test.mjs`, `test/journey-fixture.cjs`.

**2.3 `m4/import/` - 27, none declared.** Role product, 10: `production-mapping.cjs`, `measure-replay.cjs` (both 09-16, both named for S6 at `:477` and `:481`), `replay-core.cjs`, `browser-replay.mjs`, `engine-provider.cjs`, `local-source-order.cjs`, `local-source-profile.cjs` (09-15), `daily-history.cjs`, `prepare.cjs`, `reading-replay.cjs` (09-09, pre-dating the chain; see 2.5). Role test, 17 under `test/`: `production-mapping.test.cjs`, `production-admission.test.mjs`, `browser-parity.test.mjs`, `engine-provider.test.cjs`, `local-source-order.test.cjs`, `prepare.test.cjs`, `reading-replay.test.cjs`, harnesses `mutations.cjs` and `reading-replay-faults.cjs`, and the eight-file `test/s3/` harness (`browser-entry.mjs`, `current-head.cjs`, `engine.cjs`, `fixtures.mjs`, `harness.test.mjs`, `mutations.cjs`, `run.mjs`, `s3-portable-sources.json`). Retract has no module of its own: `:477` records it as three hunks inside `source-admission.mjs`, covered by 2.1.

**2.4 The rest.** `m4/workout/plan-edit-commands.cjs` and `plan-edit-model.cjs` (09-12), role product: the other two of `:473`'s three runtime files. `lanes/d/plan-edit/` 8, role test: `model.test.cjs`, `durable-host.test.mjs`, `browser-build.test.mjs`, `client-p6.test.cjs`, harnesses `model-mutants.cjs`, `host-mutants.mjs`, `astra-rerun.mjs`; plus `f2-tag-adapter.cjs` role **pinned-unchanged** (`:473`: a byte-identical copy of the published F2 adapter, imported by no runtime file, held only by a cell). Role test: `lanes/d/p3-replay-measure/{measure-family,measure-order}.test.mjs`, `lanes/d/import-retract/retract.test.mjs`, `lanes/d/p3-followons/admission-swap.test.mjs`, `m3/w7-preview/import/test/{live-clock,page-bundle,refusals}.test.mjs` and `import/test/support.mjs`. The Import SCREEN's own files (`import-screen.mjs`, its route/refusal/edge cells, `edge-route.mjs`) are on no pushed branch; section 6. Role product, `today/` unpinned, 3: `build.mjs`, `gym-app.mjs`, `problem-report.cjs`, all moved by `c-s6-small` and declared by no spec.

**NOT taken, named so the omission is a decision:** the other 39 undeclared files under `m3/w7-preview/today/` (`setup-*`, `food-*`, `sleep-*`, `checkin-*`, `gym-model.mjs`, `design.cjs`, `preview.css`, the two shells, and `test/catalogue.test.mjs` / `test/copy.test.mjs`, which the today step RUNS but no spec pins). `:455`'s phrase "sealed all product files under today/**" is true of the 15 S4 and S5 declare and of no more. That is a third custody hole, wider than `:473`'s, and S6 is not the package to close it: it would add 39 pins and a second review surface to a reseal already carrying 64. Recommend a separate PM ticket, TODAY-TREE-CUSTODY.

**2.5 Unsure - the author resolves each before the spec is written.**
1. `w6/host/index.html`, `w6/host/{build-host,esbuild-probe,host-entry}.mjs`, `w6/local/{build,host-browser-entry,today-browser-entry}.mjs`: build and dev-host glue, not code the phone runs. Product, or tooling outside the product map? I read them as product (they decide what the phone gets) but did not measure reachability.
2. `m4/import/{daily-history,prepare,reading-replay}.cjs` and their four test helpers (all 09-09, before the chain): still live, or M4 legacy nothing imports? If legacy, role pinned-unchanged, not product.
3. `m4/import/test/s3/` (8 files, one a `.json` fixture): declared whole, or only `harness.test.mjs` and the fixture?
4. `w6/local/local-keys.mjs`, `local-era.mjs`: not opened here. Declaring is byte-pinning and carries no value, but the author must confirm no path this spec declares resolves into `ledger/`, `rebuild/conform/private` or `src/history.js` before the spec is written. A pinned path is printed in CI.
5. `lanes/d/plan-edit/astra-rerun.mjs`: harness (test), or a one-off script that should not be pinned at all.
6. Whether `rebuild/lanes/d/**` belongs in a PRODUCT map at all. Every other lane's directory is undeclared. I declare these four because `:476` and `:481` order their suites enumerated in CI and a suite with a CI home and no pin can drift silently - but this is the first time a `lanes/` path becomes sealed product. PM's call, not the author's.

**2.6 One measured hazard.** `m4/import/production-mapping.cjs:199` is `const MAPPING_ID = 'earned/import/production-producer-mapping/' + ENGINE_REVISION;`, and `ENGINE_REVISION` is `M2-S5-TODAY-CHILD@0df73b01f3d2d935`. The reseal rotates it. The mapping id is not a comment: it is a field of the mapping the registry qualifies against, and `:480` records the Import screen PRINTING it to the athlete ("Checked against engine revision ..."). Before the coach constant moves, the author must prove with a cell that an import ADMITTED under the S5 mapping id still reads back and still qualifies once the id rotates, or state in the report that no stored record carries it. If a reseal can invalidate a previously admitted history, that is BLOCKING against the reseal, not against the mapping.

## 3. Children

The ten S5 children are re-pinned by name with needles RECOMPUTED on this head, never copied (`today-17` was `# pass 666`; three branches move cells): `today-17`, `measure-hermetic`, `s4-real-day`, `a0-journeys`, five `s5-sup-*`, `engine-files-differential`. The `s5-sup-*` files keep their names: a package does not rename its parent's evidence. S6's own six supersession children are `s6-sup-*`, new files in S5's shape (section 9's closing note).

New children, for suites that today run in NO workflow. Measured: `rebuild.yml` has exactly 12 `run:` steps and `shared-preflight.yml` one, and none names `rebuild/m4/import`, `rebuild/lanes/d/` or `rebuild/m3/w7-preview/import`. The ticket's "enumerated only in rebuild.yml" overstates it: these suites are enumerated nowhere.

| child | argv | why |
| --- | --- | --- |
| `d-plan-edit` | `lanes/d/plan-edit/{model.test.cjs,durable-host.test.mjs,browser-build.test.mjs,client-p6.test.cjs}` | `:473`'s 68/68 |
| `m4-import` | `m4/import/test/{prepare,reading-replay,engine-provider,local-source-order}.test.cjs`, `browser-parity.test.mjs` | the standing import lane |
| `m4-import-production` | `m4/import/test/{production-mapping.test.cjs,production-admission.test.mjs}` | `:477`, `:478` |
| `m4-import-s3` | `m4/import/test/s3/harness.test.mjs` | check `IMPORT_M4_DIR` first (`:459`) |
| `d-import-retract` | `lanes/d/import-retract/retract.test.mjs` | `:477` |
| `d-admission-swap` | `lanes/d/p3-followons/admission-swap.test.mjs` | `:478` Route 1 |
| `d-replay-measure` | `lanes/d/p3-replay-measure/{measure-family,measure-order}.test.mjs` | `:481` orders this by name |
| `w7-import` | `m3/w7-preview/import/test/{live-clock,page-bundle,refusals}.test.mjs` | `support.mjs` is a helper, not argv |
| `all-families` | PLACEHOLDER, argv unfilled | see below |

`edge-route.mjs` is **not** a CI child and is not enumerated in `rebuild.yml`: it needs `W6_BROWSER_BIN` and a real Edge, which no runner has. It is declared and pinned as product (role test), and the `w7-import` step carries a comment saying so, so that a file with no CI home is a file somebody decided about (`DECISIONS:186 (3)`).

**Named placeholder.** P3-REPLAY-ALL-FAMILIES is in flight (`:481`): F7's two MINORs (`read()` must require `schema_version === 2` as F4/F5 do; `owns()` over-claims the class) and the confirmed `earned/sleep-night/v1` hole. Its suites do not exist. The child `all-families` is named here and left unfilled in the spec until that ticket merges; if it has not merged when S6 is briefed for real, the child is DROPPED and this row becomes a carry, never a guessed argv.

**`CHILD_ROOTS` gains SIX directories** - the largest widening the list has had; S5 added one and disclosed it at length. It stands at eight, and every new child above is refused by `CHILD-ARGV-TARGET` (`b-package.cjs:483`) until its root is in it. The six: `rebuild/m4/import/test/` (which covers `test/s3/` by `startsWith`), `rebuild/lanes/d/plan-edit/`, `rebuild/lanes/d/p3-replay-measure/`, `rebuild/lanes/d/import-retract/`, `rebuild/lanes/d/p3-followons/`, `rebuild/m3/w7-preview/import/test/`. S5's `F7` cell pins `CHILD_ROOTS` by `deepEqual`; it takes the new list and its red side is re-run. The list stays fixed in the runner (W7) and unreachable by any spec, so a package still cannot name its own root.

## 4. Guards

**4.1 `CHILD_SPECS` gains `'S6'`.** Four cells carry a named const and take one literal each: `measure/test/boundary.test.mjs:83`, `today/test/food.test.mjs:792`, `today/test/machine-settings-ui.test.mjs:709`, `today/test/setup.test.mjs:2315` - all `['H3', 'S3', 'S4', 'S5']` becoming `['H3', 'S3', 'S4', 'S5', 'S6']`. The fifth is NOT the same edit and the ticket should not be read as if it were: `today/test/problem.test.mjs:1583` has no `CHILD_SPECS` const at all, but an inline `for (const id of ['S4', 'S3', 'H3'])`, youngest first, and **it never gained `'S5'`**. S5's brief explains why it was left (S5 moved no file it guards) and carried it. Its chain is now two generations stale, and S6 cannot leave it: `c-s6-small` moves `today-entry.mjs`, which the same cell hard-pins through `local-today-journey.test.mjs`. The edit: lift the array to a named `const CHILD_SPECS = ['H3','S3','S4','S5','S6']`, iterate youngest-first as the other four do, keep the red side. Anything less leaves a guard blind to two seals. Also carried: the dead exported `CHILD_SPECS` at `m3/w6/test/local-today-journey.test.mjs:670` (`['H3','S3','S4']`, no importer, `:459` MINOR) is DELETED by `c-s6-small` per `:476`; S6 re-pins the file at its post and states the deletion, it does not re-add it.

**4.2 The runner re-pin.** `b-s6-child-tail` moves `b-package.cjs`, so `tooling.runnerSha256` changes and every spec that pins it by sha is re-pinned onto the S6 runner: `H3.json`, `S3.json`, `S4.json` role `edited`; `S5.json` role `superseded-by-child`, the parent EXECUTION pin, exactly as S5 did to `S4.json` (S4-REVIEW-R1 finding 4: a spec on a moved runner stops at `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` before any evidence is read). `IDS` (`b-package.cjs:156`) and `NO_REGISTER_IDS` (`:260`) each gain `'S6'`; `S6` is an S- id, so the exemption-shape assertion passes without a PM by-name ruling. `pinned-unchanged-and-ruled-substitutions.test.cjs`: `F6` gains the `S6` literal in both pinned orders, `F7` takes the widened `CHILD_ROOTS`, `F8`/`F9` (the tail arrays and `TAIL_BYTES`) are re-pinned unchanged.

**`PUBLIC_TAIL_ROOTS` is a decision, not a re-pin.** `b-s6-child-tail` prints a failing child's last 60 lines only when every argv path lies under one of its four `PUBLIC_TAIL_ROOTS`. None of the six new child roots is in that list, so every new child above would fail with the tail WITHHELD (path policy) and the diagnostics ticket would not fire on the suites S6 adds. Widening it is a privacy-surface change, argued per root with `TAIL_DENYLIST` in hand, never bundled. Recommend: widen for `rebuild/lanes/d/p3-replay-measure/` and `rebuild/m3/w7-preview/import/test/` only (synthetic-only, and both inside the flake's blast radius), and state the other four as deliberately withheld.

**4.3 The standing step and the trip-wire sequence.** `rebuild.yml:127` `--ci --package S5` becomes `--ci --package S6` **only at the ff-merge of the child**. `DECISIONS:465-467`'s order, exactly: (1) the branch names `--package S6`; `rebuild/coach/test/engine-revision.test.cjs` reads that flag (`standingPackageShortId()`) and looks for `rebuild/lanes/b/tooling/receipts/S6.json`, absent until the seal, so the rebuild job is RED at C5 on both OS while `B PACKAGE S6 PUBLIC CI EVIDENCE PASS` prints on both - **that is the `:456` trip-wire working**, it was the single MAJOR of S5's Fable final, and the author report states it in advance. (2) The PM's authorized `--full` writes `SEALED RUN RECORDED receipts/S6.json`. (3) The coach constant becomes `ENGINE_REVISION = "M2-S6-TODAY-CHILD@<first 16 hex of sha256 over the raw bytes of receipts/S6.json>"` in `rebuild/coach/engine-revision.cjs` (S5 `0df73b01f3d2d935`, S4 `171ebcd4d4b3b2b4`), with the comment block's worked example updated too - the test does not read it, a human does. (4) Second authorized `--full`: `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY`. (5) CI green on both OS. THEN the fast-forward. Red for steps 1 to 3, green from 4; closed BEFORE the fast-forward, never after. `production-mapping.cjs` imports the same constant, so its suites move with it (2.6).

**4.4 The `executionId` tie (`:479` carry, Fable MINOR 3).** `production-mapping.cjs:229` is `id: executionId || (EXECUTION_ID_PREFIX + materialDigest)`. In the `{hash, executionId}` shape a caller may supply an id that does not name the digest the row is about and nothing refuses. S6 ties them: a supplied `executionId` must be the id bound to the REVIEWED digest for that `hash`, and one that disagrees with `EXECUTION_ID_PREFIX + materialDigest` for the same material refuses by a named code. Red side: the same call with a foreign id refuses; `{hash}` alone still binds at `qualify()` time and still derives nothing privately (`:478`).

## 5. The flow, in S5's order with S6's names

1. **Brief accepted by name** - a PM line naming `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md`.
2. **Three token lines on the tip**, in order: THEME `M2-S6-TODAY-CHILD`; BRIEF-BY-SHA with the sha256 of the accepted bytes and the byte count; GATE-SUPERSESSION in `:462`'s exact shape.
3. **The author cites all three in `packages/S6.json`** (`theme.acceptedLedgerLine`, `brief.acceptedLedgerLine`, `coverage.superseded.rulingLineSha256`), each a sha256 over the EXACT line bytes with no trailing newline, the method validated first against S5's own `:459`/`:460`/`:462` before it is trusted on S6's. A null `rulingLineSha256` is a HARD refusal: `supersessionRuling()` asserts it before coverage is printed, so the run stops at `GATE-SUPERSESSION-RULING-NOT-CITED` exit 1 and the theme and brief obligations are never reached. All three are PRECONDITIONS of the evidence, not obligations counted beside it.
4. **`--ci --package S6` prints `PUBLIC CI EVIDENCE PASS`**, the artifact re-proposed through the runner's own `proposed()` path, never hand-written.
5. **Fable final review** over the sealed candidate (`:439`), independent of the r1 reviewer, high effort.
6. **PM `--full` with the private census on the PC.** S5's shape at `:465`: `PRIVATE ORACLE PRESENT` verdict-only, `HISTORICAL TOTAL 45 laws`, `104/104 DETECTED`, `0 HARNESS_ERROR`, LEGACY gates OBSERVED, nine SUPERSEDED, `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation`, exit 2.
7. **The receipt line** (`POSTFIX-ACCEPTANCE M2-S6-TODAY-CHILD <commit> <artifact path> <sha256> ACCEPTED`) discharges that obligation.
8. **`rebuild/m4/spec/review-s6-today-child.json`**, `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}`, citing the receipt line.
9. **MERGE the tip into the reviewed head. NEVER rebase** (`:467` note 1): the receipt names the reviewed commit and a rebase rewrites it, which refuses `REVIEWED-COMMIT-NOT-BEHIND-HEAD`, correctly.
10. **Authorized `--full`**: `AUTHORIZED mode=--full`, `ENVELOPE AUTHORIZED`, `PARENT PINS RE-ASSERTED`, `SEALED RUN RECORDED receipts/S6.json`, `POSTFIX PACKAGE PASS M2-S6-TODAY-CHILD` exit 0; `VERDICT-S6.md` names the receipt sha.
11. **The coach constant** (4.3 step 3). 12. **Second authorized `--full`: `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY`** - artifact, runner, spec and every pinned file byte-identical to the sealed run, receipt bytes in Git at every base checked, exit 0. 13. **CI green on both OS.** 14. **Fast-forward.**

## 6. Open inputs

| branch | head today | adds to the declaration list | state |
| --- | --- | --- | --- |
| `rebuild/c-s6-small` | `6fad3472` | moves 5 S5-pinned (`today-app.cjs`, `today-entry.mjs`, `today/test/problem.test.mjs`, `w6/test/local-today-journey.test.mjs`, `w6/host/test/local-real-day.test.mjs`) to new posts; adds 3 product (`today/build.mjs`, `gym-app.mjs`, `problem-report.cjs`) | ACCEPTED r3 (`:476` (2)); frozen, safe to pin |
| `rebuild/b-s6-child-tail` | `d1001da9` | moves 2 S5-pinned (`b-package.cjs`, `pinned-unchanged-and-ruled-substitutions.test.cjs`); adds 1 test (`tooling/test/child-diagnostic-tail.test.cjs`); MOVES THE RUNNER SHA | ACCEPTED r5 (`:476` (3)); frozen |
| `rebuild/c-p3-import-ui-2` | **not on `origin`** | `:480`: 18 files, 5 S5-pinned incl. `today-app.cjs`, `today-entry.mjs`, `today/test/package.test.cjs`; new `w7-preview/import/import-screen.mjs`, route/refusal/edge cells, `edge-route.mjs` | round 4 IN FLIGHT; Fable r3 REJECT, 2 MAJOR |
| P3-REPLAY-ALL-FAMILIES | no named branch yet | F7 `schema_version`/`owns()` MINORs; the `earned/sleep-night/v1` family | in flight (`:481`) |

**FINAL LIST WAITS ON P3-IMPORT-UI-2 round 4 AND P3-REPLAY-ALL-FAMILIES.** Neither is on `origin`, so their paths cannot be walked and their post-images cannot be measured. Two consequences the PM should accept explicitly: the 64 counted here is a FLOOR, and this list is not the list the spec will carry. Either S6 is briefed for real only after both merge, or S6 ships without them and a seventh package follows - which re-opens the same hole for the Import screen the day it lands. Recommendation: wait. `c-s6-small` and `b-s6-child-tail` are frozen and lose nothing by it.

## 7. The known CI flake, and how it is to be closed

`:481` records it for the fourth time in the class and the second in these exact cells: on `windows-latest` the today+measure suite goes red about one run in three, always in `rebuild/m3/w7-preview/measure/test/journey.test.mjs`, always in **`P-MEASURE (a) - the real route renders the trial table week by week, against the committed table`** (line 41) and **`P-MEASURE (d) - the export block text equals the rendered table, cell for cell`** (line 66), never in `(e)`. Symptom: an 80 s render, then a null element. `ubuntu` green; the same head passes 666/666 on the PC; a retrigger passes. `:467` note 2 already made this a ticket once and it was answered with diagnostics, not a cause.

**S6 must find the cause and fix it inside the reseal.** Widening a timeout alone is refused as a fix: it turns a race into a slower race and the next occurrence is un-diagnosable again.

The lead, measured here and handed over rather than asserted. `measure/test/support.mjs:157` is `export const settle = async (rounds = 24) => { for (...) await new Promise(r => setTimeout(r, 0)); }` - a FIXED 24-turn macrotask drain with no condition attached. Every mount, every `view.go(slot)` and `pickMarkersOnScreen` ends in it; `go` then does `pick(slot).click()`, and `tableOf` returns `null` when `pick(slot)` misses. So when the real `fake-indexeddb` plus `webcrypto` work behind a route change outlasts 24 turns on a cold or loaded Windows runner, the next line dereferences null or the assert reads `no trial table rendered`. Both reported symptoms fall out of that one line. Second half: `journey.test.mjs:17` memoises ONE `trialDevice()` promise for the file, so `(d)` runs `onMeasure()` over the store `(a)` wrote and branches on `view.pick('measure-marker-pick')`; it inherits whatever `(a)` left half-drained. That is why the two fail together and `(e)` does not.

Required shape of the fix: `settle` becomes a CONDITION with a bounded deadline - poll until the awaited slot exists or the store's pending work drains, and FAIL LOUDLY with the slot name and the elapsed time when the deadline passes; `go()` asserts the target slot exists before it clicks. No cell's subject changes and no assertion is removed. The author reproduces the red on purpose (drop the deadline, or throttle the fake store) before claiming the fix, and records the reproduction in the report.

## 8. The bar

S5's twelve rows are carried unchanged and re-asked of S6 (pins byte-identical to the accepted bytes; no product byte of S6's own; no engine byte; five carriers refused ON THIS TREE and executed; the evidence can FAIL; refusals inherited, not caused here; each carrier's evidence its OWN; the suites green; the pins declared; nothing weakened). Added, one per new declaration class plus the real-world rows of `:439`:

| # | The claim | How it is measured |
| --- | --- | --- |
| 13 | Every file the three branches move is DECLARED at its landed post | the inventory; `git diff` of each declared path against that branch's head is empty |
| 14 | The `w6/local` and `w6/host` classes are closed | all 13 and all 12 declared; `engine-runtime-host.cjs` shown ALREADY carried, not newly added |
| 15 | The `m4/import` class is closed | all 27 declared; `production-mapping.cjs` and `measure-replay.cjs` named in the verdict line |
| 16 | The `plan-edit` class is closed | the three `:473` runtime files and the eight lane suites; `f2-tag-adapter.cjs` proved imported by no runtime file |
| 17 | The `w7-preview/import` class is closed | all four tip files plus round 4's; `edge-route.mjs` pinned and stated as having no CI home |
| 18 | Every new child EXECUTES and its count is its own | one child per new root, each needle `# pass N` measured on this head, not copied |
| 19 | `CHILD_ROOTS` cannot be widened unseen | `F7` amended over the six added roots, red side re-run |
| 20 | `PUBLIC_TAIL_ROOTS` was decided, not drifted | the two widened roots argued by name; the four withheld stated |
| 21 | The trip-wire went red and closed BEFORE the fast-forward | the CI run at the `--package S6` commit quoted red at C5, the run at the constant commit quoted green |
| 22 | A reseal cannot invalidate an admitted import | 2.6's cell, or the report's statement that no stored record carries `MAPPING_ID` |
| 23 | `executionId` cannot name material it is not about | the `:479` cell, red side a foreign id |
| 24 | The flake has a named cause and a red-first fix | section 7: reproduction, then fix, then 20 consecutive green runs of `(a)` and `(d)` on `windows-latest` |
| 25 | Real-world invariants (`:439`) | `c-s6-small`'s athlete-facing claims re-proved on the REAL route: setup-first on a fresh install, the sample label absent on every enrolled frame, the refusal card naming the session in hand, `Build <sha>` in the footer |
| 26 | Stub-free cells (`:439`) | every bar item proven by a cell that mounts the real route over `fake-indexeddb` with real ops and asserts rendered text; no fixture-only pass counted |

## 9. The exact commands the PM runs to accept this brief and mint the token lines

S5's pattern (`:459`, `:460`, `:461`), on the chain branch, in this order. The acceptance-by-name line is appended first; the sha in the second is measured from the bytes that line accepts, so the file must not move between the two.

1. `cd /d <worktree> && git checkout rebuild/t2-client-core && git pull --ff-only`
2. Append the ACCEPTED-BY-NAME line, then the THEME line; commit.
3. Measure the brief on that commit:

```
node -e "const f=require('fs'),c=require('crypto');const b=f.readFileSync('rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md');console.log(c.createHash('sha256').update(b).digest('hex'),b.length)"
```

4. Append the BRIEF-BY-SHA line with that sha256 and byte count, then the GATE-SUPERSESSION line; commit and push.
5. Hand the author the three line NUMBERS. Each citation is sha256 over the exact line bytes, no trailing newline, and the method is validated against S5's `:459`/`:460`/`:462` values before it is used on S6's:

```
node -e "const f=require('fs'),c=require('crypto');const n=Number(process.argv[1]);const L=f.readFileSync('rebuild/DECISIONS.md','utf8').split('\n')[n-1];console.log(c.createHash('sha256').update(Buffer.from(L,'utf8')).digest('hex'))" <line>
```

The three lines, in S5's exact shapes; the date, the sha256 and `<N>` are placeholders the PM substitutes:

```
- <date> · cowork · THEME M2-S6-TODAY-CHILD - the reseal child that closes the DECISIONS:473 custody hole and re-pins today/** over the accepted bytes of rebuild/c-s6-small, rebuild/b-s6-child-tail and P3-IMPORT-UI-2: it declares as its own product the <N> merged-but-undeclared files under rebuild/m3/w6/local, rebuild/m3/w6/host, rebuild/m4/import, rebuild/m4/workout/plan-edit-*.cjs, rebuild/lanes/d and rebuild/m3/w7-preview/import, gives their suites a CI home in rebuild.yml as a disclosed hunk (DECISIONS:117 (4)), and has NO product behaviour of its own. Standing ruling DECISIONS:455; custody ruling DECISIONS:473. Its behaviour/delta contract is rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md; its parent is M2-S5-TODAY-CHILD, rebuild/m4/spec/acceptance-s5-today-child.json sha256 84e3430ddd851965d630cecffe4bf7ead88ec10ed53635c503671fd616c1169e (receipt DECISIONS:466, merge :467); it changes no rebuild/engine byte, and as a third-generation descendant of M2-S3-COMPANION it retires the same nine byte-identity gates again under its own token line below. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself · ACCEPTED
```

```
- <date> · cowork · BRIEF ACCEPTED BY SHA for M2-S6-TODAY-CHILD: rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md, sha256 <64-hex, the accepted bytes of this file> (<n> bytes), is the brief of record; this line carries the binding sha256 and is the citation brief.acceptedLedgerLine cites · ACCEPTED
```

```
- <date> · cowork (PM) · GATE-SUPERSESSION M2-S6-TODAY-CHILD source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate · the token clause for DECISIONS:153, same conditions (i)-(iii), for the child of M2-S5-TODAY-CHILD (grandchild of M2-S4-REAL-DAY, great-grandchild of M2-S3-COMPANION); the child changes no rebuild/engine byte and retires the parent's retired gates again under this line and its own evidence - the five carriers cover the nine gates merge-source, migrate-source, writers-source, migrate-differential, witnesses-2, witnesses-5, witnesses-7, writers-differential and second-gate · RULED
```

The third line must END in `RULED`, and its token clause must be exactly `GATE-SUPERSESSION M2-S6-TODAY-CHILD source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate` - any bracket, quote, backtick or extra word inside that clause leaves it something other than the token and frees nothing. A retirement is never inherited: S6 asks every condition of `DECISIONS:153` again and answers with its own six red-first `s6-sup-*` children in S5's shape, because `constants.cjs`, `writers.cjs`, `merge.cjs` and `today.cjs` stand outside the carriers' reconstruction and no descendant of M2-S3-COMPANION can carry them.
