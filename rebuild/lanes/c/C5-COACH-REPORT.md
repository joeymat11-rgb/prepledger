# C5 — VOICE COACH: tool contract + text-first prototype (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-coach`, **rebased onto `origin/rebuild/t2-client-core`
@ `292d01d`** after review round 2 (round 1 was written on `5dc9254`, round 2 on
`3bb2802`; every rebase has been clean — this branch is additions-only under
`rebuild/coach/**` and
`rebuild/lanes/c/**`). That tip carries C1/C2's `rebuild/m3/w6/local/**`, the port under
`rebuild/m3/setup/port`, and A3's recovery check-in. Owner ruling DECISIONS:89;
brief `rebuild/coach/VOICE-COACH-BRIEF.md` (read, not edited — it is the ruling).

**Isolated. Nothing outside `rebuild/coach/**` and this file is touched**, and the
W6 suite is untouched and unrun.

There is **no model, no network, no key and no live call** anywhere in this
delivery. The owner's hard spending-cap rule makes a live call impossible in this
task; the cap gate is built and proved instead.

## Files

Refreshed after review **round 2** (see the two sections at the end). Rows changed
in round 2 are marked **‡**; rows changed in round 1 and untouched since, **†**.

| file | lines | sha256 |
|---|---|---|
| `rebuild/coach/TOOL-CONTRACT.md` **‡** | 438 | `1cda03c55d5cca676fca1684d2172f37f19edf3fad993594ea3992dcef587f16` |
| `rebuild/coach/tools.cjs` **‡** | 1034 | `6616516cfc2fdb98e6a03cb816a1f22d615664d592fb21f5577ce847b3cf7a4f` |
| `rebuild/coach/local-world.mjs` | 183 | `776c4f307007c0d41d7afc449f1357a2aebcd05a25dedf7d0ecb2e79e3abf632` |
| `rebuild/coach/coach-text.cjs` **‡** | 269 | `116e08124af2078c0c082a1908f88648184910dc11b130db232b5d7d249d5604` |
| `rebuild/coach/model-adapter.md` **‡** | 179 | `c0cc0eff64702534e2974fd729082a1fbbf9d0f510d4b009a13b453d511481aa` |
| `rebuild/coach/scripts/questions.json` | 35 | `b50281309960805b00c7f9105616795388bdda9a17ed2e63869daa71dfdcee04` |
| `rebuild/coach/cap.schema.json` | 26 | `8bdb19765cc8a0fa9607aae86fe0d9aa2dff6dc1dedf694d73ecf3c89ac690bf` |
| `rebuild/coach/cap.example.json` | 14 | `341d8e4d01d9509d6a5e37876f9e1276c6335799d5b5402434f3b20b0a3b96da` |
| `rebuild/coach/test/traceability.test.cjs` **‡** | 286 | `0bfaa4606ee2fd0d0c842cc28f6856c1176ddee35b33d8d3a081b1b9a3f43686` |
| `rebuild/coach/test/tiers.test.cjs` **‡** | 333 | `4519c23e2ade5ade59ce2a22efd79c31ae64f4393d59be4a54e52138b3160404` |
| `rebuild/coach/test/local-era.test.cjs` | 225 | `304a310676a6c025f1d68f5da3e8d3044b9abc17c306d0e6db02608c3921e983` |
| `rebuild/coach/test/cost-cap.test.cjs` **‡** | 240 | `ab4a6d0d868a348a7438a9605076f6601ecbd2266a81057c8ebfbbe463d3664d` |
| `rebuild/coach/test/charter-and-gym-seam.test.cjs` | 152 | `868d8f19fa3e162a045c28914e1517cad364d1868b966b411de820afd0fc8281` |
| `rebuild/coach/VOICE-COACH-BRIEF.md` (unchanged) | 35 | `5d66dc611217f0a6f09dc12da721ee81d6bd4a6a2d706a4dfea84e8e966e3510` |

## Commands and counts (Windows, cmd.exe, node **v24.18.0**)

Node version MEASURED, not remembered: `node --version` on this PC prints
`v24.18.0`. The first round of this report said v24.19.0 and was wrong (review
C6(ii)); the reviewer measured v24.18.0 too.

```
node --test "rebuild/coach/test/*.test.cjs"
    tests 58 · suites 0 · pass 58 · fail 0 · cancelled 0 · skipped 0 · todo 0
```
(the quoted glob matters — `node --test rebuild/coach/test/` treats the directory
as a single test file on this build and fails.)

**The one-line `test` script** for whoever adds the CI step (review C7 — I did not
edit `.github`, it is PM-owned):
`"test": "node --test \"rebuild/coach/test/*.test.cjs\""`.
It needs no dependency, no `package.json` and no install: the suite is plain
`node:test` + `node:assert`, and `fake-indexeddb` is reached through
`rebuild/m3/w6/test/support.mjs` exactly as the A2 and C4 suites reach it.

| suite | tests | result |
|---|---|---|
| `traceability.test.cjs` | 16 | pass |
| `tiers.test.cjs` | 13 | pass |
| `local-era.test.cjs` | 9 | pass |
| `cost-cap.test.cjs` | 12 | pass |
| `charter-and-gym-seam.test.cjs` | 8 | pass |

```
node rebuild/coach/coach-text.cjs
    turns: 25 · untraceable turns: 0 · charter violations: 0   (exit 0)
node --check rebuild/coach/tools.cjs        → OK
```

The scripted coach answers **25** questions (the brief's floor was 12). The CLI
runs engine-only (no durable lane), which is the honest offline shape; the local
era, the gym and the check-in are exercised in `local-era.test.cjs`, where the
same script runs again with every lane open.

## The store seam: repointed at the local era

`rebuild/coach/local-world.mjs` (new) opens the world `tools.cjs` takes. It is
C1/C4's ONE local installation and nothing else:

- `openLocalDurableClient({ …, workoutCommands: createWorkoutCommands({ prescriptionCapture }) })`
  → `enroll()` on first run → `boot()`. Status after open: `{ state: "ready", code: "LOCAL_READY" }`.
- the morning reading is `client.execute('weighIn', { date, lb })`, presented to
  the slice's own `createTodayModel({ readings })` through a thin shape adapter
  (every value is the client's published face; every refusal is its own answer);
- the workout is `client.hostBindings()` → the accepted `composeWorkoutHost`,
  composed exactly as the C4 journey composes it (`createDurablePublicClient`,
  the accepted registrars/readers/projectors, `createEngineRuntime` with
  `createUnavailableNativeTrendContext`, causal parents DERIVED per resolution
  through the accepted `causalTips`) → `createGymModel`;
- the check-in is `createCheckInHost` + `createCheckInModel`.

**Executed, not asserted:** a weigh-in then a Start leaves the sealed generation
with **2** operations — one client, one generation, one lease.
`Object.keys(bindings)` is exactly the twelve durable-client scope members, no
thirteenth.

### Does `local-client.mjs` widen the staged command set? **NO.**

`rebuild/m3/w6/local/local-client.mjs:49` carries
`new Set(["weighIn","logSet","logSession","finishSession","workout"])` — the
IDENTICAL five as `rebuild/m3/w6/t2-stage.cjs:9`. A test parses both files and
asserts set equality, so a later widening cannot pass silently. The local client's
only difference is that `execute()` refuses an unknown command **in words** —
`{ acknowledged:false, state:3, code:"LOCAL_COMMAND_UNSUPPORTED" }` — instead of
the stage's `throw new Error("Unsupported staged command")` at `t2-stage.cjs:84`.
`client.execute('respond', …)` is executed in the suite and refuses exactly so.

What actually changed on this tip is different and better: **`workout` is the one
PRODUCER-INJECTED command**, and `rebuild/m3/w7-preview/today/checkin-commands.cjs`
is a producer for it. That is how a dated non-workout fact now reaches disk
without editing `rebuild/client` or the stage — and it is why four of the five
tier-1 tools moved from refusing to writing.

## Engine and layer seams: PRESENT on the tip

| tool | seam (file:line) | state |
|---|---|---|
| `today_plan` | `energy.cjs:684` `calorieTarget` · `energy.cjs:117` `proteinTarget` · `today.cjs:405` `statusFace` · `today.cjs:465` `marchingOrder` · `today.cjs:630` `nowModel` · `today.cjs:63` `genSession` | real |
| `weight_trend` | `energy.cjs:225` `currentRate` · `energy.cjs:331` `readRecency` · `writers.cjs:424` `applyRead` over the local client's own reading ops | real |
| `why_this_instruction` | `today.cjs:279` `theOneFix` · `today.cjs:226` `fiveLevers` · `energy.cjs:684/.why/.wkWhy` · `energy.cjs:117/.why` · `energy.cjs:369` `observedTDEE.stepsWhy` · `energy.cjs:493` `calorieFloor.why` · `today.cjs:405` `statusFace` | real |
| `current_set` / `next_set` | `gym-model.mjs` over `composeWorkoutHost` on the LOCAL bindings; behind them `today.cjs:63`, `progression.cjs:261` `targetsFor`, `progression.cjs:19` `progressStep` | real |
| `last_comparable_performance` | `today.cjs:63` `genSession` → `card.prev` via `gym-model.previousLine` | real (returns null on this athlete — see below) |
| `today_checkin` | `checkin-model.mjs` `createCheckInModel().read()` over `checkin-host.mjs` | **NEW — was missing at the old base** |
| `record_pain_or_soreness` | `checkin-model` draft (`choose`/`toggleIssue`/`set`) → `save()` → `checkin-host.save()` → `client.execute('workout', {action:'checkin'})` | **NEW** |
| `time_away` | same lane, `away` issue + `away_days`/`away_reason` | **NEW** |
| `answer_checkin` | same lane, the four choice groups + sleep (confirm or explicit rejection) | **NEW** |
| `correct_set` | `gym-model.undo` → `prepareWorkoutEdit` + `commitWorkoutEdit({remove})`, then `gym-model.logSet` | real |
| `request_replan` (`volume`) | `volume.cjs` `volumeImbalance` — issues only when `actionable` (Pelland 2025 SDES) | real |
| `accept_proposal` | `rebuild/client/index.cjs:271` `respond` · `:338` `recordIssuance` · `:161` `answers()` | real, but **injected** — see missing |

Executed in `local-era.test.cjs`: a pain/soreness check-in writes ONE dated
operation carrying `soreness:"Mild"`, `issues:["pain"]`, `pain_change:"New"` — and
`energy: undefined`, because **an unanswered question is ABSENT, not null**. Time
away stores `away_days: {value:7, unit:"day"}`. An invented choice ("energy:
Amazing") is refused `CHECKIN_INPUT_INVALID` and writes nothing. Sleep is not
asked twice: `confirm_sleep_record` stores `sleep_hours_source:"existing-record"`
with `sleep_hours_record_date:"2030-02-03"`, the date of the confirmed night.

## Seams still MISSING on the tip, with the exact refusal

| what | refusal code | proof |
|---|---|---|
| a durable field for **equipment unavailable today** | `COACH_FACT_COMMAND_ABSENT` | `rebuild/m3/w7-preview/today/checkin-commands.cjs` `FIELDS` has no equipment field; it is not a workout command and not a plan verb. `answersOf()` would refuse it (`CHECKIN_INPUT_INVALID`), so the coach refuses first |
| the **consent write** through any staged client | `COACH_CONSENT_SURFACE_ABSENT` | `respond` is in neither `t2-stage.cjs:9` nor `local-client.mjs:49`; `client.execute('respond', …)` → `LOCAL_COMMAND_UNSUPPORTED`, state 3 (executed). The consent surface is therefore injected (`rebuild/client` directly) and the tool refuses where it is absent |
| an engine entry point that **re-plans on coach facts** (pain, equipment, time away) | `COACH_REPLAN_ENTRY_ABSENT` | no producer in `rebuild/engine` takes them. Producers that exist (`volumeImbalance`, `policy.phaseProposal`, `progression.proposeLadder`, `trialProposals`) read state, not conversation facts |
| a **local engine→proposal issuer** into the client's proposal list | — | `rebuild/client/face.cjs:56` `layer2()` takes `proposals` from the AUTHORITY SNAPSHOT. There is no local issuer, so the coach keeps its own sealed issued-ledger keyed by a sha256 of the engine's own object |
| the check-in on the **local era** | — | `checkin-host.mjs` mints its own lease/era (its own database, namespace and producer). `world.checkInOnLocalEra === false`, disclosed rather than hidden; a lane-c-today merge away |
| a **second training day** for a fresh athlete | `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` (`rebuild/engine/performed.cjs:193`) | the S2 blocker (DECISIONS:103, lane B's B-NTC). Carried verbatim by `current_set` |
| **legacy (post-port) day ordering** | `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` (`performed.cjs:180,183`) | same open boundary |
| **progression reset mapping** | `PROGRESSION_RESET_MAPPING_REQUIRED` (`rebuild/engine/progression.cjs:117`) | carried verbatim |

Every one of these is a typed `unavailable` whose `reason` is itself a tagged
value, so the coach reads the refusal aloud without inventing a friendlier
sentence, and `state_unchanged: true` travels with it.

Observed on the synthetic athlete: `genSession(...).ex[].prev` is **null** — the
engine qualifies no comparison — so `last_comparable_performance` takes the
`COACH_NO_QUALIFIED_COMPARISON` branch. That is the engine answering, not a gap.

## What the four acceptance tests prove

**(a) TRACEABILITY.** Every numeric token in every answer maps to a tagged tool
value from the same turn. Fail-closed is proved twice: a tampered template saying
"2500 calories" turns exactly that turn RED with token `2500`, and a *plausible
rounding* — "1.2 pounds a week" where the engine said 1.19 — also turns RED.
Provenance cannot be borrowed across turns, and a static scan proves **no template
string contains a digit**. The same script re-runs over the LOCAL era with every
lane open and stays at zero untraceable tokens.

**(b) TIER 2.** Over the REAL `rebuild/client` consent surface: issuing a proposal
leaves the durable store byte-identical; accepting without `confirmed:true` leaves
it byte-identical and records no answer; with the yes,
`done.accepted.proposal` **deep-equals** the engine's own object (recomputed
independently from `volumeImbalance` — `hams`, 4 weekly sets now, `need` 6, `why`
verbatim), the reason is stored **in this process**, and the yes lands as a
`proposal-response` operation in `client.face().answers` with the same `op_id`.
The reason is **not on disk** — the suite now asserts that gap explicitly (see
C3 below). `request_replan` refuses **a number anywhere in its payload — top
level, nested in an object, or inside an array, to depth 8** — and any id the
engine did not issue. A numeric STRING (`"7"`, `"make it 7 sets"`) is accepted
and reaches nothing: the issued body and the proposal id are byte-identical to
the clean call, and the suite asserts that equality rather than claiming a
refusal that does not happen.

**(c) TIER 3.** All five topics refused with an explanation, `state_unchanged`,
store byte-identical.

**(d) COST CAP.** No record → refuse. Nine invalid shapes refuse with a reason.
Ten credential shapes refuse the record. **`cap.example.json` itself refuses** —
any record carrying an annotation key is not a cap on an account (C1), and the
suite's happy path is a synthetic live-shaped record, not the placeholder file.
The opt-in is **per user**: a bare `true`, a missing user and another user's
record all refuse (C4). A verified cap plus that user's own opt-in **still**
starts nothing (`COACH_NO_LIVE_ADAPTER`). A test greps `tools.cjs` for escape hatches
(identifier-boundary, so "enforces" is not mistaken for "force") and greps all
three source files for network symbols — none present.

**Charter lint.** 38 literal phrases, word-boundary matched. Zero violations over
the transcript (engine-only and local-era runs) and over the coach's own copy. No
refusal is softened with sorry / unfortunately / great news / don't worry.

## The two "not decided" defaults I took

The brief lists two open questions with defaults and says to bring them to the
owner only if they block. Neither blocks; both defaults are taken, and both are
reversible without touching the tool contract.

1. **Which backend answers free-form questions → ENGINE-ONLY TOOLS FIRST.**
   `coach-text.cjs` has no model at all: every answer is a template over tool
   results. A text model, when it comes, is an adapter in the same loop
   (`model-adapter.md` §1) and needs no new tool. Consequence, stated plainly:
   this coach answers the 25 scripted questions and nothing else — an unscripted
   question throws `COACH_UNKNOWN_INTENT` rather than improvising.
2. **Reachable during a set, or only between sets → BETWEEN SETS ONLY.**
   `current_set` reports the live set and `next_set` the one after; neither
   offers an action, and no tool is callable from an active-set screen in this
   design. Making the coach reachable mid-set is a screen decision later, not a
   tool change.

## Residuals — what this is NOT

- **No model.** Nothing calls GPT-Live-1 or any other model. The templates are the
  stand-in, and they are the bar the adapter must clear.
- **No voice.** No audio in, no audio out, no full-duplex anything.
- **No UI.** The approved design's Coach tab ("quiet Today and contextual entries
  to the already approved staged conversation", Additions C point 5) is not built.
- **No cap on any account.** `cap.example.json` is labelled SHAPE ONLY in its own
  first field, and since round 1 the verifier **refuses it by name**. The gate
  exists and refuses; the cap itself is an owner action on the provider's billing
  page.
- **No opt-in screen built.** The words are drafted in `model-adapter.md` §5 and
  `startLiveSession({cap, now, optIn, user})` refuses without a per-user opt-in
  record. Nobody has seen the screen; what exists is the gate it will feed.
- **Dad's hand test is later** — after Joe's own week of use, per the brief.
- **Not run here:** the W6 suite, the A1/A2/A3/A5 suites, `--ci`, `--full`.
  Untouched by construction; this branch adds only `rebuild/coach/**` and this
  report.
- **The check-in lane is not on the local era yet** (`checkInOnLocalEra: false`).
- **The consent write is injected**, not reached through any staged client.
- **`C4-ONE-STORE-REPORT.md` and `C4B-REPORT.md` are not on this tip.** They are
  not in `rebuild/lanes/c/` at `5dc9254`, so the wiring here was read off the
  modules themselves (`local-client.mjs`, `host-bindings.mjs`,
  `local-host-journey.test.mjs`, `checkin-host.mjs`, `checkin-commands.cjs`).
  Likewise `rebuild/m3/w6/local/today-bindings.mjs` does not exist on this tip —
  `createGymHost` is in `rebuild/m3/w7-preview/today/gym-host.mjs` and
  `createCheckInHost` in `checkin-host.mjs`, and `local-world.mjs` composes the
  gym over the local bindings directly, as the C4 journey does.

## Suggested order for whoever picks this up

1. A **consent** command — `proposal-response` in the staged set, or a
   producer-injected consent command the way the check-in got one. That is the
   single change that makes tier 2 work on a phone.
2. Put the **check-in lane on the local era** (lane-c-today) so the coach's facts
   and the coach's reads share one installation.
3. An **equipment** field (check-in sheet or a workout fact) → the last tier-1
   tool stops refusing.
4. **B-NTC** (`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`) → the coach can see more
   than one training day for a fresh athlete.
5. Only then a model adapter, and only behind a real cap.

## Review round 1 — conditions applied

Independent review: `rebuild/lanes/c/C5-COACH-REVIEW.md` (copied into this branch
byte-identical from the reviewer's commit `022ae8a`). Verdict **ACCEPT WITH
CONDITIONS**, reviewed at `e576905`. All seven conditions are addressed below;
every one was written RED first and is quoted with the measurement, not a claim.

Suite: **46 → 54** tests, 54 pass / 0 fail, measured on the head **after** the
rebase onto `origin/rebuild/t2-client-core` @ `3bb2802`. CLI unchanged at 25
turns · 0 untraceable · 0 charter violations. Isolation re-verified on the
rebased head: `git diff --stat 3bb2802..HEAD -- rebuild/m3 rebuild/engine
rebuild/client rebuild/conform rebuild/m4 .github` is **empty**, and
`git diff --stat 3bb2802..HEAD` is 15 files, **3979 insertions, 0 deletions** —
`rebuild/coach/**` plus this report and the review copy, nothing else.

**One rebase-induced test fix**, disclosed rather than hidden: the new tip
rewrote `rebuild/m3/w7-preview/today/checkin-host.mjs` to bind the device's one
local era (`commands: createCheckInCommands()`) instead of composing a store of
its own, so two SOURCE-READING assertions in
`test/tiers.test.cjs` ("the staged command set is NOT widened by the local era")
no longer matched. They now read the producer-injection claim out of
`checkin-commands.cjs`, where the claim is actually made, plus the one line in
`checkin-host.mjs` that passes the producer down. No behaviour assertion changed
and nothing under `rebuild/m3` was touched — the check-in's real durable write is
proved by execution in `local-era.test.cjs`, which passes unchanged on the new
tip.

### C1 (BLOCKING) — the cap gate green-lit its own shape example

RED at `e576905`: `verifyCostCap(cap.example.json)` returned `ok: true`, and
`startLiveSession` with it reached `COACH_NO_LIVE_ADAPTER` — past the one gate in
front of real money, stopped only by the accident that no adapter exists.

GREEN now. `verifyCostCap` refuses, before any other check, **any record carrying
a key that starts with `_`**: `{ ok:false, code:"COACH_COST_CAP_INVALID",
reason:"this is the shape example, not a cap on any account (it carries _note)" }`.
It is the annotation that refuses it, not a hard-coded filename, so `_todo` or a
bare `_` refuse too. `startLiveSession({cap: example, …})` now returns
`COACH_COST_CAP_INVALID` and the test asserts `notEqual(code,
"COACH_NO_LIVE_ADAPTER")` — it must not get far enough to discover the missing
adapter. `test/cost-cap.test.cjs`'s `good()` is rebuilt as a **synthetic
live-shaped record** (the example minus every annotation key), so the suite no
longer asserts that the non-cap is a valid cap. An array is also refused
(`COACH_COST_CAP_ABSENT`) rather than falling through the object path.
New test: *"THE SHAPE EXAMPLE IS NOT A CAP: the file that says so is refused, and
starts nothing"*.

### C2 — traceability is now keyed on unit/field, not on the turn

RED at `e576905`: the allowed set was one untyped `Set` of digit strings, so any
number the turn produced licensed any sentence. All five of the reviewer's
must-refuse strings returned `[]`.

GREEN now, and this is the bar the model adapter must clear.

- `allowedTokens(results, turn_id)` returns a **Map from token to the set of
  UNITS** the turn licensed it in. A tag with a real unit licenses its tokens in
  that unit; engine prose (`unit: "text"`) is read with the same parser a spoken
  sentence is read with, so `"2300 kcal on 8,500 steps"` licenses `kcal:2300`.
- `untraceable()` parses each spoken number **together with the unit/field words
  around it** (`UNIT_WORDS`, a filler list it may travel over, never crossing a
  sentence end; `4 sets a week` and `1.19 pounds a week` read as rates).
- A number with no unit word around it is licensed by any quantity in the turn —
  but **never by a `date`**. Date tags do not license bare numbers.
- On the answer side **every interpolation declares its unit**:
  `d(v.kcalLo, "kcal")`, `d(v.proteinG, "g")`, `d(v.rate, "lb/wk")`,
  `d(v.setPosition, "set")`, `d(v.sleepRecordDate, "date")`. `d()` throws
  `COACH_UNIT_MISMATCH` if the tag's unit is not the declared one, and throws
  `TypeError` if no unit is declared at all. Tested both ways.

Measured on `today_plan` (allowed: `2262=kcal`, `2360=kcal`, `155=g`,
`2030/02/04=date`), the reviewer's own six strings, verbatim:

| said | before | now |
|---|---|---|
| `Eat 155 calories today.` | `[]` GREEN | `["155"]` **refused** |
| `Your protein target is 2262 grams.` | `[]` GREEN | `["2262"]` **refused** |
| `Add 2030 weekly sets.` | `[]` GREEN | `["2030"]` **refused** |
| `Rest 155 minutes between sets.` | `[]` GREEN | `["155"]` **refused** |
| `Your weight is 2262 pounds.` | `[]` GREEN | `["2262"]` **refused** |
| `Today: 2262–2360 kcal · 155 g protein` | `[]` | `[]` **accepted** |
| `Your calorie band today is 2262 to 2360.` | `[]` | `[]` **accepted** |
| `Your protein target is 155 grams.` | `[]` | `[]` **accepted** |

New tests: *"a number is traceable only INTO THE FIELD THAT LICENSED IT"*,
*"a date tag licenses a date, never a bare quantity"*, *"every interpolation
declares the unit it speaks into"*. The CLI stays at **25 turns / 0 untraceable**
and the local-era script run stays green, so nothing was bought with a
false-red-tolerant instrument.

### C3 — the test no longer reads an in-memory Map as durable proof

The old test was headed *"…and the reason is stored"* and proved it against
`done.accepted.reason`, a field on a `Map` that dies with the process.

Renamed to *"…equals the engine's proposal exactly (in memory)"*, and a new test
*"tier 2: EXACTLY what the durable store keeps after a yes — and the reason is
NOT on disk"* asserts the store contents rather than a promise:

- exactly **one** op, `kind:"proposal-response"`, payload deep-equal to
  `{ proposal_id, answer:"accept" }` — no third field;
- exactly **one** issuance, deep-equal to `{ id, accepted:true, instance:null }`;
- the engine's reason, the producer name and the proposal body are each asserted
  **absent** from the raw dump;
- a freshly booted client over the same backend keeps exactly
  `[{proposal, answer:"accept", op_id}]` and `issuedInstance() === null`;
- a coach rebuilt over that fresh client has `acceptedProposals() === []`,
  `issuedProposals() === []`, `consentLedger() === []`.

**The reason is NOT on disk**, and the comment in the test says so and says why:
`rebuild/client`'s existing `proposal-response` path has **no reason slot**
(`index.cjs:271 respond()` commits `{proposal_id, answer}`; `:338
recordIssuance()` writes `{id, accepted, instance}`; `:161 answers()` reads them
back). The brief names that existing path, so the gap is in `rebuild/client`, not
in the coach — and **`rebuild/client` is untouched**. The lane lead has put the
question *"does DECISIONS:89's 'recorded with the reason' mean on disk?"* to the
PM; this test goes RED the day a durable reason lands, which is the point.
`model-adapter.md` §8.2 now carries the same statement.

### C4 — the opt-in is per user

RED at `e576905`: `startLiveSession({optIn: true})` reached
`COACH_NO_LIVE_ADAPTER` and `user` was silently ignored — one `true` opened the
gate for anybody, while `model-adapter.md` §5 claimed it was per user.

GREEN now. `startLiveSession({ cap, now, optIn, user })`:

- `user` must be one of `NAMED_USERS = ["joe","dad"]`. Absent, empty, a third
  name, a number or an object → `COACH_OPT_IN_REQUIRED`.
- `optIn` must be a **record**, not a boolean:
  `{ user, accepted:true, accepted_at, screen_version, wording }`.
  `{optIn: true}` and `{optIn: true, user:"joe"}` both refuse.
- `optIn.user` must equal `user`. Joe's record with `user:"dad"` refuses with
  *"One user's yes never speaks for another."*
- `wording` must be the text the user actually saw and must name the **phone**,
  the **audio**, the **text** and that it **leaves** — nine wording and shape
  patches are asserted to refuse, including *"Turn on the voice coach for a
  better experience."*
- each named user's own record reaches `COACH_NO_LIVE_ADAPTER`, and only theirs.

New tests: *"the opt-in is PER USER: one person's yes never speaks for another"*,
*"the opt-in record must carry the wording the user actually saw"*.
`model-adapter.md` §5 now describes what the code does instead of over-claiming.

### C5 — the turn-scoping guards are now load-bearing

RED at `e576905`: the reviewer deleted **both** guards in `allowedTokens()` and
46/46 stayed green (mutants M7, M7b, M7c).

GREEN now, and measured by mutation in this worktree, each guard on its own:

| mutant | traceability suite |
|---|---|
| both guards → `if (false) continue;` | **fail 1** — *"turn B borrowed turn A's provenance out of a pooled array"* (`[]`, expected `["2262"]`) |
| inner per-tag guard only | **fail 1** — *"a tag from another turn licensed this one"* |
| outer per-result guard only | **fail 1** — *"a result belonging to turn A licensed turn B because one tag inside it was stamped B"* |
| unmutated | **14/14 pass** |

The new test *"the turn guards are load-bearing: a POOLED results array cannot
lend provenance"* carries the reviewer's own case verbatim —
`T.untraceable("Eat 2262 calories.", tA.results.concat(tB.results), "B")` →
`["2262"]` with the guards, `[]` without — plus the same pooled array scoped to
`"A"` (→ `[]`, so the test measures the guard rather than the absence of the
number), and one forgery per guard. `tools.cjs` itself is unchanged here: the
guards were correct, they were simply unproved. **Guards restored byte-identical
after the mutation run** (the sha256 in the file table is the restored file, and
the suite is green on it).

### C6 — the two over-claims

(i) `request_replan` now **walks the payload** (objects and arrays, depth 8)
instead of reading only the top level. `{fact:"volume", note:{sets:7}}`,
`{fact:"volume", n:[7]}` and `{fact:"volume", deep:{a:{b:{c:[{d:7}]}}}}` are all
refused `COACH_PROPOSAL_NOT_ENGINE_ISSUED`. A numeric **string** is still
accepted, and the report and `TOOL-CONTRACT.md` now say so precisely: the test
asserts the issued proposal from `{fact:"volume", addWeeklySets:"7", note:"make
it 7 sets"}` deep-equals the clean call's, so the extra arguments demonstrably
reach nothing.

(ii) **Node version fixed.** Measured `node --version` → **v24.18.0**. The round-1
line said v24.19.0 and was wrong; the header of the counts section now carries the
measured value and says it was measured.

### C7 — CI (PM-owned; `.github` NOT touched)

I did not edit `.github` and this branch changes nothing there (`git diff --stat`
against `.github` is empty). The one line the integrator needs is in the counts
section above:

```
node --test "rebuild/coach/test/*.test.cjs"
```

as a `test` script: `"test": "node --test \"rebuild/coach/test/*.test.cjs\""`.
No dependency, no `package.json`, no install — plain `node:test` + `node:assert`,
with `fake-indexeddb` reached through `rebuild/m3/w6/test/support.mjs` exactly as
the A2 and C4 suites reach it. **Until that step exists, the CI half of
`LANES.md:16`'s bar has not been met for this delivery** and the ledger line
should say so: the merge decision rests on the independent review alone.

### Not done, and why

- **The reason on disk (C3's decision).** Not mine to take: it is a
  `rebuild/client` change and `rebuild/client` is outside this lane's write
  scope. The question is with the PM; the test states the gap meanwhile.
- **The CI step (C7).** PM/integrator-owned; `.github` is outside this lane's
  write scope.
- **R2's residuals** — no model, no voice, no UI, no cap on any account, no
  opt-in screen — are unchanged and still disclosed above.

## Review round 2 — C8/C9/C10 applied

Round 2 of the independent review (`rebuild/lanes/c/C5-COACH-REVIEW.md`, the
reviewer's commit `23a3533`, copied in here) re-executed every round-1 condition
at `be888dd` and closed C1–C6; C7 stays PM-owned. Its verdict is **ACCEPT WITH
CONDITIONS with nothing blocking**, and it left three cheap carry-forwards. All
three are applied below, each written RED first and each quoted with the
measurement.

Suite: **54 → 58** tests, 58 pass / 0 fail. CLI unchanged at 25 turns ·
0 untraceable · 0 charter violations. `node --check rebuild/coach/tools.cjs` OK.
All three measured on the head **after** the rebase onto
`origin/rebuild/t2-client-core` @ `292d01d` (clean, no conflict). Isolation
re-verified there: `git diff --stat 292d01d..HEAD -- rebuild/m3 rebuild/engine
rebuild/client rebuild/conform rebuild/m4 .github` is **empty**, and
`git diff --stat 292d01d..HEAD` is 15 files, **4634 insertions, 0 deletions** —
`rebuild/coach/**` plus this report and the review copy, nothing else.

### C8 — deleting the unit word no longer buys a free number

RED at `be888dd`. The checker read only RIGHTWARD and treated an unrecognised
noun as "no unit", so a bare number was licensed by any quantity in the turn.
Every one of these was **ACCEPTED**:

| said | round 2 (`be888dd`) | now |
|---|---|---|
| `Your protein target is 2262.` | `[]` GREEN | **`["2262"]` refused** |
| `Rest 155 seconds.` | `[]` GREEN | **`["155"]` refused** |
| `Protein: 2262. Calories: 155.` | `[]` GREEN | **`["2262","155"]` refused** |
| `Your calorie floor is 155.` | `[]` GREEN | **refused** |
| `You weigh 2262.` | `[]` GREEN | **refused** |
| `Add 155 kilograms.` | `[]` GREEN | **refused** |
| `Your body fat is 2360 percent.` | `[]` GREEN | **refused** |
| `Your target is 2262.` (no field word at all) | `[]` GREEN | **refused** |
| `Your protein target is 155 grams.` | `[]` | `[]` **accepted** |
| `Eat between 2262 and 2360 kcal.` | `[]` | `[]` **accepted** |
| `Today: 2262–2360 kcal · 155 g protein` | `[]` | `[]` **accepted** |
| `Your calorie band today is 2262 to 2360.` | `[]` | `[]` **accepted** |
| `Protein: 155. Calories: 2262.` (labels used correctly) | `[]` | `[]` **accepted** |

Three changes, all in `untraceable()`'s reading of a sentence — no change to what
the tools return:

1. **The field binds LEFTWARD too.** `FIELD_WORDS` adds the nouns that name a
   field rather than a unit (`protein`, `maintenance`, `weigh`, `bodyweight`,
   `rest`, `sleep`, …) on top of the whole unit vocabulary, and `unitBefore()`
   reads them: the label form (`Protein: 2262`) and the subject form (`your
   calorie floor is 155`). Rightward still wins where both answer. Neither scan
   crosses `.`, `!`, `?` or `;` — a clause is the unit of reading.
2. **An unrecognised noun is a unit, not an absence.** `unitAfter()` now returns
   `"!" + noun` for a word it does not know, so `155 seconds` asks for
   `!seconds:155` and `155 kilograms` asks for `!kilograms:155`. Neither is
   licensed unless the ENGINE ITSELF used that word — which is the fail-closed
   posture the rest of the file already takes, and which also keeps engine prose
   passing verbatim (`8–10k`, `0.79pp`) because both sides read the same words.
   `percent`/`pct`/`pp` were added to the declared vocabulary as `pct`.
3. **A bare number is refused unless its field is declared bare-speakable.**
   `BARE_SPEAKABLE` is an explicit frozen set — `set`, `rep`, `lift`, `reading`,
   `pct`, and `?` (a figure the engine itself stated with no unit). A calorie
   band, a protein floor, a bodyweight, a rate, a duration and **a date** are not
   in it, so `"Your target is 2262."` refuses where round 1's "any non-date unit"
   rule let it through.

One template had to start speaking its unit, which is the point of the condition:
`weight_trend`'s range now reads *"somewhere between 1.14 and 1.24 **pounds a
week**"* instead of a bare pair. Nothing else changed — and the digit-free
template scan still passes, so no figure was hard-coded to get there.

Mutation, measured here, each mutant reverted immediately:

| mutant | suite |
|---|---|
| M13 leftward binding removed (`unitBefore` never consulted) | **fail 2** — *"a number is traceable only INTO THE FIELD THAT LICENSED IT"* and *"deleting the unit word…"*, both on `WRONGLY RED: Your calorie band today is 2262 to 2360.` — leftward binding is what keeps the legitimate label form green |
| M14 bare rule reverted to round 1's "any non-date unit" | **fail 1** — *"deleting the unit word…"*, `STILL GREEN: Your target is 2262.` |
| M15 unrecognised noun read as "no unit" (the round-1 behaviour) | **fail 1** — *"an unrecognised unit noun licenses nothing but itself"* |
| unmutated | **58/58 pass** |

Stated plainly: the REFUSALS in C8 are carried by M14's rule (bare) and M15's rule
(unknown noun); **leftward binding is the precision half** — it exists so the fix
does not buy its refusals with false reds on sentences like *"Your calorie band
today is 2262 to 2360."* Both halves are now load-bearing and both die under
mutation. New tests: *"deleting the unit word does not make a number free: the
field still binds"* (the reviewer's three probes verbatim, plus the rest of their
round-2 table and the must-accepts) and *"an unrecognised unit noun licenses
nothing but itself"*.

### C9 — the two surviving mutants

**S1 — a date never licenses a bare number.** The rule was real and correct but
unasserted: deleting it killed no test. The existing date test now also asserts
the BARE case, which is where the rule actually lives:
`BARE_SPEAKABLE.has("date") === false`; `parseUnits("Give me 2030.")` → `[null]`
(so the probe really is a bare number); `untraceable("Give me 2030.")` →
`["2030"]`; `untraceable("Do 2030 of them.")` → `["2030"]`. And, so the test
measures the date exclusion rather than a blanket refusal of bare numbers, a
`set`-tagged figure in the same shape is still accepted: on the `request_replan`
turn, `untraceable("Give me 6.")` → `[]`.
*Mutant M16* — adding `"date"` to `BARE_SPEAKABLE` → **fail 1**, *"a date tag
licenses a date, never a bare quantity"*, message `a date became bare-speakable`.

**S2 — two named users only.** DECISIONS:89 and the brief: *"two named users only
— Joe and Dad"*, a third needs a separate owner ruling. Implemented and unproved:
removing `NAMED_USERS.includes(user)` killed nothing, and a third person with a
perfectly-formed opt-in of her own would have started a session. New test
*"TWO NAMED USERS ONLY: a third user's own valid opt-in still refuses"* builds
`mum`/`sam`/`guest` records that match in every respect — right user, `accepted:
true`, valid timestamp, screen version, and wording that names the transfer
plainly — and asserts each refuses `COACH_OPT_IN_REQUIRED` naming *joe or dad*.
It also pins the roster (`["dad","joe"]`), rejects the near-misses `"Joe"` and
`"joe "`, and re-asserts that the two ruled-on users still reach
`COACH_NO_LIVE_ADAPTER`, so it measures the roster and not a blanket refusal.
*Mutant M17* — `NAMED_USERS.includes(user)` → `!!user` → **fail 1**, message
`mum started a session without an owner ruling`.

**S3** — `Array.isArray(record)` in `verifyCostCap` — the reviewer judged it a
near-equivalent worth no test (without it an array still refuses, with a
different code). I agree and left it.

### C10 — one BEHAVIOURAL assertion for producer injection

The round-1 rebase left two of three assertions matching COMMENT PROSE in
`checkin-commands.cjs`, which can drift from the code it describes. Both are gone.
What stands now:

- **code, not prose**, in *"the staged command set is NOT widened by the local
  era"*: the stage's own signature —
  `function createT2Stage(configProvider, { allowInbound = false, workoutCommands: selectedWorkoutCommands = workoutCommands })`
  (`t2-stage.cjs:19`) — is the injection point, and `checkin-host.mjs:48` passes
  the check-in's provider down to the one local era
  (`commands: createCheckInCommands()`). The two COMMANDS sets are still parsed
  and compared as before.
- **EXECUTED**, in the new test *"the check-in's producer, EXECUTED: it authors
  the op the client will write"*: it calls `createCheckInCommands()` and runs
  `prepare({action:"checkin", input:{answers:{soreness:"Mild"}, effective:{…}}})`,
  asserting the producer — not the client — authors `class:"event"`,
  `kind:"fact"`, `payload.profile`, `payload.answers` and `effective.local_date`,
  and that `schemaVersion` is 2 (the client's requirement for a producer-injected
  command). It then proves the channel is CLOSED: `prepare` throws
  `CHECKIN_INPUT_INVALID` for `action:"logSet"` and for an invented answer
  (`energy:"Amazing"`), and the producer's own `validate()` accepts the envelope
  it authored and rejects one whose `kind` was changed.
*Red-first (M18):* replacing the producer with a stub that returns
`{class:"reading", kind:"read", payload:{}}` turns the test **RED** (`fail 1`) —
the assertions discriminate on behaviour, not on text. Reverted immediately.

The end-to-end behaviour (one dated durable operation per check-in, through the
real client) remains proved by execution in `local-era.test.cjs`, which is
**byte-identical to round 1**
(`304a310676a6c025f1d68f5da3e8d3044b9abc17c306d0e6db02608c3921e983`) and passes
9/9. Nothing under `rebuild/m3` is touched by this branch.

### Still open after round 2

- **C7 — no CI home.** PM/integrator-owned; `.github` untouched. The one-line
  step is in the counts section. Until it exists the CI half of `LANES.md:16`'s
  bar is unmet for this delivery and the ledger line should say so.
- **The PM question from round 1** — does DECISIONS:89's "recorded with the
  reason" mean on disk? — is unanswered. The test states the gap and goes RED the
  day a durable reason lands.
- **C8 is the gate on GPT-Live-1**, as C2 was. `model-adapter.md` §8.1 now spells
  out that an adapter must speak the unit, and that "Your protein target is 2262."
  is discarded exactly as "Eat 155 calories." is.
- **R2's residuals** — no model, no voice, no UI, no cap on any account, no
  opt-in screen — are unchanged and still disclosed above.
