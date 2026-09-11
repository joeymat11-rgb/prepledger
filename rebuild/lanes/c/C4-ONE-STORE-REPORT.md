# C4 — ONE STORE (builder's report)

**Branch** `rebuild/lane-c-today` · **base** `43470fe` (integration tip `6036dcf` = A1 Today +
A2 gym card, plus lane C's accepted C1/C1b/C2/C2b).

**What was asked.** Prove, in lane C's own files, that the PM's just-merged Today + gym card
can run over the accepted LOCAL ERA store as a drop-in — one encrypted generation holding
weigh-ins AND workout sets — so the PM can swap its two synthetic hosts for a file
replacement.

**What is claimed.** It runs. The page's own `today-model.cjs`, `gym-model.mjs`,
`gym-app.mjs`, `today-app.cjs` and `design.cjs` are imported **unmodified** and conducted
through A2's own journey over ONE sealed generation of the local era — in Node
(fake-indexeddb) and in a real Edge process across a real `taskkill /F /T`. Nothing under
`rebuild/m3/w7-preview/today/**`, `rebuild/m3/w6/host/**`, `rebuild/client/**`,
`rebuild/engine/**` or `rebuild/m4/**` was edited.

---

## 1. THE CRUX — what the pinned client actually does

A2 split Today into two encrypted generations, and `reading-host.mjs:15-25` gives the
reason: *"one generation carries ONE authority lease with ONE `schema_version`, and
`rebuild/client` stamps a reading `schema_version: 1` and a workout `schema_version: 2`."*
Lane C's local era carries ONE lease at `schema_version` **2**
(`rebuild/m3/w6/local/local-era.mjs:26` `LOCAL_ERA_SCHEMA_VERSION = 2`). So the question is
whether that single schema-2 generation can admit a schema-1 reading.

**It cannot through the public client, and it can through `rebuild/client` itself.** Both
halves executed, not read:

| file:line | what it does |
|---|---|
| `rebuild/client/ops.cjs:18,59` | `SCHEMA_VERSION = 1`; `schema_version: spec.schema_version == null ? SCHEMA_VERSION : spec.schema_version` — an operation with no explicit schema is **1**. |
| `rebuild/client/index.cjs:226` | `schema_version: workout ? 2 : undefined` — a weigh-in therefore stores as **1**, a workout as **2**. |
| `rebuild/client/index.cjs:206` | `if (workout && cfg.lease.schema_version !== 2) return { state: 20 … }` — **the plain client gates ONLY a workout on the lease schema. A reading is not gated at all.** |
| `rebuild/m3/w6/public-client.mjs:238` | `… \|\| lease.schema_version !== schemaVersion) throw new StorageFailure("LEASE_PROOF_UNPROVEN", 18)` — a public client configured at schema 1 cannot even open a schema-2 era. |
| `rebuild/m3/w6/public-client.mjs:262-265` | `candidate.commit.batch.operations.some(op => op.schema_version !== lease.schema_version)` → `throw new StorageFailure("OPERATION_SCHEMA_MISMATCH", 20)` — a public client configured at schema 2 refuses the schema-1 reading in the sealed batch, before any write. |

**The executed probe** — `rebuild/m3/w6/test/local-schema-probe.mjs`, runnable on its own
(`node rebuild/m3/w6/test/local-schema-probe.mjs`, exit 0), and re-asserted as four cases in
`test/local-today-journey.test.mjs`:

```
lease.schema_version = 2   (rebuild/m3/w6/local/local-era.mjs LOCAL_ERA_SCHEMA_VERSION)
A public client schemaVersion:2 execute('weighIn') -> acknowledged=false state=20 code=OPERATION_SCHEMA_MISMATCH
B public client schemaVersion:1 reopen -> refusal={"acknowledged":false,"state":18,"code":"LEASE_PROOF_UNPROVEN"}
B public client schemaVersion:1 execute('weighIn') -> acknowledged=false state=18 code=LEASE_PROOF_UNPROVEN
C C1 execute('weighIn') -> acknowledged=true state=1 op_id=op-probe-device-1
C stored ops = 1; schema_versions = [["reading",1]]
C lease_ids = ["local-era:9f7e1b2119064b3c06e45958216dfeae"]
VERDICT: the pinned public client CANNOT admit a reading under the schema-2 local-era lease;
         C1's own bridge CAN, into the SAME generation.
```

**So A2's diagnosis was right about the public client and wrong about the store.** Two
generations are not forced by the schema; only two *clients* are. The honest design is ONE
INSTALLATION, ONE REPOSITORY, ONE GENERATION, TWO WRITE PATHS:

```
weigh-in  ->  local-client.execute("weighIn")               (C1's bridge, rebuild/client)
workout   ->  composeWorkoutHost over client.hostBindings()  (the durable public client)
```

Both commit through the **same `repository` handle**, so they serialise on the repository's
own compare-and-swap — `repository.mjs:239` `STALE_REVISION` (retryable, the bridge retries
up to four times) and `repository.mjs:240` `HEAD_CHANGED_WITHOUT_REVISION`. Neither path can
overwrite the other's operations; §4 is the executed proof.

---

## 2. What the drop-in provides

`rebuild/m3/w6/local/today-bindings.mjs` (new, 324 lines).

```js
const era      = await openTodayOverLocalEra({ indexedDB, crypto, databaseName, namespace,
                                               athleteId, deviceId, clock });
const readings = await era.createReadingHost({ day });                        // reading-host.mjs shape
const gymHost  = await era.createGymHost({ day, engineState, plannedSplitSlotId }); // gym-host.mjs shape
```

* `era.createReadingHost(...)` returns **every member `reading-host.mjs` returns** —
  `repository, client, device, day, namespace, databaseName, lease, openedRefusal, face,
  reads, paint, label, blockedCopy, weighIn, restart, outboxRetained, close` — so
  `today-model.cjs` binds to it with no change. `weighIn` goes through C1's `execute()`.
* `era.createGymHost(...)` returns **every member `gym-host.mjs` returns** —
  `host, repository, engine, day, plannedSplitSlotId, device, causalParents, causalTipsNow,
  startOrderRefusal, close` — so `gym-model.mjs` and `gym-app.mjs` bind to it with no change.
  The host is the accepted `composeWorkoutHost`, every durable-client member coming from
  `client.hostBindings()`.
* **Each gym handle takes its own `hostBindings()`** — a fresh T2 stage closure and commit
  validator over the same repository — so today's card and the transient `hostForDay` used
  to retire an abandoned session cannot share staging state.
* **`close()` on a handle detaches that handle only**; `era.close()` ends the page. A2's two
  hosts owned separate repositories and could close them; here `gym-model.closeUnfinished`
  closes the transient host in a `finally`, and that must not take the page's store with it.
  Asserted.
* **Nothing of the page's device material is taken.** `indexedDB` / `crypto` /
  `databaseName` / `namespace` passed to a factory must equal the installation's or the call
  is refused by name (`LOCAL_ERA_STORE_MISMATCH` …); a caller-minted `deviceKeys` is ignored
  and **recorded** on `era.ignored()`, never quietly honoured. The journey asserts
  `era.ignored()` is empty.
* **`causalTips` / `startOrderRefusalOf` are A2's own functions**, carried verbatim with
  provenance and pinned **by source** in the test (`String(mine) === String(theirs)`), so
  the drop-in refuses exactly the Starts the page refuses today. `PLAN_BASIS`, `INPUT_BASIS`,
  `RESUME_REASON` and `PRODUCER` are pinned by value against the page's exports. The module
  imports nothing from `w7-preview` (w6 must not depend on the page, and after the swap
  `gym-host.mjs` is gone) — the test does the importing.

**What the swap removes:** the constant `IDENTITY_KEY`, the static `ENROLMENT_EVIDENCE`, the
page-minted AES/P-256 device keys, the fixed 'synthetic-preview' checkpoint label, the
fixed-window never-renewed lease, the silent re-enrolment on an erased store, and the second
generation. What replaces them is the installation's own era (sealed inside the generation
it authorizes), `local-keys.mjs` non-extractable key custody, real first-run evidence, a
three-signal restore-required verdict and a self-renewing 400-day lease.

---

## 3. Evidence

### `rebuild/m3/w6/test/local-today-journey.test.mjs` — **35/35**

| block | what it conducts |
|---|---|
| 1 · the crux | the four probes above, as assertions, over a live era |
| 2 · A2's journey | weigh-in → Today moves because the engine moved → Start (one `session-start`, v2 capture) → a set with explicit **unknown** effort (`{tag:'unknown'}` stored, never a number) → **Undo** (the accepted removal edit; the set stays on disk) → every set → finish → the gym screen rendered through `mountGym` over the approved templates → Today's own screen through `mountToday` → **ONE SEALED GENERATION** → nothing synthetic in the sealed metadata → **kill and reopen through a new factory** |
| 3 · two days | day 1 whole session; day 2 on a NEW page load with a weigh-in written first — the frontier carries **both** tips, the pre-write order guard passes, and day 2's Start descends from day 1's close |
| 4 · resume & recovery | a new page load on the same day resumes at the next set with the Start **byte-identical**; the next day names *which* day is unfinished and the accepted `early` close retires it in one operation |
| 5 · partial erasure | the drop-in refuses with C1's own code for all three signals; the page's `reading-host.mjs` silently re-enrols over the same erasure |
| 6 · no lost update | a reading and a set committed concurrently (§4) |
| 7 · the pins | source-identity and value pins against the page's own hosts; shape pins member for member |
| 8 · the proposed patch | the PM's `createWorkoutEntry` **with the patch applied**, driving `mountToday` + `mountGym` end to end over the one store |

The ONE-GENERATION assertions, in full: `collections.ops` holds **9** operations after the
journey — 1 `reading` (schema 1) and 8 `session` (schema 2); `meta.checkpoint.counts` equals
the whole generation's `{ops, outbox}`; `meta.device.seq` equals the op count; there is
exactly **one** `lease_id` across both write paths; the device sequence is contiguous
1..9; and `[...new Set(schema_version)] === [1, 2]` **in the same generation**.

### `rebuild/m3/w6/test/local-today-browser.mjs` — real Edge, **5/5**, exit 0

```
W6 LOCAL-TODAY-BROWSER PASS — 5/5 real IndexedDB cases; 152.0.4191.66;
killed 9 msedge.exe process(es) with taskkill /F /T;
weigh-in + workout in ONE sealed generation, one lease, one checkpoint;
103 pinned bundle inputs
W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)
```

The bundle is the page's **own** `today-model.cjs` and `gym-model.mjs` imported into
`local/today-browser-entry.mjs` and built by the unchanged `build-browser.mjs` (same
Node-import allowlist, authority exclusion, cipher and typography pins). Inside the page the
morning weigh-in goes through `today.weighIn(179.4)` and the set through `gym.logSet(...)`;
then every `msedge.exe` naming the persistent profile is killed with `taskkill /F /T`, the
kill is **verified** before the next launch, and a new browser process over the same profile
finds 3 operations, one lease, one checkpoint, the reading at 179.4 lb, and the session
resuming at set 2. `Object.keys(localStorage).length === 0` at every step.

Exit 2 = BLOCKED without `W6_BROWSER_BIN` / `playwright-core`; never a silent pass.

### Regression

| gate | result |
|---|---|
| W6 suite (`test/*.test.mjs`) | **530/530** (495 before + 35 new), exit 0 |
| today tests (`w7-preview/today/test/*.test.*`) | **123/123**, exit 0, files untouched |
| host (`w6/host/test/*.test.*`) | **22/22**, exit 0 |
| C1 bite (`test/local-bite.cjs`) | 4/4 **DETECTED** then `LOCAL BITE RESTORED PASS — 3bf8c01d7e2b28fd…`, exit 0 |
| bundle bytes | `local.js` **BYTES UNCHANGED** `f4a85fcf62e0c1bb` (38/38 inputs); `host.js` **BYTES UNCHANGED** `0380052e57a3226e` (97/97) — built from `git show HEAD:…/build.mjs` and from the edited one, sha256 compared |
| `local-host-browser.mjs` (C1b, real Edge) | 6/6, exit 0 |

---

## 4. Two findings ONE STORE creates that two stores could not

Both are consequences of the reading and the workout finally sharing a revision. Neither is
a defect in the drop-in; both are things a one-store page must know, and both are asserted.

**F1 — the causal frontier is now cross-lane.** `causalTips` returns every op no other op
names as a parent, and a weigh-in is such an op. So the first Start on a fresh device
descends from that morning's reading, and on day 2 the frontier carries **both** yesterday's
close and this morning's reading — the Start names both, and
`startOrderRefusalOf` (which only judges `session-start` ops) is satisfied. Asserted in
blocks 2 and 3. Nothing in `rebuild/m4/workout/engine-order.cjs` reads a reading, and the
day-2 test is the proof that a morning reading never displaces yesterday's close.

**F2 — a preparation held across a reading write goes stale.** `createWorkoutEntry` takes a
preparation at construction; if a weigh-in is written before `startPreparedWorkout`, the
accepted client refuses `WORKOUT_PREPARATION_STALE` and **writes nothing**. In A2's two
stores a reading could not move the workout generation at all, so this could not happen.
**The shipped screen never does it:** `gym-app.mjs` `paint()` calls `model.read()` — which
re-prepares — immediately before `model.start()`, so the product path (weigh-in → open the
card → Start) is safe, and block 8 drives exactly that path through `mountToday` +
`mountGym`. Executed both ways: the stale call refused by name with nothing written, the
product path green.

The same shape appears under genuine concurrency: a reading committed between
`prepareWorkoutContinuation` and `executeResumedWorkout` refuses the set
`WORKOUT_RESUME_STALE`, writes nothing, and the retry lands. The §6 test fires both writes
without awaiting either and asserts: the reading is on disk, **exactly one** set exists
(never two), no two operations share a `device_seq`, the checkpoint and `meta.device.seq`
both equal the op count. That is a refusal, not a lost update — which is the whole point of
the CAS.

---

## 5. REQUEST TO PM (exact patch)

Everything above runs without a single change inside `today/**`, except for one function:
`today-entry.mjs` `createWorkoutEntry()` and `boot()` import `createGymHost` /
`createReadingHost` as module bindings (`today-entry.mjs:16-17`) and call them directly
(`:26`, `:30`, `:83`). There is no injection point, so the page cannot be pointed at
another store without this hunk. **It is not applied here — `today/**` is PM-owned.**

The patch is additive and default-preserving: a page that passes no `hosts` gets exactly
what it gets today. **The patched `createWorkoutEntry` is executed** in block 8 of
`test/local-today-journey.test.mjs` (a verbatim copy with these three lines changed), so the
PM can see it working before applying it.

```diff
--- a/rebuild/m3/w7-preview/today/today-entry.mjs
+++ b/rebuild/m3/w7-preview/today/today-entry.mjs
@@
 export async function createWorkoutEntry(model, options = {}) {
   const view = model.read();
   const day = model.today;
-  const gymHost = await createGymHost({ day, engineState: model.stateFromOps(),
-    plannedSplitSlotId: "earned-today-preview/" + day, ...options });
+  /* ONE STORE. `hosts` is the only injection point: a page that supplies one
+     (rebuild/m3/w6/local/today-bindings.mjs openTodayOverLocalEra) puts the
+     weigh-in and the workout in ONE sealed generation; a page that supplies
+     none gets exactly the two synthetic hosts this module built before. */
+  const { hosts, ...lane } = options;
+  const openGym = (hosts && hosts.createGymHost) || createGymHost;
+  const gymHost = await openGym({ day, engineState: model.stateFromOps(),
+    plannedSplitSlotId: "earned-today-preview/" + day, ...lane });
   /* A host standing on some OTHER day, over the same device storage. Used only to
      close a session abandoned on an earlier day (gym-model.closeUnfinished). */
-  const hostForDay = (other) => createGymHost({ day: other, engineState: model.stateFromOps(),
-    plannedSplitSlotId: "earned-today-preview/" + other, ...options });
+  const hostForDay = (other) => openGym({ day: other, engineState: model.stateFromOps(),
+    plannedSplitSlotId: "earned-today-preview/" + other, ...lane });
   const gym = createGymModel({ gymHost, hostForDay,
     sessionTitle: view.workout ? view.workout.title : null });
@@ export async function boot(options = {}) {
   const doc = options.document || document;
   const failures = [];
   const day = options.today || undefined;
+  /* An injected installation owns the device material: no key is minted here and
+     none is passed down. `era.ignored()` is empty when that is honoured. */
+  const hosts = options.hosts || null;
   let device = options.deviceKeys;
   const idb = options.indexedDB || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
   const web = options.crypto || (typeof globalThis !== "undefined" ? globalThis.crypto : undefined);
-  if (!device && idb && web) {
+  if (!hosts && !device && idb && web) {
     try { device = await openDeviceKeys({ indexedDB: idb, crypto: web }); }
     catch (error) { failures.push("device keys: " + (error && error.message ? error.message : String(error))); }
   }
-  const lane = { indexedDB: idb, crypto: web, ...(device ? { deviceKeys: device } : {}) };
+  const lane = hosts ? { hosts }
+    : { indexedDB: idb, crypto: web, ...(device ? { deviceKeys: device } : {}) };
 
   let readings = null;
-  try { readings = await createReadingHost({ day: day || TodayModel.SYNTHETIC_DAY, ...lane }); }
+  const openReading = (hosts && hosts.createReadingHost) || createReadingHost;
+  try { readings = await openReading({ day: day || TodayModel.SYNTHETIC_DAY,
+    ...(hosts ? {} : lane) }); }
   catch (error) { failures.push("weigh-in store: " + (error && error.message ? error.message : String(error))); }
```

The page then opens the one store where it opens anything else:

```js
import { openTodayOverLocalEra } from "../../w6/local/today-bindings.mjs";
const era = await openTodayOverLocalEra({ athleteId, deviceId, clock });
const { api, workout, model, readings } = await boot({ hosts: era });
```

**Recommended second hunk, not required.** `today-app.cjs:311-312` closes the weigh-in sheet
and calls `render("today", true)` without telling the workout entry that the log moved. The
label is cosmetic and the card re-prepares when it opens, so nothing is wrong today — but in
one store the summary is now genuinely one revision behind, and `await workout.refresh()`
before `render("today", true)` makes the card's own line as current as the rest of the
screen.

**When the swap lands, these become deletable:** `gym-host.mjs`'s first half (the whole
synthetic enrolment: `IDENTITY_KEY`, `AUTHORITY_KID`, `ENROLMENT_EVIDENCE`, `openDeviceKeys`,
`signRecord`, `mintLease`, `initialGeneration`) and `reading-host.mjs` entirely. `causalTips`
and `startOrderRefusalOf` are already carried in `today-bindings.mjs` with the source pin.

---

## 6. Counts

| | |
|---|---|
| files added | 5 — `local/today-bindings.mjs` (324), `local/today-browser-entry.mjs` (20), `test/local-today-journey.test.mjs` (637), `test/local-today-browser.mjs` (181), `test/local-schema-probe.mjs` (55) |
| files edited | 1 — `local/build.mjs`, **+8 lines, additive** (`TODAY_ENTRY`, `TODAY_OUTFILE`, `buildTodayBrowser`); both existing bundles byte-identical |
| files edited under PM/host/client/engine ownership | **0** |
| new assertions | 35 Node cases + 5 real-browser cases + 1 standalone probe |
| W6 suite | 495 → **530**, 0 failures |
| today / host suites | 123 / 22, **unchanged and untouched** |
| bundle inputs | `today.js` 103 pinned inputs (vs `host.js` 97) |

---

## 7. Residuals — what is NOT done

1. **The swap itself is not applied.** `today/**` is PM-owned; §5 is the patch, executed in
   a verbatim copy but not in the file.
2. **F2 (`WORKOUT_PREPARATION_STALE`) is named, not removed.** The shipped screen re-prepares
   before every Start, so the product path is safe; a caller that holds a preparation across
   a reading write gets a refusal. If the PM wants it impossible rather than unreachable,
   the seam is a serialising write lock shared by both paths, which would have to live
   inside `today-bindings.mjs` **and** wrap the host's own client — I did not build it,
   because it would mean intercepting `composeWorkoutHost`'s output, which is exactly the
   kind of second capture path this branch exists to avoid.
3. **A lapsed era refuses the whole page.** `openTodayOverLocalEra` throws
   `LOCAL_LEASE_EXPIRED` / 20 rather than opening read-only. C1's `boot()` reports that case
   as `readable: true`, so an honest "your history is here, saving is paused" screen is
   possible and is not built. It takes 400 days of not opening the app to reach.
4. **`device` is `null` on both handles** (key custody is `local-keys.mjs`, non-extractable
   and unexported). Nothing in `today/**` reads `.device`; `deviceKeyCustody` names where it
   went. If a future screen wants a key record, it will have to ask for something that can
   honestly be shown.
5. **No iPhone, no iOS Safari.** Chromium-family evidence only — that is C3's job, and the
   browser check says so in its own output.
6. **Not run here:** `rebuild.yml --ci`, the native-carriers package gate, `run-current-head`,
   the A5 suites. Nothing in this branch touches `.github`, `rebuild/engine`, `rebuild/m4`,
   `rebuild/conform` or `rebuild/client`; the CI step for the fake-indexeddb suites is still
   the batched re-seal item (DECISIONS:103 §5), and this file adds one more suite to it.
7. **Synthetic data only.** The athlete is `rebuild/m3/w7-preview/fixtures.cjs`. `ledger/`
   and `rebuild/conform/private` were not read.
