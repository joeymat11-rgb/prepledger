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
| f | the runner sha256 re-pinned in every ancestor spec | taken over the generated runner bytes, and cross-checked against the blob at the post head |
| g | the child needles | **measured** by running each child the way `children()` runs it (node, cwd = repo root, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`) and requiring the needle to stand at the head of a line |
| h | the `rebuild.yml` standing step, and the lane-cell step's run line | the flip lives inside the package (VERDICT-S6.md rule (a)); the run line is by exact path, never globbed |
| i | `final-lines.txt` | the three token lines drafted, with the sha256 rule the runner uses: over the line bytes, leading dash included, newline excluded |
| j | `TODO.md` | everything it could not decide, each with the reason |

## What stays human, always

- **The brief.** No tool writes what a package is for.
- **The theme sentence.** `final-lines.txt` gives the THEME line with the sentence blank.
- **Every ordinal in a mirrored comment.** A mirrored block is one generation later than
  the words in it ("the NINETEENTH root", "a fourth time", "THE FIFTH GENERATION"). The
  generator does **not** shift them, because "the first of the nineteen gates refusing" is
  an ordinal too and shifting it would be a lie. Every one is listed in `TODO.md`.
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
`GEN_REPLAY_NEEDLES=1` measures all 25 needles instead of one.

Measured: **800 facts compared, 791 identical, 0 unexplained.** Four files come out
byte-identical; nine differ in comment prose only; one test title and two orderings differ.
REPLAY-11 is the red control: a generator with one substitution broken must be caught, and
it is.

## The chain

`seal-chain.cjs --plan` prints chain A (DECISIONS:516 to :519) and chain B (:528 to :529)
as named stages. `[run ]` stages this script runs, detached, with a log and a `.done` file
under `%TEMP%\sealgen-chain-<stage>.*` so a long stage can be polled. `[PM  ]` stages need
`--full` and the private census and are **refused** without `--pm-runs-full`; this lane
never passes it. `[hand]` stages are judgments and ledger writes: printed, never executed.

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
**791 of 800 mechanical facts, and 4 of 15 generated files byte-identical, produced in
21 seconds of measured work** (the generator's own wall time in the replay, three of those
seconds spent running one child). What is left is the reading, the prose and the
judgments - which is what the human rounds were supposed to be spending the time on.
