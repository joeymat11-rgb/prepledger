# LANE B — B1 GRADING & TIME WINDOW — BUILD REPORT (speculative implementation)

**Status: SPECULATIVE. The brief is NOT accepted. Nothing here is merged or proposed for merge.**
Parallel authoring per `rebuild/DECISIONS.md:100` ("Lane B begins speculative implementation of B1 and B2 on candidate branches (parallel authoring per DECISIONS:94); nothing merges before brief acceptance") and `rebuild/lanes/LANES.md` Amendments → SPECULATIVE AUTHORING.

**Contract implemented:** `rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md` (420 lines, 82 899 bytes) — PROPOSED, NOT ACCEPTED.
**Branch:** `rebuild/lane-b-b1`, worktree `work/lane-b/b1`, forked from `origin/rebuild/t2-client-core` @ `acd3b6755404ab75e91087d179e48ed07467549a` (`acd3b67`, ledger line 100).
**Base re-pin verified:** the brief is written against `87eddad`. `git diff --name-only 87eddad acd3b67 -- rebuild/engine rebuild/conform rebuild/m4/spec` = **0 files**, and all 14 pre-image sha256s in §0 of the brief re-read byte-identical on `acd3b67`. Every coordinate and hash in the brief therefore holds unchanged on this tree.
**Node:** `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` v24.19.0. `npm ci --include=dev` → 44 packages; `package-lock.json` unchanged (`git status` clean apart from the five files below).
**Privacy:** `rebuild/conform/private/` does not exist on this tree and was not created. `ledger/` was never opened. Every private-touching gate is reported **verdict-only**.

## 0. Verdict summary

| claim | result |
|---|---|
| 10 B1 laws GREEN on candidate, RED on frozen | **YES** — all ten |
| 45-law totals | `45 RED-frozen · 39 RED-candidate` → `45 RED-frozen · 29 RED-candidate`; 89 GREEN controls unchanged; 0 HARNESS_ERROR both |
| RED-candidate delta = exactly the ten | **YES** (39 → 29) |
| every other law's printed row unchanged | **NO — one exception: D22.** Raw status unchanged (RED/RED), but its frozen↔candidate **call-trace parity breaks**, so its verdict token moves `mutant-DETECTED` → `AUDIT-FAIL`. Root cause is a real, unenumerated D8 delta — §4.1. **This is a blocking finding for brief acceptance.** |
| named source mutants caught | **31 of 32** (the brief says "31 named"; §2 actually names **32**). The one not caught behaviourally is `D10-2 utc-stamp-substitution`, exactly as the brief predicts |
| frozen witness flips | **18 assertions in 10 cells — measured exactly**, at exactly the lines the brief names, with both predicted non-flips confirmed |
| B1 carrier authored and executed | `rebuild/conform/v4/postfix/legacy-b1-carriers.cjs` — **6/6 PASS** (3 files × 2 Date modes), 20 substitutions, witness files byte-identical |
| 19 original gates | **2 of 19 move** — `witnesses-1` and `witnesses-3`, exactly the two the brief says must move from `coverage.run` to `coverage.covered` |
| pinned closed profile refuses | **YES** — `native-carriers-profile.verify()` → `Unchanged parent pin: rebuild/engine/dates.cjs` |
| frozen conformance suite | `SUITE INCONSISTENT` — **line-for-line identical to pristine (82 lines, 0 differing)**; cannot be reported CONSISTENT on this worktree (§3.7) |
| second gate | `SECOND GATE candidate: FAIL` at `tools/engine-test.jsx:106` — **line-for-line identical to pristine**; the pre-existing D12 abort the brief predicts. Not fixed |
| frozen laws edited | **NONE.** `rebuild/conform/v4/laws-*.cjs` byte-identical |

## 1. Files changed — sha256 before / after

| file | sha256 BEFORE (= brief §0 pre-image) | sha256 AFTER | bytes | lines |
|---|---|---|---|---|
| `rebuild/engine/dates.cjs` | `19e9ce7e0a4b2dc770a41b2a8a722f57ad767c36b2edfe967cf866b88be3dff6` | `b51f3f1e0e94c6d7c1ae08d9049db6338e51c70e451674e3a87d94bf190fe067` | 1 343 | 26 → 29 |
| `rebuild/engine/sleep.cjs` | `3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0` | `6be0c6fb35fe31955833cba1140f8afbfe9be3f82749da1f2532c5a1aa4068ef` | 185 393 | 1 958 → 1 960 |
| `rebuild/engine/policy.cjs` | `a1d21404ec52de9f7726071d60e05c0911590a417d11bf8f9076241762a3768d` | `4d6c244efa6b34daed02e194dbbd5b7064abcde2d93fd28974a5f2df519187e1` | 56 859 | 827 → 830 |
| `rebuild/engine/today.cjs` | `397532ecf20a4f5a9e1bd4a7d8d312cf5fd52058427603a7726ba512107bdbb3` | `f8d0397abd75c02dd570741191124c32e26ab850702607826943d4394fda2e00` | 47 093 | 633 → 641 |
| `rebuild/conform/v4/postfix/legacy-b1-carriers.cjs` | *(new file)* | `d8d98b247271d9b4f5ac50f2b7205b1820db4ff72ad6bb53ee2e0d6ccbb002bf` | 12 838 | 187 |

`git diff --stat` = `4 files changed, 43 insertions(+), 27 deletions(-)`. No other path is touched: `migrate.cjs` and `writers.cjs` are byte-identical (their goldens are B3's, per the brief). The three frozen witness files, all `rebuild/conform/v4/laws-*.cjs`, `rebuild/conform/goldens`, `tools/engine-test.jsx` and `package-lock.json` are byte-identical.

**Delegate-block arithmetic, measured (brief §0.1 item 2 confirmed):** `today.cjs` 45 → **48** (`phaseArc`, `plusDays`, `sleepInfo`); `sleep.cjs` 33 → **34** (`plusDays`); `policy.cjs` 23 → **24** (`plusDays`). The brief's §0.1 says policy 23→24 **without** the §6 Q5 rider and 25 with it; its §5.4 says "3+1+2 new delegate lines", which implies 2 in policy, i.e. the rider **in**. That is an internal inconsistency in the brief — resolved here by following §2's explicit hunk blocks (rider **out**); see §4.5.

## 2. The hunks, in the brief's order D10 → D8 → D21 → D19 → D16 → D17 → D24 → D25 → D27 → D23

Applied by exact-string replacement with a single-occurrence requirement on every anchor. 10 defect groups, 17 hunk sites, 4 new delegate lines. No reformatting, no unrelated edit.

### D10 — `dates.cjs`

```js
// before (:22-25)
// Copied from frozen src/app.jsx @ fe516c1:311-311.
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;

return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween };
// after (:22-28)
/* D10 — NEW declaration, no frozen counterpart: the calendar-day shift primitive D21/D19/D16/D24/D23 consume. */
const plusDays = (iso, n) => { const d = mk(iso); d.setDate(d.getDate() + n); return isoOf(d); };

// Copied from frozen src/app.jsx @ fe516c1:311-311.
const weeksBetween = (aISO, bISO) => Math.round((mk(bISO) - mk(aISO)) / DAY) / 7;

return { DAY, mk, isoOf, todayStart, daysUntil, fmtShort, weeksBetween, plusDays };
```

**Deliberate deviation (recorded):** the brief's hunk prints `plusDays` immediately above `weeksBetween`, i.e. between the `// Copied from frozen src/app.jsx @ fe516c1:311-311.` marker and the declaration it marks. `plusDays` has **no** frozen counterpart, and `source-proof.cjs:11 declarationRanges()` names each declaration range by the first declaration following such a marker — putting `plusDays` there would rename `weeksBetween`'s range and attach a false frozen provenance to a new declaration. It is therefore placed immediately *above* the marker with its own comment. `declarationRanges` is only applied to `migrate.cjs` and `energy.cjs` today (verified: `git grep declarationRanges` → `source-proof.cjs`, `mutant-proposals.cjs` only), so nothing currently fails either way; the placement is the safe one. Ordering relative to `weeksBetween` is preserved. The brief's own "before" block also elides the blank line and the marker, so the hunk is an abridged presentation, not literal contiguous text.

### D8 — `sleep.cjs` (delegate after `:21`, per the brief; guard in `cleanAtDate`)

```js
// delegate block, after const weeksBetween (:21)
+ const plusDays = (...args) => E.plusDays(...args);
// cleanAtDate (:1020-1021 pre-image)
  const last = nights[nights.length - 1];
+ if (last.d !== plusDays(iso, -1)) return true;   /* D8 — a night that is not LAST night carries no current restriction */
  if (last.h < DEBT_LAST_H) return false;
```

### D21 — `sleep.cjs` `sleepInfo` (`:1901` pre-image)

```js
- const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));
+ const tomorrow = plusDays(isoOf(todayStart()), 1);
```

### D19 — `policy.cjs` (delegate after `:16`; `phaseArc` binding + two prose sites)

```js
// delegate block, after const isoOf (:16)
+ const plusDays = (...args) => E.plusDays(...args);
// phaseArc, two-line anchor :541-542 (the v1.1 fix for v1's ambiguous single-line anchor)
  const brkS = (deps && deps.brk) || dietBreakState(s, deps);
+ const resumeISO = brkS.end ? plusDays(brkS.end, 1) : null;   /* D19 — an inclusive last active day resumes the NEXT date */
  const dx = _phaseSafe(() => dietExit(s), null);
// :563
- when: `resumes ${fmtShort(brkS.end)}`, note: "the deficit picks back up; …
+ when: `resumes ${fmtShort(resumeISO)}`, note: "the deficit picks back up; …
// :573
- ? `Diet break — day ${brkS.daysSince} of ${BREAK_LEN_DAYS}, … the cut resumes ${fmtShort(brkS.end)}.`
+ ? `Diet break — day ${brkS.daysSince + 1} of ${BREAK_LEN_DAYS}, … the cut resumes ${fmtShort(resumeISO)}.`
```

The v1.1 anchor fix was necessary and is confirmed: `const dx = _phaseSafe(() => dietExit(s), null);` occurs at **`policy.cjs:525` and `:542`** on this tree, so v1's single-line anchor is genuinely ambiguous. The two-line anchor matched exactly once.
Both prose sites needed disambiguating context of their own: `` resumes ${fmtShort(brkS.end)} `` occurs at **:563 and :573**, so each replacement carries a unique suffix/prefix.

### D16 — `policy.cjs` `trackRecord` (`:479`, `:482-483`)

```js
- const actualTrendAt = (iso) => { for (const r of sorted) if (r.d >= iso && r.pt != null) return r.pt; return null; };
+ /* D16 — an eligible read ON the due date or the one grace date after it; later reads leave the call UNGRADED */
+ const actualTrendAt = (iso, graceISO) => { for (const r of sorted) if (r.d >= iso && r.d <= graceISO && r.pt != null && !r.sealed && !r.offWindow) return r.pt; return null; };
-     const dueISO = isoOf(new Date(mk(f.d).getTime() + GRADE_LAG * DAY));
-     const actual = actualTrendAt(dueISO);
+     const dueISO = plusDays(f.d, GRADE_LAG);
+     const actual = actualTrendAt(dueISO, plusDays(dueISO, 1));
```

### D17 — `policy.cjs` (`:495`) — one operator

```js
- .slice(-8).map((a) => ({ d: a.d, title: a.title, applied: !a.dismissed, auto: !!a.auto }));
+ .slice(-8).map((a) => ({ d: a.d, title: a.title, applied: !a.dismissed && !a.undone, auto: !!a.auto }));
```

### today.cjs delegates (3 new, alphabetical in an alphabetical block)

```js
  const paceProjection = (...args) => E.paceProjection(...args);
+ const phaseArc = (...args) => E.phaseArc(...args);
+ const plusDays = (...args) => E.plusDays(...args);
  const progressStep = (...args) => E.progressStep(...args);
  …
  const signalState = (...args) => E.signalState(...args);
+ const sleepInfo = (...args) => E.sleepInfo(...args);
  const stepTarget = (...args) => E.stepTarget(...args);
```

No cycle is introduced. `index.cjs` registers `sleep.cjs` (line 11) and `policy.cjs` (line 13) **before** `today.cjs` (line 14) — re-verified on this tree, matching the brief's claim exactly — and neither `sleep.cjs` nor `policy.cjs` references `E.theOneFix`, `E.fiveLevers`, `E.nowFocus` or `E.nowModel`. The composed engine loads and all 45 laws execute with 0 HARNESS_ERROR, which is the executed proof.

### D24 — `today.cjs` `nowFocus` (`:206-207`)

```js
- const yISO = isoOf(new Date(todayStart().getTime() - DAY));
- const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
+ const yISO = plusDays(isoOf(todayStart()), -1);
+ const yRow = (s.dailyLogs || {})[yISO];   /* D24 — the SAME calorie predicate as today (:201) and the ledger (sleep.cjs:1001) */
+ const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && (!yRow || yRow.cal == null);
```

### D25 — `today.cjs` `fiveLevers` (`:249`)

```js
- state: proHitN >= proRows.length - 1 ? "good" : "caution"
+ state: proHitN >= 1 && proHitN >= proRows.length - 1 ? "good" : "caution"
```

### D27 — `today.cjs` `theOneFix` (`:303-305`)

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

### D23 — `today.cjs` `nowModelUncached` next-workout loop (`:566-579` pre-image)

```js
  let workout = { title: "REST DAY", sub: "Recovery is training too — the next session is on its way.", today: false };
- try {
-   for (let k9 = 0; k9 < 7; k9++) {
-     const d9 = isoOf(new Date(todayStart().getTime() + k9 * 864e5));
-     const dt9 = dayType(d9, s);
-     if (dt9 === "U" || dt9 === "L") {
-       const sess9 = genSession(s, d9);
-       const beats = …; workout = { … }; break;
-     }
-   }
- } catch (e) {}
+ const slp9 = (() => { try { return sleepInfo(s); } catch (e) { return { last: null }; } })();   /* D23 — genSession REQUIRES its sleep input (:63,:56) */
+ for (let k9 = 0; k9 < 7; k9++) {
+   let d9, dt9, sess9;
+   try {
+     d9 = plusDays(isoOf(todayStart()), k9);
+     dt9 = dayType(d9, s);
+     if (dt9 !== "U" && dt9 !== "L") continue;
+     sess9 = genSession(s, d9, slp9);
+   } catch (e) { continue; }   /* a failed derivation is not a rest day: keep scanning */
+   const beats = …; workout = { … }; break;
+ }
```

The `beats`/`workout`/`break` body is carried verbatim and de-indented by four columns, which is forced by removing the `if (dt9 === …) {` block the brief's hunk deletes. `pickStructural`'s hack gate (`:56`) and `genSession`'s body are untouched — H1 stays out of B1, per the brief §4.

## 3. Executed evidence

### 3.0 The frozen bundle

`build-engines.mjs` **does not run on Windows** — `node rebuild/conform/engines/build-engines.mjs <root>` aborts with
`Error [ERR_UNSUPPORTED_ESM_URL_SCHEME] … Received protocol 'c:'` (it does `await import(path.join(root, "node_modules/esbuild/lib/main.js"))` with a bare Windows path). **Pre-existing repo portability defect, reported not fixed.**
The frozen bundle was built instead with the repo's *other* own recipe — the one the postfix gates themselves use: `legacy-gates.publicReferences({baseline, scratch, sourcePins: manifest.baseline.buildSources})`, which pins every frozen source byte from Git before bundling (`FROZEN-BUILD-SOURCE-PIN`). Output into `<root>/.tmp/` (gitignored) and copied to `rebuild/conform/engines/` (gitignored by `rebuild/conform/.gitignore:2 engines/*.cjs`).

```
main -> .tmp/b1-frozen/main/engine.cjs  bytes=813696  sha256=0810d9b43e1ed3f286521ae6d8ffd306f55860056daf9836d1c42dc6221a3d69
old  -> .tmp/b1-frozen/old/engine.cjs   bytes=792806  sha256=9060d7dc36ede09e390217968a393c776034528ee1836ee9780f3ee46848b261
```
`fe516c1:src/app.jsx` verified at blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628` (the clone is not shallow). 813 696 bytes vs the brief's 813 751 — expected and documented by `build-engines.mjs` itself: an esbuild bundle's byte size depends on the esbuild version and entry path.

### 3.1 The ten laws (`rebuild/conform/v4/run-defect-laws.cjs`)

```
TZ=America/New_York MEASURED_TEST_NOW=2026-09-03 ENGINE_MAIN=<main> ENGINE_OLD=<old> \
  node rebuild/conform/v4/run-defect-laws.cjs
```
Run twice from one harness that restores a pristine copy of the four files between runs and re-verifies their sha256s (`b1-scratch/runboth.js`).

```
BEFORE TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
AFTER  TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

The BEFORE line reproduces the brief's §7 item 1 exactly. Rows that moved: **11**.

| defect | before | after |
|---|---|---|
| D8 `D-D8-stale-sleep-does-not-claim-current-debt` | RED-frozen / RED-candidate / mutant-DETECTED | RED-frozen / **GREEN-candidate** |
| D10 `E-D10-calendar-week-is-seven-calendar-dates` | RED / RED / DETECTED | RED / **GREEN** |
| D16 `E-D16-seven-day-forecast-does-not-grade-a-month-late-read` | RED / RED / DETECTED | RED / **GREEN** |
| D17 `E-D17-undone-adjustment-is-not-described-as-applied` | RED / RED / DETECTED | RED / **GREEN** |
| D19 `P-D19-inclusive-break-end-prose-agrees-with-active-day` | RED / RED / DETECTED | RED / **GREEN** |
| D21 `E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date` | RED / RED / DETECTED | RED / **GREEN** |
| D23 `E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day` | RED / RED / DETECTED | RED / **GREEN** |
| D24 `E-D24-partial-yesterday-remains-owed-until-calories-are-present` | RED / RED / DETECTED | RED / **GREEN** |
| D25 `E-D25-zero-protein-successes-cannot-be-a-good-protein-read` | RED / RED / DETECTED | RED / **GREEN** |
| D27 `P-D27-maintenance-is-not-described-as-a-long-stalled-cut` | RED / RED / DETECTED | RED / **GREEN** |
| **D22** `E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash` | RED / RED / **mutant-DETECTED** | RED / RED / **AUDIT-FAIL** |

The `AUDIT-FAIL` token on the ten repaired rows is expected and benign: `run-defect-laws.cjs:56` requires `raw.status==='RED'`, so any law that turns GREEN on the candidate prints `AUDIT-FAIL` by construction — that is how the six already-repaired laws (D12, D33, D34, D35, D41, D43) print on the tip today. **D22 is different and is a real finding — §4.1.**
The `97/104 → 87/104` mutant drop is exactly the ten repaired laws' mutants, which report GREEN post-repair because a mutant restores `__auditOriginal`, which after the repair *is* the repaired function (the brief's §7 item 4). 89 GREEN repair controls unchanged.

### 3.2 Delta cells and negative controls — 93 cells per engine

`b1-scratch/cells.js`, the same cell list against `bundle('frozen')` and `bundle('candidate')`: **38 DIFF · 55 identical.**
Substantive diffs per defect, all inside the brief's enumerated delta lists: **D10 4** (+4 `plusDays` rows that read `ABSENT` on frozen — a probe artifact of a new export, the class the brief flags), **D8 3, D21 3, D19 4, D16 6, D17 2, D24 2, D25 1, D27 3** (+1 `weekDay` probe artifact: not exported by the frozen reference table), **D23 3**. Grouping differs from the brief's per-assertion counts because several brief "cells" are one probe here; every value matches the brief's published number.

Load-bearing negative controls, **identical on both engines**: `weeksBetween` at 0/3/7/365-day no-transition intervals (`1`, `0.42857142857142855`, `0`, `52.142857142857146`); `mk`/`isoOf`/`todayStart`/`daysUntil`/`fmtShort`/`DAY`; `cleanAtDate` at 5 h / 6.4 h / **6.5 h (the `DEBT_LAST_H` boundary) / 8 h / empty / night-on-or-after-iso / three 7 h / three 6.6 h (mean-3 branch still runs → `false`)**; `sleepMean3At`; `atSleepTarget` (`{"run":3,"at":true}`); `sleepInfo` on an ordinary and a spring-forward date (already `false`) and its other four cells; `dietBreakState`'s complete return on `recent` (`daysSince:1` — **zero-based `daysSince` unchanged**); `phaseArc`'s `cut`/`maintenance`/`leangain` lines and the `proposed` branch (`starts Thu 9/10`); D16's pre-due / due / grace rows and the no-read baseline (`tol:0.8`, the full ungraded calibration sentence); D17's `dismissed`/neither/both rows; D24's no-row, complete, empty-ledger and `cal`-but-no-`pro` rows, `owedLedger`'s `["2026-08-31","2026-09-02"]`, and the `MIDDAY` phase word; D25's `1/1`, `0/2`, `1/2`, `6/7`, no-rows and the other four levers; D27's committed-`cut` and absent-phase rows (both still `rung:"break"`), rung-1 `logging` at maintenance, and `phaseArc`'s `weeks`/`line`/`since`; D23's `pickStructural` partition at `last.h = 3` (**`{"main":null,"riders":[],"deferred":["hack"]}` on both** — the control that kills mutant 1), the non-hack debut, the two-argument `genSession` **TypeError** (still thrown), and the genuine rest week byte-identical with `iso` still absent.

**C1 evidence cell (the brief's condition C1), executed:** forecast `2026-11-01`, one read.
| read | frozen | candidate |
|---|---|---|
| `2026-11-07` (only the 6th calendar day) | `{graded:1,hit:true}` | **`{graded:0,hit:null}`** |
| `2026-11-08` (7th calendar day = due) | `{graded:1,hit:true}` | identical |
| `2026-11-09` (grace) | `{graded:1,hit:true}` | identical |
| `2026-11-10` | `{graded:1,hit:true}` | **`{graded:0,hit:null}`** |

This is exactly the divergence C1 names: the law's control adds `7*DAY` in milliseconds where the product rule adds seven calendar days. The control may serve as a result oracle for the September cases, never as the calendar-arithmetic oracle.

### 3.3 Source mutants — 32 named, 31 caught

`b1-scratch/run-mutants.js`: each mutant is an exact single-occurrence string replacement applied to a **copy** of the engine tree in `.tmp/b1-mutants/<id>/` (the worktree is never mutated); the defect's own v4 law is re-run against the mutated engine and the brief's named killer probes are compared with the repaired values. A syntax error or a missing target earns **no** kill (0 such cases).

```
MUTANTS 32 · CAUGHT 31 · NOT CAUGHT 1 · HARNESS 0
```

All CAUGHT: D10-1 `round-the-week-not-the-days` (`09-03→09-06` gives `0` vs `0.42857142857142855`), D10-3 `plusdays-adds-milliseconds` (`plusDays('2026-11-01',1)` → `'2026-11-01'`), D8-1 `stale-night-returns-false` (**law RED**), D8-2 `age-window-instead-of-last-night`, D8-3 `drop-the-three-night-mean`, D21-1 `tomorrow-is-plus-two-days` (**law RED** — the D8×D21 cross-case, confirming D8 does not neutralise D21 and the mutant does not survive it), D21-2 `use-today-instead-of-tomorrow` (**law RED**), D21-3 `hardcode-fallback-date` (killed by the 2027 and 2025 fall-back years), D19-1 `shift-daysSince-in-dietBreakState` (killed by the `dietBreakState` return pin: `daysSince` 6→7), D19-2 `resume-plus-one-millisecond-day` (killed by a break ending on `2026-11-01`: `resumes Mon 11/2` → `resumes Sun 11/1`), D19-3 `off-by-one-both-ends` (**law RED**, killed by the literal `of 7`), D16-1 `ungraded-counts-as-miss` (`rows[0].miss` `false`→`true`; note `misses` and `hasMiss` are **not** moved, so the kill is on the row field alone — as the brief says), D16-2 `grace-window-is-two-days` (**law RED**), D16-3 `drop-the-eligibility-filter` (sealed and offWindow due-day reads), D16-4 `calendar-add-by-milliseconds` (the C1 `2026-11-01` case), D17-1/2/3, D24-1/2/3, D25-2, D25-3, D27-1 `gate-longcut-only` (law GREEN, killed only by the purpose-written `rung === 'hold'` case → mutant gives `calories` — exactly the brief's reasoning), D27-2 `read-plan-phase-directly` (killed by the active-diet-break cell), D27-3 `gate-on-programme-week-and-phase` (see below), D23-2/3/4.

**NOT CAUGHT — `D10-2 utc-stamp-substitution`.** Replacing `weeksBetween` with the law's own control shape `(Date.UTC(..) - Date.UTC(..)) / 604800000` leaves the law GREEN and every probe byte-identical (`0.42857142857142855`, `1`, `52.142857142857146`). Only a source/alias check sees it: the mutated `dates.cjs` contains `Date.UTC` = `true`. **The brief predicts this exactly** ("killed by an alias trace showing a UTC constructor"). **Actionable: B1's package needs a source or alias assertion for D10 — no behavioural case can kill this mutant.**

**Two brief killer-cell errors found (the mutants are still caught, by different cells):**
- **`D25-1 require-a-majority`.** The brief names `1/2` and `6/7` as the killers. Measured, **neither kills**: repaired and mutant both return `good` for `1/2` (repair `1 >= 1`; majority `2 >= 2`) and for `6/7` (repair `6 >= 6`; majority `12 >= 7`). The real killer is **`2/4`**: repaired `caution`, mutant `good`. That cell is not in the brief.
- **`D23-1 default-slp-to-empty-object`.** The brief names the `last.h = 3` deferral cell. Measured, **it does not distinguish**: the fixture's lift has `e.w == null`, so `genSession` takes the `baselineAsk` branch and emits the same note and `tgt:[0,0,0]` whether or not the debut is active, and `pickStructural` called with an explicit `slp` is unaffected by a defaulted parameter. The mutant *is* caught, by the assertion the brief itself says does **not** flip — `genSession(s,'2026-09-03')` must still throw `TypeError` (`defect-witnesses-3.cjs:41`): repaired `"TypeError"`, mutant `"NO THROW"`.

**`D27-3` needed a purpose-written fixture the brief does not supply.** For `key === 'cut'`, `phaseArc`'s `startOf.cut` is `START`, so `arc.weeks` and `weekDay().wk` agree on almost every date; the two predicates diverge only for `diff ∈ [63, 69]` days after `START = 2026-06-10`. At `clock.today() = 2026-08-12` (`diff = 63`): `arc.weeks = 9`, `weekDay().wk = 10` → repaired `rung:"calories"`, mutant `rung:"break"`. Recorded here so the accepted brief can pin it.

### 3.4 Frozen witness flips — 18 assertions in 10 cells, measured

`b1-scratch/witness-flips.js`: a non-throwing `assert` Proxy over all three witness programs, run against a pristine engine copy and the patched engine, recording every assertion's line and outcome. The witness files are never modified on disk.

```
defect-witnesses.cjs    assertions pre=21 post=21   tails both "DEFECT WITNESSES: 10/10 …"
defect-witnesses-2.cjs  assertions pre=40 post=40   tails both "DEFECT WITNESSES 2: 11/11 …"
defect-witnesses-3.cjs  assertions pre=24 post=24   tails both "DEFECT WITNESSES 3: 5/5 …"
ASSERTIONS compared: 85 · FLIPS (pass->fail): 18
```

| file:line | assertion (pre-hunk value) → measured successor |
|---|---|
| `defect-witnesses.cjs:61` | `cleanAtDate({nights:[{d:"2026-01-01",h:5}]},"2026-09-03")` `false` → `true` |
| `defect-witnesses.cjs:71` | `\|weeksBetween("2026-03-08","2026-03-15") − 167/168\| < 1e-12` → `=== 1` |
| `defect-witnesses.cjs:72` | `\|weeksBetween("2026-11-01","2026-11-08") − 169/168\| < 1e-12` → `=== 1` |
| `defect-witnesses-2.cjs:93` | `r.graded` `1` → `0` |
| `defect-witnesses-2.cjs:94` | `r.rows[0].hit` `true` → `null` |
| `defect-witnesses-2.cjs:103` | `r.decisions[0].applied` `true` → `false` |
| `defect-witnesses-2.cjs:127` | `line.includes("day 6 of 7, 0 to go")` → `"day 7 of 7, 0 to go"` |
| `defect-witnesses-2.cjs:128` | `next.when === "resumes " + fmtShort("2026-09-07")` → `fmtShort("2026-09-08")` |
| `defect-witnesses-2.cjs:159` | `sleepInfo(s).clean` `true` → `false` |
| `defect-witnesses-3.cjs:48` | `workout.title` `"REST DAY"` → `"LOWER BODY · TODAY"` |
| `defect-witnesses-3.cjs:49` | `workout.today` `false` → `true` |
| `defect-witnesses-3.cjs:50` | `workout.iso` `undefined` → `"2026-09-03"` |
| `defect-witnesses-3.cjs:58` | `focus.clear` `true` → `false` |
| `defect-witnesses-3.cjs:59` | `owed.some(k==="yesterday")` `false` → `true` |
| `defect-witnesses-3.cjs:72` | `fiveLevers(s).protein.state` `"good"` → `"caution"` |
| `defect-witnesses-3.cjs:100` | `fix.rung` `"break"` → `"hold"` |
| `defect-witnesses-3.cjs:101` | `fix.title` → `"Nothing to fix — hold the line"` |
| `defect-witnesses-3.cjs:102` | `body.startsWith("You've held the deficit for weeks")` → `startsWith("The five are covered and the trend is doing its job")` |

**Both of the brief's predicted non-flips are confirmed:** `defect-witnesses-2.cjs:95` (`calibration.includes("7-day call")`) does **not** flip, and `defect-witnesses-3.cjs:41` (`assert.throws(() => genSession(s,'2026-09-03'), TypeError)`) does **not** flip. No other assertion in the 85 moved, in either direction. **10 cells: witnesses-1 D8 + D10; witnesses-2 D16, D17, D19, D21; witnesses-3 D23, D24, D25, D27.** The two pre-existing D12 failures at `defect-witnesses-2.cjs:51` and `:53` fail on **both** engines and are untouched by B1.

### 3.5 The B1 carrier — `rebuild/conform/v4/postfix/legacy-b1-carriers.cjs`

Authored as the **closed successor of `legacy-step-efficacy-carriers.cjs`**, per the brief's corrected §3 mechanism. It does **not** rewrite any witness file. It:
- extends `CARRIER_IDS` to 11 by adding `defect-witnesses` and `defect-witnesses-3`;
- pins all three witness files (`557c12e7…`, `Step.WITNESS_PIN = 833db043…`, `f5169beb…`) and verifies each against **both** `git show 614e2031:<path>` and disk before use (`B1-WITNESS-ORIGINAL-PIN` / `STEP-CARRIER-ORIGINAL-PIN`);
- applies the 18 reviewed successor expectations through `parent.exactReplace(source, before, after, site, edits)` — **each `before` verified to occur exactly once**, so no substitution can silently widen (`CARRIER-ONE-SITE`);
- for `defect-witnesses-2`, first delegates to `Step.prepareCarrier` to inherit the accepted D12 `slope`/`resolved` successors, then adds B1's six;
- delegates every non-witness id straight through to the Step parent;
- asserts each program's **own** accounting still holds: every `REPRODUCED` line present and the original printed tail.

```
CARRIER_IDS (11): migrate-source, merge-source, writers-source, defect-witnesses-5, migrate-differential,
                  defect-witnesses-2, second-gate, defect-witnesses-7, writers-differential,
                  defect-witnesses, defect-witnesses-3
ADDED by B1: defect-witnesses, defect-witnesses-3   covers gates: witnesses-1, witnesses-2, witnesses-3

PASS  defect-witnesses   / frozen   reproduced=10/10  substitutions=3  tail="DEFECT WITNESSES: 10/10"
PASS  defect-witnesses   / native   reproduced=10/10  substitutions=3  tail="DEFECT WITNESSES: 10/10"
PASS  defect-witnesses-2 / frozen   reproduced=11/11  substitutions=8  tail="DEFECT WITNESSES 2: 11/11"
PASS  defect-witnesses-2 / native   reproduced=11/11  substitutions=8  tail="DEFECT WITNESSES 2: 11/11"
PASS  defect-witnesses-3 / frozen   reproduced=5/5    substitutions=9  tail="DEFECT WITNESSES 3: 5/5"
PASS  defect-witnesses-3 / native   reproduced=5/5    substitutions=9  tail="DEFECT WITNESSES 3: 5/5"

B1 CARRIED WITNESSES: 6/6 PASS · 0 FAIL · 20 expectation substitutions (18 B1 + 2 inherited D12) · witness files untouched=true
```

Per-substitution `site` ids with before/after sha256 prefixes are printed by the run (`b1-scratch/carrier-run.txt`); e.g. `B1-D8-stale-night-is-unknown-not-debt before=55dcbdd424da after=bd72bdb61a48 occ=1`. Witness sha256s **after** the run are byte-identical to their pins:
`557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644`, `833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2`, `f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6`.

**Bare witness runs (no carrier), for the record.** Pre-hunk: `defect-witnesses.cjs` exit 0 `10/10`; `defect-witnesses-3.cjs` exit 0 `5/5`; `defect-witnesses-2.cjs` **exit 1** at `:51` (`actual: 0.1, expected: 100`) — the pre-existing D12 repair, already `coverage.covered`. Post-hunk: `defect-witnesses.cjs` exit 1 at the D8 cell (`actual: true, expected: false`); `defect-witnesses-3.cjs` exit 1 at the D23 cell (`actual: 'LOWER BODY · TODAY', expected: 'REST DAY'`); `defect-witnesses-2.cjs` exit 1 still at `:51` first. **B1 must carry these, never "fix" them, and must not expect a bare PASS** — exactly the brief's §3 warning, now measured on both sides.

**NOT authored here, by lane boundary:** the brief also asks for `rebuild/m4/spec/b1-inherited-carriers.cjs` and the `coverage.run → coverage.covered` move for `witnesses-1`/`witnesses-3` in the package artifact. `rebuild/m4/spec` is the **PM's exclusive** folder (`LANES.md` ownership table), so that half belongs to the closed-profile scaffold the tooling agent is building. The carrier exports `COVERS = ['witnesses-1','witnesses-2','witnesses-3']` and `runWitness(...)` so that child can consume it without re-deriving anything.

### 3.6 The 19 original gates — 2 move, and they are the predicted two

`b1-scratch/gates.js` runs every gate in `rebuild/conform/v4/postfix/run.cjs:9-23` on the patched tree and on a restored pristine copy.

| gate | pristine | patched | moved |
|---|---|---|---|
| migrate-source / merge-source / writers-source | exit=1 needle=N | exit=1 needle=N | – |
| **witnesses-1** | **exit=0 needle=Y** | **exit=1 needle=N** | **MOVED** |
| witnesses-2 | exit=1 needle=N | exit=1 needle=N | – |
| **witnesses-3** | **exit=0 needle=Y** | **exit=1 needle=N** | **MOVED** |
| witnesses-4 / witnesses-6 / merge-differential / merge-laws | exit=0 needle=Y | exit=0 needle=Y | – |
| witnesses-5 / witnesses-7 / migrate-differential / writers-differential | exit=1 needle=N | exit=1 needle=N | – |
| migrate-full | exit=1 needle=N | exit=1 needle=N | – |
| second-gate / conformance / selftest / strict | exit=1 needle=N | exit=1 needle=N | – |

```
gates moved by B1: 2 of 19
  witnesses-1  pristine terminal: DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged
  witnesses-3  pristine terminal: DEFECT WITNESSES 3: 5/5 reproduced; behavior intentionally unchanged
```

Both are carried GREEN by `legacy-b1-carriers.cjs` (§3.5). Every other gate's exit code and needle are unchanged, so **B1 moves no gate that is not already covered or already predicted**. `migrate-full` is verdict-only: `FAIL CLOSED M2-5 full migration gate: precondition or execution failure; details withheld` — **identical on both trees**; that is the private-preparation refusal the standing rule at `DECISIONS:98` requires every engine-package builder to report without the private fixture.

### 3.7 `load-write-package.cjs --ci` — the refusal, and its honest attribution

```
$ node rebuild/m4/spec/load-write-package.cjs --ci
LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
exit=1
```

**Honest caveat: that refusal is NOT attributable to B1.** Run on a restored pristine copy of the four files it is byte-for-byte the same line and the same exit code. This matches `DECISIONS.md:98`, which already records "load-write-package --ci is superseded on this tip (documented in B0 §1)".

The profile that **does** attribute the refusal to B1 is the live one. `native-carriers-package.cjs --ci`:
- **pristine** prints `POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` and then fails in a later child;
- **patched** never reaches that line — it fails in `Profile.verify()` first.

Calling the verifier directly gives the exact reason:

```
PATCHED : REFUSED code=ERR_ASSERTION msg=Unchanged parent pin: rebuild/engine/dates.cjs
PRISTINE: OK artifact=295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1 accepted=true
```

**`Unchanged parent pin: rebuild/engine/dates.cjs`** is the quotable refusal: B1 changes engine bytes pinned by the accepted NATIVE-CARRIERS artifact, which is precisely why B1 needs its own closed cumulative profile with `295762f0…` as its immutable parent. **This is expected and correct, not a defect.**
The later pristine-only child failure is environmental and unrelated to B1: the `focused` child's three `native-next-targets` tests fail with `Error: Cannot find module '@noble/hashes/sha2.js'` (`# pass 0 # fail 3`); `node_modules/@noble/hashes` is **not installed** by this worktree's `npm ci`. Flagged for the tooling agent; not B1's to fix.

### 3.8 Frozen conformance suite and the second gate

```
$ cd rebuild/conform && MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node run.cjs
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
exit=1
```

**Not `SUITE CONSISTENT` — and not because of B1.** With the locally rebuilt engine artifacts supplied, the run's three BAD lines are:
1. `BAD 2 port oracle main-vs-main under the manifest — all GREEN and exactly the frozen PORT ids — 7 ids`
2. `BAD 3 sensitivity: every leaf compared + semantic mutants DETECTED + old-vs-main DETECTED, exactly the frozen PORT ids — 9 ids`
3. `BAD 7 privacy: every private-fixture law line in the log is verdict-only (detail withheld in code) — 0 private lines`

(1) and (2) are the oracle steps that compare against `oracle/manifest.json`'s `engineSha256`, which a locally rebuilt esbuild bundle cannot match by construction (`build-engines.mjs`'s own note). (3) is the absent private fixture, which must stay absent off the owner's PC. **The decisive fact: the run is line-for-line identical to pristine.**

```
conform    : pristine 82 lines, patched 82 lines, differing = 0 ; tally both {BAD:6, OK:26, INFO:1}
second-gate: pristine  9 lines, patched  9 lines, differing = 0 ; tally both {FAIL:1}
```

So **B1 moves nothing in the frozen conformance suite**: all 99 reference laws GREEN and STRONG, the 29/70 absent/present family split unchanged, every OK and every BAD identical. A clean `SUITE CONSISTENT` is the PM's own PC execution with the pinned engine artifacts and the private fixture (`DECISIONS:92`, `:93` C4).

```
$ node rebuild/engine/test/second-gate.mjs --candidate
SECOND GATE I/O tripwire: PASS — a caught unmocked request fails the process; zero delegated requests
SECOND GATE reference FINAL108: 3072 passed, 0 failed
SECOND GATE reference vacuity gate — 9 known hit(s), baseline matched, nothing new
SECOND GATE reference SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8×
SECOND GATE reference surface: byte-identical to committed baseline (123077 bytes)
FAIL second gate candidate engine-test: exit=1
FAILED ASSERTION tools/engine-test.jsx:106
SECOND GATE candidate: FAIL — second gate failed; inspect ignored public diagnostic logs
exit=1
```

This is **exactly** the pre-existing D12 STEP-EFFICACY abort the brief predicts in §0.1 item 11 (`se7.resolved === false` at `tools/engine-test.jsx:106`), it is **identical on pristine**, and it is already `coverage.covered` byChild `second-gate` in `acceptance-native-carriers.json`. **Reported, not fixed.** The reference half is fully GREEN on both trees, including the byte-identical 123 077-byte surface baseline.

### 3.9 §6 Q5 re-measured independently, and the date-site census

```
Q5 pairs=220095  PRINTED (toFixed(1)) differences=0  raw-value differences=104422  "arc.weeks >= 10" decision differences=0
```
Over every `(since, today)` pair with `today − since ∈ [0, 200]` days across 2025–2027 (both transitions each year): `+(((mk(t)−mk(s))/DAY)/7).toFixed(1)` and `+(Math.round((mk(t)−mk(s))/DAY)/7).toFixed(1)` differ **0 times**, and the `arc.weeks >= 10` decision differs **0 times**, while the raw values differ 104 422 times. **The brief's claim holds: the `policy.cjs:554` rider is a printed no-op.** It is therefore free to include or omit; it is omitted here (§4.5).

Census by the brief's own method (`grep -cE` counts matching *lines*):
```
PRISTINE (HEAD): 71 lines  {energy:10, policy:4, seed:1, sleep:25, today:4, volume:2, writers:25}  setDate( = 0
PATCHED        : 67 lines  {energy:10, policy:3, seed:1, sleep:24, today:2, volume:2, writers:25}  setDate( = 1
```
**Reproduces the brief's 71 exactly, file by file**, and confirms `setDate(` appears **0** times in the pre-image engine — B1 introduces the engine's first calendar-shift primitive and removes 4 of the 71 millisecond-stepped sites. The other 67 remain open (brief §6 Q5).

## 4. Discrepancies versus the brief

### 4.1 BLOCKING — D8's repair silences `recoveryIndex`'s sleep flag for the engine's own normal night dating. Not enumerated anywhere in the brief.

**Symptom.** D22's row moves from `mutant-DETECTED` to `AUDIT-FAIL`. Its raw status, control and mutant are all unchanged (RED/RED, control GREEN, mutant RED); what breaks is `run-defect-laws.cjs:62`'s **frozen↔candidate call-trace parity** on D22's own fixture:

```
recoveryIndex(s) with s.sleep.nights = [{d:'2026-08-31',h:8},{d:'2026-09-01',h:8},{d:'2026-09-02',h:2}], clock.today() = '2026-09-03'
  frozen:    {"band":"WATCH","score":70,"factors":["sleep reset — 0 of 3 clean nights"]}
  candidate: {"band":"GREEN","score":100,"factors":[]}
```

**Mechanism, traced.** `recoveryIndex` (`sleep.cjs:219`) raises its sleep flag from `sleepInfo(s).clean` at `:239-240`. `sleepInfo` asks `cleanAtDate(s, tomorrow)` — and it must, because `cleanAtDate` filters `n.d < iso`, so only `iso = tomorrow` can include a night dated **today**; that is exactly what D21 repairs. D8's guard then requires `last.d === plusDays(iso, -1)`, i.e. with `iso = tomorrow`, a night dated **today**. Measured directly:

```
sleepInfo(.clean), newest night dated YESTERDAY (2026-09-02, h=2), today 2026-09-03:  frozen false → candidate true
sleepInfo(.clean), newest night dated TODAY     (2026-09-03, h=2), today 2026-09-03:  false on BOTH (control holds)
```

**Why this matters rather than being a cosmetic parity blip.** The engine's own night dating is the *evening/bed* date, and its own ledger never asks for a night dated today:
- `owedLedger` (`sleep.cjs:989`): `const ref = hour < 5 ? todayStart() − DAY : todayStart();` then `d = ref − k*DAY` for `k = 3…1` — i.e. **yesterday and earlier, never today**.
- `fiveLevers` (`today.cjs`): `darkD = round((tISO − newestN.d)/DAY) − 1`, so a night dated yesterday reads `0` (current) and one dated today reads `−1` (also current) — both conventions tolerated.
- `seed.cjs:221` dates each night by its `HISTORY` day; `rebuild/m3/w7-preview/fixtures.cjs:22` writes `{d, h:8, bed:"22:00", wake:"06:00"}` — bed-dated.
- `energy.cjs:1219` calls `cleanAtDate(s, today)`, which under D8 requires a night dated **yesterday** — the opposite anchor from `sleepInfo`'s.

So after B1, for the whole of any day until tonight's row exists, `sleepInfo(s).clean` is UNKNOWN/`true` and `recoveryIndex`'s named sleep flag cannot fire — including after a genuinely short last night. That removes a recovery check, which reads against the owner's own D8 wording at `DECISIONS.md:60`: *"…and no sleep restriction is applied today; **every other recovery check still applies**"*.

**Not an artefact of this implementation.** The hunk is verbatim from the brief, and the **D8 law's own repair control** encodes the same semantics (`laws-clock-and-as-of.cjs:25`: it keeps the nights only if `nights.some(n => n.d === isoOf(day − 1))`). The D8 law cannot see the consequence because its `run` calls `cleanAtDate` directly and never goes through `sleepInfo`. It surfaces only because `run-defect-laws.cjs` compares full call traces on a *neighbouring* law's fixture. The brief's §7 item 5 measured only raw GREEN/RED statuses ("no other law moves"), which is why it was missed.

**Candidate remedy for the reviewer — NOT applied here.** Keep `cleanAtDate`'s strict `iso − 1` guard (it is right for the eleven session-date and `energy.cjs:1219` call sites) and anchor `sleepInfo`'s question on the newest night's own date instead of the wall date, e.g. `clean: cleanAtDate(s, plusDays(<newest night date>, 1))` with the present `tomorrow` as the empty-history fallback. Checked by hand against both constraints: for a night dated `2026-11-01` at `today = 2026-11-01` it yields `iso = 2026-11-02`, `last.d === plusDays(iso,−1)` → D21 stays GREEN; for a night dated yesterday it yields `iso = today` → the flag fires again and D22's trace parity is restored. A loosening of `cleanAtDate` to accept `iso − 2` was rejected: it would contradict the brief's own enumerated D8 delta cell at 2 days old. **This needs an explicit decision before B1 is accepted; either the remedy lands in the brief, or the `recoveryIndex` change is enumerated as an intended delta and reconciled with the owner's D8 wording.**

### 4.2 The brief names 32 mutants, not 31
§5.4 says "the 31 named in §2". Counting §2: D10 3, D8 3, D21 3, D19 3, D16 4, D17 3, D24 3, D25 3, D27 3, D23 4 = **32**. All 32 were built and run.

### 4.3 Two named killer cells do not kill
`D25-1 require-a-majority` is not killed by the brief's `1/2` or `6/7` (measured `good` on both sides for both); the killer is `2/4`. `D23-1 default-slp-to-empty-object` is not killed by the brief's `last.h = 3` deferral cell; the killer is `defect-witnesses-3.cjs:41`'s surviving `TypeError`. Detail and measured values in §3.3. Both mutants are still caught, so the package's mutant claim holds — but the brief's cell table needs correcting, and `D27-3` needs the `2026-08-12` fixture supplied (§3.3).

### 4.4 `D10-2` is not killable behaviourally — the package needs a source assertion
Confirmed by execution (§3.3). The brief already says so; recording it here as an acceptance-bar item, because "a source-pin refusal, syntax error, missing target or timeout earns no kill" (`BRIEF-IMPORT-GUARDS.md:88`) means the D10 kill must come from a **positive** source/alias check, which does not exist yet.

### 4.5 §6 Q5 rider omitted, and an internal inconsistency about it
The `policy.cjs:554` → `weeksBetween` rider is presented in §2 D27 as discussion and in §6 Q5 as an **open PM question** ("in or out of D27's hunk?"), and §2 D27's hunk block does not contain it. It is therefore **not applied**. But §5.4's fidelity claim says "3+1+2 new delegate lines", which needs 2 in `policy.cjs` (`plusDays` + `weeksBetween`) and so implies the rider is in, while §0.1 item 2 says "policy.cjs 23 → 24 (25 with the §6 Q5 rider)", which implies it is out. **One of the two needs correcting before acceptance.** I re-measured the rider as a printed no-op myself (§3.9), so flipping it in costs one delegate line and one expression and changes no receipt, golden or decision.

### 4.6 `plusDays` delegate placement in `policy.cjs` and `sleep.cjs`
The brief says "after `:16`" for `policy.cjs` and "after `:21`" for `sleep.cjs`; both followed literally. Note `policy.cjs`'s delegate block **is** strictly alphabetical, and `:16` is `isoOf`, so the literal instruction breaks that ordering (alphabetical placement would be between `partitionRates` (`:20`) and `proteinTarget` (`:21`)). `sleep.cjs`'s block is not alphabetical, so `:21` there is simply a choice. Cosmetic; flagged so the accepted brief can settle it.

### 4.7 `plusDays` declaration placement in `dates.cjs`
Deviation recorded in full in §2 D10: placed above the `// Copied from frozen … fe516c1:311-311.` marker rather than between the marker and `weeksBetween`, to avoid attaching a frozen provenance to a new declaration and to keep `source-proof.cjs:11 declarationRanges()`'s naming of every existing declaration stable.

### 4.8 `build-engines.mjs` is broken on Windows
`ERR_UNSUPPORTED_ESM_URL_SCHEME … Received protocol 'c:'`. Pre-existing; worked around with the repo's own `legacy-gates.publicReferences` recipe (§3.0). Not fixed — it is not B1's file and not in the brief's scope.

### 4.9 `@noble/hashes` missing from this worktree's install
`npm ci --include=dev` gives 44 packages but no `node_modules/@noble/hashes`, so the `native-carriers` `focused` child fails `# pass 0 # fail 3` with `Cannot find module '@noble/hashes/sha2.js'` — **on the pristine tree too**. Environmental; for the tooling agent.

## 5. Open items for the reviewer

1. **§4.1 first — it is the only blocking one.** Decide the `sleepInfo` ↔ `cleanAtDate` currency anchor. Either take the remedy in §4.1 into the brief (D21's hunk changes; D8's stays), or accept the `recoveryIndex` change as an enumerated delta and reconcile it with the owner's "every other recovery check still applies". Until then B1 cannot claim "every other law's row unchanged", and D22's row is a genuine RED stop rather than a carried cell.
2. **Correct the brief's mutant table** (§4.2, §4.3): 32 not 31; `D25-1`'s killer is `2/4`; `D23-1`'s killer is the surviving `TypeError` at `defect-witnesses-3.cjs:41`; supply `D27-3`'s `2026-08-12` fixture.
3. **Add a source/alias assertion for D10** so `utc-stamp-substitution` earns a kill (§4.4). No behavioural case can do it.
4. **Settle §6 Q5** and fix whichever of §0.1 item 2 / §5.4 is wrong (§4.5). Measured free either way.
5. **Parent chain** — still unanswered (`rebuild/lanes/REQUESTS.md:3`; brief §5.3; `PLAN…v1.md:146` says B2→B1 while `:113`/`DECISIONS:94` say "B2 ∥ B1"). This branch is built on `acd3b67` and assumes `acceptance-native-carriers.json` `295762f0…` as B1's immutable parent. If the PM rules B2 first, every pre-image sha here must be re-taken at that head and this branch rebased.
6. **The m4/spec half of §3** is not authored here by lane boundary (§3.5): `b1-inherited-carriers.cjs`, the `coverage.run → coverage.covered` move for `witnesses-1`/`witnesses-3`, `acceptance-b1-grading-time-window.json` and `b1-grading-package.cjs`. The carrier exports `COVERS` and `runWitness` for that child.
7. **Delegate/declaration placement** (§4.6, §4.7) — cosmetic, but the accepted brief should state them so the diff is reproducible byte-for-byte.
8. **A1's batched CI re-seal rides on B1.** `DECISIONS.md:99` records that the "CI both OS" half of the A1 screens tier is deferred "to be closed in ONE batched re-seal at the next engine package (B1): add the CI step for the lockfile-only A1 tests, retire the old memory-only preview and its `# pass 19` child, re-pin rebuild.yml". Not done here (`.github/` is not lane B's and is not in the brief), but B1's closed profile must budget for it.
9. **D10's reach into B2/B3 files** is confirmed by measurement, not just argument: `weeksBetween('2026-03-02','2026-03-09') < 1` flips `true → false`, which is exactly the `weeksBetween(monday, r.d) < 1` predicate at `writers.cjs:1587,2432` and `migrate.cjs:301,1203`. B1 edits none of those bytes; B3's golden budget must anticipate them.
10. **Environmental, for the tooling agent:** `@noble/hashes` absent (§4.9) and `build-engines.mjs` Windows-broken (§4.8).

## 6. Reproduction

All helper scripts live **outside** the worktree, in `work/lane-b/b1-scratch/` — nothing generated is committed. Build products go to `<root>/.tmp/` (gitignored) and `rebuild/conform/engines/*.cjs` (gitignored by `rebuild/conform/.gitignore:2`). `git status` on this branch shows only the four engine files plus the new carrier.

```
node  = C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe   (v24.19.0)
npm   = node C:\Users\joeym\AppData\Local\nodejs\node_modules\npm\bin\npm-cli.js ci --include=dev   (44 packages)
env   = TZ=America/New_York  MEASURED_TEST_NOW=2026-09-03  ENGINE_MAIN=<main>  ENGINE_OLD=<old>

b1-scratch/build-frozen.js    frozen fe516c1 bundle via legacy-gates.publicReferences   (§3.0)
b1-scratch/runboth.js         45 laws, patched + restored-pristine, raw capture, row diff (§3.1)
b1-scratch/cells.js           93 delta/negative-control cells, frozen vs candidate       (§3.2)
b1-scratch/run-mutants.js     32 source mutants on copied engine trees                   (§3.3)
b1-scratch/witness-flips.js   non-throwing assert observer over the 3 witness programs   (§3.4)
b1-scratch/carrier-run.js     the B1 carrier, 3 files x 2 Date modes                     (§3.5)
b1-scratch/gates.js           all 19 original gates, patched vs pristine                 (§3.6)
b1-scratch/ci-both.js  + profile-verify.js   the --ci refusals and their attribution      (§3.7)
b1-scratch/suite-both.js + suite-diff.js     conform + second gate, line-for-line diff    (§3.8)
b1-scratch/q5.js  + census.js                the Q5 no-op proof and the date-site census  (§3.9)
```

Every harness that touches the worktree restores the four files in a `finally`-equivalent step and re-prints their sha256s; the restored hashes are `b51f3f1e0e94 / 6be0c6fb35fe / 4d6c244efa6b / f8d0397abd75`, matching §1 exactly at the end of every run.

**No frozen law was edited.** `rebuild/conform/v4/laws-clock-and-as-of.cjs` `cf1774660a73e9ee9186913a93cfd7604750c8f0ace9e7e15fb4e28f1bb6581c`, `laws-receipt-truth.cjs` `871a5fcad74a50e6d2c5ca29a3ecb229c391cb1c289cac50dff0bfc8df8547d1`, `laws-state-shape-and-failure.cjs` `104803f6ab038ee9b29404cd37b454f3b2f870c6cca81b94f25b835d39c5ed3a`, `helpers.cjs` `a9c03c7a…`, `run-defect-laws.cjs` `2819a7e0683158bb0f146cfd38dbb967960a2148ecc4664fcae5660a02a2a54c`, `postfix/run.cjs` `654288e073ea6815ce699c1eacb61c7030b0de0781b277477f3800fa06eb245a` — all byte-identical to the brief's §0 table. Where the brief and the code disagreed, the code was followed and the disagreement recorded in §4.
