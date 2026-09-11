# EARNED — B1 GRADING & TIME WINDOW — behaviour/delta brief **v1.1 (re-pinned onto the merged integration tree)** — PROPOSED, NOT ACCEPTED

Package **B1** (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:70–81`). Lane B builder output; research only — nothing in the repo was modified, committed or pushed by preparing it. Executed in a private worktree; `npm ci --include=dev` local, never committed.
**Base tree:** `origin/rebuild/t2-client-core` @ `87eddad7e9e7141e28ea575b3b99038eac61585a` (`87eddad`) — the NATIVE-CARRIERS merge `52a74b6` plus the lane-B briefs commit. Every line number and sha256 below was re-read on that tree.
**Supersedes** `rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW.md` (v1, 381 lines, 65 057 bytes, sha256 `f65b9b4fc3bb94485756bbbf344deadd5cba239a7d007a061fbef0db196bf5f6`), written against `ffabbca`.
**Current tip advisory:** during this pass `origin/rebuild/t2-client-core` advanced to `fb7a84eba37e8c705374234c8b8c1126b0b6efd6` (`fb7a84e`, SLICE A0 host assembly, ledger line 98). `git diff --name-only 87eddad fb7a84e -- rebuild/engine rebuild/conform rebuild/m4/spec` = **0 files**, so **every sha256 and coordinate in this brief holds unchanged at `fb7a84e`**.
**D-ids in package order:** D10 → D8 → D21 → D19 → D16 → D17 → D24 → D25 → D27 → D23 (10 defects, 20 register hours). **Modules:** `rebuild/engine/dates.cjs`, `sleep.cjs`, `policy.cjs`, `today.cjs`, plus three frozen-defect witness files (§3).

## 0.1 v1.1 changes — exactly what moved and why

1. **Base re-pinned** `ffabbca` → `87eddad`. `sleep.cjs` and `today.cjs` are now the NATIVE-CARRIERS post-images; `dates.cjs`, `policy.cjs`, all three witness files and **the whole of `rebuild/conform/` are byte-identical** (`git diff --name-only ffabbca 87eddad -- rebuild/conform` = 0 files), so every law coordinate and witness coordinate in v1 still resolves. **All nine of v1's predicted line drifts are confirmed exactly**, and the coordinates v1 did not predict are re-pinned in §0 and §2 (`writers.cjs` +27 at the `weeksBetween` sites; `progression.cjs` 408→515, 574→704). Tables in §0.
2. **CORRECTION — delegate arithmetic.** v1 said the `today.cjs` late-bound block goes 43 → 45 (carriers) → **47** (B1 adds two). Measured: 45 today, and B1's own hunks need **three** new delegates in `today.cjs` — `plusDays` (D24, D23), `phaseArc` (D27), `sleepInfo` (D23) → **48**. Also `sleep.cjs` 33 → 34 and `policy.cjs` 23 → 24 (25 with the §6 Q5 rider). Verified on the scratch build.
3. **CORRECTION — ledger citation.** The accepted artifact `295762f0…` is `rebuild/DECISIONS.md` **line 96** (line 95 is the superseded `12597632…`); at `87eddad` the file is 96 lines and there is no line 97. At the current tip `fb7a84e` line 97 records `M2-NATIVE-CARRIERS PACKAGE INTEGRATED (merge 52a74b6)` and line 98 SLICE A0.
4. **v1's red-first caveat retired, and the headline re-execution: all ten laws are still RED on the merged candidate — nothing changed because of the carriers merge.** v1 could not run the frozen half (shallow clone, `fe516c1` absent); the clone was unshallowed, `fe516c1:src/app.jsx` verified at blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`, the frozen bundle built with the repo's own recipe, so **both halves now execute** (§7): `45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR`; the ten B1 rows each `RED-frozen / RED-candidate / mutant-DETECTED` with frozen↔candidate detail+trace parity.
5. **Scratch application (discarded copy): 17 hunks apply, 10/10 laws turn GREEN, and the other 35 laws are byte-for-byte unchanged in status** (6 GREEN / 39 RED before → 16 GREEN / 29 RED after; the diff is exactly the ten). §7.
6. **ONE hunk had to change: D19's insertion anchor.** v1 said "one new line near `:541`". The literal line v1's prose implies (`const dx = _phaseSafe(() => dietExit(s), null);`) occurs **twice** (`policy.cjs:525` and `:542`), so the hunk is ambiguous as written. Fixed in §2 D19 to a two-line anchor (`:541–542`). This is **not** merge-induced — `policy.cjs` is byte-identical to `ffabbca`; the ambiguity was latent in v1 and only surfaced on execution. Every other hunk applied cleanly on the merged bytes.
7. **CORRECTION — how the frozen witnesses are re-pinned (§3, materially rewritten).** v1 recommended rewriting the ten assertions in the three witness files inside the PR. That is **wrong**: each witness file's sha256 is a pinned carrier input (`legacy-carriers.cjs ORIGINAL_PINS`, `legacy-step-efficacy-carriers.cjs:9 WITNESS_PIN = 833db043…` — the exact sha v1 quotes for `defect-witnesses-2.cjs`), and the established mechanism is an **in-memory expectation substitution** (`parent.exactReplace(source, '<old assertion>', '<new assertion>', '<edit id>', edits)`, `legacy-step-efficacy-carriers.cjs:17–18`) by a named successor child, with the file left byte-identical. §3 now specifies that instead.
8. **CORRECTION — the flip table is 18 assertions in 10 cells, not the 20-ish v1 implied.** Measured on a non-throwing observer over all three files: `defect-witnesses-2.cjs:95` does **not** flip (`calibration.includes("7-day call")` still holds — the ungraded sentence also contains the substring) and `defect-witnesses-3.cjs:41` does **not** flip (`assert.throws(genSession(s,'2026-09-03'), TypeError)` stays true; B1 fixes the caller, never `genSession`/`pickStructural`). Full old→new table in §3.
9. **New delta cell v1 missed (D27).** With the gate on `stalled`, an athlete inside an **active diet break** (`phaseArc().key === 'break'`) also stops receiving rungs 4/5: measured `theOneFix(...).rung` `break` → `hold`. Enumerated in §2 D27.
10. **§6 Q5 answered by measurement, not judgement.** The proposed `policy.cjs:554` rider (`weeks` via `weeksBetween`) is a **printed no-op**: over 360 000 `(since, today)` pairs spanning 2025–2027 (both transitions each year) `+(((mk(t)-mk(s))/DAY)/7).toFixed(1)` and `+ (Math.round((mk(t)-mk(s))/DAY)/7).toFixed(1)` differ **0 times** — `toFixed(1)` absorbs the ±0.00595-week DST error because the minimum distance from a whole-calendar-day week count to a rounding boundary is 1/140 ≈ 0.00714. So "in" changes no receipt, no golden and no `arc.weeks >= 10` decision. Recommendation "in" now costs provably nothing.
11. **CORRECTION — the bare second gate does not pass on this tree, by design.** `node rebuild/engine/test/second-gate.mjs --candidate` on `87eddad` prints `SECOND GATE candidate: FAIL` at `tools/engine-test.jsx:106` — the STEP-EFFICACY D12 expectation (`se7.resolved === false`), pre-existing and unrelated to the carriers merge (`tools/` and `energy.cjs` are byte-identical across it). `acceptance-native-carriers.json` lists `second-gate` in `coverage.covered` byChild `second-gate`. Same class: `defect-witnesses-2.cjs` fails bare at `:51` (`slopePer1k` 0.1 vs 100) and is `coverage.covered` byChild `inherited-carriers`. §3/§5.4 corrected: B1 must carry these, not expect a bare PASS.
12. **The DST-unsafe sibling class is 71 sites, not five.** `grep -cE "getTime\(\) *[-+] *[^;]*(DAY|864e5|86400000)"` over `rebuild/engine/*.cjs`: `energy 10, policy 4, seed 1, sleep 25, today 4, volume 2, writers 25` = **71**; and `setDate(` appears **0** times in the whole engine, confirming v1's "no calendar-shift primitive exists". B1 touches 4 of the 71, only inside its own hunks. §6 Q5/Q6.
13. **Parent statement** made explicit and unconditional-on-the-PM in §5.3.
Everything else — all four objections, all seven PM questions, the zero owner questions, both conditions C1/C2, the H1 recommendation — is carried forward unchanged in substance.

## 0. NATIVE-CARRIERS dependency and authority

`DECISIONS.md:93` accepted the NATIVE-CARRIERS theme; it has now **merged** (`52a74b6`, reviewed commit `84d8f28`, accepted head `dd8788e`), closed cumulative profile `rebuild/m4/spec/acceptance-native-carriers.json` sha256 `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`, receipt `DECISIONS.md:96` (the superseded `12597632…` is line 95). The ledger's predicted rewrites are confirmed byte-for-byte:

| file | sha256 @ `ffabbca` (v1) | sha256 @ `87eddad` (v1.1 pre-image) |
|---|---|---|
| `rebuild/engine/dates.cjs` | `19e9ce7e0a4b2dc770a41b2a8a722f57ad767c36b2edfe967cf866b88be3dff6` | **unchanged** |
| `rebuild/engine/policy.cjs` | `a1d21404ec52de9f7726071d60e05c0911590a417d11bf8f9076241762a3768d` | **unchanged** |
| `rebuild/engine/sleep.cjs` | `2dde4a082ba72d61f0c1cfa3c98fa8c9038d639ce5349078023874ae29cc0407` | `3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0` |
| `rebuild/engine/today.cjs` | `af4c65d2998c2fd588d6251a220262db5395e7ca5410ad36fe314826a04cbe0d` | `397532ecf20a4f5a9e1bd4a7d8d312cf5fd52058427603a7726ba512107bdbb3` |
| `rebuild/engine/test/defect-witnesses.cjs` | `557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644` | **unchanged** |
| `rebuild/engine/test/defect-witnesses-2.cjs` | `833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2` | **unchanged** |
| `rebuild/engine/test/defect-witnesses-3.cjs` | `f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6` | **unchanged** |

Adjacent pre-images B1 reads but does not edit: `constants.cjs 954e4f4b…`, `energy.cjs 4dd7195e…`, `migrate.cjs 60959d58…`, `writers.cjs 00291236…`, `progression.cjs 7031838d…`, `index.cjs 40ccc489…`. Laws and harness, all unchanged since `ffabbca`: `laws-clock-and-as-of.cjs cf177466…`, `laws-receipt-truth.cjs 871a5fca…`, `laws-state-shape-and-failure.cjs 104803f6…`, `helpers.cjs a9c03c7a…`, `run-defect-laws.cjs 2819a7e0…`, `postfix/run.cjs 654288e0…`.

**Measured drift, v1 prediction → actual (9/9 exact).** `cleanAtDate` 1014→**1017**; `sleepInfo`'s `tomorrow` 1885→**1901**; `pickStructural`'s hack gate 54→**56**; `e.id === "hack"` pendingThird 87→**92**; `dayOpen` 196→**201**; `yOpen` 202→**207**; protein block 238–244→**243–249**; `longCut` 300→**305**; the `genSession(s, d9)` call 567→**572**. `dates.cjs`/`policy.cjs` coordinates stable, as predicted. Coordinates v1 did not predict, now pinned: `nightsBefore` 1009→1012, the ledger calorie predicate `sleep.cjs:997–998`→**1000–1001**, `sleepMean3At` 1030→1033, `atSleepTarget` 1043→1046, `weekDay` 1891→**1907** (its week line `:1892`→**1908**), `nextDow` 1934→**1949**, `weeksBetween` consumers `sleep.cjs:630,803`→**633,806**, the DST-safe `Math.round` idiom `sleep.cjs:1022`→**1025**, `genSession` decl 61→**63**, `nowModelUncached` 507→**512** (`move.kind` 556→**561**, `REST DAY` 561→**566**, the `k9 * 864e5` step 564→**569**, the bare catch 574→**579**, the return 586→**591**), the quiet `hold` return 310–312→**315–317**, the diet-break title/body 302–303→**307–308**, `theOneFix`'s `nowFocus` read 276→**281**, the `"Yesterday never closed"` prose 203→**208**, the eligible-read consumer 190→**195**. In files B1 does not own: `writers.cjs` `weeksBetween(monday, r.d) < 1` 1560,2405→**1587,2432**; `cleanAtDate` consumers 538,908,913→**539,935,940**; correct `genSession` callers 875,1051→**902,1078**; `progression.cjs` `!cleanAtDate` 408,574→**515,704** (plus a third at **:91** v1 did not name); `migrate.cjs:301,1203` and `energy.cjs:84,228,523,525,1219` stable. **`cleanAtDate` has eleven product call sites, not twelve** (v1's count): `sleep.cjs:53,257,260,1903`, `writers.cjs:539,935,940`, `progression.cjs:91,515,704`, `energy.cjs:1219`.

**Authority.** `DECISIONS.md:60` — owner M2-RULE, 45/45 APPROVED-FIX; B1's four Batch-B rules (D8, D10, D16, D25) are quoted verbatim in §2, the other six are Batch-A plain FIX approvals. That line also states what it does not do: "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance". `DECISIONS.md:88` — speed plan, "batch the 39 remaining approved defect fixes"; "two-tier rigor (engine full gate; screens/plumbing one reviewer + CI)". `DECISIONS.md:94` — LANES ruling: the reviewer chat is LANE B lead, "B2 ∥ B1 → B4 → B3; FULL engine gate unchanged; the PM's own FULL run is the acceptance". `DECISIONS.md:82` (SET-ONE-ERA) is the precedent for C1/C2 in §5. `DECISIONS.md:93` C3 cites `today.cjs:92` where the plan cited `:87`: the ledger used the carriers tree, the plan used `ffabbca`; on `87eddad` it is **`:92`**, so the ledger's coordinate is now the live one, and every coordinate must still name its tree.

**Red-first status, re-executed on the merged tree (§7 for commands).** All ten laws, both engine halves: **raw RED on frozen and on candidate, repair control GREEN, every named mutant RED**, frozen↔candidate parity holding. No private fixture was needed or opened; `rebuild/conform/private/` does not exist on this tree and must not.

## 1. Package order and the ordering hypothesis (objection — carried, re-measured)

The plan's rationale (`:72`) is that "`dates.cjs/weeksBetween` (D10) is the day-arithmetic primitive D16 depends on by ruling". **The ruling half is right; the concrete half is wrong.** `policy.cjs:482` never calls `weeksBetween` — it computes `isoOf(new Date(mk(f.d).getTime() + GRADE_LAG * DAY))`. Repairing `weeksBetween` does nothing for it. The real shared need is a **calendar-day shift primitive that does not exist**: `dates.cjs:25` exports only `{ DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween }` (re-measured on the merged engine: exactly those seven, `plusDays` ABSENT), and **`setDate(` appears 0 times in all of `rebuild/engine/*.cjs`** while **71** sites step dates by milliseconds (§0.1 item 12). Four B1 sites hand-roll the same broken step — `sleep.cjs:1901` `+ DAY` (D21), `policy.cjs:482` `+ GRADE_LAG * DAY` (D16), `policy.cjs:563,573` `fmtShort(brkS.end)` where the next date is meant (D19), `today.cjs:206` `- DAY` (D24). Measured in `TZ=America/New_York`: `isoOf(mk('2026-11-01') + DAY) = '2026-11-01'` (the fall-back day never advances) and `isoOf(mk('2026-03-09') - DAY) = '2026-03-07'` (a date is skipped); the same class at window scale, `isoOf(mk('2026-03-09') - 21*DAY) = '2026-02-15'` where 21 calendar days back is `2026-02-16`. **So D10's slot should add one declaration to `dates.cjs` — `plusDays(iso, n)` on `Date.prototype.setDate` — alongside the `weeksBetween` repair, and D21/D16/D19/D24 consume it.** D10 still goes first, for a better reason than the plan gives.

Interactions inside B1, as verified: **D10 → D16** by ruling ("the day arithmetic follows D10") and by shared primitive; **D10 → D21, D19, D24** by primitive only (none of those laws reads `weeksBetween`); **D8 → D21** through `cleanAtDate`, which `sleep.cjs:1903` calls and D8 changes (a D8×D21 cross-case is required, not an argument); **D16 ∥ D17** — same function `trackRecord` (`policy.cjs:473–499`), disjoint hunks (`:479,482–483` vs `:495`), neither law reads the other's cell; **D24 → D27** because `theOneFix` reads `nowFocus(s).owed` at `today.cjs:281` and returns rung `logging` whenever anything is owed, so D24 can mask D27 entirely — order as the plan does and pin a cross-case (measured: with an unlogged night the D27 fixture returns `logging` on both engines, which is exactly the masking); **D25 ∥ D24** (different declarations; `theOneFix` reads `L.steps`, not `L.protein`); **D23 last**, as the plan says and for its stated reason — and it is the only B1 hunk that changes an error path, since the mechanism is a thrown `TypeError` swallowed by `today.cjs:579`'s bare `catch (e) {}`.

**Second ordering objection (re-measured).** D10's repair changes behaviour in files B1 does not own, via `weeksBetween`'s other call sites: `energy.cjs:84,228`, `sleep.cjs:633,806`, `migrate.cjs:301,1203`, `writers.cjs:1587,2432`. The four `< 1` weekly-window sites flip a real boundary: measured, `weeksBetween('2026-03-02','2026-03-09') = 0.994047619047619 < 1` **true → false** after the repair, so the Monday **eight** calendar days into the spring-forward week is currently counted inside the week keyed `2026-03-02` and afterwards is excluded. `migrate.cjs`/`writers.cjs` are B3's. B1 edits no byte of them but must enumerate those sites as delta cells (§2 D10), and B3's golden budget must anticipate them rather than discover them.

## 2. Per defect

Coordinates are on `87eddad`. Every quoted hunk is verbatim from that tree and was applied to a discarded scratch copy (§7). "Executed" values are from the merged candidate; `→` values are from the patched scratch copy.

### D10 — seven calendar days across a clock change ≠ a week

**Plain** (`AUDIT-REGISTER.md:109`): "The app counts seven calendar days across a clock change as slightly less or more than a week; whether a week means calendar days or elapsed hours is the owner's call." Register 107–115; BAR `:111` "none: cosmetic / internal / performance"; LIVE `:112` NOT TRIGGERED; FIX `:114`.
**Current code** — `dates.cjs:23`, file sha256 `19e9ce7e…`. `mk` (`:8`) builds a *local* midnight, so the subtraction is local elapsed milliseconds:
```js
// Copied from frozen src/app.jsx @ fe516c1:311-311.
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;
```
**Owner semantics (`DECISIONS.md:60`, verbatim):** "D10 APPROVED-FIX — date-only week counts mean 7 CALENDAR days, not 168 elapsed hours."
**Proposed behaviour.** `weeksBetween` counts calendar-date ordinals: seven distinct calendar dates apart is exactly `1` in either direction on every date including both New York transitions, and fractional weeks stay exact sevenths of a whole number of calendar days. The same hunk adds `plusDays(iso, n)`, consumed by D21/D19/D16/D24. No threshold, rounding-precision or reused export name changes.
**Proposed hunk** (`dates.cjs:23,25`). `Math.round` on the day count is the engine's own DST-safe idiom, already at `policy.cjs:503` and `sleep.cjs:1025` — not a new convention:
```js
// before
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;
return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween };
// after
const plusDays = (iso, n) => { const d = mk(iso); d.setDate(d.getDate() + n); return isoOf(d); };
const weeksBetween = (aISO, bISO) => Math.round((mk(bISO) - mk(aISO)) / DAY) / 7;
return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween, plusDays };
```
**Law** `E-D10-calendar-week-is-seven-calendar-dates` (`laws-clock-and-as-of.cjs:49`, assertion `:50` `spring === 1 && fall === 1 && reverse === -1`). **RED on the merged candidate:** `spring = 0.994047619047619`, `fall = 1.005952380952381`, `reverse = -0.994047619047619`; control GREEN; mutant `calendar-week-count-divides-local-elapsed-hours` RED. **→ GREEN on the scratch copy:** `{spring: 1, fall: 1, reverse: -1}`.
**Delta cells (executed → patched).** `weeksBetween('2026-03-08','2026-03-15')` `0.994047619047619`→`1`; `('2026-11-01','2026-11-08')` `1.005952380952381`→`1`; `('2026-03-15','2026-03-08')` `-0.994047619047619`→`-1`; `('2026-03-02','2026-03-09') < 1` `true`→`false`, which is exactly the `weeksBetween(monday, r.d) < 1` predicate at `writers.cjs:1587,2432` and `migrate.cjs:301,1203`; `energy.cjs:84,228` and `sleep.cjs:633,806` rate/fit denominators on DST-crossing intervals ±0.6 %→exact. New export `plusDays`, measured `plusDays('2026-11-01',1) = '2026-11-02'`, `plusDays('2026-03-08',1) = '2026-03-09'`.
**Must NOT change (executed, identical on both engines).** `'2026-09-03'→'2026-09-10'` `1`; `'2026-09-03'→'2026-09-06'` `0.42857142857142855`; equal arguments `0`; `'2026-01-01'→'2027-01-01'` `52.142857142857146`. `mk`, `isoOf`, `todayStart`, `daysUntil`, `fmtShort` byte-identical; no new clock read; the export set grows by exactly one name (measured both sides). **Source mutants.** (1) `round-the-week-not-the-days` — `Math.round((mk(b)-mk(a))/DAY/7)`, killed by the `09-03→09-06` control. (2) `utc-stamp-substitution` — the law's own control shape `(Date.UTC(..)-Date.UTC(..))/604800000` in product: passes the law while reinterpreting every stored local date; killed by an alias trace showing a UTC constructor. (3) `plusdays-adds-milliseconds`, killed by `plusDays('2026-11-01',1) === '2026-11-02'`. **Negative controls:** no-transition intervals of 0, 1, 3, 7, 14, 365 days; one reversed; the full export set apart from the single added name.

### D8 — an old short night is treated as today's sleep debt

**Plain** (`:89`): "The app can treat an old short night as today's sleep debt when no recent night is recorded; whether missing sleep should keep that old restriction is the owner's call." Register 87–95; LIVE `:92` NOT TRIGGERED; FIX `:94` names "`cleanAtDate` and its sleep-context consumers".
**Current code** — `sleep.cjs:1012–1021`, file sha256 `3dd34e11…`. `nights[nights.length - 1]` is the latest night *before* `iso` at any age; `DEBT_LAST_H = 6.5` (`constants.cjs:309`):
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
**Proposed behaviour.** The latest logged night counts as current only when its date is the calendar day immediately before `iso`. With no such night, the function returns the same nonblocking result the empty-history branch already returns at `:1019` — UNKNOWN, no restriction — and the three-consecutive-night mean at `:1022–1029` still runs on the nights that do exist. The "expose missing evidence distinctly" part of the register's FIX is **not** added to the boolean return: all eleven call sites treat it as a boolean and `progression.cjs:515`'s comment says so explicitly; that belongs to a surface, not this package.
**Proposed hunk** (`sleep.cjs:1020–1021`), plus `const plusDays = (...args) => E.plusDays(...args);` in the delegate block (after `:21`):
```js
  const last = nights[nights.length - 1];
+ if (last.d !== plusDays(iso, -1)) return true;   /* D8 — a night that is not LAST night carries no current restriction */
  if (last.h < DEBT_LAST_H) return false;
```
**Law** `D-D8-stale-sleep-does-not-claim-current-debt` (`laws-clock-and-as-of.cjs:23`, assertion `:24` `missing === true && stale === missing && recentShort === false`). **RED on the merged candidate:** `{missing: true, stale: false, recentShort: false}`; control GREEN; mutant `last-logged-night-stands-in-for-last-calendar-night` RED. **→ GREEN:** `{missing: true, stale: true, recentShort: false}`.
**Delta cells (executed → patched).** `cleanAtDate({nights:[{d:'2026-01-01',h:5}]}, '2026-09-03')` `false`→`true`; the same flip at 2 days old (`2026-09-01`, 5 h) and 3 days old (`2026-08-31`, 5 h) `false`→`true`. Downstream the same flip removes a phantom debt at `progression.cjs:91,515,704` and `sleep.cjs:53,257,260` (`debt = !cleanAtDate(...)`), stops stale-evidence refusals at `writers.cjs:539,935,940`, and makes `energy.cjs:1219`'s `slept` true in the stale case.
**Must NOT change (executed, identical on both engines).** last night 5 h → `false`; 6.4 h → `false`; 6.5 h (the `DEBT_LAST_H` boundary) → `true`; 8 h → `true`; empty history → `true`; a night dated on or after `iso` → `true`; three 7 h nights ending last night → `true`; three 6.6 h nights ending last night → `false` (the mean-3 branch still runs); `sleepMean3At` (`:1033`) and `atSleepTarget` (`:1046`) byte-identical. **Source mutants.** (1) `stale-night-returns-false` (inverted guard) — turns unknown into restriction; killed by `stale === missing`. (2) `age-window-instead-of-last-night` — `if (daysBetween(last.d, iso) > 7) return true`; killed by the executed 2- and 3-day-old cases above. (3) `drop-the-three-night-mean` — returning `true` before `:1022`; killed by the three-6.6 h control.

### D21 — sleep called clean on the fall-back date after a short night

**Plain** (`:139`): "On the day the clocks move back, the app can call sleep clean even after a short night logged for that day." Register 137–145; FIX `:144` "Advance to the next calendar date instead of adding a fixed twenty-four hours." **Owner semantics:** none specific; Batch-A plain FIX at `DECISIONS.md:60`; it inherits D8's rule through `cleanAtDate`.
**Current code** — `sleep.cjs:1899–1905` (same file sha as D8):
```js
function sleepInfo(s) {
  const n = s.sleep.nights;
  const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at, clean: cleanAtDate(s, tomorrow), last: n[n.length - 1], need: s.sleep.needed };
}
```
**Proposed behaviour.** `sleepInfo` asks about the next *calendar* date, so the night logged on the fall-back date is inside the window it is meant to be inside. `run`, `atTarget`, `last` and `need` keep their existing sources. **Proposed hunk** (`sleep.cjs:1901`): `const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));` → `const tomorrow = plusDays(isoOf(todayStart()), 1);`
**Law** `E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date` (`laws-clock-and-as-of.cjs:105`, assertion `:107` `r.clean === false && r.clean === cleanAtDate(s,'2026-11-02')`). **RED on the merged candidate:** at `clock.today() = '2026-11-01'` with a 1 h night on `2026-11-01`, `sleepInfo(s).clean = true` while `cleanAtDate(s,'2026-11-02') = false`; the cause, measured, is `isoOf(new Date(mk('2026-11-01').getTime() + 86400000)) === '2026-11-01'`. Control GREEN; mutant `tomorrow-is-exactly-twenty-four-hours-later` RED. **→ GREEN.** After D8's hunk the law's state still satisfies `last.d === plusDays('2026-11-02', -1)`, so D8 does not neutralise D21 — proved by the patched scratch copy carrying **both** hunks and the law still GREEN.
**Delta cells (executed → patched).** `sleepInfo(s).clean` with a short same-date night: `2026-11-01` `true`→`false`, `2027-11-07` `true`→`false`, `2025-11-02` `true`→`false`; downstream `recoveryIndex`/`bodyAlarm`/Today's SLEEP lever on those dates.
**Must NOT change (executed, identical on both engines).** `2026-09-03` (ordinary) already `false`; `2026-03-08` (spring-forward) already `false`; `sleepInfo`'s other four cells identical on every date tested (`{run:0, atTarget:false, last:{d:<day>,h:1}, need:3}`). **Source mutants.** (1) `tomorrow-is-plus-two-days` — passes the law's single assertion but breaks under D8; killed by the D8×D21 cross-case. (2) `use-today-instead-of-tomorrow` (`plusDays(iso,0)`) — killed directly. (3) `hardcode-fallback-date` via `getTimezoneOffset` — killed by requiring the ordinary and spring-forward controls byte-identical *and* the two other fall-back years to pass.

### D19 — break-end wording resumes the cut while the break is active

**Plain** (`:129`): "The app says a seven-day break is on day six and the cut resumes today while today is still inside the break." Register 127–135; FIX `:134` "Keep the existing inclusive active interval and derive one-based day numbering and next-day resumption wording from it. … **The frozen phase receipt string changes in both line and next.when**". **Owner semantics:** none specific; Batch-A plain FIX.
**Current code** — `policy.cjs`, file sha256 `a1d21404…` (coordinates unchanged from v1). `BREAK_LEN_DAYS = 7` (`constants.cjs:303`); `daysBetween` (`policy.cjs:503`) is `Math.round((mk(b) - mk(a)) / DAY)` and is already DST-safe:
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
**Proposed behaviour.** The interval is inclusive at both ends, so the day number is one-based and the cut resumes the calendar date *after* `brk.end`. `dietBreakState`'s returned fields do not change — `daysSince` stays the zero-based offset every other consumer reads — and the numbering and resumption date are derived in `phaseArc` where the prose is composed, which is the register's own instruction and matches the law's control, which patches `phaseArc` only.
**Proposed hunk — FIXED IN v1.1** (`policy.cjs:541–542,563,573`). v1's single-line anchor was ambiguous (`const dx = _phaseSafe(() => dietExit(s), null);` occurs at both `:525` and `:542`); the insertion is anchored on the `brkS` binding it depends on:
```js
  const brkS = (deps && deps.brk) || dietBreakState(s, deps);              // :541 unchanged, anchor
+ const resumeISO = brkS.end ? plusDays(brkS.end, 1) : null;               /* D19 — an inclusive last active day resumes the NEXT date */
  const dx = _phaseSafe(() => dietExit(s), null);                          // :542 unchanged, anchor
- when: `resumes ${fmtShort(brkS.end)}`,                                   // :563
+ when: `resumes ${fmtShort(resumeISO)}`,
- ? `Diet break — day ${brkS.daysSince} of ${BREAK_LEN_DAYS}, ${brkS.daysLeft} to go. Eating at maintenance; the cut resumes ${fmtShort(brkS.end)}.`
+ ? `Diet break — day ${brkS.daysSince + 1} of ${BREAK_LEN_DAYS}, ${brkS.daysLeft} to go. Eating at maintenance; the cut resumes ${fmtShort(resumeISO)}.`
```
plus `const plusDays = (...args) => E.plusDays(...args);` in `policy.cjs`'s delegate block (after `:16`). **Law** `P-D19-inclusive-break-end-prose-agrees-with-active-day` (`laws-clock-and-as-of.cjs:91`, assertion `:94` `b.status==='active' && p.line.includes('day 7 of 7') && p.line.includes('resumes '+fmtShort('2026-09-08')) && p.next.when==='resumes '+fmtShort('2026-09-08')`). **RED on the merged candidate → GREEN on the scratch copy**; control GREEN; mutant `zero-based-break-day-and-same-date-resumption` RED. Break `2026-09-01`–`2026-09-07`; `fmtShort('2026-09-07')='Mon 9/7'`, `fmtShort('2026-09-08')='Tue 9/8'`:

| `today` | `daysSince` | current `line` | → patched `line` |
|---|---|---|---|
| `2026-09-01` | 0 | `… day 0 of 7, 6 to go. … resumes Mon 9/7.` | `… day 1 of 7, 6 to go. … resumes Tue 9/8.` |
| `2026-09-04` | 3 | `… day 3 of 7, 3 to go. … resumes Mon 9/7.` | `… day 4 of 7, 3 to go. … resumes Tue 9/8.` |
| `2026-09-07` | 6 | `… day 6 of 7, 0 to go. … resumes Mon 9/7.` | `… day 7 of 7, 0 to go. … resumes Tue 9/8.` |
| `2026-09-08` | — | `status = recent`, `key = cut`, break prose gone | identical |

The off-by-one is on **every** day of the break, not only the last — the register's PLAIN under-describes it. `next.when` `'resumes Mon 9/7'`→`'resumes Tue 9/8'` on all three active days. A break ending on a fall-back date is the mutant-2 control and is measured: end `2026-11-01` → `resumes Sun 11/1` becomes `resumes Mon 11/2`.
**Must NOT change (executed, identical on both engines).** `dietBreakState`'s complete return on all four statuses (e.g. `2026-09-08` → `{status:"recent", start:"2026-09-01", end:"2026-09-07", startsIn:0, daysLeft:0, daysSince:1}`); `daysLeft`; `phaseArc`'s `line` for `cut`/`maintenance`/`leangain` (executed both sides: `Cut — week 12.1. Next: maintenance hold (when you and your coach call it — no date).`); the `proposed` branch's `starts ${fmtShort(brkS.start)}` at `:560` (executed `starts Thu 9/10`); `weeks`, `since`, `key`, `label`, `toneKey`, `order`, `sup`. **Source mutants.** (1) `shift-daysSince-in-dietBreakState` — `+ 1` inside `:531`: passes the `line` assertion but changes `daysSince` for `phaseSupervisor` and every other consumer; killed by the `dietBreakState` return pin. (2) `resume-plus-one-millisecond-day` — killed by the fall-back-end break above. (3) `off-by-one-both-ends` (also bumping `BREAK_LEN_DAYS` to 8) — killed by asserting the literal `of 7`.

### D16 — a month-late weigh-in grades a 7-day forecast hit

**Plain** (`:235`): "The app calls a forecast a seven-day success using a weigh-in from a month later; the owner must choose how late a reading may be." Register 233–241. **LIVE `:238` TRIGGERED** — one of only three LIVE-triggered defects in the remainder (`:506`; summary `:487–535`). FIX `:240` "Require an eligible read inside the owner-ruled forecast horizon before recording a hit. Estimate 4 hours. The historical hit totals and calibration receipt change".
**Current code** — `policy.cjs:473–484` (`GRADE_LAG = 7`, `constants.cjs:289`). Two independent faults: `actualTrendAt` has **no upper bound**, and the reads filter applies **no eligibility test** — `sealed`/`offWindow` reads are admitted, unlike every other read consumer (`migrate.cjs:301`, `writers.cjs:1587,2432`, `today.cjs:195`):
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
**Law** `E-D16-seven-day-forecast-does-not-grade-a-month-late-read` (`laws-receipt-truth.cjs:8`, assertion `:12`). **RED on the merged candidate → GREEN on the scratch copy**; control GREEN; mutant `first-later-read-has-no-horizon-limit` RED. Executed, forecast `d='2026-08-01'`, `pred7=165`, one read `pt=165`:

| read date | merged `{graded, hit, hits}` | → patched |
|---|---|---|
| `2026-08-07` (pre-due) | `{0, null, 0}` | identical |
| `2026-08-08` (due) | `{1, true, 1}` | identical |
| `2026-08-09` (grace) | `{1, true, 1}` | identical |
| `2026-08-10` | `{1, true, 1}` | **`{0, null, 0}`** |
| `2026-09-01` | `{1, true, 1}` | **`{0, null, 0}`** |
| `2026-08-08` + `sealed` | `{1, true, 1}` | **`{0, null, 0}`** |
| `2026-08-08` + `offWindow` | `{1, true, 1}` | **`{0, null, 0}`** |

**CONDITION (C1), per the `DECISIONS:82` D30 precedent — now with the purpose-written case executed.** The law's control (`laws-receipt-truth.cjs:13–17`) computes `due = mk(f.d).getTime() + 7*DAY` and filters `mk(r.d) >= due && <= due + DAY` — elapsed-millisecond arithmetic the product rule must not use. Measured divergence: for a forecast dated `2026-11-01`, `isoOf(mk + 7*DAY)` is `'2026-11-07'` while the seventh calendar day is `'2026-11-08'`. Executed, forecast `2026-11-01`: read `11-07` merged `{1,true}` → patched **`{0,null}`** (it is only the sixth calendar day); `11-08` `{1,true}` → `{1,true}`; `11-09` `{1,true}` → `{1,true}`; `11-10` `{1,true}` → **`{0,null}`**. **The control may serve as a result oracle for the September cases, never as the calendar-arithmetic oracle**; this `2026-11-01` case was constructed from source before candidate inspection and is the C1 evidence cell.
**Delta cells.** `graded`, `hits`, `misses`, `mae`, `cleanStreak`, `hasMiss` and the **calibration receipt string** (`policy.cjs:497`) all move wherever a historical forecast was graded by a late or ineligible read. Executed no-read baseline, identical on both engines: `graded = 0`, `calibration = "No 7-day calls have come due yet — the record fills as each prediction ages into an outcome."` LIVE is TRIGGERED, so a private-census change **is** anticipated here, verdict-only (§5).
**Must NOT change.** Due-day and grace-day hits (`08-08`, `08-09`); the pre-due ungraded row (`08-07`) byte-identical; `tol` derivation (`:476–477`); `decisions` (that is D17); row field names and order; `rows.slice(-TRACK_ROWS)`. **Source mutants.** (1) `ungraded-counts-as-miss` — contradicts "UNGRADED, not a miss"; killed by the `08-10` row's `miss:false`. (2) `grace-window-is-two-days` — killed by the `08-10` cell. (3) `drop-the-eligibility-filter` — horizon without `!sealed && !offWindow`; killed by the executed sealed- and offWindow-on-the-due-day cells. (4) `calendar-add-by-milliseconds` — the control's own arithmetic in product; killed by the `2026-11-01` C1 case.

### D17 — an undone adjustment is still reported as applied

**Plain** (`:245`): "The app says an adjustment is still applied after the athlete has undone it." Register 243–251; FIX `:250` "Include the existing undone flag when deriving whether the adjustment is applied. … Decision-history status changes without rewriting stored receipt text". **Owner semantics:** none specific; Batch-A plain FIX.
**Current code** — `policy.cjs:494–495`:
```js
  const decisions = ((s && s.adjustments) || []).filter((a) => a && a.rid && (String(a.rid).indexOf("ap_") === 0 || String(a.rid).indexOf("apauto_") === 0))
    .slice(-8).map((a) => ({ d: a.d, title: a.title, applied: !a.dismissed, auto: !!a.auto }));
```
**Proposed behaviour.** `applied` is false when the adjustment was dismissed **or** undone; the row stays in history with its stored title and date, and no stored record is rewritten. **Proposed hunk** (`policy.cjs:495`): `applied: !a.dismissed` → `applied: !a.dismissed && !a.undone`.
**Law** `E-D17-undone-adjustment-is-not-described-as-applied` (`laws-receipt-truth.cjs:27`, assertion `:29` `r.decisions.length===1 && r.decisions[0].applied===false`). **RED on the merged candidate:** `undone:true` → `[{"d":"2026-09-03","title":"X","applied":true,"auto":false}]`. Control GREEN; mutant `applied-means-only-not-dismissed` RED. **→ GREEN:** `applied:false`.
**Delta cells (executed → patched).** `undone:true` `applied true`→`false`; `undone:true, auto:true` `applied true`→`false` with `auto:true` preserved. Nothing else moves — the hunk is one operator.
**Must NOT change (executed, identical on both engines).** `dismissed:true` → `applied:false`; neither flag → `applied:true`; both flags → `applied:false`; `d`, `title`, `auto`, the `rid` prefix filter, `slice(-8)`, `decisions.length === 1`. **Source mutants.** (1) `drop-undone-rows` — violates "stays in decision history"; killed by `decisions.length===1`. (2) `undone-means-auto` — killed by the `auto` pin. (3) `applied-always-false` — killed by the neither-flag control.

### D24 — yesterday marked complete though its food is missing

**Plain** (`:255`): "The app says yesterday is complete after only steps were entered even though the ledger still says yesterday's food is missing." Register 253–261; FIX `:260` "Use the same calorie-completeness predicate for yesterday that the existing ledger and today checks use." **Owner semantics:** none specific; Batch-A plain FIX.
**Current code** — `today.cjs:200–207`, file sha256 `397532ec…`. `:201` uses the calorie predicate for *today*; `:207` uses bare key presence for *yesterday*. The ledger uses the calorie predicate too, at `sleep.cjs:1000–1001`:
```js
  const dl = (s.dailyLogs || {})[tISO];
  const dayOpen = !dl || dl.cal == null;
...
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
```
**Proposed behaviour.** Yesterday is open when its row is absent **or** has no calories — the identical predicate today and the ledger already use. The label and `why` prose at `:208` do not change.
**Proposed hunk** (`today.cjs:206–207`), plus the `plusDays` delegate:
```js
- const yISO = isoOf(new Date(todayStart().getTime() - DAY));
- const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
+ const yISO = plusDays(isoOf(todayStart()), -1);
+ const yRow = (s.dailyLogs || {})[yISO];   /* D24 — the SAME calorie predicate as today (:201) and the ledger (sleep.cjs:1001) */
+ const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && (!yRow || yRow.cal == null);
```
The `yISO` line is included because `-DAY` from local midnight is itself broken the day after spring-forward: measured, `isoOf(new Date(mk('2026-03-09').getTime() - 86400000))` is `'2026-03-07'`, two calendar days back, and the patched value is `'2026-03-08'`. **That is not in the register and has no law**; it is one line inside D24's own hunk and the minimal D24 fix is wrong on that date without it, so it rides here with the purpose-written control below — flagged in §6 Q6.
**Law** `E-D24-partial-yesterday-remains-owed-until-calories-are-present` (`laws-receipt-truth.cjs:40`, assertion `:42`). **RED on the merged candidate:** with `dailyLogs = {'2026-09-01':{cal:2000},'2026-09-02':{steps:10000}}` at `today = 2026-09-03`, `nowFocus(s,12).owed` keys are `["night"]` — no `yesterday` — while `owedLedger(s,12)` does list `2026-09-02` as open. Control GREEN; mutant `any-yesterday-row-counts-as-complete` RED. **→ GREEN:** `["night","yesterday"]`.
**Delta cells (executed → patched).** `owed` `["night"]`→`["night","yesterday"]` for a steps-only yesterday; `owed.length` `1`→`2` and `lead.more` increments with it (`clear` was already `false` in that state because the night is owed); the same flip in the calendar case at `today = 2026-03-09` with `2026-03-08` steps-only, `["night"]`→`["night","yesterday"]` — which the pre-patch `yISO` gets wrong twice over. Through `theOneFix` (`today.cjs:281`) rung `logging` now fires in states that previously fell through — which is why D24 precedes D27.
**Must NOT change (executed, identical on both engines).** No yesterday row at all → `["night","yesterday"]`; yesterday complete (`{cal:2000}`) → `["night"]`; empty `dailyLogs` → `["night"]` (the `Object.keys(...).length > 0` guard); yesterday with `cal` but no `pro` → `["night"]` (the over-owe control); `owedLedger`'s rows byte-identical (`["2026-08-31","2026-09-02"]` in the law's state); `dayOpen`, `eveningFrom`, the `phase` word (`MIDDAY`). **Source mutants.** (1) `require-every-field` (`|| yRow.pro==null || yRow.steps==null`) — over-owes; killed by the `cal`-but-no-`pro` control. (2) `drop-the-empty-ledger-guard` — killed by the empty-`dailyLogs` control. (3) `yesterday-by-milliseconds` — killed by the `2026-03-09` calendar control.

### D25 — protein reads "good" on a sole missed day

**Plain** (`:265`): "The app calls protein good when the only recorded day misses the target; whether one forgiven miss should apply immediately is the owner's call." Register 263–271; BAR `:267` "none: cosmetic / internal / performance"; FIX `:270` "Require at least one successful observation before the one-miss allowance can produce good. … The status changes while the existing 0/1 detail stays truthful".
**Current code** — `today.cjs:243–249`. With one row and zero hits, `0 >= 1 - 1` is true → `good`:
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
**Proposed behaviour.** `good` requires at least one successful day inside the existing seven-logged-days window, in addition to the existing one-miss allowance. Window, `slice(-7)`, `proteinHit`, `proteinTarget`, the `N/M` detail string and the `quiet` branch are untouched. **Proposed hunk** (`today.cjs:249`): `state: proHitN >= proRows.length - 1 ? "good" : "caution"` → `state: proHitN >= 1 && proHitN >= proRows.length - 1 ? "good" : "caution"`.
**Law** `E-D25-zero-protein-successes-cannot-be-a-good-protein-read` (`laws-receipt-truth.cjs:53`, assertion `:55`). **RED on the merged candidate:** `proteinTarget(state()).lo = 170`; sole day `pro:0` → `{"label":"PROTEIN","state":"good","detail":"0/1"}`. Control GREEN; mutant `one-miss-allowance-permits-zero-successes` RED. **→ GREEN:** `state:"caution"`, `detail:"0/1"` unchanged.
**Delta cells.** Exactly one, executed: `fiveLevers(s).protein.state` for `proHitN === 0 && proRows.length === 1`: `good`→`caution`. `detail` stays `"0/1"`; `list[1] === protein` object identity holds on both engines (the control at `:56` relies on it).
**Must NOT change (executed, identical on both engines).** `1/1`→`good`; `0/2`→`caution` (already, `0 >= 1` false); `1/2`→`good`; `6/7`→`good`; no `pro` rows → `{state:"quiet", detail:"counting only"}`; `deficit`, `training`, `sleep`, `steps` all `quiet` on both sides. **Source mutants.** (1) `require-a-majority` (`proHitN*2 >= proRows.length`) — killed by `1/2` and `6/7`. (2) `drop-the-one-miss-allowance` (`proHitN === proRows.length`) — killed by `6/7`. (3) `zero-rows-becomes-caution` — killed by the no-rows control.

### D27 — an athlete at maintenance is told a long cut has stalled

**Plain** (`:275`): "The app tells an athlete already at maintenance that a long calorie cut has stalled and a diet break is due." Register 273–281; FIX `:280` "Gate stalled-cut advice on the committed phase and derive long-cut duration from that phase's recorded start. Estimate 3 hours. The inappropriate instruction disappears; phase/Today golden receipts can change." **Owner semantics:** none specific; Batch-A plain FIX.
**Current code** — `today.cjs:303–311`. `weekDay()` (`sleep.cjs:1907–1910`) is the *global* programme week from `START`, not the committed phase; the committed phase lives at `policy.cjs:543` and its start at `:552–554`:
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
**Proposed behaviour.** Rungs 4 and 5 — the diet-break advice and the calorie-trim advice — apply only when the committed phase is a calorie cut, and the long-cut duration comes from that phase's own recorded start rather than the global programme clock. A committed maintenance or lean-gain athlete falls through to the existing quiet `hold` return at `:315–317`; no new prose is authored. The gate goes on `stalled`, not on `longCut`, because the register says "stalled-cut advice" (plural rungs) and the law's control (`laws-receipt-truth.cjs:69`) gates **both** `break` and `calories`; gating only `longCut` would leave a maintenance athlete told to trim calories — the same defect one rung down. **The law's single assertion under-specifies this; follow the register and the control.**
**Proposed hunk** (`today.cjs:303–305`) plus `const phaseArc = (...args) => E.phaseArc(...args);` in the delegate block. `index.cjs:3–20` registers `policy.cjs` (13) before `today.cjs` (14), `sleep.cjs` already delegates `phaseArc` at `:36`, and `policy.cjs`/`sleep.cjs` contain no reference to `E.theOneFix`, `E.fiveLevers`, `E.nowFocus` or `E.nowModel` — re-verified on the merged tree, so this adds no cycle:
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
**Law** `P-D27-maintenance-is-not-described-as-a-long-stalled-cut` (`laws-receipt-truth.cjs:66`, assertion `:68`). **RED on the merged candidate:** with the law's own fixture (`plan.phase='maintenance'`, one read, three 8 h nights, three flat weekly rows) `phaseArc(s) = {key:'maintenance', weeks:12.1}`, `weekDay() = {wk:13,day:86}`, `currentRate = {measured:true, scale:0}`, `cutRateBand.floor = 0.9`, and `theOneFix(s)` returns `rung='break'`, `title="A diet break has earned its place"`, body starting `"You've held the deficit for weeks"`. Control GREEN; mutant `global-programme-week-substitutes-for-committed-cut` RED. **→ GREEN:** `{rung:"hold", lever:null, state:"good", title:"Nothing to fix — hold the line"}`.
**`arc.weeks` carries D10's arithmetic class.** `policy.cjs:554` is `+(((mk(today) - mk(since)) / DAY) / 7).toFixed(1)` — the same elapsed-millisecond week computation D10 rules on, hand-rolled instead of calling `weeksBetween`, which D10's hunk does not reach. v1 proposed one further line inside D27's hunk — `policy.cjs:554` → `const weeks = +weeksBetween(since, today).toFixed(1);` (plus a `weeksBetween` delegate in `policy.cjs`) — and **v1.1 measures it as a printed no-op** (§0.1 item 10), so it is a free consistency edit, not a behaviour change. §6 Q5. `energy.cjs:523,525` and `sleep.cjs:1908,1949` carry the same class and are outside B1's modules.
**Delta cells (executed → patched).** `plan.phase='maintenance'`: `rung` `break`→`hold`, `lever` `DEFICIT`→`null`, `state` `caution`→`good`, `title`→`"Nothing to fix — hold the line"`, `body`→the quiet body at `:317`. Identically for `plan.phase='leangain'`. **New in v1.1:** an athlete inside an **active diet break** (`plan.brk` covering today, so `phaseArc().key === 'break'`) also falls through: `theOneFix(...).rung` `break`→`hold` — correct (they are already at maintenance) but not enumerated in v1, and it is the cell that kills mutant (2). Through `nowModelUncached:561`, `move.kind` flips from `fix` to `rate` or `quiet` and `move.title`/`body` change — a Today golden surface. With `policy.cjs:554` included, `phaseArc(...).line` and `weeks` are **unchanged** (measured: 0 differences over 360 000 date pairs).
**Must NOT change (executed, identical on both engines).** `plan.phase='cut'` with the same flat trend still returns `rung='break'`, `title="A diet break has earned its place"` — the load-bearing negative control. `plan.phase` absent (→ `key='cut'` by `policy.cjs:550`'s `else`) likewise `rung='break'`. Rungs 1–3 unchanged in every phase (measured: a maintenance athlete with only a 4 h night still returns `logging`); `phaseArc`'s return apart from `weeks` (which is itself unchanged). **Source mutants.** (1) `gate-longcut-only` — passes the law but leaves rung `calories` for a maintenance athlete; killed by a purpose-written case asserting `rung==='hold'`. (2) `read-plan-phase-directly` (`s.plan.phase === 'cut'`) — ignores `phaseArc`'s `brk.status==='active'` (`:547`) and `exitStarted` (`:549`) precedence, so an athlete inside a diet break still gets break advice; killed by the executed `brk`-active cell above. (3) `gate-on-programme-week-and-phase` — keeping `weekDay().wk >= 10` alongside `onCut`; killed by a committed cut under 10 weeks old inside a programme week ≥ 10 (must be `calories`, not `break`).

### D23 — a scheduled lower-body workout shows as a rest day

**Plain** (`:349`): "The app shows a rest day when a lower-body workout is scheduled and its first-use weight is ready." Register 347–355; FIX `:354` "Supply the required sleep input when deriving the next workout and distinguish a failed derivation from a rest day. Estimate 2 hours. Workout title and date change from the false rest fallback". **Owner semantics:** none specific; Batch-A plain FIX.
**Current code** — the three coordinates the register cites, re-pinned to `today.cjs:56,572,579`:
```js
// :53-56  pickStructural
function pickStructural(s, iso, slp) {
  const dt = dayType(iso, s);
  const candidates = s.queue.filter((q) => !q.done && q.state !== "PROPOSED" && (q.kind === "debut" || q.kind === "unlock") && q.exId && exActive(s, q.exId) && exById(s, q.exId) && exById(s, q.exId).day === dt);
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
// :566-579  nowModelUncached
  let workout = { title: "REST DAY", sub: "Recovery is training too — the next session is on its way.", today: false };
  try {
    for (let k9 = 0; k9 < 7; k9++) {
      const d9 = isoOf(new Date(todayStart().getTime() + k9 * 864e5));
      ...
        const sess9 = genSession(s, d9);
  } catch (e) {}
```
`genSession(s, d9)` omits its third parameter `slp` (declared `:63`); `pickStructural:56` then reads `slp.last` and throws; the bare `catch (e) {}` swallows it and the `REST DAY` initialiser survives. The short-circuit `q.exId === "hack" && slp.last` means the throw occurs **only** when a hack debut/unlock candidate exists — which is why the law is named for the hack debut. `writers.cjs:902,1078` pass `slp` correctly; `today.cjs:572` is the only omission.
**Proposed behaviour.** The next-workout loop supplies the sleep context `genSession` requires, and a derivation that still fails is distinguished from a genuine rest day: the bare catch is narrowed to the loop body so a failure on one candidate day does not abandon the remaining six, and the `REST DAY` initialiser survives only when no scheduled U/L day was found at all. No new prose; no change to `pickStructural`'s hack gate (that is H1, §4) or to `genSession`'s body.
**Proposed hunk** (`today.cjs:567–579`) plus `const sleepInfo = (...args) => E.sleepInfo(...args);` in the delegate block. `index.cjs` registers `sleep.cjs` (11) before `today.cjs` (14) and `sleep.cjs` references no `today.cjs` export — re-verified — so no cycle:
```js
+ const slp9 = (() => { try { return sleepInfo(s); } catch (e) { return { last: null }; } })();   /* D23 — genSession REQUIRES its sleep input (:63,:56) */
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
**Law** `E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day` (`laws-state-shape-and-failure.cjs:21`, assertion `:25`). **RED on the merged candidate:** `genSession(s,'2026-09-03',{last:null}).name = 'LOWER'`; `genSession(s,'2026-09-03')` **throws** `TypeError: Cannot read properties of undefined (reading 'last')`; `nowModel(...).workout = {"title":"REST DAY","today":false}` with `iso` absent. Control GREEN; mutant `missing-sleep-argument-falls-through-to-rest-day` RED. **→ GREEN:** `{"title":"LOWER BODY · TODAY","today":true,"iso":"2026-09-03"}`.
**Delta cells (executed → patched).** `nowModel(...).workout` for a ready hack debut on a scheduled L day: `{title:"REST DAY", today:false}` (no `iso`) → `{title:"LOWER BODY · TODAY", sub:<beats>, today:true, iso:"2026-09-03"}`. Same flip on a fall-back date (`clock.today()='2026-11-01'`: `REST DAY` → `LOWER BODY · TODAY`, `iso:"2026-11-01"`). **The 4.5 h hack deferral still applies and is measured on both engines:** with `sleepInfo(s).last = {d:'2026-09-02',h:3}`, `pickStructural` returns `{main:null, riders:[], deferred:["hack"]}` on merged and patched alike — only the surrounding `workout` changes (`REST DAY` → `LOWER BODY · TODAY`), which is the designed behaviour and the negative control that kills mutant (1). Through `nowModelUncached:591` this is a Today golden surface.
**Must NOT change (executed, identical on both engines).** Non-hack debut on a scheduled L day: `{"title":"LOWER BODY · TODAY","today":true,"iso":"2026-09-03"}`, and `genSession(s,'2026-09-03')` does **not** throw for it (`null`); a genuine rest week (empty `split` map): `{"title":"REST DAY","sub":"Recovery is training too — the next session is on its way.","today":false}` byte-identical with `iso` still absent; `pickStructural`'s complete `{main, riders, deferred}` partition on every input tested; `genSession`'s three-argument behaviour, including the `TypeError` it still throws when called with two (`defect-witnesses-3.cjs:41`, §3). **Source mutants.** (1) `default-slp-to-empty-object` (`slp = {}` in the signature) — stops the throw and passes the law but silently makes every hack debut pass the 4.5 h gate; killed by the executed `last.h = 3` deferral cell. (2) `remove-the-catch` — a throw now escapes `nowModel`; killed by a throwing-accessor state that must still produce a model. (3) `rest-day-on-any-failure` — keeping the outer catch and only adding `slp`; killed by a state where the first scheduled day throws and a later one does not. (4) `week-step-by-milliseconds` — killed by the executed fall-back-date scan.

## 3. Golden and receipt surfaces, and how to re-pin the frozen witnesses (materially corrected)

Register FIX warnings, cited: D10 `:114`; D8 `:94`; D21 `:144`; **D19 `:134` "The frozen phase receipt string changes in both line and next.when"**; D16 `:240`; D17 `:250` "without rewriting stored receipt text"; D24 `:260`; D25 `:270`; D27 `:280`; D23 `:354`. The exact strings at risk, re-pinned: `policy.cjs:573` and `:563` (the break line and `next.when`), `policy.cjs:497` (calibration), `today.cjs:208` (`"Yesterday never closed"`), `today.cjs:566` (`REST DAY`), `today.cjs:307–308` (diet-break title/body).

**The three frozen-defect witness gates are the concrete blocker, and the plan does not mention them.** `rebuild/conform/v4/postfix/run.cjs:13` declares `witnesses-1`…`witnesses-7` over `rebuild/engine/test/defect-witnesses*.cjs`. Measured on a non-throwing observer, B1 flips **18 assertions in 10 witness cells**:

| file:line | assertion (merged value) → reviewed successor (patched value) |
|---|---|
| `defect-witnesses.cjs:61` | `cleanAtDate({nights:[{d:"2026-01-01",h:5}]},"2026-09-03")` `false` → `true` |
| `defect-witnesses.cjs:71,72` | `weeksBetween('2026-03-08','2026-03-15') ≈ 167/168` and `('2026-11-01','2026-11-08') ≈ 169/168` → `=== 1` both |
| `defect-witnesses-2.cjs:93,94` | `r.graded` `1`→`0`; `r.rows[0].hit` `true`→`null` (**`:95` does NOT flip** — `calibration.includes("7-day call")` holds either way) |
| `defect-witnesses-2.cjs:103` | `r.decisions[0].applied` `true`→`false` |
| `defect-witnesses-2.cjs:127,128` | `line.includes("day 6 of 7, 0 to go")` `true`→`false`; `next.when` `"resumes Mon 9/7"`→`"resumes Tue 9/8"` |
| `defect-witnesses-2.cjs:159` | `sleepInfo(s).clean` `true`→`false` |
| `defect-witnesses-3.cjs:48,49,50` | `workout.title` `"REST DAY"`→`"LOWER BODY · TODAY"`; `today` `false`→`true`; `iso` `undefined`→`"2026-09-03"` (**`:41` does NOT flip** — `assert.throws(() => genSession(s,'2026-09-03'), TypeError)` still holds; B1 fixes the caller) |
| `defect-witnesses-3.cjs:58,59` | `focus.clear` `true`→`false`; `owed.some(k==='yesterday')` `false`→`true` (`:64` unchanged) |
| `defect-witnesses-3.cjs:72` | `fiveLevers(s).protein.state` `"good"`→`"caution"` |
| `defect-witnesses-3.cjs:100,101,102` | `fix.rung` `"break"`→`"hold"`; `fix.title` → `"Nothing to fix — hold the line"`; `body.startsWith("You've held the deficit for weeks")` `true`→`false` |

**Recommendation — CORRECTED. Do NOT rewrite the witness files. Re-pin by expectation substitution in a named successor child, exactly as the accepted parents already do.** Evidence on this tree: (a) each witness file's sha256 is a pinned carrier input — `legacy-carriers.cjs ORIGINAL_PINS`, and `legacy-step-efficacy-carriers.cjs:9 WITNESS_PIN = '833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2'`, the exact sha of `defect-witnesses-2.cjs`; editing a byte fails `STEP-WITNESS-ORIGINAL-PIN` / `STEP-CARRIER-ORIGINAL-PIN`. (b) The mechanism already in use, `legacy-step-efficacy-carriers.cjs:17–18`, is in-memory text substitution of the assertion with the file untouched:
```js
source = parent.exactReplace(source,'assert.equal(step.slopePer1k, 100);','assert.equal(step.slopePer1k, 0.1);','D12-slope',edits);
source = parent.exactReplace(source,'assert.equal(step.resolved, false);','assert.equal(step.resolved, true);','D12-resolved',edits);
```
(c) `acceptance-native-carriers.json` routes such a gate away from bare execution: `coverage.covered = ["merge-source","migrate-differential","migrate-source","second-gate","witnesses-2","witnesses-5","witnesses-7","writers-differential","writers-source"]` with `coverage.byChild["witnesses-2"] = "inherited-carriers"`, while **`coverage.run` still contains `witnesses-1` and `witnesses-3`** — the two files B1 flips that are currently re-executed bare. `native-carriers-package.cjs:76–81` enforces "a gate is either covered or run, never both" over all 19.
**So B1's package must:** author `rebuild/conform/v4/postfix/legacy-b1-carriers.cjs` as the closed successor of `legacy-step-efficacy-carriers.cjs`, adding `defect-witnesses` and `defect-witnesses-3` to `CARRIER_IDS` with their original sha256s (`557c12e7…`, `f5169beb…`) as new pins and the 18 `exactReplace` substitutions above; extend the `defect-witnesses-2` preparation with its six; add a child `rebuild/m4/spec/b1-inherited-carriers.cjs` (or extend the inherited one) with its own declared verdict line; and **move `witnesses-1` and `witnesses-3` from `coverage.run` to `coverage.covered`** with `byChild` naming that child. Every witness stays **byte-identical**, every substitution is one enumerated assertion, and the printed counts `DEFECT WITNESSES: 10`, `DEFECT WITNESSES 2: 11`, `DEFECT WITNESSES 3: 5` stay exactly as they are (the `inherited-carriers` child asserts the `11/11` tail literally).
**Two bare-run facts the PM should know before reading any gate log.** On `87eddad`, with the gate env (`TZ=America/New_York MEASURED_TEST_NOW=2026-09-03`): `defect-witnesses.cjs` exit 0 `10/10`; `defect-witnesses-3.cjs` exit 0 `5/5`; **`defect-witnesses-2.cjs` exit 1** at `:51` (`slopePer1k` `0.1` vs `100`) and **`second-gate.mjs --candidate` FAIL** at `tools/engine-test.jsx:106` (`se7.resolved === false`). Both are the STEP-EFFICACY D12 repair, pre-existing and unrelated to the carriers merge, and both are already `coverage.covered`. B1 must not "fix" either and must not expect a bare PASS from them.

Anything that is a frozen *tool or golden* rather than a witness — `rebuild/conform/goldens`, `tools/engine-test.jsx` — is **not** re-pinned by B1. Per the D30 condition at `DECISIONS:82` an executed difference at a protected surface is "a RED stop for a reviewed successor cell, never a golden regeneration". B1 names its protected surfaces as UNCHANGED and must prove it by execution: the P6 cells `tools/engine-test.jsx:8790–8793`, the seeded set-one laboratory card, and the public census/goldens NATIVE-CARRIERS proved identical for legacy-only inputs (`DECISIONS:93`).

## 4. H1 — the per-athlete "hack" special case

`DECISIONS.md:93` C3, verbatim: "today.cjs:92 `e.id === "hack"` is an inherited per-athlete special case (violates per-athlete setup, never one athlete's defaults) — recorded as register item H1 for Track B, byte-untouched here". On `87eddad` that coordinate is live at **`today.cjs:92`**; the sibling the plan cites (`:9`) is **`today.cjs:56`**:
```js
// :56 pickStructural
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
// :92 genSession
    else if (e.id === "hack" && e.pendingThird && isDebutNow) { tgt = [...targetsFor(e, s), Math.max(8, e.hi - 3)]; note = "DEBUT — third set banks whatever it gives"; }
```
H1 has no D-id, no v4 law and no register entry (`PLAN…v1.md:150` says so; re-confirmed on `87eddad` — no `H1` in `AUDIT-REGISTER.md` and no `H1` law in `rebuild/conform/v4/laws-*.cjs`).

**Recommendation: H1 does NOT ride in B1; it gets its own item, scheduled immediately after.** (1) It is a different kind of change: B1's ten defects are all "the engine computes the wrong value from the data it has", while H1 is "the engine hard-codes one athlete's exercise id into a policy", and the repair is a *schema* change — the 4.5 h deferral and the third-set rule must move onto the exercise record (a per-lift field beside the already-existing `e.pendingThird`), reaching `seed.cjs`, `migrate.cjs` and Dad's first-run setup (`PLAN-SLICE-v1.md` DONE item 6, "never Joe's defaults"): three modules and one track B1 does not own. (2) It collides with D23's hunk: D23 fixes the *caller* of `:56` while H1 rewrites the *predicate* on that line, and landing both makes D23's mutant `default-slp-to-empty-object` unkillable, because after H1 there may be no `slp.last` read on that line at all — the executed negative control proving D23 did not weaken the sleep gate (`deferred:["hack"]` at `last.h = 3`, §2 D23) stops existing. (3) It is the one thing near B1 that could need the owner — whether Dad's lift inherits Joe's 4.5 h threshold or gets a per-athlete default is a product rule, and B1 should have no owner question (§6).

**If the PM rules that H1 rides in B1**, the purpose-written law should assert identity-independence, not a new number: `H-H1-structural-deferral-and-third-set-follow-the-lift-record-not-an-athlete-id` · family `engine` · **"Two lifts with identical records except their `id` receive identical structural deferral and identical debut targets: renaming the lift whose record carries the short-sleep deferral and the pending third set from `"hack"` to any other id must not change `pickStructural`'s `{main, riders, deferred}` partition or `genSession`'s `ex[i].tgt` and `ex[i].note`; and a lift whose record carries neither must not receive either behaviour under any id."** Mutant: `athlete-specific-lift-id-decides-policy`. That is RED today by construction — measured on the merged engine, the same record under id `hack` yields `deferred:["hack"]` at `last.h = 3` while under id `legpress` it is picked as `main` — and it introduces no new threshold, so it smuggles no product decision into a law.

## 5. Acceptance bar for B1

From PLAN §3 (`:121–132`), made specific.
1. **Brief** — this document (v1.1), accepted by the PM as a `rebuild/DECISIONS.md` ledger line before implementation, exactly as `DECISIONS:85` did for LOAD-WRITES: naming the path, byte count and sha256, recording the conditions, and stating that no product acceptance follows.
2. **Closed cumulative profile** `rebuild/m4/spec/acceptance-b1-grading-time-window.json`, bound by sha256, carrying `authorizations { owner = DECISIONS:60, contract = DECISIONS:49, theme = the PM's acceptance line for this brief by sha256, review claim POSTFIX-ACCEPTANCE M2-B1-GRADING-TIME-WINDOW … ACCEPTED }` (the accepted parent's own `authorizations` keys are exactly `owner, contract, theme, review` — matched). Runner `rebuild/m4/spec/b1-grading-package.cjs`, shaped like `native-carriers-package.cjs`, with `assert(args.length===1&&['--full','--ci'].includes(args[0]))` at the same position (`native-carriers-package.cjs:9`) and **no third mode**. `run.cjs`'s 19-entry `GATES` inventory (`:9–23`) unchanged; the artifact's `gates` array stays the same 19 names, with `witnesses-1`/`witnesses-3` moved from `coverage.run` to `coverage.covered` (§3).
3. **Parent artifact — stated, with the PM's choice preserved.** The chain on disk is `acceptance-import-guards.json → acceptance-step-efficacy.json → acceptance-load-writes.json 5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82 → acceptance-native-carriers.json 295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`; the last link is verified from the merged artifact's own `parent` block, which names `rebuild/m4/spec/acceptance-load-writes.json` `5073977b…` and its receipt line, so `295762f0…` is now the chain head. **If the PM rules B1 first, B1's closed cumulative profile's immutable parent is `rebuild/m4/spec/acceptance-native-carriers.json` sha256 `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` (receipt `DECISIONS.md:96`, reviewed commit `84d8f28`, integration merge `52a74b6`, ledger line 97 at the current tip) — recommended chain NATIVE-CARRIERS → B1 → B2 → B4 → B3. If the PM rules B2 first, B1's parent is instead the accepted B2 artifact and every pre-image sha in §0/§2 is re-taken at that head.** Lane B has no preference beyond "decide once and hold it"; `rebuild/lanes/REQUESTS.md:3` already asks, and **PLAN §4.3 (`:146`) proposes B2 → B1 while §2 (`:113`) and `DECISIONS:94` say "B2 ∥ B1"** — incompatible, because a single-parent immutable chain cannot have two heads, so one of B1/B2 must re-pin. Decide before implementation: cheap now, expensive later.
4. **What the FULL run must show.** All 45 register laws executed: **D10, D8, D21, D19, D16, D17, D24, D25, D27, D23 GREEN on the candidate and RED on the frozen engine**; the other 35 still raw RED with approved preservation deltas only (`BRIEF-IMPORT-GUARDS.md:87`) — v1.1 measured that the other 35 do not move at all under B1's hunks (§7). All 19 gates OBSERVED/PASS with `witnesses-1/-2/-3` and `second-gate` **carried by named successor children** on their reviewed successor assertions, not bare (§3). **Own bites:** one disclosed source bite quoting its RED line, then exact byte/sha restoration and a restored-GREEN direct gate, plus one unlisted receipt/input-field delta bite proving the comparator fails closed (`:88`). **Real fault mutants** — the 31 named in §2 — each killing its behavioural case in every applicable cell; "a source-pin refusal, syntax error, missing target or timeout earns no kill" (same line). **Fidelity diff:** no source change outside §2's enumerated hunks (4 engine files, 17 hunks, 3+1+2 new delegate lines); `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md` (`:99`).
5. **Cloud (`--ci`) vs the owner's PC (`--full`).** `--ci` runs focused tests, review controls, browser package, profile refusals, source carriers, traces, direct, inherited carriers, witnesses, legacy differential and the second gate; `native-carriers-package.cjs:2–3` is explicit that "CI is explicitly public evidence only". **PC only:** everything reaching `rebuild/conform/private/live.json`. `run.cjs:115–117` hard-requires that file and the private `live.main` golden for `migrate-full` and fails `REQUIRED-PRIVATE-PREPARATION-MISSING` without them; that directory does not exist in the repo and must not. So the whole `--full` run, the three-blob oracle in both Date modes, **the LIVE predicate re-evaluation for D16** (B1's only LIVE-TRIGGERED defect, `AUDIT-REGISTER.md:238,506`) and every `POSTFIX PACKAGE PASS` are the PM's own execution on the PC (`DECISIONS:92`; `:93` C4). **Verdict-only reporting: no private values, counts, hashes or prose in any report** (`BRIEF-IMPORT-GUARDS.md:89,103`). D16's census change is anticipated, not a stop; a census change on any of the other nine (all NOT TRIGGERED, `:492–517`) is a RED stop for a reviewed successor cell, never a golden regeneration.
6. **Receipt then authorized rerun.** PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word (`native-carriers-package.cjs:85–86`); the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and re-runs the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0 (executed that way at `DECISIONS:86–87` and again at `:95–96`, where `16413b1` was superseded by `84d8f28` after the artifact was re-sealed).

**Two conditions carried into implementation**, in the shape of `DECISIONS:82`'s: **(C1)** the D16 law's control computes the due date by elapsed-millisecond addition where the product rule adds seven calendar days — it may serve as a result oracle for the September cases, never as the calendar-arithmetic oracle; the `2026-11-01` case was constructed from source before candidate inspection and its four executed cells are in §2 D16. **(C2)** the named protected surfaces for this theme are the second gate's cells, `rebuild/conform/goldens`, `tools/engine-test.jsx:8790–8793` and the seeded set-one laboratory card; expected verdict UNCHANGED, any executed difference a RED stop for a reviewed successor cell.

## 6. Open questions

**For the PM (seven, unchanged in substance; three now carry measured answers).** (1) **Parent-chain order** — fix it before implementation: NATIVE-CARRIERS → B1 → B2 → B4 → B3 (recommended) or B2 first (§5.3). (2) **Witness re-pin** — ratify the 18 reviewed successor assertions in §3 **and the mechanism**: a `legacy-b1-carriers.cjs` successor with `exactReplace` substitutions plus `witnesses-1`/`witnesses-3` moved into `coverage.covered`, the witness files byte-untouched. B1 cannot pass its own gates without this. (3) **The `plusDays` primitive** — one new declaration and one new export in `dates.cjs` (§1), the cheapest correct way to fix D21, D16, D19 and D24's `yISO`; approve or refuse explicitly, because the export surface changes (measured: seven names → eight, nothing else). (4) **D10's reach into B2/B3 files** — the four `weeksBetween(monday, r.d) < 1` sites in `migrate.cjs:301,1203` and `writers.cjs:1587,2432` change behaviour in the spring-forward week (measured `true`→`false`, §1); B1 edits none of them, so confirm B1 enumerates them as delta cells and B3 budgets the goldens. (5) **`policy.cjs:554`'s inline week arithmetic** — in or out of D27's hunk? **Measured answer: it is a printed no-op** (0 differences over 360 000 date pairs), so "in" buys D10-consistency for free and changes no receipt or golden. Recommend **in**; file the siblings as one new non-D item — and note the class is **71 millisecond-stepped date sites across 7 engine modules with zero `setDate` uses anywhere**, not the four or five v1 named (`energy 10, policy 4, seed 1, sleep 25, today 4, volume 2, writers 25`), including window-scale errors such as `isoOf(mk('2026-03-09') - 21*DAY) = '2026-02-15'` where 21 calendar days back is `2026-02-16`. (6) **`today.cjs:206`'s `yISO`** — measured wrong on `2026-03-09` (returns `2026-03-07`; patched `2026-03-08`); ride in D24's hunk with the executed control (recommended) or file separately. (7) **H1** — own item immediately after B1 (§4), with the proposed law supplied there if the PM rules otherwise.

**For the owner: none.** All four Batch-B rules were ruled with their exact text at `DECISIONS.md:60` and are quoted verbatim in §2 (D8, D10, D16, D25); the other six are plain Batch-A FIX approvals on the register's own recommendation. Unlike D40 (`DECISIONS:60`: "the exact tie-break rule and how the conflict is shown are NOT decided here and must be specified in the reviewed fix brief before anything is built"), no B1 rule is left open, and no B1 hunk invents a threshold, interval or policy the owner has not set. The nearest thing to a product question in B1's neighbourhood is H1's per-athlete deferral threshold — precisely why §4 recommends H1 leave this package.

**Register vs source.** Every EVIDENCE coordinate for the ten defects was re-checked against `87eddad` and every one resolves to the cited declaration. Two register texts under-describe the source: D19's PLAIN (`:129`) says "day six" as if the off-by-one were only on the last day, where it is on every day of the break (§2 D19, measured on four days); and D16's FIX (`:240`) names only the horizon, where the source also admits `sealed`/`offWindow` reads that every other read consumer excludes (§2 D16, both measured). One law under-specifies against its register FIX: D27's law asserts only `rung !== 'break'` where `:280` and the law's own control gate both rungs 4 and 5. Neither the register nor any law covers `today.cjs:206`'s `yISO`, `policy.cjs:554`, `sleep.cjs:1908`, `sleep.cjs:1949`, `today.cjs:569`'s `k9 * 864e5` or the remaining 66 sites of the same class (§6 Q5).

## 7. Executed evidence — commands and outcomes

Worktree `git worktree add <wt> origin/rebuild/t2-client-core` at `87eddad`; `npm ci --include=dev` in that worktree (44 packages, never committed); `git fetch --unshallow` on the shared clone to obtain `fe516c1` (blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`, verified by `helpers.cjs:17`'s own check); the frozen bundle built with the repo's own recipe (`esbuild` over `tools/_engine-entry.mjs` + `src/app.jsx.__test` at `fe516c1`, 813 751 bytes) into the scratchpad, **never into the repo**.

1. `TZ=America/New_York ENGINE_MAIN=<bundle> node rebuild/conform/v4/run-defect-laws.cjs` → `TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR`. The ten B1 rows: each `RED-frozen / RED-candidate / mutant-DETECTED` (which the runner only prints when frozen↔candidate detail **and** call-trace parity hold). The 6 laws already GREEN on the candidate are D12, D33, D34, D35, D41, D43 — none of them B1's.
2. Per-law B1 harness over `bundle('candidate')` and `bundle('frozen')` with `execute`/`control`/`mutants` from `run-defect-laws.cjs`: **candidate 10 RED-raw, 10/10 controls GREEN, 10/10 mutants RED; frozen identical.** Detail values quoted per defect in §2.
3. **Discarded scratch copy** (`cp -r <wt>/rebuild <scratch>/rebuild`, never in the tree that will be committed): all §2 hunks applied by exact-string replacement with a match-count assertion per hunk — **17 hunks applied, 0 failures** after the D19 anchor fix (the first attempt failed exactly once, on `D19-resumeISO-binding: expected 1 match, found 2`). All four edited modules re-`require`d cleanly.
4. Same per-law harness against the scratch copy: **0 RED-raw, 10 GREEN-raw, 10/10 controls GREEN** (the named mutants also report GREEN there, because a mutant restores `__auditOriginal`, which after the repair *is* the repaired function — mutant kills are meaningful only pre-repair).
5. All 45 laws on merged vs patched: merged `6 GREEN / 39 RED`, patched `16 GREEN / 29 RED`, and the status diff is **exactly the ten B1 defects** — no other law moves.
6. Frozen-witness observer (a non-throwing `assert` shim over all three files, both engines): merged 21/40/24 assertions all passing except the pre-existing `defect-witnesses-2.cjs:51–53` D12 cell; patched, the **18** assertions in §3's table flip, and no others.
7. Delta-cell and negative-control probe, **117 measured cells per engine** (§2's "executed" and "must NOT change" values): **46 rows differ** — 41 substantive and every one inside §2's enumerated delta list (D10 8, D8 3, D21 3, D19 7, D16 6, D17 2, D24 5, D25 1, D27 3, D23 3), plus 5 `cleanAtDate(<day> +1cal)` rows that are probe artifacts of `plusDays` being absent on the merged side. The other 71 rows are identical, and they are the negative controls quoted per defect.
8. Bare gate probes with the gate env: `defect-witnesses.cjs` exit 0 `10/10`; `defect-witnesses-3.cjs` exit 0 `5/5`; `defect-witnesses-2.cjs` exit 1 at `:51`; `second-gate.mjs --candidate` FAIL at `tools/engine-test.jsx:106` — the last two pre-existing and `coverage.covered` (§3). Arithmetic proofs: 360 000 `(since, today)` pairs for the §6 Q5 rider (0 printed differences); `71` millisecond-stepped date sites and `0` `setDate` uses across `rebuild/engine/*.cjs`.

No private data was read: `rebuild/conform/private/` does not exist on this tree, `ledger/` was never opened, and nothing in the repository was modified, committed or pushed.
