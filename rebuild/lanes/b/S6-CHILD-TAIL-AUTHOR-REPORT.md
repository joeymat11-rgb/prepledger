# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS -- author report (R2 fix)

Ticket: DECISIONS:467 process note 2. Branch `rebuild/b-s6-child-tail`, worktree tip
210a04c29ccbbc5726fb50054ffd8b3ccb2c9bf4, disposing review R2
(`S6-CHILD-TAIL-REVIEW-R2.md`, reviewed sha 210a04c2, VERDICT REJECT).

## R2 dispositions

1. BLOCKING (`TAIL_DENYLIST` separator-sensitive on Windows) -- FIXED. Scans
   `combined.replace(/\\/g, '/')` for the denylist, prints ORIGINAL lines. Cell
   `RV17 -- a denylisted path spelled with backslashes ... withholds too`; the
   reviewer's own RV17 (asserting the leak) now correctly fails.
2. MAJOR (report over 60 lines) -- FIXED: this report.
3. MAJOR carry-forward, not mine to land: `measure/test/boundary.test.mjs:82`
   hardcodes `CHILD_SPECS = ['H3','S3','S4','S5']`. The S6 reseal must add
   `'S6'` there too, or `P-MEASURE (g)` stays red past the reseal.
4. MINOR (`PUBLIC_TAIL_ROOTS`/`TAIL_DENYLIST` pinned by no cell) -- FIXED. New
   cell `F8` in `pinned-unchanged-and-ruled-substitutions.test.cjs` `deepEqual`s
   both arrays and asserts a prepended root is not deepEqual.
5. MINOR (`exit null` on a spawnSync timeout) -- FIXED. `r.status === null` now
   prints `exit timeout` (plus `r.error.code` when present), never `null`.
   Cells: `RV17 -- a spawnSync timeout ...` with and without an error code.

## Cells added this round

3 RV17 cells (backslash-denylist, timeout-with-code, timeout-no-code) in
`child-diagnostic-tail.test.cjs`, plus `F8` (pin) in `pinned-unchanged-and-
ruled-substitutions.test.cjs`. Lane B tooling suite now 100/100, all green.

## Verbatim tails

Lane B tooling suite (`node --test "rebuild/lanes/b/tooling/test/*.test.cjs"`):
`tests 100 / pass 100 / fail 0`.

today-17 (`rebuild.yml:199`): `tests 666 / pass 665 / fail 1`; `P-MEASURE (g)`
drifts on two S4-sealed files this branch edits (`b-package.cjs`, and now the
F8-edited F-file) -- expected, see item 3 for why `CHILD_SPECS` keeps it red
past the S6 reseal.

`node rebuild/m3/w7-preview/today/build.mjs`:
`A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); ...`

`node rebuild/t2/rig187.cjs`: `rig187 => PASS -- SUITE GAP: both subjects are 35
GREEN under run.cjs; B-durability never restarts from the store`.

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S5`:
`B PACKAGE S5 FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER; ... local diagnostics
withheld` -- expected SEAL FACT; runner sha256 moved again; clears at the S6
reseal (which must also add `'S6'` to `CHILD_SPECS`, item 3).

## Drift (`git diff --name-only 0ac72ea HEAD` vs `packages/S5.json`)

- `b-package.cjs` -- matches S5.json's runner pin; expected red (SEAL FACT).
- `test/child-diagnostic-tail.test.cjs`, `test/pinned-unchanged-and-ruled-
  substitutions.test.cjs` (F8), this report -- none named in S5.json.

## Stops

None. No `rebuild/conform/private`, `src/history.js`, `ledger/` or soak path
read. No engine byte touched. Not pushed.
