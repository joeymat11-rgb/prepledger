# EARNED — VOICE COACH TOOL CONTRACT v1 (text-first)

Implements the binding architecture of `VOICE-COACH-BRIEF.md` (owner ruling,
DECISIONS:89): **voice is the mouth, the engine is the brain.** Every number the
coach says comes from an engine tool result in the same turn. The model never
authors a prescription, target or adjustment.

Implementation: `tools.cjs`. Text-first stand-in: `coach-text.cjs`. Executable
acceptance: `test/*.test.cjs`. Nothing here calls a model, a network or a key.

## The fixed, minimal set

| tool | tier | what it reads |
|---|---|---|
| `today_plan` | 0 read | today's instruction, calorie band, protein target |
| `current_set` | 0 read | the live set from the accepted capture |
| `next_set` | 0 read | the next slot in the same capture |
| `last_comparable_performance` | 0 read | the engine's qualified comparison, or nothing |
| `weight_trend` | 0 read | trend, measured rate, reading recency |
| `today_checkin` | 0 read | the recovery check-in's own read-back |
| `why_this_instruction` | 0 read | the engine's own reason, unedited |
| `record_pain_or_soreness` | 1 fact | the accepted check-in lane, one dated operation |
| `equipment_unavailable_today` | 1 fact | — **no field anywhere; still refuses** |
| `correct_set` | 1 fact | the accepted removal edit + a fresh set |
| `time_away` | 1 fact | the accepted check-in lane |
| `answer_checkin` | 1 fact | the accepted check-in lane |
| `request_replan` | 2 proposal | an engine producer issues the proposal + its reason |
| `accept_proposal` | 2 proposal | `rebuild/client` respond() + recordIssuance() |
| `cannot_change_via_coach` | 3 refused | phase, floors, progression rules, consent policy |
| `recall` | 0 read | what he confirmed on ONE named subject, at most five, with source and date |
| `remember` | 1 fact | one confirmed memory, written only on a yes bound to those exact words |

Tier 0 is not a tier in the ruling — the ruling's three tiers are the ones that
*write*. A read changes nothing, so it is numbered 0 and is never gated on a yes.

## The store of record

`local-world.mjs` opens the world the tools take. It is C1/C4's ONE local
installation: `openLocalDurableClient` (sealed IndexedDB generations, the real
`rebuild/client` on a memory backend, the bridge that publishes only after the IDB
transaction completes) enrolling and booting a local era.

**One client, one generation.** The morning reading (`execute('weighIn', …)`) and
the workout (through `hostBindings()` → the accepted `composeWorkoutHost`) are
written by the same client into the same sealed generation. A test asserts the
op count goes 1 → 2 across a weigh-in and a Start.

**The staged command set is NOT widened.** `rebuild/m3/w6/local/local-client.mjs:49`
carries the identical five as `rebuild/m3/w6/t2-stage.cjs:9` —
`weighIn · logSet · logSession · finishSession · workout`. The local client's
`execute()` merely refuses an unknown command with `LOCAL_COMMAND_UNSUPPORTED`
(state 3) instead of the stage's `throw` at `t2-stage.cjs:84`. A test parses both
files and asserts the sets are equal, and another asserts
`client.execute('respond', …)` refuses.

What changed instead is that **`workout` is the one PRODUCER-INJECTED command**,
and `rebuild/m3/w7-preview/today/checkin-commands.cjs` is a producer for it. That
is how a dated non-workout fact reaches disk without editing `rebuild/client` or
the stage — and it is why four of the five tier-1 tools now write instead of
refusing.

**Still synthetic, and said so:** the athlete basis is
`rebuild/m3/w7-preview/fixtures.cjs`; the check-in lane (`checkin-host.mjs`) still
mints its own era rather than reading this one, which is a lane-c-today merge away
(`world.checkInOnLocalEra === false`).

## The envelope every tool returns

```jsonc
// success
{ "tool": "today_plan", "tier": 0, "turn_id": "turn-q01", "ok": true,
  "values": { "kcalLo": { "value": 2262, "unit": "kcal",
                          "source": "energy.calorieTarget.lo",
                          "turn_id": "turn-q01", "display": "2262" } } }

// refusal — the reason is itself a tagged value, so the coach may read it aloud
{ "tool": "today_checkin", "tier": 0, "turn_id": "turn-q13", "ok": false,
  "unavailable": { "code": "COACH_CHECKIN_SURFACE_ABSENT",
                   "reason": "…", "source": "…file:line…" },
  "values": { "code": {…}, "reason": {…} },
  "state_unchanged": true }
```

### Exception and unknown-tool refusals

Check-in validation, wave-one dispatch and onboarding dispatch use fixed refusal
sentences. Exception messages and unknown tool names travel in `unavailable.source`
as developer provenance, never in a reason, copy or arbitrary code. As in the
memory tools, `tool` remains routing metadata; it is not athlete-facing copy.
The refusal helpers in these three modules, and both unknown-tool envelopes,
pass through `assertNoLeak`, including their source members.

| code | exact reason |
|---|---|
| `CHECKIN_INPUT_INVALID` | I could not record that check-in answer. Nothing was recorded. |
| `COACH_MACHINE_SETTINGS_INVALID` (save throws) | I could not keep that, and I have kept nothing. |
| `WAVE1_TOOL_NOT_IN_LIST`, `ONBOARDING_TOOL_NOT_IN_LIST`, `MEMORY_TOOL_NOT_IN_LIST` | I cannot use that tool here, so I did nothing. |
| `WAVE1_TOOL_THREW`, `ONBOARDING_TOOL_THREW` | Something went wrong inside that tool on this device. I could not complete the request. |

The two unknown-tool envelopes retain their top-level `code`, `reason`, `allowed`
and empty `values`; both reason members contain the same fixed sentence.
The exception refusals retain tagged code and reason values. Diagnostic text
licenses no numbers. `test/text-tags.test.cjs` pins these paths with hostile text.

`provenance(value)` formats diagnostics inside its own try and returns the fixed
`(unprintable)` fallback if conversion throws. Non-string unknown names are
refused before property-key coercion. Submit source names setup-commands.mjs as
well as carrying the diagnostic message.

`WAVE1_TOOL_THREW` and `ONBOARDING_TOOL_THREW` omit `state_unchanged`: a catch
around an arbitrary served tool cannot establish it. In particular, log_set
reads the gym again after logSet succeeds, and submit awaits the host's save;
either can throw after a write. Absence means unknown, not a positive assertion
that a write happened. All three renderers suppress tails by CODE for these
two refusals. The accepted memory catch and its existing tail are unchanged;
the author report records their overclaim for separate review.

Check-in apply failures restore the live draft's choices, issues, sleep
confirmation and fields before returning CHECKIN_INPUT_INVALID. The sealed
check-in model save() has no declared refusal codes: its six fixed copies are
ALREADY_RECORDED, NOTHING_ANSWERED, NO_STORE, HOURS_OUT_OF_RANGE, DAYS_INVALID and
SAVE_REFUSED. Only an absent code paired with one of those exact model constants
passes through as before, with CHECKIN_NOT_RECORDED. Any other code or copy gets
CHECKIN_NOT_RECORDED and "I could not record that check-in answer. Nothing was
recorded." Both saved.code and saved.copy travel only in source via provenance.

Wave-one log_set checks load and reps with the accepted edit-values.cjs factual
domain before offering confirmation: a finite positive load and a nonnegative
safe integer rep count (negative zero refused). Numeric strings are converted
before validation; other objects and nonnumeric text are refused. Its fixed
confirmation refusal reason is "Nothing is recorded yet. Say yes to confirm the
weight and reps." The full sentence naming both numbers travels as
confirmation.text with display, value, source, kind, licensed: false and no
turn_id, following the memory data-text pattern. It licenses no number until a
confirmed successful log returns stored load and reps as tagged values.

When onboarding `submit` catches a preparation error, its code is the message
only if the message is a string and an own key of the existing
`setup-model.mjs REFUSAL_SENTENCES` table: `CLEAN_INIT_SETUP_REQUIRED`,
`CLEAN_INIT_SPLIT_REQUIRED`, `CLEAN_INIT_EXERCISES_REQUIRED`,
`CLEAN_INIT_EXERCISE_REQUIRED`, or `CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED`.
Every other message selects the fixed `SETUP_INPUT_INVALID`. A prefix match or
an inherited object key is insufficient. The reason remains `model.COPY.saveRefused`;
the diagnostic message travels in `source`.

The new check-in and dispatch sentences are proposed copy awaiting the owner's
ruling, listed in `rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md`.
Accepted-layer code/copy forwarding and intentional confirmed-fact read-backs
retain their existing contracts; this rule concerns exception and unknown-tool
diagnostics, not engine prose or the athlete's explicitly labelled facts.

### The tagged value

```jsonc
{ "value": 2262 | "prose" | true | null,   // null = unknown, never 0, never "normal"
  "unit": "kcal|g|lb|lb/wk|rep|set|day|date|text|flag|code|id|lift|reading|topic",
  "source": "<engine or adapter reader that produced it>",
  "turn_id": "<the turn this call belongs to>",
  "display": "<the EXACT string the coach may speak>",
  "blank": true, "why": "…"                // present only when the engine had nothing
}
```

`display` **and `unit` together** are the traceability contract.
`tools.allowedTokens(results, turn_id)` returns a map from numeric token to the
set of UNITS the turn licensed it in, and `tools.untraceable(answer, results,
turn_id)` reads each number in `answer` together with the unit/field words around
it and returns the tokens the tools did not account for IN THE UNIT THE SENTENCE
ASKS FOR. A non-empty return is a **RED** transcript.

- A rounding of a real value ("1.2" for 1.19) is untraceable and fails, which is
  the point: a friendlier number is still a different number.
- `"Eat 155 calories"` fails when 155 is the protein target in grams. A number
  travels only into a slot the engine computed *for that purpose*.
- Engine prose (`unit: "text"`) is read with the same parser, so the prose's own
  unit words are what it licenses.
- The unit is read **both ways inside the clause**: rightward for the unit it is
  spoken in (`155 grams`), leftward for the field it is spoken into
  (`Protein: 2262`, `your calorie floor is 155`). Rightward wins where both
  answer. Neither scan crosses `.`, `!`, `?` or `;`.
- An **unrecognised noun** beside a number is a unit of its own (`!seconds`,
  `!kilograms`), not "no unit". It licenses nothing unless the engine itself used
  the same word: `155 seconds` is not `155 minutes` and `155 kilograms` is not
  `155 lb`.
- A number with **no unit and no field word at all** is refused unless its
  licensing unit is in `BARE_SPEAKABLE` — `set`, `rep`, `lift`, `reading`, `pct`,
  and a figure the engine itself stated bare. A calorie band, a protein floor, a
  bodyweight, a rate, a duration and **a `date`** are never bare-speakable: the
  components of `2030-02-04` are not a set count or a bodyweight.
- On the answer side every interpolation declares its unit:
  `d(v.kcalLo, "kcal")` throws `COACH_UNIT_MISMATCH` if handed a gram value.

Every value is scoped to its own `turn_id`. Provenance cannot be borrowed from an
earlier answer, and `openTurn()` is the only way to call a tool.

### What NO tool ever returns

`assertNoLeak()` runs on every success envelope and throws `COACH_TOOL_LEAK` on
any of: `reads`, `dailyLogs`, `sessionLog`, `sleep`, `nights`, `exercises`,
`feed`, `queue`, `state`, `seed`, `token`, `GH_TOKEN`, `identityKey`, `storeKey`,
`signingKey`, `lease`, `authorityKey`. The coach sends only what the question
needs; the ledger never crosses this window.

---

## TIER 0 — reads

### `today_plan`
**in** `{}` — no properties, none accepted.
**out** `values`: `day` (date), `kcalLo` `kcalHi` (kcal), `proteinG` (g),
`statusWord` `statusCause` `ifText` `thenText` `targetLine` `workoutTitle` (text),
`workoutAvailable` (flag), `workoutRefusal` (text).
**engine**
- `rebuild/engine/energy.cjs:684` `calorieTarget(s)` → `lo` / `hi`
- `rebuild/engine/energy.cjs:117` `proteinTarget(s)` → `g`
- `rebuild/engine/today.cjs:405` `statusFace(s)` → `word` / `cause`
- `rebuild/engine/today.cjs:465` `marchingOrder(s)` → `ifText` / `thenText` / `targetLine`
- `rebuild/engine/today.cjs:630` `nowModel(s)` → `workout.title`
- `rebuild/engine/today.cjs:63` `genSession(s, iso, slp)` → whether a session exists
- read through the slice's REAL adapter `rebuild/m3/w7-preview/today/today-model.cjs` `read()`
**never returns** any reading, food, sleep or session row; no device, store or
lease identifier; no macro split the plan does not currently carry.

### `weight_trend`
**in** `{}`.
**out** `trend` (lb), `measured` (flag), `rate` `rateLo` `rateHi` (lb/wk),
`n` (readings), `from` `to` `lastReadISO` (text/date), `daysSinceRead` (day),
`stale` (flag), `latestLb` (lb), `hasReadToday` (flag).
**engine**
- `rebuild/engine/energy.cjs:225` `currentRate(s)` → `scale` / `lo` / `hi` / `n` / `from` / `to` / `measured`
- `rebuild/engine/energy.cjs:331` `readRecency(s)` → `lastISO` / `days` / `stale`
- `rebuild/engine/writers.cjs:424` `applyRead(state, iso, w, opts)` — the durable
  reading operations are replayed through the ACCEPTED writer; `state.trend` is
  the writer's, never the adapter's
**never returns** the reading log itself. When `measured` is false every rate
value is blank — the coach says the rate is not measured yet and states no number.

### `why_this_instruction` — "the reason behind the current instruction"
**in** `{ "topic": "instruction|calories|protein|maintenance|floor|levers|status" }`
(default `instruction`; anything else is refused, never guessed).
**out** depends on topic; every field is the engine's own prose, carried
**unedited**. The coach paraphrases nothing, which is exactly why the numbers
inside a reason stay traceable.
**engine**
- `instruction` → `rebuild/engine/today.cjs:279` `theOneFix(s, levers)` (`lever`/`title`/`body`/`whyNot`)
- `calories` → `rebuild/engine/energy.cjs:684` `calorieTarget(s).why` and `.wkWhy`
- `protein` → `rebuild/engine/energy.cjs:117` `proteinTarget(s).why`
- `maintenance` → `rebuild/engine/energy.cjs:369` `observedTDEE(s).stepsWhy`, plus
  `matched` (the window-matching flag) and `impossible` (the energy-density check)
- `floor` → `rebuild/engine/energy.cjs:493` `calorieFloor(s).why`
- `levers` → `rebuild/engine/today.cjs:226` `fiveLevers(s).list`
- `status` → `rebuild/engine/today.cjs:405` `statusFace(s)`
**never returns** a reason the coach composed. There is no branch here that
writes a sentence of its own about why something is what it is.

### `current_set` / `next_set`
**in** `{}`.
**out** `current_set`: `phase`, `liftLabel`, `liftIndex`/`liftCount` (lift),
`setPosition`/`setCount` (set), `prescription`, `effort`, `reason[]`, `setup`.
`next_set`: `liftLabel`, `position`/`count`, `prescription`, `effort`, `sameLift`.
**engine / layer**
- `rebuild/m3/w7-preview/today/gym-model.mjs` `read()` → `prescriptionLine()`,
  `effortInstruction()`, `nextAfter()` — cells of the v2 prescription capture the
  accepted engine adapter produced and the durable Start operation stored
- behind them: `rebuild/engine/today.cjs:63` `genSession`,
  `rebuild/engine/progression.cjs:261` `targetsFor`,
  `rebuild/engine/progression.cjs:19` `progressStep`
**never returns** a load, rep count or effort the capture did not specify. A cell
the engine did not specify prints the cell's OWN words ("Find a working load"),
never a figure.
**refuses with** the layer's own code, unedited — including
`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` (`rebuild/engine/performed.cjs:193`),
`PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` (`performed.cjs:180,183`),
`PROGRESSION_RESET_MAPPING_REQUIRED` (`rebuild/engine/progression.cjs:117`),
`WORKOUT_PREPARATION_INVALID`, `WORKOUT_RESUME_SLOT_MAPPING_REQUIRED` — or
`COACH_GYM_SESSION_ABSENT` when no session is composed on the device.

### `last_comparable_performance`
**in** `{}`. **out** `line` (text), `liftLabel` (text).
**engine** `rebuild/engine/today.cjs:63` `genSession(...)` → `card.prev`, read
back through `gym-model.mjs` `previousLine()` over the SAME input the capture was
prepared from.
**never returns** a comparison the engine did not qualify. `card.prev === null`
is an ANSWER: the tool refuses with `COACH_NO_QUALIFIED_COMPARISON` and the coach
says it has nothing comparable. It never reaches into the session log itself.

### `today_checkin` — WIRED
**in** `{}`.
**out** `date`, `answered` (flag), `note` (text — the model's own consequence
sentence), `provenance` (text), `lines[]` (text — the approved question wording
beside the athlete's own answer), `sleepRecordHours` (h), `sleepRecordDate` (date).
**layer** `rebuild/m3/w7-preview/today/checkin-model.mjs` `createCheckInModel().read()`
over `checkin-host.mjs` (its own database, namespace, lease and producer).
**the laws it carries, unchanged**
- **Blank is unknown**, never healthy/normal/zero. A day with nothing recorded
  answers `answered:false`, an empty `lines`, and a BLANK `provenance` — not "".
- **The date law.** Only operations effective for this day are read back;
  yesterday's answers are never today's, and yesterday's denial never carries.
- **Sleep is not asked twice.** When the engine's `sleep.nights` already holds
  last night, its hours and its date come back here so the coach can ask for a
  confirmation rather than the same question again.
**never returns** a score, a readiness number, or any adjective about what the
answers mean. There is none to return: the model derives nothing.
**refuses with** `COACH_CHECKIN_SURFACE_ABSENT` when no check-in lane is open.

### `recall`: WIRED (P4b-1)
**in** `{ "topic": str }`. The topic is REQUIRED and it is matched EXACTLY: the
ends are trimmed, the case is kept, and it is then compared with equality. There
is no fuzzy match, no substring match and no stemming anywhere in this lane, and
the same rule runs at write time and at read time (`memory-commands.cjs`
`topicOf()`), so the two cannot drift apart.
**out** `topic`, `shown` (fact count), `more` (flag), `note` (text), and
`items[]`, plus `skipped` beside the envelope. Each item carries `memoryId`
(id), `kind`, `topic`, `label`, `recordedOn` (date) and `text`.
**the read side goes through the ONE gate.** A stored operation is published
only if `memory-commands.cjs` `memoryOf()` accepts the memory it carries, the
same function the write went through. An operation that arrived by another road
than this tool, a merge or a damaged store that still authenticates, carrying a
text that is not a string, a kind nobody declared or an over-long topic, is
refused at the read. Those rows are COUNTED: `skipped` is a data member
(`display`, `value`, `licensed: false`, no `turn_id`) and it travels on the
answer AND on `COACH_MEMORY_ABSENT`, because "nothing kept on that subject" and
"something on this device could not be read" are different answers.
**`text` IS DATA, NOT A TAGGED VALUE.** It carries `display`, `value`, `source`
(`"coach-memory.op " + op_id`, the same shape `machine_settings` uses) and
`licensed: false`, and it deliberately carries NO `turn_id`. So `collectTagged()`
never sees it and `allowedTokens()` never licenses a number inside it: the coach
can read his own sentence back and can still never turn "my target is 210 grams"
into a target it states. A figure a memory names is untraceable, by construction.
**bounded** at most FIVE facts in a TURN, over every recall in it and not five
per call. The turn the harness opened keeps the account: a recall takes what is
LEFT of the five, and when it leaves something out `more` says so. Six subjects
asked in one turn therefore return at most five facts in total, and the next turn
starts at five again. `memoryTools.allowance(turn_id)` answers what is left
without calling. Outside a turn, where nobody is counting, the per-call bound of
five is what the tool holds to.
**and the bound holds against CONCURRENT recalls** (review R3-B1). The allowance
is RESERVED before the store read, not spent after it, so recalls in flight
together in one turn cannot each spend the same five; what a call did not use is
refunded the moment its rows are known, and a refusal or a throw after the
reserve gives the whole reserve back. A reserve is conservative: recalls issued
in parallel return FEWER than five facts in the turn, never more, and a caller
that wants all five issues them one after another.
**the account is per COACH INSTANCE** and never durable, like a pending yes. It
belongs to the instance whose `openTurn()` opened it: two `createMemoryTools`
over one world and one turn id keep two accounts and publish five facts each, so
a consumer must not stack instances over one installation. The shipped wiring
builds exactly ONE instance per world, in `local-world.mjs`'s coach world and the
harness that calls it, and this sentence is here so a later consumer does not
read "per instance" as an invitation.
**the map of accounts is BOUNDED** (review R3-N2): an account is dropped when its
turn is closed, if the coach's own turn object has a close, and in any case at
most 64 of the most recent turns are kept, oldest evicted. A turn whose account
has been evicted is treated as a turn nobody opened, which is the per-call bound
and never more than it.
**ordered** by `memory-model.cjs`'s one stated rule: most recent effective date
first, then the log's own order, later entry first. It is a total order, so the
same question twice gives the same facts in the same order. The facts left out
do not appear anywhere in the envelope.
**measured, not claimed** the worst case this bound permits, one recall of five
memories at `TEXT_MAX`, is `turnContextBytes` 9446, which is OVER the standing
8 KiB per-turn budget. That is the RECALL envelope's figure and not the turn's: a
turn that also WRITES memories measures more, because `remember()` publishes an
item of its own on every success (review R3-N6). `model-adapter.md` states both
figures, a cell measures both and reads that file, and the choice between shorter
source strings and an enforced budget is P4b-2's.
**topics carry an EMPTY display** (review R3-N5). Both topic tags publish
`display: ""` and carry the topic as the tag's `value`, exactly as `memoryId`
does. The topic is the athlete's own word: the lane bounds its length and
constrains no character, and `allowedTokens()` promotes a declared unit to `date`
whenever the display reads as a date, so a memory filed under the topic
"2019-04-17" licensed a date nothing dated. Read a topic from `value`.
**never** scans histories, never returns the whole store, and never answers a
topic nobody named.
**refuses with** `COACH_MEMORY_TURN_BOUND` (the turn's five facts are spent: it
reads NOTHING, it does not read and then discard), `COACH_MEMORY_TOPIC_REQUIRED`
(no topic), `COACH_MEMORY_ABSENT`
(nothing kept on that subject), `COACH_MEMORY_UNREADABLE` (the store could not be
authenticated: absence and unreadability are different answers and he is told
which), `COACH_MEMORY_LANE_ABSENT` (no memory lane on this device).

---

## TIER 1 — facts, recorded after a spoken confirmation

Every tier-1 tool requires `"confirmed": true`, and the harness sets it **only**
after the user's yes. The guard runs before anything else: without it the tool
reads nothing, writes nothing, and returns `COACH_CONFIRMATION_REQUIRED`.

### `correct_set` — WIRED
**in** `{ "confirmed": true, "startId": str, "opId": str, "slot": str,
"lift": str, "load": num|str, "reps": num|str, "effort": <accepted reserve> }`
**out** `removedOpId`, `recordedOpId` (text), `load` (lb), `reps` (rep).
**path** `gym-model.undo()` → `client.prepareWorkoutEdit` +
`commitWorkoutEdit({action:"remove"})` (the accepted durable removal edit — there
is no delete in an append-only log and this does not pretend there is one), then
`gym-model.logSet()` → `client.executeResumedWorkout({action:"set"})`.
**effort** must be a value `rebuild/m4/workout/edit-values.cjs` `reserve()`
admits: exact 0/1/2, at_least 3, or the tag `unknown`. "Unsure" stores the tag —
never a number, never an omission.
**never returns** a corrected value the athlete did not state. Both the original
set operation and the removal stay on disk; an honest history is what that is.

### `record_pain_or_soreness`, `time_away`, `answer_checkin` — WIRED (check-in lane)

All three write through the SAME accepted sheet — `checkin-model.mjs`'s draft and
`save()` → `checkin-host.save()` → `client.execute('workout', {action:'checkin'})`
— which is **one dated operation per day**, or nothing.

`record_pain_or_soreness`
**in** `{ "confirmed": true, "soreness": "None|Mild|Significant",
"soreness_location": str, "soreness_impact": "No|A little|Quite a lot|Not sure",
"pain": true, "pain_location": str, "pain_change": "New|Worse than before|Ongoing,
unchanged|Improving|Not sure", "pain_impact": "No noticeable effect|I change how I
move|I cannot do the movement|Not sure" }`

`time_away`
**in** `{ "confirmed": true, "days": int, "reason": str }`

`answer_checkin`
**in** `{ "confirmed": true, "sleep_quality": "Poor|Okay|Good",
"energy": "Low|Moderate|High", "soreness": …, "stress": "Low|Moderate|High",
"confirm_sleep_record": true, "sleep_hours": number, "note": str }`

**out (all three)** `opId` (text), `date` (date), `consequence` (text — the plan
consequence the model states after a real save), `lines[]` (the read-back).

**what the coach may not do here**
- It may not invent a choice. Every label goes through the draft's own `choose()`,
  which accepts ONLY the approved design's words; anything else throws before a
  byte is written and the tool returns `CHECKIN_INPUT_INVALID`.
- It may not grade an answer, weight it, or turn it into a number.
- It may not submit a cleared issue's detail — the draft drops it and
  `checkin-commands.cjs` `answersOf()` refuses it again at the door.
- It may not overwrite the sleep record silently: `confirm_sleep_record` confirms
  the dated night (and its date travels with the answer); stating different hours
  goes through the sheet's own explicit rejection of the record.
- After the first check-in of a day, a second refuses in the model's own words
  ("Today's check-in is already recorded on this device…"). That is the sheet's
  one-per-day rule, not a coach rule, and it is reported verbatim.

### `equipment_unavailable_today` — STILL NOT WIRED
**in** `{ "confirmed": true, "note": str }`. **out** none.
**refuses with** `COACH_FACT_COMMAND_ABSENT`, naming
`rebuild/m3/w7-preview/today/checkin-commands.cjs` `FIELDS` — there is no
equipment field there, no workout command for it and no plan verb, so the closed
command would refuse it. Writing it anywhere else would be a fact that cannot
survive a reload, so the coach says plainly that it has not recorded it.

### `remember`: WIRED (P4b-1)
**in** `{ "memory": { "memory_id": str, "kind": "goal"|"preference"|
"constraint"|"decision-note", "topic": str, "text": str, "interval":
{"from": date, "to": date}? }, "confirmed": true?, "confirmation_id": str? }`
and NOTHING else: an extra member on the arguments or on the memory refuses.
**TWO STEPS, AND THE SECOND IS BOUND TO THE FIRST.** Called without the flag,
the tool checks the shape, writes nothing, and hands back
`confirmation: { confirmation_id, kind, topic, text }` with
`COACH_CONFIRMATION_REQUIRED`: that is the coach reading the words back and
asking. `text` there is a DATA member (`display`, `value`, `source`,
`licensed: false`, and no `turn_id`), exactly like the `text` `recall` returns,
and the refusal's own `reason` is a FIXED sentence that quotes nothing: a reason
is published as a `text` tag, and `allowedTokens()` reads a `text` tag as engine
prose, so a reason that quoted the memory would license every figure in it for
the whole turn on a path that writes nothing.
The yes then arrives carrying that `confirmation_id`. The handle is
bound to THOSE EXACT WORDS, it is single use, it is spent before the write, and
it lives in the conversation, never on disk, so it cannot survive a restart.
**out** `opId` (id), `item` (the same shape `recall` returns), `consequence`
(text: it changes no plan and no target), and `recorded: true`.
**the shape** `memory-commands.cjs` is the ONE gate, used on the request and
again on the envelope the client built. Identifiers are trimmed and bounded at
80. The TEXT is bounded at 400 and is otherwise stored EXACTLY as confirmed: no
trim, no normalising, no escaping, no case folding, no language detection. A
trim would eat a trailing U+FEFF and the store would hold one string and read
back another.
**the stamp** the effective date, the local time and the UTC offset are the
installation's own, from the envelope the accepted client builds. There is no
clock in any memory module and a cell scans all four to prove it.
**refuses with** `COACH_CONFIRMATION_REQUIRED` (no yes),
`COACH_MEMORY_CONFIRMATION_CANCELLED` (he said no, and it is a different
sentence from "not asked yet"), `COACH_MEMORY_CONFIRMATION_SPENT` (one yes, one
write), `COACH_MEMORY_CONFIRMATION_UNKNOWN` (no such yes in this conversation),
`COACH_MEMORY_CONFIRMATION_MISMATCH` (the words moved after the yes),
`COACH_MEMORY_INPUT_INVALID` (the shape), `COACH_MEMORY_LANE_ABSENT`, or the
accepted layer's OWN code and sentence when the store refuses. A save that THREW
answers the host's own fixed `COACH_MEMORY_WRITE_REFUSED` with a null copy, so no
exception message can answer the code table below; the message travels as an
untagged `detail` and reaches the refusal's untagged `source` (review R3-N3).
**A STANDING CONDITION ON THE ACCEPTED LAYER.** When the store refuses, the
accepted layer's own `copy` is carried into the refusal's `reason` VERBATIM, and
a `reason` is a `text` tag, which `allowedTokens()` reads as engine prose and
licenses every figure in. That carve-out is deliberate: reading a client refusal
out loud is what `tools.cjs:328` intends. It is safe only while every refusal
sentence that can reach `saved.copy` is a FIXED sentence with no interpolation of
SUBMITTED INPUT. Review R3 read the two client files on that path,
`rebuild/m3/w6/public-client.mjs` and `rebuild/m3/w6/local/local-client.mjs`, and
found only fixed sentences; the one interpolation measured there appends the
layer's own fixed code (for example "... `WORKOUT_INPUT_INVALID`"), which is not
input. Nothing enforces this and no cell would notice if it changed, so it is
written down here: an accepted layer that ever quotes the athlete's or the
model's words back in a refusal copy breaks this contract, not merely this lane's
taste.
**and one refusal that is not a failure to write.** If the commit LANDS and the
read-back then fails, the tool returns `COACH_MEMORY_READ_BACK_FAILED` with
`committed: true` and the `op_id` it holds from the commit, and says both things
out loud: it was kept, it could not be shown, and it was not written twice. It
never claims the memory is absent (a lie about disk) and never claims it read it
back (a lie about the read). There is no retry on a read failure. The op id
travels as `op_id` and as the data member `recordedAs` and is NOT interpolated
into the sentence, for the reason above: an op id carries the device id and its
digits, and a reason tag would license them.

---

## TIER 2 — plan changes, only as ENGINE-ISSUED proposals

### `request_replan`
**in** `{ "fact": "volume"|"phase"|"ladder", "exerciseId": str? }`
**THIS TOOL TAKES NO NUMBERS.** A number ANYWHERE in the input — top level,
nested in an object, or inside an array, to depth 8 — is refused with
`COACH_PROPOSAL_NOT_ENGINE_ISSUED`. A numeric STRING (`"7"`, `"make it 7 sets"`)
is not refused and does not need to be: nothing reads it as a quantity, and the
issued proposal is byte-identical to the clean call. That is the mechanical form
of the ruling:
the model may never construct a proposal's numbers and then ask for confirmation,
because a confirm is not an undo and confirmation of a guess is still a guess.
**out** `values`: `proposalId` (id), `producer` (text), `reason` (text),
`addWeeklySets` (set), `muscle` (text), `weeklySetsNow` (set);
plus `proposal` (the sealed record), `awaiting_yes: true`, `state_unchanged: true`.
**engine producers** (the proposal, its numbers and its reason are all theirs)
- `volume` → `rebuild/engine/volume.cjs` `volumeImbalance(s)` — issues only when
  `actionable` is true, which is Pelland 2025's smallest detectable effect
  (`sdes`) applied before anything ships. `need`, `gain`, `sdes`, `taker.sets`
  and `why` are carried verbatim.
- `phase` → `rebuild/engine/policy.cjs` `phaseProposal(s, deps)`
- `ladder` → `rebuild/engine/progression.cjs` `proposeLadder(s, exId)`
**refuses with**
- `COACH_REPLAN_ENTRY_ABSENT` — for pain, equipment, time away and anything else:
  **no accepted engine entry point re-plans on those facts today.** This is the
  largest missing seam in the contract and it is named rather than papered over.
- `COACH_ENGINE_ISSUED_NO_PROPOSAL` — the producer returned null. Nothing changes.
**writes nothing.** Issuing a proposal is a read; the test asserts the durable
store is byte-identical afterwards.

### `accept_proposal`
**in** `{ "proposal_id": str, "confirmed": true }`
**out** `proposalId` (id), `reason` (text, the engine's own), `opId` (text);
plus `accepted` (proposal + reason + op_id + issuance flag), `recorded: true`.
**path — the EXISTING consent path, not a side door**
- `rebuild/client/index.cjs:271` `respond(proposalId, answer)` → one durable
  `proposal-response` operation with its outbox entry, in one transaction
- `rebuild/client/index.cjs:338` `recordIssuance({ id, accepted, instance })`
- read back at `rebuild/client/index.cjs:161` `answers()` / `face().answers`
**refuses with** `COACH_CONFIRMATION_REQUIRED` (no yes — nothing changes),
`COACH_PROPOSAL_NOT_ENGINE_ISSUED` (an id the engine did not issue in this
conversation), `COACH_CONSENT_SURFACE_ABSENT` (no consent surface on the device),
or the client's own code when `respond()` does not acknowledge.
**the reason is stored** beside the accepted proposal, because "saved" alone is
not evidence the engine used the answer (approved handoff, "Required
interpretation").

**Known gap.** `respond` is NOT in the staged command set — not in
`rebuild/m3/w6/t2-stage.cjs:9` and not in `rebuild/m3/w6/local/local-client.mjs:49`
either. On the local era `client.execute('respond', …)` refuses with
`LOCAL_COMMAND_UNSUPPORTED`, state 3, and a test proves it. So the consent surface
is injected, and where it is absent the tool refuses with
`COACH_CONSENT_SURFACE_ABSENT` and nothing changes. A live coach needs
`proposal-response` added to the staged commands — or a producer-injected
consent command, the way the check-in got one — first.

---

## TIER 3 — never via the coach

### `cannot_change_via_coach`
**in** `{ "topic": "phase"|"calorie_floor"|"protein_floor"|"progression_rules"|"consent_policy" }`
**out** `topic` (text), `explanation` (text); plus `refused: true`,
`state_unchanged: true`. Always `ok: true` — a refusal is an answer, and it is
the coach doing its job, not failing.
An unrecognised topic still refuses, with the general sentence.

**The five, and why each is here**
| topic | why it is not a conversation |
|---|---|
| `phase` | a detector output, never a user choice |
| `calorie_floor` | derived from lean mass by the energy-availability formula (`rebuild/engine/energy.cjs:493` `calorieFloor`) — D13 |
| `protein_floor` | derived from measured lean mass (`rebuild/engine/energy.cjs:117` `proteinTarget`) — D14 |
| `progression_rules` | rules in the engine (`rebuild/engine/progression.cjs:19` `progressStep`, `:261` `targetsFor`) |
| `consent_policy` | what needs a yes, and how a yes is recorded, cannot be loosened mid-conversation |

The coach **may** read these numbers out and explain them — `why_this_instruction`
with topic `floor`, `protein` or `instruction` does exactly that. It may not move
them. "This conversation doesn't change your plan" stays literally true for every
tier-3 exchange and for every tier-2 exchange that ends without a yes.

---

## CANONICAL TRUTH WINS, and a memory is labelled beside it (M06)

Setup, machine settings, logged observations and the effective programme are read
through their OWN owners and stay the truth. A memory never changes a programme,
a target or a logged observation, and the memory lane never reads another lane's
store to find out what it should say.

When a memory contradicts one of them, the consumer reads the canonical value
through that owner's own tool IN THE SAME TURN and hands the pair to
`memoryTools.beside(canonical, item)`, which is `memory-model.cjs joinOf()`:

```
{ canonical: { value, source, date },
  memory:    { text, source, date, kind, topic },
  label:     "goal" | "preference" | "constraint" | "decision-note" | "needs-review",
  sentence:  "What the app holds now is <value>, from <source> on <date>.
              You told me on <date>: \"<text>\". That is your own <label>, and it
              has not changed what the app holds." }
```

The canonical value is stated FIRST, with its own source. The memory follows,
named as his own words with its own date. They are never merged into one figure,
the memory is never called right or wrong, and no long dash appears anywhere in
the sentence.

**Unknown applicability is NAMED, never assumed current.** A `constraint` is a
constraint only inside the range he actually confirmed. With no range, or on a
day outside it, the label is `needs-review` and the sentence says "I do not know
whether it still applies, so I am not treating it as a restriction." Yesterday's
unavailability does not become a permanent remembered limitation.

---

## Refusal codes

| code | meaning | proof |
|---|---|---|
| `COACH_CONFIRMATION_REQUIRED` | a fact or a yes was not given | brief, tiers 1–2 |
| `COACH_CHECKIN_SURFACE_ABSENT` | no check-in lane open on this device | `checkin-model.mjs` |
| `CHECKIN_INPUT_INVALID` | an answer outside the approved sheet | `checkin-commands.cjs` `answersOf()` |
| `COACH_GYM_SESSION_ABSENT` | no session composed / no set in this phase | `gym-model.mjs` `read()` |
| `COACH_NO_QUALIFIED_COMPARISON` | the engine qualified no comparison | `today.cjs:63` `card.prev === null` |
| `COACH_FACT_COMMAND_ABSENT` | no durable field for this fact (equipment) | `checkin-commands.cjs` FIELDS · `t2-stage.cjs:9` |
| `LOCAL_COMMAND_UNSUPPORTED` | a command outside the staged five | `local-client.mjs:49` |
| `COACH_REPLAN_ENTRY_ABSENT` | no engine re-plan entry point for this fact | no producer in `rebuild/engine` |
| `COACH_ENGINE_ISSUED_NO_PROPOSAL` | the producer returned null | engine producer |
| `COACH_CONSENT_SURFACE_ABSENT` | no consent surface reachable | `rebuild/client/index.cjs` |
| `COACH_PROPOSAL_NOT_ENGINE_ISSUED` | an id or a number the model made up | `coach.issued` ledger |
| `COACH_COST_CAP_ABSENT` / `..._INVALID` | no verified spending cap | `cap.schema.json` |
| `COACH_OPT_IN_REQUIRED` | no per-user opt-in | brief, privacy |
| `COACH_NO_LIVE_ADAPTER` | correct — there is no live coach in this build | by design |
| `CONSENT_ISSUANCE_NOT_COMPENSATED` | the compensating accepted:false write did not store, so the durable row may still claim a yes | `rebuild/client/index.cjs` `recordIssuance()` |
| `COACH_MEMORY_TOPIC_REQUIRED` | a recall with no named subject | `memory-commands.cjs` `topicOf()` |
| `COACH_MEMORY_ABSENT` | nothing kept on that subject on this device | `earned/coach-memory/v1` |
| `COACH_MEMORY_UNREADABLE` | the store could not be authenticated; NOT the same as empty | `memory-host.mjs` `read()` |
| `COACH_MEMORY_LANE_ABSENT` | no memory lane open on this device | `local-world.mjs` `createMemoryHost` |
| `COACH_MEMORY_INPUT_INVALID` | a memory outside the closed shape | `memory-commands.cjs` `memoryOf()` |
| `COACH_MEMORY_CONFIRMATION_CANCELLED` | he cancelled that yes | `memory-tools.cjs` `cancel()` |
| `COACH_MEMORY_CONFIRMATION_SPENT` | one yes, one write | `memory-tools.cjs` |
| `COACH_MEMORY_CONFIRMATION_UNKNOWN` | no such yes in this conversation | `memory-tools.cjs` |
| `COACH_MEMORY_CONFIRMATION_MISMATCH` | the words moved after the yes | `memory-tools.cjs` |
| `COACH_MEMORY_READ_BACK_FAILED` | committed, and could not be read back; NOT a second write | `memory-host.mjs` `read()` |
| `COACH_MEMORY_TURN_BOUND` | the turn's five facts are spent; this call read nothing | `memory-tools.cjs` `openTurn()` |
| `COACH_MEMORY_WRITE_REFUSED` | the save THREW; a fixed code, the message in `detail` and then in `source` | `memory-host.mjs` `save()` |
| `COACH_MEMORY_TOOL_THREW` | the tool threw; a FIXED sentence, the message in `source` | `memory-tools.cjs` `dispatch()` |
| `MEMORY_TOOL_NOT_IN_LIST` | a name that is not a coach tool; a FIXED sentence, the name in `source` | `memory-tools.cjs` `TIERS` |

Engine and client codes are **never** reworded: whatever the accepted layer
returns reaches the coach with its own code and its own sentence.

## The cost cap

`verifyCostCap(record, { now, maxAgeDays = 30 })` and `startLiveSession({ cap,
now, optIn, user })`. No verified cap record → no live session, and there is no
override argument in the file (a test greps for one). `cap.schema.json` is the
shape; `cap.example.json` is a labelled example and says so. A cap record is a
receipt: any credential-shaped string in it fails verification.

**The shape example is not a cap.** Any record carrying an annotation key —
anything starting with `_` — is refused `COACH_COST_CAP_INVALID` before any other
check, so `cap.example.json` can never be mistaken for a cap on an account. The
suite's happy path is a synthetic live-shaped record built from the example minus
its annotations, never the file itself.

**The opt-in is per user.** `user` must be one of `NAMED_USERS` (`joe`, `dad`)
and `optIn` must be that user's own record
`{ user, accepted: true, accepted_at, screen_version, wording }` — a bare `true`,
a missing user, or another user's record all refuse `COACH_OPT_IN_REQUIRED`. The
`wording` must name the phone, the audio, the text and the fact that it leaves.

## Charter

`charterViolations(text)` runs the literal banned list `CHARTER_BANNED` over any
transcript: no urgency, streaks, gamification, nudging or dark patterns. Matching
is word-boundary, not substring — "explain" contains "xp" and a lint that fires
on that is a lint nobody keeps. Misses are stated plainly: the tests assert no
refusal is softened with sorry / unfortunately / great news / don't worry.

## No dashes in the UI

DECISIONS:114 (1), owner verbatim: **"no ai dashes are allowed in the ui"**. The
coach's spoken text is the UI, so no en dash (U+2013) and no em dash (U+2014)
appears in anything this lane writes for the athlete: a template's own words, a
tier-3 explanation, a refusal sentence, a cap or opt-in reason, a scripted
question. A colon, a comma or a new sentence says the same thing. Code comments
are not UI and keep theirs. `test/no-dashes.test.cjs` holds the line: a source
scan with comments stripped, a scan of every template's own literals, a sweep of
every reachable refusal and every cap/opt-in reason, and the full 25-turn
transcript with the tool results subtracted so what is measured is the coach's
own connective text.

**Engine prose is carried verbatim and still carries dashes.** That is the
existing rule (a refusal or a reason travels unedited, because inventing a
friendlier sentence is how a guess starts) and `rebuild/engine` is outside this
lane. The transcript's residual is counted and pinned so it cannot drift upward
unnoticed; clearing it is a `rebuild/engine` change.
