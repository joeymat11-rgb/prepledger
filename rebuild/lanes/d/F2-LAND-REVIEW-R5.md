# F2-LAND REVIEW R5: the narrow check of round 4c. The six rows kill their own variants and are red alone, G51 is a readable kill, the deferral changed no row's meaning, and the report's three named places are true

Independent reviewer, FIFTH and final round, NARROW BY ORDER (`DECISIONS:577 (5)`), reviewing the
ASTRA build of round 4c that the PM read, ran and pushed as one commit. Branch
`rebuild/d-f2-land` at `f17db4cf943b9e53da6d47b2769c6110dbee228c`, on top of the reviewed
`5ed25b9c`, cut from `b9d8d6454ef951bc24175bb04b05adadf263c7d6`.

I did NOT hunt for new survivors. `DECISIONS:577` struck that job and carries the remainder as a
named debt; this file records only what the PM's item (5) asked for.

Read in the farm (`/home/claude/farm/wt/rebuild__d-f2-land`, synced to `f17db4cf`). Run on the PC
(`%TEMP%\earned-f2land`, `git fetch` then `git merge --ff-only`, `5ed25b9..f17db4c`, working tree
clean before and after, nothing edited but this file) and on linux (farm scratch `f2lrevE` cut from
the pushed head). Node v24.19.0 on the PC, v22.22.2 on linux. No module byte, no cell byte, no
sealed byte and no workflow line was changed by me: every mutant was applied in a worktree copy,
restored immediately, and the module's sha256 re-compared after every single one.

## VERDICT: ACCEPT WITH NOTES

Nothing in the reject list happened. Every row kills its own variant and is red alone among the
behaviour rows on both operating systems; no byte of the module or of `projector.test.mjs` moved;
no row was weakened, and I proved that by running the cell BOTH ways; the three named report
places are true, and I measured the two facts section 12 item 4 asserts rather than reading them.
Two notes follow at the end. Neither is owed as a change to this branch.

## (1) THE DIFF, THE BLOB IDENTITY AND THE WORKFLOW HUNK. ALL HOLD

`git diff --numstat 5ed25b9 origin/rebuild/d-f2-land` is exactly THREE paths and nothing else:

```text
3	3	.github/workflows/rebuild.yml
271	143	rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md
90	2	rebuild/lanes/d/f2/guard-coverage.test.mjs
```

`git rev-parse` at `f17db4cf` gives the two blob ids the order names, unchanged by round 4c:

| file | blob at `f17db4cf` | sha256, identical on both machines |
|---|---|---|
| `rebuild/m4/workout/setup-tags.cjs` | `68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d` | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` |
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | the same blob again | the same string |
| `rebuild/lanes/d/f2/projector.test.mjs` | `cd4f4b29e1d15c09816c7ec0ebec379c159afce2` | `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` |
| `rebuild/lanes/d/f2/guard-coverage.test.mjs` | `91297a68de11b0b462986807c7a7c03106bc2783` | `78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7` |

`sha256sum` on linux and `certutil -hashfile` on the PC print identical strings. The module is
still 198 lines and still imports nothing.

THE WORKFLOW HUNK IS SIX TOKENS AND NOT ONE OTHER BYTE. `git diff --word-diff=porcelain 5ed25b9
HEAD -- .github/workflows/rebuild.yml`, changed tokens only:

```text
-74
+81
-74
+81
-forty-four
+fifty-one
```

The `run:` line is untouched, the step name is untouched, the deliberately-absent-cells paragraph
is untouched, and nothing outside the F2 comment block moved. The regions after `:232`, `:297` and
`:306` are other lanes' and are untouched. The three changed lines contain no non-ASCII byte; the
author report and `guard-coverage.test.mjs` are pure ASCII, LF, with no U+2013 and no U+2014.

## (2) G45 TO G50, EACH KILLED BY R4'S OWN SINGLE-TERM VARIANT AND RED ALONE. 6 of 6, BOTH MACHINES

METHOD. One exact string replacement per variant, the anchor asserted to occur EXACTLY ONCE in
the module before the write (a variant whose anchor count is not 1 is skipped and reported, and
none was). Then the exact CI step command at `rebuild.yml:288`,
`node --test rebuild/lanes/d/f2/projector.test.mjs rebuild/lanes/d/f2/guard-coverage.test.mjs`,
with `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`, parsed from the TAP reporter so the
red rows are named and not counted. The original bytes are restored and the sha256 re-compared
after every run: `d0436809...fc94d` every time, on both machines. `git status --porcelain` in the
PC worktree is empty after the sweep.

Baseline before anything: **81 tests / 81 pass / 0 fail, exit 0**, on the PC and on linux.

| row | the single term removed, as R4 named it | result | red rows | linux | win32 |
|---|---|---|---|---|---|
| `F2-G45` | `:18` `closed()`'s ` && keys.every(k => own(x, k))` | 81/79/2 | `F2-G22`, `F2-G45` | red alone | red alone |
| `F2-G46` | `:41` `\|\| !descriptor.enumerable` in `cloneData` | 81/79/2 | `F2-G22`, `F2-G46` | red alone | red alone |
| `F2-G47` | `:42` the whole array index-key condition, to `false` | 81/79/2 | `F2-G22`, `F2-G47` | red alone | red alone |
| `F2-G48` | `:58` `typeof a !== 'object' \|\| ` in `equal()` | 81/79/2 | `F2-G22`, `F2-G48` | red alone | red alone |
| `F2-G49` | `:58` ` \|\| typeof b !== 'object'` in `equal()` | 81/79/2 | `F2-G22`, `F2-G49` | red alone | red alone |
| `F2-G50` | `:118` ` \|\| !plain(snapshot)` | 81/79/2 | `F2-G22`, `F2-G50` | red alone | red alone |

Six for six, on two operating systems, row for row identical. `F2-G22` is the byte pin and reds on
every module change by construction, which is why "red alone" is counted over the behaviour rows.
Each of the six is therefore red ALONE among the behaviour rows, which is exactly what was ordered.

### G51 under the `:27` variant and under the `:38` variant

The two variants are `:27` `if (value === null || ['string', 'boolean'].includes(typeof value))
return value;` disabled, and `:38` `if (array && key === 'length') continue;` disabled, each
applied on its own. **Both print the same thing, on both machines:**

```text
# tests 52
# pass 21
# fail 31
```

Twenty-nine behaviour rows are red (`F2-G01` to `F2-G12`, `G14`, `G16`, `G17`, `G20`, `G21`, `G23`,
`G24`, `G30`, `G31`, `G38` to `G41`, `G43`, `G44`, `G48` and `G51`), plus `F2-G22`, plus a
file-scope stop for `projector.test.mjs`, which still builds its projector at file scope. That is
31, and the 52nd test is the `projector.test.mjs` file itself.

**`F2-G51` IS AMONG THE RED ROWS AND ITS MESSAGE IS READABLE.** Byte for byte the same on both
machines, and it names the row's own sentence rather than a stack:

```text
not ok 51 - F2-G51 the shipped taxonomy constructs a projector that accepts and projects
  failureType: 'testCodeFailure'
  error: |-
    Got unwanted exception: the shipped taxonomy must construct inside this behaviour row
    Actual message: "SETUP_TAGS_INVALID"
  code: 'ERR_ASSERTION'
```

This is what the PM ordered in `DECISIONS:577 (2)`: the two variants that used to stop both cell
files at file scope now have a row that says, in words, that construction failed. G51 is NOT an
isolated kill for either variant, and the report says so in terms ("These are not isolated G51
kills"); the measured red set above is the report's red set item for item.

## (3) THE ONE STRUCTURAL CHANGE. NO ROW LOST ITS MEANING, AND I PROVED IT BY RUNNING THE CELL BOTH WAYS

What changed at `guard-coverage.test.mjs:15` to `:21`: the shared projector is no longer built by
a file-scope `const projector = createSetupTagProjector({ taxonomy })` and destructured; it is
built by `const shared = () => projector ??= createSetupTagProjector({ taxonomy })` on first use,
and the three names are rest-argument wrappers over it.

I did not argue this from the source. I ran the CI step command with the cell in BOTH forms, the
landed lazy one and an eager one I reconstructed from the deleted lines, against the unmutated
module and against three behaviour mutants, and compared the per-row pass/fail VECTOR (every row
name with its verdict, hashed):

| module | lazy cell | eager cell | row-vector digest agrees |
|---|---|---|---|
| unmutated | 81/81/0 | 81/81/0 | YES, `557eba8d0e55cd2f` both |
| `:18` `keys.every` removed | 81/79/2, `G22` `G45` | 81/79/2, `G22` `G45` | YES, `9fc4d874d6de4020` both |
| `:118` `!plain(snapshot)` removed | 81/79/2, `G22` `G50` | 81/79/2, `G22` `G50` | YES, `c799a4f92dab9f7c` both |
| `:36` array count disabled | 81/79/2, `G22` `G42` | 81/79/2, `G22` `G42` | YES, `e084605067ef0bad` both |
| `:27` construction broken | 52/21/31, `G51` red and readable | **2/0/2, no row registers** | NO, and that is the point of the change |

Every row still runs the same assertions against the SAME projector: `??=` memoizes, so exactly
one projector instance serves the whole file, built from the same `taxonomy` literal at `:14`, and
no row mutates `ENGINE_MG` or `REGION_MG` (`F2-G21` only reads them). No row reads any other member
of the projector object through the shared names; the rows that need a different taxonomy already
build their own projector in the row body (`:88`, `:95`, `:394`, `:732`, and now `:765`).

`projector.test.mjs` IS BYTE-UNCHANGED AND STILL CONSTRUCTS AT FILE SCOPE: blob
`cd4f4b29e1d15c09816c7ec0ebec379c159afce2`, line 9 `const projector = createSetupTagProjector({
taxonomy });`, line 10 the destructure. Measured, not read: under `:27` and `:38` that file still
stops before registering a test, and it is the file-level failure counted above.

## (4) THE G41 COMMENT SENTENCE. PRESENT, AND IT CHANGES NO ASSERTION

Two comment lines were added above `F2-G41` and nothing else in that region moved:

```text
+// The RangeError is the engine's stack limit, not a property of this module;
+// a larger runner stack can clone this input and then refuse it BY NAME.
```

That is R4's note answered in R4's own words. The row's three assertions are untouched, and `G41`
still reds on the `cloneData` depth tripwire and on nothing else but `G22`.

## (5) THE REPORT: THE THREE NAMED PLACES, AND A SPOT-CHECK OF THE PARTITION

**Section 7.5 lists the remaining survivors with NO classification word. TRUE.** It is headed "THE
ELEVEN REMAINING SURVIVORS: LIST, NO CLASSIFICATION" and lists eleven lines (`:16`, `:19`, `:29`,
`:41` `!own(descriptor, 'value')`, `:58` `b === null`, `:74`, `:86`, `:124`, `:154` twice, `:181`).
The words "redundant", "covered", "safe" and "harmless" do not appear anywhere in the section; the
only verdict-shaped sentence is the negation the PM ordered, "No covering guard is inferred for any
remaining term and none is described as removable." Section 7.2, which still carries the old
redundancy explanations, is explicitly labelled "history, not a current redundancy verdict".

**The section FOR THE S10 BRIEF: ONE NAMED DEBT says what `DECISIONS:577 (4)` ordered. TRUE.** The
order asks for two things, how many guard terms still have no behaviour row after five looks, and
that a future edit is reviewed term by term. The section gives both by name
(`F2-GUARD-TERM-COVERAGE`, "eleven guard terms ... still have no behavior row after five looks",
"A future edit of this module must therefore be reviewed term by term and never trusted to this
cell alone"), records the four counts the PM recorded, and closes the hunt rather than commissioning
a fifth.

**Section 12 item 4 carries "not frozen BY THIS MODULE" and the companion fact. TRUE, and I
measured both rather than reading them.** On linux, against the shipped catalogue:

```text
isFrozen(state from createCleanInitState) = true
projectSetupTags(state, {setup, tags: null, ...}) === state : true
validateSetupTags(undefined, null) = true    validateSetupTags(42, null) = true
validateSetupTags('nonsense', null) = true   validateSetupTags([1,2,3], null) = true
validateSetupTags({hostile:true}, null) = true
validateSetupTags(<proxy that throws on get, ownKeys and getPrototypeOf>, null) = true
```

So the item's two sentences are exact: the module neither clones nor freezes the returned state,
the object a caller sees is frozen only because `createCleanInitState` froze it, and a host that
validates before tags are chosen has validated nothing.

### The partition spot-check: ten variants of my own choosing, five called killed and five called survivors

The report's section 7.4 claims 141 variants, 130 killed by behaviour rows and 11 survivors. I did
not rerun the generator. I chose ten terms myself, built each one from the module source, and ran
the CI step command. Identical on the PC and on linux, ten for ten:

| the report calls it | line and term I removed | measured | red rows |
|---|---|---|---|
| SURVIVOR | `:16` `plain()`'s ` && !Array.isArray(x)` | 81/80/1 | `F2-G22` only |
| SURVIVOR | `:19` `day()`'s `/^\d{4}-\d{2}-\d{2}$/` test | 81/80/1 | `F2-G22` only |
| SURVIVOR | `:58` `equal()`'s `b === null` | 81/80/1 | `F2-G22` only |
| SURVIVOR | `:124` ` \|\| !own(snapshot, e.id)` | 81/80/1 | `F2-G22` only |
| SURVIVOR | `:181` `!plain(facts) \|\| ` | 81/80/1 | `F2-G22` only |
| KILLED | `:15` `text()`'s ` && x.trim().length > 0` | 81/74/7 | `G03 G06 G14 G15 G22`, `F2-02`, `F2-PE03` |
| KILLED | `:18` `closed()`'s `Object.keys(x).length === keys.length` | 81/72/9 | `G06 G07 G22 H02`, three `F2-02` rows, `F2-PE02`, `F2-PE03` |
| KILLED | `:68` ` \|\| new Set(muscles).size !== muscles.length` | 81/79/2 | `G03`, `G22` |
| KILLED | `:82` ` \|\| !e.steps.length` | 81/79/2 | `G05`, `G22` |
| KILLED | `:182` ` \|\| facts.profile !== 'earned/workout-facts/v1'` | 81/79/2 | `G09`, `G22` |

Five survivors survive and five kills kill, on both machines. The partition is fair where I
sampled it. I sampled ten of 141 and claim nothing about the other 131.

## (6) THE BAR AND THE FENCE

| what | PC, node v24.19.0 | linux, node v22.22.2 |
|---|---|---|
| the CI step's exact command, `rebuild.yml:288`, both landed cells | **81 tests / 81 pass / 0 fail, exit 0** | **81 / 81 / 0, exit 0** |
| the four `rebuild/lanes/d/plan-edit` cells, named one path at a time | **90 / 90 / 0, exit 0** | not run here (the farm lacks the sealed oracles; R1 to R4 record the same absence) |

**The `d-plan-edit` needle `# pass 90` HOLDS unchanged**, and `PE16 f2-adapter-identity` is green in
that run, which it must be: item (4) of the ticket is still a STOP and round 4c moved no sealed byte.

`git diff --numstat b9d8d645 HEAD` on the PC is NINE paths with ZERO deletions anywhere:

```text
19	0	.github/workflows/rebuild.yml
1453	0	rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md
262	0	rebuild/lanes/d/F2-LAND-REVIEW-R1.md
280	0	rebuild/lanes/d/F2-LAND-REVIEW-R2.md
310	0	rebuild/lanes/d/F2-LAND-REVIEW-R3.md
387	0	rebuild/lanes/d/F2-LAND-REVIEW-R4.md
775	0	rebuild/lanes/d/f2/guard-coverage.test.mjs
382	0	rebuild/lanes/d/f2/projector.test.mjs
198	0	rebuild/m4/workout/setup-tags.cjs
```

`git diff --name-only b9d8d645 HEAD -- rebuild/engine rebuild/m3 rebuild/coach rebuild/client`
prints NOTHING. No plan-edit path appears, so item (4) is still correctly stopped. The PC worktree
was clean before my run and is clean after it, and the module's and `projector.test.mjs`'s sha256
are unchanged at the end of the sweep.

## NOTES, neither of them owed as a change to this branch

### N1. Under a construction-breaking mutant, twenty-one rows now report GREEN, and those greens carry no information

This is the cost of the deferral and nobody has written it down. `bad()` at `:25` accepts any throw
whose `code` and `message` are both `SETUP_TAGS_INVALID`. Under `:27` or `:38` the FACTORY refuses
with exactly that error, so every row whose body is `bad(() => ...)` swallows the construction
refusal and passes without ever reaching the input it was written for. Measured on linux, under
`:27`, these are green: `F2-G25`, `F2-G33`, `F2-G45`, `F2-G46`, `F2-G47`, `F2-G49`, `F2-G50` and
fourteen more, twenty-one in all.

Nothing was LOST: before the deferral those rows did not run at all (2 tests / 0 pass / 2 fail), so
they were not informative then either, and the CI step is red either way, which is what the step is
for. `G51` is the honest kill and it reads correctly. But a future reader who sees `52 / 21 / 31`
must not read those twenty-one greens as twenty-one guards holding. One sentence beside `shared()`
saying so would keep the next round from being misled by its own cell. The report's own sentence,
"These are not isolated G51 kills", points at this and stops one step short of it.

### N2. The wrappers call the projector as a method; `projector.test.mjs` does not

`const validateSetupTags = (...args) => shared().validateSetupTags(...args)` calls through the
frozen projector object, so `this` inside the module's closures is now that object rather than
`undefined`. `setup-tags.cjs` contains no `this` at all (grep: two occurrences, both in prose
comments), so there is no behaviour difference today, and the row-vector comparison in (3) proves
it. It is worth one line only because the two F2 cells now exercise the module through two
different call shapes, and a future module that used `this` would be seen differently by each.

## WHAT I DID NOT VERIFY

- I did not hunt for new survivors, by order. I ran no corpus of my own, aimed no new inputs at the
  eleven remaining terms, and I take no position on whether any of them would accept a document the
  module refuses. That is the named debt `DECISIONS:577 (4)` sends to S10.
- I did not rerun Astra's 141-variant generator, its `mutants.json`, or the 712 or 718 call corpora.
  My partition evidence is the ten variants in (5) and the eight in (2).
- I did not re-verify the 130 kills beyond those ten, and I did not re-run the `G35` to `G44`
  witnesses or the three tripwires; R3 and R4 measured those and nothing in this diff touches them.
- I did not run `b-package.cjs`, not `--ci` and not `--full`. I sealed nothing, wrote no receipt and
  no artifact, and did not touch the seal generator on `rebuild/b-seal-gen`.
- I did not run the GitHub ubuntu or windows jobs. Per `DECISIONS:554` this branch shows nothing for
  the new step. The both-OS evidence here is the PC and the linux farm scratch, as in R1 to R4.
- I did not assess the volume half, the three cells left on `rebuild/lane-d-f2-b1b2`, item (4)'s
  retirement, or whether any pinned rule is reachable from Edit My Week's door with athlete data.
- I did not open the private census, the protected soak, `rebuild/conform/private`, `src/history.js`
  or any `ledger/` directory, on either machine. Every fixture I used is synthetic and my own.
- My driver, my variant lists and my one measurement script live in the farm at
  `/home/claude/farm/scratch/f2lrevE/` with the scratch worktree at
  `/home/claude/farm/scratch/wt/f2lrevE`, and on the PC at `%TEMP%\f2lrevE-sweep.cjs`,
  `%TEMP%\f2lrevE-v-six.json`, `%TEMP%\f2lrevE-v-ten.json` and the `f2lrevE-` `.cmd` files, with
  logs at `%TEMP%\f2lrevE-setup.log`, `-run1.log`, `-run2.log`, `-bar1.log`, `-bar2.log`, `-pe.log`
  and `-dump.txt`. None of it is committed, and nothing crossed the airlock in either direction.

## FOR THE PM

F2-LAND closes here as far as this reviewer can take it. Round 4c did exactly what
`DECISIONS:577 (2)` ordered and no more: six rows that kill their own terms and are red alone, one
row that turns two file-scope stops into a readable failure, one comment sentence on `G41`, the
survivor classification struck with the list kept, the S10 debt written by name, and six tokens in
one workflow comment. The only thing I would add is N1's one sentence, and it can ride with the
next edit of this cell rather than opening a sixth round.
