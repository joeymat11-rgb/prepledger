# LANE B — B1 GRADING & TIME WINDOW — INDEPENDENT REVIEW r1

| | |
|---|---|
| **Branch** | `rebuild/lane-b-b1` |
| **Reviewed sha** | `ffa424351948a432bfef1d730ec024dd36123e63` |
| **Base** | `origin/rebuild/t2-client-core` @ `acd3b67` (verified: `ffa4243` is exactly 1 commit atop it) |
| **Brief** | `rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md` (NOT accepted — speculative per `DECISIONS.md:100`) |
| **Builder report** | `rebuild/lanes/b/BUILD-REPORT-B1.md` |
| **Reviewer** | lane B independent reviewer (Opus), blind, told to disagree |
| **Date** | 2026-09-11 |
| **Worktree** | `work/lane-b/review-b1` (detached @ `ffa4243`), own scratch `work/lane-b/rv1/` |
| **Method** | every number below was re-executed by the reviewer on the owner's PC. Nothing was taken from the builder's report on trust. |

---

## VERDICT — **ACCEPT WITH CHANGES** (the changes are BLOCKING; one of them is a brief amendment, not a code edit)

The engine work is sound and unusually well evidenced: **every quantitative claim in `BUILD-REPORT-B1.md` reproduced exactly** on my own independently built frozen bundle and my own harnesses — 10/10 B1 laws GREEN-candidate / RED-frozen, 11 rows moved, 31/32 mutants caught with `D10-2` the sole survivor, carrier 6/6, three witness files byte-identical to their pins, and the four pre-existing refusals identical on the pristine base. All five file sha256s match the report's §1 table. No frozen law, golden, tool, witness byte or lockfile byte was touched.

**But the candidate as committed fails the brief's own acceptance bar**, for one reason: D8's hunk, landing at `sleepInfo`'s `tomorrow` anchor, **silences `recoveryIndex`'s named `sleep` flag unconditionally in normal operation**, and that breaks D22's frozen↔candidate call-trace parity. The builder found this and disclosed it (§4.1) — correctly. I confirm it, with stronger evidence than the report carries. **The remedy the builder proposes for it is wrong** and would reinstate the very carry-forward D8 was ruled to remove. I have an executed remedy that satisfies every constraint.

### The exact changes required before acceptance

| # | Change | Owner | Blocking? |
|---|---|---|---|
| **C1** | Amend `sleepInfo` (`rebuild/engine/sleep.cjs:1905`) to `clean: cleanAtDate(s, today9) && cleanAtDate(s, tomorrow)` with `const today9 = isoOf(todayStart()); const tomorrow = plusDays(today9, 1);`. **Do NOT** narrow D8's `cleanAtDate` guard and **do NOT** adopt report §4.1's proposed remedy. Executed by me — see the adjudication below. | lane B | **YES** |
| **C2** | **Brief amendment (PM).** D21's hunk text in BRIEF-B1 v1.1 §2 must change to carry C1, and a purpose-written cell/law must encode the **D8×D21 cross-case** (`sleepInfo().clean` with the newest night bed-dated *yesterday*). The brief's own D21 mutant-1 already names "the D8↔D21 cross-case" as its killer, but **no law and no witness encodes it** — which is exactly why the shipped defect passed all ten laws. | PM | **YES** |
| **C3** | Correct the brief's mutant table: **32 named in §2, not 31** (I counted 3+3+3+3+4+3+3+3+3+4 = 32); `D25-1 require-a-majority` is **not** killed by the brief's named `1/2` or `6/7` cells (both unmoved in my run) — the killer is `2/4`; `D27-3`'s killer fixture is `2026-08-12` (`weeks=9`, `wk=10`), which I derived independently and which is the date report §4.3 says the brief omits; `D23-1`'s only detector is the `defect-witnesses-3` carrier. | PM + lane B | YES (evidence integrity) |
| **C4** | Add the **source/alias assertion for `D10`**. I independently confirm `D10-2 utc-stamp-substitution` is **behaviourally unkillable**: every one of my ten `weeksBetween`/`plusDays` cells, all 45 law rows, all three carriers and all 82 battery cells were byte-identical under it. No behavioural case can earn that kill. | lane B | YES |
| **C5** | Add enumerated delta cells for the two **millisecond→calendar** hunks to B1's closed profile. My own bite proved `REVERT D16 dueISO calendar` and `REVERT D24 yISO calendar` are caught by **neither the v4 law nor any witness carrier** — only by purpose-written calendar cells (`2026-11-01` forecast; `2026-03-09` `yISO`). Without those cells in the artifact, those two hunks are unprotected. | lane B | YES |
| **C6** | Resolve §4.5 (the §6 Q5 `policy.cjs:554` rider: §0.1 item 2 says out, §5.4's "3+1+2" says in) and settle the delegate/declaration placements of §4.6/§4.7 so the diff is byte-reproducible from the accepted brief. | PM | No (cosmetic/consistency) |
| **C7** | Author the `rebuild/m4/spec` half (`acceptance-b1-grading-time-window.json`, `b1-grading-package.cjs`, `b1-inherited-carriers.cjs`, the `witnesses-1`/`witnesses-3` `coverage.run → coverage.covered` move). **B1 cannot be accepted without it** — see the `native-carriers-profile.verify()` finding below, which is the one refusal that *is* attributable to B1. | lane B / PM | **YES** |
| **C8** | Escalate the undeclared `@noble/*` dependency (below) to the tooling lane. It blocks the **accepted parent package gate** on a clean `npm ci`, on this branch *and* on pristine `acd3b67`. | PM → tooling | No (environmental, but urgent) |

Nothing here requires the ten hunks to be rewritten. C1 is one expression; C2–C5 are brief/profile work; C7 is the lane-boundary half the builder correctly declined to author.

---

## THE D8 ADJUDICATION (report §4.1) — the builder is RIGHT; its remedy is WRONG

### 1. Is the finding real? **Yes, and it is worse than the report states.**

Reproduced on the runner's **own** D22 fixture, no state of my invention required:

```
node rebuild/conform/v4/run-defect-laws.cjs   (TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03)
D22 fixture: recoveryIndex(s), s.sleep.nights = [{d:'2026-08-31',h:8},{d:'2026-09-01',h:8},{d:'2026-09-02',h:2}], clock.today()='2026-09-03'
  frozen    : {"band":"WATCH","score":70,"factors":["sleep reset — 0 of 3 clean nights"]}
  candidate : {"band":"GREEN","score":100,"factors":[]}
  detail parity = true      frames parity = FALSE      (on pristine acd3b67: frames parity = true)
```

My own minimal synthetic state (five nights, the last a 2 h night, all data invented) reproduces it identically:

```
                                          BASE acd3b67            CANDIDATE ffa4243
A last night bed-dated YESTERDAY, 2 h     clean=false  WATCH/70    clean=TRUE   GREEN/100   <-- the regression
B a night dated TODAY, 2 h                clean=false  WATCH/70    clean=false  WATCH/70    (control holds)
C last night 3 days old, 2 h              clean=false  WATCH/70    clean=true   GREEN/100   (D8 intended)
```

### 2. Why it is worse than "goes silent for the normal state"

The report argues bed-dating from `owedLedger`. The product **documents** it. Frozen `src/app.jsx:12334`, the app's own glossary term `nightdate`, verbatim:

> "**How nights are dated** — A night belongs to the evening it began: Tuesday night = Tue evening → Wed morning, filed under Tuesday. You log it the morning after. Before 5 a.m. the app still means the night you already finished — **never the one you haven't slept yet**. Missed a morning? The row stays, dated, for up to 3 days."

and `booksToday(s)` (`app.jsx:13013-13019`) puts today's expected night row at **`y9` = yesterday**, not today. So a night bed-dated TODAY is, by the product's own rule, the night not yet slept — a row the app never asks for and normally cannot contain.

D8's guard is `last.d !== plusDays(iso, -1)`. `sleepInfo` calls `cleanAtDate(s, tomorrow)`. Therefore the guard demands a night bed-dated **today**. Not "usually absent" — **absent by definition**. `recoveryIndex`'s named `sleep` flag is therefore **dead in every state the app's own dating rule can produce**, and it takes the athlete from WATCH/70 to a positive GREEN/100 after a 2 h night. That reads squarely against the owner's own D8 words at `DECISIONS.md:60`: *"…and no sleep restriction is applied today; **every other recovery check still applies**"*.

### 3. Whose fault: the build or the brief? **The brief.**

The hunk is verbatim from BRIEF-B1 v1.1 §2 D8, and D8's **ratified repair control** encodes the same anchor (`laws-clock-and-as-of.cjs`, D8 `control`: keeps the nights only if `nights.some(n => n.d === isoOf(day - 1))`). The guard is **correct** for all eleven other `cleanAtDate` call sites, every one of which passes "the day in question": `energy.cjs:1219` (`today`), `progression.cjs:91,515,704` and `sleep.cjs:54,258,261` (a session date `d`), `writers.cjs:539,935,940`. Only `sleepInfo` passes `tomorrow`, and it does so as a *workaround for `nightsBefore`'s strict `n.d < iso` filter*, not because tomorrow is the day in question. D8's law cannot see it (its `run` calls `cleanAtDate` directly); the ten B1 laws cannot see it; it surfaces only because `run-defect-laws.cjs:62` compares full call traces on D22's neighbouring fixture. The brief's §7 item 5 measured raw GREEN/RED only — which is why it was missed. **This is a defect in the accepted-pending brief, so it needs a brief amendment (C2), not only a code edit.**

### 4. The builder's proposed remedy is WRONG — executed proof

Report §4.1 proposes `clean: cleanAtDate(s, plusDays(<newest night date>, 1))`. With `iso = newest.d + 1`, `plusDays(iso, -1) === newest.d` **identically**, so the D8 guard can never trip: the remedy does not re-anchor the question, it **switches the guard off at this call site**. Built as `rv1/rem1` and run:

```
rem1 (builder's §4.1 remedy):  45 laws — 29 RED-candidate, 87/104, 1 row differs from shipped:
   D22 ... RED-frozen / RED-candidate / mutant-DETECTED       <-- parity restored
   A last night YESTERDAY 2 h -> clean=false  WATCH/70        <-- flag back, good
   C last night 3 DAYS OLD 2 h -> clean=FALSE WATCH/70        <-- *** carry-forward reinstated ***
```

That last line is the other half of the owner's D8 ruling — *"(not carry-forward of the last logged night)"* — broken. The remedy trades one D8 violation for the opposite one, and passes the two checks the builder tried (D21's witness, D22's parity) **precisely because** it disables the recency test.

### 5. What B1 should do — all three, in this combination (executed)

- **Do not narrow D8's hunk.** `cleanAtDate`'s `iso − 1` guard is right for the eleven "day in question" callers and matches D8's own ratified control. Moving `sleepInfo` to `cleanAtDate(s, today)` alone also fails: `nightsBefore`'s strict `<` would drop the same-date night and D21's repair would evaporate (verified by inspection of the D21 fixture).
- **Apply a purpose-written check inside D21's hunk** — ask the question at *both* anchors, which is the only form that expresses "the current night is the one bed-dated yesterday, or a same-date row if one exists":

```js
function sleepInfo(s) {
  const n = s.sleep.nights;
  const today9 = isoOf(todayStart());
  const tomorrow = plusDays(today9, 1);
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at,
    clean: cleanAtDate(s, today9) && cleanAtDate(s, tomorrow),
    last: n[n.length - 1], need: s.sleep.needed };
}
```

  Built as `rv1/rem2` and run — **every constraint holds**:

```
rem2:  45 laws — 45 RED-frozen / 29 RED-candidate / 89 GREEN controls / 87/104 / 0 HARNESS_ERROR
       exactly 1 row differs from the shipped candidate, and in the right direction:
         D22 ... RED-frozen / RED-candidate / mutant-DETECTED    (trace parity RESTORED)
       ten B1 laws still GREEN-candidate; no other row moves.
       A last night YESTERDAY 2 h  -> clean=false  WATCH/70      (the flag fires: D8 clause 2 honoured)
       C last night 3 DAYS OLD 2 h -> clean=true   GREEN/100     (no carry-forward: D8 clause 1 honoured)
       B night dated TODAY 2 h     -> clean=false  WATCH/70      (D21's same-date night still counts)
       D21 witness state (today=2026-11-01, night 2026-11-01 h=1) -> sleepInfo.clean = false  (the D21 flip survives,
         so the carrier's `B1-D21-fall-back-same-date-night-counts` substitution is unchanged)
```

  Trace-safe: `run-defect-laws.cjs`'s `traced()` wraps only the engine's *exported* functions, so `sleepInfo`'s second internal `cleanAtDate` adds no frame; the restored parity is the corrected **result**, not a coincidence.
- **And escalate as a brief amendment (C2)** — because D21's published hunk changes and because the missing D8×D21 cross-case cell is what let this through. A cell that would have caught it: *`sleepInfo(s).clean === false` when the newest night is bed-dated `today − 1` with `h < DEBT_LAST_H`.*

### 6. A further open item the remedy does NOT close

The owner said *"recovery is **UNKNOWN**"*. In all three variants (shipped, rem1, rem2) a missing or stale last night makes `recoveryIndex` read **GREEN / 100 with zero flags** — a positive claim of perfect recovery on a day the engine knows nothing about the athlete's sleep. The flag model has no third state (`score` "survives only to drive the old bar", `sleep.cjs:220-236`). Enumerating an UNKNOWN state is beyond B1's hunks, but the PM should decide whether "no restriction" may present as "GREEN/100" or must present as unknown. **Open item for the PM, not a B1 blocker.**

---

## EVERY COMMAND I RAN, AND ITS OUTCOME

Node `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` (v24.19.0); `npm ci --include=dev` in `review-b1` and in my own pristine-`acd3b67` worktree (44 packages each, `package-lock.json` untouched in both — `git status` empty); `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`.

### 1. Diff classification — CLEAN

```
git diff acd3b67...ffa4243 --stat
 rebuild/conform/v4/postfix/legacy-b1-carriers.cjs | 187 ++++++    (A — gate-carrier, new)
 rebuild/engine/dates.cjs                          |   7 +-        (M — engine)
 rebuild/engine/policy.cjs                         |  15 +-        (M — engine)
 rebuild/engine/sleep.cjs                          |   4 +-        (M — engine)
 rebuild/engine/today.cjs                          |  44 +-        (M — engine)
 rebuild/lanes/b/BUILD-REPORT-B1.md                | 535 ++++++    (A — docs)
 6 files changed, 765 insertions(+), 27 deletions(-)

git diff acd3b67...ffa4243 --name-only -- rebuild/conform/v4/laws tools goldens rebuild/conform/v4/witnesses
  (empty)
```

No `rebuild/conform/v4/laws-*` byte, no `tools/` byte, no golden and no witness file is touched. The three frozen witness programs are byte-identical to their carrier pins, proven by on-disk sha256, not by claim:

```
defect-witnesses.cjs    557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644  MATCH
defect-witnesses-2.cjs  833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2  MATCH
defect-witnesses-3.cjs  f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6  MATCH
```

All five changed-file sha256s equal report §1's AFTER column: `dates b51f3f1e…`, `sleep 6be0c6fb…`, `policy 4d6c244e…`, `today f8d0397a…`, `legacy-b1-carriers d8d98b24…`.

### 2. Frozen bundle — built myself, and `build-engines.mjs` really is broken on Windows

`node rebuild/conform/engines/build-engines.mjs <root>` → `Error [ERR_UNSUPPORTED_ESM_URL_SCHEME] … Received protocol 'c:'`, exit 1. **Report §4.8 independently confirmed.** I used the repo's own pinned recipe instead — `legacy-gates.publicReferences({baseline, scratch, sourcePins: manifest.baseline.buildSources})` (10 source pins; `FROZEN-BUILD-SOURCE-PIN` verified inside):

```
main -> rv1/.tmp/frozen/main/engine.cjs  bytes=813716  sha256=90461fc8dfff86356a8e0fa8428c2dae6b00e3b4ade70b615ee72e896b324adf
old  -> rv1/.tmp/frozen/old/engine.cjs   bytes=792826  sha256=7a6fe99ad99e381080f078faf1ee1c3aebdb28e767fae61b21d8c36a417eaa43
```

Byte count and sha differ from the builder's (813 696) and from the brief's (813 751) purely by esbuild entry-path length, exactly as `build-engines.mjs` itself documents. `fe516c1:src/app.jsx` verified at blob `f98671d8…` by `helpers.cjs:17`'s own check on every run.

### 3. The 45 laws — 11 rows move, and the 11th is D22's trace parity

```
CANDIDATE ffa4243 : TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
BASE      acd3b67 : TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

Both exactly match the report's AFTER/BEFORE lines (and BEFORE matches brief §7 item 1). Row-by-row diff of the two 45-line outputs: **11 moved, 34 byte-identical.**

| defect | base `acd3b67` | candidate `ffa4243` |
|---|---|---|
| D8 `D-D8-stale-sleep-does-not-claim-current-debt` | RED / RED / mutant-DETECTED | RED / **GREEN** / AUDIT-FAIL |
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

**Judgement on the 11th row.** It is *not* a cosmetic parity blip and *not* the benign `AUDIT-FAIL` token the ten repaired rows print by construction (`run-defect-laws.cjs:56` requires `raw.status==='RED'`, so any repaired law prints AUDIT-FAIL — the six already-GREEN rows D12/D33/D34/D35/D41/D43 print it on the pristine tip too, and are among my 34 unchanged rows). D22's raw status, detail and mutant are all unchanged; what fails is `frames parity`, and the differing frame is the **product value** `recoveryIndex` returns. It is a genuine RED stop. Per-law `inspect()` on both trees:

```
CANDIDATE D22: raw RED/RED · control GREEN/GREEN · mutant RED/RED · detail parity true · frames parity FALSE
BASE      D22: raw RED/RED · control GREEN/GREEN · mutant RED/RED · detail parity true · frames parity true
CANDIDATE D8 : raw RED-frozen / GREEN-candidate · control GREEN/GREEN
               detail frozen {"missing":true,"stale":false,"recentShort":false} -> candidate {"missing":true,"stale":true,"recentShort":false}
```

The 6-law `97/104 → 87/104` mutant drop is the ten repaired laws' mutants reporting GREEN post-repair (a mutant restores `__auditOriginal`, which after repair *is* the repaired function) — brief §7 item 4, confirmed. 89 GREEN controls unchanged, 0 HARNESS_ERROR on both trees. `AUDIT RED-FIRST FAIL` is the pristine terminal too, so it is not a B1 regression.

### 4. The 32 named mutants — my own harness, 31 CAUGHT, sole survivor `D10-2`

I did not reuse the builder's harness. Mine applies each mutant as an exact **single-occurrence** string edit (pre-flight: all 32 anchors resolve exactly once) on its own throwaway worktree, restores between runs, and then re-measures **(a)** the defect's v4 law, **(b)** all three B1 witness carriers and **(c)** an 82-cell value battery, diffing against the unmutated repaired baseline. A syntax error or missing target earns no kill.

```
MUTANTS 32 · CAUGHT 31 · NOT CAUGHT 1 · HARNESS 0
NOT CAUGHT: D10-2 utc-stamp-substitution — NOTHING MOVED
```

**`D10-2` is behaviourally unkillable — confirmed.** `(Date.UTC(b) − Date.UTC(a)) / 604800000` returns bit-identical values to the repaired `Math.round((mk(b) − mk(a))/DAY)/7` on every date-only input, because both endpoints are stamped consistently: `09-03→09-10 = 1`, `09-03→09-06 = 0.42857142857142855`, spring `= 1`, fall `= 1`, reversed `= −1`, equal `= 0`, `2026-01-01→2027-01-01 = 52.142857142857146`. All 45 law rows, all three carriers and all 82 cells unmoved. The kill must come from a positive source/alias assertion (C4) — `BRIEF-IMPORT-GUARDS.md:88` forbids earning it from a refusal.

Corrections to the brief's cell table that I reproduced independently (report §4.3 confirmed, and extended):

- `D25-1 require-a-majority` — the brief's named killers `1/2` and `6/7` **did not move**. My only detector was `2/4` (`caution 2/4` repaired → `good 2/4` mutated).
- `D25-2` is killed by `1/2` **and** `6/7`; `D25-3` by the no-rows cell.
- `D23-1 default-slp-to-empty-object` — caught **only** by the `defect-witnesses-3` carrier (the surviving `TypeError` cell), by no law and no delta cell.
- `D27-3 gate-on-programme-week-and-phase` — needs a fixture in the 9 ≤ weeks < 10 band, which for a committed cut is `START + 63 days`. I derived the date from source: **`2026-08-12` → `weeks=9`, `weekDay().wk=10`, repaired `rung=calories`, mutated `rung=break`.** That is the same `2026-08-12` report §4.3 says the brief omits — independent convergence.
- `D23-2` and `D23-3` both need a state where the first scheduled day throws and a later one does not. Mine: the law's hack-debut fixture with `split.map = {4:'L', 6:'U'}` and a throwing `queue[0].newW` accessor. Repaired → `UPPER BODY · SAT 9/5`; `D23-3` → `REST DAY`; `D23-2` → the throw escapes `nowModel`.
- `D23-4 week-step-by-milliseconds` — killed by a fall-back scan: `clock.today()='2026-11-01'`, `split.map={1:'L'}`. Repaired `LOWER BODY · TOMORROW / iso 2026-11-02`; mutated shifts to `MON 11/2` because the 25-hour day collapses `k9=1` onto `2026-11-01`.

The 32-vs-31 count: **32**. Mechanically extracted from brief §2's `**Source mutants.**` paragraphs — D10 3 · D8 3 · D21 3 · D19 3 · D16 4 · D17 3 · D24 3 · D25 3 · D27 3 · D23 4. Brief §5.4's "the 31 named in §2" is wrong.

### 5. The witness carrier `legacy-b1-carriers.cjs` — 6/6 PASS, 18 substitutions, files untouched

```
PACKAGE_ID   : M2-B1-GRADING-TIME-WINDOW
COVERS       : witnesses-1, witnesses-2, witnesses-3
substitutions declared: 18   (defect-witnesses 3 · defect-witnesses-2 6 · defect-witnesses-3 9, in 10 witness cells)
PASS  defect-witnesses   [native]  reproduced=10  tail="DEFECT WITNESSES: 10/10"    edits=3  carrierHash=c2ea4423ec9b014a
PASS  defect-witnesses   [frozen]  reproduced=10  tail="DEFECT WITNESSES: 10/10"    edits=3  carrierHash=c2ea4423ec9b014a
PASS  defect-witnesses-2 [native]  reproduced=11  tail="DEFECT WITNESSES 2: 11/11"  edits=8  carrierHash=a766bfe0abffc05d
PASS  defect-witnesses-2 [frozen]  reproduced=11  tail="DEFECT WITNESSES 2: 11/11"  edits=8  carrierHash=a766bfe0abffc05d
PASS  defect-witnesses-3 [native]  reproduced=5   tail="DEFECT WITNESSES 3: 5/5"    edits=9  carrierHash=de59fa01b12e73ef
PASS  defect-witnesses-3 [frozen]  reproduced=5   tail="DEFECT WITNESSES 3: 5/5"    edits=9  carrierHash=de59fa01b12e73ef
B1 CARRIER: 6/6 PASS
```

**6/6 confirmed. 18 confirmed** (B1's own; `defect-witnesses-2` shows 8 edits per run because it inherits the two accepted STEP-EFFICACY D12 substitutions, so 20 are applied in total — consistent with the commit message's "20 substitutions", and the two inherited ones are not B1's). The two predicted non-flips are right: `defect-witnesses-2:95`'s calibration cell and `defect-witnesses-3:41`'s surviving `TypeError` carry no substitution. `git status` empty after all six runs — the substitution really is in memory only, and the deterministic `carrierHash` per file shows the same prepared program in both Date modes.

### 6. `load-write-package.cjs --ci` — identical refusal on the candidate AND on pristine `acd3b67`

```
[candidate ffa4243] exit=1   LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
[base      acd3b67] exit=1   LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
```

Byte-identical stderr, 7/7 lines, 0 differing. **The builder's "identical on pristine" claim is verified: the refusal is pre-existing and not attributable to B1** — consistent with `DECISIONS.md:98` already recording `load-write-package --ci` as superseded on this tip.

### 7. Conform suite and the second gate — both pre-existing, both unmoved by B1

```
node rebuild/conform/run.cjs
  candidate: exit=1  82 stdout lines   SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
  base     : exit=1  82 stdout lines   (identical terminal line)
  line-for-line: 82/82, 2 lines differ — and the ONLY difference in both is the absolute worktree path embedded in the
  "engine artifacts present" diagnostic (…/review-b1/… vs …/rv1/base/…). Content otherwise identical. 0 stderr on both.

node rebuild/engine/test/second-gate.mjs --candidate
  candidate: exit=1  stdout 6/6 · stderr 9/9      base: exit=1  stdout 6/6 · stderr 9/9      0 differing lines either stream
  FAILED ASSERTION tools/engine-test.jsx:106
  SECOND GATE candidate: FAIL — second gate failed; inspect ignored public diagnostic logs
  (the reference half PASSES on both: FINAL108 3072/0, vacuity 9 known hits baseline matched,
   SYNC-LAWS 18 laws over 59 seeds, surface byte-identical to the committed baseline at 123 077 bytes)
```

**Confirmed line-for-line** apart from the two path-only lines, which the builder's "0 differing" almost certainly reflects (same-path run). The `tools/engine-test.jsx:106` abort is the pre-existing D12 one the brief predicts. B1 moves neither gate.

### 8. The one refusal that IS B1's — `native-carriers-profile.verify()`

```
candidate ffa4243 : verify() REFUSED  code=ERR_ASSERTION  message=Unchanged parent pin: rebuild/engine/dates.cjs
base      acd3b67 : verify() SUCCEEDS (returns the M2-NATIVE-CARRIERS manifest, sourceBase 189523bd…, parent 5073977b…)
```

The builder calls this "the expected refusal" and is right in substance — the accepted parent profile pins the parent's engine bytes and B1 changes four of them — but it must be stated plainly: **this refusal is caused by B1, unlike the other three**, and it is the mechanical proof that B1 cannot be accepted under its parent's profile. B1's own closed successor profile is required (C7), and the builder correctly declined to author it on lane-boundary grounds (report §5 item 6). Until it exists there is **no gate that can say PASS for this package**.

Separately, `native-carriers-package.cjs --ci` fails identically on both trees (`NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld`, exit 1, byte-identical stderr). Root cause independently established and **worse than report §4.9 states**: `@noble/hashes` and `@noble/ciphers` are required by `rebuild/.../reconciliation/codec.cjs`, `frame-browser-entry.mjs` and friends, but are **absent from `package.json` entirely** (deps: react, react-dom; devDeps: esbuild, jsdom, yaml). `package-lock.json` mentions `@noble/hashes` only as another package's `^1.8.0 || ^2.0.0` requirement, and `npm ci --include=dev` installs 44 packages with no `node_modules/@noble` at all. So the **accepted parent package's own CI gate is unreproducible from a clean `npm ci` on any tree**, which is not a B1 fact but does mean neither builder nor reviewer could demonstrate that B1 leaves the parent package intact. Recorded as a residual risk and escalated (C8).

### 9. Own bite #1 — revert every one of B1's ten hunks, one at a time: 13/13 CAUGHT

My own design, not in the brief: thirteen single-hunk reverts back to frozen form, each measured against the defect's v4 law, all three carriers and the 82-cell battery.

```
HUNK REVERTS 13 · CAUGHT 13 · NOT CAUGHT 0 · HARNESS 0
```

| revert | detected by |
|---|---|
| D10 `weeksBetween` | law D10 GREEN→RED · carrier `defect-witnesses` · cells `w_spring, w_fall, w_rev` |
| **D8 guard** | law D8 GREEN→RED · carrier `defect-witnesses` · cells `stale8mo, old2day, old3day` + cross `D21.xD8_*` — **and the full 45-law run shows D22 returning to RED/RED/mutant-DETECTED, which isolates D8's guard as the sole cause of the parity break** |
| D21 `sleepInfo` tomorrow | law D21 GREEN→RED · carrier `defect-witnesses-2` · cells `fallback_sameDate, fallback_2027` |
| D19 `resumeISO` | law D19 GREEN→RED · carrier `defect-witnesses-2` · 7 cells |
| D19 one-based break day | law D19 GREEN→RED · carrier `defect-witnesses-2` · 3 cells |
| D16 grace + eligibility filter | law D16 GREEN→RED · carrier `defect-witnesses-2` · 5 cells incl. `sealedDue, offWindowDue` |
| **D16 `dueISO` calendar** | **NO law, NO carrier** — only my `2026-11-01` C1 cells |
| D17 `!a.undone` | law D17 GREEN→RED · carrier `defect-witnesses-2` · 2 cells |
| D24 calorie predicate | law D24 GREEN→RED · carrier `defect-witnesses-3` · cell `stepsOnly` |
| **D24 `yISO` calendar** | **NO law, NO carrier** — only my `2026-03-09` cell |
| D25 first-success | law D25 GREEN→RED · carrier `defect-witnesses-3` · cell `zero_of_1` |
| D27 phase gate | law D27 GREEN→RED · carrier `defect-witnesses-3` · cells `law_maint, brkActiveStall, week9_cut` |
| D23 workout scan | law D23 GREEN→RED · carrier `defect-witnesses-3` · 4 cells |

Nothing escaped. The two bolded rows are the finding behind **C5**: the millisecond→calendar halves of D16 and D24 rest entirely on enumerated delta cells, and the brief itself admits no law covers `today.cjs:206`'s `yISO`.

### 10. Own bite #2 — DST-boundary and `2026-11-01` forecast probes, executed

Measured on the candidate (all fixtures invented):

```
D10   weeksBetween 2026-03-08→03-15 = 1      2026-11-01→11-08 = 1      plusDays('2026-11-01',1) = '2026-11-02'
D21   sleepInfo.clean, today=2026-11-01, night {d:'2026-11-01',h:1}          = false   (the D21 repair, live)
D21   sleepInfo.clean, today=2027-11-07, night {d:'2027-11-07',h:1}          = false   (a second fall-back year)
D23   nowModel workout, today=2026-11-01, map{1:'L'}  = LOWER BODY · TOMORROW / iso 2026-11-02
D24   yISO on 2026-03-09 with logs {03-07 steps-only, 03-08 cal} → owed ["night"]     (calendar), ms form → ["night","yesterday"]
D16   C1, forecast d=2026-11-01, GRADE_LAG=7 calendar days → due 2026-11-08, grace 2026-11-09:
        read 2026-11-07 (6th calendar day) -> {graded:0, hit:null}      <-- correctly UNGRADED
        read 2026-11-08 (due)              -> {graded:1, hit:true}
        read 2026-11-09 (grace)            -> {graded:1, hit:true}
        read 2026-11-10                    -> {graded:0, hit:null}      <-- correctly UNGRADED
D19   break 2026-10-26→2026-11-01, day 2026-11-01: next.when = "resumes Sun 11/1"+1 calendar day, not a 25-hour add
D8    boundary cells hold: 6.5 h (DEBT_LAST_H) -> true · 6.4 h -> false · three 6.6 h -> false · three 7 h -> true · empty -> true
```

The C1 divergence the brief's condition C1 names is real and B1 is on the right side of it: the D16 law's control adds `7*DAY` in milliseconds, so on the fall-back interval it would grade the 6th calendar day; the product rule adds seven calendar days and refuses. The control is a result oracle for the September cases only, never the calendar oracle. **Condition C1 is satisfied by measurement, not argument.**

### 11. Scope checks that passed

- `plusDays` appears in exactly four engine files and in documentation — nowhere else in `rebuild/`, `tools/` or `scripts/`. No literal composition list enumerates `dates.cjs`'s exports (`engine/index.cjs` spreads them), so unlike NATIVE-CARRIERS's *new modules*, this new *function* needs no `index.cjs`, `browser-engine` or `engine-runtime-host.cjs` registration. `writers-source.cjs:12`'s pinned `delegates` list is unaffected because `plusDays` was correctly **not** added to `writers.cjs`.
- `migrate.cjs` and `writers.cjs` byte-identical (their goldens are B3's).
- `package-lock.json` byte-identical in every worktree I installed into.
- **Privacy, verdict-only:** `rebuild/conform/private/` does not exist on this tree and I did not create it. `ledger/` was never opened. No private fixture was read, and no private value, count, hash or prose appears anywhere in this review. I ran no `--full` mode.

---

## RESIDUAL RISKS

1. **The D8×D21 interaction is a class, not an instance.** It was invisible to ten purpose-written laws and became visible only through a *neighbouring* law's trace comparison. Any B-package that changes a shared helper's contract (`cleanAtDate` here) while another hunk preserves a caller's idiom can reproduce this. Recommend the standing acceptance bar require a **full 45-row diff including `frames parity`**, not raw statuses — brief §7 item 5 measured statuses only, and that is precisely the gap.
2. **No gate can say PASS for B1 yet.** The parent profile refuses (correctly), B1's own profile does not exist, `native-carriers-package --ci` is unrunnable on a clean install, and `load-write-package --ci` / `conform/run.cjs` / `second-gate --candidate` all fail pre-existingly. Acceptance rests on the v4 runner, the carriers, the delta cells and the PM's `--full` on the PC.
3. **`--full` and the private census are unexecuted here** (by design: `DECISIONS:92`, `:93` C4). D16 is B1's only LIVE-TRIGGERED defect and its census change is anticipated; a census change on any of the other nine is a RED stop. Unverified by me.
4. **`@noble/*` undeclared** means the accepted parent package gate cannot be reproduced from a clean clone; `DECISIONS:98`'s recorded `native-carriers --ci PASS` therefore depended on a pre-existing `node_modules`. That is a reproducibility hole in an *accepted* artifact.
5. **Browser/host surfaces unexercised.** Nothing here exercises the phone bundle or the W7 Today page against the changed engine; `D24`'s `nowFocus` and `D23`'s `workout` are both rendered surfaces.
6. **Parent-chain order still unsettled** (`PLAN…v1.md:146` says B2→B1 while `:113` and `DECISIONS:94` say "B2 ∥ B1"). Every pre-image sha256 in the brief, and this branch's base, assume `acceptance-native-carriers.json 295762f0…` as B1's immutable parent. If the PM rules B2 first, B1 rebases and every pin is re-taken.
7. **`2026-08-12` and `START + 63` are my derivation, not the brief's.** If `START` moves, the D27-3 killer date moves with it; the cell should be expressed relative to `START`, not as a literal.

## OPEN ITEMS FOR THE PM

1. **Decide the `sleepInfo` ↔ `cleanAtDate` anchor (C1 + C2).** My recommendation, executed: take the two-anchor `sleepInfo` form into D21's hunk, leave D8's guard alone, reject report §4.1's proposal, and add the D8×D21 cross-case cell. Everything else in B1 is ready.
2. **Decide whether "no sleep restriction" may read GREEN/100**, or must read as UNKNOWN — the owner's word was UNKNOWN and no variant expresses it.
3. **Ratify the 18 witness successor assertions and the carrier mechanism** (brief §6 Q2). B1 cannot pass its own gates without it; I have executed all 18 and all three files stay byte-identical.
4. **Approve the `plusDays` primitive and the export-surface change** (brief §6 Q3, seven names → eight). It is self-contained; no registration edits are needed.
5. **Fix the parent chain once** (brief §6 Q1 / §5.3 / `REQUESTS.md:3`).
6. **Settle §6 Q5** (the `policy.cjs:554` rider) and whichever of §0.1 item 2 / §5.4 is wrong.
7. **Budget B3's goldens for D10's reach** into `writers.cjs:1587,2432` and `migrate.cjs:301,1203` — B1 edits none of those bytes but changes what `weeksBetween(monday, r.d) < 1` returns in the spring-forward week.
8. **`DECISIONS.md:99`'s batched CI re-seal rides on B1** (the A1 lockfile-only tests, retiring the memory-only preview and its `# pass 19` child, re-pinning `rebuild.yml`). Not done on this branch — `.github/` is not lane B's — but B1's closed profile must budget for it.
9. **H1** (`today.cjs:92 e.id === "hack"`) stays out of B1; the brief's §4 recommendation is sound.
10. **Escalate `@noble/*`** to the tooling lane, and consider whether `build-engines.mjs`'s Windows break should be fixed given the owner's PC is the `--full` host.

---

*Reviewer's note on method: this review re-executed everything it asserts. Where I could not execute something — `--full`, the private census, the browser surfaces, and `native-carriers-package --ci` — I have said so rather than inferring it from the builder's report. The builder's report is, on my measurements, accurate and candid on every point except the proposed remedy in §4.1, and it disclosed the one blocking defect against its own interest.*
