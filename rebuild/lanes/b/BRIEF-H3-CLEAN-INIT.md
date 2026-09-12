# BRIEF — M2-H3-CLEAN-INIT · v1.9 (lane B, child of M2-B-NTC)

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
**A THIRD MEMBER, folded in from H3-CORE: `sleep.needed`** (lane C's H3-class finding, `REQUESTS 04:11 (1)`). `sleep: { nights: [] }` left `needed` absent and four accepted readers dereference it unguarded: `today.cjs:266` put the literal text **`0/undefined clean`** on the SLEEP lever the moment a night reached the record, `sleep.cjs:1903` handed its caller `need: undefined` which `JSON.stringify` then **dropped entirely**, `sleep.cjs:239` printed `0 of undefined clean nights` and **`NaN more nights`**, and `sleep.cjs:1053` made `at` `0 >= undefined` — **false for ever**, not just on day one. All four measured on both shapes. **The value is 3 and it is not typed in `athlete-state.cjs`**: it is read at load time out of the engine's own `constants.cjs` `SLEEP_ANCHOR_MIN_N` (`:315`), the one named sleep-night-count constant the engine exports, so it cannot drift from the engine and is not a copy of `seed.cjs:80` (a cell asserts the module never names the seed, and mutant **M7** kills a literal that happens to agree today). Zero-night behaviour is unchanged: `run` 0, `at` false. `closed()` pins the set (`SLEEP_MEMBERS`), so `nights` is still `[]`. Its other half, `cleanH`, is **open** — F-G in §9.


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

## 6 · HUNKS (sha256, `ce38aa3` → HEAD) — v1.8 re-measures every row on the merged tip (`origin/rebuild/t2-client-core` @ `ec80cbe`) and adds the seven files the supersession and the `sleep.needed` fold bring

| File | Role | pre → post |
| --- | --- | --- |
| `rebuild/m4/workout/athlete-state.cjs` | new to the pinned inventory | `dccc5fb5…` → `d0e26f74…` (H3-CORE's `sleep.needed` folded in) |
| `rebuild/engine/writers.cjs` | edited (F-B) | `00291236…` → `0522797d…` |
| `rebuild/engine/constants.cjs` | edited (F2 LABEL) | `954e4f4b…` → `106113ba…` |
| `.github/workflows/rebuild.yml` | edited (`:142 (2)(b)`) | `839a79ab…` → `cf4b83c1…` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | edited (the A0 cell that asserted the defect) | `228c076d…` → `7b78319e…` |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | new to the pinned inventory (lane C's H3 cell flips) | `264358a0…` → `e4b797eb…` (and A4b's re-pin cell amended — §9) |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | new | absent → `fe247d2d…` |
| `b-package.cjs`, `packages/B-NTC.json` | superseded-by-child (the r7/r8 tooling merge) | parent execution pins |
| `rebuild/m4/workout/test/h3-supersede-source-carriers.test.cjs` | new (supersession evidence) | absent → `dc92e918…` |
| `rebuild/m4/workout/test/h3-supersede-inherited-carriers.test.cjs` | new | absent → `69c8d05f…` |
| `rebuild/m4/workout/test/h3-supersede-defect-witnesses.test.cjs` | new | absent → `e41ec9f2…` |
| `rebuild/m4/workout/test/h3-supersede-writers-differential.test.cjs` | new | absent → `fec3f052…` |
| `rebuild/m4/workout/test/h3-supersede-second-gate.test.cjs` | new | absent → `d186664a…` |
| `rebuild/m4/workout/test/h3-engine-files-differential.cjs` | new (`:153 (ii)` evidence) | absent → `d0f59c48…` |

`rebuild.yml`: `setup.test.mjs` joins the today step, named not globbed, and the standing note that said it was NOT enumerated is corrected to say why it now is. `journey.test.mjs:122` asserted `for (const absent of ['trend','model','blackout','feedRules'])` — the very absence H3 closes; it now asserts the stronger thing and keeps `trend`/`feedRules` absent. Lane C's `H3 - the accepted engine still cannot paint Today for a clean-init athlete` is **inverted, not deleted**: the same four states in the same order, the fourth now produced by the constructor — `:124`'s "the A4 red-first cell flips GREEN".

## 7 · CELLS — `h3-clean-init.test.cjs` 14/14 the five `h3-supersede-*.test.cjs` 16/16, and the `:153 (ii)` engine differential, exit 0 each

**14/14 on the clean-init file** (H3/1–13 plus **H3/S1**, H3-CORE's `sleep.needed` cell, folded in with mutant **M7** so H3/7 is now seven named mutants). **RED at the parent: 1 pass / 13 fail** with the parent's `athlete-state.cjs` and engine files. **16/16 across the five supersession files** (4 · 3 · 3 · 3 · 3), each of them measured RED on the parent's engine bytes — 3 · 3 · 2 · 2 · 1 red cells respectively — which is the per-carrier red-first evidence `coverage.superseded` names. §3 above carries `sleep.needed`; §9 carries the supersession. The sixth evidence child, `rebuild/m4/workout/test/h3-engine-files-differential.cjs`, is a plain programme rather than a cell file — `DECISIONS:153 (ii)` asks its VERDICT LINE to state the count, so it prints one: `ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 2 named files move and each stands at its declared post-image;` over 3,048 bytes of per-file output, exit 0.

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
| the **eight** enumerated today files | 268/268 at `ce38aa3` | **321/321 exit 0** on the merged tip (`setup.test.mjs` **157/157**) |
| A0 `journey` + `engine-equivalence` | 23/23 | **23/23 exit 0** |
| B-NTC provider `native-trend-context` | 39/39 | **39/39 exit 0** |
| `local-host-journey` + `local-today-journey` | 68/68 | **68/68 exit 0** |
| `copy.test.mjs` | 36/36 | **36/36 exit 0** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate` | **identical line, exit 1** |
| B-NTC's own carriers | green | **SUPERSEDED — nine gates, five carriers, §9; the refusal is measured, not asserted** |

**Public census: byte-identical, PROVEN.** `node rebuild/conform/run.cjs` run twice on the same tree — once as it stands, once with `writers.cjs`, `constants.cjs` and `athlete-state.cjs` held out — gives two 81-line logs with the same sha256 `401706332af6…` under the PowerShell UTF-16 capture v1.5 used; re-measured on this head as raw stdout it is **10,587 bytes, 81 lines, sha256 `189cbcc5…`**, and that value is UNCHANGED by the tip merge and by every H3 byte. Clean-init is not in the census and the engine change is unreachable from any golden.

## 9 · FINDINGS AND OPEN ITEMS

* **F-A — accepted as built** (`:142 (3)`). `proteinTarget` (`energy.cjs:117`) still has no gated branch of its own; the view layer's `Number.isFinite` gate is what keeps a figure off the screen. H3/5 and H3/9 pin both halves.
* **F-D and F-E — CLOSED by the runner** `59ecc7f91f5f8f6d40c5c0f61267c6f71ca7edd7987b8022da39c5a04a1cce0d` (`rebuild/lane-b-tooling` `978d821`, r8 ACCEPT WITH CHANGES applied and `DECISIONS:145` ancestry), merged here and re-pinned as `tooling.runnerSha256`. The chain tip merged with it is `dac3af9`, **docs-only since `ce38aa3`** — verified: `DECISIONS.md`, `REQUESTS.md`, `STATUS.md`, `STATUS-ARCHIVE.md` and nothing else. `H3` is admitted with no D-id, and `parentPin()` now reads both artifact shapes. Measured on this head: `PARENT PINS RE-ASSERTED … 53 product pins`, `PRODUCT IMPLEMENTED; 9 at the declared post-image / 0 at the pinned pre-image / 49 carried byte-identical / 0 unlisted drift`, `FIDELITY OBSERVED`, `AUTHORITY OBSERVED owner :60 and contract :49`, `LAWS 45/45 executed`.

* **F-C — CLOSED AS A SUCCESSOR QUESTION AND RE-OPENED AS A SUPERSESSION ONE, AND THE ROLE IS NOW BUILT.** `DECISIONS:147` landed both fixes it was asked for and both are MEASURABLY CLOSED on this head: the admitted gate set is the runner's own `successorGates()` question (each of the five carriers closes over **7 files** by the compile edge and every one reaches `rebuild/engine/writers.cjs` through `rebuild/m4/spec/native-next-target-candidate/source-delta.cjs`), and the load floor, measured on the body the wrapper LOADS, is **256** qualifying lines against a floor of 8. Neither was the blocker. v1.7 §9 measured the real one to the bottom and `BRIEF-H3-CORE` §5 measured the second half with **no engine byte changed at all**: the five carriers do not PIN `rebuild/engine`, they **RECONSTRUCT** it from a frozen `BASE` plus the 48 literal carriers of `native-carriers-changes.json` whose bytes are pinned by `CHANGES_SHA` (`native-carriers-source.cjs:37`), and `b-ntc-successors.cjs:141/:145` additionally hold **every path `packages/B-NTC.json` declares** at B-NTC's own post. **No child of M2-B-NTC that changes ANY file the parent spec declares — engine byte or not — can carry these five by substitution.** So lane B stopped asking for a successor and asked for the honest thing instead (`REQUESTS 2026-09-12 09:25`): the role to declare the gate **SUPERSEDED** and stand its own executed evidence in its place. That role is built and blind-accepted on `rebuild/lane-b-tooling` @ `0663df1` (runner `c8dfdd49…`, r10 REJECT → r10b ACCEPT), merged here, and **this package declares it**.

  **THE FIVE CARRIERS, WHAT EACH PROVED FOR `M2-NATIVE-CARRIERS`, AND H3'S OWN EVIDENCE — one red-first cell per carrier, each measured RED on the parent's engine bytes.** The role retires **gates**, not carriers: these five cover **nine of the nineteen**.

| Carrier (gates) | What it proved | H3's evidence, executed | RED on the parent bytes |
| --- | --- | --- | --- |
| `source-carriers` (migrate-source, merge-source, writers-source) | the engine is `BASE` + the 48 sha-pinned literal carriers, byte for byte; every other engine file equals `git show BASE:` | `h3-sup-source-carriers` — H3 states **its own literal carrier list** (4 rows, one per contiguous hunk) and applies it FORWARD to the `sourceBase` blobs and INVERSE to the bytes on disk; both directions byte-exact, every `before`/`after` unique, the `rebuild/engine` inventory closed, and exactly the two declared files differ | 3 of 4 cells |
| `inherited-carriers` (witnesses-2, witnesses-5, migrate-differential) | `priorModule` re-reads every prior engine module against the same list (`:82/:85/:88/:89`) and pins the substitution order (`:138`) | `h3-sup-inherited-carriers` — every prior module but the two declared is byte-identical to `sourceBase` **and** to the parent artifact's own product pin; the accepted `constants.cjs` and H3's differ in **exactly one exported key** (`MG_LABEL`, four added BACK heads, no existing gloss touched); and no producer anywhere on the tree sets those four, so `MG_LABEL[k] \|\| k` is never consulted for them | 3 of 3 cells |
| `defect-witnesses` (witnesses-7) | 10/10 **complete comparisons** — frozen side and candidate side, both produced, compared in full | `h3-sup-defect-witnesses` — the accepted writer (the `sourceBase` bytes, compiled privately, never in `require.cache`) and H3's, over the same clean-init first weigh-in, both read out in full: the accepted trend is **NaN**, H3's is the reading verbatim with `pt: null`; the `:146 (3)` OPTION B set-aside branch witnessed the same way; and `DECISIONS:124`'s own refusal witnessed against the **parent's** `athlete-state.cjs`, also compiled from its blob | 2 of 3 cells |
| `writers-differential` | `writers.cjs` behaves identically across **3 Date/trap modes** | `h3-sup-writers-differential` — both writer factories composed on the SAME engine table and driven over the same battery in the same three modes: **15/15 identical** on every trend-carrying state, different ONLY where the trend is absent, and H3's own output identical frozen/live/trapped so the branch reads no clock | 2 of 3 cells |
| `second-gate` | the independent second reading: the public record does not move | `h3-sup-second-gate` — both compositions (accepted writers from the blob, H3's from disk) over the **frozen seed record** across a 15-reader projection, compared as one string, plus `applyRead` itself: byte-identical; the one input they differ on is a state with no trend, which the frozen record cannot hold | 1 of 3 cells |

  **THE EVIDENCE THE RUNNER EXECUTED, AND WHAT IS SHARED.** Per carrier the runner requires an evidence child of that carrier's **own**: that is the red-first cell above, and it is why there are five files and not one. The two differentials are **shared and declared as such** — `a0-journeys` (`journey.test.mjs` + `engine-equivalence.test.cjs`, 23/23: the accepted runtime against the host's bundleable mirror) as the legacy differential and `today-suites` (the eight enumerated today files, 321/321) as the writers differential — they differ from each other and neither stands in `redFirst`, which is what `b-package.cjs` requires; the census slot is the runner's **own** live-triggered line, admitted only while it says `none`, and it does; `laws` is `null`, the register unmoved, and H3 registers no D-id.

  **THE RULING IS ON THE CHAIN, AND THE PACKAGE STANDS ON IT.** The STANDING ROLE is `DECISIONS:153` (line sha256 `b6f84af6a014cc3a751ff3f077ed03e149047cdcc0f448328038a3e0f0af47e1`), whose own grant token stands inside a prose clause and therefore — by the r10b rule — frees nothing; the TOKEN CLAUSE that frees this package is **`DECISIONS:160`**, line sha256 **`3746ff573af4522ff8199f21d210d5915954bb7190e6914ca5e7a7e5853184bb`** (`3746ff57…`), computed from the exact bytes of line 160 on `origin/rebuild/t2-client-core` and unique there. It reads, in full:

```
- 2026-09-12 · cowork (PM) · GATE-SUPERSESSION M2-H3-CLEAN-INIT source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate · the token clause for DECISIONS:153, same conditions (i)–(iii) · RULED
```

  The token stands **alone in its own `·` clause** on a `RULED` line, which is what the runner requires and what `:153`'s own line deliberately does not do. `coverage.superseded.rulingLineSha256` cites `:160` by that sha; the closed block has **no field of its own** for the standing role, so `:153` is recorded in `notes` and at the head of every carrier's `why`, where it prints on every run.

  **`DECISIONS:153 (ii)`'S FIFTH EVIDENCE SLOT, BUILT AND EXECUTED.** The role now requires an `engineFilesDifferential` beside the red-first cell, the two shared differentials and the census line. H3's is `rebuild/m4/workout/test/h3-engine-files-differential.cjs`: it reads the tracked inventory under `rebuild/engine/` out of Git (**45** files), subtracts the **18** this brief names — the sixteen modules it carries plus the two it edits — and compares the remaining **27** against the parent's own image of each: the parent artifact declares no `post` for any of them, so each is compared to the blob at the parent's own `sourceBase` `50fa37a5…`. Those 27 are every programme under `rebuild/engine/test/` — **the NATIVE-CARRIERS gate bodies themselves**, which is the point: the carriers H3 supersedes are byte-identity reconstructions, and what H3 can show is that nothing under that root moved except the two files it declares, the gates included. The parent artifact is read only after its bytes match the sha the spec pins. The runner computes the same set and the same identity itself (`supersessionEngineIdentity`) and then holds this child's verdict line to **the count it measured**, so neither side can drift alone — and the child additionally prints the two named files that DO move, each at its declared post.

  **MEASURED ON THE REAL CHAIN, exit 2.** `--ci --package H3` now prints `COVERAGE 0/19 original gate(s) covered by 0 executed child(ren) (0 inherited…); 9 SUPERSEDED`, then `SUPERSESSIONS 5 byte-identity carrier(s) of B-NTC SUPERSEDED over 9 gate(s) under DECISIONS:160, located on refs/remotes/origin/rebuild/t2-client-core BY ITS OWN SHA256 3746ff573af4`, five `SUPERSEDED <carrier> <- <gates>` lines and five `SUPERSEDED EVIDENCE` lines each naming `engine-files differential engine-files-differential over 27 file(s)`, then `NO-REGISTER OBLIGATION … 8 of 8 declared child(ren) executing one of this package's own role:"new" product file(s) ran in this process`, the three `OPEN` lines and `CI REVIEW-PENDING: 2 open obligation(s)` — **theme and brief, and nothing else**. All ten declared children are green. `--full` now REACHES its terminal for the first time: `B PACKAGE H3 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, exit 2 — the private fixture is absent from this worktree by design, and every superseded gate is reported rather than re-run.

* **F-G — OPEN, `sleep.cleanH`.** H3-CORE's `sleep.needed` finding is folded in here (§3a) and its other half is not closed: the engine states TWO different defaults for `cleanH` in its own code — `|| 7.5` at `sleep.cjs:1071` and `|| 8` at `sleep.cjs:925` — so there is no single engine-stated value and choosing one would invent a preference. Measured consequence, asserted by cell H3/S1 so it cannot be forgotten: `sleep.cjs:1051` compares against an absent member, so three clean 8.3 h nights still count as a run of **0**. It is not on Today's own projection, which is why it is a finding and not an S2 blocker. Closing it needs a ruling.

* **F-H — OPEN, two test files with no CI home.** The merged tip (`origin/rebuild/t2-client-core` @ `ec80cbe`) added `rebuild/m3/w7-preview/today/test/catalogue.test.mjs` and `problem.test.mjs`, and `.github/workflows/rebuild.yml` names **neither** — measured: the strings "catalogue" and "problem" do not occur in the workflow at all, so 2 of the 11 test files under that directory run nowhere in CI. A `rebuild.yml` change beyond `:142 (2)(b)` is not lane B's to make (the B-NTC precedent), so H3 raises it and cell H3/13 asserts the exact state instead, going red if a third appears or one of these two acquires a home.

* **A4b's own re-pin cell, AMENDED and disclosed.** `setup.test.mjs`'s `re-pin - every file the B-NTC package pins is untouched by A4b` asked "did ANYBODY move a B-NTC pin" and therefore went red on H3's own four declared changes. It now reads the CHILD's spec: a file is exempt only while it stands at the post-image `packages/H3.json` declares for it, so an undeclared change, a declared change that has not landed, and drift in any other pin all still go red, and with no such spec on the branch the exemption set is empty and it is the original cell.

* **SEAL ON THE TIP — CLOSED at `DECISIONS:145`.** The rule is ANCESTRY, and `SEAL_TIP_RULE` is `'ancestor'` in the merged runner (`59ecc7f9…`) with the ruling cited beside it. Measured on this head: the chain tip is an ancestor of HEAD. The earlier `--no-ff` reading is moot and lane B did not rebase.

* **The brief is ACCEPTED BY NAME at `DECISIONS:146 (2)`** (v1.3, sha256 `60567b60…`). Under `:135 (2)` the lane now appends its own two citation lines: a **THEME** line naming `M2-H3-CLEAN-INIT` and this brief path, and a **BRIEF-BY-SHA** line citing `rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md` by its sha256 and ending in the `ACCEPTED` terminal word, both in the `:122`/`:126` shape with the lineSha in the STATUS line. They are not yet on the chain branch, so `brief.acceptedLedgerLine` is `null` and `status` stays `PROPOSED` — neither can be struck off by declaration, and this revision (v1.7) supersedes the accepted v1.3 bytes, so the BRIEF-BY-SHA line must cite v1.8. The v1.6 pin in `packages/H3.json` (`9cef95a3…`) was STALE against the v1.6 bytes on disk (`f6c4c4df…`) — the r9 probe was right; v1.7 re-pins `brief.sha256` to the TRUE bytes of this revision.

## 10 · PROTECTED SURFACES · SIBLING NOTE

Never opened, hashed or quoted: `rebuild/conform/private/live.json` and the private `live.main` golden (absent from this worktree by design — `--full` would stop at `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, though on this head it fails earlier, at F-C's refused child, so the BLOCKED line is not reached); `rebuild/conform/goldens`. Two engine files change and both are proven inert against the census and the 45 laws above; every other file under `rebuild/engine` is byte-identical to `ce38aa3`.

**Sibling note.** B1 re-pins `rebuild/m4/workout/athlete-state.cjs` at its rebase. H3 lands before B1 in the ruled order (B-NTC → H3 → B1 → B2 → B4 → B3), so B1's pre-image for that file is `e1e05a63…`, and its pre-images for `writers.cjs`, `constants.cjs`, `rebuild.yml`, `journey.test.mjs` and `setup.test.mjs` are H3's post-images above, not the parent's.
