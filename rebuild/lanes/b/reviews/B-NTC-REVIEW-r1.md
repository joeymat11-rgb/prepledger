# B-NTC — INDEPENDENT REVIEW r1 — **ACCEPT WITH CHANGES**

**Package:** B-NTC, the qualified `nativeTrendContext` provider — the PM-ruled FIRST lane-B
engine package and the S2 blocker (`DECISIONS:103` (1), `DECISIONS:102`).
**Under review:** `rebuild/lane-b-ntc` @ `68fbca41b50e8b5a20ffe1d15f25fc3d2eb399e9`
(base `12cfdb9d58fbcab10faacdaff8ef886ca79ab9c2`).
**Reviewer:** independent, blind. Did not write the package. Everything below was
**executed on the owner's Windows PC**, in a detached worktree
`…/work/lane-b/review-ntc` created for this review only. Builder claims were treated as
hypotheses and re-measured.

**VERDICT: ACCEPT WITH CHANGES.** The provider itself is sound: it fails closed on every
path I could drive, the engine is untouched, every gate I re-ran is green, and every sha256
the brief states is byte-exact. The required changes are **claims, not correctness** — plus
one design change to the not-yet-made gym-card wiring (H6), which must **not** land as
written. The most important finding: **B-NTC does not, on this tree, unblock S2 for the
athlete the gym card and `today-entry.mjs` actually use.** That athlete carries 28 recorded
sleep nights, and the shipped day reader correctly refuses. §9.1's delta cells are wrong,
and PM question Q1 is a *today* problem, not an A3 problem.

---

## 0. Findings, ranked

| # | finding | severity |
|---|---|---|
| **F1** | The "bound **by object identity** to the very facts object the engine is about to read" claim is **false about what is enforced**. The accepted adapter hands `genSession` a `structuredClone` (`rebuild/m4/workout/engine-capture.cjs:52`), so the engine never holds the bound object; and a structurally-equal-but-different object is **answered, not refused** (executed, §4 B1). What IS enforced — value correspondence + a LIVE revision/effective re-check + preparation scoping — is sound, but it is not identity. O3/M10 understates this: identity is **unenforceable at this seam**, not merely untested. | must fix — claims |
| **F2** | §9.1's gym-card delta cells **G1/G2/G3 are wrong and G5 is not delivered**. With H6 applied in a scratch copy the today suite is **123/123 UNCHANGED** and day 4 stays `blocked` / `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`, because `createTodayModel({}).stateFromOps()` — what `gym.test.mjs` AND `today-entry.mjs:26` both pass to `createGymHost` — carries **28 recorded sleep nights**, so `createEmptyHistoryDayFacts` refuses `recorded_sleep_unmapped` for every date. | must fix — claims + scope |
| **F3** | After H6, on a day the provider *does* open, `gym-model.readPrevious()` re-runs `genSession` **outside** the producer's bind window; it throws `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`/`resolver_failed` and `gym-model.mjs:136` swallows it, so the gym card silently shows **no previous performance** on exactly the days B-NTC unblocks (executed). Undisclosed delta; the H3c `finally{unbind()}` window is narrower than the host's engine-read surface. | must fix — H6 design |
| **F4** | Measured head figure is **23 tests / 23 pass** for the A0 journey + equivalence (16→17 journey steps + 5 equivalence + the suite, which node counts). `22/22` is the **base** figure (`DECISIONS:102`). Brief §7.3 and BUILD-REPORT §3.4b both state 22/22 at head. | must fix — small |
| **F5** | O2 is overstated. The three `native-next-targets*` tests **do run, green**, inside `native-carriers-package.cjs --ci` (child `focused`, `# pass 15`, `OBSERVED; exit 0 and exact declared verdict`) — re-run by me on this branch. They fail only a bare `node --test` without the gate's env. | must fix — small |
| **F6** | `rushedOf` returns on the **first** holder carrying an own `pace`, so `session.pace:'normal'` masks `session.record.pace:'rushed'` (executed). Latent — neither member exists on a native record today — but it is the one place the module reads a declaration and it reads only one of two places. | should fix — code |
| **F7** | `bind(null)` / `bind(undefined)` silently **unbinds** and returns `null` rather than refusing, while §4.1's rule table says `bind` "refuses anything that is not `earned/workout-facts/v1`". Fail-closed, but undocumented. | should fix — doc or code |
| **F8** | `packages/B-NTC.json`: its note says "`runnerSha256`, `brief.sha256` … stay null" while `brief.sha256` is (correctly) set at line 8; and `artifact.file` / `artifact.review` name `rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json` / `review-…json`, **neither of which exists** on this branch. BUILD-REPORT §2 also states 7 846 B for this file while disk says 7 862 B (the sha256 matches, so the byte count is the slip). | should fix — spec |
| **F9** | The package's own 22 cells have **no CI home**: `.github/workflows/rebuild.yml` at the upstream tip runs no `rebuild/m4/workout/**` file, and `native-carriers-package.cjs`'s children do not include the new test either. | PM item |
| **F10** | `rebuild/conform/engines/build-engines.mjs` cannot run on Windows (`ERR_UNSUPPORTED_ESM_URL_SCHEME`: `new URL(import.meta.url).pathname` + a Windows path handed to `import()`). Pre-existing, not B-NTC's — it is why the builder copied bundles from a sibling worktree (BUILD-REPORT §1.8). Recorded so the next reviewer does not rediscover it. | note — tooling |

**No fail-open was found.** Every enumerated failure path throws; nothing returns a value it
has not proven.

---

## 1. Scope — the 7 files, and the engine untouched (task item 1)

```
$ git -C <design-pin> fetch origin --prune
$ git -C <design-pin> worktree add --detach …/work/lane-b/review-ntc origin/rebuild/lane-b-ntc
HEAD is now at 68fbca4
$ git diff --name-status 12cfdb9 68fbca4
A  rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md
A  rebuild/lanes/b/BUILD-REPORT-B-NTC.md
A  rebuild/lanes/b/tooling/packages/B-NTC.json
M  rebuild/m3/w6/host/test/journey.test.mjs
M  rebuild/m3/w6/host/workout-host.mjs
A  rebuild/m4/workout/native-trend-context.cjs
A  rebuild/m4/workout/test/native-trend-context.test.cjs
 7 files changed, 1887 insertions(+)          ← ZERO deletions
$ git diff --name-only 12cfdb9 68fbca4 -- rebuild/engine   → (empty)
$ git merge-base --is-ancestor 12cfdb9 68fbca4             → exit 0
$ git log --oneline 12cfdb9..68fbca4                       → 1 commit
```

**Confirmed.** 7 files, 5 new + 2 additive edits, 1887 insertions and **0 deletions**.
Nothing under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `.github`, `src`,
`ledger`, `rebuild/m3/w7-preview`. `performed.cjs` on disk is
`2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a`, exactly as claimed.

**Upstream drift re-measured against the CURRENT tip `e9c50e1`** (newer than the `da63053`
the brief's advisory names):

```
$ git diff --name-only 12cfdb9 e9c50e1 -- rebuild/engine       → 0 files
$ git diff --name-only 12cfdb9 e9c50e1 -- rebuild/conform      → 0 files
$ git diff --name-only 12cfdb9 e9c50e1 -- rebuild/m4/workout   → 0 files
$ git diff --name-only 12cfdb9 e9c50e1 -- rebuild/m3/w6/host   → 0 files
$ git merge-base --is-ancestor 12cfdb9 e9c50e1                 → exit 0
```

The builder's claim holds at the newer tip as well, so every hunk and every line number in
the brief applies unchanged. Two upstream files that DO move and matter:
`rebuild/m4/spec/acceptance-native-carriers.json` (`295762f0…` → `e940359b…`,
`DECISIONS:104`) — the parent pin must be re-taken on rebase, which `packages/B-NTC.json`
already provides for — and `.github/workflows/rebuild.yml` (the CI re-seal,
`DECISIONS:105`), which B-NTC does not touch. Lane C's merged custody (`DECISIONS:106`) is
`rebuild/m3/w6/local/**`, `rebuild/m3/w6/test/**`, `rebuild/m3/setup/port/**`,
`rebuild/lanes/c/**` — **not** `rebuild/m3/w6/host/workout-host.mjs` — so B-NTC's host edit
collides with nothing merged.

**Every sha256 the package states, re-taken on disk — all byte-exact:**

| file | measured | bytes |
|---|---|---|
| `rebuild/m4/workout/native-trend-context.cjs` | `cf8b50955ad0dca5ff91e528ae0abc48611cebeadc586e2759ec0ec587c22356` | 12 375 ✓ |
| `rebuild/m4/workout/test/native-trend-context.test.cjs` | `f0879ca2b6d2fd65cb125d2d013e64efd89f236a4893dcec7245bf460dc52559` | 13 164 ✓ |
| `rebuild/m3/w6/host/workout-host.mjs` | `2d160c1c79fd7957febe964db523bc53dbb9a32fa571895f30e1a279a77fc480` | 13 409 ✓ |
| `rebuild/m3/w6/host/test/journey.test.mjs` | `d4c68645474eb8f6b4acbd252b35b9f0ca31225f6269fea53416a8c8a712af96` | 37 419 ✓ |
| `rebuild/engine/performed.cjs` | `2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a` | 19 479 ✓ |
| `rebuild/m4/spec/acceptance-native-carriers.json` | `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` | 15 286 ✓ |
| `rebuild/m4/workout/engine-runtime.cjs` | `9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23` | 3 947 ✓ |
| `rebuild/lanes/b/BRIEF-…md` | `0ba59cca3bd70383330fa59a4ae86a971108a64594933d5c6388bca6c45e16b8` | 56 010 = spec `brief.sha256` ✓ |
| `rebuild/lanes/b/tooling/packages/B-NTC.json` | `b0aec30912f67de1d88e174ab3be86c62ee68833d117d883cfb025ecf14601b4` | **7 862** (report says 7 846 — F8) |

The "20/20 parent-pinned product files byte-identical" claim is entailed by the diff: no file
under `rebuild/engine`, `rebuild/conform` or `rebuild/m4/spec` changed at all.

---

## 2. The provider, read line by line against the contract (task item 2)

`PERFORMED-ENGINE-v1.md:254` requires: *"Request binds actual Start, current factual source
revision and exact effective tuple; result must echo that binding and supply explicit
hard/rushed/debt booleans. Missing/mismatched context refuses with
PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED before a recommendation, never falling back to
absent legacy fields or caught exceptions interpreted as false."*

### 2.1 The shape the engine consumes — CORRECT

`performed.cjs:191-205` builds `{start_op_id, source_revision, effective}`, `structuredClone`s
the answer, and requires `start_op_id` / `source_revision` / own-key-count-and-every-key
`effective` equality plus `typeof answer[k]==='boolean'` for `hard|rushed|debt`. `resolve`
returns exactly `{start_op_id, source_revision, effective:{...effective}, hard, rushed, debt}`.
Extra keys would be tolerated by the engine but none are emitted. The `effective` echo is a
**copy**, so a consumer cannot reach back into the bound facts — proven by the package's own
cell and re-run here. **Shape: correct.**

### 2.2 "Binds by identity" — **NOT what is enforced (F1)**

Two executed facts:

* **B1a.** Bind facts object `F`; build the request the way `performed.cjs:196` does, but
  from `structuredClone(F)` — a structurally equal, **different** object. `resolve` **answers**:
  `{start_op_id:'op-dev-A-start-1', source_revision:7, effective:{…}, hard:false, rushed:false, debt:false}`.
  It does not throw. Identity is not tested anywhere in `resolve`.
* **B1b.** Driving the **accepted, unmodified** `rebuild/m4/workout/engine-capture.cjs`
  (`createEngineWorkoutCapture`) with a spy engine shows
  `genSession`'s `input.workoutFacts !== boundObject` and `deepEqual(input.workoutFacts, boundObject)`
  — i.e. `const input=copy(captureState)` at `engine-capture.cjs:52` (`copy = structuredClone`)
  means **the engine can never hold the object the host bound**. Identity across this seam is
  not merely untested; it is structurally impossible, because the request carries values only.

This does **not** make the provider unsafe. What the live reference genuinely buys is:
(i) **preparation scoping** — outside `workoutProducer`, `bound` is `null` and every request
refuses; (ii) **liveness** — because `bound` is the producer's own object rather than a
snapshot, a revision or `effective` that moves under the binding is caught. Both were
executed (B3, B3b, journey 17(c)/(d)). The **claim** must be corrected in four places:
brief §1.4 table row (1), §3 table row 1, §4.1 ("bind / unbind are the correspondence proof"),
§8 M10 / O3; plus the `native-trend-context.cjs` header under "(1) CORRESPONDENCE" and the
H3c comment in `workout-host.mjs` ("by identity, not by copy — so the resolver can prove that
what it answers about is what the engine is reading"). The honest sentence is: *the binding
holds a live reference to the producer's facts object; correspondence across the engine seam
is proved by VALUE — current revision, unique Start, whole effective tuple — because the
accepted adapter hands the engine a structuredClone.*

### 2.3 Revision / unique Start / effective re-checks — CORRECT, and live

* revision — `revision !== bound.source_revision`, strict (`'7'` refuses, executed);
  a revision that advances **after** binding refuses the in-flight request
  (`source_revision_mismatch`, executed B3), and the engine then reports
  `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`/`resolver_failed` (executed, real 12-module engine).
* unique Start — `matches.length !== 1`; absent → `start_not_in_bound_facts`, duplicated →
  `start_not_unique_in_bound_facts` (never resolved to the first). Executed both.
* effective — `sameEffective` compares own-key **count** and then every key by
  `Object.hasOwn` + `===`, i.e. the engine's own comparison run earlier and in the other
  direction. An extra member, a missing member or a changed `local_time` all refuse
  (`effective_tuple_mismatch`). Mutating a bound session's `effective` after binding refuses
  (executed B3b). Two distinct Starts on the **same** `local_date` each resolve to their own
  Start, and the cross product (Start 2's id with Start 1's tuple) refuses (executed B2/B2b).

### 2.4 `hard` / `debt` under the ENGINE's own predicates — no re-implementation, CONFIRMED

I located both predicates and read them: `dayWeather` at `rebuild/engine/sleep.cjs:1871-1890`
(its `hardSession` is `flags.some(f=>f.k==="event" && !f.pre)` at `:1889`, and the only
producer of a `k:"event"` flag is the `(s.events||[]).forEach` at `:1877`), and `cleanAtDate`
at `sleep.cjs:1017-1029` (`const nights=nightsBefore(s,iso); if(!nights.length) return true;`,
over `(((s||{}).sleep||{}).nights||[])`). The legacy branch of `liftTrend` calls exactly those
two at the row's date (`progression.cjs:702,704`), and the native row's date key is already
`effective.local_date` by the engine's own `rows.push({d,rec,source:'performed',start_op_id})`.

`native-trend-context.cjs` **does not call them and does not restate them.** Neither name
appears in the module; `createEmptyHistoryDayFacts` reads only `state.events` and
`state.sleep.nights` and returns the constant each predicate's own first lines give for an
EMPTY list, or refuses. I cross-checked the agreement by execution: for
`state.sleep = 'nonsense'` the module answers `debt:false` and the real engine's
`E.cleanAtDate({sleep:'nonsense'}, day)` returns `true` — they agree (bite B8). For a
non-array truthy `nights` the module refuses while the engine predicate would throw — refusing
is the stricter direction. **No copied second implementation. Confirmed.**

The injection-with-no-default is correctly forced: `engine-runtime.cjs:11`'s
`EXPOSED=['genSession','rirPlan']` is pinned by `native-carriers-witnesses.cjs:16`, so the two
readers genuinely cannot be obtained without reopening an accepted artifact. The module's
refusal to work around that is the right call.

### 2.5 `rushed` — correct in substance, one ordering hazard (F6)

`paceRushed` (`progression.cjs:544`) is `!!sl && sl.pace === PACE.rushed` — a test for an
athlete's affirmative declaration, written by `writers.cjs:401`. A native `session-close`
payload is closed to `['completion_kind'] ∈ {normal,early}` (`m4/workout/schema.cjs:112`), so
**no native session carries a pace member at all**, and `false` is `paceRushed`'s literal
value on such a record, not a guess about rest intervals. That reasoning is sound and I
verified the schema line.

* **label present** — `'rushed'` → `true`; `'normal'` / `null` → `false`. Executed both.
* **label absent** — `false`, i.e. the predicate's own value. Executed.
* **label unrecognised** — `'brisk'` → refuses `session_pace_unrecognised`. Executed. This is
  the forward guard the brief claims and it works.
* **F6, found here:** `rushedOf` loops `[session, session.record]` and **returns on the first
  holder with an own `pace`**. With `session.pace='normal'` and `session.record.pace='rushed'`
  the answer is `rushed:false` — the record's declaration is never read (executed B5).
  Neither member exists today, so this is latent, not live; but the module's whole claim is
  that it reads declarations, and here it reads only one of two possible places. Read both
  and refuse on disagreement, or state the precedence in the header.

### 2.6 Every unprovable path throws — ENUMERATED AND DRIVEN

I drove each named exit of `resolve` and recorded the outcome. **Fourteen paths, fourteen
throws, zero values:**

```
no_bound_source_facts            -> no_bound_source_facts
request_malformed (null)         -> request_malformed
request_malformed (array)        -> request_malformed
request_start_invalid ('  ')     -> request_start_invalid
source_revision_mismatch ('7')   -> source_revision_mismatch
start_not_in_bound_facts         -> start_not_in_bound_facts
start_not_unique_in_bound_facts  -> start_not_unique_in_bound_facts
effective_tuple_mismatch         -> effective_tuple_mismatch
session_local_date_invalid       -> session_local_date_invalid
day_facts_not_boolean ({1,0})    -> day_facts_not_boolean
session_pace_unrecognised        -> session_pace_unrecognised
recorded_events_unmapped         -> recorded_events_unmapped
recorded_sleep_unmapped          -> recorded_sleep_unmapped
```

`day_key_invalid` inside `createEmptyHistoryDayFacts` is **unreachable from `resolve`** (the
ISO check on `session.effective.local_date` runs first) — it is a defensive guard for a
direct caller, not a live path, and it is not a fail-open.

**One behavioural fact the PM should see stated plainly:** with the only day reader this
package ships, a qualified answer is **always** `{hard:false, rushed:false, debt:false}`.
That is a proof over an empty history, not a guess — but it means B-NTC's entire product
effect is "unblock the athlete who has recorded no event and no night". See §6 Q1.

### 2.7 Two smaller observations

* **F7** — `bind(undefined)`/`bind(null)` returns `null` and unbinds rather than refusing
  (executed B6). Fail-closed, but §4.1's rule table does not say so.
* `bound()` hands out the **live** bound object, not a copy (executed B7). Harmless inside
  the host, but it is a writable handle on the engine's input; worth a line in the header.

---

## 3. Execution — every command and its outcome (task item 3)

Environment: worktree `…/work/lane-b/review-ntc` @ `68fbca4`; node
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
**v24.19.0**; `npm ci --include=dev` (44 packages, exit 0). `fake-indexeddb` is **not** a root
dependency — the host/gym suites need the W6 workspace, so I also ran, with `NODE_ENV`
cleared (the F-G2 finding in `DECISIONS:105`):
`rebuild/m3/w6 $ npx pnpm@9 install --frozen-lockfile` (+ `@noble/ciphers 2.4.0`,
`@noble/hashes 2.2.0`, `esbuild 0.28.1`, `fake-indexeddb 6.2.5`, `playwright-core 1.62.1`) and
`rebuild/m3/w5 $ npx pnpm@9 install --frozen-lockfile --ignore-scripts --ignore-workspace`.
`git status --porcelain` clean after both.

| # | command | outcome |
|---|---|---|
| 3.1 | `node --test rebuild/m4/workout/test/native-trend-context.test.cjs` | **tests 22 · pass 22 · fail 0**, exit 0. Every cell name matches the brief's §7.2 table |
| 3.2 | `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **tests 23 · pass 23 · fail 0**, exit 0. Step 17 present and green; diagnostic printed: `day two: asked=1 prepared=undefined code=WORKOUT_PREPARATION_INVALID producer={"code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED","reason":"resolver_failed",…}`. **23, not 22** — `await t.test(` count is 16 at `12cfdb9` and 17 at `68fbca4`; + 5 equivalence + the suite node counts = 22 at base, 23 at head (**F4**) |
| 3.3 | `node --test rebuild/m3/w7-preview/today/test/{adapter.test.mjs,design.test.cjs,gym.test.mjs,package.test.cjs,view.test.mjs}` | **tests 123 · pass 123 · fail 0**, exit 0 — unchanged, as designed (the gym card is not wired) |
| 3.4 | `node rebuild/conform/engines/build-engines.mjs <root>` | **FAILS on Windows**, `ERR_UNSUPPORTED_ESM_URL_SCHEME` (**F10**). Reviewer-side port of the same script, same commits: `built main @ fe516c1 sha256=b6d031f628a08389bf0482b6501ce6a78a465b0e972cbd747f144247d97eebdd (814 759 B)`, `built old @ a0009c3 sha256=4d136c0fc405aea82557f80a6b1876451f61a871f5baf6a127558f12c8139d77 (793 874 B)`. (Different bytes from the builder's copied bundles — expected: an esbuild bundle's hash depends on the esbuild version and entry path, as `build-engines.mjs` itself says. `rebuild/conform/engines/` is gitignored; `git status` stayed clean.) |
| 3.5 | `node rebuild/conform/v4/run-defect-laws.cjs` | `TOTAL 45 laws · **45 RED-frozen** · **39 RED-candidate** · 89 GREEN repair controls · 97/104 mutant executions DETECTED · **0 HARNESS_ERROR** · AUDIT RED-FIRST FAIL`. **45/39 unmoved**, exactly the builder's line. (A first run before 3.4 gave `0 RED-frozen · 39 · 142 HARNESS_ERROR` — the absent bundle, the same artefact the builder recorded.) |
| 3.6 | `node rebuild/conform/run.cjs` on the candidate **and** on a fresh detached worktree at `12cfdb9` | 82 lines each; terminal line identical on both: `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`. `Compare-Object` shows exactly **one** differing row — `BAD 0 engine artifacts present (main + old)`, whose text embeds the **absolute worktree path**. Normalising that path: **IDENTICAL**. The census is byte-identical to base modulo the tree's own location. `rebuild/conform/run.cjs` itself is byte-identical (0 files changed under `rebuild/conform`). |
| 3.7 | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0…` then **13 children** each `OBSERVED; exit 0 and exact declared verdict` — `focused`, `browser-package`, `profile-refusals`, `traces`, `direct`, `legacy`, `witnesses`, `cases`, `source-carriers`, `inherited-carriers`, `defect-witnesses`, `writers-differential`, `second-gate` — terminating `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, **exit 0** (≈87 s) |
| 3.8 | reviewer's own bites (`bites.cjs`, §4) | **13 PASS · 0 FAIL · 4 INFO** |
| 3.9 | H6 in a **scratch** worktree at `68fbca4` (§5) | today suite **123/123 UNCHANGED**; `node rebuild/m3/w7-preview/today/build.mjs` → `A1 TODAY BUILD PASS`; `gym-check.mjs` → `NOT RUN — set W7_BROWSER_BIN` (not a pass) |
| 3.10 | scratch probes (§5) | seeded athlete → day 4 still blocked; nights/events emptied → day 4 opens and is conducted; `genSession` outside the bind window throws |

**Note on 3.7 vs O2 (F5):** the `focused` child of `--ci` **is**
`node --test … native-next-targets.test.cjs native-next-targets-assembly.test.cjs
native-next-targets-correction.test.cjs` asserting `# pass 15`
(`native-carriers-package.cjs:61-64`). It reported `OBSERVED; exit 0 and exact declared
verdict` on this branch, under my own re-run. So those three tests are **green inside the
gate**; they fail only a bare `node --test` that lacks the gate's environment. O2's "could
not be run / this brief claims nothing about them" should be corrected to that.

---

## 4. The reviewer's own bites — 13 PASS / 0 FAIL / 4 INFO

Written blind against the module and the real 12-module engine (the same list and order
`engine-runtime.cjs:9` composes). Not committed; `bites.cjs` lived outside the repo.

| bite | question | result |
|---|---|---|
| **B1a** | a structurally-equal but DIFFERENT facts object — does it throw? | **NO — it is answered.** Identity is not enforced (**F1**) |
| **B1b** | does the accepted adapter hand `genSession` the bound object? | **NO — a `structuredClone`.** `engine-capture.cjs:52`. Identity is unenforceable here (**F1**) |
| **B2** | two distinct Starts on the SAME `local_date` | both resolve, each to its own Start; the cross product refuses `effective_tuple_mismatch` |
| **B2b** | two Starts with the SAME `effective` tuple and day | both resolve separately — the Start id, not the tuple, is the key. Correct |
| **B3** | facts object whose `source_revision` advances AFTER binding | in-flight request refuses `source_revision_mismatch`; the real engine reading at the old revision gets `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`/`resolver_failed`. **Fails closed** |
| **B3b** | a bound session's `effective` mutated after binding | refuses `effective_tuple_mismatch`. **Fails closed** |
| **B4** | O1 — a clean-init athlete with a working load on one lift | `performedHistory` over a `w:null` state refused in its **order** branch with the trend resolver called **0 times**; the trend seam itself, driven directly, asks exactly once. Corroborates the builder's `asked=0` finding and journey 17's `db-bench.w = 35` |
| **B5** | `session.pace` vs `session.record.pace` | `'normal'` outside masks `'rushed'` on the record → `rushed:false` (**F6**) |
| **B6** | `bind(undefined)` / `bind(null)` | silently unbinds, returns `null`, later requests refuse `no_bound_source_facts` (**F7**) |
| **B7** | `bound()` | returns the **live** object, not a copy |
| **B8** | `state.sleep` of a non-object type | answers `debt:false`; the engine's own `cleanAtDate` on the same shape returns `true`. **They agree** |
| **B9** | a recorded event / a recorded night / absent members | `recorded_events_unmapped` / `recorded_sleep_unmapped` / the empty proof. Correct |
| **B10** | every enumerated failure path | 14 paths, 14 throws, **0 values** (§2.6) |

---

## 5. H6 — the gym-card wiring the builder did NOT make (task item 5)

Applied **in a scratch worktree only** (`…/Temp/ntc-review/h6-scratch`, detached at
`68fbca4`) exactly as brief §6 H6 specifies: the import swap, `const trendBinding =
createNativeTrendContextBinding({ dayFacts: createEmptyHistoryDayFacts({ state: engineState }) })`
above the `createEngineRuntime` call, `nativeTrendContext: trendBinding.resolve`, and
`nativeTrendBinding: trendBinding` on `composeWorkoutHost`. 5 insertions, 2 deletions,
1 file. **Not committed; nothing was applied to the branch under review.**

### 5.1 Is the one-line hunk correct? — *mechanically yes, but do not land it as written*

* It composes and runs. `node --test` over the five today test files: **123/123, exit 0**.
  `node rebuild/m3/w7-preview/today/build.mjs`: **`A1 TODAY BUILD PASS`** — so esbuild does
  resolve the named CJS import in the browser bundle.
* The relative path `../../../m4/workout/native-trend-context.cjs` is correct from
  `rebuild/m3/w7-preview/today/`.
* **Style defect.** The hunk uses **named** imports from a CommonJS module two lines above
  `gym-host.mjs`'s own comment: *"CommonJS collaborators are taken as DEFAULT imports, the
  way the accepted host entry (`host-entry.mjs`) takes them"* — every other CJS collaborator
  in the file (`Source`, `Capture`, `Commands`, `Adapter`, `History`, `SourceProjection`,
  `WorkoutBasis`) is a default import. It works today only because
  `module.exports = { … }` is an object literal `cjs-module-lexer` can read; a later
  refactor of that export would break the browser build silently. Use
  `import NativeTrend from '../../../m4/workout/native-trend-context.cjs';`.
* **Design defect (F3).** See 5.3.

### 5.2 Are the 3 A2 delta cells right? — **NO. Measured: zero cells flip (F2)**

With H6 applied the today suite is **123/123 UNCHANGED**, including
`gym.test.mjs:621` ("day 4 — the first wall"), `:639` ("every day after the wall stays
readable") and `:657` (`lastProducerRefusal().code`). A reviewer probe driven through the
same `createGymHost` + `createGymModel` the tests use:

```
seeded nights: 28   events: 0
day1 {"probe":"ready","closed":true,"settled":"finished","before":0,"after":6}
day2 {"probe":"ready","closed":true,"settled":"finished","before":6,"after":12}
day4 SEEDED -> {"phase":"blocked","code":"PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED",
                "copy":"resolver_failed","ops":12}
```

The cause, isolated directly:

```
createTodayModel({}).stateFromOps()  ->  events: array len 0 ;  sleep.nights: array len 28
createEmptyHistoryDayFacts({state}).('2026-09-07')
   ->  REFUSED  NATIVE_TREND_CONTEXT_UNQUALIFIED  recorded_sleep_unmapped
```

That state is `clone(basis)` from `today-model.cjs:134` and it is what
`gym.test.mjs` **and** the product's own `today-entry.mjs:26` pass to `createGymHost`. So
**G1, G2 and G3 do not flip, and G5 — "a fresh Joe trains day after day — the S2 milestone"
— is not delivered on this tree.** (G4 is correctly marked unchanged.) H6 applied to the
product today is a **no-op**: the provider refuses for the same reason, with the same code
and the same `copy`, as `createUnavailableNativeTrendContext`.

### 5.3 Where the mechanism DOES work — and what it silently costs (F3)

Same probe, same athlete, with `sleep.nights = []` and `events = []`:

```
day4 NO-NIGHTS -> {"phase":"ready","ops":12}
day4 previous-performance entries: 0    view.previous: null
day4 conducted:  {"probe":"ready","closed":true,"settled":"finished","before":12,"after":18}
```

The day **opens**, is Started, every set is logged and the session closes — ops 12 → 18. So
the provider and the H3c binding really do remove the wall; the blocker is the day reader's
scope, not the wiring. **But `previous` is empty**, and a second probe says why:

```
lastProjection present: true   native sessions in the reconstructed input: 2
genSession OUTSIDE the bind window THREW: PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED
                                 | reason: resolver_failed
```

`gym-model.readPrevious()` (`gym-model.mjs:128-136`) re-runs the accepted reader over the
reconstructed `lastProjection()` input **after** `workoutProducer` has returned — so the
H3c `finally { unbind() }` has already fired and `bound` is `null`. `genSession` throws and
`catch (_) { return previousByLift; }` swallows it. The gym card therefore shows **no
previous performance on exactly the days B-NTC unblocks**, silently. Nothing is invented, so
this is fail-safe — but it is a real loss of the A2 feature the reviewer of A2 specifically
proved ("previous performance = the same genSession input", `DECISIONS:102`), and §9.1 does
not name it.

**Judgment on H6:** correct in mechanism, wrong to land as written. Before it lands it needs
(a) the default-import form, (b) a bind window that covers every engine read over the same
facts within one host — not just `adapter.prepare` — or an explicit decision that
previous-performance goes dark on native days, and (c) §9.1 rewritten to the measured truth.

---

## 6. B-LOM — same seam? (task item 4) — **AGREE: NOT the same seam**

Verified against the source, not the brief. `createPerformed(E,{nativeTrendContext})`
(`performed.cjs:4`) takes **one** injected collaborator and it is the trend resolver.
`PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` is raised at `performed.cjs:176-183` inside
`performedHistory(s, chronology)`, from **data that must already be on the state** —
`s.workoutFacts.legacy_baseline` with `baseline.session_log !== s.sessionLog` (an identity
check *inside* the engine's own cloned state graph, which `structuredClone` preserves),
`baseline.source_generation_id`, `baseline.activation_op_id`, and `order.import_anchor`
agreeing with them. There is **no resolver** on that path. It is guarded by
`if (legacy.length)`, so it fires only for a state carrying a ported `sessionLog`, and it
fires on **every** read of `performedHistory` — before any trend question exists. My bite B4
walked into the order branch of `performedHistory` with the trend resolver called **0 times**,
which is the same axis from the other side.

Different function, different trigger, different producer (the authenticated import
controller vs. the host's per-preparation binding), different athlete (Joe after C2, i.e. S3,
vs. the fresh athlete at S2). **B-LOM is properly a separate package, sequenced after lane
C's C2/C2b port (`DECISIONS:106`).** The builder's §5 analysis is correct on all four axes.

---

## 7. Open items O1–O6 and PM questions Q1–Q4 — judged (task item 6)

### O1 — the clean-init athlete cannot reach the trend seam — **CONFIRMED, and material**
Every lift at `w: null` is a permanent DEBUT and a DEBUT never reaches `liftTrend`; the
resolver is asked 0 times and the day prepares. Step 17 therefore sets `db-bench.w = 35` from
the lift's own declared `steps`, and says so in the test and in a comment — that is the
honest way to do it. My bite B4 corroborates: over a `w:null` state the trend resolver is
never called, and the seam only answers when driven directly. **The disclosure is adequate;
the underlying question is not B-NTC's and is unowned: what writes `w` for a native athlete,
and when.** A2 side-steps it with `stateFromOps()`. PM must route it (A-lane or B-LOM
neighbourhood), because until it is answered nobody can say which real days hit this seam.

### O2 — the three `native-next-targets*` tests — **OVERSTATED, downgrade (F5)**
They run green inside `native-carriers-package.cjs --ci` (child `focused`, `# pass 15`),
which I re-ran on this branch: `OBSERVED; exit 0 and exact declared verdict`. Rewrite O2 as
"not runnable by a bare `node --test` without the gate's environment; green inside the gate".

### O3 — M10 not killed by a committed cell — **UNDERSTATED, upgrade (F1)**
The honest statement is stronger than "identity is claimed and only value equality is
tested". Identity **cannot** be enforced at this seam: `engine-capture.cjs:52` clones the
state before `genSession` sees it, so `bind(structuredClone(context.workoutFacts))` (M10) is
behaviourally indistinguishable from the real hunk **for correspondence**, and would only
lose the *liveness* property (a revision or tuple that moves under the binding). Restate O3
that way, add the cell that M10 *can* be killed by — mutate the bound object after `bind` and
assert the refusal (my B3/B3b are exactly that, and they pass) — and drop the identity claim.

### O4 — `--full` unreachable for this package id — **ACCEPT as stated**
`b-package.cjs` closes its list to `B1|B2|B3|B4`; `--full` refuses at the same usage guard
before the private-fixture check, so the standing `DECISIONS:97` BLOCKED-private line cannot
be produced for `B-NTC`. Honestly recorded. Tied to Q2.

### O5 — no browser, no phone — **ACCEPT, with one addition**
I ran no browser or device test either. One datum the brief does not have: with H6 applied in
scratch, `rebuild/m3/w7-preview/today/build.mjs` reports `A1 TODAY BUILD PASS` (3 assets, 84
pinned inputs, no network reference), so the bundle at least builds. `gym-check.mjs` reports
`NOT RUN — set W7_BROWSER_BIN`; that is not a pass and I do not report it as one.

### O6 — upstream moved — **VERIFIED and slightly out of date**
The tip is now `e9c50e1`, not `da63053`. I re-measured at `e9c50e1`: 0 files differ under
`rebuild/engine`, `rebuild/conform`, `rebuild/m4/workout`, `rebuild/m3/w6/host`. The rebase is
mechanical; the parent re-pin to `e940359b…` is real work and the spec already provides for
it. Add: `.github/workflows/rebuild.yml` also moved (the CI re-seal) and B-NTC touches it not
at all, so there is no conflict — and the A0 CI step is `node --test <files>` with **no
pinned count**, so step 17 does not break CI.

### Q1 — the day reader's boundary — **a CORRECT fail-closed scope, MIS-SEQUENCED (the judgment asked for)**

**It is not a B-NTC defect.** `createEmptyHistoryDayFacts` answers only where both engine
predicates are constant over an empty list, reads each constant off the predicate's own first
lines, and **refuses by name** everywhere else. That is "the coach that never guesses"
implemented exactly as written; journey step 17(e) and my bites B9/B8 prove the refusal is
honest and writes nothing, and B8 shows the module agreeing with the real `cleanAtDate` where
it does answer. Narrow scope honestly refused is the right shape.

**But the brief mis-sequences it, and that part IS a defect.** Q1 says the boundary "must be
closed before A3 ships sleep". Measured: the athlete the gym card and `today-entry.mjs`
already pass to `createGymHost` **today** has 28 recorded nights, so the reader already
refuses for every date, and B-NTC — the package ruled to be the S2 blocker — **does not move
the S2 milestone for the product's own athlete**. Q1 is therefore not a future A3 item; it is
the condition on B-NTC's own headline claim. The PM must be told that in those words.

Note also `DECISIONS:106` (d)/(c): lane C already routed a "`make-synthetic.cjs`
`sleep.nights` quirk → suite v4 item for the conform owner (lane B)". Whether the 28 nights
are a fixture artefact or the real S2 athlete's future shape is exactly the question that
decides whether Q1 is a one-line fixture change or the `EXPOSED` re-seal.

**Recommendation:** the PM's ruling on Q1 should come **before** B-NTC is sealed as the S2
unblocker, and should say which of these it is:
(a) `EXPOSED` gains `dayWeather` + `cleanAtDate` at the next re-seal (lane B's own
recommendation; needs `engine-runtime-host.cjs` mirrored and `engine-equivalence.test.cjs`
proving they agree) — the only option that closes it for a real athlete; or
(b) the S2 athlete genuinely starts with no nights and no events, and the 28 nights are a
preview fixture — in which case say so, and fix the fixture, and B-NTC's claim stands.
Restating the two predicates here stays forbidden by `PERFORMED-ENGINE-v1` §6.

### Q2 — the tooling runner's package list — **AGREE with lane B: (ii) plus (i)**
`b-package.cjs` refuses `B-NTC` by its two-mode usage guard, which is the runner behaving as
designed; widening a list whose bytes are pinned by every spec's `runnerSha256` is the tooling
owner's change. Accepting B-NTC on the evidence in §§1–5 above is reasonable *because* it has
no D-ID, moves no law and changes no `rebuild/engine` byte — so most of the closed-package
machinery has nothing to bind. Widen the list when the tooling PR lands.

### Q3 — `rushed` on a native session — **AGREE, with F6 attached**
`false` is `paceRushed`'s literal value on a record with no `pace` member, the schema closes
`session-close` to `completion_kind`, and the forward guard (`session_pace_unrecognised`)
works — I drove it. The alternative keeps S2 blocked for no gain in truth. **Condition:** fix
the `rushedOf` precedence (F6) before this reading is relied on, so that when the A-lane does
add a pace control the module cannot read the wrong one of two declarations.

### Q4 — custody of H6 — **do not land it yet; then the A2 builder, after lane C's one-store pass**
`DECISIONS:106` (b) grants lane C the gym-host licence for the local-era move, and lane C
will be rewriting the same `createGymHost` composition — landing H6 first guarantees a
collision. And H6 should not land at all until F2 and F3 are resolved: as written it is a
no-op for the product athlete and, for an athlete it does open, it silently drops previous
performance. Sequence: **Q1 ruling → F3 fix in `workout-host.mjs` (lane B, it is B-NTC's
hunk) → lane C's one-store pass → A2 builder lands H6 with the rewritten §9.1 cells.**

---

## 8. ACCEPT WITH CHANGES — the exact changes

**Required before the PM seals (C1–C5). None of them touches `rebuild/engine`,
`rebuild/conform`, `rebuild/m4/spec` or `.github`; C1 and C6–C7 are the only code edits.**

**C1 — stop claiming identity; claim what is enforced.** Rewrite, to the same effect, in six
places: brief §1.4 table row (1); §3 table row 1 ("passed **by identity** to
`binding.bind()`"); §4.1 ("`bind` / `unbind` are the correspondence proof"); §8 M10 + O3;
`rebuild/m4/workout/native-trend-context.cjs` header, the "(1) CORRESPONDENCE" paragraph
("identity, not a copy — so a stale, replayed or cross-generation request cannot be answered
at all"); and `rebuild/m3/w6/host/workout-host.mjs` H3c comment ("by identity, not by copy —
so the resolver can prove that what it answers about is what the engine is reading").
Replacement claim: *the binding holds a **live reference** to the producer's facts object,
which gives preparation scoping and a re-check against the object as it stands **now**;
correspondence across the engine seam is proved **by value** — current `source_revision`,
unique `start_op_id`, whole `effective` tuple — because the accepted adapter hands the engine
a `structuredClone` (`rebuild/m4/workout/engine-capture.cjs:52`).* Evidence to cite: a
structurally-equal, different object is answered, and the engine never holds the bound
object.

**C2 — rewrite §9.1 and the §0 headline to the measured truth.** State that
`createTodayModel({}).stateFromOps()` carries **28 recorded sleep nights**, that
`createEmptyHistoryDayFacts` therefore refuses `recorded_sleep_unmapped` for every date, and
that with H6 applied the today suite is **123/123 unchanged** with day 4 still
`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`/`resolver_failed`. G1/G2/G3 must be marked **not
observed**; G5 must not claim the S2 milestone until Q1 is ruled. §0's "makes day+3 of a
fresh athlete preparable" must be qualified with "…an athlete with no recorded event and no
recorded night".

**C3 — name the previous-performance delta, and fix or own the bind window.** Add the cell:
*after H6, on a day the provider opens, `gym-model.readPrevious()` re-runs `genSession`
outside the producer's bind window, the refusal is swallowed at `gym-model.mjs:136`, and the
card shows no previous performance.* Preferred fix, in B-NTC's own hunk: widen H3c so the
binding covers every engine read over the same facts within one host (e.g. bind alongside
`lastProjection` and unbind when the host closes, or expose `withFacts(facts, fn)` and let
`readPrevious` use it) — with a cell that proves `previous` is non-empty on the opened day.
If the PM prefers to leave it, §9.1 must say so explicitly and the A-lane must own it.

**C4 — correct the journey figure.** Brief §7.3 and BUILD-REPORT §3.4b: the measured head
figure is **23 tests / 23 pass**; `22/22` is the base figure (`DECISIONS:102`, and the
`await t.test(` count is 16 at base, 17 at head). Say both so no later reader thinks a test
vanished.

**C5 — correct O2 / §7.4.** The three `native-next-targets*` tests are green inside
`native-carriers-package.cjs --ci` (`focused`, `# pass 15`, OBSERVED, exit 0). Say "not
runnable by a bare `node --test` without the gate's environment", not "could not be run".

**Recommended (C6–C9).**

* **C6** — `rushedOf`: read **both** holders and refuse on disagreement, or state the
  precedence in the header. Add the cell: `session.pace:'normal'` + `record.pace:'rushed'`.
* **C7** — `bind(null|undefined)`: refuse, or document in §4.1 that it is the unbind alias.
  Also note in the header that `bound()` hands out the live object.
* **C8** — `packages/B-NTC.json`: the note contradicts the file (`brief.sha256` IS set);
  `artifact.file` / `artifact.review` name two files that do not exist on this branch;
  BUILD-REPORT §2 says 7 846 B where disk says 7 862 B (the sha256 matches, so the count is
  the slip).
* **C9** — give the package's 22 cells a CI home at the next re-seal (`DECISIONS:105`'s
  remaining `# pass 19` item), either as a `rebuild.yml` step or as a `--ci` child.

**Explicitly NOT required:** no change to `rebuild/engine`, no change to the census, no
D-ID, no law move, no `rebuild.yml` change inside this package, and **no rebase** beyond
re-taking the parent pin to `e940359b…`.

---

## 9. Residual risks

1. **The package's stated purpose is not met on the product's current athlete (F2).** If the
   PM seals B-NTC as "the S2 blocker, removed", the ledger will say something the tree does
   not do. Either rule Q1 first, or seal B-NTC as "the provider, qualified for a
   history-free athlete" and keep S2 open.
2. **Silent loss of previous performance (F3)** if H6 lands unchanged — fail-safe, but it
   removes a feature A2's own reviewer specifically proved, with no message on screen.
3. **The day reader is a constant-false answerer.** Every qualified answer this package can
   produce is `{hard:false, rushed:false, debt:false}`. That is proven, not guessed — but it
   means no trend-context *variation* is exercised anywhere in the product, so the engine's
   `hard`/`debt` branches for native rows remain untested by any real path.
4. **O1 is unowned.** Nothing in the product writes `w` back for a native athlete, so which
   real days reach this seam is still unknown. Step 17 sets it by hand and says so.
5. **The `.mjs` → `.cjs` named-import style in H6** works only while
   `module.exports = { … }` stays an object literal the CJS lexer can read.
6. **No browser, no device.** O5 stands; my only addition is that the bundle builds.
7. **`build-engines.mjs` is Windows-broken (F10)**, so any reviewer on this PC must either
   copy bundles or port the script — an invisible dependency of the 45/39 figure.

---

## 10. What the PM must rule

1. **Q1, before sealing.** Is the 28-night preview athlete the real S2 athlete? If yes,
   B-NTC does not unblock S2 and the `EXPOSED` re-seal (`dayWeather` + `cleanAtDate`) must be
   scheduled now. If no, fix the fixture and B-NTC's claim stands. This is the ruling the
   whole package hangs on.
2. **Whether to seal B-NTC now with C1–C5 applied**, or to hold it until Q1 is answered.
   My recommendation: **seal it now with C1–C5** — it is a real, honest, engine-untouched
   provider and holding it buys nothing — but seal it as *the provider*, and keep the S2
   milestone open until Q1.
3. **F3 / H6 custody (Q4).** Who widens the bind window, and who lands H6 — and confirm it
   waits for lane C's one-store pass.
4. **Q2** — widen `b-package.cjs`'s package list at the tooling re-review, and accept B-NTC
   on its own evidence meanwhile.
5. **Q3** — accept `rushed:false` for an undeclared native session, conditional on C6.
6. **C9** — a CI home for the 22 cells at the next re-seal.
7. **O1** — route "what writes `w` for a native athlete" to a lane.

---

## 11. Boundaries honoured

`ledger/` and `rebuild/conform/private` were **never opened**. No frozen law, witness, tool
or golden was edited. No other worktree was created, moved or removed except the two this
review made for itself (`…/Temp/ntc-review/base-tree` at `12cfdb9` and
`…/Temp/ntc-review/h6-scratch` at `68fbca4`, both removed after the run); the two
`$TMPDIR/earned-engine-wt/{main,old}` worktrees already stood at `fe516c1` / `a0009c3` and
were reused, not moved. `rebuild/conform/engines/` is gitignored. The H6 hunk and the two
reviewer probe files existed only in the scratch worktree and are **not** on this branch:
`git status --porcelain` in the review worktree lists nothing but this file.

**This review commits exactly one file: itself.**

---

**Reviewer:** lane-b-reviewer (independent, blind) · **r1** · verdict **ACCEPT WITH CHANGES**
(C1–C5 required; C6–C9 recommended; H6 not to be landed as written).
