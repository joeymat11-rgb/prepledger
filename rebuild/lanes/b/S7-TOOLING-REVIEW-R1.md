# S7-TOOLING - independent review R1 (Opus, high, blind to the author)

## VERDICT

**ACCEPT WITH NOTES** - every claim in the author's summary that I could test I re-measured myself
and it held: the six `s7-*` cells are byte-faithful mirrors of their `s6-*` siblings with no
assertion removed or relaxed, the runner diff is exactly three additive hunks, all 206 `pre`/`post`
shas plus `runnerSha256`, the brief sha256 and the three token-line sha256s recompute exactly, all
24 declared children run green with their declared needles, the nine tooling suites are 105/105,
and my own `--ci --package S7` reproduces the author's terminal verbatim and refuses for the one
reason outside this ticket's scope. **0 BLOCKING findings.**

Reviewed at `f39a868311a7b03a42ee91279cff176c2da4a40e` on `rebuild/b-s7-port-admission`
(base `71d420cb`, origin at the same sha). Worktree `%TEMP%\earned-s7`, node from the codex runtime,
`TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`. `--full` was never run; nothing under
`rebuild/conform/private`, `src/history.js`, `ledger/` or any soak path was opened.

## 1. Mirror check - the six `s7-*` cells (NOTE, clean)

`git diff --no-index` of each `s6-*` file against its `s7-*` sibling. The complete set of
differences, across all six files, is: the package name `M2-S6-TODAY-CHILD` to
`M2-S7-PORT-ADMISSION`; `S6` to `S7` in test titles, prose and the two `RED CONTROL` /
`witness divergence` marker strings; the spec path `packages/S6.json` to `packages/S7.json`; the
parent from `M2-S5-TODAY-CHILD` to `M2-S6-TODAY-CHILD`, including the `SUP-4` literal
`assert.equal(PARENT.packageId, 'M2-S6-TODAY-CHILD', ...)`; the parent's token line `DECISIONS:462`
to `:490` (which `VERDICT-S6.md` confirms is S6's own token clause); the generation prose FOURTH to
FIFTH; and two sentences that named what S6 moved now naming what S7 moves
("pins page bytes" -> "pins the import path's bytes"; "the Today route's measure wiring and the
measure module" -> "the local-source admission rule, the Import screen's copy and the Edit My Week
companion").

**Not one assertion was removed, relaxed, reordered or made vacuous.** Every `assert.deepEqual`,
`assert.notEqual`, `assert.throws`, red-first execution and mutation control is the `s6-*` one,
byte for byte apart from the substitutions above. In particular `SUP-4`'s two `deepEqual`s over
`PARENT.coverage.supersededByCarrier['source-carriers']` and over the five carrier keys, `SUP-6`'s
mutation control, `SUP-10`'s removed-export control, `SUP-13`'s three-mode control and `SUP-16`'s
`genSession` guard mutation are all unchanged. `s7-engine-files-differential.cjs` keeps the
`rows.length + named.length === tracked.length` exhaustiveness assertion and the empty-`moved`
assertion.

## 2. Runner diff - exactly the S6-round shape (NOTE, clean)

`git diff --numstat 71d420cb..HEAD -- rebuild/lanes/b/tooling/b-package.cjs` is `26 3`, and the
diff is three hunks and nothing else:

- `:165` `IDS` gains `'S7'` directly behind `'S6'`, still ahead of `'B1'`:
  `['B-NTC', 'H3', 'S3', 'S4', 'S5', 'S6', 'S7', 'B1', 'B2', 'B4', 'B3']`.
- `:292` `NO_REGISTER_IDS` gains `'S7'`:
  `new Set(['B-NTC', 'H3', 'S3', 'S4', 'S5', 'S6', 'S7'])`.
- `:381` `CHILD_ROOTS` gains `'rebuild/lanes/d/p3-port-fix/'` as its nineteenth and last element.

Each carries its own commentary paragraph in the file's own voice, which is the house style of the
surrounding constants. Nothing else in `b-package.cjs` moved: `PUBLIC_TAIL_ROOTS`, `TAIL_DENYLIST`,
`RETIRED_IDS`, `NO_REGISTER_RULED_B_IDS`, `SEAL_TIP_RULE`, `MIN_OWN_CHILDREN`, `childArgv`,
`children`, `verifyReceipt`'s callers and every gate are untouched. `CHILD_SPECS` is NOT a runner
constant - it lives in the five sealed lane-C/lane-B cells, and each of those five diffs is a pure
append of `'S7'` to the array plus a comment block, with `declaredPost` and the youngest-first loop
unchanged.

`F6` and `F7` in `pinned-unchanged-and-ruled-substitutions.test.cjs` were widened to take the new
lists by literal and by `deepEqual` (`IDS` of eleven, `NO_REGISTER_IDS` of seven, `CHILD_ROOTS` of
nineteen in all three of the whole-list, `slice(8)` and length assertions). `F8`'s
`PUBLIC_TAIL_ROOTS` assertions are untouched and pass, which is the check that the new child root
did not leak into the print policy.

## 3. packages/S7.json - every sha recomputed from Git and disk (NOTE, clean)

I wrote my own script against Git and disk and recomputed the whole inventory independently of the
author's. **206 declared paths, 0 mismatches:**

- 23 `edited`: `pre` equals the blob at `sourceBase 3d002174`, `post` equals disk and Git at HEAD.
- 9 `new`: `pre` is `null`, the path does not exist at `sourceBase`, `post` equals disk.
- 173 `carried`: `pre === post`, equal to disk, and byte-identical to `sourceBase`.
- 1 `superseded-by-child` (`packages/S6.json`): `pre` equals the `sourceBase` blob, `post` equals
  disk.
- Every declared path's disk bytes equal its Git bytes at HEAD (tree clean).
- `tooling.runnerSha256 a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5` equals
  my own sha256 of `b-package.cjs` on disk.
- `brief.sha256 41ab30cef85e2a28f617944d3f0c180d18f78e4453da1d7e74f04a5a18e85ba1` equals my own
  sha256 of `rebuild/lanes/b/S7-PORT-ADMISSION-BRIEF.md`, and the file is **25683 bytes**.
- Parent artifact `acceptance-s6-today-child.json` = `0e52357ed622...` and parent review
  `review-s6-today-child.json` = `d21c9759 0030...` both verify.
- `sourceBase 3d002174` is an ancestor of HEAD.

Set comparison against S6.json: **all 196 of S6's declared paths are present in S7.json** (none
dropped), plus 10: `packages/S6.json` and the nine `new` files (the three `lanes/d/p3-port-fix`
cells and the six `s7-*` cells). 196 + 10 = 206.

**Ancestor treatment.** `git show --stat 7e5fcca` ("S6: re-pin H3/S3/S4/S5 onto the final runner")
moved FOUR ancestor specs, and `S6.json` declares `H3.json`, `S3.json`, `S4.json` role `edited` and
its own parent `S5.json` role `superseded-by-child`. The exact mirror one generation on is
`H3/S3/S4/S5` role `edited` and `S6.json` role `superseded-by-child`, which is what `S7.json`
declares. See finding N2.

**The three token-line sha256s.** I calibrated the hashing convention on the two citations this
same spec already pins and that already exist in `rebuild/DECISIONS.md` (`:49` contract, `:60`
owner): for both, the stored text equals the file's line byte for byte and its sha256 over the raw
line (leading `- ` included, no trailing newline, file split on `/\r?\n/`) equals the declared
`lineSha256`. Under that same convention, over the exact texts in `%TEMP%\s7out\final-lines.txt`:

| line | declared in S7.json at | sha256 I computed | |
| --- | --- | --- | --- |
| THEME | `authorizations.theme.lineSha256` | `f1746fe39a7a98fc7e6c9dd190b4e24cc7761884779d70f6f7a20414398745b5` | MATCH |
| BRIEF-BY-SHA | `brief.acceptedLedgerLine.lineSha256` | `b75f2c85ed642a4a269c3331905d3e27234206d28187cf43b4719e58289a2ff7` | MATCH |
| GATE-SUPERSESSION | `coverage.superseded.rulingLineSha256` | `46622ec5a6b30e0e46c2d44c1d2279c0869bceebfa8f2f8036d2ebf1c01c8023` | MATCH |

The THEME and BRIEF texts stored inside `S7.json` itself hash to the same two values, so spec and
hand-off agree. The BRIEF line's embedded sha256 and byte count (`41ab30ce...`, 25683) are the ones
I measured on the brief. I also hashed all 510 lines of `rebuild/DECISIONS.md` on this branch:
**none of them hashes to any of the three**, which is the refusal in section 5 stated as a
measurement.

## 4. Needles - all 24 children re-run, not six (NOTE, clean)

I reconstructed `children()`'s environment from `b-package.cjs:2053` (`NODE_OPTIONS: ''`,
`NODE_V8_COVERAGE: ''`, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`,
`EARNED_CLIENT_DIR=<root>/rebuild/client`, `cwd = root`, `process.execPath` with the child's own
declared `argv`) and applied the runner's own needle rule (`^<needle>` multiline) to each child's
stdout. **All 24 children: exit 0, needle HIT, `# fail 0`.**

```
today-17 682 · measure-hermetic 11 · s4-real-day 15 · a0-journeys 23 ·
s7-sup-source-carriers 4 · s7-sup-inherited-carriers 3 · s7-sup-defect-witnesses 3 ·
s7-sup-writers-differential 3 · s7-sup-second-gate 3 · engine-files-differential HIT (27/18/45) ·
d-plan-edit 89 · m4-import 62 · m4-import-production 28 · d-import-retract 13 ·
d-admission-swap 4 · d-replay-measure 9 · d-capture-start 14 · food-live-save 6 ·
w7-import 35 · w6-host-seams 9 · w6-local-source 26 · d-replay-all 28 · b-lom 30 ·
d-port-admission 31
```

Every figure is identical to the author's table, including the one that moved (`d-plan-edit`
68 -> 89) and `d-port-admission 31`, which `DECISIONS:510` reported and which both of us have now
measured independently. The six children that execute a file this package's lane D ancestors moved
(`d-plan-edit`, `w6-local-source`, `w7-import`, `d-import-retract`, `m4-import`,
`m4-import-production`) plus `d-port-admission` were all re-run, as the review ticket required, and
so were the other seventeen. Logs: `%TEMP%\s7rev\child-<name>.log`.

## 5. My own `--ci --package S7`, verbatim

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S7` at `f39a868`, **exit 1**
(`%TEMP%\s7rev\ci.log`, 10 lines, quoted here with the runner's three U+2014 rendered as a plain
hyphen because this file carries none):

```
B PACKAGE S7 SPEC OBSERVED packages/S7.json cf7c69b135fa880d56951319313d78ce9334201ae3f6ee9f5636c87a46eeda8f; runner a07df1e0942a017f44afcfa1b6b92d8f96ee6f5e20f9e4e8450072c76e9268a5 byte-identical on disk and in Git at HEAD; status=BRIEF-ACCEPTED; 0 D-ids ; 206 declared product files; 24 declared child(ren), argv file-first under 19 fixed root(s) with only --test --test-reporter=tap permitted; 0 declared move(s), each naming its own original executable in a relative require specifier (moves are refused outright under this runner - TOOLING-REVIEW-r3 X1); no successor carriers declared (every inherited gate must be carried by a parent-pinned executable); 5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by sha256 46622ec5a6b3, each with its own named and executed evidence
B PACKAGE S7 PARENT OPTION S6 M2-S6-TODAY-CHILD rebuild/m4/spec/acceptance-s6-today-child.json 0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f ACCEPTED at 23575c0f1e61ee714fb519cb3607c4779dcd0c24 (DECISIONS:500); artifact byte-identical on disk, in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review rebuild/m4/spec/review-s6-today-child.json d21c97590030 byte-identical on disk and on that branch; receipt base 934321f is an ancestor of it
B PACKAGE S7 PARENT BOUND S6 rebuild/m4/spec/acceptance-s6-today-child.json 0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f; single-parent chain holds - no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent
B PACKAGE S7 POSTFIX M2-S7-PORT-ADMISSION REVIEW-PENDING mode=--ci
B PACKAGE S7 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-s7-port-admission.json is not sealed yet - no PASS word is available
B PACKAGE S7 PARENT PINS RE-ASSERTED at run time; 2 pin(s) from rebuild/m4/spec/acceptance-s6-today-child.json plus its 196 product pins through the inventory below, and 1 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-s5-today-child.json, byte-identical on disk AND in Git at HEAD; 197 superseded pin(s) preserved in Git at sourceBase 3d00217; parent artifact byte-identical in Git at 23575c0f1e61ee714fb519cb3607c4779dcd0c24
B PACKAGE S7 PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 173 carried byte-identical from the parent / 0 declared role "pinned-unchanged" - executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 196 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S6.json)
B PACKAGE S7 FIDELITY OBSERVED; sourceBase 3d00217 ancestor of HEAD f39a868; 8 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner a07df1e0942a and spec cf7c69b135fa pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
B PACKAGE S7 FAIL RECEIPT-EXACT-LINE-MISSING; required evidence missing or failed; local diagnostics withheld
```

This is the author's section 5 terminal line for line, the only difference being the HEAD sha in
the FIDELITY line (`f39a868`, the author report commit, against their `3514616`).

**The remaining refusal is the three MISSING LEDGER LINES, not an absent artifact and not an absent
review.** `RECEIPT-EXACT-LINE-MISSING` is raised by
`rebuild/conform/v4/postfix/legacy-gates.cjs:verifyReceipt`, which requires exactly one line of
`rebuild/DECISIONS.md` whose sha256 is the cited `lineSha256`. `rebuild/DECISIONS.md` on this
branch ends at line 510 and I hashed every one of those 510 lines: none matches
`f1746fe3...` (THEME, cited at `:512`), `b75f2c85...` (BRIEF-BY-SHA, `:513`) or `46622ec5...`
(GATE-SUPERSESSION, `:514`). The artifact and the review are separately and correctly reported as
not yet existing, on their own lines and without failing the run
(`ENVELOPE ABSENT ... not sealed yet - no PASS word is available`, and `REVIEW-PENDING mode=--ci`).
Appending the three lines is the PM's act and nothing in this ticket's scope can close it.

## 6. Suites, cells and the lockdown

- The nine lane B tooling suites, run together with the runner's own env:
  **`# tests 105 / # pass 105 / # fail 0`, exit 0** (`%TEMP%\s7rev\suites.log`). The nine files are
  `child-diagnostic-tail`, `execution-targets`, `gate-supersession`,
  `parent-gate-closure-and-load-floor`, `parent-pin-shapes-and-spec-successors`,
  `pinned-unchanged-and-ruled-substitutions`, `product-phase-and-ledger`,
  `seal-tip-and-byte-identity`, `successor-moves`.
- The six `s7-*` cells, run as their own children: **4 + 3 + 3 + 3 + 3 = 16 pass / 0 fail**, and
  `s7-engine-files-differential.cjs` exits 0 printing its declared
  `ENGINE FILES DIFFERENTIAL: 27 ... 18 named and NOT ONE moves ... all 45` line.
- **Lockdown.** `git diff --numstat 71d420cb..HEAD` over `rebuild/DECISIONS.md`, `rebuild/engine`,
  `rebuild/coach` and the four product files FIX and FIX-2 moved
  (`rebuild/m3/w6/local/source-admission.mjs`, `rebuild/m3/w7-preview/import/import-screen.mjs`,
  `rebuild/m4/import/replay-registry.cjs`, `rebuild/m4/workout/plan-edit-model.cjs`) is **EMPTY**.
- **Dashes.** I scanned all 1466 added lines of `git diff 71d420cb..HEAD`: **zero U+2013 and zero
  U+2014**.
- Worktree clean; `git ls-remote origin rebuild/b-s7-port-admission` is `f39a868311a7...`, equal to
  HEAD. No other ref moved.

## 7. Findings

### BLOCKING

**None.**

### NOTES

**N1 (NOTE) - `DECISIONS:511` does not exist on this branch, and three lines are not enough.**
`rebuild/DECISIONS.md` ends at line 510 (`P3-PORT-FIX-2 JUDGED ... S7 SEAL PREPARATION
DISPATCHED`). The author report's first sentence, the brief's rewritten section 5.1 and the
`S7.json` comments all cite `DECISIONS:511` as this tooling ticket's own ruling, and `S7.json`
cites the THEME at `:512`, the BRIEF-BY-SHA at `:513` and the GATE-SUPERSESSION at `:514`. Those
line numbers are only correct if the PM appends a `:511` line FIRST. If the PM appends only the
three token lines they will land at `:511`/`:512`/`:513`, and `S7.json`'s `ledgerLine` fields will
be off by one against the file (the sha256 lookup itself is position independent, so the run may
well still pass, but the recorded numbers would be wrong and the brief would cite a `:511` that is
the THEME). **Recommendation: append the S7-TOOLING result as `:511` before the three token lines,
or renumber `authorizations.theme.ledgerLine`, `brief.acceptedLedgerLine.ledgerLine` and the five
`coverage.superseded.gates[*].why` citations down by one.** I could not read `:511` and therefore
could not verify the author's quotation of it (see section 8).

**N2 (NOTE) - the four-ancestor re-pin of deviation 7.1 is the correct mirror; do not revert
S5.json.** The author flags this as a possible over-reach. I checked the precedent directly:
`7e5fcca` ("S6: re-pin H3/S3/S4/S5 onto the final runner") moved four ancestor specs, and
`S6.json` declares `H3/S3/S4` role `edited` with its own parent `S5.json` role
`superseded-by-child`. Applied one generation on that is exactly `H3/S3/S4/S5` role `edited` and
`S6.json` role `superseded-by-child`, which is what `S7.json` does. Reverting `S5.json` would leave
a runnable spec pinning `runnerSha256 8d9a94c2...`, a runner that no longer exists on this tree.
**Recommendation: keep it as built.**

**N3 (NOTE) - the brief's sections 2 and 3 disagree with its own section 5.1.** Sections 2 and 3
still read 199 declared paths / 12 edited / 3 new / 184 carried / "no superseded-by-child", while
5.1 now carries 206 / 23 / 9 / 173 / 1. The author names this and explains it (the ticket said to
keep every section but 5.1 byte-identical, and section 2 already points forward to 5.1). It is
nonetheless a brief of record whose own counts contradict each other in two places. Fixing it moves
`brief.sha256` and therefore the BRIEF-BY-SHA line the PM is about to append, so it must be decided
BEFORE the line lands, not after. **PM's call.**

**N4 (NOTE) - one cosmetic inconsistency inside F7.** In
`pinned-unchanged-and-ruled-substitutions.test.cjs` the new root is called "an ELEVENTH" in the
comment above the test and "A NINETEENTH" in the comment beside the length assertion, and the test
title now reads "M2-S6-TODAY-CHILD adds exactly ten with M2-S7-PORT-ADMISSION's one behind them".
Both numbers are defensible (eleventh of the additions since S5, nineteenth of the whole list) and
the assertions are all correct and consistent (`length === 19`, whole-list and `slice(8)`
`deepEqual`s both carrying the new root). Prose only; no assertion is affected.

**N5 (NOTE) - the first commit is empty.** `aa2d6e3` carries no bytes; the R01 refusal is quoted in
its message and the whole chain is in the author report section 1. I re-ran the base state's
refusal by inspection of the `IDS` gate rather than by checking out `71d420c`, and the argv gate at
`b-package.cjs:557` does refuse an unlisted id before any spec is opened, so the claim is sound.
Acceptable as red-first evidence for a ticket whose product IS the runner's own argv table.

**N6 (NOTE) - `rebuild/lanes/d/p3-port-fix/` is a child root and deliberately not a
`PUBLIC_TAIL_ROOTS` member.** I confirmed `PUBLIC_TAIL_ROOTS` was not widened and that `F8` passes
over the split. The consequence the author states is real and worth the PM's eyes: if
`d-port-admission` ever fails in CI the diagnostic tail is withheld by path policy and only the
refusal code is printed. That is the conservative choice for a suite that drives the owner's own
import path, and I agree with it.

## 8. What I could not verify

1. **`DECISIONS:511`.** It does not exist on this branch, so I could not check the author's
   quotation of its seven-fact enumeration, nor its "exactly the way S6.json treated its ancestors"
   clause. N2 rests on the S6 commit and the S6 spec themselves, which I did read, not on `:511`.
2. **Anything past `RECEIPT-EXACT-LINE-MISSING`.** `laws()` and `children()` are never reached on
   this branch, so the runner has never itself executed a single declared child or the 45-law
   phase. My needle table is a faithful RECONSTRUCTION of `children()`'s spawn, not `children()`.
3. **`ENGINE_MAIN` and `ENGINE_OLD`.** `children()` inherits them from `laws()`, which builds them
   through `Reference.create`. I did not set them, for the same reason the author did not. I
   checked that no file in any of the 24 children's argv reads either name, and all 24 needles
   reproduced the S6 figures exactly, which is itself evidence the environment is right; but the
   first run that reaches `children()` under the real runner is still the first true test.
4. **`--full`, the private oracle, the receipt, the artifact, the byte-identity step and CI on both
   OS.** Out of scope for this ticket and for me; `rebuild/conform/private` was never created or
   read.
5. **The three token lines as the PM will actually append them.** I verified their sha256s against
   the texts in `%TEMP%\s7out\final-lines.txt`. If a single byte of any of those three lines
   changes on its way into `rebuild/DECISIONS.md` (a smart quote, a trailing space, a wrapped line)
   the run refuses again with the same code.

Reviewer: Opus, high effort, independent of the author. Nothing was weakened, no needle was guessed,
and no file outside this review file was modified.
