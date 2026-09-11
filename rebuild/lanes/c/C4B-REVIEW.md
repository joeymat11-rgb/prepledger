# C4b — ONE STORE, APPLIED: INDEPENDENT REVIEW

## VERDICT: **REJECT**

Executed at `8ba0ff4` (base `da63053`, C4 drop-in `04c8cc9`), worktree
`work/lane-c/review-today`, Windows, Node v24.19.0, Edge 152.0.4191.66 and
Chrome (for the two checks that hardcode `chrome.exe`).

The swap is real, the scoping fix is real, and **every count in the report's §8
reproduces exactly** — 59 gym, 64 today, 542 W6, 41 journey, 22 host, 19
w7-preview, 542/542 in the harness, `--bite` still bites, native-carriers CI
PASS, build PASS, 5/5 in the new Edge runner. Every sha256 in §1 matches.
Nothing under `host/`, `client/`, `engine/`, `m4/`, `conform/`, `.github` is
touched. No identity, lease, evidence or key minting is left under `today/**`.

I reject on the PM's own stated condition, not on style.

**The condition the PM named is violated.** A2's REJECT round: *"a Start that a
later read could never order stranded the store."* Conducting A2's two-day
journey **through the product entry point, in a real browser, against the BUILT
page**, day 2's `start()` returns `{ok:true}`, writes `session-start`
`op-device-…-5`, and the very next `read()` refuses it as
`WORKOUT_HISTORY_RECONCILIATION_REQUIRED` stamped `day: "2030-02-04"` — **day
one** — with `sets: 0`. No set can be logged. `gymHost.startOrderRefusal()` then
returns, verbatim:

```
WORKOUT_START_ORDER_UNPROVEN — this session would not descend from 1 session(s)
already recorded on this device, and the accepted order resolver cannot order it
```

That is the stranded Start, in the page's own words, left on disk. (D1 below.)

**And `gym-check.mjs` — the file this branch edited and did not run — is RED.**
`A2 GYM BROWSER CHECK FAIL — a refused day writes nothing: 9` (expected 8). The
swap falsified two op-count assertions the report does not list, while §4 states
*"No other line in either file changed."* (D2 below.)

---

## WHAT I EXECUTED

| what | result | claimed |
|---|---|---|
| `git diff --stat da63053 HEAD` | 22 files, +3527/−568 | — |
| `git diff --stat 04c8cc9 HEAD` | 17 files (16 + the report), +1487/−1036 | 16 |
| forbidden paths (`host/ client/ engine/ m4/ conform/ .github`) | **none touched** | none |
| `git grep -E 'IDENTITY_KEY\|ENROLMENT_EVIDENCE\|AUTHORITY_KID\|mintLease\|initialGeneration\|signRecord\|openDeviceKeys\|generateKey\|not-a-credential\|LEASE_DOMAIN' -- today/` | only `package.test.cjs` assertions + one `today-model.cjs` comment | clean |
| `node --test today/test/gym.test.mjs` | **59/59** exit 0 | 59 |
| `node --test today/test/{design.cjs,adapter,view,package}` | **64/64** exit 0 | 64 |
| `node --test test/*.test.mjs` in `w6` | **542/542** exit 0 | 542 |
| `local-today-journey.test.mjs` | **41/41** exit 0 | 41 |
| `w6/host/test/{journey.test.mjs,engine-equivalence.test.cjs}` | **22/22** exit 0 | 22 |
| `w7-preview/test/{model,view,package}.test.cjs` | **19/19** exit 0 | 19 |
| `run-current-head.cjs <R1> --all` | **542/542** exit 0 | 542 |
| `run-current-head.cjs <R1> --bite` | exit 1, 2 failures of 14 | 12/14 |
| `m4/spec/native-carriers-package.cjs --ci` | PASS, exit 0 | PASS |
| `w7-preview/today/build.mjs` | PASS — 3 assets, 89 pinned inputs | PASS |
| `w6/test/local-today-browser.mjs` (Edge) | **5/5** exit 0, 7 msedge killed | 5/5 |
| `today/browser-check.mjs` (**Chrome**) | **PASS** exit 0 — its 3 corrected db lines ran | not run |
| `today/gym-check.mjs` (**Chrome**) | **FAIL** — `a refused day writes nothing: 9` | not run |
| `today/gym-check.mjs` (Edge, as briefed) | **FAIL** at the first kill, before the db lines | not run |
| harness R1-drift simulation (1 byte, in a COPY) | fails **by name**, both hashes | — |

Every sha256 in report §1 was recomputed and **matches**. `GymHost.causalTips ===
causalTips` holds by construction (a re-export, one definition in the tree) and
the journey's identity assertion is green.

---

## PARTIAL-ERASURE RESULTS

Real Edge, fresh persistent profile per case under `$env:TEMP`, against the
BUILT page (`$TEMP/c4b-rev/erase-probe.mjs`). **This half is excellent and does
exactly what the report claims — it is the property the synthetic hosts lacked.**

```
1 FIRST RUN + REOPEN: athlete=owner device=device-6b6f87e17fd19b469fcaaca9119e6b3a
  era=57b5b7fc… keyRecords=["active","device"] dbs=[earned-today-local,
  -keys, -local] localStorage=[] ignored=[] -> reopen: SAME era, SAME device, no re-enrol
ERASE only the keys db   -> "Restore required — sign in (KEY_MISSING)"
ERASE only the generations db -> "Restore required — sign in (STORE_MISSING)"
ERASE only the marker db -> "Restore required — sign in (ENROLLMENT_MARKER_MISSING)"
   all three: opened=false, RE-ENROLLED=false, era NOT replaced, morning="not
   logged yet", localStorage=[]
KILL after a weigh-in : 8 msedge.exe taskkill /F /T -> ops 1 -> 1, ONE lease
KILL after a set      : 8 msedge.exe taskkill /F /T -> ops 3 -> 3, ONE lease,
                        "2 exercises · Workout in progress"
```

## TWO-DAY JOURNEY RESULTS — **the reject**

Real Edge, BUILT page, day 1 weigh-in + Start + set through the shipped UI, then
day 2 through `boot({today: DAY+1, basisState: fresh})` — exactly how
`gym-check.mjs` conducts it, with the module-load boot's installation still held
(the shipped page never releases it).

```
day2 recover(abandoned day-1 session) -> ok, op-…-4 (session-close); summary -> "ready"
day2 start()  -> { ok: true, opId: "op-…-5" }          <- WRITTEN
day2 read()   -> phase "unfinished", WORKOUT_HISTORY_RECONCILIATION_REQUIRED,
                 unfinished { startId: "op-…-5", day: "2030-02-04", sets: 0 }
day2 first set-> NOT REACHED
startOrderRefusal() -> WORKOUT_START_ORDER_UNPROVEN
ops on disk: [fact, session-start, session-set, session-close, session-start]
pageerrors: []
```

Isolated A/B at Node level through the same `today-entry.mjs`
(`$TEMP/c4b-rev/ab-probe.mjs`), the ONLY difference being whether day 1's
installation holder was released:

```
X closed-first  | sameInstallation=false | start ok | read active | first set OK
Y shipped (open)| sameInstallation=true  | start ok | read unfinished(day-1) | NOT REACHED
```

---

## RACE RESULTS — 60 concurrent reading‖set pairs

`$TEMP/c4b-rev/race-probe.mjs`, one local era, both write paths, no waiting.

```
pairs 60 | weighOk 60 | setOk 0 | setRefused { WORKOUT_RESUME_STALE: 60 }
ops 61 | checkpoint 61 | device seq 61 | leases 1 | readings 60 | sets 0
no two operations share a device_seq; checkpoint == actual; classes [reading, session]
after each pair: ops == before + (weigh?1:0) + (set?1:0)  — asserted, held 60/60
```

**No lost update. Checkpoint is the truth. One lease across both paths.** But the
refusal is not occasional — under contention the workout write loses **100% of
the time**, and the code is `WORKOUT_RESUME_STALE`, which the report's residual 1
does not name (it names only `WORKOUT_PREPARATION_STALE`). The unraced retry
lands (`$TEMP/c4b-rev/clock-probe.mjs`, block A: `UNRACED RETRY: true`), and the
shipped screen cannot reach the race, so this is a residual — but it is a
*second* named refusal and it is 100%, not "a case a one-store page must know
exists".

## THE INSTALLATION CLOCK (brief item 4) — honest, but it papers over D1

The decision *"the page's own day, not the wall clock"* is **correct and
necessary**, and I proved the counterfactual rather than taking it on trust
(`$TEMP/c4b-rev/wallclock-probe.mjs`):

```
pageday  : start ok -> read phase=active  -> SAME-DAY reopen: active, unfinished=null
wallclock: start ok -> read phase=unfinished WORKOUT_HISTORY_RECONCILIATION_REQUIRED
           unfinished { day: "2026-09-11" }  -> CANNOT LOG A SET AT ALL
```

So `clientClockFor(day)` is not cosmetic and §3 is honest about it.

**But the report stops one question short.** The real invariant it discovered is
*the operation's recorded day must equal the day the host stands on*. The swap
does not enforce that invariant — it only satisfies it for the first caller of
the page load. `openTodayInstallation` memoizes per `(indexedDB, databaseName,
namespace)` and **silently drops every later caller's `clock`/`day`**. That is
D1. It is the same bug as the wall-clock counterfactual, reached a different way,
and the report presents the fix for one half as if it closed both.

---

## DEFECTS

### D1 — REJECT. A later boot's day is silently dropped; day 2 strands a Start

**Where.** `rebuild/m3/w6/local/today-bindings.mjs`, `openTodayInstallation`
(the C4b memo). The memo key is `JSON.stringify([databaseName, namespace])` under
a WeakMap on `indexedDB`. On a hit it returns the existing era and **never looks
at `clock`, `deviceId`, `athleteId` or anything else the caller asked for**.
`gym-host.mjs openTodayHosts({ …, day })` builds `clientClockFor(day)` and hands
it over; after the first open in a page load it has no effect. Meanwhile
`buildEra.createGymHost` still gives `composeWorkoutHost` the caller's real day
(`clock: { today: () => day }`). Two clocks for one notion of "today", and the
accepted resume policy compares them.

This is the one hole in a module that otherwise refuses mismatches by name —
`reconcile()` throws `LOCAL_ERA_STORE_MISMATCH` / `_CRYPTO_` / `_DATABASE_` /
`_NAMESPACE_MISMATCH` and *records* an ignored `deviceKeys`. `clock`/`day` is
neither reconciled nor recorded. `ignored()` returns `[]` and the page believes
it was honoured.

**Why it is reachable.** `today-entry.mjs:143` auto-boots at module load with no
`today`, so the installation is pinned to `SYNTHETIC_DAY` and **its holder is
never closed**. Every later `boot({ today })` in that page load — which is how
A2's own `gym-check.mjs` conducts day 2, and how the PM's condition says the
two-day journey must be conducted — gets day one's clock.

**Repro (browser, built page, ~40s):**
```
set W6_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
node %TEMP%\c4b-rev\twoday-probe.mjs
```
→ `start ok op-…-5`; next `read` = `unfinished { startId: op-…-5, day: <day 1> }`;
`startOrderRefusal()` = `WORKOUT_START_ORDER_UNPROVEN`; set NOT REACHED.

**Repro (Node, isolated A/B, ~5s):** `node %TEMP%\c4b-rev\ab-probe.mjs`.

**Fix direction (pick one, executably):** reconcile the clock like every other
option — throw `LOCAL_ERA_CLOCK_MISMATCH` when a later caller asks for a
different day; or give each host its own write clock off its own `day` instead of
the installation's; or have `boot()` release its holder. Do **not** key the memo
on the day: that reopens the two-clients-one-repository split the memo exists to
prevent.

### D2 — BLOCKING. `gym-check.mjs` is RED, and §4's disclosure is wrong

```
set W7_BROWSER_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
node rebuild/m3/w7-preview/today/gym-check.mjs
→ A2 GYM BROWSER CHECK FAIL — a refused day writes nothing: 9   (9 !== 8)
```

`gym-check.mjs:310` asserts the workout repository holds **8** operations after
day 1. Day 1 also logs a weigh-in (`gym-check.mjs:162`). Before the swap that
reading lived in `earned-today-preview-readings`; **under ONE STORE it is in the
same generation**, so the count is 9. The same is true of `gym-check.mjs:378`
(`bothDays.ops === 14`, "day 1's eight plus day 2's six") — that becomes 16 with
two mornings, and the run never reaches it.

The report §4 says of these two files: *"each asserted that the page's three old
databases exist… The swap falsified those five lines… **No other line in either
file changed.**"* The swap falsified more than five lines, and the claim that
only the database names needed correcting is false. It was not caught because the
file was never executed (residual 10 discloses the non-execution honestly — but
the §4 claim is stated as fact, not as inference).

`browser-check.mjs` I ran to green (Chrome): its three corrected assertions are
sound.

### D3 — `gym-check.mjs` / `browser-check.mjs` cannot run on the briefed browser

Both hardcode `Name='chrome.exe'` in `chromeProcessesForProfile()`
(`gym-check.mjs:93`, `browser-check.mjs:~262`). With the environment's declared
`W7_BROWSER_BIN` (msedge.exe) `gym-check` does not report NOT RUN — it **fails**
at the first `hardKill`, `"no chrome process was found for this profile — the
kill would prove nothing"`, at line 229, *before* the corrected database
assertions at 389. So on this machine as briefed, the five corrected lines cannot
execute at all. C4b's own new runner `local-today-browser.mjs` solved exactly
this (`const processName = path.basename(executablePath)`); the fix was not
carried into the two files this branch edited.

### D4 — minor, disclosure. `WORKOUT_RESUME_STALE` is not in the residuals

60/60 concurrent pairs refused the set by that name (see RACE RESULTS). Residual
1 names only `WORKOUT_PREPARATION_STALE`. Both should be named, with the 100%
figure, or the residual understates what a one-store page must know.

### D5 — minor. A restore-required open still writes to the key database

`openLocalDeviceIdentity` runs *before* the era is opened and **creates
`<db>-keys`, mints `device-<32hex>` and persists it** even when the installation
is about to be refused. After erasing only the keys database, the database is
back on disk with a fresh device id while the page correctly says
`RESTORE_REQUIRED (KEY_MISSING)`. No re-enrolment occurs and no harm was
observed, but a page that refuses to open an installation should not be seeding a
new identity into it. Name it, or mint lazily after `status()` says first-run.

---

## WHERE I DISAGREE WITH THE REPORT

1. **§4, the two browser checks — "No other line in either file changed."** True
   of the diff, false of what the swap required. Two op-count assertions are now
   wrong and one of them is what turns the file red. (D2)
2. **§3, "ONE INSTALLATION PER PAGE" is presented as the thing that makes the
   swap safe.** It is also what makes it unsafe across a day boundary: the memo
   honours the first caller's clock and records nothing about the ones it
   ignored, in a module whose stated discipline is *"a MISMATCH is refused by
   name; a caller-minted `deviceKeys` is ignored and RECORDED, never quietly
   honoured."* The clock is quietly honoured. (D1)
3. **§9 residual 1** understates the stale-write surface — one code named, two
   exist, and the second refuses 100% of contended writes. (D4)
4. **§9 residual 10** is honest that the two checks were not run, but the report
   elsewhere states their correction as complete. Given D2 and D3, "not run" here
   was not a low-cost omission — it hid a red file.

**Where the report is better than it claims.** The partial-erasure property, the
restore-required copy, the device identity, the reference-counted installation,
the harness scoping fix and the R1 double-pin all do exactly what §3 and §7 say,
verified by execution and by simulated drift. The retired D2 helper-source pin is
genuinely stronger as an identity. The `today-model.cjs` deletion of
`SYNTHETIC_IDENTITY_KEY` and the `package.test.cjs` inversion are the right
direction and the tightened non-extractable regex is a real repair.

## RESIDUALS CONFIRMED

| # | status |
|---|---|
| 1 `WORKOUT_PREPARATION_STALE` | confirmed open; **incomplete** — see D4 |
| 2 §5 second hunk not applied (`today-app.cjs:311`) | confirmed, out of scope, honest |
| 3 lapsed era refuses the whole page | confirmed by reading; not reachable in test |
| 4 `device: null`, custody in `local-keys.mjs` | confirmed; journey asserts it |
| 5 no iPhone / iOS Safari | confirmed; runner says so in its own output |
| 6 `previewClock` pins the preview to one day | confirmed; **this is what hides D1 on the shipped preview** |
| 7 `r1` pins name a MOVING branch | confirmed by simulated drift: fails BY NAME with both hashes. **Acceptable, as a CONDITION**: it is declared, it fails loudly, and it is re-pinned deliberately. Pinning R1 at the archived `base` would be better and can wait |
| 8 harness copies `engine` + `w7-preview` | confirmed; `--bite` still bites (2 of 14) |
| 9 synthetic data only | confirmed — `ledger/` and `conform/private` untouched; my probes are synthetic |
| 10 `gym-check` / `browser-check` not executed | confirmed, and **executing them found D2 and D3** |

---

## WHAT WOULD TURN THIS INTO AN ACCEPT

Specific and executable. Nothing else is asked.

1. **Close D1.** Make the installation refuse or honour a later caller's day —
   do not drop it. Add the executed evidence: the two-day journey through
   `boot()` in ONE page load, with the first holder still open, must reach a
   logged set on day 2 and leave **no** Start for which
   `startOrderRefusal()` is non-null. `%TEMP%\c4b-rev\twoday-probe.mjs` and
   `ab-probe.mjs` are the repros; either may be adopted as a case.
2. **Close D2.** Correct `gym-check.mjs:310` and `:378` for the one store
   (9 and 16, or assert workout-class operations only — state which and why),
   and list every changed line in the report's §4.
3. **Close D3.** Derive `processName` from `W7_BROWSER_BIN` in both checks, as
   `local-today-browser.mjs` already does, so the briefed browser either runs
   them or says NOT RUN.
4. **Run them.** `gym-check.mjs` and `browser-check.mjs` green, with the output
   line quoted in the report. `browser-check.mjs` is already green (Chrome).
5. **Name D4 and D5** in §9, with the 60/60 figure.

Residual 7 (the moving R1 pin) I accept as-is: declared, loud, deliberate.

## FILES REVIEWED (sha256, recomputed)

```
4b9a0c218b1c333f9c3c49f418a3a14d9ad31458a00aa19732026fff84571595  today/today-entry.mjs
01b3c813eff92c52af6b91a478fbfb0f4ffe1b4360f9ca86e3eaa743624c6232  today/gym-host.mjs
a3e9201587f97446f90856f3235cf99da8d487d1be127416be1e5086d17be6aa  today/reading-host.mjs
ef051efa8ae2b2e905aa76bc04c156c21e36c55ba219e634c7c0be85eb77be42  today/today-model.cjs
b630ca55ccf3dc43429a38d166725fd220b4e2003484059f81ebe989f668992a  today/gym-check.mjs
6b119f99c67c2d3bca96ae6de87fd383e3174069e9d0f9b62bb55c6b9f8113d4  today/browser-check.mjs
9656c1f54246cb5580aa10626866c884998fc2ccf52068ede6426da06370210e  today/test/adapter.test.mjs
43aa7d60f095ed00df79a5dd9b65fcc7dfdf597d715fbe265f68308b843bb954  today/test/view.test.mjs
678f5e2991aa662cf6a1bf72db999ebac9ee827bc1e4f619f3b43b4bcbd557f3  today/test/gym.test.mjs
8cab604c7968dd80b0ca78ff52409e6ff4fbcaa1687e9cf6a12667444b38525e  today/test/package.test.cjs
24810e35a1b30b222cc837240204436022d8c0c86e8cf667e052fb430108c026  w6/local/today-bindings.mjs
12faa80781baff1c79b791ca5aff4f05f94639719aeeb59750963ee2a5c71c62  w6/local/local-keys.mjs
c318ac4f0d2f72f06e2592bae9725225ccc53a71a62edbc7328ac1f1834011ec  w6/test/local-today-journey.test.mjs
9d24f6e580586dbaf42408f07a398346fa695d8ecd497845ed1ee44281b5a06f  w6/test/local-today-browser.mjs
133b41887493245c4923ac13e2801e78c82fb942b609fbc78c37ffdd94d7c74f  w6/test/run-current-head.cjs
d50df57edf9ef39752d5e7f895df4e00d1a0f316bfad63ff0765a4637497da2f  w6/test/shared-edit-source-pins.json
6e91b53df45db8824387df90aea22311b5dff065ebe546e7ac14a6a0ee0f385e  lanes/c/C4B-REPORT.md
```

All sixteen candidate shas match report §1 exactly. Nothing in the worktree was
modified by this review; every probe lives under `%TEMP%\c4b-rev\`, every browser
profile under `%TEMP%`, every kill scoped to a profile directory there. No
candidate file was edited, nothing was committed or pushed, nothing installed.

---
---

# ROUND 2 — re-verification at `ecdcc29`

Head `ecdcc29` (`0de34e3` the code, `ecdcc29` the checks + report revision 2),
on top of round 1's `8ba0ff4`. `git diff --stat 8ba0ff4..HEAD` = 9 files,
+749/−114; still **nothing** under `rebuild/host`, `client`, `engine`, `m4`,
`conform` or `.github`. Worktree clean apart from this file.

I re-ran every round-1 probe unchanged and added four new ones. All five defects
are closed by execution, not by reading.

## COUNTS — all reproduce

| | |
|---|---|
| A2 gym | **59/59** exit 0 |
| A1 today (design+adapter+view+package) | **64/64** exit 0 |
| W6 suite | **550/550** exit 0 (was 542; +8) |
| C4 journey | **49/49** exit 0 (was 41; +8) |
| A0 host | **22/22** exit 0 |
| w7-preview | **19/19** exit 0 |
| `run-current-head.cjs <R1> --all` | **550/550** exit 0 |
| `run-current-head.cjs <R1> --bite` | exit 1, 2 of 14 — still bites |
| `native-carriers-package.cjs --ci` | PASS exit 0 |
| `today/build.mjs` | PASS — 3 assets, 89 pinned inputs |
| Edge runner `local-today-browser.mjs` | **6/6** exit 0, 8 msedge killed |
| `today/browser-check.mjs` **W7_BROWSER_BIN=msedge** | **PASS** exit 0 |
| `today/gym-check.mjs` **W7_BROWSER_BIN=msedge** | **PASS** exit 0 |

## D1 — CLOSED. The two-day journey, re-run unchanged

`%TEMP%\c4b-rev\twoday2-probe.mjs` — real Edge, BUILT page, **module-load holder
open, as shipped**, day+0 abandoned → recovered → day+1 Start → every set →
Finish:

```
clockAdoptions  [{from 2030-02-04, to 2030-02-05, adopted true}]   liveDay 2030-02-05
summary          unfinished { startId op-…-2, day 2030-02-04, sets 1 }
recover          ok  op-…-4
start            ok  op-…-5
read after start phase "active"                      <- was "unfinished" at 8ba0ff4
sets             ["ok","ok","ok","ok"]
finish           ok  op-…-10        afterFinish phase "finished"
orderRefusalAfterDay2  null      orderRefusalFromDay3  null
starts           both have 1 causal parent; orphans 0
ops 10  checkpoint 10  leases 1  ignored []  localStorage []  dbs = the era's three
pageerrors []
```

`%TEMP%\c4b-rev\ab-probe.mjs`, the round-1 isolation, now reads:

```
X closed-first   | sameInstallation=false | start ok | read active | first set OK
Y shipped (open) | sameInstallation=true  | start ok | read active | first set OK
```

Y is byte-identical to X. **The stranded Start is gone.**

The new design does what it says. `createGymHost` binds one day to all three
clocks (`hostBindings({clock: clientClockFor(day)})`, `composeWorkoutHost`'s
`{today: () => day}`, `engineClockFor(day)`); `createReadingHost` takes its own
the same way; the installation's clock is a live provider whose day a later
caller ADOPTS, recorded on `clockAdoptions()` and readable on `liveDay()`; and a
second clock handed to a host is refused by name — I probed **both** factories:

```
createGymHost     with a clock -> LOCAL_ERA_CLOCK_MISMATCH / 3
createReadingHost with a clock -> LOCAL_ERA_CLOCK_MISMATCH / 3
declaredClock installation, later caller declares a day
                  -> adopted:false + why, recorded, not silently honoured
```

## §9.11 (`hostForDay`) — probed, and the residual is bounded

`%TEMP%\c4b-rev\r2-911-probe.mjs`. The report claims the shipped page never takes
the wrapper path. **Executed, and true:**

```
A shipped path  era.createGymHost({day: DAY-1})
   liveDay 2030-02-04 -> 2030-02-04 | adoptions [] | weighIn ok, stamped 2030-02-04
B wrapper path  GymHost.createGymHost({day: DAY-1}) beside an open installation
   liveDay 2030-02-04 -> 2030-02-03 | adoptions [{…adopted true}]
   weighIn in that window: ok=false  (REFUSED, not misstamped)
   afterwards: day2 start ok, read active, orderRefusal null  -> NOTHING STRANDED
```

So the residual cannot strand, and on the shipped path it does not fire at all.
Two wording corrections for §9.11, both non-blocking: the weigh-in in that window
is **refused**, not "stamped the older day" (better than claimed); and the live
day is **not restored when the transient host closes** — it stayed 2030-02-03
after `close()`, so "for as long as that transient host is open" understates it.

## D2 — CLOSED, and the three re-derived numbers are honest

`gym-check.mjs` PASS with msedge. The numbers are not just corrected, they are
decomposed, which is stronger than what was there before:

* `workoutOps === 8` **and** `readingOps === 1` **and** `ops === 9` — each class
  counted separately by `op.class`, so a future change says which half moved.
* `workoutOps === 14`, `readingOps === 2`, `ops === 16`, plus `leases === 1`.
* `orphanStarts` 1 → **0**, replaced by two direct claims: `startDays` deep-equals
  `[DAY_ONE, DAY_TWO]` (each Start stamped on its own day — the D1 invariant,
  asserted in the product check) and `startParents` by kind deep-equals
  `[["fact"], ["fact","session-close","tombstone"]]`, with a separate assertion
  that day 2's Start includes `session-close`. That is a stronger statement than
  the orphan count it replaces, and it explains *why* the number moved: under one
  store the first Start descends from that morning's reading.

The pass line quotes it: *"16 operations in ONE sealed generation under ONE lease
— 14 workout and both mornings; each Start stamped on its own day; … so NO Start
is unordered."*

Nit: the `ops === 9` message still reads *"a refused day writes nothing"* while
the comment above it says the claim is made against a count taken before the
refused day. It is still a literal. Harmless, pre-existing shape — but the
comment overstates what the line does.

## D3 — CLOSED

`PROCESS_NAME = path.basename(executablePath)` in both checks, in the CIM filter,
in the "no … process was found" message and in both pass lines. Both ran green on
the briefed `W7_BROWSER_BIN=msedge.exe`; `browser-check` reports *"taskkill /F /T
on 8 msedge.exe"*. No profile outside `%TEMP%` was ever matched.

## D4 — CLOSED as a disclosure

Re-measured, unchanged: **60 pairs, 60 weigh-ins acknowledged, 0 sets,
`{WORKOUT_RESUME_STALE: 60}`; 61 ops, checkpoint 61, device seq 61, ONE lease, no
shared `device_seq`, and `ops == before + (weigh?1:0) + (set?1:0)` on every
pair — no lost update.** §9.1 now names `WORKOUT_RESUME_STALE`, says the refusal
rate is 100%, and carries the one-line PM request (`gym-app.mjs` should retry a
set once on `WORKOUT_RESUME_STALE`). That is the honest disposition.

## D5 — CLOSED by my own probe

Round 1, erasing only the keys database left it **recreated** with a freshly
minted id. At `ecdcc29`, same probe, same three erasures:

```
ERASE only the keys db -> "Restore required — sign in (KEY_MISSING)"
   dbs = ["earned-today-local","earned-today-local-local"]   <- NO -keys database
ERASE only the generations db -> "… (STORE_MISSING)"
ERASE only the marker db      -> "… (ENROLLMENT_MARKER_MISSING)"
   all three: opened=false, RE-ENROLLED=false, era not replaced, localStorage []
FIRST RUN + REOPEN: athlete owner, device-<32hex>, keyRecords ["active","device"],
   reopen = same era, same device, no re-enrol
KILL after a weigh-in / after a set: 8 msedge.exe each, ops 1->1 and 3->3, ONE lease
```

No key database is created and no id is minted on a refused open.

## NITS (non-blocking, none reachable from the shipped page)

1. **A second caller passing only `clock` (no `day`) is still silently dropped.**
   `openTodayInstallation` reconciles `day` but skips the `else if` when `day` is
   undefined, so an explicit disagreeing clock provider leaves
   `clockAdoptions() == []` and `ignored() == []`:
   `1 clock-only second caller: liveDay=2030-02-04 adoptions=[] ignored=[] (asked
   for 2030-02-05)`. The page never passes `clock`; harness code does. Record it
   on `ignored()` for the same reason `deviceKeys` is recorded.
2. **`liveDay()` can misreport when the installation was opened with an explicit
   clock provider** — it returns `state.day` (seeded from the wall clock) rather
   than the declared clock's day: observed `liveDay=2026-09-11` for an
   installation stamping `2030-02-04`. Observability only.
3. §9.11's two wording corrections, above.
4. The `ops === 9` message/comment mismatch, above.

## FILES REVIEWED IN ROUND 2 (sha256, recomputed at `ecdcc29`)

```
7802094aa3bdc5bf5a197ec2909df772d8b03370b29f30c2a3a82f76958d2f23  w6/local/today-bindings.mjs
bc2ee6a41899b85af24f2bb691b2dd826dc3c9e2fbb185e7820c22464eb0ec39  w6/local/host-bindings.mjs
53082451e91e4055b8586d017f96d585394eacb6987351513d1fa420c972c94d  w6/local/local-keys.mjs
c6a66b7dfc765c066beab2399d9b4dc138fc8b326134537c519612c55e239c2b  w6/test/local-today-journey.test.mjs
7d23847e709a32938312c99724838c72448f75c4ada9b8fe7554ee840f1f26f2  w6/test/local-today-browser.mjs
70a59b5c328f3b029790ed49b957dd2b78eada1b9bdff9606de5ae17a4f01c18  today/gym-host.mjs
5025e60205be01b0ce5fc7b21bc20440cd564d74d7110ec601291514e4b203a8  today/gym-check.mjs
4085786ea6fd58a2366b1a971859722e317c779fd4a9122112dc80f4ea8e2ad7  today/browser-check.mjs
8a8a03144fffc43a944b3fab93966af3c6db521c11dffa41cb8d49ab3585a4f3  lanes/c/C4B-REPORT.md
```

`today-entry.mjs`, `reading-host.mjs`, `today-model.cjs` and the four `today/test`
files are **unchanged** since round 1 and still carry the shas verified there.

Nothing in the worktree was modified by this review; every probe lives under
`%TEMP%\c4b-rev\`, every browser profile under `%TEMP%`, every `taskkill` scoped
to a profile directory there. No candidate file edited, nothing committed or
pushed, nothing installed. Synthetic data only.

## ROUND 2 DISPOSITION

D1 closed — the stranded Start is gone, proved in the browser on the built page
with the shipped holder open, and the invariant it violated is now asserted
inside a product check (`startDays`, `startParents`), not only in a lane test.
D2 closed — both PC checks green on the briefed browser, with re-derived numbers
that are decomposed rather than re-guessed. D3 closed. D4 closed as a disclosure,
with the figure I measured and a concrete PM request. D5 closed, re-proved by my
own probe rather than by the builder's test.

Four nits remain. None is reachable from the shipped page, all four are
observability or wording, and none of them can strand, lose or misstamp anything
the athlete does. They are follow-ups, not conditions.

**FINAL VERDICT: ACCEPT at ecdcc29**

---
---

# ROUND 3 (C4c) — the third lane folded in, re-pinned onto `e73e28f`

Head `a403990` (`e381c44` the fold, `71494b3` the journey/Edge/checks,
`a403990` the report). Base = the integration tip `e73e28f` (A3 merged).
Worktree clean apart from this file.

## 1. SCOPE — clean

`git diff --stat e73e28f HEAD` = 27 files, +5462/−775. **Nothing** under
`rebuild/host`, `rebuild/client`, `rebuild/engine`, `rebuild/m4`,
`rebuild/conform` or `.github` — verified by path filter, not by eye. Nothing
under `rebuild/DECISIONS.md`, `REQUESTS.md` or `STATUS.md` relative to the base.
Everything touched is a licensed today file, a today test or PC check, `w6/local`,
`w6/test`, the pins json, or a lane report.

**`gym-host.mjs` is byte-untouched in C4c** — `git diff --name-only ecdcc29 HEAD`
returns nothing for it, and its sha256 `70a59b5c328f…` is the same value I
verified in round 2. `reading-host.mjs` and `today-model.cjs` likewise.

`checkin-check.mjs` is the one out-of-licence edit: **3 functional lines** (a
`PROCESS_NAME` const, the CIM filter, the assertion message) plus a disclosed
comment. That is the D3 fix, nothing else, and the diff confirms it.

**One thing the PM should know, outside my brief.** `origin/rebuild/t2-client-core`
has moved past this candidate's base: it now carries REQUESTS 11:55 ET · PM → C,
routing lane B's G7/O10 (`previousLine()` still reads the legacy `{w,reps}` shape,
so "Last time" is absent on the active set) into this same re-pin *"and keep it in
the same re-review"*. This candidate predates that line. `gym-model.mjs:142
previousLine` is untouched here and `gym-model.mjs`/`gym-app.mjs` are not in the
C4c diff at all, so **G7/O10 is unmet**. Not a defect in what I was asked to
review; a scope note for whoever merges.

## 2. COUNTS — every one reproduces

| | claimed | measured |
|---|---|---|
| A1 today (design+adapter+view+package) | 64 | **64/64** exit 0 |
| A2 gym | 60 | **60/60** exit 0 |
| A3 check-in | 28 | **28/28** exit 0 |
| W6 suite | 552 | **552/552** exit 0 |
| C4 journey | 51 | **51/51** exit 0 |
| A0 host | 22 | **22/22** exit 0 |
| w7-preview | 19 | **19/19** exit 0 |
| `run-current-head.cjs <R1> --all` | 552/552 | **552/552** exit 0 |
| `--bite` | still bites | exit 1, 2 of 14 |
| `native-carriers-package.cjs --ci` | PASS | **PASS** exit 0 |
| `today/build.mjs` | PASS | **PASS** — 3 assets, 93 pinned inputs, 68 bound classes |
| Edge `local-today-browser.mjs` | 6/6 | **6/6** exit 0 |
| `browser-check.mjs` msedge | PASS | **PASS** exit 0 |
| `checkin-check.mjs` msedge | PASS | **PASS** exit 0 |
| `gym-check.mjs` msedge | PASS | **PASS** exit 0 |

All four PC checks ran on `W7_BROWSER_BIN=msedge.exe`, every kill scoped to a
`%TEMP%` profile directory. The Edge runner's pass line now carries the C4c
claim: *"a recovery check-in between the sessions and one on the same day as a
Start, in the SAME generation, causing neither"*. `gym-check`'s says *"the workout
order is KIND-AWARE (C4c), so day 1's Start opens it and day 2's descends from day
1's close and the Undo's tombstone, and every causal parent of a Start is a
workout operation."*

## 3. ATTACK — the fold

`%TEMP%\c4b-rev\r3-fold-probe.mjs`, `r3-tomb-probe.mjs`, `r3-history-probe.mjs`,
`r3-hist2-probe.mjs`. Sequences the suites do not run.

**3.1 The check-in really does ride the era's lease, and the schema gate is not
bypassed — it is satisfied.**

```
checkin op: schema_version=2  class=event  kind=fact  lease_id=SAME AS GENERATION
reading op: schema_version=1  class=reading
era lease schema=2 (= LOCAL_ERA_SCHEMA_VERSION)   leases=1  checkpoint=2  ops=2
the check-in lane's own public client asked to write a READING -> OPERATION_SCHEMA_MISMATCH
```

That last line is the honest part, and I went looking for it because the report's
argument only works if it holds: the check-in is admitted **because it is genuinely
schema 2**, not because the gate was loosened. The very same public client still
refuses a schema-1 reading — which is exactly why the weigh-in keeps going through
C1's bridge instead. Two write paths and one lease, for a stated reason.

**3.2 Lane isolation — all three directions, including the one the tests don't
assert.**

```
weigh + Start + set + check-in in ONE generation (4 ops):
  checkin.all() = 1 row     a host on a FOREIGN profile sees 0 rows
  readings.reads() = 1      session ops = 2
interleaved: check-in, weigh, check-in, Start, check-in after EVERY set, finish
  ops 13 = {event 6, reading 1, session 6}  checkpoint 13  leases 1
  readWorkoutHistory() -> read true, 1 session
  checkin rows 6, reading rows 1, Start parent classes [[]], orderRefusal null
CONTROL, same session with and without interleaved check-ins:
  logged 4 / 4   finish true / true   session records 5 / 5   capture_issues 0 / 0
  -> the projected workout history is IDENTICAL
```

I ran that control because "the lanes do not disturb each other" is easy to assert
and hard to prove: a check-in between every set could have silently changed what
the history projector reconstructs. It does not — byte-for-byte the same shape.

**3.3 Can a check-in ever order a workout? No — three sequences, none of them in
the suites.**

```
checkin, Start, checkin, set, checkin, finish -> all ok
   starts=1  parentClasses=[[]]  EVENT AS A PARENT: false
   causalTips = ["session/session-close"]   startOrderRefusal = null   ops 9 = checkpoint
checkin, checkin, Start, set -> all ok
   parentClasses=[[]]  EVENT AS A PARENT: false
   causalTips = ["session/session-start","session/session-set"]  refusal null
weigh, checkin, Start, set, finish -> all ok
   parentClasses=[[]]  EVENT AS A PARENT: false  refusal null
```

Every one asserts `EVENT AS A PARENT === false` and `startOrderRefusal === null`
inside the probe, so these are checks, not printouts. The `[[]]` is the deliberate
C4c change: day 1's Start no longer descends from that morning's reading, so it is
an orphan again — consistent with `gym-check`'s re-derived claim and with the new
`gym.test.mjs` subtest.

**3.4 The load-bearing measurement behind the allowlist.** The comment claims an
Undo's tombstone is class `session` — "measured, not assumed". I measured it
through the product's own Undo:

```
undo ok=true | tombstones = ["tombstone/session"]
causalTips = ["session-start/session","tombstone/session"]
```

True. The removal edit stays a workout tip, which is what keeps the round-2
`gym-check` claim (day 2 descends from day 1's close **and** the Undo's tombstone)
honest under a class filter.

**3.5 Concurrent check-in ‖ set, 60 pairs.**

```
pairs 60  checkinOk 60  setOk 0
checkinRefused {}   setRefused { WORKOUT_RESUME_STALE: 60 }
ops 61 = checkpoint 61,  leases 1,  no two ops share a device_seq
ops == before + (checkin?1:0) + (set?1:0) asserted on EVERY pair — held 60/60
checkin rows read back: 60
```

**No lost update with a third writer.** The refusal is the same
`WORKOUT_RESUME_STALE` the weigh-in produces (report §9.1, review D4) — the
check-in now joins the weigh-in as a lane that wins that race 100% of the time.
The residual is already disclosed with the 60/60 figure and a PM request; **it
should name the check-in as the second lane that can trigger it**, because a
check-in taken from inside the active set (which A3 ships) is closer to the
athlete's hand than a weigh-in is. That is a wording ask, not a defect: nothing
is lost, the refusal is by name, and the shipped card re-prepares.

**3.6 One clock covers the check-in host.**

```
era.createCheckInHost({ …, clock }) -> LOCAL_ERA_CLOCK_MISMATCH / 3
```

Same refusal as `createGymHost` and `createReadingHost`. The page wrapper
`checkin-host.mjs createCheckInHost` opens the same installation: `ci.repository
=== rd.repository` is true, `db = earned-today-local`, `ns = earned-today/device-A`,
`device = null`, custody `local-keys.mjs`, athlete `owner`, `device-<32hex>`.

## 4. THE A3 TEST EDITS — honest, and MUTANT 5 is not weakened

Four disclosed edits to `checkin.test.mjs`, and they are the four in the diff.
The one that matters is MUTANT 5. A3 proved lane separation by **storage**: three
databases, "no store holds another store's operation", plus a constants check that
the three names differ. Under one store that form is unavailable and would be a
lie if kept. What replaced it:

* `kit.host.repository === readings.repository === gymHost.repository` — one
  handle, executed rather than asserted from names;
* the one generation holds exactly `['fact/event/<profile>', 'fact/reading']`;
* **each lane READS only its own** — `kit.host.all()` dates, `readings.reads()`
  lbs, and `await gymHost.causalTipsNow()` deep-equal `[]`;
* neither producer accepts the other's command, and the refusal stores nothing —
  now compared against a `before` snapshot instead of a bare `[]`, which is
  strictly better in a shared generation;
* one database, one namespace, one `lease_id`.

**Does it still catch what it caught?** A lane reading another lane's rows: yes,
and better — the old assertions only inspected what was on disk per store, which
is meaningless once there is one store; the new ones exercise the read paths. A
shared frontier: yes — `causalTipsNow() === []` here, plus the new `gym.test.mjs`
F2 subtest which carries a real **negative control**
(`startOrderRefusalOf(shared, ['k1'])` → `WORKOUT_START_ORDER_UNPROVEN`) and a
wellness-only generation case. That subtest is the +1 that takes gym from 59 to
60. The `class: 'session'` added to the gym fixtures makes them match what the
product actually writes — I verified that independently (3.4) — and every
assertion around them is unchanged.

Nothing was weakened. One cosmetic nit: in MUTANT 5,
`gymHost.repository.databaseName || kit.host.databaseName` makes the third element
of that `Set` a tautology if `repository.databaseName` is undefined — harmless,
because the `===` identity two lines above already settles it.

## 5. THE ROUND-2 NITS — all four closed

| nit | closed by | I verified |
|---|---|---|
| 1. a second caller passing only `clock` was silently dropped | `openTodayInstallation` now records it | `adoptions=[{from 2030-02-04, to null, adopted:false, why:"a second caller handed over its own clock provider; this installation already has one"}]` — was `[]` |
| 2. `liveDay()` misreported under a declared clock provider | `dayNow()` asks the clock it is really using | declared-clock installation now reports `liveDay=2030-02-04`, the day it stamps — was the wall-clock seed `2026-09-11` |
| 3. §9.11's two wording corrections | §9 item 11 rewritten | the report now says the live day is **not** restored on close and a weigh-in in that window is **REFUSED**, both as I measured them |
| 4. `ops === 9` message vs comment | rewritten, and **better than I asked** | the claim is now made directly — `dayTwoOps === 0`, *"A REFUSED DAY WRITES NOTHING: no operation in the generation is stamped <DAY_TWO>"* — and the literal 9 carries an honest message about day one's composition |

Nit 4's fix is the kind I like: I pointed at a comment that overstated an
assertion, and rather than soften the comment they made the assertion say the
thing.

## 6. WHERE I DISAGREE / RESIDUALS

1. **The allowlist has no completeness guard.** `WORKOUT_ORDER_CLASS = 'session'`
   is right (an allowlist, per C1b F1), and the journey asserts the forward
   direction — *every causal parent of a Start belongs to the workout order*
   (`local-today-journey.test.mjs:987`). Nothing asserts the **converse**: that
   every op the workout lane writes carries `class === 'session'`. If a future
   workout kind arrived with another class it would drop out of the frontier
   silently — the same silent-drop shape as D1, one level down. I measured today's
   answer (start/set/close/tombstone are all `session`), so this is a guard to add,
   not a live fault. **Recommended, not required:** one assertion that the classes
   of the ops a full session writes are a subset of `{WORKOUT_ORDER_CLASS}`.
2. **D4's residual now has two trigger lanes.** §9.1 should name the check-in
   beside the weigh-in, with my 60/60 figure for the check-in‖set pair. A check-in
   is reachable from inside the active set, which the weigh-in is not.
3. **G7/O10 is unmet** — see §1. The candidate is one tip behind the PM line that
   routed it here.
4. The MUTANT 5 `|| kit.host.databaseName` tautology (§4).

None of these can lose, misstamp or strand anything the athlete does. They are
follow-ups.

## 7. FILES REVIEWED IN ROUND 3 (sha256, recomputed at `a403990`)

```
f1bb8bbb1c03ab2f7eaf1187f1fe19c453e73bc6c3b1aec7fd7c33886c97a4ff  w6/local/today-bindings.mjs
7e5ccb4cbe3de9addaa6efd4b5e227c0d07914d69fa6e1a75e664d6abb296b5e  w6/test/local-today-journey.test.mjs
1cf1aa35cc3f39b8e3b2d1f446d2ed6e80ddbb3f1439403fe42d765d86e9f6d1  w6/test/local-today-browser.mjs
029b3a9b711cf4f9ef7ba8d33452d87b262d9c1ee34b005009134a8a81ec660b  w7-preview/today/checkin-host.mjs
fd0b3b59ee0cde2d426a257d0ab5a51a0ba026d3b7339fb75a65df8fc0aa9dc5  w7-preview/today/checkin-check.mjs
5fc40e1e6a4fe2768b4fa943d3e55b6f4037575d4e20627300d1147609ba8ab8  w7-preview/today/today-entry.mjs
70a59b5c328f3b029790ed49b957dd2b78eada1b9bdff9606de5ae17a4f01c18  w7-preview/today/gym-host.mjs   <- unchanged since ecdcc29
30816caca2d69a788777b78f6a8dae53f496190fc70adec092e88293251c41db  w7-preview/today/gym-check.mjs
5b157274a13948f719a9c76cfda17fda03f06ae1010b4769cd5e1acca45bb5f1  w7-preview/today/browser-check.mjs
1b0cce2307ae9d30daa538abd802914069ba636fdffd408adeea6df961934be6  w7-preview/today/test/checkin.test.mjs
7ee49c4019dea8d60ed7c476959f1ac38b54dfca7f929eb3b09cd84e24f41f92  w7-preview/today/test/gym.test.mjs
b217868e43cd62186e204354fe9b3f9f34ab7513996a33d43c266802be695dbd  lanes/c/C4B-REPORT.md
```

Nothing in the worktree was modified by this review; every probe under
`%TEMP%\c4b-rev\`, every browser profile under `%TEMP%`, every `taskkill` scoped
to one. No candidate file edited, nothing committed or pushed, nothing installed.
Synthetic data only — the athlete is `w7-preview/fixtures.cjs`; `ledger/` and
`rebuild/conform/private` were not read.

## ROUND 3 DISPOSITION

The fold is real and the argument for it is checkable: the check-in op is schema 2
under the generation's own schema-2 lease, admitted by a gate that still refuses a
schema-1 reading on the same path. The three lanes share one generation, one
checkpoint, one lease, and each still reads only its own rows — proved in both
directions, plus a control showing the workout projection is byte-identical with
and without check-ins interleaved through a whole session. The class-scoped
frontier holds under every sequence I could construct, including the two the
suites do not run, and its load-bearing assumption (the Undo tombstone's class) is
measured, not assumed. A3's four test edits are disclosed and MUTANT 5 is restated
into the property that survives the fold rather than dropped. All four round-2
nits are closed, one of them better than asked. Four follow-ups remain, none of
them able to lose, misstamp or strand anything.

**FINAL VERDICT: ACCEPT at a403990**
