# SEAL-AUTOMATION - independent review R2 (second round)

Reviewed head `be38c022f7da1a003683773478e7151b0d5be2f1` on `rebuild/b-seal-gen`, in
`%TEMP%\earned-sealgen`, against base `2758edc`. Round 1 is
`SEAL-AUTOMATION-REVIEW-R1.md` (REJECT, two BLOCKING, eleven notes) at `4e538c2`; the fix
round is the single commit `be38c02`. I read the code and the R1 review first, re-ran the
replay proof myself, and read the author's report last. Every number below is one I
measured in this worktree. Where I re-state an R1 number I re-measured it.

## VERDICT: ACCEPT WITH NOTES

No BLOCKING items. Both R1 blocking items are really fixed, and I exercised each fix
rather than reading it: the child env is now built key for key the way `laws()` builds it
(including the four deletions, proved by poisoning the process env), and stage b6 refuses
`main` and `rebuild/t2-client-core` by name on a real repository standing on each of them.
The replay proof reproduced first time, wider than before and with the self-checks pulled
out of the headline.

Three MAJOR notes follow. One of them (M3) is a sentence the generator now prints that is
FALSE for nine of the eleven paths it prints it on, and if the PM acted on it at S9 the
seal would be weaker, not stronger. None of the three writes a wrong fact into a package,
none touches a read-only file, and none is a hole in the proof's core claim, which is why
this is ACCEPT WITH NOTES and not REJECT.

## 1. My replay numbers

`node --test --test-reporter=tap rebuild/lanes/b/tooling/gen/test/replay-s8.test.cjs`,
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` each on its own line of a .cmd:

```
cross-side facts      795     identical 786     self-checks 6
byte-identical files  4       prose-only 9      narrative 1      ordering 2
UNEXPLAINED           0
# pass 13  # fail 0   duration_ms 43461.9
```

Identical to the author's report, first run, no re-run needed. `needles: NOT compared`,
with the reason printed twice, which is what R1 N2 asked for.

Generator run standalone, my own invocation (not through the cell), `--stage hunks`:

```
declared 226 paths {"edited":24,"carried":182,"superseded-by-child":1,"new":19}
parent pins re-hashed 206, mismatches 0
runner sha256 4061325276edf0c0 (the post head carries e31dd206c0fb0fc0)
children 25, needles measured 0, TODO 33
```

TODO is 33 entries where R1 measured 67, and the `second-gate` wall is gone (N7).

## 2. The proof is still not circular, re-checked at the two places that could rot

R1 established this; I re-measured the two facts the fix round could have moved.

- `git log --oneline 1af78de..82c98f8` is exactly the eight S8-PREP commits
  (`1ac0c72` red-first, `70b983a` the hunks, `ef21153` the CI step, `6c55082` the brief,
  `c07d092` the package, `30dd4c0` the report, `63d6647` the review, `82c98f8` the fix
  round), and `git merge-base --is-ancestor 1af78de 82c98f8` exits 0. Everything the
  generator writes is built from blobs at `1af78de`; the comparison target is the blob at
  `82c98f8`. Different commits, before and after the round.
- The one input read at the post head that could have handed over an answer is the lane
  cell list: `git ls-tree --name-only <rev> rebuild/lanes/d/p3-real-shape/` returns 8
  entries at BOTH revs. It was not given to it.

And the strongest single fact in the cell is unchanged and is the reason the proof is
worth anything: REPLAY-4 compares role, pre and post for all 224 paths the round
committed (672 of the 795 facts), and every one is identical.

## 3. R1 findings, one by one

### B1 (needle env). FIXED.

`measure.cjs` now exports `CHILD_ENV_FIXED` and `CHILD_ENV_DELETED` and builds the child
env as `laws()` does. I checked the runner rather than the report:
`b-package.cjs:2086` is `{ ...process.env, NODE_OPTIONS:'', NODE_V8_COVERAGE:'',
TZ:'America/New_York', MEASURED_TEST_NOW:'2026-09-03', ENGINE_MAIN, ENGINE_OLD,
EARNED_CLIENT_DIR }` followed by the deletion of the same four names, and `bundles` is
`Reference.create(root)` at `b-package.cjs:3173`. `childEnv()` reproduces all three parts.
`runChild` now THROWS `MEASURE-CHILD-ENV-REQUIRED` rather than defaulting the env, so the
reduced-env path cannot come back by accident, and REPLAY-13 exercises the deletions by
poisoning this process's env first. It ran here in the refusing state (the reference build
fails in this worktree), so the refusal branch is the one that actually executed: my run
records 0 needles and names the reason once in TODO.

The author's extra evidence holds up and I verified it independently:
`%TEMP%\earned-sealgen\node_modules` is a junction to `%TEMP%\earned-realshape\node_modules`,
which is a junction to `%TEMP%\earned-ci\node_modules`, and that directory does not exist
(`@noble/hashes` does not resolve). So the 7-of-25 symptom R1 measured is a dead junction
chain, not the env. The finding was still right and the fix is the right fix. See N7 below
for what this means for S9.

### B2 (b6 pushed whatever HEAD was). FIXED, and exercised.

`commandFor('b6')` now calls `pushBranch()`, which resolves
`git symbolic-ref --quiet --short HEAD`, refuses a detached HEAD, refuses the two names,
and returns `git push -u origin <branch>:<branch>`. I exercised it against a throwaway
repository created in `%TEMP%` (not a worktree of this repo), moving `HEAD` by
`git symbolic-ref`:

```
on main                     -> CHAIN-PUSH-REFUSED: this worktree stands on main, which no script pushes...
on rebuild/t2-client-core   -> CHAIN-PUSH-REFUSED: ... the fast-forward of rebuild/t2-client-core is stage b7...
on rebuild/b-seal-gen       -> RETURNED rebuild/b-seal-gen
```

and from this worktree, `--stage b6 --dry-run` writes the .cmd, starts nothing, says so,
and the command is `git push -u origin rebuild/b-seal-gen:rebuild/b-seal-gen`. `--plan`
prints the refusal in place of the command when the worktree cannot run the stage.

### N1 (narrative tolerance). FIXED for the case R1 demonstrated; STILL OPEN in a narrower one. See M2.

### N2 (the all-25 needle mode was red and unreported). FIXED.

The switch is `GEN_REPLAY_NEEDLES_AT_POST_HEAD` and is honoured only when HEAD really is
`82c98f8` AND `childEnv().exact`; otherwise the cell declines and prints which condition
failed. My run printed both the decline and the env reason. Report section 5 now says the
mechanism is proved on one child and the facts are not.

### N3 (hash-lines would hash a CR). FIXED.

`raw.replace(/\r+$/, '')` per line, plus a printed NOTE when the file was CRLF. The repair
is not silent, which is the right call on this path.

### N4 (the two extra paths were not explained). FIXED in the letter, BROKEN in the spirit. See M3.

### N5 (silent .md drop). FIXED.

`droppedMd` is collected and named in one TODO entry carrying the `DECISIONS:519`
slice-deploy reason. One entry rather than thirteen is the right shape given N7.

### N6 (REPLAY-6 compared nothing across the two sides). FIXED for the six the note named; PARTLY STILL OPEN. See M4.

The six committed-against-committed checks are `selfCheck`s now, counted and printed
apart, and the cross-side fact R1 asked for (the SET of re-pinned specs, measured from the
round's own diff) is there and passes. The author reports it went red on its first run and
exposed a real defect; I cannot re-measure a transient, but the rule the fix leaves behind
is the right one and I checked it against the tree: `H3 S3 S4 S5 S6 S7` pin the runner as
it stands at the base and are re-pinned; `B-NTC B1 B2 B3 B4` pin an older runner and are
left alone with a named TODO entry.

### N7 (the ORDINAL detector buried TODO.md). FIXED.

33 entries where R1 measured 67, no `second-gate` false alarms, and the four ordinal
places the report's 3.2 names are still listed (entries 1 to 4 and 8 to 10 of my run).

### N8 (a path the runner would refuse was still declared). FIXED, with one consequence. See N6 of this review.

`continue`, and the TODO wording agrees with the JSON.

### N9 (--post-head unchecked). FIXED.

`git merge-base --is-ancestor <head> <postHead>`, three-valued (0 / 1 / cannot answer),
and the refusal is `todo.unshift`ed so it is the FIRST line. My run's TODO does not carry
it, which is correct: `8ebc860c` is an ancestor of `82c98f8`.

### N10 (a5 marked run but wrote nothing). FIXED.

a5 is `[hand]`, names `propose.cjs` as the check to run first and says it writes nothing.
Confirmed in `--plan` output.

### N11 (--dry-run printed "started detached"). FIXED.

Confirmed above: "DRY RUN: the stage .cmd was written and NOTHING was started."

Nothing in R1 was disputed by the author, and I uphold no dispute of my own: every one of
the thirteen findings was a real defect and twelve are closed as described. The two that
are not fully closed are M2 and M3 below, and in both cases the fix moved in the right
direction and stopped one step short.

## 4. What the fix round left open or made worse

### M1 (MAJOR). b6 is guarded; a3 and b1 are not, and they MERGE

The B2 fix put the guard in `pushBranch()`, which only `b6` calls. Stages `a3` and `b1`
are `run` stages whose command is

```
git fetch origin && git merge --no-edit origin/rebuild/t2-client-core
```

and `startStage` runs it with `cd /d "<REPO>"`, where `REPO` is resolved from `__dirname`,
i.e. whatever worktree this lane B file has travelled to, on whatever branch that worktree
stands. Nothing asks which branch that is. Measured, on the same throwaway repository
standing on `main`:

```
commandFor('S9','a3',{root:<repo on main>})  -> RETURNED git fetch origin && git merge --no-edit origin/rebuild/t2-client-core
commandFor('S9','b1',{root:<repo on main>})  -> RETURNED git fetch origin && git merge --no-edit origin/rebuild/t2-client-core
```

That is a script merging the chain tip into `main`, detached, with a log and a .done file.
"Never merge into main" is a stop-the-line rule in the same sentence as "never push to the
chain branch", and the argument the author made for b6 ("this file travels to every lane
worktree there is") applies word for word here.

I did NOT make this blocking: it cannot reach the network (b6 refuses, and b7 is a hand
stage), so the damage is a local merge commit a person can throw away, and no fact in any
package moves. But the guard already exists three lines away. The smallest fix is to give
`a3`/`b1` the same resolution `pushBranch` does: refuse `main` and `rebuild/t2-client-core`
by name, refuse a detached HEAD, and print the branch being merged INTO in the stage
banner, because that is the fact the PM most wants to see before pressing go.

### M2 (MAJOR). N1's hole is narrower and it is not closed: `assert.equal(expr, 'DATA')`

The new rule is right about R1's example, and REPLAY-12 proves it with a real committed
line. But the rule decides "the last string literal that closes the call is the node:test
MESSAGE" without ever asking how many arguments the call has. In a two-argument
`assert.equal(expr, 'VALUE')` the last string is the EXPECTED VALUE, and a wrong value
there is classified `narrative` and never fails the cell.

Measured with `compare.cjs`'s own functions, over the committed blobs at `82c98f8` of
every file `compareFile()` compares:

```
assert lines ending in a string literal:                    144
mutated last DATA string still classified "narrative":       29
```

Four of the real ones, from the F6/F7 cell, with my mutant:

```
committed: assert.equal(api.product(s, noParent, unsealed), 'IMPLEMENTED');
mutant   : assert.equal(api.product(s, noParent, unsealed), 'MUTATED-IMPLEMENTED');   -> narrative
committed: assert.equal(api.product(partial, noParent, unsealed), 'PARTIAL');
mutant   : assert.equal(api.product(partial, noParent, unsealed), 'MUTATED-PARTIAL'); -> narrative
committed: assert.equal(typeof api.EXECUTED_CLOSURE_LIMIT, 'number');
mutant   : assert.equal(typeof api.EXECUTED_CLOSURE_LIMIT, 'MUTATED-number');         -> narrative
```

Why the S8 result nevertheless stands, measured rather than assumed: I ran the S7 to S8
substitution set over the last string of each of those lines in the six mirrored cells and
the F6/F7 cell. **0 of them are rewritten by the mirror.** In `b-package.cjs` the question
does not arise at all, because `editRunner` mirrors only the three comment blocks and
never an assert line. So nothing in this round could have slipped through this hole, and
none of the 795 facts is in doubt.

It is still worth closing before the rule is trusted on a family nobody has read yet.
The arity is in hand: count the top-level commas in the head `withoutMessage()` returns.
For `assert(...)` one preceding argument means the string is the message; for
`assert.equal` / `deepEqual` / `notEqual` and friends it takes TWO preceding arguments for
the last string to be a message, and one means it is the expected value and must be
byte-identical. Add the control alongside REPLAY-12, using the `'IMPLEMENTED'` line above,
which is real and committed.

### M3 (MAJOR). The N4 wording is now attached to nine paths where it is FALSE, and the cell only checks the two where it is true

R1 N4 was right that the report described behaviour the code did not have. The fix gives a
`new` path the `DECISIONS:524 N1` sentence when it "stands under NO declared child root",
and REPLAY-4 now asserts that wording on the extras. But "under a declared child root" is
not the test `:524 N1` applied. The test there was whether a DECLARED CHILD EXECUTES the
path, and a path can be executed by a declared child without standing under a child root:
the `s8-*` supersede cells are themselves the child argv targets, and they live under
`rebuild/m4/workout/test/`, which is not a child root.

Measured against the committed S8 (`82c98f8:packages/S8.json`), for the eleven paths my
run gives that sentence to:

```
DECLARED role=new   executed by a declared child   rebuild/m4/workout/test/s8-supersede-source-carriers.test.cjs
DECLARED role=new   executed by a declared child   rebuild/m4/workout/test/s8-supersede-inherited-carriers.test.cjs
DECLARED role=new   executed by a declared child   rebuild/m4/workout/test/s8-supersede-defect-witnesses.test.cjs
DECLARED role=new   executed by a declared child   rebuild/m4/workout/test/s8-supersede-writers-differential.test.cjs
DECLARED role=new   executed by a declared child   rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs
DECLARED role=new   executed by a declared child   rebuild/m4/workout/test/s8-engine-files-differential.cjs
DECLARED role=new   not a child argv target        rebuild/m3/w7-preview/today/local-source-basis.mjs
DECLARED role=new   not a child argv target        rebuild/m4/workout/engine-history.cjs
DECLARED role=new   not a child argv target        rebuild/m4/workout/lift-correspondence.cjs
NOT DECLARED        not a child argv target        rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs
NOT DECLARED        not a child argv target        rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs
```

So the generator tells the PM "no declared child executes it ... this is the
DECISIONS:524 N1 shape ... answer with `--exclude` to keep it undeclared" about SIX paths
that a declared child does execute, and about three more that the round declared anyway.
Only the last two are the `:524 N1` case, and they are exactly the two REPLAY-4 checks,
so the cell certifies the wording precisely where it is right and is silent where it is
wrong.

The JSON is correct throughout (all nine are declared `new`, matching the round), so no
fact is wrong. What is wrong is advice: a PM who follows it at S9 would `--exclude` the
child cells of their own package. Fix: ask the question `:524 N1` asked, which the
generator already computes a few lines later in `childDeclsFor()`. A path that is a target
of any declared child's argv gets the ordinary sentence; only a path no child executes
gets the `:524 N1` sentence and the `--exclude` invitation. Then widen REPLAY-4 to assert
that the six cells do NOT carry it.

### M4 (MINOR, but it is the headline number). 19 of the 795 "cross-side" facts are not cross-side

The `fact` / `selfCheck` split is the right idea and it was applied to six checks. It was
not applied to two more classes, which stay inside the number the report leads with. I
enumerated every `fact()` call in the cell and the arithmetic closes exactly on 795
(5 + 18 + 17 + 672 + 14 + 8 + 53 + 5 + 3), so this is a count, not an estimate:

- REPLAY-2, 12 facts (2 per cell): `fact(f + ' reads its own spec', a.includes("packages/S8.json'"), true)`
  and its negative. Both sides are the generated file against a literal.
- REPLAY-6, 7 facts: `spec.tooling.runnerSha256` against the sha of the runner THIS RUN
  generated, and the same value in each of the six generated ancestor specs. Generated
  against generated, which is the shape N6 named.

They are real checks and they should stay; they are not reproduction. The honest headline
is **776 cross-side facts, 767 identical, 19 internal consistency checks, 6 self-checks**.
Say it that way in the report and the number stops needing a footnote.

## 5. Notes

### N1. The replay never compares the ancestor spec FILES, only the one field

`REPLAY-6` compares `tooling.runnerSha256` in the six generated ancestor specs. Nothing
compares their BYTES, and the generator re-serialises each one with
`JSON.stringify(s, null, 2) + '\n'`. A change in key order or spacing would move six
pinned product shas and the cell would not see it: `REPLAY-4` reads `post` from the git
blob, not from the generated file, so it would not see it either. I measured it by hand,
as R1 did:

```
H3 35098B  S3 38378B  S4 42795B  S5 51063B  S6 84681B  S7 83327B
each generated file == the blob at the base with ONLY runnerSha256 swapped: true
and == the blob at the post head with the same swap:                        true
```

Clean today, and it is one `compareFile` per ancestor to stop it needing a human next
round.

### N2. Each replay run leaves two `sealgen-replay-*` folders in `%TEMP%`

`fs.mkdtempSync` twice per run (the real run and the red control), never removed. Two
folders of 25 files each per run, on a PC several lanes share.

### N3. `--released` emits a role the runner refuses TODAY, and TODO.md does not say so

`b-package.cjs:351` is still
`PRODUCT_ROLES = ['edited','carried','new','superseded-by-child','pinned-unchanged']`, and
`:1519` refuses anything else with `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY`. The README
and the report are clear that `released` arrives with S9-RELEASE-SPEC hunk H1, but the
generator's own comment says "it IS the sixth member" and the TODO entry it writes for a
released path names only the ruling line. One clause in that entry ("this role does not
exist in the runner until S9 hunk H1 lands; a package declaring it before then refuses at
PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY") costs nothing and saves a confusing chain
round.

### N4. `--plan` prints `$ "node" rebuild/...`

`c.replace(NODE, 'node')` leaves the quotes that were around the executable path, so the
plan prints a command that is not quite the command. Cosmetic, on a file whose value is
that you can trust what it prints.

### N5. The README declines the number the ticket asked for

Requirement 4 asks for "the expected time saved per seal with the measurement behind the
number". The README gives the measurement (786 of 795 facts, 4 of 15 files byte-identical,
about 20 seconds of machine work covering the mechanical content of six of the round's
eight commits) and then explicitly refuses the hours. I would rather have the honest
refusal than an invented 2.5, but the PM asked for a number and it is not there. The one
defensible number is in the fact list already: the six commits it replaces are the ones
that were typed by hand, and the PM is the only person who knows what those cost.

### N6. `pinned-unchanged` is never proposed, and the N8 fix drops exactly the case it exists for

The runner's fifth role is `pinned-unchanged`: `pre === post`, both real bytes, NOT
parent-pinned, executed by a declared child (`b-package.cjs:341-351`, `:1525-1528`,
`:1552`, `:1947-1949`). The N8 fix now REFUSES to declare a `new` path with `pre === post`
and sends it to TODO for a human. That is safe and it is better than writing a pin the
runner refuses, but the runner has the answer: if the path is a declared child's argv
target, the role is `pinned-unchanged`. Proposing it (with the TODO line kept) is a real
piece of the mechanical half, and `:1995` says the case arrives by itself
("re-declare them pinned-unchanged at the next seal").

### N7. Requirement (g) has still never run to completion anywhere

Not a defect of the code, a gap in the evidence, and the PM should carry it into S9. The
needle stage is now honest in both directions: it refuses under a reduced env and the
replay declines to compare needles away from the post head. The consequence is that
nobody has yet seen it SUCCEED. R1 measured 7 of 25 under the old code; my run measures
0 of 25, correctly, because the reference build cannot run here. So the parts of the
needle path that have never executed are: the `exact: true` branch of `childEnv()`, the
tap needle capture, `--needle-repeat`, and the whole all-25 comparison. Everything else in
this folder has a second witness in Git; this does not. Before S9 pins a needle, run
`--stage all` once from a worktree whose `node_modules` really resolves and read
`needles.json`, and prefer `--needle-repeat 2`.

## 6. What I checked and found clean

- `git diff --stat 2758edc..HEAD`: 12 files, 2563 insertions, 0 deletions, every file NEW
  and every one of them under `rebuild/lanes/b/tooling/gen/` or the two lane B reports.
  No read-only file of this lane is touched: not `b-package.cjs`, not any
  `packages/*.json`, not a receipt, not an acceptance artifact, not `.github/workflows/*`,
  not `rebuild/engine`, `rebuild/coach` or `rebuild/DECISIONS.md`. The fix round moved
  nine files and all nine are its own.
- No `U+2013` and no `U+2014` in any of the 12 blobs, and no CR byte in any of them
  (checked by code point over `git cat-file blob HEAD:<path>`, not by eye).
- Everything the generator writes: 25 files, **0 CR bytes**. The one path where a CR could
  still arrive is the PM's editor, and `hash-lines.cjs` now strips it and says so.
- The only `fs.writeFileSync` calls in `gen/` are `writeOut()` (under `--out`, which the
  caller gives) and the stage `.cmd` under `%TEMP%`. No `appendFile`, no write to
  `DECISIONS.md`, no `rm`, no `mklink`, no junction, no read of `rebuild/conform/private`,
  no `EarnedPort`. `DECISIONS.md` is only ever read as a blob.
- `--full` is unreachable: `--stage a7` refuses without the flag (re-run here, it prints
  the refusal and returns 3), and with `--pm-runs-full` it still refuses to run it and
  names the PM's own `s<N>-full<K>.cmd` instead.
- Every product sha256 still comes from `git cat-file blob <rev>:<path>`. The only
  `readFileSync` calls on a measurement path are `hash-lines.cjs` (a file the PM hands it)
  and `propose.cjs` reading the runner it compiles. No working file is hashed anywhere.
- The needle matcher is faithful: `measure.cjs`'s escape set is character for character
  the runner's `escapeRe` at `b-package.cjs:614`, and the predicate is the same
  `new RegExp('^' + escapeRe(needle), 'm')`.
- The token line rule: `sha256` over the line bytes, leading dash included, newline
  excluded, which is what `claim()` reads. REPLAY-8 holds the generator's own hash
  function to the three shas the sealed S8 records, and the GATE-SUPERSESSION line is
  found in the ledger by its sha alone.

## 7. For the PM

Accept it. The two guards R1 blocked on are closed and I exercised both rather than
reading them; the replay is the same measurement it was, reproduced here first time, and
the fix round widened it (the re-pinned SET, REPLAY-12, REPLAY-13) instead of narrowing
what it looks at. Of the three MAJOR notes, none puts a wrong fact in a package.

What I would do before S9 leans on it, in the order I would do it:

1. **M3 first**, because it is the only one that can make a human act wrongly, and it is a
   one-line change to the condition plus one assertion in REPLAY-4.
2. **M1 next**, because `a3` and `b1` are `run` stages someone will start from the wrong
   worktree eventually, and the guard is already written.
3. **N7 before any needle is pinned**: one successful `--stage all` from a whole worktree,
   read `needles.json`, `--needle-repeat 2` on the run that feeds the sealed package.
4. M2 and N1 whenever the folder is next open. Neither can bite this family.

One thing worth saying plainly to the owner, since speed is the point: what this generator
now reproduces is 776 mechanical facts of the S8 round, including all 224 declared paths
with their roles and both shas, in about 20 seconds. What it does not reproduce is a
single sentence of prose, a single judgment, or one of the three token lines, and it says
so in 33 named places. That division is the right one and it is the reason the number is
believable.
