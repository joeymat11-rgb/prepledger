# S9-PREP-CELLS narrow re-check R5

Reviewer: cowork (Earned lane hand), Claude, independent narrow re-check of an ASTRA BUILD.
Commissioned by PM4 under the owner's rule that an Astra build is always reviewed by a Claude
hand told to disagree (DECISIONS:574). Round reviewed: micro round 5.
Head reviewed: `1972b970012a64b695770ebe70d300d4158f0193` (`rebuild/b-s9-prep-cells`).
Baseline: `01b88efeb92435d818f672d3ed43521719a5961e` (round 4, the head Astra R4 rejected).
Cell sha256, measured on BOTH machines and equal:
`7d832522f53256ae49eea7c9cf31fa0425e66634f02b3bd081cf5a676a8aeec2`
(`certutil -hashfile` on the PC, `sha256sum` in the farm).

**VERDICT: REJECT, on one finding, and it is a hole this round's own new clause opened.**
Both of Astra R4's findings are FIXED, on both operating systems, and I could not build a
world in which the SHIPPED code answers wrongly. What I could build is two non-equivalent
substitutions INSIDE the changed lines that leave all 43 rows green on Windows AND on Linux
while the fence refuses a branch that touched the inventory path with the chain's own bytes.
That is the direction D.2 forbids and the direction the check's own comment closes in
writing, and it is unmeasured. One row closes it together with the author's own declared
survivor X5, and that row is written out below, ready to paste.

## 0. THE ONE TABLE

| what | verdict |
|---|---|
| Astra R4 finding 1, the case-only inventory rename | **FIXED**, measured on Windows and Linux |
| Astra R4 finding 2, X7 (ignore rename destinations) | **FIXED**, row (26), both systems |
| Astra R4 finding 2, X8 (case-fold path equality) | **FIXED**, row (27), both systems |
| Astra R4 finding 2, X9 (semantic JSON equality) | **FIXED**, row (28), both systems |
| the author's own declared survivor X5 | **LOST DIAGNOSTIC, not equivalent.** Row written out in section 4 |
| **R5 BLOCKING-1: the new limb has no row in the PASS direction** | **OPEN.** Y3, Y5 and Y6, measured |
| R5 N1: the new catch and its new refusal name have no row | OPEN, note only: I could build no reachable world for it |
| R5 N2: rows (24) and (25) are green on Linux even against the defect | OPEN, note only |
| R5 N3: spec D.2's text for the tamper check now lags the cell | OPEN, note only, the PM routes it |
| report correction 14.4 (survivor claim bounded to the sample) | **FIXED** |
| report correction 14.5 (36 remaining entries, not 37) | **FIXED**, the arithmetic reproduces |
| report correction 14.6 (four rows, eight fixture repositories) | **FIXED**, counted in the file |
| report correction 14.10 (1) (the case-only rename rewrite) | **FIXED**, and its Windows claim reproduces |
| the bar of record at the pushed head | every number equals round 4's except the cell's own rows |

## 1. SCOPE: THE DIFF, AND THE ROWS THAT MUST NOT HAVE MOVED

`git diff --name-status 01b88efe..1972b970` is exactly two files, as the round was dispatched:

```text
M	rebuild/lanes/b/S9-PREP-CELLS-AUTHOR-REPORT.md
M	rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs
```

The cell's diff is three hunks: five comment lines at the null-limb paragraph, the tamper
guard itself, and the five new registrations. Nothing else in the file moved.

I did not take the ten named rows on trust and I did not compare them by eye. I cut every
`test("...", ...)` registration out of both blobs at its own byte offsets, from the `test(`
line to its closing `});`, and hashed each one. **All 38 of round 4's registrations are
byte-identical at the new head, not only the ten I was told to check**, and five are new:

```text
IDENTICAL (6)    740b   a64455c500c0     IDENTICAL (19)   1714b  3a0493210b1b
IDENTICAL (6b)   515b   1fae3142ab16     IDENTICAL (20)   1534b  180226f093e3
IDENTICAL (6c)  1093b   2a6da623f18e     IDENTICAL (21)   1757b  d2a8e658acbd
IDENTICAL (8g)  1029b   da7e453b372b     IDENTICAL (22)   1591b  ea3d90b5cecb
IDENTICAL (17)  1175b   732568634217     IDENTICAL (23)   2982b  379aded4d154
common registrations byte-identical: 38 of 38; common registrations CHANGED: (none)
new: Astra R4 (24), (25), (26), (27), (28)
```

No row was weakened, skipped or deleted, and `unverified()` and the helpers are untouched.

## 2. ASTRA R4 FINDING 1: FIXED, AND MEASURED ON BOTH OPERATING SYSTEMS

**Method.** I did not edit the lane worktree. On the PC I built a scratch layout at
`%TEMP%\s9brevE` that keeps the cell's own relative path
(`rebuild/lanes/c/ui-port/`) and a copy of `.github/workflows/rebuild.yml` so row (18)
resolves, wrote each substitution into a `zz-mut-<ID>.test.mjs` there, and ran it with the
specified Node binary under `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`. In the
farm I did the same inside a scratch worktree of the pushed head. Baselines: PC scratch
43 / 42 / 1 (its REAL row has no chain ref, so it is red with `FENCE-CHAIN-REF-ABSENT`);
farm scratch 43 / 42 / 1 (its REAL row is red by construction, nine sealed-path refusals).
Every mutant below is ONE exact string substitution against the pristine head bytes.

**SHIPPED, the round 4 clause put back verbatim**
(`const tampered = touched.some((t) => t.path === artifactPath) && (worktree === null || !worktree.equals(chainBytes));`):

```text
Windows   == SHIPPED exit=1   43 tests / 40 pass / 3 fail
             RED: Astra R4 (24) - an ordinary case-only inventory rename FAILS naming the exact path
             RED: Astra R4 (25) - a verified child with a case-only inventory rename FAILS naming both touches
             RED: THE REAL ROW
Linux     == SHIPPED exit=1   43 tests / 42 pass / 1 fail
             RED: THE REAL ROW   (rows (24) and (25) GREEN)
```

That is exactly the asymmetry Astra inferred and could not execute, and it is now measured:
the round 4 clause is red on Windows and green on Linux, the new clause is green on both.
**FINDING 1: FIXED.**

**The Git query itself, measured by me and not read out of the report.** Throwaway
repositories under `%TEMP%`, the two-hop case-only rename, `git version 2.55.0.windows.3`:

```text
core.ignorecase=true
  before  ls-tree --name-only -z HEAD -- <lower>   "rebuild/m4/spec/acceptance-s8-fixture.json\u0000"
  after   ls-tree --name-only -z HEAD -- <lower>   ""
  after   ls-tree --name-only -z HEAD -- <UPPER>   "rebuild/m4/spec/ACCEPTANCE-S8-FIXTURE.JSON\u0000"
  after   fs.readFileSync(<lower>)                 "{\"version\":1}\n"      (the disk alias still resolves)
  after   git diff --name-status                   R100  <lower>  <UPPER>
core.ignorecase=false
  after   ls-tree --name-only -z HEAD -- <lower>   ""
  after   ls-tree --name-only -z HEAD -- <UPPER>   "rebuild/m4/spec/ACCEPTANCE-S8-FIXTURE.JSON\u0000"
  after   fs.readFileSync(<lower>)                 "{\"version\":1}\n"      (STILL resolves)
```

Two things follow, and the second is worth the PM's eye. The query IS case-exact with
`core.ignorecase` true AND false, so the clause's own claim holds. And `core.ignorecase` is
NOT the variable that creates the defect: NTFS resolves the old spelling either way, so a
developer or a runner with `core.ignorecase=false` was equally exposed before this fix.
The author's 15.1 says the same for the query; I add the `fsBytes` half, which it does not.

**`FENCE-INVENTORY-HEAD-UNREADABLE` is a named refusal and never a raw throw.** I could not
make the `ls-tree` query itself fail in any world I built (see N1), so I measured the
guarantee through the only reachable path into that catch, X5's null dereference: the fence
returns `status: "fail"` with exactly
`["FENCE-INVENTORY-HEAD-UNREADABLE rebuild/m4/spec/acceptance-s8-fixture.json at HEAD"]`
and no stack, on Windows and on Linux. The catch does convert a throw into a named refusal.
It also converts a null dereference into one, which is section 4.

## 3. ASTRA R4 FINDING 2: FIXED, EACH MUTANT TURNS ONLY ITS OWN ROW RED

Same method, each substitution alone against pristine bytes. Baseline in both columns is
43 / 42 / 1 with only THE REAL ROW red, so "newly red" below is the whole delta.

| mutant | substitution | Windows | Linux | newly red |
|---|---|---|---|---|
| X7 | `t.path === artifactPath` becomes `t.path === artifactPath && t.renamedFrom === undefined` | 43 / 41 / 2 | 43 / 41 / 2 | **(26) only** |
| X8 | `t.path === artifactPath` becomes `t.path.toLowerCase() === artifactPath.toLowerCase()` | 43 / 41 / 2 | 43 / 41 / 2 | **(27) only** |
| X9 | `!worktree.equals(chainBytes)` becomes parsed-JSON inequality | 43 / 41 / 2 | 43 / 41 / 2 | **(28) only** |

```text
RED: Astra R4 (26) - renaming different bytes INTO the inventory FAILS by name
RED: Astra R4 (27) - editing only an upper-case sibling of the inventory PASSES
RED: Astra R4 (28) - a whitespace-only inventory edit FAILS by name
```

No protected row changed colour under any of the three, on either system.
**FINDING 2: FIXED for X7, FIXED for X8, FIXED for X9.**

I also read (26), (27) and (28) against Astra's own witnesses rather than only running them.
(26) is X7's world with the chain seal on a separate line and an `R100` into the inventory
path; (27) is the exact-path control beside (23), and its `assert.equal(r.artifactPath, next)`
is what stops the row passing for the wrong reason; (28) asserts `JSON.parse` equality and
`Buffer.equals` inequality on the fixture itself before it asks the fence anything, so the
row cannot go green because the fixture stopped being a whitespace-only edit. Each of the
three reproduces its finding rather than restating it.

## 4. X5, THE AUTHOR'S OWN DECLARED SURVIVOR: A LOST DIAGNOSTIC, NOT AN EQUIVALENT CHANGE

X5 removes the `worktree === null ||` limb. It survives the cell on both systems
(43 / 42 / 1, nothing newly red), and the author says so plainly and does not hide it.

The author's claim is that exact HEAD absence "now catches the committed-deletion worlds
that previously killed it". That half reproduces: row (6c), which used to be X5's killer,
is now held by the HEAD-presence limb. What is left is the UNCOMMITTED world, and I built
it. The branch touches the inventory path with the CHAIN'S OWN BYTES (a cherry-picked
byte-equal copy - the check's own comment calls that "a touch that is not a tamper"), HEAD
carries the exact path, and the file is then deleted from the disk without being committed:

```text
final code, Windows and Linux, identical:
  before the delete   pass, refusals [], touched 1
  after  the delete   fail, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN rebuild/m4/spec/acceptance-s8-fixture.json"], touched 1
X5, Windows and Linux, identical:
  before the delete   pass, refusals [], touched 1
  after  the delete   fail, ["FENCE-INVENTORY-HEAD-UNREADABLE rebuild/m4/spec/acceptance-s8-fixture.json at HEAD"], touched null
```

**Decision: X5 is a LOST DIAGNOSTIC.** The verdict survives (both fail), so nothing is
admitted; what is lost is the sentence in the CI log and the `touched` count, and the log
blames Git for a world in which Git answered perfectly well. By this file's own standard -
R1 BLOCKING-C's paragraph is there precisely because that limb was load-bearing and silent -
a limb whose removal changes the refusal a human reads is a limb that needs a row.

**ONE ROW CLOSES IT, and it closes three of my own survivors with it.** Measured, and it
builds and behaves the same on both operating systems:

```text
Linux    head 44 / 43 / 1 (6d) GREEN | X5 RED | Y3 RED | Y5 RED | Y6 RED
                      GREEN against the round 4 clause, Y1, Y2, Y4, Y7 and Y9
Windows  head 44 / 43 / 1 (6d) GREEN | X5 44 / 42 / 2 RED | Y5 RED | Y6 RED
```

I did not edit the cell. Paste it after row (6c):

```js
/* R5 X5, AND IT IS THE ONLY WORLD THE null LIMB STILL HAS. Exact HEAD absence now covers
   every COMMITTED deletion of the inventory (row (6c)), so what is left to the null limb
   is the UNCOMMITTED one: HEAD carries the path, the branch's own diff touches it with
   the chain's exact bytes, and the file is gone from the disk the fence reads. Remove the
   limb and the byte comparison dereferences null, the new catch turns that into
   FENCE-INVENTORY-HEAD-UNREADABLE, and the fence names a Git failure for a world in which
   Git answered perfectly well. THE CONTROL HALF IS THE OTHER HALF OF THE ROW: a branch
   that touches the inventory path with the CHAIN'S OWN BYTES is a touch and not a tamper
   (the sentence the check's own comment ends on), and until this row nothing measured the
   new HEAD-presence limb in the direction that lets an innocent branch through. */
test("R5 (6d) - a byte-equal touch PASSES, and an UNCOMMITTED worktree deletion of it is a TAMPER", () => {
  const root = chain({ product: [APP, CSS] });
  git(root, ["checkout", "-q", "-b", "chainline"]);
  put(root, FIX_ART, inventory({ product: [APP, CSS], released: [CSS] }));
  commit(root, "the chain re-seals its inventory");
  git(root, ["update-ref", CHAIN_REF, "HEAD"]);
  const sealed = git(root, ["show", "HEAD:" + FIX_ART]).toString("utf8");
  git(root, ["checkout", "-q", "main"]);
  put(root, FIX_ART, sealed);
  commit(root, "the branch cherry-picks the chain's exact bytes");
  const base = gitText(root, ["merge-base", CHAIN_REF, "HEAD"]).trim();
  assert.deepEqual(gitLines(root, ["diff", "--name-status", base, "HEAD"]), ["M\t" + FIX_ART],
    "the fixture did not touch the inventory with byte-equal bytes");
  const control = fence(root, CHAIN_REF);
  assert.equal(control.status, "pass",
    "a byte-equal copy of the chain's own bytes was accused of tampering: " + names(control));
  assert.deepEqual(control.refusals, [], names(control));
  assert.equal(control.touched, 1, names(control));
  drop(root, FIX_ART);
  const r = fence(root, CHAIN_REF);
  assert.equal(r.status, "fail", "the deleted worktree copy bought the branch a pass: " + names(r));
  assert.deepEqual(r.refusals, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN " + FIX_ART], names(r));
  assert.equal(r.touched, 1, names(r));
});
```

## 5. R5 BLOCKING-1: THE NEW LIMB HAS NO ROW IN THE DIRECTION THAT LETS AN INNOCENT BRANCH THROUGH

This is my own finding and it is the reason for the verdict.

The round 4 guard was `touched.some(...) && (worktree === null || bytes differ)`. Both limbs
are false for a branch that touched the inventory path with bytes equal to the chain's, so
that guard could not accuse such a branch. The new guard adds a third limb, and a third
limb is a third way to be WRONG. Nothing in the 43 rows measures it in that direction.

**Six substitutions of my own, all inside the changed lines, one at a time, pristine bytes.**

| id | substitution inside the changed lines | Windows | Linux | newly red |
|---|---|---|---|---|
| Y1 | drop `"--"` from the `ls-tree` pathspec | 43 / 42 / 1 | 43 / 42 / 1 | **NONE** |
| Y2 | query `chainRef` instead of `"HEAD"` | 43 / 40 / 3 | 43 / 42 / 1 | (24), (25) on Windows; **NONE on Linux** |
| Y3 | drop the leading `!` (the limb becomes "HEAD DOES carry it") | 43 / 40 / 3 | 43 / 42 / 1 | (24), (25) on Windows; **NONE on Linux** |
| Y4 | `.includes(artifactPath)` becomes `.some((p) => p.endsWith(artifactPath))` | 43 / 42 / 1 | 43 / 42 / 1 | **NONE** |
| Y5 | `.split("\0")` becomes `.split("\n")` | 43 / 42 / 1 | 43 / 42 / 1 | **NONE** |
| Y6 | drop `-z` from the `ls-tree` args, keep `.split("\0")` | 43 / 42 / 1 | 43 / 42 / 1 | **NONE** |
| Y7 | membership becomes "the query returned ANY entry" | 43 / 42 / 1 | 43 / 42 / 1 | **NONE** |
| Y9 | `catch { return no("FENCE-INVENTORY-HEAD-UNREADABLE ...") }` becomes `catch { tampered = false; }` | 43 / 42 / 1 | 43 / 42 / 1 | **NONE** |

Eight, not six. Y1, Y4 and Y7 I judge EQUIVALENT and I say so rather than counting them:
with an exact pathspec the query returns that path or nothing, so "any entry", "ends with"
and exact membership cannot differ, and `--` matters only for a path that reads as a ref,
which no inventory path can. Y2 and Y3 are killed on Windows. **Y5 and Y6 are killed
NOWHERE**, and they are not equivalent. Both make the membership test fail for output that
IS the path (`-z` output split on `"\n"`, and `-z`-less output split on `"\0"`), so the limb
is true whenever the branch touched the artifact at all, and the fence refuses:

```text
Y5 and Y6, Windows and Linux, identical, against worlds the SHIPPED code passes:
  a mode-only touch of the inventory (update-index --chmod=+x, committed)
      shipped: pass, refusals []             Y5 / Y6: fail, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN <inventory>"]
  a cherry-picked byte-equal copy of the chain's own inventory bytes
      shipped: pass, refusals []             Y5 / Y6: fail, ["FENCE-INVENTORY-DIFFERS-FROM-CHAIN <inventory>"]
  and every one of the 43 rows stays GREEN under both, on both systems
```

Y3 answers the same two worlds wrongly and is caught only by accident, on one operating
system, by rows (24) and (25).

**Why this is blocking and not a note.** It is the identical shape the PM upheld at
DECISIONS:573 against Astra's finding 2 - a changed clause with no detecting row and an
executable witness of non-equivalence - and it is the shape R3 BLOCKING-1 had before that.
It also contradicts the design of record by name: D.2's tamper row says the cell refuses
"when the artifact it reads at the chain ref and the artifact of the same path in the
worktree DIFFER", and Y5 and Y6 refuse when they are identical. And it contradicts the
cell's own closing sentence at the check, written in this file to keep F9 closed: "a
cherry-picked byte-equal copy is a touch that is not a tamper". A branch refused for
touching a sealed artifact it copied correctly is exactly the false red F9 exists to
prevent, and this round widened the clause without adding the row that holds the line.

**Smallest fix: the single row in section 4.** Its control half
(`assert.equal(control.status, "pass", ...)` over a byte-equal touch) is what kills Y3, Y5
and Y6; its second half kills X5. Measured: one row, four survivors closed, nothing else
changes colour. I did not apply it.

## 6. NOTES

**N1 - the new catch and its new refusal name have no row, and I found no world for them.**
Y9 deletes the `return no("FENCE-INVENTORY-HEAD-UNREADABLE ...")` outright and no row goes
red on either system. I tried to make the `ls-tree` query fail on its own and could not: by
the time the guard runs, `rev-parse --verify` on the chain ref and `merge-base ... HEAD`
have both already succeeded, so git is present and HEAD resolves. Either the catch is
unreachable in shipped code - which is the "defensive programming" this file's own R1
BLOCKING-C paragraph argues against in so many words - or it has a world nobody has named.
I report it rather than ruling it, because the only path I could reach it by is a mutation
(X5), and section 4's row already asserts the refusal that path must NOT produce. My
recommendation: one sentence in the file saying which of the two it is.

**N2 - rows (24) and (25) are Linux-blind, and the report should say so.** Against the
round 4 clause both rows are GREEN on ubuntu and RED on windows. They are real regression
rows, but the ubuntu leg of `rebuild-public` would not notice this fix being reverted;
only the windows leg would. 15.2 states the Linux expectation as an expectation; it is now
measured, and the consequence for CI is worth one line in the report.

**N3 - the spec's text for the tamper check now lags the cell, and it is not mine to edit.**
D.2's `the artifact-tamper check` row still describes a worktree-versus-chain byte
comparison. The cell now also asks Git whether HEAD carries the exact path, which is a
stricter rule and a good one, but the design of record does not contain it. The file to
change is `rebuild/lanes/b/S9-RELEASE-SPEC.md` (or an R5 correction beside R4), which I do
not own; the PM routes it. Same for D.2's red-first list, which does not name rows (24)
to (28): they come from reviews, as (17) to (23) did.

**N4 - `touched` goes null on the HEAD-UNREADABLE path.** `no(refusal, here)` does not
carry `touched`, so the refusal line prints a count the reader cannot use. Cosmetic today
because the path is only reachable under X5; worth a look if N1 finds it a world.

## 7. MY OWN SEARCH: THE WORLDS I TRIED TO MAKE THE NEW CLAUSE ANSWER WRONGLY

Six worlds, each built as a throwaway repository by the cell's own helpers, each run
against the SHIPPED head on Windows and on Linux. **The answers are identical on both
systems in every world, and I found no wrong answer in the shipped code.**

| world | diff the fence saw | answer | is it right |
|---|---|---|---|
| the inventory touched ONLY by a mode change (`update-index --chmod=+x`, committed) | `M <inventory>` | pass, touched 1 | yes: bytes equal, HEAD carries the exact path |
| the inventory renamed away, then renamed BACK in a later commit | mid `D`+`A`, end `[]` | mid fail by name, end pass touched 0 | yes: the fence reads the NET diff, not history |
| the branch MERGES the chain's newer inventory (`--no-ff`) | `A <template>` only | pass, touched 1, artifact s9 | yes: after the merge the merge-base IS the chain commit |
| a case difference in a DIRECTORY segment, file name identical | see below | see below | yes, both ways |
| the inventory DELETED, then re-added byte-equal in a LATER commit | mid `D`, end `[]` | mid fail by name, end pass touched 0 | yes, same reason as the rename-back |
| a byte-equal touch, then an UNCOMMITTED worktree deletion | `M <inventory>` | pass, then fail by name | yes, and it is X5's world (section 4) |

**The directory-segment case world, measured directly on the PC because the fixture
degenerates there.** On Linux the two directories are distinct, the branch's diff is a
`D` of the exact inventory path, HEAD does not carry it and the fence FAILS with
`FENCE-INVENTORY-DIFFERS-FROM-CHAIN <inventory>`: correct. On Windows `git mv` into
`rebuild/m4/SPEC/` cannot be expressed as a fixture the same way, because NTFS folds the
two directory names, so I measured the Git facts themselves:

```text
core.ignorecase=true    git diff --name-status   R100 rebuild/m4/spec/... rebuild/m4/SPEC/...
                        ls-tree -z HEAD -- <exact lower path>   ""        -> the fence FAILS by name. correct
core.ignorecase=false   git diff --name-status   A rebuild/m4/SPEC/...   (the old entry SURVIVES in HEAD)
                        ls-tree -z HEAD -- <exact lower path>   "<that path>\u0000"
                                                                -> the branch never touches the chain's
                                                                   inventory path, the fence PASSES. correct:
                                                                   HEAD still carries the sealed bytes intact
```

So the clause answers the directory-case world correctly in both Git configurations, and
the second line is the one worth recording: with `core.ignorecase=false` the "rename" is
not a rename at all, it is an add beside an untouched inventory.

**Clause mutations inside the changed lines.** Eight, in section 5's table. Survivors that
leave every row green on BOTH systems: Y1, Y4, Y5, Y6, Y7, Y9 (and X5 from Astra's table).
Of those, Y1, Y4 and Y7 I judge equivalent and say why; Y5, Y6 and X5 are the finding and
the note above; Y9 is N1.

**One thing I re-measured of the author's own equivalence claims.** 14.4 says M48
(`fsBytes` returns an empty Buffer instead of `null`) stays equivalent. At the new head it
does: 43 / 42 / 1 on Linux, and in X5's own world it gives the same refusal as the shipped
code. The claim survives the new clause.

## 8. THE REPORT'S IN-PLACE CORRECTIONS: DO THEY REPRODUCE

**14.4, the survivor claim bounded to the author's declared sample: FIXED.** The sentence
now reads "the ONLY survivors in this round 4 author's declared 52-mutation sample" and
points at section 15 for X7 to X9. That is the correction Astra asked for, and it is the
honest form of the claim. My section 5 shows the bound was still not wide enough - but that
is my finding against the code, not a failure of this correction.

**14.5, "the other 36 entries", not 37: FIXED, and the arithmetic reproduces.** I counted
the table: M20, M21, M22, M23, M24, M25, M29, M31, M43, M45, M46, M51, M52, M48, M49, M50
is 16 entries shown, and 52 minus 16 is 36. Astra's arithmetic was right and the correction
takes it correctly.

**14.6, four ROWS and eight fixture repositories: FIXED, and I counted them in the file.**
Row (20) loops over four parent worlds and calls `chain()` once per world, with no
`git checkout -b` anywhere in it; rows (21) and (22) each build one world with a separate
chainline; row (23) builds two. Four plus one plus one plus two is eight. The new sentence
is literally true where the old one ("all four use `git checkout -b`") was not.

**14.10 (1), the case-only rename rewrite: FIXED, and its Windows claim reproduces.** The
paragraph now says that for an ordinary rename away `worktree` is null, and that for a
case-only rename on this PC the old spelling resolves and returns equal bytes, so the
shipped guard PASSED an ordinary branch and SKIPPED an otherwise verified child. My SHIPPED
run measures exactly that: rows (24) and (25) red on Windows with `'pass' !== 'fail'` and
`'skip' !== 'fail'`. The one thing the paragraph does not say is that this is true with
`core.ignorecase` false as well, because the resolution is NTFS's and not Git's (N2's
neighbour, section 2).

**Astra R4's other reconciliation items, for completeness.** Its note that the report's
diff "is not confined to section 14" is true again this round: section 15 is new and 14.4,
14.5, 14.6 and 14.10 are edited in place. That is what the round was dispatched to do and I
read it as correct, not as scope creep. Its 36.385 s versus 37.6 s timing item is not a
correctness defect and I did not pursue it.

## 9. THE BAR OF RECORD, AT THE PUSHED HEAD

PC: `%TEMP%\earned-s9b`, `git fetch origin rebuild/b-s9-prep-cells` then
`git merge --ff-only FETCH_HEAD` to `1972b970`, working tree clean before and after
(`git status --porcelain` empty), node v24.19.0, Node binary
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`,
every run through a `.cmd` with `set "MEASURED_TEST_NOW=2026-09-03"` and
`set "TZ=America/New_York"` on their own lines, a log under `%TEMP%` and a `.done` file.
Linux: a farm scratch worktree of the same pushed head.

| what | round 5, measured by me | round 4 |
|---|---|---|
| the fence cell, Windows | **43 / 42 / 1**, exit 1 | 38 / 37 / 1 |
| the fence cell, Linux | **43 / 42 / 1**, exit 1, 3.91 s | 38 / 37 / 1, 3.5 s |
| the whole today step (`rebuild.yml:232`, 17 cells) | **685 / 683 / 2**, exit 1 | 685 / 683 / 2, exit 1 |
| the two today-step failures | `boundary.test.mjs` `P-MEASURE (g)` and `setup.test.mjs` `re-pin`, by name | the same two, pre-existing |
| `package.test.cjs` alone | **14 / 14 / 0**, exit 0 | 14 / 14 / 0 |
| step (b), the three passphrase cells | **20 / 20 / 0**, exit 0 | 20 / 20 / 0 |
| step (c), `rebuild/m3/w6/test/local-import.test.mjs` | **22 / 22 / 0**, exit 0 | 22 / 22 / 0 |
| the lane C step | **9 / 9 / 0**, exit 0 | 9 / 9 / 0 |
| `b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | the same line, word for word |

**Every number equals round 4's except the cell's own rows, which went from 38 to 43 by
design.** Nothing was green once and red once, on either machine, so nothing in this
re-check is reported as timing and no re-run was needed.

**THE REAL ROW's measured refusal on this branch, at this head, both systems.** Still nine
`FENCE-SEALED-PATH-TOUCHED M` refusals and no `FENCE-RESEAL-CHILD-UNVERIFIED`, against
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

The same nine as 14.7 and as Astra R4's line. The chain commit the Linux run judged by is
`e861745868c8a020b808b03f3c239e35938c59d3`, the same commit 15.4 names; Astra R4 named
`2d71dd049b1b25ca7645cdbd50ff38d70694e159` because the remote-tracking ref had not moved
yet on that machine at that hour. That is the ref moving, not a disagreement, and the row
prints the commit it judged by precisely so this is checkable (R1 N10).

## 10. WHAT I DID NOT VERIFY, AND HOW I WORKED

- I edited no tracked file but this review. The lane worktree was fetched and fast-forwarded
  and is otherwise untouched; every mutation ran in `%TEMP%\s9brevE` (PC) or in a farm
  scratch worktree, never in the lane worktree and never in the shared repository.
- I ran no seal generator, no `--full`, no receipt or artifact writer, and nothing on
  `rebuild/b-seal-gen`. I read nothing under `rebuild/conform/private`, no `ledger/`, no
  `src/history.js`, no `EarnedPort`, no `port-real.log` and nothing of the protected soak.
  No credential was printed. I deleted nothing I did not create.
- Items (2), (3) and (4) of the original ticket - H18, `boundary.test.mjs`, the three
  `rebuild.yml` steps - are byte-unchanged since round 4 and were re-run, not re-reviewed:
  this is a narrow re-check of the two files the micro round moved.
- Hosted CI on either leg, the real S9 reseal skip, the full historical 52-mutant sweep,
  the sibling suites outside the bar above and the conformance gate are not verified here.
- My scratch, retained for the PM: `%TEMP%\s9brevE` on the PC (`CTRL.tap`, `SHIPPED.tap`,
  `X5.tap`, `X7`-`X9`, `Y1`-`Y9`, the `R6D*` runs, `case.mjs`, `drive.mjs`, `gen-subs*.mjs`,
  `probe-worlds.js`, `probe.js`) and `/home/claude/farm/scratch/s9brevE/` in the farm. All of
  it is mine and none of it is committed.

## 11. THE VERDICT, STATED ONCE MORE

**REJECT.** Astra R4 finding 1 is FIXED and Astra R4 finding 2 is FIXED for X7, X8 and X9,
each measured by me on both operating systems rather than inferred, and the four in-place
report corrections all reproduce. The shipped code gave a right answer in every world I
could build. The reason for the verdict is narrower and it is this round's own: the new
HEAD-presence limb is measured only in the direction that catches a tamper, and two
substitutions inside it (Y5, Y6) make the fence refuse a branch that copied the chain's
inventory bytes correctly, with all 43 rows green on Windows and on Linux. That is the
false red F9 exists to prevent and the sentence the check's own comment ends on. One row
closes it and X5 with it, it is written out in section 4 ready to paste, and it is green
against the code as shipped.

This review is itself a hypothesis, and the next hand should disagree with it where the
evidence lets them.

Reviewer: cowork (Earned lane hand), independent narrow re-check R5, ticket S9-PREP-B.
