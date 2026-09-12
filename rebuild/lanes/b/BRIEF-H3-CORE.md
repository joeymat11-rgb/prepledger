# BRIEF — M2-H3-CLEAN-INIT · H3-CORE v1.0 (lane B, child of M2-B-NTC)

**What this is.** The `DECISIONS:147` CONTINGENCY, built because H3 was not sealable by 21:00 ET: the **athlete-state-only half** of H3, so a clean-init athlete paints Today on 09-13. **No `rebuild/engine` byte moves.** `packageId` stays `M2-H3-CLEAN-INIT` — the runner's package-id list is closed and `H3` already exists, so this is the same package at a smaller scope, on `rebuild/lane-b-h3-core`. Parent: the sealed and INTEGRATED B-NTC artifact `87f4848c…` at `9ad2ecab`, receipt `:141`, integrated at `ce38aa3` (ledger `:144`). `sourceBase` is `ce38aa3`.

**Scope = three things and nothing else.** (1) `DECISIONS:124` — `createCleanInitState` writes the two members the accepted engine dereferences without a guard, `blackout` and `model`. (2) Lane C's new **H3-class finding** (`REQUESTS 04:11 (1)`) — `sleep.needed`. (3) The `.github/workflows/rebuild.yml` enumeration of `setup.test.mjs` that `:142 (2)` option (b) rides on H3's seal.

**DEFERRED to the full H3 on `rebuild/lane-b-h3` @ `902fd88`, with the reason.** **F-B** (the first weigh-in must not make the trend NaN) is an edit to `rebuild/engine/writers.cjs`; **F2 LABEL** (`MG_LABEL` region heads) is an edit to `rebuild/engine/constants.cjs`. Both are reverted here to the tip's bytes (`00291236…`, `954e4f4b…`) and both stay on the full branch. The reason is not preference: an engine byte is what puts the five inherited B-NTC carriers out of reach (BRIEF-H3-CLEAN-INIT v1.7 §9 measures that to the bottom), and H3-CORE exists to be the half that does not depend on that question being answered. **F-B is still an S2 blocker and is not closed by this package** — the owner must hold his first weigh-in until the full H3 merges, which is exactly what `:147`'s contingency says.

## 1 · READ-LIST

`DECISIONS:124` (the H3 ruling) · `:142 (2)(b)` (the `rebuild.yml` enumeration rides H3) · `:146 (1)` and `:147` (the successor grant, its widening, and this contingency) · `rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md` v1.7 §9 (why the five inherited carriers are out of reach, measured) · `rebuild/lanes/REQUESTS.md` 2026-09-12 04:11 (1) (lane C's `sleep.needed` finding) · `rebuild/m4/workout/athlete-state.cjs` · `rebuild/engine/{sleep,today,energy,constants}.cjs` (the unguarded readers) · `rebuild/m3/w7-preview/today/test/setup.test.mjs` (lane C's red-first H3 cell) · `rebuild/m3/w6/host/test/journey.test.mjs` §1 · `rebuild/lanes/b/tooling/README.md` §successors · `packages/{H3,B-NTC}.json`.

## 2 · H3 — THE TWO MEMBERS, AND EVERY VALUE'S DERIVATION

Unchanged from BRIEF-H3-CLEAN-INIT §3, which stays the reference: `blackout.until` is **the day before `split.from`** (the tenth reader, `sleep.cjs:1879`, is INCLUSIVE, so `until = split.from` marks the athlete's own first weigh-in `sealwater` — measured); `model.anchorISO` is `split.from`; `model.drip` is `null`, the member's own documented absence, which `energy.cjs:21 dripOf` answers with the engine's stated `DRIP_DEFAULT`; `model.src` is `null`; **`model.lean` is deliberately absent** because the setup document carries no body composition, and both alternatives were driven through the real screen — `lean: null` coerces to 0 and PRINTS "0 g protein", the absent member is non-finite and Today says "Not available yet". `closed()` pins both member sets (`STATE_BLACKOUT_MEMBER_SET`, `STATE_MODEL_MEMBER_SET`), neither in the athlete-facing `CLEAN_INIT_*` vocabulary, because no setup document a screen can produce reaches them.

**F-A stands unchanged and unclosed.** `energy.cjs:117 proteinTarget` has no gated branch of its own; the view layer's `Number.isFinite` is what keeps a figure off the screen. Cells H3/5 pins both halves.

## 3 · `sleep.needed` — LANE C'S H3-CLASS FINDING, AND THE VALUE

`createCleanInitState` wrote `sleep: { nights: [] }`. **Four accepted readers dereference `s.sleep.needed` with no guard of their own**, and all four are measured on this head:

| Reader | Pre-image (`needed` absent) | H3-CORE |
| --- | --- | --- |
| `today.cjs:266` (`fiveLevers`) | SLEEP lever detail = **`0/undefined clean`** | `0/3 clean` |
| `sleep.cjs:1903` (`sleepInfo`) | `need: undefined`, and **`JSON.stringify` DROPS the member** — a host reading the projection sees no `need` at all | `need: 3`, surviving the round trip |
| `sleep.cjs:239` (`recoveryIndex`) | `sleep reset — 0 of undefined clean nights` and **`NaN more nights`** (`Math.min(3, undefined − 0) * 10`) | `3 more nights`, no `NaN` |
| `sleep.cjs:1053` (`atSleepTarget`) | `at: 0 >= undefined` — **false for ever**, not just on day one | `at: 0 >= 3` — false now, REACHABLE later |

The `0/undefined clean` string is not a day-one curiosity: `today.cjs:263` takes the "N nights dark" branch only while there is no night for yesterday, so the word `undefined` reaches the SLEEP lever the moment the athlete logs his first night.

**THE VALUE IS 3, AND IT IS NOT TYPED IN `athlete-state.cjs`.** It is read at load time out of the engine's own `rebuild/engine/constants.cjs` — `SLEEP_ANCHOR_MIN_N` (`constants.cjs:315`), the one named sleep-night-count constant the engine exports. `createConstants()` is a pure factory with no clock, no history and no state, so the module's "no clock" rule holds. This is **not** a copy of `rebuild/engine/seed.cjs:80`'s `sleep: { cleanH: 7.5, needed: 3 }` — that file is one athlete's record and the H1 rule forbids reading it; a cell asserts this module never names it and never types the digit. The engine states the same 3 twice more in its own logic: `sleep.cjs:1041` `if (run.length < 3) return true` (its own debt run) and `sleep.cjs:239` `Math.min(3, s.sleep.needed - slp.run) * 10`, which caps the sleep restriction's weight at three nights — so any larger `needed` would change no weight and only make the sentence unreachable. **What the readers expect for ZERO nights is unchanged**: `run` is 0 and `at` is false, exactly as before; the difference is that the target can now be reached and the screen prints a number he can count towards. `closed()` pins the member set (`STATE_SLEEP_MEMBER_SET`, `SLEEP_MEMBERS = ['nights','needed']`), so `nights` is still `[]` — nothing is seeded.

**F-G — OPEN, AND HELD OPEN BY A CELL.** `s.sleep.cleanH` is the other half of the same pair and is **deliberately not written**: the engine states TWO different defaults for it in its own code — `|| 7.5` at `sleep.cjs:1071` (`sleepAnchor`) and `|| 8` at `sleep.cjs:925` (`lightsOutT`) — so there is no single engine-stated value and choosing one would invent a preference on the athlete's behalf. **The measured consequence, asserted so it cannot be forgotten:** `sleep.cjs:1051` compares `nights[i].h >= s.sleep.cleanH` against an absent member, so three clean 8.3 h nights still count as a run of **0** and `atSleepTarget` stays false however well he sleeps. It is **not** on Today's own projection (the view carries no `undefined` text on this state — asserted), which is why F-G is an open finding and not an S2 blocker. Closing it needs a ruling on which of the engine's own two defaults is the clean-night bar; lane B does not choose.

## 4 · HUNKS (sha256, `ce38aa3` → HEAD)

| File | Role | pre → post |
| --- | --- | --- |
| `rebuild/m4/workout/athlete-state.cjs` | new to the pinned inventory | `dccc5fb5…` → `d0e26f74…` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | edited (the A0 cell that asserted the absence) | `228c076d…` → `7b78319e…` |
| `rebuild/m3/w7-preview/today/test/setup.test.mjs` | new to the pinned inventory (lane C's H3 cell flips) | `264358a0…` → `842e2f49…` |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | new | absent → `f384c589…` |
| `.github/workflows/rebuild.yml` | edited (`:142 (2)(b)`) | `839a79ab…` → `cf4b83c1…` |
| `rebuild/engine/writers.cjs` | **carried** — F-B deferred | `00291236…` (unmoved) |
| `rebuild/engine/constants.cjs` | **carried** — F2 LABEL deferred | `954e4f4b…` (unmoved) |
| `b-package.cjs`, `packages/B-NTC.json` | superseded-by-child (the r9/r9b tooling merge) | `c609cf71…`, `370d0b91…` |

`journey.test.mjs` §1 asserted `deepEqual(engineState.sleep, { nights: [] })` and `for (const absent of ['trend','model','blackout','feedRules'])` — the very absences H3 closes. Both now assert the stronger thing: the objects are present, closed over the module's own declared member sets, `nights` is still empty, and `sleep.needed` IS the engine's exported constant. `trend` and `feedRules` stay absent.

## 5 · THE FIVE INHERITED B-NTC CARRIERS STILL REFUSE — MEASURED, AND NOT BECAUSE OF THE ENGINE

`:147`'s contingency assumed that with no engine byte changed the five inherited carriers would run the parent's originals green. **They do not, and the reason is a second wall that has nothing to do with `rebuild/engine`.** Measured on this head, one layer at a time:

1. `b-ntc-successors.cjs:141` — `Exact actual child supersession .github/workflows/rebuild.yml` (`+cf4b83c1… −839a79ab…`). `actualChild()` reads `CHILD_SPEC = packages/B-NTC.json` and holds every path B-NTC declares `superseded-by-child` at **B-NTC's own post**. The `:142 (2)(b)` enumeration hunk moves one of them.
2. With `rebuild.yml` reverted in scratch, one layer on: `b-ntc-successors.cjs:145` — `Exact declared child bytes rebuild/m3/w6/host/test/journey.test.mjs` (`+7b78319e… −228c076d…`). The same function holds **every file `packages/B-NTC.json` declares in `product`** at B-NTC's own post, and `journey.test.mjs` is one. H3 cannot avoid changing it: flipping that A0 cell IS `DECISIONS:124`.
3. The one substitution that would repoint both — `const CHILD_SPEC = 'rebuild/lanes/b/tooling/packages/B-NTC.json';` → `…/packages/H3.json`, an admissible PATH re-target over a path this package declares `superseded-by-child` — was built and run against the blob at `9ad2ecab…`. It refuses one layer deeper: `Declared supersession role rebuild/m4/workout/engine-runtime.cjs (+'carried' −'superseded-by-child')`. The parent's `SUPERSEDED` list admits only files the child declares `superseded-by-child`, and `b-package.cjs:1400` refuses that role for a parent **product** pin by name (`PRODUCT-ROLE-MISLABELLED`) — `engine-runtime.cjs` is one, carried byte-identical here.
4. `packages/B-NTC.json` itself is **not an admissible substitution target**: `SUCCESSOR-SUBSTITUTION-TARGET-SHAPE` fixes the root at `rebuild/m4/spec/`.

**So the finding generalises, and it is the PM's to rule on: no child of M2-B-NTC can change ANY file `packages/B-NTC.json` declares — engine byte or not — and still carry the five inherited carriers.** H3-CORE's `--ci` therefore ends exactly where the full H3's does, at `Required child source-carriers`, and the contingency does not by itself buy a seal. What it does buy is a strictly smaller, engine-untouched package that closes `:124` and lane C's `sleep.needed`, is ready to seal the moment the successor question is ruled, and holds `coverage.successors` at `null` rather than declaring a successor that carries nothing. The unblocking options are BRIEF-H3-CLEAN-INIT v1.7 §9's (a) and (b), plus a third this branch adds: **(c)** `actualChild()`'s child-state model is re-expressed against the CHILD's own declared roles rather than B-NTC's, which is a reviewed change to `b-ntc-successors.cjs` — an accepted parent product path — and therefore also a ruling, not a build.

## 6 · CELLS — `rebuild/m4/workout/test/h3-clean-init.test.cjs`, 9/9 GREEN, exit 0

H3's own clean-init cells, minus the F-B and F2 ones, plus the `sleep.needed` cell: **H3/1** the constructor writes both members and `closed()` pins each set · **H3/2** every value is this athlete's own setup date or an explicit absence (the H1 rule, executed) · **H3/3** lane C's four A4 states, the fourth now produced by the constructor · **H3/4** no engine reader throws and none is in a blackout · **H3/5** Today paints and shows no number he has not given it (every digit on the screen is his own) · **H3/6** the gym card opens and closes on day+0 and day+3 · **H3/7** **seven** named mutants, each killed by a named cell (M7 is new: `sleep.needed` typed as a literal instead of read from the engine — it produces the same number today, which is why a value test alone would miss it) · **H3/S1** `sleep.needed`, RED-FIRST over the pre-image shape, with F-G held open · **H3/13** the CI today step enumerates `setup.test.mjs`, named and not globbed.

**RED-FIRST, MEASURED.** With the parent's `athlete-state.cjs` (`dccc5fb5…`) in place of ours the file is **1 pass / 8 fail** — every cell but H3/13, which guards a CI line and is not red-first by design. **H3/8–H3/12 of the full package (F-B and F2 LABEL) are absent here**, not weakened: they stay on `rebuild/lane-b-h3`.

## 7 · UNMOVED, AND THE CENSUS

| Suite | Parent `ce38aa3` | H3-CORE |
| --- | --- | --- |
| the **eight** enumerated today files | 268/268 exit 0 | **268/268 exit 0** (`setup.test.mjs` **104/104** — lane C's H3 cell paints Today) |
| A0 `journey` + `engine-equivalence` | 23/23 | **23/23 exit 0** |
| B-NTC provider `native-trend-context` | 39/39 | **39/39 exit 0** |
| `local-host-journey` + `local-today-journey` | 68/68 | **68/68 exit 0** |
| `copy.test.mjs` | 36/36 | **36/36 exit 0** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate` | **identical line** |
| B-NTC's own five inherited carriers | green | **refuse — §5, and NOT over an engine byte** |

**Public census.** `node rebuild/conform/run.cjs` gives an **81-line** log whose bytes are identical to the same run on `rebuild/lane-b-h3` @ `902fd88` **except for the worktree path printed in the engine-artifact line** (10 bytes, exactly the `h3-core`/`h3` directory-name difference on two lines) — so no engine change is observable in the census, which is the point: this package makes none. Said plainly: that line reads `BAD 0 engine artifacts present` on BOTH branches in this worktree layout, because the census looks for the built engines at `/tmp/rig174/`; the comparison is therefore a same-versus-same identity, not a green census.

## 8 · PROTECTED SURFACES · SIBLING NOTE

Never opened, hashed or quoted: `rebuild/conform/private/live.json` and the private `live.main` golden (absent from this worktree by design — `--full` would stop at `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, though on this head it fails earlier at §5's refused child); `rebuild/conform/goldens`. **No `rebuild/engine` file changes at all**, so there is nothing to prove inert against the census or the 45 laws.

**Sibling note.** B1 re-pins `rebuild/m4/workout/athlete-state.cjs` at its rebase. If H3-CORE lands before B1, B1's pre-image for that file is `d0e26f74…`; if the full H3 lands instead it is the full package's own post. B1's pre-images for `writers.cjs`, `constants.cjs` and `rebuild/engine/constants.cjs` are **the parent's**, unmoved by this package. `rebuild.yml`, `journey.test.mjs` and `setup.test.mjs` carry this package's posts above.
