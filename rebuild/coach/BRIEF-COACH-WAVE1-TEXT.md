# BRIEF - COACH WAVE ONE, IN TEXT (the five-step demo over the C5 prototype)

Tier **screens** (`DECISIONS:88`): ONE independent Opus reviewer (author != reviewer, told to disagree) + CI
green both OS. No engine code, no engine byte, no model, no network.

Authority: `DECISIONS:140` (the five-step demo script in `rebuild/coach/COACH-EXPERIENCE-BRIEF.md` **is** the
wave-one acceptance bar), `:89` (voice is the mouth, the engine is the brain), `:135` (standing licences,
preflight), `:139` (the pieces run in parallel).

Base `7f35e90af4da6a4c23aaa469a6e656765764441b` (`origin/rebuild/t2-client-core`). **A4b is NOT merged at
this base** (`rebuild/m3/w7-preview/today/` carries no `split-kinds.mjs` or `exercise-catalogue.mjs`, and
`setup.test.mjs` is A4's 104). Nothing here depends on A4b.

EFFORT (`DECISIONS:119 (5)`): **builder MEDIUM**, **reviewer HIGH**, **integrator LOW**. This brief HIGH.

Every vocabulary and number carries a `file:line` source or is marked **INVENTED** (`:115` lesson).

## 0. READ-LIST (`DECISIONS:119 (6)`)

`DECISIONS.md` 89, 135, 139, 140 · `rebuild/coach/COACH-EXPERIENCE-BRIEF.md` (in full; the demo script is
the bar) · `rebuild/coach/TOOL-CONTRACT.md`, `tools.cjs`, `coach-text.cjs`, `local-world.mjs`,
`scripts/questions.json`, `test/*.test.cjs` · `rebuild/m3/w7-preview/today/checkin-commands.cjs` (the fact
mechanism, in full) and `checkin-host.mjs` · `rebuild/m3/w6/local/today-bindings.mjs:391-480`
(`createCheckInHost`) · `rebuild/m3/w7-preview/today/gym-model.cjs` and `gym-host.mjs` (the write path) ·
`rebuild/slice/P6-REASON-ON-DISK-BRIEF.md` (why the why is a stub today).

## 1. CUSTODY

**ADDS**, under `rebuild/coach/` (lane C exclusive, `LANES.md`): `machine-settings-commands.cjs` (the fact
class, section 3), `wave1-tools.cjs` (the three new tools), `wave1-text.cjs` (the scripted driver),
`scripts/wave1-script.json` (the five-step transcript), `test/wave1-demo.test.cjs`,
`test/machine-settings.test.cjs`. **EDITS** `local-world.mjs` (one factory that opens a machine-settings
host beside the hosts it already opens) and `test/no-dashes.test.cjs` (to cover the new modules).

**OUT**: `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`, `.github/**`, and **all of
`rebuild/m3/w7-preview/today/**` for this brief** except reading it. The gym-card display half (step 3's
"shown on the active set") is a `today/**` build that waits its turn under one-Today-build-at-a-time
(`:116 (5)`); it is named as a follow-on in section 6 with its own bar, and it is NOT in this brief.

## 2. THE FIVE STEPS

The driver is `wave1-text.cjs`: it reads `scripts/wave1-script.json` and calls tools, exactly as
`coach-text.cjs` reads `scripts/questions.json` today. **There is no model.** Templates carry no digits
(the rule `coach-text.cjs:9-15` already enforces by scanning its own source), so every figure arrives
through a tagged value and `tools.cjs:253` `untraceable` can judge the sentence mechanically.

**Step 1, open.** The transcript opens with Today's own state read through the existing `today_plan` tool
(`tools.cjs:433`). Nothing new.

**Step 2, "what am I hitting today?" with the WHY.** The day is read back from `today_plan`; the why comes
from the existing `why_this_instruction` tool (`tools.cjs:467-502`), which ALREADY refuses with
`REPLAN_ENTRY_ABSENT` when the engine has no reason entry. **P6 reason-on-disk has not landed**
(`rebuild/coach/test/tiers.test.cjs`: "the reason is NOT on disk"), so wave one **stubs the why as
"not recorded"**: the answer template carries a why SLOT, the slot is filled from the tool when a reason is
on disk and reads exactly `not recorded` when it is not. The slot's existence and its honesty are asserted
(W3, W4). **The why is never invented and never paraphrased from the plan numbers.**

**Step 3, "what's my seat on the chest press?"** A new tier-0 read tool `machine_settings` returns the
latest stored settings for a named exercise id, as tagged values, or the honest miss. Never captured yet
gives the brief's own sentence (`COACH-EXPERIENCE-BRIEF.md` step 3): the coach says it does not have it and
offers to keep it. Capture is a new tier-1 tool `record_machine_settings`, section 3.

**Step 4, "one-ten for eight."** Hands-free logging through the gym card's **existing** write path:
`composeWorkoutHost` over `hostBindings()`, which `local-world.mjs:10-14` already opens and which the
existing `correct_set` tool (`tools.cjs:745-757`) already writes through. A new tier-1 tool `log_set`:

- refuses `GYM_SESSION_ABSENT` (`tools.cjs:511`) when no set is active, and writes nothing;
- refuses `CONFIRMATION_REQUIRED` (`tools.cjs:621`) without the spoken confirm, and the confirm **names the
  weight and the reps it is confirming**;
- refuses in the accepted layer's OWN words when the layer refuses (the A2 precedent: the load bound, the
  effort requirement, an order refusal);
- maps effort words to the accepted effort options only, with explicit unknown, nothing preselected (A2);
- returns the set number and the next set as tagged values, so the confirmation traces.

**Step 5, "why is today lighter?"** The same `why_this_instruction` path as step 2: the engine's stored
reason read back and traceable, or `not recorded`. One sentence. No arithmetic, no comparison the engine did
not make.

## 3. THE NEW FACT CLASS (decided and disclosed, `DECISIONS:135 (1)`)

**Name: `earned/machine-settings/v1`.** Justification: it parallels `earned/recovery-checkin/v1`
(`checkin-commands.cjs:35`) and `earned/first-run-setup/v1`, it names the thing rather than the screen, and
`v1` leaves room for the engine member H2 to arrive later without renaming the phone-side fact
(`DECISIONS:117 (2)`: a per-exercise machine setup note is "a good screens-tier addition for Dad LATER,
stored only once the engine gains the member" - this fact class is the phone-side half, and it claims no
engine member).

**Mechanism: the check-in's own.** `checkin-commands.cjs:11-19` states it exactly: `workout` is the only
PRODUCER-INJECTED command `createT2Stage` takes, so a producer module is the only way to write a dated
non-workout fact without editing `rebuild/client` or `t2-stage.cjs`. `machine-settings-commands.cjs` is that
producer for this lane, with its own database, namespace and lease, and `schemaVersion: 2` for the same
reason (`checkin-commands.cjs:172-174`). Seam S1 is unchanged and re-cited, not re-argued.

**Shape.** `prepare({action: "machine-settings", input: {machine, effective}})` builds
`payload = { profile, machine }` - exactly two keys, as the check-in's is
(`checkin-commands.cjs:149`, re-checked at `:158`). `machine` is:

| member | rule |
|---|---|
| `exercise_id` | required, non-empty string, <= 80 chars. **The athlete's own exercise id**, the one `setup-model.mjs` slugged and `athlete-state.cjs` holds |
| `settings` | optional, an array of 1 to 12 `{name, value}`, both non-empty trimmed strings <= 40 chars, names unique and in the order given. "Seat four, pin three" is `[{name:"seat",value:"4"},{name:"pin",value:"3"}]` |
| `cues` | optional, free text <= 400 chars (the `TEXT_MAX` the check-in uses, `checkin-commands.cjs:64`) |

At least one of `settings` or `cues` must be present, or the command refuses before anything is written -
the check-in's own rule (`:108-110`: "a check-in with no answer at all is not a fact about anything").
Nothing is interpreted: no numeric derivation, no unit invented, no normalising of the athlete's words.

**ONE op per exercise per change, keyed by exercise id.** Ops are append-only, so a correction is a NEW op;
the read tool returns the LATEST op for that exercise id (by effective date, then by the log's own order)
and nothing else. There is no update and no delete.

**Traceability.** A recalled setting is a STORED FACT, not an engine value, so `machine_settings` returns it
as a tagged value whose `source` names the op it came from. "Seat four" then traces exactly as an engine
number does, and a setting the coach did not read from the store is untraceable and fails W9.

**INVENTED** here, and declared: the profile name, the 12-setting cap, the 40-char cap, `settings`/`cues`
as the member names. **SOURCED**: the two-key payload, `schemaVersion: 2`, `TEXT_MAX` 400, the
at-least-one-answer rule, and the producer mechanism itself, all `checkin-commands.cjs`.

## 4. ACCEPTANCE BAR (numbered, executable)

New tests: `test/wave1-demo.test.cjs` **>= 26 subtests**, `test/machine-settings.test.cjs` **>= 22**. The
reviewer counts them.

| id | check |
|---|---|
| W1 | The five-step script runs end to end over the REAL local-era world (`local-world.mjs`), in order, and every step's assertions below hold in that one run |
| W2 | Step 2 reads the day back from `today_plan` only; every figure in the sentence is a tagged value of that turn |
| W3 | **The why SLOT exists**: the step-2 and step-5 answers both carry a why slot, asserted structurally, not by string match |
| W4 | **The why is honest**: with no reason on disk the slot reads exactly `not recorded`; with a reason on disk (a fixture that plants one) it reads the engine's own words verbatim. It is never composed from the plan numbers, proved by a mutant |
| W5 | Step 3 with nothing captured returns the honest miss and writes nothing |
| W6 | Step 3 after a capture returns the stored settings as tagged values, in the order given, for that exercise id and no other |
| W7 | Step 4 logs through the gym card's write path: the operation the store holds is the one `composeWorkoutHost` writes, byte-identical to logging the same set through `gym-model.cjs` |
| W8 | Step 4 refuses with `GYM_SESSION_ABSENT` when no set is active, and with `CONFIRMATION_REQUIRED` without the confirm; both write nothing, and the confirm names the weight and the reps |
| W9 | Every numeric token in every one of the five answers passes `tools.cjs:253` `untraceable` against that turn's results, stored machine settings included |
| W10 | Tier is enforced: `machine_settings` is tier 0, `record_machine_settings` and `log_set` are tier 1 and refuse without a yes; the new tools appear in the tier map and the tier test's list |
| W11 | Tier 3 unchanged: every topic in `NEVER_VIA_COACH` (`tools.cjs:306`) still refuses, and the new tools give no way round one |
| W12 | The opt-in and cost-cap gates are untouched: `verifyOptIn` (`tools.cjs:989`), `verifyCostCap` (`:938`) and `startLiveSession` (`:1019`) behave exactly as they do today, and no new path starts a session |
| W13 | The fact class: section 3's shape, every rule, accepted and refused, including at-least-one-answer, the caps, unique names, and a payload with a third key |
| W14 | ONE op per change, latest wins: three captures for one exercise leave three ops and the tool returns the third; a capture for another exercise does not move it |
| W15 | Durability: the capture survives a reload and a new host over the same store, exactly as the check-in's does |
| W16 | No dashes: zero U+2013 and U+2014 in any string the athlete reads, by `test/no-dashes.test.cjs` extended to the new modules and to the five-step transcript |
| W17 | No network and no model: the new modules import nothing that opens a socket; asserted by source scan, as the existing "no live model call and no network exists in this build" cell does |
| W18 | Zero regressions, **counts executed on this base**: coach **64** (`rebuild/coach/test/`), today **64** (adapter 20 + view 23 + design 11 + package 10), copy **36**, gym **64**, checkin **28**, setup **104**, ntc-h6-delta **8**, W6 **552**, journey **51**, A0 host **31**, w7-preview **19**, `native-carriers-package.cjs --ci` **PASS**, `build.mjs` **PASS**. Wave one may only ADD |

**Mutants**, each must turn a check RED: D1 compose the why from the plan numbers instead of the engine's
reason (W4) · D2 print `not recorded` when a reason IS on disk (W4) · D3 drop the why slot entirely (W3) ·
D4 have `log_set` write its own operation instead of going through the host (W7) · D5 log without the
confirm (W8) · D6 confirm without naming the weight and reps (W8) · D7 speak a machine setting the store
does not hold (W9) · D8 return the FIRST capture instead of the latest (W14) · D9 accept a `machine` with
neither `settings` nor `cues` (W13) · D10 normalise "four" to 4 in a stored value (W13, nothing is
interpreted) · D11 make `record_machine_settings` tier 0 (W10) · D12 put an em dash in a new sentence (W16).

**CI residual, carried on the ledger line:** the coach tests are not in `rebuild.yml`'s enumerated steps and
`.github` is editable only inside a re-pinning engine package (`DECISIONS:112`); `:117 (4)` already routes
the coach step to the B-NTC re-seal. Until it lands, the "CI both OS" half is a RESIDUAL for the coach
suites and the lane runs them locally at the exact head sha (`:135 (3)` preflight).

## 5. OUT OF SCOPE, HANDED ON

- **The gym-card display of settings and cues** ("shown on the active set", `:140`): a `today/**` build,
  its own follow-on brief, behind A4b under one-Today-build-at-a-time. Its bar in one line: the active set
  shows the latest stored settings and cue for THAT exercise id, read from this same lane, absent when none
  is stored, dash-free through `plain-copy.cjs`, no figure the store did not supply, 390x844, >= 44px
  targets, and the A2 gym suite unmoved at 64.
- **Voice**: the phone session is `BRIEF-C6-VOICE-ONBOARDING.md` Part C and the relay is lane D.
- **P6 reason-on-disk**: PM, `rebuild/slice/P6-REASON-ON-DISK-BRIEF.md`. Wave one stubs the why and asserts
  the slot; when P6 lands, W4's second half stops needing a planted fixture.
- **Waves two and three**: `COACH-EXPERIENCE-BRIEF.md`. Nothing from them starts before this bar is green
  on a real phone (`:140`).
- **H2, the engine's own `setup` member**: engine tier. This fact class claims no engine member.

## 6. OPEN QUESTIONS (REQUESTS-ready one-liners)

1. `C -> PM · DISCLOSURE, not a permission ask (:135 (1)): wave one adds the fact class earned/machine-settings/v1 through the check-in's producer mechanism (checkin-commands.cjs:11-19), payload {profile, machine} with machine = {exercise_id, settings?: [{name, value}] (1-12, <=40 chars each), cues?: <=400 chars}, at least one of settings/cues required, one op per change, latest wins, its own database/namespace/lease, schemaVersion 2. Object here if you want a different name or shape; otherwise it is decided.`
2. `C -> PM · Wave one stubs the WHY as the literal string "not recorded" until P6 lands, and asserts the slot exists and is honest. Confirm that literal is the owner-facing wording you want, or name another (it is athlete-facing copy, dash-free either way).`
3. `C -> PM · The gym-card display half of step 3 is a today/** build and waits its turn behind A4b under :116 (5). Confirm it queues after A4b and before N1 NUTRITION, or after N1/N2 (:143).`
4. `C -> PM · Wave one's bar is DECISIONS:140's demo script in TEXT. The ruling says a later wave starts only when the earlier wave's bar is green ON A REAL PHONE. Confirm that text-green unblocks the phone session build (lane C) while the phone run remains the gate for wave two.`
