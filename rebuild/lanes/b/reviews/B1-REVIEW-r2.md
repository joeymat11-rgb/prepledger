# LANE B — B1 GRADING & TIME WINDOW — INDEPENDENT REVIEW r2 (blind, post-fix)

| | |
|---|---|
| **Branch** | `rebuild/lane-b-b1` |
| **Reviewed sha** | `b54ba14af0f2ef7d75d002d0b86647ed0c0dc6ee` (fixer) |
| **History** | builder `ffa4243` → r1 review `db9fe59` (ACCEPT WITH CHANGES, C1–C8) → fixer `b54ba14` |
| **Base** | `origin/rebuild/t2-client-core` @ `acd3b67` |
| **Brief** | `BRIEF-B1-GRADING-TIME-WINDOW-v1.2.md` (PROPOSED, **not** accepted) |
| **Reviewer** | lane B independent reviewer **r2** (Opus) — not the builder, not the r1 reviewer, not the fixer |
| **Date** | 2026-09-11 |
| **Worktree** | `work/lane-b/review-b1` (detached @ `b54ba14`); own scratch `work/lane-b/rv2/`, outside the repo |
| **Node** | `C:\Users\joeym\.cache\...\node.exe` v24.19.0 · `TZ=America/New_York` · `MEASURED_TEST_NOW=2026-09-03` |
| **Method** | every number below was re-executed by r2 on the owner's PC, with r2's own harnesses in `rv2/`. Nothing was taken from the builder's, the reviewer's or the fixer's reports on trust. No prior agent's scratch harness was reused or read for its results. |

---

## VERDICT — **ACCEPT WITH CHANGES** (two changes; **C-r2-1 is blocking and belongs to lane B**)

**The C1 fix is right and it is proven.** The two-anchor `sleepInfo` is the exact expression r1 executed as `rem2`; it restores `recoveryIndex`'s named `sleep` flag, keeps D8's no-carry-forward clause, keeps D21's fall-back repair, restores D22's frozen↔candidate **frames parity**, and moves the 45-law diff from 11 rows to exactly **10**. I reproduced every one of those, plus two new bites of my own that the fix also closes. The fixer touched **only** `sleep.cjs`, plus one new test file and two documents — no frozen law, witness, tool, golden, gate, oracle, `src`, `.github`, `rebuild/m4/spec`, `package.json` or `package-lock.json` byte.

**But B1's *committed* evidence kills only 17 of the 33 mutants.** Running each of the 32 mutants named in BRIEF v1.2 §2 (plus the fixer's 33rd) against **only the artifacts this branch actually commits** — the ten v4 laws, D22's frames parity, the three witness carriers and the three new delta cells — **17 are caught, 9 are caught only by a value cell that exists nowhere in the repo, and 7 move nothing I ran at all.** The builder's, r1's and the fixer's "31/32 caught" are honest measurements *of their own harnesses* — r1's 82-cell battery and the fixer's 90-cell `fx1/battery-child.js`, both of which their reports say plainly are scratch files that are never committed. That is exactly the defect r1 raised as **C5** for two hunks; measured across all ten, the unprotected surface is **much larger than two hunks**, and it is invisible to a reader of the three reports. The remedy is cheap and is lane B's own file.

### The exact changes required

| # | Change | Owner | Blocking? |
|---|---|---|---|
| **C-r2-1** | Extend `rebuild/engine/test/b1-delta-cells.cjs` with the enumerated cells that carry the mutant kills currently resting on uncommitted scratch batteries — the nine I name in §4 with their exact killer values, and the six the builder/fixer name but nobody has committed (D19-2, D27-2, D27-3, D23-2, D23-3, D23-4). This is lane B's own file; **no lane boundary is crossed, so it is not deferrable to the PM.** | lane B | **YES** |
| **C-r2-2** | The C7 artifact must (a) list `rebuild/engine/test/b1-delta-cells.cjs` as a required package artifact beside the carrier, and (b) carry C4's positive source/alias assertion for `D10`. And the `@noble` escalation should carry the refinement in §7: the packages **are** declared — in `rebuild/m3/w5/package.json` and `rebuild/m3/w6/package.json` — just not at the root that `npm ci` installs. | PM | No (but C7 itself stays blocking) |

Nothing else is required. C1, C2, C3, C5 and C6 are closed; C4 and C7 are honestly deferred and the deferrals are correct (§6); C8 is documented and I have upgraded it from a citation to an executed proof (§7).

---

## 1. THE DIFF — the fixer changed only what it said it changed

```
git diff --name-status db9fe59 b54ba14
  M rebuild/engine/sleep.cjs                             (sleepInfo only, +5/-2)
  A rebuild/engine/test/b1-delta-cells.cjs               (new, 106 lines)
  A rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.2.md (new, 569 lines)
  M rebuild/lanes/b/BUILD-REPORT-B1.md                   (§7, +370)

git diff --name-status acd3b67 b54ba14
  A rebuild/conform/v4/postfix/legacy-b1-carriers.cjs · M dates.cjs · M policy.cjs · M sleep.cjs
  A rebuild/engine/test/b1-delta-cells.cjs · M today.cjs · A brief v1.2 · A BUILD-REPORT · A B1-REVIEW-r1
```

`git diff --name-only acd3b67 b54ba14 -- <scope>` is **empty** for every one of: `tools`, `rebuild/conform/golden`, `rebuild/conform/laws`, `rebuild/conform/oracle`, `rebuild/conform/gates`, `package.json`, `package-lock.json`, `.github`, `src`, `rebuild/m4/spec`, `rebuild/lanes/STATUS.md`, `rebuild/lanes/REQUESTS.md`, `rebuild/DECISIONS.md`. Under `rebuild/conform/v4` the only path is the new `postfix/legacy-b1-carriers.cjs`; under `rebuild/engine/test` the only path is the new `b1-delta-cells.cjs`. On-disk sha256, read by me, not claimed:

```
cf1774660a73e9ee…  laws-clock-and-as-of.cjs        557c12e72690c397…  defect-witnesses.cjs
871a5fcad74a50e6…  laws-receipt-truth.cjs          833db0431e656f86…  defect-witnesses-2.cjs
104803f6ab038ee9…  laws-state-shape-and-failure    f5169bebd527ac13…  defect-witnesses-3.cjs
a9c03c7ac76fdebb…  helpers.cjs                     a201428565aae942…  package.json
2819a7e0683158bb…  run-defect-laws.cjs            b745ab5e0c982ef6…  package-lock.json
654288e073ea6815…  postfix/run.cjs
```

All equal the brief's §0 table and the three carrier pins. **Item 1 of my brief is satisfied in full.**

The applied hunk, verbatim from the tree:

```js
function sleepInfo(s) {
  const n = s.sleep.nights;
  const today9 = isoOf(todayStart());
  const tomorrow = plusDays(today9, 1);
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at,
    clean: cleanAtDate(s, today9) && cleanAtDate(s, tomorrow),   /* D8xD21 — ... */
    last: n[n.length - 1], need: s.sleep.needed };
}
```

D8's `cleanAtDate` guard is **not** narrowed; report §4.1's remedy is **not** adopted. Both are correct.

---

## 2. C1 — EXECUTED. The r1 fixture, its controls, and D22's parity

One harness (`rv2/cross.js` + `cross-child.js`), three trees, only `sleep.cjs` swapped between them; the four engine files restored in a `finally` and `git status` empty afterwards. Every state below is invented by me; the frozen bundle is my own build (§3).

| `sleepInfo(s).clean` → `recoveryIndex` | base `acd3b67` | shipped `db9fe59` | **fixed `b54ba14`** |
|---|---|---|---|
| **A** newest night bed-dated **yesterday**, `h=2` (the r1 fixture) | `false` WATCH/70 *sleep reset* | **`true` GREEN/100** ← the regression | **`false` WATCH/70 *sleep reset*** |
| **B** a night bed-dated **today**, `h=2` (D21's case) | `false` WATCH/70 | `false` WATCH/70 | `false` WATCH/70 |
| **C** newest night **3 days old**, `h=2` (D8 clause 1) | `false` WATCH/70 | `true` GREEN/100 | **`true` GREEN/100** — no carry-forward |
| **D** D21 witness (`today=2026-11-01`, night `2026-11-01 h=1`) | `true` GREEN/100 | `false` WATCH/70 | **`false`** — the D21 flip survives |
| **E** empty history | `true` GREEN/100 | `true` | `true` |
| **F** three clean 8 h nights | `true` GREEN/100 | `true` | `true` |

Row **A** is the r1 fixture built from scratch by me: a 2 h night bed-dated yesterday reads **WATCH / 70** with the factor `sleep reset — 0 of 3 clean nights` — the flag is **alive again**, which is what `DECISIONS.md:60` demands ("every other recovery check still applies"). Row **C** is the other half of the same ruling ("not carry-forward of the last logged night") and it holds. Row **D** is what decides the carrier: because it still reads `false`, the substitution `B1-D21-fall-back-same-date-night-counts` is unchanged and the carrier does not need an edit (confirmed 6/6 in §3).

**D22's frames parity, per-law `inspect()` on the three trees:**

```
[base   ] D22 raw RED/RED · ctl GREEN/GREEN · detailParity=true · framesParity=TRUE   frames 2/2
[shipped] D22 raw RED/RED · ctl GREEN/GREEN · detailParity=true · framesParity=FALSE  frames 2/2
[fixed  ] D22 raw RED/RED · ctl GREEN/GREEN · detailParity=true · framesParity=TRUE   frames 2/2
```

**The second `cleanAtDate` adds no traced frame**, measured not argued: D21's frame list is `[sleepInfo] → [sleepInfo>cleanAtDate]` on the **shipped** candidate *and* on the fixed one — byte-identical; on base it is `[sleepInfo] → [sleepInfo]`. D8's and D21's `framesParity=false` is by construction (they are repaired laws) and is unchanged from the shipped candidate. The only frames-parity movement anywhere in the 45 is D22's, and it moves back to `true`. **C1 is closed.**

---

## 3. THE RE-RUN EVIDENCE — my own build, my own harnesses

### 3.1 Frozen bundle

`build-engines.mjs` is still Windows-broken (not lane B's file). I used the repo's own recipe, `legacy-gates.publicReferences({baseline, scratch, sourcePins: manifest.baseline.buildSources})`, 10 source pins, `FROZEN-BUILD-SOURCE-PIN` checked inside:

```
main -> rv2/.tmp/main/engine.cjs  bytes=815248  sha256=615cfe7e510497295c85ecdc441f583fffcab5eae8a7b68fcb36c46773784b21
old  -> rv2/.tmp/old/engine.cjs   bytes=794358  sha256=13401e6dfd6130bdf29fc67ce0ce90ea9f85ade74a48b3d07f0b4a6587140866
```

My byte count differs from the builder's (813 696), r1's (813 716) and the fixer's (813 681) because esbuild embeds input paths and my process ran from a different cwd — `build-engines.mjs` documents this. **The bundle is proved equivalent behaviourally, not by its hash:** it reproduces the base tip's terminal line exactly (below).

### 3.2 The 45 laws — exactly 10 rows move, and D22 is not one of them

```
[cand b54ba14] TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
[base acd3b67] TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
ROWS MOVED 10 · UNCHANGED 35 · moved ids: D8, D10, D16, D17, D19, D21, D23, D24, D25, D27
```

Every moved row reads `RED-frozen / GREEN-candidate / AUDIT-FAIL`, and `RED-frozen / RED-candidate / mutant-DETECTED` on base. **`D22` is one of the 35 byte-identical rows** — it was the 11th on `ffa4243`/`db9fe59` and it is gone. `AUDIT RED-FIRST FAIL` is the pristine terminal too, so it is not a B1 regression. **Exactly the numbers §7.4 and brief §A1 claim, reproduced independently.**

### 3.3 The carrier — 6/6 PASS, 18 substitutions, files byte-identical

```
PACKAGE_ID M2-B1-GRADING-TIME-WINDOW · COVERS witnesses-1, witnesses-2, witnesses-3
substitutions declared: 18   (defect-witnesses 3 · defect-witnesses-2 6 · defect-witnesses-3 9 — counted from EXPECTATIONS)
all three witness files on disk == their pins (MATCH=true)
PASS defect-witnesses   [native]/[frozen] reproduced=10 tail="DEFECT WITNESSES: 10/10"   edits=3 carrierHash=c2ea4423ec9b014a
PASS defect-witnesses-2 [native]/[frozen] reproduced=11 tail="DEFECT WITNESSES 2: 11/11" edits=8 carrierHash=a766bfe0abffc05d
PASS defect-witnesses-3 [native]/[frozen] reproduced=5  tail="DEFECT WITNESSES 3: 5/5"   edits=9 carrierHash=de59fa01b12e73ef
B1 CARRIER: 6/6 PASS · git status empty after all six runs
```

### 3.4 Conform suite, second gate, profile refusal, 19 gates

```
conform stdout : base=82 cand=82 DIFFERING=0     stderr base=0 cand=0 DIFFERING=0
                 terminal (both): SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first ... · 70 GREEN ...
second-gate    : stdout base=6 cand=6 DIFFERING=0   stderr base=3 cand=3 DIFFERING=0
                 reference half PASSES on both (FINAL108 3072/0 · vacuity 9 known · SYNC-LAWS 18/59 seeds · surface 123 077 bytes)
                 candidate half FAILS on both at tools/engine-test.jsx:106 (the pre-existing D12 cell)
native-carriers-profile.verify() : candidate REFUSED code=ERR_ASSERTION "Unchanged parent pin: rebuild/engine/dates.cjs"
                                   base      SUCCEEDS artifact=295762f0… accepted=true sourceBase=189523bd
19 original gates, base vs candidate: MOVED 2 — witnesses-1 (0/Y → 1/N) and witnesses-3 (0/Y → 1/N). Every other
   gate's exit code and needle are identical on both trees, migrate-full included (verdict-only, private absent).
```

**Caveat I owe the reader:** my gate harness runs each gate directly and does **not** materialise the `native-carriers-reference` preimage packet or set `EARNED_NATIVE_PACKET_ROOT`, so 14 of the 19 fail on **both** trees for want of that preparation. That makes my run a valid *differential* — which is the claim under test — but not an absolute gate verdict. Under that harness only 5 gates pass on the candidate (witnesses-4, witnesses-6, merge-differential, merge-laws, strict). §7.9's "2 of 19 moved" is confirmed; "the other 17 pass" is **not** something either of us measured.

---

## 4. THE MUTANTS — the finding behind **C-r2-1**

I transcribed all 32 mutants named in BRIEF v1.2 §2 myself, from the brief's prose, as exact **single-occurrence** string edits (pre-flight: every anchor resolves exactly once), plus the fixer's 33rd (`D21-4 drop-the-today-anchor`). Each is applied to the candidate tree, measured in a fresh child process, and the four engine files are restored between runs (final sha256s re-printed, `git status` empty).

**The detector set is the point.** I measured each mutant against **B1's committed artifacts only**: the ten v4 laws + D22's frames parity, the three witness carriers, and the three new delta cells. Separately — and reported separately — I ran a 17-cell battery of my own, which is *not* committed anywhere, to show whether a surviving mutant is unkillable or merely unprotected.

```
MUTANTS 33 · CAUGHT-by-committed-artifacts 17 · caught ONLY by an uncommitted battery cell 9 · NOT CAUGHT AT ALL 7 · HARNESS 0
```

**Caught by the committed artifacts (17):** D10-3 · D8-1 · D8-2 · D21-1 · D21-2 · D21-3 · **D21-4** (law `D22_framesParity true→false` + delta-cells 2/3 — the detector the shipped candidate needed and nobody had) · D19-1 · D19-3 · D16-2 · **D16-4** (delta-cells only) · D17-1 · **D24-1, D24-3** (delta-cells only) · D24-2 · D27-1 · D23-1 (carrier `defect-witnesses-3` — the surviving `TypeError`, exactly as C3 item 3 says).

**Caught ONLY by a cell that exists in no committed file (9):**

| mutant | the only thing that moved | the value that kills it |
|---|---|---|
| `D10-1 round-the-week-not-the-days` | `D10.w_0906`, `D10.w_year` | `weeksBetween('2026-09-03','2026-09-06') = 0.42857142857142855` (mutant `0`) |
| `D8-3 drop-the-three-night-mean` | `D8.three66` | three 6.6 h nights ending last night → `false` (mutant `true`) |
| `D16-1 ungraded-counts-as-miss` | `D16.lateRead` + 2 | a late read row is `{graded:0, hit:null, **miss:false**}` |
| `D16-3 drop-the-eligibility-filter` | `D16.sealedDue` | a **sealed** read on the due date → `{graded:0, hit:null}` |
| `D17-2 undone-means-auto` | `D17.undone` | an undone row keeps `auto:false` |
| `D17-3 applied-always-false` | `D17.neither` | neither flag → `applied:true` |
| `D25-1 require-a-majority` | `D25.2of4` | `2/4` → `caution` (mutant `good`) — and `1/2` does **not** move (C3 item 2 reconfirmed) |
| `D25-2 drop-the-one-miss-allowance` | `D25.1of2` | `1/2` → `good` (mutant `caution`) |
| `D25-3 zero-rows-becomes-caution` | `D25.noRows` | no protein rows → `{state:"quiet", detail:"counting only"}` |

**Nothing I ran caught these 7:** `D10-2 utc-stamp-substitution` · `D19-2 resume-plus-one-millisecond-day` · `D27-2 read-plan-phase-directly` · `D27-3 gate-on-programme-week-and-phase` · `D23-2 remove-the-catch` · `D23-3 rest-day-on-any-failure` · `D23-4 week-step-by-milliseconds`.

For `D10-2` that is the expected answer and it is now the **fourth** independent confirmation that it is behaviourally unkillable (builder, r1, fixer, me) — **C4 stands**. For the other six I did **not** author the fixtures the builder and the fixer describe (a fall-back-dated break end; a `brk`-active athlete; `START + 63`; a throwing accessor; a fall-back-week scan), so I do **not** claim they are unkillable — I claim, and this is the point, that **their kills live in nobody's repository.**

**Why this matters, plainly.** All three prior reports state "31/32 caught". Both r1's and the fixer's own reports say their batteries are scratch files in `work/lane-b/rv1/` and `work/lane-b/fx1/` that are never committed. r1 drew exactly the right conclusion for two hunks (C5) and the fixer closed it with three cells. Applied consistently to all ten hunks the same argument reaches **fifteen more cells**. Without them, a future edit that reintroduces any of those nine defects turns **every** committed B1 gate green. That is the same failure mode as the shipped D8×D21 defect, one level up.

---

## 5. C2 / C5 — the three new delta cells bite, and they bite their own hunk

`rebuild/engine/test/b1-delta-cells.cjs` run by me on six trees:

```
candidate b54ba14          exit=0  cellsHeld=3/3  "B1 DELTA CELLS: 3/3 hold; D16 dueISO, D24 yISO and the D8xD21 cross-case"
base acd3b67               exit=1  cellsHeld=0/3  FAILS at cell 1 :: TypeError: T.plusDays is not a function
REVERT D16 dueISO calendar exit=1  cellsHeld=0/3  FAILS at cell 1  (AssertionError)
REVERT D24 yISO calendar   exit=1  cellsHeld=1/3  FAILS at cell 2  (AssertionError)
REVERT D8xD21 2nd anchor   exit=1  cellsHeld=2/3  FAILS at cell 3  (AssertionError)
REVERT D8 guard            exit=1  cellsHeld=2/3  FAILS at cell 3  (AssertionError)
REVERT D16 grace+filter    exit=1  cellsHeld=0/3  FAILS at cell 1
REVERT D24 calorie predicate exit=1 cellsHeld=1/3 FAILS at cell 2
REVERT D10 weeksBetween    exit=0  cellsHeld=3/3  (correct — D10 has its own law and carrier)
```

**3/3 on the candidate, 0/3 on base, and each of the three target hunks' revert fails its own cell.** On base the file fails with `T.plusDays is not a function` rather than an assertion, because the primitive does not exist pre-B1 — the fixer says so in §7.7 rather than presenting it as a behavioural kill, which is the honest way to report it. **C2 and C5 are closed for the three cells they cover.**

---

## 6. C3, C4, C6, C7 — verified, and the deferrals judged

**C3 — the evidence corrections are present in brief v1.2 §A4 and I re-derived three of the four independently:**

1. **32 named mutants, not 31.** I counted §2's paragraphs myself: D10 3 · D8 3 · D21 3 · D19 3 · D16 4 · D17 3 · D24 3 · D25 3 · D27 3 · D23 4 = **32**. Fourth independent count.
2. **`D25-1`'s killer is `2/4`, not `1/2` or `6/7`.** Executed: under `require-a-majority`, `1/2` is unmoved (`good` both sides) and only `2/4` flips `caution → good`. `1/2` *is* the killer for `D25-2`. Confirmed.
3. **`D23-1`'s only detector is the `defect-witnesses-3` carrier** (the surviving `TypeError`). Confirmed — in my run the carrier was the sole detector.
4. **`D27-3` needs `START + 63 = 2026-08-12`.** Derived from scratch by sweeping August 2026 with a committed cut: `arc.weeks` and `weekDay().wk` straddle the `>= 10` gate on **exactly `2026-08-12` … `2026-08-18`** (`weeks` 9 → 9.9 while `wk` = 10); `2026-08-11` (8.9/9) and `2026-08-19` (10/11) both agree. Third independent convergence, and it confirms A4's instruction to express the cell as `START + 63 days` rather than the literal.

**C4 — deferred to the C7 artifact: ACCEPTABLE.** `D10-2` is unkillable behaviourally (four confirmations), `BRIEF-IMPORT-GUARDS.md:88` forbids earning a kill from a refusal, and a positive source/alias assertion is a *package-artifact* construct that lives under `rebuild/m4/spec` — a directory `LANES.md` assigns to the PM. Lane B specifying it and declining to author it is the correct call. It must not be lost: it is **C-r2-2(b)**.

**C6 — settled and consistent with the code.** Brief v1.2 §A4 item 6 rules the `policy.cjs:554` rider **OUT**, §0.1 item 2 correct, §5.4's "3+1+2" wrong, arithmetic 3 + 1 + 1 = **5** new delegate lines. The tree agrees exactly: `today.cjs` gains `phaseArc`, `plusDays`, `sleepInfo`; `sleep.cjs` gains `plusDays`; `policy.cjs` gains `plusDays`; and no `weeksBetween` rider appears in `phaseArc`. Closed.

**C7 — deferred to the PM: ACCEPTABLE on ownership, but it is now carrying more than it was.** `LANES.md`'s table gives `rebuild/m4/spec` to the PM and gives lane B `rebuild/engine/*` and `rebuild/conform/v4/*` "ONLY within an accepted package brief"; the brief is not accepted, so lane B declining to author `acceptance-b1-grading-time-window.json`, `b1-grading-package.cjs` and `b1-inherited-carriers.cjs` is right, and it was right at r1 too. Two things must be said plainly: (i) **there is still no gate that can say PASS for B1** — `native-carriers-profile.verify()` refuses correctly, and that refusal is B1's own; (ii) per §4, C7 is also where fifteen missing delta cells would otherwise have to live. §4's remedy puts them in `b1-delta-cells.cjs` instead, which lane B owns outright — that is why **C-r2-1 is lane B's and is blocking**, and why it does not wait on the PM.

**One process nit, non-blocking.** `LANES.md`'s ownership rule says a lane that needs something outside its files "write[s] a request into `rebuild/lanes/REQUESTS.md` … and continue[s]", and that folder is explicitly append-only/shared rather than forbidden. The fixer quoted its `@noble` request line in the report instead of filing it, on collision grounds. That is defensible on an unmerged candidate branch, but the line then exists only inside a build report; **someone has to file it**, and that someone is now the PM.

---

## 7. C8 — asked as a question, answered by execution: **yes, a clean `npm ci` really cannot run the parent gate**

r1 inferred this; the fixer documented it. I proved it, and found the reason is narrower and more fixable than either says.

`node_modules/@noble` is absent in this worktree (`npm ci --include=dev` state, 37 installed packages), and it cannot be otherwise: `package-lock.json` has **70 package entries and not one of them is `@noble/*`** — the two mentions at lines 658/661 are another package's `"^1.8.0 || ^2.0.0"` requirement, which `npm ci` does not install. Running the accepted parent gate leaves its own diagnostic log behind, and that log names the failure:

```
node rebuild/m4/spec/native-carriers-package.cjs --ci        [base acd3b67]
  stdout: POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0…
  stderr: NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   exit=1
  .tmp/native-carriers-package/focused.log  (the FIRST required child, `# pass 15`):
    Error: Cannot find module '@noble/hashes/sha2.js'
    Require stack:
      rebuild/m3/w5/reconciliation/codec.cjs  <-  rebuild/m3/w5/source/codec.cjs
      <-  rebuild/m4/spec/native-next-target-candidate/fixture.cjs
      <-  rebuild/m4/workout/test/native-next-targets.test.cjs
    # tests 3 · pass 0 · fail 3
```

**The refinement neither prior report has.** The packages are not undeclared — they are declared in the *sub-package* manifests: `rebuild/m3/w5/package.json` → `"@noble/hashes": "2.2.0"`, `rebuild/m3/w6/package.json` → `"@noble/ciphers": "2.4.0", "@noble/hashes": "2.2.0"`, each with its own pnpm lockfile. What is missing is that the **root** gate reaches across the sub-package boundary (`m4/spec` fixture → `m3/w5` codec) and resolves from the **root** `node_modules`, which `npm ci` fills from the root `package.json`. So the fix the PM files is a choice between "declare the two at the root" and "install the w5/w6 workspaces before the root gate" — not a blind dependency addition. 11 code files under `rebuild/` reference `@noble` (I counted 19 mentions in 14 files; 3 of those are the manifests above and `cipher-imports.json`), which matches the fixer's count exactly.

**One correction to r1 and to §7.9.** The two `--ci` refusals are *not* identical runs on the two trees. The stderr line is the same, but on the **candidate** `native-carriers-package --ci` fails **earlier** — inside `Profile.verify()`, at B1's own `Unchanged parent pin: rebuild/engine/dates.cjs` — and never prints the `POSTFIX … AUTHORIZED` line that base prints, never reaching the `@noble` failure at all. The conclusion (pre-existing, not B1's) is unchanged; the evidence for it is weaker than "byte-identical stderr" suggested, and the honest statement is that **on the candidate the parent gate cannot get far enough to tell us anything about `@noble` either way.**

(Minor: my line counts for the second gate are 6 stdout / 3 stderr where §7.9 says 7 / 4 — I filter blank lines. The content is identical line-for-line and identical between trees; nothing turns on it.)

---

## 8. TWO NEW BITES OF MY OWN (not on the r1 list)

Both are states r1 did not test. Both were measured on all three trees with the same harness as §2.

### Bite 1 — a night bed-dated TODAY, and a row bed-dated TOMORROW

| state (`today = 2026-09-03`) | base | shipped | **fixed** |
|---|---|---|---|
| `N1a` the **only** night is bed-dated **today**, `h=2` | `false` WATCH/70 | `false` WATCH/70 | `false` WATCH/70 |
| `N1b` the only night is bed-dated today, `h=8` | `true` GREEN/100 | `true` | `true` |
| `N1c` yesterday `h=8` **and** today `h=2` | `false` WATCH/70 | `false` | `false` |
| `N1d` yesterday `h=2` **and** today `h=8` | `false` GREEN/80 | `false` GREEN/80 | `false` GREEN/80 |
| **`N1e` last night `h=2` with a row dated TOMORROW (`2026-09-04`, `h=8`)** | `false` GREEN/80 | **`true` GREEN/100** | **`false` GREEN/80** |

**`N1e` is a second, independent instance of the shipped defect that nobody had found.** One stray future-dated row — a mis-set phone clock, a bad import, a timezone slip — was enough on `db9fe59` to make a 2 h night vanish from recovery entirely, because `nightsBefore(tomorrow)`'s newest row was then two days before `tomorrow` and D8's guard let it through. The two-anchor form closes it: `cleanAtDate(s, today9)` still sees `2026-09-02` as exactly `today − 1`. This is new evidence **for** the fix, and it is the cell I would add to `b1-delta-cells.cjs` next.

**And one thing the fix does not close, which the PM should see (pre-existing, not a B1 regression — base behaves identically).** `N1a`: a night bed-dated **today** applies a full sleep restriction. By the product's own dating rule (frozen `src/app.jsx:12334`: a night "belongs to the evening it began … never the one you haven't slept yet"), such a row *is* the night not yet slept. D21's accepted repair is precisely "a same-date row counts", which is right on the fall-back date and questionable on the other 364. B1 neither creates nor worsens this; it inherits it. Worth one line of a PM ruling, not a B1 blocker.

### Bite 2 — the US fall-back date with a short night on the day before

| state | base | shipped | **fixed** |
|---|---|---|---|
| `N2a` `today = 2026-11-01`, nights 10-29 `8h`, 10-30 `8h`, **10-31 `2h`** | `false` WATCH/70 | **`true` GREEN/100** | **`false` WATCH/70** |
| `N2b` same, but 10-31 `8h` (control) | `true` GREEN/100 | `true` | `true` |
| `N2c` `today = 2026-03-08` (spring forward), 03-07 `2h` | `false` WATCH/70 | **`true` GREEN/100** | **`false` WATCH/70** |

So the shipped defect was **also** live across both DST transitions, on the very date D21 exists to protect — and the fix closes it on both. The arithmetic underneath, measured on the fixed tree: `plusDays('2026-11-01', 1) = '2026-11-02'` and `plusDays('2026-11-01', -1) = '2026-10-31'`, while the millisecond form `isoOf(todayStart() + 86 400 000)` on `2026-11-01` collapses back to **`'2026-11-01'`** — which is D21's original defect, alive in one line. On base, `plusDays` does not exist at all (`TypeError`).

---

## 9. EVERY COMMAND I RAN, AND ITS OUTCOME

All harnesses are mine and live in `work/lane-b/rv2/`, **outside** the worktree; build products in `rv2/.tmp/`. Nothing generated is committed. Every harness that writes to the worktree restores the four engine files and re-prints their sha256 (`b51f3f1e0e94 / 77ced98c0b31 / 4d6c244efa6b / f8d0397abd75`), and ends with `git status --porcelain` empty.

| command | outcome |
|---|---|
| `git -C review-b1 fetch origin && checkout --detach origin/rebuild/lane-b-b1` | landed on `b54ba14af0f2ef7d75d002d0b86647ed0c0dc6ee`, tree clean |
| `git diff --name-status db9fe59 b54ba14` / `acd3b67 b54ba14` / 16 scoped `--name-only` | §1 — 4 files / 9 files; every frozen scope empty |
| `rv2/build-frozen.js` (`legacy-gates.publicReferences`, 10 pins) | `main` 815 248 B `615cfe7e…`; `old` 794 358 B `13401e6d…` |
| `rv2/runboth.js` — `run-defect-laws.cjs` on candidate and on base | 45/29/89/87/104/0 vs 45/39/89/97/104/0 · **10 rows moved, 35 identical** |
| `rv2/cross.js` + `cross-child.js` — 14 sleep/recovery cells × 3 `sleep.cjs` variants, plus `inspect()` on D8/D21/D22 | §2 and §8 tables · D22 `framesParity` **TRUE** on fixed, FALSE on shipped, true on base |
| `rv2/bite-cells.js` — `b1-delta-cells.cjs` on candidate, base and 7 single-hunk reverts | 3/3 · 0/3 · each target hunk's revert fails its own cell (§5) |
| `rv2/carrier.js` — `legacy-b1-carriers.runCarrier`, 3 files × 2 Date modes | **6/6 PASS**, 18 substitutions, all three witness files == pins |
| `rv2/run-mutants.js` + `probe-child.js` — 33 mutants × (10 laws + D22 parity + 3 carriers + 3 cells + 17 battery cells) | **17 CAUGHT by committed artifacts · 9 only-battery · 7 not caught · 0 HARNESS** (§4) |
| `rv2/suite.js` — `conform/run.cjs` and `second-gate.mjs --candidate` on both trees | 82/82 and 6+3 lines, **0 differing in all four streams** |
| `rv2/profile-child.js` — `native-carriers-profile.verify()` on both trees | candidate **REFUSED** `Unchanged parent pin: rebuild/engine/dates.cjs`; base SUCCEEDS `295762f0…` |
| `rv2/gates-run.js cand` / `base` — all 19 original gates on both trees | **2 moved: `witnesses-1`, `witnesses-3`**; all others identical (caveat in §3.4) |
| `rv2/ci.js` — `load-write-package --ci`, `native-carriers-package --ci`, both trees | both exit 1 on both trees; candidate fails earlier, at `Profile.verify()` (§7) |
| `rv2/noble.js`, `noble2.js` + the gate's own `focused.log` | lockfile has **no** `@noble` package entry; gate dies at `Cannot find module '@noble/hashes/sha2.js'` (§7) |
| `rv2/d27-child.js` — `arc.weeks` vs `weekDay().wk` across August 2026 | gates diverge on **2026-08-12 … 2026-08-18**; `START + 63` confirmed (§6) |

**One incident, disclosed.** My first attempt at the 19-gate run was killed mid-flight when its terminal session ended, so its `finally` never fired and the four engine files were left at `acd3b67` in the worktree. I found it with `git status`, restored with `git checkout -- rebuild/engine`, confirmed `HEAD` still `b54ba14` and the tree clean, and re-ran the gates detached with an `exit`/signal restore guard. No commit was made in that window and nothing outside `rebuild/engine` was touched. Other lanes were working on this PC at the time; I touched no other worktree.

**Privacy, verdict-only.** `rebuild/conform/private/` does not exist on this tree and I did not create it. `ledger/` was never opened. `migrate-full` is reported only as an exit code and needle, identical on both trees, and it refuses with `REQUIRED-PRIVATE-PREPARATION-MISSING` for want of the private fixture. No `--full` was run. No private value, count, hash or prose appears anywhere in this review.

---

## 10. RESIDUAL RISKS

1. **Fifteen delta cells still live nowhere** (§4). Until **C-r2-1** lands, nine named mutants are killed only by scratch cells and six more by fixtures no one has written down. This is the shipped-defect failure mode one level up, and it is the single largest risk on this branch.
2. **No gate can say PASS for B1.** `native-carriers-profile.verify()` refuses correctly and the refusal is B1's own; B1's closed profile does not exist (C7); `native-carriers-package --ci` cannot run from a clean `npm ci` at all (§7); `load-write-package --ci`, `conform/run.cjs` and `second-gate --candidate` all fail pre-existingly and identically on base. Acceptance rests on the v4 runner, the carriers, the delta cells and the PM's own `--full`.
3. **`--full` and the private census are unexecuted** by builder, r1, fixer and me, by design (`DECISIONS:92`, `:93` C4). D16 is B1's only LIVE-TRIGGERED defect and its census change is anticipated; a census change on any of the other nine is a RED stop that only the owner's PC can see.
4. **My 19-gate differential ran without the `native-carriers-reference` preimage packet**, so 14 of 19 fail on both trees. The differential is sound; an absolute gate verdict is not available from it (§3.4).
5. **`sleepInfo().clean` has five consumers, two of them in `writers.cjs`** (`:1432`, `:2493`) whose goldens are B3's, plus `sleep.cjs:81`, `sleep.cjs:239` and `today.cjs:574`. The fix moves `clean` strictly toward base for short-last-night states and away from base for stale ones; `writers-source`, `writers-differential` and the conform suite are unmoved between the trees in my run, but no golden was re-derived here. Budget it with D10's reach into `writers.cjs:1587,2432` and `migrate.cjs:301,1203`.
6. **A night bed-dated today still restricts recovery on ordinary days** (§8, `N1a`) — pre-existing, inherited by D21's accepted repair, not a B1 regression.
7. **Browser/host surfaces unexercised.** `D24`'s `nowFocus` and `D23`'s `workout` are rendered surfaces; nothing here drives the phone bundle or the W7 Today page against the changed engine.
8. **Parent-chain order still unsettled** (`PLAN…v1.md:146` vs `:113` / `DECISIONS:94`). Every pre-image sha in the brief assumes `acceptance-native-carriers.json 295762f0…` as B1's parent; if B2 goes first, B1 rebases and every pin is re-taken.
9. **`2026-08-12` is a derivation, not a constant** — express D27-3's fixture as `START + 63 days` (brief §A4 item 4, which I confirm by sweep).
10. **`DECISIONS.md:99`'s batched CI re-seal rides on B1** and `.github/` is untouched on this branch — B1's closed profile must budget for it.

---

## 11. WHAT REMAINS FOR THE PM

1. **Accept (or amend) BRIEF v1.2.** It is still `PROPOSED, NOT ACCEPTED`. Its §0.0 carries C1's withdrawn D21 hunk and its replacement, C2's cross-case cell, C3's four evidence corrections, C4's contract requirement, C5's two cells and C6's settlement — and every number in §0.0 that I re-ran reproduced. Nothing in the code can be accepted before the contract it implements is. If C-r2-1 is taken, §A3's cell table grows and §A5's acceptance bar should say **"every named mutant must be killed by a committed artifact"**, not merely "by the harness".
2. **Rule which B package goes first — B1 or B2.** `REQUESTS.md` has carried this question since 2026-09-10 21:40 ET and lane B has asked twice more since (02:20 ET ACK, 23:20 ET). Both v1.1/v1.2 briefs are written for either answer, and both packages share the `defect-witnesses.cjs` carrier, so the answer decides which closed profile is written first and which package rebases. This is the cheapest unblock on the board.
3. **The UNKNOWN-recovery question the fixer raised — stated plainly.** The owner's own words at `DECISIONS.md:60` are: *"when last night's sleep is missing, recovery is **UNKNOWN** and no sleep restriction is applied today; every other recovery check still applies (not carry-forward of the last logged night)."* B1 implements the second and third clauses exactly. **It does not implement the first, because the engine has no way to express it.** In all four variants — base, shipped, r1's `rem1`, and the fixed `b54ba14` — a missing or stale last night makes `recoveryIndex` return **GREEN / 100 with zero factors**: a positive claim of perfect recovery on a day the engine knows nothing about the athlete's sleep. I re-measured it: cell **C** (newest night three days old, 2 h) and cell **E** (empty history) both read `true → GREEN/100` on the fixed tree, and that is the *correct* behaviour under D8 clause 2 as written. The flag model simply has no third state (`sleep.cjs:220–236`; `score` "survives only to drive the old bar"). **So the PM must decide, as a product ruling and not as a code review: may "no sleep restriction" present to the athlete as GREEN/100, or must it present as UNKNOWN?** If UNKNOWN, that is a new band/state and it is beyond B1's ten hunks — a separate brief, and B1 should not be held for it. If GREEN/100 is acceptable, say so in the ledger so it stops being re-raised by every reviewer.
4. **Author the C7 half** (`acceptance-b1-grading-time-window.json`, `b1-grading-package.cjs`, `b1-inherited-carriers.cjs`, the `witnesses-1` / `witnesses-3` `coverage.run → coverage.covered` move) — it is `rebuild/m4/spec`, the PM's own directory, and until it exists no gate can say PASS for B1. Include **C-r2-2**: `b1-delta-cells.cjs` as a required artifact, and C4's positive source/alias assertion for `D10` (e.g. `weeksBetween`'s declaration text contains no `Date.UTC`), since `D10-2` is now four-times-confirmed unkillable by behaviour.
5. **File the `@noble` request** in `rebuild/lanes/REQUESTS.md` (lane B quoted it in the build report rather than filing it). Use §7's refinement: the packages are declared in `rebuild/m3/w5/package.json` and `rebuild/m3/w6/package.json` but not at the root, and the failing edge is `native-next-targets.test.cjs → m4/spec/native-next-target-candidate/fixture.cjs → m3/w5/source/codec.cjs → m3/w5/reconciliation/codec.cjs → @noble/hashes/sha2.js`, resolved from the **root** `node_modules`. The consequence to record: `DECISIONS:98`'s `native-carriers --ci PASS` depended on a pre-existing `node_modules`, and no agent on any tree can currently reproduce the accepted parent gate from a clean clone. Consider also fixing `build-engines.mjs`'s Windows `ERR_UNSUPPORTED_ESM_URL_SCHEME` break, since the owner's PC is the `--full` host.
6. **Ratify the 18 witness successor assertions and the carrier mechanism** (brief §6 Q2) and **approve the `plusDays` primitive and the seven-to-eight export-surface change** (§6 Q3). I executed all 18 and the three witness files stay byte-identical to their pins.
7. **Rule on `N1a`** (§8): a night bed-dated today applies a full sleep restriction on ordinary days, which reads against the app's own dating glossary. Pre-existing and inherited by D21's repair; one ledger line settles it.
8. **`H1`** (`today.cjs:92 e.id === "hack"`) stays out of B1 — the brief's §4 recommendation is sound and unchanged.

---

*Reviewer's note on method: this review re-executed everything it asserts, with harnesses I wrote, against a frozen bundle I built. Where I could not execute something — `--full`, the private census, the browser surfaces, the prepared-packet gate run, and the six mutant fixtures I did not author — I have said so rather than inferring it from a report. The fixer's work is, on my measurements, accurate and candid on every point I checked; its one overstatement (`--ci` "identical on both trees") is corrected in §7, and its one systematic gap — kills that live in an uncommitted harness — is inherited from the builder and from r1, not invented by the fixer, and is closed by C-r2-1.*
