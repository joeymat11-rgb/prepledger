# S9-PREP-PACK REVIEW R3 - independent re-check, round 3

**VERDICT: REJECT.** One BLOCKING finding, closable with ONE fixture row and NO engine line,
in the shape R2's two blocking findings had. Everything R2 raised is FIXED and I reproduced
each fix on both operating systems. The PM's four rulings are all taken. The engines are
sound: I mutated every guard clause, assert and refusal push in both of them, one at a time,
on both operating systems, and 62 of the 73 clauses I enumerated go red on at least one of
them. The one blocking finding is the last unrowed clause that a single deterministic row
can close, and I built that row and measured it green against the shipped engine and red
against the mutant before writing this line.

Reviewed head: `428eb4a5`, which is the head the author reports. Farm sync confirms it; the
round read is `00de8761..428eb4a5`, 5 files, 1131 insertions and 117 deletions. The author's
report is a hypothesis and I treated it as one: every number below is my own measurement on
my own harness, and where the author's number and mine differ I say so.

## 1. THE BAR, RE-RUN BY ME, AT `428eb4a5`, ON BOTH OPERATING SYSTEMS

**The PC (Windows), `%TEMP%\earned-s9c` after `git pull --ff-only`, at `428eb4a5`, worktree
clean before and after.** I edited nothing there but this file.

| suite | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | 41 | 40 | 1 | 0 | 0 |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | 25 | 24 | 1 | 0 | 0 |
| the CI step's exact command, the two together | **66** | **64** | **2** | **0** | **0** |
| `rebuild/m3/w7-preview/today/test/design.test.cjs`, unchanged | 11 | 11 | 0 | 0 | 0 |

**Linux, the farm scratch `/home/claude/farm/scratch/wt/s9crevC`, made with
`farm-scratch.sh` at the PUSHED head `428eb4a5`, running as uid 0.**

| suite | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | 41 | 40 | 1 | 0 | 0 |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | 25 | 24 | 1 | 0 | 0 |
| the two together | **66** | **64** | **2** | **0** | **0** |

The author's section 5 counts are exactly these. The two red rows are the two REAL ROWS and
nothing else, on both, and the refusal text is byte identical on both, forward slashes and
all:

```
PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
```

So the measured answer to "which refusal does each real row print on this branch" is
PACK-ROOT-ABSENT for PACK-PIN (the pack has not merged, and the root is judged before the
literal) and two UNLISTED lines for APPROVED-PIN. Confirmed on both operating systems.

The three console lines the rows print, measured by me: `PACK-PIN over 904 files on linux:
18 ms` and `on win32: 60 ms`; `PACK-PIN file-link on win32 is unbuildable unprivileged, code:
EPERM`; `APPROVED-PIN dangling link on linux: stat says ENOENT` and the same on win32.

**RED FIRST, verified rather than believed.** I checked out the pre-engine commit `5563dca8`
("Q2's UNREADABLE rows, RED against the unchanged engine") into the farm scratch and ran it:
PACK-PIN `41 / 36 / 5` and APPROVED-PIN `25 / 21 / 4`, the extra reds being exactly the three
UNREADABLE rows plus the source-scan row in PACK-PIN and the two UNREADABLE rows plus the
source-scan row in APPROVED-PIN. At `428eb4a5` all of them are green. That is real red-first
evidence and not a claim about one.

## 2. THE MUTATION SWEEP: HOW MANY CLAUSES, AND WHAT HAS NO ROW

I enumerated **73 clauses**: **46 in PACK-PIN** (`toPosix`, `byteCompare`, `label`'s three
conditions and its two `toPosix` calls, `isIgnored`'s two rules and their anchoring, the
literal-line regex, `parseLiteral`'s five checks, `serialise`'s sort, the walk's six clauses,
`judge`'s sixteen, the `listed` set, and `packPin`'s three) and **27 in APPROVED-PIN**
(`namesOf`'s three, `judge`'s eighteen including each `continue`, `byteCompare`, and
`approvedPin`'s three). Each was mutated one at a time in a copy placed beside the cell, so
`import.meta.url` still resolves to the same repository root and the source-scan rows still
scan a faithful copy; the copy was run and deleted. **All 73 were run on BOTH operating
systems**, from the same spec, by two harnesses I wrote (python in the farm, node on the PC).
The two REAL ROWS are red whatever the mutation is and are excluded from every count. Two
mutations are deliberate no-ops and are my controls: `A28` (a semantically identical rewrite
of the MISMATCH test) and `P45` (dropping `dirAbs`'s `rel === ""` branch, which `path.join`
makes identical); both report NO-ROW, which is how I know the harness is not trivially red.

**62 of the 73 go red.** 58 of them on BOTH operating systems; 4 on Windows only, and all
four are the same platform fact: `P04`, `P05` and `P06` are `toPosix`, which on linux is the
identity because `path.sep` is `/`, and `P35` is the ADDED list's byte sort, which linux's
readdir order happens to agree with. **None goes red on linux only.** Where a mutation kills
one row fewer on Windows (`P20`, `P30`, `P36`, `A10`, `A14`, `A15`), I checked the row NAMES
and it is always the linux-only FILE-symlink row taking the EPERM branch, exactly as the
author says.

**I reproduced every one of the author's round 3 counts.** P20/P21/P22/P23/P24/P25 and
P3'/P4'/P5'/P6'/P13a'/P13b' in his section 6.1, and A11 to A15 and A3'/A5'/A7' in 6.2, all
match my independent numbers on both operating systems, count for count.

**Eleven clauses go red on neither.** Two are the controls above. The other nine:

| id | the clause with no row | my judgement |
|---|---|---|
| P01 | `label`'s leading `rel &&` (the empty relative path) | unreachable: it needs `packRoot === REPO_ROOT`, which no caller can produce. NOTE |
| P03 | `label`'s `!path.isAbsolute(rel)` | shadowed by the `..` guard on both machines of record, where the fixture and the repository share a volume. NOTE |
| P18 | `serialise`'s own sort | `serialise` has one caller, the round-trip row, and `parseLiteral` has already asserted its input sorted. Dead defence in a helper that judges nothing. NOTE |
| P37 | the byte sort on the NOT-A-REGULAR-FILE output list | no fixture produces two irregular entries. Consequence is line ORDER, never a false green. NOTE, and see below |
| P39 | the byte sort on the UNREADABLE output list | the two-entry row's walk order coincides with byte order on both. Same class as P37. NOTE |
| A03 | `namesOf`'s `String(e)` fallback | a coercion, not a guard: a non-string name comes back UNLISTED either way. NOTE |
| A04 | `judge`'s `!Array.isArray(files)` half of LIST-EMPTY | shadowed by `namesOf`, which already returns `[]`; reachable only by a direct engine call no caller makes. NOTE |
| A21 | ORPHAN sorted by the default string sort instead of `byteCompare` | **BLOCKING-1** |
| A24 | APPROVED-PIN's `byteCompare` replaced by `a < b ? -1 : a > b ? 1 : 0` | **BLOCKING-1** |

**I DISPUTE THE STRICT READING OF THE MANDATE FOR P37 AND P39, and I say why rather than
waving.** The mandate makes a clause with no row blocking. P37 and P39 cannot produce a false
green or a wrong name: they can only reorder two refusal lines that are both printed. More to
the point, **the remedy is not one row**. Killing them deterministically needs a fixture in
which the walk's insertion order provably differs from byte order, and insertion order is
`readdir` order, which neither operating system guarantees; a row built on it would be a
flake generator on a PC shared with six lanes. The honest alternatives are a unit row calling
`sortByBytes` directly (which the existing comparator row already covers at one remove, and
`P40` kills it on both) or leaving it. **I recommend leaving it, recorded here as a decision
rather than an oversight.** `P35`, the third of the three output sorts, does have a row, and
it is killed on Windows. If the PM prefers the strict reading, the cost is a flaky row and I
would rather be overruled than ship one.

## 3. BLOCKING-1: APPROVED-PIN SAYS A ROW PROVES ITS BYTE ORDER, AND NO ROW DOES

`approved-pin.test.mjs:45-46` says, of the cell's two sorts: "The two places this cell sorts
- the literal map's key order, and the ORPHAN lines - both sort by path BYTES, and a row
proves each." **Measured, both halves of that sentence are false, on both operating systems:**

- `A20` (drop the ORPHAN sort entirely) kills one row, so *sorted* is proven. `A21` (sort by
  the default string sort) and `A24` (replace `byteCompare` itself) kill **zero rows on
  either operating system**. So *by BYTES* is proven by nothing. Every fixture path in the
  cell is ASCII, and ASCII is the one alphabet where the two orders agree.
- The row `the literal map, once filled, is held in path byte order` is **vacuous today**:
  `Object.keys(LITERAL)` is `[]` on this branch, so it compares `[]` with `[]`, and its
  `for` loop does not run. When the integrator fills the map it will still pass under `A24`,
  because the real paths are ASCII too.

PACK-PIN does not have this problem: it carries a dedicated row (`R4 N1.1: the comparator is
byte-wise, and the default string sort would differ`) built from `String.fromCharCode(0xe000)`
and `String.fromCodePoint(0x10000)`, and `P40` kills it. APPROVED-PIN has the same
`byteCompare` and no such row. This matters because these bytes are about to be sealed and
the sentence will then be sealed with them; it is the same class of defect R2's N2 named (a
title that is a claim the row does not make), one file over.

**IT IS ONE ROW AND NO ENGINE LINE, AND I BUILT IT AND MEASURED IT.** Because the ORPHAN loop
sorts `Object.keys(literal)` and a fixture owns its literal entirely, the row needs no file
system at all, so it cannot be platform dependent and it cannot flake:

```
test("R3: ORPHAN lines are sorted by path BYTES, not by the default sort", () => {
  withRefs((root, files, literal) => {
    void files; void literal;
    const a = "rebuild/m1/x/" + String.fromCharCode(0xe000) + ".html";
    const b = "rebuild/m1/x/" + String.fromCodePoint(0x10000) + ".html";
    assert.deepEqual([b, a].sort(), [b, a], "this row proves nothing unless the two orders differ");
    assert.deepEqual([b, a].sort(byteCompare), [a, b]);
    const lit = Object.freeze({ [b]: "c".repeat(64), [a]: "d".repeat(64) });
    assert.deepEqual(Object.keys(lit), [b, a]);
    assert.deepEqual(approvedPin(root, [REF_A], lit), [
      "APPROVED-PIN UNLISTED " + REF_A,
      "APPROVED-PIN ORPHAN " + a,
      "APPROVED-PIN ORPHAN " + b,
    ]);
  });
});
```

Measured in the farm scratch: against the shipped engine `26 / 25 / 1` (the one red being the
real row), against the `A24` mutant `26 / 24 / 2`, the extra red being this row and nothing
else. The two characters are BUILT from their code points, so they are text in the file and
not the invisible things they name, which is the trick PACK-PIN already uses. The row makes
the sentence at `:45-46` true; if the author prefers, the sentence can be narrowed instead,
but one of the two must move before the seal.

## 4. R2's TWO BLOCKING FINDINGS

**B1, the pack-root `lstat`: FIXED.** The row `R2 B1: a LINK standing AT the pack root is
ABSENT, even over a twin that matches` exists and asserts the attack before the refusal (the
fixture is green through its own root, the twin reads back the same bytes through the link,
then `PACK-ROOT-ABSENT`). My mutation `P25` (`lstatSync(packRoot)` to `statSync(packRoot)`)
kills exactly one row, this one, on BOTH operating systems. It killed zero before.

**B2, APPROVED-PIN's `lstat` guard on Windows: FIXED, and the false sentence is corrected.**
The row `R2 B2: a DANGLING link at a named reference refuses NOT-A-REGULAR-FILE, on both OS`
exists, proves the link outlives its target, proves `stat` fails where `lstat` succeeds, and
prints the `stat` code rather than pinning it. My mutation `A10` kills it on Windows (1 row)
and kills it plus the linux-only FILE-link row on linux (2 rows). Integrator item 9 now says
the opposite of what it used to say and names the dangling junction. Correct.

## 5. THE PM's FOUR RULINGS

| ruling | verdict |
|---|---|
| **Q1 ORPHAN confirmed** | **TAKEN.** Sixth refusal present, `A19` kills six rows on both, integrator item 10 stops asking |
| **Q2 UNREADABLE now, walk continues, optional reader last, real row passes none, one row scans the source, R1's DENY ACE recorded as Windows only** | **TAKEN, every clause of it.** Seventh refusal in both cells; `P23`/`A16` (rethrow instead of record) kill 4 and 3 rows on both; `P31`/`A17` (name twice) kill 3 on both; the reader is the LAST parameter with `fs.readFileSync` as default; `P41`/`P42`/`A25`/`A26` each kill the source-scan row on both. The rows were committed RED first at `5563dca8` and I re-ran that commit to check it. The DENY-ACE witness is recorded as Windows only in section 11(4) and integrator item 11(a) |
| **Q3 a link at `quality/run` is loud** | **TAKEN.** The row exists, `P22`/`P36` kill it on both, integrator item 13 records the ruling |
| **Q4 the step stays red with its comment, the merge order, and the `:150` fact** | **TAKEN.** The eleven new comment lines carry the merge order and the `:150` fact verbatim, and the report has stopped calling a missing runner result pending. I corroborated the `:150` mechanism structurally: `rebuild.yml` has ONE job, `public-gates`, one `steps:` list, and no `continue-on-error` anywhere, so a failure at `:150` does skip every later step including this one at `:318` |

## 6. R2's FIVE NOTES

| note | verdict |
|---|---|
| N1 the stale 16 in integrator item 3 | **FIXED IN KIND, STALE AGAIN IN THE NUMBER.** See note 1 below |
| N2 the vocabulary row's title | **FIXED.** Both cells record each refusal as the engine returns it and the last row derives the verb set and compares it with `REFUSALS` in both directions. `P43` and `A27` (record nothing) each kill that row on both operating systems, so it is load bearing |
| N3 a literal path outside the pack is benign, and say why | **FIXED.** One paragraph, one row over four outsiders in byte order, and the row re-asserts that a BACKSLASH still fails hard with the reason the two are different classes. `P15` kills it on both |
| N4 `Object.hasOwn` needs a row or a sentence | **FIXED.** The row asserts `constructor`, `toString` and `__proto__` come back UNLISTED; `A06` (`file in literal`) kills it on both. It killed nothing before |
| N5 the mkdtemp prefix | **FIXED.** Every `mkdtemp` in both cells is `s9cpin-`: `s9cpin-pack-`, `s9cpin-approved-`, `s9cpin-twin-` (7), `s9cpin-904-`, `s9cpin-hold-`, `s9cpin-label-`, `s9cpin-notdir-`. I used `s9crevC-` for everything of mine and collided with nothing |

## 7. NOTES OF MY OWN

1. **Integrator item 3's number is stale at this head, exactly as R2 found it stale at the
   last one.** It says the separator mutation "turns 23 rows red on Windows" and calls that
   "the measured number over 35". **Measured by me at `428eb4a5`: 29 rows red on Windows, 0
   on linux, over 40 non-real rows (41 including the real row).** The cell had 35 rows at
   R2's head `00de8761` and has 41 at this one: the author re-measured at an intermediate
   commit and then added six rows without re-measuring. The point of the item is unchanged
   and gets stronger; the figure should read **29 of 40**. Not blocking: it is a number in an
   unsealed report, and it errs low.
2. **Section 5 and integrator item 7 describe the `rebuild.yml` insertion as
   `@@ -297,0 +298,11 @@`, eleven lines.** At this head it is `@@ -297,0 +298,22 @@`, 22
   lines, because round 3 added eleven more comment lines; section 5 itself says 22 four
   paragraphs later. One of the two sentences is wrong. The insertion point and the
   non-overlap with `:232` and `:306` are both correct.
3. **The bar in section 5 was taken at `51415d2`, not at the reported head `428eb4a5`.** The
   only commit between them touches `rebuild.yml` comments. I re-ran everything at
   `428eb4a5` and every count in section 5 holds. No action beyond knowing it.
4. **THE REAL ROW'S OWN REDNESS IS DEFENDED BY THE SEAL AND BY NOTHING ELSE.** Four mutations
   of the real row's BODY leave every other row green on both operating systems: an early
   `return` when the pack is absent (PACK-PIN) or the literal empty (APPROVED-PIN), and
   replacing `assert.deepEqual(refusals, [])` with `assert.deepEqual(refusals, refusals)`.
   That is correct after S9, where the cell's bytes are sealed and any of those edits is a
   sealed byte move. Before S9 the only thing standing between the step and a quietly
   defused red is a reviewer reading the row, which is what this paragraph is. Worth one
   line in the integrator list: **if the CI step ever goes green before both literals are
   filled, read the two real rows first.**
5. **`PACK_ROOT_REL` can be repointed at any directory that exists and no row goes red.** I
   measured it: pointing it at `rebuild/lanes/c/ui-port` turns nothing red, because the
   `label()` row derives its expectation from the same constant. The real row stays red only
   because the literal is empty. The defence is the seal plus the reader's eye; C.5.1 step 5
   must be run against the pack root the spec names, not the one the cell happens to hold.
6. **APPROVED-PIN's stated residual (a `design.APPROVED` that names the same file twice is
   green in the engine) is correctly covered** by the run-time row's duplicate assert, which
   is about the live list. I checked and agree; no action.
7. **THE DAY-OF COST, MEASURED AGAINST THE REAL PACK AND NOT ONLY A SYNTHETIC ONE.** I copied
   the pack from the farm's read-only copy of `rebuild/c-ui-0-gates` (`ecbef86a`, 21 MB) into
   my own scratch, built a literal by C.5.1's procedure from `git cat-file blob`, and ran the
   SHIPPED engine over it: **904 literal lines, 913 files on disk, 9 ignored (8 under
   `quality/run/` and one `quality/__pycache__/*.pyc`), ZERO refusals, 33 ms on linux.** I
   then flipped one bit in `quality/gate.py` and got exactly one line,
   `PACK-PIN MISMATCH quality/gate.py`, and restored it. That reproduces R2's real-pack walk
   independently and it re-measures the cost against real bytes rather than a synthetic
   pack: the cell's own 904-file row prints 18 ms on linux and 60 ms on Windows, so the
   Windows figure is the one to plan the day-of with. **No sha256 of any real file is
   recorded here or anywhere in my session: I took no literal.**

## 8. THE READER PARAMETER, ATTACKED

The PM's Q2 makes the optional reader the only way to build an UNREADABLE row on Windows
unprivileged and in a farm scratch running as uid 0 (I confirmed `id -u` is 0 there). So it
is the one affordance that could become a way to make a real row lie. I attacked it:

- **The real rows pass no reader**, in both cells, and the source-scan rows enforce it. I
  mutated the real call to pass a forgiving reader (`X1`, `X3`): the scan row goes red on
  both. I then hid the call behind an alias so the regex would not find it (`X2`, `X4`):
  the scan row goes red on both, because `src.match(...)` returns `null` and the row compares
  it with the one expected call. Both evasions are caught.
- **A fixture reader cannot reach a real row.** Every reader is created inside `withPack` or
  `withRefs`, per row, and is never stored; the engines take it as a parameter and hold no
  module state. The only shared module state is the `EMITTED` set, which records verbs and is
  never consulted by a verdict.
- **Poisoning `fs.readFileSync` module-wide** with an argument-preserving wrapper turns
  nothing red, as it should, since that wrapper is a semantic no-op; a wrapper that actually
  lied would have to return the very bytes the literal names, and the poison line would live
  in the sealed cell. I record it as measured rather than as a hole.
- `packPin.length === 2` and `approvedPin.length === 3` are asserted, so the reader cannot
  quietly stop being optional: `P42` and `A26` kill those rows on both.

## 9. THE FENCE, AND `rebuild.yml`

Against the branch base `da9f8683`, this branch touches six files and no others:
`.github/workflows/rebuild.yml`, the two cells, the author report, and R1's and R2's review
files (written by the reviewers). Nothing in `rebuild/lanes/b/tooling/**`,
`measure/test/boundary.test.mjs`, `today/test/**`, `rebuild/m4/workout/test/**`,
`rebuild/m3/w7-preview/today/design.cjs` or any other product file. `design.cjs` is unchanged
and its own cell is 11 / 11 / 0 on the PC. Nothing on the wait list was started: both
literals are empty, E fact 17's path list is untouched, there is no `design.test.cjs` hunk,
no `packages/S9.json`, no brief and no token line.

`rebuild.yml` at this head differs from the base in ONE hunk, `@@ -297,0 +298,22 @@`, a pure
insertion of 22 lines with zero removed, directly after the A5 run line and before the
comment block that followed it. **This round changed only comment lines inside the step's own
comment block**: `git diff 00de8761..428eb4a5 -- .github/workflows/rebuild.yml` is 11 added
lines, all of them `#` lines above the `- name:` line, and nothing else. The regions another
lane is adding to (after `:232` and after `:306`) are untouched and do not share three lines
of context with this one. The step is named by exact path and never globbed. I checked every
line this lane has inserted for U+2013 and U+2014 by code point: zero, and the same for both
cells and the author report.

## 10. STOP CONDITIONS

**None fired.** No STOP-9, no STOP-10, no STOP-11. No behaviour differs between the two
operating systems that cannot be closed: the four Windows-only kills are `toPosix` and one
sort, both of which are no-ops on linux by construction, and the one-row-fewer kills are the
FILE symlink an unprivileged Windows process cannot create, which each row states in its own
message. I needed no edit to a file outside my owned list: this review file is the only file
I wrote.

## 11. WHAT I DID NOT VERIFY

1. **GitHub's runners.** By the PM's measured fact these cells cannot run there until the S9
   walk passes, and I corroborated the mechanism structurally (one job, no
   `continue-on-error`) rather than by a runner result. Nothing is pending.
2. **A real unreadable file on either machine.** R1's DENY-ACE measurement remains the one
   real-file witness and it is Windows only. The farm scratch runs as uid 0, where `chmod`
   proves nothing, and I confirmed that rather than assuming it.
3. **BLOCKING-1's proposed row on Windows.** I measured it in the farm only. It builds two
   strings and one frozen object and calls no operating-system API, and PACK-PIN's identical
   construction is green on the PC in today's bar.
4. **The 14 inherited mutation rows the author carried from R1's table.** I re-measured every
   clause in both engines at this head, which covers the same ground by a different route;
   where his round 3 numbers and mine can be compared they agree exactly.
5. **`scripts/` and any local runner**, outside the farm's include list, so I still cannot
   say whether a local bar globs `rebuild/lanes/c/ui-port/`. R1 and R2 name the same gap.
6. **I read nothing forbidden.** No `rebuild/conform/private`, no `src/history.js`, no
   `ledger/`, no `EarnedPort`, no `port-real.log`, no protected soak, no design-lane
   worktree. I ran no `b-package.cjs`, no seal generator, nothing that seals, writes a
   receipt or writes an artifact, and no browser. I created no junction into any tree: the
   only links made in my session were made by the cells themselves inside their own mkdtemp
   folders. My mutation harness wrote a mutated COPY beside each cell, ran it and deleted it,
   on both machines; the PC worktree's `git status` is empty. The real pack I walked was a
   copy in my own scratch, removed afterwards, and **no measurement of the owner's is in this
   session: no sha256 of any real file is recorded anywhere, and I took no literal.**

## 12. WHAT I WOULD DO NEXT

Close BLOCKING-1 with the row in section 3 and nothing else. Correct the two stale numbers
in notes 1 and 2. Add notes 4 and 5 to the integrator list. The cells are otherwise ready to
be sealed: 62 of 73 clauses die to a row, the seven refusals of each vocabulary are derived
from what the rows actually emit rather than asserted, the two real rows are red by name on
both operating systems with identical text, and the engine walks the real 904-file pack in
33 ms with zero refusals and names a single flipped bit exactly once.
