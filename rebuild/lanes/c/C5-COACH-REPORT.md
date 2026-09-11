# C5 — VOICE COACH: tool contract + text-first prototype (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-coach`, **rebased onto `origin/rebuild/t2-client-core`
@ `5dc9254`** (the tip that carries C1/C2's `rebuild/m3/w6/local/**`, the port under
`rebuild/m3/setup/port`, and A3's recovery check-in). Owner ruling DECISIONS:89;
brief `rebuild/coach/VOICE-COACH-BRIEF.md` (read, not edited — it is the ruling).

**Isolated. Nothing outside `rebuild/coach/**` and this file is touched**, and the
W6 suite is untouched and unrun.

There is **no model, no network, no key and no live call** anywhere in this
delivery. The owner's hard spending-cap rule makes a live call impossible in this
task; the cap gate is built and proved instead.

## Files

| file | lines | sha256 |
|---|---|---|
| `rebuild/coach/TOOL-CONTRACT.md` | 400 | `2f742c6dd05f38f7cd821c12c0ed6aba2f0160829449246fcb51e89de8764a7c` |
| `rebuild/coach/tools.cjs` | 793 | `5cf96668d30568d2593cfb6dc7a439affa62d77a1c9a8399f10d5f34f9a3da3a` |
| `rebuild/coach/local-world.mjs` | 183 | `776c4f307007c0d41d7afc449f1357a2aebcd05a25dedf7d0ecb2e79e3abf632` |
| `rebuild/coach/coach-text.cjs` | 249 | `d2b3912a7676490da7cb81b551db65404f0c115f8662e2a9551367ae700ce3bc` |
| `rebuild/coach/model-adapter.md` | 146 | `61cbf46f46bcbe2819f8f08d7a6b71b9a0b1826eb09c6138b4954fb0a56e97e5` |
| `rebuild/coach/scripts/questions.json` | 35 | `b50281309960805b00c7f9105616795388bdda9a17ed2e63869daa71dfdcee04` |
| `rebuild/coach/cap.schema.json` | 26 | `8bdb19765cc8a0fa9607aae86fe0d9aa2dff6dc1dedf694d73ecf3c89ac690bf` |
| `rebuild/coach/cap.example.json` | 14 | `341d8e4d01d9509d6a5e37876f9e1276c6335799d5b5402434f3b20b0a3b96da` |
| `rebuild/coach/test/traceability.test.cjs` | 112 | `97117a8baee65ee61d6f73d8c6aa0738a805462f660b479618eed356a8f409ec` |
| `rebuild/coach/test/tiers.test.cjs` | 209 | `b35c200404a15bc70af4e6912fbe30bf88daafbd525684336615bc71c2486a29` |
| `rebuild/coach/test/local-era.test.cjs` | 225 | `304a310676a6c025f1d68f5da3e8d3044b9abc17c306d0e6db02608c3921e983` |
| `rebuild/coach/test/cost-cap.test.cjs` | 115 | `ca557a6e1e59d789dbff0041148d94b9e282f7b2da6041a6a796d21760ecc6ce` |
| `rebuild/coach/test/charter-and-gym-seam.test.cjs` | 152 | `868d8f19fa3e162a045c28914e1517cad364d1868b966b411de820afd0fc8281` |
| `rebuild/coach/VOICE-COACH-BRIEF.md` (unchanged) | 35 | `5d66dc611217f0a6f09dc12da721ee81d6bd4a6a2d706a4dfea84e8e966e3510` |

## Commands and counts (Windows, PowerShell 5.1, node v24.19.0)

Node is called directly:
`& 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'`

```
node --test "rebuild/coach/test/*.test.cjs"
    tests 46 · pass 46 · fail 0 · skipped 0 · todo 0 · duration_ms 374.8
```
(the quoted glob matters — `node --test rebuild/coach/test/` treats the directory
as a single test file on this build and fails.)

| suite | tests | result |
|---|---|---|
| `traceability.test.cjs` | 10 | pass |
| `tiers.test.cjs` | 11 | pass |
| `local-era.test.cjs` | 9 | pass |
| `cost-cap.test.cjs` | 8 | pass |
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
verbatim), the reason is stored, and the yes lands as a `proposal-response`
operation in `client.face().answers` with the same `op_id`. `request_replan`
refuses any numeric argument and any id the engine did not issue.

**(c) TIER 3.** All five topics refused with an explanation, `state_unchanged`,
store byte-identical.

**(d) COST CAP.** No record → refuse. Nine invalid shapes refuse with a reason.
Ten credential shapes refuse the record. A perfect cap plus opt-in **still** starts
nothing (`COACH_NO_LIVE_ADAPTER`). A test greps `tools.cjs` for escape hatches
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
  first field. The gate exists and refuses; the cap itself is an owner action on
  the provider's billing page.
- **No opt-in screen built.** The words are drafted in `model-adapter.md` §5 and
  `startLiveSession()` refuses without `optIn: true`. Nobody has seen the screen.
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
