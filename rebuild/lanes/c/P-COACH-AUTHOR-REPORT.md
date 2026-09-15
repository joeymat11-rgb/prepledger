# P-COACH Author Report

Ticket P-COACH. Lane C, screens/plumbing tier, size XS. Model Sonnet, effort medium. Role: author (composer).

## Admitted correction

Three accepted blobs taken byte-identical from `c21e64f2` (`preserve/coach-correction-tested`), verified identical to `a0e8ec38` (`preserve/coach-correction-400`) via `git diff --stat a0e8ec38..c21e64f2 -- <3 paths>` (empty).

| Path | Bytes | SHA256 | Match |
| --- | ---: | --- | --- |
| rebuild/coach/tools.cjs | 58784 | b2bb3c959840a3c9fa867b84e94df979bf8ec04b9a5b19701da07f72fb8e6037 | yes |
| rebuild/coach/coach-text.cjs | 14880 | 2e5213b99b469ec4fd079ed04c406061033437b40b0c1b82934ba24824c78147 | yes |
| rebuild/coach/test/science-correction-contract.test.cjs | 10886 | faa210fdef5037ece50239195bdf335b5189bfc11288eb9e2158a087082bf610 | yes |

Workflow `rebuild.yml:158` glob `node --test "rebuild/coach/test/*.test.cjs"` already picks up the new test; no workflow edit made.

## Fourth disclosed file (PM routing, DECISIONS:427 (2), origin 408a42f1)

`rebuild/coach/test/tiers.test.cjs` - ONLY the `q18` assertion at ~:323 in "the whole script over the real consent surface stays traceable and honest" is edited; every other assertion in the cell is byte-unchanged.

- Before: `assert.match(run.turns.find((t) => t.id === "q18").answer, /Recorded\./);`
- After: `assert.match(run.turns.find((t) => t.id === "q18").answer, /Your acceptance was acknowledged\./);`

Exact accepted sentence, quoted from `rebuild/coach/coach-text.cjs:130` (`accepted:` template): "Your acceptance was acknowledged. This response does not confirm that the plan was applied or the reason durably saved. "

After PM routing: `git fetch origin && git merge origin/rebuild/t2-client-core` (clean merge, no conflicts, tip now at merge of `408a42f1`/`9163027`).

## BAR (re-run after merge + 4th-file edit)

| # | Item | Result |
| - | - | - |
| 1 | 3 blobs byte-identical to accepted hashes | PASS - certutil matches all three, diff between refs empty |
| 2 | `node --test rebuild/coach/test/*.test.cjs` by name, 0 fail | PASS - 218 tests, 218 pass, 0 fail |
| 3 | missing calorie/protein targets stay unknown | PASS - `science-correction-contract.test.cjs`: "missing target objects stay unknown while the supplied workout survives" and "null, partial and nonfinite targets preserve every other supplied field" (subtests "null calories", "null protein") all pass |
| 4 | all five tier-three refusals stay refused | PASS - "all five tier-three topics remain refused with no consent or engine action" passes |
| 5 | acknowledgment promises no applied programme | PASS - "acceptance rendering describes an acknowledgement, not durable application or a stored reason" passes |
| 6a | today suite by name | PASS - 565 tests, 565 pass, 0 fail (tip count) |
| 6b | b-package.cjs --ci --package S3 | PASS - "0 unlisted drift"; "B PACKAGE S3 PUBLIC CI EVIDENCE PASS"; coach files absent from the 64-file parent-pinned product inventory (not engine pins) |
| 6c | A1 build (today) | PASS - see 6a |
| 6d | A5 builds | PASS - lockfile suites 44/44; deploy-folder suite 11/11 |
| 6e | rig187 | PASS - `rig187 -> PASS` |

All BAR items pass; no impossible items remain.
