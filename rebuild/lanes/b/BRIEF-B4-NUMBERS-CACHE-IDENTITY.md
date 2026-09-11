# EARNED — B4 NUMBERS & CACHE IDENTITY — behaviour/delta brief **v1** — PROPOSED, NOT ACCEPTED

Package **B4** (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:104–112`). Lane B builder output; **research only** — nothing in the repo was modified, committed or pushed by preparing it. Executed in a private worktree (`git worktree add … origin/rebuild/t2-client-core`) plus two discarded scratch copies; `npm ci --include=dev` local (37 packages), never committed. No private data: `rebuild/conform/private/` does not exist on this tree and must not; `ledger/` was never opened.

**Base — two trees, stated explicitly because B4's files come from two heads.**
| file | taken from | sha256 | bytes / lines |
|---|---|---|---|
| `rebuild/engine/energy.cjs` | tip `origin/rebuild/t2-client-core` @ **`8205b7f`** | `4dd7195e51d207bd4b8f4e09db066fd6b4fcb954a85efa4e097d4f06a587fffc` | 94 493 / 1 245 |
| `rebuild/engine/today.cjs` | **B1 head `b54ba14`** | `f8d0397abd75c02dd570741191124c32e26ab850702607826943d4394fda2e00` | 47 093 / 641 |
| `rebuild/engine/policy.cjs` | **B1 head `b54ba14`** | `4d6c244efa6b34daed02e194dbbd5b7064abcde2d93fd28974a5f2df519187e1` | 56 859 / 830 |

**Why two heads, and why this is safe.** `git diff --name-only 8205b7f b54ba14 -- rebuild/engine rebuild/conform rebuild/m4/spec` = exactly six paths, all B1's own (`dates.cjs`, `policy.cjs`, `sleep.cjs`, `today.cjs`, `conform/v4/postfix/legacy-b1-carriers.cjs`, `engine/test/b1-delta-cells.cjs`). `energy.cjs` is **byte-identical at both heads** (`4dd7195e…`), so B4's three `energy.cjs` defects carry no B1 dependency at all; only D26's one-line `today.cjs` hunk is written against post-B1 bytes. Adjacent pre-images read but not edited, at `b54ba14`: `dates.cjs b51f3f1e…` (1 343 B), `sleep.cjs 77ced98c…` (185 554 B), `constants.cjs 954e4f4b…`, `index.cjs 40ccc489…`. Laws and harness unchanged from B1's pins: `laws-cache-identity.cjs`, `laws-numeric-values-and-units.cjs`, `laws-clock-and-as-of.cjs`, `helpers.cjs`, `run-defect-laws.cjs`.

**Parent chain (stated, PM to confirm).** `acceptance-import-guards.json → acceptance-step-efficacy.json → acceptance-load-writes.json 5073977b…` (receipt `DECISIONS.md:86`) `→ acceptance-native-carriers.json 295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` (receipt `DECISIONS.md:96`, merged `DECISIONS.md:97`) `→` **the accepted B1 artifact** `rebuild/m4/spec/acceptance-b1-grading-time-window.json` (sha256 not yet minted; B1's brief §5.2). **B4's immutable parent is that B1 artifact.** If the PM rules B2 before B1 (`PLAN…v1.md:146` vs `:113` and `DECISIONS:94`, still incompatible — B1 v1.2 §A6.6), B4's parent is whatever artifact B1 itself re-pins onto, and only B4's `today.cjs`/`policy.cjs` pre-image shas are re-taken; `energy.cjs`'s does not move.

**Authority.** `DECISIONS.md:60` — owner M2-RULE, 45/45 APPROVED-FIX. **All six of B4's defects are plain Batch-A FIX approvals** (`D11 APPROVED-FIX · D13 APPROVED-FIX · D14 APPROVED-FIX · D15 APPROVED-FIX · D20 APPROVED-FIX · D26 APPROVED-FIX`, quoted from that line); **none of the seven Batch-B rules falls in B4**, so no owner sentence constrains any hunk here and B4 asks the owner nothing (§6). That line also states its limit: "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance". `DECISIONS.md:88` — batch the 39 remaining fixes, two-tier rigor. `DECISIONS.md:94` — LANES: "B2 ∥ B1 → B4 → B3; FULL engine gate unchanged; the PM's own FULL run is the acceptance". `DECISIONS.md:100` — the lane runs the FULL gate itself and hands the PM a verdict; speculative authoring allowed, nothing merges before acceptance. `DECISIONS.md:97` — standing rule from the PM's own FULL: every engine-package builder and reviewer runs `--full` WITHOUT the private fixture and reports the `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` terminal line.

**Red-first status, executed on the post-B1 base (§7 for commands).** All six laws: **RED-frozen / RED-candidate / repair-control GREEN / named mutant RED**, with frozen↔candidate detail **and** call-trace parity on every one. Totals on the post-B1 base: `TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR` — reproducing B1 v1.2 §A1's headline independently, from a bundle built in this session.

---

## 1. Package order, and three objections to the plan

**Objection 1 — the plan's register citations for the LIVE dispositions are wrong.** `PLAN…v1.md:111` says "D13/D20/D26 are all NOT APPLICABLE to LIVE (register :499,504,512)". Read on this tree, `AUDIT-REGISTER.md:499` is **D9**, `:504` is **D14**, `:512` is **D22**. The correct rows are **`:503` (D13), `:510` (D20), `:516` (D26)**, each `NOT APPLICABLE` with its own reason in parentheses. The substance holds; the citation does not, and a brief that cites it unchecked would carry the error into the artifact.

**Objection 2 — B4's product diff does not touch `policy.cjs` at all.** `PLAN…v1.md:107` lists "`policy.cjs` (forecast cache only)". Measured: `_forecastCached` (`policy.cjs:272`, post-B1) is `memoOnState((s) => forecastUncached(s))` — it inherits its key from `energy.cjs`'s primitive. Repairing the primitive (D13) turns **D20 GREEN with zero `policy.cjs` bytes changed** (executed: caches-only tree, §7 item 5). **B4's diff is two files — `energy.cjs` and `today.cjs` — five hunks.** The plan should be corrected; `policy.cjs` stays a *read* dependency and a pre-image pin.

**Objection 3 — the plan's ordering rationale is measurably false, though the order is still right.** `PLAN…v1.md:106` says the three value repairs must precede the cache repairs "because D20 and D26 both consume `memoOnState` … and their expectations change once D11/D14/D15 change the memoized values". Executed on two separate scratch trees:

| tree | D11 | D14 | D15 | D13 | D20 | D26 |
|---|---|---|---|---|---|---|
| values-only (D14, D11, D15 hunks) | **GREEN** | **GREEN** | **GREEN** | RED | RED | RED |
| caches-only (D13, D26 hunks) | RED | RED | RED | **GREEN** | **GREEN** | **GREEN** |

The two halves are **fully independent**: neither cache law's fixture exercises `observedTDEE`, `currentRate` or `energyAvailability` (D13's reads `energyDensity`; D20's substitutes six deps including `currentRate` and `observedTDEE` outright at `defect-witnesses-2.cjs:138–144`; D26's is the default `state()` with no reads at all). **Keep the order for two better reasons:** (a) the value hunks change `energyAvailability`'s and `observedTDEE`'s *printed* numbers and the cache hunks change *which* printed numbers survive a write — landing values first means each golden surface is re-pinned once, not twice; (b) **D13 is the only cache hunk**, so it must precede its two consumers' verification, exactly as the plan says at the end of `:106`.

**Interactions inside B4, as verified.** **D14 → D11** through `currentRate` — `observedTDEE` reads `r.lo`/`r.hi`/`r.scale` at `energy.cjs:436,449–450`; D14 repairs `r.fat`, which `observedTDEE` never reads, so the coupling is nominal and measured to be nil (the values-only tree moves both laws with no shared cell). **D11 → D15** none (`energyAvailability` computes its own intake; it does not call `observedTDEE`). **D13 → D20, D26** by the shared primitive, one direction only. **D15 ∥ everything** — `energyAvailability`'s only B4 neighbour is the memo in `_ebtMemo`'s downstream, and `energyBalanceTarget` does not read `energyAvailability`. **D13 reaches a fourth memo the register does not name**: `_ebtMemo` (`energy.cjs:678`). That is enumerated as a delta (§2 D13), not smuggled.

---

## 2. Per defect, in package order

Coordinates are post-B1 (`energy.cjs` identical at the tip). Quoted hunks are verbatim from that tree; "executed" values are from the post-B1 base, "→" values from the patched scratch copy (§7).

### D14 — an invalid fat-loss rate where a default exists

**Plain** (`AUDIT-REGISTER.md:191`): "The app can show an invalid fat-loss rate when a missing model setting already has a defined default, when the rate should use that same default." Register 189–197; BAR `:193` "untrue value or receipt the athlete sees"; LIVE `:194` NOT TRIGGERED (also `:504`); FIX `:196` "use `dripOf(s)` in both measured-return branches instead of reading `s.model.drip` directly. Estimate 1 hour. No receipt template changes; any raw-rate or downstream census path that formerly carried NaN may change."

**Current code** — `energy.cjs:286` and `:302`, file sha256 `4dd7195e…`. The default already exists three hundred lines above, at `:21`:
```js
// :21   function dripOf(s) { const d = s && s.model ? s.model.drip : null; return d == null ? DRIP_DEFAULT : d; }   // DRIP_DEFAULT = 0.0 (constants.cjs:68)
// :285-287  regression branch
      return {
        scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates,
        method: "regression", n, ci, lo: +(scale - ci).toFixed(2), hi: +(scale + ci).toFixed(2),
// :302  snapshots branch
    return { scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates, method: "snapshots", n: recent.length, ci: null };
```
*Register-vs-source note:* the register's EVIDENCE cites `energy.cjs:285,301`; on this tree those are the `return {` and `const scale = …` lines and the `fat:` expressions are at **`:286` and `:302`**. One line early, same declarations.

**Proposed behaviour.** Both measured branches obtain the drip through the one accessor that already owns the default, so a state with no `model.drip` yields a finite `fat` equal to the value an explicit `drip: 0` produces, and a state with **no `model` object at all** stops throwing. No threshold, no template, no other field.
**Proposed hunk** (two one-token replacements; `dripOf` is declared in the same module, no new delegate):
```js
- scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates,                     // :286
+ scale, fat: +(scale + dripOf(s)).toFixed(2), measured: true, rates,
- return { scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates, method: "snapshots", n: recent.length, ci: null };   // :302
+ return { scale, fat: +(scale + dripOf(s)).toFixed(2), measured: true, rates, method: "snapshots", n: recent.length, ci: null };
```
**Law** `E-D14-current-rate-uses-missing-drip-default` (`laws-numeric-values-and-units.cjs:35`, assertion `:36` `def === 0 && Number.isFinite(out.fat) && out.fat === explicit.fat && out.scale === explicit.scale`). **RED on the post-B1 base:** `missing = {scale:1, fat:NaN, measured:true, method:"snapshots", n:2, ci:null}` (JSON renders `NaN` as `null`), `explicit.fat = 1`, `def = 0`; control GREEN; mutant `fat-rate-adds-undefined-drip-directly` RED. **→ GREEN:** `missing.fat = 1`.
**Delta cells (executed → patched).** snapshots branch, `model` without `drip`: `currentRate(s).fat` **NaN → 1**. Regression branch (20 daily reads, `model` without `drip`): `fat` **NaN → 0.7**. `model` absent entirely: `currentRate(s)` **throws `TypeError: Cannot read properties of undefined (reading 'drip')` → returns `fat = 1`** — a removed crash the register does not name. Reach: `currentRate` has **20 non-delegate call sites outside `energy.cjs`** (`policy.cjs`, `sleep.cjs`, `today.cjs`, `writers.cjs`); every one that prints or compares `r.fat` stops seeing NaN.
**Must NOT change (executed, identical on both engines).** `scale` in both branches (`1`, `0.7`); `method`; explicit `drip: 0.1` → `fat = 0.8`; `dripOf(s) = 0` for a `model` without `drip`; the unmeasured prior branch `{scale:1, fat:1.25, measured:false, method:"prior"}` (`:304`, a literal — untouched); `r.ci`, `r.lo`, `r.hi`, `sigma`, `rho1`, `from`/`to`/`span`.
**Named source mutants (all executed, all killed).** (1) `default-the-drip-to-the-band-low` (`DRIP_LO` for `dripOf(s)`) — **the law does NOT kill it**: the law's own oracle `explicit = currentRate({...s, model:{...s.model, drip:0}})` recomputes *through the mutated function*, so both sides agree. Killed only by the named cell `currentRate(snapshotState).fat === 1` (mutant: `0.65`). (2) `fix-only-the-snapshots-branch` (revert `:286`) — **the law does NOT kill it**: the law's fixture takes the `snapshots` branch (`method:"snapshots"`), so `:286` has **no law coverage at all**. Killed by the regression cell (`fat` NaN vs `0.7`). (3) `coerce-instead-of-default` (`(s.model.drip || 0)`) — passes the law and every value cell; killed only by the no-`model` cell (throws). **Both law weaknesses are contract items: D14's two named cells are required package artifacts, not conveniences.**
**Negative controls.** Explicit `drip` at `0`, `0.1`, `-0.35` (`DRIP_LO`) and `0.10` (`DRIP_HI`); the prior branch; `dripOf` itself (`sleep.cjs:674`'s simulator use of `s.model.drip` is **outside B4** and untouched — see §6 Q4).

### D11 — the maintenance interval inverts, and zero activity drift is called meaningful

**Plain** (`:171`): "The app can show a lower maintenance estimate above its upper estimate while calling unchanged activity a meaningful change, when the range should stay ordered and no activity change should mean no adjustment." Register 169–177; BAR `:173`; LIVE `:174` NOT TRIGGERED (also `:501`); FIX `:176` "transform both interval endpoints consistently through the existing rate-to-energy calculation, order them, and compute promotion from a nonnegative halfwidth. Estimate 3 hours. The `stepsWhy` receipt embeds the interval and promotion claim and must be regenerated consistently; affected numerical/prose goldens change."

**Current code** — `energy.cjs:436–450, 474, 478`. `kcal` is monotone increasing (`ed.perLb > 0`), and `tdee` is computed with **no** zero clamp; only the lower endpoint gets one:
```js
  const RAW = r.scale; const CEIL = 3.0; const fatWk = Math.min(CEIL, RAW);
  const kcal = (f) => Math.round(avg + (f * ed.perLb) / 7);
  const tdee = kcal(fatWk);
  const lo = r.ci != null ? kcal(Math.min(CEIL, Math.max(0, r.lo))) : null;   // :449
  const hi = r.ci != null ? kcal(Math.min(CEIL, r.hi)) : null;                // :450
  const _halfw = (isFinite(hi) && isFinite(lo)) ? Math.round((hi - lo) / 2) : null;                                  // :474
  const stepPromoted = stepDelta != null && _halfw != null && Math.abs(stepDelta * (1 - STEP_COMP_HI)) > _halfw;     // :478
```
**The mechanism, measured.** Whenever `r.lo < 0` — a gaining athlete, or a loss rate whose CI straddles zero — `Math.max(0, r.lo)` lifts the lower endpoint to the intake average while the upper endpoint keeps the true rate. On the law's gaining fixture that gives `lo = 2000 > hi = 1620 = tdee`, so `_halfw = -190` and `Math.abs(0 × 0.7) = 0 > -190` is **true**: a *zero* step drift promotes an adjusted headline out of a negative halfwidth.
**Proposed behaviour.** Both endpoints pass through the same `kcal ∘ min(CEIL, ·)` as the point estimate. The ceiling, `clamped`, `RATE_DP`, `STEP_COMP_LO/HI`, the promotion comparison and the receipt template are untouched; `:474` and `:478` become correct by construction.
**Proposed hunk** (`energy.cjs:449`, one token removed):
```js
- const lo = r.ci != null ? kcal(Math.min(CEIL, Math.max(0, r.lo))) : null;
+ const lo = r.ci != null ? kcal(Math.min(CEIL, r.lo)) : null;   /* D11 — BOTH endpoints through the same rate-to-energy transform as tdee */
```
**Objection — the register's "order them" is already true and an explicit `Math.min`/`Math.max` would be a hunk with no detector.** `ci = +(1.96 · se · 7).toFixed(2)` with `se = Math.max(seHac, seOls) ≥ 0` (`:273, :284`), so `r.lo ≤ r.scale ≤ r.hi` on every reachable state; `min(CEIL, ·)` and `kcal` are both monotone non-decreasing, so `lo ≤ tdee ≤ hi` follows. Adding `Math.min(_e1,_e2)` / `Math.max(_e1,_e2)` would therefore be two lines no cell, law, witness or mutant could distinguish — the dual of the refusal `BRIEF-IMPORT-GUARDS.md:88` forbids earning a kill from. **Recommendation: minimal hunk; §6 Q1 puts the choice to the PM with this measurement attached.**
**Law** `E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted` (`laws-numeric-values-and-units.cjs:9`, assertion `:10` `r.lo <= r.tdee && r.tdee <= r.hi && r.lo <= r.hi && r.stepDelta === 0 && r.stepPromoted === false`). **RED on the post-B1 base:** `{lo:2000, tdee:1620, hi:1620, stepDelta:0, stepPromoted:true}`; control GREEN; mutant `clamp-only-lower-endpoint-to-zero` RED. **→ GREEN:** `{lo:1620, tdee:1620, hi:1620, stepDelta:0, stepPromoted:false}`.
**Delta cells (executed → patched).** Gaining fixture: `lo` `2000`→`1620`; `stepPromoted` `true`→`false`; `stepsWhy` length `615`→`605` (the `±${_halfw}` clause). **Loss with a CI that straddles zero** (15 noisy reads, `r = {lo:-0.39, scale:0.12, hi:0.63}`): `observedTDEE(s).lo` `2200`→`1988`, and `dietExit(s)` carries it (`[2200,2542]`→`[1988,2542]`). Reach: `observedTDEE` has **7 non-delegate call sites outside `energy.cjs`** (`policy.cjs:37,110,305`, `sleep.cjs:1153`, `writers.cjs`), and `td.lo`/`td.hi` are interpolated into `energyBalanceTarget`'s `why` (`energy.cjs:781`).
**Must NOT change (executed, identical on both engines).** Tight loss, `r.lo = 0.7 > 0`: `lo = hi = 2380`, `stepPromoted false`. Noisy loss, `r.lo = 0.61 > 0`: `lo = 2331`, `hi = 2863`, `tdee = 2597`, `stepDelta = 53`, `stepPromoted false`, `dietExit [2331,2863,2597]`. Fast loss above the ceiling, `r.lo = 4.34 > CEIL`: `lo = hi = 3829`, `clamped true`. `ci == null` (snapshots): `[lo,hi,tdee] = [null,null,2551]`. A genuinely promoted drift stays promoted: `stepDelta = 228`, `_halfw = 0` → `stepPromoted true`, `tdeePrimary 2545` — the load-bearing positive control for `:478`. `tdee`, `avg`, `days`, `rate`, `rateCi`, `method`, `matched`, `split`, `estShare`, `perLb`, `impliedPerLb`, `impossible` all byte-identical in every cell above.
**Named source mutants (all executed, all killed).** (1) `clamp-the-upper-endpoint-instead` — the law does NOT kill (the interval is ordered and promotion is false); killed by `observedTDEE(gain).hi === 1620` (mutant `2000`). (2) `lower-endpoint-is-the-point-estimate` (`kcal(Math.min(CEIL, r.scale))`) — the law does NOT kill; killed by the straddling-CI cell (`lo` `1988` vs `2265`) and by `dietExit`. (3) `fix-the-halfwidth-instead-of-the-endpoints` (keep the clamp, absolute-value `:474`) — **killed by the law** (`lo > tdee`). (4) `drop-the-ceiling-on-the-lower-endpoint` — the law does NOT kill; killed by the fast-loss cell (`lo 3829` vs `kcal(4.34)`).

### D15 — workout frequency inflates when food is logged less

**Plain** (`:119`): "The app says workouts happened more often when food was logged less often, although the workouts and dates are unchanged." Register 117–125; BAR `:121`; LIVE `:122` NOT TRIGGERED (also `:505`); FIX `:124` "Use the elapsed observation interval for logged workout frequency while retaining the existing scheduled-frequency floor. Estimate 3 hours. The training-cost numbers and their existing receipt interpolation change; downstream calorie and Today goldens may change."

**Current code** — `energy.cjs:805–807`. `rows` is the **food**-logged days inside the 21-day window (`:788`); using its count as a week count means sparse food logging shrinks the denominator and inflates the session rate:
```js
  const sessDays = Object.keys(s.sessionLog || {}).filter((d) => d >= cutoff).length;
  const wks = Math.max(1, rows.length / 7);
  const logged = sessDays / wks;
  let scheduled = 0;
  for (let i = 0; i < 7; i++) { … if (t2 === "U" || t2 === "L") scheduled++; }
  const perWk = Math.max(logged, scheduled);
```
**Proposed behaviour.** The denominator is the elapsed observation interval — first observation inside the window through today, inclusive, floored at one week, exactly as the law's own control computes it (`laws-clock-and-as-of.cjs:75–78`). `sessDays`, the scheduled floor, `EA_KCAL_PER_SESSION`, `rows`, `days: rows.length` and the intake receipt are untouched.
**Proposed hunk** (`energy.cjs:806–807`; `isoOf`, `todayStart`, `mk`, `DAY` are all already delegated at `:5–8`, no new delegate):
```js
+ /* D15 — the frequency denominator is the ELAPSED OBSERVATION INTERVAL, not how many
+    food rows sit inside it; the scheduled floor at :814 is untouched. */
+ const to9 = isoOf(todayStart());
+ const from9 = [...Object.keys(s.dailyLogs || {}), ...Object.keys(s.sessionLog || {})].filter((d) => d >= cutoff && d <= to9).sort()[0] || to9;
- const wks = Math.max(1, rows.length / 7);
+ const wks = Math.max(1, (Math.round((mk(to9) - mk(from9)) / DAY) + 1) / 7);
  const logged = sessDays / wks;
```
`Math.round((mk(b) − mk(a)) / DAY)` is the engine's own DST-safe idiom and is already in **this file** at `:335`; it is also D10's repaired form, so B4 stays consistent with B1 without depending on it. `Math.max(1, days/7)` is `Math.max(7, days)/7` — the control's floor, unchanged.
**Law** `E-D15-session-frequency-does-not-change-with-food-row-density` (`laws-clock-and-as-of.cjs:61`, assertion `:71` `!a.gated && !b.gated && a.sessPerWk === b.sessPerWk`). **RED on the post-B1 base:** sparse `sessPerWk 7`, dense `sessPerWk 4` for the identical 8 sessions over the identical interval; control GREEN; mutant `food-row-count-is-elapsed-weeks` RED. **→ GREEN:** both `4`.
**Delta cells (executed → patched).** Sparse fixture (8 food days, 8 session days, 2026-08-14→2026-09-03): `sessPerWk` `7`→`4`; `trainKcal` `300`→`171`; `ea` `27.9`→`29.8`; `band` `"MARGINAL"`→`"ADEQUATE"`; `receipts[1]` gains the programme clause — `"Training costs about 300 kcal/day at 7 sessions a week — an estimate, not a measurement."` → `"Training costs about 171 kcal/day at 4 sessions a week (the programme's 4, not the 2.7 in the log — in-app logging started part way through, and under-charging training would flatter this number) — an estimate, not a measurement."` A DST-crossing interval where the logged figure binds (15 session days, 2026-10-26→2026-11-09, read at `today = 2026-11-10`): `sessPerWk` `7`→`6.6`, `trainKcal` `300`→`281`. Reach: `energyAvailability` has **5 non-delegate call sites outside `energy.cjs`** (`policy.cjs:595`, `sleep.cjs:265,833`, `writers.cjs:1086`), and `ea.band` feeds the phase arc.
**Must NOT change (executed, identical on both engines).** The dense fixture (21 contiguous food days): `sessPerWk 4`, `trainKcal 171`, `days 21`, `ea 29.8`, `band "ADEQUATE"`, `receipts[1]` — the value the sparse case moves *to*. Eight contiguous logged days ending today: `sessPerWk 7` on both engines — **the load-bearing negative control: when every day inside the interval is logged, old and new denominators are identical by construction.** Seven rows: `{gated:true, have:7, need:8}` byte-identical. `days: rows.length` (`8` and `21`) and `receipts[0]` ("Intake 2200 kcal/day averaged over 8 logged days.") unchanged — the register's "existing 0/1 detail stays truthful" analogue. `intake`, `steps`, `ffmKg`, `walkKcal`, `stepsToDrop`, `receipts[2..5]` unchanged where `perWk` does not move.
**Named source mutants (all executed, all killed).** (1) `fixed-twenty-one-day-denominator` (`wks = 22/7`) — killed by the contiguous-8 cell (`7` vs `4`). (2) `interval-starts-at-the-cutoff` (`from9 = cutoff`) — killed by the same cell. (3) `drop-the-scheduled-floor` (`perWk = logged`) — killed by `sparse.sessPerWk === 4` (mutant `2.7`) and nine further cells. (4) `interval-by-milliseconds` (drop `Math.round`) — the law does NOT kill; killed by the DST-crossing cell (`6.6` vs `6.5`).
**Condition C1 (in the shape of `DECISIONS:82`'s).** The D15 law's control (`laws-clock-and-as-of.cjs:73–81`) additionally bounds `sessionLog` by `d <= today`, which the product does not (`:805` filters only `d >= cutoff`). **The control may serve as a result oracle for the interval, never as a specification for the session filter**: B4 does not change `sessDays`, and a future-dated session row still counts, exactly as today. Named here so the difference is ruled rather than discovered.

### D13 — a stale energy estimate survives a body-weight change

**Plain** (`:203`): "The app can keep showing an old energy estimate after the underlying body-weight estimate changes, when a fresh reading should reflect the updated record." Register 201–209; BAR `:205`; LIVE **`:206` / `:503` NOT APPLICABLE ("needs a write between two cached reads of the same object")**; FIX `:208` "bind the memo to a state revision or relevant immutable input snapshot so in-place writers cannot retain a stale result. Estimate 4 hours. No template wording changes are needed; formerly stale numerical and embedded-label goldens can change after writer sequences."

**Current code** — `energy.cjs:1130–1139`. A `WeakMap` keyed on object identity, with four consumers: `_ebtMemo` (`:678`), `_energyDensityLoss` (`:1005`), `_forecastCached` (`policy.cjs:272`), `_nowMemo` (`today.cjs:635`):
```js
function memoOnState(fn) {
  const cache = new WeakMap();
  return (s) => {
    if (s == null || typeof s !== "object") return fn(s);
    if (cache.has(s)) return cache.get(s);
    const v = fn(s);
    cache.set(s, v);
    return v;
  };
}
```
**Proposed behaviour — and the key.** The memo becomes **content-addressed**: the cache entry carries the key it was computed under, and a read whose key differs recomputes. **The key is `JSON.stringify(s)`, optionally prefixed by a caller-supplied salt (NUL-separated)** — the engine's state is the same JSON document the client persists, so its serialization *is* its content. Rejected alternatives, with reasons: a **state revision counter** needs every writer to bump it, reaching `writers.cjs`, `merge.cjs` and `migrate.cjs` — three modules B4 does not own; **array lengths / shallow fields** are unsound against exactly the mutation D20's law performs (`s.reads[i].w` changes in place, no length or key changes) — both are carried as named mutants below and both die on the laws; **per-call-site relevance selectors** would need an input closure for `forecastUncached` and `nowModelUncached`, each of which reads most of the state, and one omission silently reinstates the defect. An **unserializable state is never cached** — slow and true beats fast and stale.
**Proposed hunk** (`energy.cjs:1130–1139`; nothing is inserted between the `// Copied from frozen …` marker and the declaration — see §5.6):
```js
- function memoOnState(fn) {
+ function memoOnState(fn, saltOf) {
    const cache = new WeakMap();
    return (s) => {
      if (s == null || typeof s !== "object") return fn(s);
-     if (cache.has(s)) return cache.get(s);
+     /* D13 — the key is the state's CONTENT (plus any caller-supplied clock salt), never
+        the object's identity: an in-place writer changes the key and the next read
+        recomputes. An unserializable state is never cached — slow and true beats stale. */
+     let k;
+     try { k = JSON.stringify(s); } catch (e) { k = null; }
+     if (typeof k !== "string") return fn(s);
+     if (saltOf) k = saltOf(s) + " " + k;
+     const hit = cache.get(s);
+     if (hit && hit.k === k) return hit.v;
      const v = fn(s);
-     cache.set(s, v);
+     cache.set(s, { k, v });
      return v;
    };
  }
```
**Law** `E-D13-energy-density-cache-tracks-relevant-state` (`laws-cache-identity.cjs:9`, assertion `:10` `before.perLb !== recomputed.perLb && after.perLb === recomputed.perLb && JSON.stringify(after) === JSON.stringify(recomputed)`). **RED on the post-B1 base:** `{before:3859, after:3859, recomputed:3499}`; control GREEN; mutant `memo-key-is-object-identity-without-invalidation` RED. **→ GREEN:** `{before:3859, after:3499, recomputed:3499}`.
**Delta cells (executed → patched).** `energyDensity` after an in-place `s.trend = 160`: `3859`→`3499`. **`_ebtMemo`, the fourth consumer the register names only through `memoOnState`:** after rewriting 16 days of `dailyLogs[d].cal` in place, `energyBalanceTarget(s).lo` `1872`→`2372`, matching `energyBalanceTargetUncached` exactly (`false`→`true`). An **unserializable (circular) state**: `energyDensity` `[3859, 3859, 3499, stale]`→`[3859, 3499, 3499, fresh]` — it is never cached, so it is never stale. Reach: `energyDensity` **5 non-delegate call sites outside `energy.cjs`** (`policy.cjs:48,357`, `sleep.cjs:1345,1351`), `energyBalanceTarget` 19 sites across five modules.
**Must NOT change (executed, identical on both engines).** **The cache still caches**: `energyDensity(s) === energyDensity(s)` on an unchanged state → `true` on both engines (reference identity preserved), likewise `forecast(s) === forecast(s)` and `nowModel(s) === nowModel(s)`. `energyDensityUncached(s).perLb = 3859` unchanged. `energyDensity(null).perLb = 3800` (the non-object fast path) unchanged. The engine's export surface: **572 names on both engines, 0 added, 0 removed** — `memoOnState` keeps its name and its position; only its arity grows, and the three other call sites pass one argument exactly as before.
**Named source mutants (all executed, all killed).** (1) `key-on-a-single-field` (`k = String(s.trend)`) — passes D13's law; **killed by the D20 law**. (2) `compute-the-key-but-never-compare-it` — **killed by D13, D20 and D26 laws**. (3) `cache-unserializable-states-under-a-null-key` — killed by the circular-state cell. (4) `key-on-shape-not-content` (array lengths and value types) — **killed by the D13 and D20 laws**.

### D20 — a forecast survives a change in the observations behind it

**Plain** (`:213`): "The app keeps an earlier forecast after the observations used to make it have changed." Register 211–219; BAR `:215`; LIVE **`:216` / `:510` NOT APPLICABLE ("needs an earlier cached read followed by a write to the same in-memory state")**; FIX `:218` "Invalidate the forecast when relevant state content changes or require a fresh immutable state at every writer boundary. Estimate 3 hours. No receipt template needs editing; refreshed forecasts and dependent Today golden values can change."

**Current code** — `policy.cjs:271–275` (post-B1 coordinates; `policy.cjs:270–274` at the tip). **B4 changes none of it:**
```js
// Copied from frozen src/app.jsx @ fe516c1:5202-5202.
const _forecastCached = memoOnState((s) => forecastUncached(s));
// Copied from frozen src/app.jsx @ fe516c1:5205-5205.
function forecast(s, opts) { return opts === undefined ? _forecastCached(s) : forecastUncached(s, opts); }
```
**Proposed behaviour and hunk: none.** D20 is repaired **entirely** by D13's hunk — the register's first alternative ("invalidate the forecast when relevant state content changes") is what the content key does, at the primitive rather than at the site. Executed proof: on the caches-only tree (D13 + D26 hunks, `policy.cjs` byte-identical `4d6c244e…`) D20 reads **RED-frozen / GREEN-candidate**. This is B4's answer to Objection 2: a site hunk here would be a second mechanism for one defect.
**Law** `E-D20-forecast-refreshes-after-an-observed-rate-change` (`laws-cache-identity.cjs:21`, assertion `:27` `first.ok && fresh.ok && cached.ok && first.rate !== fresh.rate && cached.rate === fresh.rate`). **RED on the post-B1 base:** control GREEN; mutant `forecast-is-cached-only-by-state-object` RED. **→ GREEN.**
**Delta cells (executed → patched).** 15 daily reads, then every `r.w` rewritten in place: `[first.rate, cached.rate, fresh.rate]` `[1.39, 1.39, 0.69]`→`[1.39, 0.69, 0.69]`; `cached.rate === fresh.rate` `false`→`true`. The whole forecast object follows: `cone`, `crossing`, `etaMid/etaFast/etaSlow`, `atWeight`, `targetPct` (measured through the witness cell at `defect-witnesses-2.cjs:152`).
**Must NOT change (executed).** `forecast(s) === forecast(s)` on an unchanged state → `true`; `first.rate = 1.39` and `fresh.rate = 0.69` identical on both engines; `forecast(s, opts)`'s bypass path (`opts !== undefined` → `forecastUncached`) untouched; `safeCrossing` (`:278`) and `conditionalForesight` (`:281`) untouched; `policy.cjs` sha256 **unchanged** end to end.
**Named source mutants.** D20's killers are D13's mutants (1) `key-on-a-single-field` and (4) `key-on-shape-not-content` — both pass D13's own law and **die on D20's**, because D20's fixture mutates nested values without changing any length, key or top-level scalar. Named here so D20's mutant column is a real column and not a borrowed one.

### D26 — yesterday's Today survives past midnight

**Plain** (`:223`): "The app can keep showing yesterday after midnight when no new record has been entered." Register 221–229; BAR `:225`; LIVE **`:226` / `:516` NOT APPLICABLE ("needs a cached Today read before a calendar rollover")**; FIX `:228` "Include calendar validity in the cache key or expire the cached model when the required clock boundary changes. Estimate 3 hours. No stored receipt string changes; date-dependent Today values and golden outputs can change."

**Current code** — `today.cjs:634–638` (post-B1; `:626–630` at the tip):
```js
// Copied from frozen src/app.jsx @ fe516c1:15535-15535.
const _nowMemo = memoOnState((s) => nowModelUncached(s));
// Copied from frozen src/app.jsx @ fe516c1:15536-15536.
function nowModel(s, deps) { return deps ? nowModelUncached(s, deps) : _nowMemo(s); }
```
**Proposed behaviour.** The clock reading joins the key. `nowModelUncached` reads the clock **twice over**: `tISO = isoOf(todayStart())` at `:520`, and the **hour** transitively through `theOneFix(s)` → `nowFocus(s)` (`:187 clock.hour()`), whose `owed` list gates `day` on `h >= eveningFrom` (`:208`, `eveningFrom = 17`) and whose `phase` and `lead` are hour-derived. So "the required clock boundary" the register names is the calendar date **and** the hour.
**Proposed hunk** (`today.cjs:635`, one line; `isoOf`/`todayStart` are delegated at `:25`/`:49`, `clock` is the module factory's own parameter and is already used at `:187` — no new delegate, no new import, no cycle):
```js
- const _nowMemo = memoOnState((s) => nowModelUncached(s));
+ const _nowMemo = memoOnState((s) => nowModelUncached(s), () => isoOf(todayStart()) + "T" + clock.hour());   /* D26 — the model reads the clock (tISO :520, the hour via nowFocus:187), so the clock reading joins the key */
```
**Objection — the law under-specifies against its own register FIX, and the gap is a measured defect.** `laws-cache-identity.cjs:40` asserts only the calendar date. With a date-only salt, a state whose books are open still reads `move.title = "NOTHING NEEDS YOU"` at 18:00 after a 12:00 read — measured, base and date-only-mutant alike — where a fresh model says `"CLOSE THE BOOKS FIRST"`. **Follow the register, not the law**, and carry the hour; the date-only form is named mutant (1) below with its own killer cell. §6 Q2 puts the scope question to the PM.
**Law** `E-D26-today-model-refreshes-when-the-calendar-day-changes` (`laws-cache-identity.cjs:38`, assertion `:40` `first.tISO === '2026-09-03' && next.tISO === '2026-09-04' && next.tISO === fresh.tISO`). **RED on the post-B1 base:** control GREEN; mutant `today-cache-omits-clock-validity` RED. **→ GREEN.**
**Delta cells (executed → patched).** Clock advanced 2026-09-03 → 2026-09-04 on an unchanged state: `[first.tISO, cached.tISO, fresh.tISO]` `["2026-09-03","2026-09-03","2026-09-04"]`→`["2026-09-03","2026-09-04","2026-09-04"]`. **Hour boundary, same date, unchanged state** (today's calories not yet entered, last night logged, weighed): `move.title` at 18:00 after a 12:00 read `"NOTHING NEEDS YOU"`→`"CLOSE THE BOOKS FIRST"`, matching the fresh model. **State change inside the same hour** (14 reads and daily logs added in place): `eat.gated` `true`→`false`, `eat.lo` `null`→`1984`, equal to the uncached model. Through `nowModel` this is the Today surface A1 renders (`DECISIONS.md:99`) — §3 and §6 Q5.
**Must NOT change (executed, identical on both engines).** `nowModel(s) === nowModel(s)` on an unchanged state and an unchanged clock → `true` (the cache still caches). `nowModel(s, {})`'s bypass → `tISO "2026-09-03"`, unchanged. A **deeply frozen** state (`Object.freeze` recursively, the `defect-witnesses-3.cjs:77` idiom) → `tISO "2026-09-03"`, no throw. `nowFocus` itself at hour 12 `["MIDDAY", no owed, "Nothing owed right now"]` and at hour 18 `["EVENING","day","Close the day"]` — identical on both engines; the hunk changes *when the model is recomputed*, never what `nowModelUncached` computes.
**Named source mutants (all executed, all killed).** (1) `salt-with-the-date-but-not-the-hour` — the law does NOT kill; killed by the hour-boundary cell. (2) `salt-replaces-the-content-key` (`k = saltOf(s)`) — the law does NOT kill; killed by the same-hour state-change cell. (3) `read-the-clock-once-at-module-load` — **killed by the law**.

---

## 3. Golden and receipt surfaces, and the witness carrier successor

Register FIX warnings, cited: D14 `:196` "any raw-rate or downstream census path that formerly carried NaN may change"; D11 `:176` "the `stepsWhy` receipt … must be regenerated consistently; affected numerical/prose goldens change"; D15 `:124` "the training-cost numbers and their existing receipt interpolation change; downstream calorie and Today goldens may change"; D13 `:208` "formerly stale numerical and embedded-label goldens can change after writer sequences"; D20 `:218` "refreshed forecasts and dependent Today golden values can change"; D26 `:228` "**No stored receipt string changes**; date-dependent Today values and golden outputs can change". **No hunk in B4 authors or edits a single prose template.** The exact strings whose *interpolated values* move: `energy.cjs:485` (`stepsWhy`), `:781` (`energyBalanceTarget.why`, the `(lo–hi once the rate's own error is carried through)` clause), `:841` (the training-cost receipt, which additionally takes its existing `logged < scheduled` branch).

**Witness impact, measured on a non-throwing assert observer over both engines: 11 assertions in 6 cells, in two files B1's carrier already owns.**

| file:line | assertion (base value) → reviewed successor (patched value) |
|---|---|
| `defect-witnesses-2.cjs:32` | `td.lo` `2000` → `1620` |
| `defect-witnesses-2.cjs:34` | `assert.ok(td.lo > td.hi)` `true` → `false` (successor: `td.lo <= td.hi`) |
| `defect-witnesses-2.cjs:36` | `td.stepPromoted` `true` → `false` |
| `defect-witnesses-2.cjs:61` | `assert.equal(stale, before)` reference-equal → **no longer the same object** |
| `defect-witnesses-2.cjs:62` | `stale.perLb` `3859` → `3499` |
| `defect-witnesses-2.cjs:73` | `Number.isNaN(rate.fat)` `true` → `false` |
| `defect-witnesses-2.cjs:85` | `ea.sessPerWk` `7` → `4` |
| `defect-witnesses-2.cjs:86` | `ea.trainKcal` `300` → `171` |
| `defect-witnesses-2.cjs:152` | `assert.equal(stale, first)` reference-equal → **no longer the same object** |
| `defect-witnesses-3.cjs:84` | `assert.equal(cached, first)` reference-equal → **no longer the same object** |
| `defect-witnesses-3.cjs:85` | `cached.tISO` `"2026-09-03"` → `"2026-09-04"` |

**Predicted non-flips, executed and confirmed:** `defect-witnesses-2.cjs:30,31,33,35` (`td.rate -0.7`, `td.tdee 1620`, `td.hi 1620`, `td.stepDelta 0`), `:63` (`fresh.perLb 3499`), `:71,72` (`dripOf 0`, `scale 1`), `:83,84` (`ea.days 8`, 8 session keys), `:150,151,153` (`first.ok`, `first.rate 1.4`, `fresh.rate 0.5`), `defect-witnesses-3.cjs:86` (`fresh.tISO`).

**Mechanism — a closed successor of B1's carrier, not a rewrite.** `rebuild/conform/v4/postfix/legacy-b1-carriers.cjs` already pins all three witness files (`WITNESS_PINS`), substitutes 18 assertions in memory through `parent.exactReplace`, and declares `COVERS = ['witnesses-1','witnesses-2','witnesses-3']`. B4 flips assertions **only** in `defect-witnesses-2` and `defect-witnesses-3`, both of which that child already covers. **So B4's package must author `rebuild/conform/v4/postfix/legacy-b4-carriers.cjs` as the closed successor of `legacy-b1-carriers.cjs`, adding the 11 substitutions above with the same `WITNESS_PINS` and the same `TAILS` (`DEFECT WITNESSES: 10/10`, `DEFECT WITNESSES 2: 11/11`, `DEFECT WITNESSES 3: 5/5`), `ADDED_IDS = []`, `COVERS` unchanged — and B4 moves NO gate between `coverage.run` and `coverage.covered`.** Every witness file stays byte-identical; editing one fails `STEP-WITNESS-ORIGINAL-PIN` / `B1-WITNESS-ORIGINAL-PIN`.

**Bare-gate facts the PM should know before reading any log** (all executed with `TZ=America/New_York MEASURED_TEST_NOW=2026-09-03`). On the **pristine tip `8205b7f`**: `defect-witnesses` 10/10 exit 0, `defect-witnesses-3` 5/5 exit 0, `defect-witnesses-4` 5/5 exit 0; `defect-witnesses-2`, `-5`, `-6`, `-7` **fail bare, pre-existingly**, and all are `coverage.covered` at the parent. On the **post-B1 base** witnesses-1 and -3 also fail bare (B1's own flips, carried by `legacy-b1-carriers.cjs`). **B4 adds no file to that list.** Also identical on the pristine tip, the post-B1 base and the B4 candidate: `second-gate.mjs --candidate` **FAIL**, `conform/run.cjs --selftest` **SELFTEST FAIL**, `native-carriers-package.cjs --ci` **FAIL** (`npm ci --include=dev` installs 37 packages and no `node_modules/@noble` — B1 v1.2 §A7's C8 reproduced independently). **None of these moves under B4; B4 must not "fix" any of them and must not expect a bare PASS.**

**Protected surfaces (condition C2, in the shape of `DECISIONS:82`'s).** `rebuild/conform/goldens`, `tools/engine-test.jsx:8790–8793` (the P6 second-gate cells) and the seeded set-one laboratory card: expected verdict **UNCHANGED**; any executed difference is "a RED stop for a reviewed successor cell, never a golden regeneration" (`BRIEF-IMPORT-GUARDS.md:89`). **B1's own package artifact `rebuild/engine/test/b1-delta-cells.cjs` is re-run on the B4 candidate: 3/3 hold, exit 0** — B4 breaks nothing B1 pinned.

**B4's own delta cells must be committed**, in `rebuild/engine/test/b4-delta-cells.cjs`, because five named mutants die on cells and on nothing else: `D14-drip-default-applies-to-both-branches` (snapshots `fat === 1`, regression `fat === 0.7`, no-`model` does not throw), `D11-interval-brackets-the-point-estimate` (gain `lo === hi === tdee === 1620`; straddling-CI `lo === 1988`; fast-loss `lo === hi === 3829`, `clamped`; promoted-drift positive control), `D15-frequency-denominator-is-the-elapsed-interval` (sparse `4`, dense `4`, contiguous-8 `7`, DST-crossing `6.6`, gated-7 unchanged), `D13-an-unserializable-state-is-never-cached`, `D26-the-hour-is-part-of-the-clock-key`. Listed as a required package artifact alongside the carrier.

---

## 4. What the content key costs — measured, not argued

`JSON.stringify` on every memoized read is the one price of D13's repair. Measured on the B4 candidate (`node v22`, synthetic states, `nowModel` warm):

| state | size | `JSON.stringify` | `nowModelUncached` (a miss) | cached `nowModel` (a hit) |
|---|---|---|---|---|
| 400 logged days + 300 feed rows | 87 KB | 0.61 ms | 110 ms | 0.39 ms → **1.10 ms** |
| 1 200 logged days + 300 feed rows | 199 KB | 1.79 ms | 849 ms | 0.39 ms → **6.00 ms** |

A cache **miss** costs +0.6 % at 87 KB and +0.2 % at 199 KB — noise against the work it guards. A cache **hit** costs one stringify plus one string comparison: 1.1 ms on a year of data, 6 ms on three years. Both sit inside a 16 ms frame, and the BAR the register sets for all three cache defects is "untrue value or receipt the athlete sees" — correctness, not speed. If the PM wants the hit path cheaper, the option is to store a digest of the key rather than the key (O(1) comparison, still O(n) to compute, with a collision surface that must then be argued); **recommendation: accept the measured cost, and revisit only if a real device shows a problem.** §6 Q3.

---

## 5. Acceptance bar for B4

From PLAN §3 (`:121–132`), made specific.
1. **Brief** — this document, accepted by the PM as a `rebuild/DECISIONS.md` ledger line before implementation, naming path, byte count and sha256 and recording conditions C1 (§2 D15) and C2 (§3), exactly as `DECISIONS:85` did for LOAD-WRITES; no product acceptance follows.
2. **Closed cumulative profile** `rebuild/m4/spec/acceptance-b4-numbers-cache-identity.json`, bound by sha256, carrying `authorizations { owner = DECISIONS:60, contract = DECISIONS:49, theme = the PM's acceptance line for this brief by sha256, review claim POSTFIX-ACCEPTANCE M2-B4-NUMBERS-CACHE-IDENTITY … ACCEPTED }` — the accepted parent's own key set exactly. Runner `rebuild/m4/spec/b4-numbers-package.cjs`, shaped like `native-carriers-package.cjs`, `assert(args.length===1&&['--full','--ci'].includes(args[0]))` at the same position, **no third mode**. `run.cjs`'s 19-entry `GATES` inventory (`:9–23`) unchanged; the artifact's `gates` array stays the same 19 names and **B4 moves nothing between `coverage.run` and `coverage.covered`** (§3).
3. **Parent** — the accepted B1 artifact, per the chain in the header. Decide the B1/B2 order once and hold it (`REQUESTS.md:3`; B1 v1.2 §A6.6).
4. **What the FULL run must show.** All 45 register laws executed: **D14, D11, D15, D13, D20, D26 GREEN on the candidate and RED on the frozen engine**; the other 39 still raw RED with approved preservation deltas only (`BRIEF-IMPORT-GUARDS.md:87`). **The bar B1 v1.2 §A5 raised applies here and is already met: a full 45-row diff including `frames parity` and printed detail, not raw statuses** — executed, **6 rows moved, 39 byte-identical in status, detail, control, mutant column AND call-trace frame list** (§7 item 6). All 19 gates OBSERVED/PASS with `witnesses-1/-2/-3` and `second-gate` carried by named successor children on their reviewed successor assertions, not bare. **Own bites:** one disclosed source bite quoting its RED line, exact byte/sha restoration, restored-GREEN direct gate; plus one unlisted receipt/input-field delta bite proving the comparator fails closed (`:88`). **Real fault mutants — the 18 named in §2, 18 killed, 0 survivors** (`BRIEF-IMPORT-GUARDS.md:88`: a source-pin refusal, syntax error, missing target or timeout earns no kill; every kill above is a behavioural cell or a law row). **Fidelity diff:** no source change outside §2's enumerated hunks — **2 engine files, 5 hunks, 0 new delegate lines, 0 new exports** (measured: 572 engine exports before and after); `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md` (`:99`).
5. **Cloud (`--ci`) vs the owner's PC (`--full`).** `--ci` is "explicitly public evidence only". **PC only:** everything reaching `rebuild/conform/private/live.json` — `run.cjs:115–117` hard-requires it and the private `live.main` golden for `migrate-full` and fails `REQUIRED-PRIVATE-PREPARATION-MISSING` without them. Per `DECISIONS:97` the builder and reviewer must each run `--full` **without** the fixture and report that BLOCKED terminal line. **Verdict-only reporting: no private values, counts, hashes or prose in any report** (`BRIEF-IMPORT-GUARDS.md:89,103`). **Census expectation — stronger than B1's: B4 has NO LIVE-TRIGGERED defect at all.** D11 `:501`, D14 `:504`, D15 `:505` are NOT TRIGGERED; D13 `:503`, D20 `:510`, D26 `:516` are NOT APPLICABLE, each because it needs an in-memory write between two cached reads or a clock rollover — conditions a static blob census cannot present. **So a private-census change on ANY of the six is a RED stop for a reviewed successor cell, never a golden regeneration.** B1 could anticipate one (D16); B4 anticipates none, and the PM should read any census movement as a finding, not a re-pin.
6. **Two placement rules that are contract, because execution found them.** (a) **Nothing may be inserted between a `// Copied from frozen src/app.jsx @ fe516c1:NNN-NNN.` marker and the declaration it introduces.** Found the hard way: a two-line comment placed there made `source-proof.cjs:11 declarationRanges()` fail `SOURCE-DECLARATION-INVENTORY` on `today.cjs` (18 declarations → throw). D26's comment is therefore a trailing comment on the declaration line. This is the same rule B1 v1.2 §A4.7 states for new declarations, generalised to comments. (b) For the record: **`declarationRanges()` already throws `SOURCE-DECLARATION-INVENTORY` on `policy.cjs` at the post-B1 base and at the pristine tip alike** — pre-existing, not B1's and not B4's, and out of `verifyProductSources`'s scope (`FILE = migrate.cjs`, `STEP_FILE = energy.cjs`, and it refuses any `packageId` other than `M2-IMPORT-GUARDS`/`M2-STEP-EFFICACY`). **`energy.cjs` keeps 47 declarations and `today.cjs` 18 across B4** (executed).
7. **Receipt then authorized rerun.** PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word; the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and re-runs the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0 (`DECISIONS:86–87`, `:95–97`).

---

## 6. Open questions

**For the PM (six).**
1. **D11's hunk shape.** Minimal (drop the asymmetric clamp; ordering follows from `ci ≥ 0` and `kcal`'s monotonicity, proved in §2) or literal-to-the-register (add `Math.min`/`Math.max` over the two endpoints)? **Recommend minimal**: the explicit form is two lines no law, cell, witness or mutant can distinguish on any reachable state, and B4 would then have to declare an unkillable mutant for it.
2. **D26's salt scope.** Calendar date only (what the law asserts) or date **and** hour (what the register's "the required clock boundary" asks, and what the model actually reads through `nowFocus`)? **Recommend date + hour**, with the measured 18:00 case in §2 D26 and the named mutant `salt-with-the-date-but-not-the-hour` that dies on its own cell.
3. **The content key's hit-path cost.** Accept the measured 1.1 ms (one year) / 6.0 ms (three years) per cached `nowModel` read, or require a stored digest? **Recommend accept**, and revisit only against a real device measurement.
4. **`energy.cjs:523,525` — defer, and fold them into B1's single non-D item.** `dietExit`'s `wksHeld` is `+(((todayStart() - mk(started)) / DAY) / 7).toFixed(1)` at both lines — the same hand-rolled elapsed-hour week arithmetic D10 rules on and the exact class B1 found at `policy.cjs:554`. **B4 should NOT fix them**, for four reasons: (a) no B4 FIX line names `dietExit` — D11 names `observedTDEE`, D14 `currentRate`, D15 `energyAvailability`; (b) re-measured here, **9 490 `(started, today)` pairs spanning 2025–2027 including every New York transition: 0 printed differences** between the elapsed-hour and the calendar-day form, and because `readReady`/`decideReady` (`:532–533`) compare the already-`toFixed(1)` value, 0 printed differences means 0 decision differences; (c) B1 v1.2 §A4.6 ruled the identical rider **OUT** of B1 for the identical reason, and two packages inventing different dispositions for one class is exactly `PLAN…v1.md:157`'s risk; (d) a hunk no law, cell, witness or mutant in B4 can detect is a fidelity-diff liability. **Recommendation: file `energy.cjs:523,525` into the one non-D "millisecond-stepped date sites" item B1 §6 Q5 already proposes (71 sites across 7 engine modules, 0 `setDate` uses), and fix the class once.**
5. **Track A expectation freeze** (`PLAN…v1.md:149`). B4 changes `nowModel`'s *freshness* and `energyAvailability`'s/`observedTDEE`'s *numbers*, and `energy.cjs` is composed literally into `rebuild/m3/w7-preview/browser-engine.cjs` and `rebuild/m3/w6/host/engine-runtime-host.cjs`. A1's Today page (`DECISIONS:99`) renders exactly those cells. Either freeze A's expectations to post-B4 behaviour or budget one re-pin pass at the B4 merge. Nothing in B4 touches `rebuild/m3` — this is a request, not an edit.
6. **Carrier ratification.** Approve the **11** reviewed successor assertions in §3 **and** the mechanism (`legacy-b4-carriers.cjs` as the closed successor of `legacy-b1-carriers.cjs`, witness files byte-untouched, `COVERS` unchanged, no gate moved). B4 cannot pass its own gates without it. Note three of the eleven replace **reference-identity** assertions (`stale === before`, `stale === first`, `cached === first`) — the successors must assert the *fresh value*, not a new identity, because identity is precisely what the repair stops meaning.

**For the owner: none.** All six defects are plain Batch-A FIX approvals at `DECISIONS.md:60`; unlike D40 ("the exact tie-break rule … must be specified in the reviewed fix brief before anything is built") no B4 rule is left open. **No B4 hunk invents a threshold, interval, template or policy the owner has not set**: D14 applies a default that already exists and is zero; D11 removes an asymmetry, adding no new bound; D15 changes a denominator and keeps the existing floor and the existing `EA_KCAL_PER_SESSION`; D13/D20/D26 change *when* a value is recomputed, never what it is (`nowModelUncached`, `forecastUncached`, `energyDensityUncached` and `energyBalanceTargetUncached` are byte-identical across B4). **Expected owner questions: none — stated explicitly, as asked.**

**Register vs source.** Every EVIDENCE coordinate for the six resolves on this tree. Three texts under-describe or mis-cite: D14's `energy.cjs:285,301` are one line early (the `fat:` expressions are `:286,:302`); `PLAN…v1.md:111`'s register lines for the LIVE dispositions are wrong (§1 Objection 1); and D26's law asserts only the calendar date where its own FIX says "the required clock boundary" (§2 D26). Neither the register nor any law covers `energy.cjs:523,525`, `_ebtMemo`'s staleness (`energy.cjs:678`, measured in §2 D13), or the regression branch of `currentRate` (`:286`, measured in §2 D14).

---

## 7. Executed evidence — commands and outcomes

Worktree `git worktree add <wt> origin/rebuild/t2-client-core` at `8205b7f`; `npm ci --include=dev` in that worktree (**37 packages, no `node_modules/@noble`**, never committed); `fe516c1` materialised from the shared clone (`git rev-parse fe516c1:src/app.jsx` = `f98671d823f0d8cd83e730cdd930afe5f5e7b628`, the exact blob `helpers.cjs:17` demands); the frozen bundle built with the repo's own recipe (`esbuild` over `tools/_engine-entry.mjs` + `src/app.jsx` at `fe516c1`) into the scratchpad, **never into the repo** — `813 775 bytes, sha256 e4deb0bccb473398fe6c8002d1ad0d4c023b797b33e47cbfe8f906522fb863ad`.

1. **Post-B1 base** built in scratch: the tip's tree with `dates.cjs`, `policy.cjs`, `sleep.cjs`, `today.cjs`, `legacy-b1-carriers.cjs` and `b1-delta-cells.cjs` taken from `b54ba14`; shas re-verified against the header table.
2. `TZ=America/New_York ENGINE_MAIN=<bundle> node rebuild/conform/v4/run-defect-laws.cjs` on that base → `TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR`. **The six B4 rows: each `RED-frozen / RED-candidate / mutant-DETECTED`**, which the runner prints only when frozen↔candidate detail **and** call-trace parity hold.
3. Per-law harness over `bundle('frozen')` and `bundle('candidate')`: all six **RED-raw on both engines, 6/6 controls GREEN, 6/6 named law mutants RED, frames parity `true` on all six**. Detail values quoted per defect in §2.
4. **Discarded scratch copy** (`cp -a <base> <cand>`, never a tree that will be committed): all §2 hunks applied by exact-string replacement with a match-count assertion per hunk — **5 hunks (6 replacements), 0 failures**. Both edited modules re-`require`d cleanly; `createEngine` composes.
5. **Ordering probe, two further discarded trees.** values-only (D14×2, D11, D15) → `D11/D14/D15 GREEN`, `D13/D20/D26 RED`. caches-only (D13, D26) → `D13/D20/D26 GREEN`, `D11/D14/D15 RED`, `policy.cjs` byte-identical. §1 Objection 3.
6. **All 45 laws, base vs candidate, comparing raw status, printed detail, control status, mutant column and the full call-trace frame list**: **6 moved, 39 byte-identical**; the six moved rows are exactly `D11, D13, D14, D15, D20, D26`, each RED→GREEN with frames unchanged. Candidate totals `45 RED-frozen · 23 RED-candidate · 89 GREEN repair controls · 81/104 mutant executions DETECTED · 0 HARNESS_ERROR`. (`AUDIT RED-FIRST FAIL` is the pristine terminal on this tree too, and the six candidate mutant executions flip GREEN because a mutant restores `__auditOriginal`, which after the repair *is* the repaired function — B1 v1.2 §7 item 4, same effect.)
7. **Delta-cell and negative-control probe, 90 cells per engine** across four scripts (the timing probe excluded): **22 rows differ**, every one inside §2's enumerated delta lists — D11 5 (`gain.lo`, `gain.stepPromoted`, `gain.stepsWhy.len`, `flat.lo`, `flat.dietExit`), D14 3, D15 6, D13 3, D20 1, D26 3 — and **68 are identical**, and they are the negative controls quoted per defect.
8. **Frozen-witness observer** (a non-throwing `assert` shim over `defect-witnesses-2.cjs` and `-3.cjs`, both engines, 40 + 24 assertions): the **11** assertions in §3's table flip, and no others. Pre-existing failures (`-2:51,53` D12; `-2:93,94,103,127,128,159` and `-3:48,49,50,58,59,72,100,101,102` B1's) are identical on base and candidate.
9. **Source mutants: 18 named, 18 executed, 18 killed, 0 survivors.** 6 die on laws (`D11-3`, `D13-1`, `D13-2`, `D13-4`, `D26-3`, plus each law's own mutant), 12 die on named cells and on nothing else — enumerated per defect in §2 with the killing cell and both values.
10. **Bare-gate probes** on the pristine tip, the post-B1 base and the candidate: `witnesses-1/-3/-4` pass on the tip and fail on both post-B1 trees identically (B1's flips); `witnesses-2/-5/-6/-7`, `second-gate --candidate`, `conform/run.cjs --selftest` and `native-carriers-package.cjs --ci` fail **identically on all three** (pre-existing). `b1-delta-cells.cjs` **3/3 hold, exit 0, on the B4 candidate**.
11. **Structural checks:** engine export surface 572 names before and after, 0 added, 0 removed; `declarationRanges()` 47 on `energy.cjs` and 18 on `today.cjs` before and after; `memoOnState` has exactly four call sites, all in `rebuild/engine` (`energy.cjs:678,1005`, `policy.cjs:272`, `today.cjs:635`) and none outside it.
12. **Arithmetic proofs:** 9 490 `(started, today)` pairs spanning 2025–2027 for the §6 Q4 `wksHeld` class — **0 printed differences**; the performance table in §4.

**Candidate post-images produced on the discarded scratch copy** (for the implementation to reproduce byte for byte): `energy.cjs` sha256 `96f9a8ff9c868c62f6e42b9eb4e3a54ac22f8b6bc4fab9a6c5da24dfdef537f3` (95 405 bytes, 1 257 lines); `today.cjs` sha256 `ab0d19ec5aa4fd49f09f347a00120eeca4ac4c40b39c2cfd2c323857ab285abb` (47 258 bytes, 641 lines); `policy.cjs`, `dates.cjs`, `sleep.cjs` **unchanged**.

No private data was read; nothing in the repository was modified, committed or pushed.
