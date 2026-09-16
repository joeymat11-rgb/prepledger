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
