# P3-HARDEN - author report

Ticket P3-HARDEN (DECISIONS:454/431 pt 17). Lane C, size S. Author only,
nothing pushed. Invented bundles only, cloned in memory from the public
`preimage-2026-08-15.json` fixture; nothing private, ledger or soak read.

## Round 1 (accepted with follow-ups; see round 2)

`port.cjs` gained seal-time `shapeIssues()` (missing/wrong-typed/bad-date
guarded classes) and `syncedFolderRefusal` wired into `outRefusal`. 21 cases
in `test/port-harden.test.cjs`; README + RUNBOOK updated. Deviation
disclosed: `waist` absence tolerated (pinned `local-source-consumer.test.mjs`
requires it). CI home not wired (disclosed, not forced).

## Round 2 (this commit) - PM order closing all round-1 follow-ups

| item | disposition | cell(s) |
|---|---|---|
| A/1/3 nights+corr `typeof d==='string'` pre-guard | CLOSED: `Object.hasOwn(entry,'d')` -> `PORT_SOURCE_SHAPE_INVALID` when absent; present-and-invalid (numeric/object/string) -> `PORT_SOURCE_DATE_INVALID` | `sleep.nights: numeric d, missing d and object d are all refused` |
| 1 `--local` not shape-checked | CLOSED: `shapeIssues()` re-run on `prepared.localState()` before the gate, codes prefixed `local:`, nothing written on refusal | `--local with a bad date refuses`, `--local with a missing class refuses`, `a clean --local still seals PASS` |
| 2 corrections read vacuous `entry.d` | CLOSED: validates the day inside `op` (`kind:YYYY-MM-DD:id`) and `at` via `Date.parse`; README states exactly this | `corrections: op day 2026-02-30 refuses`, `...malformed op) refuses`, `...unparsable at refuses`, `...valid op and at are accepted` |
| 4 privacy echo of non-string `d` | CLOSED: string values only, truncated to 10 chars; any other type prints `<typename>`, never the value | `privacy: an object reads[].d never echoes...`, `a malformed string date is still echoed, truncated to 10 characters` |
| 5 README U+2014 x5 + cell (f) gap | CLOSED: the 5 new-line em dashes replaced with ASCII; cell (f) now asserts the three `--out` refusals byte-for-byte, including the previously-omitted git-working-tree case | `the three pre-existing --out refusals are unchanged, byte-for-byte` |
| Opus MINOR 3 (cosmetic) | CLOSED: `typeName()` reports `null` for null; object-shaped `nights` names the entry's KEY, not "position" | `cosmetic: a nulled class reports "null"...`, `cosmetic: object-shaped nights...name the KEY` |

`port-harden.test.cjs`: 21 -> 33 cases (+12 round-2 cells above). No pinned
path touched; LF only; no U+2013/U+2014 in any new string.

## Suite tails (verbatim, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)

- `node --test rebuild/m3/setup/port/test/*.test.cjs`: `tests 54 / pass 54 / fail 0`.
- `rebuild/m3/w6/test/local-source-consumer.test.mjs`: `tests 6 / pass 6 / fail 0`.
- `node rebuild/t2/rig187.cjs`: `rig187 => PASS`, exit 0.
- `b-package.cjs --ci --package S4`: `PUBLIC CI EVIDENCE PASS`, exit 0.
- today-13 by name: `tests 645 / pass 645 / fail 0`.

## Open items

- Gap 3 of P3-STAGE (`today-bindings.mjs` frozen-day tz) is pinned, out of scope.
- CI home for the full gate remains unwired (unchanged disclosure from round 1).

## Round 3 (this commit) - PM order closing review r4 (Opus, ACCEPT) / r5 (Fable, ACCEPT) findings

| item | disposition | cell(s) |
|---|---|---|
| 1 nights entry pre-guard (`continue`) skips scalars | CLOSED: null/string/number/boolean/object-scalar night entries refuse `PORT_SOURCE_SHAPE_INVALID` naming the index, via source and via `--local` | `finding 1: a non-object night entry...`, `...object-shaped nights with a scalar entry...`, `finding 1 end to end...`, `finding 1 via --local...` |
| 2 `--local` shape check ran too late (b3, after relatedness/prepare/COUNTS) | CLOSED: `shapeIssues()` now runs on the RAW parsed `--local` right after it is read, before relatedness; b3 kept (cheap, catches post-migration shape) | `finding 2: --local queue={}...`, `...reads="x"...`, `...corrLog={}...` |
| 3 object-shaped nights echoed the entry KEY whole (privacy) | CLOSED: a `key` label truncates to 10 chars + `...` the same way a date value does | `finding 3: a long object-shaped nights key never appears whole` (SHAPE and DATE_INVALID lines) |
| 4 `earned` CLASS_MISSING named a key no source has | CLOSED: names the real backing key `feed` | `finding 4: earned CLASS_MISSING names the real backing key` |
| 5 object-typed `corrLog` raised no shape issue | CLOSED: refuses `PORT_SOURCE_SHAPE_INVALID` by name instead of being treated as `[]` | `finding 5: an object-typed corrLog now refuses` |
| 6 truncated echo reads as a valid value; README check order | CLOSED: every truncated echo (date value or key) carries a trailing `...`; README documents raw parse -> shape -> relatedness -> prepare -> counts for both source and `--local` | `a malformed string date is still echoed, truncated to 10 characters` |

`port-harden.test.cjs`: 33 -> 46 cases (+13 round-3 cells). No pinned path touched; LF only; no U+2013/U+2014 in new strings.

Suite tails (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): `port test/*.test.cjs` 65/65; with `local-source-consumer.test.mjs` 71/71; `rig187` => PASS exit 0; `today-13` (b-package S4's own cached child log) 645/645. `b-package.cjs --ci --package S4`: FAIL `SEAL-BASE-IS-NOT-THE-CHAIN-TIP` - `origin/rebuild/t2-client-core` advanced to 9b382e9 (a descendant of the pinned 8b484c09 tip) after our rebase, from unrelated activity; not caused by this ticket, same class as round-2 finding 4.
