# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS -- author report (R1 fix)

Ticket: DECISIONS:467 process note 2 (two one-OS reds of the today child in one day,
each passing on rerun, neither diagnosable because `--ci` withholds all local
diagnostics on any failure). Branch `rebuild/b-s6-child-tail`, worktree tip
0ac72eadf8cfe55c010af7f0d40034d133cdccba, commits a7e41db (diagnostics) and
d902815 (original report) plus this commit, which disposes review R1
(`rebuild/lanes/b/S6-CHILD-TAIL-REVIEW-R1.md`, reviewed sha d902815 -- the
original report wrongly named only a7e41db).

## What changed (b-package.cjs and this report only; no engine byte touched)

- `children()` records each child's wall time around `spawnSync` and, in `--ci`
  only, catches its own `CHILD-REQUIRED-EXIT-ZERO` assertion to attach
  `error.diagnostic` before rethrowing unchanged.
- New `childDiagnosticTail()`: prints `B PACKAGE <ID> CHILD <name> DIAGNOSTIC exit
  <code> wall <ms> ms; last 60 lines of stdout+stderr follow` plus the tail, only if
  every argv target stands under one of four `PUBLIC_TAIL_ROOTS` AND no line of
  that child's own stdout+stderr matches `TAIL_DENYLIST` (`conform/private`,
  `golden`, `live.json`, `ledger/`). Either gate failing prints `tail withheld
  (path policy)` instead -- zero output bytes.
- Top-level `catch` prints `error.diagnostic` (when `ci` and present) right after
  the existing `FAIL` line, never in place of it, never for `--full`.
- Every child's OBSERVED line carries `; wall <ms> ms` in `--ci`.

## R1 fix: `PUBLIC_TAIL_ROOTS` was in no `TOOLING_FILES` entry (BLOCKING)

`test/child-diagnostic-tail.test.cjs` was added by a7e41db but never enumerated in
`TOOLING_FILES` (b-package.cjs W7 list), so `fidelity()`'s own `--ci --package S5`
run refused it as `UNLISTED-SOURCE-CHANGE`. Fixed by adding one entry to
`TOOLING_FILES`, next to the other eight tooling test files it sits beside.

## R1 fix: privacy justification was wrong for one of four roots (MINOR)

The `PUBLIC_TAIL_ROOTS` comment claimed all four roots are ones "rebuild.yml
already runs in the open." Three are (today, measure, w6 host); `m4/workout` is
not -- its six cells run only inside the withheld `--ci --package S5` step
(rebuild.yml:127). Comment corrected in both places (the `PUBLIC_TAIL_ROOTS`
definition and the `childDiagnosticTail()` docstring) to give `m4/workout`'s real
basis: its content was read in full (node builtins, `rebuild/engine/*`,
`native-carriers-source.cjs`, `w7-preview/fixtures.cjs`, `S5.json`) and contains no
line naming the private census, a golden, `live.json` or the ledger. No behavior
changed; the four-element `PUBLIC_TAIL_ROOTS` array itself is untouched.

## Cells (`test/child-diagnostic-tail.test.cjs`; compiles the real runner twice,
once per mode, same technique as `execution-targets.test.cjs`)

1. public-root child exits 1 in `--ci` -> tail printed, exit/wall/last-60 present.
2. same child under `--full` -> `error.diagnostic` is `undefined`.
3. non-public-root (`rebuild/m4/spec/`) failing child -> withheld (path policy).
4. public-root failing child whose stdout names a denylisted path -> withheld too.
5. every child's OBSERVED line carries `; wall N ms` in `--ci`, none in `--full`.

5 new cells; 91 pre-existing tooling cells; 96 total, all green. Reviewer's 10
independent cells at `%TEMP%\s6b-rv\rv.test.cjs` (RV1-RV10, mutant-proved,
stub-free) now all pass, including RV10 (`TOOLING_FILES` enumeration), which was
red before this fix.

## Verbatim tails

`node --test "rebuild/lanes/b/tooling/test/*.test.cjs"`:
```
ℹ tests 96
ℹ suites 0
ℹ pass 96
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

`node --test "%TEMP%\s6b-rv\rv.test.cjs"` (REVIEW_ROOT=this worktree):
```
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
```

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S5`:
```
B PACKAGE S5 FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER; required evidence missing or failed; local diagnostics withheld
```
Expected per DECISIONS:455/:467: `packages/S5.json` pins this runner's sha256, so
editing it refuses at the runner pin before any evidence is read. S6's own reseal
re-pins the runner, as S4 and S5 did.

## Drift list (`git diff --name-only 0ac72ea HEAD`, checked against `packages/S5.json`)

- `rebuild/lanes/b/tooling/b-package.cjs` -- matches S5.json's `runner` /
  `tooling.runnerSha256` pin (why S5 --ci refuses above); expected red.
- `rebuild/lanes/b/tooling/test/child-diagnostic-tail.test.cjs` -- new file, not
  named in S5.json.
- `rebuild/lanes/b/S6-CHILD-TAIL-AUTHOR-REPORT.md` (this file) -- new file, not
  named in S5.json; omitted from the prior drift list in error.

## Stops

None encountered while fixing R1. No `rebuild/conform/private`, `src/history.js`,
`ledger/` or soak path read. Not pushed.

Known, unresolved, out of custody for this fix: today-17 measures `pass 665 /
fail 1` on this branch (needle `# pass 666`), failure `P-MEASURE (g)` in
`measure/test/boundary.test.mjs:95`. This is the same SEAL FACT drift as
`b-package.cjs` above (clears at the S6 reseal) but it reddens the *public*
rebuild.yml step at line 199, not only the withheld S5 step -- the prior report's
"Stops: none" did not measure or disclose this. Neither this fix nor a7e41db
touches `measure/test/boundary.test.mjs` or `b-package.cjs`'s S5-relevant bytes
beyond the two changes above, so the shape is unchanged by R1; recorded here so
"Stops: none" is not repeated inaccurately.
