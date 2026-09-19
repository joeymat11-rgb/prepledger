# S9-PREP-CELLS AUTHOR REPORT - the fence, the build law and the CI homes

Ticket S9-PREP-B. Branch `rebuild/b-s9-prep-cells`, cut from `rebuild/b-s9-ui-pins` at
`da9f8683` (= the chain tip `ad8ced07`, plus the two accepted carried lanes S9-TODAY-CARRY
and PASSPHRASE-NORMALIZE, plus S9-RELEASE-SPEC v4 and its review R4).

Design of record: `rebuild/lanes/b/S9-RELEASE-SPEC.md` (v4), with
`rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md` standing where the two disagree.

**THIS REPORT IS A HYPOTHESIS.** Reviewers are told to disagree where the evidence lets
them. Everything below that says "measured" was run; everything that says "I chose" is an
author's decision the PM can overturn.

**FIX ROUND, AFTER `S9-PREP-CELLS-REVIEW-R1.md` REJECTED `576be648`.** A second author
continued this work rather than discarding it. Sections 0 to 11 below are the FIRST
author's report, amended only where R1 measured something in them to be wrong, and every
such amendment is marked **(R1)**. **Section 12 is the new one: every R1 finding, fixed
or disputed, with the measurement.** The R1 verdict was REJECT on five explicit guard
clauses of `fence()` that survived removal with not one row changing colour, plus one
finding routed to the PM on a false premise. All six are fixed; none is disputed; nothing
was narrowed to make a claim true.

## 0. WHAT LANDED, IN ONE TABLE

| ticket item | file | commit | state at the end |
|---|---|---|---|
| (1) the fence | `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` (NEW) | `eee1206` RED, `5738a96` GREEN, `b4b739c` three more rows, **(R1) `0b2538b` seven more rows, `ee70489` the case control** | **27 rows: 26 green, THE REAL ROW red by name and expected** |
| (2) H18 | `rebuild/m3/w7-preview/today/test/package.test.cjs` | `4f72b08`, **(R1) `6e45e1f` H18b and notes N4, N6** | **13 tests, 13 pass** (was 11 before H18, 12 before H18b) |
| (3) C.2 + E fact 12 | `rebuild/m3/w7-preview/measure/test/boundary.test.mjs` | `0191808`, **(R1) `6bb984c` N11's comment** | 6 tests, 5 pass, 1 fail - the SAME pre-existing red as before the ticket |
| (4) three CI steps | `.github/workflows/rebuild.yml` | `f5517b9` | 33 insertions, 2 hunks, nothing between old :236 and old :303. **(R1) unchanged in the fix round** |
| (5) this report | `rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md` (NEW) | `576be64`, **(R1) this commit** | - |

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
| the fence cell (new step a) | did not exist | tests 20, pass 19, fail 1, exit 1. **(R1) after the fix round: tests 27, pass 26, fail 1, exit 1** |
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
| **(R1)** the same step after the fix round (H18b is the one new test) | **684** | **682** | **2** | **153.7** |

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
| **(1d)** (R1) | a sealed path with a NON-ASCII byte; a path that EXTENDS a sealed one; a sealed key in another CASE | FAILS naming the real byte (only `core.quotepath=false` makes that possible) / PASSES / PASSES: the lookup is byte-exact |
| **(1e)** (R1) | a sealed path RENAMED AWAY; another file RENAMED ONTO a sealed path | FAILS at `D` / FAILS at `A`: the `[RC]` split is read at both ends |
| **(4b)** (R1) | a chain ref whose `rebuild/m4/spec/` holds no acceptance artifact | FAILS `FENCE-NO-INVENTORY-AT-CHAIN-REF`; a `.json.bak` is not parsed |
| **(6c)** (R1) | a branch that DELETES the sealed artifact from its worktree | FAILS `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`; and the failure line counts the touches, not the refusals |
| **(9)** (R1) | a branch merely BEHIND the chain, the chain having moved two sealed paths | PASSES: the diff runs from the MERGE BASE |
| **(10)** (R1) | a git that cannot be spawned vs a chain ref that is genuinely gone | two different refusal names; never a pass either way |
| **(12)** (R1) | a `released` block of the wrong shape (an array) | releases NOTHING: fail closed |
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
   **(R1 N9) AND `.gitattributes` IS IN NEITHER S8 MAP, said out loud rather than left to
   be discovered on a Windows runner.** R1 re-measured it: the file is in neither
   `product` nor `executionPins` of `acceptance-s8-real-shape.json`. So an UNSEALED file
   holds the cross-OS correctness of the fence's byte-exact artifact comparison, and R4
   N10 already had to correct one argument that leaned on that same file. The fence does
   not depend on it for its OWN fixtures (each one writes its own `.gitattributes` and
   forces `core.autocrlf false`); it depends on it only for THE REAL ROW, on a Windows
   checkout. Nothing in this ticket can seal it. **It is a fact for the PM, not a defect
   of this cell.**
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
close it. ~~**This is the one edit outside my owned list that this round wants, and the PM
routes it.**~~

> **(R1) RETRACTED, AND R1 BLOCKING-D IS RIGHT.** The paragraph above is true about the
> EXPORT and wrong about the CONSEQUENCE, which is the half the PM would have ruled on.
> The completeness assertion does NOT need `build.mjs` touched at all: `package.test.cjs`
> already reads repository files, so the cell reads `build.mjs` AS SOURCE TEXT and takes
> the frozen array literal's own path lines. **`H18b` is that cell** (commit `6e45e1f`),
> it landed inside the owned file, and **nothing is routed to the PM.** The
> supporting sentence was also wrong on its own terms: `build.mjs` carries eight
> `export const` declarations (`:35 SOURCE`, `:36 ROOT`, `:37 DIST`, `:38 SCRATCH`,
> `:41 SOURCE_REL`, `:43 ASSETS`, `:72 IMPORT_ENTRY`, `:324 buildTagOf`), so ":44 is the
> file's only export" is false; `:44` is a re-export line. The FIRST half of 3.2 stands
> and R1 agrees with it: asking `assertBundleInputs` for the refusal is stronger than
> reading a list for the DELETION case. The two are complementary and section 12.4
> measures exactly what each one holds that the other does not.

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

> **(R1) THE METHOD SENTENCE BELOW CLAIMED A COMPLETENESS THIS TABLE DID NOT HAVE, AND
> THAT IS WHY R1 REJECTED.** "takes each guard clause of `fence()`" and "ALL SEVENTEEN
> ARE KILLED" are two different statements, and only the second was true: the seventeen
> were killed, but five explicit clauses were not among them and each survived removal
> with not one row changing colour. **The sentence is narrowed to "the seventeen
> mutations below" here, and section 12.5 carries the fix-round table, which is 26
> mutations over the whole clause set with none surviving.** In a report whose value is
> that it says what it measured, that is the correction that matters most.

Method: a harness takes **the seventeen guard clauses of `fence()` listed below** and the
H18 cell's own asserts one at a time,
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

**ALL SEVENTEEN ARE KILLED** - all seventeen OF THE SEVENTEEN LISTED, which is not the
same as the clause set, and section 12.5 is where the clause set is swept. **Three were
not killed on the first pass, and the honest answer to a surviving mutant is another row
rather than a weaker claim** (commit `b4b739c`):

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

**F1. ~~B.8 and E fact 16 ask H18 to assert "against `build.REQUIRED_INPUTS`", and that
constant is not exported.~~ RETRACTED IN ITS LOAD-BEARING HALF (R1 BLOCKING-D).** The
constant is indeed module-local at `build.mjs:98`, and that half stands. Everything F1
then concluded does not. `:44` is a re-export line and not the file's only export
(`build.mjs` carries eight `export const` declarations), and **the completeness half
closes INSIDE the owned file with no `build.mjs` edit at all**: `H18b` reads `build.mjs`
as source text and holds the `today/` half against this seal's 26. **NOTHING IS ROUTED TO
THE PM.** That matters more than the finding itself, because A.6 makes `build.mjs`'s place
on the closed list CONDITIONAL on H18 supplying the teeth, and a finding that overstates
what H18 cannot do, in the report the PM reads to rule on that condition, is the wrong
finding to get wrong. Section 12.4 has the measurement.

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

---

# 12. R1 FINDINGS: FIXED OR DISPUTED

Review of record: `rebuild/lanes/b/S9-PREP-CELLS-REVIEW-R1.md`, verdict REJECT on
`576be648`. **Four BLOCKING findings and twelve notes. All four BLOCKING findings are
FIXED. Nothing is disputed.** Two notes (N5, N12) are answered rather than coded, one
(N3) is a fact about the file H18 joined and is now stated, and the rest landed as
behaviour with a row or as a corrected sentence.

R1 is a good review and it is right about the thing that matters most: this is a cell
that guards the sealed set, and **a guard clause whose removal turns nothing red is a
clause nobody can rely on.** Every fix below is a ROW or a MEASUREMENT, never a narrowed
claim.

The fix-round commits, in order:

| commit | what |
|---|---|
| `0b2538b` | the fence: rows (9), (4b), (1d), (1e), (6c), (10), (12); N7's count; N10's chain commit; N2's refusal mapping |
| `6e45e1f` | `package.test.cjs`: H18b (BLOCKING-D), N4's header, N6's message |
| `6bb984c` | `boundary.test.mjs`: N11's R4 N7 consequence, comment only |
| `ee70489` | the fence: N8's case half, after the first fix-round sweep left it as the one surviving mutant |

## 12.1 BLOCKING-A - the `merge-base` clause: FIXED, row (9)

R1 measured `RX2` (a two-dot diff from the chain ref in place of the merge base) SURVIVING
with no row changing colour, and built the missing world by hand: a branch merely BEHIND
the chain would be refused for sealed paths the CHAIN moved and it never touched.

**Row (9)** builds that world as a fixture: the branch is cut at A, touches ONE file
nothing ever sealed, and the chain then moves TWO sealed paths on a line of its own. The
row asserts three things and the middle one is what makes it honest - it proves the
fixture really is the world the clause guards, rather than asserting a pass that would
hold anyway:

```
the two-dot diff DOES name today-app.cjs and preview.css   (assert: the world is built)
the merge-base diff names only screens.template.html       (assert: the branch's own change)
fence() -> pass, refusals [], touched 1
```

Measured under the mutation, on Linux at `ee70489`:

```
KILLED | RX2 two-dot diff from the chain ref instead of the merge base | newly red: D.2 (9)
```

**And R1's live measurement reproduced, on the PC today at a chain ref that has since
moved again.** R1 saw the chain 8 commits ahead of this branch's merge base at `1d70b62`;
the fence now reports the chain ref at `bd3ca3286795`. That movement is itself N10's
point and it is why row (9) is not a hypothetical.

## 12.2 BLOCKING-B - `FENCE-NO-INVENTORY-AT-CHAIN-REF` had no row: FIXED, row (4b)

R1 is right that a refusal whose whole argument is "never pass vacuously" must have the
row that says so, and right that removing the guard was a VACUOUS PASS nothing noticed.

**Row (4b)**: a chain ref that is THERE, whose `rebuild/m4/spec/` holds a
`review-fixture.json` and an `acceptance-s8-old.json.bak` and no acceptance artifact.
The row asserts the status, the exact refusal, AND `artifactPath === null` (it did not
choose an artifact anyway). The `.bak` also holds the file-name rule R1 checked in attack
A16: it is ignored, not parsed.

```
KILLED | RX5 FENCE-NO-INVENTORY-AT-CHAIN-REF guard removed (return pass) | newly red: D.2 (4b)
```

## 12.3 BLOCKING-C - three more surviving clauses: FIXED, rows (1d), (1e), (6c)

**RX4, `core.quotepath=false` (`:73`).** R1 measured that git octal-escapes and QUOTES a
non-ASCII path by default, so a quoted string never matches an inventory key and a sealed
path carrying one non-ASCII byte walks through. **Row (1d)** seals a path with U+00E9 in
it and asserts the refusal names the real byte.

Two cross-OS decisions inside that row, both made on measurement and both reported:

1. **The source file stays pure ASCII.** `NONASCII` is built with `String.fromCharCode
   (0xe9)` and not written as a literal byte or as a `\u` escape, so no editor, checkout
   or transport can normalise the character away before the row runs. The FILE the row
   creates carries the real UTF-8 bytes; only this cell's source is ASCII.
2. **The row runs green on Windows.** Measured on the PC: `D.2 (1d) ... 1833ms`, green,
   and green in a farm scratch worktree on Linux. Node writes the name through the Win32
   wide API, git reports it back in UTF-8 with `core.quotepath=false`, and the two match.

**RX1, the `[RC]` split (`:128`).** The old path at status `D` had a row; the NEW path at
status `A`, which is the only thing `parts[2]` can ever be read for, had none. **Row (1e)**
now holds both ends. The second half needed one design decision worth recording: to get a
sealed path at status `A` the sealed path must NOT exist in the tree at the base, so the
fixture seals a path that is a key of the inventory and not a file - which is legitimate,
because an inventory key is a path the seal names, not a file the fixture must carry.

```
away:  git mv today-app.cjs today-app.cjs2  -> R100 record -> fail [FENCE-SEALED-PATH-TOUCHED D today-app.cjs]
onto:  git mv screens.template.html today-app.cjs -> R100 -> fail [FENCE-SEALED-PATH-TOUCHED A today-app.cjs]
KILLED | RX1 the rename/copy split's NEW path never read | newly red: D.2 (1e)
```

**RX7, the `worktree === null` limb (`:183`).** R1 is right that this is the only thing
that notices a branch DELETING the sealed artifact, and right that the deletion is
invisible to `FENCE-SEALED-PATH-TOUCHED` because the artifact is not a key of its own
`product` map. **Row (6c)** deletes it and asserts the named refusal.

```
KILLED | RX7 the worktree === null limb of the tamper check removed | newly red: D.2 (6c)
```

**The completeness claim of section 6 is narrowed in place** (see the block quote at the
head of section 6) and section 12.5 is the sweep over the whole clause set.

## 12.4 BLOCKING-D - F1 routed an edit on a false premise: FIXED, and F1 RETRACTED

R1 measured the two things F1 got wrong and both reproduce here.

1. **"there is no other constant export in the file" is false.** `build.mjs` carries eight
   `export const` declarations: `:35 SOURCE`, `:36 ROOT`, `:37 DIST`, `:38 SCRATCH`,
   `:41 SOURCE_REL`, `:43 ASSETS`, `:72 IMPORT_ENTRY`, `:324 buildTagOf`. `:44` is a
   re-export line.
2. **The completeness half closes inside the owned file.** `H18b` (commit `6e45e1f`)
   reads `build.mjs` AS SOURCE TEXT, takes the frozen array literal's own path lines and
   holds them against this seal's 26. **No `build.mjs` edit. Nothing routed to the PM.**

How it reads the list, stated because the reading is the cell's only assumption: it takes
the block between `const REQUIRED_INPUTS = Object.freeze([` and `]);`, and inside it takes
only lines that are a quoted string alone on the line with an optional trailing comma.
That is the file's own shape, and it is why the count is **48 and not the 51 quoted
strings the block contains** - the three prose strings either span lines or carry no
trailing comma. If `build.mjs` ever stops having that shape the cell says so by name
rather than miscounting silently: `Hb-M4` below is the mutation that widens the rule to
every quoted string, and it goes red.

**RED FIRST, THE HOLE FIRST, in B.8's own order, measured on the PC.** `build.mjs` was
mutated in the working tree and restored with `git checkout --`; `git diff` over it is
empty at the pushed head.

```
A  a 27th today/ entry ADDED to REQUIRED_INPUTS (today-entry.mjs, a real bundle input,
   so the build still succeeds), cells intact:
     tests 13, pass 12, fail 1   <- H18b is THE ONLY RED, and it NAMES the added path:
     "the today/ half of build.mjs's REQUIRED_INPUTS is no longer the 26 paths this seal
      pins: it now holds 27. An ADDED entry is invisible to H18 and this is the cell that
      sees it"   + 'rebuild/m3/w7-preview/today/today-entry.mjs'
     H18 STAYS GREEN: that is the hole, in one line.
B  one entry (reading-host.mjs) DELETED instead:
     tests 13, pass 11, fail 2   <- H18 and H18b both red, each naming the path
C  build.mjs restored, git diff clean over it:
     tests 13, pass 13, fail 0
```

**AND WHAT EACH HALF HOLDS THAT THE OTHER DOES NOT**, because "complementary" is a claim
and these are the two mutations that measure it:

```
H-M2b  the LAW broken in build.mjs (the missing-input assert made a no-op), BOTH lists intact
         -> red: H18 only.   H18b is green: the list is still right, the build stopped
            enforcing it. This is the clean proof the assert.throws loop IS the guard,
            and it replaces H-M2, which H18b now also catches.
Hb-M5b a today/ entry RENAMED inside REQUIRED_INPUTS (the COUNT stays 48), with H18b's
       deepEqual disabled so only the counts are left
         -> red: H18 only.   H18b is green: no count moved. The deepEqual is the ONLY
            assert that sees a set change at constant count.
```

Section 12.6 has the whole H18 / H18b table. The `assert.deepEqual` is ordered FIRST
inside H18b for R1 N6's reason: its failure NAMES the paths and the count assertions name
only a number.

## 12.5 THE MUTATION TABLE OF THE FIX ROUND: the whole clause set, 26 of 26 killed

Method, and it is stricter than section 6's: a harness replaces ONE clause of the SHIPPED
cell, runs the whole file, and diffs the per-row pass/fail map against the unmutated
baseline. "SURVIVED" means not one green row changed colour. Baseline on Linux in a farm
scratch worktree at `ee70489`: **27 rows, 26 green, THE REAL ROW red** - the same shape
the PC reports, which is itself the both-OS control for the fixture rows.

The harness is `/home/claude/farm/scratch/b/s9b-mutate.mjs`, outside the repository and
pushed nowhere.

| # | mutation | verdict | newly red |
|---|---|---|---|
| M1 | the `FENCE-CHAIN-REF-ABSENT` guard removed | KILLED | (4), (10) |
| M2 | LEXICAL maximum instead of numeric | KILLED | (7), (7b) |
| M3 | the `FENCE-AMBIGUOUS-INVENTORY` refusal removed | KILLED | (7b) |
| M4 | the inventory read from the WORKTREE instead of the chain ref | KILLED | (6), (6b) |
| M5 | the `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` refusal removed | KILLED | (6), (6b), **(6c)** |
| M6 | the `released` block ignored | KILLED | (2), (7), **(12)** |
| M7 | `product` only, `executionPins` dropped | KILLED | (1b) |
| M8 | a deletion does not count as touching | KILLED | (1c), **(1e)** |
| M9 | condition (1) "exactly one added spec" removed | KILLED | (8a) |
| M10 | condition (2) artifact-path equality removed | KILLED | (8b) |
| M11 | condition (2) sha256 equality removed | KILLED | (8c) |
| M12 | condition (3) removed | KILLED | (8h) |
| M13 | condition (4) first limb removed | KILLED | (8d) |
| M14 | condition (4) second limb removed | KILLED | (8d) |
| M15 | condition (5) ancestor test removed | KILLED | (8f) |
| M16 | v2's gate: skip on the mere presence of an added `packages/*.json` | KILLED | (8e), (8a), (8b), (8c), (8d), (8f), (8g), (8h) |
| M17 | `--name-only`: the status letter lost | KILLED | (1c), **(1e)**, (8e), (8a), (8b), (8c), (8d), (8f), (8g), (8h), (8i) |
| **RX2** | **BLOCKING-A**: two-dot diff from the chain ref instead of the merge base | **KILLED** | **(9)** |
| **RX5** | **BLOCKING-B**: `FENCE-NO-INVENTORY-AT-CHAIN-REF` removed (return pass) | **KILLED** | **(4b)** |
| **RX4** | **BLOCKING-C**: `core.quotepath=false` dropped | **KILLED** | **(1d)** |
| **RX1** | **BLOCKING-C**: the rename/copy split's NEW path never read | **KILLED** | **(1e)** |
| **RX7** | **BLOCKING-C**: the `worktree === null` limb removed | **KILLED** | **(6c)** |
| **RXN2** | N2: the ENOENT limb of `chainRefRefusal` removed | **KILLED** | **(10)** |
| **RXN7** | N7: `refusalLine` counts every refusal as a sealed-path touch | **KILLED** | **(6c)** |
| **RXN10** | N10: the chain ref's commit dropped out of the output | **KILLED** | **(6c)** |
| **RXN8** | N8: the sealed lookup case-folded | **KILLED** | **(1d)** |

**26 MUTATIONS, 26 KILLED, NONE SURVIVING.** Two honest notes on that sentence:

* **RXN8 survived the FIRST fix-round sweep** and is the reason commit `ee70489` exists.
  N8 predicted it could not be rowed on both operating systems, because a case-only
  RENAME cannot be built on a case-insensitive filesystem. That reasoning was right about
  the rename and wrong about the row: an inventory key does not have to exist in the tree,
  so the fixture seals `today/TODAY-APP.cjs`, which the tree never carries, and the branch
  touches `today/today-app.cjs`. The two are never both on disk, the row runs identically
  on both systems, and under any case folding the branch would be refused for a path
  nothing sealed. **The surviving mutant is reported here with the sweep that caught it,
  not hidden behind the sweep that killed it.**
* **M4 no longer turns (8g) red**, where section 6's table says it did. That is a
  difference in the MUTANT, not in the cell: this harness's M4 falls back to the chain ref
  when the worktree has no artifact, so (8g)'s refusal is still condition (2). Recorded
  rather than reconciled by picking the friendlier number.

## 12.6 H18 AND H18b, MEASURED ON THE PC

Baseline `package.test.cjs`: 13 tests, 13 pass. `build.mjs` mutated in the working tree
and restored by the harness; `git diff --name-only` after the sweep names only
`package.test.cjs`, which is my own committed edit.

| # | mutation | red |
|---|---|---|
| H-M0 | nothing mutated | NONE |
| H-M1 | `reading-host.mjs` DELETED from `REQUIRED_INPUTS`, cells intact | **H18, H18b** |
| H-M1b | `today-entry.mjs` ADDED to `REQUIRED_INPUTS`, cells intact | **H18b** - the hole, and the cell that closes it |
| H-M2 | the `assert.throws` loop REMOVED plus the deletion | **H18b** - H18b now catches what used to be a silent pass |
| H-M2b | the LAW broken in `build.mjs`, both lists intact | **H18** - the loop IS the guard, and H18b cannot see it |
| H-M3 | one entry removed from the cell's literal list | **H18, H18b** |
| H-M4 | one entry of the literal replaced by a duplicate | **H18, H18b** |
| H-M6 | the `result.inputs.includes` assert REMOVED | NONE - **SURVIVES**, see below |
| Hb-M1 | H18b's `today/` deepEqual removed, plus the ADDED entry | **H18b** (the 48 count catches it) |
| Hb-M2 | H18b's 48 count removed, plus the ADDED entry | **H18b** (the deepEqual catches it) |
| Hb-M3 | the block regex reads `ASSETS` instead of `REQUIRED_INPUTS` | **H18b** |
| Hb-M4 | the per-line path rule widened to EVERY quoted string | **H18b** - the 51/48 distinction is load-bearing |
| Hb-M5 | a `today/` entry RENAMED inside `REQUIRED_INPUTS`, count still 48 | **H18, H18b** |
| Hb-M5b | the same rename with H18b's deepEqual disabled | **H18** - the deepEqual is the only assert that sees a set change at constant count |

**H-M6 still survives and is still reported rather than fixed**, for the first author's
reason, which R1 agreed with: every one of the 26 is in the bundle today, so removing the
assert changes nothing until a build stops emitting one of them, and the only way to kill
it would be to fake a bundle - and a cell that asserts over a faked bundle asserts nothing
about the real one. H-M5 (the list names a path the bundle does not carry) shows the
assert has teeth on the day it matters.

**Hb-M1 and Hb-M2 are each killed by the sibling assert on the ADD case**, which means
neither is uniquely necessary there. They are not redundant in general: `Hb-M5b` is the
case where only the deepEqual fires, and `Hb-M4` is the case where the count rule is what
holds. Said plainly rather than left to read as three independent guards.

## 12.7 THE TWELVE NOTES

| note | state | what was done, and where |
|---|---|---|
| **N1** an array-valued `released` is silently lost and fails CLOSED | **FIXED, with a row** | **Row (12)**: an array-valued `released` releases nothing (its `Object.keys` are indices), and the same inventory in E fact 15's shape DOES release, so the row measures the shape and not some other difference. A comment at the `released` line says why the direction is right. `M6` also turns (12) red |
| **N2** `git` missing from PATH reads as `FENCE-CHAIN-REF-ABSENT` | **FIXED, with a row** | `chainRefRefusal(e, chainRef)` maps ENOENT to `FENCE-GIT-UNAVAILABLE` and everything else to `FENCE-CHAIN-REF-ABSENT`. **Row (10)** feeds it a REAL ENOENT (from `execFileSync` on a binary that does not exist) and a REAL non-zero exit (from a deleted ref), and asserts the fence still never passes. The name says "could not be spawned" rather than "is not installed", because an unusable cwd raises the same ENOENT and the cell does not pretend to tell those apart |
| **N3** if `buildToday()` throws, H18 says nothing | **STATED, not coded** | True, and it is a property of the file H18 joined: `package.test.cjs` builds once in `before()`, so an entry naming a file that does not exist errors all 13 tests with no refusal naming a path. It is loud, not silent. **H18's guarantee is conditional on the build succeeding, and that sentence is now in this report** where the first report did not have it. Changing `before()` would touch four other lanes' rows in the same file |
| **N4** the file header carries a false sentence inside a file S9 SEALS | **FIXED** | `package.test.cjs:8-:9` said "it is run on the PC and reported there"; `rebuild.yml:232` names it by exact path. Corrected in the same hunk, so the seal does not carry the lie |
| **N5** the honest limit of H18 is not stated | **STATED** | After S9, `build.mjs` is RELEASED and `package.test.cjs` is SEALED, so editing both in one lane C commit is refused twice (this fence, and `UNLISTED-PRODUCT-DRIFT`). **But on the next reseal child both edits are legitimate and nothing notices the law shrank**; the only guard is a PM reading a diff. A.4 says the first half; nobody says the second. R1 is right that it belongs beside F1 and it is now here |
| **N6** a stale entry reads as the wrong failure | **FIXED** | H18's message named one reading ("left `REQUIRED_INPUTS`"). It now names both (left the constant, or renamed there and this seal's literal is stale) and points at H18b, which says which. `Hb-M5` is the measurement of the case that used to point the wrong way |
| **N7** the real row's message miscounts | **FIXED, with a row** | `refusalLine()` counts the `FENCE-SEALED-PATH-TOUCHED` entries and reports both numbers. **Row (6c)** is the mixed result that measures it: two refusals, one of them a touch. `RXN7` goes red on (6c) |
| **N8** byte-exactness has no row | **FIXED, with two sub-rows** | Row (1d) holds the EXTENSION half (`today-app.cjsx` is not `today-app.cjs`) and the CASE half, both on both operating systems. The comment at the lookup says in terms: do not "fix" a Windows case complaint by lowercasing either side. `RXN8` goes red on (1d) |
| **N9** the cross-OS correctness rests on an UNSEALED file | **SAID OUT LOUD** | Section 2.4 now records that `.gitattributes` is in NEITHER S8 map, that only THE REAL ROW depends on it (every fixture writes its own and forces `core.autocrlf false`), and that nothing in this ticket can seal it. A fact for the PM |
| **N10** the chain ref is remote-tracking and only a fetch moves it | **FIXED, with a row** | Every outcome now carries `chainCommit`, and the skip reason and the failure line print it. **Measured live: R1 saw `1d70b62`, this round's real row printed `bd3ca3286795`** - the ref moved between the review and the fix, which is exactly the confusion the line removes. `RXN10` goes red on (6c) |
| **N11** the `'S9'` comment does not carry R4 N7's consequence | **FIXED** | `boundary.test.mjs`'s own comment now says it: with `'S9'` youngest and S9 declaring `today-app.cjs` with a real post, `declaredPost` lands on S9's post and not S8's `dc9a826e`, and F.1 R18's "two packages downstream" is one package late. Comment only; no assertion moves |
| **N12** C.2 asked for one comment line and the hunk is thirteen | **RECORDED FOR THE PM, UNCHANGED** | R1 read the thirteen, calls them all true and all load-bearing, and would keep them; the first author would keep them; the file's house style is eleven-line package comments. **Neither author nor reviewer should decide this and neither has: the PM rules and nothing asserts on it** |

## 12.8 THE WHOLE BAR, RE-RUN ON THE PC AFTER THE FIX ROUND

`%TEMP%\earned-s9b` at `ee70489`, node v24.19.0 at the runtime path,
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, long runs through a `.cmd` with a
log and a `.done` file.

| what | before my first fix-round edit | after my last | R1's measurement of `576be648` |
|---|---|---|---|
| `b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | **identical, byte for byte**, exit 1 | the same, byte for byte |
| the fence cell (step a) | tests 20, pass 19, fail 1 | **tests 27, pass 26, fail 1**, exit 1 | 20 / 19 / 1 |
| the whole today step (`rebuild.yml:232`, 17 cells) | tests 683, pass 681, fail 2 | **tests 684, pass 682, fail 2, 153.7 s**, exit 1 | 683 / 681 / 2, 152.7 s |
| the two failures | `boundary.test.mjs P-MEASURE (g)` and `setup.test.mjs re-pin` | **the same two, pre-existing, and `P-MEASURE (g)`'s list is UNCHANGED by the fix round** | the same two |
| step b, the three passphrase cells | tests 20, pass 20, fail 0 | tests 20, pass 20, fail 0, exit 0 | 20 / 20 / 0 |
| step c, `rebuild/m3/w6/test/local-import.test.mjs` | tests 22, pass 22, fail 0 | tests 22, pass 22, fail 0, exit 0 | 22 / 22 / 0 |
| the lane C step (`:321` on this branch, base `:306`) | tests 9, pass 9, fail 0 | tests 9, pass 9, fail 0, exit 0 | 9 / 9 / 0 |

The today step grew by exactly ONE test, H18b, and by nothing else. **No re-run was needed
anywhere in this round: nothing was green once and red once, on either machine.**

**THE MEASURED REFUSAL OF THE REAL ROW ON THIS BRANCH, after the fix round:**

```
THE REAL ROW - this branch touched no sealed path the chain has not released
AssertionError: this change drew 9 refusal(s), 9 of them sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core (bd3ca3286795aa0a6eaef53c4fff16cb6e1f5f9e)
  does not release
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

**The nine paths are the same nine R1 measured, path for path.** Two things changed and
both are fixes, not softenings: the count sentence is now honest about what it counts
(N7), and the line names the chain ref's COMMIT (N10) - which is how anyone reading it can
see that the chain has moved from R1's `1d70b62` to `bd3ca328`. The refusal is still
`FENCE-SEALED-PATH-TOUCHED` and not `FENCE-RESEAL-CHILD-UNVERIFIED`, because this branch
still carries no `packages/S9.json` and makes no reseal-child claim. **No skip, no
environment switch and no branch-name test was added anywhere in the fix round.**

## 12.9 WHAT THE FIX ROUND DID NOT TOUCH

`.github/workflows/rebuild.yml` is byte-identical to `576be648`: the fix round adds no
step, moves no step and flips nothing. R1 verified the placement by line number and that
verification still holds - two hunks against `da9f8683`, nothing between base `:233` and
base `:305`, so the other lane's step after base `:297` still merges clean.

The wait list is untouched, the four other `CHILD_SPECS` cells are untouched,
`rebuild/lanes/b/tooling/**` is untouched, and every product file including `build.mjs`
and `preview.css` is byte-identical at the pushed head. `build.mjs` was mutated in the
working tree for section 12.4's red-first and for section 12.6's sweep and restored with
`git checkout --` each time; `git status` was clean before every commit.

Nothing under `rebuild/conform/private`, `src/history.js`, any `ledger/` directory,
`C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` or the protected soak was read, listed
or grepped on either machine. No junction to `rebuild\conform\private` was created. No
seal generator was run, no receipt or artifact was written, `b-package.cjs --full` was
never run, and `--ci --package S8` is the only runner invocation in this round.

## 12.10 WHAT THE FIX ROUND'S AUTHOR DID NOT VERIFY

* **GitHub CI on ubuntu-latest and windows-latest.** That run is the both-OS evidence of
  record and it had not reported when this was written. **R1's STOP-7 half-answer is still
  the one thing to look for**: whether `actions/checkout@v4` with `fetch-depth: 0`
  materialises `refs/remotes/origin/rebuild/t2-client-core` for a branch that is not the
  checked-out one. If it does not, the fence's step is red on every push for a SECOND
  reason, and row (4) is what it will say.
* Anything needing `packages/S9.json`, the `acceptance-s9` artifact, the needles, the
  `--ci --package S9` walk or the standing step's flip. All on the wait list.
* The three passphrase cells and `local-import.test.mjs` as CELLS: run and counted, not
  reviewed. Other lanes' accepted work.
* Whether the S9 sealer will emit `released` as an object. E fact 15 says it will; row
  (12) states the direction the fence fails in if it does not.

---

Author (fix round): cowork (Earned lane hand), lane B, ticket S9-PREP-B, after
`S9-PREP-CELLS-REVIEW-R1.md`. Four BLOCKING findings fixed, twelve notes answered, nothing
disputed, 26 mutations over the whole clause set with none surviving.
