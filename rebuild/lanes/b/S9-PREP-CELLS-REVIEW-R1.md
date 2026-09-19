# S9-PREP-CELLS REVIEW R1 - independent review of the fence, H18, the C.2 edit and the CI homes

Reviewer: cowork (Earned lane hand), independent, told to disagree where the evidence lets me.
Author head reviewed: `576be6488106a04dee6a755d4c3a33ad26b706ee` on `rebuild/b-s9-prep-cells`.
Branch base `da9f8683`. Design of record `S9-RELEASE-SPEC.md` (v4) with `-REVIEW-R4.md` standing.

Method: I read the diff in the farm against `da9f8683` file by file, and the fence line by line
against spec D.2, BEFORE opening `S9-PREP-CELLS-AUTHOR-REPORT.md`. I then re-ran the whole bar on
the PC in `%TEMP%\earned-s9b`, checked out the red commits in a scratch worktree of my own, re-ran
the author's mutation table and added my own, and ran a blind attack plan written in the farm at
`da9f8683` as real cases in throwaway git repositories. Everything below that says "measured" was
run by me.

---

## VERDICT: REJECT

Not because anything in this build is wrong. I could not make the shipped `fence()` give a wrong
answer in twenty attacks, and every number in the author's report that I re-measured reproduced,
including the nine-path refusal of the real row path for path on Windows AND on Linux, the 20/6/14
red at `eee1206`, and 26 of 48.

I reject on the EVIDENCE, on the ticket's own rule that a guard clause whose removal turns nothing
red is blocking. **Five explicit guard clauses of `fence()` survive removal with not one row going
red**, and none of the five is in the author's mutation table, whose method paragraph says it
"takes each guard clause of `fence()` ... one at a time" and whose conclusion says "ALL SEVENTEEN
ARE KILLED". Seventeen were killed; the table is not the clause set. One of the five is the clause
that governs the NORMAL case (`merge-base`), and it is live TODAY, not later: the chain ref has
already moved eight commits past this branch's merge base. A sixth finding is a routing decision
the report sends to the PM on a premise I measured to be false.

These are cells that guard the sealed set. The PM reads them. Five rows and one retraction is a
short fix round, and the alternative is shipping a fence whose least tested clause is the one every
lane C branch will meet first.

---

## 0. WHAT I RE-MEASURED BEFORE OPENING THE REPORT

Written blind in the farm at `da9f8683`, so the attacks below are grounded rather than guessed.

| measurement | mine | the spec's / the report's |
|---|---|---|
| `REQUIRED_INPUTS` path literals | **48** | 48 |
| of them under `rebuild/m3/w7-preview/today/` | **26** | 26 |
| by root | 3 engine, 3 client, 1 coach, 8 m4, 7 other m3 | same five |
| quoted strings in `build.mjs:98-:201` | 49 double + 1 single + 1 backtick = **51**, three prose | 51, three prose |
| `acceptance-s8-real-shape.json` `product` / `executionPins` | **224 / 71**, both objects | 224 / 71 |
| a `released` key in the S8 artifact | **absent** | absent |
| execution-pinned but NOT product-pinned | **3**: `packages/S8.json`, `S8-REAL-SHAPE-BRIEF.md`, `today/test/catalogue.test.mjs` | not stated |
| the artifact's `packageId` / `lanePackage` | `M2-S8-REAL-SHAPE` / `S8` | F2, CONFIRMED |
| `.gitattributes` in either S8 map | **neither** | not stated |
| `build.mjs` blob at `da9f8683`, at the head and at the chain tip | `4cd76632`, **identical at all three** | "not edited by this ticket" |
| the cell's 26-entry literal against the today/ half of `REQUIRED_INPUTS` | **set-equal, exactly** | - |

The owned-files fence is clean. The diff against `da9f8683` touches exactly five paths and every
one of them is on the ticket's owned list: `.github/workflows/rebuild.yml`,
`rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md`,
`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`,
`rebuild/m3/w7-preview/measure/test/boundary.test.mjs`,
`rebuild/m3/w7-preview/today/test/package.test.cjs`. No wait-list file is touched. No file the
other lanes own is touched. No U+2013 and no U+2014 is authored anywhere in the diff (measured over
the added lines of all five files; the three in `package.test.cjs` are pre-existing).

The `rebuild.yml` placement holds, by line number and not by prose. Two hunks only,
`@@ -230,6 +230,21 @@` and `@@ -304,5 +319,23 @@`. On the branch the fence step is at `:246-:247`
directly after the today step's run line at `:232`; the passphrase step is at `:329-:330` and the
W6 step at `:338-:339`, both after the lane C run line (base `:306`, now `:321`) and before "Report
the evidence boundary" at `:340`. **Nothing is inserted between base `:233` and base `:305`**, so
the other lane's step after `:297` merges clean. The standing `--ci --package S8` step at `:150` is
NOT flipped.

---

## 1. BLOCKING

All five mutation results below were measured with a harness that replaces one clause of the
shipped cell, runs the whole file, and diffs the per-row pass/fail map against the unmutated
baseline. Baseline: 20 rows, 19 pass, THE REAL ROW red. "SURVIVED" means not one of the 19 green
rows changed colour.

### BLOCKING-A. The `merge-base` clause is untested, and the world it guards is LIVE TODAY

`sealed-inventory-fence.test.mjs:124` is
`const base = gitText(root, ["merge-base", chainRef, "HEAD"]).trim();` and `:126` diffs
`base..HEAD`. Replace `:124` with `["rev-parse", chainRef]`, the two-dot form D.2 does not ask for:

```
SURVIVED | RX2 two-dot diff from the chain ref instead of the merge base | newly red: NONE
```

Nineteen fixture rows and the real row all still pass, because in every fixture the chain ref IS
the merge base. Row (8g) is the only row where the chain advances, and it is refused at condition
(2) before the diff is ever read for refusals.

I built the missing world and measured it. A branch cut at the tip, touching ONE unsealed file,
with the chain then moving five commits that each move a sealed byte:

```
fence as shipped        -> pass []
two-dot diff would report 2 paths: M screens.template.html / M today-app.cjs
merge-base diff reports 1 path:    M screens.template.html
```

So the mutant is not equivalent: it turns a branch that is merely BEHIND into a red naming a sealed
path it never touched. The fence is being shipped red into CI already; a second, unexplainable red
on every lane C branch is exactly the failure mode D.2's "one sentence a human can read in the CI
log" exists to avoid.

**And this is not hypothetical.** Measured on the PC at the live chain ref `1d70b62`:

```
merge-base(refs/remotes/origin/rebuild/t2-client-core, HEAD) = ad8ced07
chain commits ahead of that merge base                       = 8
git diff --name-status <merge-base> HEAD -> 32 paths
git diff --name-status <chain ref>  HEAD -> 34 paths  (+ rebuild/DECISIONS.md, + rebuild/lanes/STATUS.md)
```

The two extra paths are unsealed today, which is the only reason the real row's answer is the same
under both forms. The chain moves a sealed byte on the next reseal.

**ASKED FOR:** the green control D.2 does not spell but its design requires, in the fixture shape
the file already has: a branch some commits BEHIND the chain, touching nothing sealed, PASSES; and
in the same row the sealed path the CHAIN moved is shown not to appear in the refusals.

### BLOCKING-B. `FENCE-NO-INVENTORY-AT-CHAIN-REF` has no row, and its removal is a VACUOUS PASS

`:109` is the author's own invented refusal (report F4), added because "the alternative is a
vacuous pass and D.2 refuses vacuous passes everywhere else". Measured:

```
SURVIVED | RX5 FENCE-NO-INVENTORY-AT-CHAIN-REF guard removed (return pass) | newly red: NONE
```

Row (4) covers the sibling case (`FENCE-CHAIN-REF-ABSENT`) and is killed by its mutation. This one
has nothing. The refusal is reachable in a real world, not only a synthetic one. I repointed the
chain ref at an unrelated commit:

```
A12 chain ref repointed to an unrelated commit
  -> fail [FENCE-NO-INVENTORY-AT-CHAIN-REF refs/remotes/origin/rebuild/t2-client-core:rebuild/m4/spec/]
```

Correct, named, no fallback to `refs/heads/...` and no fallback to the worktree. It is simply not
asserted anywhere. A cell whose whole argument is "never pass vacuously" must have the row that
says so.

**ASKED FOR:** one row. A chain ref whose `rebuild/m4/spec/` holds no `acceptance-s<N>-*.json`
FAILS by that name.

### BLOCKING-C. Three more guard clauses survive, and section 6's method claim is not true of them

```
SURVIVED | RX4 core.quotepath=false dropped                        | newly red: NONE
SURVIVED | RX1 the rename/copy split at :128 removed               | newly red: NONE
SURVIVED | RX7 the worktree === null limb of the tamper check removed | newly red: NONE
```

Each is load-bearing, and I measured what each holds.

**RX4, `:73`.** Without `-c core.quotepath=false` git octal-escapes and quotes a non-ASCII path:

```
DEFAULT (quotepath on):            M  "rebuild/m3/w7-preview/today/caf\303\251.cjs"
WITH -c core.quotepath=false:      M  rebuild/m3/w7-preview/today/café.cjs
```

The quoted string never matches an inventory key, so a sealed path carrying one non-ASCII byte
walks through. With the clause in place the fence refuses it, which I measured:
`fail [FENCE-SEALED-PATH-TOUCHED M rebuild/m3/w7-preview/today/café.cjs]`.

**RX1, `:128`.** The `[RC]` split turns `R100 old new` into a deletion of `old` plus an addition of
`new`. Report F5 states the reading as an author's decision. It is the right reading and nothing
asserts it. Measured against the shipped cell:

```
raw diff record: "R100\t.../today-app.cjs\t.../today-app2.cjs"
A7 rename of a sealed path -> fail [FENCE-SEALED-PATH-TOUCHED D .../today-app.cjs]
A11 case-only rename       -> fail [FENCE-SEALED-PATH-TOUCHED D .../today-app.cjs]
```

With the clause removed the old path is still read (at status `R`) but `parts[2]`, the NEW path, is
never looked at, so the half of F5's reading that says "a sealed path renamed ONTO is refused at
status A" is asserted by nothing at all.

**RX7, `:183`.** `worktree === null ||` is the only thing that notices a branch DELETING the sealed
artifact from its worktree. That deletion is invisible to `FENCE-SEALED-PATH-TOUCHED`, because D.2
itself records that the artifact is not a key of its own `product` map. Measured, shipped cell:

```
the sealed artifact deleted on the branch
  -> fail [FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s8-fixture.json]
```

Right answer, no row. With the limb removed it is a silent pass, and "delete the artifact, then do
as you like" is the same family of attack as row (6).

**And the claim.** Section 6's method paragraph says the harness "takes each guard clause of
`fence()` and of the H18 cell one at a time", and section 6.1 concludes "ALL SEVENTEEN ARE KILLED".
The seventeen are killed; I reproduced every one of M1 to M17 exactly as the table records them,
including the three the author added rows for. But five explicit clauses are not among the
seventeen, so the sentence claims a completeness the table does not have. In a report whose whole
value is that it says what it measured, that sentence should be narrowed to "the seventeen
mutations below" and the five rows added.

**ASKED FOR:** three rows. A non-ASCII sealed path refused by name; a rename of a sealed path
refused with BOTH the old and the new path examined; a branch that deletes the sealed artifact
refused by name.

### BLOCKING-D. F1 routes an edit to `build.mjs` on a premise I measured to be false

Report section 3.2 and finding F1 say the COMPLETENESS half of H18 cannot be had without exporting
`REQUIRED_INPUTS`, and route that one-line `build.mjs` edit to the PM as "the one edit outside my
owned list that this round wants".

The constant is indeed module-local at `build.mjs:98`. Everything else in F1's supporting sentence
is wrong or unnecessary.

1. **"there is no other constant export in the file" is false.** `build.mjs` carries eight
   `export const` declarations: `:35 SOURCE`, `:36 ROOT`, `:37 DIST`, `:38 SCRATCH`,
   `:41 SOURCE_REL`, `:43 ASSETS` (itself an `Object.freeze` array literal), `:72 IMPORT_ENTRY`
   and `:324 buildTagOf`. `:44` is a re-export line, not the file's only export.
2. **The completeness half closes inside the OWNED file, with no `build.mjs` edit at all.** The
   sealed cell can read `build.mjs` as SOURCE TEXT, the way `boundary.test.mjs` already reads
   repository files through `readRepo`. I wrote the hunk as a spike and measured it.

```
H18b spike, six lines inside package.test.cjs, tree untouched   -> 13 tests, 13 pass
a 27th today/ entry added to REQUIRED_INPUTS (today-entry.mjs,
  a real bundle input, so the build still succeeds)
     H18 as shipped                                             -> 13 tests, 13 pass   (the hole)
     H18b spike                                                 -> not ok 4, THE ONLY RED
an entry deleted from REQUIRED_INPUTS
     both H18 and H18b go red                                   -> 13 tests, 11 pass, 2 fail
```

The spike is: read `build.mjs`, take the `REQUIRED_INPUTS` frozen array literal, assert 48 path
literals, and `deepEqual` the `today/`-prefixed subset against `TODAY_REQUIRED_INPUTS`. It is the
same script the author used to MEASURE 26 of 48, moved inside the cell.

I am not saying the author's substitution is wrong. Asking `assertBundleInputs` for the refusal is
genuinely stronger than reading a list for the DELETION case, and I agree with section 3.2 there.
I am saying the two are complementary and the second one costs nothing outside the owned list, so
the PM should not be asked to decide on a released product file for it. **A.6 makes `build.mjs`'s
place on the closed list CONDITIONAL on H18 supplying the teeth; a finding that overstates what
H18 cannot do, in the report the PM reads to rule on that condition, is the wrong finding to get
wrong.**

**ASKED FOR:** F1 retracted to its true form (the constant is not exported, and here is what that
costs and what it does not), and the completeness assertion either landed in `package.test.cjs` or
declined with a reason that is not "it cannot be done here".

---

## 2. NOTES (not blocking)

**N1. A `released` block written as a JSON ARRAY is silently lost, and it fails CLOSED.** `:119` is
`new Set(Object.keys(inv.released || {}))`. E fact 15 describes an object keyed by path, so this is
not a defect today. Measured with an array-valued `released`: the fence refuses the released path
(`FENCE-SEALED-PATH-TOUCHED M preview.css`) rather than crashing or admitting it. Failing closed is
the right direction, but the S9 sealer is the thing that writes this key and nothing on either side
asserts its shape. One sentence in the cell, or one assert, would turn a mystery red into a named
one.

**N2. `git` missing from PATH is reported as `FENCE-CHAIN-REF-ABSENT`.** Measured: the fence never
passes (which is the property that matters, and the opposite of `build.mjs:350`'s "unknown"), but
the `:99` try/catch swallows ENOENT into the ref-absent name, so a runner with no git tells the
reader the chain ref is missing. A second refusal name, or narrowing the catch, is a one-line fix.

**N3. If `buildToday()` throws, H18 says nothing at all.** `package.test.cjs` builds once in
`before()`. Measured: adding a `REQUIRED_INPUTS` entry that names a file that does not exist makes
all 13 tests error with no refusal naming a path. That is a property of the file H18 joined rather
than of H18, and it is loud, but it means H18's guarantee is conditional on the build succeeding,
and the report does not say so.

**N4. The file's own header now carries a false sentence, inside a file S9 SEALS.**
`package.test.cjs:8-:9` says "It is NOT part of the root-lockfile CI job ... it is run on the PC
and reported there." `rebuild.yml:232` names it. S9 re-pins this file with a real post, so the seal
carries the sentence. Fix it in the same hunk or the seal preserves a lie.

**N5. The honest limit of H18 is not stated.** After S9, `build.mjs` is RELEASED and
`package.test.cjs` is SEALED, so editing both in one lane C commit is refused twice (by this fence
and by `UNLISTED-PRODUCT-DRIFT`). **But on the next reseal child both edits are legitimate and
nothing notices the law shrank**; the only guard is a PM reading a diff. A.4 says the first half in
one clause; nobody says the second. It belongs in this report beside F1.

**N6. A stale entry reads as the wrong failure.** If a `today/` module is renamed in `build.mjs`
and in the module tree together, H18 goes red naming the OLD path with the message "left
`build.mjs`'s REQUIRED_INPUTS: the build no longer refuses a bundle without it". The truth is "the
seal's literal is stale". The message is the first thing a future reader will meet and it points
the wrong way.

**N7. The real row's message miscounts.** `:599` builds
`"this change touched " + r.refusals.length + " sealed path(s)"`. `refusals` can also hold
`FENCE-INVENTORY-DIFFERS-FROM-CHAIN`, which is not a sealed-path touch. Today the count is right
because that refusal is absent; on the day it is not, the log line is wrong.

**N8. Byte-exactness has no row.** `sealed.has(t.path)` is a byte-exact Set lookup and that is
correct: I measured a case-only rename of a sealed path refused on Linux. Nothing stops a future
hand from "fixing" a Windows case complaint by lowercasing both sides, and no row would go red
(measured: SURVIVED). Worth one assertion or one comment line.

**N9. The cross-OS correctness of the artifact comparison rests on an UNSEALED file.** Report 2.4
cites `.gitattributes:12` and is right that it is what keeps `Buffer.equals` meaningful on a
Windows checkout. Measured: `.gitattributes` is in NEITHER S8 map. So an unsealed file holds the
fence's cross-OS correctness, and R4 N10 already had to correct one argument that leaned on that
file. Say it out loud in 2.4 rather than leaving it to be discovered on a Windows runner.

**N10. The chain ref the fence reads is a remote-tracking ref, and only a fetch moves it.**
Measured today: the PC's `refs/remotes/origin/rebuild/t2-client-core` was at `1d70b62` while the
farm's copy was at `70113da5`. In CI `fetch-depth: 0` makes it fresh. On a developer PC the fence
judges against whatever was last fetched, and says so nowhere. One line in the skip/failure output
naming the chain ref's commit would make the CI log and the local run self-describing.

**N11. The `'S9'` comment in `boundary.test.mjs` does not carry R4 N7's consequence.** The ticket
told the author to read N7 and the report records it correctly in section 4.2. The comment block in
the file explains the youngest-first walk but not the thing N7 is about: once `'S9'` is youngest and
S9 declares `today-app.cjs` `edited` with a real post, `declaredPost` lands on S9's post and not on
S8's `dc9a826e...`. That is a fact about THIS file's loop and it belongs in THIS file's comment,
which is the only place the next reader will look. (The fall-through itself is safe: `declaredPost`
already try/catches an absent or unparseable spec, measured.)

**N12. C.2 asked for "one comment line in their place"; the hunk is thirteen (report F6).** I read
the thirteen and they are all true and all load-bearing, and the file's own house style is
eleven-line package comments. I would keep them. Recorded so the PM rules rather than the author
and the reviewer each assuming.

---

## 3. WHAT I TRIED TO BREAK AND COULD NOT

Twenty attacks from a plan written blind in the farm before I saw the build, each run as a real
case in a throwaway git repository built by `mkdtemp` + `git init`, against the SHIPPED `fence()`
lifted out of the cell byte for byte.

| attack | result |
|---|---|
| A1 / A2 widen `released`, or drop the path out of `product`, in the branch's own worktree | refused twice over. Rows (6) and (6b) are both there and (6) is literally first in the file |
| A5 two `packages/*.json` at status `A`, including TWO that would each pass alone | refused `(1)`. Row (8a) has the sub-row, added after M9 survived |
| A6 seven MODIFIED ancestor specs beside one ADDED spec | SKIPS. Row (8i) |
| A7 rename of a sealed path (`R100 old new`) | `fail [FENCE-SEALED-PATH-TOUCHED D .../today-app.cjs]`. The `-z` desynchronisation I feared cannot happen: the cell counts fields per record instead of pairing a NUL stream |
| A8 mode-only change on a sealed path | `M` record, refused naming the path |
| A9 non-ASCII sealed path | refused naming it, unquoted, because of `core.quotepath=false` |
| A10 space in a sealed path | refused naming it (git does not quote a space; measured, not assumed) |
| A11 case-only rename of a sealed path | refused; no case folding anywhere |
| A12 chain ref repointed to an unrelated commit | named refusal, no fallback to `refs/heads/...` and none to the worktree |
| A13 shallow / deleted ref | `FENCE-CHAIN-REF-ABSENT`, row (4) |
| A14 branch five chain commits behind, touching nothing sealed | PASSES (see BLOCKING-A for the missing row) |
| A15 the branch MERGES the chain tip in | its own sealed touch is still refused. Merging does not launder the diff |
| A16 `acceptance-s09-b.json` beside `acceptance-s9-a.json` | `FENCE-AMBIGUOUS-INVENTORY` naming both. `acceptance-s9-old.json.bak` is ignored, not parsed |
| A17 an execution pin that is not a product pin | is inventory: row (1b), and the three real ones include `today/test/catalogue.test.mjs` |
| A17b the S8 artifact's missing `released` key | `inv.released \|\| {}`: no TypeError, the real row runs |
| A18 `git` missing from PATH | never a pass (see N2 for the name) |
| A19 fixture hygiene | `os.tmpdir()` + `mkdtemp` + `realpathSync`, explicit `user.name` / `user.email` / `core.autocrlf` / `commit.gpgsign` per fixture, every git call with an explicit `cwd`, `after()` removal. **No fixture row touches this repository's refs**: `fence()` itself issues only `rev-parse`, `ls-tree`, `show`, `merge-base` and `diff`, all read-only, and every `update-ref` in the file takes a fixture root |
| A20 byte handling | `encoding: "buffer"` throughout; `Buffer.equals` for the artifact; the sha256 over the blob bytes. My RX6 mutation (sha over a utf8 round trip) survives, and I report it as an EQUIVALENT mutant rather than a finding: for well-formed UTF-8 JSON the round trip is lossless and there is no behaviour to kill |
| RXcfg `diff.renames = copies` in the ambient config | I expected a false `D` on a sealed source. Measured: git needs `--find-copies-harder` to pair an unmodified source, so the record is a plain `A` and the fence PASSES. My concern was wrong |
| the `idsOf` regex | `\bIDS\s*=\s*\[` against the real `b-package.cjs`: the only match is `:173`; `RETIRED_IDS` (`:185`) and `NO_REGISTER_IDS` (`:316`) both carry an underscore before `IDS` and no word boundary. I could not construct a plausible runner source where it reads the wrong list |
| the 51 / three-prose count | my blind grep of double-quoted strings gave 49 with ONE prose string, which looked like a finding. It reconciles: 49 double + 1 single + 1 backtick = 51, and two of the three prose strings span lines. The report's CONFIRMED is right and I withdraw it |

And the author's own table: **I re-ran M1 through M17 and every one is killed, on exactly the rows
the table names**, including the three (M9, M13, M14) that survived the author's first pass and
have rows added for them at `b4b739c`. I also killed one mutation the table does not carry:
keying the reseal-child claim on ANY status rather than only `A` goes red on row (8i).

### The red-first, checked out and re-run on the PC in a scratch worktree of my own

```
eee1206  RED    tests 20, pass  6, fail 14, exit 1
                D.2 (6)  FAILING, D.2 (6b) FAILING      <- the worktree-reading fence walked through
5738a96  GREEN  tests 20, pass 19, fail  1, exit 1      <- the one failure is THE REAL ROW
576be64  HEAD   tests 20, pass 19, fail  1, exit 1
```

Red first is literal, and row (6) really is first: it is the first `test()` in the file and it was
red at `eee1206` against a fence that read the inventory from the worktree. The worktree was created
with `git worktree add --detach`, needed no `node_modules` junction (the cell uses node builtins and
git only), carried NO private junction, and was removed with `git worktree remove` at the end.

### The C.2 red-first, re-measured at the chain tip

On this branch `P-MEASURE (g)` is already red at `:137-:139` over the carried lanes' undeclared
drift, so execution never reaches `:185` and the red cannot be shown here at all. Report F7 is
right about that and it is worth the PM knowing the S9 integrator will hit the same wall. Measured
in a farm scratch worktree at the chain tip `70113da5`:

```
untouched chain tip                                        6 tests, 6 pass, 0 fail
one byte appended to preview.css, cell as at the tip        6 tests, 5 pass, 1 fail
   "rebuild/m3/w7-preview/today/preview.css is moved by P3-IMPORT-UI-2 and no declaring
    spec names the bytes it stands at"                <- that is :188-:189, by name
same byte, the branch's boundary.test.mjs applied           6 tests, 6 pass, 0 fail
same, with the KEPT Object.hasOwn assert inverted to true    6 tests, 5 pass, 1 fail
```

The last line is the mutation control that matters: `:186-:187` still has teeth after `:188-:189`
goes, which is the whole of PM-R7 and R2 N9. The C.2 hunk is correct and I would land it as it is.

### H18, re-measured

```
H-M0 untouched                                              12 tests, 12 pass
H-M1 reading-host.mjs deleted from REQUIRED_INPUTS           12 tests, 11 pass, 1 fail, naming the path
H-M2 the assert.throws loop removed + the same deletion      12 tests, 12 pass   <- the loop IS the guard
H-M3 one entry removed from the cell's literal               12 tests, 11 pass, 1 fail
H-M6 the result.inputs.includes assert removed               12 tests, 12 pass   <- survives, as reported
```

Every one reproduces. H-M6's survival is reported honestly by the author and I agree with the
reasoning: faking a bundle to kill it would assert nothing about the real one.

---

## 4. THE BAR, RE-RUN BY ME ON THE PC

`%TEMP%\earned-s9b` at `576be648`, `git status` clean but for this file, node v24.19.0 at the
runtime path, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, long runs through a `.cmd`
with a log and a `.done` file.

| what | my measurement | the report's |
|---|---|---|
| the fence cell (new step a) | tests 20, pass 19, fail 1, exit 1 | same |
| the whole today step (`rebuild.yml:232`, 17 cells) | tests 683, pass 681, fail 2, 152.7 s, exit 1 | 683 / 681 / 2, 152.8 s |
| the two failures | `boundary.test.mjs P-MEASURE (g)` and `setup.test.mjs re-pin - every file the B-NTC package pins is untouched by A4b, on disk` | the same two, pre-existing |
| new step b, the three passphrase cells | tests 20, pass 20, fail 0, exit 0 | same |
| new step c, `rebuild/m3/w6/test/local-import.test.mjs` | tests 22, pass 22, fail 0, exit 0 | same |
| the lane C step at `:306` | tests 9, pass 9, fail 0, exit 0 | same |
| `b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | same, byte for byte |

No re-run was needed: nothing was green once and red once, on either machine.

**THE MEASURED REFUSAL OF THE REAL ROW ON THIS BRANCH, mine, on Windows:**

```
THE REAL ROW - this branch touched no sealed path the chain has not released
AssertionError: this change touched 9 sealed path(s) that
  rebuild/m4/spec/acceptance-s8-real-shape.json at refs/remotes/origin/rebuild/t2-client-core
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

Identical, path for path, in a farm scratch worktree on Linux (tests 20, pass 19, fail 1). Report
section 2.4's both-OS claim reproduces. Nothing was softened to make this row green: there is no
skip, no environment switch and no branch-name test anywhere in the file, which I checked by
reading the whole cell and by the mutation sweep.

The branch's diff against its merge base is 32 paths; nine of them are sealed, and the other 23
(including `today/design.cjs`, `today/today-model.cjs`, `m3/setup/port/unseal.cjs` and the lane
reports) are correctly not refused. The nine are the ticket's three plus E fact 20's four and E
fact 21's three, with `rebuild.yml` in both lists. I agree with the report's reading of it, and
with the sharper point in section 2.3 that S9 turns this row green through the reseal-child SKIP
and not through its `released` block.

**F8 is confirmed and I would put it higher than the author does.** `--ci --package S8` prints the
same `SEALED-PROFILE-RECOMPUTATION` refusal on this branch whether three sealed files are edited or
none, so D.1's "`rebuild.yml:150` is the real teeth today" is not true of a reseal-child branch
before it writes its own package. That is the strongest argument in this round for shipping the
fence at all, and the spec does not make it.

---

## 5. STOP CONDITIONS

I checked all eleven of F.2 independently and agree with the report: none fired. In particular
STOP-6 (H18 cannot be written to go red on a deleted entry) and STOP-8 (the skip cannot be derived
from the chain) both do not fire, measured. **STOP-7 is only half answerable here** and the report
says so: `fetch-depth: 0` is set at `rebuild.yml:35` and both machines can read the artifact out of
Git at `CHAIN_REF`, but whether `actions/checkout@v4` materialises
`refs/remotes/origin/rebuild/t2-client-core` for a branch that is NOT the checked-out one has to be
measured on a GitHub runner, not argued. If it does not, the fence's own step is red on every push
for a second reason. That is the one thing in this round the PM should look for in the
`rebuild-public` logs of this push before ruling.

---

## 6. WHAT I DID NOT VERIFY

* GitHub CI itself on ubuntu-latest and windows-latest. Both-OS evidence of record is that run and
  it had not reported when I finished.
* Anything needing `packages/S9.json`, the `acceptance-s9` artifact, the needles, the
  `--ci --package S9` walk or the standing step's flip. All on the wait list; none is touched.
* `b-package.cjs --full`, any seal, receipt or artifact write, and the seal generator on
  `rebuild/b-seal-gen`. Not run, not read.
* The three passphrase cells and `local-import.test.mjs` as CELLS. I ran them and counted them
  (20 and 22); I did not review what they assert, which is other lanes' accepted work.
* The private census, `rebuild/conform/private`, `src/history.js`, any `ledger/` directory,
  `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` and the protected soak: not read, listed or
  grepped on either machine, and no junction to `rebuild\conform\private` was created.
* Whether the S9 sealer will emit `released` as an object (N1). E fact 15 says it will; I could not
  measure a file that does not exist yet.
* `rebuild/lanes/c/ui-port/` is not yet a `CHILD_ROOTS` entry (E fact 3, wait list). The fence's CI
  step covers it for this round; the child-root hunk is S9's. I confirmed the fence is NOT in
  `TOOLING_FILES` (`b-package.cjs:355`), which is what B.8's last paragraph and PM-R4 require of a
  cell that audits the sealed set.

---

Reviewer: cowork (Earned lane hand), independent review R1 of ticket S9-PREP-B.
Verdict REJECT: five untested guard clauses and one finding routed to the PM on a false premise.
Nothing measured in the shipped behaviour of any of the four items is wrong.
