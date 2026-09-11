# A0 — host composition, Dad's clean first run, one synthetic journey

Branch `rebuild/slice-a0`, rebased onto `rebuild/t2-client-core` @
`52a74b63fa0effd44a410a00204f789bdc74e5e6` (M2-NATIVE-CARRIERS merged, ledger
lines 96–97). Builder: cowork (Earned PM) · A0 builder. **Candidate, not
accepted.** An independent reviewer reviews this; nothing here is
self-accepted.

Node v24.19.0. Nothing installed, nothing purchased, no network use by any
test, no private folder or `src/history.js` read, no athlete data printed.
`rebuild/engine/*`, `rebuild/m4/workout/engine-runtime.cjs`,
`public-client.mjs`, `t2-stage.cjs`, `rebuild/client/*`,
`rebuild/authority/*`, `rebuild/m3/w5/crypto.cjs`, `build-browser.mjs`,
`reading-replay.cjs`, `schema.cjs`, every `rebuild/m4/spec` package and every
frozen law are **unchanged**. `git diff --stat 52a74b6..HEAD` is the whole
claim: A0 adds files, and modifies none.

---

## 0. Read this first — the engine-carrier blocker is GONE

The first two rounds of this report led with a blocker: candidate L's engine
carriers could not be written into `rebuild/engine`, because the then-current
M2-LOAD-WRITES profile asserted a closed engine file inventory. **B0 resolved
that.** `rebuild/engine` at `52a74b6` now carries `performed.cjs`,
`entered-load.cjs` and the five changed carriers at exactly the bytes candidate
L needs, sealed by the accepted M2-NATIVE-CARRIERS package. Everything that
blocker forced is now undone:

* The **scratch composition root is deleted.** `engine-root.cjs` and the six
  staged carrier copies under
  `rebuild/m4/spec/native-next-target-candidate/engine/` are gone (−7,062
  lines). The journey test now composes the accepted runtime straight off disk.
  Keeping duplicate carrier bytes beside the real ones would only be a drift
  hazard.
* The **phone page now carries a real engine.** `build-host.mjs` reports
  **91 pinned inputs including all 13 engine modules**, with no `seed.cjs`,
  `migrate.cjs`, `merge.cjs`, `engine/index.cjs`, `rebuild/engine/test/*`,
  `rebuild/authority/*` (beyond `canonical.cjs`), `rebuild/m3/w5/crypto.cjs`
  or `rebuild/m4/import/*`.
* **`engine-runtime.cjs` is back at its accepted bytes**
  (`9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23`) and A0
  no longer modifies it — see §4.

One thing the merge does *not* fix, and it is not A0's:
`rebuild/m4/workout/test/native-next-targets*.test.cjs` still fail 3/3, now
with `Cannot find module '.../test-support/import-engine/...'` and
`Provide the immutable packet root explicitly (EARNED_NATIVE_PACKET_ROOT)`.
Those three files are **byte-identical to the tip** (they do not appear in
`git diff 52a74b6..HEAD` at all) and need an external packet root that does not
exist in this worktree. That is an upstream harness/environment matter, not a
regression introduced here.

---

## 0b. Review round 1 — what changed after `A0-HOST-ASSEMBLY-REVIEW.md`

The independent review returned **CHANGES** on
`db5e986814bbec634474970e5b089de1d5e746e9`
(`WORKOUT-EDIT-SEMANTICS-01/A0-HOST-ASSEMBLY-REVIEW.md`). Applied exactly, as
new commits, nothing else touched:

* **R1 (consequential) — the fallback-week bypass was conditional.** The
  reviewer's probe P1 showed that with `split.from` one day *after* the host
  day, `createCleanInitState` accepts the state and `prepareWorkout` serves the
  fallback's Friday-L. Fixed at the seam that has both the state and the day:
  `workoutProducer` in `workout-host.mjs` now refuses
  `WORKOUT_SPLIT_NOT_IN_FORCE` on every preparation whose day no split entry
  covers, before anything is registered or stored. P1 is journey step 15, and a
  negative control (guard line removed) shows step 15 fails without it. The
  overclaiming comment in `athlete-state.cjs` is rewritten to say exactly what
  that file does and does not guarantee.
* **R2 (honesty) — invented vocabulary.** `plan.mode: 'bodycomp'` is removed;
  no engine reader reads `plan.mode`. `v: 60` is now `SCHEMA_V`, cited to
  `rebuild/engine/constants.cjs:9`. `plan.autonomy: 'propose'` is kept as the
  engine's own most-supervised floor and is now documented as a deliberate
  policy floor rather than implied to be an empty value, cited to
  `constants.cjs:270` and `migrate.cjs:944`. Journey step 16 asserts both
  literals against the engine's own values, so a drift fails a test.
* **Hygiene.** `materializeEngineRoot()` now registers a `process.on('exit')`
  removal for its `mkdtemp` directory and returns a `cleanup()`; verified a
  journey run now leaves **0** `earned-native-engine-*` directories in `%TEMP%`
  (was 9 — those 9, plus 2 stray `a0-probe-*` directories from my own probe,
  were deleted). `rebuild/m3/w6/host/.tmp/` was **already** ignored:
  `git check-ignore -v` reports `rebuild/m3/w6/.gitignore:2:.tmp/`, so no
  `.gitignore` change was needed.

Round 1's other conclusions were superseded by the B0 merge; see §0 and §4.

---

## 0c. Integration round — rebased onto the merged tip

Rebased `rebuild/slice-a0` onto `rebuild/t2-client-core` @ `52a74b6`. Git
dropped A0's L-adoption commit as *"patch contents already upstream"* (§7).
The one conflict the PM predicted — add/add on `engine-runtime.cjs` — is
resolved **in favour of the tip's accepted bytes**, and A0's literal-require
composition moved to a new host-owned module:

* `rebuild/m4/workout/engine-runtime.cjs` → restored to `9be21897…`; A0 no
  longer touches it.
* `rebuild/m3/w6/host/engine-runtime-host.cjs` → **new**, twelve literal
  requires, same modules/order/contract, esbuild rationale in its header (§4).
* `host-entry.mjs` (now exports `EngineRuntime`), `build-host.mjs` (whitelists
  the thirteen engine inputs and refuses `engine-runtime.cjs` by name) and
  `esbuild-probe.mjs` (now builds **both** and reports the contrast) point at
  it.
* `rebuild/m3/w6/host/test/engine-equivalence.test.cjs` → **new**, 5/5, the
  drift guard between the two.
* `rebuild/m3/w6/host/test/journey-fixture.cjs` → **new**; the synthetic
  athlete and day moved here so the journey and the equivalence test share one
  definition instead of two copies.
* `engine-root.cjs` and the six staged carrier copies → **deleted** (§0).

---

## 1. What was built

Every file below is **added** by A0. A0 modifies no file that exists at
`52a74b6`.

| file | sha256 |
|---|---|
| `rebuild/m3/w6/host/workout-host.mjs` | `7943b184801a99ca3ced1cfb304108936c4ef9e6d5c9ceeff4989c5b1e92091a` |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` | `114411b1a075c2354eccb552b5855007d06a1a3fe788b5ae0991a6eb3d08309e` |
| `rebuild/m3/w6/host/host-entry.mjs` | `627aa3a7081e6e0fd7b1f833848a4fdeb883f2fea93c513c02010af0401a365c` |
| `rebuild/m3/w6/host/index.html` | `5dbef56656fbf91fdaf6ab091963878e606d89103df197f87c678d284f6cb370` |
| `rebuild/m3/w6/host/build-host.mjs` | `fa33de689c9f0579e69c2a5fd72697fffe0294efc4fcd90e0c9971eaf72c14bf` |
| `rebuild/m3/w6/host/esbuild-probe.mjs` | `70be6f08685c177856df200f3187cd68738f03c5cc5553f25e8289f59a3eb668` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | `9d448bb956bae9464a3322286a42fcb8c6dbac315391da92c6853fc7c0109681` |
| `rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | `f209f0ac4f2531ba7704730275d7a7538895d9e1e7b005347582b2f7842a22ee` |
| `rebuild/m3/w6/host/test/journey-fixture.cjs` | `cbca2b7721bb2291691d7bd74bc568493d0b5b10f0bcb3e6dec34f5e4736cba4` |
| `rebuild/m4/workout/athlete-state.cjs` | `dccc5fb5d35de12652f70e2d12c3e0e156181a8fe93b53cd296ddc52fa56f06c` |
| `rebuild/m4/workout/workout-basis.cjs` | `e4ed838ae212a277c6922373cea66109a3332a5f250285d47165ad282c1aa664` |
| `rebuild/m4/workout/resume-policy.cjs` | `7c11a07ae5bb5d114447ad06f52d95537d83fef012cc78d47e19664e9925395f` |
| `rebuild/slice/A0-REPORT.md` | this file |

`rebuild/m4/workout/engine-runtime.cjs` stays at the accepted
`9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23`. Journey
step 14 asserts that hash, so a future edit to it fails a test here as well as
failing the engine package's own pins.

### Dad's clean first run — `athlete-state.cjs`

`createCleanInitState({setup})` builds the engine state field by field from an
explicit per-athlete document. It **imports nothing from `rebuild/engine`** —
no `seed.cjs`, `migrate.cjs`, `merge.cjs` or `index.cjs` — and performs no
seed, import, merge or migration. Every member is either copied from `setup`
or the empty value of that member. There is no default lift, no default load,
no default week, and nothing of Joe's.

* **`split` is required, and it must be in force on the day.**
  `rebuild/engine/plan.cjs` `dayType(iso, s)` picks the last split entry whose
  `from <= iso` and, finding none, falls back to a fixed Mon/Thu = U,
  Tue/Fri = L, Wed = REFEED week. That is one athlete's week.
  `createCleanInitState` requires a well-formed split, but it has **no clock**,
  so that alone is not enough: a split whose `from` is still in the future is
  well formed and would leave `dayType` on the fallback for today (**review R1
  / probe P1**). The guard that closes it needs both the state and the day and
  therefore lives at the only seam that has both — `workoutProducer` in
  `workout-host.mjs`, which refuses **`WORKOUT_SPLIT_NOT_IN_FORCE`** on every
  preparation whose day no split entry covers, before anything is registered
  or stored. It runs per preparation, not once at construction, because the
  clock moves. Journey step 15 is probe P1 and shows both halves: unguarded
  the engine really does serve the fallback's Friday-L (`['leg-press']`), and
  the host refuses and stores nothing. The journey test's day (2026-09-04, a
  Friday) is chosen so the fallback and this athlete's split **disagree**.
* **Every exercise starts `w: null`,** so `today.cjs` takes the DEBUT path:
  `baselineAsk: true`, all targets 0, and the "DEBUT — find the working
  weight" note, which the adapter renders as "Find a working load" /
  "Record the reps performed" with **no numeric prescription**. No starting
  load is invented.
* **Real equipment facts are supplied inputs:** per-exercise `inc` (the step)
  and `steps` (the ascending rung list — the member `writers.cjs` itself
  maintains via `loadRungs`). Both are required; neither is derived.
* **Priority muscles** are carried verbatim as `state.priority_muscles`.
  Disclosed honestly: a content search of `rebuild/engine` found **no reader
  on the `genSession`/`rirPlan` path that consumes them**. They are carried
  with the athlete's state, not acted on. Nothing was invented to consume them.
* **Two literals are the engine's own, and they are cited and cross-checked**
  (**review R2**). `v: SCHEMA_V` is `rebuild/engine/constants.cjs:9`
  `const SCHEMA_V = 60;` — the engine's schema tag. `plan.autonomy: 'propose'`
  is the engine's most-supervised level and its own default
  (`constants.cjs:270` `AUTONOMY_LEVELS = ["propose","autonotice","runit"]`;
  `migrate.cjs:944` "default: most supervised (never auto-promote)"); it is
  written deliberately as the floor, is not taken from `setup` because nothing
  yet lets an athlete raise it, and the header says so rather than pretending
  it is an empty value. Both are repeated as literals so the file keeps its
  "no `rebuild/engine` import" property, and **journey step 16 asserts they
  equal the engine's own values**, so a drift is a test failure, never a
  silent divergence. `plan.mode: 'bodycomp'` has been **removed**: it was
  invented vocabulary — no engine reader reads `plan.mode` (`energy.cjs` reads
  `plan.apMode`).
* Which members the readers actually touch was **measured**, not assumed: with
  every other member deleted in turn, only `exercises` and `queue` are
  structurally required for `genSession` on a clean-init state.

Where `setup` durably lives is **still an open design point** — nothing in the
retained generation stores a native athlete profile. In A0 it is host
configuration, labelled `synthetic-test-identity`.

### The host — `workout-host.mjs`

`composeWorkoutHost({...})` is **binding only**. Every collaborator is
injected; a missing one throws a `TypeError` naming it. It constructs no engine
rule, no capture format, no identity, no state, and **no fallback provider**.
It wires exactly what the accepted fixture (`native-next-target-candidate/
fixture.cjs` `durable()`) wires: supplied state → L's null-lane registrar →
the composite source-projection reader → the engine capture adapter →
`workoutProducer` + `workoutResumePolicy` → `createDurablePublicClient`
(`schemaVersion: 2`, v2 capture profile), with the engine history projector
behind `projectWorkoutHistory`. The producer never hands the adapter a state of
its own: it registers the supplied state and the adapter consumes **only** the
registered projection.

---

## 2. Providers table

| provider | status | what it actually is |
|---|---|---|
| repository (real browser/`fake-indexeddb` IndexedDB, AES-GCM) | **real** | `rebuild/m3/w6/repository.mjs`, untouched |
| T2 stage, durable public client, bridge | **real** | untouched |
| v2 prescription capture (`SOURCE_PROFILE` + source codec) | **real** | `capture.cjs` + `rebuild/m3/w5/source/codec.cjs` |
| null-lane registrar + composite reader | **real (adopted L)** | `source-projection.cjs` at `fecb0447…` |
| engine capture adapter, engine history projector | **real** | `engine-capture.cjs`, `engine-history.cjs`, untouched |
| engine runtime (`genSession`, `rirPlan`) | **real (adopted L), NOT bundleable here** | `engine-runtime.cjs` over a materialised carrier root; §0 |
| clean-init engine state | **real product code** | `athlete-state.cjs` |
| `resolveWorkoutBasis`, null lane | **real** | codec's empty accepted prefix, computed through the codec; refuses any non-zero-import generation before the registrar would |
| `workoutResumePolicy` | **real** | re-runs the host's own producer; adds nothing beyond the three fields the client checks |
| `projectWorkoutHistory` | **real** | `createEngineHistoryProjector` + `adapter.readLayout` |
| `resolveWorkoutBasis`, **string lane** | **honest refusal** | `SOURCE_WORKOUT_BASIS_UNAVAILABLE` — needs an assembled recovery handle over the R1 runtime |
| `nativeTrendContext` | **honest refusal** | `NATIVE_TREND_CONTEXT_UNAVAILABLE`; `performed.cjs` contains it as `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed` |
| `plan_basis` / `input_basis` vocabulary | **missing, labelled** | no product vocabulary exists; the host requires explicit labels and carries them (`NO_ACCEPTED_PLAN`, `native-only/zero-import`) |
| durable per-athlete `setup` storage | **missing** | named follow-on |
| identity, signing key, lease, observation/currentness guards | **synthetic, labelled** | `synthetic-test-identity`; issuance, admission and currentness are not exercised |

---

## 3. The journey test — `rebuild/m3/w6/host/test/journey.test.mjs`

`node --test rebuild/m3/w6/host/test/journey.test.mjs` → **17 / 17 pass, 0 fail.**

| # | step | result |
|---|---|---|
| 1 | clean-init state: own split, `w:null` lifts, no history, frozen | PASS |
| 2 | clean-init **refuses** (no split / no exercises / no priority muscles / no `steps` / a preset load) | PASS |
| 3 | `composeWorkoutHost` refuses 10 named missing providers; refuses a v1 capture profile | PASS |
| 4 | open today's workout — 5 DEBUT slots, "Find a working load", no numeric target | PASS |
| 5 | the stored Start carries the **null-lane empty-prefix `source_basis`** (`W:0`, `selection_id:null`) | PASS |
| 6 | record 3 sets, one with **no effort recorded** (unknown, not guessed) | PASS |
| 7 | close the app and **RELAUNCH** over the same encrypted store — no write, Start byte-identical | PASS |
| 8 | **resume the same session** — one Start only, historical instructions unchanged, 3 sets recovered, 2 more logged through the resumed handle | PASS |
| 9 | finish — 1 Start, 5 Sets, 1 normal Close | PASS |
| 10 | reopen history on a fresh client — repeated reads byte-identical, reading writes nothing | PASS |
| 11 | one correction — original operation unchanged, original/current both visible | PASS |
| 12 | next-target capture produced, started, saved, reopened byte-identically; second session visible | PASS |
| 13 | the unavailable providers refuse explicitly and **store nothing** (string-lane basis; native trend context; a non-zero-import generation; a string claim with no string lane) | PASS |
| 14 | the engine the journey ran is the **accepted** `engine-runtime.cjs` at `9be21897…`, unmodified; the host mirror is at its own pinned hash; both name the same twelve modules | PASS |
| 15 | **(review R1 / probe P1)** a split whose `from` is one day after the host day: the state is accepted and the engine unguarded really serves the fallback's Friday-L (`['leg-press']`); the host refuses `WORKOUT_SPLIT_NOT_IN_FORCE` and **stores nothing**; the same split, once in force, is served normally | PASS |
| 16 | **(review R2)** `v` equals the engine's `SCHEMA_V` and the autonomy floor equals `AUTONOMY_LEVELS[0]`, read from the engine itself; `plan` has exactly one key and no `mode` | PASS |

Step 15 runs on its own clean store so it depends on nothing the journey left
behind.

**Negative controls** (run, then reverted — the files are back at their
committed bytes):

* moving this athlete's own U day off Friday so the state is invalid →
  `CLEAN_INIT_SPLIT_REQUIRED`, journey fails.
* swapping Friday to L (a valid state that agrees with the Joe-shaped
  fallback) → step 4 reads `['leg-press']` and **11 of 15 fail**. So the "which
  lifts appear" assertions genuinely discriminate the athlete's own split from
  the fallback week; they are not vacuous.
* **removing the R1 guard line** from `workoutProducer` → step 15 fails
  (**15 pass / 2 fail**). The guard is load-bearing, and step 15 is not
  vacuous.

Not done: no mutation campaign against the host or the providers beyond these
three controls.

---

## 4. Why the host owns its own runtime module

The L2 brief §4.2 flagged `engine-runtime.cjs`'s non-literal
`require('../../engine/' + name + '.cjs')` as a suspected bundling problem and
marked it UNVERIFIED. It is verified, and it is worse than suspected: esbuild
cannot resolve a require whose argument is an expression, so it treats the path
as a **glob** and pulls in *every* file under `rebuild/engine` — all twenty
Node-only `rebuild/engine/test/*` harnesses, and by the same expansion
`seed.cjs`, `migrate.cjs`, `merge.cjs` and `index.cjs`, which carry or reach
one athlete's personal history and must never enter the phone bundle.

`engine-runtime.cjs`'s bytes are **pinned by the accepted M2-NATIVE-CARRIERS
package**, so the fix cannot live there without re-sealing that package. It
lives in a host-owned mirror instead:
**`rebuild/m3/w6/host/engine-runtime-host.cjs`** — the same twelve modules in
the same order, the same `createEngineRuntime` contract, the same withheld
`HISTORY`/`ROLLUPS` providers, expressed with twelve **literal** requires. It
imports nothing from `engine-runtime.cjs`: doing so would drag the glob back
into the graph and undo the point.

Measured side by side with the real build
(`node rebuild/m3/w6/host/esbuild-probe.mjs`):

| entry | result |
|---|---|
| `rebuild/m4/workout/engine-runtime.cjs` (accepted) | **BUILD FAILED** — 62 esbuild errors across 21 files, **20 of them `rebuild/engine/test/*`** |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` (host) | **BUILT** — 15 pinned inputs, **13 from `rebuild/engine`**: exactly the twelve named modules plus `entered-load.cjs`, which `performed.cjs` requires |

**Two files that must behave identically are a drift hazard**, so the thing
that makes the duplication safe is
`rebuild/m3/w6/host/test/engine-equivalence.test.cjs` (**5/5 pass**): same
`MODULES` list *and order* (checked position by position, because the factories
are applied in sequence onto one table and a permutation would compose a
different engine while passing a set compare), same `EXPOSED` names, the same
`ENGINE_RUNTIME_*_PROVIDER_REQUIRED` refusals from both absent providers, the
same argument refusals, and **identical `genSession` / `rirPlan` output** on the
journey fixture across three days (the U day, and two the split calls REST). A
fifth case asserts a session really is produced on the journey day, so the
comparison is never two `null`s agreeing.

`build-host.mjs` also refuses `engine-runtime.cjs` by name in the page graph,
and now whitelists exactly those thirteen engine modules — an unexpected
fourteenth fails the build.

---

## 5. Browser status

* **Host page bundle** — `node rebuild/m3/w6/host/build-host.mjs` →
  **PASS, 91 pinned inputs**, now including **all 13 engine modules** the host
  runtime names. No `seed.cjs` / `migrate.cjs` / `merge.cjs` /
  `engine/index.cjs`, no `rebuild/engine/test/*`, no `rebuild/authority/*`
  beyond `canonical.cjs`, no `rebuild/m3/w5/crypto.cjs`, no
  `rebuild/m4/import/*`, and no `rebuild/m4/workout/engine-runtime.cjs`.
  `build-browser.mjs` is unchanged; the entry is passed to it as an ordinary
  `entryPoints` value. The page can now obtain a real engine —
  `host-entry.mjs` exports it as `EngineRuntime`.
* **Browser journey — still NOT RUN,** but for only ONE reason now, and it is
  not A0's: the retained Chromium harness is broken in this environment.
  `node rebuild/m3/w6/test/browser-check.mjs` with
  `W6_BROWSER_BIN=C:\Users\joeym\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe`
  fails with the exact error
  `page.evaluate: TypeError: Failed to fetch dynamically imported module:
  http://127.0.0.1:<port>/repository.mjs`.
  Chromium launches fine (`151.0.7922.34`). **Control:** the identical failure
  occurs in the untouched retained W6 worktree
  (`work/m3-w6-browser-bridge`), so it is pre-existing and environmental, not
  caused by this branch. Nothing was installed to work around it. With the
  bundle blocker gone, fixing that harness is now the only thing between here
  and a real in-browser run of this journey.

---

## 6. Commands and totals

All at the integrated head, on the PC, from the rebased worktree:

| command | result |
|---|---|
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`**, exit 0 — the B0 pins are intact |
| `node rebuild/m3/w6/test/run-current-head.cjs . --all` | **435 pass / 0 fail**, exit 0 |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs` | **17 pass / 0 fail** |
| `node --test rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **5 pass / 0 fail** (new) |
| `node rebuild/m3/w6/host/build-host.mjs` | **PASS, 91 pinned inputs, 13 engine modules**, nothing forbidden |
| `node rebuild/m3/w6/host/esbuild-probe.mjs` | accepted runtime **BUILD FAILED** 62 errors / 21 files (20 under `engine/test/`); host runtime **BUILT**, 15 inputs, 13 engine (§4) |
| `node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` | 0 pass / 3 fail — `Cannot find module '.../test-support/import-engine/...'` and `EARNED_NATIVE_PACKET_ROOT` missing. **Byte-identical to the tip**; upstream harness/environment, not A0 (§0) |
| `node rebuild/m3/w6/test/browser-check.mjs` | FAIL (environmental, pre-existing — §5) |

Earlier rounds, for continuity: `run-current-head --all` was 435/435 before and
after A0's original work on `189523b`, and the then-relevant
`load-write-package.cjs --ci` passed before and after. On this integrated head
the engine package's gate is `native-carriers-package.cjs --ci`, above.

Note on the runner: `run-current-head.cjs` takes a retained-R1 repository as
`argv[2]`. In the **joined** tree the composition root is the tree itself; with
the separate R1 worktree it refuses at its own gate
(`Shared edit candidate source differs: rebuild/m4/workout/schema.cjs`, because
the joined tree's `schema.cjs` `9d18cce9…` matches the pin but not R1's
`6038b32e…`). That is a property of the joined tree at `189523b`, not of this
branch; both baseline and after-runs used the joined tree as `argv[2]`.

---

## 7. L adoption — now upstream, nothing left to adopt

A0's first commit adopted nine candidate-L files byte-for-byte, because they
were not yet in the tree. **B0 landed all of them**, so on the rebase onto
`52a74b6` git dropped that commit with *"patch contents already upstream"* —
the strongest possible confirmation that A0's copies were byte-identical to
what was accepted.

Nothing under `rebuild/m4/workout/test/`,
`rebuild/m4/spec/native-next-target-candidate/`,
`rebuild/m4/workout/source-projection.cjs` or
`rebuild/m4/workout/engine-runtime.cjs` now appears in
`git diff 52a74b6..HEAD`. The six carrier copies A0 had staged under
`native-next-target-candidate/engine/`, and the `engine-root.cjs` that
assembled them into a scratch root, are **deleted** (−7,062 lines): the real
carriers are in `rebuild/engine` and duplicating their bytes would only invite
drift.

---

## 8. LIMITS — in plain language

1. **The engine composition is duplicated in two files.**
   `rebuild/m3/w6/host/engine-runtime-host.cjs` restates what
   `rebuild/m4/workout/engine-runtime.cjs` composes, because the accepted file
   cannot be bundled and cannot be changed (§4). `engine-equivalence.test.cjs`
   is what keeps them honest; there is no compiler-level guarantee. If the
   engine ever gains or loses a module, **both** files must change and that
   test will say so.
2. **The three `native-next-targets*` tests do not pass in this worktree.**
   They are byte-identical to the tip and need `EARNED_NATIVE_PACKET_ROOT` and
   a `test-support/import-engine/` tree that does not exist here. Not A0's, but
   it means A0 has *not* re-proven candidate L's own behaviour — that was
   proven under L and under B0.
3. **The phone page has never actually been opened.** It bundles (91 inputs,
   full engine, nothing forbidden), but the Chromium harness is broken here
   (§5), so no browser has executed this page. "Builds" is not "runs".
4. **The string lane (Joe's imported history) is deferred.** `source_basis` for
   an activated source needs an assembled recovery handle over the R1 runtime
   plus hosted sync; the host refuses explicitly rather than claiming one. It
   is not exercised at all here.
5. **`nativeTrendContext` is a refusal, not an implementation.** No numeric
   trend is produced for native sessions. That is chunk 2. In the journey the
   second prepare did not reach `liftTrend`, so the containment path
   (`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`) was **not** exercised end to end
   — only the resolver's own refusal was.
6. **Currentness, issuance and admission are not exercised.** No signed lease
   issuance, no authority admission, no frontier verification, no receipts
   beyond the synthetic scaffolding. `observationGuard`, `isCurrentSession`,
   `observationEpoch` and `validateCommit` are the labelled synthetic ones.
7. **N175-1 and N175-2 are unchanged.** The client still does not verify the
   frontier it stores; the null-lane resolver is honest because its claim is
   fully determined by the codec, not because anything verifies it.
8. **`plan_basis` / `input_basis` have no product vocabulary.** They are host
   labels. Named open question.
9. **Where a per-athlete `setup` durably lives is unresolved.** Here it is host
   configuration labelled `synthetic-test-identity`.
10. **Priority muscles are carried, not used.** No engine reader on the
    prescription path consumes them today.
11. **The browser journey was never run** (§5) — two independent blockers, one
    of them pre-existing in the retained harness and reproduced on the
    untouched W6 worktree as a control.
12. **No mutation campaign** beyond the two negative controls in §3. The engine
    behaviour itself (targets, effort plan, progression) is candidate L's,
    reviewed there, not re-litigated here.
13. **One athlete, one day, one split shape.** The journey exercises a single
    U day for a single synthetic athlete. Multi-day, REST-day, REFEED,
    retirement, queue/debut-move and skip paths are untested by this test.
14. **The R1 guard is a host guard, not an engine fix.** The Joe-shaped
    fallback week still lives in `rebuild/engine/plan.cjs` and is still
    reachable by any other caller that hands the engine a state whose split is
    not in force. A0 only makes it unreachable *from this host*. Removing or
    gating the fallback in the engine is B0 / candidate-L owner territory.
15. **The clean-init constructor still has no clock**, by design, so it cannot
    itself refuse a future-dated split. Anything that builds a state and calls
    the engine without going through `composeWorkoutHost` gets no R1
    protection.
16. **`plan.autonomy` cannot be chosen by the athlete yet.** It is pinned at
    the engine's most-supervised floor. Raising it needs a real consent
    surface, which does not exist.
17. **The `SCHEMA_V` / `AUTONOMY_LEVELS` literals are duplicated, not
    imported.** The cross-check in journey step 16 turns a drift into a test
    failure, but the duplication is real and is a deliberate trade for keeping
    `athlete-state.cjs` free of any `rebuild/engine` import.
