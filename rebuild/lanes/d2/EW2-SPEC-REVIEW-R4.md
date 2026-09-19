# EW2-SPEC REVIEW R4, INDEPENDENT, AND THE FIRST ROUND THAT RAN THE CODE AGAINST THE SPEC

Reviewer: cowork (Earned lane hand), Opus, 2026-09-19, told to disagree. Reviewed file
`rebuild/lanes/d2/EW2-SPEC.md` (2838 lines) at branch `rebuild/d2-ew2-spec` head `f9b1c8db`,
against v3 (`90441ae3`), the v3 to v4 diff (1825 changed lines in the spec), review R3
(`99cfa911`) and the PM's rulings `E-R12` to `E-R20` at `DECISIONS:548`.

**METHOD: I RAN THE CODE, AND THE ONE FINDING I CARE MOST ABOUT CAME OUT OF A CELL I WROTE TO
BREAK THE SPEC AND NOT OUT OF A READING.** `:548` ruled that round 4's facts would be measured
rather than argued, and the same rule binds its reviewer. I re-ran four of the spike's seven
modules unaltered, re-ran the adoption cells a previous hand left behind rather than trusting its
notes, and wrote my own cell against the design v4 SPECIFIES.

**Where my runs are, so the next hand repeats them rather than trusts me.**
- The spike's own worktree `/home/claude/farm/scratch/wt/ew2-spike` at `e0e2ac75`:
  `ew2-spike-m1.mjs`, `-m2`, `-m5`, `-m7`, re-run unmodified. Every row of sections 0.1, 0.2, 0.5
  and 0.7 reproduced, value for value.
- **MY OWN worktree `/home/claude/farm/scratch/wt/ew2-r4b` at the current tip `70113da5`**, made
  with `farm-scratch.sh`, holding ONE new cell:
  `rebuild/lanes/d/p3-real-shape/r4b-capture-lift.mjs`. It is mine. It is section 3 below and it
  is BLOCKING 1.
- A previous reviewer hand, cut off mid-review, left `r4-adoption2.mjs`, `r4-adoption3.mjs` and
  `r4-race.mjs` in `/home/claude/farm/scratch/wt/ew2-r4`. **I read all three line by line and
  re-ran them myself**, and I re-derived their conclusions from the product source before keeping
  any of them. Where I keep one it is because I measured it, not because I found it written down.
  That hand's partial file is superseded by this one, which is mine.
- `git diff ad8ced07..70113da5 -- rebuild/` is `rebuild/DECISIONS.md` and `rebuild/lanes/STATUS.md`
  ONLY, so the spec's stated re-measurement head and my worktrees are the same product tree and no
  cite below is excused by drift.

Nothing was pushed from any scratch worktree, nothing was installed, no browser was launched, no
`b-package.cjs` ran and no seal was attempted. I did not read `rebuild/conform/private`, any
`ledger/` directory, `src/history.js`, `C:\Users\joeym\EarnedPort`, the protected soak or any owner
measurement, on either machine. No credential appears here. Zero U+2013 and zero U+2014 in this
file, counted rather than claimed: the whole file is ASCII.

## VERDICT: REJECT

Four BLOCKING findings. **None repeats R1, R2 or R3, and none disputes a verdict of R3's.** This is
the strongest round of the four by a distance: the spike is real work, its table reproduces exactly
under my hand, and five of R3's six blocking findings are closed in ways I tried and failed to
reopen. What the REJECT is for:

- **`E-R16` is carried out exactly as the PM worded it, and the wording is WRONG. Measured, it
  refuses twelve of the sixteen lifts on a real old app file, and the cell the spec writes to catch
  it CANNOT catch it, because the fixture's own bracket hides the defect.** `:613` resolves a
  capture into the FILE's id space and `FOLDED` is in the DOCUMENT's id space. This is a note for
  the PM as much as a finding against the author (B1);
- **`E-R17` is not carried out.** Measured on an instrumented repository, the adoption still costs
  THREE durable loads, not the two the spec asserts in bold, because the adoption gate does not
  load a generation: the load is one frame deeper, inside a file this spec promises zero bytes in.
  STOP 9 fires at design time for the second round running (B2);
- **`E-R12`'s re-cut trips the very fence 6.8 makes this spec's bar, on the half of the fence
  nobody checked.** The released callback table is named `onWeek.save(...)` and `onWeek.close()`,
  and `.save` and `.close` are on TODAY-SPLIT E.3's word list of member names in code position,
  which E.4 scans with a token scan (B3);
- **the GREEN column `E-R13` ordered made honest is still wrong, and 9.3 turns it into the sentence
  the PM is asked to approve.** Measured, exactly ONE of the twenty-two ids can reach green on
  acceptance, not four (B4).

B1 is the serious one and it is the only one that changes what the fix does to an athlete's data.
B2 is a real choice for the PM. B3 is cheap to fix and expensive to discover late. B4 is half an
hour.

---

## 1. BLOCKING

### B1. `E-R16` IS WRONG ON THE EVIDENCE. `:613` RESOLVES INTO THE FILE'S ID SPACE AND `FOLDED` IS IN THE DOCUMENT'S, SO THE REPLACEMENT REFUSES TWELVE OF SIXTEEN LIFTS ON A REAL OLD APP FILE

4.3 ruling 1's `capture_lift` row, under `E-R16`, rules:

> **`:613`'s CORRESPONDENCE RESOLUTION STAYS EXACTLY AS IT IS.** ...
> **`:614`'s MEMBERSHIP TEST IS REPLACED.** `state.exercises.filter(e => e.id === target).length !== 1`
> becomes the same one-of test asked of **FOLDED**'s exercises INSTEAD of `state.exercises`.

Those two sentences are about two different id spaces and the spec never asks whether they are the
same one. **They are not, and the file that says so is the one the ruling cites.**

**THE MECHANISM, read at `70113da5` and then measured.**

- `source-admission.mjs:613` is `const target = liftAttach(slot.lift_lineage_id) ?? slot.lift_lineage_id;`
  and `liftAttach` (`:437`) is `programmeBasis.lift_correspondence[id]`, built at `:398` by
  `correspondence(source.exercises, scratch.exercises)`, whose own module says what it returns in
  as many words: "it returns, for each DOCUMENT lift id, the ONE FILE lift id it answers for"
  (`rebuild/m4/workout/lift-correspondence.cjs`). **So `target` is a FILE id whenever the lift
  corresponds, and the file's ids are not the document's**: the same module's header states
  "after option A the two id spaces are independent: the file's ids are the old app's short handles
  and the document's are `slugOf`'s slugs, so an id is no longer an answer".
- `state.exercises` at `:614` is the ADMITTED state, which carries the file's handles, plus every
  UNcorresponded document lift, appended as a retired lift by `:477-:484`. That is why `:614` is
  total today, and the comment at `:600-:611` says so.
- `FOLDED` is `foldPlanEditsAt(...)` over `documentState = createCleanInitState({setup: op.payload.setup})`
  (4.3 ruling 2, `source-admission.mjs:221`). **Document ids, start to finish.**

**THE MEASUREMENT, my own cell, and it is short.**
`/home/claude/farm/scratch/wt/ew2-r4b/rebuild/lanes/d/p3-real-shape/r4b-capture-lift.mjs` takes the
fixture of record for an old app shaped import (`legacy-fixture.cjs` through
`real-shape-support.mjs`), builds the phone's own document state with the real
`createCleanInitState`, builds the real `correspondence(...)`, reconstructs `state.exercises` the
way `:477-:484` builds it, and asks BOTH tests of every slot id a pre import session can carry.
Seventeen slot ids: the document's sixteen lifts plus one minted `ew2-added-lift`, which is the
case the ruling exists for.

| the FILE | slot ids whose `target` differs from the slot id | PASS today (`:614` over the admitted state) | PASS under `E-R16` (`:614` over FOLDED) |
|---|---|---|---|
| `variant(0)`, the old app's own shape | **12 of 16** | **16 of 17** | **5 of 17** |
| `variant(7)`, the shape SPIKE M4 sealed | 0 of 16 | 16 of 17 | 17 of 17 |

The twelve, printed by the cell, are `lateral-machine -> lateral`,
`rear-delt-fly-cable-unilateral -> rearDelt`, `prime-seated-row-hooks -> rows`,
`curls-preacher -> curl`, `machine-fly -> fly`, `sulek-wrist-curl-high-cable -> sulek`,
`prime-abdominal-crunch -> abs`, `supported-leg-raise-medicine-ball-pad -> hanging`,
`hack-squat -> hack`, `hip-thrust-machine -> hipthrust`, `leg-extension -> extension`,
`ham-curl -> ham`.

**WHAT THAT MEANS FOR AN ATHLETE.** Under `E-R16` as written, every Earned session he recorded
before the import, on any lift whose name matched the file, refuses `capture_lift` and his import
does not admit. That is the exact defect `:600-:611` records being FIXED by P3-REAL-SHAPE ("this
check refused `capture_lift`, naming the athlete's own lift back at him, measured, spec row 7"),
re-introduced by the fix for a different defect. The population it hits is the one this ticket
exists for.

**AND THE CELL THE SPEC WRITES CANNOT CATCH IT.** EW-17c's main assertion is "admission ADMITS and
raises no `capture_lift` issue", over a bundle sealed the way SPIKE M4 sealed its own, which is
`sealed(7)`. `real-shape-support.mjs`'s bracket remaps the file's ids to the phone's slugs at
**level 2 and every level above it**, so at level 7 the correspondence is the identity and the two
id spaces coincide: my second row measures 0 of 16 differing and 17 of 17 passing. **EW-17c goes
GREEN while the defect ships.** SPIKE M4 could not have found this, for the same reason, and I hold
that against nobody: it is why a reviewer runs a different fixture.

**AND IT IS ALSO AN `E-R19` BREACH.** 4.3 ruling 1's closing sentence, "a lift FOLDED does carry is
admitted, which is precisely the `add` and `replace` case SPIKE M4 rows 8 and 9 measure refusing
today", is a claim about what is ADMITTED AFTER the fix. M4 rows 8 and 9 measure what refuses
BEFORE it. There is no spike row for the claim and no UNMEASURED mark, and 12.4 does not list it.

**WHY NEITHER SINGLE TEST IS TOTAL, which is the part the PM has to rule on.** My cell measures
both halves of the trap in one table: the admitted state carries the corresponded lift and NOT the
minted one; FOLDED carries the minted lift and NOT the corresponded one. `E-R3`'s no disjunct rule
forbids "either", and rightly.

**REQUIRED, and this is a ruling to re-take rather than a sentence to re-word.** One of:
- **(a) the cheapest, and I think the right one: extend `:477-:484` instead of `:614`.** That block
  already appends every document lift the file does not answer for, under its own id, as a retired
  lift. Iterate **FOLDED**'s exercises there instead of `documentProgramme.state.exercises`, and a
  lift minted by `add` or `replace` joins the admitted state exactly as an uncorresponded setup
  lift already does. Then `:613` and `:614` need NO hunk at all, SPIKE M4 rows 8 and 9 stop
  refusing, and the corresponded case is untouched. This is one hunk in the block the spec never
  opens, and whoever writes it measures it rather than trusting me;
- **(b)** `:614` asks FOLDED of `slot.lift_lineage_id`, the pre re-key DOCUMENT id that `:615`
  already counts under, and keeps `:613`'s resolution and `state.exercises` for what they are for,
  stated as two named tests rather than as one replaced one. That is not a disjunct: it is two
  different questions about two different id spaces, and 4.3 says which is which;
- **(c)** the PM re-takes `E-R16` some other way, with the id spaces stated.

Whatever is chosen, **EW-17c gains a control this round found and no round before it could: a
fixture whose FILE ids are NOT the phone's slugs**, which is `variant(0)` or `variant(1)`, and
which `r1-fixes.test.mjs:55-:70` already proves admits through the real port. Without that control
the cell is green on a fixture that cannot fail.

### B2. `E-R17` IS NOT CARRIED OUT. MEASURED, THE ADOPTION STILL COSTS THREE DURABLE LOADS, AND 3.4.4 ITEM 5 ASKS TODAY-SPLIT FOR A BINDING THAT DOES NOT EXIST

`E-R17` rules ONE durable read per adoption, "the generation the gate already loaded is passed
down". 3.4.2, 3.4.4 and 3.6 are re-cut around it, 3.4.4's hunk opens with

```
const loaded = await repository.load();            // the gate's OWN load, which already happens
```

and its cost paragraph concludes "**the count becomes 2** ... and **STOP 9 STANDS UNCHANGED**: the
spec no longer disagrees with itself."

**MEASURED, THE COUNT IS 3.** I ran `r4-adoption3.mjs`, which builds the v4 design exactly as
3.4.2's ten rows, 3.5's first run projection, 3.6's dereference and 3.4.4's hunk specify it, over
the spike's real encrypted store, and counts every `repository.load()`. Both installations, with
exactly ONE `host.read()`:

| step | `repository.load()` calls |
|---|---|
| the gate as it stands, `today-app.cjs:2482-:2488` | **1** |
| 3.4.4's hunk line 1, "the gate's OWN load, which already happens" | **1** |
| `openEditWeekHost(generation)` plus ONE `host.read()` | 1 |
| **TOTAL for one adoption, the spec as written** | **3** |
| total if the gate's BODY is re-cut to load once and call the pure half | 2 |

**WHY, and I re-derived it from the two functions before I believed the cell.** The gate does not
load anything. `today-app.cjs:2482` is, verbatim at `70113da5`:

```
function athleteBasisState() {
  return import("./local-source-basis.mjs")
    .then((module) => module.admittedLocalSourceState(setup))
    .catch(() => null)
    .then((imported) => { importAdmitted = !!imported; return imported || setup.athleteState(); });
}
```

The `repository.load()` is `local-source-basis.mjs:78`, inside `admittedLocalSourceState`, one
frame deeper and in ANOTHER FILE, and that function returns the BASIS and throws the generation
away. **3.4.4 item 5 knows the line and draws the wrong conclusion from it**: it asks TODAY-SPLIT
"to keep that value in a binding rather than to consume it inline". There is no binding to keep.

**AND EACH WAY OUT IS FORBIDDEN BY THIS SPEC'S OWN TEXT.**

1. **A hunk in `local-source-basis.mjs`** returning `{generation, basis}` or exporting a loader.
   3.3 line 5 says that file "takes NO hunk either. 3.4 exists to keep it that way", 3.2's row says
   "NOT TOUCHED, zero bytes", and 3.4's option table REJECTS touching it.
2. **Re-cut `athleteBasisState`'s BODY** to `const loaded = await setup.host.repository.load();`
   then `admittedLocalSourceBasis(loaded.generation, {athleteLabel, namespace})` for both
   `importAdmitted` and `basisState`. That reaches 2, and my run measures it reaching 2. But
   (a) 3.4.4 item 4 requires `importAdmitted` stay "set from the RAW `admittedLocalSourceState` at
   `:2488`"; (b) TODAY-SPLIT D.1 byte-proves every moved writer region, and this rewrites one of the
   two regions it byte-proves in the week it is first written; and (c) it discards the contract
   `admittedLocalSourceState` states in its own comment at `:70-:73`, "any refusal, absence or
   unreadable record is null: this never throws into the adoption chain and never becomes a reason
   Today fails to paint". A hand re-creating that `try` by eye is how the adoption chain acquires
   its next silent failure.
3. **Leave it at 3 and re-word STOP 9.** The spec explicitly refuses this: "the STOP is not relaxed
   to fit the design; the design was changed to fit the STOP".

**SO THE SPEC FAILS ITS OWN STOP 9 AT DESIGN TIME FOR THE SECOND ROUND RUNNING, and this time it
says the opposite in bold.** That is worse than v3's version, because v3 did not know and v4 tells
a builder the count has been fixed. EW-14, which "measures the count by name", is red on arrival.

**REQUIRED: a PM choice, not a correction.** Either (a) 3.2, 3.3 line 5 and 3.4's option table are
re-opened and a NAMED hunk in `local-source-basis.mjs` is paid for, one new export returning the
loaded generation beside the basis, which keeps the `try` exactly where it is, with the cost added
to 9.3's sealed row and to 6.7; or (b) 3.4.4 item 4 is rewritten to permit the gate's body to be
re-cut, STOP 2 gains it as a FIFTH named dependency on TODAY-SPLIT with its byte proof named, and
the `try` is restated in the hunk verbatim; or (c) STOP 9 is re-worded to three and the PM accepts
it. What is not available is the present text, which claims (b)'s number while forbidding (b)'s
hunk.

### B3. THE RELEASED CALLBACK TABLE IS NAMED `onWeek.save` AND `onWeek.close`, AND BOTH ARE ON THE FENCE'S OWN WORD LIST. 6.8 CHECKS THE IMPORT SIDE AND NOT THE CALL SIDE

The cut of 2.1 is right and I tried hard to fault it and could not: the five methods move sealed,
the shim and the basis file go with them, the released half imports nothing sealed, and 3.4.1's
three reasons for a separate module are sound. **The defect is in the NAMES, and the spec prints
the evidence against itself two pages apart.**

2.1 at line 484 quotes TODAY-SPLIT E.3 correctly, "BY MEMBER NAME IN CODE POSITION, including
`.save`, `.reopen`, `.close`, `.latest` on a lane identifier". 2.2 at lines 585 to 588 then
specifies what the RELEASED editor calls: "`onWeek.open()` ... `onWeek.review(kind, exercise_id,
fields)` ... **`onWeek.save(review_id)`** serves S; `onWeek.cancel(review_id)` and
**`onWeek.close()`** serve the two exits".

Measured against the fence as TODAY-SPLIT specifies it, which I read myself at
`rebuild/c-today-split`:

- E.3's first group is verbatim "**Durable writers, as MEMBER NAMES in code position:** `.save`,
  `.weighIn`, `.logSet`, `.finish`, `.undo`, `.start`, `.forget`, `.recover`, `.restart`,
  `.reopen`, `.retract`, ... `.refresh` on a lane identifier, `.latest` on a lane identifier,
  `.all`, `.close` on a host identifier, `.commit`, `.forDate`". **`.save` carries no qualification
  at all.**
- E.4: the call side "uses a token scan over `codeOf(source)` ... the scan is over IDENTIFIERS and
  MEMBER NAMES, not over call expressions". A token scan cannot tell `onWeek.save(...)` from
  `host.save(...)`, and is not meant to. E.4 also says a comment mentioning `host.save` is
  invisible because `codeOf` strips comments, which is the measure of how literal the scan is.
- E.1 and E.2 put the released files INSIDE the fence by name.

**AND TODAY-SPLIT'S OWN CALLBACK TABLE OBEYS THE RULE.** Its B.3 entries are `on.submitWeighIn`,
`on.recordIntake`, `on.retryFoodRead`, `on.recordSleep`, `on.retrySleepRead`, `on.recoverWorkout`,
`on.forgetCheckInRead`, `on.openFoodLane`, `on.paintImport`. Not one is a fenced member name, and
two are visibly renamed AWAY from one (`on.recoverWorkout` where the sealed call is `.recover`).
That is a design rule this item did not pick up.

**6.8 does not cover it.** Its three bullets are `FENCE-VIEW-IMPORT`, `FENCE-SECOND-SEALED-IMPORT`
and the `product` declaration, all on the IMPORT side. 2.1 even records that the OBJECT names were
censused ("`lanes`, `facade`, `on`, `painter` are already taken by the split, so this item uses
`weekFacade` and `onWeek` and asserts zero code occurrences of either"). The census was run on the
two objects and not on their seven members, which is where the fence actually looks.

**WHAT IS AT RISK, precisely.** `onWeek.save` is a red by E.3 as written. `onWeek.close` is a red
unless "on a host identifier" is implemented as something a token scan can honour, which E.4 says
it is not. `machineLatest` and `machineSave` are single tokens and are safe; `open`, `review` and
`cancel` are not on the list.

**REQUIRED.** Rename the callback entries off the word list, the way TODAY-SPLIT renamed its own,
and move 2.2's `HOW TO READ` paragraph and 2.1's table with them. Then 6.8 gains a FOURTH bullet:
the three released files contain ZERO of E.3's fenced member names in code position, censused the
way 2.1 censused the two object names, with the census printed in the report. A spec that makes a
green fence its own bar has to run the fence's own test against its own names.

### B4. EXACTLY ONE OF THE TWENTY-TWO IDS CAN REACH GREEN ON ACCEPTANCE, NOT FOUR, AND 9.3 IS THE SENTENCE THE PM APPROVES

`E-R13` asked for an honest restatement of what can start. v4 fixes the RED column for seventeen
ids and then states the GREEN column three times, wrongly:

- section 5: EW-17a `blocked on` **nothing**; EW-17b `blocked on` **nothing**;
- 7.2: "**EW-17a, EW-17b, EW-17d** | **NOTHING. They can run the day this spec is accepted**";
- 9.3: "only the four cells that need no editor (EW-17d, EW-17a, EW-17b, EW-19, about 3 to 4 hours)
  can reach **GREEN** before F2 lands".

Measured, and the spec's own section 0 is what measures it:

1. **EW-17a and EW-17b need F2.** Their main assertions are the outcomes 4.3 ruling 1 chose for
   `capture_sets` and `capture_membership`. Both right hand sides are `FOLDED`, which is 4.3 ruling
   2's `foldPlanEditsAt`, which takes `validateTags` and `projectNewExerciseTags` from section 3.5.
   **SPIKE M5 row 4, which I re-ran, shows the fold refusing `PLAN_EDIT_TAGS_INVALID` at
   `plan-edit-commands.cjs:66` from `plan-edit-model.cjs:203` with `validateTags` withheld**, on a
   generation carrying no `add` at all. 3.5 itself says "section 4's fix cannot be built without
   this package either".
2. **All four need section 4's SEALED hunks, which are another lane's and are not on any lane's
   desk on acceptance day.** EW-17d asserts admission ADMITS, which needs ruling 0's replay family.
   EW-17a, EW-17b and EW-17c need ruling 1's re-pointing. 4.4 prices all three hunks and 9.3 lists
   them under "not counted above, because they are shared or not this lane's". A cell whose green
   depends on a hunk nobody has written cannot go green on acceptance.
3. **EW-19 is the only one left**, and the spec is right about it: it drives the exported
   `watchDayRollover` with a fake `doc` and needs nothing.

The hours do not move and the START date does not move. The sentence the PM is approving does, and
that is exactly what `E-R13` was for. This is also risk 13 in the spec's own table, one round after
the round that introduced it, and it is a claim about what goes green that carries neither a spike
row nor an UNMEASURED mark, which `E-R19` forbids.

**REQUIRED.** Section 5's `blocked on` for EW-17a and EW-17b becomes "3.5 and 4.3's hunks for
GREEN, nothing for the RED run"; EW-17d's becomes "4.3 ruling 0's hunk for GREEN, nothing for the
RED run"; 7.2's row splits the same way; 9.3's fourth column names EW-19 as the only id that
reaches green and says the other three reach their measured RED answer, which is genuinely worth
having and is what SPIKE M4 bought.

---

## 2. WHAT I RE-RAN, AND WHETHER SECTION 0 SURVIVES

`E-R19` makes section 0 the load bearing page of the document, so it is the page a reviewer attacks
first. I re-ran four of its seven modules unaltered and compared every row.

| module | rows | verdict |
|---|---|---|
| **M1** the first read | 8 installation rows plus 4 withholding rows | **REPRODUCED EXACTLY.** `PLAN_EDIT_TAGS_INVALID` at `plan-edit-commands.cjs:66` from `plan-edit-model.cjs:203` on rows 1, 3, 5 and 7; `PLAN_EDIT_TAG_BASIS_UNPROVEN` at `:217` on rows 2 and 12; READ OK on 4, 6 and 8; `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` on row 11. **3.5's headline is true** |
| **M2** the clock | 6 construction rows plus 5 ordering rows | **REPRODUCED EXACTLY**, including the corrected cite. I opened `host-bindings.mjs` myself: `:242-:243` is the three-function shape guard throwing `LOCAL_HOST_CLOCK_INVALID` state 18, `:244` is `const clock = hostClock || scope.clock`, `:229` takes `clock: hostClock`. `clientClockFor('2026-09-13', live)` really returns `["today","now","tz","monotonicMs"]` with a FROZEN `today()` and a LIVE `now()` |
| **M5** the fold | 14 rows | **REPRODUCED EXACTLY**, including row 3 FOLDED (applied 2, sets 5, 4 lifts), row 12 FOLDED with the tombstoned `add` EXCLUDED (3 lifts, not 4), and the guard rows refusing at `:227`, `:235` and `:243` |
| **M7** the midnight window | 5 rows | **REPRODUCED EXACTLY.** I re-measured `today-entry.mjs:472` myself: `intervalMs = 60000`. `:484` is `onVisible` and tests `doc.visibilityState !== "hidden"`, so row 3 is real |
| **M3** adoption | 12 + 42 + 6 rows | **REPRODUCED** on the read count, which is the part B2 turns on, and on rows 3, 8, 9 and 10, which are the part 3.4.3 turns on. See B2 and note N1 |
| **M6** the F2 package | 6 claims | **VERIFIED by reading rather than by a second checkout.** `grep -rn validateSetupTags rebuild` returns its own definition and the frozen return list and NOTHING else, so 3.5.1's correction to R3 (three functions plus the factory, not four) is right |
| **M4** reachability | 10 rows | **NOT RE-RUN**: it needs a real `port.cjs` seal, which the farm cannot do, and I spent the PC budget on B1's fixture question instead, which M4 could not have answered. I verified its MECHANISM: `source-admission.mjs:526` is the catch-all the spec quotes, verbatim, and I read the family loop above it. Nothing claims `op.class === 'plan'`. FACT 1 is sound on the code |

### 2.1 Cites I opened myself, since `E-R19`'s rule is that the reviewer opens the consuming line

All correct at `70113da5`, and `git diff ad8ced07..70113da5 -- rebuild/` is two markdown files, so
they are correct at the spec's own head.

`plan-edit-model.cjs`: `:93-:98` `importPresentIn`, `:100` the `basisSource = 'first-run'` default,
`:101` and `:104` the two hash codes, `:194` the row binding, `:202-:203`, `:208`, `:209`, `:213`,
`:216`, `:217`, `:225-:227` (ONE `fail()` at `:227`, as the spike says), `:235`, `:237-:240`,
`:242-:243`, **`:361` `const index = (order[oldDay] || []).indexOf(target.id);` and `:362` the
`put` into `state.retirements`** (R3 N1 is right and v4 has it right).

`source-admission.mjs`: `:96-:98` the CLOSED `KNOWN_REPLAY_CODES`, which does carry
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED` and does carry `LOCAL_SOURCE_EFFECT_UNMAPPED`; `:135`
`detailOf`; `:390` and `:398` the correspondence; `:437` `liftAttach`; `:477-:484` the append block
(B1); `:526` the catch-all; `:598`, `:613`, `:614`, `:665`, `:674` (`originalDay` really is nine
lines after `:665`, R3 N2 upheld), `:695-:699`.

`local-source-basis.mjs`: `:32` the pure half's signature, `:66` the athlete label narrowing,
`:70-:73` the never-throws comment, `:73-:82` the read half, `:78` the load, `:80` `host.namespace`.
`host-bindings.mjs`: `:229`, `:242-:244`, `:335`. `today-entry.mjs`: `:471`, `:472`, `:484`.
`today-app.cjs:2482-:2489` verbatim. `lift-correspondence.cjs` entire, 100 lines.

**Copy census, counted by script over the whole spec: zero characters above U+007E anywhere.** No
U+2013, no U+2014, no smart quote, no emoji. CLEAN, for the second round running.

---

## 3. MY OWN CELL, AND WHAT IT BROKE

The brief for this round is a cell that tries to make the SPECIFIED design fail. I wrote it against
the re-pointed capture check, because that is the half of the spec that touches an athlete's data
rather than his screen, and because section 0's own fixture could not reach it.

`/home/claude/farm/scratch/wt/ew2-r4b/rebuild/lanes/d/p3-real-shape/r4b-capture-lift.mjs`, 80 lines,
throwaway, never pushed. It imports the real `lift-correspondence.cjs`, the real
`createCleanInitState`, and the lane's fixture of record, and it asks the two membership tests of
every slot id. It seals nothing and needs no port, which is why it runs in the farm in under three
seconds while M4 needed the PC.

**What it broke is B1 and the table is there.** Two things worth saying here rather than in the
finding:

1. **The cell is cheap enough to be a CELL.** Nothing in it needs a bundle, a seal or a browser.
   Whatever the PM rules on `E-R16`, a four line assertion that
   `correspondence(variant(0).exercises, PHONE.setup.exercises)['lateral-machine'] === 'lateral'`
   and that the document state does not carry `lateral` belongs beside EW-17c, because it is the
   assertion that makes EW-17c's fixture honest.
2. **It measures the fixture and not only the product**, which is the class of defect round 4
   should be looking for now. Three rounds of reading found argument defects; the spike found
   integration defects; this one is a FIXTURE defect, where the cell and the product agree with
   each other and both are wrong about the world.

**What I could NOT break, recorded so round 5 does not spend time here.** I re-ran the previous
hand's adoption cells and reproduced SPIKE M3 rows 3, 8, 9 and 10 exactly, including the one that
matters most: **on an imported installation the WRONG `basisState` wiring reads OK and proves
nothing**, which is why 3.4.3's rule and STOP 13 are right and why EW-13c's control c1 had to be
rewritten. I could not find a feed that makes `planEditedState` return `undefined`. I could not
find a second adoption path. The pinning of `basisState` to the raw value survived a fourth round.

---

## 4. R3's SIX BLOCKING, NINE NOTES AND TWO PM NOTES

| R3 | verdict | what I measured |
|---|---|---|
| **B1** the no-writer rule applied to one file | **FIXED, and a new defect in the fix** | 2.1 is re-cut entire, the five methods are sealed, `edit-week-basis.mjs` and `edit-week-tags.mjs` are gone into `edit-week-lane.cjs`, M1 and M2 are re-cut, and the three released files import nothing sealed. I tried to find a fourth released thing that holds a writer and could not. **The fix trips the fence's CALL side: B3 above** |
| **B2** the first read refuses without F2 | **FIXED** | 3.5 is rewritten around it, 3.5.1 names every function, 5, 7.1, 7.2 and 9.3 carry the corrected list. SPIKE M1 reproduces under my hand. The correction to R3 (three functions, not four) is right |
| **B3** the fold refuses before it folds | **FIXED** | 4.3 ruling 2 now carries `basisSource` explicitly, tag projects `documentState`, names five collaborators and one argument including `generation`, and skips the four guards with each one driven. SPIKE M5 reproduces. Ruling 2a answers the last paragraph |
| **B4** the clock row is wrong twice | **FIXED** | The `clock` row is `clientClockFor(day, live)`, `liveDay` is separate and says so, EW-18 is written to M2 row 9 and carries row 8 as a control. I re-ran M2 and the spike's correction of R3's mechanism is right: the SHAPE guard at `:242-:243` refuses first |
| **B5** `capture_lift` names no replacement | **FIXED AS ASKED, AND THE REPLACEMENT IS WRONG** | The row now says "is replaced by" in the same words as the other two, which is exactly what R3 required, and EW-17c is rewritten. **What it replaces it WITH is B1 above.** R3's own prediction of the answer ("`:613` stays, `:614` is asked of FOLDED") is what the PM ruled, and it is the half nobody measured |
| **B6** the adoption costs three durable reads | **STILL OPEN** | R3 is upheld and understated: the instrumented count is FOUR total under v3. The repair is specified and does not work. **B2 above** |
| **N1** the retirement is `:362` | **FIXED** | I opened both lines. All three v3 cites corrected |
| **N2** `originalDay` is declared after `capture_sets` | **FIXED** | 4.3 ruling 2's `onLocalDate` row names `start.effective.local_date` and says why. `:665` and `:674` re-measured, nine lines apart |
| **N3** `generation` was not among the collaborators | **FIXED** | It is named, with `source-admission.mjs:596` |
| **N4** TODAY-SPLIT round 2 IS pushed | **FIXED** | 3.0's TIMING paragraph rewritten, `gym-settings-lane.mjs` added to 3.2, STOP 2 widened with four dependencies. One drift: the branch is now at `60d6ad97`, its own review R2 (REJECT, eight blocking), not `906cb056`. Nothing in section 3 turns on the difference, and its E.3 is unchanged between the two, which I checked |
| **N5** one proposed sentence is false in one direction | **FIXED** | The new sentence names the fact both directions share, carries no dash, and v3's is explicitly withdrawn. I checked `plan-edit-host.mjs:69` and `:77` again: it fires on either direction |
| **N6** the two hash codes fire at E0 | **FIXED** | Both are on E0's list, with X kept as the treatment and E0 named as the door |
| **N7** `setup-model.mjs` is not on the MAY-IMPORT list | **FIXED, and answered against E.3 rather than argued** | The item does not import it at all; `exercise-catalogue.mjs` IS on the list by name, which I verified in E.3. The finding that `setup-model.mjs:14` fails the fence on its own contents is correctly reported to lane C rather than fixed here |
| **N8** two wording repairs in 3.4.2 | **FIXED, both** | |
| **N9** the midnight window has no cell | **FIXED** | It has a measured bound, a rule in 4.2 and EW-19, and I re-ran M7 |
| **PM NOTE a** F2 gates the whole door | **CARRIED** | 3.5 is rewritten, F2 is FIRST on the child, STOP 10 is widened, and 3.5 consequence 6 tells the PM the code has never been reviewed, which is the most useful paragraph in section 3 |
| **PM NOTE b** the seal inversion | **CARRIED, and further than R3 asked** | `planEditedState` and the tag rule are both sealed, the ten lines are paid, 3.4.1 justifies the separate module in three reasons I could not fault, and STOP 16 names five shapes |

**Nothing of R3's is disputed by this round, and nothing of R3's is disputed by me.** The three
places the spike contradicts R3's MECHANISM (12.2 (a), (b) and (c)) are each reproducible under my
hand and each leaves R3's verdict standing, which is what `E-R19` asks for.

---

## 5. THE PM's RULINGS `E-R12` TO `E-R20`

| ruling | carried out? |
|---|---|
| **`E-R12`** nothing holding a host, lane or writer, and nothing shaping adopted state or a durable projection, in a released file; sealed edit week lane; pay the sealed lines; re-cut 2.1, 2.2, 3.x and the bar against E.3 | **YES on the substance, NO on the fence's own test.** The cut is right, the site is justified, the lines are paid (about 130, roughly double v3, and the doubling is the ruling), and 6.8 is rewritten. **The released callback table's own member names fail E.3: B3** |
| **`E-R13`** name every F2 function; say plainly what is blocked; F2 first on the child; restate honestly what can start | **YES on the first three, NO on the fourth.** 3.5.1's table is exactly what the ruling asked for and its correction to R3 is measured. 3.3 line 6 puts F2 first. **9.3's GREEN sentence is still wrong: B4.** And 3.5 consequence 3's own blocked list contradicts every other statement of it: note N2 |
| **`E-R14`** `foldPlanEditsAt` carries `basisSource` and what proves the tag basis; rule what admission reports | **YES, and it is the best new page in the round.** The signature carries both, `'first-run'` is chosen for a reason that is about the PROOF half and not only the guards, and ruling 2a keeps `KNOWN_REPLAY_CODES` closed and translates at the call site. The three field names are proposed rather than assumed. One unmeasured claim rides with it: note N4 |
| **`E-R15`** the era's real client clock, frozen `today()` and `liveDay` separate; DAY_TURNED stays raisable with its cell | **YES.** Both rows are right, EW-18 is written to the row that actually raises it, and control 3 fails the cell if a future hand ever wires them together, which is the guard R3 wanted and a better one |
| **`E-R16`** the `capture_lift` row is a replacement, not a conjunction; EW-17c's main assertion and both controls rewritten | **CARRIED EXACTLY AS WORDED, AND THE WORDING IS WRONG: B1.** I am told to say so with evidence and the evidence is a table. The author did what the ruling said; the ruling crosses two id spaces. The PM re-takes this one |
| **`E-R17`** ONE durable read per adoption, the gate's generation passed down; STOP 9 stands | **NO: B2.** The design is right and the premise under it is false |
| **`E-R18`** every note N1 to N9 landed; N9 gets a cell or a rule; BASIS_SOURCE_CHANGED true in both directions | **YES, all of it.** Section 4 above |
| **`E-R19`** every claim about what refuses, in what order, with which code, cites a spike row or is UNMEASURED; the spike wins over a review | **MOSTLY, and it is the rule that found two of my four findings.** 12.4's list is honest and item 3 (the fold never driven from inside a real `programme()`) is correctly named as the largest thing handed to the build. **Two claims carry neither a row nor a mark: 4.3 ruling 1's "a lift FOLDED does carry is admitted" (B1) and 9.3's GREEN sentence (B4)** |
| **`E-R20`** `DECISIONS:536`'s candidate list is not a pin list | **YES.** Q-E records it as answered and closed, in the PM's own terms, and does not re-ask it |

---

## 6. NOTES

### N1. The adoption read takes NO date, so on the day of the edit the adoption sees nothing, and two cells say otherwise

3.4.4's hunk calls `host.read()` with no argument, and `readVerified` (`plan-edit-host.mjs:145`)
defaults to `localDay()`. An edit reviewed on day D has `starts_on` D+1 (`result()`'s `:376` is
`if (value.starts_on <= date)`). Measured, on a real saved edit through the real host:

| when the adoption read is taken | first run `add` | imported `update sets 3 to 5` |
|---|---|---|
| the adoption's own day, which is the day the edit was saved | the added lift is **ABSENT** | `sets=2`, the pre-edit value |
| at or after `starts_on` | the added lift is **PRESENT, exactly once** | `sets=5` |

That is correct behaviour and NOT a defect in the design: an edit that starts tomorrow should not
change today's week. **It is a defect in two cells.** EW-13d asserts "open a SECOND time, ASSERT
`read:true` AND that the added lift appears exactly ONCE in `read().state.exercises`" and names no
date; EW-14 says "same page commit reaches real Today" and names no date. Both are red on arrival
unless the cell either reads at or after `starts_on` or advances the clock. One clause in each row
fixes it, and 3.4.4 should say which day the adoption read is taken on, because a builder will
otherwise chase it into the host.

### N2. 3.5 consequence 3's blocked list has eighteen ids and every other statement of it has seventeen

3.5 consequence 3 blocks "EW-01 ... EW-15, EW-17c, EW-18 **and EW-19**", and calls it "every cell
that opens the editor". EW-19 opens no editor: it drives `watchDayRollover` with a fake `doc`, and
section 5, 7.1, 7.2 and 9.3 all say its `blocked on` is nothing. Strike EW-19 from that one list.

### N3. The factory derives `basisSource` from the handed-in generation and `projectorFor` derives it from the reopened one

`openEditWeekHost(generation)` decides `firstRun` and `basisState` from the generation the gate
handed it, while `host.read()` reopens the lane and `projectorFor` (`plan-edit-host.mjs:68-:69`)
computes `basisSource` from the REOPENED generation. Measured, handed a pre-import generation and
reading after an import is admitted in between: the host CONSTRUCTS, `host.read()` refuses
`PLAN_EDIT_IMPORTED_BASIS_MISMATCH`, and adoption is SAFE because `planEditedState` falls back to
the raw basis. **But the code the athlete meets at E0 is the one code STOP 13 and EW-13c's control
c2 both attach to a WIRING defect**, so the first builder to see it will hunt a bug that is not
there. One sentence in 3.4.2 or in STOP 13 retires it: this code at E0 is a race between the gate's
load and the lane's reopen before it is a wiring defect.

### N4. Ruling 2a's field vocabulary claim is not measured and is not on 12.4's list

4.3 ruling 2a says the three proposed `field` values "are drawn by the import screen through
whatever treatment it already gives `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`". Measured, `field` is not
validated against any closed table in `source-admission.mjs`: `:135`'s `detailOf` passes
`e.field` straight through. So the CODE will carry a new field name without complaint, and what the
import SCREEN does with an unfamiliar one is untested by anything in this spec. The ruling is still
right; the sentence should be marked UNMEASURED and listed in 12.4, which is what `E-R19` is for.

### N5. TODAY-SPLIT is at `60d6ad97` and is at REJECT R2 with eight blocking findings

The header and 3.0 read it at `906cb056`. Its own independent review R2 is now pushed on top. I
checked E.3 and E.4 at the current head and neither moved, so nothing in section 3 or in B3 above
is excused by it, but STOP 2's four dependencies are now dependencies on a document that is itself
in a fix round, and 9.5's heads should say so.

---

## 7. WHAT I TRIED TO BREAK AND COULD NOT

Recorded so round 5 does not spend the time.

1. **3.4.1's siting argument.** Three reasons, in order of weight, each checkable, and the second
   sealed module TODAY-SPLIT already creates makes the third one a fact rather than an analogy. I
   looked for a fourth sealed import that would trip `FENCE-SECOND-SEALED-IMPORT` and there is
   none: the released editor imports zero sealed modules.
2. **3.6's `setupsIn` dereference over the handed-in generation.** I drove it: exactly one
   surviving row on both installations, and the raw operation it dereferences constructs the host.
   The correction is right and it still costs zero pinned bytes.
3. **3.4.3's pinning.** Fourth round of attack, first round with a run behind it. Rows 3 and 8 hold.
4. **The fold's exclusion of a retracted edit.** SPIKE M5 row 12 under my hand: three lifts, not
   four. STOP 11 (b) is satisfied by evidence.
5. **The copy census and law 4.** Clean, and the one re-proposed sentence is true in both
   directions.
6. **Section 4's digest constraint.** `:779` is where `programme_digest` is computed, the out
   parameters are out parameters, and the folded state stays per capture.
7. **The estimate's arithmetic.** The rows add up. B4 moves the fourth column, not the sum.
8. **EW-18's three controls.** Control 3 is the one that keeps `E-R15` honest over time and it is
   well chosen.

---

## 8. WHAT I DID NOT DO

I installed nothing, launched no browser, ran no `b-package.cjs`, sealed nothing and pushed nothing
from any scratch worktree. I did not re-run SPIKE M4, and I say so in section 2 with the reason. I
changed no product, test, tooling or workflow byte: the only file this branch gains from me is this
one, and the only files I wrote anywhere else are throwaway cells in farm scratch worktrees that
are never pushed. I did not read `rebuild/conform/private`, any `ledger/` directory,
`src/history.js`, `C:\Users\joeym\EarnedPort`, the protected soak, or any owner measurement, on
either machine, and nothing outside the farm's include list was fetched. No credential appears
above. Zero U+2013 and zero U+2014 in this file.

**One thing for the PM, because it is a pattern and not a finding.** Round 3 found defects by
reading, round 4's spike found them by running the product, and the one finding this round that
mattered came from running the product against a DIFFERENT FIXTURE. Every id in `sealed(7)` was
remapped to the phone's slugs by the bracket's level 2, so the spike, the spec and EW-17c all agree
with each other about a world where the two id spaces coincide, and the population this ticket
exists for lives in the world where they do not. The cheapest guard against the next one is the
rule `E-R19` already half states, extended by one clause: every cell that asserts what is ADMITTED
names the bracket level of the file it seals, and a reviewer asks what that level hides.
