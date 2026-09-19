# EW2-SPEC: EDIT MY WEEK, SCREENS PART 2

Lane D2, SPEC ONLY. Author: cowork (Earned lane hand), Opus, 2026-09-19. Branch `rebuild/d2-ew2-spec`
cut from the chain tip `0794771`. No product, test, tooling or workflow byte moves on this branch.

This is a hypothesis for the PM to judge and for an independent reviewer to disagree with. Every
line cite below was re-measured at `0794771`; the 2026-09-12 brief's own cites were written against
source base `361ea25` and three seals have landed since, so none of them is carried forward unread.

Authority: `DECISIONS:176` (the brief accepted by name with three rulings), `:473` and `:474` (part 1
merged), `:510` and `:519` (the carried provenance defect), `:532` (the owner has imported, so the
defect is reachable), `:536` (screen files released from the seal), `:540` (this dispatch).

Read before this file: `rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md` (the brief of record, 101 lines) and
`rebuild/lanes/b/S9-RELEASE-SPEC.md` at `rebuild/b-s9-ui-pins@c0bb04e9` (the release list, which
decides half of section 3 and is not yet accepted).

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
EW-16. Thirteen. This spec adds one more, EW-17, in section 4.

NOT IN SCOPE, and it is v1.1, briefed by D2 when v1 merges (`:176` (c)):

| out | why |
|---|---|
| the Days door | v1.1. It also depends on F1 full body and on owner question Q3 (Dad's training days), neither of which is settled. |
| the Priorities door | v1.1. |
| cells EW-06, EW-07, EW-10 | they test Days, midnight composition of structural edits, and priorities. |
| clearing the last machine note | `:176` ruling (b), DEFERRED, accepted. The screen refuses it with the brief's own sentence. |
| any change to the plan-edit companion | it is merged (`:474`) and sealed. Part 2 CALLS it and changes not one byte of it. |
| any engine, coach, admission, import or store byte | except the one admission hunk section 4 rules, which is lane D or lane B work riding the same child, NOT lane C's and NOT in EW2-BUILD's diff. |

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
`plan-edit-model.cjs`), plus their DOM and copy cells, plus the consumer refresh, plus the suite and
its CI registration. Nothing else exists for this item anywhere in the tree: `edit-week*` matches no
file at `0794771`, and the brief's own proposed suite path
`rebuild/m3/w7-preview/today/test/edit-week.test.mjs` does not exist.

---

## 2. THE SCREEN STATES AND THE VERBATIM COPY

### 2.1 The companion surface the screens are allowed to touch

Measured at `0794771` in `rebuild/m3/w6/host/plan-edit-host.mjs`. The page gets exactly five methods
and nothing else. It never builds an operation, never reaches the client, never touches IndexedDB.

| call | line | returns on success | returns on refusal |
|---|---|---|---|
| `host.read(date?)` | `:208` (`async read`) | `{ read:true, state, plan_basis, pending_dates, intents }` | `{ read:false, ...refusal(code) }` |
| `host.review(edit)` | `:209` (`async review`) | `{ reviewed:true, review_id, intent_id, starts_on, current, before, after, plan_basis, edit }` | `{ reviewed:false, ...refusal(code) }` |
| `host.save(review_id)` | `:190` (`async save`) | `{ ok:true, acknowledged:true, op_id, intent_id, starts_on, edit }` | refusal; the STALE refusal also carries `current`, `plan_basis`, `pending_dates`, `starts_on` (`:215-:217`) |
| `host.cancel(review_id)` | `:254` | drops the review, writes nothing | n/a |
| `host.close()` | `:255` | every later call refuses `LOCAL_CLIENT_CLOSED` | n/a |

The host is constructed at `plan-edit-host.mjs:42` and REQUIRES `client, clock, liveDay, basisState,
setupOperation, validateTags, projectNewExerciseTags, newIntentId, athleteLabel, namespace`. Missing
`athleteLabel` or `namespace` is `PLAN_EDIT_HOST_INCOMPLETE` (`:53`), deliberately, because defaulting
them would silently widen `admittedLocalSourceBasis` from "this athlete's admitted import" to "any
admitted import" (the comment at `:46-:51`). The page passes them beside `admittedLocalSourceState`.

The edit shapes the page may build, from `plan-edit-commands.cjs:69 editOf`:

| kind | shape | line |
|---|---|---|
| update | `{ kind, exercise_id, changes }`, changes a non empty subset of `n, day, sets, hi, inc, steps` | `:71-:75` |
| remove | `{ kind, exercise_id }` | `:76` |
| add | `{ kind, exercise, tags }` | `:77-:81` |
| replace | `{ kind, exercise_id, exercise, tags }`, and `exercise_id !== exercise.id` or it refuses | `:77-:82` |

Field law, `plan-edit-commands.cjs:47 fieldOf`: `id`, `n`, `mg` are non empty text; `day` is `'U'` or
`'L'` and nothing else; `sets` and `hi` are safe integers of at least 1; `inc` is finite and positive;
`steps` is a non empty, strictly ascending array of positive numbers. The editor uses THESE, not
setup's starter chips, because an established athlete's values may sit outside the chips (brief,
Exercises paragraph) and coercing them is EW-02's failure.

### 2.2 The states, the copy, the call and the refusals

Copy marked SOURCED is verbatim from the accepted brief's "Exact copy" table and may not be reworded.
Copy marked NEW is invented by this spec and must enter the implementation copy inventory, as the
brief's Validation row requires. `{date}` and `{name}` are actual values, never left in the UI.
No copy in this file or proposed by it contains a dash character of any kind.

| state | copy | call | refusals it must draw |
|---|---|---|---|
| E0 Entry | SOURCED title `Edit my week`; SOURCED intro `What would you like to change?`; SOURCED doors `Exercises` and `Machine settings` (two, not four); SOURCED, when a pending edit exists, `Changes already saved for {date}` | `host.read()` on open, once | `PLAN_EDIT_READ_REFUSED`, `PLAN_EDIT_IMPORTED_BASIS_MISMATCH`, `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`, `PLAN_EDIT_HOST_INCOMPLETE`, `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`, `LOCAL_CLIENT_CLOSED` |
| E1 Exercise list | SOURCED `Choose an exercise` and `Add exercise`; each row shows the lift's own current name, day and set count from `read().state` | none; pure render of the state E0 already read | none; a list that cannot render is E0's refusal, not its own |
| E2 Exercise actions | SOURCED `Edit exercise`, `Replace exercise`, `Remove from week` | none | none |
| E3 Edit exercise | SOURCED label helper `Changing the name keeps this exercise's records.`; the six editable fields of 2.1 with the existing setup field errors verbatim | `host.review({kind:'update', ...})` on `Review change` | `PLAN_EDIT_INPUT_INVALID`, `PLAN_EDIT_NO_CHANGE`, `PLAN_EDIT_TARGET_UNAVAILABLE`, `PLAN_EDIT_DATE_INVALID`, `PLAN_EDIT_STALE_BASIS` |
| E4 Replace | SOURCED `The new exercise starts without a recorded load. Your old sessions stay in your history.` | `host.review({kind:'replace', ...})` | the E3 set plus `PLAN_EDIT_ID_REUSED`, `PLAN_EDIT_TAGS_INVALID`, `PLAN_EDIT_TAG_BASIS_UNPROVEN`, `PLAN_EDIT_NEW_TAG_PROJECTION_INVALID`, `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` |
| E5 Remove | SOURCED `This exercise will leave your week on {date}. Your old sessions stay in your history.` | `host.review({kind:'remove', exercise_id})` | the E3 set plus `PLAN_EDIT_WEEK_EMPTY`, `PLAN_EDIT_DAY_UNCOVERED` |
| E6 Add | SOURCED `Add exercise`; setup's muscle vocabulary and field components reused from `setup-model.mjs`, its document writer never called | `host.review({kind:'add', ...})` | the E4 set |
| E7 Unchanged draft | SOURCED `Nothing has changed yet.` | the refusal `PLAN_EDIT_NO_CHANGE` maps to this sentence; the page does not decide it locally | `PLAN_EDIT_NO_CHANGE` |
| R Review | SOURCED `Starts {date}`, `Current`, `After this change`; SOURCED actions `Save change`, `Keep editing`, `Cancel` | render of `review()`'s `current`, `before`, `after`, `starts_on` | none of its own |
| S Saving | no new copy; the existing in flight treatment. Save is disabled while in flight so one deliberate save is one operation | `host.save(review_id)` | n/a |
| V Saved, structural | SOURCED `Saved for {date}.` | shown ONLY on `{ ok:true, acknowledged:true }` | never shown on any other reply |
| V2 Saved, notes | SOURCED `Saved on this device.` | the Machine settings door's own save | as above |
| T Stale | SOURCED `Your week changed while this was open. Review the latest week before saving.` and the NEW result drawn beside it from the refusal's own `current` and `starts_on` | `PLAN_EDIT_REVIEW_STALE`, `PLAN_EDIT_STALE_BASIS`, `PLAN_EDIT_BASIS_INVALIDATED`, `PLAN_EDIT_BASIS_SOURCE_CHANGED`, `PLAN_EDIT_BASIS_HASH_INVALID`, `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` | the draft survives; nothing is rebased for him |
| D Day turned | NEW: `The date changed while this was open. Review your change again before saving.` | `PLAN_EDIT_DAY_TURNED` (`plan-edit-host.mjs:23`) | the draft survives |
| X Durable refusal | the existing actionable refusal behaviour, unchanged; never the word Saved | `PLAN_EDIT_SAVE_OUTCOME_UNKNOWN`, `PLAN_EDIT_BATCH_MISMATCH`, `PLAN_EDIT_INTENT_CONFLICT`, `PLAN_EDIT_DUPLICATE_INTENT`, `PLAN_EDIT_REVIEW_REQUIRED`, `PLAN_EDIT_PROJECTION_REFUSED`, `PLAN_EDIT_HISTORY_UNPROVEN`, `PLAN_EDIT_ORIGIN_UNPROVEN`, `PLAN_EDIT_REJECTION_UNPROVEN`, `PLAN_EDIT_TOMBSTONE_UNPROVEN`, `PLAN_EDIT_DATE_ORDER_UNPROVEN`, `LOCAL_CLIENT_CLOSED` | the draft survives; lease, storage, integrity and closed era all land here |
| M1 Machine settings, read | SOURCED helper `Keep the settings you want to remember for this machine.` | `machineSettings.latest(exercise_id)`, then `machineSettingsView.draftFrom(latest)` (`machine-settings-view.mjs:28`) | the era and lease refusals the existing host already raises |
| M2 Machine settings, edit | the existing editor rows and cue field, `renderEditor` (`machine-settings-view.mjs:115`), `MAX_ROWS` (`:23`) unchanged | `machineSettings.save(machineFromDraft(draft, exercise_id))` (`machine-settings-host.mjs:93`) | `MACHINE_SETTINGS_INPUT_INVALID` |
| M3 Last note empty | SOURCED `Keep a setting or a cue. Clearing the last note is not available here yet.` | the page refuses BEFORE calling save, using `acceptable(machine)` (`machine-settings-view.mjs:53`); it never claims a blank save erased a note | ruling (b) of `:176` |

### 2.3 Copy laws that bind every string above

1. No U+2013 and no U+2014 anywhere, in the file or on screen. The render boundary is
   `rebuild/m3/w7-preview/today/plain-copy.cjs` (`plainCopy`, `plainOrDrop`), which `today-entry.mjs:30`
   already imports for exactly this rule (`DECISIONS:114` (1)). The editor renders through it.
2. No emoji and no exclamation mark (brief, EW-16).
3. No readiness word. The headline vocabulary check lives in `browser-check.mjs`
   (`headlineVocabulary`, `assertNoDashOnScreen`); note that S9 Q4 records that this file is unsealed,
   stale red at the tip and has no CI home, so EW2-BUILD may NOT treat a green run of it as evidence
   until S9 gives it one. The suite asserts the copy census itself, in its own cells.
4. Exactly ONE new sentence is proposed by this spec (state D). Everything else is SOURCED. A builder
   that finds it needs a second new sentence files it in the copy inventory and stops for the PM.

---

## 3. THE SPLIT: WHICH HALF SHIPS AS LANE C, WHICH HALF RIDES A CHILD

### 3.1 The fact that decides it, and it is newer than the scout report

`DECISIONS:536` released presentation only files from the seal in the owner's words and left the
closed list to S9. S9's spec now exists: `rebuild/lanes/b/S9-RELEASE-SPEC.md` at
`rebuild/b-s9-ui-pins@c0bb04e9` (v2, after one REJECT round). Its section A.6 THE CLOSED LIST is TWO
paths, not eight:

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

and the second is conditional on hunk H18 landing in the same package. `today-app.cjs` is judged
SEALED in S9 A.2, by the owner's own test, with twelve deciding lines: it opens five IndexedDB lanes
(`:513`, `:596`, `:637`, `:2052`, `:1416`) and calls three durable writers from three click handlers
(`recordIntake :1278`, `recordSleep :1807`, the weigh in submit `:1059`). `today-entry.mjs` is judged
SEALED at `today-entry.mjs:141 await host.save(document_)`. `gym-app.mjs` SEALED at `:161-:166`.
`machine-settings-host.mjs` SEALED at `:63-:85`.

**This contradicts the assumption the PM4 scout worked under** ("the VIEW half ships as lane C after
S9, if the S9 closed list in fact releases today-app.cjs and screens.template.html"). It does not
release `today-app.cjs`. The scout's own STOP condition 2 is therefore already triggered, before any
code is written, and the split below is written for the world S9 actually describes.

### 3.2 Every path, checked against the seal by machine

Method, so a reviewer can repeat it: a small script parsed
`rebuild/m4/spec/acceptance-s8-real-shape.json` into the set of `rebuild/...` paths it names (229 of
them) and asked it about each path below by exact string. The artifact's contents were not printed
and are not reproduced here. Exact path, never directory: the prefix
`rebuild/m3/w7-preview/today/test/` occurs many times in that artifact, so a NEW file under it proves
nothing by its neighbours.

| path | in the S8 seal? | S9 verdict | half |
|---|---|---|---|
| `rebuild/m3/w7-preview/today/edit-week-model.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-view.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/edit-week-check.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/test/edit-week.test.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/screens.template.html` | NO | already unsealed; editable today | VIEW |
| `rebuild/m3/w7-preview/today/machine-settings-view.mjs` | NO | already unsealed; C-UI-5 owns it | VIEW, coordinated |
| `rebuild/m3/w7-preview/today/setup-model.mjs` | NO | read only here; vocabulary reuse, its document writer never called | VIEW, no edit |
| `rebuild/m3/w7-preview/today/preview.css` | YES | RELEASED by S9 | VIEW, after S9 |
| `rebuild/m3/w7-preview/today/build.mjs` | YES | RELEASED by S9 only if H18 lands | VIEW after S9 with H18, otherwise WIRING |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | YES | SEALED (`:141`) | WIRING |
| `rebuild/m3/w7-preview/today/today-app.cjs` | YES | SEALED (S9 A.2) | WIRING |
| `rebuild/m3/w7-preview/today/machine-settings-host.mjs` | YES | SEALED (`:63-:85`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | YES | SEALED (`:161-:166`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w6/host/plan-edit-host.mjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-commands.cjs`, `plan-edit-model.cjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m3/w6/local/today-bindings.mjs`, `rebuild/m3/w6/host/workout-host.mjs` | YES | SEALED by name at `:536` | CALLED ONLY, zero bytes |
| `rebuild/coach/machine-settings-commands.cjs` | NO | but `rebuild/coach/**` is SEALED by name at `:536` (2) | CALLED ONLY, zero bytes |
| `rebuild/m3/w6/local/source-admission.mjs` | YES | SEALED by name at `:536` (2) | WIRING, section 4's hunk only |

### 3.3 THE SPLIT IN FIVE LINES

1. VIEW half, lane C, no reseal, buildable NOW: four NEW files (`edit-week-model.mjs`,
   `edit-week-view.mjs`, `edit-week-check.mjs`, `test/edit-week.test.mjs`) plus a `t-edit-week` block
   in the already unsealed `screens.template.html`, plus `preview.css` once S9 seals.
2. WIRING half, SEALED, rides ONE reseal child: `today-entry.mjs` (a `createEditWeekEntry` factory
   beside `createWorkoutEntry:150` and `createSetupEntry:93`, and one call site in `boot():226`) and
   `today-app.cjs` (ONE route in the `[data-go]` router at `:826` and ONE mount call). Two files.
3. The target size of the wiring half is under 40 added lines across the two files and ZERO removed,
   because three hands want `today-app.cjs` this week (`:539` (2) S9-TODAY-CARRY, C-UI-1, C-UI-2) and
   the smallest hunk is the one that merges.
4. `machine-settings-host.mjs` and `gym-app.mjs` take NO hunk: the Machine settings door calls the
   existing exported `createMachineSettingsHost` (`:63`) from the new entry and renders through the
   existing exported `renderEditor` (`machine-settings-view.mjs:115`). If a builder finds it cannot,
   that is a STOP, not a licence to edit a sealed file.
5. The child is S10, shared with N3-MACROS-ENTRY and P4b coaching memory exactly as `:540` (2)
   intends, and it also carries section 4's one line admission hunk. One seal chain for three items.

---

## 4. THE CARRIED PROVENANCE DEFECT, AND THIS SPEC'S RULING

Carried at `:510` ("Edit My Week amends state and writes no second setup op, so a capture recorded
AFTER an edit that moved a set count would refuse capture_sets; reachability open") and again at
`:519` ("Edit My Week part 2 must restate capture provenance for edits that move a set count").
`:532` makes it reachable: the owner HAS imported, so any set count edit he makes from now on sits in
front of any future import, by him or by his dad.

### 4.1 (a) WHICH BASIS SUCH A CAPTURE IS PROVED AGAINST, with the code path

Read at `0794771` in `rebuild/m3/w6/local/source-admission.mjs`:

- `programme(source, ops, { today, documentSets, documentProgramme })` at `:217` builds a scratch
  state from the phone's own FIRST RUN SETUP DOCUMENT and fills the out parameter at `:228`:
  `if(documentSets)for(const ex of scratch.exercises)documentSets.set(ex.id,ex.sets);`
- the caller mints that map at `:431` (`const documentSets=new Map();`) and hands it in at `:438`.
- the capture's own slot counts are tallied at `:614-:618`, deliberately under the DOCUMENT's id,
  before the re-key (the comment at `:615-:617`).
- the refusal is ONE line, `source-admission.mjs:665`:
  `for(const [id,count]of counts)if(documentSets.get(id)!==count)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_sets',exercise_id:id});`
- the reason it reads the document and not the admitted state is the comment at `:620-:664`, and
  `:509` ruled it option (b): "the recorded capture is proved against the programme that PRODUCED it,
  the phone's own setup document". `:681` states the other side: "after option A the state is the
  FILE's", so reading the state would refuse a workout he really did.

**The answer to (a), and it goes in the spec as a rule, not as an implementation detail: a recorded
capture is proved against the SETUP DOCUMENT that this phone ran when the capture was written, and
against nothing else. An Edit My Week update does not write a second setup document. It writes one
plan mutation member, `{ field:'training.exercise-edit', unit:'record', provenance:'athlete_edited',
value:{ profile:'earned/plan-edit/v1', intent_id, starts_on, edit } }`
(`plan-edit-commands.cjs:95-:99`). So after an edit that moves `sets`, the document holds the OLD
count, the gym card prescribes the NEW count, the capture records the NEW count, and `:665` compares
NEW against OLD and refuses, naming the athlete's own lift as the problem.**

### 4.2 (b) THE MISSING CELL

No cell anywhere in the tree walks that order. EW-17 is added to the suite and it is the FIRST thing
EW2-BUILD writes, red, before any screen:

> **EW-17.** Enrolled athlete with an admitted import. (1) Save one Edit My Week `update` that changes
> `sets` for one lift, through the real host. (2) Record a gym session on or after `starts_on`, through
> the real gym path, so the capture carries the NEW slot count. (3) Run admission over a synthetic
> history file for the same athlete. ASSERT the outcome this spec's ruling chose. Also assert the
> control: the same three steps with an edit that changes only `n` (the name) must NOT refuse.

EW-17 settles reachability with evidence before anybody pays for a fix, which is what `:510` asked
for when it called the reachability open. If EW-17 comes back GREEN at the tip, the defect is not
reachable through this path, the fix below is not built, and that fact is recorded in the ledger with
the cell as its proof. The cell stays in the suite either way, as the regression that keeps it shut.

### 4.3 (c) THE RULING, in three lines

1. **EXTEND PROVENANCE TO THE COMPANION'S PLAN BASIS. Do not refuse at the edit.** `capture_sets`
   becomes: a capture's slot count for a lift is admitted if it equals the count the setup DOCUMENT
   prescribed, OR the count an authenticated plan edit whose `starts_on` is on or before the
   capture's own local date prescribed for that lift. Every other branch of `:665` is unchanged, and
   a count matching NEITHER still refuses, which is the corruption the check exists for (D-PF-f5).
2. **Refusing at the edit is the wrong trade and this spec rejects it by name.** The narrowed v1 need
   is "this machine is taken, swap the exercise". Refusing a set count change to protect a future
   import would break the one thing v1 exists for, for every athlete, to guard a path that only an
   importing athlete ever walks. There is also no sentence that is both true for that field and
   actionable by him at the edit: the true sentence describes something that may happen to a file he
   has not chosen yet.
3. **It is never silent, and the non silence is already built.** With the extension, the false
   refusal disappears and the true one keeps its `:510` sentence, which names the field and the lift.
   Until the extension lands, EW2-BUILD does not ship an editable `sets` field: the Exercises door
   ships with `n`, `day`, `hi`, `inc` and `steps` editable and `sets` disabled behind the plain
   sentence the PM approves. That is the interim, not the destination, and it exists only if the two
   cannot ride the same child.

### 4.4 Custody of the fix, and the honest cost

`source-admission.mjs` is PINNED by `acceptance-s8-real-shape.json` and SEALED BY NAME at `:536` (2).
The hunk is therefore NOT lane C's and NOT in EW2-BUILD's diff. It is one line at `:665` plus the
plan basis the companion already computes, authored by lane D or lane B with its own independent
review, riding the SAME S10 child as section 3's wiring half. If the PM splits them across two
children, the interim of ruling 3 applies in between.

One warning for whoever writes it, measured: `plan-edit-model.cjs:173` has already been wrong once in
exactly this family. `:522` records B2, "still compared day/mg the admission no longer proves, so a
corresponded lift on another day admitted, adopted, then Edit My Week refused forever", fixed inside
the S8 round. The part 1 author report and both review files describe a file that no longer exists in
that form. Read `plan-edit-model.cjs` at the tip, never the report.

---

## 5. THE CELL PLAN, RED FIRST

Suite: `rebuild/m3/w7-preview/today/test/edit-week.test.mjs`, run by
`node --test rebuild/m3/w7-preview/today/test/edit-week.test.mjs`. Every cell individually
selectable by its EW id. Fourteen cells: the thirteen `:176` kept, plus EW-17.

Order of writing, and it is not negotiable: EW-17 first and red, because it decides section 4; then
EW-11 and EW-12, because they decide whether the host composition can carry the screens at all; then
EW-14, the composed cell; then the rest. A screen written before EW-11 is green is a screen built on
an assumption.

| cell | what it proves | half it belongs to |
|---|---|---|
| EW-17 | section 4.2, the edit then session then import order | composed |
| EW-01 | an enrolled athlete opens BOTH doors without first run setup; read, open, cancel and no op leave operation and outbox counts unchanged | composed |
| EW-02 | one lift's `sets` changed; every other id, field, established load and tag deep equal; existing non chip values render without coercion | composed |
| EW-03 | rename keeps id, load, era and notes and the historical name lookup; a new eligible session uses the new name | composed |
| EW-04 | replace with a duplicate label: distinct stable id survives retry and reopen; new load unknown; old sessions and records survive | composed |
| EW-05 | dated removal excludes the lift from future scheduling only; open and historical sessions unchanged; unrelated order survives | composed |
| EW-08 | equipment values for the selected lift only; invalid, blank and out of order `steps` use the real validation; no zero, NaN or hidden default | composed |
| EW-09 | machine notes save through the existing coach command and appear on the same id's actual gym card; rename retains them; replacement does not inherit them; empty final note save refuses | composed |
| EW-11 | the actual producer, validator and projector prove identity, domain, effective date, seen basis, actor edit and causal linkage; malformed and stale basis refuse | composed |
| EW-12 | one deliberate save yields one durable edit intent and its complete outbox; injected pre commit failure changes neither; retry does not duplicate; lease, integrity and closed era never show Saved | composed |
| EW-13 | reopen and replay reconstruct current and pending plans; a rejected or tombstoned edit is not still applied by an editor local cache; preexisting history byte equivalent | composed |
| EW-14 | same page commit reaches real Today and the next eligible gym entry with the new operation basis; in progress workout and check in drafts survive | composed, THROUGH THE REAL HOST |
| EW-15 | tagged lift, explicit secondary `[]`, rename, replacement and a changed catalogue prove the `:155` snapshots | model |
| EW-16 | DOM: both doors, the before, after and date copy, the invalid, saving, saved and refusal states, keyboard labels and focus, narrow viewport, no new shell; copy census forbids em and en dash, emoji and exclamation marks | view |

### 5.1 The composed cell, named exactly

EW-14 and EW-17 run through the REAL host composition and the REAL durable client, not a projector
helper and not a redraw. Concretely: the new `createEditWeekEntry` from `today-entry.mjs` over
`createPlanEditHost` (`plan-edit-host.mjs:42`) over the W6 durable public client, with
`fake-indexeddb` and `@peculiar/webcrypto` as the environment and an injected athlete clock, exactly
the composition the part 1 reviewer's own twenty cells used (`:473`). FIXTURES ARE SYNTHETIC: a
generated enrolled athlete, a generated setup document, a generated history file. No private fixture,
no real measurement, no owner data, ever, in any cell or any log line.

### 5.2 What a red cell means here

The suite must be red before the screens exist, and the report must show the red run. `:176`'s custody
line stands: D2 independently executes the accepted bar BEFORE reading the builder's report. A green
run that does not contain the EW ids is not this bar.

---

## 6. THE BAR

1. The fourteen cells of section 5, individually selectable, green at the exact candidate head, with
   the red first run shown.
2. The inherited suites green at that same head, named by real path with their cell counts: the Today
   suite, check in, sleep, workout, the machine note suite, the plan edit lane suites, W6, coach and
   client. A builder that cannot name a path does not get to claim its count.
3. Both OS CI green (`rebuild-public`, ubuntu and windows), with the CI ids that actually cover the
   new suite. Registering the suite is a PM owned CI and pin handoff; this spec grants no `.github`
   custody to any lane.
4. The two design gates green for the states covered, `python3 quality/gate.py` and
   `python3 quality/statesheet.py` from the pack with `EARNED_APP` pointed at the preview build.
5. Zero U+2013 and zero U+2014 in every file the build authors, proved by a count, not by a claim.
6. D2's independent implementation review at an exact branch and head (`:176` (2)). It is a SECOND
   obligation on top of the screens tier's own blind reviewer, not a substitute for it.
7. For the VIEW half: no diff outside the four new files, the `t-edit-week` block and `preview.css`.
   For the WIRING half: no diff outside `today-entry.mjs` and `today-app.cjs`, and the runner's
   `UNLISTED-PRODUCT-DRIFT` check is the proof, not a reading of the diff.

---

## 7. WHAT WAITS, AND WHAT CAN BE BUILT NOW

### 7.1 Can start today, in parallel with the look, with no collision

- `edit-week-model.mjs`: the pure state machine over the five host replies of section 2.1. It holds
  the draft, maps every refusal code of section 2.2 to a state, and touches no DOM and no store. It
  is testable without a browser and without the look.
- The whole suite skeleton with all fourteen cells written RED, against the merged companion, whose
  API is sealed and will not move under the builder.
- EW-17 to its answer, and section 4's fix authored by its own lane if the answer is red.
- `edit-week-check.mjs` in the existing `*-check.mjs` pattern.

None of this depends on a pixel. This is the real parallel work and it is roughly half the build.

### 7.2 Waits, and on exactly what

| what | waits on | why |
|---|---|---|
| the editor's look, every state | a design ticket that does not exist: C-UI-9 (section 8) | building to the 2026-09-12 brief's numbers buys a second port of the whole editor |
| `preview.css`, any style hunk | S9 sealing, because it is released only then | `:536` (1): the release happens INSIDE S9, never by editing a sealed artifact |
| `build.mjs`, if a new bundle input is needed | S9 sealing WITH hunk H18 | S9 A.6: without H18 the closed list is one path and `build.mjs` stays sealed |
| the Machine settings door's rendering | C-UI-5, which owns `machine-settings-view.mjs` and is sequenced after C-UI-4 | two hands in one unsealed file is the avoidable collision |
| the entry point binding | C-UI-2 and S9-TODAY-CARRY finishing their `today-app.cjs` hunks | `:539` (2); three hands want that file this week and part 2 goes last |
| the wiring half landing | the S10 child | `today-entry.mjs` and `today-app.cjs` are sealed and S9 does not release them |

---

## 8. THE DESIGN LANE'S LIST, AND THE ONE OWNER QUESTION

### 8.1 The finding, verified independently at `0794771`

The design of record `rebuild/m1/approved-2026-09-18/` contains ZERO references to Edit My Week: a
case insensitive search over the whole directory returns no file. The eight UI port tickets
`rebuild/lanes/c/ui-port/C-UI-0.md` to `C-UI-8.md` also return zero. C-UI-5's machine settings editor
is the WORKOUT panel (its own title line: "Workout panels: the stubs and the machine settings editor
(W-01..W-04, W-30, W-31, W-33..W-41, W-44)"), not this door. C-UI-2 is LOCKED at its line 11: "the
weigh-in stays inline (ruling 5); the stack is Start, Recovery, Talk and nothing else."

So the entry point is an OPEN SLOT that belongs to the design lane and, for where it lives, to the
owner. This spec therefore specifies behaviour, states, copy and cells, and invents no look.

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
   treatment and a `sets` field that may ship disabled per section 4.3 ruling 3.
7. The destructive confirm for `Remove from week`, carrying `This exercise will leave your week on
   {date}. Your old sessions stay in your history.`
8. The review face: `Current` beside `After this change`, with `Starts {date}` above them, and the
   action group `Save change`, `Keep editing`, `Cancel`.
9. The saving, saved (`Saved for {date}.` and `Saved on this device.`), stale, day turned and durable
   refusal states, all with the draft visibly retained.
10. The Machine settings door, which should REUSE C-UI-5's editor rather than draw a second one; if
    the design lane decides otherwise, that is a new file and this spec's section 3 changes.
11. The narrow viewport form of all of the above, and the keyboard focus order.

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
   accepted at all. The split changes and this spec is re-judged before a byte moves.
3. `plan-edit-host` as merged cannot satisfy EW-14 through the real host composition.
4. Any need to change a sealed byte, a package, a receipt, the ledger, the engine or the coach,
   beyond section 4.4's one hunk under its own custody.
5. EW-17 comes back in a third shape that is neither of section 4's two outcomes.
6. A taste fork on the look (`:539` (2)).
7. Any temptation to widen back to four doors. Days and Priorities are v1.1 and Days additionally
   waits on F1 and on owner question Q3.
8. A second new copy sentence beyond state D's.

### 9.2 Risks

| # | risk | the guard in this spec |
|---|---|---|
| 1 | the missing design; building to the old preview numbers buys a second port | section 8; the VIEW half's model and cells carry no look |
| 2 | S9 does not release what the plan assumed; six of seven UI tickets already face this | section 3.1 and STOP 2 |
| 3 | stale line cites from the 2026-09-12 brief and from the part 1 report | every cite in this file re-measured at `0794771`; `:522` named in 4.4 |
| 4 | the four door trap | section 1.1 restates the narrowing in its own words |
| 5 | the provenance defect fixed in the wrong file, or not at all | section 4, EW-17 first and red |
| 6 | lane collision on `today-app.cjs`, live right now | section 3.3 line 3: under 40 added lines, zero removed, and part 2 goes last |
| 7 | `browser-check.mjs` treated as evidence while it is stale red with no CI home | section 2.3 law 3 |
| 8 | the estimate read as elapsed time | 9.3 |

### 9.3 Estimate, in hours, and no elapsed time promise

| work | hours |
|---|---|
| VIEW half: model, view, check, the `t-edit-week` block | 7 to 9 |
| the suite: fourteen cells including the composed ones and EW-17 | 7 to 9 |
| WIRING half: the two sealed hunks and their proof | 2 to 3 |
| one independent review round plus the fix round | 4 to 5 |
| D2's separate implementation review (`:176` (2)) | 2 to 3 |
| **EW2-BUILD total** | **22 to 29 hours of model time** |

Not counted above, because they are shared or not this lane's: section 4.4's admission hunk (2 to 3
hours plus its own review, another lane), and the S10 chain, which S8 measured at about 2.5 hours of
preparation plus about 35 minutes for chain A and about 1 hour for chain B, shared across three items.

The brief's own "about two builder days after dependencies" was written for BOTH parts, before three
seals, a real import, a full UI port and a narrowing. Part 1 alone merged as 20 files and +3168 lines.
Treat two builder days as the floor for part 2, not the ceiling.

### 9.4 Open questions for the PM, each with a recommendation

| # | question | recommendation |
|---|---|---|
| Q-A | S9's closed list is two paths and `today-app.cjs` stays SEALED, so part 2's wiring half needs S10 whatever happens. S9's own OWNER-1 asks the owner whether to SPLIT `today-app.cjs` into a released `today-view.cjs` and a sealed writer. If he says yes, part 2's view half grows and its wiring half shrinks to near nothing. | **Do not wait for that answer to start.** Section 7.1's work is identical under both outcomes. Re-judge section 3 when OWNER-1 lands, not before. |
| Q-B | Does the PM accept the ruling of section 4.3 (extend provenance, do not refuse at the edit), and does the admission hunk ride S10 with the wiring half or its own child? | **Accept, and ride S10.** Splitting them across two children forces the interim of ruling 3, which ships a disabled `sets` field to real athletes for no gain. |
| Q-C | Does EW2-BUILD start before C-UI-9 exists, on the VIEW half's model and cells only? | **Yes.** Section 7.1 is roughly half the build and carries no pixel. Holding the whole item for a design ticket that has not been filed is the expensive choice. |
| Q-D | `:176` (2) says "lane C builds the editor after N2". Does that still bind now that the UI port replaced the preview lane's queue? | **Ask the PM to restate it.** This spec assumes lane C still builds and D2 still reviews, which is the part that matters, but the "after N2" clause was written against a queue that no longer exists. |
| Q-E | `design.cjs` and `today-model.cjs` are named as release candidates at `:536` but are NOT in the S8 seal at all (verified by the section 3.2 query). S9's Q3 raises the same point for four writing files that stand outside the seal. | **Not this lane's call, but the PM should not let `:536`'s candidate list be read as a pin list.** Five of its eight names need no release. |

### 9.5 What this spec did NOT do

It ran no test, installed nothing, launched no browser, and changed no product, test, tooling or
workflow byte. It did not read `rebuild/conform/private`, any `ledger/` directory, `src/history.js`,
the protected soak or any of the owner's measurements, on either machine. No credential appears in
it. The reading was done in the PM's cloud farm mirror at the same head; the writing, the commit and
the push were done on the owner's PC.
