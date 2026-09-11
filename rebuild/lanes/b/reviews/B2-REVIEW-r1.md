# EARNED — LANE B · PACKAGE B2 — INDEPENDENT REVIEW r1

| field | value |
|---|---|
| branch | `rebuild/lane-b-b2` |
| sha under review | `c39d1cb` |
| base | `origin/rebuild/t2-client-core` @ `acd3b67` (verified: `git merge-base c39d1cb origin/rebuild/t2-client-core` = `acd3b6755404ab75e91087d179e48ed07467549a`; the candidate is exactly ONE commit on top) |
| contract | `rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.1.md` (573 lines, read in full) · builder's report `rebuild/lanes/b/BUILD-REPORT-B2.md` (910 lines, read in full) |
| governing | `rebuild/lanes/LANES.md` + Amendments · `rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md` §3 · `rebuild/DECISIONS.md` 60, 82, 88–100 · `rebuild/m2/BRIEF-SET-ONE-ERA.md` |
| reviewer | lane B independent reviewer (Opus), blind, told to disagree |
| date | 2026-09-11 |
| worktree | `work/lane-b/review-b2`, detached at `c39d1cb`, created by this reviewer; no other worktree touched |
| environment | node `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` v24.19.0 by full path · `npm ci --include=dev` via the machine npm (there is no `npm.cmd` beside the codex node — the builder's D-8 is confirmed) · `package-lock.json` unmodified · `TZ=America/New_York` · frozen bundle built into the gitignored `rebuild/conform/engines/engine-main.cjs` from a REVIEWER-PRIVATE detached worktree so the two concurrent reviewers cannot race |

## VERDICT — **ACCEPT WITH CHANGES**

Every load-bearing claim in the build report reproduced under independent execution. The diff is exactly the three permitted engine files plus the report and one new carrier program; no frozen law, golden, tool, witness file or accepted artifact was edited, and no witness was rewritten in place. The changes below are documentation, escalation and one governance line — **no code change is required to the fourteen hunks.**

**Exact changes required before this branch is offered for merge:**

1. **Correct the brief's D7 "Delta cells" sentence, in the artifact and in the report.** It states the narrowed `liftTrend` cut reaches "every `liftTrend` consumer that passes one (`progressionTrend`, `liftCall`, `volumeConversion`, `regime`)". Executed: **no call site inside `rebuild/engine/` ever passes `opts.asOf` to `liftTrend`.** The only in-engine calls are `liftTrend(s, id)` (`progression.cjs:813` inside `progressionTrend`, `volume.cjs:243` inside `volumeConversion`, `writers.cjs:1399`, `sleep.cjs:1748` ×2), `liftTrend(s, exId, { window: 999 })` (`volume.cjs:282`) and `liftTrend(s, t.id, { cleanOnly, minN })` (`progression.cjs:845`). So the `liftTrend` half of D7, as shipped, is **inert on every engine-internal path**; inside the engine D7 is a `progressAnchor`-only repair. The recommendation (Q8a) may still be right, but the PM must rule Q8 knowing that, not knowing the brief's version.
2. **Escalate Q2 with the executed consequence, not the asserted one** (§5 B-1 below): D18 does not merely *widen* `volume.cjs:159`'s unbounded-substring owner test — executed, it converts a **miss into a misattribution**. Base: a current-week VOLUME receipt for `Press incline` sitting past feed row 80 produces **no** structural move. Candidate: it produces a move attributed to **`Press`**. Q2 must be answered before merge; "leave it" is now a decision to ship a wrong structural move, not a decision to ship a missing one.
3. **Enumerate three delta sites the brief does not list** (all executed, none observed to move on any gate): `migrate.cjs:1629`, the third `_bornValid` consumer (the shared "ONE predicate"); `targetsFor` for an impossible record carrying `first` (`{sets:-1, first:[8]}`: `[8]` → `[]`); and D3's C3 boundary dropping a lift's OWN receipt when the lift's name contains `" (now "`.
4. **Write the `rebuild/lanes/REQUESTS.md` line for `rebuild/m4/spec/b2-inherited-carriers.cjs`.** `LANES.md` gives `rebuild/m4/spec` to the PM exclusively and its Ownership rule says anything outside a lane's files "= write a request into `rebuild/lanes/REQUESTS.md`". The builder flagged the placement in the report (O-1) but filed no request. Report text is not the request the rule names.
5. **Fix the brief's §6 product sentence** — the builder's discrepancy D-1 is CONFIRMED by this reviewer (§6 below). B2 supersedes three parent pins; it introduces none.

Nothing here is a frozen-law objection, a golden regeneration or a protected-surface change. The package acceptance bar (artifact, `--full`, private census, receipt, authorized rerun) is **not** met and is **not** claimed by the builder; this review does not grant it.

---

## 1. Diff classification — clean

```
git diff acd3b67...c39d1cb --stat
 rebuild/engine/plan.cjs                   |   4 +-
 rebuild/engine/progression.cjs            |  20 +-
 rebuild/engine/volume.cjs                 |  17 +-
 rebuild/lanes/b/BUILD-REPORT-B2.md        | 910 ++++++++++++++++++
 rebuild/m4/spec/b2-inherited-carriers.cjs | 243 ++++++
 5 files changed, 1181 insertions(+), 13 deletions(-)
```

`--name-status`: `M plan.cjs · M progression.cjs · M volume.cjs · A BUILD-REPORT-B2.md · A b2-inherited-carriers.cjs`. Every hunk read.

- **Frozen laws** (`rebuild/conform/v4/laws-*.cjs`, `helpers.cjs`, `run-defect-laws.cjs`): untouched. ✔
- **`tools/`** (incl. `engine-test.jsx`, `snapshots/`, `second-gate` inputs): untouched. ✔
- **Goldens, `rebuild/conform/oracle`, `rebuild/conform/v4/postfix/*`, the seeded soak**: untouched. ✔
- **Witness files** `rebuild/engine/test/defect-witnesses*.cjs`: untouched — the carrier substitutes **in memory** only (read below). ✔
- **B3's files** (`earn.cjs`, `writers.cjs`, `merge.cjs`, `migrate.cjs`): untouched. ✔ B1's (`dates.cjs`, `sleep.cjs`, `policy.cjs`, `today.cjs`): untouched. ✔ The carriers' `performed.cjs` / `entered-load.cjs`: untouched. ✔
- Engine files changed = exactly `plan.cjs`, `progression.cjs`, `volume.cjs`. ✔
- **Pre-image sha256 at `acd3b67`, verified byte-exact from git**: `plan.cjs 1b26c87f…` (19,784 B) · `progression.cjs 7031838d…` (53,582 B) · `volume.cjs c32298e7…` (23,465 B) — identical to the brief §0. **Post-image**: `plan.cjs 4c6f9817…` (19,853 B) · `progression.cjs ad989ed4…` (54,180 B) · `volume.cjs 73550ef8…` (24,053 B) — identical to the report §0.1.
- Every one of the fourteen hunks is the brief's v1.1 text, in the declarations the brief names, and nothing else in those files moved (hunk-by-hunk read of `git diff`).
- The D30 hunk is `BRIEF-SET-ONE-ERA.md:17` literally: `forksOf` once after the untouched IDLE guard, the query day read **only** when forks are nonempty (`null` otherwise), the `sameEra` skip **before** the session record is read, two late-bound delegates in the module's existing `E.` block and no third binding. ✔
- The D32 hunk is `DECISIONS:60`'s D32 rule literally — `g9.every(sameEra)` added, `TREND_MIN_SESSIONS`, `REVIEW_OUTCOME_D`, `_blockSlope`, the segment construction, `segs.pop()` and both `why` strings untouched. ✔

## 2. The 45-law runner — reproduced exactly, both sides

Frozen bundle built by this reviewer from `fe516c1f2b1d7d756a24e46d000d23ac1c747aa8` (esbuild 0.28.1), sha256 `ed1fa321a8b3271e347a0dd3026b53383bf7a0628408cb59be38c7754cf0340c`, 814,747 bytes. It differs from the builder's `a575ac58…`/814,639 B **as expected** — `build-engines.mjs`'s own header says the bundle sha depends on the esbuild version and entry path, and our private worktree paths differ; the CENSUS is the golden, not the bundle bytes.

```
TZ=America/New_York  ENGINE_MAIN=<that bundle>  node rebuild\conform\v4\run-defect-laws.cjs
```

| side | line |
|---|---|
| BASE (`git checkout acd3b67 --` the three files, pre-image sha verified) | `TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` (exit 1) |
| CANDIDATE (`c39d1cb` bytes) | `TOTAL 45 laws · 45 RED-frozen · 25 RED-candidate · 88 GREEN repair controls · 83/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` (exit 1) |

Line-by-line diff of the two 46-line outputs: **MOVED LINES = 15** — the fourteen laws and the TOTAL line, nothing else. The fourteen are D9, D2, D1, D5, D6, D7, D3, D4, D29, D18, D28, D30, D31, D32, each `RED-frozen / RED-candidate` → `RED-frozen / GREEN-candidate`. No other law changed status. The six accepted repairs (D12, D33, D34, D35, D41, D43) are GREEN-candidate on **both** sides, so `39 → 25` is the fourteen exactly. `AUDIT RED-FIRST FAIL` on both sides is the runner's own all-45-must-be-RED rule and is not B2's. `D45` reads `AUDIT-FAIL` identically on both sides (pre-existing).

The two predicted side effects reproduce to the number: GREEN repair controls `89 → 88` (D29's non-idempotent control) and detected mutant executions `97/104 → 83/104` (the fourteen laws' export-wrapper mutants going inert on a repaired source). Both are the brief's Q6(a)/(b) conditions, confirmed.

After both runs the three files were restored and verified back to `4c6f9817…` / `ad989ed4…` / `73550ef8…` with `git status --porcelain` empty.

## 3. Named source mutants — the four "equivalent" claims verified, not accepted on trust

The builder reports `57 named · 53 caught · 4 equivalent/inert · 0 uncaught`. This reviewer did not re-run the builder's harness (that would re-check the builder's own work with the builder's own tool). Instead the **four claimed-equivalent mutants were rebuilt independently** into disposable engine copies (`exactReplace`-style one-site assertion in the reviewer's own script) and hunted with (a) an argument from the source, (b) 4,000 random legacy states × 2 matrix days, (c) a **targeted** 3,000-state generator built to reach the replication branch, and (d) four hand-built separators. A fifth mutant, `noDate` (drop the *date* conjunct instead of the `k` conjunct), was added as a positive control.

| mutant | claim | reviewer result |
|---|---|---|
| D31 `post-change-check-on-the-dates-only` (drop `t.k !== lastK`) | EQUIVALENT on legacy | **CONFIRMED.** Proof: every logged day `>= changedAt` has `k === lastK` by `volumeConversion`'s own cut; every point in `t.pts` shares `t.k`; so `t.k !== lastK` ⟹ no `t.pts` point is `>= changedAt` ⟹ the date conjunct already fires. `A ⟹ B` makes `A || B` ≡ `B`. 0 separations in 8,000 + 3,000 states. |
| D31 `post-change-check-is-inclusive-of-the-prior-day` | STRUCTURALLY UNREACHABLE on legacy | **CONFIRMED.** A kill needs a `t.pts` point dated exactly `changedAt − 1`; that day would be a logged day with `k === lastK` immediately before `changedAt`, which by construction of the cut cannot exist. 0 separations, including a hand-built state that places the pre-change point as close as the shape allows (`2026-07-07`, `changedAt 2026-07-09`, the intervening `2026-07-08` being the k-change session). |
| D32 `replication-era-checked-on-the-block-start-only` | UNREACHABLE with D31 in force | **CONFIRMED.** Separation needs a prior block whose start is in the query era and whose end is not — which, `eraIdx` being monotone in the date, needs a fork dated **after** today inside that block; the final block then lies past the same fork, `liftTrend`'s era filter drops it, and D31 returns `READING` before the replication branch runs. 0 separations across 3,000 targeted states that reached `REPLICATED` **1,461×** and `OUTCOME-COMPATIBLE` **792×**. |
| D32 `replication-threshold-relaxed-with-the-era-cut` | EQUIVALENT | **CONFIRMED.** `_blockSlope` (`volume.cjs:174`) itself returns `null` for `n < TREND_MIN_SESSIONS`, and its `n` is `≤ g9.length`; relaxing `g9.length >= TREND_MIN_SESSIONS` to `>= 1` admits only blocks whose slope is already `null`. 0 separations over the same targeted 3,000. |
| **control** `noDate` (drop the date conjunct) | — | **SEPARATED** on two hand-built legacy states (`3,[2 HARD],3,3,3,3` → candidate `READING`, mutant `LIVE/TOLERATED`; and a second at `OUTCOME-COMPATIBLE`). This proves the probe set is capable of a kill and that the **date** conjunct is the load-bearing half of D31's guard. |

So "53 caught / 4 equivalent / 0 uncaught" is **honest**: the four are genuinely equivalent or unreachable on legacy states, not merely missed. The builder's own disclosure — that #1 and #2 separate only on a native (`workoutFacts`) row whose `performedTrendObservation().k` differs from `reps.length` — stands as a residual (§7 R-3).

## 4. Protected surfaces — verdict only

- **`tools/engine-test.jsx:70`** (`ok(pt.nLifts === 3 && pt.state === "unknown", …)` with `pt = __test.progressionTrend(SNAP)`, `SNAP = tools/snapshots/2026-08-06-ledger.json`, sha256 re-verified by this reviewer as `62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f`, exactly the brief's pin) evaluated at the gate's own hard-pinned anchor `MEASURED_TEST_NOW="2026-07-29"` (`second-gate.mjs:64`):

| engine | nLifts | state | `:70` |
|---|---|---|---|
| pre-image bytes | 3 | unknown | **holds** |
| **B2 candidate** | **3** | **unknown** | **holds — the cell does NOT move** |
| v1's unconditional `liftTrend` cut (rebuilt by this reviewer) | **0** | unknown | **fails — the cell flips** |

  `nExcludedNonNumeric = 2`, `excludedIds = ["curl","hanging"]` on all three; the neighbouring `:71` and `:74` cells hold on all three. **Q8's finding is real and the narrowing is the thing that keeps `:70` still.**
- **Inside the real gate**: `second-gate.mjs --candidate` was run on both sides. `.tmp/m2-second-gate/candidate-engine-test.stdout.log` is **267 lines on both, with zero differences** (`Compare-Object`). B2 adds **no** failure inside the 261 observable assertions. Both sides abort at the same pre-existing D12 cell, `FAILED ASSERTION tools/engine-test.jsx:106`, the site the accepted custody owns; the reference (frozen) side completes `FINAL108: 3072 passed, 0 failed` on both. The six-line stdout and the 181-byte stderr are identical base vs candidate.
- **P6 second-gate cells `tools/engine-test.jsx:8790–8793`** — reproduced directly at the gate's `2026-07-29` anchor on both engine copies: **UNCHANGED** (both cells hold on the pre-image bytes and on B2, and also under the v1 cut). No cell values, no hashes, no prose reported.
- **The seeded set-one laboratory card** (`labAnalytics2`, whose `setOneRead` call is the only engine consumer of `setOneRead`): compared by digest between the two engine copies at both matrix days — **UNCHANGED**. Digests withheld.
- **`rebuild/conform/private/live.json` and the private `live.main` golden**: never opened, never named with values, never hashed, never quoted. `ledger/` never opened. `rebuild/conform/private` never opened.
- **The frozen app** `fe516c1:src/app.jsx` was read only through the bundle build and `helpers.cjs`'s own blob pin (`f98671d8…`), never edited.

## 5. Public census, gates and runners — base vs candidate

**5.1 Direct-call census (reviewer's own, independent of the builder's).** Two disposable engine copies (pre-image bytes extracted from git and sha-verified; candidate bytes), the seeded state from `migrate(null)` **and** `SEED`, at both matrix days, over `programmeVolume`, `muscleVolume`, `volumeImbalance`, `structuralMovesThisWeek`, `nowModel`, `canonicalizePlan`, `dayType` at eight dates, and per lift over all 16 seeded lifts: `targetsFor`, `progressAnchor`, `loadRungs`, `maxedOut`, `nextLoad`, `prevLoad`, `deloadLoad`, `snapLoad`, `repsLostOnJump`, `deriveSighting`, `_volDeltas`, `setOneRead`, `volumeConversion`, `liftTrend`, `liftTrend({asOf})`, `liftCall`, `exActive`.

```
===== 2026-09-03  base -> cand =====      ===== 2026-09-07  base -> cand =====
/perLift/fly/deloadLoad: 5 -> null        /perLift/fly/deloadLoad: 5 -> null
/perLift/hipthrust/deloadLoad: 5 -> null  /perLift/hipthrust/deloadLoad: 5 -> null
/seedReads/.../fly/deloadLoad: 5 -> null  /seedReads/.../fly/deloadLoad: 5 -> null
/seedReads/.../hipthrust: 5 -> null       /seedReads/.../hipthrust: 5 -> null
```

**Exactly one cell — `deloadLoad` for `fly` and `hipthrust`, `5 → null` (D6) — at both matrix days. Nothing else moved.** The builder's finding reproduces. `programmeVolume` and `volumeImbalance` are identical at both days (the seed's own week and the authored 2026-07-27 week read the same U/L counts), so D28's seeded golden risk is zero; `muscleVolume` is `[]` at both days, so D29 does not move the seeded census.

**Caveat the PM should read (§7 R-1): this census is a thin oracle.** The seeded state carries **zero** sessions, so `setOneRead`, `volumeConversion`, `liftTrend` and `progressAnchor` are IDLE/null for every lift on it. Run cand-vs-**v1cut**, the census reports **0 cells changed at both days** — i.e. the census cannot see the very question (Q8 / `:70`) that the second gate settles.

**5.2 `rebuild/conform/run.cjs` (the public conformance suite), base vs candidate.** Same command, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`:

```
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families   (exit 1)
```

on **both** sides, and the **entire 81-line stdout is identical** (`Compare-Object` → 0 differences; stderr 0 bytes on both). `INFO 9 engine-track rig185: W1 PASS, W2 PASS` on both; the only `BAD` line on both is `BAD 7 privacy: … 0 private lines`, which is the absent private fixture on a public clone. Not a B2 regression.

**5.3 `load-write-package.cjs --ci`, quoted on both sides — and the correction the task's expectation needs.**

```
BASE:      LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   (exit 1)
CANDIDATE: LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   (exit 1)
```

**Identical.** The builder's discrepancy **D-5 is CONFIRMED**: on this tip `load-write-package.cjs` is superseded (`DECISIONS:97`), so its refusal is **not** a pinned-engine-bytes signal from B2. The runner that does carry B2's product pins is the accepted parent's:

```
node rebuild/m4/spec/native-carriers-package.cjs --ci
  BASE:      POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0…
             NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   (exit 1)
  CANDIDATE: NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   (exit 1)
             — and it never reaches the AUTHORIZED line
```

The base side prints the AUTHORIZED line and the candidate side does not: the closed profile refuses on B2's changed bytes **before** authorization. That asymmetry, reproduced here, is the real pinned-engine-bytes refusal.

**5.4 Frozen defect-witness gates — measured failure-tolerantly by this reviewer** (original bytes read, never written; `witness` made catching in memory; `../index.cjs` redirected to the disposable engine copy):

| gate | pre-image bytes | B2 candidate |
|---|---|---|
| `witnesses-1` `defect-witnesses` | **10/10** | **2/10** — D1 D2 D3 D4 D5 D6 D7 D9 flip; **D8 and D10 still reproduce** |
| `witnesses-2` `defect-witnesses-2` | **10/11** (D12 already RED) | **9/11** — exactly one more flips: **D18** |
| `witnesses-3` | 5/5 | **5/5 unchanged** |
| `witnesses-4` | 5/5 | **0/5** — D28 D29 D30 D31 D32 all flip |

Direct `node rebuild/engine/test/defect-witnesses[-2..-7].cjs` exit codes: base `0 · 1 · 0 · 0 · 1 · 0 · 1`, candidate `1 · 1 · 0 · 1 · 1 · 0 · 1`. `witnesses-5` and `witnesses-7` fail **identically** on both sides (byte-identical stderr) — pre-existing at the tip, not a B2 delta. **14 assertion flips across three files (8 + 1 + 5), the builder's numbers exactly.**

**5.5 The carrier program `rebuild/m4/spec/b2-inherited-carriers.cjs`** (243 lines, read in full). It reads each original witness file, **asserts its sha256 against a hard pin**, and builds the successor with `legacy-carriers.exactReplace` (which refuses unless the `before` text occurs exactly once); `witnesses-2` first inherits the **accepted** D12 successor verbatim via `legacy-step-efficacy-carriers.prepareCarrier`, then adds one substitution. `witnesses-3`/`-6` are asserted to receive **zero** substitutions and are executed as authored (`-6` as its own child process). **No witness file is written.** ✔

```
CANDIDATE: B2 INHERITED CARRIERS: 5/5 PASS; 17 exact substitutions (…); PACKAGE receipt PENDING   (exit 0)
BASE:      B2 INHERITED CARRIERS FAIL at defect-witnesses: ERR_ASSERTION                          (exit 1)
```

**The carrier is not vacuous** — verified by this reviewer, not taken from the report.

## 6. The builder's discrepancy claim about the parent artifact — CONFIRMED

Read from `rebuild/m4/spec/acceptance-native-carriers.json` itself (live sha256 **`295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`**, matching `DECISIONS:96`):

- `product` has **20 keys**, and `rebuild/engine/volume.cjs` **is one of them**, pinned at `c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4`. The full set is constants, dates, earn, energy, entered-load, index, merge, migrate, oracle-shim, performed, plan, policy, progression, seed, sleep, today, **volume**, writers and the two `rebuild/m3/w7-preview` files.
- `parent` = `{"artifact":"rebuild/m4/spec/acceptance-load-writes.json","sha256":"5073977b…","packageId":"M2-LOAD-WRITES", …}` — the chain is LOAD-WRITES → NATIVE-CARRIERS, as the brief's §6 says.
- Executed corroboration: `require('./rebuild/m4/spec/native-carriers-profile.cjs').verify()` on the candidate throws `ERR_ASSERTION :: Unchanged parent pin: rebuild/engine/volume.cjs`.

**So the brief §6 is wrong** where it says "`volume.cjs` is not in it, so B2 introduces `rebuild/engine/volume.cjs` … as a new pinned product file". **B2's artifact must SUPERSEDE three parent product pins (`plan.cjs`, `progression.cjs`, `volume.cjs`) and carry the other seventeen forward byte-identically. It introduces nothing.** The builder found this and followed the code; the correction must land in the artifact before it is written.

Related, and already answered where the brief still treats it as open: `rebuild/lanes/REQUESTS.md`, 2026-09-11 01:10 ET, PM → B, names the parent explicitly — "the parent artifact for the next engine package is `rebuild/m4/spec/acceptance-native-carriers.json 295762f0…` (receipt line 96)". Q1's *identity* is settled; what remains open is only **which B package is first**, which decides whether B2's parent is that artifact or B1's.

## 7. Reviewer's own bites — what I tried to break, and what caught it

All bites were run on **both** engine copies; the repo was never modified.

**B-1 (the one that bit). D18 × `volume.cjs:159` — a miss becomes a misattribution.** Two lifts, `Press` (`id: press`) and `Press incline` (`id: inc`), 95 ordinary feed notes, then one current-week receipt `VOLUME +1 — CHEST via Press incline (now 3 sets)` at row 95:

```
base      structuralMovesThisWeek().sets  =  []          (the D18 defect: past the 80-row cap, invisible)
candidate structuralMovesThisWeek().sets  =  ["press"]   (found — and charged to the WRONG lift)
```

The same receipt at row 0 gives `["press"]` on **both**, so the owner bug is pre-existing at that site; what B2 changes is that D18 now **reaches** it. The repaired reader next door is correct on the identical prose: `_volDeltas(Press)` = `[]` and `_volDeltas(Press incline)` = `[["2026-09-01",1]]` on the candidate, against `[["2026-09-01",1]]` for **both** lifts on the base. The brief's Q2 objection is therefore not theoretical: leaving `volume.cjs:159` unconverted ships a *wrong* structural move where the base shipped a missing one, and the Auto-Pilot tighten veto, the `volumePush` week budget and the offer-expiry branch all read that move. **Caught by: nothing in B2 — no law, no witness, no census cell covers it.** That is the escalation in Change 2.

**B-2. D3's whole-name boundary vs a lift whose NAME contains `" (now "`.** Lift `Press (now heavy)`, its own receipt `VOLUME +1 — CHEST via Press (now heavy) (now 3 sets)`:

```
base      _volDeltas = [["2026-09-01",1]]   (own receipt credited)
candidate _volDeltas = []                   (own receipt DROPPED)
```

C3 splits at the **first** `" (now "`, so `own9` = `"Press"` ≠ `"Press (now heavy)"`. Per-spec, and narrow — but it is a behaviour regression that D3's "Must NOT change" list does not name. Either record it as a named non-obligation or make C3 split at the **last** `" (now "`; either way it must be written down (Change 3).

**B-3. D32 technique-era boundary sweep** (the accepted law's fixture shape, prior block Jan–Mar `k=2`, current block Jul–Sep `k=3`, query day 2026-09-03), fork walked across the boundary:

| fork | `eraIdx(priorStart)` / `eraIdx(today)` | base tier | candidate tier |
|---|---|---|---|
| none | 0 / 0 | REPLICATED | REPLICATED |
| 2025-01-01 (before everything) | 1 / 1 | REPLICATED | REPLICATED |
| **2026-01-01 = the prior block's FIRST date** | 1 / 1 | REPLICATED | **REPLICATED** (the inclusive `f.from <= d` boundary, honoured) |
| **2026-01-02 = one day later** | 0 / 1 | REPLICATED | **OUTCOME-COMPATIBLE** |
| 2026-04-01 (the law's own seam) | 0 / 1 | REPLICATED | **OUTCOME-COMPATIBLE** |
| 2026-09-20 (future fork) | 0 / 0 | REPLICATED | REPLICATED |

A **foreign** lift's forks cannot change the tier (`REPLICATED` on both). Both `why` strings are the pre-existing prose (`the benefit recurred across comparable stable blocks…` / `the long window is rising … has not yet recurred in a comparable block`) — no new string. **Caught by: law `V4-volume-replication-same-era`, witnesses-4 D32, and probes `d32-*`.** No defect found.

**B-4. D5 duplicate-rung ladders, with coercion and the D5×D6 join.** `loadRungs([100,100])`, `([100,"100"])`, `([100,100.0,100])` → `null` on the candidate, `[100]` on the base; `[100,105]` and `[105,100]` → `[100,105]` on both; `parseRungs("100,100")` and `("100.0,100")` → `null` vs `[100]`; `parseRungs("100,105,100")` → `[100,105]` on both. Downstream on a duplicate-only ladder at `w:100`: `maxedOut` false on both, `nextLoad` **`105` (candidate) vs `null` (base)**, `deloadLoad` **`95` vs `100`**, `snapLoad` `100` on both. **D5×D6**: duplicate-only ladder + `w:null` → `null` on the candidate, **`0`** on the base. No defect found.

**B-5. D7 future-dated sessions, with and without `opts.asOf`** (sessions 08-20/08-27/09-03 plus future 09-10/09-13, clock 2026-09-03):

```
                                   base                    candidate
progressAnchor                     [12,11] (future!)       [10,9]
targetsFor                         [12,11]                 [10,9]
liftTrend  (no asOf)               n=5 → 2026-09-13        n=5 → 2026-09-13   ← identical: the narrowing, asserted
liftTrend  {asOf:'2026-09-03'}     n=5 → 2026-09-13        null
liftTrend  {asOf:'2026-09-13'}     n=5                     n=5                ← a session ON the query day is evidence
liftTrend  {asOf:'2026-09-20'}     n=5                     n=5
```

Exactly the contract the brief states. **But see Change 1**: no engine call site supplies `asOf`, so the third row is the only one any in-engine consumer ever takes.

**B-6. D7 × D30 — the widening the accepted brief forbids.** Four in-era sessions, one of them **future-dated** (2026-09-13), fork 2026-08-01: `setOneRead` = `LIVE n=4 (2026-08-10 → 2026-09-13)` on **both** engines. D7's cut was not extended into `setOneRead`. ✔ The cross-era case flips as designed: three pre-fork sessions plus one post-fork session read `LIVE n=4` on the base and `COUNTING n=1 need=4` on the candidate; a session dated **exactly on `fork.from`** counts in the new era (`n=2`). ✔

**B-7. D9 × D28 with an unsorted multi-row split** (rows `[{from:'2026-09-01'},{from:'2026-06-01'}]`, i.e. the greatest `from` is **not** last in the array): `dayType('2026-09-03')` = `U` (base, last-array-row) → `REST` (candidate, latest effective date); `dayType('2026-08-31')` = `L` on both (correctly falls back to the earlier row, whose `from <= iso`); `programmeVolume` chest/back = `[["chest",9],["back",9]]` (base, the authored July week) → `[["back",6]]` (candidate, the query week under the effective split), and `structuralMovesThisWeek.monday` agrees with `programmeVolume`'s Monday. Ties on an identical `from` keep the existing array-order winner on both (`L`); a **future**-dated split row is still ignored on both (`U`). No defect found.

**B-8. D2's predicate directly** (`_bornValid` is exported and reachable): base returns `true` for **every** malformed record; candidate returns `false` for `sets:-1`, `sets:0`, `sets:3.5`, `hi:NaN`, `hi:0` and `true` for `{sets:3,hi:10}` and `{sets:3.0,hi:10.5}`. The `RangeError: Invalid array length` from `targetsFor` on a **still-unquarantined** impossible record with no `first` survives on both sides, as the brief requires.

**B-9. D6's guard shape against its siblings** — `[nextLoad, prevLoad, deloadLoad]` for the same `ex.w`:

```
             base                candidate
w: null      [null,null,5]       [null,null,null]
w: ""        [null,null,5]       [null,null,null]
w: "   "     [5,5,5]             [5,5,5]
w: false     [5,5,5]             [5,5,5]
w: 0         [5,5,5]             [5,5,5]      ← must not change, and does not
w: "100"     [105,95,95]         [105,95,95]
```

The candidate's `deloadLoad` is now **exactly** as consistent as `nextLoad`/`prevLoad` — which is the brief's stated rule ("the identical pre-coercion absence guard"). The residual `"   "` / `false` / `[]` cases are pre-existing sibling behaviour, not a B2 gap.

**B-10. Comparator-fails-closed bite.** The reviewer's census comparator was exercised against the builder's claim shape by diffing candidate-vs-`v1cut` and base-vs-candidate; it reports per-path cells and would surface an added field. (The builder's own unlisted-field bite is separately recorded in their §5.1; not re-run here.)

## 8. Residual risks

- **R-1 — the public census is a thin oracle.** The seeded state has zero sessions; the census cannot distinguish the candidate from the v1 cut (0 cells) even though they differ at the protected `:70`. "One cell moved" is true and is *not* strong evidence of safety on the era/trend readers. The second gate is the real surface.
- **R-2 — 2,811 of 3,072 second-gate assertions are unobserved** without the accepted D12 custody. This is the single largest unknown in the package. Any movement there is a §5(a) RED stop for a reviewed successor cell, never a regenerated golden.
- **R-3 — mutant adequacy is conditional on "legacy".** D31's `t.k` conjunct and the `prior-day` mutant separate only on a native (`workoutFacts`) row whose `performedTrendObservation().k` differs from `reps.length`. Note also that `volumeConversion` builds `seq` from `s.sessionLog` while `liftTrend` reads `performedHistoryRows` on a native state — a pre-existing mixed-source asymmetry that B2 neither creates nor repairs, and the place where the redundant conjunct could earn its keep.
- **R-4 — D28 makes `programmeVolume` clock-dependent** where it was clock-free. Every consumer that compares a stored `programmeVolume` across days now sees legitimate movement. Track A renders it (report O-8).
- **R-5 — D7 is `progressAnchor`-only in practice** (Change 1). Callers who *do* want an earlier view inside the engine go through `energy.cjs:_stateAsOf` state truncation, not `opts.asOf`.
- **R-6 — private LIVE census for D30** (the one LIVE-TRIGGERED defect in B2) is not run and remains the PM's own `--full`. Verdict-only when it is.
- **R-7 — the package bar is not met**: no `acceptance-b2-targets-identity-era.json`, no `b2-package.cjs`, no 19-gate identity run, no `--full`, no receipt, no authorized rerun. The builder states this plainly; this review agrees and does not grant it.

## 9. Open items for the PM

- **P-1 (blocking merge). Q2 — `volume.cjs:159`.** Answer it with §7 B-1 in hand: as shipped, D18 turns an invisible receipt into a misattributed structural move. Recommend converting that one line to §2's C2→C3 convention inside B2.
- **P-2 (blocking the artifact). Which B package is first.** The parent *identity* is already ruled (`REQUESTS.md` 01:10 ET: `acceptance-native-carriers.json 295762f0…`); the order B1-vs-B2 still decides whether that artifact is B2's parent or B1's. Two packages cannot claim one parent.
- **P-3. Q8.** Ruling (a) or (b), now knowing that the `liftTrend` guard is inert on every in-engine call site and that `:70` is what kills v1's cut.
- **P-4. `rebuild/m4/spec` placement** for `b2-inherited-carriers.cjs` — confirm the PM's folder takes lane-B package files, or name a lane-B location (e.g. `rebuild/conform/v4/postfix/`, where the accepted D12 successor lives). A `REQUESTS.md` line is owed either way.
- **P-5. Q4 — `witnesses-1` serialization with B1.** The report's union analysis is sound on the measured evidence: B2 owns nine substitution sites (D1, D2×2, D3, D4, D5, D6, D7, D9), B1 owns D8 and D10, and this reviewer measured D8/D10 still reproducing on the B2 candidate. `exactReplace`'s one-site rule makes a collision refuse rather than double-apply.
- **P-6. Q5, Q6, Q9** carry unchanged; Q6(a) and Q6(b) are now confirmed to the exact numbers (`97/104 → 83/104`, `89 → 88`).
- **P-7. Brief corrections** before the artifact is written: §6's `volume.cjs` sentence (§6 above) and D7's delta-cells sentence (Change 1).

## 10. Commands executed by this reviewer, with outcomes

```
git -C <design-pin> fetch origin                                                  → ok
git merge-base c39d1cb origin/rebuild/t2-client-core                              → acd3b675…  (one commit on top)
git worktree add work/lane-b/review-b2 origin/rebuild/lane-b-b2                   → detached at c39d1cb
git diff acd3b67...c39d1cb --stat | --name-status | (every hunk)                  → 5 files, classified in §1
npm ci --include=dev                                                              → exit 0; package-lock.json unmodified
node <reviewer build-frozen.mjs> → rebuild/conform/engines/engine-main.cjs         → fe516c1f…, sha256 ed1fa321…, 814747 B (gitignored)
node rebuild\conform\v4\run-defect-laws.cjs        (BASE)                          → 45 RED-frozen · 39 RED-candidate · 89 controls · 97/104 · exit 1
node rebuild\conform\v4\run-defect-laws.cjs        (CANDIDATE)                     → 45 RED-frozen · 25 RED-candidate · 88 controls · 83/104 · exit 1
<reviewer line-diff of the two outputs>                                           → MOVED LINES = 15 (the fourteen + TOTAL)
cd rebuild\conform && node run.cjs                 (BASE, CANDIDATE)               → SUITE INCONSISTENT … identical, 0 stdout differences, 0-byte stderr both
node rebuild\m4\spec\load-write-package.cjs --ci    (BASE, CANDIDATE)               → LOAD PACKAGE FAIL … exit 1 on BOTH (superseded; not a B2 signal)
node rebuild\m4\spec\native-carriers-package.cjs --ci (BASE, CANDIDATE)             → base prints AUTHORIZED then FAIL; candidate FAILs before it (exit 1 both)
node -e require('./rebuild/m4/spec/native-carriers-profile.cjs').verify()          → ERR_ASSERTION :: Unchanged parent pin: rebuild/engine/volume.cjs
node rebuild\m4\spec\b2-inherited-carriers.cjs      (CANDIDATE)                     → 5/5 PASS; 17 exact substitutions; exit 0
node rebuild\m4\spec\b2-inherited-carriers.cjs      (BASE)                          → FAIL at defect-witnesses: ERR_ASSERTION; exit 1
node rebuild\engine\test\defect-witnesses[-2..-7].cjs (BASE / CANDIDATE)            → exits 0·1·0·0·1·0·1 / 1·1·0·1·1·0·1
<reviewer failure-tolerant witness measure, originals never written>              → 10/10→2/10 · 10/11→9/11 · 5/5→5/5 · 5/5→0/5
node rebuild\engine\test\second-gate.mjs --candidate (BASE, CANDIDATE)              → reference FINAL108 3072/0 both; candidate aborts at engine-test.jsx:106 both
Compare-Object .tmp/m2-second-gate/candidate-engine-test.stdout.log (BASE|CAND)   → 267 lines each, 0 differences
<reviewer census.cjs × {base, cand, v1cut} × {2026-09-03, 2026-09-07}> + diff     → base→cand: the D6 cell only; cand→v1cut: 0 cells
<reviewer probes.cjs × {base, cand, v1cut}>                                        → :70 3/3/0 · :71 :74 hold · P6 HOLDS ×3 · lab-card digests identical
<reviewer mkmutants.cjs → eng-{noK,noDate,priorday,startonly,relax}>               → one-site assertion passed on all five
<reviewer fuzz.cjs 4000 × 2 days>                                                  → 0 separations for all five
<reviewer fuzz2.cjs 3000 targeted (REPLICATED 1461, OUTCOME-COMPATIBLE 792)>        → 0 separations for all five
<reviewer handbuilt.cjs, 4 constructed legacy states>                              → noDate SEPARATED ×2; noK / priorday / startonly / relax 0
<reviewer bites.cjs, bites2.cjs × {base, cand}>                                    → §7 B-1 … B-9
```

Protected and private surfaces are reported **verdict-only** above: no cell value, no hash, no prose from the P6 cells, the set-one laboratory card, `rebuild/conform/private/**` or `ledger/` appears anywhere in this file. `ledger/` and `rebuild/conform/private` were never opened.
