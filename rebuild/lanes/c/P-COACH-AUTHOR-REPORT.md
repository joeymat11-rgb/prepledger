# P-COACH Author Report

Ticket P-COACH. Lane C, screens/plumbing tier, size XS. Model Sonnet, effort medium. Role: author (composer).

## Admitted correction

Three accepted blobs taken byte-identical from `c21e64f2` (`preserve/coach-correction-tested`), verified identical to `a0e8ec38` (`preserve/coach-correction-400`) via `git diff --stat a0e8ec38..c21e64f2 -- <3 paths>` (empty).

| Path | Bytes | SHA256 | Match |
| --- | ---: | --- | --- |
| rebuild/coach/tools.cjs | 58784 | b2bb3c959840a3c9fa867b84e94df979bf8ec04b9a5b19701da07f72fb8e6037 | yes |
| rebuild/coach/coach-text.cjs | 14880 | 2e5213b99b469ec4fd079ed04c406061033437b40b0c1b82934ba24824c78147 | yes |
| rebuild/coach/test/science-correction-contract.test.cjs | 10886 | faa210fdef5037ece50239195bdf335b5189bfc11288eb9e2158a087082bf610 | yes |

No other file changed (`git status --porcelain` shows exactly these three). Workflow `rebuild.yml:158` glob `node --test "rebuild/coach/test/*.test.cjs"` already picks up the new test; no workflow edit made.

## BAR

| # | Item | Result |
| - | - | - |
| 1 | 3 blobs byte-identical to accepted hashes | PASS - certutil matches all three, diff between refs empty |
| 2 | `node --test rebuild/coach/test/*.test.cjs` >=201+cells, 0 fail | **FAIL** - 218 tests, 217 pass, **1 fail**: pre-existing `rebuild/coach/test/tiers.test.cjs:323` "the whole script over the real consent surface stays traceable and honest" asserts `/Recorded\./` against the acknowledgment text; the accepted correction's new wording ("Your acceptance was acknowledged...") no longer contains "Recorded." This file is outside the 3-file scope and was not touched (no weakening). **Impossible as written** without a 4th file or a scope waiver. |
| 3 | missing calorie/protein targets stay unknown | PASS - `science-correction-contract.test.cjs`: "missing target objects stay unknown while the supplied workout survives" and "null, partial and nonfinite targets preserve every other supplied field" (subtests "null calories", "null protein") all pass |
| 4 | all five tier-three refusals stay refused | PASS - "all five tier-three topics remain refused with no consent or engine action" passes |
| 5 | acknowledgment promises no applied programme | PASS - "acceptance rendering describes an acknowledgement, not durable application or a stored reason" passes |
| 6a | today suite by name | PASS - 553 tests, 553 pass, 0 fail (tip's count, not 565) |
| 6b | b-package.cjs --ci --package S3 | PASS - "0 unlisted drift"; "B PACKAGE S3 PUBLIC CI EVIDENCE PASS"; coach files absent from the 64-file parent-pinned product inventory (not engine pins) |
| 6c | A1 build (today) | PASS - see 6a |
| 6d | A5 builds | PASS - lockfile suites 44/44; deploy-folder suite 11/11 |
| 6e | rig187 | PASS - `rig187 => PASS` |

## Impossible item

Item 2 (0 fail) cannot be met while staying inside the 3-file scope: `tiers.test.cjs` line 323 is a pre-existing, out-of-scope test whose regex expectation was written against the pre-correction acknowledgment string. Fixing it needs either a 4th file admitted or a scope amendment; author did not touch it per instructions.
