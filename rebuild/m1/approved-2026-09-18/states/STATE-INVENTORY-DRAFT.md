# UI STATE INVENTORY, DRAFT v1

Earned rebuild, three screens: Today, Inside the workout, Coach.
Read-only analysis of /home/claude/earned, branch rebuild/t2-client-core.
Written 2026-09-17. Nothing under /home/claude/earned was modified.

Numbers shown as placeholders: N, X, <lift>, <code>, <date>. No athlete figure is
reproduced here.

---

## 1. Method

### 1.1 Files states were derived from

Today and its sub screens
- rebuild/m3/w7-preview/today/today-model.cjs (the view DTO, the weigh-in action, the three refusal sentences)
- rebuild/m3/w7-preview/today/today-app.cjs (every rendered slot, every copy constant, the router)
- rebuild/m3/w7-preview/today/screens.template.html (the approved templates and their data-slot names)
- rebuild/m3/w7-preview/today/plain-copy.cjs (the render boundary that removes en and em dashes)
- rebuild/m3/w7-preview/today/food-model.cjs, sleep-model.cjs (refusal codes the view names)
- rebuild/m3/w7-preview/today/problem-report.cjs (the diagnostic control)

The workout
- rebuild/m3/w7-preview/today/gym-model.mjs (phases, refusals, the effort domain, the last-time line)
- rebuild/m3/w7-preview/today/gym-app.mjs (the active set, the saved set and rest, machine settings)
- rebuild/m4/workout/engine-capture.cjs (the prescription cells and their own words)
- rebuild/m4/workout/edit-values.cjs (what an effort answer may be)
- rebuild/m4/workout/engine-runtime.cjs (what the screens can reach: genSession, rirPlan, dayWeather, cleanAtDate, sessionMembership)
- rebuild/engine/today.cjs and rebuild/engine/writers.cjs (the note, held and alarm lines that travel into the capture reason cell)

The coach
- rebuild/coach/TOOL-CONTRACT.md (tiers, tools, refusal codes, the tagged value)
- rebuild/coach/coach-text.cjs (templates, intents, the blank branch)
- rebuild/coach/wave1-text.cjs and wave1-tools.cjs (the demo: plan read-back, machine settings, hands free logging)
- rebuild/coach/tools.cjs (tier 3 explanations, the traceability check, the cost cap and opt-in)
- rebuild/coach/COACH-EXPERIENCE-BRIEF.md and BRIEF-C6-VOICE-ONBOARDING.md (states that exist only in a brief)

Design specs
- rebuild/design/CLAUDE-DESIGN-BRIEF.md
- rebuild/design/CLAUDE-DESIGN-TECH-BRIEF.md

Rules
- /home/claude/work/states/COACHING-RULES-INVENTORY-v1-notes.md (LIVE and DORMANT per rule)

### 1.2 Was a pre-existing state list or a count of 98 found?

**No state count of 98 exists anywhere in the repository.** I grepped for "98"
near "state" across the whole tree excluding private paths. Every hit is
something else:

- `rebuild/lanes/c/dad-first-run/A4-REPORT.md:14`, `A4-REPORT-ANNEX.md:158`, `A4-REVIEW-ANNEX.md:123`: "98 pinned inputs" is the Today build's input pin count, not a UI state count.
- `rebuild/m4/workout/athlete-state.cjs:98` and `rebuild/DECISIONS.md:115`: a line number cited in prose.
- `rebuild/m3/CRITIQUE-OF-ASTRA-BY-COWORK.md:26`: an hours estimate.

**Pre-existing state lists that do exist**, all smaller, all from the dash sweeps
in the real browser:

| source | count | what it enumerates |
|---|---|---|
| `rebuild/m3/w7-preview/today/browser-check.mjs:414` | 11 to 12 labelled Today states | Today before a weigh-in, with a reading recorded, reloaded with a reading, with the engine's spike note, the weigh-in sheet refusing an impossible weight, Today after a real reload, Today on a genuinely new page, Why this plan, the nutrition entry, the coach entry, the recovery check-in |
| `rebuild/m3/w7-preview/today/gym-check.mjs:584` | 12 workout states | Today with a reading and a workout prepared, active set, the active set refusing an entry with no effort answer, the active set with machine settings captured, saved set, Today with the workout recorded, plus the resume guards |
| `rebuild/m3/w7-preview/today/checkin-check.mjs:384` | the check-in states walked | check-in read back after a reload, Today on a new page with the check-in recorded, check-in read back after a real process kill |
| `rebuild/slice/P1-REVIEW.md:475` and `rebuild/lanes/STATUS-ARCHIVE.md:77` | **31 screen states** | the combined figure the three browser checks report together |
| `rebuild/lanes/c/REPORT-A-PROBLEM-REPORT-ANNEX.md:196` | 576 states plus the empty one | the combinatorial space of the Report a problem diagnostic block, not screens |
| `CLAUDE-DESIGN-BRIEF.md` 4.1 to 4.9 and `CLAUDE-DESIGN-TECH-BRIEF.md` S1 to S9 | prose lists, roughly 45 named states across nine screens | a specification, not an implementation |

So the only engineering figure in the repository is **31 swept screen states**,
and the only product figure is the prose lists in the two design briefs.

### 1.3 Reading conventions used below

- **Exact copy** is given in quotes. Where the engine's own string carries an em dash, the quoted form is the one the athlete actually sees: `plain-copy.cjs:44-60` rewrites an aside dash to a colon and a numeric range dash to the word "to" before the string reaches the DOM, and refuses the string outright (code `AI_DASH_IN_UI`) in any other shape. Code identifiers such as a phase name are in backticks and are not athlete-facing copy.
- **Status** is one of: LIVE now; DORMANT (the code path exists but its input is never written on the phone, or no caller reaches it); NOT WIRED (specified in a brief, no code).
- **Rule IDs** are from COACHING-RULES-INVENTORY-v1-notes.md.

---

## 2. State tables

### 2.1 Today (T)

Today's face, the weigh-in sheet, Why this plan, the nutrition entry and the
sleep entry are one router (`today-app.cjs:2272 render`) over one phone element,
so they share one ID series.

#### Today's face

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| T-01 | First run, setup screens are the landing | Durable record holds no first-run operation and the caller declared no day; `today-app.cjs:2451`, `:384 firstRun` | Today is not painted at all; the six setup screens open | P04 | LIVE now | existing setup route (out of scope for this inventory) |
| T-02 | Today preview before setup, sample marked | `firstRun()` true and Today reached by name; `today-app.cjs:2134 sampleNote` | A line above the first figure: "Sample data. Set up your week to start your own." (`today-app.cjs:285`), plus the "Set up your week" tile (`:263`) | none | LIVE now | NEW sample-data note line; existing timeline card, Log button |
| T-03 | Enrolled, adoption of his own record pending | `canAdoptAthleteState()` true at mount; `today-app.cjs:2440`, gate in `today-model.cjs:309-320` | Calories read "Not available yet", protein slot blank, weight trend "Not available yet", exercise count falls to "No session is scheduled today.", the primary button falls back to "Log this morning's weight" | N01, N05, T02 | LIVE now | existing timeline card, state pill, Log button |
| T-04 | His week is saved, the figures are still the preview's | `setupNoteNeeded(enrolled, label, state)` true; `today-app.cjs:317`, `:2148` | A note: "Your week is saved on this device. The numbers on this screen are still the preview's sample athlete, not you. Nothing here was measured from anything you did." (`:274`) | none | LIVE now | NEW provenance note block |
| T-05 | His record could not be read | `setup.athleteState()` rejects; `today-app.cjs:86`, `:2527` | Status line: "Not everything opened: athlete state: <message>. Nothing was recorded." | none | LIVE now | existing state pill / status line |
| T-06 | The local record is not trusted (blocked) | Client face is not TRUTHFUL; `today-model.cjs:255-262`, painted `today-app.cjs:847-861` | Headline "Earned cannot show today's plan."; the why is the client's own blocked copy; every figure slot reads "Not available yet"; the primary button is disabled; the nutrition and coach entries read "Not wired yet"; the check-in marker is blank; Report a problem is still wired | none | LIVE now | existing timeline card, Log button (disabled), state pill |
| T-07 | This device has no encrypted local store | `options.readings` absent; `today-model.cjs:109` | Chrome line: "Nothing can be recorded on this device: its encrypted local store did not open." The plan still renders from the engine | none | LIVE now | existing state pill |
| T-08 | Store is durable | A reading lane is open; `today-model.cjs:110` | Chrome line: "Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash." | none | LIVE now | existing state pill |
| T-09 | Training day, weigh-in owed | `!view.hasReadToday`; `today-app.cjs:864` | Headline is the engine's instruction title; the line under it is the marching order's why or the status cause; morning line "This morning: not logged yet" (`:66`); primary button "Log this morning's weight" (`:944`) or, when the marching order's kind is `weight`, the engine's own then-text | T02, T04, R05, R06 | LIVE now | existing timeline card, Log button |
| T-10 | Training day, weigh-in done, session can open | A reading is adopted for today and the layer prepared a session | Primary button "Start <session title>" (`today-app.cjs:947`); count line "N exercises · Your set targets are ready" (`:901`) | T01, T02, T08, T14, V01, V02 | LIVE now | existing timeline card, Log button |
| T-11 | Rest day | The engine's instruction is a rest headline (for example "Rest today.") | The serif headline changes; the training block still names the next session with its relative day stamp | R04 | LIVE now | existing timeline card |
| T-12 | No session scheduled today | `view.workout.exerciseCount === null` and no unavailable reason; `today-app.cjs:899` | Count line "No session is scheduled today."; the primary button is disabled (`:960`) | V01 | LIVE now | existing timeline card |
| T-13 | Today's exercises are not available | `sessionFor()` threw; `today-model.cjs:212-214`, painted `today-app.cjs:899` | "Today's exercises are not available: <code>" where the code is the layer's own, most often `WORKOUT_PREPARATION_UNAVAILABLE` | T13, T16 | LIVE now | existing timeline card |
| T-14 | Workout in progress | Durable log has an open session for today; `gym-model.mjs:430`, read `today-app.cjs:894` | Count line ends "· Workout in progress"; primary button "Resume <title>" when the engine's stamp truly says today, otherwise "Resume today's workout" (`today-app.cjs:305-310`) | T01, T08 | LIVE now | existing timeline card, Log button |
| T-15 | Workout recorded today | A closed session for today; `gym-model.mjs:404-406` | Count line ends "· Workout recorded" (`today-app.cjs:234`); primary button "Review today's workout" (`:235`) | T09 | LIVE now | existing timeline card, Log button |
| T-16 | Today's workout cannot open | Phase `blocked` with a code; `gym-model.mjs:416` | Count line ends "· Today's workout cannot open · <code>"; primary button "Why today's workout cannot open" (`today-app.cjs:236-237`) | T13, T16 | LIVE now | existing timeline card, Log button |
| T-17 | An earlier workout was never finished | `unfinishedBefore()` found an open session from a previous day; `gym-model.mjs:306-316` | Count line ends "· An earlier workout was never finished · <date>"; primary button "Close the unfinished workout" (`today-app.cjs:238-239`) | T09 | LIVE now | existing timeline card, Log button |
| T-18 | Stored readings the plan did not use | `view.unadopted > 0`; `today-app.cjs:1024` | Status line: "This device holds N stored reading(s) the plan did not use." | N02 | LIVE now | existing state pill |
| T-19 | Gated calorie band | `calorieTarget.gated`; `today-app.cjs:54` | Calorie headline is blank, band line reads "A calorie range is not available yet." | N05, N01 | LIVE now | existing timeline card |
| T-20 | No calorie band figure at all | Band has no finite lo or hi; `today-app.cjs:55` | "Not available yet" | N05 | LIVE now | existing timeline card |
| T-21 | No lean anchor, so no protein target | `proteinTarget.g` not finite; `today-app.cjs:875-876` | Protein figure and unit are both blank; nothing is said | N01 | LIVE now | existing timeline card |
| T-22 | Weight trend not available | `nowModel.headed.weight` not finite; `today-app.cjs:71-74` | "Weight trend Not available yet · Why this plan?" | N02 | LIVE now | existing timeline card |
| T-23 | Nutrition entry marker, lane not open | `nutritionState()` with no food lane; `today-app.cjs:2245` | The nutrition link carries "Not wired yet" (`:79`) | N01, N05 | LIVE now | existing timeline card |
| T-24 | Nutrition entry marker, nothing recorded | Lane open, engine holds nothing for today | The link carries no marker at all, deliberately blank | N01 | LIVE now | existing timeline card |
| T-25 | Nutrition entry marker, recorded | Engine holds a calorie or protein figure for today | The link carries "Recorded today" (`today-app.cjs:114`) | N01 | LIVE now | existing timeline card |
| T-26 | Check-in marker, nothing recorded | `recoveryState()` with a durable lane and nothing for today; `today-app.cjs:2250-2254` | The check-in link carries nothing; a blank check-in is blank | R04, R07 | LIVE now | existing timeline card |
| T-27 | Check-in marker, recorded | Durable lane reports recorded | "Recorded today" (`today-app.cjs:249`) | R04, R07 | LIVE now | existing timeline card |
| T-28 | Check-in marker, no store | Summary is not durable | "Not available on this device" (`today-app.cjs:250`) | none | LIVE now | existing timeline card |
| T-29 | Sleep marker, nothing for the night | `sleepState()` returns empty; `today-app.cjs:1950-1954` | The Sleep link carries nothing | R01, R02, R03 (all dormant until nights are written), N2 seam | LIVE now as an empty state; the hours it would show are DORMANT: needs a written night | existing timeline card |
| T-30 | Sleep marker, a night is held | The engine's projected night has finite hours | The Sleep link carries "N h" | R01, R02, R03 | DORMANT: needs a written sleep night (per rules inventory, sleep nights are never written on the tip) | existing timeline card |
| T-31 | Coach entry | Always, on every unblocked Today | "Ask your coach" with the sub line "Your plan, progress and the reasons behind it." and the marker "Not wired yet" (`screens.template.html:56`, `today-app.cjs:909`) | C01 to C05 | LIVE now as an entry; the conversation behind it is NOT WIRED | existing Talk pill (the template calls it the coach entry) |
| T-32 | Import entry, none admitted | Enrolled and the adoption chain has answered; `today-app.cjs:991`, `:731` | A link "Import my history" (`:729`) | none | LIVE now | existing timeline card |
| T-33 | Import entry, history admitted | `importAdmitted` true | The same link reads "History imported" (`:730`) | none | LIVE now | existing timeline card |
| T-34 | Measure tile | Always | A plain button "Measure" (`today-app.cjs:966-971`) with no approved tile behind it | none | LIVE now | NEW measure tile, currently an unstyled button |
| T-35 | Build footer | Always | The last line on the screen names the commit, or "Build unknown" when unbuilt (`today-app.cjs:1007-1010`) | none | LIVE now | NEW build footer line |
| T-36 | Report a problem, idle | Always | A secondary control "Report a problem" (`today-app.cjs:223`) | none | LIVE now | existing timeline card |
| T-37 | Report a problem, copied | Clipboard write succeeded; `today-app.cjs:2228-2234` | "Copied. Send it to Joe." and the diagnostic text box opens | none | LIVE now | NEW diagnostic text box |
| T-38 | Report a problem, copy not available | Clipboard write threw or is absent | "Select all and copy, then send it to Joe." and the same box opens | none | LIVE now | NEW diagnostic text box |
| T-39 | Headline shrink | Three-line engine titles push the primary action below the fold; `today-app.cjs:330-343` | The serif headline steps down one pixel at a time from 47px to a 33px floor; engine text is never truncated | T02 | LIVE now (no-op where there is no layout to measure) | existing timeline card |
| T-40 | A proposal that needs a yes, on Today | Engine's `statusFace.cause` carries the escalation sentence; `rebuild/engine/today.cjs:456` | The sentence "One call needs you: <reason>." lands in the instruction-why slot as prose. There is **no proposal card**, no yes control and no accept path on Today | C02, P01, P02, P03 | NOT WIRED as a card: the template has no proposal slot (`screens.template.html:14-76`) and no accept route exists on this screen | NEW proposal card, NEW accept and decline controls |
| T-41 | Offline indicator (the briefs call it the "offline-ready indicator") | Named in `CLAUDE-DESIGN-BRIEF.md:43` and `CLAUDE-DESIGN-TECH-BRIEF.md:43` | Nothing. Whether the app is installed and can run offline is observed only inside the Report a problem diagnostic (`problem-report.cjs` `offlineReadinessOf`) and is never painted on Today | none | NOT WIRED: spec only | NEW offline state pill |

#### The weigh-in sheet

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| T-42 | Sheet open, empty | Primary button tapped while a weigh-in is owed; `today-app.cjs:1028-1040` | A dialog over an inert Today, the number field focused, step buttons, submit labelled "Record this weight" (`:1033`) | N02 | LIVE now | existing Log button, NEW weigh-in sheet |
| T-43 | Typed but not saved | Text in the field, submit not pressed | Nothing is claimed. No "Saved", no trend change | N02 | LIVE now | NEW weigh-in sheet |
| T-44 | In flight | Submit pressed, transaction open; `today-app.cjs:1068-1074` | The submit button is disabled until the encrypted repository transaction completes | N02 | LIVE now | NEW weigh-in sheet |
| T-45 | Refused, out of range | Value outside 60 to 400 lb or more than one decimal; `today-model.cjs:334-336`, `:348-352` | "A morning weight is recorded between 60 and 400 lb, to one decimal place. Nothing was recorded." Focus returns to the field; nothing is rounded into range | N02 | LIVE now | NEW weigh-in sheet refusal line |
| T-46 | Refused, empty box | Empty string handed to the client; `today-app.cjs:1072` | The client's own sentence, most often "A weight is required." | N02 | LIVE now | NEW weigh-in sheet refusal line |
| T-47 | Refused, already recorded today | The engine already adopted a reading for the date; `today-model.cjs:327`, `:344-347` | "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet." | N02 | LIVE now | NEW weigh-in sheet refusal line |
| T-48 | Refused, no store | No reading lane; `today-model.cjs:108`, `:353-356` | "This device could not open its encrypted local store, so nothing can be recorded here." | none | LIVE now | NEW weigh-in sheet refusal line |
| T-49 | Refused, save threw | The awaited call rejected; `today-app.cjs:1073` | "This weight could not be recorded, and nothing was recorded. <message>" | none | LIVE now | NEW weigh-in sheet refusal line |
| T-50 | Saved | Client acknowledged; `today-app.cjs:1080-1081` | The sheet closes and Today repaints: morning line becomes "This morning ✓ N lb" (`:67`) | N02 | LIVE now | existing timeline card |
| T-51 | Saved with an engine note | The accepted writer attached a note to the reading; `today-app.cjs:65-70` | "This morning ✓ N lb · spike: damped in trend" (the engine writes this with an em dash; the render boundary turns it into a colon) | N02, N04 | LIVE now | existing timeline card |
| T-52 | Undo a weigh-in | None | There is no undo path for a reading on these screens. `undoRead` exists in `rebuild/engine/writers.cjs:2928` but nothing on the rebuild calls it, and `today-model.cjs:327` names the correction path as not wired | N02 | NOT WIRED | NEW correction route |

#### Why this plan

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| T-53 | Why, normal | The trend link tapped; `today-app.cjs:1086-1110` | The engine's move body, then five headed sections: "Your calories", "Your protein", "What supports <status word>", "The readings behind it", "The rate itself" (`today-model.cjs:227-248`) | N03, N04, N07, N10, T04 | LIVE now | existing coach answer card shape, reused |
| T-54 | Why, no reading stored | `latestRead` null; `today-model.cjs:240` | "No reading is stored on this device yet." | N02 | LIVE now | existing coach answer card |
| T-55 | Why, rate not measured | `currentRate.measured` false; `today-model.cjs:245` | "The stored history does not establish a measured weekly rate yet." | N02, N04 | LIVE now | existing coach answer card |
| T-56 | Why, a section has nothing | Any section body is falsy; `today-model.cjs:247` | "No supporting estimate is available." | N01, N05 | LIVE now | existing coach answer card |
| T-57 | Why, blocked | The record is not trusted; `today-app.cjs:1090-1091` | "Nothing can be explained while the local record is not trusted." and no sections at all | none | LIVE now | existing state pill |

#### The nutrition entry (reached from Today)

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| T-58 | Store opening | The lane is being opened; `today-app.cjs:1180-1184` | "Opening this device's encrypted store." followed by "The full nutrition screen is not wired yet. Energy and protein above are today's engine targets; nothing else on this screen is a value." | N01 | LIVE now | existing state pill |
| T-59 | Store refused | `foodLaneFailure` set | "Your intake cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep what you enter and nothing you type is kept. Open Earned again on this device, or use one that allows local storage, and this entry starts working." plus "The store's own reason: <code>." | N01 | LIVE now | existing state pill |
| T-60 | No targets for this athlete | The engine threw on a clean-init state; `today-app.cjs:1120-1122`, `:1192` | "Earned has no calorie band or protein target for you yet: it needs a starting estimate of your body composition, which this device has not recorded. Your intake is still yours to record, and it is kept." | N01, N05, P04 | LIVE now | existing timeline card |
| T-61 | Macro rows, nothing prescribed | Always for carbohydrate and fat; `today-app.cjs:1133-1134` | "Carbohydrate: Not prescribed. The engine issues no carbohydrate target." and the same for fat | N01 | LIVE now | existing timeline card |
| T-62 | Entry open, nothing recorded | Lane open, engine holds nothing | Heading "Today's intake", lead "Enter what you actually ate today. Either figure on its own is enough.", two optional boxes, primary "Record today's intake" (`today-app.cjs:109-113`); the recorded line is hidden | N01 | LIVE now | NEW intake entry block |
| T-63 | Entry refused, nothing entered | Both boxes empty; `today-app.cjs:143` | "Enter calories, protein, or both. Nothing was recorded." | N01 | LIVE now | NEW refusal line |
| T-64 | Entry refused, calories out of range | `today-app.cjs:144` | "Calories are recorded as a whole number between 0 and 20000. Nothing was recorded." | N01 | LIVE now | NEW refusal line |
| T-65 | Entry refused, protein out of range | `today-app.cjs:145` | "Protein is recorded as a whole number of grams between 0 and 1000. Nothing was recorded." | N01 | LIVE now | NEW refusal line |
| T-66 | Entry refused by the client | `result.ok !== true`; `today-app.cjs:1302-1308` | "This intake could not be recorded on this device, and no part of it was recorded." plus the client's own reason plus "Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today." The boxes keep what was typed | N01 | LIVE now | NEW refusal line |
| T-67 | Recorded | Acknowledged and read back | "Recorded today at HH:MM (local offset ±HH:MM) · N kcal · X g protein Recording it again replaces today's figures." (`today-app.cjs:114-115`, `:1360-1365`) | N01 | LIVE now | NEW intake entry block |
| T-68 | Recorded, the read back failed | `result.readBack === false`; `today-app.cjs:1314-1316` | "Recorded today · N kcal Earned could not read today's record back just now, so what is shown here may not be the whole day." plus "Nothing you entered is lost. Read today's record again below, or open Earned again on this device." and a "Read today's record again" control | N01 | LIVE now | NEW read-again control |
| T-69 | Outcome unknown | The save threw before answering; `today-app.cjs:1294-1300` | "Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not." plus the read-again control. Neither stored nor not stored is claimed | N01 | LIVE now | NEW read-again control |
| T-70 | Recorded but the engine cannot read it back | The day is recorded and the engine refused to replay it; `today-app.cjs:1233-1237` | The athlete's own figures out of the operation, then "Recorded and kept on this device. Earned cannot show today's figures back through its own ledger yet: it has no starting estimate of your body composition, and that ledger will not open without one. Nothing is lost, and they appear here as soon as that estimate exists." | N01, P04 | LIVE now | NEW intake entry block |
| T-71 | The lane opened into a refusal | `foodLane.host.openedRefusal`; `today-app.cjs:1220-1223` | The refusal, its reason and the action sentence, before the athlete types anything | N01 | LIVE now | NEW refusal line |

#### The sleep entry (reached from Today)

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| T-72 | No store for sleep | No sleep lane; `today-app.cjs:1493-1499` | "Sleep cannot be recorded on this device yet. Earned could not open its encrypted store here, so there is nowhere to keep it. Open Earned again on this device, or use one that allows local storage." The form is hidden | R01, R02 | LIVE now | existing state pill |
| T-73 | Empty, times mode | Lane open, nothing recorded, default mode; `today-app.cjs:476` | "Sleep", "Night of <date>", the mode choice "Bed and wake times" / "Hours asleep", "Bed time" and "Wake time" fields, "Time awake" toggle, primary "Save sleep" | R01, R02 | LIVE now | NEW sleep entry form |
| T-74 | Empty, hours mode | Mode switched | "About how many hours did you sleep?", "Hours" field, "Entered as an approximate duration." | R01, R02 | LIVE now | NEW sleep entry form |
| T-75 | Times entered, estimate shown | A recordable pair of times; `today-app.cjs:1761-1776` | "Estimate from clock times: N h" and, when no minutes awake were given, "Time awake was not recorded." | R01 | LIVE now | NEW sleep entry form |
| T-76 | Clock-change night | Bed and wake are the same time; `today-app.cjs:1766-1768` | "For a clock-change night, enter hours asleep." | R01 | LIVE now | NEW sleep entry form |
| T-77 | The check-in already holds these hours | The check-in for the morning after holds an entered duration; `today-app.cjs:1473-1483` | "From your check-in on <date>" and a "Use these hours" control. The question is never asked twice | R01, R07 | LIVE now | NEW reuse control |
| T-78 | Refused, nothing chosen | `today-app.cjs:214` | "Choose times or hours asleep. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-79 | Refused, one time missing | `today-app.cjs:215` | "Enter both times. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-80 | Refused, times not valid | `today-app.cjs:216` | "Enter valid times. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-81 | Refused, matching times | `today-app.cjs:217` | "For matching times, enter hours asleep instead. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-82 | Refused, minutes awake | `today-app.cjs:218` | "Enter whole minutes awake within the time in bed. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-83 | Refused, hours out of range | `today-app.cjs:219` | "Enter hours from 0 to 24, with up to two decimal places. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-84 | Refused, the night is not complete | `today-app.cjs:220` | "Choose a completed night. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-85 | Saving | A write is in flight; `today-app.cjs:1715` | The primary reads "Saving sleep..." and a second press is refused | R01 | LIVE now | NEW sleep entry form |
| T-86 | Saved | Acknowledged and read back; `today-app.cjs:1914-1920` | The recorded night with its stamp, "Recorded <date> at <time>.", the source line ("From bed and wake times." or "Entered as an approximate duration." or "Confirmed from your check-in on <date>."), and a "Change sleep" control | R01, R02 | LIVE now | NEW recorded night block |
| T-87 | Corrected | More than one operation for the night; `today-app.cjs:1799-1803` | The stamp reads "Corrected <date> at <time>." | R01 | LIVE now | NEW recorded night block |
| T-88 | Correcting | "Change sleep" tapped; `today-app.cjs:1700-1712` | The form reopens, the primary reads "Save correction", a "Cancel" control appears | R01 | LIVE now | NEW correction controls |
| T-89 | Not saved, the client refused | `today-app.cjs:1893-1905` | "Sleep could not be saved on this device." plus the client's reason plus "Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-90 | The night changed under the editor | Code `SLEEP_STALE_NIGHT`; `today-app.cjs:1898-1901` | "This night changed while you were editing. Review the saved record before trying again. Nothing was recorded." | R01 | LIVE now | NEW refusal line |
| T-91 | The check-in changed | Code prefix `SLEEP_SOURCE_`; `today-app.cjs:1902` | "The check-in changed. Review its hours again. Nothing was recorded." | R01, R07 | LIVE now | NEW refusal line |
| T-92 | Outcome unknown | The command threw and the read also failed; `today-app.cjs:1875-1881` | "Checking whether sleep was saved." The save is fenced against a duplicate and "Try reading it again" is offered | R01 | LIVE now | NEW read-again control |
| T-93 | The log says nothing was written | The read succeeded and the night is not there; `today-app.cjs:1887-1889` | "Sleep could not be saved. The store's own reason: <code>. Nothing was recorded. What you typed is still here." | R01 | LIVE now | NEW refusal line |
| T-94 | Midnight moved under an open draft | `sleepClockCheck()`; `today-app.cjs:1384-1393`, `:1818-1821` | "The date changed. Check which night this is for. Nothing was recorded." and a "Keep this night" control | R01 | LIVE now | NEW rollover confirmation |
| T-95 | The check-in view for a night | The "Open recovery check-in" link; `today-app.cjs:1428-1446` | "Recovery check-in on <date>", the recorded lines, or "No check-in was recorded for this date.", or "The check-in could not be read on this device." | R07 | LIVE now | existing coach answer card shape |

**Today count: 95.**

---

### 2.2 Inside the workout (W)

Phases come from `gym-model.mjs:395-468 read()`: `blocked`, `unfinished`,
`finished`, `ready`, `saved`, `complete`, `active`. `gym-app.mjs:535-562 paint()`
maps them to screens.

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| W-01 | No workout store on this device | The page has no workout host; `today-app.cjs:2372-2373` | "Your workout could not be opened on this device, and nothing was recorded." plus "This browser did not give the page an encrypted local store to keep a workout in." No prescription is shown | none | LIVE now | existing state pill |
| W-02 | The layer refused to prepare | Phase `blocked`; `gym-app.mjs:542`, `:530-533` | Heading "Today's workout cannot open"; "Earned could not prepare today's workout, and nothing was recorded." plus the layer's own reason and its code, each exactly once. It is never described as a fault of the device | T13, T16 | LIVE now | existing state pill |
| W-03 | Start refused while his record is being adopted | `awaitingAdoption` or `everHeld && !rebased`; `gym-model.mjs:472-481` | "Start is not available until this device can read your setup. Reload to try again." | none | LIVE now | existing state pill |
| W-04 | Start refused by the order guard | `orderRefusal()` before the write; `gym-model.mjs:487-488` | The host's own code and reason. Nothing is stored | T09 | LIVE now | existing state pill |
| W-05 | Prepared, starting | Phase `ready`; `gym-app.mjs:545-550` | Transient. The card starts the session itself and repaints into the active set; the athlete never sees a separate screen | T01, T02, T08 | LIVE now | none |
| W-06 | Active set, normal | Phase `active` with an uncompleted slot; `gym-app.mjs:321-440` | Session title; "Exercise N of M"; the lift name; one reason line; the set strip; the prescription "N lb × X reps" (`gym-model.mjs:68-77`); "Aim to finish with N clean reps left." (`:81-85`); the machine settings block; "What you did · Set N"; the "Last time" line; two number boxes with step controls; five effort choices with nothing preselected; "Log set N"; the next lift named | T01, T02, T03, T08, T14, T17, V02, V03 | LIVE now | existing set card, RIR chips, Log button, machine row |
| W-07 | Active set, first session at a new load | The engine's card is a debut; `today.cjs:112` and `:142`, carried into the capture reason at `engine-capture.cjs:93` | The reason line reads "DEBUT: find the working weight: pick a load you can control for about N reps, enter the load and log what it gives. Zero expectations: everything banks." (the engine writes em dashes; the render boundary turns them into colons) | T06 | LIVE on the phone as text; the debit behind it is effectively DORMANT per the rules inventory | existing set card |
| W-08 | Active set, no load prescribed | The capture's load cell is `not_prescribed`; `engine-capture.cjs:23` | The prescription line reads "Find a working load × N reps", never a figure | T06 | LIVE now | existing set card |
| W-09 | Active set, no rep target prescribed | `card.baselineAsk`; `engine-capture.cjs:91` | The prescription line reads "<load> × Record the reps performed" | T06 | LIVE now | existing set card |
| W-10 | Active set, held lift | `e.holdFlag`; `today.cjs:152` | The reason line reads "HELD: opener ran 0 RIR twice · one honest session releases it" | T07 | DORMANT: the hold governor has no caller on the rebuild, so `holdFlag` is never set from a session outcome | existing set card |
| W-11 | Active set, governor hold in the effort plan | `rirPlan` with `ex.holdFlag`; `writers.cjs:802` | A reason line "governor hold: opener stays two clean reps back; the terminal taper and the rep step continue", and the opener's effort target is clamped to 2 | T07, T08 | DORMANT: same missing caller | existing set card, RIR chips |
| W-12 | Active set, alarm day RIR floors | `bodyAlarmSignal(s)` truthy; `writers.cjs:812` | A reason line "alarm day: every 0 becomes a 1; delivered reps still count and bank", and every effort target floors at 1, so the terminal set asks for 1 rather than 0 | T12, R04 | DORMANT: the inputs the alarm reads (pulse readings, sleep nights) are never written on the phone | existing set card, RIR chips |
| W-13 | Active set, more than one reason line | `view.prescription.reason.length >= 2`; `gym-app.mjs:330-333` | Only the first line shows; a "why" control reveals the rest | T03, T04 | LIVE now | existing set card |
| W-14 | Active set, a machine setup note from the engine | The capture's setup cell is specified; `gym-app.mjs:336-340` | A "setup" link reveals the engine's own setup sentence | T15 is app-frozen and not on the phone; this is the capture's `setup` cell only | LIVE now | existing machine row |
| W-15 | Active set, clean rep help open | The help control; `gym-app.mjs:408-411`, copy at `:46-49` | Two sentences defining a clean rep and telling the athlete to choose "Unsure" if they cannot tell | T08 | LIVE now | existing set card |
| W-16 | Active set, last time known | `card.prev` qualified; `gym-model.mjs:282-285` | "Last time: N lb × X reps" | T03 | LIVE now | existing set card |
| W-17 | Active set, no qualified comparison | `card.prev` null, or a load with no numeric magnitude | The last-time line is hidden entirely. No guess | T03 | LIVE now | existing set card |
| W-18 | Active set, no load step on file | `exercise.inc` absent; `gym-model.mjs:377-382` | The load step buttons are disabled; the box takes typed entry only | T06 | LIVE now | existing set card |
| W-19 | Set unlogged, refused for a missing entry | Load or reps empty; `gym-model.mjs:503-506` | "Enter the weight and reps you actually completed." The screen stays on the active set | T08 | LIVE now | existing set card |
| W-20 | Set unlogged, refused for a missing effort answer | No effort chosen; `gym-model.mjs:507` | "Choose clean reps left, or Unsure." Nothing is preselected, so this is reachable on every set | T08 | LIVE now | RIR chips |
| W-21 | Set unlogged, refused by the layer | `logSet` not acknowledged; `gym-model.mjs:514` | The layer's own copy and code, deduplicated; the typed entry stays | T13, T16 | LIVE now | existing set card |
| W-22 | Set logged, with a next set | Phase `saved` and `nextAfter` non null; `gym-app.mjs:477-516` | "Set N logged", the stored facts "N lb × X reps · N clean reps left" (`gym-model.mjs:59-64`), "Your plan does not set a rest length.", "Next · Set N of M" or "Next · <lift>" with its prescription and effort, "Undo", primary "Ready for set N" | T01, T02, T08, T09 | LIVE now | existing set card, Log button |
| W-23 | Set logged, effort unknown | The stored reserve is the tag `unknown`; `gym-model.mjs:60`, `:63` | The facts line ends "Effort unknown". Never a number, never an omission | T08 | LIVE now | existing set card |
| W-24 | Set logged, last set of the lift | `nextAfter` null | "<lift> complete" and the primary reads "Finish this workout" | T09 | LIVE now | existing set card, Log button |
| W-25 | Undo | The undo control; `gym-model.mjs:526-534` | The set operation is retired by the accepted removal edit with the reason "Undone on this device from the saved-set screen before the next set." (`:40`); the card repaints to the active set. Nothing is deleted from the log | T09 | LIVE now | existing set card |
| W-26 | Undo refused | The removal not acknowledged; `gym-app.mjs:507` | The rest note is replaced by the layer's own refusal text | T09 | LIVE now | existing set card |
| W-27 | Editing a logged set | Only through the coach's `correct_set` (TOOL-CONTRACT.md:244-256) | There is no edit control on the gym card itself: the only paths are Undo and a fresh log | T09 | NOT WIRED on this screen | NEW edit-set control |
| W-28 | Every slot recorded, no saved set | Phase `complete`; `gym-app.mjs:455-474` | The rest screen with the saved block hidden, no next set named, primary "Finish this workout". Reachable once a skip exists | T09 | LIVE now, but only reachable after a skip | existing set card |
| W-29 | Skipped set | `slot.completion.kind` is not `performed`; strip text "skipped" at `gym-model.mjs:360` | The strip cell reads "skipped". There is no control anywhere that produces a skip | T09 | NOT WIRED: no skip control exists. `CLAUDE-DESIGN-BRIEF.md:49` records "no skip yet (planned)" | NEW skip control |
| W-30 | Finish refused | `finish` not acknowledged; `gym-app.mjs:446` | The refusal screen with the layer's own code | T09 | LIVE now | existing state pill |
| W-31 | Finished | Phase `finished`; `gym-app.mjs:543-544` | Heading "Workout recorded"; "Today's workout is recorded on this device."; "N sets recorded" | T09 | LIVE now | existing state pill |
| W-32 | Resume after the app was killed | An open session for today on relaunch; `gym-model.mjs:430-467` | The card comes back at the set it was on, with the recorded sets shown done in the strip. The half-typed set survives a navigation away and back through `newGymDraft()` (`gym-app.mjs:94`), but not a process kill | T09 | LIVE now | existing set card |
| W-33 | Machine settings, reading | No cached answer for this lift; `gym-app.mjs:251-259` | "Reading your saved settings for this machine." The open control is disabled and the editor is not offered | none (coach wave one, `DECISIONS:154 (2)`) | LIVE now | existing machine row |
| W-34 | Machine setting unknown | The read answered with nothing; `gym-app.mjs:57` | "No settings saved yet." | none | LIVE now | existing machine row |
| W-35 | Machine settings known | The read answered with a capture | "Your settings for this machine", each setting as a name and a value row, and "To remember:" with the cues | none | LIVE now | existing machine row |
| W-36 | Machine settings could not be read | The read threw; `gym-app.mjs:77-78` | "Settings could not be read." plus "Nothing was lost and nothing was changed. Log your set as usual, and open Earned again on this device to see them." The editor is not offered, so a blank form can never overwrite what he has | none | LIVE now | existing machine row |
| W-37 | Machine settings editor open | The "Machine settings" control; `gym-app.mjs:261-281` | "Save the settings for this machine", "Setting" and "Value" fields, "Anything to remember", "Add another setting", "Remove this setting", "Save these settings", "Close without saving" | none | LIVE now | NEW settings editor |
| W-38 | Editor refused, nothing entered | `machineFromDraft` returns nothing; `gym-app.mjs:297` | "Add a setting or a cue before saving. Nothing was recorded." | none | LIVE now | NEW settings editor |
| W-39 | Editor refused, malformed | The producer's own gate; `gym-app.mjs:298-301` | "Each setting needs a short name and a short value, and each name only once. Nothing was recorded." | none | LIVE now | NEW settings editor |
| W-40 | Editor refused, not saved | The save was not acknowledged; `gym-app.mjs:307-310` | "These settings could not be recorded on this device, and no part of them was recorded." | none | LIVE now | NEW settings editor |
| W-41 | Editor cancelled | "Close without saving"; `gym-app.mjs:272-277` | The draft is thrown away, the durable record is untouched, the athlete is returned to the block | none | LIVE now | NEW settings editor |
| W-42 | Check-in reachable from the active set | The page gave the card a check-in route; `gym-app.mjs:400-406`, `today-app.cjs:2364-2365` | A control that opens the recovery check-in and returns to the same set with the half-entered set intact | R07 | LIVE now | existing timeline card |
| W-43 | No rest length | Always on the rest screen; `gym-app.mjs:37` | "Your plan does not set a rest length." There is no timer, and the approved prototype's countdown is deliberately absent (`screens.template.html:355-362` note) | T15 (rest prescription is app-frozen, not on the phone) | LIVE now | existing set card |
| W-44 | The card has no title | S6 item 3 withholds the engine's day stamp; `gym-app.mjs:227-237` | The stub screens fall back to "Today's workout cannot open" or "Workout recorded" as the heading rather than a blank | none | LIVE now | existing state pill |
| W-45 | A late answer arrives after the athlete left | Ownership handed over by `leaveCard`; `gym-app.mjs:105-108`, `:200-206` | Nothing. The read resolves, is cached, and paints nothing | none | LIVE now | none |

**Workout count: 45.**

---

### 2.3 Coach (C)

There is **no coach screen** on the rebuild. `today-app.cjs:2357-2358` routes the
coach entry to a stub. Every conversational state below exists in the text
prototype (`coach-text.cjs`, `wave1-text.cjs`) and in the tool contract, which is
executable and tested, but nothing paints it. Statuses reflect that.

| ID | State name | Trigger | What the user sees | Rules | Status | Components |
|---|---|---|---|---|---|---|
| C-01 | Entry on Today | Always | "Ask your coach" with the marker "Not wired yet". The design brief's own words are "Talk to Earned" (`CLAUDE-DESIGN-BRIEF.md:88`), which the code does not use | C01 to C05 | LIVE now as an entry | existing Talk pill |
| C-02 | The coach screen stub | The entry tapped; `today-app.cjs:2357-2358` | "Ask your coach." / "Make sense of your plan and the progress behind it." / "The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records." | C01 to C05 | LIVE now | existing coach prompt |
| C-03 | Idle | Named in `CLAUDE-DESIGN-TECH-BRIEF.md:53` | Nothing exists | C01 | NOT WIRED: spec only | NEW conversation view, NEW Talk pill idle state |
| C-04 | Listening | Named in `CLAUDE-DESIGN-BRIEF.md:80`, `COACH-EXPERIENCE-BRIEF.md:36` | Nothing exists | C01 | NOT WIRED: spec only. There is no audio anywhere in this lane (`tools.cjs` header) | NEW listening indicator |
| C-05 | Answering | Implied by every template | Nothing exists as a screen; the text prototype returns one string per turn | C04 | NOT WIRED: needs a conversation view | NEW coach answer card |
| C-06 | Text mode for loud gyms | `COACH-EXPERIENCE-BRIEF.md:36` | Nothing exists | C01 | NOT WIRED: spec only | NEW text input mode |
| C-07 | Tap mode, "I'll tap instead" | `BRIEF-C6-VOICE-ONBOARDING.md:165`, `:200` | Nothing exists. The brief requires it on every screen and that it loses nothing | C01 | NOT WIRED: spec only | NEW tap-instead control |
| C-08 | Mic unavailable or denied | `BRIEF-C6-VOICE-ONBOARDING.md:179`, `:206` | Nothing exists. The brief requires the browser's own error quoted, not invented, plus the tap path | C01 | NOT WIRED: spec only, and `BRIEF-C6-VOICE-ONBOARDING.md:299` records that iOS microphone permission inside an installed Home Screen app is UNKNOWN to this repository | NEW mic refusal block |
| C-09 | Session ended at ten minutes | `CLAUDE-DESIGN-TECH-BRIEF.md:53` and `:60`, copy "The app ended the call." | Nothing exists. No timer, no session length and no such string appears in `rebuild/coach` | C01 | NOT WIRED: spec only | NEW session-ended block |
| C-10 | Answer, today's plan | Intent `today_plan`; `coach-text.cjs:48-55` | "Today is <session>. Eat between N and X calories. The provisional protein target is at least N grams. <if>: <then>." | T02, N01, N05, R05 | LIVE in the prototype, NOT WIRED to a screen | NEW coach answer card |
| C-11 | Answer, no session today | `workoutTitle` blank; `coach-text.cjs:49` | "There is no training session on the board today." | V01 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-12 | Answer, no calorie band | `kcalLo` or `kcalHi` blank; `coach-text.cjs:52`, `:59` | "I do not have a calorie band for you" and, on the calories intent, "I do not have a calorie band for you today, so I am not going to make one up." | N05, C04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-13 | Answer, no protein target | `proteinG` blank; `coach-text.cjs:53`, `:64` | "I do not have a protein target for you." | N01, C04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-14 | Answer, protein target present | `coach-text.cjs:63` | "At least N grams is the provisional protein target, using the available lean-mass input. It is not a measured personal minimum." | N01 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-15 | Answer, weight trend | `coach-text.cjs:79-89` | "Your trend weight is N pounds. You are losing about X pounds a week, somewhere between A and B pounds a week, measured across N readings from <date> to <date>. Your last reading was <date>." | N02, N04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-16 | Answer, no trend weight | `trend` blank | "There is no trend weight on this device yet." | N02 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-17 | Answer, rate not measured | `measured` false | "The rate is not measured yet, so I have no weekly number for you." | N02, N04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-18 | Answer, no reading stored | `lastReadISO` blank | "No reading is stored yet." | N02 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-19 | Answer, why this instruction | Intent `why_instruction`; `coach-text.cjs:68-71` | The engine's own title and body, carried unedited | T04, R05, N03 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-20 | Answer, the engine has no reason | `body` blank; `coach-text.cjs:66`, `:70`, `:72` | "The engine gave no reasoning for that number." / "The engine has nothing to change right now." / "Maintenance is not measured yet." | N03, N10, C04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-21 | Answer, the current set | Intent `current_set`; `coach-text.cjs:90-95` | "<lift>, set N of M. <prescription>. <effort> <setup>." | T01, T02, T08 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-22 | Answer, no current set | `view.phase` is not `active` or prepared; `tools.cjs:530-533` | "The session is <phase>, so there is no current set." | T13 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-23 | Answer, no session composed | `COACH_GYM_SESSION_ABSENT`; TOOL-CONTRACT.md:206 | The refusal is spoken in the layer's own words plus "Nothing changed." | T13, V01 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-24 | Answer, next set | Intent `next_set`; `coach-text.cjs:96-100` | "Next is <lift>, set N of M. <prescription>. <effort>" | T01, T02 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-25 | Answer, that was the last set | `wave1-text.cjs:83` | "That was the last set." | T09 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-26 | Answer, last comparable | Intent `last_comparable`; `coach-text.cjs:101` | The engine's qualified comparison line | T03 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-27 | Answer, no qualified comparison | `COACH_NO_QUALIFIED_COMPARISON`; TOOL-CONTRACT.md:214 | The coach says it has nothing comparable. It never reaches into the session log | T03 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-28 | Answer, the check-in read back | Intent `today_checkin`; `coach-text.cjs:105-113` | The provenance, then the approved question wording beside the athlete's own answer, then the model's consequence sentence. No score, no adjective | R07, R04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-29 | Answer, nothing recorded for the check-in | `lines` empty; `coach-text.cjs:108` | "Nothing is recorded for the check-in on <date>." | R07 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-30 | Answer, the sleep record already holds the night | `sleepRecordHours` present; `coach-text.cjs:109-112` | "Your sleep record already has the night of <date>: N hours. I would ask you to confirm that rather than ask again." | R01, R07 | DORMANT: sleep nights are never written on the tip, so this branch cannot be reached | NEW coach answer card |
| C-31 | Answer, no check-in lane | `COACH_CHECKIN_SURFACE_ABSENT`; TOOL-CONTRACT.md:234 | The refusal in the model's own words plus "Nothing changed." | R07 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-32 | Machine settings recalled | `wave1-text.cjs:59-65` | "<name> <value>, <name> <value>. <cues>. That is what you told me, and I kept it." | none | LIVE in the prototype, NOT WIRED | NEW coach answer card, existing machine row |
| C-33 | Machine setting unknown | `COACH_MACHINE_SETTINGS_ABSENT`; `wave1-tools.cjs:149` | "I do not have it yet. Tell me while you are there and I will keep it." | C04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-34 | No place to keep machine settings | `COACH_MACHINE_SETTINGS_LANE_ABSENT`; `wave1-tools.cjs:141`, `:174` | "There is no place on this device to keep machine settings yet, so I have none to read back." and, on a capture, "... so I have not kept them." | none | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-35 | Machine unnamed | `wave1-tools.cjs:137` | "I need to know which machine you mean." | none | LIVE in the prototype, NOT WIRED | NEW coach prompt |
| C-36 | Machine settings captured | `wave1-text.cjs:68-72` | "Kept: <name> <value>, <name> <value>. I will read it back next time you ask." | none | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-37 | Machine settings could not be kept | `wave1-tools.cjs:184`, `:190` | "I could not keep that, and I have kept nothing." | none | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-38 | Logging a set, confirmation needed | `confirmed` not true; `wave1-tools.cjs:235` | "Say yes and I will log N lb for X reps. Nothing is recorded yet." | T08, C02 | LIVE in the prototype, NOT WIRED | NEW confirm control |
| C-39 | Logging a set, entry missing | `wave1-tools.cjs:231` | "Tell me the weight and the reps you actually did." | T08 | LIVE in the prototype, NOT WIRED | NEW coach prompt |
| C-40 | Logging a set, effort missing | `COACH_EFFORT_REQUIRED`; `wave1-tools.cjs:245` | "Tell me how many clean reps you had left, or say you are unsure." | T08 | LIVE in the prototype, NOT WIRED | RIR chips, NEW coach prompt |
| C-41 | Logging a set, no session | `wave1-tools.cjs:215` | "No gym session is composed on this device, so there is no set to log." | T13, V01 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-42 | Set logged | `wave1-text.cjs:79-84` | "Logged set N. X lb for Y reps, <the accepted layer's own effort sentence>. Next is <lift>, set N." | T01, T08, T09 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-43 | Tier 1 fact, confirmation required | `COACH_CONFIRMATION_REQUIRED`; `wave1-tools.cjs:103`, TOOL-CONTRACT.md:242 | "Nothing is written until you say yes. I have not recorded <what>." | C02 | LIVE in the prototype, NOT WIRED | NEW confirm control |
| C-44 | Tier 1 fact recorded | `coach-text.cjs:116-120` | "Recorded. What went down: <the read-back>. <the plan consequence>." A save alone is never offered as evidence the engine used the answer | R07 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-45 | Tier 1 answer outside the approved sheet | `CHECKIN_INPUT_INVALID`; TOOL-CONTRACT.md:285 | The refusal. The coach may not invent a choice | R07 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-46 | Tier 1, already recorded today | The sheet's one-per-day rule; TOOL-CONTRACT.md:292-294 | "Today's check-in is already recorded on this device..." reported verbatim | R07 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-47 | Tier 1, equipment unavailable | `COACH_FACT_COMMAND_ABSENT`; TOOL-CONTRACT.md:296-302 | The coach says plainly it has not recorded it, naming that there is no field for it | none | DORMANT by design: there is no equipment field anywhere and the closed command would refuse it | NEW coach answer card |
| C-48 | Tier 2 proposal offered | `request_replan` issued; `coach-text.cjs:121-128` | "The engine has a proposal. <muscle> sits at N weekly sets, and it proposes adding X sets. Its reason: <the producer's own reason> Do you want it? Until you say yes, nothing changes." | C02, V04, P01, P02, P03 | LIVE in the prototype, NOT WIRED | NEW proposal card |
| C-49 | Tier 2 proposal declined | `coach-text.cjs:133` | "Then nothing changes. This conversation doesn't change your plan." | C02 | LIVE in the prototype, NOT WIRED | NEW proposal card |
| C-50 | Tier 2 proposal accepted, not durable | `accept_proposal` acknowledged; `coach-text.cjs:129-132` | "Your acceptance was acknowledged. This response does not confirm that the plan was applied or the reason durably saved. The engine's stated reason: <reason>" | C02 | LIVE in the prototype, NOT WIRED. The rules inventory records C02 as accepted on an explicit yes but not durable yet | NEW proposal card, NEW acceptance state |
| C-51 | Tier 2, no consent surface | `COACH_CONSENT_SURFACE_ABSENT`; TOOL-CONTRACT.md:352-360 | The refusal, and nothing changes. `respond` is not in the staged command set, so on the local era `execute('respond', ...)` refuses with `LOCAL_COMMAND_UNSUPPORTED` | C02 | DORMANT: needs `proposal-response` added to the staged commands, or a producer-injected consent command | NEW proposal card |
| C-52 | Tier 2, the producer issued nothing | `COACH_ENGINE_ISSUED_NO_PROPOSAL`; TOOL-CONTRACT.md:332 | The refusal. Nothing changes | V05, V06, V07, V08 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-53 | Tier 2, no re-plan entry point for this fact | `COACH_REPLAN_ENTRY_ABSENT`; TOOL-CONTRACT.md:329-331 | The refusal, naming that no accepted engine entry point re-plans on pain, equipment or time away | none | DORMANT by design: the contract calls this the largest missing seam and names it rather than papering over it | NEW coach answer card |
| C-54 | Tier 2, the model tried to construct a number | `COACH_PROPOSAL_NOT_ENGINE_ISSUED`; TOOL-CONTRACT.md:311-316 | The refusal. A number anywhere in the input, to depth 8, is refused | C02 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-55 | Tier 2 proposal expired | Nothing | There is no expiry anywhere. A proposal id lives for the conversation (`coach-text.cjs:202 memory.lastProposalId`) and there is no timestamp, no window and no expiry code | C02 | NOT WIRED: no expiry concept exists in code or in any brief I found | NEW proposal expiry state, if the owner wants one |
| C-56 | Tier 2 proposal undone after acceptance | Nothing | There is no undo for an accepted proposal. `undoAdjustment` exists in `writers.cjs:2928` and nothing on the rebuild calls it | C02 | NOT WIRED | NEW undo control |
| C-57 | Tier 3 refusal | `cannot_change_via_coach`; `coach-text.cjs:134`, `tools.cjs:308-312` | The topic's own explanation, for example the calorie floor: "The calorie floor is a modeled estimate using the available lean-mass input and energy-availability formula, not a proved personal safety boundary. I can read the available number and reasoning; I cannot move it." Then "This conversation doesn't change your plan." Always an answer, never a failure | C01 | LIVE in the prototype, NOT WIRED | NEW refusal card |
| C-58 | Tier 3, unrecognised topic | `tools.cjs:901` | "That is not something this conversation changes. This conversation doesn't change your plan." | C01 | LIVE in the prototype, NOT WIRED | NEW refusal card |
| C-59 | Unknown value, "I do not have" | Any tagged value with no display; `coach-text.cjs:36`, `tools.cjs:44-46` | The template takes its blank branch and says the app does not know. Never a zero, never "normal", never a filled-in default | C04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-60 | General unavailable | `coach-text.cjs:138-141` | The refusing layer's own sentence, plus " Nothing changed." only when it is not already said | C03, C04 | LIVE in the prototype, NOT WIRED | NEW coach answer card |
| C-61 | No live adapter | `COACH_NO_LIVE_ADAPTER`; TOOL-CONTRACT.md:406 | "correct: there is no live coach in this build" | C05 | DORMANT by design | NEW coach answer card |
| C-62 | No verified spending cap | `COACH_COST_CAP_ABSENT` or `..._INVALID`; TOOL-CONTRACT.md:411-423 | No live session can start. There is no override argument in the file | none | DORMANT: gating a live session that does not exist | NEW cap refusal block |
| C-63 | Opt-in required | `COACH_OPT_IN_REQUIRED`; TOOL-CONTRACT.md:425-430 | No live session. The opt-in is per user and its wording must name the phone, the audio, the text and the fact that it leaves | none | DORMANT: same | NEW opt-in screen |
| C-64 | Offline | `COACH-EXPERIENCE-BRIEF.md:37` "everything but the voice works offline" | Nothing exists. There is no network in this lane at all, so there is no offline state to draw yet | none | NOT WIRED: spec only | NEW offline state pill |
| C-65 | Untraceable number caught | `tools.untraceable()`; TOOL-CONTRACT.md:93-121 | Not an athlete-facing state. A non-empty return marks the transcript RED and the turn must not ship | C04 | LIVE as a test gate only | none |

**Coach count: 65.**

---

## 3. Counts, and how they compare to "98"

| screen | states |
|---|---|
| Today (face, weigh-in sheet, Why this plan, nutrition entry, sleep entry) | 95 |
| Inside the workout | 45 |
| Coach | 65 |
| **Total** | **205** |

By status, counted off the tables:

| status | rows |
|---|---|
| LIVE now (the athlete can reach it on the phone today) | 132 |
| LIVE in the text prototype, NOT WIRED to any screen (all coach) | 45 |
| NOT WIRED (named in a brief, no code, or no control exists) | 15 |
| DORMANT (the code path exists and its input is never written, or its caller does not exist on the rebuild) | 11 |
| Other (one hybrid row, one test-gate row) | 2 |

Ten of the eleven DORMANT rows are the ones the coaching-rules inventory
predicted: the hold governor (T07), the alarm-day RIR floor (T12), every
sleep-reading state (R01, R02, R03), the consent surface behind a tier 2
acceptance (C02), the re-plan entry point that does not exist, and the cost cap
and opt-in that gate a live session there is no adapter for.

**On the number 98.** No count of 98 states exists anywhere in the repository,
and I did not find one in any brief, decision or report. The closest real
engineering figure is **31 screen states**, which is what the three browser
checks sweep for dashes together (`rebuild/slice/P1-REVIEW.md:475`,
`rebuild/lanes/STATUS-ARCHIVE.md:77`), made of 11 to 12 Today states, 12 workout
states and the check-in walk. The two design briefs together name roughly 45
states across nine screens in prose. "98" occurs in the repository only as "98
pinned inputs", which is the Today build's count of pinned source files, not
screens.

The gap between 31 and 205 is explained by four things, in order of size.
First, the browser checks sweep the states that a real browser can be driven
into in a few seconds; they do not enumerate every refusal branch, and this
inventory does, because a designer has to draw a refusal. Second, the sleep and
nutrition entries were built after those checks were written and carry 38 states
between them, almost all of which are refusals, uncertain outcomes and
provenance variants that the D2 review rounds added deliberately. Third, the
coach contributes 65 rows of which only two are on a screen today; if the coach
is scoped out, the total is 140. Fourth, a state here is a distinct thing a
designer must draw, so "refused because the value is out of range" and "refused
because it is already recorded" are two rows even though one component carries
both. If instead a state were counted as a screen layout, the honest figure
would be closer to 30, which is roughly what the browser checks report. If the
owner's "98" came from somewhere outside this repository, I could not find its
source, and I have not invented one.

---

## 4. Copy

### 4.1 Copy the UI must reuse verbatim

These are the strings the code puts on the screen. The UI must not paraphrase
them. Where the engine's own string carries an em dash, the form below is the
post-boundary form the athlete actually sees (`plain-copy.cjs:44-60`).

Honest empty and unknown states
- "Not available yet" `today-app.cjs:38`
- "A calorie range is not available yet." `today-app.cjs:54`
- "This morning: not logged yet" `today-app.cjs:66`
- "No session is scheduled today." `today-app.cjs:899`
- "Today's exercises are not available: <code>" `today-app.cjs:899`
- "Not wired yet" `today-app.cjs:79`
- "No supporting estimate is available." `today-model.cjs:247`
- "No reading is stored on this device yet." `today-model.cjs:240`
- "The stored history does not establish a measured weekly rate yet." `today-model.cjs:245`
- "The rate is not measured yet." `today-model.cjs:239`
- "No settings saved yet." `gym-app.mjs:57`
- "Settings could not be read." `gym-app.mjs:77`
- "Reading your saved settings for this machine." `gym-app.mjs:76`
- "No sleep recorded for this night." `today-app.cjs:156`
- "Quality not recorded." `today-app.cjs:191`
- "Time awake was not recorded." `today-app.cjs:165`
- "Save time not recorded." `today-app.cjs:177`
- "No check-in was recorded for this date." `today-app.cjs:194`
- "The check-in could not be read on this device." `today-app.cjs:192`
- "Not available on this device" `today-app.cjs:250`
- "Effort unknown" `gym-model.mjs:60`, `:63`
- "Find a working load" `rebuild/m4/workout/engine-capture.cjs:23`
- "Record the reps performed" `rebuild/m4/workout/engine-capture.cjs:91`
- "I do not have a calorie band for you" `coach-text.cjs:52`
- "I do not have a calorie band for you today, so I am not going to make one up." `coach-text.cjs:59`
- "I do not have a protein target for you." `coach-text.cjs:53`, `:64`
- "I do not have it yet. Tell me while you are there and I will keep it." `wave1-tools.cjs:149`
- "There is no trend weight on this device yet." `coach-text.cjs:80`
- "No reading is stored yet." `coach-text.cjs:88`
- "There is no training session on the board today." `coach-text.cjs:49`, `wave1-text.cjs:40`
- "The engine gave no reasoning for that number." `coach-text.cjs:66`
- "The engine has nothing to change right now." `coach-text.cjs:70`
- "Maintenance is not measured yet." `coach-text.cjs:72`
- "I cannot answer that from what the app holds." `coach-text.cjs:139`, `wave1-text.cjs:88`

Nothing was recorded
- "Nothing was recorded." `today-app.cjs:181` and appended to every sleep refusal
- "A morning weight is recorded between 60 and 400 lb, to one decimal place. Nothing was recorded." `today-model.cjs:335-336`
- "Today's weigh-in is already recorded on this device. Changing a recorded reading needs the correction path, which is not wired yet." `today-model.cjs:327`
- "This device could not open its encrypted local store, so nothing can be recorded here." `today-model.cjs:108`
- "Nothing can be recorded on this device: its encrypted local store did not open." `today-model.cjs:109`
- "Enter calories, protein, or both. Nothing was recorded." `today-app.cjs:143`
- "Calories are recorded as a whole number between 0 and 20000. Nothing was recorded." `today-app.cjs:144`
- "Protein is recorded as a whole number of grams between 0 and 1000. Nothing was recorded." `today-app.cjs:145`
- "This intake could not be recorded on this device, and no part of it was recorded." `today-app.cjs:116`
- "Your figures are still in the boxes above. Record them again, and if it keeps failing, report a problem from Today." `today-app.cjs:124`
- "Choose times or hours asleep." `today-app.cjs:214`
- "Enter both times." `today-app.cjs:215`
- "Enter valid times." `today-app.cjs:216`
- "For matching times, enter hours asleep instead." `today-app.cjs:217`
- "Enter whole minutes awake within the time in bed." `today-app.cjs:218`
- "Enter hours from 0 to 24, with up to two decimal places." `today-app.cjs:219`
- "Choose a completed night." `today-app.cjs:220`
- "Sleep could not be saved on this device." `today-app.cjs:178`
- "What you typed is still here." `today-app.cjs:210`
- "Your workout could not be opened on this device, and nothing was recorded." `today-app.cjs:242`
- "Earned could not prepare today's workout, and nothing was recorded." `gym-app.mjs:43`
- "Enter the weight and reps you actually completed." `gym-model.mjs:39`
- "Choose clean reps left, or Unsure." `gym-model.mjs:38`
- "Start is not available until this device can read your setup. Reload to try again." `gym-model.mjs:49`
- "Add a setting or a cue before saving. Nothing was recorded." `gym-app.mjs:68`
- "Each setting needs a short name and a short value, and each name only once. Nothing was recorded." `gym-app.mjs:69`
- "These settings could not be recorded on this device, and no part of them was recorded." `gym-app.mjs:70`
- "Nothing was lost and nothing was changed. Log your set as usual, and open Earned again on this device to see them." `gym-app.mjs:78`
- "Nothing is written until you say yes. I have not recorded <what>." `wave1-tools.cjs:103`
- "Say yes and I will log N lb for X reps. Nothing is recorded yet." `wave1-tools.cjs:235`
- "I could not keep that, and I have kept nothing." `wave1-tools.cjs:184`, `:190`
- "This conversation doesn't change your plan." `coach-text.cjs:133`, `:134`
- "Then nothing changes." `coach-text.cjs:133`
- "Do you want it? Until you say yes, nothing changes." `coach-text.cjs:127`
- "Your acceptance was acknowledged. This response does not confirm that the plan was applied or the reason durably saved." `coach-text.cjs:130`
- "Nothing changed." `coach-text.cjs:140`

Provenance and confirmation
- "Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash." `today-model.cjs:110`
- "Recorded today" `today-app.cjs:114`, `:249`
- "Recording it again replaces today's figures." `today-app.cjs:115`
- "Recorded <date> at <time>." `today-app.cjs:176`, `:1801-1802`
- "Corrected <date> at <time>." `today-app.cjs:208`
- "Confirmed from your check-in on <date>." `today-app.cjs:172`
- "Confirmed from your check-in." `today-app.cjs:207`
- "From your check-in on <date>" `today-app.cjs:171`
- "From bed and wake times." `today-app.cjs:170`
- "Entered as an approximate duration." `today-app.cjs:169`
- "Sleep saved on this device." `today-app.cjs:175`
- "Today's workout is recorded on this device." `gym-app.mjs:44`
- "That is what you told me, and I kept it." `wave1-text.cjs:64`
- "Kept: <name> <value>. I will read it back next time you ask." `wave1-text.cjs:68-72`
- "Recorded." `coach-text.cjs:117`

Uncertain outcomes
- "Earned could not read today's record back just now, so what is shown here may not be the whole day." `today-app.cjs:136`
- "Earned could not tell whether this intake was recorded on this device. It may have been kept and it may not." `today-app.cjs:137`
- "Nothing you entered is lost. Read today's record again below, or open Earned again on this device." `today-app.cjs:138`
- "Read today's record again" `today-app.cjs:139`
- "Checking whether sleep was saved." `today-app.cjs:204`
- "Try reading it again" `today-app.cjs:209`
- "This night changed while you were editing. Review the saved record before trying again." `today-app.cjs:202`
- "The check-in changed. Review its hours again." `today-app.cjs:203`
- "The date changed. Check which night this is for." `today-app.cjs:200`
- "Keep this night" `today-app.cjs:201`

Actions and labels
- "Your plan for today" `screens.template.html:20`
- "Eat about" `screens.template.html:32`
- "Log this morning's weight" `today-app.cjs:944`
- "Record this weight" `today-app.cjs:1033`
- "Start <session title>" `today-app.cjs:947`
- "Resume today's workout" `today-app.cjs:305`
- "Resume <title>" `today-app.cjs:308`
- "Review today's workout" `today-app.cjs:235`
- "Why today's workout cannot open" `today-app.cjs:237`
- "Close the unfinished workout" `today-app.cjs:239`
- "An earlier workout was never finished" `today-app.cjs:238`
- "Workout in progress" `today-app.cjs:233`
- "Workout recorded" `today-app.cjs:234`
- "Today's workout cannot open" `today-app.cjs:236`
- "Your set targets are ready" `today-app.cjs:901`
- "Exercise N of M" `gym-app.mjs:325`
- "What you did · Set N" `gym-app.mjs:358`
- "Log set N" `gym-app.mjs:413`
- "Set N logged" `gym-app.mjs:484`
- "Next · Set N of M" and "Next · <lift>" `gym-app.mjs:490`
- "<lift> complete" `gym-app.mjs:491`
- "Ready for set N" `gym-app.mjs:495`
- "Finish this workout" `gym-app.mjs:45`
- "Undo" (the control; its stored reason is "Undone on this device from the saved-set screen before the next set." `gym-model.mjs:40`)
- "Your plan does not set a rest length." `gym-app.mjs:37`
- "Your settings for this machine" `gym-app.mjs:56`
- "Machine settings" `gym-app.mjs:58`
- "Save the settings for this machine" `gym-app.mjs:59`
- "Setting" / "Value" / "Anything to remember" / "To remember:" `gym-app.mjs:60-63`
- "Add another setting" / "Remove this setting" / "Save these settings" / "Close without saving" `gym-app.mjs:64-67`
- The five effort labels "0", "1", "2", "3+", "Unsure" `gym-model.mjs:27-33`
- "Aim to finish with N clean reps left." `gym-model.mjs:84`
- "N clean reps left" / "N+ clean reps left" `gym-model.mjs:61-62`
- "Last time: N lb × X reps" `gym-model.mjs:284`
- The two clean-rep help sentences `gym-app.mjs:46-49`
- "Today's intake" / "Enter what you actually ate today. Either figure on its own is enough." / "Calories eaten" / "Protein eaten" / "Record today's intake" `today-app.cjs:109-113`
- "Not prescribed. The engine issues no carbohydrate or fat target." `today-app.cjs:118`
- "Sleep" / "Night of " / "How do you want to record it?" / "Bed and wake times" / "Hours asleep" / "Bed time" / "Wake time" / "Time awake" / "Minutes awake" `today-app.cjs:154-163`
- "Estimate from clock times: N h" `today-app.cjs:164`
- "For a clock-change night, enter hours asleep." `today-app.cjs:166`
- "About how many hours did you sleep?" `today-app.cjs:167`
- "Use these hours" / "Save sleep" / "Change sleep" / "Save correction" / "Cancel" / "Saving sleep..." `today-app.cjs:173-174`, `:189`, `:197-199`
- "Open recovery check-in" / "Recovery check-in on <date>" / "Earlier check-ins are shown as recorded." `today-app.cjs:193`, `:195-196`
- "Report a problem" / "Copied. Send it to Joe." / "Select all and copy, then send it to Joe." `today-app.cjs:223-225`
- "Set up your week" `today-app.cjs:263`
- "Sample data. Set up your week to start your own." `today-app.cjs:285`
- "Your week is saved on this device. The numbers on this screen are still the preview's sample athlete, not you. Nothing here was measured from anything you did." `today-app.cjs:274`
- "Import my history" / "History imported" `today-app.cjs:729-730`
- "Measure" `today-app.cjs:970`
- "Ask your coach." / "Make sense of your plan and the progress behind it." `screens.template.html:337-338`
- "The coach is not wired yet. There is no conversation here, and nothing on this screen comes from your records." `today-app.cjs:2358`
- The five tier-3 explanations `tools.cjs:308-312`
- "That is not something this conversation changes." `tools.cjs:901`

### 4.2 Copy in the code that promises a dormant behaviour, and must not be shown

| copy | file:line | why it must not be shown |
|---|---|---|
| "<load> EARNS AT THE TOP OF THE WINDOW (lo to hi): you are N reps away · two sightings bank it" | `rebuild/engine/today.cjs:191` | The load earn (T05) is DORMANT: nothing on the rebuild calls `completeSession` or `runAdaptive`, so no load is ever earned. **Good news for the rebuild: no view binds `card.runway`.** I grepped every screen module and the coach tools and found no reader. Keep it that way; do not add a runway slot. |
| "closest to a new weight: <lift>, N reps away from <load>" | `rebuild/engine/today.cjs:199` | Same. It is appended to `session.structural`, which the gym card paints as the session reason on the complete screen (`gym-app.mjs:460`) through `view.session.instruction.display`. Check this slot: the structural string is reachable, and it promises an earn that cannot fire. |
| "HELD: opener ran 0 RIR twice · one honest session releases it" | `rebuild/engine/today.cjs:152` | T07, the hold governor, is DORMANT. The flag is never set on the phone, so the sentence promises a release from a state the athlete can never enter. If it is drawn, it must be drawn only once the governor has a caller. |
| "governor hold: opener stays two clean reps back; the terminal taper and the rep step continue" | `rebuild/engine/writers.cjs:802` | Same rule, same reason. |
| "alarm day: every 0 becomes a 1; delivered reps still count and bank" | `rebuild/engine/writers.cjs:812` | T12: the RIR floor is live in code but its inputs are never written, so the line can only appear if something starts writing pulse readings. Until then it promises a day type the app cannot detect. |
| "DEBUT: find the working weight ... Zero expectations: everything banks." | `rebuild/engine/today.cjs:112` | T06 is effectively dormant per the rules inventory: the debut debit does not fire. The find-the-weight half is true and must stay; the word "banks" promises a consequence that does not happen. Split the sentence rather than dropping it. |
| "One call needs you: <reason>." | `rebuild/engine/today.cjs:456` | C02 proposals are not durable and Today has no proposal card. Showing the sentence with nothing to tap is a promise the screen cannot keep. Either build the proposal card with a real accept path or suppress the sentence. |
| "no rung above N is on file: if the machine makes more, answer the ask on TRAIN (or SETUP ✎) and the next earn has a price" | `rebuild/engine/today.cjs:185-186` | Names TRAIN and SETUP, which are the frozen app's tabs, not the rebuild's screens, and promises an earn. Never show. |
| "the ladder goes blind above N: file the machine's next rungs in SETUP (uneven ✎)" | `rebuild/engine/today.cjs:190` | Same: a control that does not exist on the rebuild. |
| "arming: N of M sets on file ... log one and the runway prices itself" | `rebuild/engine/today.cjs:182` | Same runway promise. |
| "The full nutrition screen is not wired yet. Energy and protein above are today's engine targets; nothing else on this screen is a value." | `today-app.cjs:131` | This one is honest and is currently load bearing under a pinned test, so it must stay in the code. It must not lead a screen: `today-app.cjs:1179` already demotes it below the sentence the athlete can act on. Keep that order in the design. |
| "Your set targets are ready" | `today-app.cjs:901` | Not a dormant promise, but it is the one phrase on these screens that reads like a state word. The owner's copy rules bar that vocabulary in new writing; flag it for a rewrite rather than propagating it. |

---

## 5. Open questions for the product owner

1. Where did the figure of 98 states come from, since the repository's only counts are 31 swept screen states and roughly 45 named in the two design briefs?
2. Should the coach's 63 unwired states be drawn now against the text prototype's exact wording, or deferred until a conversation view exists?
3. The Today entry says "Ask your coach" but both design briefs say "Talk to Earned": which wording is the design of record?
4. "One call needs you" reaches the screen as prose with nothing to tap, because no proposal card exists on Today: build the card with a real accept path, or suppress the sentence until one exists?
5. A tier 2 acceptance is acknowledged but not durable (`respond` is outside the staged command set): should the UI show the acceptance at all before `proposal-response` is staged?
6. There is no proposal expiry anywhere in the code or the briefs: does the owner want one, and if so what window?
7. There is no skip control and no set-edit control on the gym card, yet the model already renders a "skipped" strip cell and the coach can correct a set: should the gym card get both?
8. The weigh-in correction path is named as not wired in the athlete's own refusal sentence: is building it in scope for this design pass?
9. The Measure tile and the build footer are unstyled elements appended after the approved template: should the designer give them a place, or should they be hidden on the athlete's build?
10. Sleep nights are never written on the tip, so every sleep-reading state is dormant: should the sleep entry still be drawn in full now, or only its empty and refusal states?

---

## 6. Rulings (product owner, 2026-09-17)

These close open questions 1, 2, 4, 5 and 6 above. They are the record; the tables above stay as derived.

**Ruling 1. The "98" is unsourced.** No count of 98 states exists in the repository or the briefs. The derived list in section 2 (205 rows) is the state inventory of record. Any future count is measured against it, not against 98.

**Ruling 2. Draw the coach's structural states now; treat the answer variants as copy.** The coach gets its structural states as designed components in this pass: idle, listening, answering, the answer card, the refusal card (tier 3 and unrecognised topic), "I do not have", the confirm control (tier 1), the proposal card (tier 2, offered, recorded, applied), text mode, tap mode, mic unavailable, session ended, offline, the opt-in and the spending cap refusals. The roughly fifty answer variants (C-10 to C-37, C-41, C-42 and the like) are copy on the one answer card: they are drawn once, as data, and are not separate designs. Nothing on the coach screen is wired to an engine; every state is drawn against the text prototype's exact wording so the conversation view can be built later without a second design pass.

**Ruling 3. The proposal card gets a real accept path.** The proposal card is how the engine talks to the athlete about an optimisation (an extra set, a diet break, a machine ladder step, a weight change), so it is built properly:

- One card for every proposal kind. The eyebrow names the kind ("One call needs you"), the serif line names the muscle or lift, one line states the change, one line carries the producer's own reason, two decisions answer it, and a "Why" link opens the reasoning. On the coach screen the same card appears inside the conversation; on Today it sits in the timeline.
- Three honest states. **Open**: nothing has been said. **Recorded**: the athlete answered on this device; the card says "You said yes. It applies when your plan is next built." or "You said no. Nothing changes." **Applied**: shown only once the engine has stored the answer and the plan has been built with it; the card carries the mark "Applied" and no undo. A card must never say applied on the strength of a save alone.
- No timed expiry. A proposal stays open until the plan is next built. If the engine withdraws or supersedes it, the card says so (T-40e).
- Undo is "Change my answer", available in the recorded state until the plan is next built. After that the answer is part of the plan and the card is applied.
- "Applied" needs the engine to store the answer. On the tip, a tier 2 acceptance is acknowledged but not durable (`respond` is outside the staged command set; C-51). Until the engine ticket below lands, the UI stops at the recorded state and never shows applied. See `states/TICKET-proposal-response.md`.

Drawn states for the card: Today T-40 (open), T-40b (recorded, yes), T-40c (applied), T-40d (recorded, no), T-40e (withdrawn), T-40f (diet break), T-40g (machine ladder), T-40h (weight change, dormant); Coach C-48 (open), C-49 (recorded, no), C-50 (recorded, yes), C-50b (applied, not wired), C-51 (no consent surface, dormant), C-55 (ruled out: no expiry), C-56 (change my answer).

**Ruling 4 (2026-09-18). Today's bottom stack is fixed.** Start, the Recovery row and the Talk pill are one stack at the bottom safe area and never move; the day scrolls above them in its own region and softens where it slides under the status bar and into the stack. On the board as drawn the day fits, so nothing changes.

**Ruling 5 (2026-09-18). The weigh-in stays an inline card.** The board's card with its Save pill is the design of record; the inventory's sheet (a dialog with step buttons) is not drawn. T-42 to T-52 stand as drawn.

**Ruling 6 (2026-09-18). "Skip this set" is dropped** until a skip exists in the engine. The link is gone from the workout screen; W-29 stays in the inventory as a drawn, NOT WIRED state (the strip cell reads skipped) so the control can return without a second design pass.

**Ruling 7 (2026-09-18). The five small calls.** The sans of record is the one drawn (DM Sans, matched to the boards) until a named font arrives. "I'll tap instead" stays on Workout and Coach, where the mic is. The bare "+" on "Plans changed?" stays, with the label tappable beside it. The bench proposal keeps "Use 105 / Keep 115"; every other kind uses "Yes, add it / No, keep it as is". Dawn is the same mountains as Ink, lighter: the Dawn plate is the Ink photograph graded light at the Ink geometry (ruled 2026-09-18 after the Dawn board's own photograph, a different range, was tried in the app and retired); the "example" pill stays until real data is wired. The sans of record is DM Sans (committed).

**Round 3 (2026-09-18).** A fresh reviewer's twelve findings were closed: the chassis (a fixed stack and a scrolling body) now holds on every screen and every sub screen; see `quality/STANDARD.md` section 11 and the mismatch page for the copy departures.

**Open questions still standing:** 3 (which coach wording is of record), 7 (the set-edit control; the skip is now ruled), 8 (weigh-in correction), 9 (Measure tile and build footer), 10 (sleep entry scope).
