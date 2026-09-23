# N3-MACROS-DATA specification

Evidence base: d19d38fb0a03004d5c2c5ec4d0b07c84cf3b84e2 on rebuild/c-n3-macros-spec.
Author: Astra, named specification assignment under rebuild/DECISIONS.md:412 and :569(3).
Revision R2 (Claude builder, 2026-09-23) answers review REVIEW-N3-SPEC-l1.md (round 1,
ACCEPT WITH NAMED DEBTS). Each changed clause cites its finding as [R2 Dn/Fn]; every clause
without such a tag is carried over unchanged from d3b9cbf2.
This document specifies future work. No product or sealed file was changed.
References below use these exact path prefixes: T = rebuild/m3/w7-preview/today/;
W = rebuild/m3/w6/; I = rebuild/m4/import/; M = rebuild/m3/w7-preview/measure/;
S8 = rebuild/m4/spec/acceptance-s8-real-shape.json. A reference such as
T/food-model.cjs:37 means rebuild/m3/w7-preview/today/food-model.cjs:37.
All example quantities and dates in this document are made up, not anyone's measurements.

## 1. Owner's words

rebuild/DECISIONS.md:471, owner quotation, verbatim as stored (including escaped quotes):

> Add optional fat and carb fields to the food entry, in my month one. Rules: calories and protein stay required; fat and carbs are optional, behind a \"track macros\" setting that's on for me and off by default for others; skipping them is never a miss, never prompted, never penalized; the engine uses them only when present and infers nothing when absent. First uses: a dietary fat floor warning on a cut, and macros on the weekly recap. Route it as you see fit and tell me where it lands in the queue.

rebuild/DECISIONS.md:561, points (6) and (7), verbatim, including the PM's recorded questions and interpretation of the owner's answers:

> (6) asked: the research file carries no dietary fat minimum, so (A) no warning and the fat he entered simply shown, or (B) a warning at a number the product picks and labels as its own choice; "A": SCIENCE-OWNER-CHOICE 4 is CLOSED, NO FAT FLOOR AND NO FAT WARNING; the app invents no number its corpus does not carry, and N3-MACROS-ENGINE's fat-floor half is withdrawn. (7) asked: no weekly recap exists, so (A) macros on the nutrition screen now and the recap later as its own job, or (B) both together later; "A".

The same line names the ticket, verbatim excerpt:

> N3-MACROS-DATA is specified on answers (6) and (7) as a data and display item with no engine byte, dispatched when a lane returns;

Thus :561 supersedes :471's proposed fat warning and recap timing. This job adds no floor,
warning, target, coaching inference, or recap. :471's PM routing supplies the per-device,
default OFF, one-tap interpretation; "on for me" means Joe taps his own device, never an identity check.

## 2. Ground as measured

### Entry and validation

- Exactly two current entry inputs: cal and pro, T/screens.template.html:132-137.
  Both use type number, inputmode numeric, minimum 0 and step 1; neither has required.
  Submission constructs only those two keys, T/today-app.cjs:1278-1286.
- The producer's MEMBERS is exactly ["cal", "pro"], T/food-commands.cjs:33-35.
  Calories accept integer 0 through 20000; protein accepts integer 0 through 1000 grams.
  These are application input bounds, explicitly called invented at :30-32, not nutritional recommendations.
  dayOf rejects unknown keys, nonnumbers, nonfinite numbers, fractions and out-of-range values
  at :43-57. It accepts either member alone; it rejects an empty object.
- The view trims text, requires digits only, finite integer and the corresponding bounds,
  T/food-model.cjs:37-48. Undefined and empty string are absent; whitespace-only is invalid.
  dayFromEntry copies only MEMBERS, converts their supplied text to numbers and omits blanks,
  :53-60. Consequently adding fat/carbs to an entry object alone silently drops them here.
- OPEN, owner question Q4 (section 11) [R2 D1/F1]. :471 says "calories and protein stay
  required". Today a calories-only or protein-only day is ACCEPTED (review witness:
  refusalFor({cal:'1500',pro:''}) = null), PROMISED in copy ("Either figure on its own is
  enough.", T/today-app.cjs:110 and T/design.cjs:205; "Enter calories, protein, or both.",
  T/design.cjs:210), PINNED by a sealed cell (T/test/food.test.mjs:204-209, "N1.3 - at least
  one of cal or pro is required"; see also :273-291) and COUNTED by adherence
  (M/measure-sources.mjs:167). "Stay" can mean "remain required" or "remain the two primary
  figures"; no DECISIONS line rules the either-alone copy, and :595 parked the new-save rule
  as N3-B. This specification therefore does NOT decide it. DEFAULT UNTIL JOE ANSWERS: today's
  behaviour stands, either figure alone is a valid new day, and macros alone never form a day.
  Every clause below that depends on the answer is marked "IF Q4 = NO". Whatever the answer,
  historical partial days stay readable and importable and keep their adherence credit.

### Writer, record, reload and engine

- Phone path: T/today-app.cjs:1278-1293 recordIntake -> foodLane.save ->
  foodEntryFor/host.save at :569-586. openFoodLane imports food-host and opens it with
  the device's indexedDB and crypto at :593-605.
- T/food-host.mjs:85-89 binds createFoodCommands to the existing local era and durable public
  client; :104-114 executes workout with {action:"food-day",input:{day:dayValues}}.
  T/food-commands.cjs:61-75 constructs class food-day, kind fact, payload
  {profile:"earned/food-day/v1",day:{cal,pro}}, parents [], and optional effective date/time/offset.
  validate rechecks payload and day at :81-91. The local schema version is 2 (:95-98).
- An extra macro key handed directly to host.save is rejected by dayOf, not stored and
  then lost. Source: T/food-commands.cjs:45; T/food-host.mjs:108-114.
  Accepted generations serialize all JSON data, with no food-field whitelist, in
  W/repository.mjs:22-35, :78; reload parses the generation at :192.
  T/food-host.mjs:53-73 filters eligible food ops and JSON-clones the WHOLE payload.day;
  all/restart at :97/:116 reread/reopen it. Extra valid JSON fields already in an op
  survive this reader. Actual durable macro save/reopen is UNMEASURED; current producer refuses it.
- Engine path: T/today-model.cjs:227-236 invokes FoodModel.foodProjection;
  T/food-model.cjs:65-72 chooses the last row per date, then :87-97 copies MEMBERS and
  calls engine.writeDaily. T/today-engine.cjs:22-35 installs rebuild/engine/writers.cjs.
  writeDaily at rebuild/engine/writers.cjs:2822-2853 recognizes exactly five incoming keys:
  cal, pro, steps, sodium, alc (:2835-2839). It ignores incoming fat and carbs.
  Its spread of the previous row (:2833-2834) preserves unknown fields already there;
  that is NOT a route for adding new macros. Protein can affect fixWindow (:2841-2850).
- Today readback uses projected cal/pro from T/food-model.cjs:115-121 through
  T/today-model.cjs:436. Its separate recordedFood reader returns the winning operation
  at :439 and T/food-model.cjs:107-109. T/today-app.cjs:1346-1355 renders only cal/pro.
  Therefore extending MEMBERS indiscriminately would still lose macros at the engine writer.

### Import and export boundaries

- Import of a legacy sealed bundle is not import of a food operation: payload.migrated.state
  is serialized and hash-checked at W/local/import-bundle.mjs:321-323; the current generation
  is cloned at :572 and its derived value may be seeded at :582. No day-field selector is
  present at those sites. Preparation invokes migration/optional merge at I/replay-core.cjs:39-70.
  Survival of arbitrary extra legacy dailyLogs fields through migration is UNMEASURED.
- Import admission revalidates native schema-2 food ops through Food.validate and copies the
  whole day (W/local/source-admission.mjs:508). An unsupported macro key currently fails
  this branch and becomes LOCAL_SOURCE_DAILY_UNRESOLVED (:526). Winners then replay through
  the same FoodModel/engine path (:547-551); overlapping legacy cal/pro still refuses (:548).
  Extending the shared validator removes the new-key rejection without an engine edit;
  preserving raw ops is distinct from projecting cal/pro into dailyLogs.
- VERSION SKEW, a fact and an owner-visible limit [R2 D4/F4; DECISIONS:609 (2)]. After N3-B
  ships, an OLDER binary (one built before its reader knows fat and carbs) meets new facts in
  two ways. (a) Old import: one macro-bearing food day in a source fails Food.validate at
  W/local/source-admission.mjs:508 and answers LOCAL_SOURCE_DAILY_UNRESOLVED at :526, and the
  WHOLE import refuses, the ordinary days beside it included. (b) Old correction: an older page
  that corrects such a day writes a new winning op without fat and carbs, so the day's winning
  record no longer shows them; the earlier op still holds them, so nothing is destroyed, but
  the older page will not bring them back. The old PAGE itself only shows calories and protein
  and ignores the rest. No writer can mint such a day before N3-B, so nothing is exposed today;
  this is why every reader must know the new members before any writer ships (:609). The
  owner-visible limit, stated in plain words for the PM to tell Joe: "Once you record fat or
  carbs, open and import that data only with the updated Earned. An older copy of the app
  refuses the whole import, and correcting that day in an older copy hides the fat and carbs
  you entered." This is a statement of limit for the owner, not proposed athlete copy.
- The inspected on-screen export is a measurement comparison text table,
  M/measure-view.mjs:86-113, exposed by M/measure-screen.mjs:190-191. It is not a food-record
  backup and contains no macro round-trip interface. No food-operation export/import carrier
  exists in the inspected surfaces: the review's git grep for exportBundle, downloadBackup,
  backup and .download= over W, T and I product code at d3b9cbf finds no code hit (two markdown
  mentions only) [R2 D2/F2]. Do not report JSON.stringify/parse alone as an export/import test.
  An engine-state-only export cannot carry macros that never entered dailyLogs.

### Settings, nutrition and adherence

- The built settings surface is machine-specific, inside the gym card:
  T/screens.template.html:386-402. T/gym-app.mjs:142-169 opens a settings lane and reads
  latest(liftId). T/machine-settings-host.mjs:72-97 reads the same encrypted generation and
  writes a machine-settings command. rebuild/coach/machine-settings-commands.cjs:49-83
  accepts exercise_id, settings and cues; :133-163 filters/clones facts and selects the latest
  by exercise. This is not a global per-device Boolean preference.
- No default-OFF app preference pattern was found in those measured modules or the scoped
  source search of Today, W/local and rebuild/coach for localStorage, enabled/default false,
  preference and track macros. Whole-repository absence is UNMEASURED. Do not describe the
  proposed preference store below as existing. No auth or private store was inspected.
  (N3-A has since added T/device-preferences.mjs on rebuild/c-n3-macros-data at 7f81f209,
  imported by nothing; it is not on this branch.) [R2 D3/F3 context]
- Nutrition's existing data-slot="macros" is aria-label="Daily targets"
  (T/screens.template.html:117). It shows Energy and Protein targets from
  E.calorieTarget/E.proteinTarget (T/today-model.cjs:128-136), plus Carbohydrate and Fat
  as "Not prescribed" (T/today-app.cjs:1124-1158). Its entry has the separate
  food-recorded paragraph at T/screens.template.html:140. Readback/unknown/refusal branches
  are T/today-app.cjs:1226-1268; they distinguish an acknowledged write from a failed read.
- Logging adherence already counts a day with cal OR pro, never fat/carbs:
  M/measure-sources.mjs:135-170, with trial logging counted from raw food rows (:157-170).
  M/measure-model.mjs:213-230 computes foodAdherencePct from that count.
  Older partial days must keep this credit. New saves with cal+pro and no macros get full credit.
  Under the Q4 default, new cal-only or pro-only saves keep today's credit too [R2 D1/F1].

### Existing cells and executed probes

- Counted 57 top-level test declarations using ^test\( in T/test/food.test.mjs.
  Source coverage: producer/validation :173-306; projection :309-375; durable saves/reopen
  :381-519; UI/refusals/corrections :526-703; copy/layout/build :706-902;
  body-composition refusal and provenance :914-1072; readback failure/unknown :1104-1191.
  These are source observations, not a claim that the suite ran in this assignment.
- T/food-check.mjs drives two input IDs at :135, asserts exactly two boxes at :171,
  font/tap size at :173-174, reload at :231-233, process kill at :236-240, and a
  calories-only correction at :254. These expectations need deliberate updates, not removal.
- Executed one short Node process through the exact supplied node.exe, no durable store:
  eight named synthetic witnesses passed: producer rejects extra macros; view drops extras;
  producer accepts cal alone; accepts pro alone; protein accepts both integer endpoints;
  protein rejects a fraction; real writeDaily ignores incoming macros; real writeDaily
  preserves preexisting extra keys. Inputs were made up: cal 1234, pro 88, fat 37, carbs 149,
  fraction 1.5; clock 2099-01-10, earlier day 2099-01-01. Endpoints 0/1000 come from LIMITS.
  The writer was obtained through createTodayEngine, not replaced by a mock.

## 3. Data shape

Proposed wire keys: optional fat and carbs, numeric grams, inside the existing payload.day.
Keep profile earned/food-day/v1 and schema 2; compatible extension is the recommendation,
not evidence that older binaries accept it: they reject unknown keys (T/food-commands.cjs:45),
with the whole-import refusal and old-correction consequences recorded under VERSION SKEW in
section 2 [R2 D4/F4]. Do not rewrite historical ops, commitments or timestamps.
No new engine member or migration.

For supplied macros, use protein's existing domain: finite integer 0..1000 inclusive,
not a nutritional floor or ceiling. Mirror its trimmed digit-only input parsing.
Blank/undefined omits the key; null, whitespace-only, nonnumeric, negative, fractional,
nonfinite and out-of-range input refuses before writing, with no clamp or approximation.
Here blank/undefined describes the input adapter; a producer payload must OMIT the key,
not include an own property with undefined (the existing distinction is pinned at
T/test/food.test.mjs:211-217). Stored macro values are always numbers when present.
Explicit numeric zero is a present value and displays as zero; absent never becomes zero.
Either optional field may be supplied independently. Do not calculate one from calories,
protein, the other macro, a previous day or a target. Do not enforce energy arithmetic.

Keep entry fields and engine projection fields separate: entry/producer admits cal, pro,
fat, carbs; foodProjection continues passing only cal/pro to writeDaily. Read macro values
from recordedFood(today).day, not loggedFood. Existing cal/pro behavior stays on its current
projection path. A historical record without either macro yields missing keys and no macro
text. Macros alone cannot form a day. The new-save rule for calories and protein is OPEN
(Q4) [R2 D1/F1]: DEFAULT (today's rule, kept until Joe answers): a new save needs at least
one of cal or pro, exactly as T/food-commands.cjs:43-57 and the sealed cell
T/test/food.test.mjs:204-209 require now. IF Q4 = NO: new prepare/save and entry validation
require BOTH cal and pro, while stored-op reads and import admission keep accepting
historical cal-only/pro-only days; that change rewrites a sealed pinned cell and rides N3-B.

Constraint on any future exporter [R2 D2/F2]: no food-record backup carrier exists (section 2),
so this ticket builds none and claims no round trip. Whenever an export/import carrier for
food operations is specified by its own ticket, it must retain each raw food operation's
optional keys and numbers exactly; import must restore them without zero filling, inference,
rounding, or losing absent/present status; it must carry raw operations, not only the engine
projection; and it must exclude the device preference (never enabling another device on
import). That ticket owns its round-trip witness; N3 acceptance does not wait on it.
Do not invent a new backup UI or label the measurement summary export as a backup.

Correction behavior needing owner ruling is Q1: recommend that blank optional boxes KEEP
already-recorded macros, while supplied values replace their own field. With OFF, always keep
previous macros when calories/protein are corrected; a hidden control cannot erase a fact.
Resolve the prior day inside the writer's save operation from the latest durable record,
not a stale painted value. Plainly [R2 F6, S178]: this merge COPIES the prior macros INTO
THE NEW OP, so a correction op's day is no longer only what he typed that time; it is what
he typed plus the macros carried forward from the prior winning record. Readers and tests
must treat the carried values as part of the new op, not as a pointer to the old one.
Do not promise concurrent-tab correctness without a race witness.
No field deletion gesture is authorized by this ticket; Q1 can commission explicit clearing.

## 4. Setting

Track macros: per device/browser installation, default OFF, one tap to toggle; no account,
name, identity or Joe-specific branch. No confirm dialog or prompt to enable it.
The control [R2 F6, S184]: one native checkbox, input type="checkbox" with a visible label
element whose text is the approved setting string ("Track macros" as proposed), so its
accessible role is checkbox and its accessible name is exactly that label text; checked means
ON; one tap (click or Space) flips it. Not a button, not a switch widget with a custom role,
and no extra aria-label that would diverge from the visible text.
OFF displays no macro inputs or recorded macro values. Turning OFF keeps recorded values;
it changes visibility only, including later cal/pro corrections (Q1 confirms the correction detail).
Turning ON reveals only values actually recorded for the selected day.

Technical recommendation: a new T/device-preferences.mjs owns an IndexedDB database
named earned-device-preferences, store preferences, key trackMacros, Boolean value.
Missing key means OFF. Keep it outside athlete operations/imported data; never reuse a
machine exercise_id as a preference key. This is a proposed store, not an existing facility.
Resolve a tap after transaction completion; reopening reads that key. On read/write failure,
keep macro controls hidden or the prior acknowledged state and show the exact failure copy
in section 7; do not claim the setting saved. Storage error never prevents cal/pro logging.
After the split, acquire/read/write this module only from the sealed lane and expose detached
Boolean state plus a gesture callback to the view. Include it in the reseal product inventory.

Placement is Q2: recommend a device-settings row immediately before Today's intake on the
nutrition screen. The measured machine settings are per-lift, not an app settings page
(T/screens.template.html:386-402). Do not silently put this preference inside a lift's notes.

## 5. Display

Recommendation for owner ruling (Q2/Q3): within the nutrition entry, add a neutral small
paragraph immediately after the existing data-slot="food-recorded" paragraph and before
food-retry (T/screens.template.html:140-145). It sits beside the recorded calories/protein,
not inside the Daily targets element at :117. Show fat and/or carbs only if that same day's
winning durable record has the corresponding key and Track macros is ON.

Use "Fat: {value} g" and "Carbs: {value} g", normal text with the existing small muted
style, no grade color, badge, progress ring, deficit comparison, target, threshold or warning.
Absence produces no placeholder, missing message, zero, inferred total or reminder.
No macro figure goes on Today, into adherence copy, or into a weekly recap in this ticket.
Leave the target area's "Not prescribed" semantics intact; macro intake is not a prescription.
On acknowledged-save/readback failure, display only acknowledged submitted/retained values
with the existing uncertainty disclosure; an unknown write is never presented as recorded.
Body-composition target availability must not hide a durable macro fact.

## 6. What must not change

- Cal+pro with no fat or carbs saves once without any optional-field prompt and is complete.
- That day counts fully toward food logging adherence and MEASUREMENT-PLAN food days;
  comparison with the identical day carrying macros yields the same count and percentage.
- Historical partial food days remain readable/importable and retain existing adherence credit.
- New saves follow the Q4 rule: by DEFAULT at least one of cal or pro, as today; IF Q4 = NO,
  both [R2 D1/F1]. Invalid optional data refuses atomically; omitted data never does.
- No reader or writer infers absent macros, zero fills them or computes nutritional advice from them.
- OFF never mutates a food record; a later save cannot erase macros merely because OFF hid them.
- Existing save refusal, unknown outcome, acknowledged/readback-failure and retry semantics remain.
- No engine file changes. From the implementation branch, run
  `git diff --numstat <implementation-base> HEAD -- rebuild/engine/` and
  `git diff --numstat HEAD -- rebuild/engine/`; both must print no rows. Include staged/untracked
  path inspection too. This spec's own check used d19d38fb and goes stale at the first rebase
  [R2 F6, S232-233]: the N3-B builder substitutes the actual merge-base of its branch at the
  moment it runs the check (git merge-base HEAD <chain tip>), never d19d38fb and never an
  assumed split base, and reports the base hash it used.

## 7. Every proposed new athlete-facing string, for owner ruling

These strings are proposals, not approved copy. Existing generic store/readback copy is reused.
Braced values are actual recorded numbers, not fixed examples. No dashes in any string.

| Context | Exact proposed text |
| --- | --- |
| Setting | Track macros |
| Setting checked state, if shown as text | On |
| Setting unchecked state, if shown as text | Off |
| Setting help | Only on this device. |
| Entry lead replacing the either-figure sentence, ONLY IF Q4 = NO [R2 D1/F1] | Enter the calories and protein you ate today. |
| Fat input label and accessible name | Fat in grams, optional |
| Carbs input label and accessible name | Carbs in grams, optional |
| Required fields refusal, ONLY IF Q4 = NO [R2 D1/F1] | Enter calories and protein. Nothing was recorded. |
| Fat format refusal | Enter fat as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded. |
| Carbs format refusal | Enter carbs as a whole number of grams from 0 to 1000, or leave it blank. Nothing was recorded. |
| Recorded fat | Fat: {value} g |
| Recorded carbs | Carbs: {value} g |
| Preference read failure | This device could not read your Track macros setting. Open Earned again to try again. |
| Preference write failure | This device could not save your Track macros setting. Tap it again to try again. |
| Correction help replacing the whole-day replacement claim, if Q1 accepts keeping blanks | Recording again replaces calories and protein. Fat and carbs change only when you enter them. |

Strings that RETIRE [R2 D5/F5], all in the food copy array of T/design.cjs, each retiring only
under the ruling named:

| Existing string, T/design.cjs line | Retires when | Replaced by |
| --- | --- | --- |
| :205 "Enter what you actually ate today. Either figure on its own is enough." (also T/today-app.cjs:110) | IF Q4 = NO | Entry lead row above |
| :209 "Recording it again replaces today's figures." | IF Q1 = A (keep blanks) | Correction help row above |
| :210 "Enter calories, protein, or both. Nothing was recorded." | IF Q4 = NO | Required fields refusal row above |

Under the Q4 DEFAULT (either figure alone stays valid), :205 and :210 stay true and stay in
place, and the two Q4 rows above are NOT added. Exact copy census delta of the athlete-facing
food strings, counting each string once:

| Rulings | Added | Retired | Net |
| --- | --- | --- | --- |
| Always, under any answer (setting, help, two labels, two format refusals, two recorded lines, two preference failures) | 10 | 0 | +10 |
| On/Off text states shown (not with the recommended native checkbox, section 4) | +2 | 0 | +2 |
| Q4 = NO | +2 | -2 (:205, :210) | 0 |
| Q1 = A | +1 | -1 (:209) | 0 |
| DEFAULT build: Q4 default, Q1 = A, native checkbox | 11 | 1 | +10 |
| Largest: Q4 = NO, Q1 = A, On/Off shown (the whole table above) | 15 | 3 | +12 |

The copy-inventory row in section 9 asserts the delta for the rulings actually given; the
build states which line of this table it implements. Q1 = B needs its own clear-action words,
which return to the owner.

No optional-field completion warning, success grade, tracking invitation, fat-floor sentence,
macro target, tooltip or extra screen-reader sentence is authorized implicitly. Any additional
athlete copy returns to the owner. Add approved strings to the appropriate copy array in
T/design.cjs (current food declarations :204-226) and bind them through existing render guards.

## 8. File by file change list

Measured exact-key membership against S8.product (224 keys) and S8.executionPins (71 keys).
Counts are property counts, not distinct union count. FREE means absent from BOTH maps at
this base, not exemption from other guards. P = product; E = executionPins. S8 section starts
are :200 and :1600. This list describes implementation scope; only this spec is written now.

| Path | S8 status / pin citation | Work and split side |
| --- | --- | --- |
| rebuild/lanes/c/N3-MACROS-DATA-SPEC.md | FREE | This document only; not Today |
| T/food-commands.cjs | FREE | Writer side: optional keys, shared bounds; separate new-entry vs historic acceptance only IF Q4 = NO |
| T/food-model.cjs | FREE | Writer/projection side: validation, omission, fixed cal/pro engine projection |
| T/today-app.cjs | SEALED P S8:786 | View: inputs, toggle, copy, macro readback; writer: recordIntake and preference acquisition until split |
| T/today-lanes.cjs (new in split) | FREE against S8; planned SEALED in split | Writer: submission, retained macro merge, preference host, readback state and hooks |
| T/device-preferences.mjs (proposed new; exists on rebuild/c-n3-macros-data at 7f81f209) | FREE | Writer side; new device Boolean store; explicitly seal with implementation |
| T/screens.template.html | FREE | View side: toggle, optional fields and separate intake paragraph |
| T/design.cjs | FREE | View/copy side: approved new strings and the retirements of section 7 |
| T/build.mjs | SEALED P S8:686 | Build plumbing: required preference module; update measured input census |
| T/test/food-macros.test.mjs (exists at 7f81f209, 9 top-level test( declarations) | FREE; no CI home | INTERIM home of the N3 Node rows, NOT counted by CI [R2 D3/F3] |
| T/test/food.test.mjs | SEALED P+E S8:746,:1609 | FINAL home, in the reseal child only: rows moved or imported here; rule-reversal edits only IF Q4 = NO [R2 D3/F3] |
| T/test/package.test.cjs | SEALED P+E S8:766,:1613 | Build/input-count expectation if the required module changes its census |
| T/food-check.mjs | FREE | View/browser proof: OFF/ON inputs, new correction rules, reload and sizes |

T prefixes expand exactly as defined above. Membership of every row was compared against both maps;
new paths are absent, not implicitly released. (R2 re-check: git grep for food-macros and
device-preferences over S8 and .github/workflows/rebuild.yml at d3b9cbf finds no hit.)
No T/food-host.mjs edit planned: its generic day
pass-through already suffices (:104-114); it is nevertheless SEALED P at S8:691.
No T/today-model.cjs edit planned: recordedFood already exposes the raw row (:439), and it is FREE.
No adherence implementation edit planned (M/measure-sources.mjs:157-170).
No I/daily-history.cjs edit planned: that separate schema-1 reader is not the schema-2 page route
(I/daily-history.cjs:8-18,:41; W/local/source-admission.mjs:508).
No W/local/source-admission.mjs edit planned: it imports the shared validators (:5-6,:508).
It is SEALED P at S8:521; if an import witness requires a hunk there, declare it in the child.
Row homes [R2 D3/F3]: N3-A already landed its rows in the FREE file T/test/food-macros.test.mjs
on its lane branch (DECISIONS:595, :609). Until the reseal child, the N3 Node rows live there,
run by hand one Node process at a time, and are NOT counted by CI: no workflow step names that
file, and the workflow is SEALED P, S8:201, so no new CI home can be added outside a reseal
(:582 precedent). The reseal child either moves the rows into T/test/food.test.mjs (which has CI
at .github/workflows/rebuild.yml:232) or imports the file from it; if a workflow edit is chosen
instead, that edit is declared in the child as a SEALED hunk. Nothing about N3 is claimed green
by CI before that child.
No exporter hunk is on this list [R2 D2/F2]; see the constraint in section 3.

Split evidence is pinned to observed branch rebuild/c-today-split-build at
 aabe74e8f2a6f4adbb3828cf15ea2b25b91e15cf (read only, not landed on this worktree).
At that ref, rebuild/lanes/c/TODAY-SPLIT-SPEC.md:445-455 releases today-app and seals
new today-lanes. rebuild/lanes/c/today-split-spike/regions.json:388-423 moves
foodEntryFor/openFoodLane; :496-513 moves recordIntake. Thus input drawing/copy/readback
presentation stays view side; collecting a save payload, retaining old macro fields and
writing the preference are writer side. DECISIONS:574/:588 describe the live split work.
Future exact writer line numbers, final hooks and youngest seal membership are UNMEASURED;
rebase and remeasure before building, without editing the split spec or its frozen table.

## 9. Test rows, red first

Proposed rows, not executed acceptance results. Row homes [R2 D3/F3]: every Node row marked
F-M below lives in T/test/food-macros.test.mjs until the reseal child (interim, uncounted by
CI), and the reseal child moves or imports it into T/test/food.test.mjs (final, CI at
.github/workflows/rebuild.yml:232). Existing sealed assertions for the either-alone rule
(T/test/food.test.mjs:204-209, :273-291) are replaced ONLY IF Q4 = NO, in the reseal child;
under the Q4 default they stay exactly as they are [R2 D1/F1].
Capture each new requirement's red on the implementation base, then green; invariant controls
may already be green and must be reported as controls, never fabricated red-first evidence.

| Name | Assertion / expected baseline evidence | File |
| --- | --- | --- |
| N3 required entry, legacy partial | Q4 DEFAULT: new cal-only and pro-only saves still accept (control, green today), macros-only saves refuse, historical partial ops read/import. IF Q4 = NO: new cal-only/pro-only/macros-only saves refuse (red today) and historical cal-only/pro-only ops still read/import [R2 D1/F1] | F-M |
| N3 optional omission is complete | Cal+pro and blanks produce exactly absent fat/carbs, one acknowledged op, no prompt; UI acceptance control plus new fields | F-M |
| N3 gram domain | Each macro independently accepts integer endpoints; rejects fraction, negative, excess, null, NaN, Infinity and whitespace; no write on refusal | F-M |
| N3 durable raw macros | Real food host saves made-up fields, closes/reopens, equal raw day and presence flags; explicit zero survives; currently producer refuses | F-M |
| N3 correction retains hidden facts | ON save, OFF, correct cal/pro, reopen, ON restores exact prior macros and the NEW op's own day carries them [R2 F6]; repeat with newer concurrent record; currently no toggle | F-M |
| N3 preference isolation | Missing key OFF; one tap persists across reopen; separate database/device stays OFF; no identity branch; import cannot enable it: a native import source whose ops or bundle carry a trackMacros key (at any depth) is admitted or refused on its food facts alone, the key is ignored, and the earned-device-preferences store afterward holds exactly the keys and values it held before (import never opens it for write) [R2 F6, S324] | F-M |
| N3 preference failures | Failed read/write never claims saved, does not erase food and does not prevent a cal/pro save | F-M |
| N3 raw display only | Each optional key alone, both, neither, explicit zero and another date; only present current-day values beside food-recorded, OFF hides all | F-M |
| N3 no advice or grade | No macro target/warning/grade class or prompt; engine arguments and entire projected state equal the macro-free control | F-M |
| N3 adverse save outcomes | Refused/unknown/acknowledged-but-unread save states retain accurate copy and values; retry makes no extra operation | F-M |
| N3 adherence equivalence | Same dates with/without macros give equal food count and percentage; use actual measure readers, including older partial days | F-M |
| N3 native import retention | Actual source admission with valid macro ops accepts and retains raw fields; historical partial validates; unchanged overlap refusal remains | F-M |
| N3 copy inventory | Every string from section 7 for the rulings given is declared/rendered, every retiring string for those rulings is gone, and the food string count moves by that line of section 7's census table [R2 D5/F5]; no en/em dash, missing-value message or extra advice | F-M |
| N3 required module census | Build graph contains preference module; counted required inputs agree with package guard | T/test/package.test.cjs (reseal child) |
| N3 narrow phone controls | OFF has two numeric entry inputs; ON has four; the Track macros checkbox is present in both states; reload and process restart retain setting and values; 320/390 widths, 16px inputs, 44px targets | T/food-check.mjs |

F-M = T/test/food-macros.test.mjs (interim), then T/test/food.test.mjs in the reseal child.
Row count: 15. The round-1 row "N3 full backup round trip" is DROPPED [R2 D2/F2]: no carrier
exists, so no N3 builder could meet it; its requirement survives only as the constraint on any
future exporter in section 3, owned by that exporter's ticket.

Do not run the whole Today step on the shared PC. Run one Node process at a time; reserve
browser kill/viewport checks for an approved isolated test browser, never the protected soak.
The new rows above have NOT been run. Only section 2's eight small synthetic probes ran here.

## 10. Reseal recommendation

Recommend a named N3-MACROS-DATA reseal child after S10/TODAY-SPLIT; PM assigns its number, UNMEASURED here.
It changes the sealed submission writer and pinned food/build tests even after today-app is released.
It is also the only place the N3 rows gain a CI home, by moving or importing
T/test/food-macros.test.mjs into T/test/food.test.mjs (section 8) [R2 D3/F3].
Do not land alone: apply DECISIONS:582's diff-name versus youngest product/executionPins check before merge-forward.

## 11. Questions only the owner can answer

1. When correcting a day, should empty optional boxes keep its earlier macros? A (recommended): keep them; clearing can be a later explicit action. B: add an explicit clear action in this ticket. Turning the setting OFF itself keeps all recorded data in either option.
2. Where should Track macros live? A (recommended): a device setting on the nutrition screen just before Today's intake. B: beside the machine settings in the workout screen. In either case, recorded macros sit immediately after the food-recorded line as proposed in section 5.
3. Are section 7's words and neutral recorded-value line right? A (recommended): approve them, with correction help only if Q1 chooses A. B: give replacement words or a different nutrition-screen position. No fat warning or target is reopened.
4. May a calories-only or protein-only day still be recorded, as the app promises today? [R2 D1/F1] YES: nothing changes; either figure alone stays a complete day, as it is now. NO: from the update on, a new day needs both calories and protein; days already recorded with one figure stay as they are and keep their credit. No recommendation is made; until he answers, the app keeps doing what it does today (YES).

Technical proof gaps below are for the builder/PM, not questions Joe must solve.

## 12. Unmeasured

- Food-record export/import carrier: none exists (section 2); this ticket builds none and
  claims no round trip. The requirement is a constraint on any future exporter (section 3) [R2 D2/F2].
- Durable macro saves, preference durability/failure/races, new UI and red-first rows: not built
  by this paper (N3-A's data half exists on its lane branch at 7f81f209, uncounted by CI).
- Phone layout, accessibility and process-kill proof: not run. Old-client behaviour is no longer
  unmeasured in outline: the whole-import refusal and old-correction drop are recorded under
  VERSION SKEW (section 2, from DECISIONS:609); a downgrade witness on a real older build is not run [R2 D4/F4].
- Arbitrary macro-bearing legacy dailyLogs through migration/merge: not established; no private input used.
- Whole-repository preference absence, final split hooks/line numbers and post-S10 seal inventory: not claimed.
- Research corpus fat numbers were not inspected; the no-floor rule comes directly from :561.
- No full suite or browser check ran. No commit, push, install, product edit or sealed-file edit occurred.
- Verification at R2: ASCII byte scan of this file, both source quotations compared with
  DECISIONS:471 and :561 at d3b9cbf, and `git diff --numstat d19d38fb HEAD -- rebuild/engine/`
  (no rows); results are in N3-SPEC-R2-REPORT.md beside this file.

Workspace at R2: this file is modified and uncommitted; N3-SPEC-R2-REPORT.md is untracked beside it.
