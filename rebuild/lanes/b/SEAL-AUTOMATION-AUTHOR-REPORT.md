# SEAL-AUTOMATION - author report

**FIX ROUND (R1).** The first author is gone; this report is the second author's, and it
keeps the first author's text wherever the evidence still supports it. Every number below
was re-measured in this worktree after the R1 fixes. The findings themselves are answered
one by one in the last section, "R1 findings: fixed or disputed", and two of the fixes
changed what the generator PRODUCES, not only what it says: the child needles (B1) and the
set of ancestor specs it re-pins (found by the new fact the reviewer asked for in N6).

Lane B tooling, new files only, branch `rebuild/b-seal-gen`, worktree `%TEMP%\earned-sealgen`,
cut from the chain tip `2758edc`. Nothing outside `rebuild/lanes/b/tooling/gen/` is touched
except this report. The runner, every `packages/*.json`, every receipt, every acceptance
artifact, `.github/workflows/*`, `rebuild/engine`, `rebuild/coach` and `rebuild/DECISIONS.md`
are unmodified; `git diff --stat` against the base shows only new files.

**This report is a hypothesis, not evidence.** The evidence is
`rebuild/lanes/b/tooling/gen/test/replay-s8.test.cjs`, which a reviewer should run and read
before reading any number below.

## 1. What was built

- `gen/new-child.cjs` - generates (a) to (j) of the ticket into a scratch `--out` folder.
  There is no `--write`; it cannot touch the tree.
- `gen/lib/measure.cjs` - every measurement. Product sha256 over **git blobs**
  (`git cat-file blob <rev>:<path>`), never a working file, never CRLF-converted. Needles
  by running the child the way `children()` runs it.
- `gen/lib/mirror.cjs` - the S7 -> S8 substitution, applied as ONE alternation so no
  replacement feeds another.
- `gen/lib/family.cjs` - parses the runner's IDS / NO_REGISTER_IDS / CHILD_ROOTS and finds
  the parent round's own reason comment above each.
- `gen/hash-lines.cjs` - the sha256 the runner computes for a ledger line.
- `gen/propose.cjs` - compiles the runner to its own main-sequence boundary so chain A
  stage a5 can reach `proposed()` without starting a campaign.
- `gen/seal-chain.cjs` - chain A and chain B as named, restartable stages.
- `gen/test/replay-s8.test.cjs` - the acceptance proof.
- `gen/README.md`.

## 2. The proof: replaying the S8 preparation round

The test runs the generator with `--id S8 --name M2-S8-REAL-SHAPE --parent S7`, source base
`8ebc860c` (the sourceBase S8.json itself records), hunk base `1af78de` (the merge, before
any S8-PREP commit), post head `82c98f8` (the accepted S8-PREP head), parent seal
`285fe08b`, and compares with what the round committed.

```
REPLAY OF THE S8 PREPARATION ROUND (82c98f8)
  cross-side facts      795   (generated vs committed - this is the number that means reproduction)
  identical             786
  self-checks           6     (one side of the round against itself; NOT counted above)
  needles               not compared: ... (see 5)
  byte-identical files  4  [s8-supersede-inherited-carriers.test.cjs,
                            s8-supersede-defect-witnesses.test.cjs,
                            s8-supersede-second-gate.test.cjs,
                            s8-engine-files-differential.cjs]
  files differing in comment prose only  9
  test titles / assert messages differing 1
  ordering the runner does not read       2
  UNEXPLAINED           0
```

`node --test` says `# pass 13 # fail 0`.

The headline moved from "800 compared, 791 identical" to "795 cross-side, 786 identical"
for one reason and it is not a regression: R1 N6 was right that 6 of the old 800 were the
committed specs compared with each other, which says nothing about this generator. They
are still checked, and they are still printed, under their own heading. The other seven
facts of old REPLAY-6 became one stronger fact - the SET of ancestor specs re-pinned - and
that one went RED the first time it ran. See 3.7.

### What the 795 cross-side facts are made of

- the IDS literal, the NO_REGISTER_IDS literal, CHILD_ROOTS element for element, and the
  `:NNN` the IDS comment cites for the argv gate (that number is **measured** in the
  post-hunk runner, and it came out at the committed value);
- the six `s8-*` cells by name, each asserted to read `packages/S8.json` and not S7's;
- the five F6/F7 assertions and the CHILD_SPECS line in each of five product cells;
- **672 package facts**: `role`, `pre` and `post` for each of the 224 paths the round
  declared. All 224 roles, all 224 pres, all 224 posts identical;
- 14 package coordinates: lanePackage, packageId, sourceBase, parent.chosen, parent
  artifact + its sha256, parent review + its sha256, parent receiptLedgerLine (found by
  searching the ledger for the POSTFIX-ACCEPTANCE line, not typed), artifact.file,
  artifact.review, authorizations.review, brief.file, brief.sha256;
- the runner sha256 re-pinned in H3/S3/S4/S5/S6/S7 (7 cross-side facts: the SET of
  ancestor specs re-pinned, measured from the round's own diff, plus the value in each of
  the six generated specs. The 6 committed-against-committed checks are counted apart);
- 25 child names and 25 argv sets;
- the three token-line sha256 rules;
- the standing CI `run:` line and step NAME, and the lane-cell run line as a set.

### The parent-pin re-hash

The generator re-hashed all **206** paths the parent artifact pins, from Git at the source
base, against S7's own recorded posts: **0 mismatches**. That is the check DECISIONS:511
and :515 state by hand for S7 and :524 for S8, and it is now a by-product of generating the
package rather than a separate measurement.

## 3. Every difference, and why

1. **Comment prose in nine files.** A mirrored block carries the PARENT round's product
   story until `--subst` pairs replace it, and even then the human rewraps and rewrites. No
   build reads a comment. Listed by file in the test output.
2. **Ordinals.** "a fourth time" / "a fifth time", "ADDS A NINETEENTH" / "A TWENTIETH",
   "the sequence is now ELEVEN" / "TWELVE", "THIS IS THE FIFTH GENERATION" / "THE SIXTH".
   These are sentences being **extended**, not tokens being swapped. The generator refuses
   to shift them, because "the first of the nineteen gates refusing" is an ordinal in the
   same file and shifting it would make the comment false. Every one is named in `TODO.md`
   with its file and line.
3. **One test title.** F7's title reads "...M2-S7-PORT-ADMISSION's one **and
   M2-S8-REAL-SHAPE's one** behind them". The mirror produces the parent's form. A title is
   printed by `node --test` and read by nobody's build. I deliberately did not write a
   regex to extend it: fitting one example is how a generator starts lying.
4. **Two orderings.** The `d-real-shape` child's argv and the rebuild.yml lane-cell step
   list the same six cells in ls-tree order; the round listed them in the author's reading
   order (walk, capture, bar-admit, bar-keep, r1-fixes, q1-producer). `children()` holds the
   child to one needle over the whole run, so the SET is the fact and the order is not.
   Compared as a set; the ordering difference is printed, not asserted away.
5. **Two extra declared paths.** The generator declares
   `rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs` and `projector-parity.test.mjs`,
   which the round did NOT declare. This is not a defect in either direction: DECISIONS:524
   N1 is the PM ruling that kept them undeclared and gave them a CI home by exact path
   instead. R1 N4 caught this description being false: the generator DID name both, but
   with the generic "confirm the PM means to declare it" sentence, and the `:524 N1`
   wording appeared only once `--exclude` had already been passed - which is the case
   where the PM has already decided. Fixed in `buildPackage`: a `new` path standing under
   NO declared child root is named with the ruling that applies to it (no declared child
   executes it, which is the `:524 N1` shape), and REPLAY-4 now asserts that wording rather
   than mere presence. `--exclude` is how the PM answers. The test asserts the extras are **exactly** those two and that both are
   named in TODO.md.
6. **The runner sha256 differs from the committed one** - necessarily, because the comment
   prose differs. What the test proves instead is the *rule*: the package and all six
   ancestor specs are pinned to the sha of the runner **this run generated**, and the six
   committed ancestor specs all carry the one sha the committed package carries.
7. **A defect the new fact found, and it was the generator's.** R1 N6 asked for the SET of
   re-pinned specs to be compared instead of six self-checks. Measured, that set was
   `[B-NTC, B1, B2, B3, B4, H3, S3, S4, S5, S6, S7]` where the round committed
   `[H3, S3, S4, S5, S6, S7]`, and the cell went red. The five extra specs pin runner
   sha256 `4482bb8a`, which is not the runner at the base (`0fb0570d`): they are frozen
   where their own seals left them and the S8 round touched none of them. The generator
   was re-pinning every spec that NAMES the runner. It now re-pins only a spec that pins
   the runner THIS hunk moves, and names the frozen ones in `TODO.md`. Without N6 this
   would have reached S9 as five unexplained files in the diff, each quietly restating what
   an already-sealed package was measured against.

## 4. The red control

REPLAY-11 runs the generator with the child root replaced by a root that does not exist and
with the parent's spec path pinned to itself. It then asserts the mutant reads
`packages/S7.json` where the real run reads S8's, that the CHILD_ROOTS literal moved, and
that F7's asserted length moved with it - so REPLAY-1, REPLAY-2 and REPLAY-3 are
measurements and not decoration. Order note, honestly: the generator was written first,
because the substitution had to be **measured** off the real S7 -> S8 diff before anything
could be asserted about it. The red control is what stands in for red-first here, and it is
in the cell rather than in a commit message.

Two more controls arrived in the fix round, both asked for by R1:

- **REPLAY-12** takes a real committed assert line out of the s8-supersede-second-gate cell
  at `82c98f8`, mutates a data string INSIDE its expression, and requires the classifier to
  call that a code difference - and then requires a line whose MESSAGE alone moved to still
  be prose, so the narrowing did not simply make the cell useless. The classifier itself
  moved into `gen/lib/compare.cjs` so it can be tested directly instead of only through a
  whole replay run.
- **REPLAY-13** poisons this process's own env with the four variables the runner deletes,
  builds the child env, and requires all three halves of `laws()`: the clock pair set,
  `EARNED_CLIENT_DIR` set, the four deleted, and `ENGINE_MAIN`/`ENGINE_OLD` present exactly
  when the reference build succeeded. It also requires `runChild` to REFUSE a defaulted env
  and `measureChildren` to record nothing when the env is not `children()`'s.

## 5. What it cannot do

- It cannot write the brief, the theme sentence, or any judgment.
- It cannot know which accepted lane rounds a package carries; `--subst` is how it is told,
  and `TODO.md` says so on every run where it is not.
- It cannot extend an ordinal or a counted enumeration in prose (above).
- It cannot decide whether a candidate path is product. It declares every non-`.md` path in
  the lane diff the parent does not pin, and names each one.
- It cannot run `--full`, and `seal-chain.cjs` refuses every `--full` stage without
  `--pm-runs-full`, which this lane never passes. It never creates the private junction.
- `propose.cjs` compiles the runner and reaches `proposed()`, but does not assemble the
  spec/bound pair for it: that assembly was a PM-read scratch script in S7 and S8
  (DECISIONS:516) and I have left it that way rather than guess it.
- **It cannot measure a needle from a worktree the children cannot run in, and it no
  longer pretends to.** R1 B1 and N2 were both right here. A needle is measured under the
  env `laws()` builds, which includes `ENGINE_MAIN` and `ENGINE_OLD` from
  `Reference.create(root)`; if that reference build refuses, the generator records NO
  needle and names the reason once in `TODO.md`. In THIS worktree it does refuse
  (`BASELINE-ESBUILD-MISSING`), so a full run now reports `needles measured 0` where it
  used to report 7 of 25. The replay cell compares needles only from a worktree standing
  AT the post head and only when that env is exact (`GEN_REPLAY_NEEDLES_AT_POST_HEAD=1`);
  otherwise it declines and prints which condition failed. What the default run proves is
  the mechanism, on the engine-files differential, whose needle is a sentence and not a
  `# pass N`.
- The needle measurement is real but slow: all 25 children take minutes, and
  `--needle-repeat 2` doubles that in exchange for refusing a needle a child does not
  reproduce.

## 6. How the PM uses it for S9

Three lines, from the S9 lane worktree, once the runner hunks and cells are committed:

```
node rebuild/lanes/b/tooling/gen/new-child.cjs --plan
node rebuild/lanes/b/tooling/gen/new-child.cjs --id S9 --name M2-S9-UI-PINS --parent S8 \
  --head <the lane commit to seal> --base <the same commit, before the hunks> \
  --post-head HEAD --child-root <the S9 lane cells' directory> --dispatch-line <the :NNN that dispatched S9> \
  --subst "<the parent's accepted rounds>=<S9's accepted rounds>" --out %TEMP%\s9-gen
node rebuild/lanes/b/tooling/gen/seal-chain.cjs --id S9 --plan
```

Then: read `%TEMP%\s9-gen\TODO.md` first, apply `%TEMP%\s9-gen\tree\**` as the round's
first commits, re-run with `--post-head HEAD --stage all` so the package's posts and all
needles are measured on the landed tree, fill `final-lines.txt`, and hash it with
`gen/hash-lines.cjs` before a single ledger byte is written.

One condition on that second run, and it is not optional: **run it from a worktree whose
`node_modules` really resolves.** The needle stage refuses to record anything otherwise,
and it is right to (5). `--needle-repeat 2` is worth its minutes on the run whose needles
go into the sealed package.

## 6b. The S9 RELEASED role

`rebuild/lanes/b/S9-RELEASE-SPEC.md` is on origin, so this is measured rather than
promised. `released` is the sixth `PRODUCT_ROLES` member (hunk H1); a released entry stays
declared in `s.product` (the completeness walk at `:1975` still finds it), carries
`pre !== null` and `post === null` (H4), and the released set must equal the granted set of
a RELEASE-FROM-SEAL token line in both directions (H9). `new-child.cjs --released <path>`
declares exactly that and nothing more, and puts the ruling line in `TODO.md`. It never
proposes the role by itself: the role is a PM ruling and the runner refuses a spec that
disagrees with the line. It also measures spec B.6 / risk R2 - a released path that is a
child argv target gets silently re-pinned into `executionPins` by `proposed()` and the
release quietly undoes itself a generation later - and names that collision if it sees one.

## 7. Exercised in this lane

`seal-chain.cjs --plan` (both chains), the `a7` PM refusal, and `--stage a1`
(`--ci --package S8`) against the already-sealed S8 on this worktree. The runner walked
SPEC OBSERVED -> PARENT OPTION S7 ACCEPTED -> PARENT BOUND S7 and refused at
`SEAL-BASE-IS-NOT-THE-CHAIN-TIP`, which is the correct refusal for a package sealed four
ledger lines ago on a tip that has moved. No `--full`, no private census, no junction.

In the fix round, additionally: `--stage a5` (now a `hand` stage, prints and runs nothing),
`--stage b6 --dry-run` (writes the .cmd, starts nothing, and says so), and the b6 branch
guard exercised against a real repository standing on `main` - created in `%TEMP%` for the
purpose, not a worktree of this repo:

```
this lane worktree            -> git push -u origin rebuild/b-seal-gen:rebuild/b-seal-gen
--branch that agrees          -> git push -u origin rebuild/b-seal-gen:rebuild/b-seal-gen
--branch rebuild/t2-client-core -> REFUSED CHAIN-PUSH-REFUSED: --branch ... but this worktree stands on rebuild/b-seal-gen
a worktree standing on main   -> REFUSED CHAIN-PUSH-REFUSED: this worktree stands on main, which no script pushes
```

## 8. R1 findings: fixed or disputed

The review is `rebuild/lanes/b/SEAL-AUTOMATION-REVIEW-R1.md`, REJECT on two blocking
items. Both are fixed. Of the eleven notes, ten are fixed and one is fixed in a different
shape than the reviewer proposed, with the reason. Nothing is disputed as wrong: the one
place where I have evidence the reviewer did not is B1's SYMPTOM, and it makes the finding
stronger, not weaker.

### B1 - a needle was not measured the way `children()` runs it. **FIXED.**

`measure.cjs` now builds the child env exactly as `laws()` does at `b-package.cjs:2085`:
`CHILD_ENV_FIXED`, plus `EARNED_CLIENT_DIR`, plus `ENGINE_MAIN`/`ENGINE_OLD` from
`Reference.create(root)` (called in-process, so the bundles it builds outlive the children
that need them), minus the four variables the runner deletes - `CHILD_ENV_DELETED`,
verbatim from the runner. `runChild` no longer defaults its env: it THROWS
`MEASURE-CHILD-ENV-REQUIRED`, so no future code path can quietly measure under a reduced
env again. When the reference build refuses, `childEnv()` returns `exact: false` with the
reason and `measureChildren` records NO needle at all, with one named TODO entry.
REPLAY-13 asserts all of this, including the deletions, by poisoning this process's env
first.

**Evidence the reviewer did not have, and it matters for what the PM does next.** The
reviewer measured "children 25, needles measured 7" and said, carefully, that they were
not claiming the env caused all 18 failures. It causes none of them. Measured here, all 25
children under BOTH envs (`%TEMP%\sealgen-childprobe.log`): the same 7 are green and the
same 18 exit 1 either way. The cause is that this worktree has no `node_modules` at all -
`node_modules` is a junction to `%TEMP%\earned-realshape\node_modules`, itself a junction
to `%TEMP%\earned-ci\node_modules`, and that directory does not exist. The 18 all die with
`ERR_MODULE_NOT_FOUND: Cannot find package '@noble/hashes'`, and the same missing tree is
why `Reference.create` answers `BASELINE-ESBUILD-MISSING`. So the fix is right for the
reason the reviewer gave, and the worktree is separately broken. I have not touched
`node_modules` (this lane does not), and the README now says a needle run needs a worktree
whose `node_modules` resolves. **This is the one thing I would put in front of the PM
before S9**: the junction chain in `%TEMP%\earned-sealgen` is dead.

### B2 - `seal-chain.cjs` stage b6 pushes whatever branch HEAD is. **FIXED.**

b6 resolves the branch with `git symbolic-ref --quiet --short HEAD`, refuses `main` and
`rebuild/t2-client-core` by name, refuses a detached HEAD, and pushes
`<branch>:<branch>` - never `HEAD`. `--branch <name>` exists but is a check, not an
override: it must equal the branch the worktree stands on. `--plan` prints the refusal in
the place the command would be. Exercised against a real repo on `main` (7).

### N1 (MAJOR) - the narrative tolerance could swallow a real code difference. **FIXED.**

The classifier moved to `gen/lib/compare.cjs` and narrowed exactly as asked: a `test(`/`it(`
title whose difference is inside the title, or an `assert...(` line that is identical once
the LAST ARGUMENT is removed - and only when that argument is a plain string literal
closing the call. `stripStrings` is no longer used on assert lines at all. REPLAY-12 is the
control the reviewer asked for, built from a real committed line rather than a made-up one,
and it also checks the other direction (a message-only difference is still prose) so the
narrowing did not gut the cell. The replay still reports exactly one narrative line, and it
is still the F7 title.

### N2 (MAJOR) - the all-25 needle mode is red and the report did not say so. **FIXED.**

Both halves. The switch is renamed `GEN_REPLAY_NEEDLES_AT_POST_HEAD` and is honoured only
when `HEAD` really is `82c98f8` AND the child env is exact; otherwise the cell declines and
prints which condition failed, in the verdict block as well as inline. Report section 5 now
says what is proved (the mechanism, on one child) and what is not.

### N3 - `hash-lines.cjs` would hash a CR. **FIXED.**

Trailing `\r` is stripped and the file is told it was CRLF, because a silent repair on the
one path where a wrong sha costs a chain round is worse than the bug. Measured: the same
line LF and CRLF now hash to `6c753b63...`, and the CRLF run prints the note.

### N4 - the two extra declared paths were not explained in TODO.md. **FIXED.**

The reviewer was right that the report described behaviour the code did not have. A `new`
path standing under no declared child root now carries the `:524 N1` ruling by name, and
REPLAY-4 asserts the wording rather than mere presence (3.5).

### N5 - one silent drop in `buildPackage`. **FIXED, in one line rather than N.**

New `.md` paths are collected and named in ONE TODO entry with the `DECISIONS:519`
slice-deploy reason, not one entry each: the S8 round dropped 13 of them and thirteen
entries would bury the list N7 is about. The promise the file makes - everything it could
not decide is named - is kept.

### N6 - REPLAY-6 compared nothing across the two sides. **FIXED, and it found a defect.**

The six committed-against-committed checks are now `selfCheck`s, counted and printed apart
from the headline, and the cross-side fact the reviewer asked for - the SET of re-pinned
specs, measured from the round's own diff - went RED on its first run and exposed a real
generator defect (3.7). This is the finding that paid for the round.

### N7 - the ORDINAL detector buried the TODO list. **FIXED.**

`fourth` upward and the two family words always fire; `first`/`second`/`third`/`generation`
fire only as whole words (so `second-gate` never matches) and only with something countable
within 24 characters. Measured on the S8 replay: TODO went from 67 entries to 33, the
`second-gate` wall is gone, and every ordinal the report's section 3.2 names is still
listed.

### N8 - a path the generator says the runner will refuse was still declared. **FIXED.**

`continue`, like the `--exclude` branch above it. The TODO wording now says it is not
declared, and the JSON agrees.

### N9 - `--post-head` defaulted to HEAD with nothing checking it. **FIXED.**

`git merge-base --is-ancestor <head> <postHead>`; if it is not a descendant (or Git cannot
answer), that is the FIRST line of TODO.md, named as such, whether or not the runner sha
happens to agree.

### N10 - a5 was marked `[run ]` but wrote nothing. **FIXED.**

a5 is a `hand` stage that names `propose.cjs` as the check to run first and says it writes
nothing by design. It goes back to `run` when the assembly exists.

### N11 - `--dry-run` still printed "started detached". **FIXED.**

It now prints what it did: the `.cmd` was written, nothing was started, and the command it
would have run.
