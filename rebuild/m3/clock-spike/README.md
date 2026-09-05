# Clock continuity diagnostic

This W3 probe is a separate, synthetic PWA. It records browser clocks and an IndexedDB counter; it does not issue or verify a lease, accept an Earned operation, contact an authority, or establish C11 PASS. No physical-phone result is claimed by the presence of this code. The existing idle storage experiment must not be opened, refreshed, inspected, reset or used by this probe.

The target supplied for the manual run is **iPhone 17 Pro / iOS 26.6.1**. The integrator confirms those strings in Settings and records the actual target externally. The stored user agent is an observation, not model/OS verification: Safari 26 freezes its OS component. [WebKit Safari 26 changes](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)

## What is measured

Each explicit capture, and each later installed document opening with verified history, records:

- `Date.now()` and its UTC rendering, clearly labeled **untrusted wall-clock observations**.
- `performance.timeOrigin`, `performance.now()` and their sum, without rounding the recorded numbers.
- A random document ID, label, user agent, standalone/visibility observations, timezone name and `getTimezoneOffset()`.
- A persisted counter, starting at 1, and maxima of the observed wall value and `timeOrigin + now` values. These maxima are diagnostic high-water values; neither is an authenticated server-time high-water clock.

A single IndexedDB read/write transaction commits the complete history, counter, high-water values and SHA-256 digest together. The promise resolves after transaction completion; the app verifies readback before saying the observation was stored. A full-body optimistic comparison refuses a concurrent stale writer. The strict-durability request is not a guarantee against every hardware failure. The history digest detects inconsistency, not malicious replacement or an internally consistent old backup.

Initialization also uses a Web Lock and a localStorage attempt marker. Those two storage mechanisms are not one atomic transaction. The attempt marker makes a partial initialization fail closed; it is not an independent backup. A later verified run requires its matching marker. Opening or capturing never deletes, heals, reseeds or resets diagnostic data. A failed capture retains the selected label and does not acknowledge an observation.

The counter increments within the surviving local history across relaunches. An old restored copy can roll back that history and its counter together. Complete origin erasure cannot locally be distinguished from never having used the origin. Both cases require independent evidence. The probe offers no import/reset path; a new experiment uses a new, externally recorded origin, and cannot replace the verdict of a lost run.

## What the result means

**Intact diagnostic history remains state 20: continuity unproved.** Same-document elapsed milliseconds can be displayed as a measurement. A new document, process kill, reboot, old-state restoration or matching `timeOrigin` does not establish a trusted elapsed interval. Even a monotonic counter records ordering, not the duration between observations. The High Resolution Time specification limits monotonic-clock continuity to a user-agent execution; timestamps do not supply an enduring clock across arbitrary restarts. [W3C High Resolution Time, clock concepts](https://www.w3.org/TR/hr-time-3/#clocks)

This page has no signed server time, challenge-bound fresh proof, authenticated standing, device sequence capability or renewal. Therefore it never authorizes writes, even in the same document or while online. Missing/corrupt/unavailable history is state 18 and its result panel is suppressed. There is no sign-in/recovery service here; the integrator preserves the failure instead of using initialization as recovery.

The governing source is runtime sheet v1.7.38: A2 lines 132–149; cross-state precedence 323–326; states 17/18 at 597–607 and state 20 at 623–628; C11 at 654–660. The real client must enforce both the time cutoff and authorized sequence range, keep entered values when refusing, and allow valid late arrival. This diagnostic does not implement or prove those authority obligations. Its observation counter is not `device_seq`.

## Install and preserve the independent baseline

Use a dedicated, pinned diagnostic origin, separate from every existing application and idle experiment. The integrator deploys only these ten static assets after review: `index.html`, `app.mjs`, `store.mjs`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, `icon.svg`, `icon-180.png`, `icon-192.png`, `icon-512.png`. The PNGs supply the Home Screen and manifest icons. No deployment is performed by this code task. Do not deploy tests, notes, receipts, package files or the rest of the repository.

1. Record the reviewed public build/commit, static-file hashes, exact HTTPS origin, actual device/OS and original automatic-time/timezone settings. Prepare an independent stopwatch/time reference and encrypted off-device receipt destination.
2. In Safari, open the diagnostic HTTPS address; choose Share → Add to Home Screen; leave **Open as Web App** on; tap Add. Open **Clock probe** from its new icon while online. The Safari tab does not initialize or capture. [Apple installation instructions](https://support.apple.com/en-ca/guide/iphone/iphea86e5236/ios)
3. On a truly new diagnostic origin, the initial state 18 is expected. Open **Integrator: initialize a new test**. Check the declaration only after independently establishing that this origin has never held a run and confirming the target. Tap **Initialize this new diagnostic**. Unknown history is a stop condition, not permission to check the box.
4. Require the stored observation counter and a complete receipt. Expand **Integrator: preserve the complete receipt**; tap **Download current receipt**, or copy its full text if iOS does not offer a usable download. Read back the complete saved JSON before proceeding.
5. Keep the baseline JSON unchanged in an approved encrypted location off the phone. The download itself is plaintext. Record its full digest, run ID and counter plus independent time in the integrator's external log. Preserve each later receipt separately; filenames contain run ID and counter, but a rollback may repeat them, so prevent replacement in the evidence destination.

The local marker and all local history can disappear together. Complete loss can expose the initialization panel again; its checkbox is a human declaration, not detection of first use. If this origin ever held a run, retain the original receipt and investigate. Do not initialize again. If eviction also removes the worker/cache, an offline launch may fail in Safari before this page can show state 18.

## Fifteen-minute target-phone checklist

This is a **15-minute scheduled checklist**, timed by the independent stopwatch, not the phone under test. It is not a promise that installation, off-device transfer, system restrictions and reboot all finish in that window. Record each completed action's real time; at minute 15 mark unfinished cases **NOT RUN**, restore the original time settings, and book an extension. Never invent elapsed time or rush through missing evidence. No step opens another app installation under test; record device-wide clock/reboot changes externally when another experiment shares the phone.

| Stopwatch | Taps and observation |
|---|---|
| 00:00–02:00 | Confirm target/settings and use Safari → Share → Add to Home Screen → Open as Web App on → Add. Open the new **Clock probe** icon online. Complete witnessed initialization only on the verified new diagnostic origin. |
| 02:00–04:00 | Export the full baseline off-device and read it back. Tap **Record one observation** twice with **Manual observation** selected. Record the two counters, document ID, clock values and full digest. Both observations remain state 20; an increasing counter is not a lease. |
| 04:00–06:00 | Select **Before process kill**, record, then enable Airplane Mode and ensure Wi-Fi is off. Open the app switcher and swipe away **Clock probe** only. Reopen that icon. It should load its cached shell and append **Document opened** only after history verifies. Select **After process kill** and record. Compare the run ID/history/counter and document IDs with the baseline. Record loss or launch failure instead of reseeding. |
| 06:00–08:00 | In Settings → General → Date & Time, disable **Set Automatically** if permitted and set the date/time approximately **+24 hours from the independent reference**. Return to Clock probe; select **Wall clock +24 hours** and record. Record the actual applied offset, not just the requested one. The diagnostic remains state 20. |
| 08:00–10:00 | In the same Settings screen set approximately **−24 hours from the independent reference**; this is not merely undoing the previous +24-hour setting. Return, select **Wall clock -24 hours**, record. The wall high-water may stay at its earlier maximum; that does not validate continuity. Restore the original time settings, then record **Clock restored**. |
| 10:00–12:00 | If permitted, use Date & Time → Time Zone to choose a named zone with a different current offset. Record **Timezone changed** and the observed zone/offset; restore the original zone and automatic settings, then record **Timezone restored**. This is a timezone test, not a real DST transition. |
| 12:00–15:00 | Restore automatic time before reboot. Power the phone off normally and turn it on again. Reopen Clock probe offline, record **After device reboot**, and export the current full receipt when off-device transfer is available. Compare every retained observation and counter with the baseline; continuity remains unproved. If reboot or evidence transfer exceeds the slot, record the actual duration and unfinished work. |

Apple documents the Date & Time settings and possible restrictions. If controls are unavailable, mark the manual clock case NOT RUN; do not bypass device-management restrictions. Re-enable the original automatic time/timezone settings and verify against the independent reference at the end, including after an interrupted run. [Apple date/time support](https://support.apple.com/en-us/101619)

**Actual DST:** schedule a separate observation across a real DST boundary in the target zone with automatic time enabled. Save before/after receipts and independent UTC timestamps; use the **Actual DST transition** label. A manually changed date or timezone is a simulation and must be labeled as such. No actual DST result is claimed by the 15-minute checklist.

**Old-state restoration:** use only a disposable diagnostic installation and an integrator-controlled local test setup to restore an earlier complete diagnostic snapshot/marker. Keep the later receipt outside that origin first. The old copy may be internally consistent and then increment again; compare it externally and retain state 20. The PWA intentionally has no reset/import feature. A desktop injected-state case is not evidence of an iPhone backup restoration.

## Static network boundary and local verification

There is no framework, runtime dependency, API call, upload, analytics, remote font, CDN, sync, push, poll or background capture. A later installed document opening records once; additional observations require a tap. Initial same-origin page loading and the worker's complete nine-asset precache require static requests. Controlled fetches are cache-only; missing or unknown assets have no network fallback. Keep the origin and bytes pinned; cache readiness checks presence, not content hashes. The external build-hash record supplies the byte provenance.

The browser may independently fetch its service-worker script for update checks; the application cannot promise zero device traffic. There is no explicit update loop or update-triggered measurement. The worker has no authority role. [Service Worker standard](https://www.w3.org/TR/service-workers/)

The storage functions in `store.mjs` accept injected IndexedDB, marker, Web Lock and crypto dependencies for tests. Syntax checks use `node --check` on `store.mjs`, `app.mjs` and `service-worker.js`; they are not browser, durability or C11 evidence. Separate tests must exercise transaction abort, stale concurrent capture, missing/corrupt history, failed initialization marker, reopened counter/high-water and full old-state rollback. The independent protocol model/test/design note and report carry their own verdicts. This README claims no physical execution or full C11 completion.

Run the tracked protocol and unchanged-core witnesses from the repository root (Node 24, no added package dependencies):

```text
node --test rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs
```

The optional desktop boundary check is `node rebuild/m3/clock-spike/test/probe-browser.cjs`. It needs Playwright and an installed Chrome; set `CLOCK_PLAYWRIGHT_MODULE` to an existing Playwright package directory if it is outside module search paths. Install test tooling outside the frozen app; no package-file edits are required. It serves only the allowlisted probe assets on a temporary loopback port, uses a fresh synthetic Chrome profile, emulates standalone detection, and closes its server/browser. It verifies real IndexedDB readback, browser close/reopen with cached offline shell, baseline retention, increasing counter, mid-session tamper and reopen refusal, and narrow layout. The synthetic profile is retained locally for inspection. This is desktop Chromium evidence, not iPhone installation or clock qualification.
