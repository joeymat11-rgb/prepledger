# F2-LAND REVIEW R2: the fix round answers R1, and opens four more of the same hole

Independent reviewer, told to disagree. SECOND round. Branch `rebuild/d-f2-land` at
`04d0a693` (fix commits `c3b835e1`, `797b05ce`, `04d0a693` on top of the reviewed
`fe3719db`), cut from `b9d8d6454ef951bc24175bb04b05adadf263c7d6`.

Read in the farm (`/home/claude/farm/wt/rebuild__d-f2-land`, synced to `04d0a693`). Run on the
PC (`%TEMP%\earned-f2land`, `git pull --ff-only`, working tree clean, nothing edited but this
file) and on linux (farm scratch `f2r2` cut from the pushed head). No engine byte, no sealed
byte and no cell was touched by me.

## VERDICT: REJECT

Everything the fix round set out to do, it did, and it did honestly. R1's B1 and B2 are FIXED,
red first, in their own commit, with no byte of the module changed. The four sha256 tables, the
fence, the CI step, the STOP on retirement and the whole bar all reproduce exactly. Section 5's
rewrite of `DECISIONS:474` is correct and I re-read the runner myself.

It is rejected for one reason, and the remedy is small: **section 7's headline claim, "ZERO
guard terms of this module are undriven", is false.** I mutated the module at term granularity
myself, 110 mutants, and found FOUR more terms whose removal turns nothing red, three of which
flip the module from REFUSING to ACCEPTING. That is exactly the class of finding the ticket
calls BLOCKING, and the sentence that denies they exist is in the table S10 is told to lift.

No landed byte needs to change. What is owed is one more cell file, the same shape as
`guard-coverage.test.mjs`, and two corrected sentences. The author's own section 10 item 1
predicts this finding almost word for word ("a term I did not think to split is a term nobody
has mutated"); section 7 should have said what section 10 says.

## BLOCKING

### B1. Four guard terms drive no cell, and three of them ACCEPT what the module refuses today

METHOD, reproducible. Farm scratch `f2r2` at the pushed head `04d0a693`. One exact string
replacement per row, applied to `rebuild/m4/workout/setup-tags.cjs`, then
`MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node --test rebuild/lanes/d/f2/projector.test.mjs
rebuild/lanes/d/f2/guard-coverage.test.mjs` (the exact CI step command at `rebuild.yml:288`),
then the original bytes restored and the sha256 re-compared. 110 mutants, every anchor unique,
`d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` before and after the sweep.

| line | term deleted | an input the term alone refuses | with the term gone | tests red |
|---|---|---|---|---|
| `:79` | `!text(e.id)` | exercise id `''`, `'   '`, `42` | **ACCEPTED** by `validateExerciseTags` AND `validateSetupTags` | **none** |
| `:79` | `!text(e.n)` | exercise name `''`, `42`, `null` | **ACCEPTED** by both | **none** |
| `:80` | `!['U', 'L'].includes(e.day)` | day `'F'`, `'REST'`, `'X'`, `1` | **ACCEPTED** by both | **none** |
| `:155` | `e.head !== snapshot[e.id].head` | a projected document whose stored `head` was rewritten to another valid region of the same muscle, or to `null` | **ACCEPTED**, and the tampered head is silently overwritten with the snapshot's at `:189` | **none** |

Control, unmutated module, same probe: every one of those inputs throws `SETUP_TAGS_INVALID`
with `code === message`. So the guards work; nothing proves they work.

Why each matters, in the order I would fix them:

- **`:80`, the day vocabulary.** `U` and `L` are the only exercise day kinds the tip's
  `athlete-state.cjs` carries, and the split map separately admits `F` and `REST`. With the term
  gone a setup that parks an exercise on a `REST` day validates and projects. Edit My Week edits
  days. This is the sharpest of the four.
- **`:155`, the stored-head equality.** This is the re-projection tamper check. The marker does
  not contain `head`, so `equal(e.volumeTags, marker)` cannot see the change; the sibling term
  for `secondary` IS driven (mutating it reds `F2-02 changed snapshot, provenance or a partial
  marker set refuses atomically`), the `head` half is not. The report's `M30` row is a
  whole-clause row that was never split, which is R1 B2's complaint repeated.
- **`:79` twice.** An empty or numeric athlete-facing id and name reach the projection. `text()`
  is the module's only emptiness rule and the cells drive it for the taxonomy, the athlete label,
  the priority muscles and `op_id`, never for the exercise's own two strings.

Owed: cells in `guard-coverage.test.mjs` (or a sibling) that are red on each of the four
single-term mutants above and green on the module, in a commit that changes no module byte, as
`c3b835e1` already did for `G01` and `G02`.

### B2. "ZERO guard terms of this module are undriven" is false, and S10 is told to lift it

Section 7's RESULT paragraph states it in bold; section 7.3 repeats it ("There are now
**none**"); section 9's B2 repeats it a third time ("the count is now 0"). Measured above, the
count is at least 4, and at least 10 if the report's own standard in 7.3 is applied (notes N1
and N2 below). Section 10 item 1 states the honest version and contradicts all three.

The honest sentence, which I would accept without further work, is the author's own: **100
mutants chosen by the author plus 10 chosen by R1 and R2, 0 anchor misses, N survivors each with
a KILLED double, and no claim of exhaustiveness.** Anything stronger is a claim about mutants
nobody wrote.

## NOTES

### N1. Two more undriven terms degrade a named refusal into a raw TypeError

The report's own 7.3 argues that `M38` / `M39` are load-bearing precisely because "a `null` row
with the term gone reads `d` off `null` and the caller sees a raw `TypeError` instead of
`SETUP_TAGS_INVALID`", and wrote `G11` for them. By that standard these two are load-bearing and
undriven:

| line | term deleted | input | with the term gone | tests red |
|---|---|---|---|---|
| `:82` | `!Array.isArray(e.steps)` | `steps: 'abc'` or `{length: 2}` | `TypeError: e.steps.every is not a function` | **none** |
| `:144` | `!Array.isArray(out.exercises)` | `state.exercises = {length: 1}` | `TypeError: out.exercises is not iterable` | **none** |

Either pin them or say in 7.2 that a TypeError is an acceptable second line of defence. What is
not available is to use that argument for `G11` and not for these.

### N2. Four undriven terms that ARE redundant, and still belong in the table

Measured redundant, i.e. with the term deleted the module still refuses by name:
`:118 !plain(snapshot)` (an array snapshot is caught by `:124` / `:128`), `:144 !plain(out)` and
`:149 !plain(e)` (caught by the label and identity comparisons), `:181 !plain(facts)` (caught by
the profile comparison). None of the four is named anywhere in 7.1 or 7.2. A table that claims
every term was mutated once should carry its redundant rows too, which is what 7.2 exists for.

### N3. R1 finding by finding

| R1 finding | R2 verdict | evidence |
|---|---|---|
| B1 `M24` / section 9 false about a non-record context | **FIXED** | `X-G02` mutant (`:136` disabled) reds `F2-G02` alone; the report's `M24` row now reads `G02`; measured refusals for `null`, `undefined`, string, `42`, `[]`, `Map`, custom prototype and a function |
| B2 `:149 seen.has(e.id)` undriven | **FIXED** | `X-G01` mutant reds `F2-G01` alone, 1 test; module sha256 unchanged; the fix is commit `c3b835e1`, a different diff from the landing |
| B2's second miss, `:85 own(regions, tag.head)` | **FIXED as REDUNDANT, and I agree** | `R02` alone survives; the whole clause `M13` reds `F2-G12` and `F2-02 head compatibility` (2 tests). A prototype-chain name never resolves to the exercise's `mg` |
| N1 absent-tags laxity | **STILL OPEN, correctly escalated** | all five rows reproduce; `projectSetupTags(junk, {setup:{}, tags:null, op_id:'', date:'nonsense', junk:1}) === junk`, unfrozen and still mutable through the caller's handle. Now pinned in TWO cells (`projector.test.mjs:69` and `F2-G02`'s last line), which the report discloses. PM's to rule |
| N2 `DECISIONS:474` misread | **FIXED** | I re-read `:474` ("EXIT 0, 0 unlisted drift because the runtime files are new and undeclared") and `b-package.cjs:2005`. Section 5's rewrite is right |
| N3 three acceptance specs missing from the retirement table | **FIXED** | all three sha256 verify from Git at `b9d8d645` |
| N4 law 17 must be superseded by name | **FIXED** | 6.1 now says so; I re-searched and found no cell that enumerates `rebuild/m4/workout` |
| N5 two normalization facts | **DISPUTE UPHELD, in the author's favour** | I agree with the decision not to pin the redundant-helper encoding. See N6 for the half R1 and the author both missed |
| N6 report inaccuracies | **FIXED** | the `numstat` box is measured at a named head and shows six paths |

Nothing the fix round did broke anything: `projector.test.mjs` keeps its blob identity with the
spike (`cd4f4b29e1d15c09816c7ec0ebec379c159afce2`), the fix round's diff is exactly three files,
and no cell anywhere was weakened, loosened or dropped.

### N4. Section 6.2's "UNMEASURED" two-move retirement proposal is now MEASURED

The author proposes re-pointing the importers before deleting the copy and calls it unmeasured.
I measured it on the PC without editing a byte, using the two overrides the cells already carry:

| run | measured | exit |
|---|---|---|
| `model.test.cjs` with `PLAN_EDIT_F2_MODULE` pointed at the LANDED `rebuild/m4/workout/setup-tags.cjs` | **55 tests / 55 pass / 0 fail** | 0 |
| `durable-host.test.mjs` with `PE_F2_PUBLIC_REF=f3e9561` (compiling the published blob, not the copy) | **30 tests / 30 pass / 0 fail** | 0 |

So for the two plan-edit cells that import the copy directly, the first move of 6.2 is green
against the real module at its real address, today, on this branch. That is evidence the PM can
route on. It says nothing about the five real-shape and port-fix importers, which have no such
override and which I did not touch.

### N5. A retirement must not lose the second half of the PE16 identity cell

`model.test.cjs:505` does two things: it proves the lane copy is the published blob, AND it
asserts that neither `plan-edit-commands.cjs` nor `plan-edit-model.cjs` mentions
`f2-tag-adapter` or `setup-tags`. The first half dies with the copy; **the second half is a law
about the plan-edit runtime and must survive the retirement.** Section 6.1's row says "re-pointed
or retired" without distinguishing them. One line for S10, and it prevents a real loss.

### N6. R1's N5 has a head-side twin that is more consequential, and it is live in the shipped taxonomy

R1 found that `{mg:'biceps', lend:0.5, head:'biceps'}` and `{mg:'biceps', lend:0.5}` are two
encodings of one helper credit. The same is true of the DIRECT head, and it matters more:
`REGION_MG` ships eight identity entries (`biceps`, `triceps`, `forearms`, `quads`, `hams`,
`glutes`, `calves`, `abs`), so for an exercise with `mg:'biceps'` both `head: 'biceps'` and
`head: null` validate (measured, both `true`).

Downstream those two are NOT the same: brief `:47` and `DECISIONS:155 (3)` make a coarse,
region-unresolved value `qualified:false / region-unspecified`, while a resolved head is
qualified. For a muscle with no regional split the athlete can store either. The module is right
not to care; **the volume half and EW2 must be told which one they are reading.** Not a defect of
this landing, not pinned, and I agree with the author that a cell asserting it would pin a
laxity nobody has ruled on.

### N7. No ceiling on the TOTAL credit one lift may lend

Measured: eight helpers, each `lend: 1`, all distinct targets, all known muscles, validate and
project; the projected `secondary` sums to 8.0. The brief asks for `0 < lend <= 1` per helper,
unique targets and no self-credit, and this module delivers exactly that, so it is compliant.
Whether a lift may pay 800 percent of itself is the volume half's problem and EW2's door's
problem. Recording it so nobody discovers it later as a surprise.

### N8. The new CI step is correct, and the Windows evidence is still the PC

The fix round added its file to the SAME `run:` line rather than a second step: one step, two
files, each by exact path, never globbed, directly after the `D - plan edit` step's `run:` line.
The regions after `:232`, `:297` and `:306` are untouched. Section 5's `DECISIONS:554` point
holds: the seal-base step refuses first on this branch, so GitHub skips every later step and
Actions will show no green for the new step. The both-OS evidence is the PC run and the linux
scratch run, which is what the ticket allows, and the report says so plainly.

## WHAT I TRIED TO BREAK AND COULD NOT

**Byte identity, not taken on trust.** `git rev-parse` gives ONE blob,
`68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d`, for all three names: the landed
`HEAD:rebuild/m4/workout/setup-tags.cjs`, `f3e9561b:rebuild/m4/workout/setup-tags.cjs` on the old
branch, and `b9d8d645:rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` on the tip. sha256
`d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d`, 198 lines, on linux and
again with `certutil -hashfile` on the PC, where the landed module and the still-present lane
copy hash to the same string. Every sha256 in every table of the report reproduces from Git:
section 1's four, 6.1's four, and all ten pre-images of the retirement table.

**The bar, re-run by me on the PC** (`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, node
from the codex runtime, TAP counts):

| what | measured | exit |
|---|---|---|
| the CI step command, both landed cells | 43 tests / 43 pass / 0 fail | 0 |
| the whole `D - plan edit` step, the exact command at `rebuild.yml:269` | 130 / 130 / 0 | 0 |
| `rebuild/lanes/d/plan-edit` alone | **90 / 90 / 0** | 0 |
| `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld` | 1 |

The `d-plan-edit` needle `# pass 90` holds unchanged, as it must: (4) is a STOP and this branch
edits only its own CI step. On linux at the pushed head the two landed cells are 43 / 43 / 0.

**The fence.** `git diff --numstat b9d8d645 HEAD` on the PC is six paths, ZERO deletions
anywhere: `19 0` rebuild.yml, `690 0` the author report, `262 0` R1, `244 0` the new cell,
`382 0` the brought-across cell, `198 0` the module.
`git diff --name-only b9d8d645 HEAD -- rebuild/engine rebuild/m3 rebuild/coach rebuild/client`
prints NOTHING. Not one byte under `rebuild/engine` moved. No file outside the ticket's owned
list. No U+2013 or U+2014 in any file this lane authored; all LF.

**The thirteen survivors and their doubles.** All thirteen reproduce as survivors on my driver,
and the doubles I re-ran are KILLED: `M03`x`M06` (1 test), `M22`x`M23` (1), `M29`x`M31` (1),
`M32`x`M31` (2), `M50`x`M47` (4). 7.2's method note about `M42a`/`M42b` and `R02`/`R03` being
two terms of one line is honest and I confirmed the composed pair is a textual no-op.

**The red-first claim of every new cell.** Each of `G01` to `G11` goes red, and red ALONE, on the
single-term mutant named in its comment: `:149 seen.has`, `:136 plain(context)`, the five
taxonomy terms, the six exercise-bound terms, the two steps terms, the six setup terms, the four
split terms, `:171`'s calendar term, `:181`/`:182`'s three, `:184` and `:172`/`:173`. `G12` and
`G13` are property pins rather than mutant kills and I confirmed what they actually assert:
`Object.prototype` stays clean after a `__proto__`-id projection, and a state-level accessor on
`exercises`, `athlete_label`, `reads` or `sleep` refuses with the getter invoked ZERO times.

**The refusal vocabulary.** Exactly one named refusal. Fed `<script>alert(1)</script>` as both id
and `mg`, and `EVIL_HEAD` as head, the error's `message` and `code` are both the literal
`SETUP_TAGS_INVALID` and its only own key is `code`. Same for a hostile `op_id` and `date`
through `projectNewExerciseTags`. No caller text is interpolated anywhere.

**Fifteen attack cells of my own, all green against the module** (linux scratch, not committed):
no case folding and no trimming of the vocabulary (`DELTS`, `delts `, ` delts`, `Delts` all
refuse, `lend === 1` exactly is accepted); self-credit and coarse overlap refuse in every tuple
form while a resolved head plus a resolved sibling helper is permitted; `projectNewExerciseTags`
mints a COLLIDING id without complaint and the document refuses at the next `projectSetupTags`;
idempotence byte for byte, with `op_id` or `date` changed refusing and a partial marker refusing;
frozen inputs accepted, inputs never mutated, output deeply frozen, the caller's `secondary`
array not shared; `regionsByMuscle` deep-cloned per exercise in `projectSetupTags` and shared by
reference in `projectNewExerciseTags`, structurally equal either way; ids `'r-0'` and `'r-0 '`
distinct end to end; an empty exercise list refusing through the validator; 300 exercises
projecting, all 300 marked; the projected key order fixed at
`id|n|mg|day|sets|hi|inc|steps|w|forks|head|secondary|volumeTags` and
`profile|op_id|date|regionsByMuscle`; an own `__proto__` key in the injected `regions` handled as
data with `Object.prototype` untouched; all 83 canonical catalogue snapshots projecting.

**The brief.** I read the module line by line against `BRIEF-F2-TAG-PROJECTION-v1.0` on the old
branch and found NO contradiction. The one clause that looks like one, `:38`'s "Secondary entries
retain exactly `{mg,lend}`" against the module's `{mg, lend, head?}` at `:89`, is granted by
name: `DECISIONS:170` closes H7 under the standing licence `:135 (1)` with exactly
"`{mg, lend, head?}`, where head must be a `REGION_MG` key and must AGREE with its mg, and a
fourth key is refused", which is what `:91-92` implements. The module's own comment cites `:170`.

**The STOP conditions.** All four functions Edit My Week needs are exported and all four are
exercised green WITHOUT the volume half, so the ticket's STOP does not trigger. No need for an
engine byte. The STOP on (4) is correct and R1's "understated" stands: thirteen rows across three
seal children, three receipts, a sealed brief, three ACCEPTED acceptance specs and CI steps two
other lanes hold.

## WHAT I DID NOT VERIFY

- I did not run `b-package.cjs --full`, did not seal, did not write a receipt or an artifact, and
  did not use the seal generator on `rebuild/b-seal-gen`.
- `UNLISTED-PRODUCT-DRIFT` on the workflow (section 5) is still READ, not executed, by the author
  and by me. The seal-base refusal fires first on every head available to this lane. I re-read
  `b-package.cjs:2005` and `DECISIONS:474` and agree with the reading; I did not open
  `packages/S8.json`'s 224-file inventory row by row.
- I did not run the Windows CI job. GitHub Actions on this branch will show nothing for the new
  step, per `DECISIONS:554`.
- I did not assess the volume half, `rebuild/engine/volume.cjs`, `writers.cjs` or the old
  branch's `athlete-state.cjs`, and I did not re-run the three left-behind cells; R1 did, and its
  table matched the author's. Nothing here says any of that is ready.
- I did not measure the five real-shape and port-fix importers against the real module (N4): they
  carry no override and measuring them would have meant editing files I do not own.
- I did not answer whether any newly covered rule is reachable from Edit My Week's own door with
  athlete data. The cells prove the module refuses; only EW2's host can say what can arrive.
- I did not open the private census, the protected soak, `rebuild/conform/private`,
  `src/history.js` or any `ledger/` directory, on either machine. Every fixture I used is
  synthetic.
- My driver and probes live in the farm scratch worktree `f2r2` and in this session's scratchpad
  (`r2mut.mjs`, `rows1.json`, `rows2.json`, `probe1.mjs`, `probe2.mjs`, `probe3.mjs`,
  `r2-attack.test.mjs`). Nothing in a farm scratch is pushed. The module was restored and its
  sha256 re-compared after every one of the 110 mutants.
