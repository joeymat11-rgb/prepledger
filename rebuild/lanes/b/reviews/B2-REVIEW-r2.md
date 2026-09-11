# EARNED — LANE B · PACKAGE B2 — INDEPENDENT REVIEW r2

| field | value |
|---|---|
| branch | `rebuild/lane-b-b2` |
| sha under review | `07fba76695b0c70ac41f8f287b4104f3d57b5904` (`07fba76`) |
| history reviewed | builder `c39d1cb` → r1 review `5a4205c` (ACCEPT WITH CHANGES) → fixer `f70dd23` (fixes + BRIEF v1.2 + `b2-delta-cells.cjs`) → `07fba76` (PM-OPTIONAL Q2 hunk at `volume.cjs:159`) |
| base | `origin/rebuild/t2-client-core` @ `acd3b67` |
| reviewer | lane B independent reviewer **round 2** (Opus) — not the builder, not the r1 reviewer, not the fixer; blind, told to disagree |
| date | 2026-09-11 |
| contract read in full | `rebuild/lanes/b/reviews/B2-REVIEW-r1.md` (305 lines) · `rebuild/lanes/b/BUILD-REPORT-B2.md` (1,300 lines, incl. the POST-REVIEW r1 section) · `rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.2.md` (896 lines) · `rebuild/lanes/LANES.md` + Amendments · `rebuild/DECISIONS.md` 60, 82, 88–100 |
| worktree | `work/lane-b/review-b2`, detached at `07fba76`, clean before and after; **no other worktree touched** (my own frozen-bundle worktree was created and removed under `%TEMP%`) |
| environment | node `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` **v24.19.0** by full path · `TZ=America/New_York` · `package-lock.json` unmodified · `node_modules` present (39 entries, esbuild present) |
| frozen bundles | built by **this reviewer** from a private detached worktree: `engine-main` @ `fe516c1f2b1d7d756a24e46d000d23ac1c747aa8` sha256 `4b81b50a9d3fee30b880a0cc123aba36a9e9434993a6918deef946d38bfae961` (814,723 B) and `engine-old` @ `a0009c3644263a2a7227f9b5dec16f7f7edaf51b` sha256 `0d4038fc…` (793,838 B), esbuild 0.28.1. Both differ in bytes from the builder's (`a575ac58…`/814,639 B) and r1's (`ed1fa321…`/814,747 B) **as `build-engines.mjs`'s own header says they must** — bundle bytes depend on the esbuild version and the entry path; the CENSUS is the golden, not the bundle. |
| never opened | `ledger/`, `rebuild/conform/private/**`. Protected surfaces are reported **verdict-only**: no cell value, no hash, no prose from the P6 cells or the set-one laboratory card appears in this file. |

## VERDICT — **ACCEPT WITH CHANGES**

Every load-bearing claim in the fixer's POST-REVIEW r1 section reproduced under independent execution, to the number: the diff is exactly the permitted files, the fourteen laws are `RED-frozen / GREEN-candidate` with **MOVED LINES = 15**, the two candidate variants (with and without the Q2 commit) produce **byte-identical 47-line runner output**, the public census delta is the single D6 cell at both matrix days, `tools/engine-test.jsx:70` does not move, the carrier is 5/5 with 17 substitutions, the witness flips are 8 + 1 + 5, `rebuild/conform/run.cjs` and the observable second gate are byte-identical base vs candidate, and both protected surfaces are UNCHANGED. The r1 reviewer's five required changes are all in. The fixer's own claim that reverting `07fba76` restores the pre-Q2 state cleanly is **verified by executing the revert**.

**The changes required below are the product of this reviewer's own bites and are confined to the PM-OPTIONAL commit `07fba76` and to the brief's §2 text. `f70dd23` needs no change.**

**Exact changes required before this branch is offered for merge:**

1. **`volume.cjs:159`'s Q2 hunk LOSES a correctly-attributed structural move.** Executed (§6 R2-A): a lift renamed `Press heavy` → `Press` (`renames:[{prevN:"Press heavy"}]`) with a current-week receipt `VOLUME +1 — CHEST via Press heavy (now 3 sets)` yields `structuralMovesThisWeek().sets` = **`["p9"]` on base**, **`["p9"]` on B2-without-Q2**, **`[]` with the Q2 hunk in**. `_volDeltas` credits it on all three. So (a) the Q2 hunk turns a *found and correctly owned* move into a *missing* one — the mirror image of the defect r1's Change 2 closed; (b) `_volDeltas` and `structuralMovesThisWeek` now **disagree about the owner of the same receipt**, which is a §2 **C6** violation ("one convention, one reader shape"); and (c) the hunk does not implement **C3**, which specifies comparison "with `===` against `_formerNames(ex)`" — it compares against `x.n` only. Brief §v1.2-A2 discloses the `x.n` choice but calls widening it "a second, unrequested behaviour change"; executed, the *narrowing* is the behaviour change. **Fix one of: add the former-name term at that site (a late-bound `E._formerNames` delegate, the pattern `volume.cjs:16` already uses for `liftTrend`, so the file still gains no `require`), or name the loss explicitly in the Q2 delta list and pin it with a cell.** Either way it must be written down before the PM rules Q2.
2. **Correct §2 C3, or mark it superseded.** C3 still reads "the exact string between `"via "` and the **first** `" (now "`", and §v1.2-A1 states "C3/C4 are unchanged in intent and are **not** rewritten" — but the shipped hunk cuts at the **LAST** `" (now "` and additionally accepts the whole tail. `PLAN…:157` makes §2 the durable convention and **C6 tells B3 to reuse it unchanged**; a B3 author who implements C3 verbatim reproduces exactly the regression r1's bite B-2 found and the fixer repaired. This is a documentation defect with a code-level consequence one package downstream.
3. **Record the two executed residuals the boundary still carries, with cells** (§6 R2-B/R2-C): (a) a **suffix-less** legacy row (`VOLUME +1 — CHEST via Press (now heavy)`, the shape `defect-witnesses.cjs`'s own D3 fixture uses) is claimed by **both** the shorter and the longer lift in `_volDeltas` — on base **and** on the candidate — which contradicts C4 ("complete, not heuristic") and C5 ("exactly one of *mine* / *not mine* / *unattributable*"); and (b) inside `structuralMovesThisWeek` that ambiguity is resolved by **`s.exercises` array order** (`.find`), with and without Q2. `b2-delta-cells.cjs` pins only the positive half of (a) (`B2-DELTA-3c`). Note the Q2 hunk *does* remove the array-order dependence for the **producer-written (suffixed)** shape — an improvement neither the report nor the brief claims; it is worth claiming.
4. **Record `sessionLog[d].entries` same-day duplication as a register candidate** (§6 R2-D). Two entries for one lift on one calendar day are read by `volumeConversion`, `liftTrend` **and** `setOneRead` through `Array.prototype.find`, so only the first is ever seen: the same state read in the opposite entry order flips the whole tolerance verdict (`LIVE/TOLERATED changedAt=2026-08-21` ↔ `READING changedAt=2026-08-25`). Identical on base and candidate — **B2 neither creates nor repairs it** — but it is a D9-family (array-order-decides) blind spot sitting inside the exact surface B2's D31/D32 hunks read, and no law, witness or cell covers it.

Nothing here is a frozen-law objection, a golden regeneration or a protected-surface change. The package acceptance bar (artifact, `--full`, private census, receipt, authorized rerun) is **not** met and is **not** claimed by the fixer; this review does not grant it.

---

## 1. Diff classification, per commit — clean, and exactly as specified

```
git diff --name-status 5a4205c f70dd23
M  rebuild/engine/progression.cjs                                   (6 +/-, the D3 own-receipt boundary — ONE else-branch)
A  rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.2.md            (896 lines)
M  rebuild/lanes/b/BUILD-REPORT-B2.md                               (+390, the POST-REVIEW r1 section)
A  rebuild/lanes/b/b2-delta-cells.cjs                               (258 lines)

git diff --name-status f70dd23 07fba76
M  rebuild/engine/volume.cjs                                        (4 +/-, ONE statement replaced by three at :159)
```

**`f70dd23` touches only `progression.cjs`, the new cell file, brief v1.2 and the report. `07fba76` touches only `volume.cjs`.** Both hunks read in full at `-U6` / `-U10`; nothing else in either file moved.

Cumulative `acd3b67…07fba76`: `M plan.cjs · M progression.cjs · M volume.cjs · A BRIEF-…-v1.2.md · A BUILD-REPORT-B2.md · A b2-delta-cells.cjs · A reviews/B2-REVIEW-r1.md · A rebuild/m4/spec/b2-inherited-carriers.cjs`. No path under `rebuild/conform/**`, `tools/**`, `rebuild/engine/test/**`, `.github/**`, `rebuild/m4/spec/acceptance-*.json`, or `package-lock.json` appears in any commit — **no frozen law, witness file, tool, golden, accepted artifact or lockfile byte moved.** `migrate.cjs`, `earn.cjs`, `writers.cjs`, `merge.cjs` (B3's) and `dates.cjs`, `sleep.cjs`, `policy.cjs`, `today.cjs` (B1's) are byte-untouched.

Product sha256 at `07fba76`, re-verified from the working tree after every experiment: `plan.cjs 4c6f9817…` (19,853 B) · `progression.cjs 9adaeecb…` (54,466 B) · `volume.cjs 4a04f4e8…` (24,444 B). Pre-image at `acd3b67`, re-verified from git before every base run: `plan.cjs 1b26c87f…` (19,784 B) · `progression.cjs 7031838d…` (53,582 B) · `volume.cjs c32298e7…` (23,465 B). These are the brief's §0 and the report's R.0.1 exactly.

**`git status --porcelain` is empty at the start and the end of this review, and after every in-place file swap.**

## 2. The 45-law runner — reproduced on three variants with my own bundle

```
TZ=America/New_York  ENGINE_MAIN=<reviewer's 4b81b50a… bundle>  node rebuild\conform\v4\run-defect-laws.cjs
```
(the three product files swapped in place by `git checkout <ref> --`, sha-verified each time, restored to `07fba76` and re-verified afterwards)

| variant | TOTAL line | exit |
|---|---|---|
| BASE `acd3b67` | `TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| CANDIDATE `f70dd23` (no Q2) | `TOTAL 45 laws · 45 RED-frozen · **25** RED-candidate · **88** GREEN repair controls · **83/104** · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| CANDIDATE `07fba76` (Q2 in) | **byte-identical to the line above** | 1 |

**Line-by-line diff of the 47-line outputs: `base` vs `noq2` → MOVED LINES = 15; `base` vs `q2` → MOVED LINES = 15; `noq2` vs `q2` → MOVED LINES = 0.** The fifteen are the fourteen laws (each `RED-frozen / RED-candidate / mutant-DETECTED` → `RED-frozen / GREEN-candidate / AUDIT-FAIL`) and the TOTAL line, nothing else: D1, D2, D3, D4, D5, D6, D7, D9, D18, D28, D29, D30, D31, D32. No other law changed status on any side. **D18's law is GREEN-candidate with the Q2 hunk in** — the Q2 change does not weaken the repair it sits inside. The two predicted side effects reproduce to the number (`89 → 88` GREEN repair controls, `97/104 → 83/104` detected mutant executions). `AUDIT RED-FIRST FAIL` is the runner's own all-45-must-be-RED rule on both sides and is not B2's.

## 3. D7 — the source scan, and the guard-removal experiment

**Source fact, established independently of the fixer's cell** (`Select-String 'liftTrend' rebuild\engine\*.cjs`, every hit read): the only in-engine call sites are

```
progression.cjs:815  liftTrend(s, id)
progression.cjs:847  liftTrend(s, t.id, { cleanOnly: true, minN: TREND_CLEAN_MIN_SESSIONS })
sleep.cjs:1748       liftTrend(s, tpl.exA)   liftTrend(s, tpl.exB)
volume.cjs:245       liftTrend(s, exId)
volume.cjs:284       liftTrend(s, exId, { window: 999 })
writers.cjs:1399     liftTrend(s, ex.id)
```
plus the three late-bound `(...args) => E.liftTrend(...args)` delegates (`sleep.cjs:30`, `volume.cjs:16`, `writers.cjs:44`) which forward whatever they are given. **Not one supplies `opts.asOf`.** A second, independent grep for `asOf` across `rebuild/engine/*.cjs` shows the only other producers are `energy.cjs:214`/`:634` (`regime`, feeding `_stateAsOf` **state truncation**, never `liftTrend`), `progression.cjs:563` (`typicalError`) and `plan.cjs:302` (`eraFresh`). **So r1's Change 1 is confirmed and the brief's v1.1 sentence was wrong; §v1.2-A3's correction is right.** The fixer's cell `B2-D7a` returns exactly this list and I reproduce it on all three engine variants (line numbers shifting with the hunks, as they must).

**But the guard is load-bearing to the oracle, and I reproduced the proof.** Deleting the single line `    if (opts && opts.asOf && d > atT) continue;` from `liftTrend` (one occurrence, at `progression.cjs:701`; mutant sha256 `31d976f8687b1d07da661ddd3ff6cbcce360f6c628198e3c62b0100742cd5931` — **the fixer's reported value exactly**) and re-running the 45-law runner:

```
with the guard     D7 …  RED-frozen / GREEN-candidate / AUDIT-FAIL     TOTAL … 25 RED-candidate · 88 controls · 83/104
without the guard  D7 …  RED-frozen /  RED-candidate  / AUDIT-FAIL     TOTAL … 26 RED-candidate · 88 controls · 84/104
q2.out vs noguard.out: MOVED LINES = 2 — D7 and the TOTAL line, nothing else (D31 stays GREEN-candidate)
```

`progression.cjs` restored and asserted byte-identical (`9adaeecb…`). **Removing the guard turns D7's law RED and moves nothing else: reproduced.** The honest two-clause statement in §v1.2-A3 — inert to every in-engine consumer, load-bearing to the law, the witness and the exported API — is correct.

## 4. The r1 changes, verified one by one

| r1 change | status under independent execution |
|---|---|
| **1 — correct D7's "Delta cells" sentence** | **DONE and correct.** §3 above; §v1.2-A3 states both clauses and the report repeats them. |
| **2 — escalate Q2 with the executed consequence** | **DONE**, and the hunk exists on its own revertable commit. §5 below. |
| **3 — enumerate the three unlisted delta sites** | **DONE**, as an executable cell file, not prose. §5.3. |
| **4 — the `REQUESTS.md` line for `rebuild/m4/spec/b2-inherited-carriers.cjs`** | **CONFIRMED FILED**, not on this branch. `git show origin/rebuild/t2-client-core:rebuild/lanes/REQUESTS.md` and `git show 16302cd:…` both carry the 2026-09-11 **02:10 ET · B → PM** line ending "…Also: permission for lane-B carrier files under rebuild/m4/spec (b2-inherited-carriers.cjs is already on the b2 branch; LANES.md gives m4/spec to the PM) — or name a lane-B path for carriers". `16302cd` is on `origin/rebuild/t2-client-core` and `origin/rebuild/lane-c`. The branch's own `REQUESTS.md` is the `acd3b67` copy and does not contain it — exactly as §v1.2-A6 says. |
| **5 — fix the brief's §6 product sentence** | **DONE and independently confirmed.** `rebuild/m4/spec/acceptance-native-carriers.json` live sha256 `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` (= `DECISIONS:96`); `product` has **20** keys and **does** contain `rebuild/engine/volume.cjs` pinned at `c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4`, with `plan.cjs 1b26c87f…` and `progression.cjs 7031838d…`; `parent` = `acceptance-load-writes.json 5073977b…` / `M2-LOAD-WRITES`. `require('./rebuild/m4/spec/native-carriers-profile.cjs').verify()` on the candidate throws `ERR_ASSERTION :: Unchanged parent pin: rebuild/engine/volume.cjs`. **B2 supersedes three parent pins and introduces none** — §v1.2-A5's corrected sentence is right. |

**Identity convention C1–C6, checked verbatim against §2 of v1.2.** C1, C2, C5 and C6 are implemented as written (C2's terminality is executed below). **C3 is NOT** — see required change 2. C4's "complete, not heuristic" is contradicted by the suffix-less double-ownership case — see required change 3.

## 5. The Q2 commit `07fba76`, and the revert

**5.1 The r1 B-1 fixture, executed on all three sides** (two lifts `Press`/`press` and `Press incline`/`inc`, 95 ordinary feed notes, then one current-week receipt `VOLUME +1 — CHEST via Press incline (now 3 sets)` at row 95):

| side | receipt past row 80 | the same receipt at row 0 | a lift whose NAME contains `" (now "` |
|---|---|---|---|
| base `acd3b67` | `[]` — invisible past the cap | `["press"]` | `["press"]` |
| B2 without Q2 (`f70dd23`) | `["press"]` — **misattributed** | `["press"]` | `["press"]` |
| B2 with Q2 (`07fba76`) | **`["inc"]`** | **`["inc"]`** | **`["pnh"]`** |

r1's escalation is correct and the hunk closes it. **`exId` is terminal only with the Q2 hunk in**: a row carrying `exId:"p3"` whose prose names `Press` resolves to `p1` on base **and on `f70dd23`** (the `exId` field is simply not read at that site), and to **`p3`** with Q2; the converse (`exId:"p1"`, prose naming the nested lift) resolves to `p1` with Q2. `VOLUME PASSED` is still not a move on every side.

**5.2 The revert is clean, and the cell file survives it.**
```
git revert --no-commit --no-edit 07fba76     → applies, status: "M rebuild/engine/volume.cjs"
git diff f70dd23 --stat                      → EMPTY (the reverted tree is f70dd23 byte-for-byte)
git revert --abort ; git reset --hard 07fba76 → back at 07fba76, status clean
node rebuild/lanes/b/b2-delta-cells.cjs  on f70dd23 bytes → 21/21 HOLD · side CANDIDATE · Q2 NOT APPLIED · exit 0
node rebuild/lanes/b/b2-delta-cells.cjs  on 07fba76 bytes → 21/21 HOLD · side CANDIDATE · Q2 APPLIED     · exit 0
node rebuild/lanes/b/b2-delta-cells.cjs  on acd3b67 bytes → 21/21 HOLD · side BASE      · Q2 n/a         · exit 0
```
**The PM can drop Q2 with one `git revert` and nothing else in the package moves — verified by executing it, not by reading the commit title.**

**5.3 `b2-delta-cells.cjs` is not vacuous — vacuity control run.** Pointed at the **r1-reviewed `5a4205c` engine** (the v1.1 hunk, before the D3 fix) the file reports **18/21, exit 1**, moving exactly `B2-DELTA-3a` (`[]` where `[["2026-09-01",1]]` is pinned), `3b` and `3c`. So the three D3 cells genuinely discriminate the fix, and the file is a real pin rather than a self-satisfying one. The three unlisted delta sites all carry cells that differ by side: `migrate.cjs:1629` (`quarantined: null, filled:true` → `invalid:2026-08-12, filled:false`), `targetsFor({sets:-1, first:[8]})` (`[8]` → `[]`) and the D3 own-receipt boundary.

**One weakness of the file, for the record:** the Q2 state is *detected from* `q2Seen`, and `B2-Q2a` then asserts `q2Seen` against the pin for the detected state — so `B2-Q2a` alone cannot fail for either intended value. `B2-Q2b` and `B2-Q2d` are the cells that actually discriminate (different fixtures, same detector). Not a defect; worth knowing before the cell file is cited as coverage.

## 6. This reviewer's own bites — two NEW ones, not r1's

All bites run on disposable engine copies (`rebuild/engine` copied wholesale, the three files replaced from git by ref, sha-verified). The repo was never modified by a bite.

### R2-A (the one that bit). `volume.cjs:159` × FORMER NAMES — Q2 turns a correct move into a missing one

Lift `p9`, current name `Press`, `renames: [{ prevN: "Press heavy" }]`; one current-week receipt written under the former name, `VOLUME +1 — CHEST via Press heavy (now 3 sets)`:

```
                                         base(acd3b67)   B2 no-Q2(f70dd23)   B2 +Q2(07fba76)
_volDeltas(p9, …)                        [["…",1]]       [["…",1]]           [["…",1]]
structuralMovesThisWeek().sets           ["p9"]          ["p9"]              []        ← LOST
```

On base the substring test `f.t.indexOf("via " + x.n) > -1` happens to reach the former-name row (because the current name is a leading word of it) and charges it to the **right** lift. The Q2 hunk compares `own9`/`tail9` against `x.n` only, so `"Press heavy" !== "Press"` and the move disappears. **`structuralMovesThisWeek().sets` feeds the Auto-Pilot tighten veto, the `volumePush` week budget and the offer-expiry branch (`writers.cjs:2313`) — a missing move is a budget that thinks no set was added this week.** Reachability: a rename whose new name is a leading word of the old one, plus a VOLUME receipt inside the same week. Narrow, but exactly as narrow as the case Q2 was written to fix.

This is simultaneously a **C6** violation (two readers, two answers, same receipt) and a **C3** deviation (C3 says `_formerNames(ex)`). **Caught by: nothing in B2** — no law, no witness, no census cell, no delta cell. That is required change 1.

### R2-B / R2-C. NESTED DELIMITER — a lift named exactly `Press (now heavy) (now light)`

Three lifts: `p1 = "Press"`, `p2 = "Press (now heavy)"`, `p3 = "Press (now heavy) (now light)"`.

**The genuine, producer-written (suffixed) receipt is handled correctly by the v1.2 boundary** — better than base and better than v1.1:

| `_volDeltas` on `… via Press (now heavy) (now light) (now 3 sets)` | base | v1.1 (`5a4205c`) | B2 (both variants) |
|---|---|---|---|
| read by `p3` (the owner) | `[["…",1]]` | **`[]`** | **`[["…",1]]`** |
| read by `p2` | `[["…",1]]` | `[]` | **`[]`** |
| read by `p1` | `[["…",1]]` | **`[["…",1]]` (wrong owner)** | **`[]`** |

and the middle lift's own suffixed receipt is likewise owned only by `p2`. **The nested case works; `lastIndexOf` is the right cut for a name that contains the delimiter.**

**What still does not work is the SUFFIX-LESS legacy row** — the very shape `defect-witnesses.cjs`'s D3 fixture uses (`"VOLUME +1 — CHEST via Press incline"`, no `" (now N sets)"`):

```
_volDeltas, row "… via Press (now heavy)"                 base   B2(both)
   claimed by p1 "Press"                                  YES    YES     ← own9 cuts at the NAME's own " (now heavy)"
   claimed by p2 "Press (now heavy)"                      YES    YES     ← the whole-tail fallback
row "… via Press (now heavy) (now light)"
   claimed by p2                                          YES    YES
   claimed by p3                                          YES    YES
```

Two owners for one receipt, on both sides. Not a regression — but it is an executed counterexample to **C4** ("no substring, no bare prefix … complete, not heuristic") and **C5** ("exactly one of *mine* / *not mine* / *unattributable*"), and `b2-delta-cells.cjs` pins only the positive half (`B2-DELTA-3c`).

**Inside `structuralMovesThisWeek` that ambiguity becomes ARRAY-ORDER DEPENDENCE** — the D9 defect family, at a site B2 edits:

```
structuralMovesThisWeek().sets            exercises order [p1,p2,p3]   reversed
  suffixed nested receipt   base                ["p1"]                  ["p3"]      ← order decides
  suffixed nested receipt   B2 no-Q2            ["p1"]                  ["p3"]      ← order decides
  suffixed nested receipt   B2 +Q2              ["p3"]                  ["p3"]      ← FIXED by Q2
  BARE "Press (now heavy)"  B2 +Q2              ["p1"]                  ["p2"]      ← STILL order-decided
  BARE nested row           B2 +Q2              ["p2"]                  ["p3"]      ← STILL order-decided (and p2 is wrong)
```

So the Q2 hunk **does** deliver an unclaimed improvement (order-independence for the producer's own shape) and **does not** close the bare-row case. Both belong in the record — required change 3.

### R2-D. TECHNIQUE ERA × SET-COUNT CHANGE ON THE SAME CALENDAR DAY

Fixture: five k=2 sessions (2026-08-01…08-17) then four k=3 sessions (08-21, 08-25, 08-29, 09-01); clock 2026-09-03; the first post-change session is **2026-08-21**; a single technique fork swept across it.

```
fork.from      setOneRead (base)   setOneRead (B2)   volumeConversion (base == B2)     liftTrend (base == B2)
none           LIVE n=9            LIVE n=9          LIVE/TOLERATED changedAt=08-21    n=4 k=3 08-21→09-01
2026-08-17     LIVE n=9            LIVE n=5          LIVE/TOLERATED changedAt=08-21    n=4
2026-08-20     LIVE n=9            LIVE n=4          LIVE/TOLERATED changedAt=08-21    n=4
2026-08-21 ◀   LIVE n=9            LIVE n=4          LIVE/TOLERATED changedAt=08-21    n=4
2026-08-22     LIVE n=9            COUNTING n=3      READING        changedAt=08-21    null
2026-08-25     LIVE n=9            COUNTING n=3      READING        changedAt=08-21    null
```

**No off-by-one, and no disagreement between the two boundaries.** A fork dated **exactly on** the first post-change session includes that session in the new era (`eraIdx` counts `f.from <= d`), consistent with r1's B-3, and D30's era cut and D31's `changedAt` cut agree on that day. `volumeConversion` is identical base vs candidate across the entire sweep — D31's added conjuncts do not move this shape. **No defect found; this is the positive half of the bite.**

**The negative half — the literal same-calendar-day collision.** `sessionLog` is keyed by date, so the only way the last pre-change and the first post-change observation share a day is two entries in one day's `entries` array. All three readers take `(entries||[]).find(e => e.id === exId)` — the **first** entry only:

```
2026-08-21 entries [k=2, k=3]   →  volumeConversion READING, changedAt=2026-08-25 ·  liftTrend null       ·  setOneRead LIVE n=4
2026-08-21 entries [k=3, k=2]   →  volumeConversion LIVE/TOLERATED, changedAt=2026-08-21 · liftTrend n=4  ·  setOneRead LIVE n=4
```

**Identical on base and on both candidate variants.** The whole tolerance verdict for the lift is decided by the order of two same-day entries, and the second observation is silently invisible to `volumeConversion`, `liftTrend` and `setOneRead` alike. B2 neither creates nor repairs it; it is a register candidate and it sits inside the surface D30/D31/D32 read — required change 4.

## 7. Re-run evidence, WITH and WITHOUT the Q2 commit

**7.1 Public direct-call census — this reviewer's own, 574 cells per run.** Two state readings (`migrate(null)` and `SEED`), both matrix days, over `programmeVolume`, `muscleVolume`, `volumeImbalance`, `structuralMovesThisWeek`, `nowModel`, `canonicalizePlan`, `dayType` at eight dates, and per lift over all 16 seeded lifts: `targetsFor`, `progressAnchor`, `loadRungs`, `maxedOut`, `nextLoad`, `prevLoad`, `deloadLoad`, `snapLoad`, `repsLostOnJump`, `deriveSighting`, `_volDeltas`, `setOneRead`, `volumeConversion`, `liftTrend`, `liftTrend({asOf})`, `liftCall`, `exActive`.

```
===== 2026-09-03  base -> B2 (+Q2) =====        ===== 2026-09-07  base -> B2 (+Q2) =====
  SEED/perLift/fly/deloadLoad:        5 -> null   (identical set)
  SEED/perLift/hipthrust/deloadLoad:  5 -> null
  migrated/perLift/fly/deloadLoad:    5 -> null
  migrated/perLift/hipthrust/deloadLoad: 5 -> null
cells changed: 4 of 574                          cells changed: 4 of 574

base -> B2 (no Q2):  the same 4 cells, both days
B2 no-Q2 -> B2 +Q2:  0 cells, both days
B2 +Q2   -> v1cut :  0 cells, both days          ← the census cannot see the question the second gate settles
```

**Exactly the single D6 cell (`deloadLoad` for `fly` and `hipthrust`, `5 → null`) at both matrix days, in both state readings. Nothing else moved, and the Q2 hunk adds no census cell.** r1's residual **R-1 reproduces**: candidate-vs-`v1cut` is 0 cells even though the two differ at the protected `:70`.

**7.2 `rebuild/conform/run.cjs`** (`cwd=rebuild/conform`, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, both reviewer-built engines supplied):

```
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families   (exit 1)
```
on **all three** sides, 85-line stdout, **0 differing lines** base↔no-Q2, base↔+Q2 and no-Q2↔+Q2, **0-byte stderr** on all three, `INFO 9 engine-track rig185: W1 PASS, W2 PASS` on all three. **Environment note for the PM, not a B2 signal:** with `ENGINE_OLD` supplied this public clone also prints `BAD 2 port oracle main-vs-main …` and `BAD 3 sensitivity …` beside the expected `BAD 7 privacy … 0 private lines`; all three BAD lines are **identical on all three sides**, so none of them is B2's. (r1 ran without an old engine and saw only the privacy line; with no old engine my run instead prints `BAD 0 engine artifacts present` — also identical on all three sides.)

**7.3 `rebuild/engine/test/second-gate.mjs --candidate`**, run on all three variants:

* reference side completes `SECOND GATE reference FINAL108: 3072 passed, 0 failed` on all three, with identical condition-origin counts, vacuity gate (`9 known hit(s), baseline matched`), SYNC-LAWS (`18 laws … 59 committed seeds`) and `reference surface: byte-identical to committed baseline (123077 bytes)`;
* `.tmp/m2-second-gate/candidate-engine-test.stdout.log` is **267 content lines with ZERO differences** across base, `f70dd23` and `07fba76`; the driver stdout and the 179-byte stderr are identical on all three; exit 1 on all three;
* the candidate side stops at the same **pre-existing D12 cell on every side** — `tools/engine-test.jsx:106`, `ok(se7.status === "LIVE" && se7.resolved === false && Math.abs(se7.slopePer1k) > se7.boundPer1k, "SNAPSHOT 08-07 ITEM B …")`, reported in the log as `FAIL — SNAPSHOT 08-07 ITEM B — the live stepeff fit … exceeds the walking-physics ceiling` — the site the accepted step-efficacy custody owns, and the reason `FINAL4` reads `260 passed, 1 failed`.

**B2 adds no failure inside the 261 observable assertions, with and without Q2. The remaining 2,811 stay unobserved (r1's R-2, still open, still Q9).**

**7.4 `tools/engine-test.jsx:70`** — reproduced directly at the gate's own hard pin `MEASURED_TEST_NOW="2026-07-29"` (`second-gate.mjs:64`) over `tools/snapshots/2026-08-06-ledger.json`, whose sha256 I re-verified as `62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f` (the brief's pin) inside every probe process:

| engine | `nLifts` | `state` | `:70` | `:71` | `:72` | `:76` |
|---|---|---|---|---|---|---|
| pre-image `acd3b67` | **3** | `unknown` | **HOLDS** | holds | holds | holds |
| B2 `f70dd23` (no Q2) | **3** | `unknown` | **HOLDS** | holds | holds | holds |
| B2 `07fba76` (+Q2) | **3** | `unknown` | **HOLDS** | holds | holds | holds |
| v1's unconditional `liftTrend` cut, rebuilt by this reviewer | **0** | `unknown` | **FAILS** | holds | holds | holds |

**The cell does not move on either candidate variant, and Q8's finding is real: the narrowing is what keeps `:70` still.**

**7.5 Carriers, witnesses and flips.**
```
node rebuild\m4\spec\b2-inherited-carriers.cjs
  BASE  acd3b67 :  B2 INHERITED CARRIERS FAIL at defect-witnesses: ERR_ASSERTION           exit 1
  f70dd23       :  5/5 PASS; 17 exact substitutions (9 + 3 + 5 + 0 + 0)                    exit 0
  07fba76       :  5/5 PASS; 17 exact substitutions — byte-identical output                exit 0
```
The carrier is unchanged by both fixer commits and is **not vacuous** (it refuses on base). `witnesses-3` and `-6` take **zero** substitutions and still execute 5/5 and 8 cases + `M6 preserved defects native 4/4`.

Failure-tolerant flip measurement (each witness file **read**, never written; its single-line `witness` helper exact-replaced **in memory**, the module compiled under its own filename so `require("../index.cjs")` still resolves; `git status rebuild/engine/test` empty afterwards):

| gate | base | `f70dd23` | `07fba76` | flips |
|---|---|---|---|---|
| `witnesses-1` `defect-witnesses` | **10/10** | **2/10** | **2/10** | D1 D2 D3 D4 D5 D6 D7 D9 — **8** (D8, D10 still reproduce; they are B1's) |
| `witnesses-2` `defect-witnesses-2` | 10/11 (D12 already RED) | **9/11** | **9/11** | D18 — **1** |
| `witnesses-3` | 5/5 | **5/5** | **5/5** | **0** |
| `witnesses-4` | 5/5 | **0/5** | **0/5** | D28 D29 D30 D31 D32 — **5** |

**14 assertion flips across three files (8 + 1 + 5), identical with and without Q2 — the builder's, the fixer's and r1's numbers exactly.** Direct exit codes for `defect-witnesses[ ,-2..-7].cjs`: base `0 · 1 · 0 · 0 · 1 · 0 · 1`, both candidates `1 · 1 · 0 · 1 · 1 · 0 · 1`. `witnesses-5` and `-7` fail identically on every side — pre-existing at this tip.

**7.6 Protected surfaces — VERDICT ONLY.**
* **P6 second-gate cells `tools/engine-test.jsx:8790–8793`**, reproduced on every engine copy at the gate's `2026-07-29` anchor: **UNCHANGED** — both cells hold on the pre-image bytes, on `f70dd23`, on `07fba76` and even under the v1 cut. No cell values, no hashes, no prose.
* **The seeded set-one laboratory card** (`sleep.cjs:1141` `labAnalytics2`, whose `setOneRead` call at `sleep.cjs:1286` is the only engine consumer of `setOneRead`), compared by digest between engine copies at both matrix days: **base vs no-Q2 UNCHANGED · base vs +Q2 UNCHANGED · no-Q2 vs +Q2 IDENTICAL.** Digests computed, compared and withheld; the comparator was checked to be handling real 64-hex digests, not error strings.
* **`rebuild/conform/private/**`, the private `live.main` golden and `ledger/`**: never opened, never named with values, never hashed, never quoted. The private LIVE census for D30 remains the PM's own `--full` on the owner's PC (`DECISIONS:92`/`:93`).

## 8. Residual risks

- **R2-1 — the Q2 hunk's former-name loss (required change 1).** Until it is fixed or named, `_volDeltas` and `structuralMovesThisWeek` disagree about the owner of one receipt, and the week's structural budget can under-count after a rename.
- **R2-2 — §2 C3's text is now wrong (required change 2)**, and C6 instructs B3 to reuse it. This is the highest-leverage documentation defect in the package: it propagates into B3's D37/D38/D39/D44.
- **R2-3 — the boundary is still not "exactly one owner" for suffix-less legacy rows**, and `structuralMovesThisWeek` resolves that ambiguity by array order (required change 3). C4/C5 overstate what the implementation delivers.
- **R2-4 — same-day duplicate entries are invisible to `volumeConversion` / `liftTrend` / `setOneRead`** and flip the tolerance verdict by array order (required change 4). Pre-existing; unclaimed by any register D-id I can find.
- **R2-5 — `volume.cjs:302` (`_setsMovesSince`) still carries the same owner shape behind its own untouched 120-row cap.** The brief names it and declines it. If the PM keeps Q2, that line is the obvious next inconsistency: two adjacent readers in one file, one on the convention and one not.
- **R-1 … R-7 from r1 all stand**, and I re-executed the two that are checkable here: **R-1** (the census cannot distinguish the candidate from the v1 cut — 0 cells, both days) and **R-2** (2,811 of 3,072 second-gate assertions unobserved; the candidate side stops at `engine-test.jsx:106` on every side).
- **R2-6 — environment.** On a public clone with reviewer-built engines, `rebuild/conform/run.cjs` reports `BAD 2` (port oracle) and `BAD 3` (sensitivity) in addition to `BAD 7` (privacy). Identical on all three sides, so not a B2 delta — but the PM should not read "the conform suite is clean" into "the conform suite is identical".
- **R2-7 — the package bar is NOT met and is not claimed**: no `acceptance-b2-targets-identity-era.json`, no `b2-package.cjs`, no 19-gate identity run, no `--full`, no receipt, no authorized rerun. Correct, given that the parent cannot be claimed until "which B package is first" is ruled.

## 9. What remains for the PM

- **P-1. WHICH B PACKAGE IS FIRST (B1 or B2).** Still unanswered (`REQUESTS.md` 02:10 ET and 02:20 ET). The parent *identity* is ruled (`acceptance-native-carriers.json 295762f0…`, `DECISIONS:96`), but two packages cannot claim one parent, so **no artifact can be written for either until this is ruled.** It is the single blocking item for both branches. Nothing in B2's evidence depends on the answer; only the closed profile does.
- **P-2. Q2 — keep inside B2, or carry to B3. RECOMMENDATION: KEEP, with required change 1 applied.** Reasoning, executed: leaving `volume.cjs:159` unconverted ships a **wrong** structural move (`["press"]` for an incline receipt) where the base shipped a missing one — r1 is right that "leave it" is now a worse decision than it looks. But the hunk as it stands trades that for a **different** wrong answer (a lost move after a rename, §6 R2-A) and leaves the bare-row shape array-order-decided. So: keep the hunk, add the former-name term (a late-bound `E._formerNames` delegate — `volume.cjs:16` already uses that exact pattern for `liftTrend`, so the "no import" constraint holds), and pin both the rename case and the bare-row case as cells. **Second choice: carry Q2 to B3**, which owns `writers.cjs` and can add the writer-side `exId` (C2), making the prose path moot at that site — defensible, and it costs one release of misattribution. **Do not keep the hunk unamended and unpinned**; that is the only option this reviewer would refuse.
- **P-3. Q8 — the `liftTrend` future cut: (a) narrowed to `opts.asOf`, or (b) unconditional.** Rule (a) knowing both executed facts: the guard is **inert on every in-engine call site** (§3), and the unconditional v1 cut **flips the protected `tools/engine-test.jsx:70` from 3 lifts to 0** (§7.4). (b) is not available without a protected-surface stop. If (a), note that D7 in practice is a `progressAnchor`-only repair inside the engine and an `asOf`-only repair at the API boundary — and that the D7 law and the D7 witness are the only things exercising the second half.
- **P-4. Q9 — the 2,811 unobserved second-gate assertions.** Unchanged and unclosed. The candidate side stops at the accepted step-efficacy custody's own cell (`engine-test.jsx:106`) on **base and candidate alike**, so B2 cannot clear this by itself. The PM owns whether B2 may be accepted with 261/3072 observed, or whether the custody must be run first. This reviewer's view: this is the largest unknown in the package and it is not B2's to close.
- **P-5. `rebuild/m4/spec` placement of `b2-inherited-carriers.cjs`.** The `REQUESTS.md` line is filed (02:10 ET, confirmed on the tip). `LANES.md` gives `rebuild/m4/spec` to the PM exclusively; the file needs either a written permission or a lane-B path. `rebuild/conform/v4/postfix/` is the natural alternative — the accepted D12 successor lives there and `LANES.md` gives `rebuild/conform/v4/*` to lane B within an accepted brief. A move is `git mv` plus one `require` re-root; no content change. **The cell file `b2-delta-cells.cjs` is correctly placed already** (`rebuild/lanes/b/*` is lane B's own).
- **P-6. Private matters — verdict only.** The private LIVE census for D30 (the one LIVE-TRIGGERED defect in B2) has not been run by anyone and remains the PM's `--full` on the owner's PC. No private path was opened by this review.

## 10. Every command this reviewer executed, with its outcome

```
git -C <design-pin> fetch origin                                                     → ok
git -C <review-b2> fetch origin ; checkout --detach origin/rebuild/lane-b-b2         → 07fba76, status clean
git diff --name-status 5a4205c f70dd23 | f70dd23 07fba76 | acd3b67 07fba76           → §1 (4 files · 1 file · 8 files); both hunks read at -U6/-U10
git show origin/rebuild/t2-client-core:rebuild/lanes/REQUESTS.md ; git show 16302cd:…→ the 02:10 ET carrier-permission line IS filed (r1 Change 4)
node <reviewer build-frozen-r2.mjs> … fe516c1                                        → 4b81b50a…, 814,723 B, esbuild 0.28.1 (private worktree, removed after)
node <reviewer build-frozen-r2.mjs> … a0009c3                                        → 0d4038fc…, 793,838 B  (engine-old, for run.cjs)
node rebuild\conform\v4\run-defect-laws.cjs   (acd3b67 / f70dd23 / 07fba76, in place) → 45/39/89/97-104 · 45/25/88/83-104 · identical; exit 1 ×3
<reviewer line-diff of the three 47-line outputs>                                     → 15 / 15 / 0 MOVED LINES
<reviewer d7guard.mjs: delete progression.cjs's one asOf guard, re-run, restore>      → mutant 31d976f8…; D7 → RED-candidate; 26/84-104; MOVED LINES = 2; restored 9adaeecb… (true)
node rebuild\lanes\b\b2-delta-cells.cjs        (acd3b67 / f70dd23 / 07fba76)          → 21/21 BASE · 21/21 CANDIDATE Q2 NOT APPLIED · 21/21 CANDIDATE Q2 APPLIED; exit 0 ×3
node rebuild\lanes\b\b2-delta-cells.cjs        (5a4205c bytes — VACUITY CONTROL)      → 18/21, exit 1; B2-DELTA-3a/3b/3c MOVED
node rebuild\m4\spec\b2-inherited-carriers.cjs (acd3b67 / f70dd23 / 07fba76)          → FAIL ERR_ASSERTION exit 1 · 5/5 + 17 subs exit 0 · identical exit 0
node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs  (all three)                  → 0·1·0·0·1·0·1  /  1·1·0·1·1·0·1  /  1·1·0·1·1·0·1
<reviewer flips.cjs — in-memory tolerant witness, originals never written>            → 10/10→2/10 · 10/11→9/11 · 5/5→5/5 · 5/5→0/5, identical with and without Q2
<reviewer setup-engines.mjs → eng-{base,noq2,q2,v1cut,v11}>                           → sha-verified disposable copies; v1cut = the unconditional liftTrend cut
<reviewer census.cjs × 4 engines × 2 matrix days (574 cells each) + censusdiff>       → base→cand 4 cells (the D6 cell ×2 states) both days; noq2→q2 0; q2→v1cut 0
<reviewer probes.cjs × 4 engines>  :70 :71 :72 :76 · P6 · lab-card digest             → :70 3/3/3/0 (v1cut FAILS); P6 HOLDS ×4; lab card UNCHANGED both days
cd rebuild\conform && node run.cjs   (all three, ENGINE_MAIN+ENGINE_OLD)              → SUITE INCONSISTENT 99/99/29/70 ×3; 0 differing stdout lines; 0-byte stderr; exit 1 ×3
node rebuild\engine\test\second-gate.mjs --candidate  (all three)                     → reference FINAL108 3072/0 ×3; candidate log 267 lines, 0 diffs ×3; stderr 179 B identical
node -e require('./rebuild/m4/spec/native-carriers-profile.cjs').verify()             → ERR_ASSERTION :: Unchanged parent pin: rebuild/engine/volume.cjs
node -e <read acceptance-native-carriers.json>                                        → sha 295762f0…; product 20 keys incl. volume.cjs c32298e7…; parent = acceptance-load-writes.json
git revert --no-commit --no-edit 07fba76 ; git diff f70dd23 --stat ; revert --abort   → applies cleanly; reverted tree == f70dd23 EXACTLY; restored to 07fba76 clean
<reviewer bites.cjs × {base, f70dd23, 07fba76, 5a4205c}>                              → §6 R2-A … R2-D
Select-String 'liftTrend' | 'asOf'  rebuild\engine\*.cjs   (every hit read)           → 6 in-engine call sites + 3 forwarding delegates; NONE passes opts.asOf
git status --porcelain   (after every in-place swap and at the end)                   → empty, every time
```

Protected and private surfaces are reported **verdict-only** above. No cell value, no hash, no prose from the P6 cells, the set-one laboratory card, `rebuild/conform/private/**` or `ledger/` appears anywhere in this file. `ledger/` and `rebuild/conform/private` were never opened. No other worktree was touched; the frozen-bundle worktree this reviewer created under `%TEMP%` was removed.
