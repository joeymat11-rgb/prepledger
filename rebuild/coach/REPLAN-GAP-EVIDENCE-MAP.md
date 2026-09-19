# RE-PLAN GAP: EVIDENCE MAP

Source inspection, 2026-09-19, at 7a6ffa45 on rebuild/c-replan-evidence; no product changes or test runs.
This maps repository evidence and behavior, not advice about anyone's health; no personal measurements or numerical examples appear here.
Numbers below are published-study summaries or code constants, never a proposed prescription.
The no-invented-number rule is explicit at `rebuild/DECISIONS.md:561` (6); code containing a number is not scientific support for applying it to a new problem (`research-brief.md:19-20,419-422`).
The named order and queue position come from this assignment: the cited `DECISIONS.md:578` is blank in this checkout, so I cannot independently cite that event.

Reading key: E = `rebuild/engine/`; P = `rebuild/m3/w7-preview/today/`; W = `rebuild/m4/workout/`; C = `rebuild/coach/`; all abbreviated citations below expand against those exact paths.
D2 = `rebuild/lanes/d2/reviews/science-audit/`; owner-choice references expand to `rebuild/lanes/astra/SCIENCE-OWNER-CHOICES.md`, and DECISIONS references to `rebuild/DECISIONS.md`.
EW2 = `refs/remotes/origin/rebuild/d2-ew2-spec:rebuild/lanes/d2/EW2-SPEC.md`, read with git show at f89ce33fba3e63c2eb9a191e1737de588a64ebec; it is a spec, not proof of shipped screens (`EW2:3-6,482-485`).
"Phone" means the static Today entry/build path in this checkout, not an inspected deployed bundle; "not reached" means no call found on that path, not that a module cannot run in a test.
Tests named below were read, not executed; a passing software test would not validate a scientific claim.
The legacy test file tools/engine-test.jsx is redirected to the extracted engine by `E/test/second-gate.mjs:12,97-98,109-110`; that runner was not invoked.
SILENT means no supporting rule located in the inspected repository corpus, not that the world's literature has no answer.

Shared reachability finding: the checker's eleven direct Today calls are supported by `P/today-model.cjs:125-138,235,247`, `P/food-model.cjs:94`, `P/sleep-model.cjs:170` and `P/today-app.cjs:1772`: nowModel, statusFace, currentRate, calorieTarget, proteinTarget, marchingOrder, readRecency, genSession, sleepSpanH, applyRead and writeDaily.
That is not the whole transitive engine surface: the workout runtime also exposes genSession, rirPlan, dayWeather, cleanAtDate and sessionMembership (`W/engine-runtime.cjs:38-40,68-78`); `W/engine-capture.cjs:52,61` calls genSession and rirPlan.
The phone records new workouts through the native facts projection (`P/gym-model.mjs:201-217`), not completeSession; its public model methods are listed at `P/gym-model.mjs:579-586`.
The coach screen is explicitly a stub (`P/today-app.cjs:2357-2358`); coach tools below describe available module behavior, not a live phone conversation.

## TIME AWAY

### 1. WHAT THE CORPUS CARRIES

The corpus carries adjacent evidence, not a return-after-absence prescription:

- `research-brief.md:114-118` reports Bickel 2011: 16 weeks training then 32 weeks reduced dose, with one-ninth volume (one day/week, one set/exercise) and one-third retaining size in young adults but neither in older adults; its own warning is "do not generalise across age"; its 2-5 maintenance versus 9-18 growth weekly-set synthesis is not a return-after-absence protocol.
- D2 narrows this to reduced dosing/detraining, not trained people dieting, and records "Abstract read; full text/supplement not read" (`rebuild/lanes/d2/reviews/science-audit/SOURCES.md:45-47`); lane E likewise distinguishes the study population (`rebuild/lanes/e/science-audit/SOURCES.md:115-119`).
- `research-brief.md:305-309` rejects a post-cut rebound claim and distinguishes training through a deficit from detraining; its Rahmati/myonuclei statement supplies no loss-per-day or return-dose rule.
- Planned deloads: "Zero positive RCTs" is the brief's wording (`research-brief.md:397-400`); `RESEARCH-DESIGN.md:623,695` goes further, rejecting scheduled and autoregulated deloads.
- D2 corrects the inference: Coleman tested one week of complete cessation, not a symptom-guided reduction or this engine's 5% reset, and "Nonsignificance does not prove equivalent responses" (`rebuild/lanes/d2/reviews/science-audit/SOURCES.md:69-71`; `D2/CLAIMS.md:80`).
- SILENT on a usable strength/size loss curve by days absent, a duration threshold for replanning, a return load/volume percentage, or a number of sessions to regain the prior line; the adjacent studies above cannot supply those missing rules.
- A diet break is a different intervention: maintenance eating and adherence evidence (`research-brief.md:311-314`), not time away from lifting; the owner's approved diet-break counts are explicitly "product choices, not clinical thresholds" (`rebuild/lanes/astra/SCIENCE-OWNER-CHOICES.md:7`; approval `rebuild/DECISIONS.md:431`).

### 2. WHAT THE ENGINE ALREADY HAS

| Function or path | Actual rule and constants | Phone reach; old/new history; existing test |
|---|---|---|
| `resetForksOf`, `forksOf`, `eraIdx`, `sameEra`, `eraFresh`, `forkFrom`, `forkExposures` (`E/plan.cjs:25-55,291-337`) | A dated technique/reset fork creates an era; context/split seams do not make a fresh training baseline; a prior session in the era ends freshness; there is no elapsed-absence threshold. `forkExposures` counts from the later fork/calibration date. | Era predicates reached via targets; `eraFresh` reads NEW registered facts plus legacy members, or OLD sessionLog without a native view; `forkExposures` remains OLD sessionLog, with no phone caller found. `W/test/native-next-targets.test.cjs:326-331` pins fresh/nonfresh native eras; dedicated exposure-reader test not located. |
| `progressStep`, `progressAnchor`, `governingLast`, `governingMeta`, `_rowsFor`, `_governingRows` (`E/progression.cjs:19-174`) | Fresh era returns add=0; it does NOT lower the last line. Anchor seeks same era/load and unrushed performance, then falls back to the governing baseline. Normal effort-based steps remain +1/+2/+3 (`:43-53`). | Reached by genSession; NEW facts when registered, OLD caches/sessionLog otherwise; `W/test/native-next-targets.test.cjs:153,191,321-331` covers changes, holes and eras. |
| `targetsFor` (`E/progression.cjs:261-305`) | Authored std precedes reclaim, both precede ordinary progression; resize by truncating or padding one below the last slot, minimum 1. No last line uses first or hi-2, minimum 1. No gap-duration branch. | Reached; NEW/OLD governing read; tests `W/test/native-next-targets.test.cjs:318-330`. A technique-era zero step does not override an authored standard. |
| `_resetAfter` / `_governingRows` (`E/progression.cjs:93-118`) | With last=null and a dated RESET APPLIED receipt, pre-reset rows cannot resurrect the line; a same-date row refuses with PROGRESSION_RESET_MAPPING_REQUIRED. | Reached when a reset already exists in the input; NEW registered history; tests `W/test/native-next-targets.test.cjs:333-339`. This reads a reset, it does not decide to make one. |
| `completeSession` standard/reclaim/era branches (`E/writers.cjs:243-307`) | A first technique-era completion retires reclaim/std/own; otherwise std+own and reclaim require every authored slot, clear on success and may queue an unlock/debut; it is not a days-away detector. | Writer not reached by phone; OLD exercise state and sessionLog writer (`:401`), not a workoutFacts completion writer; era reader inside it can inspect NEW facts. Tests `tools/engine-test.jsx:9393,9460-9467` and `W/test/native-next-targets.test.cjs:318-339` pin era retirement/targets, not a phone completion. |
| `_loadTenure`, `progressionSetCount`, `_deriveSightingFull`, `deriveSighting` (`E/progression.cjs:188-212,436-479,608-653`) | Follow the current-load tenure and era; sighting reconstruction skips the era's first day and already-spent earn day and rejects incomplete historical set counts; no absence clock resets a sighting. | Tenure/count reached by targets; no phone sighting-reconstruction caller found; NEW or OLD history according to registered view. `W/test/native-next-targets.test.cjs:323-331` covers count/era; full native sighting-reconstruction test not located. |
| `liftTrend`, `progressionTrend`, `performedTrendObservation` (`E/progression.cjs:682-747,775-792`; `E/performed.cjs:207-216`) | Same-era observations, new window on recorded set-count change; default last 6 observations, minimum 4, rather than a calendar-gap expiry (`E/constants.cjs:101-104`). | Reached by Today's trend/policy readers; NEW facts or OLD sessionLog; typed unresolved/no-performance states refuse. Related native parity/target tests are not proof of a detraining trigger; no elapsed-absence test found. |
| `liftCall` -> `deloadLoad` (`E/sleep.cjs:50-76,117-142`; `E/progression.cjs:394-402`) | Last 5 sessions; 3 consecutive non-increases require at least 4 eligible sessions; exclude hard/rushed/short-sleep days. RED alarm precedes reset/rebuild; a reset receipt within 14 days yields REBUILD. Otherwise a stall plus holdFlag or non-GREEN recovery permits RESET. Default load fraction 0.95; nearest lower rack rung, or multiples of 5 with floor 5; lowest rung stays put. | Not found on phone call path; OLD sessionLog, sleep, feed and flags, not new away answers. Tests `tools/engine-test.jsx:2868-2872,3093-3097`. The "old numbers usually fall within three sessions" at `E/sleep.cjs:122` is unsupported return-time copy, not corpus evidence. |
| `sweepStalls`, `applyAgentProposal` reset arm (`E/writers.cjs:1534-1546,2314-2354`) | Offer only for active numeric lifts with RESET/newW; suppress existing offers or reset receipts in first 40 feed rows; acceptance changes w/wSets, stamps wAt, clears last and adds a reset receipt. | Neither writer reached by phone; OLD proposal/exercise/feed state; `tools/engine-test.jsx:2307-2314` covers filing; the native reset reader test above covers subsequent interpretation, not acceptance. |
| `dietBreakHonest`, `dietBreakState`, `phaseProposal` (`E/policy.cjs:509-519,630-674`); `BREAK_LEN_DAYS`, `BREAK_RECENT_DAYS` (`E/constants.cjs:303,306`) | 7-day maintenance-eating break and 10-day recent label; no lifting-absence prescription. | Diet-break reading can be reached through Today policy; coach phase proposal is module-only and acceptance is not a phone writer. OLD nutrition/energy/sleep state; `tools/engine-test.jsx:6137-6160` concerns diet breaks, not detraining. |

No function or constant located translates away_days, missed lifting days, or a reported absence into a new era, reclaim target, load or volume reduction; the relevant branches above depend on recorded protocol/effort/stall state, while the coach explicitly refuses time-away replanning (`C/tools.cjs:779-810`).

### 3. WHAT THE PHONE RECORDS AND WHO READS IT

- Selecting Time away opens "About how many days away from training?" and "What was the reason?" (`P/checkin-model.mjs:65-77,146-147`); the sheet accepts nonnegative whole days and optional reason (`:181-187`), not a dated absence interval or confirmed return date.
- The command stores away_days as `{value, unit:"day"}`, away_reason as text, and "away" in issues (`P/checkin-commands.cjs:50-59,76-93,114`); its raw quantity validator accepts any finite nonnegative number, while the sheet supplies the whole-day restriction (`:79`; `P/checkin-model.mjs:184`). These are input-shape rules, not detraining thresholds.
- Storage is a schema-2 event fact with profile earned/recovery-checkin/v1, in the shared encrypted local operation store (`P/checkin-commands.cjs:34,143,158-163`; `P/checkin-host.mjs:11-15,43-50`); read-back filters `generation.collections.ops` and returns payload.answers (`rebuild/m3/w6/local/today-bindings.mjs:572-606`).
- The sheet reads only today's row, refuses a second save, and says the plan is unchanged (`P/checkin-model.mjs:264-267,285,301`); away read-back is at `:222-223`.
- Outside the sheet, `today_checkin` reads its lines and `time_away` writes through the same draft after confirmed=true (`C/tools.cjs:594-610,628-631,659-683,705-712`); request_replan refuses this fact (`:779-810`); tests `C/test/local-era.test.cjs:144` and `C/test/tiers.test.cjs:214` cover those module paths.
- Import replay recognizes the check-in but explicitly retains it with "no evidence role" and "never projected" (`rebuild/m4/import/replay-registry.cjs:76-81`); no training reader of away_days/away_reason was located in the inspected product files.
- EW2 does not already provide a day-drop screen: its Days door is deferred to v1.1 (`EW2:455-461`); per-exercise edits/removals are specified, effective tomorrow (`EW2:449,468-470,587-595`), not a same-day return plan.

### 4. THE BEHAVIORS THAT NEED NO NEW NUMBER

- Ask the existing days/reason follow-ups and show exactly what was recorded, without estimating lost strength (`P/checkin-model.mjs:65-66,181-187,222-223`).
- Ask whether the athlete wants to review the first session, keeping targets unchanged until an authorized action exists, as the present unchanged-plan/consent boundaries already do (`P/checkin-model.mjs:39-40`; `C/VOICE-COACH-BRIEF.md:16,22`).
- Offer the athlete's own future exercise edit through the EW2 design, making tomorrow's effective date explicit rather than claiming it repairs today's workout (`EW2:449,468-470`).
- If a return also involves an actual setup change, preserve that genuine protocol boundary and label the first session a new baseline; absence alone must not be falsely recorded as a technique change (`E/plan.cjs:291-317`; `E/progression.cjs:28-32`; `E/today.cjs:193`).
- Keep unsupported comparisons unavailable instead of asserting a loss or recovery amount, following the existing comparable-performance reader (`C/tools.cjs:574-580`).

### 5. THE BEHAVIORS THAT WOULD NEED A NUMBER THE CORPUS DOES NOT CARRY

- Automatic gap trigger: needs a source linking duration and relevant training context to a return-plan decision; Bickel and Coleman provide study protocols, not this threshold (`research-brief.md:114-118`; `D2/SOURCES.md:47,71`).
- Percentage load/volume cut or lower return rep target: needs a return-to-resistance-training intervention or validated decision rule; the existing 0.95 stall reset is neither (`E/progression.cjs:394`; `D2/CLAIMS.md:80`).
- Lost-strength/size estimate and regain countdown: need longitudinal detraining/retraining data with uncertainty and applicable populations; neither the brief's muscle-memory discussion nor the engine's three-session copy supplies that (`research-brief.md:305-309`; `E/sleep.cjs:122`).
- An automatic rebuild ramp or expiry period needs return-protocol evidence, not rep steps borrowed from ordinary progression or the diet-break clock (`E/progression.cjs:43-53`; `E/constants.cjs:303-306`).

## EQUIPMENT

### 1. WHAT THE CORPUS CARRIES

- Machine/free-weight hypertrophy: the brief reports Haugen 2023, 13 RCTs, SMD -0.055, CI -0.397 to 0.287, p=0.751 (`research-brief.md:401-403`); this is a nonsignificant group comparison, not proof that two exercises or their loads are interchangeable.
- Exercise selection can matter within a muscle: standing/seated calf, overhead/pushdown triceps and seated/lying ham-curl comparisons are distinguished by loaded muscle length (`research-brief.md:135-146`), so a shared muscle label cannot certify equivalent training.
- The corpus counts direct sets as 1 and indirect sets as 0.5, and separates trained heads (`research-brief.md:88-100`); these are accounting rules, not a transfer ratio between exercises.
- The audit explicitly warns "A nonsignificant comparison is not equivalence or proof of no effect" (`rebuild/lanes/astra/SCIENCE-AUDIT-GO.md:16`); D2 retains that qualification (`rebuild/lanes/d2/reviews/SCIENCE-AUDIT-REVIEW.md:19`).
- SILENT on a validated substitution matrix, a machine-to-free-weight load conversion, how much progress transfers to another lift, or automatic ranking of available replacements; the cited selection and hypertrophy findings supply none of those quantities.

### 2. WHAT THE ENGINE ALREADY HAS

| Function or path | Actual rule and constants | Phone reach; old/new history; existing test |
|---|---|---|
| `loadRungs`, `nextLoad`, `prevLoad`, `snapLoad`, `deloadLoad`, `parseRungs` (`E/progression.cjs:346-408`) | Use authored positive sorted rungs/inc; missing next/previous load stays null; snap rounds down within available rungs; reset uses the 0.95/5 rules above; parseRungs requires at least 2 input values. | Load readers reached by prescription; no missing-equipment reporter or substitute selector; reads exercise settings, not OLD/NEW workout facts. Tests `tools/engine-test.jsx:3093-3097`; no equipment-to-substitution test found. |
| `maxedOut`, `debutDebit`, `repsLostOnJump`, `windowFor`, `coarseLifts` (`E/progression.cjs:177-179,353-355,412-432`; `E/volume.cjs:26-28`) | Same-lift load mechanics: no next rung means maxed; debut debit is at least 1, rounded percent increase divided by 5; predicted rep loss=(hi+30)*step/(load+step), window width=ceil(loss)+1, minimum lower bound=1, tight when jump>10%; fallback lower bound=max(1,(hi or 8)-2). | Prescription reaches load/debut/window readers; coarseLifts is an auxiliary equipment-step report, no phone caller found; exercise settings, neither history format. Native debut test `W/test/native-next-targets.test.cjs:340-350`; none validates transfer to a different exercise. Corpus calls window width "derived, not cited" (`research-brief.md:265-272`). |
| `proposeLadder` (`E/progression.cjs:310-342`), `LADDER_MIN_N=4` (`E/constants.cjs:44`) | Collects OLD sessionLog loads plus the current working load, tests uneven gaps against inc with tolerance 1e-6, proposes a rack; this is a load ladder for one lift, not a replacement exercise. | Coach module exposes it (`C/tools.cjs:797-800`), not phone acceptance; `tools/engine-test.jsx:5202` tests too few observed loads. |
| `sweepLadders`, `sweepLab`, `applyProposal` ladder arm (`E/writers.cjs:129-149,1565-1567,2197-2208`) | File one ladder offer per lift/rid; accepting stores the rung list and snaps the existing working load, not the exercise identity; no availability report drives it. | Writers not reached by phone; OLD proposal/exercise/log state; related ladder tests `tools/engine-test.jsx:5202-5218`, not a swap test. |
| `SELECTION_AUDIT`, `exerciseSelection` (`E/writers.cjs:1293-1317`) | Three fixed legacy exercise ids and setup-string tests for knee/hip angle; calf effect text 0.88-1.58, ham/extension qualitative; no inventory, availability input or general substitution search. | Not found on phone path; exercise setup only, neither history format; `tools/engine-test.jsx:4063-4072` covers all-good and changed calf setup. |
| `volBucket`, `programmeVolume`, `muscleVolume` (`E/volume.cjs:35-57,62-94`) | Muscle/head buckets and indirect accounting describe dose; muscleVolume counts 0-7/7-14-day OLD sessions and old soreness; they do not establish exercise equivalence. | Not a reachable swap producer; designed plan vs OLD recorded volume respectively; `E/test/volume-projection.cjs:4-18` and `E/test/volume-reference.cjs:2-4` are parity/reference helpers, not transfer validation (`D2/CLAIMS.md:59`). |
| `nameAt`, `exActive`, `_sessionPool`, `sessionMembership` (`E/plan.cjs:59-70,87-97`; `E/today.cjs:68-87`) | Rename history is separate from technique history; retired lifts leave the active pool while records remain; membership reads current dated programme/order. | Reached through prescription/membership; neither estimates transfer from OLD nor NEW performance; same-era/load anchor tests `W/test/configuration-capture.test.cjs:34` and `W/test/native-next-targets.test.cjs:321-325`. |
| `performedLine`, `performedLoadMatches`, `governingLast`, `progressAnchor` (`E/performed.cjs:218-254`; `E/progression.cjs:65-174`) | NEW typed slots preserve exact lift lineage/load domain; skipped/unlogged/removed/unresolved original slots end the contiguous line, never become zero or another lift's performance; matching is by set position, not average load. | Reached by phone target/comparison readers; OLD path uses id/w or wKey; `W/test/native-next-targets.test.cjs:191,310` and `W/test/configuration-capture.test.cjs:34`. |
| `sessionFromDraft`, `mergeSessionDrafts`, `backLift`, `gymEntries`, `completeSession` skip storage (`E/writers.cjs:154,2698-2776,401`) | Legacy draft/skip bookkeeping distinguishes performed and unperformed lifts; final merge alone infers unreached skips; previous-lift navigation clears that lift's skip. | Not the phone's native command flow; OLD draft/sessionLog; `tools/engine-test.jsx:2205,2267` pins stored skips; these routines are not an equipment-aware replan. |

The useful replacement writer is OUTSIDE E: `W/plan-edit-model.cjs:339-365` retires the old id, adds a new id with w=null/forks=[], retains old exercise/history, and copies no prior load to the replacement; command update fields are n/day/sets/hi/inc/steps, not working load (`W/plan-edit-commands.cjs:45-79`).
Tests explicitly pin retained history, rename without a technique fork, and replacement without borrowed load/history (`rebuild/lanes/d/plan-edit/model.test.cjs:133-155`); those model tests do not prove a phone editor is wired.
There is no located engine exercise-swap/substitution/availability producer; `applySuggestion`'s progression case only records a target flag (`E/writers.cjs:2284`), and the coach's closed producer list contains volume/phase/ladder only (`C/tools.cjs:779-802`).

### 3. WHAT THE PHONE RECORDS AND WHO READS IT

- The recovery sheet has no equipment field (`P/checkin-commands.cjs:41-59`); the coach's confirmed equipment_unavailable_today still returns COACH_FACT_COMMAND_ABSENT and request_replan refuses equipment (`C/tools.cjs:738-745,805-810`); tests `C/test/tiers.test.cjs:256` and `C/test/local-era.test.cjs:196` pin the refusal.
- Important limit on "no field anywhere": a separate workout command panel offers "Equipment unavailable" as a SET-skip reason and executes skip with reason (`W/command-panel.mjs:92-96,274-275`); the command is a session-skip with optional payload reason (`W/commands.cjs:45`), folded into native skip state (`W/engine-history.cjs:104`).
- That is not a live phone equipment question: Today's entry mounts mountGym (`P/today-entry.mjs:218`), whose model exports no skip method (`P/gym-model.mjs:579-586`), and gym-app calls skip a future wired state (`P/gym-app.mjs:452,558`); the separate prepared panel mounts the command panel (`W/prepared-panel.mjs:271`). No phone route to that separate panel was found.
- The broad checker/tool wording should therefore narrow to "no structured equipment-availability fact or phone replanning route"; the reusable skip command is real but does not produce an alternate (`C/COACHING-POLICY-AS-BUILT-CHECK.md:260-270`; paths above).
- EW2's manual replacement is a future programme edit, starts TOMORROW, and promises "The new exercise starts without a recorded load. Your old sessions stay in your history" (`EW2:468-470,645`); it also permits add/remove/update and machine notes, while day dropping is deferred (`EW2:449-462,587-595`).
- The catalogue has candidates, not certified equivalents: it labels muscle assignment, names and some lend fractions INVENTED (`P/exercise-catalogue.mjs:19-35`); use it as a picker, not scientific authority for an automatic substitution.

### 4. THE BEHAVIORS THAT NEED NO NEW NUMBER

- Offer athlete-chosen replacement from the catalogue through the manual edit design, without claiming equal effect or converting the old working load (`P/exercise-catalogue.mjs:30-35`; `W/plan-edit-model.cjs:345-364`; `EW2:645`).
- Preserve the original lift's history and start a replacement under a distinct id with no recorded load, as the existing plan-edit writer already does (`W/plan-edit-model.cjs:346-364`).
- Offer an explicit set skip with the athlete's equipment reason through the existing command, once a phone control is wired, without filling the missing performance with zero (`W/command-panel.mjs:274-275`; `E/performed.cjs:218-237`).
- Show a comparison only when lift lineage, load and era qualify, retaining the unavailable state otherwise (`E/progression.cjs:65-174`; `C/tools.cjs:574-580`).
- Ask whether a requested change is for this workout or future workouts before routing it, because existing skip and tomorrow-effective replacement have different scopes (`W/commands.cjs:45`; `EW2:468-470`).

### 5. THE BEHAVIORS THAT WOULD NEED A NUMBER THE CORPUS DOES NOT CARRY

- Automatic load conversion or inherited progress needs exercise/equipment-specific transfer and calibration evidence; a nonsignificant hypertrophy comparison is not that evidence (`research-brief.md:401-403`; `W/plan-edit-model.cjs:347`).
- "Equivalent stimulus" set/rep compensation needs substitution trials and a valid dose comparison for the actual movements; muscle buckets/indirect fractions alone cannot supply it (`research-brief.md:88-100,135-146`).
- Numerical replacement rankings or guaranteed outcome similarity need validated exercise-specific estimates with uncertainty; the current catalogue explicitly supplies authored classifications instead (`P/exercise-catalogue.mjs:19-35`).

## PAIN

### 1. WHAT THE CORPUS CARRIES

- Soreness is not pain diagnosis: "Soreness is a valid load readout and an invalid readiness predictor" (`research-brief.md:349-354`); the soreness item remained but the two-sore-mornings volume block was deleted (`research-brief.md:328`).
- The brief says soreness correlates poorly with strength loss and that no trial there shows sore-muscle training impairs adaptation (`research-brief.md:350-353`); this does not establish that training through reported pain is safe.
- E draws that exact boundary: "No conclusion here says sleep does not matter or that a person should train through pain" (`rebuild/lanes/e/science-audit/CLAIMS.md:114`).
- D2 says: "Relevant health restrictions need appropriate human handling when present, not invented numerical screening cutoffs" (`rebuild/lanes/d2/reviews/science-audit/CLAIMS.md:111`); the same line says this is not permission for a new medical form or collection.
- The product boundary is explicit: "no medical advice" and "PAIN AND SORENESS handled through the recovery check-in; plain statement that it is not a doctor" (`rebuild/coach/COACH-EXPERIENCE-BRIEF.md:5,33`).
- SILENT on a pain-score action threshold, a pain-specific load/rep/set reduction, a recovery timer, diagnosis, treatment, or clearance to resume; existing symptom questions are not evidence for any of these rules.

### 2. WHAT THE ENGINE ALREADY HAS

| Function or path | Actual rule and constants | Phone reach; old/new history; existing test |
|---|---|---|
| `completeSession` hold governor; `earnWalk` (`E/writers.cjs:234-238`; `E/earn.cjs:36-45`) | Two recorded opener RIR=0 ratings set holdFlag; an opener >=1 releases it; a hot opener or hold prevents automatic load earn. This is effort, NOT a pain answer. | Writer not reached by phone; OLD exercise rating history/sessionLog; `tools/engine-test.jsx:982,2808` pins hold, and `:6660` covers unrated behavior. |
| `progressStep`, `genSession`, `rirPlan` (`E/progression.cjs:19-53`; `E/today.cjs:152-155`; `E/writers.cjs:789-839`) | A stored hold keeps rep progression active; displayed hold text persists; rirPlan floors opener at 2, default terminal is 0, any alarm floors every slot at 1; >=3 known openers with a strict majority at 0 adds 1 to opener. | Readers reached by phone; rirPlan reads NEW facts or OLD sessionLog; check-in pain is absent from both branches. `W/test/engine-capture.test.cjs:62`, `W/test/native-next-targets.test.cjs:93-115`; `tools/engine-test.jsx:2902-2904`. Owner's proposed final-set default is separately approved, not proof this code changed (`SCIENCE-OWNER-CHOICES.md:6`; `DECISIONS.md:431`). |
| `liftCall`, `sweepStalls`, `applyAgentProposal` | See TIME AWAY table: local variable pain9 is exactly holdFlag, not pain_location/pain_impact (`E/sleep.cjs:134-137`); no injury diagnosis is implemented by that name. | OLD-history reset path, no phone reset writer; `tools/engine-test.jsx:2868-2872` actually plants a governor flag. |
| `completeSession` niggles, `sessionDebrief`, `recoveryIndex` (`E/writers.cjs:397-416,771`; `E/sleep.cjs:218,249-274`) | OLD niggles array: >=3 flags for a joint inside 21 days emits informational feed text, deduped within 14 days; recovery counts flags within 14 days at 7 points each, capped 21; score GREEN>=80, WATCH>=55. These are existing coded heuristics, not corpus pain thresholds. | No new check-in-to-niggles bridge found; OLD sessionLog; informational writer not phone-reached. `tools/engine-test.jsx:995,1860` covers feed/watch-list text, not pain triage. |
| `muscleVolume`, `sweepVolume`, `volumePush`, `volumeConversion`, `runAdaptive` (`E/volume.cjs:38-57,220-268`; `E/writers.cjs:1412-1417,1449-1500,1615,1909`) | Old soreness count is a 7-day read; explicit soreness subtraction is disabled, but a <=1 sore-morning condition remains on the in-band add door (`:1484`). Held lifts are excluded from volumePush. Conversion subtract needs added sets plus falling trend plus one of: >=TREND_MIN_SESSIONS+2 observations, holdFlag, or recovery below GREEN; minimum trend count=4; delivery majority=0.5; review days=14/56/84 (`E/constants.cjs:104,365-374`). | Adaptive writers not reached by phone; conversion mixes OLD set-change/effort rows with liftTrend's NEW-capable trend reader; none reads check-in soreness/pain. `tools/engine-test.jsx:6467-6471` pins held-but-not-falling exclusion; no complete check-in-driven test found. |
| `bodyAlarmSignal`, `bodyAlarm` (`E/sleep.cjs:1625-1695`) | Legacy pulse/sleep/steps/weight anomaly signal, not reported pain/illness: pulse spike>=7, partial>=4 after prior>=7; RED at >=10, repeated>=7 or sleep<6; patterns require >=2 hits, baselines >=8 observations over last 30, z>1.8 and weight deviation>1.6. Presentation adds action copy; none is a clinical clearance rule. | Signal is reached by phone rirPlan; no full alarm presentation route established here; OLD physiological records, not NEW workout/check-in symptoms. `W/test/native-next-targets.test.cjs:93-116` pins signal parity and preserved effort floor. |
| `pulseRead`; bodyAlarm's presentation constants (`E/sleep.cjs:1671-1686,1694-1698`) | Pulse baseline uses >=7 entries and median of last 14; copy contains 24 oz hydration, bedtime 30 minutes earlier, 6:45 next-day check, within-3 pulse exit and a third-day doctor instruction; these are coded claims, not recommendations from this map or a supported pain protocol. | Same OLD signal/presentation distinction; no phone display of this full copy established; parity test above does not validate its science. D2 flags precise hydration/eating/exit advice as unvalidated (`D2/CLAIMS.md:79`). |
| `phaseProposal` symptom sentinel (`E/policy.cjs:630-644`) | Says "A number is never clearance and never a diagnosis"; its human-medical-review wording is legacy copy, not a reusable pain escalation instruction under this assignment. | Coach-only producer, OLD nutrition/energy/sleep input; no pain follow-up persistence or timing measurement; `tools/engine-test.jsx:6160` is an adjacent diet-break/sentinel test, not a pain protocol. |

The phrase "pain speaks" in stall/volume prose therefore overstates its input: these functions read effort governor state, whereas actual reported pain is stored elsewhere (`E/sleep.cjs:134`; `E/volume.cjs:254`; `P/checkin-commands.cjs:47-59`).

### 3. WHAT THE PHONE RECORDS AND WHO READS IT

- Soreness: None/Mild/Significant; Mild/Significant opens muscle location and impact No/A little/Quite a lot/Not sure (`P/checkin-commands.cjs:44,46`; `P/checkin-model.mjs:146,171-173`).
- Pain: issue flag plus free-text location/movement, change New/Worse than before/Ongoing unchanged/Improving/Not sure, and impact No noticeable effect/I change how I move/I cannot do the movement/Not sure (`P/checkin-commands.cjs:47-52`; `P/checkin-model.mjs:61-63,175-178`); no structured affected-lift id or numerical pain score exists in this field list.
- Illness: issue flag plus "What symptoms, and when did they start?" in one free-text illness_note, not a parsed onset/severity rule (`P/checkin-model.mjs:64,180`; `P/checkin-commands.cjs:51-52`).
- Blank remains absent, cleared issues lose hidden details, and a new day has no carried answers (`P/checkin-commands.cjs:106-116`; `P/checkin-model.mjs:102-106,117-118,264-267`); tests `P/test/checkin.test.mjs:108,149,265,289` cover branches, clearing and dates.
- These use the same encrypted fact store/read-back described under TIME AWAY; after Save the sheet explicitly says "Your plan is unchanged: nothing in this check-in reaches a training rule yet" (`P/checkin-model.mjs:39-40,301`).
- `record_pain_or_soreness` records these choices after yes without scoring them, today_checkin reads them, and request_replan refuses pain (`C/tools.cjs:594-610,686-702,805-810`); no separate illness tool is exposed by answer_checkin, whose fields are sleep/energy/soreness/stress, hours and note (`:717-735`); tests `C/test/local-era.test.cjs:99` and `C/test/tiers.test.cjs:214`.
- No training consumer of pain/illness/soreness check-in fields was located; import retains the fact without projecting it (`rebuild/m4/import/replay-registry.cjs:76-81`). The sleep screen DOES read check-in sleep quality for display, and can offer entered sleep hours for a separately saved night (`P/today-app.cjs:1611-1638`; `P/sleep-commands.cjs:145-158`); "no reader outside check-in" would be too broad.
- EW2 can remove or replace a future exercise, but its tomorrow boundary and deferred Days door prevent calling that a same-day pain response (`EW2:449,455-470,645`).

### 4. THE BEHAVIORS THAT NEED NO NEW NUMBER

- Ask the existing movement/change/impact follow-ups and repeat the athlete's words without diagnosis, as the check-in already does (`P/checkin-model.mjs:61-64,175-180`; `C/tools.cjs:686-700`).
- Ask the athlete to identify the affected exercise before offering a voluntary skip, because pain_location is free text and the skip command requires a lift identity (`P/checkin-commands.cjs:51`; `W/commands.cjs:45`).
- Offer an explicitly chosen skip without prescribing a lighter dose or labelling the remaining workout safe, using the existing set/lift skip representation once a phone control is specified (`W/schema.cjs:93-94`; `E/performed.cjs:218-237`).
- Preserve skipped or unknown performance as such instead of recording failure or zero, following the native performed-line rule (`E/performed.cjs:218-237`).
- Keep the report dated and ask again rather than inferring that silence means recovery, following the check-in's next-day blank rule (`P/checkin-model.mjs:262-267`).
- Explain that existing effort holds are not responses to reported pain, since their actual input is opener RIR (`E/writers.cjs:234-238`; `E/sleep.cjs:134`).

### 5. THE BEHAVIORS THAT WOULD NEED A NUMBER THE CORPUS DOES NOT CARRY

- Pain-triggered lighter loads, fewer reps/sets or a graded return need symptom-specific intervention evidence and qualified scope review; neither soreness evidence nor the stall reset validates them (`research-brief.md:349-354`; `D2/CLAIMS.md:80,111`).
- A severity cutoff, fixed hold duration or inferred recovery date needs validated clinical evidence and governance; numbers alone would not authorize medical triage or clearance, which stays outside this assignment (`C/COACH-EXPERIENCE-BRIEF.md:5,33`; `D2/CLAIMS.md:111`).
- Recurrence-based automatic restriction needs a supported rule; the coded three-flags/three-weeks and recovery score are existing heuristics, not such evidence (`E/writers.cjs:404-416`; `E/sleep.cjs:249-274`).
- Illness-to-training reductions similarly lack a corpus rule and cannot be derived from a free-text onset answer (`P/checkin-model.mjs:64,180`; `D2/CLAIMS.md:111`).

## QUESTIONS ONLY THE OWNER CAN ANSWER

These are product choices for a future spec, not medical choices or approval to change code; options reuse the boundaries above without prescribing a new quantity.

1. After someone reports time away, should the app (A) ask whether they want to review the next workout while keeping it unchanged, or (B) only save and show the report as it does now?
2. If the athlete asks for a fresh start after time away, should the app (A) show the previous targets for their review, (B) offer to repeat the last comparable rep line without adding reps, or (C) open their manual exercise edits with a clear message that changes start tomorrow?
3. When equipment is unavailable, should the app (A) let the athlete choose a replacement from the catalogue without claiming it is equivalent, (B) offer an explicit skip, or (C) only record the problem?
4. Should an equipment replacement (A) apply only to the current workout and restore the usual plan afterwards, (B) change future workouts through Edit My Week starting tomorrow, or (C) ask each time whether the change is for today or future workouts?
5. After a pain report names an affected exercise, should the app (A) ask whether the athlete wants to skip it, leaving it unchanged until they choose, or (B) only save and show the report without offering a workout action?
6. If the athlete chooses to omit an exercise, should that choice (A) last for the current workout and be asked afresh next time, or (B) remain until the athlete explicitly changes it, with the omission shown each time?

Changes to the checker's six drafts (`C/COACHING-POLICY-AS-BUILT-CHECK.md:672-727`):

- Q1/Q2 now separate review from target treatment; removed "lower rep targets" because fresh-era add=0 preserves the baseline (`W/test/native-next-targets.test.cjs:329-330`), and removed a remembered personal day cutoff/fixed threshold because neither is a corpus-backed automatic rule (`research-brief.md:19-20`; `DECISIONS.md:561`).
- Q3 no longer treats same-muscle grouping as equivalence or offers an automatic choice; the catalogue calls those assignments authored, and the corpus distinguishes movements within a muscle (`P/exercise-catalogue.mjs:30-32`; `research-brief.md:135-146`).
- Q4 replaces placement with scope because the material blocker is today's workout versus tomorrow's programme edit, not which screen contains a button (`EW2:468-470`).
- Q5 replaces automatic skip/ease with athlete choice or record-only; no easing dose is supplied and pain is not an effort hold (`E/writers.cjs:234-238`; `P/checkin-commands.cjs:47-59`).
- Q6 governs the athlete's omission choice rather than a symptom's medical "force", removes the fixed timer, and makes a continuing omission visible instead of assuming recovery from silence (`P/checkin-model.mjs:262-267`; `D2/CLAIMS.md:111`).

## What I did not verify

I did not retrieve or re-review external papers, validate clinical claims, run tests/gates/builds, inspect a deployed phone bundle, execute a writer, or prove durable behavior by execution; test citations are source evidence only.
Corpus search/read scope: root research-brief.md and RESEARCH-DESIGN.md; named science/audit/correction/owner-choice Markdown under rebuild/lanes/astra, e and d2; matching research/science paths under rebuild; relevant coach constraints and single DECISIONS events. Study access limitations remain D2's (`rebuild/lanes/d2/reviews/science-audit/SEARCH-LIMITATIONS.md:5-9`; `D2/SOURCES.md:47,71`).
I did not infer athlete applicability, turn test fixtures into observations, or reproduce personal measurements from corpus prose; no private data, auth file, protected soak, or forbidden data path was opened.
No complete return-from-absence, equipment substitution or reported-pain-to-plan implementation/test was found on the inspected path; reuse proposals above still need a spec, an authorized writer and independent verification (`C/tools.cjs:779-810`; `P/checkin-model.mjs:39-40`).
No changed approval status is inferred for EW2 from reading its remote spec; no current DECISIONS:578 event was available locally.

## git status --porcelain and git diff --stat

Final working-tree stdout follows; git also warned that its global ignore file was inaccessible.
The new document is untracked, so git diff --stat has empty stdout; no commit or staging was performed.

```text
git status --porcelain
?? rebuild/coach/REPLAN-GAP-EVIDENCE-MAP.md

git diff --stat
```
