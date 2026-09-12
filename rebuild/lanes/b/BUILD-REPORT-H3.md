# BUILD REPORT — M2-H3-CLEAN-INIT (v1.2, the `:135 (5)` bundle)

Branch `rebuild/lane-b-h3`, `sourceBase` `ce38aa3` (B-NTC integrated, ledger `:144`). Parent: the sealed B-NTC artifact `87f4848c…`, acceptance commit `9ad2ecab…`, receipt `:141`. Merged in: `origin/rebuild/t2-client-core` (`ce38aa3`/`7f35e90`) and `rebuild/lane-b-tooling` **`45e5110`**, runner **`1a3d395d80fcdc9c1ccc3a85f118a8feaa2a314d1553d3420dc864d67e66cd00`** (r8 ACCEPT WITH CHANGES applied), re-pinned as `tooling.runnerSha256`. Brief v1.2, 125 lines. `git diff --check` clean; UTF-8, no BOM, LF.

## What the package carries

**H3** — `createCleanInitState` writes `blackout: {until: <day before split.from>}` and `model: {anchorISO: split.from, drip: null, src: null}`, both pinned by `closed()`; `model.lean` deliberately absent (F-A accepted as built). **F-B** (S2) — `writers.cjs` `applyRead` gains a first-read branch seeding the trend with **the reading itself**, verbatim; needs no owner ruling (brief §4). **F2 LABEL half** — `MG_LABEL` gains the four BACK region heads. **`rebuild.yml`** enumerates `setup.test.mjs` per `:142 (2)(b)`.

Hunks, sha256 `ce38aa3` → HEAD: `athlete-state.cjs` `dccc5fb5…`→`cdf51db8…` (new to the inventory) · `writers.cjs` `00291236…`→`b57b8f8e…` (edited) · `constants.cjs` `954e4f4b…`→`e387579f…` (edited) · `rebuild.yml` `839a79ab…`→`cf4b83c1…` (edited) · `journey.test.mjs` `228c076d…`→`aecb8fe4…` (edited) · `setup.test.mjs` `264358a0…`→`842e2f49…` (new to the inventory; lane C's H3 cell flips) · `h3-clean-init.test.cjs` absent→`62f6651f…` (new) · `b-package.cjs` + `packages/B-NTC.json` superseded-by-child.

## Counts

Cells **11/11, exit 0**. RED-first: **6/7** against the parent's `athlete-state.cjs`; **4/4** of the F-B/F2 cells (H3/8–11) against the parent's engine files. Six mutants, each killed by a named cell.

| Suite | H3 |
| --- | --- |
| the eight enumerated today files | **268/268 exit 0** (`setup.test.mjs` **104/104**) |
| A0 `journey` + `engine-equivalence` | **23/23 exit 0** |
| provider `native-trend-context` | **39/39 exit 0** |
| `local-host-journey` + `local-today-journey` | **68/68 exit 0** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate`, exit 1 — **unmoved** |

**Public census byte-identical, proven:** `rebuild/conform/run.cjs` on the tree as it stands and again with `writers.cjs`, `constants.cjs` and `athlete-state.cjs` held out — two 81-line logs, same sha256 `401706332af64b5cd2a78aae173b943f95aefc5b71a9897356a44ef7f6b55b5a`, 21,338 B each.

## `--ci --package H3` — every line

    B PACKAGE H3 SPEC OBSERVED packages/H3.json d3fd0e3c…; runner 1a3d395d… byte-identical
    B PACKAGE H3 PARENT OPTION B-NTC …87f4848c… ACCEPTED
    B PACKAGE H3 PARENT BOUND B-NTC …; single-parent chain holds
    B PACKAGE H3 POSTFIX M2-H3-CLEAN-INIT REVIEW-PENDING mode=--ci
    B PACKAGE H3 ENVELOPE ABSENT; …acceptance-h3-clean-init.json is not sealed yet
    B PACKAGE H3 PARENT PINS RE-ASSERTED at run time; 1 pin + its 53 product pins, 29 un-superseded
    B PACKAGE H3 PRODUCT IMPLEMENTED; 9 at the declared post-image / 0 at the pinned pre-image /
      49 carried byte-identical from the parent / 0 declared role "pinned-unchanged"
    B PACKAGE H3 FIDELITY OBSERVED; sourceBase ce38aa3 ancestor of HEAD f7e0007; 18 file(s)
      changed since sourceBase, all in the fixed inventory
    B PACKAGE H3 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 …
    B PACKAGE H3 PROTECTED SURFACES 2 declared …   |   PRIVATE LIVE-TRIGGERED none
    B PACKAGE H3 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate …
    B PACKAGE H3 LAWS DECLARED-STATE 45/45 rows agree … this package declares NO D-id
    B PACKAGE H3 CARRIERS NONE DECLARED; 0 witness flip(s) declared
    B PACKAGE H3 FAIL; required evidence missing or failed; local diagnostics withheld   exit 1

**F-D and F-E are closed** by the r8 runner — the parent binds, all 53 product pins re-assert, and the run reaches `LAWS 45/45`. `--full` fails at the same point and therefore never reaches the BLOCKED line. The single refusal is the unnamed `Required child source-carriers`, i.e. **F-C**.

## OPEN

* **F-C — the grant's support file does not reach the gates that refuse.** `successorGates()` (`b-package.cjs:525`) admits a gate only if the carrier's own source closure contains the support path as a literal. `:142` names `rebuild/m3/w6/host/test/journey.test.mjs`; measured over the real closures, that path is reached by **`b-ntc-journeys.cjs` only**, and `durable-journeys` is not one of the parent's nine `byChild` gates — so the grant admits **no gate**. What refuses all five inherited carriers is `Unlisted parent pin drift rebuild/engine/writers.cjs`, and `rebuild/engine/writers.cjs` **is** in all five closures. `:142`'s F-C was written before `:135 (5)` bundled F-B and F2 in, and those are what move that engine file. **The grant needs one more sentence naming `rebuild/engine/writers.cjs` (and `constants.cjs`) as support paths.** `coverage.successors` stays `null` until then. Lane B took neither shortcut: it did not edit the runner, and it did not rewrite `packages/B-NTC.json`'s posts to its own bytes (that file is a parent execution pin; B-NTC never produced those bytes).
* **Seal on the tip (`:135 (4)`, `SEAL_TIP_RULE = 'first-parent'`)** — measured, since the check lives at the seal and no run reaches it here: tip `ce38aa3` **is an ancestor of HEAD `f7e0007`** and **is NOT in HEAD's first-parent chain** (1447 commits), because it was merged `--no-ff` as the second parent. Under `'first-parent'` the seal refuses; under `'ancestor'` it passes. **Not rebased**, per instruction.
* **The two ledger lines** (`:135 (2)`, appended by the lane once the PM accepts the brief BY NAME): a **THEME** line naming `M2-H3-CLEAN-INIT` and the brief path, and a **BRIEF-BY-SHA** line citing the brief by sha256 and ending in `ACCEPTED`, both in the `:122`/`:126` shape with the lineSha in the STATUS line. Until they stand on the chain branch, `brief.acceptedLedgerLine` is `null` and `status` stays `PROPOSED`.
* **F2 wording** — only the four BACK heads are added; the leg/arm/core names the bundle lists are already `mg` labels that render identically and would break lane C's accepted cell 2.8 row 2. Brief §5.

## Commits — author `lane-b-builder-h3 <builder-h3@earned.local>`, not pushed

`13f6639` merge the integrated B-NTC tip · `c3aae8f` merge the r7/r8 tooling runner · `98cbc5e` F-B, F2 LABEL, `setup.test.mjs` in CI · `1cc8148` brief v1.1 + report · merge `45e5110` (r8 runner) · re-pin `runnerSha256` · this brief v1.2 and report.
