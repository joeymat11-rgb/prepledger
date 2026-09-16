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
