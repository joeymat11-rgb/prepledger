# EARNED — B-NTC — QUALIFIED `nativeTrendContext` PROVIDER — behaviour/delta brief v1.1 — **PROPOSED, NOT ACCEPTED**

---

## v1.1 — WHAT CHANGED AFTER THE INDEPENDENT REVIEW (read this first)

`rebuild/lanes/b/reviews/B-NTC-REVIEW-r1.md` returned **ACCEPT WITH CHANGES** (C1–C5
required, C6–C9 recommended, H6 not to be landed as written). This version applies them.
Everything below this section is v1 text with the corrections made **in place**; where a
claim was wrong it is replaced, not footnoted.

### The three things a reader must know before anything else

**1. IDENTITY IS NOT ENFORCEABLE AT THIS SEAM, AND THIS PACKAGE NO LONGER CLAIMS IT (C1).**
v1 said the provider is bound "by object identity" to the facts object the engine is about
to read. That is **false about what is enforced**. The accepted adapter clones the state
before the engine sees it — `const input=copy(captureState)` at
`rebuild/m4/workout/engine-capture.cjs:52`, where `copy` is `structuredClone` — so
`genSession` can never hold the object a host bound, and `performed.cjs:196` builds the
request out of **values** (`effective:structuredClone(session.effective)`). A structurally
equal but different object is therefore **answered, not refused**, and always would be. The
strongest binding that IS enforceable here, and that this version enforces and states, is:

> **a content digest of the bound facts + the current `source_revision` + a unique
> `start_op_id`, re-checked on every request inside a scoped window.**

`bindingDigest` (new) is taken at bind time over exactly the members `resolve` reads and
recomputed at answer time, so a facts object that MOVES under the live binding refuses
`bound_facts_digest_mismatch` instead of being read. The committed cell
*"identity is NOT enforced at this seam, and the module does not claim it"* records the
honest behaviour so no later reader rediscovers it.

**2. B-NTC ALONE DOES NOT UNBLOCK S2 FOR THE PRODUCT'S OWN ATHLETE (C2), AND THERE IS NOW A
PATH THAT DOES, BEHIND AN OPTION THAT IS OFF.** Measured, not argued:
`createTodayModel({}).stateFromOps()` — what `gym.test.mjs:569-570` and the product's own
`today-entry.mjs:26` both hand `createGymHost` — carries **28 recorded sleep nights and 0
events**, so `createEmptyHistoryDayFacts` refuses `recorded_sleep_unmapped` for **every**
date. §9.1's G1/G2/G3 do **not** flip when H6 lands, and G5 (the S2 milestone) is **not**
delivered by the wiring alone. §9.1 below is rewritten to the measured truth.

The S2 path is now implemented, behind **`mapRecordedDaysWithEnginePredicates`**, a
`createDayFactsReader` option that is **`false` by default**:

| option | engine exposes `dayWeather` + `cleanAtDate`? | day reader | the 28-night athlete on day 4 |
|---|---|---|---|
| off (default) | either way | `createEmptyHistoryDayFacts` | **refuses** `recorded_sleep_unmapped` — exactly today's behaviour |
| **on** | **no** (the accepted tree) | `createEmptyHistoryDayFacts` | **refuses** `recorded_sleep_unmapped` — identical, never a silent downgrade |
| **on** | **yes** (after the re-seal PM Q1(a) asks for) | `createEnginePredicateDayFacts` — the ENGINE's own two predicates | **qualifies**: the day opens, is Started, every set logged, closed — ops 12 → 18 |

Both conditions are checked **at runtime** (`enginePredicatesAvailable(engine)`), so the
option can be turned on today with no effect at all. Option A therefore costs the product
nothing until the PM rules Q1, and the ruling becomes a two-line `EXPOSED` change plus a
flag — not a rebuild of this package. **Lane B still does not make that ruling.**

**3. THE BIND WINDOW IS FIXED, AND H6 IS A PATCH FILE, NOT AN EDIT (C3).** Review F3 found
that `gym-model.readPrevious()` re-runs `genSession` **after** the producer returned, so the
old `finally { unbind() }` window had already closed; the refusal was swallowed at
`gym-model.mjs:136` and the card showed no previous performance on exactly the days B-NTC
opens. The binding now exposes **`withFacts(facts, run)`** — `bind … finally RESTORE`,
re-entrant — `workout-host.mjs` H3c uses it, and the H6 wiring puts the window on the engine
handle so every engine read over the same facts is covered. Measured both ways
(§9.1 G6). H6 now lives at **`rebuild/lanes/b/ntc/gym-host.wiring.patch`**; `gym-host.mjs`
is **not** edited on this branch (`DECISIONS:106` (b) is lane C's licence).

### Every review item, and where it is answered

| item | verdict | where |
|---|---|---|
| **C1** stop claiming identity | **applied** — six places rewritten (§1.4 row (1), §3 row 1, §4.1, §8 M10, §13 O3, the module header, the `workout-host.mjs` H3c comment) + a content digest + two committed cells | §1.4, §3, §4.1, §4.4, §8, §13 |
| **C2** rewrite §9.1 and the §0 headline | **applied** — 28 nights named, G1/G2/G3 marked NOT OBSERVED, G5 conditional on Q1 | §0, §9.1 |
| **C3** name the previous-performance delta, fix or own the bind window | **applied and FIXED** — `withFacts`, H3c widened, H6 puts the window on the engine handle, cell G6 measured both ways | §4.1, §6 H3c/H6, §9.1 G6 |
| **C4** correct the journey figure | **applied** — **23/23 at head** (17 journey steps + 5 equivalence + the suite node); 22/22 is the **base** figure | §7.3 |
| **C5** correct O2 / §7.4 | **applied** — green **inside** `native-carriers-package.cjs --ci` (child `focused`, `# pass 15`); not runnable by a bare `node --test` | §7.4, §13 O2 |
| **C6** `rushedOf` precedence | **applied** — both holders read; two declarations that disagree refuse `session_pace_disagreement`; cell added | §4.3 |
| **C7** `bind(null)` | **applied** — `bind(null|undefined)` now **throws**; clearing is `unbind()` and nothing else; header notes `bound()` hands out the live object | §4.1 |
| **C8** `packages/B-NTC.json` | **applied** — the contradicting note fixed, the artifact/review paths explained (the runner **derives** them from the package id and they are written at acceptance), the byte count in BUILD-REPORT §2 corrected to **7 862 B** | §10.2 |
| **C9** a CI home for the cells | **still a PM item** — B-NTC touches no `.github` file; carried into the next re-seal | §13 O7 |
| **F4/F5/F8/F10** | recorded | §7.3, §7.4, §10.2, §13 O8 |
| **F9** no CI home | recorded, unchanged | §13 O7 |

### What did NOT change

No file under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `.github`, `src`,
`ledger` or `rebuild/m3/w7-preview` is edited by this fix either. No law moves; the census is
byte-identical; `native-carriers --ci` passes; no D-ID is registered; nothing is merged.

---

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
that proves correspondence — by content digest, current revision and unique Start key, inside
a scoped window — to the facts the engine is about to read, and a day reader that derives
each flag from a fact the athlete actually recorded and that **throws rather than answer**
whenever it cannot. Nothing under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec` or
`.github` is edited. No law moves. The public census is byte-identical.

**THE HEADLINE, QUALIFIED (review r1 C2).** With the day reader that runs by default, this
package makes day+3 preparable **for an athlete with no recorded event and no recorded
sleep night**. The athlete the gym card and `today-entry.mjs:26` actually pass to
`createGymHost` today carries **28 recorded sleep nights**, so for him the provider refuses
`recorded_sleep_unmapped` and the wall stands. The path that removes it for a real athlete —
the engine's own `dayWeather` / `cleanAtDate` at this seam — is implemented here behind an
option that is **OFF by default** and that is inert until the PM rules Q1 and the pinned
`EXPOSED` surface is re-sealed. **So: B-NTC is the provider, qualified and proven; the S2
milestone is one PM ruling away, not zero.**

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
| **(1) Correspondence** — the answer is about the Start the engine asked about, at the revision the engine is reading | a **scoped window** over a live reference to the `workoutFacts` the host is about to hand the engine (outside it, every request refuses), plus three re-checks on **every** request: a **content digest** of the bound facts taken at bind time and recomputed at answer time, the current `source_revision`, and a **unique** `start_op_id` with its whole `effective` tuple. **NOT object identity** — see §4.4: the accepted adapter clones the state at `engine-capture.cjs:52`, so identity is unenforceable at this seam and is not claimed | `throw` → `performed.cjs:199` catches → `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`, before any recommendation and before any write |
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
| the bound `workoutFacts` — `{profile:'earned/workout-facts/v1', source_revision, sessions[]}` | the host producer's `context.workoutFacts`, opened as a **scoped window** by `binding.withFacts(facts, run)` — a **live reference**, digested at bind time, NOT an identity claim across the engine seam (§4.4) | produced by `rebuild/m4/workout/engine-history.cjs:119-122`; consumed by the engine at `performed.cjs:144-158` and `:193-194` |
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

Module: **`rebuild/m4/workout/native-trend-context.cjs`** (new; **v1.1: 25 319 bytes, sha256
`7f34754fcada67a0403315c22bf66724cdcbdca5052e8e8f16f789fdb012054a`** — v1 was 12 375 B /
`cf8b5095…`).
It sits beside `athlete-state.cjs`, `workout-basis.cjs` and `resume-policy.cjs` — the three
A0 product providers — and follows their house rule: **inject every collaborator, invent
nothing, refuse rather than guess** (`workout-basis.cjs:7-9`, "The client stores whatever
this resolver claims, so a resolver that cannot prove its claim must refuse rather than
guess").

The exports, plus the refusal code:

```js
module.exports = { createNativeTrendContextBinding, createEmptyHistoryDayFacts,
  createEnginePredicateDayFacts, createDayFactsReader, enginePredicatesAvailable,
  bindingDigest, ENGINE_DAY_PREDICATES, REFUSAL };
// REFUSAL === 'NATIVE_TREND_CONTEXT_UNQUALIFIED'
```

(v1 exported two of these. v1.1 adds the S2 path — `createEnginePredicateDayFacts`,
`createDayFactsReader`, `enginePredicatesAvailable`, `ENGINE_DAY_PREDICATES` — and the
binding proof `bindingDigest`. §4.2 and §4.4.)

### 4.1 `createNativeTrendContextBinding({ dayFacts })` → `{ resolve, bind, unbind, withFacts, bound, digest, REFUSAL }`

`resolve` is the function handed to `createEngineRuntime({nativeTrendContext})`.
`dayFacts(iso) -> {hard:boolean, debt:boolean}` is **REQUIRED and has no default** — a
missing or non-function reader is a construction-time `TypeError`, so a host can never
compose a provider that answers out of thin air.

**A context is QUALIFIED only when all EIGHT hold.** Each failure throws
`NATIVE_TREND_CONTEXT_UNQUALIFIED` with a named `reason`, which `performed.cjs:199` catches
and reports as `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`:

| # | rule | `reason` when it fails |
|---|---|---|
| 1 | a window is open over a facts object (and has not yet closed) | `no_bound_source_facts` |
| 1b | **(v1.1, C1)** the bound facts still digest to what they digested to when the window opened — i.e. the live object has not moved under the binding | `bound_facts_digest_mismatch` |
| 2 | the request is a non-array object with a non-blank string `start_op_id` | `request_malformed` / `request_start_invalid` |
| 3 | `request.source_revision === bound.source_revision` (strict, so `'7'` fails) | `source_revision_mismatch` |
| 4 | **exactly one** bound session carries that `start_op_id` | `start_not_in_bound_facts` / `start_not_unique_in_bound_facts` |
| 5 | the bound session's `effective` equals the request's, key-count and value-for-value — the engine's own comparison at `performed.cjs:200-202`, run in the other direction and **earlier** | `effective_tuple_mismatch` |
| 6 | that session's `effective.local_date` is a well-formed ISO date | `session_local_date_invalid` |
| 7 | `dayFacts(local_date)` returns two real booleans, and `rushed` resolves (§4.3) | `day_facts_not_boolean` / whatever `dayFacts` threw / `session_pace_unrecognised` / `session_pace_disagreement` |

**The answer**, when all eight hold, is the echo the contract demands plus the three proven
flags — and `effective` is a **copy**, so a consumer cannot reach back into the bound facts.
The digest is deliberately **not** echoed: `performed.cjs:200-204` compares the answer to the
request it built, and this module emits no key the engine did not ask for:

```js
return { start_op_id: start, source_revision: revision, effective: { ...effective },
  hard: facts.hard, rushed, debt: facts.debt };
```

**THE WINDOW — `withFacts(facts, run)`, and what it does and does not prove (C1, C3, C7).**

* `bind(workoutFacts)` refuses anything that is not `earned/workout-facts/v1` with a
  safe-integer `source_revision >= 1` and an array `sessions`, and — **new in v1.1 (C7)** —
  **refuses `null` / `undefined` with a `TypeError` instead of silently unbinding**.
  Clearing a binding has exactly one name: `unbind()`. v1's `bind(null)` returned `null` and
  disarmed the resolver; fail-closed, but undocumented, and a caller could do it by accident.
* `withFacts(facts, run)` is the window a host should use: `bind … finally RESTORE the
  previous binding`. It is **re-entrant**, so a host may open one window per engine read —
  the producer's `adapter.prepare`, and later the gym card's previous-performance
  `genSession` over the same facts — without the inner one closing the outer. An absent
  `facts` opens an explicitly UNBOUND window rather than leaving the last one standing.
  This is the fix for review F3; §9.1 G6 measures it both ways.
* **What the window proves:** SCOPE (outside it every request refuses
  `no_bound_source_facts`) and LIVENESS (because `bound` is a live reference, a revision or
  tuple that moves under it is caught — as `bound_facts_digest_mismatch`, rule 1b).
* **What it does NOT prove: object identity across the engine seam.** See §4.4. Every
  correspondence claim this package makes is by VALUE and by DIGEST.
* `bound()` hands out the **live** object, not a copy. That is a writable handle on the
  engine's input; the digest check is what makes a write through it visible rather than
  silent. `digest()` returns the window's digest, or `null` outside one.

### 4.2 The day readers — `createEmptyHistoryDayFacts`, and (v1.1) the S2 path behind an option

`hard` and `debt` need `dayWeather` / `cleanAtDate`. **This package may not obtain them on
the accepted tree, and says so rather than working around it:**

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

**BUT NOT THE ATHLETE THE PRODUCT ACTUALLY COMPOSES (review r1, F2 — measured).**
`createTodayModel({}).stateFromOps()` — the state `gym.test.mjs:569-570` and
`rebuild/m3/w7-preview/today/today-entry.mjs:26` both pass to `createGymHost` — carries
**28 recorded sleep nights and 0 events**. For him this reader refuses
`recorded_sleep_unmapped` on **every** date, so the day-4 wall stands exactly as it does
today and the S2 milestone is not moved by this package alone. That is stated in §0 and
§9.1 and is the whole reason the next two paragraphs exist.

#### 4.2b `createEnginePredicateDayFacts({ state, engine })` — the ENGINE's own two readers

The only honest way to qualify a day that HAS recorded nights or events is to ask the
engine's own predicates. This reader does exactly that and nothing else:

```js
hard = !!engine.dayWeather(state, iso).hardSession      // sleep.cjs:1871-1890
debt = !engine.cleanAtDate(state, iso)                  // sleep.cjs:1017-1029
```

It restates nothing, approximates nothing and copies no body; if the two functions are not
injected it **refuses to be constructed**. One deliberate difference from the legacy branch,
stated because it is a difference: `progression.cjs:702,704` wraps each call in
`catch (e) { hard = false; }` / `catch (e) { debt = false; }`. **This reader does not.**
`PERFORMED-ENGINE-v1.md:254` forbids "caught exceptions interpreted as false" on the native
branch, so a predicate that throws refuses by name (`day_weather_unreadable` /
`clean_at_date_unreadable`), and a predicate that answers with a non-boolean refuses too
(`day_weather_not_boolean` / `clean_at_date_not_boolean`). That is the stricter direction.

It is **not reachable on the accepted tree**, because `EXPOSED` is `['genSession','rirPlan']`
(above). Committed cells prove it against the real twelve-module engine — including that a
recorded event on the day answers `hard:true`, so this reader is demonstrably **not** a
constant-false answerer (review r1, residual risk 3).

#### 4.2c `createDayFactsReader({ state, engine, mapRecordedDaysWithEnginePredicates })` — the option, and it is OFF

One place chooses, and the flag's default is `false`:

| `mapRecordedDaysWithEnginePredicates` | `dayWeather` + `cleanAtDate` present at runtime? | reader returned | reported as |
|---|---|---|---|
| `false` (default) | either | `createEmptyHistoryDayFacts` | `{enginePredicates:false, optionRequested:false}` |
| `true` | **no** (the accepted tree) | `createEmptyHistoryDayFacts` — the same refusal, never a weaker answer | `{enginePredicates:false, enginePredicatesAvailable:false, optionRequested:true}` |
| `true` | **yes** (after a re-seal) | `createEnginePredicateDayFacts` | `{enginePredicates:true, …}` |

`enginePredicatesAvailable(engine)` is a **runtime** check (`typeof engine.dayWeather ===
'function' && typeof engine.cleanAtDate === 'function'`), not an assumption, so the option
may be switched on today with literally no effect. The reader that was composed is reported
rather than assumed, so a host can print which one it got.

**This changes nothing on the committed tree and is not a decision.** It is the work Q1(a)
would otherwise require after the ruling, done in advance and left switched off.

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

**And it is guarded forward, in BOTH places a declaration could sit (v1.1, C6/F6).**
`rushedOf(session)` reads an own `pace` member on the session **and** on its record;
`'rushed'` → `true`, `'normal'`/`null` → `false`, **anything else → refuse
`session_pace_unrecognised`**. v1 returned on the FIRST holder that carried one, so
`session.pace:'normal'` masked `session.record.pace:'rushed'` and answered `rushed:false` —
the review executed that (B5). v1.1 reads both and **refuses `session_pace_disagreement`**
when two declarations disagree: two different declarations are not a fact about one session,
and resolving them by precedence would be exactly the guess this module exists not to make.
Two declarations that AGREE are the athlete's one declaration and answer. A declaration in
either place alone is read; neither is ignored. Cells:
*"two pace declarations that disagree are refused, never resolved by precedence"* and the
existing unrecognised-label cell. The day A-lane adds a pace control, an old provider cannot
silently ignore it or read the wrong one of two.

**Disclosed honestly for the PM:** `rushed:true` is the *protective* reading (it keeps a
session out of stall counting and marks the point `soft`). Reading an unrecorded native
session as not-rushed is therefore the *less* protective direction, and it is the same
reading the engine has always given every legacy session Joe did not tap "rushed" on. If the
PM judges that a native session must instead carry an explicit declaration before its trend
counts, that is **PM question Q3** and the fix is a `pace` lane in the gym card (A-lane) plus
one line here — not a change to this module's shape.

### 4.4 IDENTITY — what this package claimed in v1, and what it claims now (C1)

v1's module header, §1.4, §3, §4.1, M10 and O3 all said the provider is bound **by object
identity** to the facts object the engine is about to read. **That was false about what is
enforced, and it is withdrawn.** The review executed both halves:

* **A structurally equal, DIFFERENT facts object is ANSWERED, not refused.** `resolve` never
  compared object references; it compares values. (Committed cell: *"identity is NOT enforced
  at this seam, and the module does not claim it"*.)
* **The engine can never hold the bound object anyway.** The accepted adapter clones the
  state on the way in — `const input=copy(captureState)` at
  `rebuild/m4/workout/engine-capture.cjs:52`, `copy = structuredClone` — and
  `performed.cjs:196` then builds the request from `structuredClone(session.effective)`. So
  identity across this seam is not merely untested; it is **structurally impossible**, and
  M10 (`bind(structuredClone(context.workoutFacts))`) is behaviourally indistinguishable from
  the real hunk for correspondence.

**What v1.1 claims instead — the strongest thing the code can keep:**

> the answer is bound to a **content digest** of the facts the window was opened over, to the
> **current `source_revision`**, and to a **unique `start_op_id`** whose whole `effective`
> tuple matches — all three re-checked on every single request, inside a window that refuses
> everything outside it.

`bindingDigest(workoutFacts)` is a deterministic 16-hex-digit value over exactly the members
`resolve` reads — `profile`, `source_revision`, `sessions.length`, and per session the
`start_op_id`, the whole `effective` tuple (keys sorted) and an own `pace` on the session or
its record. It is **not cryptographic and is not called a commitment**: there is no adversary
inside one process, and its job is to notice that the live object has moved. Scoping it to
the read members keeps it O(sessions) with small constants and means it never manufactures a
refusal it cannot justify — a cell proves that changing an unread member does not move it,
and that changing each read member does.

This is what M10 is now killed by: mutate the bound object after the window opens and the
next request refuses `bound_facts_digest_mismatch` (four variants: revision bumped, effective
rewritten, a pace added, a session appended). §8 M10 is rewritten accordingly.

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

Four code files — **two new, two additive edits** — plus, in v1.1, the H6 wiring as a
**patch file** (`rebuild/lanes/b/ntc/gym-host.wiring.patch`) rather than an edit. Nothing
under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `.github`, `src`, `ledger` or
`rebuild/m3/w7-preview` is touched.

### H1 — NEW `rebuild/m4/workout/native-trend-context.cjs`

New file. **v1.1: 25 319 bytes, sha256
`7f34754fcada67a0403315c22bf66724cdcbdca5052e8e8f16f789fdb012054a`** (v1: 12 375 B,
`cf8b5095…`). Full behaviour in §4. No pre-image.

### H2 — NEW `rebuild/m4/workout/test/native-trend-context.test.cjs`

New file. **v1.1: 29 437 bytes, sha256
`443448d0643b32416a92b63af91d1ad8d75bd5e3571ca33086bc94851748e14d`, 36 cells** (v1: 13 164 B,
`f0879ca2…`, 22 cells). §7.2. No pre-image.

### H3 — `rebuild/m3/w6/host/workout-host.mjs` — **three additive hunks**

pre `4029a5404cd34aac56da0af89c4ae6e0e2868353ab758d0f778c9d9f29190a8b` (12 000 B) →
**v1.1 post `262d7d5f65e736bb2592da6cd2f4bf883f30842d4dbbec97653b610e5f79d6fe` (14 536 B)**
(v1 post was `2d160c1c…` / 13 409 B; the difference is the C1 comment rewrite and the C3
`withFacts` window).

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

**H3c — open the trend-context window around the host's own engine read** (`workoutProducer`).
**v1.1 (C1/C3):** the identity claim is gone, and `bind`+`finally{unbind()}` is replaced by
`withFacts(facts, run)` — the same window, but RESTORE-based and re-entrant, so a caller that
has opened its own window over the same facts is not disarmed when this one returns. The
`{bind, unbind}` guard (H3b) is now `{bind, unbind, withFacts}`:

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

// after (v1.1)
      lastProjection = registrar.register({ generation, state: engineState, workoutFacts: context.workoutFacts });
      // B-NTC. Open the trend-context window over the VERY facts object this
      // preparation is about to give the engine, for exactly the engine read it
      // wraps, and restore the previous window when that read returns.
      //
      // The window does NOT claim object identity across the engine seam: the
      // accepted adapter hands genSession a structuredClone
      // (rebuild/m4/workout/engine-capture.cjs:52), so the engine never holds
      // the object bound here. What the window buys is SCOPE (outside it every
      // request refuses), a content digest that catches a facts object moving
      // under the binding, and the value correspondence performed.cjs itself
      // checks — revision, unique Start, whole effective tuple.
      const prepare = () => adapter.prepare({ day, basis: context.basis,
        sourceProjection: lastProjection, source_basis: context.source_basis }).capture;
      // withFacts restores rather than clears, so a caller that has already
      // opened a window over the same facts (the gym card's previous-performance
      // read) is not disarmed by this one returning.
      return nativeTrendBinding ? nativeTrendBinding.withFacts(context.workoutFacts, prepare) : prepare();
    } catch (error) {
      lastRefusal = Object.freeze({ code: error?.code || null, reason: error?.reason || null,
        message: typeof error?.message === 'string' ? error.message : null });
      throw error;
    }
  }
```

Journey step 17(c) still holds unchanged — `binding.bound() === null` after the preparation
returns and a further `resolve()` refuses `no_bound_source_facts` — because `withFacts`
restores the window that stood before it, which in this host is none. With
`nativeTrendBinding` absent the file still behaves byte-for-byte as A0's, which steps 1–16
prove (23/23, §7.3).

**Custody note.** `workout-host.mjs` is A0's file; A2 already added 9 additive lines to it
under the same reasoning (`DECISIONS:102`, "+9 additive lines (records the producer's
refusal, rethrows unchanged; A0 22/22)"). These three hunks are additive in the same sense:
with `nativeTrendBinding` absent the file behaves byte-for-byte as before, which the
unchanged A0 journey steps 1–16 prove (23/23 at head, §7.3).

### H4 — `rebuild/m3/w6/host/test/journey.test.mjs` — **one new step 17 + one import**

pre `57566afd36ea913da4b9eaeed8f7a358479381606a9b6f92fc5e562d85d58cda` (27 838 B — the sha
`DECISIONS:98` pins) → post `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96`
(37 419 B). Steps 1–16 are **unmodified**; step 17 is appended. Contents in §7.1.

### H5 — NEW `rebuild/lanes/b/tooling/packages/B-NTC.json`

Allowed by `DECISIONS:103` (4). Its own sha256 is recorded in
`rebuild/lanes/b/BUILD-REPORT-B-NTC.md` §2, not here: the spec pins **this brief's** sha256
in `brief.sha256`, so stating the spec's hash inside the brief would be circular. See §10.2
for the honest `--ci` result.

### H6 — STILL NOT MADE, and now a PATCH FILE: `rebuild/lanes/b/ntc/gym-host.wiring.patch`

`gym-host.mjs` is **not edited on this branch**: `DECISIONS:106` (b) grants **lane C** an
explicit licence to edit it for the local-era move, and review r1 §7 Q4 sequences the landing
(Q1 ruling → the F3 fix in `workout-host.mjs`, done here → lane C's one-store pass → the A2
builder lands the wiring). So v1.1 ships the wiring as a **unified diff against
`rebuild/m3/w7-preview/today/gym-host.mjs` at this branch tip**, verified with
`git apply --check` (exit 0) and applied in a scratch copy to produce the measurements in
§9.1. Apply it with `git apply rebuild/lanes/b/ntc/gym-host.wiring.patch`.

Review r1 §5.1 rejected v1's form on three counts; the patch fixes all three:

1. **DEFAULT import, not named.** `gym-host.mjs` states its own rule two lines above the
   import block — "CommonJS collaborators are taken as DEFAULT imports, the way the accepted
   host entry takes them" — and every other CJS collaborator in the file obeys it. v1's hunk
   used named imports, which works only while `module.exports = { … }` stays an object
   literal `cjs-module-lexer` can read. The patch is
   `import NativeTrend from '../../../m4/workout/native-trend-context.cjs';` plus one
   destructure beside the file's own.
2. **The bind window travels with the ENGINE handle**, not with the preparation, so
   `gym-model.readPrevious()`'s later `genSession` runs inside `withFacts` too (F3). Measured
   both ways in §9.1 G6.
3. **The S2 option is threaded through and defaults to OFF**
   (`mapRecordedDaysWithEnginePredicates`), and the host reports which day reader it composed
   (`trendDayReader()`), so nothing about it is assumed.

The patch file carries the corrected §9.1 table in its own header, so whoever lands it reads
the measured truth beside the diff. Scratch results with it applied: today suite **129/129**
(123 unchanged + 6 delta cells), `build.mjs` **A1 TODAY BUILD PASS**, and — with a
scratch-widened `EXPOSED` only — **4/4** on the re-seal cells.

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

### 7.2 The provider's own cells — `rebuild/m4/workout/test/native-trend-context.test.cjs`, **36/36 PASS** (v1 had 22)

| group | cells |
|---|---|
| **A. qualified** | the answer echoes the binding and carries three real booleans · the echo is a copy: mutating the answer cannot reach the bound facts · a session logged rushed answers `rushed:true`, from the record and not a default |
| **B. fails closed: bind** | the resolver refuses when no preparation has bound any facts · unbind really unbinds · bind refuses anything that is not `earned/workout-facts/v1` read at a revision · a `dayFacts` reader is required — there is no default day reader |
| **C. fails closed: correspondence** | a stale source revision is refused, never answered from the bound one · a Start the bound facts do not carry is refused · a Start the bound facts carry **twice** is refused, never resolved to the first · an effective tuple that differs in any way is refused (5 variants) · a malformed request is refused before anything is read · a bound session whose own `local_date` is malformed is refused |
| **D. fails closed: provenance** | a recorded event refuses rather than being mapped onto a native session · a recorded sleep night refuses rather than being read as clean · the empty proof is re-read every call, never captured at construction · an absent `events`/`sleep` member is the empty proof; a malformed one refuses · an unrecognised pace label refuses — it is never read as "not rushed" (5 variants) · a `dayFacts` reader that answers with anything but two booleans is refused (4 variants) |
| **E. the ENGINE itself accepts it** | the engine accepts the qualified answer where it refused the absent resolver (with **two controls**: no resolver → `resolver_missing`; A0's refusal → `resolver_failed`) · the engine still refuses when this provider refuses — the refusal is contained, not converted · the engine **rejects** an answer that does not echo the binding (4 tampers → `context_binding_or_flags_invalid`) |

**v1.1 adds 14 cells, in two new groups (C1, C3, C6, C7 and the S2 path):**

| group | cells |
|---|---|
| **F. what the binding really enforces** | identity is NOT enforced at this seam, and the module does not claim it (a structurally equal, different object is **answered**) · the content digest catches a facts object that MOVES under the binding (4 moves → `bound_facts_digest_mismatch`) · the digest covers exactly the members `resolve` reads, and nothing else (an unread member does not move it; each read member does) · `withFacts` is the bind…finally window and RESTORES rather than clears (nesting, throw-safety, the absent-facts case, a non-function `run`) · a second engine read over the same facts is answered INSIDE its own window and refused outside it · two pace declarations that disagree are refused, never resolved by precedence (+ agreeing, + either place alone, + unrecognised from either place) · `bind(null)`/`bind(undefined)` throw; clearing is `unbind()` |
| **G. the S2 path, option OFF by default** | the option is OFF by default: a day with recorded nights refuses exactly as today · the option ON **without** the engine predicates keeps the SAME refusal — never a silent downgrade · the engine-predicate reader refuses to exist without the engine's own two readers · the engine composes `dayWeather` and `cleanAtDate` — they exist, they are just not `EXPOSED` · option ON + the engine's own predicates: a day with **28 RECORDED NIGHTS is qualified**, and the answer equals the engine's own predicates asked directly · option ON: a recorded EVENT on the day answers `hard:true` — **not a constant false** · option ON: a predicate that throws REFUSES — a caught exception is never read as false (4 variants) · the ENGINE accepts the option-ON answer for an athlete with 28 recorded nights, with the option-OFF refusal as its control |

Group E **and** the new group G compose the **real** twelve engine modules in the same list
and order `engine-runtime.cjs:9` uses and call `E.performedTrendContext` / `E.dayWeather` /
`E.cleanAtDate` directly, so the acceptance is the engine's own, not a mock's.

### 7.3 The A0 host journey — **23/23 PASS at head**, including new step 17

`node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs`
→ **23 tests / 23 pass / 0 fail** at the package head (17 journey steps + 5 equivalence + the
suite node, which `node --test` counts).

**Correction (review r1, C4/F4).** v1 of this brief and BUILD-REPORT §3.4b both said
**22/22** at head. **22/22 is the BASE figure** (`DECISIONS:102`, 16 `await t.test(` calls at
`12cfdb9`); the head has 17, so the head figure is **23/23**. Both are stated here so no
later reader concludes a test vanished.

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

### 7.4 The accepted `native-next-targets` tests — **GREEN INSIDE THE GATE** (corrected, C5/F5)

**The correction first.** v1 said these three tests "could not be run" and claimed nothing
about them. That was **overstated**. They **do run, and they pass, inside
`node rebuild/m4/spec/native-carriers-package.cjs --ci`**: the gate's `focused` child is
exactly `node --test … native-next-targets.test.cjs native-next-targets-assembly.test.cjs
native-next-targets-correction.test.cjs` asserting `# pass 15`
(`native-carriers-package.cjs:61-64`), and that child reported
**`OBSERVED; exit 0 and exact declared verdict`** on this branch — under the builder's run,
under the reviewer's re-run, and under the v1.1 re-run (§7.5). The honest statement is:
**not runnable by a bare `node --test` without the gate's environment; green inside the
gate.** Open item O2 is rewritten to that.

The bare-`node --test` failure, recorded because it is still true and still a trap:

`node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` →

```
Error: Cannot find module '../../../../test-support/import-engine/rebuild/m3/w7-preview/fixtures.cjs'
```

They require `EARNED_NATIVE_PACKET_ROOT` and a `test-support/import-engine/` tree that does
not exist in this repository — **exactly** what A0-REPORT §"not qualified" 2 already records:
*"The three `native-next-targets*` tests do not pass in this worktree. They are byte-identical
to the tip and need `EARNED_NATIVE_PACKET_ROOT` and a `test-support/import-engine/` tree that
does not exist here."* They are byte-identical to the tip here too, and B-NTC changes nothing
they read. Their `assumed` resolver is unaffected by this package: B-NTC adds a provider, it
does not remove or alter the declared test assumption. **They pass where the gate runs
them**, which is the only place they are meant to run.

### 7.5 Everything else that was run green

| suite | command | result |
|---|---|---|
| the parent package gate | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, exit 0**, artifact `295762f0…` AUTHORIZED, all 13 children OBSERVED incl. `second-gate` |
| public conformance census | `node rebuild/conform/run.cjs` | `99 reference GREEN · 99 STRONG · 29 RED-first · 70 GREEN` — **byte-identical to base**, §9.2 |
| A1 + A2 screens | `node --test rebuild/m3/w7-preview/today/test/*` | **123 / 123 pass** (unchanged — B-NTC does not wire the gym card, §6 H6) |
| the provider's own cells (v1.1) | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **36 / 36 pass**, exit 0 |
| the A0 journey (v1.1) | `node --test …/journey.test.mjs …/engine-equivalence.test.cjs` | **23 / 23 pass**, exit 0 |
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
| **M9** | replace `withFacts(facts, prepare)` with a bare `prepare()` (no window at all) | journey step 17(b) (the day does not prepare) and the cell *"the resolver refuses when no preparation has bound any facts"* |
| **M10** | `withFacts(structuredClone(context.workoutFacts), …)` instead of the producer's own object | **v1.1: this is no longer a disclosed weakness — it is a stated non-property.** Identity across the engine seam is **unenforceable** (`engine-capture.cjs:52` clones), so M10 is behaviourally indistinguishable from the real hunk *for correspondence* and no cell can or should claim otherwise (§4.4). What M10 DOES lose is **liveness**, and that is now killed by a committed cell: *"the content digest catches a facts object that MOVES under the binding"* — bind a clone and the producer's object can move underneath without refusal, which the digest cell over the real object detects. O3 is rewritten to say this. |

**Three further mutants, added in v1.1 with the code they guard:**

| # | mutant | killed by |
|---|---|---|
| **M11** | `resolve` skips the `bindingDigest(bound) !== digest` check | *"the content digest catches a facts object that MOVES under the binding"* (4 variants) |
| **M12** | `rushedOf` returns on the first holder that carries a `pace` (v1's behaviour) | *"two pace declarations that disagree are refused, never resolved by precedence"* |
| **M13** | `createDayFactsReader` ignores `enginePredicatesAvailable` and uses the engine reader whenever the option is on | *"the option ON without the engine predicates keeps the SAME refusal"* — with no predicates the engine reader's constructor throws, so a host that ignored the check would fail to compose at all rather than answer |

**A negative control on the whole package**, already committed: group E's *"the engine
rejects an answer that does not echo the binding"* mutates the provider's **output** four
ways and proves the engine — not this module — refuses each one
(`context_binding_or_flags_invalid`). So the package cannot pass by weakening the engine's
own check, because it never touches it.

---

## 9. Expected delta cells — what changes, and what must NOT

### 9.1 What changes for the gym card when H6 lands — **REWRITTEN TO THE MEASUREMENT (C2)**

**v1 of this section was wrong, and the review caught it.** v1 predicted that G1, G2 and G3
flip and that G5 (the S2 milestone) is delivered the moment the wiring lands. Measured, with
the patch applied in a scratch copy of this branch, they do not and it is not.

**Why, in one line:** `createTodayModel({}).stateFromOps()` — the athlete `gym.test.mjs:569-570`
and the product's own `today-entry.mjs:26` both hand `createGymHost` — carries **28 recorded
sleep nights and 0 events**, so `createEmptyHistoryDayFacts` refuses `recorded_sleep_unmapped`
for every date and the provider refuses with **the same code and the same `copy`** as A0's
`createUnavailableNativeTrendContext`.

Measured 2026-09-11 on the owner's PC, node v24.19.0, scratch copy, patch applied:

| # | cell | brief v1 predicted | **MEASURED** (patch applied, option OFF = the default) |
|---|---|---|---|
| **G1** | `gym.test.mjs:621` *"day 4 — the first wall"* | day 4 prepares; rewrite the assertions | **NOT OBSERVED — UNCHANGED.** `phase 'blocked'`, `code 'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'`, `copy 'resolver_failed'`, `model.start()` refused, **12 ops** |
| **G2** | `gym.test.mjs:639` *"every day after the wall stays readable"* | training days now prepare | **NOT OBSERVED — UNCHANGED.** day+4, day+5, day+7 each `blocked` with `ENGINE_CAPTURE_NO_WORKOUT` or `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`, 12 ops |
| **G3** | `gym.test.mjs:657` `lastProducerRefusal().code` | `null` on a prepared day | **NOT OBSERVED — UNCHANGED.** still `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` |
| **G4** | `view.test.mjs:328-337` | unchanged | **unchanged** — v1 called this one correctly (a view-layer cell over a stub) |
| **G5** | the product itself — "a fresh Joe trains day after day", the S2 milestone | delivered by the wiring | **NOT delivered by the wiring alone.** Delivered only with `mapRecordedDaysWithEnginePredicates` **on** *and* the `EXPOSED` re-seal PM Q1(a) asks for. Proven in a scratch re-seal: day 4 `phase 'ready'`, Started, every set logged, closed — **ops 12 → 18** |
| **G6** | *(new — review F3)* previous performance on a day the provider opens | not stated | **With the patch's window:** `genSession` **ANSWERED**, 2 cards, both carrying the engine's own `earned/performed-lift/v1` previous record (`demo-press` and `demo-row`, 40 lb × 11 and × 10 from day 1), `model.previous().size === 2`. **With v1's narrow window:** **THREW** `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`/`resolver_failed`, swallowed at `gym-model.mjs:136`, `model.previous().size === 0` — the card silently showed nothing |
| **G7** | *(new — found while measuring G6; A2 CUSTODY, NOT lane B's)* the printed "Last time" line | not stated | **Still absent even with G6 fixed.** `gym-model.previousLine()` (`gym-model.mjs:142-148`) requires the LEGACY prev shape `{ w: number, reps: number[] }`; a NATIVE `card.prev` is an `earned/performed-lift/v1` record whose loads sit at `slots[i].fact.current.load.value`. **The data is now there; the reader shape is not.** Named here so it is not mistaken for this package's refusal |

The 123 today tests are therefore **123/123 unchanged with the patch applied** — which is the
same result the review measured, now reproduced and turned into six committed-in-the-patch
delta cells (129/129 in the scratch run).

`gym-check.mjs:304` (`shippedDayTwo.summary.code === "PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED"`)
is **unaffected**: that is the legacy athlete's wall, B-LOM's, not this seam's (§5).

**What this means for the package's own headline.** B-NTC is the qualified provider, and
every claim about the provider stands. But *"the S2 blocker, removed"* is **not** true on
this tree for the product's own athlete, and this brief does not say it is. §0 states the
qualification; §12 Q1 states the ruling it hangs on; and the code for option A is here,
switched off, so the ruling is a flag and a re-seal rather than another package.

### 9.2 What must NOT change — and the measurement

**The public census must be byte-identical.** Verified the only way that means anything:
`node rebuild/conform/run.cjs` was run on the candidate, the one tracked pre-existing file
was stashed to restore the base tree, it was run again, and the two logs were compared.

```
v1   (builder)  candidate / base   sha256 CAAB2293…  -> IDENTICAL
v1.1 (this fix) candidate / base   sha256 7EA1E04BBB2847738BCDC7793DA8365E3EAF59F849FC8BC54A355487EC58A37C
                Compare-Object base candidate -> 0 differing rows, IDENTICAL
```

(The v1.1 run stashed **all three** modified tracked files —
`native-trend-context.cjs`, its test, and `workout-host.mjs` — re-ran the census on the
restored base, and popped. The two logs are 84 lines each and byte-identical; the absolute
sha differs from v1's only because this worktree's own path appears in the
`BAD 0 engine artifacts present` row, which the reviewer also recorded.)

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

**The run, honestly — and it moved between v1 and v1.1.** The accepted runner is not on this
branch; it lives on `rebuild/lane-b-tooling`.

* **v1** measured it at `572a8c2`, where the usage guard closed the package list to
  `B1|B2|B3|B4` and `--ci --package B-NTC` refused in one line with exit 1. Recorded as PM
  question Q2.
* **v1.1** re-ran it at **`477b025`** (fetched from `origin/rebuild/lane-b-tooling` into a
  scratch directory; the runner was copied into this worktree, run, and **deleted again
  without ever being committed**). At that commit the runner's own usage line is
  `--ci|--full --package <B-NTC|B-LOM|B1|B2|B3|B4>` — **`B-NTC` is accepted by the guard.**
  The exact terminal line and exit code of that run are in **BUILD-REPORT §3.6**, reported
  verbatim including any BLOCKED or FAIL word. They are deliberately **not** quoted here:
  this file's bytes are what `packages/B-NTC.json` pins in `brief.sha256`, so quoting a run
  that happens after the pin is taken would make the spec stale the moment it is written.

`tooling.runnerSha256` stays **null** in the spec until the tooling PR is accepted — a
declared runner hash that stands in no accepted ledger line is a claim, not a pin. **PM
question Q2** now also covers the two competing `packages/B-NTC.json` files (§12 Q2, O9).
`--full` still terminates at the same private-fixture check the standing `DECISIONS:97` rule
names; the parent package gate's BLOCKED line remains the closest true statement B-NTC can
make on its own and it is in the build report. **O4.**

**C8, applied.** The review found three slips in `packages/B-NTC.json` and BUILD-REPORT §2:
the note said `runnerSha256`, `brief.sha256` "… stay null" while `brief.sha256` **is** set
(correctly) — the note is rewritten to say only `runnerSha256` and the authorizations stay
null; `artifact.file` / `artifact.review` name two files that do not exist on this branch —
they are **kept**, because `b-package.cjs:300-303` *derives* exactly those paths from the
package id and asserts them, and they are written at acceptance, and a note now says so; and
BUILD-REPORT §2 said 7 846 B where disk says **7 862 B** (the sha256 matched, so the count
was the slip) — corrected.

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

**Q1 — the day reader's boundary. THE RULING THIS PACKAGE HANGS ON, and it is due NOW, not
before A3 (v1.1, C2 — v1 mis-sequenced this and the review was right).**

v1 said the boundary "must be closed before A3 ships sleep". **Measured: it is already
closed against the product.** `createTodayModel({}).stateFromOps()` — the athlete the gym
card and `today-entry.mjs:26` use **today** — carries **28 recorded sleep nights**, so
`createEmptyHistoryDayFacts` refuses `recorded_sleep_unmapped` for every date and B-NTC, the
package ruled to be the S2 blocker, **does not move the S2 milestone for the product's own
athlete**. This is not a future A3 item; it is the condition on B-NTC's headline claim, and
the PM must be told in those words.

**The ruling is between two, and both are cheap now:**

**(a) `EXPOSED` gains `dayWeather` + `cleanAtDate` at the next re-seal.** Lane B's
recommendation, and **the provider code for it is already written and committed here,
switched off**: `createEnginePredicateDayFacts` + the
`mapRecordedDaysWithEnginePredicates` option (§4.2b/§4.2c). It calls the engine's own two
predicates and restates nothing. What is left is not lane B's to do:
`rebuild/m4/workout/engine-runtime.cjs:11` (two names), `engine-runtime-host.cjs:45` mirrored,
`engine-equivalence.test.cjs` proving the two lists still agree, and a **re-seal of the
accepted artifact** because `native-carriers-witnesses.cjs:16` pins that list
(`DECISIONS:105` says a re-seal is coming anyway for the `# pass 19` child). **Proven in a
scratch copy with a locally widened `EXPOSED` (not committed, not proposed as a diff):** the
28-night athlete's day 4 opens, is Started, every set is logged and the session closes —
**ops 12 → 18** — and with the option off, or with the predicates absent, it refuses exactly
as it does today.

**(b) The S2 athlete genuinely starts with no nights and no events, and the 28 nights are a
preview fixture.** Then say so, fix the fixture, and B-NTC's claim stands as written with no
code change at all. Note `DECISIONS:106` (d)/(c): lane C already routed a
"`make-synthetic.cjs` `sleep.nights` quirk → suite v4 item for the conform owner (lane B)",
which is very likely the same 28 nights — so this option may already be half-decided
elsewhere.

**Lane B still does not choose.** Restating the two predicates here stays forbidden by
`PERFORMED-ENGINE-v1` §6, and widening a pinned surface is the PM's call. What v1.1 changes
is that **either ruling is now a small, reviewed change rather than another package**: (a) is
a flag flip plus the re-seal; (b) is a fixture edit.

**Sequencing (the review's own recommendation, which lane B accepts):** rule Q1 **before**
B-NTC is sealed as "the S2 unblocker". If the PM prefers to seal now, seal it as **the
provider** — qualified, proven, engine-untouched — and keep the S2 milestone open.

**Q2 — the tooling runner's package list. ANSWERED UPSTREAM WHILE THIS WAS BEING FIXED, with
one new thing for the PM to settle.** v1 measured the runner at `rebuild/lane-b-tooling` @
`572a8c2`, where `b-package.cjs` closed its list to `B1|B2|B3|B4` and refused `B-NTC` in one
line. At **`477b025`** — the tooling tip this fix re-ran against — the runner's own usage line
is now `--ci|--full --package <B-NTC|B-LOM|B1|B2|B3|B4>`. So (i) is **already done** on the
tooling branch and Q2's first half is moot.

**The new thing:** that branch also carries its **own** `rebuild/lanes/b/tooling/packages/B-NTC.json`
(21 159 B) alongside the one this package wrote (7 862 B, `DECISIONS:103` (4)). Two specs for
one package id will collide the moment the tooling PR merges. The PM should say which is the
spec of record — lane B's recommendation: **the tooling branch owns the runner and the schema,
this package owns its own spec's contents**, so reconcile at merge with this package's
`product` / `coverage` / `parent` values and the tooling branch's schema. §10.2 and
BUILD-REPORT §3.6 carry the honest run lines either way. (ii) still stands for acceptance:
B-NTC has no D-ids, no law moves and no `rebuild/engine` bytes, so most of the closed-package
machinery has nothing to bind.

**Q3 — `rushed` on a native session.** §4.3. `false` is `paceRushed`'s literal value on a
record with no `pace` member, and the gym card has no control that could set one. Is that
acceptable until A-lane adds a pace control, or must a native session refuse until the
athlete declares? Lane B's recommendation: **acceptable, with the forward guard already
built** (an unrecognised `pace` refuses), because the alternative keeps S2 blocked and
because it is the same reading the engine gives every legacy session Joe never tapped.
**The review's condition on this (C6) is now met**: `rushedOf` reads both possible holders
and refuses a disagreement, so when the A-lane does add a pace control this module cannot
read the wrong one of two declarations.

**Q4 — custody of H6. Unchanged as a question; the review answered the sequencing and lane B
accepts it.** `gym-host.mjs` is still not edited here. The wiring is a patch file
(`rebuild/lanes/b/ntc/gym-host.wiring.patch`) with the corrected form, the corrected bind
window and the **measured** delta cells in its own header. The review's sequence —
**Q1 ruling → the F3 bind-window fix in `workout-host.mjs` (lane B, done on this branch) →
lane C's one-store pass → the A2 builder lands the patch with the rewritten §9.1 cells** — is
the one lane B recommends. The PM confirms who lands it; the patch is ready either way, and
`git apply --check` on this branch tip is exit 0.

---

## 13. Open items, recorded honestly

* **O1 — A0's clean-init athlete cannot reach the trend seam at all** (§7.3). Every lift at
  `w: null` is a permanent DEBUT, the host never writes `w` back, and the resolver is asked
  0 times. Step 17 sets one lift's `w` from its own `steps` and says so. The real question
  underneath — *what writes `w` for a native athlete, and when* — is not B-NTC's and is not
  answered here. A2 avoids it by using `today.stateFromOps()`, a Joe-shaped seeded state.
* **O2 — CLOSED, and it was overstated** (C5/F5, §7.4). The three `native-next-targets*`
  tests are **green inside `native-carriers-package.cjs --ci`** (child `focused`,
  `# pass 15`, `OBSERVED; exit 0 and exact declared verdict`) — re-run by the builder, by the
  reviewer and again here. What is true is narrower: they are **not runnable by a bare
  `node --test` without the gate's environment** (`EARNED_NATIVE_PACKET_ROOT` and a
  `test-support/import-engine/` tree). v1's "could not be run" is withdrawn.
* **O3 — CLOSED, and the claim it guarded is withdrawn** (C1/F1, §4.4, §8 M10). Identity
  across the engine seam is **unenforceable**, not merely untested: `engine-capture.cjs:52`
  clones the state before `genSession` sees it. The module no longer claims identity
  anywhere; what it claims and enforces is a **content digest + revision + unique Start key**
  inside a scoped window, and M10's remaining property (liveness) is killed by the committed
  digest cell. Two cells record the honest behaviour, including that a structurally equal,
  different object **is answered**.
* **O4 — `--full` was never reachable for this package id** (§10.2), so the standing
  `DECISIONS:97` BLOCKED-private line could not be produced for `B-NTC`. It was produced for
  the parent gate instead, which is a different statement.
* **O5 — no browser, no phone.** Nothing here was executed in a browser or on a device.
* **O6 — the upstream tip moved 34 commits during this pass** (top advisory). Zero files
  under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/workout`, `rebuild/m3/w6/host` or
  `rebuild/m3/w7-preview/today` differ, so the hunks apply unchanged, but the rebase and the
  parent re-pin are real work someone must do before merge. The independent reviewer
  re-measured the same at the newer tip `e9c50e1`: still 0 files.

**Opened by the review, carried forward (v1.1):**

* **O7 — the package's cells still have NO CI HOME** (review F9 / C9). `.github/workflows/rebuild.yml`
  runs no `rebuild/m4/workout/**` file, and `native-carriers-package.cjs`'s children do not
  include `native-trend-context.test.cjs`. B-NTC touches no `.github` file by design, so this
  is a PM item for the next re-seal — alongside `DECISIONS:105`'s remaining `# pass 19` item
  and the lockfile-only A1/A5 and fake-indexeddb today/gym suites.
* **O8 — `rebuild/conform/engines/build-engines.mjs` cannot run on Windows** (review F10):
  `ERR_UNSUPPORTED_ESM_URL_SCHEME`, because it hands a Windows path to `import()`. Pre-existing
  and not B-NTC's, but it is an invisible dependency of the 45/39 figure: anyone re-measuring
  the laws on this PC must copy the frozen bundles or port the script. Recorded so the next
  reviewer does not rediscover it.
* **O9 — two `packages/B-NTC.json` files now exist** — this package's (7 862 B) and the
  tooling branch's own at `477b025` (21 159 B). They will collide at merge. PM question Q2.
* **O10 — the gym card cannot PRINT a native previous performance** (§9.1 G7, **A2 custody**).
  With the corrected bind window the engine's own `card.prev` reaches `gym-model`, but
  `previousLine()` reads the LEGACY shape `{w, reps}` and a native `prev` is an
  `earned/performed-lift/v1` record. Found while measuring G6; not lane B's file, and named
  so it is not mistaken for a refusal of this package's.

---

**Status:** PROPOSED. Speculative until reviewed. No receipt, no execution, no product
acceptance and no merge follows from this document.
