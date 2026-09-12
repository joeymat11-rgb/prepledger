# BUILD REPORT — M2-H3-CLEAN-INIT (v1.1, the `:135 (5)` bundle)

Branch `rebuild/lane-b-h3`, `sourceBase` `ce38aa3` (B-NTC integrated, ledger `:144`). Parent: the sealed B-NTC artifact `87f4848c…` at `9ad2ecab`, receipt `:141`. Merged in: `origin/rebuild/t2-client-core` (`ce38aa3`/`7f35e90`) and `rebuild/lane-b-tooling` `b46b5fd` (runner **review-pending, r8**). Brief `rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md`, 126 lines. `git diff --check` clean; UTF-8, no BOM, LF.

## What the package carries

**H3** — `createCleanInitState` writes `blackout: {until: <day before split.from>}` and `model: {anchorISO: split.from, drip: null, src: null}`, both pinned by `closed()`; `model.lean` deliberately absent (F-A accepted as built at `:142 (3)`). **F-B** (S2) — `writers.cjs` `applyRead` gains a first-read branch seeding the trend with **the reading itself**, verbatim; needs no owner ruling (it invents nothing and writes only the number he typed — brief §4). **F2 LABEL half** — `MG_LABEL` gains the four BACK region heads. **`rebuild.yml`** enumerates `setup.test.mjs` per `:142 (2)(b)`.

| File | Role | sha256 `ce38aa3` → HEAD |
| --- | --- | --- |
| `rebuild/m4/workout/athlete-state.cjs` | new to the pinned inventory | `dccc5fb5…` → `cdf51db8…` |
| `rebuild/engine/writers.cjs` | edited (F-B) | `00291236…` → `b57b8f8e…` |
| `rebuild/engine/constants.cjs` | edited (F2 LABEL) | `954e4f4b…` → `e387579f…` |
| `.github/workflows/rebuild.yml` | edited | `839a79ab…` → `cf4b83c1…` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | edited (the A0 cell that asserted the defect) | `228c076d…` → `aecb8fe4…` |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | new to the inventory (lane C's H3 cell flips) | `264358a0…` → `842e2f49…` |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | new | absent → `62f6651f…` |
| `b-package.cjs`, `packages/B-NTC.json` | superseded-by-child | parent execution pins |

## Cells, mutants, unmoved

`node --test --test-reporter=tap rebuild/m4/workout/test/h3-clean-init.test.cjs` → **11/11, exit 0**. RED-first: **6/7** against the parent's `athlete-state.cjs`; **4/4** of the new F-B/F2 cells (H3/8–11) against the parent's engine files. Six named mutants, each killed by a named cell.

| Suite | Parent | H3 |
| --- | --- | --- |
| the **eight** enumerated today files | 268/268 | **268/268 exit 0** (`setup.test.mjs` **104/104**) |
| A0 `journey` + `engine-equivalence` | 23/23 | **23/23 exit 0** |
| provider `native-trend-context` | 39/39 | **39/39 exit 0** |
| `local-host-journey` + `local-today-journey` | 68/68 | **68/68 exit 0** |
| `copy.test.mjs` | 36/36 | **36/36 exit 0** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate` | **identical line, exit 1** |
| B-NTC's own carriers | green | **refuse — F-C** |

**Public census byte-identical, proven:** `rebuild/conform/run.cjs` run on the tree as it stands and again with `writers.cjs`, `constants.cjs` and `athlete-state.cjs` held out — two 81-line logs, same sha256 `401706332af64b5cd2a78aae173b943f95aefc5b71a9897356a44ef7f6b55b5a`, 21,338 bytes each.

## The runner

    $ node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3
    B PACKAGE H3 SPEC OBSERVED packages/H3.json 34dac072…; runner 769fd09e… byte-identical
    B PACKAGE H3 PARENT BOUND B-NTC …87f4848c…; single-parent chain holds
    B PACKAGE H3 POSTFIX M2-H3-CLEAN-INIT REVIEW-PENDING mode=--ci
    B PACKAGE H3 ENVELOPE ABSENT; …acceptance-h3-clean-init.json is not sealed yet
    B PACKAGE H3 FAIL PARENT-PIN-BROKEN-AT-SOURCEBASE                         exit 1

`--full` stops at the same code. F-D is gone (the merged runner admits `H3`) and the parent now BINDS. What refuses is **F-E, new and not H3's**: the artifact writer emits `product` as `{pre,post,role}` while `held()` (`b-package.cjs:1067`) reads it as a flat sha — so `pins()` refuses on the first entry, `rebuild/engine/plan.cjs`, whose bytes are in fact identical everywhere. The same assumption appears again in the product pre-image check. **It blocks every child of B-NTC, not just H3.**

**REHEARSAL** (probe *copy* of the runner, never the runner; uncommitted, removed). With those two readers normalised, the same committed spec runs straight through: `PARENT PINS RE-ASSERTED … 53 product pins`; `PRODUCT IMPLEMENTED; 9 at the declared post-image / 0 at the pinned pre-image / 49 carried byte-identical / 0 unlisted drift`; `AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 … at the parent receipt base`; `LAWS 45/45 executed`, `45 RED-frozen · 39 RED-candidate`; and stops at **F-C**'s `Required child source-carriers` and nothing else.

## OPEN

* **F-C — granted at `:142`, not declarable.** The runner's successor path is hard-coded to B-NTC-as-child: `SUCCESSOR_PACKAGES = new Set(['B-NTC'])` (`:156`), `SUCCESSOR_PARENT_COMMIT` (`:163`) and `SUCCESSOR_WRAPPER` (`:167`) are constants, and a substitution target must match `rebuild/m4/spec/*.cjs`. A `coverage.successors` block refuses `SUCCESSOR-PACKAGE-NOT-RULED H3`. Tooling: admit `H3` and take the parent commit/wrapper from the bound artifact. The substitution H3 will enumerate verbatim is in brief §9; note the scope is now three pinned files (`journey.test.mjs`, `writers.cjs`, `constants.cjs`), so all five carriers refuse until it exists.
* **F-E — new tooling blocker** (above). Fix the writer or both readers, together.
* **F-D — closed but REVIEW-PENDING**: the runner this `--ci` stands on is `b46b5fd`, under blind review r8.
* **The two ledger lines**, per `:135 (2)`, appended by the lane once the PM accepts the brief BY NAME: a **THEME** line naming `M2-H3-CLEAN-INIT` and this brief path, and a **BRIEF-BY-SHA** line citing the brief by sha256 and ending in `ACCEPTED`, both in the `:122`/`:126` shape with the lineSha in the STATUS line. Until they stand on `origin/rebuild/t2-client-core`, `brief.acceptedLedgerLine` is `null` and `status` stays `PROPOSED`.
* **F2 wording** — the leg/arm/core names the bundle lists are already `mg` labels that render identically and would break lane C's accepted cell 2.8 row 2; only the four BACK heads are added. Brief §5 states the disagreement and what would change lane B's mind.

## Commits — author `lane-b-builder-h3 <builder-h3@earned.local>`, not pushed

`13f6639` merge the integrated B-NTC tip · `c3aae8f` merge the r7/r8 tooling runner · `98cbc5e` F-B, F2 LABEL, `setup.test.mjs` in CI, spec rebuilt on the merged parent · this brief v1.1 and report.
