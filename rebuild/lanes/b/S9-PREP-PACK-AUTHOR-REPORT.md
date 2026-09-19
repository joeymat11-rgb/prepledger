# S9-PREP-PACK AUTHOR REPORT - the two design-pack pin cells, code only

Ticket S9-PREP-C. Lane B, preparing the two cells S9 declares `role: "new"` (hunks H19 and
H19b). Branch `rebuild/b-s9-prep-pack`, cut from `rebuild/b-s9-ui-pins` at `da9f8683`.

Design of record: `rebuild/lanes/b/S9-RELEASE-SPEC.md` v4, section C.5.1 and C.5.3, B.5 rows
H19 and H19b, B.8's six and four red-first rows, E fact 18, E.2, F.1 R12/R15/R16, F.2
STOP-9/10/11. Binding corrections: `S9-RELEASE-SPEC-REVIEW-R4.md`, with the PM's rulings
N1.1 ADOPTED, N1.2 ADOPTED, N1.3 DECLINED, N8 ADOPTED, N2 and N10 carried to the integrator
list at the end of this report.

**This report is a hypothesis.** The reviewer is asked to disagree wherever the evidence
lets them. Section 9 lists the places I think are worth attacking first.

**REVISION FOR THE R1 FIX ROUND.** `S9-PREP-PACK-REVIEW-R1.md` rejected the first build on
three BLOCKING findings and eleven notes. I am the second author; I did not discard the
first author's work, I continued it. **All three BLOCKING findings are ACCEPTED and FIXED,
each red first**, and every note is either fixed or disputed with a measurement, in the
section `R1 findings: fixed or disputed` at the end of this file. Every count in sections
3, 5, 6 and 7 has been RE-MEASURED at the fix head on both operating systems; where the
first author's number did not survive that, the new number stands and the old one is named.
Two things the reviewer measured and I could not reproduce or improve are reported as his,
with attribution, rather than silently absorbed.

**REVISION FOR THE R2 FIX ROUND (round 3), and this is the current state of the branch.**
`S9-PREP-PACK-REVIEW-R2.md` rejected the second build on two BLOCKING findings, both of them
guards with no row and neither of them a behaviour defect, and on five notes. I am the third
author and I have continued the work rather than replaced it. **Both BLOCKING findings are
ACCEPTED and closed by ONE fixture row each, with no engine change, and the mutant that made
each guard look like decoration is recorded.** All five notes are taken. The PM has also
ruled the four questions the second author asked, and one of those rulings - Q2 - is the
only engine change in this round: **a SEVENTH refusal, `UNREADABLE`, in both cells**, added
now because from S9 the vocabulary is sealed bytes. The rows for it were committed RED
against the unchanged engine first. Section `R2 findings and the PM's rulings: fixed or
disputed` at the end of this file answers R2 finding by finding. Sections 1, 2, 3, 5, 6, 7
and 9 carry round 3's numbers; where a count moved, the old one is named.

---

## 1. WHAT LANDED

| path | what it is |
|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | NEW. PACK-PIN: the whole owner-approved pack, pinned by a literal sorted `(path, sha256)` list read from the WORKING TREE. **41 rows** after round 3 (35 after R1's round, 25 before) |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | NEW. APPROVED-PIN: whatever `design.APPROVED` names at run time, pinned parametrically against this cell's own literal map. **25 rows** after round 3 (20 after R1's round, 16 before) |
| `.github/workflows/rebuild.yml` | ONE new step, a pure insertion in ONE hunk in the same place. Round 3 added eleven COMMENT lines to it and nothing else, so it is now 22 inserted lines and still zero removed |
| `rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md` | this file |

**Nothing else is touched.** `git status` on the worktree is empty apart from these four, and
the diff against `da9f8683` is four files plus `S9-PREP-PACK-REVIEW-R1.md` and
`S9-PREP-PACK-REVIEW-R2.md`, which the two reviewers committed and which I have not edited.
**Round 3 changed ONE region of `rebuild.yml` and it is the same region**: eleven comment
lines inside the step's own comment block, no new step, no moved line, so the two other
lanes' regions (after `:232` and after `:306`) still merge. Measured at this head with the
repository's own `yaml`: one job `public-gates`, **28 steps**, matrix
`[ubuntu-latest, windows-latest]`, no job-level shell default, the step present exactly
once, unglobbed.

**The two literals are NOT taken.** Both are empty, each with one comment naming who fills
it, when, and by which procedure. No real literal, no path list from E fact 17, no
`design.test.cjs` hunk, no `packages/S9.json`, no brief, no token line: all of that is the
wait list and none of it is started here.

## 2. THE COMMITS, IN THE ORDER THE TICKET ASKED FOR

| # | sha | what |
|---|---|---|
| (a) | `6cfd903273c7453f7af746e835041f8ed5bf7643` | PACK-PIN: fixture pack builder and every row, engine stubbed to refuse nothing |
| (b) | `1b803930e1a13f90ce38b8c8d27222122f5fc309` | PACK-PIN: the engine, row by row to green |
| (c1) | `4b02ec522624460b60e6f39f4c90c187d0d927c8` | APPROVED-PIN: fixtures and every row, engine stubbed |
| (c2)+(d) | `491ba20b78a695e91180b4358cc1dd9e777754d5` | APPROVED-PIN: the engine, and both real rows measured |
| (e) | `a32a6dfafcb5a3766bcaff5b689d8bf496d577cc` | the one `rebuild.yml` step |

**THE FIX ROUND'S COMMITS, red first in the same shape.**

| # | sha | what |
|---|---|---|
| (f1) | `8195f1d` | PACK-PIN: R1's rows, RED against the unchanged engine (35 tests, 29 pass, **6 fail** on the PC) |
| (f2) | `264f7d0` | PACK-PIN: the engine to C.5.1's words (35 / 34 / **1**, the real row) |
| (f3) | `baf0e88` | APPROVED-PIN: R1 BLOCKING-1's ORPHAN rows, RED (20 tests, 14 pass, **6 fail**) |
| (f4) | `3601e01` | APPROVED-PIN: the sixth refusal, ORPHAN (20 / 19 / **1**, the real row) |
| (f5) | `00de876` | this report, with R1 answered finding by finding |

**ROUND 3's COMMITS (the R2 fix round), in the same shape.**

| # | sha | what |
|---|---|---|
| (r3-f1) | `392057e` | R2 B1's and R2 B2's rows, plus R2 N3, N4 and N5. **No engine line moved**: both rows are green against the SHIPPED engine, and it is the MUTANT that makes them red (section 6) |
| (r3-f2) | `5563dca` | Q2's `UNREADABLE` rows, RED against the unchanged engine: pack-pin **41 / 36 / 5**, approved-pin **25 / 21 / 4**, on BOTH operating systems |
| (r3-f3) | `a0e9b4a` | the seventh refusal in both engines, and the optional reader: pack-pin **41 / 40 / 1**, approved-pin **25 / 24 / 1** |
| (r3-f4) | `51415d2` | R2 N2: the last row of each cell DERIVES the vocabulary from what the rows above emitted |
| (r3-f5) | `1d14742` | the PM's Q4 ruling written into the `rebuild.yml` step's own comment |
| (r3-f6) | this commit | this report |

Each was pushed to `rebuild/b-s9-prep-pack` as it was made.

## 3. THE RED-FIRST EVIDENCE, MEASURED

Both engines were committed as a body that returns an empty array, with every row already
written. All counts below are `node --test` on the PC (Windows, node v24.19.0).

| commit | cell | tests | pass | fail |
|---|---|---|---|---|
| `6cfd9032` (a) | pack-pin | 25 | 9 | **16** |
| `1b803930` (b) | pack-pin | 25 | 24 | **1** (the real row) |
| `4b02ec52` (c1) | approved-pin | 16 | 6 | **10** |
| `491ba20b` (c2) | approved-pin | 16 | 15 | **1** (the real row) |

**R1 N9 IS RIGHT AND THE TABLE ABOVE NAMES ITS OS NOW.** The four rows are the WINDOWS
counts. The reviewer re-ran the same four commits in the farm and measured linux **one row
redder in each cell** (`6cfd9032` 17 fail, not 16; `4b02ec52` 11, not 10), because the
file-symlink row takes the EPERM branch on Windows and passes even against a stub. I did
not re-run those four commits myself: they are the first author's build and the reviewer
checked them independently, so re-running them a third time buys nothing. **The fix round's
own red-first counts (section 2, f1 and f3) I measured myself, on the PC.**

The sixteen red at (a) are the six B.8 rows, the anchor row, the forward-slash and byte-order
row, the directory-link row, the two PACK-ROOT-ABSENT rows, LITERAL-EMPTY, the precedence
row, the malformed-literal row, the 904-file mismatch row and the working-tree re-read row.
The ten red at (c1) are LIST-EMPTY, MISMATCH, MISSING, UNLISTED, the C.5.3 case, the
coordinated edit, the "verdict comes from this cell's literal" row, the directory-link row,
the run-time re-read row and the refusal-order row.

**A red-first fact worth stating rather than hiding.** At (a) and (c1) the REAL ROWS PASSED.
A stub that refuses nothing has nothing to refuse, so the real row is exactly the vacuous
pass the ticket forbids, and it is the engine that takes it away: at (b) and (c2) both real
rows go red, by name. That is the whole shape of the red-first argument here, and it is the
reason the real rows are not written as "assert the refusal we expect today": a row that
asserted `PACK-ROOT-ABSENT` would be green on this branch and would have to be rewritten on
the day the pack merges, which is the day nobody is reading it.

**ROUND 3's RED-FIRST, AND THERE ARE TWO KINDS OF IT, WHICH IS WORTH SAYING PLAINLY.**

*(i) The Q2 rows have an ordinary red first*, because they needed an engine change. At
`5563dca` the rows exist and the engine does not, measured on BOTH operating systems and
identical on both:

| commit | cell | tests | pass | fail | the rows that are red |
|---|---|---|---|---|---|
| `5563dca` (r3-f2) | pack-pin | 41 | 36 | **5** | the three `UNREADABLE` rows, the source-scan row, the real row |
| `a0e9b4a` (r3-f3) | pack-pin | 41 | 40 | **1** | the real row |
| `5563dca` (r3-f2) | approved-pin | 25 | 21 | **4** | the two `UNREADABLE` rows, the source-scan row, the real row |
| `a0e9b4a` (r3-f3) | approved-pin | 25 | 24 | **1** | the real row |

*(ii) R2 B1 and R2 B2 have NO red of that kind, and pretending otherwise would be a lie.*
Both are guards the shipped engine already honoured; what was missing was the proof. The
ticket says so in terms: for B1 and B2 **the red is the MUTANT**. So the honest evidence is
that each new row is GREEN against the shipped engine and RED against the single named
mutation, and that the mutation turns nothing else red. Measured on both operating systems:

```
B1  pack-pin, lstatSync(packRoot) -> statSync(packRoot)
    shipped: 41 / 40 / 1 (the real row)   mutant: 41 / 39 / 2
    the one extra red is "R2 B1: a LINK standing AT the pack root is ABSENT" and nothing else

B2  approved-pin, lstatSync(full) -> statSync(full)
    shipped: 25 / 24 / 1 (the real row)
    mutant on Windows: 25 / 23 / 2   the one extra red is "R2 B2: a DANGLING link ..."
    mutant on linux:   25 / 22 / 3   the same row, plus the linux-only FILE-link row
```

Before round 3 that same mutation turned **zero** non-real rows red on Windows and **one**
on linux. That is the whole of R2's two findings, executed.

## 4. THE REFUSAL EACH REAL ROW PRINTS ON THIS BRANCH, MEASURED

Two refusals were defined for PACK-PIN's two pre-S9-head states, and the ticket asked which
one this branch prints. **The cell judges the CHECKOUT before it judges ITSELF**: an absent
pack root is a fact about the tree, an empty literal is a fact about the cell, and the tree
is what a walk needs first. Measured on this branch, on both operating systems:

```
PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18
```

`rebuild/m1/approved-2026-09-18/` lives on the design lane's branches and has not merged,
so the pack root is not in this checkout. The row that measures the other order is
`the two refusals do not both fire`, and the row that measures LITERAL-EMPTY on a pack that
IS present is `LITERAL-EMPTY: a present pack and an unfilled literal refuses`. So the ladder
out of red, in the order the S9 integrator will climb it, is:

| state | refusal |
|---|---|
| the pack has not merged (this branch, today) | `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18` |
| it has merged, the literal is unfilled | `PACK-PIN LITERAL-EMPTY` |
| C.5.1's five steps are done | none |

APPROVED-PIN prints two refusals on this branch, because `design.APPROVED` is read at run
time and today names two files that EXIST:

```
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
```

**This is R4 N8 measured rather than argued.** Both named files exist and both match the
constants in `design.cjs`, so neither MISSING nor MISMATCH can fire. Without N8's UNLISTED
this cell would have run a loop over two files it holds no literal for and reported nothing
at all, and the real row would have been GREEN on a branch where the cell pins nothing.
Mutation A2 in section 6 is that sentence executed.

## 5. THE BAR, ON BOTH OPERATING SYSTEMS, WITH COUNTS

**RE-MEASURED AT ROUND 3's HEAD.** The numbers below replace the R1 round's (55 / 53 / 2
together) and the first build's (41 / 39 / 2); they are bigger because round 3 added eleven
rows across the two cells.

**The PC (Windows 11, node v24.19.0), worktree `%TEMP%\earned-s9c` at `51415d2`.**
This is the bar of record.

| suite | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | 41 | 40 | 1 | 0 | 0 |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | 25 | 24 | 1 | 0 | 0 |
| the two together, which is the CI step's exact command | **66** | **64** | **2** | 0 | 0 |
| `rebuild/m3/w7-preview/today/test/design.test.cjs`, unchanged | 11 | 11 | 0 | 0 | 0 |

**Linux (the farm scratch `/home/claude/farm/scratch/wt/s9cAuthC`, made with
`farm-scratch.sh` and checked out at the PUSHED head `51415d2`, node v22.22.2, 2 CPUs).**

| suite | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | 41 | 40 | 1 | 0 | 0 |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | 25 | 24 | 1 | 0 | 0 |
| the two together, the CI step's exact command | **66** | **64** | **2** | 0 | 0 |

**THE TWO OPERATING SYSTEMS AGREE ROW FOR ROW at this head**, which is not the same claim as
"the same totals": every row that is green on one is green on the other, and the only two red
are the two real rows, with byte-identical refusal text.

**`design.test.cjs` is the row that proves I did not disturb `design.cjs`.** I read
`design.cjs` (APPROVED's shape and `readApproved`) and edited nothing in it; its own cell is
11 / 11 / 0 at the fix head, and `git status --porcelain` on the worktree is EMPTY.

**The two failures are the same two rows on both operating systems, with the same refusal
text**: PACK-PIN's real row printing `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18`
and APPROVED-PIN's real row printing the two `APPROVED-PIN UNLISTED` lines of section 4.
**Every other row is green on both.** No row is skipped on either OS, and neither cell has a
`skip`, a `todo` or a platform conditional that turns a row off.

**The exact command of the new CI step:**

```
node --test rebuild/lanes/c/ui-port/pack-pin.test.mjs rebuild/lanes/c/ui-port/approved-pin.test.mjs
```

It is inserted as a pure insertion, one hunk, `@@ -297,0 +298,11 @@`, eleven lines added and
zero removed, directly after the `A5 - the built deploy folder itself` run line at `:297` and
before the comment block at `:298`. Nothing else in `rebuild.yml` is touched, so the two
regions another lane is adding to (after `:232` and after `:306`) cannot conflict with this
one. The file was parsed with the repository's own `yaml` module after the edit: one job,
`public-gates`, 28 steps, and the new step occurs exactly once. Named by exact path and never
globbed, in the style of the existing `D -` and `C -` steps.

**ONE DELIBERATE DEPARTURE FROM THE FILE'S OWN STYLE, so it is not read as sloppiness.**
`rebuild.yml` spells its step names with an EM DASH between the tag and the words (`A5`,
U+2014, `the built deploy folder itself`, at `:296`); this step spells its name with an ASCII
hyphen (`C - the design pack pin and the approved-reference pin`). The character itself is
NOT reproduced in this sentence, which is why it is named by code point. That is the standing rule that no file a lane hand authors may
carry U+2013 or U+2014, and it wins over local style. Measured: the file holds 17 em dashes,
at lines 66, 170, 174, 181, 214, 231, 234, 243, 264, 266, 268, 270, 272, 290, 292, 294 and
296, and **not one of them is in the inserted lines**. Re-measured at round 3's head over the
22 lines this lane has inserted: **zero U+2013 and zero U+2014**, and the two cells and this
report hold **zero of either** (counted by code point, not by eye).

**THE STEP IS RED ON THIS BRANCH AND THAT IS THE DESIGN, AND THE PM HAS NOW RULED IT (Q4).**
The step STAYS, red by name, with its comment, and round 3 wrote the ruling into the comment
itself:

 - **nothing of S9 preparation reaches the chain before the seal.** The three preparation
   branches merge into the S9 lane branch `rebuild/b-s9-ui-pins` ONLY, and that lane reaches
   the chain by the S9 fast-forward - by which time the pack has merged with C-UI-1 and both
   literals are filled at the re-measure, so **both real rows are green the first time the
   chain tip sees them.** Until then this red lives on a preparation branch and nowhere else.
 - **the red is not a pending runner result, and round 3 stops describing it as one.** The PM
   measured this today: on any branch that does not contain the chain tip, or that carries
   undeclared sealed edits, the standing step at `rebuild.yml:150` fails FIRST and GitHub
   SKIPS every later step. So these two cells **cannot run on GitHub's runners at all** until
   the S9 walk passes. **The PC (Windows) and a linux farm scratch ARE the both-OS evidence**
   for them, and that is what section 5 is. Nothing here is waiting on a runner.

## 6. THE MUTATION TABLE, MEASURED

Every refusal and every guard clause was removed or inverted, one at a time, in a copy of the
cell placed beside it (so `import.meta.url` still resolves to the same repository root), the
copy was run, and the copy was deleted. **The two real rows are red on this branch whatever
the mutation is, so they are excluded from "the row that goes red" below unless a mutation
made one of them GREEN, which is called out.**

**THE WHOLE TABLE IS RE-MEASURED AT THE FIX HEAD, ON BOTH OPERATING SYSTEMS, BY A HARNESS
AND NOT BY HAND.** R1 N2 found two count errors in the five rows it re-ran and read the rest
as approximate; that was fair, and hand-running twenty-nine mutations twice is where the
errors come from. So the fix round runs them from one script that applies the named edit,
runs `node --test --test-reporter=tap` on the copy, parses the `not ok` lines and deletes
the copy. **Both columns below are its output**, linux from the farm scratch of the pushed
head and Windows from the PC. The two REAL ROWS are red whatever the mutation is, so they
are excluded from the counts and a mutation that turns one GREEN is flagged instead.
Nothing in either tree was left mutated: `git status` is empty on the PC.

**One harness fact worth stating, because it cost a wrong table once already.** Node v24 on
the PC defaults to the `spec` reporter and node v22 in the farm defaults to `tap`. A first
pass that parsed `not ok` lines reported **every Windows mutation as killing zero rows**,
which is impossible on its face and was a defect in the harness, not a finding. `--test-reporter=tap`
is passed explicitly now. I report it because a reader of a mutation table should know what
a silent parser failure looks like in one.

### 6.1 PACK-PIN

| # | what was removed or inverted | linux rows red | Windows rows red | killed? |
|---|---|---|---|---|
| P1 | the `PACK-PIN PACK-ROOT-ABSENT` refusal | 3 | 3 | yes. **AND THE REAL ROW TURNS GREEN** (R1 N1) |
| P2 | the `PACK-PIN LITERAL-EMPTY` refusal | 1 | 1 | yes |
| P3 | the `PACK-PIN MISMATCH` push | 8 | 8 | yes |
| P4 | the `PACK-PIN MISSING` push | 2 | 2 | yes |
| P5 | the `PACK-PIN ADDED` loop | 4 | 4 | yes |
| P6 | `lstat` replaced by `stat`, so links are followed | 4 | 3 | yes, on both |
| P7 | the ignore prefix un-anchored to a match anywhere | 22 | 21 | yes |
| P8 | the `__pycache__` segment rule removed | 22 | 21 | yes |
| P9 | `Buffer.compare` replaced by the default string sort | 1 | 1 | yes |
| P10 | the walk emits the platform separator instead of `/` | **0 (it survives)** | **23** | yes, ON WINDOWS ONLY |
| P11 | the malformed-literal-line assert | 2 | 2 | yes |
| P12 | the duplicate-literal-path assert | 1 | 1 | yes |
| P13 | an irregular entry skipped silently instead of named | 2 | **1** | **yes, on BOTH now** (R1 B3 closed) |
| P14 | `label()`'s repo-relative branch replaced by `toPosix(root)` | **1** | **1** | **yes** (R1 B3, was 0 and 0) |
| P15 | `parseLiteral`'s backslash assert removed | **1** | **1** | **yes** (R1 B3, was 0 and 0) |
| P16 | `parseLiteral`'s sortedness assert removed | **1** | **1** | **yes** (R1 B3, was 0 and 0) |
| P17 | the tightened line regex put back to the greedy `.+` | **1** | **1** | **yes** (R1 N4) |
| P18 | the ignore prefix widened back to the bare `quality/run` | **2** | **2** | **yes** (R1 B2, the regression) |
| P19 | the `__pycache__` rule widened back to any segment | **1** | **1** | **yes** (R1 B2, the regression) |

**ROUND 3's PACK-PIN ROWS: the new ones, and every row that bears on code round 3 touched,
RE-MEASURED.** The engine's walk and its refusal loops changed, so P3 to P6 and P13 are
re-run here under their exact edits rather than carried. Counts exclude the real row.

| # | the exact edit | linux | Windows | killed? |
|---|---|---|---|---|
| P20 | `lstatSync(packRoot)` to `statSync(packRoot)` at the PACK ROOT | **1** | **1** | **yes, on both** (R2 B1, was 0 and 0) |
| P21 | the `PACK-PIN UNREADABLE` push dropped (`void unreadable;`) | **4** | **4** | **yes** (Q2) |
| P22 | the walk rethrows instead of recording (`bytes = readFile(abs);`) | **4** | **4** | **yes** (Q2: this is the OLD behaviour) |
| P23 | the unreadable skip in the literal walk dropped, so an entry is named twice | **3** | **3** | **yes** (Q2) |
| P24 | the REAL ROW made to pass a reader (`packPin(PACK_ROOT_ABS, LITERAL, fs.readFileSync)`) | **1** | **1** | **yes**: the source-scan row |
| P25 | `"PACK-PIN UNREADABLE"` removed from the exported `REFUSALS` | **1** | **1** | **yes**: the derived-vocabulary row (R2 N2) |
| P3' | the `PACK-PIN MISMATCH` push dropped | **10** | **10** | yes (was 8 and 8 over 35 rows) |
| P4' | the `PACK-PIN MISSING` push dropped | **4** | **4** | yes (was 2 and 2) |
| P5' | the `PACK-PIN ADDED` push dropped | **5** | **5** | yes (was 4 and 4) |
| P6' | the WALK's `lstatSync(abs)` to `statSync(abs)` | **5** | **4** | yes, on both (was 4 and 3) |
| P13a' | the `PACK-PIN NOT-A-REGULAR-FILE` push dropped | **5** | **4** | yes, on both |
| P13b' | the irregular skip in the literal walk dropped, so an entry is named twice | **2** | **1** | yes, on both |

**EVERY ONE OF THE TWELVE ROWS ABOVE KILLS THE SAME ROWS ON BOTH OPERATING SYSTEMS**, and
the only difference in any of them is the linux-only FILE-link row (`R4 N1.2 (a)`), which
takes the EPERM branch on Windows by construction. P6', P13a' and P13b' are one row redder
on linux for exactly that reason and no other; I checked the row NAMES, not only the counts.

**P13 IS THE ROW THAT CHANGED VERDICT AND NOT ONLY COUNT.** R1 was right that it was
decoration on the PC: the directory-link row pins a FILE UNDER the junction, so
`irregular.has(e.file)` is false there, and the file-link row cannot be built on Windows.
The fix is not a count correction but a row. A directory junction needs no privilege on
either OS and can be created AT the path of a pinned FILE, which puts an irregular entry
exactly where the literal names one: `R4 N1.2 (c)` does that, and P13 now dies on the PC.

**P14 through P19 are the six mutations the first build had no row for**, three of them
named by R1 B3 and three of them the regressions of the two BLOCKING fixes. Each kills
exactly one or two rows, on both operating systems.

**P10 is the measurement R4 N1.1 was written for, and it got STRONGER.** On linux
`path.sep` IS `/`, so the mutation is a no-op and not one row moves; on the PC it turns
**23** of the 35 rows red (the first build measured 16 of 25). A cell developed only in the
farm would ship a walk that spells `quality` and `gate.py` with a backslash between them and
would put 904 red lines on the first `windows-latest` run.

Both numbers are in this table because the pair is the evidence, not either one alone, and
P10 is the single best argument in this build for the bar of record being the PC.

**P7 and P8 are worth reading together.** Un-anchoring the ignore list does not merely let the
decoy out of the pin; it turns the fixture's ordinary green control red as well, because the
fixture's own `quality/run/` and `__pycache__` entries stop being matched the way the
manifest expects. Either way the cell notices loudly, which is the behaviour R3 N5's second
half asked for.

### 6.2 APPROVED-PIN

| # | what was removed or inverted | linux rows red | Windows rows red | killed? |
|---|---|---|---|---|
| A1 | the `APPROVED-PIN LIST-EMPTY` refusal | 3 | 3 | yes |
| A2 | the `APPROVED-PIN UNLISTED` refusal | 5 | 5 | yes. **AND THE REAL ROW TURNS GREEN** |
| A3 | the `APPROVED-PIN MISSING` refusal | 1 | 1 | yes |
| A4 | `lstat` replaced by `stat` | 1 | **0** | **ON LINUX ONLY. The OS difference I cannot close; see below** |
| A5 | the `APPROVED-PIN MISMATCH` push | 3 | 3 | yes |
| A6 | `namesOf` carries `design.APPROVED`'s own sha256 through and the engine trusts it | 5 | 5 | yes. **AND THE REAL ROW TURNS GREEN** |
| A7 | the `APPROVED-PIN NOT-A-REGULAR-FILE` refusal (lstat kept) | 2 | **1** | yes, on both (R1 N2's correction confirmed: 1 on Windows, not 2) |
| A8 | the `APPROVED-PIN ORPHAN` loop | **5** | **5** | **yes** (R1 B1, the fix's own regression) |
| A9 | ORPHAN's `Object.keys(literal).sort(byteCompare)` | **1** | **1** | **yes** (R1 B1) |
| A10 | LIST-EMPTY's precedence, inverted so ORPHAN fires with it | **3** | **3** | **yes** (R1 B1) |

**ROUND 3's APPROVED-PIN ROWS, on the same rule: the new ones, and every row that bears on
code round 3 touched.** Counts exclude the real row.

| # | the exact edit | linux | Windows | killed? |
|---|---|---|---|---|
| A11 | `lstatSync(full)` to `statSync(full)` (this is A4, re-measured) | **2** | **1** | **YES ON BOTH NOW** (R2 B2, was 1 and **0**) |
| A12 | `Object.hasOwn(literal, file)` to `file in literal` | **1** | **1** | **yes** (R2 N4, was 0 and 0) |
| A13 | the engine rethrows instead of recording (`bytes = readFile(full);`) | **3** | **3** | **yes** (Q2: the OLD behaviour) |
| A14 | the REAL ROW made to pass a reader | **1** | **1** | **yes**: the source-scan row |
| A15 | `"APPROVED-PIN UNREADABLE"` removed from the exported `REFUSALS` | **1** | **1** | **yes**: the derived-vocabulary row (R2 N2) |
| A3' | the `APPROVED-PIN MISSING` push dropped | **2** | **2** | yes (was 1 and 1) |
| A5' | the `APPROVED-PIN MISMATCH` push dropped | **5** | **5** | yes (was 3 and 3) |
| A7' | the `APPROVED-PIN NOT-A-REGULAR-FILE` push dropped | **4** | **3** | yes, on both (was 2 and 1) |

**A11 IS R2 BLOCKING-2 AND IT IS THE ONE VERDICT THAT CHANGED THIS ROUND.** The mutation
that survived on Windows now dies there, killed by ONE new fixture row and no engine line.
A7' is one row redder on linux for the FILE-link reason and no other.

**A2 and A6 are the two mutations that make the real row GREEN, and they are the two that
matter most.** A2 is R4 N8 exactly: drop UNLISTED and a cell whose literal is empty passes
over a list it pins nothing in. A6 is R1 BLOCKING-4 turned into a structure: let the sha come
from `design.APPROVED` and the cell agrees with the constant it exists to check, so the
coordinated edit is green again and the real row is green on a branch where nothing is
pinned. **A reviewer who wants one thing to attack should attack these two: if either can be
re-introduced without a fixture row going red, the cell is decoration.**

**THE PARAGRAPH BELOW IS THE SECOND AUTHOR'S AND IT WAS WRONG. IT IS KEPT, STRUCK THROUGH IN
WORDS RATHER THAN DELETED, BECAUSE THE SENTENCE THAT WAS WRONG IS THE ONE A LATER ROUND WOULD
HAVE BELIEVED.** R2 measured what it missed: **a DANGLING link is a second entry for which
`lstat` and `stat` disagree at a file path.** `lstat` succeeds and reports a symlink; `stat`
throws. A directory junction needs no privilege on Windows and removing its target leaves it
dangling, so the row builds unprivileged on BOTH operating systems, and the two refusals
differ (`NOT-A-REGULAR-FILE` shipped, `MISSING` under the mutant). Measured by me at round
3's head, both operating systems, and the `stat` code printed rather than pinned:
`APPROVED-PIN dangling link on win32: stat says ENOENT` and the same line on linux. **A11 in
the table above replaces A4: the guard now HAS a Windows row.** What survives of the old
paragraph is only this: a row built from a FILE symlink is still linux-only.

~~**A4 IS AN OS DIFFERENCE I CANNOT CLOSE, AND I REPORT IT RATHER THAN BENDING ANYTHING.**~~
APPROVED-PIN's `lstat` guard is killed on linux and survives on Windows. The reason is
measured, not guessed: on this PC an unprivileged process cannot create a FILE symlink
(`EPERM`, no Developer Mode), and a DIRECTORY junction, which it can create, resolves under
`stat` to a directory, which is still not a regular file, so the refusal fires either way and
the mutation changes nothing. A file symlink is the only entry for which `lstat` and `stat`
disagree at a file path, so on Windows there is no row an unprivileged process can build that
kills A4. **What this does NOT mean: it does not mean the guard is absent on Windows.** The
refusal itself (A7) is killed on BOTH operating systems, and PACK-PIN's equivalent (P6, P13)
is killed on both, because there a junction stands where a DIRECTORY is pinned and `stat`
walks through it into real files. I have not weakened, widened or skipped anything to make
this row look better; the row states in its own message what each OS's half proves.

## 7. THE DAY-OF COST OVER 904 FILES, MEASURED

The cell builds a synthetic pack of **904 files** in the real pack's shape (1 `README.md`,
8 under `ref/`, 42 under `app/`, 3 under `states/`, 6 gate scripts, 7 under
`quality/baseline/linux/`, 419 state records, 418 screens), walks it, and asserts green.

| machine | one full walk of 904 files |
|---|---|
| the PC (Windows 11, node v24.19.0, shared with at least six other lanes) | **55 ms** at round 3's head (the R1 round printed 57 to 59, the first build 60) |
| a farm scratch (linux, node v22.22.2, 2 CPUs) | **28 ms** at round 3's head (the R1 round printed 12, R2 measured 15; the farm's load varies by more than the figure does, and I would read any of them as "well under a twentieth of a second") |

**The seventh refusal did not cost anything measurable**: the walk's read is the same call
inside a `try`, and 55 ms on the PC is inside the spread the same row has shown all round.
The figures are PRINTED by the row and asserted by nothing, on purpose.

**AND THE FIGURE THAT BEATS BOTH, BECAUSE IT IS THE REAL PACK AND IT IS THE REVIEWER'S.**
R1 built a literal for the REAL 904-file pack by C.5.1's five steps in a farm scratch and
ran this cell's engine over a working-tree copy: **21 MB on disk, zero refusals, 55 ms cold
and 46 ms warm**, and then one flipped bit in one real state record printed exactly one
`PACK-PIN MISMATCH quality/baseline/states/C-03-ink.png`. That is C.5.1 step 5 executed
against the real thing rather than argued, and it is the single most valuable measurement in
either document. **It is his, not mine**: the pack is not on this branch and not on the PC,
and I did not go and get it. It remains linux-only, so step 5 ON WINDOWS is still the
integrator's job and is the step I would least like skipped.

**R2 REPEATED THAT REAL-PACK RUN INDEPENDENTLY RATHER THAN CARRYING IT, and his figures are
the ones I would quote to the integrator**: at `ecbef86a`, a literal of **904 lines**
generated by C.5.1's five steps, **zero refusals, 45 ms cold and 35 ms warm**, **913 files on
disk against 904 git-tracked** so nine untracked gate leavings ignored and none of them
named, and one flipped bit printing exactly
`PACK-PIN MISMATCH quality/baseline/states/T-39-dawn.json`. Two independent hands have now
run C.5.1 step 5 against the real pack on linux and both got zero. **Neither has run it on
Windows, and that is still the integrator's job.**

The whole two-cell step runs in well under a second on both. **The honest caveat on the
number:** the synthetic files are small, so this measures 904 `lstat`-and-read round trips
and 904 sha256s over a few kilobytes each, not over the real pack's 424 screenshots. The
syscall count is the dominant term and it is exact; the hashing term will grow with the real
PNG bytes and sha256 runs at hundreds of megabytes a second, so a real pack of even 100 MB
adds well under a second. **The cell is not a cost the design lane will notice**, and the row
asserts no time threshold on purpose: a threshold on a PC shared with six lanes is a flake
generator, and R8 already rules that a timing flake gets one re-run and is never "fixed".

## 8. WHAT THE CELLS DO, IN ONE PARAGRAPH EACH, SO A REVIEWER CAN CHECK THE SHAPE

**PACK-PIN.** One engine, `packPin(packRoot, literalLines)`, shared by every fixture row and
by the real row. It `lstat`s the pack root and refuses `PACK-PIN PACK-ROOT-ABSENT <root>` if
there is no plain directory there. It parses the literal, refusing `PACK-PIN LITERAL-EMPTY`
if nothing survives, and failing HARD (not as a refusal) on a line that is not
`<path> <space> <64-hex>` (with no leading or trailing space in the path), on a literal path
spelled with a backslash, on a path listed twice, and **on a literal that is not already
sorted by path bytes**: those are defects in the cell's own constant, not facts about the
tree, and they do not belong in the refusal vocabulary. The last of the four is the fix
round's, and it replaces a silent re-sort. It then walks the working tree, building each
pack-root-relative path with `/` and never with the platform separator, skipping an entry
whose path begins `quality/run/` or has a `__pycache__` segment **other than its last**
BEFORE it looks at the entry's type, `lstat`ing everything else, descending only into plain directories, hashing
only regular files, and naming anything else `PACK-PIN NOT-A-REGULAR-FILE <path>` without
reading or descending it. It compares the literal in path byte order, emitting
`PACK-PIN MISSING <path>` and `PACK-PIN MISMATCH <path>`, then `PACK-PIN ADDED <path>` in
byte order, then the irregular entries in byte order, **then, from round 3, the UNREADABLE
entries in byte order**. An irregular OR unreadable entry is named ONCE and takes no part in
the MISSING and ADDED comparisons, so one defect prints one line. **A file the walk cannot
read no longer throws: it is named and the walk CONTINUES** (the PM's ruling on Q2), and the
reader the walk uses is an OPTIONAL LAST PARAMETER that defaults to the file system's own and
is passed by fixture rows only.

**APPROVED-PIN.** One engine, `approvedPin(root, files, literal)`. The file list is read from
`design.APPROVED` at run time on every run by `namesOf`, which returns STRINGS and drops the
`sha256` field, so no channel exists by which the cell could satisfy itself from the constant
it is checking. An empty or absent list refuses `APPROVED-PIN LIST-EMPTY`. Each named file
gets exactly one refusal, in the order `UNLISTED` (this cell holds no literal for the path,
so it can say nothing else about it), `MISSING`, `NOT-A-REGULAR-FILE` (`lstat`, never
follow), `UNREADABLE` (round 3, and the list walk CONTINUES past it), `MISMATCH`. Refusals come back in `design.APPROVED`'s own order, which is identical
on both operating systems and is the order `design.cjs`'s own asserts speak in
(`approved[0]`, `approved[1]`). **Then, after every statement about a named file, it walks
its OWN LITERAL'S KEYS in path byte order and refuses `APPROVED-PIN ORPHAN <path>` for every
key the list no longer names** - the sixth refusal, added in the fix round for R1
BLOCKING-1 and confirmed by the PM in round 3 (Q1), and the only one of the seven that can
see a `design.APPROVED` which SHRANK. **The seventh is `UNREADABLE`** (round 3, the PM's
ruling on Q2): a named file the cell cannot read is named and the list walk CONTINUES. The
two places the cell sorts, the literal map's key order and the ORPHAN lines, are both by
path bytes and a row proves each.

**N1.3 is DECLINED and I built the shape the spec ruled, not the cheaper one.** PACK-PIN
walks the WORKING TREE with its own anchored ignore list and does not shell out to
`git ls-files`. I looked for a measurement that would force the other shape on one of the two
operating systems and did not find one: the walk behaves identically on Windows and linux
once P10's separator bug is excluded, the ignore list matched exactly what a gate-run
checkout leaves behind in R4's own measurement, and nothing about `git ls-files` would have
been cheaper to prove. So there is no STOP here, and no quiet shape change.

## 9. FOR THE S9 INTEGRATOR

Everything in this list is a thing that is true on the day of the re-measure and is easy to
lose between now and then. The first two are the PM's ruling on R4 N2 and N10, written here
so they cannot be lost.

1. **(R4 N2) EVERY PLATFORM OF RECORD'S BASELINE DIRECTORY MUST BE PRESENT AND SET BEFORE
   THE LITERAL IS TAKEN.** Measured by R4 at `ecbef86a`: the pack holds
   `quality/baseline/linux/` (6 PNGs and `ENV.txt`) and **no `win32` directory at all**.
   `gate.py:31` keys the directory on `platform_key()` and `:607-:608` FAILs a missing one
   with "run `--accept` on the machine of record", and C-UI-0's acceptance 6 says the win32
   baselines are set on the owner's PC by the lane lead before PR-READY. **So if the win32
   baselines are committed AFTER the literal is taken, the first Windows `--accept` is a pack
   move and therefore a reseal child, for a file nobody edited on a machine nobody changed.**
   The same sentence covers a Chromium or playwright upgrade on the machine of record, which
   re-accepts 424 PNGs and moves the pin. Add "every platform of record's baseline directory
   is present and set" as step 0 of C.5.1's procedure, and the same line to C.5.3's list.
2. **(R4 N10) `.gitignore` ON THE CHAIN TIP DOES NOT CARRY THE PACK'S TWO LINES.** C.5.1 says
   `.gitignore` carries `rebuild/m1/approved-2026-09-18/quality/run/` (line 7) and
   `__pycache__/` (line 8). That is true on `rebuild/c-ui-0-gates` and NOT on the chain tip,
   whose `.gitignore` is four lines and carries neither, because C-UI-0 has not merged. The
   cell does not read `.gitignore` at all (R16), so nothing in the cell depends on this; the
   integrator should simply not read C.5.1's sentence as a fact about the tree they are
   standing in.
3. **Fill PACK-PIN's literal by C.5.1's five steps and NEVER from the spec.** The comment
   inside `LITERAL` carries all five. Step 5 (re-run against the working tree, requiring zero
   MISMATCH, MISSING, ADDED and NOT-A-REGULAR-FILE) **must be run on the PC, on Windows**,
   and not only in the farm: mutation P10 in section 6 shows a separator bug that is invisible
   on linux and turns **23** rows red on Windows (**R2 N1: the 16 in this item was the FIRST
   build's figure over 25 rows and was stale; 23 is the measured number over 35, and the point
   is stronger than the number it cited**). v3's 53-file value `6121aa91...` is superseded
   and must not be used. **The design lane's own checkout is where step 5 exercises the
   ignore list for real**: R2 re-measured 913 files on disk against 904 git-tracked at
   `ecbef86a`, nine untracked leavings, all nine ignored and none named.
4. **Fill APPROVED-PIN's literal by C.5.3's five steps**, in that order, with OQ-2 answered
   first. The comment inside `LITERAL` carries all five, including step 4, which is F.2
   STOP-10: if `design.test.cjs` must be edited to follow a moved `design.APPROVED` and that
   edit cannot be made honestly, the round stops and the PM decides.
5. **Both cells are RED until both literals are filled, and so is the CI step.** That red is
   the cells working. `rebuild.yml`'s new step carries a comment saying so. Nobody closes it
   by editing a cell. **The PM's Q4 ruling is in that comment too**: the three preparation
   branches merge into `rebuild/b-s9-ui-pins` only, that lane reaches the chain by the S9
   fast-forward, and by then both literals are filled, so the chain tip never sees the red.
   **And these cells cannot run on GitHub's runners at all before the S9 walk passes**: the
   standing step at `rebuild.yml:150` fails first on any branch that does not contain the
   chain tip and GitHub skips every later step. Do not read the absence of a runner result
   as a pending one.
6. **The two cells are declared `role: "new"` and are NOT added to `TOOLING_FILES`**, for the
   same reason the D.2 fence is not (Q5, PM-R4): a cell that audits the sealed set must not be
   exempt from it. Their ignore list and their literals are then sealed bytes, which is what
   makes R16's "a branch that could widen the ignore file could widen the pin" false for this
   cell.
7. **`rebuild.yml` is already an S9 declaration** (E fact 20, `role: "edited"`, product pin),
   so this step rides a hunk that exists. Two other lanes are inserting steps after `:232`
   and after `:306` in the same window; this insertion is at `@@ -297,0 +298,11 @@` and
   overlaps neither.
8. **THE REFUSAL VOCABULARIES ARE SEVEN AND SEVEN after round 3**, and the last row of each
   cell no longer asserts their shape: it DERIVES the set of verbs the rows above actually
   emitted and compares it with the exported `REFUSALS` (R2 N2). If a later round adds,
   renames or strands a refusal, that row is where it is noticed, and it is a sealed byte
   move. Mutations P25 and A15 are that row, executed.
9. **CORRECTED, AND THIS ITEM PREVIOUSLY TOLD YOU NOT TO LOOK.** It used to say APPROVED-PIN's
   `lstat` clause has no Windows row that can kill it. **It has one**: a DANGLING directory
   junction, which needs no privilege. `lstat` succeeds and reports a symlink where `stat`
   throws, so the shipped engine prints `NOT-A-REGULAR-FILE` and the mutant prints `MISSING`,
   on both operating systems (mutation A11, section 6.2, and the row
   `R2 B2` in `approved-pin.test.mjs`). What remains linux-only is a row built from a FILE
   symlink, because an unprivileged Windows process cannot create one (`EPERM`, measured).
   **PACK-PIN's equivalent has no gap either**: `R4 N1.2 (c)` puts a directory junction AT a
   pinned FILE.
10. **APPROVED-PIN HAS SEVEN REFUSALS, NOT FIVE. THE SIXTH IS ORPHAN** (R1 BLOCKING-1; the
   seventh is `UNREADABLE`, item 11).
   It fires for a literal key the run-time list no longer names. It CANNOT fire today,
   because the literal is empty; **it becomes live the moment C.5.3 step 2 fills the map**,
   and from then on a `design.APPROVED` that SHRINKS is named instead of silent. If C-UI-1's
   move drops the two 09-08 references, the run prints two `UNLISTED` lines for the new
   files AND two `ORPHAN` lines for the old ones, and that is correct: it is the day C.5.3
   step 3 re-decides E fact 17's path list. **THE PM HAS NOW CONFIRMED IT (Q1): ORPHAN
   STAYS.** It is the inverse of UNLISTED and it closes the day `design.APPROVED` shrinks,
   which is the very day `design.test.cjs:17` is expected to move. Nothing to decide here
   any more.
11. **RULED AND DONE (Q2): `UNREADABLE` IS THE SEVENTH REFUSAL IN BOTH CELLS, AND IT WAS
   TAKEN NOW** because from S9 the vocabulary is sealed bytes and a later addition costs a
   reseal child. A file the walk cannot read is NAMED and **the walk CONTINUES**, so a second
   defect further down is still named in the same run. Two things about it the integrator
   should know. **(a) The one real-file witness is Windows-only**: R1 built it on the PC with
   a DENY ACE. Neither the PC unprivileged nor a farm scratch (uid 0, where `chmod` proves
   nothing) can build one, so the fixture rows pass an OPTIONAL READER as the engine's LAST
   parameter. **The REAL ROW passes none, and a row in each cell scans the cell's own source
   and asserts that** (mutations P24 and A14). **(b) What is still NOT closed**: an unreadable
   DIRECTORY throws out of `readdirSync`. That is the LOUD RED the file case used to be, never
   a silent green, and closing it would mean a second optional reader for directories. If the
   PM wants it closed, it must be closed BEFORE the literal is taken, for the same reason.
12. **TWO RESIDUALS THE PIN DOES NOT CLOSE, AND MUST NOT BE CLOSED BY WIDENING (R1 N5).**
   (a) A python module at `<pack>/quality/__pycache__/teeth.py` is invisible to the pin by
   construction, and python will import it if `sys.path` reaches it. A row records that as a
   decision; closing it would mean un-ignoring the caches the design machine really leaves
   behind. (b) The N1.3 working-tree shape means ANY future ignored directory inside the
   pack (`.tmp/`, `node_modules/`, a venv) reads as `PACK-PIN ADDED` on the design lane's
   machine. **The right answer is to state that and NOT widen the ignore list to pre-empt
   it**, because the ignore list is the pin's only hiding place.
13. **A LINK AT `quality/run` NOW REFUSES `NOT-A-REGULAR-FILE quality/run`.** That falls out
   of R1 BLOCKING-2's fix and is the spec's shape: `quality/run` is invisible to the pin only
   as a plain directory whose CHILDREN begin `quality/run/`. If the design lane's machine
   symlinks its own output directory, the pin prints one loud line naming it. **THE PM HAS
   CONFIRMED IT (Q3): loud is right. A design machine that links its own output folder hears
   about it once and fixes its folder.** Changing it back is a sealed byte move.
14. **`APPROVED-PIN` NOW EXISTS AS A TOKEN IN TWO FILES WITH TWO MEANINGS (R1 N7).**
   `design.cjs:341` already throws `APPROVED-PIN FAIL: <file>` from `readApproved()`. The
   cell never calls `readApproved` and asserts full exact strings, so it does not fall into
   that trap - but **a future row or a future grep matching `/APPROVED-PIN/` can be satisfied
   by `design.cjs`'s message rather than by the cell.** Match the whole refusal, never the
   prefix.
15. **THE DESIGN LANE'S OWN CHECKOUT CARRIES UNTRACKED GATE OUTPUT INSIDE THE PACK TODAY**
   (R1's measurement, added to item 3): 8 files under `quality/run/` and one
   `quality/__pycache__/*.pyc` at `ecbef86a`. So C.5.1 step 5 run on that machine exercises
   the ignore list for real rather than hypothetically. R2 re-measured it as **913 on disk
   against 904 tracked**, nine leavings, all ignored, none named. **If step 5 ever returns
   `PACK-PIN ADDED` for a path under `quality/run/` or with a `__pycache__` segment, the
   ignore list has been changed, not the pack.**
16. **THE PACK ROOT IS THE ONE ENTRY THE WALK NEVER SEES (R2 B1).** If a day-of run ever
   prints `PACK-PIN PACK-ROOT-ABSENT` for a path that visibly EXISTS on disk, the pack root
   is a LINK and the refusal is correct: `lstat` at the root is deliberate, and a junction
   standing there over a twin whose bytes match the literal line for line is exactly the
   attack the row `R2 B1` builds. Do not "fix" it by following the link.
17. **A LITERAL LINE NAMING A PATH OUTSIDE THE PACK IS BENIGN (R2 N3), AND THAT IS BY
   CONSTRUCTION AND NOT BY LUCK.** `..`, a leading slash, a drive letter and `./` each come
   back as one `PACK-PIN MISSING <path>` line: the engine never OPENS a literal path, it only
   asks the Map the walk built. A row measures all four. A BACKSLASH in a literal path still
   fails HARD, because that is a spelling defect that would make the cell's own constant
   disagree with its own walk on one operating system.

## 10. WHERE I THINK A REVIEWER SHOULD PUSH, AND WHAT I DECIDED ON MY OWN

These are choices the spec and R4 did not settle. Each is a place I made a call; each is a
place the review may overrule me, and none of them is load bearing for a refusal.

1. **The order of PACK-PIN's two pre-head refusals.** I judge the checkout before the cell:
   `PACK-ROOT-ABSENT` wins over `LITERAL-EMPTY`. The argument for the other order is that an
   unfilled literal is the more fundamental defect. I preferred this order because it produces
   the three-rung ladder of section 4, where each rung is the honest next thing to fix.
2. **APPROVED-PIN's refusals come back in `design.APPROVED`'s order, not in path byte
   order.** R4 N1.1 as adopted says "sort by path BYTES". I read that as a rule about the
   PACK-PIN list and about path spelling on two operating systems, and `design.APPROVED`'s
   order is deterministic and identical on both. The order matters to a reader because
   `design.cjs`'s own asserts speak of `approved[0]` and `approved[1]`, and `design.cjs:26-41`
   says in terms that the order is load bearing. The one place APPROVED-PIN sorts, its literal
   map's key order, IS byte-sorted and asserted. **If the PM reads N1.1 as covering the
   refusal order too, this is a two-line change and a row.**
3. **A malformed or duplicated literal line fails HARD rather than refusing.** A broken
   literal is a defect in the cell's own constant and not a fact about the tree, so it is not
   in the vocabulary. **That decision survives round 3's seventh refusal**: `UNREADABLE` is a
   fact about the TREE, which is the line the vocabulary is drawn on. A reviewer may still
   prefer a refusal for a broken constant; it would be an eighth, and a sealed byte move.
4. **An irregular entry is named ONCE.** It refuses `NOT-A-REGULAR-FILE` and takes no part in
   MISSING or ADDED, so a link standing where a pinned FILE is pinned prints one line and not
   two. The directory case is deliberately different and prints both: the junction is named
   and the files beneath it are `MISSING`, which is what proves the walk did not descend.
5. **The scale row asserts no time threshold**, only green over 904. I think a threshold here
   would be a flake generator on this PC; someone may want a very loose ceiling anyway.
6. **The `rebuild.yml` step makes this lane branch's CI red.** Section 5 says what I would
   want ruled. I did not hold the hunk back on my own because the ticket names it as mine.

## 11. WHAT I DID NOT VERIFY, SAID SO IT IS NOT ASSUMED

1. **I never read the real pack.** `rebuild/m1/approved-2026-09-18/` is not on this branch and
   I did not go and get it. Every shape figure in this report (904 files, 850 under
   `quality/`, 42 under `app/`, 8 under `ref/`, 3 under `states/`) is quoted from C.5.1 and
   R4, which measured it at `ecbef86a`, and my synthetic 904-file fixture is built to those
   numbers, not to a reading of the pack.
2. **I did not run the design gates** (`gate.py`, `statesheet.py`) and this report says
   nothing about what they would do on a runner. R4 section 2.2 is the measurement there.
3. **I did not run GitHub CI.** The both-OS evidence in section 5 is the PC and a linux farm
   scratch of the pushed head. The `rebuild-public` run for `a32a6dfa` and later will be the
   runner evidence, and this step is expected red there for the reason in section 5.
4. **I did not verify the line numbers this report and the cells cite inside
   `b-package.cjs`** (`:1201`, `:1970`, `:1972`), nor `design.test.cjs:15-:20`, `:17`, `:25`,
   `:26`, `:184`. They are carried from the spec and R4. I DID read
   `rebuild/m3/w7-preview/today/design.cjs` at `:43-:48` and `:330-:348` and both cites in the
   cells' headers are correct at the line: `APPROVED` is a frozen two-entry array and
   `readApproved` asserts each file against `entry.sha256`.
5. **I did not touch, read or list** `rebuild/conform/private`, `src/history.js`, any
   `ledger/` directory, the owner's port folder, the protected soak, or the design lane's
   worktrees. I ran no `b-package.cjs`, no seal generator and nothing that writes a receipt or
   an artifact. The only links either cell creates are inside its own `mkdtemp` fixture
   folders, which it removes again; nothing anywhere in the repository is linked to.
6. **No owner measurement is anywhere in these cells.** Every fixture byte is written by the
   cell itself into a `mkdtemp` folder and removed again.

## 12. STOP CONDITIONS: NONE FIRED

STOP-9(a) does not fire: all three path-naming refusals are built and all six of B.8's rows
fail by name. STOP-9(b) does not fire: nothing here narrows the pin, and `quality/**` and
`README.md` are inside it. STOP-10 and STOP-11 are day-of conditions and belong to the
integrator, not to this round. No file outside the owned list needed an edit.

**AND THE FIX ROUND FIRES NONE EITHER.** STOP-9(b) is the one to check hardest, because it
stops the round if the pin is NARROWED. **The fix round WIDENS it in both places and narrows
it nowhere**: a regular file at `quality/run` and a regular file named `__pycache__` were
outside the pin and are now inside it, and `quality/**` and `README.md` are still inside. The
sixth APPROVED-PIN refusal only adds a statement. No law, guard, pin or test was weakened,
skipped or deleted, and no row was loosened: the ten new rows are all additional, and the
three existing rows whose expectations changed (`C.5.3`, `the file list is re-read`, `the
verdict comes from THIS cell's literal`) each gained a true line or named both files, which
section "R1 findings" states one by one.

**AND ROUND 3 FIRES NONE EITHER, checked the same way.** STOP-9(a): every path-naming refusal
is built, the seventh (`UNREADABLE`) names the path too, and all six of B.8's rows still fail
by name. STOP-9(b): **round 3 narrows the pin nowhere.** It ADDS a refusal, so a file that
used to make the walk THROW is now named and the walk goes ON: strictly more is judged, never
less. The optional reader does not narrow it either, because the REAL ROW passes none and a
row in each cell asserts that by reading the cell's own source (mutations P24 and A14).
STOP-10 and STOP-11 remain day-of conditions and belong to the integrator. **No law, guard,
pin or test was weakened, skipped or deleted in round 3**: eleven rows were added, one clause
was added to each engine, and the only existing row whose text changed is each cell's last
one, which now asserts MORE than it did (the derived vocabulary, R2 N2). **No file outside
the owned list needed an edit**, so nothing needs routing to the PM.

---

## R1 findings: fixed or disputed

`S9-PREP-PACK-REVIEW-R1.md`, verdict REJECT with three BLOCKING and eleven notes. Every
measurement below is mine, at the fix head, on both operating systems, unless it says
otherwise.

### The blocking three: all ACCEPTED, all FIXED, each red first

**B1. APPROVED-PIN has no ORPHAN refusal. ACCEPTED AND FIXED (`baf0e88` red, `3601e01`
green).** The finding is exactly right and I reproduced it before changing a line: at
`baf0e88`, with the ORPHAN rows written and the engine untouched, the row
`R1 B1: the shrunk list plus an edit of the dropped file` was RED, which is the measurement
that the old engine returned `[]` for a shrunk list whose dropped file had been edited. The
sixth refusal `APPROVED-PIN ORPHAN <path>` now walks the literal's own keys, after every
per-file refusal, in path byte order. Mutations A8, A9 and A10 kill 5, 1 and 3 rows on BOTH
operating systems. **I took R1's remedy (i) and not (ii)**, because (ii) needs a PM ruling an
author cannot give himself and because (i) errs towards more coverage; the cell header and
integrator item 10 say so in terms, so the PM can still choose (ii) cheaply. R1's argument
that `design.test.cjs:17` is not a mitigation is the part I want to underline: it is the very
line C.5.3 step 4 expects C-UI-1 to edit, so the guard moves with the thing it guards.

**B2. The ignore list was WIDER than C.5.1's. ACCEPTED AND FIXED (`8195f1d` red, `264f7d0`
green).** Both clauses were one character too generous and I reproduced both before fixing:
at `8195f1d` the rows `a regular FILE at quality/run is ADDED` and `a regular FILE named
__pycache__ is ADDED` were RED. The prefix is matched with its slash only, and the
`__pycache__` segment rule excludes the FINAL segment, which is what C.5.1's two
trailing-slash spellings say. The directory cases are provably unchanged: the walk descends
`quality/run` and skips every child by prefix, and descends a `__pycache__` directory and
skips every child by segment, and the fixture's green control still passes on both OS.
Mutations P18 and P19 are the two regressions and each dies. **The behaviour change R1 asked
the PM to weigh is stated rather than buried**: a LINK at `quality/run` now refuses
`NOT-A-REGULAR-FILE quality/run` instead of being skipped. I took that as the spec's shape
(`quality/run` is invisible only as a plain directory), wrote a row for it, and put it in the
integrator list as a PM call. I confirm R1's "this is a hiding place, not a present miss":
his enumeration of the real pack is his, not mine, and I did not go and check it.

**B3. Three guard clauses with no row, and P13's wrong Windows column. ACCEPTED AND FIXED
(`8195f1d`).** The three uncovered guards now have one row each and each mutation kills one
row on BOTH operating systems: P14 (`label()`'s repo-relative branch), P15 (the backslash
assert), P16 (the sortedness clause). **P13 I fixed rather than merely re-counted**, which is
where I go further than R1 asked. R1's structural explanation is right - the directory-link
row pins a file UNDER the junction, so `irregular.has(e.file)` is false there - but the
conclusion "on the PC this guard is decoration" is escapable: a directory junction needs no
privilege and can be created AT the path of a pinned FILE. The new row `R4 N1.2 (c)` does
that, and P13 now kills 2 rows on linux and **1 on Windows** instead of 0. The table's
claimed "linux 2, Windows 1" was wrong as written and is now true as measured.

### The eleven notes

**N1. `P1` also turns the real row green and the table did not flag it. ACCEPTED AND FIXED.**
Re-measured: P1 kills 3 rows on both and the real row turns GREEN on both. The 6.1 table now
flags it exactly as it flags A2 and A6. Table accuracy only; the mutation is still killed.

**N2. The rest of the table is approximate. ACCEPTED, AND ANSWERED BY REBUILDING IT.** R1
found two count errors in the five rows it re-ran, which is a fair reason to distrust the
other fourteen. Rather than argue, section 6 is re-measured end to end by a harness on both
operating systems, twenty-nine mutations, and the two corrections R1 named (A7 kills 1 on
Windows not 2; P13's column) both reproduce.

**N3. An unreadable pinned file THROWS instead of refusing by name. ACCEPTED AS A FACT,
DISPUTED AS A FIX FOR THIS ROUND.** The source fact is true on both OS and I confirm it by
reading: `walk` calls `fs.readFileSync` with no guard. I did NOT add a seventh refusal, for
three reasons stated so the PM can overrule them: R1 itself says "worth a ruling before the
bytes are sealed; not worth a fix round on its own"; the ticket enumerates six refusals for
this cell and the vocabulary becomes SEALED bytes at S9; and the failure is LOUD RED, which
is a different class from B1 and B2, both of which were silent green. It is integrator item
11 so it cannot be lost, and it is the one open question I most want answered before the
literal is taken. I did not re-measure the DENY-ACE half: R1 measured it on this PC and
neither of us can measure the linux half, because the farm scratch runs as uid 0.

**N4. The literal parser was tolerant in two ways C.5.1 is not. ACCEPTED AND FIXED (red
first).** Both halves. The silent re-sort is gone: sortedness is ASSERTED and an unsorted
literal now fails hard, so the cell can claim the pasted lines are the ones step 3 emitted
(row red at `8195f1d`, mutation P16). The double space no longer parses as a trailing-space
path: the line regex forbids a leading or trailing space in the path, so a typo in the cell's
own constant is one hard failure instead of two invented facts about the tree (row red at
`8195f1d`, mutation P17).

**N5. Two residuals the report should carry. ACCEPTED AND CARRIED, AND (a) GAINS A ROW.**
(a) is now integrator item 12(a), a paragraph in the cell header, and a row that asserts the
hole: if a later round narrows the ignore list, that row goes red and somebody has to think.
(b) is integrator item 12(b), with R1's own conclusion kept intact: **state it, do not widen
the list to pre-empt it.**

**N6. `assert.equal(err, "EPERM")` pins a foreign machine's errno. ACCEPTED AND FIXED.** Both
cells' `R4 N1.2 (a)` rows now assert that the code is a non-empty string and PRINT it
(`PACK-PIN file-link on win32 is unbuildable unprivileged, code: EPERM` on this PC), so the
row records the measurement instead of pinning it. A runner that SUCCEEDS takes the other
branch and runs the whole attack, which is the outcome to prefer. This is not a loosening to
go green: CI has never run this branch, so nothing was red.

**N7. The token `APPROVED-PIN` now exists in two files with two meanings. ACCEPTED AND
CARRIED**, as integrator item 14, with R1's rule: match the whole refusal, never the prefix.

**N8. `design.APPROVED` naming the same file twice is green in the engine. ACCEPTED AS
BENIGN AND NOW STATED.** The cell header says it in terms and gives the reason: the live case
is covered by the row that asserts the real list holds no duplicate, and the engine keeps no
opinion about a caller's list shape. It is a decision now, not an oversight.

**N9. The red-first counts are the Windows ones. ACCEPTED AND FIXED** in section 3, which now
names its OS and carries R1's linux figures with attribution.

**N10. The day-of cost against the real pack. ACCEPTED AND CARRIED, AS HIS.** Section 7 now
leads with R1's real-pack measurement (21 MB, zero refusals, 55 ms cold / 46 ms warm, and one
flipped bit named) and marks it as his, because the pack is on neither this branch nor this
PC. My synthetic figures are re-measured: 57 to 59 ms on the PC, 12 ms in the farm.

**N11. The `rebuild.yml` step makes this branch's CI red, and the same red arrives on the
chain tip. ACCEPTED, AND STILL NOT MINE TO DECIDE.** I agree with both authors' framing and
I add nothing to it except R1's correction, which is now in section 5: the ruling is about
merge order, not about this branch's badge. **I did not hold the hunk back and I did not
touch one line of `rebuild.yml` in this round**, because the ticket names the step as the
author's and because moving it now would disturb a region two other lanes are merging into.

### What I did NOT verify in this round

1. **GitHub CI**, still. No `rebuild-public` run exists for any head of this branch that I
   have seen; my both-OS evidence is this PC and a farm scratch of the pushed head.
2. **The real pack, on either OS.** It is not on this branch. Every real-pack figure in this
   document is R1's, attributed. C.5.1 step 5 on Windows remains the integrator's job.
3. **R1's own enumeration of the pack** (904 tracked paths, zero at `quality/run`, zero with
   a `__pycache__` segment, the 9 untracked gate leavings). I carry those as his.
4. **The four first-build commits' red-first counts.** They are the first author's and R1
   re-ran them; I re-ran only the fix round's own two red commits.
5. **The linux half of N3**, which neither of us can build: the farm scratch runs as uid 0.
6. **Line numbers inside `b-package.cjs` and `design.test.cjs`.** Carried from the spec, R4
   and R1. I did read `rebuild/m3/w7-preview/today/design.cjs` and confirm `APPROVED` is a
   frozen two-entry array and that `readApproved` throws `APPROVED-PIN FAIL:`.
7. **I read nothing forbidden.** No `rebuild/conform/private`, no `src/history.js`, no
   `ledger/`, no port folder, no protected soak, no design-lane worktree. I ran no
   `b-package.cjs`, no seal generator, and nothing that writes a receipt or an artifact, and
   I created no junction into any tree: the only links either cell makes are inside its own
   `mkdtemp` fixtures, which it removes. My mutation harness wrote a mutated COPY beside each
   cell and deleted it every time; `git status --porcelain` on the worktree is empty. No
   owner measurement is anywhere in this round.

---

## R2 findings and the PM's rulings: fixed or disputed

`S9-PREP-PACK-REVIEW-R2.md` rejected the second build on two BLOCKING findings and five
notes, and it did so on an independent harness rather than on a reading: it reproduced
fifteen of the twenty-nine mutation rows on both operating systems with every count matching,
ran the blind attack plan with byte-identical output on both, and walked the REAL pack in the
farm. **I accept both BLOCKING findings and all five notes. I dispute nothing in R2.** Below,
each one with the measurement that closes it, and then the PM's four rulings.

### The two BLOCKING findings

**B1. The pack-root `lstat` had no row. FIXED, by ONE fixture row and no engine line.**
R2 is exactly right, and the point is not tidiness: the pack root is the one entry the walk
never sees, so a junction standing there over a twin whose bytes match the literal line for
line was GREEN under the mutant while the tree had changed. That is R4 section 2's
green-while-changed one level up. The row is
`R2 B1: a LINK standing AT the pack root is ABSENT, even over a twin that matches`; it
asserts the fixture is green through its own root FIRST, then that the twin reads back the
same bytes through the link, then the refusal. Measured by me, both operating systems:
shipped `41 / 40 / 1`, mutant (`lstatSync(packRoot)` to `statSync(packRoot)`) `41 / 39 / 2`,
**the one extra red being this row and nothing else**. Before this round that mutant killed
**zero** rows on either OS. It is mutation P20 in section 6.1 and integrator item 16.

**B2. APPROVED-PIN's `lstat` guard was reported unclosable on Windows, and the reason given
was false. FIXED, by ONE fixture row and no engine line, and the sentence is corrected in
three places.** R2's measurement is the one I reproduced: a DANGLING link is a second entry
for which `lstat` and `stat` disagree at a file path, `lstat` succeeds and reports a symlink
where `stat` throws, and a directory junction needs no privilege on Windows. The row is
`R2 B2: a DANGLING link at a named reference refuses NOT-A-REGULAR-FILE, on both OS`; it
proves the link outlives its target and that `stat` fails where `lstat` does not, and it
PRINTS the `stat` code rather than pinning it (`ENOENT` on win32 and on linux, measured, and
R1 N6's rule says a foreign runner's errno is not a fixture's business). Shipped
`25 / 24 / 1`; mutant `25 / 23 / 2` on Windows (was `25 / 24 / 1`, killing nothing) and
`25 / 22 / 3` on linux, the extra linux row being the FILE-link row that takes the EPERM
branch on Windows by construction. **Corrected in: section 6.2 (the old paragraph is kept and
marked wrong, because the wrong sentence is the one a later round would have believed),
integrator item 9, and the cell's own comment.** It is mutation A11.

### The five notes

| R2 note | verdict | what closed it |
|---|---|---|
| **N1** integrator item 3 carries a stale 16 | **FIXED** | it says **23** now, with the reason the old figure existed (25 rows, the first build). I re-measured P10 rather than copying R2's number, and 23 is what my harness printed on the PC |
| **N2** the vocabulary row's title is a claim it does not make | **FIXED** | each cell now records every refusal as the engine returns it and the last row DERIVES the verb set and compares it with `REFUSALS`, in both directions. Mutations P25 and A15 kill that row, so it is load bearing and not decoration |
| **N3** a literal path outside the pack is benign and the cell should say so | **FIXED** | one paragraph and one row (`../../etc/hosts`, `./x`, `/etc/hosts`, `C:/Windows/win.ini`, in byte order, four MISSING lines), and the same row re-asserts that a BACKSLASH still fails hard, with the reason the two are different classes |
| **N4** `Object.hasOwn` is a real hardening with no row | **FIXED** | the row asserts `constructor`, `toString` and `__proto__` come back UNLISTED. Mutation A12 (`file in literal`) kills it on both operating systems; before, it killed nothing |
| **N5** the fixture prefix collides with the lane's own scratch prefix | **FIXED** | every `mkdtemp` in both cells is `s9cpin-` now. R2's trap is real and it would have produced a failure that looks like a defect in the pin |

### The PM's four rulings, and what each one cost

| ruling | what I did |
|---|---|
| **Q1 ORPHAN CONFIRMED** | nothing to build; integrator item 10 stops asking |
| **Q2 UNREADABLE, NOW** | the only engine change in this round. Seventh refusal in BOTH cells, the walk CONTINUES, an optional reader as the LAST parameter that only fixture rows pass, and a source-scan row in each cell asserting the REAL ROW passes none. Rows committed RED first at `5563dca` on both operating systems |
| **Q3 a link at `quality/run` is LOUD** | confirmed; the existing row and integrator item 13 now say the PM ruled it |
| **Q4 the step STAYS, red, with its comment** | eleven comment lines in `rebuild.yml`, no step change. The merge order and the `:150` fact are in the comment, in section 5 and in integrator item 5 |

**ON Q4's RELATED FACT, WHICH CHANGES WHAT THIS DOCUMENT MAY CLAIM.** The PM measured that
on any branch that does not contain the chain tip, or that carries undeclared sealed edits,
the standing step at `rebuild.yml:150` fails FIRST and GitHub SKIPS every later step. So the
two previous rounds' "no `rebuild-public` run exists for this branch that I have seen" was
the right observation with the wrong implication: **there is nothing to wait for.** These
cells cannot run on GitHub's runners until the S9 walk passes. **The PC and a linux farm
scratch ARE the both-OS evidence**, and section 5 is that evidence, run at the pushed head on
both. I have stopped describing a missing runner result as pending.

### What I did NOT verify in round 3

1. **GitHub CI, and now for a stated reason rather than as an absence.** See Q4 above.
2. **The real pack, on either operating system.** Still not on this branch and not on the PC.
   Every real-pack figure in this document is R1's or R2's, attributed. C.5.1 step 5 on
   Windows remains the integrator's job and is the step I would least like skipped.
3. **Fourteen of the twenty-nine inherited mutation rows.** I re-measured every row that
   bears on code this round touched (P3', P4', P5', P6', P13a', P13b', A3', A5', A7') and
   every row this round added (P20 to P25, A11 to A15), on BOTH operating systems, by
   harness. The rest are carried from the R1 round's table, which R2 independently
   reproduced for fifteen of them with every count matching.
4. **A real unreadable file on either machine.** R1's DENY-ACE measurement on the PC is the
   one real-file witness and it is Windows-only; the farm runs as uid 0, where `chmod` proves
   nothing. That is exactly why the reader is a parameter and why a row asserts the real row
   does not use it.
5. **An unreadable DIRECTORY.** Not closed, stated: it throws out of `readdirSync`, which is
   loud red and never a silent green. Integrator item 11(b).
6. **`scripts/` and any local runner**, which is outside the farm's include list, so I cannot
   check whether a local bar globs `rebuild/lanes/c/ui-port/`. R2 names the same gap.
7. **I read nothing forbidden in this round either.** No `rebuild/conform/private`, no
   `src/history.js`, no `ledger/`, no `EarnedPort`, no `port-real.log`, no protected soak, no
   design-lane worktree. I ran no `b-package.cjs`, no seal generator, and nothing that writes
   a receipt or an artifact. I created no junction into any tree: every link in either cell is
   inside a `mkdtemp` folder the cell makes and removes. My mutation harness wrote a mutated
   COPY beside each cell, ran it and deleted it every time, on both machines; the farm scratch
   is `/home/claude/farm/scratch/wt/s9cAuthC` and nothing in it is pushed. **No owner
   measurement is anywhere in this round: every fixture byte is generated by the cell that
   uses it.**
