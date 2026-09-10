# A0 — host composition, Dad's clean first run, one synthetic journey

Branch `rebuild/slice-a0`, based on `origin/rebuild/t2-client-core` @
`189523bdb2fa37187ce9e08b93c4e6dc27d41efd` (the joined tree).
Builder: cowork (Earned PM) · A0 builder. **Candidate, not accepted.** An
independent reviewer reviews this; nothing here is self-accepted.

Node v24.19.0. Nothing installed, nothing purchased, no network use by any
test, no private folder or `src/history.js` read, no athlete data printed.
`rebuild/engine/*`, `public-client.mjs`, `t2-stage.cjs`, `rebuild/client/*`,
`rebuild/authority/*`, `rebuild/m3/w5/crypto.cjs`, `build-browser.mjs`,
`reading-replay.cjs`, `schema.cjs` and every frozen law are **unchanged**.

---

## 0. Read this first — the one thing that did not work

**The accepted candidate-L engine carriers cannot be adopted into
`rebuild/engine` on this branch, and the L tests therefore cannot run here.**

`rebuild/m4/spec/load-write-source.cjs` `verify()` asserts a **closed**
`rebuild/engine` file inventory — exactly `constants, dates, energy, index,
merge, migrate, oracle-shim, plan, policy, progression, seed, sleep, today,
volume, writers, earn` — and exact bytes for `plan`, `progression`, `sleep`,
`today`, `writers`. That verifier is reached by
`node rebuild/m4/spec/load-write-package.cjs --ci`.

Candidate L needs `rebuild/engine/performed.cjs` (a **new** file), and
`rebuild/engine/entered-load.cjs` beneath it, plus changed bytes for five of
the five pinned files. Writing any of that into `rebuild/engine` breaks
`--ci`. My assignment says: if adopting L files changes a pinned file, **STOP
and report rather than edit the profile.** So I did not edit the profile and
did not write those files into `rebuild/engine`.

Direct consequences, all measured:

1. `rebuild/m4/workout/test/native-next-targets*.test.cjs` — **3 of 3 fail**
   in this tree, all with `Error: Cannot find module '../../engine/performed.cjs'`
   (`MODULE_NOT_FOUND`). They are adopted at their accepted bytes and are ready
   to pass the moment a composition root carries the carriers.
2. The **browser host page cannot be built end to end** (§5). The rest of the
   host graph bundles cleanly; the engine cannot enter it.
3. The Node journey test therefore assembles the engine from a **scratch
   composition root** built from the carrier bytes staged (verbatim,
   sha256-pinned) under
   `rebuild/m4/spec/native-next-target-candidate/engine/` —
   see `engine-root.cjs`. Nothing under `rebuild/engine` is written.

**PM decision needed** (this is the gate on everything downstream): where the
L engine carriers are allowed to live. Either (a) the M2-LOAD-WRITES profile is
re-issued to admit `performed.cjs`/`entered-load.cjs` and the five changed
carriers — that is the profile owner's call, not mine — or (b) the host keeps
composing from a materialised packet root, in which case the browser page needs
a separate, reviewed way to obtain a bundled engine.

---

## 1. What was built

| file | sha256 |
|---|---|
| `rebuild/m3/w6/host/workout-host.mjs` | `9f8341f9b657dbcb10a3bac0778fdf9104d1f0b646575e807dccb51d76fc64fd` |
| `rebuild/m3/w6/host/host-entry.mjs` | `c4fe5f2d07170c4b89923907bf6e2ef4b93ac71f39e8e5a7486d3448637b163d` |
| `rebuild/m3/w6/host/index.html` | `5dbef56656fbf91fdaf6ab091963878e606d89103df197f87c678d284f6cb370` |
| `rebuild/m3/w6/host/build-host.mjs` | `a07562cfbe752b835a28e1c339825407958bc9722826d1e0cedd8808ad7f93ae` |
| `rebuild/m3/w6/host/esbuild-probe.mjs` | `d81f82cd5c57ae055f9e058081b691df49144f2f5b3f7e0ded6e714e47c794a4` |
| `rebuild/m3/w6/host/test/journey.test.mjs` | `4848ceb22a6e67e63c30b5063f5540df809726a61aae54f76b732d45e717b376` |
| `rebuild/m4/workout/athlete-state.cjs` | `7274db127d45ec269ec8881bdb7d77352f33459092f638cb5ca3dadaa490adef` |
| `rebuild/m4/workout/workout-basis.cjs` | `e4ed838ae212a277c6922373cea66109a3332a5f250285d47165ad282c1aa664` |
| `rebuild/m4/workout/resume-policy.cjs` | `7c11a07ae5bb5d114447ad06f52d95537d83fef012cc78d47e19664e9925395f` |
| `rebuild/m4/spec/native-next-target-candidate/engine-root.cjs` | `5d4ac334359473fef17926fc9a232a5fe1a22b571ebac9443444725029b40de6` |
| `rebuild/slice/A0-REPORT.md` | this file |

Changed (one file, one change): `rebuild/m4/workout/engine-runtime.cjs`
`9be21897…` → `4d48a9b13557072284cc017c132b32cc15ea08c9107120baf6fa85c496ea50f0`
(§4).

### Dad's clean first run — `athlete-state.cjs`

`createCleanInitState({setup})` builds the engine state field by field from an
explicit per-athlete document. It **imports nothing from `rebuild/engine`** —
no `seed.cjs`, `migrate.cjs`, `merge.cjs` or `index.cjs` — and performs no
seed, import, merge or migration. Every member is either copied from `setup`
or the empty value of that member. There is no default lift, no default load,
no default week, and nothing of Joe's.

* **`split` is required.** `rebuild/engine/plan.cjs` `dayType(iso, s)` falls
  back to a fixed Mon/Thu = U, Tue/Fri = L, Wed = REFEED week when no split
  entry covers the day. That is one athlete's week. Refusing means the
  fallback is never consulted. The journey test's day (2026-09-04, a Friday)
  is chosen so the fallback and this athlete's split **disagree** — see §3.
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

`node --test rebuild/m3/w6/host/test/journey.test.mjs` → **15 / 15 pass, 0 fail.**

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
| 14 | the composed engine root is candidate L at its pinned bytes | PASS |

**Negative controls** (run, then reverted — the test file is back at its
committed bytes):

* moving this athlete's own U day off Friday so the state is invalid →
  `CLEAN_INIT_SPLIT_REQUIRED`, journey fails.
* swapping Friday to L (a valid state that agrees with the Joe-shaped
  fallback) → step 4 reads `['leg-press']` and **11 of 15 fail**. So the "which
  lifts appear" assertions genuinely discriminate the athlete's own split from
  the fallback week; they are not vacuous.

Not done: no mutation campaign against the host or the providers beyond these
two controls.

---

## 4. esbuild evidence for `engine-runtime.cjs:10`

Brief §4.2 marked this UNVERIFIED. Measured with the **real** browser build
(`rebuild/m3/w6/build-browser.mjs`, esbuild, `platform: browser`,
`format: esm`), reproducible via `node rebuild/m3/w6/host/esbuild-probe.mjs`:

* **Before** — `require('../../engine/' + name + '.cjs')`:
  **62 esbuild errors across 21 files.** esbuild glob-expands the expression
  and pulls in *every* file under `rebuild/engine`, including all 20 Node-only
  `rebuild/engine/test/*` harnesses (and by the same expansion `seed.cjs`,
  `migrate.cjs`, `merge.cjs`, `index.cjs` — which the product rules forbid in
  the phone bundle). This is **worse** than the brief's expectation of an
  unbundled runtime `require`.
* **After** — twelve literal requires, same modules, same `MODULES` order:
  **1 esbuild error in 1 file** — `Could not resolve
  "../../engine/performed.cjs"`, i.e. only the §0 blocker remains.

So the fix was warranted and was applied. **It takes an accepted candidate-L
file off its accepted bytes and needs the L owner's re-review.** Nothing else
in that file changed.

---

## 5. Browser status

* **Host page bundle** — `node rebuild/m3/w6/host/build-host.mjs` →
  **PASS, 77 pinned inputs**, and the graph contains **zero** `rebuild/engine`
  inputs, no `seed.cjs` / `migrate.cjs` / `merge.cjs` / `engine/index.cjs`, no
  `rebuild/authority/*` beyond `canonical.cjs`, no `rebuild/m3/w5/crypto.cjs`,
  no `rebuild/m4/import/*`, no `rebuild/engine/test/*`. `build-browser.mjs` is
  unchanged; the entry is passed to it as an ordinary `entryPoints` value.
* **Browser journey — NOT RUN.** Two independent reasons, both measured:
  1. the page cannot obtain a bundled engine (§0/§4), so the journey has
     nothing to drive;
  2. the retained Chromium harness itself is broken in this environment.
     `node rebuild/m3/w6/test/browser-check.mjs` with
     `W6_BROWSER_BIN=C:\Users\joeym\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe`
     fails with the exact error
     `page.evaluate: TypeError: Failed to fetch dynamically imported module:
     http://127.0.0.1:<port>/repository.mjs`.
     Chromium launches fine (`151.0.7922.34`). **Control:** the identical
     failure occurs in the untouched retained W6 worktree
     (`work/m3-w6-browser-bridge`), so it is pre-existing and environmental,
     not caused by this branch. Nothing was installed to work around it.

---

## 6. Commands and totals

| command | result |
|---|---|
| `node rebuild/m3/w6/test/run-current-head.cjs <tree> --all` (**baseline**, before any change) | **435 pass / 0 fail** |
| `node rebuild/m3/w6/test/run-current-head.cjs <tree> --all` (**after**) | **435 pass / 0 fail** — no delta |
| `node rebuild/m4/spec/load-write-package.cjs --ci` (**baseline**) | `LOAD PUBLIC CI EVIDENCE PASS`, exit 0 |
| `node rebuild/m4/spec/load-write-package.cjs --ci` (**after**) | `LOAD PUBLIC CI EVIDENCE PASS`, exit 0 |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs` | **15 pass / 0 fail** |
| `node --test rebuild/m4/workout/test/native-next-targets{,-assembly,-correction}.test.cjs` | **0 pass / 3 fail** — all `Cannot find module '../../engine/performed.cjs'` (§0) |
| `node rebuild/m3/w6/host/build-host.mjs` | PASS, 77 pinned inputs, 0 engine inputs |
| `node rebuild/m3/w6/host/esbuild-probe.mjs` | 62 errors / 21 files → 1 error / 1 file (§4) |
| `node rebuild/m3/w6/test/browser-check.mjs` | FAIL (environmental, pre-existing — §5) |

Note on the runner: `run-current-head.cjs` takes a retained-R1 repository as
`argv[2]`. In the **joined** tree the composition root is the tree itself; with
the separate R1 worktree it refuses at its own gate
(`Shared edit candidate source differs: rebuild/m4/workout/schema.cjs`, because
the joined tree's `schema.cjs` `9d18cce9…` matches the pin but not R1's
`6038b32e…`). That is a property of the joined tree at `189523b`, not of this
branch; both baseline and after-runs used the joined tree as `argv[2]`.

---

## 7. L adoption list

Adopted **byte-for-byte**, each verified against
`native-candidate-L/hashes/HASHES-L-AFTER.sha256`:

| file | sha256 | verified |
|---|---|---|
| `rebuild/m4/workout/source-projection.cjs` | `fecb0447d5079628bb531c59bfbc64b72d302c1fa3e844ef2692a161a0f0e37e` | ✓ |
| `rebuild/m4/workout/test/native-next-targets-assembly.test.cjs` | `eb75529047b1f9fad7f362bff4c3a5d649f3d27470bfd158102190f73e610c14` | ✓ |
| `rebuild/m4/workout/test/native-next-targets-correction.test.cjs` | `ffed53fdee84e587507485e8883c34cf11d63c5489d48e770bc76b5ccab4aea1` | ✓ |
| `rebuild/m4/workout/test/native-next-targets.test.cjs` | `8ab8ac5b7e1a35a9006e952f07ce170a2bb58ce962e213f18ee2bd385b6b3a41` | ✓ |
| `rebuild/m4/spec/native-next-target-candidate/fixture.cjs` | `2554ae6ecd553df70473cc417676512e7e7188bdbcb150497698568e81df86a9` | ✓ |
| `rebuild/m4/spec/native-next-target-candidate/import-engine-assembly.cjs` | `cb58dafbaed93e72bb94329219a4d6c36a80b88485456cfbc7620628d1f4ca22` | ✓ |
| `rebuild/m4/spec/native-next-target-candidate/reach.cjs` | `6b76c5e45c089cf25873fd1d4b4c66f318ea20b0a3eb291b6164888cb7a2242c` | ✓ |
| `rebuild/m4/spec/native-next-target-candidate/source-delta.cjs` | `fce1c2f92bf445373fdab39fdd1e2f16705f0312c6b3b8347c225dae6639ea6a` | ✓ |
| `rebuild/m4/workout/engine-runtime.cjs` | adopted at `9be21897…` in commit 1, then **changed** to `4d48a9b1…` in commit 2 (§4) | ✓ then changed |

Staged **verbatim, outside `rebuild/engine`** (see §0), under
`rebuild/m4/spec/native-next-target-candidate/engine/`:
`performed.cjs 2372e66b…`, `plan.cjs 1b26c87f…`, `progression.cjs 7031838d…`,
`sleep.cjs 3dd34e11…`, `today.cjs 397532ec…`, `writers.cjs 00291236…` —
all at their accepted L bytes.

---

## 8. LIMITS — in plain language

1. **The L engine carriers are not in `rebuild/engine`, and the L tests fail
   here.** The M2-LOAD-WRITES profile forbids them; I did not edit the profile.
   This needs a PM/owner decision (§0). Everything else in this report should
   be read as "the host works given a composition root that has the engine".
2. **The phone page is not runnable yet.** Everything except the engine bundles
   cleanly and safely (77 inputs, no seed, no authority, no import). The engine
   cannot enter the bundle on this branch.
3. **`engine-runtime.cjs` is no longer at its accepted L bytes.** One change,
   evidence-driven, needs the L owner's re-review.
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
    U day for a single synthetic athlete. Multi-day, REST-day, retirement,
    queue/debut-move and skip paths are untested by this test.
