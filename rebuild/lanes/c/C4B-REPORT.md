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
§4. The harness reaches **542/542**, exact parity with the in-place suite.

---

## 1. Files, line counts, sha256

| file | lines | sha256 |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 149 | `4b9a0c218b1c333f9c3c49f418a3a14d9ad31458a00aa19732026fff84571595` |
| `rebuild/m3/w7-preview/today/gym-host.mjs` | 75 | `01b3c813eff92c52af6b91a478fbfb0f4ffe1b4360f9ca86e3eaa743624c6232` |
| `rebuild/m3/w7-preview/today/reading-host.mjs` | 44 | `a3e9201587f97446f90856f3235cf99da8d487d1be127416be1e5086d17be6aa` |
| `rebuild/m3/w7-preview/today/today-model.cjs` | 279 | `ef051efa8ae2b2e905aa76bc04c156c21e36c55ba219e634c7c0be85eb77be42` |
| `rebuild/m3/w7-preview/today/gym-check.mjs` | 428 | `b630ca55ccf3dc43429a38d166725fd220b4e2003484059f81ebe989f668992a` |
| `rebuild/m3/w7-preview/today/browser-check.mjs` | 310 | `6b119f99c67c2d3bca96ae6de87fd383e3174069e9d0f9b62bb55c6b9f8113d4` |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | 361 | `9656c1f54246cb5580aa10626866c884998fc2ccf52068ede6426da06370210e` |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | 609 | `43aa7d60f095ed00df79a5dd9b65fcc7dfdf597d715fbe265f68308b843bb954` |
| `rebuild/m3/w7-preview/today/test/gym.test.mjs` | 923 | `678f5e2991aa662cf6a1bf72db999ebac9ee827bc1e4f619f3b43b4bcbd557f3` |
| `rebuild/m3/w7-preview/today/test/package.test.cjs` | 192 | `8cab604c7968dd80b0ca78ff52409e6ff4fbcaa1687e9cf6a12667444b38525e` |
| `rebuild/m3/w6/local/today-bindings.mjs` | 424 | `24810e35a1b30b222cc837240204436022d8c0c86e8cf667e052fb430108c026` |
| `rebuild/m3/w6/local/local-keys.mjs` | 170 | `12faa80781baff1c79b791ca5aff4f05f94639719aeeb59750963ee2a5c71c62` |
| `rebuild/m3/w6/test/local-today-journey.test.mjs` | 861 | `c318ac4f0d2f72f06e2592bae9725225ccc53a71a62edbc7328ac1f1834011ec` |
| `rebuild/m3/w6/test/local-today-browser.mjs` | 260 | `9d24f6e580586dbaf42408f07a398346fa695d8ecd497845ed1ee44281b5a06f` |
| `rebuild/m3/w6/test/run-current-head.cjs` | 229 | `133b41887493245c4923ac13e2801e78c82fb942b609fbc78c37ffdd94d7c74f` |
| `rebuild/m3/w6/test/shared-edit-source-pins.json` | 17 | `d50df57edf9ef39752d5e7f895df4e00d1a0f316bfad63ff0765a4637497da2f` |

`git diff --stat 04c8cc9..HEAD` — 16 files, +969 / −1036. Nothing under
`rebuild/host`, `rebuild/client`, `rebuild/engine`, `rebuild/m4`, `rebuild/conform`
or `.github` was edited.

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

### 2.2 `gym-host.mjs` — 320 lines to 75 (−379 / +… net −245)

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

### The two optional PC-only browser checks (not in any suite, not in CI)

`gym-check.mjs` (+14/−…) and `browser-check.mjs` (+9/−…) each asserted that the
page's three old databases exist on the device. The swap falsified those five
lines; they now assert the local era's database and its `-keys`, and that the
three old names do **not** exist. `DATABASE` is imported from `gym-host.mjs`
rather than restated. No other line in either file changed.

---

## 5. The C4 journey, retargeted (`local-today-journey.test.mjs`, 43 → 41)

* **Block 5** kept its drop-in half and lost its contrast — the page's
  `reading-host.mjs` no longer re-enrols over an erased generation, because that
  module is a wrapper now. The contrast becomes the stronger claim: the SHIPPED
  page refuses `KEY_MISSING`/18, `boot()` prints the client's own copy with the
  code, `hosts` and `readings` are both `null`, nothing on screen claims a
  reading, and a second open still refuses. `pageDeviceKeys()` deleted.
* **Block 7 — PAGE_PINS re-pinned**, to
  `today-entry.mjs 4b9a0c21…`, `gym-host.mjs 01b3c813…`,
  `reading-host.mjs a3e92015…`. **The comment is corrected** exactly as the round-2
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
| 4 | `taskkill /F /T` on every `msedge.exe` of the profile, kill verified (7 processes) |
| 5 | new process, same profile: the reading AND the workout are both back, same era, `What you did · Set 2` |
| 6 | the device key record deleted under the live page → reload shows `RESTORE_REQUIRED (KEY_MISSING)`, `This morning — not logged yet`, `hosts`/`readings` null on a re-open, the record still on disk, `localStorage` still empty |

`W6 LOCAL-TODAY-BROWSER PASS — 5/5 real IndexedDB cases against THE BUILT PAGE
(3 approved assets, 89 pinned inputs); 152.0.4191.66; killed 7 msedge.exe
process(es) with taskkill /F /T (1 kill)`, exit 0.

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
→ tests 542  pass 542  fail 0   EXIT=0
```

**542/542 in the harness, 542/542 in place — exact parity.** (The PM's 462/464 and
501/501 predate C4's merge, which added this suite.) The harness still bites:
`--bite` gives `12/14` with two failures under the mutation.

---

## 8. Counts, on Windows

| | |
|---|---|
| A2 gym — `node --test rebuild/m3/w7-preview/today/test/gym.test.mjs` | **59 / 59** |
| A1 today — `design.test.cjs adapter.test.mjs view.test.mjs package.test.cjs` | **64 / 64** |
| **the PM's 123** | **123 / 123** |
| W6 suite — `node --test test/*.test.mjs` in `rebuild/m3/w6` | **542 / 542** |
| C4 journey — `local-today-journey.test.mjs` | **41 / 41** (43 before; §5) |
| A0 host — `w6/host/test/{journey,engine-equivalence}` | **22 / 22** |
| w7-preview (pinned, untouched) — `test/{model,view,package}.test.cjs` | **19 / 19** |
| `run-current-head.cjs <retained-R1> --all` | **542 / 542**, exit 0 |
| `run-current-head.cjs <retained-R1> --bite` | 12 / 14 — the mutation is still caught |
| Real-Edge runner — `test/local-today-browser.mjs` | **5 / 5**, exit 0, Edge 152.0.4191.66, 7 processes killed |
| `node rebuild/m3/w7-preview/today/build.mjs` | PASS — 3 assets, 89 pinned inputs (13 engine, 12 client), 61 bound classes, no network reference |

### CI-relevant steps re-run locally

`node rebuild/m4/spec/native-carriers-package.cjs --ci` → **PASS**
(`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`; twelve children OBSERVED, exit 0 and
exact declared verdict each). Nothing in this branch touches its pins,
`rebuild/m4`, `rebuild/engine`, `rebuild/client`, `rebuild/conform` or `.github` —
confirmed by `git diff --stat 04c8cc9..HEAD`, which lists 16 files, all under
`rebuild/m3/w6/{local,test}` and `rebuild/m3/w7-preview/today`.

---

## 9. Residuals — what is NOT done

1. **`WORKOUT_PREPARATION_STALE` is named, not removed** (C4 residual 2, still
   open, and now visible in a product test). A preparation held across a reading
   write is refused by name and writes nothing. The shipped screen re-prepares
   before every Start, so the product path is safe; `gym.test.mjs` asserts both
   the refusal and the immediately-following success. Making it impossible rather
   than unreachable needs a serialising write lock shared by both paths, which
   would have to wrap the host's own client — the second capture path this work
   exists to avoid.
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
10. **Not run here:** `rebuild.yml` end to end, the A5 suites, the W6 browser
    checks other than the Today runner, `gym-check.mjs` / `browser-check.mjs`
    themselves (they need `W7_BROWSER_BIN` and take minutes; their five edited
    assertions are read, not executed — that is the one unexecuted change in this
    branch and it is named here).

---

## 10. Commits

| | |
|---|---|
| `8557d58` | ONE STORE applied — the wrappers, the entry point, the device identity, the 123 tests |
| `adea9fe` | the C4 journey retargeted to the applied swap |
| `903cff8` | the Edge runner drives the BUILT page; the two browser checks corrected |
| `394cfdb` | `run-current-head` scoping — the harness reaches 100% |
| this | `C4B-REPORT.md` |

Nothing was pushed.
