# FOOD-LIVE-SAVE - the food day and the machine note the shipped page refused (lane C author)

Branch `rebuild/c-food-live-save` off `origin/rebuild/d-p3-replay-all` 78911ad1. The finding is P3-REPLAY-ALL-FAMILIES open item 1 (review R3, Fable), and it is the owner's own data path.

## 1. The reproduction, on the shipped build path
`today-entry.mjs boot()` with NO declared day and `now: () => 2026-09-16T18:00:00.000Z` (what the phone runs), then `createFoodHost({ day, indexedDB, crypto })` and `createMachineSettingsHost(...)` over the installation boot() opened, then one save each:
```
booted day 2026-09-16 live? true
FOOD    {"ok":false,"state":20,"copy":"Connect once to keep saving ... after 2027-10-21 ...","op_id":null}
MACHINE {"ok":false,"state":20,"copy":"Connect once to keep saving ... after 2027-10-21 ...","op_id":null}
SLEEP   {"ok":true,"state":1,"copy":"Saved on this phone / not yet synced","op_id":"op-device-...-1"}
OP op-device-...-1 earned/sleep-night/v1 {"local_date":"2026-09-16","local_time":"14:00","utc_offset":"-04:00"}
```
One op in the generation: the night. The food day and the machine note were never written.

## 2. The cause, in one sentence
Both hosts handed `client.hostBindings` a `clientClockFor(day)` built with no live instant provider - the pinned preview instant `day + 'T13:00:00.000Z'` - which on a LIVE installation stands BEFORE the `not_before` of the write lease the era issued at the real instant it was opened, so `rebuild/client/lease.cjs check()` refused every write state 20 and nothing reached the log.

## 3. Which defect it is: (i), the hosts
The era rule is right and is not touched. `host-bindings.mjs:244` is `const clock = hostClock || scope.clock;` - a host that declares no clock gets the installation's own, which IS the `live` provider `today-bindings.mjs` closes over at all four of its sites. `live` is reachable ONLY from inside the installation and `today-bindings.mjs` is pinned on disk (legacy-gates.cjs:12-16), so the way a lane outside it passes live is to declare no clock - which `sleep-host.mjs:106` and `measure/measure-host.mjs:159` already do, and which is why sleep saved on the same era. The DAY half does not move: `openTodayHosts` passes the host's `day` to the installation, which adopts it and records the adoption, so `clock.today()` is still this host's day. No law, guard or test weakened; no era rule widened; no `clientClockFor` branch changed.

## 4. Files and hunks
- MOD `rebuild/m3/w7-preview/today/food-host.mjs`, 3 hunks: `clientClockFor` import removed; the header's "NO SECOND CLOCK" paragraph re-reasoned where it stood; `hostBindings({ workoutCommands: createFoodCommands() })` with the reason written at the site.
- MOD `rebuild/m3/w7-preview/today/machine-settings-host.mjs`, 3 hunks: the same three.
- NEW `rebuild/m3/w6/host/test/food-live-save.test.mjs` (6 cells) and this report.

## 5. Drift (`git diff --name-only origin/rebuild/d-p3-replay-all HEAD`, each findstr'd against S5.json)
```
rebuild/lanes/c/FOOD-LIVE-SAVE-AUTHOR-REPORT.md          UNDECLARED
rebuild/m3/w6/host/test/food-live-save.test.mjs          UNDECLARED
rebuild/m3/w7-preview/today/food-host.mjs                UNDECLARED
rebuild/m3/w7-preview/today/machine-settings-host.mjs    UNDECLARED
```
CORRECTION TO THE TICKET'S EXPECTATION: the two host files are under `today/**` but neither is named in `packages/S5.json`, nor in S4/S3/H3/B-NTC - S5 declares `today-entry.mjs`, `today-app.cjs`, `gym-host.mjs`, `reading-host.mjs` and the thirteen `today/test/` files, and not these two. So there is NO sealed drift and no S6 declaration is owed for it. Cell H3/13 reads the `today/test/` paths off rebuild.yml's today step; no file is added there, so the thirteen are still thirteen.

## 6. Cells per bar item
(a) THE RED CELL TURNED GREEN: FLS/2 x2, the shipped `boot()` on 2026-09-16 (EDT, -04:00) and 2026-11-20 (EST, -05:00) - food day and machine note `ok:true state 1`, read back through `forDate`/`latest`, then every handle closed, the page torn down and re-booted off the same IndexedDB, and both read back again; each op carries the page's own day and the offset in force at the instant. PROVED RED FIRST: with ONLY the two host files stashed back to the tip bytes, FLS/2 summer, FLS/2 winter and FLS/5 fail and the other three pass (`pass 3 / fail 3`).
(b) THE CAUSE, KEPT EXECUTABLE: FLS/1 restates the removed line verbatim over a live era and asserts `acknowledged:false`, `state 20`, the client's own copy and an empty food collection - so the refusal is anchored to that clock, not to the food lane.
(c) SLEEP UNCHANGED: FLS/3, same live era, still `ok`, still stamped with the real offset.
(d) NON-LIVE TEST CLOCK PATH UNCHANGED: FLS/4 asserts the declared-day installation still records `local_time 08:00` / `utc_offset -05:00` on the day for BOTH hosts, and that `clientClockFor(day)` still answers 13:00Z / -05:00. Every existing food and machine cell is green with the same figures (today-17 `666/666`, unchanged count and tail).
(e) THE CENSUS: FLS/5 reads all eight host files off disk. Family (a) delegates to today-bindings, which passes `clientClockFor(day, live)` at all four of its sites (:306, :372, :468, :558): `checkin-host.mjs:47`, `gym-host.mjs:83`, `reading-host.mjs:41`, `setup-host.mjs:79`. Family (b) opens its own lane and declares NO clock, so `host-bindings.mjs:244` uses the installation's: `food-host.mjs:72`, `machine-settings-host.mjs:59`, `sleep-host.mjs:106`, `measure/measure-host.mjs:159`. The cell fails if any of the eight imports `clientClockFor` or hands `hostBindings` a `clock:`, and if today-bindings ever drops `live` at one of its four.

## 7. Verbatim tails (Node 24, TZ=America/New_York)
this ticket's cells `tests 6 / pass 6 / fail 0`; W6 `tests 586 / pass 586 / fail 0`; today-17 (MEASURED_TEST_NOW=2026-09-03) `tests 666 / pass 666 / fail 0`; w7-preview/import `tests 15 / pass 15 / fail 0`; m4/import (engine-provider, local-source-order, prepare, production-admission, production-mapping, reading-replay) `tests 83 / pass 83 / fail 0`; retract + admission-swap + local-source-consumer + local-source-admission + production-admission + production-mapping `tests 66 / pass 66 / fail 0`; lanes/d p3-replay-measure + p3-replay-all `tests 35 / pass 35 / fail 0`; coach `tests 231 / pass 231 / fail 0`; client `tests 18 / pass 18 / fail 0`; port `tests 65 / pass 65 / fail 0`; `rig187 => PASS`; `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)`; `A5 PWA BUILD PASS: 13 files ... 11 precached and pinned by sha256`.

`b-package --ci --package S5` is `B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`, EXIT 1 - a BASE condition, not this ticket's. `origin/rebuild/t2-client-core` MOVED during this ticket, from 380db825 (the ticket's stated tip) to 1d30eebb, and 78911ad1 is now an ANCESTOR of it: the replay families merged, so this branch's base is behind the tip and the check refuses on position before reading a byte. Earlier in the same session, at tip 380db825 and with these three files already on disk, the identical command reported `SEAL BASE ON THE TIP`, `PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 81 carried byte-identical / 0 unlisted drift`, `PARENT PINS RE-ASSERTED ... byte-identical on disk AND in Git at HEAD`, and every declared child `OBSERVED; exit 0`. A rebase by the PM onto 1d30eebb is what clears it.

TWO SUITES DID NOT RUN, and neither is this ticket's: `m4/import/test/browser-parity.test.mjs` and `m4/import/test/s3/harness.test.mjs` refuse `Actual owned dispatcher scratch required` (14 cells). That precondition is a real, private installation, which this lane may not open.

## 8. For the owner, in plain words
A food day you saved on the shipped build any time since 2026-09-15 was REFUSED and never written - not saved late, not saved unsynced, not written anywhere. The same is true of a machine note. What you would have seen on screen is the phone's refusal line, "Connect once to keep saving", with a cutoff date about a year away, and the nutrition card still showing nothing recorded for the day. Sleep, Measure, the weigh-in and the check-in were never affected and their records are all there. After this change a food day and a machine note save, read back, and are still there after the app is closed and re-opened - but nothing recovers the days that were refused, because no byte of them was ever written.
