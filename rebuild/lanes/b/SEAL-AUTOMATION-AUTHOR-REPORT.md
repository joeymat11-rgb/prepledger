# SEAL-AUTOMATION - author report

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
  facts compared        800
  identical             791
  byte-identical files  4  [s8-supersede-inherited-carriers.test.cjs,
                            s8-supersede-defect-witnesses.test.cjs,
                            s8-supersede-second-gate.test.cjs,
                            s8-engine-files-differential.cjs]
  files differing in comment prose only  9
  test titles / assert messages differing 1
  ordering the runner does not read       2
  UNEXPLAINED           0
```

`node --test` says `# pass 11 # fail 0`.

### What "800 facts" is made of

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
- the runner sha256 re-pinned in H3/S3/S4/S5/S6/S7 (13 facts);
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
   instead. The generator names both in `TODO.md` with that reason and `--exclude` is how
   the PM answers. The test asserts the extras are **exactly** those two and that both are
   named in TODO.md.
6. **The runner sha256 differs from the committed one** - necessarily, because the comment
   prose differs. What the test proves instead is the *rule*: the package and all six
   ancestor specs are pinned to the sha of the runner **this run generated**, and the six
   committed ancestor specs all carry the one sha the committed package carries.

## 4. The red control

REPLAY-11 runs the generator with the child root replaced by a root that does not exist and
with the parent's spec path pinned to itself. It then asserts the mutant reads
`packages/S7.json` where the real run reads S8's, that the CHILD_ROOTS literal moved, and
that F7's asserted length moved with it - so REPLAY-1, REPLAY-2 and REPLAY-3 are
measurements and not decoration. Order note, honestly: the generator was written first,
because the substitution had to be **measured** off the real S7 -> S8 diff before anything
could be asserted about it. The red control is what stands in for red-first here, and it is
in the cell rather than in a commit message.

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
- The needle measurement is real but slow: all 25 children take minutes. The replay test
  measures one (the engine-files differential, whose needle is a sentence and not a
  `# pass N`) and does all 25 under `GEN_REPLAY_NEEDLES=1`.

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

## 7. Exercised in this lane

`seal-chain.cjs --plan` (both chains), the `a7` PM refusal, and `--stage a1`
(`--ci --package S8`) against the already-sealed S8 on this worktree. The runner walked
SPEC OBSERVED -> PARENT OPTION S7 ACCEPTED -> PARENT BOUND S7 and refused at
`SEAL-BASE-IS-NOT-THE-CHAIN-TIP`, which is the correct refusal for a package sealed four
ledger lines ago on a tip that has moved. No `--full`, no private census, no junction.
