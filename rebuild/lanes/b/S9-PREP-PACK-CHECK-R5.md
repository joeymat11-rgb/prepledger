# S9-PREP-PACK CHECK R5 (narrow Claude check of Astra's fix round 5)

Ticket S9-PREP-C. Branch rebuild/b-s9-prep-pack, head d857d775, one commit on top of
1d0cbffa, built by Astra under the PM's rulings P-PACK-1, P-PACK-2 and P-PACK-3.
Reviewer: a Claude lane hand, told to disagree. Scope: THIS ROUND'S HUNKS ONLY, in
rebuild/lanes/c/ui-port/pack-pin.test.mjs, rebuild/lanes/c/ui-port/approved-pin.test.mjs
and the new section "Astra's blind review: fixed" of
rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md. The author's report is a hypothesis.

## VERDICT: REJECT

One blocking defect, executed on BOTH operating systems, with the inputs pasted below.
A second, conditional blocking defect that a Windows CI runner can hit, with the
executed measurement and the exact condition that triggers it. Everything else is a
note. Nothing in this file asks for a law, a guard, a pin or a test to be weakened.

BLOCKING-1. APPROVED-PIN's new component walk calls `fs.readdirSync(parent)` outside a
try. A directory that can be TRAVERSED but not LISTED makes judge THROW, so the cell
loses every later entry of design.APPROVED and dies with a message that is none of its
seven refusals. That is the exact defect the PM ruled on at Q2 and round 3 closed for
files, re-opened at a new site. Measured on Windows and on Linux; the round-4 engine
returns an ordinary verdict for the same tree. PACK-PIN has the same new hole above its
pack root.

BLOCKING-2 (conditional, and it can only produce a loud FALSE RED, never a false green).
PACK-PIN picks its trusted boundary by string-differencing two absolute paths. On a
Windows runner whose checkout drive differs from the drive os.tmpdir() reports, the
expression selects REPO_ROOT for every disposable fixture pack, and 50 of the 58 rows go
red on an honest tree. Measured with the runner's own spelling on the real win32 node.

## 1. THE BAR, RE-MEASURED AT THE HEAD ON BOTH SYSTEMS

Windows, %TEMP%\earned-astra-35 at d857d775, `git status --porcelain` empty,
`git pull --ff-only` "Already up to date.", node v24.19.0,
MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York.

| Cell | Tests | Pass | Fail | Only failing row |
|---|---:|---:|---:|---|
| pack-pin.test.mjs | 58 | 57 | 1 | 57 REAL ROW |
| approved-pin.test.mjs | 42 | 41 | 1 | 41 REAL ROW |

Linux, farm scratch /home/claude/farm/scratch/wt/s9c-r5 at d857d775, node v22.22.2,
same environment: pack-pin 58/57/1, approved-pin 42/41/1, the same two real rows.
The two reds print exactly:

```text
PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
```

sha256 of the two cells, identical on both machines (certutil on the PC, sha256sum on
the farm), and equal to the PM's:

```text
82efbae2e677f15b5e2afb2cd78378a72578da0e9ee8d382657949b4da69eca6  pack-pin.test.mjs
cdf4a6b4ee975201da76df054383c0a1ef2aab993d5a8b024967408a7d0a0c73  approved-pin.test.mjs
```

The PC worktree's `.git` is a FILE (a linked worktree), and the whole bar is green there:
that answers the worktree half of question (3) by execution, not by argument.

## 2. RED FIRST, RE-PROVED: THE NEW ROWS OVER THE UNCHANGED ENGINES AT 1d0cbffa

Method: the 1d0cbffa cells verbatim, with ONLY this round's new row block appended, in a
tree that carries design.cjs and plain-copy.cjs so the file list still loads. Baseline
counts of the plain 1d0cbffa cells, measured: pack-pin 41/40/1, approved-pin 26/25/1,
which is what the report states.

Windows (the platform where the case rows have teeth):

```text
pack-pin      58 tests, 53 pass, 5 fail
  not ok 40 - REAL ROW (deliberate)
  not ok 53 - Astra P-PACK-1: pack root ancestor junction same-byte
  not ok 54 - Astra P-PACK-1: pack root ancestor junction dangling
  not ok 55 - Astra P-PACK-1: pack root ancestors and root require exact spelling
  not ok 58 - Astra P-PACK-1: missing pack ancestor stops before descent
approved-pin  42 tests, 36 pass, 6 fail
  not ok 25 - REAL ROW (deliberate)
  not ok 38 - Astra P-PACK-1: approved ancestor junction same-byte
  not ok 39 - Astra P-PACK-1: approved ancestor junction dangling
  not ok 40 - Astra P-PACK-1: case-only rename of approved file is MISSING
  not ok 41 - Astra P-PACK-1: case-only rename of approved parent is MISSING
  not ok 42 - Astra P-PACK-1: missing approved ancestor stops before descent
```

That is exactly the 58/53/5 and 42/36/6 the report claims. F1 and F4 are really fixed.

Linux, same method: pack-pin 58/54/4 and approved-pin 42/38/4. The three case rows
(pack 55, approved 40 and 41) are GREEN against the unchanged engine there, because a
case-only rename on a case-sensitive filesystem already made the old single lstat fail.
So the exact-spelling clause is red-first on Windows only, which is the platform it was
ordered for. Stated so it is not mistaken for a two-system proof.

Controls: rows "ordinary nested path", "a 455-character absolute path" and
"composed and decomposed names" pass against both engines. They are controls.

The P-PACK-2 "differ" rows are GREEN against the unchanged 1d0cbffa engine on both
systems, and so is every digest vector. They cannot be red there: round 5 changed no
byte of the digest path. Their red-first evidence is a digest mutant, measured in
section 4, and the report says exactly this. The PM's expectation that every P-PACK-2
"differ" row be red at 1d0cbffa is not met and should not be.

## 3. THE PM'S OWN QUESTIONS, EACH ANSWERED BY MEASUREMENT

### (a) The trusted boundary, and the Windows CI runner

The expression under review:

```js
const boundary = path.relative(REPO_ROOT, packRoot).split(path.sep)[0] === ".." ? os.tmpdir() : REPO_ROOT;
const parts = path.relative(boundary, packRoot).split(path.sep);
```

Measured on the PC with the real win32 path module (one row printed these):

| REPO_ROOT | packRoot | path.relative | boundary chosen | first component joined |
|---|---|---|---|---|
| D:\a\prepledger\prepledger | C:\Users\RUNNER~1\AppData\Local\Temp\s9-astra-a1 | C:\Users\RUNNER~1\AppData\Local\Temp\s9-astra-a1 | REPO_ROOT | D:\a\prepledger\prepledger\C: |
| C:\a\prepledger\prepledger | C:\Users\RUNNER~1\AppData\Local\Temp\s9-astra-a1 | ..\..\..\Users\RUNNER~1\... | os.tmpdir() | n/a |
| C:\Users\joeym\AppData\Local\Temp\<scratch> | C:\Users\joeym\AppData\Local\Temp\s9c-b-b0HB5V | ..\..\s9c-b-b0HB5V | os.tmpdir() | n/a |
| c:\repo (lower-case drive) | C:\repo\rebuild\m1\approved-2026-09-18 | rebuild\m1\approved-2026-09-18 | REPO_ROOT | c:\repo\rebuild |
| C:\repo | C:\repo (equal to the boundary) | "" | REPO_ROOT | C:\repo |

Read these four answers off the table.

1. THE 8.3 SHORT SPELLING IS NOT THE HAZARD. os.tmpdir() returns the same string
   mkdtemp was given, so path.relative agrees with what mkdtemp returned and the exact
   spelling comparison is satisfied. An honest fixture stays green under RUNNER~1.
2. A DIFFERENT DRIVE IS THE HAZARD. path.win32.relative returns the target ABSOLUTE
   when the drives differ, its first segment is "C:" and not "..", so the boundary
   becomes REPO_ROOT and the first component joined is D:\a\prepledger\prepledger\C:,
   which no lstat can find. Every fixture pack then refuses PACK-ROOT-ABSENT.
   I could not execute that on a GitHub runner (see (a) second half), so I executed the
   equivalent single-clause change `const boundary = REPO_ROOT;` over all 58 rows:
   Windows 58 tests, 8 pass, 50 fail; Linux 58 tests, 7 pass, 51 fail. Honest fixtures,
   all red. This is BLOCKING-2.
3. A DRIVE LETTER IN A DIFFERENT CASE IS SAFE: node's win32 path.relative compares
   case-insensitively, and the components come out as the pinned spelling.
4. A PACK ROOT EQUAL TO THE BOUNDARY refuses PACK-ROOT-ABSENT, because parts is [""]
   and no directory listing contains the empty name. Not reachable for the real pack
   (PACK_ROOT_REL is never empty); recorded because the PM asked.
5. A PACK ROOT OUTSIDE BOTH the repository and os.tmpdir() also refuses
   PACK-ROOT-ABSENT, because parts then begins ".." and no listing contains "..".

Severity of BLOCKING-2, said plainly: it can never produce a FALSE GREEN. It produces a
loud false red on the very run the S9 integrator is waiting to see go green, and 50 red
fixture rows are indistinguishable at a glance from a real pin failure. The cause is
structural and the fix is not a loosening: PACK-PIN already HOLDS the components it
needs (PACK_ROOT_REL, and PACK_ROOT_ABS is built from it). APPROVED-PIN's judge takes
(root, relative path) and splits the pinned spelling, which is correct and drive-proof.
PACK-PIN's judge should take the same shape instead of reverse-engineering the
components from two absolute paths against a guessed boundary.

CI HOME, and what the runners actually say. The two cells DO have a CI home: one step,
`.github/workflows/rebuild.yml:319`, on ubuntu-latest AND windows-latest. It has never
executed. The last rebuild run of this branch is #1581 at d857d77540ef69fe, and BOTH
jobs, rebuild-public (ubuntu-latest) and rebuild-public (windows-latest), concluded
FAILURE in 2m19s. That is what the step's own comment at rebuild.yml:313-317 predicts:
the standing package step fails first on a preparation branch and GitHub skips every
later step. So there is NO both-OS CI evidence for these cells today; the owner's PC and
a Linux farm scratch are the both-OS evidence, and BLOCKING-2 will first be visible on
the day the S9 head makes the step run.

### (b) fs.readdirSync(parent) is not inside a try. Reachable? YES. BLOCKING-1.

The clause, in approved-pin's judge:

```js
try { st = fs.lstatSync(full); } catch { st = null; }
if (st === null) { problem = "MISSING"; break; }
if (i < parts.length - 1 && !st.isDirectory()) { problem = "NOT-A-REGULAR-FILE"; break; }
if (!fs.readdirSync(parent).includes(parts[i])) { problem = "MISSING"; break; }
```

The lstat is guarded. The readdir is not. A directory that can be TRAVERSED but not
LISTED lets the lstat succeed and makes the readdir throw. Both operating systems have
that state and it is ordinary, not exotic.

WINDOWS, executed. Tree: <mkdtemp>/locked/a.txt and <mkdtemp>/open/b.txt, list
["locked/a.txt", "open/b.txt"], then `icacls <mkdtemp>\locked /deny joeym:(RD)`.

```text
round 5 (d857d775): lstat(child)=isFile=true | readdir(parent)=THREW EPERM
                    judge threw=EPERM: operation not permitted, scandir | refusals=null
round 4 (1d0cbffa): lstat(child)=isFile=true | readdir(parent)=THREW EPERM
                    judge threw=null | refusals=["APPROVED-PIN MISMATCH open/b.txt"]
```

LINUX, executed, same tree, `chmod 0111` on locked, run as uid 65534 so the mode bites:

```text
round 5 (d857d775): lstat(child)=isFile=true | readdir(parent)=THREW EACCES
                    judge threw=EACCES | refusals=null
round 4 (1d0cbffa): judge threw=null | refusals=["APPROVED-PIN MISMATCH open/b.txt"]
```

The later entry, open/b.txt, is judged at round 4 and LOST at round 5. This is the exact
behaviour the cell's own header forbids at :24-:27: "UNREADABLE (the PM's ruling on the
author's Q2: a named file the cell cannot read is NAMED and the list walk CONTINUES,
rather than throwing and taking every later entry of the list with it)". APPROVED-PIN's
header declares ONE residual (a duplicate name in the list) and it is not this one, so
this is not a stated residual of that cell: it is a regression of a ruled fix.

PACK-PIN HAS THE SAME NEW HOLE, one level up. Its boundary walk calls
`fs.readdirSync(dir)` unguarded for each ancestor of the pack root. Executed on Linux
with an unlistable ancestor of the pack root:

```text
before chmod: packPin(...) = ["PACK-PIN MISMATCH a.txt"]
after  chmod: packPin(...) THREW EACCES
```

PACK-PIN's header does declare a residual for an unreadable DIRECTORY inside the walk
(:43-:46). That residual is about the pack's own contents. The new clause extends the
same throw to the pack root's ANCESTORS, which on a real checkout are REPO_ROOT,
rebuild/ and rebuild/m1/. That extension is not stated anywhere and it is not covered by
the residual as written.

THE FIX IS A NARROWING, NOT A LOOSENING: put the readdir in a try and, on a throw, take
the refusal the cell already owns. APPROVED-PIN can name UNREADABLE (its seventh
refusal, already in the vocabulary) or MISSING and CONTINUE the list walk; PACK-PIN can
return PACK-ROOT-ABSENT or NOT-A-REGULAR-FILE by its existing rules. No new vocabulary
byte is needed, which matters because from S9 the vocabulary is sealed. It needs a row
in each cell; the rows I executed above are the shape of them, and an OPTIONAL lister
passed only by fixture rows is the same affordance the OPTIONAL reader already is,
so the real rows keep passing none.

### (c) Cost of the new walk

Counted by hooking fs.lstatSync and fs.readdirSync around one real approvedPin call.

| Tree | lstat | readdir | dirents scanned | Linux | Windows |
|---|---:|---:|---:|---:|---:|
| 1,300 files, 5 components each | 6,500 | 6,500 | 55,900 | 75 ms | 417 ms |

What the REAL cells actually pay today. design.APPROVED names TWO files
(rebuild/m3/w7-preview/today/design.cjs:43-:51), so APPROVED-PIN's real cost is 8 lstat
and 8 readdir. PACK-PIN's new clause is exactly 3 lstat and 3 readdir (rebuild, m1,
approved-2026-09-18); the ~1,300-file pack is walked by the UNCHANGED recursive walk,
which measures 66 to 69 ms on the PC at 904 files, the same as before this round. The
real rows time at about 1 ms on both systems.

ANSWER: a per-directory cache would be SURFACE today, by two orders of magnitude, and it
would add a second source of truth for what a directory contains. Recommend against it.
If design.APPROVED ever grew to pack size, 417 ms on Windows is still not the cost that
would matter. Recorded so it is a decision.

### (d) The monkeypatched hooks

Four questions, four measurements.

1. DO THE HOOKS SEE THE ENGINE'S CALLS? YES, and it is proved by execution rather than
   by inspection: against the 1d0cbffa engine the row "missing pack ancestor stops
   before descent" is RED, and the only thing that can make it red is the hook observing
   the old engine's lstat of a path inside the blocked subtree. Same fs namespace
   object, mutated in place; the engine's `fs.lstatSync(...)` is a property lookup.
2. ARE THEY RESTORED WHEN AN ASSERTION THROWS? YES. The restoration is the first two
   statements of the `finally`, before the assert. Measured: in the red-first runs the
   junction rows fail and every later row behaves normally.
3. CAN THEY HIDE A DESCENT MADE THROUGH ANOTHER API? YES. Executed: fs.statSync and
   fs.opendirSync were both called INSIDE the blocked subtree and `attempts` stayed
   `[]`. fs.promises and the async fs.readdir are equally invisible. The engine uses
   only lstatSync and readdirSync today, so no row is wrong; a later engine that
   descended through statSync would keep these rows green. NOTE N6.
4. ONE DIAGNOSTIC WEAKNESS. The `assert.deepEqual(attempts, [], ...)` sits in the
   `finally`. If the body throws AND a descent was attempted, the assertion error
   REPLACES the body's error, so the reader is told about the descent and not about the
   refusal that was wrong. NOTE N5.

### (e) S9_NAME, s9Pin and s9Pair are declared AFTER the rows that close over them

Proved, not argued. A minimal module with a `test()` that reads a `const` declared below
it printed, in order: "module body finished", then "bodyDone=true LATER=42". The node
test runner schedules every top-level `test()` and starts none of them until module
evaluation completes, so no row can observe the temporal dead zone. Measured on node
v22.22.2 and node v24.19.0, which are the two versions of record (CI pins node 22).
NO DEFECT. The declarations still read backwards; moving them above their first use
costs nothing and removes a trap for the next hand. NOTE N7.

### (f) The six digest vectors, verified outside the cell

Verified a third time, independently of both certutil and .NET: bytes written with
printf on Linux, digests taken with sha256sum. All six match the S9_HEX table in BOTH
cells, byte for byte.

```text
empty        (0 bytes)        e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
abc          (3 bytes)        ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
hello LF     (6 bytes)        5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03
hello CRLF   (7 bytes)        cd2eca3535741f27a8ae40c31b0c41d4057a7a7b912b33b9aed86485d1c84676
c3 28        (2 bytes)        eddf68639913a3cb8331cdfe7f87559e0beccf2c289c0d90ac4d89b3204004f8
ef bf bd 28  (4 bytes)        2d4bf56bf338c578dae8b2b20d4d8b28801557d4c38e1d7c6699abddf69fee8d
```

P-PACK-2 IS SATISFIED, and the gap it was ordered to close is real: a mutation of the
SHARED sha256 helper (decode UTF-8, normalise CRLF) kills ONLY the new independent rows,
28-29 and 31-32 in APPROVED-PIN, and NO old row at all, because every old fixture
computes its expectation with the same helper.

## 4. DOES ANY HONEST TREE NOW REFUSE

Executed, one line each.

| Honest tree | Result |
|---|---|
| A symlinked ancestor ABOVE the trusted root (repo reached through a symlinked parent) | NO refusal. Both cells: 58/57/1 and 42/41/1, unchanged. The walk starts at the boundary and never lstats above it. |
| A repository under a path with mixed case | NO refusal. A pack root under <tmp>\MiXeD judged green. |
| A worktree, `.git` a FILE and not a directory | NO refusal. The PC bar IS this case: `.git` is a 79-byte file. |
| A pack file whose name needs NFC or NFD | NO refusal for the spelling the tree holds. Measured on NTFS: a composed name is written and read back composed and is green; the decomposed spelling is MISSING, which is correct, because the literal is generated from git's own bytes and git checks the same bytes out. macOS is not a platform of record. |
| A name with a trailing dot on Windows | NO refusal. node created "dotted." on NTFS and readdir returned "dotted." unchanged, so the exact-spelling test passes. Git will not normally produce such a name. |

Two SMALL honest-tree changes this round did introduce, both in APPROVED-PIN, both
recorded rather than disputed. A list entry spelled "./x" or "a//x" is now MISSING,
because a directory listing contains neither "." nor "". Round 4's path.join normalised
both away and found the file. design.APPROVED holds neither spelling today. The SAME
test is what now blocks a ".." segment in the list from walking above the root, which is
a gain, so this is a trade and not a regression.

## 5. SINGLE-CLAUSE CHANGES: EVERY CLAUSE THIS ROUND ADDED, ALL ROWS OF THAT CELL

Each line is one independent copy with one clause changed, all rows of that cell re-run.
"Additional red" excludes the two intentional real rows. W = Windows, L = Linux.

| # | Cell | Single clause changed | W additional red | L additional red |
|---|---|---|---|---:|
| P-C1a | pack | boundary always REPO_ROOT (the cross-drive shape) | 50 rows: 1-11, 13, 15, 18, 20-26, 28-38, 40-55, 58 | 51 rows |
| P-C1b | pack | boundary always os.tmpdir() | NONE | NONE |
| P-C2 | pack | component lstat null refuses only on the last component | 56 | 53, 56 |
| P-C3 | pack | drop the ancestor isDirectory test | 51, 52 | 51, 52 |
| P-C4a | pack | drop the exact-spelling readdir test | 53 | NONE |
| P-C4b | pack | exact-spelling test made case-insensitive | 53 | NONE |
| P-C5 | pack | drop the post-loop pack-root-is-a-directory test | 17, 34 | 17, 34 |
| P-C6 | pack | label() lower-cases the refusal spelling | 16, 17, 19, 27, 34, 51, 52, 53, 56 | n/a |
| A-D1 | approved | component lstat null refuses only on the last component | 40 | 39, 40 |
| A-D2 | approved | drop the ancestor isDirectory test | 36, 37 | 36, 37 |
| A-D3a | approved | drop the exact-spelling readdir test | 38, 39 | NONE |
| A-D3b | approved | exact-spelling test made case-insensitive | 38, 39 | NONE |
| A-D3c | approved | exact-spelling test applied only to the last component | 39 | NONE |
| A-D4 | approved | the two ancestor refusal words swapped | 4, 36-40 | 4, 36-40 |
| A-D5 | approved | drop the post-loop isFile test | 10, 19 | 9, 10, 19 |
| A-D6 | approved | the whole round-5 component walk replaced by round 4's single lstat | 36-40 | 36, 37, 40 |
| A-D7 | approved | the component refusal lower-cases the pinned spelling | 4 | n/a |

ONE SURVIVOR, AND IT IS A FINDING. P-C1b: making the boundary ALWAYS os.tmpdir() kills
NOTHING on either operating system. Every fixture pack lives in the OS temp directory,
so the REPO_ROOT arm of the boundary, the arm THE REAL PACK USES, is exercised by no row
at all. The one row that would exercise it is the real row, which is red by construction
on this branch. Consequence, stated exactly: at the S9 head, when the pack merges and
the literal is filled, the first green the integrator ever sees would be produced by a
clause no fixture has ever executed. Under P-C1b the real row would print
PACK-ROOT-ABSENT for a pack that is present, which is a false red and never a false
green, so this is a note and not the blocking half of BLOCKING-2.

THE ROW THAT WOULD KILL IT, and it is cheap: build one fixture pack INSIDE the checkout
rather than in the OS temp directory, for instance `fs.mkdtempSync(path.join(REPO_ROOT,
"rebuild", "lanes", "c", "ui-port", "s9-inrepo-"))`, judge it green against its own
literal, and remove it in a finally. That row dies under P-C1b and under P-C1a alike,
and it is the only row in either cell that would ever execute the boundary's REPO_ROOT
arm before the S9 head. If the PM prefers not to write inside the checkout, the same row
can be had by handing judge the components directly, which is the BLOCKING-2 fix.

THE OTHER SURVIVORS ARE PLATFORM-SHAPED, NOT UNROWED. P-C4a, P-C4b, A-D3a, A-D3b and
A-D3c all survive on LINUX and are killed on WINDOWS. That is expected: a case-only
rename cannot exist on a case-sensitive filesystem, which is the whole reason F4 was
raised. It is worth one sentence in the S9 brief, because a regression run done only on
the farm would pass with the exact-spelling clause deleted.

### The builder's own 30-row table: ten rows sampled and re-measured

Re-executed independently on the PC at the final cell bytes. Report's column on the
left, mine on the right.

| Row | Report's additional red | Mine, re-measured | Same? |
|---|---|---|---|
| P01 root final guard drops !isDirectory | 17, 34 | 17, 34 | yes |
| P05 ignore prefix startsWith -> includes | 1-11, 13, 15, 23-26, 29-31, 33-38 | 1-11, 13, 15, 23-26, 29-31, 33-38 | yes |
| P06 pycache rule drops slice(0,-1) | 25 | 25 | yes |
| P07 sortByBytes uses the default sort | 12, 55 | 12, 55 | yes |
| P11/P12 irregular and unreadable output sorts | NONE | NONE | yes |
| P13 MISMATCH predicate -> false | 2-5, 9, 22-23, 30, 37, 46-47, 58 | 2-5, 9, 22-23, 30, 37, 46-47, 58 | yes |
| P14 MISSING predicate -> false | 7, 15, 35, 58 | 7, 15, 35, 58 | yes |
| P18 shared digest decodes UTF-8 and normalises CRLF | 43-44, 46-47 | 43-44, 46-47 | yes |
| P19 shared digest prepends wrong-domain: | 40-55 | 40-55 | yes |
| A08 ORPHAN byte sort -> default sort | 24 | 24 | yes |
| A10 shared digest decodes UTF-8 and normalises CRLF | 28-29, 31-32 | 28-29, 31-32 | yes |
| A11 shared digest prepends wrong-domain: | 25-39 | 25-39 | yes |

Twelve rows sampled, twelve reproduced exactly. P27, P28, P30, A19, A20 and A22 are the
same mutations as my P-C2, P-C3, P-C4a, A-D1, A-D2 and A-D3a and they reproduce too.
The 30-row table and the 28-row table are honest as written, on Windows.

ONE QUALIFICATION ON THE TABLE, not a defect. P10 removes sortByBytes from the ADDED
list by substituting the DEFAULT sort, and row 55 kills it on both systems. Removing the
sort ENTIRELY instead, so the list comes out in readdir order, is killed on Windows
(rows 11 and 55, because NTFS hands names back in UTF-16 order) and survives on Linux,
where readdir order happened to agree with byte order in every run I took. That is the
same readdir-order non-determinism the PM already upheld as a dispute for the irregular
and unreadable lists; it means the sentence "the ADDED list's sort DOES have a row"
(pack-pin.test.mjs :252) is true on Windows and not reliably true on Linux. One sentence
for the S9 brief.

## 6. THE REPORT AGAINST THE CODE

Every number and every quoted refusal in the new section, checked.

| Claim in "Astra's blind review: fixed" | Verified? |
|---|---|
| Base 1d0cbffa029fad12603d12857671ddaa2cc9ee0a | yes, `git log` |
| Original scratch baselines P 41/40/1 and A 26/25/1 | yes, re-measured |
| Red-first P 58/53/5, A 42/36/6, with those exact TAP lines | yes, re-measured on Windows |
| The six digest vectors | yes, third-party verified with sha256sum on Linux |
| Final bar P 58/57/1 and A 42/41/1, only failing row the real row | yes, both systems |
| The three quoted real refusals | yes, character for character |
| The two cell sha256 values | yes, both machines |
| "Both complete cells are ASCII and contain no CR" | yes: zero non-ASCII bytes, zero CR, in both |
| "All 30 processes exited 1" | the tallies reproduce; I did not capture exit codes per process |
| "The existing file-link rows reported EPERM on this Windows PC" | yes, the run prints "PACK-PIN file-link on win32 is unbuildable unprivileged, code: EPERM" |
| "Controls P48-P50 / A33-A35 passed both unchanged and final cells" | yes |
| "no honest failure against a correct digest/order helper is claimed" | correct, and it is the right claim |
| F3 not ordered, F6 on the S9 integration list, F7 a note | consistent with the ticket |

The report is accurate where I could check it. It does not claim Linux execution and it
does not claim CI: both of those gaps are stated in "What I did not verify", and I have
now closed the Linux half and reported the CI half in section 3(a).

ONE SENTENCE IN THE REPORT THAT THE CODE DOES NOT CARRY. "APPROVED checks every
component below its supplied repository root" is true of the metadata, but the report
does not say that the new listing call is the cell's only unguarded filesystem call, and
"the fixture packs walk from the OS temp directory" is stated as a fact about the
fixtures rather than as the ASSUMPTION about the world that it actually is. Both are
covered by BLOCKING-1 and BLOCKING-2.

## 7. NOTES, WORDED SO THE S9 BRIEF CAN CARRY THEM

N1. The boundary's REPO_ROOT arm, the arm the real pack uses, has no fixture row on
either operating system (survivor P-C1b). One in-checkout fixture pack closes it.

N2. The exact-spelling clause has NO row on Linux (P-C4a, P-C4b, A-D3a, A-D3b, A-D3c all
survive there and all die on Windows). A regression run taken only on the farm would
pass with that clause deleted.

N3. The ADDED list's byte sort has a deterministic row on Windows and a readdir-order
dependent one on Linux. pack-pin.test.mjs:252's sentence should say "on Windows".

N4. The 455-character row computes `remaining = 455 - root.length - 1 - tail.length` and
then `"f".repeat(remaining - first.length)`, where first is 242 characters. If
os.tmpdir() is longer than about 205 characters the repeat count goes negative and the
row throws RangeError on an entirely honest machine. A clamp, or skipping the row when
the budget is negative, is one line.

N5. s9NoDescents asserts inside its `finally`. When the body throws AND a descent was
attempted, the assertion error replaces the body's error and the weaker diagnostic wins.

N6. The s9NoDescents hooks are blind to fs.statSync, fs.opendirSync, fs.promises and the
async fs.readdir (measured: `attempts` stayed empty after statSync and opendirSync inside
the blocked subtree). No row is wrong today; a later engine that descended through one of
those APIs would keep these rows green. Hooking them, or asserting from the cell's own
source that the engine names only lstatSync and readdirSync, closes it.

N7. S9_NAME, s9Pin and s9Pair are declared below the rows that use them. Proved safe by
measurement on node 22 and node 24; still worth moving above first use.

N8. Cost is not a problem and a per-directory cache would be surface: PACK-PIN adds
exactly 3 lstat and 3 readdir, APPROVED-PIN 8 of each for today's two-file list, and the
1,300-file worst case measures 75 ms on Linux and 417 ms on Windows.

N9. PACK-PIN names a junction standing at an ANCESTOR of the pack root
NOT-A-REGULAR-FILE and a junction standing AT the pack root PACK-ROOT-ABSENT. Two words
for the same physical defect, one component apart. Deliberate (R2 B1 owns the second),
but the S9 brief should say it so a refusal is not misread.

N10. An APPROVED list entry spelled "./x" or "a//x" is now MISSING where round 4 found
the file. design.APPROVED holds neither spelling. The same test blocks a ".." segment
from walking above the root, which is a gain.

N11. These cells have a CI home (rebuild.yml:319, both runners) that has never executed:
run #1581 at d857d775 failed on ubuntu-latest AND windows-latest before reaching it, as
the step's own comment predicts. F6 stays on the S9 integration list, and BLOCKING-2 will
first become visible on the day that step runs.

N12. The two real rows stay red and the two literals stay unfilled. That is by
construction and this review does not touch it.

## 8. QUESTIONS FOR THE PM

Q1. BLOCKING-2's trigger is "the runner's checkout drive differs from the drive
os.tmpdir() reports". I could not execute on a GitHub runner because the step is
skipped. Does the PM want the one-line proof added as a CI step at the S9 head
(printing process.cwd() and os.tmpdir() on windows-latest), or is the drive-proof judge
signature the cheaper answer? I recommend the second: it removes the question.

Q2. BLOCKING-1's fix needs a refusal word for "a directory the cell cannot list". Both
cells already own one that fits (APPROVED-PIN: UNREADABLE; PACK-PIN: PACK-ROOT-ABSENT or
NOT-A-REGULAR-FILE). Confirm that reusing an existing word, rather than adding an
eighth, is what the sealed-vocabulary rule wants.

Q3. PACK-PIN's declared residual for an unreadable DIRECTORY (:43-:46) is about the
pack's contents. Round 5 silently extended the same throw to the pack root's ancestors
(REPO_ROOT, rebuild/, rebuild/m1/). Should the residual be widened in writing, or should
the ancestors be guarded as BLOCKING-1 asks? I read the second as the ruling's intent.

## 9. WHAT I DID NOT VERIFY

No GitHub runner execution of these two cells (the step is skipped; see N11). No filled
literal and no real pack: rebuild/m1/approved-2026-09-18 is not in this checkout, so
neither real row has ever been green anywhere and this review cannot say what it will
print when it is. No macOS. No per-process exit codes for the builder's 30 mutation runs.
No reading of rebuild/conform/private, src/history.js, any ledger, EarnedPort,
port-real.log or the soak; no seal, receipt, artifact or tree write; no npm or pip
install; no node_modules change; no browser. Every fixture in every measurement above was
built by the measuring process out of bytes it wrote itself, in its own mkdtemp folder,
and removed again. All scratch worktrees and scratch trees I made are my own and are the
only things I removed. farm-verify printed PASS on the one sync this review used.
