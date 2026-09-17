# P2-W1-FULL-SCOPE (lane D, author)
Branch `rebuild/d-p2w1-scope` off `a32e606e` in `%TEMP%\earned-p2w1` (no private
junction; ran public scope only).

## Finding
`rebuild/m3/w6/test/local-source-consumer.test.mjs` pinned line 4 of the port's oracle
report with `/4\. ORACLE\s+PASS\s+frozen 7\/7\s+unfrozen 7\/7/`. Under `--full` the same
GREEN report reads `frozen 10/10 unfrozen 10/10 scope FULL (...)`, so the cell failed on
a count, not on a claim. Its claim is: gate GREEN, no class smaller. That holds in both
scopes, so the count must not be pinned.

## Change (one file, one cell, plus its red side)
```
const ORACLE_PASS_LINE =
  /4\. ORACLE\s+PASS\s+frozen\s+([7-9]|[1-9]\d+)\/\1\s+unfrozen\s+\1\/\1(?:\s+scope (FULL))?/;
```
One and the same N on both sides of each fraction and the same N for frozen and
unfrozen (backreferences), N >= 7 (7-9 or any multi-digit count), scope word captured
when the FULL scope prints it. The assertion message states that rule. Nothing else in
the cell moved.

New sibling cell, a pure function of the pattern against literal lines (no port run):
`7/7` and `10/10 ... scope FULL` match, the FULL line captures `FULL`; `frozen 9/10`,
`unfrozen 9/9` and a `FAIL` verdict each still fail.

## Evidence
`node --test local-source-admission.test.mjs local-source-consumer.test.mjs`, with
`TZ=America/New_York MEASURED_TEST_NOW=2026-09-03`: tests 26, pass 26, fail 0.
Stops: none.
