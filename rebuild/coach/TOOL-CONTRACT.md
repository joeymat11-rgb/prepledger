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
