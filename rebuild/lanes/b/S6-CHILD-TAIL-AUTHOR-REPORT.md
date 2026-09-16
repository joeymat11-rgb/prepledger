# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS -- author report

Ticket: DECISIONS:467 process note 2 (two one-OS reds of the today child in one day,
each passing on rerun, neither diagnosable because `--ci` withholds all local
diagnostics on any failure). Branch `rebuild/b-s6-child-tail`, worktree tip
0ac72eadf8cfe55c010af7f0d40034d133cdccba, commit a7e41db.

## What changed (b-package.cjs only; no engine byte touched)

- `children()` records each child's wall time around `spawnSync` and, in `--ci`
  only, catches its own `CHILD-REQUIRED-EXIT-ZERO` assertion to attach
  `error.diagnostic` before rethrowing unchanged.
- New `childDiagnosticTail()`: prints `B PACKAGE <ID> CHILD <name> DIAGNOSTIC exit
  <code> wall <ms> ms; last 60 lines of stdout+stderr follow` plus the tail, only if
  every argv target stands under one of four new `PUBLIC_TAIL_ROOTS` (today/test/,
  measure/test/, w6/host/test/, m4/workout/test/ -- suites rebuild.yml already runs
  in the open) AND no line of that child's own stdout+stderr matches
  `TAIL_DENYLIST` (`conform/private`, `golden`, `live.json`, `ledger/`). Either gate
  failing prints `tail withheld (path policy)` instead -- zero output bytes.
- Top-level `catch` prints `error.diagnostic` (when `ci` and present) right after
  the existing `FAIL` line, never in place of it, never for `--full`.
- Every child's OBSERVED line carries `; wall <ms> ms` in `--ci` (a failing child
  never reaches OBSERVED, unchanged).

## Cells (new `test/child-diagnostic-tail.test.cjs`; compiles the real runner
twice, once per mode, same technique as `execution-targets.test.cjs`)

1. public-root child exits 1 in `--ci` -> tail printed, exit/wall/last-60 present.
2. same child under `--full` -> `error.diagnostic` is `undefined`.
3. non-public-root (`rebuild/m4/spec/`) failing child -> withheld (path policy).
4. public-root failing child whose stdout names a denylisted path -> withheld too.
5. every child's OBSERVED line carries `; wall N ms` in `--ci`, none in `--full`.

All 5 new + 96 existing tooling cells green (101/101), incl. F1/F2/F3/F6/F7 and F-C/F-E.

## Verbatim tails

`node --test rebuild/lanes/b/tooling/test/**/*.test.cjs`:
`tests 101 / pass 101 / fail 0 / cancelled 0 / skipped 0 / todo 0`

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S5`:
```
B PACKAGE S5 FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER; required evidence missing or failed; local diagnostics withheld
```
Expected per DECISIONS:455/:467: `packages/S5.json` pins this runner's sha256
(`runner` + `tooling.runnerSha256`), so editing it refuses at the runner pin before
any evidence is read; no `CHILD DIAGNOSTIC` line, since this never reaches
`children()`. S6's own reseal re-pins the runner, as S4 and S5 did.

## Drift list (`git diff --name-only 0ac72ea HEAD`, checked against `packages/S5.json`)

- `rebuild/lanes/b/tooling/b-package.cjs` -- matches S5.json's `runner` /
  `tooling.runnerSha256` pin (why S5 --ci refuses above).
- `rebuild/lanes/b/tooling/test/child-diagnostic-tail.test.cjs` -- new file, not
  named in S5.json.

## Stops

None. No `rebuild/conform/private`, `src/history.js`, `ledger/` or soak path read.
Not pushed.
