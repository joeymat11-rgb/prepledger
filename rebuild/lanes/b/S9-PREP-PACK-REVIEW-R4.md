# S9-PREP-C REVIEW R4: the independent re-check of the two design-pack pin cells

Reviewer: an Earned lane hand, round 4, working under the PM's NARROW order: round 3 already
enumerated every clause at `428eb4a5` and the PM holds that table, so this round does not
re-enumerate. It answers six questions and nothing else.

- Head reviewed: **`8d06902eedfa434b2d062e4d7c9b504f9656ba22`**, the head the author reports.
  Confirmed to be the PUSHED head: `refs/remotes/origin/rebuild/b-s9-prep-pack` in a farm
  sync taken at the start of this review is the same sha, and the PC worktree
  `%TEMP%\earned-s9c` is at that sha with a clean `git status --porcelain` (0 lines).
- Round 3's head, for the diffs below: `428eb4a5` (code) and `f211411` (R3's review file).
- I edited, committed and pushed **only this file**.

## VERDICT: ACCEPT

R3 BLOCKING-1 is **FIXED** and I killed it myself on both operating systems. All five of
R3's notes are **TAKEN**, each re-measured rather than read. R3's dispute is **UPHELD** and
is now a decision in the code. No engine line moved in either cell. The fence holds. Two
non-blocking notes are at the end; neither is worth another round.

## 1. What actually moved since round 3

`git diff --stat f211411..8d06902e`, three commits, three files:

| file | change |
|---|---|
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` | +68 / -13 |
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | +8 / -0 |
| `rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md` | +255 / -24 |

Nothing else. `.github/workflows/rebuild.yml` was NOT touched this round, which is what the
other two lanes editing that file after `:232` and after `:306` need to be true.

## 2. NO OTHER LINE OF EITHER ENGINE MOVED (the PM's item 3)

Reading the diff is not enough, because a comment block shifts every line after it. I
stripped every block comment and every blank line from both cells at `428eb4a5` and at
`8d06902e` and diffed what was left. That is the whole of the code change:

- `pack-pin.test.mjs`: **the stripped files are IDENTICAL, byte for byte.** Round 4's eight
  added lines are a comment and nothing else. The PM-upheld decision about the byte sorts
  on the `NOT-A-REGULAR-FILE` and `UNREADABLE` output lists is recorded beside those two
  loops, where the next reader will be standing when the question occurs to them.
- `approved-pin.test.mjs`: **three hunks, all of them inside test rows.** (a) the new helper
  `checkKeyOrder(literal)`, declared at `:423`, after every engine function; (b) the body of
  the existing row `the literal map, once filled, is held in path byte order`; (c) the new
  row `R3 B1: the ORPHAN lines come out in path BYTE order, not the default sort's order`.
  `namesOf`, `judge`, `approvedPin`, `byteCompare`, `sha256` and `LITERAL` are untouched.

So both rows are green against the engine round 3 measured, which is the only way a fix to
a test-strength finding can be believed.

## 3. THE BAR AT THE PUSHED HEAD, BOTH OPERATING SYSTEMS

Taken by me at `8d06902e`, not at the author's code head, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` on both machines.

| run | Windows (the PC, `%TEMP%\earned-s9c`) | linux (farm scratch `s9crevD-bar`) |
|---|---|---|
| both cells, the CI step's exact command | **67 tests, 65 pass, 2 fail**, 1059 ms | **67 tests, 65 pass, 2 fail**, 1377 ms |
| `pack-pin.test.mjs` alone | **41 / 40 / 1**, 1022 ms | **41 / 40 / 1** |
| `approved-pin.test.mjs` alone | **26 / 25 / 1**, 126 ms | **26 / 25 / 1** |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | **11 tests, 11 pass, 0 fail**, 146 ms | not run (the PC is the bar of record for it) |

The exact command of the new step, run verbatim on both machines:

    node --test rebuild/lanes/c/ui-port/pack-pin.test.mjs rebuild/lanes/c/ui-port/approved-pin.test.mjs

The two failures are the two REAL ROWS and nothing else, identical on both machines:

- `REAL ROW: the owner-approved pack at this head, against this cell's own literal` prints
  exactly `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18`. The pack is not on
  this branch, so ABSENT wins over LITERAL-EMPTY, and the two rows that prove each of those
  refusals separately are both green.
- `REAL ROW: whatever design.APPROVED names at this head, against this cell's literal`
  prints two lines, `APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html`
  and `APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html`.

`design.test.cjs` is green and unchanged: the branch never touches `design.cjs` or that test.

## 4. R3 BLOCKING-1: FIXED, AND I KILLED IT MYSELF ON BOTH MACHINES

R3's finding was that `approved-pin.test.mjs` claimed a row for each of its two byte sorts
and had neither: every fixture path in the cell was ASCII, the one alphabet where UTF-16
code-unit order and UTF-8 byte order agree, so `A21` and `A24` killed ZERO rows, and the
literal-order row compared `[]` with `[]`.

I applied the three mutants myself, each to a scratch copy at `8d06902e` and each reverted
with `git checkout` before the next (Windows: my own throwaway worktree `%TEMP%\s9crevD-mut`,
left clean and removed; linux: the farm scratch `s9crevD-bar`). `approved-pin.test.mjs` has
26 rows, of which 1 is the real row that is red at the baseline; the counts below are the
NON-REAL rows each mutant turns red.

| mutant | the edit | at `428eb4a5` (R3) win / linux | at `8d06902e` win | at `8d06902e` linux |
|---|---|---|---|---|
| `A20` | `Object.keys(literal).sort(byteCompare)` to `Object.keys(literal)` | 1 / 1 | **2** | **2** |
| `A21` | that sort to the DEFAULT `.sort()` | **0 / 0** | **1** | **1** |
| `A24` | `byteCompare` to `(a, b) => (a < b ? -1 : a > b ? 1 : 0)` | **0 / 0** | **2** | **2** |

The rows are named, not counted. `A21` kills `R3 B1: the ORPHAN lines come out in path BYTE
order, not the default sort's order`. `A24` kills that row AND `the literal map, once
filled, is held in path byte order`. `A20` kills the new row and the pre-existing
`ORPHAN comes after the per-file refusals, in path BYTE order and not insertion order`.
Every count above is identical on the two operating systems, which is what N1.1 asked for.

**The vacuous row is no longer vacuous, and I checked that claim rather than taking it.**
`LITERAL` is still empty on this branch, so the ONLY thing `A24` can break in that row is
its assertions over the two FIXTURE literals. `A24` kills it. That is the proof: a row that
asserted nothing could not have died.

**The mechanism is honest and it cannot flake.** Both rows build their two paths from code
points (`String.fromCharCode(0xe000)` and `String.fromCodePoint(0x10000)`), so the file
itself is pure ASCII: I scanned both cells and the author report and found **zero** bytes
outside printable ASCII, so zero U+2013 and zero U+2014 and no invisible astral character
sitting in the source. Each row first asserts that the default sort and the byte sort
DISAGREE on that pair, with the message `this row proves nothing unless the orders differ`,
so the row cannot quietly become vacuous again if a future Node changes either order. The
two odd paths are only ever literal-map KEYS and reach no file system call, so nothing here
depends on what NTFS or ext4 will accept as a filename. The ORPHAN row additionally pins
the insertion order of its frozen map (`the map must be built in the OTHER order`), so the
engine's sort is the only thing that can produce the asserted output.

The de-vacuumed row also now asserts the INVERSE, which an empty map could never say: a
literal held in code-unit order is REFUSED (`assert.throws(..., /path byte order/)`). Under
`A24` that throw does not happen and the row dies; under `A20` the comparison is trivially
true and the row dies. Both measured, both machines.

## 5. THE TWO NUMBERS, MEASURED AND NOT READ

**The separator mutant at THIS head (R3 NOTE 1): 29 on Windows, 0 on linux. CONFIRMED.**
I applied `P10` myself, the walk emitting the platform separator instead of `/`
(`const childRel = rel === "" ? name : rel + "/" + name;` to `... rel + path.sep + name;`),
to a scratch copy at `8d06902e`:

| | total rows | fail | of which the real row | NON-REAL rows red |
|---|---|---|---|---|
| Windows | 41 | 30 | 1 | **29 of 40** |
| linux | 41 | 1 | 1 | **0 of 40** |

That is exactly the figure the author reports, and it is the figure this round's code head
produces, not round 3's. Zero on linux is correct and not a gap: `path.sep` IS `/` there, so
the mutant is a no-op, and that asymmetry is the reason the Windows run is the bar of record
for N1.1.

One caution for whoever re-runs this. `P10` is the WALK's separator, not `toPosix`. I first
mutated `toPosix` to the identity by mistake and got 1 non-real row red on Windows and 0 on
linux, because `toPosix` has one caller, `label()`. Anyone re-measuring N1's figure must
mutate the `childRel` line, or they will report 1 and think the cell is weak.

**The rebuild.yml insertion is 22 lines. CONFIRMED.** `git diff da9f8683..8d06902e --
.github/workflows/rebuild.yml` is one pure-insertion hunk, `@@ -295,6 +295,28 @@`, adding
22 lines and deleting none, placed directly after the `A5` step's `run:` line and before the
comment block that follows. The step is named `C - the design pack pin and the
approved-reference pin` and names both cells by exact path with no glob. The report says 22
in both of the places R3 asked about.

## 6. THE OWNED-FILES FENCE

`git diff --stat da9f8683..8d06902e` over the whole branch is seven files and 3938
insertions with zero deletions anywhere:

`.github/workflows/rebuild.yml` (+22), `rebuild/lanes/c/ui-port/pack-pin.test.mjs` (+932),
`rebuild/lanes/c/ui-port/approved-pin.test.mjs` (+702), the author report (+1205), and the
three review files R1, R2 and R3.

Nothing in `rebuild/lanes/b/tooling/**`, nothing in `sealed-inventory-fence.test.mjs`,
nothing in `measure/test/`, `today/test/`, `rebuild/m4/workout/test/`, `design.cjs` or any
product file. Nothing from the wait list: both literals are still empty, `packages/S9.json`
is untouched, there is no `design.test.cjs` hunk. `rebuild/DECISIONS.md` and
`rebuild/lanes/STATUS.md` are untouched. I read `design.cjs` and `design.test.cjs` and
proved I disturbed neither by running that suite green, 11 of 11.

## 7. R3's ONE FINDING AND ITS FIVE NOTES, EACH WITH A VERDICT

| item | verdict | how I decided it |
|---|---|---|
| **BLOCKING-1** APPROVED-PIN's two byte sorts had no row | **FIXED** | section 4: `A21` 0 to 1 and `A24` 0 to 2 non-real rows, on BOTH machines, mutated by me at `8d06902e`; the vacuous row now dies to `A24`, which an empty comparison could not do |
| **NOTE 1** the separator figure must be re-measured, not arithmetic | **TAKEN** | section 5: I re-ran `P10` at `8d06902e` and got 29 of 40 on Windows, 0 on linux. The report states it as measured |
| **NOTE 2** the insertion is 22 lines and the file must say so everywhere | **TAKEN** | section 5: the hunk adds 22 lines; the report says 22 in section 5 and in integrator item 7, and marks eleven as round 2's stale figure |
| **NOTE 3** the bar must be taken at the head reported | **TAKEN, and independently satisfied** | the author measured at his code head `75263ae` and added a commit saying so. I did not rely on that: I re-ran the whole bar at the reported head `8d06902e` on both machines and got the same counts, so the bar and the head now agree by measurement |
| **NOTE 4** the real row's redness is defended by the seal and nothing else | **TAKEN** | carried to the integrator list as item 18 in R3's words, with the instruction to read the two real rows first if the CI step ever goes green before the literals are filled. I read item 18 and it says that |
| **NOTE 5** `PACK_ROOT_REL` can be repointed and no row notices | **TAKEN** | carried as integrator item 19 in R3's words, tying C.5.1 step 5 to the pack root the SPEC names |

**R3's DISPUTE: UPHELD, and now a decision rather than an oversight.** The byte sorts on
PACK-PIN's `NOT-A-REGULAR-FILE` and `UNREADABLE` output lists (`P37`, `P39`) get no row. The
reason is written into `pack-pin.test.mjs` beside the two loops, in eight comment lines that
change no behaviour: a deterministic kill needs the walk's insertion order to differ
provably from byte order, insertion order is `readdir` order, and neither operating system
guarantees it, so such a row is a flake generator on a PC six lanes share. I agree with the
reasoning and I checked the consequence myself: neither sort can produce a false green or a
wrong name, because both lines are printed either way and only their order moves. The
comparator itself keeps its own row.

**The seven further unrowed clauses stay as notes with R3's reasons** (`P01`, `P03`, `P18`,
`P37`, `P39`, `A03`, `A04`), and they are in the report's table with those reasons. I did
not re-argue them and the PM's narrow order did not ask me to.

## 8. TWO NON-BLOCKING NOTES

Neither is worth a round. Both are for the record, and the second one is for whoever fills
the literals.

**N4-1. The new ORPHAN row's comment overstates what it touches.** The comment says "the
only file it touches is the ordinary ASCII reference the fixture wrote". In fact the engine
touches no file at all in that row: `REF_A` is UNLISTED, and `judge` pushes UNLISTED and
`continue`s BEFORE the `lstatSync`. That makes the row even safer than its comment claims,
so the comment is generous against itself rather than in its own favour. Leave it or drop
the clause at the next edit of the file; do not reseal for it.

**N4-2. Nothing here proves the comparator over a NON-ASCII path that exists on disk.** Both
new rows are deliberately built so their odd paths stay in memory, which is exactly why they
cannot flake, and the PM's N1.1 asked for byte ordering, which is what they prove. But if
the owner-approved pack ever acquires a file whose name is not ASCII, the first thing to
learn is whether both operating systems even agree on the bytes of its name, and no row in
either cell asks that. The real pack's 904 paths are ASCII today, so this is a note for the
day that changes, not a gap now.

## 9. FOR THE S9 INTEGRATOR, from this round

Nothing new from me. The report's integrator list is the record, and I checked that R3's
two carried items are in it in R3's own words: **item 18**, if this CI step ever goes green
before both literals are filled, read the two real rows FIRST, because the redness is
defended by the seal and by nothing else; **item 19**, C.5.1 step 5 is run against the pack
root the SPEC names, because `PACK_ROOT_REL` can be repointed at any existing directory and
no row notices. R4's own N2 and N10 are in the list too: every platform of record's baseline
directory present and set BEFORE the literal is taken, and `.gitignore` on the chain tip
does not carry the pack's two lines until the design lane merges.

## 10. HOW EVERY NUMBER IN THIS FILE WAS TAKEN

- Farm, read only: `farm-sync.sh rebuild/b-s9-prep-pack` (privacy proof PASS), then the
  diffs and the comment-stripped code comparison in `/home/claude/farm/wt/rebuild__b-s9-prep-pack`.
- linux runs: a farm scratch worktree at `origin/rebuild/b-s9-prep-pack`, prefix
  `s9crevD-`, mutants applied with `sed` and reverted with `git checkout` after each run.
- Windows runs: the lane worktree at `8d06902e` for the bar, and a separate throwaway
  worktree `%TEMP%\s9crevD-mut` at the same sha for every mutant, so the lane worktree was
  never edited. Both left clean; the scratch worktree and my `s9c-` scratch files are mine
  and are removed. I ran nothing that seals, packages or writes a receipt, and I opened
  nothing on the stop-the-line list.
- No re-run was needed: no failure in this review looked like timing, and every count above
  reproduced identically on the two machines.
