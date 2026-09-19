# S9-PREP-PACK CHECK L2 (narrow Claude check of Astra's loop round 2 build)

Reviewer: a Claude lane hand, told to disagree. Loop round 2 of 3, run without the PM
under DECISIONS:613 L-2: the previous check's undisputed findings were this round's
orders, and this file's undisputed findings are the next round's, if there is one.

WHAT I CHECKED, AND ONLY THAT: the one build commit `e7b7b228` on top of the previous
check's commit `b4f13e62` on `rebuild/b-s9-prep-pack`, and what it was ordered to do,
which in this round is the findings of `rebuild/lanes/b/S9-PREP-PACK-CHECK-L1.md`:
one BLOCKING (P-PACK-5 of DECISIONS:608 was not implemented) and twelve notes.

THE DIFF IS THREE FILES: `rebuild/lanes/c/ui-port/pack-pin.test.mjs` (+249/-84 in the
stat, the judge's shape and 54 call sites), `rebuild/lanes/c/ui-port/approved-pin.test.mjs`
(+41), and `rebuild/lanes/b/S9-PREP-PACK-AUTHOR-REPORT.md` (+410). I read all three hunks
whole. Nothing else moved. The builder DISPUTED nothing this round, so there is nothing
for me to judge as a dispute.

## VERDICT: ACCEPT

I found no defect that a reachable tree or a CI runner can hit. L1's single blocking
finding is discharged, measured by me on both systems rather than read. P-PACK-4 is
proved on both systems with REAL permission denials that I built myself, not with the
cells' own hooks. Every clause this round adds or moves is killed by at least one row on
at least one system. The bar at the head is exactly one red per cell and it is THE REAL
ROW, on both systems, with identical cell sha256. Eleven notes follow, worded so the S9
brief can carry them; none of them is a fix I am owed.

## 1. THE BAR AT THE HEAD, RE-MEASURED BY ME ON BOTH SYSTEMS

PC: worktree `%TEMP%\earned-astra-72` at `e7b7b228`, `git status --porcelain` empty
before and after every run, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`,
the mandated node, OUTSIDE any sandbox. linux: farm scratch worktree
`/home/claude/farm/scratch/wt/s9cL2b` at `e7b7b228`, same environment,
`node --test --test-reporter=tap`. `bin/farm-verify.sh` printed PASS on the sync.

| Cell | System | tests | pass | fail | skip | the only `not ok` |
|---|---|---:|---:|---:|---:|---|
| pack-pin | PC | 68 | 67 | 1 | 0 | 67 REAL ROW |
| pack-pin | linux | 68 | 65 | 1 | 2 | 67 REAL ROW |
| approved-pin | PC | 47 | 46 | 1 | 0 | 46 REAL ROW |
| approved-pin | linux | 47 | 45 | 1 | 1 | 46 REAL ROW |

The linux skips are the three Windows list-directory ACL rows, which declare their own
skip reason. Exactly one red per cell and it is the real row, on both systems.

Cell sha256, measured by `certutil -hashfile` on the PC and `sha256sum` on linux:

```text
pack-pin.test.mjs      fb8605fcf360dde8ecca02152d8b53731719471cc7f44ec9c869c9250394356a  (IDENTICAL)
approved-pin.test.mjs  231e7332b66d2b0e103d6cdbc367f471255dfbb2f5cd16e7ccf1abbc8c1b618b  (IDENTICAL)
report                 9891b0c7b108243b12f984eaed3469224bfdbec8e198c5e23c036c5ceb45c381  (PC; matches the build's claim)
```

My own count over the three owned files: U+2013 zero, U+2014 zero, CR zero, on all three.

The refusal each real row prints, measured through the shipped engine at this head:

```text
PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
APPROVED-PIN UNLISTED rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
```

Both literals are unfilled and both real rows stay red. That is by construction.

## 2. RED FIRST, RE-PROVED BY ME FOR EVERY NEW ROW, ON BOTH SYSTEMS

I took the PREVIOUS round's two cells at `b4f13e62`, appended ONLY the new rows of this
round plus the two new helpers they need to parse (`s9PackRel`, `s9LongPath`), and
replaced the one row this round CHANGED (R2 Q2) with its new text. No engine byte of the
previous cells was touched. Identical assembly on both systems.

| System | cell | tests | pass | fail | skip | the reds |
|---|---|---:|---:|---:|---:|---|
| linux | pack | 68 | 61 | 5 | 2 | 39 R2 Q2, 62 REAL ROW, 64 P-PACK-5 bounds, 65 P-PACK-5 drives, 66 L2 N2 |
| PC | pack | 68 | 63 | 5 | 0 | 39 R2 Q2, 62 REAL ROW, 64 P-PACK-5 bounds, 65 P-PACK-5 drives, 66 L2 N2 |
| linux | appr | 47 | 45 | 1 | 1 | 44 REAL ROW only |
| PC | appr | 47 | 46 | 1 | 0 | 44 REAL ROW only |

SO, SAID PLAINLY AND WITHOUT DRESSING IT UP.

- GENUINELY RED FIRST: the two `L2 P-PACK-5` rows and the changed `R2 Q2` row. They fail
  against the previous engine for the reason they exist.
- RED FOR AN INTERFACE REASON, NOT ITS OWN: `L2 N2` is red above only because the
  previous `packPin` took two parameters. Its real counterexample is dropping `rootNames`
  at the `walk` call, which is my M6 below, killed on BOTH systems.
- NOT RED FIRST AT ALL, AND THE BUILDER SAYS SO IN HIS REPORT: `L2 N4` and `L2 N5` in
  BOTH cells pass the previous engine. They are coverage rows for clauses that were
  already correct. Their counterexamples are my P1/A1 and P2/A2 below, killed on BOTH
  systems. I checked that the builder declared this rather than claiming a base failure,
  and he did, in the words "N2 and N5 are coverage gaps: their new rows PASS the
  unchanged implementation". That is honest and I record it as such.

## 3. P-PACK-4: A DIRECTORY THAT CAN BE TRAVERSED BUT NOT LISTED, BUILT BY ME

I did not use the cells' own hooks for this. I built the condition with real permissions
on both systems, outside the cells, and drove the SHIPPED engines: a copy of each cell
with `import test from "node:test"` replaced by an inert stub and an export line appended,
so every row is dead and every engine byte is the one that ships. I proved the copy is
otherwise byte-identical by reversing the one substitution and diffing against the cell.

WINDOWS: `icacls <dir> /deny <account>:(RD)` on a folder I created under `%TEMP%`,
cleared with `/remove:d` in a `finally`. The account is the real test process account
from `whoami.exe`. LINUX: `chmod 0111` as root, then the run as uid 1000 via `setpriv`,
so the denial is a real EACCES and not a hook.

```text
PC   PACK ancestor :: {"list":"EPERM","childTraversable":true,
                       "refusals":["PACK-PIN UNREADABLE C:/.../s9cL2-perm-3mP6pj/pk-ancestor/parent"],"fileReads":0}
PC   PACK root     :: {"list":"EPERM","childTraversable":true,
                       "refusals":["PACK-PIN UNREADABLE C:/.../s9cL2-perm-3mP6pj/pk-root/parent/pack"],"fileReads":0}
PC   APPROVED      :: {"list":"EPERM","childTraversable":true,
                       "refusals":["APPROVED-PIN UNREADABLE locked/b.txt","APPROVED-PIN MISMATCH three/d.txt"]}

lin  PACK ancestor :: {"listErr":"EACCES","traversable":true,
                       "refusals":["PACK-PIN UNREADABLE /tmp/.../pk-ancestor/parent"],"fileReads":0}
lin  PACK root     :: {"listErr":"EACCES","traversable":true,
                       "refusals":["PACK-PIN UNREADABLE /tmp/.../pk-root/parent/pack"],"fileReads":0}
lin  APPROVED      :: uid 1000 listErr=EACCES child-traversable=true
                      ["APPROVED-PIN UNREADABLE locked/b.txt","APPROVED-PIN MISMATCH three/d.txt"]
```

Read the APPROVED lines carefully, because that is the half of the ruling that is about
the list going on. `design.APPROVED` names four files in order; the parent of the SECOND
is unlistable; the FOURTH has moved bytes. Both systems name the unlistable one with the
EXISTING word UNREADABLE and then STILL JUDGE the later entry, which comes back MISMATCH.
No eighth word appears in either vocabulary. For PACK-PIN an unlistable ancestor or pack
root is one refusal and the walk stops there, which is what the ruling says for that cell,
and no file is read at all (`fileReads: 0` on both systems, both locations).

## 4. P-PACK-5: THE FINDING L1 BLOCKED ON, MEASURED CLOSED

P-PACK-5 has three clauses. L1 measured all three failing. I measure all three holding.

(1) "NO CODE PATH COMPARES TWO ABSOLUTE PATHS ANY MORE." The judge's body is now this,
and it names neither `REPO_ROOT` nor `os.tmpdir()`:

```js
function judge(root, packRootRel, literalLines, readFile) {
  const parts = packRootRel.split("/");
  const packRoot = path.join(root, ...parts);
  let dir = root;
```

I did not take that from reading. I replaced `path.relative` with a recording wrapper for
a whole run and counted every call site. Inside `judge` the ONLY calls are through
`label()` on the five REFUSAL lines (pack-pin.test.mjs :216, :218, :221, :225, :228). The
rest are the `label` row itself and the harness `s9NoDescents`. The round-5 selector is
gone from the tree; `grep` finds no second occurrence of the old expression.

(2) "THE REAL ROW AND EVERY FIXTURE RUN THE SAME ARM." There is no arm left: the root is a
parameter, not a branch. I instrumented the single `judge` entry and counted a whole run:

```text
PC     {"judgeCalls":79,"real":1,"distinctRoots":5,
        "roots":["C:\\...\\Temp","C:\\...\\Temp\\s9-astra-pAv7yA","Q:\\s9-root","R:\\s9-root","REPO_ROOT"]}
linux  74 os.tmpdir(), 1 /tmp/s9-astra-..., 1 /s9-root-a, 1 /s9-root-b, 1 REPO_ROOT  (78 calls, 5 roots)
```

The builder's report claims `{"supplied":79,"real":1,"distinctRoots":5}`. I reproduce 79
exactly ON WINDOWS. On linux it is 78, because the two Windows ACL rows skip (minus two)
and the POSIX file-link row takes its link arm and makes one extra call (plus one). His
number is right and is a Windows number; note N11 asks the brief to say so.

(3) "REPLACING THE TRUSTED ROOT BY ANOTHER DIRECTORY TURNS ROWS RED." M3 below: 60 reds on
linux, 61 on the PC, first red the GREEN CONTROL. And the sharpest check I could make,
which is not in the builder's table: I put the ROUND 5 SELECTOR BACK, verbatim, into the
new signature (M9). Both new P-PACK-5 rows kill it, on both systems. The defect
DECISIONS:608 ruled against cannot return to this cell unnoticed.

## 5. ONE SINGLE-CLAUSE CHANGE FOR EVERY CLAUSE THE ROUND ADDS OR MOVES

Each mutant is one clause, run as an independent copy of the whole cell, ALL rows, on
BOTH systems. "Killed" means at least one row other than the REAL ROW went red. The
builder ran 114 mutants on the PC and wrote "Linux at these final bytes: NOT RUN ... The
checker owns that half"; the table below is the round's own clauses on both systems, not
a re-run of his 114.

| ID | The single clause | linux | PC (win32) | first red |
|---|---|---|---|---|
| M1 | ancestor walk starts at `os.tmpdir()`, not the supplied root | killed 2 | killed 2 | L2 P-PACK-5 bounds |
| M2 | `packRoot` joined onto `os.tmpdir()`, not the supplied root | killed 2 | killed 2 | L2 P-PACK-5 bounds |
| M3 | the supplied root replaced by `REPO_ROOT` throughout | killed 60 | killed 61 | GREEN CONTROL |
| M4 | the pinned relative spelling split on `path.sep` | SURVIVED | killed 10 | ancestor junction rows |
| M5 | `s9PackRel` returns the absolute path | killed 58 | killed 59 | GREEN CONTROL |
| M6 | the guarded root listing NOT passed into `walk` | killed 3 | killed 3 | L2 P-PACK-5 bounds, L2 N2 |
| M7 | the ancestor listing guard removed (bare readdir) | killed 1 | killed 2 | R6 P-PACK-4 ancestor injected |
| M8 | the exact-spelling clause removed | SURVIVED | killed 1 | exact spelling row |
| M9 | the ROUND 5 boundary selector re-introduced verbatim | killed 2 | killed 2 | both L2 P-PACK-5 rows |
| P1 / A1 | `s9LongPath` boundary loosened from `<=` to `<` | killed 1 | killed 1 | L2 N4 |
| P2 / A2 | `s9DenyListing` restores only on success (`finally` dropped) | killed 1 | killed 1 | L2 N5 |

THE TWO LINUX SURVIVORS ARE NOT SURVIVORS OF THIS ROUND'S WORK. M4 is an equivalent
mutant on a POSIX separator (`path.sep` IS `"/"`), and M8 is the exact-spelling clause,
which DECISIONS:608 and L1 N3 already record as held by Windows rows only, because a
case-only rename is already MISSING on a case-sensitive system. Both are killed on the
PC. No clause the round adds or moves is unheld on both systems, so I owe no row here.

The R2 Q2 arity and real-call pin is the twelfth change; it is proved by section 2, where
the new row is red against the previous two-parameter interface on both systems.

## 6. DOES ANY HONEST TREE NOW REFUSE

No. This round changes where the walk STARTS, which is exactly the thing an unusual
checkout could break, so I re-measured rather than inherit L1's answer.

| Honest tree | System | Result |
|---|---|---|
| the cell run through a SYMLINK above the checkout root | linux | 68/65/1/2 and 47/45/1/1, unchanged |
| the same with `--preserve-symlinks`, so `REPO_ROOT` keeps the link spelling | linux | 68/65/1/2, unchanged |
| a git WORKTREE (both my runs are in worktrees, neither is a clone) | both | unchanged |
| a MIXED-CASE spelling of the checkout path, `C:\users\JOEYM\...\EARNED-astra-72` | PC | 68/67/1/0 and 47/46/1/0, unchanged |
| a 455-character absolute fixture path | both | the cell's own row, green, skipped by neither ordinary run |
| NFC and NFD names, and a supplementary-plane pair | both | the cell's own rows, green |

The mixed-case result is worth one sentence for the brief and it is an IMPROVEMENT this
round makes by accident: the trusted root is never inspected as a component, so the case
of every directory ABOVE the pack root is now irrelevant to the exact-spelling clause.
Under the round-5 shape the boundary was derived from the path's own spelling.

## 7. THE BUILDER'S REPORT AGAINST THE CODE

I read the whole `Loop round 2` section and checked every number in it that I could
execute. He disputes nothing and claims no measurement against any L1 finding.

REPRODUCED EXACTLY: the head bar on both cells on the PC (68/67/1/0 and 47/46/1/0); both
cell sha256 and the report's own sha256; the arm measurement 79 / 1 / 5 on Windows; the
four surviving mutants being PN6a, PN6b, AN6a, AN6b (the equivalent ACL mutants L1 N6
already declared owing no row) plus P11 and P12 (the two output sorts, R3's dispute
upheld at DECISIONS:608); the `L2 N4` arithmetic at 205, 206, 207 giving the
one-character filename, null and null; the red-first fences for N2, N5 and Q2.

CHECKED AND HONEST: he does not claim `L2 N4` or `L2 N5` were red first, and says in
plain words they are coverage rows that pass the unchanged implementation. A builder who
wanted to look better would have claimed the helper's absence as a base failure. He notes
the absence is not the only thing those rows can detect, and my P1/A1 and P2/A2 confirm it.

CORRECTED BY MEASUREMENT, and this is the one place his own words are wider than the
code. His note to the reviewer says `s9PackRel` "assumes every fixture pack sits directly
below `os.tmpdir()`". It assumes only the PREFIX. Instrumented over a whole run:

```text
{"calls":74,"notBelowTmpdir":[],"depthsBelowTmpdir":{"1":62,"2":2,"3":10}}
```

Twelve of the seventy four call sites are two or three levels below `os.tmpdir()` and all
of them work. Zero call sites are outside it. The helper is sound and his flag is
narrower than he wrote it; nothing needs changing.

N7 AND THE EARLIER SECTION OF THE REPORT. Carrying out L1 N7 edited an earlier part of
the report: the two previously empty round-6 red-first fences are now filled with TAP.
That is the only change outside the round 2 section of that file, the builder declares it,
and the numbers he pasted (63/57/6 and 45/41/4) are the ones L1 measured for itself in
its own section 2. The evidence gap L1 named is repaired and nothing else moved there.

## 8. NOTES, WORDED SO THE S9 BRIEF CAN CARRY THEM

N1. THE ONE PLACE P-PACK-4'S LITERAL WORDS ARE STILL UNMET, carried forward from L1 N1
and now EXECUTED so the brief can state it as a fact rather than a worry. The interior
directory listing inside `walk()` is still a bare `fs.readdirSync`. A directory INSIDE
the pack that can be traversed but not listed makes the cell throw:

```text
locked interior dir listable? EACCES
THREW EACCES EACCES: permission denied, scandir '/tmp/s9cL2-int-Fqui/pack/sub'
```

I do NOT make this blocking, for the same four reasons L1 gave: it is the cell's own
declared residual (b) in its header, it predates this round, CHECK-R5 examined and
accepted it, and DECISIONS:608 says in terms that the declared residual is NOT widened.
It is a loud red and can never be a false green. It is a named debt for the S9 brief.

N2. THE ONE REMAINING PLACE TWO ABSOLUTE PATHS ARE DIFFERENCED is `label()`, and it is
diagnostic only: the judge calls it to NAME a root in a refusal, never to choose one.
It is cross-drive correct because it tests `path.isAbsolute`, which the removed selector
did not. Measured on the PC: `label("Q:\\s9-root\\pack")` returns `"Q:/s9-root/pack"`
and `label(REPO_ROOT + "/rebuild/m1")` returns `"rebuild/m1"`. Every fixture row that
names a root expects the absolute spelling, so both drive worlds agree.

N3. THE HOOK LEAK THE BUILDER FLAGGED FOR ME IS MEASURED CLOSED. The new row
"L2 P-PACK-5: synthetic different-drive roots" replaces `path.relative`,
`fs.lstatSync`, `fs.readdirSync` and `fs.readFileSync` for its own length. I captured
all four at module load and asserted their identity in an extra row appended AFTER every
existing row: `ok 69 - PROBE: no hook of the loop round 2 rows leaked past them`, and
`path.relative` still computes. The failure path is covered too, by accident and well:
in M1, M2 and M9 that row FAILS, and the three rows after it (L2 N2, L2 N4, L2 N5) stay
green in every one of those six runs. No Q: or R: volume is touched; the spellings are
driven entirely through the stubs.

N4. THE DIAGNOSTIC QUALITY OF THAT ROW, and it owes no code change. Its stubs assert
INSIDE `fs.lstatSync`, which `judge` wraps in `try { } catch { st = null; }`, so an
unexpected lstat is swallowed and reported as PACK-ROOT-ABSENT rather than with the
stub's own message; an unexpected readdir reaches `label()`, whose `path.relative` that
row has trapped, so the row dies with "absolute-path differencing is not a trust
decision" rather than naming the offending path. The row is RED either way, which is all
a row must do, and I measured it red in all three mutants that reach it. Worth one
sentence in the brief so a future reader is not confused by the message.

N5. THE COST OF THE NEW SHAPE IS NOT NEW, and I checked rather than assumed, because
every fixture call now lists `os.tmpdir()`. Counting listings of `os.tmpdir()` over a
whole run: 72 at this head, 71 at the previous head. One more. What IS worth a sentence
is the machine, not the cell: `%TEMP%` on the owner's PC holds 25,780 entries and a
single listing of it costs 7.06 ms, so a pack-pin run spends roughly half a second there
out of 1.8 s. On a hosted runner `%TEMP%` is near empty. This grows with the machine, not
with the pack, and it is not a reason to change anything.

N6. `PACK_ROOT_ABS` is now consumed by exactly ONE row, the `label` pin at
pack-pin.test.mjs :688. It is no longer the real row's argument; the real row passes
`REPO_ROOT, PACK_ROOT_REL`. The constant still earns its place, but a reader skimming for
"what the pin is aimed at" will find `PACK_ROOT_REL` now and should.

N7. THE REAL ROW OF PACK-PIN NOW LISTS THE REPOSITORY ROOT, `REPO_ROOT/rebuild` and
`REPO_ROOT/rebuild/m1` (three `readdir`, three `lstat`, the cost DECISIONS:608 already
recorded). `readdir` returns names and descends nothing, so no path on the never-read
list is opened, and the walk never leaves the pinned components. This was also true at
round 5, where the selector picked `REPO_ROOT` for the real pack; I say it here only so
the brief does not have to rediscover it.

N8. `L2 N2` and `L2 N5` in both cells, and `L2 N4` in both cells, are COVERAGE rows and
not red-first rows. Section 2 gives the measurement and the builder declares it. Their
counterexamples are executed and killed on both systems. A brief that lists "every new
row was red first" would be wrong about four of the seven; a brief that lists "every new
row has an executed counterexample" is right about all seven.

N9. The three call sites that pass a root other than `os.tmpdir()` or `REPO_ROOT` are the
two new P-PACK-5 rows. Every other fixture call site (54 of them) passes `os.tmpdir()`
and a spelling from `s9PackRel`. I checked all 58 `packPin(` occurrences: one
`packPin(REPO_ROOT`, 54 `packPin(os.tmpdir`, three `packPin(root`. None of them is a
leftover two-argument call.

N10. The two linux survivors M4 and M8 are the Windows-only clauses of DECISIONS:608 and
L1 N3. They are equivalent mutants on a POSIX, case-sensitive system and owe no row
there. Killed on the PC, 10 reds and 1 red.

N11. The arm count 79 is a WINDOWS number. linux is 78, for the two reasons in section 4.
A brief that quotes 79 should say on which system.

N12. CI is unchanged by this round: no workflow file is in the diff. The cells' one CI
step has still never executed on this branch (DECISIONS:608), so the PC and the farm
remain the both-system evidence until the S9 head.

N13. Both real rows stay red and both literal blocks stay unfilled and byte-identical.
That is by construction and nobody fixes it.

## 9. WHAT I DID NOT VERIFY, SAID SO IT IS NOT ASSUMED

- I did not re-run the builder's 114-mutant PC table on linux. My table is the round's own
  clauses. His four Windows-only survivors I accepted on L1 N6's reasoning, not on a
  fresh measurement of my own.
- I did not run either cell on a machine whose checkout and `%TEMP%` are on different
  DRIVES. No such machine is available to me. P-PACK-5 clause (3) is proved by the
  synthetic drive row, by M3 and by M9, all of which are stubbed or mutated rather than
  physical. The physical case remains a hosted-runner question for the S9 head.
- I did not seal, package, or run anything that writes a receipt or an artifact, and I
  wrote no file in this repository other than this one.
- I did not read DECISIONS or STATUS for anything beyond lines 599, 608 and 613, and I
  wrote neither.

## 10. HOUSEKEEPING OF A DEAD PREDECESSOR'S WORK

Before I measured anything I found the two untracked files the previous check hand left
in the PC worktree, `rebuild/lanes/c/ui-port/s9cL2-appr-eng.mjs` and `s9cL2-pack-eng.mjs`.
I READ BOTH FIRST: they are extracts of the two engines at this head, made to be driven
from outside. I did not use them, because an extract can drift from the cell; I built my
own harnesses from the cells verbatim instead, and proved the reversal is byte-identical.
I then MOVED both out of the worktree to `%TEMP%\s9cL2-leftover` and deleted nothing.
`git status --porcelain` was empty from that moment on, and is empty now apart from this
review file.
