# COACHING-POLICY-AS-BUILT: THE CLAUDE CHECK (lane C)

VERDICT: FIT AFTER THE LISTED CORRECTIONS.

Checked: `rebuild/coach/COACHING-POLICY-AS-BUILT.md` at 10777eae2c9e37f506b6fa10b532600f81ab1e22
on `rebuild/c-coaching-policy` (Astra's one commit, unreviewed until this file).
Checked AGAINST THE CODE, not against Part 2. Reviewer told to disagree.

WHY NOT "FIT FOR THE OWNER". Part 2 is careful, and almost every file:line and test
citation in it survives a hard sample (section 4). Part 1 does not. Part 1 is the page
the owner reads and rules on, and it describes the ENGINE as if it were the APP. Seven
of its twenty-seven sentences describe behaviour that nothing on his phone can reach
today. The largest one: nothing in the shipped app ever changes the weight on the bar
by itself. The single function that banks a heavier load, `completeSession`
(`rebuild/engine/writers.cjs:203`), is called by NO product code anywhere in the tree -
only by tests and by the conform laws. A page headed "WHEN EARNED CHANGES A WORKOUT"
that spends four of its seven sentences on weight, holds, resets and set counts will
leave him ruling on a machine he does not have running.

WHY NOT "NOT FIT". The numbers are right. Every engine constant Part 1 names was checked
at its own constant and every one is correct (section 4). Nothing in Part 1 reads as
medical advice. The sections are the right five sections. The fix is a rewrite of Part 1
that says which half is live, not a new investigation. That rewrite is in section 8,
whole and ready to paste.

---

## 1. EVERY SENTENCE OF PART 1, ONE ROW EACH

Verdict key. TRUE: correct as written and correct about the app he uses.
TRUE BUT MISLEADING: correct as a statement about code, but a reader who does not code
draws a wrong conclusion. FALSE: as written it tells him the app does something it does
not do today.

### WHEN EARNED CHANGES A WORKOUT

A1. "Earned advances ordinary rep targets from recorded effort."
VERDICT: TRUE. `progressStep` at `rebuild/engine/progression.cjs:19`, spent by
`targetsFor` at `:261`, reached on the phone through `genSession`
(`rebuild/engine/today.cjs:89`), which the gym card's prescription runtime exposes
(`rebuild/m4/workout/engine-runtime.cjs:40`). This is the one sentence in this section
that is live on his phone.

A2. "On multi-set lifts, last-set effort budgets extra reps: failure adds 1, 1-2 left
adds 2, and 3-plus left adds 3 across eligible sets."
VERDICT: TRUE. `progression.cjs:43` (3 or more left, add 3), `:44` (2 left, add 2),
`:45` (1 left, add 2), `:46` (failure, add 1). The budget is spent set by set at `:288`
against the taper ceiling at `:287`. Live on his phone.
ONE PRECISION: "last-set" is right only when the last set was rated. If only the first
set was rated the first set decides instead (`:49`, `:50`, `:51`), and A7 covers only
the case where nothing was rated. One sentence would close that.

A3. "Heavier weights normally need 2 qualifying top-range sessions running, or one
improvement beating the noise threshold."
VERDICT: FALSE, as a statement about his app. The rule itself is real:
`topRun >= 2` at `rebuild/engine/earn.cjs:39`, or `beatsNoise` clearing at
`rebuild/engine/progression.cjs:593` against `PUBLISHED_SET_SEM = 0.9`
(`rebuild/engine/constants.cjs:50`). But the counter that banks a sighting
(`ex.topAt` / `ex.topRun`) and the queue that carries the new weight are written ONLY
inside `completeSession` (`rebuild/engine/writers.cjs:203`, calling `earnWalk` at `:376`),
and `completeSession` is called by nothing in `rebuild/m3`, `rebuild/m4` or
`rebuild/client`. The prescription runtime his phone uses exposes five READERS and says
so in its own header: "no completion or adaptive writer escapes or executes through this
surface" (`rebuild/m4/workout/engine-runtime.cjs:1-8`, `:40`).
WHAT HE WOULD WRONGLY CONCLUDE: that if he hits the top of the rep window twice, the app
will put a heavier weight on his card. It will not. The card will even SAY "two sightings
bank it" (`rebuild/engine/today.cjs:191`), and the number it is counting never moves.
CORRECTED SENTENCE: "The rule for earning a heavier weight is written and tested, but
nothing in the app runs it yet: today you change the weight yourself, and the card only
tells you how far you are from earning one."

A4. "Two recorded first sets at failure hold the load until one leaves at least 1 rep."
VERDICT: FALSE, same reason. The rule is real and exact: `rebuild/engine/writers.cjs:238`
sets the hold when the last two recorded first-set ratings are both 0, and `:236` releases
it at 1 or more. Both lines are inside `completeSession`, which nothing calls.
CORRECTED SENTENCE: "The rule that holds a weight after two all-out first sets is written
and tested, but nothing in the app runs it yet."

A5. "Three repeat-or-worse comparisons within the last 5 sessions can trigger review; a
load hold or poor recovery permits a reset offer."
VERDICT: FALSE, same reason, twice over. `liftCall` (`rebuild/engine/sleep.cjs:50`) takes
the last 5 sessions at `:54` and needs a run of 3 at `:125`; the reset arm at `:134`
and `:135` needs the hold flag or a recovery score under 80 (`:274`). The offer is filed
by `sweepStalls` (`rebuild/engine/writers.cjs:1534`), which nothing calls. Worse:
`liftCall` reads `s.sessionLog`, the OLD history shape, and the phone records workouts in
the new shape (`workoutFacts`, `rebuild/m3/w7-preview/today/gym-model.mjs:215`). So even
if something called it, it would be reading a log his phone does not write.
CORRECTED SENTENCE: "The rule that spots a stall and offers to lighten a weight is
written and tested, but nothing in the app runs it, and it reads an older history format
than the one your phone records in."

A6. "More sets need the engine's go-ahead, checked 7 days apart, and predicted growth of
at least 2.05 percentage points."
VERDICT: FALSE, same reason. The gate is real: `volumeImbalance`
(`rebuild/engine/volume.cjs:99`) needs the regime to read free and be confirmed
(`REGIME_HOLD_D = 7`, `rebuild/engine/constants.cjs:119`) and needs the modelled gain to
clear `HYP_SDES = 2.05` (`constants.cjs:362`), searching 1 to 12 added sets at
`volume.cjs:128`. But its only two callers are the analyst prompt
(`rebuild/engine/writers.cjs:2549`) and the coach (`rebuild/coach/tools.cjs:786`), and
the coach is not in the app: `rebuild/coach/tools.cjs` is loaded by its own tests and by
nothing else in the tree.
CORRECTED SENTENCE: "The rule for adding sets is written and tested, but it only runs
inside the coach, and the coach is not on your phone yet."

A7. "Example: with no effort ratings, the rep budget defaults to 1, subject to target
ceilings."
VERDICT: TRUE. `progression.cjs:53` returns 1 when nothing is rated; the ceiling is
`hi - i` at `:287`. Live on his phone.

### WHEN IT HOLDS OR MOVES CALORIES

B1. "Calories follow food logs, weight change and the chosen loss rate, with a lower
limit."
VERDICT: TRUE. `observedTDEE` (`rebuild/engine/energy.cjs:369`) averages logged intake
and adds measured loss; `calorieTarget` (`:684`) takes the chosen band off it and floors
it. Live on his phone: `rebuild/m3/w7-preview/today/today-model.cjs:135` calls
`calorieTarget` on every render.

B2. "That limit is 25 calories per kilogram of estimated lean mass plus estimated
training cost, rounded to the nearest 50 calories."
VERDICT: TRUE BUT MISLEADING. Arithmetically exact: `calorieFloor`
(`rebuild/engine/energy.cjs:493`), `EA_SPARING = 25` (`constants.cjs:154`), training cost
from `energyAvailability().trainKcal` or `round(300 * 4 / 7)` (`energy.cjs:497`,
`EA_KCAL_PER_SESSION = 300` at `constants.cjs:166`), grain 50 at `energy.cjs:499`.
WHAT HE WOULD WRONGLY CONCLUDE: that 25 is a measured, settled, safe number. The engine's
own sentence three lines later says the opposite, in the code he is being asked to rule
on: "Treat the 25 as a convention rather than a measurement: it comes from three
single-subject case reports, and the IOC declines to set a threshold at all"
(`energy.cjs:503`). The lean mass is an estimate with its own wide interval
(`bfEst`, `energy.cjs:83`). A page that hands him a bare 25 and asks him to rule near it
has hidden the one fact he needs.
CORRECTED SENTENCE: see section 8. It carries the convention label.

B3. "The calorie-adjustment calculator proposes nothing if the latest weigh-in is at
least 3 days old, uncertainty covers the target rate, or the correction is below 90
calories daily."
VERDICT: TRUE. `autoPilot` (`rebuild/engine/policy.cjs:303`): stale at `:335` with
`STALE_DAYS = 3` tested inclusively at `energy.cjs:336`; the interval test at `:355`;
the 90 at `:361`. All three are real and all three are sufficient on their own.
ONE PRECISION worth one clause: two more things also stop it, and one of them is not
about evidence at all: a week in which sets were added holds a tighten (`:344`), and an
already-handled steer stops re-raising (`:362`). And on his phone the proposal is never
APPLIED by anything: `statusFace` (`rebuild/engine/today.cjs:429`) reads `autoPilot` and
can print "one tap to approve", and there is no wired tap, because the writer that would
apply it (`applyProposal`, `rebuild/engine/writers.cjs:2120`) is called by nothing.

B4. "Falling lifts and weight can raise the day's food instruction toward maintenance,
immediately for severe decline."
VERDICT: TRUE, and it is the most important true sentence in Part 1, because it is the
one place where the app on his phone really does change what he is told to eat.
`marchingOrder` (`rebuild/engine/today.cjs:487`) reads `energyBalanceTarget` at `:489`;
the costing branch (`rebuild/engine/energy.cjs:619`) steps the deficit down; the
immediate step is `step >= deficit0` at `:658`, which is exactly the maximal-severity
case built by `costingStep` at `:550` off `COSTING_SEVERE_SE = 1.96`
(`constants.cjs:151`). `today-model.cjs:137` calls `marchingOrder` on every render.
ONE PRECISION: "can raise" is right, but the reader will not know that this single
sentence is the live one and A3 to A6 are not. Section 8 says so.

B5. "Example: a noisy weigh-in cannot justify a correction while uncertainty still covers
the target."
VERDICT: TRUE. `policy.cjs:355` excludes the target from the rate's own interval, and
`:356` forces a hold when it does not.

### WHEN IT ASKS YOU SOMETHING

C1. "The coach needs your yes to record a fact or accept an engine-issued proposal."
VERDICT: FALSE, as a statement about his app. True of the module: `needConfirm`
(`rebuild/coach/tools.cjs:628`) and `accept_proposal` (`:842`, `:844`) both require
`confirmed === true`. But there is no coach on his phone. `rebuild/coach/tools.cjs` is
required by exactly one file in the tree outside its own tests, and that file is a test
(`rebuild/lanes/d2/reviews/science-coach-corrections/adversarial.test.cjs:7`). The
shipped build list names the check-in and no coach
(`rebuild/m3/w7-preview/today/build.mjs:120-123`).
WHAT HE WOULD WRONGLY CONCLUDE: that something on his phone asks him for a yes before it
records. What actually happens on his phone is that he taps Save on the check-in sheet
(`rebuild/m3/w7-preview/today/checkin-model.mjs:283`).
CORRECTED SENTENCE: see section 8.

C2. "The check-in asks about sleep, energy, soreness, stress, pain, illness and time
away."
VERDICT: TRUE, and live on his phone. `LABELS` at
`rebuild/m3/w7-preview/today/checkin-model.mjs:52`; the closed answer lists at
`checkin-commands.cjs:40-51`. It also asks sleep QUALITY and offers a free note, which
Part 2 says and Part 1 does not.

C3. "Selecting mild/significant soreness, pain, illness or time away opens follow-ups."
VERDICT: TRUE, live. `checkin-model.mjs:146`.

C4. "One check-in saves per day on the device; tomorrow starts blank."
VERDICT: TRUE, live. `save` refuses a second one at `checkin-model.mjs:284`; `refresh`
reads only this day's rows at `:266`.

C5. "Example: last night's recorded sleep is offered for confirmation, not asked again."
VERDICT: TRUE, live. `sleepNightFor` at `checkin-model.mjs:90`, the confirm branch at
`:157`. Two precisions Part 2 has and Part 1 should: "last night" means the calendar day
before (`dayBefore`, `:79`), and the record it offers is the SLEEP screen's record, not
another check-in.

### WHEN IT SAYS IT DOES NOT KNOW

D1. "Missing check-in answers stay unknown."
VERDICT: TRUE, live, and it is well built: unselected answers are left OUT of the saved
object rather than defaulted (`checkin-model.mjs:156`), and "None" is stored as a real
answer while silence is not.

D2. "The coach takes its numbers from this turn's tool results."
VERDICT: FALSE, same reason as C1. The rule is real and well tested (`allowedTokens`,
`rebuild/coach/tools.cjs:232`; `untraceable`, `:254`), and there is no coach on his phone
to take numbers from anything.

D3. "An unmeasured weight-change rate stays blank; no qualified past workout means no
comparison."
VERDICT: TRUE BUT MISLEADING on the first half; TRUE on the second.
The coach tool does check `measured` before publishing a rate
(`rebuild/coach/tools.cjs:445`). But the ENGINE does not return a blank: with too little
data `currentRate` returns `{ scale: 1.0, fat: 1.25, measured: false, method: "prior" }`
(`rebuild/engine/energy.cjs:304`) - a real 1.0 lb/week number carrying a false flag. What
keeps it off his screen is a DISPLAY GATE, not a blank: `rebuild/engine/today.cjs:584`
only draws the rate card when `cr.measured`, and `:258` prints "counting only" instead.
WHAT HE WOULD WRONGLY CONCLUDE: that the app holds no number until it has measured one.
It holds 1.0 and declines to show it. That is a different and more fragile promise, and
it is exactly the kind of thing he said he wanted written down.

D4. "Before maintenance is measured, estimated calories start at 12 per pound of
bodyweight, minus the planned cut, with the lower limit applied."
VERDICT: TRUE, live. `calorieTarget`'s thin-data branch at
`rebuild/engine/energy.cjs:689`; `MAINT_KCAL_PER_LB = 12` at `constants.cjs:246`;
the estimate at `:705`, the subtraction and floor at `:707` and `:708`. The engine labels
it "a labelled convention, not a measurement of you" in its own reason text.
ONE PRECISION: the bodyweight used is the TREND weight (`s.trend`), not this morning's
number on the scale.

D5. "Example: without bodyweight either, there is no calorie target."
VERDICT: TRUE, live. `energy.cjs:703` returns `lo: null, hi: null` with a plain reason.

### WHAT IT RECORDS TODAY AND THEN IGNORES

E1. "These reports do not change the plan."
VERDICT: TRUE, live, and the screen says it in its own words:
"Your plan is unchanged: nothing in this check-in reaches a training rule yet"
(`rebuild/m3/w7-preview/today/checkin-model.mjs:39`, returned after every save at `:301`).

E2. "Confirmed pain and soreness save in the daily check-in and show back; nothing
happens to the plan."
VERDICT: TRUE BUT MISLEADING, on two counts.
First, "Confirmed" is the coach's word for a spoken yes (`tools.cjs:628`), and there is
no coach; on his phone he taps Save.
Second, and this is the one that matters for his ruling: pain and soreness are not the
only answers that are recorded and then ignored. SLEEP QUALITY, ENERGY, STRESS and
ILLNESS are recorded and ignored too. I looked for a path from any check-in answer into
the engine's state and found exactly one: sleep HOURS can be carried onto the sleep
screen if he taps "Use these hours" (`rebuild/m3/w7-preview/today/today-app.cjs:1625`).
Nothing else crosses. Part 1 names three of the seven ignored answers and leaves him
thinking the other four are used.

E3. "Time away saves days and reason for read-back; nothing happens to the plan."
VERDICT: TRUE, live. `checkin-model.mjs:181-187` builds it, `:222` reads it back, whole
days 0 or more at `:184`.

E4. "The missing-equipment tool cannot record the report; nothing happens to the plan."
VERDICT: FALSE, as a statement about his app. True of the coach tool:
`equipment_unavailable_today` (`rebuild/coach/tools.cjs:742`) refuses by naming the
absent field. But on his phone there is no missing-equipment tool at all, and the
check-in has no equipment question: the closed field list at
`rebuild/m3/w7-preview/today/checkin-commands.cjs:57` has no equipment entry.
WHAT HE WOULD WRONGLY CONCLUDE: that he can tell the app a machine was taken and the app
merely does nothing with it. He cannot tell it at all. That is a bigger gap than the page
describes, and it is the gap he put SECOND in his own order (DECISIONS:578).
CORRECTED SENTENCE: "There is no way to tell the app a machine was taken. The coach has a
tool for it that refuses, and the check-in has no question for it."

E5. "Example: reporting an unavailable machine does not produce a replacement exercise."
VERDICT: FALSE, same reason: there is no reporting step to begin with.

### DECISIONS ONLY YOU CAN MAKE

F1. "Keep the 90-calorie adjustment cutoff, change it, or require stronger evidence?"
VERDICT: TRUE as a question; the 90 is a bare literal at `rebuild/engine/policy.cjs:361`
with no named constant and no citation beside it, exactly as Part 2 says. But it asks him
about a number that never fires on his phone, because nothing applies the proposal
(see B3).

F2. "Keep one rep-step rule for beginners and experienced lifters, or distinguish them?"
VERDICT: TRUE as a question, and the right one to ask now, because his father starts
fresh (DECISIONS:561 point 5) and the rep step is the one live rule in section 1.
`progressStep` (`progression.cjs:19`) branches on era and effort and never on training
age.

F3. "Should pain only be recorded, pause the affected exercise, or ask for human review?"
VERDICT: TRUE as a question. Not medical advice as worded. "Ask for human review" is
ambiguous: it could mean the app tells him to see someone, which his own rule forbids
(DECISIONS:578: "never medical advice"). Reword to name what the APP does.

---

## 2. REACHABLE ON THE PHONE TODAY, OR ENGINE ONLY

How I traced it. The slice build's composition is
`rebuild/m3/w7-preview/today/today-engine.cjs`: the read-only browser engine plus
`writers.cjs`. I then listed every engine call in that folder outside its tests. There
are exactly eleven: `nowModel`, `statusFace`, `currentRate`, `calorieTarget`,
`proteinTarget`, `marchingOrder`, `readRecency`, `genSession`, `sleepSpanH` (readers) and
`applyRead`, `writeDaily` (the two writers, for a weigh-in and a food day). The workout
card prescribes through `rebuild/m4/workout/engine-runtime.cjs`, whose exposed surface is
five READERS (`:40`) and whose header states no writer escapes it.

SECTION 1, WHEN EARNED CHANGES A WORKOUT.
ON HIS PHONE: A1, A2, A7 (rep targets, through `genSession` -> `targetsFor` ->
`progressStep`).
ENGINE AND TESTS ONLY: A3, A4, A5, A6. All four depend on `completeSession`,
`sweepStalls` or `volumeImbalance`; no product code calls any of them.
EXTRA FINDING the owner needs: the card SHOWS the earn language anyway. The runway line
at `rebuild/engine/today.cjs:191` prints "two sightings bank it" and a rep distance to
the next weight, while the counter it is describing never advances.

SECTION 2, WHEN IT HOLDS OR MOVES CALORIES.
ON HIS PHONE: B1, B2, B4, B5 as descriptions of numbers that are computed and shown
(`today-model.cjs:135` and `:137`).
PARTLY: B3. `autoPilot` runs on his phone inside `statusFace`
(`rebuild/engine/today.cjs:429`), so the three holds are real and visible as a status
word. What is NOT on his phone is the accepting of a proposal: nothing calls
`applyProposal`.
ENGINE ONLY: nothing in this section is wholly unreachable.

SECTION 3, WHEN IT ASKS YOU SOMETHING.
ON HIS PHONE: C2, C3, C4, C5. The recovery check-in is in the shipped build
(`build.mjs:120-123`).
COACH ONLY (stub until C-UI-6): C1.

SECTION 4, WHEN IT SAYS IT DOES NOT KNOW.
ON HIS PHONE: D1, D4, D5, and the second half of D3.
COACH ONLY: D2, and the first half of D3 as worded (the engine's own answer is a 1.0
prior, kept off screen by a display gate).

SECTION 5, WHAT IT RECORDS TODAY AND THEN IGNORES.
ON HIS PHONE: E1, E3, and the "nothing happens to the plan" half of E2.
COACH ONLY: the "Confirmed" framing of E2, and all of E4 and E5.
NOT REACHABLE AT ALL, BY ANY SURFACE: telling the app a machine was taken.

---

## 3. PART 2, SAMPLED HARD

Twenty-nine rows verified end to end (function at the file:line, constant at its
constant, named test at that line in that file with that text). Part 2 is strong.

CONSTANTS: all twenty-three I checked are at the exact line Astra gives and hold the
exact value: `LADDER_MIN_N = 4` (`constants.cjs:44`), `PUBLISHED_SET_SEM = 0.9` (`:50`),
`KCAL_PER_LB_MIX = 3800` (`:80`), `PROTEIN_FLOOR_G_PER_KG = 2.5` (`:92`),
`TREND_WINDOW = 6` (`:101`), `TREND_MIN_SESSIONS = 4` (`:104`), `TREND_MIN_LIFTS = 4`
(`:107`), `TREND_CLEAN_MIN_SESSIONS = 3` (`:113`), `FLAT_HALFWIDTH = 1.5` (`:116`),
`REGIME_HOLD_D = 7` (`:119`), `STALE_DAYS = 3` (`:128`), `COSTING_SEVERE_SE = 1.96`
(`:151`), `EA_SPARING = 25` (`:154`), `EA_KCAL_PER_SESSION = 300` (`:166`),
`CUT_FLOOR_PCT 0.5` (`:177`), `CUT_RECOMP_PCT [0.60,0.70]` (`:184`),
`CUT_FATLOSS_PCT [0.85,1.00]` (`:185`), `BULK_CORR_PCT / BULK_REDLINE_PCT` (`:208`),
`MAINT_KCAL_PER_LB = 12` (`:246`), `AUTO_MAG_KCAL = 200` (`:283`),
`BREAK_LEN_DAYS = 7` (`:303`), `BREAK_RECENT_DAYS = 10` (`:306`), `DEBT_LAST_H = 6.5`
(`:309`), `DEBT_MEAN3_H = 7.0` (`:312`), `VOL_BANDS` (`:327`),
`HYP_SDES = 2.05, HYP_B = 1.76` (`:362`). No correction.

TESTS IN `tools/engine-test.jsx`: I read fifty of the cited lines on the owner's PC.
Every one is at the stated line with the stated text, including `:2891` "terminal set
taken to failure", `:2894` "three left", `:2901` "nothing rated", `:2922` "and a full
window still refuses to invent reps above the ceiling", `:3477` "a session far clear of
the old line banks on one sighting", `:3680` "the detection threshold is stated, not
implied", `:3822` "it is energy availability run backwards", `:773` "the stale threshold
is STALE_DAYS = 3", `:820` "(a) the hold is CAUSED by noise", `:4945` "R2c", `:5202`
"too few distinct loads proposes nothing", `:5412` "a never-measured rate reads
CALIBRATING even when old reads are stale", `:6031` routine auto-apply, `:9393` the new
baseline. No correction.

TESTS IN THE FARM (`rebuild/coach/test/*`, `rebuild/m3/w7-preview/today/test/*`): all
twenty-three cited lines are exact, including `tiers.test.cjs:51`, `:70`, `:98`, `:128`,
`:214`, `:226`, `:243`, `:256`; `local-era.test.cjs:99`, `:144`, `:176`, `:196`;
`traceability.test.cjs:33`, `:63`, `:79`, `:245`, `:273`;
`charter-and-gym-seam.test.cjs:136`; `checkin.test.mjs:63`, `:96`, `:108`, `:149`,
`:265`, `:289`, `:326`, `:408`, `:722`. No correction.

NO TEST FOUND CLAIMS I TRIED TO REFUTE AND COULD NOT: the exact 12 multiplier (no
occurrence of `MAINT_KCAL_PER_LB` anywhere in `engine-test.jsx`); the isolated
`from: "none"` cold-start branch (the only occurrence is inside the disjunction at
`:3409`); a dedicated time-away read-back assertion (the only exact read-back assertion,
`checkin.test.mjs:306`, covers energy and soreness only). All three stand.

ONE NEAR-MISS ASTRA SHOULD HAVE HAD: `engine-test.jsx:232` asserts
`gt.from === "mass-estimate"` strictly, which is a tighter pin on the thin-data branch
than the `:3409` disjunction Part 2 cites. It still does not pin the 12.

TWO CORRECTIONS TO PART 2.

(a) THE METHOD PARAGRAPH IS WRONG ON ITS OWN CITATION. Part 2 says
"`rebuild/engine/test/second-gate.mjs:91` redirects that suite to the extracted engine".
Line 91 is an esbuild option (`loader:{".jsx":"jsx"}, outfile: ...`). The redirect is at
`second-gate.mjs:97`, and the adapter path is set at `:12`. The claim is right; the line
is not.

(b) THE `rebuild/m3` LINE NUMBERS DRIFT BY ONE TO THREE, SYSTEMATICALLY. The coach's own
citations (`tools.cjs:424`, `:445`, `:574`, `:594`, `:628`, `:659`, `:689`, `:705`,
`:742`, `:779`, `:805`, `:842`, `:910`, `local-world.mjs:210`) are all exact. The
check-in ones are not: `CHOICES` is at `checkin-commands.cjs:40`, not `:41`; `ISSUES` at
`:51`, not `:52`; `QUANTITIES` at `:49`, not `:50`; `answersOf` at `:66`, not `:67`;
`createCheckInDraft` at `checkin-model.mjs:101`, not `:103`; `state()` at `:142`, not
`:141`; `dayBefore` at `:79`, not `:77`; the whole-days guard at `:184`, not `:185`; the
unselected-choices object at `:102`, not `:104`. Nothing changes meaning, and a reviewer
who follows them lands within three lines of the term every time, but the table claims
"exact source lines" and should be corrected before it is kept as a reference.

---

## 4. WHAT IS MISSING FROM PART 1 THAT HE NEEDS IN ORDER TO RULE

1. Nothing in the app puts a heavier weight on your card by itself: the one function that
banks a heavier load, `completeSession` (`rebuild/engine/writers.cjs:203`), is not called
by any screen, so the "two sightings bank it" line the card prints
(`rebuild/engine/today.cjs:191`) is counting a number that never moves.

2. The coach is not on your phone yet, so every sentence about asking you for a yes
describes a part that is written and tested and not yet wired
(`rebuild/coach/tools.cjs`, loaded only by its own tests; the shipped build list is
`rebuild/m3/w7-preview/today/build.mjs:120-123`).

3. Four more check-in answers are recorded and then ignored besides pain, soreness and
time away: sleep quality, energy, stress and illness
(`rebuild/m3/w7-preview/today/checkin-model.mjs:52`); the only answer that can reach the
rest of the app is sleep HOURS, and only when you tap "Use these hours" on the sleep
screen (`rebuild/m3/w7-preview/today/today-app.cjs:1625`).

4. The 25 in the calorie floor is called a convention in the engine's own words, from
three single-subject case reports, with the IOC declining to set any threshold
(`rebuild/engine/energy.cjs:503`) - so the floor is a choice the app made, not a
measurement of you.

5. The one place where the app on your phone really does change what it tells you to eat
is the falling-lifts step toward maintenance: `marchingOrder`
(`rebuild/engine/today.cjs:489`) reading `energyBalanceTarget`'s costing branch
(`rebuild/engine/energy.cjs:619`).

---

## 5. TONE AND JARGON

MEDICAL ADVICE: no sentence in Part 1 reads as medical advice. Closest are B2 (a calorie
floor stated as a settled number) and F3 ("ask for human review"). Both are fixed in
section 8 by labelling the 25 as the app's own convention and by rewording F3 to name
what the APP does. Part 2's phase-proposal paragraph mentions libido and morning function
and human medical review; that is the engine's own note and it stays in Part 2, which the
owner is not being asked to rule on.

JARGON IN PART 1, WITH A PLAIN REPLACEMENT. A fifteen year old cannot read Part 1 today.

- "advances ordinary rep targets" -> "raises the reps it asks for"
- "recorded effort" -> "how hard you said the set was"
- "multi-set lifts" -> "lifts you do more than one set of"
- "last-set effort budgets extra reps" -> "how hard the last set was decides how many
  reps get added"
- "1-2 left" / "3-plus left" -> "one or two reps left in the tank" / "three or more left"
- "eligible sets" -> "the sets that still have room"
- "2 qualifying top-range sessions running" -> "two sessions in a row at the top of the
  rep range"
- "one improvement beating the noise threshold" -> "one session so much better than the
  last that it cannot be an ordinary good day"
- "first sets at failure" -> "first sets where you had nothing left"
- "hold the load" -> "keep the weight the same"
- "repeat-or-worse comparisons" -> "sessions that did not beat the one before"
- "trigger review" -> "flag the lift for a look"
- "a load hold or poor recovery permits a reset offer" -> "if the weight is already held,
  or your recovery score is low, it offers to lighten the weight"
- "the engine's go-ahead" -> "the app's own check on your data"
- "predicted growth of at least 2.05 percentage points" -> "a predicted gain big enough
  that research could tell it apart from nothing"
- "rep budget" -> "how many reps get added"
- "target ceilings" -> "the top of the rep range for that set"
- "the chosen loss rate" -> "how fast you said you want to lose"
- "lower limit" -> "the lowest calorie number it will ever give you"
- "estimated lean mass" -> "how much of you the app thinks is not fat"
- "estimated training cost" -> "what it thinks your training burns"
- "the calorie-adjustment calculator" -> "the part that offers to change your calories"
- "uncertainty covers the target rate" -> "the scale is too noisy to tell whether you are
  off target"
- "the day's food instruction" -> "what it tells you to eat today"
- "toward maintenance" -> "back up toward the number that holds your weight steady"
- "an engine-issued proposal" -> "a change the app worked out itself"
- "An unmeasured weight-change rate" -> "how fast you are losing, before it has enough
  weigh-ins to measure it"
- "no qualified past workout" -> "no earlier session it can fairly compare to"
- "Before maintenance is measured" -> "before it has enough food logs to work out what
  holds your weight steady"
- "the planned cut" -> "the amount you want to be under"
- "show back" -> "are shown to you again"

Part 2 jargon that stays in Part 2 but is worth naming, since Astra uses it as if it were
plain: "effective maintenance", "loss-rate interval", "taper ceiling", "hysteresis
branch", "deadband", "half-width", "accretion-bound", "governing read", "closed producer
list", "provenance".

---

## 6. ARE THE THREE OWNER QUESTIONS THE RIGHT THREE

No. Two of the three are good and the set is wrong for what this page is for.

KEEP F2 (one rep-step rule for beginners and experienced lifters). It is the only one of
the three that asks about a rule that actually runs on his phone, and his father starts
fresh (DECISIONS:561 point 5), so it binds in the first week.

KEEP F3, REWORDED (pain). It is the right question and it is his own third priority
(DECISIONS:578). Reword so no option asks him to rule a medical matter.

DROP OR DEMOTE F1 (the 90-calorie cutoff). It is a real unnamed literal, but nothing on
his phone applies the proposal it guards, so a ruling on it changes nothing he can see,
and it competes for his attention with the two gaps he put FIRST.

MISSING, AND THIS IS THE POINT OF THE PAGE: neither TIME AWAY nor EQUIPMENT appears in
the list at all. DECISIONS:578 puts time away first and equipment second, and says this
last list becomes the front page of the re-plan spec. A front page that omits the first
two items is not a front page. Section 7 drafts those questions.

---

## 7. THE CORRECTED PART 1, WHOLE, READY TO PASTE

Everything between the two rulers replaces Part 1 as it stands. Plain words, no jargon,
every number at its real value, and each section says which half is live on his phone.

-----------------------------------------------------------------------

# PART 1: FOR THE OWNER

Read this first. Earned has TWO halves right now, and they are not the same size.

THE HALF THAT IS ON YOUR PHONE: the workout card and its rep targets, the weigh-in, the
food log, the sleep screen, the calorie and protein numbers, and the recovery check-in.

THE HALF THAT IS WRITTEN AND TESTED BUT NOT WIRED IN: everything that changes the WEIGHT
on the bar by itself, everything that adds sets, and the whole talking coach. The rules
below are real rules with real tests; where one is not running yet, this page says so in
its own sentence. Nothing here is medical advice, and nothing here is a rule about your
health.

## WHEN EARNED CHANGES A WORKOUT

LIVE ON YOUR PHONE.
Earned raises the reps it asks for, from how hard you said your sets were.
On a lift you do more than one set of, the last set decides the step: if you went to
failure it adds 1 rep, if you had one or two left it adds 2, if you had three or more it
adds 3. Those reps go to the sets that still have room, never past the top of the rep
range for that set.
If you rated only the first set, that set decides instead.
If you rated nothing, it adds 1 rep.

NOT RUNNING YET. These rules are written and tested, and no part of the app runs them, so
none of them can happen on your phone today.
The rule for earning a heavier weight: two sessions in a row at the top of the rep range,
or one session so much better than the last that it cannot be an ordinary good day.
The rule that holds a weight after two first sets where you had nothing left, until a
first set leaves you at least one rep.
The rule that flags a lift after three sessions in a row that did not beat the one
before, out of the last five, and offers to lighten the weight if the weight is already
held or your recovery score is low.
The rule for adding sets, which needs the app's own check on your data, a confirmation
seven days later, and a predicted gain big enough that research could tell it apart from
nothing.

WHAT THIS MEANS TODAY: you change the weights yourself. The workout card will tell you
how far you are from earning a heavier one, and that counter does not move on its own
yet.

## WHEN IT HOLDS OR MOVES CALORIES

LIVE ON YOUR PHONE.
Your calorie number comes from your food logs, your weight change and how fast you said
you want to lose, and it never goes below a floor.
That floor is worked out as 25 calories for every kilogram of the part of you the app
thinks is not fat, plus what it thinks your training burns, rounded to the nearest 50.
The 25 is the app's own convention, not a measurement of you: the code says so in its own
words, and says it comes from three single-person case reports and that the sport's own
governing body declines to set any threshold at all. If you want that number to be
something else, it is yours to set.
If your lifts are falling while you are still losing weight, the app steps your calories
back up toward the number that holds your weight steady. If the fall is steep, it steps
all the way there at once instead of easing.

LIVE, BUT ONLY AS A STATUS WORD.
The part that offers to change your calories holds back and offers nothing at all if your
last weigh-in is 3 or more days old, if the scale is too noisy to tell whether you are
off target, or if the change would be under 90 calories a day. You will see it say it is
holding. Accepting a change is not wired in yet, so no calorie change is ever applied for
you.

## WHEN IT ASKS YOU SOMETHING

LIVE ON YOUR PHONE. The recovery check-in.
It asks how long you slept and how the sleep was, your energy now, muscle soreness now,
stress now, and whether anything else is affecting today: pain, feeling ill, or time
away.
Saying mild or significant soreness, or ticking pain, illness or time away, opens a few
follow-up questions about that one thing.
It saves once a day on this phone. Tomorrow's sheet starts blank, and yesterday's is
never shown as today's.
If the sleep screen already has last night on file, the check-in offers it back for you
to confirm instead of asking again.

NOT RUNNING YET. The talking coach. It is built and tested: it records nothing and
changes nothing without your spoken yes, and it can only offer a change the app worked
out itself. It is not on your phone, so nothing asks you for a yes today. You tap Save.

## WHEN IT SAYS IT DOES NOT KNOW

LIVE ON YOUR PHONE.
A check-in question you skip stays skipped. "None" is an answer you gave; silence is not,
and the app never turns silence into a zero.
Before it has enough weigh-ins to measure how fast you are losing, it shows you nothing
rather than a guess. Be aware of what it does underneath: it holds a placeholder of 1.0
pounds a week, flagged as not measured, and keeps it off your screen. Nothing is shown,
but something is stored.
If there is no earlier session it can fairly compare to, it says so instead of inventing
a comparison.
Before it has enough food logs to work out what holds your weight steady, it prices your
calories at 12 per pound of your trend weight, takes off the amount you want to be under,
and applies the floor. It labels that as an estimate.
With no weight on file at all, it gives no calorie target and says why.

NOT RUNNING YET. The coach's rule that every number it says must come from a tool result
in the same conversation.

## WHAT IT RECORDS TODAY AND THEN IGNORES

LIVE ON YOUR PHONE, AND THIS IS THE GAP.
The check-in records SEVEN things and the plan uses NONE of them: how the sleep was,
energy, soreness, stress, pain, illness and time away. It saves them, it shows them back
to you word for word, and it tells you so on the screen: "Your plan is unchanged: nothing
in this check-in reaches a training rule yet."
The one exception is sleep LENGTH: you can carry those hours onto the sleep screen by
tapping "Use these hours", and the sleep screen is read by the rest of the app.
So: you can tell Earned your knee hurts, or that you were away eight days, and tomorrow's
workout will be exactly what it would have been.

NOT POSSIBLE AT ALL TODAY.
There is no way to tell the app a machine was taken. The coach has a tool for it that
refuses by name, and the check-in has no question for it. So it cannot give you a
replacement exercise, because there is nothing to give it a reason to.

### DECISIONS ONLY YOU CAN MAKE

These three are about rules that exist. The six questions that follow them, in your own
order, are about the gap above, and those are the ones that become the re-plan spec.

- Should the rep step be the same for a beginner and for someone experienced, or
  different? Right now it is the same for both, and it never looks at how long you have
  been training.
- When you record pain against a movement, what should the app DO: only record it, as
  today; skip that one exercise for the day and say so; or ease that one exercise and say
  so? The app names no cause and recommends no treatment in any of these.
- The 90-calorie cutoff below which it offers no change is a bare number in the code with
  nothing behind it. Keep it, change it, or require more evidence before any change is
  offered? Note that nothing applies a calorie change for you today, so this one changes
  nothing you can see until the accept step is wired in.

-----------------------------------------------------------------------

## 8. DRAFTED QUESTIONS FOR THE RE-PLAN SPEC

In his order: time away, then equipment, then pain. Six questions. Each option says what
it makes the app do, in one sentence. The option I recommend is listed FIRST and marked.
None asks him to decide a medical matter. None invents a number the research file does
not carry; where a number would be needed, the question says which file would have to
supply it (the precedent is DECISIONS:561 point 6, which closed the fat floor on exactly
that rule).

### TIME AWAY (first)

Q1. After a break from training, what should your first session back look like?
- (A, RECOMMENDED) Same exercises, lower rep targets for the first session back, and the
  app climbs again from whatever that session says. The app already knows how to start a
  line from one session (`rebuild/engine/progression.cjs:32`), so this reuses a rule that
  is written and tested.
- (B) Exactly the same targets as before the break, with a sentence saying the first week
  back is a rebuild. The app changes nothing and only changes its words.
- (C) Nothing at all until you say so. The app keeps recording your days away and the
  plan ignores them, which is what it does now.

Q2. How long a break counts as a break?
- (A, RECOMMENDED) The app asks you once, the first time it happens, and remembers your
  answer. Nothing is invented and no research number is needed.
- (B) A fixed number of days, the same for everyone. This needs a number, and no file in
  the project carries one today: `rebuild/research-brief.md` (or whichever research file
  you name as the corpus) would have to supply it before the app may print it.
- (C) Any gap at all, however short, counts. The app treats a single missed week and a
  single missed day the same way, which will feel wrong quickly.

### EQUIPMENT (second)

Q3. When a machine you need is taken, what should the app do?
- (A, RECOMMENDED) Show you the other lifts the app already files under the same muscle
  and let you pick one for today. The app's exercise list already groups lifts that way
  (`rebuild/m3/w7-preview/today/exercise-catalogue.mjs`, the same grouping
  `rebuild/engine/volume.cjs:74` counts sets by), so this picks from a list that exists
  rather than inventing a swap.
- (B) Pick one for you automatically and say which and why. Faster, but the app chooses
  for you and can pick something you cannot do that day.
- (C) Record it and change nothing, and add a question for it to the check-in. You would
  at least be able to TELL it, which you cannot today.

Q4. Where should that swap be offered?
- (A, RECOMMENDED) On the workout card, at the lift, while you are standing there. It is
  where you find out, and the card is already the screen that prescribes.
- (B) In the check-in before the session. You plan ahead, but you have to know in advance
  which machine will be busy.
- (C) Both. More work to build, and two places to keep in step.

### PAIN (third, and most carefully)

Q5. When you record pain against a movement, what should the app do to that one exercise?
- (A, RECOMMENDED) Skip that one exercise for the day and say so plainly. The rest of the
  session is untouched, and the app names no cause and recommends no treatment.
- (B) Keep the exercise but ease it, with fewer sets or the same weight and fewer reps,
  and say so.
- (C) Only record it, as today, and show it back to you.

Q6. How long should a recorded pain answer stay in force?
- (A, RECOMMENDED) That day only. It asks again at the next check-in, so nothing is
  carried forward without you saying it again, which is the same rule the check-in
  already keeps (`rebuild/m3/w7-preview/today/checkin-model.mjs:264`).
- (B) Until you say it is better. Fewer taps, but a forgotten answer quietly keeps an
  exercise off your plan.
- (C) A fixed number of days. This needs a number, and no file in the project carries
  one; the research file would have to supply it first.

---

## NOT VERIFIED IN THIS PASS

I did not run any test suite, any engine writer, the seal generator or `b-package.cjs`.
Nothing was executed. Every claim above is source and test inspection, plus fifty line
reads of `tools/engine-test.jsx` on the owner's PC, read only.

I did not verify that the shipped bundle on the owner's phone is built from this branch's
`build.mjs` list at the moment he opens it; I verified the list.

I did not trace what the SETUP lane hands `adoptBasis`
(`rebuild/m3/w7-preview/today/today-model.cjs:159`) for a brand new athlete, so I cannot
say what history a first-run athlete's Today screen computes from. That does not change
any row above: none of them turns on it.

No person's measurements appear anywhere in this file.
