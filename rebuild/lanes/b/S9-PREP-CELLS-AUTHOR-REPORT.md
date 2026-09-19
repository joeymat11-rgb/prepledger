# S9-PREP-CELLS AUTHOR REPORT - the fence, the build law and the CI homes

Ticket S9-PREP-B. Branch `rebuild/b-s9-prep-cells`, cut from `rebuild/b-s9-ui-pins` at
`da9f8683` (= the chain tip `ad8ced07`, plus the two accepted carried lanes S9-TODAY-CARRY
and PASSPHRASE-NORMALIZE, plus S9-RELEASE-SPEC v4 and its review R4).

Design of record: `rebuild/lanes/b/S9-RELEASE-SPEC.md` (v4), with
`rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md` standing where the two disagree.

**THIS REPORT IS A HYPOTHESIS.** Reviewers are told to disagree where the evidence lets
them. Everything below that says "measured" was run; everything that says "I chose" is an
author's decision the PM can overturn.

## 0. WHAT LANDED, IN ONE TABLE

| ticket item | file | commit | state at the end |
|---|---|---|---|
| (1) the fence | `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` (NEW) | `eee1206` RED, `5738a96` GREEN, `b4b739c` three more rows | 20 rows: 19 green, THE REAL ROW red by name and expected |
| (2) H18 | `rebuild/m3/w7-preview/today/test/package.test.cjs` | `4f72b08` | 12 tests, 12 pass (was 11 tests) |
| (3) C.2 + E fact 12 | `rebuild/m3/w7-preview/measure/test/boundary.test.mjs` | `0191808` | 6 tests, 5 pass, 1 fail - the SAME pre-existing red as before the ticket |
| (4) three CI steps | `.github/workflows/rebuild.yml` | `f5517b9` | 33 insertions, 2 hunks, nothing between old :236 and old :303 |
| (5) this report | `rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md` (NEW) | this commit | - |

Nothing else was touched. `build.mjs` and `preview.css` were mutated in the working tree
for the red-first measurements below and restored with `git checkout --` both times;
`git status` was clean before each commit and no product byte is in any of them.

## 1. THE BAR, MEASURED ON THE PC

Node `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
(v24.19.0), `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, every long run through a
`.cmd` with a log and a `.done` file.

| what | before my first edit | after my last edit |
|---|---|---|
| `b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | **identical, byte for byte**, exit 1 |
| the whole today step (`rebuild.yml:232`, 17 cells) | see section 1.1 | see section 1.1 |
| all 24 cells in the three test directories under `rebuild/m3/w7-preview/` | tests 728, pass 726, fail 2, 154.3 s | - |
| the fence cell (new step a) | did not exist | tests 20, pass 19, fail 1, exit 1 |
| the three passphrase cells (new step b) | tests 20, pass 20, fail 0 | tests 20, pass 20, fail 0 |
| `rebuild/m3/w6/test/local-import.test.mjs` (new step c) | tests 22, pass 22, fail 0 | tests 22, pass 22, fail 0 |
| the lane C step at `rebuild.yml:306` | tests 9, pass 9, fail 0 | tests 9, pass 9, fail 0 |

**THE RUNNER'S REFUSAL IS THE SAME BEFORE AND AFTER, AND THAT IS A FINDING, NOT A
FORMALITY.** The ticket expected "a named refusal naming the sealed files you edited".
What the runner actually prints on this branch is `SEALED-PROFILE-RECOMPUTATION` with
`local diagnostics withheld`, and it prints exactly that with three sealed files edited
and with none. It never reaches `product()`'s `UNLISTED-PRODUCT-DRIFT`, because the
profile recomputation refuses first. So on this branch `--ci --package S8` cannot tell
anyone WHICH sealed path moved. That is section D.1's hole in its sharpest form and it is
the strongest argument in this round for the fence: the fence names all nine.

### 1.1 The today step and the two pre-existing reds

| run | tests | pass | fail | seconds |
|---|---|---|---|---|
| all 24 cells, untouched tree, before anything | 728 | 726 | 2 | 154.3 |
| all 24 cells, one `today/` entry deleted from `REQUIRED_INPUTS` | 728 | 726 | 2 | 154.9 |
| the today step (`rebuild.yml:232`, 17 cells) after my last edit | 683 | 681 | 2 | 152.8 |

**THE TWO FAILURES ARE NOT MINE AND WERE RED BEFORE THIS TICKET STARTED.** They are
`measure/test/boundary.test.mjs` `P-MEASURE (g)` and `today/test/setup.test.mjs` `re-pin`,
and both fail for one reason: the two accepted carried lanes moved sealed bytes that no
package on this branch declares yet. `packages/S9.json` is what declares them and it is on
this round's WAIT LIST. My edits GREW both lists by exactly the files I edited and changed
nothing else:

```
boundary.test.mjs P-MEASURE (g), before:  rebuild.yml, adapter.test.mjs, view.test.mjs, today-app.cjs
boundary.test.mjs P-MEASURE (g), after:   rebuild.yml, adapter.test.mjs, package.test.cjs,
                                          view.test.mjs, today-app.cjs
setup.test.mjs re-pin, after:             rebuild.yml on disk 9b01b21e4710 but pinned 839a79ab2eec,
                                          adapter.test.mjs, package.test.cjs, view.test.mjs
```

No re-run was needed anywhere in this round: nothing was green once and red once.

## 2. ITEM (1): THE FENCE

`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`, new, 20 rows, the first new file
in `rebuild/lanes/c/ui-port/` (the directory did not exist at `da9f8683`).

`fence(root, chainRef)` is a function of the repository root and the chain ref and of
nothing else. The real row and all 19 fixture rows call the same function. Each fixture row
builds its own repository with `fs.mkdtempSync`, `git init`, its own
`refs/remotes/origin/rebuild/t2-client-core` made with `update-ref`, and removes it in an
`after()` hook. **No fixture row touches this repository's refs**, and nothing in the cell
writes inside the repository it lives in.

### 2.1 RED FIRST, AND ROW (6) IS LITERALLY FIRST IN THE FILE

F.1 R10 says row (6) must be written before the fence has a happy path at all. Commit
`eee1206` carries all 20 rows against a `fence()` that reads the inventory **from the
worktree**, which is exactly the shape v1 of the spec had and R1 BLOCKING-2 refused. On the
PC:

```
eee1206 (RED):  tests 20, pass 6, fail 14, exit 1
  D.2 (6)  - a branch that widens released in its OWN worktree and then touches that path FAILS
    AssertionError: the fence read the branch's own inventory:
    'pass' !== 'fail'
  D.2 (6b) - a branch that DROPS a path out of product in its own worktree FAILS the same way
    (same shape)
```

That is the whole proof the fence is not self-certifying: a branch that widened the
`released` block in its own worktree and then edited `today-app.cjs` **walked straight
through** the worktree-reading fence. Commit `5738a96` replaces the body of `fence()` and
nothing else:

```
5738a96 (GREEN): tests 20, pass 19, fail 1, exit 1  (the one failure is THE REAL ROW)
```

### 2.2 Every row, and what it holds

| row | what it asks | state |
|---|---|---|
| (6) | a branch widens `released` in its own worktree and touches that path | FAILS with both `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` and `FENCE-SEALED-PATH-TOUCHED M <path>` |
| (6b) | the same attack by dropping the path out of `product` | FAILS the same two ways |
| (1) | a branch touching `today/today-app.cjs` | FAILS, refusal names that path |
| (1b) | a branch touching an EXECUTION PIN (not in `product`) | FAILS naming it: the inventory is both maps |
| (1c) | a DELETION of a sealed path | FAILS at status `D`: a deletion counts as touching |
| (2) | `preview.css` before S9 / after S9 / and a third path in the same map | FAILS / PASSES / still FAILS: the release is narrow |
| (3) | a branch touching `screens.template.html` | PASSES: nothing ever sealed it |
| (4) | the chain ref deleted | FAILS `FENCE-CHAIN-REF-ABSENT`, does not pass vacuously |
| (7) | `acceptance-s10-*.json` beside `acceptance-s9-*.json` | selects s10, by NUMERIC maximum (R1 N9) |
| (7b) | two artifacts at the same N | FAILS `FENCE-AMBIGUOUS-INVENTORY` naming BOTH |
| (8e) | the green control: a real reseal child | SKIPS and prints id, spec path, artifact and its measured sha256 |
| (8a) | an empty spec / a non-JSON spec / two added specs / TWO VALID added specs | all four FAIL `FENCE-RESEAL-CHILD-UNVERIFIED (1)` |
| (8b) | a spec binding a different artifact | FAILS `(2)`, and the refusal names the artifact it bound |
| (8c) | the right artifact, a sha256 the fence does not measure | FAILS `(2)` |
| (8d) | the runner in the diff with another id / the runner not in the diff at all / the chain already carrying the id and the runner untouched | all three FAIL `(4)` |
| (8f) | a `sourceBase` that is not an ancestor of HEAD | FAILS `(5)` |
| (8g) | R3 N4's after-the-merge world | satisfies `(3)` and FAILS `(2)`: see finding F3 |
| (8h) | the id in IDS at the chain ref over somebody else's inventory | FAILS `(3)` |
| (8i) | seven MODIFIED ancestor specs beside the one ADDED spec | SKIPS: the `--name-status` point of R3 N3 |
| REAL | this repository, this branch | FAILS by name; section 2.3 |

### 2.3 THE MEASURED REFUSAL OF THE REAL ROW ON THIS BRANCH

Asked for by name in the ticket. Measured on the PC at `b4b739c`:

```
THE REAL ROW - this branch touched no sealed path the chain has not released
AssertionError: this change touched 9 sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core does not release
  FENCE-SEALED-PATH-TOUCHED M .github/workflows/rebuild.yml
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w6/local/import-bundle.mjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/import/import-screen.mjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/import/test/page-bundle.test.mjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/measure/test/boundary.test.mjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/adapter.test.mjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/package.test.cjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/view.test.mjs
  FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/today-app.cjs
```

Read it line by line, because it is the most useful thing in this report:

* **three are this ticket's own**: `rebuild.yml`, `today/test/package.test.cjs`,
  `measure/test/boundary.test.mjs`. The ticket predicted exactly these three.
* **four are S9-TODAY-CARRY's declarations** (E fact 20): `today-app.cjs`,
  `today/test/view.test.mjs`, `today/test/adapter.test.mjs` and `rebuild.yml` again.
* **three are PASSPHRASE-NORMALIZE's** (E fact 21): `m3/w6/local/import-bundle.mjs`,
  `import/import-screen.mjs`, `import/test/page-bundle.test.mjs`.
* `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` is **absent**, which is its own small proof: the
  worktree copy of `acceptance-s8-real-shape.json` is byte-identical to the chain's.
* The branch carries no `rebuild/lanes/b/tooling/packages/S9.json`, so it makes NO
  reseal-child claim and the fence has nothing to verify one against. That is why the
  refusal is `FENCE-SEALED-PATH-TOUCHED` and not `FENCE-RESEAL-CHILD-UNVERIFIED`.

**AND THE THING THE PM SHOULD TAKE FROM IT.** Nine of the nine are paths the S9 package
will DECLARE, not paths S9 RELEASES. `released` will hold two paths and neither of them is
in this list. So the S9 package does not turn this row green through its `released` block
at all; it turns it green through the **reseal-child SKIP**, the moment `packages/S9.json`
lands at status `A` with `'S9'` in `IDS` in this branch's own `b-package.cjs`. Row (8e) is
the exact shape of that transition and it is green today.

**No skip, no environment switch and no softening was added** to make this row green. A
cell that can be turned off by the branch it fences is the thing D.2 exists to refuse.

### 2.4 Both operating systems

STOP condition: "any design in D.2 that cannot be built as written on BOTH operating
systems (say what you measured)." Measured on both:

| | Windows (the PC, node v24.19.0) | Linux (a farm scratch worktree at the same head) |
|---|---|---|
| the 19 fixture rows | all green | all green |
| the real row | the 9-path refusal above | the SAME 9-path refusal, path for path |

Nothing in the design had to bend for either. The three things that would have broken it,
and what was done about each:

1. **Line endings.** The artifact comparison is byte-exact (`Buffer.equals`). Every fixture
   repository sets `core.autocrlf false` and writes `.gitattributes` with `* text=auto
   eol=lf`, which is the same rule the real repository already carries (`.gitattributes:12`,
   and its own comment says why). Without it a Windows checkout would rewrite LF to CRLF in
   the worktree while the blob stayed LF, and `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` would
   fire on every branch.
2. **Path separators.** Every repository-relative path in the cell comes out of `git`
   (`ls-tree`, `diff --name-status`), which emits forward slashes on both systems. The only
   `path.join` is where a repository path is turned into a filesystem path to read, and it
   is spread from a `/`-split. This is R4 N1's first clause applied to this cell rather than
   to PACK-PIN.
3. **`git` on the runner.** `rebuild.yml:35` already sets `fetch-depth: 0`, so
   `refs/remotes/origin/rebuild/t2-client-core` is there. If it ever is not, row (4)'s
   behaviour is what happens: `FENCE-CHAIN-REF-ABSENT`, loudly, which is F.2 STOP-7's
   designed outcome and not a silent pass.

GitHub CI (`rebuild-public`, ubuntu and windows) is the both-OS evidence of record and runs
on this push.

## 3. ITEM (2): H18

`rebuild/m3/w7-preview/today/test/package.test.cjs`, one new cell and one literal list.
This file is SEALED in BOTH maps (`product`, and execution pin `1a29e3e0...`), so S9
declares it `role: "edited"` with a real post and its execution pin moves with it.
`build.mjs` is NOT edited by this ticket and is byte-identical at every commit.

### 3.1 The three steps, in B.8's own order

**Step 1, THE HOLE.** `rebuild/m3/w7-preview/today/reading-host.mjs` deleted from
`build.mjs`'s `REQUIRED_INPUTS`, nothing else changed, all 24 cells in the three test
directories under `rebuild/m3/w7-preview/` run before H18 existed:

```
clean tree:                 tests 728, pass 726, fail 2, duration_ms 154284
one today/ entry deleted:   tests 728, pass 726, fail 2, duration_ms 154915
```

The same two failures in both, and neither of them reads `REQUIRED_INPUTS`. The deletion is
invisible to every cell in the tree. That is the hole, and it is exactly the failure
`build.mjs:112-:115` was written against ("a page whose readings can vanish on a hard
kill").

**Step 2, THE CELL GOES RED ON THE SAME DELETION, NAMING THE PATH:**

```
package.test.cjs alone:  tests 12, pass 11, fail 1, exit 1
  H18 - the build still refuses a bundle that lost any of the 26 today/ required inputs
  AssertionError: Missing expected exception:
    rebuild/m3/w7-preview/today/reading-host.mjs left build.mjs's REQUIRED_INPUTS:
    the build no longer refuses a bundle without it
  expected: /BUNDLE-INPUTS FAIL: missing required input
            rebuild\/m3\/w7-preview\/today\/reading-host\.mjs/
```

**Step 3, GREEN WITH THE ENTRY RESTORED:** `tests 12, pass 12, fail 0, exit 0`. Before H18
the same file was 11 tests.

### 3.2 The one place the cell differs from B.8's wording

**Reported, not quietly substituted.** B.8 and E fact 16 ask for the assertion to be made
"against `build.REQUIRED_INPUTS`". **That constant is not exported.** `build.mjs:98` is a
module-local `const`, and `build.mjs:44` is
`export { APPROVED, readApproved, readFonts, assertDesignBinding, composeStyles };` and
there is no other constant export in the file. Exporting it is a `build.mjs` edit, and
`build.mjs` is outside this ticket's owned list.

What the cell does instead: **it asks the LAW rather than the list.** For each of the 26 it
hands `build.assertBundleInputs` the real built bundle minus that one path and requires the
refusal `build.mjs:438` gives, naming that path. An entry deleted from `REQUIRED_INPUTS`
stops being refused and the cell goes red naming it, which is what the hunk exists for, and
it is strictly stronger than reading the list because it asserts the BUILD'S REFUSAL. It is
the same shape that keeps law 7 alive over an unsealed implementation
(`copy.test.mjs:395` and `:405`).

**What it does NOT get without the export, said plainly: COMPLETENESS.** The cell cannot
prove that 26 is still the whole `today/` half if somebody ADDS a 27th entry. One line in
`build.mjs` (adding `REQUIRED_INPUTS` to the `:44` export list) would let the cell also
assert `deepEqual(build.REQUIRED_INPUTS.filter(under today/), TODAY_REQUIRED_INPUTS)` and
close it. **This is the one edit outside my owned list that this round wants, and the PM
routes it.** It is one line, it is a released file after S9, and it costs a re-measure of
`build.mjs`'s post.

## 4. ITEM (3): `measure/test/boundary.test.mjs`

Two S9 edits to the only cell in the tree that pins a released file by sha256 (C.1's
census, which R1 re-ran repository-wide and confirmed).

**(a) C.2, PM-R7, R2 N9.** ONLY the `shaOf(f) === declaredPost(f)` assert at `:188-:189`
goes. The constant `:179-:180`, the loop `:185-:190` and the `Object.hasOwn` assert
`:186-:187` ALL STAY, and a comment in their place names both released paths. v2 deleted
the whole loop while saying in the same row that it needed no change; R2 N9 is right.

**(b) E fact 12** for this one file: `'S9'` into `CHILD_SPECS` as the youngest, in the S8
comment's shape, **+12/-1** (eleven comment lines and the one array line). The other four
`CHILD_SPECS` cells belong to other lanes and were not touched.

### 4.1 Red first, and why it had to be measured off this branch

**On this branch the red cannot be shown at all**, because `P-MEASURE (g)`'s assert at
`:137-:139` is ALREADY red over the carried lanes' undeclared drift, so execution never
reaches `:185`. That is precisely what this file's own note says of an earlier branch:
"UNPROVEN ON THIS BRANCH, and said so rather than left to be discovered". So the red-first
was measured at the chain tip `ad8ced07` in a throwaway scratch worktree, where the walk
does reach the loop:

```
chain tip, untouched:                         tests 6, pass 6, fail 0
chain tip, one byte appended to preview.css:  tests 6, pass 5, fail 1
   "rebuild/m3/w7-preview/today/preview.css is moved by P3-IMPORT-UI-2 and no declaring
    spec names the bytes it stands at"                      <- that is :188-:189, by name
chain tip, same byte, with this edit applied: tests 6, pass 6, fail 0
chain tip, edit applied, :186 inverted to true: tests 6, pass 5, fail 1   <- mutation control
```

The last line is the point of keeping `:186-:187`: the surviving assert still has teeth,
and after the release it is this cell's own statement that a RELEASED path did not creep
back into an older seal's inventory.

**On this branch after the edit:** `tests 6, pass 5, fail 1` - the same pre-existing
`P-MEASURE (g)` red, with `today/test/package.test.cjs` added to its list by H18.

### 4.2 R4 N7, read and recorded rather than acted on

R4 N7 is a fact about this file's `declaredPost` walk and it is correct. After S10 releases
`today-app.cjs` with `post: null`, `declaredPost` (`:117-:126` in the pre-edit file,
`:128-:137` after) walks `CHILD_SPECS` youngest first and takes only a string post. E fact
12 puts `'S9'` into that literal HERE, and E fact 20 declares `today-app.cjs` `role:
"edited"` in S9 with a real post, so the walk lands on **S9's** post and not on S8's
`dc9a826e...`. Same red, at the same lines, **one package sooner** than F.1 R18's "two
packages downstream" says. Nothing in S9 changes because of it; A.2.1.1 owns the fix and
A.2.1.2 is where S9's obligation to leave the rule stated lives.

## 5. ITEM (4): the three `rebuild.yml` steps

33 insertions, 0 deletions, in TWO hunks **against the branch base `da9f8683`**:
`@@ -230,6 +230,21 @@` and `@@ -304,5 +319,23 @@`. Nothing between old `:236` and old
`:303` is touched, so the step another lane is adding after old `:297` merges without a
conflict. (Against the CHAIN TIP `ad8ced07` the second hunk reads `@@ -295,5 +310,32 @@`,
because the lane C step at `:305-:306` is itself one of S9-TODAY-CARRY's carried
additions.) Each step is named by exact path, never
globbed, and carries a comment in this file's own style.

| step | placed | command | measured on the PC |
|---|---|---|---|
| (a) the fence | directly after the A1/A2/A3/A4 today step's run line at `:232` | `node --test rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` | tests 20, pass 19, fail 1, exit 1 (the real row, expected) |
| (b) E fact 21 | directly after the lane C step's run line at `:306` | `node --test rebuild/lanes/c/passphrase-normalize/helper.test.mjs rebuild/lanes/c/passphrase-normalize/route.test.mjs rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs` | tests 20, pass 20, fail 0, exit 0 |
| (c) E fact 22 | directly after (b), before "Report the evidence boundary" | `node --test rebuild/m3/w6/test/local-import.test.mjs` | tests 22, pass 22, fail 0, exit 0 |

**E fact 22 re-measured before the step was written:** `rebuild.yml` named
`rebuild/m3/w6/test/local-import.test.mjs` **zero** times. Confirmed. Its root
`rebuild/m3/w6/test/` is already in `CHILD_ROOTS` (`b-package.cjs:405`), so this costs a
step and a declared child and no `CHILD_ROOTS` hunk. Confirmed by reading `:405`.

**The standing `--ci --package S8` step is NOT flipped.** E fact 10 is on the wait list and
nothing in this ticket touches `rebuild.yml:149-:150`.

**Step (a) is added RED on purpose.** It will fail on this branch's CI run, naming nine
sealed paths, until `packages/S9.json` lands. That is the honest state and F.2 STOP-8 says
in terms that a reseal child's own CI run failing the fence is better than a gate any
branch can open.

## 6. THE MUTATION TABLE, MEASURED

Method: a harness takes each guard clause of `fence()` and of the H18 cell one at a time,
removes or inverts it, runs the cell, and records which rows go red that were not red
before. Run in a writable scratch worktree at the pushed head `b4b739c`, on Linux; the
cell's own green and red are the PC measurements in sections 2 and 3. Every mutant is
listed, including the three that survived the first pass and the rows that were added to
kill them.

### 6.1 The fence

| # | mutation | row(s) that go red |
|---|---|---|
| M1 | the `FENCE-CHAIN-REF-ABSENT` guard removed | (4) |
| M2 | LEXICAL maximum instead of numeric | **18 of the 19 fixture rows** (the fixture artifact is `acceptance-s8-fixture.json` and a string compare reorders everything): the rule is load-bearing everywhere, not only in (7) |
| M3 | the `FENCE-AMBIGUOUS-INVENTORY` refusal removed | (7b) |
| M4 | the inventory read from the WORKTREE instead of the chain ref | (6), (6b), (8g) |
| M5 | the `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` refusal removed | (6), (6b) |
| M6 | the `released` block ignored | (2), (7) |
| M7 | `product` only, `executionPins` dropped from the inventory | (1b) |
| M8 | a deletion (status `D`) does not count as touching | (1c) |
| M9 | condition (1): "exactly one added spec" removed | (8a) |
| M10 | condition (2): the artifact-path equality removed | (8b) |
| M11 | condition (2): the sha256 equality removed | (8c) |
| M12 | condition (3) removed | (8h) |
| M13 | condition (4), first limb: "the runner is in the diff" removed | (8d) |
| M14 | condition (4), second limb: "the id is in the branch's own IDS" removed | (8d) |
| M15 | condition (5): the `merge-base --is-ancestor` test removed | (8f) |
| M16 | **v2's gate**: skip on the mere presence of an added `packages/*.json` | (8a), (8b), (8c), (8d), (8f), (8g), (8h) - this is R2 BLOCKING-A's hole and seven rows close it |
| M17 | `--name-only`: the status letter lost, every path read as `M` | (1c), (8e), (8a), (8b), (8c), (8d), (8f), (8g), (8h), (8i) - R3 N3's point, measured |

**ALL SEVENTEEN ARE KILLED. Three were not, on the first pass, and the honest answer to a
surviving mutant is another row rather than a weaker claim** (commit `b4b739c`):

* **M9 survived** because the `SPEC_KEYS` key closure caught every malformed second spec
  file, so the "exactly one" clause was never reached. Row (8a) gained a fourth sub-row
  with TWO specs that would each pass on their own.
* **M13 survived** because every existing row failed on condition (4)'s SECOND limb first.
  Row (8d) gained a sub-row where the chain already carries the id in `IDS`, so the branch
  would inherit it and only the first limb is left standing.
* **M14 survived** because the old row wrote a runner stub byte-identical to the chain's,
  so the file never reached the diff and the row was red for the other limb. It now writes
  a DIFFERENT id.

### 6.2 H18

| # | mutation | result |
|---|---|---|
| H-M0 | nothing mutated | GREEN (12 tests, 12 pass) |
| H-M1 | `reading-host.mjs` deleted from `build.mjs`'s `REQUIRED_INPUTS`, cell intact | **H18 RED**, naming that path |
| H-M2 | the `assert.throws` loop REMOVED, plus the same deletion | **GREEN** - this is the mutant that proves the loop IS the guard, and it is the hole of step 1 put back |
| H-M3 | one entry removed from the cell's literal list | **RED** on `length === 26` |
| H-M4 | one entry replaced by a duplicate of another | **RED** on `new Set(...).size === 26` |
| H-M5 | the list names a path the bundle does not carry | **RED** on `result.inputs.includes(required)` |
| H-M6 | the `result.inputs.includes` assert REMOVED | **GREEN** |

**H-M6 is reported rather than fixed, because it is honest about what that assert is.** It
is the second of the two assertions B.8 asks for ("that `result.inputs` carries it in the
built bundle"), and on today's tree it has no red of its own: every one of the 26 is in
the bundle, so removing the assert changes nothing until a build stops emitting one of
them. H-M5 shows the assert has teeth when that day comes. I did not invent a row to make
H-M6 die, because the only way to kill it would be to fake a bundle, and a cell that
asserts over a faked bundle asserts nothing about the real one.

## 7. EVERY COUNT I MEASURED

Taken from the tree with a script, never copied from the spec.

| count | measured | the spec says | verdict |
|---|---|---|---|
| `REQUIRED_INPUTS` path literals | **48** | 48 (A.4, after R2 N6) | CONFIRMED |
| of them under `rebuild/m3/w7-preview/today/` | **26** | 26 | CONFIRMED |
| the rest, by root | **3 `rebuild/engine/`, 3 `rebuild/client/`, 1 `rebuild/coach/`, 8 `rebuild/m4/`, 7 other `rebuild/m3/`** | the same five numbers | CONFIRMED |
| quoted strings in the block if prose is counted | **51** | 51, three of them prose | CONFIRMED |
| `acceptance-s8-real-shape.json` `product` | **224** | 224 | CONFIRMED |
| `acceptance-s8-real-shape.json` `executionPins` | **71** | 71 | CONFIRMED |
| `released` block present in the S8 artifact | **absent** | absent (S9 adds it) | CONFIRMED; the fence reads `inv.released \|\| {}` |
| `rebuild.yml` names `local-import.test.mjs` | **0 times** | zero (E fact 22) | CONFIRMED |
| `rebuild/m3/w6/test/` in `CHILD_ROOTS` | **present**, `b-package.cjs:405` | present | CONFIRMED |
| cells in the three test directories under `rebuild/m3/w7-preview/` | **24** (13 today, 6 measure, 5 import) | - | measured for step 1 |
| the fence cell | **20 rows**, 19 green, 1 red | - | measured |
| `package.test.cjs` | **11 tests before H18, 12 after** | - | measured |
| sealed paths this branch touches | **9** | the ticket named 3 of them | the other 6 are E facts 20 and 21 |
| `rebuild.yml` insertions | **33, in 2 hunks**, against the branch base `da9f8683` | - | measured |
| `boundary.test.mjs`, the E fact 12 hunk | **+12/-1** (eleven comment lines and the array line) | E fact 12 says +12/-1 | CONFIRMED, exactly |
| `boundary.test.mjs`, the C.2 hunk | **+13/-2** (the two assert lines out, a thirteen-line comment in) | C.2 says "one comment line in their place" | see finding F6 |
| `package.test.cjs`, the H18 hunk | **+82/-0** | - | measured |

## 8. WHAT THE TREE CONTRADICTS IN THE SPEC

Eight findings. None of them stopped the round; all of them are for the PM and the
reviewer.

**F1. B.8 and E fact 16 ask H18 to assert "against `build.REQUIRED_INPUTS`", and that
constant is not exported.** `build.mjs:98` is a module-local `const`; `:44` exports five
names and none of them is it. Section 3.2 has what I built instead and what it costs
(completeness). **This is the one edit outside my owned list that the round wants: one
line in `build.mjs`. I did not make it. The PM routes it.**

**F2. D.2 condition (3) says "the artifact the fence read at `CHAIN_REF` is that child's
own", and the obvious reading of that is wrong.** Measured: the artifact's `packageId` is
the THEME name (`"M2-S8-REAL-SHAPE"`), and its `lanePackage` is the id that `IDS` and
`packages/<ID>.json` carry (`"S8"`). A fence that compared `packageId` to `<ID>` would
never satisfy the clause. The cell compares `lanePackage`. One clause for the spec.

**F3. R3 N4's after-the-merge clause repairs condition (3) and condition (2) then refuses
anyway.** Row (8g) builds the exact world R3 N4 describes (the branch cut at A, the chain
takes S9 on a line of its own, the merge-base still A, `packages/S9.json` still at status
`A`) and measures it. The clause does its job: condition (3) is satisfied. Condition (2)
then refuses, because **a child's `parent.chosen` option names its PARENT's artifact by
construction, and after the merge the artifact the fence reads at the chain ref is the
CHILD'S OWN** - those two can never be the same path. So R3 N4's "a red nobody can
explain" is still there, one condition earlier. I did NOT invent a second limb for
condition (2): that is a spec change and this is an author's report. Row (8g) asserts the
refusal the fence AS SPECIFIED actually gives, and asserts that it is not `(3)`, so the
clause is measured to be live rather than dead code. **The PM decides whether condition
(2) gets the same second limb.**

**F4. D.2 names no refusal for the event the fence exists for.** Every other outcome has a
name (`FENCE-AMBIGUOUS-INVENTORY`, `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`,
`FENCE-RESEAL-CHILD-UNVERIFIED`, `FENCE-CHAIN-REF-ABSENT`); "a branch touching
`today/today-app.cjs` FAILS naming that path" has none. I named it
**`FENCE-SEALED-PATH-TOUCHED <status> <path>`**, one line per path, which is what produces
the log line D.2's "what it is NOT" row quotes. I also added
**`FENCE-NO-INVENTORY-AT-CHAIN-REF <ref>:<dir>`** for a chain ref whose `rebuild/m4/spec/`
holds no `acceptance-s<N>-*.json` at all, because the alternative is a vacuous pass and
D.2 refuses vacuous passes everywhere else. **Both names are mine and the PM may rename
them; nothing else depends on the spelling.**

**F5. D.2 does not say what a RENAME is.** `git diff --name-status` reports `R100 old new`.
I treat a rename as a DELETION of the old path plus an ADDITION of the new one, so a
sealed path renamed away is refused at status `D` and a sealed path renamed onto is
refused at status `A`. That is the reading consistent with "a deletion counts as
touching", but it is an author's decision and it is not in the spec.

**F6. One line cite is one off, and C.2's "one comment line" is thirteen.** E fact 12 and
C.2 give `measure/test/boundary.test.mjs:117` for `CHILD_SPECS`; it is at **`:116`**
(`:117` is the first line of `declaredPost`). Every other cite in C.2 is EXACT and I
re-read all four: `:179-:180` is the constant, `:185-:190` the loop, `:186-:187` the
`Object.hasOwn` assert, `:188-:189` the byte pin. E fact 12's `+12/-1` is met exactly
(eleven comment lines and the array line). C.2 asks for "one comment line in their place
naming both paths as RELEASED"; mine is thirteen, because one line cannot carry why the
byte pin goes, why `:186-:187` stays and gets stronger, and where the behaviour is
asserted instead - and this file's own house style is the eleven-line package comments
above it. **Cut it to one line if the reviewer prefers; nothing asserts on it.**

**F7. On this branch the C.2 red-first cannot be shown at all**, because `P-MEASURE (g)`
is already red at `:137-:139`. Measured at the chain tip instead (section 4.1). Worth
saying out loud because it means the S9 integrator cannot re-verify C.2's red on the
integration branch either, and will have to do the same thing.

**F8. `--ci --package S8` cannot name a moved sealed path on this branch.** It refuses
`SEALED-PROFILE-RECOMPUTATION` with `local diagnostics withheld` before it reaches
`product()`, and it prints exactly that whether three sealed files are edited or none.
D.1's table says `rebuild.yml:150` "is the real teeth today"; on a reseal-child branch
that has not yet written its own package, it has none. **That is an argument for the fence
that the spec does not make and should.**

## 9. STOP CONDITIONS: WHICH FIRED

None of F.2's eleven STOP conditions fired. Each one checked rather than assumed:

| STOP | state |
|---|---|
| 1. the token line does not exist | not this round's business: this ticket writes no `released` block and no token line. The `boundary.test.mjs` comment names `DECISIONS:536 (2)` and "the RELEASE-FROM-SEAL token line S9 names" WITHOUT a line number, because inventing one would be a false cite |
| 2. a hunk touches `held()`, the drift assert or the completeness walk | no byte of `b-package.cjs` is touched by this ticket |
| 3. `--ci --package S9` refuses unpredictably | not run: `packages/S9.json` is on the wait list |
| 4. a cell over a released file cannot be re-homed honestly | it can, and C.2's ruling is what makes it honest: only the byte pin goes, the live guard stays. Measured in section 4.1 |
| 5. TODAY-SPLIT / the one-week figure | untouched by this ticket |
| 6. **H18 cannot be written so that it goes red on a deleted entry** | **it can**, measured in section 3.1. This is the STOP that would have shrunk the closed list to one path, and it did not fire |
| 7. **the fence cannot read the artifact out of Git at `CHAIN_REF` on a runner** | **it can**, measured on Windows and on Linux (section 2.4). `fetch-depth: 0` is already set at `rebuild.yml:35` and row (4) is the designed behaviour if it ever is not |
| 8. **the skip cannot be derived from the chain** | **it can**, all five conditions, and the default is FAIL: eleven rows measure it and M16 shows what v2's gate would have cost |
| 9. PACK-PIN | not this ticket |
| 10. `design.test.cjs` | not this ticket; on the wait list |
| 11. anybody claims the copy locks are real | nobody does, and nothing in this report says so |

## 10. WHAT I DID NOT TOUCH

The wait list, untouched: `packages/S9.json`, the needles, the `acceptance-s9` artifact,
the `--ci --package S9` walk, the standing CI step's flip (E fact 10), the PACK-PIN and
APPROVED-PIN literals, any `design.test.cjs` hunk, the S9 brief, the PM's token lines.

Other lanes' files, untouched: `rebuild/lanes/b/tooling/**` (the runner, its tests,
`packages/*.json`), the four other `CHILD_SPECS` cells (`today/test/food.test.mjs`,
`machine-settings-ui.test.mjs`, `problem.test.mjs`, `setup.test.mjs`),
`rebuild/m4/workout/test/**`, `rebuild/lanes/c/ui-port/pack-pin.test.mjs` and
`approved-pin.test.mjs`, and every product file including `build.mjs` and `preview.css`.

`build.mjs` and `preview.css` were each mutated in a working tree for a red-first
measurement and restored; `git status` was clean before every commit and `git diff` over
both files is empty at the pushed head. Nothing under `rebuild/conform/private`,
`src/history.js`, any `ledger/` directory or the protected soak was read, listed or
grepped on either machine. No seal generator was run, no receipt or artifact was written,
`b-package.cjs --full` was never run and `--ci --package S8` is the only runner invocation
in this report.

## 11. WHAT THE REVIEWER SHOULD TRY TO BREAK

Written as an invitation, because the reviewer is told to disagree where the evidence lets
them.

1. **The fence's real row is red and will stay red through CI.** Argue that a cell shipped
   red is worse than no cell. My answer is F.2 STOP-8 and section 2.3, but it is an
   argument, not a measurement.
2. **`FENCE-SEALED-PATH-TOUCHED` and `FENCE-NO-INVENTORY-AT-CHAIN-REF` are names I
   invented** (F4). Rename them if the PM prefers.
3. **The H18 substitution** (F1). If the reviewer thinks asking `assertBundleInputs`
   instead of reading the constant is a weakening rather than a strengthening, that is the
   most load-bearing thing to disagree with in this report.
4. **Row (8g)** (F3). I asserted the refusal the spec as written gives. A reviewer could
   reasonably say the row should have been left red until the PM ruled. I chose to measure
   and report rather than to leave a red nobody could read.
5. **The rename reading** (F5).
6. **The fixture repositories.** They stub `b-package.cjs` down to one `IDS` line and stub
   the artifact down to `product`, `executionPins`, `lanePackage`, `packageId` and
   `released`. If a reviewer can make the real artifact's shape diverge from that stub in
   a way the fence would read differently, that is a real finding.
7. **`idsOf`'s regex.** It takes the first `\bIDS\s*=\s*\[...\]` in the source, and relies
   on `RETIRED_IDS` not carrying a word boundary before `IDS`. Measured correct against the
   real `b-package.cjs:173`. A reviewer who can construct a runner source where it reads
   the wrong list has found something.

---

Author: cowork (Earned lane hand), lane B, ticket S9-PREP-B.
