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

**ROUND 4, A MICRO FIX ROUND, AFTER `S9-PREP-CELLS-REVIEW-R3.md` REJECTED `32c80967` ON
TWO BLOCKING FINDINGS THE PM UPHELD.** A fourth author. **Section 14 is the new one**, and
it is the one to read for the state of the fence at the head this report describes: round
4 moved ONE file, `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`, and left
`rebuild.yml`, `package.test.cjs` and `boundary.test.mjs` byte-identical. Every count in
sections 0 to 13 that round 4 moved is corrected in place and marked **(R4)**; everything
else in them is the record of the round that measured it and is left alone.

## 0. WHAT LANDED, IN ONE TABLE

| ticket item | file | commit | state at the end |
|---|---|---|---|
| (1) the fence | `rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` (NEW) | `eee1206` RED, `5738a96` GREEN, `b4b739c` three more rows, **(R1) `0b2538b` seven more rows, `ee70489` the case control**, **(R4) `8033a0b` row (20), `74e2ec5` RED rows (21)(22)(23), `21f494e` the one-clause fix, `6b3e6fb` M29 and M43** | **(R4) 38 rows: 37 green, THE REAL ROW red by name and expected** (was 27 after R1, 34 after R3) |
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
| the fence cell (new step a) | did not exist | tests 20, pass 19, fail 1, exit 1. **(R1) after the fix round: tests 27, pass 26, fail 1, exit 1**; **(R4) at the head this report describes: tests 38, pass 37, fail 1, exit 1, on BOTH operating systems (section 14.6)** |
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
| **(20)** (R4) | a spec with the key closure intact whose `parent.chosen` resolves to NO option, over four worlds | all four FAIL `(2)`, and the refusal NAMES the chosen id: R3 BLOCKING-1 |
| **(21)** (R4) | a verified reseal child widening the chain's NEWLY sealed artifact in its worktree | FAILS `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` and its own sealed touch: R3 BLOCKING-2 |
| **(22)** (R4) | the same, where the chain RE-sealed the artifact path after the branch was cut | FAILS the same two ways |
| **(23)** (R4) | an ORDINARY branch FORGING the chain's newest artifact with `released` = every path; and the same branch touching another file in `rebuild/m4/spec/` | FAILS by name / PASSES: the limb names the ARTIFACT PATH and F9 stays closed |
| REAL | this repository, this branch | FAILS by name; section 2.3, re-measured at 14.7 |

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
| the fence cell | **(R4) 38 rows, 37 green, 1 red** at `6b3e6fb`, on BOTH systems (was 34/33/1 at `45bd62c`) | - | re-measured at the final head (R2 N9, again at 14.6) |
| `package.test.cjs` | **11 tests before H18, 14 after** (H18, H18b, H18c) | - | re-measured at the final head (R2 N9) |
| sealed paths this branch touches | **9** | the ticket named 3 of them | the other 6 are E facts 20 and 21 |
| `rebuild.yml` insertions | **56, in 2 hunks** (`@@ -230,6 +230,33 @@` and `@@ -304,5 +331,23 @@`), against `da9f8683` | - | re-measured after P-FENCE-1 |
| steps in `rebuild.yml` carrying an `if:` | **1**, the fence's, and it reads back as the string `${{ !cancelled() }}` | - | parsed with `yaml`, 30 steps total |
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
| 7. **the fence cannot read the artifact out of Git at `CHAIN_REF` on a runner** | **DID NOT FIRE, AND IT IS ANSWERED BY EVIDENCE OFF A RUNNER, WHICH IS THE PM's AND NOT MINE** (R2 N1 was right that the earlier wording claimed a measurement nobody had made: the PC and the farm are both full clones that already carry the remote-tracking ref, which is the very condition STOP-7 asks about). The PM's evidence: **GitHub run `35440101975`**, on the branch `rebuild/c-p4b-memory-1`, which is NOT the chain branch, passed the standing step at `:150` on ubuntu AND windows; that step reads `refs/remotes/origin/rebuild/t2-client-core`. So `actions/checkout` with `fetch-depth: 0` (`rebuild.yml:35`) DOES materialise the chain ref for a branch that is not the checked-out one. Row (4) remains the designed behaviour on the day it ever does not, and it is a named FAIL, never a vacuous pass |
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
| Hb-M5 | a `today/` entry RENAMED inside `REQUIRED_INPUTS`, count still 48 | **THE WHOLE FILE ERRORS IN `before()`, NAMING NO PATH** - corrected on R2 N8, which re-ran it and measured 13 tests, 0 pass, 13 fail. `buildToday()` throws on the renamed input before any row runs, so what a reader actually sees is not "H18 and H18b red" but a file that never started. The conclusion is unchanged (the cell has teeth on that mutation) and the failure is loud; but it is R1 N3 happening live inside this table, and R1 N3's reason for not coding it stands: `before()` is shared with four other lanes' rows in a sealed file |
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
see that the chain has moved from R1's `1d70b62` to `bd3ca328`.

**AND N10 DEMONSTRATED ITSELF WHILE THIS WAS BEING MEASURED, which is better evidence
than the note.** The SAME commit `4f69837`, run on the two machines within minutes of
each other:

```
the PC   (Windows): ... at refs/remotes/origin/rebuild/t2-client-core (bd3ca3286795...)
the farm (Linux):   ... at refs/remotes/origin/rebuild/t2-client-core (70113da58afb...)
both: tests 27, pass 26, fail 1, and THE SAME NINE PATHS
```

Two machines, one branch, two different fetches of a remote-tracking ref, the same answer.
Before N10 the two logs were indistinguishable and a reader who compared them had no way
to know which chain each had judged against. **The cross-OS claim of section 2.4 also
reproduces at the fix-round head: 27 rows, 26 green, the real row red, on both.**

The refusal is still
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

---

# 13. R2 NOTES AND THE PM'S FINAL READ: FIXED OR DISPUTED

Round 3, short, by a third author. The earlier authors are gone; nothing of theirs was
discarded. Branch `rebuild/b-s9-prep-cells`, base for this round `25a15956`, final head
`45bd62c`. Every behaviour below was RED FIRST, as a committed row or as recorded failing
output, before the engine moved. Machines: the owner's PC (`%TEMP%\earned-s9b`, Windows,
node v24.19.0) and a farm scratch worktree on Linux at the pushed head.
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York` throughout.

## 13.1 THE COMMITS, AND WHICH ARE THE RED ONES

| commit | what | state of the bar |
|---|---|---|
| `d6ed388` | **RED** - six rows (13)(14)(15)(16)(17)(18) against the SHIPPED `fence()` | 33 rows, 26 green, **7 red** |
| `c550fa6` | the engine: R2 N2, N3, N4 ruled in. **Leaves (8g) red on purpose** | 33 rows, 30 green, **3 red** |
| `a7158b9` | F9: the tamper check is asked only of a branch that carried the artifact | 34 rows, 32 green, 2 red |
| `bb6e446` | `rebuild.yml`: P-FENCE-1's condition | 34 rows, 33 green, 1 red |
| `510388e` | **RED** - `package.test.cjs` H18c, the planted prose line | 14 tests, 13 pass, **1 red** |
| `8c68760` | the `rebuild/` prefix rule | 14 tests, **14 pass, 0 fail** |
| `45bd62c` | row (14) closes the one mutant that survived my sweep | 34 rows, 33 green, 1 red |

The one red at the end is THE REAL ROW, which is designed red on this branch.

## 13.2 THE RED-FIRST EVIDENCE, MEASURED TEXT AND NOT PROSE

All six at `d6ed388`, against the fence exactly as R2 accepted it:

```
(13) R2 N2  Error: Command failed: git -c core.quotepath=false merge-base
              refs/remotes/origin/rebuild/t2-client-core HEAD
(14) R2 N2  Error: Command failed: git -c core.quotepath=false show
              HEAD:rebuild/lanes/b/tooling/b-package.cjs
(15) R2 N2  SyntaxError: Unexpected token 'o', "not json at all
(16) R2 N3  AssertionError: it SKIPPED: "FENCE-RESEAL-CHILD S10
              rebuild/lanes/b/tooling/packages/S10.json stood aside on
              rebuild/m4/spec/acceptance-s8-fixture.json 8fe8eb6b36d4 ..."
(17) R2 N4  AssertionError: a child widened its parent's inventory in its worktree and
              still stood aside: "FENCE-RESEAL-CHILD S9 ... stood aside on ..."
(18) P-F1   AssertionError: the fence's own step carries no `if:` at all, so GitHub skips
              it after the standing step at :150 fails - which is every branch this fence
              exists for (P-FENCE-1): - name: C - the sealed-inventory fence over this
              branch's own diff / run: node --test rebuild/lanes/c/ui-port/...
```

**(16) and (17) are the two that mattered**: they did not throw, they **SKIPPED**. The
shipped fence stood aside for a branch that had earned nothing - one that renamed an
ancestor spec rather than writing one, and one that rewrote its parent's sealed artifact.
R2 measured both and called neither a bypass, and R2 was right that neither lets a sealed
touch through; but "stood aside" is the one sentence this cell must never print wrongly.

At `510388e`, `package.test.cjs`:

```
H18c - a prose string alone on its own line inside REQUIRED_INPUTS is not a path
AssertionError: a prose string alone on its own line is counted as a required input:
  H18b would go red naming a NUMBER (49 instead of 48) and not a path
```

## 13.3 EVERY R2 NOTE AND THE PM'S FINDING: WHAT I DID

| note | ruling | what landed |
|---|---|---|
| **N1** STOP-7 claimed a measurement nobody made | answered by the PM's own evidence | Section 9's STOP-7 row rewritten. GitHub run **`35440101975`**, branch `rebuild/c-p4b-memory-1`, not the chain branch, passed `:150` on ubuntu AND windows, and `:150` reads the chain ref. `fetch-depth: 0` does materialise it. R2 N1's correction of the old wording is accepted in full |
| **N2** three worlds throw a stack instead of naming a refusal | ADOPTED | Three named refusals, a row each: `FENCE-NO-MERGE-BASE` (13), `FENCE-RESEAL-CHILD-UNVERIFIED (4)` naming the deleted runner (14), `FENCE-INVENTORY-NOT-JSON` (15). **(15) is more than a message**: the ARRAY half used to PASS VACUOUSLY, because an array parses and `inv.product` is then `undefined`, so the sealed set came out empty. That is the one outcome D.2 refuses everywhere else, and no row had it |
| **N3** condition (1) accepts a spec that arrived by rename | ADOPTED AS A FIX | The `[RC]` split marks the synthesised record `renamedFrom`; condition (1) refuses it by name. Row (16). R2's own attack, built as R2 built it, and it **skipped** before the fix |
| **N4** the skip returns before the tamper check | ADOPTED | The tamper check runs above the claim, for every branch. A tampering child is not entered into the claim at all and is fenced as an ordinary branch, so both the tamper AND its own sealed touches are named. Row (17), with the green control (8e) shape beside it. The honest sentence R2 asked for is now in the cell's header: **a verified reseal child is fenced by the seal and by `fidelity()`, and by this cell not at all** |
| **N5** `-c core.quotepath=false` closes only the non-ASCII case | NOT ADOPTED, one sentence | The sentence is in the cell, above the split: quotepath closes non-ASCII; a `"` or a TAB is still quoted and a TAB additionally truncates `parts[1]`; **Windows forbids both bytes in a file name and this repository must check out on Windows**; `-z` is the complete answer the day that changes, and it costs per-record field counting |
| **N6** H18b binds the WHOLE list by count | to the S9 brief | Section 13.7, in the ruling's own words |
| **N7** a prose string alone on a line would count as a path | ADOPTED | The rule now requires the `rebuild/` prefix. Row H18c plants the line, **and plants a real path the same way as the control**, so the row measures the rule and not the plant. Measured: all 48 entries carry the prefix, so it costs the cell nothing |
| **N8** `Hb-M5` understates what a reader sees | CORRECTED | 12.6's `Hb-M5` row now says the whole file errors in `before()` naming no path, with R2's 13/0/13 |
| **N9** section 7 is stale | CORRECTED | Re-measured at `45bd62c`: the fence cell is **34 rows, 33 green, 1 red**; `package.test.cjs` is **14 tests**; `rebuild.yml` is **56 insertions in 2 hunks**; one step carries an `if:` |
| **N10** the `node_modules` junction chain into `%TEMP%\earned-adm` | REPORTED, not touched | Stays as written. I changed nothing, deleted nothing, created no junction. The PM keeps `%TEMP%\earned-adm` in place |
| **F3** condition (2)'s second limb | NOT ADDED | The reason is now in the cell rather than in a review: once a child has merged, a later push no longer carries its spec at status `A` in the merge-base diff, so the claim is not entered and the branch is fenced as an ordinary one. Row (8g) is the measurement of it, unedited |
| **F4** the three author-chosen refusal names | STAY | `FENCE-NO-INVENTORY-AT-CHAIN-REF`, `FENCE-GIT-UNAVAILABLE`, `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`. Three more are added this round in the same spelling style: `FENCE-NO-MERGE-BASE`, `FENCE-INVENTORY-NOT-JSON` |
| **F6** the thirteen comment lines in `boundary.test.mjs` | STAY | `boundary.test.mjs` is **byte-identical across this whole round** |
| **P-FENCE-1** the fence never runs in CI on the branches it exists for | ADOPTED | Section 13.4 |

## 13.4 P-FENCE-1: THE MEASUREMENT FIRST, THEN THE CONDITION

**The ruling asked which cells read `rebuild.yml` and whether any pins the ABSENCE of step
conditions. NONE DOES, so there is no STOP.** Thirty-one files under `rebuild/` name the
workflow; the five the PM listed, and every other one that reads the file rather than
mentioning it, were read:

| cell | what it does with `rebuild.yml` | does an `if:` on another step disturb it |
|---|---|---|
| `conform/v4/postfix/test/ci-second-gate.test.cjs:29` | the only WHOLE-FILE pin: `actual === original.replace(before, after)` against the object at `a777f643` | it would - but the cell is **already STALE-RED, and has been for many heads**. That is not my finding: `m4/workout/test/h3-clean-init.test.cjs:718` records it in those words ("stale-RED at this head AND at `ce38aa3`, pre-existing"), which is why H3/13 exists at all. My hunks do not change its state |
| `m4/workout/test/h3-clean-init.test.cjs` H3/13 | reads the `run:` line of the **today** step and requires its named set to equal the directory exactly | **no**: it finds the line by `run: node --test` plus `adapter.test.mjs`, and reads only that line |
| `m4/spec/b-ntc-successors.test.cjs:52` | drifts the file's BYTES under a `readFileSync` overlay and asserts the preflight refuses | **no**: shape-independent, it wants a refusal on any drift |
| `coach/test/engine-revision.test.cjs:56` | regexes out the standing `b-package.cjs --ci --package <id>` step | **no**: that is `:150`, which this ticket does not touch |
| `lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs:382` | one prose comment | no read |
| `lanes/c/p3-today-hotfix/today-headline.test.mjs:14` | prose only, explaining why the cell lives outside the seal | no read |
| `slice/pwa/test/workflow.test.cjs` | parses `slice-host.yml` and `deploy.yml`, not `rebuild.yml` | no |
| `lanes/tooling/test/shared-preflight-ci-registration.test.cjs:10` | `shared-preflight.yml` | no |

**So the condition lands.** `if: ${{ !cancelled() }}`, on the fence's step, keeping its
place directly after the today step, with eleven comment lines in the file's own style
saying why. It runs the step after an earlier failure and NOT after a cancellation; it
does not make the job green, because the step's own exit status is still the job's.

Measured after the edit: the workflow still parses (`yaml`, 30 steps, one fence step), the
fence step's `if` reads back as the string `${{ !cancelled() }}`, and it is the **only**
step in the file carrying a condition. **Row (18)** reads the line back out of the file,
finds the step by this cell's own path (`import.meta.url` relative to the repository root,
never a line number, never a glob), and goes red the day it is removed. Its red-first
evidence is `d6ed388` above; the mutation that kills it is "remove the `if:` line", which
is precisely the state of the tree at `a7158b9` and the state at `bb6e446` is the kill.

**This is not softening a failure into a pass.** Before the change the fence's step never
ran on a branch carrying undeclared sealed edits, so its nine-path sentence was never
printed and the run said only `SEALED-PROFILE-RECOMPUTATION ... local diagnostics
withheld`, which names nothing. After it, the fence runs and prints the nine paths, and
the job is still red for both reasons.

## 13.5 F9: THE FINDING N4's MOVE UNCOVERED, AND IT IS THE ONE TO READ TWICE

**F9. The tamper check accused every branch that merely predates the chain's newest
artifact, and it has done so since the check was written.** Moving it above the reseal
claim (N4) put row (8g) through it for the first time, and it went red at `c550fa6`:

```
D.2 (8g) ... AssertionError: FENCE-INVENTORY-DIFFERS-FROM-CHAIN
  rebuild/m4/spec/acceptance-s9-fixture.json | FENCE-SEALED-PATH-TOUCHED M
  rebuild/m3/w7-preview/today/today-app.cjs
  2 !== 1
```

In (8g) the chain has SEALED A NEW ARTIFACT since the branch was cut, so the branch's
worktree does not carry `acceptance-s9-fixture.json` **at all**, and `worktree === null`
read that absence as a deletion. The branch had moved nothing.

**It is pre-existing and it is dormant only by luck.** The limb has always run for every
ordinary branch; no row built the world because the chain tip still carries
`acceptance-s8-real-shape.json`, so every branch in the tree today carries the artifact
the fence reads. **It fires on every lane branch cut before S9 the day S9 seals** - which
is the day this cell ships.

**The fix, and what it does NOT cost.** The check now sits below the diff so it can ask
the merge base, and the comparison is made only where the merge base already held the
chain's own bytes: `carriedAtBase && (worktree === null || !worktree.equals(chainBytes))`.
This takes nothing away from R1 BLOCKING-2, and the reason is worth stating plainly: **the
inventory is read out of Git at the chain ref whatever the worktree says**, so a widened
worktree copy has never changed a verdict. The refusal is the DIAGNOSTIC that names the
tamper; the guarantee lives in the read. Rows (6), (6b) and (6c) are untouched and still
die under `M5` and `RX7`, and row (19)'s second half re-asserts the deletion case beside
the new one so the limb cannot be widened into an excuse.

**Row (8g) was not edited.** It is green again on its own assertions, which is the test
that the fix is a fix and not an accommodation.

## 13.6 THE MUTATION TABLE, RE-MEASURED FOR EVERY CLAUSE TOUCHED OR ADDED

Method as before and as R2's: one clause of the SHIPPED cell replaced by string
substitution, the file run with THE REAL ROW cut off so the baseline is all green, the
per-row pass/fail map diffed against the baseline. Harness at
`/home/claude/farm/scratch/b-r3/mutate.mjs`, outside the repository, pushed nowhere.
Run on Linux at the pushed head. **Baseline: 33 rows, 32 green** (row (18) is red in the
harness and only in the harness, because the mutant is written to a scratch file name that
no step in `rebuild.yml` runs - which is the row locating itself correctly, not a defect).

### The ten NEW clauses, every one killed

| # | mutation | verdict | newly red |
|---|---|---|---|
| R3-A | N2a: the merge-base guard removed (raw throw) | KILLED | (13) |
| R3-B | N2b: the `branchRunner === null` limb removed | **SURVIVED my first sweep; KILLED after row (14) was tightened** | (14) |
| R3-B2 | N2b: `branchRunner` read without the `try` (raw throw) | KILLED | (14) |
| R3-C | N2c: the `JSON.parse` guard removed (raw throw) | KILLED | (15) |
| R3-C2 | N2c: the not-an-object limb removed (vacuous pass on an array) | KILLED | (15) |
| R3-D | N3: the `renamedFrom` refusal removed | KILLED | (16) |
| R3-D2 | N3: the `renamedFrom` MARK removed from the `[RC]` split | KILLED | (16) |
| R3-E | N4: the claim entered even when tampered | KILLED | (17) |
| R3-F | F9: the `carriedAtBase` limb removed (the old shape) | KILLED | (8g), (19) |
| R3-F2 | F9: `carriedAtBase` true on mere presence, not on the chain's own bytes | KILLED | (8g), (19) |

**R3-B IS REPORTED AND NOT BURIED, because a surviving mutant is the one thing a mutation
table exists to find.** With row (14)'s first two assertions only - it is condition (4),
and it names the runner - removing the `branchRunner === null` limb changed no colour.
`idsOf(null)` returns `[]` (`exec` coerces `null` to the string `"null"`), so the second
limb refuses at (4) anyway, with the wrong sentence: *"S9 is not in IDS in this branch's
own b-package.cjs"*, about a file the branch had deleted. The verdict was never wrong; the
line this cell exists to print was. **That is R2 N2's complaint one level down, inside the
fix for R2 N2.** The answer is a third assertion on row (14) and not a weaker claim, and
`45bd62c` is the commit. R3-B is now KILLED by (14).

### The twenty-six R2 verified, re-measured at this head

All twenty-six still KILLED, with one difference in my harness that I record rather than
smooth over: **M8** ("a deletion does not count as touching") reddens **(1c)** here, where
R2 recorded (1c) and (1e). My M8 mutates only the `else` arm of the diff loop, and since
R1 BLOCKING-C the `D` half of a rename is pushed explicitly by the `[RC]` arm, so (1e) no
longer runs through the arm I mutated. That is a difference between two harnesses and not
between two trees; `M17` and `RX1` still redden (1e), so the rename halves are covered.

### The two outside the fence cell

| # | mutation | verdict | newly red |
|---|---|---|---|
| P-F1-M | the `if: ${{ !cancelled() }}` line removed from `rebuild.yml` | KILLED | fence row (18) |
| N7-M | H18b's per-line rule widened back to any quoted string | KILLED | `package.test.cjs` H18c |

Both are measured by the tree's own history rather than by a harness: the state at
`a7158b9` IS the `if:`-removed tree and (18) is red there; the state at `510388e` IS the
loose-rule tree and H18c is red there.

## 13.7 THE BAR AT THE FINAL HEAD, AND BOTH OPERATING SYSTEMS

`%TEMP%\earned-s9b` at `45bd62c`, working tree clean. Long runs through a `.cmd` with a
log and a `.done` file. **No re-run was needed anywhere: nothing was green once and red
once, on either machine, so nothing in this round is reported as timing.**

| what | count | exit | against R2 |
|---|---|---|---|
| `b-package.cjs --ci --package S8` **before my first edit** | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld` | 1 | identical |
| `b-package.cjs --ci --package S8` **after my last edit** | the same line, word for word | 1 | identical |
| the fence cell (step a) | **34 / 33 / 1** | 1 | was 27 / 26 / 1; +7 rows |
| the whole today step (`rebuild.yml:232`, 17 cells) | **685 / 683 / 2** | 1 | was 684 / 682 / 2; **+1 test, +1 pass, the same two failures** |
| the two failures | `boundary.test.mjs P-MEASURE (g)` and `setup.test.mjs re-pin`, by name | - | the same two, pre-existing |
| step b, the three passphrase cells | **20 / 20 / 0** | 0 | identical |
| step c, `rebuild/m3/w6/test/local-import.test.mjs` | **22 / 22 / 0** | 0 | identical |
| the lane C step (base `:306`, now `:333`) | **9 / 9 / 0** | 0 | identical |
| `package.test.cjs` alone | **14 / 14 / 0** | 0 | was 13; H18c is the new one |

The +1 on the today step is H18c and nothing else. The runner's refusal is unchanged
before and after, which is the expected pre-ruling state: a named refusal naming nothing,
and F8 stands - **on a branch like this one the fence is the only thing in CI that can
name the nine paths**, which is now also the only thing that will RUN to name them.

**BOTH OPERATING SYSTEMS.** The whole cell, fixture rows and all, at the pushed head:

```
Windows, %TEMP%\earned-s9b        34 tests, 33 pass, 1 fail   (THE REAL ROW)
Linux,   farm scratch worktree    34 tests, 33 pass, 1 fail   (THE REAL ROW)
```

Row for row identical, and the REAL ROW names **the same nine paths on both**. No design
in D.2 failed to build on either system. The two rows that could have been
system-dependent are (1d)'s case half (built without a case-only rename, so the two
spellings never coexist on a case-insensitive filesystem) and (13)'s orphan branch
(`git checkout --orphan`, which behaves the same on both).

## 13.8 THE MEASURED REFUSAL OF THE REAL ROW ON THIS BRANCH, AT THE FINAL HEAD

```
THE REAL ROW - this branch touched no sealed path the chain has not released
AssertionError: this change drew 9 refusal(s), 9 of them sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core (467638af3dc963c50652679b49156ed0000a86fc)
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

**The same nine paths, path for path, as R1's, the author's and R2's.** It is
`FENCE-SEALED-PATH-TOUCHED` and not `FENCE-RESEAL-CHILD-UNVERIFIED`, which is right: this
branch carries no `packages/S9.json` and makes no reseal-child claim at all. No skip, no
environment switch, no branch-name test was added to make it green.

**N10 demonstrated itself for the sixth and seventh time.** R1 read `1d70b62`, the first
author `bd3ca328`, R2's farm run `70113da5` and PC run `753ba870`, my first PC run
`4e832c2a` and my final one `467638af`. **Six fetches of a remote-tracking ref, six
commits, one answer and the same nine paths.** R1 N10's line earns its characters.

## 13.9 FOR THE S9 INTEGRATOR

1. **THE SHAPE THE FENCE EXPECTS OF THE `released` BLOCK, exactly, so the cross-lane check
   at integration is ONE assertion.** The fence does exactly this and nothing else:
   `new Set(Object.keys(inv.released || {}))`, and a path is released when it is a **key**
   of that set. So the artifact's `released` must be a **JSON object whose keys are
   repository-relative forward-slash paths**, byte-for-byte the spelling that appears as a
   key of `product` / `executionPins` and as a path in `git diff --name-status`. The
   VALUES are never read by the fence and may be anything. An ARRAY of paths releases
   NOTHING, because `Object.keys` of an array yields `"0"`, `"1"`, ... and no index is a
   path; the branch is then refused for a path the artifact meant to release. **Row (12)
   is the measurement of that direction, and row (12)'s second half pairs it with E fact
   15's shape to prove it is the shape and not some other difference.** The sibling lane
   `rebuild/b-s9-prep-runner` builds this block (spec B.4, hunk H10), and the one
   assertion is: *every element of the sealer's released list appears as a KEY of
   `artifact.released`, and `artifact.released` is a plain object.*
2. **THE PACK-PIN STEP OF THE SIBLING LANE NEEDS THE SAME `if:` CONDITION, FOR THE SAME
   REASON, AND THAT IS THE INTEGRATOR'S EDIT AND NOT MINE.** P-FENCE-1 is not special to
   the fence: GitHub skips every step after a failed one, and the standing
   `--ci --package` step at `:150` fails on any branch carrying undeclared sealed edits or
   not containing the chain tip. Any step whose whole purpose is to speak ON such a branch
   must carry `if: ${{ !cancelled() }}` or it will never run there. The fence's step
   carries it; the pack-pin step does not exist yet on this branch, so I have not touched
   it. **Row (18) is written to find the fence's own step by path and would not notice a
   sibling step; the sibling needs its own row.**
3. **The real row turns into a verified SKIP only when `packages/S9.json` lands**, with its
   `parent.chosen` option binding the artifact the fence reads at the chain ref and that
   artifact's exact sha256, and with `'S9'` in `IDS` in this branch's own `b-package.cjs`.
   Nobody has run that; it is an argument in this round and not a measurement, exactly as
   R2 said. When it lands, the diff will carry ONE added `packages/*.json` at status `A`
   and seven MODIFIED ancestor specs (E fact 7), which is row (8i)'s world, and the added
   one must be **authored, not moved**: `git mv` of an existing spec is now refused at (1)
   by name (row (16)).
4. **F9 is the one to read before integration.** From the day S9's artifact is the numeric
   maximum at the chain ref, every lane branch cut before it stops carrying the artifact
   the fence reads. The fix is in; if anyone reverts it, `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`
   will appear on branches that touched nothing. Rows (8g) and (19) are what say so.
5. **`ci-second-gate.test.cjs:29` is a whole-file pin on `rebuild.yml` and is stale-RED
   already**, by `h3-clean-init.test.cjs:718`'s own words and not mine. It is not in this
   ticket's owned list, I did not edit it, and nothing in this round changed its state.
   It is the PM's to route, and it will keep being red for every `rebuild.yml` hunk.

## 13.10 FOR THE S9 BRIEF

1. **R2 N6, in the ruling's own words.** H18b binds the WHOLE of `REQUIRED_INPUTS` by
   count, so after S9, adding ANY input to the bundle, inside `today/` or outside it, is a
   sealed act that rides a reseal child; that is intended, because a new file in the
   bundle is a data-path change.
2. **R2 N5's residue.** `-c core.quotepath=false` closes the non-ASCII case and only that
   one. A path carrying a `"` or a TAB would still be quoted by git, and a TAB would
   additionally truncate the `split("\t")`. Windows forbids both bytes in a file name and
   this repository must check out on Windows, so no such path can exist in it. `-z` is the
   complete answer the day that changes, and it costs per-record field counting. The
   sentence is in the cell; the brief should carry the fact that the guarantee rests on
   the Windows constraint and not on the fence.
3. **R1 N9, still unsealed.** The cell's byte-exact artifact comparison means the same
   thing on both runners because `.gitattributes` says `* text=auto eol=lf`, and
   `.gitattributes` is in **neither** S8 map. Nothing in this ticket can seal it.
4. **(R4) The honest limit of the fence, now in the cell's header, and R3 BLOCKING-2
   corrected what this item used to say.** A verified reseal child is fenced by the seal
   and by `fidelity()`, and by this cell not at all - except for the artifact-tamper check,
   which N4 moved above the claim **and which, at the head this report describes, holds
   WHEREVER THE BRANCH WAS CUT, because it asks THE DIFF and not the merge base's bytes**.
   At round 3's head that "except" was overstated: a verified child cut one reseal earlier
   stood aside anyway, and an ordinary branch forging the chain's newest artifact passed
   with no refusal at all (R3 measured all three worlds; rows (21), (22) and (23) are them).
   **The limit that remains, stated the other way round, is the whole of it: a branch whose
   own merge-base diff never touches the artifact is never accused of tampering with it,
   and a byte-equal copy of the chain's bytes is a touch and not a tamper.** And this cell
   asks only whether a touched path is IN the sealed inventory: `today-model.cjs:378` writes an athlete's
   weight reading from OUTSIDE it, so until TODAY-SPLIT seals its writer this fence passes
   a branch that rewrites the weigh-in admission bounds. That is D.4's WRITER-FENCE and S9
   does not build it.
5. **N10, unchanged and still true.** `%TEMP%\earned-s9b\node_modules` is a junction to
   `C:\Users\joeym\Documents\prepledger-dev\node_modules`, and `rebuild\m3\w5\node_modules`
   and `rebuild\m3\w6\node_modules` both point into **`%TEMP%\earned-adm`**, another lane's
   worktree. If that worktree goes, the today step and `local-import` lose their
   dependencies on this branch and the failure will read as a test failure. I changed
   nothing, deleted nothing and created no junction. The PM keeps `%TEMP%\earned-adm` in
   place.

## 13.11 WHAT THIS ROUND DID NOT TOUCH, AND WHAT I DID NOT VERIFY

`git diff --name-status 25a15956 45bd62c` names exactly four paths, every one owned:

```
M  .github/workflows/rebuild.yml
M  rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
M  rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
M  rebuild/m3/w7-preview/today/test/package.test.cjs
```

`boundary.test.mjs` is **byte-identical** across this round (F6 ruled its comment lines
stay, and E fact 12's hunk was already landed and accepted). No byte of
`rebuild/lanes/b/tooling/**`, no other `CHILD_SPECS` cell, no `rebuild/m4/workout/test/**`,
no `pack-pin.test.mjs` or `approved-pin.test.mjs`, no product file - `build.mjs` and
`preview.css` are byte-identical at this head. The whole wait list is untouched. No
`rebuild.yml` insertion falls between base `:233` and base `:305`, so the step another
lane is adding after base `:297` still merges clean.

**Not verified, and named so nobody reads it as verified:** GitHub CI itself on this
branch (STOP-7 is answered by the PM's run `35440101975` on ANOTHER branch, not by a run
of mine); the reseal-child SKIP against the real repository, which needs `packages/S9.json`
and is an argument here; the three passphrase cells and `local-import.test.mjs` as CELLS,
which were run and counted but not reviewed; and whether the S9 sealer emits `released` as
an object, which row (12) states the direction of and 13.9 names as the integrator's one
assertion.

---

Author of round 3: cowork (Earned lane hand), lane B, ticket S9-PREP-B, fix round 3, short.
Red first is literal for all eight behaviours. **Thirty-six clause mutations, one survivor
found and closed by a row and not by a weaker claim.** Both operating systems agree row
for row. One new finding, F9, which N4's move uncovered and which would have fired on
every lane branch the day S9 seals. **This report is a hypothesis: disagree with it where
the evidence lets you.**

**Round 4's own footer is at the end of section 14.**

---

# 14. R3 FINDINGS: FIXED

Round 4, a micro fix round by a fourth author. The earlier authors are gone and nothing of
theirs was discarded. Branch `rebuild/b-s9-prep-cells`, base for this round `814d593b`
(round 3's head `32c80967` plus R3 itself), final head `6b3e6fb`. **ONE FILE MOVED:**
`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`, plus this report.
`rebuild.yml`, `package.test.cjs` and `boundary.test.mjs` are **byte-identical to
`814d593b`** and were not opened for edit in this round.

R3 was REJECT on two blocking findings and the PM UPHELD BOTH. Both are fixed. R3's two
cheap survivors are adopted. Its three equivalent mutants are stated and left alone.

**I RE-RAN R3's OWN PROBES FIRST, before writing a line**, against the shipped bytes of
`814d593b` (`sha256 d3b57a3d...`, byte-identical to R3's pristine copy), on Linux:

```
probe-m31   parent: null                     | fail | FENCE-RESEAL-CHILD-UNVERIFIED (2) ... names no parent option null
            parent.chosen names no option    | fail | ... names no parent option "NOBODY"
            parent.options: []               | fail | ... names no parent option "S8"
            parent.options not an array      | fail | ... names no parent option "S8"
probe-f9    A new artifact                   | skip | FENCE-RESEAL-CHILD S10 ... stood aside on .../acceptance-s9-fixture.json
            B artifact bytes moved           | skip | FENCE-RESEAL-CHILD S9  ... stood aside on .../acceptance-s8-fixture.json
probe-ord   ordinary branch forging it       | pass | (no refusal)
```

Both findings reproduce exactly as R3 states them. My harness is at
`/home/claude/farm/scratch/s9b4/`, outside the repository, pushed nowhere.

## 14.1 THE COMMITS, AND WHICH ARE THE RED ONES

| commit | what | state of the fence cell |
|---|---|---|
| `8033a0b` | R3 BLOCKING-1: row (20). **The red is the MUTANT** (M31) | 35 rows, 34 green, 1 red |
| `74e2ec5` | **RED** - rows (21)(22)(23) against the SHIPPED `carriedAtBase` limb | 38 rows, 34 green, **4 red** |
| `21f494e` | R3 BLOCKING-2: the tamper limb asks the DIFF. One clause | 38 rows, 37 green, 1 red |
| `6b3e6fb` | R3's two cheap survivors: M29's assertion in (8a), M43's `runnerStub` reorder. **The red is the MUTANT**, twice | 38 rows, 37 green, 1 red |
| this commit | the report | - |

The one red at the end is THE REAL ROW, which is designed red on this branch.

## 14.2 R3 BLOCKING-1, FIXED: ROW (20)

`if (option === null) return bad(2, ...)` was a clause with no row. R3's M31 replaced it
with a stand-aside and not one row changed colour, on either operating system.

Row (20) runs four worlds - `parent: null`, `parent.chosen` naming no option,
`parent.options: []`, `parent.options` not an array - and for each asserts three things:
that `Object.keys(spec)` still IS the `SPEC_KEYS` closure (so the world really does reach
condition (2) rather than dying at (1), which is what makes row (8a)'s two bad bodies
miss it), `unverified(r, 2)`, and that the refusal NAMES the chosen id.

**RED FIRST IS THE MUTANT, and it is red on both operating systems at the committed bytes:**

```
with M31 (the stand-aside)      Windows 35 / 33 / 2      Linux 35 / 33 / 2
  not ok 34 - R3 BLOCKING-1 (20) ...
      parent is null: it SKIPPED: "FENCE-RESEAL-CHILD forged"
with the shipped clause         Windows 35 / 34 / 1      Linux 35 / 34 / 1
```

**`unverified` itself is byte-identical.** My first draft gave it an optional third
argument for the world name; my own sweep then found that argument SURVIVED as a clause
no green run can observe, because it appears only inside an assertion's failure message.
I removed it rather than ship a clause with no row inside the fix for a clause with no
row. The world name is carried by the row's own `assert.equal(r.status, "fail", ...)`,
which the M31 run above prints.

## 14.3 R3 BLOCKING-2, FIXED: ONE CLAUSE, THREE ROWS

The shipped limb asked whether the MERGE BASE held the chain's CURRENT bytes. The cell's
own comment says the question is whether THIS BRANCH MOVED IT. The fix is R3's, measured
and shipped as written:

```js
  const tampered = touched.some((t) => t.path === artifactPath)
    && (worktree === null || !worktree.equals(chainBytes));
```

`baseArtifact` and `carriedAtBase` are gone with it, and so is the `git show <base>:<path>`
read they needed - a clause removed rather than a clause added.

**THE THREE ROWS, RED FIRST AGAINST THE SHIPPED LIMB, both operating systems at `74e2ec5`
(Windows 38 / 34 / 4, Linux 38 / 34 / 4), the measured text:**

```
(21) a verified reseal child of a NEWLY sealed artifact, widening it in its worktree
     "a verified child widened the chain's newest artifact and stood aside:
      FENCE-RESEAL-CHILD S10 rebuild/lanes/b/tooling/packages/S10.json stood aside on
      rebuild/m4/spec/acceptance-s9-fixture.json 90650c8c2ee7..."
(22) a verified child of a RE-sealed artifact path, widening it
     "a verified child widened a re-sealed artifact and stood aside:
      FENCE-RESEAL-CHILD S9 rebuild/lanes/b/tooling/packages/S9.json stood aside on
      rebuild/m4/spec/acceptance-s8-fixture.json a2f07b6a06fb..."
(23) an ORDINARY branch cut before the chain's newest artifact, FORGING it with
     released = every path
     "a branch forged the chain's newest artifact in its worktree and PASSED: "
     - and the refusal list was EMPTY, which is why that message ends in nothing
```

**GREEN AFTER, at `21f494e`: Windows 38 / 37 / 1 (39.2 s), Linux 38 / 37 / 1 (3.5 s).**

**ROWS (6), (6b), (6c), (8g), (17) AND (19) ARE UNEDITED AND GREEN**, which is what makes
this a narrowing and not a trade. I did not touch one byte of any of them.

**F9 STAYS CLOSED, and row (23) now measures that too.** Its second half is the same
branch, cut in the same place, that does NOT touch the artifact - and that DOES touch
another file in the artifact's own directory (`rebuild/m4/spec/review-fixture.json`). It
must PASS. That half exists because my own sweep found the widened form
`touched.some((t) => t.path.startsWith(SPEC_DIR))` surviving: it re-opens F9 for every
branch that adds a review file beside the artifact, and nothing measured the difference.
It is M52 in the table below and row (23) kills it.

**The deletion case stays refused** (a `D` record is a touch: rows (6c) and (19)'s second
half). **A cherry-picked byte-equal copy is a touch and not a tamper**, because the second
limb is unchanged.

## 14.4 R3's TWO CHEAP SURVIVORS, ADOPTED

**M29, a sentence and not a verdict.** One assertion in (8a): the `not a spec at all` body's
refusal must say `does not parse`. RED on the mutant `catch { spec = {} }`, both systems:
Windows 38 / 36 / 2, Linux 38 / 36 / 2, (8a) red with
`"a body that is not JSON is reported as a key-closure miss: FENCE-RESEAL-CHILD-UNVERIFIED
(1) rebuild/lanes/b/tooling/packages/S9.json is not the runner's own SPEC_KEYS key closure
(b-package.cjs:1071)"`.

**M43, `idsOf`'s word boundary.** Two lines in `runnerStub()` putting `RETIRED_IDS` FIRST,
exactly as R3 asked. **NO ROW WENT RED ON THE REORDER ITSELF** - 38 / 37 / 1 before and
after, on both systems - so there was nothing to stop and report. RED on the mutant (the
`\b` removed), both systems: Windows 38 / 32 / 6, Linux 38 / 32 / 6, and **the same five
rows on both**: (8e), (8f), (8h), (8i) and (17).

**M48, M49 and M50 are equivalent mutants and I did not re-measure them as defects, in
R3's own words.** `fsBytes` returning an empty Buffer instead of `null` leaves `tampered`
true through the other limb and `fsBytes` has no other caller. `chainCommit` initialised
to `""` instead of `null` differs only on the path that returns before `here` is built,
and no row reads it there. Widening the spec-path regex from `([^/]+)` to `(.+)` makes
MORE files count as an added spec, so it makes the fence stricter, never looser. All three
still SURVIVE at my final head, and they are the ONLY survivors in this round 4
author's declared 52-mutation sample. Astra R4 separately measured X7, X8 and X9 as
non-equivalent survivors outside that sample; section 15 records their new rows.

## 14.5 THE MUTATION SWEEP, RE-RUN AT MY FINAL HEAD: 52 CLAUSES, 49 KILLED, 3 SURVIVED

R3's own `sweep.mjs` and its 50 clauses, re-pointed at `6b3e6fb`, with the four entries
that named `carriedAtBase` re-anchored on the new clause and **three mutants of my own
added**, because a clause I wrote is a clause that needs a row. Every entry is one exact
string substitution against the pristine shipped bytes; the cell is restored after each
run. (One of my three, M53, was a mutant of a clause I then DELETED - see 14.2 - so the
set that ran at the final head is 52.)

| # | clause mutated | verdict | rows newly red |
|---|---|---|---|
| M20 | the tamper's diff limb forced true | KILLED | (8g), (19), **(23)** |
| M21 | the tamper's diff limb forced false | KILLED | (6), (6b), (6c), (17), (19), **(21)**, **(22)**, **(23)** |
| M22 | the tamper's `worktree === null` limb removed | KILLED | (6c), (19) |
| M23 | the tamper's bytes-differ limb removed | KILLED | (6), (6b), (17), **(21)**, **(22)**, **(23)** |
| M24 | the tamper refusal never pushed | KILLED | 8 rows |
| M25 | a tampered branch may still claim | KILLED | (17), **(21)**, **(22)** |
| **M29** | the spec-parse catch yields `{}` | **KILLED** (was SURVIVED) | (8a) |
| **M31** | `option === null` stands aside | **KILLED** (was SURVIVED) | **(20)** |
| **M43** | `idsOf`'s `\b` removed | **KILLED** (was SURVIVED, equivalent) | (8e), (8f), (8h), (8i), (17) |
| M45 | the inventory read from the WORKTREE | KILLED | (6), (6b), (17), **(21)**, **(22)**, **(23)** |
| M46 | the verdict is always `pass` | KILLED | 15 rows |
| **M51** (new) | the tamper limb back to F9's merge-base form, i.e. **exactly what R3 rejected** | **KILLED** | **(21)**, **(22)**, **(23)** |
| **M52** (new) | the tamper limb reads the diff for ANY `rebuild/m4/spec/` path, not the artifact | **KILLED** | **(23)** |
| M48 | `fsBytes` returns an empty buffer | **SURVIVED** | equivalent, 14.4 |
| M49 | `chainCommit` initialised to `""` | **SURVIVED** | equivalent, 14.4 |
| M50 | the spec-path regex admits a nested path | **SURVIVED** | equivalent and STRICTER, 14.4 |

The other 36 entries of R3's table are unchanged and all still KILLED by the rows R3 names,
including `P-F1a/b/c` (row (18)) and `N7-M` (`package.test.cjs` H18c). Full output:
`/home/claude/farm/scratch/s9b4/sweep4.log`.

**M51 is the one to read.** It is the shipped `carriedAtBase` form, re-applied to the fixed
cell as a mutant, and three rows kill it. That is the proof that this round's fix cannot be
quietly reverted by a later hand.

## 14.6 THE BAR AT MY FINAL HEAD

`%TEMP%\earned-s9b` at `6b3e6fb`, working tree clean, node v24.19.0,
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, long runs through a `.cmd` with a
log and a `.done` file. Linux: a fresh farm scratch worktree of the PUSHED head, whose
copy of the cell has `sha256 adfda4d9...`, byte-identical to the PC's.

| what | round 4 | round 3 (R3 measured) |
|---|---|---|
| `b-package.cjs --ci --package S8` **before my first edit** | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | identical, word for word |
| `b-package.cjs --ci --package S8` **after my last edit** | **the same line, word for word**, exit 1 | identical |
| the fence cell, Windows | **38 / 37 / 1**, exit 1, 37.6 s | 34 / 33 / 1 |
| the fence cell, Linux | **38 / 37 / 1**, exit 1, 3.5 s | 34 / 33 / 1 |
| the whole today step (`rebuild.yml:232`, 17 cells) | **685 / 683 / 2**, exit 1 | 685 / 683 / 2, exit 1 |
| the two today-step failures | `boundary.test.mjs P-MEASURE (g)` and `setup.test.mjs re-pin`, by name | the same two, pre-existing |
| `package.test.cjs` alone | **14 / 14 / 0**, exit 0 | 14 / 14 / 0, exit 0 |
| step (b), the three passphrase cells | **20 / 20 / 0**, exit 0 | 20 / 20 / 0, exit 0 |
| step (c), `rebuild/m3/w6/test/local-import.test.mjs` | **22 / 22 / 0**, exit 0 | 22 / 22 / 0, exit 0 |
| the lane C step | **9 / 9 / 0**, exit 0 | 9 / 9 / 0, exit 0 |

**No re-run was needed anywhere. Nothing was green once and red once on either machine, so
nothing in this round is reported as timing.**

**BOTH OPERATING SYSTEMS, ROW FOR ROW.** The whole cell at the pushed head:

```
Windows, %TEMP%\earned-s9b        38 tests, 37 pass, 1 fail   (THE REAL ROW)
Linux,   farm scratch s9b4-head   38 tests, 37 pass, 1 fail   (THE REAL ROW)
```

Rows (20), (21), (22) and (23) are green on both. **No design in D.2 or in R3's two
findings failed to build on either system.** The four new ROWS build eight throwaway
fixture repositories: (20) uses chain()/child() for four parent variants without
`git checkout -b`; (21) and (22) each build one world with a separate chainline; (23)
builds two such worlds. The measured results above agree on both operating systems.

## 14.7 THE MEASURED REFUSAL OF THE REAL ROW, AT MY FINAL HEAD

Unchanged from R3's: this branch still touches nine sealed paths and carries no
`packages/S9.json`, so it enters no claim and is refused as an ordinary branch.

```
Windows (chain ref at 2d71dd049b1b25ca7645cdbd50ff38d70694e159):
  this change drew 9 refusal(s), 9 of them sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core (2d71dd04...) does not release
    FENCE-SEALED-PATH-TOUCHED M .github/workflows/rebuild.yml
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w6/local/import-bundle.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/import/import-screen.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/import/test/page-bundle.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/measure/test/boundary.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/adapter.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/package.test.cjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/test/view.test.mjs
    FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/today-app.cjs

Linux (chain ref at 6268e7f86c58ea44b90619116b26e6617f00ff71): the SAME nine paths, the
  same artifact, the same sentence, a different chain commit.
```

It is `FENCE-SEALED-PATH-TOUCHED` and not `FENCE-RESEAL-CHILD-UNVERIFIED`, which is right.
**No skip, no environment switch and no branch-name test was added to make it green.**
R1 N10 demonstrated itself a third time: the two machines stand at different commits of
the remote-tracking chain ref and print the same nine paths, which is what the commit in
the refusal line is for. I did not fetch the chain ref on the PC; other lanes share it.

## 14.8 WHAT THIS ROUND DID NOT TOUCH

`git diff --name-status 814d593b 6b3e6fb` names exactly one file:

```
M  rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
```

plus this report in the commit that carries it. `rebuild.yml`, `package.test.cjs` and
`boundary.test.mjs` are **byte-identical to `814d593b`**, as this round was told they must
be. No byte of `rebuild/lanes/b/tooling/**`, no other `CHILD_SPECS` cell, no
`rebuild/m4/workout/test/**`, no `pack-pin.test.mjs` or `approved-pin.test.mjs`, no product
file. The whole wait list is untouched: no `packages/S9.json`, no needle, no
`acceptance-s9` artifact, no `--ci --package S9` walk, no flip of the standing step, no
PACK-PIN or APPROVED-PIN literal, no `design.test.cjs` hunk, no S9 brief, no PM token line.
I ran no seal generator, never `b-package.cjs --full`, and wrote no receipt or artifact
into the tree. I opened nothing under `rebuild/conform/private`, no `ledger/`, no
`src/history.js`, no `EarnedPort`, no `port-real.log` and no soak, on either machine, and
created no junction. The authored bytes are ASCII: the cell contains not one non-ASCII
byte, and no U+2013 or U+2014 is on any line this round adds.

**Not verified, and named so nobody reads it as verified:** GitHub CI itself on this branch
(STOP-7 is still answered only by the PM's run `35440101975` on another branch); the
reseal-child SKIP against the real repository, which needs `packages/S9.json`; and whether
the S9 sealer emits `released` as an object. I did not re-run the sibling lanes' cells, the
24-cell `rebuild/m3/w7-preview/**` suite, or `coach/test/engine-revision.test.cjs`.

## 14.9 CARRIED FORWARD, UNCHANGED, IN R3's WORDS

**FOR THE S9 INTEGRATOR.**

1. The sibling lane's pack-pin step needs the same run-after-failure condition and **its
   own row**: row (18) finds only the fence's own step, by this cell's own repository path.
2. The two new CI homes (b) and (c) **carry no condition**, so on any branch where the
   standing `--ci --package S8` step fails they never run either. That is the status quo
   for all 29 other steps and it is **a decision and not an oversight**: both steps exist
   to give homeless cells a CI home rather than to speak on a failing branch.
3. `shared-preflight-ci-registration.test.cjs:82` holds the OTHER public workflow's
   protected step to **no `if:` at all**, under `REGRESSION-NO-SKIP`, with "step skip" in
   its own mutation list. `rebuild.yml` has no equivalent cell, so nothing in the tree
   forbids the fence's condition - but the day somebody writes that closure for
   `rebuild.yml`, **the fence's step is the one exception it will have to name on purpose.**
4. The `released` shape: `new Set(Object.keys(inv.released || {}))`. A path is released
   when it is a KEY; values are unread. Row (12) measures the array direction.

**FOR THE PM TO ROUTE.** `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs:29` pins
`rebuild.yml` byte for byte against `a777f643`, is **stale-RED**, and is **named by no CI
step**. Pre-existing; nothing this round did changed its state; not mine to touch.

## 14.10 WHAT I WOULD HAVE THE NEXT REVIEWER ATTACK

1. **The one clause I wrote.** `touched.some((t) => t.path === artifactPath)` is a string
   equality over a diff record. M52 says the obvious widening is caught. What about the
   narrowing nobody has tried: a rename of the artifact, where the `[RC]` split gives a
   `D` on the old path and an `A` on the new one. If the chain's artifact is renamed away
   by the branch, `touched` holds it at `D`. For an ordinary rename away, `worktree`
   is null. For a case-only rename on this Windows PC, the old spelling resolves to
   the renamed file and returns equal bytes instead: the shipped guard PASSES an
   ordinary branch and SKIPS an otherwise verified child. Astra R4 measured this
   defect; section 15 adds exact HEAD-path presence and rows (24)-(25). Row (1e)
   covers sealed paths, not this inventory-path deletion.
2. **Row (23)'s second half rests on `touched === 2`.** If a future helper adds a file to
   every fixture branch, that assertion moves and its message would read as a real defect.
3. **Row (20)'s four worlds all die at condition (2).** They prove the clause is reached
   and refuses; they do not prove the clause is reached on any world a real S9 spec could
   be in, which is an argument the S9 package itself will settle.

---

Author: cowork (Earned lane hand), lane B, ticket S9-PREP-B, **fix round 4, micro**.
One file moved. Both of R3's blocking findings fixed, each RED FIRST in its own commit and
on both operating systems. **Fifty-two clause mutations at the final head, forty-nine
killed, three survivors and all three are R3's own equivalent mutants, within this
round 4 author's declared sample.** Astra R4 found three additional non-equivalent
survivors outside that sample (X7-X9); section 15 records the response. The two mutants
this round's own new clause invites - M51 (the form R3 rejected) and M52 (the obvious
widening) - are both killed by the new rows. **This report is a hypothesis: disagree with
it where the evidence lets you.**


## 15. Astra R4 findings: fixed

Builder: Astra, 2026-09-19. Branch: rebuild/b-s9-prep-cells-astra5.
Base: 01b88efeb92435d818f672d3ed43521719a5961e. Left UNCOMMITTED for the PM.
This is a measured hypothesis for the independent Claude reviewer, not an approval.

### 15.1 The guard and its five rows

Inside the exact artifact-touch guard, HEAD must still carry the exact inventory path:
git ls-tree --name-only -z HEAD -- <artifactPath>, followed by exact membership in
its NUL-separated output. Absence is tampering even if the disk resolves a case alias.
The worktree-null and byte comparisons remain beside it. A failed query returns
FENCE-INVENTORY-HEAD-UNREADABLE <artifactPath> at HEAD; it does not throw a raw error.

(24) is the ordinary two-hop case-only rename. (25) first measures the child's valid
SKIP, then applies that rename and requires both the inventory and APP refusals.
(26) is X7's R100 rename INTO the new inventory with different bytes. (27) is X8's
upper-case sibling edit whose own diff never touches the exact inventory path.
(28) is X9's one-LF edit with equal parsed JSON and unequal bytes. All are synthetic.
No two case spellings need to coexist on disk. Each row states its finding, mutation
and reachable world in its comment.

Measured query probe on this PC: before rename, the output is the exact lower-case
path plus NUL. After rename it is empty with core.ignorecase=true AND false, while
fsBytes(old spelling).equals(chainBytes) is true. Row (24) also asserts the empty
query under core.ignorecase=true and the presence of the upper-case path. A separate
scratch probe injected an exception at this new HEAD query: fence returned status=fail
and exactly FENCE-INVENTORY-HEAD-UNREADABLE with the inventory path and HEAD, no throw.
This was fault injection, not a claim that a real Git process failed during the bar.

### 15.2 Red first, at the shipped clause

The runnable scratch copy retained the directory layout and a copy of rebuild.yml for
row (18). The FIRST run preceded the guard edit: 43 / 40 / 3, exit 1; (24) and (25)
newly red, (26)-(28) green. Its REAL row had no scratch chain ref. The later matched
red-first rerun directed only the REAL row's root argument to this actual worktree;
all 43 registrations ran and the same two fixture rows were red. Copied TAP lines:

```text
not ok 38 - Astra R4 (24) - an ordinary case-only inventory rename FAILS naming the exact path
not ok 39 - Astra R4 (25) - a verified child with a case-only inventory rename FAILS naming both touches
    'pass' !== 'fail'
    'skip' !== 'fail'
```

The first assertion reports "case-only inventory rename was admitted"; the second
reports "case-only rename still stood aside" with FENCE-RESEAL-CHILD S9 and its
inventory path/hash. Matched red-first: 43 / 40 / 3, exit 1, 38.526 s. Fixed scratch
control: 43 / 42 / 1, exit 1, 38.706 s. The remaining red is THE REAL ROW.
Linux expectation, NOT measured here: (24) and (25) are green before AND after the
fix because the old spelling does not resolve there. The PM runs that half in the
cloud farm at the final cell hash below.

### 15.3 Final-byte mutation table, measured on this PC

Each variant starts from the same final bytes and makes only its named substitution.
The M51 variant restores the exact old block read from 814d593b. Scratch runs retain
all 43 registrations; the REAL row points to this worktree and remains design-red.
No row was skipped, weakened or deleted. Every run below exits 1; the table's last
column excludes the unchanged REAL failure. Counts are tests / pass / fail.

| ID | Substitution | Counts | Newly red fixture rows |
|---|---|---|---|
| X1 | touched.some -> touched.every | 43 / 31 / 12 | (6), (6b), (6c), (17), (19), (21), (22), (23), (24), (25), (26) |
| X2 | touch predicate -> true | 43 / 38 / 5 | (8g), (19), (23), (27) |
| X3 | touch predicate -> false | 43 / 30 / 13 | (6), (6b), (6c), (17), (19), (21), (22), (23), (24), (25), (26), (28) |
| X4 | outer && -> OR | 43 / 38 / 5 | (8g), (19), (23), (27) |
| X5 | remove worktree === null OR limb | 43 / 42 / 1 | NONE (survives this cell) |
| X6 | remove bytes-differ OR limb | 43 / 34 / 9 | (6), (6b), (17), (21), (22), (23), (26), (28) |
| X7 | ignore renamedFrom destinations | 43 / 41 / 2 | (26) |
| X8 | case-fold artifact-path equality | 43 / 41 / 2 | (27) |
| X9 | parsed-JSON equality instead of bytes | 43 / 41 / 2 | (28) |
| M31 | option === null -> stand-aside return | 43 / 41 / 2 | (20) |
| M51 | restore exact 814d593b baseArtifact/carriedAtBase block | 43 / 36 / 7 | (21), (22), (23), (24), (25), (26) |
| M52 | path equality -> t.path.startsWith(SPEC_DIR) | 43 / 40 / 3 | (23), (27) |
| M29 | spec parse catch -> spec = {} | 43 / 41 / 2 | (8a) |
| M43 | remove idsOf word boundary | 43 / 36 / 7 | (8e), (8f), (8h), (8i), (17), (25) |

X7, X8 and X9 each turn ONLY their new fixture row red; no other fixture row changes:

```text
not ok 40 - Astra R4 (26) - renaming different bytes INTO the inventory FAILS by name
not ok 41 - Astra R4 (27) - editing only an upper-case sibling of the inventory PASSES
not ok 42 - Astra R4 (28) - a whitespace-only inventory edit FAILS by name
```

Result: 14 substitutions, 13 detected by the registered cell, 1 survivor (X5).
X5 is NOT asserted equivalent: exact HEAD absence now catches the committed-deletion
worlds that previously killed it. Separate synthetic probe: commit an inventory edit,
then delete only its worktree copy. Final code names FENCE-INVENTORY-DIFFERS-FROM-CHAIN;
X5 instead names FENCE-INVENTORY-HEAD-UNREADABLE after its null dereference is caught.
That diagnostic distinction is outside the five requested rows and is not concealed
as a green mutation result. The null limb remains in the shipped code.

### 15.4 The final cell bar and custody

Executed in this actual worktree, using only the specified Node binary:

```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-reporter=tap rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
```

```text
not ok 43 - THE REAL ROW - this branch touched no sealed path the chain has not released
# tests 43
# pass 42
# fail 1
# skipped 0
# duration_ms 38340.9427
exit 1
```

The REAL row reports exactly nine FENCE-SEALED-PATH-TOUCHED M refusals: the same nine
paths listed in 14.7, for acceptance-s8-real-shape.json at chain commit
e861745868c8a020b808b03f3c239e35938c59d3. No reseal-child-unverified refusal, no other red.

Executed: certutil -hashfile rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs SHA256
```text
7d832522f53256ae49eea7c9cf31fa0425e66634f02b3bd081cf5a676a8aeec2
CertUtil: -hashfile command completed successfully.
```

Buffer comparisons against HEAD: registrations (6), (6b), (6c), (8g), (17), (19),
(20), (21), (22), (23) are byte-identical. The complete cell is ASCII; every added
report line is ASCII. git diff --check passes. Section 14 is corrected in place:
case-only rename behavior, sample-bounded survivor claims, 36 remaining entries,
and four rows/eight repositories instead of four checkout -b worlds.

Scratch evidence retained for the reviewer (no scratch-tree deletion attempted):
C:\Users\joeym\AppData\Local\Temp\astra-s9-r5-20260919
Files include shipped.mjs, red-first-source.mjs, final-source.mjs, sweep.mjs,
mutations.json, results.json, red-first.tap, control.tap, X1.tap through X9.tap,
M31/M51/M52/M29/M43.tap, final-actual.tap, and the query/null probe sources and logs.
Every run used the existing fixture cleanup hook; its cleanup results were not independently inventoried.

### 15.5 What I did not verify

The Linux half is run by the PM in the cloud farm at these final bytes. No Linux
execution or cross-platform completion is claimed here. I did not rerun the historical
52-mutant sample, sibling suites, the conformance gate, package runner, hosted CI,
the real S9 reseal SKIP, or other seal gates. Historical section 14 results remain
attributed to their author; only the specified corrections and this section are new.
No protected/private/auth file was read; no receipt or artifact writer was run; no
dependency, shared-repository ref, product, workflow or sealed file was changed.
Only the two assigned tracked files were edited. No commit, push, fetch, stash,
checkout, reset or clean was run in this worktree or the shared repository.

### 15.6 Last commands

```text
git status --porcelain
 M rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
 M rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs

git diff --stat
 rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md     | 189 ++++++++++++++++++++-
 .../c/ui-port/sealed-inventory-fence.test.mjs      | 134 ++++++++++++++-
 2 files changed, 310 insertions(+), 13 deletions(-)
```

## 16. Review R5: fixed

Builder: Astra, micro round 6, 2026-09-19. Base: 68ed616d.
Branch: rebuild/b-s9-prep-cells-astra5. Left UNCOMMITTED for the PM.
This report is a measured hypothesis for the next independent Claude reviewer.

### 16.1 The row, the ruling, and the spec

Copied section 4's entire js code block, comment included, directly from
S9-PREP-CELLS-REVIEW-R5.md after (6c). Measured before removing the catch:
(6d) GREEN; whole cell 44 tests / 43 pass / 1 fail, exit 1, 48348.4802 ms.
The only red was THE REAL ROW. No repair to the supplied row was needed or made.

N1: implemented the PM's reversal of DECISIONS:573. The guard is one const
expression: exact inventory touch AND (case-exact HEAD absence OR absent worktree
copy OR unequal bytes). Removed the try/catch and its executable refusal name.
The comment at that clause records R5's finding that rev-parse, merge-base and the
same-tree diff have already succeeded, that no reachable query failure was found,
and that Y9's fail-open catch survived all 43 rows on both systems. Those search
results are the reviewer's measurements, not a new search claimed here. An
unexpected Git failure now propagates to the calling test with Git's message;
there is no catch left to turn that failure into an admission. N4's null touched
count on the removed refusal path disappears with it.

The mandated verbatim (6d) comment still describes the old catch and names
FENCE-INVENTORY-HEAD-UNREADABLE historically. It was not reworded. That refusal
is no longer returned by fence(); at the final bytes X5 throws a TypeError in
(6d), as measured below. Nothing else in fence() moved.

N2: R5 measured (24) and (25) green on Linux against the round 4 clause, so only the Windows runner would notice that fix being reverted.

N3: found both D.2 table rows in S9-RELEASE-SPEC.md. Appended the HEAD-presence
and byte-equal-touch sentence to "the artifact-tamper check", and the review-row
sentence naming (24)-(28) and (6d), as (17)-(23), to "red first". Compared with
HEAD: exactly those two rows changed, every original word retained; no other
spec bytes changed.

### 16.2 Red-first mutation evidence at the final bytes, this Windows PC

Scratch: C:\Users\joeym\AppData\Local\Temp\astra-s9-r6-AixdEC
Copied the final cell under its own rebuild/lanes/c/ui-port path and copied
.github/workflows/rebuild.yml for (18). Each mutation is one substitution in
the tamper expression against pristine final bytes, run sequentially, never
combined. All 44 registrations run in every copy, without a skip or row edit.
The scratch REAL row stays red with FENCE-CHAIN-REF-ABSENT because this scratch
root has no chain ref; the actual-worktree bar is recorded separately below.
Scratch CTRL: 44 / 43 / 1, exit 1, 46500.2627 ms; only THE REAL ROW red.

Counts below are tests / pass / fail. Every run exits 1 and reports cancelled 0,
skipped 0. "Newly red" excludes the unchanged scratch REAL failure.

| ID | Exact substitution in the tamper expression | Counts | Newly red fixture rows |
|---|---|---|---|
| X5 | remove the worktree-null OR limb | 44 / 42 / 2 | (6d) |
| Y3 | remove the leading `!` from `!gitText(...)` | 44 / 40 / 4 | (6d), (24), (25) |
| Y5 | `.split("\0")` becomes `.split("\n")` | 44 / 42 / 2 | (6d) |
| Y6 | remove `"-z"` from the ls-tree args, retain `.split("\0")` | 44 / 42 / 2 | (6d) |
| X7 | `t.path === artifactPath` becomes `t.path === artifactPath && t.renamedFrom === undefined` | 44 / 42 / 2 | (26) |
| X8 | `t.path === artifactPath` becomes `t.path.toLowerCase() === artifactPath.toLowerCase()` | 44 / 42 / 2 | (27) |
| X9 | `!worktree.equals(chainBytes)` becomes `JSON.stringify(JSON.parse(worktree)) !== JSON.stringify(JSON.parse(chainBytes))` | 44 / 42 / 2 | (28) |
| Y9 | no longer applies: the catch it rewrote to `tampered = false` has been removed | not run | no catch clause to mutate |

Copied red lines, grouped by run (THE REAL ROW is also red in every run):

```text
X5:
not ok 4 - R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER
Y3:
not ok 4 - R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER
not ok 39 - Astra R4 (24) - an ordinary case-only inventory rename FAILS naming the exact path
not ok 40 - Astra R4 (25) - a verified child with a case-only inventory rename FAILS naming both touches
Y5:
not ok 4 - R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER
Y6:
not ok 4 - R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER
X7:
not ok 41 - Astra R4 (26) - renaming different bytes INTO the inventory FAILS by name
X8:
not ok 42 - Astra R4 (27) - editing only an upper-case sibling of the inventory PASSES
X9:
not ok 43 - Astra R4 (28) - a whitespace-only inventory edit FAILS by name
Every run:
not ok 44 - THE REAL ROW - this branch touched no sealed path the chain has not released
```

X5's measured error at the final bytes is:
`Cannot read properties of null (reading 'equals')`, TypeError, ERR_TEST_FAILURE.
Thus (6d)'s deletion half kills X5 without the removed catch. Its byte-equal
control kills Y3, Y5 and Y6. These seven tested substitutions were all detected;
this is not a claim about mutations outside this declared sample.

### 16.3 The whole-cell bar and hash

Node v24.19.0, using only the requested binary. Before test execution the two
environment assignments were set on separate PowerShell lines and inherited by
every sequential child in sweep.cjs:

```powershell
$env:MEASURED_TEST_NOW = '2026-09-03'
$env:TZ = 'America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-reporter=tap rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
```

Final-byte execution in this actual worktree, captured in final-actual.tap:

```text
not ok 44 - THE REAL ROW - this branch touched no sealed path the chain has not released
# tests 44
# pass 43
# fail 1
# cancelled 0
# skipped 0
# duration_ms 49658.3952
exit 1
```

Exactly nine FENCE-SEALED-PATH-TOUCHED M refusals, the same paths listed in 14.7;
no other row red, no reseal-child-unverified refusal. The final run names
acceptance-s8-real-shape.json at chain commit
4f89fb9b45fe7bbc548e35295cbb3993fa9df68f. The earlier row-only run named
582c282caf2a0163c5caa2a6212e37a3b58ed86f; the ref resolved differently between
those runs. I ran no fetch or ref mutation in this worktree or shared repository.

Executed: certutil -hashfile rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs SHA256

```text
SHA256 hash of rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs:
43bcda207174397681fb616b884bb951924250d48091b91bc0983d17762077e6
CertUtil: -hashfile command completed successfully.
```

Compared each registration's bytes with both the initial disk copy and HEAD:
43 of 43 existing rows are BYTE-IDENTICAL; the final count is 44. The review's
entire js block is present verbatim. Removing that insertion and the guard block
from the comparison leaves identical cell bytes. The complete cell is ASCII;
all report additions and both spec additions are ASCII. git diff --check passes.
Only the three assigned files differ; earlier report sections are untouched.

### 16.4 What I did not verify

The Linux half is run by the PM in the cloud farm at these bytes. I ran no Linux
leg, hosted CI, historical full mutation sweep, sibling suite, conformance gate,
package runner, real S9 reseal SKIP, or seal generator. I did not reproduce R5's
search for a reachable ls-tree failure; the N1 comment implements the PM's ruling.
No protected/private/auth file was read and no receipt or artifact writer was run.
No dependency, workflow, product file, review file, DECISIONS or STATUS was edited.
No commit, push, checkout, reset, stash, clean or fetch was run in the worktree or
shared repository. Git mutations occurred only in the cell's own synthetic fixtures.

Scratch retained for the reviewer at the path in 16.2: original.mjs, row-6d.txt,
final-source.mjs, sweep.cjs, mutations.json, results.json, CTRL.tap, final-actual.tap,
X5.tap, Y3.tap, Y5.tap, Y6.tap, X7.tap, X8.tap, X9.tap, and the scratch layout with
the cell restored to the final bytes and the workflow copy. No scratch-tree deletion
was attempted. Each run used the unchanged fixture cleanup hook; its cleanup results
were not independently inventoried, and no refused cleanup was retried.

### 16.5 Last commands

```text
git status --porcelain
 M rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
 M rebuild/lanes/b/S9-RELEASE-SPEC.md
 M rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs

git diff --stat
 rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md     | 171 +++++++++++++++++++++
 rebuild/lanes/b/S9-RELEASE-SPEC.md                 |   4 +-
 .../c/ui-port/sealed-inventory-fence.test.mjs      |  55 ++++++-
 3 files changed, 221 insertions(+), 9 deletions(-)
```
