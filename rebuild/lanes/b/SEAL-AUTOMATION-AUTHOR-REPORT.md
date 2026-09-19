# SEAL-AUTOMATION - author report

**FIX ROUND (R2).** The first two authors are gone; this report is the third author's, and
it keeps their text wherever the evidence still supports it. Every number in it was
re-measured in this worktree in the R2 fix round. Sections 8 and 9 answer the two reviews
finding by finding: **section 9 is "R2 findings: fixed or disputed"** and is the one to
read first. Three of the R2 fixes changed what the generator PRODUCES, not only what it
says: the guard on a3 and b1 (M1), the TODO sentence a `new` path gets (M3), and
`tapPassNeedle`, which was found by running requirement (g) to completion for the first
time and is the finding that paid for this round.

**FIX ROUND (R1), kept for the record.** The R1 fixes are answered in section 8. Every
number there was re-measured after them; where R2 moved a number, section 9 says so.

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
  cross-side facts      786   (generated vs committed - this is the number that means reproduction)
  identical             777
  internal consistency  19    (generated vs generated; NOT counted above)
  self-checks           7     (committed vs committed; NOT counted above)
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

`node --test` says `# pass 19 # fail 0`, and `test/chain-guard.test.cjs` says
`# pass 9 # fail 0`.

The headline has moved three times and every move made it smaller and truer. R1 took it
from "800 compared, 791 identical" to "795 cross-side, 786 identical" by pulling out the 6
committed-against-committed checks. R2 M4 found 19 more that were not cross-side either -
12 in REPLAY-2 (the generated cell against a string literal) and 7 in REPLAY-6 (the
generated spec against the sha of the generated runner) - so they are counted under
`internal consistency`. **R3 n2 found the last two** and both have moved in this round: the
GATE-SUPERSESSION line located in the COMMITTED ledger by the sha the COMMITTED spec
records is a self-check (6 becomes 7), and "the differential child is green here" is a
measurement of THIS tree against the literal 0, which is neither cross-side nor internal -
it is asserted directly now and counted nowhere. So **788/779/19/6 is 786/777/19/7**, and
that is the number this report leads with. The 786 is 774
of the old facts plus the 12 NEW cross-side facts R2 N1 asked for: each of the six
generated ancestor specs compared BYTE FOR BYTE with the committed blob, at the base and
at the post head, with only `tooling.runnerSha256` swapped. All 12 pass.

### What the 786 cross-side facts are made of

- the IDS literal, the NO_REGISTER_IDS literal, CHILD_ROOTS element for element, and the
  `:NNN` the IDS comment cites for the argv gate (that number is **measured** in the
  post-hunk runner, and it came out at the committed value);
- the six generated ancestor specs BYTE FOR BYTE against the committed blobs, at the base
  and at the post head, with only `runnerSha256` swapped (12 facts, R2 N1);
- the five F6/F7 assertions and the CHILD_SPECS line in each of five product cells;
- **672 package facts**: `role`, `pre` and `post` for each of the 224 paths the round
  declared. All 224 roles, all 224 pres, all 224 posts identical;
- 14 package coordinates: lanePackage, packageId, sourceBase, parent.chosen, parent
  artifact + its sha256, parent review + its sha256, parent receiptLedgerLine (found by
  searching the ledger for the POSTFIX-ACCEPTANCE line, not typed), artifact.file,
  artifact.review, authorizations.review, brief.file, brief.sha256;
- the SET of ancestor specs re-pinned (1 cross-side fact, measured from the round's own
  diff). The value in each of the six generated specs is an INTERNAL check now, and the 6
  committed-against-committed checks are self-checks; both are counted apart (R2 M4);
- 25 child names and 25 argv sets;
- the two token-line sha256 rules the generator computes, and the GATE-SUPERSESSION one
  (R3 n2 moved the third check in that cell - "the line is FOUND in the ledger", committed
  against committed - into the self-checks, where it always belonged);
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

Three more arrived in the R2 fix round, and two of them were written RED FIRST against the
reviewed head `8a7da54` before a line of source moved (the red log is in section 9):

- **`test/chain-guard.test.cjs`**, six cells: one per writing stage (a3, b1, b6) exercising
  three refusals and one pass each on a throwaway repository this cell creates and removes;
  one that holds `WRITE_STAGES` to the commands, so a future `run` stage whose command
  merges or pushes and is not in the list fails; one for the `WRITES INTO:` banner.
- **REPLAY-14**, the arity control: a real committed two-argument `assert.equal(expr,
  'IMPLEMENTED')`, mutated, must be a code difference - and then the whole corpus
  (860 assert lines ending in a string across the 13 files `compareFile` compares) measured
  both ways: 144 of them are expected VALUES, the old rule tolerated **all 144**, this one
  tolerates **0**, and all 716 message lines are still prose.
- **REPLAY-16**, the CR control: `tapPassNeedle` must find `# pass N` in CRLF stdout, which
  is the only kind Windows produces, and must return the CR-free form the sealed packages
  carry. This one was written AFTER the defect was measured, not before it; the 25-needle
  run is what found it, and section 9 says so plainly.

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
  needle and names the reason once in `TODO.md`. **It also cannot measure a needle from
  inside `node --test`**, and since this round it refuses that too, by name: see 9.12.
  The replay cell compares needles only from a worktree standing AT the post head
  (`GEN_REPLAY_NEEDLES=1`); otherwise it declines and prints which condition failed. What
  the default run proves is the mechanism, on the engine-files differential, whose needle
  is a sentence and not a `# pass N`.
- The needle measurement is real but slow: all 25 children took **4 minutes 20 seconds**
  measured this round, and `--needle-repeat 2` doubles that in exchange for refusing a
  needle a child does not reproduce.

## 6. How the PM uses it for S9

**The README's "Using it for S9" section is the one to follow**; it carries the ORDER, the
two `released` paths, S9-TODAY-CARRY's four pinned paths, the PASSPHRASE-NORMALIZE
declarations of DECISIONS:543 (B) and the two `pinned-unchanged` files, with which of them
the generator measures by itself. The short version of the order, because it is the part
that costs a chain round if it is wrong: **the S9 runner hunks land FIRST** (`released`
does not exist in `PRODUCT_ROLES` until S9-RELEASE-SPEC hunk H1 is in `b-package.cjs`, and
`:1519` refuses a package that declares it before then), then the generated tree, then the
`RELEASE-FROM-SEAL` and the other token lines, then a re-run with
`--post-head HEAD --stage all` so every post sha and every needle is measured on the tree
that landed. The spec itself is still in flight: DECISIONS:546 judged round 3 REJECT and
dispatched round 4, so nothing here starts until it is accepted.

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

## 9. R2 findings: fixed or disputed

The review is `rebuild/lanes/b/SEAL-AUTOMATION-REVIEW-R2.md`, ACCEPT WITH NOTES on
`be38c02`, with four MAJOR notes M1 to M4 and seven notes. **All eleven are landed. None is
disputed as wrong.** Two numbers in it are corrected, and both corrections make the finding
STRONGER than the reviewer measured. The round also found two defects of its own, in the
one place R2 said had never been exercised (N7), and they are the most important thing in
this report: section 9.12.

### The red-first log

M1, M2 and M3 are behaviours, so the cells were written first and run against the reviewed
head `8a7da54` with the three source files restored from Git. That run is
`%TEMP%\sealgen-fix2-red.log` and it is red in exactly the places R2 named:

```
not ok 1 - GUARD-1  - the guarded set IS every run stage whose command writes
not ok 2 - GUARD-a3 - error: 'Missing expected exception: a3 must refuse main by name'
not ok 3 - GUARD-b1 - error: 'Missing expected exception: b1 must refuse main by name'
not ok 5 - GUARD-2  - error: 'chain.writeTargetFor is not a function'
    (GUARD-b6 PASSED: R1's fix already guarded that stage)
# pass 2  # fail 4

not ok 4 - REPLAY-4
    a path a declared child executes BY NAME must not carry the :524 N1 ruling:
      rebuild/m4/workout/test/s8-supersede-inherited-carriers.test.cjs
      - role:new ... it stands under NO declared child root ... so no declared child
        executes it ... Answer with --exclude to keep it undeclared
not ok 14 - REPLAY-14
    a mutated expected VALUE must be a CODE difference:
      assert.equal(api.product(s, noParent, { product: { [OWN]: { ...pin } } }), 'IMPLEMENTED');
      assert.equal(api.product(s, noParent, { product: { [OWN]: { ...pin } } }), 'MUTATED-IMPLEMENTED');
    expected: 'different'   actual: 'narrative'
# pass 13  # fail 2
```

Both reds are the reviewer's own sentences, reproduced by a cell rather than quoted.

### 9.1 M1 - a3 and b1 MERGE and were not guarded. **FIXED, red first.**

The reviewer was right that the argument made for b6 applies word for word to a3 and b1,
and right that the guard stood three lines away. There is now ONE guard, `writeBranch()`,
and a closed list `WRITE_STAGES = ['a3','b1','b6']`; each stage calls it before its command
is returned, so from a worktree standing on `main`, `rebuild/t2-client-core` or a detached
HEAD **no command comes back at all** - the refusal does. The refusal codes stay
`CHAIN-PUSH-REFUSED` for b6 (word for word what R2 exercised) and `CHAIN-MERGE-REFUSED`
for a3 and b1, so each says what it was about to do.

The banner R2 asked for is there: `WRITES INTO: <branch>` in the stage output and in
`--plan`, printing the refusal in that place when the worktree cannot run the stage.

`test/chain-guard.test.cjs`, on a throwaway repository this cell creates under `mkdtemp`
and removes again - never a worktree of this repo:

```
a3 / b1 / b6 on main                   -> CHAIN-{MERGE,PUSH}-REFUSED ... stands on main
a3 / b1 / b6 on rebuild/t2-client-core -> CHAIN-{MERGE,PUSH}-REFUSED ... stands on rebuild/t2-client-core
a3 / b1 / b6 detached                  -> CHAIN-{MERGE,PUSH}-REFUSED ... HEAD is detached
a3 / b1 on rebuild/b-seal-gen          -> git fetch origin && git merge --no-edit origin/rebuild/t2-client-core
b6 on rebuild/b-seal-gen               -> git push -u origin rebuild/b-seal-gen:rebuild/b-seal-gen
# pass 6  # fail 0
```

GUARD-1 is the one that matters after this round: it walks every `run` stage, calls
`commandFor`, and fails if a stage that is not in `WRITE_STAGES` comes back with a command
that is not on an ALLOW list. The next writing stage someone adds cannot dodge the guard
the way these two did. (The `# pass 6` above is this round's six cells. R3 n6 found that
the check was then a DENY list of six writing verbs and that git is longer than that list;
it is an allow list now, and three more cells have been added since, so the cell says
`# pass 9`. See 10.9, 10.1 and 10.2.)

### 9.2 M2 - the narrative tolerance ignored ARITY. **FIXED, red first, and the number is worse than R2 measured.**

`compare.cjs` now counts the TOP-LEVEL ARGUMENTS of the head `withoutMessage()` returns.
`assert(` and `assert.ok(` need one preceding argument for the last string to be the
message; `assert.equal` and its family need two; anything not in the table answers two,
because that is the answer that keeps a string byte-identical rather than forgiving it.
Strings, template literals and regex literals are skipped whole while counting, since a
comma inside one is not an argument separator and counting it would call an expected value
a message - the one direction this rule must never err in.

**The correction.** R2 measured "assert lines ending in a string literal: 144; mutated last
DATA string still classified narrative: 29". Re-run over the committed blobs at `82c98f8`
of every file `compareFile()` compares, REPLAY-14 measures:

```
assert lines ending in a string literal        860
of those, the last string is an expected VALUE 144
mutated VALUE tolerated by the OLD rule        144
mutated VALUE tolerated by THIS rule             0
of those, the last string is a MESSAGE         716
mutated MESSAGE still prose (the other half)   716
```

R2's 144 is the VALUE class, not the lines ending in a string; and the tolerated count was
not 29 but **all 144**, because the old rule never asked arity at all, so every one of them
was forgiven. The cell measures both rules side by side - the old one is reimplemented in
three lines inside REPLAY-14 - so the comparison is arithmetic and not memory. The finding
was right and its consequence was five times larger than stated.

R2's own conclusion still holds and I re-checked it rather than carrying it: none of the
795 facts was in doubt, because `editRunner` mirrors only comment blocks and the S7-to-S8
substitution set rewrites none of those 144 lines.

### 9.3 M3 - the `:524 N1` sentence was attached to nine paths where it is false. **FIXED, red first.**

This was the finding that could make a human act wrongly, and R2 was right to put it first.
"Stands under a declared child root" is not the test `:524 N1` applied.

**The test now used, and why it is this one.** A path is EXECUTED by a declared child when
either:

1. it is a **target in a declared child's argv**. This is the runner's own test: `proposed()`
   at `b-package.cjs:2800` puts every child argv target into `executionPins`, so the runner
   itself treats exactly this class as executed; or
2. it is **reached by import** from such a target, transitively - the relative
   `require(...)` / `from '...'` / `import('...')` specifiers of the **git blobs at the post
   head**, resolved against the `ls-tree` of that same rev (never a working file, which is
   rule (1) of `measure.cjs`). A cell that imports a module does execute it.

Anything else: no declared child executes it. Only that class gets the `:524 N1` sentence
and the `--exclude` invitation. Class 2 gets a sentence of its own that says a child
reaches it by import, how many hops, through which file, and that `proposed()` does NOT pin
it - because that is a real declaration decision and the PM should not be told it is
automatic.

I used the argv test rather than a name-based or directory-based one because it is the only
one the runner also uses, and I added the import walk because R2 asked for it by name and
because without it three real paths keep a sentence that is false about them. The walk's
limits, stated so a reviewer can attack them: it resolves relative specifiers only, tries
`''`, `.cjs`, `.mjs`, `.js` and the three `index.*` forms in that order, ignores bare
package specifiers, and stops at 8000 files. A dynamic `require(variable)` is invisible to
it, and a path reached only that way would fall to class 3 and be told, wrongly, that no
child executes it. That is the one hole I know of and I have not closed it.

**The eleven paths R2 tabulated, re-measured, and what each is told now** (the cell prints
this table on every run, from `REPORT.json`, so it cannot drift from the code):

```
argv       s8-sup-source-carriers        rebuild/m4/workout/test/s8-supersede-source-carriers.test.cjs
argv       s8-sup-inherited-carriers     rebuild/m4/workout/test/s8-supersede-inherited-carriers.test.cjs
argv       s8-sup-defect-witnesses       rebuild/m4/workout/test/s8-supersede-defect-witnesses.test.cjs
argv       s8-sup-writers-differential   rebuild/m4/workout/test/s8-supersede-writers-differential.test.cjs
argv       s8-sup-second-gate            rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs
argv       engine-files-differential     rebuild/m4/workout/test/s8-engine-files-differential.cjs
import:1   today-17                      rebuild/m3/w7-preview/today/local-source-basis.mjs
import:1   a0-journeys                   rebuild/m4/workout/engine-history.cjs
import:1   d-real-shape                  rebuild/m4/workout/lift-correspondence.cjs
none       -                             rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs
none       -                             rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs
```

Six get "A DECLARED CHILD EXECUTES IT BY NAME ... This is NOT the DECISIONS:524 N1 shape".
Three get the import sentence with the child, the hop count and the importer named. Two -
the two the PM really did rule undeclared at `:524 N1` - get the ruling and the `--exclude`
invitation. That is R2's table, line for line, with the right sentence on each row.

The generator declares nineteen `new` paths in all; the eight R2 did not tabulate stand
under the child root and split 6 argv / 2 import. REPLAY-4 now asserts BOTH ends: every
`none` path carries the ruling, and no path a child executes carries it or is invited to
`--exclude`, and the `none` set equals the extra set exactly.

### 9.4 M4 - 19 of the 795 "cross-side" facts were not cross-side. **FIXED.**

R2's arithmetic was exact: REPLAY-2's 12 (the generated cell against a string literal) and
REPLAY-6's 7 (the generated spec against the sha of the generated runner) are the generator
agreeing with itself. They are now counted by `internal()` and printed under their own
heading, beside `selfCheck()`. That made the headline **788 / 779 / 19 / 6** - R2's
776/767/19/6 plus the 12 new cross-side facts of N1 below. **R3 n2 then found the last two
facts in the wrong bucket and this round moved them (10.5), so the headline the cell
prints, the README states and this report leads with is now 786 cross-side facts, 777
identical, 19 internal consistency checks, 7 self-checks.**

### 9.5 N1 - the ancestor spec FILES were never compared, only one field. **LANDED.**

REPLAY-6 now compares each of the six generated ancestor specs **byte for byte** with the
committed blob, with only `tooling.runnerSha256` swapped, at BOTH ends of the round: the
base (what the generator edited) and the post head (what the round committed). Twelve new
cross-side facts, all identical, so key order and spacing are now held by a cell instead of
by a reviewer's hand. The measurement R2 made by hand is reproduced: clean today, and it
stays clean without a human next round.

### 9.6 N2 - two `sealgen-replay-*` folders left in %TEMP% per run. **LANDED.**

REPLAY-15 removes them, and it removes ONLY the folders `mkdtempSync` returned in this
process - not a glob over `%TEMP%` - so nothing another hand left behind is touched. It
runs last because every cell above reads `OUT`. `test/chain-guard.test.cjs` does the same
with its throwaway repositories.

One honest leftover: **26 `sealgen-replay-*` folders from earlier runs are still in
`%TEMP%`**, two of them this round's first run. I have not deleted them: they are not
files this hand created, and the lane rule is that you do not delete what you did not
create. The PM can remove them in one sweep; nothing new will be added.

### 9.7 N3 - `--released` emits a role the runner refuses TODAY. **LANDED.**

The TODO entry a released path writes now carries the clause R2 dictated, near enough word
for word: the role does not exist in the runner until S9-RELEASE-SPEC hunk H1 lands,
`PRODUCT_ROLES` at `b-package.cjs:351` is the five-member list, `:1519` refuses anything
else with `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY`, and a package declaring the role
before the hunk refuses there. The README's new "Using it for S9" section makes the same
point as an ORDER: hunks first, generated tree second, token line third, re-measure fourth.

### 9.8 N4 - `--plan` printed `$ "node" rebuild/...`. **LANDED.**

`pretty()` strips the quotes with the path. Measured in the `--plan` output of this round:
`$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9`.

### 9.9 N5 - the README declined the number the ticket asked for. **LANDED, with its weakest input named.**

Refusing twice was the wrong answer. The README now gives **about 1.5 hours saved per
reseal child** and shows the arithmetic: 2.5 h of preparation, of which the six mechanical
commits of the round's eight are about three quarters, of which the generator does 777 of
786 facts, leaving roughly an hour of reading, prose and judgment - against about 20
seconds of machine time, plus about 4 minutes 20 when `--stage all` measures 25 needles
(timed this round). The weakest input is the 2.5 h: it is the PM's recollection and no
round has been timed. The table says so, and says that timing the S9 preparation turns it
into arithmetic. **R3 n5 was right that the table did not close**, and it now carries the
missing step as a row of its own: 2.5 x 0.75 x 777/786 is 1.85 h, and the 33 TODO entries a
human reads and answers are the roughly 20 minutes between 1.85 h and 1.5 h. That
allowance is an estimate too and the table says so, so there are now two weak inputs named
instead of one hidden.

### 9.10 N6 - `pinned-unchanged` is never proposed. **LANDED, and it is free.**

When a path would be `new` but `pre === post` and it IS a declared child's argv target -
which is the runner's own test for the fifth role (`b-package.cjs:341-351`, `:1525-1528`,
`:1552`, `:1947-1949`, and `:1995` says the case arrives by itself) - the generator now
declares `pinned-unchanged` and keeps the TODO line, naming the child. When no declared
child executes it, the R1 N8 refusal stands and the entry says why `pinned-unchanged` does
not apply either, which it did not say before.

Measured before the change and after: **no path in the S8 round takes this branch**, so the
replay is byte-for-byte unaffected and the 224 declared roles are unchanged. The first
package this can move is S9, where `gym-model.mjs` and `checkin-app.mjs` are exactly this
shape - and the generator will NOT propose the role for those two, because neither is a
child argv target. The README says so in the S9 table, so the PM does not discover it at
the wrong moment.

### 9.11 N7 - requirement (g) has never run to completion anywhere. **LANDED. It has now, and it found two defects.**

This is 9.12.

### 9.12 THE 25-NEEDLE RUN, and the two defects it found

R2 N7 said the needle path had never executed: not the `exact: true` branch, not the tap
capture, not `--needle-repeat`, not the all-25 comparison. It has now. The PM re-pointed
this worktree's three `node_modules` junctions at live sources at 02:38, so a whole tree
was available for the first time.

**How it was run.** `git worktree add --detach %TEMP%\sealgen-fix2-wt 82c98f8` from this
worktree; the three `node_modules` junctions mirrored there (root,
`rebuild/m3/w5`, `rebuild/m3/w6`) exactly as this worktree's are; this `gen/` folder copied
in, because it does not exist at `82c98f8`; no private junction, nothing under
`rebuild/conform/private` read or created. Removed with `git worktree remove` at the end.

**R3 n8 corrects one sentence of this paragraph and the correction is upheld.** It used to
say `%TEMP%\earned-s5\rebuild\conform\engines` "held nothing to copy". It holds three
files, and I listed them again in this round rather than repeating the claim:
`build-engines.mjs` (3,791 bytes), `engine-main.cjs` (813,696) and `engine-old.cjs`
(792,806) - exactly what R3 measured. What is true, and what the sentence was reaching for,
is that **no child asked for them**: `Reference.create(root)` builds its own two bundles
into a scratch directory and succeeded in the scratch worktree without that folder. The
substance stands; the sentence was wrong, and this report is the document the next hand
will believe.

**Defect one: `tapPassNeedle` could not see a `# pass N` line in CRLF stdout.** It was
`/^# pass (\d+)$/m`; `$` in multiline mode matches before the `\n` with the `\r` still
standing, and Windows stdout is CRLF. Every `node --test` child therefore came back with no
needle. The one that came through was the engine-files differential, whose needle is a
sentence matched by a prefix. Fixed to `/^# pass (\d+)[ \t\r]*$/m`, returning the CR-free
form the sealed packages carry and `children()` matches (its predicate is anchored only at
the start of the line). REPLAY-16 is the control, both line endings.

**Defect two, and it is the worse one: a needle measured from inside `node --test` is not a
needle.** `node --test` sets `NODE_TEST_CONTEXT=child-v8` in the process running a test
file; `laws()` copies `process.env`; a `node --test` grandchild that inherits it reports
over the **v8 serializer** instead of TAP. Measured, in the S8 tree, on one real child:

```
NODE_TEST_CONTEXT in this process: "child-v8"
childEnv exact: true ; NODE_TEST_CONTEXT in child env: "child-v8"
status 0   outlen 0   needle null
WITHOUT NODE_TEST_CONTEXT: status 0   outlen 1295   needle "# pass 3"
```

Empty stdout, **exit status 0**, no needle - and a child that FAILED would look exactly the
same, so "the child is green" could not be read from the status either. This is the shape
R1 B1 was about, one layer further out, and it would have reached a sealed package as a
blank needle at best.

Two changes, belt and braces:

- `childEnv()` now REFUSES when `NODE_TEST_CONTEXT` is set: `exact: false`, with the reason
  named, and `measureChildren` records nothing, as it does for any inexact env. The env is
  NOT silently repaired, because `laws()` would not have built a repaired env either.
  `referenceOk` is a separate field, so a caller can still ask whether the reference
  bundles built. REPLAY-13 asserts the refusal fires, by name, every run.
- the replay cell spawns the GENERATOR with `NODE_TEST_CONTEXT` deleted, which makes that
  process an ordinary one - the kind the PM runs - so its own `childEnv()` is exact and its
  children report TAP. The one direct `runChild` in REPLAY-7 does the same.

**The 25-needle result, measured at `82c98f8` with a whole `node_modules`:**

```
measured 25 of 25, in 4 min 20 s (3:04:43 to 3:09:03)
SAME 25   DIFFERENT 0   of 25
  today-17 # pass 682          s8-sup-source-carriers # pass 4      d-import-retract # pass 13
  measure-hermetic # pass 11   s8-sup-inherited-carriers # pass 3   d-admission-swap # pass 4
  s4-real-day # pass 15        s8-sup-defect-witnesses # pass 3     d-replay-measure # pass 9
  a0-journeys # pass 23        s8-sup-writers-differential # pass 3 d-capture-start # pass 14
  d-plan-edit # pass 90        s8-sup-second-gate # pass 3          food-live-save # pass 6
  m4-import # pass 62          w7-import # pass 35                  w6-host-seams # pass 9
  m4-import-production # pass 28  w6-local-source # pass 26         d-replay-all # pass 28
  b-lom # pass 30              d-port-admission # pass 35           d-real-shape # pass 56
  engine-files-differential "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) ..."
```

**Every one of the 25 measured needles equals the one the S8 round committed.** That is the
first time requirement (g) has produced a result of any kind, and it agrees with the seal.

A third, smaller thing the same run found: REPLAY-8 read `rebuild/DECISIONS.md` at `HEAD`,
and in this mode HEAD stands AT `82c98f8`, which PREDATES the three S8 token lines at
`:525` to `:527`. The check went red for the right reason in the wrong place. It now reads
the ledger of record - the chain branch, the same ref the runner fixes as `CHAIN_REF` at
`b-package.cjs:189` - falling back to HEAD, and prints which rev answered.

### 9.13 The two runs that stood behind the R2 fix round

These are the R2 fix round's own runs, at its own head `c4ebd318`, kept as that round's
record. **They are not this round's numbers**: R3 n2 moved two facts and this round added
six cells, so both headlines and both pass counts have changed. The runs that stand behind
the head this report describes are in **10.15**, and the headline everywhere else in this
report and in the README is the one measured there.

```
DEFAULT MODE, %TEMP%\earned-sealgen on rebuild/b-seal-gen at c4ebd318
  chain-guard.test.cjs                        # pass 6   # fail 0
  replay-s8.test.cjs                          # pass 16  # fail 0
  cross-side facts 788   identical 779   internal 19   self-checks 6   UNEXPLAINED 0
  byte-identical files 4   prose-only 9   narrative 1   ordering 2
  needles: not compared (HEAD is not the post head), and the cell says so twice

25-NEEDLE MODE, %TEMP%\sealgen-fix2-wt detached at 82c98f8, GEN_REPLAY_NEEDLES=1
  replay-s8.test.cjs                          # pass 16  # fail 0   duration_ms 294254
  cross-side facts 811   identical 802   internal 19   self-checks 6   UNEXPLAINED 0
  needles: compared, 25 of 25 measured, 25 of 25 identical to the committed ones
  the GATE-SUPERSESSION line was found in the ledger at origin/rebuild/t2-client-core
```

811 is 788 minus the 2 facts the declined branch contributes plus the 25 needles. The nine
differences are the same nine in both modes: comment prose in nine files, one F7 title, two
orderings the runner does not read.

### 9.14 What is still open, for the next reviewer to attack

1. The import walk of 9.3 resolves relative specifiers only. A path reached solely through
   a dynamic `require(variable)` would be told no child executes it. I know of no such path
   in this tree and I did not search exhaustively for one.
   **CLOSED by this round as G-F13 (10.13):** the walk still follows literal specifiers
   only - that is a property of reading source - but it now RECORDS every specifier it
   could not follow and names it beside every path it calls unexecuted, so the blind spot
   is printed instead of being known only to this paragraph. Measured on the S8 post head:
   20 of them.
2. `--needle-repeat 2` still has not run. The 25-needle run used the default of 1; two runs
   of 25 children is about nine minutes and the PM should spend them on the run that feeds
   the sealed S9 package, not on a replay of S8.
   **RUN by R3, section 7:** fifty child runs from its own scratch worktree at `82c98f8`,
   25 of 25 reproduced and 25 of 25 still equal to the committed needle. It is what found
   n9 (10.12), which this round fixed.
3. The `exact: true` branch of `childEnv()` now has a witness, but only on Windows. The
   CRLF defect of 9.12 could not have been found on Linux, and the reverse may also be
   true: nothing here has measured a needle on the ubuntu runner.
4. 26 `sealgen-replay-*` folders from earlier runs remain in `%TEMP%` (9.6).
5. `seal-chain.cjs` stages a3 and b1 are guarded but have still never been RUN. What is
   exercised is the guard and the command they would run, not the merge.

## 10. R3 notes and the PM's final read: fixed or disputed

**FIX ROUND (R3 + the PM's final read).** The third author is gone; this section is the
fourth author's. Review R3 (`SEAL-AUTOMATION-REVIEW-R3.md`) is ACCEPT with nine notes n1
to n9. The PM then read `seal-chain.cjs` whole and every write and spawn site in `gen/`
himself and accepted the generator FOR USE on condition of this round, with three findings
of his own: G-F1, G-F2 and G-F3. The author's own open hole 9.14 item 1 is answered here
too, as G-F13. **Nothing in this round is disputed.** Every one of the thirteen items is
fixed or corrected, and none of them moves a fact in a package: the S8 replay produces the
same 224 roles, the same 224 pres and the same 224 posts as before it.

Every guard in this section was **RED FIRST**, and the red is quoted from a run, not
described.

### 10.0 The red-first log

A throwaway repository under `%TEMP%\sealfix-red` (git init, one seed commit, three
branches, `gen/` copied in at its real relative depth, its own `TEMP` inside it), the
UNFIXED files, `--dry-run` throughout so nothing could start. Removed afterwards.

```
G-F1, hostile --id, stage a1, --dry-run: EXIT 0, and the .cmd body it wrote:
  "...\node.exe" rebuild/lanes/b/tooling/b-package.cjs --ci --package S9 & echo PWNED-BY-ARGV

G-F1, hostile --tip-ref, stage a3, --dry-run, standing on rebuild/b-seal-gen:
  WRITES INTO: rebuild/b-seal-gen          <- the banner, and it is TRUE of the merge
  git fetch origin && git merge --no-edit x & git push origin HEAD:main
                                           <- the .cmd body, and the push was never shown
                                              to writeBranch() at all

G-F2: paths(a1).cmd  ...\sealgen-chain-a1.cmd    arity of paths(): 1
      (S9 and S10 get the same file, and --poll of one reads the other's DONE)

G-F3: new-child.cjs --repo <throwaway> --out <throwaway>
      GEN FAILED: Cannot read properties of null (reading 'toString')
      - i.e. it walked past --out without a word and died measuring, which is exactly
        what it would NOT have done with a real repository there
```

**And the same thing again, the other way round, by me:** a throwaway worktree of this
repository detached at the REVIEWED head `0730091f` (unfixed sources), with only the NEW
cells copied over it, so every cell of this round is asked its question against the code as
it stood. The worktree was removed afterwards and the working tree was clean after it.

```
replay-s8.test.cjs      # pass 15   # fail 4
  not ok REPLAY-14  assert.fail(actual, expected, message) needs two arguments in front
                    of the message            expected 2  actual 0          (n1)
  not ok REPLAY-17  gen.needleDisagreement is not a function                (n9)
  not ok REPLAY-18  an --out inside the tree must be refused: "."
                    expected 1  actual 0  - i.e. THE UNFIXED GENERATOR EXITED 0 AND
                    WROTE THE GENERATED TREE INTO THE WORKTREE ROOT, 32 seconds of it
                    (G-F3: this is the defect, performed)
  not ok REPLAY-19  and the walk RECORDS what it could not follow, by file and line:
                    undefined                                               (G-F13)

chain-guard.test.cjs    # pass 0    # fail 1
  the file does not even load: RUNNER_CI binds to chain.RUNNER, which the reviewed head
  does not export - TypeError: Cannot read properties of undefined (reading 'replace')
```

Because a file that cannot load says nothing about which cell fails, I ran the chain guard
a second time from a copy of `gen/` with `seal-chain.cjs` restored from the reviewed head
and, in the RED COPY of the cell only, `chain.RUNNER` written out as the literal path. That
copy is an instrument and nothing in it is shipped:

```
chain-guard.test.cjs    # pass 6    # fail 3
  ok     GUARD-1, GUARD-a3, GUARD-b1, GUARD-b6, GUARD-2, GUARD-3
         (the R2 round's guards stood, and this round did not disturb them)
  not ok GUARD-4  Cannot read properties of undefined (reading 'test')
                  - chain.ID_SHAPE does not exist at the reviewed head       (G-F1)
  not ok GUARD-5  the id is in the name: ...\sealgen-chain-S9.cmd
                  - the ID had become the KEY, which is the collision itself (G-F2)
  not ok GUARD-6  a hostile --id must exit 1: ... it would run:
                  node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9 & echo
                  PWNED-BY-ARGV                                              (G-F1, shipped)
```

**R3 n6's red is not a cell**, because the predicate it is about lived in the cell itself.
I measured it the only way there is, by running the old deny-list regexp over the shapes
the allow list refuses:

```
OLD SAYS READ-ONLY  git pull --ff-only origin rebuild/t2-client-core
OLD SAYS READ-ONLY  git cherry-pick abc1234
OLD SAYS READ-ONLY  git update-ref refs/heads/main HEAD
OLD SAYS READ-ONLY  git worktree add /tmp/x HEAD
OLD SAYS READ-ONLY  git am < patch        git apply patch
OLD SAYS READ-ONLY  git stash             git clean -fd
```

Eight shapes, eight of them writing, and the guard that was offered as the reason the next
writing stage could not dodge `writeBranch()` called every one of them read-only.

### 10.1 G-F1 - an argument could become a second command. **FIXED, red first.**

`seal-chain.cjs` builds a command line by string concatenation and writes it into a `.cmd`
that `cmd.exe` runs. Three values reach that string and not one of them was checked: `--id`
into `--ci --package <id>` (a1/a4/a6), `--tip-ref` into `git merge --no-edit <tip>`
(a3/b1), and the branch Git resolves into `git push -u origin <b>:<b>` (b6). The red log
above is the whole argument: with a hostile `--tip-ref`, the banner printed
`WRITES INTO: rebuild/b-seal-gen` - `writeBranch()` had been asked and had answered
honestly about the merge it was shown - and the file underneath it carried a second command
pushing `HEAD` to `main`. Every guard this folder has built over three rounds was standing,
and every one of them was looking the other way.

The fix is three shapes and one error code:

- `--id` must match `/^[A-Za-z0-9-]{1,16}$/`;
- `--tip-ref` and `--branch` must match `/^[A-Za-z0-9._/-]{1,200}$/`, with no `..` (the
  revision range syntax) and no leading `-` (how an argument becomes an option, e.g.
  `--upload-pack=`);
- the branch `currentBranch()` resolves must match the same ref shape, checked inside
  `writeBranch()` BEFORE the name is compared with `main` or the chain branch, because Git
  permits `&` in a ref name and `cmd.exe` reads it as a separator.

Anything else is `CHAIN-ARGV-SHAPE` naming the argument, and **nothing is built, nothing is
written and nothing is started**. The check runs in three places, deliberately: `argvShape()`
at the top of `main()` before `--plan` prints or a stage is looked up, `commandFor()` where
the concatenation happens, and `paths()` where the id becomes a file name. One more detail
is in the code and not in the ticket: `$` in a JavaScript regexp matches before a TRAILING
newline, so `"S9\n"` would have satisfied the id shape and carried a line break - a command
separator - into a `.cmd` body. Both checks refuse CR and LF explicitly.

**Carried, not narrowed: `-S9` satisfies the shape the PM fixed**, because a package id may
contain a hyphen (`B-NTC` does) and a regexp cannot tell a leading one from an interior
one. It cannot start a second command, which is what this guard is for. GUARD-4 asserts
that fact rather than hiding it, so the next reader sees the edge instead of discovering it.

GUARD-4 (in process, 13 hostile ids, 11 hostile tip-refs, a branch named `lane&echo-pwned`)
and GUARD-6 (the shipped script as a child process) hold it. Both go red against the
reviewed head: the first on `Missing expected exception`, the second on `EXIT 0` with the
ampersand in the `.cmd` body.

### 10.2 G-F2 - two chains on one PC shared a log and a .done. **FIXED, red first.**

`paths(key)` was `%TEMP%\sealgen-chain-<key>.{cmd,log,done}`. S9 and S10 will overlap on
this PC, and with that name they share `sealgen-chain-a1.done`: `--poll` of one chain reads
the other's DONE, prints the other's log, and says DONE about a stage that is still
running - or worse, about a stage that failed. The red log above is `arity of paths(): 1`,
which is the whole defect in one number.

It is now `paths(id, key)` -> `sealgen-chain-<ID>-<key>.{cmd,log,done}`, and the id has
already been through `checkId()`, so nothing that could not be a file name reaches
`path.join`. `startStage`, the poll branch of `main()` and the `--plan` footer all print
the same name. GUARD-5 proves two ids do not collide and that `paths('S9 & echo x', 'a1')`
refuses; it goes red against the reviewed head because `paths('S9','a1')` and
`paths('S10','a1')` returned the same three paths there.

### 10.3 G-F3 - "nothing here writes into the tree" was a sentence, not a guard. **FIXED, red first.**

`run()` took `path.resolve(o.out)` and wrote there. `--out .` from the repository root
overwrites the working `b-package.cjs` with the generated one; `--out rebuild` scatters a
generated tree over the real one. The header of the file has promised the opposite since
the first round.

`outMustBeOutsideTheTree(root, out)` refuses `GEN-OUT-INSIDE-THE-TREE` when `--out`
resolves inside the repository root. Three details that are not decoration:

- **real paths**, because a junction or symlink pointing into the tree is how every
  worktree on this PC has its `node_modules`, and `path.resolve` alone would walk straight
  past one;
- the real path of **the nearest existing ancestor** with the rest put back, because an
  `--out` folder usually does not exist yet and `realpathSync` on it would throw;
- **case-insensitively on win32 only**, because `C:\X` and `c:\x` are one folder there and
  two folders on the ubuntu runner.

It is called at the top of `main()` - before a rev is parsed, before a blob is read, before
a child is run - and again at the head of `run()`, which is the line R3's reader was looking
at, so a future caller of `run()` cannot go round it. REPLAY-18 holds it with five `--out`
values inside the tree plus one inside a folder that is not a git repository at all (which
proves the refusal arrives BEFORE the first `git` call), and asserts that nothing was
written. Its red form was exercised in a throwaway repository and never here, for the
obvious reason: without the guard, that command writes into this tree.

### 10.4 n1 - `MESSAGE_ARITY.fail` was 0. **FIXED.**

R3 is right, and right about why it matters more than the number: it was the one entry in
the table that erred in the FORGIVING direction, which the file's own comment says is the
direction the rule must never err in. `assert.fail` has two signatures and the legacy one,
`fail(actual, expected, message, operator)`, puts an expected VALUE second, so with
`need = 0` any last string passed and `assert.fail('x', 'MUTATED-y')` was classified
`narrative`. It is 2 now. Four lines in REPLAY-14 hold it - the table entry, the mutated
legacy call being `different`, `isMessageArg` answering false for one argument, and a
three-argument `fail` whose message really is the message still being `narrative` - plus a
standing check that **no** entry of the table is below 1, so the forgiving shape cannot
come back through another family. Measured: zero lines of the corpus `compareFile()`
compares are in that shape at `82c98f8`, so no number moved, which is exactly why it needed
a cell rather than a measurement.

### 10.5 n2 - two facts were still in the wrong bucket. **FIXED, and the headline is re-measured.**

Both of R3's are real and both have moved:

- `replay-s8.test.cjs`, the GATE-SUPERSESSION line "is found in the ledger by its sha256
  alone": `gate` is a line of the COMMITTED ledger, located by a sha the COMMITTED spec
  records. Committed against committed is a `selfCheck` by this cell's own definition. It
  is one now (6 becomes 7). The line beside it - this generator's own hashing rule against
  the sha the sealed package carries - is genuinely cross-side and stays a `fact`.
- "the differential child is green here", `run.status` against the literal `0`: a
  measurement of THIS tree, neither generated-against-committed nor
  generated-against-generated. It belongs in no bucket the headline counts, so it is an
  ordinary `assert.equal` now, which is stricter than counting it was (it fails its own
  cell by name instead of arriving in REPLAY-10's unexplained list), and it reads as what
  it is: the precondition for the needle line under it. The neighbouring line - the
  committed needle standing at the head of a line of a run this tree produced - is
  cross-side and R3 said to leave it; it is left.

**R3 predicted 786/19/7 and 810/19/7. I measured, I did not copy**, and section 10.15 has
both runs. Default mode came out at exactly **786 / 777 / 19 / 7**, and the headline is
restated everywhere it appears: section 2 of this report and its "what the facts are made
of" list, section 9.4, section 9.9, and the README in three places (the proof paragraph,
the controls list and the time table).

### 10.6 n3 - the README said `childEnv()` answers `exact: true` here. **FIXED.**

R3 is right and it is the note I would have put first too: the README is the file the PM
reads before S9, and that paragraph was the one sentence in this folder that could talk
someone into trusting a needle measured from inside a test. It was R1-era text left
standing after the 9.12 fix made it false. The shipped cell asserts the opposite on every
run:

```
assert.equal(ce.inTestRunner, true, 'this cell runs under node --test, so childEnv must see it');
assert.equal(ce.exact, false, 'and must refuse, whatever the reference build did');
```

The paragraph now says what the code does and splits the two halves that were run
together. `referenceOk` IS true in `%TEMP%\earned-sealgen` since the PM re-pointed the
three junctions, so the pinned reference bundles build and `ENGINE_MAIN` and `ENGINE_OLD`
are set where `children()` sets them. `exact` is a different question and it can never be
true inside `node --test`, because `NODE_TEST_CONTEXT` is set in that process and every
child inherits it: such a child reports over the v8 serializer, prints nothing on stdout
and still exits 0, so a failing child is indistinguishable from a passing one. The README
quotes the two assertions, says the refusal fires by name on every run, and ends with the
instruction that follows from it: **run the generator from a shell, never from inside a
cell.** The process that does measure the needles is the generator, which the replay cell
spawns with `NODE_TEST_CONTEXT` deleted.

### 10.7 n4 - the decline message named the long switch only. **FIXED.**

One clause in one string, and it is the string a PM reads when the comparison declines.
Both spellings work and both are named now, in the decline and in the "HEAD is not the post
head" message beside it:

```
needles: NOT compared against the round. To compare all 25: check a worktree out AT
82c98f8 and set GEN_REPLAY_NEEDLES=1 (or the longer GEN_REPLAY_NEEDLES_AT_POST_HEAD=1,
which says what it requires - either spelling works).
```

The short name is the one the ticket and the PM use; the long one says what it requires,
which is why it is kept. Neither weakens the two conditions the comparison stands on.

### 10.8 n5 - the 1.5 hours did not follow from its own table. **FIXED.**

R3's arithmetic is right: 2.5 h times about three quarters is 1.9 h, and 777/786 of that is
1.85 h, not 1.5 h. The missing step is the one the row above it mentions and the sum does
not carry: **the 33 TODO entries a human reads and answers.** That work is judgment the
generator CREATES rather than removes, and hiding it made the table look like arithmetic
that closed when it did not.

The table now has the step as a row of its own with a number on it: 1.85 h before any
allowance, roughly 20 minutes of reading and answering `TODO.md`, and 1.5 h as the
difference. The README also now says plainly that the number has **two** weak inputs
rather than one: the 2.5 h is the PM's recollection, and the 20-minute allowance is an
estimate. The two inputs that ARE measured are the fact count and the 20 seconds. If the
PM times the S9 preparation, and times the TODO reading separately, both estimates stop
being estimates.

### 10.9 n6 - GUARD-1 was a list of the bad things. **FIXED.**

The check was `/\b(merge|push|commit|rebase|reset|checkout)\b/` over the command of every
`run` stage outside `WRITE_STAGES`, and it was offered as the reason the next writing stage
could not dodge the guard. R3 is right that git is longer than that list: `pull`, `am`,
`apply`, `cherry-pick`, `revert`, `stash`, `restore`, `clean`, `tag`, `update-ref`,
`branch -f` and `worktree add` were all missing, and `git pull --ff-only origin <tip>`
would have passed it and written the worktree it stands in.

It is an ALLOW list now. A `run` stage outside `WRITE_STAGES` may be the runner's own
`--ci` command, or a git command whose VERB is one of `fetch`, `diff`, `log`, `show`,
`status`, `rev-parse`, `ls-tree`, `cat-file`. Anything else fails the cell. `fetch` is on
the list because it writes refs under `refs/remotes` and never the worktree; it is the one
verb there that writes anything at all, and the comment in the cell says so. The command is
split on the shell's own separators first, so a second command smuggled in behind `&&`,
`&`, `|` or `;` is judged on its own, which is where this note meets G-F1.

Nine assertions hold the list to its own claim, and every one of them is a shape the old
regex passed: `git pull --ff-only`, `git cherry-pick`, `git update-ref`, `git worktree
add`, a merge behind `&&`, a push behind `&`, plus the three that must stay allowed
(`git -c core.pager=cat diff --stat` which is stage b4, `git fetch origin`, and the
runner's `--ci` command as `commandFor` really builds it).

### 10.10 n7 - the guard cell tested a seam the command line does not use. **FIXED.**

Every cell before this round passed `{root: <throwaway>}` to `commandFor`, and `main()`
parses no `--root` and no `--repo`: in real use `writeBranch` is handed `REPO`, resolved
from `__dirname`, which is also the folder `startStage` does `cd /d` into. So the cells
proved the guard and not the wiring, and R3 closed that gap by hand, which means it was
closed for exactly as long as R3's session lasted.

**GUARD-6 closes it with a cell.** `gen/` is copied into a throwaway repository at its real
relative depth `rebuild/lanes/b/tooling/gen/`, and the shipped `seal-chain.cjs` is run as
an ordinary CHILD PROCESS from that repository, with its own `TEMP` and with
`NODE_TEST_CONTEXT` deleted from its env. What is asserted is what a PM would see: the exit
status, the refusal on stderr, and **the bytes of the `.cmd` file**. On `main` the three
writing stages exit 1 and name the branch; detached they exit 1 and say HEAD is detached,
and no stage file is written at all; a hostile `--id` and a hostile `--tip-ref` exit 1 with
`CHAIN-ARGV-SHAPE` and write no stage file; and on the lane branch a3 exits 0, the banner
reads `WRITES INTO: rebuild/b-seal-gen`, exactly one stage file exists and it is named
`sealgen-chain-S9-a3.cmd`, its body carries the merge command and only the merge command,
and it cds into the repository resolved from `__dirname`. That last assertion is the
wiring, and it is now held by a cell.

### 10.11 n8 - one sentence of this report was not true of the disk. **CORRECTED.**

Section 9.12 said `%TEMP%\earned-s5\rebuild\conform\engines` "held nothing to copy". It
holds three files. R3 listed them and I listed them again rather than repeating a claim:
`build-engines.mjs`, `engine-main.cjs` (813,696 bytes) and `engine-old.cjs` (792,806
bytes). The substance the sentence was reaching for is true and R3 confirmed it
independently: **no child asked for them**, because `Reference.create(root)` builds its own
two bundles into a scratch directory and succeeded in the scratch worktree without that
folder. Only the sentence was wrong. It is corrected in 9.12 with the file sizes in it,
because this report is the document the next hand will believe.

### 10.12 n9 - `--needle-repeat` agreed with itself by PREFIX. **FIXED, red first.**

This is the note I would put second after G-F1, and R3 puts it in the right place: before
the run that feeds the sealed S9 package, since that is the only run the README asks
`--needle-repeat 2` for.

Run 1 produces the needle; runs 2 and 3 were checked with
`M.needleStandsAtLineStart(x.out, needle)`, which is `^` plus the escaped needle in
multiline mode - a PREFIX match at a line start, because that is `children()`'s own
predicate. `^# pass 4` matches `# pass 42`. So a child printing `# pass 4` on run 1 and
`# pass 42` on run 2 was recorded "reproduced over 2 runs", and a drifting pass count is
the exact flake the switch exists to catch. 4 to 42, 3 to 30-39 and 1 to 1x are the shapes
where it drifts invisibly.

`needleDisagreement(runs, needle)` now answers the reproduction question on its own terms.
Where either run printed a tap summary, the summaries are compared for **exact equality**
of `M.tapPassNeedle(x.out)`; where neither did - the sentence needles, which never had
anything but the prefix - the prefix predicate answers, because that is all a sentence
needle has. A non-zero exit is still a disagreement. The message names the run that
disagreed and prints both summaries, so `NOT REPRODUCED` says what it saw.

**The prefix predicate stays where it belongs.** It is right for the question `children()`
asks - does this child's stdout carry the needle the package pinned - and REPLAY-17 asserts

that it does match `# pass 42` against `# pass 4` - the defect itself, stated with no help
from anything this round added - before asserting that the reproduction check no longer
does. The fixture pair is R3's own, spelled with CRLF because that is the only kind of
stdout Windows makes.

### 10.13 G-F13 - the import walk's blind spot is now printed, not just known. **FIXED.**

This was my predecessor's own open item (9.14 item 1) and the PM asked for it by name.
`executionClosure()` follows string-literal relative specifiers. A module reached only
through `require(name)` or `await import(spec)` cannot be followed from source, so it is
invisible to the walk, and its path then lands in class (3) - "no declared child executes
it" - which is the one class that carries the `:524 N1` ruling and the `--exclude`
invitation. That invitation is a real decision by the PM. **It must never be offered on a
blind spot without saying the blind spot is there.**

The walk now records every non-literal specifier it MEETS, by file and line, and three
things carry the record:

- `TODO.md`: every class (3) entry ends either with
  `DYNAMIC-SPECIFIER-SEEN <file>:<line>` for each one (up to eight named, the rest
  counted) and the sentence that a path reached only through one of those still lands in
  this class, so "no declared child executes it" is what the walk could see and not what
  is certain; or, when there were none, with the statement that this class has no blind
  spot on this post head because every specifier the walk saw was a string literal;
- `REPORT.json`: `dynamicSpecifiers`, the whole list, so it is a file a reader can open;
- the README, in the paragraph that explains the three classes.

It is deliberately a NOTE and not a refusal. The walk is still right about every path it
did reach, and a generator that refused here would refuse on every round for a condition
no round can remove.

**Measured on the S8 post head: 20 non-literal specifiers.** The cell prints the first
eight and `REPORT.json` carries all twenty. The eight it printed in both of my runs:

```
rebuild/m3/w7-preview/today/test/copy.test.mjs:380
rebuild/m3/w7-preview/today/test/package.test.cjs:22, :24, :221
rebuild/m3/w7-preview/today/test/setup.test.mjs:440
rebuild/m4/workout/test/s8-supersede-defect-witnesses.test.cjs:72
rebuild/m4/workout/test/s8-supersede-writers-differential.test.cjs:72
rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs:69
```

Since there were twenty, both `none` paths in the S8 replay carry the named blind spot,
and REPLAY-19 asserts that; it also asserts the other end, that no path a child DOES
execute is told it is a blind spot. The two-file fixture in a throwaway repository holds
the mechanism itself: `a.cjs` requiring `b.cjs` through a variable leaves `b.cjs` unreached
and records `a.cjs:3`, and the same pair with a literal specifier reaches `b.cjs` in one
hop and records nothing.

### 10.14 CARRIED, NOT THIS ROUND'S: the SEALED RUNNER matches a needle by prefix too

Saying this once so it is not lost with this round's paperwork. R3 n9 is about
`--needle-repeat` inside this generator, and 10.12 fixes it there. **The same observation
is true of the sealed runner's own predicate**: `children()` matches a pinned needle
against a child's stdout by looking for it at the head of a line, which is a PREFIX match,
so a package pinning `# pass 4` is satisfied by a child that prints `# pass 42`.

For the generator that was a defect, because the question `--needle-repeat` asks is
"do two runs AGREE", and a prefix cannot answer it. For the runner it is a different
question - "does this child still print what the seal pinned" - and a prefix match there is
a deliberate, older decision with its own history, its own laws and its own reviews. It is
also the predicate the 25 needles of S8 were measured and accepted against.

**Nothing in `gen/` changes it and nothing in this round proposes to.** It is a runner
question for the PM and for lane B's S9 round, and it is recorded here only so that the
next reader of n9 does not have to rediscover that the note reaches one step further than
the folder it was written about. `REPLAY-17` asserts the prefix behaviour of
`needleStandsAtLineStart` as a standing fact rather than hiding it, which is the most this
lane should do about it.

### 10.15 The two runs that stand behind THIS head, both measured by me

Neither number below is copied from R3's prediction or from my predecessor's log. Both are
runs I started and read.

**DEFAULT MODE**, `%TEMP%\earned-sealgen` on `rebuild/b-seal-gen`, `MEASURED_TEST_NOW` and
`TZ` each on its own line of a .cmd:

```
chain-guard.test.cjs    # pass 9    # fail 0    duration_ms 4747.2
replay-s8.test.cjs      # pass 19   # fail 0    duration_ms 69625.6
  cross-side facts      786     identical 777
  internal consistency  19      self-checks 7
  byte-identical files  4    prose-only 9    narrative 1    ordering 2
  UNEXPLAINED           0
  non-literal specifiers the S8 import walk met: 20
  needles: not compared (HEAD is not the post head), and the cell says so twice
  removed 4 scratch folder(s) this run created
```

**786 / 777 / 19 / 7**, which is R3 n2's prediction of 786/19/7 with the identical count
beside it. First run, no re-run needed. The nine differences are the same nine as before
this round: comment prose in nine files, one F7 test title, two orderings the runner does
not read. No fact in a package moved: the 224 declared paths, their roles and both shas are
identical to what they were at the reviewed head.

**25-NEEDLE MODE**, a scratch worktree of my own, `git worktree add --detach` at `82c98f8`
with the three `node_modules` junctions mirrored (root, `rebuild/m3/w5`, `rebuild/m3/w6`)
and `gen/` copied in because it does not exist at that commit. No private junction, nothing
under `rebuild/conform/private` read or created, no browser, no `--full`. The worktree was
removed afterwards, and so was the one my predecessor left behind when the account limit
cut it off mid-round.

```
%TEMP%\sealfix2-needle-wt   git rev-parse HEAD  82c98f891cf24ad339cddc0969087e3ecb574b0b
replay-s8.test.cjs      # pass 19   # fail 0    duration_ms 297402.2
  cross-side facts      810     identical 801
  internal consistency  19      self-checks 7
  needles               compared
  measured 25 of 25; not measured: none
  SAME 25, DIFFERENT 0
  UNEXPLAINED           0
  the GATE-SUPERSESSION line was found in the ledger at origin/rebuild/t2-client-core
```

**810 / 801 / 19 / 7**, which is R3 n2's other prediction, 810/19/7. The 810 is the 786 of
default mode, less the 1 fact the declined branch contributes and which no longer exists
as a fact at all after n2, plus the 25 needles. **Every one of the 25 needles this tree
measured is byte-identical to the one `packages/S8.json` committed** - the third time
requirement (g) has completed, in a third worktree, with the same answer as the author's
and R3's.

The nine differences are the same nine in both modes, and they are the same nine as at the
reviewed head: comment prose in nine files, one F7 test title, two orderings the runner
does not read.

### 10.16 What this round leaves open

1. Everything still standing in 9.14 items 3, 4 and 5: no needle has been measured on the
   ubuntu runner; the 26 `sealgen-replay-*` folders of earlier rounds are still in `%TEMP%`
   and are not this hand's to delete; and stages a3 and b1 are guarded, exercised and
   shipped, but have still never been RUN, so what is proven is the guard, the shape check
   and the exact bytes of the `.cmd` they would run.
2. 10.14, which is not this folder's to close.
3. `-S9` is inside the id shape the PM fixed (10.1). It cannot start a second command, and
   GUARD-4 asserts the edge rather than hiding it, but a leading hyphen on a `--package`
   value is a runner-side question this lane did not answer.
