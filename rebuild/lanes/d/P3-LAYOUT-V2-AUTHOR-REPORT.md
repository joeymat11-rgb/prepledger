# P3-LAYOUT-V2 - BUILD AUTHOR REPORT

Lane D, data path. Branch `rebuild/d-p3-real-shape`, base 6074c4f
(P3-REAL-SHAPE accepted). Ruling of record: `rebuild/DECISIONS.md` :522.

Commits:

| sha | what |
|-----|------|
| `2d0fe12` | P3-LAYOUT-V2: cells, red first |
| `848512c` | P3-LAYOUT-V2: the projector admits v2 beside v1; the page writes v2 |
| this one | the author report |

## 0. WHAT THE OWNER GETS

His imported programme has a bodyweight raise (`w: 'BW'`) and a held hack squat
(`w: 'hold'`). Before this ticket, a successful import left his LOWER day with
no card at all: the gym card blocked on `ENGINE_CAPTURE_LOAD_UNPROVEN`, because
the page's capture producer was the v1 one and v1 refuses to prescribe a
non-numeric load. That was gap 5, named by P3-REAL-SHAPE and handed back.

After this ticket his L day has a card, it carries the FILE's set count, and
both configuration lifts prescribe their own key by name. Every workout he
logged BEFORE the page moved is still read, still projects and still opens the
next morning's card: nothing of his is stranded.

## 1. THE PROFILE STRING, MEASURED FROM THE PRODUCER

Read out of `rebuild/m4/workout/engine-capture.cjs`, never invented:

```
Adapter.PROFILE                = earned/engine-workout-capture/v1
Adapter.CONFIGURATION_PROFILE  = earned/engine-workout-capture/v2
layout written when configured = earned/captured-lift-layout/v2
layout written otherwise       = earned/captured-lift-layout/v1
LAYOUT_PROFILES in the law     = 'earned/captured-lift-layout/v1','earned/captured-lift-layout/v2'
```

`layoutProfile` is `configured?'earned/captured-lift-layout/v2':'earned/captured-lift-layout/v1'`
at `engine-capture.cjs:18`, and `configured` is
`producer.rule_profile===CONFIGURATION_PROFILE`. So the string the law now
admits beside v1 is exactly the string that producer writes.

## 2. RED FIRST

Six cells written and committed at `2d0fe12` against the UNCHANGED product
tree, and measured there (`%TEMP%\L2-red.log`). Five red, one green control.

| cell | claim | at 2d0fe12 (product unchanged) | at 848512c |
|------|-------|--------------------------------|------------|
| D-L2-a | a v1 capture already on the device still projects once the page produces v2, and the next prescribing morning opens its card | **RED** `{phase:'blocked', code:'WORKOUT_PREPARATION_INVALID', total:null}` | GREEN `{phase:'ready', code:null, total:27}`, and the recorded day reads `finished` with its own slot count |
| D-L2-b | a device producing v2 from the first boot records a WHOLE workout, projects it, reconciles, next morning ready | **RED** threw `the session never completed: blocked` | GREEN, 21 slots recorded, next morning `ready` total 27 |
| D-L2-c | the deciding cell's L day: card READY with the FILE's set count, and the BW raise and the hold hack both prescribe | **RED** `blocked` / `ENGINE_CAPTURE_LOAD_UNPROVEN` | GREEN, `total` 22 (the file's L day, against the phone's 21), every `hanging` slot `{state:'specified', display:'BW', source_json {kind:'configuration',configuration_key:'BW'}}` and every `hack` slot the same for `hold` |
| D-L2-d | a v1 layout with a tampered profile / producer / basis / slot key / slot count still refuses `WORKOUT_CAPTURE_LAYOUT_UNPROVEN` by name | GREEN (the control that had to stay green) | GREEN, unmoved |
| D-L2-e | a v2 layout, the SAME five tampers, the SAME five names | **RED** threw `the session never completed: blocked` (a v2 capture could not be recorded at all) | GREEN, `deepEqual` against the SAME `EXPECTED` constant D-L2-d reads |
| D-L2-f | the capture provenance block in `source-admission.mjs` reads a v2 capture on a pre-import session | **RED** threw `the session never completed: blocked` inside `admitThrough` | GREEN, admits with no issue, one session, capture producer `earned/engine-workout-capture/v2`, 21 slots as recorded |

Files: `rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs` (a, b, c, f) and
`rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs` (d, e).

TWO DEFECTS IN MY OWN CELLS, found after the red commit and fixed in the change
commit; neither weakens a claim and neither is a product change:
1. D-L2-c looked the two lifts up by their FILE handle. At bracket level 5 the
   fixture has already remapped every handle onto the id the phone's setup
   minted (`real-shape-support.mjs` `variant`, level 2), so the lookup is now by
   the lift's own `w` value and the remapped id it carries.
2. D-L2-c read all the day's slots off `booted.workout.gymHost`. That is the
   host the page composed BEFORE adoption; the page's gym model rebases onto a
   fresh host once the basis is adopted (`gym-model.mjs:161-166`). The cell now
   opens the era's own gym host on the adopted basis, which is the state the
   page itself ends up standing on.

## 3. THE CHANGE, FILE BY FILE

`git diff --name-only 6074c4f..848512c` is nine files, three of them product.

### 3.1 `rebuild/m4/workout/engine-history.cjs` (+12 / -1)

- `:11-:21` a new named constant with the reason written above it:
  `const LAYOUT_PROFILES=['earned/captured-lift-layout/v1','earned/captured-lift-layout/v2'];`
- `:74` the law itself: `layout.profile!=='earned/captured-lift-layout/v1'`
  becomes `!LAYOUT_PROFILES.includes(layout.profile)`.

NOTHING ELSE ON THAT LINE OR AFTER IT MOVED. The same expression still requires
`same(layout.producer,capture.producer)`, `same(layout.basis,capture.basis)`,
`text(layout.correspondence_profile)` and
`layout.slots.length===capture.slots.length`; the loop after it still requires
each slot's `logical_set_slot`, `lift_lineage_id` and `position`, still refuses
a duplicate position, still requires the per-lift position run 1..n with no
hole, and still compares the effort target through `parseStrictJson`. A v2
layout's extra per-slot `prescribed_load` is NOT read here. Carrying a typed
load onto the PERFORMED side remains the configured-history candidate's
question (`rebuild/m4/spec/configured-history-candidate/`) and no byte of that
candidate moved.

### 3.2 `rebuild/m3/w6/host/workout-host.mjs` (+38 / -3)

`:171-:186` the reason; `:187` `const siblings = new Map([[workoutProducerIdentity.rule_profile, adapter]]);`;
`:188-:195` `isSibling`; `:196-:206` `readerFor`; `:207-:210` the projector now
takes `resolveCapturedLayout: ({ start }) => readerFor(start.prescription_capture?.producer).readLayout(start.prescription_capture)`.

This is the seam P3-REAL-SHAPE measured refusing. It resolved EVERY stored
Start's layout through the ONE adapter built from the PRODUCING identity, and
`engine-capture.cjs:118-119` refuses any capture whose producer is not that
adapter's, so the day the page's `rule_profile` moved, every workout already on
the device became unreadable.

IT IS A DISPATCH, NOT A RELAXATION, and that is the load-bearing claim:

- a sibling adapter is minted from THIS installation's own
  `workoutProducerIdentity` with only `rule_profile` taken from the stored
  capture, never from the capture's own claim;
- it is minted only when the stored producer has the same key SET as this
  installation's identity and is equal to it in every field except
  `rule_profile`;
- `createEngineWorkoutCapture` itself refuses any `rule_profile` outside
  `[PROFILE, CONFIGURATION_PROFILE]`, and a throw there falls back to the page's
  own adapter;
- anything that is not a sibling is handed to the page's own adapter and
  refuses exactly as it did before, with the same code in the same place;
- `readLayout` still makes its whole-producer equality check
  (`!same(capture.producer,producer)`) on every capture it is given.

So the set of captures this installation will read is exactly {its own two
profiles}, and no wider.

### 3.3 `rebuild/m3/w6/local/today-bindings.mjs` (+11 / -1)

`:93-:102` the reason; `:104` `rule_profile: Adapter.PROFILE` becomes
`rule_profile: Adapter.CONFIGURATION_PROFILE`. Only that field moves, which is
what lets `workout-host.mjs` mint the v1 sibling reader for the captures
already on the device.

### 3.4 what did NOT need to move

- `rebuild/m3/w6/local/source-admission.mjs`. Its capture provenance block
  (:597-:600) already accepted both producer profiles by name and already built
  its adapter from the capture's OWN producer. What it could not do was
  PROJECT, because the projector it composes carried the same v1-only law; 3.1
  fixes that for it too. `capture_producer`, `capture_sets`,
  `capture_membership` and `capture_lift` are byte-unchanged and D-L2-f drives
  all four.
- `rebuild/m4/import/production-mapping.cjs`. `PRODUCERS` already lists both
  rule profiles and `production-mapping.test.cjs` P3-M5 already pins that list
  against the adapter's own exports. 90/0.
- `rebuild/m4/workout/engine-capture.cjs`. Not one byte. The v2 producer, its
  load cell, its `readLayout` and the v1/v2 cross-read refusal are all as they
  were.
- `rebuild/engine/**`, `rebuild/coach/**`, `rebuild/DECISIONS.md`.
  `git diff --numstat 6074c4f..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md`
  is EMPTY. NOTHING was STOPped: the fix needed no engine byte.

### 3.5 the cells this change flips, and what they now say

Five cells of the accepted P3-REAL-SHAPE lane were the RECORD of gap 5 standing.
Each is restated to what it now measures, in its own comment, naming :522:

| cell | was | now |
|------|-----|-----|
| `q1-producer.test.mjs` D-RS-q1a | the control, on the page's default producer | unchanged claim, but it now names V1 explicitly, because the page's default is v2 |
| D-RS-q1b | a v1 capture is NOT readable under v2: `blocked` / `WORKOUT_PREPARATION_INVALID` | a v1 capture IS readable under v2: the v2 read `deepEqual`s the v1 read, `{ready, null, 27}` |
| D-RS-q1c | the v2 producer cannot record a whole workout; next morning `unfinished` / `WORKOUT_HISTORY_RECONCILIATION_REQUIRED` | the v2 producer records a whole workout (21 slots), next morning `ready` total 27 |
| D-RS-q1d | `PRODUCER.rule_profile === Adapter.PROFILE` | `PRODUCER.rule_profile === Adapter.CONFIGURATION_PROFILE`; the two profiles are still two |
| `real-shape-walk.test.mjs` D-RS-h | gap 5 stands: the L day is `blocked` / `ENGINE_CAPTURE_LOAD_UNPROVEN` | gap 5 CLOSED: the L day is `ready` and `total` is the FILE's 22, not the phone's 21 |
| `bar-admit.test.mjs` D-RS-BAR-b | the U day proved, the L day asserted `blocked` | BOTH DAYS proved: the L day `ready` with the FILE's L total |

`real-shape-support.mjs` gains ONE additive option: `admitThrough` forwards a
`producerIdentity` when a caller names one and is otherwise byte-equivalent, the
same way `phone` and `reopen` already forward it. D-RS-h2 (the same L day with
the configuration loads replaced by numbers) is untouched and still green, so
the pair still separates "the load type" from "the day".

THE DECIDING CELL OF P3-REAL-SHAPE NOW PASSES ON BOTH DAYS. D-RS-BAR-b is that
cell: on a fresh-start phone whose setup names the same lifts by name, the
real-shape bundle sealed by the real port admits with no refusal line, the page
adopts on the next boot of the same IndexedDB, the U day's card is ready with
the FILE's total and the file's handle ids, and the L day's card is now ready
with the FILE's total too.

## 4. THE BAR

Every suite through `%TEMP%\rs-run.bat` (PATH, `TZ=America/New_York`, cwd the
worktree, `node --test`), at `848512c`.

| suite | pass | fail | log | was at 6074c4f |
|-------|------|------|-----|----------------|
| `rebuild/lanes/d/p3-real-shape/*.test.mjs` | 56 | 0 | `%TEMP%\B-lane.log` | 56 / 0 |
| `rebuild/lanes/d/p3-layout-v2/*.test.mjs` (new) | 6 | 0 | `%TEMP%\B-l2.log` | 1 / 5 (red first) |
| `rebuild/lanes/d/p3-port-fix/*.test.mjs` | 35 | 0 | `%TEMP%\B-s7.log` | 35 / 0 |
| `rebuild/m3/w7-preview/import/test/*.test.mjs` | 35 | 0 | `%TEMP%\B-imp.log` | 35 / 0 |
| `rebuild/m3/w6/test/*.test.*` | 587 | 0 | `%TEMP%\B-w6.log` | 587 / 0 |
| `rebuild/lanes/d/plan-edit/*.test.*` | 90 | 0 | `%TEMP%\B-pe.log` | 90 / 0 |
| `rebuild/lanes/d/import-retract/*.test.mjs` | 13 | 0 | `%TEMP%\B-ret.log` | 13 / 0 |
| `rebuild/m4/import/test/*.test.*` | 90 | 0 | `%TEMP%\B-m4i.log` | 90 / 0 |
| `rebuild/m3/w7-preview/today/test/*.test.*` | 656 | **5** | `%TEMP%\B-today.log` | 661 / 0 |
| `rebuild/coach/test/*.test.*` | 234 | 0 | `%TEMP%\B-coach.log` | 234 / 0 |
| `rebuild/m4/workout/test/*.test.cjs` | 214 | **11** | `%TEMP%\B-m4w.log` | 214 / 11 |
| **total** | **2016** | **16** | | 2015 / 11 |

The ELEVEN in `m4/workout` are the same eleven, by name, unmoved: nine suites
fail at module load on `PERFORMED_W6_DIR` (`configuration-capture`,
`engine-capture`, `engine-history`, `history-panel`,
`native-next-targets-assembly`, `native-next-targets-correction`,
`native-next-targets`, `source-control`, and the one `context-history` cell that
asks for the same root) and two are the engine byte pins `H3/SUP-3` and
`H3/SUP-5` over `rebuild/engine/merge.cjs` and `rebuild/engine/today.cjs`,
whose numstat over `6074c4f..HEAD` is EMPTY.

### 4.1 THE FIVE IN `today`, AND WHY NO GUARD WAS TOUCHED

DEVIATION, NAMED AND NOT WORKED AROUND. The five are not behaviour. Every one
of them is a BYTE PIN cell over the two product files this ruling moves:

| cell | file | what it says |
|------|------|--------------|
| `food.test.mjs:826` N1.18 | today-bindings.mjs | "N1 must not touch a file the B-NTC artifact pins ON DISK (DECISIONS:144)" |
| `machine-settings-ui.test.mjs:742` S10 | today-bindings.mjs | "this build must not touch a file the B-NTC artifact pins ON DISK" |
| `problem.test.mjs:1594` N2-08 | today-bindings.mjs | "today-bindings.mjs is pinned ON DISK by the merged B-NTC artifact" |
| `setup.test.mjs:2348` re-pin | today-bindings.mjs AND workout-host.mjs | "a file the B-NTC artifact pins moved on disk and no package on this branch declares it" |
| `setup.test.mjs:2390` re-pin | today-bindings.mjs | "must stay byte-identical, or stand at a post a declaring spec names" |

`setup.test.mjs:2306-2345` spells the licence out: a pinned file is exempt
"exactly while it stands at the post S<n>'s own spec declares for it", read from
`rebuild/lanes/b/tooling/packages/<SPEC>.json` `product[file].post`, searched
youngest-first over `CHILD_SPECS = ['H3','S3','S4','S5','S6','S7']`. The
declaring package for these two moves is S8, and DECISIONS:522 puts S8 in its
own tooling round: "S8 = P3-REAL-SHAPE + P3-LAYOUT-V2 together, child of S7,
through the :519 chain with its own tooling round."

SO I LEFT ALL FIVE RED. Minting a `packages/S8.json` or appending 'S8' to
`CHILD_SPECS` from this lane would be issuing my own licence for my own move -
weakening the guard to go green - and it would be doing lane B's tooling round
without lane B. The five are the honest signal that this ticket's product moves
are waiting on the S8 declaration, which is exactly where :522 put them.

THE FOOTPRINT IS ALREADY MINIMAL ON THIS AXIS. `today-bindings.mjs` alone
fails all five cells; `workout-host.mjs` appears only as a second line inside
`setup.test.mjs:2348`'s list and adds no additional failing cell. Since the
ruling itself names `today-bindings.mjs`, no placement of the dispatch avoids
the five. I considered wrapping `createEngineHistoryProjector` inside
`today-bindings.mjs` so that `workout-host.mjs` stayed byte-identical; it saves
no cell, it leaves the host's own resolver as dead code, and it puts "which
adapter reads this capture" in a layer that owns neither adapter. Rejected.

### 4.2 TWO EXTRA RUNS, OUTSIDE THE BAR

Because this ticket moves `workout-host.mjs` and `engine-history.cjs`, two
suites the P3-REAL-SHAPE bar does not name were run as well.

1. `rebuild/m3/w6/host/test/*.test.mjs`: **48 / 0** (`%TEMP%\X-host.log`). This
   is `workout-host.mjs`'s own suite and it is green.
2. `rebuild/m4/workout/test/*.test.cjs` with `PERFORMED_W6_DIR` pointed at this
   worktree (`%TEMP%\rs-run-w6.bat`), so the nine module-load suites actually
   execute: **223 / 11** (`%TEMP%\X-m4w-w6.log`). The same run against the
   PRE-CHANGE product bytes (the three files checked out at `2d0fe12`, then
   restored) is **223 / 11** with a BYTE-IDENTICAL failing set
   (`%TEMP%\X-m4w-w6-base.log`; compared name by name, IDENTICAL true). So
   nothing this ticket did moved any of them. The eleven there are artefacts of
   pointing the "retained W6 root" at the live tree rather than at the retained
   revision those cells were written against - for instance
   `configuration-capture.test.cjs:52` expects `WORKOUT_CAPTURE_INVALID` from
   the retained `capture.cjs` and gets `ENGINE_CAPTURE_PROFILE_INVALID` from the
   live one, before and after alike.

   THE POINT OF RUN 2: it executes `configuration-capture.test.cjs`, which the
   bar cannot. Eight of its nine cells pass, including the v1/v2 layout shapes
   and `resolveLayout`. Its cross-read pair (`:52-:53`) is the one that differs,
   identically before and after, for the reason above. The cross-read claim is
   nonetheless proved where it matters, on the real page, by D-L2-d and D-L2-e:
   a v1 capture and a v2 capture each read by their own adapter, and the five
   tampers earning the same five names in both.

## 5. DEVIATIONS

1. **The five `today` byte-pin cells** (section 4.1). The only bar deviation.
   Not worked around, not licensed by this lane.
2. **Two defects in my own new cells**, found after the red commit and fixed in
   the change commit (section 2). Both were in D-L2-c, both were about which id
   space and which host to read; neither weakened the claim, and D-L2-c was red
   for the RIGHT reason at `2d0fe12` (`blocked` / `ENGINE_CAPTURE_LOAD_UNPROVEN`
   at the phase assertion, before either defect could be reached).
3. **`real-shape-support.mjs` was edited in the red-first commit.** It is lane
   test support, not product, and the edit is one additive optional parameter.
   The lane was re-run at that commit and was 56 / 0, unchanged.
4. **D-L2-d is a control, not a red.** The ticket lists six cells; five were red
   at `2d0fe12` and D-L2-d was green there by design, because it asserts that
   the v1 path keeps refusing exactly as it did. A cell that was red would have
   meant the v1 path was already broken.

## 6. DASH SCAN

`rebuild/lanes/d/p3-layout-v2/*`, the three product files, the four edited lane
files and this report were scanned for U+2013 and U+2014. Over the whole diff
`6074c4f..HEAD`, every ADDED line was scanned:
`ADDED_LINES_WITH_EN_OR_EM_DASH 0`.

`workout-host.mjs` (9) and `today-bindings.mjs` (44) each still contain
pre-existing em dashes on lines this ticket did not touch; none is mine and none
was introduced here.

## 7. OPEN QUESTIONS FOR THE REVIEWER AND THE PM

1. **S8 must declare the two moved files** (section 4.1). Until it does, five
   `today` cells are red by design. `rebuild/lanes/b/tooling/packages/S8.json`
   needs `product['rebuild/m3/w6/local/today-bindings.mjs'].post` and
   `product['rebuild/m3/w6/host/workout-host.mjs'].post`, and
   `setup.test.mjs` `CHILD_SPECS` needs `'S8'` appended, both in lane B's
   tooling round. I did neither.
2. **`rebuild/m4/spec/configured-history-candidate/construct.cjs:6`** does
   `once("if(!layout||layout.profile!=='earned/captured-lift-layout/v1'||", ...)`
   and asserts that substring appears EXACTLY ONCE in the projector's source.
   After 3.1 that substring is gone, so the candidate's constructor would now
   throw `Unique projector edit`. The candidate is entirely env-gated
   (`EARNED_CONFIGURED_HISTORY`), is in no bar row, and is not accepted work, so
   I did NOT touch it - re-pointing a candidate's source patch is that
   candidate's own round. Naming it here so it is not discovered by surprise
   when the typed-load question is picked up.
3. **A typed load is still not carried onto the PERFORMED side.** The v2 layout
   carries `prescribed_load` per slot and this law deliberately does not read
   it, so a performed entry is still `earned/performed-lift/v1`. That is the
   candidate's question and :522 did not ask for it. What the owner needs -
   his `BW` lift PRESCRIBING and its card OPENING - is done.
4. **What he types for a `BW` set.** The card's `entry.load` is `null` for a
   configuration lift, because `Number.isFinite` is false for it
   (`gym-model.mjs` `activeView`). The card opens and prescribes; whether the
   entry box should pre-fill, stay empty or read the key is a lane C design
   question this ticket did not touch and did not need to.
5. The identity trade of :521 is unchanged by this ticket and still carried.
