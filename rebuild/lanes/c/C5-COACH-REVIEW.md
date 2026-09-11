# C5 — VOICE COACH tool contract + text-first prototype: INDEPENDENT REVIEW (round 1)

Reviewer: independent — did not write the candidate, told to disagree and to treat
every claim in `rebuild/lanes/c/C5-COACH-REPORT.md` as a hypothesis to be executed.
Worktree: `work/lane-c/review-coach`, detached at **`e576905`** (head of
`rebuild/lane-c-coach`: `aee8835` + `e576905` on base **`5dc9254`**).
Ruling: `rebuild/coach/VOICE-COACH-BRIEF.md` (owner ruling DECISIONS:89).
Rigor bar: `rebuild/lanes/LANES.md:16` — screens/plumbing tier, ONE independent
reviewer + CI green both OS.
Node used: plain `node` on the PC = **v24.18.0** (the report says v24.19.0).

A previous reviewer died mid-review leaving an uncommitted 41-line fragment with
two findings. I re-derived both from scratch with my own probes before reading
them as conclusions. **Both reproduce**, and are carried below credited as
"prior fragment, reproduced". I also found four things the fragment did not.

## VERDICT: ACCEPT WITH CONDITIONS

The delivery is real, isolated, executed and — with the exceptions below —
honestly reported. All 14 sha256 in the report's file table match mine byte for
byte. 46/46 tests pass, the 25-turn transcript runs clean at 0 untraceable /
0 charter violations, `node --check` is OK, and the W6 suite and every other tree
(`rebuild/m3`, `rebuild/engine`, `rebuild/client`, `rebuild/conform`,
`rebuild/m4`, `.github`) are **byte-untouched** — verified by empty
`git diff --stat`, not by taking the report's word. The safety properties that
protect Joe hold under my own attacks: no yes → store byte-identical; `confirmed`
must be exactly `true` (10 truthy/falsy variants refused); 5 forged proposal ids
refused; 7 tier-3 topics (5 real + 2 near-misses) refused with the store
byte-identical; no cap record → no session; no network symbol, no dependency, no
`package.json`, no key and no override flag in any of the three source files.
9 of 10 first-round mutants died; the one survivor is characterised below and is
itself a condition. Contract spot-checks: **12 of 12** `file:line` citations I
checked resolve to exactly what the contract claims.

### Conditions

**C1 — BLOCKING. The cost-cap verifier passes its own SHAPE-ONLY example, so the
one gate in front of a live call opens on a cap that does not exist.**
`cap.example.json` declares in its own first field *"SHAPE ONLY. No cap exists on
any account yet (C5 residual) … it must never be edited into a live record"*, and
`T.verifyCostCap(cap.example.json)` returns **`ok: true`**; `startLiveSession`
with it reaches `COACH_NO_LIVE_ADAPTER` — i.e. past the cap gate, stopped only by
the accident that no adapter exists yet. Worse, `test/cost-cap.test.cjs:21`
defines the suite's happy path as `good() = the shape example`, so the suite
asserts that the non-cap is a valid cap. The brief's rule is "hard spending cap on
the API account BEFORE the first real conversation"; a verifier that green-lights
a self-declared placeholder is a false green sitting exactly where fail-closed was
required.
*Exact change:* in `verifyCostCap`, before any other check, refuse any record
carrying `_note` (the schema already describes `_note` as "Present only on the
shape example; a live record carries none") with
`{ ok:false, code: CODES.COST_CAP_INVALID, reason: "this is the shape example, not a cap on any account" }`;
and rebuild `test/cost-cap.test.cjs`'s `good()` from the example **minus** `_note`
so the happy path is a synthetic live-shaped record, not the placeholder file.
*Red-first test:*
`assert.equal(T.verifyCostCap(JSON.parse(fs.readFileSync("rebuild/coach/cap.example.json")),{now:NOW}).ok, false)`
and `assert.equal(T.startLiveSession({cap: example, now: NOW, optIn: true}).code, T.CODES.COST_CAP_INVALID)`.
Both are RED at `e576905` — I executed the first and it returns `ok:true`.

**C2 — NON-BLOCKING for this artifact; BLOCKING PREREQUISITE for any model
adapter. The traceability instrument is field-blind: it binds a number to the
TURN, not to the value that licensed it.** (prior fragment finding (a),
reproduced independently.) `allowedTokens()` flattens every tagged `display` in
the turn into one untyped `Set` of digit strings, so any number the turn produced
licenses any sentence. Executed on `today_plan` (allowed set
`["2030","02","04","2262","2360","155"]`), these all return `[]` — GREEN:
`"Eat 155 calories today."` (155 is protein **grams**), `"Your protein target is
2262 grams."` (2262 is the **calorie** floor), `"Add 2030 weekly sets."` (2030 is
the **year**, from the date tag), and two I added that the fragment did not have:
`"Rest 155 minutes between sets."` (a rest prescription minted from a protein
gram count) and `"Your weight is 2262 pounds."` (a bodyweight minted from a
calorie floor). Strictly, the brief's words — "every numeric token … is traceable
to a tool result in the same turn" — are literally satisfied; the criterion's
*purpose* is not, and `model-adapter.md §8` names this exact test as the bar the
GPT-Live-1 adapter must clear. The text-first prototype **cannot** exploit it
(`test/traceability.test.cjs` statically proves no template string contains a
digit, and I confirmed every spoken figure arrives through `d()` over a tagged
value), which is why this is not blocking C5 itself.
*Exact change:* a tagged value must license a number **only in its own field/unit
role**, not merely in its turn. Concretely: key the allowed set on
`unit + ":" + token` rather than `token`, and have the answer side declare the
unit at each interpolation point (e.g. `d(v, "kcal")` emits the number and asserts
the tag's unit is `kcal`). A number then travels only into a slot the engine
computed *for that purpose*. Date tags (`unit: "date"`) must license their
components only in a date slot.
*Three strings the fix MUST refuse (all GREEN today):*
1. `"Eat 155 calories today."` — 155 is `energy.proteinTarget.g`, unit `g`, into a `kcal` slot.
2. `"Your protein target is 2262 grams."` — 2262 is `energy.calorieTarget.lo`, unit `kcal`, into a `g` slot.
3. `"Add 2030 weekly sets."` — 2030 is a component of `today-model.read.today`, unit `date`, into a `set` slot.
*Three it MUST still accept:*
4. `"Today: 2262–2360 kcal · 155 g protein"` — every token in its own unit slot (this is `today.marchingOrder.targetLine` verbatim).
5. `"Your calorie band today is 2262 to 2360."` — both tokens `kcal` into `kcal` slots.
6. `"Your protein target is 155 grams."` — `g` into a `g` slot.

**C3 — NON-BLOCKING (test-honesty), with one decision for the lane lead. Tier 2's
"the reason is stored" is asserted against an in-memory `Map`, and nothing about
the proposal reaches disk.** (prior fragment finding (b), reproduced
independently.) Executed against the real `rebuild/client` consent surface: after
a yes, the durable store holds exactly two things — an op
`{kind:"proposal-response", payload:{proposal_id:"prop-82b6bef323cc40ca", answer:"accept"}}`
and an issuance `{id, accepted:true, instance:null}`. The engine's **388-character**
reason, the proposal body (`addWeeklySets:6`, `weeklySetsNow:4`, `muscle:"hams"`)
and the producer name are **not on disk** (I grepped the raw store dump for each:
all `false`). Re-booting a fresh client from the same backend and building a new
coach over it yields `acceptedProposals() = []`, `issuedProposals() = []`, and
`issuedInstance(id) = null`; all that survives a restart is that *some* id was
accepted. `tiers.test.cjs:83` asserts `done.accepted.reason.length > 40` — a field
on a `Map` that dies with the process — under the heading "the reason is stored".
I am deliberately **not** ruling that the brief requires the reason on disk: the
brief names *"the EXISTING proposal-issuance + consent path"*, and I read that
path (`rebuild/client/index.cjs:271 respond()`, `:338 recordIssuance()`,
`:161 answers()`) — it has no slot for a reason, so the ruling names a path that
cannot satisfy its own "recorded with the reason" clause. That gap is in
`rebuild/client`, not in C5, and the builder discloses it honestly ("the consent
write is injected"; suggested-order item 1). What is **not** acceptable is a test
that reads as durable proof when it is process-local.
*Exact change:* rename the test to what it proves and add the lock-in it is
missing — keep the deep-equal of `done.accepted.proposal` against the engine
object, then assert explicitly that the durable dump does **not** contain the
reason, and re-read the store through a freshly booted client asserting exactly
`[{proposal, answer:"accept", op_id}]` survives. That turns a silent gap into a
tested, visible one that goes RED the day a durable reason lands.
*Red-first test:* `assert.ok(!w.dump().includes(issued.proposal.reason))` plus
`assert.deepEqual(T.createCoachTools({today, consent: reboot(backend)}).acceptedProposals(), [])`
— both are statements of fact I executed; they are RED against any claim that the
reason is durable, which is the point.
**LANE LEAD MUST DECIDE:** does DECISIONS:89's "recorded with the reason" mean on
disk? If yes, this is a `rebuild/client` change (a `reason` field on the
`proposal-response` payload, or a producer-injected consent command the way the
check-in got one) and C5 cannot close tier 2 without it.

**C4 — NON-BLOCKING. The opt-in gate is not per-user, though the ruling and the
adapter doc both say it is.** The brief: "explicit opt-in for each user",
"Explicit opt-in screen per user naming this", "two named users only — Joe and
Dad". `model-adapter.md §5` states `startLiveSession()` "refuses with
`COACH_OPT_IN_REQUIRED` until this is answered yes **for that user**".
`startLiveSession({ cap, now, optIn })` takes a bare boolean and **no user
identity at all**: I passed `{optIn:true, user:"dad"}` and `user` is silently
ignored; one `true` opens the gate for anybody. (The gate is otherwise correct:
`optIn:"yes"`, `"true"`, `1`, omitted, `null` all refuse, and the §5 wording does
name plainly that audio/text leaves the phone to OpenAI's API — that part of the
brief is met.) The builder's report is honest that no screen is built; the adapter
doc over-claims what the code does.
*Exact change:* `startLiveSession({ cap, now, optIn, user })` must require `user`
to be one of the two named users and `optIn` to be an opt-in record **for that
user** (`{user, accepted:true, accepted_at, screen_version}`), refusing with
`COACH_OPT_IN_REQUIRED` otherwise; and `model-adapter.md §5` must describe what
the code does until it does.
*Red-first test:* `assert.equal(T.startLiveSession({cap:good(),now:NOW,optIn:{user:"joe",accepted:true},user:"dad"}).code, "COACH_OPT_IN_REQUIRED")`
and `assert.equal(T.startLiveSession({cap:good(),now:NOW,optIn:true}).code, "COACH_OPT_IN_REQUIRED")`
(a bare boolean is no longer an opt-in). Both RED today — the second currently
returns `COACH_NO_LIVE_ADAPTER`.

**C5 — NON-BLOCKING. The turn-scoping guard in `allowedTokens()` is dead under the
public API and is not tested: I deleted BOTH guards and 46/46 stayed green.**
Mutant M7c removed `if (turn_id && r && r.turn_id !== turn_id) continue;` **and**
its inner per-tag equivalent, and `traceability.test.cjs` did not notice. The
reason is that "provenance cannot be borrowed from another turn"
(`traceability.test.cjs:70`) passes *one other turn's own `results` array*, so the
property it demonstrates follows from the arrays being per-turn, not from the
guard. `untraceable()` is exported and an adapter is free to call it with a pooled
results array — exactly the case the guard exists for, and exactly the case
nothing proves.
*Exact change:* none to `tools.cjs` (the guard is correct); add the test that
kills the mutant.
*Red-first test (executed against unmutated code — it passes there and fails with
the guards removed):* build turn A (`today_plan`) and turn B
(`cannot_change_via_coach`), then
`assert.deepEqual(T.untraceable("Eat 2262 calories.", tA.results.concat(tB.results), "B"), ["2262"])`.
Measured: `["2262"]` with the guards, `[]` without.

**C6 — NON-BLOCKING. Two over-claims in the report.** (i) The report says
`request_replan` "refuses any numeric argument". It refuses only **top-level**
`typeof === "number"`: `{fact:"volume", addWeeklySets:"7"}`,
`{fact:"volume", note:{sets:7}}`, `{fact:"volume", n:[7]}` and
`{fact:"volume", note:"make it 7 sets"}` all pass. This is **not** a safety hole —
I verified the issued body and the proposal id are byte-identical to the clean
call, so the extra arguments reach nothing — but the sentence should read
"refuses a top-level numeric argument and ignores every other argument", or the
guard should walk the object. (ii) The report's node version (v24.19.0) does not
match what `node` on this PC reports (v24.18.0).

**C7 — NON-BLOCKING, PM-owned (I did not edit `.github`). These 46 tests have no
CI home.** `findstr /s /i coach .github\workflows\*.yml` returns **nothing**;
`rebuild.yml` has 8 `node --test` steps and none names `rebuild/coach`.
`LANES.md:16` sets this tier's bar at "ONE independent reviewer + CI green both
OS", and `LANES.md:33` lets a mechanical integrator merge on "reviewer says ACCEPT
and CI is green" — which would today be green while never having executed a single
line of this delivery. *Exact change (PM/integrator, not this lane):* add
`node --test "rebuild/coach/test/*.test.cjs"` to `rebuild.yml` alongside the
w7-preview step. Until it exists, the merge decision rests on this review alone
and the lane lead should say so in the ledger line.

## Executed

Every command below was run in this worktree via `cmd.exe`, with plain `node`
(v24.18.0). Output is quoted, not summarised.

| # | command | result |
|---|---|---|
| E1 | `git rev-parse HEAD` | `e576905fe0cabe639e749f9d3c58224029cc0f9b` |
| E2 | `git status --short` | `?? rebuild/lanes/c/C5-COACH-REVIEW.md` only (the dead reviewer's fragment) |
| E3 | `git log --oneline -4` | `e576905` (C5 follow-up, local era) · `aee8835` (C5) · `5dc9254` (base, lane B STATUS) · `e6b812e` |
| E4 | `git diff --stat 5dc9254..HEAD` | 14 files, **2884 insertions, 0 deletions** — exactly `rebuild/coach/**` (13 files) + `rebuild/lanes/c/C5-COACH-REPORT.md`. Nothing else. |
| E5 | `git diff --stat 5dc9254..HEAD -- rebuild/m3` | **empty** — the W6 suite claim holds |
| E6 | `git diff --stat 5dc9254..HEAD -- rebuild/engine rebuild/client rebuild/conform rebuild/m4 .github` | **empty** |
| E7 | sha256 of all 14 table files (node `crypto`) | **14/14 match the report exactly**, line counts match |
| E8 | `node --test "rebuild/coach/test/*.test.cjs"` | `tests 46 · suites 0 · pass 46 · fail 0 · cancelled 0 · skipped 0 · todo 0 · duration_ms 365.08`; `not ok` count = **0** |
| E9 | `node rebuild/coach/coach-text.cjs` | `turns: 25 · untraceable turns: 0 · charter violations: 0`, exit **0** |
| E10 | `node --check rebuild/coach/tools.cjs` | OK |
| E11 | `node -e` over `scripts/questions.json` | **25 questions, 25 unique ids** (brief floor 12) — q01…q24 incl. q16b; 5 tier-3, 3 tier-2, 5 tier-1, 12 reads |
| E12 | `findstr /s /i coach .github\workflows\*.yml` | **no match** (see C7) |

## Attacks

My own probes, written from the brief rather than from the builder's tests, run
under `rebuild/coach/test/.review-scratch/` (scratch, deleted before commit — the
tree is clean apart from this file).

| # | probe | outcome |
|---|---|---|
| A1 | `today_plan` then 8 hand-written sentences through `turn.untraceable()` | 7 GREEN / 1 RED. **field-blind → C2.** Allowed set was `["2030","02","04","2262","2360","155"]`; only `"Do 4 sets of 2262 reps."` went RED, and only because `4` appeared nowhere in the turn |
| A2 | `accept_proposal` with `confirmed` ∈ `{1,"true","yes",{},[],"TRUE","1",1.0,undefined,null}` | **all 10 refused** `COACH_CONFIRMATION_REQUIRED`, store byte-identical each time; only literal `true` accepted |
| A3 | no yes → durable store dump compared before/after | **byte-identical**; `acceptedProposals()` `[]`, `client.face().answers` `[]` |
| A4 | 5 forged proposal ids (one-char flip of the real digest, all-zeros, upper-cased, trailing space, empty) | **all 5 refused** `COACH_PROPOSAL_NOT_ENGINE_ISSUED`, store byte-identical |
| A5 | 7 tier-3 topics — the 5 real + `"phase_override"` + `"calorie_floor "` (trailing space) | all refused, `refused:true`, `state_unchanged:true`, store byte-identical; the two unknown topics fall to the generic refusal, which still refuses and still says "This conversation doesn't change your plan" |
| A6 | `verifyCostCap` with: absent / `null` / `{}` / the shape example / a freshened example | absent+null → `COACH_COST_CAP_ABSENT`; `{}` → `COST_CAP_INVALID` naming all 8 missing keys; **the shape example → `ok:true` (C1)** |
| A7 | cap edge cases: 66-day-stale, `cap_usd_session` > `cap_usd_month`, `evidence` carrying an `sk-…` key | all three refused with distinct, plain-language reasons |
| A8 | good cap + `optIn` ∈ `{omitted, "yes", true}`; and `{optIn:true, user:"dad"}` | omitted/`"yes"` → `COACH_OPT_IN_REQUIRED`; `true` → `COACH_NO_LIVE_ADAPTER` (nothing starts, correct); `user` **silently ignored** (C4) |
| A9 | reload: fresh `createClient` over the same backend after a yes, fresh coach over it | survives = `[{proposal:"prop-82b6…", answer:"accept", op_id:"op-dev-A-1"}]` + `issuances/{id,accepted:true,instance:null}`. Reason/body/producer on disk: **false/false/false**. `acceptedProposals()` `[]` (C3) |
| A10 | `request_replan` with `"7"`, `{sets:7}`, `[7]`, `"make it 7 sets"` | all accepted; issued body and proposal id **identical** to the clean call — arguments reach nothing (C6) |
| A11 | do refusal reasons license digits? (`equipment_unavailable_today`, `current_set`) | **No.** The refusal's `source` string (which carries `t2-stage.cjs:9`, `local-client.mjs:49`) is *not* a tagged display; allowed-token set for both refusal turns is `[]`. Good design, worth keeping |
| A12 | mixed results array: turn A's `today_plan` results + turn B's, scoped to B | `untraceable("Eat 2262 calories.", mixed, "B") = ["2262"]` — the guard works; nothing in the suite exercises it (C5) |
| A13 | source scan of all of `rebuild/coach/**` for `fetch(`, `XMLHttpRequest`, `WebSocket`/`ws://`, `require('node:http\|https\|net\|tls\|dgram\|dns\|http2')`, `http(s)://`, `child_process`/`execSync`/`spawn`, `process.env`, api-key shapes, `override\|bypass\|force\|skip\|disable\|unsafe\|DEBUG_` | **zero network symbols, zero `process.env`, zero `child_process` in `tools.cjs`, `local-world.mjs`, `coach-text.cjs`.** The only hits anywhere are (a) `cost-cap.test.cjs`'s own grep needle strings, (b) the literal word "override" inside the prose "there is no override" in `tools.cjs`, `cap.schema.json`, `TOOL-CONTRACT.md`, `model-adapter.md`, (c) `openai`/`OpenAI` as prose in the cap example/schema, the adapter doc and the brief. No `package.json`, no `node_modules`, **no dependency of any kind** |

## Mutants

Twelve mutants applied to `rebuild/coach/tools.cjs`, each run against the suite
that should notice, each reverted immediately. **10 killed / 2 survived** (the two
survivors are the same defect, C5).

| mutant | suite | result |
|---|---|---|
| M1 `untraceable()` → `return []` | traceability | **KILLED** (fail 3) |
| M2 `confirmed !== true` guard → `if (false)` | tiers | **KILLED** (fail 2) |
| M3 `!issued.has(id)` guard → `if (false)` | tiers | **KILLED** (fail 1) |
| M4 `NEVER_VIA_COACH[topic]` → `null` | tiers | **KILLED** (fail 1) |
| M5 `record.verified !== true` → `=== "impossible"` | cost-cap | **KILLED** (fail 1) |
| M6 `optIn !== true` → `optIn === false` | cost-cap | **KILLED** (fail 1) |
| M7 inner per-tag turn guard removed | traceability | **SURVIVED** |
| M7b outer per-result turn guard removed | traceability | **SURVIVED** |
| M7c **both** turn guards removed | traceability | **SURVIVED** → C5 |
| M8 `charterViolations()` → `return []` | charter-and-gym-seam | **KILLED** (fail 1) |
| M9 `request_replan` numeric-arg guard → `if (false)` | tiers | **KILLED** (fail 1) |
| M10 `assertNoLeak` throw removed | traceability | **KILLED** (fail 1) |
| M11 `TOKEN` regex drops the decimal group | traceability | **KILLED** (fail 1) — the 1.19/1.2 rounding test is load-bearing |
| M12 cap staleness bound `maxAgeDays` → `1e9` | cost-cap | **KILLED** (fail 1) |

**Restored byte-identical.** `tools.cjs` sha256 before the first mutation and
after the last: `5cf96668d30568d2593cfb6dc7a439affa62d77a1c9a8399f10d5f34f9a3da3a`
both times (the driver asserts it, and it matches the report's table).
`git status --short` after `git checkout -- rebuild/coach` and removing the
scratch directory: only `rebuild/lanes/c/C5-COACH-REVIEW.md`.

## Contract spot-checks

`TOOL-CONTRACT.md` documents every one of the 15 tools with a tier, inputs
(`in`), outputs (`out` / `values`), and refusal codes; the envelope and the tagged
value are specified; the `assertNoLeak` forbidden-key list is stated. I read every
line I cite below out of the real source, not out of the report.

| # | claim | verified |
|---|---|---|
| S1 | `m3/w6/local/local-client.mjs:49` and `m3/w6/t2-stage.cjs:9` carry the identical five commands | **YES** — both lines are literally `const COMMANDS = new Set(["weighIn", "logSet", "logSession", "finishSession", "workout"]);`. `t2-stage.cjs:84` is `} else throw new Error("Unsupported staged command");`. The local era does **not** widen the staged set |
| S2 | `accept_proposal` → `rebuild/client/index.cjs:271 respond()`, `:338 recordIssuance()`, `:161 answers()` | **YES** — `:271` commits `kind:"proposal-response"` with `payload:{proposal_id, answer}`; `:338` writes `{id, accepted, instance}` to the `issuances` collection; `:161` is `function answers()` filtering `kind === "proposal-response"`. This is also the evidence for C3: the payload has no reason field |
| S3 | `today_plan` → `engine/energy.cjs:684 calorieTarget`, `:117 proteinTarget` | **YES** — both lines are the exact `function calorieTarget(s) {` / `function proteinTarget(s) {` declarations |
| S4 | the carried engine refusals `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` (`engine/performed.cjs:193`) and `PROGRESSION_RESET_MAPPING_REQUIRED` (`engine/progression.cjs:117`) | **YES** — both codes appear verbatim at exactly those lines. The coach carries the engine's own code rather than inventing a friendlier one |
| S5 | `request_replan(volume)` → `engine/volume.cjs volumeImbalance` | **YES** — `function volumeImbalance(s) {` at `volume.cjs:99`; the issued body (`hams`, `weeklySetsNow:4`, `addWeeklySets:6`, `expectedGainPct:2.05`, `sdes:2.05`, `regime:"free"`) is the producer's own output, and I re-derived it independently from `today.engine.volumeImbalance(stateFromOps())` |
| S6 | `why_this_instruction` → `engine/today.cjs:279 theOneFix`, `:405 statusFace` | **YES** — both declarations sit at exactly those lines |
| S7 | `equipment_unavailable_today` refuses because no equipment field exists | **YES** — `grep -i equipment m3/w7-preview/today/checkin-commands.cjs` = **0 hits**; `const FIELDS` is at `:58`. The refusal `COACH_FACT_COMMAND_ABSENT` names both sources in words |

Tools I did not independently re-derive: `current_set`/`next_set` beyond their
composition path, `last_comparable_performance` (the engine returns `prev: null`
on this synthetic athlete, so the `COACH_NO_QUALIFIED_COMPARISON` branch is what
executes — I confirmed the branch, not the comparison), and the four check-in
writers on the local era (I read `local-era.test.cjs` and ran it, but did not
build a second independent local world).

## Residuals

- **R1 — no CI home (C7).** The single most important one: nothing in
  `.github/workflows` runs these 46 tests, so "CI green both OS" says nothing
  about this delivery. Not editable from this review by instruction.
- **R2 — no model, no voice, no UI, no cap on any account, no opt-in screen.**
  All four are disclosed in the builder's report and I confirmed each: no network
  symbol anywhere, `startLiveSession` always returns `started:false`, no Coach-tab
  screen in the tree, `cap.example.json` self-labelled SHAPE ONLY.
- **R3 — the check-in lane is not on the local era** (`checkInOnLocalEra:false`),
  disclosed by the builder and carried in `TOOL-CONTRACT.md`. I did not attempt to
  merge it.
- **R4 — the consent write is injected**, not reached through any staged client;
  `respond` is in neither COMMANDS set (S1), so on a real phone tier 2 does not
  yet have a path. This is the builder's own suggested-order item 1 and I agree it
  is the single highest-value next change.
- **R5 — synthetic athlete only.** Every number I saw (2262/2360 kcal, 155 g,
  hams 4→6 sets) comes from `m3/w7-preview/fixtures.cjs`. No real data was read.
- **R6 — node version.** I used plain `node` = v24.18.0. I did **not** re-run the
  suite under the codex-runtime node binary, so a runtime-specific difference is
  unexcluded (the report's v24.19.0 vs my v24.18.0, C6(ii)).
- **R7 — the charter lint is a 38-phrase literal list.** It is exact and it kills
  its mutant (M8), but it is a denylist: a model that invents new encouragement
  vocabulary passes it. That is inherent to the instrument, not a defect here; it
  belongs in the adapter's acceptance alongside C2.
- **R8 — `assertNoLeak` walks to depth 8 and matches key names only.** A ledger
  smuggled under a renamed key, or below depth 8, would not be caught. Not
  exploitable by the templates; noted for the adapter.

## Not run

- The W6 suite, A1/A2/A3/A5 suites, `--ci`, `--full` — untouched by construction
  (E5/E6 prove the trees are byte-identical), and out of scope for this review.
- Any live model, network or API call — impossible by construction and forbidden
  by the ruling until a cap exists.
- Dad's five-minute hand test and Joe's week of use — owner actions, per the brief.
- CI on either OS (no coach step exists to run — C7/R1).
- A second, independently composed local world for `local-world.mjs`; I ran the
  builder's `local-era.test.cjs` (9/9) and read the composition, but did not
  rebuild it from `openLocalDurableClient` myself.

## What the lane lead must decide

1. **C1 before anything else** — one guard line plus one test fixture. Until it
   lands, the cap gate green-lights a file that says it is not a cap.
2. **C3's question:** does "recorded with the reason" (DECISIONS:89 tier 2) mean
   on disk? If yes, tier 2 is not closed and the work is in `rebuild/client`, not
   in `rebuild/coach`.
3. **C7:** who adds the CI step, and does the mechanical integrator merge before
   it exists (in which case the ledger line should say the CI half of the
   LANES.md:16 bar was not met for this delivery).
4. **C2 is the gate on the model adapter.** It does not block C5. It must block
   the first line of GPT-Live-1 code.

---

## Round 2 (delta be888dd)

Reviewer: the same independent reviewer, same posture — the fixer's
"Review round 1 — conditions applied" section is a hypothesis, and every
condition below was re-executed here rather than read.
Worktree `work/lane-c/review-coach`, detached at **`be888dd`**
(`378a819` code+tests, `be888dd` report + the round-1 review copied in), rebased
onto `origin/rebuild/t2-client-core` @ **`3bb2802`**. Round-1 review commit
`022ae8a` remains reachable; the copy of it at `be888dd` is **byte-identical** to
what I committed (`git diff 022ae8a:… be888dd:…` empty).

### Baseline re-measured

| check | result |
|---|---|
| `git diff --stat 3bb2802..be888dd -- rebuild/m3 rebuild/engine rebuild/client rebuild/conform rebuild/m4 .github` | **empty** |
| `git diff --stat 3bb2802..be888dd` | 15 files, **4004 insertions, 0 deletions** — `rebuild/coach/**` + the report + the review copy |
| rebase fidelity: `git diff e576905 4a2cdca -- rebuild/coach` | **empty** — the rebase moved the coach tree unchanged, so all 621+/78− is the fixer's work |
| `node --test "rebuild/coach/test/*.test.cjs"` | `tests 54 · pass 54 · fail 0`, `not ok` count **0** |
| per suite | traceability **14**, tiers **12**, local-era **9**, cost-cap **11**, charter-and-gym-seam **8** = **54** — exactly as claimed |
| `node rebuild/coach/coach-text.cjs` | `turns: 25 · untraceable turns: 0 · charter violations: 0`, exit 0 |
| `node --check rebuild/coach/tools.cjs` | OK |
| sha256 of the report's 14-file table | **14/14 match** (I extracted the table from the report and recomputed independently) |
| `node --version` | **v24.18.0** — the report's corrected value |

### Per-condition verdict

**C1 (was BLOCKING) — CLOSED.** Executed: `verifyCostCap(cap.example.json)` now
returns `ok:false / COACH_COST_CAP_INVALID`, and `startLiveSession` with it
returns `COACH_COST_CAP_INVALID` — it never reaches `COACH_NO_LIVE_ADAPTER`. I
checked the guard is on the **annotation, not the filename**: a live-shaped record
with `_note` added refuses, so does `_todo`, so does a bare `_` key; an array
refuses `COACH_COST_CAP_ABSENT`; the example stripped of every `_` key verifies
`ok:true` and reaches `COACH_NO_LIVE_ADAPTER`, which is the correct end state.
Red-first confirmed by mutation: replacing the annotation scan with `[]` turns
*"THE SHAPE EXAMPLE IS NOT A CAP"* RED (fail 1). The suite's `good()` is now a
synthetic live-shaped record, so the suite no longer asserts the non-cap is a cap.

**C2 — CLOSED as specified; see the new condition C8 for what the fix does not
reach.** All **five** of my round-1 must-refuse strings now refuse and all
**three** must-accept strings still accept, measured on the same `today_plan`
turn (allowed map: `2262→kcal`, `2360→kcal`, `155→g`, `2030/02/04→date`):

| said | round 1 | round 2 |
|---|---|---|
| `Eat 155 calories today.` | `[]` | **`["155"]` refused** |
| `Your protein target is 2262 grams.` | `[]` | **`["2262"]` refused** |
| `Add 2030 weekly sets.` | `[]` | **`["2030"]` refused** |
| `Rest 155 minutes between sets.` | `[]` | **`["155"]` refused** |
| `Your weight is 2262 pounds.` | `[]` | **`["2262"]` refused** |
| `Today: 2262–2360 kcal · 155 g protein` | `[]` | `[]` accepted |
| `Your calorie band today is 2262 to 2360.` | `[]` | `[]` accepted |
| `Your protein target is 155 grams.` | `[]` | `[]` accepted |

**Three NEW probes of my own, different units and fields** (plus four more I ran):
`"Do 2262 reps."` → **refused** (kcal into `rep`); `"That is 155 days away."` →
**refused** (g into `day`); `"You slept 2360 hours."` → **refused** (kcal into
`h`). Also `"Log 155 lb on the bar."` → refused, `"2360 g of protein."` →
refused, and two legitimate forms still accepted: `"Eat 2,262 calories today."`
(comma form) and `"Eat between 2262 and 2360 kcal."` Date discipline holds:
`"Do 2030 sets."` refused, `"Do 2030 of them."` refused (a bare number is not
licensed by a date), `"Today is 2030-02-04."` accepted.

**The 25 turns / 0 untraceable are NOT bought by loosening the checker.** I
mutated the checker to accept everything (`untraceable()` → `return []`) and ran
the whole suite: **fail 6**, RED on *"FAIL-CLOSED: a template copy with a literal
number turns the check RED"*, *"FAIL-CLOSED: a plausible-but-wrong rounding…"*,
*"a number is traceable only INTO THE FIELD THAT LICENSED IT"*, *"a date tag
licenses a date, never a bare quantity"* and two more. Two further loosening
mutants also die: making every parsed number unit-less (`fail 2`) and making
`allowedTokens` ignore the declared unit (`fail 3`). Removing `d()`'s
`COACH_UNIT_MISMATCH` throw turns *"every interpolation declares the unit it
speaks into"* RED. The instrument is load-bearing in both directions.

**C3 — CLOSED.** I re-executed the durability probe: after a yes the store holds
one op (`proposal-response`, payload exactly `{proposal_id, answer:"accept"}`) and
one issuance (`{id, accepted:true, instance:null}`); the 388-char reason, the
producer name and `addWeeklySets` are each absent from the raw dump; a fresh
client over the same backend keeps only `[{proposal, answer, op_id}]` and a coach
rebuilt over it has `acceptedProposals()/issuedProposals()/consentLedger()` all
`[]`. The old test is renamed *"…equals the engine's proposal exactly (in
memory)"* (`tiers.test.cjs:97`) so it no longer reads as durable proof, and the
new test *"EXACTLY what the durable store keeps after a yes — and the reason is
NOT on disk"* (`:123`) asserts each of those facts, with the failure message
`"the engine's reason IS on disk — update this test and C3"` — it goes RED the day
a durable reason lands, which is what I asked for. `rebuild/client` is untouched.
The open question (does DECISIONS:89's "recorded with the reason" mean on disk?)
is correctly escalated rather than answered by the lane.

**C4 — CLOSED.** Executed, 14 cases: a bare `true` refuses (with or without a
user); Joe's record with `user:"joe"` and Dad's with `user:"dad"` each reach
`COACH_NO_LIVE_ADAPTER`; **Joe's record presented as Dad refuses**, and Dad's as
Joe refuses; a record with `accepted:"yes"` refuses; a missing/numeric `user`
refuses; and four wording patches refuse — wording that omits "phone", wording
that omits "audio", empty wording, and *"Turn on the voice coach for a better
experience."* The wording that passes names the phone, the audio, the text and
that it **leaves**, which is the brief's privacy clause. `NAMED_USERS` is
`["joe","dad"]`. Mutation: removing the `optIn.user !== user` check turns *"the
opt-in is PER USER"* RED; removing the wording check turns *"the opt-in record
must carry the wording the user actually saw"* RED; removing the record-shape
check and the `accepted !== true` check each turn a cost-cap test RED.

**C5 — CLOSED.** My round-1 test is in the suite verbatim and each guard is now
load-bearing **individually**, which I verified by mutation rather than by
reading the fixer's table: both guards removed → `fail 1`; outer guard only →
`fail 1`; inner guard only → `fail 1`; in every case the RED test is *"the turn
guards are load-bearing: a POOLED results array cannot lend provenance"*.
Executed directly: `untraceable("Eat 2262 calories.", tA.results.concat(tB.results), "B")`
→ `["2262"]`, and the same pooled array scoped to `"A"` → `[]`, so the test
measures the guard and not the absence of the number. `tools.cjs` is unchanged
here, as the fixer says.

**C6 — CLOSED, with the bound stated precisely.** The payload walk is real:
`{note:{sets:7}}`, `{n:[7]}`, a depth-5 nest and a **depth-9** nest are all
refused `COACH_PROPOSAL_NOT_ENGINE_ISSUED`; `NaN` and `Infinity` are refused too.
A **depth-12** nest passes — consistent with the documented `depth > 8` bound, not
a contradiction of it — and so do a numeric **string** (`"7"`), a number inside
prose, and a numeric object **key**. In every passing case I compared the issued
proposal body **and** the proposal id against the clean call: **identical**, so
the arguments demonstrably reach nothing. Mutation: collapsing the walk to the top
level turns *"tier 2: the model may never construct the numbers"* RED. The node
version is corrected and matches my measurement.

**C7 — OPEN, correctly and by design.** `.github` is untouched
(`git diff --stat 3bb2802..be888dd -- .github` empty), which is what I asked for.
The fixer supplies the exact one-line step and states plainly that until it
exists the CI half of `LANES.md:16`'s bar has not been met for this delivery. This
remains PM/integrator-owned and is not something the lane can close.

### New probes and what they found

Beyond the C1–C7 evidence above, one class of sentence still passes that should
not, and it is the same threat model C2 was written for.

**C8 — the checker reads only RIGHTWARD, so dropping the unit noun restores the
round-1 hole.** Executed on the same `today_plan` turn, all **accepted**:

| said | why it passes |
|---|---|
| `Your protein target is 2262.` | no unit word *after* the number → "bare" → licensed by any quantity. This is my round-1 must-refuse R2 with the word "grams" deleted |
| `Your calorie floor is 155.` | same, the other direction |
| `You weigh 2262.` | a calorie floor spoken as a bodyweight |
| `Protein: 2262. Calories: 155.` | field names are to the LEFT and are never read |
| `Rest 155 seconds.` | `seconds` is not in `UNIT_WORDS` → unknown unit → treated as bare |
| `Add 155 kilograms.` | `kilograms`/`kg` not in `UNIT_WORDS` → bare |
| `Your body fat is 2360 percent.` | `percent` not in `UNIT_WORDS` → bare |

This is a documented design choice ("a number with no unit word around it is
licensed by any quantity in the turn"), and it **cannot be reached by this
artifact**: every interpolation goes through `d(tag, unit)`, which throws
`COACH_UNIT_MISMATCH` on a wrong tag and `TypeError` when no unit is declared, and
no template string contains a digit. But `untraceable()` is the instrument
`model-adapter.md §8` names as the adapter's bar, and a model emitting free text
has no `d()` in its path. The class C2 named — "a number that the engine did not
compute *for that purpose* is spoken as if it had been" — is materially narrowed
but not closed.
*Exact change:* read the field/unit words **before** the number as well as after
(a field-word table: `protein`, `calorie(s)`, `weight`, `rest`, `sleep`, `sets`,
`reps` → the unit they name), and treat an **unrecognised** noun adjacent to a
number as an unknown unit that licenses nothing, rather than as "no unit".
Fail-closed on ambiguity is the posture the rest of this file already takes.
*Red-first probes the fix must refuse:* `"Your protein target is 2262."`,
`"Rest 155 seconds."`, `"Protein: 2262. Calories: 155."`
*and must still accept:* `"Your protein target is 155 grams."`,
`"Eat between 2262 and 2360 kcal."`, `"Today: 2262–2360 kcal · 155 g protein"`.

### Mutants

**23 mutants run, 20 killed / 3 survived.** Two files mutated (`tools.cjs`,
`coach-text.cjs`), each restored and verified by sha256 after every run:
`897b179d08e6902bfd1f681c6f03ae758b10ca96a3d592aab69b2fb68a8526f6` (tools) and
`683c01ad998c8cd3e9cbe9ee86813b85d47fbcaae6e138b715a26f8467c2d2c9` (coach-text),
both matching the report's file table; `git status --short` clean afterwards and
54/54 green on the restored tree.

Killed (20): checker → accept-everything (fail 6); every number bare (2);
declared unit ignored (3); both turn guards (1); outer guard alone (1); inner
guard alone (1); `d()` unit assertion (1); `request_replan` walk → top level (1);
cap annotation guard (1); cap staleness (1); cap credential scan (1); opt-in
record shape (1); opt-in `accepted !== true` (1); opt-in user match (1); opt-in
wording (1); charter lint (1); `confirmed` guard (2); issued-ledger check (1);
`assertNoLeak` (1); tier-3 explanation (1).

Survived (3), all non-blocking and all named here rather than left silent:
- **S1 — `bare number may borrow a date`.** Deleting the `u !== "date"` filter in
  `untraceable()` kills nothing. The rule is real and correct (my probe
  `"Do 2030 of them."` is refused because of it) but no test asserts it. *Add my
  probe as a test.*
- **S2 — the named-user check.** Removing `NAMED_USERS.includes(user)` kills
  nothing: a third user with her own matching record would start. The brief's
  "two named users only — Joe and Dad; no third user without a separate owner
  ruling" is implemented but unproved. *Add: a `"mum"` record with `user:"mum"`
  must refuse `COACH_OPT_IN_REQUIRED`.*
- **S3 — `Array.isArray(record)` in `verifyCostCap`.** Near-equivalent: without it
  an array still refuses, as `COACH_COST_CAP_INVALID` instead of
  `COACH_COST_CAP_ABSENT`. No behaviour is lost; not worth a test.

### The rebase-induced test edit

Verified, and it is a **real weakening** the report understates, though the claim
itself survives. Round 1's two assertions both read **code** out of
`checkin-host.mjs`: `workoutCommands: createCheckInCommands()` and
`client.execute('workout', { action: 'checkin'`. Round 2 has three: one still
reads code (`commands: createCheckInCommands()` — which I confirmed is really
there, `checkin-host.mjs:48`), and **two now match comment prose** in
`checkin-commands.cjs:14–16`. A comment can drift from the code it describes; a
`client.execute('workout', …)` assertion cannot.

The underlying claim — *producer injection is the accepted client's own extension
point, not a bypass* — **is still true and still asserted where it matters**:
`workout` is in both COMMANDS sets (asserted at `tiers.test.cjs:270–271`, and I
re-read both files: `t2-stage.cjs:9` and `local-client.mjs:49` are still the
identical five), `checkin-host.mjs:48` really passes the producer down, and the
**behaviour** is proved by execution rather than by reading source in
`local-era.test.cjs` — which is **byte-identical to round 1**
(`304a310676a6c025f1d68f5da3e8d3044b9abc17c306d0e6db02608c3921e983`, the same
hash I recorded at `e576905`) and passes 9/9 on the new tip. That is the strongest
possible evidence that the rebase did not change the behaviour under test.
Nothing under `rebuild/m3` changed on this branch. *Suggested, non-blocking:*
restore one behavioural source assertion (`client.execute('workout'`) at whatever
file now carries it, so the pin is on code rather than on prose.

## FINAL VERDICT: ACCEPT WITH CONDITIONS

**No BLOCKING condition remains** — C1, the only blocker from round 1, is closed
and proved red-first. This delivery is mergeable on this review; what follows are
carry-forwards, all NON-BLOCKING for C5 itself.

- **C8 — NON-BLOCKING for C5; BLOCKING PREREQUISITE for any model adapter.** The
  traceability checker reads only rightward and treats an unrecognised unit noun
  as "no unit", so `"Your protein target is 2262."` and `"Rest 155 seconds."`
  pass. Unreachable by the templates (`d()` guards every interpolation), reachable
  by the first free-text model. Fix and red-first probes stated above. This
  inherits C2's marking rather than being a new discovery about the delivery.
- **C9 — NON-BLOCKING.** Three surviving mutants: add the date-borrow test (S1)
  and the third-user test (S2). S3 needs nothing.
- **C10 — NON-BLOCKING.** Restore one behavioural (code, not comment) source
  assertion for the producer-injection claim in `tiers.test.cjs`.
- **C7 — STILL OPEN, PM/integrator-owned.** No CI step runs these 54 tests. The
  lane did the right thing by not editing `.github`; the ledger line should record
  that the CI half of `LANES.md:16`'s bar was not met and that the merge rests on
  this review alone.

### For the lane lead

1. **Merge is not blocked.** C1 closed; C2–C6 closed; C7 was never the lane's to
   close.
2. **The PM question from round 1 is still open and still needs an answer:** does
   DECISIONS:89's "recorded with the reason" mean on disk? If yes, tier 2 is not
   finished and the work is a `rebuild/client` change, not a coach change. The
   test now states the gap honestly and will go RED when it is fixed.
3. **C8 is the gate on GPT-Live-1**, exactly as C2 was. Do not let an adapter land
   against the current checker.
4. **C7:** decide whether the integrator merges before the CI step exists, and say
   so in the ledger line either way.

---

## Round 3 (delta d961bd8)

Same independent reviewer, same posture: the fixer's round-2 section is a
hypothesis. Worktree `work/lane-c/review-coach`, detached at **`d961bd8`**
(`0d8a5e8` code+tests, `d961bd8` report + review copy), rebased onto
`origin/rebuild/t2-client-core` @ **`292d01d`**. My round-2 commit `23a3533`
remains reachable and the copy at `d961bd8` is **byte-identical** to it
(`git diff 23a3533:… d961bd8:…` empty).

### Baseline re-measured

| check | result |
|---|---|
| `git diff --stat 292d01d..d961bd8 -- rebuild/m3 rebuild/engine rebuild/client rebuild/conform rebuild/m4 .github` | **empty** |
| delta `be888dd..d961bd8 -- rebuild/coach` | 7 files, 240 insertions, 28 deletions |
| `node --test "rebuild/coach/test/*.test.cjs"` | `tests 58 · pass 58 · fail 0`, `not ok` **0** |
| per suite | traceability **16**, tiers **13**, local-era **9**, cost-cap **12**, charter **8** = **58** — exactly as claimed |
| `node rebuild/coach/coach-text.cjs` | `turns: 25 · untraceable turns: 0 · charter violations: 0`, exit 0 |
| `node --check rebuild/coach/tools.cjs` | OK |
| report file table | **14/14 sha256 AND 14/14 line counts match** (extracted from the report and recomputed) |

### C8 — CLOSED

The fix is three mechanisms, not one, and I checked each separately: a
**leftward `FIELD_WORDS` scan** (label and subject forms), **unknown nouns bound
as `!noun`** so they license nothing but themselves, and a **`BARE_SPEAKABLE`
allowlist** (`set`, `rep`, `lift`, `reading`, `pct`, `?`) that is the only way a
number may be spoken with no unit at all — `date` deliberately absent.

All **seven** entries of my round-2 C8 table now refuse, each with the unit the
checker inferred:

| said | round 2 | round 3 | inferred |
|---|---|---|---|
| `Your protein target is 2262.` | accepted | **refused `["2262"]`** | `g` (leftward "protein") |
| `Your calorie floor is 155.` | accepted | **refused `["155"]`** | `kcal` (leftward) |
| `You weigh 2262.` | accepted | **refused `["2262"]`** | `lb` (leftward "weigh") |
| `Protein: 2262. Calories: 155.` | accepted | **refused `["2262","155"]`** | `g` then `kcal`, label form, clause-scoped |
| `Rest 155 seconds.` | accepted | **refused `["155"]`** | `!seconds` |
| `Add 155 kilograms.` | accepted | **refused `["155"]`** | `!kilograms` |
| `Your body fat is 2360 percent.` | accepted | **refused `["2360"]`** | `pct` |

No regression: all ten round-1/round-2 must-refuse strings still refuse, and all
six must-accept strings still accept (`Today: 2262–2360 kcal · 155 g protein`,
`Your calorie band today is 2262 to 2360.`, `Your protein target is 155 grams.`,
`Eat 2,262 calories today.`, `Eat between 2262 and 2360 kcal.`,
`Today is 2030-02-04.`).

**Three NEW probes of my own devising**, none previously seen by the fixer:

| # | probe | outcome |
|---|---|---|
| N8 | `"155 kcal of protein."` — the **unit sits before the field noun**, so rightward binds first | **REFUSED `["155"]`** (asks `kcal`, 155 is `g`). The rightward unit correctly wins over the trailing field word |
| N9 | `"Your protein is 2262. Calories are next."` — the licensing **unit noun is in another clause** | **REFUSED `["2262"]`** (asks `g` from the leftward scan; the scan stops at the full stop and never reaches "Calories") |
| N10 | `"You are 2262 percent there."` — a **percentage** | **REFUSED `["2262"]`** (asks `pct`, 2262 is `kcal`) |

Four more I ran: `"Set 2262 of 3."` → refused `["2262","3"]` (label form binds
`set`); `"2262 is your calorie band."` → **accepted** (number first, field after,
crossing filler — the legitimate form still works); `"Do 2030 of them."` →
refused via `!them`; `"Your widget is 2262 widgets."` → refused via `!widgets`.

**Mutation — each mechanism is load-bearing, and I named the RED test for each:**

| mutant | fail | RED test |
|---|---|---|
| leftward binding off (`unitBefore` → `null`) | 2 | *"deleting the unit word does not make a number free: the field still binds"* (+ *"a number is traceable only INTO THE FIELD THAT LICENSED IT"*) |
| bare rule reverted to round 2 (`u !== "date"`) | 1 | *"deleting the unit word does not make a number free: the field still binds"* |
| unknown noun → no unit (the round-2 hole restored) | 1 | *"an unrecognised unit noun licenses nothing but itself"* |
| `FIELD_WORDS` emptied | 2 | *"a number is traceable only INTO THE FIELD THAT LICENSED IT"* |

**The 25/0 is NOT bought by loosening.** Two independent checks:
1. Checker → accept-everything (`untraceable()` → `return []`) over the whole
   suite: **fail 8**, RED on both FAIL-CLOSED tests, *"a number is traceable only
   INTO THE FIELD THAT LICENSED IT"*, *"deleting the unit word…"*, *"an
   unrecognised unit noun…"*, *"a date tag licenses a date…"* and two more.
2. **The decisive one.** The templates now speak their units — `weight_trend`'s
   range gained `" pounds a week"` on the upper bound. I reverted exactly that
   template line to its `be888dd` form and ran the CLI: **`turns: 25 ·
   untraceable turns: 1`, exit 1**, and the traceability suite went RED (fail 2)
   on *"every numeric token in every answer comes from a tool result in the SAME
   turn"*. So the 25/0 is held by the template being made honest, not by the
   instrument being made permissive — the checker did tighten and the prototype
   had to change to keep up.

### C9 — CLOSED (both round-2 survivors now die)

Executed, not read:
- **date-borrow (S1):** mutating `untraceable()` so a bare number may be licensed
  by anything (`licensed = true`) → **fail 2**, RED on *"a date tag licenses a
  date, never a bare quantity"* and *"deleting the unit word does not make a
  number free"*. In round 2 this mutant survived.
- **third user (S2):** removing `NAMED_USERS.includes(user)` → **fail 1**, RED on
  *"TWO NAMED USERS ONLY: a third user's own valid opt-in still refuses"*
  (`cost-cap.test.cjs:174`). In round 2 this mutant survived.

S3 (`Array.isArray` in `verifyCostCap`) remains a near-equivalent mutant; I said
in round 2 it needs no test and I still say so — an array refuses either way, only
the code differs.

### C10 — CLOSED, and stronger than I asked for

I asked for one behavioural code assertion. The fixer replaced **both** comment-
prose assertions with a code pin on the stage's own signature — I confirmed
`t2-stage.cjs:20` really is
`function createT2Stage(configProvider, { allowInbound = false, workoutCommands: selectedWorkoutCommands = workoutCommands } = {})`,
which is precisely the claim: the accepted stage *takes the provider as an
argument*, so producer injection is its own extension point and not a bypass —
and added a new test that **executes the real path**, not a stub:
`require("…/checkin-commands.cjs").createCheckInCommands()` → `schemaVersion === 2`,
`prepare({action:"checkin", …})` returning `class:"event"`, `kind:"fact"`,
`payload.profile === PROFILE`, `payload.answers` deep-equal, `parents: []`,
`effective.local_date`; then `prepare({action:"logSet"})` and an invented choice
both **throw** `CHECKIN_INPUT_INVALID`; then the producer's own `validate()`
accepts the envelope the client builds and rejects a `kind:"reading"` variant.

**Four stub/undermine mutants, all killed** (I mutated `checkin-commands.cjs` and
`t2-stage.cjs` in my worktree and restored both byte-identical):

| mutant | fail | RED test |
|---|---|---|
| producer authors `class:"reading"` instead of `"event"` | 1 | *"the check-in's producer, EXECUTED: it authors the op the client will write"* |
| `schemaVersion: 1` instead of `2` | 1 | same |
| `payload.profile` dropped | 1 | same |
| stage signature drops the `workoutCommands` provider | 1 | *"the staged command set is NOT widened by the local era"* |

A stub would have to reproduce the class, the kind, the profile, the answer
shape, the parents, the effective date, the refusals and the validator to pass —
which is to say it would have to be the producer.

### Mutants

**12 valid mutants run in round 3, 12 killed / 0 survived.** (A thirteenth,
"producer accepts any action", was a no-op on my part — I inserted a comment, not
a change — and is excluded rather than counted as a survivor.) Three files were
mutated and every one restored and verified by sha256 after each run:
`rebuild/coach/tools.cjs`, `rebuild/coach/coach-text.cjs`,
`rebuild/m3/w7-preview/today/checkin-commands.cjs` and `rebuild/m3/w6/t2-stage.cjs`
— all `identical=true` afterwards, `git status --short` empty, and the restored
tree re-runs 58/58 with the CLI back at 25/0/0.

Killed: leftward binding off; bare rule reverted; unknown-noun hole restored;
`FIELD_WORDS` emptied; date-borrow; third user; checker→accept-everything;
template range spoken bare (CLI + suite); producer class; producer schemaVersion;
producer payload profile; stage signature.

### Residuals (recorded, not conditions on this code)

- **R-CI — `.github` has no step that runs these 58 tests.** Unchanged and
  correctly untouched by the lane (`git diff -- .github` empty). The exact
  one-line step is in the report. `LANES.md:16`'s CI half is still unmet for this
  delivery, and the integrator's ledger line should say the merge rests on this
  review alone.
- **R-REASON — the PM question is still open:** does DECISIONS:89's "recorded
  with the reason" mean on disk? The existing `rebuild/client` consent path has no
  reason slot; `rebuild/client` is untouched; the tier-2 test states the gap
  honestly and will go RED the day a durable reason lands. This is a ruling to
  make, not a defect to fix in the coach.
- **R-SCOPE — unchanged from round 1:** no model, no voice, no UI, no cap on any
  account, no opt-in screen, check-in lane not yet on the local era, consent write
  injected, synthetic athlete only. All disclosed in the report.
- **R-BARE — a narrow, deliberate relaxation worth knowing about.** Counts
  (`set`, `rep`, `lift`, `reading`), `pct`, and figures the engine itself stated
  bare may be spoken bare, so if a turn licenses a small count the same digits may
  be repeated without a unit. This is what makes "set 1 of 3" sayable; it is
  documented in the source, it cannot promote a calorie, protein, weight, rate,
  duration or date figure, and I am recording it rather than raising it.

## FINAL VERDICT ACCEPT at d961bd8

All ten conditions raised across three rounds are closed and proved by execution
in this worktree: C1, C2, C3, C4, C5, C6 (round 1), C8, C9, C10 (round 2). C7 is
recorded as the residual R-CI and the reason-on-disk question as R-REASON —
neither is a condition on this code. 58/58 green, CLI 25 turns / 0 untraceable /
0 charter violations, 14/14 hashes and line counts, isolation empty against
`292d01d` for `rebuild/m3`, `rebuild/engine`, `rebuild/client`, `rebuild/conform`,
`rebuild/m4` and `.github`, and 12/12 round-3 mutants killed with every mutated
file restored byte-identical.

Two things for the lane lead, neither blocking the merge: get the CI step added
(or say in the ledger line that it was not), and put the reason-on-disk question
to the PM. The model adapter remains gated on `model-adapter.md §8` with this
checker as its bar — which, after three rounds, it now deserves to be.
