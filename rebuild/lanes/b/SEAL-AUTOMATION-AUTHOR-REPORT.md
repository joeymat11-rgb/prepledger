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
  cross-side facts      788   (generated vs committed - this is the number that means reproduction)
  identical             779
  internal consistency  19    (generated vs generated; NOT counted above)
  self-checks           6     (committed vs committed; NOT counted above)
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

`node --test` says `# pass 16 # fail 0`, and `test/chain-guard.test.cjs` says
`# pass 6 # fail 0`.

The headline has moved twice and both moves made it smaller and truer. R1 took it from
"800 compared, 791 identical" to "795 cross-side, 786 identical" by pulling out the 6
committed-against-committed checks. R2 M4 found 19 more that were not cross-side either -
12 in REPLAY-2 (the generated cell against a string literal) and 7 in REPLAY-6 (the
generated spec against the sha of the generated runner) - so they are now counted under
`internal consistency` and the headline is **788 cross-side, 779 identical**. That is 776
of the old facts plus the 12 NEW cross-side facts R2 N1 asked for: each of the six
generated ancestor specs compared BYTE FOR BYTE with the committed blob, at the base and
at the post head, with only `tooling.runnerSha256` swapped. All 12 pass.

### What the 788 cross-side facts are made of

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
`commandFor`, and fails if a command containing `merge`, `push`, `commit`, `rebase`,
`reset` or `checkout` comes back from a stage that is not in `WRITE_STAGES`. The next
writing stage someone adds cannot dodge the guard the way these two did.

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
heading, beside `selfCheck()`. The headline the cell prints, the README states and this
report leads with is **788 cross-side facts, 779 identical, 19 internal consistency checks,
6 self-checks** - R2's 776/767/19/6 plus the 12 new cross-side facts of N1 below.

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
commits of the round's eight are about three quarters, of which the generator does 779 of
788 facts, leaving roughly an hour of reading, prose and judgment - against about 20
seconds of machine time, plus about 4 minutes 20 when `--stage all` measures 25 needles
(timed this round). The weakest input is the 2.5 h: it is the PM's recollection and no
round has been timed. The table says so, and says that timing the S9 preparation turns it
into arithmetic.

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
`rebuild/conform/private` read or created; `%TEMP%\earned-s5\rebuild\conform\engines` held
nothing to copy and no child asked for it. Removed with `git worktree remove` at the end.

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

### 9.13 The two runs that stand behind this round

```
DEFAULT MODE, %TEMP%\earned-sealgen on rebuild/b-seal-gen
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
2. `--needle-repeat 2` still has not run. The 25-needle run used the default of 1; two runs
   of 25 children is about nine minutes and the PM should spend them on the run that feeds
   the sealed S9 package, not on a replay of S8.
3. The `exact: true` branch of `childEnv()` now has a witness, but only on Windows. The
   CRLF defect of 9.12 could not have been found on Linux, and the reverse may also be
   true: nothing here has measured a needle on the ubuntu runner.
4. 26 `sealgen-replay-*` folders from earlier runs remain in `%TEMP%` (9.6).
5. `seal-chain.cjs` stages a3 and b1 are guarded but have still never been RUN. What is
   exercised is the guard and the command they would run, not the merge.
