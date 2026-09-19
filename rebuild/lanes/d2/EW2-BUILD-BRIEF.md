# EW2 BUILD BRIEF: EDIT MY WEEK, SCREENS PART 2

**Lane D2. Branch `rebuild/d2-ew2-spec`. Base `1ad61cfe`.**
Written under `DECISIONS:621`, from `rebuild/lanes/d2/EW2-SPEC.md` v7 (`1ad61cfe`, CLOSED),
Astra's two re-checks (`rebuild/r-astra-ew2-spec-r6` `2cac2a3d` and `rebuild/r-astra-ew2-spec-l2`
`4c7af766`, both read whole), and `DECISIONS:602`, `:613` and `:621`, read whole.

**THE SPEC IS CLOSED AND THIS DOCUMENT DOES NOT EDIT IT.** Where the spec and `:621` disagree,
`:621` governs and this brief says so at the line where it happens. `EW2-SPEC.md` is not touched by
this lane.

**THIS DOCUMENT IS A HYPOTHESIS.** It is written to be disagreed with. Every number in it came out
of a program in `rebuild/lanes/d2/spike/` named `ew2b-`, run one Node process at a time under
`MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`, on the PC and, where the farm can run it, in a
farm scratch of this branch's head as well. Nothing here is estimated. Where a cell was WRONG and
the product was right, the cell says so in its own output and this brief repeats it.

---

## 0. STATUS

# STOP. RETURN TO THE PM. NO EW2 PRODUCT BYTE IS WRITTEN.

**THE ONE REASON.** `DECISIONS:621` (2) made the brief's first measured step the question of
whether a SECOND admission can happen on one installation at all, and ruled: *"If it can, the build
STOPS there and returns to the PM before any EW2 product byte."*

**IT CAN.** Measured through the REAL admission path on synthetic bundles sealed by the REAL
`rebuild/m3/setup/port/port.cjs`, on the PC: a different file is ADMITTED on an installation that
has already admitted one, in the same session AND after a reload, three files deep. The exact
success and the exact refusals are section 1.

Everything else in this brief is written anyway, because `:621` (4), (5) and (6) ordered it and
because the PM rules once, with the brief's review in hand. Sections 2 to 9 are ready to execute
the moment the PM answers section 1. **Not one of them may start first.**

---

## 1. E-R39, MEASURED FIRST: CAN A SECOND ADMISSION HAPPEN AT ALL?

### 1.1 What was driven, and where

Three cells, **PC ONLY**, because each one seals real bundles through the real port and the farm's
include list does not carry the port's oracle files. Every file is INVENTED: the port mints its own
passphrase and writes its own source into an OS temp folder. No owner file, no private fixture and
no measurement of his was read, here or anywhere in this lane.

| cell | what it drives | exit |
|---|---|---|
| `ew2b-r39-probe.mjs` | the open question, printed and not prescribed: five journeys plus a control | **0** |
| `ew2b-r39-second-admission.mjs` | the PIN: the same journeys with every answer asserted | **0** |
| `ew2b-r39-retention.mjs` | what the second admission KEEPS and what it takes away | **0** |

The admission path is the product's own, end to end, through
`rebuild/m3/w7-preview/import/test/support.mjs`'s `admit()`: `client.importBundle` for custody,
`importCustody().load` for the material, `createLocalSourceController`, `reviewSource`,
`prepareSource` with the athlete's identity answer, then `localSourceCommitCapability(prepared)`
`publish()` and `reconcile()`. Nothing is stubbed and no guard is skipped.

### 1.2 The exact answers

**THE SAME FILE AGAIN: REFUSED BY NAME, at custody, hot and after a reload.**

```
2. the SAME file again, same session      REFUSED at custody   LOCAL_IMPORT_ALREADY_PRESENT
4. the SAME file again, AFTER A RELOAD    REFUSED at custody   LOCAL_IMPORT_ALREADY_PRESENT
```

That refusal is `import-bundle.mjs`'s duplicate guard and it never reaches admission at all.

**A DIFFERENT FILE: ADMITTED.**

```
1. FIRST admission of file A              ADMITTED   view.ready=true
3. a DIFFERENT file, same session         ADMITTED   view.ready=true
5. a THIRD, never-carried file, AFTER A RELOAD   ADMITTED   view.ready=true
6. CONTROL: file B alone on a fresh install      ADMITTED   view.ready=true
```

Journey 5 uses a file that has never been carried, so custody's duplicate guard cannot be what
answers: the reload case is a genuine second admission and not a dedupe. Journey 6 is the control
that a refusal above would have been about the second admission and not about the file.

**WHAT THE SECOND ADMISSION DOES TO THE INSTALLATION**, asserted in
`ew2b-r39-second-admission.mjs`:

| what | measured |
|---|---|
| selections recorded after one, two, three admissions | 1, then 2, then 3 |
| the ACTIVE selection | moves to the newest each time |
| the new selection's `previous` | names the selection it replaced |
| `metadata.localSourceApplication.selection_id` | moves with it |
| `collections.derived.localSource` | **REPLACED wholesale, every time** |
| the previous basis digest, still readable in `derived` | **no** |
| operations written by an admission | **none. The control holds: nothing on disk is rewritten** |

### 1.3 The consequence that makes this a STOP and not a curiosity

`collections.derived.localSource` is **singular**. It is the only place an admission-time derivation
is published, and it is exactly where `E-R30`'s hunk D would write `lift_correspondence` and where
BOTH `E-R30`'s `targetIdOf` and 14.2's `noteIdentityOf` would read it (spec 14.2: *"There is no
second map and no second derivation."*).

So, measured: **the second admission overwrites the only record the whole translation design stands
on.** Astra's D1 asked for provenance "across first admission, native file-id edits, second
selection and rollback", and her wrong-lift result was filed as a debt because *"full admission
reachability was not executed"*. It is executed now. The second admission is reachable, and after
it the first admission's correspondence is not readable where the spec says to read it.

**THE MATERIAL FOR A FIX IS STILL ON DISK, and that is the constructive half.**
`ew2b-r39-retention.mjs` asserts that after the second admission EVERY selection still carries, under
`metadata.localSources.selections`, its own `basis`, its own `identity_review` and its own
`order_map` member. A per-admission join has somewhere to stand at no extra storage cost. This brief
does not choose the fix: `:621` (2) sends that to the PM.

**ONE MEASURED CORRECTION THIS CELL OWES AGAINST ITSELF.** `ew2b-r39-retention.mjs` first asserted
that each retained selection carries order map ENTRIES and exited 1. It was the cell that was wrong:
`order_map` is `null` on both selections here because neither invented file needed one. The member is
present and per selection; its VALUE is per file. The cell was corrected and re-run to exit 0, and
the correction is printed in its own output rather than quietly removed.

### 1.4 What D1 would narrow to IF the PM rules the second admission out

`:621` (2) describes that branch: *"a cell pins that refusal by name and D1 narrows to the first
admission plus native edits, where the admission fold over a mixed history resolves every saved
target to the same lift or refuses BY NAME BEFORE PUBLISHING."*

That branch is **not reached**, so this brief does not write it as an order. What it can already say,
so the PM has it either way:

- the refusal that WOULD be pinned already exists and is measured: `LOCAL_IMPORT_ALREADY_PRESENT`,
  at custody, for the same file. There is **no** equivalent refusal for a different file, and that is
  the gap;
- the mixed-history fold rule is Astra's R6 journey "Same history through specified admission fold",
  which returns `PLAN_EDIT_TARGET_UNAVAILABLE` for a history whose stored targets are
  `[press-old, file-press]`. A cell RED at the base for that rule is written as **step B1** of
  section 2 and is the first thing the narrowed D1 would need;
- no cell of this round drove that fold, and section 9 says so.

### 1.5 What section 1 did NOT measure

No plan edit and no machine note was carried ACROSS the second admission: the three cells measure
whether the second admission happens and what it does to the installation's records, not what it does
to a saved edit, because the record it would be read through (`lift_correspondence`) does not exist at
any head yet. No rollback, no `reopen`, no browser, no phone. Nothing here claims otherwise.

---
## 2. THE BUILD, AS ORDERED STEPS

**READ THIS FIRST.** Every step below is **BLOCKED BY SECTION 0** until the PM answers E-R39.
The column `may start` says what the step would ALSO be waiting on once that block lifts; it never
means "start now". Nothing in this section may be begun today.

The spec's own order (5, 7.1, 7.2) is kept and not restated: this section adds only what `:621`
changed and turns the debts into steps. A builder follows this table and reads the spec section named
in each row; he does not read seven spec rounds.

### 2.1 The steps

| # | step | files it writes | hunk it spends | rows it turns green | red first | may start |
|---|---|---|---|---|---|---|
| **B0** | The suite skeleton: all twenty cells of spec 5 written RED under their twenty-three ids, plus `EW-25`, against the merged companion | `today/test/edit-week.test.mjs` | none | none yet; every id exists and is red | the whole suite is the red run | **after E-R39**; nothing else |
| **B1** | **NEW, `E-R39`.** The mixed-history admission fold cell, RED at the base: a history whose stored targets span both id spaces resolves every target to the same lift or refuses BY NAME before publishing | the suite only | none | `EW-21`'s admission half | yes, and it is Astra's own R6 result (`PLAN_EDIT_TARGET_UNAVAILABLE`) | **after E-R39** |
| **B2** | `EW-19` and `EW-20` to GREEN: `watchDayRollover` with a fake `doc`, and the import screen's exported `refusalLines` | the suite only | none | `EW-19`, `EW-20` | yes | **after E-R39**; these two need nothing else (spec 7.2) |
| **B3** | `EW-17c` CONTROL 1 to GREEN: four assertions about `lift-correspondence.cjs` and the phone's document | the suite only | none | `EW-17c` control 1 | yes | **after E-R39** |
| **B4** | `EW-17d`, `EW-17a`, `EW-17b` to their measured RED answer over a real sealed bundle, each naming its bracket level (`E-R21`) | the suite only | none for the red run | none (green needs 4.3's hunks) | yes, and SPIKE M4 measured them red | **after E-R39** |
| **B5** | The released view half: `edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs` over the frozen reply objects | the three released files | none sealed | none alone | n/a | **after E-R39**; the LOOK waits on C-UI-9 |
| **B6** | The new note resolver, its own file, from `ew2b-r42-proto-notice.mjs`: `noteIdentityOf`, `notesFor`, `latestNoteFor`, `latestNoteOn`, ONE authenticated generation, the amended two-arm rule | a NEW file (`machine-note-identity.mjs`, path fixed by 3.2's release list) | none sealed | `EW-25` | yes, `ew2r7-b1-note-read.mjs` is the red and it is in this branch's history | **after E-R39** |
| **B7** | Hunk E: the card reaches B6's resolver | `gym-settings-lane.mjs` at the base (section 6) | **E** | `EW-25`'s card half | yes (`M41`/`M42` survive a parse-only check) | **after E-R39** AND the Today split's seal; it rides EW2's own reseal child (`:582`) |
| **B8** | `E-R30`'s translation boundary and the recorded correspondence | `plan-edit-model.cjs`, `source-admission.mjs` | **H2**, **D** | `EW-21` | yes (`ew2r6-w1-import-identity.mjs`) | **after E-R39**, and E-R39's answer may change what D writes |
| **B9** | One owner of creation: the history roster and the reserved union | `plan-edit-model.cjs`, `source-admission.mjs` | **H3**, **C** | `EW-22`, `EW-23` | yes (`ew2r6-w2`, `ew2r6-w3`) | **after E-R39** |
| **B10** | The retained family, proofs with zero captures, the per-capture fold | `source-admission.mjs` | **A**, **B** | `EW-17a` to `EW-17d` | yes (SPIKE M4) | **after E-R39** and 3.5's F2 package |
| **B11** | The adoption compose, `E-R34`'s four states, `E-R36`'s reconciliation seam | `edit-week-lane.cjs` (new), `today-entry.mjs` | `createEditWeekEntry` | `EW-13c`, `EW-13d`, `EW-14`, `EW-18`, `EW-24` | yes (`ew2r6-w5-inflight.mjs` for `EW-24`) | **after E-R39**, 3.4's sealed lane and 3.5 |
| **B12** | The two dated views and the post-save refresh | **WAITS ON E-R41** | see section 3 | `EW-13c`, and `E-R35`'s half of `EW-14` | not yet written | **after E-R39 AND the PM's E-R41 ruling** |
| **B13** | The per-adoption `Start.plan_basis` | **WAITS ON E-R41** | see section 3 | `EW-14`'s stored-Start assertions | not yet written | **after E-R39 AND the PM's E-R41 ruling** |
| **B14** | The screen: every state drawn | `edit-week-view.mjs`, `preview.css` | none sealed | `EW-16` | n/a | **after E-R39 AND C-UI-9** (`DECISIONS:561`), and `preview.css` after S9 seals |
| **B15** | The route and the mount | `today-app.cjs` (about six lines) | 3.3 line 2a | none alone | n/a | **after E-R39 AND TODAY-SPLIT lands** |
| **B16** | CI registration of the new suite | `.github/workflows/rebuild.yml` | 3.3 line 7 | every row, on both systems | n/a | **THE PM's, on the S10 child. No lane has `.github` custody** (spec 6 item 3) |

### 2.2 What WOULD start the day the PM lifts the block, and what waits behind what

- **Needs nothing further: B0, B1, B2, B3, B4, B6.** B2 is the only pair that reaches GREEN on day
  one; the spec measured that and `:621` did not change it.
- **Waits on C-UI-9:** B14 only. `E-R8` still settles that the view half (B5) starts before the
  drawing exists.
- **Waits on the Today split's seal:** B7 and B15. B7 additionally rides EW2's own reseal child and
  never lands alone (`:582`, carried by `:621` (3)).
- **Waits on the PM's E-R41 ruling:** B12 and B13, and nothing else. This is why section 3 measures
  both routes now rather than after the block lifts.
- **Waits on 3.5's F2 package:** B10, B11, and seventeen of the twenty-three ids, exactly as spec
  7.2 measured. `:621` changed none of that.

### 2.3 The one ordering rule this brief adds

**B1 IS WRITTEN BEFORE B8.** `E-R39` measured that the derived record a translation boundary reads is
replaced by a second admission. Writing H2 before a cell exists that fails for a mixed history is how
five rounds missed F1. B1 is red first, it stays red until the PM has ruled, and it is the row that
can fail for E-R39's defect.

---

## 3. E-R41: THE TWO HANDOFFS, MEASURED, FOR THE PM TO RULE ONCE

`DECISIONS:621` (4): **NOT AUTHORIZED BY THAT LINE.** This section measures the smallest route for
each with ZERO PRODUCT BYTES, names the file, the lines and every alternative with its cost, and
recommends one each. **No byte is proposed and none is written.** The PM rules both once.

### 3.1 D3: the authenticated-generation handoff for the current and pending views

**Cell: `ew2b-r41-d3-generation.mjs`. Farm exit 0, PC exit 0, byte-identical output.**

**HER CLAIM, RE-MEASURED.** Astra's D3 has two clauses.

- **First clause, UPHELD BY EXECUTION.** One `host.read()` names neither both dated views nor the
  generation it was taken from: `Object.hasOwn(view,'generation')` is false and so is `revision`. Two
  `host.read()` calls cost **2** authenticated durable loads and are two separate `lane.reopen()`
  calls over two separate generations, which is exactly the "two uncoordinated reads" she forbids.
- **Second clause, NARROWED BY MEASUREMENT AND NOT AGREED WITH.** She writes "a successful save reply
  exposes no committed generation". The reply's members, measured, are
  `acknowledged, copy, durability, durableRevision, edit, intent_id, ok, op_id, op_ids, starts_on, state`.
  It **does** carry `durableRevision`, which names the committed REVISION (measured value 4). It does
  not carry the generation, and a revision is not a dated view, so the handoff she asks for is still
  missing and D3 stands as a debt. The PM is told both halves so that a builder does not go looking
  for a number that is already there.

**ROUTE 1, THE ZERO-PRODUCT-BYTE ROUTE. RECOMMENDED.**
The new lane takes **ONE** `repository.load()` and reads the PRODUCT'S OWN projector twice over that
one generation object: `Model.createPlanEditProjector(...)`, then `.read(generation, today)` and
`.read(generation, starts_on)`.

| measured | value |
|---|---|
| authenticated loads | **1** (the host takes 0) |
| the revision that one load names | 4 |
| its current view against two-read ROUTE 0's | **byte-equal** |
| its pending view against ROUTE 0's | **byte-equal** |
| the two views it returns | **DIFFER** (`sets=2` against `sets=5`), so a route that returned one view twice could not have passed |
| product bytes | **0** |

**Its cost, named and not hidden.** It is NOT a second replay implementation: it is the product's own
function called once more. It IS a second projector INSTANCE beside the host's, configured by the
lane, and the lane must hand it the same six collaborators the host gets. That cost is real and this
cell paid it: the first run required `f2-tag-adapter.cjs`'s MODULE instead of the projector its
FACTORY returns, so `validateTags` was `undefined` and construction failed by name with
`PLAN_EDIT_TAGS_INVALID`. Whoever builds B12 gets that wrong once.

**ROUTE 2, THE SEALED ALTERNATIVE. COUNTED, NOT ESTIMATED.**
A `readBoth(currentDate, pendingDate)` member on `plan-edit-host.mjs`, returning both dated views off
ONE `lane.reopen()`. Both anchors proved unique, the patch applied in memory, the result proved to
parse, the file left byte-unchanged:

| file | added | removed | note |
|---|---|---|---|
| `rebuild/m3/w6/host/plan-edit-host.mjs` | **13** | **0** | on 13.12's ZERO-BYTE list. It would leave that list by name. |

**ROUTE 3, TWO HOST READS.** Zero bytes, 2 loads, two different generations. **Refused by Astra's own
sentence** and not recommended; it is listed so the PM sees what the current spec would get by
default.

**RECOMMENDATION: ROUTE 1.** It is zero bytes, one authenticated generation, and its views are
byte-equal to the host's. If the PM would rather have one projector on the installation than two,
ROUTE 2 is 13 added lines and this brief will take that instead without argument.

### 3.2 D4: the per-adoption `Start.plan_basis` through the shared gym installation

**Cell: `ew2b-r41-d4-planbasis.mjs`. Farm exit 0, PC exit 0, byte-identical output.**

**HER CLAIM, UPHELD BY EXECUTION.** A whole workout was driven through the REAL gym card, start to
finish, and the label was read off the DURABLE session-start operation, never off a helper's return:

```
the era was opened with planBasis                        EW2B-ERA-LABEL-ONE
createGymHost was handed planBasis                       EW2B-PER-CALL-LABEL
the label the stored Start actually carries              EW2B-ERA-LABEL-ONE
the per-call option was HONOURED                         false
```

`createGymHost` destructures `{ day, engineState, plannedSplitSlotId }` and nothing else, and
`planBasis` is closed over from `openTodayOverLocalEra`. The label is fixed when the INSTALLATION is
opened, not when the card is. `createNullLaneWorkoutBasis` additionally requires a non-empty STRING,
so the label cannot be made a thunk the lane updates.

**ONE MEASURED CORRECTION THIS CELL OWES AGAINST ITSELF.** Its first run read `NO_ACCEPTED_PLAN`,
the module default, and looked like a third answer. It was not: `eraFor` in the import corpus's
support module does not forward `planBasis` at all. The cell now opens the installation through the
page's own `openTodayOverLocalEra`. The product was right; the cell was wrong.

**ROUTE 1, THE ZERO-PRODUCT-BYTE ROUTE. RECOMMENDED.**
A SECOND era, opened over the SAME IndexedDB with the label this adoption needs. Measured, with a
real second workout driven to a real stored Start:

```
ROUTE 1: a SECOND era on the SAME IndexedDB              opened
  it was opened with planBasis                           EW2B-ERA-LABEL-TWO
  the label its stored Start carries                     EW2B-ERA-LABEL-TWO
  session-start operations on disk now                   2
```

**Its cost, named:** a second durable client on one installation, not a byte. The first session must
be FINISHED before the second card opens, or the second refuses
`WORKOUT_HISTORY_RECONCILIATION_REQUIRED`; that is measured, it is the product behaving correctly,
and it is a sequencing rule the lane must keep rather than a defect.

**ROUTE 2, THE SEALED ALTERNATIVE. COUNTED, NOT ESTIMATED.**
Take `planBasis` as a per-call option on `createGymHost` and prefer it over the era's:

| file | added | removed | net | note |
|---|---|---|---|---|
| `rebuild/m3/w6/local/today-bindings.mjs` | **2** | **2** | **0** | two lines CHANGED. Both anchors unique. On 13.12's ZERO-BYTE list. |

**ROUTE 3, CHANGE THE ERA'S DEFAULT.** Zero bytes and wrong: the label would change for every lane on
the installation, not for this adoption. Listed and rejected.

**RECOMMENDATION: ROUTE 2, and this is the one place this brief recommends spending a sealed byte.**
ROUTE 1 works and is measured, but it makes the Start label depend on WHICH era object the card was
opened from, which is precisely the class of defect `E-R34` and `E-R38` F10 exist to stop: the stored
Start must assert the basis that was actually prescribed from. Two lines in one file, counted, is a
smaller risk than two live durable clients disagreeing about which plan the athlete is on. **The PM
rules; if he refuses, ROUTE 1 is executable today and B13 takes it.**

---
## 4. E-R42: THE AMENDED NOTE RULE, ITS TWO ARMS, AND D11 AND D14 IN THE SAME PROTOTYPE

`DECISIONS:621` (5) AMENDS spec 14.2 rather than enforcing its sentence. **Where the spec and `:621`
disagree, `:621` governs, and this is the place it happens.** Spec 14.2 says *"If any stored note
falls to the fourth branch, the read REFUSES BY NAME"*. That sentence is amended.

### 4.1 The rule, stated once

**NEVER SILENT AND NEVER BLOCKING.**

> **ARM 1.** When a resolved note EXISTS for the requested lift and other stored notes cannot be
> matched, the card SHOWS the resolved note and says, in ONE plain sentence, that some saved notes
> could not be matched after the import. One orphan note must not take every lift's note away.
>
> **ARM 2.** When NO resolved note exists and any stored note is unmatched, the read REFUSES BY NAME
> with `MACHINE_NOTE_TARGET_UNTRANSLATED`, as 14.2 says, because a blank draft there would be a lie.

Two further outcomes and no fifth: a resolved note with nothing unmatched carries no sentence, and no
note with nothing unmatched is a CONFIRMED ABSENCE and opens a blank draft.

### 4.2 The prototype: NEW CODE ONLY, ZERO PRODUCT BYTES

`spike/ew2b-r42-proto-notice.mjs` is written from scratch. It is **not** an edit of
`ew2r7-proto-note.mjs`, which is left exactly as round 7 ran it, so that a reviewer diffs two rules
rather than a patch. The only product code it calls is the coach's own `latestFor` and
`machineSettingsIn`, required from their own file. No host byte, no coach byte, no view byte.

**WHAT THE AMENDMENT ACTUALLY CHANGES, measured.** Round 7's `latestNoteOn` returned
`answer.record` and dropped the unmatched keys on the floor, so a card built on it could not have said
the sentence even if it wanted to. That is the defect `:621` names as SILENT. The amended call returns
the ANSWER, carrying the record, the unmatched keys and the notice, and the notice is computed on the
answer so that a card which forgets to draw it is a defect a row can fail for.

### 4.3 The journeys, one per arm, each able to fail

`spike/ew2b-r42-journeys.mjs`, against the REAL `machine-settings-host.mjs` over the REAL durable
client. **Farm exit 0, PC exit 0, byte-identical.** Two notes are saved before any import, both in the
document space; the admitted base carries `file-press` and `squat-old` and the correspondence names
only `press-old`, so the note on `row-old` is the orphan both arms turn on.

```
ARM 1 latestNoteFor("file-press").ok                       true
  the record it returns, saved as / in                     press-old / document
  the draft the editor opens                               {"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}
  the notes it could not match                             ["row-old"]
  the sentence it carries with the note                    "Some notes you saved could not be matched to a machine after your import."

ARM 2 latestNoteFor("squat-old").ok                        false
  the code it refuses with                                 MACHINE_NOTE_TARGET_UNTRANSLATED
  the notes it could not join                              ["row-old"]

CONTROL with nothing unmatched, ok / notice                true / null
```

The control matters: arm 2 is not a guard that refuses everything. With the orphan matched, the same
lift opens with its note and no sentence.

**EVERY CLAUSE KILLED ONE AT A TIME.** Each mutant changes EXACTLY ONE clause and the cell asserts
that a journey then FAILS. A clause no mutant can kill is a clause no row is holding.

```
M1 the one-sentence notice removed                       KILLED by ARM 1
M2 arm 2's refusal removed                               KILLED by ARM 2
M3 the refusal literal changed                           KILLED by ARM 2
M4 document provenance relabelled native                 KILLED by ARM 1
M5 the unmatched keys dropped                            KILLED by ARM 1
```

M3, M4 and M5 are the three mutants that survived Astra's own L2 round (`M14`, `M39`, `M40`). They do
not survive this one.

### 4.4 D11 and D14, in the same prototype

**D11, one generation.** Round 7's read took `lane.repository.load()` for the context and then
`lane.all()`, which loads again: two independent reads. The amended `latestNoteOn` takes ONE load and
derives BOTH the rows and the context from that single generation object, through the coach's own
`machineSettingsIn(generation)` - the exact route Astra's L2 names, and it needs no host or coach
edit.

```
D11 repository loads taken by ONE read                     1
```

Asserted `=== 1`, so a build that reintroduces the second load fails the row.

**D14, independent assertions.** Every one of the three clauses she names is asserted as a LITERAL,
never as the prototype's export, so a prototype that renames its constant cannot carry the row:
`saved_in === 'document'`, `code === 'MACHINE_NOTE_TARGET_UNTRANSLATED'`, and
`untranslated` deep-equal `['row-old']`, on the answer AND on the card call's rejection.

```
D14 the card call on arm 2 rejects with                    MACHINE_NOTE_TARGET_UNTRANSLATED
  and names the keys                                       ["row-old"]
CONTROL the orphan note is byte-unchanged on disk          true
product bytes this prototype required                      0
```

### 4.5 What `EW-25` becomes

`EW-25` keeps spec 14.5's journey and GAINS arm 1: the row now also asserts that a resolved note is
returned beside unmatched notes, that the sentence is present, and that the sentence is ABSENT when
nothing is unmatched. It fails for the defect in three separate ways, each measured above.

**WHAT THIS PROTOTYPE DOES NOT PROVE.** No sealed bundle through the real port: the admitted state is
the PE16-style fixture, installed directly. No DOM and no card: the sentence is carried on the
answer and nobody has drawn it. That is E-R40 condition 2 and it is section 6's, not this one's.

---

## 5. EVERY NAMED DEBT, D1 TO D14

Each debt is quoted VERBATIM in Astra's own words, copied from
`rebuild/lanes/astra/reviews/EW2-SPEC-RECHECK-L2.md` lines 24 to 37, which her own round confirmed
are byte-for-byte her R6 lines 43 to 52 for D1 to D10. Under each one: **THE ORDER** that answers it
and **THE ROW** that can fail for its defect. Where this brief can only restate a debt, it says so in
those words.

> **D1** - Define immutable per-edit id-space/basis provenance across first admission, native file-id edits, second selection and rollback; prove admission either resolves each saved target to the same lift or refuses before publishing, and make the document-state capture fold handle mixed histories without rewriting operations.

**THE ORDER: STOP. This is section 0's reason and it is the PM's.** E-R39 measured that the second
selection is REACHABLE and that it replaces the one derived record the whole design reads
(section 1.3). Step **B1** is written red at the base and is the first thing any answer needs.
**THE ROW:** `EW-21`, with B1's mixed-history assertion added, which fails today with
`PLAN_EDIT_TARGET_UNAVAILABLE`.

> **D2** - Implement cold-page recovery without depending on the attempted intent surviving in transient memory; reconcile authenticated stored intents before enabling any fresh review/id, and test a destroyed page/client context plus committed and uncommitted outcomes.

**THE ORDER:** step **B11**. The reconciliation seam lives in `edit-week-lane.cjs`, a new file, and
reconciles by the stable review intent read back off disk before any fresh intent id is minted. The
cell destroys the client context rather than closing a component.
**THE ROW:** `EW-24`, red today: `ew2r6-w5-inflight.mjs` measures a committed operation with a failed
reply and a fresh intent offered over it.

> **D3** - Name and authorize the authenticated-generation handoff for current/pending views and post-save refresh; one host.read() exposes neither both views nor its generation, and a successful save reply exposes no committed generation; do not satisfy E-R35 by two uncoordinated reads or a second replay implementation.

**THE ORDER:** section 3.1, measured, **WAITING ON THE PM**. Step **B12**.
**THE ROW:** `EW-13c`, plus `E-R35`'s half of `EW-14`: the second open's state must EQUAL the
companion's own read, taken from one generation.

> **D4** - Name and authorize the per-adoption Start.plan_basis handoff through the shared gym installation; createGymHost ignores a per-call planBasis option, so the current zero-byte today-bindings contract cannot carry the proposed changing fold label by the stated route.

**THE ORDER:** section 3.2, measured and UPHELD by execution, **WAITING ON THE PM**. Step **B13**.
**THE ROW:** `EW-14`'s stored-field assertions, which name `plan_basis` by name and fail for a changed
card that leaves the stored Start wrong.

> **D5** - Wire and test every required planRoster history consumer with exact lift attribution and counts, including past/current/pending creations, tombstoned creation, removal and same-label re-add; a roster key existing in a fixture is not a history read.

**THE ORDER:** step **B9**, and the roster is asserted from the PERSISTED generation, never from a
printed union. `ew2r7-d9-labels.mjs` already measured that no cell has persisted the union.
**THE ROW:** `EW-22`, with the attributed count added, red today with `PLAN_EDIT_ID_REUSED`.

> **D6** - Specify the admission refusal envelope/reason for occupied file handles consistently with EW-23, and place slugOf/reserved-id minting on a permitted import boundary; E6 forbids the released setup-model import that 13.4's direct provider call assumes.

**THE ORDER:** step **B9**, and the envelope is asserted as PUBLISHED by admission, not as a pure
function's return. The minting boundary is named in the step's own file list before a byte is written.
**THE ROW:** `EW-23`, both directions, red today (`idCollisions` returns `[]` for the equal label and
`["press"]` for a valid rename).

> **D7** - Wrap setup-tag projection, validation and detached fold execution at admission as well as the editor; assert the defined default for raw throws and retain diagnostic detail internally, since the host's save-stage catch does not surround admission.

**THE ORDER:** step **B10**, and the wrapper covers PRE-FOLD projection as well as the detached fold,
which is the half 13.10's narrowing left open.
**THE ROW:** `EW-17d`'s admission control, asserting the named default over a raw `RangeError` that
today escapes with no code.

> **D8** - Complete E-R34's state table for pending-only edits, plan_edit_basis/default failures and failed authentication; show retention/cause claims only when proved, and replace C2's unsupported assertion that a missing correspondence means a different exercise copy.

**THE ORDER:** section 8 corrects the sentences and section 8.2 states the rule that governs them.
The state table's three missing states are named there as PROPOSED and are the owner's to overrule.
**THE ROW:** `EW-14`'s four clauses, plus a new assertion that the sentence shown matches the state
reached, so a card that shows C1 on a NOT TRANSLATED refusal fails.

> **D9** - Correct evidence/count labels: 11 executable cells include the 3 prototypes; the loader neither prints nor asserts its net count; J1 does not execute patched host/Start or prove three-copy identity; P2 prints a desired union rather than persisting it; four acceptance rows were added, not three.

**THE ORDER: THIS ONE IS ALREADY DISCHARGED and this brief only restates it.** Spec 14.7 corrected
every label in place, measured by `ew2r7-d9-labels.mjs`, and Astra's L2 round checked the corrections
independently and called them correct. The brief inherits the corrected counts and adds nothing.
**THE ROW:** none is owed. D9 is a labelling debt, not a product defect, and inventing a row for it
would be the kind of paper answer `D-EW2-FINAL` forbids.

> **D10** - Carry the host-day Start/readiness choice into the build/S10 brief and execute a stored Start across midnight; a 60-second interval is not a deadline, 13.7 contains no promised Start readiness check, and EW-19's visibility callbacks cannot prove either claim.

**THE ORDER: THIS BRIEF CAN ONLY RESTATE IT, and says so in those words.** The choice is the S10
brief's by `:621`'s own routing and by 13.13's second named debt. What this brief adds is the
carriage: it is written here so the S10 brief cannot claim it was never handed over, and step **B11**
owns the stored Start that a midnight cell would drive.
**THE ROW:** none in EW2. `EW-19` cannot fail for it and this brief does not pretend otherwise.

> **D11** - Resolve machine notes and their admitted correspondence from one authenticated generation; latestNoteOn currently loads a generation and then all() loads another, so bind both to one snapshot or prove and retry a generation mismatch without changing the zero-byte hosts.

**THE ORDER:** step **B6**, DONE in the prototype: section 4.4, ONE load, measured and asserted, with
no host or coach byte.
**THE ROW:** `EW-25`, with the load count asserted `=== 1`.

> **D12** - Enforce 14.2's any-untranslated-note refusal before returning a matched record, and assert a generation containing both a resolved native note and an unresolved document note; the prototype currently returns ok=true with untranslated=["press-old"].

**THE ORDER: `:621` (5) OVERRULES THE REMEDY SHE NAMES, and this brief says so plainly.** She asked
for the refusal to be enforced before a matched record is returned. The PM AMENDED 14.2 instead:
never silent AND never blocking, because one orphan note must not take every lift's note away
(`E-R34`'s reasoning applied to notes). Her DEFECT is accepted whole: the old behaviour was silent.
Section 4 is the answer.
**THE ROW:** `EW-25` arm 1, which fails when the sentence is removed (mutant M1) and when the keys are
dropped (M5).

> **D13** - Carry the explicit gym-app hunk E authorization and the new resolver's path, export and browser contract into the build brief, and execute the linked card path; P5 requests a default export absent from the supplied prototype and its parse-only check accepts a missing module or missing method.

**THE ORDER:** section 6 carries the authorization, the re-measured size and the module contract; step
**B7** executes it. The export contract is fixed here: the resolver's module exports **NAMED**
`latestNoteOn`, and the card imports it by name. There is no default export, which is the mismatch
that made P5 exit 1 on Astra's own run.
**THE ROW:** `EW-25`'s card half, and it must EXECUTE the link, not parse it: mutants that point the
card at a missing module or a missing method must go RED, which is precisely what `M41` and `M42`
did not do.

> **D14** - Make EW-25 assert saved_in=document, the literal MACHINE_NOTE_TARGET_UNTRANSLATED code, and the rejection's untranslated keys independently of prototype exports; P4 stays green when each of those clauses is changed separately.

**THE ORDER:** step **B6**, DONE: section 4.4 asserts all three as literals, and mutants M3, M4 and M5
kill them.
**THE ROW:** `EW-25`.

---
## 6. THE SEALED BUDGET, FINAL

### 6.1 Every sealed file and every hunk, at the spec head

| file | hunk | size | authority |
|---|---|---|---|
| `rebuild/m4/workout/plan-edit-model.cjs` | **H1** `foldPlanEditsAt` and the `inspect()` factoring | unchanged from v4 | 4.3 ruling 2, `E-R4` |
| `rebuild/m4/workout/plan-edit-model.cjs` | **H2** the ONE named translation boundary | **24 added (9 comment), 2 removed, net 22**, counted by diff and independently re-diffed by Astra | `E-R30` |
| `rebuild/m4/workout/plan-edit-model.cjs` | **H3** `reserved_ids` on `result()` | about 4 added, 1 changed | `E-R32` |
| `rebuild/m3/w6/local/source-admission.mjs` | **A** the per-capture fold call and three re-pointed checks | unchanged from v5 | 4.3 ruling 1, `E-R16 PRIME` |
| `rebuild/m3/w6/local/source-admission.mjs` | **B** the `plan` class replay family plus `E-R33`'s zero-capture proof | v4's estimate plus the zero-capture proof | 4.3 ruling 0, `E-R33` |
| `rebuild/m3/w6/local/source-admission.mjs` | **C** the history roster and `planIdCollisions` | about 6 to 10 added for the roster, 8 to 12 for the guard | `E-R31`, `E-R32` |
| `rebuild/m3/w6/local/source-admission.mjs` | **D** the recorded `lift_correspondence` member on the `view` at `:781` | **1 changed line** | `E-R30` |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | the ONE added export | unchanged | `E-R17 PRIME` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | `createEditWeekEntry` | unchanged | 3.3 line 2 |
| `rebuild/m3/w7-preview/today/edit-week-lane.cjs` | new file | new file | `E-R12`, `E-R34`, `E-R36` |
| **the note resolver, new file** | `machine-note-identity.mjs`, NAMED export `latestNoteOn` | new file | `E-R38` F9 as amended by 14.2 and by `:621` (5) |
| `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` **(NOT `gym-app.mjs`: see 6.3)** | **E** | **see 6.3** | **`E-R40`, GRANTED on three conditions** |
| `.github/workflows/rebuild.yml` | the new suite registration | unchanged | R1 N4, and it is the PM's |

**THE ZERO-BYTE NAMES THAT STAY ZERO, by name, measured and not hoped:** `plan-edit-host.mjs`,
`plan-edit-commands.cjs`, `today-bindings.mjs`, `workout-host.mjs`, `host-bindings.mjs`,
`rebuild/coach/**` including `machine-settings-commands.cjs`, `machine-settings-host.mjs`,
`machine-settings-view.mjs`, `exercise-catalogue.mjs`, `setup-model.mjs`, `setup-host.mjs`.

`ew2b-r42-proto-notice.mjs` re-proves the note lane's half of that list: the resolver calls the
coach's `latestFor` and `machineSettingsIn` and the host's `repository`, and edits none of them.

### 6.2 What E-R40 changes

`:621` (3) GRANTS hunk E as a named budget item on three conditions.

| condition | state |
|---|---|
| 1. RE-MEASURED at the build base | **DONE**, section 6.3 |
| 2. EXECUTED on a linked card path before acceptance | **NOT DONE.** No cell of this round drove a DOM. It is step **B7**'s and it is a condition of ACCEPTANCE, not of the brief |
| 3. rides EW2's own reseal child and never lands alone (`:582`) | carried into step **B7** and into section 7's review plan |

`gym-app.mjs` therefore leaves 13.12's zero-byte list by name, and so, at the base, does
`gym-settings-lane.mjs`. This brief moves no file off that list by implication.

### 6.3 THE BASE: where hunk E lands, re-measured

**Cell: `ew2b-r40-hunk-e-base.mjs`. Farm exit 0 at both roots; PC exit 0 at both roots.** It reads
files, writes nothing, applies each candidate patch in memory, counts by line, proves the result
parses and proves the file on disk is byte-unchanged.

| checkout | the file holding `settingsLane.latest(liftId)` | static imports in it | SHAPE 1, a static import | SHAPE 2, a dynamic import in place |
|---|---|---|---|---|
| spec head `1ad61cfe` | `gym-app.mjs` | 3 | **2 added, 1 removed** (spec 14.4 reproduced exactly) | 1 added, 1 removed |
| **build base `cc87c072`** (`origin/rebuild/c-today-split-build`) | **`gym-settings-lane.mjs`** | **0** | **3 added, 1 removed** | **1 added, 1 removed, net 0** |

**THE HUNK MOVES, AND ITS PRICE CHANGES.** At the base the read is at `gym-settings-lane.mjs:56`,
inside cut region GA-S03, and `gym-app.mjs` no longer holds it at all. That file has **no static
import whatsoever** and reaches `machine-settings-host.mjs` through a DYNAMIC import. So a static
import there costs a line AND the blank that separates it from the body: **three, not two**.

**THE RECOMMENDED SHAPE AT THE BASE IS SHAPE 2**, the file's own idiom: `1 added, 1 removed, net 0`,
no new import line, and **no new static edge in the page's import graph at all**, which is the
property 14.4 claimed for the resolver and which SHAPE 1 would spend. The file's own banner says its
only authored lines are its banner, its factory line and its return block; SHAPE 2 touches one line
inside one declared cut region and adds no fourth authored region.

**A WARNING FOR WHOEVER WRITES B7.** The base moved under this brief while it was being written:
the farm held `e08bc11c` and the PC's `origin` held `cc87c072`. The farm was re-synced and both
measurements above are at `cc87c072`. **Hunk E must be re-counted at the base the build actually
starts from**, and this cell takes that root as an argument so it can be.

### 6.4 What E-R41 would add, under each alternative

| handoff | ROUTE 1 (zero bytes) | ROUTE 2 (sealed) | recommended |
|---|---|---|---|
| **D3**, the dated views | 0 bytes; a second projector instance in the lane; 1 authenticated load | `plan-edit-host.mjs` **+13 added, 0 removed**; that file leaves the zero-byte list | **ROUTE 1** |
| **D4**, `Start.plan_basis` | 0 bytes; a second durable client on one installation | `today-bindings.mjs` **2 changed lines, net 0**; that file leaves the zero-byte list | **ROUTE 2** |

If the PM grants both recommendations, the sealed budget grows by **2 changed lines in one further
file** (`today-bindings.mjs`) and by nothing else. If he prefers ROUTE 2 for D3 as well, it grows by
13 added lines in `plan-edit-host.mjs` on top of that.

---

## 7. THE REVIEW PLAN AND THE BAR

### 7.1 Who does what

- **THE AUTHOR IS A CLAUDE HAND**, for everything that stores or reads the athlete's data, which is
  every step from B1 to B13. `:621` (7).
- **ASTRA REVIEWS BLIND**, at highest effort, in the loop `:613` describes: author round and review
  round alternate, her UNDISPUTED findings are the author's orders, an author may DISPUTE only with a
  measurement, and the loop stops at ACCEPT, at a disputed finding, or after round 3.
- **THE PM JUDGES ONCE, AT THE END**, reads every review file whole and **reads every product hunk**
  (`:439`). Hunk E, hunk D and H2 are read line by line because they are the three that touch the path
  to his data.
- **THE SCREEN (B14) WAITS ON THE DESIGN LANE's C-UI-9** (`DECISIONS:561`) and is not in this loop.
- **EW2 SEALS IN ITS OWN RESEAL CHILD, AFTER S10.** Hunk E rides that child and never lands alone
  (`:582`).

### 7.2 Which suites, on which system

| what | where | why |
|---|---|---|
| the twenty cells under twenty-three ids, plus `EW-25` | **the PC**, with the red first run shown | the farm has 2 CPUs and the Today suite takes 9 minutes there |
| every row that seals a bundle through the real port (`EW-17a` to `EW-17d`, `EW-21`'s admission half, B1) | **THE PC ONLY** | the port's oracle files are outside the farm's include list. Measured again this round: the farm cannot seal |
| the pure cells (`EW-19`, `EW-20`, `EW-17c` control 1, the note resolver's own rows) | the farm scratch AND the PC | both, and their outputs compared byte for byte, exactly as this brief's four farm-capable cells were |
| the inherited suites, named by real path with their counts | the PC | spec 6 item 2 |
| both-OS evidence | GitHub CI `rebuild-public`, ubuntu and windows | spec 6 item 3 |
| the two design gates | the pack, with `EARNED_APP` at the preview build | spec 6 item 4 |

**THE FARM BASELINE FOR THIS ROUND, measured in a scratch worktree at `1ad61cfe`:**
`rebuild/lanes/d/plan-edit/model.test.cjs` plus `durable-host.test.mjs` in one process, **85 tests,
85 pass, 0 fail, 1.73 seconds**, with `git status` showing no tracked file modified.

### 7.3 Where the new rows get a CI home, given that the workflow file is sealed

`.github/workflows/rebuild.yml` is PINNED and **this lane has no `.github` custody** (spec 6 item 3,
spec 3.3 line 7). So:

1. the suite is written and run **by path** from the start: `node --test
   rebuild/m3/w7-preview/today/test/edit-week.test.mjs`, with each id individually selectable. That is
   the bar whether or not CI knows the file exists;
2. **the PM authors the registration hunk on the S10 child**, and it is the last thing to land, not
   the first. A lane that cannot get its rows into CI does not get to invent a second workflow file;
3. until that hunk lands, the both-OS evidence for the new rows is **the PC run plus the farm scratch
   run**, compared byte for byte, and the report says exactly that rather than claiming CI cover it
   does not have;
4. **a builder who finds himself editing `.github` has found a STOP** (spec STOP 4), not a workaround.

### 7.4 The bar, restated for this item

Spec section 6's eight clauses stand unchanged. `:621` adds three:

9. **E-R40 condition 2**: hunk E is EXECUTED on a linked card path before acceptance. A parse-only
   check does not count, measured: Astra's `M41` and `M42` pointed the card at a missing module and a
   missing method and both stayed green.
10. **E-R39**: no EW2 product byte until the PM has ruled on the second admission. Section 0.
11. **E-R41**: B12 and B13 do not start until the PM has ruled on both handoffs. Section 3.

---
## 8. FOR THE OWNER

Joe, this section is the whole brief in plain words. Nothing here needs any programming to read.

### 8.1 What we found, and why the build has stopped

We wanted to know something simple before writing any code: **can your phone take in a second copy of
your old training history, after it has already taken in one?**

We tested it for real. We made up a fake history file, put it through the same locking program the
real one goes through, and fed it to the phone. Then we fed it a second, different file.

- Feeding it **the same file twice** is refused, every time, with a clear reason. Good.
- Feeding it **a different file** works. The phone accepts it, in the same session and after a
  restart. We did it three times in a row.

That matters because of how the phone remembers which exercise is which. When a file comes in, the
phone writes down one list: "the exercise you called this, the file calls that". Everything we were
about to build reads that one list. **When a second file comes in, that list is replaced by the new
one.** The old one is gone from where we would look for it.

Nothing is deleted from your phone. Your saved changes and your notes are all still there, and we
checked that the phone keeps a full record of every file it has ever taken in. But the single list
that everything reads only ever describes the most recent file.

So we stopped, before writing a line of it, and we are asking. That is what the rule said to do.

### 8.2 The sentences we would show you, and they are proposals you can overrule

These are the words on the screen when something cannot be applied. They are written to say what
happened and nothing more. A reviewer told us that two of our earlier sentences claimed more than we
could actually prove, so they are rewritten here.

**When we could not apply your saved changes and we do not know why:**

> We could not apply your saved changes, so this is the plan we can show you with confidence.

**When we could not match your saved changes to an exercise after an import:**

> We could not match your saved changes to this exercise after your import, so we have not applied
> them.

*(The old version of this one said your changes "were made to a different copy of this exercise". We
cannot actually prove that, so we no longer say it. We say what we could not do.)*

**The reassurance, shown beside either of the two above:**

> Nothing you saved has been removed.

*(This used to be tacked onto the end of each sentence, which made two sentences where we had promised
one. It is now its own line, and it is a promise we can keep: the phone never throws away anything you
saved, even when it cannot use it.)*

**The heading on the screen where your unapplied changes are listed:**

> Your saved changes need attention

**The line under that heading:**

> These changes are still on your phone. They are not part of the plan you see on Today.

*(A reviewer was right that "still on your phone" is a claim. It is only shown on the one screen that
has just read those changes back off the phone and listed them for you, so by the time you read it,
we have them in front of us.)*

**And the new one, for your machine notes:**

> Some notes you saved could not be matched to a machine after your import.

*(This shows underneath the note we DID find. The rule we are proposing is: never go quiet, and never
block you. If we find the note you asked for, you get it, and we mention the ones we could not place.
If we find nothing for that machine AND there are notes we could not place, we tell you so rather than
showing you an empty box, because an empty box would be a lie.)*

### 8.3 The three questions only you can answer

**1. Should the phone let you import a second, different history file at all?**
Today it does. We can leave it, or we can have it refuse and tell you why. If you want it allowed, we
have more work to do so your saved changes and notes survive it, and we should do that work before the
feature ships rather than after. If you would rather it simply said no for now, that is much less work
and much less risk.

**2. Should "Nothing you saved has been removed" be on the screen every time, or only if you go
looking?**
It is true either way. The question is whether seeing it constantly is reassuring or is just noise.

**3. When your saved changes cannot be applied, should Start still be available?**
Our proposal is yes: you train, on the plan the phone is sure about, and we tell you plainly that your
changes are not in it. The alternative is to stop you and make you deal with it first. We think
stopping you from training is the worse answer, but it is your call.

---

## 9. WHAT THIS BRIEF DID NOT MEASURE

No sentence above claims any of this, and a reviewer should treat anything that looks like it does as a
defect in the writing.

- **No plan edit and no machine note was carried across a SECOND admission.** Section 1 measured that
  the second admission happens and what it does to the installation's records. It did not measure what
  it does to a saved edit, because the record such an edit would be read through
  (`lift_correspondence`) does not exist at any head yet. Astra's wrong-lift result is therefore still
  hers, now with its reachability established and its mechanism not.
- **No rollback and no `reopen`.** `source-admission.mjs` carries both and neither was driven. D1
  names both and this brief answers neither.
- **No DOM, no browser, no phone, no Windows suspension.** Hunk E is counted and parsed at two heads
  and **not executed**; that is E-R40 condition 2 and it is open. The note sentence of section 4 is
  carried on an answer object and nobody has drawn it. `EW-16` is untouched.
- **No full Today suite, no rig187, no conformance or private fixture, no protected soak, no CI run
  and no deployment.** The farm baseline of 7.2 is the plan-edit pair only.
- **No second-device sync and no real page kill.** D2 is specified and not prototyped, exactly as
  13.13 records.
- **No sealed bundle went through the port in the farm, ever**, and none of the four farm-capable cells
  claims one: each installs the PE16-style admitted-state fixture directly. The three E-R39 cells are
  PC-only for exactly that reason.
- **The three states D8 asks for** (pending-only edits, `plan_edit_basis` and default failures, failed
  authentication) **are named and not built.** Section 8's sentences are PROPOSED copy; no cell drives
  a screen that renders them.
- **D10 is restated and not answered**, in those words, and section 5 says so under the debt itself.
- **The build base moved while this brief was written** (`e08bc11c` to `cc87c072`). Every base number
  here is at `cc87c072`, and section 6.3 says hunk E must be re-counted at whatever base the build
  actually starts from.

---

## 10. THE CELLS OF THIS BRIEF

They do not run from `spike/`. Copy them to `rebuild/lanes/d/plan-edit/` and run each from the
repository root, one Node process at a time, under `MEASURED_TEST_NOW=2026-09-03
TZ=America/New_York`. `ew2b-r42-proto-notice.mjs` is imported and never run alone. The three E-R39
cells additionally need the live `node_modules` junctions (spec 14.8) and the real port, so they run
on the PC only.

| file | what it proves | farm | PC |
|---|---|---|---|
| `ew2b-r39-probe.mjs` | the open question: five journeys and a control, printed and not prescribed | **cannot: it seals** | **exit 0** |
| `ew2b-r39-second-admission.mjs` | **E-R39 ANSWERED YES**, with the refusals and the success asserted by name, and the single derived record shown to be replaced | **cannot: it seals** | **exit 0** |
| `ew2b-r39-retention.mjs` | what survives a second admission: every selection keeps its own basis and identity review | **cannot: it seals** | **exit 0** |
| `ew2b-r40-hunk-e-base.mjs` | hunk E re-measured at the spec head AND the build base, both shapes counted, nothing written | **exit 0** (both roots) | **exit 0** (both roots) |
| `ew2b-r41-d3-generation.mjs` | D3's first clause upheld and its second narrowed; ROUTE 1 at one load with byte-equal views; ROUTE 2 counted at 13 lines | **exit 0** | **exit 0** |
| `ew2b-r41-d4-planbasis.mjs` | D4 upheld through a real stored Start; ROUTE 1 executed; ROUTE 2 counted at 2 lines | **exit 0** | **exit 0** |
| `ew2b-r42-proto-notice.mjs` | the amended rule itself, NEW CODE, zero product bytes, one authenticated generation | imported | imported |
| `ew2b-r42-journeys.mjs` | both arms, five mutants each killing a journey, D11's one load and D14's three literals | **exit 0** | **exit 0** |

Every farm-capable cell's output is **byte-identical on the two systems**. No U+2013 and no U+2014
appears in any file this lane authored, counted rather than claimed.
