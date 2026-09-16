# M2-S4-REAL-DAY — author report

Lane B · Opus · effort high · ENGINE-TIER PACKAGE PROCESS, child of `M2-S3-COMPANION` · size S. Branch
`rebuild/b-s4-real-day`, head rebased on `origin/rebuild/t2-client-core` `f84e694`. Not pushed.

## 1. What shipped

`boot()` with no declared day — which is exactly how the page starts itself — resolved to
`TodayModel.SYNTHETIC_DAY` and handed every host a clock pinned to one instant (13:00Z, `-05:00`, hour
8, `monotonicMs` 0). It now resolves the device's own local calendar date and hands the hosts a MOVING
clock: real `now()`, the civil offset in force at that instant, `monotonicMs` from `performance.now`,
the real local hour. The day is re-read on visibility change and on a slow tick, so a page left open
over midnight re-opens on the new day. A caller that DECLARES its day keeps the pinned instant byte
for byte. This is also the fix P2's author stopped on: the fixed `-05:00` made the installation's own
setup operation fail the offset predicate `source-admission.mjs:105-110` applies, so admission refused
it `LOCAL_SOURCE_CONTEXT_UNRESOLVED` on every EDT day. Both sides are executed in `S4/5`.

## 2. Files : hunks

Role `edited`, all parent PRODUCT pins: `m3/w6/local/today-bindings.mjs` 88/29 ·
`m3/w6/test/local-today-journey.test.mjs` 54/3 · `today/test/setup.test.mjs` 34/8 ·
`.github/workflows/rebuild.yml` 22/4 · `lanes/b/tooling/b-package.cjs` 15/2 ·
`lanes/b/tooling/packages/H3.json` 1/1 (round 2, review finding 4). Role `new`,
parent-pinned nowhere: `today/today-entry.mjs` 129/7 · `today/today-app.cjs` 49/3 ·
`today/gym-host.mjs` 13/3 ·
`today/reading-host.mjs` 6/2 · `m3/w6/host/test/local-real-day.test.mjs` 502/0 ·
`today/test/food.test.mjs` 25/3 · `today/test/machine-settings-ui.test.mjs` 24/4 ·
`today/test/problem.test.mjs` 19/2. `today-app.cjs` is round 3's new file in this list, and it is
LANE C's AND UNPINNED: no parent pin names it, no `PAGE_PINS` entry holds it (the journey suite says
in terms that it is DRIVEN by the blocks above and needs no pin), so the runner would have reported
no drift on it either way. It is declared anyway, role `new`, pre
`a2e7de0f0e92b8fedc7b2e99c2fae26690ea0c61bc20e067bb61d51c60618683` at `sourceBase` and post
`1ae7fbc6815588b9136c3f8533a85197765ac6eaca7c0f33127bbdaaa278f112` on disk, because a package
declares what it edits. `today-entry.mjs` IS pinned (`PAGE_PINS`) and is re-pinned for round 3.
Role `superseded-by-child`, a parent EXECUTION pin:
`lanes/b/tooling/packages/S3.json` 1/1 (`tooling.runnerSha256` re-pinned onto the S4 runner, as S3
re-pinned `H3.json`; round 2 re-pins `H3.json` itself the same way). Not product: `packages/S4.json`,
`acceptance-s4-real-day.json`, the brief, this report. Nothing under `rebuild/engine` moves: all 20
engine files the parent pins are carried at the parent's post, byte-identical on disk.

## 3. sha256

brief `S4-REAL-DAY-BRIEF.md` `5f1ee6f36c1d59087ef12a5819cbf338347e4dc0529ad6954630ea32e434bc09`
(12244 B, unchanged in rounds 2 and 3) · spec `packages/S4.json`
`b4a229231c7296b1f0031352c205e41ca5ea9d5058da66a5a092178d6530c252` (32946 B) · artifact
`rebuild/m4/spec/acceptance-s4-real-day.json`
`ca9379fbc8d5c55e7efe9625979f02981707186aff6a0cfd869ab8e5a3455175` (34151 B) · runner `b-package.cjs`
`422d1e9fd5174047a2eb5f92845826e22023d6d297a54e7a6a796f6824e20340` (234590 B) · parent artifact
`acceptance-s3-companion.json` `fb2f6a023ac6bcfc584c115078b16fb8ec21eba3a71c1c231c573d52dbab74f2`
(39692 B). The artifact is `proposed()`'s own shape, key for key and in its order: `covered` and
`byChild` empty (the parent map byte-for-byte), `superseded` `[]`, `supersededByCarrier` `{}`,
`supersessions` `null`, `run` all nineteen gates, `reviewedCommit` the parent's `ee8fdbbb`.

## 4. Cells — `rebuild/m3/w6/host/test/local-real-day.test.mjs`, 15/15

* `S4/1` x2: the device's own offset at two instants 231 days apart and the calendar date against the
  local calendar accessors; the EST/EDT pair and the 03:59Z / 04:01Z midnight pair named for New York.
* `S4/2` x2: the DIFFERENTIAL. `clientClockFor(day)` with no live provider, member for member against
  the TIP'S OWN literal rebuilt from `git show <sourceBase>:today-bindings.mjs`; the engine clock too.
* `S4/3` x2: with no options the booted model's `today` is the device date; two reads of the live clock
  DIFFER across a real delay, beside the frozen clock asked twice.
* `S4/4` x2: the rollover re-opens ONCE and not before; a stopped watcher is inert; a declared-day boot
  arms none.
* `S4/7` (round 2, review finding 1): TWO consecutive midnights through the REAL `reopen`, not a stub.
  `boot()` on night zero, the watcher fires on night one and its own re-boot runs; the page is then
  holding ONE `visibilitychange` listener and ONE interval timer, counted where the module takes them
  (a wrapped `document` and a wrapped global `setInterval`/`clearInterval`). On night two the FIRST
  watcher does not fire and produces no second re-boot, the standing one does, and the counts are
  still 1 and 1. RED FIRST on round 1's bytes: `actual 2, expected 1` at night one.
* `S4/8` (round 3, review round 2 BLOCKING finding 1): the same two midnights, measuring what the OLD
  MOUNT can still DO. Both older mounts are left OFF Today (`why`), the day moves twice through the
  real `reopen`, and then ONE hardware `Escape` is dispatched on `#phone` - the node every mount
  shares - with nothing awaited between the snapshot and the comparison, so what is measured is the
  synchronous handler. `#phone`'s text is unchanged, both old mounts are still on `why`, and the live
  one is still on `today`. Then ONE tap of the primary button on that same surface, carried through
  the sheet it opens to a durable write: every stamped row the installation holds carries the CURRENT
  local date. Both stale mounts are then asked to weigh in and record nothing, the record does not
  move, and exactly ONE `#phone` keydown listener, ONE `visibilitychange` listener and ONE interval
  timer are left standing, with `first.api.disposed()` and `second.api.disposed()` true and the live
  mount's false. Listeners are counted where the module takes them (the `#phone` ELEMENT's own
  `addEventListener`/`removeEventListener` wrapped, beside `S4/7`'s document and global timer wraps).
  RED FIRST on round 2's bytes, proved by reverting BOTH product hunks and nothing else:
  `# pass 14 / # fail 1`, and the failing line is `the Escape repainted nothing at all` with
  `+ '    Friday, September 4\n'` against `- '    Saturday, September 5\n'` - yesterday painted over
  the new day, which is the review's own measurement as a diff.
* `S4/5` GREEN: the installation's own setup op, written live on a September day, carries the real
  offset and PASSES the admission predicate. RED FIRST: the SAME op under the frozen clock still says
  `-05:00` and FAILS it. Anchor: the restated predicate is byte-anchored to `source-admission.mjs`.
* `S4/6` x2: a declared day records exactly `{local_date, 08:00, -05:00}`; a live host on the same path
  records a different, real triple. P0-B / P0-C cells, including P0B.12 (no fixture figure on an
  enrolled first frame), ride the `today-13` child: thirteen today suites by name, 645/645, exit 0.

## 5. Runs at the rebased head

`--ci --package S4` reaches every piece of evidence and stops at the two obligations the brief
predicts, and at nothing else. Every line below is the runner's own bytes, WHOLE — review round 1
finding 2 was right that a verdict line quoted to its first comfortable token is not a quotation. Two
elisions remain and both are marked in the bytes themselves: the HEAD sha in `FIDELITY` (a report
inside a commit cannot name that commit's own sha) and, on each `CHILD` line, the argv echo (the
same file lists `packages/S4.json` declares, quoted in full there) with the stdout byte count beside
it, which carries TAP duration digits and therefore moves by a byte or two between runs. Neither is
a verdict.
```
B PACKAGE S4 PRODUCT IMPLEMENTED; 15 at the declared post-image / 0 at the pinned pre-image / 68 carried byte-identical from the parent / 0 declared role "pinned-unchanged" — executed by a declared child, produced by nothing / 0 unlisted drift; the inventory covers all 74 parent-pinned product files; 1 declared role "superseded-by-child" over a parent EXECUTION pin, each equal to the parent byte (rebuild/lanes/b/tooling/packages/S3.json)
B PACKAGE S4 FIDELITY OBSERVED; sourceBase f84e694 ancestor of HEAD <this commit>; 5 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner 422d1e9fd517 and spec b4a229231c72 pinned (artifact not sealed yet); 16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)
B PACKAGE S4 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE S4 LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase IMPLEMENTED; this package declares NO D-id, so these rows are the register BASELINE and prove nothing about it — its obligation is the Y1 own-child rule reported below
B PACKAGE S4 CHILD s4-real-day OBSERVED; exit 0, <bytes> bytes of stdout, exact declared verdict at line start; ran <argv>
B PACKAGE S4 CHILD today-13 OBSERVED; exit 0, <bytes> bytes of stdout, exact declared verdict at line start; ran <argv>
B PACKAGE S4 CHILD a0-journeys OBSERVED; exit 0, <bytes> bytes of stdout, exact declared verdict at line start; ran <argv>
B PACKAGE S4 COVERAGE 0/19 original gate(s) covered by 0 executed child(ren) (0 inherited, the parent map byte-for-byte; 0 moved, each naming its own original executable in a relative require specifier and each proved by that gate’s own needle out of R.GATES in the child’s stdout); 19 re-execute under --full
B PACKAGE S4 NO-REGISTER OBLIGATION S4 registers no D-id, so the 45-law accounting imposes nothing on it; in its place 2 of 2 declared child(ren) executing one of this package's own role:"new" product file(s) ran in this process, exit 0, with their exact declared needle at line start — 1 required at the seal (3 child(ren) declared in total: s4-real-day -> rebuild/m3/w6/host/test/local-real-day.test.mjs; today-13 -> rebuild/m3/w7-preview/today/test/food.test.mjs rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs rebuild/m3/w7-preview/today/test/problem.test.mjs)
B PACKAGE S4 OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE S4 OPEN brief rebuild/lanes/b/S4-REAL-DAY-BRIEF.md not accepted by a PM ledger line
B PACKAGE S4 OPEN closed cumulative profile not sealed
B PACKAGE S4 CI REVIEW-PENDING: 2 open obligation(s); public evidence only; no PASS is claimed
```

`AUDIT RED-FIRST FAIL` on the `LAWS` line and the third `OPEN` are both PRE-EXISTING and neither is
S4's: the tip's own `--ci --package S3` prints the same `AUDIT RED-FIRST FAIL` while still reaching
`PUBLIC CI EVIDENCE PASS`, and `closed cumulative profile not sealed` is the state every package
stands in before its artifact is sealed. They are quoted here because a verdict line is quoted whole
or not at all, not because anything about them moved.

exit 2. Suites, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`, exit 0 each: today 13 by name
645/645 (tip 645 / 0 fail, no new today file); W6 586/586 (the rise over 564 is P2's merged suites,
not mine, and P2's own `prepare` + `reading-replay` cells are inside that count); A0 plus the S4
cells and the host seams 47/47, of which `s4-real-day` is 15/15; coach 218/218; PWA 44/44 and 12/12;
the A1 build `W7-PREVIEW BUILD PASS: 3 allowlisted assets; 16 approved browser inputs; pinned
T01/T02/T08` and the A5 build `A5 PWA BUILD PASS: 13 files ... no em/en dash in any text this build
emits`; `FROZEN-PATHS PASS`
and `OLD-PACKAGE PASS`; `PUBLIC-CONFORMANCE PASS` 99 reference GREEN / 99 STRONG / 141 mutants;
`PUBLIC-ORACLE check PASS` 7/7, `sensitivity PASS` 9/9; `ENGINE-TRACK PASS`; W0's own fail-closed
tests 10/10; `rig187 PASS`.

**THE `--ci --package S3` TOKEN AT THIS HEAD (review round 2, minor 2), stated rather than left to
the H3 measurement.** At the TIP `f84e694` the parent step passes: `S3` exit 0, and only `H3` stops,
at `SEALED-PROFILE-RECOMPUTATION`. At THIS head both stop there, and the whole line each prints is
`B PACKAGE S3 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local
diagnostics withheld` (exit 1) and `B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; required
evidence missing or failed; local diagnostics withheld` (exit 1). So `--ci --package S3` DOES change
state at this head, from exit 0 to exit 1 at `SEALED-PROFILE-RECOMPUTATION`, and round 2's report was
wrong to say "no token change" while measuring only `H3`. It is supersession working exactly as the
parent's did - S4 registers itself in the runner, so the runner's bytes move, and a spec re-pinned
onto the new runner no longer recomputes the artifact its own seal stands on - and `rebuild.yml`
retires the `S3` step for `--package S4`, so no CI step is left standing on the changed token. It is
precedented, not a defect: H3 stood exactly here behind S3, and S3's own report records it.

## 6. The PM lines the runner needs

Exactly two, both drafted in full in brief section 6 in the `DECISIONS:135 (2)` shape: (1) **THEME
`M2-S4-REAL-DAY`**, naming the brief path and the parent artifact `acceptance-s3-companion.json`
`fb2f6a02...` (receipt `DECISIONS:423`), ending `ACCEPTED`, which closes
`THEME-AUTHORIZATION-UNAVAILABLE`; (2) **BRIEF ACCEPTED BY SHA** for `S4-REAL-DAY-BRIEF.md` carrying
sha256 `5f1ee6f36c1d59087ef12a5819cbf338347e4dc0529ad6954630ea32e434bc09` (12244 B), ending `ACCEPTED`.
Then `authorizations.theme` and `brief.acceptedLedgerLine` are filled in `packages/S4.json` with the
line bytes and `lineSha256`, the spec sha moves, the artifact is re-emitted, and `--ci` reaches
`PUBLIC CI EVIDENCE PASS`. **No `GATE-SUPERSESSION` line is requested and none may be written**: S4
moves no engine byte, so it retires no byte-identity carrier.

## 7. Open items

1. **The two PM lines above.** Nothing else blocks `PUBLIC CI EVIDENCE PASS`.
2. **`rebuild/m3/w6/test/` is not one of the runner's seven `CHILD_ROOTS`** (`CHILD-ARGV-TARGET`). The
   cells moved to `rebuild/m3/w6/host/test/local-real-day.test.mjs`, which IS one, and are named in
   `rebuild.yml`'s A0 step too. I did NOT widen `CHILD_ROOTS`. Consequence:
   `local-today-journey.test.mjs`, which S4 edits, cannot be a declared child from where it stands; it
   runs in the W6 suite and is reported here, not by the runner.
3. **The ticket named a `CHILD_SPECS` helper `['H3','S3']` in `local-today-journey.test.mjs`.** It was
   not there: S3 installed a single `packages/S3.json` read at `setup.test.mjs:2326`. I extended THAT to
   `['H3','S3','S4']` and exported `CHILD_SPECS` / `declaredPostIn` from the journey suite.
4. **Four lane-C guard cells amended, not weakened** (`food.test.mjs` N1.18, `machine-settings-ui.test.mjs`
   S10 x2, `problem.test.mjs` N2-08, `setup.test.mjs` re-pin x2). Each reads the declaring-spec chain
   instead of one hash: an undeclared move, a declared move that has not landed, and drift in a file no
   spec names are all still red. Three are lane C's and no parent pins them, so they are declared role
   `new` — confirmed at review round 1: `new` means "not in the parent map", and none of the three is
   in `packages/S3.json`'s product map. Round 2 re-pins `PAGE_PINS['today-entry.mjs']` once more, for
   the watcher fix, and the same four cells hold it.
5. **The ticket's P0 pointer is UNRESOLVABLE, and round 1 should have said so.** Review finding 3 is
   right: object `65ac9e89` exists in no repository I can reach (the PM repo, `%TEMP%\earned-p0b`,
   `prepledger-dev`), and `rebuild/lanes/c/P0-HIS-NUMBERS-AUTHOR-REPORT.md` is on no ref — the branch
   the ticket names carries `P0B-AUTHOR-REPORT.md` instead. Round 1's item 5 described that object's
   contents; it should have reported it ABSENT, and does now. **The conclusion is unchanged and was
   reached on the code, not the pointer**, which is also where the reviewer's own check landed:
   `today-entry.mjs:127` `async athleteState()` is a post-mount ASYNCHRONOUS adoption, so what stands
   in the tree does strictly more than remove the 8 ms note frame, it is not a strict simplification
   with no behaviour change, and **P0-B and P0-C are left exactly as they are.**
6. **`options.now`** is a Date provider for cells only; it never decides which day a HOST stands on.
   Round 1's `clock.tz` caveat was MORE CONSERVATIVE THAN THE CODE and review finding 5 corrected it:
   the offset is not frozen for the life of a client. Each host binds its own, and the reviewer's own
   headless run wrote `01:00 -05:00` and `04:00 -04:00` in ONE session on 2026-03-08 — a DST change is
   carried by the next host that binds, and at the latest by the rollover, which rebuilds them all.
   **`--full` with the private census is the PM's** and re-executes all nineteen gates.
7. **`COVERAGE 0/19`, and the S4 child set is three files where S3's was thirteen.** S4 covers no
   original gate and claims none: `coverage.inherited` is the parent's own `byChild` map byte-for-byte
   (empty, as S3 sealed it), so all nineteen re-execute under `--full`, which is the PM's run. The
   `NO-REGISTER OBLIGATION` line is what S4 is measured by instead, and it is met 2 of 2 with 1
   required. This is stated as an OPEN ITEM, not as evidence.
8. **`packages/H3.json` re-pinned onto the moved runner** (review finding 4). Round 1 re-pinned
   `packages/S3.json` and left `H3.json` on `c8668d79...`, so `--ci --package H3` stopped at
   `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` before reading any evidence. Precedent `ccf2137` re-pinned
   `H3.json` when the runner last moved, and S3 itself did; round 2 does the same, one byte range,
   `tooling.runnerSha256` only, declared role `edited` over the parent product pin. Measured at this
   head after the re-pin: `--ci --package H3` prints
   `B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local`
   `diagnostics withheld`, exit 1 — exactly where it stops at the tip, so no coverage is lost and S4
   changes no refusal token.
   `--ci --package S3` failing the same way at a child's head is the established pattern (at the tip
   S3 passes and H3 fails it), not a defect of this package.

## 8. Round 2 — S4-REVIEW-R1, finding by finding

**1. BLOCKING, the doubling re-boot — FIXED, and proved closed.** The reviewer read it exactly right.
`boot()`'s `reopen` re-booted the page, and the re-boot armed a SECOND `watchDayRollover` on the same
`document` while the watcher that fired stayed armed. Both then stood on the new day, so nothing
fired early and one midnight looked correct; at the NEXT midnight both fired and both re-booted, and
the watchers, interval timers, `visibilitychange` listeners and `openTodayHosts` holders doubled every
night a tab was left open. The fix is the small one the reviewer named: the watcher that fires stops
itself before the re-boot arms its successor, so the count is one on every night.

```js
  let rollover = null;
  if (live) {
    rollover = watchDayRollover(doc, { day: today, now: live,
      reopen: () => { rollover.stop(); return boot({ ...options, document: doc }); } });
  }
```

`stop()` is idempotent and already clears the interval and detaches the listener, so nothing else
moved. A re-boot that REJECTS leaves the page with no watcher rather than a stale one, which is the
right way round: the watcher that fired has already adopted the new day and would not have fired
again before the next midnight anyway.

Cell `S4/7` is the one the reviewer asked for — it survives TWO consecutive midnights through the
REAL `reopen`, not a stub. It counts what the page is left holding, at the two places the module
takes them: a `document` whose `addEventListener`/`removeEventListener` are wrapped, and the global
`setInterval`/`clearInterval`, restored in `finally`. Night one: the first watcher fires, its own
`boot()` runs, and the counts are 1 and 1. Night two: the FIRST watcher returns `null` and its
`reopened()` is still the same night-one boot (no second re-boot), the STANDING watcher fires, and
the counts are still 1 and 1; the page is not painted twice. On round 1's bytes the cell is RED at
night one with `actual 2, expected 1`, which is the reviewer's own `old watcher fired ; new watcher
fired` measured as a number. `s4-real-day` is 14/14 and the child needle moves to `# pass 14`.

One thing the fix deliberately does NOT do: it does not close the previous boot's `hosts`. Handle
growth is now linear in nights rather than exponential, and closing a client the successor boot is
about to share is a different, riskier change than the one this review asked for. It is named here
rather than done quietly. **ROUND 3 CLOSES THIS**: review round 2 measured that the un-closed hosts
were not merely growth but the root of a wrong-dated record, and section 9 below does the close.

**2. MAJOR, the truncated LAWS line — FIXED.** Section 5 now quotes every runner line whole,
including `· AUDIT RED-FIRST FAIL` and all THREE `OPEN` lines. The remaining elisions are marked in
the bytes (`<this commit>`, `<argv>`, `<bytes>`) and none is a verdict. The paragraph under the block says
what the reviewer confirmed independently: `AUDIT RED-FIRST FAIL` is pre-existing at the tip, where
`--ci --package S3` prints it and still reaches `PUBLIC CI EVIDENCE PASS`, so it is no regression of
S4's — but a verdict line is quoted whole or not at all.

**3. MAJOR, the unresolvable P0 pointer — FIXED in open item 5.** `65ac9e89` is reported ABSENT, as
it should have been in round 1. The CONCLUSION does not move, and the reviewer's own check is the
reason: `today-entry.mjs:127` `async athleteState()` is a post-mount asynchronous adoption, so P0-B
and P0-C stay exactly as they are.

**4. MINOR, `H3.json` — FIXED, not explained away.** Open item 8, where the measurement is quoted.
The re-pin follows `ccf2137` and S3's own precedent, restores `--ci --package H3` to the tip's
`SEALED-PROFILE-RECOMPUTATION`, and changes no refusal token that is S4's to change. `COVERAGE 0/19`
is now open item 7, stated as an open item and not as evidence.

**5. NOTE — taken.** The `clock.tz` caveat in open item 6 was more conservative than the code and is
corrected against the reviewer's own headless measurement (`01:00 -05:00` and `04:00 -04:00` in one
session on 2026-03-08). Probe (f)'s date half is recorded as VACUOUS, not failed: the built page
renders no calendar date anywhere in its DOM, so there is no visible label to read — the day is
proved through `booted.today`, `model.today` and `hosts.liveDay`, which is what `S4/3` and the
reviewer's headless edge both measure. The ticket's `CHILD_SPECS ['H3','S3']` premise and the four
amended guard cells stand as round 1 reported them, both confirmed by the review.

Nothing else in the package moved. No law, guard or test was weakened; the four lane-C guards are
re-pinned onto the new `today-entry.mjs` and still red on an undeclared move, an unlanded declared
move, and drift in a file no spec names.

## 9. Round 3 — S4-REVIEW-R2, finding by finding

**1. BLOCKING, the previous mount can still paint and write — FIXED, and proved closed.** The
reviewer read it exactly right, and the repro is the code's own shape: `mountToday` binds its Escape
handler to the `#phone` ELEMENT (`today-app.cjs`), `render` only does `phone.replaceChildren(root)`,
so `#phone` outlives every re-boot and that handler with it, guarded by the OLD mount's own `screen`.
Off Today at local midnight, one Escape ran the OLD `render("today")` with the OLD model, the OLD day
and the OLD hosts, and the next tap of the primary button on that repainted screen wrote a weigh-in
stamped with the PREVIOUS `local_date` into the store the new page was using. Two hunks close it, and
nothing else in either file moved:

```js
  // today-app.cjs — named, guarded, and taken off by the one caller that owns the re-boot
  const onPhoneKeydown = (event) => { ... };
  phone.addEventListener("keydown", onPhoneKeydown);
  function render(next, focus = false) { if (disposed) return null; ... }
  dispose() { if (disposed) return false; disposed = true; mountToken += 1;
    if (typeof phone.removeEventListener === "function") phone.removeEventListener("keydown", onPhoneKeydown);
    return true; },
  disposed: () => disposed
```

```js
  // today-entry.mjs — the mount first, then every handle this boot took, then the new day
  const owned = options.hosts ? null : hosts;
  function teardown() {
    try { if (api && typeof api.dispose === "function") api.dispose(); } catch (_) { ... }
    for (const handle of [readings, workout ? workout.gymHost : null,
      checkin ? checkin.host : null, setup ? setup.host : null, owned]) {
      try { if (handle && typeof handle.close === "function") handle.close(); } catch (_) { ... }
    }
  }
  rollover = watchDayRollover(doc, { day: today, now: live,
    reopen: () => { rollover.stop(); teardown(); return boot({ ...options, document: doc }); } });
```

`dispose()` is idempotent, it records nothing, and it is called from exactly ONE place in this
repository: the midnight `reopen`. A caller that DECLARES its day is never given a watcher, so it
never reaches `teardown()` at all, and `options.today` behaviour is byte-identical — the whole of
`today-13` (645/645), `W6` (586/586) and `S4/2` and `S4/6`'s tip-literal differentials say so. The
module owns no timer and no `visibilitychange` listener to remove (the midnight watcher's are
`today-entry.mjs`'s, and `watchDayRollover.stop()` already detaches both); the ONE listener it binds
to the shared element is the one `dispose()` takes off, and `mountToken += 1` stales every deferred
paint the old mount had already handed out, which is the same guard the settings lane uses.

**Which files are declared.** `today-entry.mjs` IS declared in `packages/S4.json` (role `new`,
pre `b50b9231...` at `sourceBase`) and IS pinned on disk by `PAGE_PINS`: its post moves to
`029e096b7c9e7dfc501b05e699c0d83f0f1b1d2eb6b0e20fc17ee0cfb498bebe` in both places, with the re-pin
note re-read against `today-bindings.mjs` as every re-pin must be. `today-app.cjs` was NOT declared:
it is LANE C's and UNPINNED — absent from the parent's 74 pins (measured against
`acceptance-s3-companion.json`'s own product map) and deliberately absent from `PAGE_PINS`, which
says in terms that it is DRIVEN by the journey blocks. It is declared now, because this package edits
it: role `new`, pre `a2e7de0f0e92b8fedc7b2e99c2fae26690ea0c61bc20e067bb61d51c60618683`, post
`1ae7fbc6815588b9136c3f8533a85197765ac6eaca7c0f33127bbdaaa278f112`. No other file this round touches
was undeclared. The runner agrees: `15 at the declared post-image ... 0 unlisted drift`.

**3. MINOR, the un-closed previous boot — FIXED by the same line.** Every handle `boot()` took is
released in `teardown()`: `readings`, `workout.gymHost`, `checkin.host`, `setup.host`, and then the
installation holder, which is `entry.handles -= 1` in `today-bindings.mjs` — the last one out closes
the client and drops the memo, so the page that opens on the new day is a real relaunch off disk
rather than an inheritor of yesterday's. An INJECTED `hosts` is the caller's and is never closed
here (`owned` is null whenever `options.hosts` was supplied), so every fixture, check and suite that
brings its own installation is untouched. `S4/8` measures the release behaviourally: both stale
mounts are asked to weigh in after the second midnight, both record nothing, and the stamped record
does not move.

**2. MINOR, the `--ci --package S3` token — FIXED in section 5.** The report now states it in its own
paragraph and quotes both whole lines: at this head `S3` moves from exit 0 at the tip to exit 1 at
`SEALED-PROFILE-RECOMPUTATION`, alongside `H3`. Round 2 measured only `H3` and said "no token
change"; that was wrong, and the corrected statement is above. It is precedented supersession, and
`rebuild.yml` retires the `S3` step for `--package S4`, so no CI step stands on the changed token.

**4. The reviewer's own probes (section 4 of the review) are accepted as read** and nothing in them
asked for a change. Nothing else in the package moved this round. No law, guard or test was weakened:
`dispose()` adds a refusal, it removes none; `render`'s new first line only ever refuses; the four
lane-C guard cells and the declaring-spec chain stand exactly as rounds 1 and 2 left them; and
`SETUP_BASIS_STATE_REFUSED`, the `hosts` default branch and the declared-day path are byte-unchanged.

## 10. Round 4 — DECISIONS:443, the nine byte-identity gates retired under DECISIONS:444

**What round 4 is, and what it is not.** It is PACKAGE STRUCTURE only. Not one product byte moves:
every file this package declares `edited` or `new` in rounds 1–3 stands at the post-image the r3
review ACCEPTED at `b7dc642`, the brief is unchanged at `5f1ee6f3…`, and the runner is unchanged at
`422d1e9f…`. What moved is the spec's `coverage.superseded` block, the sealed artifact recomputed
from it, six new evidence cells under `rebuild/m4/workout/test/`, and this section.

**The diagnosis, restated in this package's own terms.** Rounds 1–3 read the brief's "S4 changes no
`rebuild/engine` byte" as "every parent carrier is carried", and the spec said so in terms
(`coverage.superseded: null`). The runner's own `--ci` line — *"0 inherited … 19 re-execute under
`--full`"* — was the tell nobody read. The nine NATIVE-CARRIERS gates are not pins; they are
byte-identity RECONSTRUCTIONS of `rebuild/engine` from a frozen `BASE` plus a sha-pinned literal
carrier list, and from the frozen `fe516c1:src/app.jsx` declarations. Four of the files they rebuild
were moved by this package's ANCESTORS — `constants.cjs` and `writers.cjs` by M2-H3-CLEAN-INIT,
`merge.cjs` and `today.cjs` by M2-S3-COMPANION — so no descendant of S3 can carry them whether or not
it moves an engine byte of its own. The S3 reviewer's note 3 at `DECISIONS:422` named exactly this
second-generation effect; `DECISIONS:443` measured it as `migrate-source` refusing first, with the
other eighteen never reached. `DECISIONS:444` is this package's own token line.

**The evidence, in H3's and S3's exact shape, all of it EXECUTED.** Five red-first cells, one per
carrier, plus the named-files differential:

| child | file | verdict |
| --- | --- | --- |
| `s4-sup-source-carriers` | `rebuild/m4/workout/test/s4-supersede-source-carriers.test.cjs` | `# pass 4` |
| `s4-sup-inherited-carriers` | `rebuild/m4/workout/test/s4-supersede-inherited-carriers.test.cjs` | `# pass 3` |
| `s4-sup-defect-witnesses` | `rebuild/m4/workout/test/s4-supersede-defect-witnesses.test.cjs` | `# pass 3` |
| `s4-sup-writers-differential` | `rebuild/m4/workout/test/s4-supersede-writers-differential.test.cjs` | `# pass 3` |
| `s4-sup-second-gate` | `rebuild/m4/workout/test/s4-supersede-second-gate.test.cjs` | `# pass 3` |
| `engine-files-differential` | `rebuild/m4/workout/test/s4-engine-files-differential.cjs` | the whole line below |

The RED-FIRST half is not a description of a wall; it is the wall, run. `S4/SUP-2` calls the
carrier's own `native-carriers-source.cjs verify()` and it throws
`Exact product construction: rebuild/engine/today.cjs`; the cell then enumerates all four diverged
files and asserts each stands at the PARENT's own post. `S4/SUP-3` spawns the ORIGINAL gate
programme `rebuild/engine/test/migrate-source.cjs`, asserts a non-zero exit and
`exact declaration migrate` on stderr, and then asserts that `migrate.cjs` itself is byte-identical
to both the parent post and the frozen `BASE` blob — the refusal is inherited, not caused here.
`S4/SUP-5` re-executes `priorModule`'s own rule over the six carried engine modules: four still ARE
the declared carriers, `today.cjs` (nine declared carriers, the count the carrier pins in
`CARRIED_VISITS`) and `writers.cjs` are not. `S4/SUP-11` measures both distances for `writers.cjs` —
it is neither the reconstruction's pre-image nor its post-image.

The half that STANDS IN THEIR PLACE is, for a package that moves no engine byte, the identity itself
— and identity is worthless unless the instrument can fail, so every such cell carries its own
mutation control. `S4/SUP-9` and `S4/SUP-15` compose the ACCEPTED engine from GIT at this package's
own `sourceBase` (each of the sixteen modules asserted to be the parent artifact's declared post
BEFORE it is compiled, never read from disk) and the engine ON DISK, and compare the whole projection
— seventeen census readers, seven `genSession` days, seven membership reads, `mergeState` of the
record with a diverged copy — byte for byte, 0 moved. `S4/SUP-10` removes one export
(`sessionMembership`) and the projection detects exactly it; `S4/SUP-16` shows a comment-only change
moving nothing and a one-line `pickStructural` change being caught; `S4/SUP-12` runs the writers
differential in all 3 Date/trap modes against the Git-side engine and `S4/SUP-13` shows one removed
writer detected in all three. `S4/SUP-7` proves the two INHERITED capabilities are not just present
as bytes but reached: `sessionMembership` names the seed's own pool, and the `nativeDate` seam is
reached at the routed parse sites.

**The engine-files differential is the stronger sentence, because S4 can afford it.** S3's version
compared the REMAINDER and named two moved files; S4's compares the remainder AND the eighteen it
names, and there is no moved half at all:

```
ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 18 named and NOT ONE moves, so all 45 tracked rebuild/engine file(s) stand byte-identical to the parent's own post;
```

The runner computes the 27 itself (`supersessionEngineIdentity`) and holds this needle to the count
IT measured, so neither side can drift alone.

**The citation.** `coverage.superseded.rulingLineSha256` is
`a1d96976ed87da290b890f2e715c2c3bc872e97a186dc87386f0ffc15a1a1693`, the sha256 of the exact bytes of
`DECISIONS:444` as the runner computes it, unique on `refs/remotes/origin/rebuild/t2-client-core`.
Evidence per carrier: `laws` null (this package registers no D-id), `redFirst` its own cell,
`census` the runner's own live-triggered line (which says `none`), `legacyDifferential`
`a0-journeys`, `writersDifferential` `today-13`, `engineFilesDifferential`
`engine-files-differential`. Each carrier's red-first cell is its own and no other carrier's, which
is what `GATE-SUPERSESSION-EVIDENCE-IS-NOT-THIS-CARRIER-OWN` asks.

### 10.1 `--ci --package S4` at the round-4 head, the lines that moved, whole

```
B PACKAGE S4 SUPERSESSIONS 5 byte-identity carrier(s) of S3 SUPERSEDED over 9 gate(s) under DECISIONS:444, located on refs/remotes/origin/rebuild/t2-client-core BY ITS OWN SHA256 a1d96976ed87; these gates reconstruct rebuild/engine byte-for-byte from a frozen BASE and assert every path the parent spec declares at the parent's own post, so no child that changes a declared file can carry them — the child's own evidence stands in their place and every named child ran green in THIS run
B PACKAGE S4 COVERAGE 0/19 original gate(s) covered by 0 executed child(ren) (0 inherited, the parent map byte-for-byte; 0 moved, each naming its own original executable in a relative require specifier and each proved by that gate’s own needle out of R.GATES in the child’s stdout); 9 SUPERSEDED under DECISIONS:444 (defect-witnesses 1, inherited-carriers 3, second-gate 1, source-carriers 3, writers-differential 1), counted toward the 19 only under that ruling; 10 re-execute under --full
B PACKAGE S4 SUPERSEDED source-carriers <- merge-source migrate-source writers-source; retired by S3's own seal and retired AGAIN here under this package's own token line, not inherited; DECISIONS:153 (the standing role) and the token clause DECISIONS:444 (RULED) for M2-S4-REAL-DAY, located by its own sha256 a1d96976ed87...: it RECONSTRUCTS rebuild/engine from a frozen BASE plus the 48 literal carriers of native-carriers-changes.json, whose bytes are pinned by CHANGES_SHA at native-carriers-source.cjs:37, and the three original programmes rebuild migrate.cjs from the frozen fe516c1:src/app.jsx declarations; this package changes NO engine byte, yet four files the reconstruction rebuilds (constants.cjs and writers.cjs from M2-H3-CLEAN-INIT, merge.cjs and today.cjs from M2-S3-COMPANION) already stand outside it, so the gates refuse on this tree and no package that moves nothing can mend them - executed and measured in s4-supersede-source-carriers
B PACKAGE S4 SUPERSEDED EVIDENCE source-carriers; laws UNMOVED; red-first s4-sup-source-carriers; public census the runner's own census line, which says none; legacy differential a0-journeys; writers differential today-13; engine-files differential engine-files-differential over 27 tracked rebuild/engine/ file(s) outside this package's own product, each re-compared here against the parent post; 4 named child(ren) executed green in this run
B PACKAGE S4 SUPERSEDED inherited-carriers <- migrate-differential witnesses-2 witnesses-5; retired by S3's own seal and retired AGAIN here under this package's own token line, not inherited; DECISIONS:153 (the standing role) and the token clause DECISIONS:444 (RULED) for M2-S4-REAL-DAY, located by its own sha256 a1d96976ed87...: priorModule re-reads every prior engine module against the same sha-pinned carrier list (native-carriers-source-carriers.cjs) and pins the visit order and the per-module carrier counts, so today.cjs (nine declared carriers) and writers.cjs are refused there for the same reason as source-carriers, at the parent's own post which this package carries unmoved
B PACKAGE S4 SUPERSEDED EVIDENCE inherited-carriers; laws UNMOVED; red-first s4-sup-inherited-carriers; public census the runner's own census line, which says none; legacy differential a0-journeys; writers differential today-13; engine-files differential engine-files-differential over 27 tracked rebuild/engine/ file(s) outside this package's own product, each re-compared here against the parent post; 4 named child(ren) executed green in this run
B PACKAGE S4 SUPERSEDED defect-witnesses <- witnesses-7; retired by S3's own seal and retired AGAIN here under this package's own token line, not inherited; DECISIONS:153 (the standing role) and the token clause DECISIONS:444 (RULED) for M2-S4-REAL-DAY, located by its own sha256 a1d96976ed87...: the FROZEN side of every one of its ten complete comparisons is built through native-carriers-parent-source.cjs into the same pinned reconstruction, so no witness can be produced on both sides once an inherited engine byte stands outside it; S4 closes no register defect and moves no engine byte, and the complete comparison it owes is measured instead against the accepted engine read from Git
B PACKAGE S4 SUPERSEDED EVIDENCE defect-witnesses; laws UNMOVED; red-first s4-sup-defect-witnesses; public census the runner's own census line, which says none; legacy differential a0-journeys; writers differential today-13; engine-files differential engine-files-differential over 27 tracked rebuild/engine/ file(s) outside this package's own product, each re-compared here against the parent post; 4 named child(ren) executed green in this run
B PACKAGE S4 SUPERSEDED writers-differential <- writers-differential; retired by S3's own seal and retired AGAIN here under this package's own token line, not inherited; DECISIONS:153 (the standing role) and the token clause DECISIONS:444 (RULED) for M2-S4-REAL-DAY, located by its own sha256 a1d96976ed87...: the gate is the differential over rebuild/engine/writers.cjs reached through the same reconstruction, and writers.cjs on this tree is neither that reconstruction's declared pre-image nor its declared post-image - it was moved by M2-H3-CLEAN-INIT and is carried here byte-identical to the parent's post, asserted at S4/SUP-11
B PACKAGE S4 SUPERSEDED EVIDENCE writers-differential; laws UNMOVED; red-first s4-sup-writers-differential; public census the runner's own census line, which says none; legacy differential a0-journeys; writers differential today-13; engine-files differential engine-files-differential over 27 tracked rebuild/engine/ file(s) outside this package's own product, each re-compared here against the parent post; 4 named child(ren) executed green in this run
B PACKAGE S4 SUPERSEDED second-gate <- second-gate; retired by S3's own seal and retired AGAIN here under this package's own token line, not inherited; DECISIONS:153 (the standing role) and the token clause DECISIONS:444 (RULED) for M2-S4-REAL-DAY, located by its own sha256 a1d96976ed87...: the independent second reading is taken over the reconstructed engine and pins the frozen source commit fe516c1 with a static inventory, so it refuses this tree before it compares anything; the second reading S4 puts in its place is taken from Git at this package's own sourceBase against the disk composition
B PACKAGE S4 SUPERSEDED EVIDENCE second-gate; laws UNMOVED; red-first s4-sup-second-gate; public census the runner's own census line, which says none; legacy differential a0-journeys; writers differential today-13; engine-files differential engine-files-differential over 27 tracked rebuild/engine/ file(s) outside this package's own product, each re-compared here against the parent post; 4 named child(ren) executed green in this run
B PACKAGE S4 NO-REGISTER OBLIGATION S4 registers no D-id, so the 45-law accounting imposes nothing on it; in its place 8 of 8 declared child(ren) executing one of this package's own role:"new" product file(s) ran in this process, exit 0, with their exact declared needle at line start — 1 required at the seal (9 child(ren) declared in total: s4-real-day -> rebuild/m3/w6/host/test/local-real-day.test.mjs; today-13 -> rebuild/m3/w7-preview/today/test/food.test.mjs rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs rebuild/m3/w7-preview/today/test/problem.test.mjs; s4-sup-source-carriers -> rebuild/m4/workout/test/s4-supersede-source-carriers.test.cjs; s4-sup-inherited-carriers -> rebuild/m4/workout/test/s4-supersede-inherited-carriers.test.cjs; s4-sup-defect-witnesses -> rebuild/m4/workout/test/s4-supersede-defect-witnesses.test.cjs; s4-sup-writers-differential -> rebuild/m4/workout/test/s4-supersede-writers-differential.test.cjs; s4-sup-second-gate -> rebuild/m4/workout/test/s4-supersede-second-gate.test.cjs; engine-files-differential -> rebuild/m4/workout/test/s4-engine-files-differential.cjs)
B PACKAGE S4 OPEN closed cumulative profile not sealed
B PACKAGE S4 PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time
```

Exit 0. The SPEC line now ends *"5 byte-identity carrier(s) declared SUPERSEDED under a PM line
recorded by sha256 a1d96976ed87, each with its own named and executed evidence"*, and the PRODUCT
line reads *"21 at the declared post-image / 0 at the pinned pre-image / 68 carried byte-identical
from the parent / 0 declared role "pinned-unchanged" … / 0 unlisted drift"* — the six new cells are
the only additions to the 15 posts round 3 sealed.

### 10.2 Suites at the round-4 head

| suite | result |
| --- | --- |
| today 13 by name | `ℹ tests 645 · ℹ pass 645 · ℹ fail 0` exit 0 |
| A0 (journey + engine-equivalence) + S4 cells (local-real-day + the five supersession cells) | `ℹ tests 54 · ℹ pass 54 · ℹ fail 0` exit 0 |
| `s4-engine-files-differential.cjs` (bare) | the whole line quoted in 10.1, exit 0 |
| W6 `rebuild/m3/w6 --test "test/*.test.mjs"` | `ℹ tests 586 · ℹ pass 585 · ℹ fail 1` exit 1 — see 10.3 |
| lane-B tooling `rebuild/lanes/b/tooling/test/*.test.cjs` | `ℹ tests 90 · ℹ pass 89 · ℹ fail 1` exit 1 — see 10.3 |
| `rebuild/t2/rig187.cjs` | `rig187 ⇒ PASS` exit 0 |

### 10.3 Two failures that round 4 did NOT cause, named rather than rounded off

**(a) lane-B tooling 89/90 — PRE-EXISTING SINCE `b7dc642`, and it is this package's own doing in an
earlier round.** `pinned-unchanged-and-ruled-substitutions.test.cjs:267 F6` pins the expected `IDS`
order and reads `['B-NTC','H3','S3','B1','B2','B4','B3','B-LOM']`; S4's own runner edit (round 1,
reviewed and ACCEPTED at r3) inserted `'S4'` after `'S3'`, which is what lets `--package S4` run at
all. The fix is one literal in that test file. It is NOT applied here, on purpose: round 4 is
structure only, the file is not in this package's `product` map, and it lives under the lane-B
tooling fixed inventory that `FIDELITY` audits — editing it undeclared would turn a one-literal
repair into unlisted drift. It belongs in the same declared hunk as the runner edit, and the PM
should route it as a one-line follow-up (or accept it into this package's product with the review).

**(b) W6 585/586 — ENVIRONMENTAL, the private oracle being PRESENT on this machine.**
`test/local-source-consumer.test.mjs:198 P2-W1` expects `4. ORACLE PASS frozen 7/7 unfrozen 7/7`;
on this PC the port oracle runs at `scope FULL` and reports `frozen 10/10 unfrozen 10/10` because
the private live blob is on disk. The step still says `PASS`; only the arity the test's regular
expression pins differs. Nothing was opened, quoted or hashed here beyond the runner's own counts.
This is a cloud-vs-PC condition of the P2 harness, not an S4 file: no file in this package's product
is on that path, and the suite is 586/586 where the private blob is absent.

### 10.4 What a reviewer should re-take first

1. `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S4` — expect the `SUPERSESSIONS`,
   five `SUPERSEDED` / `SUPERSEDED EVIDENCE` pairs, `COVERAGE … 9 SUPERSEDED … 10 re-execute`, and
   `PUBLIC CI EVIDENCE PASS`, exit 0.
2. Delete `DECISIONS:444` from the chain branch and re-run: the run must refuse
   `GATE-SUPERSESSION-RULING-LINE-SHA256-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH`, because the runner
   re-reads the chain file on every call and never caches the recorded sha.
3. Point any one carrier's `redFirst` at another carrier's cell: expect
   `GATE-SUPERSESSION-EVIDENCE-IS-NOT-THIS-CARRIER-OWN`. Point `engineFilesDifferential` at
   `a0-journeys`: expect `GATE-SUPERSESSION-EVIDENCE-DIFFERENTIALS-ARE-THE-SAME-CHILD`. Change the
   `27` in the differential needle: expect
   `GATE-SUPERSESSION-ENGINE-DIFFERENTIAL-NEEDLE-DOES-NOT-STATE-THE-COUNT`.
4. `git diff b7dc642 -- <every product path with role edited or new>` — expect empty. The product is
   the reviewed product; round 4 added evidence and a citation, nothing else.
