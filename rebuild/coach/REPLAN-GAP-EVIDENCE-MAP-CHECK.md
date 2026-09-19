# RE-PLAN GAP EVIDENCE MAP: THE CLAUDE CHECK (told to disagree)

Checker: cowork (Earned lane hand, Claude), 2026-09-19. Reviewing
`rebuild/coach/REPLAN-GAP-EVIDENCE-MAP.md` (Astra, UNREVIEWED) at 1dc17c3d on
branch `rebuild/c-replan-evidence`, 219 lines. Read in the cloud farm at the same
commit and at the chain tip 05466ebb; executed in a farm scratch worktree at
1dc17c3d; the two root corpus files were read on the owner's PC because they are
outside the farm's include list. No engine byte moved. This file is the only file
this job writes.

## PLAIN WORDS

1. The map is honest and unusually accurate: I checked 68 of its file-and-line
   claims and 66 were true as written; none was invented.
2. It is right about the one thing that matters: nothing in the plan reads the
   check-in's pain, time-away or soreness answers. I proved that by running it.
3. Worse than "ignores": after a 300 day hole in the record the app still says
   "You are gaining here, keep chasing" and asks for the same reps.
4. The check-in takes "I was away" and "my knee hurts". It does NOT take "the
   machine was taken": there is no equipment field anywhere on it.
5. Easing already works when HE picks the lighter weight: he logs 35 where the
   plan said 40, the app says so, and tomorrow's target comes off what he did.
6. Skipping already works in the engine too. What is missing is a button on the
   phone, not a rule and not a number.
7. The catalogue can already name same-bucket lifts (83 lifts, 16 buckets). It
   carries no ranking and no equivalence, and it must not pretend to.
8. Six questions for Joe are at the end. Any engine byte still needs his word.

## VERDICT ON THE MAP

**FIT WITH CORRECTIONS.** The corrections are additions and two cite fixes, not
retractions. Nothing in the map is medical advice.

### C1. The map never names the functions behind the owner's own equipment premise

DECISIONS:578 records the owner's words: "the catalogue can already name a lift
in the same bucket". The catalogue's `bucketOf` (`P/exercise-catalogue.mjs:225`),
`entriesInBucket` (`:321`) and `searchByName` (`:235`) are exactly that, and the
map cites none of the three. MEASURED (EX9): 83 entries, 16 buckets,
`entriesInBucket('chest','U')` returns 11 lifts, `entriesInBucket('quads','L')`
returns 8; no entry carries a load, a set count, a rank, a score or an
equivalence to another lift. The map's caution survives intact, and the owner's
premise is confirmed rather than left as a belief. One consequence he should
know: the Edit My Week spec's closed import list for the field editor
(`EW2:2538`) names `CATALOGUE`, `searchByName` and `regionsOf` but NOT
`entriesInBucket`, so "offer me the lifts in the same bucket" is a small new
wiring, not something already drawn.

### C2. Two corpus lines the map leaves out, one on each side of EQUIPMENT

`RESEARCH-DESIGN.md:696-697` puts "exercise rotation" on the list of things with
"No evidence supports autonomous manipulation at a signal that moves ~2% per
quarter. Hold fixed and say so." That is the strongest line in the whole corpus
against an APP-CHOSEN substitution, and the map does not use it.
`RESEARCH-DESIGN.md:622` rules machines versus free weights "leave alone", and
`research-brief.md:403` says in the brief's own words "The machine-heavy
programme costs nothing". That is the only corpus support for an
ATHLETE-CHOSEN machine-to-free-weight swap being cheap, and the map does not use
it either. Both belong in EQUIPMENT section 1. Note the asymmetry the corpus
actually draws: equipment CLASS barely matters (Haugen, SMD -0.055,
`research-brief.md:401-403`), while EXERCISE CHOICE inside one muscle matters a
lot (standing versus seated calf d = 0.88-1.58, `research-brief.md:135-146`).
So a bench-for-machine-press swap is cheap; a seated-for-lying ham curl swap is
not. That distinction is the useful product rule and the map states only half of
it.

### C3. EQUIPMENT section 4 bullet 1 reads as a same-day answer and is not one

"Offer athlete-chosen replacement from the catalogue through the manual edit
design" is filed under behaviours that need no new number. By the map's own
section 3 the manual replacement is a FUTURE programme edit that starts TOMORROW
(`EW2:468-470`, verified), and the new lift starts with no recorded load
(`W/plan-edit-model.cjs:347`, verified by execution, below). The taken machine is
a TODAY problem. The only same-day equipment answer anywhere in the tree is the
set-skip command with reason "Equipment unavailable"
(`W/command-panel.mjs:94,275`), and no phone route to that panel exists. The
bullet should say so in the same sentence, or the owner will read it as a swap he
is getting this week.

### C4. The map says what the engine does not do after time away, never what it does

The map proves no function reads `away_days`. True, and I confirmed it by
execution and by search. But the honest finding is one step further and the map
does not take it: with a 300 day hole in the record the card is byte-identical
and `liftCall` returns verdict PUSH with the words "You are gaining here" and
"1 session in a row without beating your total" (EX7). The app does not merely
fail to re-plan; it asserts a trend out of sessions from ten months ago. That is
what Dad would actually meet, and it is the sentence that should decide whether
this work is worth doing.

### C5. "Ease" disappears from the map, and it should not

The owner's ceiling is "ease or skip and say so". The map files skip under no
number and every form of ease under section 5, needs a number. That is right for
an APP-CHOSEN ease and wrong as the whole answer. MEASURED (EX13): when the
athlete simply logs a lighter weight, the engine records it, emits its own
receipt line naming both numbers (its text is "CHEST PRESS", then "LOGGED AT 35
(plan said 40)"; its dash is written here as a comma), moves the working load to
what he used, and the next session's targets come off what he actually did. No
new number, no advice, no engine byte. The map should say this plainly, because
it is the answer to half the owner's sentence.

### C6. One cite points at the wrong half of its own file

Map line 19: "The phone records new workouts through the native facts projection
(`P/gym-model.mjs:201-217`)". The claim is true; those lines are `readPrevious`,
the previous-performance READ over the host's projection. The RECORD path is
`logSet` at `P/gym-model.mjs:502-514`, which sends `load`, `reps` and `reserve`
through the client's workout commands. Worth fixing because `:502-514` is also
the evidence for C5: the phone already accepts whatever load he types.

### C7. Two small imprecisions

- `snapLoad` does not only round down: below the lowest rung it returns the
  lowest rung (`E/progression.cjs:386-391`). The map's row says "snap rounds down
  within available rungs".
- The phrase "pain speaks" is at `E/sleep.cjs:137` and `:139`; `:134` is where
  `pain9` is defined as `holdFlag`. The map's point is right, the line is one of
  three.

### C8. Where a reader can check the corpus

The map's scope line names root `research-brief.md` and `RESEARCH-DESIGN.md`.
Neither is inside the farm include list, so no cloud reader can check a single
corpus citation there. I read the ten cited ranges on the owner's PC worktree and
all ten were true. Whoever reads this next should be told that, or the corpus
half of the map is unverifiable from where the lanes read.

## WHAT I CHECKED, AND HOW

Fifty file-and-line claims, chosen where a product decision would lean on them.
TRUE means the file says at those lines what the map says it says. Everything in
the "what the engine already has" tables was additionally EXECUTED where a
behaviour was claimed; a claim about behaviour with no execution is marked READ.

Path key as in the map: E = `rebuild/engine/`, P = `rebuild/m3/w7-preview/today/`,
W = `rebuild/m4/workout/`, C = `rebuild/coach/`,
D2 = `rebuild/lanes/d2/reviews/science-audit/`, EW2 =
`rebuild/lanes/d2/EW2-SPEC.md` on `rebuild/d2-ew2-spec` at f89ce33f.

| # | map says | cite | verdict |
|---|---|---|---|
| 1 | away_days stored as {value, unit:"day"}, reason as text, "away" in issues | `P/checkin-commands.cjs:50-59,76-93,114` | TRUE |
| 2 | raw quantity validator takes any finite nonnegative number | `P/checkin-commands.cjs:79` | TRUE |
| 3 | the sheet restricts away days to whole numbers | `P/checkin-model.mjs:184` | TRUE |
| 4 | the two away questions are the ones quoted | `P/checkin-model.mjs:65-66` | TRUE |
| 5 | pain is location text + change + impact, no score, no lift id | `P/checkin-model.mjs:61-63,175-178` | TRUE |
| 6 | illness is one free-text note, no parsed onset | `P/checkin-model.mjs:64,180` | TRUE |
| 7 | soreness None/Mild/Significant with location and impact | `P/checkin-commands.cjs:44,46` | TRUE |
| 8 | the recovery sheet has NO equipment field | `P/checkin-commands.cjs:41-59` | TRUE |
| 9 | storage is a schema-2 event fact in the shared encrypted store | `P/checkin-host.mjs:11-15,43-50` | TRUE |
| 10 | read-back filters generation.collections.ops, returns payload.answers | `rebuild/m3/w6/local/today-bindings.mjs:572-606` | TRUE |
| 11 | after Save the sheet says the plan is unchanged | `P/checkin-model.mjs:39-40,301` | TRUE |
| 12 | only today's row is read back; a second save is refused | `P/checkin-model.mjs:264-267,285` | TRUE |
| 13 | today_checkin reads the lines; time_away writes after confirmed | `C/tools.cjs:594-610,628-631,659-683,705-712` | TRUE |
| 14 | record_pain_or_soreness records the choices without scoring them | `C/tools.cjs:686-702` | TRUE |
| 15 | answer_checkin carries sleep/energy/soreness/stress, hours, note only | `C/tools.cjs:717-735` | TRUE |
| 16 | equipment_unavailable_today returns FACT_COMMAND_ABSENT | `C/tools.cjs:738-745` | TRUE |
| 17 | request_replan re-plans on volume, phase, ladder only | `C/tools.cjs:779-810` | TRUE |
| 18 | a null comparison is an answer, not a gap to fill | `C/tools.cjs:574-580` | TRUE |
| 19 | import retains the check-in with no evidence role, never projected | `rebuild/m4/import/replay-registry.cjs:76-81` | TRUE |
| 20 | the coach screen is a stub | `P/today-app.cjs:2357-2358` | TRUE |
| 21 | the sleep screen DOES read the check-in (quality shown, hours offered) | `P/today-app.cjs:1399,1611-1628`; `P/sleep-commands.cjs:145-158` | TRUE |
| 22 | a technique/reset fork makes an era; no elapsed-absence threshold | `E/plan.cjs:291-317` | TRUE, EXECUTED |
| 23 | forkExposures counts from the later of fork and calibration date | `E/plan.cjs:321-337` | TRUE |
| 24 | a fresh era returns add=0 and does not lower the last line | `E/progression.cjs:32` | TRUE, EXECUTED |
| 25 | ordinary effort steps stay +1/+2/+3 | `E/progression.cjs:43-53` | TRUE |
| 26 | authored std precedes reclaim, both precede progression; no gap branch | `E/progression.cjs:261-306` | TRUE, EXECUTED |
| 27 | a same-date row after a reset refuses PROGRESSION_RESET_MAPPING_REQUIRED | `E/progression.cjs:93-118` | TRUE |
| 28 | deload is 0.95, nearest lower rung, else multiples of 5 floor 5 | `E/progression.cjs:394-402` | TRUE, EXECUTED |
| 29 | rep loss = (hi+30)*step/(load+step), width = ceil(loss)+1, tight above 10% | `E/progression.cjs:412-432` | TRUE |
| 30 | proposeLadder reads OLD sessionLog loads, needs 4, tolerance 1e-6 | `E/progression.cjs:310-342`; `E/constants.cjs:44` | TRUE, EXECUTED |
| 31 | two 0-RIR openers set the hold; an opener at 1 or more releases it | `E/writers.cjs:234-238` | TRUE |
| 32 | a hot opener or a hold blocks the automatic load earn | `E/earn.cjs:36-45` | TRUE |
| 33 | liftCall: RED precedes reset/rebuild; reset within 14 days is REBUILD | `E/sleep.cjs:117-142` | TRUE, EXECUTED |
| 34 | pain9 in the stall path is exactly holdFlag, not a pain answer | `E/sleep.cjs:134-137` | TRUE |
| 35 | the three-sessions return line is unsupported copy | `E/sleep.cjs:122` | TRUE |
| 36 | bodyAlarm copy carries 24 oz, 30 minutes early, 6:45, third-day doctor | `E/sleep.cjs:1681-1686` | TRUE |
| 37 | pulse baseline needs 7 entries, median of the last 14 | `E/sleep.cjs:1694-1698` | TRUE |
| 38 | niggles: 3 flags in 21 days, feed line only, deduped 14 days | `E/writers.cjs:404-416` | TRUE |
| 39 | soreness subtraction is off; a sore7 <= 1 door remains on the add arm | `E/writers.cjs:1484` | TRUE |
| 40 | SELECTION_AUDIT is three fixed ids and setup-string tests | `E/writers.cjs:1293-1300` | TRUE |
| 41 | the sentinel says a number is never clearance and never a diagnosis | `E/policy.cjs:638-645` | TRUE |
| 42 | diet break is 7 days maintenance, 10-day recent label | `E/constants.cjs:303,306`; `E/policy.cjs:509-515` | TRUE |
| 43 | trend window 6, minimum 4 sessions, review days 14/56/84 | `E/constants.cjs:101,104,365-374` | TRUE |
| 44 | replace retires the old id and adds one with w=null, forks=[] | `W/plan-edit-model.cjs:339-365` | TRUE, EXECUTED |
| 45 | update fields are n/day/sets/hi/inc/steps, never the working load | `W/plan-edit-commands.cjs:45-79` | TRUE |
| 46 | "Equipment unavailable" is a set-skip reason in a separate panel | `W/command-panel.mjs:94,275`; `W/commands.cjs:45` | TRUE |
| 47 | no phone route to that panel; gym-model exports no skip | `P/gym-model.mjs:579-586`; `P/gym-app.mjs:452,558`; `P/today-entry.mjs:218` | TRUE |
| 48 | EW2's Days door is deferred; edits start tomorrow; the quoted E4 line | `EW2:455-461,468-470,645` | TRUE |
| 49 | the catalogue labels muscle assignment, names and some lends INVENTED | `P/exercise-catalogue.mjs:19-35` | TRUE |
| 50 | the phone records workouts through the native facts projection | `P/gym-model.mjs:201-217` | TRUE, CITE WRONG (see C6) |
| 51 | loadRungs/nextLoad/prevLoad/snapLoad/parseRungs behave as described | `E/progression.cjs:346-408` | TRUE except snap (C7) |
| 52 | Bickel 2011, 16 then 32 weeks, one-ninth dose, do not generalise across age | `research-brief.md:114-118` | TRUE (read on the PC) |
| 53 | D2 narrows Bickel to reduced dosing, abstract only, not trained dieters | `D2/SOURCES.md:45-47` | TRUE |
| 54 | Coleman tested one week of cessation, not a 5% reset; nonsignificance is not equivalence | `D2/SOURCES.md:69-71`; `D2/CLAIMS.md:80` | TRUE |
| 55 | no post-cut rebound; muscle memory does not apply; myonuclei not permanent | `research-brief.md:305-309` | TRUE (read on the PC) |
| 56 | zero positive deload RCTs; design file rejects scheduled and autoregulated | `research-brief.md:397-400`; `RESEARCH-DESIGN.md:623,695` | TRUE (read on the PC) |
| 57 | Haugen 2023, SMD -0.055, CI -0.397 to 0.287, p=0.751 | `research-brief.md:401-403` | TRUE (read on the PC) |
| 58 | selection inside a muscle matters: standing vs seated calf d = 0.88-1.58 | `research-brief.md:135-146` | TRUE (read on the PC) |
| 59 | direct sets count 1, indirect 0.5, heads bucket separately | `research-brief.md:88-100` | TRUE (read on the PC) |
| 60 | soreness is a load readout and an invalid readiness predictor | `research-brief.md:349-354` | TRUE (read on the PC) |
| 61 | lane E: no conclusion says a person should train through pain | `rebuild/lanes/e/science-audit/CLAIMS.md:114` | TRUE |
| 62 | D2: health restrictions need human handling, not invented cutoffs | `D2/CLAIMS.md:111` | TRUE |
| 63 | a nonsignificant comparison is not equivalence; D2 retains it | `rebuild/lanes/astra/SCIENCE-AUDIT-GO.md:16`; `rebuild/lanes/d2/reviews/SCIENCE-AUDIT-REVIEW.md:19` | TRUE |
| 64 | the owner's diet-break counts are product choices, not clinical thresholds | `rebuild/lanes/astra/SCIENCE-OWNER-CHOICES.md:7` | TRUE |
| 65 | the app invents no number its corpus does not carry | `rebuild/DECISIONS.md:561` item (6) | TRUE |
| 66 | DECISIONS:578 is blank in this checkout | `rebuild/DECISIONS.md` at 1dc17c3d, 577 lines | TRUE; it EXISTS at the chain tip 05466ebb and I read it there |
| 67 | window width is derived, not cited | `research-brief.md:265-272` | TRUE (read on the PC) |
| 68 | the eleven Today calls the checker lists are the ones on that path | `P/today-model.cjs:125-138,235,247`; `P/food-model.cjs:94`; `P/sleep-model.cjs:170`; `P/today-app.cjs:1772` | TRUE |

Sixty-eight claims checked. Sixty-six true as written, one cite pointing at the
wrong half of the right file (#50), one imprecision (#51). Nothing fabricated.

## WHAT I EXECUTED

Farm scratch worktree at 1dc17c3d, `MEASURED_TEST_NOW=2026-09-03`,
`TZ=America/New_York`. Inputs are the repository's own synthetic fixture
(`rebuild/m3/w7-preview/fixtures.cjs`, four demo lifts at 40 lb, hi 12, two sets,
last line 10,10, synthetic day 2030-02-04) plus values I invented. No owner data.
Nothing was written to the tree; the cells live only in the scratch worktree.

**EX1/EX6 - does an absence change tonight's card?** Same recorded history read on
the training day 203 days later: targets identical, live line identical. Then the
record itself shifted so the last session is 2029-04-07 and today is 2030-02-04, a
300 day hole: card byte-identical, targets [12,12] both ways. MEASURED: the number
of days since the last session changes nothing in the prescription.

**EX2 - are the check-in answers readable at all?** With
`issues:["away","pain"], away_days 200, pain_impact "I cannot do the movement",
soreness "Significant"` attached to the state handed to the engine, `genSession`
and `rirPlan` returned byte-identical output. MEASURED, and the map's claim is
confirmed by running it, not by reading it.

**EX5 - the engine's own vocabulary.** 573 exported names; zero match
away/pain/equipment/substitute/detraining. A tree-wide search for `away_days`
finds only the check-in model and command, the coach read-back tools, the screen
template and tests.

**EX7 - what it does instead.** With the 300 day hole: `eraFresh` false (no era is
created by elapsed time), `forksOf` empty, and `liftCall` returns verdict PUSH,
"You are gaining here", "1 session in a row without beating your total", computed
from sessions ten months old. `sweepStalls` returns null, `phaseProposal` null,
`proposeLadder` null. MEASURED.

**EX3 - a fresh era.** `progressStep` returns `{add:0}` with the engine's own
reason beginning "new baseline"; `targetsFor` returns the last line unchanged
[10,10], NOT a lowered one; with an authored standard [11,9] on the same fresh
era, `targetsFor` returns [11,9]. MEASURED: the map's "a technique-era zero step
does not override an authored standard" is correct.

**EX4 - the only load reduction the engine owns.** `deloadLoad` with no rung list
at 100 gives 95; with rungs [40,45,50,55] at 55 gives 50; at the lowest rung it
stays; at 7 it floors at 5. MEASURED.

**EX11 - a lighter rung the athlete can pick.** `prevLoad` from 50 on his own
rung list [30..55] gives 45; at the bottom rung it gives null. The rungs are
authored by the athlete in setup, so "one rung down, his tap" invents no number.

**EX13 - ease, end to end.** He logs 35 where the plan said 40: the engine writes
the session, emits a receipt naming both numbers, sets the working load to 35,
and the next card asks 9,8 off his delivered 8,8. At 30 with 11,11 delivered the
next card asks 12,11 at 30. MEASURED. Caveat, and it matters: this is
`completeSession`, the LEGACY writer, which the map correctly says the phone does
not call. On the phone the same thing happens through `logSet`, which takes the
load he types (`P/gym-model.mjs:502-514`); what I measured is the engine's rule,
not the phone's wiring.

**EX14 - skip, end to end.** A session completed with `skipped:[{id:'demo-press'}]`
emits the receipt "SKIPPED", then the lift's name, then "your call, on the record,
zero phantom reps, nothing counted" (the app's own words, its dash written here as
a comma); the skipped lift's last line is untouched and its next card is
unchanged. MEASURED. Nothing is recorded as a failure or a zero.

**EX9 - the catalogue.** 83 entries, 16 buckets; `entriesInBucket('chest','U')`
gives 11 lifts, `entriesInBucket('quads','L')` gives 8 (back squat through
Bulgarian split squat, which is a picker, not an equivalence class); no entry has
a load, a set count, a rank, a score or a substitution link;
`searchByName('bench')` returns 6. MEASURED.

**Existing tests, run rather than read.** `rebuild/lanes/d/plan-edit/model.test.cjs`
55/55 pass, including "actual F2 adapter proves replacement ID, unknown load,
order and no borrowed history" (`:151-155`). `C/test/tiers.test.cjs` 13/13 pass,
including `:214` (a fact with no re-plan entry point is refused, not improvised)
and `:256` (equipment-unavailable has no field anywhere).
`P/test/checkin.test.mjs` 28/28 pass, including `:149` (a cleared issue's hidden
detail is never submitted) and `:265` (yesterday is never today). The map cites
all of these as source evidence; they now have execution behind them.

## WHO READS WHAT THE PHONE RECORDS

Traced from the stored operation outward, then confirmed by execution.

The three answers are written by one command (`P/checkin-commands.cjs prepare`) as
a single event fact carrying `profile: "earned/recovery-checkin/v1"`, into the one
encrypted local operation store the weigh-in and the workout share
(`P/checkin-host.mjs:11-15,43-50`). Every reader of that fact:

1. The check-in sheet itself, today's row only, for read-back
   (`P/checkin-model.mjs:264-267`, `rebuild/m3/w6/local/today-bindings.mjs:572-606`).
2. The coach's `today_checkin`, which reads the same lines back
   (`C/tools.cjs:594-610`), and the two writers `record_pain_or_soreness` and
   `time_away`, which write through the same sheet after a spoken yes
   (`:686-712`).
3. The sleep screen, and ONLY for sleep: it shows the check-in's sleep quality
   (`P/today-app.cjs:1399`) and offers the hours as a suggestion for a separately
   saved night, with the source op id travelling and authenticated
   (`P/today-app.cjs:1611-1628`, `P/sleep-commands.cjs:145-158`).
4. Import replay, which RETAINS the fact and declares it has "no evidence role"
   and is "never projected" (`rebuild/m4/import/replay-registry.cjs:76-81`).

There is no fifth reader. No training rule, no target, no load, no volume
decision and no coach proposal takes any of it: `request_replan` re-plans on
volume, phase and ladder and refuses everything else by name
(`C/tools.cjs:779-810`), and the engine exports no name containing away, pain,
equipment, substitute or detraining (EX5).

**Verdict on "the plan ignores all three": CONFIRMED for two, and the third is
not even recorded.** Time away and pain are recorded and read by nobody who
plans. Equipment is not recorded at all: there is no field on the sheet
(`P/checkin-commands.cjs:41-59`) and the coach refuses it by name
(`C/tools.cjs:742-745`). The owner's own words at DECISIONS:578 name pain and
time away; whoever briefs the build should not let "the check-in already takes
it" carry equipment along by accident.

## THE MEDICAL-ADVICE READ

The owner's line: ease or skip and say so, never medical advice. I read every
sentence of the map's PAIN part and every athlete-facing behaviour it proposes,
looking for four things: a diagnosis, a prescribed treatment, a named condition,
or a predicted recovery.

**The map itself is clean.** No sentence in PAIN sections 1 to 5 diagnoses,
prescribes, names a condition or predicts recovery. Its proposals are: ask the
existing questions, repeat his words, ask which exercise, offer a skip he chooses,
keep the record dated, and explain that the effort hold is not a pain response.
All of those sit at or below the owner's ceiling. Two sentences are worth
watching and neither crosses:

- Map line 134 reports that no trial shows training a sore muscle impairs
  adaptation. Read alone that is a permission. It is qualified in the same
  sentence ("this does not establish that training through reported pain is
  safe"), and the qualification must travel with it into any brief.
- Map line 169 asks the athlete to name the affected exercise. That is a
  question, not a triage.

**The risk is not in the map. It is in the engine copy the map quotes.** These
strings exist today and the map flags them without asking anyone to do anything
about them. They are the closest thing in the tree to the owner's line:

1. `E/sleep.cjs:1685`, verified: the exit test ends "Full rest day, and a third
   day is a doctor conversation, not a training one." That is an escalation
   instruction on a timer. It predicts nothing medically, but it tells him when
   to see a doctor.
2. `E/sleep.cjs:1681-1683`, verified: "Hydrate +24 oz across the morning";
   protein and calories held; lights out 30 minutes early; skip afternoon
   caffeine entirely. Prescriptive instructions with invented numbers. D2 already
   flagged them as unvalidated (`D2/CLAIMS.md:79`).
3. `E/sleep.cjs:120`, verified: "Body alarm is RED. Skip the iron today" - the
   app deciding from pulse and sleep readings that he should not train.
4. `E/sleep.cjs:122`, verified: after a load reset, "the old numbers usually fall
   within three sessions". That is a recovery prediction, in the one code path a
   time-away re-plan would most naturally be built on. If TIME AWAY reuses the
   reset machinery, this sentence ships with it.
5. `E/policy.cjs:642-644`, verified: a symptom check asking about libido and
   morning function, whose comment routes persistent clusters to "HUMAN MEDICAL
   REVIEW". It does say "A number is never clearance and never a diagnosis".

None of these five is proposed by the map, and none is on a phone path anyone has
established. I am not asking for them to be changed in this job. I am saying that
"never medical advice" is a rule the tree does not currently keep everywhere, and
the PAIN work is the moment it gets noticed.

**One design change removes the whole risk.** If the skip control is always
present, for any reason, with the reasons the command panel already carries
("Equipment unavailable", "Time", "I chose not to do this set",
`W/command-panel.mjs:94`), then the app never offers a skip BECAUSE of pain, and
so never implies a judgement about his body. It only records his own choice. That
answers EQUIPMENT and PAIN with one control, needs no new number, and is the
safest thing on this list. It is question 5 below.

## NEW NUMBERS: WHERE THE MAP'S SEPARATION LEAKS

The map splits behaviours into "needs no new number" and "would need a number the
corpus does not carry". I attacked the first list. Four leaks, one of them large.

**L1 (large). The map files nothing at all under "the app should stop asserting a
trend after a gap", and that is the one number this work actually needs.**
MEASURED (EX7): after 300 days the app says "You are gaining here". To stop
saying that, something has to decide when the record is too old to speak. How
many days is a threshold. The corpus does not carry it: I searched both root
corpus files and the words "detrain", "layoff", "time away", "break from
training", "return to training" and "missed session" appear exactly once between
them, in `research-brief.md:308`, saying muscle memory does NOT apply because he
is dieting rather than detraining. Bickel (`:114-118`) is a reduced-dose
maintenance study, Coleman (`:397-400`) is one week of cessation mid-programme,
and D2 says of each that it is not this (`D2/SOURCES.md:47,71`). So: the number
does not exist in the corpus, and by DECISIONS:561 (6) the engine may not invent
it. There is one no-number version and one owner-number version, and he should be
shown both: (a) any REPORTED time away suppresses the trend and the comparison
until a new session lands (no number, his own report is the trigger); (b) a
day count does it automatically (a product number, labelled as such, exactly as
his diet-break counts were labelled at `SCIENCE-OWNER-CHOICES.md:7`).

**L2. "Ask whether the athlete wants to review the first session" (TIME AWAY 4)
hides a "when".** The check-in records a day count and a reason, not a dated
absence and not a return date (map line 55, verified at
`P/checkin-model.mjs:181-187`). So "the first session back" is not a thing the
record knows. Either the offer happens in the same turn as the report (no number,
and that is what I would build), or something has to decide which later session
is the first one, which is a rule nobody has written. The map does not say which.

**L3. "Offer an explicit set skip" (EQUIPMENT 4, PAIN 4) hides a "how much".**
The stored command allows `skip_scope` of `set` or `lift`
(`W/schema.cjs:93-94`, verified); the existing panel hardcodes `set`
(`W/command-panel.mjs:275`, verified). One set or the whole lift IS the question
"how much load comes off", in a different currency. It is a product choice, not a
scientific one, and it is not in the map's six questions. It is in mine.

**L4. "Offer athlete-chosen replacement from the catalogue" hides an order.**
`entriesInBucket('quads','L')` returns 8 lifts in catalogue order (EX9). Whatever
order they appear in reads as a recommendation. The corpus forbids the app
choosing: `RESEARCH-DESIGN.md:696-697` puts exercise rotation on the list where
"No evidence supports autonomous manipulation". The honest build says the order
carries no meaning, and the map should say so where it makes the offer.

**Where I agree with the map.** Its section 5 lists are correct and I could not
break them: a percentage load or volume cut, a lost-strength estimate, a regain
countdown, an automatic gap trigger, a load conversion between exercises, an
"equivalent stimulus" set swap, a pain severity cutoff, a hold duration and an
inferred recovery date all need numbers this corpus does not carry. On pain the
corpus is not merely thin: across every science file in the farm's include list
the word "pain" occurs once, at `rebuild/lanes/e/science-audit/CLAIMS.md:114`,
and what it says is that nothing here says a person should train through pain.

## SIX QUESTIONS FOR JOE

Product taste only. None is a medical choice. Each is answerable on a phone with
a letter or a yes. Order is his: time away, equipment, pain. **Answering yes
orders the work and nothing more: any engine byte still needs his own word
besides, as DECISIONS:578 says of the queue itself.**

**TIME AWAY**

**Q1.** Right now, if you tell the app you were away for a month, it still says
"You are gaining here" and asks for the same reps. Should it go quiet about
progress until you have trained again? **A: yes, hide the "last time" comparison
and the progress line until a new session lands. B: leave it as it is.**
*If A: the comparison and trend readers return the "nothing comparable" state
they already have, triggered by your own report. No new number, no new science.
Roughly a day of work plus its tests.*

**Q2.** When you come back, the app will ask for the same targets you had before.
Should it **A: say so in one line ("these are from before your break") and leave
them, or B: show them with no comment?**
*If A: one sentence on the card. The targets do not change either way, because
the engine never lowers your line on its own.*

**EQUIPMENT**

**Q3.** When a machine is taken, should the app let you **A: skip that lift or
those sets right there, with "Equipment unavailable" as the reason, or B: only
swap the exercise from tomorrow through Edit My Week, or C: both?**
*A is the only same-day answer; the skip command and its reason list already
exist, there is no button on the phone yet. B is already specified but starts
tomorrow and cannot help you tonight. C is both, and is more work than either.*

**Q4.** If you swap an exercise, the new one starts with no weight on file (your
first session on it sets the line) and your old sessions stay in your history.
**Is that what you want? Yes / No.**
*This is already how the replacement writer behaves, proven by its own tests. A
"no" means someone has to invent a way to carry weight across two different
lifts, which the research does not support. PM can decide the wording; nobody
can decide the transfer without evidence.*

**PAIN**

**Q5.** Should the skip button be **A: on every set, every session, for any
reason (the reasons already written are "Equipment unavailable", "Time", "I chose
not to do this set"), or B: shown only after you report pain?**
*A is safer and simpler: the app never offers a skip because of pain, so it never
implies anything about your body. It only records your choice. A also answers Q3
at the same time. B makes the app's offer itself a comment on your knee.*

**Q6.** If you leave an exercise out, should that last **A: for today only, and
be asked again next time, or B: until you say otherwise, with the omission shown
on the card each time?**
*Either is honest. Neither assumes you got better because you went quiet. B needs
a visible marker so an omission cannot be forgotten.*

### What the PM can settle without him

Wording, screen placement, the order of a candidate list (as long as it is
declared meaningless), which cells cover it, and the order the three parts are
built in inside his own order. Already law and needing no decision: blank stays
blank, a cleared answer's detail never travels, old sessions are kept, no load is
carried to a replacement, and no number is invented.

### What nobody can settle

How many days away is "away", how much load comes off, how long an ease lasts,
and how long a pain omission should stand as a medical matter. The corpus carries
none of these. Any of them shipped as an automatic rule would be an invented
number, which DECISIONS:561 (6) forbids. They can only ship as HIS product choice,
labelled as his choice on the screen that uses it.

## WHAT I DID NOT VERIFY

- I did not read or judge any source paper; I checked that the corpus files say
  what the map says they say, not that the studies are right.
- I did not run the full test bar, any gate, any build or any seal, and I did not
  open a deployed phone bundle. The suites I ran were three small ones plus my
  own cells, in the cloud farm on Linux only. No Windows evidence.
- My ease and skip measurements ran the LEGACY `completeSession` writer, which
  the phone does not call. The phone's equivalent is `logSet` plus the native
  projection; I read that path and did not execute it.
- I did not execute the coach tool surface against a live check-in lane, the
  plan-edit host, the import replay or Edit My Week. Their tests pass; that is
  not the same as a wired screen.
- I did not verify the map's EW2 citations against an approved spec: EW2 is a
  spec on its own branch and says so itself (`EW2:3-6`). Nothing about its
  approval status is implied here.
- I did not touch the private census, the protected soak, `src/history.js`, any
  ledger directory or `rebuild/conform/private`, and no owner measurement entered
  this session. Every input I ran was invented or came from the repository's own
  synthetic fixture.
- This file is a review. It changes no engine byte and asks for none.
