# S6-B CI-TODAY-CHILD-FLAKE DIAGNOSTICS -- independent review R4

VERDICT: REJECT

Reviewed sha cdc8bad315d49637547dcc176252cc0a3488c636, rebased onto
`origin/rebuild/t2-client-core` f7fe44db (an ancestor of HEAD). R3's BLOCKING is CLEARED;
both findings below are mechanical, and no law, guard or test is weakened.

## R3 finding 1 (BLOCKING, doubled backslash) -- CLEARED, independently verified

`combined.replace(/\\/g,'/').replace(/\/{2,}/g,'/')` scans the whole stream; the ORIGINAL
lines still print. Beyond the author's two RV18 cells I drove the REAL compiled
`childDiagnosticTail` with 13 probes (RV18-R4-a..l), all pass: single, doubled and
QUADRUPLED backslash withhold; mixed `\/` and `/\` withholds; `ledger/`, the other
interior-separator needle, withholds when doubled; a clean tail still prints; a `https://`
URL is NOT falsely withheld, so the collapse does not over-withhold; empty `targets`
withholds; and the denylist scans `combined` BEFORE the byte cap, so a needle in the first
bytes of a 200 KB stream still withholds (RV18-R4-i).

## 1. MINOR (instructed, undelivered) -- `TAIL_BYTES` is pinned by no cell

R3 finding 3 asked for the byte cap AND a cell. The cap landed and is correct (RV18-R4-h/
j/k: a 200 KB line caps to 16384 bytes, the header says so, a short tail is untouched, no
U+FFFD on multi-byte input). But `git grep TAIL_BYTES` over `rebuild/lanes/b` returns only
`b-package.cjs` and the report -- no test names it, while the disposition claims "Cell:
F8", and F8 pins `PUBLIC_TAIL_ROOTS` and `TAIL_DENYLIST` only. Deleting the constant, or
raising it to 32 MB, goes green -- the gap F7/F8 exist to close for this lane's other fixed
values. Risk is volume, not disclosure (both privacy gates ARE pinned), hence MINOR. Fix:
a cell asserting `TAIL_BYTES === 16*1024`, that a line over it is capped and a short tail
is byte-identical; and fix that disposition line.

## 2. MINOR -- the report is not head-accurate AT THE DELIVERED SHA

R3 finding 3's other half: written pre-rebase, carried through the rebase unedited, so
three claims are false at cdc8bad. (a) "worktree tip f0f2ccd4fa1f..." -- `merge-base
--is-ancestor f0f2ccd4 HEAD` FAILS; the rebase orphaned it, HEAD~1 is 181dc9d ("reviewed
sha f0f2ccd4" is correct). (b) the Drift section asserts `git diff --name-only c76fb7f5
HEAD` yields 4 entries; at HEAD it yields 97, the rebase having pulled in t2-client-core's
own commits -- name the author's 4 as such rather than assert output that no longer
reproduces. (c) it says P-MEASURE (g) is red on "b-package.cjs and this round's two edited
test files"; the assertion names only `b-package.cjs` and `pinned-unchanged-and-ruled-
substitutions.test.cjs`, `child-diagnostic-tail.test.cjs` being NEW, not a sealed drift.
Fix: rebase first, then write the metadata, then commit.

## 3. Carry-forward, not this author's (restated a fourth time)

`measure/test/boundary.test.mjs:82` `CHILD_SPECS` needs `'S6'`; restated in the report.

## Clean, and tails (mine, this sha)

The round's only deletions are 2 lines in `b-package.cjs`, both replaced by stronger text,
and 3 in the pinned-unchanged suite -- F8's `notDeepEqual` plus 2 comment lines: a tautology
removal, not an assertion removal, stated at the cell, the two real `deepEqual` pins intact.
`--full` still carries no diagnostic, the print site is double-gated on `ci`, and `--ci
--package S5` printed its one FAIL line with NO tail, so the diagnostic rides only
CHILD-REQUIRED-EXIT-ZERO. LF only; report 60 lines; fixtures are fake children printing the
STRING of a private path. Lane B tooling `102 / 102 / 0`; today-17/A1 `666 / 665 / 1`
(P-MEASURE (g) only); `rig187 => PASS`; probes RV18-R4-a..l 13/13 PASS; `--ci --package S5`
`FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, exit code 1.
