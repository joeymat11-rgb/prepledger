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

**Custody.** Additions and changes are under `rebuild/m3/w7-preview/today/**`,
`rebuild/m3/w6/host/workout-host.mjs` (one additive extension, §7.6) and
`rebuild/slice/A2-REPORT.md`. Review round 1 forced **one** file outside that:
`rebuild/slice/pwa/browser-offline-check.mjs`, a three-line wait change, because
B2 made the weigh-in an awaited transaction and A5's offline check waited for a
selector that was already on screen. It is a timing fix only — the check now waits
for the sheet to close and the reading to land, which is strictly stronger — and
it is called out here rather than buried. Nothing under `rebuild/engine`,
`rebuild/conform`, `rebuild/m4/spec`, `rebuild/m4/workout`, `rebuild/client`,
`.github/workflows`, the pinned
`rebuild/m3/w7-preview/test/{model,view,package}.test.cjs`, or
`rebuild/m4/workout/{engine-runtime,source-projection}.cjs` is changed.

---

## 0. Review round 2 — the REJECT, and what it found

The independent review of `5688687` returned **REJECT**, with a headline finding
that was correct, serious, and mine:

> day 2 (the next training day, different muscle group) Today says "ready", Start
> WRITES a durable session-start (ops 6→7), then the next read is blocked
> `WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED` and every later day is
> `WORKOUT_HISTORY_RECONCILIATION_REQUIRED`, forever.

It is reproduced here rather than accepted on trust. A spike drives whole training
days — probe, Start, every set, Finish — each on a **new host over the same
storage**, which is what a page load is. With round 1's code (the frontier held in
a per-host closure seeded `[]`), the fresh athlete's log looks like this:

```
day+0 2030-02-04  probe=ready  started+recorded+closed  ops 0->6
day+1 2030-02-05  probe=ready  SETS blocked WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED  ops 6->7
day+2 2030-02-06  probe=blocked WORKOUT_HISTORY_RECONCILIATION_REQUIRED  ops 7->7
day+3 … day+13    probe=blocked WORKOUT_HISTORY_RECONCILIATION_REQUIRED  ops 7->7
```

One session, then a wall that never lifts, with a Start on disk that nothing can
retire. The athlete is stranded after one workout. That is the product being
broken, not a seam, and the rejection was right.

**The cause, exactly as the reviewer named it.** `gym-host.mjs` kept the causal
parents of the next write in a closure inside `createGymHost`, seeded `[]`, and
updated it only when *this* host wrote something. A host lives for one page load.
So day 2's Start carried `causal_parents: []` and did not descend from day 1's
close. Two Starts with no causal relation are concurrent, and
`rebuild/m4/workout/engine-order.cjs` refuses to invent an order between them
(`ready.length > 1` with no receipt sequence — an offline generation has `W 0`):
`WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED`. Once the second Start is on disk the
history read that every screen, resume and close path depends on refuses too,
which is the permanent `WORKOUT_HISTORY_RECONCILIATION_REQUIRED`.

**Why the suite was green.** The fresh-athlete test asserted `phase === 'ready'`
on the next day and never called `start()`. A probe proves the engine will
prescribe; it proves nothing about what writing does. Round 1 therefore also
documented a fresh-athlete wall at day +3 that the athlete could never reach,
because they were stranded at day +1. That is the more important lesson here:
**every day-level test now conducts the day** — Start, every set, Finish — and
asserts the op count, the phase after the write, and that Finish succeeded.

### The five required fixes, and where each is

1. **Seed the frontier from the durable log.** Done, and stronger than seeding:
   the parents are **derived on every resolution** from the generation the client
   is about to write against (`causalTips`, §7.18). The tips of the stored graph —
   every op no other op names as a parent — are exactly the close of the last
   session. There is no closure to go stale across a reload, relaunch or kill, so
   nothing needs to be remembered and nothing is invented.
2. **Probe and Start are the same computation.** Both run through the same
   resolver over the same generation; the client itself compares the bytes
   (`WORKOUT_PREPARATION_MISMATCH` if the Start does not carry the parents the
   preparation resolved). A test asserts that what the probe resolved is exactly
   what landed in `causal_parents`.
3. **Never leave a written Start unrecoverable.** This splits in two, and both
   halves are done.
   * *The unorderable Start.* There is no accepted recovery for this state — the
     order refusal takes down the very history read that the resume and close paths
     need, so the close that would retire it is refused too (executed). The honest
     answer is the one the brief allows: **refuse before writing**.
     `startOrderRefusalOf` compares the parents the resolver actually produced
     against the Starts the log already holds, at the probe and again immediately
     before the write; on a refusal the screen shows `WORKOUT_START_ORDER_UNPROVEN`
     in the guard's own words and stores nothing.
   * *The abandoned session.* A session started and then walked away from blocks
     every later day in the accepted client
     (`WORKOUT_HISTORY_RECONCILIATION_REQUIRED`) — a second way a written Start
     stranded the athlete, and round 1 only documented it. Here a recovery **does**
     exist, so it is now **offered**: Today names the day the unfinished session
     belongs to and its primary action performs the accepted `early` close. That is
     the capture layer's own completion kind, on a host standing on that session's
     own day (the only one whose current capture maps to its slots —
     `WORKOUT_RESUME_SLOT_MAPPING_REQUIRED` otherwise, executed). One operation is
     written, nothing is deleted, the sets that were done stay recorded, and today
     becomes startable again.
4. **Tests that conduct multiple days across page loads.** §6 and §9.1.
5. **The browser check runs two training days across a real kill.** It now runs
   **three** real kills and two whole sessions; see §6.

No engine, capture, client or otherwise pinned file is changed. §9.1 is rewritten
from the new spike, and names the day the first genuine engine wall bites.

---

## 0b. Review round 1 — what changed

The independent review of `2bbc793` returned **ACCEPT WITH FIXES (2 blocking)**.
Both blocking items were real defects, both are fixed, and the fix for each is
executed rather than argued.

* **B1 (blocking) — §9.1 misdiagnosed the seam, and Today ignored the probe it
  already had.** FIXED, and the diagnosis is now executed: see §9.1, which is
  rewritten from measurements, and the two new test groups that hold it there.
  The reviewer was right on every count. The measured truth turned out to be
  sharper than either version:
  * A **FRESH** athlete (DECISIONS:100 — Joe starts fresh at S2) records the first
    session normally; the next day's session prepares normally **when its lifts
    have no app-recorded session yet**; and the next session **of the same lifts**
    is refused `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`. So
    A2 can record **one session per lift**, not "one session ever" and not "daily".
  * An athlete carrying a **legacy session log** (Joe after the S3 port) is refused
    `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` on **every** later scheduled day,
    once any native session exists.
  * A **REST day** is `ENGINE_CAPTURE_NO_WORKOUT` — not a defect; Today already
    says "No session is scheduled today." through its own engine read.
  * Today now **honours the probe**: `gym-model.read()` already prepares through the
    accepted host without storing anything, and Today ignored the `blocked` phase.
    It no longer does — the training line carries the refusal in plain words with
    the layer's code **exactly once**, the primary action is
    "Why today’s workout cannot open" instead of "Start", and the gym screen's lead
    is neutral (`Earned could not prepare today’s workout…`) instead of the device
    sentence. The `CODE · CODE` duplication is gone: several of these refusals are
    `new Error(CODE)` with no `reason`, so the message IS the code, and
    `refusalOf` no longer repeats it as prose.
  * No engine or capture file is touched. The two missing providers
    (legacy-order-mapping, native trend context) are **engine-tier items for Track B /
    lane B** and are routed there in §9.1.
* **B2 (blocking) — the "process kill" was a graceful close, and localStorage
  loses data under a real one.** FIXED, both halves:
  * **The store of record moved.** The morning weigh-in is now written through the
    **same accepted machinery as the workout** — the encrypted IndexedDB
    repository, the accepted durable public client, the T2 stage over
    `rebuild/client` — by `reading-host.mjs`. `web-storage-backend.cjs` is
    **deleted**; localStorage is gone from the product entirely, not demoted to a
    cache. A1's transaction semantics are unchanged because they are the same
    `rebuild/client` transaction, now inside the repository's own atomic commit.
    A device that cannot open an encrypted store records **nothing** and says so.
  * **Why it is a second repository, not the workout's.** Executed: one generation
    carries one lease with one `schema_version`, and `rebuild/client` stamps a
    reading `schema_version: 1` and a workout `2` (pinned code). Writing the
    weigh-in through the workout's schema-2 client is refused by the accepted layer
    with `OPERATION_SCHEMA_MISMATCH`, state 20, storing nothing — there is a test
    for exactly that. Both lanes sit on the same device under the same on-device
    key store.
  * **The kills are real.** `gym-check.mjs` and `browser-check.mjs` now find every
    `chrome.exe` whose command line names the persistent profile, kill them with
    `taskkill /F /T`, **verify the processes are gone**, and relaunch. Both assert
    the weigh-in survives; `gym-check.mjs` also asserts the in-progress workout
    resumes at the next set, and both assert `localStorage` is empty. Every label
    that said "process kill" now describes what is executed.
* **The five non-blocking items are closed.** Today honours the `blocked` phase
  (B1 above); `boot()` collects and **surfaces** each cause instead of swallowing
  it (`"Not everything opened: …"` in the page's status line, and the failure list
  on the returned handle); the vacuous assertion and the dead `design2` binding in
  `design.test.cjs` are replaced by a real check that each declared view source is
  actually scanned; `paint()` has a `phase: 'complete'` branch that renders the rest
  screen with the finish action instead of reading `.lift` off a null active slot;
  the `Setup →` omission on the rest screen is stated in §7.13; and the no-op
  ternary in `prescriptionLine` is gone.

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

`git diff --name-status e489932` at this head, with sha256 per file:

| file | lines | bytes | sha256 |
|---|---:|---:|---|
| `rebuild/m3/w6/host/workout-host.mjs` | 195 | 12000 | `4029a5404cd34aac56da0af89c4ae6e0e2868353ab758d0f778c9d9f29190a8b` |
| `rebuild/m3/w7-preview/today/browser-check.mjs` | 305 | 17253 | `301e50b5a9fd7ea62507478abc161e4d63b245b1b30542e4abfecfef437ff1f2` |
| `rebuild/m3/w7-preview/today/build.mjs` | 180 | 9233 | `a9938571ee5457c3e71c78805308b5206c7bb047355c7b0d085dfb143049e4bf` |
| `rebuild/m3/w7-preview/today/design.cjs` | 259 | 14822 | `0cbfe5fc37df0b3a553f06ca6ebd02c3ce7e48d9304e92cd1dc582b7fbe7542d` |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | 311 | 14113 | `504e5eb03383eab848ae220db29117eabc7a03e69716466dc6c641d732517e21` |
| `rebuild/m3/w7-preview/today/gym-check.mjs` | 420 | 25236 | `b056d5639781568a05f64a5aa9359ebe66f6a3eafdf854e871c425873e130427` |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | 320 | 18299 | `9b018f11ad88903516721f56d5cec54714ceecf15d1a5f288c9c71bdc26c78a2` |
| `rebuild/m3/w7-preview/today/gym-model.mjs` | 436 | 24513 | `398b0e4cd8f0e61cc53baf56d3edfe6f00c93df943a2da59426c76f6433676d4` |
| `rebuild/m3/w7-preview/today/index.shell.html` | 32 | 1508 | `1ea785f2e55dedd051329b3095e8b7eeb77d19341f074a29632aeea243eb67b1` |
| `rebuild/m3/w7-preview/today/reading-host.mjs` | 121 | 6723 | `c28273b8c5b410068cd236a943002147f57dbea7a1c59f55543d9b134cd7dcec` |
| `rebuild/m3/w7-preview/today/screens.template.html` | 241 | 11840 | `041d75f3ebf91764f29e63d90f94d43da659fc22090137e928ab9f3114b5b418` |
| `rebuild/m3/w7-preview/today/test/adapter.test.cjs` | — | — | **deleted** (→ `.mjs`) |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | 336 | 16931 | `82ee5614bc43fc317d8eccac96a4db7ef6dfb4a47b2d77852634cac707db47b4` |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | 191 | 11039 | `cd68e2db2440d8f0a62b95b3bac1f54078416c218280466fd84c58e3451eebff` |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | 919 | 50426 | `1117d79420de9249a4fa1bbd32360c40b6712decbfde731afc050e4aff6d5915` |
| `rebuild/m3/w7-preview/today/test/package.test.cjs` | 185 | 10149 | `dd5f22ca9305ede3604e3786acdfbc6b586125100efc681b39c8c1d5ccbc5532` |
| `rebuild/m3/w7-preview/today/test/view.test.cjs` | — | — | **deleted** (→ `.mjs`) |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | 575 | 29099 | `39137c139f3c2ddc915fdad56f85ba7d0d970d1efefcf7e4a392e031c2fa610b` |
| `rebuild/m3/w7-preview/today/today-app.cjs` | 436 | 22013 | `8a14c39b924341fb07f05fd287c09a89294e3badbd8c8fe5ff0c80f088ac9626` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 120 | 6013 | `fa313c14ef1a962a63086b6efd34938959eea0548ee1f5aa50708027a92e9c98` |
| `rebuild/m3/w7-preview/today/today-model.cjs` | 280 | 14393 | `7377bf2da6d839a9d6fcbba2fd74306239597e6e55ff60f5f7a5a33bf75d8ac8` |
| `rebuild/m3/w7-preview/today/web-storage-backend.cjs` | — | — | **deleted** (review B2) |
| `rebuild/slice/pwa/browser-offline-check.mjs` | 172 | 9543 | `6823e3270e4ce4333286b39f4ca59eacf5088ffaa233b79aa99a8ab063ae7555` |
| `rebuild/slice/A2-REPORT.md` | — | — | this file |

All UTF-8, no BOM, LF only (checked, not assumed).

**Two A1 test files changed extension** (`adapter`, `view`): they now drive the
real encrypted reading lane, which is ESM. Their content is A1's, claim for claim
(§6), against the storage the product actually uses.

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
node --test rebuild/m3/w7-preview/today/test/design.test.cjs rebuild/m3/w7-preview/today/test/adapter.test.mjs rebuild/m3/w7-preview/today/test/view.test.mjs rebuild/m3/w7-preview/today/test/package.test.cjs
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
* **The weigh-in moved into the same machinery (review B2).** A1 kept it in
  `localStorage`; a real `taskkill /F /T` loses recent localStorage writes, which is
  exactly what an iOS tab termination does, so a reading the screen called saved
  could vanish. `reading-host.mjs` now writes it through the accepted durable public
  client into an encrypted repository, and `today-model.cjs` holds no client, no
  backend, no storage and no lease of its own — it asks that lane for the client's
  own projection and hands it the athlete's entry. `web-storage-backend.cjs` is
  deleted; **nothing of record is in localStorage, and the browser check asserts
  `Object.keys(localStorage)` is empty.**
* **Two generations, one device, one key store — and the accepted layer is why.**
  One generation carries ONE authority lease with ONE `schema_version`;
  `rebuild/client` stamps a reading `schema_version: 1`
  (`ops.cjs: SCHEMA_VERSION = 1`) and a workout `2`
  (`index.cjs: schema_version: workout ? 2 : undefined`). Both files are pinned.
  Putting the weigh-in in the workout's generation is therefore **refused by the
  accepted layer** — `OPERATION_SCHEMA_MISMATCH`, state 20, zero operations written
  — and there is a test that executes exactly that. So the reading lane gets its own
  generation beside the workout's, encrypted with the same on-device store key,
  under the same on-device authority key. When an engine package unifies the two
  schemas, `reading-host.mjs` collapses into `gym-host.mjs`.
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
| `node --test …/today/test/gym.test.mjs` | **59 pass / 0 fail** (43 after round 1, + 16 for the REJECT) |
| `node --test …/today/test/{design.test.cjs,adapter.test.mjs,view.test.mjs,package.test.cjs}` | **64 pass / 0 fail** (A1's 58, + 6 net) |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs …/engine-equivalence.test.cjs` | **22 pass / 0 fail** (A0 unchanged) |
| `node --test rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19 pass / 0 fail** (pinned preview, untouched) |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`**, exit 0 |
| `node rebuild/m3/w6/test/run-current-head.cjs . --all` | **435 pass / 0 fail**, exit 0 |
| `node rebuild/m3/w7-preview/today/build.mjs` | `A1 TODAY BUILD PASS: 3 assets; 83 pinned inputs (13 engine, 12 client); approved design pinned; 61 bound classes; 2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference` |
| `node rebuild/slice/pwa/build-pwa.mjs` | `A5 PWA BUILD PASS: 13 files …; cache name earned-slice-075b99d8fd35a5a8415cdd21c9aa3a4f …; no network reference in any shipped byte` |
| `node --test rebuild/slice/pwa/test/{package,pwa,workflow}.test.cjs` | **53 pass / 0 fail** |
| `node rebuild/slice/pwa/browser-offline-check.mjs` | PASS (tail below) |
| `node rebuild/m3/w7-preview/today/browser-check.mjs` | PASS (tail below) |
| `node rebuild/m3/w7-preview/today/gym-check.mjs` | PASS (tail below) |

```
A2 GYM BROWSER CHECK PASS — TWO TRAINING DAYS across three REAL process kills. DAY 1:
Today -> weigh-in -> Start -> active set (prescription shown separately from editable
performed values, no effort preselected) -> refusal without an effort answer -> logged
with an explicit unknown effort -> saved facts + Undo + rest + next set -> Undo removed
it -> relogged -> REAL PROCESS KILL (taskkill /F /T on every chrome.exe of the persistent
profile, kill verified) -> the weigh-in AND the in-progress workout both came back out of
the encrypted store and the session resumed at the next set -> finished -> Today says
recorded, through a reload, a new page and a SECOND real kill. DAY 2 (2030-02-05, the
page's own entry point over the same device storage): prepares -> weigh-in -> Start ->
every set -> finished; a THIRD real kill, and the history still reads with BOTH sessions
(14 ops, exactly one Start descending from nothing) and both mornings still in the
encrypted reading store. localStorage holds nothing. Headroom: active set 118px headroom,
saved set 64px headroom, active set 1 118px headroom, saved set 1 64px headroom, active
set 2 118px headroom, saved set 2 64px headroom, active set 3 118px headroom, saved set 3
64px headroom, Today, workout recorded 102px headroom. No network request; no prototype
figure on screen; every input >= 16px; no horizontal overflow.
```

That tail carries the whole of the reviewer's point 5, so it is worth spelling out
what it now proves that round 2's did not. The page is opened on the **next day**
through `boot({ today })` — the product's own entry point, no test double — over
the storage day 1 left behind. The **shipped** preview fixture is tried first and
refuses with the ENGINE's own `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`, writing
nothing (§9.1); then the athlete DECISIONS:100 names — fresh, no ported log — runs
a whole second session through the screen. After a third real kill the durable
history still reads, holds **both** sessions and **14** operations, and exactly
**one** Start has empty `causal_parents`: the first. Day 2's descends from day 1's
close. Under round 2's build this sequence could not have been written at all.

```
A1 TODAY BROWSER CHECK PASS — mounted, weighed in (This morning ✓ 179.4 lb), spike note
shown, impossible weight refused, survived a real reload and a new page; primary action
inside the 390x844 viewport in both states (bottom 798 and 740 of 842; 44px and 102px of
headroom); the reading survived a REAL process kill (taskkill /F /T on 7 chrome.exe of a
persistent profile, kill verified) and localStorage holds nothing; no network request; no
prototype figure on screen; 15 engine headline titles swept in both states — worst
headroom 11px before / 10px after; 4 title(s) fitted down to 42/45px (33px floor never
reached); unwired entry points labelled on Today's face
```

```
A5 OFFLINE LAUNCH CHECK PASS — installed one worker over the host's own headers; cache
earned-slice-075b99d8fd35a5a8415cdd21c9aa3a4f holds all 11 files; preflight read
"offline-ready ✓" only after verifying them; with the network OFF Today rendered from the
engine, a weigh-in (This morning ✓ 178.2 lb · spike — damped in trend) was recorded and
survived a reload and a new page; the same folder with the worker blocked could not open
offline at all; no page error and no offsite request.
```

**The kills are real** (review B2). Both checks run on a **persistent Chromium
profile**, enumerate every `chrome.exe` whose command line names that profile,
`taskkill /F /T` each one, **assert the processes are gone**, and only then
relaunch. `context.close()` is a graceful shutdown — it lets the browser flush
what it was holding, which is precisely the case that hid the localStorage defect —
and it is no longer used for any step this report calls a kill.

### The 59 gym tests, by what they prove

**The abandoned session, and the way out (5, new for the REJECT).** Day 1 starts and
logs one set and stops. The next day, on a new host over the same storage, the
screen reports `phase: 'unfinished'` — carrying the layer's own
`WORKOUT_HISTORY_RECONCILIATION_REQUIRED`, the **day** the session belongs to, its
`startId` and how many sets it holds — and naming it writes nothing. The recovery
then writes exactly **one** operation, a `session-close` whose
`payload.completion_kind` is the layer's own `early` and whose first causal parent
is the Start; the set the athlete actually did is still `included`; and today
becomes `ready`. A storage fault during that close is reported as a refusal with
nothing recorded, and with no way to reach the session's own day the recovery says
`WORKOUT_RECOVERY_UNAVAILABLE` and writes nothing.

**Multiple days across page loads (14, new for the REJECT).** Two groups. *"A FRESH
athlete trains day after day, each day on a NEW page load"* conducts day 1 (`ops
0→6`, phase `active` after the Start, Finish `ok`, `settled: finished`) and day 2
on a brand-new host over the same storage (`ops 6→12`, its Start's
`causal_parents` asserted **equal to day 1's close op id**), then a rest day that
writes nothing, then the first wall with nothing written, then six later days each
asserting that `readWorkoutHistory` still reads, both sessions are still there and
the op count has not moved. *"The causal frontier is DERIVED from the durable log,
never remembered"* pins the mechanism: an empty store has no tip; a host that has
written nothing reports the stored tip immediately (and has resolved nothing merely
by opening); what the probe resolves is byte-for-byte what the Start writes; the
screen refuses an unorderable Start and writes nothing; Start re-checks at the
moment of writing, so a store that moves BETWEEN probe and tap still cannot produce
a bad write; a day containing an Undo has **two** tips and an open session has one
per unclaimed op, both carried whole; and the guard itself is exercised over
generations written by hand, including round 1's exact parents on round 1's exact
store.


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

**The gym screens in jsdom over the real durable store (5).** The plan, effort
sentence, entry title, both performed boxes, the five choices (all
`aria-pressed="false"`), the strip and the log label are all bound to the model's
DTO; the log button refuses without an effort answer **in the approved words**;
choosing one and logging lands on the saved screen with the stored facts, Undo, the
rest note, the next plan and `Ready for set 2`; **a layer refusal on the gym screen
names the layer and not the device**, carries its code exactly once and its own
reason, and shows no prescription figure (review B1); and **no digit appears on
either screen outside a bound slot**.

**Today's workout state (4).** Before a weigh-in the primary action is the engine's
marching order; after it, `Start <title>`; with a workout in progress,
`Workout in progress` + `Resume <title>` — including when the morning is still owed,
so an unfinished session can never become unreachable; when finished,
`Workout recorded` + `Review today’s workout`.

**When the layer will prepare a workout, and when it will not (2 more).** Executed,
so §9.1 cannot drift from it. A **second session the same day** is refused
`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` / `resolver_failed`, and Today shows the
day as recorded rather than offering a Start that would fail. For an athlete
carrying a **legacy session log**: the first session records and closes, and then
**every** later scheduled day refuses `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` — a
refusal that carries no reason, and none is invented. Each of these refusals is
read for its wording as well as its code: the layer's own reason, and **never its
code twice**.

### The changes to A1's own tests

All are **strengthenings**, not removals. A1 is **63 / 0** at this head (was 58).

* `adapter.test.cjs` → **`adapter.test.mjs`, 20 tests** (was 18). Every claim A1
  made about the weigh-in is re-made against the **real** durable lane instead of a
  Web Storage backend: the client mints the id, the operation and its outbox entry
  are one transaction, an injected IndexedDB **quota fault** leaves the generation
  byte-identical and the screen is told, a relaunch over the same encrypted bytes
  restores every projection and writes **not one byte**, and every refusal (empty
  value, repeat same-day, the 60–400 lb form bound, an evicted store) behaves as
  before. Three tests are new: the stored reading really is the **client's own**
  projection; a weigh-in on the workout's schema-2 lane is refused
  `OPERATION_SCHEMA_MISMATCH` with nothing written; and the device key store keeps
  one enrolment across relaunches with **both keys non-extractable** (an export
  attempt is asserted to reject).
* `view.test.cjs` → **`view.test.mjs`, 22 tests** (was 20). Same assertions, now
  awaiting the real transaction. Two are new since the first round: with no workout
  host the entry point says *"could not be opened on this device"*, names the
  missing store, does **not** claim the feature is unbuilt and shows no digit; and
  Today's workout states come from the **injected** host and nowhere else. One more
  is new in this round: **a refused preparation is shown on Today with the layer's
  code exactly once, "ready"/"Start" are not offered, and the device is not blamed.**
* `design.test.cjs` — **11 tests** (was 10). The copy count includes
  `PREVIEW_RUNTIME_COPY`; a new test asserts every entry of that list is **absent**
  from the approved references and really said by a view module, with a negative
  control; and the vacuous "includes a newline" assertion is replaced by one that
  proves each declared view source is actually scanned.
* `package.test.cjs` — **10 tests**, one strengthened: the page ships **no key
  literal at all** (no JWK `d`, no PEM, no private-key string), generates its own
  AES-GCM and ECDSA keys, and generates them non-extractable.

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
13. **`Setup →` is on the active-set screen and NOT on the rest screen** — stated
    because the reviewed `Refinement-Rest.png` shows it there. On the rest screen
    the athlete has just finished the set; the setup note is guidance for performing
    one, and the rest screen's job is the saved facts, Undo, the rest state and the
    next set. It costs a row of height on a screen whose primary action has 64px of
    headroom. Reversible and cheap if the reviewer disagrees; recorded rather than
    silently dropped, like `Options` and `All 9` (§7.10).
14. **The weigh-in's store of record is the encrypted repository (review B2).**
    Executed: a real `taskkill /F /T` loses recent localStorage writes, so a reading
    the screen called saved could vanish — and an iOS tab termination is exactly
    that. The weigh-in now goes through the accepted durable public client into an
    encrypted generation, `web-storage-backend.cjs` is deleted, and a device that
    cannot open an encrypted store **records nothing and says so** rather than
    falling back to a store that can lose it. Rejected: keeping localStorage as a
    cache (a second source of truth for a value that is already cheap to read is a
    liability), and inventing a write-through backend with a home-made two-phase
    commit when the accepted layer already provides an atomic one.
15. **The reading lane is its own generation** (§4). Not a preference: the accepted
    layer refuses the alternative, with a test that executes the refusal.
16. **`weighIn()` is async, and the sheet awaits it.** The submit button disables
    itself for the duration, so the sheet can never close on a save that did not
    happen. Everything that reads — `read()`, `storedReads()` — stays synchronous,
    because the client's own published face is synchronous; only the write waits.
17. **Today probes preparability before it offers anything (review B1).**
    `gym-model.read()` already prepared through the accepted host without storing
    anything; Today ignored the answer. It no longer does (§0). A refusal from the
    layer is shown in the layer's own terms and is never called a fault of the
    device; the device sentence is used only when the page has no workout host at
    all. Rejected: a disabled primary action with no explanation, and any sentence
    of my own about why the engine refused.
18. **The causal frontier is DERIVED, never remembered (the REJECT).** The choice
    on the table was the reviewer's own wording — *seed* `causalParents` from the
    durable log at host creation. What is implemented is stronger: there is no
    seed and no per-host state to seed. The accepted resolver is handed the exact
    generation the client is about to write against, so `causalTips(generation)`
    computes the parents at the moment of resolution, from those bytes. The tips
    are every op no other op names as a parent — after a closed session, exactly
    its close; on an empty store, `[]`. Rejected: seeding at construction (a value
    computed once is a value that can go stale — a long-lived page, a second host
    on the same store, a tab left open across midnight); and reading the "last
    session" by date or by device sequence, both of which would be my ordering
    rather than the log's causal one, which is exactly what
    `rebuild/m4/workout/engine-order.cjs` refuses to accept from anyone.
19. **An unorderable Start is refused BEFORE it is written, because there is no
    "after".** The reviewer asked for the accepted resume/close path to be offered
    if a written Start blocks the next read. It cannot be: the order refusal takes
    down `readWorkoutHistory`, and `prepareWorkoutContinuation` authenticates that
    same history, so the close that would retire the Start is refused too. The
    brief's instruction for exactly this case is to refuse before writing, and that
    is what happens — at the probe, and again on the tap against the generation the
    write will land on. The guard is deliberately not a restatement of the
    derivation: it takes the parents the resolver actually produced and checks them
    against the Starts the log already holds, so a resolver that drifts is caught
    by an independent computation rather than by its own opinion of itself.
20. **`boot()` accepts a `basisState`.** One injection point beside `today`,
    `model`, `indexedDB` and `crypto`, used by the checks and by nothing in the
    page. It exists because the shipped preview athlete carries a ported log and is
    walled by the engine on day 2 (§9.1), so the browser could not otherwise
    conduct the two days DECISIONS:100's fresh athlete actually gets. The browser
    check asserts **both**: the shipped athlete's engine refusal with nothing
    written, and the fresh athlete's second whole session. Rejected: a URL
    parameter or a stored flag (real product surface, reachable by a user), and
    changing the fixture (that is A1's, and accepted).
21. **The abandoned-session recovery is offered on Today's EXISTING primary
    action, and it uses the layer's own `early` close.** Three choices inside this
    one. *Where:* Today's single primary button already changes its label and its
    action with the state (`Start …`, `Resume …`, `Review today's workout`,
    `Why today's workout cannot open`); `Close the unfinished workout` is one more
    of those, so no element is added to an owner-approved screen. *What:* the
    accepted `completion_kind: 'early'` — the kind the capture layer already
    carries for a session that did not finish. Rejected: `normal` (it would claim
    the athlete completed sets they never did) and anything that removes the Start
    (the log is append-only, and the sets that were done are real). *How:* on a
    host standing on the session's own day, because the accepted continuation
    prepares the CURRENT capture and refuses a slot mapping that does not match —
    `WORKOUT_RESUME_SLOT_MAPPING_REQUIRED`, executed, not assumed. Rejected:
    closing it silently on the athlete's behalf at boot (a durable write nobody
    asked for), and leaving it documented as a limit (the reviewer is right that a
    recoverable trap should be recovered, not annotated).

---

## 8. Mutants — run, and what killed them

Each mutant was applied as ONE exact string replacement, the named tests were run,
the file was restored, and the restored sha256 was checked equal to the original.
Driver output is reproduced verbatim:

```
M1 the enrolment drops the outbox accounting the client requires — KILLED (80 failing) — restored byte-for-byte
M2 a refused set is reported as saved — KILLED (4 failing) — restored byte-for-byte
M3 the rep target is computed locally instead of read from the capture — KILLED (4 failing) — restored byte-for-byte
M4 an effort answer is preselected — KILLED (4 failing) — restored byte-for-byte
M5 Undo hides the set instead of removing it — KILLED (2 failing) — restored byte-for-byte
M6 a previous-performance line is invented when the engine has none — KILLED (2 failing) — restored byte-for-byte
M7 the host stops refusing a split that is not in force — KILLED (6 failing) — restored byte-for-byte
M8 the gym card claims a wired workout when Today has no host — KILLED (3 failing) — restored byte-for-byte
B1-M9 Today calls a REFUSED workout ready and offers Start — KILLED (1 failing) — restored byte-for-byte
B1-M10 an ENGINE refusal is blamed on the device — KILLED (2 failing) — restored byte-for-byte
B1-M11 a refusal prints its code twice (CODE · CODE) — KILLED (2 failing) — restored byte-for-byte
B2-M12 the weigh-in is acknowledged before the repository transaction completes — KILLED (3 failing) — restored byte-for-byte
B2-M13 the reading lane takes the workout lane's schema, so its writes are refused — KILLED (23 failing) — restored byte-for-byte
B2-M14 the screen reads its own cache instead of the client's projection — KILLED (17 failing) — restored byte-for-byte
R2-M15 the causal frontier is remembered per page load instead of derived from the log — KILLED (9 failing) — restored byte-for-byte
R2-M16 the pre-write order guard is switched off on the screen — KILLED (3 failing) — restored byte-for-byte
R2-M17 the probe says ready without running the order check — KILLED (3 failing) — restored byte-for-byte
R2-M18 Start writes first and checks afterwards — KILLED (2 failing) — restored byte-for-byte
R2-M19 the tip walk stops at the first parent, so an older session is left unreachable — KILLED (2 failing) — restored byte-for-byte
R2-M20 a claimed op is treated as a tip, so the frontier is not the frontier — KILLED (8 failing) — restored byte-for-byte
R2-M21 the abandoned session is closed as if it had finished normally — KILLED (2 failing) — restored byte-for-byte
R2-M22 an unfinished earlier session is reported as a plain refusal with no way out — KILLED (3 failing) — restored byte-for-byte
R2-M23 the recovery is reported as done before the layer acknowledges it — KILLED (2 failing) — restored byte-for-byte
R2-M24 Today offers Start over an unfinished earlier session — KILLED (1 failing) — restored byte-for-byte
```

24 applied, **24 KILLED, 0 survived**. M1–M8 are round 1's set and M9–M14 round
2's, all re-run unchanged against this code. M15–M24 are new, and exist because of
the REJECT.

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
* **B1-M9** makes Today's preparability probe return `phase:'ready'` whatever the
  host answered, so a refused workout still offers **Start**. This is the exact
  defect B1 named; the probe test catches it.
* **B1-M10** rewrites the gym screen's refusal lead to blame the device
  ("This device could not open your workout") when the cause is an engine refusal.
  This one **survived the first run** — nothing in the suite read the lead sentence
  — so a test was added ("a layer refusal on the gym screen names the layer, not the
  device") and the re-run killed it. The surviving mutant is reported because it
  found a real hole, not because the final count is prettier.
* **B1-M11** un-does the round-2 de-duplication in `refusalOf`, so a refusal whose
  message equals its code prints `CODE · CODE`.
* **B2-M12** returns `{ok:true}` from `weighIn` before awaiting the client, i.e. the
  old localStorage-shaped optimism. The durability tests catch a weigh-in
  acknowledged with nothing in the repository.
* **B2-M13** sets `READING_SCHEMA_VERSION = 2` (the workout lane's). Every reading
  write is then refused `OPERATION_SCHEMA_MISMATCH` — this is the mutant that
  *demonstrates* why the two lanes cannot share a generation (§7.15), rather than
  my asserting it.
* **B2-M14** makes the Today screen render from an in-memory cache it keeps itself
  instead of re-reading the client's projection, which is how a store-of-record
  quietly turns back into a cache. 16 tests fail.
* **R2-M15** is the REJECT itself, reduced to one line: the frontier stops being
  derived from the generation and goes back to whatever this host happens to
  remember. The multi-day tests fail — which is the whole point, because round 1's
  suite did not.
* **R2-M16 / R2-M17 / R2-M18** switch off the pre-write guard, the probe's use of
  it, and Start's use of it, one at a time. **M18 survived its first run**: every
  test reached Start through a probe that had already refused, so Start's own
  re-check was never exercised alone. The fix is a test for the race that makes it
  matter — the store changing BETWEEN the probe and the tap — and the re-run killed
  it. Reported because it found a real gap in the tests, not because 24/24 reads
  better.
* **R2-M19** stops the ancestry walk after two hops, so an older session drops out
  of reach; **R2-M20** inverts the tip filter so the "frontier" is made of ops that
  are already claimed. Both are the ways a derivation can look right and be wrong.
* **R2-M21** closes the abandoned session as `normal` instead of `early` — a
  recovery that quietly claims the athlete finished sets they never did.
* **R2-M22** drops the unfinished-session branch, so the screen falls back to
  printing `WORKOUT_HISTORY_RECONCILIATION_REQUIRED` with no way out: round 1's
  behaviour, and the trap the reviewer named.
* **R2-M23** returns success from the recovery without checking that the layer
  acknowledged the close. **It survived its first run** — the recovery's one write
  had only ever been exercised on the happy path — so a storage fault was injected
  into that close, and the re-run killed it.
* **R2-M24** makes Today offer `Start` over an unfinished earlier session, which is
  the screen half of the same trap.

Beyond these, the tests carry negative controls of their own: an injected IndexedDB
quota fault, four efforts outside the accepted domain, a split dated 2031, a second
Start over an open session, a one-byte tamper of an approved reference, a
preview-owned string that is actually approved, an invented class, an invented
phrase and a copied prototype figure.

---

## 9. LIMITS and SEAMS — in plain language

1. **The repeat-session seam — diagnosed twice, and only the second one is real.**
   Round 1 wrote this up as "a second workout on the same day is refused"; review
   round 1 was right that this was wrong. Round 2's rewrite was **also** wrong, in
   a way only a spike that CONDUCTS days could expose: it measured a probe, and a
   probe cannot see what writing does. Under round 1's code the fresh athlete never
   reached the day it named, because day +1's Start poisoned the log (§0).

   This is the spike as it stands now. Each row is a whole day driven through the
   screen's own actions on a **new host over the same storage** (a page load):
   probe → Start → every set → Finish. `ops` is the durable operation count before
   and after that day.

   ```
   === FRESH (DECISIONS:100 — the athlete S2 ships to) ===
   day+0  2030-02-04  probe=ready    started+recorded+closed                 ops 0->6
   day+1  2030-02-05  probe=ready    started+recorded+closed                 ops 6->12
   day+2  2030-02-06  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 12->12
   day+3  2030-02-07  probe=blocked  PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED ops 12->12
   day+4  2030-02-08  probe=blocked  PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED ops 12->12
   day+5  2030-02-09  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 12->12
   day+6  2030-02-10  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 12->12
   day+7  2030-02-11  probe=blocked  PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED ops 12->12
   day+8  2030-02-12  probe=blocked  PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED ops 12->12
   day+9  2030-02-13  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 12->12
   day+10 2030-02-14  probe=blocked  PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED ops 12->12
   day+11 2030-02-15  probe=blocked  PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED ops 12->12
   day+12 2030-02-16  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 12->12
   day+13 2030-02-17  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 12->12

   === LEGACY (the preview fixture, carrying a ported session log) ===
   day+0  2030-02-04  probe=ready    started+recorded+closed                 ops 0->6
   day+1  2030-02-05  probe=blocked  PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED ops 6->6
   day+2  2030-02-06  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 6->6
   day+3  2030-02-07  probe=blocked  PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED ops 6->6
   day+4  2030-02-08  probe=blocked  PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED ops 6->6
   day+5  2030-02-09  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 6->6
   day+6  2030-02-10  probe=blocked  ENGINE_CAPTURE_NO_WORKOUT               ops 6->6
   day+7  … day+13    the same two codes, alternating with the rest days    ops 6->6
   ```

   **So, in one sentence: a FRESH athlete gets TWO whole training days, and the
   first genuine engine wall bites on day +3** — `2030-02-07`,
   `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` with reason `resolver_failed`. Days 0
   and 1 are this athlete's two distinct split days (Upper, then Lower); day +2 is
   a rest day; day +3 comes back to day 0's lifts, and the engine then needs the
   numeric native trend context no accepted host composes. A **LEGACY** athlete
   gets exactly ONE day and is walled from day +1 by
   `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`.

   Every row after the wall was checked for something stronger than a code: the
   durable history still READS, both recorded sessions are still there, and the op
   count never moves. A refused day writes nothing, and the log is never poisoned.

   Read plainly, there are **three distinct outcomes**, and A2 must not blur them:

   * `ENGINE_CAPTURE_NO_WORKOUT` is **not a refusal at all**. It is a rest day: the
     engine scheduled no session. The screen says so in those terms.
   * `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` (`reason: resolver_failed`) is the
     **fresh athlete's** wall. A fresh athlete records one session per *lift*
     happily; the next scheduled day whose lifts already have an app-recorded
     session refuses, because `rebuild/engine/performed.cjs` asks for a
     `nativeTrendContext` provider that no accepted host composes. A day with
     *different* lifts still prepares — which is why day +1 is green and day +3 is
     not.
   * `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` (no reason) is the **legacy
     athlete's** wall, and it is harder: an athlete carrying a ported session log is
     refused on *every* later scheduled day, including ones with untouched lifts,
     because the engine wants a legacy-order-mapping provider to reconcile ported
     history with native facts.

   **The control.** Today never guesses which of the three it is in. `today-entry.mjs`
   runs a **preparability probe** before it offers anything: it calls `gym.read()`,
   which prepares through the accepted host and *stores nothing*, and keeps the
   resulting `{phase, sets, code, copy}`. On `phase:'blocked'` Today shows the
   layer's own words with the layer's own code **exactly once**, offers
   `Why this workout can't open` instead of `Start`, and never prints the
   device-fault copy. Three tests hold this shut (view.test.mjs "a refused
   preparation is shown on Today, with the layer's code once and no device blame";
   gym.test.mjs "a layer refusal on the gym screen names the layer, not the device")
   and three mutants (B1-M9/M10/M11) confirm each half independently.

   **The path S2 actually needs is CONDUCTED, not probed.** DECISIONS:100 says Joe
   starts **FRESH** at S2, so the fresh daily path is what S2 ships on.
   *"A2 — a FRESH athlete (DECISIONS:100, Joe at S2) trains day after day, each day
   on a NEW page load"* drives it: day 1 prepared, started, every set recorded,
   closed (`ops 0→6`); day 2 on a new host over the same storage, the same again
   (`ops 6→12`) with its Start's `causal_parents` asserted to be **exactly day 1's
   close**; day 3 a rest day that writes nothing; day 4 the first wall with nothing
   written; then six later days each checked for a readable history, two intact
   sessions and an unmoved op count. A second group,
   *"an athlete carrying a LEGACY session log (Joe after the S3 port) is refused a
   second session outright"*, pins the other code so a future provider cannot land
   silently. The browser check runs the same two days for real (§6).

   **Where the fix belongs.** Both are **engine-tier provider gaps, not screen
   work**: the *native trend-context provider* and the *legacy-order-mapping
   provider*. They are pinned code (`rebuild/engine/**`), forbidden to A2 by the
   brief, and nothing A2 could add to a screen would make them prepare. They are
   **Track B / lane B items**, and this section is the handoff. Until they exist,
   S2 gives Joe a correct first session per lift, correct rest days, and an honest
   refusal in the layer's own words on the days it will not prepare — which is what
   the accepted layer can truthfully support today.

   **What this is NOT.** It is not the round-2 defect. That one was A2's own
   (`causal_parents`), it wrote to disk, it could not be recovered, and it is
   fixed. These two are engine refusals that write nothing and leave the log
   readable. The difference matters because it decides who fixes what: the first
   was a screen-tier bug in my custody; these are provider gaps in someone
   else's. A reviewer should confirm that separation holds — see §10.0b.
2. **`previous performance` is reachable but thin.** For this synthetic athlete the
   engine returns a governing-last line from the fixture's own session log, so the
   line renders; for an athlete with none it is absent, and a test proves both
   directions. Nothing proves it across two *native* sessions of the same lift,
   because of limit 1 — that is exactly the provider the trend-context gap names.
3. **Two encrypted generations, one device, one key store (review B2).** Round 1 kept
   the weigh-in in `localStorage`, which a real `taskkill /F /T` would have lost. It
   no longer does: the weigh-in is written through `rebuild/client` into its own
   accepted encrypted-IndexedDB repository (`reading-host.mjs`), the same machinery
   as the workout, with the operation and its outbox entry sealed in one
   transaction. `localStorage` is no longer read or written by the Today lane at
   all; `web-storage-backend.cjs` was deleted.

   They are two *generations*, not one, and that is forced rather than chosen: the
   pinned durable client stamps `schema_version: 2` on a workout and `1` on a
   reading, and the lease binds a generation to exactly one schema, so a mixed
   generation is refused `OPERATION_SCHEMA_MISMATCH`. Mutant **B2-M13** is that
   proof — giving the reading lane the workout's schema fails 22 tests. One device
   key store enrols both, so one device unlock covers both, and a real process kill
   (verified PIDs, `taskkill /F /T`, poll-to-zero, relaunch) leaves both the weigh-in
   and the in-progress workout present. Collapsing them into a single generation is
   a **client-tier** change (schema/lease binding), not a screen one.
4. **No skip and no correction; early finish only as a recovery.** The accepted
   layer supports three things A2 does not fully wire (`skip`,
   `completion_kind: 'early'`, `correct`). `early` is now wired, but for one
   purpose only: closing a session abandoned on an **earlier** day, which otherwise
   blocks every later day (review round 2, point 3). Within the day itself the
   Finish action still appears only when every slot is recorded and still closes
   `normal`, and Today keeps offering **Resume** — so an athlete who wants to stop
   a session short *today* still has no button for it, and must either finish it or
   leave it until tomorrow, when the recovery offers the early close. That
   asymmetry is deliberate rather than overlooked: an in-day early finish is a
   product decision about what a partial session means for the engine's next
   prescription, and it belongs to the owner, not to a builder closing a review
   finding. `skip` and `correct` remain unwired entirely.
5. **No rest timer** (§7.5), and no rest length anywhere.
6. **`Review today’s workout` is a label, not a screen.** Tapping it opens the gym
   card, which reports the session is recorded and how many sets it holds. There is
   no read-only history view of the sets. Named, not hidden.
7. **The new tests are NOT in CI, and round 2 widened that.** Same reason as A1 §8.2
   and A5: `rebuild.yml` is pinned by the accepted NATIVE-CARRIERS artifact, and
   A5's `slice-host.yml` is outside A2's custody. `gym.test.mjs` needs
   `rebuild/m3/w6`'s own dependencies (`fake-indexeddb`, via
   `rebuild/m3/w6/test/support.mjs`) exactly as `package.test.cjs` and both browser
   checks already do. Round 2 makes this **larger**, and it must be said plainly:
   moving the weigh-in onto the real repository forced A1's
   `today/test/adapter.test.cjs` and `today/test/view.test.cjs` to become `.mjs`
   (they now open a real IndexedDB lane and await it), so those two files also need
   `fake-indexeddb` and also fall outside what the pinned workflow runs. Local
   totals are green (§6) and the re-seal that adds them is the same batched one A1
   and A5 are already queued for — but until that lands, **CI does not execute these
   63 A1 tests or the 43 gym tests**, and a reviewer should treat §6's local tails,
   not a green CI badge, as the evidence.
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
13. **The process kill is a real kill, and it is Windows-only.** Round 1 called
    `context.close()` a "process kill"; it is a graceful shutdown and the label was
    wrong. Both checks now enumerate the chrome.exe PIDs whose command line carries
    the persistent profile path (`Get-CimInstance Win32_Process`), run
    `taskkill.exe /F /T /PID` on each, poll until **zero** remain, assert zero, and
    only then relaunch against the same profile — and they assert that both the
    weigh-in and the in-progress workout are still there. The mechanism is
    `taskkill`/`Get-CimInstance`, so on a non-Windows runner that step must be
    re-implemented (`kill -9` over the same profile's PIDs); no such runner has been
    exercised. Every label that used to say "process kill" for a graceful close has
    been renamed to what is actually executed.
14. **`rebuild/slice/pwa/browser-offline-check.mjs` is one file outside A2's stated
    custody.** Three lines: it waited on the weigh-in dialog the way the other
    checks did, and the weigh-in is now asynchronous, so it had to learn the same
    wait or it would have gone red for a reason that is not about offline. Disclosed
    rather than folded in silently.
15. **What is NOT wired by A2:** the recovery check-in (A3), Dad's first run (A4),
    hosted sync, the nutrition detail beyond A1's two engine targets, the coach.
    Each still says so on Today's face.

---

## 10. What the reviewer should attack first

**The REJECT first. That is where the risk is.**

0z. **The causal frontier.** The claim is that a page load can no longer lose the
   lineage, because there is nothing to lose — the parents are recomputed from the
   generation being written. Attack the derivation, not the story. The two shapes
   that are not a single chain are pinned by tests, and both carry **more than one
   tip**: a day containing an **Undo** has two (the close, and the removal edit the
   close never names), and a session left **open** has one per unclaimed op. A
   Start that descends from every tip descends from everything, which is why this
   is carried whole rather than reduced to "the last close". Decide whether you
   agree with that reading, and look for a third shape I have not thought of. Then
   run more than two days — the spike stops at fourteen because the *engine* wall
   stops the athlete, but the *order* machinery is what I changed, and it deserves
   a longer run than the engine allows here.
0y. **The pre-write guard, and whether "refuse before writing" is the right
   answer.** I claim there is no accepted recovery once an unorderable Start is on
   disk, because the order refusal takes down the history read that resume and
   close both authenticate through. Check that claim directly: write such a Start
   by hand into a generation and try every accepted path to retire it. If one
   works, decision 19 is wrong and the screen should offer it.
0w. **The abandoned-session recovery.** This is the one place A2 adds a durable
   write the athlete did not explicitly ask for in the moment — they asked to close
   an old session, and the layer writes an `early` close. Read decision 21 and
   disagree with any of its three choices. Check in particular that a host built for
   *another* day cannot do anything except that close, and that closing a session
   on its own day does not disturb the causal tips in a way the next Start then
   inherits.
0x. **The multi-day tests themselves.** Round 1's suite was green while the product
   was broken, so the tests are now as much the deliverable as the code. Read
   `conductDay` and ask what it would let through. It asserts the phase after the
   Start, that Finish returned ok, and the op count — is that enough? Add a day 3
   to the browser check if you can find an athlete the engine will prepare one for.

0a. **B2, the store of record.** The claim is that the weigh-in is now as durable as
   the workout. Attack it: pull the plug harder than `gym-check.mjs` does, clear one
   generation and check the other is unaffected in the way §9.3 claims, check that
   nothing in the Today lane still touches `localStorage` (it should be absent, not
   merely unused), and check that the operation + outbox entry really are one
   transaction rather than two awaits that happen to both succeed. Mutant B2-M12 is
   the one to strengthen.
0b. **B1, the probe.** The claim is that Today never says "ready" for a workout the
   layer refuses. Attack the *ordering*: the probe runs at mount, so ask what a
   refusal that appears *between* the probe and the tap does, and whether
   `refresh()` is called everywhere it must be. Also check the corrected §9.1
   against the engine yourself — re-run the fourteen-day spike with your own
   fixtures and see whether the three outcomes really partition the way it says.
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
6. **The mutants.** Re-run all 24, and add your own: try storing a number for the
   unknown effort, try reading the strip's "logged" count from the screen rather than
   the log, try letting `finish()` close a session with an unrecorded slot, try
   writing a Start whose parents are yesterday's tip rather than today's. Note that
   **three mutants survived their first run** (§8): B1-M10, because nothing read who
   a refusal blamed; R2-M18, because every path to Start went through a probe that
   had already refused; and R2-M23, because the recovery's one write had only ever
   been exercised succeeding. All three gaps were in the tests, not the code, and
   all three were the same shape — a check that was never exercised on its own.
   Assume there are more, and aim there.
