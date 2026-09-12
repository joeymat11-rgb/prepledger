# BRIEF — M2-H3-CLEAN-INIT · v1.2 (lane B, child of M2-B-NTC)

**The bundle.** `DECISIONS:124` ruled H3: `createCleanInitState` wrote neither `blackout` nor `model`, so the accepted engine **threw** for a brand-new athlete and Today stood on the preview's sample athlete (S2). `DECISIONS:142` then judged H3's own findings and `:135 (5)` bundled F2's LABEL half into the same seal. This package therefore carries FOUR things: **H3** (the two members), **F-B** (an S2 blocker of its own: the first weigh-in must not make the trend NaN), **F2 LABEL** (`MG_LABEL` region heads), and the **`rebuild.yml` enumeration of `setup.test.mjs`** that `:142 (2)` option (b) rides on H3's seal. Parent: the sealed and INTEGRATED B-NTC artifact `87f4848c…` at `9ad2ecab`, receipt `:141`, integrated at `ce38aa3` (ledger `:144`). `sourceBase` is `ce38aa3`.

## 1 · READ-LIST

`DECISIONS:124` (the H3 ruling) · `:142` (F-A accepted as built; F-B inside H3; F-C granted in the `:113` shape; F-D is tooling; `setup.test.mjs` rides H3) · `:135 (5)` (the bundle) and `:135 (2)` (the lane appends its own theme/brief citation lines) · `:113 (1)` (the successor conditions a–e) · `rebuild/lanes/REQUESTS.md` 2026-09-11 20:45 ET (lane C's finding, with the throw sites) · `rebuild/m3/w7-preview/today/test/setup.test.mjs` (lane C's red-first H3 cell, S3, and provenance 2.8 row 2) · `rebuild/m4/workout/athlete-state.cjs` · `rebuild/engine/{energy,sleep,writers,today,dates,seed,constants,volume}.cjs` · `rebuild/m3/w7-preview/today/setup-model.mjs` (what the setup document collects; `REFUSAL_SENTENCES`; `MG_LABELS`) · `rebuild/lanes/b/tooling/README.md` + `packages/{H3,B-NTC}.json` · `BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` §1–§6 · `PLAN-TRACK-B-PACKAGES-v1.md` §3.

## 2 · TRACE — every engine reader of `s.blackout` / `s.model` (32 hits, all listed)

| Reader | Member | Guard | On a clean-init state |
| --- | --- | --- | --- |
| `energy.cjs:370` `observedTDEE` | `blackout.until` | **none** | **threw** — the first throw |
| `sleep.cjs:358`, `:1913`; `writers.cjs:427`, `:917`, `:1694` | `blackout.until` | **none** | would throw |
| `sleep.cjs:1879` `dayWeather` | `blackout.until` | `s.blackout &&` | **`iso <= until`, INCLUSIVE** — §3 |
| `today.cjs:228`, `:282`, `:409` | `blackout.until` | yes | quiet |
| `energy.cjs:84` `bfEst` | `model.anchorISO` | **none** | **threw** — the second throw |
| `energy.cjs:86`, `:92`, `:93` | `model.lean` | **none** | arithmetic — §3 |
| `energy.cjs:90`, `:95`, `:96`, `:109`, `:113` | `model.src` | none | `=== "DEXA"` only, never throws |
| `energy.cjs:962` | `model.src` | `try`+`&&` | quiet |
| `energy.cjs:21` `dripOf` | `model.drip` | `d == null` → `DRIP_DEFAULT` | quiet |
| `energy.cjs:286`, `:302`; `sleep.cjs:674` | `model.drip` | none | unreachable with no snapshots |
| `dates.cjs:8` `mk` | via `daysUntil(undefined)` | — | `undefined.split` — why `blackout:{}` is no fix |
| `migrate.cjs:531`, `:538`, `:540`, `:661` | both | — | migration only; clean-init is never migrated |

`bfEst` reads exactly four members: `anchorISO`, `lean`, `src`, `drip`.

## 3 · H3 — THE MEMBER SET, AND EVERY VALUE'S DERIVATION

`REQUIRED_SETUP` is `athlete_label, split, exercises, priority_muscles` — **no bodyweight, no body-fat reading** (checked against lane C's own `setup-model.mjs`). `split.from` is the athlete's setup date and is the only value H3 derives anything from. Nothing comes from `seed.cjs:70/:78` (`lean 139.7`, `anchorISO "2026-07-21"`, `src "coach's eye"`, `SEAL_UNTIL`) — the H1 rule, executed both ways by H3/2.

    blackout: { until: <the day BEFORE split.from> }
    model:    { anchorISO: split.from, drip: null, src: null }

* **`until` = the day before, not the setup date.** Nine of ten readers ask `daysUntil(until) > 0` (`dates.cjs:17`; on the day itself that is `0`), so either choice leaves no blackout in force. The tenth does not: `sleep.cjs:1879` is **inclusive**, and with `until = split.from` the first weigh-in comes back `dayWeather(split.from).flags = [{k:"sealwater", why:"scale carries event water — sealed window"}], noisy: true` — **measured**. One day earlier and the window is empty for every day he can ever have. Pure UTC arithmetic; the module still has no clock.
* **`anchorISO` = `split.from`**; **`drip` = `null`**, the member's own documented absence (`dripOf` tests `d == null` and uses the engine's own `DRIP_DEFAULT`, `constants.cjs:68`, `0.0`); **`src` = `null`**, since every reader compares `=== "DEXA"`.
* **`lean` is DELIBERATELY NOT WRITTEN** — `:142 (3)` accepts F-A as built. Both candidates were driven through the real screen:

| `model.lean` | `bfEst` | `proteinTarget` | `today-app.cjs:209` `Number.isFinite(g)` | Screen |
| --- | --- | --- | --- | --- |
| `null` | `lean: 0` (null coerces) | `g: 0, ffmKg: 0` | **true** | **"0 g protein"** |
| absent | non-finite | `g: NaN` | false | **"Not available yet"** |

With a bodyweight on file `null` is worse: `pct = ((trend-0)/trend)*100` = **100.0 % body fat**. `NaN` is no third option — `applyRead` round-trips through `JSON.parse(JSON.stringify(…))`, turning `NaN` into `null`, i.e. into the `0` above.

**The two `closed()` codes are `STATE_BLACKOUT_MEMBER_SET` / `STATE_MODEL_MEMBER_SET`, deliberately NOT `CLEAN_INIT_*`.** That prefix is the athlete-facing refusal vocabulary: lane C's `setup.test.mjs` S3 asserts every `CLEAN_INIT_*` code this module can throw has a screen sentence and that the table names **exactly** those codes. These two are builder-side invariants over the module's own literals — no setup document any screen can produce reaches them — so minting `CLEAN_INIT_*` codes would have forced lane C to write screen copy for something no athlete can cause. Renaming them keeps S3 green with no edit to lane C's model.

## 4 · F-B — THE FIRST WEIGH-IN (`DECISIONS:142 (3)`, S2)

`rebuild/engine/writers.cjs` `applyRead` had **no first-read branch**: `s.trend = +(s.trend + 0.3 * dCl).toFixed(1)`. Every state it was built for arrived with a `trend` (seed, or migrate walking one forward). A clean-init athlete has none and must not, so his first weigh-in made `trend` **NaN** and every figure downstream stayed non-finite for good — the owner's own first weigh-in on 09-13 included.

**The rule, and it needs no owner ruling.** The seed is **the reading itself**: `if (first) s.trend = w;`. It invents nothing, it chooses nothing between alternatives that differ in what they claim about him, and the only number written is the one he typed. It is taken **verbatim rather than rounded**, because rounding would already be changing what he typed; from the second reading on the accepted 1-dp EMA is untouched. `first` is `!Number.isFinite(s.trend)`, so **every state that already carries a trend takes exactly the accepted path** — that is why the 45 laws and the census do not move. The branch runs before the sealed / off-window test: those govern how a reading MOVES an existing trend, not whether a level exists at all. `pt` on that first row is `null`, not `undefined`, because `undefined` would be dropped by the writer's own JSON round trip.

**What the chain reads before a second reading exists** (cell H3/9, all measured): `trend` = the reading · `reads[0].pt` = `null` · `reads[0].note` = `""` (no spike, seal or noise claim against nothing) · `weekly` = `[]` — one reading is not a week · `currentRate.measured` = `false`, `n` = 0 · `latestRead`/`morningRead` = the reading · and **F-A still holds**: `proteinTarget.g`/`bf`/`ffmKg` all non-finite, the protein slots still read "Not available yet". Every digit on the screen is his date, his lift count, or the number he put on the scale. **No invented figure reaches Today.**

## 5 · F2, LABEL HALF (`DECISIONS:135 (5)`) — AND THE ONE PLACE THE BUNDLE AND THE TREE DISAGREE

`volume.cjs:74` buckets a lift by `e.head || e.mg`; `volume.cjs:32` renders the bucket with `MG_LABEL[k] || k`. A REGION HEAD needs an entry or it prints its key; a bare muscle label does not, because there the key IS the word. Added, keyed `<muscle>_<head>` exactly as the three delt heads already are:

    back_lats: "lats" · back_upper: "upper back" · back_traps: "traps" · back_lower: "lower back"

**The leg, arm and core names the bundle also lists are NOT added, and this is a disagreement the PM should see.** They are already the engine's own `mg` labels (`seed.cjs` `mg` values; `setup-model.mjs:26` `MG_LABELS`), so `|| k` renders each of them identically today — an entry would change **no character on any screen**. It would also break lane C's accepted provenance cell `setup.test.mjs` 2.8 row 2, which asserts the engine has no gloss table for the labels first-run collects. Cell H3/11 asserts lane C's own predicate directly so the two cannot drift. If the PM meant those names as *new head keys distinct from the muscle labels*, lane C's catalogue does not yet contain them (grep: the only region-head strings on the tip are the three delt keys), and lane B will add them the moment the catalogue names them. **The INDIRECT half stays with F1** — `INDIRECT` is asserted byte-for-byte unchanged by H3/11.

## 6 · HUNKS (sha256, `ce38aa3` → HEAD)

| File | Role | pre → post |
| --- | --- | --- |
| `rebuild/m4/workout/athlete-state.cjs` | new to the pinned inventory | `dccc5fb5…` → `cdf51db8…` |
| `rebuild/engine/writers.cjs` | edited (F-B) | `00291236…` → `b57b8f8e…` |
| `rebuild/engine/constants.cjs` | edited (F2 LABEL) | `954e4f4b…` → `e387579f…` |
| `.github/workflows/rebuild.yml` | edited (`:142 (2)(b)`) | `839a79ab…` → `cf4b83c1…` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | edited (the A0 cell that asserted the defect) | `228c076d…` → `aecb8fe4…` |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | new to the pinned inventory (lane C's H3 cell flips) | `264358a0…` → `842e2f49…` |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | new | absent → `62f6651f…` |
| `b-package.cjs`, `packages/B-NTC.json` | superseded-by-child (the r7/r8 tooling merge) | parent execution pins |

`rebuild.yml`: `setup.test.mjs` joins the today step, named not globbed, and the standing note that said it was NOT enumerated is corrected to say why it now is. `journey.test.mjs:122` asserted `for (const absent of ['trend','model','blackout','feedRules'])` — the very absence H3 closes; it now asserts the stronger thing and keeps `trend`/`feedRules` absent. Lane C's `H3 - the accepted engine still cannot paint Today for a clean-init athlete` is **inverted, not deleted**: the same four states in the same order, the fourth now produced by the constructor — `:124`'s "the A4 red-first cell flips GREEN".

## 7 · CELLS — `rebuild/m4/workout/test/h3-clean-init.test.cjs`

**GREEN 11/11, exit 0. RED at the parent: 6/7 with the parent's `athlete-state.cjs`; 4/4 of the new cells (H3/8–11) with the parent's engine files.**

| Cell | Executes | RED |
| --- | --- | --- |
| H3/1 | both members written; `closed()` pins each set; frozen; survives the engine's JSON round trip | yes |
| H3/2 | every value the setup date or an absence; no seed value anywhere; every setup-document value round-trips | yes |
| H3/3 | **lane C's four states, ported**; state 4 now paints from the constructor's own state | yes |
| H3/4 | all seven Today readers + `blackoutOn`/`dayWeather`/`weekWeather`/`observedTDEE`; no `sealwater`; first weigh-in not `sealed` | yes |
| H3/5 | **no invented number**: `g`/`bf`/`ffmKg` non-finite, slots read "Not available yet", the only digits are his date and his lifts | yes |
| H3/6 | the gym card day+0 and day+3, a page load each, B-NTC's `lane`/`conductDay` helpers reused | no — green both sides, which is the point |
| H3/7 | six named mutants, each on a private compilation of a copy | yes |
| **H3/8** | **F-B red-first**: first weigh-in → trend finite and **equal to the reading**; `pt` null; second reading damped as today; a carried trend never re-seeds | **yes** |
| **H3/9** | **F-B** the whole trend/pt/weekly chain before a second reading; F-A still holds; no NaN on screen | **yes** |
| **H3/10** | **F2** `programmeVolume` buckets each new head on its own and `mgLabel` prints its label; a label with no head renders exactly as before; an unknown bucket still falls through | **yes** |
| **H3/11** | **F2** `INDIRECT` byte-identical; lane C's 2.8-row-2 predicate holds; exactly seven head entries | **yes** |

**Mutants — six, each killed by a named cell.** M1 a member removed (H3/1, H3/3) · M2 `until` in the future (H3/2, H3/4) · M3 a copied seed value (H3/2, the H1 rule executed) · M4 a model member renamed (H3/1, H3/3) · M5 `closed()` skipped so the seed's `reason` drifts in (H3/1) · M6 a NaN date, the calendar round-trip guard removed (H3/7). A mutation whose `from` is not present exactly once refuses rather than applying to nothing.

## 8 · UNMOVED, AND THE CENSUS

| Suite | Parent `ce38aa3` | H3 |
| --- | --- | --- |
| the **eight** enumerated today files | 268/268 exit 0 | **268/268 exit 0** (`setup.test.mjs` **104/104**) |
| A0 `journey` + `engine-equivalence` | 23/23 | **23/23 exit 0** |
| B-NTC provider `native-trend-context` | 39/39 | **39/39 exit 0** |
| `local-host-journey` + `local-today-journey` | 68/68 | **68/68 exit 0** |
| `copy.test.mjs` | 36/36 | **36/36 exit 0** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate` | **identical line, exit 1** |
| B-NTC's own carriers | green | **refuse — F-C, granted at `:142`** |

**Public census: byte-identical, PROVEN.** `node rebuild/conform/run.cjs` run twice on the same tree — once as it stands, once with `writers.cjs`, `constants.cjs` and `athlete-state.cjs` held out — gives two 81-line logs with the same sha256 `401706332af64b5cd2a78aae173b943f95aefc5b71a9897356a44ef7f6b55b5a` (21,338 bytes each). Clean-init is not in the census and the engine change is unreachable from any golden.

## 9 · FINDINGS AND OPEN ITEMS

* **F-A — accepted as built** (`:142 (3)`). `proteinTarget` (`energy.cjs:116`) still has no gated branch of its own; the view layer's `Number.isFinite` gate is what keeps a figure off the screen. H3/5 and H3/9 pin both halves.
* **F-D and F-E — CLOSED by the r8 runner** `1a3d395d80fcdc9c1ccc3a85f118a8feaa2a314d1553d3420dc864d67e66cd00` (`rebuild/lane-b-tooling` `45e5110`, **r8 ACCEPT WITH CHANGES applied**), merged here and re-pinned as `tooling.runnerSha256`. `H3` is admitted with no D-id, and `parentPin()` now reads both artifact shapes. Measured on this head: `PARENT PINS RE-ASSERTED … 53 product pins`, `PRODUCT IMPLEMENTED; 9 at the declared post-image / 0 at the pinned pre-image / 49 carried byte-identical / 0 unlisted drift`, `FIDELITY OBSERVED`, `AUTHORITY OBSERVED owner :60 and contract :49`, `LAWS 45/45 executed`.

* **F-C — GRANTED at `:142`, and the grant's SUPPORT FILE does not reach the gates that refuse. `coverage.successors` is `null`, and this is the one thing H3 cannot close by itself.** The runner derives the admitted gates (`successorGates()`, `b-package.cjs:525`): a parent `byChild` gate qualifies only if the carrier's own **source closure contains the support path as a literal**. `:142` names `rebuild/m3/w6/host/test/journey.test.mjs`. Measured over the real closures:

| support path | source-carriers | inherited-carriers | defect-witnesses | writers-differential | second-gate | durable-journeys |
| --- | --- | --- | --- | --- | --- | --- |
| `…/journey.test.mjs` (what `:142` names) | no | no | no | no | no | **yes** |
| `rebuild/engine/writers.cjs` | **yes** | **yes** | **yes** | **yes** | **yes** | no |
| `packages/B-NTC.json` | **yes** | **yes** | **yes** | **yes** | **yes** | **yes** |

  So the grant admits **no gate at all**: `journey.test.mjs` is reached only by `b-ntc-journeys.cjs`, and `durable-journeys` is not one of the parent's nine inherited gates. What actually refuses all five inherited carriers is `writers.cjs` — `Unlisted parent pin drift rebuild/engine/writers.cjs`, raised by the shared `preflight()` in `b-ntc-successors.cjs`. **That is a scope question for the PM, not a tooling defect:** `:142`'s F-C grant was written before `:135 (5)` bundled F-B and F2 into this package, and those are what move an engine file the same preflight pins. **The grant needs one more sentence naming `rebuild/engine/writers.cjs` (and `rebuild/engine/constants.cjs`) as support paths**; with that, the five gates are admitted and H3 can declare the successor and enumerate the substitution. Lane B did **not** take either of the two shortcuts available: it did not edit the runner, and it did not rewrite `packages/B-NTC.json`'s posts to its own bytes — that file is a parent execution pin and B-NTC never produced those bytes, so writing them there would forge the parent's own record.

* **SEAL ON THE TIP (`:135 (4)`, `SEAL_TIP_RULE = 'first-parent'`).** This branch is exactly the case that divides the two settings, and the measurement is: tip `ce38aa3` **is an ancestor of HEAD `f7e0007` (true)** and **is NOT in HEAD's first-parent chain (1447 commits, false)**, because the tip was merged with `git merge --no-ff` as the SECOND parent. Under `'first-parent'` the seal would refuse; under `'ancestor'` it would pass. The check lives at the seal, which neither `--ci` nor `--full` reaches on this head, so it is reported as measured rather than quoted. **Lane B has not rebased** and will not without a ruling.
* **The two ledger lines this package still owes** (`:135 (2)`, the lane appends them itself once the PM accepts the brief BY NAME): a **THEME** line naming `M2-H3-CLEAN-INIT` and this brief path, and a **BRIEF-BY-SHA** line citing `rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md` by its sha256 and ending in the `ACCEPTED` terminal word, both in the `:122`/`:126` shape with the lineSha in the STATUS line. Until they stand on the chain branch, `brief.acceptedLedgerLine` is `null` and `status` stays `PROPOSED` — neither can be struck off by declaration.

## 10 · PROTECTED SURFACES · SIBLING NOTE

Never opened, hashed or quoted: `rebuild/conform/private/live.json` and the private `live.main` golden (absent from this worktree by design — `--full` would stop at `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, though on this head it fails earlier, at F-C's refused child, so the BLOCKED line is not reached); `rebuild/conform/goldens`. Two engine files change and both are proven inert against the census and the 45 laws above; every other file under `rebuild/engine` is byte-identical to `ce38aa3`.

**Sibling note.** B1 re-pins `rebuild/m4/workout/athlete-state.cjs` at its rebase. H3 lands before B1 in the ruled order (B-NTC → H3 → B1 → B2 → B4 → B3), so B1's pre-image for that file is `cdf51db8…`, and its pre-images for `writers.cjs`, `constants.cjs`, `rebuild.yml`, `journey.test.mjs` and `setup.test.mjs` are H3's post-images above, not the parent's.
