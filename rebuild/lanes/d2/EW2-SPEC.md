# EW2-SPEC: EDIT MY WEEK, SCREENS PART 2

Lane D2, SPEC ONLY. Author: cowork (Earned lane hand), Opus, 2026-09-19. Branch `rebuild/d2-ew2-spec`
cut from `0794771`. No product, test, tooling or workflow byte moves on this branch.

**v2, FIX ROUND.** The first author is gone. Independent review R1
(`rebuild/lanes/d2/EW2-SPEC-REVIEW-R1.md` at `0695493`) returned REJECT with six BLOCKING findings
and ten notes. Section 10 lists every one of them as FIXED or DISPUTED, with evidence. Nothing of
v1 was discarded unread: the sections R1 could not break are kept word for word.

Every cite below was RE-MEASURED at the chain tip `724ef3fc`, not at the v1 base.
`git diff 0794771..724ef3fc` over `rebuild/m3/w6/local/source-admission.mjs`,
`rebuild/m3/w6/host/plan-edit-host.mjs`, `rebuild/m4/workout/` and `rebuild/m3/w7-preview/today/`
is EMPTY, so the base and the tip agree line for line and no cite is excused by drift.

This is a hypothesis for the PM to judge and for an independent reviewer to disagree with.

Authority: `DECISIONS:176` (the brief accepted by name with three rulings), `:473` and `:474` (part 1
merged), `:510` and `:519` (the carried provenance defect, whose reachability `:510` itself left
OPEN), `:532` (the owner has imported; it says nothing about reachability), `:536` (screen files
released from the seal), `:540` (this dispatch), `:541` (the cloud farm and this pilot).

Read before this file: `rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md` (the brief of record, 101 lines) and
`rebuild/lanes/b/S9-RELEASE-SPEC.md` at `rebuild/b-s9-ui-pins@d859096a` (the release list, which
decides half of section 3). S9 is NOT accepted: its own independent review R2 at that head is a
REJECT with two BLOCKING findings, neither of which moves the closed list.

---

## 1. SCOPE AND NON-SCOPE

### 1.1 What `DECISIONS:176` accepted, restated in this spec's own words

The brief describes FOUR doors and sixteen cells. It is not that any more. `:176` ruling (c) narrowed
v1 to TWO doors and thirteen cells, "because a beginner's first real need is 'this machine is taken,
swap the exercise', not a new week". A builder handed the brief alone will build Days and Priorities.
The narrowing is restated here so no reader has to follow a reference to find it.

IN SCOPE for part 2, v1:

| door | what the athlete does |
|---|---|
| Exercises | choose a lift in the current week, then edit its own fields, replace it, remove it from the week, or add a lift |
| Machine settings | keep the seat, pin and position values and the cues remembered for one lift's machine |

Cells in scope: EW-01, EW-02, EW-03, EW-04, EW-05, EW-08, EW-09, EW-11, EW-12, EW-13, EW-14, EW-15,
EW-16. Thirteen. This spec adds THREE more in section 4, EW-17a, EW-17b and EW-17c. Sixteen cells.

NOT IN SCOPE, and it is v1.1, briefed by D2 when v1 merges (`:176` (c)):

| out | why |
|---|---|
| the Days door | v1.1. It also depends on F1 full body and on owner question Q3 (Dad's training days), neither of which is settled. |
| the Priorities door | v1.1. |
| cells EW-06, EW-07, EW-10 | they test Days, midnight composition of structural edits, and priorities. |
| clearing the last machine note | `:176` ruling (b), DEFERRED, accepted. The screen refuses it with the brief's own sentence. |
| any change to the plan-edit companion | it is merged (`:474`) and sealed. Part 2 CALLS it and changes not one byte of it, with ONE exception ruled in 4.4: an ADDED pure export from `plan-edit-model.cjs`, which is lane D or lane B work on the reseal child and is NOT in EW2-BUILD's diff. |
| any engine, coach, admission, import or store byte | except the admission hunk section 4 rules, same custody as above. |

### 1.2 The three rulings of `:176`, and where each one lands in this spec

- (a) Structural changes take effect TOMORROW in the athlete-local calendar, shown as `Starts {date}`
  before save. LANDS: section 2 state R (review) and state V (saved structural); the date comes from
  `plan-edit-commands.cjs:41 nextLocalDate(day)` over the host's own `liveDay`, never from a page clock.
- (b) Clearing the last machine note is deferred. LANDS: section 2 state M3, with the brief's verbatim
  error and no new contract invented.
- (c) Two doors, thirteen cells. LANDS: section 1.1 above and the cell plan in section 5.

### 1.3 What part 2 IS, in one line

The screens for two doors over the already merged and already proven companion
(`rebuild/m3/w6/host/plan-edit-host.mjs`, `rebuild/m4/workout/plan-edit-commands.cjs`,
`plan-edit-model.cjs`), plus their DOM and copy cells, plus THE ADOPTION HUNK THAT MAKES THE EDIT
REACH TODAY (3.4, new in v2), plus the suite and its CI registration. Nothing else exists for this
item anywhere in the tree: `edit-week*` matches no file at the tip, the brief's own proposed suite
path `rebuild/m3/w7-preview/today/test/edit-week.test.mjs` does not exist, and no page, host, entry
or app module constructs the companion (measured: `grep -rn 'createPlanEditHost' rebuild` returns
the export at `plan-edit-host.mjs:42`, two Astra review annexes and four lane D cells, and nothing
else).

---

## 2. THE SCREEN STATES AND THE VERBATIM COPY

### 2.1 The companion surface the screens are allowed to touch

Measured at `724ef3fc` in `rebuild/m3/w6/host/plan-edit-host.mjs`. The page gets exactly five methods
and nothing else. It never builds an operation, never reaches the client, never touches IndexedDB.
R1 N1 was right that v1's table read the RETURNED HANDLE rather than the method definitions; these
are the definitions, counted line by line.

| call | line | returns on success | returns on refusal |
|---|---|---|---|
| `host.read(date?)` | `:162` (`async read(date)`) | `{ read:true, state, plan_basis, pending_dates, intents }` | `{ read:false, ...refusal(code) }` |
| `host.review(edit)` | `:163` (`async review(edit)`) | `{ reviewed:true, review_id, intent_id, starts_on, current, before, after, plan_basis, edit }` | `{ reviewed:false, ...refusal(code) }` |
| `host.save(review_id)` | `:190` (`async save`) | `{ ok:true, acknowledged:true, op_id, intent_id, starts_on, edit }` | refusal; the STALE refusal also carries `current`, `plan_basis`, `pending_dates`, `starts_on` (`:215-:217`) |
| `host.cancel(review_id)` | `:252` | drops the review, writes nothing | n/a |
| `host.close()` | `:253` | every later call refuses `LOCAL_CLIENT_CLOSED` | n/a |

`read()`'s `state` is the PROJECTED state for the date asked: `readVerified` (`:143-:152`) reopens the
lane and returns `read(lastGeneration, date || localDay())`, the projector's own read. That matters in
3.4, because it is the only place in the tree that knows what the athlete's week is after an edit.

The host is constructed at `plan-edit-host.mjs:42` and REQUIRES `client, clock, liveDay, basisState,
setupOperation, validateTags, projectNewExerciseTags, newIntentId, athleteLabel, namespace`. Missing
`athleteLabel` or `namespace` is `PLAN_EDIT_HOST_INCOMPLETE` (`:53`), deliberately, because defaulting
them would silently widen `admittedLocalSourceBasis` from "this athlete's admitted import" to "any
admitted import" (the comment at `:46-:51`). The page passes them beside `admittedLocalSourceState`.

**Two of those ten arguments have NO production provider, and that is a blocking dependency, not a
detail (R1 B3, upheld).** It is ruled in 3.5.

The edit shapes the page may build, from `plan-edit-commands.cjs:69 editOf` (re-counted at the tip;
v1's rows were off by one in the same direction, R1 N1):

| kind | shape | line |
|---|---|---|
| update | `{ kind, exercise_id, changes }`, changes a non empty subset of `n, day, sets, hi, inc, steps` | `:71-:74` |
| remove | `{ kind, exercise_id }` | `:75` |
| add | `{ kind, exercise, tags }` | `:76-:79` |
| replace | `{ kind, exercise_id, exercise, tags }`, and `exercise_id !== exercise.id` or it refuses | `:76-:79` |

Field law, `plan-edit-commands.cjs:47 fieldOf`: `id`, `n`, `mg` are non empty text; `day` is `'U'` or
`'L'` and nothing else; `sets` and `hi` are safe integers of at least 1; `inc` is finite and positive;
`steps` is a non empty, strictly ascending array of positive numbers. The editor uses THESE, not
setup's starter chips, because an established athlete's values may sit outside the chips (brief,
Exercises paragraph) and coercing them is EW-02's failure.

### 2.2 The states, the copy, the call and the refusals

Copy marked SOURCED is verbatim from the accepted brief's "Exact copy" table and may not be reworded.
Copy marked SOURCED FROM CODE is verbatim from the companion and may not be reworded either.
**This spec proposes NO new sentence (v2, R1 B5).** `{date}` and `{name}` are actual values, never
left in the UI. No copy in this file or proposed by it contains a dash character of any kind.

| state | copy | call | refusals it must draw |
|---|---|---|---|
| E0 Entry | SOURCED title `Edit my week`; SOURCED intro `What would you like to change?`; SOURCED doors `Exercises` and `Machine settings` (two, not four); SOURCED, when a pending edit exists, `Changes already saved for {date}` | `host.read()` on open, once | `PLAN_EDIT_READ_REFUSED`, `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`, `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`, `PLAN_EDIT_HOST_INCOMPLETE`, `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`, `LOCAL_CLIENT_CLOSED` |
| E1 Exercise list | SOURCED `Choose an exercise` and `Add exercise`; each row shows the lift's own current name, day and set count from `read().state` | none; pure render of the state E0 already read | none; a list that cannot render is E0's refusal, not its own |
| E2 Exercise actions | SOURCED `Edit exercise`, `Replace exercise`, `Remove from week` | none | none |
| E3 Edit exercise | SOURCED label helper `Changing the name keeps this exercise's records.`; the six editable fields of 2.1 with the existing setup field errors verbatim | `host.review({kind:'update', ...})` on `Review change` | `PLAN_EDIT_INPUT_INVALID`, `PLAN_EDIT_NO_CHANGE`, `PLAN_EDIT_TARGET_UNAVAILABLE`, `PLAN_EDIT_DATE_INVALID`, `PLAN_EDIT_STALE_BASIS` |
| E4 Replace | SOURCED `The new exercise starts without a recorded load. Your old sessions stay in your history.` | `host.review({kind:'replace', ...})` | the E3 set plus `PLAN_EDIT_ID_REUSED`, `PLAN_EDIT_TAGS_INVALID`, `PLAN_EDIT_TAG_BASIS_UNPROVEN`, `PLAN_EDIT_NEW_TAG_PROJECTION_INVALID`, `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` |
| E5 Remove | SOURCED `This exercise will leave your week on {date}. Your old sessions stay in your history.`; on `PLAN_EDIT_DAY_UNCOVERED`, SOURCED from `BRIEF-EDIT-MY-WEEK.md:61`, `Choose a training day for each exercise before saving.` | `host.review({kind:'remove', exercise_id})` | the E3 set plus `PLAN_EDIT_WEEK_EMPTY` (2.2.2) and `PLAN_EDIT_DAY_UNCOVERED` |
| E6 Add | SOURCED `Add exercise`; setup's muscle vocabulary and field components reused from `setup-model.mjs`, its document writer never called | `host.review({kind:'add', ...})` | the E4 set |
| E7 Unchanged draft | SOURCED `Nothing has changed yet.` | the refusal `PLAN_EDIT_NO_CHANGE` maps to this sentence; the page does not decide it locally | `PLAN_EDIT_NO_CHANGE` |
| R Review | SOURCED `Starts {date}`, `Current`, `After this change`; SOURCED actions `Save change`, `Keep editing`, `Cancel` | render of `review()`'s `current`, `before`, `after`, `starts_on` | none of its own |
| S Saving | no new copy; the existing in flight treatment. Save is disabled while in flight so one deliberate save is one operation | `host.save(review_id)` | n/a |
| V Saved, structural | SOURCED `Saved for {date}.` | shown ONLY on `{ ok:true, acknowledged:true }` | never shown on any other reply |
| V2 Saved, notes | SOURCED `Saved on this device.` | the Machine settings door's own save | as above |
| T Stale, the week really did change | SOURCED `Your week changed while this was open. Review the latest week before saving.` and the result drawn beside it from the refusal's own `current` and `starts_on` | THREE codes only: `PLAN_EDIT_REVIEW_STALE`, `PLAN_EDIT_STALE_BASIS`, `PLAN_EDIT_BASIS_INVALIDATED` (`plan-edit-model.cjs:300`, `:309`: a causal parent stopped being active, or the seen basis disagrees) | the draft survives; nothing is rebased for him |
| D Day turned | SOURCED FROM CODE, verbatim from `plan-edit-host.mjs:24`: `The day changed while this was open. Review the latest week before saving.` | `PLAN_EDIT_DAY_TURNED` (`plan-edit-host.mjs:23`) | the draft survives |
| X Durable refusal | the existing actionable refusal behaviour, unchanged; never the word Saved | `PLAN_EDIT_SAVE_OUTCOME_UNKNOWN`, `PLAN_EDIT_BATCH_MISMATCH`, `PLAN_EDIT_INTENT_CONFLICT`, `PLAN_EDIT_DUPLICATE_INTENT`, `PLAN_EDIT_REVIEW_REQUIRED`, `PLAN_EDIT_PROJECTION_REFUSED`, `PLAN_EDIT_HISTORY_UNPROVEN`, `PLAN_EDIT_ORIGIN_UNPROVEN`, `PLAN_EDIT_REJECTION_UNPROVEN`, `PLAN_EDIT_TOMBSTONE_UNPROVEN`, `PLAN_EDIT_DATE_ORDER_UNPROVEN`, `LOCAL_CLIENT_CLOSED`, and the three of 2.2.2 | the draft survives; lease, storage, integrity and closed era all land here |
| M1 Machine settings, read | SOURCED helper `Keep the settings you want to remember for this machine.` | `machineSettings.latest(exercise_id)`, then `machineSettingsView.draftFrom(latest)` (`machine-settings-view.mjs:28`) | the era and lease refusals the existing host already raises |
| M2 Machine settings, edit | the existing editor rows and cue field, `renderEditor` (`machine-settings-view.mjs:115`), `MAX_ROWS` (`:23`) unchanged | `machineSettings.save(machineFromDraft(draft, exercise_id))` (`machine-settings-host.mjs:93`) | `MACHINE_SETTINGS_INPUT_INVALID` is a THROWN `TypeError` (`rebuild/coach/machine-settings-commands.cjs:39`), not a refusal reply: the screen CATCHES it (R1 N8) |
| M3 Last note empty | SOURCED `Keep a setting or a cue. Clearing the last note is not available here yet.` | the page refuses BEFORE calling save, using `acceptable(machine)` (`machine-settings-view.mjs:53`); it never claims a blank save erased a note | ruling (b) of `:176` |

### 2.2.1 The boundary the editor refuses outright, stated in words (v2, R1 N7)

As merged, the companion does not open at all for some installations, and no state above says so. A
builder discovers it at the first fixture with a sync frontier. Measured in `plan-edit-model.cjs`
`inspect()`:

- `:226` `(collections.sync?.frontier?.W ?? 0) !== 0` and `:227` a recovery plan or a non empty
  snapshot plan both refuse `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`.
- `:235` an import present without a first run, or the reverse, and `:237-:238` an import present but
  not admitted, refuse the same code.
- `:242-:243` a non empty `collections.plan` or `collections.planTransactions` refuses
  `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`.

**RULE: Edit My Week v1 is a PRE-SYNC, LOCAL-ONLY editor.** State E0 already lists both codes. EW-01
asserts the boundary in both directions: a clean local installation opens both doors, and an
installation with a sync frontier of anything but zero refuses at E0 and never shows a door. The
screen draws E0's refusal treatment and no door, and it does not pretend the athlete can edit.

### 2.2.2 The four in-scope refusal codes with NO true sentence anywhere (v2, R1 N5, N6)

Four codes, in three rows below, reach the athlete in the narrowest door and have no true sentence in
the brief, in the code, or in the inventory. This spec does NOT invent one for them, because law 4 forbids it and
because a guessed sentence about storage is the defect R1 B5 caught in v1.

| code | where it fires | why no sourced sentence fits | interim |
|---|---|---|---|
| `PLAN_EDIT_WEEK_EMPTY` | `plan-edit-model.cjs:341`, removing the last non retired lift | the brief has no row for it | state X's actionable refusal treatment. The screen MAY also decline to offer `Remove from week` when `read().state` shows one remaining non retired lift, as an affordance, but it never claims the refusal did not happen |
| `PLAN_EDIT_BASIS_SOURCE_CHANGED` | `plan-edit-host.mjs:77`, an import became present or absent under the open editor | the week did NOT change; the BASIS SOURCE did. The brief's stale sentence is false here | state X, and the editor re-reads from E0 rather than offering Save |
| `PLAN_EDIT_BASIS_HASH_INVALID` and `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` | `plan-edit-model.cjs:104` and `:101`; a digest that is not 64 hex, and a host built without `hashBasis` | both are construction or integrity facts about storage, not facts about his week | state X |

These four codes (three rows) are COPY INVENTORY ITEMS the PM must seat before EW-05 ships. They are
question Q-F in 9.4 and item 12 in the design lane's list at 8.2.

### 2.3 Copy laws that bind every string above

1. No U+2013 and no U+2014 anywhere, in the file or on screen. The render boundary is
   `rebuild/m3/w7-preview/today/plain-copy.cjs` (`plainCopy`, `plainOrDrop`), which `today-entry.mjs:30`
   already imports for exactly this rule (`DECISIONS:114` (1)). The editor renders through it.
2. No emoji and no exclamation mark (brief, EW-16).
3. No readiness word. The headline vocabulary check lives in `browser-check.mjs`
   (`headlineVocabulary`, `assertNoDashOnScreen`); note that S9 Q4 records that this file is unsealed,
   stale red at the tip and has no CI home, so EW2-BUILD may NOT treat a green run of it as evidence
   until S9 gives it one. The suite asserts the copy census itself, in its own cells.
4. **ZERO new sentences are proposed by this spec (v2).** Every string above is SOURCED from the
   accepted brief or SOURCED FROM CODE. A builder that finds it needs ANY new sentence files it in
   the copy inventory and stops for the PM: that includes the four unsentenced codes of 2.2.2.

---

## 3. THE SPLIT: WHICH HALF SHIPS AS LANE C, WHICH HALF RIDES A CHILD

### 3.1 The fact that decides it, and it is newer than the scout report

`DECISIONS:536` released presentation only files from the seal in the owner's words and left the
closed list to S9. S9's spec exists: `rebuild/lanes/b/S9-RELEASE-SPEC.md` on `rebuild/b-s9-ui-pins`,
read at `d859096a` (v2 of the spec at `c0bb04e`, plus its own review R2). Its section A.6 THE CLOSED
LIST is TWO paths, not eight:

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

and the second is CONDITIONAL on hunk H18 landing in the same package (`S9-RELEASE-SPEC.md:218-:223`):
without H18 the closed list is ONE path. `today-app.cjs` is judged SEALED in S9 A.2, by the owner's
own test, with twelve deciding lines: it opens five IndexedDB lanes (`:513`, `:596`, `:637`, `:2052`,
`:1416`) and calls three durable writers from three click handlers (`recordIntake :1278`,
`recordSleep :1807`, the weigh in submit `:1059`). `today-entry.mjs` is judged SEALED at
`today-entry.mjs:141 await host.save(document_)`. `gym-app.mjs` SEALED at `:161-:166`.
`machine-settings-host.mjs` SEALED at `:63-:85`.

**S9 IS NOT ACCEPTED.** Its independent review R2 at `d859096a` is a REJECT with two BLOCKING
findings. Both are document edits (a copy-lock row in C.4 and the D.2 fence's reseal-child SKIP) and
NEITHER moves the closed list, so section 3's arithmetic survives R2. STOP condition 2 still stands:
if S9 is accepted with a different closed list, this section is re-judged before a byte moves.

**This contradicts the assumption the PM4 scout worked under** ("the VIEW half ships as lane C after
S9, if the S9 closed list in fact releases today-app.cjs and screens.template.html"). It does not
release `today-app.cjs`. The scout's own STOP condition 2 is therefore already triggered, before any
code is written, and the split below is written for the world S9 actually describes.

### 3.2 Every path, checked against the seal by machine

Method, so a reviewer can repeat it, and it is CORRECTED in v2 (R1 N2, partly disputed in 10.2). A
small script parsed `rebuild/m4/spec/acceptance-s8-real-shape.json` and asked it about each path
below by exact string, against THREE named key sets, reported separately because they have different
consequences:

- `product`, **224 keys**: the pin list a reseal child exists to move. THIS is the column below.
- `executionPins`, **71 keys**: test and spec pins. No path below is in it.
- `protectedSurfaces`, **2 keys**. No path below is in it.

Union of the three: **229**. (Union of `product` and `executionPins` alone: 227.) The artifact's
contents were not printed and are not reproduced here; only counts and per-path YES/NO. Exact path,
never directory: the prefix `rebuild/m3/w7-preview/today/test/` occurs many times in that artifact,
so a NEW file under it proves nothing by its neighbours.

| path | in `product`? | S9 verdict | half |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/edit-week-model.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-view.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-check.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-tags.mjs` | NO (new file, 3.5) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-basis.mjs` | NO (new file, 3.4) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/test/edit-week.test.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/screens.template.html` | NO | already unsealed; editable today | VIEW |
| `rebuild/m3/w7-preview/today/machine-settings-view.mjs` | NO | already unsealed; C-UI-5 owns it | VIEW, coordinated |
| `rebuild/m3/w7-preview/today/setup-model.mjs` | NO | read only here; vocabulary reuse, its document writer never called | VIEW, no edit |
| `rebuild/m3/w7-preview/today/setup-host.mjs` | NO | not in the seal at all; `setupsIn(generation, profile)` at `:45` is the `setupOperation` source (3.6) | CALLED ONLY, zero bytes |
| `rebuild/m3/w7-preview/today/preview.css` | YES | RELEASED by S9 | VIEW, after S9 |
| `rebuild/m3/w7-preview/today/build.mjs` | YES | RELEASED by S9 only if H18 lands | VIEW after S9 with H18, otherwise WIRING |
| `rebuild/m3/w7-preview/build.mjs` | YES | the OTHER pinned `build.mjs` (R1 N3). NOT this item's: a new bundle input for the preview page is added in the `today/` one. Named here so a builder who greps finds two and knows which | zero bytes |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | YES | SEALED (`:141`) | WIRING |
| `rebuild/m3/w7-preview/today/today-app.cjs` | YES | SEALED (S9 A.2) | WIRING |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | YES | SEALED BY NAME at `:536` (2) | NOT TOUCHED. 3.4 chooses option (b) precisely to keep it at zero bytes |
| `rebuild/m3/w7-preview/today/machine-settings-host.mjs` | YES | SEALED (`:63-:85`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | YES | SEALED (`:161-:166`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w6/host/plan-edit-host.mjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-commands.cjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-model.cjs` | YES | SEALED | ONE ADDED PURE EXPORT for section 4's fix, another lane's hunk, NOT in EW2-BUILD's diff |
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | YES | the ONLY `projectNewExerciseTags` implementation in the tree, and it is in a LANE directory (3.5) | see 3.5 |
| `rebuild/m3/w6/local/today-bindings.mjs`, `rebuild/m3/w6/host/workout-host.mjs` | YES | SEALED by name at `:536` (2) | CALLED ONLY, zero bytes (3.6) |
| `rebuild/coach/machine-settings-commands.cjs` | NO | but `rebuild/coach/**` is SEALED by name at `:536` (2) | CALLED ONLY, zero bytes |
| `rebuild/m3/w6/local/source-admission.mjs` | YES | SEALED by name at `:536` (2) | section 4's hunk only, another lane's |
| `.github/workflows/rebuild.yml` | YES | pinned; registering the new suite is a hunk in it (R1 N4) | WIRING, on the same child, PM custody (3.3 line 7) |

### 3.3 THE SPLIT IN SEVEN LINES (v2: five in v1, and it was two short)

1. VIEW half, lane C, no reseal, buildable NOW: SIX NEW files (`edit-week-model.mjs`,
   `edit-week-view.mjs`, `edit-week-check.mjs`, `edit-week-tags.mjs` (3.5), `edit-week-basis.mjs`
   (3.4), `test/edit-week.test.mjs`) plus a `t-edit-week` block in the already unsealed
   `screens.template.html`, plus `preview.css` once S9 seals.
2. WIRING half, SEALED, rides ONE reseal child: `today-entry.mjs` (a `createEditWeekEntry` factory
   beside `createWorkoutEntry:150` and `createSetupEntry:93`, and one call site in `boot():226`) and
   `today-app.cjs` (ONE route in the `[data-go]` router at `:826`, ONE mount call, AND the adoption
   `.then` of 3.4).
3. The target size of the wiring half is **under 55 added lines** across the two sealed files and ZERO
   removed (v1 said 40, before 3.4's hunk existed), because three hands want `today-app.cjs` this week
   (`:539` (2) S9-TODAY-CARRY, C-UI-1, C-UI-2) and the smallest hunk is the one that merges.
4. `machine-settings-host.mjs` and `gym-app.mjs` take NO hunk: the Machine settings door calls the
   existing exported `createMachineSettingsHost` (`:63`) from the new entry and renders through the
   existing exported `renderEditor` (`machine-settings-view.mjs:115`). If a builder finds it cannot,
   that is a STOP, not a licence to edit a sealed file.
5. `local-source-basis.mjs` takes NO hunk either. 3.4 exists to keep it that way.
6. The child is S10, shared with N3-MACROS-ENTRY and P4b coaching memory exactly as `:540` (2)
   intends, and it also carries section 4's admission hunk and its `plan-edit-model.cjs` export.
   One seal chain for three items.
7. **The CI registration is a hunk in `.github/workflows/rebuild.yml`, which is PINNED (R1 N4).** It
   rides the SAME S10 child, authored by the PM, not by any lane: this spec grants no `.github`
   custody to a lane and never asks a builder to touch it. S10's budget carries it. It is the reason
   6.7's "no diff outside" clause is scoped to the lane's own diff, not to the child's.

### 3.4 THE ADOPTION CHAIN: what makes EW-14 true, and it was missing from v1 (R1 B2, upheld)

EW-14 is "same page commit reaches real Today and the next eligible gym entry with the new operation
basis". A route and a mount call put the editor on the screen. They do NOT change what the gym card
next opens on. The chain that decides that, measured at the tip:

- `today-app.cjs:2482` `function athleteBasisState()` imports `./local-source-basis.mjs` and returns
  `module.admittedLocalSourceState(setup)`, then `.catch(() => null)`, then
  `.then((imported) => { importAdmitted = !!imported; return imported || setup.athleteState(); })`.
- `today-app.cjs:2490` `function adoptAthleteState()` calls it, then `model.adoptBasis(state)`
  (`today-model.cjs:412`, which assigns `basis` and clears `pendingAdoption`), then
  `workout.gym.rebase()` and `workout.refresh()`.
- `today-model.cjs:219` `stateFromOps()` returns `foodProjectionOf().state`, which begins
  `let state = clone(basis)`. Everything the gym card reads hangs off `basis`.
- `gym-model.mjs:104`: `hostForDay` rereads `model.stateFromOps()` at CALL time, so a rebase after
  `adoptBasis` picks up whatever was adopted.

**NOTHING IN THAT CHAIN APPLIES A PLAN EDIT, and nothing in the product consumes the operation.**
Measured: `grep -rn 'exercise-edit' rebuild --include=*.mjs --include=*.cjs` returns the field
constant `plan-edit-commands.cjs:4` and two lane D cells. `stateFromOps()` replays sleep, food and
readings and has no branch for it. So an edit saved today changes the editor's own `read()` and
nothing else on the phone.

**THE RULING: option (b). A NEW UNPINNED COMPOSING MODULE, and ONE added `.then` in `today-app.cjs`.**
The three options and why the other two lose:

| option | what it means | verdict |
|---|---|---|
| (a) change `local-source-basis.mjs` | it is in `product` (verified by query) AND SEALED BY NAME at `:536` (2). The most expensive file in the tree to touch, and the edit is not a basis-admission concern | REJECTED |
| (b) a new unpinned module composes the adopted basis with the companion's own `read().state`, and `athleteBasisState()` gains one chained `.then` | the whole semantic lives in an unpinned lane C file; the sealed hunk is four added lines and zero removed | **CHOSEN** |
| (c) make the companion's `read()` the adoption source outright | it changes the meaning of "admitted basis" and would make `importAdmitted` a lie. `plan-edit-model.cjs:240` already asserts `equal(adopted, base)`, so the companion itself insists the basis handed to it is the admitted one | REJECTED |

THE EXACT HUNK, appended to the existing chain at `today-app.cjs:2482-:2489`, nothing removed:

```
      .then((state) => state && import("./edit-week-basis.mjs")
        .then((m) => m.planEditedState(state, openPlanEditHost))
        .catch(() => state) || state);
```

`edit-week-basis.mjs` (new, unpinned, VIEW half) exports ONE function:
`planEditedState(state, openHost)`. It opens the companion through the caller's factory, calls
`host.read()` once, closes it, and returns `read.state` when `read:true`, and the unchanged `state`
on ANY refusal or throw. **It re-derives NOTHING**: it never applies an edit itself, never reads
`training.exercise-edit`, never touches a projector. The same rule the codebase states at
`plan-edit-model.cjs:61-63` binds it: a second spelling of the rule is a second rule.

COST, stated rather than hidden: one extra durable reopen per adoption. Adoption runs at boot
(`today-app.cjs:2550`) and on `onAdmitted` (`:700`), not per frame, so this is two reopens in a
session and not a loop. EW-14 measures it; if it is not acceptable, the STOP is section 9.1 item 9.

### 3.5 THE TAG PROVIDER: two of the host's ten arguments have no product implementation (R1 B3, upheld and sharpened)

`createPlanEditHost` requires `validateTags` and `projectNewExerciseTags`. Both are hard and
undefaulted:

- `plan-edit-commands.cjs:66`
  `if (typeof validateTags !== 'function' || validateTags(plain(exercise), plain(tags)) !== true) fail('PLAN_EDIT_TAGS_INVALID');`
  inside `tagsOf`, which `editOf` calls for EVERY `add` and EVERY `replace` (`:76-:79`). Unconditional.
- `plan-edit-model.cjs:349`
  `if (typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');`
  and `:350-:356` hold the projection to an exact shape. This one fires only on the SAVE path (`if (op)`
  at `:348`); the review path at `:357` takes `edit.tags` directly. So a builder can reach a green
  REVIEW for `add` and `replace` and then refuse at Save, which is the worst order to discover it in.

**The provider is not missing, it is UNMERGED, and v2 found where it lives.** Measured:

- `grep -rln projectNewExerciseTags rebuild` gives exactly ONE implementation in the tree:
  `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs`, whose `createSetupTagProjector` (`:64`) returns
  `{ validateSetupTags, projectSetupTags, validateExerciseTags, projectNewExerciseTags }` (`:195`).
  It is in a LANE directory and it is in `product` (verified by query), so moving it is a pin change.
- `rebuild/lanes/d/plan-edit/model.test.cjs:511-:515` (cell PE-f2-identity) proves that lane file is
  **sha256 equal to `rebuild/m4/workout/setup-tags.cjs` at commit `f3e9561`**, and `durable-host.test.mjs:24-:32`
  says the same in words: "lane keeps a byte-identical copy of the public F2 source at f3e9561".
- `PLAN-EDIT-V2-AUTHOR-REPORT.md:8` names the reason it is not on the tip: lane D's **separate,
  unmerged F2 package** (`m4/workout/setup-tags.cjs`, `lanes/d/f2/**`), deliberately skipped so part 1
  did not ship another package's product. "Nothing of F2 is on the tip in any form."

**THE RULING: land `rebuild/m4/workout/setup-tags.cjs` as product, on the S10 child, BEFORE EW-04 and
EW-15 can go green.** Not a new page-side provider: a second implementation of the tag taxonomy is a
second spelling of the rule, the defect class the codebase names at `plan-edit-model.cjs:61-63`, and
the one that would be silent. `rebuild/m4/**` is SEALED by name at `:536` (2), so this is a reseal
hunk with its own custody, exactly like section 4's.

Consequences a builder must plan around:

1. `model.test.cjs:516-:518` currently ASSERTS that neither `plan-edit-commands.cjs` nor
   `plan-edit-model.cjs` mentions `f2-tag-adapter` or `setup-tags`. That stays true (the page injects;
   the runtime still imports nothing), but PE-f2-identity's `git show f3e9561:` read must be re-pointed
   at the merged path when it lands. That cell is lane D's, not EW2-BUILD's.
2. The VIEW half's `edit-week-tags.mjs` is a THIN ESM shim: it `createRequire`s the product module,
   calls `createSetupTagProjector` once with the page's taxonomy, and hands the host
   `validateTags: p.validateExerciseTags` and `projectNewExerciseTags: p.projectNewExerciseTags`. It
   contains no taxonomy and no validation of its own. If a builder finds itself writing a rule in it,
   that is a STOP.
3. **UNTIL IT LANDS, EW-04 AND EW-15 ARE BLOCKED**, and 7.1 says so. EW-02, EW-03, EW-05 and the
   Machine settings door are NOT blocked: `update` and `remove` never enter `tagsOf`.
4. I did NOT fetch `f3e9561`: it is not an object in the farm mirror and the include list is not a
   thing to work around. Everything above is read off files that ARE on the tip. Whoever lands the
   package verifies the blob itself.

### 3.6 Two reductions this plan depends on, stated so the next hand can check them (R1 N10)

Both keep the S10 hunk small, and neither was claimed in v1:

- **`liveDay` costs zero sealed bytes.** `today-bindings.mjs:723` already exposes
  `liveDay: () => (typeof liveDay === "function" ? liveDay() ...)`, so the S4 real-day requirement
  (`:437`/`:451`/`:467`) is satisfied by an existing export and `today-bindings.mjs` keeps its
  CALLED ONLY, zero byte row.
- **`setupOperation` costs zero pinned bytes.** `rebuild/m3/w7-preview/today/setup-host.mjs:45`
  already exports `setupsIn(generation, profile = PROFILE)` (and `:131` its default export), and that
  file is **not in the seal at all** (verified by query). The entry reaches the setup operation
  without touching a pinned file.

---

## 4. THE CARRIED PROVENANCE DEFECT, AND THIS SPEC'S RULING

Carried at `:510` ("Edit My Week amends state and writes no second setup op, so a capture recorded
AFTER an edit that moved a set count would refuse capture_sets; **reachability open**; noted for Edit
My Week part 2") and again at `:519` ("Edit My Week part 2 must restate capture provenance for edits
that move a set count").

### 4.0 REACHABILITY, MEASURED, not asserted (v2, R1 B6, upheld)

v1 said `:532` made the defect reachable because the owner has imported. **That is false and v2
withdraws it.** `:532` records the import and its follow-ups and says NOTHING about reachability;
`:510`'s own words leave it open. And the owner cannot make such an edit today: no page, host, entry
or app module constructs the companion (`grep -rn 'createPlanEditHost' rebuild` returns the export at
`plan-edit-host.mjs:42`, two Astra review annexes and four lane D cells, and nothing else), and
`today-entry.mjs` exports `createCheckInEntry` (`:49`), `createSetupEntry` (`:93`),
`createWorkoutEntry` (`:150`), `boot` (`:226`), `watchDayRollover` (`:471`), `mountToday` and
`createTodayModel` (`:533`), and nothing plan-edit shaped. Section 1.3 said as much in v1 and the
authority line contradicted it.

**THE MEASURED STATEMENT, and it is stronger for the PM, not weaker: the refusal is UNREACHABLE
today because nothing constructs the companion. It becomes reachable ON THE DAY PART 2'S WIRING HALF
SHIPS, for any athlete who edits and then admits an import.** The owner's completed import removes
one of the two orderings; the remaining ordering (edit, train, re-admit) is still supported, and
`rebuild/lanes/d/import-retract/retract.test.mjs` proves retract-and-re-import exists. So this
section ships WITH part 2 or part 2 ships the interim of 4.3 ruling 4. The schedule is unchanged from
v1; only the stated reason is corrected, because a false reason is what gets re-litigated when S10 is
being trimmed.

### 4.1 (a) WHICH BASIS SUCH A CAPTURE IS PROVED AGAINST, with the code path

Read at `724ef3fc` in `rebuild/m3/w6/local/source-admission.mjs`:

- `programme(source, ops, { today, documentSets, documentProgramme })` at `:217` builds a scratch
  state from the phone's own FIRST RUN SETUP DOCUMENT (`:221 createCleanInitState`) and fills two OUT
  PARAMETERS: `:228` `documentSets.set(ex.id, ex.sets)` and `:237` `documentProgramme.state = scratch`.
- the caller mints both at `:431-:432` and hands them in at `:438`. The callback also closes over
  `state` (the ADMITTED, file-derived state) and `liftAttach` (`:437`).
- the four inner checks live in ONE `resolveCapturedLayout` callback that runs for every stored
  workout start (`:596` onward).

**THE ANSWER TO (a), as a rule and not as an implementation detail: a recorded capture is proved
against the SETUP DOCUMENT that this phone ran when the capture was written, and against nothing
else.** An Edit My Week update does not write a second setup document. It writes one plan mutation
member, `{ field:'training.exercise-edit', unit:'record', provenance:'athlete_edited',
value:{ profile:'earned/plan-edit/v1', intent_id, starts_on, edit } }`
(`plan-edit-commands.cjs:95-:99`), and NOTHING in admission reads that field.

### 4.1.1 THREE of the four checks break, not one (v2, R1 B1, upheld)

v1 ruled on `capture_sets` alone. Measured at the tip, all four checks, in the order they run:

| check | line | what its right-hand side is | does an in-scope edit break it? |
|---|---|---|---|
| `capture_producer` | `:598` | the engine's two rule profiles | **NO.** A plan edit does not change the rule profile. The only one of the four that survives untouched |
| `capture_lift` | `:614` | `state.exercises` (the ADMITTED state) through `liftAttach` | **YES.** A lift minted by `add` or by `replace` (`plan-edit-model.cjs:344-:356`) exists only in the projected plan: it is in neither the document nor the file, `liftAttach` returns null, `target` stays the new id, the filter finds zero, and a session recorded on that new lift refuses ONE CHECK EARLIER than `capture_sets`. EW-04 is in scope. The comment at `:604-:612` calls this check "total" because an uncorresponded SETUP lift is appended as retired; a plan-edit-added lift gets no such appending |
| `capture_sets` | `:665` | `documentSets`, the document's own count per lift | **YES.** After an edit that moves `sets`, the document holds the OLD count, the gym card prescribes the NEW count, the capture records the NEW count, and `:665` compares NEW against OLD and refuses, naming the athlete's own lift as the problem |
| `capture_membership` | `:695-:699` | `sessionMembership(documentProgramme.state, originalDay)`, the whole day's pool compared IN ORDER | **YES.** A `remove` (EW-05), a `replace` (EW-04) and a `day` change (`day` is in `CHANGES` at `plan-edit-commands.cjs:46`, and EW-08 edits that door) all move the pool or its order, and `plan-edit-model.cjs:315` maintains `state.exOrder` explicitly, so the order really does move |

`:510` is not a limit here: it named the ONE case it had measured and left reachability open. A
ruling that covers `capture_sets` alone ships EW-04 and EW-05 with a refusal nobody ruled on.

One dependency stated plainly, because it is what makes `capture_lift` and `capture_membership` real:
they break only once the edit REACHES the gym card, which is exactly what 3.4 builds. Before 3.4 the
capture never names a new lift, because the card never prescribes one. **3.4 and 4.3 are the same
change seen from two ends, and they belong on the same child.**

### 4.2 (b) THE MISSING CELLS: three, not one (v2, R1 B1)

No cell anywhere in the tree walks that order. ONE cell does not settle a family of three refusals,
so EW-17 becomes three, and they are the FIRST things EW2-BUILD writes, red, before any screen.

Every one of them has the same three steps and differs only in the edit and the assertion:
(1) save one Edit My Week edit through the REAL host; (2) record a gym session on or after
`starts_on`, through the REAL gym path, so the capture carries the edited shape; (3) run admission
over a SYNTHETIC history file for the same athlete.

> **EW-17a** (`update` that moves `sets`). ASSERT the outcome 4.3 chose for `capture_sets`. CONTROL:
> the same three steps with an edit that changes only `n` must NOT refuse.
>
> **EW-17b** (`remove`, and a second run with a `day` change). ASSERT the outcome 4.3 chose for
> `capture_membership`, for BOTH pool and order. CONTROL: an edit whose `starts_on` is AFTER the
> capture's own local date must leave the check exactly as it is today.
>
> **EW-17c** (`add`, and a second run with `replace`). ASSERT the outcome 4.3 chose for
> `capture_lift`. CONTROL: a capture naming a lift that NO programme in the story ever carried still
> refuses `capture_lift`, because that is the corruption the check exists for.

These three settle reachability WITH EVIDENCE before anybody pays for a fix, which is what `:510`
asked for when it called reachability open. If all three come back GREEN at the tip, the defect is
not reachable through this path, the fix below is not built, and that fact is recorded in the ledger
with the cells as its proof. They stay in the suite either way, as the regression that keeps it shut.

EW-17c has a known ordering trap: `capture_lift` runs BEFORE `capture_sets`, so a cell that asserts
`capture_sets` on an `add` will pass for the wrong reason. Each cell asserts its own field by name.

### 4.3 (c) THE RULING, in five lines

1. **EXTEND PROVENANCE TO THE COMPANION'S PLAN BASIS. Do not refuse at the edit.** The right-hand
   side of all three broken checks becomes the setup document AS IT STOOD ON THE CAPTURE'S OWN LOCAL
   DATE after the athlete's own authenticated plan edits, and nothing else changes:
   - `capture_sets` (`:665`): a slot count is admitted if it equals the count the document prescribed
     OR the count an authenticated plan edit with `starts_on` on or before the capture's local date
     prescribed for that lift. A count matching NEITHER still refuses (D-PF-f5).
   - `capture_lift` (`:614`): a lift is admitted if the admitted state carries it (unchanged) OR an
     authenticated plan edit with `starts_on` on or before the capture's date ADDED it. A lift no
     programme in the story ever carried still refuses.
   - `capture_membership` (`:695-:699`): the pool and order are compared against
     `sessionMembership(FOLDED, originalDay)` instead of `sessionMembership(documentProgramme.state, originalDay)`.
     Pool AND order are still compared exactly and in order. Nothing is relaxed.

2. **ONE DERIVATION, EXPORTED FROM THE FILE THAT OWNS THE RULE. This is where v1 priced a line it had
   no way to write (R1 B4, upheld).** `plan_basis` is a companion value. `programme()` and the capture
   callback are handed `ops` (`:438`) and nothing else, so the material exists but the derivation does
   not, and re-deriving edit semantics inside `source-admission.mjs` is precisely the bug
   `plan-edit-model.cjs:61-63` names about `normaliseName`:

   > "It must not be restated here: a second spelling of the rule is a second rule, and the bug would
   > be silent."

   **THE SHAPE: a PURE function exported from `plan-edit-model.cjs`,**
   `foldPlanEdits(documentState, ops, onLocalDate)`, which reuses that file's own `apply()` (`:319`),
   its own `exOrder` maintenance (`:315`) and its own validation, and returns the document state as it
   stood on that date. It reads no storage, constructs no host, and authenticates nothing itself: the
   caller passes the ops admission has already proved. Admission calls it ONCE per capture, with
   `originalDay`, which `:674` already has in hand, and derives all three right-hand sides from the
   one result. Two sealed files, not one line in one file.

3. **THE CONSTRAINT THE FIX MUST NOT BREAK, which v1 quoted and then did not carry forward.**
   `documentSets` (`:222-:228`) and `documentProgramme` (`:229-:237`) are OUT PARAMETERS kept
   deliberately OUT of the returned basis, in those files' own words, "because that object is the
   programme digest's input at `:325`, and a new member would change a digest that binds what was
   admitted". The folded state is PER CAPTURE DATE and must therefore stay a local value inside the
   callback or a third out parameter. **A dated basis that quietly becomes a basis member changes
   what was admitted, and that is a worse defect than the one being fixed.** Any reviewer of the
   admission hunk checks this first.

4. **Refusing at the edit is the wrong trade and this spec rejects it by name.** The narrowed v1 need
   is "this machine is taken, swap the exercise". Refusing a set count change to protect a future
   import would break the one thing v1 exists for, for every athlete, to guard a path that only an
   importing athlete ever walks. There is also no sentence that is both true for that field and
   actionable by him at the edit: the true sentence describes something that may happen to a file he
   has not chosen yet.

5. **It is never silent, and the non silence is already built.** With the extension, the false
   refusal disappears and the true one keeps `:510`'s sentence, which names the field and the lift.
   Until the extension lands, EW2-BUILD does not ship an editable `sets` field and does not ship
   `add`, `replace` or `remove`: the Exercises door ships with `n`, `day`, `hi`, `inc` and `steps`
   editable and the rest behind the plain sentence the PM approves. That interim is WIDER than v1's
   (which disabled `sets` alone) because `capture_lift` and `capture_membership` break on the other
   three kinds. It is the interim, not the destination, and it exists only if 3.4 and the fix cannot
   ride the same child. Note the cost honestly: that interim leaves the narrowed v1 need, swapping an
   exercise, unserved, which is a strong reason to keep them on one child.

### 4.4 Custody of the fix, and the honest cost (re-priced in v2)

`source-admission.mjs` is in `product` and SEALED BY NAME at `:536` (2). `plan-edit-model.cjs` is in
`product` and `rebuild/m4/**` is SEALED by name at the same place. The hunk is therefore NOT lane C's
and NOT in EW2-BUILD's diff. **It is TWO sealed files, not one:**

| file | hunk | why it is there |
|---|---|---|
| `rebuild/m4/workout/plan-edit-model.cjs` | ONE added pure export, `foldPlanEdits`, over the existing `apply()` at `:319`. Nothing existing changes | the rule lives where it is spelled once |
| `rebuild/m3/w6/local/source-admission.mjs` | one call at the head of the capture callback, and three right-hand sides re-pointed at its result (`:614`, `:665`, `:695-:699`) | the checks live here |

Authored by lane D or lane B with its own independent review, riding the SAME S10 child as section
3's wiring half and section 3.5's F2 package. **Cost: 4 to 6 hours plus its own review round**, not
v1's 2 to 3: v1 priced one line in one file for one check, and it is two files for three checks with
a digest-invariance constraint to prove. If the PM splits them across two children, the interim of
4.3 ruling 5 applies in between, and 9.4 Q-B says why that is a bad trade.

One warning for whoever writes it, measured: `plan-edit-model.cjs:173` has already been wrong once in
exactly this family. `:522` records B2, "still compared day/mg the admission no longer proves, so a
corresponded lift on another day admitted, adopted, then Edit My Week refused forever", fixed inside
the S8 round. The part 1 author report and both review files describe a file that no longer exists in
that form. Read `plan-edit-model.cjs` at the tip, never the report.

---

## 5. THE CELL PLAN, RED FIRST

Suite: `rebuild/m3/w7-preview/today/test/edit-week.test.mjs`, run by
`node --test rebuild/m3/w7-preview/today/test/edit-week.test.mjs`. Every cell individually
selectable by its EW id. **Sixteen cells:** the thirteen `:176` kept, plus EW-17a, EW-17b and EW-17c.

Order of writing, and it is not negotiable: the three EW-17 cells first and red, because they decide
section 4; then EW-11 and EW-12, because they decide whether the host composition can carry the
screens at all; then EW-14, the composed cell, which is what 3.4 exists for; then the rest. A screen
written before EW-11 is green is a screen built on an assumption.

| cell | what it proves | half | blocked on |
|---|---|---|---|
| EW-17a | 4.2, `update` that moves `sets`, asserting `capture_sets` by name | composed | nothing |
| EW-17b | 4.2, `remove` and `day`, asserting `capture_membership` by name, pool AND order | composed | nothing |
| EW-17c | 4.2, `add` and `replace`, asserting `capture_lift` by name | composed | **3.5** (both kinds enter `tagsOf`) |
| EW-01 | an enrolled athlete opens BOTH doors without first run setup; read, open, cancel and no op leave operation and outbox counts unchanged; AND the 2.2.1 boundary in both directions | composed | nothing |
| EW-02 | one lift's `sets` changed; every other id, field, established load and tag deep equal; existing non chip values render without coercion | composed | nothing |
| EW-03 | rename keeps id, load, era and notes and the historical name lookup; a new eligible session uses the new name | composed | nothing |
| EW-04 | replace with a duplicate label: distinct stable id survives retry and reopen; new load unknown; old sessions and records survive | composed | **3.5** |
| EW-05 | dated removal excludes the lift from future scheduling only; open and historical sessions unchanged; unrelated order survives | composed | nothing |
| EW-08 | equipment values for the selected lift only; invalid, blank and out of order `steps` use the real validation; no zero, NaN or hidden default | composed | nothing |
| EW-09 | machine notes save through the existing coach command and appear on the same id's actual gym card; rename retains them; replacement does not inherit them; empty final note save refuses | composed | nothing |
| EW-11 | the actual producer, validator and projector prove identity, domain, effective date, seen basis, actor edit and causal linkage; malformed and stale basis refuse | composed | nothing |
| EW-12 | one deliberate save yields one durable edit intent and its complete outbox; injected pre commit failure changes neither; retry does not duplicate; lease, integrity and closed era never show Saved | composed | nothing |
| EW-13 | reopen and replay reconstruct current and pending plans; a rejected or tombstoned edit is not still applied by an editor local cache; preexisting history byte equivalent | composed | nothing |
| EW-14 | same page commit reaches real Today and the next eligible gym entry with the new operation basis; in progress workout and check in drafts survive; and the 3.4 module returns the unchanged state on every refusal | composed, THROUGH THE REAL HOST | **3.4's hunk** |
| EW-15 | tagged lift, explicit secondary `[]`, rename, replacement and a changed catalogue prove the `:155` snapshots | model | **3.5** |
| EW-16 | DOM: both doors, the before, after and date copy, the invalid, saving, saved and refusal states, keyboard labels and focus, narrow viewport, no new shell; copy census forbids em and en dash, emoji and exclamation marks | view | C-UI-9 |

### 5.1 The composed cell, named exactly

EW-14 and the three EW-17 cells run through the REAL host composition and the REAL durable client,
not a projector helper and not a redraw. Concretely: the new `createEditWeekEntry` from
`today-entry.mjs` over `createPlanEditHost` (`plan-edit-host.mjs:42`) over the W6 durable public
client, with `fake-indexeddb` and `@peculiar/webcrypto` as the environment and an injected athlete
clock, exactly the composition the part 1 reviewer's own twenty cells used (`:473`). FIXTURES ARE
SYNTHETIC: a generated enrolled athlete, a generated setup document, a generated history file. No
private fixture, no real measurement, no owner data, ever, in any cell or any log line.

### 5.2 What a red cell means here

The suite must be red before the screens exist, and the report must show the red run. `:176`'s custody
line stands: D2 independently executes the accepted bar BEFORE reading the builder's report. A green
run that does not contain the EW ids is not this bar. A cell listed as blocked in the table above is
written RED and left red with its reason named in the report; it is never deleted to make a run green.

---

## 6. THE BAR

1. The sixteen cells of section 5, individually selectable, green at the exact candidate head, with
   the red first run shown. A cell blocked by 3.4 or 3.5 is red with its reason named, never removed.
2. The inherited suites green at that same head, named by real path with their cell counts: the Today
   suite, check in, sleep, workout, the machine note suite, the plan edit lane suites, W6, coach and
   client. A builder that cannot name a path does not get to claim its count.
3. Both OS CI green (`rebuild-public`, ubuntu and windows), with the CI ids that actually cover the
   new suite. Registering the suite is a hunk in the PINNED `.github/workflows/rebuild.yml` (3.3 line
   7), authored by the PM on the S10 child; this spec grants no `.github` custody to any lane.
4. The two design gates green for the states covered, `python3 quality/gate.py` and
   `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build.
5. Zero U+2013 and zero U+2014 in every file the build authors, proved by a count, not by a claim.
6. D2's independent implementation review at an exact branch and head (`:176` (2)). It is a SECOND
   obligation on top of the screens tier's own blind reviewer, not a substitute for it.
7. For the VIEW half: no diff outside the six new files, the `t-edit-week` block and `preview.css`.
   For the WIRING half: no diff outside `today-entry.mjs` and `today-app.cjs`, and the runner's
   `UNLISTED-PRODUCT-DRIFT` check is the proof, not a reading of the diff. This clause binds the
   LANE's diff. The S10 child additionally carries the `.github` hunk (3.3 line 7), section 3.5's F2
   package and section 4.4's two sealed hunks, each under its own custody and its own review.

---

## 7. WHAT WAITS, AND WHAT CAN BE BUILT NOW

### 7.1 Can start today, in parallel with the look, with no collision

- `edit-week-model.mjs`: the pure state machine over the five host replies of section 2.1. It holds
  the draft, maps every refusal code of section 2.2 to a state, and touches no DOM and no store. It
  is testable without a browser and without the look.
- `edit-week-basis.mjs` (3.4) and its own cells. It is a new unpinned file and it does not need the
  sealed hunk to exist in order to be written and proved against a fake host.
- The whole suite skeleton with all sixteen cells written RED, against the merged companion, whose
  API is sealed and will not move under the builder.
- EW-17a and EW-17b to their answer, and section 4's fix authored by its own lane if the answer is red.
- `edit-week-check.mjs` in the existing `*-check.mjs` pattern.

None of this depends on a pixel. This is the real parallel work and it is roughly half the build.

**WHAT CANNOT START, and v1 said it could (R1 B3):** EW-04, EW-15 and EW-17c are BLOCKED until
section 3.5's F2 package lands, because `add` and `replace` cannot be made green by any code that
exists in the tree. A builder that follows a plan without this note writes EW-04, watches it refuse
`PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE`, and has nowhere to go. Write them red, with 3.5 named as
the reason, and move on.

### 7.2 Waits, and on exactly what

| what | waits on | why |
|---|---|---|
| the editor's look, every state | a design ticket that does not exist: C-UI-9 (section 8) | building to the 2026-09-12 brief's numbers buys a second port of the whole editor |
| `preview.css`, any style hunk | S9 sealing, because it is released only then | `:536` (1): the release happens INSIDE S9, never by editing a sealed artifact |
| `build.mjs`, if a new bundle input is needed | S9 sealing WITH hunk H18 | S9 A.6: without H18 the closed list is one path and `build.mjs` stays sealed |
| the Machine settings door's rendering | C-UI-5, **AND whichever reseal child carries C-UI-5's own sealed files** | C-UI-5's MAY CHANGE list (`C-UI-5.md:8-9`) is `machine-settings-view.mjs`, `machine-settings-host.mjs` and "the gym stubs in `gym-app.mjs`". The last two are in `product` and S9 does not release them (its closed list is two paths), so C-UI-5 is itself a reseal-child ticket. S9's own A.3 says the same. Part 2 still takes ZERO bytes there; the WAIT is longer than v1's row said (R1 N9) |
| EW-04, EW-15, EW-17c | section 3.5's F2 package on S10 | no `projectNewExerciseTags` or `validateTags` exists in product |
| EW-14 | 3.4's sealed hunk on S10 | a route and a mount do not change what the gym card opens on |
| the entry point binding | C-UI-2 and S9-TODAY-CARRY finishing their `today-app.cjs` hunks | `:539` (2); three hands want that file this week and part 2 goes last |
| the wiring half landing | the S10 child | `today-entry.mjs` and `today-app.cjs` are sealed and S9 does not release them |

---

## 8. THE DESIGN LANE'S LIST, AND THE ONE OWNER QUESTION

### 8.1 The finding, verified independently and re-verified in v2

The design of record `rebuild/m1/approved-2026-09-18/` contains ZERO references to Edit My Week: a
case insensitive search over the whole directory for "edit my week", "edit week" and "my week"
returns no file. The eight UI port tickets `rebuild/lanes/c/ui-port/C-UI-0.md` to `C-UI-8.md` also
return zero. C-UI-5's machine settings editor is the WORKOUT panel (its own title line: "Workout
panels: the stubs and the machine settings editor (W-01..W-04, W-30, W-31, W-33..W-41, W-44)"), not
this door. C-UI-2 is LOCKED at its line 11: "the weigh-in stays inline (ruling 5); the stack is
Start, Recovery, Talk and nothing else."

So the entry point is an OPEN SLOT that belongs to the design lane and, for where it lives, to the
owner. This spec therefore specifies behaviour, states, copy and cells, and invents no look. R1
probed this section hardest and could not break it; it is unchanged in v2 except for item 12.

### 8.2 What C-UI-9 must draw, the complete list

1. The entry affordance, wherever the owner puts it (8.3), in its normal and its "a change is already
   saved for {date}" form.
2. The editor chassis: is Edit my week a panel over the parent at the 716 thumb edge, like every
   C-UI-5 panel, or a full screen route? The answer sets the back and cancel behaviour.
3. The door chooser, two doors, with the intro `What would you like to change?`.
4. The exercise list row: name, day and set count, plus the selected state.
5. The exercise action group: `Edit exercise`, `Replace exercise`, `Remove from week`, plus
   `Add exercise` at list level.
6. The field editor for `n`, `day`, `sets`, `hi`, `inc`, `steps`, with the existing setup field error
   treatment, and the DISABLED form of whichever fields and actions the interim of 4.3 ruling 5
   withholds if 3.4 and the admission fix do not ride one child.
7. The destructive confirm for `Remove from week`, carrying `This exercise will leave your week on
   {date}. Your old sessions stay in your history.`
8. The review face: `Current` beside `After this change`, with `Starts {date}` above them, and the
   action group `Save change`, `Keep editing`, `Cancel`.
9. The saving, saved (`Saved for {date}.` and `Saved on this device.`), stale, day turned and durable
   refusal states, all with the draft visibly retained.
10. The Machine settings door, which should REUSE C-UI-5's editor rather than draw a second one; if
    the design lane decides otherwise, that is a new file and this spec's section 3 changes.
11. The narrow viewport form of all of the above, and the keyboard focus order.
12. **The E0 refusal face for the 2.2.1 boundary**, where the athlete has synced or has a plan and
    the editor will not open at all, and **the state X face for the four unsentenced codes of 2.2.2**,
    whose sentences the PM must seat first (Q-F).

### 8.3 THE OWNER QUESTION, in plain words

> When you want to swap an exercise or change a machine setting, where should the button live: on
> your main screen, or inside the workout?

**Recommendation: inside the workout.** The reason is the owner's own reason for narrowing the scope
at `:176`: "a beginner's first real need is 'this machine is taken, swap the exercise'". That happens
in the gym, standing at the machine, inside a session, not on the morning Today face. Putting it
inside the workout also costs nothing that is already decided: it does not touch C-UI-2's locked
line, it puts the door next to C-UI-5's machine settings editor which it reuses, and it leaves the
Today face free for a second way in later if he wants one. The cost of the other answer is a LOCKED
line reopened and a design round to reopen it.

Route: the PM takes this to the design chat as C-UI-9 first, and only to the owner if the design
chat cannot seat the editor without changing a locked line. Ledger shows no answer because it has
never been asked.

---

## 9. STOP CONDITIONS, RISKS, ESTIMATE

### 9.1 STOP conditions. Any one of them stops the lane and comes to the PM the same hour.

1. The editor cannot be seated without changing a C-UI LOCKED line.
2. S9 is accepted with a closed list that differs from the two paths of section 3.1, or S9 is not
   accepted at all. The split changes and this spec is re-judged before a byte moves. (S9 is at
   REJECT R2 today; neither of its blocking findings moves the list, but acceptance is not given.)
3. `plan-edit-host` as merged cannot satisfy EW-14 through the real host composition.
4. Any need to change a sealed byte, a package, a receipt, the ledger, the engine or the coach,
   beyond the hunks section 3.3 line 2, 3.3 line 7, 3.5 and 4.4 name under their own custody.
5. Any EW-17 cell comes back in a third shape that is neither of section 4's two outcomes.
6. A taste fork on the look (`:539` (2)).
7. Any temptation to widen back to four doors. Days and Priorities are v1.1 and Days additionally
   waits on F1 and on owner question Q3.
8. ANY new copy sentence at all (2.3 law 4), including a guess at one of the four codes in 2.2.2.
9. **NEW in v2.** 3.4's adoption read costs more than one extra durable reopen per adoption, or
   `edit-week-basis.mjs` cannot return the unchanged state on every refusal path. Either means the
   composing module is doing more than composing, and option (b) is no longer the cheap answer.
10. **NEW in v2.** Section 3.5's F2 package cannot land on S10, or lands at a path other than
    `rebuild/m4/workout/setup-tags.cjs`. Three cells and one door's two actions depend on it.
11. **NEW in v2.** The admission fix's folded state cannot be kept out of the returned basis
    (4.3 ruling 3). That constraint is not negotiable and a fix that breaks it is not shipped.

### 9.2 Risks

| # | risk | the guard in this spec |
|---|---|---|
| 1 | the missing design; building to the old preview numbers buys a second port | section 8; the VIEW half's model and cells carry no look |
| 2 | S9 does not release what the plan assumed; six of seven UI tickets already face this | section 3.1 and STOP 2 |
| 3 | stale line cites from the 2026-09-12 brief and from the part 1 report | every cite in this file re-measured at `724ef3fc`; `:522` named in 4.4; R1 N1's own corrections applied |
| 4 | the four door trap | section 1.1 restates the narrowing in its own words |
| 5 | the provenance defect fixed in the wrong file, or in one check of three, or not at all | section 4.1.1, 4.3 ruling 2, and three red cells first |
| 6 | lane collision on `today-app.cjs`, live right now | section 3.3 line 3: under 55 added lines, zero removed, and part 2 goes last |
| 7 | `browser-check.mjs` treated as evidence while it is stale red with no CI home | section 2.3 law 3 |
| 8 | the estimate read as elapsed time | 9.3 |
| 9 | **NEW.** the screens ship and the edit reaches nothing, because the route and the mount looked like the whole wiring half | section 3.4, and EW-14 blocked on its hunk rather than quietly passing on a redraw |
| 10 | **NEW.** a second spelling of the tag taxonomy, or of edit semantics, written page-side or admission-side because the real one was unmerged or awkward to reach | 3.5 consequence 2, 4.3 ruling 2, and `plan-edit-model.cjs:61-63` quoted in both |

### 9.3 Estimate, in hours, and no elapsed time promise

| work | hours | v1 |
|---|---|---|
| VIEW half: model, view, check, the `t-edit-week` block | 7 to 9 | 7 to 9 |
| VIEW half: `edit-week-basis.mjs` and `edit-week-tags.mjs` with their own cells | 2 to 3 | not priced |
| the suite: sixteen cells including the composed ones and the three EW-17 | 9 to 11 | 7 to 9 for fourteen |
| WIRING half: the two sealed hunks (route, mount, and 3.4's adoption `.then`) and their proof | 3 to 4 | 2 to 3 |
| one independent review round plus the fix round | 5 to 6 | 4 to 5 |
| D2's separate implementation review (`:176` (2)) | 2 to 3 | 2 to 3 |
| **EW2-BUILD total** | **28 to 36 hours of model time** | 22 to 29 |

Not counted above, because they are shared or not this lane's:

- section 4.4's admission hunk, TWO sealed files, **4 to 6 hours plus its own review round** (v1
  priced it at 2 to 3 for one line in one file);
- section 3.5's F2 package landing at `rebuild/m4/workout/setup-tags.cjs`, another lane's, with its
  own review and the PE-f2-identity re-point;
- section 3.3 line 7's `.github` registration, the PM's;
- the S10 chain, which S8 measured at about 2.5 hours of preparation plus about 35 minutes for chain
  A and about 1 hour for chain B, shared across three items.

The brief's own "about two builder days after dependencies" was written for BOTH parts, before three
seals, a real import, a full UI port and a narrowing. Part 1 alone merged as 20 files and +3168 lines.
Treat two builder days as the floor for part 2, not the ceiling.

### 9.4 Open questions for the PM, each with a recommendation

| # | question | recommendation |
|---|---|---|
| Q-A | S9's closed list is two paths and `today-app.cjs` stays SEALED, so part 2's wiring half needs S10 whatever happens. S9's own OWNER-1 asks the owner whether to SPLIT `today-app.cjs` into a released `today-view.cjs` and a sealed writer. If he says yes, part 2's view half grows and its wiring half shrinks. | **Do not wait for that answer to start.** Section 7.1's work is identical under both outcomes. Re-judge section 3 when OWNER-1 lands, not before. Note that 3.4's adoption `.then` sits in the WRITER half either way, so the wiring half never reaches zero. |
| Q-B | Does the PM accept the ruling of 4.3 (extend provenance to a folded plan basis, three checks, do not refuse at the edit), and do 3.4's hunk, 3.5's package and 4.4's two hunks all ride S10 together? | **Accept, and ride S10 together.** Splitting them forces the interim of 4.3 ruling 5, which now withholds `add`, `replace`, `remove` AND `sets`, which is the whole narrowed v1 need. A part 2 that ships without them ships an editor that cannot swap an exercise. |
| Q-C | Does EW2-BUILD start before C-UI-9 exists, on the VIEW half's model and cells only? | **Yes.** Section 7.1 is roughly half the build and carries no pixel. Holding the whole item for a design ticket that has not been filed is the expensive choice. |
| Q-D | `:176` (2) says "lane C builds the editor after N2". Does that still bind now that the UI port replaced the preview lane's queue? | **Ask the PM to restate it.** This spec assumes lane C still builds and D2 still reviews, which is the part that matters, but the "after N2" clause was written against a queue that no longer exists. |
| Q-E | `design.cjs` and `today-model.cjs` are named as release candidates at `:536` but are NOT in the S8 `product` map at all (verified by the 3.2 query). S9's Q3 raises the same point for four writing files that stand outside the seal. | **Not this lane's call, but the PM should not let `:536`'s candidate list be read as a pin list.** Five of its eight names need no release. |
| Q-F | **NEW in v2.** Four refusal codes reach the athlete in the narrowest door with no true sentence anywhere: `PLAN_EDIT_WEEK_EMPTY`, `PLAN_EDIT_BASIS_SOURCE_CHANGED`, `PLAN_EDIT_BASIS_HASH_INVALID`, `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` (2.2.2). This spec will not invent them. | **Seat all four in the copy inventory before EW-05 ships**, through whoever owns the inventory, not through a lane hand. The interim is state X's existing actionable refusal treatment, which never says Saved and never claims his week changed when it did not. |
| Q-G | **NEW in v2.** Section 3.5 found the tag provider is not missing but UNMERGED: lane D's F2 package, `rebuild/m4/workout/setup-tags.cjs` at `f3e9561`, byte-identical to the pinned lane copy. Who lands it, and on which child? | **Land it on S10, by lane D, with its own review.** It is the file's own author's package and the identity cell already exists to prove the blob. Three of part 2's cells and both of the Exercises door's creating actions wait on nothing else. |

### 9.5 What this spec did NOT do

It ran no test, installed nothing, launched no browser, and changed no product, test, tooling or
workflow byte. It did not read `rebuild/conform/private`, any `ledger/` directory, `src/history.js`,
the protected soak or any of the owner's measurements, on either machine. The seal artifact was
queried by a script that printed counts and per-path YES/NO only; its contents were never printed.
`f3e9561` was not fetched: it is not an object in the farm mirror and the include list is not a thing
to work around. No credential appears in it. The reading was done in the PM's cloud farm mirror at
`724ef3fc`; the writing, the commit and the push were done on the owner's PC.

---

## 10. R1 FINDINGS: FIXED OR DISPUTED

Review under answer: `rebuild/lanes/d2/EW2-SPEC-REVIEW-R1.md` at `0695493`, VERDICT REJECT, six
BLOCKING and ten notes. **Fifteen FIXED, one FIXED IN SUBSTANCE WITH ITS STATED METHOD DISPUTED.**

I re-derived every finding from the tree at `724ef3fc` rather than accepting the review's account of
it, and I could not break any of the six blocking ones. R1 is a good review: four of its six findings
are holes the author could not see from inside the document, and B3 in particular turned out to be
LARGER than R1 said, not smaller (10.1, B3).

### 10.1 The six BLOCKING

| # | verdict | what changed, and what I verified before changing it |
|---|---|---|
| B1 provenance ruling covers one of three checks | **FIXED** | Verified all four checks in the one `resolveCapturedLayout` callback at the tip: `capture_producer` `:598` (safe), `capture_lift` `:614` (reads the ADMITTED `state` through `liftAttach`), `capture_sets` `:665` (reads `documentSets`), `capture_membership` `:695-:699` (compares pool and order against `sessionMembership(documentProgramme.state, originalDay)`). New section **4.1.1** rules on all four by name in a table. **4.3 ruling 1** extends all three broken ones through one fold. EW-17 became **EW-17a, EW-17b and EW-17c** (4.2), each asserting its own field by name, each with its own control, and 4.2 names the ordering trap that `capture_lift` runs first. The suite is sixteen cells. ADDED beyond R1: the three breaks are CONTINGENT on 3.4 shipping, because before 3.4 the gym card never prescribes an edited shape, so 4.1.1 states that dependency and 9.4 Q-B keeps them on one child. |
| B2 EW-14 cannot be met by the wiring half described | **FIXED** | Verified the whole chain: `today-app.cjs:2482` `athleteBasisState`, `:2490` `adoptAthleteState`, `today-model.cjs:412` `adoptBasis` (assigns `basis`), `:219` `stateFromOps` (`clone(basis)`), `gym-model.mjs:104` (`hostForDay` rereads at call time). Also verified that NOTHING in product consumes the operation: `grep -rn 'exercise-edit'` returns the field constant at `plan-edit-commands.cjs:4` and two lane D cells. New section **3.4** names the chain, prints the three options, **chooses (b)**, gives the exact four-line `.then`, names the new module `edit-week-basis.mjs` and its one function, forbids it from re-deriving anything, and states its cost. `local-source-basis.mjs` is now a row in the 3.2 table (in `product`, SEALED by name at `:536` (2)) with "NOT TOUCHED" as its half. 3.3 line 3 re-priced 40 to 55 added lines; 9.3 re-priced; EW-14 is marked blocked on that hunk in the section 5 table. |
| B3 EW-04 and EW-15 have no tag provider | **FIXED, and the finding was larger than stated** | Verified both dependencies: `plan-edit-commands.cjs:66` (`validateTags`, unconditional for `add` and `replace`) and `plan-edit-model.cjs:349` (`projectNewExerciseTags`, SAVE path only, `:357` takes the review path, which is a worse discovery order and is now written down). Verified the single implementation `f2-tag-adapter.cjs:64/:195` and its `product` pin. **NEW EVIDENCE R1 did not have:** `model.test.cjs:511-:515` proves that lane file sha256-equal to `rebuild/m4/workout/setup-tags.cjs` at `f3e9561`, `durable-host.test.mjs:24-:32` says so in words, and `PLAN-EDIT-V2-AUTHOR-REPORT.md:8` names lane D's separate UNMERGED F2 package as the reason it is not on the tip. So the ruling is neither of R1's two options: **land the existing package at its intended product path** (3.5), because a new page-side provider would be a second spelling of the taxonomy. 3.5 also adds EW-17c to the blocked list, which R1 did not have because EW-17 was one cell. 7.1 says what cannot start. |
| B4 the fix priced at one line with no derivation | **FIXED** | Verified that the callback is handed `ops` at `:438` and nothing else, that `plan-edit-model.cjs` exports only `createPlanEditProjector`, `importPresentIn`, `planEditCollections` and `P2_ROW` (`:397-:398`), so no folding function exists to call, and that `apply()` is at `:319` with `exOrder` maintained at `:315`. Verified the out-parameter comments verbatim at `:222-:228` and `:229-:237`, including "that object is the programme digest's input at `:325`". **4.3 ruling 2** names the exported function `foldPlanEdits(documentState, ops, onLocalDate)` and quotes `plan-edit-model.cjs:61-63` as the reason it must not be re-spelled in admission. **4.3 ruling 3** makes digest invariance a constraint the fix must satisfy and the first thing its reviewer checks. **4.4** re-prices at two sealed files, 4 to 6 hours plus review, and STOP 11 refuses a fix that breaks the constraint. |
| B5 state D invents a sentence already in the code | **FIXED** | Verified `plan-edit-host.mjs:23-:24` and the comment at `:20-:22` ("the honest sentence travels with the code rather than being reconstructed"). State D now carries `The day changed while this was open. Review the latest week before saving.` verbatim, marked **SOURCED FROM CODE**. Law 4 now reads **ZERO new sentences**, and 2.2.2 lists the four codes that have none rather than inventing any. STOP 8 was widened to any new sentence at all. |
| B6 reachability asserted as fact | **FIXED** | Verified `grep -rn 'createPlanEditHost' rebuild`: the export at `plan-edit-host.mjs:42`, two Astra annexes, four lane D cells, nothing else. Verified `today-entry.mjs`'s exports one by one (`:42`, `:49`, `:93`, `:150`, `:226`, `:471`, `:505`, `:533`): nothing plan-edit shaped. Verified `:510`'s "reachability open" and that `:532` says nothing about it. The authority line and new section **4.0** now state the measured position: unreachable today, reachable the day the wiring half ships. **The schedule did not move**, exactly as R1 asked. |

### 10.2 The ten NOTES

| # | verdict | what changed |
|---|---|---|
| N1 cite drift in two tables | **FIXED** | Re-counted at the tip: `read` `:162`, `review` `:163`, `cancel` `:252`, `close` `:253`; `editOf` `:69`, `update` `:71-:74`, `remove` `:75`, `add` and `replace` `:76-:79`. R1's diagnosis was right: v1 read the returned handle, not the definitions. 2.1 says so in words so the next hand does not repeat it. |
| N2 the seal query counts the wrong set | **FIXED IN SUBSTANCE; THE STATED METHOD IS DISPUTED.** See 10.3 |
| N3 the second pinned `build.mjs` | **FIXED** | Both verified in `product`. `rebuild/m3/w7-preview/build.mjs` is now a row in 3.2 saying which one this item touches (`today/build.mjs`, for a preview bundle input) and why the other is named at all. |
| N4 the CI registration belongs to no half | **FIXED** | `.github/workflows/rebuild.yml` verified in `product`. It is now a row in 3.2 and **3.3 line 7**: it rides S10, authored by the PM, and 6.7's "no diff outside" is explicitly scoped to the LANE's diff so the clause no longer forbids the child's own hunks. |
| N5 two in-scope refusals have no sentence | **FIXED** | `BRIEF-EDIT-MY-WEEK.md:61` verified: `Choose a training day for each exercise before saving.` is now in E5, marked SOURCED, against `PLAN_EDIT_DAY_UNCOVERED`. `PLAN_EDIT_WEEK_EMPTY` (`plan-edit-model.cjs:341`) has no sentence anywhere and v2 does NOT invent one: 2.2.2 rules it to state X, offers the affordance that avoids it, and files it as Q-F. |
| N6 state T merges six codes under one sentence | **FIXED** | Verified each: `BASIS_SOURCE_CHANGED` `plan-edit-host.mjs:77` (the basis SOURCE changed, the week did not), `BASIS_HASH_UNAVAILABLE` `plan-edit-model.cjs:101`, `BASIS_HASH_INVALID` `:104` (construction and integrity facts), `BASIS_INVALIDATED` `:300` and `:309` (a causal parent stopped being active, or the seen basis disagrees, which IS a week that changed). State T now draws **three** codes with the brief's sentence; the other three go to state X and into 2.2.2. |
| N7 the pre-sync boundary is never stated | **FIXED** | Verified `plan-edit-model.cjs:226`, `:227`, `:235`, `:237-:238`, `:242-:243`. New section **2.2.1** states the rule in words ("v1 is a PRE-SYNC, LOCAL-ONLY editor"), and EW-01 now asserts it in both directions. |
| N8 `MACHINE_SETTINGS_INPUT_INVALID` is a throw | **FIXED** | Verified `rebuild/coach/machine-settings-commands.cjs:39`, `const bad = () => { throw new TypeError(...) }`. M2's row now says the screen CATCHES it. |
| N9 the Machine settings door waits longer | **FIXED** | Verified `C-UI-5.md:8-9`'s MAY CHANGE list and that two of its three files are in `product` while S9's closed list is two other paths. 7.2's row now says the door waits on C-UI-5 AND on whichever child carries C-UI-5's own sealed files. Part 2 still takes zero bytes there. |
| N10 two reductions earned but not claimed | **FIXED** | Verified `today-bindings.mjs:723` `liveDay()` and `setup-host.mjs:45` `setupsIn(generation, profile)` plus its default export at `:131`; verified `rebuild/m3/w7-preview/today/setup-host.mjs` is in NEITHER `product` NOR `executionPins`. New section **3.6** claims both, with the correct full path (R1 gave the file name without its directory, and there is no `setup-host.mjs` under `rebuild/m3/w6/host/`). |

### 10.3 The one DISPUTE, with its measurement

**N2's recommendation is adopted in full. Its stated diagnosis of v1's method is wrong, and I can
show it.** R1 says v1's "229" was "every `rebuild/`-shaped string ANYWHERE in the artifact", and that
the real union of the pin sets is 227.

Measured at `724ef3fc`, by script, without printing the artifact:

```
product 224 | executionPins 71 | protectedSurfaces 2
union(product, executionPins)                    = 227
union(product, executionPins, protectedSurfaces) = 229
distinct rebuild/-shaped strings ANYWHERE        = 242
```

So v1's 229 is exactly the union of the THREE pin key sets, which is a defensible set to build and
not a careless regex sweep; and R1's own 227 is the union of two of the three, having dropped
`protectedSurfaces`, whose two members ARE `rebuild/`-shaped. Neither number is the 242 R1 attributes
to v1.

**Why I adopt the recommendation anyway, and it is the part that matters:** R1 is right that a single
merged set is the wrong thing to report, because `product` is the pin list a reseal child exists to
move while `executionPins` are test and spec pins with different consequences, and a future hand
reading "229" cannot tell which column answered its question. Section 3.2 now names all three sets
with their counts and answers every row against `product` alone. I also re-ran every row of the 3.2
table against `product`: R1's own re-run was correct, **every YES and NO in v1's table was right**,
and the four rows v2 adds were queried the same way.

R1's other credits stand unchanged and are not re-litigated here: sections 8.1, 3.1 and the SOURCED
half of the copy table were probed hard and held, and its ten "could not break" items are recorded in
the review file for whoever runs R2.

### 10.4 What v2 did not change

Sections 1, 5.1, 5.2, 6 (except clause 1's count, clause 3's CI custody and clause 7's scoping), 8.1,
8.3 and 9.1 items 1 to 8 are v1's, because R1 could not break them and neither could I. The
recommendation to the owner in 8.3, the choice of S10 as the child, and the refusal to invent a look
are unchanged.
