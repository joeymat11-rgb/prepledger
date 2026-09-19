# S9-PREP-PACK CHECK L1 (narrow Claude check of Astra's round 6 build)

Reviewer: cowork (Earned lane hand). Loop round 1 of 3, running without the PM by the
owner's ruling at DECISIONS:613. The PM judges once at the end.

Build under check: 497cef76 on rebuild/b-s9-prep-pack, the single build commit on top of
0a74d8f2 (CHECK-R5). Ordered for this round: P-PACK-4 and P-PACK-5 of DECISIONS:608.

Systems, both re-measured by me, neither taken from the builder's report:
PC, win32, node v24.19.0 at the runtime path the assignment names, worktree
%TEMP%\earned-astra-45 at 497cef7 and clean, MEASURED_TEST_NOW=2026-09-03 and
TZ=America/New_York each set on its own line.
LINUX, a farm scratch worktree at 497cef76 with the same two environment values.

Narrow means: this round's diff and the two rulings it was ordered to carry out.
Everything printed below was executed by me at this head.

## VERDICT: REJECT

ONE blocking finding. It is an order the round did not carry out rather than a defect the
round introduced, and the builder states the shortfall himself at the head of his new
section. P-PACK-5 is not implemented; the defect P-PACK-5 was ruled to close
(CHECK-R5 BLOCKING-2) is still present, still reachable by a hosted Windows runner, and
I re-measured it at this head on both operating systems.

P-PACK-4 is carried out at every site CHECK-R5 named, and I re-proved that with REAL
permissions on linux (chmod 0111 under a non-root uid) and with REAL ACLs on Windows,
not only with the cell's injected stub. The bar is exactly one red per cell on both
systems and it is THE REAL ROW. Nothing in this file asks for a law, a guard, a pin or a
test to be weakened. The one fix it asks for is a narrowing.

DISPUTES: the builder disputed nothing. His report offers no measurement against any
CHECK-R5 finding; it declares a shortfall and asks a scope question. A declared shortfall
is not a dispute, so BLOCKING-2 of CHECK-R5 stands as an order. Section 4 answers his
scope question, because in a loop without the PM the reviewer's undisputed findings are
the author's orders and nobody waits for a ruling inside the loop.

## 1. THE BAR AT THE HEAD, RE-MEASURED BY ME ON BOTH SYSTEMS

| Cell | System | Tests | Pass | Fail | Skip | The only not ok |
|---|---|---:|---:|---:|---:|---|
| pack-pin | PC | 63 | 62 | 1 | 0 | 62 REAL ROW |
| pack-pin | linux | 63 | 60 | 1 | 2 | 62 REAL ROW |
| approved-pin | PC | 45 | 44 | 1 | 0 | 44 REAL ROW |
| approved-pin | linux | 45 | 43 | 1 | 1 | 44 REAL ROW |

Exactly one red in each cell on each system and it is THE REAL ROW. No other red.
The three linux skips are the three new Windows list-directory ACL rows, and each skips
by its own declared name, so nothing skips silently. On the PC nothing skips at all,
which means the ACL rows really execute there.

The two real refusals are unchanged and are the reds the cells were written for:

```text
PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
```

BOTH CELLS ARE THE SAME BYTES ON BOTH SYSTEMS. certutil on the PC and sha256sum on
linux, identical, and identical to the builder's own values:

```text
3dee73893b7a6c37cf4e54446b2ebbf0489f75e6da1da29d74e7ae24295330b5  pack-pin.test.mjs
ed810372bb82d375ea3ff437f02948f6e28bee9a8fd882554da74845a598f075  approved-pin.test.mjs
```

Line endings and vocabulary of bytes, measured by me on the PC over all three owned
files (both cells and the author report): CR=0, U+2013 and U+2014 count 0, and every
character is ASCII (non-ASCII character count 0 in all three).

## 2. RED FIRST, RE-PROVED BY ME FOR EVERY NEW ROW, ON BOTH SYSTEMS

The round adds eight rows: five in PACK-PIN (the N5 hooks row, and four P-PACK-4 rows
over ancestor and root, injected and Windows ACL) and three in APPROVED-PIN (the N5 row
and two P-PACK-4 rows). I copied ONLY the new rows and their two new helpers into a
scratch copy of the PREVIOUS cells, which are the round 5 cells at 0a74d8f2, engines and
hooks untouched, and ran them.

WINDOWS (round 5 engine plus round 6 rows):

```text
== RED FIRST pack-pin (round-5 engine + round-6 new rows) ==
not ok 57 - R6 N5: no-descent hooks restore and preserve the body's own error
not ok 58 - R6 P-PACK-4: unlistable pack ancestor injected
not ok 59 - R6 P-PACK-4: unlistable pack ancestor Windows ACL
not ok 60 - R6 P-PACK-4: unlistable pack root injected
not ok 61 - R6 P-PACK-4: unlistable pack root Windows ACL
not ok 62 - REAL ROW: the owner-approved pack at this head, against this cell's own literal
# tests 63 | # pass 57 | # fail 6 | # skipped 0
== RED FIRST approved-pin (round-5 engine + round-6 new rows) ==
not ok 41 - R6 N5: no-descent hooks restore and preserve the body's own error
not ok 42 - R6 P-PACK-4: unlistable approved parent names UNREADABLE and continues injected
not ok 43 - R6 P-PACK-4: unlistable approved parent names UNREADABLE and continues Windows ACL
not ok 44 - REAL ROW: whatever design.APPROVED names at this head, against this cell's literal
# tests 45 | # pass 41 | # fail 4 | # skipped 0
```

EVERY new row is red on the previous engine, including the two ACL rows that cannot run
on linux. These counts are EXACTLY the counts the builder asserts in prose (PACK
63/57/6, APPROVED 45/41/4), which matters because his two red-first code fences are
EMPTY in the committed file (note N7 below).

LINUX (same construction): pack-pin 63 tests, 57 pass, 4 fail, 2 skipped; approved-pin
45 tests, 41 pass, 3 fail, 1 skipped. The failing rows are the same ones minus the ACL
rows, which skip by name. So every new row is red first on at least one system and every
new row that can run on both is red first on both.

## 3. P-PACK-4: A DIRECTORY THAT CAN BE TRAVERSED BUT NOT LISTED

The cells prove this with an injected readdirSync stub on both systems and with a real
icacls deny on Windows. A stub proves the code path, not the operating system, so I
built the state for real on linux as well, with a real chmod and a real non-root uid,
and drove the engines directly. The engines are the head's own bytes: for each cell I
took the file's prefix up to the end of its public entry point (pack-pin lines 1 to 279,
approved-pin lines 1 to 181) and exported it, so the code under test is the shipped code
unmodified. The same was done for the round 5 cells to get the before column.

LINUX, real permissions, uid 65534, `chmod 0111` on the directory (traverse yes, list
no). Each line is one executed call.

```text
r5 | APPROVED unlistable parent | child-lstat=true readdir=readdirTHREW EACCES
r5 | APPROVED unlistable parent | THREW EACCES: permission denied, scandir
r5 | PACK unlistable ANCESTOR   | THREW EACCES: permission denied, scandir
r5 | PACK unlistable ROOT       | THREW EACCES: permission denied, scandir
r5 | PACK unlistable INTERIOR   | THREW EACCES: permission denied, scandir

r6 | APPROVED unlistable parent | child-lstat=true readdir=readdirTHREW EACCES
r6 | APPROVED unlistable parent | ["APPROVED-PIN UNREADABLE locked/a.txt",
                                   "APPROVED-PIN MISMATCH open/b.txt"]
r6 | PACK unlistable ANCESTOR   | ["PACK-PIN UNREADABLE <tmp>/f-xxxx/parent"]
r6 | PACK unlistable ROOT       | ["PACK-PIN UNREADABLE <tmp>/f-xxxx/parent/pack"]
r6 | PACK unlistable INTERIOR   | THREW EACCES: permission denied, scandir
```

Read this line by line. The directory really is traversable and really is not listable:
lstat of the known child succeeds and readdir throws EACCES. At round 5 the judge threw
for all four shapes. At round 6:

- APPROVED names UNREADABLE for THAT ENTRY and THE LIST WALK GOES ON: the later entry
  open/b.txt is still judged, and it is judged as MISMATCH. That is P-PACK-4's exact
  words. The ACL row in the cell also pins that no bytes are read for the refused entry
  (its `reads` array holds only open/b.txt), and I reproduced that.
- PACK refuses an unlistable ANCESTOR and an unlistable ROOT with UNREADABLE, which is
  an EXISTING word of its seven. The vocabulary row (pack 63, approved 45) is green on
  both systems, so no eighth word entered either cell.
- PACK's INTERIOR directory listing inside walk() still throws. See note N1: that is the
  cell's own declared residual (b), it predates this round, and CHECK-R5 accepted it.

WINDOWS: the cell's own ACL rows execute there (0 skipped in section 1), and they are
red first on the round 5 engine (section 2). The deny is `icacls /deny <account>:(RD)`
on a directory the row creates under mkdtemp, cleared with `icacls /remove:d` in a
finally. I also confirmed the whole worktree is clean after every run I made.

## 4. BLOCKING: P-PACK-5 IS NOT IMPLEMENTED, AND THE DEFECT IT WAS RULED TO CLOSE IS STILL LIVE

P-PACK-5 has three clauses. I measured all three at this head. None holds.

THE CLAUSE IS UNCHANGED. pack-pin.test.mjs line 214, inside judge, is byte for byte what
CHECK-R5 rejected:

```js
const boundary = path.relative(REPO_ROOT, packRoot).split(path.sep)[0] === ".." ? os.tmpdir() : REPO_ROOT;
```

(1) "no code path compares two absolute paths". This line differences two absolute paths
and reads the first segment of the result. It is the only such comparison and it is
still there.

(2) "the real row and every fixture run the SAME arm". I instrumented that line in a
scratch copy and counted which arm every judge call takes over a whole run of the cell:

```text
ARMS {"tmp":73,"repo":1}
REPO-ARM-CALLS ["<checkout>/rebuild/m1/approved-2026-09-18"]
```

Seventy three calls take the os.tmpdir() arm. Exactly ONE takes the REPO_ROOT arm, and
it is the REAL ROW's pack root. So the arm the real pack uses is exercised by no fixture
at all, which is also CHECK-R5's N1, unchanged.

(3) "replacing the trusted root by another directory turns rows red". The condition a
hosted Windows runner creates is a checkout on one drive and TEMP on another. I measured
the selection on the real win32 node with the runner's own spellings:

```text
packRoot=C:\Users\RUNNER~1\AppData\Local\Temp\pack-1 | path.relative=C:\Users\RUNNER~1\AppData\Local\Temp\pack-1 | first=C: | boundary=REPO_ROOT
packRoot=C:\Users\runneradmin\AppData\Local\Temp\pack-1 | path.relative=C:\Users\runneradmin\AppData\Local\Temp\pack-1 | first=C: | boundary=REPO_ROOT
packRoot=D:\a\prepledger\prepledger\rebuild\m1\approved-2026-09-18 | path.relative=rebuild\m1\approved-2026-09-18 | first=rebuild | boundary=REPO_ROOT
```

path.relative returns an ABSOLUTE path when the drives differ, its first segment is the
drive letter and never "..", so the expression picks REPO_ROOT for every disposable
fixture pack. The equivalent single-clause change is therefore `const boundary =
REPO_ROOT;`, which is the value the expression returns in that world. Run at this head:

| System | Tests | Pass | Fail | Skip |
|---|---:|---:|---:|---:|
| PC | 63 | 9 | 54 | 0 |
| linux | 63 | 8 | 53 | 2 |

The first red is `not ok 1 - GREEN CONTROL: the fixture pack as built, against its own
literal, refuses nothing`. A loud false red across almost the whole cell, on an honest
tree. It can never be a false green, and that is why this is the shape of defect a
reviewer must still refuse: from S9 these cells gate lane C acceptance, and a cell that
is red for a reason that is not the pack is a cell nobody can read.

ONE MORE THING, AND IT IS THE REASON I CALL THIS AN OVERSIGHT RATHER THAN A DESIGN. The
same file already knows the idiom, eighty six lines above, in label():

```js
const rel = path.relative(REPO_ROOT, root);
return rel && !rel.startsWith("..") && !path.isAbsolute(rel) ? toPosix(rel) : toPosix(root);
```

label() tests `path.isAbsolute(rel)`. The boundary at line 214 tests only for "..". The
cell's own labelling is cross-drive correct while its trusted boundary is not.

### The builder's scope question, answered here so the loop can turn

He asks whether P-PACK-5 authorises the mechanical edits to PACK-PIN's call sites and to
the R2 Q2 interface row (which pins `packPin.length === 2` and the exact real call
`packPin(PACK_ROOT_ABS, LITERAL)`) against the brief's byte-unchanged rule. He was right
not to assume. The answer is YES, and narrowly:

- P-PACK-5 orders PACK-PIN's judge to take "a trusted root and the pinned RELATIVE
  components". A signature cannot change while its call sites stay byte-unchanged, so
  the ruling that orders the signature necessarily names those edits. A rule about
  unnamed rows cannot forbid what a ruling requires.
- The authorisation covers exactly this: the entry point's parameters, every call site's
  arguments, and the R2 Q2 row's arity and real-call assertions updated to the new
  shape. Nothing else. No row may be deleted, no assertion relaxed, no default parameter
  used to keep an arity number true while the shape changes underneath it.
- The R2 Q2 row must stay a real pin after the edit: it must assert the new arity and
  the exact real call with the trusted root and the pinned relative components, so that
  the real row provably goes through the same door as the fixtures.
- After the change, the arm count of clause (2) above must come out as a single arm for
  all calls. That is the measurement that closes this finding, and I will re-run it.

## 5. ONE SINGLE-CLAUSE CHANGE FOR EVERY CLAUSE THE ROUND ADDS OR MOVES

Every mutation below ran ALL rows of its own cell in an independent scratch copy, on
both systems. "Killed" means at least one row other than the REAL ROW went red.

| ID | Clause the round added or moved | linux | PC (win32) |
|---|---|---|---|
| P1 | walk ignores the passed listing and lists the root itself | SURVIVED | SURVIVED |
| P2 | ancestor listing guard returns PACK-ROOT-ABSENT instead of UNREADABLE | killed 58 | (same clause as P33 in the builder's table) |
| P3 | ancestor listing guard removed (readdir bare) | killed 58 | killed |
| P4 | ancestor guard mislabels: label(component) instead of label(dir) | killed 58 | killed |
| P5 | root listing guard removed (readdir bare) | killed 60 | killed |
| P6 | root listing guard returns PACK-ROOT-ABSENT instead of UNREADABLE | killed 60 | killed |
| P7 | exact-spelling check disabled (`if (false)`) | SURVIVED | killed 53 |
| P8 | rootNames not passed to walk | SURVIVED | SURVIVED |
| P9 | s9NoDescents rethrows a different error object | killed 57 | killed |
| P10 | s9NoDescents drops the descent assertion | killed 57 | killed |
| P11 | 455-character budget guard disabled | SURVIVED | SURVIVED |
| P12 | s9DenyListing drops its finally restore | SURVIVED | SURVIVED |
| P13 | icacls denies (GR) instead of (RD) | n/a, row skips | SURVIVED |
| P14 | whoami status assertion removed | n/a, row skips | SURVIVED |
| A1 | parent listing guard sets MISSING instead of UNREADABLE | killed 42 | killed |
| A2 | parent listing guard removed (readdir bare) | killed 42 | killed |
| A3 | exact-spelling check disabled (`if (false)`) | SURVIVED | killed 38, 39 |
| A4 | s9NoDescents rethrows a different error object | killed 41 | killed |
| A5 | s9NoDescents drops the descent assertion | killed 41 | killed |
| A6 | 455-character budget guard disabled | SURVIVED | SURVIVED |
| A7 | s9DenyListing drops its finally restore | SURVIVED | SURVIVED |
| A8 | icacls denies (GR) instead of (RD) | n/a, row skips | SURVIVED |
| A9 | whoami status assertion removed | n/a, row skips | SURVIVED |

Every clause that decides a REFUSAL is killed by a row of the round, on the system where
the row runs. The survivors divide into three kinds and none of them can produce a false
green:

- P7 and A3, the exact-spelling clause, are held on Windows only, exactly as the header
  sentence this round added now says, and as CHECK-R5's N2 said. Measured both ways now,
  not inferred.
- P13, P14, A8 and A9 are EQUIVALENT MUTANTS and no row is owed for them. Denying (GR)
  leaves the same observable state the row asserts (the known child still lstats, the
  listing still throws), and dropping the whoami assertion is caught one line later by
  the assertion on the icacls status, since an empty principal makes icacls fail.
- P1, P8, P11, P12, A6 and A7 are real clauses with no row. They are notes N2, N4 and N5
  below, each with the row that would kill it.

The builder's own P36 ("Drop guarded root-list reuse") is my P1 and P8. He writes that
its linux survival "is an inference from its unchanged refusal path, not an executed
result". I executed it: it survives on linux too, for the reason he gives.

## 6. DOES ANY HONEST TREE NOW REFUSE

Run against the head's own engines on linux. `[]` is green, no refusal.

```text
T1 PACK link ABOVE the root (ancestor is a symlink) => ["PACK-PIN NOT-A-REGULAR-FILE <tmp>/linkdir"]
T2 PACK mixed-case path                             => []
T3 PACK NFC and NFD names both pinned               => []
T4 PACK nested interior directories                 => []
T5 APPROVED root reached through a symlinked ancestor => []
T6 APPROVED NFC and NFD entries                     => []
T7 APPROVED mixed-case entry                        => []
```

No honest tree refuses, and the long-path case is held by the cells' own 455-character
rows, which pass on both systems with no skip on either machine here.

T1 is not a new defect and it is not a regression: refusing a link standing at an
ancestor below the trusted boundary is P-PACK-1's ruled behaviour, and CHECK-R5's N9
already sends the wording of it to the S9 brief. It cannot bite the real pack: for the
real pack the boundary is REPO_ROOT and the only components walked are rebuild/ and
rebuild/m1/ and the pack directory itself. A symlink or junction ABOVE the checkout root
is never lstat'ed by either cell, which I confirmed by the same arm instrumentation in
section 4.

A worktree was not built as a separate fixture: the whole measurement above runs inside
a linked worktree on linux (the farm scratch worktree) and inside an ordinary clone on
the PC, and both give the same bar in section 1.

## 7. THE BUILDER'S REPORT AGAINST THE CODE

The report is a hypothesis and I read it against the hunks. It is honest and it is
unusually careful about what it did not do. What I checked and found true:

- "STATUS: PARTIAL ... P-PACK-5 is NOT implemented" is true, and section 4 measures the
  consequence. He claims no measurement against any finding, so nothing is disputed.
- "no existing row was changed except that expressly named row in each cell" is true of
  the ROWS. Two pieces of shared machinery also changed and he names both: s9NoDescents
  (N5, N6) and the 455-character row (N4). I read the whole diff of all three owned
  paths: nothing else was removed, no assertion relaxed, no vocabulary widened, no
  fixture written inside the tree, no network call, no file outside the three paths.
- The bar table, the two certutil hashes, the three real refusal lines and the claim of
  zero CR bytes and ASCII-only content all reproduce exactly (section 1).
- The mutation table's new rows (P33 to P36, A27 to A29, PN5a to PN5f, AN5a to AN5f,
  PN4, AN4) agree with my independent set in section 5 wherever they overlap.
- "Windows ACL rows were measured inside this sandbox" is a real limit of his run. My
  section 1 and section 2 runs are OUTSIDE the sandbox, on the PC, and the ACL rows are
  green at the head and red first on the previous engine there.
- "Linux survival was NOT measured in this round" is true of his run and is now measured
  in mine.

Where the report is thin, and it is one place only: its two red-first code fences are
EMPTY (note N7). The counts behind them are right, which I proved, but an empty fence in
a report the S9 brief will quote is a hole that should be filled rather than trusted.

## 8. NOTES, WORDED SO THE S9 BRIEF CAN CARRY THEM

N1. THE ONE PLACE P-PACK-4'S LITERAL WORDS ARE STILL UNMET, and I do not make it
blocking. The interior-directory listing inside PACK-PIN's walk() is still a bare
fs.readdirSync, so an unlistable directory INSIDE the pack throws past the rest of the
walk. Executed on linux with real permissions (section 3, the r6 INTERIOR line). The
round guards the ancestors and the pack root and says so in a comment. I do not make
this blocking because it is the cell's own declared residual (b) in its header, it
predates this round, CHECK-R5 examined it and accepted it as declared, and DECISIONS:608
closes P-PACK-4 with "the declared residual is NOT widened", which reads as keeping it.
It is not widened: it covers exactly what it covered before. The PM should decide once,
at the end, between two words. Closing it costs no vocabulary byte (UNREADABLE naming
the directory, and the walk going on) and one row per cell; leaving it costs the S9
brief one named debt. It is the last unguarded listing in either cell.

N2. P1 and P8, the builder's P36. Passing the guarded root listing into walk() has no
row: dropping it survives on BOTH systems, because judge has already listed the root
successfully and a second listing succeeds too. The clause is not useless, it closes a
narrow window between the guarded listing and the walk, and it halves the listings of
the pack root. THE ROW THAT WOULD KILL IT: hook fs.readdirSync for one packPin call over
a fixture pack and assert that the pack root is listed EXACTLY ONCE. That is
deterministic on both systems and cannot flake.

N3. The exact-spelling clause is a Windows row (P7 and A3 survive on linux, killed on
Windows). The round added the header sentence that says so in both cells. Correct, and
now measured on both systems rather than inferred.

N4. The 455-character budget guard (P11 and A6) survives on both systems: no row
exercises it, because no row runs under a temp root long enough. THE ROW THAT WOULD KILL
IT: lift the budget arithmetic into a named helper and pin it with two synthetic root
lengths, one that must skip and one that must not. The builder's own N4 fence, which
does have content, proves the RangeError under an artificially lengthened temp prefix,
so the hazard is real and only the guard is unpinned.

N5. s9DenyListing's finally restore (P12 and A7) survives on both systems: nothing
asserts that fs.readdirSync is put back when the body throws. A leaked global hook would
be a cross-row poison in a file where later rows list directories. THE ROW THAT WOULD
KILL IT: the shape of the new N5 row applied to s9DenyListing, that is, make the body
throw and then assert fs.readdirSync is the original function.

N6. Four Windows-only survivors are EQUIVALENT MUTANTS and owe no row: icacls denying
(GR) instead of (RD) leaves the same observable state the row asserts, and removing the
whoami status assertion is caught one line later by the icacls status assertion.

N7. EVIDENCE GAP IN THE AUTHOR REPORT: the two "Red-first evidence" fences that should
hold the PACK and APPROVED red-first TAP are empty in the committed file. The prose
counts are right, proved in section 2, but they should be pasted before the S9 brief
quotes them.

N8. A NEW CLASS OF TEST, worth one sentence in the brief. Both cells now import
node:child_process and spawn whoami.exe and icacls.exe, and the icacls calls MUTATE
FILESYSTEM ACLs. This is the first time either cell shells out or changes permissions.
It is confined to the row's own mkdtemp fixture, cleared in a finally, skipped by name
off Windows, and nothing is written inside the tree, all of which I verified. A future
reader of the sealed cells should not meet that for the first time in the bytes.

N9. An unlistable ancestor outside the checkout is named by its absolute path and one
inside the checkout by its repository-relative path. That is label()'s own documented
rule, measured, and correct.

N10. label() at pack-pin.test.mjs line 118 already tests path.isAbsolute on the result
of path.relative. The boundary at line 214 does not. Carry this into the S9 brief as the
reason the cross-drive hole is an oversight and not a trade.

N11. CI is unchanged: the cells' one step is still rebuild.yml line 319, on both
runners, and CHECK-R5's N11 (it has never executed on this branch) is not addressed by
this round and is not this round's job. Until the S9 head, the PC and the farm are the
both-system evidence, as they are in section 1.

N12. The two real rows stay red and the two literals stay unfilled. That is by
construction and nobody fixes it.

## 9. WHAT I DID NOT VERIFY

The filled literal and the real pack (both live on the design lane's branches and are
not in this checkout); a hosted CI run; node 22; the product suite and the conformance
gates; anything under rebuild/conform/private, the ledger, the port or the soak, none of
which I read or listed. I ran nothing that seals, writes a receipt or writes an artifact.
I wrote exactly one file, this one. No row of either cell was changed by me: every
mutation and every scratch engine was an independent copy, and `git status --porcelain`
was clean after each batch.
