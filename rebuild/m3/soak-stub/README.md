# Installed-storage soak stub

This is a small experiment with invented records, not the Earned app or a real athlete ledger. It starts the storage work in the merged M3 plan, PR #16, commit `0e79e1e` (`rebuild/m3/PLAN-M3-v1.md`). That plan remains unmerged evidence on this branch's `8d573d1` base. This folder does not implement the backend, sign-in, engine, recovery service or full M3 acceptance suite.

**Target supplied for this run: iPhone 17 Pro, iOS 26.6.1.** The integrator must confirm and record both strings from the phone's Settings. An observed user-agent string is separate evidence, not proof of the model or exact OS. Safari 26 freezes the OS portion of that string; use capability checks for APIs, not an OS-version parser. [WebKit's Safari 26 changes](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)

No physical-phone run or elapsed-day verdict is established by the presence of this code. The app never awards C3 PASS.

## Storage agreement

- Use IndexedDB collections `meta`, `ops` and `outbox`. Store three invented operations; two remain in the unsynced outbox and one is a stored control. No server acceptance is represented.
- Commit the seed, operations, outbox and checkpoint in one read/write transaction, requesting strict durability. Successful acknowledgement waits for transaction completion and verified readback. An aborted transaction, unavailable required API or failed readback must not say the seed succeeded.
- This is an asynchronous equivalent of the small T2 atomic boundary. It is not an asynchronous backend passed into T2's synchronous `Store`, which would acknowledge before the write completes.
- Canonical UTF-8 data includes collection/key framing and every stored logical value. SHA-256 covers those ordered rows; the checkpoint itself is excluded from its own hash. This compares logical stored bytes, not IndexedDB's inaccessible physical database files.
- Later verification reads and compares the complete seed shape, all operations, outbox membership and checkpoint. It also requires the separate local receipt marker. Missing or changed material fails closed as `STORE MISSING/CHANGED`; verification never creates or repairs a seed.
- First enrollment requires an exclusive Web Lock around the local marker and IndexedDB work. The code records and reads back a `seed-attempted` marker before creating the database, then replaces it with the verified receipt anchor. Concurrent setup attempts are serialized; an interrupted attempt remains a failure to inspect, not a reason to retry automatically.
- The marker journal is outside the IndexedDB transaction. A Web Lock coordinates cooperating callers; it does not make localStorage and IndexedDB one hardware-atomic transaction. The marker is a failure detector, not an independent backup, and can disappear with the same origin. Strict durability is a browser request, not proof against every device or power failure. The off-device receipt is the experiment's independent evidence.

## First setup and later verification

**Setup is explicit and witnessed.** This is a deliberate deviation from automatic seeding on the first opening: the builder proceeded with the fail-closed default after the optional clarification received no answer. It is not recorded as an owner ruling. The normal `runStore` path verifies only; its explicit metadata path is reserved for the setup action below.

On the first opening of a genuinely new installed icon, the red `STORE MISSING/CHANGED` result is expected: the app has no evidence of an earlier seed. Open **Integrator: first test setup** only after the integrator independently establishes that this installation has never been seeded. Confirm the target from Settings, check the statement about the new installation and saving the receipt off-device, then choose **Start this new storage test**. Require **Saved · seed verified**, a confirmed offline shell, and the complete receipt before recording success. A missing required API or failed setup remains a failure; do not clear its marker or retry it as a new run.

Complete origin erasure is indistinguishable from a never-used origin using only local evidence. Automatically treating every empty origin as first use would silently replace evidence of loss. The app therefore never automatically seeds unknown empty storage. Complete loss can expose the setup panel again, but its checkbox is a human declaration, not proof that the origin is new. If this icon has ever held a seed, or its history is unknown, stop and preserve the failed run with its off-device receipt. Partial loss, a failed first attempt or a missing receipt must not trigger reseeding. Any replacement experiment needs a separately recorded new installation and origin; it cannot repair or pass the lost run.

If eviction removes the service worker and cached page too, an offline launch may show Safari's network failure before this app can execute. The app cannot promise its own recovery screen in that case. Once the shell can load again, verification must still refuse to manufacture the lost records. WebKit documents that storage eviction can remove an origin's data together. [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)

## Install and prepare the target phone

The integrator first uses a separate trial installation for destructive and repeated preflight checks. Keep the qualifying origin and build separate from the everyday app, previews under active development and test automation.

1. Record the actual model/OS, intended origin and public build/commit identifier. Arrange the pressure protocol and final readback appointment.
2. Open the prepared HTTPS address in Safari. Choose Share → Add to Home Screen, leave **Open as Web App** on, and add the icon. [Apple's installation instructions](https://support.apple.com/en-ca/guide/iphone/iphea86e5236/ios)
3. Open that icon while online. Verify standalone mode. Safari-tab storage is not the installed app's store: WebKit copies cookies when adding an app but does not copy other local storage. [WebKit's Home Screen storage separation](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/)
4. Follow the first-setup step above. Setup confirms caching inside this installed app before writing the seed. Require successful transaction completion and integrity readback; record any failure instead of starting a soak by assumption.
5. Export and preserve the receipt as below. Record the final setup interaction/close time externally, then leave this icon unopened until the qualifying readback.

An installed icon alone does not prove that the offline shell is cached, that the store survived, or that the browser reports the requested target correctly. A desktop browser, emulated viewport or headless test is not the physical target.

## Receipt and idle-start record

The local receipt download is ordinary JSON, **not encrypted by the download itself**. It contains the stored rows, full integrity hash, target strings, observed user agent, `seededAt`, `verifyAfter`, persistence response and storage estimate. It makes no request to an upload service.

The integrator must:

1. Transfer the receipt out of the phone into the owner's approved encrypted evidence destination. Keep it outside git, public build output and chat attachments. Use an existing approved encrypted vault/container; do not introduce an unapproved service or put encryption keys beside an unprotected receipt.
2. Verify that the off-device copy can be read using recovery access independent of this phone. Preserve its full bytes and full hash; a screenshot or shortened hash alone is insufficient for the later comparison.
3. Add an external run record containing the deployment URL, commit/build and static-file hashes, actual device/OS, pressure plan, final setup interaction/close UTC time, independent time reference, and earliest qualifying readback time. Do not edit the downloaded baseline to add these facts.
4. Book readback no earlier than the later of the receipt's `verifyAfter` and **final setup interaction/close + 30 × 24 hours**. The app's seed-based date is a lower bound, not proof of 30 idle days. Record later accidental opens externally and move the earliest qualifying date accordingly; do not rewrite the seed to hide them.

An airplane-mode cold launch or kill/reopen check performed after seeding is another interaction. Either perform those checks on a separate trial before the qualifying run, or include the final reopening in the external idle-start boundary. Week-one progress uses the saved receipt; it does not open or poll the idle installation.

Device-clock arithmetic alone is not independent evidence of elapsed time. Record clock or OS changes; do not convert a forward clock change into a soak PASS.

## Safe storage-pressure protocol

The integrator agrees a safe protocol with the owner for the actual target. Use disposable test material outside the idle app. Record Settings storage observations, timestamps, what pressure was applied and for how long, and any system warnings. Do not confuse `navigator.storage.estimate()` origin quota/usage with the phone's available disk space.

There is no invented free-space threshold or mandatory fill duration in this stub. Never delete athlete data, remove the qualifying app, clear its website data or risk the owner's only files to manufacture pressure. Keep the idle origin closed throughout; monitor the procedure externally.

If a safe meaningful pressure case cannot be run, leave that case **PENDING**. A matching test phone can provide evidence for its recorded model/OS; it does not prove that the owner's installation retained its particular data. Record a supported target or pressure case that was not tested. A changed storage implementation, origin, build assumption or target needs a qualifying run for that configuration rather than inheritance of an earlier result.

## Readback and interpretation

At the booked time, verify the external idle interval and pressure record, then open the installed icon once. Preserve the result and current receipt without replacing the original off-device baseline. Compare all stored rows, full hash, outbox membership, original metadata and integrity result against that baseline.

- A successful current verification proves that the expected logical records are present at this opening. It does not by itself prove the idle interval, pressure conditions, physical target or future survival.
- Missing/changed records or an unavailable offline shell are observations to preserve and investigate, not invitations to reseed. Lost acknowledged test records fail the storage experiment.
- Missing interval, target, baseline or pressure evidence leaves the applicable C3 claim PENDING. Only the integrator's recorded physical-run evidence and the milestone review can establish the project's C3 verdict.
- A granted persistence request and a reported quota are recorded observations, not permanent survival guarantees. WebKit uses heuristics for persistence and documents quota/pressure limits. [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)

This stub does not prove production encryption/key recovery, authenticated standing, offline-lease clock continuity, migrations, remote durability, reinstalls recovering real data, or any other M3 gate. It contains no private ledger.

## Static caching and networking boundary

The intended shell consists only of this folder's own-origin static page, scripts, styles, manifest and icons. Initial page installation and service-worker precaching fetch those assets. A successful cache install must include every asset required for an offline launch; missing assets must not be disguised by a runtime network fallback.

`CACHE_STATUS` checks that all eight expected asset URLs are present in the cache. It does not hash their contents or establish their deployment provenance. The integrator's external public-build and static-file hash record pins the actual assets; a cache-presence result alone does not. The worker script is the ninth deployed file and is managed separately by the browser.

Controlled runtime requests use the fixed cache. There is no application polling, analytics, remote font, API/upload request, background sync, push handler, periodic refresh or explicit service-worker update loop. Ordinary verification refuses a missing worker or cached shell rather than reinstalling it. Freeze the deployed files, worker and experiment origin during the run. Do not let a normal preview deployment replace the experiment's code or cache.

The browser can still fetch the service-worker script for its own update checks. `updateViaCache` is a cache policy, not an update-disable switch, and the worker does not intercept its own update fetch. Therefore the claim is **no application-initiated runtime networking**, with inherent own-origin installation and browser update requests disclosed—not a guarantee of zero device traffic. [Service Worker standard](https://www.w3.org/TR/service-workers/)

## Local checks

From `rebuild/m3/soak-stub`, using Node.js 22 or newer and npm, install from the nested lockfile and run the tests:

```sh
npm ci --ignore-scripts
npm test
```

After installation, `node --test test/store.test.mjs` runs the same test entry point directly. The test dependency is pinned `fake-indexeddb` 6.2.5. The current 20 cases passed locally; these are model/transaction fault tests, not Safari or elapsed-day evidence. The exact locally executed setup and results belong in the report.

For the local desktop preflight, run:

```sh
node serve.cjs
```

Open `http://127.0.0.1:8787/`. This server binds only to this computer's loopback interface and allows only the nine static files below. The physical installation needs the integrator's reviewed HTTPS deployment on its own stable origin; this development address is not reachable as an installed iPhone test.

Deploy only `index.html`, `app.mjs`, `store.mjs`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, `icon-180.png`, `icon-192.png` and `icon-512.png`. Do not deploy the server, package files, dependencies, tests, README or any other repository files. Preserve the reviewed bytes, relative paths and origin throughout the qualifying run.

Before the physical run, separately verify complete precaching, installed-mode handling, offline cold launch, blocked/missing assets, aborted first seed, corruption, lost receipt markers, IndexedDB loss and complete origin loss. Destructive checks belong to the disposable trial. None can replace the actual ≥30-day observation.
