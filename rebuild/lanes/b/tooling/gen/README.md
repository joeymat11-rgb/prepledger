# SEAL-AUTOMATION - generating the mechanical half of a reseal child

Every reseal child so far (S6, S7, S8) has cost about **2.5 hours of preparation** before
the roughly 1.5 hours of chain, and almost all of that preparation is the same mechanical
facts measured and typed again. This folder generates those facts, proves it can
regenerate S8 from S7 exactly, and leaves every judgment where it belongs.

Nothing here writes into the tree. `new-child.cjs` writes into a scratch `--out` folder
only. There is no `--write`, on purpose: the PM adds one when the generated diff has been
reviewed in at least one real round.

## What is generated

| | what | how it is measured |
|---|---|---|
| a | `b-package.cjs` IDS, NO_REGISTER_IDS, CHILD_ROOTS, with the parent round's reason comment mirrored | the statements are rebuilt from the parent's own literals; the argv gate's line number is re-measured in the runner the hunk lands in |
| b | the `s<N>-supersede-*` cells and the engine-files differential | mirrored name for name from the parent's family through the substitution the S7 -> S8 diff actually made |
| c | F6/F7 in `tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | every asserted list and count rebuilt from the post-hunk constants |
| d | the `CHILD_SPECS` arrays | the files are **found** (`git grep`), never listed, so a new cell cannot be missed |
| e | `packages/<ID>.json` | every `pre`/`post` from a **git blob** (`git cat-file blob <rev>:<path>`), never from a working file, never with CRLF conversion; roles from the parent's pins and the lane diff |
| f | the runner sha256 re-pinned in every ancestor spec **that pins the runner this hunk moves** | taken over the generated runner bytes, and cross-checked against the blob at the post head. A spec pinned to an OLDER runner (B-NTC, B1..B4 all pin `4482bb8a`) is frozen where its own seal left it: it is left alone and named in `TODO.md`, which is exactly what the S8 round did |
| g | the child needles | **measured** by running each child the way `children()` runs it: node, cwd = repo root, and the env `laws()` builds at `b-package.cjs:2085` - the clock pair, `ENGINE_MAIN` and `ENGINE_OLD` from `Reference.create(root)`, `EARNED_CLIENT_DIR`, and the four variables the runner DELETES. If that env cannot be reproduced, **no needle is recorded at all** and `TODO.md` says why (`--needle-repeat 2` additionally requires every run to print the same needle) |
| h | the `rebuild.yml` standing step, and the lane-cell step's run line | the flip lives inside the package (VERDICT-S6.md rule (a)); the run line is by exact path, never globbed |
| i | `final-lines.txt` | the three token lines drafted, with the sha256 rule the runner uses: over the line bytes, leading dash included, newline excluded |
| j | `TODO.md` | everything it could not decide, each with the reason |

## What stays human, always

- **The brief.** No tool writes what a package is for.
- **The theme sentence.** `final-lines.txt` gives the THEME line with the sentence blank.
- **Every ordinal in a mirrored comment.** A mirrored block is one generation later than
  the words in it ("the NINETEENTH root", "a fourth time", "THE FIFTH GENERATION"). The
  generator does **not** shift them, because "the first of the nineteen gates refusing" is
  an ordinal too and shifting it would be a lie. Every one is listed in `TODO.md` - and
  only those: `fourth` upward always fires, while `first` / `second` / `third` /
  `generation` fire only when they stand as a word with something countable next to them,
  so `second-gate` and "re-run in a second" no longer bury the list (R1 N7: 67 entries
  became 33, and the ordinals that mattered all stayed).
- **The product story.** A mirrored comment tells the PARENT's story until `--subst` pairs
  are given for this round's accepted lane rounds, and `TODO.md` says so on every run.
- **Which candidate paths are declared.** The generator declares every path in the lane
  diff the parent does not pin and names each one in `TODO.md`, with the sentence that
  applies to it. Which sentence is decided by **whether a declared child EXECUTES the
  path** - the question DECISIONS:524 N1 actually asked - and not by whether the path
  stands under a child root, which was false for six of the eleven paths the R1 round said
  it about (R2 M3). Three answers, measured from the GIT BLOBS at the post head:
  **argv target** of a declared child (the runner's own test: `proposed()` puts these into
  `executionPins`); **reached by import** from one, transitively, which does execute it but
  is not pinned by `proposed()`; or **neither**, which is the `:524 N1` shape and the only
  one invited to `--exclude`. On the S8 replay the nineteen `new` paths split 12 / 5 / 2,
  and the two are exactly the p3-layout-v2 cells the PM ruled undeclared at `:524 N1`.
  `REPLAY-4` asserts both ends: the two carry the ruling, and no path a child executes does.
- **The receipt line, the review json, the verdict, and anything needing `--full`.**

## The proof

`test/replay-s8.test.cjs` runs the generator as if preparing M2-S8-REAL-SHAPE from
M2-S7-PORT-ADMISSION at the real S8 base and compares it with what the round committed at
`82c98f8`. Run it with `node --test rebuild/lanes/b/tooling/gen/test/replay-s8.test.cjs`
(`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, each `set` on its own line).

Measured: **788 cross-side facts, 779 identical, 0 unexplained**, plus **19 internal
consistency checks** and **6 self-checks**, both counted apart. The three kinds are kept
apart on purpose (R2 M4), and only the first is reproduction:

| kind | both sides | what it is worth |
|---|---|---|
| cross-side fact | generated vs **committed** | the generator reproduced what the round did |
| internal consistency | generated vs generated | the generated cell reads its own spec; the generated spec pins the runner this run made. Real, but it is the generator agreeing with itself |
| self-check | committed vs committed | a property of the S8 round, not of this generator |

Four files come out byte-identical; nine differ in comment prose only; one test title and
two orderings differ. Five controls: REPLAY-11 (a generator with one substitution broken
must be caught), REPLAY-12 (a mutated data string INSIDE an assert expression is a code
difference, not prose), REPLAY-13 (the child env is `children()`'s env, including the four
deletions, and a reduced env records no needle), **REPLAY-14** (the last string of a
TWO-argument assert is an expected VALUE and a mutation of it is a code difference: 144 of
the 860 assert lines ending in a string are in that shape, the old rule tolerated all 144,
this one tolerates 0) and **`test/chain-guard.test.cjs`** (every stage that merges, commits
or pushes refuses `main`, `rebuild/t2-client-core` and a detached HEAD, exercised on a
throwaway repository). REPLAY-15 removes the scratch folders the run created.

**The needles are compared only where that means anything.**
`GEN_REPLAY_NEEDLES=1` (or the longer `GEN_REPLAY_NEEDLES_AT_POST_HEAD=1`, which says what
it requires) is honoured only from a worktree checked out AT `82c98f8` and only when the
child env can be reproduced; anywhere else the cell declines and prints which condition
failed. A needle is a property of the tree that is checked out, so comparing one measured
on today's tree with one the S8 round recorded proves nothing. What the default run proves
is the MECHANISM, on the child whose needle is a sentence rather than a tap count.

To run it: `git worktree add --detach <scratch> 82c98f8`, junction `node_modules` there the
way the lane worktree's are (root, `rebuild/m3/w5`, `rebuild/m3/w6`), copy this `gen/`
folder in, and run the cell from there with `GEN_REPLAY_NEEDLES=1`. **That run is how the
CR defect in `tapPassNeedle` was found** (REPLAY-16): 24 of the 25 children were green and
24 of the 25 needles came back blank, because `$` in `/^# pass (\d+)$/m` never matched a
CRLF line. Requirement (g) had never run to completion anywhere before that, which is
exactly why R2 N7 asked for it.

## The chain

`seal-chain.cjs --plan` prints chain A (DECISIONS:516 to :519) and chain B (:528 to :529)
as named stages. `[run ]` stages this script runs, detached, with a log and a `.done` file
under `%TEMP%\sealgen-chain-<stage>.*` so a long stage can be polled. `[PM  ]` stages need
`--full` and the private census and are **refused** without `--pm-runs-full`; this lane
never passes it. `[hand]` stages are judgments and ledger writes: printed, never executed.

**Every stage that writes goes through one guard.** `WRITE_STAGES` is `a3`, `b1` and `b6` -
the two that MERGE the chain tip and the one that PUSHES - and each of them calls
`writeBranch()`, which resolves the branch this worktree stands on and refuses `main`,
`rebuild/t2-client-core` and a detached HEAD **by name**. b6 additionally writes the branch
on both sides of the refspec; `--branch <name>` is a second pair of eyes that must agree
with the worktree, never an override. The branch being written is printed as
`WRITES INTO: <branch>` in the stage banner and in `--plan`, and a worktree that cannot run
a stage prints the refusal there instead of the command, before anyone tries. `--dry-run`
writes the stage `.cmd` and starts nothing, and says that. `test/chain-guard.test.cjs`
holds the list to the commands: a `run` stage whose command contains a writing verb and is
not in `WRITE_STAGES` fails that cell, which is how the next stage someone adds cannot
dodge the guard the way `a3` and `b1` did (R2 M1).

Stage **a5 is a `hand` stage**: `propose.cjs` confirms the runner still compiles to its
main-sequence boundary and that `proposed()` is reachable, and writes nothing. Assembling
the spec/bound pair was a PM scratch script in S7 and S8 (DECISIONS:516) and it still is.
The day that assembly exists, a5 goes back to `[run ]`.

## S9, and the RELEASED role

`rebuild/lanes/b/S9-RELEASE-SPEC.md` is on origin (`rebuild/b-s9-ui-pins`), so this is
read off the spec rather than guessed. `released` is the sixth member of `PRODUCT_ROLES`
(spec hunk H1); a released entry stays **declared** in `s.product` so the completeness walk
at `:1975` still finds it, carries `pre !== null` and `post === null` (H4), is admitted
beside `carried`/`edited` at `product()` `:1894` (H6) and skipped before the disk hash
(H7), and the released set must equal the granted set of a `RELEASE-FROM-SEAL` token line
in both directions (H9).

`new-child.cjs` takes `--released <path>` and does exactly and only that: declares the
role, `pre` from the parent's own post, `post: null`, and puts the ruling line itself in
`TODO.md`. **It never proposes the role on its own**, because the role is a PM ruling and
the runner will refuse a spec whose released set does not match the line. It also checks
spec B.6 / risk R2 for free: a released path that is a child argv target would be silently
re-pinned into `executionPins` by `proposed()`, so the generator names that collision if it
sees it. The `released` block in the artifact, the `releasedAncestry()` grandparent skip
(H17) and the receipt exclusions (H12, H13) are all runner-side and none of them is this
folder's business.

## The time saved, and the measurement behind the number

The S8 preparation round is eight commits (`1ac0c72 .. 82c98f8`) over 25 files. What the
generator now produces is the whole of six of those commits' mechanical content:
**779 of 788 cross-side mechanical facts, 4 of 15 generated files byte-identical, produced
in about 20 seconds of measured work** (the generator's own wall time in the replay).

R2 N5 asked for the hours, and refusing to give one was the wrong answer twice running.
The number, with the arithmetic in the open so the PM can correct the one input only he
holds:

| | |
|---|---|
| preparation per reseal child, S6 / S7 / S8, the PM's own figure | **2.5 h** |
| of the round's 8 commits, the ones that are mechanical content | **6** (`1ac0c72`, `70b983a`, `ef21153`, `c07d092` in part, and the two re-pin/CI commits) |
| share of the preparation those six commits are | **about three quarters**, because the other two are the brief and the report, which are prose |
| what the generator does of that three quarters | **779 of 788 facts**; the 9 that remain are prose in comments, and the 33 TODO entries are read and answered by hand |
| so: machine work replaces | **about 1.5 h of the 2.5 h**, leaving roughly 1 h of reading, prose and judgment |
| measured machine time in its place | **about 20 s** (plus minutes if `--stage all` measures 25 needles) |

**1.5 hours a child** is therefore the number, and its weakest input is the 2.5 h: it is
the PM's recollection, not a measurement, and no round has been timed. The two inputs that
ARE measured are the fact count and the 20 seconds. If the PM times the S9 preparation, the
first input stops being a recollection and this table becomes arithmetic.

## Before you trust a needle: the worktree has to be whole

The needles are the only facts here with no second witness in Git, and they need a
worktree where the children can really run. On 2026-09-19 `%TEMP%\earned-sealgen` could
not: its `node_modules` junction chain ended in a directory that did not exist, 18 of the
25 S8 children exited 1 with `ERR_MODULE_NOT_FOUND @noble/hashes`, and
`Reference.create(root)` refused with `BASELINE-ESBUILD-MISSING`. **The PM re-pointed that
worktree's three junctions at live sources at 02:38 on 2026-09-19** (root,
`rebuild/m3/w5`, `rebuild/m3/w6`), and the reference build now succeeds here: `childEnv()`
answers `exact: true` and REPLAY-13 exercises the green branch instead of the refusal.

The generator still records **no needle at all** where the env is not `children()`'s env,
and names the reason once in `TODO.md`. What the first completed needle run then showed is
above: green children are not enough - the needle must also be READ correctly, and it was
not until REPLAY-16. Run the needle stage from a worktree whose `node_modules` really
resolves, prefer `--needle-repeat 2` for the run that feeds a sealed package, and read
`needles.json` before believing a single pinned number.

## Using it for S9

S9 is not an ordinary child, and the ORDER matters more than the commands. The generator
reads `role: "released"` and will write it when told to, but **the runner cannot read it
yet**: `PRODUCT_ROLES` at `b-package.cjs:351` is the five-member list and `:1519` refuses
anything else with `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY`. The role arrives with
S9-RELEASE-SPEC hunk H1, which is S9's own work, so a package that declares `released`
before those hunks land refuses on sight. Hence:

**The round goes in this order, and no other.**

1. **The runner hunks first, including S9-RELEASE-SPEC H1 and the rest of its hunk table.**
   Until H1 is in `b-package.cjs`, `released` does not exist. (The spec is still in flight -
   round 3 was REJECT at DECISIONS:546 and round 4 is dispatched - so do not start here
   until it is accepted. Sections B and D are accepted by three reviews and are what the
   generated hunks touch.)
2. **Then the generated tree**, `%TEMP%\s9-gen\tree\**`, as the round's first commits, and
   `--ci --package S9` to see the runner read its own new vocabulary.
3. **Then the RELEASE-FROM-SEAL token line**, whose granted set must equal the declared
   released set in both directions (H9), and the THEME and BRIEF-BY-SHA lines.
4. **Then re-run the generator with `--post-head HEAD --stage all`** so every `post` sha
   and every needle is measured on the landed tree.

```
node rebuild/lanes/b/tooling/gen/new-child.cjs --plan
node rebuild/lanes/b/tooling/gen/new-child.cjs --id S9 --name M2-S9-UI-PINS --parent S8 ^
  --head <the lane commit to seal> --base <the same commit, before the hunks> ^
  --post-head HEAD --dispatch-line <the :NNN that dispatched S9> ^
  --child-root rebuild/lanes/c/s9-today-carry/ ^
  --child-root rebuild/lanes/c/passphrase-normalize/ ^
  --released rebuild/m3/w7-preview/today/preview.css ^
  --released rebuild/m3/w7-preview/today/build.mjs ^
  --subst "<the parent's accepted rounds>=<S9's accepted rounds>" --out %TEMP%\s9-gen
node rebuild/lanes/b/tooling/gen/seal-chain.cjs --id S9 --plan
```

### What S9 must declare, and which of it the generator measures by itself

| what | paths | who decides |
|---|---|---|
| **released**, two paths (S9-RELEASE-SPEC B.2) | `rebuild/m3/w7-preview/today/preview.css`, `rebuild/m3/w7-preview/today/build.mjs` | the **PM's** `RELEASE-FROM-SEAL M2-S9-UI-PINS <both paths>` line. The generator declares the role only when told with `--released`, sets `pre` from S8's own post and `post: null`, and puts the ruling line in `TODO.md`. It also checks B.6 / risk R2 for free: neither path may be a child argv target |
| **S9-TODAY-CARRY**, four pinned paths (lane report section 8 item 5, review R1 N1) | `rebuild/m3/w7-preview/today/today-app.cjs`, `rebuild/m3/w7-preview/today/test/view.test.mjs`, `rebuild/m3/w7-preview/today/test/adapter.test.mjs`, `.github/workflows/rebuild.yml` | **measured**: all four are in S8's `product`, so the generator re-hashes each from Git and gives it `edited` or `carried` on its own. The lane's two new cells (`rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs`, `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs`), `today-model.cjs`, `design.cjs` and the lane report are unpinned |
| **PASSPHRASE-NORMALIZE** (DECISIONS:543 (B)) | edited: `rebuild/m3/w6/local/import-bundle.mjs`, `rebuild/m3/w7-preview/import/import-screen.mjs`, `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`; new and SEALED: `rebuild/m3/setup/port/passphrase.cjs` | the roles are **measured**; what is NOT measured is that `passphrase.cjs` is sealed-class because it decides key material on the phone, and that `page-bundle.test.mjs` also carries an execution pin whose two module counts were re-measured 142->143 and 20->21. Both are `TODO.md` lines for the PM |
| **the three passphrase lane cells, with a CI step and a child root** | `rebuild/lanes/c/passphrase-normalize/helper.test.mjs`, `route.test.mjs`, `unlock-forms.test.mjs` | pass `--child-root rebuild/lanes/c/passphrase-normalize/` and the generator writes the own-child, the `rebuild.yml` lane-cell run line by exact path, and leaves the step NAME blank. :543 and R2 call that step the guard that keeps every sealed bundle valid, so it is not optional |
| **a CI home for** `rebuild/m3/w6/test/local-import.test.mjs` | it pins the phone's five seal constants against the PC's and runs in no workflow; raised three times | **the PM's**: it is not under a child root, so the generator will declare it `new` and say a declared child reaches it, or that none does. Read that `TODO.md` line and give it a home |
| **pinned-unchanged**, two writers outside the seal (S9-RELEASE-SPEC E fact 17, PM-R3) | `rebuild/m3/w7-preview/today/gym-model.mjs`, `rebuild/m3/w7-preview/today/checkin-app.mjs` | **pins measured from Git, role ruled by the PM.** They are `pre === post`, unpinned by S8, and they write athlete state. The generator proposes `pinned-unchanged` by itself ONLY when the path is a declared child's argv target (R2 N6); for these two it will not, so declare them by hand and check `TODO.md` names them. E fact 17's other four `pinned-unchanged` paths are the design-of-record files |
| **the whole approved design pack**, pinned at the S9 head (PM-R6 as revised at DECISIONS:546) | `README.md` and `quality/**` included | **the PM's**, and it is measured at the S9 re-measure, after C-UI-0 is accepted by the second teeth audit and C-UI-1 is merged. COPY-BIND is WITHDRAWN from S9 and the copy lock is a precondition of S10 |

Two things the generator will get wrong if nobody tells it: `--subst` pairs for the rounds
S9 carries (without them every mirrored comment still tells S8's product story), and the
`--dispatch-line`. Both are named in `TODO.md` on every run where they are missing.
