# P5-N2 COMPOSER REPORT

Lane C / Model Sonnet / effort medium. Composer only (no new build).

## History
1. `git merge --no-ff origin/rebuild/astra-c-n2-r4` (bfc29357, carrying
   origin/rebuild/lane-c-n2 @ 744c63c9) onto origin/rebuild/t2-client-core @ 92d6fc8.
   Clean `ort` merge, zero conflicts: c8ce1f37.
2. `git merge origin/rebuild/t2-client-core` after the tip moved to 408a42f1
   (S3 + P0-B integrated): 8fbc894, see Conflicts below.
3. PM routing DECISIONS:427 (1): relocated `test/sleep.test.mjs` into
   `test/problem.test.mjs` (closest import fit), added bar-item-4 cell N2-19: e5c56aa.
Final HEAD (branch `rebuild/c-n2-admission`): `e5c56aa9390a71947f28c5da990c75649951b69d`.

## Diff stat vs the tip (origin/rebuild/t2-client-core @ 408a42f1)
14 files, +4680/-9: rebuild/coach/local-world.mjs; rebuild/lanes/c/{N2-R4-REPORT.md,
P5-N2-COMPOSER-REPORT.md}; rebuild/m3/w7-preview/today/{build.mjs, design.cjs,
preview.css, screens.template.html, today-app.cjs, today-model.cjs,
test/problem.test.mjs}; and new sleep-check.mjs, sleep-commands.cjs, sleep-host.mjs,
sleep-model.cjs. No new file; no pinned/sealed path touched.
## Conflicts (today-app.cjs; today-model.cjs auto-merged clean)
Both hunks were additive (N2 vs P0-B), resolved by keeping both:
1. `mountToday`'s returned object: kept N2's sleepPending/sleepReady/
   sleepCheckInReady/checkInKitReady/sleepLane/sleepAck/sleepMount/workoutEntry/
   workoutRebound AND appended P0-B's `ready` (the boot chain's settle promise).
2. `module.exports`: kept N2's SLEEP_* constant list AND appended P0-B's
   `athleteStateFailureCopy`.
Verified: `node -e "require('./today-app.cjs')"` loads clean; no marker left.
## Relocation (PM routing DECISIONS:427 (1))
sleep.test.mjs's N2-01..N2-18 cells moved into problem.test.mjs (it already
imports TodayApp/TodayModel/design/build.mjs/faultDatabase/setup-model.mjs, the
closest fit). Deduped identical helpers already there (DAY, AI_DASH, `shell()`,
`opsOf`); renamed `firstRunDocument` to `sleepFirstRunDocument` (13 sites) and the
sync `fs` import to `fsSync` to avoid colliding with problem.test.mjs's own
same-named fixture / `fs`-promises. Added new imports only (sleep-host.mjs,
sleep-commands.cjs, sleep-model.cjs, client/ops.cjs, checkin-model.mjs,
createCleanInitState). test/ now has exactly the 13 names h3-clean-init.test.cjs
(DECISIONS:186) requires, no new file. All 9 N2 product files are byte-identical
to bfc29357: `git diff bfc29357 HEAD -- <each>` is empty.
## Bar (1)-(5): N2 cells and quoted pass lines (all now in problem.test.mjs)
1/2. `N2-03 - every projected h deep-equals a direct writers.cjs sleepSpanH call`;
   `N2-10 - the night reaches the state the workout preparation and Today read`
   (Today/workout); `N2-08 - a saved night is what the check-in own reader finds,
   with no A3 edit` (check-in).
3. `N2-13 - an existing basis night survives, and a same-date correction keeps
   the rest`.
4. **New cell N2-19** (none existed; added per this routing): `N2-19 - with no
   nights recorded the engine reads UNKNOWN, never zero, and applies no
   restriction (D8, DECISIONS:109 PATH A)` - asserts the engine's own
   `sleepInfo(state).last` is `undefined` (never `0`), `cleanAtDate(state, DAY)`
   is `true` for a zero-night basis, and `bare.read().blocked` is `false`.
5. `N2-01 - unknown keys, foreign shapes and a forged check-in reference all
   refuse` (`score`/`quality` inputs are SLEEP_INPUT_INVALID).
## BAR (6) - re-executed on Joe's PC, all PASS
| Check | Result |
|---|---|
| Today suite (13 files, `node --test`) | 643/643, 0 fail |
| W6 | 552/552, 0 fail |
| A0 | 23/23, 0 fail |
| `b-package.cjs --ci --package S3` | PASS: all 13 children OBSERVED (h3-cells, a0-journeys, today-suites, ntc-provider-cells included), 0 unlisted drift, `PUBLIC CI EVIDENCE PASS` |
| A1 build | PASS (`A1 TODAY BUILD PASS`, build earned-e8c87daf9079) |
| A5 build | PASS (`A5 PWA BUILD PASS`, 13 files) |
| rig187 | PASS |

## Collisions
Two additive hunks in today-app.cjs (above), resolved keeping both behaviours.
No pinned/sealed file touched at any step.
