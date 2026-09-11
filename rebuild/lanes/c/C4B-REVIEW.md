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
