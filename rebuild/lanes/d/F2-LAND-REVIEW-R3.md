# F2-LAND REVIEW R3: the rows R2 and the PM asked for are all there and all honest, and the sentence beside them is over-strong again

Independent reviewer, THIRD round, narrowed by the PM's order. Branch `rebuild/d-f2-land` at
`e497734543be02a21e4533e0f1c26d52bdb48399` (round-3 commits `b954d17e`, `e4977345` on top of the
reviewed `765a0f45`), cut from `b9d8d6454ef951bc24175bb04b05adadf263c7d6`.

Read in the farm (`/home/claude/farm/wt/rebuild__d-f2-land`, synced to `e4977345`). Run on the PC
(`%TEMP%\earned-f2land`, already at `e497734`, working tree clean before and after, nothing edited
but this file) and on linux (farm scratch `f2lrevC` cut from the pushed head). No engine byte, no
sealed byte, no cell and no workflow line was changed by me.

## VERDICT: REJECT

Narrowly, and with the same shape of remedy R2 asked for: no landed byte needs to change, what is
owed is four rows and one sentence.

Everything the PM ordered this round LANDED AND IS CORRECT. R2's four terms have rows; the two PM
findings are reproduced exactly as the PM measured them and are pinned honestly; the drift pin is
there and is needed; the three false headline sentences are withdrawn in all three places R2
named; no byte of `rebuild/m4/workout/setup-tags.cjs` or of `projector.test.mjs` moved; the whole
bar reproduces on both operating systems. Twenty-one rows, eighteen of them behaviour rows, and I
killed every one of the eighteen with its own single-term mutant on BOTH machines.

It is rejected for one reason. The report replaced a false headline with a new claim of the same
class, and the new claim is false too: **"all 25 survivors are REDUNDANT ... ZERO of the 25 flips
a refusal into an acceptance and ZERO degrades a named refusal into a raw throw"** (section 0,
repeated in 7.4, 7.5 and section 11's B2). I built my own differential corpus, 191 cases, in one
sitting, and it moves FOUR of the twenty-five: **two of them ACCEPTING and two DEGRADING.** One of
the two accepting terms is `:124`'s `ids.has(e.id)`, the setup-side duplicate-exercise-id rule,
which is the same rule R1 B2 found undriven on the state side and the same duty the report's own
section 12 item 2 hands to Edit My Week's host. A term whose removal turns a refusal into an
acceptance, with no cell red, is the class this ticket has twice called BLOCKING, and the sentence
denying they exist is in the table S10 is told to lift.

In the author's favour, and it matters: 7.5 states the hedge in terms ("REDUNDANT here means
redundant against these 161 cases") and section 10 item 1 invites precisely this attack. The
author is not overclaiming in the dark. But section 0's and section 11's bolded `0 ACCEPTING, 0
DEGRADING` is what gets lifted, and it is wrong.

## BLOCKING

### B1. Four of the twenty-five "redundant" survivors are not redundant, and two of them ACCEPT

METHOD, reproducible, and it is R2's method with a different corpus. Farm scratch `f2lrevC` at the
pushed head `e4977345`, and the PC worktree for the win32 half. One exact string replacement per
row applied to `rebuild/m4/workout/setup-tags.cjs`; then (a) the exact CI step command at
`rebuild.yml:288`, `node --test rebuild/lanes/d/f2/projector.test.mjs
rebuild/lanes/d/f2/guard-coverage.test.mjs`, with `MEASURED_TEST_NOW=2026-09-03` and
`TZ=America/New_York`, and (b) a differential corpus of my own, 191 synthetic cases, each
classified NAMED (`SETUP_TAGS_INVALID` with `code === message`), RAW (any other throw) or OK.
Original bytes restored and the sha256 re-compared after every single row:
`d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` before and after, on both
machines, every time.

**My corpus baseline is 191 cases: 172 NAMED, 16 OK, 2 RAW.** The only two RAW cases are
`setup.exercises = [null]` and `setup.exercises[1] = null`, which is PM finding P-F2-1 arriving
independently. That agrees with the report's own 161-case baseline claim that its only two RAW
cases are P-F2-1, and it is why I trust the corpus where it disagrees.

| line | term deleted | an input the term alone decides | today | with the term gone | cells red |
|---|---|---|---|---|---|
| `:116` | `!source.exercises.length` | `validateSetupTags({athlete_label, split, exercises: [], priority_muscles: []}, {})` | `SETUP_TAGS_INVALID` | **ACCEPTED**, returns `true`: a setup with no exercises at all validates | **none** |
| `:124` | `ids.has(e.id)` | a setup whose `exercises` holds the SAME id twice, with a snapshot holding that one key | `SETUP_TAGS_INVALID` | **ACCEPTED**, returns `true` | **none** |
| `:165` | `!plain(out.sleep)` | `state.sleep = null` | `SETUP_TAGS_INVALID` | raw `TypeError` | **none** |
| `:177` | `!plain(record)` | `sessionLog['2026-09-15'] = null` on a tagged state | `SETUP_TAGS_INVALID` | raw `TypeError` | **none** |

Measured on linux AND on the PC. On the PC each of the four prints `# fail 1`, and the one red is
`F2-G22`, the byte pin, which reds on every module mutant by construction: **no behaviour row goes
red for any of the four.**

Why `:124` is the one that matters. `:128`'s `Object.keys(snapshot).length !== ids.size` does NOT
cover it: `ids` is a `Set`, so the duplicate does not grow it, and a snapshot keyed once for the
duplicated id passes the count. The landed `F2-02` duplicate row survives the mutant because its
snapshot carries BOTH ids, so the count check catches it there. So the rule that a setup document
may not name one exercise twice rests, today, on a term nothing drives. That is exactly R1 B2
("the STATE side of the same rule had no cell at all") with the two sides swapped, and the report
itself tells EW2's host at section 12 item 2 that duplicate ids are the host's duty because the
module "has no view of the document" for the `projectNewExerciseTags` path. The setup path DOES
have a view, and its check is unpinned.

`:116` is milder but is a genuine acceptance flip: an exercise-less setup is meaningless to Edit My
Week and the module refuses it today for a reason.

`:165` and `:177` are the same class as `G28`, `G29`, `G30`, `G33` and `G34`, which this very round
pinned on the PM's rule for `G11`, `G18` and `G19`. Applying that rule to seven terms and not to
these two is the inconsistency R2's N1 objected to, one level down.

Owed, and it is small: rows in `guard-coverage.test.mjs` for these four (the `:124` one is the
only one I would call urgent), and section 0 / 7.4 / 7.5 / section 11 B2 corrected to say what was
measured. Nothing in the module changes.

## WHAT I CHECKED, AND THE VERDICT ON EACH THING I WAS SENT FOR

### (1) Blob identity. HOLDS, not taken on trust

`git rev-parse` at `765a0f45` and again at `e4977345` gives the SAME blob for both protected files:
`rebuild/m4/workout/setup-tags.cjs` is `68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d` at both heads and
`rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` is the same blob again;
`rebuild/lanes/d/f2/projector.test.mjs` is `cd4f4b29e1d15c09816c7ec0ebec379c159afce2` at both.

sha256, `sha256sum` on linux and `certutil -hashfile` on the PC, identical strings:

| file | sha256 | lines |
|---|---|---|
| `rebuild/m4/workout/setup-tags.cjs` | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` | 198 |
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | the same string | 198 |
| `rebuild/lanes/d/f2/projector.test.mjs` | `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` | 382 |
| `rebuild/lanes/d/f2/guard-coverage.test.mjs` | `b84b0b4056fbb1f82b11dd63d4a335674e57176ced31b2defd6748ed0c1002da` | 573 |

`git diff --numstat 765a0f45..e4977345` is exactly TWO paths, as the ticket requires:
`rebuild/lanes/d/f2/guard-coverage.test.mjs` `+329 / -0` and
`rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md` `+492 / -49`. `git diff --stat` over `.github/`,
`rebuild/engine`, `rebuild/m3`, `rebuild/coach` and `rebuild/client` for the same range prints
NOTHING. No U+2013 and no U+2014 in any file this lane authored; all LF.

### (2) Every new row, killed by its own single-term mutant, red ALONE, on BOTH machines. HOLDS, 18 of 18

Eighteen behaviour rows; `G20`, `G21` and `G22` are tripwires and pins and are handled below. For
each row I deleted exactly the one term its comment names and ran the CI step command. On linux and
on win32 the result is identical, row for row: `# fail 2`, one behaviour row red, and that row is
the one named. The second failure is always `F2-G22`, the byte pin, which the report discloses.

| row | term deleted | linux | win32 |
|---|---|---|---|
| `F2-G14` | `:79` `!text(e.id)` | red alone | red alone |
| `F2-G15` | `:79` `!text(e.n)` | red alone | red alone |
| `F2-G16` | `:80` `!['U', 'L'].includes(e.day)` | red alone | red alone |
| `F2-G17` | `:155` `e.head !== snapshot[e.id].head` | red alone | red alone |
| `F2-G18` | `:82` `!Array.isArray(e.steps)` | red alone | red alone |
| `F2-G19` | `:144` `!Array.isArray(out.exercises)` | red alone | red alone |
| `F2-G23` | `:152` `e.mg !== authored.mg` | red alone | red alone |
| `F2-G24` | `:152` `e.day !== authored.day` | red alone | red alone |
| `F2-G25` | `:158` `own(e, 'secondary')` | red alone | red alone |
| `F2-G26` | `:159` `!Array.isArray(e.forks)` | red alone | red alone |
| `F2-G27` | `:164` `!plain(out[key])` | red alone | red alone |
| `F2-G28` | `:163` `!Array.isArray(out[key])` | red alone | red alone |
| `F2-G29` | `:165` `!Array.isArray(out.sleep.nights)` | red alone | red alone |
| `F2-G30` | `:184` `!plain(session)` | red alone | red alone |
| `F2-G31` | `:58` `a === null` in `equal()` | red alone | red alone |
| `F2-G32` | `:116` `!Array.isArray(source.exercises)` | red alone | red alone |
| `F2-G33` | `:144` `!plain(out)` | red alone | red alone |
| `F2-G34` | `:149` `!plain(e)` | red alone | red alone |

Not one of the eighteen is a decoration and not one kills a neighbour's row as well. The module's
sha256 was re-compared after each of the 18 on each machine and never moved, and `git status
--porcelain` in the PC worktree is empty after the sweep.

### (3) The two PM findings, reproduced, and the rows read for honesty. BOTH HOLD

**P-F2-1, reproduced exactly on the unmutated module, both machines:**

| call | measured |
|---|---|
| `validateSetupTags({..., exercises: [null]}, tags)` | `TypeError`, `code === undefined`, `Cannot read properties of null (reading 'id')` |
| the same setup through `projectSetupTags`'s `ctx.setup` | the same raw `TypeError` |
| the same slot holding `42` | `SETUP_TAGS_INVALID`, `code === message` |
| the STATE side, `state.exercises = [null]`, at `:149` | `SETUP_TAGS_INVALID` |

The asymmetry the report names in 7.6 is real and I confirm it: `:149` has `!plain(e)`, `:124` does
not. `F2-G20` is honest by the PM's three tests: it asserts the call THROWS, asserts
`e instanceof TypeError`, asserts `e.code` is NOT `SETUP_TAGS_INVALID`, and its comment says in
terms that this is a RECORDED LAXITY, names `:124`, and says the row is to be rewritten on purpose
when the guard arrives. It does NOT assert the named refusal anywhere. I proved it is a live
tripwire independently: with `:124` rewritten to `if (!plain(e) || ids.has(e.id) || !own(snapshot,
e.id)) fail();`, `F2-G20` goes RED and nothing else but the byte pin, on linux AND on win32.

One note, not a defect. `F2-G20` also asserts `assert.match(e.message, /reading 'id'/)`, which is a
V8 message string. It holds on this PC's node (v24) and on the farm's (v22), so it is fine today;
a future node that rewords that message reds the row for the wrong reason. The first three
assertions carry the finding on their own.

**P-F2-2, reproduced exactly, both machines.** `ENGINE_MG` has exactly eight identity muscles in
`REGION_MG` (`abs`, `biceps`, `calves`, `forearms`, `glutes`, `hams`, `quads`, `triceps`) and NONE
of the eight has a sub-region. Under the invented taxonomy `{biceps: 'biceps', biceps_long:
'biceps'}` the `head: null` form REFUSES a helper on `biceps_long` by name and the `head: 'biceps'`
twin ACCEPTS it. `F2-G21` reads the SHIPPED `ENGINE_MG` and `REGION_MG` by import from
`rebuild/m3/w7-preview/today/exercise-catalogue.mjs`, not a copy of them, which is what the PM
required; the invented taxonomy appears only in the two-line fixture beside it. Proved live: adding
`biceps_long: 'biceps'` to the shipped `REGION_MG` in a scratch reds `F2-G21` on both machines, and
also reds `F2-04`, exactly as the report discloses in 7.7. The catalogue's sha256
(`9f7116bb679eb53ead6d5ea8000e8534a5bfc94e2042e3b0b36e57f272cd52e3`) is identical on both machines
before and after, and no byte of `rebuild/m3` is touched by this branch.

One note, not a defect. `F2-G21`'s first assertion `deepEqual`s the eight identity names, so the row
also reds if someone adds a NEW identity muscle that has no sub-region, which does not violate the
property the row is named for. It is a snapshot pin bolted to a property pin. Harmless and arguably
useful; the comment should say so.

### (4) The corrected count, re-measured. THE COUNT IS FAIR, THE CLASSIFICATION IS NOT

I did not re-run a whole sweep as a first act, per the ticket. I ran what I was sent for.

**All 25 terms the report names in 7.5 as still surviving: I confirm all 25 SURVIVE** the two
landed cells (mutated one at a time, no behaviour row red). The survivor LIST is right. The
classification beside it is not, for the four in B1 above; the other twenty-one move not one of my
191 cases and I agree they are redundant against a corpus of this shape.

**A sample of twenty-five OTHER terms of my own choosing, which the report's tables claim are
KILLED: all twenty-five are KILLED**, each by at least one behaviour row. They are `:29`
`active.has(value)`, `:31` the cloneData prototype allowlist, `:39` `typeof key !== 'string'`,
`:66`'s two `closed()` terms, `:68` `!Array.isArray(muscles)`, `:69`'s duplicate-muscle and
`!plain(regions)` terms, `:70` `muscles.includes(muscle)`, `:79` `!closed(e, EXERCISE)`, `:80`
`!muscles.includes(e.mg)`, `:84` `!closed(tag, [...])`, `:85` `regions[tag.head] === e.mg`, `:89`
`!known.has(helper.mg)`, `:90` `helper.lend > 1`, `:96`'s three target terms, `:108` `!day(ctx.date)`,
`:119` `!day(source.split.from)`, `:136` `!plain(context)`, `:138` the `ctx.tags` descriptor guard,
`:145` `out.exercises.length !== ids.size`, `:149` `!ids.has(e.id)` and `:171` `d < ctx.date`. So
the report's "115 KILLED" is not padding: the cells really do drive the module.

That sample also shows the corpus is not blind. It detects an acceptance or a degradation on
nineteen of those twenty-five. It is exactly as sensitive where the four terms of B1 are concerned.

One more term worth recording, which is neither accepting nor degrading and so belongs nowhere in
the report's scheme: `:139`'s `!descriptor`. Delete it and a context with NO `tags` property at all
stops returning the state by identity and throws a raw `TypeError` instead. The report's own
161-case corpus appears not to hold a tags-ABSENT case as distinct from a tags-`null` one, which is
a gap worth knowing given that the absent-tags identity path is the behaviour the PM ruled INTENDED
and told S10 to declare.

### (5) The bar and the fence. BOTH REPRODUCE, on the PC, at `e497734`

| what | measured on the PC | measured on linux |
|---|---|---|
| the CI step command, `rebuild.yml:288`, both landed cells | **64 tests / 64 pass / 0 fail** | **64 / 64 / 0** |
| the whole `D - plan edit` step, the exact command at `rebuild.yml:269` | **130 / 130 / 0** | not run here (the farm lacks the sealed oracles; R1 and R2 record the same four environment absences) |
| `rebuild/lanes/d/plan-edit` alone, the four cells named one path at a time | **90 / 90 / 0** | not run here |

**The `d-plan-edit` needle `# pass 90` holds unchanged**, which it must: item (4) is a STOP and this
round changed two files, neither of them sealed and neither of them the workflow. The report's own
measurement note about `node --test <directory>` failing on this PC's node is correct and I hit it
too; the four-path form is the form the CI step uses and the form the needle counts.

`git diff --numstat b9d8d645 HEAD` on the PC is SEVEN paths, ZERO deletions anywhere: `19 0`
`.github/workflows/rebuild.yml`, `1133 0` the author report, `262 0` R1, `280 0` R2, `573 0`
`guard-coverage.test.mjs`, `382 0` `projector.test.mjs`, `198 0` the module.
`git diff --name-only b9d8d645 HEAD -- rebuild/engine rebuild/m3 rebuild/coach rebuild/client`
prints NOTHING. No file outside the ticket's owned list. The PC worktree was clean before my run
and is clean after it.

## FINDING BY FINDING, AS ORDERED

| finding | verdict | evidence |
|---|---|---|
| **R2 B1** four undriven terms, three ACCEPTING | **FIXED** | `F2-G14`, `F2-G15`, `F2-G16`, `F2-G17`, each red and red alone on its own single-term mutant on BOTH machines; no module byte moved; `M30` really is split into its head half and its `secondary` half |
| **R2 B2** the headline is false in three places | **FIXED in the three places R2 named**, and the count is written as measured with the 25 survivors listed one by one. The REPLACEMENT claim is **STILL OPEN**: see B1 above |
| **R2 N1** two DEGRADING terms | **FIXED** | `F2-G18` and `F2-G19`, red alone on both machines. The round then applied the rule to itself for seven more terms, which is right, and missed two, which is B1 |
| **R2 N2** four redundant terms belong in the table | **FIXED, and the author's DISPUTE is UPHELD** | I reproduce the author's correction: `:144 !plain(out)` and `:149 !plain(e)` are NOT redundant, they degrade on `null`, and `F2-G33` / `F2-G34` pin them. `:118` and `:181` are confirmed redundant against 191 cases |
| **R2 N4** the two-move retirement is MEASURED for two importers | **FIXED** | recorded in 6.2 with MEASURED / UNMEASURED marked per importer. I did not re-run R2's two runs and I do not need to |
| **R2 N5** PE16's second half must survive a retirement | **FIXED** | I read `model.test.cjs:505` myself: the closing loop tests `plan-edit-commands.cjs` and `plan-edit-model.cjs` against `/f2-tag-adapter\|setup-tags/`, so it already names both spellings and needs no edit. 6.1's split is accurate |
| **R2 N6** the head-side twin | **FIXED** | `F2-G21` plus section 12 item 3, which names the eight identity muscles |
| **R2 N3, N7, N8** | **RECORDED, correctly** | the CI step is one step at `rebuild.yml:287-288`, two files by exact path, never globbed, directly after the `D - plan edit` run line; the regions after `:232`, `:297` and `:306` are untouched; `rebuild.yml` is `+19/-0` and unchanged by round 3 |
| **PM P-F2-1** missing guard at `:124` | **FIXED** | reproduced on both machines; `F2-G20` pins the laxity without asserting the named refusal and goes red when the guard is added; the one sentence is section 12 item 1 |
| **PM P-F2-2** the identity-head twin at `:97` | **FIXED** | reproduced on both machines; `F2-G21` reads the shipped taxonomy and goes red when the shipped taxonomy gains a `biceps_long` |
| **PM ruling: N1 absent tags INTENDED** | **FIXED** | no byte moved, `projector.test.mjs` keeps its blob, `F2-G02`'s last line stands, section 12 item 4 states the behaviour for S10 |
| **PM ruling: item (4) stays STOPPED, the two files must not drift** | **FIXED** | I searched the branch: no cell held the two byte-equal. `PE16` compares the LANE COPY with `git show f3e9561:` and never opens the landed file, so it reds nothing on an edit to the landed module. `F2-G22` closes it and its comment says the retirement ticket deletes it on purpose |
| **PM rulings: duplicate-id duty, head twin, no lend ceiling** | **FIXED** | all three in section 12, by name, with the lend ceiling recorded and no row, as ordered |

## WHAT I TRIED TO BREAK AND COULD NOT

- The eighteen behaviour rows. Every one of them is a real kill on a real term, on two operating
  systems, and none of them is red on the unmutated module. Twenty-one new rows, `# pass 64` on
  both machines, zero flakes across roughly fifty full runs of the step on each machine.
- `F2-G22`'s standing red. It reds on every mutant of the module and NOT on the catalogue mutant,
  which is the behaviour the report claims for it and the reason "red alone" has to be counted over
  the behaviour rows. The alternative the report rejects, a pin tolerant of a mutated module, would
  indeed be no pin. Agreed.
- The report's own corrections. Every one of the three withdrawn sentences is genuinely gone, the
  withdrawal is stated rather than silently edited, and 7.2's three corrected rows (`M29`, `M32`,
  `M20c`) are correct: I killed all three of the terms they now point at.
- The stale-comment disclosure in section 3. The comment above the F2 step does say "43 tests" and
  "thirteen cells" and the step now prints 64 over thirty-four rows. The ticket forbade touching
  `rebuild.yml`, and recording the staleness in the report instead is the right call. `grep -c
  '^test('` on `guard-coverage.test.mjs` is 34, so the report's number is exact.
- The fence and the needles. Nothing sealed moved, nothing under `rebuild/engine`, `rebuild/m3`,
  `rebuild/coach` or `rebuild/client` moved, `# pass 90` is unchanged, and the STOP on item (4)
  held.

## WHAT I DID NOT VERIFY

- I did not re-run R2's 110-mutant sweep or the author's 140-mutant sweep in full. I ran 24 mutants
  on the PC and 50 on linux, chosen as the ticket directs: the 18 new rows, the 2 tripwires, all 25
  claimed survivors, and 25 terms of my own the report claims are killed.
- I did not run `b-package.cjs` at all this round, not `--ci` and not `--full`. Section 5's refusal
  line is R1's and R2's measurement and I have no reason to doubt it; `DECISIONS:554` means the
  seal-base step refuses first on this branch either way. I sealed nothing, wrote no receipt and no
  artifact, and did not touch the seal generator on `rebuild/b-seal-gen`.
- I did not run the Windows or ubuntu GitHub jobs. Per `DECISIONS:554` this branch shows nothing for
  the new step. The both-OS evidence here is the PC and the linux scratch.
- I did not re-measure R2's N4 overrides, did not touch the five real-shape and port-fix importers,
  and did not assess the volume half or the three cells left on `rebuild/lane-d-f2-b1b2`.
- I did not judge whether any newly pinned rule is reachable from Edit My Week's own door with
  athlete data. Nobody in three rounds has, and section 12 is the right place for it to sit.
- I did not open the private census, the protected soak, `rebuild/conform/private`, `src/history.js`
  or any `ledger/` directory, on either machine. Every fixture and every corpus case I used is
  synthetic and my own.
- My driver, my 191-case corpus and my probes live in the farm scratch worktree `f2lrevC`, in the
  PC scratch folder `%TEMP%\f2lrevC-work` and in this session's scratchpad. None of it is committed.
  The module and the catalogue were restored and re-hashed after every mutant on both machines.

## FOR THE PM

The remedy is four rows and one sentence, in a commit that changes no module byte, exactly as the
last two rounds were remedied. If only one row is written, write the `:124` `ids.has(e.id)` one:
it is the setup-side half of the duplicate-exercise-id rule, the state-side half is already pinned
by `F2-G01` because R1 found it, and Edit My Week edits exercise lists.

If instead the PM wants this round closed, the smaller alternative is honest and I would not object
to it: strike `ZERO of the 25 flips a refusal into an acceptance and ZERO degrades a named refusal
into a raw throw` from section 0 and from section 11's B2, and replace it with 7.5's own hedge plus
the four terms above named as measured-not-redundant. That costs no row and leaves no false
sentence for S10 to lift. What is not available is to leave the sentence standing.
