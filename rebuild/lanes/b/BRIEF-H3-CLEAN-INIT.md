# BRIEF — M2-H3-CLEAN-INIT (lane B, child of M2-B-NTC)

`DECISIONS:124` RULED: `createCleanInitState` writes neither `blackout` nor `model`, so the accepted engine **throws** for a brand-new athlete and Today stands on the preview's sample athlete (S2 blocker beside B-NTC). Rehearsed against the B-NTC candidate head `b8d5cc7` (`:116 (3)`); only pins move after B-NTC seals. Branch `rebuild/lane-b-h3`. `git diff b8d5cc7 -- rebuild/engine` is **empty**.

## 1 · READ-LIST

`DECISIONS:124` · `rebuild/lanes/REQUESTS.md` 2026-09-11 20:45 ET (lane C's finding, throw sites) · `origin/rebuild/lane-c-a4:rebuild/m3/w7-preview/today/test/setup.test.mjs` cell `H3 - the accepted engine still cannot paint Today for a clean-init athlete` + `…/A4-REVIEW-ANNEX.md` §H3 (ported in §5) · `rebuild/m4/workout/athlete-state.cjs` · `rebuild/engine/{energy,sleep,writers,today,dates,seed,constants}.cjs` (§2) · `origin/rebuild/lane-c-a4:…/setup-model.mjs` (what setup collects) · `rebuild/lanes/b/tooling/README.md` + `packages/{H3,B-NTC}.json` · `BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` §1–§6 · `PLAN-TRACK-B-PACKAGES-v1.md` §3.

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

## 3 · THE MEMBER SET, AND EVERY VALUE'S DERIVATION

`REQUIRED_SETUP` is `athlete_label, split, exercises, priority_muscles` — **no bodyweight, no body-fat reading** (checked against lane C's `setup-model.mjs`). `split.from` is the athlete's setup date (A4 S6) and is the only value H3 derives anything from. Nothing comes from `seed.cjs:70/:78` (`lean 139.7`, `anchorISO "2026-07-21"`, `src "coach's eye"`, `SEAL_UNTIL`) — the H1 rule, executed both ways by H3/2.

    blackout: { until: <the day BEFORE split.from> }
    model:    { anchorISO: split.from, drip: null, src: null }

* **`until` = the day before, not the setup date.** Nine of ten readers ask `daysUntil(until) > 0` (`dates.cjs:17`; on the day itself that is `0`), so either choice leaves no blackout in force. The tenth does not: `sleep.cjs:1879` is **inclusive**, and with `until = split.from` the first weigh-in comes back `dayWeather(split.from).flags = [{k:"sealwater", why:"scale carries event water — sealed window"}], noisy: true` — **measured**. One day earlier and the window is empty for every day he can ever have, because he cannot weigh in before he set the app up. Pure UTC arithmetic; the module still has no clock.
* **`anchorISO` = `split.from`** — `weeksBetween` is 0 on day one, not a distance from a stranger's anchor. **`drip` = `null`** — the member's own documented absence: `dripOf` tests `d == null` and uses the engine's own `DRIP_DEFAULT` (`constants.cjs:68`, `0.0`). **`src` = `null`** — every reader compares `=== "DEXA"`; no scan and no eye is claimed.
* **`lean` is DELIBERATELY NOT WRITTEN** — the one place :124's sketch would have invented a figure (**finding F-A**). Both candidates driven through the real screen:

| `model.lean` | `bfEst` | `proteinTarget` | `today-app.cjs:209` `Number.isFinite(g)` | Screen |
| --- | --- | --- | --- | --- |
| `null` | `lean: 0` (null coerces) | `g: 0, ffmKg: 0` | **true** | **"0 g protein"** |
| absent | non-finite | `g: NaN` | false | **"Not available yet"** |

With a bodyweight on file `null` is worse: `pct = ((trend-0)/trend)*100` = **100.0 % body fat**. `NaN` is no third option — `writers.cjs:424` `applyRead` round-trips through `JSON.parse(JSON.stringify(…))`, turning `NaN` into `null`, i.e. into the `0` above at the first weigh-in. An absent member survives absent.

## 4 · THE HUNK

`rebuild/m4/workout/athlete-state.cjs` — the only product file H3 edits. pre (at `b8d5cc7`) `dccc5fb5d35de12652f70e2d12c3e0e156181a8fe93b53cd296ddc52fa56f06c` → post `318357b199bb782d1714b2b1baa193bacfc10d37fb4ef081d9b6c42f394dd1cb`. Four changes: (1) `BLACKOUT_MEMBERS`/`MODEL_MEMBERS`, exported, so a cell reads the closed set from the module's own declaration; (2) `dayBefore`/`dayAfter`, pure UTC arithmetic with a calendar round-trip guard (`2026-02-30` passes `checkSplit`'s shape test and would hand the engine a silently normalised window — it now refuses `CLEAN_INIT_SPLIT_REQUIRED / from must be a real calendar day`); (3) the two objects built, **pinned by `closed()`** (`CLEAN_INIT_BLACKOUT_REQUIRED`, `CLEAN_INIT_MODEL_REQUIRED`) and written into the state so `freezeDeep` reaches them; (4) the comment block carrying §2–§3. Still imports nothing from `rebuild/engine`.

**One test cell also moves, and cannot not.** `rebuild/m3/w6/host/test/journey.test.mjs:122` asserted `for (const absent of ['trend','model','blackout','feedRules'])` — the very absence H3 closes. It now asserts the stronger thing (present; closed over the declared sets; each value the setup date or an absence; `lean` absent) and keeps `trend`/`feedRules` absent. pre `228c076dbc0b1fde64d0ccf235486ef92f6c3434489d6e1ade0967d824935cc3` → post `aecb8fe4980ce65ebb6488310302458dffc9b15a30aeeae1238b8491287f1832`. Consequence: **finding F-C**.

## 5 · CELLS — `rebuild/m4/workout/test/h3-clean-init.test.cjs` (new)

**RED at `b8d5cc7`: 6 of 7 fail. GREEN after: 7 of 7, exit 0.**

| Cell | Executes | RED at parent |
| --- | --- | --- |
| H3/1 | both members written; `closed()` pins each set; frozen; survives the engine's JSON round trip | yes |
| H3/2 | every value is the setup date or an absence; no seed value anywhere; every setup-document value round-trips | yes |
| H3/3 | **lane C's four states, ported**: throw on `until`; `blackout:{}` throws in `dates.cjs`; a valid blackout only moves the throw to `anchorISO`; **state 4 now paints from the constructor's own state** | yes |
| H3/4 | all seven Today readers + `blackoutOn`/`dayWeather`/`weekWeather`/`observedTDEE`; no `sealwater`, `noisy:false`; the first weigh-in is not `sealed` | yes |
| H3/5 | **no invented number**: `proteinTarget.g/ffmKg/bf` non-finite, protein slots read "Not available yet", no `NaN` on screen, the only digits are the date and the lifts he declared | yes |
| H3/6 | the gym card day+0 and day+3, a page load each, B-NTC's `lane`/`conductDay` helpers reused | no — green both sides, which is the point |
| H3/7 | the six mutants, each on a private compilation of a copy | yes |

Lane C's cell asserted only `doesNotThrow` for state 4, over `{anchorISO, anchorLb, k}`. H3/5 is the bar that shape does not meet.

## 6 · MUTANTS — six, each killed by a named cell

| Mutant | | Killed by |
| --- | --- | --- |
| M1 | a member removed — `blackout` loses `until` | H3/1, H3/3 state 2 |
| M2 | `until` in the future — a blackout in force from day one | H3/2, H3/4 (`blackoutOn` true) |
| M3 | a copied seed value — the owner's own anchor (`seed.cjs:70`) | H3/2, the H1 rule executed |
| M4 | a model member renamed (`anchorISO`→`anchorIso`) | H3/1, H3/3 state 4 |
| M5 | `closed()` skipped, so the seed's `reason` member drifts in | H3/1 (`Reflect.ownKeys`), H3/2 |
| M6 | a NaN date — the calendar round-trip guard removed | H3/7 (`2026-02-30` slides into March) |

A mutation whose `from` is not present exactly once refuses rather than applying to nothing.

## 7 · UNMOVED, MOVED, CENSUS

| Suite | Parent `b8d5cc7` | H3 |
| --- | --- | --- |
| the seven enumerated today files | 164/164 exit 0 | **164/164 exit 0** |
| A0 (`journey` + `engine-equivalence`) | 23/23 exit 0 | **23/23 exit 0** (with §4's moved cell) |
| B-NTC provider (`native-trend-context`) | 39/39 exit 0 | **39/39 exit 0** |
| `local-host-journey` / `local-today-journey` | 17/17, 51/51 | **17/17, 51/51** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate`, exit 1 | **identical line, exit 1** |
| B-NTC's nine own carriers | green | **all refuse at one pin — F-C** |

**Public census: untouched and byte-identical.** Clean-init is not in it — the census runs over the frozen app's goldens and `createCleanInitState` has none. Nothing under `rebuild/conform/goldens` is read or written and no engine byte moves, so the census line cannot differ. **No private fixture in this worktree**: `--full` stops at the BLOCKED line.

## 8 · FINDINGS — routed, not papered over

* **F-A · `proteinTarget` has no gate.** `energy.cjs:116` always returns a figure, unlike `calorieTarget`/`stepTarget` which return `{gated:true,…}`. For an athlete with no anchor it returns `NaN` (or `0` on the `lean:null` shape); what keeps that off the screen is `today-app.cjs:209`'s `Number.isFinite` gate — a **view-layer** guard, not an engine one. Engine tier, beside H1/H2; closing it needs an engine edit this package does not make. H3/5 pins both halves so it cannot drift.
* **F-B · `applyRead` has no first-read branch.** `writers.cjs:451` `s.trend = +(s.trend + 0.3*dCl).toFixed(1)`. A clean-init state carries no `trend` — nor may it, the athlete has declared no bodyweight — so his **first weigh-in makes `trend` NaN** and every figure downstream stays non-finite. H3 does not close this and must not: any `trend` it wrote would be an invented bodyweight. Engine tier. Measured.
* **F-C · H3 cannot close the item without moving a byte B-NTC pins.** B-NTC's spec and artifact pin `journey.test.mjs` in `product`, and all nine B-NTC carriers share one `preflight()` asserting every pin against disk — so §4's unavoidable cell move refuses them **at the pin**, before an assertion runs. This is the ordinary child re-pin (see §9), not a regression: **`228c076d… → aecb8fe4980ce65ebb6488310302458dffc9b15a30aeeae1238b8491287f1832` in `packages/B-NTC.json`, in `acceptance-b-ntc-native-trend-context.json` and in `b-ntc-journeys.cjs`'s own pin**, taken when H3 merges. An OPEN obligation of this package, and the PM's to authorise.
* **F-D · the runner has no seat for H3.** `NO_REGISTER_IDS` is `{B-NTC, B-LOM}`, fixed in `b-package.cjs` (W7), so `--ci --package H3` refuses at `REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT H3`, **exit 1**, before the runner pin or any child. H3 genuinely has no D-id: `:124` rules it **engine-tier** beside H1/H2, and D1–D45 is the M2 audit register, none of which H3 repairs; declaring one would be a false spec. **For the tooling pass, one reviewed line:** add `'H3'` to `NO_REGISTER_IDS`. H3 then falls under TOOLING-REVIEW-r4 Y1 and owes its own executed children, which it has — `h3-cells` runs `rebuild/m4/workout/test/h3-clean-init.test.cjs`, declared `role: "new"`. This builder did **not** edit the runner.

## 9 · PROTECTED SURFACES · SIBLING NOTE

Never opened, hashed or quoted: `rebuild/conform/private/live.json` and the private `live.main` golden (absent here by design); `rebuild/conform/goldens`; every file under `rebuild/engine`.

**Sibling note.** B1 re-pins `rebuild/m4/workout/athlete-state.cjs` at its rebase. H3 lands before B1 in the ruled order (B-NTC → H3 → B1 → B2 → B4 → B3), so B1's pre-image for that file is `318357b199bb782d1714b2b1baa193bacfc10d37fb4ef081d9b6c42f394dd1cb`, not `dccc5fb5…`. F-C's `journey.test.mjs` re-pin travels with it.
