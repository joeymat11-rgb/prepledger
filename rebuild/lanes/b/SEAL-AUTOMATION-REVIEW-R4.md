# SEAL-AUTOMATION REVIEW R4 - independent re-check of the fix round

**Head reviewed:** `ee108f6840f6f63a093dd1dab305f62f00aa5066` on `rebuild/b-seal-gen`
(the author reported it; I confirmed it in the farm and on the PC before anything else).
**Diff read:** `0730091f..ee108f68`, seven files, 1206 insertions, 86 deletions.
**Reviewer:** an independent hand. The author is gone. I was told to disagree, and I
attacked the three guards myself rather than reading the cells that assert them.

## VERDICT: ACCEPT WITH NOTES

All thirteen items - G-F1, G-F2, G-F3, n1 to n9 and G-F13 - are **FIXED**. Nothing is
disputed and nothing is still open among them. The bar is green on the PC on the first
run, with no re-run needed, and every number the report prints is the number I measured.

I raise **four residuals of my own**, r1 to r4. None of them blocks the generator for use.
Three are latent (no instance exists in the tree today) and one is evidence quality on two
stages that have never been run. They are written down so they are not rediscovered.

## 1. What I ran, and where

Read in the farm at `ee108f68` (`FARM-VERIFY PASS`). Everything below was **run on the
PC** in `%TEMP%\earned-sealgen`, `git pull --ff-only` first (`Already up to date`), working
tree clean before and after, `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` each
on its own line of a `.cmd`. I edited nothing but this file.

### The gen bar, default mode, one run, no re-run

```
HEAD ee108f6840f6f63a093dd1dab305f62f00aa5066   git status --porcelain: clean
chain-guard.test.cjs    # pass 9    # fail 0    duration_ms 4661.6
replay-s8.test.cjs      # pass 19   # fail 0    duration_ms 66402.3
  cross-side facts      786     identical 777
  internal consistency  19      self-checks 7
  byte-identical files  4    prose-only 9    narrative 1    ordering 2
  UNEXPLAINED           0
  non-literal specifiers the S8 import walk met: 20
  needles: not compared (HEAD is not the post head), and the cell says so
  removed 4 scratch folder(s) this run created
```

**786 / 777 / 19 / 7**, byte for byte the report's 10.15 default-mode figure and R3 n2's
prediction of 786/19/7. The nine differences are the nine named. I did not run needle mode:
the author's 810/801/19/7 is a third completion of requirement (g) in a third worktree and
I had no reason to spend a five-minute worktree run to confirm a number two hands have now
measured. That is the one figure in this review I take on the author's word, and I say so.

### My own attacks

A throwaway repository `%TEMP%\sealfix-r4-att` (git init, seed commit, branches `main`,
`rebuild/t2-client-core`, `rebuild/b-seal-gen` and one named `lane&echo-pwned`), with
`gen/` copied in at its real relative depth and its own `TEMP` inside it. **`--dry-run`
throughout**, so nothing could start; after every run I read the body of any `.cmd` that
had been written and then removed it. The repository and the junction below were removed
afterwards. No writing stage of `seal-chain.cjs` was ever run against the real repository,
no `--full`, no browser, nothing under `rebuild/conform/private` read or created.

## 2. The three PM findings

### G-F1 - the argv shape guard. **FIXED.**

I put each of `&` `|` `^` `%` `"` `<` `>`, a space, a newline, a trailing newline, a bare
CR, a leading dash and a `..` segment through **`--id`** (stages a1, a4, a6) and through
**`--tip-ref`** (stages a3, b1), plus `x & git push origin HEAD:main`, `HEAD~1..HEAD` and
`--upload-pack=evil`; and `x & git push origin HEAD:main` through `--branch` at b6.

**Twenty-nine of thirty refused**, every one with `CHAIN-ARGV-SHAPE` naming the argument,
exit 1, and - the part I was checking - **`files=[]` every time**: not one `.cmd` was
written at all, so there is no body to carry a second command. `--plan` with a hostile
`--id` refuses too, before it prints a line.

The thirtieth is `--id -S9`, which the shape admits, which GUARD-4 asserts out loud and
10.16 item 3 carries. I read the `.cmd` it writes: the body is one command,
`... --ci --package -S9`, and the stage files are `sealgen-chain--S9-*`. It cannot start a
second command. **I agree with carrying it**, and I add the observation that a leading
hyphen also reaches a file name, where it is equally harmless.

The **branch name** attack is the one I most expected to survive, and it did not. Standing
on `lane&echo-pwned`, all three writing stages exit 1 with
`CHAIN-ARGV-SHAPE the branch git resolved in ...`, no `.cmd` written; and `--plan` on that
branch prints the refusal in place of a3's, b1's and b6's command lines rather than
printing a command with an ampersand in it. The clean controls still build: a1, a3 and b6
produce exactly one `.cmd` each whose body is the one command and nothing else.

### G-F2 - the stage files carry the id. **FIXED.**

`paths('S9','a1')` and `paths('S10','a1')` differ in all three of `.cmd`, `.log`, `.done`;
every file my attacks produced was `sealgen-chain-S9-<stage>.*` or
`sealgen-chain--S9-a1.cmd`; and `paths()` calls `checkId()` itself, so `../../S9` and
`S9 & echo x` never reach `path.join`. `--poll` cannot reach `paths()` without an `--id`,
because `CHAIN-ARGV-MISSING --id` is thrown first.

### G-F3 - `--out` cannot be the tree. **FIXED.**

End to end against a throwaway `--repo`, all seven refused with `GEN-OUT-INSIDE-THE-TREE`
and exit 1: `.`, the root itself, `<root>\rebuild`, a path that does not exist yet, the
root in UPPER case, the root in lower case, and the relative `rebuild\lanes`.

Against the **real tree**, using the exported guard only, so nothing was measured and
nothing was written: the root, a path inside `gen/`, the root upper-cased, lower-cased and
case-mixed, and - the one I wanted - **a path reaching the tree through a junction**
(`%TEMP%\sealfix-r4-junc` -> `%TEMP%\earned-sealgen`, made and removed in my own scratch).
All six refused, and the junction case refused **naming the resolved path**
`...\earned-sealgen\scratch-out`, which is `realish()` doing its job. The two controls are
accepted: a real scratch folder, and the sibling `earned-sealgen-other`, which shares a
prefix with the root and is correctly **not** treated as inside it - there is no off-by-one
in the separator test.

## 3. R3's nine notes

- **n1 `MESSAGE_ARITY.fail`.** **FIXED.** It is 2; REPLAY-14 asserts the value, the two
  classifications either side of it, and that no entry in the table is below 1. Green.
- **n2 the two facts and the headline.** **FIXED.** Both moved: the GATE-SUPERSESSION
  lookup is a `selfCheck`, and "the differential child is green here" is a direct
  `assert.equal` in no bucket. **Measured here, not copied: 786 / 777 / 19 / 7.** The
  README and the report carry 786/777 everywhere I could find them.
- **n3 "Before you trust a needle".** **FIXED**, by reading. The paragraph now says
  `referenceOk` is the half that holds and `exact` is the half that never can inside a
  test, and REPLAY-13 asserts `ce.inTestRunner === true` and `ce.exact === false` on every
  run. The bar's own output prints that sentence, so it is not a claim in prose only.
- **n4 the decline message.** **FIXED.** My bar log reads
  `set GEN_REPLAY_NEEDLES=1 (or the longer GEN_REPLAY_NEEDLES_AT_POST_HEAD=1 ... either
  spelling works)`. Both spellings still work in the code.
- **n5 the 1.5 h arithmetic.** **FIXED**, by reading. The table now carries the
  `2.5 x 0.75 x 777/786 = 1.85 h` row and a named 20-minute TODO-reading allowance as its
  own row, and says both the 2.5 h and the allowance are estimates.
- **n6 GUARD-1 is an ALLOW list.** **FIXED**, and I tried to slip things past it. I lifted
  the shipped predicate verbatim out of `chain-guard.test.cjs` and ran 38 shapes through
  it. Refused: `pull`, `am`, `apply`, `worktree add`, `stash`, `clean`, `cherry-pick`,
  `revert`, `restore`, `tag -f`, `update-ref`, `branch -f`, `reset`, `checkout`, `commit`,
  `push`, and the disguises `GIT pull`, `git.exe pull`, `git --git-dir=x pull`,
  `  git pull`, `git<TAB>pull`, `git status & git push ...`, `git status && git pull`,
  `git diff | git apply`, `echo hi`, `del /q x`. Allowed: the eight read verbs, b4's
  `git -c core.pager=cat diff`, and the runner's `--ci` line. That is the right shape. See
  **r2** for the one separator it does not split on.
- **n7 the wiring, held by a cell.** **FIXED.** GUARD-6 runs the shipped script as a child
  process from a throwaway repository with its own `TEMP` and asserts the exit status, the
  refusal on stderr and the bytes of the `.cmd`, including the `cd /d` into the repository
  resolved from `__dirname`. Green here, and my own attacks are the same thing done by
  hand with a wider matrix and the same answers.
- **n8 the engines sentence.** **CORRECTED**, by reading. Section 9.12 now names
  `build-engines.mjs` (3,791), `engine-main.cjs` (813,696) and `engine-old.cjs` (792,806)
  and keeps the substance, which is that no child asked for them.
- **n9 `--needle-repeat` exact equality.** **FIXED.** REPLAY-17 is green, and I probed
  `needleDisagreement` further: `4`/`42` and `42`/`4` and `1`/`10` all disagree and name
  the run and both summaries; a tap run followed by a run with no tap disagrees; a red run
  disagrees; three agreeing runs answer null. I confirmed the defect itself still exists
  in the predicate that keeps it: `needleStandsAtLineStart('# pass 42', '# pass 4')` is
  `true`, and `tapPassNeedle` tells them apart. The prefix predicate stays where it
  belongs.

## 4. The author's own open hole

### G-F13 - the import walk names its blind spot. **FIXED.**

REPLAY-19 is green: the two-file fixture leaves `b.cjs` unreached and records `a.cjs:3`,
the literal version reaches it in one hop and records nothing, and both ends of the S8
TODO.md are asserted. On this post head the walk met **20** non-literal specifiers - I
measured 20, the report says 20 - so both class (3) paths carry the named blind spot, and
`REPORT.json` carries the whole list. See **r3** for the one specifier spelling the
recogniser does not see.

## 5. Stop-the-line re-checks

- **Touched-path fence.** `0730091f..ee108f68` touches seven files: five under
  `rebuild/lanes/b/tooling/gen/` and `rebuild/lanes/b/SEAL-AUTOMATION-AUTHOR-REPORT.md`
  and `gen/README.md`. `rebuild/DECISIONS.md`, `rebuild/lanes/STATUS.md` and everything
  outside the lane are untouched. PASS.
- **`--full` unreachable.** Every occurrence of `--full` in `gen/` is prose, a `pm` stage
  description, the refusal text, or the hostile fixture `'S9 --full'`. No command
  `seal-chain.cjs` builds can carry it: a1/a4/a6 are `--ci --package <id>`, a3/b1 are
  `git fetch && git merge`, b4 is `git diff`, b6 is `git push`, and `pm` stages build no
  command at all and return 3. PASS.
- **No junction or symlink call in `gen/`.** No `mklink`, `symlinkSync`, `junction` or
  `.lnk` call anywhere under `gen/`; the four matches are comments explaining why real
  paths are compared and how the PM's own worktree is wired. PASS.
- **No U+2013, no U+2014, no CR byte** in any of the seven touched files (scanned by
  byte). PASS. This file is written to the same rule.

## 6. My four notes, none blocking

**r1. G-F3 is relative to `--repo`, not to the generator's own tree.** The guard compares
`--out` with `o.root`, which `--repo <path>` sets. Measured: with `--repo` pointing at a
throwaway folder and `--out` pointing **inside the real tree** (I used
`...\earned-sealgen\rebuild\lanes\b\tooling\gen\r4-probe`), the guard **accepts**. I
proved this with the exported function only; I did not let a generator run write there.
Everything the PM named is fixed - `--out .` from the repository root is refused, and so
is every spelling of it I could invent. What is left is the case where a hand points
`--repo` at a scratch worktree, which is exactly how the author's own needle runs are
made, and then mistypes `--out`. One line closes it:
refuse an `--out` inside `REPO` (the `__dirname`-resolved constant) as well as inside
`root`. Until then the README sentence "nothing here writes into the tree" is true of the
tree it was pointed at, not of the tree the generator lives in.

**r2. The allow-list predicate does not split on a newline.** `readOnlyCommand` splits on
`&&`, `||`, `&`, `|` and `;`. Measured: `git status\ngit push origin HEAD:main` is
**ALLOWED** by it, and so is the CRLF spelling. In a `.cmd` body a line break is a command
separator, so the cell that exists to stop the next stage from dodging `writeBranch()`
would not stop a multi-line one. It is unreachable today only because G-F1's `oneLine()`
refuses a line break in `--id`, `--tip-ref`, `--branch` and the resolved branch, and
nothing else reaches the string. That means these two guards now hold each other up, which
is worth knowing. Adding `[\r\n]` to that split costs nothing.

**r3. A template-literal specifier is invisible to both halves of G-F13.** `DYNAMIC_RE`
excludes a backtick in its lookahead, so `` require(`./b.cjs`) ``, ``
await import(`./b.cjs`) `` and `` require(`./${n}.cjs`) `` are **not recorded** as
non-literal; and `IMPORT_RE` matches `'` and `"` only, so they are **not followed**
either. A module reached only that way would still land in class (3) with the `--exclude`
invitation and **no** `DYNAMIC-SPECIFIER-SEEN` beside it - the precise situation G-F13
exists to prevent. There are **zero** such specifiers anywhere in `rebuild/` today (I
searched; the two matches are prose inside comments), so the measured 20 is not wrong and
no number moves. The fix is to drop the backtick from the negative lookahead, which
records a template literal as something the walk could not follow - which is true, since
the walk cannot follow it.

**r4. Stage a3 and b1 redirect only their second command.** The `.cmd` body is
`git fetch origin && git merge --no-edit <tip> > "<log>" 2>&1`, so the **fetch** output
goes nowhere and, if the fetch fails, the merge never runs and the log the PM polls holds
one line, `EXIT <n>`, with no reason in it. These are the two stages that have never been
run (10.16 item 1), and the log is the only evidence a detached stage leaves. Wrapping the
pair in parentheses, or redirecting each side, would put the reason where the PM will look
for it.

## 7. Carried, not this round's, so it is not lost

R3 n9's observation is **also true of the sealed runner's own predicate**: `children()`
matches a pinned needle by prefix at the head of a line, so a package pinning `# pass 4` is
satisfied by a child that prints `# pass 42`. I confirmed that behaviour directly here.
For `--needle-repeat` it was a defect and 10.12 fixes it; for the runner it is a different
question with its own history, laws and reviews, and it is the predicate the 25 S8 needles
were measured and accepted against. **Nothing in `gen/` changes it and nothing in this
round proposes to.** It is a runner question for the PM and for lane B's S9 round.

## 8. What I did not do

No needle-mode run (see section 1). No writing stage of `seal-chain.cjs` against the real
repository: every guard was exercised in throwaway repositories I created and removed. No
`--full`, no `b-package.cjs --full` script of any kind, no private junction, no browser, no
`npm install`, nothing touched outside `gen/` and this file. The scratch I made - the
throwaway repository, the junction, the logs and the drivers - was removed or is confined
to `%TEMP%\sealfix-r4-*`, which is mine.
