# S9-PREP-PACK REVIEW R1 - independent review of the two design-pack pin cells

Ticket S9-PREP-C. Branch `rebuild/b-s9-prep-pack` at `1da0100637ec368b06d43141111f713aaf000844`,
cut from `rebuild/b-s9-ui-pins` at `da9f8683`. Author report:
`rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md`, treated throughout as a hypothesis.

I synced the branch into the farm and read the diff before I read the report. Every number and
every refusal string below is one I produced myself, on the PC (Windows 11, node v24.19.0,
`%TEMP%\earned-s9c` at `1da01006`) or in a linux farm scratch of the PUSHED head
(`/home/claude/farm/scratch/wt/s9crev2`, node v22.22.2, 2 CPUs), or on both. Where an earlier
reviewer hand had left partial notes in this file I re-ran the measurement rather than keeping the
number, and two of its figures did not survive that (see B3 and N2).

## VERDICT

**REJECT, and the fix is narrow.** Two BLOCKING findings are measured green-while-changed holes in
cells whose entire job is that nothing moves unseen, and neither is stated anywhere in the cells or
in the report. A third is a mutation-coverage defect: three guard clauses can be removed with
nothing going red on EITHER operating system, and one row of the author's mutation table claims a
kill it does not have. Together the code fix is about six lines and five fixture rows.

**Everything else in this build I tried to break and could not.** The red-first evidence is real
and I reproduced it at the four commits. The bar reproduces on both operating systems with zero
skipped and zero todo and byte-identical refusal text. The one test no fixture can give, the engine
pointed at the REAL 904-file pack with a literal I generated myself by C.5.1's five steps, returns
zero refusals and then names the single file whose byte I moved. I would accept this after one fix
round on the three named points and would ask for nothing else.

## THE OWNED-FILES FENCE: CLEAN

`git diff da9f8683 origin/rebuild/b-s9-prep-pack --stat` is exactly the four files the ticket names:
`pack-pin.test.mjs` 568+, `approved-pin.test.mjs` 376+, `rebuild.yml` 11+, the author report 406+,
1361 insertions and zero deletions. The `rebuild.yml` change is ONE hunk, `@@ -295,6 +295,17 @@`,
eleven added and zero removed, entirely inside the region after `:297`; nothing is inserted near
`:232` or near `:306`, so the three lanes' regions merge. Parsed with the repository's own `yaml`:
one job `public-gates`, 28 steps, matrix `[ubuntu-latest, windows-latest]`, no job-level shell
default, the new step present exactly once, command
`node --test rebuild/lanes/c/ui-port/pack-pin.test.mjs rebuild/lanes/c/ui-port/approved-pin.test.mjs`
with no glob and no quoting, so it is shell-neutral on both runners. No U+2013 and no U+2014 in any
of the four files, and no non-ASCII byte at all in any of them.

## BLOCKING

### B1. APPROVED-PIN has no ORPHAN refusal and states no residual: a literal entry for a file `design.APPROVED` no longer names is silently unused

`approvedPin` walks the RUN-TIME name list and asks the literal about each name. It never asks the
literal's own keys whether they are still named. So a `design.APPROVED` that SHRINKS leaves its
dropped file pinned by nothing at all, and the cell stays green. Measured by me, on both operating
systems, with the literal holding two files and the dropped file then edited:

```
linux    D6-both-named                   => []
linux    D6-shrunk-list-REF_C-edited     => []     (REF_C edited; literal still holds it; GREEN)
Windows  WIN D6-both-named               => []
Windows  WIN D6-shrunk-list-REF_C-edited => []     (same, on the PC)
```

This is the exact inverse of R4 N8's UNLISTED, and it is the sentence the cell's own header makes:
"instead of going quietly green over two files nothing points at any more". UNLISTED closes the case
where the list MOVES to files the literal has never heard of. Nothing closes the case where the list
STOPS NAMING a file the literal still holds, and the 09-08 references are the live example: PACK-PIN
covers `rebuild/m1/approved-2026-09-18/` only, so a 09-08 reference dropped from the list is covered
by neither cell.

**The mitigation that exists, and why it is not enough.** `design.test.cjs:17` asserts
`approved.length === 2`, so a shrink is red today. But `:17` is precisely the line F.2 STOP-10 and
C.5.3 step 4 expect C-UI-1 to edit in order to follow a moved list, and `design.test.cjs` is one of
the two unsealed sides APPROVED-PIN exists to backstop. The guard moves with the thing it guards, on
the one day it matters.

**Remedy, either of:** (i) a sixth refusal `APPROVED-PIN ORPHAN <path>` for every literal key absent
from the run-time name list, plus a row; or (ii) the PM rules it benign and the cell header and the
integrator list say so in terms, with the reason. What is not acceptable is the present state, in
which a reader of the cell cannot tell the question was asked. I prefer (i): four lines, symmetric
with UNLISTED, and it is the difference between a pin that covers what it says and a pin that covers
a subset nobody has to declare.

### B2. PACK-PIN's ignore list is WIDER than C.5.1's: a regular FILE at `quality/run`, or any leaf named exactly `__pycache__`, is invisible to the pin

C.5.1's skip is "a pack-root-relative path begins `quality/run/` or contains a `__pycache__/`
segment": both with the trailing slash, both about directories. `isIgnored` is wider on two counts:

```js
if (rel === IGNORE_PREFIX.slice(0, -1) || rel.startsWith(IGNORE_PREFIX)) return true;  // "quality/run" exactly
return rel.split("/").includes(PYCACHE_SEGMENT);                                       // ANY segment, final included
```

Measured by me over the cell's own fixture pack, on both operating systems:

```
linux    isIgnored("quality/run")=true  isIgnored("quality/__pycache__")=true  isIgnored("quality/my__pycache__notes.md")=false
linux    B2-regular-FILE-at-quality-run       => []
linux    B2b-regular-FILE-named-__pycache__   => ["PACK-PIN ADDED quality/__pycache__x"]   (only the near miss is named)
Windows  WIN isIgnored quality/run = true | quality/__pycache__ = true | quality/my__pycache__notes.md = false
Windows  WIN B2-regular-FILE-at-quality-run     => []
Windows  WIN B2b-regular-FILE-named-__pycache__ => []
```

So a committed regular file at `<pack>/quality/run`, or at any path whose LAST segment is
`__pycache__`, sits inside the owner-approved pack and the pin says nothing: not MISMATCH when its
bytes move, not ADDED when it appears, not MISSING when it goes. The near miss is handled correctly
(`my__pycache__notes.md` is ADDED), so this is not the `String.includes` trap the attack plan names
at B4; it is two clauses that are each one character too generous.

**What this is not.** Nothing in today's real pack is affected: I enumerated all 904 tracked paths at
`ecbef86a` and there are zero paths equal to `quality/run`, zero with a `__pycache__` segment, and
zero under `quality/run/`. This is a hiding place, not a present miss, and it does not fire F.2
STOP-9(b), because nobody is proposing to narrow the pin.

**Why it is blocking anyway.** S9 declares this cell `role: "new"`, so from S9 on these two lines are
SEALED bytes and moving them is a reseal child; the author's own integrator note 6 makes that
argument. A one-character correction costs nothing now and costs a reseal child after the literal is
taken.

**Remedy, two lines.** Drop `rel === IGNORE_PREFIX.slice(0, -1)`. With it gone the walk `lstat`s
`quality/run`, descends it when it is a directory, and the prefix rule skips every child, which is
the identical result for the directory case, while a FILE at that path becomes
`PACK-PIN ADDED quality/run`. One behaviour change to weigh out loud: a symlink or junction AT
`quality/run` would then refuse `NOT-A-REGULAR-FILE` instead of being skipped. On a design machine
that symlinks its own output directory that is noise; the PM should say which it wants and the cell
should say which it got. For `__pycache__`, match the spec's words by excluding the final segment:
`rel.split("/").slice(0, -1).includes(PYCACHE_SEGMENT)`. Two fixture rows go with it.

### B3. Three guard clauses can be removed with NOTHING going red on either operating system, and the mutation table's `P13` row claims a kill it does not have

The ticket's rule is explicit: a refusal or guard whose removal turns nothing red is a blocking
finding. I re-ran the author's table and added the guards it does not cover. Each mutation below is
the single named edit, applied to a copy of the cell placed where `import.meta.url` still resolves,
run with `node --test`, then deleted.

| mutation | linux fixture rows red | Windows fixture rows red | author's claim |
|---|---|---|---|
| `label()`'s repo-relative branch replaced by `toPosix(root)` | **0** | **0** | not in the table |
| `parseLiteral`'s backslash assert removed | **0** | **0** | not in the table |
| `parseLiteral`'s `out.sort(byteCompare)` removed | **0** | **0** | not in the table |
| P13: `if (irregular.has(e.file)) continue;` removed | 1 (the FILE-link row only) | **0** | "linux 2, Windows 1" |

**Why P13's Windows column is wrong, structurally and not by accident.** The directory-link row pins
`quality/baseline/states/C-02-dawn.json`, a FILE; the irregular entry is `quality/baseline/states`,
the DIRECTORY. `irregular.has(e.file)` is therefore false in that row and the `continue` never fires
there, so that row cannot detect P13 on either OS. The only row that can is the FILE-link row, and on
Windows that row takes the EPERM branch. **On the PC, the "an entry is named once" guard is
decoration.** It is killed on linux, so the guard is not wholly unpinned, but the table should read
1 and 0, not 2 and 1.

**Why the three uncovered guards matter, stated at their real weight.** None is a green-while-changed
and none is as serious as B1 or B2. `label()`'s repo-relative branch is the only code that produces
the refusal text `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18` that the report presents
as the measured first rung of the ladder, and no row asserts it (I confirmed the branch works:
`WIN label(repo-relative) = rebuild/m1/approved-2026-09-18`). The backslash assert is the cell's
stated defence of R4 N1.1 on the literal side and nothing exercises it. The literal sort is the cell's
stated "compares the literal in path byte order" contract and nothing exercises it. **Each is one
row.** I raise them as blocking because the ticket makes that the rule, not because I think any one of
them is dangerous; I would accept all three closed by rows in the same round as B1 and B2.

## NOTES

**N1. `P1` also turns PACK-PIN's REAL ROW GREEN, and the table does not call it out.** The table's own
convention is to flag a mutation that makes a real row green; A2 and A6 are flagged, P1 is not.
Measured by me on both operating systems: removing the `PACK-ROOT-ABSENT` refusal kills three rows
(the two PACK-ROOT-ABSENT rows and the precedence row) AND the real row turns green, because an absent
root then returns `[]`. Same class as A2 and A6. Table accuracy only; the mutation is still killed.

**N2. The rest of the mutation table, re-measured by me.** `A7` kills 2 rows on linux and **1** on
Windows, not 2 on both: the file-link row takes the EPERM branch there. `A2` kills 4 and turns the
real row green, on both, exactly as claimed. `A4` kills 1 on linux and 0 on Windows, exactly as the
author reports, and his explanation is right: an unprivileged Windows process has no entry for which
`lstat` and `stat` disagree at a file path. I did not independently re-measure P3, P4, P5, P6, P7, P8,
P9, P10, P11, P12, A1, A3, A5 or A6 mutation by mutation; I re-measured P1, P13, A2, A4 and A7 and
found two count errors in five, which is why I read the rest of the table as approximate rather than
exact.

**N3. An unreadable pinned file makes the walk THROW, not refuse by name, and the throw hides every
later path.** `walk` calls `fs.readFileSync` with no guard. Measured by me on the PC with a DENY ACE
on one pinned file:

```
N3 direct read of the blocked file => EPERM
N3 engine => THREW EPERM: EPERM: operation not permitted, open '...\quality\gate.py'
```

The cell goes RED, so this is loud and is not a green-while-changed. But the failure is not one of
the six refusals, it names the path only inside a stack, and the walk stops, so a second defect
further down the tree is invisible until the first is cleared. A `try`/`catch` around the read that
pushes `PACK-PIN UNREADABLE <path>` would complete the vocabulary. Worth a ruling before the bytes
are sealed; not worth a fix round on its own. (The linux half cannot be measured in the farm: the
scratch runs as uid 0, where `chmod 000` does not block the read.)

**N4. The literal parser is tolerant in two ways C.5.1's serialisation is not.** Measured on both: an
UNSORTED literal is accepted silently, because `parseLiteral` re-sorts it (`C3-unsorted-literal => []`
on linux, `WIN C3-unsorted-literal => []` on the PC); and two spaces between path and hex are read as
a path with a trailing space, printing `PACK-PIN MISSING "quality/gate.py "` plus
`PACK-PIN ADDED quality/gate.py`, a defect in the cell's own constant reported as two facts about the
tree. Uppercase hex, a malformed line and a duplicate path do fail hard, correctly. Both tolerant
cases are RED or harmless, so nothing hides; but a cell that silently re-sorts cannot claim the pasted
literal is the one the procedure emitted, and that clause is also the third row of B3.

**N5. Two residuals the report should carry and does not.** (a) A Python module placed at
`<pack>/quality/__pycache__/teeth.py` is invisible to the pin by construction, and Python will import
it if `sys.path` reaches it. Measured `B5-teeth.py-inside-pycache => []` on linux and
`WIN B5-teeth.py-inside-pycache => []` on Windows. This cannot be closed by the ignore list and should
be named out loud rather than discovered. (b) N1.3's working-tree shape means any future ignored
directory inside the pack (`.tmp/`, `node_modules/`, a venv) reads as `PACK-PIN ADDED` on the design
lane's machine. The right answer is to state it and NOT widen the list to pre-empt it; the report
states neither.

**N6. `assert.equal(err, "EPERM")` pins a foreign machine's errno.** Both cells' `R4 N1.2 (a)` rows
assert the exact code when a file symlink cannot be built off linux. That is true on this PC and is a
reasonable guess for `windows-latest`, but CI has not run this branch and the runner's account is not
this one. A runner that returns a different code, or that succeeds (which is also fine), turns the row
red for a reason that is not a defect in the pin. Consider asserting a non-null code off a platform
that allows links, and printing it, so the row records the measurement instead of pinning it.

**N7. The token `APPROVED-PIN` now exists in two files with two meanings.** `design.cjs:341` already
throws `APPROVED-PIN FAIL: <file>` from `readApproved()`. The new cell correctly never calls
`readApproved` and asserts full exact strings, so it does not fall into the trap the attack plan names
at D7; but a future row or a future grep matching `/APPROVED-PIN/` can be satisfied by design.cjs's
message rather than by the cell. One sentence in the integrator list.

**N8. `design.APPROVED` naming the same file twice is green in the engine.** Measured
`D4-dup-name => []`. The real row does assert the run-time list holds no duplicate, so the live case
is covered and the engine's silence is benign; stated so it is a decision and not an oversight.

**N9. The red-first counts in the report are the Windows ones; linux is one row redder in each cell.**
Re-run by me at each commit in the farm: `6cfd9032` 25 tests, 8 pass, **17 fail** (report says 16);
`1b803930` 25/24/1; `4b02ec52` 16 tests, 5 pass, **11 fail** (report says 10); `491ba20b` 16/15/1. The
extra red on linux is the file-symlink row in each cell, which on Windows takes the EPERM branch and
passes even against a stub. Not a discrepancy, but the table should name its OS as the bar table does.
The author's honest disclosure that the REAL ROWS PASSED at the two stub commits is confirmed: I
measured the real row green at `6cfd9032` and at `4b02ec52`, and red at `1b803930` and `491ba20b`, so
the red-first shape is exactly as he describes it.

**N10. The day-of cost, measured against the real pack rather than a synthetic one.** The pack is
**21 MB** on disk at `ecbef86a`. One full PACK-PIN walk of it took **55 ms cold and 46 ms warm** in the
farm's 2-CPU linux scratch. The cells' own synthetic 904-file row, whose files are tiny, printed 19 ms
on linux and 64 to 75 ms on the PC. So the author's "the hashing term will grow" caveat is right in
direction and the real figure is still well under a fifth of a second. The cell is not a cost the
design lane will notice.

**N11. The `rebuild.yml` step makes this lane branch's CI red, and the author asked for a ruling.** I
agree with his framing and I do not make the call: the honest choices are to leave the step red with
its comment, to hold the hunk back until the re-measure, or to merge the pack first. What I add is
that the same red arrives on the CHAIN TIP the day this branch merges, not only here, so the ruling is
about merge order and not only about this branch's badge.

## WHAT I TRIED TO BREAK AND COULD NOT

**The one test no fixture can give, and it passes.** In a farm scratch I generated a literal for the
REAL pack by C.5.1's five-step procedure myself: `git ls-tree -r --name-only HEAD -- <pack root>/` at
`ecbef86a` (904 paths, every one mode `100644`), sha256 over `git cat-file blob HEAD:<path>` for each,
one line `<pack-relative path> <space> <64-hex>`, sorted by path BYTES. I pointed the cell's own engine
at a working-tree copy of the pack:

```
literal lines: 904
cold: refusals=0   55 ms
warm: refusals=0   46 ms
```

I then flipped one bit of byte 0 of one real state record and re-ran:

```
PACK-PIN MISMATCH quality/baseline/states/C-03-ink.png        (1 refusal, and only that one)
```

That is C.5.1 step 5 executed against the real thing rather than argued: a git enumeration and a
working-tree walk agree exactly on all 904 files, which is the `.gitattributes` argument taken as a
measurement. **And the ignore list was proved against real output, not a fixture:** the farm's
checkout of the design lane carries 913 files under the pack root, 9 of them untracked gate-run
leavings (8 under `quality/run/`, plus `quality/__pycache__/common.cpython-311.pyc`), and the engine
ignored exactly those 9 and named none of them. The literal is a test value and is committed nowhere.

**The bar, re-run by me, both operating systems.** PC (`%TEMP%\earned-s9c` at `1da01006`, node
v24.19.0): `pack-pin` 25 tests 24 pass 1 fail; `approved-pin` 16/15/1; the CI step's exact command
41/39/2; `rebuild/m3/w7-preview/today/test/design.test.cjs` unchanged **11 tests, 11 pass, 0 fail**;
`git status --porcelain` shows only this review file. Linux farm scratch of the pushed head (node
v22.22.2): the two cells together 41/39/2. **Zero skipped and zero todo on both.** The two failures
are the two real rows, with byte-identical text on both operating systems and not a backslash in any
of it:

```
PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
```

**Attacks from the plan that landed where they should**, all run by me as real fixture cases. A rename
reports BOTH halves from one run, on both operating systems (`MISSING states/STATE-INVENTORY-DRAFT.md`
plus `ADDED states/STATE-INVENTORY-FINAL.md`), so the engine does not bail on the first refusal. A
case-only rename reports both halves ON WINDOWS too (`MISSING README.md` plus `ADDED Readme.md`), so
nothing case-folds and no Map is keyed case-insensitively. A zero-byte file is enumerated and hashed
(`e3b0c442...`) and its later change is named, so nothing treats a 0-length buffer as absent. A file
added beside the pack root is correctly outside the pin. A `design.APPROVED` entry naming
`../../../../etc/hosts` cannot escape the root: it is only ever a Map key, so it reads
`APPROVED-PIN UNLISTED ../../../../etc/hosts`, and `Object.hasOwn` means `constructor` and `toString`
are UNLISTED rather than found. The two mutations the author said to attack hardest, A2 (drop
UNLISTED) and A6 (let the sha come from `design.APPROVED`), each kill four fixture rows AND turn the
real row green, so neither can be re-introduced without a row going red; I re-measured A2 on both
operating systems and it holds. P10, the separator mutation, is the single best argument in this build
for the bar of record being the PC.

## WHAT I DID NOT VERIFY

1. **GitHub CI.** No `rebuild-public` run exists for this head; my both-OS evidence is this PC and a
   farm scratch of the pushed head. The new step is expected RED on this branch for the reason the
   author states. I did confirm the step is shell-neutral and that the job carries no shell default.
2. **The real pack on Windows.** `rebuild/m1/approved-2026-09-18/` is not on this branch and not on
   the PC. My zero-refusal real-pack run is linux only. C.5.1 step 5 on the PC remains the
   integrator's job and is the step I would least like skipped.
3. **Most of the mutation table.** I re-measured P1, P13, A2, A4 and A7 and added four guards of my
   own (B3, N2). The remaining fourteen rows I read but did not re-run.
4. **The linux half of N3.** The farm scratch runs as uid 0, so an unreadable file cannot be built
   there; the throw is measured on Windows only. The absence of a `try`/`catch` around
   `readFileSync` is a source fact on both.
5. **Line numbers cited inside `b-package.cjs`** (`:1201`, `:1970`, `:1972`) and inside
   `design.test.cjs` beyond `:15-:20` and `:17`. I did read
   `rebuild/m3/w7-preview/today/design.cjs` and confirm `APPROVED` is a frozen two-entry array and
   that `readApproved` throws `APPROVED-PIN FAIL:` against `entry.sha256`.
6. **`scripts/` and any local runner.** `scripts/` is outside the farm's include list, so I could not
   check whether a local bar globs `rebuild/lanes/c/ui-port/`. The CI step names both files by exact
   path, which is what the ticket asked for.
7. **I read nothing forbidden.** No `rebuild/conform/private`, no `src/history.js`, no `ledger/`, no
   port folder, no protected soak, no design-lane worktree on the PC. I ran no `b-package.cjs`, no
   seal generator, nothing that writes a receipt or an artifact, and I created no junction into any
   tree. My farm scratches, `%TEMP%\s9c-rev2-scr` and the mkdtemp fixtures are mine and hold only
   files I wrote; the PC worktree is untouched apart from this file. No owner measurement is anywhere
   in this review: every fixture byte is generated, and the one real-pack literal is a test value
   committed nowhere.

## ONE THING FOR THE S9 INTEGRATOR THAT IS NOT IN THE AUTHOR'S LIST

The author's list of nine is accurate as far as I checked it and I would keep all of it. Add one
measurement of mine to item 3: **the design lane's own checkout carries untracked gate output inside
the pack today** (8 files under `quality/run/` and one `quality/__pycache__/*.pyc` at `ecbef86a`), so
C.5.1 step 5 run on that machine exercises the ignore list for real rather than hypothetically. If
step 5 ever returns `PACK-PIN ADDED` for a path under `quality/run/` or with a `__pycache__` segment,
the ignore list has been changed, not the pack.

---

Reviewed by the Earned lane hand acting as independent reviewer for S9-PREP-C. This file is the whole
of my change; I touched nothing else in the worktree.
