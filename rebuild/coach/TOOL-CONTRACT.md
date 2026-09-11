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
| `today_checkin` | 0 read | the recovery check-in — **no reader exists yet** |
| `why_this_instruction` | 0 read | the engine's own reason, unedited |
| `record_pain_or_soreness` | 1 fact | — **no durable command yet** |
| `equipment_unavailable_today` | 1 fact | — **no durable command yet** |
| `correct_set` | 1 fact | the accepted removal edit + a fresh set |
| `time_away` | 1 fact | — **no durable command yet** |
| `answer_checkin` | 1 fact | — **no durable command yet** |
| `request_replan` | 2 proposal | an engine producer issues the proposal + its reason |
| `accept_proposal` | 2 proposal | `rebuild/client` respond() + recordIssuance() |
| `cannot_change_via_coach` | 3 refused | phase, floors, progression rules, consent policy |

Tier 0 is not a tier in the ruling — the ruling's three tiers are the ones that
*write*. A read changes nothing, so it is numbered 0 and is never gated on a yes.

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

`display` is the whole traceability contract. `tools.untraceable(answer, results,
turn_id)` extracts every numeric token from `answer` and from every `display` the
turn produced, and returns the tokens the tools did not account for. A non-empty
return is a **RED** transcript. A rounding of a real value ("1.2" for 1.19) is
untraceable and fails, which is the point: a friendlier number is still a
different number.

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

### `today_checkin`
**in** `{}`. **out** `date`, `answered` (flag), `summary` (text).
**MISSING TODAY.** There is no recovery-check-in reader in the slice: Today's own
face labels the recovery and coach entries "— not wired yet"
(`rebuild/m3/w7-preview/today/today-app.cjs`), and A2 recorded "no skip/correction
wired". Refuses with `COACH_CHECKIN_SURFACE_ABSENT`.
When a reader exists it must keep the approved semantics verbatim: **blank is
unknown, never healthy/normal/zero**; a cleared detail never becomes an active
fact (approved handoff, Additions C, points 3–4).

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

### `record_pain_or_soreness`, `equipment_unavailable_today`, `time_away`, `answer_checkin` — NOT WIRED
**in** `{ "confirmed": true, "note": str }` (plus the check-in's own follow-ups
when they exist). **out** none.
**refuses with** `COACH_FACT_COMMAND_ABSENT`, naming
`rebuild/m3/w6/t2-stage.cjs:9` — the staged command set is exactly
`weighIn · logSet · logSession · finishSession · workout`, and anything else
reaches `throw new Error("Unsupported staged command")` at `t2-stage.cjs:84`.
Writing these anywhere else would be a fact that cannot survive a reload, so the
coach says plainly that it has not recorded it.

---

## TIER 2 — plan changes, only as ENGINE-ISSUED proposals

### `request_replan`
**in** `{ "fact": "volume"|"phase"|"ladder", "exerciseId": str? }`
**THIS TOOL TAKES NO NUMBERS.** Any numeric property in the input is refused with
`COACH_PROPOSAL_NOT_ENGINE_ISSUED`. That is the mechanical form of the ruling:
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

**Known gap.** `respond` is NOT in the W6 staged command set
(`rebuild/m3/w6/t2-stage.cjs:9`), so on a device whose client is reached through
the durable public client the yes cannot be written today. The consent surface is
therefore injected, and where it is absent the tool refuses. A live coach needs
`proposal-response` added to the staged commands first.

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
| `COACH_CHECKIN_SURFACE_ABSENT` | no recovery check-in reader | `today-app.cjs` "not wired yet" |
| `COACH_GYM_SESSION_ABSENT` | no session composed / no set in this phase | `gym-model.mjs` `read()` |
| `COACH_NO_QUALIFIED_COMPARISON` | the engine qualified no comparison | `today.cjs:63` `card.prev === null` |
| `COACH_FACT_COMMAND_ABSENT` | no durable command for this fact | `t2-stage.cjs:9`, `:84` |
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
now, optIn })`. No verified cap record → no live session, and there is no
override argument in the file (a test greps for one). `cap.schema.json` is the
shape; `cap.example.json` is a labelled example and says so. A cap record is a
receipt: any credential-shaped string in it fails verification.

## Charter

`charterViolations(text)` runs the literal banned list `CHARTER_BANNED` over any
transcript: no urgency, streaks, gamification, nudging or dark patterns. Matching
is word-boundary, not substring — "explain" contains "xp" and a lint that fires
on that is a lint nobody keeps. Misses are stated plainly: the tests assert no
refusal is softened with sorry / unfortunately / great news / don't worry.
