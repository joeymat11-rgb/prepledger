# C5 — VOICE COACH: tool contract + text-first prototype (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-coach`, based on `origin/rebuild/t2-client-core`
@ `ea8381f`. Owner ruling DECISIONS:89; brief `rebuild/coach/VOICE-COACH-BRIEF.md`
(read, not edited — it is the ruling).

**Isolated. Nothing outside `rebuild/coach/**` and this file is touched**, and
the W6 suite is untouched and unrun. `git status --porcelain` before commit listed
only new paths under `rebuild/coach/`.

There is **no model, no network, no key and no live call** anywhere in this
delivery. The owner's hard spending-cap rule makes a live call impossible in this
task; the cap gate is built and proved instead.

## Files

| file | lines | sha256 |
|---|---|---|
| `rebuild/coach/TOOL-CONTRACT.md` | 319 | `23f12af8947fb2841a5d87886481bdc6ee4530615d3b89bcd2c914f25764caa8` |
| `rebuild/coach/tools.cjs` | 686 | `2127225065e0ffadf5c337773d4c6100b902e37d96dcf5d60d6b20fb270f35bd` |
| `rebuild/coach/coach-text.cjs` | 231 | `708ee074c9c68fd1487e68ebc7c074f46f38e56cadaad06b737d2823335a57be` |
| `rebuild/coach/model-adapter.md` | 146 | `61cbf46f46bcbe2819f8f08d7a6b71b9a0b1826eb09c6138b4954fb0a56e97e5` |
| `rebuild/coach/scripts/questions.json` | 30 | `a700fe339e1ce8f6b375b4a25f29daa282691e6f1bfe463dd59e4b45bc715b1e` |
| `rebuild/coach/cap.schema.json` | 26 | `8bdb19765cc8a0fa9607aae86fe0d9aa2dff6dc1dedf694d73ecf3c89ac690bf` |
| `rebuild/coach/cap.example.json` | 14 | `341d8e4d01d9509d6a5e37876f9e1276c6335799d5b5402434f3b20b0a3b96da` |
| `rebuild/coach/test/traceability.test.cjs` | 112 | `97117a8baee65ee61d6f73d8c6aa0738a805462f660b479618eed356a8f409ec` |
| `rebuild/coach/test/tiers.test.cjs` | 181 | `f7651ed6b256f207cfa4cc87579e5020e380bf18e990bdd92394c890606c2995` |
| `rebuild/coach/test/cost-cap.test.cjs` | 112 | `9f6a5ecba206e49cb965cf40adaffad4cd72bb7d8e8282ac4448f33a711806c6` |
| `rebuild/coach/test/charter-and-gym-seam.test.cjs` | 152 | `868d8f19fa3e162a045c28914e1517cad364d1868b966b411de820afd0fc8281` |
| `rebuild/coach/VOICE-COACH-BRIEF.md` (unchanged) | 35 | `5d66dc611217f0a6f09dc12da721ee81d6bd4a6a2d706a4dfea84e8e966e3510` |

## Commands and counts (Windows, PowerShell 5.1, node v24.19.0)

Node is called directly:
`& 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'`

```
node --test "rebuild/coach/test/*.test.cjs"
    tests 35 · pass 35 · fail 0 · skipped 0 · todo 0 · duration_ms 269.8612
```
(the quoted glob matters — `node --test rebuild/coach/test/` treats the directory
as a single test file on this build and fails.)

Per file:

| suite | tests | result |
|---|---|---|
| `traceability.test.cjs` | 10 | pass |
| `tiers.test.cjs` | 9 | pass |
| `cost-cap.test.cjs` | 8 | pass |
| `charter-and-gym-seam.test.cjs` | 8 | pass |

```
node rebuild/coach/coach-text.cjs
    turns: 24 · untraceable turns: 0 · charter violations: 0   (exit 0)
node --check rebuild/coach/tools.cjs        → OK
```

The scripted coach answers **24** questions (the brief asks for a fixed set; ≥12
was the floor). The transcript states real engine figures — 2262–2360 kcal, 155 g,
trend 180.4 lb, rate 1.19 (1.14–1.24) over 28 readings, maintenance 2946 — and
every one of them is traceable to a tool result in the same turn.

## What the four acceptance tests actually prove

**(a) TRACEABILITY.** Every numeric token in every answer maps to a tagged tool
value from the same turn. Fail-closed is proved twice, not asserted: a tampered
template copy saying "2500 calories" turns exactly that turn RED with token
`2500`, and a *plausible rounding* — "1.2 pounds a week" where the engine said
1.19 — also turns RED. A further test shows provenance cannot be borrowed across
turns, and a static scan proves **no template string contains a digit**, so every
figure must arrive through a tagged value.

**(b) TIER 2.** Over the REAL `rebuild/client` consent surface (memory backend,
synthetic lease from `rebuild/conform/lib/ops.cjs`, the same fixture W6's own
tests use): issuing a proposal leaves the durable store byte-identical; accepting
without `confirmed:true` leaves it byte-identical and records no answer; with the
yes, `done.accepted.proposal` **deep-equals** the engine's own object (recomputed
independently from `volumeImbalance` on the same state — muscle `hams`, 4 weekly
sets now, `need` 6, `why` verbatim), the reason is stored, and the yes lands as a
`proposal-response` operation visible in `client.face().answers` with the same
`op_id`. `request_replan` refuses any numeric argument
(`COACH_PROPOSAL_NOT_ENGINE_ISSUED`) and refuses an id the engine never issued.

**(c) TIER 3.** All five topics — phase, calorie floor, protein floor,
progression rules, consent policy — refuse with an explanation (>40 chars, the
fixed copy), `refused: true`, `state_unchanged: true`, and the durable store
byte-identical afterwards.

**(d) COST CAP.** `cap.schema.json` + `verifyCostCap()`. No record → refuse
(`COACH_COST_CAP_ABSENT`). Nine invalid shapes refuse with a reason (unverified,
incomplete, zero/negative caps, session cap above month cap, unparseable or
future or stale `verified_at`). Ten credential shapes in the record refuse it — a
cap record is a receipt, never a key. A perfect cap plus opt-in **still** starts
nothing (`COACH_NO_LIVE_ADAPTER`), and a test greps `tools.cjs` for escape
hatches (`skipCap`, `force`, `bypass`, `allowUncapped`, `ignoreCap`) and for
`node:http`/`fetch(`/`WebSocket`/`api.openai.com`/`OPENAI_API_KEY` — none present.

**Charter lint.** `CHARTER_BANNED` is a literal 38-phrase list. Zero violations
across the whole transcript and across the coach's own fixed copy. Matching is
word-boundary, not substring: the first draft fired on "e**xp**lain" and would
have been deleted within a week. A separate test asserts no refusal is softened
with sorry / unfortunately / great news / don't worry.

## Engine seams: PRESENT today

Implemented over the real thing, not a stub. The today reads go through the
slice's own adapter `rebuild/m3/w7-preview/today/today-model.cjs`, whose engine is
`today-engine.cjs` = the accepted browser composition + `rebuild/engine/writers.cjs`
— one composition, the one A1 shipped.

| tool | engine function (file:line) |
|---|---|
| `today_plan` | `energy.cjs:684` `calorieTarget` · `energy.cjs:117` `proteinTarget` · `today.cjs:405` `statusFace` · `today.cjs:465` `marchingOrder` · `today.cjs:630` `nowModel` · `today.cjs:63` `genSession` |
| `weight_trend` | `energy.cjs:225` `currentRate` · `energy.cjs:331` `readRecency` · `writers.cjs:424` `applyRead` (state.trend is the writer's) |
| `why_this_instruction` | `today.cjs:279` `theOneFix` · `today.cjs:226` `fiveLevers` · `energy.cjs:684` `.why`/`.wkWhy` · `energy.cjs:117` `.why` · `energy.cjs:369` `observedTDEE.stepsWhy` · `energy.cjs:493` `calorieFloor.why` · `today.cjs:405` `statusFace` |
| `current_set` / `next_set` | `gym-model.mjs` `prescriptionLine`/`effortInstruction`/`nextAfter` over the accepted v2 capture; behind them `today.cjs:63` `genSession`, `progression.cjs:261` `targetsFor`, `progression.cjs:19` `progressStep` |
| `last_comparable_performance` | `today.cjs:63` `genSession` → `card.prev`, via `gym-model.previousLine` |
| `correct_set` | `gym-model.undo` → `client.prepareWorkoutEdit` + `commitWorkoutEdit({remove})`, then `gym-model.logSet` → `client.executeResumedWorkout({set})` |
| `request_replan` (`volume`) | `volume.cjs` `volumeImbalance` — issues only when `actionable` (Pelland 2025 SDES applied before anything ships) |
| `accept_proposal` | `rebuild/client/index.cjs:271` `respond` · `:338` `recordIssuance` · `:161` `answers()` |

The gym seam is composed FOR REAL in the test: the accepted encrypted repository
over fake-indexeddb (resolved through `rebuild/m3/w6/test/support.mjs`, nothing
installed), the T2 stage over `rebuild/client`, the accepted durable public
client, `createGymHost` + `createGymModel`. A session is prepared and started and
`current_set` is asserted cell-for-cell equal to what the screen would print.

## Engine seams: MISSING, with the exact refusal

| what | refusal code | proof |
|---|---|---|
| recovery check-in reader | `COACH_CHECKIN_SURFACE_ABSENT` | Today's own face labels recovery/coach "— not wired yet"; A2 recorded "no skip/correction wired" |
| durable command for pain / soreness, equipment unavailable, time away, check-in answers | `COACH_FACT_COMMAND_ABSENT` | `rebuild/m3/w6/t2-stage.cjs:9` — staged COMMANDS are exactly `weighIn · logSet · logSession · finishSession · workout`; anything else hits `throw new Error("Unsupported staged command")` at `t2-stage.cjs:84` |
| an engine entry point that RE-PLANS on coach facts (pain, equipment, time away) | `COACH_REPLAN_ENTRY_ABSENT` | no producer in `rebuild/engine` takes them. Producers that exist (`volumeImbalance`, `policy.phaseProposal`, `progression.proposeLadder`, `trialProposals`) read state, not conversation facts |
| consent write through the durable public client | `COACH_CONSENT_SURFACE_ABSENT` | `respond` / `proposal-response` is NOT in `t2-stage.cjs:9`. The consent surface is therefore injected; on a device reached only through the W6 client the yes cannot be written yet |
| local engine→proposal issuance to the client's own proposal list | — | `rebuild/client/face.cjs:56` `layer2()` takes `proposals` from the **authority snapshot**. There is no local issuer, so the coach keeps its own sealed issued-ledger and identifies a proposal by a sha256 digest of the engine's object |
| a second training day for a fresh athlete | `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` (`rebuild/engine/performed.cjs:193`) | the known S2 blocker (DECISIONS:103, routed to lane B as B-NTC). Carried verbatim by `current_set` |
| legacy (post-port) day ordering | `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` (`performed.cjs:180,183`) | same open boundary |
| progression reset mapping | `PROGRESSION_RESET_MAPPING_REQUIRED` (`rebuild/engine/progression.cjs:117`) | carried verbatim |

Every one of these is a typed `unavailable` whose `reason` is itself a tagged
value, so the coach reads the refusal out loud without inventing a friendlier
sentence, and `state_unchanged: true` travels with it.

Observed on the synthetic athlete: `genSession(...).ex[].prev` is **null** — the
engine qualifies no comparison — so `last_comparable_performance` takes the
`COACH_NO_QUALIFIED_COMPARISON` branch. That is the engine answering, not a gap.

## The two "not decided" defaults I took

The brief lists two open questions with defaults and says to bring them to the
owner only if they block. Neither blocks; both defaults are taken, and both are
reversible without touching the tool contract.

1. **Which backend answers free-form questions → ENGINE-ONLY TOOLS FIRST.**
   `coach-text.cjs` has no model at all: every answer is a template over tool
   results. A text model, when it comes, is an adapter in the same loop
   (`model-adapter.md` §1) and needs no new tool. Consequence, stated plainly:
   this coach answers the 24 scripted questions and nothing else — an unscripted
   question throws `COACH_UNKNOWN_INTENT` rather than improvising.
2. **Reachable during a set, or only between sets → BETWEEN SETS ONLY.**
   `current_set` reports the live set and `next_set` the one after; neither
   offers an action, and no tool is callable from an active-set screen in this
   design. Making the coach reachable mid-set is a screen decision later, not a
   tool change.

## Residuals — what this is NOT

- **No model.** Nothing calls GPT-Live-1 or any other model. The templates are
  the stand-in, and they are the bar the adapter must clear.
- **No voice.** No audio in, no audio out, no full-duplex anything.
- **No UI.** The approved design's Coach tab ("quiet Today and contextual entries
  to the already approved staged conversation", Additions C point 5) is not built.
  This is the contract and the loop underneath it.
- **No cap on any account.** `cap.example.json` is labelled SHAPE ONLY and says
  so in its own first field. The gate exists and refuses; the cap itself is an
  owner action on the provider's billing page, and until it is done
  `startLiveSession()` returns `COACH_COST_CAP_ABSENT`.
- **No opt-in screen built.** The words are drafted in `model-adapter.md` §5 and
  `startLiveSession()` refuses without `optIn: true`. Nobody has seen the screen.
- **Dad's hand test is later** — after Joe's own week of use, per the brief.
- **Not run here:** the W6 suite, the A1/A2/A5 suites, `--ci`, `--full`. Untouched
  by construction; this branch adds only `rebuild/coach/**` and this report.
- **Tier-1 coverage is one tool of five.** `correct_set` is wired; the other four
  refuse by naming `t2-stage.cjs:9`. That is the honest state, and the smallest
  unblocking change is adding a non-workout fact command to the staged set.
- **The consent write is injected, not reached through the W6 client.** Adding
  `proposal-response` to `t2-stage.cjs:9` is what turns tier 2 into something a
  phone can do.

## Suggested order for whoever picks this up

1. `proposal-response` into the staged command set → tier 2 works on a device.
2. A non-workout fact command (pain / equipment / time away / check-in answers)
   → tier 1 stops refusing four of its five tools.
3. The recovery check-in reader → `today_checkin` answers.
4. B-NTC (`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`) → the coach can see more
   than one training day for a fresh athlete.
5. Only then a model adapter, and only behind a real cap.

## One base note for the integrator

This branch is based on `origin/rebuild/t2-client-core` @ `ea8381f`, the tip at
the time of `git fetch`. The C5 brief pointed at
`rebuild/m3/w6/local/local-client.mjs` and `today-bindings.mjs` as the store the
coach's tools must read and write through. **Those files do not exist at `ea8381f`**
— the lane's own C1/C2 work landed on the integration tip afterwards (origin has
since moved to `da63053`, which carries `rebuild/m3/w6/local/*`).

So the store seam used here is the one that existed at the base and is the one
the slice's screens actually use:

- reads: `rebuild/m3/w7-preview/today/today-model.cjs` (which holds the durable
  reading lane `reading-host.mjs`, whose `weighIn` is `client.execute('weighIn', …)`)
- workout: `gym-host.mjs` + `gym-model.mjs` over `public-client.mjs` /
  `t2-stage.cjs` / the accepted encrypted repository
- consent: `rebuild/client/index.cjs` directly

`tools.cjs` takes its world by injection (`{ today, gym, consent, checkin }`), so
pointing it at `local-client.mjs` on a rebase is a wiring change at the call site,
not a change to the contract, the tiers or the tests. Worth a look at rebase time:
whether `local-client.mjs` widens the staged command set past `t2-stage.cjs:9`,
because that is what unblocks four of the five tier-1 tools and the tier-2 write.
