# BRIEF — M2-H3-CLEAN-INIT · v1.5 (lane B, child of M2-B-NTC)

**The bundle.** `DECISIONS:124` ruled H3: `createCleanInitState` wrote neither `blackout` nor `model`, so the accepted engine **threw** for a brand-new athlete and Today stood on the preview's sample athlete (S2). `DECISIONS:142` then judged H3's own findings and `:135 (5)` bundled F2's LABEL half into the same seal. This package therefore carries FOUR things: **H3** (the two members), **F-B** (an S2 blocker of its own: the first weigh-in must not make the trend NaN), **F2 LABEL** (`MG_LABEL` region heads), and the **`rebuild.yml` enumeration of `setup.test.mjs`** that `:142 (2)` option (b) rides on H3's seal. Parent: the sealed and INTEGRATED B-NTC artifact `87f4848c…` at `9ad2ecab`, receipt `:141`, integrated at `ce38aa3` (ledger `:144`). `sourceBase` is `ce38aa3`.

## 1 · READ-LIST

`DECISIONS:124` (the H3 ruling) · `:142` (F-A accepted as built; F-B inside H3; F-C granted in the `:113` shape; F-D is tooling; `setup.test.mjs` rides H3) · `:135 (5)` (the bundle) and `:135 (2)` (the lane appends its own theme/brief citation lines) · `:113 (1)` (the successor conditions a–e) · `rebuild/lanes/REQUESTS.md` 2026-09-11 20:45 ET (lane C's finding, with the throw sites) · `rebuild/m3/w7-preview/today/test/setup.test.mjs` (lane C's red-first H3 cell, S3, and provenance 2.8 row 2) · `rebuild/m4/workout/athlete-state.cjs` · `rebuild/engine/{energy,sleep,writers,today,dates,seed,constants,volume}.cjs` · `rebuild/m3/w7-preview/today/setup-model.mjs` (what the setup document collects; `REFUSAL_SENTENCES`; `MG_LABELS`) · `rebuild/lanes/b/tooling/README.md` + `packages/{H3,B-NTC}.json` · `BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` §1–§6 · `PLAN-TRACK-B-PACKAGES-v1.md` §3.

## 2 · TRACE — every engine reader of `s.blackout` / `s.model` (32 hits, all listed)

| Reader | Member | Guard | On a clean-init state |
| --- | --- | --- | --- |
| `energy.cjs:370` `observedTDEE` | `blackout.until` | **none** | **threw** — the first throw |
| `sleep.cjs:358`, `:1913`; `writers.cjs:427`, `:938`, `:1715` | `blackout.until` | **none** | would throw |
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

| `model.lean` | `bfEst` | `proteinTarget` | `today-app.cjs:259/:260` `Number.isFinite(g)` | Screen |
| --- | --- | --- | --- | --- |
| `null` | `lean: 0` (null coerces) | `g: 0, ffmKg: 0` | **true** | **"0 g protein"** |
| absent | non-finite | `g: NaN` | false | **"Not available yet"** |

With a bodyweight on file `null` is worse: `pct = ((trend-0)/trend)*100` = **100.0 % body fat**. `NaN` is no third option — `applyRead` (`writers.cjs:425`) round-trips through `JSON.parse(JSON.stringify(…))`, turning `NaN` into `null`, i.e. into the `0` above.

**The two `closed()` codes are `STATE_BLACKOUT_MEMBER_SET` / `STATE_MODEL_MEMBER_SET`, deliberately NOT `CLEAN_INIT_*`.** That prefix is the athlete-facing refusal vocabulary: lane C's `setup.test.mjs` S3 asserts every `CLEAN_INIT_*` code this module can throw has a screen sentence and that the table names **exactly** those codes. These two are builder-side invariants over the module's own literals — no setup document any screen can produce reaches them — so minting `CLEAN_INIT_*` codes would have forced lane C to write screen copy for something no athlete can cause. Renaming them keeps S3 green with no edit to lane C's model.

## 4 · F-B — THE FIRST WEIGH-IN (`DECISIONS:142 (3)`, S2)

`rebuild/engine/writers.cjs` `applyRead` had **no first-read branch**: `s.trend = +(s.trend + 0.3 * dCl).toFixed(1)`. Every state it was built for arrived with a `trend` (seed, or migrate walking one forward). A clean-init athlete has none and must not, so his first weigh-in made `trend` **NaN** and every figure downstream stayed non-finite for good — the owner's own first weigh-in on 09-13 included.

**The rule, and it needs no owner ruling.** The seed is **the reading itself**: `if (first) s.trend = w;`. It invents nothing, it chooses nothing between alternatives that differ in what they claim about him, and the only number written is the one he typed. It is taken **verbatim rather than rounded**, because rounding would already be changing what he typed; from the second reading on the accepted 1-dp EMA is untouched. `first` is `!Number.isFinite(s.trend)`, so **every state that already carries a trend takes exactly the accepted path** — that is why the 45 laws and the census do not move. The branch runs before the sealed / off-window test: those govern how a reading MOVES an existing trend, not whether a level exists at all. `pt` on that first row is `null`, not `undefined`, because `undefined` would be dropped by the writer's own JSON round trip.

**What the chain reads before a second reading exists** (cell H3/9, all measured, for an **in-window** first read): `trend` = the reading · `reads[0].pt` = `null` · `reads[0].note` = `""` (no spike, seal or noise claim against nothing) · `weekly` = `[]` — one reading is not a week · `currentRate.measured` = `false`, `n` = 0 · `latestRead`/`morningRead` = the reading · and **F-A still holds**: `proteinTarget.g`/`bf`/`ffmKg` all non-finite, the protein slots still read "Not available yet". Every digit on the screen is his date, his lift count, or the number he put on the scale. **No invented figure reaches Today.**

**THE WINDOW APPLIES TO THE FIRST READ TOO — `DECISIONS:146 (3)`, OPTION B (RULED).** The first draft seeded the trend whatever the window, and review r1 finding 1 caught what that made the app SAY: a first read at `hour: 23` came back `offWindow: true`, `note: "late read — set aside"`, a feed line reading LATE READ — SET ASIDE — **and the trend was that reading**; a sealed first read said `"sealed — excluded from trend"` and was the trend. The same two calls on a trend-carrying athlete leave his trend at `187.2`, so two athletes were told the same words and given different arithmetic. The PM ruled the contradiction out rather than rewriting the copy:

    if (!sealed && !offW) s.trend = first ? w : +(s.trend + 0.3 * dCl).toFixed(1);

One window test now governs both branches. A late or sealed first reading is still **recorded** — it is never refused, and it is still his number — it simply writes no trend, exactly as it writes none for an athlete who already has one. Until an in-window, unsealed reading arrives Today keeps saying "Not available yet", which is true and which H3/5 already proves is safe: every figure derived from an absent trend stays non-finite. Cell **H3/12** asserts option B (`FIRST_READ_ON_A_SET_ASIDE_ROW = false`) in all four branches — in-window, late, sealed, and the next morning's in-window read that does seed it with the late row still on file — plus the differential that shows the two athletes now agree.

## 5 · F2, LABEL HALF (`DECISIONS:135 (5)`) — AND THE ONE PLACE THE BUNDLE AND THE TREE DISAGREE

`volume.cjs:74` buckets a lift by `e.head || e.mg`; `volume.cjs:32` renders the bucket with `MG_LABEL[k] || k`. A REGION HEAD needs an entry or it prints its key; a bare muscle label does not, because there the key IS the word. Added, keyed `<muscle>_<head>` exactly as the three delt heads already are:

    back_lats: "lats" · back_upper: "upper back" · back_traps: "traps" · back_lower: "lower back"

**The leg, arm and core names the bundle also lists are NOT added, and this is a disagreement the PM should see.** They are already the engine's own `mg` labels (`seed.cjs` `mg` values; `setup-model.mjs:26` `MG_LABELS`), so `|| k` renders each of them identically today — an entry would change **no character on any screen**. It would also break lane C's accepted provenance cell `setup.test.mjs` 2.8 row 2, which asserts the engine has no gloss table for the labels first-run collects. Cell H3/11 asserts lane C's own predicate directly so the two cannot drift. If the PM meant those names as *new head keys distinct from the muscle labels*, lane C's catalogue does not yet contain them (grep: the only region-head strings on the tip are the three delt keys), and lane B will add them the moment the catalogue names them. **The four heads are INERT on this tree, and that is stated rather than glossed** (review r1 finding 3): no producer sets `e.head` to any of them — `seed.cjs` and `migrate.cjs` set only `delts_side`/`delts_rear` — and the four keys, and the strings "upper back" and "lower back", occur nowhere in the tree but on the `MG_LABEL` line itself. They become reachable only once a producer writes one of these heads onto a lift; until then `MG_LABEL[k] || k` is never consulted for them, no screen changes, and that is precisely why the public census cannot move. The in-tree comment at `constants.cjs:342` now says this too. **The INDIRECT half stays with F1** — `INDIRECT` is asserted byte-for-byte unchanged by H3/11.

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

**GREEN 13/13, exit 0. RED at the parent: 6/7 with the parent's `athlete-state.cjs`; 4/4 of the F-B/F2 cells (H3/8–11) with the parent's engine files.** H3/12 documents a held question and H3/13 guards a CI line, so neither is red-first.

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
| **H3/12** | **HELD (review r1 finding 1)** the late and sealed first read, both branches and the differential against a trend-carrying athlete; one constant flips it when the PM answers | n/a — it documents, it does not assert a fix |
| **H3/13** | the CI today step names all eight files including `setup.test.mjs`, none globbed, and the eight are exactly what the directory holds | **yes** |

**Mutants — six, each killed by a named cell.** The killers below are the cells that were EXECUTED against each mutation (review r1 finding 7 corrected the earlier, looser attribution): M1 a member removed → H3/1, 2, 3, 4, 5 · M2 `until` in the future → H3/2, 4 · M3 a copied seed value → H3/2, the H1 rule executed · M4 a model member renamed → H3/1, 2, 3, 4, 5 · M5 `closed()` skipped so the seed's `reason` drifts in → **H3/1 alone** (H3/2 passes under M5) · M6 a NaN date, the calendar round-trip guard removed → H3/7. A mutation whose `from` is not present exactly once refuses rather than applying to nothing. H3/7's own `dies()` predicates witness that each mutation took effect; they do not re-run the killing cell, and the brief does not claim they do.

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

* **F-A — accepted as built** (`:142 (3)`). `proteinTarget` (`energy.cjs:117`) still has no gated branch of its own; the view layer's `Number.isFinite` gate is what keeps a figure off the screen. H3/5 and H3/9 pin both halves.
* **F-D and F-E — CLOSED by the runner** `59ecc7f91f5f8f6d40c5c0f61267c6f71ca7edd7987b8022da39c5a04a1cce0d` (`rebuild/lane-b-tooling` `978d821`, r8 ACCEPT WITH CHANGES applied and `DECISIONS:145` ancestry), merged here and re-pinned as `tooling.runnerSha256`. The chain tip merged with it is `dac3af9`, **docs-only since `ce38aa3`** — verified: `DECISIONS.md`, `REQUESTS.md`, `STATUS.md`, `STATUS-ARCHIVE.md` and nothing else. `H3` is admitted with no D-id, and `parentPin()` now reads both artifact shapes. Measured on this head: `PARENT PINS RE-ASSERTED … 53 product pins`, `PRODUCT IMPLEMENTED; 9 at the declared post-image / 0 at the pinned pre-image / 49 carried byte-identical / 0 unlisted drift`, `FIDELITY OBSERVED`, `AUTHORITY OBSERVED owner :60 and contract :49`, `LAWS 45/45 executed`.

* **F-C — the grant is EXTENDED at `DECISIONS:146 (1)`, and the successor is a BUILD this revision SPECIFIES but does not contain.** `:146` line sha256 **`3dc537652cdf8f6b9c012ac88096f8f8cc7d9156ce5dbbd3453a3936c2b9c2c0`** on `origin/rebuild/t2-client-core` (line 146), verified against all four predicates the runner applies: it names `M2-H3-CLEAN-INIT`, uses the word SUCCESSOR, stands on `:113`, and names all three support paths. The admitted gate set is **measured, not chosen**: `successorGates()` (`b-package.cjs:529/:542`) admits a parent `byChild` gate only when the carrier's own source closure contains the support path as a literal, and `rebuild/engine/writers.cjs` reaches all five inherited carriers (`constants.cjs` reaches none; `journey.test.mjs` reaches `b-ntc-journeys.cjs` only, which is not a `byChild` gate). So `support` is `rebuild/engine/writers.cjs` and the five gates are `migrate-source`, `merge-source`, `writers-source` → `source-carriers`; `witnesses-2`, `witnesses-5`, `migrate-differential` → `inherited-carriers`; `witnesses-7` → `defect-witnesses`; `writers-differential`; `second-gate`.

  **THE BUILD, FULLY SPECIFIED (read off the runner, not guessed).** `sup.substitutions` may be **empty** — the runner asserts only `Array.isArray` — so the honest shape is a successor with **no text substitution at all**: it compiles the parent's own gate body unchanged and makes it run against H3's bytes by supplying H3's spec where the parent's preflight reads B-NTC's. That is what the mechanism is for, and it avoids inventing a re-target the tree cannot carry (see the blocker below). `rebuild/m4/spec/h3-successors.cjs`, role `new`, must then: (1) verify the B-NTC artifact by sha; (2) for the gate original `rebuild/m4/spec/b-ntc-<name>.cjs`, assert its bytes equal **both** `executionPins[original]` **and** the Git blob at the parent's reviewed commit `9ad2ecab…`; (3) compile the shared `b-ntc-successors.cjs` privately (`new Module()` + `_compile`, never `require`, so it never enters `require.cache`) with `node:fs` answered so that its `CHILD_SPEC` read returns B-NTC's own spec **at the reviewed commit with H3's declared `edited`/`superseded-by-child` posts applied** — the pin re-target, driven by `packages/H3.json`'s own product map and by nothing else; (4) compile the original wrapper privately with `'./b-ntc-successors.cjs'` resolved to (3). The five wrappers `rebuild/m4/spec/h3-<name>.cjs` each carry one statement and the parent artifact's own `children` needle. The runner's other conditions are already satisfied by that shape: the closure reaches only H3's own `new` product (the successors are read through `fs`, never `require`d, so `SUCCESSOR-CLOSURE-LEAVES-THE-PACKAGE` and `SUCCESSOR-REQUIRES-THE-ORIGINAL-INSTEAD-OF-COMPILING-IT` both stay silent), the originals are named, and no long line of any original is copied.

  **The one structural blocker, and it is disclosed rather than worked around.** B-NTC pinned its five gate wrappers in `executionPins` but **not** `rebuild/m4/spec/b-ntc-successors.cjs`, the 242-line support module all five share and in which the refusal actually arises. So (a) no declared substitution can target it — `sub.original` must be a parent execution pin — which is why the wrappers, whose only pin-bearing text is a comment naming `packages/B-NTC.json` in short form, offer no admissible re-target; and (b) step (3) above compiles a file the parent pins nowhere. Lane B's answer is to anchor it to the **Git blob at the parent's reviewed commit** `9ad2ecab…`, which is exactly the second anchor every pinned original already gets, and to say so here rather than let an unanchored read pass unnoticed. A reviewer should check that anchor first.

  **What the declaration needs, exactly, and why it is not a one-liner.** Each parent carrier (`rebuild/m4/spec/b-ntc-<name>.cjs`, all five parent EXECUTION PINS) is an eight-line wrapper whose only statement is `require('./b-ntc-successors.cjs').run('<name>');`. The refusal — `Unlisted parent pin drift rebuild/engine/writers.cjs` — is raised inside `b-ntc-successors.cjs`'s shared `preflight()`, which reads `CHILD_SPEC = rebuild/lanes/b/tooling/packages/B-NTC.json` and asserts every post it declares against disk. `b-ntc-successors.cjs` is **not** a parent execution pin, so it cannot be a substitution target; the only re-targetable string is the `require` in each wrapper. The successor is therefore five thin files `rebuild/m4/spec/h3-<name>.cjs` (each loading its original privately, naming it, copying none of it) plus **an H3-owned support module** that does what `b-ntc-successors.cjs` does against H3's own spec — B-NTC's equivalent is 241 lines and took its own review round — plus five enumerated substitutions of the form `require('./b-ntc-successors.cjs').run('<name>');` → `require('./h3-successors.cjs').run('<name>');`, each `from` standing exactly once in its original. That is a build, and lane B does not declare a `coverage.successors` block it has not built: a partial block refuses, and a fabricated one would be worse than an honest `null`. **`coverage.successors` is `null` in this revision and the five inherited carriers still refuse.** Lane B also did not take either shortcut available: the runner was not edited, and `packages/B-NTC.json`'s posts were not rewritten to H3's bytes — that file is a parent execution pin and B-NTC never produced those bytes.

* **SEAL ON THE TIP — CLOSED at `DECISIONS:145`.** The rule is ANCESTRY, and `SEAL_TIP_RULE` is `'ancestor'` in the merged runner (`59ecc7f9…`) with the ruling cited beside it. Measured on this head: the chain tip is an ancestor of HEAD. The earlier `--no-ff` reading is moot and lane B did not rebase.

* **The brief is ACCEPTED BY NAME at `DECISIONS:146 (2)`** (v1.3, sha256 `60567b60…`). Under `:135 (2)` the lane now appends its own two citation lines: a **THEME** line naming `M2-H3-CLEAN-INIT` and this brief path, and a **BRIEF-BY-SHA** line citing `rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md` by its sha256 and ending in the `ACCEPTED` terminal word, both in the `:122`/`:126` shape with the lineSha in the STATUS line. They are not yet on the chain branch, so `brief.acceptedLedgerLine` is `null` and `status` stays `PROPOSED` — neither can be struck off by declaration, and this revision (v1.4) supersedes the accepted v1.3 bytes, so the BRIEF-BY-SHA line must cite v1.4.

## 10 · PROTECTED SURFACES · SIBLING NOTE

Never opened, hashed or quoted: `rebuild/conform/private/live.json` and the private `live.main` golden (absent from this worktree by design — `--full` would stop at `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, though on this head it fails earlier, at F-C's refused child, so the BLOCKED line is not reached); `rebuild/conform/goldens`. Two engine files change and both are proven inert against the census and the 45 laws above; every other file under `rebuild/engine` is byte-identical to `ce38aa3`.

**Sibling note.** B1 re-pins `rebuild/m4/workout/athlete-state.cjs` at its rebase. H3 lands before B1 in the ruled order (B-NTC → H3 → B1 → B2 → B4 → B3), so B1's pre-image for that file is `cdf51db8…`, and its pre-images for `writers.cjs`, `constants.cjs`, `rebuild.yml`, `journey.test.mjs` and `setup.test.mjs` are H3's post-images above, not the parent's.
