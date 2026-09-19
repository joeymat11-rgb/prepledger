# S9-PREP-CELLS REVIEW R2 - the second round, independent, over the fix round

Reviewer: cowork (Earned lane hand), lane B, ticket S9-PREP-B, round 2.
Branch reviewed: `rebuild/b-s9-prep-cells` at **`56e4808a`** (base `da9f8683`).
Author report read only AFTER I had read the diff, formed a view and run the attack plan.
Machines: the owner's PC (Windows, node v24.19.0, `%TEMP%\earned-s9b` and a scratch
worktree `%TEMP%\s9b-rev2` of my own) and a farm scratch worktree on Linux at the same head.
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York` throughout.

---

## VERDICT: ACCEPT WITH NOTES

R1's four BLOCKING findings are all **FIXED**, and I did not take that on the report's word:
I re-ran the whole mutation sweep myself with a harness of my own and every one of the
twenty-six clause mutations is killed by a row, including the five R1 said survived. Red
first is literal and I proved it by checking out the red commits. The bar reproduces on my
machine number for number. The owned-files fence holds: six files, every one of them owned,
and `rebuild.yml` is two hunks with nothing between base `:233` and base `:305`.

**I found no way to make the fence pass for a branch that touched a sealed path.** Eleven
new attacks, five of them not in D.2's list and not in the cell, and the fence refused every
one. What I did find is **nine notes**, of which two matter: a sentence in the report that
claims a measurement nobody made (**N1**, and it is the one thing I would have the author or
the PM correct before the PM rules), and **three measured paths where the cell throws a stack
trace instead of naming a refusal** (**N2**). Neither is a bypass. N2 never produces a pass -
the step goes red either way - which is why this is ACCEPT WITH NOTES and not REJECT.

**BLOCKING: none.**

---

## 0. WHAT I RE-MEASURED BEFORE OPENING THE REPORT

Read first, in the farm, at `56e4808a`: the whole diff file by file, the fence line by line
against spec D.2, then R4 sections 7 and 8, B.8, C.2, D.1-D.4, E facts 14/16/20/21/22, F.2.
Then, and only then, `S9-PREP-CELLS-AUTHOR-REPORT.md` and `S9-PREP-CELLS-REVIEW-R1.md`.

| what | my measurement | the report / the spec | verdict |
|---|---|---|---|
| `build.mjs` `REQUIRED_INPUTS` path literals | **48**, all distinct | 48 | CONFIRMED |
| of them under `rebuild/m3/w7-preview/today/` | **26** | 26 | CONFIRMED |
| the rest by root | 3 engine, 3 client, 1 coach, 8 m4, 7 other m3 | the same five | CONFIRMED |
| `TODAY_REQUIRED_INPUTS` in `package.test.cjs` vs the today/ half | **set-equal, 26 for 26** | - | CONFIRMED by script, not by eye |
| `REQUIRED_INPUTS` exported from `build.mjs` | **no** (`:44` re-exports five names; the const is module-local) | F1's surviving half | CONFIRMED, and F1's retraction is right |
| `acceptance-s8-real-shape.json` `product` / `executionPins` | **224 / 71** | 224 / 71 | CONFIRMED |
| a `released` key in that artifact | **absent** | absent | CONFIRMED; `inv.released \|\| {}` is why nothing throws |
| execution-pinned but not product-pinned | **3**: `packages/S8.json`, `S8-REAL-SHAPE-BRIEF.md`, `today/test/catalogue.test.mjs` | - | mine; row (1b) is what covers them |
| `.gitattributes` in either S8 map | **neither** | R1 N9, section 2.4 | CONFIRMED |
| the fence cell in `TOOLING_FILES` or in the S8 `product` map | **in neither** | B.8's last paragraph | CONFIRMED |
| `rebuild/lanes/c/ui-port/` in `CHILD_ROOTS` | **absent**; `rebuild/m3/w6/test/` **present** at `:405` | E facts 3 and 22 | CONFIRMED |
| `rebuild.yml` names `local-import.test.mjs` / `passphrase-normalize` at `da9f8683` | **0 / 0** | E facts 21 and 22 | CONFIRMED |
| `idsOf()` against the REAL `b-package.cjs` | returns the twelve ids of `:173`, and `\b` does refuse `RETIRED_IDS`, `NO_REGISTER_IDS`, `GATE_IDS` | - | CONFIRMED |
| `SPEC_KEYS` length vs the real specs | 21 keys, and all twelve `packages/*.json` at `CHAIN_REF` carry exactly 21 | - | the key-closure check is calibrated to the real shape |

---

## 1. BLOCKING

**None.** I looked hard for one. The four things that would have been blocking, and what I
measured instead:

* a guard clause whose removal turns nothing red - **none**, 26 of 26 killed, my sweep, my
  harness, section 6;
* the fence's real row green on this branch, which would mean something was softened - it is
  **red, nine paths, by name**, on my run as on the author's, section 4;
* a fixture row touching the real repository's refs - **none**, section 7 RX-REFS;
* a touched path outside the ticket's owned list, or a `rebuild.yml` insertion between base
  `:233` and base `:305` - **neither**, section 3.

## 2. NOTES

### N1. The report's STOP-7 row claims a measurement that does not exist, and STOP-7 is the one STOP this round could not answer. CORRECT IT BEFORE THE PM RULES.

F.2 STOP-7 is, in its own words, "the fence cannot read the sealed artifact out of Git at
`CHAIN_REF` **on a GitHub runner** (for example the checkout leaves no
`refs/remotes/origin/...`)". Section 9's table answers it **"it can, measured on Windows and
on Linux (section 2.4)"**. Section 2.4 measures the PC and a farm scratch worktree. Neither
is a GitHub runner, and both are full clones that already carry the remote-tracking ref -
which is precisely the condition STOP-7 asks about. The author's own section 12.10 says the
opposite and says it correctly: "R1's STOP-7 half-answer is still the one thing to look for".

The two sentences cannot both stand in a document the PM rules from, and the STOP table is
the ruling surface. Nothing in the cell changes; one row of one table does. I would have it
read: *STOP-7: NOT ANSWERABLE OFF A RUNNER. The read works on the PC and on Linux; whether
`actions/checkout@v4` with `fetch-depth: 0` (`rebuild.yml:35`) materialises
`refs/remotes/origin/rebuild/t2-client-core` for a branch that is not the checked-out one is
measurable only on GitHub, and has not been. If it does not, row (4) fires and the step is
red on every push for a second reason, which is STOP-7's designed outcome and not a pass.*

I could not answer it either: `gh` is not on the PC's PATH and the farm has no network path
but `farm-sync.sh`. It stays open, as it did after R1.

### N2. Three measured paths where `fence()` THROWS instead of naming a refusal. Measured on BOTH operating systems.

D.2's governing property, which the author enforces everywhere else and which rows (4), (4b)
and (10) exist to hold, is that every outcome is a NAMED refusal and never a vacuous pass. In
three worlds it is a raw stack trace instead. I built all three as throwaway git repositories
and ran them against the shipped `fence()` unchanged, on the farm (Linux) and in my own
scratch worktree on the PC (Windows), with identical results:

| case | what happens |
|---|---|
| **the chain ref and HEAD have NO MERGE BASE** (unrelated histories) | `git merge-base` exits non-zero at `:151` and `execFileSync` throws: `Command failed: git -c core.quotepath=false merge-base refs/remotes/origin/rebuild/t2-client-core HEAD` |
| **a reseal child that DELETES `b-package.cjs`** | condition (4)'s FIRST limb (`:194`, "the diff touches the runner") is satisfied by the `D` record, and the SECOND limb (`:196`) then does `git show HEAD:<runner>` on a path HEAD does not carry: `Command failed: git -c core.quotepath=false show HEAD:rebuild/lanes/b/tooling/b-package.cjs` |
| **the artifact at the chain ref is not JSON** | `JSON.parse` at `:134` throws `Unexpected token 'o', "not json at all` |

**None of the three is a bypass.** The row fails, the step is red, no branch gets through -
and that is why this is a note and not a blocking finding. What is lost is the thing this
cell is FOR: a line a human can read in the CI log. Row (4b) exists because "the alternative
is a vacuous pass and D.2 refuses vacuous passes everywhere else"; the same argument, one
step weaker, applies to a stack trace.

The remedy is one clause and three rows, all inside the owned file: wrap the body of
`fence()` and map anything unexpected to a named `FENCE-INTERNAL <message>` that is a FAIL,
then give each of the three worlds above a row. I did not write it - the author is gone and I
commit only this file - but I measured that all three are buildable exactly as the existing
fixtures are built, which is the half of the question a reviewer can answer.

### N3. Condition (1) accepts a spec that arrived at status `A` by RENAME, not by authorship. Measured: NOT exploitable against today's chain, and I say why.

`:161` filters the diff for `status === "A"`, and `:155`'s `[RC]` split synthesises an `A`
record for the NEW path of a rename. So `git mv packages/S8.json packages/S10.json` presents
a spec file the branch did not write as an ADDED spec. I built it: the branch renames an
ancestor spec onto a new id, edits the runner stub to carry that id, touches a sealed path -
and **the fence SKIPS**, printing `FENCE-RESEAL-CHILD S10 ... stood aside`. Same result on
Windows and on Linux.

**It is not a hole today and here is the measurement rather than the reassurance.** For the
rename to buy the skip, the renamed spec must already satisfy condition (2): its
`parent.chosen` option must name the artifact the fence reads at `CHAIN_REF` - the numeric
maximum, today `rebuild/m4/spec/acceptance-s8-real-shape.json` - with that artifact's exact
sha256. I walked all twelve `packages/*.json` at `CHAIN_REF` and asked each one:

```
B-NTC -> acceptance-native-carriers.json          H3 -> acceptance-b-ntc-...json
S3 -> acceptance-h3-clean-init.json               S4 -> acceptance-s3-companion.json
S5 -> acceptance-s4-real-day.json                 S6 -> acceptance-s5-today-child.json
S7 -> acceptance-s6-today-child.json              S8 -> acceptance-s7-port-admission.json
B1 B2 B3 B4 -> parent.chosen names no option at all
MATCHES THE TOP ARTIFACT: none of the twelve
```

A child's spec names its PARENT's artifact by construction, and the top artifact is its
parent's successor, so the two can never coincide on a sealed chain - which is the same
structural fact the author measured from the other end in row (8g). The fence is held here by
the chain's shape, not by a clause. **That is worth one sentence in the cell and one row**
(a renamed ancestor spec does not earn the skip), for the same reason R3 N4's sentence is in
D.2: a reader of condition (1) would believe the branch had to write the file.

Related and smaller: `:164`'s "exactly one" counts only status `A`, so a branch adding one
spec AND renaming another onto a second id presents two and is refused at (1). Good.

### N4. The verified skip returns BEFORE the artifact-tamper check AND before the sealed-path loop, and the report does not say what that buys a verified child.

`:202` returns from inside the reseal-child block. Everything after `:205` - the
`FENCE-INVENTORY-DIFFERS-FROM-CHAIN` check and the whole `FENCE-SEALED-PATH-TOUCHED` loop -
is skipped. D.2 sanctions this ("the two rules do not collide"), so it is not a defect, but
two consequences are unsaid:

* a verified reseal child may **edit or delete the chain's sealed artifact in its worktree**
  and the fence says nothing. I built it: a child that satisfies all five conditions and also
  widens `released` in its worktree copy of the chain artifact **SKIPS**, with no
  `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`. Condition (2) binds the spec to the sha the FENCE
  measures at `CHAIN_REF`, never to the worktree, so the tamper buys the child nothing here -
  but the cell that exists to notice artifact tampering does not notice it;
* the same return also skips the sealed-path loop over `rebuild/lanes/b/tooling/packages/*.json`,
  which are EXECUTION PINS (measured: `packages/S8.json` is one of the three exec-only keys).

Both are the right behaviour under D.2 and both are load-bearing for whoever reads the CI log
of a real S9 run. The honest sentence is: **a verified reseal child is fenced by the seal and
by `fidelity()`, and by this cell not at all.** That is D.2's own "what actually holds this
gate" paragraph carried one step further, and it belongs in the cell's header.

### N5. `-c core.quotepath=false` closes the non-ASCII case and NOT the general one. Measured, and it is Linux-only.

R1 BLOCKING-C got the fix right for the case it named. I measured what is left, in a
throwaway repository, git 2.43:

```
default:              M "d/caf\303\251.mjs"   M "d/qu\"ote.mjs"   M "d/ta\tb.mjs"   M d/two words.mjs
quotepath=false:      M d/cafe.mjs (real byte) M "d/qu\"ote.mjs"  M "d/ta\tb.mjs"   M d/two words.mjs
-z:                   every record unquoted, including the quote and the tab
```

So a path carrying `"` or a TAB is still quoted, and a TAB additionally breaks the
`split("\t")` at `:154` so `parts[1]` is a truncated path. Either way the string never equals
an inventory key and the touch is invisible. **Unreachable today**: no sealed path carries
either byte, and Windows forbids both in a filename, so this is a Linux-and-macOS-only shape.
Row (1d)'s comment says the lookup is byte-exact on purpose; what it does not say is that the
BYTES IT COMPARES are git's rendering, not the path. `-z` is the complete answer and it costs
per-record field counting (with `-z` a rename is three NUL fields and everything else two,
which is presumably why it was not used). One sentence, or `-z`; I would take the sentence.

### N6. H18b's `all.length === 48` binds the WHOLE of `REQUIRED_INPUTS`, not the 26 this ticket owns, and after S9 that is a live cost.

`package.test.cjs:210-:212` asserts the FULL list is 48 distinct literals. B.8 asks for "its
own literal list of the 26 `today/` entries"; the 48 count is the author's addition and it is
what makes `Hb-M4` (the 51/48 prose distinction) killable, so I would keep it. But the
consequence is not stated anywhere: **after S9 releases `build.mjs`, any lane that adds a
required input OUTSIDE `today/` - an `m4/workout` module, a `w6` host - turns this SEALED
`today/` cell red, and the repair is an edit to a sealed file, which needs a reseal child.**
That is `build.mjs` released in name and its input list sealed in fact. It may be exactly
what A.4 law 2 wants; it is not what a reader of "released" expects, and the S9 brief should
carry the sentence.

### N7. H18b's per-line extraction would count a prose string that sits alone on its own line inside the block.

`:198`'s rule is `/^\s*"([^"]+)",?\s*$/`, and the comma is optional. It is correct today - I
re-derived 48 and the today/ 26 with the same rule and got the author's numbers - but it is
correct because no prose line in `REQUIRED_INPUTS` happens to be a bare quoted string on its
own line. If one ever is, H18b counts 49 and goes red naming a number, not a path. Cheap
hardening (require the comma, or require the literal to start `rebuild/`); cheaper still, one
sentence saying the rule is the file's shape and not a parser.

### N8. The author's own H18 mutation row `Hb-M5` understates what I measured.

12.6 records `Hb-M5` (a `today/` entry RENAMED inside `REQUIRED_INPUTS`, count still 48) as
turning **H18 and H18b** red. I re-ran it on Linux at the shipped head: **13 tests, 0 pass,
13 fail.** The rename makes `buildToday()` throw in `before()`, so the whole file errors and
nothing names a path. That is N3 of R1 ("if `buildToday()` throws, H18 says nothing at all")
happening in the author's own mutation table, and it is a stronger statement of N3 than the
one 12.7 records ("STATED, not coded"). The conclusion does not change - the cell has teeth
on that mutation - but the failure a reader will see is not the one the table promises.

### N9. Section 7 of the report, headed "EVERY COUNT I MEASURED", is stale at the shipped head.

It says the fence cell is "20 rows, 19 green, 1 red" and `package.test.cjs` is "11 tests
before H18, 12 after". At `56e4808a` I measure **27 rows, 26 green, 1 red** and **13 tests**.
Section 12.8 carries the current numbers, so nothing is wrong in the report as a whole; but a
table titled "every count I measured" is the one a PM will quote. Re-point it or date it.

### N10. The PC worktree's `node_modules` are a junction CHAIN into another lane's worktree. REPORTED, not touched.

`%TEMP%\earned-s9b\node_modules` -> `C:\Users\joeym\Documents\prepledger-dev\node_modules`,
but `rebuild\m3\w5\node_modules` and `rebuild\m3\w6\node_modules` both point into
**`%TEMP%\earned-adm`**, another lane's worktree. My own scratch worktree had to copy that
shape to run the bar. If that lane removes its worktree, the today step and `local-import`
lose their dependencies on this branch, and the failure will read as a test failure. I
changed nothing and deleted nothing; the ticket says report it, so it is reported.

---

## 3. THE OWNED-FILES FENCE, AND THE `rebuild.yml` LINE NUMBERS

`git diff --name-status da9f8683 56e4808a` names exactly six paths:

```
M  .github/workflows/rebuild.yml
A  rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
A  rebuild/lanes/b/S9-PREP-CELLS-REVIEW-R1.md          <- R1's own file, R1's own commit
A  rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
M  rebuild/m3/w7-preview/measure/test/boundary.test.mjs
M  rebuild/m3/w7-preview/today/test/package.test.cjs
```

Every one is owned. Nothing from the wait list, no `rebuild/lanes/b/tooling/**`, no other
`CHILD_SPECS` cell, no product file - I checked `build.mjs` and `preview.css` byte-identical
at the head. Fourteen commits, each touching exactly ONE file; the two review files were
committed by their reviewers and by nobody else.

**`rebuild.yml`, by line number rather than by prose.** Two hunks against `da9f8683`:
`@@ -230,6 +230,21 @@` and `@@ -304,5 +319,23 @@`. The fence step's `run:` is at `:247`,
directly after the A1/A2/A3/A4 step whose `run:` is base `:232`. The passphrase step's `run:`
is at `:330` and the W6 step's at `:339`, after base `:306` and before "Report the evidence
boundary". **Nothing is inserted between base `:233` and base `:305`**, so the step another
lane is adding after base `:297` merges clean. Every new `run:` names files by exact path;
there is no glob anywhere in the three. E facts 21 and 22 re-measured at `da9f8683`:
`rebuild.yml` named `passphrase-normalize` zero times and `local-import.test.mjs` zero times.
The standing `--ci --package S8` step is untouched.

---

## 4. THE BAR, RE-RUN BY ME ON THE PC

`%TEMP%\earned-s9b` at `56e4808a`, pulled `--ff-only`, working tree clean before and after; I
edited nothing there but this file. Long runs through a `.cmd` with a log and a `.done` file.

| what | mine | the author's 12.8 | verdict |
|---|---|---|---|
| `b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | identical | CONFIRMED |
| the fence cell (step a) | **tests 27, pass 26, fail 1**, exit 1, 25.1 s | 27 / 26 / 1 | CONFIRMED |
| the whole today step (`rebuild.yml:232`, 17 cells) | **tests 684, pass 682, fail 2**, exit 1, **153.2 s** | 684 / 682 / 2, 153.7 s | CONFIRMED |
| the two failures | `boundary.test.mjs P-MEASURE (g)` ("an S4-sealed file drifts...") and `setup.test.mjs re-pin` ("a file the B-NTC artifact pins moved on disk...") | the same two | CONFIRMED, pre-existing |
| step b, the three passphrase cells | **20 / 20 / 0**, exit 0 | 20 / 20 / 0 | CONFIRMED |
| step c, `rebuild/m3/w6/test/local-import.test.mjs` | **22 / 22 / 0**, exit 0 | 22 / 22 / 0 | CONFIRMED |
| the lane C step (base `:306`) | **9 / 9 / 0**, exit 0 | 9 / 9 / 0 | CONFIRMED |

**No re-run was needed anywhere.** Nothing was green once and red once, on either machine,
so nothing in this round is reported as timing.

**THE MEASURED REFUSAL OF THE REAL ROW ON THIS BRANCH, mine, on Windows:**

```
THE REAL ROW - this branch touched no sealed path the chain has not released
AssertionError: this change drew 9 refusal(s), 9 of them sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at
  refs/remotes/origin/rebuild/t2-client-core (753ba87018085aa4429d555d6ad8a8c346fe370e)
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

**The same nine paths, path for path, as R1's and as the author's.** It is
`FENCE-SEALED-PATH-TOUCHED` and not `FENCE-RESEAL-CHILD-UNVERIFIED`, which is right: this
branch carries no `packages/S9.json` and therefore makes no reseal-child claim at all. No
skip, no environment switch, no branch-name test exists anywhere in the file - I grepped for
`process.env` and for the branch name and there are none.

**N10 demonstrated itself a third time.** R1 read `1d70b62`, the author read `bd3ca328`, my
farm run read `70113da5` and my PC run read `753ba870`, all on the same commit. Four fetches
of a remote-tracking ref, four commits, **one answer and the same nine paths**. That is the
best evidence in the round that the line is worth its characters.

**On the runner's refusal, and I put it where the author does.** `--ci --package S8` prints
`SEALED-PROFILE-RECOMPUTATION` with local diagnostics withheld, and it prints exactly that
whether nine sealed files moved or none. So on a reseal-child branch that has not yet written
its own package, D.1's "`rebuild.yml:150` is the real teeth today" is **not true**, and the
fence is the only thing in CI that can name the nine paths. F8 is confirmed and it is the
strongest argument in the round FOR the cell.

---

## 5. RED FIRST, CHECKED OUT AND RE-RUN IN A SCRATCH WORKTREE OF MY OWN

`%TEMP%\s9b-rev2`, `git worktree add --detach`, `node_modules` junctioned the way
`%TEMP%\earned-s9b` has it (`dir /AL` showed the three targets), NO private junction, removed
at the end.

**The fence.** `eee12067` is the RED commit and it is not a stub: it carries the WHOLE row
set against the fence D.2 v1 actually described - one that reads the inventory from the
worktree, has no artifact-tamper check, no ambiguity check and no reseal-child gate.

```
eee12067 (RED)    tests 20, pass 6,  fail 14   <- D.2 (6) is the FIRST row in the file and it is RED
5738a965 (GREEN)  tests 20, pass 19, fail 1    <- the one red is THE REAL ROW, as designed
```

Row (6) - the worktree-artifact tamper - is literally first in the file and red at the red
commit, which is what the ticket asked for and what proves the fence is not self-certifying.
I also note, in the author's favour, that row (8g)'s TITLE changed between the red commit
("...so it still SKIPS") and the shipped file ("...and condition (2) refuses anyway:
measured"): the author expected a skip, measured a refusal, and rewrote the row to assert
what the fence as specified actually does rather than bending the fence. That is F3, and it
is the right way round.

**`boundary.test.mjs` / C.2, measured OFF this branch because on this branch it cannot be
measured at all.** F7 is correct and I reproduced the reason: `P-MEASURE (g)`'s assert at
`:138` is already red over the carried lanes' drift, so execution never reaches the
`P3_IMPORT_UI_2_UNSEALED` loop. I appended one byte to `preview.css` at `da9f8683` and at
`01918083` and got the SAME failure both times, from the earlier assert, with `preview.css`
not even in its list. So I re-measured at the chain tip (`70113da5`) in a farm scratch
worktree, four runs:

```
chain tip, untouched:                            tests 6, pass 6, fail 0
chain tip, one byte appended to preview.css:     tests 6, pass 5, fail 1
   "rebuild/m3/w7-preview/today/preview.css is moved by P3-IMPORT-UI-2 and no declaring
    spec names the bytes it stands at"                         <- that is :188-:189, by name
chain tip, same byte, this branch's boundary.test.mjs applied: tests 6, pass 6, fail 0
chain tip, same, with :186's Object.hasOwn flipped to true:    tests 6, pass 5, fail 1
   "rebuild/m3/w7-preview/today/preview.css IS pinned by S4 after all, so it belongs in
    the sealed set above, not here"                            <- the KEPT assert, with teeth
```

**All four lines reproduce the author's section 4.1 exactly.** C.2 is honoured to the letter:
only `shaOf(f) === declaredPost(f)` goes; the constant, the loop and the `Object.hasOwn`
assert stay, and the fourth line is the proof the survivor is not decoration. E fact 12's
`'S9'` is the LAST element of `CHILD_SPECS` and the loop is a reverse walk, so it is consulted
first - R4 N7's consequence, and the comment now carries it (R1 N11, fixed).

**H18.** See section 6.2; the hole, the red and the green all reproduce.

---

## 6. THE MUTATION TABLE, RE-MEASURED WITH MY OWN HARNESS

### 6.1 The fence: I reproduce 26 of 26, and I did it blind of the author's table

Method, and it is mine, not the author's: a script replaces ONE clause of the SHIPPED
`fence()` by string substitution, runs the whole file with THE REAL ROW cut off (so the
baseline is all green), and diffs the per-row pass/fail map against the unmutated baseline.
"SURVIVED" means not one green row changed colour. Harness at
`/home/claude/farm/scratch/b-r2/mutate.mjs`, outside the repository, pushed nowhere.
**Baseline: 26 rows, 26 green.**

| # | mutation | verdict | newly red |
|---|---|---|---|
| M1 | the `FENCE-CHAIN-REF-ABSENT` guard removed | KILLED | (4), (10) |
| M2 | LEXICAL maximum instead of numeric | KILLED | (7), (7b) |
| M3 | the `FENCE-AMBIGUOUS-INVENTORY` refusal removed | KILLED | (7b) |
| M4 | the inventory read from the WORKTREE (falling back to the ref) | KILLED | (6), (6b) |
| M5 | the `FENCE-INVENTORY-DIFFERS-FROM-CHAIN` refusal removed | KILLED | (6), (6b), (6c) |
| RX7 | the `worktree === null` limb removed | KILLED | (6c) |
| M6 | the `released` block ignored | KILLED | (2), (7), (12) |
| M7 | `product` only, `executionPins` dropped | KILLED | (1b) |
| M8 | a deletion does not count as touching | KILLED | (1c), (1e) |
| M9 | condition (1) "exactly one added spec" removed | KILLED | (8a) |
| M10 | condition (2) artifact-path equality removed | KILLED | (8b) |
| M11 | condition (2) sha256 equality removed | KILLED | (8c) |
| M12 | condition (3) removed | KILLED | (8h) |
| M13 | condition (4) first limb removed | KILLED | (8d) |
| M14 | condition (4) second limb removed | KILLED | (8d) |
| M15 | condition (5) ancestor test removed | KILLED | (8f) |
| M16 | v2's gate: skip on the mere presence of an added `packages/*.json` | KILLED | (8e) and seven more |
| M17 | `--name-only`: the status letter lost | KILLED | (1c), (1e) and nine more, (8i) among them |
| RX2 | two-dot diff from the chain ref instead of the merge base | KILLED | (9) |
| RX5 | `FENCE-NO-INVENTORY-AT-CHAIN-REF` removed (return pass) | KILLED | (4b) |
| RX4 | `core.quotepath=false` dropped | KILLED | (1d) |
| RX1 | the rename/copy split's NEW path never read | KILLED | (1e) |
| RXN2 | the ENOENT limb of `chainRefRefusal` removed | KILLED | (10) |
| RXN7 | `refusalLine` counts every refusal as a sealed-path touch | KILLED | (6c) |
| RXN10 | the chain ref's commit dropped out of the failure line | KILLED | (6c) |
| RXN8 | the sealed lookup case-folded | KILLED | (1d) |

**26 mutations, 26 killed, none surviving, measured independently.** The five R1 called out
(RX2, RX5, RX4, RX1, RX7) are each killed by exactly the row the fix round added for it, and
RXN8 - the one the author reports as having survived his own FIRST sweep - is killed by row
(1d)'s case half. My newly-red sets agree with 12.5's row for row, including the two the
author flagged as differences (M4 no longer reddens (8g); M16 reddens eight).

**On method, in the author's favour.** 12.5 says the harness mutates the SHIPPED cell and
diffs the whole row map. Mine does the same thing written from scratch, and it lands on the
same twenty-six. That is the claim R1 rejected the round over, and it is now true.

### 6.2 H18 and H18b, re-measured

`build.mjs` mutated in a farm scratch worktree and restored with `git checkout --` each time;
`git status` clean after.

| mutation | H18 | H18b | verdict |
|---|---|---|---|
| nothing | green | green | baseline, 13 tests, 13 pass |
| `reading-host.mjs` DELETED from `REQUIRED_INPUTS` | **RED**, naming the path | **RED** | B.8's whole point, reproduced |
| a 27th `today/` entry ADDED (`today-entry.mjs`) | green | **RED** | R1 BLOCKING-D's hole, closed, and H18b is the only thing that sees it |
| a `today/` entry RENAMED inside `REQUIRED_INPUTS`, count still 48 | see N8 | see N8 | the whole file errors; stronger than the table says |

**AND THE HOLE ITSELF, WHICH IS THE THIRD CLAUSE OF B.8's ROW AND THE ONE THAT JUSTIFIES THE
HUNK.** I ran the 25 other cells under `rebuild/m3/w7-preview/**/test/` (every `*.test.*` in
the four test directories except `package.test.cjs`) with and without the same deletion, on
Linux at the shipped head:

```
unmutated:                              tests 705, pass 698, fail 7
reading-host.mjs deleted from the list: tests 706, pass 699, fail 7
the SEVEN failing tests are the SAME seven, by name, in both runs
```

Seven, not two, because five of them are farm-environment failures in the import cells and
`journey.test.mjs`; the other two are the pre-existing `P-MEASURE (g)` and `re-pin` pair. The
point is unchanged and it is measured rather than argued: **deleting a `today/` entry from
`REQUIRED_INPUTS` turns NOTHING red anywhere under `w7-preview/**/test/` except the cell this
ticket added.** (Reported as measured: the total moved by one test and one pass between the
two runs, on a farm shared with another lane at the time; no failure changed.)

I also re-derived the 26 and the 48 from `build.mjs`'s source with my own extraction and
compared the cell's literal list to the today/ half as a SET: **equal, 26 for 26**, no
duplicates on either side. So the literal was measured and not copied, exactly as B.8 asks.

---

## 7. THE BLIND ATTACK PLAN, RUN AS REAL CASES

Written in the farm at `da9f8683` without sight of the build, then run as real rows in
throwaway git repositories against the SHIPPED `fence()` unchanged: a scratch copy of the
cell with the real row cut off and my rows appended, on Linux in a farm scratch worktree and
on Windows in my own worktree. Nothing of mine is in the repository; the scratch files were
deleted and `git status` is clean in both places.

| case | covered by the build? | what I measured |
|---|---|---|
| A1 widen `released` in the worktree, then touch | row (6) | FAILS twice over. The row is literally first in the file |
| A2 drop the path out of `product` instead | row (6b) | same two refusals, and it IS a row and not a clause |
| A3 empty / non-spec `packages/S10.json` | row (8a) | `FENCE-RESEAL-CHILD-UNVERIFIED (1)` |
| A4 five rows, one per omitted condition, **condition (5) included** | rows (8a)(8b)(8c)(8d)(8f) | all five present; (8f) is the condition-(5) row I asked for and it was not in D.2's list |
| A5 two `packages/*.json` at status `A` | row (8a), last sub-row | present, and the sub-row uses TWO specs that would EACH pass alone, which is the only way the clause is testable |
| A6 seven ancestor specs at `M` plus one `A` must SKIP | row (8i) | SKIPS. This is the row that proves `--name-status` was not swapped back; M17 reddens it |
| A7 **rename of a sealed file** - my strongest blind case | row (1e) | BOTH ends checked: `D` on the old path, `A` on the new. I built the ONTO half myself as well and it is refused |
| A8 **mode-only change** (`chmod +x`) | no row | I built it: `git diff --name-status` prints `M`, the fence FAILS naming the path. Correct, unrowed, Linux-only |
| A9 **non-ASCII / quoted path** | row (1d), and see N5 | non-ASCII closed; `"` and TAB are not - measured, unreachable today |
| A10 **space in a path** | no row | I built it: unquoted, the `\t` split survives, the fence FAILS naming it. Correct, by luck, and N5 says so out loud |
| A11 **case-different path** | row (1d), case half | PASSES, on Windows too, and RXN8 reddens it. The row is built without a case-only rename, which is the only way it can run on both systems - that is a good piece of work |
| A12 **chain ref repointed at an unrelated commit** | no row | I built it: the fence does NOT fall back to `refs/heads` or to the worktree. It refuses. There is no fallback anywhere in the file |
| A13 **detached HEAD** | no row | I built it: PASSES, not refused. `merge-base` is happy. Shallow clone is row (4) |
| A14 **two-dot vs three-dot** | row (9) | the branch merely BEHIND passes, and the row asserts the fixture really builds that world before it trusts the answer |
| A15 **merge the chain tip in** | no row | I built it, on BOTH systems: the merge base moves to the tip and the branch's own sealed touch is STILL refused. **Merging does not launder the diff.** Worth a row |
| A16 `acceptance-s09-x.json` parses as 9; a `.json.bak` is not an artifact | row (4b) has the `.bak` half | I built the `s09` half: `FENCE-AMBIGUOUS-INVENTORY` naming both, and the `.bak` is not parsed |
| A17 **an execution pin that is not a product pin** | row (1b) | FAILS naming it. And `inv.released` is `undefined` in the real S8 artifact: `|| {}` is why the fence names a refusal instead of throwing a TypeError. That was my worry and it is handled |
| A18 **git missing** | row (10) | `FENCE-GIT-UNAVAILABLE`, from a REAL ENOENT, and the fence never passes |
| A19 **fixture hygiene** | - | every fixture is `os.tmpdir()` + `mkdtemp`, sets its own `user.name`/`user.email`/`core.autocrlf`/`commit.gpgsign`, makes its OWN `refs/remotes/origin/...` with `update-ref`, and is removed in `after()`. I asserted `git show-ref` over the REAL repository before and after the whole run: **byte-identical**, and the real worktree was not dirtied |
| A20 **byte handling** | - | `git` is read with `encoding: "buffer"` and the comparison is `Buffer.equals`. The `.gitattributes` dependence is real, the file is in NEITHER S8 map, and section 2.4 says so |
| B1-B4 H18's halves | section 6.2 | B4's gap ("an added entry is invisible") is CLOSED by H18b, which is exactly what I asked for and better than the count I proposed |
| B5 the honest limit of H18 on a reseal child | 12.7 N5 | STATED. And see my N6, which is the same shape one step further out |
| B6 `buildToday()` throws | 12.7 N3 | STATED, not coded; H18b does not depend on `result`, H18 does. See my N8 for it happening live |
| B7 the stale header sentence inside a file S9 seals | R1 N4 | FIXED in the same hunk |
| C1-C5 `boundary.test.mjs` | section 5 | all four lines reproduce, including the `Object.hasOwn` mutation control |
| D1 the three `rebuild.yml` steps by LINE NUMBER | section 3 | verified by hunk header, not by prose |
| D2 `CHILD_ROOTS` | - | `rebuild/m3/w6/test/` present at `:405`; `rebuild/lanes/c/ui-port/` absent and on the wait list (E fact 3), the same shape the existing lane C step already has |
| D3 the fence must NOT be in `TOOLING_FILES` | - | it is not, and it is not in the S8 `product` map either. B.8's last paragraph honoured |
| D4 the real row must be RED on this branch | - | **RED, nine paths.** Nothing was softened |

**Five attacks were not in D.2's list and not in the cell: A8, A10, A12, A13, A15.** All five
behave correctly. Four of them (A8, A12, A13, A15) deserve rows, and A15 most of all: a
reader will assume merging the chain in launders the diff, and the row is what says it does
not. **None of the five is a finding; all five are cheap insurance against the next edit.**

---

## 8. EVERY R1 FINDING: FIXED, STILL OPEN, OR DISPUTE UPHELD

I did not take the report's word on any of these. Each verdict below is backed by my own
mutation sweep (section 6.1), my own bar (section 4) or my own reading of the tree.

### The four BLOCKING

| R1 | my verdict | my evidence |
|---|---|---|
| **BLOCKING-A** the `merge-base` clause is untested and the world it guards is live | **FIXED** | row (9) exists, asserts the fixture really builds the world (the two-dot diff DOES name the sealed paths, the merge-base diff does not) before it trusts the answer, and asserts `r.touched === 1`. My RX2 mutation (two-dot from the chain ref) reddens (9) and nothing else |
| **BLOCKING-B** `FENCE-NO-INVENTORY-AT-CHAIN-REF` has no row; its removal is a VACUOUS PASS | **FIXED** | row (4b) exists, and it carries the file-name rule too (`acceptance-s8-old.json.bak` is not parsed). My RX5 mutation (return pass) reddens (4b) |
| **BLOCKING-C** three more clauses survive, and section 6's method claim is not true of them | **FIXED, all three** | RX4 (quotepath) reddens (1d); RX1 (the rename split's second half) reddens (1e); RX7 (the `worktree === null` limb) reddens (6c). I built the rename ONTO half as an attack of my own and it is refused at status `A`, so `parts[2]` really is load-bearing and really is asserted. The method claim is now true: I re-ran the whole sweep and 26 of 26 die |
| **BLOCKING-D** F1 routes a `build.mjs` edit on a premise R1 measured to be false | **FIXED, and F1 RETRACTED in its load-bearing half** | I re-measured both halves myself: `REQUIRED_INPUTS` is NOT exported (F1's surviving half stands, and the author kept it), and `build.mjs` carries more than the `:44` re-export line. H18b closes the completeness half **inside the owned file with no `build.mjs` edit**, and my own H-M1b measurement confirms it is the only thing that sees an ADDED entry. Nothing is routed to the PM that should not be |

### The twelve notes

| R1 | state | my verdict |
|---|---|---|
| N1 an array-valued `released` is silently lost, fails CLOSED | FIXED with row (12) | **CONFIRMED.** M6 reddens (12); the row measures the SHAPE by pairing it with the same inventory in E fact 15's shape |
| N2 `git` missing reads as `FENCE-CHAIN-REF-ABSENT` | FIXED with row (10) | **CONFIRMED.** Row (10) uses a REAL ENOENT from the same API rather than unsetting PATH, which is the right way to build it. RXN2 reddens it |
| N3 if `buildToday()` throws, H18 says nothing | STATED, not coded | **STILL OPEN, and I accept the reason.** Changing `before()` touches four other lanes' rows in a sealed file. H18b does not depend on `result`; H18 does. My N8 is this note happening live inside the author's own mutation table |
| N4 the header carries a false sentence inside a file S9 SEALS | FIXED | **CONFIRMED**, in the same hunk, so the seal does not carry the lie |
| N5 the honest limit of H18 is not stated | STATED | **CONFIRMED**, and my N6 is the same shape one step further out |
| N6 a stale entry reads as the wrong failure | FIXED | **CONFIRMED.** H18's message now names both readings and points at H18b |
| N7 the real row's message miscounts | FIXED with a row | **CONFIRMED.** `refusalLine()` counts touches separately and row (6c) is the mixed result that measures it. RXN7 reddens (6c) |
| N8 byte-exactness has no row | FIXED with two sub-rows | **CONFIRMED, and this is the best fix in the round.** The case half is built WITHOUT a case-only rename - the sealed key is a spelling the tree never carries - so it runs identically on both systems. RXN8 reddens it. The author reports that this mutant survived his FIRST sweep and names the sweep that caught it; that is the right way to report a surviving mutant |
| N9 the cross-OS correctness rests on an UNSEALED file | SAID OUT LOUD | **CONFIRMED by my own measurement**: `.gitattributes` is in neither S8 map. It is a fact for the PM and nothing in this ticket can seal it |
| N10 the chain ref is remote-tracking and only a fetch moves it | FIXED with a row | **CONFIRMED, and demonstrated a third and fourth time** - four different chain commits across R1, the author, my farm run and my PC run, one answer. Section 4 |
| N11 the `'S9'` comment does not carry R4 N7's consequence | FIXED | **CONFIRMED.** The comment now says `declaredPost` lands on S9's post and no longer on S8's `dc9a826e`, and that F.1 R18's red arrives one package sooner |
| N12 C.2 asked for one comment line and the hunk is thirteen | RECORDED FOR THE PM | **DISPUTE UPHELD, and I would go further: keep them.** I read all thirteen and they are all true and all load-bearing. The file's own house style is eleven-line package comments. Neither author nor reviewer should rule this and neither has |

**Nothing the fix round did was a softening.** I diffed `576be648..56e4808a` for removed lines
across all four code files: every removal is replaced by a stronger form, and
`.github/workflows/rebuild.yml` is **byte-identical** across the whole fix round. No
assertion was deleted, no claim narrowed, no skip added.

---

## 9. WHAT I TRIED TO BREAK AND COULD NOT

Said plainly, because a review that only lists what is wrong tells the PM nothing about how
hard the thing was pushed.

1. **I could not make the fence PASS for a branch that touched a sealed path.** Eleven
   attacks, five of them outside D.2's list. Every one refused.
2. **I could not make the fence read an inventory the branch controls.** Widen `released`,
   drop the path out of `product`, delete the artifact outright - all three refused, and the
   third only because of the `worktree === null` limb R1 found and the fix round rowed.
3. **I could not launder the diff by merging the chain tip in.** The merge base moves to the
   tip and the branch's own sealed touches are still in the diff. Both systems.
4. **I could not find a fallback.** There is no `refs/heads`, no worktree read of the
   inventory, no `process.env`, no branch-name test and no CI-detection anywhere in the file.
   A repointed chain ref refuses; it does not degrade.
5. **I could not get a fixture row to touch the real repository.** `git show-ref` over the
   real repository is byte-identical before and after the whole run, and the real worktree
   was not dirtied. Every fixture is its own `git init` under `os.tmpdir()`.
6. **I could not earn the reseal-child skip with any of the five conditions missing**, and
   the rename route (N3) is closed by the chain's own shape, which I measured rather than
   assumed.
7. **I could not find a softening in the fix round.** No assertion deleted, no claim
   narrowed, `rebuild.yml` byte-identical, and the real row still red by name.
8. **I could not find a count the author copied instead of measuring.** 48, 26, 224, 71, the
   three exec-only keys, the zero occurrences of the two CI homes, `CHILD_ROOTS` at `:405`,
   the `.gitattributes` absence - I re-derived all of them and they are all right.

## 10. STOP CONDITIONS (F.2), MY READING

| STOP | my reading |
|---|---|
| 1, 3, 5, 9, 10, 11 | not this ticket's business, and nothing in the branch touches them |
| 2 a hunk touches `held()`, the drift assert or the completeness walk | **did not fire.** No byte of `b-package.cjs` is in the diff |
| 4 a cell over a released file cannot be re-homed honestly | **did not fire**, and section 5's four lines are why: the byte pin goes, the live guard stays and still has teeth |
| 6 H18 cannot be written to go red on a deleted entry | **did not fire.** Measured, section 6.2 |
| **7 the fence cannot read the artifact out of Git at `CHAIN_REF` ON A RUNNER** | **STILL OPEN. See N1.** It is not answered and the report should not say it is |
| 8 the skip cannot be derived from the chain | **did not fire.** Eleven rows, five conditions, default FAIL, and M16 measures what v2's gate would have cost |

**And the ticket's own STOP conditions:** no design in D.2 failed to build on both operating
systems (I ran the fixture rows on both and they agree row for row); I needed no edit to a
file outside the owned list; nothing was loosened to go green.

## 11. WHAT I DID NOT VERIFY

* **GitHub CI on ubuntu-latest and windows-latest.** The both-OS evidence of record, and I
  could not reach it: `gh` is not on the PC's PATH and the farm's only network path is
  `farm-sync.sh`. **STOP-7 lives here** and N1 is about the report saying otherwise.
* Anything on the wait list: `packages/S9.json`, the needles, the `acceptance-s9` artifact,
  the `--ci --package S9` walk, the standing step's flip, PACK-PIN, APPROVED-PIN,
  `design.test.cjs`, the S9 brief, the token lines. The fence's real row turning into a
  verified SKIP is therefore an ARGUMENT in this round and not a measurement; I read the five
  conditions against this branch by hand and I believe it, but nobody has run it.
* The three passphrase cells and `local-import.test.mjs` **as cells**: run and counted, not
  reviewed. Other lanes' accepted work.
* Whether the S9 sealer emits `released` as an object. Row (12) states the direction the
  fence fails in if it does not, and that is the most a cell can do from here.
* The seven `w7-preview` cells that fail on the farm for environment reasons; I used the PC's
  today step as the bar of record and only the farm for deltas.

---

Reviewer: cowork (Earned lane hand), lane B, ticket S9-PREP-B, round 2, independent, told to
disagree. **ACCEPT WITH NOTES.** Four R1 BLOCKING findings fixed and re-verified by my own
mutation sweep; 26 of 26 clause mutations killed; red first proved by checkout; the bar
reproduced number for number on the PC; eleven attacks and no bypass. Ten notes, of which
**N1 is the one to act on before the PM rules** and **N2 is the one to act on before the next
person reads a CI log.** I committed this file and nothing else.
