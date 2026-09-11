# A2 — the gym card, end to end on the accepted capture layer

Branch `rebuild/slice-a2`, from `rebuild/t2-client-core` @
`e489932` (A0 host, A1 Today and A5 PWA shell all merged; ledger lines 98, 99,
101). Builder: Opus builder (Earned A2). **Candidate, not accepted.** ONE
independent Opus reviewer plus CI is the acceptance (screens tier,
DECISIONS:88). Nothing here is self-accepted.

Node v24.19.0, on Joe's PC. Nothing installed, nothing purchased, no network use
by any test, any build or the page itself. No `rebuild/conform/private/`, no
`src/history.js`, no `ledger/` was read. No athlete data printed, no token
printed, nothing deleted. The frozen app is untouched.

**Custody.** `git status` at this head is exactly:

```
 M rebuild/m3/w6/host/workout-host.mjs        (one additive extension, §7.6)
 M rebuild/m3/w7-preview/today/{build,design,today-app,today-entry,index.shell,screens.template}
 M rebuild/m3/w7-preview/today/test/{design,view}.test.cjs
?? rebuild/m3/w7-preview/today/{gym-host,gym-model,gym-app,gym-check}.mjs
?? rebuild/m3/w7-preview/today/test/gym.test.mjs
?? rebuild/slice/A2-REPORT.md
```

Nothing under `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`,
`rebuild/m4/workout`, `rebuild/client`, `.github/workflows`, the pinned
`rebuild/m3/w7-preview/test/{model,view,package}.test.cjs`, or
`rebuild/m4/workout/{engine-runtime,source-projection}.cjs` is changed.

---

## 1. What A2 does, in one paragraph

Today's workout entry point is now the gym card, and every word and number on it
is either a cell of the prescription the accepted engine adapter produced and the
durable **Start** operation stored, a value read back out of a stored operation
through the client's own projection, or a value the accepted engine reader returns
for exactly the input the capture was prepared from. Tap **Start UPPER BODY ·
TODAY** and the page prepares a workout through the accepted
`composeWorkoutHost` over a real encrypted IndexedDB repository, stores one Start
carrying the whole capture, and shows the first set: the engine's prescription
("40 lb × 12 reps", "Aim to finish with 2 clean reps left.") above editable
performed weight and reps that open at that prescription, with the engine's own
reason beside it and the previous-performance line the engine qualifies — or
nothing, when it qualifies none. Choose an effort (nothing is preselected; "Unsure"
stores the accepted tag `unknown`, never a number) and log the set: one durable
`session-set` operation, then the saved-set/rest screen showing exactly the stored
facts, **Undo**, the rest state, and the next set's own prescription. Undo commits
the accepted layer's **removal** edit, so the fact leaves every projection and the
slot opens again. Finish, and Today says the workout is recorded. Reload the page,
open a new one, kill the browser process: the in-progress or finished workout comes
back out of this device's own encrypted store, and while a workout is in progress
Today's primary action is **Resume**.

---

## 2. Files

| file | lines | bytes | sha256 |
|---|---:|---:|---|
| `rebuild/m3/w6/host/workout-host.mjs` | 195 | 12000 | `4029a5404cd34aac56da0af89c4ae6e0e2868353ab758d0f778c9d9f29190a8b` |
| `rebuild/m3/w7-preview/today/build.mjs` | 176 | 8973 | `d52d21548d0c88d6bbf55896d1a9e4d0443d230bf5545582d66eb49b4991c688` |
| `rebuild/m3/w7-preview/today/design.cjs` | 243 | 13693 | `3566a8aaf3f7cfb531ef28f64307b2bc5b352dcac149529d8a1da9d996d75ccb` |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | 259 | 11653 | `34e297883e5a5faa6db1be5e11fbd8a81e88c3f709cc93c738f7e422b1050696` |
| `rebuild/m3/w7-preview/today/gym-check.mjs` | 253 | 14513 | `bfc224537b7c9a8473320c10d86fbb6ea11b15c6cddc851db23c2b44df9bb7d4` |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | 220 | 12742 | `0134763751bc72dbc6f3221a68feb4bc07294dec50acf26a1a62f6e352c83233` |
| `rebuild/m3/w7-preview/today/gym-model.mjs` | 348 | 19039 | `dbcb6d7303e701b228ea26388ac96765ba255b4563d8db31cbb98a6883ab0baa` |
| `rebuild/m3/w7-preview/today/index.shell.html` | 32 | 1508 | `1ea785f2e55dedd051329b3095e8b7eeb77d19341f074a29632aeea243eb67b1` |
| `rebuild/m3/w7-preview/today/screens.template.html` | 241 | 11840 | `041d75f3ebf91764f29e63d90f94d43da659fc22090137e928ab9f3114b5b418` |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | 185 | 10714 | `580822f0d58827179a4c922afbd68892382963f42a0e2db08eb6390a6f7154d0` |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | 489 | 26120 | `bd82f009a905937c0e2c7fd7b29ff9388c3305072aa608796624bb1261c41805` |
| `rebuild/m3/w7-preview/today/test/view.test.cjs` | 452 | 24067 | `095be638fe52d0be47cf3a72aa059e9c0a4c52b171d35122fb154c854c03a14a` |
| `rebuild/m3/w7-preview/today/today-app.cjs` | 392 | 19190 | `1e3b8e97e14d3161f2ad2b1747694ee8a8a7f946973f3fecaacb2257d7ca59a0` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 60 | 2537 | `7c5ef8a5d59c337473020d0fe9d9b54ac7f4c8f11cc8c5e90a19cb8202e38970` |
| `rebuild/slice/A2-REPORT.md` | — | — | this file |

All UTF-8, no BOM, LF only (checked, not assumed).

---

## 3. The exact PC commands

From the worktree root, with Node 24 and the junctions in place (root
`node_modules`, `rebuild/m3/w6/node_modules`, `rebuild/m3/w5/node_modules`):

```
node rebuild/m3/w7-preview/today/build.mjs
node rebuild/m3/w7-preview/today/serve.mjs
```

Then open **http://127.0.0.1:4178/**. `--port NUMBER` picks another local port.
The page requests nothing, so it also opens with the machine offline.

Tests and checks:

```
node --test rebuild/m3/w7-preview/today/test/gym.test.mjs
node --test rebuild/m3/w7-preview/today/test/{design,adapter,view,package}.test.cjs
node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
node --test rebuild/m3/w7-preview/test/{model,view,package}.test.cjs
node rebuild/m4/spec/native-carriers-package.cjs --ci
node rebuild/m3/w6/test/run-current-head.cjs . --all
node rebuild/slice/pwa/build-pwa.mjs
node --test rebuild/slice/pwa/test/{package,pwa,workflow}.test.cjs

set "W7_BROWSER_BIN=C:\Users\joeym\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe"
node rebuild/m3/w7-preview/today/gym-check.mjs
node rebuild/m3/w7-preview/today/browser-check.mjs
node rebuild/slice/pwa/browser-offline-check.mjs
```

(The `set "VAR=…"` quoting matters on `cmd`: without it the trailing space before
`&&` becomes part of the path and Chromium "doesn't exist".)

### What the screen shows, with the synthetic fixture

Today, after the morning weigh-in, the primary action reads
`Start UPPER BODY · TODAY`. Tapping it gives:

```
←  UPPER BODY · TODAY                            Exercise 1 of 2

Chest press                                            Setup →
SYNTHETIC demonstration                                   Why?

 Set 1          Set 2
 12 reps        12 reps

This set’s plan
40 lb × 12 reps
Aim to finish with 2 clean reps left.

What you did · Set 1                    Last time: 40 lb × 12
Weight (lb)                 Reps
[ −   40   + ]              [ −   12   + ]

Clean reps left at the end
[ 0 ] [ 1 ] [ 2 ] [ 3+ ] [ Unsure ]        ← none preselected

[ Log set 1                                              ✓ ]
What counts as a clean rep?

Up next
Chest press
```

Log 45 × 11 with **Unsure** and the saved-set/rest screen reads:

```
✓ Set 1 logged                                           Undo
45 lb × 11 reps · Effort unknown

Take your rest.
Your plan does not set a rest length.

Next · Set 2 of 2
40 lb × 12 reps
Aim to finish with 0 clean reps left.

[ Ready for set 2                                          → ]
Back to Today
```

Every figure there is traced in §5. `40 lb`, `12`, `2` and `0` are the engine's
own capture cells for this synthetic athlete; `45`, `11` and `Effort unknown` are
the stored operation read back.

---

## 4. Architecture — what is real, and where each piece came from

```
 athlete taps "Start"        gym-host.mjs                    the ACCEPTED host
        │                    (binding only)                  rebuild/m3/w6/host/
        ▼                          │                          workout-host.mjs
  gym-model.mjs  ───────────►  composeWorkoutHost({ … })  ──────────┐
   (no arithmetic)                 │                                │
        │                          ├─ createDurablePublicClient ────┤ schemaVersion 2
        │                          ├─ createPrescriptionCapture ────┤ v2 source-aware
        │                          ├─ createEngineWorkoutCapture ───┤ engine adapter
        │                          ├─ null-lane registrar + reader ─┤
        │                          ├─ createEngineHistoryProjector ─┤
        │                          └─ engine-runtime-host.cjs ──────┘ 12 accepted modules
        ▼                                     │
  gym-app.mjs (the view)                      ▼
   Refinement A's workout          T2 stage  →  rebuild/client  →  operation + outbox
   and rest screens                           │
                                              ▼
                            AES-GCM encrypted generation in this device's IndexedDB
```

* **One host, one engine, one capture path.** `gym-host.mjs` constructs nothing of
  its own: it hands the accepted `composeWorkoutHost` exactly the collaborators the
  accepted A0 journey hands it (`rebuild/m3/w6/host/test/journey.test.mjs`), and the
  prescription runtime is the accepted host mirror
  `rebuild/m3/w6/host/engine-runtime-host.cjs`. The build **refuses**
  `rebuild/m4/workout/engine-runtime.cjs` by name in the page graph (§7.7), and the
  build's required-input list fails if any of the accepted modules leaves the graph.
* **All writes go through `rebuild/client`.** The durable public client stages every
  command through `rebuild/m3/w6/t2-stage.cjs`, which constructs
  `rebuild/client/index.cjs` and calls its `workout` command; the operation and its
  outbox entry are written by the client, in one transaction, into the generation
  the repository then seals. A2 writes no operation itself and parses no operation
  log: it asks the client for `readWorkoutHistory()` and
  `prepareWorkoutContinuation()` and shows what they return.
* **Today's weigh-in store is untouched.** A1's Today keeps its own synchronous
  `rebuild/client` over `localStorage`; the gym card is the encrypted asynchronous
  IndexedDB repository the W6 host uses. Two durable stores, both real, composed
  side by side in `today-entry.mjs`. §9.3 says what that costs.
* **The athlete is A1's synthetic athlete, on A1's synthetic day.** The engine state
  the host is composed over is `model.stateFromOps()` — the same
  `rebuild/m3/w7-preview/fixtures.cjs` basis with the stored weigh-ins replayed
  through the accepted writer. One athlete, one day, so Today's
  `UPPER BODY · TODAY` and the gym card's prescription are the same session.
* **Bundle: 83 pinned inputs** (was 38 for A1), 13 `rebuild/engine` modules, 12
  `rebuild/client` modules, 14 `rebuild/m4/workout` modules, 12 W6 modules, the
  accepted SHA-256 boundary and `@noble/hashes`. **Not present:** `seed.cjs`,
  `migrate.cjs`, `merge.cjs`, `engine/index.cjs`, `rebuild/engine/test/*`,
  `rebuild/authority/*` beyond `canonical.cjs`, `rebuild/m3/w5/crypto.cjs`,
  `rebuild/m4/import/*`, `rebuild/m4/workout/engine-runtime.cjs`, `ledger/*`,
  `src/history.js`. The build asserts all of it, and that the only third-party code
  in the page is `@noble/hashes`.

### What is synthetic, and said so

There is no enrolment for this preview: no authority issues it a lease and no
server knows it. `gym-host.mjs` therefore mints its own **device enrolment** on
first launch and labels it:

| provider | status | what it actually is |
|---|---|---|
| encrypted repository (IndexedDB, AES-GCM) | **real** | `rebuild/m3/w6/repository.mjs`, untouched |
| T2 stage, durable public client, bridge | **real** | untouched |
| v2 prescription capture + source codec | **real** | `capture.cjs`, `rebuild/m3/w5/source/codec.cjs` |
| null-lane registrar, composite reader, engine adapter, history projector | **real** | untouched |
| prescription runtime (`genSession`, `rirPlan`) | **real** | `engine-runtime-host.cjs`, untouched |
| store key (AES-GCM 256) | **synthetic, on-device, non-extractable** | generated on first launch, kept as a `CryptoKey` in this device's own IndexedDB key store; never exported |
| authority key pair (P-256) | **synthetic, on-device, non-extractable** | generated on first launch; signs ONE offline-write lease for this device; authorizes nothing anywhere else |
| the lease | **synthetic** | `not_before` 1970, `not_after` 9999, range 1–1000000, schema 2, ES256 over the canonical bytes the accepted verifier checks |
| identity key | **synthetic literal** | `synthetic-preview-identity-not-a-credential` |
| `plan_basis` / `input_basis` | **host labels** | `NO_ACCEPTED_PLAN`, `native-only/zero-import` — A0's open question, unchanged |
| `nativeTrendContext` | **honest refusal** | `createUnavailableNativeTrendContext()` — A0's, unchanged; §9.1 |
| observation guard, currentness, issuance, admission, receipts | **not exercised** | as A0 |

**There is no secret literal in any source file A2 adds.** Both private keys are
generated by WebCrypto on the device, marked non-extractable, and stored as
`CryptoKey` objects; nothing that could be copied off the device is ever produced.
A browser that will not keep them **refuses** — it never falls back to an
extractable key or an unencrypted store.

---

## 5. Where every figure on the gym card comes from

| on screen | source |
|---|---|
| `UPPER BODY · TODAY` (nav, and Today) | `nowModel(state).workout.title` — A1's, unchanged |
| `Exercise 1 of 2` | the capture's own slots, grouped by `lift_lineage_id` |
| `Chest press` | `slot.label` (the engine card's `n`) |
| the green reason line, and `Why?` | `slot.reason.display`, line for line, verbatim |
| `Setup →` | `slot.setup.display`, verbatim |
| `Set 1 · 12 reps` (the strip) | `slot.reps.display` for each slot of the lift |
| `Set 1 · 11 logged` (the strip, done) | `slot.completion.values.reps.value` — the stored operation |
| `40 lb × 12 reps` | `slot.load.display` + `slot.reps.display` — the capture's own cells |
| `Aim to finish with 2 clean reps left.` | `JSON.parse(slot.effort.source_json).target` in the approved design's own plain words (§7.3) |
| `Last time: 40 lb × 12` | `genSession(captureState, day).ex[i].prev` — the engine's own governing-last metadata, for the identical input the capture was prepared from (§7.4) |
| the performed boxes' opening values | the same `slot.load` / `slot.reps` cells, editable |
| the `−` / `+` weight step | `state.exercises[i].inc` — this athlete's own equipment increment; no increment on file disables the buttons |
| the five effort choices | the accepted `reserve` domain in `rebuild/m4/workout/edit-values.cjs`, checked against its own predicate at load time (§7.2) |
| `45 lb × 11 reps · Effort unknown` | the stored `session-set` operation's `payload.load`, `payload.reps`, `payload.reserve` |
| `Next · Set 2 of 2`, `40 lb × 12 reps` | the next incomplete slot's own capture cells |
| `Your plan does not set a rest length.` | this preview's own sentence — the engine prescribes no rest (§7.5) |
| `Workout in progress` / `Workout recorded` on Today | `readWorkoutHistory()`: a session started today with no close record, or with one |

There is no other figure. `screens.template.html` still carries **no digit in any
text node** and the build fails if one appears; a jsdom test blanks every bound
slot on both gym screens and asserts no digit survives.

---

## 6. Verification — commands executed, and their tails

All on the PC, at the branch head.

| command | result |
|---|---|
| `node --test …/today/test/gym.test.mjs` | **33 pass / 0 fail** (new) |
| `node --test …/today/test/{design,adapter,view,package}.test.cjs` | **60 pass / 0 fail** (A1's 58, + 2 net) |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs …/engine-equivalence.test.cjs` | **22 pass / 0 fail** (A0 unchanged) |
| `node --test rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19 pass / 0 fail** (pinned preview, untouched) |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`**, exit 0 |
| `node rebuild/m3/w6/test/run-current-head.cjs . --all` | **435 pass / 0 fail**, exit 0 |
| `node rebuild/m3/w7-preview/today/build.mjs` | `A1 TODAY BUILD PASS: 3 assets; 83 pinned inputs (13 engine, 12 client); approved design pinned; 61 bound classes; 2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference` |
| `node rebuild/slice/pwa/build-pwa.mjs` | `A5 PWA BUILD PASS: 13 files …; cache name earned-slice-e5d9a610dfd1108f9679f85c4ced1261 …; no network reference in any shipped byte` |
| `node --test rebuild/slice/pwa/test/{package,pwa,workflow}.test.cjs` | **53 pass / 0 fail** |
| `node rebuild/slice/pwa/browser-offline-check.mjs` | `A5 OFFLINE LAUNCH CHECK PASS — … with the network OFF Today rendered from the engine, a weigh-in … survived a reload and a new page; the same folder with the worker blocked could not open offline at all` |
| `node rebuild/m3/w7-preview/today/browser-check.mjs` | `A1 TODAY BROWSER CHECK PASS — … 15 engine headline titles swept in both states — worst headroom 11px before / 10px after …` |
| `node rebuild/m3/w7-preview/today/gym-check.mjs` | see below |

```
A2 GYM BROWSER CHECK PASS — Today -> Start -> active set (prescription shown separately
from editable performed values, no effort preselected) -> refusal without an effort answer
-> logged with an explicit unknown effort -> saved facts + Undo + rest + next set -> Undo
removed it -> relogged -> PROCESS KILL -> resumed at the next set with the recorded set
intact -> finished -> Today says recorded, through a reload, a new page and a second kill.
Headroom: active set 118px headroom, saved set 64px headroom, active set 1 118px headroom,
saved set 1 64px headroom, active set 2 118px headroom, saved set 2 64px headroom, active
set 3 118px headroom, saved set 3 64px headroom, Today, workout recorded 102px headroom.
No network request; no prototype figure on screen; every input >= 16px; no horizontal overflow.
```

`gym-check.mjs` runs on a **persistent Chromium profile** and closes the browser
twice, so "survives a process kill" is executed, not argued: the whole journey has
to come back out of this device's own encrypted IndexedDB.

### The 33 new tests, by what they prove

**The journey on the real stack (12).** Nothing is stored before a Start; every
prescription figure equals the capture cell it claims to come from (`load.display`,
`reps.display`, `JSON.parse(effort.source_json).target`, `reason.display` line for
line, `setup.display`); Start writes exactly one `session-start` carrying a
4-slot v2 capture; the active set shows the stored prescription beside editable
performed values; **an entry with no effort answer records nothing**; **an empty
performed box records nothing**; **load 0, reps 2.5 and load −5 are each refused by
the accepted layer in its own words and store nothing**; an explicit unknown effort
stores `{tag:"unknown"}` and **carries no number**; the saved-set screen shows
exactly the stored operation's facts, Undo, the rest state and the next set — whose
effort target is the engine's own `0`, not a repeat of the last set's `2`;
**Undo removes**; every set logs and the workout closes `normal`; Today says
finished, survives a relaunch, and a second workout the same day is refused with the
layer's own code.

**Undo semantics (1, the tenth above).** After Undo: the durable log has **one more**
operation, a `tombstone` whose `target_op_id` is the set; the client's own
`readWorkoutHistory()` reports that fact `included: false`; the accepted
continuation view has **zero** completions; and the screen is back on set 1 with the
strip clear. The set operation itself is untouched — an append-only log has no
delete, and A2 does not pretend otherwise (§7.8).

**Resume, relaunch and a process kill (1).** One set logged, the repository closed,
a fresh host opened over the same IndexedDB: the session resumes **at set 2**, the
recorded set comes back in the strip, the Start operation is **byte-identical**, and
no second Start exists.

**The refusals the capture layer owns (3).** A split whose `from` is in 2031 is
refused as `WORKOUT_SPLIT_NOT_IN_FORCE` and stores nothing; a second Start while one
workout is open is refused `WORKOUT_HISTORY_RECONCILIATION_REQUIRED` and stores
nothing; an **injected IndexedDB quota fault** mid-set is reported with a code and
leaves the log byte-identical.

**The effort domain (1).** All five offered choices are accepted by
`edit-values.cjs` `reserve()`; four efforts the screen does **not** offer
(`exact 3`, `at_least 2`, `exact 5`, `guessed`) are refused by it, so the choice set
is provably the accepted closed domain and not a list someone typed.

**Previous performance (2).** The line equals the engine's own `card.prev` for the
lift, or is absent; an athlete whose state carries no qualified comparison gets
**no line at all**.

**The gym screens in jsdom over the real durable store (4).** The plan, effort
sentence, entry title, both performed boxes, the five choices (all
`aria-pressed="false"`), the strip and the log label are all bound to the model's
DTO; the log button refuses without an effort answer **in the approved words**;
choosing one and logging lands on the saved screen with the stored facts, Undo, the
rest note, the next plan and `Ready for set 2`; and **no digit appears on either
screen outside a bound slot**.

**Today's workout state (4).** Before a weigh-in the primary action is the engine's
marching order; after it, `Start <title>`; with a workout in progress,
`Workout in progress` + `Resume <title>` — including when the morning is still owed,
so an unfinished session can never become unreachable; when finished,
`Workout recorded` + `Review today’s workout`.

### The two changes to A1's own tests

Both are in A1's files and both are **strengthenings**, not removals. A1 is
**60 / 0** at this head (was 58).

* `view.test.cjs` — "the workout entry point carries the engine's session name and
  nothing more" asserted `Workout logging is not wired yet`. A2 makes that false.
  It is replaced by **two** tests: with no workout host injected (which is what a
  browser that will not give the page an encrypted store looks like, and what a
  jsdom document is) the entry point says *"could not be opened on this device, and
  nothing was recorded"*, names the missing store, does **not** claim the feature is
  unbuilt, and shows no digit; and Today's three workout states come from the
  **injected** host and nowhere else, with the primary action proved to open it.
* `design.test.cjs` — the copy count now includes the new
  `PREVIEW_RUNTIME_COPY` list, and a new test asserts every entry of that list is
  **absent** from the approved references (so it can never be used to smuggle in
  approved-looking words) and is really said by a view module, with a negative
  control that a preview string which *is* approved fails the binding.

---

## 7. Decisions taken (design ambiguities resolved)

1. **One athlete, one day.** The gym card is composed over A1's engine state and
   A1's synthetic day, so Today's session title and the card's prescription are the
   same session. Rejected: A0's journey fixture (a second athlete on a second day
   would have made Today and the gym card disagree).
2. **The effort choice set is the accepted domain, not the prototype's list.**
   Refinement A shows `0 / 1 / 2 / 3+ / Unsure`. `rebuild/m4/workout/edit-values.cjs`
   `reserve()` admits exactly `exact 0|1|2`, `at_least 3`, and the non-numeric tags.
   They coincide — so the five choices are declared with their `reserve` records and
   **checked against that predicate at module load**; a choice the accepted layer
   would refuse cannot be offered. "Unsure" stores `{tag:"unknown"}` — the tag, never
   an omission and never a number. Nothing is preselected, and an entry with no
   answer is refused in the approved words ("Choose clean reps left, or Unsure.").
3. **The effort instruction is the approved plain-language sentence carrying the
   engine's number.** The capture's own cell reads `2 reps in reserve`; the owner's
   approved direction 4 asks for "applicable effort instructions in plain language".
   The screen shows `Aim to finish with <target> clean reps left.` where `<target>`
   is `JSON.parse(slot.effort.source_json).target` — the engine's own integer, in the
   approved prototype's own sentence. A test asserts the number equals that field.
   Rejected: rewording the engine's cell, and inventing a tolerance.
4. **Previous performance comes from the engine, for the identical input.** The
   capture does not carry it. The engine adapter prepares the capture from
   `{…registered state, workoutFacts}`; the registered projection is the host's own
   `lastProjection()`. `gym-model.readPrevious()` re-runs the **same** accepted
   reader (`genSession`) over exactly that reconstructed input and reads
   `card.prev` — which the engine itself returns as `null` when no comparison is
   qualified (`eraFresh`). It is therefore the same engine, the same input and the
   same evaluation that produced the prescription. Rejected: deriving a "last time"
   from the workout history myself.
5. **No rest timer, and no rest length.** Refinement A's rest screen shows
   `2:30 planned`, a `2:30` countdown, `+30 seconds` and `Pause`. Those are the
   prototype's fictional constants; the accepted engine issues **no rest
   prescription at all**, and the handoff calls the timer "an approved interaction
   direction … not a new release prerequisite". So the rest section keeps its
   heading and its place in the hierarchy and states the truth —
   *"Your plan does not set a rest length."* — in the same posture A1 uses for
   carbohydrate and fat ("Not prescribed. The engine issues no carbohydrate
   target."). This is the one visible departure from the reviewed PNG and it is a
   deliberate application of bar item 2. If the PM wants the timer, the honest way
   in is an engine rest prescription or an explicitly athlete-set length, not a
   constant.
6. **The host records its producer's refusal (`workout-host.mjs`, +9 lines).** The
   durable client **contains** whatever the producer throws and answers with its own
   generic `WORKOUT_PREPARATION_INVALID` (`public-client.mjs` keeps a code only for a
   `StorageFailure`). Correct for the client — but it means the refusal the athlete
   needs to read (`WORKOUT_SPLIT_NOT_IN_FORCE`, or an engine refusal such as
   `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`) is lost at the seam, which is exactly
   the follow-on ledger line 98 hands to the screen tier. `public-client.mjs` is
   accepted and unchanged, so the smallest honest place is where the throw happens:
   `workoutProducer` now wraps its body in `try/catch`, **records** `{code, reason,
   message}`, and rethrows unchanged; `lastProducerRefusal()` exposes it read-only.
   It never substitutes, softens or invents a refusal, and A0's 22 tests are green.
7. **The build refuses `engine-runtime.cjs` by name.** The accepted runtime's single
   non-literal require glob-expands over all of `rebuild/engine` under esbuild (A0
   §4). The page uses the accepted host mirror; the build now fails if the accepted
   file ever enters the graph, and fails if any of the 13 named accepted gym modules
   leaves it.
8. **Undo is the accepted layer's removal edit, and the report says so.** There is no
   delete in an append-only log. Undo runs `prepareWorkoutEdit` →
   `commitWorkoutEdit({action:'remove'})`, which appends a `tombstone`. After it the
   fact is `included: false` in every projection, the continuation has no completion
   in that slot, and the engine's next reading of the session does not see it. The
   set operation and the removal that retired it both stay on disk — which is what an
   honest history is. The mutant "Undo that hides instead of removes" is killed.
9. **An unfinished workout wins Today's single primary action.** A1's accepted
   hierarchy puts the engine's marching order there while the morning weigh-in is
   owed. The owner's direction 5 requires the resume action to be retained. Both are
   honoured by letting an **in-progress** session take the primary slot (and only an
   in-progress one — a finished workout does not displace the weigh-in). Through the
   UI the combination cannot arise: the workout only opens after a weigh-in. It is
   defended anyway so an unfinished session can never become unreachable.
10. **Two secondary links of Refinement A's workout screen are absent**:
    `Options` and `All 9`. The handoff assigns both to the working app ("The working
    app will provide the applicable skip, correction and early-finish actions here");
    A2 wires no skip and no early finish, and an entry point with nothing honest
    behind it is worse than none. `Setup`, `Why?` and `What counts as a clean rep?`
    are kept — all three reveal real engine text or the approved guidance.
11. **The device mints its own enrolment, on the device.** §4. Rejected: a key
    literal in source (a private-key literal is both a bad habit and a secret-scanner
    hazard) and an extractable key in `localStorage`.
12. **The load step is the athlete's own increment.** Refinement A steps weight by
    ±5 and reps by ±1. `±5` is a prototype constant; the engine state carries a real
    per-exercise `inc`, so the buttons use that, and disable themselves when the
    athlete has no increment on file. `±1` for reps is the unit, not a prescription.

---

## 8. Mutants — run, and what killed them

Each mutant was applied as ONE exact string replacement, the named tests were run,
the file was restored, and the restored sha256 was checked equal to the original.
Driver output is reproduced verbatim:

```
M1 the enrolment drops the outbox accounting the client requires — KILLED (29 failing) — restored byte-for-byte
M2 a refused set is reported as saved — KILLED (4 failing) — restored byte-for-byte
M3 the rep target is computed locally instead of read from the capture — KILLED (4 failing) — restored byte-for-byte
M4 an effort answer is preselected — KILLED (4 failing) — restored byte-for-byte
M5 Undo hides the set instead of removing it — KILLED (2 failing) — restored byte-for-byte
M6 a previous-performance line is invented when the engine has none — KILLED (2 failing) — restored byte-for-byte
M7 the host stops refusing a split that is not in force — KILLED (4 failing) — restored byte-for-byte
M8 the gym card claims a wired workout when Today has no host — KILLED (1 failing) — restored byte-for-byte
```

* **M1** (the brief's "skip the outbox entry") drops `outbox` from the enrolment
  checkpoint the client's own integrity check requires — the whole gym card then
  refuses `T2_INTEGRITY_UNPROVEN` rather than writing an unaccounted operation.
* **M2** makes `logSet` report `ok` when the layer refused: the refusal tests catch a
  claimed save with no operation.
* **M3** is the brief's "render a target from local arithmetic": one `+ 1` on the
  capture's rep value.
* **M4** is the brief's "preselect an effort".
* **M5** is the brief's "Undo that hides instead of removes": it clears the screen's
  own `saved` state and returns success without touching the log.
* **M7** removes A0's split guard; it fails A2's refusal test **and** A0 journey
  step 15, so the guard is load-bearing in both.
* **M8** puts the old "not wired yet" sentence back on the unopenable-store screen.

Beyond these, the tests carry negative controls of their own: an injected IndexedDB
quota fault, four efforts outside the accepted domain, a split dated 2031, a second
Start over an open session, a one-byte tamper of an approved reference, a
preview-owned string that is actually approved, an invented class, an invented
phrase and a copied prototype figure.

---

## 9. LIMITS and SEAMS — in plain language

1. **A second workout on the same day is refused, and that is an inherited seam.**
   After a session closes, the next `prepareWorkout` refuses. The cause is the one
   A0 named (§8.5 there): once a native session exists, `rebuild/engine/performed.cjs`
   needs a `nativeTrendContext` this host does not compose, so it refuses
   `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`, which the durable client contains as
   `WORKOUT_PREPARATION_INVALID`. A2 does not paper over it: Today says
   `Workout recorded` and offers a review rather than a Start that would fail, and if
   the refusal is reached anyway the screen prints the producer's own code (§7.6). A
   real second session in one day needs the trend-context provider — engine/Track B
   work, not a screen's.
2. **`previous performance` is reachable but thin.** For this synthetic athlete the
   engine returns a governing-last line from the fixture's own session log, so the
   line renders; for an athlete with none it is absent, and a test proves both
   directions. Nothing proves it across two *native* sessions, because of limit 1.
3. **Two durable stores.** Today's weigh-in lives in `localStorage`; the workout
   lives in encrypted IndexedDB. Both are real and both survive a reload, a new page
   and a process kill (executed). They are not one store, and clearing one does not
   clear the other. Unifying them means moving A1's synchronous client onto the
   asynchronous repository — a real follow-on A1 already named (§8.7 there).
4. **No skip, no early finish, no correction.** The accepted layer supports all
   three (`skip`, `completion_kind: 'early'`, `correct`). A2 wires none: the Finish
   action appears only when every slot is recorded, and it closes `normal`. A session
   the athlete abandons stays open and Today keeps offering **Resume** — honest, but
   there is no way to close it early from the screen.
5. **No rest timer** (§7.5), and no rest length anywhere.
6. **`Review today’s workout` is a label, not a screen.** Tapping it opens the gym
   card, which reports the session is recorded and how many sets it holds. There is
   no read-only history view of the sets. Named, not hidden.
7. **The new tests are NOT in CI.** Same reason as A1 §8.2 and A5: `rebuild.yml` is
   pinned by the accepted NATIVE-CARRIERS artifact, and A5's `slice-host.yml` is
   outside A2's custody. `gym.test.mjs` needs `rebuild/m3/w6`'s own dependencies
   (`fake-indexeddb`, via `rebuild/m3/w6/test/support.mjs`) exactly as
   `package.test.cjs` and both browser checks already do. This belongs in the same
   batched re-seal A1 and A5 are already queued for.
8. **No phone has opened this.** Headless Chromium at 390×844 on the PC. iOS Safari
   specifically — the install, the 16px zoom rule, VoiceOver, 200% text — is
   untested. Measured headroom for the gym screens: **118px** on the active set,
   **64px** on the saved set, **102px** on Today with a workout recorded.
9. **The `WORKOUT_SPLIT_NOT_IN_FORCE` recovery is a host record, not a client
   change** (§7.6). If a future caller composes the host differently, or the client
   grows its own typed producer refusal, this becomes redundant — good.
10. **A locally tampered operation is trusted** (A1's F3, still open) and the
    frontier is still unverified (A0's N175-1/N175-2). Unchanged by A2.
11. **The synthetic enrolment is not an enrolment.** No issuance, no admission, no
    currentness, no receipts, no transport. Dad's real first run is A4.
12. **`gym-check.mjs` and `browser-check.mjs` are optional and skip loudly.**
    Without `W7_BROWSER_BIN` they print `NOT RUN … This is not a pass` and exit 0.
13. **What is NOT wired by A2:** the recovery check-in (A3), Dad's first run (A4),
    hosted sync, the nutrition detail beyond A1's two engine targets, the coach.
    Each still says so on Today's face.

---

## 10. What the reviewer should attack first

1. **§7.5, the missing rest timer.** It is the one place A2 deliberately does not
   render an element of a reviewed PNG. Is stating "your plan does not set a rest
   length" the right reading of bar item 2, or should the screen carry an
   athlete-set length?
2. **§7.6, the host extension.** Nine lines inside the accepted
   `workout-host.mjs`. Is recording the producer's refusal the right seam, or should
   the screen simply print `WORKOUT_PREPARATION_INVALID` and let the athlete be told
   nothing useful?
3. **§7.4, previous performance.** It re-runs `genSession` over a state
   reconstructed from `host.lastProjection()`. Check that the reconstruction really
   is the adapter's own `captureState` (`{…accepted_state, workoutFacts}`) and that
   no second engine is composed.
4. **§7.9, the primary action.** An in-progress workout displaces the morning
   weigh-in. Check the reasoning and whether the weigh-in becoming unreachable
   mid-session is acceptable.
5. **The refusal wording.** Every refusal prints `copy · code`. Read them: the
   resumed-command path's generic `copy` is the client's own "Start not confirmed…"
   sentence even for a set, which is the client's wording and not A2's, but a
   reviewer may judge that showing it beside the code is worse than showing the code
   alone.
6. **The mutants.** Re-run them, and add your own: try storing a number for the
   unknown effort, try reading the strip's "logged" count from the screen rather than
   the log, try letting `finish()` close a session with an unrecorded slot.
