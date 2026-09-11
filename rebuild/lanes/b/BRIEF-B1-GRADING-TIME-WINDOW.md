# EARNED — B1 GRADING & TIME WINDOW — behaviour/delta brief — PROPOSED, NOT ACCEPTED

Package **B1** (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:70–81`). Lane B builder output; research only — nothing in the repo was modified, committed or pushed by preparing it.
**Base tree:** `origin/rebuild/t2-client-core` @ `ffabbcac0d9802fcb8b74334f9dfa49366295f74` (`ffabbca`). Every line number and sha256 below was read on that tree.
**D-ids in package order:** D10 → D8 → D21 → D19 → D16 → D17 → D24 → D25 → D27 → D23 (10 defects, 20 register hours). **Modules:** `rebuild/engine/dates.cjs`, `sleep.cjs`, `policy.cjs`, `today.cjs`, plus three frozen-defect witness files (§3).

## 0. NATIVE-CARRIERS dependency and authority

`DECISIONS.md:93` accepted the NATIVE-CARRIERS theme and records that it rewrites `sleep.cjs 2dde4a08…→3dd34e11…` and `today.cjs af4c65d2…→397532ec…` — two of B1's four modules. It is theme-accepted and **unmerged**. I fetched `origin/rebuild/fix-b0-native-carriers` and hashed B1's files there; it confirms the ledger exactly:

| file | sha256 @ ffabbca | sha256 @ fix-b0-native-carriers |
|---|---|---|
| `rebuild/engine/dates.cjs` | `19e9ce7e0a4b2dc770a41b2a8a722f57ad767c36b2edfe967cf866b88be3dff6` | unchanged |
| `rebuild/engine/policy.cjs` | `a1d21404ec52de9f7726071d60e05c0911590a417d11bf8f9076241762a3768d` | unchanged |
| `rebuild/engine/sleep.cjs` | `2dde4a082ba72d61f0c1cfa3c98fa8c9038d639ce5349078023874ae29cc0407` | `3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0` |
| `rebuild/engine/today.cjs` | `af4c65d2998c2fd588d6251a220262db5395e7ca5410ad36fe314826a04cbe0d` | `397532ecf20a4f5a9e1bd4a7d8d312cf5fd52058427603a7726ba512107bdbb3` |
| `rebuild/engine/test/defect-witnesses.cjs` | `557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644` | unchanged |
| `rebuild/engine/test/defect-witnesses-2.cjs` | `833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2` | unchanged |
| `rebuild/engine/test/defect-witnesses-3.cjs` | `f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6` | unchanged |

**B1 implementation rebases onto NATIVE-CARRIERS after it merges, and every pre-image sha256 in §2 is re-pinned then.** Measured line drift on that branch: `cleanAtDate` 1014→1017; `sleepInfo`'s `tomorrow` 1885→1901; `pickStructural`'s hack gate 54→56; `e.id === "hack"` pendingThird 87→92; `dayOpen` 196→201; `yOpen` 202→207; protein block 238–244→243–249; `longCut` 300→305; the `genSession(s, d9)` call 567→572. `dates.cjs`/`policy.cjs` coordinates are stable. This is why `DECISIONS:93` C3 cites `today.cjs:92` where the plan cites `:87` — the ledger used the carriers tree, the plan used `ffabbca`; both are right, and every coordinate must name its tree. NATIVE-CARRIERS also grows `today.cjs`'s late-bound delegate block from 43 to 45 entries; B1 adds two more (§2 D23, D27) → 47.

**Authority.** `DECISIONS.md:60` — owner M2-RULE, 45/45 APPROVED-FIX; B1's four Batch-B rules (D8, D10, D16, D25) are quoted verbatim in §2, the other six are Batch-A plain FIX approvals. That line also states what it does not do: "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance". `DECISIONS.md:88` — speed plan, "batch the 39 remaining approved defect fixes"; "two-tier rigor (engine full gate; screens/plumbing one reviewer + CI)". `DECISIONS.md:94` — LANES ruling: the reviewer chat is LANE B lead, "B2 ∥ B1 → B4 → B3; FULL engine gate unchanged; the PM's own FULL run is the acceptance". `DECISIONS.md:82` (SET-ONE-ERA) is the precedent for the two conditions in §5.

**Red-first status, executed.** All ten laws were run against the candidate engine (`rebuild/engine/*.cjs` @ ffabbca) through `rebuild/conform/v4/helpers.cjs`'s `bundle('candidate')` and `run-defect-laws.cjs`'s `execute`/`control`/`mutants`. For all ten: **raw = RED, repair control = GREEN, every named mutant = RED.** The frozen half could not run here: `helpers.cjs:15` does `git show fe516c1:src/app.jsx` and asserts blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`; this is a shallow clone where `fe516c1` is absent (`fatal: invalid object name 'fe516c1'`). No private fixture was needed or opened; `rebuild/conform/private/` does not exist on this tree and must not.

## 1. Package order and the ordering hypothesis (objection)

The plan's rationale (`:72`) is that "`dates.cjs/weeksBetween` (D10) is the day-arithmetic primitive D16 depends on by ruling". **The ruling half is right; the concrete half is wrong.** `policy.cjs:482` never calls `weeksBetween` — it computes `isoOf(new Date(mk(f.d).getTime() + GRADE_LAG * DAY))`. Repairing `weeksBetween` does nothing for it. The real shared need is a **calendar-day shift primitive that does not exist**: `dates.cjs:25` exports only `{ DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween }`, and no `setDate`-based helper exists anywhere in `rebuild/engine/*.cjs`. Four B1 sites hand-roll the same broken step — `sleep.cjs:1885` `+ DAY` (D21), `policy.cjs:482` `+ GRADE_LAG * DAY` (D16), `policy.cjs:563,573` `fmtShort(brkS.end)` where the next date is meant (D19), `today.cjs:201` `- DAY` (D24's neighbourhood). Measured in `TZ=America/New_York`: `+DAY` from local midnight on `2026-11-01` returns `2026-11-01` (the fall-back day never advances) and `-DAY` on `2026-03-09` returns `2026-03-07` (a date is skipped). **So D10's slot should add one declaration to `dates.cjs` — `plusDays(iso, n)` on `Date.prototype.setDate` — alongside the `weeksBetween` repair, and D21/D16/D19 consume it.** D10 still goes first, for a better reason than the plan gives.

Interactions inside B1, as verified: **D10 → D16** by ruling ("the day arithmetic follows D10") and by shared primitive; **D10 → D21, D19** by primitive only (neither law reads `weeksBetween`); **D8 → D21** through `cleanAtDate`, which `sleep.cjs:1887` calls and D8 changes (a D8×D21 cross-case is required, not an argument); **D16 ∥ D17** — same function `trackRecord` (`policy.cjs:473–499`), disjoint hunks (`:479,482–483` vs `:495`), neither law reads the other's cell; **D24 → D27** because `theOneFix` reads `nowFocus(s).owed` at `today.cjs:276` and returns rung `logging` whenever anything is owed, so D24 can mask D27 entirely — order as the plan does and pin a cross-case; **D25 ∥ D24** (different declarations; `theOneFix` reads `L.steps`, not `L.protein`); **D23 last**, as the plan says and for its stated reason — and it is the only B1 hunk that changes an error path, since the mechanism is a thrown `TypeError` swallowed by `today.cjs:574`'s bare `catch (e) {}`.

**Second ordering objection.** D10's repair changes behaviour in files B1 does not own, via `weeksBetween`'s other call sites: `energy.cjs:84,228`, `sleep.cjs:630,803`, `migrate.cjs:301,1203`, `writers.cjs:1560,2405`. The four `< 1` weekly-window sites flip a real boundary: measured, `weeksBetween('2026-03-02','2026-03-09') = 0.994047619047619 < 1`, so the Monday **eight** calendar days into the spring-forward week is currently counted inside the week keyed `2026-03-02`; after the repair it is exactly `1` and excluded. `migrate.cjs`/`writers.cjs` are B3's. B1 edits no byte of them but must enumerate those sites as delta cells (§2 D10), and B3's golden budget must anticipate them rather than discover them.

## 2. Per defect

Coordinates are on `ffabbca`. Every quoted hunk is verbatim from the tree. "Executed" lines are outputs I produced on the candidate engine.

### D10 — seven calendar days across a clock change ≠ a week

**Plain** (`AUDIT-REGISTER.md:109`): "The app counts seven calendar days across a clock change as slightly less or more than a week; whether a week means calendar days or elapsed hours is the owner's call." Register 107–115; BAR `:111` "none: cosmetic / internal / performance"; LIVE `:112` NOT TRIGGERED; FIX `:114`.
**Current code** — `dates.cjs:23`, file sha256 `19e9ce7e…`. `mk` (`:8`) builds a *local* midnight, so the subtraction is local elapsed milliseconds:
```js
// Copied from frozen src/app.jsx @ fe516c1:311-311.
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;
```
**Owner semantics (`DECISIONS.md:60`, verbatim):** "D10 APPROVED-FIX — date-only week counts mean 7 CALENDAR days, not 168 elapsed hours."
**Proposed behaviour.** `weeksBetween` counts calendar-date ordinals: seven distinct calendar dates apart is exactly `1` in either direction on every date including both New York transitions, and fractional weeks stay exact sevenths of a whole number of calendar days. The same hunk adds `plusDays(iso, n)`, consumed by D21/D19/D16 below. No threshold, rounding-precision or reused export name changes.
**Proposed hunk** (`dates.cjs:23,25`). `Math.round` on the day count is the engine's own DST-safe idiom, already at `policy.cjs:503` and `sleep.cjs:1022` — not a new convention:
```js
// before
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;
return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween };
// after
const plusDays = (iso, n) => { const d = mk(iso); d.setDate(d.getDate() + n); return isoOf(d); };
const weeksBetween = (aISO, bISO) => Math.round((mk(bISO) - mk(aISO)) / DAY) / 7;
return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween, plusDays };
```
**Law** `E-D10-calendar-week-is-seven-calendar-dates` (`laws-clock-and-as-of.cjs:49`): *"Seven calendar dates apart is exactly one week in either direction across either New York daylight-saving transition."* Assertion `:50` `spring === 1 && fall === 1 && reverse === -1`. **RED today (executed):** `spring = 0.994047619047619`, `fall = 1.005952380952381`, `reverse = -0.994047619047619`; control GREEN; mutant `calendar-week-count-divides-local-elapsed-hours` RED.
**Delta cells.** `weeksBetween('2026-03-08','2026-03-15')` `0.994047619047619`→`1`; `('2026-11-01','2026-11-08')` `1.005952380952381`→`1`; `('2026-03-15','2026-03-08')` `-0.994047619047619`→`-1`; `writers.cjs:1560,2405` and `migrate.cjs:301,1203`'s `weeksBetween(monday, r.d) < 1` for `monday='2026-03-02'`, `r.d='2026-03-09'`: `true`→`false`; `energy.cjs:84,228` and `sleep.cjs:630,803` rate/fit denominators on DST-crossing intervals: ±0.6 %→exact.
**Must NOT change.** Any interval with no transition inside it — executed: `'2026-09-03'→'2026-09-10'` is `1` both sides, `'2026-09-03'→'2026-09-06'` is `0.42857142857142855` both sides, because `Math.round(3) === 3`. Equal arguments (`0`). `mk`, `isoOf`, `todayStart`, `daysUntil`, `fmtShort` byte-identical; no new clock read.
**Source mutants.** (1) `round-the-week-not-the-days` — `Math.round((mk(b)-mk(a))/DAY/7)`, killed by the `09-03→09-06` control. (2) `utc-stamp-substitution` — the law's own control shape `(Date.UTC(..)-Date.UTC(..))/604800000` in product: passes the law while reinterpreting every stored local date; killed by an alias trace showing a UTC constructor. (3) `plusdays-adds-milliseconds`, killed by `plusDays('2026-11-01',1) === '2026-11-02'`.
**Negative controls.** No-transition intervals of 0, 1, 3, 7, 14, 365 days; one reversed; the full export set apart from the single added name.

### D8 — an old short night is treated as today's sleep debt

**Plain** (`:89`): "The app can treat an old short night as today's sleep debt when no recent night is recorded; whether missing sleep should keep that old restriction is the owner's call." Register 87–95; LIVE `:92` NOT TRIGGERED; FIX `:94` names "`cleanAtDate` and its sleep-context consumers".
**Current code** — `sleep.cjs:1009–1018`, file sha256 `2dde4a08…`. `nights[nights.length - 1]` is the latest night *before* `iso` at any age; `DEBT_LAST_H = 6.5` (`constants.cjs:309`):
```js
function nightsBefore(s, iso) {
  return (((s || {}).sleep || {}).nights || []).filter((n) => n.d < iso).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
}
function cleanAtDate(s, iso) {
  const nights = nightsBefore(s, iso);
  if (!nights.length) return true;
  const last = nights[nights.length - 1];
  if (last.h < DEBT_LAST_H) return false;
```
**Owner semantics (`DECISIONS.md:60`, verbatim):** "D8 APPROVED-FIX — when last night's sleep is missing, recovery is UNKNOWN and no sleep restriction is applied today; every other recovery check still applies (not carry-forward of the last logged night)."
**Proposed behaviour.** The latest logged night counts as current only when its date is the calendar day immediately before `iso`. With no such night, the function returns the same nonblocking result the empty-history branch already returns at `:1016` — UNKNOWN, no restriction — and the three-consecutive-night mean at `:1019–1026` still runs on the nights that do exist. The "expose missing evidence distinctly" part of the register's FIX is **not** added to the boolean return: all twelve call sites treat it as a boolean and `progression.cjs:408`'s comment says so explicitly; that belongs to a surface, not this package.
**Proposed hunk** (`sleep.cjs:1014–1018`), plus `const plusDays = (...args) => E.plusDays(...args);` in the delegate block:
```js
  const last = nights[nights.length - 1];
+ if (last.d !== plusDays(iso, -1)) return true;   /* D8 — a night that is not LAST night carries no current restriction */
  if (last.h < DEBT_LAST_H) return false;
```
**Law** `D-D8-stale-sleep-does-not-claim-current-debt` (`laws-clock-and-as-of.cjs:23`): *"With no entry for last calendar night, stale sleep has the same nonblocking effect as the existing missing-sleep baseline, while last night's short sleep still flags debt."* Assertion `:24` `missing === true && stale === missing && recentShort === false`. **RED today (executed):** `{missing: true, stale: false, recentShort: false}` — an 8-month-old 5 h night returns `false` where a missing night returns `true`; control GREEN; mutant `last-logged-night-stands-in-for-last-calendar-night` RED.
**Delta cells.** `cleanAtDate({nights:[{d:'2026-01-01',h:5}]}, '2026-09-03')` `false`→`true`. Downstream the same flip removes a phantom debt at `progression.cjs:408,574` and `sleep.cjs:53,254,257` (`debt = !cleanAtDate(...)`), stops stale-evidence refusals at `writers.cjs:538,908,913`, and makes `energy.cjs:1219`'s `slept` true in the stale case.
**Must NOT change (executed).** Last night 5 h → `false`; last night 8 h → `true`; empty history → `true`; stale 8 h night → `true`; a three-night 7 h run ending last night → `true`.
**Source mutants.** (1) `stale-night-returns-false` (inverted guard) — turns unknown into restriction; killed by `stale === missing`. (2) `age-window-instead-of-last-night` — `if (daysBetween(last.d, iso) > 7) return true`; killed by purpose-written 2- and 3-day-old cases. (3) `drop-the-three-night-mean` — returning `true` before `:1019`; killed by the three-short-nights control.
**Negative controls.** Every `last.d === iso − 1 day` case at 5, 6.4, 6.5 (the `DEBT_LAST_H` boundary) and 8 h; empty `nights`; a night dated on or after `iso`; `sleepMean3At` (`:1030`) and `atSleepTarget` (`:1043`) byte-identical.

### D21 — sleep called clean on the fall-back date after a short night

**Plain** (`:139`): "On the day the clocks move back, the app can call sleep clean even after a short night logged for that day." Register 137–145; FIX `:144` "Advance to the next calendar date instead of adding a fixed twenty-four hours." **Owner semantics:** none specific; Batch-A plain FIX at `DECISIONS.md:60` ("D21 APPROVED-FIX"); it inherits D8's rule through `cleanAtDate`.
**Current code** — `sleep.cjs:1882–1888` (same file sha as D8):
```js
function sleepInfo(s) {
  const n = s.sleep.nights;
  const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at, clean: cleanAtDate(s, tomorrow), last: n[n.length - 1], need: s.sleep.needed };
}
```
**Proposed behaviour.** `sleepInfo` asks about the next *calendar* date, so the night logged on the fall-back date is inside the window it is meant to be inside. `run`, `atTarget`, `last` and `need` keep their existing sources. **Proposed hunk** (`sleep.cjs:1885`): `const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));` → `const tomorrow = plusDays(isoOf(todayStart()), 1);`
**Law** `E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date` (`laws-clock-and-as-of.cjs:105`): *"The fall-back day's sleep cleanliness includes the night recorded on that calendar date."* Assertion `:107` `r.clean === false && r.clean === cleanAtDate(s,'2026-11-02')`. **RED today (executed):** at `clock.today() = '2026-11-01'` with a 1 h night on `2026-11-01`, `sleepInfo(s).clean = true` while `cleanAtDate(s,'2026-11-02') = false`; the cause, measured, is `isoOf(new Date(mk('2026-11-01').getTime() + 86400000)) === '2026-11-01'`. Control GREEN; mutant `tomorrow-is-exactly-twenty-four-hours-later` RED. After D8's hunk the law's state still satisfies `last.d === plusDays('2026-11-02', -1)`, so D8 does not neutralise D21 — to be proved by an executed cross-case.
**Delta cells.** `sleepInfo(s).clean` on any fall-back date (`2026-11-01`, `2027-11-07`, `2025-11-02`) with a short same-date night: `true`→`false`; downstream `recoveryIndex`/`bodyAlarm`/Today's SLEEP lever on those dates.
**Must NOT change (executed).** `2026-09-03` (ordinary) already `false`; `2026-03-08` (spring-forward) already `false` — both stay `false` byte-identical; `sleepInfo`'s other four cells unchanged on all dates.
**Source mutants.** (1) `tomorrow-is-plus-two-days` — passes the law's single assertion but breaks under D8; killed by the D8×D21 cross-case. (2) `use-today-instead-of-tomorrow` (`plusDays(iso,0)`) — killed directly. (3) `hardcode-fallback-date` via `getTimezoneOffset` — killed by requiring the ordinary and spring-forward controls byte-identical *and* two other fall-back years to pass.

### D19 — break-end wording resumes the cut while the break is active

**Plain** (`:129`): "The app says a seven-day break is on day six and the cut resumes today while today is still inside the break." Register 127–135; FIX `:134` "Keep the existing inclusive active interval and derive one-based day numbering and next-day resumption wording from it. … **The frozen phase receipt string changes in both line and next.when**". **Owner semantics:** none specific; Batch-A plain FIX ("D19 APPROVED-FIX").
**Current code** — `policy.cjs`, file sha256 `a1d21404…`. `BREAK_LEN_DAYS = 7` (`constants.cjs:303`); `daysBetween` (`policy.cjs:503`) is `Math.round((mk(b) - mk(a)) / DAY)` and is already DST-safe:
```js
// :531  inclusive active interval
  if (today <= brk.end)   return { status: "active",   start: brk.start, end: brk.end, startsIn: 0, daysLeft: Math.max(0, daysBetween(today, brk.end)), daysSince: daysBetween(brk.start, today), ...base };
// :562-563
  } else if (key === "break") {
    next = { key: "cut", label: PHASE_META.cut.label, when: `resumes ${fmtShort(brkS.end)}`, note: "the deficit picks back up; the scale settles as the glycogen water comes back off" };
// :572-573
  const line = key === "break"
    ? `Diet break — day ${brkS.daysSince} of ${BREAK_LEN_DAYS}, ${brkS.daysLeft} to go. Eating at maintenance; the cut resumes ${fmtShort(brkS.end)}.`
```
**Proposed behaviour.** The interval is inclusive at both ends, so the day number is one-based and the cut resumes the calendar date *after* `brk.end`. `dietBreakState`'s returned fields do not change — `daysSince` stays the zero-based offset every other consumer reads — and the numbering and resumption date are derived in `phaseArc` where the prose is composed, which is the register's own instruction ("derive … from it") and matches the law's control, which patches `phaseArc` only.
**Proposed hunk** (`policy.cjs:562–563,572–573`, plus one new line near `:541` where `brkS` is bound):
```js
+ const resumeISO = brkS.end ? plusDays(brkS.end, 1) : null;   /* D19 — an inclusive last active day resumes the NEXT date */
- when: `resumes ${fmtShort(brkS.end)}`,                        // :563
+ when: `resumes ${fmtShort(resumeISO)}`,
- ? `Diet break — day ${brkS.daysSince} of ${BREAK_LEN_DAYS}, ${brkS.daysLeft} to go. Eating at maintenance; the cut resumes ${fmtShort(brkS.end)}.`
+ ? `Diet break — day ${brkS.daysSince + 1} of ${BREAK_LEN_DAYS}, ${brkS.daysLeft} to go. Eating at maintenance; the cut resumes ${fmtShort(resumeISO)}.`
```
**Law** `P-D19-inclusive-break-end-prose-agrees-with-active-day` (`laws-clock-and-as-of.cjs:91`): *"An inclusive break calls its last active day day seven and names the following calendar date as the cut resumption."* Assertion `:94` `b.status==='active' && p.line.includes('day 7 of 7') && p.line.includes('resumes '+fmtShort('2026-09-08')) && p.next.when==='resumes '+fmtShort('2026-09-08')`.
**RED today (executed)**, break `2026-09-01`–`2026-09-07`; `fmtShort('2026-09-07')='Mon 9/7'`, `fmtShort('2026-09-08')='Tue 9/8'`:

| `today` | `daysSince` | current `line` |
|---|---|---|
| `2026-09-01` | 0 | `Diet break — day 0 of 7, 6 to go. Eating at maintenance; the cut resumes Mon 9/7.` |
| `2026-09-04` | 3 | `Diet break — day 3 of 7, 3 to go. …` |
| `2026-09-07` | 6 | `Diet break — day 6 of 7, 0 to go. Eating at maintenance; the cut resumes Mon 9/7.` |
| `2026-09-08` | — | `status = recent`, `key = cut`, break prose gone |

The off-by-one is on **every** day of the break, not only the last — the register's PLAIN under-describes it. Control GREEN; mutant `zero-based-break-day-and-same-date-resumption` RED.
**Delta cells.** `phaseArc(...).line` for `key === 'break'`: `day N of 7`→`day N+1 of 7` and `resumes <end>`→`resumes <end+1d>`; `phaseArc(...).next.when`: `'resumes Mon 9/7'`→`'resumes Tue 9/8'`. Both are frozen receipt strings (§3).
**Must NOT change.** `dietBreakState`'s complete return on all four statuses (the executed values above are the pins); `daysLeft`; `phaseArc`'s `line` for `cut`/`maintenance`/`leangain` (executed: `Cut — week 12.9. Next: maintenance hold (when you and your coach call it — no date).`); the `proposed` branch's `starts ${fmtShort(brkS.start)}` at `:560`; `weeks`, `since`, `key`, `label`, `toneKey`, `order`, `sup`.
**Source mutants.** (1) `shift-daysSince-in-dietBreakState` — `+ 1` inside `:531`: passes the `line` assertion but changes `daysSince` for `phaseSupervisor` and every other consumer; killed by the `dietBreakState` return pin. (2) `resume-plus-one-millisecond-day` — killed by a break ending on a fall-back date. (3) `off-by-one-both-ends` (also bumping `BREAK_LEN_DAYS` to 8) — killed by asserting the literal `of 7`.

### D16 — a month-late weigh-in grades a 7-day forecast hit

**Plain** (`:235`): "The app calls a forecast a seven-day success using a weigh-in from a month later; the owner must choose how late a reading may be." Register 233–241. **LIVE `:238` TRIGGERED** — one of only three LIVE-triggered defects in the remainder (`:506`; summary `:487–535`). FIX `:240` "Require an eligible read inside the owner-ruled forecast horizon before recording a hit. Estimate 4 hours. The historical hit totals and calibration receipt change".
**Current code** — `policy.cjs:473–484` (`GRADE_LAG = 7`, `constants.cjs:289`). Two independent faults: `actualTrendAt` has **no upper bound**, and the reads filter applies **no eligibility test** — `sealed`/`offWindow` reads are admitted, unlike every other read consumer (`migrate.cjs:301`, `writers.cjs:1560,2405`, `today.cjs:190`):
```js
function trackRecord(s, deps) {
  const reads = (s && Array.isArray(s.reads)) ? s.reads.filter((r) => r && r.d) : [];
...
  const actualTrendAt = (iso) => { for (const r of sorted) if (r.d >= iso && r.pt != null) return r.pt; return null; };
  for (const f of fc) {
    const dueISO = isoOf(new Date(mk(f.d).getTime() + GRADE_LAG * DAY));
    const actual = actualTrendAt(dueISO);
    if (actual == null) { rows.push({ d: f.d, pred: +(+f.pred7).toFixed(1), actual: null, err: null, graded: false, hit: null, miss: false }); continue; }
```
**Owner semantics (`DECISIONS.md:60`, verbatim):** "D16 APPROVED-FIX — a 7-day forecast hit requires an eligible weigh-in on the due day or, failing that, the next day (one grace date); with no such reading the forecast is UNGRADED, not a miss; the day arithmetic follows D10."
**Proposed behaviour.** The due date is `f.d` plus seven *calendar* days. A forecast is graded only by an eligible read — not `sealed`, not `offWindow`, numeric `pt` — dated on the due date or the one calendar date after it, earliest winning. With no such read the row keeps exactly the shape the existing ungraded branch produces (`graded:false, hit:null, miss:false`), so an ungraded call is never a miss and never enters `graded`, `hits`, `misses`, `mae`, `cleanStreak` or the calibration sentence. `tol`, the `|err| <= tol` rule, `TRACK_ROWS` and the row field set are untouched.
**Proposed hunk** (`policy.cjs:479,482–483`):
```js
- const actualTrendAt = (iso) => { for (const r of sorted) if (r.d >= iso && r.pt != null) return r.pt; return null; };
+ /* D16 — an eligible read ON the due date or the one grace date after it; later reads leave the call UNGRADED */
+ const actualTrendAt = (iso, graceISO) => { for (const r of sorted) if (r.d >= iso && r.d <= graceISO && r.pt != null && !r.sealed && !r.offWindow) return r.pt; return null; };
-     const dueISO = isoOf(new Date(mk(f.d).getTime() + GRADE_LAG * DAY));
-     const actual = actualTrendAt(dueISO);
+     const dueISO = plusDays(f.d, GRADE_LAG);
+     const actual = actualTrendAt(dueISO, plusDays(dueISO, 1));
```
**Law** `E-D16-seven-day-forecast-does-not-grade-a-month-late-read` (`laws-receipt-truth.cjs:8`): *"The proposed seven-day forecast window grades eligible readings on the due day or following day and leaves later readings ungraded."* Assertion `:12` `r.graded===0 && r.rows[0].hit===null && due.graded===1 && due.rows[0].hit===true && grace.graded===1 && grace.rows[0].hit===true && late.graded===0`.
**RED today (executed)**, forecast `d='2026-08-01'`, `pred7=165`, one read `pt=165`: read `2026-08-07` → `graded 0`, `hit null`; `08-08` (due) → `1`/`true`; `08-09` (grace) → `1`/`true`; **`08-10` → `1`/`true`** and **`09-01` → `1`/`true`**, both of which must become `0`/`null`. Control GREEN; mutant `first-later-read-has-no-horizon-limit` RED.
**CONDITION (C1), per the `DECISIONS:82` D30 precedent.** The law's control (`laws-receipt-truth.cjs:13–17`) computes `due = mk(f.d).getTime() + 7*DAY` and filters `mk(r.d) >= due && <= due + DAY` — elapsed-millisecond arithmetic the product rule must not use. Measured divergence: for a forecast dated `2026-11-01`, `isoOf(mk + 7*DAY)` is `'2026-11-07'` while the seventh calendar day is `'2026-11-08'`, and the control's `due + DAY` then excludes the legitimate grace read. **The control may serve as a result oracle for the September cases, never as the calendar-arithmetic oracle**; a purpose-written case (forecast `2026-11-01`, reads `11-07`/`11-08`/`11-09`) must be constructed from source before candidate inspection.
**Delta cells.** `graded`, `hits`, `misses`, `mae`, `cleanStreak`, `hasMiss` and the **calibration receipt string** all move wherever a historical forecast was graded by a late or ineligible read. Executed no-read baseline that must stay: `graded = 0`, `calibration = "No 7-day calls have come due yet — the record fills as each prediction ages into an outcome."` LIVE is TRIGGERED, so a private-census change **is** anticipated here, verdict-only (§5).
**Must NOT change.** Due-day and grace-day hits (`08-08`, `08-09`); the pre-due ungraded row (`08-07`) byte-identical; `tol` derivation (`:476–477`); `decisions` (that is D17); row field names and order; `rows.slice(-TRACK_ROWS)`.
**Source mutants.** (1) `ungraded-counts-as-miss` — contradicts "UNGRADED, not a miss"; killed by `late.graded===0`. (2) `grace-window-is-two-days` — killed by the `08-10` cell. (3) `drop-the-eligibility-filter` — horizon without `!sealed && !offWindow`; killed by a sealed-read-on-the-due-day case that must stay UNGRADED. (4) `calendar-add-by-milliseconds` — the control's own arithmetic in product; killed by the `2026-11-01` case.

### D17 — an undone adjustment is still reported as applied

**Plain** (`:245`): "The app says an adjustment is still applied after the athlete has undone it." Register 243–251; FIX `:250` "Include the existing undone flag when deriving whether the adjustment is applied. … Decision-history status changes without rewriting stored receipt text". **Owner semantics:** none specific; Batch-A plain FIX ("D17 APPROVED-FIX").
**Current code** — `policy.cjs:494–495`:
```js
  const decisions = ((s && s.adjustments) || []).filter((a) => a && a.rid && (String(a.rid).indexOf("ap_") === 0 || String(a.rid).indexOf("apauto_") === 0))
    .slice(-8).map((a) => ({ d: a.d, title: a.title, applied: !a.dismissed, auto: !!a.auto }));
```
**Proposed behaviour.** `applied` is false when the adjustment was dismissed **or** undone; the row stays in history with its stored title and date, and no stored record is rewritten. **Proposed hunk** (`policy.cjs:495`): `applied: !a.dismissed` → `applied: !a.dismissed && !a.undone`.
**Law** `E-D17-undone-adjustment-is-not-described-as-applied` (`laws-receipt-truth.cjs:27`): *"An undone adjustment stays in decision history with applied false."* Assertion `:29` `r.decisions.length===1 && r.decisions[0].applied===false`. **RED today (executed):** `undone:true` → `[{"d":"2026-09-03","title":"X","applied":true,"auto":false}]`. Control GREEN; mutant `applied-means-only-not-dismissed` RED.
**Delta cells.** `trackRecord(...).decisions[i].applied` `true`→`false` for any adjustment carrying `undone`; nothing else moves — the hunk is one operator.
**Must NOT change (executed pins).** `dismissed:true` → `applied:false` (already); neither flag → `true`; both flags → `false`; `d`, `title`, `auto`, the `rid` prefix filter, `slice(-8)`.
**Source mutants.** (1) `drop-undone-rows` — violates "stays in decision history"; killed by `decisions.length===1`. (2) `undone-means-auto` — killed by the `auto` pin. (3) `applied-always-false` — killed by the neither-flag control.

### D24 — yesterday marked complete though its food is missing

**Plain** (`:255`): "The app says yesterday is complete after only steps were entered even though the ledger still says yesterday's food is missing." Register 253–261; FIX `:260` "Use the same calorie-completeness predicate for yesterday that the existing ledger and today checks use." **Owner semantics:** none specific; Batch-A plain FIX ("D24 APPROVED-FIX").
**Current code** — `today.cjs:195–202`, file sha256 `af4c65d2…`. `:196` uses the calorie predicate for *today*; `:202` uses bare key presence for *yesterday*. The ledger uses the calorie predicate too, at `sleep.cjs:997–998`:
```js
  const dl = (s.dailyLogs || {})[tISO];
  const dayOpen = !dl || dl.cal == null;
...
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
```
**Proposed behaviour.** Yesterday is open when its row is absent **or** has no calories — the identical predicate today and the ledger already use. The label and `why` prose at `:203` do not change.
**Proposed hunk** (`today.cjs:201–202`):
```js
- const yISO = isoOf(new Date(todayStart().getTime() - DAY));
- const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
+ const yISO = plusDays(isoOf(todayStart()), -1);
+ const yRow = (s.dailyLogs || {})[yISO];   /* D24 — the SAME calorie predicate as today (:196) and the ledger (sleep.cjs:997) */
+ const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && (!yRow || yRow.cal == null);
```
The `yISO` line is included because `-DAY` from local midnight is itself broken the day after spring-forward: measured, `isoOf(new Date(mk('2026-03-09').getTime() - 86400000))` is `'2026-03-07'`, two calendar days back. **That is not in the register and has no law**; it is one line inside D24's own hunk and the minimal D24 fix is wrong on that date without it, so I propose it ride here with a purpose-written control (`yISO` on `2026-03-09` is `2026-03-08`) — flagged in §6.
**Law** `E-D24-partial-yesterday-remains-owed-until-calories-are-present` (`laws-receipt-truth.cjs:40`): *"A yesterday row lacking calories remains owed in both Today and the ledger."* Assertion `:42` `owedLedger has day 2026-09-02 && f.owed.some(k==='yesterday') && !f.clear`. **RED today (executed):** with `dailyLogs = {'2026-09-01':{cal:2000},'2026-09-02':{steps:10000}}` at `today = 2026-09-03`, `nowFocus(s,12).owed` keys are `["night"]` — no `yesterday` — while `owedLedger(s,12)` does list `2026-09-02` as open. Control GREEN; mutant `any-yesterday-row-counts-as-complete` RED.
**Delta cells.** `nowFocus(...).owed` gains a `yesterday` row whenever yesterday exists without `cal`; `owed.length`, `clear` and `lead` (`{t, sub, more}`) move with it, `lead.more` incrementing. Through `theOneFix` (`today.cjs:276`) rung `logging` now fires in states that previously fell through — which is why D24 precedes D27.
**Must NOT change (executed pins).** No yesterday row at all → `["night","yesterday"]`; yesterday complete → `["night"]`; empty `dailyLogs` → `["night"]` (the `Object.keys(...).length > 0` guard); `owedLedger`'s rows byte-identical (`["2026-08-31","2026-09-02"]` in the law's state); `dayOpen`, `eveningFrom`, the `phase` word.
**Source mutants.** (1) `require-every-field` (`|| yRow.pro==null || yRow.steps==null`) — over-owes; killed by a complete-but-no-`pro` control. (2) `drop-the-empty-ledger-guard` — killed by the empty-`dailyLogs` control. (3) `yesterday-by-milliseconds` — killed by the `2026-03-09` calendar control.

### D25 — protein reads "good" on a sole missed day

**Plain** (`:265`): "The app calls protein good when the only recorded day misses the target; whether one forgiven miss should apply immediately is the owner's call." Register 263–271; BAR `:267` "none: cosmetic / internal / performance"; FIX `:270` "Require at least one successful observation before the one-miss allowance can produce good. … The status changes while the existing 0/1 detail stays truthful".
**Current code** — `today.cjs:237–244`. With one row and zero hits, `0 >= 1 - 1` is true → `good`:
```js
  const pt = proteinTarget(s);
  const proRows = Object.entries(s.dailyLogs || {}).filter(([, v]) => v && v.pro != null)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-7).map(([, v]) => v.pro);
  const proHitN = proRows.filter((p) => proteinHit(pt.lo, p)).length;
  const protein = !proRows.length
    ? { label: "PROTEIN", state: "quiet", detail: "counting only" }
    : { label: "PROTEIN", state: proHitN >= proRows.length - 1 ? "good" : "caution", detail: `${proHitN}/${proRows.length}` };
```
**Owner semantics (`DECISIONS.md:60`, verbatim):** "D25 APPROVED-FIX — \"protein: good\" requires at least one successful day within the current seven-logged-days window before the one-miss allowance applies; a first missed day cannot read \"good\"."
**Proposed behaviour.** `good` requires at least one successful day inside the existing seven-logged-days window, in addition to the existing one-miss allowance. Window, `slice(-7)`, `proteinHit`, `proteinTarget`, the `N/M` detail string and the `quiet` branch are untouched. **Proposed hunk** (`today.cjs:244`): `state: proHitN >= proRows.length - 1 ? "good" : "caution"` → `state: proHitN >= 1 && proHitN >= proRows.length - 1 ? "good" : "caution"`.
**Law** `E-D25-zero-protein-successes-cannot-be-a-good-protein-read` (`laws-receipt-truth.cjs:53`): *"Zero successful protein days cannot produce a good protein status."* Assertion `:55` `proteinTarget(s).lo > 0 && r.protein.detail==='0/1' && r.protein.state!=='good'`. **RED today (executed):** `proteinTarget(state()).lo = 170`; sole day `pro:0` → `{"label":"PROTEIN","state":"good","detail":"0/1"}`. Control GREEN; mutant `one-miss-allowance-permits-zero-successes` RED.
**Delta cells.** Exactly one: `fiveLevers(s).protein.state` for `proHitN === 0 && proRows.length === 1`: `good`→`caution`. `detail` stays `"0/1"`; `list[1]` must remain the same object identity as `protein` (the control at `:56` relies on it).
**Must NOT change (executed pins).** `1/1`→`good`; `0/2`→`caution` (already, `0 >= 1` false); `1/2`→`good`; `6/7`→`good`; no `pro` rows → `{state:"quiet", detail:"counting only"}`; `deficit`, `training`, `sleep`, `steps` byte-identical.
**Source mutants.** (1) `require-a-majority` (`proHitN*2 >= proRows.length`) — killed by `1/2` and `6/7`. (2) `drop-the-one-miss-allowance` (`proHitN === proRows.length`) — killed by `6/7`. (3) `zero-rows-becomes-caution` — killed by the no-rows control.

### D27 — an athlete at maintenance is told a long cut has stalled

**Plain** (`:275`): "The app tells an athlete already at maintenance that a long calorie cut has stalled and a diet break is due." Register 273–281; FIX `:280` "Gate stalled-cut advice on the committed phase and derive long-cut duration from that phase's recorded start. Estimate 3 hours. The inappropriate instruction disappears; phase/Today golden receipts can change." **Owner semantics:** none specific; Batch-A plain FIX ("D27 APPROVED-FIX").
**Current code** — `today.cjs:298–306`. `weekDay()` (`sleep.cjs:1891–1894`) is the *global* programme week from `START`, not the committed phase; the committed phase lives at `policy.cjs:543` and its start at `:552–554`:
```js
  const cr = currentRate(s);
  const stalled = !sealed && cr.measured && cr.scale < floor;
  const longCut = weekDay().wk >= 10;
  if (stalled && longCut) return { rung: "break", lever: "DEFICIT", state: "caution",
    title: "A diet break has earned its place",
    body: "You've held the deficit for weeks and the trend has flattened. ...", whyNot: null };
  if (stalled) return { rung: "calories", lever: "DEFICIT", state: "caution",
    title: "Now a small calorie trim earns its place",
```
**Proposed behaviour.** Rungs 4 and 5 — the diet-break advice and the calorie-trim advice — apply only when the committed phase is a calorie cut, and the long-cut duration comes from that phase's own recorded start rather than the global programme clock. A committed maintenance or lean-gain athlete falls through to the existing quiet `hold` return at `:310–312`; no new prose is authored. The gate goes on `stalled`, not on `longCut`, because the register says "stalled-cut advice" (plural rungs) and the law's control gates **both** `break` and `calories`; gating only `longCut` would leave a maintenance athlete told to trim calories — the same defect one rung down. **The law's single assertion under-specifies this; follow the register and the control.**
**Proposed hunk** (`today.cjs:298–300`) plus `const phaseArc = (...args) => E.phaseArc(...args);` in the delegate block. `index.cjs:3–17` registers `policy.cjs` before `today.cjs`, and I verified `policy.cjs` and `sleep.cjs` contain no reference to `E.theOneFix`, `E.fiveLevers`, `E.nowFocus` or `E.nowModel`, so this adds no cycle:
```js
  const cr = currentRate(s);
+ /* D27 — rungs 4/5 are CUT advice: the committed phase decides, and its own recorded start times it */
+ const arc = phaseArc(s);
+ const onCut = arc.key === "cut";
- const stalled = !sealed && cr.measured && cr.scale < floor;
+ const stalled = onCut && !sealed && cr.measured && cr.scale < floor;
- const longCut = weekDay().wk >= 10;
+ const longCut = arc.weeks >= 10;
```
**Law** `P-D27-maintenance-is-not-described-as-a-long-stalled-cut` (`laws-receipt-truth.cjs:66`): *"Committed maintenance cannot receive a diagnosis that weeks of a calorie cut have stalled."* Assertion `:68` `phaseArc(s).key==='maintenance' && fix.rung!=='break' && !/held the deficit for weeks/.test(fix.body)`. **RED today (executed):** with `s.plan.phase='maintenance'`, `phaseArc(s).key = 'maintenance'` and `weekDay() = {wk:13,day:86}`, `theOneFix(s)` returns `rung='break'`, `title="A diet break has earned its place"`, body starting `"You've held the deficit for weeks"`. Control GREEN; mutant `global-programme-week-substitutes-for-committed-cut` RED.
**`arc.weeks` carries D10's arithmetic class.** `policy.cjs:554` is `+(((mk(today) - mk(since)) / DAY) / 7).toFixed(1)` — the same elapsed-millisecond week computation D10 rules on, hand-rolled instead of calling `weeksBetween`, which D10's hunk does not reach. Since D27's fix makes `theOneFix` consume `arc.weeks`, I propose one further line inside D27's hunk — `policy.cjs:554` → `const weeks = +weeksBetween(since, today).toFixed(1);` — so a diet-break recommendation's timing is D10-consistent (§6). `energy.cjs:523,525` and `sleep.cjs:1892,1934` carry the same class and are outside B1's modules.
**Delta cells.** For `plan.phase` `maintenance`/`leangain` with a flat trend: `rung` `break`→`hold`, `lever` `DEFICIT`→`null`, `state` `caution`→`good`, `title`→`"Nothing to fix — hold the line"`, `body`→the quiet body at `:312`. Through `nowModelUncached:556`, `move.kind` flips from `fix` to `rate` or `quiet` and `move.title`/`body` change — a Today golden surface. With `policy.cjs:554` included, `phaseArc(...).line`'s `week N` and `weeks` shift by ≤0.1 on DST-crossing phases.
**Must NOT change (executed).** `plan.phase='cut'` with the same flat trend still returns `rung='break'`, `title="A diet break has earned its place"` — the load-bearing negative control. `plan.phase` absent (→ `key='cut'` by `policy.cjs:550`'s `else`) likewise. Rungs 1–3 (`logging`, `steps`, `sleep`) unchanged in every phase; `phaseArc`'s return apart from `weeks`.
**Source mutants.** (1) `gate-longcut-only` — passes the law but leaves rung `calories` for a maintenance athlete; killed by a purpose-written case asserting `rung==='hold'`. (2) `read-plan-phase-directly` (`s.plan.phase === 'cut'`) — ignores `phaseArc`'s `brk.status==='active'` (`:547`) and `exitStarted` (`:549`) precedence, so an athlete inside a diet break still gets break advice; killed by a `brk`-active case. (3) `gate-on-programme-week-and-phase` — keeping `weekDay().wk >= 10` alongside `onCut`; killed by a committed cut under 10 weeks old inside a programme week ≥ 10 (must be `calories`, not `break`).

### D23 — a scheduled lower-body workout shows as a rest day

**Plain** (`:349`): "The app shows a rest day when a lower-body workout is scheduled and its first-use weight is ready." Register 347–355; FIX `:354` "Supply the required sleep input when deriving the next workout and distinguish a failed derivation from a rest day. Estimate 2 hours. Workout title and date change from the false rest fallback". **Owner semantics:** none specific; Batch-A plain FIX ("D23 APPROVED-FIX").
**Current code** — the three coordinates the register cites, `today.cjs:54,567,574`:
```js
// :51-54  pickStructural
function pickStructural(s, iso, slp) {
  const dt = dayType(iso, s);
  const candidates = s.queue.filter((q) => !q.done && q.state !== "PROPOSED" && (q.kind === "debut" || q.kind === "unlock") && q.exId && exActive(s, q.exId) && exById(s, q.exId) && exById(s, q.exId).day === dt);
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
// :561-574  nowModelUncached
  let workout = { title: "REST DAY", sub: "Recovery is training too — the next session is on its way.", today: false };
  try {
    for (let k9 = 0; k9 < 7; k9++) {
      const d9 = isoOf(new Date(todayStart().getTime() + k9 * 864e5));
      const dt9 = dayType(d9, s);
      if (dt9 === "U" || dt9 === "L") {
        const sess9 = genSession(s, d9);
...
  } catch (e) {}
```
`genSession(s, d9)` omits its third parameter `slp` (declared `:61`); `pickStructural:54` then reads `slp.last` and throws; the bare `catch (e) {}` swallows it and the `REST DAY` initialiser survives. The short-circuit `q.exId === "hack" && slp.last` means the throw occurs **only** when a hack debut/unlock candidate exists — which is why the law is named for the hack debut. `writers.cjs:875,1051` pass `slp` correctly; `today.cjs:567` is the only omission.
**Proposed behaviour.** The next-workout loop supplies the sleep context `genSession` requires, and a derivation that still fails is distinguished from a genuine rest day: the bare catch is narrowed to the loop body so a failure on one candidate day does not abandon the remaining six, and the `REST DAY` initialiser survives only when no scheduled U/L day was found at all. No new prose; no change to `pickStructural`'s hack gate (that is H1, §4) or to `genSession`'s body.
**Proposed hunk** (`today.cjs:562–574`) plus `const sleepInfo = (...args) => E.sleepInfo(...args);` in the delegate block. `index.cjs:3–17` registers `sleep.cjs` before `today.cjs` and `sleep.cjs` references no `today.cjs` export, so no cycle:
```js
+ const slp9 = (() => { try { return sleepInfo(s); } catch (e) { return { last: null }; } })();   /* D23 — genSession REQUIRES its sleep input (:61,:54) */
- try {
-   for (let k9 = 0; k9 < 7; k9++) {
-     const d9 = isoOf(new Date(todayStart().getTime() + k9 * 864e5));
-     const dt9 = dayType(d9, s);
-     if (dt9 === "U" || dt9 === "L") {
-       const sess9 = genSession(s, d9);
+ for (let k9 = 0; k9 < 7; k9++) {
+   let d9, dt9, sess9;
+   try {
+     d9 = plusDays(isoOf(todayStart()), k9);
+     dt9 = dayType(d9, s);
+     if (dt9 !== "U" && dt9 !== "L") continue;
+     sess9 = genSession(s, d9, slp9);
+   } catch (e) { continue; }   /* a failed derivation is not a rest day: keep scanning */
        ... break;
-   }
- } catch (e) {}
+ }
```
`plusDays` also replaces `todayStart().getTime() + k9 * 864e5`, the same fall-back collapse D21 fixes: measured, stepping `+1 DAY` from `2026-11-01` yields `2026-11-01` again, so the current loop can examine one calendar date twice and miss a scheduled day.
**Law** `E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day` (`laws-state-shape-and-failure.cjs:21`): *"A scheduled lower-body session with a ready hack debut is displayed as the scheduled workout."* Assertion `:25` `session.name==='LOWER' && model.workout.today===true && model.workout.iso==='2026-09-03' && model.workout.title.startsWith('LOWER BODY')`. **RED today (executed):** `genSession(s,'2026-09-03',{last:null}).name = 'LOWER'`; `genSession(s,'2026-09-03')` **throws** `TypeError: Cannot read properties of undefined (reading 'last')`; `nowModel(...).workout = {"title":"REST DAY","sub":"Recovery is training too — the next session is on its way.","today":false}` with `iso` absent. Control GREEN; mutant `missing-sleep-argument-falls-through-to-rest-day` RED.
**Delta cells.** `nowModel(...).workout` for a ready hack debut on a scheduled L day: `{title:"REST DAY", sub:"Recovery is training too…", today:false}` (no `iso`) → `{title:"LOWER BODY · TODAY", sub:<beats>, today:true, iso:"2026-09-03"}`. Through `nowModelUncached:586` this is a Today golden surface. The hack deferral still applies when `slp.last.h < 4.5`: the session is derived and the hack deferred, which is the designed behaviour, not a rest day.
**Must NOT change (executed pins).** Non-hack debut on a scheduled L day: `{"title":"LOWER BODY · TODAY","sub":"","today":true,"iso":"2026-09-03"}`; no queue at all: identical; a genuine rest week (empty `split` map): `{"title":"REST DAY","sub":"Recovery is training too — the next session is on its way.","today":false}` byte-identical with `iso` still absent. `pickStructural`'s complete return on all inputs; `genSession`'s three-argument behaviour.
**Source mutants.** (1) `default-slp-to-empty-object` (`slp = {}` in the signature) — stops the throw and passes the law but silently makes every hack debut pass the 4.5 h gate; killed by a case with `sleepInfo(s).last.h = 3` asserting the hack is deferred. (2) `remove-the-catch` — a throw now escapes `nowModel`; killed by a throwing-accessor state that must still produce a model. (3) `rest-day-on-any-failure` — keeping the outer catch and only adding `slp`; killed by a state where the first scheduled day throws and a later one does not. (4) `week-step-by-milliseconds` — killed by a fall-back-date scan.

## 3. Golden and receipt surfaces, and how to handle them

Register FIX warnings, cited: D10 `:114` "rate, body-composition and date-dependent goldens need review where an interval crosses a clock change"; D8 `:94` "Recovery wording and any resulting target/Today goldens may change"; D21 `:144` "sleep and recovery outputs on fall-back dates change, with downstream golden risk"; **D19 `:134` "The frozen phase receipt string changes in both line and next.when"**; D16 `:240` "The historical hit totals and calibration receipt change"; D17 `:250` "without rewriting stored receipt text"; D24 `:260` "Today obligation labels and clear status change"; D25 `:270` "downstream Today golden risk is limited"; D27 `:280` "phase/Today golden receipts can change"; D23 `:354` "Today golden values may change". The exact strings at risk: `policy.cjs:573` and `:563` (the break line and `next.when`), `policy.cjs:497` (calibration), `today.cjs:203` (`"Yesterday never closed"`), `today.cjs:561` (`REST DAY`), `today.cjs:302–303` (diet-break title/body).

**The three frozen-defect witness gates are the concrete blocker, and the plan does not mention them.** `rebuild/conform/v4/postfix/run.cjs:13` requires `witnesses-1`…`witnesses-7` to PASS, and `defect-witnesses.cjs`/`-2.cjs`/`-3.cjs` assert the *current* behaviour against `createEngine` — the candidate engine — under the header "These assertions preserve the frozen defects; a later owner ruling must supply each red-first replacement law." B1 flips ten of them:

| file:line | assertion → reviewed successor |
|---|---|
| `defect-witnesses.cjs:61` | `cleanAtDate({nights:[{d:"2026-01-01",h:5}]},"2026-09-03") === false` → `true` |
| `defect-witnesses.cjs:71–72` | `weeksBetween('2026-03-08','2026-03-15') ≈ 167/168`, `('2026-11-01','2026-11-08') ≈ 169/168` → `=== 1` both |
| `defect-witnesses-2.cjs:93–95` | `r.graded===1`, `r.rows[0].hit===true` for the `2026-09-01` read → `0` / `null`; calibration sentence changes |
| `defect-witnesses-2.cjs:103` | `r.decisions[0].applied===true` → `false` |
| `defect-witnesses-2.cjs:127–128` | `line.includes("day 6 of 7, 0 to go")`, `next.when==="resumes "+fmtShort("2026-09-07")` → `"day 7 of 7, 0 to go"`, `fmtShort("2026-09-08")` |
| `defect-witnesses-2.cjs:159` | `sleepInfo(s).clean===true` → `false` |
| `defect-witnesses-3.cjs:41,48–50` | `assert.throws(() => genSession(s,'2026-09-03'), TypeError)`, `workout.title==="REST DAY"`, `today===false`, `iso===undefined` → no throw, `"LOWER BODY · TODAY"`, `true`, `"2026-09-03"` |
| `defect-witnesses-3.cjs:58–59` | `focus.clear===true`, no `yesterday` row → `false`, `yesterday` present |
| `defect-witnesses-3.cjs:72` | `fiveLevers(s).protein.state==="good"` → `"caution"` |
| `defect-witnesses-3.cjs:100–102` | `fix.rung==="break"`, title, `body.startsWith("You've held the deficit for weeks")` → `rung==="hold"` and the quiet body |

**Recommendation, per PLAN §4.5 (`:148`) and `BRIEF-IMPORT-GUARDS.md:89` ("a discovered conflict needs an exact reviewed successor expectation, never changed frozen tools/goldens or suppressed assertions"): re-pin inside the package PR as reviewed successor expectations, not in a separate successor.** Reasons: (a) the three files are gate inputs on the same runner invocation, so a package whose `witnesses-1..3` gates fail cannot print `POSTFIX PACKAGE PASS` at all and deferring means B1 cannot close; (b) the precedent exists — `defect-witnesses-7.cjs:61–71` already carries the post-repair D41/D43 expectations, and `load-write-package.cjs:9` declares `LOAD WRITE WITNESSES: 10/10`; (c) each edit is a single assertion whose old and new values are enumerated above, so the review surface is small and exactly checkable. Every witness is **rewritten, never deleted**: the printed counts `DEFECT WITNESSES: 10`, `DEFECT WITNESSES 2: 11`, `DEFECT WITNESSES 3: 5` (`defect-witnesses.cjs:77` and the `-2`/`-3` tails) are the gate needles at `run.cjs:13` and must stay exactly as they are.

Anything that is a frozen *tool or golden* rather than a witness — `second-gate.mjs --candidate` (needle `SECOND GATE candidate: PASS`), `rebuild/conform/goldens`, `tools/engine-test.jsx` — is **not** re-pinned by B1. Per the D30 condition at `DECISIONS:82` an executed difference at a protected surface is "a RED stop for a reviewed successor cell, never a golden regeneration". B1 names its protected surfaces as UNCHANGED and must prove it by execution: the P6 cells `tools/engine-test.jsx:8790–8793`, the seeded set-one laboratory card, and the public census/goldens NATIVE-CARRIERS proved identical for legacy-only inputs (`DECISIONS:93`).

## 4. H1 — the per-athlete "hack" special case

`DECISIONS.md:93` C3, verbatim: "today.cjs:92 `e.id === "hack"` is an inherited per-athlete special case (violates per-athlete setup, never one athlete's defaults) — recorded as register item H1 for Track B, byte-untouched here". On `ffabbca` that is `today.cjs:87`; the sibling the plan cites (`:9`) is `today.cjs:54`:
```js
// :54 pickStructural
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
// :87 genSession
    else if (e.id === "hack" && e.pendingThird && isDebutNow) { tgt = [...targetsFor(e, s), Math.max(8, e.hi - 3)]; note = "DEBUT — third set banks whatever it gives"; }
```
H1 has no D-id, no v4 law and no register entry (`PLAN…v1.md:150` says so; confirmed — no `H1` in `AUDIT-REGISTER.md` and no `H1` law in `rebuild/conform/v4/laws-*.cjs`).

**Recommendation: H1 does NOT ride in B1; it gets its own item, scheduled immediately after.** (1) It is a different kind of change: B1's ten defects are all "the engine computes the wrong value from the data it has", while H1 is "the engine hard-codes one athlete's exercise id into a policy", and the repair is a *schema* change — the 4.5 h deferral and the third-set rule must move onto the exercise record (a per-lift field beside the already-existing `e.pendingThird`), reaching `seed.cjs`, `migrate.cjs` and Dad's first-run setup (`PLAN-SLICE-v1.md` DONE item 6, "never Joe's defaults"): three modules and one track B1 does not own. (2) It collides with D23's hunk: D23 fixes the *caller* of `:54` while H1 rewrites the *predicate* on that line, and landing both makes D23's mutant `default-slp-to-empty-object` unkillable, because after H1 there may be no `slp.last` read on that line at all — the negative control proving D23 did not weaken the sleep gate stops existing. (3) It is the one thing near B1 that could need the owner — whether Dad's lift inherits Joe's 4.5 h threshold or gets a per-athlete default is a product rule, and B1 should have no owner question (§6).

**If the PM rules that H1 rides in B1**, the purpose-written law should assert identity-independence, not a new number: `H-H1-structural-deferral-and-third-set-follow-the-lift-record-not-an-athlete-id` · family `engine` · **"Two lifts with identical records except their `id` receive identical structural deferral and identical debut targets: renaming the lift whose record carries the short-sleep deferral and the pending third set from `"hack"` to any other id must not change `pickStructural`'s `{main, riders, deferred}` partition or `genSession`'s `ex[i].tgt` and `ex[i].note`; and a lift whose record carries neither must not receive either behaviour under any id."** Mutant: `athlete-specific-lift-id-decides-policy`. That is RED today by construction — renaming `hack` to `hack2` removes both behaviours — and introduces no new threshold, so it smuggles no product decision into a law.

## 5. Acceptance bar for B1

From PLAN §3 (`:121–132`), made specific.
1. **Brief** — this document, accepted by the PM as a `rebuild/DECISIONS.md` ledger line before implementation, exactly as `DECISIONS:85` did for LOAD-WRITES: naming the path, byte count and sha256, recording the conditions, and stating that no product acceptance follows.
2. **Closed cumulative profile** `rebuild/m4/spec/acceptance-b1-grading-time-window.json`, bound by sha256, carrying `authorizations { owner = DECISIONS:60, contract = DECISIONS:49, theme = the PM's acceptance line for this brief by sha256, review claim POSTFIX-ACCEPTANCE M2-B1-GRADING-TIME-WINDOW … ACCEPTED }`. Runner `rebuild/m4/spec/b1-grading-package.cjs`, shaped like `load-write-package.cjs`, with `assert(args.length===1&&['--full','--ci'].includes(args[0]))` at the same position (`load-write-package.cjs:7`) and **no third mode**. `run.cjs`'s 19-entry `GATES` inventory (`:9–23`) unchanged.
3. **Parent artifact — flagged for the PM.** The chain is `acceptance-import-guards.json → acceptance-step-efficacy.json → acceptance-load-writes.json 5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82` (`DECISIONS:86–87`; both earlier artifacts are on disk under `rebuild/conform/v4/postfix/`). The NATIVE-CARRIERS profile already claims `5073977b…` as its parent (`DECISIONS:93`). **PLAN §4.3 (`:146`) proposes B2 → B1 → B4 → B3 while §2 (`:113`) and `DECISIONS:94` say "B2 ∥ B1". Those are incompatible: a single-parent immutable chain cannot have two heads, so one of B1/B2 must re-pin.** B1's answer: **its immutable parent is the NATIVE-CARRIERS accepted artifact**, because B1 rebases onto it (§0) and its `sleep.cjs`/`today.cjs` pre-images are NATIVE-CARRIERS' post-images. Recommended chain: **NATIVE-CARRIERS → B1 → B2 → B4 → B3**, with "∥" kept as parallel *authoring*, not parallel profiles. If the PM instead lands B2 first, B1's artifact re-pins to B2's and every sha in §0 and §2 is re-taken at that head — cheap now, expensive later, so decide before implementation.
4. **What the FULL run must show.** All 45 register laws executed: **D10, D8, D21, D19, D16, D17, D24, D25, D27, D23 GREEN on the candidate and RED on the frozen engine**; the other 35 still raw RED with approved preservation deltas only (`BRIEF-IMPORT-GUARDS.md:87`). All 19 gates OBSERVED/PASS — the 14 identities at `run.cjs:9–23` plus the package's own children — with `witnesses-1/-2/-3` passing on their reviewed successor assertions (§3). Second gate `second-gate.mjs --candidate`, needle `SECOND GATE candidate: PASS`, including engine/sync/surface accounting. **Own bites:** one disclosed source bite quoting its RED line, then exact byte/sha restoration and a restored-GREEN direct gate, plus one unlisted receipt/input-field delta bite proving the comparator fails closed (`:88`). **Real fault mutants** — the 31 named in §2 — each killing its behavioural case in every applicable cell; "a source-pin refusal, syntax error, missing target or timeout earns no kill" (same line). **Fidelity diff:** no source change outside §2's enumerated hunks; `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md` (`:99`).
5. **Cloud (`--ci`) vs the owner's PC (`--full`).** `--ci` runs focused tests, review controls, browser package, profile refusals, source carriers, traces, direct, inherited carriers, witnesses, legacy differential and the second gate; `load-write-package.cjs:44` is explicit that "CI is explicitly public evidence only". **PC only:** everything reaching `rebuild/conform/private/live.json`. `run.cjs:115–117` hard-requires that file and the private `live.main` golden for `migrate-full` and fails `REQUIRED-PRIVATE-PREPARATION-MISSING` without them; that directory does not exist in the repo and must not. So the whole `--full` run, the three-blob oracle in both Date modes, **the LIVE predicate re-evaluation for D16** (B1's only LIVE-TRIGGERED defect, `AUDIT-REGISTER.md:238,506`) and every `POSTFIX PACKAGE PASS` are the PM's own execution on the PC (`DECISIONS:92`; `:93` C4: "FULL incl. the private oracle is the PM's own execution before any receipt"). **Verdict-only reporting: no private values, counts, hashes or prose in any report** (`BRIEF-IMPORT-GUARDS.md:89,103`). D16's census change is anticipated, not a stop; a census change on any of the other nine (all NOT TRIGGERED, `:492–517`) is a RED stop for a reviewed successor cell, never a golden regeneration.
6. **Receipt then authorized rerun.** PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word; the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and re-runs the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0 (`:96–98`; executed that way at `DECISIONS:86–87`).

**Two conditions carried into implementation**, in the shape of `DECISIONS:82`'s: **(C1)** the D16 law's control computes the due date by elapsed-millisecond addition where the product rule adds seven calendar days — it may serve as a result oracle for the September cases, never as the calendar-arithmetic oracle, and the `2026-11-01` case must be constructed from source before candidate inspection. **(C2)** the named protected surfaces for this theme are the second gate's cells, `rebuild/conform/goldens`, `tools/engine-test.jsx:8790–8793` and the seeded set-one laboratory card; expected verdict UNCHANGED, any executed difference a RED stop for a reviewed successor cell.

## 6. Open questions

**For the PM (seven).** (1) **Parent-chain order** — fix it before implementation: NATIVE-CARRIERS → B1 → B2 → B4 → B3 (recommended) or B2 first (§5.3). (2) **Witness re-pin inside the PR** — ratify the ten reviewed successor assertions in §3, or say where else they go; B1 cannot pass its own gates without them. (3) **The `plusDays` primitive** — one new declaration and one new export in `dates.cjs` (§1), the cheapest correct way to fix D21, D16, D19 and D24's `yISO`; approve or refuse explicitly, because the export surface changes. (4) **D10's reach into B2/B3 files** — the four `weeksBetween(monday, r.d) < 1` sites in `migrate.cjs:301,1203` and `writers.cjs:1560,2405` change behaviour in the spring-forward week (measured, §1); B1 edits none of them, so confirm B1 enumerates them as delta cells and B3 budgets the goldens. (5) **`policy.cjs:554`'s inline week arithmetic** — in or out of D27's hunk? In, and diet-break timing is D10-consistent; out, and `phaseArc.weeks` keeps the elapsed-hour class D10 just ruled against. Recommend in; file the siblings at `energy.cjs:523,525`, `sleep.cjs:1892` (`weekDay`) and `sleep.cjs:1934` (`nextDow`) as one new non-D item. (6) **`today.cjs:201`'s `yISO`** — measured wrong on `2026-03-09` (returns `2026-03-07`); ride in D24's hunk with a purpose-written control (recommended) or file separately. (7) **H1** — own item immediately after B1 (§4), with the proposed law supplied there if the PM rules otherwise.

**For the owner: none.** All four Batch-B rules were ruled with their exact text at `DECISIONS.md:60` and are quoted verbatim in §2 (D8, D10, D16, D25); the other six are plain Batch-A FIX approvals on the register's own recommendation. Unlike D40 (`DECISIONS:60`: "the exact tie-break rule and how the conflict is shown are NOT decided here and must be specified in the reviewed fix brief before anything is built"), no B1 rule is left open, and no B1 hunk invents a threshold, interval or policy the owner has not set. The nearest thing to a product question in B1's neighbourhood is H1's per-athlete deferral threshold — precisely why §4 recommends H1 leave this package.

**Register vs source.** Every EVIDENCE coordinate for the ten defects was checked against `ffabbca` and every one resolves to the cited declaration. Two register texts under-describe the source: D19's PLAIN (`:129`) says "day six" as if the off-by-one were only on the last day, where it is on every day of the break (§2 D19, measured); and D16's FIX (`:240`) names only the horizon, where the source also admits `sealed`/`offWindow` reads that every other read consumer excludes. One law under-specifies against its register FIX: D27's law asserts only `rung !== 'break'` where `:280` and the law's own control gate both rungs 4 and 5. Neither the register nor any law covers `today.cjs:201`'s `yISO`, `policy.cjs:554`, `sleep.cjs:1892`, `sleep.cjs:1934` or `today.cjs:564`'s `k9 * 864e5` — the five DST-unsafe siblings named in §1 and §6.
