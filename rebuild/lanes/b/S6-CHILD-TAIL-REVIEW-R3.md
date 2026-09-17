# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS -- independent review R3

VERDICT: REJECT

Reviewed `f0f2ccd4` (`rebuild/b-s6-child-tail`) over `60cb6187`, detached in
`%TEMP%\earned-s6b-rv`. 16 reviewer cells (RV18) in `%TEMP%\s6b-rv3\rv3.test.cjs`,
outside the repo; every closed item re-proved with its red side (mutant compiled
from the real runner source, red, reverted). Tree clean; no product file edited.

## Closed this round, each with its red side

- R2-1, single-backslash spelling: RV18-1 withholds; RV18-2 (same source,
  `.replace(/\\/g, '/')` removed) leaks. Load-bearing.
- R2-5, `exit null`: RV18-8 reads `exit timeout ETIMEDOUT`; RV18-9 (null branch
  removed) reads `exit null`. RV18-10 keeps a real code verbatim.
- R2-4, unpinned arrays: F8 reddens when `rebuild/conform/v4/postfix/` is
  prepended to `PUBLIC_TAIL_ROOTS` (13 pass, 1 fail), and
  `child-diagnostic-tail.test.cjs` reddens (2 fail) when `conform/private` is
  dropped from `TAIL_DENYLIST`. R2-2, report length: exactly 60 lines, LF only.
- No assertion removed or weakened: the only deleted `assert` in
  `git diff 60cb618 HEAD` is `CHILD-REQUIRED-EXIT-ZERO`, reindented into a `try`
  that rethrows unconditionally. Of 313 added lines, 10 carry an en/em dash and
  all 10 are comments; no user-facing string carries one.

## Findings

1. BLOCKING (R2-1, narrowed but still open). The denylist is still
   separator-sensitive one level up: `combined.replace(/\\/g, '/')` turns `a\\b`
   into `a//b`, so a DOUBLED backslash defeats the only needle with an INTERIOR
   separator, `conform/private`. (`ledger/` survives by luck -- its separator is
   trailing, so `ledger//x` still matches and RV18-5 passes. The private-oracle
   needle does not.) Not contrived: the tail prints ONLY for a FAILING child, and
   node:test's reporter prints a failing string value escaped, so any Windows
   path inside an `actual`/`expected` arrives with doubled backslashes; there are
   82 `JSON.stringify` call sites across the four `PUBLIC_TAIL_ROOTS` suites.
   RV18-13 proves it live: a node:test child under `rebuild/m4/workout/test/`
   failing on `rebuild\conform\private\census.json` has its WHOLE tail printed,
   private path included, and `tail withheld (path policy)` is never reached.
   RV18-4 is the same leak in plain stdout. Fix, verified by RV18-14/15/16:
   `const normalized = combined.replace(/\\/g, '/').replace(/\/{2,}/g, '/');`
   -- both leaks close, clean tails still print (RV18-16). Pin the CLASS: add the
   node:test-shaped fixture as a repo cell, not only the one spelling.

2. MAJOR, carry-forward, not yours to land (restated for the S6 author as
   ordered). `rebuild/m3/w7-preview/measure/test/boundary.test.mjs:82` still
   reads `const CHILD_SPECS = ['H3', 'S3', 'S4', 'S5'];`, verified at this head
   and at the new tip. The S6 reseal must add `'S6'` there as well as declaring
   the runner, or `P-MEASURE (g)` stays red past the reseal.

3. MINOR. The report's metadata is stale: worktree tip `210a04c2`, drift base
   `0ac72ea`, while HEAD is `f0f2ccd4` over `60cb6187`. And
   `origin/rebuild/t2-client-core` has MOVED to `91f882b5` (DECISIONS:474): I
   rebased a probe branch onto it -- clean, lane B bytes byte-identical, tooling
   suite 100/100, nothing touching `b-package.cjs`, `boundary.test.mjs` or the
   four public roots, so every finding carries. Rebase and restate both shas.

4. MINOR, two small ones. F8's third assertion, `notDeepEqual([extra,
   ...PUBLIC_TAIL_ROOTS], PUBLIC_TAIL_ROOTS)`, is tautological -- an array with
   one more element can never deepEqual the original -- so it holds whatever the
   runner says; the two `deepEqual` pins above it do the whole job. And
   `TAIL_LINES` caps LINES, not bytes, while `spawnSync` allows a 32 MB
   `maxBuffer`: cap the emitted tail by bytes as well.

## Tails (measured by me at f0f2ccd, Node 24, this worktree)

- Lane B tooling suite: `tests 100 / pass 100 / fail 0` (100/100 again on the
  probe branch rebased onto `91f882b5`).
- today-17 (`rebuild.yml:199`): `tests 666 / pass 665 / fail 1`; the one failure
  is `P-MEASURE (g)`, drift list EXACTLY `b-package.cjs` and
  `test/pinned-unchanged-and-ruled-substitutions.test.cjs`. Expected SEAL FACT.
- A1: `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)`.
- rig187: `rig187 => PASS -- SUITE GAP: both subjects are 35 GREEN under run.cjs`.
- `--ci --package S5`: `B PACKAGE S5 FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`
  -- expected, and correctly carrying NO tail (it rides child failures only).
- RV18: 16 cells, 14 pass, 2 fail (RV18-4 and RV18-13, which are finding 1).

## Stops

None. SYNTHETIC fixtures only. No `rebuild/conform/private`, `src/history.js`,
`ledger/` or soak path read. No engine byte touched. Not pushed.
