# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS - independent review R1

VERDICT: REJECT

Reviewed d902815 (detached, %TEMP%\earned-s6b-rv), tip 0ac72ea. Reviewer cells live
outside the repo at %TEMP%\s6b-rv\rv.test.cjs: 10 cells, 9 green, the one red IS
finding 1. Every cell compiles the REAL runner source; every mutant is applied to a
copy, proved unique, shown red, reverted by reuse of the pristine bytes. No stub.

## What is correct

The guard holds under mutation and either gate alone withholds: RV2 (PUBLIC_TAIL_ROOTS
widened to CHILD_ROOTS -> a non-public child's stdout leaks), RV3 (drop the denylist
term -> `rebuild/conform/private/live.json` leaks), RV5 (`every` -> `some` -> an argv
mixing a public and a non-public target leaks), RV1 (drop `if (ci)` -> `--full` carries
a tail), RV6 (wall time, `--ci` only). RV4 is a claim the author did not make and it
holds: the denylist scans the WHOLE stream, not only the 60 lines it would print, so a
needle on line 1 of 201 still withholds. RV7 pins the header the ticket names. RV8
holds wiring no package cell reaches: `children(s, env)` stands inside the one try
whose catch prints `error.diagnostic`, no intervening catch can re-wrap and drop it,
and the print lands after the FAIL line. Drift is 3 files, no engine byte, no
conform/private, src/history.js or ledger/, LF only, no U+2013/U+2014 added, and no
assertion removed (the only test file in the diff is new, 122 lines all additions).

## Findings

1. BLOCKING - the new cell is not in `TOOLING_FILES`, so the S6 reseal refuses on it.
   `fidelity()` diffs sourceBase..HEAD over `TOOLING` and at b-package.cjs:1826 builds
   `unlisted = changed.filter(f => !(... || TOOLING_FILES.includes(f) || ...))`, then
   `assert(!unlisted.length, 'UNLISTED-SOURCE-CHANGE ' + ...)`. All EIGHT pre-existing
   tooling cells are enumerated in `TOOLING_FILES` (:299-:307); the ninth,
   `tooling/test/child-diagnostic-tail.test.cjs`, is not, and it is in none of the escape
   sets (product, ARTIFACT/REVIEW, own receipt, child target, carrier successor).
   Reviewer cell RV10 is exactly this:
   `tooling cells on disk vs TOOLING_FILES; missing: child-diagnostic-tail.test.cjs`.
   The ticket says this work lands only inside the S6 reseal, and the reseal is the one
   path where the refusal fires. The runner is already edited and its sha already moves,
   so the fix is one line in a file this commit changes. (S6.json declaring the cell as
   product would also close it, but 8 of 8 precedent is the runner-side list.)

2. MAJOR - the report's "verbatim tail" for the tooling suite is neither verbatim nor
   right. Report and result both claim `tests 101 / pass 101 / fail 0 / cancelled 0 /
   skipped 0 / todo 0` and "96 existing" cells. Measured at the reviewed sha on Node 24
   the whole suite is 96, the eight pre-existing files alone 91: 91 + 5 = 96, not 101.
   The quoted string is also not a shape `node --test` prints (one `tests 96` line per
   counter), so it was composed, not copied. The substance is fine - all 96 pass, the 5
   new included - but a composed tail is not evidence.

3. MINOR - the privacy justification is wrong about one of the four roots.
   b-package.cjs:324-333 calls PUBLIC_TAIL_ROOTS "only the four roots rebuild.yml
   already runs in the open on every push - today, measure, w6 host, m4/workout".
   rebuild.yml runs today+measure open at line 199 and w6 host at 138, but
   `rebuild/m4/workout/test/` appears in NO open step: its six cells run only inside
   `b-package.cjs --ci --package S5` (rebuild.yml:127), the step whose output is
   withheld. The content is safe - all six `m4/workout/test/s5-*.cjs` reach only node
   builtins, `rebuild/engine/*`, `m4/spec/native-carriers-source.cjs`,
   `m3/w7-preview/fixtures.cjs` and `packages/S5.json`, none naming conform/private, a
   golden, live.json or ledger/ - a wrong reason for a right root, not a leak. But a
   gate whose stated ground is false is what a later package widens on trust.

4. MINOR - report bookkeeping: it names "commit a7e41db" where the reviewed commit is
   d902815, and its drift list omits the report file itself (two entries, not three).

5. NOTE - the ticket's subject suite is red on this branch, undisclosed. today-17 by
   name is `pass 665 / fail 1` against its declared needle `# pass 666`; the failure is
   `P-MEASURE (g)` in `measure/test/boundary.test.mjs:95`, "an S4-sealed file drifts and
   no package on this branch declares the bytes it stands at", actual
   `[ 'rebuild/lanes/b/tooling/b-package.cjs' ]`. SEAL FACT (lanes/b/tooling/** pinned
   by S5); it clears when S6.json declares the runner's new post, so not a defect. Worth
   stating because it reddens a PUBLIC rebuild.yml step (line 199), not only the
   withheld step, and the report says "Stops: none" without having measured it.

6. NOTE - (a) on `r.error` (spawn failure or the 1800000 ms timeout) `r.status` is null
   and the header reads `DIAGNOSTIC exit null wall N ms`; the flake chased here is a
   one-OS red passing on rerun, exactly the timeout shape, so print `r.error.code`.
   (b) F7 pins all of `CHILD_ROOTS`; nothing pins `PUBLIC_TAIL_ROOTS`/`TAIL_DENYLIST`.

## Verbatim tails (reviewed sha, Node 24)

`node --test "rebuild/lanes/b/tooling/test/*.test.cjs"` -> `tests 96 / pass 96 /
fail 0 / cancelled 0 / skipped 0 / todo 0`; the eight pre-existing files alone ->
`tests 91 / pass 91 / fail 0`.

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S5`:
```
B PACKAGE S5 FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER; required evidence missing or failed; local diagnostics withheld
```
Expected: S5.json pins the runner at :44/:45 and :313, so it refuses at the pin.

today-17 by name (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York) -> `pass 665 /
fail 1`, the seal-fact cell of finding 5. Reviewer cells -> `tests 10 / pass 9 /
fail 1`, the red being RV10 (finding 1).

## Drift (git diff --name-only 0ac72ea HEAD), each checked against packages/S5.json

- `rebuild/lanes/b/tooling/b-package.cjs` - PINNED (S5.json:44 `runner`, :45
  `tooling.runnerSha256`, :313 pins entry). Expected red; S6 re-pins it.
- `rebuild/lanes/b/tooling/test/child-diagnostic-tail.test.cjs` - not in S5.json
  (finding 1 says what it still needs).
- `rebuild/lanes/b/S6-CHILD-TAIL-AUTHOR-REPORT.md` - not in S5.json.
