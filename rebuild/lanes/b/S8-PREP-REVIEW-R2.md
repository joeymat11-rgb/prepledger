# S8 PREPARATION, independent review R2 (re-check after the author's fix round)

**VERDICT: ACCEPT. 0 BLOCKING.** Re-checked at `82c98f891cf24ad339cddc0969087e3ecb574b0b` on
`rebuild/d-p3-real-shape`, HEAD == `origin/rebuild/d-p3-real-shape`, worktree
`%TEMP%\earned-realshape`. Same reviewer seat as R1. I did not write this round. Every figure
below was re-measured on this head by my own scripts and my own runs; nothing is copied from the
author report or from R1.

R1 returned ACCEPT WITH NOTES, 0 BLOCKING, so there was no blocking finding to reproduce and none
to re-verify as repaired. What R2 therefore checks is the only thing a fix round can get wrong
when it has no blocking finding to fix: that it moved NO hashed byte, that the corrected prose is
now true, and that every sha256, count and terminal the PM will act on still stands.

## 1. The fix round moved no hashed byte. CONFIRMED.

`git show --numstat 82c98f8` is exactly one file, `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md`,
+122/-11. Nothing else. Author `cowork (Earned PM) <joeymat11@gmail.com>`; both trailers present.
`packages/S8.json`, `S8-REAL-SHAPE-BRIEF.md`, `b-package.cjs`, `rebuild.yml`, the six ancestor
specs, the six `s8-*` cells, the five `CHILD_SPECS` cells and F6/F7 are untouched by this commit.
The report is declared by no package and bound by no sha256, so no needle, law, guard or cell
could move and none did.

Lockdown: `git diff --numstat 1af78de..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md`
is EMPTY. The untracked `rebuild/lanes/d/_review-probes/` is still untracked and unstaged. `git
status --short` shows that one `??` line and nothing else.

## 2. The shas, recomputed from disk on this head

| artifact | recomputed sha256 | bytes | matches |
| --- | --- | --- | --- |
| `rebuild/lanes/b/S8-REAL-SHAPE-BRIEF.md` | `9fbe105744ccb9295eae866e5ac28b48397ccf6c7e3ea74cc1a97a3a1833c73a` | 35888 | `brief.sha256` |
| `rebuild/lanes/b/tooling/packages/S8.json` | `6fbbb1b901c2d7cacc0595b41b41172a8c0faab12b52b470fcb85f4686878899` | 88184 | the runner's SPEC OBSERVED line |
| `rebuild/lanes/b/tooling/b-package.cjs` | `e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e` | 259614 | `tooling.runnerSha256` |

All three match the author's figures exactly, and all three are the R1 values unchanged.

## 3. The three token lines, recomputed

I hashed each line as UTF-8 bytes, from `packages/S8.json` itself and again from
`%TEMP%\s8out\final-lines.txt`, and the two agree line for line.

| line | sha256 | chars | cited by |
| --- | --- | --- | --- |
| THEME | `77a8e98680a1ff0cbbbe5c9eba86607113032551de672bcceae50f47703f3c6c` | 1842 | `authorizations.theme.lineSha256` |
| BRIEF ACCEPTED BY SHA | `06365949c686a90f79dc6bd33130b4737c20c71bf7792ff32af0e817500ca216` | 317 | `brief.acceptedLedgerLine.lineSha256` |
| GATE-SUPERSESSION | `0c2d0db53471b8604bdfb5c19f2485a12df517b672cd04912f988812c5a41eee` | 697 | `coverage.superseded.rulingLineSha256` |

`final-lines.txt` holds exactly these three lines, 2869 bytes, unchanged this round. The PM can
append them byte-exact and verify each sha256 before writing, as section 11 of the report says.

## 4. The declared shape, recounted from the spec

`packages/S8.json` `product` has 224 entries: 24 `edited`, 17 `new`, 182 `carried`, 1
`superseded-by-child`. `children` has 25. That is the author's sentence and the runner's own
PRODUCT IMPLEMENTED arithmetic (24 + 17 + 1 = 42 at the declared post-image).

## 5. My own `--ci --package S8` terminal, at `82c98f8`, verbatim

Run on this seat through a `.cmd` mirroring `%TEMP%\s7-full2.cmd` with `cd %TEMP%\earned-realshape`,
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, `--ci --package S8`; log
`%TEMP%\s8out\r2ci.log`.

```
B PACKAGE S8 SPEC OBSERVED packages/S8.json 6fbbb1b901c2d7cacc0595b41b41172a8c0faab12b52b470fcb85f4686878899; runner e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e byte-identical on disk and in Git at HEAD; status=BRIEF-ACCEPTED; 0 D-ids ; 224 declared product files; 25 declared child(ren), argv file-first under 20 fixed root(s) with only --test --test-reporter=tap permitted; 0 declared move(s), each naming its own original executable in a relative require specifier (moves are refused outright under this runner - TOOLING-REVIEW-r3 X1); no successor carriers declared (every inherited gate must be carried by a parent-pinned executable); 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 0c2d0db53471, each with its own named and executed evidence
```
```
B PACKAGE S8 PARENT OPTION S7 M2-S7-PORT-ADMISSION rebuild/m4/spec/acceptance-s7-port-admission.json 350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b ACCEPTED at e7fb94be36e13db1ff29d70a3e7ee3078f1e7f14 (DECISIONS:518); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review rebuild/m4/spec/review-s7-port-admission.json 2819e4aa22dd byte-identical on disk and on that branch; receipt base c081cbd is an ancestor of it
```
```
B PACKAGE S8 PARENT BOUND S7 rebuild/m4/spec/acceptance-s7-port-admission.json 350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b; single-parent chain holds - no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent
```
```
B PACKAGE S8 POSTFIX M2-S8-REAL-SHAPE REVIEW-PENDING mode=--ci
```
```
B PACKAGE S8 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s8-real-shape.json is not sealed yet - no PASS word is available
```
```
B PACKAGE S8 PARENT PINS RE-ASSERTED at run time; 2 pin(s) from rebuild/m4/spec/acceptance-s7-port-admission.json plus its 206 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-s6-today-child.json, byte-identical on disk AND in Git at HEAD; 207 superseded pin(s) preserved in Git at sourceBase 8ebc860; parent artifact byte-identical in Git at e7fb94be36e13db1ff29d70a3e7ee3078f1e7f14
```
```
B PACKAGE S8 PRODUCT IMPLEMENTED; 42 at the declared post-image / 0 at the pinned pre-image / 182 carried byte-identical from the parent / 0 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 206 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S7.json)
```
```
B PACKAGE S8 FIDELITY OBSERVED; sourceBase 8ebc860 ancestor of HEAD 82c98f8; 9 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner e31dd206c0fb and spec 6fbbb1b901c2 pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
```
```
B PACKAGE S8 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld
EXIT=1
```

**Transcription note, so the quotation above is not read as byte-exact.** The runner prints four
U+2014 of its own, one each in SPEC OBSERVED, PARENT BOUND, ENVELOPE ABSENT and PRODUCT
IMPLEMENTED. This lane forbids that code point in anything this seat writes, so each of those four
is rendered above as a spaced ASCII hyphen and nothing else was altered. The byte-exact original is
`%TEMP%\s8out\r2ci.log`, and this file is 0 U+2014 / 0 U+2013. The author report quotes the same
four lines with the runner's own bytes intact, which is the other legitimate reading of the same
instruction; see N2 below.

**My log is byte-identical to the author's `%TEMP%\s8out\fix2.log`** (`fc /L` reports no
differences), so the terminal the author quoted is the terminal this seat independently produced.
Against `%TEMP%\s8out\r06.log`, the R1 run, exactly one line differs and only in one token:
`ancestor of HEAD c07d092` becomes `ancestor of HEAD 82c98f8`. Every sha256 and every count in all
ten lines is unchanged. The author's claim on this point is exact.

## 6. Suites re-run on this seat at `82c98f8`

Not read out of the author's logs. Each was launched here through `%TEMP%\rs-run.bat`.

| suite | my result | author claimed | log |
| --- | --- | --- | --- |
| the nine `rebuild/lanes/b/tooling/test/*.test.cjs` | 106 pass / 0 fail | 106 / 0 | `%TEMP%\s8out\r2-tool.log` |
| the five `s8-supersede-*.test.cjs` | 16 pass / 0 fail | 16 / 0 | `%TEMP%\s8out\r2-sup.log` |
| `rebuild/m4/workout/test/s8-engine-files-differential.cjs` | exit 0, `27 tracked ... 18 named and NOT ONE moves ... all 45` | exit 0, 27 / 18 / 45 | run inline |
| the today suite, `rebuild/m3/w7-preview/today/test/*.test.mjs` and `*.test.cjs` | 661 pass / 0 fail | 661 / 0 | `%TEMP%\s8out\r2-today3.log` |
| VERDICT-S6.md rule (b), the three cells together | 34 pass / 0 fail | 34 / 0 | `%TEMP%\s8out\r2-ruleb.log` |

Every count the author reported is reproduced here exactly. The rule (b) three are
`rebuild/coach/test/engine-revision.test.cjs`, `rebuild/m4/import/test/production-mapping.test.cjs`
and `rebuild/m4/import/test/production-admission.test.mjs`.

## 7. The three R1 notes, dispositions

### N1, the two P3-LAYOUT-V2 cells: STILL OPEN. PM TO RULE. Correctly not fixed.

N1 was never an author error and was never mine to close. The author did the right thing twice: he
refused to mint the licence himself in the round, and in the fix round he refused again rather than
quietly declaring product that `:523` did not give him. What he did instead is what R1 asked for,
which is to put the PRICE on the record so the PM rules once and does not re-derive it. Report
section 12 now carries it.

I checked that transcription against my own R1 text line by line. It is faithful and it adds
nothing: the rule as written (`:523` names the `lanes/d/p3-real-shape` cells and only those; `:487`
stop 7 makes a `lanes/d` file product only when a declared child EXECUTES it), the cost (after S8
seals, a pinned workflow step invokes two files whose bytes no package declares, so the five
`CHILD_SPECS` drift cells and every parent-pin re-assert are blind to them, and the gap 5 closure
of `:523` is proved by cells a later round could edit with no seal noticing), and the four
declarations that would close it (`rebuild/lanes/d/p3-layout-v2/` as a twenty-first `CHILD_ROOT`,
the two cells as role `new` with `pre: null`, and one more declared child executing them or their
two paths appended to the `d-real-shape` child's argv, which moves that child's needle off
`# pass 56`), together with the fact that closing it moves `b-package.cjs` and therefore
`tooling.runnerSha256`, the six ancestor specs, `packages/S8.json`, the brief and the
BRIEF-BY-SHA line. Nothing is unproved today and the two cells do run in CI on both runners.

**Disposition: STILL OPEN, by design, and it is a PM decision, not a defect. It does not block
the PM's three token lines and it does not block the seal round.**

### N2, the em-dash census: RESOLVED, and the replacement is correct.

I re-measured it myself rather than reading the new table. Over every ADDED line of
`git diff --unified=0 1af78de..HEAD` at `82c98f8`, counting both code points, by file, lines and
occurrences:

| file | U+2014 | U+2013 |
| --- | --- | --- |
| `rebuild/lanes/b/tooling/packages/S8.json` | 2 lines / 17 occurrences | 2 lines / 16 occurrences |
| `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md` | 4 lines / 4 occurrences | 0 / 0 |
| every other added line of the round, including `S8-PREP-REVIEW-R1.md` | 0 / 0 | 0 / 0 |

Totals 21 U+2014 and 16 U+2013 on added lines. That is the corrected table in report section 9.5
exactly, so the withdrawal is right and the replacement is right. I also located the lines
themselves: the two `S8.json` lines are 1254 and 1260, `authorizations.owner` (`DECISIONS:60`, 14
U+2014 and 1 U+2013) and `authorizations.contract` (`:49`, 3 U+2014 and 15 U+2013), which is the
17/16 split and confirms the author's account of what the withdrawn "33 U+2014" actually was: the
sum of two different code points on one pair of lines. Those two lines are historical ledger text
the runner matches by sha256 and they must stay byte-exact. The four in the report are lines 249,
251, 253 and 255, each inside the verbatim terminal block, each a U+2014 the runner itself printed.
No authored prose and no product file this round wrote carries either code point.

**Disposition: RESOLVED.** The sentence R1 objected to no longer exists; what replaced it is a
measurement I reproduce to the occurrence.

### N3, the `rebuild.yml` comment: DISPUTE UPHELD, deliberately not fixed, correction carried.

R1 found the claim loose and in the same breath ruled that correcting one word would move
`rebuild.yml`'s `post`, `packages/S8.json`, the brief and the BRIEF-BY-SHA line for nothing
measurable, and directed it into `VERDICT-S8.md` the way `VERDICT-S7.md` carried S7's own brief
slip. The author followed that ruling exactly: `rebuild.yml` is untouched by `82c98f8`, and report
section 12 records the correction to be read as "the brief predicts the first refusal; the author
report predicts the exact terminal refusal."

**Disposition: DISPUTE UPHELD (by the reviewer's own R1 ruling, not by the author's assertion).
The comment stands as committed. The correction is now on the record twice, in R1 and in report
section 12, and belongs in `VERDICT-S8.md`. Nothing in the runner, in any cell or in any sha256
reads that comment.**

## 8. Push discipline

`git rev-parse HEAD` and `git rev-parse origin/rebuild/d-p3-real-shape` are both
`82c98f891cf24ad339cddc0969087e3ecb574b0b`. The branch history since the base is
`1ac0c72, 70b983a, ef21153, 6c55082, c07d092, 30dd4c0, 63d6647, 82c98f8`, which is the eight
commits the author named, with my own R1 file `63d6647` carried up unmodified. I have not pushed
anything in this round and I commit only this file.

## 9. What I did NOT verify in R2, stated so it is not assumed

Unchanged from R1 and re-stated because nothing in the fix round touched any of it. I ran `--ci`
only, never `--full`: there is no private junction on this seat, so `PRIVATE ORACLE PRESENT`, the
45-law phase, the historical audit and the nine SUPERSEDED gates are still unexercised by any run
on this branch, and the `s8-supersede-*` evidence children are what I ran instead. R02 to R05 of
the refusal chain remain the author's own measurements on intermediate commits and on a scratch
compile; I re-ran only the final refusal, on this head. `supersessionRuling()` and `coverage()`
have still never executed against this package, because the GATE-SUPERSESSION line cannot be
located by the runner until the PM appends it. I did not re-derive the 25 needles or the 224
declared shas in R2: R1 measured all of them at `30dd4c0`, and `82c98f8` moves no byte any of them
reads, which section 1 proves by numstat rather than by assertion. I read nothing private.

## 10. STILL OPEN at the end of R2

1. **N1, the two `p3-layout-v2` cells.** PM decision, priced in report section 12 and in R1. Not a
   defect and not a blocker; rule it or carry it forward knowingly.
2. **The three token lines are not minted.** `DECISIONS.md` on this worktree still has 523 lines.
   Until the PM appends the THEME, BRIEF-BY-SHA and GATE-SUPERSESSION lines byte-exact, `--ci`
   correctly ends `FAIL RECEIPT-EXACT-LINE-MISSING` and no PASS word exists.
3. **N3's correction is owed to `VERDICT-S8.md`**, where `VERDICT-S7.md` carried S7's equivalent.

## VERDICT

**ACCEPT. 0 BLOCKING.** The fix round did what a fix round with no blocking finding should do and
nothing more: it moved one undeclared prose file, it withdrew a wrong sentence and replaced it with
a measurement that survives independent re-measurement, it declined to invent a licence the ledger
has not given, and it left every hashed byte where the PM last saw it. The package is unchanged
from the state R1 accepted. The next move is the PM's, and it is to append the three token lines.
