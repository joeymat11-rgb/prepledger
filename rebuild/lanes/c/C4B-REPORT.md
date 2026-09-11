# C4b — ONE STORE, APPLIED (builder's report)

**Branch** `rebuild/lane-c-today` · **base** `04c8cc9` (integration tip `da63053` +
the accepted C4 drop-in). **Granted** by the PM at 08:40 ET, DECISIONS:106 /
REQUESTS: *"move today/{reading-host,gym-host}.mjs onto the C1 local era with A2's
59 gym + 64 today tests kept green … keep probe==Start and causalTips … please fix
run-current-head.cjs harness scoping."*

**What is claimed.** The swap is applied, not proposed. `today-entry.mjs` opens
this device's own local era **by default**; `gym-host.mjs` and `reading-host.mjs`
are thin wrappers over `rebuild/m3/w6/local/today-bindings.mjs`; nothing under
`rebuild/m3/w7-preview/today/**` mints a key, signs a lease or asserts an
enrolment. A2's 59 gym cases and A1's 64 today cases are green **unchanged in
what they claim about the product**, and every test line that moved is listed in
§4. The harness reaches **550/550**, exact parity with the in-place suite.

---

## 1. Files, line counts, sha256

**REVISION 2** — the independent review (`C4B-REVIEW.md`) returned **REJECT** at
`8ba0ff4` on D1, with D2–D5 alongside. All five are closed; §2.6, §4, §5, §6 and
§9 say what changed and why. The counts below are re-run at this head.

| file | lines | sha256 |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 149 | `4b9a0c218b1c333f9c3c49f418a3a14d9ad31458a00aa19732026fff84571595` |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | 78 | `70a59b5c328f3b029790ed49b957dd2b78eada1b9bdff9606de5ae17a4f01c18` |
| `rebuild/m3/w7-preview/today/reading-host.mjs` | 44 | `a3e9201587f97446f90856f3235cf99da8d487d1be127416be1e5086d17be6aa` |
| `rebuild/m3/w7-preview/today/today-model.cjs` | 279 | `ef051efa8ae2b2e905aa76bc04c156c21e36c55ba219e634c7c0be85eb77be42` |
| `rebuild/m3/w7-preview/today/gym-check.mjs` | 483 | `5025e60205be01b0ce5fc7b21bc20440cd564d74d7110ec601291514e4b203a8` |
| `rebuild/m3/w7-preview/today/browser-check.mjs` | 316 | `4085786ea6fd58a2366b1a971859722e317c779fd4a9122112dc80f4ea8e2ad7` |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | 361 | `9656c1f54246cb5580aa10626866c884998fc2ccf52068ede6426da06370210e` |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | 609 | `43aa7d60f095ed00df79a5dd9b65fcc7dfdf597d715fbe265f68308b843bb954` |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | 923 | `678f5e2991aa662cf6a1bf72db999ebac9ee827bc1e4f619f3b43b4bcbd557f3` |
| `rebuild/m3/w7-preview/today/test/package.test.cjs` | 192 | `8cab604c7968dd80b0ca78ff52409e6ff4fbcaa1687e9cf6a12667444b38525e` |
| `rebuild/m3/w6/local/today-bindings.mjs` | 498 | `7802094aa3bdc5bf5a197ec2909df772d8b03370b29f30c2a3a82f76958d2f23` |
| `rebuild/m3/w6/local/local-keys.mjs` | 204 | `53082451e91e4055b8586d017f96d585394eacb6987351513d1fa420c972c94d` |
| `rebuild/m3/w6/local/host-bindings.mjs` | 343 | `bc2ee6a41899b85af24f2bb691b2dd826dc3c9e2fbb185e7820c22464eb0ec39` |
| `rebuild/m3/w6/test/local-today-journey.test.mjs` | 1030 | `c6a66b7dfc765c066beab2399d9b4dc138fc8b326134537c519612c55e239c2b` |
| `rebuild/m3/w6/test/local-today-browser.mjs` | 324 | `7d23847e709a32938312c99724838c72448f75c4ada9b8fe7554ee840f1f26f2` |
| `rebuild/m3/w6/test/run-current-head.cjs` | 229 | `133b41887493245c4923ac13e2801e78c82fb942b609fbc78c37ffdd94d7c74f` |
| `rebuild/m3/w6/test/shared-edit-source-pins.json` | 17 | `d50df57edf9ef39752d5e7f895df4e00d1a0f316bfad63ff0765a4637497da2f` |

`git diff --shortstat 04c8cc9..HEAD` — 18 files, +1951 / −1080 (the 17 above plus
this report). Nothing under `rebuild/host`, `rebuild/client`, `rebuild/engine`,
`rebuild/m4`, `rebuild/conform` or `.github` was edited.

---

## 2. THE SWAP — every `today/**` line that changed

### 2.1 `today-entry.mjs` (+75 / −40 against `04c8cc9`)

**Hunk 1 of §5 is applied VERBATIM** — the `createWorkoutEntry` hunk, byte for
byte as the PM granted it, except for one comment sentence corrected because the
patch falsified it (below). The four changed lines:

```diff
-  const gymHost = await createGymHost({ day, engineState: model.stateFromOps(),
-    plannedSplitSlotId: "earned-today-preview/" + day, ...options });
+  /* ONE STORE. `hosts` is the only injection point: … */
+  const { hosts, ...lane } = options;
+  const openGym = (hosts && hosts.createGymHost) || createGymHost;
+  const gymHost = await openGym({ day, engineState: model.stateFromOps(),
+    plannedSplitSlotId: "earned-today-preview/" + day, ...lane });
-  const hostForDay = (other) => createGymHost({ …, ...options });
+  const hostForDay = (other) => openGym({ …, ...lane });
```

**Comment corrected, disclosed.** §5's comment ended *"a page that supplies none
gets exactly the two synthetic hosts this module built before."* After the swap
that is false — there are no synthetic hosts left — so it reads *"a page that
supplies none gets the SAME store through gym-host.mjs, which opens this device's
installation itself. There is no second behaviour left to fall back to."*

**Hunk 2 is applied with one deliberate difference, disclosed.** §5 guarded the
key-minting branch (`if (!hosts && !device && idb && web)`). The brief requires
NO key-minting left in `today/**`, and after the swap that branch is dead code
calling a function that no longer exists, so it is **deleted rather than
guarded**, and the `device` / `deviceKeys` plumbing with it. What `boot()` does
now:

```diff
-  let device = options.deviceKeys;
   const idb = options.indexedDB || …;
   const web = options.crypto || …;
-  if (!device && idb && web) {
-    try { device = await openDeviceKeys({ indexedDB: idb, crypto: web }); }
-    catch (error) { failures.push("device keys: " + …); }
-  }
-  const lane = { indexedDB: idb, crypto: web, ...(device ? { deviceKeys: device } : {}) };
+  let hosts = options.hosts || null;
+  let restoreRequired = null;
+  if (!hosts) {
+    try { hosts = await openTodayHosts({ indexedDB: idb, crypto: web, day: day || TodayModel.SYNTHETIC_DAY }); }
+    catch (error) {
+      if (error && error.state === 18) restoreRequired = error.code || "RESTORE_UNPROVEN";
+      failures.push("device store: " + …);
+    }
+  }
+  const lane = hosts ? { hosts } : { indexedDB: idb, crypto: web };
   let readings = null;
-  try { readings = await createReadingHost({ day: …, ...lane }); }
+  const openReading = (hosts && hosts.createReadingHost) || createReadingHost;
+  try { readings = await openReading({ day: …, ...(hosts ? {} : { indexedDB: idb, crypto: web }) }); }
```

and, at the end:

```diff
+  if (restoreRequired && status) status.textContent = RESTORE_REQUIRED + " (" + restoreRequired + ")";
-  if (failures.length && status) status.textContent = "Not everything opened: " + …
+  else if (failures.length && status) status.textContent = "Not everything opened: " + …
-  return { api, workout, model, readings, failures };
+  return { api, workout, model, readings, hosts, restoreRequired, failures };
```

Imports: `openDeviceKeys` out, `openTodayHosts` and `RESTORE_REQUIRED` in.

### 2.2 `gym-host.mjs` — 320 lines to 78 (−379 / +… net −242)

**Deleted outright:** `DEVICE_ID`, `IDENTITY_KEY`
(`'synthetic-preview-identity-not-a-credential'`), `AUTHORITY_KID`,
`ENROLMENT_EVIDENCE`, `KEY_DATABASE`, `LEASE_DOMAIN`, `ORDER`, `base64url`,
`toBigInt`, `toBytes`, `signRecord`, `idbRequest`, `openDeviceKeys`, `mintLease`,
`initialGeneration`, the whole `createGymHost` composition body (openRepository,
the lease branch, `createT2Stage`, `createDurablePublicClient`,
`composeWorkoutHost` and its eleven providers), and every import that fed them.

**What is left:** a re-export of `causalTips` / `startOrderRefusalOf` /
`PLAN_BASIS` / `INPUT_BASIS` / `RESUME_REASON` / `PRODUCER` from
`today-bindings.mjs`, `DATABASE` / `NAMESPACE` / `ATHLETE_ID`, an
`openTodayHosts()` that opens the memoized installation, and a `createGymHost()`
that calls `era.createGymHost(...)` and returns the handle with the installation
holder attached to its `close()`.

**`probe == Start` and `causalTips` are kept EXACTLY.** They are not restated:
they now have exactly ONE definition in the tree (`today-bindings.mjs`, carried
verbatim under C4 with provenance), and `gym-host.mjs` re-exports it. The journey
asserts `GymHost.causalTips === causalTips` — an identity, which is strictly
stronger than the source comparison it replaces. `startOrderRefusal()` on the
handle is the drop-in's, over the same derived `lastResolved`; `gym-model.mjs`
and `engine-order.cjs` are untouched, so the Starts the page refuses are exactly
the Starts it refused before.

### 2.3 `reading-host.mjs` — 121 lines to 44 (−149 / +… net −77)

Everything that opened a second generation is gone: `READING_DATABASE`,
`READING_NAMESPACE`, the `openRepository` call, the `signRecord(mintLease(1))`
branch, the `createT2Stage`, the `createDurablePublicClient`, and the whole
hand-written face. `READING_SCHEMA_VERSION` **stays 1** — it names the schema
`rebuild/client` stamps on a reading OPERATION, which is still 1 — and a new
`ERA_SCHEMA_VERSION` (2) names the lease's. The gap between the two is the crux.

### 2.4 `today-model.cjs` — 3 constants deleted (+23 / −23, disclosed)

Required by the swap and by nothing else: it still declared and exported
`SYNTHETIC_DEVICE_ID`, `SYNTHETIC_ATHLETE_ID` and
`SYNTHETIC_IDENTITY_KEY = "synthetic-preview-identity-not-a-credential"`. Nothing
reads them once `gym-host.mjs` stops minting an enrolment, and the literal was
still being shipped in `app.js`. Deleted, with the header paragraph that
described the page-minted enrolment corrected to name the local era. **No
behaviour in this file changed**; `git diff` is the three `const` lines, the
export list, and two comment blocks.

### 2.5 What "synthetic" is left under `today/**`

`grep -i synthetic rebuild/m3/w7-preview/today/**` now returns only:

* `today-model.cjs` — `SYNTHETIC_DAY` / `createSyntheticState` from
  `../fixtures.cjs`, and the paragraph that says the athlete BASIS is invented.
  **Synthetic DATA, named as such.**
* `today-entry.mjs` — two `TodayModel.SYNTHETIC_DAY` call sites.
* `gym-host.mjs` — one sentence saying there is nothing synthetic left in it.
* `gym-check.mjs` / `browser-check.mjs` / `view.test.mjs` / `gym.test.mjs` /
  `adapter.test.mjs` — the fixture athlete, and one historical reference each.
* `serve.mjs` — "Synthetic athlete; no account and no network." (still true.)

No identity, no lease, no evidence, no key minting.

### 2.6 REVIEW D1 — TWO CLOCKS FOR ONE "TODAY", and the Start it stranded

**The defect, in one sentence.** `openTodayInstallation` memoized per
`(indexedDB, databaseName, namespace)` and, on a memo hit, **silently dropped
every later caller's clock** — while `buildEra.createGymHost` still handed
`composeWorkoutHost` the caller's real `day`. Two clocks for one notion of
"today", and the accepted resume policy compares them.

**What that cost, executed.** In ONE page load: day 2's `start()` returned
`{ok:true}` and wrote a `session-start` — stamped **day 1**, because the stage
came from the installation. The very next `read()` refused it
`WORKOUT_HISTORY_RECONCILIATION_REQUIRED`, `unfinished { day: <day 1>, sets: 0 }`,
and `gymHost.startOrderRefusal()` returned `WORKOUT_START_ORDER_UNPROVEN`. No set
could be logged, ever. That is a Start on disk that no accepted resolver can
order — **exactly the class A2's own REJECT round named**, and the PM's stated
condition for this task.

**Why it was reachable and not theoretical.** `today-entry.mjs` auto-boots at
module load and **never releases its holder**, so the installation is pinned to
the first day the page ever asked for. Every later `boot({ today })` in that page
load — which is how A2's own `gym-check.mjs` conducts day 2, and how the PM said
the two-day journey must be conducted — got day one's clock. The report's §3
presented "ONE INSTALLATION PER PAGE" as the thing that made the swap safe; it
was also what made it unsafe across a day boundary, in a module whose stated
discipline is *"a MISMATCH is refused by name; a caller-minted `deviceKeys` is
ignored and RECORDED, never quietly honoured."* The clock was quietly honoured.

**The fix, two halves.**

*(a) ONE CLOCK PER HOST — this is what closes the defect.*
`client.hostBindings()` now takes the host's own clock
(`host-bindings.mjs`, a new validated option; a malformed one is
`LOCAL_HOST_CLOCK_INVALID`/18), and `createGymHost({ day })` binds **all three**
of the T2 stage that stamps its operations, `composeWorkoutHost`'s
`clock.today()` and the engine runtime's clock to the SAME `day`.
`createReadingHost({ day })` does the same for its own. The invariant the swap
discovered is now *enforced* rather than satisfied by luck: an operation's
recorded day always equals the day the host that wrote it stands on. Two hosts on
two days in one page load — today's card and the transient `hostForDay` that
retires an abandoned session — each stamp their own day correctly, which is
exactly what A2's two separate repositories did.

*(b) ONE LIVE CLOCK PROVIDER PER INSTALLATION — this is what stops the silence.*
The installation's clock (the weigh-in path, the lease window, the enrolment
stamp) reads a single mutable day. A later caller declaring a different day
**ADOPTS** it and the adoption is **recorded by name** on `era.clockAdoptions()`
(`{ from, to, adopted }`), with `era.liveDay()` saying what the installation's own
writes are stamped with right now. **ADOPT, not REFUSE**, and the reason is the
shipped page: it cannot release its holder, so refusing would strand day 2 rather
than order it. A caller that hands a **host** a second clock is a different
question — a host's day comes from its `day` argument and nowhere else — and is
refused by name, `LOCAL_ERA_CLOCK_MISMATCH`/3, beside the four mismatches
`reconcile()` already refuses.

**The memo is NOT keyed on the day.** That would reopen the
two-clients-one-repository split the memo exists to prevent, which the review
also said. One installation, one live clock, per-host write clocks.

**The evidence, both levels.** `local-today-journey.test.mjs` block 10 is the
reviewer's own A/B, adopted as a case: two training days in one page load, run
twice, the ONLY difference being whether day 1's holder was released. Both must
recover the abandoned day-1 session, Start, reach a **logged set**, leave
`startOrderRefusal()` **null**, and produce the SAME durable record; each Start is
asserted to be stamped on its own `effective.local_date`. `local-today-browser.mjs`
case 6 drives the same journey through `boot()` on the **BUILT page** in real
Edge, with the module-load boot's holder still open, and asserts the adoption by
name. Before the fix, the A/B reads (the reviewer's measurement, reproduced):

```
X closed-first   | sameInstallation=false | start ok | read active            | first set OK
Y shipped (open) | sameInstallation=true  | start ok | read unfinished(day-1) | NOT REACHED
```

and after it, on this branch:

```
X closed-first   | adoptions=[]                                  | read active | first set OK | orderRefusal=null
Y shipped (open) | adoptions=[{from:2030-02-04,to:2030-02-05,adopted:true}] | read active | first set OK | orderRefusal=null
```

### 2.7 REVIEW D5 — a refused open no longer seeds an identity

`openLocalDeviceIdentity` opened the key database — **creating it** — and minted
`device-<32 hex>` *before* anything had decided whether the installation may be
opened at all. Erasing the key database of a real installation therefore put it
straight back on disk holding a brand-new identity, while the page correctly said
`RESTORE_REQUIRED (KEY_MISSING)`. No re-enrolment followed and nothing was lost,
but a page that refuses to open an installation must not be seeding a new one
into it.

Minting is lazy and **first-run only** now: the existing id is read through the
non-creating probe, and a new one is minted only when all three first-run signals
are absent — `firstRunSignals()` makes the same observation, with the same
non-creating probes, that C1's `openLocalDurableClient` makes before it will
enrol. Anything else throws C1's own code (`STORE_MISSING` / `KEY_MISSING` /
`ENROLLMENT_MARKER_MISSING`, state 18, C1's precedence) and writes nothing.
Journey block 11 asserts it: with the key database erased, a `boot()` reports
`KEY_MISSING`, the set of databases on the device is **byte-identical** before and
after, and a second `boot()` still refuses.

---

## 3. FIRST RUN AND RESTORE-REQUIRED — how the page derives its identity

Asked for by the brief, and decided here rather than deferred.

**The athlete is `"owner"`.** One athlete on one phone. `TODAY_ATHLETE` in
`today-bindings.mjs`. When Dad's A4 first-run setup exists to name a second, it
replaces this constant; until then a per-page prompt would be a question with one
possible answer.

**The device is minted once, at random, and persisted with the local keys.**
`local-keys.mjs openLocalDeviceIdentity()` reads record `device` from
`<databaseName>-keys`, or mints `device-<32 hex>` from `crypto.getRandomValues`
and persists it. It HAS to be stable across launches: `localEraConfig` refuses an
era whose sealed lease names another device (`LOCAL_ERA_SCOPE_MISMATCH`). Keeping
it in the key database means erasing it is already an erasure of key custody,
which is already restore-required — there is no new way for an installation to
lose half of itself. It is an identifier, never a credential; the keys in that
store stay non-extractable and unexported, and `openLocalDeviceIdentity` never
touches the key record. It writes to key `device`, never `active`, so C1's
three-signal first-run probe (`keysPresent` reads `active`) is unaffected: a
fresh phone still reads as first-run.

**The namespace and database are the page's:** `earned-today-local` /
`earned-today/device-A` (`TODAY_DATABASE` / `TODAY_NAMESPACE`).

**The clock is the page's own day.** `openTodayHosts({ day })` builds
`clientClockFor(day)` — `day + 'T13:00:00.000Z'`, exactly what `gym-host.mjs`'s
stage clock always was. This is not cosmetic: the accepted resume policy compares
a stored session's day against the host's, so an operation stamped on the wall
clock while the screen stands on `SYNTHETIC_DAY` reads back as *unfinished*. (It
did, in the first run of A2's suite against the swap — 34 red.) `wallClock()` is
there for a caller with no `day`.

**ONE INSTALLATION PER PAGE.** Three call sites can ask for "this device's Today
store" in one page load — `boot()`, the reading host, the gym card, plus the
transient `hostForDay`. Opening it more than once would put two clients over one
repository: two bridges, two published faces, and a write one of them cannot see.
`openTodayInstallation` memoizes per `(indexedDB, databaseName, namespace)` and
**reference-counts**: each caller gets a facade whose `close()` detaches only
that caller, and the last one out closes the client and drops the memo — which is
what makes the next open a real relaunch, re-read from disk. A failed open is
never memoized.

**REVISION 2 — and that memo is ALSO where D1 lived.** This paragraph used to end
there, as if one installation per page were the whole safety story. It is not:
the memo returned the existing era and dropped every later caller's clock in
silence, which stranded day 2's Start. What makes it safe is §2.6's pair — a LIVE
clock provider whose day a later caller ADOPTS by name and on the record
(`clockAdoptions()`, `liveDay()`), and a per-HOST write clock so that each host's
stage, `composeWorkoutHost` and engine runtime all read its own `day`. The
installation is still one; what it holds is no longer the first caller's frozen
answer to "what day is it".

**FIRST RUN.** `boot()` with no `hosts` calls `openTodayHosts`, which calls C1's
`openLocalDurableClient` → `status()`. On `first-run` (all three signals absent)
it enrols with the page's namespace, `"owner"`, and this install's device id, and
the page opens silently. Proved in the browser: case 1 of the Edge runner asserts
a fresh profile enrols itself, holds 0 operations under a `local-era:<32 hex>`
lease at schema 2, and reports `restoreRequired: null`.

**RESTORE-REQUIRED.** Any other refusal arrives as a thrown `StorageFailure` with
C1's own code at state 18. `boot()` catches it, records
`restoreRequired = error.code`, opens nothing, re-enrols nothing, and writes
`RESTORE_REQUIRED + " (" + code + ")"` into `#today-status` — where
`RESTORE_REQUIRED` is `rebuild/client`'s own copy, re-exported through
`today-bindings.mjs` so the page never writes its own sentence for a client
refusal. Today then renders what it honestly can (the engine's plan off the
basis) and claims no reading. Proved three ways: `view.test.mjs` (corrupted ops
collection → `T2_INTEGRITY_UNPROVEN`), the journey block 5 (`KEY_MISSING`, and
the record still on disk afterwards), and Edge case 6 (the key record deleted
under the live page).

---

## 4. EVERY EDITED TEST LINE, and why

The rule: never weaken an assertion about product behaviour. Where the product's
behaviour genuinely changed, the claim is re-made against the new behaviour and
the change is named here.

### `today/test/adapter.test.mjs` (+107 / −…, 15 hunks)

| what | why |
|---|---|
| imports: `AUTHORITY_KID`, `openDeviceKeys` out; `ERA_SCHEMA_VERSION`, `DATABASE`, `openLocalKeys`, `keysDatabaseName` in | the page exports neither any more |
| the local `deviceKeys()` helper (7 lines) deleted; `device()` no longer takes or passes `deviceKeys` | the page does not take device keys |
| `assert.match(ops[0].op_id, /^op-earned-today-preview-device-\d+$/)` → `assert.match(readings.deviceId, /^device-[0-9a-f]{32}$/)` **plus** `assert.equal(ops[0].op_id, "op-" + readings.deviceId + "-1")` | **stronger**: the old line matched a shape, the new one pins the id to THIS installation's device |
| `indexedDB.open("earned-today-preview-readings")` → `indexedDB.open(DATABASE)` in the evicted-store case | there is one database now; the case, the erasure and the expected refusal are unchanged |
| *"the two lanes are separate generations under ONE on-device key store"* → *"the two lanes are ONE generation of this device's own local era"* | the claim it made is the thing the swap removes. The replacement asserts MORE: one repository handle (`===`), one device, athlete `"owner"`, one `local-era:` lease at schema 2 shared by both hosts, `device: null` with custody named, and a schema-1 reading op landing under it |
| *"the device key store keeps ONE enrolment across relaunches"* rewritten over `openLocalKeys` | the page holds no key record to assert on. The replacement keeps both halves of the old claim — the same enrolment comes back across a real relaunch (same `lease_id`, same `deviceId`), and the key is non-extractable and `exportKey` rejects — and adds that the era is never re-minted |
| the `OPERATION_SCHEMA_MISMATCH` case: `deviceKeys` argument dropped; comment extended | **the assertions are byte-identical.** The public client still refuses a schema-1 reading under a schema-2 lease; that refusal is why the one store has two write paths |

### `today/test/view.test.mjs` (+76 / −…)

| what | why |
|---|---|
| `AUTHORITY_KID` import and the `deviceKeys()` helper deleted; `lane()` no longer mints keys | as above |
| `DATABASE`, `RESTORE_REQUIRED`, `boot` imported | the replacement case drives the real entry point |
| *"an untrusted local record paints no number anywhere"* → *"…is refused by name, never re-enrolled over, and claims no reading"* | **the behaviour changed and the new one is safer.** A2's hosts re-opened a damaged store and painted a blocked face off it; the local era refuses to open it at all. The replacement asserts state 18 with a named code, that `boot()` prints the client's own RESTORE_REQUIRED copy, that no reading is claimed (`morningRead` null, `hasReadToday` false, `storedReadCount` 0), that no figure from the damaged record (`181.9`) reaches the screen, that the screen is byte-equal to the no-store screen, that the record is still on disk, and that a second open still refuses instead of starting a second life. The one assertion NOT carried is `doesNotMatch(phoneText, /\d+\.\d|\d,\d{3}/)` — the engine's plan still renders off the basis, which is A1's accepted no-store behaviour (`adapter.test.mjs` asserts it), and those digits never came from the record |

### `today/test/gym.test.mjs` (+52 / −…)

| what | why |
|---|---|
| `signRecord`, `LEASE_DOMAIN`, `AUTHORITY_KID` dropped from the import | `signRecord` and `LEASE_DOMAIN` were **already unused**; `AUTHORITY_KID` fed only the local `deviceKeys()` helper |
| `deviceKeys()` helper (7 lines) deleted; `device()` and `lane()` no longer mint or pass keys | the page does not take device keys |
| *"Today reflects the durable workout state"*: `assert.equal(workout.gymHost.repository, readings.repository)` added | new claim, not a weakened one — this is the one store |
| same test: `await workout.gym.start()` → assert it is refused `WORKOUT_PREPARATION_STALE`, then `refresh()`, then Start and assert `ok` | **this is the one-store finding, and it is disclosed rather than papered over.** The entry's preparation was taken before the weigh-in; in one store the weigh-in moves the generation's revision, so the held preparation is stale and is refused BY NAME, writing nothing. The shipped screen re-prepares before every Start (`gym-app.mjs` `paint()` calls `model.read()`), so the product path is unaffected — the test now says so out loud and asserts BOTH the refusal and the success |
| two header comment lines | they said the device keys and the lease were synthetic |

### `today/test/package.test.cjs` (+29 / −…)

| what | why |
|---|---|
| `assert(app.includes("synthetic-preview-identity-not-a-credential"))` → **four** assertions that none of the four synthetic labels survives | the assertion required a synthetic identity label to be shipped. It must not be |
| `/"ECDSA"|'ECDSA'/` → `/getRandomValues\(/` in the "generates its own key material" list | the page no longer generates a P-256 pair — there is no lease to sign in the page. It still generates a non-extractable AES-GCM store key (`local-keys.mjs`), and the era's identity/authority keys are random hex from `getRandomValues`, sealed in the generation |
| the non-extractable regex tightened (`(?:!1|false)` grouped) | it was an unparenthesised alternation that could match the bare literal `false` anywhere; now it must follow the AES-GCM `generateKey` call |
| the no-private-key-literal assertions | **unchanged** |

### The two optional PC-only browser checks — REVISION 2 (review D2 and D3)

**The first version of this section was wrong, and it was wrong because the files
were not run.** It said: *"each asserted that the page's three old databases
exist… The swap falsified those five lines… No other line in either file
changed."* True of the diff; **false of what the swap required**. Running
`gym-check.mjs` turned it **RED** — `a refused day writes nothing: 9` — and the
claim that only the database names needed correcting was an inference stated as a
fact. Both files are now **executed green on the briefed browser**, and every
changed line is listed.

`gym-check.mjs` (+99/−…):

| line | before | now | why it moved |
|---|---|---|---|
| `PROCESS_NAME` (new, 2 lines) | the kill filtered `Name='chrome.exe'` | `path.basename(W7_BROWSER_BIN)` | **D3.** With the environment's declared `W7_BROWSER_BIN` (msedge.exe) the check did not report NOT RUN — it FAILED at the first `hardKill`, before any assertion below could run. `local-today-browser.mjs` already derived it; the fix was not carried across |
| the `hardKill` message and the PASS line | `"no chrome process…"`, `"every chrome.exe"` | `PROCESS_NAME` | same |
| the day-2 probe's return (3 lines) | `ops` only | `ops`, `workoutOps`, `readingOps` | so each half can be asserted separately |
| `assert.equal(…ops, 8)` | 8 | `workoutOps` 8 **and** `readingOps` 1 **and** `ops` **9** | **D2.** Day 1 also logs a weigh-in. Before the swap it lived in `earned-today-preview-readings`; under ONE STORE it is in the same generation. The claim — *a refused day writes NOTHING* — is unchanged and is now made against both halves rather than one literal |
| the both-days probe's return (4 lines) | `ops`, `orphanStarts` | `+ workoutOps`, `readingOps`, `leases`, `startDays`, `startParents` | as above, plus the D1 invariant |
| `assert.equal(bothDays.ops, 14)` | 14 | `workoutOps` **14** and `readingOps` **2** and `ops` **16** and `leases` **1** | **D2.** 14 workout operations is unchanged; the two mornings used to be two operations in a SECOND generation |
| `startDays` (new) | — | each Start stamped on its own day | **D1**, asserted in the browser against the built page |
| `orphanStarts === 1` | 1 | **0**, plus `startParents` = `[[fact], [fact, session-close, tombstone]]` | **D2, third number.** Under two generations the workout log began with the first Start, so it had no parent. Under one, day 1's morning is written FIRST into the same causal graph, so the first Start descends from it and no Start is an orphan. The claim the old count made — every Start ordered, day 2 descending from day 1's close — is now made directly, by naming each Start's parents |
| the PASS summary (4 lines) | "14 ops, exactly one Start descending from nothing" | the one-store sentence | it described the two-generation shape |

`browser-check.mjs` (+18/−…): the same `PROCESS_NAME` derivation (D3), its three
database assertions (the local era's, and that the old reading store does not
exist), and the PASS line's `chrome.exe` → `PROCESS_NAME`. Nothing else.

Both run green on Edge; the output lines are quoted in §8.

---

## 5. The C4 journey, retargeted (`local-today-journey.test.mjs`, 43 → 41 → **49**)

* **Block 5** kept its drop-in half and lost its contrast — the page's
  `reading-host.mjs` no longer re-enrols over an erased generation, because that
  module is a wrapper now. The contrast becomes the stronger claim: the SHIPPED
  page refuses `KEY_MISSING`/18, `boot()` prints the client's own copy with the
  code, `hosts` and `readings` are both `null`, nothing on screen claims a
  reading, and a second open still refuses. `pageDeviceKeys()` deleted.
* **Block 7 — PAGE_PINS re-pinned**, to
  `today-entry.mjs 4b9a0c21…`, `gym-host.mjs 70a59b5c…` (re-pinned again in
  revision 2 for D1/D3), `reading-host.mjs a3e92015…`. **The comment is corrected**
  exactly as the round-2
  review asked: they are *"the three files whose drift this suite could not
  otherwise see"*, not *"every today/** file this branch depends on"* — the
  journey imports seven and pins three, and the other four are driven by the
  blocks above, so drift in them turns the suite red on its own. The failure
  message now names what to re-read: that `boot()` still defaults to the local
  era and that neither wrapper opens a store of its own.
* **Block 7 — the helper-source pin (D2) is retired**, and this is a
  strengthening, not a loss: `graphOps` / `reachedFrom` existed twice and the pin
  compared their extracted source. There is exactly ONE copy now, so the test
  asserts `GymHost.causalTips === causalTips` — identity, which no source
  comparison can drift from. Added in its place: none of
  `IDENTITY_KEY`, `ENROLMENT_EVIDENCE`, `AUTHORITY_KID`, `mintLease`,
  `initialGeneration`, `signRecord`, `openDeviceKeys`, `generateKey` may appear in
  any of the three files.
* **Block 7 — the shape pin runs the other way.** The page's hosts ARE the
  drop-in's now, so the wrapper must carry every member the drop-in returns and
  may only ADD — asserted as exactly `['athleteId','deviceId']`. `NULLED` and the
  `device`/`deviceKeyCustody` exception are kept.
* **Block 8** no longer carries a hand-applied copy of hunk 1. It imports and
  drives the REAL `today-entry.mjs createWorkoutEntry` with `{ hosts: era }`.
* **Block 9 — the disposable-copy trial is gone**: `REQUEST_TO_PM_PATCH`, the six
  anchors, `applyRequestToPmPatch`, the temp-directory copy, the import-specifier
  rewrite, and **the report-diff check**. The patch is applied; there is no
  unapplied patch left for them to be about. (That also closes the round-2 latent
  finding — the one-directional diff comparison — by deletion rather than by
  hardening a check that no longer has a subject.) What replaces it asserts the
  thing that now matters: `boot()` with NO hosts opens ONE generation of this
  device's local era (one lease, one checkpoint, schema 1 and 2 together) and
  creates none of the page's three old databases; `boot()` with an injected
  installation uses that one and mints nothing beside it; and a default boot and
  an injected boot are proved to be the SAME installation, with the first load's
  reading still readable from the second.
* **Net −2 cases**: the retired anchor check and the retired report-diff check.
  Nothing else was removed.
* **REVISION 2 adds blocks 10 and 11, +8 cases (41 → 49).** Block 10 is review
  D1's A/B, adopted from the reviewer's own probe: two training days in ONE page
  load, run twice, differing only in whether day 1's installation holder was
  released. Both must recover the abandoned day-1 session, Start, reach a logged
  set, produce the SAME durable record, and leave `startOrderRefusal()` null;
  each Start is asserted stamped on its own `effective.local_date`; the adoption
  is asserted by name (`clockAdoptions()`), and a host handed a second clock is
  asserted to be refused `LOCAL_ERA_CLOCK_MISMATCH`. Block 11 is review D5: a
  first run mints one id and keeps it, and with the key database erased the
  refused `boot()` creates nothing — the device's database list is identical
  before and after — and still refuses on the next open.

---

## 6. The Edge runner drives the BUILT page (`local-today-browser.mjs`)

C4's version built its own W6 bundle and called the drop-in from
`page.evaluate` — a faithful composition, but a stand-in. It now runs
`rebuild/m3/w7-preview/today/build.mjs`, serves its three approved assets through
the page's own `serve.mjs`, and drives the SHIPPED screen with real clicks.

| case | what |
|---|---|
| 1 | fresh profile: `restoreRequired: null`, 0 ops, `local-era:<32 hex>` lease at schema 2; exactly `earned-today-local`, `-keys`, `-local` on the device and none of the three old names; `localStorage` empty |
| 2 | the weigh-in through the shipped sheet → `This morning ✓ 179.4 lb` |
| 3 | Start and one set through the shipped gym card → 3 ops, classes `[reading, session, session]`, schemas `[1,2,2]`, **one** `lease_id`, checkpoint 3, device seq 3, `localStorage` empty |
| 4 | `taskkill /F /T` on every `msedge.exe` of the profile, kill verified (8 processes) |
| 5 | new process, same profile: the reading AND the workout are both back, same era, `What you did · Set 2` |
| 6 | **REVISION 2 (review D1)** — TWO TRAINING DAYS in one page load, with the module-load boot's holder still open: `boot({ today: day+1 })`, recover the abandoned day-1 session, Start, **log a set**; `startOrderRefusal()` null; each Start stamped on its own day; still ONE lease; and the later day recorded as an adoption `{from, to, adopted:true}` |
| 7 | the device key record deleted under the live page → reload shows `RESTORE_REQUIRED (KEY_MISSING)`, `This morning — not logged yet`, `hosts`/`readings` null on a re-open, the record still on disk, `localStorage` still empty |

```
W6 LOCAL-TODAY-BROWSER PASS — 6/6 real IndexedDB cases against THE BUILT PAGE
(3 approved assets, 89 pinned inputs); 152.0.4191.66; killed 8 msedge.exe
process(es) with taskkill /F /T (1 kill); weigh-in + workout entered through the
shipped UI into ONE sealed generation, one lease, one checkpoint; TWO TRAINING
DAYS in one page load with the first holder still open (the later day ADOPTED by
name, each Start stamped on its own day, startOrderRefusal() null); partial
erasure is RESTORE_REQUIRED by name and never a re-enrolment; localStorage holds
nothing.
```
exit 0.

---

## 7. HARNESS SCOPING — `run-current-head.cjs` reaches 100%

The PM measured **462/464** in the harness against 501/501 in place. Running it
here found **two** causes, both scope rather than correctness, and the first one
stopped the harness before a single test ran.

**7.1 The shared-edit check had rotted.** It required the candidate's
`m4/workout/{schema,authority-profile,edit-values,context-values,edit-history}.cjs`
to be byte-identical to the retained R1 **working tree**, which is a live branch
(`rebuild/m3-w5-r1`, now at `bb2fd67`). `schema.cjs` was deliberately carried
forward past it — the tip superset, re-pinned at `7ffe204` *"the joined union"* —
so the harness threw `Shared edit candidate source differs:
rebuild/m4/workout/schema.cjs` at line 41. Fixed by pinning **both** sides
instead of inferring one: `files` pins the candidate as before, and a new `r1`
map in `shared-edit-source-pins.json` pins the exact R1 bytes the candidate was
checked against (`schema.cjs 6038b32e…`, three identical, `edit-history.cjs: null`
— which also replaces the hardcoded `name === 'edit-history.cjs'` exemption with a
declared one). An UNDECLARED difference on either side still fails, by name, with
both hashes; both are recorded in `source-manifest.json` as `r1EditPins`.

**7.2 The composed tree was missing what the local suites reach.** `--all` runs
every `test/*.test.mjs` in the composed tree, and lane C's reach outside the three
candidate trees the harness copied. Found by running it and reading the failures,
in three rounds:

| round | failure | added |
|---|---|---|
| 1 | `Cannot find package 'jsdom'` (local-today-journey); `port.cjs status 2 … 0 laws` | `rebuild/engine`, `rebuild/m3/setup/port`, `rebuild/m4/import`, `rebuild/conform/oracle`, `rebuild/conform/fixtures`, `rebuild/m3/w7-preview` |
| 2 | `ORACLE FAIL frozen 0/0 unfrozen 7/7 scope UNEXPECTED (0 laws)` | the repository's own `node_modules`, linked at the composed root (in place, a test under `w6/test` resolves `jsdom` by walking up to it); and `rebuild/conform` whole, so the port's census oracle and the law sheets its gate enumerates are present |
| 3 | same, still `frozen 0/0` | `tools/_fixed-now.mjs` — `port.cjs` runs the FROZEN half of the port-oracle gate as a second Node process preloading `./tools/_fixed-now.mjs` from the repository root. Without it that half produced zero laws and `port.cjs` refused to seal |

Every added file is copied from the **same source as the other overlays** — this
worktree, by `git ls-files` — is sha-pinned in `pins`, and is re-checked after the
run by the existing "Candidate changed during run" loop. The PUBLIC R1 conform
dependency the archive lays down (`conform/lib/**`, `adapters/client.cjs`,
`laws/sheet-B-client.cjs`) is **never overwritten** — it is filtered out by an
explicit `R1_OWNED` list — and `conform/private` is excluded outright and read by
nothing. The path guard is now `CANDIDATE_TREES` plus a named `EXTRA_FILES`
(exactly one file), so an unexpected path still throws, with the path in the
message. `source-manifest.json` gains `candidateTrees` and `r1EditPins`.

```
node rebuild/m3/w6/test/run-current-head.cjs \
  C:/Users/joeym/Documents/Codex/2026-09-04/read-rebuild-t3-brief-md-and/work/m3-w5-r1 --all
→ tests 550  pass 550  fail 0   EXIT=0
```

**550/550 in the harness, 550/550 in place — exact parity.** (The PM's 462/464 and
501/501 predate C4's merge, which added this suite; revision 2 adds 8 more.) The
harness still bites: `--bite` gives `12/14` with two failures under the mutation.

---

## 8. Counts, on Windows

All re-run at this head (revision 2).

| | |
|---|---|
| A2 gym — `node --test rebuild/m3/w7-preview/today/test/gym.test.mjs` | **59 / 59** |
| A1 today — `design.test.cjs adapter.test.mjs view.test.mjs package.test.cjs` | **64 / 64** |
| **the PM's 123** | **123 / 123** |
| W6 suite — `node --test test/*.test.mjs` in `rebuild/m3/w6` | **550 / 550** (542 before revision 2; +8 for D1/D5) |
| C4 journey — `local-today-journey.test.mjs` | **49 / 49** (43 → 41 → 49; §5) |
| A0 host — `w6/host/test/{journey,engine-equivalence}` | **22 / 22** |
| w7-preview (pinned, untouched) — `test/{model,view,package}.test.cjs` | **19 / 19** |
| `run-current-head.cjs <retained-R1> --all` | **550 / 550**, exit 0 |
| `run-current-head.cjs <retained-R1> --bite` | 12 / 14 — the mutation is still caught |
| Real-Edge runner — `test/local-today-browser.mjs` | **6 / 6**, exit 0, Edge 152.0.4191.66, 8 processes killed |
| `today/browser-check.mjs`, `W7_BROWSER_BIN=msedge` | **PASS**, exit 0 — `taskkill /F /T on 8 msedge.exe of a persistent profile, kill verified`; 15 engine headline titles swept; localStorage holds nothing |
| `today/gym-check.mjs`, `W7_BROWSER_BIN=msedge` | **PASS**, exit 0 — two training days across three REAL process kills; `ONE STORE (C4b): 16 operations in ONE sealed generation under ONE lease — 14 workout and both mornings; each Start stamped on its own day; day 1's Start descends from that morning's reading and day 2's from day 1's close, so NO Start is unordered` |
| the 60-pair race (review D4), re-measured here | 60 weigh-ins acknowledged, 0 sets, `{WORKOUT_RESUME_STALE: 60}`; 61 ops, checkpoint 61, device seq 61, ONE lease, no two ops sharing a `device_seq`, and `ops == before + (weigh?1:0) + (set?1:0)` held on every pair — **no lost update** |
| `node rebuild/m3/w7-preview/today/build.mjs` | PASS — 3 assets, 89 pinned inputs (13 engine, 12 client), 61 bound classes, no network reference |

### CI-relevant steps re-run locally

`node rebuild/m4/spec/native-carriers-package.cjs --ci` → **PASS**
(`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`; twelve children OBSERVED, exit 0 and
exact declared verdict each). Nothing in this branch touches its pins,
`rebuild/m4`, `rebuild/engine`, `rebuild/client`, `rebuild/conform` or `.github` —
confirmed by `git diff --stat 04c8cc9..HEAD`, which lists 18 files, all under
`rebuild/m3/w6/{local,test}`, `rebuild/m3/w7-preview/today` and
`rebuild/lanes/c/C4B-REPORT.md`.

---

## 9. Residuals — what is NOT done

1. **TWO stale-write refusals are named, not removed — and the second one is
   100%** (review D4; C4 residual 2, still open).

   **`WORKOUT_PREPARATION_STALE`** — a preparation held across a reading write is
   refused by name and writes nothing. The shipped screen re-prepares before
   every Start (`gym-app.mjs` `paint()` calls `model.read()`), so the product
   path is safe; `gym.test.mjs` and journey block 8 assert both the refusal and
   the immediately-following success.

   **`WORKOUT_RESUME_STALE`** — the one the first version of this report did not
   name. Under CONTENTION the workout write loses **every time**: measured here,
   60 concurrent weigh-in‖set pairs over one era gave 60 acknowledged readings,
   **0** sets, and `{ WORKOUT_RESUME_STALE: 60 }`. It is a REFUSAL, never a lost
   update — 61 operations, checkpoint 61, device seq 61, one lease, no two
   operations sharing a `device_seq`, and the op count moved by exactly the
   number of acknowledged writes on every one of the 60 pairs — and the unraced
   retry lands. The shipped screen cannot reach the race (one person, one
   thumb, one sheet at a time), so it is a residual and not a defect. But 100% is
   not "a case a one-store page must know exists", and it is stated as 100%.

   **REQUEST TO THE PM, one line:** *`gym-app.mjs` should retry a set ONCE on
   `WORKOUT_RESUME_STALE` after a reading write, the way it already re-prepares
   before Start* — `gym-app.mjs` is PM-owned, the retry is the accepted client's
   own refusal being taken at its word, and without it a weigh-in landing at the
   same instant as a tap loses the tap.

   Making either impossible rather than unreachable needs a serialising write
   lock shared by both paths, which would have to wrap the host's own client —
   the second capture path this work exists to avoid.
2. **§5's RECOMMENDED SECOND HUNK is NOT applied.** `today-app.cjs:311-312`
   closes the weigh-in sheet and calls `render("today", true)` without telling the
   workout entry the log moved, so the card's summary line is one revision behind
   until it is opened. Cosmetic, and the card re-prepares when it opens. It is in
   `today-app.cjs`, which this task does not own, and it is not strictly required
   by the swap — so it is left for the PM with the one-line fix named:
   `await workout.refresh()` before `render("today", true)`.
3. **A lapsed era refuses the whole page.** `openTodayOverLocalEra` throws
   `LOCAL_LEASE_EXPIRED`/20 rather than opening read-only; `boot()` now prints
   the client's copy for state 18, and 20 falls through to the "Not everything
   opened" line. C1's `boot()` reports that case as `readable: true`, so an honest
   "your history is here, saving is paused" screen is possible and is not built.
   It takes 400 days of not opening the app to reach.
4. **`device` is `null` on both handles**; custody is `local-keys.mjs`,
   non-extractable and unexported. Nothing in `today/**` reads `.device`. The
   journey declares it by name and fails on any other nulled member.
5. **No iPhone, no iOS Safari.** Chromium-family evidence only — that is C3's job,
   and the runner says so in its own output.
6. **`today-model.cjs`'s `previewClock` still pins the preview to one synthetic
   day.** That is A1's accepted design (a stored weigh-in stays "today's" across a
   reload) and is untouched. It does mean the era's lease window is anchored at
   `SYNTHETIC_DAY + 13:00Z` rather than at the real clock on the preview page; on
   a real phone `day` is the real day and the window is real. Named, not changed.
7. **The `r1` pins in `shared-edit-source-pins.json` name a MOVING branch.** They
   are the R1 tip's bytes as of this commit. When lane B advances
   `rebuild/m3-w5-r1`, the harness will fail by name with both hashes and the map
   must be re-read and re-pinned deliberately — which is the point, but it is a
   maintenance cost this file did not have before. Pinning R1 at the archived
   `base` commit instead would not move, and is the better shape if the PM wants
   it; it was not done here because `base` predates `context-values.cjs` and the
   change would have gone beyond the scoping fix.
8. **The harness now copies `rebuild/engine` and `rebuild/m3/w7-preview` into the
   composed tree.** That is a wider candidate surface than the three trees it had,
   and it means a `--bite` mutation of those trees is not offered (the bite flags
   still only mutate `w6/public-client.mjs`, `w6/t2-stage.cjs` and two
   `m4/workout` files). Nothing was removed; the surface grew because the suite
   grew.
9. **Synthetic data only.** The athlete is `rebuild/m3/w7-preview/fixtures.cjs`
   and the only ledger any of this reads is the PUBLIC frozen preimage
   `rebuild/conform/fixtures/preimage-2026-08-15.json`. `ledger/` and
   `rebuild/conform/private` were not read; `conform/private` is explicitly
   excluded from the composed tree.
10. **REVISION 2 — `gym-check.mjs` and `browser-check.mjs` ARE now run**, green,
    with `W7_BROWSER_BIN=msedge`; their output lines are in §8. The first version
    of this report left them unexecuted and said so, which was honest about the
    omission but not about its cost: executing them is what found D2 (a RED file)
    and D3 (a hardcoded `chrome.exe` that made the briefed browser unable to run
    either check at all). **Still not run here:** `rebuild.yml` end to end, the A5
    suites, and the W6 browser checks other than the Today runner.
11. **The installation's live day only ever follows the last caller.** A wrapper
    `createGymHost({ day: other })` — the `hostForDay` path used to retire an
    abandoned session, and reachable only when no installation is injected —
    declares `other` and therefore moves the installation's own write day
    backwards **and leaves it there** — closing that transient host does not
    restore it (the reviewer executed this: the live day stayed `2030-02-03`
    after `close()`, so the first version of this entry, "for as long as that
    transient host is open", understated the residual; corrected here, review
    round 2 nit 3). The WORKOUT half is unaffected (each host carries its own
    clock), and the move is RECORDED on `clockAdoptions()` rather than silent, so
    it is visible. The first version of this entry also said a weigh-in written
    in that window "would be stamped the older day". **It is not — it is
    REFUSED**, which is better than was claimed and was likewise measured by the
    reviewer (`weighIn ok=false`); nothing is misstamped, and the day-2 Start
    afterwards is orderable with `startOrderRefusal()` null. The shipped page
    never takes this path — `boot()` always injects an installation, so
    `hostForDay` goes to `era.createGymHost` and touches no clock. Named, not
    fixed.

---

## 10. Commits

| | |
|---|---|
| `8557d58` | ONE STORE applied — the wrappers, the entry point, the device identity, the 123 tests |
| `adea9fe` | the C4 journey retargeted to the applied swap |
| `903cff8` | the Edge runner drives the BUILT page; the two browser checks corrected |
| `394cfdb` | `run-current-head` scoping — the harness reaches 100% |
| `8ba0ff4` | `C4B-REPORT.md` (revision 1 — the head the review rejected) |
| `0de34e3` | **review D1, D2, D3, D5 — all the code.** One clock per host, a live installation clock adopted by name, a refused open that seeds nothing, the two PC checks' corrected op counts and their `PROCESS_NAME` derivation, journey blocks 10 and 11, Edge runner case 6 |
| this | **review D4 and the disclosure** — `C4B-REPORT.md` revision 2 |

Nothing was pushed.

---

## 11. The review's five defects — where each is closed

| | verdict | closed at |
|---|---|---|
| **D1** REJECT — a later boot's day silently dropped; day 2 strands a Start | §2.6 | `0de34e3`; journey block 10 (A/B, 4 cases), Edge runner case 6, `gym-check.mjs` `startDays` |
| **D2** blocking — `gym-check.mjs` RED, and §4's disclosure wrong | §4 | `0de34e3` (three op-count claims re-derived and named, file run green) + this commit (§4 rewritten) |
| **D3** both checks hardcode `chrome.exe` | §4 | `0de34e3`; `PROCESS_NAME = path.basename(W7_BROWSER_BIN)` in both, as the C4b runner already did |
| **D4** `WORKOUT_RESUME_STALE` not in the residuals | §9.1 | this commit; named with the 60/60 figure re-measured here, plus the one-line PM request |
| **D5** a restore-required open still writes to the key database | §2.7 | `0de34e3`; lazy first-run-only minting, journey block 11 |

Residual 7 (the moving R1 pin) the review accepted as-is: declared, loud,
deliberate. It is unchanged.

---

# 12. C4c — the rebase, the third lane, and an order that knows what a workout is

PM instruction, `REQUESTS.md` 10:50 ET, on the tip `e73e28f`. Everything below is
on `rebuild/lane-c-today`, committed, **not pushed**.

## 12.1 The rebase onto `origin/rebuild/t2-client-core`

`git fetch origin` then `git rebase origin/rebuild/t2-client-core`. The branch
replayed onto the tip with **one** conflict.

| file | expected | what happened |
|---|---|---|
| `rebuild/m3/w6/local/build.mjs` | add/add conflict | **no conflict.** The tip's version arrived with the merged C1; this branch's additions are strictly on top of it. Verified after the rebase: `git diff origin/rebuild/t2-client-core HEAD -- rebuild/m3/w6/local/build.mjs` is purely additive — no line of the tip's accepted content is changed or removed. |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | conflict against A3's edits | **conflicted, at `boot()`'s return statement.** Resolved keeping BOTH intents: the swap's `hosts` / `restoreRequired` / `readings` and A3's `checkin` are all returned, and A3's `createCheckInEntry` is kept whole with the injection point added to it. |

Head after the rebase: `7221b22`.

## 12.2 The check-in, folded into the ONE generation

A3's `checkin-host.mjs` opened its own database, its own lease and its own
generation. Its header gives the reason, and the reason is sound **about the
lane it names**:

> the check-in's operations are written through the client's producer-injected
> command, which the client stamps `schema_version` 2 … so this lane's lease is
> schema 2 and it cannot live in the reading lane (schema 1).

That is an argument for a third generation only if the era's own lease is schema
1. It is **schema 2** (`LOCAL_ERA_SCHEMA_VERSION`), which is exactly what a
workout set rides. So a schema-2 producer command rides it too, and the check-in
belongs here. The fold is `era.createCheckInHost({ day, commands, profile })` in
`today-bindings.mjs`:

* the **producer and the profile are arguments, never imports** — `w6` does not
  depend on `w7-preview`, so the page passes its own `checkin-commands.cjs` and
  the profile its facts carry;
* the handle takes its **own** `client.hostBindings(...)`, like the gym card: a
  fresh T2 stage closure over the same repository, so the three lanes serialise
  on the repository's compare-and-swap and never share staging state;
* A3's read-back is **carried, and narrowed by one clause**. The accepted client
  publishes no face for a check-in (A3 seam S1), so the rows come out of the
  authenticated generation as a FILTER. The profile match was already an exact
  equality test; in ONE generation it is what keeps a weigh-in (class `reading`)
  and a set (class `session`) out of the list. Folding the lane in cannot make a
  check-in read anything that is not one;
* `checkin-host.mjs` is now a 58-line wrapper. Nothing in `today/**` mints a key,
  signs a lease or asserts an enrolment — the journey asserts that over four
  files now, not three.

## 12.3 `causalTips` is KIND-AWARE (A3 review F2)

```js
export const WORKOUT_ORDER_CLASS = 'session';
const graphOps = generation => Object.values(generation?.collections?.ops || {})
  .filter(op => op && typeof op.op_id === 'string' && Array.isArray(op.causal_parents)
    && op.class === WORKOUT_ORDER_CLASS);
```

The workout order is not "everything on disk". It is the operations of class
`session` — Start, set, close, and the Undo's tombstone, which the product writes
as class `session` (checked empirically, not assumed). A morning reading is class
`reading`; a check-in fact is class `event`. Both are in the generation, both are
ordered by the device sequence, and neither causes a workout.

**This moves a number C4b moved, back.** C4b's report §4 recorded that under one
store day 1's Start descended from that morning's weigh-in, so no Start was an
orphan. Under class scoping the first Start is an orphan again — the log of
workouts genuinely begins there, which is what it was under two generations —
and day 2's Start descends from day 1's close and the Undo's tombstone. That is
the ordering claim that ever mattered. The three places that asserted the old
shape are corrected, not weakened:

| where | before | after |
|---|---|---|
| `gym-check.mjs` `orphanStarts` | `0` | `1`, with the reason named |
| `gym-check.mjs` `startParents` | `[["fact"], ["fact","session-close","tombstone"]]` | `[[], ["session-close","tombstone"]]`, **plus** a new `startParentClasses` assertion that every parent of a Start is class `session` |
| `gym-check.mjs` pass line | "day 1's Start descends from that morning's reading" | "the workout order is KIND-AWARE (C4c) … and every causal parent of a Start is a workout operation" — the copy is a rule too |

And it is proved where a Start is actually composed, not only over fixtures. The
two-day journey (`local-today-journey.test.mjs` block 10) and the Edge runner
(`local-today-browser.mjs` case 6) both write:

* a recovery check-in **between** the two sessions — after day 1's sets, before
  day 2's Start; and
* a second check-in on the **same day as a Start**, written **before** it.

Each is the newest operation on disk at the moment a Start is composed, which is
exactly the slot a kind-blind frontier would hand that Start as a parent. Both
then assert: `startOrderRefusal()` is `null`; both check-ins are in the SAME
generation, one per day; **no** Start has a check-in among its causal parents;
every causal parent of a Start is class `session`; and the check-in lane still
reads its own fact back off disk. The Edge runner does all of it through the
BUILT page — `mod.boot({ today })` and `booted.checkin.host.save(...)`, the same
calls the screen makes.

A new fixture test in `gym.test.mjs` carries the negative control: in a
generation holding a reading, a Start, a close, a check-in and a second reading,
`causalTips()` is `['c1']` — the close, and nothing else — a Start ordered behind
the check-in alone is refused `WORKOUT_START_ORDER_UNPROVEN`, and a generation
holding only wellness operations has no workout tip at all, so the day's first
Start descends from nothing exactly as it does on an empty store.

## 12.4 One clock provider, covering the check-in host too

`era.createCheckInHost` takes `client.hostBindings({ workoutCommands: commands,
clock: clientClockFor(day) })` — the same per-HOST write clock the gym and
reading hosts take, so a check-in is stamped on the day **its own host** stands
on, in a page load that has moved to another day. It goes through the same
`reconcile()`, so `LOCAL_ERA_CLOCK_MISMATCH` / state 3 applies to it unchanged:
a caller that hands this lane a second store, crypto, database, namespace or
clock is refused by name. The installation's live clock is one provider for all
three lanes; the check-in host never opens or seeds an installation of its own.

## 12.5 A3's and A2's tests — every edited line, disclosed

A3's 28 check-in tests and A2's 60 gym tests are green. Nothing about product
behaviour was weakened; here is every line that moved and why.

**`today/test/checkin.test.mjs`** — the lane no longer has a store of its own, so
the assertions that named one had to change. There are four edits:

1. **Imports.** `CHECKIN_DATABASE`, `CHECKIN_NAMESPACE`, `READING_DATABASE` and
   `AUTHORITY_KID` no longer exist — there is one database, one namespace and no
   page-minted key. Replaced by `DATABASE as LOCAL_DATABASE` /
   `NAMESPACE as LOCAL_NAMESPACE` from `gym-host.mjs`.
2. **`deviceKeys()` deleted (7 lines), and `deviceKeys: keys` dropped from the
   two `createCheckInHost` calls.** The page does not mint a key; C1 holds
   custody. Nothing this test asserted about check-in behaviour depended on it.
3. **MUTANT 5's header comment rewritten.** A3 proved lane separation with three
   stores — "no store holds another store's operation". One store cannot make
   that claim, and leaving the sentence would make the file lie. The claim is
   restated where it always mattered.
4. **MUTANT 5's body.** `kindsIn(checkin) === ['fact/event/…']`,
   `kindsIn(readings) === ['fact/reading']`, `kindsIn(gym) === []` and the
   "three databases / three namespaces" pair were replaced by, in order: the
   three hosts share ONE repository handle (`===`, executed, not asserted about);
   that one generation holds `['fact/event/…','fact/reading']` and nothing else;
   that the check-in lane READS only the check-in; that the weigh-in lane reads
   only the weigh-in; that `gymHost.causalTipsNow()` is `[]` — **the workout
   order sees neither** (A3 review F2); one database, one namespace, one
   `lease_id`. The two "the refusal stored nothing" assertions now compare
   against a `before` snapshot of the shared generation instead of a per-store
   literal, which is the same claim against the store that now exists.

**`today/test/gym.test.mjs`** — two edits, one of them additive:

1. **Four fixture factories gained `class: 'session'`** (`start`, `close`, `set`,
   `tomb`). They omitted it while the workout owned a generation by itself.
   Since `causalTips()` is class-scoped, a fixture without a class is not a
   workout operation at all, so adding it makes the fixture describe what the
   product actually writes. **Every assertion in that block is unchanged** —
   only the fixtures are truthful now.
2. **One new subtest** (26 lines), the F2 negative control described in §12.3.
   60 cases, up from 59.

Nothing in `today-app.cjs`, `today-model.cjs`, `gym-app.mjs`, `gym-model.mjs`,
`checkin-app.mjs`, `checkin-model.mjs` or `checkin-commands.cjs` was touched.

**Out of licence, minimal, and disclosed:** `today/checkin-check.mjs` (A3's
browser check) had the literal `"chrome.exe"` in its CIM filter, so on the
briefed `W7_BROWSER_BIN=msedge.exe` it found no process and failed on its own
guard — the identical defect C4b review D3 closed in `gym-check.mjs` and
`browser-check.mjs`. Three lines: `const PROCESS_NAME =
path.basename(executablePath)`, the filter, and the "no … process was found"
message. Nothing else in the file changed; it now runs green with 3 real kills.
Item 5 of the instruction requires this check to run, and it could not.

## 12.6 The review's four non-blocking nits — closed

| nit | closed |
|---|---|
| 1. a **clock-only** second caller is silently dropped | `openTodayInstallation`'s `else if (day !== undefined …)` is now an `else` block: a second caller whose `clock` is not this installation's provider is RECORDED on `clockAdoptions()` as `{ from, to: null, adopted: false, why: "a second caller handed over its own clock provider; this installation already has one" }` — ignored and NAMED, for the same reason `deviceKeys` is. Refusing would strand the caller. Journey subtest: *"a clock-only second caller is RECORDED, exactly as a second deviceKeys is"*. |
| 2. `liveDay()` misreports under a **declared provider** | the installation now answers with `dayNow()`, which asks the clock it is really using. With no declared provider the two are the same value by construction (`liveClockOver` reads `state.day`); with one, `state.day` is only a wall-clock seed the provider never agreed to. The same function is handed to `openTodayOverLocalEra` as `liveDay`. Journey subtest: *"liveDay() names the DECLARED provider's day, not the seed it was opened with"*. |
| 3. §9.11's two wording corrections | §9 item 11 rewritten above: the live day is **not** restored when the transient host closes (it stays moved), and a weigh-in in that window is **REFUSED**, not "stamped the older day" — which is better than the report claimed. |
| 4. the `ops === 9` message/comment mismatch | `gym-check.mjs` now makes the claim directly: `dayTwoOps === 0` — *"A REFUSED DAY WRITES NOTHING: no operation in the generation is stamped 2030-02-05"*. The composition of day one (`8` + `1` = `9`) keeps its own message, which is what those numbers actually say. |

## 12.7 Everything re-run, after every edit

| what | result |
|---|---|
| `today/test/{design.cjs,adapter,view,package}` | **64 / 64**, exit 0 |
| `today/test/gym.test.mjs` | **60 / 60**, exit 0 (59 + the F2 control) |
| `today/test/checkin.test.mjs` | **28 / 28**, exit 0 |
| `w6/test/*.test.mjs` (the whole W6 suite) | **552 / 552**, exit 0 |
| `w6/test/local-today-journey.test.mjs` | **51 / 51**, exit 0 |
| `w6/host/test/{journey,engine-equivalence}` | **22 / 22**, exit 0 |
| `w7-preview/test/{model,view,package}` | **19 / 19**, exit 0 |
| `run-current-head.cjs <R1> --all` | **552 / 552**, exit 0 — composed-tree parity with the working tree, exactly |
| `run-current-head.cjs <R1> --bite` | exit 1 (the mutant is caught, as designed) |
| `m4/spec/native-carriers-package.cjs --ci` | PASS, exit 0 |
| `today/build.mjs` | PASS — 3 assets, 93 pinned inputs |
| `w6/test/local-today-browser.mjs` (Edge) | **6 / 6**, exit 0, 8 `msedge.exe` killed |
| `today/browser-check.mjs` (Edge) | PASS, exit 0 |
| `today/gym-check.mjs` (Edge) | PASS, exit 0 — three real kills, two training days |
| `today/checkin-check.mjs` (Edge) | PASS, exit 0 — three real kills |

Every browser run used `W6_BROWSER_BIN` / `W7_BROWSER_BIN` =
`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, a fresh
persistent profile under `%TEMP%`, and `taskkill /F /T` with the kill verified.
Synthetic data only; nothing was pushed.

## 12.8 The files, at this head

| file | lines | sha256 |
|---|---|---|
| `rebuild/m3/w6/local/today-bindings.mjs` | 639 | `f1bb8bbb1c03ab2f7eaf1187f1fe19c453e73bc6c3b1aec7fd7c33886c97a4ff` |
| `rebuild/m3/w6/test/local-today-journey.test.mjs` | 1115 | `7e5ccb4cbe3de9addaa6efd4b5e227c0d07914d69fa6e1a75e664d6abb296b5e` |
| `rebuild/m3/w6/test/local-today-browser.mjs` | 370 | `1cf1aa35cc3f39b8e3b2d1f446d2ed6e80ddbb3f1439403fe42d765d86e9f6d1` |
| `rebuild/m3/w7-preview/today/checkin-host.mjs` | 58 | `029b3a9b711cf4f9ef7ba8d33452d87b262d9c1ee34b005009134a8a81ec660b` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 215 | `5fc40e1e6a4fe2768b4fa943d3e55b6f4037575d4e20627300d1147609ba8ab8` |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | 78 | `70a59b5c328f3b029790ed49b957dd2b78eada1b9bdff9606de5ae17a4f01c18` |
| `rebuild/m3/w7-preview/today/reading-host.mjs` | 44 | `a3e9201587f97446f90856f3235cf99da8d487d1be127416be1e5086d17be6aa` |
| `rebuild/m3/w7-preview/today/gym-check.mjs` | 507 | `30816caca2d69a788777b78f6a8dae53f496190fc70adec092e88293251c41db` |
| `rebuild/m3/w7-preview/today/checkin-check.mjs` | 371 | `fd0b3b59ee0cde2d426a257d0ab5a51a0ba026d3b7339fb75a65df8fc0aa9dc5` |
| `rebuild/m3/w7-preview/today/test/checkin.test.mjs` | 780 | `1b0cce2307ae9d30daa538abd802914069ba636fdffd408adeea6df961934be6` |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | 954 | `7ee49c4019dea8d60ed7c476959f1ac38b54dfca7f929eb3b09cd84e24f41f92` |

`PAGE_PINS` in the journey pins the first four of the `today/**` files above —
`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs` and, new in C4c,
`checkin-host.mjs`: the four whose drift the W6 suite could not otherwise see,
because every block here would still pass over an injected `hosts`. The same four
are swept for `IDENTITY_KEY`, `ENROLMENT_EVIDENCE`, `AUTHORITY_KID`, `mintLease`,
`initialGeneration`, `signRecord`, `openDeviceKeys` and `generateKey`.

## 12.9 C4c commits

| | |
|---|---|
| `7221b22` | (the rebase onto `origin/rebuild/t2-client-core`, replaying C4b + the committed review) |
| `e381c44` | the check-in is the THIRD write path into the ONE local era; `causalTips` class-scoped; A3's and A2's tests carried |
| `71494b3` | a check-in between the sessions and one on the same day as a Start — journey, Edge runner, `gym-check`, `checkin-check`; the clock nits' tests |
| this | `C4B-REPORT.md` §12 and the §9.11 corrections |

## 12.10 What I did NOT do

* **Nothing was pushed.** `rebuild/lane-c-today` is local.
* `gym-host.mjs` is **unchanged in C4c** — it carries no C4c edit at all and is
  the same 78-line wrapper the accepted C4b head left (`70a59b5c…`), so lane B's
  one hunk for B-NTC rebases onto it cleanly whichever way round.
* `host/`, `client/`, `engine/`, `m4/`, `conform/`, `.github/` untouched; the
  only file outside the granted list is the three-line `checkin-check.mjs` fix
  in §12.5.
* Still not run here: `rebuild.yml` end to end, the A5 suites, and the W6 browser
  checks other than the Today runner. Residual 7 (the moving R1 pin) is
  unchanged.
