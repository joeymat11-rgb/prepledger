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
  diff the parent does not pin and names each one in `TODO.md`; DECISIONS:524 N1 is the
  precedent for the PM ruling one out (`--exclude`), and it did.
- **The receipt line, the review json, the verdict, and anything needing `--full`.**

## The proof

`test/replay-s8.test.cjs` runs the generator as if preparing M2-S8-REAL-SHAPE from
M2-S7-PORT-ADMISSION at the real S8 base and compares it with what the round committed at
`82c98f8`. Run it with `node --test rebuild/lanes/b/tooling/gen/test/replay-s8.test.cjs`
(`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, each `set` on its own line).

Measured: **795 cross-side facts, 786 identical, 0 unexplained**, plus 6 self-checks
counted apart (a self-check compares one side of the round with itself and says nothing
about this generator). Four files come out byte-identical; nine differ in comment prose
only; one test title and two orderings differ. Three controls: REPLAY-11 (a generator with
one substitution broken must be caught), REPLAY-12 (a mutated data string INSIDE an assert
expression must be a code difference, not prose) and REPLAY-13 (the child env is
`children()`'s env, including the four deletions, and a reduced env records no needle).

**The needles are compared only where that means anything.**
`GEN_REPLAY_NEEDLES_AT_POST_HEAD=1` is honoured only from a worktree checked out AT
`82c98f8` and only when the child env can be reproduced; anywhere else the cell declines
and prints which condition failed. A needle is a property of the tree that is checked out,
so comparing one measured on today's tree with one the S8 round recorded proves nothing.
What the default run proves is the MECHANISM, on the child whose needle is a sentence
rather than a tap count.

## The chain

`seal-chain.cjs --plan` prints chain A (DECISIONS:516 to :519) and chain B (:528 to :529)
as named stages. `[run ]` stages this script runs, detached, with a log and a `.done` file
under `%TEMP%\sealgen-chain-<stage>.*` so a long stage can be polled. `[PM  ]` stages need
`--full` and the private census and are **refused** without `--pm-runs-full`; this lane
never passes it. `[hand]` stages are judgments and ledger writes: printed, never executed.

Stage **b6 pushes a branch by name**. It resolves the branch this worktree stands on,
writes it on both sides of the refspec, and refuses `main`, `rebuild/t2-client-core` and a
detached HEAD by name; `--branch <name>` is a second pair of eyes that must agree with the
worktree, never an override. `--plan` prints the refusal where the command would be, so a
worktree that cannot run b6 says so before anyone tries. `--dry-run` writes the stage
`.cmd` and starts nothing, and says that.

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
generator now produces is the whole of six of those commits' mechanical content. The
number the PM can hold this to is not "2.5 hours saved" but the one the replay prints:
**786 of 795 cross-side mechanical facts, and 4 of 15 generated files byte-identical,
produced in about 20 seconds of measured work** (the generator's own wall time in the
replay). What is left is the reading, the prose and the judgments - which is what the
human rounds were supposed to be spending the time on.

## Before you trust a needle: the worktree has to be whole

The needles are the only facts here with no second witness in Git, and they need a
worktree where the children can really run. In `%TEMP%\earned-sealgen` on 2026-09-19 they
could not: `node_modules` is a junction to `%TEMP%\earned-realshape\node_modules`, which is
a junction to `%TEMP%\earned-ci\node_modules`, **which does not exist**. So 18 of the 25
S8 children exit 1 with `ERR_MODULE_NOT_FOUND @noble/hashes`, and `Reference.create(root)`
refuses with `BASELINE-ESBUILD-MISSING`. The generator now records **no needle at all**
there and names the reason once in `TODO.md`, instead of recording the 7 that happen to
pass. Measured, so the PM does not have to re-derive it: that failure is **not** about the
env variables - the same 7 of 25 are green under the reduced env and under the exact one.
Run the needle stage from a worktree whose `node_modules` really resolves.
