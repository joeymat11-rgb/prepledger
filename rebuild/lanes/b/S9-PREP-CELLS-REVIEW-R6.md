# S9-PREP-CELLS narrow re-check R6

Reviewer: cowork (Earned lane hand), Claude, independent narrow re-check of an ASTRA BUILD
plus the integrator's own correction on top of it. Commissioned by PM4 under the owner's
rule that an Astra build is always checked by a Claude hand told to disagree, and narrowed
by the PM's order at DECISIONS:580.
Round reviewed: micro round 6.
Head reviewed: `8019abf623c4c2414222f6874c6118dc6273fb1a` (`rebuild/b-s9-prep-cells`).
Baseline: `68ed616d` (the R5 review commit). Astra's build: `2f37a36e`. The PM's
comment-only correction: `8019abf6`.
Cell sha256, measured by me on BOTH machines and equal, and equal to the value the PM
states: `673a02f9334af5e6a4469a4085ead55bcc465b1a62650a49da3896207986b199`
(`sha256sum` in the farm, `certutil -hashfile` on the PC).

**VERDICT: ACCEPT WITH NOTES.** Everything the PM ordered at :580 is in the shipped bytes
and I measured all of it on both operating systems. Row (6d) landed with its executable
half BYTE-IDENTICAL to review R5's section 4 (same sha over the 1415 bytes from `test(` to
`});`), the only difference being the PM's reworded comment, and that reworded comment is
TRUE at the final bytes: I measured the throw it now describes. The try, the catch and
`FENCE-INVENTORY-HEAD-UNREADABLE` are gone and NOTHING ELSE in `fence()` moved - proven,
not read by eye, by stripping every comment from the cell and diffing what is left. The
removal is fail-closed for every caller that exists, and I measured that too rather than
arguing it. All 43 earlier registrations are byte-identical. The spec gained its two
sentences and lost no word but a full stop's worth of punctuation.

My notes are five stale or imprecise sentences on paper, and two non-equivalent survivors
of my own inside the tamper expression - in the BYTE-COMPARISON limb, which this round did
not touch and which therefore is NOT a reason to reject round 6. I say where I disagree
with the PM below, and on P-FENCE-2 itself I do not: the removal is right, and I can give
it a tighter argument than the one in the comment.

## 0. THE ONE TABLE

| what the PM ordered at DECISIONS:580 | what the bytes do |
|---|---|
| (1) row (6d) lands VERBATIM after (6c) | **DONE.** Executable half byte-identical to R5 section 4, sha `70194402b5dd145b`; the only delta is the PM's own comment rewording |
| row (6d) green as written, no repair | **TRUE on both systems.** It is green at the head and it kills X5, Y3, Y5 and Y6 |
| (2) P-FENCE-2: try, catch and the refusal name REMOVED | **DONE, and NOTHING ELSE in `fence()` moved.** One hunk; comment-stripped cells differ by exactly that clause and the new row |
| (3) one line on N2 in the report | **DONE**, report 16.1 |
| (4) spec D.2's two rows gain sentences, no word deleted | **DONE.** Word-level count: one token lost (`collide`), re-added as `collide.` |
| the bar, both systems | **44 / 43 / 1 on both**, the one red THE REAL ROW and nothing else, same nine refusals |
| cell sha256 equal on both machines | **EQUAL**, and equal to the PM's value |
| X5, Y3, Y5, Y6 red | **RED on both systems**, each by row (6d) |
| Y2 | **NOT killed on Linux.** Killed on Windows only, by (24) and (25): R5's N2 blindness persists |
| X7, X8, X9 | **each turns only its own row red**, (26), (27), (28), on both systems |
| my own R6-Z1 (a deletion is not a touch) | killed four times over: (6c), (19), (24), (25) |
| **my own R6-Z2 (bytes compared by LENGTH)** | **SURVIVES every row on both systems.** Witness: a same-length forgery of the sealed inventory PASSES with no refusal. NOT this round's clause |
| **my own R6-Z3 (an EMPTY worktree copy is not a tamper)** | **SURVIVES every row on both systems.** Witness: the inventory truncated to zero bytes and committed PASSES. NOT this round's clause |
| P-FENCE-2, told to disagree: fail-closed for every caller | **YES, measured.** 65 call sites, none in a `try`; the CI step has no `continue-on-error`, no `shell:` and no swallowed exit code |
| report section 16's table | **reproduces**, row for row, on Windows and on Linux |
| report 16.3's cell sha256 and 16.5's diffstat | **STALE at the head** (N1): they are the numbers at `2f37a36e`, and the PM's own commit moved them |

## 1. SCOPE: THREE PATHS, AND THE PM'S COMMIT IS COMMENT-ONLY BY CONSTRUCTION

`git diff --name-status 68ed616d..8019abf6` is exactly three paths, as the round was
dispatched and no more:

```text
M	rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
M	rebuild/lanes/b/S9-RELEASE-SPEC.md
M	rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
```

`git diff --name-status 2f37a36e..8019abf6` is the cell alone.

**I did not take "comment only" on trust and I did not read it by eye.** I cut the cell
out of all three commits, ran a JavaScript comment stripper over each (a state machine
that respects string, template and regular-expression literals, so a `//` inside a string
is not mistaken for a comment), normalised whitespace and hashed the result:

```text
stripped code, 2f37a36e   6e4a480cab9774e681ceb14b34db21ba9950e492998cf927cde120856a3e6750
stripped code, 8019abf6   6e4a480cab9774e681ceb14b34db21ba9950e492998cf927cde120856a3e6750   IDENTICAL
stripped code, 68ed616d   5a630e27abf2aac7944c1a641c793289a20a9edf2d384ef873016be6bbe1c885
```

So the integrator's commit changes no executable byte of the cell: not one token, in or
out of `fence()`. And the stripped diff from the baseline to the head is the WHOLE of
this round's executable change, which is worth printing because it is so short:

```text
-  let tampered = false;
-  try {
-    tampered = touched.some((t) => t.path === artifactPath)
+  const tampered = touched.some((t) => t.path === artifactPath)
       && (!gitText(root, ["ls-tree", "--name-only", "-z", "HEAD", "--", artifactPath])
         .split("\0").includes(artifactPath) || worktree === null || !worktree.equals(chainBytes));
-  } catch { return no("FENCE-INVENTORY-HEAD-UNREADABLE " + artifactPath + " at HEAD", here); }
+  (and one new registration, R5 (6d), 24 lines)
```

Nothing else. No helper, no fixture builder, no other clause of `fence()`.

**The registrations, by offset and hash, as R5 did it.** I cut every `test("...")`
registration out of the baseline blob and the head blob at its own byte offsets, from the
`test(` line to its closing `});`, and hashed each one.

```text
baseline registrations 43   head registrations 44
byte-identical: 43 of 43      changed: (none)      removed: (none)
new: R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER
     1414 bytes, sha256 a17d7eedb4ac...
```

No row was weakened, skipped or deleted; there is no `skip`, `todo` or `only` anywhere in
the cell; the helpers, `unverified()` and the fixture builders are untouched.

## 2. ROW (6d): THE EXECUTABLE HALF IS BYTE-IDENTICAL, AND THE REWORDED COMMENT IS TRUE

**The comparison.** I cut R5's section 4 fenced `js` block out of the review file and the
row out of the cell at `8019abf6`, then split each at the end of its leading comment:

```text
R5 section 4 block       2298 bytes
cell row at 8019abf6     2429 bytes
code after the comment   1415 bytes in BOTH, sha256 EQUAL:
    70194402b5dd145b11a552038286ca1558cc9ef98b5088fe566afa1e9f53cde8
the leading comment      DIFFERS: three lines replaced by four
```

So the registration line, the fixture sequence and every one of the eight assertions are
byte-identical to the text review R5 wrote out: the `chain()`, the `chainline` branch, the
re-seal, the `update-ref`, the cherry-pick of `git show HEAD:<inventory>`, the
`--name-status` pre-assertion, the control `pass` with empty refusals and `touched === 1`,
the `drop()`, and the `fail` with exactly `FENCE-INVENTORY-DIFFERS-FROM-CHAIN <inventory>`
and `touched === 1`. The one permitted difference is the PM's comment and nothing else.
The builder repaired nothing, which is what the PM's ruling (1) required.

**The reworded sentences, and whether they are true at the final bytes.** The PM replaced

```text
   limb and the byte comparison dereferences null, the new catch turns that into
   FENCE-INVENTORY-HEAD-UNREADABLE, and the fence names a Git failure for a world in which
   Git answered perfectly well. THE CONTROL HALF ...
```

with

```text
   limb and the byte comparison dereferences null and THROWS, so this row goes red. (When
   review R5 wrote this row a catch turned that throw into FENCE-INVENTORY-HEAD-UNREADABLE,
   naming a Git failure for a world in which Git answered perfectly well; the PM removed
   that catch in the same round, see the comment at the check.) THE CONTROL HALF ...
```

**It is true, and I measured the sentence rather than reasoning about it.** X5 (the
`worktree === null ||` limb removed, one exact substitution against pristine head bytes)
turns row (6d) red on both systems, and the failure is the throw the comment now names:

```text
Linux and Windows, identical:
  not ok 4 - R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion ...
  failureType: 'testCodeFailure'
  name:  'TypeError'
  error: "Cannot read properties of null (reading 'equals')"
  stack: fence (.../sealed-inventory-fence.test.mjs:248:56)
```

Line 248 is the byte comparison itself. There is no catch above it, so the TypeError leaves
`fence()`, reaches the row, and the row is red. Every clause of the new parenthetical is
also true: R5 was written at `1972b970`, where the catch did exist and did convert that
throw into `FENCE-INVENTORY-HEAD-UNREADABLE` (R5 section 2 prints the refusal it measured);
the catch was removed in this same round at `2f37a36e`; and the comment at the check does
carry the removal's reasoning, so "see the comment at the check" resolves.

**One imprecision, inherited verbatim and therefore not the PM's to fix here (N3).** The
row's comment ends "(the sentence the check's own comment ends on)". At the head neither
comment at the check ends on that sentence: the long block ends on "R1 BLOCKING-2's
guarantee lives in the read, not in this comparison. Row (19)." and the ASTRA R4 block ends
on "N4's null touched count on that refusal path disappears with the path." The sentence
meant - "a byte-equal copy of the chain's bytes is a touch and not a tamper" - is the one
the FILE HEADER's third paragraph ends on (cell:37-39) and appears again mid-block at
cell:226. The words are R5's own and the PM ordered the row verbatim, so the builder was
right not to touch them. One word ("the sentence the check's own comment turns on") fixes
it whenever that comment is next edited. Nothing executable depends on it.

## 3. THE REMOVAL: EXACTLY THAT, AND NOTHING ELSE IN `fence()` MOVED

The tamper clause at the head is one `const` expression and it is the shape the ticket
describes: an exact-path touch AND (case-exact HEAD absence by `git ls-tree --name-only -z`
membership OR the worktree copy absent OR the bytes differing).

I diffed the whole body of `fence()` at `68ed616d` and at the head, byte for byte. It is
ONE hunk: the five-line `let`/`try`/`catch` block becomes a three-line `const`, and the
comment above it grows by nine lines. The expression inside the parentheses - the
`ls-tree` argument vector, the `.split("\0").includes(artifactPath)` membership, the
`worktree === null` limb and `!worktree.equals(chainBytes)` - is character-for-character
what round 5 shipped; only its indentation moved by two columns, which is what leaving a
`try` block does. Nothing before it (the `rev-parse`, the inventory selection, the JSON
guards, the `merge-base`, the `--name-status` walk, `worktree = fsBytes(...)`) and nothing
after it (the refusal array, the reseal-child claim, the sealed-path loop, the return)
changed by one token. The comment-stripped comparison in section 1 is the proof that holds
for the whole file and not only for the function.

**Where the dead refusal name still appears, and whether that is a problem.** I grepped
`rebuild/` and `.github/` at the head for `FENCE-INVENTORY-HEAD-UNREADABLE`. It is in no
workflow and in no spec, and `fence()` can no longer produce it. It survives in four
places and three of them are correct: the cell's own row (6d) comment (cell:520), which
names it explicitly as history in brackets; review R5 (six lines), which is a dated
document of what was true at `1972b970`; and author report 16.1, which says in so many
words that the refusal is no longer returned. The fourth is note N2b below: author report
section 15 still asserts it in the PRESENT tense (`:1760`, `:1775`, `:1838`).

## 4. THE BAR OF RECORD, AT THE PUSHED HEAD, ON BOTH OPERATING SYSTEMS

**Windows.** `%TEMP%\earned-s9b`, `git fetch origin rebuild/b-s9-prep-cells` then
`git merge --ff-only FETCH_HEAD` to `8019abf6`; `git status --porcelain` empty before and
after (0 bytes); node `v24.19.0` from
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`;
every run from a `.cmd` with `set "MEASURED_TEST_NOW=2026-09-03"` and
`set "TZ=America/New_York"` on their own lines, output to a log under `%TEMP%`, a `.done`
written last, started detached and polled.
**Linux.** A farm scratch worktree of the same pushed head
(`/home/claude/farm/scratch/wt/s9br6`, `farm-scratch.sh` at `8019abf6`).

| what | Windows | Linux |
|---|---|---|
| the fence cell at the head | **44 / 43 / 1**, exit 1 | **44 / 43 / 1**, exit 1, 4.07 s |
| cancelled / skipped | 0 / 0 | 0 / 0 |
| the one red | **THE REAL ROW**, and nothing else | **THE REAL ROW**, and nothing else |
| row (6d) | **GREEN** | **GREEN** |
| cell sha256 | `673a02f9...86b199` (`certutil -hashfile`) | `673a02f9...86b199` (`sha256sum`) |

The two hashes are equal to each other and to the value the PM measured and recorded at
DECISIONS:583. Nothing was green once and red once on either machine, so nothing in this
re-check is reported as timing and no re-run was needed.

**THE REAL ROW's refusal, at this head, both systems.** Nine `FENCE-SEALED-PATH-TOUCHED M`
refusals and no `FENCE-RESEAL-CHILD-UNVERIFIED`, against
`rebuild/m4/spec/acceptance-s8-real-shape.json`:

```text
.github/workflows/rebuild.yml
rebuild/m3/w6/local/import-bundle.mjs
rebuild/m3/w7-preview/import/import-screen.mjs
rebuild/m3/w7-preview/import/test/page-bundle.test.mjs
rebuild/m3/w7-preview/measure/test/boundary.test.mjs
rebuild/m3/w7-preview/today/test/adapter.test.mjs
rebuild/m3/w7-preview/today/test/package.test.cjs
rebuild/m3/w7-preview/today/test/view.test.mjs
rebuild/m3/w7-preview/today/today-app.cjs
```

The same nine as R5, as report 14.7 and as Astra R4. The Linux run judged by chain commit
`41dbe127a06091aea2eb68fc0c004426538e59c4`; report 16.3 names `4f89fb9b...` and R5 named
`e8617458...`. That is the remote-tracking ref moving while several lanes work (the chain
took DECISIONS:582 to :586 during this re-check), not a disagreement, and the row prints
the commit it judged by precisely so this is checkable (R1 N10). The nine refused paths
are identical at all three commits.

**Why I did not re-run the rest of the bar.** This round moves three files: the cell, and
two documents no suite reads. No other suite can have changed colour, and the PM's order
narrows this check to the changed lines. R5's whole-bar table (the today step 685 / 683 / 2
with its two pre-existing reds, `package.test.cjs` 14 / 14, step (b) 20 / 20, step (c)
22 / 22, lane C 9 / 9, `--ci --package S8` refusing with `SEALED-PROFILE-RECOMPUTATION`)
stands unre-measured by me and I claim nothing about it.

## 5. THE CHANGED LINES: EIGHT SUBSTITUTIONS, EACH ALONE, ON BOTH SYSTEMS

**Method, and it is R5's.** I edited no tracked file. On each machine I built one scratch
directory PER MUTANT that keeps the cell's own relative path
(`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs`) and a copy of
`.github/workflows/rebuild.yml` so row (18) resolves against a real workflow rather than
going red for the wrong reason - which is why the mutant keeps the cell's FILE NAME too:
row (18) computes its own repository-relative path and looks that exact string up in the
`run:` lines, so a `zz-mut-<ID>.test.mjs` would fail row (18) in every column and hide a
real result. Each mutant is ONE exact string substitution against the pristine head bytes,
applied by a script that refuses unless its anchor occurs exactly once; the byte deltas
came out identical on the two machines, which is the cheapest proof that the two runs
mutated the same characters:

```text
X5 -21   Y2 +2   Y3 -1   Y5 0   Y6 -6   X7 +31   X8 +28   X9 +85   Z1 +20   Z2 +9   Z3 +25
```

**Baselines.** Windows scratch CTRL 44 / 43 / 1 and Linux scratch CTRL 44 / 43 / 1, in both
cases with THE REAL ROW as the only red, refusing
`FENCE-CHAIN-REF-ABSENT refs/remotes/origin/rebuild/t2-client-core` because a scratch root
is not a clone. So "newly red" below is the whole delta, and row (18) is GREEN in every
column.

| id | the substitution, inside the one `const` expression | Windows | Linux | newly red |
|---|---|---|---|---|
| X5 | remove the `worktree === null \|\|` limb | 44 / 42 / 2 | 44 / 42 / 2 | **(6d)** both |
| Y2 | query `chainRef` instead of `"HEAD"` | 44 / 41 / 3 | 44 / 43 / 1 | **(24), (25) on Windows; NONE on Linux** |
| Y3 | drop the leading `!` from `!gitText(...)` | 44 / 40 / 4 | 44 / 42 / 2 | (6d), (24), (25) on Windows; **(6d) on Linux** |
| Y5 | `.split("\0")` becomes `.split("\n")` | 44 / 42 / 2 | 44 / 42 / 2 | **(6d)** both |
| Y6 | drop `-z` from the `ls-tree` args, keep `.split("\0")` | 44 / 42 / 2 | 44 / 42 / 2 | **(6d)** both |
| X7 | `t.path === artifactPath` gains `&& t.renamedFrom === undefined` | 44 / 42 / 2 | 44 / 42 / 2 | **(26) only**, both |
| X8 | `t.path === artifactPath` becomes case-folded equality | 44 / 42 / 2 | 44 / 42 / 2 | **(27) only**, both |
| X9 | `!worktree.equals(chainBytes)` becomes parsed-JSON inequality | 44 / 42 / 2 | 44 / 42 / 2 | **(28) only**, both |

```text
RED, by name, copied out of the runs:
  X5 / Y5 / Y6        not ok 4  - R5 (6d) ... an UNCOMMITTED worktree deletion of it is a TAMPER
  Y3 (Windows)        not ok 4  - R5 (6d), plus not ok 39 - Astra R4 (24), not ok 40 - Astra R4 (25)
  Y3 (Linux)          not ok 4  - R5 (6d)        (rows (24) and (25) GREEN)
  Y2 (Windows)        not ok 39 - Astra R4 (24), not ok 40 - Astra R4 (25)
  Y2 (Linux)          (nothing newly red)
  X7                  not ok 41 - Astra R4 (26) - renaming different bytes INTO the inventory FAILS by name
  X8                  not ok 42 - Astra R4 (27) - editing only an upper-case sibling of the inventory PASSES
  X9                  not ok 43 - Astra R4 (28) - a whitespace-only inventory edit FAILS by name
  every run           not ok 44 - THE REAL ROW
```

**The question the PM asked in those words: are Y2 and Y3, killed on Windows only at R5,
now killed on Linux too?**

- **Y3: YES.** Row (6d) kills it on Linux, on its own. Y3 inverts the HEAD-presence limb,
  so the limb is true exactly when HEAD DOES carry the path; in (6d)'s control world HEAD
  carries it and the bytes are equal, so the fence accuses a branch that cherry-picked the
  chain's own inventory bytes. That is the false red R5 BLOCKING-1 named, and (6d) is now
  the row that holds it on both systems. On Windows Y3 is killed three times over.
- **Y2: NO, AND IT IS STILL WINDOWS-ONLY.** Row (6d) cannot kill it and I can say exactly
  why: Y2 asks the CHAIN REF whether it carries the inventory path, and in both halves of
  (6d) it does, so the limb is false and (6d)'s two verdicts are unchanged. Y2's only
  killers remain (24) and (25), the case-only rename, where HEAD has lost the canonical
  spelling but the chain ref still has it - and on Linux those two rows are green against
  the defect because `fsBytes` cannot resolve the old spelling on a case-sensitive disk.
  So **R5's N2 survives round 6 and now has a second instance**: the ubuntu leg of
  `rebuild-public` would not notice Y2 at all. It is held, because the matrix runs
  `windows-latest` with `fail-fast: false` and the windows leg does notice. I record it
  rather than rule it, and I do not think it justifies a Linux-only row: the asymmetry is
  the operating system's, not the cell's, and rows (24) and (25) exist precisely to catch
  it where it can be caught.

**This reproduces report section 16.2 row for row.** Astra's table gives X5, Y5, Y6 on (6d)
alone; Y3 on (6d), (24), (25); X7 on (26); X8 on (27); X9 on (28); every count 44 / 42 / 2
but Y3's 44 / 40 / 4. Every one of those numbers came out of my own Windows runs unchanged,
and I add the Linux column and Y2, which the report does not run.

## 6. THREE SUBSTITUTIONS OF MY OWN THAT R5 DID NOT TRY

R5 swept eight (Y1 to Y7, Y9) and Astra three (X5, X7 to X9), and all eleven sit in the
HEAD-PRESENCE limb or in the touch guard. Mine are chosen to go where nobody went: one at
the touch guard from the other side, and two at the BYTE COMPARISON, which is the limb the
whole refusal name is about and which no sweep of this round has probed since Astra's X9.

| id | the substitution | Windows | Linux | newly red |
|---|---|---|---|---|
| R6-Z1 | `t.path === artifactPath` gains `&& t.status !== "D"` (a deletion is not a touch) | 44 / 39 / 5 | 44 / 39 / 5 | (6c), (19), (24), (25) |
| **R6-Z2** | `!worktree.equals(chainBytes)` becomes `worktree.length !== chainBytes.length` | **44 / 43 / 1** | **44 / 43 / 1** | **NONE** |
| **R6-Z3** | `!worktree.equals(chainBytes)` becomes `(worktree.length > 0 && !worktree.equals(chainBytes))` | **44 / 43 / 1** | **44 / 43 / 1** | **NONE** |

**Z1 is killed four times over and is reported only for completeness.** It is the honest
control that the rows around this clause do bite: (6c) is the committed deletion, (19) is
F9's branch-cut-before world and its deletion half, and (24) and (25) are the case-only
rename, whose `D` record is what the HEAD-presence limb reads.

**Z2 and Z3 leave every row green on BOTH systems, and NEITHER IS EQUIVALENT.** I built a
world for each, with the cell's own fixture helpers, in a copy of the cell with two extra
probe rows appended, run against the shipped code and against the mutant on both machines.
The answers are identical on Windows and Linux:

```text
world W1: the branch rewrites the sealed inventory FLIPPING ONE HEX DIGIT of a hash,
          so the file is byte-different and EXACTLY THE SAME LENGTH, and commits it
   shipped   fail  ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s8-fixture.json"]  touched=1
   Z2        pass  []                                                                                 touched=1
   Z3        fail  ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN ..."]                                          touched=1

world W2: the branch TRUNCATES the sealed inventory to zero bytes and commits it
   shipped   fail  ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s8-fixture.json"]  touched=1
   Z2        fail  ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN ..."]                                          touched=1
   Z3        pass  []                                                                                  touched=1
```

Both worlds are forgeries of the sealed inventory that the shipped fence refuses by name
and the mutant admits with NO refusal at all, and `pass` here is not merely a lost
diagnostic: `tampered` is also the gate on the reseal-child claim
(`if (!tampered && added.length > 0)`), which R2 N4 and row (17) exist to close. Under Z2 a
reseal child that rewrote its parent's sealed artifact with a SAME-LENGTH edit would be
entered into the claim instead of fenced as an ordinary branch. Row (28), the nearest row,
cannot catch either: a whitespace-only edit changes the length, and an empty file is not
what it builds.

**And now the part where I disagree with myself before the PM has to.** These are NOT a
reason to reject round 6, and I am not raising them as blocking:

- The byte comparison is not a changed line. Round 6 removed a try and a catch; round 5
  added the HEAD-presence limb. `!worktree.equals(chainBytes)` has stood since round 1 and
  was in the 50-clause sweep R3 reports. The PM's standard for a blocking finding, applied
  at DECISIONS:573 and again at R5 BLOCKING-1, is **a changed clause with no detecting row
  and an executable witness**. Mine have the witness and lack the change.
- The PM's order for this check is explicit that it is not a new survivor hunt over the
  whole cell. Rejecting a round for a six-round-old clause would make the narrowing
  meaningless, and the next round would be dispatched for something round 6 did not do.

**What I recommend instead.** One row at the S9 integration, in the S9 brief rather than in
this lane's next micro round: a same-length forgery of the inventory must FAIL by name, and
a zero-byte inventory must FAIL by name. Two `assert`s inside one row, on a fixture that is
one `slice` of an existing one. It closes Z2 and Z3 together and it measures the sentence
the refusal name has always claimed - that the comparison is over BYTES.

## 7. TOLD TO DISAGREE: IS P-FENCE-2 FAIL-CLOSED FOR EVERY CALLER

**The answer is YES for every caller that exists, and I measured it rather than argued it.
I would not put the named refusal back.**

**7.1 Every call site.** `fence()` is called 65 times in the cell and NOWHERE ELSE: it is a
function local to a `.test.mjs` file with no `export`, nothing imports the cell, and the
only `run:` line in any workflow that names it is `rebuild.yml:259`. I listed every call
site and checked each one against the `try` occurrences in the file. There are nine `try`
blocks in the cell; every one of them is INSIDE `fence()` or inside a helper
(`ancestorOf`, `fsBytes`, the `after()` cleanup hook, the two rows that raise a real
`ENOENT` from `execFileSync` directly). **Not one call to `fence()` is inside a `try`**, and
two call sites that appear inside an assertion's message argument (`cell:990`,
`cell:1169-1170`) evaluate that argument eagerly, so a throw there is still a throw. There
is no `test.skip`, no `todo`, no `only` and no `assert.throws` anywhere in the file. A
throw out of `fence()` therefore reaches a `test()` body, and `node --test` turns that into
a FAILING test, never a skipped one.

**7.2 The CI step, read out of `rebuild.yml` on this branch.**

```yaml
      - name: C - the sealed-inventory fence over this branch's own diff
        if: ${{ !cancelled() }}
        run: node --test rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
```

I grepped the whole workflow: there is **no `continue-on-error` anywhere in the file**, **no
`shell:` key anywhere in the file** (so every `run:` uses the runner default and the step's
status is the command's exit status), and **no `|| true`, no `exit 0` and no `set +e` in any
`run:` line** - the only two hits for those strings are inside comments about measured
counts. The single `if:` in the file is this step's, `!cancelled()`, which row (18) pins by
reading the file back; `fail-fast: false` at `:21` is the matrix strategy and only means the
other operating system's leg still runs, it does not make a red step green. `node --test`
exits non-zero when any test fails. So a throw out of `fence()` ends as a FAILED STEP and a
FAILED JOB on both legs. It cannot end as a pass, and the only way it ends as a SKIP is if
the run was cancelled, which is the behaviour `!cancelled()` was chosen for.

**7.3 I built the world anyway, because "no reachable world" is a claim and claims get
measured.** I injected a failure into the `ls-tree` query itself at the point where it
runs - everything before it (the `rev-parse`, the `merge-base`, the `--name-status` diff)
succeeding exactly as it does today - and ran the whole cell twice: once at the shipped
head (no catch) and once with R5's catch put back verbatim around the same injected
failure.

```text
injected query failure, Linux, whole cell
  no catch (shipped)   exit 1   44 / 30 / 14
  R5's catch restored  exit 1   44 / 30 / 14
  THE SAME 14 ROWS RED IN BOTH, row for row:
    (6), (6b), (6c), (6d), (17), (19), (21), (22), (23), (24), (25), (26), (28), THE REAL ROW
```

Every row that reaches the guard goes red in BOTH designs. **The catch never bought a
verdict; it only changed the sentence.** And the sentence it changed is not obviously an
improvement: with the catch, row (6) fails with
`no artifact-tamper refusal: FENCE-INVENTORY-HEAD-UNREADABLE <path> at HEAD`; without it,
the same row fails with

```text
  error: |-
    Command failed: git -c core.quotepath=false ls-tree --name-only -z <ref> -- rebuild/m4/spec/acceptance-s8-fixture.json
    fatal: Not a valid object name <ref>
```

That is Git's own message, with the exact command line, carried out of `execFileSync` in
the Error's message because the cell pipes stderr. The PM's sentence "the calling row goes
red with Git's own message" is therefore literally true and I measured it.

**7.4 Could the query fail on its own? I could not build it either, and I can give the
PM a tighter argument than the one in the comment.** The comment says rev-parse,
merge-base and the diff have already succeeded so the objects are there. True, but the
real load-bearing fact is the SHORT CIRCUIT: `touched.some((t) => t.path === artifactPath)`
must be true before the query runs at all, which means THE DIFF ALREADY REPORTED A CHANGE
AT THAT EXACT PATH, which means `git diff` already descended HEAD's tree to that path's own
entry. `ls-tree --name-only` needs precisely those trees and no blobs. So the query cannot
fail for a missing or unfetched object even on a `--filter=blob:none` partial clone, where
a blob-reading command could. I also checked the pathspec cannot be hostile: `artifactPath`
is produced by an anchored regular expression over `ls-tree` output at the chain ref, so it
cannot begin with `-`, cannot carry a pathspec magic prefix, and cannot be a git-quoted
name (a quoted name begins with `"` and fails that regular expression); `--` guards it in
any case.

What is left is environmental: a spawn that fails for `EAGAIN`, `EMFILE` or `ENOMEM`, the
working directory disappearing under the process, a concurrent repack, a killed child. Six
lanes share this PC right now, so those are not imaginary. **But they were never the
argument for the catch**, because in every one of them the old code returned a "fail"
verdict and the new code throws into a red row: both fail closed, as 7.3 measures.

**7.5 Where I would put one sentence, and it is not a row.** The fail-closed property has
moved. It used to live INSIDE `fence()`, in a clause you could read; it now lives in a
property of the CALLERS - that none of them catches - and nothing in the cell measures
that property. Today that is fine and I have checked all 65. The day the fence logic is
lifted out of this cell into the runner or into a pack-pin step (which DECISIONS:570
already contemplates for the S9 integration), a wrapper of the form
`try { fence(...) } catch { /* no opinion */ }` would fail OPEN and not one row would go
red. That is a real hazard of the removal and it deserves one sentence beside the clause -
"a caller that swallows this throw fails open; no caller does, and none may" - or the same
sentence in D.2. **I am not asking for a row**: a row would have to mutate a caller, and
every caller is a test row, which is circular. I am asking for the sentence, because that
is what this file does with a rule no row can hold (R1 BLOCKING-C, said the other way
round). **I do not want the named refusal back**: R5's Y9 showed a catch is a thing that
can be rewritten to fail open with every row still green, and that is worse than a throw.

## 8. THE PAPER: SPEC D.2, AND REPORT SECTION 16

**8.1 D.2's two rows gained sentences and lost no word. Counted, not eyeballed.** The file
is 1952 lines before and 1952 after; exactly two lines differ, `:1207` (the
`the artifact-tamper check` row) and `:1213` (the `red first` row). I tokenised the whole
spec on whitespace at both commits and took the multiset difference:

```text
whitespace tokens   before 35342   after 35404
TOKENS LOST:    {'collide': 1}
TOKENS GAINED:  {'collide.': 1, 'As': 1, 'built': 1, '(review': 1, 'R5),': 1, ... 'Review-derived': 1,
                 'rows': 2, '(24)': 1, 'to': 2, '(28)': 1, 'and': 3, '(6d)': 1, 'extend': 1, ... '(23)': 1, 'did.': 1}
```

**One token "lost", `collide`, and it is back on the next line as `collide.`.** That is the
full stop the appended sentence needs; no word of the design of record was deleted. Both
additions are pure ASCII; the ten non-ASCII bytes in the file are pre-existing middots at
`:410` and `:415` and were not touched.

The two appended sentences read:

```text
:1207  ... so the two rules do not collide. As built (review R5), for a branch that touched
       the inventory the cell also asks Git, case-exact, whether HEAD still carries the exact
       inventory path and treats its absence as a tamper, and a branch which touches the
       inventory with the chain's own bytes passes.
:1213  ... Review-derived rows (24) to (28) and (6d) extend this red-first list, as rows (17)
       to (23) did.
```

Both are true of the as-built cell. One imprecision, note N5: "a branch which touches the
inventory with the chain's own bytes passes" passes THE TAMPER CHECK; it can still fail the
sealed-path loop for some other path, and the row it sits in is about the tamper check, so
the context carries it. Three words ("passes this check") would remove the doubt.

**8.2 Report section 16's table reproduces, and four sentences of the report are stale at
the head.** The table itself is in section 5 above: every count and every named red row in
16.2 came out of my own Windows runs unchanged, and the Linux column is new. 16.3's claim
that 43 of 43 existing rows are byte-identical reproduces exactly (section 1). 16.3's claim
that removing the new row and the guard block leaves identical cell bytes reproduces, and
my comment-stripped hashes are a stronger form of it. 16.1's account of the removal matches
the shipped clause.

What does NOT reproduce, all of it caused by the PM's own comment-only commit landing after
the report was written, none of it the builder's error:

- **N1.** 16.3 prints `certutil` output naming cell sha256
  `43bcda2071...762077e6`. That is the cell at `2f37a36e`. At the head the cell is
  `673a02f9...86b199`, which is what both machines measure. DECISIONS:583 records both
  hashes, so the ledger is complete and a reader who has the ledger cannot be misled; a
  reader who has only the report at the head can be.
- **N1b.** 16.5's `git diff --stat` says the cell moved 55 lines and the three files 221
  insertions. At the head it is 56 and 222.
- **N2.** 16.1 says of the (6d) comment: "It was not reworded." At the head it HAS been
  reworded, by the PM. The sentence was true when the builder wrote it and DECISIONS:583
  says so explicitly, so this is a stale sentence rather than a false claim by its author.
- **N2b.** Report section 15 still describes `FENCE-INVENTORY-HEAD-UNREADABLE` in the
  PRESENT tense at `:1760`, `:1775` and `:1838` ("the fence returns ... it does not throw a
  raw error"). 16.1 corrects this in words and the builder was right not to rewrite history
  in an earlier section; one appended clause in 15, of the shape correction 14.4 took, is
  the cheap fix.

None of these four is a defect in the shipped code and none changes a verdict. The right
remedy is one correction line each, appended, by whoever next touches that report, and the
first two are the integrator's to make because the integrator's commit created them.

## 9. NOTES

**N1 / N1b / N2 / N2b** are in section 8.2: four stale sentences and numbers in the author
report, three of them created by the integrator's own commit, none of them a code defect.

**N3 - row (6d)'s parenthetical "(the sentence the check's own comment ends on)" is not
literally true**, section 2. Inherited verbatim from R5 under a verbatim order, so the
builder was right to leave it. The sentence it means is the one the file HEADER's third
paragraph ends on (`cell:37-39`) and which appears again at `cell:226`.

**N4 - one line of the new comment is 119 characters** (`cell:522`) where the rest of the
file runs to about 90 and nothing else in the changed lines exceeds 91. Cosmetic; it is the
line the PM's rewording lengthened by closing a parenthesis before the old sentence resumed.

**N5 - the spec's new sentence says a byte-equal touch "passes"** where it means passes
THIS CHECK, section 8.1. Three words.

**N6 - R5's N2 survives, with a second instance (Y2)**, section 5. The ubuntu leg of
`rebuild-public` would notice neither Y2 nor a revert of the round 5 clause; only the
windows leg would. Both legs run, so the line is held. Recorded so no one reads a green
ubuntu leg as evidence about this clause.

**N7 - the fail-closed property now lives in the callers, and nothing measures it**,
section 7.5. One sentence beside the clause or in D.2, not a row.

**N8 - `R6-Z2` and `R6-Z3`, two non-equivalent survivors in the byte-comparison limb with
executable witnesses on both systems**, section 6. NOT this round's clause, NOT blocking,
recommended as one row at the S9 integration.

## 10. WHAT I DID NOT VERIFY, AND HOW I WORKED

- I edited no tracked file but this review. `%TEMP%\earned-s9b` was fetched and
  fast-forwarded to `8019abf6` and is otherwise untouched, `git status --porcelain` empty.
  Every mutation ran in `%TEMP%\s9br6rev\mutroot\<ID>` on the PC or in
  `/home/claude/farm/scratch/s9br6/mutroot/<ID>` in the farm, never in a lane worktree and
  never in the shared repository. Fixture repositories are the cell's own `mkdtemp` ones.
- I read the branch, the chain, the spec, the two reviews and the workflow in the farm
  (`/home/claude/farm/wt/rebuild__b-s9-prep-cells`, synced) and ran the bar and every
  Windows measurement on the PC. The farm's chain ref moved during the re-check
  (DECISIONS:582 to :586 landed); the nine refused paths did not.
- **Not verified here**, and I claim nothing about any of it: hosted CI on either leg; the
  rest of the bar (the today step, `package.test.cjs`, steps (b) and (c), the lane C step,
  `--ci --package S8`) - unchanged files, R5's numbers stand unre-measured by me; the real
  S9 reseal skip; the full historical mutation sweep; the conformance gate; `H18`,
  `boundary.test.mjs` and the three `rebuild.yml` steps of the original ticket, which are
  byte-unchanged since round 4 and were not re-reviewed.
- I ran no seal generator, no `--full`, no receipt or artifact writer, and nothing on
  `rebuild/b-seal-gen`. I read nothing under `rebuild/conform/private`, no `ledger/`, no
  `src/history.js`, no `EarnedPort`, no `port-real.log` and nothing of the protected soak.
  No credential was printed. I deleted nothing I did not create. I installed nothing and
  touched no `node_modules`.
- My scratch, retained for the PM and mine alone: `%TEMP%\s9br6rev` on the PC (`gen.mjs`,
  `sum.mjs`, `probe.mjs`, `probe-rows.txt`, `mutroot\`) with `%TEMP%\f2l-s9r6.cmd`,
  `%TEMP%\f2l-s9r6b.cmd` and the `f2l-*.tap` / `f2l-*.log` / `f2l-*.done` files beside them;
  `/home/claude/farm/scratch/s9br6/` and the scratch worktree
  `/home/claude/farm/scratch/wt/s9br6` in the farm. None of it is committed.

## 11. THE VERDICT, STATED ONCE MORE

**ACCEPT WITH NOTES.** Micro round 6 did exactly the two things DECISIONS:580 ordered and
nothing else. Row (6d) is in the file with its executable half byte-identical to the text
review R5 wrote out - proven by hashing the 1415 bytes from `test(` to `});` on both sides,
not by reading - it is green as written on both operating systems, and it is the row that
kills X5, Y3, Y5 and Y6. The try, the catch and `FENCE-INVENTORY-HEAD-UNREADABLE` are gone,
the tamper clause is one `const` expression again, and NOTHING ELSE in `fence()` or in the
cell moved: the comment-stripped cell at Astra's commit and at the integrator's commit hash
identically, and all 43 earlier registrations are byte-for-byte what they were. The bar is
44 / 43 / 1 on Windows and on Linux with THE REAL ROW the only red and the same nine
refusals, and the cell's sha256 is the PM's value on both machines.

On P-FENCE-2 I was told to disagree and I do not. The removal is fail-closed at all 65 call
sites and at the CI step, and I measured it: with the catch restored and the query made to
fail, the SAME 14 rows go red as without it, so the catch never bought a verdict - only a
sentence, and a worse one than Git's own. I would not put it back. What I would add is one
sentence, because the fail-closed property has moved from a clause into a property of the
callers that no row can hold, and that is precisely the case this file has always answered
in prose.

My eight notes are five stale or imprecise sentences on paper - four of them made stale by
the integrator's own commit - and three findings of my own: Y2 is still caught on Windows
alone, and two non-equivalent substitutions in the BYTE-COMPARISON limb survive every row
on both systems with executable witnesses (a same-length forgery of the sealed inventory
and a zero-byte one both PASS). That limb is not what this round changed, so by the PM's
own standard for a blocking finding it does not reject round 6; it belongs in the S9 brief
as one row.

This review is itself a hypothesis, and the next hand should disagree with it where the
evidence lets them.

Reviewer: cowork (Earned lane hand), independent narrow re-check R6, ticket S9-PREP-B.
