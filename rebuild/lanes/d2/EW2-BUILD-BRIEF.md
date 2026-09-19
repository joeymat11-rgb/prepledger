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
farm scratch of this branch's head as well. Where a cell was WRONG and the product was right, the
cell says so in its own output and this brief repeats it.

**ROUND 1 SAID "NOTHING HERE IS ESTIMATED" AND THAT WAS FALSE.** Astra's N7 is right: three lines of
section 6.1 were estimates wearing a diff count's clothes. Every row of 6.1 now says which it is,
in one word, **COUNTED** or **ESTIMATE**, and an estimate is never added into a total.

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
because the PM rules once, with the brief's review in hand. Sections 2 to 11 are ready to execute
the moment the PM answers section 1. **Not one of them may start first.**

**LOOP ROUND 1 DID NOT TOUCH THIS STOP.** Astra's review says so in its own words and this round
agrees: her two blocking items are about what the brief SPECIFIES, not about whether the build may
begin. Section 0a says what changed.

---

## 0a. WHAT LOOP ROUND 1 CHANGED, AND WHAT IT DID NOT

`rebuild/lanes/astra/reviews/EW2-BUILD-BRIEF-REVIEW-L1.md` (`ebb4adb3` on
`rebuild/r-astra-ew2-brief-l1`), read whole, verdict REJECT. **NOTHING IN IT IS DISPUTED.** Both
blocking items were re-measured by this author with programs of his own, RED FIRST and committed
red at `234d0e5d` on this branch, before a word below was changed.

| her item | re-measured by | what this round did |
|---|---|---|
| **B1** the amended answer does not fit the card hunk; Save supersedes a hidden setting | `ew2b-b1-card-handoff.mjs`, RED at the base, then GREEN on the correction | 4.6 is new: the handoff is specified and COUNTED across **four** named consumers, and `machine-settings-view.mjs` and `design.cjs` LEAVE the zero-byte list by name |
| **B2** ROUTE 1 bypasses immutable-operation authentication and applies a saved edit to the wrong lift | `ew2b-b2-route1-auth.mjs`, RED at her counterexample, then GREEN on ROUTE 1B | 3.1's ROUTE 1 is **WITHDRAWN**. A zero-byte route that keeps the host's own authentication boundary was found, measured and recommended instead |
| ND1, ND2, ND3 | carried VERBATIM in section 11, each with its order and its row | |

**HER SEVEN NOTES, ONE LINE EACH, none argued with.**

| note | where it landed |
|---|---|
| **N1** D10 is only restated although `:621`(6) orders it a failing row | Section 5's D10 now names the S10 owner, the Start/readiness rule this brief PROPOSES, the midnight journey, and the row: `EW-14`'s stored-Start assertions extended by **B11**, with `EW-18` for the refusal arm |
| **N2** D5 and D6 have only partial operational answers | Section 5's D5 names all four roster consumers; D6 SETTLES the envelope (`LOCAL_SOURCE_PROGRAMME_UNRESOLVED` is admission's, `PLAN_EDIT_FILE_HANDLE_OCCUPIED` is the editor's) and measures the minting boundary at 1 changed line in `source-admission.mjs` |
| **N3** D8's three missing states are not completed by section 8 | Section **8.3** is new: one row per missing state, its input, its sentence and what Start does, all PROPOSED, with no retention claim in the state whose evidence cannot be read |
| **N4** the ordered build omits H1, the added reader and the today-lanes wiring | Steps **B8a** and **B9a** are new, `today-lanes.cjs` is in 6.1 and in **B11**, and 2.2 now puts B11 behind the Today split's seal and lists the predecessors inside the sealed files |
| **N5** the D11 counter misses `host.all`'s load; the card-call assertion accepts an empty notice | The counter moved to the shared durable boundary and `M6`, a two-generation read, now takes 2 and fails the row; the sentence is asserted as a non-empty LITERAL and the export checked against it (4.4, 4.5) |
| **N6** D4's two-line candidate is not smallest; 3.2 contradicts itself | **ROUTE 2B**, 1 changed line, measured and recommended; ROUTE 1's heading no longer says RECOMMENDED; its control is described as sequential era reopenings |
| **N7** the evidence register is wrong | **B0 writes 28 selectable ids** (27 counted in spec 5 plus `EW-25`); 6.1 marks every row COUNTED or ESTIMATE and totals nothing; section 6 is no longer "FINAL"; **B16** states the S10 ownership and that it lands last |

**WHAT THIS ROUND DID NOT DO.** It wrote no product byte, moved nothing off the never-read list,
sealed nothing, and touched only `rebuild/lanes/d2/EW2-BUILD-BRIEF.md` and
`rebuild/lanes/d2/spike/ew2b-*`. Section 0's STOP is untouched and is the PM's and the owner's.
E-R41's two routes remain RECOMMENDATIONS; this brief picks nothing the PM reserved.

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
| **B0** | The suite skeleton: every cell of spec 5 written RED under its own id, against the merged companion. **TWENTY-EIGHT SELECTABLE IDS** (N7): spec 5's table carries **27**, counted by `ew2b-n-register.mjs`, and `EW-25` is the twenty-eighth. Spec 5's own prose still says "TWENTY-THREE selectable ids"; that sentence was written in v5 and never re-counted when v6 added `EW-21` to `EW-24` to the same table. The spec is closed, so the brief carries the corrected count and does not edit it | `today/test/edit-week.test.mjs` | none | none yet; every id exists and is red | the whole suite is the red run | **after E-R39**; nothing else |
| **B1** | **NEW, `E-R39`.** The mixed-history admission fold cell, RED at the base: a history whose stored targets span both id spaces resolves every target to the same lift or refuses BY NAME before publishing | the suite only | none | `EW-21`'s admission half | yes, and it is Astra's own R6 result (`PLAN_EDIT_TARGET_UNAVAILABLE`) | **after E-R39** |
| **B2** | `EW-19` and `EW-20` to GREEN: `watchDayRollover` with a fake `doc`, and the import screen's exported `refusalLines` | the suite only | none | `EW-19`, `EW-20` | yes | **after E-R39**; these two need nothing else (spec 7.2) |
| **B3** | `EW-17c` CONTROL 1 to GREEN: four assertions about `lift-correspondence.cjs` and the phone's document | the suite only | none | `EW-17c` control 1 | yes | **after E-R39** |
| **B4** | `EW-17d`, `EW-17a`, `EW-17b` to their measured RED answer over a real sealed bundle, each naming its bracket level (`E-R21`) | the suite only | none for the red run | none (green needs 4.3's hunks) | yes, and SPIKE M4 measured them red | **after E-R39** |
| **B5** | The released view half: `edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs` over the frozen reply objects | the three released files | none sealed | none alone | n/a | **after E-R39**; the LOOK waits on C-UI-9 |
| **B6** | The new note resolver, its own file, from `ew2b-r42-proto-notice.mjs`: `noteIdentityOf`, `notesFor`, `latestNoteFor`, `latestNoteOn`, ONE authenticated generation, the amended two-arm rule | a NEW file (`machine-note-identity.mjs`, path fixed by 3.2's release list) | none sealed | `EW-25` | yes, `ew2r7-b1-note-read.mjs` is the red and it is in this branch's history | **after E-R39** |
| **B7** | **RE-SPECIFIED BY B1.** The card handoff, ALL FOUR consumers together: the read, the cache that receives the ANSWER, the block that draws the sentence and the file that declares the word. Section 4.6 | `gym-settings-lane.mjs`, `gym-app.mjs`, `machine-settings-view.mjs`, `design.cjs` | **E1**, **E2**, **E3**, **E4** | `EW-25`'s card half | yes: `ew2b-b1-card-handoff.mjs` is RED at the base on the round 1 hunk and it is in this branch's history | **after E-R39** AND the Today split's seal; it rides EW2's own reseal child (`:582`) |
| **B8a** | **NEW (N4).** `H1`: `foldPlanEditsAt` factored out of `inspect()` so the boundary and the admission fold have one fold to call. It is B8's and B10's PREDECESSOR and nothing above it can be written first | `plan-edit-model.cjs` | **H1** | none alone | yes, through B8's and B10's reds | **after E-R39** |
| **B8** | `E-R30`'s translation boundary and the recorded correspondence | `plan-edit-model.cjs`, `source-admission.mjs` | **H2**, **D** | `EW-21` | yes (`ew2r6-w1-import-identity.mjs`) | **after E-R39** and **B8a**, and E-R39's answer may change what D writes |
| **B9** | One owner of creation: the history roster and the reserved union | `plan-edit-model.cjs`, `source-admission.mjs` | **H3**, **C** | `EW-22`, `EW-23` | yes (`ew2r6-w2`, `ew2r6-w3`) | **after E-R39** |
| **B9a** | **NEW (N4).** The added export on `local-source-basis.mjs`, the ONE reader the lane takes its admitted basis through (`E-R17 PRIME`) | `local-source-basis.mjs` | the ONE added export | none alone; it is `EW-13c`'s and `EW-21`'s predecessor | yes, through their reds | **after E-R39** and **B8** |
| **B10** | The retained family, proofs with zero captures, the per-capture fold | `source-admission.mjs` | **A**, **B** | `EW-17a` to `EW-17d` | yes (SPIKE M4) | **after E-R39**, **B8a** and 3.5's F2 package |
| **B11** | The adoption compose, `E-R34`'s four states, `E-R36`'s reconciliation seam, **and D10's stored Start across midnight** | `edit-week-lane.cjs` (new), `today-entry.mjs`, **`today-lanes.cjs`** (N4: spec 3.3 allocates the wiring and the MOVED adoption gate, and round 1 left it out of 6.1 altogether) | `createEditWeekEntry`, the `today-lanes.cjs` wiring | `EW-13c`, `EW-13d`, `EW-14`, `EW-18`, `EW-24` | yes (`ew2r6-w5-inflight.mjs` for `EW-24`) | **after E-R39, 3.4's sealed lane, 3.5, AND THE TODAY SPLIT'S SEAL**, because the adoption gate it moves lives in `today-lanes.cjs`, which does not exist until the split lands |
| **B12** | The two dated views and the post-save refresh. **ROUTE 1 IS WITHDRAWN (B2); the candidate is ROUTE 1B** | **WAITS ON E-R41** | see section 3.1 | `EW-13c`, and `E-R35`'s half of `EW-14`, **plus B2's negative control and its refusal envelope** | not yet written | **after E-R39 AND the PM's E-R41 ruling** |
| **B13** | The per-adoption `Start.plan_basis`. **The candidate is ROUTE 2B, 1 changed line (N6)** | **WAITS ON E-R41** | see section 3.2 | `EW-14`'s stored-Start assertions | not yet written | **after E-R39 AND the PM's E-R41 ruling** |
| **B14** | The screen: every state drawn | `edit-week-view.mjs`, `preview.css` | none sealed | `EW-16` | n/a | **after E-R39 AND C-UI-9** (`DECISIONS:561`), and `preview.css` after S9 seals |
| **B15** | The route and the mount | `today-app.cjs` (about six lines, **ESTIMATE**), **and the lane's entry in `today-lanes.cjs` after the split** | 3.3 line 2a | none alone | n/a | **after E-R39 AND TODAY-SPLIT lands** |
| **B16** | CI registration of the new suite. **ORDER AND OWNER, made explicit (N7): the hunk is the PM's, it is authored on the S10 child and NOT on EW2's reseal child, and it lands LAST, after EW2's child has sealed. EW2 never waits on it** | `.github/workflows/rebuild.yml` | 3.3 line 7 | every row, on both systems | n/a | **THE PM's, on the S10 child. No lane has `.github` custody** (spec 6 item 3) |

### 2.2 What WOULD start the day the PM lifts the block, and what waits behind what

- **Needs nothing further: B0, B1, B2, B3, B4, B6, B8a.** B2 is the only pair that reaches GREEN on
  day one; the spec measured that and `:621` did not change it.
- **Waits on C-UI-9:** B14 only. `E-R8` still settles that the view half (B5) starts before the
  drawing exists.
- **Waits on the Today split's seal:** B7, **B11** and B15. B7 additionally rides EW2's own reseal
  child and never lands alone (`:582`, carried by `:621` (3)). **B11 is new to this list (N4):**
  its moved adoption gate and its lane wiring live in `today-lanes.cjs`, a file that does not exist
  until the split lands, so B11 cannot be begun on the split's ancestor and then rebased onto it.
- **Waits on the PM's E-R41 ruling:** B12 and B13, and nothing else. This is why section 3 measures
  both routes now rather than after the block lifts.
- **Waits on 3.5's F2 package:** B10, B11, and seventeen of spec 5's ids, exactly as spec
  7.2 measured. `:621` changed none of that.
- **PREDECESSORS INSIDE THE SEALED FILES (N4):** **B8a before B8 and B10** (`H1` is the fold both
  call), **B8 before B9a** (the reader needs the recorded correspondence), and **B1 before B8**,
  which is 2.3's rule.

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

### 3.1a ROUTE 1 IS WITHDRAWN. ASTRA'S B2, RE-MEASURED AND ACCEPTED WHOLE

**Cell: `ew2b-b2-route1-auth.mjs`. RED first at her counterexample, committed red; then GREEN on the
correction. Farm exit 0, PC exit 0.**

Round 1 wrote that ROUTE 1 takes "ONE **authenticated** load" and recommended it. **That word was
wrong and it was the load-bearing word.** `repository.load()` returns what the encrypted store
holds; it does not prove that an immutable operation is the one the athlete signed. That is the
existing `PE09-auth` fault class (`rebuild/lanes/d/plan-edit/durable-host.test.mjs:372`), and this
author reproduced it on the one member a plan edit keeps its target in.

**THE INPUT, re-driven here and not taken on her word.** `update sets=5` saved on `press-old`
through the REAL host. Then ONE field of the stored operation changed through the encrypted
repository commit, `members[0].value.edit.exercise_id` from `press-old` to `row-old`, with
`member_set_commitment` and `canonical_content_commitment` left exactly as the product wrote them.

```
the stored edit now names                                row-old
its member_set_commitment is unchanged                   true
its canonical_content_commitment is unchanged            true

host read over the changed history                       false
  the code it refuses with                               LOCAL_HISTORY_IDENTITY_UNPROVEN
ROUTE 1 read over the changed history                    ANSWERED, no refusal
  pending press / row                                    2 / 5
  applied_ids                                            ["op-synthetic-plan-edit-device-2"]
```

**So ROUTE 1 hands the athlete a plan the product's own host has just refused to produce, with his
saved edit on the WRONG LIFT.** B2 stands. Nothing in it is disputed, and every sentence of round 1
that called ROUTE 1 authenticated or equivalent to the host is withdrawn here rather than softened.

**ROUTE 1B, THE ZERO-PRODUCT-BYTE ROUTE THAT KEEPS THE BOUNDARY. RECOMMENDED.**
The lane opens its OWN `createDurablePublicClient` over the bindings it already holds, with the
SAME T2 history-authentication handoff `plan-edit-host.mjs:113` uses
(`historyAuthentication: { signedOperationIds: [] }`, which makes T2 verify every op with the
current key), captures the generation the stage passed, and reads the PRODUCT'S OWN projector twice
over that one object. Every released lane on this page already opens its own bindings off the one
era client (`machine-settings-host.mjs:72`, `food-host.mjs:85`, `sleep-host.mjs:106`), so this is
lane code and not a product byte.

| measured | value |
|---|---|
| durable loads on a healthy history | **1** |
| its current view against two-read ROUTE 0's | **byte-equal** |
| its pending view against ROUTE 0's | **byte-equal** |
| the two views it returns | **DIFFER**, so a route that returned one view twice could not have passed |
| over B2's changed history | **REFUSED**, `LOCAL_HISTORY_IDENTITY_UNPROVEN`, the host's own code |
| what it hands the lane on that refusal | **nothing at all**: `null`, so there is no view to paint by accident |
| product bytes | **0** |

**Its cost, named and not hidden.** A SECOND public client beside the host's, over the SAME bindings
and the SAME era: not a second durable client, not a second era, and not a second replay
implementation. It also carries the projector-instance cost round 1 already named, and the mistake
round 1 already paid for: `f2-tag-adapter.cjs`'s export is a FACTORY, so a lane that hands on the
MODULE gets `validateTags === undefined` and fails by name with `PLAN_EDIT_TAGS_INVALID`. Whoever
builds B12 gets that wrong once.

**ROUTE 2, THE SEALED ALTERNATIVE. COUNTED, NOT ESTIMATED.**
A `readBoth(currentDate, pendingDate)` member on `plan-edit-host.mjs`, returning both dated views off
ONE `lane.reopen()`. Both anchors proved unique, the patch applied in memory, the result proved to
parse, the file left byte-unchanged:

| file | added | removed | note |
|---|---|---|---|
| `rebuild/m3/w6/host/plan-edit-host.mjs` | **13** | **0** | on 13.12's ZERO-BYTE list. It would leave that list by name. |

**ROUTE 3, TWO HOST READS.** Zero bytes, authenticated, 2 loads, two different generations.
**Refused by Astra's own sentence** and not recommended; it is listed so the PM sees what the
current spec would get by default.

**RECOMMENDATION: ROUTE 1B.** Zero bytes, ONE authenticated generation, views byte-equal to the
host's, and a refusal that is the product's rather than the lane's. ROUTE 2 remains on the table at
13 added lines if the PM would rather have one public client on the installation than two, and this
brief will take that instead without argument. **ROUTE 1 is off the table, by measurement.**

**WHAT B12 OWES EITHER WAY, and it is Astra's own correction.** `EW-13c` and `E-R35`'s half of
`EW-14` gain **B2's negative control**: over a history whose stored edit has been changed under its
commitment, the two dated views must REFUSE, by name, with
`LOCAL_HISTORY_IDENTITY_UNPROVEN`, and the refusal envelope the card paints must be the host's
`a refusal is not an absence` state. A row that only ever reads a healthy history cannot fail for
this defect, which is exactly how round 1 recommended a route that had it.

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

**ROUTE 1, THE ZERO-PRODUCT-BYTE ROUTE. MEASURED, AND NOT RECOMMENDED (see the recommendation
below; round 1 headed this paragraph RECOMMENDED and then recommended ROUTE 2 four paragraphs later,
which is N6's contradiction and it is removed here).**
A SECOND era, opened over the SAME IndexedDB with the label this adoption needs. Measured, with a
real second workout driven to a real stored Start:

```
ROUTE 1: a SECOND era on the SAME IndexedDB              opened
  it was opened with planBasis                           EW2B-ERA-LABEL-TWO
  the label its stored Start carries                     EW2B-ERA-LABEL-TWO
  session-start operations on disk now                   2
```

**Its cost, named, and WHAT THE CELL ACTUALLY DROVE (N6).** What this cell drove is **SEQUENTIAL ERA
REOPENINGS** over one installation, the first session FINISHED before the second card opened. It is
**not** a proof that two durable clients can be live at once, and no sentence here claims it: a
second card opened before the first session is finished refuses
`WORKOUT_HISTORY_RECONCILIATION_REQUIRED`, which is measured, is the product behaving correctly, and
is a sequencing rule the lane would have to keep. The cost is therefore a second era object and a
sequencing obligation, not a byte.

**ROUTE 2, THE SEALED ALTERNATIVE. COUNTED, NOT ESTIMATED.**
Take `planBasis` as a per-call option on `createGymHost` and prefer it over the era's. Two shapes,
both counted by `ew2b-r41-d4-planbasis.mjs` at this head:

| shape | file | added | removed | net | note |
|---|---|---|---|---|---|
| **ROUTE 2B** (N6, and it is the smaller) | `rebuild/m3/w6/local/today-bindings.mjs` | **1** | **1** | **0** | the RESOLVER LINE only: `planBasis: options.planBasis || planBasis`. The destructure is left alone. `options` is `createGymHost`'s own parameter and the resolver line is inside that function's body, proved by the cell and not assumed. Parses. |
| ROUTE 2 (round 1's) | `rebuild/m3/w6/local/today-bindings.mjs` | 2 | 2 | 0 | destructure AND resolver. Both anchors unique. Strictly larger for the same contract. |

Either way that file is on 13.12's ZERO-BYTE list and would leave it by name.

**ROUTE 3, CHANGE THE ERA'S DEFAULT.** Zero bytes and wrong: the label would change for every lane on
the installation, not for this adoption. Listed and rejected.

**RECOMMENDATION: ROUTE 2B, and this is the one place this brief recommends spending a sealed byte.**
ROUTE 1 works and is measured, but it makes the Start label depend on WHICH era object the card was
opened from, which is precisely the class of defect `E-R34` and `E-R38` F10 exist to stop: the stored
Start must assert the basis that was actually prescribed from. **One changed line in one file**,
counted, is a smaller risk than a lane that has to keep two era objects in the right order for the
stored Start to be true. **The PM rules; if he refuses, ROUTE 1 is executable today and B13 takes it
with the sequencing rule written into the row.**

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
D11 durable loads taken by ONE read, at the boundary       1
M6 a TWO-GENERATION read, durable loads                    2
  it still answers, which is why the COUNT is the row      true
```

**THE COUNTER MOVED, AND N5 IS WHY.** Round 1 counted `repository.load` on a lane object the CELL
built, while `all()` reached the host's OWN repository outside that counter: a build that
reintroduced `lane.all()` could have passed the row. The counter now sits at the **shared durable
boundary**, the era client's `hostBindings`, so every load the host takes, direct or through
`all()`, is counted once. Asserted `=== 1`.

**AND THE TWO-GENERATION MUTANT NOW FAILS, which is ND1's second clause.** `M6` takes the context
off one load and the ROWS off `lane.all()`, which is round 7's own shape and exactly what D11
forbids. It takes **2** loads and still answers, and that is the point: the answer looks right, so
the COUNT is the only thing holding the row.

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
returned beside unmatched notes, that the sentence is present **and is not empty**, and that the
sentence is ABSENT when nothing is unmatched. It fails for the defect in three separate ways, each
measured above.

**THE SENTENCE ASSERTION WAS TOO WEAK AND N5 IS WHY.** Round 1 asserted
`typeof answer.notice === 'string'`, which an EMPTY notice satisfies, so a silent card answer could
have carried the row. The card call now asserts the sentence as a **LITERAL**, D14's way, and checks
the prototype's exported constant against that same literal, so a prototype that renames or empties
its constant cannot carry the row with it.

**WHAT THIS PROTOTYPE DOES NOT PROVE.** No sealed bundle through the real port: the admitted state is
the PE16-style fixture, installed directly. **The card is section 4.6's, and after B1 it is no longer
"nobody has drawn it": the read, the block, the draft and Save are executed there through the real
patched product modules. What is still NOT executed is `mountGym` itself, and E-R40 condition 2
stays OPEN for that reason.** `ND2` names the controls this prototype still owes `EW-25` and section
11 carries it verbatim.

---

### 4.6 B1: THE ANSWER HAS TO REACH THE CARD, AND WHAT THAT COSTS

**Cell: `ew2b-b1-card-handoff.mjs`. RED first at the build base, committed red; then GREEN on the
correction. Farm exit 0, PC exit 0.**

### 4.6.1 What round 1 specified, and what it did

Round 1 said hunk E was a call replacement and kept `machine-settings-view.mjs` at zero bytes.
Linked at the base with hunk E's own SHAPE 2 pointing at `ew2b-r42-proto-notice.mjs`, over the REAL
`machine-settings-host.mjs` holding `Seat=4/Pause` on `press-old` and an orphan `Pad=2/Slow` on
`row-old`, with the shipped template's own gym markup in jsdom:

```
the cache entry latest, its own members              code, notice, ok, record, untranslated
the block the athlete sees                           "Your settings for this machine No settings saved yet. Machine settings"
the draft the editor opens                           {"rows":[{"name":"","value":""}],"cues":""}
the one sentence is on the card                      false
what Save wrote                                      {"exercise_id":"file-press","cues":"New cue"}
what the card reads back for this lift               {"exercise_id":"file-press","cues":"New cue"}
```

`latestNoteOn` returns the ANSWER; the cache, `renderBlock` and `draftFrom` all consume a bare
RECORD. So the block says the empty state, the sentence is nowhere, the editor opens BLANK, and one
new cue typed over that blank draft **supersedes `Seat=4` without ever showing it to him.** The
stored operation is not deleted and the control says so, but the setting is gone from every read
the athlete has. **B1 stands and is not disputed.**

### 4.6.2 The corrected handoff, and every consumer it is permitted to change

Four files, named, with no fifth. Each patch applied in memory, counted by line diff, proved to
parse, and the files on disk proved byte-unchanged.

| # | file | what it does | added | removed |
|---|---|---|---|---|
| **E1** | `gym-settings-lane.mjs` | the READ becomes the resolver, and the CACHE stores `latest: answer.record` beside `unmatched: answer.untranslated.length > 0`. The lane stores a BOOLEAN, never a sentence | **5** | **2** |
| **E2** | `gym-app.mjs` | the WORD itself, its entry in `SETTINGS_COPY`, and the one line of `settingsPaint` that hands the notice to the block | **8** | **1** |
| **E3** | `machine-settings-view.mjs` | `renderBlock` takes `notice` and draws one line under the settings. **THIS FILE LEAVES 6.1's ZERO-BYTE LIST BY NAME** | **10** | **1** |
| **E4** | `design.cjs` | the sentence DECLARED preview-owned, beside the other machine-settings sentences | **1** | **0** |

**WHY THE WORD CANNOT LIVE IN THE RESOLVER, measured rather than assumed.** `design.cjs` binds
preview-owned copy from `VIEW_SOURCES`, and that list is pinned by name in `test/design.test.cjs`,
which this lane does not own. `machine-note-identity.mjs` is not on it and cannot be added to it
here. So the resolver's `UNMATCHED_NOTICE` stays what it is, the PROPOSED sentence this brief
carries for the owner, and **the product's word lives in `gym-app.mjs`**, exactly like every other
sentence on this card.

**AND E4 IS AN ORDER, NOT A GATE.** Measured: the design binding iterates the DECLARED lists and
asserts each declared sentence is IN a view source; it does NOT iterate the view for undeclared
sentences. A declared sentence missing from the view fails the gate; an undeclared sentence in the
view passes it. So a builder who skips E4 ships an unchecked sentence and no row fails, which is
why E4 is written here as a step and `EW-25` must assert it.

### 4.6.3 The corrected handoff, executed

```
the cache entry, its own members                     latest, state, unmatched
the block the athlete sees                           "Your settings for this machine Seat4 To remember: Pause Machine settings Some notes you saved could not be matched to a machine after your import."
the draft the editor opens                           {"rows":[{"name":"Seat","value":"4"}],"cues":"Pause"}
the one sentence is on the card                      true
what Save wrote                                      {"exercise_id":"file-press","settings":[{"name":"Seat","value":"4"}],"cues":"New cue"}
what the card reads back for this lift               {"exercise_id":"file-press","settings":[{"name":"Seat","value":"4"}],"cues":"New cue"}
the pre-import note on disk is byte-unchanged        true
the note he just saved is recorded as                native
```

The note is SHOWN, the sentence comes WITH it, the draft is seeded from what he saved, and Save
keeps `Seat=4` while adding the cue.

**ONE MEASURED CORRECTION THIS CELL OWES AGAINST ITSELF.** It first asserted that the note read back
after Save was still `saved_in: 'document'` and exited 1. The CELL was wrong: the correction he just
saved is a NEW note written under the lift he is standing at, so it is `native` by construction, and
the pre-import document note it carried forward is byte-unchanged on disk. The product was right;
the assertion was corrected rather than quietly removed.

### 4.6.4 What 4.6 does NOT execute, said plainly

`mountGym` is not mounted. What is linked and driven is the patched `gym-settings-lane.mjs`, the
patched `machine-settings-view.mjs`, the real host over a real durable client, the real coach
producer and the shipped template's own markup. `gym-app.mjs`'s own two lines (E2) are COUNTED and
PARSED, not mounted. **E-R40 condition 2 therefore stays OPEN** and is B7's, exactly as 6.2 says,
and `ND3` keeps the linked-card requirement open until it is executed.

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

**THE ORDER:** section 3.1, measured, **WAITING ON THE PM**. Step **B12**. Round 1's recommended
ROUTE 1 is **WITHDRAWN** by B2 and the candidate is **ROUTE 1B**, which keeps the host's own
`lane.reopen` history-authentication boundary.
**THE ROW:** `EW-13c`, plus `E-R35`'s half of `EW-14`: the second open's state must EQUAL the
companion's own read, taken from one generation, **AND**, over a history whose stored edit has been
changed under its commitment, both dated views must REFUSE by name with
`LOCAL_HISTORY_IDENTITY_UNPROVEN` and the card must paint the refusal envelope. Measured red today:
ROUTE 1 answers that history with the edit on the wrong lift.

> **D4** - Name and authorize the per-adoption Start.plan_basis handoff through the shared gym installation; createGymHost ignores a per-call planBasis option, so the current zero-byte today-bindings contract cannot carry the proposed changing fold label by the stated route.

**THE ORDER:** section 3.2, measured and UPHELD by execution, **WAITING ON THE PM**. Step **B13**.
The candidate is **ROUTE 2B**, one changed line, which is smaller than round 1's two and carries the
same contract.
**THE ROW:** `EW-14`'s stored-field assertions, which name `plan_basis` by name and fail for a changed
card that leaves the stored Start wrong.

> **D5** - Wire and test every required planRoster history consumer with exact lift attribution and counts, including past/current/pending creations, tombstoned creation, removal and same-label re-add; a roster key existing in a fixture is not a history read.

**THE ORDER:** step **B9**, and the roster is asserted from the PERSISTED generation, never from a
printed union. `ew2r7-d9-labels.mjs` already measured that no cell has persisted the union.
**EVERY CONSUMER, NAMED HERE RATHER THAN PROMISED LATER (N2).** `planRoster` does not exist at any
head, so these are the four readers hunk **C** must create and wire, each with its own attribution
row, and no fifth may appear without returning to the PM:
1. **the pristine replay base** in `source-admission.mjs`, which must never hold a row a retained
   add creates (`E-R31`);
2. **the reserved-id union** handed to the minting boundary, which is the UNION over every retained
   edit including tombstoned and removed creations (`E-R31`'s fold horizon);
3. **`planIdCollisions`**, the guard, which reads the roster and not a name list (`E-R32`);
4. **the admission `view`**, where the roster is PUBLISHED so a reload reads the same rows the fold
   used.
**THE ROW:** `EW-22`, with the attributed count added, red today with `PLAN_EDIT_ID_REUSED`. The row
asserts, for ONE generation read back off disk: past, current and pending creations counted and
attributed to the lift that made them; a tombstoned creation still in the roster; a removal; and a
same-label re-add that mints a new id and does not inherit the retired lift's rows.

> **D6** - Specify the admission refusal envelope/reason for occupied file handles consistently with EW-23, and place slugOf/reserved-id minting on a permitted import boundary; E6 forbids the released setup-model import that 13.4's direct provider call assumes.

**THE ORDER:** step **B9**, and the envelope is asserted as PUBLISHED by admission, not as a pure
function's return.

**THE ENVELOPE, SETTLED HERE AND NOT PROMISED (N2).** Spec 13.4 names
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED` with `field: exercise_id` and `EW-23` names
`PLAN_EDIT_FILE_HANDLE_OCCUPIED`. They are not alternatives and this brief settles which is which:
**admission publishes `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`** in its issue list, because that is the
vocabulary the import screen already draws from and `EW-20` already measures what it draws for a
`field` it has never seen; **`PLAN_EDIT_FILE_HANDLE_OCCUPIED` is the EDITOR's refusal** on a new
identity aimed at an occupied handle, raised before anything is written. A build that publishes the
editor's code from admission, or admission's from the editor, fails the row.

**THE MINTING BOUNDARY, MEASURED (`ew2b-n-register.mjs`).** It is `source-admission.mjs`, which
**already** imports `setup-model.mjs` for `createCleanInitState`; adding `slugOf` to that one import
line costs **1 changed line and 0 added**. The today PAGE may not do it: 2.2's `E6` row keeps
`setup-model.mjs` off the lane's MAY-IMPORT list, and the measured list of today-page modules that
import it is `setup-app.mjs, setup-commands.mjs, starter-week.mjs, today-entry.mjs` and no lane
file. So 13.4's "direct provider call" is legal at admission and illegal in `edit-week-lane.cjs`.
**THE ROW:** `EW-23`, both directions, red today (`idCollisions` returns `[]` for the equal label and
`["press"]` for a valid rename), plus the PUBLISHED envelope asserted by code and `field` off a real
admission, and a mint taken through the admission boundary rather than a pure function.

> **D7** - Wrap setup-tag projection, validation and detached fold execution at admission as well as the editor; assert the defined default for raw throws and retain diagnostic detail internally, since the host's save-stage catch does not surround admission.

**THE ORDER:** step **B10**, and the wrapper covers PRE-FOLD projection as well as the detached fold,
which is the half 13.10's narrowing left open.
**THE ROW:** `EW-17d`'s admission control, asserting the named default over a raw `RangeError` that
today escapes with no code.

> **D8** - Complete E-R34's state table for pending-only edits, plan_edit_basis/default failures and failed authentication; show retention/cause claims only when proved, and replace C2's unsupported assertion that a missing correspondence means a different exercise copy.

**THE ORDER:** section 8 corrects the sentences, **section 8.3 COMPLETES the state table with the
three missing states, each with its input and its output**, and section 8.2 states the rule that
governs them. Every sentence there is PROPOSED copy and the owner's to overrule.
**THE ROW:** `EW-14`'s four clauses, plus a new assertion that the sentence shown matches the state
reached, so a card that shows C1 on a NOT TRANSLATED refusal fails, **plus one input/output row per
missing state: pending-only edits, a `plan_edit_basis` or default failure, and a failed
authentication.** No retention or proven-plan claim is asserted in a state whose evidence the row
does not actually read, which is the half round 1 left open.

> **D9** - Correct evidence/count labels: 11 executable cells include the 3 prototypes; the loader neither prints nor asserts its net count; J1 does not execute patched host/Start or prove three-copy identity; P2 prints a desired union rather than persisting it; four acceptance rows were added, not three.

**THE ORDER: THIS ONE IS ALREADY DISCHARGED and this brief only restates it.** Spec 14.7 corrected
every label in place, measured by `ew2r7-d9-labels.mjs`, and Astra's L2 round checked the corrections
independently and called them correct. The brief inherits the corrected counts and adds nothing.
**THE ROW:** none is owed. D9 is a labelling debt, not a product defect, and inventing a row for it
would be the kind of paper answer `D-EW2-FINAL` forbids.

> **D10** - Carry the host-day Start/readiness choice into the build/S10 brief and execute a stored Start across midnight; a 60-second interval is not a deadline, 13.7 contains no promised Start readiness check, and EW-19's visibility callbacks cannot prove either claim.

**THE ORDER, CORRECTED (N1).** Round 1 wrote "none in EW2", and `:621` (6) names D10 a BUILD ORDER
with a row that can fail for its defect. It gets one here.

- **THE OWNER OF THE CHOICE IS THE S10 BRIEF**, by `:621`'s own routing and 13.13's second named
  debt. That does not excuse EW2 from a row, because EW2 is what STORES the Start.
- **THE RULE THIS BRIEF ADOPTS FOR ITS OWN ROW, and it is PROPOSED:** the stored Start carries the
  host day it was PRESCRIBED from, read at the moment of storing and never from a value the card
  closed over when it opened. A card that was opened before midnight and stores a Start after it
  must either re-read the host day and store the NEW day, or refuse BY NAME with
  `PLAN_EDIT_DAY_TURNED`. It may not store yesterday's day silently. A 60 second poll is how the
  screen NOTICES the turn; it is not a deadline and nothing may be asserted about it.
- **THE JOURNEY:** one installation, a card opened on day D, the live instant moved past midnight,
  a real Start driven to a real stored operation, and the stored `local_date` and `plan_basis` read
  back off disk after a reopen.

**THE ROW:** `EW-14`'s stored-Start assertions, extended by step **B11** with that midnight
crossing, and `EW-18`'s `PLAN_EDIT_DAY_TURNED` for the refusal arm. **NOT MEASURED BY THIS ROUND:**
no cell here drove a midnight crossing, so the row is ordered and red by construction, and section 9
says so.

> **D11** - Resolve machine notes and their admitted correspondence from one authenticated generation; latestNoteOn currently loads a generation and then all() loads another, so bind both to one snapshot or prove and retry a generation mismatch without changing the zero-byte hosts.

**THE ORDER:** step **B6**, DONE in the prototype: section 4.4, ONE load, measured and asserted, with
no host or coach byte, **and the counter now at the shared durable boundary so a load taken through
`all()` counts (N5)**.
**THE ROW:** `EW-25`, with the load count asserted `=== 1` AT THE BOUNDARY, and a two-generation
mutant that takes 2 and must fail it.

> **D12** - Enforce 14.2's any-untranslated-note refusal before returning a matched record, and assert a generation containing both a resolved native note and an unresolved document note; the prototype currently returns ok=true with untranslated=["press-old"].

**THE ORDER: `:621` (5) OVERRULES THE REMEDY SHE NAMES, and this brief says so plainly.** She asked
for the refusal to be enforced before a matched record is returned. The PM AMENDED 14.2 instead:
never silent AND never blocking, because one orphan note must not take every lift's note away
(`E-R34`'s reasoning applied to notes). Her DEFECT is accepted whole: the old behaviour was silent.
Section 4 is the answer.
**THE ROW:** `EW-25` arm 1, which fails when the sentence is removed (mutant M1) and when the keys are
dropped (M5).

> **D13** - Carry the explicit gym-app hunk E authorization and the new resolver's path, export and browser contract into the build brief, and execute the linked card path; P5 requests a default export absent from the supplied prototype and its parse-only check accepts a missing module or missing method.

**THE ORDER:** section 6 carries the authorization and the re-measured size; **section 4.6 carries
the module contract, the handoff and every consumer file permitted to change**; step **B7** executes
it. The export contract is fixed here: the resolver's module exports **NAMED** `latestNoteOn`, and
the card imports it by name through the holder's own dynamic-import idiom. There is no default
export, which is the mismatch that made P5 exit 1 on Astra's own run. **And the export name was
never the whole of it (B1): the answer's SHAPE has to fit the cache, the block and the draft, and
round 1's hunk did not.**
**THE ROW:** `EW-25`'s card half, and it must EXECUTE the link, not parse it: mutants that point the
card at a missing module or a missing method must go RED, which is precisely what `M41` and `M42`
did not do, **and the row must carry the Save continuation: a resolved note, one new cue typed over
the seeded draft, and the saved setting still there afterwards.**

> **D14** - Make EW-25 assert saved_in=document, the literal MACHINE_NOTE_TARGET_UNTRANSLATED code, and the rejection's untranslated keys independently of prototype exports; P4 stays green when each of those clauses is changed separately.

**THE ORDER:** step **B6**, DONE: section 4.4 asserts all three as literals, and mutants M3, M4 and M5
kill them.
**THE ROW:** `EW-25`.

---
## 6. THE SEALED BUDGET, AT THE MEASURED BASE

**THIS SECTION IS NOT "FINAL" AND ROUND 1 SHOULD NOT HAVE SAID SO (N7).** It is the budget at the
base the cells actually measured, named in 6.3, and 6.3's own instruction to re-count at whatever
base the build starts from is what makes it provisional. **COUNTED** below means a line diff this
round or Astra's round ran; **ESTIMATE** means a number nobody has diffed yet. No estimate is added
into any total, and there is no total.

### 6.1 Every sealed file and every hunk

| file | hunk | size | counted? | authority |
|---|---|---|---|---|
| `rebuild/m4/workout/plan-edit-model.cjs` | **H1** `foldPlanEditsAt` and the `inspect()` factoring | no completed hunk exists at any head; its export is absent at HEAD | **ESTIMATE**, and step **B8a** is where it is written | 4.3 ruling 2, `E-R4` |
| `rebuild/m4/workout/plan-edit-model.cjs` | **H2** the ONE named translation boundary | **24 added (9 comment), 2 removed, net 22** | **COUNTED**, by this lane and independently re-diffed by Astra twice | `E-R30` |
| `rebuild/m4/workout/plan-edit-model.cjs` | **H3** `reserved_ids` on `result()` | about 4 added, 1 changed | **ESTIMATE** | `E-R32` |
| `rebuild/m3/w6/local/source-admission.mjs` | **A** the per-capture fold call and three re-pointed checks | no implemented per-capture hunk to diff; it depends on **H1** and on 3.5's F2 package | **ESTIMATE** | 4.3 ruling 1, `E-R16 PRIME` |
| `rebuild/m3/w6/local/source-admission.mjs` | **B** the `plan` class replay family plus `E-R33`'s zero-capture proof | v4's number plus the zero-capture proof, neither diffed | **ESTIMATE** | 4.3 ruling 0, `E-R33` |
| `rebuild/m3/w6/local/source-admission.mjs` | **C** the history roster, `planIdCollisions`, and `slugOf` on the existing `setup-model.mjs` import line | about 6 to 10 added for the roster and 8 to 12 for the guard, **ESTIMATE**; the import line is **1 changed, 0 added, COUNTED** | mixed, and said so | `E-R31`, `E-R32`, D6 |
| `rebuild/m3/w6/local/source-admission.mjs` | **D** the recorded `lift_correspondence` member on the `view` at `:781` | **1 added, 1 removed, one hunk** | **COUNTED**, by Astra independently | `E-R30` |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | the ONE added export | export absent at HEAD, nothing to diff | **ESTIMATE**, step **B9a** | `E-R17 PRIME` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | `createEditWeekEntry` | a named allocation, not a patch | **ESTIMATE** | 3.3 line 2 |
| **`rebuild/m3/w7-preview/today/today-lanes.cjs`** | **NEW IN THIS ROUND (N4).** The lane's wiring and the MOVED adoption gate. Round 1 left this file out of 6.1 entirely although spec 3.3 allocates it | the file does not exist until the Today split seals | **ESTIMATE**, step **B11** | spec 3.3, `E-R34` |
| `rebuild/m3/w7-preview/today/edit-week-lane.cjs` | new file | new file | n/a | `E-R12`, `E-R34`, `E-R36` |
| **the note resolver, new file** | `machine-note-identity.mjs`, NAMED export `latestNoteOn` | new file. **It owns NO WORD:** see 4.6.2 | n/a | `E-R38` F9 as amended by 14.2 and by `:621` (5) |
| `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` **(NOT `gym-app.mjs`: see 6.3)** | **E1** the read AND the cache | **5 added, 2 removed** | **COUNTED**, 4.6.2 | **`E-R40`, GRANTED on three conditions** |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | **E2** the word, its copy-table entry, the `renderBlock` call | **8 added, 1 removed** | **COUNTED**, 4.6.2 | `E-R40`, and B1 |
| **`rebuild/m3/w7-preview/today/machine-settings-view.mjs`** | **E3** `renderBlock` draws the sentence. **THIS FILE LEAVES THE ZERO-BYTE LIST** | **10 added, 1 removed** | **COUNTED**, 4.6.2 | B1, and it is the PM's to grant |
| **`rebuild/m3/w7-preview/today/design.cjs`** | **E4** the sentence declared preview-owned | **1 added, 0 removed** | **COUNTED**, 4.6.2 | B1, and it is the design lane's file |
| `.github/workflows/rebuild.yml` | the new suite registration | a PM-owned allocation, no hunk to diff | **ESTIMATE**, and it is the PM's | R1 N4 |

**E3 AND E4 ARE NEW COSTS THIS ROUND ADMITS, not costs it discovered a way around.** Round 1 kept
`machine-settings-view.mjs` at zero bytes and never mentioned `design.cjs`. B1 measured that the
sentence cannot reach the athlete without both. They are named here so the PM prices them, and
neither is moved by implication.

**THE ZERO-BYTE NAMES THAT STAY ZERO, by name, measured and not hoped:** `plan-edit-host.mjs`,
`plan-edit-commands.cjs`, `today-bindings.mjs`, `workout-host.mjs`, `host-bindings.mjs`,
`rebuild/coach/**` including `machine-settings-commands.cjs`, `machine-settings-host.mjs`,
`exercise-catalogue.mjs`, `setup-model.mjs`, `setup-host.mjs`.
**`machine-settings-view.mjs` HAS LEFT THIS LIST** (E3), and it is the one name round 1 had on it
that this round takes off.

`ew2b-r42-proto-notice.mjs` re-proves the note lane's half of that list: the resolver calls the
coach's `latestFor` and `machineSettingsIn` and the host's `repository`, and edits none of them.
`ew2b-b1-card-handoff.mjs` re-proves it again through a driven card path, and proves every file it
patched is byte-unchanged on disk afterwards.

### 6.2 What E-R40 changes

`:621` (3) GRANTS hunk E as a named budget item on three conditions.

| condition | state |
|---|---|
| 1. RE-MEASURED at the build base | **DONE, and it must be done AGAIN at whatever base the build starts from** (6.3). Round 1 marked this DONE without that second half, which N7 is right to call a base-specific number dressed as a final one |
| 2. EXECUTED on a linked card path before acceptance | **PARTLY DONE, and OPEN.** `ew2b-b1-card-handoff.mjs` drives the patched lane, the real view, the real host and Save through the shipped markup in jsdom. It does NOT mount `mountGym`. The condition stays OPEN, it is step **B7**'s, and it is a condition of ACCEPTANCE, not of the brief |
| 3. rides EW2's own reseal child and never lands alone (`:582`) | carried into step **B7** and into section 7's review plan |

`gym-app.mjs` therefore leaves 13.12's zero-byte list by name, and so, at the base, do
`gym-settings-lane.mjs`, `machine-settings-view.mjs` and `design.cjs` (4.6.2). This brief moves no
file off that list by implication: each is named, counted and put in front of the PM.

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

**A WARNING FOR WHOEVER WRITES B7, AND IT IS NOW A MEASURED ONE.** The base has moved twice under
this brief: `e08bc11c`, then `cc87c072`, and by loop round 1 `rebuild/c-today-split-build` was at
`c38ed5fb` with `2df2f32d` and `ad482f21` in between. **Hunk E must be re-counted at the base the
build actually starts from**, and both cells that touch it take that root or that ref as an argument
so it can be.

**WHAT DID NOT MOVE, measured by `ew2b-b1-card-handoff.mjs` at `cc87c072` against the checkout it
runs in:** `machine-settings-view.mjs` and `machine-settings-host.mjs` are BYTE-IDENTICAL at the two
heads, and `git diff --stat cc87c072 c38ed5fb` over `gym-app.mjs` and `gym-settings-lane.mjs` prints
nothing. So every count in 4.6.2 and 6.3 holds at `cc87c072` and at `c38ed5fb` alike. That is a fact
with a shelf life: it is true of these four files at these two commits and of nothing else.

### 6.4 What E-R41 would add, under each alternative

| handoff | the zero-byte candidate | the sealed alternative | recommended |
|---|---|---|---|
| **D3**, the dated views | **ROUTE 1B**: 0 bytes; a second PUBLIC client over the same bindings; 1 authenticated load; refuses a changed history with the host's own code. (**ROUTE 1 is WITHDRAWN by B2**) | ROUTE 2: `plan-edit-host.mjs` **+13 added, 0 removed**; that file leaves the zero-byte list | **ROUTE 1B** |
| **D4**, `Start.plan_basis` | ROUTE 1: 0 bytes; a second era object and a sequencing obligation | **ROUTE 2B**: `today-bindings.mjs` **1 changed line, net 0**; that file leaves the zero-byte list | **ROUTE 2B** |

If the PM grants both recommendations, the sealed budget grows by **1 changed line in one further
file** (`today-bindings.mjs`) and by nothing else. If he prefers the sealed alternative for D3 as
well, it grows by 13 added lines in `plan-edit-host.mjs` on top of that.

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
   missing method and both stayed green. **And a linked READ does not count either (B1): the
   acceptance path is read, block, draft AND Save, on one lift, with the saved setting still there
   at the end.**
10. **E-R39**: no EW2 product byte until the PM has ruled on the second admission. Section 0.
11. **E-R41**: B12 and B13 do not start until the PM has ruled on both handoffs. Section 3.
12. **NEW THIS ROUND, from B2**: no row that reads a plan history is accepted without its
    NEGATIVE control, a history changed under its commitment, refused by name. A route that only
    ever reads a healthy history proves nothing about authentication.
13. **NEW THIS ROUND, from B1**: no sentence reaches the athlete from a module `design.cjs`'s
    `VIEW_SOURCES` cannot see. The resolver carries the PROPOSED wording; `gym-app.mjs` owns the
    word that ships.

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

### 8.3 The three situations we had not written down, and what we would show you

A reviewer was right that we had named these three and never said what happens in them. Each row is
what the phone READS and what it SHOWS. All of it is PROPOSED and yours to overrule.

| what the phone finds | what the screen says | what Start does |
|---|---|---|
| **Your changes are saved but none of them has started yet.** You changed next week and next week has not begun | Today shows the plan you are on now, unchanged, and says: *"Your changes start on Monday."* with the real date. Nothing is hidden and nothing is claimed to be applied | Start is available and stores the plan you are actually on today |
| **We could not work out which plan your changes were made against, or working it out failed.** The record that says which plan a change was measured from is missing or unreadable | *"We could not apply your saved changes, so this is the plan we can show you with confidence."* and, on its own line, *"Nothing you saved has been removed."* We do NOT say why, because we do not know why | Start is available and stores the plan it can prove, truthfully labelled as that plan |
| **This phone could not prove that its own saved record is untouched.** The check that says a record is the one you saved did not pass | *"Your saved changes could not be read on this device."* and nothing else: no list, no count, no reassurance about what is still there, **because a phone that cannot prove the record cannot honestly promise anything about its contents** | Start is available on the plan the phone can prove. If it cannot prove that either, Start says so and records nothing |

*(The third row is the one a reviewer pushed hardest on, and he was right. Our older sentence would
have promised "nothing you saved has been removed" in exactly the situation where we cannot see what
was saved. We no longer say it there.)*

### 8.4 The three questions only you can answer

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
- **No browser, no phone, no Windows suspension, and NO `mountGym`.** Section 4.6 drives a jsdom
  document, the shipped template's own gym markup, the patched `gym-settings-lane.mjs`, the patched
  `machine-settings-view.mjs`, the real `machine-settings-host.mjs` and Save. It does NOT mount the
  card, so `gym-app.mjs`'s own two lines (E2) are counted and parsed and not executed, and E-R40
  condition 2 stays OPEN. `EW-16` is untouched.
- **No midnight crossing.** D10's row is ordered in section 5 and red by construction; no cell of
  this round drove a stored Start across a day turn.
- **No real admission behind section 4.6.** Its admitted state is installed directly through the
  host's own repository, as every farm-capable cell's is.
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
TZ=America/New_York`. `ew2b-r42-proto-notice.mjs` and `ew2b-support.mjs` are imported and never run
alone. The three E-R39 cells additionally need the live `node_modules` junctions (spec 14.8) and the
real port, so they run on the PC only. `ew2b-b1-card-handoff.mjs` needs `jsdom` and takes the build
base as a git ref argument (default `cc87c072`); it extracts that ref's two card files with
`git show` and writes its patched copies to the OS temp directory only.

| file | what it proves | farm | PC |
|---|---|---|---|
| `ew2b-r39-probe.mjs` | the open question: five journeys and a control, printed and not prescribed | **cannot: it seals** | **exit 0** |
| `ew2b-r39-second-admission.mjs` | **E-R39 ANSWERED YES**, with the refusals and the success asserted by name, and the single derived record shown to be replaced | **cannot: it seals** | **exit 0** |
| `ew2b-r39-retention.mjs` | what survives a second admission: every selection keeps its own basis and identity review | **cannot: it seals** | **exit 0** |
| `ew2b-r40-hunk-e-base.mjs` | hunk E re-measured at the spec head AND the build base, both shapes counted, nothing written | **exit 0** (both roots) | **exit 0** (both roots) |
| `ew2b-r41-d3-generation.mjs` | D3's first clause upheld and its second narrowed; ROUTE 1 at one load with byte-equal views; ROUTE 2 counted at 13 lines | **exit 0** | **exit 0** |
| `ew2b-r41-d4-planbasis.mjs` | D4 upheld through a real stored Start; ROUTE 1 executed; ROUTE 2 counted at 2 lines | **exit 0** | **exit 0** |
| `ew2b-r42-proto-notice.mjs` | the amended rule itself, NEW CODE, zero product bytes, one authenticated generation | imported | imported |
| `ew2b-r42-journeys.mjs` | both arms, five mutants each killing a journey, D11's one load COUNTED AT THE SHARED DURABLE BOUNDARY, a two-generation mutant that takes two, and D14's three literals | **exit 0** | **exit 0** |
| **`ew2b-b1-card-handoff.mjs`** | **NEW, loop round 1.** B1 reproduced at the build base through a linked lane, view, host and Save; then the corrected handoff counted across four named consumers and re-driven GREEN; and who owns the word | **exit 0** | **exit 0** |
| **`ew2b-b2-route1-auth.mjs`** | **NEW, loop round 1.** B2 reproduced; ROUTE 1 pinned by name as unauthenticated; ROUTE 1B measured at one authenticated load, byte-equal views and the host's own refusal | **exit 0** | **exit 0** |
| **`ew2b-n-register.mjs`** | **NEW, loop round 1.** Spec 5's table counted (27 ids, so B0 writes 28), and the permitted `slugOf` minting boundary measured at 1 changed line | **exit 0** | **exit 0** |
| `ew2b-support.mjs` | the scaffold `ew2b-b2-route1-auth.mjs` needs: ONE era client, its ONE bindings object handed back, every durable load counted | imported | imported |

### 10.1 Byte-identity on the two systems, hashed on both rather than claimed

Round 1 wrote "every farm-capable cell's output is byte-identical on the two systems". **That is
true of six of the seven and FALSE of the seventh**, and round 1 should have checked it. At the head
this round pushed, each cell's stdout was written to a file on each system and hashed there
(`sha256sum` in the farm scratch, `certutil -hashfile` on the PC):

| cell | sha256 of its stdout, BOTH systems |
|---|---|
| `ew2b-r41-d3-generation.mjs` | `f37b6deba0545d0f75e458328a9191ea49e21894e22187e2d53a87b76872bb85` |
| `ew2b-r41-d4-planbasis.mjs` | `8286cd9d8f10eb8abd0b6fcd49b3456b1c9d7c2f7f40501f2a674179b6cd39d4` |
| `ew2b-r42-journeys.mjs` | `7de3a7891ca4e9a635aadc6365479cfe03ba98d523667b3b59afcf17d928ba32` |
| `ew2b-b1-card-handoff.mjs` | `9e4c1e1954050062f80529d2e587e22ce0de626ae6ce6c611bb0772bb9bbd3a8` |
| `ew2b-b2-route1-auth.mjs` | `6340d03744a1f9217816b23ba9081314f94c02628030b3f631bbcdfbf020bf91` |
| `ew2b-n-register.mjs` | `b0e8260eab99939a90de94040df11e220a577ebf347b9297d4f572c6885f4b4f` |

**`ew2b-r40-hunk-e-base.mjs` is the seventh and it DIFFERS**, by exactly one line and by design: it
prints the checkout it measured, which is `C:\Users\joeym\AppData\Local\Temp\ew2-run\` on the PC and
`/home/claude/farm/scratch/wt/ew2final/` in the farm. With that one line removed, both stdouts hash
to `8f52f149e963580cdcb6e156aa4b7972bb707825131592a66ce91270caa2c123`. Every other line, including
every count, is the same on both.

The three `ew2b-r39-*` cells cannot run in the farm at all and this round re-measured why: the farm
scratch fails at `rebuild/m3/w7-preview/import/test/support.mjs:108`,
`port.cjs did not seal the invented bundle (status 2)`, with `4. ORACLE FAIL ... NO BUNDLE WRITTEN`.
That is the include list refusing to hand over the port's oracle, exactly as 7.2 says, and it is not
a defect in the cells.

No U+2013 and no U+2014 appears in any file this lane authored, counted rather than claimed.

---

## 11. THE NAMED DEBTS OF LOOP ROUND 1, VERBATIM

Quoted word for word from `EW2-BUILD-BRIEF-REVIEW-L1.md` lines 67 to 69. Under each one: **THE
ORDER** that answers it and **THE ROW** that can fail for its defect. Where this round discharged
part of a debt it says which part, and the rest stays open.

> **ND1** - Count machine-note reads at the shared durable boundary, including reads reached through lane.all; prove one generation supplies both note rows and correspondence, and make a two-generation mutant fail.

**THE ORDER: step B6, and the prototype half is DONE.** `ew2b-r42-journeys.mjs` now counts at the
era client's `hostBindings`, so a load taken through `all()` counts; the read takes **1**; and
mutant **M6**, which takes the context off one load and the rows off `lane.all()`, takes **2** and
fails the assertion. **What is NOT done:** none of that ran behind a REAL sealed admission, and the
count has never been taken on the card's own lane.
**THE ROW:** `EW-25`, with the load asserted `=== 1` at the boundary and `M6` red.

> **ND2** - Preserve the full EW-25 control set while adding E-R42: resolved document and native notes, unresolved-only refusal, confirmed absence, no notice with no orphan, both winner date orders, same-label re-add, and a linked card that renders the notice and preserves the saved draft through Save.

**THE ORDER: step B6 for the controls and step B7 for the card, and it is the honest state of this
one that matters.** This round's prototype carries: the resolved DOCUMENT note, the unresolved-only
refusal by name, and no notice with no orphan. Section 4.6 adds the last clause, a linked card that
renders the notice and preserves the saved draft through Save, executed. **STILL OWED, and named so
nobody counts them as carried:** a resolved NATIVE note beside a document one, a blank CONFIRMED
absence on a lift with no note at all, BOTH winner date orders, and the same-label re-add. Round 7's
`ew2r7-p4-note-identity.mjs` carries four of those under the OLD rule; they must be re-driven under
the amended one, not inherited.
**THE ROW:** `EW-25`, which is not green until every control in this debt's own sentence is in it.

> **ND3** - Publish the exact build base and a complete owned-file/hunk budget after the Today split and the PM's E-R39/E-R41 rulings; keep D1's mixed-history/second-selection/rollback obligations and the linked-card requirement open until executed.

**THE ORDER: it CANNOT be discharged by this round and this brief says so rather than pretending.**
The exact build base does not exist yet: `rebuild/c-today-split-build` moved three times while this
brief was being written and has not sealed, and two of the four inputs to the budget are rulings the
PM has not made (E-R39 in section 0, E-R41 in section 3). What this round CAN do it has done:
6.1 now marks every row **COUNTED** or **ESTIMATE**, names `today-lanes.cjs`, `machine-settings-view.mjs`
and `design.cjs`, and 6.3 records the three bases with the measured fact that the four card files did
not change between `cc87c072` and `c38ed5fb`.
**THE ROW:** none, and inventing one would be the paper answer `D-EW2-FINAL` forbids. This debt is
discharged by a REPUBLICATION of section 6 at the sealed base, as the first act of the build, and by
D1's obligations staying open in section 5 and E-R40 condition 2 staying open in 6.2 until each is
executed.
