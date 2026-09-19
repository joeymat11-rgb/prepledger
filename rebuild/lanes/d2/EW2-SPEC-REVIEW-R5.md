# EW2-SPEC REVIEW R5, INDEPENDENT, AND THE ROUND THAT RAN THE PRODUCT AGAINST THE RE-TAKEN RULING

Reviewer: cowork (Earned lane hand), Opus, 2026-09-19, told to disagree. Reviewed file
`rebuild/lanes/d2/EW2-SPEC.md` (3311 lines) at branch `rebuild/d2-ew2-spec` head `0bf6f230`,
against v4 (`f9b1c8db`), the v4 to v5 diff (1011 changed lines in the spec, 1871 added across ten
files), review R4 (`84e09193`) and the PM's round 5 rulings `E-R16 PRIME`, `E-R17 PRIME` and
`E-R21` to `E-R24`.

**METHOD, AND IT IS R4's, CONTINUED ONE STEP.** R4 found the finding that mattered by running the
product against a DIFFERENT FIXTURE. I re-ran every cell v5 leans on, in a clean scratch worktree
of my own, and then wrote a cell against the THIRD case the PM named and the spike did not drive:
a lift whose DOCUMENT id equals ANOTHER lift's FILE id. That cell is BLOCKING 1.

**Where my runs are, so the next hand repeats them rather than trusts me.**
- My own scratch worktree `/home/claude/farm/scratch/wt/ew2-r5v` at `0bf6f230`, made with
  `farm-scratch.sh`. `git diff 70113da5..0bf6f230 -- rebuild/` is markdown and `spike/` ONLY, so
  the product tree I measured on is the tree the spec cites.
- **The seven committed cells of `rebuild/lanes/d2/spike/` re-run unaltered.** All seven sha256 in
  `spike/README.md` match the committed bytes, counted rather than trusted. Every value in v5's
  tables reproduced.
- **MY OWN CELLS**, throwaway, never pushed: `r5v-collide.mjs`, `r5v-collide2.mjs` and
  `r5v-membership.mjs` in `rebuild/lanes/d/plan-edit/` of that worktree. They import the real
  `slugOf`, the real `lift-correspondence.cjs`, the real `createCleanInitState`, the real
  `plan-edit-model.cjs` projector and the real engine runtime, and they save real plan edits
  through the real host. None seals a bundle, none needs the port, all three run in under three
  seconds.

Nothing was pushed from any scratch worktree, nothing was installed, no browser was launched, no
`b-package.cjs` ran and no seal was attempted. I did not read `rebuild/conform/private`, any
`ledger/` directory, `src/history.js`, `C:\Users\joeym\EarnedPort`, the protected soak or any owner
measurement, on either machine. No credential appears here. Zero U+2013 and zero U+2014 in this
file: the whole file is ASCII, counted.

## VERDICT: ACCEPT WITH NOTES

**This is the strongest version of this document and I could not reopen a single thing R4 closed.**
All four of R4's blocking findings are FIXED, all five of its notes are ADOPTED, every table v5
marks MEASURED reproduces value for value under my hand, and the two re-taken rulings are carried
out with their measurements printed rather than asserted. Section 4.3's id space table is the best
new page in five rounds and it is the page that stops this class of defect recurring.

**I return ACCEPT WITH NOTES rather than REJECT because the PM has declared this the last document
round and because nothing I found needs another round of prose to fix.** Two findings must be
settled before a byte moves, and both land inside machinery the spec already built for them:

- **B1 is a real hole in `E-R16 PRIME` (c), found the way R4 found B1: by a fixture the spike did
  not run.** A lift a plan edit ADDED can be minted, by the product's own `slugOf`, under an id
  that is ANOTHER lift's FILE handle. Measured: the real host admits the add, `:389`'s collision
  guard does not see it because it reads the SETUP document, all three capture checks PASS, and the
  re-key at `:733` lands the athlete's sets on a DIFFERENT lift's history. `STOP 18` and `Q-M`
  already exist for this row; they must carry this case, and the recommendation the spec makes to
  the PM does NOT repair it.
- **B2 is one clause in the one hunk this whole round is about.** 3.4.4's re-cut gate hunk drops the
  `.catch(() => null)` that today's `today-app.cjs:2482-:2488` puts around the DYNAMIC IMPORT, and
  that catch is the guard `local-source-basis.mjs:70-:73` exists for.

Nine notes follow. Two of them are arithmetic in the one paragraph `E-R23` was written to make
honest, which is worth saying plainly: the sentence the PM approves is still one id short.

---

## 1. BLOCKING

### B1. A PLAN-ADDED LIFT CAN BE MINTED UNDER ANOTHER LIFT'S FILE ID, AND UNDER `E-R16 PRIME` NOTHING REFUSES IT. MEASURED, THE ATHLETE'S SETS JOIN A DIFFERENT LIFT'S HISTORY

4.3 ruling 1 (c) prints a measured table and its last two rows are:

> | the ADMITTED state carries a row under that id | **NO, on both fixtures** |
>
> **Under which id its captures attach: its own document id, and the ADMITTED state has no row
> there.**

**That is true of the id the spike chose and it is not true in general, and the case where it is
false is the case `lift-correspondence.cjs:64-:74` says must be REFUSED BY NAME.**

**THE MECHANISM, read at `0bf6f230` and then driven.**

- A plan edit's `add` carries an `exercise.id` the EDITOR mints. The minter is the product's own
  `slugOf` (`setup-model.mjs:255-:263`), over the ids already TAKEN, and on a first run
  installation the taken set is the DOCUMENT's.
- `plan-edit-model.cjs:346` is the only id guard: `if (state.exercises.some(e => e.id === row.id)) fail('PLAN_EDIT_ID_REUSED')`.
  `state` there is the BASIS, which on a first run installation is the document. **The file's
  handles are not known to the phone at edit time and cannot be.**
- `source-admission.mjs:389` is the guard written for exactly this hazard:
  `const collisions=idCollisions(source.exercises,scratch.exercises);` and its own comment at
  `:380-:388` says an id shared by two lifts that do not answer for each other by name is
  "REFUSED, not left to bind". **`scratch.exercises` is the SETUP DOCUMENT. It never carries a lift
  a plan edit minted afterwards.**

**THE MEASUREMENT, my cell `r5v-collide.mjs`, on the lane's fixture of record (`variant(0)`, the old
app's own shape) and the phone's own document.** The athlete types `Hack`. The document already
holds `hack-squat` ("Hack squat"), so `hack` is FREE in document space. The file's handle for
"Hack squat" is `hack`.

| question | measured |
|---|---|
| the id the real `slugOf` mints for `Hack` | **`hack`** |
| the real host reviews and saves the `add` | **YES, `starts_on` `2026-09-17`** |
| `PLAN_EDIT_ID_REUSED` fires | **NO** (control: an `add` of id `hack-squat` DOES raise it) |
| `idCollisions(variant(0).exercises, PHONE.setup.exercises)` | **`[]`** |
| the same function asked of FOLDED instead | **`['hack']`** |
| `lift_correspondence['hack']` | **null**, so `:613`'s target is `hack` |
| `capture_lift` under `E-R16 PRIME` (a) + (a2) | **PASSES** |
| `capture_lift` as it stands today | PASSES |
| the ADMITTED state carries a row under `hack` | **YES, and it is the FILE lift named "Hack squat"** |
| the SAME lift? | **NO** |
| Q-M's recommended shape (a) repairs it | **NO.** `held.has('hack')` skips the append |
| control: the NON-colliding added lift's admitted row | **absent**, reproducing 4.3 (c) exactly |

**AND NO OTHER CAPTURE CHECK CATCHES IT EITHER** (`r5v-collide2.mjs`, same fixture, first `L` day
at or after `starts_on`, which is `2026-09-18`):

| check | measured |
|---|---|
| `capture_membership` pool for that day | carries `hack`, **so it PASSES**. The pool printed is `calves, prime-abdominal-crunch, supported-leg-raise-medicine-ball-pad, hack-squat, hip-thrust-machine, leg-extension, ham-curl, hack` |
| `capture_sets` | FOLDED prescribes 3 for `hack`, so a 3 slot capture **PASSES** |
| `capture_lift` under (a) + (a2) | **PASSES** |
| the re-key at `:733` attaches his entries to | **"Hack squat"** |

**AND THE POOL IS THE PART THAT SHOULD WORRY THE PM MOST.** That day's pool holds BOTH
`hack-squat` and `hack`. `hack-squat` re-keys through the correspondence to the file's `hack`;
`hack` has no correspondence and keeps its own id, which is also `hack`. **Two distinct lifts of
the athlete's week are re-keyed onto ONE file lift, in stored evidence, silently.** That is the
exact direction `lift-correspondence.cjs:41-:50` says injectivity exists to prevent: "several
DOCUMENT lifts binding ONE file lift is the direction that would let the capture block count one
lift twice".

**WHY THIS IS THIS ITEM'S DEFECT AND NOT AN OLD ONE.** `Q-L`'s own answer is the argument: no phone
can hold a plan op before this item ships. A plan-added lift in a capture is a state EW2 creates.
`:389` was written before plan edits existed, so it reads the only lift list that existed then.

**WHY THE SPIKE COULD NOT SEE IT, and it is R4's lesson again one level down.** `r5-idspace.mjs`
mints `ew2-added-lift`, a string no file could carry. `E-R21` made every cell name its BRACKET
LEVEL; this case is not about the bracket level, it is about the CHOSEN ID, and a synthetic id
chosen not to collide hides a collision exactly as `sealed(7)` hid an id space.

**REQUIRED, and none of it needs a new round of prose.**
1. 4.3 ruling 1 (c)'s table gains the collision row with these measured values, and its two general
   sentences gain the qualifier they need: the admitted state has no row there **unless the minted
   id is a file handle**, in which case it has the WRONG row.
2. **`STOP 18` and `Q-M` carry this as a THIRD shape**, and the PM is told in one sentence that the
   spec's recommended shape (a) does not answer it, because the append block skips a `held` id.
   The honest repair is on the admission side: `:389`'s `idCollisions` is asked of the lifts
   admission will actually carry, which for this ruling means FOLDED and not only `scratch`. That
   is a hunk in a block section 4 already opens, and whoever writes it measures it.
3. **EW-17c ROW 4 gains the collision by name**, with the pool printed, because it is the row that
   makes the difference visible and it needs no seal: my cell runs it in under three seconds.
4. One sentence in 12.4 records what is STILL unmeasured about it after all that: nobody has walked
   a colliding capture through a REAL sealed bundle, for the same reason item 7 already gives.

### B2. 3.4.4's RE-CUT GATE HUNK DROPS THE `.catch(() => null)` THAT GUARDS THE DYNAMIC IMPORT, AND THAT CATCH IS THE ONE `local-source-basis.mjs:70-:73` EXISTS FOR

The gate, verbatim at the head this spec measures on (`today-app.cjs:2482-:2488`):

```
  function athleteBasisState() {
    return import("./local-source-basis.mjs")
      .then((module) => module.admittedLocalSourceState(setup))
      .catch(() => null)
      .then((imported) => { importAdmitted = !!imported; return imported || setup.athleteState(); });
  }
```

**That `.catch` sits on the whole head of the chain, so it covers BOTH the dynamic `import()` and
the call.** `local-source-basis.mjs:70-:73` says why in as many words: "any refusal, absence or
unreadable record is null: this never throws into the adoption chain and never becomes a reason
Today fails to paint."

3.4.4's hunk, as v5 prints it:

```
const admitted = await admittedLocalSourceRead(setup);   // the ONE added export (3.2's row)
importAdmitted = !!admitted.basis;                       // item 4: the same boolean :2488 sets
let state = admitted.basis || setup.athleteState();
```

**There is no `import(` and no `.catch` in it.** v4's hunk was an INSERTION into the chain and the
existing `.catch` survived it untouched; v5's hunk re-heads the chain, because it now sets
`importAdmitted` and binds `state` itself, and in re-heading it the guard is gone. A builder who
types what is printed turns a module load failure into a rejected `athleteBasisState()`, which is
a rejected `adoptAthleteState()`, which is STOP 9 and STOP 13 territory and is the one failure mode
that file's comment names.

**AND THE ROUND'S OWN CELL REPRODUCES THE GAP RATHER THAN CATCHING IT, which is worth saying
because the cell is otherwise excellent.** `spike/r5-adoption.mjs` row B is
`const read = await admittedLocalSourceRead(setupEntry);` with no catch and no import, modelling
the hunk exactly as printed. Row E drives the never throws contract of the EXPORT, nine drives,
none throwing, and I reproduced all nine. **Nothing anywhere drives a rejecting `import()`**, which
is the one thing the old line guarded and the new line does not.

**REQUIRED: one clause.** The hunk prints the dynamic import and its `.catch(() => null)`, or
3.4.4 says in one sentence that the chain's existing `.catch(() => null)` stays where it is and
which of the two changed lines it rides on. The spec's own count of "two changed lines" is what
makes this checkable, so the changed lines should be printed as changes rather than as a fresh
block.

---

## 2. WHAT I RE-RAN, AND WHETHER v5's MEASURED TABLES SURVIVE

Every cell the two re-taken rulings lean on, re-run unaltered in my own worktree, under
`MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`.

| cell | verdict |
|---|---|
| `spike/r4b-capture-lift.mjs` (R4's own, kept unaltered) | **REPRODUCED EXACTLY.** 12 of 16 targets differ on `variant(0)`, 16 of 17 pass today, **5 of 17** under `E-R16` as worded, 0 of 16 differ and 17 of 17 pass at `variant(7)`. The twelve print in the same order |
| `spike/r5-idspace.mjs` | **REPRODUCED EXACTLY**, all six sections, both fixtures, both sides of `starts_on`. `E-R16 PRIME` (a) + (a2) is 16 of 17 on all four rows and the "refuses where it passes today" list is EMPTY on both fixtures, as 4.3 prints |
| `spike/r5-adoption.mjs` | **REPRODUCED EXACTLY.** A = 3, B = **2**, C = 1 (the floor), D isolates the one extra act after `host.read()`. Row E: nine drives, none throwing. `E-R17 PRIME`'s number is true |
| `spike/r5-readday.mjs` | **REPRODUCED EXACTLY.** No date: the added lift appears 0 times and `press-old` `sets` is 2. At `starts_on`: once, and 5. R4 N1's table value for value |
| `spike/r5-field-vocab.mjs` | **REPRODUCED EXACTLY.** The closed map's five keys, the three new names absent from it, and the fall through to `REFUSAL_SENTENCE[code]` on BOTH paths |
| `spike/r5-fence-names.mjs` | **REPRODUCED**, at the cited head `60d6ad97` AND at `24b35244`: 28 member names, **v4 hits 2, v5 hits 0** |
| `spike/README.md`'s seven sha256 | **ALL SEVEN MATCH the committed bytes** |

**Two structural claims I checked rather than took.**
`git diff 60d6ad97 24b35244 -- rebuild/lanes/c/TODAY-SPLIT-SPEC.md` is **EMPTY**, exactly as 9.5
says, so 6.8's census and STOP 2 are not excused by drift.
`git diff 70113da5..0bf6f230 -- rebuild/` is markdown plus the new `spike/` folder ONLY: **no
product, test, tooling or workflow byte moves on this branch**, so every product cite in v5 holds
at the spec's own head.

### 2.1 Cites I opened myself

Correct as printed: `source-admission.mjs:389` and its `:380-:388` comment; `:477-:484` (the
append block, iterating `documentProgramme.state.exercises`); `:596`; `:600-:611`; `:613`; `:614`;
`:615-:617` (the "COUNTED UNDER THE DOCUMENT'S OWN ID" comment, which is the whole of (a)'s
warrant and is verbatim); `:695-:699`; `:731-:735` and `:733`'s map; `:743`'s catch and
`KNOWN_REPLAY_CODES`; `lift-correspondence.cjs` entire, 103 lines, including `idCollisions` at
`:75-:87` which no round before this one had reason to read; `local-source-basis.mjs:32`, `:41`,
`:66`, `:70-:73`, `:73-:82`, `:78`, `:80`; `today-app.cjs:2482-:2488` verbatim;
`plan-edit-model.cjs:346`, `:361-:362`, `:376`; `plan-edit-host.mjs:145` and `:148`;
`setup-model.mjs:255-:263` and `:607`.

**And the two caller claims of 3.2's row, which are load bearing for `E-R17 PRIME` (i):** I grepped
the whole tree. `admittedLocalSourceState` has exactly THREE call sites, `today-app.cjs:2484` (the
product gate) and the two the spec names, `import/test/refusal-route.test.mjs:60` and
`measure/measure-baseline.mjs:42`. **Both drive it through a real booted setup entry and neither
drives a throwing, rejecting or absent repository**, so the spec's reason for leaving the existing
export byte-identical is correct and is the right call.

**Three cites do not open on what they name: note N3 below.**

**Copy census, counted by script over the whole file and every file of `spike/`: ZERO bytes above
U+007E anywhere.** No U+2013, no U+2014, no smart quote, no emoji. CLEAN, for the third round
running.

---

## 3. R4's FOUR BLOCKING AND FIVE NOTES

| R4 | verdict | what I measured |
|---|---|---|
| **B1** `E-R16` crosses two id spaces and refuses twelve of sixteen | **FIXED, and the fix is right** | `E-R16 PRIME` is carried out in three parts with the id space named in each. My re-run of R4's own cell reproduces its table exactly, and `r5-idspace.mjs` extends it correctly. **(a2) is a sharpening the spec made on its own and it is CORRECT: see section 4 below, where I measured the half the spec only read.** A NEW gap in the same row is my B1 |
| **B2** the adoption costs THREE, and item 5 asks for a binding that does not exist | **FIXED** | Item 5 is withdrawn by name. The added export is paid for (12 lines, budget to 142, STOP 17 widened, 9.3's sealed row to 9 to 12). Measured 2, floor 1, and row D says where the one extra act is. The `try` stays exactly where it is. **The one clause missing from the hunk is my B2** |
| **B3** `onWeek.save` and `onWeek.close` are on the fence's own word list | **FIXED** | `saveChange`, `closeEditor`, `openWeek`. Censused: 0 of 7 on the list at both heads. 6.8 gains the fourth bullet and EW-12 gains the control. **One narrowing: note N5** |
| **B4** exactly one id can reach green, not four | **FIXED IN SUBSTANCE, STILL OPEN IN ARITHMETIC** | Section 5, 7.2 and 9.3 all split RUN from GREEN, and the per id table is the right shape. **But it accounts for 22 of the 23 ids and its first row contradicts its second: notes N1 and N2** |
| **N1** the adoption read takes no date | **FIXED** | 3.4.4 names `EDIT_WEEK_ADOPTION_DAY` and prints the measured table; EW-13d gains CONTROL d0; EW-14 names a date. `r5-readday.mjs` reproduces R4's table exactly |
| **N2** the blocked list had eighteen ids | **FIXED** | EW-19 struck. All four statements now carry seventeen, which I counted in each |
| **N3** the handed in generation race | **FIXED** | One paragraph at the end of 3.4.4 retires it as SAFE, and STOP 13 points at it. Well written: it tells the builder the discriminator (`basisState` is the raw value) rather than just the conclusion |
| **N4** the field vocabulary claim is unmeasured | **FIXED, AND BETTER THAN ASKED** | It is not marked UNMEASURED, it is MEASURED, and EW-20 is written from the measurement. The honest consequence, that the fall through sentence is not true of `plan_edit_basis` or `plan_edit_context`, is recorded in Q-J and carried to 12.4 item 9 rather than papered over |
| **N5** TODAY-SPLIT is at `60d6ad97` and at REJECT R2 | **FIXED** | STOP 2 and 9.5 both carry the head, the REJECT, and the sentence that all four dependencies are on a document in a fix round. The empty diff to `24b35244` is verified |

**Nothing of R4's is disputed by v5 and nothing of R4's is disputed by me.**

---

## 4. `E-R16 PRIME` TO `E-R24`: CARRIED OUT?

| ruling | carried out? |
|---|---|
| **`E-R16 PRIME` (a)** membership in DOCUMENT space | **YES, and it is reachable as worded, which the ruling asked to be checked first.** `slot.lift_lineage_id` IS the document's own id and `:615-:617`'s comment says so in the file, not in the spec. No third comparison is invented |
| **(a2)** the spec's own sharpening to FOLDED's ACTIVE rows | **YES, AND I MEASURED THE HALF THE SPEC ONLY READ.** The spec argues (a2) agrees with `capture_membership` by reading `:685`. Driven (`r5v-membership.mjs`), over FOLDED with a real saved `remove machine-fly`, `starts_on` `2026-09-17`: on the `U` day `2026-09-10` the engine's `sessionMembership` pool is **9 and carries the retired lift**; on `2026-09-17` and on `2026-09-24` it is **8 and does not**. **So the two checks agree day for day, and the spec's claim is true.** It is also why (d) adds no NEW way for an import to refuse: note N6 |
| **(b)** attachment stays at `:613` in FILE space | **YES.** Not one character moves, and all twelve corresponded lifts keep their target, printed |
| **(c)** measure what the admitted state carries for an added lift | **CARRIED OUT, AND THE MEASUREMENT IS INCOMPLETE: B1.** The spec measured one added id and stated the answer generally |
| **(d)** the retired lift, both directions | **YES, and it is right.** Measured on three days either side, not two: `2026-09-16` passes, `2026-09-17` refuses, `2026-09-18` refuses. `FOLDED.exercises` says TRUE on all three, which is exactly why (a2) had to be written |
| **(e)** the id space table | **YES, and it is the best new page in the document.** I checked every one of its nine rows against the code. No row puts a FILE id against a DOCUMENT id set or the reverse, and the two rows that could have (`target`, `state.exercises`) are both marked "nothing, under this ruling", which is accurate |
| **`E-R17 PRIME`** (i) to (v) | **YES on all five**, and (i)'s "say which and why" is answered with a measured reason (the two cell callers, which I verified) rather than a preference. (iv)'s sequencing argument dissolves R4's D.1 objection correctly: D.1 proves the codemod's output against its source, which a later commit cannot touch. **The hunk is one clause short: B2** |
| **`E-R21`** bracket level named by every admitted side cell | **YES**, in section 5's preamble, in 6.1 and in each of EW-17a to EW-17d. R4's cell is CONTROL 1 on EW-17c and EW-17c's MAIN row seals `sealed(0)`. **The rule caught its own class and did not catch B1, which is not the rule's fault and is worth one sentence: a cell also names the ID it mints** |
| **`E-R22`** rename off the word list, fourth bullet, census printed | **YES.** 0 of 7 at both heads. STOP 2 carries `:550`. **Narrowing in note N5** |
| **`E-R23`** the honest green column | **CARRIED OUT IN SHAPE, WRONG IN ARITHMETIC: N1 and N2** |
| **`E-R24`** Q-J seat the three, Q-K shut, Q-L limited | **YES on all three.** Q-J is measured rather than seated on faith and its one dishonest consequence is recorded. Q-K is closed in the PM's own terms. Q-L carries both halves, including the reason (`no phone can hold a plan op before this item ships`), which is the same fact my B1 turns on |

---

## 5. NOTES

### N1. 9.3's per id table accounts for 22 of the 23 ids, and EW-16 is in neither row

The table's rows are EW-19, EW-20, EW-17c's CONTROL 1, EW-17d, EW-17a, EW-17b, EW-17c's other
rows, and "the other sixteen ids". Six ids are named; 23 minus 6 is **seventeen**, not sixteen.
The missing one is **EW-16**, the DOM and copy cell, whose `blocked on` everywhere else in the
document is **C-UI-9 and not F2**, so it cannot be folded into a row whose reason is "the companion
refuses its FIRST READ without F2". `E-R23` made 9.3 the sentence the PM approves; it should
account for every id it counts. One row, or "sixteen" becomes "sixteen, plus EW-16 on C-UI-9".

### N2. The same table says EW-19 is "the ONLY one" two rows above giving EW-20 a YES

`E-R23` as the PM worded it says "Exactly ONE id, EW-19, can reach green on acceptance". v5 seats
**two** ids green (EW-19, EW-20) plus EW-17c's CONTROL 1, and I do not dispute either: both are
MEASURED (`r5-field-vocab.mjs`, `r4b-capture-lift.mjs` with `r5-idspace.mjs` section 6) and EW-20
did not exist when the ruling was made. **What is wrong is that the table's first row still reads
"YES, and it is the ONLY one" while its second row says YES.** One clause: `E-R23` ruled one; this
version adds one new cell and one control that this round MEASURED as green, so the count is two
ids and one control. The hours line already says 1 to 1.5 and does not need to move.

### N3. Three cites do not open on what they name

- 4.3 ruling 1 (a2) cites "`:690`'s own warning that `exActive` honours `retirements` with NO date
  comparison". **That warning is at `:685`.** The quote is verbatim and the surrounding block is
  `:676-:692`, so nothing turns on it, but `E-R19`'s rule is that the reviewer opens the consuming
  line.
- EW-20 cites `import/import-screen.mjs:152-:160` for `REFUSAL_FIELD_SENTENCE`. **It is
  `:153-:161`.**
- The same row cites `:170-:198` for `refusalLines`. **It is `:172-:198`; `:169-:170` is
  `codeLine`.**

### N4. `spike/r5-idspace.mjs:86` prints a mislabelled row

Line 86 is keyed `at BEFORE starts_on (2026-09-16): exercises` and reads `foldedOn.value`, the
ON/AFTER fold. The number printed, 17, is the ON/AFTER count. **No table in the spec cites that
row**, so nothing in v5 rests on it, but the README's promise is that every MEASURED table points
at a cell by name and a next hand reading that cell will be misled for a minute. One character.

### N5. The fourth bullet's census covers one of E.3's four groups

`r5-fence-names.mjs` slices E.3 from `**Durable writers, as MEMBER NAMES in code position:**` to
`**Lane, host and entry constructors:**` and censuses that paragraph alone. E.4's token scan is
over IDENTIFIERS **and** member names, and E.3 has three more groups it sees: the constructors, the
**Stores** list (`transaction`, `objectStore`, `localStorage` and the rest) and the
no-crossing-assignment rule's declaration list. I checked the seven `onWeek` members against the
constructors and the stores by eye and they are clear, so 6.8's bullet is TRUE. It is just proved
for a quarter of what it claims. One more slice in the cell, or one clause in the bullet naming
which group was censused.

### N6. (d)'s new refusal is not a new way for an import to fail, and the spec could say so

I went looking for the defect `:600-:611` records P3-REAL-SHAPE fixing, re-introduced by (d):
`capture_lift` has been TOTAL since that fix, and (a2) makes it non-total again, and a
`capture_lift` refusal is `fail()` at `:614`, caught at `:743` as an ISSUE, and ONE issue makes
`admittedLocalSourceBasis` return null at `local-source-basis.mjs:41`, so the WHOLE import does not
adopt. Measured (`r5v-collide.mjs` section B), a capture naming the retired lift dated on or after
`starts_on` passes today and refuses under (a2), on `starts_on` and on every day after.

**Then I measured the other half and the worry dissolves.** `capture_membership` (`:695-:699`)
compares the capture's pool against `sessionMembership(FOLDED, originalDay)` exactly and in order,
and measured (`r5v-membership.mjs`), that pool drops the retired lift on the same day (9 lifts on
`2026-09-10`, 8 on `2026-09-17` and after). **So a capture that (d) newly refuses would already
have been refused by `capture_membership`, three checks later, under a different field name.** (d)
changes WHICH code the athlete's import fails under, not WHETHER it fails. That is worth one
sentence in 4.3 ruling 1 (d), because it is the difference between a ruling that adds a failure
mode and a ruling that makes two checks agree, and the spec currently leaves a reader to guess.

### N7. `E-R21` should name the minted ID as well as the bracket level

B1 is a fixture defect of a class `E-R21` does not reach: the fixture's BRACKET was irrelevant (the
collision behaves identically at `variant(0)` and `variant(7)`), and what hid it was the synthetic
id `ew2-added-lift`, chosen not to collide with anything. One clause added to `E-R21`: a cell that
mints a lift id says whether that id is one the FILE could carry, and at least one row mints one
that it can.

### N8. STOP 18's own statement of the gap is narrower than the gap

STOP 18 says "for every other slot the property still holds by construction, so the gap is exactly
one case". Measured, the gap is **two** cases that behave differently: a plan-added lift with a
free id, where the admitted state has NO row (the spec's measurement, which I reproduced), and a
plan-added lift with a colliding id, where it has the WRONG row (B1). The second is worse than the
first, because the first leaves an entry nothing reads and the second attaches it to a lift the
athlete really trains.

### N9. What I tried to break and could not, recorded so round 6 does not spend the time

1. **The id space table.** Nine rows, each checkable against the code, and I could not find a tenth
   id in section 4.3 that it does not cover.
2. **`E-R17 PRIME`'s count.** Re-run on the instrument: 3, 2, 1 and the isolation row. The number
   is true and the floor is honest.
3. **The never throws contract of the new export.** Nine drives reproduced. The reason for leaving
   the existing export alone is correct and I verified both cell callers by grep.
4. **The fence census.** 0 of 7 at both heads, and the two object names are still clear.
5. **The field vocabulary.** Both paths of `refusalLines` reproduce, and the control on
   `capture_lift` draws its own sentence, so EW-20 is a real cell and not a formality.
6. **R4's own table**, reproduced value for value, which is the check that the round built on solid
   ground.
7. **The copy census.** Zero bytes above U+007E in the spec and in all seven `spike/` files.
8. **The arithmetic of 9.3.** 6 to 8 plus 13 to 16 plus 9 to 12 plus 0.5 to 1 plus 5 to 6 plus 2 to
   3 is 35.5 to 46, and "19 to 24 can START" is the first two rows. The sums are right; N1 and N2
   move a sentence, not a number.

---

## 6. WHAT I DID NOT DO

I installed nothing, launched no browser, ran no `b-package.cjs`, sealed nothing and pushed nothing
from any scratch worktree. I did not re-run SPIKE M4 (it needs a real `port.cjs` seal, which the
farm cannot do) and I spent the round on the capture rule instead, which is where B1 is. I changed
no product, test, tooling or workflow byte: the only file this branch gains from me is this one,
and the only files I wrote anywhere else are three throwaway cells in a farm scratch worktree that
are never pushed. I did not read `rebuild/conform/private`, any `ledger/` directory,
`src/history.js`, `C:\Users\joeym\EarnedPort`, the protected soak, or any owner measurement, on
either machine, and nothing outside the farm's include list was fetched. No credential appears
above. Zero U+2013 and zero U+2014 in this file.

**ONE THING FOR THE PM, BECAUSE IT IS A PATTERN AND NOT A FINDING.** Round 3 found defects by
reading. Round 4's spike found them by running the product. R4 found one by running the product
against a different FIXTURE. This round found one by running it against a different **ID**. Each
round the hiding place got one level smaller and each round the fix was a rule the next reviewer
can apply mechanically, which is `E-R19`, then `E-R21`, and now N7. **That is a document that is
converging, and it is why I return ACCEPT WITH NOTES rather than a sixth round.** The remaining
risk is not in the prose any more; it is in the two places the spec itself says nobody has walked
yet, which are 12.4 items 7 and 8, and the only way to close those is to build the cell and run it
on the PC.
