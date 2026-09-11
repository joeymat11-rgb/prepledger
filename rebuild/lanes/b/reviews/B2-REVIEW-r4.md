# EARNED — LANE B · PACKAGE B2 — INDEPENDENT REVIEW r4

| field | value |
|---|---|
| branch | `rebuild/lane-b-b2` |
| sha under review | `6038a52` — `B2 Q2 — convention + former-name term + live-name tier at volume.cjs:159` |
| history reviewed | builder `c39d1cb` → r1 `5a4205c` → r1 fixer `f70dd23` → r2 `d8e4040` → r2 fixer `9edefe5` → **r3 review `c5a5d48`** → r3 fixer docs/cells `abe1791` → **Q2 LAST `6038a52`** (re-authored). The withdrawn `07fba76` and `2ada13f` are still in the object store and were used as controls, as were `843a2a5` (the pre-rebase r3 review commit) and `acd3b67` (base). |
| base | `origin/rebuild/t2-client-core` @ `acd3b67` (= `c39d1cb~1`) |
| reviewer | lane B independent reviewer **round 4** (Opus) — not the builder, not r1/r2/r3, not any fixer; blind, told to disagree |
| date | 2026-09-11 |
| read in full | `reviews/B2-REVIEW-r1.md` · `-r2.md` · `-r3.md` (429 ln) · `BUILD-REPORT-B2.md` (2,001 ln, all four POST-REVIEW sections) · `BRIEF-…-v1.2.md` (896 ln) · `-v1.3.md` (1,110 ln) · `-v1.4.md` (1,511 ln) · `b2-delta-cells.cjs` (453 ln) · `rebuild/DECISIONS.md` on `origin/rebuild/t2-client-core` (**108 lines**), lines **60, 82, 103, 108** read verbatim |
| worktree | `work/lane-b/review-b2`, detached at `6038a52`. `git status --porcelain` **empty at start, after every in-place product-file swap, after the revert test, and at the end** (this file is the only add). No other worktree touched; no worktree created. |
| environment | node `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` **v24.19.0** by full path · `TZ=America/New_York` · `MEASURED_TEST_NOW=2026-09-03` except where noted · `package-lock.json` unmodified · `node_modules` 38 entries · frozen bundle `rebuild/conform/engines/engine-main.cjs` sha256 `ed1fa321a8b3271e…`, **814,747 B** (r1's/r3's bundle, already present on this clone; sha re-verified before use). `engine-old.cjs` absent — R2-6, environment, not B2. |
| never opened | `ledger/`, `rebuild/conform/private/**`. Protected surfaces reported **verdict-only**. |

## VERDICT — **ACCEPT WITH CHANGES**

**The r3 engine regression R3-A is genuinely fixed, and it survives stress r3 did not apply.** Every number in
POST-REVIEW r3 reproduced under this reviewer's own harnesses, fixtures and five sha-pinned engine copies:
the engine bytes, the commit order, the fourteen laws, the 572-cell census, the protected cell, the carrier,
the witnesses, the conform suite, the second gate, the thirty cells with **two** independent vacuity controls,
and the revert. The C6 census reproduces **cell for cell**, including the two conclusions that matter to the
PM's §7 Q2 ruling: shipped = **3/8** disagreeing, and **reverting Q2 is strictly worse than base — 6/8 against
5/8**.

The changes required below are this reviewer's own and are **documentation, one cell arm, and one engine
COMMENT line**. No behaviour needs to change. They exist because the shipped hunk's in-line comment — the text
B3 reads at the site — states an absolute the engine does not satisfy, one collision shape over from the one
r3 caught, and because two of v1.4's statements about the record do not match the record.

**Exact changes required before this branch is offered for merge:**

1. **`volume.cjs:166`'s own comment states a FALSE absolute — and it is the same class r3's required change 1
   existed to stop, moved from the brief into the engine.** The comment ends *"…so the receipt's own muscle
   group is **never** charged to a different lift by `s.exercises` order."* Executed (§4, bite **R4-A**): with
   **no** live lift holding the receipt's name and **two** lifts carrying it as a former name in different
   muscle groups, the shipped engine returns `mgsTouched = ["chest"]` forward and **`["back"]`** reversed —
   the exact sentence r3 wrote about `2ada13f`, on the shipped hunk. Base, `f70dd23` and `07fba76` return
   `[]` there, so it is **not** a regression against base and it *is* inside the declared trade — but the
   comment does not say so. §2 C6 and §v1.4-E1 state the bound **correctly** (*"only among former-name matches
   does array order decide"*); the code comment does not. **Bound the comment to C6, e.g.** *"…so where a LIVE
   name matches, the receipt's muscle group is never charged to a different lift by `s.exercises` order; where
   only former names match, array order still decides — C6's excluded class (ii)."* And extend **`B2-Q2j`**
   with the no-live-holder arm, which no cell pins.
2. **A structured `exId` that names no lift silently destroys the move, at all three C1→C2→C3 readers, and
   nothing pins or states it.** Executed (§4, bite **R4-B**): `f.exId = "ghost"` on a receipt whose text names
   a real lift → `structuralMovesThisWeek.sets = []` and `_volDeltas = []` on `07fba76`, `2ada13f` and the
   shipped hunk, where **base returns `["press"]`**. The two readers agree, so C6 holds — they agree that
   nobody owns a receipt the athlete can read on his own feed. `progression.cjs:233` (D3) and `:628` (D4) are
   already terminal the same way at `f70dd23`, so this is **not new in Q2**, but Q2 makes it three readers and
   C2 never says what a non-resolving id means. Verified: **no writer in `rebuild/engine/` emits `exId` onto a
   feed row today** (`writers.cjs:2162`, `:2319` write `{d, at, t, how}`), so it is dormant until B3's writer
   half — which is exactly why it must be written down now. **Add one sentence to §2 C2** (a structured `exId`
   that resolves to no lift in `s.exercises` is **unattributable** — C5's third answer — the receipt gets no
   move and no credit, deliberately, and `merge.cjs` can carry such a row from another device), and one cell
   arm.
3. **v1.4 attributes to r3 an offer r3 never made.** §v1.4-E4 says *"r3 offered 'fix it, or document it as a
   bounded residual and flag it'"* and the R3-4 residual line says *"r3 offered 'fix it or bound it'"*.
   Neither phrase, nor any offer, is in `B2-REVIEW-r3.md`. r3's required change 4 is one sentence — *"Extend
   the cell to assert `mgsTouched` on every side"* — and r3's verdict says *"confined to `BRIEF-…-v1.3` and one
   cell. **No engine byte needs to change.**"*, repeated at r3 §5 (*"All documentation/cell; no engine byte"*).
   The **BUILD-REPORT is honest about this** (R3.0: *"That is the one place this pass goes beyond r3's
   letter"*); the brief is not, and the brief is the document the PM accepts. **Correct both sentences to the
   build report's wording.** This is not cosmetic: it is the difference between the engine fix being a
   reviewer-requested amendment (rides under `DECISIONS:108` (c)) and being the fixer's own judgment (does
   not) — see §5.
4. **The acceptance-class table is computed against a superseded PM position: v1.4 never cites
   `DECISIONS:108`.** §v1.4-E2's judgment reads *"`DECISIONS:103` item (3) accepts 'BRIEF-B2 v1.2' by name"* and
   marks rows 9–13 "**NO — needs a line**". But `:108` (c), dated the same day and **after** r3's review, rules
   *"BRIEF-B2 v1.3 ACCEPTED by name = v1.2 + the r2/r3 reviewer-requested amendments only; anything beyond
   them needs a new line."* Rows 9–12 **are** the r2-requested amendments and are therefore **already
   accepted**. **Re-state §v1.4-E2 against `:108` (c)** and narrow the ask: what still needs a line is row 13's
   live-name tie-break clause (in §2 C6 *and* in §2 C3's "Known bound", the same rule stated twice) and row
   16's engine tier — not the whole file. Add the consequence, which no document states: **if the PM reverts
   the Q2 commit, C6's and C3's tie-break paragraphs must be struck or re-marked as B3's obligation**, or the
   convention will describe a tie-break no shipped reader performs.
5. **"It loses nothing" is falsifiable and is false in one measured shape.** §v1.4-E4: *"if no current name
   matches, the family pass runs exactly as before, so **no move that the v1.3 hunk found is dropped**."*
   Executed (§4, N4): give the live-name lift a `sets` move from `s.adjustments` (`exUndo.field === "sets"`)
   and the de-duplication at `volume.cjs:167` drops the feed receipt — `2ada13f` returns **two** moves
   (`["cur","old"]`, `mgsTouched ["chest","back"]`), the shipped hunk returns **one** (`["cur"]`, `["chest"]`).
   The shipped answer **equals base and equals `f70dd23`**, so this is a *correction*, not a loss — but the
   sentence as written is an unqualified absolute and one fixture breaks it. **Bound it:** *"…except where the
   live-name lift already carries a `sets` move, in which case the dedupe at `:167` drops the receipt exactly
   as base does."*

Nothing here is a frozen-law objection, a golden regeneration, a protected-surface change or a behaviour
change. The package acceptance bar (artifact, `--full`, private census, receipt, authorized rerun) is **not
met and is not claimed**; this review does not grant it.

---

## 1. Engine bytes, scope, and the shape of the branch — all three claims confirmed

sha256 of the three product files as they stand in the worktree at `6038a52`:

```
plan.cjs         4c6f981706694771501d3d050440eb4f9a62e64b6eac7c59ff9c4742dfaa7e93   19,853 B
progression.cjs  9adaeecb715e42533fcd51483e67f52a9d8d530a0de80865e28ae572152599a8   54,466 B
volume.cjs       d487b12300e9308791bf1545fe2c768847e2031e14bb46bd8acb84d6c6c5fe5e   25,309 B
```

**All three pins in the assignment are correct**, and the git **blob objects** say it more strongly than equal
content does:

| commit | `plan.cjs` blob | `progression.cjs` blob | `volume.cjs` blob |
|---|---|---|---|
| base `acd3b67` | `5e6216e0…` | `90d88efe…` | `94f4a762…` |
| builder `c39d1cb` | **`7c9481cf…`** | `29b3936d…` | `01412cb5…` |
| r1 fixer `f70dd23` | `7c9481cf…` | **`673bc8a1…`** | `01412cb5…` |
| r2 fixer `9edefe5` | `7c9481cf…` | `673bc8a1…` | `01412cb5…` |
| r3 review `c5a5d48` | `7c9481cf…` | `673bc8a1…` | `01412cb5…` |
| r3 fixer docs `abe1791` | `7c9481cf…` | `673bc8a1…` | `01412cb5…` |
| **tip `6038a52`** | **`7c9481cf…`** | **`673bc8a1…`** | **`8817588d…`** |

`plan.cjs` and `progression.cjs` are **the same git objects from `f70dd23` through the tip** — byte-identity is
not asserted, it is the same blob. `volume.cjs` moves **only at `6038a52`**, and the withdrawn hunks
(`07fba76` `4a04f4e8…`, `2ada13f` `30e4dc21…`/blob `75064d9e…`) are on no commit reachable from the tip.

**Per-commit scope, measured:**

```
c39d1cb  M plan · M progression · M volume · A BUILD-REPORT-B2.md · A m4/spec/b2-inherited-carriers.cjs   (5 files)
5a4205c  A reviews/B2-REVIEW-r1.md                                                                       (1 file)
f70dd23  M progression.cjs · A BRIEF-…-v1.2.md · M BUILD-REPORT · A b2-delta-cells.cjs                    (4 files)
d8e4040  A reviews/B2-REVIEW-r2.md                                                                       (1 file)
9edefe5  A BRIEF-…-v1.3.md · M BUILD-REPORT (+330) · M b2-delta-cells.cjs                                 (3 files)
c5a5d48  A reviews/B2-REVIEW-r3.md                                          (1 file, 429 ln)  <-- PRESENT
abe1791  A BRIEF-…-v1.4.md · M BUILD-REPORT (+371) · M b2-delta-cells.cjs (+90/-15)                       (3 files)
6038a52  M rebuild/engine/volume.cjs                       (1 file, 5 insertions / 1 deletion)  <-- Q2, LAST
```

**The r3 review file is on the branch and it is the same blob it was before the rebase** — `c00c19aa…` at both
`843a2a5` and `c5a5d48`. It is committed **before** the docs/cells commit and **before** Q2, exactly as R3.0
claims. **Q2 is still ONE commit and still the only commit that touches `volume.cjs`.**

Cumulative `acd3b67…6038a52` — **12 files**: `M rebuild/engine/{plan,progression,volume}.cjs` ·
`A rebuild/lanes/b/BRIEF-…-v1.2.md` · `-v1.3.md` · `-v1.4.md` · `A BUILD-REPORT-B2.md` ·
`A b2-delta-cells.cjs` · `A reviews/B2-REVIEW-r{1,2,3}.md` · `A rebuild/m4/spec/b2-inherited-carriers.cjs`.
**No path under `rebuild/conform/**`, `rebuild/engine/test/**`, `tools/**`, `.github/**`,
`rebuild/m4/spec/acceptance-*.json` or `package-lock.json` appears in any commit** — no frozen law, witness,
tool, golden, accepted artifact or lockfile byte moved.

**The revert still drops Q2 whole — executed.** `git revert --no-commit --no-edit 6038a52` applies cleanly and
stages exactly `M rebuild/engine/volume.cjs`; on the reverted tree `git diff abe1791 --stat` is **empty** —
not "no engine diff", **no diff at all** — and `git diff f70dd23 --stat -- rebuild/engine` is likewise empty.
Restored with `revert --abort` + `reset --hard 6038a52`; status clean, HEAD `6038a52`.

## 2. The R3-A fix, executed — and stressed until it broke

Five disposable sha-pinned engine copies, built by this reviewer from git and hashed on disk:
`base` `1b26c87f/7031838d/c32298e7` · `noq2` (`f70dd23`) `4c6f9817/9adaeecb/73550ef8` · `oldq2` (`07fba76`)
`…/4a04f4e8` · `q2old` (`2ada13f`) `…/30e4dc21` · `fix` (`6038a52`) `…/d487b123`. Clock `2026-09-03`,
receipt dated `2026-09-01` (monday `2026-08-31`).

**2.1 The regression is GONE, in both array orders.** Lift `cur` currently named `Bench` (chest); lift `old`
currently named `Bench press` (back) with `renames:[{prevN:"Bench"}]`; one receipt
`VOLUME +1 — CHEST via Bench (now 3 sets)`:

| reading | base | `noq2` | `07fba76` | `2ada13f` | **SHIPPED `6038a52`** |
|---|---|---|---|---|---|
| `.sets`, `exercises [cur, old]` | `["cur"]` | `["cur"]` | `["cur"]` | `["cur"]` | **`["cur"]`** |
| `.sets`, `exercises [old, cur]` | `["cur"]` | `["cur"]` | `["cur"]` | **`["old"]`** | **`["cur"]`** |
| `mgsTouched`, `[cur, old]` | `["chest"]` | `["chest"]` | `["chest"]` | `["chest"]` | **`["chest"]`** |
| `mgsTouched`, `[old, cur]` | `["chest"]` | `["chest"]` | `["chest"]` | **`["back"]`** | **`["chest"]`** |
| with `f.exId="old"` (C2) | `["cur"]` | `["cur"]` | `["old"]` | `["old"]` | **`["old"]`** |
| `_volDeltas(cur)` / `(old)` | both | both | both | both | **both** |

**Reproduced r3's defect on `2ada13f` and its absence on the shipped hunk, independently.** C2's `exId` tier is
**terminal** on the shipped hunk at this reader, as `B2-Q2j` now asserts, and `_volDeltas` still credits both
lifts on every side — the declared residual, untouched.

**2.2 Trying to break the tie-break — three constructions, all held.**

* **Three-way collision, all six permutations.** `L` live `Bench` (chest), `F1` `Bench press` prevN `Bench`
  (back), `F2` `Bench wide` prevN `Bench` (delts). Shipped returns **`["L"]` / `["chest"]` in all six
  orders**. `2ada13f` returns `L`, `F1` or `F2` depending on position (`["chest"]`/`["back"]`/`["delts"]`).
  The live-name tier is a total order over the collision, not a two-element special case.
* **A live lift whose `n` equals another lift's `prevN` AND its own former name.** `L` = `{n:"Bench",
  renames:[{prevN:"Bench"},{prevN:"Benchy"}]}` (chest) against `B` = `{n:"Bench press",
  renames:[{prevN:"Bench"}]}` (back). `_formerNames(L)` = `["Bench","Benchy"]` (the helper seeds the set with
  `ex.n`, so a self-rename is idempotent). Shipped: **`["L"]` in both orders**; `2ada13f`: `["L"]` / `["B"]`.
  Held.
* **Does the second tier lose anything the first tier skipped?** No: `_formerNames(x)` *includes* `x.n`, so
  tier 2 is a strict superset of tier 1 and runs only when tier 1 finds nothing. The construction is sound.

**2.3 Where it still breaks — bite R4-A (NEW).** Remove the live holder. `f1` = `{n:"Bench press",
prevN:"Bench"}` (chest), `f2` = `{n:"Row heavy", prevN:"Bench"}` (back); same receipt, which says **CHEST**:

```
                    base      noq2      07fba76   2ada13f              SHIPPED
.sets [f1,f2]       []        []        []        ["f1"]               ["f1"]
.sets [f2,f1]       []        []        []        ["f2"]               ["f2"]
mgsTouched [f1,f2]  []        []        []        ["chest"]            ["chest"]
mgsTouched [f2,f1]  []        []        []        ["back"]             ["back"]   <-- STILL order-decided
_volDeltas(f1)/(f2) both      both      both      both                 both
```

**A receipt whose own text says CHEST is charged to `back` by `s.exercises` order on the SHIPPED hunk** — the
same sentence r3 wrote, one collision shape over. Two things keep this below r3's bar and out of the required
behaviour changes: base ships **no move at all** here (so it is the declared *"WRONG owner where base shipped
a missing one"* trade, not a regression against base), and **§2 C6 and §v1.4-E1 state the bound correctly** —
*"only when no lift's current name matches does array order decide among former-name matches"*. What is wrong
is the **engine's own comment at `volume.cjs:166`**, which says the opposite without qualification, and the
fact that **no cell pins this arm**. → **required change 1.**

**2.4 Bite R4-B (NEW) — the terminal `exId` tier destroys a readable receipt.**

```
receipt "VOLUME +1 — CHEST via Press (now 3 sets)", one lift p named "Press"
  f.exId = "ghost"   base ["press"] · noq2 ["press"] · 07fba76 [] · 2ada13f [] · SHIPPED []
  _volDeltas(p)      base  credited  · noq2  NOT      · 07fba76 NOT · 2ada13f NOT · SHIPPED NOT
  controls: exId absent -> ["press"] everywhere · exId = "p" -> ["press"] everywhere
            numeric id 7 with exId "7" -> [7] everywhere (String() coercion works)
```

On `noq2` the two readers **disagree** (`structuralMovesThisWeek` credits by name, `_volDeltas` does not) — a
**ninth** C6 shape, and one more count against reverting Q2. On the shipped hunk they agree: they agree that a
receipt the athlete can read on his feed has **no owner and no move**. `progression.cjs:233` (D3) and `:628`
(D4) are already terminal this way at `f70dd23`, so Q2 does not create the class — it completes it, and §2 C2
never states it. Measured: **no writer in `rebuild/engine/` puts `exId` on a feed row** (`writers.cjs:2162`
and `:2319` emit `{d, at, t, how, …}`), so nothing in today's data can hit it; `merge.cjs` carrying a foreign
row, or B3's writer half, turns it on. → **required change 2.**

**2.5 Bite R4-C — "it loses nothing" is false in one shape.** `adjustments:[{d, exUndo:{field:"sets",
exId:"cur"}}]` plus the same colliding-family receipt: `2ada13f` with `[old,cur]` returns
`sets ["cur","old"]` / `mgsTouched ["chest","back"]`; the shipped hunk returns `["cur"]` / `["chest"]` because
tier 1 lands on a lift that already has a move and the dedupe at `:167` drops the receipt. **Base and `noq2`
also return `["cur"]`**, so the shipped answer is the *correct* one — but §v1.4-E4's unqualified *"no move
that the v1.3 hunk found is dropped"* is falsified by it. → **required change 5.**

**2.6 The three declared residual classes, re-measured with DIFFERENT muscle groups** (the half `B2-Q2i` and
`B2-Q2k` do not assert): class (i) suffix-less `via Press (now heavy)` → `["chest"]`/`["back"]` by order, and
class (iii) empty inner `via Press (now )` → `["chest"]`/`["back"]` by order — **identical on all five sides,
base included.** Correctly declared, correctly not fixed, and correctly excluded by the bounded C6.

## 3. The gates — every figure independently reproduced

**3.1 The 45-law runner.** `rebuild/conform/v4/run-defect-laws.cjs`, product files swapped in place by
`git checkout <ref> --`, sha-verified before each run and restored after (`git status --porcelain` empty every
time):

| variant | TOTAL line | exit |
|---|---|---|
| base `acd3b67` | `45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| no-Q2 `f70dd23` | `45 · 45 · 25 · 88 · 83/104 · 0 · AUDIT RED-FIRST FAIL` | 1 |
| `2ada13f` | identical to the line above | 1 |
| **shipped `6038a52`** | **identical to the line above** | 1 |

```
MOVED LINES  base vs no-Q2 = 15 · base vs 2ada13f = 15 · base vs SHIPPED = 15
             no-Q2 vs 2ada13f = 0 · no-Q2 vs SHIPPED = 0 · 2ada13f vs SHIPPED = 0
             (Buffer.compare on the whole stdout = 0 for all three candidate pairs, 4,586 B each;
              base is 4,628 B. stderr byte-length identical across the three candidates.)
the fifteen  stdout lines 1,2,3,4,5,6,7,9,18,28,29,30,31,32,46
          =  D1 D2 D3 D4 D5 D6 D7 D9 D18 D28 D29 D30 D31 D32 + TOTAL, each moving
             RED-frozen / RED-candidate / mutant-DETECTED  ->  RED-frozen / GREEN-candidate / AUDIT-FAIL
             and NOTHING else moves.
D18 SHIPPED  D18 P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix
             · RED-frozen / GREEN-candidate / AUDIT-FAIL          <-- GREEN with Q2 in
```

**14/14, exactly fifteen lines move, zero between the candidate variants, D18 GREEN.** The two predicted side
effects reproduce to the number (`89 → 88` controls, `97/104 → 83/104` mutants).

**3.2 Public direct-call census — this reviewer's own, 572 cells per run.** Two state readings (`SEED`,
`migrate(null)`) × two matrix days, over `programmeVolume`, `muscleVolume`, `volumeImbalance`,
`structuralMovesThisWeek`, `nowModel`, `canonicalizePlan`, `dayType` at 8 dates, and 17 readers over each of
the 16 seeded lifts (`targetsFor`, `progressAnchor`, `loadRungs`, `maxedOut`, `nextLoad`, `prevLoad`,
`deloadLoad`, `snapLoad`, `repsLostOnJump`, `deriveSighting`, `_volDeltas`, `setOneRead`, `volumeConversion`,
`liftTrend`, `liftTrend({asOf})`, `liftCall`, `exActive`):

```
2026-09-03 and 2026-09-07, identical both days:
  base -> SHIPPED   : 4 of 572   SEED+migrated / perLift / fly + hipthrust / deloadLoad   5 -> null
  base -> no-Q2     : the same 4
  no-Q2 -> SHIPPED  : 0 of 572      2ada13f -> SHIPPED : 0 of 572      07fba76 -> SHIPPED : 0 of 572
```

**Exactly the single D6 cell, in four JSON positions, at both matrix days. The Q2 hunk adds no census cell in
any of its three forms.** (Arities were taken from the source, not guessed — `deloadLoad(ex, pct)` is the trap
r3's R-1 names and it is real; a census that reads `null` on both sides proves nothing. R-1 stands: the seeded
state carries no sessions, so this is a thin oracle for the era/trend readers.)

**3.3 Protected cell `tools/engine-test.jsx:70`**, at the second gate's own hard pin
`MEASURED_TEST_NOW=2026-07-29` over `tools/snapshots/2026-08-06-ledger.json`, whose sha256 was re-verified
**inside every probe process** as the brief's pin `62f9e051…`:

| engine | `:70` | `:71` | `:72` | `:76` |
|---|---|---|---|---|
| base `acd3b67` | **HOLDS** | holds | holds | holds |
| no-Q2 `f70dd23` | **HOLDS** | holds | holds | holds |
| `07fba76` | **HOLDS** | holds | holds | holds |
| `2ada13f` | **HOLDS** | holds | holds | holds |
| **shipped `6038a52`** | **HOLDS** | holds | holds | holds |

**Does not move on any of the five engines.** (Line numbers confirmed on the file: `:70` is the
`progressionTrend` snapshot assertion, `:71` the abstention branch, `:72` the non-numeric exclusion, `:76` the
downgrade-gate count.) Verdict only; no cell value, hash or prose reported.

**3.4 Carrier, witnesses, cells.**

```
node rebuild\m4\spec\b2-inherited-carriers.cjs            (in place, per ref)
  base     : exit 1  — FAIL at defect-witnesses (ERR_ASSERTION)                     <-- not vacuous
  no-Q2    : exit 0  — B2 INHERITED CARRIERS: 5/5 PASS; 17 exact substitutions
  2ada13f  : exit 0  — 5/5 PASS; 17 exact substitutions — identical text
  SHIPPED  : exit 0  — 5/5 PASS; 17 exact substitutions — identical text

node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs   exit codes
  base     : 0 · 1 · 0 · 0 · 1 · 0 · 1
  no-Q2    : 1 · 1 · 0 · 1 · 1 · 0 · 1
  2ada13f  : 1 · 1 · 0 · 1 · 1 · 0 · 1
  SHIPPED  : 1 · 1 · 0 · 1 · 1 · 0 · 1          <-- the same flip shape, unchanged by Q2

node rebuild\lanes\b\b2-delta-cells.cjs <engineDir>       (engineDir arg — the worktree is never modified)
  base     : 30/30 HOLD · side BASE      · Q2 n/a          exit 0
  no-Q2    : 30/30 HOLD · side CANDIDATE · Q2 NOT APPLIED  exit 0
  SHIPPED  : 30/30 HOLD · side CANDIDATE · Q2 APPLIED      exit 0
  07fba76  : 28/30      · MOVED B2-Q2f, B2-Q2g            exit 1   <-- VACUITY CONTROL 1
  2ada13f  : 29/30      · MOVED B2-Q2j                    exit 1   <-- VACUITY CONTROL 2
```

**30/30 on all three shipped sides and two independent vacuity controls**, each moving exactly the cells that
encode the round it fails. `B2-Q2j` is now a genuine discriminator: the live-name tier is executed against it.
r2's noted weakness stands — `B2-Q2a` self-detects its own side and cannot fail.

**3.5 `rebuild/conform/run.cjs`** (`cwd=rebuild/conform`, `MEASURED_TEST_NOW=2026-09-03`,
`TZ=America/New_York`, `ENGINE_MAIN=ed1fa321…`), run on base / no-Q2 / `2ada13f` / shipped:

```
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
exit 1 · stdout 10,837 B / 81 lines / sha256 31b0b5e2229a2385… — BYTE-IDENTICAL on all four · 0 differing lines · 0-byte stderr on all four
INFO 9 engine-track rig185: W1 PASS, W2 PASS on all four
```

**r3's path-spelling warning is real and was honoured.** This clone's stdout is **10,837 B / `31b0b5e2…`**
against the r3 fixer's **10,809 B / `3978571c…`** and r3's **21,924 B / `3a8ebd55…`** — the suite echoes
`ENGINE_MAIN` into its `BAD 0` lines, so the sha tracks the *path string* (my worktree is named `review-b2`,
the fixer's `b2`) and, for r3, whether `engine-old.cjs` was supplied. **Every assertion line is identical, and
comparison here was done on assertion lines and on all-four byte-equality, never on a cross-session sha.**
The `BAD 0 engine artifacts present (main + old)` and `BAD 7 privacy … 0 private lines` lines are identical on
all four sides, so neither is B2's. The claim is "*identical*", never "clean".

**3.6 `rebuild/engine/test/second-gate.mjs --candidate`**, all four sides:

```
SECOND GATE reference FINAL108: 3072 passed, 0 failed
  vacuity gate — 9 known hit(s), baseline matched, nothing new
  SYNC-LAWS: 18 laws hold across 59 committed seeds
  reference surface: byte-identical to committed baseline (123077 bytes)
driver stdout 911 B sha 650cddc45a09d318… · stderr 181 B · exit 1
candidate log .tmp/m2-second-gate/candidate-engine-test.stdout.log : 31,489 B sha cf407f73586b89ec…
ALL FOUR SIDES BYTE-IDENTICAL — stdout, stderr and the candidate log, 0 differing lines.
```

The stdout sha `650cddc4…`, the stderr size `181 B` and the candidate-log sha `cf407f73…` reproduce the r3
fixer's figures **exactly**, and the candidate-log sha reproduces r3's as well (the 267-vs-268 line count is a
trailing-newline convention on an identical file, as §R3.8 already reconciles). The candidate side stops on
every side at the **pre-existing D12 step-efficacy cell**, the site the accepted custody owns. **B2 adds no
failure inside the observable assertions, in any Q2 form.** R-2 / Q9 stands: the remaining 2,811 are
unobserved and are not B2's to close.

## 4. The C6 census — reproduced cell for cell, and extended

Same question as r3 and the r3 fixer: for each receipt shape and each lift, does `_volDeltas(ex, s)` non-empty
**equal** `ex.id ∈ structuralMovesThisWeek(s).sets`? Executed on this reviewer's five engine copies, with
fixtures built from the shape descriptions alone.

| receipt shape | base | no-Q2 `f70dd23` | `07fba76` | `2ada13f` | **shipped `6038a52`** |
|---|---|---|---|---|---|
| r1-B1 `via Press incline (now 3 sets)` | ✗ `inc` | **✗ `press` AND `inc`** | ✓ | ✓ | **✓** |
| r2-R2A renamed lift `via Press heavy (now 3 sets)` | ✓ | ✓ | **✗ `p9`** | ✓ | **✓** |
| nested `via Press (now heavy) (now light) (now 3 sets)` | ✗ `p2`,`p3` | ✗ `p1`,`p3` | ✓ | ✓ | **✓** |
| suffix-less legacy `via Press (now heavy)` — `B2-Q2i` | ✗ `p2` | ✗ `p2` | ✗ `p2` | ✗ `p2` | **✗ `p2`** |
| colliding families `via Bench (now 3 sets)` — `B2-Q2j` | ✗ `old` | ✗ `old` | ✗ `old` | ✗ `old` | **✗ `old`** |
| empty inner `via Press (now )` — `B2-Q2k` | ✗ `pb` | ✗ `pb` | ✗ `pb` | ✗ `pb` | **✗ `pb`** |
| no space `via Press(now 3 sets)` | ✓ | **✗ `press`** | ✓ | ✓ | **✓** |
| plain `via Press (now 3 sets)` | ✓ | ✓ | ✓ | ✓ | **✓** |
| **DISAGREEING SHAPES** | **5 / 8** | **6 / 8** | **4 / 8** | **3 / 8** | **3 / 8** |

**Every cell of the published table reproduces, including which lift id is named in each ✗.** Both claims the
PM's ruling turns on are therefore confirmed by a fourth, independent execution:

1. **Shipped = 3/8, and the three are exactly the named excluded classes** — (i) suffix-less legacy
   (`B2-Q2i`), (ii) colliding name families (`B2-Q2j`), (iii) empty inner (`B2-Q2k`). All three are
   double-owned on **base** as well; none is closable by a reader; the close is C2's writer-side `exId`.
   **The live-name tie-break does not change the count** (3/8 on `2ada13f` and on the shipped hunk) — it
   changes *which* lift the one move goes to, which is precisely §v1.4-E4's claim and it is true.
2. **Reverting Q2 is strictly worse than base — 6/8 against 5/8.** D3 repairs `_volDeltas` and leaves
   `structuralMovesThisWeek` on the substring rule, so on r1's own B-1 fixture the two readers disagree **in
   both directions** (`press` move-only, `inc` `_volDeltas`-only), and the no-space shape disagrees as well.
   **Confirmed.** The PM's live alternative — carry Q2 to B3 for the cost of one `git revert` — lands the
   package on a C6 position worse than the code it replaces.

**One construction caveat worth recording for the next round.** The published table's row 2 is only
reproducible if the renamed lift's **current** name is a *substring* of the receipt text (`p9` currently
`Press`, formerly `Press heavy`). With a current name that is not a substring (`Press heavy v2`), base and
no-Q2 both read **✗ `p9`** and the totals become 6/8 and 7/8 — i.e. **the published figures are the
conservative ones**, and the case against reverting Q2 is if anything stronger than stated. Neither r3 nor the
fixer states the fixture, and the next round should not have to rediscover it.

**Two extensions of this reviewer's own**, clearly outside the published eight:

| extension shape | base | no-Q2 | `07fba76` | `2ada13f` | **shipped** |
|---|---|---|---|---|---|
| **R4-B** `via Press (now 3 sets)` with `f.exId="ghost"` | ✓ (move) | **✗ `press`** | ✓ (no move) | ✓ (no move) | **✓ (no move)** |
| **R4-A** `via Bench (now 3 sets)`, no live `Bench`, two former holders | ✗ `f1`,`f2` | ✗ `f1`,`f2` | ✗ `f1`,`f2` | ✗ `f2` | **✗ `f2`** |

Over ten shapes: base **6**, no-Q2 **8**, `07fba76` **5**, `2ada13f` **4**, shipped **4**. The ordering is
unchanged and the gap widens; R4-A is a member of excluded class (ii) (so C6 already covers it) but is the
arm that **no cell pins** and that the engine comment denies.

## 5. Is v1.4 "the r2/r3 reviewer-requested amendments only"? — mostly YES, and exactly TWO items are not

`DECISIONS:108` (c): *"BRIEF-B2 v1.3 ACCEPTED by name = v1.2 + the r2/r3 reviewer-requested amendments only;
anything beyond them needs a new line."* The ruling is dated **after** r3's review, and it accepts a **content
class**, not a filename. The file on the branch called *v1.3* was authored before r3 existed and therefore
cannot contain r3's amendments; **the file that actually realises `:108` (c)'s definition is v1.4**. So the
question is not "is v1.4 a different file from v1.3" — it is "does v1.4 contain anything that is not an r2 or
r3 reviewer-requested amendment".

Measured: `git diff --no-index` v1.3 → v1.4 = **422 insertions / 21 deletions**, 1,110 → 1,511 lines, in
thirteen hunks. Against v1.2 the carried-v1.1 body has moved in **exactly four places** — §2 preamble, §2 C3,
§2 C6, §7 Q2 — which is what v1.4's own four-exceptions table claims; **C1, C2, C4, C5, Q1, Q3–Q9, all
fourteen §1.x D-hunk sections and §3–§6 entire are byte-unchanged since v1.2.** Verified.

| # | v1.4 change | traces to | class under `:108` (c) |
|---|---|---|---|
| 1 | H1 `v1.3` → `v1.4`; `(PROPOSED, NOT ACCEPTED)` kept | — | editorial |
| 2 | NEW §v1.4 amendment block E1–E6 (~290 ln) | r3 changes 1–5 | **rides** (disclosure) |
| 3 | "READ THIS FIRST/SECOND" → "SECOND/THIRD" on the older headings | — | editorial |
| 4 | §v1.3-B1 heading + NOTE "HUNK SUPERSEDED BY §v1.4-E4" | r3 change 4 | **rides** |
| 5 | §v1.3-B1's two citations struck and corrected (`:162–164`→`:163–165`; `:228–236`→`:232–237`) | r3 change 3 | **rides** |
| 6 | §v1.3-B1's "the two readers cannot disagree" qualified | r3 change 1 | **rides** |
| 7 | §v1.3-B3 table row annotated with the v1.4 result | r3 change 4 | **rides** |
| 8 | §v1.3-B3 item 3 struck through + v1.4 NOTE ("the trade was not worth what it cost") | r3 change 4 | **rides** |
| 9 | §v1.3 evidence table gets a v1.4 NOTE + the 267/268 line-count reconciliation | r3 changes 4–5, r3 §3.6 | **rides** |
| 10 | v1.3 NOTE's "Q1–Q9 still stand exactly as written" struck + v1.4 CORRECTION | r3 change 2 | **rides** |
| 11 | "Still open for the PM" gains R3-1…R3-7, R3-B, R3-C | r3 §5 | **rides** |
| 12 | tail note replaced by the FOUR in-place edits table | r3 change 2 | **rides** |
| 13 | §2 preamble re-marked (C3 citations re-pinned; C6 corrected **and bounded**) | r3 changes 1, 3 | **rides** |
| 14 | §2 C3: `at < 0` guard added to the executable form; citations re-pinned; "Known bound" extended to the empty-inner and colliding shapes | r3 change 3 | **rides** |
| 15 | **§2 C6 BOUNDED** — single-owner qualifier, three excluded classes named with cells | r3 change 1 | **rides** |
| 16 | **the LIVE-NAME TIE-BREAK stated as normative convention — in §2 C6 *and* in §2 C3's "Known bound"** | **no reviewer asked for it** | **BEYOND — needs a line** |
| 17 | §7 Q2 gains the `[v1.4]` paragraph and the C6 census table | r3 change 5 | **rides** |
| 18 | cells: `B2-Q2j` extended to `mgsTouched` + `exId` in both orders | r3 change 4, verbatim | **rides** |
| 19 | cells: `B2-Q2k` / `B2-Q2k-b` added for r3's bite R3-B | r3 §4 ("unmentioned and unpinned") | **rides** |
| 20 | **`volume.cjs` gains the live-name tier (commit `6038a52`)** | r3 §4 measured it; **r3 required only a cell** and wrote *"No engine byte needs to change"* | **BEYOND `:108` (c)** — rides, if at all, under `:103` (3)'s grant of the Q2 hunk and the still-open §7 Q2 ruling |

**Judgment.** Eighteen of the twenty changes are r2/r3 reviewer-requested amendments and **ride under
`DECISIONS:108` (c) exactly as written — they need no new PM line.** Two do not:

* **Row 16 — the live-name tie-break as normative text.** v1.4's own row 13 already admits this ("**NEW
  normative content** … needs a line"), and it is correct to. It is new convention `PLAN…:157` hands to B3,
  and it was authored by the fixer, not requested by any reviewer.
* **Row 20 — the engine byte.** r3's verdict is unambiguous that no engine byte needed to move. The fix is
  **right on the merits** — it removes a measured regression against base at the half the product consumes,
  costs nothing on any gate, and agrees with base in every shape this reviewer could construct — but it is
  **not** a "reviewer-requested amendment", and v1.4 should stop saying r3 offered it (**required change 3**).

**So B2 does NOT need a fresh line for the whole file. It needs ONE line covering rows 16 and 20** — and the
natural home is the PM's §7 Q2 ruling itself, because **`git revert 6038a52` removes both**: row 20 is the
commit, and row 16 describes what that commit does. **If the PM reverts Q2, §2 C6's and §2 C3's tie-break
paragraphs must be struck or re-marked as B3's obligation in the same pass** — otherwise the durable
convention will state a tie-break no shipped reader performs. No document says this (**required change 4**).

**One further correction of fact.** v1.4 §v1.4-E2 reasons entirely from `DECISIONS:103` item (3) and **never
cites `:108`** — nor does `BUILD-REPORT-B2.md`, whose newest DECISIONS citation is `:103` item (4). Its
"needs a line" column for rows 9–12 (§2 preamble, the C3 rewrite, the C6 rewrite, the §7 Q2 in-place edit) is
therefore **stale**: those are the r2-requested amendments and `:108` (c) has already accepted them by name.
The ask should be narrowed accordingly, and the file should say whether it is offering itself as *v1.4* or as
"the v1.3 `:108` (c) describes" — because on `:108` (c)'s own definition, this file **is** that v1.3 plus rows
16 and 20.

## 6. Citations — every one re-measured

All seven citations v1.4 pins or re-pins were checked against the actual bytes, base-tree and candidate-tree:

| citation | claim | measured |
|---|---|---|
| `volume.cjs:159` (base) | `structuralMovesThisWeek`'s owner lookup | ✔ `const ex = (s.exercises \|\| []).find((x) => f.t.indexOf("via " + x.n) > -1);` |
| `volume.cjs:302` (base) | `_setsMovesSince`'s substring filter | ✔ the `f.t.indexOf("via ") > -1` row filter |
| `progression.cjs:231` (base) | `_volDeltas`'s owner test | ✔ `for (const n9 of names9) if (n9 && f9.t.indexOf("via " + n9) > -1) named9 = true;` |
| `progression.cjs:620` (base) | the EARNED owner test in `_deriveSightingFull` | ✔ `for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;` |
| `progression.cjs:232–237` (candidate) | the C2→C3 block | ✔ `:232` `let named9 = false` · `:233` the `exId` tier · `:234–236` the boundary · **`:237` the two exact comparisons** |
| `volume.cjs:6` (candidate) | the `_formerNames` delegate | ✔ |
| `volume.cjs:163–166` (candidate, v1.4 hunk) | four lines | ✔ `:163` `at9`/`tail9` · `:164` `cut9`/`own9` · `:165` `xs9`/`owns9` · **`:166` the `find`** (and `:163–165` on `2ada13f`, as §v1.4-E3 says) |

**All seven are right.** r3's required change 3 is fully discharged, the `at < 0` guard is in the printed
executable form, and the base-tree/post-image convention v1.4 states is the convention it follows.

## 7. Residual risks

- **R4-1 … R4-5 — the five required changes above.** Four are documentation or a cell arm; one is a single
  **comment** line inside the Q2 commit. **No behaviour changes**, so no gate in §3 needs re-executing — only
  the `volume.cjs` sha re-pinned in §v1.4-E4 and R3.0, and the Q2 commit re-authored once more (it has been
  re-authored before and the mechanism is proven).
- **R4-A / R4-B (new bites) — OPEN by design, bounded, and now written down.** Neither is a regression against
  base that Q2 introduced; both are unpinned boundaries B3 inherits.
- **R3-1 … R3-5 — CLOSED.** Verified by execution against the documents, not by reading the fixer's claim.
- **R3-6 — OPEN, lane tooling.** `rebuild/conform/engines/build-engines.mjs` still cannot run on Windows;
  this reviewer, like every one before it, worked around it by using the already-present bundle. Not B2's.
- **R3-7, R2-7, R-7 — OPEN.** The package bar is not met and is not claimed.
- **R2-3, R2-4, R2-5, R2-6 and R-1 … R-6 — OPEN and correctly carried.** `volume.cjs:302` is still off the
  convention and still behind its own 120-row cap; with Q2 in it is the one reader in this file not on C6, and
  C6 names it.
- **R4-6 (new, reproduction hygiene).** The published C6 census is only reproducible with the row-2 fixture
  described in §4. Fixtures for the eight shapes should be committed beside the cells, or the table should
  name them, so the next round measures the same thing.

## 8. Is B2 READY TO SEAL? — **NO, and it is not supposed to be yet**

Unchanged from r3 §6 and re-verified here; the engineering is sound and independently reproduced four times.

1. **The brief is still `(PROPOSED, NOT ACCEPTED)` in its own H1.** Under `DECISIONS:108` (c) most of it is
   already accepted; what is outstanding is **one line covering §5's rows 16 and 20**, which the PM can fold
   into the §7 Q2 ruling.
2. **The chain.** `DECISIONS:103` item (1) orders **B-NTC → B1 → B2 → B4 → B3** and rules that *"the second
   package re-takes its pre-image shas at the first's accepted head"*. B2's §0 pre-image (`acd3b67`:
   `1b26c87f / 7031838d / c32298e7`) goes stale the moment B-NTC and B1 land. **B2 must be rebased onto B1's
   accepted head, and its pre-image shas, its census baseline, its `b2-delta-cells` BASE expectations and
   every figure in §3 above re-taken there.** `defect-witnesses.cjs` is a shared carrier with B1 (build report
   §6.3), so that rebase is not free. **This review's numbers are the baseline the re-run must reproduce.**
3. **The parent** is not claimable while B-NTC and B1 sit ahead (`:108` (e) confirms B-NTC's parent, not B2's).
4. **`rebuild/m4/spec/b2-inherited-carriers.cjs` placement** is ruled for the branch by `:103` item (4) and is
   a merge-time decision thereafter.
5. **The standing lane-B rules at `:108` (d)** — X1 (`coverage.moves` stays `{}` at every seal) and X2 (the
   parent receipt base must be on `origin/rebuild/t2-client-core`) — are not yet exercised by B2 and must be
   carried into its artifact when it is written.

**Readiness verdict: B2 is READY FOR THE PM'S §7 Q2 RULING and for its place in the queue, and is NOT READY
TO SEAL.** Once required changes 1–5 land, nothing in B2's own evidence needs redoing before the rebase.

## 9. Every command this reviewer executed

```
git -C <design-pin> fetch origin                                                  -> origin/rebuild/lane-b-b2 = 6038a52
git -C <review-b2> fetch origin ; checkout --detach origin/rebuild/lane-b-b2      -> 6038a52, status clean
git rev-parse <ref>:rebuild/engine/{plan,progression,volume}.cjs  x7 refs          -> the blob table of §1
Get-FileHash -SHA256 on the three product files at the tip                        -> 4c6f9817… / 9adaeecb… / d487b123…
git diff --name-status acd3b67 6038a52 ; git diff --stat per commit                -> 12 files; the per-commit scope of §1
git rev-parse 843a2a5:…/B2-REVIEW-r3.md and c5a5d48:…                              -> c00c19aa… on both (same blob across the rebase)
git diff -U6 {abe1791|2ada13f|f70dd23} 6038a52 -- rebuild/engine/volume.cjs        -> the hunk, exactly as §v1.4-E4 prints it
<r4 engines.ps1: eng/{base,noq2,oldq2,q2old,fix}, sha-pinned from git>             -> c32298e7 / 73550ef8 / 4a04f4e8 / 30e4dc21 / d487b123
<r4 probe1.cjs x5 engines: R3-A, three-way, self-rename, ghost exId, dedupe, classes (i)/(iii)>  -> §2
<r4 c6census.cjs x5 engines: the eight published shapes + two r4 extensions>       -> §4; 5/8 · 6/8 · 4/8 · 3/8 · 3/8
<r4 cites.cjs: seven citations against the real bytes>                             -> §6, all seven correct
node rebuild\conform\v4\run-defect-laws.cjs  x4 in place, sha-verified + restored  -> 45/39/89/97-104 · 45/25/88/83-104 x3; exit 1 x4
<r4 movediff.cjs over the four stdouts, Buffer.compare>                            -> 15 / 15 / 15 / 0 / 0 / 0 MOVED; the 14 D-ids + TOTAL
<r4 census.cjs x5 engines x2 matrix days (572 cells) + censusdiff.cjs>             -> 4 cells both days; 0 for every candidate pair
<r4 probe70.cjs x5 engines at MEASURED_TEST_NOW=2026-07-29, snapshot sha in-process> -> :70 :71 :72 :76 HOLD x5
node rebuild\m4\spec\b2-inherited-carriers.cjs  x4 in place                        -> FAIL exit 1 on base; 5/5 + 17 subs exit 0 x3
node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs  x4 in place               -> 0·1·0·0·1·0·1  /  1·1·0·1·1·0·1 x3
node rebuild\lanes\b\b2-delta-cells.cjs <engineDir>  x5 engines                    -> 30/30 x3 · 28/30 (07fba76) · 29/30 (2ada13f)
cd rebuild\conform && node run.cjs  x4 in place                                    -> SUITE INCONSISTENT 99/99/29/70 x4; stdout byte-identical x4; 0-byte stderr
node rebuild\engine\test\second-gate.mjs --candidate  x4 in place                  -> reference FINAL108 3072/0 x4; stdout/stderr/candidate log byte-identical x4
git revert --no-commit --no-edit 6038a52 ; git diff abe1791 --stat ; revert --abort -> M volume.cjs only; reverted tree has ZERO diff vs abe1791
git reset --hard 6038a52 ; git status --porcelain                                   -> clean; HEAD 6038a52
git show origin/rebuild/t2-client-core:rebuild/DECISIONS.md                          -> 108 lines; :60, :82, :103, :108 read verbatim
git diff --no-index v1.3 v1.4 ; v1.2 v1.4                                           -> 422+/21-; four in-place body edits only
Select-String writers.cjs :2162 / :2319 and 'f.exId' readers                         -> no writer emits exId onto a feed row; three readers honour it
```

Every engine run: `TZ=America/New_York`; `MEASURED_TEST_NOW=2026-09-03` except the `:70` reproduction
(`2026-07-29`, the gate's own hard pin) and the conformance suite, which sets its own. After every in-place
swap the three product files were restored and `git status --porcelain` was empty.

`ledger/` and `rebuild/conform/private/**` were never opened, never named with values, never hashed, never
quoted. **Protected surfaces, verdict only:** `tools/engine-test.jsx:70` **does not move** on any of the five
engines (§3.3); the second gate's reference surface is **byte-identical to the committed baseline** on all four
sides (§3.6); the public census `setOneRead` / `volumeConversion` / `liftTrend` cells are **identical** across
all five engines at both matrix days (§3.2), which is the only statement this review makes about the seeded
set-one laboratory card. The private LIVE census for D30 remains the PM's own `--full` on the owner's PC
(`DECISIONS:92` / `:93` C4). `rebuild/conform/engines/engine-main.cjs` was read, never overwritten. No other
worktree was touched and none was created.
