# EARNED — B-NTC — QUALIFIED `nativeTrendContext` PROVIDER — behaviour/delta brief v1 — **PROPOSED, NOT ACCEPTED**

Package **B-NTC**, ruled the FIRST lane-B engine package and the S2 blocker by the PM at
`rebuild/DECISIONS.md:103`:

> **(1) ORDER: a NEW small engine package goes FIRST: B-NTC = qualified nativeTrendContext
> provider (turns PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED into a real provider per
> PERFORMED-ENGINE-v1 / NATIVE-CARRIERS-THEME open boundary; includes the legacy
> order-mapping provider only if it is the same seam, otherwise B-LOM follows) — it is the
> S2 blocker (line 102)**

**Base tree:** `origin/rebuild/t2-client-core` @ `12cfdb9d58fbcab10faacdaff8ef886ca79ab9c2`
(`12cfdb9`) — the tip the ruling names. Every line number, quotation and sha256 below was
re-read on that tree, on the owner's PC.

**Branch:** `rebuild/lane-b-ntc`. Lane-B builder output; **speculative until reviewed**.
Nothing here is merged, accepted or receipted.

**CURRENT TIP ADVISORY — read this before merging.** During this pass
`origin/rebuild/t2-client-core` advanced 34 commits to
`da6305347bc04b49f7ecd347433a75dc962d8bb5` (`da63053`, ledger lines 104–106: the
M2-NATIVE-CARRIERS **CI re-seal** and the lane-C C1/C2/C2b/C3 integration).
`git diff --name-only 12cfdb9 da63053 -- rebuild/engine rebuild/conform` = **0 files**, and
`-- rebuild/m4/workout rebuild/m3/w6/host rebuild/m3/w7-preview/today` = **0 files**, so
**every engine coordinate and every hunk in this brief holds unchanged at `da63053`**.
Two things did move and both matter to this package:

1. **The parent artifact was re-sealed.** `rebuild/m4/spec/acceptance-native-carriers.json`
   is `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` at `12cfdb9` (the
   hash this package was told to bind, receipt `DECISIONS:96`) and
   `e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a` at `da63053`
   (receipt `DECISIONS:104`, which supersedes line 96 — exactly three execution pins moved:
   `rebuild.yml`, THEME, BUILD-REPORT; **product, coverage, gates and authorizations are
   byte-identical**). The parent pin in `packages/B-NTC.json` names both and says which is
   re-taken on rebase.
2. **The batched `rebuild.yml` re-seal item that ruling (5) told the FIRST package to carry
   is already CLOSED** by the PM's own CI re-seal (`DECISIONS:105`: *"The batched CI item
   from lines 99/101/102 is CLOSED except retiring the old memory-only preview child
   (`# pass 19`) — next re-seal"*). **B-NTC therefore carries no `rebuild.yml` change at
   all**, and the one residue (`# pass 19`) is a `rebuild.yml` edit this package does not
   make. That is a deliberate scope reduction, recorded here rather than silently dropped.

---

## 0. What B-NTC is, in one paragraph

`rebuild/engine/performed.cjs` asks an injected `nativeTrendContext` resolver, once per
native row the trend readers enumerate, whether that session was `hard`, `rushed` or in
sleep `debt`; and it refuses `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` unless the answer
echoes the exact Start / source revision / effective tuple it asked with and carries three
booleans. Every accepted host in the tree hands it A0's `createUnavailableNativeTrendContext`,
which always throws — so a fresh athlete's second session on a lift he has already trained
cannot be prepared at all (`DECISIONS:102`). **B-NTC supplies a real provider**: a binding
that proves correspondence to the very facts object the engine is about to read, and a day
reader that derives each flag from a fact the athlete actually recorded — and that **throws
rather than answer** whenever it cannot. Nothing under `rebuild/engine`, `rebuild/conform`,
`rebuild/m4/spec` or `.github` is edited. No law moves. The public census is byte-identical.

**What it is NOT.** It is not a new training rule, a scientific claim, a schema change, a
second engine, or a change to any accepted formula. It does not touch the frozen app, the
oracle, the goldens, the 45 register laws or the private census. It registers **no D-ID**.

---

## 1. The contract — what "qualified" means, quoted

### 1.1 `rebuild/m4/spec/PERFORMED-ENGINE-v1.md:254` (the accepted open boundary, verbatim)

> The native branch requires trusted source-context correspondence. The candidate performed
> factory's existing dependency argument may receive an internal nativeTrendContext
> resolver; no new shipping browser option or renderer/state callback is enabled. **Request
> binds actual Start, current factual source revision and exact effective tuple; result must
> echo that binding and supply explicit hard/rushed/debt booleans. Missing/mismatched
> context refuses with PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED before a recommendation,
> never falling back to absent legacy fields or caught exceptions interpreted as false.**
> The real host lacks that qualified resolver and stays unqualified until its existing
> source/context/science/currentness join. Fixtures may supply an explicitly assumed
> source-bound context for formula tests, not personal clearance.

`PERFORMED-ENGINE-v1.md` §0 (`:11-18`) fixes the frame this brief works inside:

> No edits to frozen app, original laws/oracle/manifest, old goldens, seeded soak or
> canonical operation bytes. This amendment selects an engine-side read representation; no
> new authority schema or transport format. Default legacy input behavior stays exact except
> separately reviewed D41/D43 deltas.

and §6 (`:99-101`) is the rule that decides **how** this package may obtain the two day
predicates it needs:

> No copied second progression algorithm, fallback implementation, new clock or private seed
> import.

### 1.2 `rebuild/m4/spec/NATIVE-CARRIERS-THEME.md:100-101` and `:186-189` (the accepted delta contract)

> Native rows require the `nativeTrendContext` resolver for rushed/debt — a missing or
> mismatched context is an explicit `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` refusal,
> never a defaulted flag.

> **Trend context** — `nativeTrendContext` is a declared **test assumption**
> (`assumed = request => ({...request, hard:false, rushed:false, debt:false})`). No
> qualified product provider exists; the refusal, not a default, is the product behaviour
> that is proven.

(`NATIVE-CARRIERS-THEME.md` at `12cfdb9`, sha256
`9de320a80acf5bb11da59f552bd885b2e162b7c0a842bdc6c569198caef39173`.)

### 1.3 The APM's own open item, quoted, because it bounds what B-NTC may claim

`rebuild/m4/REPORT-OWNER-WORKOUT-BRIEF-ASTRA.md:17`:

> APM searched actual canonical decisions/§3b/approved additions/DAILY-PLAN-CONTRACT and
> found **no accepted native hard/rushed/debt mapping** or full daily/bodycomp domain
> closure. … **old `cleanAtDate` returns true on no nights** and **native event intervals are
> not legacy dated-event/halo semantics**.

B-NTC does not invent that mapping. It qualifies exactly the case the APM's own sentence
already settles (no nights, no events) and **refuses every other case by name**.

### 1.4 Therefore: QUALIFIED = two obligations, both discharged by proof or by refusal

| obligation | what discharges it | what happens when it cannot be discharged |
|---|---|---|
| **(1) Correspondence** — the answer is about the Start the engine asked about, at the revision the engine is reading | the provider is bound, **by object identity**, to the `workoutFacts` the host's producer is about to hand the engine; it re-checks `source_revision`, Start uniqueness and the whole `effective` tuple | `throw` → `performed.cjs:199` catches → `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`, before any recommendation and before any write |
| **(2) Flag provenance** — each of `hard` / `rushed` / `debt` comes from a fact the athlete recorded, read under the ENGINE's own accepted predicate | see §4 | same — `throw`, never a default |

There is no third outcome. "The coach that never guesses" is enforced structurally: every
path out of `resolve()` is either an echoed binding with three proven booleans, or a throw.

---

## 2. The seam — exactly where `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` is raised

**`rebuild/engine/performed.cjs`, sha256 `2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a`
at `12cfdb9` — the byte-for-byte accepted M2-NATIVE-CARRIERS file (`DECISIONS:93`,
"new performed.cjs 2372e66b…"). It is NOT edited by this package.**

The dependency argument, `performed.cjs:4`:

```js
module.exports=function createPerformed(E,{nativeTrendContext}={}){
```

The seam itself, `performed.cjs:188-206` (the line `DECISIONS:102` names is **193**):

```js
188  function trendUnavailable(code,reason,start){
189   const error=new Error(code);error.code=code;error.reason=reason;error.start_op_id=start;throw error;
190  }
191  function performedTrendContext(s,row){
192   const unavailable=reason=>trendUnavailable('PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED',reason,row.start_op_id);
193   const session=s.workoutFacts.sessions.find(x=>x.start_op_id===row.start_op_id);
194   const revision=s.workoutFacts.source_revision;
195   if(!session||!Number.isSafeInteger(revision)||revision<1)unavailable('source_binding_missing');
196   const request={start_op_id:row.start_op_id,source_revision:revision,effective:structuredClone(session.effective)};
197   if(typeof nativeTrendContext!=='function')unavailable('resolver_missing');
198   let answer;try{answer=structuredClone(nativeTrendContext(structuredClone(request)));}catch(_){unavailable('resolver_failed');}
199   const effective=answer?.effective,expected=request.effective;
200   if(answer?.start_op_id!==request.start_op_id||answer?.source_revision!==revision||
201     !effective||Object.keys(effective).length!==Object.keys(expected).length||
202     !Object.keys(expected).every(k=>Object.hasOwn(effective,k)&&effective[k]===expected[k])||
203     !['hard','rushed','debt'].every(k=>typeof answer[k]==='boolean'))unavailable('context_binding_or_flags_invalid');
204   return {hard:answer.hard,rushed:answer.rushed,debt:answer.debt};
205  }
```

(Line numbers as `git grep -n` reports them on `12cfdb9`: the literal string
`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` stands at `performed.cjs:193`; `resolver_missing`
at `:198`; the resolver call at `:199`; `context_binding_or_flags_invalid` at `:204`.
The listing above is the same function with its own 1-based numbering offset by five for
the preceding `trendUnavailable`; the four quoted literals are byte-exact.)

**Who calls it.** `rebuild/engine/progression.cjs`, three accepted call sites:

* `:88` `function _rowRushed(s, row) { return row.native ? E.performedTrendContext(s, row).rushed : paceRushed(row.rec); }`
* `:701` inside `liftTrend`: `if(native){({hard,rushed,debt}=observation);}` where
  `observation = E.performedTrendObservation(s,row,en)` (`performed.cjs:206-215`) ends
  `return {sc,k,...performedTrendContext(s,row)};`
* `progressionTrend`'s `setAsideWorkouts` loop:
  `for(const row of rows)if(row.source==='performed'&&E.performedTrendContext(s,row).hard)`

**Where the host installs the resolver.** `rebuild/m4/workout/engine-runtime.cjs:24-32`
(accepted, pinned `9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23`,
**not edited**):

```js
24  function createEngineRuntime({clock,ids,drafts,nativeTrendContext}={}){
26   if(nativeTrendContext!==undefined&&typeof nativeTrendContext!=='function')throw new TypeError('nativeTrendContext must be a synchronous function when supplied');
32    const created=MODULES[i]==='performed'?create(E,{nativeTrendContext}):create(E,deps);
```

**What is installed there today.** `rebuild/m3/w6/host/workout-host.mjs:56-63`:

```js
export function createUnavailableNativeTrendContext({ reason = 'no qualified native trend snapshot is composed in this host' } = {}) {
  return function nativeTrendContext() {
    const error = new Error('NATIVE_TREND_CONTEXT_UNAVAILABLE');
    error.code = 'NATIVE_TREND_CONTEXT_UNAVAILABLE';
    error.reason = reason;
    throw error;
  };
}
```

carried by `rebuild/m3/w7-preview/today/gym-host.mjs:260` and
`rebuild/m3/w6/host/test/journey.test.mjs:84`. That throw is what `performed.cjs:199`
catches and reports as `resolver_failed` — the exact string A2 asserts at
`rebuild/m3/w7-preview/today/test/gym.test.mjs:626`.

---

## 3. The provider's inputs — every one cited

`rebuild/m4/workout/native-trend-context.cjs` reads exactly three things, all injected, none
constructed:

| input | where it comes from | citation |
|---|---|---|
| the bound `workoutFacts` — `{profile:'earned/workout-facts/v1', source_revision, sessions[]}` | the host producer's `context.workoutFacts`, passed **by identity** to `binding.bind()` | produced by `rebuild/m4/workout/engine-history.cjs:119-122`; consumed by the engine at `performed.cjs:144-158` and `:193-194` |
| `session.effective` — `{local_date, local_time, utc_offset}` | the stored `session-start` operation's own `effective` | `performed.cjs:145` `const d=session?.effective?.local_date;` … `:157` `rows.push({d,rec:session.record,source:'performed',start_op_id:session.start_op_id})` — **the engine itself already uses `effective.local_date` as the native row's date key** |
| the athlete engine state's `events` and `sleep.nights` | the SAME `engineState` the host composes with (`composeWorkoutHost({engineState})`, `workout-host.mjs:78`) | the two engine predicates below |

**It reads nothing else.** No clock of its own, no repository, no generation, no network, no
seed, no import of any file under `rebuild/engine`.

### 3.1 The two day predicates, and why the date key needs no new mapping

`hard` and `debt` are day-scoped readings of the athlete's state, not properties of a
session record. The legacy branch of `liftTrend` computes them at the row's date
(`progression.cjs:702,704`):

```js
702    try { hard = !!dayWeather(s, d).hardSession; } catch (e) { hard = false; }   /* R17 — the SESSION question, not the food one */
704    try { debt = !cleanAtDate(s, d); } catch (e) { debt = false; }
```

* `dayWeather` — `rebuild/engine/sleep.cjs:1871-1890`. Its `hardSession` is
  `flags.some((f) => f.k === "event" && !f.pre)` (`:1889`), and the **only** producer of a
  `k:"event"` flag is `:1877`:
  `(s.events || []).forEach((e) => { const gap = (mk(iso) - mk(e.d)) / DAY; if (gap >= -1 && gap <= 2) flags.push({ k: "event", why: e.t || "event window", pre: gap < 0 }); });`
* `cleanAtDate` — `rebuild/engine/sleep.cjs:1017-1029`. Its first two lines are
  `const nights = nightsBefore(s, iso);` / `if (!nights.length) return true;`, and
  `nightsBefore` (`:1011-1012`) filters `(((s || {}).sleep || {}).nights || [])`.

Both are pure functions of `(s, iso)`. For a native row, `iso` is `effective.local_date` —
**the key the engine already assigned that row at `performed.cjs:145-157`**. There is no
"native mapping" to invent for the date; the open item the APM named is about the *flags*,
not the key, and §4 refuses exactly there.

---

## 4. The provider's outputs, and the qualification rules

Module: **`rebuild/m4/workout/native-trend-context.cjs`** (new, 12 375 bytes, sha256
`cf8b50955ad0dca5ff91e528ae0abc48611cebeadc586e2759ec0ec587c22356`).
It sits beside `athlete-state.cjs`, `workout-basis.cjs` and `resume-policy.cjs` — the three
A0 product providers — and follows their house rule: **inject every collaborator, invent
nothing, refuse rather than guess** (`workout-basis.cjs:7-9`, "The client stores whatever
this resolver claims, so a resolver that cannot prove its claim must refuse rather than
guess").

Two exports plus the refusal code:

```js
module.exports = { createNativeTrendContextBinding, createEmptyHistoryDayFacts, REFUSAL };
// REFUSAL === 'NATIVE_TREND_CONTEXT_UNQUALIFIED'
```

### 4.1 `createNativeTrendContextBinding({ dayFacts })` → `{ resolve, bind, unbind, bound, REFUSAL }`

`resolve` is the function handed to `createEngineRuntime({nativeTrendContext})`.
`dayFacts(iso) -> {hard:boolean, debt:boolean}` is **REQUIRED and has no default** — a
missing or non-function reader is a construction-time `TypeError`, so a host can never
compose a provider that answers out of thin air.

**A context is QUALIFIED only when all seven hold.** Each failure throws
`NATIVE_TREND_CONTEXT_UNQUALIFIED` with a named `reason`, which `performed.cjs:199` catches
and reports as `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`:

| # | rule | `reason` when it fails |
|---|---|---|
| 1 | a preparation has bound a facts object (and has not yet unbound it) | `no_bound_source_facts` |
| 2 | the request is a non-array object with a non-blank string `start_op_id` | `request_malformed` / `request_start_invalid` |
| 3 | `request.source_revision === bound.source_revision` (strict, so `'7'` fails) | `source_revision_mismatch` |
| 4 | **exactly one** bound session carries that `start_op_id` | `start_not_in_bound_facts` / `start_not_unique_in_bound_facts` |
| 5 | the bound session's `effective` equals the request's, key-count and value-for-value — the engine's own comparison at `performed.cjs:200-202`, run in the other direction and **earlier** | `effective_tuple_mismatch` |
| 6 | that session's `effective.local_date` is a well-formed ISO date | `session_local_date_invalid` |
| 7 | `dayFacts(local_date)` returns two real booleans, and `rushed` resolves (§4.3) | `day_facts_not_boolean` / whatever `dayFacts` threw / `session_pace_unrecognised` |

**The answer**, when all seven hold, is the echo the contract demands plus the three proven
flags — and `effective` is a **copy**, so a consumer cannot reach back into the bound facts:

```js
return { start_op_id: start, source_revision: revision, effective: { ...effective },
  hard: facts.hard, rushed, debt: facts.debt };
```

**`bind` / `unbind` are the correspondence proof.** `bind(workoutFacts)` refuses anything
that is not `earned/workout-facts/v1` with a safe-integer `source_revision >= 1` and an array
`sessions`; the host calls it with the very object the producer is about to give the engine,
and calls `unbind()` in a `finally`, so a request arriving outside one preparation is
refused rather than answered from the last one.

### 4.2 `createEmptyHistoryDayFacts({ state })` — the one day reader this package can prove

`hard` and `debt` need `dayWeather` / `cleanAtDate`. **This package may not obtain them, and
says so rather than working around it:**

* `rebuild/m4/workout/engine-runtime.cjs:11` exposes exactly
  `const EXPOSED=Object.freeze(['genSession','rirPlan']);` and that surface is **pinned by
  the accepted parent artifact**: `rebuild/m4/spec/native-carriers-witnesses.cjs:16` asserts
  `assert.deepEqual(COMPOSITION.exposed.slice().sort(),['genSession','rirPlan'],'Exposed reader surface');`
  Adding two names to `EXPOSED` turns `native-carriers --ci` RED. **Refused.**
* Composing a second engine to reach them is forbidden (`DECISIONS:102`, A2: "no second
  engine, no second capture path").
* Copying the two bodies here is the "copied second implementation"
  `PERFORMED-ENGINE-v1` §6 forbids (`:101`). **Refused.**

So the reader is injected, and B-NTC ships the only one it can discharge honestly:

```js
function createEmptyHistoryDayFacts({ state }) { … return function dayFacts(iso) { … } }
```

* **`state.events` empty (or absent)** ⇒ `hard === false` **for every date**, read off
  `dayWeather`'s own only event producer (`sleep.cjs:1877`, a `forEach` over `(s.events||[])`).
  Non-empty or malformed ⇒ **refuse** `recorded_events_unmapped`.
* **`state.sleep.nights` empty (or absent)** ⇒ `debt === false` **for every date**, read off
  `cleanAtDate`'s own first two lines (`sleep.cjs:1017-1019`, `if (!nights.length) return true;`
  — the APM's own sentence, §1.3). Non-empty or malformed ⇒ **refuse**
  `recorded_sleep_unmapped`.
* The state is re-read **on every call**, never captured at construction, so a host that
  composes once and trains for weeks starts refusing the day the athlete records his first
  night or event, instead of answering from a stale proof. (Journey step 17(e) proves this
  end to end through `prepareWorkout`.)

That is a **proof over an empty input**, not a default: for an empty list both predicates
are constant and the constant is read from the predicate's own source, not recomputed. And
an empty `events` / `sleep.nights` is exactly the fresh athlete `DECISIONS:100` puts on
Earned at S2.

### 4.3 `rushed` — why `false` here is a fact about the record, not a guess

`paceRushed` (`progression.cjs:544`) is `return !!sl && sl.pace === PACE.rushed;` — a test
for an athlete's **affirmative declaration**. `writers.cjs:401` writes it as
`pace: extras.pace === "rushed" || extras.pace === "normal" ? extras.pace : null` and
`writers.cjs:402` announces it as `"RUSHED SESSION — LOGGED AS SUCH"`. The glossary
(`writers.cjs:2443`) is explicit that "the app records it as context, not as a verdict on
the session".

**The native capture records no such declaration.** `rebuild/m4/workout/schema.cjs:112`:

```js
if (op.kind === 'session-close') valid = keys(op.payload, ['completion_kind']) && ['normal', 'early'].includes(op.payload.completion_kind);
```

A `session-close` payload is closed to exactly `completion_kind ∈ {normal, early}`. There is
no `pace` member on a native session, so **"this session was not logged as rushed" is a
statement about the record**, which is what `paceRushed` tests — not a claim about the
athlete's rest intervals, which nobody measured and this module never infers. Deriving
`rushed` from set-op `local_time` gaps was considered and **rejected**: `effective.local_time`
is minute-granular, the frozen glossary's threshold is "about a minute", and inventing a
derivation is precisely the "new scientific policy" `PERFORMED-ENGINE-v1` forbids.

**And it is guarded forward.** `rushedOf(session)` looks for an own `pace` member on the
session or its record; `'rushed'` → `true`, `'normal'`/`null` → `false`, **anything else →
refuse `session_pace_unrecognised`**. The day A-lane adds a pace control, an old provider
cannot silently ignore it.

**Disclosed honestly for the PM:** `rushed:true` is the *protective* reading (it keeps a
session out of stall counting and marks the point `soft`). Reading an unrecorded native
session as not-rushed is therefore the *less* protective direction, and it is the same
reading the engine has always given every legacy session Joe did not tap "rushed" on. If the
PM judges that a native session must instead carry an explicit declaration before its trend
counts, that is **PM question Q3** and the fix is a `pace` lane in the gym card (A-lane) plus
one line here — not a change to this module's shape.

---

## 5. Is the legacy order-mapping provider the SAME seam? **No. B-LOM is a separate package.**

The PM's ruling makes this a decision with evidence, so here is the evidence, on four
independent axes. Every citation is `rebuild/engine/performed.cjs` at `12cfdb9`.

**Where `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` is raised** — `performed.cjs:176-183`,
inside `performedHistory(s, chronology)`, not inside `performedTrendContext`:

```js
176   if(!baseline||baseline.profile!=='earned/imported-engine-history/v1'||baseline.session_log!==s.sessionLog||
177     !text(baseline.source_generation_id)||!text(baseline.activation_op_id))
180    unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
181   if(chronology&&(!anchor||!text(anchor.source_generation_id)||!text(anchor.activation_op_id)||
182     baseline.source_generation_id!==anchor.source_generation_id||baseline.activation_op_id!==anchor.activation_op_id))
183    unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
```

with `const baseline=s.workoutFacts.legacy_baseline, anchor=order.import_anchor;` and the
guard `if(legacy.length){ … }` — it only fires when the state carries a **ported
`sessionLog`**.

| axis | B-NTC (`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`) | B-LOM (`PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`) |
|---|---|---|
| **injection point** | a **function** on the factory's dependency argument — `createPerformed(E,{nativeTrendContext})`, `performed.cjs:4`, surfaced by `createEngineRuntime({nativeTrendContext})` | **no resolver at all.** It is satisfied by **data** that must already be present on the state: `s.workoutFacts.legacy_baseline` (profile `earned/imported-engine-history/v1`, `session_log` identity-equal to `s.sessionLog`, `source_generation_id`, `activation_op_id`) and `order.import_anchor` agreeing with it |
| **producer** | the host, per preparation | the **authenticated import controller** — `performed.cjs:171-175` says so in the source: *"The internal producer calls engine-order on the same authenticated source. … Old imports need their mapping."* and *"The authenticated import controller owns the generation/activation binding; this is not a caller"*. That is `rebuild/m4/spec/IMPORT-CONTROLLER-v1.md` + `rebuild/m4/workout/engine-history.cjs`, not this seam |
| **when it fires** | only for a **native** row, and only once the trend readers reach one | for **every** read of `performedHistory` on a state with any legacy row — before any trend question exists (`DECISIONS:102`: "on **every** later scheduled day, including ones with untouched lifts") |
| **who it blocks** | the FRESH athlete at S2 (`DECISIONS:100`) | the LEGACY athlete — Joe **after the C2 port**, i.e. S3 |

**Decision: NOT the same seam.** B-NTC therefore does not include it, and **B-LOM follows as
a separate package**, exactly as `DECISIONS:103` provides for ("*includes the legacy
order-mapping provider only if it is the same seam, otherwise B-LOM follows*"). B-LOM's real
work is an import-controller/history-projector obligation — producing a proven
`legacy_baseline` + `import_anchor` — and it is properly sequenced **after** lane C's C2/C2b
port lands (`DECISIONS:106`), not before S2.

---

## 6. The exact hunks — before / after

Four files. **Two are new**, two are additive edits. Nothing under `rebuild/engine`,
`rebuild/conform`, `rebuild/m4/spec`, `.github`, `src` or `ledger` is touched.

### H1 — NEW `rebuild/m4/workout/native-trend-context.cjs`

New file, 12 375 bytes, sha256 `cf8b50955ad0dca5ff91e528ae0abc48611cebeadc586e2759ec0ec587c22356`.
Full behaviour in §4. No pre-image.

### H2 — NEW `rebuild/m4/workout/test/native-trend-context.test.cjs`

New file, 13 164 bytes, sha256 `f0879ca2b6d2fd65cb125d2d013e64efd89f236a4893dcec7245bf460dc52559`.
22 cells (§7.2). No pre-image.

### H3 — `rebuild/m3/w6/host/workout-host.mjs` — **three additive hunks**

pre `4029a5404cd34aac56da0af89c4ae6e0e2868353ab758d0f778c9d9f29190a8b` (12 000 B) →
post `2d160c1c79fd7957febe964db523bc53dbb9a32fa571895f30e1a279a77fc480` (13 409 B).

**H3a — one new OPTIONAL provider in the destructure** (after `resumeReason,`):

```js
// before
  resolveWorkoutBasis,
  resumeReason,
  stringSelectionRegistrar,     // optional: reading-replay's own projectLineage registrar

// after
  resolveWorkoutBasis,
  resumeReason,
  // B-NTC, optional. The qualified nativeTrendContext binding
  // (rebuild/m4/workout/native-trend-context.cjs). Its `resolve` is what the
  // caller handed createEngineRuntime; this host's only job is to tell it
  // WHICH facts object the engine is about to read, and to take that binding
  // away again the moment the preparation ends. Absent, nothing changes: the
  // host keeps whatever resolver the caller composed, including A0's honest
  // refusal createUnavailableNativeTrendContext.
  nativeTrendBinding,
  stringSelectionRegistrar,     // optional: reading-replay's own projectLineage registrar
```

**H3b — its guard**, in the same style as the existing optional `stringSelectionRegistrar`:

```js
// before
  if (typeof plannedSplitSlotId !== 'string' || !plannedSplitSlotId.trim()) need('plannedSplitSlotId');
  if (stringSelectionRegistrar !== undefined && typeof stringSelectionRegistrar?.workoutInput !== 'function')

// after
  if (typeof plannedSplitSlotId !== 'string' || !plannedSplitSlotId.trim()) need('plannedSplitSlotId');
  if (nativeTrendBinding !== undefined &&
      (typeof nativeTrendBinding?.bind !== 'function' || typeof nativeTrendBinding?.unbind !== 'function'))
    throw new TypeError('composeWorkoutHost requires a {bind, unbind} native trend binding when one is supplied');
  if (stringSelectionRegistrar !== undefined && typeof stringSelectionRegistrar?.workoutInput !== 'function')
```

**H3c — bind for the duration of the preparation, and only that** (`workoutProducer`):

```js
// before
      lastProjection = registrar.register({ generation, state: engineState, workoutFacts: context.workoutFacts });
      return adapter.prepare({ day, basis: context.basis,
        sourceProjection: lastProjection, source_basis: context.source_basis }).capture;
    } catch (error) {
      lastRefusal = Object.freeze({ code: error?.code || null, reason: error?.reason || null,
        message: typeof error?.message === 'string' ? error.message : null });
      throw error;
    }
  }

// after
      lastProjection = registrar.register({ generation, state: engineState, workoutFacts: context.workoutFacts });
      // B-NTC. Bind the qualified native trend resolver to the VERY facts
      // object this preparation is about to give the engine — by identity, not
      // by copy — so the resolver can prove that what it answers about is what
      // the engine is reading. The binding lasts exactly this preparation.
      if (nativeTrendBinding) nativeTrendBinding.bind(context.workoutFacts);
      return adapter.prepare({ day, basis: context.basis,
        sourceProjection: lastProjection, source_basis: context.source_basis }).capture;
    } catch (error) {
      lastRefusal = Object.freeze({ code: error?.code || null, reason: error?.reason || null,
        message: typeof error?.message === 'string' ? error.message : null });
      throw error;
    } finally {
      // Outside a preparation the resolver has no bound facts and refuses;
      // a later request can never be answered from this preparation's binding.
      if (nativeTrendBinding) nativeTrendBinding.unbind();
    }
  }
```

**Custody note.** `workout-host.mjs` is A0's file; A2 already added 9 additive lines to it
under the same reasoning (`DECISIONS:102`, "+9 additive lines (records the producer's
refusal, rethrows unchanged; A0 22/22)"). These three hunks are additive in the same sense:
with `nativeTrendBinding` absent the file behaves byte-for-byte as before, which the
unchanged A0 journey steps 1–16 prove (22/22, §7.1).

### H4 — `rebuild/m3/w6/host/test/journey.test.mjs` — **one new step 17 + one import**

pre `57566afd36ea913da4b9eaeed8f7a358479381606a9b6f92fc5e562d85d58cda` (27 838 B — the sha
`DECISIONS:98` pins) → post `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96`
(37 419 B). Steps 1–16 are **unmodified**; step 17 is appended. Contents in §7.1.

### H5 — NEW `rebuild/lanes/b/tooling/packages/B-NTC.json`

Allowed by `DECISIONS:103` (4). Its own sha256 is recorded in
`rebuild/lanes/b/BUILD-REPORT-B-NTC.md` §2, not here: the spec pins **this brief's** sha256
in `brief.sha256`, so stating the spec's hash inside the brief would be circular. See §10.2
for the honest `--ci` result.

### H6 — NOT MADE, deliberately: the gym-card wiring

The one-line change that turns the wall off for the product is **left for the PM / A-lane**,
because `DECISIONS:106` (b) grants **lane C** an explicit licence to edit
`rebuild/m3/w7-preview/today/{reading-host,gym-host}.mjs` for the local-era move, and lane B
must not collide with it. Here it is, exactly, so it is one line to land:

```js
// rebuild/m3/w7-preview/today/gym-host.mjs:28 — before
import { composeWorkoutHost, createUnavailableNativeTrendContext } from '../../w6/host/workout-host.mjs';
// after
import { composeWorkoutHost } from '../../w6/host/workout-host.mjs';
import { createNativeTrendContextBinding, createEmptyHistoryDayFacts } from '../../../m4/workout/native-trend-context.cjs';

// gym-host.mjs:260 — before
    nativeTrendContext: createUnavailableNativeTrendContext() });
// after
    nativeTrendContext: trendBinding.resolve });
// …where, just above the createEngineRuntime call:
  const trendBinding = createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state: engineState }) });
// …and composeWorkoutHost gains one property:  nativeTrendBinding: trendBinding,
```

Its three delta cells are enumerated in §9.1.

---

## 7. The laws and tests that bind this package

### 7.1 v4 register laws touched: **NONE — expected none, and measured none**

B-NTC edits no file under `rebuild/engine` and no file under `rebuild/conform`, so no law
can move. **Measured, not asserted** (`node rebuild/conform/v4/run-defect-laws.cjs`, owner's
PC, frozen bundles built from `fe516c1` / `a0009c3`):

```
TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

45 RED-frozen / 39 RED-candidate — the expected totals, **unchanged**, 0 HARNESS_ERROR. No
row moves. (`AUDIT RED-FIRST FAIL` is the pristine terminal on this tree, as BRIEF-B1 v1.2
§0.0 A1 also records; it is not a B-NTC regression.)

### 7.2 The provider's own cells — `rebuild/m4/workout/test/native-trend-context.test.cjs`, **22/22 PASS**

| group | cells |
|---|---|
| **A. qualified** | the answer echoes the binding and carries three real booleans · the echo is a copy: mutating the answer cannot reach the bound facts · a session logged rushed answers `rushed:true`, from the record and not a default |
| **B. fails closed: bind** | the resolver refuses when no preparation has bound any facts · unbind really unbinds · bind refuses anything that is not `earned/workout-facts/v1` read at a revision · a `dayFacts` reader is required — there is no default day reader |
| **C. fails closed: correspondence** | a stale source revision is refused, never answered from the bound one · a Start the bound facts do not carry is refused · a Start the bound facts carry **twice** is refused, never resolved to the first · an effective tuple that differs in any way is refused (5 variants) · a malformed request is refused before anything is read · a bound session whose own `local_date` is malformed is refused |
| **D. fails closed: provenance** | a recorded event refuses rather than being mapped onto a native session · a recorded sleep night refuses rather than being read as clean · the empty proof is re-read every call, never captured at construction · an absent `events`/`sleep` member is the empty proof; a malformed one refuses · an unrecognised pace label refuses — it is never read as "not rushed" (5 variants) · a `dayFacts` reader that answers with anything but two booleans is refused (4 variants) |
| **E. the ENGINE itself accepts it** | the engine accepts the qualified answer where it refused the absent resolver (with **two controls**: no resolver → `resolver_missing`; A0's refusal → `resolver_failed`) · the engine still refuses when this provider refuses — the refusal is contained, not converted · the engine **rejects** an answer that does not echo the binding (4 tampers → `context_binding_or_flags_invalid`) |

Group E composes the **real** twelve engine modules in the same list and order
`engine-runtime.cjs:9` uses and calls `E.performedTrendContext` directly, so the acceptance
is the engine's own, not a mock's.

### 7.3 The A0 host journey — **22/22 PASS**, including new step 17

`node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs`
→ **22 pass / 0 fail** (17 journey steps + 5 equivalence).

**Step 17 — "the second day on the same lift: refused without a trend context, prepared with
one"** conducts the S2 path on its own clean encrypted store, through the product entry
point, and asserts both halves:

* two real training days conducted (Friday U = `db-bench` + `lat-pulldown`; Saturday L =
  `leg-press`), every prescribed slot recorded, both closed `normal`;
* **(a)** day `2026-09-11` with A0's `createUnavailableNativeTrendContext`: the resolver is
  asked exactly **once**, the producer refuses `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` /
  `resolver_failed`, the client surfaces `WORKOUT_PREPARATION_INVALID`, **ops unchanged**.
  This is `DECISIONS:102`'s wall, reproduced in A0's own journey for the first time;
* **(b)** the same day, same store, same history, with the B-NTC binding: **prepared**,
  profile `earned/workout-prescription/v2`, `db-bench` present, no producer refusal,
  **still nothing written until Start**;
* **(c)** after the preparation returns, `binding.bound() === null` and a further
  `resolve()` throws `NATIVE_TREND_CONTEXT_UNQUALIFIED` / `no_bound_source_facts`;
* **(d)** a context bound to the **wrong revision** does not prepare — the engine's own
  `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` comes back and nothing is written;
* **(e)** an athlete who has **recorded a sleep night** does not prepare either: the day
  reader refuses `recorded_sleep_unmapped` rather than reading him as clean, and the whole
  preparation fails closed with nothing written. This is PM question **Q1** made executable.

**Honest finding this step forced out, recorded because it changes what A0 proved.** A0's
clean-init athlete carries `w: null` on every lift, which `rebuild/engine/today.cjs`
`genSession` reads as a permanent DEBUT — and a DEBUT never reaches `liftTrend`. Measured:
with every lift at `w: null`, the resolver is asked **0 times** on the second same-lift day,
and the day prepares. That is why A0-REPORT §"not qualified" 5 could only say *"the
containment path was **not** exercised end to end"*. Step 17 therefore states one fact
explicitly, in the test and in a comment: **one lift carries a working load taken from its
own declared `steps`** (`db-bench.w = 35`), which is the athlete `DECISIONS:102` describes.
The host never writes `w` back to the state — the frozen engine's `writers.completeSession`
is what sets it in the real app, and A2's `today.stateFromOps()` athlete has it. **Open item
O1** below.

### 7.4 The accepted `native-next-targets` tests — **BLOCKED, environmental, pre-existing**

`node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` →

```
Error: Cannot find module '../../../../test-support/import-engine/rebuild/m3/w7-preview/fixtures.cjs'
```

They require `EARNED_NATIVE_PACKET_ROOT` and a `test-support/import-engine/` tree that does
not exist in this repository — **exactly** what A0-REPORT §"not qualified" 2 already records:
*"The three `native-next-targets*` tests do not pass in this worktree. They are byte-identical
to the tip and need `EARNED_NATIVE_PACKET_ROOT` and a `test-support/import-engine/` tree that
does not exist here."* They are byte-identical to the tip here too, and B-NTC changes nothing
they read. **They could not be run, and this brief does not claim they passed.** Their
`assumed` resolver is unaffected by this package: B-NTC adds a provider, it does not remove
or alter the declared test assumption. **Open item O2** — the PM or the reviewer with the
retained packet should re-run them at the package head.

### 7.5 Everything else that was run green

| suite | command | result |
|---|---|---|
| the parent package gate | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, exit 0**, artifact `295762f0…` AUTHORIZED, all 13 children OBSERVED incl. `second-gate` |
| public conformance census | `node rebuild/conform/run.cjs` | `99 reference GREEN · 99 STRONG · 29 RED-first · 70 GREEN` — **byte-identical to base**, §9.2 |
| A1 + A2 screens | `node --test rebuild/m3/w7-preview/today/test/*` | **123 / 123 pass** (unchanged — B-NTC does not wire the gym card, §6 H6) |
| `rebuild/m4/workout` unit tests | 9 files incl. the new one | 62 tests, 56 pass, **6 fail** — all six in the three files that `throw Error('Explicit retained PERFORMED_W6_DIR required')` at require time (`engine-history`, `history-panel`, `source-control`). Environmental and pre-existing; B-NTC touches nothing they read |

---

## 8. Named source mutants, and the cell that kills each

Eight mutants of `rebuild/m4/workout/native-trend-context.cjs`. Each is a single-hunk
reversion or weakening; each named cell **fails** on it.

| # | mutant | killed by |
|---|---|---|
| **M1** | `resolve`: drop the `revision !== bound.source_revision` check | `a stale source revision is refused, never answered from the bound one`; also journey step 17(d) |
| **M2** | `sameEffective`: compare own-key **count** only, drop the value equality | `an effective tuple that differs in any way is refused` (the `local_time '10:01'` and `local_date` variants) |
| **M3** | `createEmptyHistoryDayFacts`: return `{hard:false,debt:false}` without inspecting `state.events` / `state.sleep.nights` | `a recorded event refuses rather than being mapped onto a native session` **and** `a recorded sleep night refuses rather than being read as clean`; also journey step 17(e) |
| **M4** | `rushedOf`: return `false` for an unrecognised pace instead of refusing | `an unrecognised pace label refuses — it is never read as "not rushed"` |
| **M5** | `unbind()` becomes a no-op | `unbind really unbinds — a later request is never answered from the last preparation`; also journey step 17(c) |
| **M6** | `matches.length !== 1` → `matches.length < 1` (a duplicated Start resolves to the first) | `a Start the bound facts carry twice is refused, never resolved to the first` |
| **M7** | `bind()` accepts any object (drop the profile / revision / sessions validation) | `bind refuses anything that is not earned/workout-facts/v1 read at a revision` |
| **M8** | `createEmptyHistoryDayFacts` captures `state.events` / `state.sleep.nights` at construction instead of re-reading per call | `the empty proof is re-read every call, never captured at construction` |

Two further mutants of the **host** hunk H3c:

| # | mutant | killed by |
|---|---|---|
| **M9** | drop the `finally { nativeTrendBinding.unbind(); }` | journey step 17(c) (`binding.bound() === null` after the preparation) |
| **M10** | `bind(structuredClone(context.workoutFacts))` instead of binding by identity | not killed by a committed cell today — the value-equality checks still pass on a clone. **Disclosed weakness**, recorded as open item **O3**: identity is the stronger claim the module's comment makes, and only value equality is currently enforced by a test. A reviewer should either add the identity cell or the brief should stop claiming identity.

**A negative control on the whole package**, already committed: group E's *"the engine
rejects an answer that does not echo the binding"* mutates the provider's **output** four
ways and proves the engine — not this module — refuses each one
(`context_binding_or_flags_invalid`). So the package cannot pass by weakening the engine's
own check, because it never touches it.

---

## 9. Expected delta cells — what changes, and what must NOT

### 9.1 What changes for the gym card (when H6 lands)

B-NTC as committed changes **nothing** on the gym card, because H6 is deliberately not made
(§6). These are the cells the PM / A-lane will see the moment that one line lands, stated in
advance so the change is not a surprise:

| # | cell | before (today, `DECISIONS:102`) | after (with a qualified provider) |
|---|---|---|---|
| **G1** | `gym.test.mjs:621` *"day 4 — the first wall: PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED, and nothing is written"* | `view.phase === 'blocked'`, `view.code === 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'`, `view.copy === 'resolver_failed'`, `model.start()` refused, 12 ops | day 4 **prepares**; the assertions must be rewritten to the new truth. This is A2 custody — **the A-lane builder owns this edit, not lane B** |
| **G2** | `gym.test.mjs:639` *"every day after the wall stays readable"* (days +4,+5,+6,+7,+10,+14) | each is `blocked` with `ENGINE_CAPTURE_NO_WORKOUT` or `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` | training days now prepare; only true REST days stay `ENGINE_CAPTURE_NO_WORKOUT`. Same custody |
| **G3** | `gym.test.mjs:657` `lastProducerRefusal().code === 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'` | set | `null` on a prepared day. Same custody |
| **G4** | `view.test.mjs:328-337` (a refused preparation prints the layer's code exactly once) | asserted over a hand-built `summary()` stub, **not** over the gym host | **unchanged** — it is a view-layer cell over a stub and does not depend on the provider |
| **G5** | the product itself | a fresh Joe gets **two training days**, then every later day with a trained lift is blocked | a fresh Joe trains **day after day** — the S2 milestone (`DECISIONS:103` (6)) |

`gym-check.mjs:304` (`shippedDayTwo.summary.code === "PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED"`)
is **unaffected**: that is the legacy athlete's wall, B-LOM's, not this seam's (§5).

### 9.2 What must NOT change — and the measurement

**The public census must be byte-identical.** Verified the only way that means anything:
`node rebuild/conform/run.cjs` was run on the candidate, the one tracked pre-existing file
was stashed to restore the base tree, it was run again, and the two logs were compared.

```
candidate  .tmp-ntc/census-candidate.txt   sha256 CAAB2293006821770F0F6E27909A16D474066CCEB0FEF2C022478F0817C5604E
base       .tmp-ntc/census-base.txt        sha256 CAAB2293006821770F0F6E27909A16D474066CCEB0FEF2C022478F0817C5604E
Compare-Object base candidate              -> IDENTICAL
```

Terminal line on both: `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first
against absent families · 70 GREEN against present families` — the 99/141/70 figures
`DECISIONS:93` records, and the `BAD 7/8` lines are the known private-fixture and
gate-artifact rows, identical on both trees.

**The second gate is identical**: it runs as the `second-gate` child of
`native-carriers-package.cjs --ci`, which is `OBSERVED; exit 0 and exact declared verdict`
on this branch, with the artifact resolving AUTHORIZED at `295762f0…`.

**Also unchanged, measured:** all 20 files the parent artifact pins in its `product` map are
byte-identical on disk (**20/20**, verified by the spec generator that wrote
`packages/B-NTC.json`); `rebuild/engine/performed.cjs` is `2372e66b…`;
`rebuild/m4/workout/engine-runtime.cjs` is `9be21897…`; `rebuild/m3/w6/host/engine-runtime-host.cjs`
is `114411b1…` (journey step 14 asserts both, and it passes).

---

## 10. Parent artifact, D-ids, and the package spec

### 10.1 Parent artifact and D-ids

**Parent:** `rebuild/m4/spec/acceptance-native-carriers.json`, sha256
**`295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`**, review
`rebuild/m4/spec/review-native-carriers.json`, receipt `DECISIONS:96`. Re-verified on disk at
`12cfdb9` by `.tmp-ntc/sha.cjs`: byte-identical. (See the tip advisory at the top: at
`da63053` the same artifact is re-sealed to `e940359b…` with product/coverage/gates/
authorizations byte-identical; the spec names both.)

**D-ids covered: NONE, and that is deliberate.** B-NTC is feature work under the ratified
slice plan, not a register repair. `DECISIONS:93` states the rule for exactly this class of
work in the owner-ratification line it cites:

> This line is the owner authority the M2-NATIVE-CARRIERS profile binds for the native
> next-target carriers (**no register D-ID**; feature work under the ratified slice plan and
> the 2026-09-10 speed ruling, line 88)

B-NTC is the successor to that same open boundary (`nativeTrendContext = refusal not
provider`, listed verbatim among the "Open boundaries unchanged" in `DECISIONS:93` and again
among the "Not qualified" items in `:97` and `:98`). It repairs no register defect, moves no
law, and therefore takes no D-ID. `dIds: []` and `laws: {}` in the spec are that statement,
not an omission.

### 10.2 `packages/B-NTC.json` and the honest `--ci` result

`rebuild/lanes/b/tooling/packages/B-NTC.json` (its byte count and sha256 are in
BUILD-REPORT §2 — the spec pins this brief, so the brief does not pin the spec). Written per
the tooling README's closed key list, with `product` = all 20 parent-pinned files at role `carried`
(`pre === post`, each verified byte-identical on disk), `coverage.inherited` = the parent
artifact's own `coverage.byChild` map **copied byte-for-byte** (9 gates, 5 children),
`coverage.moves` = `{}`, `children` = `[]`, and every authorization `null`.

**The run, honestly.** The accepted runner is not on this branch (it lives on
`rebuild/lane-b-tooling` @ `572a8c2` and is still awaiting its r2 re-review, `DECISIONS:103`
(4)). It was copied into the worktree, run, and **deleted again without ever being
committed**:

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4
exit 1

$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B1        (control, same tree)
B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld
exit 1
```

**That is the correct behaviour and B-NTC does not work around it.** The runner's two-mode
usage guard closes the package list to `B1|B2|B3|B4` (README: *"Two modes, **no third**.
Anything else refuses in one line with exit 1"*). Widening it is a change to the runner,
whose bytes are pinned by each spec's `tooling.runnerSha256` and re-verified in Git — a
tooling-owner / PM change, not lane B's unilateral one. **PM question Q2.**
`--full` refuses at the same guard, before the private-fixture check, so the standing
`DECISIONS:97` line (*every builder runs `--full` without the private fixture and reports the
BLOCKED terminal*) cannot be produced for `B-NTC` at all; it **was** produced for the parent
package gate, which is the closest true statement available and is in the build report.

---

## 11. Owner questions: **ZERO**

There are none, and here is why — the test every owner question has to pass is whether the
decision is one only Joe can make.

* **No new training rule, number or threshold.** Every value this package produces is either
  read off an accepted engine predicate's own source (`cleanAtDate`'s `if (!nights.length)
  return true;`; `dayWeather`'s single `(s.events||[]).forEach`) or a refusal. Nothing is
  chosen.
* **No owner-semantics D-id.** `DECISIONS:60` is the owner's rule set per D-id; B-NTC carries
  no D-id (§10.1), so there is no owner semantics to interpret and none is interpreted.
* **No product behaviour the owner has not already ruled on.** `DECISIONS:100` ruled Joe
  starts **fresh at S2**; `DECISIONS:103` (6) re-dated S2 to the day B-NTC merges. Making the
  fresh path work day after day is executing that ruling, not asking about it.
* **Nothing that touches his data, his history, his privacy or his phone.** No schema change,
  no storage change, no network, no import, no private fixture opened.
* **The one judgement call is disclosed to the PM, not the owner** — `rushed` on an
  un-declared native session (§4.3, Q3). It is a question about whether an engine predicate's
  existing meaning carries to the native record; the PM interprets rulings (`DECISIONS:91`,
  "Fable (the PM) is the JUDGE"). If the PM decides it is an owner question, it becomes one
  with no work lost.

## 12. PM questions

**Q1 — the day reader's boundary, and when it must be closed.**
`createEmptyHistoryDayFacts` qualifies only an athlete with **no recorded event and no
recorded sleep night**. That is exactly Joe at S2, and journey step 17(e) proves the refusal
is honest and writes nothing. But **A3 ships the check-in**, and the first night Joe logs,
every training day with a trained lift goes back to `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`.
Closing it needs `dayWeather` and `cleanAtDate` at this seam, and the only ways to get them
are (a) add them to `engine-runtime.cjs`'s `EXPOSED` — which turns `native-carriers --ci` RED
at `native-carriers-witnesses.cjs:16` and so needs a re-seal of the accepted artifact; or
(b) restate them here — which `PERFORMED-ENGINE-v1` §6 forbids as a copied second
implementation. **Lane B will not choose between those unilaterally.** Recommendation: (a),
as a two-line `EXPOSED` change carried by the next re-seal (which `DECISIONS:105` says is
coming anyway for the `# pass 19` child), with `engine-runtime-host.cjs` mirrored and
`engine-equivalence.test.cjs` proving they agree. **Sequencing: before A3 ships, not after.**

**Q2 — the tooling runner's package list.** `b-package.cjs` refuses any package id but
`B1|B2|B3|B4` (§10.2). B-NTC did not exist when the runner was written. Does the PM want
(i) the list widened to include `B-NTC` when the tooling PR is re-reviewed, (ii) B-NTC
accepted on its own evidence without a closed-package artifact (it has no D-ids, no law
moves and no `rebuild/engine` bytes, so much of the machinery has nothing to bind), or
(iii) `packages/B-NTC.json` withdrawn? Lane B's recommendation is **(ii) plus (i)**: accept
B-NTC on the evidence in §7 and §9, and widen the list when the tooling lands, so B-NTC's
successor still has a chain head.

**Q3 — `rushed` on a native session.** §4.3. `false` is `paceRushed`'s literal value on a
record with no `pace` member, and the gym card has no control that could set one. Is that
acceptable until A-lane adds a pace control, or must a native session refuse until the
athlete declares? Lane B's recommendation: **acceptable, with the forward guard already
built** (an unrecognised `pace` refuses), because the alternative keeps S2 blocked and
because it is the same reading the engine gives every legacy session Joe never tapped.

**Q4 — custody of H6.** Lane B deliberately did not edit `gym-host.mjs` because
`DECISIONS:106` (b) gives lane C a licence to edit it. Who lands the one-line wiring and the
three A2 delta cells (§9.1) — the A2 builder, lane C's one-store pass, or the PM's
mechanical integrator?

---

## 13. Open items, recorded honestly

* **O1 — A0's clean-init athlete cannot reach the trend seam at all** (§7.3). Every lift at
  `w: null` is a permanent DEBUT, the host never writes `w` back, and the resolver is asked
  0 times. Step 17 sets one lift's `w` from its own `steps` and says so. The real question
  underneath — *what writes `w` for a native athlete, and when* — is not B-NTC's and is not
  answered here. A2 avoids it by using `today.stateFromOps()`, a Joe-shaped seeded state.
* **O2 — the three `native-next-targets*` tests were NOT run** (§7.4): environmental, missing
  `test-support/import-engine/`, pre-existing and recorded by A0. This brief claims nothing
  about them.
* **O3 — M10 is not killed by a committed cell** (§8): the host binds by identity, but only
  value equality is enforced by a test. Either add the cell or weaken the claim.
* **O4 — `--full` was never reachable for this package id** (§10.2), so the standing
  `DECISIONS:97` BLOCKED-private line could not be produced for `B-NTC`. It was produced for
  the parent gate instead, which is a different statement.
* **O5 — no browser, no phone.** Nothing here was executed in a browser or on a device.
* **O6 — the upstream tip moved 34 commits during this pass** (top advisory). Zero files
  under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/workout`, `rebuild/m3/w6/host` or
  `rebuild/m3/w7-preview/today` differ, so the hunks apply unchanged, but the rebase and the
  parent re-pin are real work someone must do before merge.

---

**Status:** PROPOSED. Speculative until reviewed. No receipt, no execution, no product
acceptance and no merge follows from this document.
