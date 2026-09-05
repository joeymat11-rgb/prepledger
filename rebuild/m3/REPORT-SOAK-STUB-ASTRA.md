# SOAK STUB — ASTRA report

## What and why

Branch rebuild/m3-soak-stub, base rebuild/t2-client-core at 8d573d18c540b19672dfe03f0b197d799d4e979c. Implements W0's storage agreement and W1 only. The referenced merged plan is PLAN-M3-v1.md at PR #16 / 0e79e1e; it is not yet merged into this base. The direct user task authorizes this slice. W2 hosting/phone installation and the real SOAK-30 experiment have NOT run.

All implementation, instructions, icons and tests are under rebuild/m3/soak-stub/; this report is the sole addition outside that folder. No frozen app, client, authority, conformance suite, root dependency manifest or root lockfile changed. No private data or credentials enter the stub.

The framework-free page and static manifest/worker form an installable offline shell. The asynchronous IndexedDB primitive stores three locally acknowledged synthetic operations, two unsynced outbox entries, seed metadata and a checkpoint in ONE read/write transaction, requesting strict durability. It acknowledges only after transaction completion and verified readback. The third operation is an unqueued stored control, not a fabricated server acceptance.
The full SHA-256 compares canonical UTF-8 stored strings with collection/key framing. The checkpoint excludes itself from the digest and must separately match its exact expected string bytes. Ordinary reopening uses one read-only snapshot, checks the complete seed shape and separate receipt anchor, and never seeds/repairs missing data. The page shows the short hash, UTC seed/deadline, owner-supplied target, observed browser strings, recorded persist()/persisted()/estimate() results, and a large do-not-open date. Full receipt JSON can be downloaded locally or copied for encrypted off-device custody.

**First-open adjustment:** fully erased origin storage is indistinguishable from a never-used origin to offline code. Automatic empty-store seeding would silently erase the experiment's failure evidence. I asked for the preference, then proceeded with the recommended fail-closed default after allowing time for a response; this is a disclosed builder choice, not a recorded owner ruling. The installed app initially shows STORE MISSING/CHANGED. Its integrator panel requires a never-seeded-installation confirmation and one Start action. Subsequent ordinary opens only verify. No reset is provided. A replacement experiment requires a distinct origin and external run record. This deliberately differs from automatic first-open seeding while retaining first-visit setup and the stronger no-silent-reseed requirement.

README.md contains the storage agreement, exact setup steps, nine-file hosting allowlist, pressure protocol, off-device encrypted baseline procedure and final readback instructions. The UI remains a storage experiment; no engine, health rules, sign-in or real authority is included.

## Executed tests

Node 24.19.0; isolated fake-indexeddb 6.2.5 devDependency and nested package-lock.json. Registry version and integrity were verified. Bundled pnpm registry/install attempts stalled and were stopped; installation succeeded using npm 12.0.2 downloaded into scratch tooling, with scripts/audit/funding calls disabled. No root dependencies were changed.
Reproduce inside rebuild/m3/soak-stub: npm ci --ignore-scripts, then npm test (or node --test test/store.test.mjs). Exact executed Node output:

```text
✔ seed commit and a new connection return identical bytes/hash; inspection is one read-only transaction (8.3755ms)
✔ a same-count value alteration fails checksum validation (2.3475ms)
✔ checkpoint whitespace tampering fails even when parsed JSON is unchanged (1.5974ms)
✔ a missing outbox row fails integrity before returning data (1.1216ms)
✔ a missing checkpoint row fails integrity before returning data (1.0853ms)
✔ an extra stored entry fails integrity (1.0252ms)
✔ two connections racing to seed have exactly one winner without replacing its rows (2.1348ms)
✔ abort after the first successful row write rolls back the entire seed on reopen (1.4877ms)
✔ seed acknowledgement follows transaction completion and completed readback (0.8047ms)
✔ opening a missing store without explicit creation aborts its upgrade (0.4161ms)
✔ default protocol on a blank origin fails closed and creates no seed or marker (0.3235ms)
✔ explicit setup is verifiable by default, but repeated setup cannot replace it (1.0035ms)
✔ complete IDB and marker loss remains restore-required on the default path (1.001ms)
✔ loss of the external receipt alone cannot bless intact IDB as a fresh seed (1.3686ms)
✔ a failed setup attempt leaves a durable marker that refuses a repeated attempt (0.1956ms)
✔ unavailable markers (read throws) deny setup before IDB creation (0.0784ms)
✔ unavailable markers (write throws) deny setup before IDB creation (0.0401ms)
✔ unavailable markers (write silently lost) deny setup before IDB creation (0.0259ms)
✔ setup without a Web Locks capability fails before markers or IDB are created (0.0411ms)
✔ concurrent protocol setup preserves the single winner and its final marker (1.7861ms)
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 104.9999
```

These tests cover transaction completion/readback, aborted partial writes, separate-connection reopen without writes, same-count corruption, exact checkpoint bytes, missing/extra rows, competing initializers, missing markers/locks, failed attempts and complete database-plus-marker loss. A queued exclusive-lock substitute is explicitly declared for Node tests; the application uses navigator.locks.

Additional actual desktop Chromium execution at a 402 × 874 viewport, with standalone detection explicitly simulated (not an iPhone or Safari test), used the rendered checkbox/button and a fresh browser context. It verified offline reload, unchanged full rows/hash, no horizontal overflow, failed integrity before data paint, and the browser-tab install-only path. Exact output:

```text
PASS browser: blank installed-mode origin fails closed
PASS browser: witnessed checkbox/button commits 3 operations and 2 outbox entries
PASS browser: offline reload uses cached shell and unchanged seed/hash
PASS browser: missing outbox row blocks result paint; no repair
PASS browser: no page errors (desktop Chromium, simulated standalone; not iPhone evidence)
PASS browser: ordinary browser tab offers installation and creates no database
```

The browser script and screenshot are scratch evidence, not committed test infrastructure. The requested fake-IndexedDB Node tests are tracked. Static inspection also verified all eight precached assets exist, PNG dimensions 180/192/512, and manifest/worker scope/start URL agreement. Source review found no application API request, upload, analytics, external asset, polling or background sync.

Repository gates executed with the same pinned reference engines and locally regenerated ignored private gate inputs; public pins remained identical after only the existing engine-packaging-stamp normalization. The stub never reads those inputs. Suite/selftest use MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict unsets MEASURED_TEST_NOW. All exited 0:

```text
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
```

Those repository gates exercise the existing frozen reference/app and authority/client families; they do not prove this device store or a 30-day soak. The 29 absent-family RED-as-specified cases remain unchanged. Protected-path and whitespace checks also passed.

## Seams and corrections made during review

- This is the faithful minimal asynchronous equivalent of T2's ops/outbox/checkpoint transaction, not a drop-in backend for its synchronous Store. No lease, operation HMAC, receipts/frontier, encryption keys or transport is claimed. Synthetic probes exercise retention, not authority admission.
- A Web Lock encloses the entire seed-attempt marker, IDB transaction, readback and final receipt-anchor sequence. This fixed an identified competing-window marker-overwrite race. IDB independently checks emptiness inside the write transaction and uses add, never overwrite.
- The separate localStorage attempt marker deliberately precedes the IDB transaction. They are not one atomic storage system: a failure/kill can leave a spent attempt or committed data without its anchor. Both fail closed without automatic retry. Neither local marker nor unkeyed SHA is an authenticated/off-device recovery mechanism.
- The reviewer reproduced checkpoint-whitespace tampering that initially passed parsed-JSON comparison. Exact string comparison now rejects it; the tracked test changes whitespace while preserving parsed JSON. No frozen product rule was changed.
- Normal verification refuses a missing worker/cache rather than silently reinstalling its shell. If JavaScript cannot load, the static page defaults to the red unverified state. If the entire cached page/worker is evicted, the browser may show its own offline-load failure before any app code can run; a custom red page cannot be guaranteed then.
- **Networking limit:** initial static-page installation and worker precaching necessarily fetch this origin's assets. There are no application runtime network calls or runtime cache fallbacks. The browser can independently fetch the worker for update checks; a PWA cannot promise literally zero device traffic. The deployed files/origin must remain pinned. CACHE_STATUS checks asset presence, not content hashes; the integrator's off-device public-file hashes establish the build pin. [Service Worker standard](https://www.w3.org/TR/service-workers/)
- Safari-tab and installed-app storage are separate. Keep Open as Web App enabled, initialize inside the installed icon, and run repeated/destructive preflight on a separate origin. [WebKit installation storage](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/) / [Apple install instructions](https://support.apple.com/en-ca/guide/iphone/iphea86e5236/ios)
- Device/OS labels use the user's stated iPhone 17 Pro / iOS 26.6.1 target; they are not browser-verified. Observed user-agent/platform strings are recorded separately. Safari 26 freezes its OS user-agent component. [WebKit Safari 26](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- Persistence and quota are captured once for the baseline, not polled or used as a survival guarantee. The receipt download itself is plaintext synthetic JSON; the integrator transfers it to the approved encrypted evidence destination. Exact database-file bytes are inaccessible; the digest covers the defined logical bytes. [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)

## What remains unsure / not proved

Physical target support for strict IDB durability, Web Locks, installed-mode storage, persistence permission, offline cold launch, and receipt export must be exercised on the actual phone. Unsupported/failing required capabilities block successful setup. Desktop Chromium and fake-indexeddb do not settle those questions, OS eviction or power-loss behavior.
The displayed date is seed UTC + 30 × 24 hours, a lower bound. The actual idle interval starts after the final setup interaction/close, recorded independently; any early reopen resets that external interval without rewriting the seed. Device-clock advancement never awards PASS. No phone experiment, 30-day interval, storage-pressure result, data port or M3 completion is claimed.
Pressure uses only disposable material, with an agreed safe protocol and external storage/time observations. No arbitrary low-space threshold was imported from the superseded plan. If a meaningful safe pressure test cannot be performed, its verdict stays PENDING. The off-device baseline and final physical readback are integrator W2/SOAK-30 work.
Future W6 reuse must preserve this asynchronous commit boundary and declare any storage/sealing/schema change that requires a fresh qualifying soak. This unencrypted synthetic prototype is not the final P1 client store. No product-rule changes were made.
