# P3-HARDEN - author report

Ticket P3-HARDEN (DECISIONS:454; gaps 1/2 of P3-STAGE; gap 3 pinned,
deferred). Lane C, size S. Model/effort: Sonnet, medium. Author only, nothing
pushed. Branch `rebuild/c-p3-harden` over tip `c76fb7f5`, fresh worktree,
TZ=America/New_York, Node 24.19.0. Invented bundles only, cloned in memory
from the public `preimage-2026-08-15.json` fixture; nothing under
`rebuild/conform/private`, `src/history.js`, `ledger/` or any soak path read.

## Files : hunks

- `port.cjs` - require + 2 new blocks (`shapeIssues`/`SHAPE_CLASSES` seal-time
  refusal; `syncedFolderRefusal` wired into `outRefusal`) + 1 call site in
  `run()` + exports extended. 116 ins / 1 del vs tip.
- `test/port-harden.test.cjs` - new, 21 cases.
- `README.md` - 3 new codes; `--out` synced-folder rule. `lanes/c/P3-RUNBOOK.md` - pre-check 4 updated (STAGE finding 2 closed).

## Bar table

| item | cell(s) |
|---|---|
| (a) both codes | `BOTH codes: missing exercises + an impossible date refuse together` |
| (b) empty not refused | `a present-but-empty exercises array is not refused...` |
| (c) one per class | 8 `missing guarded class: *` + 1 `waist: absent is tolerated` (deviation) |
| (d) dates | `date validity ... validDay` (5 refused incl. 2023-02-29; 2024-02-29 accepted) |
| (e) synced folder | 6 cells: OneDrive, Dropbox, "Google Drive", onedrive, OneDriveBackup2 (not refused), %OneDrive% |
| (f) byte-identical | `the three pre-existing --out refusals are unchanged, verbatim` |
| (g) happy round-trip | `a well-formed source still seals PASS and round-trips` |
| (h) no dash | `no en dash or em dash in the new refusal messages` |
| (i) mutant | on-PC only (class-missing push commented -> 9 cells red, bundle written exit 0; reverted). Not committed. |

## Deviation (disclosed): waist

Named in the bar list but excluded from the missing-class refusal:
`m4/workout/athlete-state.cjs`'s ACCEPTED `createCleanInitState()` never
writes `waist` (not even `[]`) - confirmed against PINNED
`local-source-consumer.test.mjs`, whose invented already-schema-60 state
seals through the real `port.cjs` with no `waist` key. Refusing there would
break that pinned suite. Type is still checked when `waist` IS present.

## CI home: not wired

`shared-preflight.yml` sparse-checks a single-commit blob allowlist
(`rebuild/client/**` + lane tooling), no fetch remote after. The port suite
needs the full gate (`rebuild/engine/**`, `rebuild/conform/oracle/**` incl.
`census.cjs`, fixtures, manifest, `tools/_fixed-now.mjs`) - not hermetic
there. Disclosed, not forced.

## Suite tails (verbatim)

- `node --test rebuild/m3/setup/port/test/*.test.cjs`: `tests 42 / pass 42 / fail 0`.
- `node --test rebuild/m3/w6/test/local-source-consumer.test.mjs`: `tests 6 / pass 6 / fail 0`.
- `node rebuild/t2/rig187.cjs`: `rig187 => PASS`, exit 0.
- `b-package.cjs --ci --package S4`: `PUBLIC CI EVIDENCE PASS`, exit 0.
- today-13 by name (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): `tests 645 / pass 645 / fail 0`.

## Open items

- Gap 3 of P3-STAGE (`today-bindings.mjs` frozen-day tz) is pinned, out of scope.
- Shape check re-parses the source once (besides `prepare()`'s own parse), deliberately, to fail fast before migration.
