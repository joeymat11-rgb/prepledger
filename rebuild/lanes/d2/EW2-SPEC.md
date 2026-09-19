# EW2-SPEC: EDIT MY WEEK, SCREENS PART 2

Lane D2, SPEC ONLY. Author: cowork (Earned lane hand), Opus, 2026-09-19. Branch `rebuild/d2-ew2-spec`
cut from `0794771`. No product, test, tooling or workflow byte moves on this branch.

**v3, FIX ROUND 3.** The first two authors are gone. Independent review R1
(`EW2-SPEC-REVIEW-R1.md` at `0695493`) returned REJECT with six BLOCKING findings and ten notes;
all sixteen are answered in section 10. Independent review R2 (`EW2-SPEC-REVIEW-R2.md` at
`1a73d8f`) returned REJECT at `63710d2` with six BLOCKING findings and nine notes, none of them a
repeat of R1. **Section 11 answers every one of R2's, in the order R2's own last note gives (B6,
B5, B3, B4, B2, B1), under the PM's rulings E-R1 to E-R11.** Nothing of v1 or v2 was discarded
unread: what neither review could break is kept word for word.

Every cite below was re-measured at the chain tip `00e7a0d0` for this round. Where v2 claimed a
re-measurement it had carried, R2 named five cites; all five are corrected here and section 11.7
lists them. The re-measurement claim is now narrowed to what it says: **every cite this round
TOUCHES was re-counted at `00e7a0d0`, and section 11 names the ones that moved.**

This is a hypothesis for the PM to judge and for an independent reviewer to disagree with.

Authority: `DECISIONS:176` (the brief accepted by name with three rulings), `:473` and `:474` (part 1
merged), `:510` and `:519` (the carried provenance defect, whose reachability `:510` itself left
OPEN), `:532` (the owner has imported; it says nothing about reachability), `:536` (screen files
released from the seal), `:540` (the first dispatch), `:541` (the cloud farm and this pilot),
**`:542` (the S9 two-path closed list PM-ACCEPTED, `:536` not re-opened, TODAY-SPLIT ruled) and
`:543` (THE SPLIT'S DIRECTION REVERSED: the WRITERS leave `today-app.cjs`, `today-app.cjs` itself
is RELEASED, and a sealed WRITER-FENCE cell fails when any file outside the sealed inventory calls
a writer, opens IndexedDB or imports a host).** `:543` landed after v2's base and it is what
section 3 is re-cut against.

Read before this file: `rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md` (the brief of record, 101 lines) and
`rebuild/lanes/b/S9-RELEASE-SPEC.md` at `rebuild/b-s9-ui-pins@d859096a` (the release list, which
decides part of section 3), and `rebuild/lanes/c/TODAY-SPLIT-SPEC.md` at
`rebuild/c-today-split@14c87fa7`, whose MAP `:79`, `:84`, `:113`, `:119` and `:120` this spec uses
and whose CUT `DECISIONS:543` reverses. S9's two-path closed list is now PM-ACCEPTED (`:542` (B)),
so section 3's arithmetic is confirmed rather than provisional; S9's own document is still at
REJECT R2 for two findings that do not move the list.

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
| any change to the plan-edit companion | it is merged (`:474`) and sealed. Part 2 CALLS it and changes not one byte of it, with ONE exception ruled in 4.4: an ADDED export from `plan-edit-model.cjs` over its OWN `inspect()` and `result()` pair, which is lane D or lane B work on the reseal child and is NOT in EW2-BUILD's diff. |
| any engine, coach, admission, import or store byte | except the admission hunk section 4 rules, same custody as above. |

### 1.2 The three rulings of `:176`, and where each one lands in this spec

- (a) Structural changes take effect TOMORROW in the athlete-local calendar, shown as `Starts {date}`
  before save. LANDS: section 2 state R (review) and state V (saved structural); the date comes from
  `plan-edit-commands.cjs:41 nextLocalDate(day)` over the host's own `liveDay`, never from a page clock.
- (b) Clearing the last machine note is deferred. LANDS: section 2 state M3, with the brief's verbatim
  error and no new contract invented.
- (c) Two doors, thirteen cells. LANDS: section 1.1 above and the cell plan in section 5.

**THE CUSTODY LINE, said here because section 1 is what a builder reads first (v3, R2 N3.9).**
`:176` (2) reads "lane C builds the editor after N2 under one Today build at a time; D2 reviews
lane C's editor". The PM restates it at `E-R8`: **lane C builds, D2 reviews the implementation as a
SECOND obligation on top of the screens tier's own blind reviewer, and the clause "after N2" is
DROPPED because the queue it was written against no longer exists.** So EW2-BUILD is reviewed
twice, and 6.6 is not a substitute for the tier's own reviewer.

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
| `host.save(review_id)` | `:190` (`async save`) | `{ ok:true, acknowledged:true, op_id, intent_id, starts_on, edit }` | refusal; the STALE refusal also carries `current`, `plan_basis`, `pending_dates`, `starts_on` (**`:214-:216`**, corrected in v3, R2 N1) |
| `host.cancel(review_id)` | `:252` | drops the review, writes nothing | n/a |
| `host.close()` | `:253` | every later call refuses `LOCAL_CLIENT_CLOSED` | n/a |

`read()`'s `state` is the PROJECTED state for the date asked: `readVerified` (**`:145-:153`**,
corrected in v3, R2 N1) reopens the lane (`:148 await lane.reopen()`) and returns
`read(lastGeneration, date || localDay())`, the projector's own read. That matters in 3.4, because it
is the only place in the tree that knows what the athlete's week is after an edit, **and because
`lane.reopen()` is the act `DECISIONS:543`'s WRITER-FENCE forbids to any released file.**

The host is constructed at `plan-edit-host.mjs:42` and REQUIRES `client, clock, liveDay, basisState,
setupOperation, validateTags, projectNewExerciseTags, newIntentId, athleteLabel, namespace`. Missing
`athleteLabel` or `namespace` is `PLAN_EDIT_HOST_INCOMPLETE` (`:53`), deliberately, because defaulting
them would silently widen `admittedLocalSourceBasis` from "this athlete's admitted import" to "any
admitted import" (the comment at `:46-:51`). **The page does not pass them: under `:543` nothing on
the released side constructs this host at all. The SEALED factory of 3.4 passes them, beside the raw
`admittedLocalSourceState`.**

**THREE of those ten arguments have NO production provider, not two (v3, and it is one more than
R1 B3 and v2 both said).** `validateTags` and `projectNewExerciseTags` are ruled in 3.5.
`newIntentId` is the third: measured at `00e7a0d0`,
`grep -rn 'newIntentId' rebuild --include=*.mjs --include=*.cjs` returns the parameter at
`plan-edit-host.mjs:43`, its hard `TypeError` at `:45`, its one call site at `:170`, and THREE test
or lane suppliers (`durable-host.test.mjs:131` and the two Astra review annexes at `:65`). Nothing
in product mints one. It is cheap, unlike the tag pair, and 3.4 names where it comes from.

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
**This spec proposes no new sentence except the four the PM ASKED for at `E-R9`, which are marked
PROPOSED FOR THE PM in 2.2.2 and which the PM rules on at acceptance (v3).** `{date}` and `{name}`
are actual values, never left in the UI. No copy in this file or proposed by it contains a dash
character of any kind.

**THE COMMON SET, named once so no row has to say "the E3 set" and inherit a code it cannot raise
(v3, R2 B6).** Every `review()` of every kind can return `PLAN_EDIT_INPUT_INVALID`
(`plan-edit-commands.cjs:5`, the default of `fail`), `PLAN_EDIT_DATE_INVALID` (`:35` and `:38`) and
`PLAN_EDIT_STALE_BASIS` (`plan-edit-model.cjs:386-:387`) and `PLAN_EDIT_DUPLICATE_INTENT` (`:388`),
plus the host's own `PLAN_EDIT_INTENT_CONFLICT` (`plan-edit-host.mjs:171-:172`).
Everything beyond that belongs to ONE branch of `apply()` and is named per row.

| state | copy | call | refusals it must draw |
|---|---|---|---|
| E0 Entry | SOURCED title `Edit my week`; SOURCED intro `What would you like to change?`; SOURCED doors `Exercises` and `Machine settings` (two, not four); SOURCED, when a pending edit exists, `Changes already saved for {date}` | `host.read()` on open, once | `PLAN_EDIT_READ_REFUSED`, `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` (`plan-edit-model.cjs:240`), `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`, `PLAN_EDIT_HOST_INCOMPLETE`, `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`, `LOCAL_CLIENT_CLOSED`, **and `PLAN_EDIT_TAG_BASIS_UNPROVEN`, moved here from E4 and E6 in v3: `:217` and `:219` fire inside `createPlanEditProjector`'s own body, which `projectorFor` (`plan-edit-host.mjs:68`) runs on the FIRST read, so no review path can raise it. Same class of error as R2 B6, found by re-measuring the rows B6 made me re-read** |
| E1 Exercise list | SOURCED `Choose an exercise` and `Add exercise`; each row shows the lift's own current name, day and set count from `read().state` | none; pure render of the state E0 already read | none; a list that cannot render is E0's refusal, not its own |
| E2 Exercise actions | SOURCED `Edit exercise`, `Replace exercise`, `Remove from week` | none | none |
| E3 Edit exercise | SOURCED label helper `Changing the name keeps this exercise's records.`; the six editable fields of 2.1 with the existing setup field errors verbatim; **when `day` is one of the changes, on `PLAN_EDIT_DAY_UNCOVERED`, SOURCED from `BRIEF-EDIT-MY-WEEK.md:61`, `Choose a training day for each exercise before saving.`** | `host.review({kind:'update', ...})` on `Review change` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`plan-edit-model.cjs:321`), `PLAN_EDIT_NO_CHANGE` (`:329`, the update branch and nowhere else) and `PLAN_EDIT_DAY_UNCOVERED` (`:326` reached from `:330`) |
| E4 Replace | SOURCED `The new exercise starts without a recorded load. Your old sessions stay in your history.`; **plus E3's `PLAN_EDIT_DAY_UNCOVERED` sentence, same source, because `:345` calls `covered(row.day)` on this branch too** | `host.review({kind:'replace', ...})` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`), `PLAN_EDIT_DAY_UNCOVERED` (`:326` from `:345`), `PLAN_EDIT_ID_REUSED` (`:389` in `preview()` and `:346` in `apply()`), `PLAN_EDIT_TAGS_INVALID` (`plan-edit-commands.cjs:66`), `PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` (`:390`) and `PLAN_EDIT_NEW_TAG_PROJECTION_INVALID` (`:355`) |
| E5 Remove | SOURCED `This exercise will leave your week on {date}. Your old sessions stay in your history.` | `host.review({kind:'remove', exercise_id})` | the COMMON set, plus `PLAN_EDIT_TARGET_UNAVAILABLE` (`:321`) and `PLAN_EDIT_WEEK_EMPTY` (`:341`, 2.2.2). **It draws NEITHER `PLAN_EDIT_DAY_UNCOVERED` NOR `PLAN_EDIT_NO_CHANGE`: neither is reachable on this branch (v3, R2 B6)** |
| E6 Add | SOURCED `Add exercise`; setup's muscle vocabulary and field components reused from `setup-model.mjs`, its document writer never called; **plus E3's `PLAN_EDIT_DAY_UNCOVERED` sentence, same source, `:345`** | `host.review({kind:'add', ...})` | E4's set MINUS `PLAN_EDIT_TARGET_UNAVAILABLE`: an `add` carries no `exercise_id`, so `:321`'s guard is not entered |
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

#### 2.2.2.1 FOUR SENTENCES PROPOSED FOR THE PM (v3, `E-R9`)

The PM ASKED for these at `E-R9` and rules on them at acceptance. Until he does, the interim above
stands and none of them is built. Each is one sentence pair, true for its own field, saying what
happened and what the athlete can do. **No dash of any kind, no readiness word, no exclamation
mark, no emoji, and `Report a problem` is quoted from the approved control's own label
(`today-app.cjs:223 PROBLEM_ENTRY`, `design.cjs:193`), not invented.** A builder ships NONE of them
until the PM rules; law 4 still forbids any sentence the PM has not seated.

| code | PROPOSED FOR THE PM | why it is true for that field |
|---|---|---|
| `PLAN_EDIT_WEEK_EMPTY` (`plan-edit-model.cjs:341`) | `Your week needs at least one exercise. Replace this one instead of removing it.` | `:340-:341` refuses only when every OTHER lift is already retired. Replace is the action that is still open to him in the same door, and it is the narrowed v1 need in the owner's own words |
| `PLAN_EDIT_BASIS_SOURCE_CHANGED` (`plan-edit-host.mjs:77`) | `Your imported history changed on this device while this was open. Open Edit my week again to see your current week.` | `:68-:77` refuses when `boundSource` no longer matches: an import became present or absent. His WEEK did not change, so the brief's stale sentence would be false; the imported history did. Re-opening re-reads, which is 2.2.2's own interim |
| `PLAN_EDIT_BASIS_HASH_UNAVAILABLE` (`plan-edit-model.cjs:101`) | `Edit my week could not start on this device. Nothing in your week changed. Open it again, and use Report a problem if it keeps happening.` | `:101` fires when the projector is built with no `hashBasis` at all, before any generation is read, so nothing was written and "nothing in your week changed" is exactly true |
| `PLAN_EDIT_BASIS_HASH_INVALID` (`plan-edit-model.cjs:104`) | `Edit my week could not check your week on this device. Nothing in your week changed. Open it again, and use Report a problem if it keeps happening.` | `:102-:104` fires when the digest is not 64 hex: the hash ran and its answer failed the shape law, which is a CHECK that failed rather than a start that failed. Nothing was written |

**Stated plainly, because a reviewer should not have to find it:** the last two sentences are close
to each other on purpose. To the athlete the two facts are one fact (the editor cannot verify its
own basis on this device) and the honest difference is only whether the check ran. If the PM
prefers ONE sentence for both codes, that is a smaller inventory and this spec does not object; it
proposes two because `E-R9` asked for one per code.

### 2.3 Copy laws that bind every string above

1. No U+2013 and no U+2014 anywhere, in the file or on screen. The render boundary is
   `rebuild/m3/w7-preview/today/plain-copy.cjs` (`plainCopy`, `plainOrDrop`), which `today-entry.mjs:30`
   already imports for exactly this rule (`DECISIONS:114` (1)). The editor renders through it.
2. No emoji and no exclamation mark (brief, EW-16).
3. No readiness word. The headline vocabulary check lives in `browser-check.mjs`
   (`headlineVocabulary`, `assertNoDashOnScreen`). **RESTATED AS A STANDING RULE in v3 (R2 N3.8.3).**
   v2 said EW2-BUILD may not treat a green run of it as evidence "until S9 gives it one". `:542` (B)
   rules that **`browser-check.mjs` stays outside, gets NO CI home, is run on the PC before each
   seal and is recorded in the verdict.** So the wait v2 described never ends, and the rule is now
   unconditional: **a green `browser-check.mjs` run is never this suite's evidence, in any round.**
   The suite asserts the copy census itself, in its own cells, and that is the only proof the bar
   counts.
4. **ZERO new sentences are proposed by this spec, with ONE named exception the PM asked for
   (v3).** Every string in 2.2 is SOURCED from the accepted brief or SOURCED FROM CODE. The four
   sentences of 2.2.2.1 are PROPOSED FOR THE PM under `E-R9` and are not copy until he rules: a
   builder ships none of them before that. A builder that finds it needs ANY OTHER new sentence
   files it in the copy inventory and stops for the PM.

---

## 3. THE SPLIT: WHICH HALF SHIPS AS LANE C, WHICH HALF RIDES A CHILD

### 3.0 THE SPLIT'S DIRECTION CHANGED UNDER THIS SPEC, AND SECTION 3 IS RE-CUT (v3, `E-R1`)

v2's section 3 was written for a world in which `today-app.cjs` stays SEALED and part 2's route and
mount therefore ride a reseal child. **`DECISIONS:543` reverses that**, and it landed after v2's
base:

- the WRITES regions leave `today-app.cjs` for ONE new SEALED module, working name
  `today-lanes.cjs`, and `today-app.cjs` itself is **RELEASED**, keeping its name, `mountToday`,
  **the router** and every drawing and read only binding region;
- one sealed factory owns **every lane opener, host, IndexedDB handle, the adoption gate, rebase and
  every durable write**, and hands the released view two frozen things: a READ ONLY facade and a
  CALLBACK TABLE taking RAW field values;
- **THE STRICT CALL SITE RULE: no released file calls, imports or holds a writer**, enforced by a
  sealed **WRITER-FENCE** cell that fails when any file outside the sealed inventory calls a writer,
  opens IndexedDB or imports a host (`:542` (C) dispatched it, `:543` kept it);
- `gym-app.mjs` is the second extraction and rides the same lane; no other sealed file is opened.

**WHAT RIDES S10 AND WHAT SHIPS AS LANE C, said in one place because it is the answer to the
ticket's own question:**

| ships as LANE C, released, no reseal | rides S10, sealed |
|---|---|
| the six new `edit-week-*` files of 3.3 line 1 and the suite | the Edit My Week entry in the sealed factory: everything that CONSTRUCTS the plan edit host, opens its lane, adopts a basis or rebases (3.4) |
| the `t-edit-week` block in `screens.template.html` | `today-entry.mjs`'s `createEditWeekEntry` (that file is SEALED at `:141 await host.save(document_)` and `:543` does not release it) |
| **THE ROUTE in the `[data-go]` router and THE MOUNT CALL**, because `today-app.cjs` is released and the router goes with it (`TODAY-SPLIT-SPEC.md:84`: `:826` is the `[data-go]` router binding; `:113`: `render` is `:2272-:2376`, a DRAWS region) | section 3.5's F2 package at `rebuild/m4/workout/setup-tags.cjs` |
| `preview.css` once S9 seals | section 4.4's admission hunk, now TWO sealed files |
| | the `.github/workflows/rebuild.yml` registration (3.3 line 7), the PM's |

**THE ONE THING A BUILDER MUST NOT READ INTO THIS.** The route and the mount being lane C does NOT
mean the wiring half shrank to nothing. It moved: the expensive part was never the route, it was
the adoption chain, and `:543` puts the whole of it on the sealed side by name ("the adoption
gate, rebase"). Q-A said as much in v2 and it is now the ledger's own words.

**TIMING, stated so nobody builds against a file that does not exist.** TODAY-SPLIT is at SPEC
stage: `:543` dispatched spec round 2 with review, fix round and R2, and "the build starts only on
the PM's acceptance of the spec" (`:542` (C)). Round 2 is NOT on `rebuild/c-today-split` at
`14c87fa7`, which still carries v1 with the reversed cut; I synced the branch and read it. So
`today-lanes.cjs` does not exist yet and section 3.4's sealed entry lands in whichever module the
split creates. **STOP condition 2 is rewritten in 9.1 to cover that: if TODAY-SPLIT is accepted
with a different interface, section 3 is re-judged before a byte moves.**

### 3.1 The release list, and what it still decides

`DECISIONS:536` released presentation only files from the seal in the owner's words and left the
closed list to S9. S9's spec exists: `rebuild/lanes/b/S9-RELEASE-SPEC.md` on `rebuild/b-s9-ui-pins`,
read at `d859096a` (v2 of the spec at `c0bb04e`, plus its own review R2). Its section A.6 THE CLOSED
LIST is TWO paths, not eight:

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

and the second is CONDITIONAL on hunk H18 landing in the same package (`S9-RELEASE-SPEC.md:218-:223`):
without H18 the closed list is ONE path. **`:542` (B) PM-ACCEPTS that two path list and does NOT
re-open `:536`**, so this is settled rather than provisional, which is better news than v2 had.

`today-app.cjs` is judged SEALED in S9 A.2 **as it stands today**, and it is the file `:543` splits
so that it can be released. **v2 relayed S9's sentence about it without re-measuring, and one member
of its list of five is wrong (v3, R2 N3.4).** Re-measured by me at `00e7a0d0`, line by line:

| what v2 relayed | measured |
|---|---|
| five IndexedDB lane openers, `:513`, `:596`, `:637`, `:2052`, `:1416` | **FOUR.** `:513`, `:596`, `:637` and `:2052` each read `(view && view.indexedDB) \|\| globalThis.indexedDB`. `:1416` is `const pending = Promise.resolve().then(() => checkin.host.forDate(day))`, which opens nothing. R2 is right |
| three durable writers from three click handlers | the PM's own list at `:542` (A) names SIX, and I verified all six: `host.save :493`, `host.save :581`, `model.weighIn :1072`, `foodLane.save :1293`, `sleepLane.save :1843`, `workout.gym.rebase :2501` |

The lesson is the one R2 drew and it is worth a line: **a relayed measurement is re-measured or
marked as relayed.** Everything in 3.2's table below was queried by my own script, not relayed.

`today-entry.mjs` is SEALED at `:141 await host.save(document_)`, verified. `gym-app.mjs` SEALED at
`:161-:166`. `machine-settings-host.mjs` SEALED at `:63-:85`.

**S9's own document is still at REJECT R2** (`d859096a`, two BLOCKING, both document edits, neither
moving the closed list). Its LIST is accepted; its SPEC is in round 3. Nothing in section 3 depends
on the difference.

### 3.2 Every path, checked against the seal by machine

Method, so a reviewer can repeat it, and it is CORRECTED in v2 (R1 N2, partly disputed in 10.2).
**RE-RUN IN FULL FOR v3 at `00e7a0d0` by my own script, not relayed from v2:** the three counts
below and every YES and NO in the table came back identical, which is the third independent run of
this query (v2's, R2's and mine) with the same answer. A small script parsed
`rebuild/m4/spec/acceptance-s8-real-shape.json` and asked it about each path below by exact string,
against THREE named key sets, reported separately because they have different consequences:

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
| `rebuild/m3/w7-preview/today/edit-week-basis.mjs` | NO (new file, 3.4) | n/a | **VIEW, and in v3 it is a PURE function that opens nothing (R2 B1, `E-R1`). See 3.4** |
| `rebuild/m3/w7-preview/today/today-lanes.cjs` (working name) | **does not exist yet**; created by TODAY-SPLIT, which `:543` rules and which is at spec stage | n/a | **SEALED. It is where 3.4's adoption entry lands** |
| `rebuild/m3/w7-preview/today/test/edit-week.test.mjs` | NO (new file) | n/a | VIEW |
| `rebuild/m3/w7-preview/today/screens.template.html` | NO | already unsealed; editable today | VIEW |
| `rebuild/m3/w7-preview/today/machine-settings-view.mjs` | NO | already unsealed; C-UI-5 owns it | VIEW, coordinated |
| `rebuild/m3/w7-preview/today/setup-model.mjs` | NO | read only here; vocabulary reuse, its document writer never called | VIEW, no edit |
| `rebuild/m3/w7-preview/today/setup-host.mjs` | NO | not in the seal at all. **v2 called `setupsIn(generation, profile)` at `:45` the `setupOperation` source and that is WRONG: 3.6 corrects it** | CALLED ONLY, zero bytes |
| `rebuild/m3/w7-preview/today/preview.css` | YES | RELEASED by S9 | VIEW, after S9 |
| `rebuild/m3/w7-preview/today/build.mjs` | YES | RELEASED by S9 only if H18 lands | VIEW after S9 with H18, otherwise WIRING |
| `rebuild/m3/w7-preview/build.mjs` | YES | the OTHER pinned `build.mjs` (R1 N3). NOT this item's: a new bundle input for the preview page is added in the `today/` one. Named here so a builder who greps finds two and knows which | zero bytes |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | YES | SEALED (`:141`), and `:543` does not release it | **SEALED SIDE: `createEditWeekEntry` (3.3 line 2)** |
| `rebuild/m3/w7-preview/today/today-app.cjs` | YES | SEALED **today**; `:543` RELEASES it once TODAY-SPLIT lands, writers and all removed | **RELEASED SIDE, LANE C: the route and the mount only (3.3 line 2a). Zero writer lines** |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | YES | SEALED BY NAME at `:536` (2) | NOT TOUCHED. 3.4 chooses option (b) precisely to keep it at zero bytes. `admittedLocalSourceState(setup)` (`:70-:82`) is called as it stands and is the RAW basis 3.4 pins |
| `rebuild/m3/w7-preview/today/machine-settings-host.mjs` | YES | SEALED (`:63-:85`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | YES | SEALED (`:161-:166`) | WIRING, and the aim is a zero byte hunk |
| `rebuild/m3/w6/host/plan-edit-host.mjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-commands.cjs` | YES | SEALED | CALLED ONLY, zero bytes |
| `rebuild/m4/workout/plan-edit-model.cjs` | YES | SEALED | ONE ADDED EXPORT over its own `inspect()` and `result()` pair for section 4's fix, another lane's hunk, NOT in EW2-BUILD's diff (4.3 ruling 2, `E-R4`) |
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | YES | the ONLY `projectNewExerciseTags` implementation in the tree, and it is in a LANE directory (3.5) | see 3.5 |
| `rebuild/m4/workout/setup-tags.cjs` | **NO, and it is not in `executionPins` either: it does not exist on the tip** | n/a; 3.5's package lands it | SEALED, S10. **Landing it ADDS a product entry; it does not MOVE the lane copy's pin, which is why `PE-f2-identity` keeps passing untouched (R2 N3.5)** |
| `rebuild/m3/w6/local/today-bindings.mjs`, `rebuild/m3/w6/host/workout-host.mjs` | YES | SEALED by name at `:536` (2) | CALLED ONLY, zero bytes (3.6) |
| `rebuild/coach/machine-settings-commands.cjs` | NO | but `rebuild/coach/**` is SEALED by name at `:536` (2) | CALLED ONLY, zero bytes |
| `rebuild/m3/w6/local/source-admission.mjs` | YES | SEALED by name at `:536` (2) | section 4's hunk only, another lane's |
| `.github/workflows/rebuild.yml` | YES | pinned; registering the new suite is a hunk in it (R1 N4) | WIRING, on the same child, PM custody (3.3 line 7) |

### 3.3 THE SPLIT IN EIGHT LINES (v3: seven in v2, and the second one split in two when `:543` moved the line)

1. RELEASED half, lane C, no reseal, buildable NOW: SIX NEW files (`edit-week-model.mjs`,
   `edit-week-view.mjs`, `edit-week-check.mjs`, `edit-week-tags.mjs` (3.5), `edit-week-basis.mjs`
   (3.4, now a PURE function), `test/edit-week.test.mjs`) plus a `t-edit-week` block in the already
   unsealed `screens.template.html`, plus `preview.css` once S9 seals.
2. **LINE 2 OF v2 IS TWO LINES IN v3, because `:543` put its two halves on opposite sides of the
   seal. They are called LINE 2a and LINE 2b throughout this spec.**

   **LINE 2a. RELEASED half, lane C, but INSIDE `today-app.cjs` (`E-R1`):** ONE
   route in the `[data-go]` router (`:826`, the binding; `render` is `:2272-:2376`) and ONE mount
   call. Under `:543` that file is released, so these are NOT a reseal hunk and they are NOT on
   S10. **They may not be written until TODAY-SPLIT lands**, because until then the file is sealed
   and every hand that touches it needs a child; 7.2 carries the wait.

   **LINE 2b. SEALED half, rides S10:** `today-entry.mjs` gains a `createEditWeekEntry` factory beside
   `createWorkoutEntry` (`:150`) and `createSetupEntry` (`:93`), with one call site in `boot()`
   (`:226`); and the sealed factory TODAY-SPLIT creates (working name `today-lanes.cjs`) gains the
   Edit My Week entry of 3.4: the host construction, its ten arguments, the one `read()`, the
   `close()`, and the adoption compose. **Nothing on the released side constructs a host, opens a
   lane or calls a writer, so the WRITER-FENCE of `:542` (C) passes by construction rather than by
   inspection.**
3. The target size of the SEALED half is **under 70 added lines** across `today-entry.mjs` and the
   split's own module, and ZERO removed (v1 said 40, v2 said 55 for a different cut), because three
   hands want that neighbourhood this week (`:539` (2) S9-TODAY-CARRY, C-UI-1, C-UI-2) and the
   smallest hunk is the one that merges. **The released route and mount are additionally about 6
   lines and are counted separately, in lane C's own diff.**
4. `machine-settings-host.mjs` and `gym-app.mjs` take NO hunk: the Machine settings door calls the
   existing exported `createMachineSettingsHost` (`:63`) from the new entry and renders through the
   existing exported `renderEditor` (`machine-settings-view.mjs:115`). If a builder finds it cannot,
   that is a STOP, not a licence to edit a sealed file.
5. `local-source-basis.mjs` takes NO hunk either. 3.4 exists to keep it that way.
6. The child is S10, shared with N3-MACROS-ENTRY and P4b coaching memory exactly as `:540` (2)
   intends, and it also carries section 4's admission hunk, its `plan-edit-model.cjs` export and
   3.5's F2 package. One seal chain. **`:543` says S10 USES the released role S9 builds and that
   the today-carry lane lands first**, so the ORDER on the child is: S9's role, S9-TODAY-CARRY,
   TODAY-SPLIT, then this item's sealed half.
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
- `gym-model.mjs`: `hostForDay` rereads `model.stateFromOps()` at CALL time, so a rebase after
  `adoptBasis` picks up whatever was adopted. **v2 cited `:104` for this and `:104` is the COMMENT
  that says it, not the code that does it (v3, R2 N3.6).** The code is `rebase()`, which calls
  `await hostForDay(day)` at `:163` after its own `:161` guard; `hostForDay` itself is the injected
  option declared at `:96`. The claim was true and the cite pointed at prose.

**NOTHING IN THAT CHAIN APPLIES A PLAN EDIT, and nothing in the product consumes the operation.**
Measured: `grep -rn 'exercise-edit' rebuild --include=*.mjs --include=*.cjs` returns the field
constant `plan-edit-commands.cjs:4` and two lane D cells. `stateFromOps()` replays sleep, food and
readings and has no branch for it. So an edit saved today changes the editor's own `read()` and
nothing else on the phone.

**THE RULING: option (b) still, but it is re-cut for `:543` and re-specified so it can be written
and cannot loop (v3, `E-R1` and `E-R2`; R2 B1 and B2).** The three options and why the other two
lose:

| option | what it means | verdict |
|---|---|---|
| (a) change `local-source-basis.mjs` | it is in `product` (verified by my own query) AND SEALED BY NAME at `:536` (2). The most expensive file in the tree to touch, and the edit is not a basis-admission concern | REJECTED |
| (b) the SEALED factory opens the companion once inside the adoption gate it already owns, and a PURE released function decides what to adopt from the two values | under `:543` the adoption gate, every lane opener and every host are sealed by ruling, so the open costs no NEW sealed surface; the decision, which is the part that goes wrong, stays free and cell-covered | **CHOSEN** |
| (c) make the companion's `read()` the adoption source outright | it changes the meaning of "admitted basis" and would make `importAdmitted` a lie. `plan-edit-model.cjs:240` already asserts `equal(adopted, base)`, so the companion itself insists the basis handed to it is the admitted one | REJECTED |

#### 3.4.1 WHERE `edit-week-basis.mjs` GOES, and why (R2 B1, `E-R1`)

R2 B1 is upheld and the PM rules with it. v2 filed a file that calls `host.read()`, hence
`readVerified` (`:145`), hence `lane.reopen()` (`:148`), hence `client.hostBindings` (`:81`), in the
half whose whole definition is that it touches no host and no client. Under `:542` (C) and `:543`
that is not a purity argument any more: **the sealed WRITER-FENCE cell fails on exactly that file.**

The PM gave two ways out. **CHOSEN: reduce the released file to a PURE function fed by the sealed
side.** The sealed factory does the open, the `read()` and the `close()`. `edit-week-basis.mjs`
exports ONE pure function and imports nothing:

```
planEditedState(rawBasis, read)   // read is the REPLY object, already obtained
```

It returns `read.state` when `read && read.read === true && read.state`, and `rawBasis` otherwise,
on every other path including `read === undefined`, `read.read === false`, and a reply of any other
shape. **It never returns `undefined` and it has no `catch` to fall through, because it never
calls anything (v3, R2 N3.2, which is why the `&&`/`||` hunk of v2 could silently stop adoption).**
It re-derives nothing: it never applies an edit, never reads `training.exercise-edit`, never
touches a projector. `plan-edit-model.cjs:61-63` binds it: a second spelling of the rule is a
second rule.

**WHY THIS AND NOT "MOVE `planEditedState` WHOLESALE INTO THE SEALED MODULE", which was the PM's
other option.** The sealed module has to open the host either way, so moving the whole function
there saves no sealed surface; it only ADDS the decision to the sealed budget. And the decision is
the part that was wrong: R2 B2 found two ways to brick the editor inside it, and R2 N3.2 found a
third inside its call shape. **A rule that has already been got wrong three times belongs where a
cell can be written against it without a reseal child.** That is the justification, and if a
reviewer disagrees the cost of the other answer is small and named: about ten more sealed lines.

#### 3.4.2 THE FACTORY, ALL TEN ARGUMENTS, AND WHERE EACH ONE COMES FROM (R2 B2, `E-R2`)

The factory is **`openEditWeekHost()`**, a new function in the SEALED module (3.3 line 2b, inside
line 3's budget). It is not in v2's table, in either half or in either budget, which is exactly R2
B2 (ii). It is `async`, it returns the host handle, and its caller closes it. It calls
`createPlanEditHost` (`plan-edit-host.mjs:42`) with these ten and nothing else:

| argument | where it comes from | measured |
|---|---|---|
| `client` | the era's own client, the SAME object `machine-settings-host.mjs:72` hands to `hostBindings` | `plan-edit-host.mjs:44` requires `client.hostBindings`; `:81` calls it |
| `clock` | `{ today: () => era.liveDay() }`, the shape `sleep-host.mjs:115` already builds for the same reason | `plan-edit-host.mjs:44` requires `clock.today` |
| `liveDay` | `today-bindings.mjs:723`'s exported `liveDay`, zero sealed bytes (3.6) | `plan-edit-host.mjs:54-:56` accepts it, or falls back to `client.liveDay` |
| **`basisState`** | **THE RAW VALUE AND NEVER THE COMPOSED ONE: `await admittedLocalSourceState(setup)` (`local-source-basis.mjs:70-:82`) when it is non null, else `setup.athleteState()`. 3.4.3 is the whole reason this row is in bold** | `plan-edit-model.cjs:107` `const base = clone(basisState)` |
| `setupOperation` | the RAW setup operation, NOT a `setupsIn()` row. 3.6 corrects v2 and says how to get it without a second spelling | `plan-edit-model.cjs:108-:110` demands `kind`, `class`, `payload.profile`, `payload.setup` and a 64 hex `canonical_content_commitment` |
| `validateTags` | 3.5's projector, `createSetupTagProjector(...).validateExerciseTags` | `plan-edit-commands.cjs:66` |
| `projectNewExerciseTags` | the same projector's `projectNewExerciseTags` | `plan-edit-model.cjs:349`, `:390` |
| `newIntentId` | **a new one line provider on the sealed side** over the installation's own `crypto.randomUUID()`, the same `crypto` `openTodayHosts` is already handed. Nothing in product mints one (2.1) | `plan-edit-host.mjs:45` throws without it; `:170` calls it; `:171-:172` already guards a collision |
| `athleteLabel` | `setup.athleteLabel()`, the same read `local-source-basis.mjs:79` makes | `plan-edit-host.mjs:52-:53` |
| `namespace` | the era's `namespace`, the value `machine-settings-host.mjs:79` puts on its own handle and `local-source-basis.mjs:80` reads as `host.namespace` | `plan-edit-host.mjs:52-:53` |

#### 3.4.3 `basisState` IS THE RAW BASIS. THE LOOP, NAMED SO NOBODY WRITES IT (R2 B2 (iii), `E-R2`)

**RULE, in one sentence: `basisState` is the RAW admitted or first run state, and it is NEVER
`athleteBasisState()`'s result after this section lands.** A builder handed only "the page passes
them beside `admittedLocalSourceState`" will pass the composed value, because it is the only
athlete state the page has a name for. What that costs, measured:

- **Imported installation.** `plan-edit-model.cjs:237` computes `adopted = admittedBasisOf(generation)`,
  which is `local-source-basis.mjs:32 admittedLocalSourceBasis` returning `clone(view.state)`, and
  `:240` fails `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` unless `equal(adopted, base)`. An edited
  `basisState` is not byte equal to the admitted view state. **The editor refuses to open,
  permanently, from the first saved edit.**
- **First run installation.** `:236`'s guard is skipped, so the edits apply TWICE: `result()`
  (`:369-:382`) starts `let state = clone(base)` and replays every active edit over it. An `add` or
  a `replace` then hits `:346` `PLAN_EDIT_ID_REUSED`; a `remove` hits `:321`
  `PLAN_EDIT_TARGET_UNAVAILABLE`. **Same outcome: `read()` refuses and the editor will not open.**
- **If the factory reads the composed value lazily**, the loop is literal:
  `athleteBasisState -> planEditedState -> openEditWeekHost -> athleteBasisState`.

**THE CELL THAT CATCHES IT, and `E-R2` asks for it by name.** EW-13 gains a third and fourth part,
and they are written RED first like everything else:

> **EW-13c, IMPORTED.** On a synthetic installation with an ADMITTED import: save one `update`
> through the real host, run the real adoption chain once, then open the editor a SECOND time.
> ASSERT `read:true`. A `basisState` wired to the composed value returns
> `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` here and the cell names that code in its failure message so
> the next hand does not have to find this section.
>
> **EW-13d, FIRST RUN.** On a synthetic first run installation: save one `add`, run the adoption
> chain once, open a SECOND time, ASSERT `read:true` AND that the added lift appears exactly ONCE
> in `read().state.exercises`. A `basisState` wired to the composed value returns
> `PLAN_EDIT_ID_REUSED`; a fold that double applied without refusing would show the lift twice.
> Both failures are named in the cell.

#### 3.4.4 WHAT THE SEALED SIDE DOES, AND WHAT THE SPLIT MUST LEAVE IN PLACE FOR IT

The adoption chain as it stands is `athleteBasisState` at `today-app.cjs:2482-:2489` and
`adoptAthleteState` at `:2490-:2546`. `TODAY-SPLIT-SPEC.md:119` and `:120` classify BOTH as
**WRITES** regions, so under `:543` both move into the sealed module unchanged, and this item adds
to them there. **What the split must leave in place, stated as a requirement on TODAY-SPLIT rather
than as an assumption:**

1. the adoption gate stays ONE function, so there is ONE place a plan edit can be composed in and
   no second adoption path to keep in step;
2. `setup` (the setup entry) stays reachable from it, because `admittedLocalSourceState(setup)`,
   `setup.athleteState()` and `setup.athleteLabel()` are all read off it;
3. the era (its `client`, `namespace` and `crypto`) stays reachable from it, for 3.4.2's rows;
4. `importAdmitted` keeps its present meaning, set from the RAW `admittedLocalSourceState` at
   `:2488` and not from anything this section adds, or the Import entry starts lying.

**THE HUNK, and v2's "four added lines and zero removed" is withdrawn (R2 B2 (i)).** `:2488` ends
with a semicolon, so v2's `.then` could not be appended without changing that line, and "zero
removed" was not achievable as printed. Under `:543` the point is moot in a better way: the whole
function is being MOVED by TODAY-SPLIT, so this item's hunk is not an append to a line it does not
own. It is, inside the sealed module's own adoption gate:

```
const read = await (async () => {
  const host = await openEditWeekHost();
  try { return await host.read(); } finally { host.close(); }
})().catch(() => null);
state = planEditedState(state, read);
```

Five added lines, one changed (the assignment), zero removed, and the `try/finally` is what makes
the `close()` unconditional. **The `catch(() => null)` belongs HERE, on the sealed side, not inside
the pure function**, because it is the durable call that can throw and the pure function is what
must be total.

COST, stated rather than hidden: **one extra durable reopen per adoption.** Adoption runs at boot
(`today-app.cjs:2550`) and on `onAdmitted` (`:700`), not per frame, so this is two reopens in a
session and not a loop. EW-14 measures it; if it is not acceptable, the STOP is 9.1 item 9.

**EW-14 IS BLOCKED ON 3.4 AND ON 3.5, not on 3.4 alone (v3, R2 N3.1).** `host.read()` runs
`inspect()`, which runs `commands.validate(op, id => ops[id])` for every plan mutation op
(`plan-edit-model.cjs:285`), which runs `validateInput` and therefore `editOf`
(`plan-edit-commands.cjs:69`) and therefore, for an `add` or a `replace`, `tagsOf` (`:78`) and
`validateTags` (`:66`). So on a generation that carries one `add`, the ADOPTION READ ITSELF refuses
without the F2 package. That is true on a real phone and false against a fake host, which is why
v2's 7.1 could say the module needs nothing from 3.5 and be wrong. R2 found it; it is upheld.

### 3.5 THE TAG PROVIDER: two of the host's ten arguments have no product implementation (R1 B3, upheld and sharpened; the THIRD missing argument, `newIntentId`, is 2.1's and 3.4.2's, not this section's)

`createPlanEditHost` requires `validateTags` and `projectNewExerciseTags`. Both are hard and
undefaulted:

- `plan-edit-commands.cjs:66`
  `if (typeof validateTags !== 'function' || validateTags(plain(exercise), plain(tags)) !== true) fail('PLAN_EDIT_TAGS_INVALID');`
  inside `tagsOf`, which `editOf` calls for EVERY `add` and EVERY `replace` (`:76-:79`). Unconditional.
- `plan-edit-model.cjs:349`
  `if (typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');`
  and `:350-:355` hold the projection to an exact shape. That particular line sits behind `if (op)`
  at `:348`, so it is the SAVE path's copy of the rule.

**WHERE THE REFUSAL REALLY FIRES, and v2 got this wrong (v3, R2 B5, upheld, and `E-R5` rules it).**
v2 said a builder "can reach a green REVIEW for `add` and `replace` and then refuse at Save, which
is the worst order to discover it in". Measured at `00e7a0d0`, that is false and the true order is
the opposite. With no provider, `review()` refuses IMMEDIATELY, twice over, before `apply()` is
reached at all:

1. `preview()` (`plan-edit-model.cjs:384`) opens with `C.validateInput(value, { validateTags })` at
   **`:385`**, which reaches `editOf` (`plan-edit-commands.cjs:69`), which for `add` and `replace`
   calls `tagsOf` (`:78`), which fails **`PLAN_EDIT_TAGS_INVALID` at `plan-edit-commands.cjs:66`**
   the moment `validateTags` is not a function. This is the one that actually fires first.
2. Had it passed, `preview()` would still fail **`PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` at
   `plan-edit-model.cjs:390`**, on the REVIEW path, before `apply()` at `:392`.

So the discovery order is early and legible: **the first `Review change` on an `add` or a `replace`
refuses `PLAN_EDIT_TAGS_INVALID`, and no Save is ever offered.** v2's "green REVIEW then refuse at
Save" sentence is withdrawn. The CONCLUSION of this section is untouched and R2 verified every link
of its evidence: EW-04, EW-15 and EW-17c are blocked until the F2 package lands.

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
EW-15 can go green. ACCEPTED BY THE PM AS PROPOSED at `E-R6`: lane D lands it, with its own review,
and EW-04, EW-15 and EW-17c wait on it and say so.** Not a new page-side provider: a second
implementation of the tag taxonomy is a second spelling of the rule, the defect class the codebase
names at `plan-edit-model.cjs:61-63`, and the one that would be silent. `rebuild/m4/**` is SEALED by
name at `:536` (2), so this is a reseal hunk with its own custody, exactly like section 4's.

**AND IT IS NEEDED BY MORE THAN THE THREE CELLS v2 NAMED.** Under 4.3 ruling 2 as `E-R4` re-cuts
it, the admission fold runs `inspect()`, which runs `commands.validate` (`plan-edit-model.cjs:285`)
with `validateTags`, so **section 4's fix cannot be built without this package either.** Under
3.4.4's last paragraph the ADOPTION READ needs it too. So 3.5 is not a leaf dependency of two
cells; it is a prerequisite of 3.4, 4.3 and 4.4 alike, and that is a reason to land it FIRST on
S10 rather than beside them.

Consequences a builder must plan around:

1. `model.test.cjs:516-:518` currently ASSERTS that neither `plan-edit-commands.cjs` nor
   `plan-edit-model.cjs` mentions `f2-tag-adapter` or `setup-tags`. That stays true (the sealed
   factory injects; the runtime still imports nothing). **v2 then said PE-f2-identity's
   `git show f3e9561:` read "must be re-pointed at the merged path when it lands", and that is
   WRONG and v3 drops it (R2 N3.5).** `model.test.cjs:511-:512` reads
   `git show f3e9561:rebuild/m4/workout/setup-tags.cjs`, a blob AT A HISTORICAL COMMIT. Landing the
   same file on a later commit does not change what `f3e9561` holds, so the cell keeps passing
   untouched and no lane owes it a hunk. R2 is right and the correction is free.
2. The released `edit-week-tags.mjs` is a THIN ESM shim: it `createRequire`s the product module,
   calls `createSetupTagProjector` once with the page's taxonomy, and EXPORTS
   `{ validateTags: p.validateExerciseTags, projectNewExerciseTags: p.projectNewExerciseTags }` for
   the SEALED factory of 3.4.2 to hand on. It contains no taxonomy and no validation of its own, it
   constructs no host and it opens nothing, so it stays on the released side under the WRITER-FENCE.
   If a builder finds itself writing a rule in it, that is a STOP.
3. **UNTIL IT LANDS, EW-04, EW-15 AND EW-17c ARE BLOCKED, and so is EW-14 on any generation that
   carries an `add` or a `replace`** (3.4.4). 7.1 says so. EW-02, EW-03, EW-05 and the Machine
   settings door are NOT blocked: `update` and `remove` never enter `tagsOf`.
4. I did NOT fetch `f3e9561`: it is not an object in the farm mirror and the include list is not a
   thing to work around. Everything above is read off files that ARE on the tip. Whoever lands the
   package verifies the blob itself.

### 3.6 Two reductions this plan depends on, stated so the next hand can check them (R1 N10)

Both keep the S10 hunk small, and neither was claimed in v1:

- **`liveDay` costs zero sealed bytes.** `today-bindings.mjs:723` already exposes
  `liveDay: () => (typeof liveDay === "function" ? liveDay() ...)`, so the S4 real-day requirement
  (`:437`/`:451`/`:467`) is satisfied by an existing export and `today-bindings.mjs` keeps its
  CALLED ONLY, zero byte row.
- **`setupOperation` costs zero pinned bytes, but v2's route to it does not work and v3 corrects
  it.** `rebuild/m3/w7-preview/today/setup-host.mjs:45` exports
  `setupsIn(generation, profile = PROFILE)` (and `:131` its default export), and that file is **not
  in the seal at all** (re-verified by my own query: absent from `product` AND from
  `executionPins`). **But `setupsIn` does not return the operation.** Measured at `:57-:63`, it
  `.map`s each surviving op to a FROZEN PROJECTION ROW,
  `{ op_id, date, time, setup, tags }` and nothing else. `createPlanEditProjector` needs the raw
  operation: `plan-edit-model.cjs:108-:110` demands `kind === 'fact'`, `class === 'event'`,
  `payload.profile === 'earned/first-run-setup/v1'`, `payload.setup`, and a 64 hex
  `canonical_content_commitment`, then `:112` reads `op_id`, `athlete_id`, `device_id` and
  `effective.local_date`. A projection row carries three of those nine fields. **Handing a row
  straight in refuses `PLAN_EDIT_ORIGIN_UNPROVEN` at `:110`.**

  **THE CORRECTION, and it still costs zero pinned bytes and adds no second rule.** The sealed
  factory calls `setupsIn((await repository.load()).generation, PROFILE)` exactly as
  `setup-host.mjs:85` already does, takes the ONE surviving row's `op_id`, and reads the raw
  operation out of **that same generation's** `collections.ops` by that id. `setupsIn` keeps
  ownership of WHICH op counts (its tombstone and `rejected` filters at `:47-:55` and its
  `device_seq` ordering at `:56`); the factory only dereferences an id it was given. Re-spelling
  that filter in the factory would be the second-spelling defect
  `plan-edit-model.cjs:61-63` names, and this avoids it. If the row count is not exactly one, the
  factory does not construct the host and the editor draws E0's refusal.

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
| `capture_lift` | `:614` | `state.exercises` (the ADMITTED state) through `liftAttach` (declared `:437`, applied `:613`) | **YES.** A lift minted by `add` or by `replace` exists only in the projected plan: `plan-edit-model.cjs:345` clones the row, `:349-:355` tags it, **`:358` pushes it into `state.exercises` and `:359-:365` maintain `exOrder`** (v2 cited `:344-:356` for the mint and stopped one line short of the push, v3, R2 N3.6). It is in neither the document nor the file, `liftAttach` returns null, `target` stays the new id, the filter finds zero, and a session recorded on that new lift refuses ONE CHECK EARLIER than `capture_sets`. EW-04 is in scope. The comment at **`:601-:611`** (v2 said `:604-:612`) calls this check "total" at **`:610`** because an uncorresponded SETUP lift is appended as retired; a plan-edit-added lift gets no such appending |
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

**THE CONTROLS ARE RE-CUT IN v3 (`E-R3`, R2 B3).** Under NO DISJUNCT each cell gains a control that
was impossible to write against v2's ruling, because v2 admitted both sides: a capture carrying the
PRE-edit shape on a date at or after `starts_on` must REFUSE.

> **EW-17a** (`update` that moves `sets`). ASSERT the outcome 4.3 chose for `capture_sets`, by that
> field name.
> CONTROL 1: the same three steps with an edit that changes only `n` must NOT refuse.
> **CONTROL 2, NEW: a capture carrying the PRE-edit count, recorded on a date AT OR AFTER
> `starts_on`, must still refuse `capture_sets`.** That is the disjunct's victim and it is what
> proves the widening is gone.
>
> **EW-17b** (`remove`, and a second run with a `day` change). ASSERT the outcome 4.3 chose for
> `capture_membership`, for BOTH pool and order.
> CONTROL 1: an edit whose `starts_on` is AFTER the capture's own local date must leave the check
> exactly as it is today.
> CONTROL 2: a capture whose pool matches the folded day but whose ORDER does not must still refuse,
> so the cell cannot pass by comparing sets instead of sequences.
>
> **EW-17c** (`add`, and a second run with `replace`). ASSERT the outcome 4.3 chose for
> `capture_lift`, by that field name.
> CONTROL 1: a capture naming a lift that NO programme in the story ever carried still refuses
> `capture_lift`, because that is the corruption the check exists for.
> **CONTROL 2, NEW: after a `replace`, a capture naming the REPLACED (now retired) lift on a date AT
> OR AFTER `starts_on` must still refuse `capture_lift`.** `plan-edit-model.cjs:361` writes that
> retirement, so the folded state does not carry the old lift, and only a disjunct would admit it.

These three settle reachability WITH EVIDENCE before anybody pays for a fix, which is what `:510`
asked for when it called reachability open. If all three come back GREEN at the tip, the defect is
not reachable through this path, the fix below is not built, and that fact is recorded in the ledger
with the cells as its proof. They stay in the suite either way, as the regression that keeps it shut.

EW-17c has a known ordering trap: `capture_lift` runs BEFORE `capture_sets`, so a cell that asserts
`capture_sets` on an `add` will pass for the wrong reason. Each cell asserts its own field by name.

### 4.3 (c) THE RULING, in five lines

1. **EXTEND PROVENANCE TO THE COMPANION'S PLAN BASIS. Do not refuse at the edit. NO DISJUNCT
   (v3, `E-R3`, R2 B3 upheld; v2's first two rows are WITHDRAWN).** The right-hand side of all
   three broken checks BECOMES the setup document as it stood ON THE CAPTURE'S OWN LOCAL DATE after
   the athlete's own proved plan edits, and nothing else is admitted:

   Write `FOLDED = foldPlanEditsAt(..., originalDay)` (ruling 2) once per capture, where
   `originalDay` is `source-admission.mjs:674 start.effective.local_date`, which the callback
   already has in hand. Then:
   - `capture_sets` (`:665`): `documentSets` is replaced by the per lift count **FOLDED**
     prescribes on `originalDay`. One value, not two. A count that does not equal it refuses,
     exactly as `:665` refuses today (D-PF-f5).
   - `capture_lift` (`:614`): `state.exercises` keeps its role for the ADMITTED state, and the
     membership of the programme is asked of **FOLDED**. A lift FOLDED does not carry on
     `originalDay` refuses, whether it was never in any programme or was retired by a `replace`
     before that date.
   - `capture_membership` (`:695-:699`): the pool and order are compared against
     `sessionMembership(FOLDED, originalDay)` instead of
     `sessionMembership(documentProgramme.state, originalDay)`. Pool AND order, exactly and in order.

   **WHY THE DISJUNCT WAS WRONG AND THE MEMBERSHIP ROW WAS RIGHT, in the words R2 used and I could
   not improve on.** The whole point of a dated fold is that for a given capture date there is
   exactly ONE count and ONE pool the programme prescribed. The second disjunct IS that value. The
   first disjunct is the UNFOLDED document, which on any date at or after `starts_on` prescribed
   something the programme no longer prescribed, so v2's ruling admitted a capture carrying the old
   count on a day the programme had moved on from. That is precisely the class of corrupt capture
   `:665` exists to refuse. The same holds for `capture_lift` after a `replace`: `:361` retires the
   old lift on `starts_on`, and the disjunct kept admitting captures that named it afterwards.
   **v2's own safety sentence, "a count matching NEITHER still refuses", was the admission that the
   guard had become two of two rather than one of one.** Nothing is widened by v3.

2. **ONE DERIVATION, EXPORTED FROM THE FILE THAT OWNS THE RULE. This is where v1 priced a line it had
   no way to write (R1 B4, upheld).** `plan_basis` is a companion value. `programme()` and the capture
   callback are handed `ops` (`:438`) and nothing else, so the material exists but the derivation does
   not, and re-deriving edit semantics inside `source-admission.mjs` is precisely the bug
   `plan-edit-model.cjs:61-63` names about `normaliseName`:

   > "It must not be restated here: a second spelling of the rule is a second rule, and the bug would
   > be silent."

   **v2's SHAPE IS WITHDRAWN. `E-R4` rules, with R2 B4, that a fold over `apply()` and the raw
   `ops` map is not the fold, and I re-derived the reason rather than accepting it.** v2 named
   `foldPlanEdits(documentState, ops, onLocalDate)` "which reuses that file's own `apply()`
   (`:319`)" and said it "authenticates nothing itself: the caller passes the ops admission has
   already proved". Measured at `00e7a0d0`, both halves fail:

   - **Admission has proved nothing about those ops.** `source-admission.mjs:218-:220` filters
     `ops` for `payload?.profile === Setup.PROFILE`, requires exactly one, and runs
     `Setup.validate` on THAT op. Nothing else in `programme()` inspects the operation map. A plan
     mutation op is `{kind:'plan-mutation', class:'plan', payload:null}`
     (`plan-edit-commands.cjs:95`), so `:218`'s filter cannot see it by construction, and it is
     equally unproved when a fold reaches for it.
   - **`apply()` is not where the proving lives.** Everything that decides WHICH edits count is in
     `inspect()`: per op command validation `:285`, origin uniqueness `:282`, tombstones
     `:287-:293`, the status map `:294` and `:306`'s `active` filter, duplicate intent `:298`, id
     reuse `:299`, causal invalidation `:300`, the seen basis chain and parent set `:307-:309`, and
     date ordering `:310`. A fold over `apply()` and a raw map therefore applies an edit the
     athlete RETRACTED and an edit whose basis chain never proved, which widens admission through
     the back door: a tombstoned set count change would make the old count admissible again.

   **THE SHAPE, as `E-R4` rules it: the model's own `inspect()` plus `result()` pair, exported.**
   Measured, that pair already exists and is already composed: `result(info, date)` is
   `:369-:382`, and `read(generation, date)` at **`:383`** is literally
   `result(inspect(generation), date)`. `createPlanEditProjector` is already exported at `:397`.
   So the derivation the fix needs is NOT new logic; it is an entry point.

   **AND HERE IS THE PART THAT DECIDES THE PRICE, which I could not find stated anywhere and
   which the admission hunk's author must not discover at the first fixture.** The projector's
   PUBLIC `read()` cannot be called from `source-admission.mjs` as it stands, because `inspect()`
   opens with FOUR guards that ask "may this installation open the EDITOR right now", not "what
   did the plan say on date D":
   - `:226-:227` a non zero sync frontier, a recovery plan or a non empty snapshot plan refuse
     `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE`;
   - `:235` `importPresentIn(generation) !== !firstRun` refuses the same code. Admission runs on a
     generation whose `metadata.imports` may already carry an entry (`:176` reads exactly that
     list), so a fold built with `basisSource:'first-run'` refuses there;
   - `:236-:240` the other branch requires `admittedBasisOf(generation)` to equal `basisState`,
     and admission's `basisState` must be the DOCUMENT (`createCleanInitState` at `:221`), not the
     admitted import, so that branch cannot be used either;
   - `:242-:243` a non empty `collections.plan` or `planTransactions` refuses
     `PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT`.

   **THE EXPORT, therefore:** `foldPlanEditsAt({ documentState, setupOperation, generation,
   onLocalDate, hashBasis, validateTags, projectNewExerciseTags })`, added to
   `plan-edit-model.cjs`'s exports at `:397`, which runs `inspect()`'s PROOF half in full and
   `result()` (`:369-:382`) unchanged, and SKIPS only the four editability guards above. It is
   implemented by factoring `inspect()` into `guards` and `proofs` so there is still exactly ONE
   spelling of every proof; nothing existing changes behaviour. It returns `state` only, never the
   basis object (ruling 3). It reads no storage and constructs no host.

   **FOUR COLLABORATORS THE ADMISSION SIDE MUST SUPPLY, each measured:**
   - `documentState`: `createCleanInitState({setup: op.payload.setup})`, `source-admission.mjs:221`,
     the scratch the document already builds;
   - `setupOperation`: `op` at `:220`, the one Setup operation admission has already validated;
   - `hashBasis`: a 64 hex sha256 over a string. `platform` is in scope at the capture callback
     (declared `:143`, used at `:185` and `:779`), so `platform.hash` is the material;
     `plan-edit-model.cjs:101-:105` is the shape law it must satisfy and **whoever writes the hunk
     measures that adaptation rather than assuming it**;
   - `validateTags` and `projectNewExerciseTags`: **section 3.5's F2 package**, because `:285`
     runs `commands.validate`, which runs `editOf`, which for an `add` or a `replace` runs
     `tagsOf`. This is a dependency v2 did not have and it is why 3.5 lands FIRST on S10.

   Admission calls the fold ONCE per capture with `originalDay` (`:674`) and derives all three
   right-hand sides from the one result.

3. **THE CONSTRAINT THE FIX MUST NOT BREAK, which v1 quoted and then did not carry forward.**
   `documentSets` (`:222-:228`) and `documentProgramme` (`:229-:237`) are OUT PARAMETERS kept
   deliberately OUT of the returned basis, in those files' own words, "because that object is the
   programme digest's input at `:325`, and a new member would change a digest that binds what was
   admitted".

   **THE QUOTATION IS EXACT AND THE NUMBER INSIDE IT IS STALE, and v3 says so rather than passing
   it on (R2 N3.3).** At `00e7a0d0`, `source-admission.mjs:325` is inside the exercise id loop.
   **The programme digest is computed at `:779`:**
   `programme_digest:digest(platform.hash,'earned/local-source-programme/v1',replayed.programmeBasis)`.
   The CONSTRAINT is real and unchanged; only the inherited line number was wrong, and since STOP 11
   refuses to ship a fix that breaks this constraint, its reviewer would have followed that number.
   **Read `:779`.**

   The folded state is PER CAPTURE DATE and must therefore stay a local value inside the callback or
   a third out parameter. **A dated basis that quietly becomes a basis member changes what was
   admitted, and that is a worse defect than the one being fixed.** Any reviewer of the admission
   hunk checks this first.

   **AND ITS TWIN, which `E-R4` and R2 B4 both ask for: a fold that admits a TOMBSTONED edit is not
   shipped either.** STOP 11 in 9.1 carries both halves now. The proof is the fold running
   `inspect()`'s status map (`:294`) and `active` filter (`:306`), and a cell that saves an edit,
   retracts it, and shows the pre-edit count refusing afterwards.

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
| `rebuild/m4/workout/plan-edit-model.cjs` | ONE added export, `foldPlanEditsAt`, over the existing `inspect()` and `result()` (`:369-:382`) pair, plus the internal factoring of `inspect()` into its four editability guards and its proofs so that ONE spelling serves both callers. Nothing existing changes behaviour, and `read()` at `:383` and `preview()` at `:384` keep every guard they have today | the rule lives where it is spelled once, and the PROOFS are the point (`E-R4`) |
| `rebuild/m3/w6/local/source-admission.mjs` | one call at the head of the capture callback, the four collaborators of 4.3 ruling 2 assembled around it (including the `hashBasis` adaptation and the F2 projector), and three right-hand sides re-pointed at its result (`:614`, `:665`, `:695-:699`) | the checks live here |

Authored by lane D or lane B with its own independent review, riding the SAME S10 child as section
3's sealed half and section 3.5's F2 package, **and AFTER 3.5, which it now depends on.**

**COST, PRICED HONESTLY FOR THE THIRD TIME because `E-R4` asks for it (v1: 2 to 3 hours; v2: 4 to
6; v3: 7 to 10 plus its own review round).** The three things that moved it, each of them work v2
did not know about:

| what | hours |
|---|---|
| factoring `inspect()` into guards and proofs without changing what `read()` or `preview()` refuse, and proving it by the companion's existing twenty cells staying green | 2 to 3 |
| the exported `foldPlanEditsAt` and its own cells, including the tombstoned-edit twin of STOP 11 | 2 to 3 |
| the admission side: four collaborators, the measured `hashBasis` adaptation, three right-hand sides re-pointed, and the digest-invariance proof against `:779` | 3 to 4 |
| **total** | **7 to 10 hours plus its own review round** |

v1 priced one line in one file for one check. v2 priced two files for three checks. v3 prices two
files for three checks where one of them must be re-factored without moving a refusal, and where
the fold cannot be built at all until 3.5 lands. If the PM splits them across two children, the
interim of 4.3 ruling 5 applies in between, and 9.4 Q-B says why that is a bad trade. **`E-R7`
accepts the ruling in its corrected form and keeps them on S10 together.**

One warning for whoever writes it, measured: `plan-edit-model.cjs:173` has already been wrong once in
exactly this family. `:522` records B2, "still compared day/mg the admission no longer proves, so a
corresponded lift on another day admitted, adopted, then Edit My Week refused forever", fixed inside
the S8 round. The part 1 author report and both review files describe a file that no longer exists in
that form. Read `plan-edit-model.cjs` at the tip, never the report.

---

## 5. THE CELL PLAN, RED FIRST

Suite: `rebuild/m3/w7-preview/today/test/edit-week.test.mjs`, run by
`node --test rebuild/m3/w7-preview/today/test/edit-week.test.mjs`. Every cell individually
selectable by its EW id. **Sixteen cells:** the thirteen `:176` kept, plus EW-17a, EW-17b and
EW-17c. **EW-13 is written as FOUR selectable parts (EW-13a, EW-13b, and EW-13c and EW-13d which
3.4.3 adds in v3), so the suite carries NINETEEN selectable ids over sixteen cells.**

Order of writing, and it is not negotiable: the three EW-17 cells first and red, because they decide
section 4; then EW-11 and EW-12, because they decide whether the host composition can carry the
screens at all; **then EW-13c and EW-13d, because they are what catch 3.4.3's loop and they cost
almost nothing once EW-13a exists**; then EW-14, the composed cell, which is what 3.4 exists for;
then the rest. A screen written before EW-11 is green is a screen built on an assumption.

| cell | what it proves | half | blocked on |
|---|---|---|---|
| EW-17a | 4.2, `update` that moves `sets`, asserting `capture_sets` by name, **with CONTROL 2: the PRE-edit count on a date at or after `starts_on` still refuses** | composed | nothing |
| EW-17b | 4.2, `remove` and `day`, asserting `capture_membership` by name, pool AND order, **with the order-only control** | composed | nothing |
| EW-17c | 4.2, `add` and `replace`, asserting `capture_lift` by name, **with CONTROL 2: the REPLACED lift on a date at or after `starts_on` still refuses** | composed | **3.5** (both kinds enter `tagsOf`) |
| EW-01 | an enrolled athlete opens BOTH doors without first run setup; read, open, cancel and no op leave operation and outbox counts unchanged; AND the 2.2.1 boundary in both directions | composed | nothing |
| EW-02 | one lift's `sets` changed; every other id, field, established load and tag deep equal; existing non chip values render without coercion | composed | nothing |
| EW-03 | rename keeps id, load, era and notes and the historical name lookup; a new eligible session uses the new name | composed | nothing |
| EW-04 | replace with a duplicate label: distinct stable id survives retry and reopen; new load unknown; old sessions and records survive | composed | **3.5** |
| EW-05 | dated removal excludes the lift from future scheduling only; open and historical sessions unchanged; unrelated order survives; **asserts `PLAN_EDIT_WEEK_EMPTY` ONLY, because `covered()` is never called on the remove branch (v3, R2 B6). The day coverage assertion moves to EW-02's update-with-`day` case (state E3) and to EW-04's replace and add cases (states E4 and E6)** | composed | nothing |
| EW-08 | equipment values for the selected lift only; invalid, blank and out of order `steps` use the real validation; no zero, NaN or hidden default | composed | nothing |
| EW-09 | machine notes save through the existing coach command and appear on the same id's actual gym card; rename retains them; replacement does not inherit them; empty final note save refuses | composed | nothing |
| EW-11 | the actual producer, validator and projector prove identity, domain, effective date, seen basis, actor edit and causal linkage; malformed and stale basis refuse | composed | nothing |
| EW-12 | one deliberate save yields one durable edit intent and its complete outbox; injected pre commit failure changes neither; retry does not duplicate; lease, integrity and closed era never show Saved | composed | nothing |
| EW-13a | reopen and replay reconstruct current and pending plans; preexisting history byte equivalent | composed | nothing |
| EW-13b | a rejected or tombstoned edit is not still applied by an editor local cache | composed | nothing |
| **EW-13c** | **3.4.3: on an ADMITTED-import installation, a SECOND open after one saved `update` still reads. Names `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` in its failure message** | composed, THROUGH THE REAL ADOPTION CHAIN | **3.4's sealed hunk** |
| **EW-13d** | **3.4.3: on a FIRST RUN installation, a SECOND open after one saved `add` still reads AND the added lift appears exactly ONCE. Names `PLAN_EDIT_ID_REUSED`** | composed, THROUGH THE REAL ADOPTION CHAIN | **3.4's sealed hunk AND 3.5** (an `add` enters `tagsOf` on the adoption read) |
| EW-14 | same page commit reaches real Today and the next eligible gym entry with the new operation basis; in progress workout and check in drafts survive; **and `planEditedState` returns a STATE on EVERY path, including `read === undefined`, `read.read === false` and a reply of an unexpected shape, so adoption can never silently stop (v3, R2 N3.2)** | composed, THROUGH THE REAL HOST | **3.4's sealed hunk AND 3.5** (v2 said 3.4 alone; R2 N3.1) |
| EW-15 | tagged lift, explicit secondary `[]`, rename, replacement and a changed catalogue prove the `:155` snapshots | model | **3.5** |
| EW-16 | DOM: both doors, the before, after and date copy, the invalid, saving, saved and refusal states, keyboard labels and focus, narrow viewport, no new shell; copy census forbids em and en dash, emoji and exclamation marks | view | C-UI-9 |

### 5.1 The composed cell, named exactly

EW-14, EW-13c, EW-13d and the three EW-17 cells run through the REAL host composition and the REAL
durable client, not a projector helper and not a redraw. Concretely: the new `createEditWeekEntry` from
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

1. The sixteen cells of section 5 under their NINETEEN selectable ids, individually selectable,
   green at the exact candidate head, with the red first run shown. A cell blocked by 3.4 or 3.5 is
   red with its reason named, never removed.
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
7. **RE-SCOPED IN v3 for the reversed cut (`E-R1`).** For the RELEASED half: no diff outside the
   six new files, the `t-edit-week` block, `preview.css`, and the route and mount inside the
   released `today-app.cjs` (3.3 line 2a). For the SEALED half: no diff outside `today-entry.mjs`
   and the module TODAY-SPLIT creates (3.3 line 2b). The runner's `UNLISTED-PRODUCT-DRIFT` check is
   the proof, not a reading of the diff. This clause binds the LANE's diff. The S10 child
   additionally carries the `.github` hunk (3.3 line 7), section 3.5's F2 package and section 4.4's
   two sealed hunks, each under its own custody and its own review.
8. **NEW in v3.** The sealed WRITER-FENCE cell of `:542` (C) and `:543` is GREEN with this item's
   files in the tree. `edit-week-basis.mjs`, `edit-week-model.mjs`, `edit-week-view.mjs`,
   `edit-week-check.mjs` and `edit-week-tags.mjs` are all outside the sealed inventory, so the
   fence is the proof that none of them calls a writer, opens IndexedDB or imports a host. **A
   builder that has to make the fence skip one of them has found a STOP, not a workaround.**

---

## 7. WHAT WAITS, AND WHAT CAN BE BUILT NOW

### 7.1 Can start today, in parallel with the look, with no collision

- `edit-week-model.mjs`: the pure state machine over the five host replies of section 2.1. It holds
  the draft, maps every refusal code of section 2.2 to a state, and touches no DOM and no store. It
  is testable without a browser and without the look.
- `edit-week-basis.mjs` (3.4.1) and its own cells. **In v3 it is a PURE function that opens nothing,
  so it needs no host at all, fake or real: its cells feed it reply objects.** v2 said it "does not
  need the sealed hunk to exist in order to be written and proved against a fake host", which was
  true for a fake host and false on a real phone (R2 N3.1); that distinction disappears with the
  durable act.
- The whole suite skeleton with all sixteen cells written RED, against the merged companion, whose
  API is sealed and will not move under the builder.
- EW-17a and EW-17b to their answer, and section 4's fix authored by its own lane if the answer is red.
- `edit-week-check.mjs` in the existing `*-check.mjs` pattern.

None of this depends on a pixel. This is the real parallel work and it is roughly half the build.

**WHAT CANNOT START, and v1 said it could (R1 B3):** EW-04, EW-15, EW-17c, **EW-13d and EW-14 on
any generation carrying an `add` or a `replace`** are BLOCKED until section 3.5's F2 package lands,
because `add` and `replace` cannot be made green by any code that exists in the tree. A builder that
follows a plan without this note writes EW-04 and watches it refuse **`PLAN_EDIT_TAGS_INVALID`**
(`plan-edit-commands.cjs:66` via `plan-edit-model.cjs:385`, NOT
`PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` at Save as v2 said: R2 B5, corrected in 3.5), and has
nowhere to go. Write them red, with 3.5 named as the reason, and move on.

**AND WHAT CANNOT START THAT v2 THOUGHT COULD (v3, `E-R1`).** 3.3 line 2a's route and mount inside
`today-app.cjs` cannot be written until TODAY-SPLIT lands, because until then the file is sealed and
this item has no child of its own for it. They are lane C work with a wait in front of them, not
work that is blocked forever, and they are about six lines.

**`E-R8` SETTLES Q-C AND Q-D: EW2-BUILD starts on the VIEW half as soon as this spec is accepted,
before C-UI-9 exists.** Everything in 7.1 is that work.

### 7.2 Waits, and on exactly what

| what | waits on | why |
|---|---|---|
| the editor's look, every state | a design ticket that does not exist: C-UI-9 (section 8) | building to the 2026-09-12 brief's numbers buys a second port of the whole editor |
| `preview.css`, any style hunk | S9 sealing, because it is released only then | `:536` (1): the release happens INSIDE S9, never by editing a sealed artifact |
| `build.mjs`, if a new bundle input is needed | S9 sealing WITH hunk H18 | S9 A.6: without H18 the closed list is one path and `build.mjs` stays sealed |
| the Machine settings door's rendering | C-UI-5, **AND whichever reseal child carries C-UI-5's own sealed files** | C-UI-5's MAY CHANGE list (`C-UI-5.md:8-9`) is `machine-settings-view.mjs`, `machine-settings-host.mjs` and "the gym stubs in `gym-app.mjs`". The last two are in `product` and S9 does not release them (its closed list is two paths), so C-UI-5 is itself a reseal-child ticket. S9's own A.3 says the same. Part 2 still takes ZERO bytes there; the WAIT is longer than v1's row said (R1 N9) |
| EW-04, EW-15, EW-17c, EW-13d, and EW-14 on any generation with an `add` | section 3.5's F2 package on S10 | no `projectNewExerciseTags` or `validateTags` exists in product, and the ADOPTION READ needs them too (3.4.4) |
| EW-14, EW-13c | 3.4's sealed hunk in the module TODAY-SPLIT creates | a route and a mount do not change what the gym card opens on |
| **the route and the mount (3.3 line 2a)** | **TODAY-SPLIT being accepted and landing** | until then `today-app.cjs` is sealed, and this item has no child for it. `:543` releases it, `:542` (C) says the build starts only on acceptance of the spec, and the spec is in round 2 |
| the entry point binding | C-UI-2 and S9-TODAY-CARRY finishing their `today-app.cjs` hunks | `:539` (2); three hands want that neighbourhood this week and part 2 goes last |
| the sealed half landing | the S10 child, after S9's role, S9-TODAY-CARRY and TODAY-SPLIT | `today-entry.mjs` is sealed and `:543` does not release it; the module 3.4 lands in does not exist yet |

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
    whose sentences the PM rules on at acceptance (2.2.2.1, `E-R9`, Q-F).
13. **NEW in v3.** The `PLAN_EDIT_DAY_UNCOVERED` face, which is NOT the remove confirm (R2 B6): it
    belongs to the field editor of item 6 (state E3, when `day` is edited) and to the add and
    replace forms of items 5 and 6 (states E4 and E6).

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
never been asked. **`E-R10` ACCEPTS the question as worded and accepts that route**, so this is
settled and neither the wording nor the routing is re-opened by round 3.

---

## 9. STOP CONDITIONS, RISKS, ESTIMATE

### 9.1 STOP conditions. Any one of them stops the lane and comes to the PM the same hour.

1. The editor cannot be seated without changing a C-UI LOCKED line.
2. **REWRITTEN IN v3.** S9's two path closed list is now PM-ACCEPTED (`:542` (B)), so that half of
   this STOP is DISCHARGED. What replaces it: **TODAY-SPLIT is accepted with an interface that
   differs from `:543`'s** (one sealed factory owning every lane opener, host, adoption gate and
   rebase; a released `today-app.cjs` keeping the router; a callback table taking raw values), or
   TODAY-SPLIT is not accepted at all. Section 3 is re-judged before a byte moves. `:543`'s own
   ESCAPE HATCH is live: its reviewer "may find for v1", and if it does, `today-app.cjs` stays
   sealed and 3.3 line 2a goes back onto S10.
3. `plan-edit-host` as merged cannot satisfy EW-14 through the real host composition.
4. Any need to change a sealed byte, a package, a receipt, the ledger, the engine or the coach,
   beyond the hunks section 3.3 lines 2a, 2b and 7, 3.5 and 4.4 name under their own custody.
   **This now includes the WRITER-FENCE: a released file that has to call a writer is a STOP
   (6.8), never a fence exemption.**
5. Any EW-17 cell comes back in a third shape that is neither of section 4's two outcomes.
6. A taste fork on the look (`:539` (2)).
7. Any temptation to widen back to four doors. Days and Priorities are v1.1 and Days additionally
   waits on F1 and on owner question Q3.
8. ANY new copy sentence at all beyond 2.2.2.1's four, which are PROPOSED and not built until the
   PM rules (2.3 law 4).
9. **NEW in v2.** 3.4's adoption read costs more than one extra durable reopen per adoption, or
   `edit-week-basis.mjs` cannot return the unchanged state on every refusal path. Either means the
   composing module is doing more than composing, and option (b) is no longer the cheap answer.
10. **NEW in v2.** Section 3.5's F2 package cannot land on S10, or lands at a path other than
    `rebuild/m4/workout/setup-tags.cjs`. Three cells and one door's two actions depend on it.
11. **NEW in v2, WITH ITS TWIN ADDED IN v3 (`E-R4`, R2 B4).** (a) The admission fix's folded state
    cannot be kept out of the returned basis (4.3 ruling 3, digest at `:779`). (b) **The fold
    admits a TOMBSTONED edit, or an edit whose basis chain never proved.** Either is not
    negotiable and a fix that breaks either is not shipped.
12. **NEW in v3.** `inspect()` cannot be factored into its editability guards and its proofs
    without moving what `read()` or `preview()` refuse. That is the whole premise of 4.4's first
    row; if it fails, the fold needs a different home and section 4 is re-judged.
13. **NEW in v3.** `basisState` is found wired to anything but the raw admitted or first run state
    (3.4.3), or EW-13c and EW-13d cannot be written. The loop is the defect that would ship
    silently and brick the editor on the athlete's FIRST saved edit.

### 9.2 Risks

| # | risk | the guard in this spec |
|---|---|---|
| 1 | the missing design; building to the old preview numbers buys a second port | section 8; the VIEW half's model and cells carry no look |
| 2 | S9 does not release what the plan assumed; six of seven UI tickets already face this | section 3.1 and STOP 2 |
| 3 | stale line cites from the 2026-09-12 brief and from the part 1 report | every cite this round touches re-measured at `00e7a0d0`; `:522` named in 4.4; R1 N1 and R2 N1, N3.3, N3.4 and N3.6 all applied and listed in 11.7 |
| 4 | the four door trap | section 1.1 restates the narrowing in its own words |
| 5 | the provenance defect fixed in the wrong file, or in one check of three, or not at all | section 4.1.1, 4.3 ruling 2, and three red cells first |
| 6 | lane collision on `today-app.cjs`, live right now, and it is about to be rewritten by TODAY-SPLIT on top of that | section 3.3 line 3: under 70 added sealed lines, zero removed, part 2 goes last, and 3.3 line 6 gives the order on the child |
| 7 | `browser-check.mjs` treated as evidence while it is stale red with no CI home | section 2.3 law 3, now a STANDING rule rather than a wait |
| 8 | the estimate read as elapsed time | 9.3 |
| 9 | **NEW in v2.** the screens ship and the edit reaches nothing, because the route and the mount looked like the whole wiring half | section 3.4, and EW-14 blocked on its hunk rather than quietly passing on a redraw. `:543` makes this worse, not better: the route is now the CHEAP half and a builder could ship it alone |
| 10 | **NEW in v2.** a second spelling of the tag taxonomy, or of edit semantics, written page-side or admission-side because the real one was unmerged or awkward to reach | 3.5 consequence 2, 4.3 ruling 2, and `plan-edit-model.cjs:61-63` quoted in both |
| 11 | **NEW in v3.** a spec written against a split that has not landed. Section 3 depends on `:543`'s interface, and `:543`'s own escape hatch lets its reviewer find for v1 | STOP 2 rewritten, 3.0's TIMING paragraph, and 7.2's new row. The RELEASED work of 7.1 is identical under both outcomes, which is why the estimate's first rows do not move |
| 12 | **NEW in v3.** the fold is built over `apply()` because it is the obvious function, and a retracted edit quietly widens admission | 4.3 ruling 2's two measured bullets, STOP 11 (b), and a cell that retracts an edit and shows the pre-edit count refusing |

### 9.3 Estimate, in hours, and no elapsed time promise

**RESTATED IN v3 FOR THE BUILD UNDER `E-R1` TO `E-R4` (`E-R11`).** The `can start` column is the
answer to "what can start the day this spec is accepted", and it is the reason the total moving
does not move the START date.

| work | hours | v2 | can start the day this spec is accepted? |
|---|---|---|---|
| RELEASED half: `edit-week-model.mjs`, `edit-week-view.mjs`, `edit-week-check.mjs`, the `t-edit-week` block | 7 to 9 | 7 to 9 | **YES** |
| RELEASED half: `edit-week-basis.mjs` (now pure, so cheaper) and `edit-week-tags.mjs` with their own cells | 2 to 3 | 2 to 3 | **YES** for `edit-week-basis.mjs`; `edit-week-tags.mjs` can be written but goes green only with 3.5 |
| the suite: sixteen cells under nineteen ids, including EW-13c, EW-13d and the three EW-17 with their new controls | 10 to 13 | 9 to 11 | **YES, written RED.** EW-17a and EW-17b run to their answer at once |
| SEALED half: `createEditWeekEntry`, `openEditWeekHost` and its ten arguments, the adoption compose, and their proof | 4 to 6 | 3 to 4 | NO: waits on TODAY-SPLIT and S10 |
| RELEASED route and mount inside `today-app.cjs` (about six lines) | 0.5 to 1 | counted above | NO: waits on TODAY-SPLIT landing |
| one independent review round plus the fix round | 5 to 6 | 5 to 6 | follows the work |
| D2's separate implementation review (`:176` (2)), a SECOND obligation (`E-R8`) | 2 to 3 | 2 to 3 | follows the work |
| **EW2-BUILD total** | **30.5 to 41 hours of model time** | 28 to 36 | **about 19 to 25 of it can start on acceptance** |

**What moved and why, so the PM is not asked to take a number on trust:** the suite row grew for
EW-13c and EW-13d and the four new controls; the sealed row grew because `openEditWeekHost` and its
ten arguments are real work that v2 had not costed at all; and the route and mount were split out
because they are now a different half with a different wait. `edit-week-basis.mjs` got cheaper, not
dearer, by becoming pure.

Not counted above, because they are shared or not this lane's:

- **section 4.4's admission hunk, TWO sealed files, 7 to 10 hours plus its own review round** (v1:
  2 to 3; v2: 4 to 6). 4.4 prices the three parts;
- section 3.5's F2 package landing at `rebuild/m4/workout/setup-tags.cjs`, another lane's, with its
  own review. **No PE-f2-identity re-point: v2 asked for one and it is not needed (R2 N3.5);**
- section 3.3 line 7's `.github` registration, the PM's;
- **TODAY-SPLIT itself, which is neither this lane's nor this estimate's.** `:543` reports v1's own
  figure as 29 to 42 hours plus 8 to 12 of review for the opposite cut, and says the reversed move
  is "about a third the size". This item does not re-estimate another lane's ticket;
- the S10 chain, which S8 measured at about 2.5 hours of preparation plus about 35 minutes for chain
  A and about 1 hour for chain B, shared across the items on it.

The brief's own "about two builder days after dependencies" was written for BOTH parts, before three
seals, a real import, a full UI port and a narrowing. Part 1 alone merged as 20 files and +3168 lines.
Treat two builder days as the floor for part 2, not the ceiling.

### 9.4 Open questions for the PM, each with a recommendation

**SEVEN OF THE NINE ARE NOW ANSWERED, and v3 records the answers rather than re-asking them.**

| # | question | status after `E-R1` to `E-R11` |
|---|---|---|
| Q-A | v2 asked whether to wait for S9's OWNER-1 on splitting `today-app.cjs`. | **CLOSED, and its framing was wrong.** `:542` (C) rules TODAY-SPLIT as "the PM's decision and not an owner question", and `:543` rules its DIRECTION. Q-A's recommendation survives (do not wait to start); its framing does not, and 3.0 replaces it. R2 N3.8.1 caught this and is upheld. |
| Q-B | Does the PM accept 4.3's ruling, and do the hunks ride S10 together? | **ANSWERED: `E-R7` accepts the ruling IN ITS CORRECTED FORM (`E-R3` no disjunct, `E-R4` the inspect/result fold), and the admission hunk, the adoption hunk, the F2 package and the wiring ride S10 TOGETHER.** |
| Q-C | Does EW2-BUILD start before C-UI-9 exists? | **ANSWERED YES by `E-R8`:** on the VIEW half, as soon as this spec is accepted. 9.3's fourth column says how much that is. |
| Q-D | Does `:176` (2)'s "after N2" still bind? | **ANSWERED by `E-R8`: the clause is DROPPED, that queue no longer exists.** Lane C builds; D2 reviews the implementation as a SECOND obligation on top of the screens tier's own blind reviewer. 1.2 carries it. |
| Q-E | `design.cjs` and `today-model.cjs` are named as release candidates at `:536` but are NOT in the S8 `product` map at all (re-verified by my own 3.2 query). | **STILL OPEN, and not this lane's call.** `:542` (B) rules PACK-PIN and COPY-BIND, which is the same worry answered from the other end, but it does not say `:536`'s candidate list is not a pin list. The PM should say so once. |
| Q-F | Four refusal codes reach the athlete with no true sentence: `PLAN_EDIT_WEEK_EMPTY`, `PLAN_EDIT_BASIS_SOURCE_CHANGED`, `PLAN_EDIT_BASIS_HASH_INVALID`, `PLAN_EDIT_BASIS_HASH_UNAVAILABLE`. | **ANSWERED IN PART: `E-R9` asks this spec to PROPOSE one sentence for each, and 2.2.2.1 does, marked PROPOSED FOR THE PM.** The PM rules at acceptance. Until then the interim is state X's existing actionable refusal treatment. **This spec proposes no other copy.** |
| Q-G | Who lands the F2 package, and on which child? | **ANSWERED: `E-R6` ACCEPTS the proposal as written.** `rebuild/m4/workout/setup-tags.cjs` lands on S10 by lane D with its own review; EW-04, EW-15 and EW-17c wait on it and say so, and 3.5 adds that 3.4's adoption read and 4.3's fold wait on it too. |
| **Q-H** | **NEW in v3.** 4.3 ruling 2 needs `inspect()` factored into its editability guards and its proofs so one spelling serves both the editor and admission. That is a hunk in a SEALED file whose twenty merged cells must stay green, and it is the premise of 4.4's price. Does the PM want it in `plan-edit-model.cjs`, or does he want admission to construct the projector and accept the guards as they are? | **In `plan-edit-model.cjs`, as `E-R4` rules.** Accepting the guards as they are does not work: 4.3 ruling 2 measures four of them refusing in admission's own context. STOP 12 covers the case where the factoring turns out to move a refusal. |
| **Q-I** | **NEW in v3.** `newIntentId` is a THIRD host argument with no product provider (2.1), and this spec names a one line minter over the installation's own `crypto.randomUUID()`. It is trivial next to the tag pair, but it IS a new provider in a sealed file. | **Accept the one liner.** The alternative is a second id scheme, and `plan-edit-host.mjs:171-:172` already guards a collision. Flagged only because v2 said TWO arguments were missing and a builder counting on that number would be one short. |

### 9.5 What this spec did NOT do

It ran no test, installed nothing, launched no browser, and changed no product, test, tooling or
workflow byte. It did not read `rebuild/conform/private`, any `ledger/` directory, `src/history.js`,
the protected soak or any of the owner's measurements, on either machine. The seal artifact was
queried by a script that printed counts and per-path YES/NO only; its contents were never printed.
`f3e9561` was not fetched: it is not an object in the farm mirror and the include list is not a thing
to work around. No credential appears in it. The reading for this round was done in the PM's cloud
farm mirror at `00e7a0d0`, with `rebuild/d2-ew2-spec` at `1a73d8f5`, `rebuild/c-today-split` at
`14c87fa7` and `rebuild/b-s9-ui-pins` at `3a5f91f9` synced beside it; the writing, the commit and
the push were done on the owner's PC. Zero U+2013 and zero U+2014 in this file, and no sentence
proposed by it carries a dash of any kind.

---

## 10. R1 FINDINGS: FIXED OR DISPUTED

**This section is v2's record, kept WORD FOR WORD. R2 re-derived every row of it and confirmed all
sixteen (its section 2, and its N2 row upholds the dispute in the author's favour), so round 3 does
not re-litigate it and does not re-measure it. The one row R2 left half open, N5, is closed by
11.1.** Its measurements were taken at `724ef3fc`; where a number in it has since been corrected,
section 11.7 says so and 11.7's number is the live one.

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

---

## 11. R2 FINDINGS: FIXED OR DISPUTED

Review under answer: `rebuild/lanes/d2/EW2-SPEC-REVIEW-R2.md` at `1a73d8f`, VERDICT REJECT at
`63710d2`, six BLOCKING and nine notes. **All fifteen are FIXED. NOTHING IS DISPUTED.**

I re-derived every finding from the tree at `00e7a0d0` rather than accepting the review's account of
it, and I could not break one of them. R2 is the better of the two reviews: B1 and B2 are two ends
of the same new section and both would have reached a builder, B3 caught a widening the author had
argued himself into, B4 caught a fold that would have re-opened admission through the back door,
and B5 and B6 are the fix round's own new prose being wrong about where code refuses. Its section 5,
the ten things it tried to break and could not, is taken as read and round 3 spent no time there.

**The order below is R2's own, from its section 6: B6, B5, B3, B4, B2, B1.**

### 11.1 B6, the sentence filed under the state that cannot raise it. FIXED

Verified `covered()` by hand: it is DECLARED at `plan-edit-model.cjs:323-:327` (its refusal
`PLAN_EDIT_DAY_UNCOVERED` at `:326`) and CALLED at exactly two places, `:330` inside the `update`
branch and `:345` inside the add and replace branch. The `remove` branch is `:339-:343` and calls it
nowhere. R2 is right on every line.

Also verified R2's two riders: `PLAN_EDIT_NO_CHANGE` is `:329`, inside `update` only; and
`PLAN_EDIT_WEEK_EMPTY` at `:341` really is E5's own.

FIXED: 2.2's E5 row no longer lists `PLAN_EDIT_DAY_UNCOVERED` or `PLAN_EDIT_NO_CHANGE` and no longer
carries the sentence; E3, E4 and E6 carry both the code and the SOURCED sentence from
`BRIEF-EDIT-MY-WEEK.md:61`; the rows no longer say "the E3 set" at all, because that phrase is what
let a code travel to a state that cannot raise it, and 2.2 now names a COMMON set once and lists
every other code per branch with its line. EW-05's row in section 5 asserts `PLAN_EDIT_WEEK_EMPTY`
only, and the day coverage assertion moves to EW-02 and EW-04. 8.2 gains item 13 so the design lane
draws the face in the right place.

**ONE MORE OF THE SAME FAMILY, found by re-reading the rows B6 made me re-read and reported here
rather than waiting for R3 to find it:** `PLAN_EDIT_TAG_BASIS_UNPROVEN` was in E4's and E6's lists.
It fires at `plan-edit-model.cjs:217` and `:219`, inside `createPlanEditProjector`'s own body, which
`projectorFor` (`plan-edit-host.mjs:68`) runs on the FIRST read. No review path can raise it. It is
now E0's.

### 11.2 B5, where the tag refusal fires. FIXED

Verified the whole order at `00e7a0d0`. `preview()` is `plan-edit-model.cjs:384`. Its FIRST
statement, `:385`, is `C.validateInput(value, { validateTags })`, which reaches `editOf`
(`plan-edit-commands.cjs:69`), which for `add` and `replace` calls `tagsOf` (`:78`), which refuses
`PLAN_EDIT_TAGS_INVALID` at `:66` the moment `validateTags` is not a function. And `:390` refuses
`PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE` on the review path, before `apply()` at `:392`. So a
builder cannot reach a green review, and v2's "green REVIEW then refuse at Save" was false.

FIXED: 3.5's second bullet is rewritten, the withdrawn sentence is named as withdrawn, and 7.1 tells
a builder to expect `PLAN_EDIT_TAGS_INVALID` at the first `Review change`. **R2's own account of
which line fires first is right and I confirmed the ordering by reading `preview()` top to bottom:
`:385` runs before `:390`.**

### 11.3 B3, the disjunct. FIXED

R2's argument is correct and I could not weaken it. The point of a dated fold is that for one capture
date there is exactly ONE value the programme prescribed; the second disjunct IS that value, and the
first is the unfolded document, which after `starts_on` prescribed something the programme had moved
on from. v2's own safety sentence, "a count matching NEITHER still refuses", was the admission that
the guard had become two of two. Verified the retirement that makes the `capture_lift` half concrete:
`plan-edit-model.cjs:361` writes `state.retirements[target.id]` on a `replace`.

FIXED under `E-R3`: 4.3 ruling 1 is rewritten with NO DISJUNCT. All three right-hand sides BECOME the
folded value for `originalDay` (`source-admission.mjs:674`). 4.2 gives EW-17a and EW-17c the control
that was impossible to write against v2's ruling (the PRE-edit count, and the REPLACED lift, on a
date at or after `starts_on`, must still refuse) and gives EW-17b an order-only control as well.
Section 5's rows carry the controls.

**R2 was also right that the membership row was already honest.** It is kept word for word.

### 11.4 B4, a fold over `apply()` folds retracted and unproven edits. FIXED

Verified both halves. (a) `source-admission.mjs:218-:220` filters `ops` for
`payload?.profile === Setup.PROFILE`, requires exactly one and validates THAT op; nothing else in
`programme()` inspects the map, and a plan mutation op is `{kind:'plan-mutation', class:'plan',
payload:null}` (`plan-edit-commands.cjs:95`), invisible to that filter by construction. (b) every
proof lives in `inspect()`: `:282` origin uniqueness, `:285` per op command validation, `:287-:293`
tombstones, `:294` the status map, `:298` duplicate intent, `:299` id reuse, `:300` and `:307-:309`
causal invalidation and the basis chain, `:306` the `active` filter, `:310` date order. `apply()`
(`:319`) knows none of it.

FIXED under `E-R4`: 4.3 ruling 2 withdraws `foldPlanEdits` over `apply()` and specifies the export
over the model's own `inspect()` plus `result()` pair. STOP 11 gains its twin: a fold that admits a
tombstoned edit is not shipped.

**THREE THINGS I MEASURED THAT NEITHER DOCUMENT HAD, and they are what makes the ruling writable
rather than merely correct:**

1. **The pair is already composed and already exported.** `result(info, date)` is `:369-:382` and
   `read(generation, date)` at `:383` is literally `result(inspect(generation), date)`;
   `createPlanEditProjector` is exported at `:397`. So no new logic is needed, only an entry point.
2. **But the public `read()` cannot be called from admission**, because `inspect()` opens with four
   EDITABILITY guards (`:226-:227`, `:235`, `:236-:240`, `:242-:243`) that ask whether this
   installation may open the editor, not what the plan said on a date. 4.3 ruling 2 lists each with
   its measured reason. This is why the export is a narrower entry and why `inspect()` must be
   factored, which is new sealed work and is why 4.4 re-prices to 7 to 10 hours.
3. **The fold needs the F2 tag projector**, because `:285` runs `commands.validate`, which runs
   `editOf`, which for an `add` or a `replace` runs `tagsOf`. Section 4 therefore depends on section
   3.5, which no earlier round said.

### 11.5 B2, the hunk that cannot be written and the basis that loops. FIXED

Verified all three parts. (i) `today-app.cjs:2488` ends with a semicolon, so v2's `.then` was not
appendable and "zero removed" was not achievable. (ii) `openPlanEditHost` exists nowhere:
`grep -rn 'openPlanEditHost' rebuild` returns nothing, and it was in neither half, neither budget
nor the 3.2 table. (iii) the loop: `plan-edit-model.cjs:237` computes
`adopted = admittedBasisOf(generation)` and `:240` fails `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` unless
`equal(adopted, base)` where `base = clone(basisState)` at `:107`; on a first run installation `:236`
skips that guard and `result()` (`:369-:382`) replays every active edit over `clone(base)`, so an
`add` hits `PLAN_EDIT_ID_REUSED` at `:346` and a `remove` hits `PLAN_EDIT_TARGET_UNAVAILABLE` at
`:321`. Every cite R2 gave holds.

FIXED under `E-R2`: 3.4.2 names the factory `openEditWeekHost`, says it lives in the SEALED module
(3.3 line 2b) inside line 3's budget, and gives all ten arguments with the measured source of each.
3.4.3 pins `basisState` to the RAW admitted or first run state in one sentence, prints the three
measured failures, and adds EW-13c and EW-13d, which are exactly the two cells `E-R2` asks for. 3.4.4
gives the hunk in the sealed module, withdraws "zero removed" by name, and lists the four things
TODAY-SPLIT must leave in place for it. STOP 13 is new.

**One finding of R2's that grew while I checked it.** 2.1's "two of those ten arguments have no
production provider" is THREE: `newIntentId` has none either. Measured:
`grep -rn 'newIntentId' rebuild --include=*.mjs --include=*.cjs` returns the parameter
(`plan-edit-host.mjs:43`), its `TypeError` (`:45`), its call site (`:170`) and three test or lane
suppliers. It is cheap, and 3.4.2 and Q-I say where it comes from, but a builder counting on v2's
"two" would have been one short.

### 11.6 B1, a wiring act filed in the view half. FIXED

Verified the chain: `host.read()` is `plan-edit-host.mjs:162`, which enqueues `readVerified`
(`:145`), which calls `lane.reopen()` (`:148`); the host's own construction requires
`client.hostBindings` (`:44`) and calls it (`:81`). So the file v2 filed in the VIEW half opens a
durable lane and builds a host. Verified `DECISIONS:542` (C) and `:543`: the WRITER-FENCE cell fails
when any file outside the sealed inventory calls a writer, opens IndexedDB or imports a host. R2 is
right, and R2 was also right to say plainly that the ledger moved under the author.

FIXED under `E-R1`, and the PM's ruling goes further than B1 did. Section 3 is re-cut for `:543`'s
reversed direction: 3.0 is new and says what rides S10 and what ships as lane C; the ROUTE and the
MOUNT become lane C because `today-app.cjs` is released; everything that constructs the host, opens
a lane, adopts a basis or rebases is sealed. 3.4.1 takes the PM's second option and reduces
`edit-week-basis.mjs` to a pure function fed by the sealed side, **with the justification `E-R1` asks
for: the sealed module must open the host either way, so moving the whole function there buys no
sealed surface and only adds the decision to the sealed budget, and the decision is the part that has
already been got wrong three times (B2 twice, N3.2 once).** 3.2 gains the rows, 3.3 splits line 2
into 2a and 2b and re-prices line 3, 6.7 is re-scoped and 6.8 makes the fence part of the bar, 9.3
splits the estimate accordingly.

### 11.7 The nine NOTES, and the five carried cites

| # | verdict | what I measured and changed |
|---|---|---|
| N3.1 the adoption module needs the tag providers too | **FIXED** | Verified `plan-edit-model.cjs:285` `commands.validate(op, id => ops[id])`, `plan-edit-commands.cjs:69` `editOf`, `:78` `tagsOf`, `:66` the refusal. On a generation carrying an `add`, the ADOPTION READ itself refuses without F2. 3.4.4, section 5's EW-14 and EW-13d rows, 7.1 and 7.2 all say EW-14 is blocked on 3.4 AND 3.5. |
| N3.2 the `&&`/`\|\|` shape silently skips adoption | **FIXED, and the shape is gone** | Verified `today-app.cjs:2493 if (!state) return;`, so a chain resolving to `undefined` adopts nothing: no `adoptBasis`, no `gym.rebase`, no `refresh`. 3.4.1 makes `planEditedState` total by construction (it calls nothing, so it cannot fall through a `catch`), 3.4.4 puts the `catch` on the sealed side where the durable call is, and EW-14's row asserts a returned state on every path including an unexpected reply shape. |
| N3.3 `:325` is stale inside the source's own comment | **FIXED** | Verified: `source-admission.mjs:325` is inside the exercise id loop; the programme digest is `:779`. 4.3 ruling 3 quotes the comment exactly, says the number inside it is the source's and is stale, and tells the reviewer to read `:779`. |
| N3.4 the S9 relay has one wrong member of five | **FIXED** | Re-measured all five: `:513`, `:596`, `:637` and `:2052` read `(view && view.indexedDB) \|\| globalThis.indexedDB`; `:1416` is `Promise.resolve().then(() => checkin.host.forDate(day))` and opens nothing. Also verified the PM's six writers at `:542` (A): `:493`, `:581`, `:1072`, `:1293`, `:1843`, `:2501`. 3.1 now prints both and states the rule R2 drew: a relayed measurement is re-measured or marked as relayed. |
| N3.5 PE-f2-identity does not need re-pointing | **FIXED** | Verified `model.test.cjs:511-:512` reads `git show f3e9561:rebuild/m4/workout/setup-tags.cjs`, a blob at a historical commit, which landing the file later cannot change. 3.5 consequence 1 drops the re-point and 9.3 drops it from the uncounted list. |
| N3.6 three cites close but not exact | **FIXED, all three** | `capture_lift`'s comment is `:601-:611` with "total" at `:610` (v2: `:604-:612`). The add and replace mint pushes at `:358` and maintains order at `:359-:365` (v2 stopped at `:356`). `gym-model.mjs:104` is the COMMENT; the code is `rebase()` calling `hostForDay(day)` at `:163`, with `hostForDay` declared as an option at `:96`. |
| N3.7 the re-measurement claim is wider than what was re-measured | **FIXED** | The header no longer claims every cite was re-measured at one head. It says what is true: every cite this round TOUCHES was re-counted at `00e7a0d0`, and this table names the ones that moved. |
| N3.8 `DECISIONS:542` has moved three things | **FIXED, all three** | (1) Q-A is CLOSED with its framing corrected: TODAY-SPLIT is the PM's decision, not an owner question. (2) STOP 2's first clause is DISCHARGED, the two path list being PM-ACCEPTED, and STOP 2 is rewritten around TODAY-SPLIT's interface instead. (3) 2.3 law 3 is restated as a STANDING rule: `browser-check.mjs` gets no CI home ever, so a green run of it is never this suite's evidence. |
| N3.9 section 1 does not carry the custody line | **FIXED** | 1.2 now carries it, with `E-R8`'s restatement: lane C builds, D2 reviews as a SECOND obligation, and "after N2" is dropped. |
| **N1's two residual drifts** (counted under R2's N1) | **FIXED** | `readVerified` is `:145-:153`, not `:143-:152`. The STALE refusal's extra fields are `:214-:216`, not `:215-:217`. Both corrected in 2.1. |

**THE FIVE CARRIED CITES R2 COUNTED, in one place:** `readVerified` `:145-:153`; the STALE extras
`:214-:216`; the `capture_lift` comment `:601-:611` with "total" at `:610`; the mint's push `:358`
and order `:359-:365`; and the digest `:779` inside the quoted comment. All five are corrected above
and in place.

### 11.8 What R2 could not break, and what v3 did not touch

R2's section 5 lists ten things it attacked and could not move: the refusal to invent a look, the
copy census, the pin and seal tables, the shape of the widening, the cells being written in outcomes,
the scope, the S9 relay's substance, the estimate's arithmetic, and the owner question. **v3 changed
none of them except where a PM ruling required it**, and each such change is named: 9.3's arithmetic
moves under `E-R11`, 9.4's questions are answered rather than re-asked, and the seal query was
re-run rather than relayed and came back identical for the third time.

Sections 1.1, 4.0, 4.1, 5.1, 5.2, 8.1, 8.3 and 10 are v2's, word for word, because neither review
could break them and neither could I.

### 11.9 What I did NOT dispute, and why that is worth a line

Round 3 disputes nothing. That is not deference: I opened every file R2 cited and re-derived every
finding, and on three of them (B3's argument, B5's ordering, N3.5's reasoning about a historical
blob) I went looking for the counter-argument and there is none. Where I could add, I added:
11.1's fourth misfiled code, 11.4's three measurements about the fold, 11.5's third missing provider,
and 3.6's `setupsIn` correction, which no review found and which would have refused
`PLAN_EDIT_ORIGIN_UNPROVEN` at the first fixture.
