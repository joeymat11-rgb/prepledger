# SEAL-AUTOMATION - independent review R3 (third round)

Reviewed head `c4ebd318` on `rebuild/b-seal-gen` against the reviewed head of round 2,
`8a7da547`, and against the lane base `2758edc7`. Round 1 is
`SEAL-AUTOMATION-REVIEW-R1.md` (REJECT), round 2 is `SEAL-AUTOMATION-REVIEW-R2.md`
(ACCEPT WITH NOTES, four MAJOR notes M1 to M4 and seven notes N1 to N7). The fix round is
two commits, `0463582a` and `c4ebd318`.

I read the R2 fix diff in the cloud reading room, then ran everything myself on the PC:
the chain guard cell, the replay in BOTH modes, the 25-needle mode in a scratch detached
worktree of my own at `82c98f8`, the shipped `seal-chain.cjs` command line against a
throwaway repository standing on `main`, on `rebuild/t2-client-core` and detached, and the
R2 fix round's own red-first claim, by restoring `seal-chain.cjs` from `8a7da54` and
running the NEW cell against it. Every number below is one I measured. I read the author's
report last and I treat it as a hypothesis: two of its numbers I re-derived from the
committed blobs myself rather than carrying them.

## VERDICT: ACCEPT

All four MAJOR notes are FIXED and I exercised each one rather than reading it. All seven
notes are landed. Nothing is disputed by the author as wrong and I uphold no dispute of my
own against the fixes. The author corrects two of R2's numbers; **both corrections are
right, I re-measured them independently, and both make the R2 finding larger, not smaller.**

The 25-needle replay ran to completion here, in my own worktree, not the author's:
**25 of 25 measured, 25 of 25 identical to the needles S8 committed.** That is requirement
(g) with a second witness.

Eight notes of my own follow. None is blocking, none moves a fact in a package, none
touches a read-only file, and none of them should hold up the S9 preparation round.

## 1. My numbers

### Default mode, `%TEMP%\earned-sealgen` on `rebuild/b-seal-gen` at `c4ebd318`

`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`, each on its own line of a .cmd:

```
chain-guard.test.cjs    # pass 6    # fail 0
replay-s8.test.cjs      # pass 16   # fail 0
  cross-side facts      788     identical 779
  internal consistency  19      self-checks 6
  byte-identical files  4    prose-only 9    narrative 1    ordering 2
  UNEXPLAINED           0
  needles: not compared (HEAD is not the post head), and the cell says so twice
```

Identical to the author's report, first run, no re-run needed.

### THE 25-NEEDLE REPLAY, in my own scratch worktree

`git worktree add --detach %TEMP%\sealgen-r3-wt 82c98f8` from `%TEMP%\earned-sealgen`; the
three `node_modules` junctions mirrored from this worktree's own (`dir /AL`): root to
`C:\Users\joeym\Documents\prepledger-dev\node_modules`, `rebuild/m3/w5` and
`rebuild/m3/w6` to the same paths under `%TEMP%\earned-adm`. `gen/` copied in, because it
does not exist at `82c98f8`. **No private junction, nothing under `rebuild/conform/private`
read or created, no browser, no `--full`.** `%TEMP%\earned-s5\rebuild\conform\engines` was
not needed: `Reference.create(root)` builds the two bundles itself and succeeded here.
`git rev-parse HEAD` in that worktree printed `82c98f891cf24ad339cddc0969087e3ecb574b0b`.

`GEN_REPLAY_NEEDLES=1`, the short spelling the ticket uses, and the cell honoured it:

```
replay-s8.test.cjs      # pass 16   # fail 0    duration_ms 297915.8
  cross-side facts      811     identical 802
  internal consistency  19      self-checks 6
  needles               compared
  UNEXPLAINED           0
  the GATE-SUPERSESSION line was found in the ledger at origin/rebuild/t2-client-core
  measured 25 of 25; not measured: none
```

The table, as the cell printed it. `same` means the needle this run measured in the tree at
`82c98f8` is byte-identical to the one `packages/S8.json` committed:

```
same  today-17                    # pass 682     same  d-plan-edit            # pass 90
same  measure-hermetic            # pass 11      same  m4-import              # pass 62
same  s4-real-day                 # pass 15      same  m4-import-production   # pass 28
same  a0-journeys                 # pass 23      same  d-import-retract       # pass 13
same  s8-sup-source-carriers      # pass 4       same  d-admission-swap       # pass 4
same  s8-sup-inherited-carriers   # pass 3       same  d-replay-measure       # pass 9
same  s8-sup-defect-witnesses     # pass 3       same  d-capture-start        # pass 14
same  s8-sup-writers-differential # pass 3       same  food-live-save         # pass 6
same  s8-sup-second-gate          # pass 3       same  w7-import              # pass 35
same  w6-host-seams               # pass 9       same  w6-local-source        # pass 26
same  d-replay-all                # pass 28      same  b-lom                  # pass 30
same  d-port-admission            # pass 35      same  d-real-shape           # pass 56
same  engine-files-differential   "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine
      file(s) outside this package's declared product, all byte-identical to the parent;
      18 named and NOT ONE moves, so all 45 tracked rebuild/engine file(s) stand
      byte-identical to the parent's own post;"
```

**SAME 25, DIFFERENT 0.** There is no finding here. I removed the worktree afterwards.

## 2. The four MAJOR notes

### M1 (the PM's blocking item): every merging, committing or pushing stage. **FIXED.**

There is one guard, `writeBranch(root, verb)` at `seal-chain.cjs:94`, and a closed list
`WRITE_STAGES = ['a3','b1','b6']`. `commandFor` calls it for `a3`/`b1` BEFORE returning the
merge command, and `pushBranch` is now a thin wrapper round it for `b6`. A refusing
worktree gets no command at all, only the refusal, and the banner `WRITES INTO:` prints the
branch or the refusal in both `--plan` and the run.

I checked the closed list myself rather than taking it: the only `run` stages are
a1/a3/a4/a6/b1/b4/b6; a1/a4/a6 are `--ci --package <ID>`, b4 is
`git -c core.pager=cat diff --stat -- rebuild/coach`. a3, b1 and b6 are the only three that
write. a9 names a merge and b7 names the fast-forward, and both are `hand` stages that
print and run nothing. So `WRITE_STAGES` is complete for this STAGES table.

**Exercised, on the SHIPPED COMMAND LINE, not on the module seam.** The cell calls
`commandFor(id, key, {root})`, and `main()` has no `--root` or `--repo`: in real use `REPO`
is resolved from `__dirname` and that is also what `startStage` does `cd /d` into. So I
built a throwaway repository under `%TEMP%` (git init, one seed commit, three branches),
copied `gen/` into it at its real relative depth `rebuild/lanes/b/tooling/gen/`, pointed
`TEMP` at a scratch folder inside it, and ran `node ...\seal-chain.cjs --id S9 --stage <S>
--dry-run` nine times plus three detached:

```
on main                     a3 -> CHAIN-MERGE-REFUSED ... stands on main ... Check out the lane branch first.
                            b1 -> CHAIN-MERGE-REFUSED ... stands on main ...
                            b6 -> CHAIN-PUSH-REFUSED  ... stands on main ...
on rebuild/t2-client-core   a3, b1 -> CHAIN-MERGE-REFUSED ... stands on rebuild/t2-client-core ...
                            b6     -> CHAIN-PUSH-REFUSED  ... the fast-forward ... is stage b7 ...
detached                    a3, b1 -> CHAIN-MERGE-REFUSED: HEAD is detached in <repo> ...
                            b6     -> CHAIN-PUSH-REFUSED:  HEAD is detached in <repo> ...
on rebuild/b-seal-gen       a3, b1 -> git fetch origin && git merge --no-edit origin/rebuild/t2-client-core
                            b6     -> git push -u origin rebuild/b-seal-gen:rebuild/b-seal-gen
```

Every refusal printed the branch by name, both in the banner and in `CHAIN FAILED:`, and
nothing was started: the throwaway ended with its one seed commit and no merge.
`--plan` while detached printed the refusal in place of all three commands.

**Red first, reproduced by me and not quoted from the author.** I restored
`seal-chain.cjs` from `8a7da54` into a copy of `gen/` and ran the NEW cell against it:

```
not ok 1 - GUARD-1   error: "Cannot read properties of undefined (reading 'slice')"
not ok 2 - GUARD-a3  error: 'Missing expected exception: a3 must refuse main by name'
not ok 3 - GUARD-b1  error: 'Missing expected exception: b1 must refuse main by name'
     ok 4 - GUARD-b6  (R1's fix already guarded that stage)
not ok 5 - GUARD-2   error: 'chain.writeTargetFor is not a function'
# pass 2   # fail 4
```

Red in exactly the four places R2 named, green in the one R1 had already closed.

### M2: the narrative tolerance decided by ARITY. **FIXED, and R2's number is corrected upward.**

`compare.cjs` now counts the TOP-LEVEL ARGUMENTS of the head `withoutMessage()` returns
(`topLevelArgs`), skipping string, template and regex literals whole, and `isMessageArg`
answers from a table read off node:assert's signatures: `assert`/`ok`/`ifError` need one
preceding argument, the `equal`/`deepEqual`/`throws` family need two, and anything untaught
answers two. `classifyLine` requires BOTH sides to pass it before it says `narrative`.

**I re-derived the measurement in the reading room, from the committed blobs at `82c98f8`,
with my own three-line reimplementation of the old rule beside the new one**, over exactly
the corpus `compareFile()` compares (`b-package.cjs`, the six s8-* cells, the F6/F7 cell,
the five child-spec cells):

```
assert lines ending in a string literal        860
of those, the last string is an expected VALUE 144
mutated VALUE tolerated by the OLD rule        144
mutated VALUE tolerated by THIS rule             0
of those, the last string is a MESSAGE         716
mutated MESSAGE still prose (the other half)   716
```

Byte for byte the numbers REPLAY-14 prints. **The author's correction of R2 is UPHELD.**
R2's "144 assert lines" is in fact the VALUE class, not the lines ending in a string; and
R2's "29 tolerated" was an undercount, because the old rule never asked arity at all, so it
forgave every one of the 144. The finding was right and it was five times larger than
stated.

Where those 144 live matters and I measured it per file, which neither review did:

```
b-package.cjs                                   54 lines ending in a string,  0 VALUE
the six generated s8-* cells                    75 lines ending in a string,  0 VALUE
the F6/F7 pinned-unchanged cell                 15 lines,                     7 VALUE
the five child-spec cells                      716 lines,                   137 VALUE
```

**Zero VALUE lines in b-package.cjs and zero in all six mirrored cells.** That is the
arithmetic behind R2's and the author's shared conclusion that none of the S8 facts was
ever in doubt, and it is now a measurement rather than an argument about `editRunner`.

I also attacked the new rule with thirteen hand-built lines. It answers `different` for a
mutated expected value in every shape I could build - nested call, template literal, a
comma inside the value's own string, a regex inside an arrow, an unknown `assert*` helper -
and `narrative` for a mutated message in every shape where the message really is the
message. One entry of the table is wrong and I report it as note n1 below.

### M3: the `DECISIONS:524 N1` sentence. **FIXED. The eleven paths, re-measured.**

The test is no longer "stands under a declared child root". `executionClosure(root, rev,
decls)` asks the question `:524 N1` asked: is the path a TARGET IN A DECLARED CHILD'S ARGV
(the runner's own test, because `proposed()` puts every child argv target into
`executionPins`), or is it REACHED BY IMPORT from one, transitively, over the relative
specifiers of the GIT BLOBS at the post head, or neither. Only "neither" gets the ruling
and the `--exclude` invitation. The children are now resolved BEFORE `buildPackage` runs,
which is what made the question answerable at all.

The cell prints the table from `REPORT.json` on every run, so it cannot drift from the
code. My run, both modes, identical:

```
class      child                      path
none       -                          rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs
none       -                          rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs
argv       s8-sup-source-carriers     rebuild/m4/workout/test/s8-supersede-source-carriers.test.cjs
argv       s8-sup-inherited-carriers  rebuild/m4/workout/test/s8-supersede-inherited-carriers.test.cjs
argv       s8-sup-defect-witnesses    rebuild/m4/workout/test/s8-supersede-defect-witnesses.test.cjs
argv       s8-sup-writers-differential rebuild/m4/workout/test/s8-supersede-writers-differential.test.cjs
argv       s8-sup-second-gate         rebuild/m4/workout/test/s8-supersede-second-gate.test.cjs
argv       engine-files-differential  rebuild/m4/workout/test/s8-engine-files-differential.cjs
import:1   today-17                   rebuild/m3/w7-preview/today/local-source-basis.mjs
import:1   a0-journeys                rebuild/m4/workout/engine-history.cjs
import:1   d-real-shape               rebuild/m4/workout/lift-correspondence.cjs
```

That is R2's table line for line. The six `argv` rows and the three `import:1` rows now get
sentences that say a declared child executes the path and that this is NOT the `:524 N1`
shape; the import rows also say `proposed()` does not pin that class, so declaring it is a
real decision. Only the two `none` rows - the two the PM really did rule undeclared at
`:524 N1` - keep the ruling and the `--exclude` invitation. The generator declares nineteen
`new` paths in all; the eight R2 did not tabulate stand under the child root and split
6 argv / 2 import, and my run prints that too.

REPLAY-4 now asserts both ends and a third thing besides: every `none` path carries the
ruling, no path a child executes carries it or is invited to `--exclude`, and the `none` set
EQUALS the extra set exactly. The `CELLS` half of that is written without help from
anything this round added (it reads `TODO.md` by path), which is why it goes red against
`8a7da54`.

Why the old rule was false for nine of eleven is arithmetic and I checked it: the only
`--child-root` the replay passes is `rebuild/lanes/d/p3-real-shape/`, and none of those
nine paths starts with it. The 224 committed roles are unchanged by the fix (REPLAY-4
compares role, pre and post for all of them and every one is identical), so no fact moved.

### M4: the honest headline. **FIXED, with a residue I report as note n2.**

`internal()` is a third counter beside `fact()` and `selfCheck()`, and it took exactly the
19 R2 enumerated: REPLAY-2's 12 (the generated cell against a string literal) and REPLAY-6's
7 (the generated spec, and each generated ancestor spec, against the sha of the runner THIS
RUN made). The cell prints all three counters under their own headings, the README states
`779 of 788`, and the report leads with `788 / 779 / 19 / 6`. I verified the arithmetic
rather than the prose: R2's 776 cross-side facts plus the 12 new byte-for-byte ancestor
comparisons of N1 is 788, and 788 + 19 + 6 = 813 = R2's 795 + 12 + 6. It closes.

## 3. The seven notes of R2

**N1 (the ancestor spec FILES were never compared). LANDED.** REPLAY-6 compares each of the
six generated ancestor specs byte for byte with the committed blob, with only
`tooling.runnerSha256` swapped, at BOTH ends of the round (the base the generator edited
and the post head the round committed): twelve new cross-side facts, all identical in both
my runs. Key order and spacing are now held by a cell instead of by a reviewer's hand,
which is precisely what R2 asked for.

**N2 (two `sealgen-replay-*` folders per run). LANDED.** REPLAY-15 removes only the folders
`mkdtempSync` returned in this process, and the chain guard cell does the same with its
throwaway repositories. Measured after my three runs: `removed 2 scratch folder(s) this run
created` twice, `%TEMP%\sealgen-guard-*` count **0**, and the `sealgen-replay-*` count did
not rise. 24 folders from earlier rounds are still there; they are not this hand's to
delete and the author says so.

**N3 (`--released` emits a role the runner refuses today). LANDED.** The TODO entry a
released path writes now carries the clause in full: the role does not exist until
S9-RELEASE-SPEC hunk H1 lands, `PRODUCT_ROLES` at `b-package.cjs:351` is the five-member
list, `:1519` refuses anything else with `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY`, and
the hunks go in first and the declaration second. The README says the same thing as an
ORDER.

**N4 (`--plan` printed `$ "node" rebuild/...`). LANDED.** `pretty()` strips the quotes with
the path. My `--plan` output: `$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9`.

**N5 (the README declined the number). LANDED, and I would still not lean on the number.**
The README now gives 1.5 hours a child with a table, and names its weakest input (the 2.5 h
is the PM's recollection). That is the honest shape. The arithmetic in the table does not
quite close, which is note n5.

**N6 (`pinned-unchanged` is never proposed). LANDED, and correctly narrowed.** When a path
would be `new` but `pre === post` and it IS a declared child's argv target, the generator
declares `pinned-unchanged` and keeps the TODO line naming the child; otherwise the R1 N8
refusal stands and now says why the fifth role does not apply either. I checked the
precondition in the code rather than the comment: `role === 'new'` is reachable only when
`!pinned`, so every path taking this branch satisfies the runner's "not parent-pinned"
requirement. No path in the S8 round takes it, so the replay is unmoved.

**N7 (requirement (g) has never run to completion). LANDED, with a second witness.** See
section 1. The two defects the author's own first completed run found - `tapPassNeedle`
blind to CRLF, and a needle measured from inside `node --test` being no needle at all - are
both real, both fixed, and both now have controls (REPLAY-16 over LF and CRLF; REPLAY-13
asserting the `NODE_TEST_CONTEXT` refusal fires by name every run, which it did in both of
my runs). Finding them was worth more than the round's other eleven items together.

## 4. My own notes. None is blocking.

### n1. `MESSAGE_ARITY.fail = 0` is the one entry in the table that is not node:assert's

`assert.fail` has two signatures. The modern one is `fail(message)`, which this rule never
sees because `withoutMessage` needs a comma before the closing string. The legacy one is
`fail(actual, expected, message, operator)`, and there the SECOND argument is an expected
value. With `need = 0` any last string passes:

```
assert.fail('x', 'y');   ->  args=1  isMessageArg=true  ->  mutated 'y' classified NARRATIVE
```

Measured, so this is not theory about the table but about the corpus: there are ZERO such
lines in the files `compareFile()` compares at `82c98f8`, which is why `tolerated` is 0 and
why this changes no number today. It is worth one character (`fail: 2`) before the rule is
trusted on a family nobody has read, because it is the only entry that errs in the
forgiving direction, which the file's own comment says is the direction it must never err
in.

### n2. Two facts are still in the wrong bucket, and M4 was about exactly that

The split is right for the 19 R2 enumerated. Two more did not move:

- `replay-s8.test.cjs:396`, `fact('the GATE-SUPERSESSION line is found in the ledger by its
  sha256 alone', typeof gate === 'string', true)`. `gate` is a line of the COMMITTED ledger,
  found by a sha the COMMITTED spec records. By the cell's own definition that is a
  `selfCheck`, not reproduction. It is counted in the headline in both modes.
- `replay-s8.test.cjs:365`, `fact('the differential child is green here', run.status, 0)`.
  That is a measurement made in THIS tree against the literal 0: neither generated against
  committed nor generated against generated. It runs only in the declined branch, so it is
  in the default-mode 788 and not in the 811.

So the strictest honest headline is **786 cross-side / 19 internal / 7 self-checks** in
default mode and **810 / 19 / 7** in the 25-needle mode. The neighbouring line 366 (the
committed needle standing at the head of a line of a run this tree produced) IS cross-side
and I would leave it where it is. Two facts in 788 is noise; I raise it only because M4's
whole point was that the headline should not need a footnote.

### n3. The README says `childEnv()` answers `exact: true` here, and the shipped code says it cannot

`README.md`, the paragraph "Before you trust a needle": "the reference build now succeeds
here: `childEnv()` answers `exact: true` and REPLAY-13 exercises the green branch instead
of the refusal." As shipped, REPLAY-13 ASSERTS THE OPPOSITE, every run:

```
assert.equal(ce.inTestRunner, true, 'this cell runs under node --test, so childEnv must see it');
assert.equal(ce.exact, false, 'and must refuse, whatever the reference build did');
```

and my run printed `needle env: NOT children()'s env here - this process is itself a
node --test child`. The sentence is R1-era text left standing after the 9.12 fix made it
false. What is true is the half that matters: `referenceOk` is now true in
`%TEMP%\earned-sealgen`. The README is the file the PM reads before S9, and this is the one
paragraph in it that would make a PM believe a needle measured from a test is a needle.

### n4. The decline message names the long switch only

`GEN_REPLAY_NEEDLES` now works, and it is the spelling the ticket and the PM use. The
sentence the cell prints when it declines names only
`GEN_REPLAY_NEEDLES_AT_POST_HEAD=1`. A PM reading the decline will set the long name; it
works either way, so this is one clause in one string.

### n5. The 1.5 hours does not follow from the table that claims to show the arithmetic

The table's own rows are: 2.5 h of preparation; six of eight commits are mechanical, about
three quarters of it; the generator does 779 of 788 of that. 2.5 x 0.75 = 1.9 h, and 779/788
of 1.9 h is 1.85 h, not 1.5 h. The missing step is the 33 TODO entries a human reads and
answers, which the row above mentions but the arithmetic does not carry. Either put that
step in the table or say the 1.5 h is 1.9 h less a judgment allowance. R2 asked for a number
with its measurement behind it, and this is a number with most of its measurement behind
it.

### n6. GUARD-1's standing check is a keyword list, and it is shorter than git is

`test/chain-guard.test.cjs:38`: `/\b(merge|push|commit|rebase|reset|checkout)\b/`. That is
the mechanism the fix round offers as the reason the next writing stage cannot dodge the
guard the way a3 and b1 did. It does not name `pull`, `am`, `apply`, `cherry-pick`,
`revert`, `stash`, `restore`, `clean`, `tag`, `update-ref`, `branch -f` or `worktree add`.
A stage whose command is `git pull --ff-only origin <tip>` would pass GUARD-1 today and
write the worktree it stands in. The cell is the right cell and the list is one edit.

### n7. The guard cell tests a seam the command line does not use

`chain-guard.test.cjs` passes `{root: <throwaway>}` to `commandFor`. `main()` parses no
`--root` and no `--repo`; in real use `writeBranch` is given `REPO`, resolved from
`__dirname`, which is also what `startStage` does `cd /d` into. That is the right design
and the reason the guard is sound, but it means the cell proves the guard and not the
wiring. I closed that gap by hand in section 2 and it holds. One line in the cell that runs
the script as a child process from a throwaway repository would keep it closed without a
reviewer.

### n8. One sentence of the author's report is not true of the disk

Section 9.12: "`%TEMP%\earned-s5\rebuild\conform\engines` held nothing to copy". It holds
`build-engines.mjs`, `engine-main.cjs` (813,696 bytes) and `engine-old.cjs` (792,806
bytes). The substance is right and I confirmed it independently: no child asked for them,
because `Reference.create(root)` builds its own bundles and succeeded in my scratch
worktree without them. Only the sentence is wrong, and the report is the document the next
hand will believe.

## 5. "Using it for S9": I checked every claim in it against S8.json and the ledger

The ticket asked for this section and it is there, `README.md` "Using it for S9". It is the
part of this round I checked hardest, because it is the part the PM will act on, and I
could not find an error in it.

**The ORDER.** It states it as an order and gives the reason: `released` does not exist in
the runner until S9-RELEASE-SPEC hunk H1 lands, so (1) the runner hunks including H1, (2)
the generated tree and `--ci --package S9`, (3) the RELEASE-FROM-SEAL token line with the
THEME and BRIEF-BY-SHA lines, (4) re-run with `--post-head HEAD --stage all` so every post
sha and every needle is measured on the landed tree. It also says not to start until the
spec is accepted (round 3 was REJECT at `DECISIONS:546`, round 4 is dispatched), and that
sections B and D, which the generated hunks touch, are accepted by three reviews. That is
the right order and the right caveat.

**The two released paths.** `rebuild/m3/w7-preview/today/preview.css` and
`rebuild/m3/w7-preview/today/build.mjs`. Measured by me in `packages/S8.json`: both are in
S8's `product` with role `carried`, so `pre` really can come from the parent's own post as
the README says, and **neither is a child argv target in S8**, so the B.6 / risk R2 check
the README claims comes for free really does.

**The four S9-TODAY-CARRY pinned paths.** `today/today-app.cjs` (carried),
`today/test/view.test.mjs` (carried), `today/test/adapter.test.mjs` (carried) and
`.github/workflows/rebuild.yml` (edited). All four are in S8's `product`, so the README's
"measured: the generator re-hashes each from Git and gives it `edited` or `carried` on its
own" is true. `today-model.cjs` is NOT in S8's product, which is why the README calls it
unpinned; `DECISIONS:539` names today-model.cjs, the pinned today-app.cjs hunk,
rebuild.yml and the adapter.test.mjs identity lines, and the README agrees with it.

**PASSPHRASE-NORMALIZE.** I read `DECISIONS:543` (B) whole. The README's row is faithful to
it: edited `import-bundle.mjs`, `import-screen.mjs`, `import/test/page-bundle.test.mjs`;
`rebuild/m3/setup/port/passphrase.cjs` new AND SEALED because it decides key material on the
phone; the execution pin on `page-bundle.test.mjs` with its two counts re-measured 142 to
143 and 20 to 21; the three lane cells with a child root and a CI step that :543 and its R2
call a guard rather than a convenience; and a CI home for
`rebuild/m3/w6/test/local-import.test.mjs`, which :543 also demands and which the README
correctly hands to the PM because it stands under no child root.

**The two pinned-unchanged files.** `today/gym-model.mjs` and `today/checkin-app.mjs`.
Measured: neither is in S8's `product` and neither is a child argv target in S8. So the
README's warning is exactly right and it is the N6 rule speaking: the generator will NOT
propose `pinned-unchanged` for these two, and the PM must declare them by hand and check
that `TODO.md` names them. That is the one place where a PM who trusted the generator
without reading the README would get a smaller package than the seal needs, and the README
says so before it happens.

## 6. The stop-the-line re-checks, all of them re-run at this head

- **No read-only file of the lane moved.** `git diff --name-only 2758edc..HEAD` is
  fourteen files: the three lane B review and report markdowns and the eleven files under
  `rebuild/lanes/b/tooling/gen/`. Not `b-package.cjs`, not a `packages/*.json`, not a
  receipt, not an acceptance artifact, not `.github/workflows/*`, not `rebuild/engine`,
  `rebuild/coach` or `rebuild/DECISIONS.md`.
- **`--full` is unreachable.** Re-run on the throwaway: `--stage a7` without the flag
  prints the refusal and returns 3; `--stage a7 --pm-runs-full` STILL refuses to run it,
  names the PM's own `s<N>-full<K>.cmd` and returns 3. No string `--full` is passed to any
  spawn anywhere in `gen/`.
- **No junction is ever created.** No `mklink`, no `symlink`, no `junction` in any file of
  `gen/`. Nothing reads `rebuild/conform/private`, nothing names `EarnedPort` or
  `port-real.log`. I created none either: my scratch worktree got three `node_modules`
  junctions mirrored from this worktree's own and nothing else.
- **`DECISIONS.md` is only ever READ, and only as a git blob**, at three call sites
  (`new-child.cjs:625`, `replay-s8.test.cjs:390`, and the sha helper). There is no
  `appendFileSync` in `gen/`.
- **The only writes** are `writeOut()` under the `--out` folder the caller names, the stage
  `.cmd` under `%TEMP%`, and the two cells removing the `mkdtemp` folders they created
  themselves. No `rm` touches anything else.
- **The chain branch cannot be pushed by this script**, now from three directions: b6
  refuses `rebuild/t2-client-core` by name, b6 names the branch on both sides of the
  refspec so `HEAD` can never be the source, and b7 (the fast-forward) is a `hand` stage.
- **No U+2013 and no U+2014, and no CR byte**, in any of the fourteen blobs at this head.
  Checked by code point over `git cat-file blob`, not by eye.
- Every product sha256 still comes from `git cat-file blob <rev>:<path>`. The needle path
  is the only thing that reads a working tree, and it reads it by RUNNING it.

## 7. `--needle-repeat 2`, which had never run either, and one note it produced

The author's own open item 9.14.2 is that `--needle-repeat` has still never run. I ran it,
from the same scratch worktree at `82c98f8`, as a plain shell process and not from inside a
test: `new-child.cjs --id S8 ... --stage all --needle-repeat 2 --out %TEMP%\sealgen-r3-rep2`.

```
declared 226 paths {"edited":24,"carried":182,"superseded-by-child":1,"new":19}
children 25, needles measured 25, TODO 33      exit 0
```

and reading `needles.json` against `82c98f8:packages/S8.json` by name:

```
children 25   measured 25   how says "reproduced over 2 runs" 25   equal to the committed needle 25
NO DIFFERENCES
```

**Fifty child runs, no disagreement, and every needle still the one S8 sealed.** That is
requirement (g)'s last unexercised branch, and it is green. The declared-path counts are
also unchanged from R2's standalone run (226, 24/182/1/19, TODO 33), so the M3 and N6
changes moved no role.

### n9. `--needle-repeat` agrees with itself by PREFIX, and a flaky `# pass N` can slip through

`new-child.cjs:461`. Run 1 produces the needle; the reproduction check on runs 2 and 3 is
`M.needleStandsAtLineStart(x.out, needle)`, which is `new RegExp('^' + escapeRe(needle),
'm')` - a PREFIX match at a line start, because that is `children()`'s own predicate. For
the reproduction question that is too weak. If run 1 prints `# pass 4` and run 2 prints
`# pass 42`, `^# pass 4` matches and the needle is recorded "reproduced over 2 runs".

A drifting pass count is the exact flake `--needle-repeat` exists to catch, and 4 to 42,
3 to 30-39 and 1 to 1x are the shapes where it drifts invisibly. The prefix predicate is
right for matching a needle against a child's stdout, and exact equality of
`tapPassNeedle(x.out)` is right for asking whether two runs agree. It is one comparison,
and it matters most on the run that feeds a sealed package, which is the only run the
README asks the PM to use `--needle-repeat 2` on.

## 8. For the PM

**Accept it for the S9 preparation round.** The four MAJOR notes are closed and I exercised
each one rather than reading it: the merge guard on the SHIPPED command line from a
throwaway repository standing on `main`, on `rebuild/t2-client-core` and detached; the
arity rule re-derived from the committed blobs with the old rule reimplemented beside it;
the eleven `:524 N1` paths re-measured and each one now carrying the sentence that is true
of it; the headline split three ways and the arithmetic closing. The seven notes are
landed. And the thing R2 said had never happened has happened twice now, once in the
author's hands and once in mine, in different worktrees, with the same answer: **25 of 25
needles equal the ones S8 committed.** `--needle-repeat 2`, which the author still lists as
never run, ran here too: fifty child runs, 25 of 25 reproduced, 25 of 25 still equal to the
seal.

The two defects the first completed needle run found are the most valuable thing in this
round and they were found only because R2 refused to accept a green that had never run. A
needle read from inside `node --test` was empty, exit 0, and indistinguishable from a
passing child. That would have reached a sealed package.

What I would do, in the order I would do it, and none of it blocks S9 preparation:

1. **n3 before the PM reads the README again.** One sentence in it says `childEnv()`
   answers `exact: true` in this worktree; the shipped cell asserts the opposite every run.
   It is the only sentence in this folder that could talk someone into trusting a needle
   measured from a test.
2. **n6 and n1 whenever the folder is next open.** One regex and one character. Both are
   the "the next person cannot dodge this" half of guards this round just built.
3. **n9 before the run that feeds the sealed S9 package**, since that is the only run the
   README asks for `--needle-repeat 2` on, and the reproduction check is the one part of it
   that is weaker than it looks.
4. **n2, n5, n8** are bookkeeping: two facts in the wrong bucket, an arithmetic step left
   out of a table, and one sentence of the report that is not true of the disk.

One thing worth saying plainly, since the point of this folder is speed. What it now
reproduces, in about 20 seconds of machine work plus about 5 minutes when it measures all
25 needles, is 802 of 811 mechanical facts of the S8 round: every one of the 224 declared
paths with its role and both shas, the three runner hunks byte for byte, six generated
cells of which four are byte-identical, six ancestor specs byte for byte, and all 25
needles. What it does not reproduce is a sentence of prose, a judgment, or one of the three
token lines, and it says so in 33 named places. That division is why the number is worth
something, and this round did not move it by loosening anything: every change I checked
made the cell stricter than it was.

## 9. What I ran, so the next hand can repeat it

```
%TEMP%\earned-sealgen  (rebuild/b-seal-gen, c4ebd318, git pull --ff-only: already up to date)
  node --test --test-reporter=tap rebuild/lanes/b/tooling/gen/test/chain-guard.test.cjs
  node --test --test-reporter=tap rebuild/lanes/b/tooling/gen/test/replay-s8.test.cjs
  node rebuild/lanes/b/tooling/gen/seal-chain.cjs --id S9 --plan

%TEMP%\sealgen-r3-wt   (git worktree add --detach ... 82c98f8, three node_modules junctions
                        mirrored, gen/ copied in, NO private junction; removed afterwards)
  GEN_REPLAY_NEEDLES=1 node --test --test-reporter=tap ...\test\replay-s8.test.cjs
  node ...\gen\new-child.cjs --id S8 ... --stage all --needle-repeat 2 --out %TEMP%\sealgen-r3-rep2

%TEMP%\sealgen-r3-throwaway  (git init, one seed commit, three branches, its own TEMP)
  the shipped seal-chain.cjs CLI, stages a3/b1/b6, on each branch and detached, --dry-run

%TEMP%\sealgen-r3-red  (gen/ copied, seal-chain.cjs restored from 8a7da54)
  node --test ...\test\chain-guard.test.cjs        -> # pass 2  # fail 4, the red-first proof

the reading room   the arity corpus re-derived from the blobs at 82c98f8 with the old rule
                   reimplemented beside the new one; S8.json read for every S9 README claim
```

Every folder above is one I created and I removed the ones that were mine to remove. Two
runs of the replay created two scratch folders each and REPLAY-15 removed all four.
