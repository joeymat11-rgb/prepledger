# S6 review R5 (Fable FINAL, scoped re-check per DECISIONS:431 point 17 and :439)

VERDICT: ACCEPT

Reviewed b75e655 (rebuild/b-s6-today-child) detached in %TEMP%\earned-s6-rv, no private junction
present. Same reviewer as R4 (0b0729f1 at c8abf4be).
## 1. Scope, measured
- `git diff --stat c8abf4be..HEAD`: 8 paths, 334(+)/4(-): DECISIONS.md +1 (the tip's :495 line, the
  only added line carrying a dash, a PM ledger line), the one cell (+24/-1), S6.json (+3/-3), the
  carried reviews R2/R4, lane D's report and review, the author report's 11-line round 3 section.
- `git diff --stat a32e606e..HEAD`: exactly the 5 paths the author names. e5e5fba is a --no-ff merge of
  67e0130 whose parent is a32e606e (merge-base with the tip is 656473bd itself); after it,
  `git diff e5e5fba HEAD -- rebuild/m3 rebuild/m4 rebuild/engine rebuild/coach .github` is EMPTY.
  No engine or coach byte in c8abf4be..HEAD. Tip 656473bd is an ancestor of HEAD; merged, not rebased.
## 2. The cell, intent kept, red side real
- P2-W1 still asserts SOURCE, COUNTS, SEAL PASS, dataLossGuard safe=true lost=0, six words, bundle
  > 1000 bytes; only line 4 moved from the literal `frozen 7/7 unfrozen 7/7` to ORACLE_PASS_LINE: PASS,
  one N on both sides of each fraction, frozen N = unfrozen N by backreference, N >= 7, `scope FULL`
  captured when printed. port.cjs:686-694 prints `frozen G/T  unfrozen G/T  scope <scope>` and its own
  ok requires T in {7 public, 10 full} with G = T, so the cell is a second reading of the same rule.
- My own evaluation outside the suite (node -e): 7/7 public line true; 6/6 false; frozen 10/10
  unfrozen 7/7 false; frozen 7/7 unfrozen 10/10 false; 10/9 false; FAIL verdict false. A red gate, a
  smaller class count and a mismatched frozen/unfrozen count are all still refused.
- The sibling cell (pure function, no port run) asserts that set and executes: 26/26 on its own argv,
  TZ=America/New_York MEASURED_TEST_NOW=2026-09-03, both P2-W1 cells passing by name.
- Changed file LF only, zero U+2013/U+2014, sha256 on disk 856b3627665b016e... = S6.json post; role
  "new" over a real pre-image is round 2's both-sides shape and the runner refuses "edited" for a
  non-parent-pinned file (b-package.cjs:1853). Needle `# pass 26` is the measured count.
## 3. Executed on this tree (my own runs)
- `--ci --package S6` twice: PUBLIC CI EVIDENCE PASS both, the second with EXIT 0 observed in a batch
  wrapper; spec bad4cdcba68e, runner 8d9a94c20faa; 23 children OBSERVED exit 0 (w6-local-source 26 at
  ~2.2 s, today-17 682 at ~149 s); no FAIL line and no CHILD-REQUIRED-EXIT-ZERO in either run, so the
  author's one today-17 flake did not reproduce here. NO-REGISTER OBLIGATION reads 12 of 12.

## 4. MINOR carries, not stops (the replaced literal had the same shape, so not a weakening)
- ORACLE_PASS_LINE has no trailing boundary: `unfrozen 10/100` reads as 10/10 (the old literal read
  `7/70` the same way); a `(?!\d)` after the last `\1` closes it at the file's next move.
- `scope UNEXPECTED` with a consistent N >= 7 passes the pattern alone; port.cjs refuses it by its own
  ok before any PASS prints, so the line can never read that way. N >= 7 floor: lane D's residual.
