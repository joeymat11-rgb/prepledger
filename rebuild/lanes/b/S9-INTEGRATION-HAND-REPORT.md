# M2-S9-UI-PINS, THE INTEGRATION HAND'S REPORT, PART 1

**This report is a hypothesis for the PM and for one independent review, not evidence.** It seals
nothing, writes no `packages/S9.json`, proposes, exports and writes no artifact and no receipt,
fills no literal and issues no PM token line. Every number below carries the head, the platform and
the command it was taken with; where a number could not be taken on a platform, this report says so
rather than borrowing the other platform's.

**Branch** `rebuild/b-s9-integration`, cut by the PM from `rebuild/b-s9-ui-pins` at `8c2bc36e`.
**baseSha** `8c2bc36e91ae346508d31095302eb86a6f708228` (`git status` clean at the start).
**headSha** `f925b6fe024235bd210967db765828f43065ed27`, pushed.
**Instruction sheet** `rebuild/lanes/b/S9-UI-PINS-BRIEF.md` at `8c2bc36e`, ACCEPTED at
`DECISIONS:627`, read whole before any act and sections 6, 8, 9 and 11 re-read before each.
**Rulings carried out**: `:627` (P-S9-1, P-S9-3, P-S9-5, P-S9-6), `:623`, `:620` (PM-A1), `:619`,
`:591`, `:582`, `:570`, `:559`.

**THE FOURTEEN COMMITS OF PART 1, oldest first, all on the first-parent chain of this branch:**

| commit | what |
| --- | --- |
| `62db825` | merge 1 of 5, the runner lane `a224c7b0` |
| `087cbe6` | merge 2 of 5, the fence lane `6f808cfa` |
| `6620aea` | merge 3 of 5, the pack lane `3f020026` |
| `a6ee861` | merge 4 of 5, `rebuild/d-f2-land` `24bef9b9` whole |
| `550227e` | merge 5 of 5, `rebuild/c-passphrase-normalize` `bc308d94` |
| `3fdea22` | RED FIRST: F7, F8 and one behavioural row, against the unchanged runner |
| `c4224ee` | THE RUNNER COMMIT: two child roots, one tail root, PM-A1 |
| `cd05dbc` | RED FIRST: the pack step's own condition row |
| `d9ccaa9` | R6-Z2/Z3 and the four workflow rows in the fence cell |
| `2924b7b` | the three `if:` lines (pack, passphrase, local-import) |
| `d4a3c92` | P-S9-5, the explicit retirement of `ci-second-gate.test.cjs:29` |
| `4b98bfc` | RED FIRST: the cross-lane release-object cell |
| `e2ca032` | the release-object cell's CI home |
| `f925b6f` | an interim E fact 7, LAST: the seven ancestor re-pins |

## 1. THE MERGES, AND THE `DECISIONS:582` PREFLIGHT RUN BEFORE EACH

Each merge is a MERGE COMMIT made with `git merge --no-ff --no-commit` and then
`git -c user.name=... commit -F <msgfile>`. No rebase, no squash, no fast-forward. Each was
preceded by the preflight the ledger orders: the changed NAMES of the lane against this branch's
base, intersected with the `product` and `executionPins` keys of
`rebuild/m4/spec/acceptance-s8-real-shape.json`.

**The parent artifact, measured in the reading room at this branch's base:** `product` has **224**
keys, `executionPins` **71**, their union **227** distinct paths. That union is the set every
preflight below is intersected with.

**A SEALED HIT IS EXPECTED HERE AND ROUTES NOTHING AWAY**, because this branch IS the reseal child
that `DECISIONS:455` and `:582` send such a lane to. Every hit below is part of part 2's
declaration list, and this section is where that list comes from.

| # | lane | head | changed names vs `8c2bc36e` | sealed hits | conflict |
| --- | --- | --- | --- | --- | --- |
| 1 | `origin/rebuild/b-s9-prep-runner` | `a224c7b0` | 26 | **13** | none |
| 2 | `origin/rebuild/b-s9-prep-cells` | `6f808cfa` | 11 | **3** | none |
| 3 | `origin/rebuild/b-s9-prep-pack` | `3f020026` | 11 | **1** | none, auto-merged |
| 4 | `origin/rebuild/d-f2-land` | `24bef9b9` | 29 | **1** | none, auto-merged |
| 5 | `origin/rebuild/c-passphrase-normalize` | `bc308d94` | 8 | **0** | none |

**Merge 1, the runner lane, 13 sealed hits:** `rebuild/lanes/b/tooling/b-package.cjs`;
`rebuild/lanes/b/tooling/packages/H3.json`, `S3.json`, `S4.json`, `S5.json`, `S6.json`, `S7.json`,
`S8.json`; `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs`;
`rebuild/m3/w7-preview/today/test/food.test.mjs`, `machine-settings-ui.test.mjs`,
`problem.test.mjs`, `setup.test.mjs`.

**Merge 2, the fence lane, 3 sealed hits:** `.github/workflows/rebuild.yml`,
`rebuild/m3/w7-preview/measure/test/boundary.test.mjs`,
`rebuild/m3/w7-preview/today/test/package.test.cjs`.

**Merge 3, the pack lane, 1 sealed hit:** `.github/workflows/rebuild.yml`.

**Merge 4, F2-LAND, 1 sealed hit:** `.github/workflows/rebuild.yml`.

**Merge 5, the passphrase lane, 0 sealed hits.** The lane's three sealed carries
(`import-bundle.mjs`, `import-screen.mjs`, `import/test/page-bundle.test.mjs`) are not in the diff
because `ba04c07f` was already merged into this branch's base, exactly as the brief says at section
9 item 1. `rebuild/m3/setup/port/passphrase.cjs` is in NEITHER parent map: it is S9's own role
`new` declaration, not a parent pin.

### 1.1 CONFLICTS, per file, both sides and the resolution

**THERE WAS NO CONFLICT IN ANY OF THE FIVE MERGES.** `git diff --name-only --diff-filter=U` was
empty after every one. Two of the five reported `Auto-merging .github/workflows/rebuild.yml`, which
is git's three-way merge succeeding, not a conflict.

This is the file the brief expected to conflict, and it did not, for a reason worth recording: the
three lanes that add steps to it add them at three different regions. The fence lane adds its step
beside the today step (around `:230`) and the passphrase and local-import steps at the end; the
pack lane adds its step after the A5 steps; F2-LAND adds its step in the lane D block. Against the
merge base none of the three deletes a line, so no two lanes changed the same line differently and
the keep-both resolution the brief requires is the one git produced by itself.

**Because no conflict arose, this hand made no ordering decision.** Each lane's step stands where
that lane's own comment says it belongs, and no previously landed step was moved. The seven CI
homes brief item 6 names all exist at the head, and section 5 below lists them with their line
numbers.

**THE F2 HEAD IS LATER THAN THE BRIEF'S CITATION, AND THIS IS WHAT THE LATER COMMITS ARE.** The
brief cites `b9777fe4`; `origin/rebuild/d-f2-land` is at `24bef9b9`. Between them stand three
commits: `938f65ca` and `24bef9b9`, two chain-tip merge-forwards the integrator made for the
both-OS run under `DECISIONS:563` and `:565`, and `4f89fb9b`, a ledger commit (`DECISIONS:579` to
`:581`). **F2's own product bytes did not move between the two heads:** `git diff b9777fe4
24bef9b9` names `rebuild/m4/workout/setup-tags.cjs` zero times and `rebuild/lanes/d/f2/` zero
times. What the two merge-forwards brought that this branch did not have is the CHAIN's content up
to that point: P4b-1's four coach memory modules and two cells, `rebuild/coach/TOOL-CONTRACT.md`,
`model-adapter.md`, `tools.cjs`, `local-world.mjs`, `test/no-dashes.test.cjs`, five P4B-1 lane
papers, and `rebuild/DECISIONS.md` and `rebuild/lanes/STATUS.md` advancing from 548 lines to 581.
**This hand edited neither ledger file**; they arrived by merge only, which brief section 2.5 and
the loop rules both allow. Part 2 should note that this branch therefore already carries the chain
to `DECISIONS:581` and no further, while the tip stands at `:628`.

### 1.2 THE MERGED LANES' OWN CELLS, RUN AFTER EACH MERGE, ON THE PC

| after merge | command | tests | pass | fail | skipped | the reds, by name |
| --- | --- | --- | --- | --- | --- | --- |
| 1, runner | the ten tooling suites in one run | 151 | 151 | 0 | 0 | none |
| 2, fence | `sealed-inventory-fence.test.mjs` | 44 | 43 | 1 | 0 | THE REAL ROW, which waits for the seal |
| 3, pack | `pack-pin.test.mjs` | 68 | 67 | 1 | 0 | REAL ROW: the owner-approved pack ... |
| 3, pack | `approved-pin.test.mjs` | 47 | 46 | 1 | 0 | REAL ROW: whatever design.APPROVED names ... |
| 4, F2 | `projector.test.mjs` + `guard-coverage.test.mjs` | 81 | 81 | 0 | 0 | none |
| 5, passphrase | the lane's three cells | 29 | 29 | 0 | 0 | none |

Every red above is a REAL ROW that waits for the seal. The runner's 151 of 151 reproduces the
accepted total of `DECISIONS:620` at `a224c7b0` exactly; F2's 81 of 81 reproduces `DECISIONS:581`.
The pack cells' 68/67/1 and 47/46/1 are the Windows numbers at `3f020026`; the PM's linux numbers
at the same head were 68/65/1 with 2 skipped and 47/45/1 with 1 skipped, and the difference is the
recorded Windows-only and linux-only clauses, not a disagreement.

## 2. THE CROSS-LANE RELEASE-OBJECT CELL (brief 9.2, P-S9-6)

**The four things the brief orders NAMED, named.**

| | |
| --- | --- |
| path | `rebuild/lanes/c/ui-port/release-object.test.mjs` |
| product role | `new`, `pre: null`; its `post` is measured in part 2 after its bytes stop moving |
| CI home | ONE explicit step of `.github/workflows/rebuild.yml`, beside the pack step, naming that one file by exact path, never globbed, carrying `if: ${{ !cancelled() }}` |
| declared child | `ui-port-release-object`, argv `--test rebuild/lanes/c/ui-port/release-object.test.mjs`, written into `packages/S9.json` in part 2. Its root `rebuild/lanes/c/ui-port/` is in `CHILD_ROOTS` from this branch's own runner commit `c4224ee`, so `childArgv()` admits it |

**IT IS BUILT OUT OF BOTH SIDES' OWN CODE.** Three fragments are lifted by EXACT TEXT, and each is
asserted to occur exactly once in its file, so a change of construction on either side turns this
cell red instead of leaving it testing a copy of something that no longer exists:

1. `b-package.cjs`, `proposed()`'s three-line `const releasedMap = Object.fromEntries(...)`;
2. `b-package.cjs`, `proposed()`'s emission `...(release.declared.length ? { released: releasedMap } : {}),`;
3. `sealed-inventory-fence.test.mjs`, `const released = new Set(Object.keys(inv.released || {}));`.

They are then EVALUATED, so every fixture row's artifact half is produced by the runner's own
expressions and read back by the fence's own line. No shape is hand-written and called the
runner's; the one hand-written shape in the file is the deliberate WRONG shape of row (4), and the
same row measures that the runner cannot produce it.

**The eight rows.** (1) the compatibility row: the runner's block, read by the fence's line, yields
exactly the two released paths. (2) the value shape: E fact 15's four fields, and an `edited`
declaration never reaches the block. (3) H11's other half: a package that releases nothing emits no
`released` key at all and the fence reads the empty set, which is the case every artifact sealed
before this role existed is in. (4) THE EXECUTED COUNTEREXAMPLE: a released ARRAY reads through the
fence's own line as the indices `"0"` and `"1"`, so both released paths stay FENCED while the
artifact looks as though it released them; and `Object.fromEntries` cannot produce that. (5)
`released` is the last `ARTIFACT_KEYS` entry and `envelope()` closes it by the freeze pattern.
(6) THE REAL ROW. (7) this cell's own step and its condition. (8) the ten-word refusal vocabulary.

**RED FIRST, measured on the PC at `4b98bfc` before the step existed:** tests 8, pass 6, fail 2.
The two reds by name were

```
REAL ROW: the released block of the real acceptance artifact, against the fence's own reading
  RELEASE-OBJECT ARTIFACT-ABSENT rebuild/m4/spec/acceptance-s9-ui-pins.json
(7) this cell's own step in rebuild.yml exists, names it by exact path and carries the not-cancelled condition
  no step in rebuild.yml runs rebuild/lanes/c/ui-port/release-object.test.mjs at all
```

At `e2ca032` row (7) is green and the real row is the single remaining red, refusing by name. **It
stays red until the seal, like the fence's real row and the two pack real rows**, and it is named
as such in the bar.

## 3. THE PACK-PIN CI STEP'S `if:` LINE AND ITS OWN ROW (brief 9.3)

`DECISIONS:559` (P-FENCE-1) ordered the pack step the same condition the fence's step carries and
made it the integrator's hand; `DECISIONS:570` added "plus its own row"; the brief is explicit that
the row lives INSIDE the pack cell and not as a second row inside the fence cell.

**RED FIRST, on the PC at `cd05dbc`, against the unchanged workflow:** `pack-pin.test.mjs`
tests 69, pass 67, fail 2. The new row was red with

```
the pack step carries no `if:` at all, so GitHub skips it after the standing step at :150 fails
```

**GREEN at `2924b7b`:** tests 69, pass 68, fail 1, the one red being the REAL ROW.

The row reads `rebuild.yml` as TEXT out of the WORKING TREE, finds the step by this file's own path
and not by a line number, asserts the step does not glob, and matches the condition with the same
`/!\s*cancelled\(\)/` the fence's row (18) uses, so the two cannot drift apart in method. It is
placed after the real row and BEFORE the vocabulary row, which must stay last because it compares
what every row above it emitted with the exported seven.

**The pack cell's bytes and totals moved and are re-measured** in section 8.

## 4. R6'S ONE ROW WITH TWO ASSERTS (brief 9.4), AND THE FOUR PAPER NUMBERS (brief 9.5)

**The row.** `R6-Z2/Z3 (29) - a SAME-LENGTH inventory edit and a ZERO-BYTE inventory each FAIL by
name`, in `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`. Z2 changes `M2-S8-FIXTURE` to
`M2-S8-FIXTURF` in the fixture inventory, one byte, length unchanged, still a valid JSON object;
the row asserts all three of those things about its own fixture so it cannot quietly become a
different test. Z3 writes `Buffer.alloc(0)`. Both halves require the FULL refusal string
`FENCE-INVENTORY-DIFFERS-FROM-CHAIN <path>`, never a prefix.

**IT IS A COVERAGE ROW AND IT WAS GREEN AGAINST THE UNCHANGED FENCE, AND THIS REPORT SAYS SO
RATHER THAN CALLING IT RED FIRST.** Review R6's own finding is that both mutants left all 44
existing rows green, which is why the row is owed; the fence's tamper limb compares BYTES
(`!worktree.equals(chainBytes)`), so neither substitution can be red against it. This is the same
shape as `DECISIONS:623` debt (3), where four of seven new pack rows were coverage rows with
executed counterexamples rather than red-first rows. **Its evidence is therefore two executed
single-clause counterexamples**, run in a linux farm scratch of the pushed head and reverted
afterwards (nothing mutated was committed):

| mutant, one clause of `fence()` at `:248` | result |
| --- | --- |
| `!worktree.equals(chainBytes)` becomes `worktree.length !== chainBytes.length` | tests 48, pass 46, fail 2. The two reds are row (29) and the standing REAL ROW. **No other row of the cell noticed.** |
| `!worktree.equals(chainBytes)` becomes `(worktree.length === 0 ? false : !worktree.equals(chainBytes))` | tests 48, pass 46, fail 2, the same two. **No other row noticed.** |

That second measurement is R6's finding reproduced at this head: the pre-existing rows do not cover
either substitution, and row (29) is the only thing standing between the fence and both of them.

### 4.1 THE FENCE'S FOUR PAPER NUMBERS, RE-TAKEN AT THIS HEAD (brief 9.5)

Brief section 9 item 5 owns the fence's PAPER corrections ONLY, and orders all four re-taken at the
integrated head because the R6-Z2/Z3 row moves the cell's bytes again. **They are re-taken here and
the B lane's own report is NOT rewritten by this hand**; a lane's paper of record is that lane's,
and the corrected section 17 at `6f808cfa` stays what `DECISIONS:591` made it. Whoever amends it
should amend it to these four values.

| # | the number as `6f808cfa` section 17 states it | RE-TAKEN at `f925b6fe` |
| --- | --- | --- |
| 1 | cell sha256 `673a02f9334af5e6a4469a4085ead55bcc465b1a62650a49da3896207986b199` at `8019abf6` | **`ae98e5a3af38b7799ce6c2479c1c8a11b5b919560d156e31f81a3676a9691638`**, 1659 lines, 105588 B |
| 2 | the diffstat, 56 cell lines and 222 insertions over `68ed616d..8019abf6` | the integration's own diff `8019abf6..f925b6fe` for that one path is **132 insertions, 0 deletions, 1 file**: the R6-Z2/Z3 row, the four workflow rows and their two helpers |
| 3 | "it was not reworded" is true at `2f37a36e` and not at the accepted head | still not true at this head, and now for a second reason: this hand added 132 lines to the cell |
| 4 | section 15's present-tense account of `FENCE-INVENTORY-HEAD-UNREADABLE` is HISTORY | still HISTORY. Measured at this head: the string occurs in the cell **once**, at `:520`, inside a comment that says review R5's catch USED to turn a throw into it; it is not a refusal this cell can emit |

## 5. THE CI HOMES (brief 9.6), AND THE RUNNER HUNKS THEY NEED

### 5.1 The homes, every one an explicit step named by exact path, never a glob

Measured at `f925b6fe` by reading `.github/workflows/rebuild.yml`: the file has **30** named steps
and **30** `run:` lines, of which **exactly one** carries a glob, and it is not one of these eight
and is not this round's: the pre-existing `C5` step, `node --test "rebuild/coach/test/*.test.cjs"`.
None of the eight homes below globs; every one names its files by exact path.

| brief item 6's list | step name in the file | `run:` at line | `if:` |
| --- | --- | --- | --- |
| the fence | `C - the sealed-inventory fence over this branch's own diff` | 259 | `${{ !cancelled() }}` (from the lane) |
| the two pack cells | `C - the design pack pin and the approved-reference pin` | 377 | `${{ !cancelled() }}` (**added here**) |
| **the integration's own** | `C - the release object the runner writes, against the fence's reading of it` | 397 | `${{ !cancelled() }}` (**added here**) |
| the Today lane's two cells, in ONE step | `C - Today's headline over an open proposal (S1) and the whole plan sentence (S2)` | 406 | none; it is not one of the steps P-FENCE-1 and P-S9-3 rule on |
| the passphrase lane's three cells | `C - the passphrase normalisation helper, its route and the unlock forms` | 424 | `${{ !cancelled() }}` (**added here**) |
| `rebuild/m3/w6/test/local-import.test.mjs` | `W6 - the local import's seal constants, the phone's against the PC's` | 440 | `${{ !cancelled() }}` (**added here**) |
| the `p3-layout-v2` cells | inside `D - the real-shape admission and adoption rule, the bar, and the v2 capture layout` | 335 | none; it was already there before S9 |
| E fact 23: F2-LAND's TWO cells, ONE step, ONE declared child | `D - the exercise-tag projector, its taxonomy and its new-exercise binding` | 315 | none; it arrived with the F2 merge |

**Five of the eight homes arrived with a merge and were not written by this hand**: the fence's,
the passphrase's and local-import's (merge 2), the pack's (merge 3) and F2's (merge 4). The Today
step and the `p3-layout-v2` cells were already in the base. What this hand added is the
release-object step and four `if:` lines.

### 5.2 THE RUNNER COMMIT, `c4224ee`, and it is the only one

**runner sha256 BEFORE** `d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53`,
312108 B, 3898 lines. That is the ACCEPTED value of `DECISIONS:620`, reproduced by this hand on the
PC at the merged head before any edit.
**runner sha256 AFTER** `5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22`,
314978 B, 3933 lines.

Three hunks, and no other executable line of the runner moves.

1. **`CHILD_ROOTS` gains `rebuild/lanes/c/ui-port/` and `rebuild/lanes/d/f2/`**, at the END of the
   list, twenty-four to twenty-six. A widening adds; it never re-orders or edits what a previous
   seal pinned, which is F7's own rule. The comment above the constant that said `ui-port` was
   withheld because C-UI-1 had not merged and the directory did not exist is corrected in place:
   both halves were true of the preparation branch and are false of this one, and it named ONE
   missing root where there are two (review L1 B2).
2. **`PUBLIC_TAIL_ROOTS` gains ONLY `rebuild/lanes/c/ui-port/`**, six to seven.
   `rebuild/lanes/d/f2/` becomes a child root whose tail stays WITHHELD by path policy, which F8's
   withheld loop now measures. Executing is not printing, and the second is argued per root with
   `TAIL_DENYLIST` in hand.
3. **PM-A1**, `DECISIONS:620`, corrected in the integration's own runner commit and BEFORE E fact 7
   is done for the last time, so the sha the seven ancestors carry is the sha of the corrected
   file. The comment above `canonicalSpecPaths()` read "EVERY FIVE of the strings `proposed()`
   turns into executionPins - the four a spec declares AND the two this file fixes itself", and
   four plus two is six. **The routes were counted off `proposed()` itself and not off any report.
   There are FIVE, in the order that function writes them:** (1) `RUNNER`; (2) `TOOLING +
   '/packages/' + ID + '.json'`, this run's own package spec file; (3) `s.brief.file`, when it
   exists on disk; (4) `s.carrierSuccessor.file`, when a carrier successor is declared and the file
   exists; (5) every target `childArgv(c)` returns for every declared child `c`. **THREE are
   supplied by the spec and TWO are fixed by this file.** The `pins` object `proposed()` returns
   has no other producer. It is a comment and changes no behaviour.

**F7, F8 AND ONE BEHAVIOURAL ROW, RED FIRST AT `3fdea22` AGAINST THE UNCHANGED RUNNER.** Measured
on the PC, both tooling cells in one run: tests 27, pass 24, **fail 3**, the three by name being

```
F7 - CHILD_ROOTS ... and M2-S9-UI-PINS's six behind them
F8 -- PUBLIC_TAIL_ROOTS and TAIL_DENYLIST are the fixed lists the tail diagnostic gates on
M2-S9-UI-PINS -- ui-port and f2 targets are admitted, and their parent directories still refuse
```

The third is new and is the clause's behavioural row: it calls the REAL `childArgv()` through the
compiled runner and asserts the two new roots' targets are admitted, while
`rebuild/lanes/c/`, `rebuild/lanes/d/`, `rebuild/lanes/c/ui-portish/` and `rebuild/lanes/d/f2x/`
still refuse `CHILD-ARGV-TARGET`. That second half is what stops the widening being wider than it
is. At `c4224ee` all three are green and the ten tooling suites are **152 of 152**, the one extra
row over the accepted 151 being that behavioural row.

### 5.3 The boundary cell's `CHILD_SPECS` edit: ALREADY DONE BY A MERGE, AND MEASURED

E fact 12 (brief 5.1, review L1 N11) says four of five `CHILD_SPECS` cells carry the `'S9'` literal
and `measure/test/boundary.test.mjs` does not, and that the fifth edit is TO DO at integration.
**Measured at this head: all five carry it.** `boundary.test.mjs:140`, `food.test.mjs:842`,
`machine-settings-ui.test.mjs:759`, `problem.test.mjs:1621` and `setup.test.mjs:2365` each read
`const CHILD_SPECS = ['H3', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];`. The fifth edit arrived
with merge 2: the fence lane had already made it. **This hand therefore wrote no hunk for E fact
12**, because the brief orders the edit and not an edit of its own, and the edit exists.

## 6. P-S9-3 AND P-S9-5, AND THE MEASURED CHOICE OF HOME FOR THEIR FOUR ROWS

### 6.1 P-S9-3: the two `if:` lines and the two condition-reading rows

`DECISIONS:627` P-S9-3 settles what the brief left OPEN at its section 9 item 7 and 12.2: the
passphrase step and the local-import step carry the same `if:` line as the fence and the pack, each
with a condition-reading row. Both lines landed at `2924b7b`.

`local-import.test.mjs` is role `pinned-unchanged` with equal measured `pre` and `post` (E fact
22), which is honest exactly because S9 does not write it. **Its row therefore cannot live inside
it**, and the brief says so.

### 6.2 P-S9-5: what was retired, measured first

**MEASURED BEFORE THE RETIREMENT, because the ruling rests on both facts.**
`rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs` is in **NEITHER S8 map**: read out of
`rebuild/m4/spec/acceptance-s8-real-shape.json`, it is not a key of `product` and not a key of
`executionPins`. Editing or retiring it is therefore NOT a sealed act. And `rebuild.yml` names
`ci-second-gate` **zero** times, so the cell has no CI home and nothing runs it.

**Before, on the PC:** tests 35, pass 34, fail 1, exit 1, the one red being
`workflow changes exactly one command and retains both OS jobs`.
**After, on the PC:** tests 34, pass 34, fail 0, exit 0.

**WHAT ELSE THE FILE HOLDS, AND IS LEFT BYTE-UNCHANGED**, as the task requires it be said: the
closed CLI profile argument test; the cold CLI's fixed public label over three argv shapes; the
closed evidence validator and its twenty-one named refusal mutants; the public formatter's closed
result; the protected-string canaries, including the split-across-writes one; the accessor and
missing-guard cases; the quiet boundary's capture-and-restore and its output limit; the cold actual
entry over missing and throwing preflight dependencies; the pinned-helper custody checks; and the
one-expression source gate. Thirty-four rows, all green on the PC.

**NOTHING IS DROPPED.** Only the whole-workflow equality went. The retirement is written into the
file in place of the row, on the record, with the three facts and the new home of the two
invariants.

### 6.3 THE HOME FOR THE FOUR ROWS, CHOSEN BY MEASUREMENT

The task sets three conditions at once: a cell **a CI step really runs on both systems**, that is
**not `pinned-unchanged`**, and that **reads the workflow from the working tree**.

**The measurement that decides the first condition.** On any branch that is not on the chain tip,
the standing step `b-package.cjs --ci --package S8` at `rebuild.yml:150` is refused, and GitHub
skips every later step that carries no condition (`DECISIONS:627`, `:563`). So the only steps that
REALLY run on both systems on this branch are the ones carrying `if: ${{ !cancelled() }}`: the
fence's, the pack's, the release-object cell's, the passphrase's and local-import's. Every other
candidate that reads `rebuild.yml` from the working tree (`h3-clean-init.test.cjs`,
`boundary.test.mjs`, the five today cells, `engine-revision.test.cjs`, `production-mapping`,
`production-admission`, `b-ntc-successors`, `local-witnesses`, `pwa/workflow.test.cjs`,
`today-headline.test.mjs`) sits behind the standing step and is SKIPPED, so it fails the first
condition however well it satisfies the third.

**Of the five that remain:** `local-import.test.mjs` is `pinned-unchanged` (E fact 22), excluded by
the second condition and by the brief; `pack-pin.test.mjs` owns its own condition row by the
brief's section 9 item 3 and its subject is the design pack; the three passphrase cells' subject is
key material on the phone; `release-object.test.mjs` is about the released key of the artifact.
**`sealed-inventory-fence.test.mjs` is the only one of the five that ALREADY reads
`.github/workflows/rebuild.yml` as text out of the WORKING TREE (its row (18)), is role `new`, and
is already being edited this round for R6-Z2/Z3** - so the four rows cost one file's bytes instead
of two. That is why that one.

### 6.4 The four rows, each with the single-clause change that kills it

| row | red first? | the single-clause change that kills it, EXECUTED |
| --- | --- | --- |
| `P-S9-3 (30) - the passphrase lane's step carries the not-cancelled condition` | **YES.** At `d9ccaa9`, against the unchanged workflow, the fence cell was 48/45/3 and this was one of the three | deleting the one `if:` line under that step's `- name:` turns row (30) red and leaves row (31) green (measured in a linux farm scratch, reverted) |
| `P-S9-3 (31) - the local-import step exists and carries the not-cancelled condition` | **YES**, same run | the same deletion under the local-import step |
| `P-S9-5 (32)`, half one: both OS jobs retained | **NO. It is green at this head** and this report says so rather than calling it red first | `os: [ubuntu-latest, windows-latest]` becomes `os: [ubuntu-latest]`: row (32) goes red with `the windows job is gone from the matrix: os: [ubuntu-latest]` (measured) |
| `P-S9-5 (32)`, half two: no step forgiven by an or-true | **NO**, green at this head | `run: node rebuild/t2/rig187.cjs` becomes `run: node rebuild/t2/rig187.cjs \|\| true`: row (32) goes red naming the line, `78: run: node rebuild/t2/rig187.cjs \|\| true` (measured) |

Both `P-S9-5` counterexamples were executed in a linux farm scratch of the pushed head and reverted
immediately; nothing mutated was committed, and `git status` in that scratch was clean afterwards.

## 7. AN INTERIM E FACT 7, DONE LAST (`f925b6f`)

Brief 5.1 E fact 7 and section 9 item 10, and `DECISIONS:598`'s rule that this is done AFTER every
other runner hunk. **The runner's bytes stopped moving in part 1 at `c4224ee`**: nothing after it
touches `rebuild/lanes/b/tooling/b-package.cjs`.

Seven files, ONE value each, ONE byte range each, `tooling.runnerSha256` and nothing else:
`packages/H3.json`, `S3.json`, `S4.json`, `S5.json`, `S6.json`, `S7.json`, `S8.json`, all at the
`runnerSha256` key of the `tooling` block on line 45 of each file.

```
from  d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53
to    5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22
```

**MEASURED BEFORE THE EDIT: the old value occurs EXACTLY ONCE in each of the seven files.** The
prose notes in `S4.json`, `S5.json`, `S6.json`, `S7.json` and `S8.json` that recount earlier
re-pins are left as the history they are; no other byte of the seven moves.

**PART 2 REPEATS E FACT 7 ONLY IF THE RUNNER MOVES AGAIN**, and it will move again if part 2 adds a
runner hunk of its own. The value above is the sha of the runner as part 1 leaves it, and it is
interim for that reason and no other.

## 8. EVERY HUNK OUTSIDE A MERGE, BY FILE, WITH ITS REASON

| file | what this hand changed | why, and where it is ordered |
| --- | --- | --- |
| `rebuild/lanes/b/tooling/b-package.cjs` | `CHILD_ROOTS` +2, `PUBLIC_TAIL_ROOTS` +1, PM-A1's comment, and the two comment blocks beside those constants | brief 9.6 with review L1 B2; PM-A1 from `DECISIONS:620`, ordered into "the integration's OWN runner commit" by brief 9.11 |
| `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | F7's literal, its `slice(8)` window, its stated count 24 to 26 and its title; F8's literal, its count 6 to 7 and its withheld loop | brief 5.1 E fact 6: "F7's literal, its slice(8) window and its stated count all move with the hunk, and F8's PUBLIC_TAIL_ROOTS literal moves by exactly ONE" |
| `rebuild/lanes/b/tooling/test/execution-targets.test.cjs` | one new behavioural row over the real `childArgv()` | the task's rule that every clause added gets a row that fails without it; the F7/F8 literals are declarative and this one is behavioural |
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | one new row, the pack step's own condition | brief 9.3, `DECISIONS:559` with `:570` |
| `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` | row (29) R6-Z2/Z3; rows (30), (31), (32) and their two helpers | brief 9.4 (`DECISIONS:591`); `DECISIONS:627` P-S9-3 and P-S9-5 |
| `rebuild/lanes/c/ui-port/release-object.test.mjs` | NEW FILE, 278 lines | brief 9.2, `DECISIONS:559` as ruled by `:627` P-S9-6 |
| `.github/workflows/rebuild.yml` | four `if:` lines (pack, release-object, passphrase, local-import) and one new step (release-object), each with its reason in a comment | brief 9.3 and 9.6; `DECISIONS:559`, `:570`, `:627` P-S9-3 |
| `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs` | the whole-workflow equality row retired, on the record, in place | `DECISIONS:627` P-S9-5, which settles brief 9.8 |
| `rebuild/lanes/b/tooling/packages/{H3,S3,S4,S5,S6,S7,S8}.json` | `tooling.runnerSha256`, one value each | brief 5.1 E fact 7 and 9.10 |
| `rebuild/lanes/b/S9-INTEGRATION-HAND-REPORT.md` | NEW FILE, this report | the task |

**No other file was edited by this hand.** `rebuild/DECISIONS.md` and `rebuild/lanes/STATUS.md`
moved only by merge 4 and were not edited. No byte under `rebuild/engine` moved. Nothing under
`rebuild/conform/private`, `src/`, any `ledger/`, `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log`
or the protected soak was read, listed, opened or grepped on either machine.

## 9. THE BAR, AS MEASURED

**Two platforms, and neither establishes the other** (D-PLATFORM-EVIDENCE, brief section 8). The
PC is Windows, outside any sandbox, in the worktree `%TEMP%\earned-s9int` at the pushed head. The
linux half is a farm scratch worktree of the SAME pushed commit `f925b6fe`, node v22.22.2, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` on both. **Neither establishes hosted CI**,
and hosted CI says nothing about these cells on this branch: the standing step is refused, so every
step without a condition is skipped.

| suite | platform | tests | pass | fail | skipped | the reds, by name |
| --- | --- | --- | --- | --- | --- | --- |
| the ten tooling suites | PC | 152 | 152 | 0 | 0 | none |
| the ten tooling suites | linux | 152 | 152 | 0 | 0 | none |
| `sealed-inventory-fence.test.mjs` | PC | 48 | 47 | 1 | 0 | `THE REAL ROW - this branch touched no sealed path the chain has not released` (**expected, waits for the seal**) |
| `sealed-inventory-fence.test.mjs` | linux | 48 | 47 | 1 | 0 | the same one |
| `pack-pin.test.mjs` + `approved-pin.test.mjs` | PC | 116 | 114 | 2 | 0 | `REAL ROW: the owner-approved pack at this head...` and `REAL ROW: whatever design.APPROVED names at this head...` (**both expected**) |
| `pack-pin.test.mjs` | linux | 69 | 66 | 1 | 2 | the pack real row |
| `approved-pin.test.mjs` | linux | 47 | 45 | 1 | 1 | the approved real row |
| the passphrase lane's three cells | PC | 29 | 29 | 0 | 0 | none |
| the passphrase lane's three cells | linux | **not runnable in the farm** | | | | see below |
| the two F2 cells | PC | 81 | 81 | 0 | 0 | none |
| the two F2 cells | linux | 81 | 81 | 0 | 0 | none |
| `release-object.test.mjs` | PC | 8 | 7 | 1 | 0 | `REAL ROW: the released block of the real acceptance artifact...`, refusing `RELEASE-OBJECT ARTIFACT-ABSENT rebuild/m4/spec/acceptance-s9-ui-pins.json` (**expected, waits for the seal**) |
| `release-object.test.mjs` | linux | 8 | 7 | 1 | 0 | the same one |
| `ci-second-gate.test.cjs` | PC | 34 | 34 | 0 | 0 | none |
| `ci-second-gate.test.cjs` | linux | 34 | 33 | 1 | 0 | `restoring times1000 cannot satisfy the actual one-expression source gate` - **a FARM SCOPE limit, not a defect**: that row asks Git for a blob of `src/`, which is outside the farm's include list on purpose and can never be there. The PC is the evidence for that row |
| the today step, the exact command `rebuild.yml:232` names | PC | 685 | 683 | 2 | 0 | two, both predicted by the brief: see below |

**THE CELL THAT NOW HOLDS THE CONDITION ROWS** is `sealed-inventory-fence.test.mjs`, measured in
the two rows above: 48 of 48 with the single expected real-row red, on both systems.

**THE TWO TODAY-STEP REDS, and the brief's KNOWN REDS table predicts both.**

```
P-MEASURE (g) - no S4-sealed file drifts except where a declaring spec says so, and this lane's own drift is today-app.cjs
  an S4-sealed file drifts and no package on this branch declares the bytes it stands at
re-pin - every file the B-NTC package pins is untouched by A4b, on disk
  a file the B-NTC artifact pins moved on disk and no package on this branch declares it
```

Both name the same missing thing: **there is no declaring package on this branch yet**. All five
`CHILD_SPECS` cells already carry `'S9'` (section 5.3), so the remaining half of the mechanism the
brief names is `packages/S9.json` with the measured inventory, which part 2 writes. **The brief
said the actual boundary and setup output and its head were TO CITE at integration from the run
that produces them; this is that run, and the two lines above are that citation, taken on the PC at
`f925b6fe`.**

**`b-package.cjs --ci --package S8`, BY ITS REFUSAL NAME, at the base and at the head.**

| where | platform | last line | exit |
| --- | --- | --- | --- |
| base `8c2bc36e` | linux farm scratch | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld` | 1 |
| head `f925b6fe` | linux farm scratch | the same line, byte for byte | 1 |
| head `f925b6fe` | PC | the same line | 1 |

**THE REFUSAL NAME IS THE SAME AT THE BASE AND AT THE HEAD, and it is NOT the one the task
predicted.** The task and `DECISIONS:627` name `SEAL-BASE-IS-NOT-THE-CHAIN-TIP`; what this branch
actually prints, at both ends, is `SEALED-PROFILE-RECOMPUTATION`. The two are the pair `:627`
itself names as the reasons a lane branch is refused at that step, and this branch reaches the
second one first because its base already carries undeclared sealed edits (the passphrase and Today
carries). Either way the consequence `:627` draws is unchanged: the step fails, GitHub skips every
later step that carries no condition, and hosted CI says nothing about this branch's own cells.
**The integration does not change that refusal**: base and head print the same sentence. What did
change between them, printed in the same run's `SPEC OBSERVED` line, is `under 20 fixed root(s)` at
the base and `under 26 fixed root(s)` at the head, which is the `CHILD_ROOTS` hunk seen from the
runner's own mouth.

**WHY THE PASSPHRASE LANE HAS NO LINUX HALF, said plainly rather than left as a gap.** Two of its
three cells (`route.test.mjs`, `unlock-forms.test.mjs`) call `sealInventedBundle`, which starts the
real port CLI as a child process; that CLI's gate needs oracle files that are OUTSIDE the farm's
include list on purpose and can never be brought there (FARM.md; `DECISIONS:605` records the same
constraint from the other side). In the farm the helper throws
`port.cjs did not seal the invented bundle (status 2) ... 4. ORACLE FAIL ... NO BUNDLE WRITTEN`,
at module load, so the two cells report 1 test and 1 fail each and measure nothing.
`helper.test.mjs` alone runs there and is green. **The PC's 29 of 29 is the evidence for this lane
and there is no linux half to compare it with.** That is a platform limit, stated, not a red.

**NOTHING WAS RE-RUN TO MAKE A TIMING FAILURE GO AWAY, because nothing failed on timing.** Every
red above is either a REAL ROW that waits for the seal, a row that waits for `packages/S9.json`, or
the one farm-scope row named as such.

### 9.1 The bytes this round moved, measured at `f925b6fe`

| path | sha256 |
| --- | --- |
| `rebuild/lanes/b/tooling/b-package.cjs` | `5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22` |
| `.github/workflows/rebuild.yml` | `78d40700feacca467fe96c3ffeea133ab0f585ad414a01f5652d37812b4ff0ca` |
| `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` | `ae98e5a3af38b7799ce6c2479c1c8a11b5b919560d156e31f81a3676a9691638` |
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | `de68a7bdb9f48955a86c59960486e0750703f21dc0239077348489a4efd3946c` |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | `231e7332b66d2b0e103d6cdbc367f471255dfbb2f5cd16e7ccf1abbc8c1b618b` (unchanged by this hand; the accepted value of `DECISIONS:623`) |
| `rebuild/lanes/c/ui-port/release-object.test.mjs` | `a990e162ef41b3b268879c9ac868582de2d71482040252d14c18133d5696ba85` |
| `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs` | `f3c470c60748e637c82130a121d18bee989b537e45a619e74ee1f63998a276a5` |
| `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | `a8ebdb7d74c95c563896cb71fd9d8fa901091d865bd238f27267b87145d65195` |
| `rebuild/lanes/b/tooling/test/execution-targets.test.cjs` | `7ca0e32a0dd3467fee94f57e51cd6e0ab8bc21cfd98761c6a7c4bdc4338c142e` |
| `rebuild/m3/setup/port/passphrase.cjs` | `69c23e45412db61e5c8c96fc464a818fd660de1446fb2bdbcf13f7dc47b3c929` (moved by merge 5, comment text only, `DECISIONS:619`) |

**EVERY ONE OF THESE IS PROVISIONAL AND PART 2 RE-MEASURES IT.** They are stated so a reviewer can
see what moved, not so anyone can paste them into a spec.

### 9.2 The preflight of this WHOLE branch against its base, which is part 2's declaration list

`git diff --name-only 8c2bc36e f925b6fe` returns **86** names; intersected with the parent
artifact's 227 keys that is **16 sealed hits**:

```
.github/workflows/rebuild.yml
rebuild/lanes/b/tooling/b-package.cjs
rebuild/lanes/b/tooling/packages/{H3,S3,S4,S5,S6,S7,S8}.json
rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs
rebuild/m3/w7-preview/measure/test/boundary.test.mjs
rebuild/m3/w7-preview/today/test/{food,machine-settings-ui,package,problem,setup}.test.mjs
```

**The fence's own real row, which diffs from the MERGE BASE WITH THE CHAIN and not from this
branch's base, names TWENTY-TWO sealed paths at this head** - the sixteen above plus the six the
base already carried from the passphrase and Today carries:
`rebuild/m3/w6/local/import-bundle.mjs`, `rebuild/m3/w7-preview/import/import-screen.mjs`,
`rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`,
`rebuild/m3/w7-preview/today/test/adapter.test.mjs`,
`rebuild/m3/w7-preview/today/test/view.test.mjs`,
`rebuild/m3/w7-preview/today/today-app.cjs`.
**Those twenty-two are the declarations part 2 owes over parent-pinned paths.** They are not the
whole product map: the role `new` files (the six `s9-*` mirrors, `release-from-seal.test.cjs`, the
fence, the two pack cells, the release-object cell, the three passphrase cells, the two
`p3-layout-v2` cells, the two Today lane cells, F2's two, `passphrase.cjs`, `setup-tags.cjs`) and
the six `pinned-unchanged` of E fact 17 are declared beside them, and the count is part 2's to
measure.

## 10. PART 2'S LIST: EXACTLY WHAT REMAINS, IN ORDER, WITH THE COMMANDS

**Nothing in part 1 is a substitute for any of these, and none of them was begun.**

**WHAT PART 2 IS WAITING ON BEFORE IT CAN START AT ALL** (brief section 11, unchanged by this
round): C-UI-0's acceptance after its second teeth audit, then C-UI-1's bytes. Until C-UI-1 lands,
the moved product files, `design.APPROVED`'s list, APPROVED-PIN's literal, E fact 17's path list
and the `--ci --package S9` walk cannot be measured.

1. **MERGE C-UI-1 when it lands**, with the `DECISIONS:582` preflight run first and written into
   the part 2 report, exactly as section 1 above does it.
   `git diff --name-only <this head>...<C-UI-1 head>` intersected with the 227 keys.
2. **NAME AND PRESERVE THE `sourceBase`.** P-S9-1 has already chosen it:
   `0cd07be7cf967dfbfea8c84947ba8477f58cfb5f`, re-measured and never rebased. **RE-MEASURE IT AT
   PART 2'S HEAD**, over all 227 paths: for each, `git show 0cd07be7:<path> | sha256sum` compared
   with the parent artifact's own pin, and `git merge-base --is-ancestor 0cd07be7 HEAD`. The brief
   and review L1 both measured 227 of 227 at `b1aaecf5`; that number is re-taken, not carried.
3. **THE DESIGN-OF-RECORD READER CELL (P-S9-2, disposition (b)), WHICH IS NOT THIS HAND'S.** One
   new declared cell under `rebuild/lanes/c/ui-port/` reading each design-of-record document
   through a LITERAL relative `new URL` and asserting its sha256, with a changed-document
   counterexample that must fail (D-REFERENCE-CLOSURE). Its path list is decided AFTER C-UI-1 moves
   `design.APPROVED`. Astra builds it, a Claude hand checks it.
4. **THE DAY-OF PACK PROCEDURE** (brief 9.9), in ONE sitting, in the brief's seven steps, filling
   PACK-PIN's and APPROVED-PIN's literals. Integrator-only (`DECISIONS:566`). Both real rows go
   green there and not before.
5. **THE E FACT 17 DISPOSITION**, once the PM's ruling and C-UI-1's file set exist: the six
   `pinned-unchanged` declarations, and the re-measured `executedClosure()` over the four
   documents and the two writers (the brief measured 0 of 4 and 2 of 2 at `a224c7b0`).
6. **`packages/S9.json` ITSELF**, with the four PM token lines cited by sha256 (RELEASE-FROM-SEAL,
   GATE-SUPERSESSION, THEME, BRIEF-BY-SHA), the measured `sourceBase`, every `pre` and `post`
   measured FROM GIT, the 25 re-declared children plus this package's own, and every needle
   RECOMPUTED by running each child. **P-S9-4: the GATE-SUPERSESSION carriers are written HERE,
   from the measured per-carrier evidence over `coverage.superseded.gates`, with
   `coverage.moves` left `{}`.**
7. **COMMIT the final runner and the final spec BEFORE `--ci`** (brief section 6 step 4, review L1
   B10): `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT` and `SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`
   refuse an uncommitted one.
8. **`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9`**, expecting
   `B PACKAGE S9 PUBLIC CI EVIDENCE PASS`; and the standing step flipped to `--package S9` INSIDE
   S9's own post, before `proposed()`, never at the fast-forward.
9. **THE ARTIFACT EXPORT AND THE PENDING REVIEW ENVELOPE** (brief 9.12): `proposed()` RETURNS an
   object and `--ci` does not write it, so part 2 names the exact command that serializes it and
   re-proposes after ANY input change.
10. **E FACT 7 AGAIN, LAST**, if and only if the runner moves again in part 2.
11. **The rest of brief section 6, which is the PM's and not a hand's**: the Fable final, `--full`
    with the private census, the receipt line, `review-s9-ui-pins.json`, the tip merge, the two
    commits of step 11, and the fast-forward.

### 10.1 EVERY NUMBER PART 2 MUST RE-MEASURE

| number | what part 1 leaves it at | how part 2 re-takes it |
| --- | --- | --- |
| the runner sha256 | `5321181a...04704fd22` | `sha256sum rebuild/lanes/b/tooling/b-package.cjs`, after the last runner hunk of part 2 |
| the seven ancestor `tooling.runnerSha256` | the value above | one replacement per file, after the last runner hunk |
| `CHILD_ROOTS.length` | **26** | it becomes 27 only if C-UI-1 adds a root; F7's literal, `slice(8)` and count move with it |
| `PUBLIC_TAIL_ROOTS.length` | **7** | F8's literal and count; only `ui-port` was added here |
| `rebuild.yml`'s combined post | `78d40700...12b4ff0ca` | measured ONCE, after every remaining step lands |
| the fence cell's sha256 and total | `ae98e5a3...` / 48 rows | moves again only if part 2 edits it |
| `pack-pin.test.mjs` sha256 and total | `de68a7bd...` / 69 rows | moves when C.5.1's literal is filled |
| `approved-pin.test.mjs` sha256 and total | `231e7332...` / 47 rows | moves when C.5.3's literal is filled |
| `release-object.test.mjs` sha256 and total | `a990e162...` / 8 rows | moves if Astra's narrow check orders a row |
| `passphrase.cjs` sha256 | `69c23e45...` | re-measured at part 2's head before the declaration |
| the two F2 cell sha256s | `f74bbe5f...` and `78d1d73c...` at `b9777fe4`, unmoved by merge 4 | `sha256sum` at part 2's head |
| the declared product count | **UNKNOWN. Part 1 asserts none** | the runner's own `SPEC OBSERVED` line |
| the child count, the root count, the D-id count | UNKNOWN | the same line |
| every needle | UNKNOWN | by RUNNING each child, never copied |
| the six `pinned-unchanged` pre/post | UNKNOWN | `git show <sourceBase>:<path> \| sha256sum`, equal on both sides |
| `local-import.test.mjs`'s `pre` and `post` | UNKNOWN, equal by E fact 22 | the same |
| the `executedClosure()` document and writer counts | 0 of 4, 2 of 2 at `a224c7b0` | re-run at part 2's head with C-UI-1's files |
| `page-bundle.test.mjs`'s two module counts | the brief marks them doubly TO MEASURE | outside any sandbox, at part 2's head |
| the four PM token line sha256s | none exists | over the exact line bytes, no trailing newline |
| the brief's own sha256 | `d8140074...0c31300d` at `8c2bc36e` (`DECISIONS:627`) | re-taken if the brief's last author pass moves it |

## 11. WHAT THIS ROUND DID NOT DO, AND WILL NOT CLAIM

- It sealed nothing, ran no `--full`, wrote no `packages/S9.json`, proposed and exported no
  artifact, wrote no receipt, filled no literal and issued no PM token line.
- It ran `b-package.cjs --ci --package S8` only, never `--full`, and never
  `rebuild/lanes/b/tooling/gen/seal-chain.cjs` or anything else that could seal or write into the
  tree. The seal generator on `rebuild/b-seal-gen` was not used and none of this was produced by it.
- It touched `packages/S9.json` not at all, and touched neither the PACK-PIN nor the APPROVED-PIN
  literal.
- It wrote nothing of the design lane, no design-of-record reader cell, and no byte under
  `rebuild/engine`.
- It edited neither `rebuild/DECISIONS.md` nor `rebuild/lanes/STATUS.md`; both moved by merge 4
  only.
- It pushed ONLY `rebuild/b-s9-integration`, never `rebuild/t2-client-core`,
  `rebuild/b-s9-ui-pins` or `main`, and it never rebased, force-pushed or amended a pushed commit.
- `SEAL_TIP_RULE` is untouched and stays `first-parent`. No constant of the runner moved beyond the
  three hunks named in 5.2.
- Zero U+2013 and zero U+2014 in any file this hand authored, and LF throughout.
- The farm's privacy proof printed **FARM-VERIFY PASS** at every sync of this assignment.

**Written on the owner's PC, where every measurement above was taken except the ones this report
marks LINUX, which were taken in the PM's cloud reading room against read-only synced worktrees and
throwaway scratch worktrees of the same pushed commit. The owner's own data entered nothing.**
