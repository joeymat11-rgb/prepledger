# LANE B — B1 GRADING & TIME WINDOW — BUILD REPORT (speculative implementation)

**Status: SPECULATIVE. The brief is NOT accepted. Nothing here is merged or proposed for merge.**

> **SUPERSEDED IN ONE PLACE — read §7 first.** The independent review `rebuild/lanes/b/reviews/B1-REVIEW-r1.md` returned **ACCEPT WITH CHANGES**. §4.1's blocking finding was upheld, but **the remedy this report proposed in §4.1 was rejected** and a different one applied. §7 "POST-REVIEW r1" records what changed, every run re-executed by a third agent (the lane-B fixer, neither builder nor reviewer), and the new sha256s. Where §7 and §§0–6 disagree, **§7 wins**. §§0–6 are otherwise left exactly as the builder wrote them, as the record of what was measured at `ffa4243`.
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

---

# 7. POST-REVIEW r1 — the fix pass

**Author:** lane-B fixer (Opus), a third agent — not the builder of `ffa4243`, not the reviewer of `B1-REVIEW-r1.md`.
**Input:** `rebuild/lanes/b/reviews/B1-REVIEW-r1.md` — **ACCEPT WITH CHANGES**, eight enumerated changes, C1/C2/C7 blocking.
**Worktree:** `work/lane-b/b1`, reset hard to `origin/rebuild/lane-b-b1` @ `db9fe59` (clean tree) before any edit. Base for every comparison below: `acd3b67`.
**Node:** `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` v24.19.0. `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`. `package-lock.json` and `package.json` untouched (`git diff --name-only acd3b67 -- package-lock.json package.json` = empty).
**Privacy:** `rebuild/conform/private/` does not exist on this tree and was not created; `ledger/` was never opened; no `--full` was run. Private-touching gates are verdict-only.
**Scratch:** all helper scripts live **outside** the worktree, in `work/lane-b/fx1/`; build products in `fx1/.tmp/` (outside the repo). Nothing generated is committed.

## 7.1 What changed, and what did not

| review item | disposition |
|---|---|
| **C1** amend `sleepInfo` to the two-anchor form; do NOT narrow D8's guard; do NOT adopt §4.1's remedy | **APPLIED** — §7.2 |
| **C2** brief amendment carrying C1 + a purpose-written D8×D21 cross-case cell | **APPLIED** — `BRIEF-B1-GRADING-TIME-WINDOW-v1.2.md` §0.0 A1/A2 and `rebuild/engine/test/b1-delta-cells.cjs` |
| **C3** correct the mutant table (32 not 31; `D25-1` → `2/4`; `D23-1` → the surviving `TypeError`; `D27-3` → `2026-08-12`) | **APPLIED** — brief v1.2 §0.0 A4 items 1–4, each re-measured here (§7.5) |
| **C4** D10 needs a positive source/alias assertion — `D10-2` is behaviourally unkillable | **RECORDED as a contract requirement** — brief v1.2 §0.0 A4 item 5; independently re-confirmed here (§7.5). The assertion itself belongs to the package artifact (C7) and is **not** authored by lane B |
| **C5** enumerated delta cells for D16's `dueISO` and D24's `yISO` | **APPLIED** — `rebuild/engine/test/b1-delta-cells.cjs`, with executed bite proof (§7.7) |
| **C6** settle §4.5 (the `policy.cjs:554` rider) and the delegate/declaration placements | **SETTLED** — brief v1.2 §0.0 A4 items 6–7: rider **OUT**, §0.1 item 2 correct, §5.4's "3+1+2" wrong; the arithmetic is 3+1+1 = **5** new delegate lines. No code change (the rider was already out) |
| **C7** author the `rebuild/m4/spec` half | **NOT DONE, by lane boundary** (`LANES.md` ownership table). Unchanged from the builder's position. B1 still has no gate that can say PASS |
| **C8** escalate `@noble/*` | **DOCUMENTED ONLY** — §7.10. `package.json` deliberately **not** changed |

**Exactly one engine byte-change was made in this pass**, plus one new test file:

```
 M rebuild/engine/sleep.cjs                      (sleepInfo only; +3 lines, 1957 -> 1963)
?? rebuild/engine/test/b1-delta-cells.cjs        (new, 106 lines)
 M rebuild/lanes/b/BUILD-REPORT-B1.md            (this section)
 A rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.2.md
```

`dates.cjs`, `policy.cjs`, `today.cjs` and `legacy-b1-carriers.cjs` are **byte-identical to `db9fe59`** — their sha256s in §1's AFTER column are unchanged. The other nine hunks are untouched.

## 7.2 The C1 hunk, exactly as applied

`rebuild/engine/sleep.cjs`, `sleepInfo` (frozen counterpart `fe516c1:14453-14458`):

```js
// before (shipped at db9fe59)
function sleepInfo(s) {
  const n = s.sleep.nights;
  const tomorrow = plusDays(isoOf(todayStart()), 1);
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at, clean: cleanAtDate(s, tomorrow), last: n[n.length - 1], need: s.sleep.needed };
}
// after
function sleepInfo(s) {
  const n = s.sleep.nights;
  const today9 = isoOf(todayStart());
  const tomorrow = plusDays(today9, 1);
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at,
    clean: cleanAtDate(s, today9) && cleanAtDate(s, tomorrow),   /* D8xD21 — the current night is the one bed-dated YESTERDAY, or a same-date row if one exists */
    last: n[n.length - 1], need: s.sleep.needed };
}
```

D8's guard in `cleanAtDate` is **not** narrowed. §4.1's proposed remedy (`cleanAtDate(s, plusDays(<newest night date>, 1))`) is **not** adopted: the reviewer's executed `rem1` showed it makes `plusDays(iso, −1) === newest.d` identically, switching D8 off at the call site and reinstating the carry-forward the owner's ruling removes.

## 7.3 The frozen bundle (built by this pass, from the repo's own recipe)

`build-engines.mjs` is still Windows-broken (§4.8, unfixed — not lane B's file). Built with `legacy-gates.publicReferences({baseline, scratch, sourcePins: manifest.baseline.buildSources})`, 10 source pins:

```
sourcePins entries: 10
main -> fx1/.tmp/main/engine.cjs  bytes=813681  sha256=180de4e25cb16f302f9ff83acdad9aedaf906e5932ba9d9ca2cae764bb88ae3a
old  -> fx1/.tmp/old/engine.cjs   bytes=792791  sha256=7e4e9dab74023659ef89dd52a5281149149202d609ab8668816cbd1b3d3a1a99
```

Byte count and sha differ from the builder's (813 696) and the reviewer's (813 681 / different path) purely by esbuild entry-path length, exactly as `build-engines.mjs` documents. `fe516c1:src/app.jsx` is verified at blob `f98671d8…` by `helpers.cjs:17` on every run.

## 7.4 The 45 laws — 10 rows move, not 11, and D22's trace parity is back

One harness, two runs, the four engine files restored from `acd3b67` for the base run and rewritten from memory afterwards (sha256s re-printed and matched at the end).

```
[cand] TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
[base] TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL

ROWS MOVED 10 · UNCHANGED 35 · moved ids: D8,D10,D16,D17,D19,D21,D23,D24,D25,D27
printed lines: base=47 cand=47 differing=11   (the ten rows + the TOTAL line)
```

Every moved row reads `RED-frozen / GREEN-candidate / AUDIT-FAIL`, and `RED-frozen / RED-candidate / mutant-DETECTED` on base. **`D22` is no longer in the list** — it is one of the 35 byte-identical rows.

Per-law `inspect()` on the three variants, from one harness that swaps only `sleep.cjs`:

```
sleep.cjs fixed    sha256=77ced98c0b31c085e04da348592e936ce79dc85496a9df3febaef27e77380ffd
[fixed  ] D22 raw RED/RED · ctl GREEN/GREEN · mut RED · detailParity=true · framesParity=TRUE   · frames 2/2
[fixed  ] D21 raw RED/GREEN · ctl GREEN/GREEN · framesParity=false · frames 1/2 [sleepInfo] -> [sleepInfo>cleanAtDate]
[fixed  ] D8  raw RED/GREEN · ctl GREEN/GREEN · framesParity=false · frames 3/3
sleep.cjs shipped sha256=6be0c6fb35fe31955833cba1140f8afbfe9be3f82749da1f2532c5a1aa4068ef
[shipped] D22 raw RED/RED · ctl GREEN/GREEN · mut RED · detailParity=true · framesParity=FALSE  · frames 2/2
[shipped] D21 ... framesParity=false · frames 1/2 [sleepInfo] -> [sleepInfo>cleanAtDate]
sleep.cjs base    sha256=3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0
[base   ] D22 raw RED/RED · framesParity=true · frames 2/2
[base   ] D21 raw RED/RED · framesParity=true · frames 1/1 [sleepInfo] -> [sleepInfo]
```

**The second `cleanAtDate` call adds no traced frame**: D21's frame list is `[sleepInfo] → [sleepInfo>cleanAtDate]` on the **shipped** candidate *and* on the fixed one — identical. D8's and D21's `framesParity=false` is by construction (they are the repaired laws; their product values are supposed to differ from frozen) and is unchanged from the shipped candidate. The only frames-parity movement anywhere in the 45 is D22's, back to `true`.

The cross-case, measured directly on the three variants (all fixtures invented):

```
                                            base acd3b67   shipped db9fe59   FIXED
A newest night bed-dated YESTERDAY, h=2      clean=false    clean=TRUE        clean=false   <- the regression, repaired
B a night bed-dated TODAY, h=2               clean=false    clean=false       clean=false   (D21's case, control holds)
C newest night 3 DAYS OLD, h=2               clean=false    clean=true        clean=true    (D8 clause 1: no carry-forward)
D D21 witness (today 2026-11-01, night 2026-11-01 h=1)
                                             clean=true     clean=false       clean=false   (the D21 flip survives)
E empty history                              clean=true     clean=true        clean=true
```

Line D is the one that decides the carrier: because it still reads `false`, the substitution `B1-D21-fall-back-same-date-night-counts` is **unchanged**.

## 7.5 Mutants — 32 named re-run, plus one the fixer added

Same harness design as the reviewer's: each mutant is an exact **single-occurrence** string edit applied in place, the four engine files restored between runs, and then (a) the defect's own v4 law, (b) **D22's frames parity** (added by this pass — the detector the shipped candidate needed and nobody had), (c) all three B1 witness carriers and (d) a 90-cell value battery are re-measured against the unmutated repaired baseline. A syntax error or missing target earns **no** kill. The three `D21-*` anchors were re-pointed at the new `plusDays(today9, 1)` line; their semantics are unchanged.

```
BASELINE law statuses: {"D8":"GREEN","D10":"GREEN","D16":"GREEN","D17":"GREEN","D19":"GREEN","D21":"GREEN",
                        "D22":"RED","D22_framesParity":"true","D22_mutants":"RED","D23":"GREEN","D24":"GREEN",
                        "D25":"GREEN","D27":"GREEN"}
BASELINE carrier      : {"defect-witnesses":"PASS","defect-witnesses-2":"PASS","defect-witnesses-3":"PASS"}
BASELINE probe count  : 90

MUTANTS 33 · CAUGHT 32 · NOT CAUGHT 1 · HARNESS 0
  of which the BRIEF's 32 named: 32 · CAUGHT 31 · NOT CAUGHT 1
  plus 1 fixer-authored (D21-4 drop-the-today-anchor): CAUGHT
```

**`D10-2 utc-stamp-substitution` — NOT CAUGHT, NOTHING MOVED.** Third independent confirmation (builder, reviewer, fixer). Not one of the 90 battery cells, not one law row, not one carrier. C4 stands.

**The three corrected killers, re-measured here, each the *sole* detector that moved:**

```
CAUGHT   D25-1 require-a-majority             own cells D25.two_of_4            <- the 2/4 cell, not 1/2 and not 6/7
CAUGHT   D23-1 default-slp-to-empty-object    carrier defect-witnesses-3        <- the surviving TypeError, per the builder
CAUGHT   D27-3 gate-on-programme-week-and-phase   own cells D27.week9_cut       <- START + 63 days = 2026-08-12
```

`D25.two_of_4` = repaired `caution`, mutant `good`. `D27.week9_cut` = `2026-08-12 | weeks=9 | wk=10 | rung=calories` repaired, `rung=break` mutated. `D23-1`'s detector is the carrier because `defect-witnesses-3.cjs:41` (`assert.throws(() => genSession(s,'2026-09-03'), TypeError)`) is the only assertion that distinguishes the defaulted parameter — the assertion the brief itself lists as a **non-flip**.

**The fixer's own mutant:**

```
CAUGHT   D21-4 drop-the-today-anchor
     D22 framesParity true->false
     own cells D21.xD8_lastNightShort
     cross cells X.clean_lastNightYesterdayShort, X.recovery_lastNightYesterdayShort
```

This is the mutant the shipped candidate could not have carried, because the shipped candidate *was* it.

## 7.6 Hunk-revert bites — the reviewer's 13, re-run, plus a 14th

Every one of B1's hunks reverted to its frozen form, one at a time, measured against the defect's v4 law, D22's frames parity, all three carriers and the 90-cell battery. The D21 revert was re-expressed for the v1.2 hunk (the whole `sleepInfo` body goes back).

```
HUNK REVERTS 14 · CAUGHT 14 · NOT CAUGHT 0 · HARNESS 0
```

| revert | detected by |
|---|---|
| D10 `weeksBetween` | law D10 GREEN→RED · carrier `defect-witnesses` · 3 cells |
| D8 guard | law D8 GREEN→RED · carrier `defect-witnesses` · 6 cells incl. `X.clean_threeDaysOldShort` |
| **D21 `sleepInfo` hunk (v1.2 two-anchor)** | law D21 GREEN→RED · **D22 framesParity true→false** · carrier `defect-witnesses-2` · 5 cells |
| **D8×D21 second anchor only (back to the shipped form) — the fixer's 14th bite** | **D22 framesParity true→false** · 3 cells (`D21.xD8_lastNightShort`, `X.clean_lastNightYesterdayShort`, `X.recovery_lastNightYesterdayShort`) — **no law, no carrier** |
| D19 `resumeISO` | law D19 · carrier `defect-witnesses-2` · 7 cells |
| D19 one-based break day | law D19 · carrier `defect-witnesses-2` · 3 cells |
| D16 grace + eligibility filter | law D16 · carrier `defect-witnesses-2` · 5 cells |
| **D16 `dueISO` calendar** | **no law, no carrier** — only `D16.C1_2026-11-07`, `D16.C1_2026-11-09` |
| D17 `!a.undone` | law D17 · carrier `defect-witnesses-2` · 2 cells |
| D24 calorie predicate | law D24 · carrier `defect-witnesses-3` · 1 cell |
| **D24 `yISO` calendar** | **no law, no carrier** — only `D24.msKiller_0309` |
| D25 first-success | law D25 · carrier `defect-witnesses-3` · 1 cell |
| D27 phase gate | law D27 · carrier `defect-witnesses-3` · 3 cells |
| D23 workout scan | law D23 · carrier `defect-witnesses-3` · 4 cells |

The three bolded rows are the three hunks with no law and no carrier behind them. All three now have a committed cell (§7.7); until this pass, all three rested on scratch files that were never committed.

## 7.7 The new purpose-written cells — `rebuild/engine/test/b1-delta-cells.cjs`

New file, 106 lines, 6 855 bytes, sha256 `f887c59c78f1417006aff0674ba9bf1ce292c704d2fa683f309f5a1ae329c429`. It edits nothing: no frozen law, no golden, no witness byte, no existing test. It asserts the **repaired** behaviour (it is not a defect witness), and each fixture sits on a date where a 24-hour step and a calendar step disagree, so a cell cannot pass for the wrong reason.

```
$ TZ=America/New_York MEASURED_TEST_NOW=2026-09-03 node rebuild/engine/test/b1-delta-cells.cjs
CELL B1-D16-due-date-is-seven-calendar-days-not-168-hours
CELL B1-D24-yesterday-is-the-previous-calendar-date-not-24-hours-ago
CELL B1-D8xD21-a-short-last-night-still-restricts-recovery
B1 DELTA CELLS: 3/3 hold; D16 dueISO, D24 yISO and the D8xD21 cross-case
exit=0
```

The D8×D21 assertion, in one line:

```js
assert.equal(T.sleepInfo(withNights([...recent, { d: "2026-09-02", h: 2 }])).clean, false);   // today = 2026-09-03
```

with four controls beside it: `recoveryIndex(...)` must read `band === "WATCH"` with a `sleep reset…` factor; a 3-day-old 2 h night and empty history must read `clean === true` (D8 clause 1); a same-date night must read `clean === false` at `2026-09-03` and at the fall-back `2026-11-01` (D21 survives).

**Executed bite proof — a cell that cannot fail is not evidence:**

```
repaired candidate (expect exit=0)                        exit=0  cellsPassed=3/3  ALL HOLD
base acd3b67 (expect NON-zero)                            exit=1  cellsPassed=0/3  FAILS at cell 1  TypeError: T.plusDays is not a function
REVERT D16 dueISO calendar (expect NON-zero)              exit=1  cellsPassed=0/3  FAILS at cell 1  AssertionError
REVERT D24 yISO calendar (expect NON-zero)                exit=1  cellsPassed=1/3  FAILS at cell 2  AssertionError
REVERT D8xD21 second anchor (shipped form)                exit=1  cellsPassed=2/3  FAILS at cell 3  AssertionError
REVERT D8 guard                                           exit=1  cellsPassed=2/3  FAILS at cell 3  AssertionError
```

On base the file fails at cell 1 with `T.plusDays is not a function` rather than an assertion, because the primitive does not exist pre-B1 — an honest RED against an absent export, stated here rather than presented as a behavioural kill.

## 7.8 The carrier and the witness flips — both unchanged

```
PACKAGE_ID   : M2-B1-GRADING-TIME-WINDOW
COVERS       : witnesses-1, witnesses-2, witnesses-3
substitutions declared: 18
  defect-witnesses.cjs   on disk sha256=557c12e7…  pin=557c12e7…  MATCH=true
  defect-witnesses-2.cjs on disk sha256=833db043…  pin=833db043…  MATCH=true
  defect-witnesses-3.cjs on disk sha256=f5169beb…  pin=f5169beb…  MATCH=true
  PASS  defect-witnesses   [native]  reproduced=10  tail="DEFECT WITNESSES: 10/10"    edits=3  carrierHash=c2ea4423ec9b014a
  PASS  defect-witnesses   [frozen]  reproduced=10  tail="DEFECT WITNESSES: 10/10"    edits=3  carrierHash=c2ea4423ec9b014a
  PASS  defect-witnesses-2 [native]  reproduced=11  tail="DEFECT WITNESSES 2: 11/11"  edits=8  carrierHash=a766bfe0abffc05d
  PASS  defect-witnesses-2 [frozen]  reproduced=11  tail="DEFECT WITNESSES 2: 11/11"  edits=8  carrierHash=a766bfe0abffc05d
  PASS  defect-witnesses-3 [native]  reproduced=5   tail="DEFECT WITNESSES 3: 5/5"    edits=9  carrierHash=de59fa01b12e73ef
  PASS  defect-witnesses-3 [frozen]  reproduced=5   tail="DEFECT WITNESSES 3: 5/5"    edits=9  carrierHash=de59fa01b12e73ef
B1 CARRIER: 6/6 PASS   total in-memory edits applied across the 6 runs = 40
```

**Flips re-measured against base `acd3b67`** on a non-throwing assert observer, the witness files never modified on disk:

```
defect-witnesses.cjs    pre=21 post=21   tails both "DEFECT WITNESSES: 10/10 …"
defect-witnesses-2.cjs  pre=40 post=40   tails both "DEFECT WITNESSES 2: 11/11 …"
defect-witnesses-3.cjs  pre=24 post=24   tails both "DEFECT WITNESSES 3: 5/5 …"
ASSERTIONS compared: 85 · FLIPS (pass->fail): 18
FLIP LINES: defect-witnesses.cjs:61,71,72 · defect-witnesses-2.cjs:93,94,103,127,128,159 ·
            defect-witnesses-3.cjs:48,49,50,58,59,72,100,101,102
```

**The count did not change: still 18, at exactly the same 18 lines as §3.4.** So the carrier's substitutions required **no** edit — `legacy-b1-carriers.cjs` is byte-identical to `db9fe59` (`d8d98b24…`). Both predicted non-flips still hold (`defect-witnesses-2.cjs:95`, `defect-witnesses-3.cjs:41`), and the two pre-existing D12 failures at `:51`/`:53` still fail on **both** engines. The 6/6 PASS is itself the proof that each substituted expectation now equals the repaired value — `defect-witnesses-2.cjs:159`'s `sleepInfo(s).clean → false` included.

## 7.9 The gates, the conform suite and the second gate

**19 original gates, repaired vs base `acd3b67`** (`postfix/run.cjs` GATES, own harness):

```
gates moved by B1 (r1-fixed): 2 of 19
  witnesses-1  base exit=0 needle=Y  ->  repaired exit=1 needle=N   (base terminal: DEFECT WITNESSES: 10/10 reproduced)
  witnesses-3  base exit=0 needle=Y  ->  repaired exit=1 needle=N   (base terminal: DEFECT WITNESSES 3: 5/5 reproduced)
```

Exactly the two the brief predicts, both carried GREEN by `legacy-b1-carriers.cjs`. **The new `b1-delta-cells.cjs` file moves no gate.** Every other gate's exit code and needle are identical on both trees, `migrate-full` included (verdict-only).

**Conform suite and second gate — identical to pristine, 0 differing lines in all four streams.** Both were run from the *same* worktree with only the four engine files swapped, which removes the two absolute-path lines the reviewer saw:

```
[conform cand] exit=1 stdout=82 stderr=1   terminal: SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
[conform base] exit=1 stdout=82 stderr=1   terminal: (the same line, byte for byte)
[secgate cand] exit=1 stdout=7 stderr=4
   SECOND GATE I/O tripwire: PASS — a caught unmocked request fails the process; zero delegated requests
   SECOND GATE reference FINAL108: 3072 passed, 0 failed
   SECOND GATE reference condition-origin counts: {"runtime-derived-expression":2629,"source-and-runtime-mixed":9,"runtime-capability-or-mixed":69,"source-or-asset-expression":337,"carrier-or-mixed":17,"fixture-or-local-harness":11}
   SECOND GATE reference vacuity gate — 9 known hit(s), baseline matched, nothing new
   SECOND GATE reference SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8×
   SECOND GATE reference surface: byte-identical to committed baseline (123077 bytes)
   [stderr] FAIL second gate candidate engine-test: exit=1 / FAILED ASSERTION tools/engine-test.jsx:106 /
            SECOND GATE candidate: FAIL — second gate failed; inspect ignored public diagnostic logs
[secgate base] exit=1 stdout=7 stderr=4   (the same seven and four lines)

conform stdout    : base=82 cand=82 DIFFERING=0
conform stderr    : base=1  cand=1  DIFFERING=0
second-gate stdout: base=7  cand=7  DIFFERING=0
second-gate stderr: base=4  cand=4  DIFFERING=0
```

**The three refusals, re-measured on the fixed tree:**

```
native-carriers-profile.verify()  REFUSED  code=ERR_ASSERTION  message=Unchanged parent pin: rebuild/engine/dates.cjs
load-write-package.cjs --ci       exit=1   LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
native-carriers-package.cjs --ci  exit=1   NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
```

The first is B1's own and is correct — it is the mechanical proof that B1 needs its own closed successor profile (C7). The other two are pre-existing and identical on base (`DECISIONS:98` already records `load-write-package --ci` as superseded on this tip).

## 7.10 `@noble/*` — documented, not fixed (C8)

`package.json` on this branch declares dependencies `react 19.2.8`, `react-dom 19.2.8` and devDependencies `esbuild 0.28.1`, `jsdom 30.0.0`, `yaml 2.9.0` — **no `@noble/hashes`, no `@noble/ciphers`** — while **11 files under `rebuild/` import them**: `rebuild/m3/w5/reconciliation/codec.cjs:4`, `rebuild/m3/w5/source/codec.cjs:5`, `rebuild/m3/w5/test/r1-streaming-digest.test.cjs:4`, `rebuild/m3/w6/frame-crypto.mjs:1`, `rebuild/m3/w6/frame-format.mjs:1-2`, `rebuild/m3/w6/node-sha256-browser.mjs:1-3`, `rebuild/m3/w6/test/frame-browser-entry.mjs:2`, `rebuild/m3/w6/test/frame-codec.test.mjs:4-5`, `rebuild/m3/w6/build-browser.mjs:50`, `rebuild/m3/w7-preview/today/build.mjs:88`, `rebuild/m3/w7-preview/today/test/package.test.cjs:72`. `package-lock.json` mentions `@noble/hashes` only as another package's `^1.8.0 || ^2.0.0` requirement (lines 658, 661), and `Test-Path node_modules\@noble` → **False**.

**`package.json` was deliberately NOT changed.** It is pinned by the accepted NATIVE-CARRIERS artifact, and a dependency declaration is an integrator/tooling decision, not an engine-package one. Proposed cross-lane request line, for the PM to file verbatim in `rebuild/lanes/REQUESTS.md` (not written there by this pass: that file is cross-lane and would collide with other lanes' lines):

```
2026-09-11 · B → PM/tooling · DECLARE @noble/hashes and @noble/ciphers in package.json (11 requirers under rebuild/; npm ci --include=dev installs 44 packages and no node_modules/@noble) · the ACCEPTED parent gate native-carriers-package --ci cannot be reproduced from a clean clone on ANY tree, so neither builder, reviewer nor fixer could demonstrate that B1 leaves the parent package intact — and DECISIONS:98's recorded --ci PASS depended on a pre-existing node_modules; also consider fixing build-engines.mjs's Windows ERR_UNSUPPORTED_ESM_URL_SCHEME break, since the owner's PC is the --full host
```

## 7.11 sha256 of every file this branch touches, after the fix

| file | sha256 @ base `acd3b67` | sha256 @ shipped `db9fe59` | **sha256 now** | bytes | lines |
|---|---|---|---|---|---|
| `rebuild/engine/dates.cjs` | `19e9ce7e…3dff6` | `b51f3f1e0e94c6d7c1ae08d9049db6338e51c70e451674e3a87d94bf190fe067` | **unchanged** | 1 343 | 29 |
| `rebuild/engine/sleep.cjs` | `3dd34e11…45da0` | `6be0c6fb35fe31955833cba1140f8afbfe9be3f82749da1f2532c5a1aa4068ef` | **`77ced98c0b31c085e04da348592e936ce79dc85496a9df3febaef27e77380ffd`** | 185 554 | 1 963 |
| `rebuild/engine/policy.cjs` | `a1d21404…3768d` | `4d6c244efa6b34daed02e194dbbd5b7064abcde2d93fd28974a5f2df519187e1` | **unchanged** | 56 859 | 830 |
| `rebuild/engine/today.cjs` | `397532ec…bdbb8` | `f8d0397abd75c02dd570741191124c32e26ab850702607826943d4394fda2e00` | **unchanged** | 47 093 | 641 |
| `rebuild/conform/v4/postfix/legacy-b1-carriers.cjs` | *(absent)* | `d8d98b247271d9b4f5ac50f2b7205b1820db4ff72ad6bb53ee2e0d6ccbb002bf` | **unchanged** | 12 838 | 187 |
| `rebuild/engine/test/b1-delta-cells.cjs` | *(absent)* | *(absent)* | **`f887c59c78f1417006aff0674ba9bf1ce292c704d2fa683f309f5a1ae329c429`** | 6 855 | 106 |
| `rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.2.md` | *(absent)* | *(absent)* | **`b248bc4bc4e4306a7c7e813b8afdfea3194c034ecf76cbf707aaf1ef20e89b7f`** | 104 383 | 569 |

(v1.1 is left in place, byte-identical, as the document the review was written against. This report's own sha256 is not listed because writing it changes it; `git show` on the commit is the authority.)

**Untouched, verified by sha256 on disk rather than by claim:**

```
rebuild/conform/v4/laws-clock-and-as-of.cjs        cf1774660a73e9ee9186913a93cfd7604750c8f0ace9e7e15fb4e28f1bb6581c
rebuild/conform/v4/laws-receipt-truth.cjs          871a5fcad74a50e6d2c5ca29a3ecb229c391cb1c289cac50dff0bfc8df8547d1
rebuild/conform/v4/laws-state-shape-and-failure.cjs 104803f6ab038ee9b29404cd37b454f3b2f870c6cca81b94f25b835d39c5ed3a
rebuild/conform/v4/run-defect-laws.cjs             2819a7e0683158bb0f146cfd38dbb967960a2148ecc4664fcae5660a02a2a54c
rebuild/conform/v4/postfix/run.cjs                 654288e073ea6815ce699c1eacb61c7030b0de0781b277477f3800fa06eb245a
rebuild/engine/test/defect-witnesses.cjs           557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644
rebuild/engine/test/defect-witnesses-2.cjs         833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2
rebuild/engine/test/defect-witnesses-3.cjs         f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6
package.json                                       a201428565aae9426d47a2f42c027cce9d9aaae46775f91029e271d0eb10195c
package-lock.json                                  b745ab5e0c982ef61db59fc0b7df5deb0f540af9e0e59a015a11443171210608
```

`git diff --name-only acd3b67 -- <the three laws files> tools rebuild/conform/goldens <the three witnesses> package-lock.json package.json` = **empty**.

## 7.12 What this pass could NOT do

1. **C7 — the `rebuild/m4/spec` half is still unauthored** (`acceptance-b1-grading-time-window.json`, `b1-grading-package.cjs`, `b1-inherited-carriers.cjs`, the `witnesses-1`/`witnesses-3` `coverage.run → coverage.covered` move). PM/tooling territory per `LANES.md`. **There is still no gate that can say PASS for B1**, and the new `b1-delta-cells.cjs` must be added to that artifact's required list alongside the carrier.
2. **C4's source/alias assertion for D10 is specified, not implemented** — it belongs to the package artifact (C7). `D10-2` remains unkilled.
3. **`--full` and the private census are unrun**, by design (`DECISIONS:92`, `:93` C4). D16 is B1's only LIVE-TRIGGERED defect; a census change on any of the other nine is a RED stop, and only the owner's PC with the private fixture can tell.
4. **Browser/host surfaces unexercised** — `D24`'s `nowFocus` and `D23`'s `workout` are rendered surfaces and nothing here drives the phone bundle or the W7 Today page.
5. **`build-engines.mjs`'s Windows break is not fixed** (not lane B's file, not in the brief).
6. **The UNKNOWN-recovery question is not closed.** A missing or stale last night still makes `recoveryIndex` read GREEN/100 with zero flags in every variant. The owner's D8 word was *UNKNOWN*; the flag model has no third state. PM ruling needed.
7. **`STATUS.md` was not edited** (instructed), and `REQUESTS.md` was not edited (cross-lane; the proposed line is quoted in §7.10 instead).

## 7.13 Reproduction

All helper scripts live in `work/lane-b/fx1/`, outside the worktree; build products in `fx1/.tmp/`. Nothing generated is committed.

```
node  = C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe   (v24.19.0)
env   = TZ=America/New_York  MEASURED_TEST_NOW=2026-09-03  ENGINE_MAIN=<main>  ENGINE_OLD=<old>

fx1/build-frozen.js    frozen fe516c1 bundle via legacy-gates.publicReferences        (§7.3)
fx1/runboth.js         45 laws on candidate + restored-base, row-by-row diff          (§7.4)
fx1/frames-compare.js  + frames-child.js   D8/D21/D22 inspect() on 3 sleep.cjs variants, and the cross-case  (§7.4)
fx1/battery-child.js   90-cell battery + 11 law statuses + D22 frames parity + 3 carriers, as JSON
fx1/reverts-run.js     14 single-hunk reverts                                          (§7.6)
fx1/mutants-run.js     32 named mutants + the fixer's D21-4                            (§7.5)
fx1/run-carrier.js     the B1 carrier, 3 files x 2 Date modes                          (§7.8)
fx1/witness-flips.js   non-throwing assert observer over the 3 witness programs        (§7.8)
fx1/cells-bite.js      the new cell file against base and 4 single-hunk reverts        (§7.7)
fx1/gates.js           all 19 original gates, repaired vs base                         (§7.9)
fx1/suite-both.js      conform + second gate, line-for-line diff                       (§7.9)
fx1/profile-verify.js  native-carriers-profile.verify() attribution                    (§7.9)
```

Every harness that mutates the worktree restores the four engine files in a `finally` and re-prints their sha256s; the restored hashes are `b51f3f1e0e94 / 77ced98c0b31 / 4d6c244efa6b / f8d0397abd75` at the end of every run, and `git status` shows only the intended files.

---

# 8. POST-REVIEW r2 — the second fix pass (C-r2-1)

| | |
|---|---|
| **Branch** | `rebuild/lane-b-b1`, applied on top of `586a183` (r2 review commit) |
| **Base** | `origin/rebuild/t2-client-core` @ `acd3b67` |
| **Change required** | **C-r2-1 (BLOCKING, lane B's own file)** — "commit the missing delta cells into `rebuild/engine/test/b1-delta-cells.cjs`", so that every killable mutant is killed by an artifact that is *in the repository* |
| **Author** | lane B fixer **r2** — not the builder, not either reviewer, not the r1 fixer |
| **Date** | 2026-09-11 |
| **Node** | `C:\Users\joeym\.cache\...\node.exe` v24.19.0 · `TZ=America/New_York` · `MEASURED_TEST_NOW=2026-09-03` |
| **Scratch** | `work/lane-b/fx2/`, outside the worktree; build products in `fx2/.tmp/`; two throwaway worktrees `fx2/base` (@`acd3b67`) and `fx2/mut` (@`586a183`), removed after the run. No other worktree was touched. |
| **C-r2-2** | **not taken** — it is the PM's (`rebuild/m4/spec`), and §8.6 restates it so it is not lost |

## 8.0 What changed, and what did not

**One file changed: `rebuild/engine/test/b1-delta-cells.cjs`,** which grows from 3 cells (106 lines) to **14 cells (478 lines, 29 231 bytes, sha256 `b401eeedc0f0e9b19e4433385c639f0342dac320d1765e37ebe3bfa7327d4835`)**. Plus this §8 and one paragraph of BRIEF v1.2 §A5.

**No engine byte moved.** The four engine files are byte-identical to `586a183`, re-hashed after every run in this pass:

```
dates.cjs  b51f3f1e0e94c6d7c1ae08d9049db6338e51c70e451674e3a87d94bf190fe067
sleep.cjs  77ced98c0b31c085e04da348592e936ce79dc85496a9df3febaef27e77380ffd
policy.cjs 4d6c244efa6b34daed02e194dbbd5b7064abcde2d93fd28974a5f2df519187e1
today.cjs  f8d0397abd75c02dd570741191124c32e26ab850702607826943d4394fda2e00
```

`git diff --name-status 586a183` is exactly `M rebuild/engine/test/b1-delta-cells.cjs` plus the two documents. `git diff --name-only acd3b67 -- <scope>` is **EMPTY** for every one of 23 scopes checked, `tools`, `rebuild/conform/golden`, `rebuild/conform/laws`, `rebuild/conform/oracle`, `rebuild/conform/gates`, the three v4 law files, `helpers.cjs`, `run-defect-laws.cjs`, the three witness programs, `package.json`, `package-lock.json`, `.github`, `src`, `rebuild/m4/spec`, `STATUS.md`, `REQUESTS.md`, `DECISIONS.md`, `ledger` and `rebuild/conform/private` among them. **`ledger/` and `rebuild/conform/private/` were never opened; no `--full` was run; nothing in this section carries a private value, count, hash or phrase.**

## 8.1 The eleven new cells, and the mutants they carry

The file now runs **every** cell rather than aborting on the first failure, so a failure count is a measurement and not an artefact of ordering: it prints `HOLD`/`FAIL` per cell with the mutant ids that cell carries, then `B1 DELTA CELLS: h/14 hold`, and exits non-zero if `h < 14`.

Two deliberate strengthenings over the r1-fixer version:

* **The relative fixtures are built by an independent calendar oracle, not by `plusDays`.** A cell whose *fixture* cannot be constructed on the pre-B1 base proves nothing about behaviour. A local `shift(iso, n)` does the date arithmetic for every cell except the two that assert the primitive itself, and in those two the `plusDays` pin was moved to the **end** so the behavioural assertion is what fails first. Result: on base **all fourteen** cells now fail with an `AssertionError`, and none with `TypeError: T.plusDays is not a function` — the r1-fixer version reported three of that kind.
* **`D27-3`'s fixture is expressed as `START + 63 days`, never as `2026-08-12`** (brief §A4 item 4; r1 residual risk 7). If `START` moves, the cell moves with it.

| # | cell | mutant(s) it kills |
|---|---|---|
| 1 | `B1-D16-due-date-is-seven-calendar-days-not-168-hours` | `D16-4 calendar-add-by-milliseconds` |
| 2 | `B1-D24-yesterday-is-the-previous-calendar-date-not-24-hours-ago` | `D24-1 require-every-field` · `D24-3 yesterday-by-milliseconds` |
| 3 | `B1-D8xD21-a-short-last-night-still-restricts-recovery` | `D21-4 drop-the-today-anchor` |
| **4** | `B1-D10-fractional-weeks-are-exact-sevenths-of-calendar-days` | `D10-1 round-the-week-not-the-days` |
| **5** | `B1-D8-the-three-night-mean-still-runs-behind-the-recency-guard` | `D8-3 drop-the-three-night-mean` |
| **6** | `B1-D16-a-late-read-leaves-the-call-ungraded-and-never-a-miss` | `D16-1 ungraded-counts-as-miss` |
| **7** | `B1-D16-only-an-eligible-read-can-grade-a-forecast` | `D16-3 drop-the-eligibility-filter` |
| **8** | `B1-D17-undone-moves-applied-only-and-a-clean-adjustment-still-reads-applied` | `D17-2 undone-means-auto` · `D17-3 applied-always-false` |
| **9** | `B1-D25-good-needs-one-success-and-forgives-exactly-one-miss` | `D25-1 require-a-majority` · `D25-2 drop-the-one-miss-allowance` · `D25-3 zero-rows-becomes-caution` |
| **10** | `B1-D19-the-cut-resumes-the-calendar-date-after-an-inclusive-break-end` | `D19-2 resume-plus-one-millisecond-day` |
| **11** | `B1-D27-an-active-diet-break-is-not-a-cut` | `D27-2 read-plan-phase-directly` |
| **12** | `B1-D27-long-cut-is-the-committed-phases-own-age-not-the-programme-week` | `D27-3 gate-on-programme-week-and-phase` |
| **13** | `B1-D23-a-failed-derivation-is-neither-a-rest-day-nor-an-escaping-throw` | `D23-2 remove-the-catch` · `D23-3 rest-day-on-any-failure` |
| **14** | `B1-D23-the-seven-day-scan-steps-calendar-dates` | `D23-4 week-step-by-milliseconds` |

Rows 4–14 are new. **19 mutant ids are named in the file itself**, so the coverage claim is auditable by reading the artifact, not only this report.

The killer values, all of them re-derived and re-executed in this pass:

```
D10-1  weeksBetween('2026-09-03','2026-09-06') = 0.42857142857142855   (mutant 0)
       weeksBetween('2026-01-01','2027-01-01') = 52.142857142857146    (mutant 52)
D8-3   three consecutive 6.6 h nights ending last night -> cleanAtDate false   (mutant true)
D16-1  a read on 2026-08-10 (past the one grace date) -> {graded:0, hit:null, miss:FALSE}
D16-3  a SEALED (and an offWindow) read ON the due date 2026-08-08 -> {graded:0, hit:null}
D17-2  {undone:true, auto:true} -> auto STAYS true; {undone:true} -> auto stays FALSE
D17-3  neither flag -> applied TRUE
D25-1  2/4 -> "caution"  (mutant "good"); 1/2 and 6/7 do NOT move, exactly as brief §A4 item 2 says
D25-2  1/2 -> "good" and 6/7 -> "good"  (mutant "caution")
D25-3  no protein rows -> {state:"quiet", detail:"counting only"}
D19-2  a break ENDING on the fall-back date 2026-11-01, read on its last active day:
         next.when = "resumes Mon 11/2"  (mutant "resumes Sun 11/1", the 25-hour collapse)
         line      = "Diet break — day 7 of 7, 0 to go. … the cut resumes Mon 11/2."
D27-2  a stalled athlete with plan.phase="cut" INSIDE an active brk 2026-09-01..09-07:
         phaseArc(s).key = "break" and theOneFix(s).rung = "hold"   (mutant "break")
D27-3  START + 63 = 2026-08-12: phaseArc.weeks = 9, weekDay().wk = 10, rung = "calories"
         (mutant "break"); control START + 70: weeks 10, wk 11, rung "break"
D23-2  a scheduled L day whose derivation THROWS on day 0 and a U day on day 2:
D23-3    nowModel(...).workout = {title:"UPPER BODY · SAT 9/5", today:false, iso:"2026-09-05"}
         (D23-2 mutant: the throw escapes nowModel; D23-3 mutant: "REST DAY")
D23-4  clock 2026-11-01, split map {1:"L"} -> {title:"LOWER BODY · TOMORROW", iso:"2026-11-02"}
         and map {4:"L"} -> "LOWER BODY · THU 11/5", iso 2026-11-05 (the 7th day is still reached)
```

## 8.2 The cells on the candidate and on base — 14/14 and 0/14, cell by cell

```
candidate (this branch)   exit=0   B1 DELTA CELLS: 14/14 hold
base acd3b67              exit=1   B1 DELTA CELLS:  0/14 hold
```

Every one of the fourteen fails **individually** on base, and every failure is an `AssertionError`:

```
FAIL B1-D16-due-date-…            Expected values to be strictly deep-equal   (base grades the 6th calendar day)
FAIL B1-D24-yesterday-…           assert.ok(… .some(item => item.k === "yesterday"))   (base asks about 03-07)
FAIL B1-D8xD21-…                  false !== true            (base carries the 3-day-old night forward)
FAIL B1-D10-fractional-weeks-…    0.994047619047619 !== 1   (the spring-forward week)
FAIL B1-D8-three-night-mean-…     false !== true            (base restricts on an 8-month-old night)
FAIL B1-D16-a-late-read-…         deep-equal                (base grades a month-late read)
FAIL B1-D16-only-an-eligible-…    deep-equal                (base grades a sealed read)
FAIL B1-D17-undone-…              deep-equal                (base reports an undone adjustment as applied)
FAIL B1-D25-good-needs-…          'good' !== 'caution'      (base calls 0/1 good)
FAIL B1-D19-the-cut-resumes-…     'resumes Mon 11/7' family (base resumes on the last active day)
FAIL B1-D27-an-active-diet-break… 'break' !== 'hold'        (base tells a man on his diet break to take one)
FAIL B1-D27-long-cut-…            'break' !== 'calories'    (base gates on the programme week)
FAIL B1-D23-a-failed-derivation…  'REST DAY' !== 'UPPER BODY · SAT 9/5'
FAIL B1-D23-the-seven-day-scan…   'REST DAY' !== 'LOWER BODY · TOMORROW'
```

## 8.3 The mutant matrix, re-run against COMMITTED artifacts only — **32 of 33 caught**

The harness is this pass's own (`fx2/mutants-run.js` + `fx2/probe-child.js`), on a throwaway worktree at `586a183`. Each of the 32 mutants BRIEF v1.2 §2 names, plus the r1-fixer's 33rd, is applied as an exact **single-occurrence** string edit; the six touchable engine files are restored between runs and in a process-exit handler. **A syntax error or a missing anchor earns NO kill** — all 33 anchors resolved exactly once, `HARNESS 0`.

**The detector set is deliberately narrow: only what this branch commits.** The ten v4 laws plus D22's frames parity; the three witness carriers through `legacy-b1-carriers.cjs`; and `rebuild/engine/test/b1-delta-cells.cjs`, spawned as its own process and read cell by cell. **No scratch battery of any kind is consulted** — that is the whole point of C-r2-1.

```
BASELINE laws     : {"D8":"GREEN","D10":"GREEN","D16":"GREEN","D17":"GREEN","D19":"GREEN","D21":"GREEN",
                    "D22":"RED","D22_framesParity":"true","D22_mutants":"RED","D23":"GREEN","D24":"GREEN",
                    "D25":"GREEN","D27":"GREEN"}
BASELINE carriers : {"defect-witnesses":"PASS","defect-witnesses-2":"PASS","defect-witnesses-3":"PASS"}
BASELINE cells    : 14/14 hold, exit=0

MUTANTS 33 · CAUGHT-by-committed-artifacts 32 · NOT CAUGHT 1 · HARNESS 0
  of which the BRIEF's 32 named: 32 · CAUGHT 31 · NOT CAUGHT 1
  plus 1 fixer-authored (D21-4 drop-the-today-anchor): CAUGHT
  NOT CAUGHT: D10-2 utc-stamp-substitution
```

**r2 §4 measured 17 caught, 9 battery-only and 7 uncaught. This pass measures 32 caught and one survivor, and the survivor is `D10-2`.** Every detector below is a file in the repository.

| mutant | committed detector(s) that moved |
|---|---|
| `D10-1 round-the-week-not-the-days` | cell 4 |
| **`D10-2 utc-stamp-substitution`** | **NOTHING MOVED — the sole survivor, by design (§8.5)** |
| `D10-3 plusdays-adds-milliseconds` | carrier `defect-witnesses-2`; cells 1, 2, 3, 4, 10, 14 |
| `D8-1 stale-night-returns-false` | law D8 GREEN→RED; carrier `defect-witnesses`; cells 3, 5 |
| `D8-2 age-window-instead-of-last-night` | cell 3 |
| `D8-3 drop-the-three-night-mean` | cell 5 |
| `D21-1 tomorrow-is-plus-two-days` | law D21; carrier `defect-witnesses-2`; cell 3 |
| `D21-2 use-today-instead-of-tomorrow` | law D21; carrier `defect-witnesses-2`; cell 3 |
| `D21-3 hardcode-fallback-date` | law D21; carrier `defect-witnesses-2`; cell 3 |
| `D21-4 drop-the-today-anchor` | **D22 framesParity true→false**; cell 3 |
| `D19-1 shift-daysSince-in-dietBreakState` | carrier `defect-witnesses-2` |
| `D19-2 resume-plus-one-millisecond-day` | cell 10 |
| `D19-3 off-by-one-both-ends` | law D19; carrier `defect-witnesses-2`; cell 10 |
| `D16-1 ungraded-counts-as-miss` | cells 6, 7 |
| `D16-2 grace-window-is-two-days` | law D16; cells 1, 6 |
| `D16-3 drop-the-eligibility-filter` | cell 7 |
| `D16-4 calendar-add-by-milliseconds` | cell 1 |
| `D17-1 drop-undone-rows` | law D17; carrier `defect-witnesses-2`; cell 8 |
| `D17-2 undone-means-auto` | cell 8 |
| `D17-3 applied-always-false` | cell 8 |
| `D24-1 require-every-field` | cell 2 |
| `D24-2 drop-the-empty-ledger-guard` | carrier `defect-witnesses-3`; cells 11, 12 |
| `D24-3 yesterday-by-milliseconds` | cell 2 |
| `D25-1 require-a-majority` | cell 9 |
| `D25-2 drop-the-one-miss-allowance` | cell 9 |
| `D25-3 zero-rows-becomes-caution` | cell 9 |
| `D27-1 gate-longcut-only` | carrier `defect-witnesses-3`; cell 11 |
| `D27-2 read-plan-phase-directly` | cell 11 |
| `D27-3 gate-on-programme-week-and-phase` | cell 12 |
| `D23-1 default-slp-to-empty-object` | carrier `defect-witnesses-3` (the surviving `TypeError`, per brief §A4 item 3) |
| `D23-2 remove-the-catch` | cell 13 |
| `D23-3 rest-day-on-any-failure` | cell 13 |
| `D23-4 week-step-by-milliseconds` | cell 14 |

Three observations worth recording rather than smoothing over:

1. **Nineteen mutants are killed by the delta cells and by nothing else** — `D10-1`, `D8-2`, `D8-3`, `D16-1`, `D16-3`, `D16-4`, `D17-2`, `D17-3`, `D19-2`, `D24-1`, `D24-3`, `D25-1`, `D25-2`, `D25-3`, `D27-2`, `D27-3`, `D23-2`, `D23-3`, `D23-4`. No law and no carrier moves for any of them. That is the measure of how much of B1 was unprotected before this pass, and it is why `b1-delta-cells.cjs` must be a **required** artifact of B1's closed profile (C-r2-2(a)): delete the file and B1's committed evidence falls back to 13 of 33.
2. **`D19-1` and `D23-1` are killed by a carrier alone**, with no law and no cell. Both are already recorded as load-bearing (brief §A4 item 3 for `D23-1`); `D19-1` is the same shape and the PM should know the `defect-witnesses-2` carrier is the only thing standing behind it.
3. **`D24-2`'s detectors include cells 11 and 12** — dropping the empty-ledger guard changes `nowFocus`'s owed set, which reaches `theOneFix` rung 3 and moves the D27 cells' rung. A cross-hunk kill is still a kill by a committed artifact, but it is a coincidence of the fixture, not a designed detector, and it is reported as such.

## 8.4 Everything else re-run, and unmoved

The frozen bundle was rebuilt by this pass from the repo's own recipe (`legacy-gates.publicReferences({baseline, scratch, sourcePins: manifest.baseline.buildSources})`, 10 source pins):

```
main -> fx2/.tmp/main/engine.cjs  bytes=813681  sha256=67a78bd790a8aff6cf3cdd56939915069e3768f1f3e75a87bf873b49df2d385f
old  -> fx2/.tmp/old/engine.cjs   bytes=792791  sha256=4e09269fcd28520e68325ea9ee348c2d3856a34c71448dcb51ab86abbda29b37
```

(esbuild embeds input paths, so the byte count tracks the cwd, not the content — `build-engines.mjs` documents this and the builder, r1, the r1-fixer and r2 each got a different number. Equivalence is behavioural: the runner reproduces the base tip's terminal line exactly, below.)

**The 45 v4 laws — still exactly 10 rows moved, and D22 is still not one of them.**

```
[cand] TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
[base] TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
ROWS MOVED 10 · UNCHANGED 35 · moved ids: D8, D10, D16, D17, D19, D21, D23, D24, D25, D27
```

Each of the ten reads `RED-frozen / GREEN-candidate / AUDIT-FAIL` against `RED-frozen / RED-candidate / mutant-DETECTED` on base. **D22 is one of the 35 byte-identical rows**, and its frames parity measured `true` on the candidate in the mutant harness's own baseline. `AUDIT RED-FIRST FAIL` is the pristine terminal too. Ten of ten B1 laws GREEN-candidate.

**The B1 carrier — 6/6 PASS, 18 substitutions, the three witness files byte-identical to their pins.**

```
PACKAGE_ID M2-B1-GRADING-TIME-WINDOW · COVERS witnesses-1, witnesses-2, witnesses-3
substitutions declared: 18
  defect-witnesses.cjs   on disk 557c12e72690c397…  pin 557c12e72690c397…  MATCH=true
  defect-witnesses-2.cjs on disk 833db0431e656f86…  pin 833db0431e656f86…  MATCH=true
  defect-witnesses-3.cjs on disk f5169bebd527ac13…  pin f5169bebd527ac13…  MATCH=true
  PASS defect-witnesses   [native]/[frozen] reproduced=10 tail="DEFECT WITNESSES: 10/10"   edits=3 carrierHash=c2ea4423ec9b014a
  PASS defect-witnesses-2 [native]/[frozen] reproduced=11 tail="DEFECT WITNESSES 2: 11/11" edits=8 carrierHash=a766bfe0abffc05d
  PASS defect-witnesses-3 [native]/[frozen] reproduced=5  tail="DEFECT WITNESSES 3: 5/5"   edits=9 carrierHash=de59fa01b12e73ef
B1 CARRIER: 6/6 PASS · total in-memory edits across the 6 runs = 40 · git status empty afterwards
```

**Conform suite and the second gate — identical to pristine, in all four streams.**

```
conform    : cand=79 base=79 stdout lines, DIFFERING=0 after normalising the worktree root; stderr 0/0
             terminal, both trees:
             SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
second gate: stdout cand=6 base=6 DIFFERING=0; stderr cand=9 base=9 DIFFERING=0
             terminal, both trees: SECOND GATE candidate: FAIL — second gate failed; inspect ignored public diagnostic logs
             (the pre-existing D12 abort at tools/engine-test.jsx:106; the reference half passes on both)
```

Two honest notes on that comparison. **(i)** Line counts here are non-blank lines; r1 and r2 counted differently (82, and 6+3), and the content is what matters — it is line-for-line identical between the trees. **(ii)** `rebuild/conform/engines/*.cjs` are **gitignored build products**, absent from a fresh worktree; the first base run therefore skipped `rig185` and differed in 34 lines for want of them. The candidate worktree's two artifacts were copied into the base worktree — they derive from `fe516c1:src/app.jsx` and are identical for both trees by construction — and the comparison was re-run. The `DIFFERING=0` above is that second run. Before normalisation the only two differing lines were the absolute worktree path inside the `engine artifacts present` diagnostic, which is exactly what r1 reported.

## 8.5 What this pass did NOT do, and what it deliberately left as the sole survivor

1. **`D10-2 utc-stamp-substitution` is still not killed, and must not be.** Fifth independent confirmation (builder, r1, the r1-fixer, r2, this pass): nothing moved — no law row, no carrier, no cell. `(Date.UTC(b) − Date.UTC(a)) / 604800000` is bit-identical to `Math.round((mk(b) − mk(a))/DAY)/7` on every date-only input. `BRIEF-IMPORT-GUARDS.md:88` forbids earning a kill from a refusal, so the kill is a **positive source/alias assertion** and it belongs to the package artifact (C4 / **C-r2-2(b)**), not to a behavioural cell. Writing a cell that "catches" it would be dishonest and this pass did not.
2. **C-r2-2 is untouched — it is the PM's.** `rebuild/m4/spec` is the PM's directory per `LANES.md`. The two halves the PM still owes are (a) list `rebuild/engine/test/b1-delta-cells.cjs` as a **required** package artifact beside the carrier, and (b) carry C4's positive source/alias assertion for `D10`. §8.3 observation 1 is the argument for (a): without the file, committed coverage falls from 32/33 to 13/33.
3. **C7 is still unauthored** (`acceptance-b1-grading-time-window.json`, `b1-grading-package.cjs`, `b1-inherited-carriers.cjs`, the `witnesses-1`/`witnesses-3` `coverage.run → coverage.covered` move). **There is still no gate that can say PASS for B1.**
4. **The 19 original gates and `native-carriers-profile.verify()` were not re-run in this pass.** Nothing in this pass changes an engine byte, and both are functions of the engine bytes and the parent pins; r2's measurements (2 gates moved — `witnesses-1`, `witnesses-3`; `verify()` refuses on `Unchanged parent pin: rebuild/engine/dates.cjs`) stand unchanged and unrepeated. Stated so, rather than re-claimed.
5. **`--full`, the private census and the browser/host surfaces are unexecuted**, by design (`DECISIONS:92`, `:93` C4). D16 is B1's only LIVE-TRIGGERED defect.
6. **The `@noble/*` request is still only quoted, not filed** in `REQUESTS.md` (cross-lane, append-only; r2 §6 says the PM must file it, with r2 §7's refinement that the two packages *are* declared in `rebuild/m3/w5/package.json` and `rebuild/m3/w6/package.json`, just not at the root `npm ci` installs).
7. **The UNKNOWN-recovery question is still open**, and `N1a` (a night bed-dated today restricts recovery on ordinary days, pre-existing) still wants one line of a PM ruling. Neither is a B1 blocker.
8. **`STATUS.md`, `REQUESTS.md` and `DECISIONS.md` were not edited** (instructed / cross-lane).

## 8.6 Reproduction

All helper scripts live in `work/lane-b/fx2/`, outside the worktree; build products in `fx2/.tmp/`. Nothing generated is committed. The two throwaway worktrees were created with `git worktree add --detach` and removed afterwards; **no other worktree was read from or written to**, and the shared `b1` worktree was never mutated by the mutant harness — all 33 mutants were applied inside `fx2/mut`.

```
node  = C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe   (v24.19.0)
env   = TZ=America/New_York  MEASURED_TEST_NOW=2026-09-03  ENGINE_MAIN=<main>  ENGINE_OLD=<old>

fx2/probe1.js        fixture re-derivation for the eleven new cells, on the candidate tree
fx2/build-frozen.js  frozen fe516c1 bundle via legacy-gates.publicReferences                (§8.4)
fx2/probe-child.js   COMMITTED detectors only: 11 law statuses + D22 frames parity
                     + 3 carriers + b1-delta-cells.cjs run as its own process, as JSON
fx2/mutants-run.js   the brief's 32 mutants + the r1-fixer's D21-4, on fx2/mut              (§8.3)
fx2/run-carrier.js   the B1 carrier, 3 files x 2 Date modes                                 (§8.4)
fx2/s05-laws.ps1 + lawdiff.js    45 laws on candidate and base, row-by-row diff             (§8.4)
fx2/s06/s08 + streamdiff.js      conform + second gate on both trees, line-for-line         (§8.4)
fx2/s10-scopes.ps1   23 frozen-scope emptiness checks and the file hashes                   (§8.0)
```

`git status --porcelain` in the worktree showed only the intended files at every checkpoint, and the four engine sha256s were re-read after the carrier run and after the mutant run.

**Privacy, verdict-only.** `rebuild/conform/private/` does not exist on this tree and was not created. `ledger/` was never opened. No `--full` was run. No private value, count, hash or prose appears anywhere in §8.
