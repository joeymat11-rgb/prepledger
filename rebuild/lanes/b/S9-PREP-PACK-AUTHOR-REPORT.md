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

---

## 1. WHAT LANDED

| path | what it is |
|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | NEW. PACK-PIN: the whole owner-approved pack, pinned by a literal sorted `(path, sha256)` list read from the WORKING TREE. 568 lines, 25 rows |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | NEW. APPROVED-PIN: whatever `design.APPROVED` names at run time, pinned parametrically against this cell's own literal map. 376 lines, 16 rows |
| `.github/workflows/rebuild.yml` | ONE new step, a pure insertion of 11 lines at `@@ -297,0 +298,11 @@` |
| `rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md` | this file |

**Nothing else is touched.** `git status` on the worktree is empty apart from these four, and
the diff against `da9f8683` is four files.

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

**The PC (Windows 11, node v24.19.0), worktree `%TEMP%\earned-s9c` at `a32a6dfa`.**
This is the bar of record.

| suite | tests | pass | fail |
|---|---|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | 25 | 24 | 1 |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | 16 | 15 | 1 |
| the two together, which is the CI step's exact command | 41 | 39 | 2 |
| `rebuild/m3/w7-preview/today/test/design.test.cjs`, unchanged | 11 | 11 | 0 |

**Linux (a farm scratch worktree made with `farm-scratch.sh s9c a32a6dfa` from the PUSHED
head, node v22.22.2, 2 CPUs).**

| suite | tests | pass | fail |
|---|---|---|---|
| the two cells together | 41 | 39 | 2 |

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

**THE STEP IS RED ON THIS BRANCH AND THAT IS THE DESIGN.** `rebuild.yml` fires on every push
to `rebuild/**` on ubuntu and windows, so CI for `rebuild/b-s9-prep-pack` will show this step
failing with the two real rows. The step's own comment says so in the file, so the red is not
mistaken for a defect and is not closed by editing the cells. It goes green the day the S9
integrator fills the two literals. **If the PM would rather this branch's CI be green, the
only honest ways are to hold the `rebuild.yml` hunk back until the re-measure, or to merge the
pack first; I have not chosen either on my own because the ticket names the step as mine to
add. This is the one thing in this round I would most like a ruling on.**

## 6. THE MUTATION TABLE, MEASURED

Every refusal and every guard clause was removed or inverted, one at a time, in a copy of the
cell placed beside it (so `import.meta.url` still resolves to the same repository root), the
copy was run, and the copy was deleted. **The two real rows are red on this branch whatever
the mutation is, so they are excluded from "the row that goes red" below unless a mutation
made one of them GREEN, which is called out.**

P-rows were run in the linux farm scratch unless the column says otherwise; the three that
can only be judged on Windows were run on the PC and are marked. Nothing in the tree was left
mutated: `git status` is clean.

### 6.1 PACK-PIN

| # | what was removed or inverted | the rows that go red | killed? |
|---|---|---|---|
| P1 | the `PACK-PIN PACK-ROOT-ABSENT` refusal | the two PACK-ROOT-ABSENT rows and the precedence row (3) | yes |
| P2 | the `PACK-PIN LITERAL-EMPTY` refusal | the LITERAL-EMPTY row (1) | yes |
| P3 | the `PACK-PIN MISMATCH` push | B.8 (1) (2) (3) (4), the anchor row, the 904-file mismatch row, the working-tree re-read row (7) | yes |
| P4 | the `PACK-PIN MISSING` push | B.8 (6) and the directory-link row (2) | yes |
| P5 | the `PACK-PIN ADDED` loop | B.8 (5) and the forward-slash / byte-order row (2) | yes |
| P6 | `lstat` replaced by `stat`, so links are followed | linux: both link rows (2). **Windows: the directory-link row only (1)** | yes, on both |
| P7 | the ignore list un-anchored to a segment match anywhere | 15 rows, including both green controls and the anchor row | yes |
| P8 | the `__pycache__` segment rule | 15 rows, including both green controls | yes |
| P9 | `Buffer.compare` replaced by the default string sort | the comparator row (1), on Windows and on linux | yes |
| P10 | the walk emits the platform separator instead of `/` | **linux: NOTHING (it survives). Windows: 16 rows** | yes, ON WINDOWS ONLY |
| P11 | the malformed-literal-line assert | the malformed-literal row (1) | yes |
| P12 | the duplicate-literal-path assert | the malformed-literal row (1) | yes |
| P13 | an irregular entry skipped silently instead of named | linux: both link rows (2). **Windows: the directory-link row only (1)** | yes, on both |

**P10 is the measurement R4 N1.1 was written for, and it is the reason the ruling says the
Windows run is where the rule is proved.** On linux `path.sep` IS `/`, so the mutation is a
no-op and not one row moves: a cell developed only in the farm would ship a walk that spells
`quality` and `gate.py` with a backslash between them and would put 904 red lines on the
first `windows-latest` run. On the PC the same mutation turns 16 of the 25 rows red. Both
numbers are in this table because the pair is the evidence, not either one alone.

**P7 and P8 are worth reading together.** Un-anchoring the ignore list does not merely let the
decoy out of the pin; it turns the fixture's ordinary green control red as well, because the
fixture's own `quality/run/` and `__pycache__` entries stop being matched the way the
manifest expects. Either way the cell notices loudly, which is the behaviour R3 N5's second
half asked for.

### 6.2 APPROVED-PIN

| # | what was removed or inverted | the rows that go red | killed? |
|---|---|---|---|
| A1 | the `APPROVED-PIN LIST-EMPTY` refusal | the LIST-EMPTY row and the run-time re-read row (2) | yes |
| A2 | the `APPROVED-PIN UNLISTED` refusal | the UNLISTED row, the C.5.3 row, the run-time re-read row, the refusal-order row (4). **AND THE REAL ROW TURNS GREEN** | yes |
| A3 | the `APPROVED-PIN MISSING` refusal | the MISSING row (1) | yes |
| A4 | `lstat` replaced by `stat` | **linux: the file-link row (1). Windows: NOTHING** | yes, ON LINUX ONLY |
| A5 | the `APPROVED-PIN MISMATCH` push | the MISMATCH row, the coordinated-edit row, the "verdict comes from this cell's literal" row (3) | yes |
| A6 | `namesOf` carries `design.APPROVED`'s own sha256 through and the engine trusts it | the coordinated-edit row, the "verdict comes from this cell's literal" row, the forward-slash row (3). **AND THE REAL ROW TURNS GREEN** | yes |
| A7 | the `APPROVED-PIN NOT-A-REGULAR-FILE` refusal (lstat kept) | both link rows on Windows and on linux (2) | yes, on both |

**A2 and A6 are the two mutations that make the real row GREEN, and they are the two that
matter most.** A2 is R4 N8 exactly: drop UNLISTED and a cell whose literal is empty passes
over a list it pins nothing in. A6 is R1 BLOCKING-4 turned into a structure: let the sha come
from `design.APPROVED` and the cell agrees with the constant it exists to check, so the
coordinated edit is green again and the real row is green on a branch where nothing is
pinned. **A reviewer who wants one thing to attack should attack these two: if either can be
re-introduced without a fixture row going red, the cell is decoration.**

**A4 IS AN OS DIFFERENCE I CANNOT CLOSE, AND I REPORT IT RATHER THAN BENDING ANYTHING.**
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
| the PC (Windows 11, node v24.19.0, shared with at least six other lanes) | **60 ms** |
| a farm scratch (linux, node v22.22.2, 2 CPUs) | **27 ms** |

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
`<path> <space> <64-hex>`, on a literal path spelled with a backslash, and on a path listed
twice: those are defects in the cell's own constant, not facts about the tree, and they do
not belong in the refusal vocabulary. It then walks the working tree, building each
pack-root-relative path with `/` and never with the platform separator, skipping an entry
whose path begins `quality/run/` or contains a `__pycache__` segment BEFORE it looks at the
entry's type, `lstat`ing everything else, descending only into plain directories, hashing
only regular files, and naming anything else `PACK-PIN NOT-A-REGULAR-FILE <path>` without
reading or descending it. It compares the literal in path byte order, emitting
`PACK-PIN MISSING <path>` and `PACK-PIN MISMATCH <path>`, then `PACK-PIN ADDED <path>` in
byte order, then the irregular entries in byte order. An irregular entry is named ONCE and
takes no part in the MISSING and ADDED comparisons, so one defect prints one line.

**APPROVED-PIN.** One engine, `approvedPin(root, files, literal)`. The file list is read from
`design.APPROVED` at run time on every run by `namesOf`, which returns STRINGS and drops the
`sha256` field, so no channel exists by which the cell could satisfy itself from the constant
it is checking. An empty or absent list refuses `APPROVED-PIN LIST-EMPTY`. Each named file
gets exactly one refusal, in the order `UNLISTED` (this cell holds no literal for the path,
so it can say nothing else about it), `MISSING`, `NOT-A-REGULAR-FILE` (`lstat`, never
follow), `MISMATCH`. Refusals come back in `design.APPROVED`'s own order, which is identical
on both operating systems and is the order `design.cjs`'s own asserts speak in
(`approved[0]`, `approved[1]`); the one place the cell sorts, the literal map's key order, is
sorted by path bytes and asserted to be so.

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
   on linux and turns 16 rows red on Windows. v3's 53-file value `6121aa91...` is superseded
   and must not be used.
4. **Fill APPROVED-PIN's literal by C.5.3's five steps**, in that order, with OQ-2 answered
   first. The comment inside `LITERAL` carries all five, including step 4, which is F.2
   STOP-10: if `design.test.cjs` must be edited to follow a moved `design.APPROVED` and that
   edit cannot be made honestly, the round stops and the PM decides.
5. **Both cells are RED until both literals are filled, and so is the CI step.** That red is
   the cells working. `rebuild.yml`'s new step carries a comment saying so. Nobody closes it
   by editing a cell.
6. **The two cells are declared `role: "new"` and are NOT added to `TOOLING_FILES`**, for the
   same reason the D.2 fence is not (Q5, PM-R4): a cell that audits the sealed set must not be
   exempt from it. Their ignore list and their literals are then sealed bytes, which is what
   makes R16's "a branch that could widen the ignore file could widen the pin" false for this
   cell.
7. **`rebuild.yml` is already an S9 declaration** (E fact 20, `role: "edited"`, product pin),
   so this step rides a hunk that exists. Two other lanes are inserting steps after `:232`
   and after `:306` in the same window; this insertion is at `@@ -297,0 +298,11 @@` and
   overlaps neither.
8. **The refusal vocabularies are asserted by a row in each cell** (six for PACK-PIN, five for
   APPROVED-PIN). If a later round adds or renames a refusal, that row is the place it is
   noticed, and it is a sealed byte move.
9. **APPROVED-PIN's `lstat` clause has no Windows row that kills it** (mutation A4, section
   6.2), because an unprivileged Windows process cannot build a file symlink. The refusal it
   feeds IS killed on both. If a later round gains a privileged Windows runner, the row to
   strengthen is `R4 N1.2 (a)` in `approved-pin.test.mjs`.

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
3. **A malformed or duplicated literal line fails HARD rather than refusing.** I kept the
   refusal vocabulary at exactly the six and the five the ticket named, and treated a broken
   literal as what it is: a defect in the cell's own constant. A reviewer may prefer a seventh
   refusal.
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
