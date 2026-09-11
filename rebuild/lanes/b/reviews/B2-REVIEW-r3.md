# EARNED — LANE B · PACKAGE B2 — INDEPENDENT REVIEW r3

| field | value |
|---|---|
| branch | `rebuild/lane-b-b2` |
| sha under review | `2ada13f4d02ba1cf7b80d6ed052750df9ce145fd` (`2ada13f`) |
| history reviewed | builder `c39d1cb` → r1 `5a4205c` → r1 fixer `f70dd23` → r2 `d8e4040` → r2 fixer `9edefe5` (BRIEF v1.3 + cells) → `2ada13f` (Q2, former-name term). Force-with-lease rebase: the withdrawn `07fba76` and `c4129c9` are still in the object store and were used as controls. |
| base | `origin/rebuild/t2-client-core` @ `acd3b67` |
| reviewer | lane B independent reviewer **round 3** (Opus) — not the builder, not r1, not r2, not either fixer; blind, told to disagree |
| date | 2026-09-11 |
| read in full | `reviews/B2-REVIEW-r1.md` (305 ln) · `reviews/B2-REVIEW-r2.md` (336 ln) · `BUILD-REPORT-B2.md` (1,630 ln incl. POST-REVIEW r1 and r2) · `BRIEF-…-v1.2.md` (704 ln) · `BRIEF-…-v1.3.md` (888 ln) · `rebuild/DECISIONS.md` 60, 82, 88–100 on the branch **and 101–104 on `origin/rebuild/t2-client-core`**, where the PM's acceptance actually lives (`:103`) |
| worktree | `work/lane-b/review-b2`, detached at `2ada13f`, `git status --porcelain` **empty at start and at end** and after every in-place swap. No other worktree touched; the two frozen-bundle worktrees this reviewer created under `%TEMP%\earned-r3-engine-wt\` were removed (`git worktree list` carries no `earned-r3` entry). |
| environment | node `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` **v24.19.0** by full path · `TZ=America/New_York` · `package-lock.json` unmodified · `node_modules` 39 entries · esbuild 0.28.1 |
| frozen bundles | built by **this reviewer** from private detached worktrees: `engine-main` @ `fe516c1` sha256 `ed1fa321a8b3271e347a0dd3026b53383bf7a0628408cb59be38c7754cf0340c` (814,747 B) and `engine-old` @ `a0009c3` sha256 `19843fba…` (793,862 B). The main bundle **reproduces r1's byte-for-byte**, which is a stronger control than r1/r2 had against each other. The repo's own `engines/build-engines.mjs` **fails on Windows** (`ERR_UNSUPPORTED_ESM_URL_SCHEME` — it dynamic-imports an absolute path without `pathToFileURL`); this reviewer used an equivalent builder in scratch. Not B2's defect; recorded for the lane. |
| never opened | `ledger/`, `rebuild/conform/private/**`. Protected surfaces reported **verdict-only**. |

## VERDICT — **ACCEPT WITH CHANGES**

Every number in the POST-REVIEW r2 section reproduced under independent execution with this reviewer's own
bundles, harnesses and fixtures — the engine bytes, the rebase, the fourteen laws, the census, the
protected cell, the carrier, the witnesses, the conform suite, the second gate, the cells and the revert.
**r2's four required changes are all genuinely in**, and required change 1 is not merely asserted: the
withdrawn `07fba76` loses the move and `2ada13f` restores it, measured side by side.

The changes required below are the product of this reviewer's own bites and are confined to **`BRIEF-…-v1.3`
and one cell**. **No engine byte needs to change.** They exist because v1.3's corrected §2 C6 introduces a
NEW absolute that the shipped engine does not satisfy — the same class of defect r2's required change 2
was created to stop, reintroduced one clause over.

**Exact changes required before this branch is offered for merge:**

1. **§2 C6's new falsifiable clause is FALSE as written, and B2's own cells are the counterexamples.**
   v1.3's C6 says: *"C6 is falsifiable and must be executed, not asserted: for any one receipt,
   `_volDeltas` and `structuralMovesThisWeek` must agree about whether this lift owns it."* Executed on the
   shipped engine over eight receipt shapes (§4), **three shapes disagree** — `B2-Q2i` (suffix-less legacy
   row), `B2-Q2j` (colliding name families) and an unpinned third (`" (now )"` with an empty inner). They
   disagree for a structural reason no reader can fix: `_volDeltas` returns **every** legal owner, while
   `structuralMovesThisWeek`'s `.find` can return only one. §v1.3-B3 records these as residuals against
   **C4/C5** but then hands B3 a C6 that they falsify, and B3's **D44 is "the VOLUME-receipt truth guard"** —
   an author implementing the clause literally writes a guard that fires on legitimate legacy data.
   **Bound it, in place, e.g.:** *"…must agree **wherever the receipt has exactly one legal owner**. Where
   the legacy shape admits two (the suffix-less and colliding-family rows of §v1.3-B3), `_volDeltas` returns
   all of them and `structuralMovesThisWeek` returns the first in `s.exercises` order; cells `B2-Q2i` /
   `B2-Q2j` pin that, and closing it is C2's writer-side `exId`, not a looser C3."*
2. **v1.3's self-description denies one of its own in-place edits.** The tail note says *"the PM questions
   Q1–Q9 in §7 are byte-for-byte v1.1"* and *"v1.3 makes the **ONE** exception: §2's C3 and C6 are rewritten
   in place"*; the v1.3 NOTE at `:176` says *"Q1–Q9 still stand exactly as written."* But **§7 Q2 is edited
   in place** — it gains an appended `**[v1.3] The question still stands and is still the PM's…**` paragraph
   (diff hunk `@@ -1093 +1093`). The added text is reading guidance and does not change the question, but a
   brief whose self-description does not match its own bytes is precisely what required change 2 was about.
   Say "TWO exceptions" and name the §7 Q2 addendum.
3. **Three line citations are off, in text B3 is told to follow.** Measured on the tip: §v1.3-B1's Q2
   "post-image `:162–164`" is **`volume.cjs:163–165`** (the `:6` delegate is right); §2 C3's executable-form
   citation "`progression.cjs:232–236`" and §v1.3-B1's "`:228–236`" both **exclude `:237`**, the line that
   actually performs C3's two exact comparisons — the C2→C3 block is **`232–237`**. Also, the C3 executable
   form omits the `at < 0` guard the shipped code carries (`tail = at < 0 ? null : …`); the prose sentence
   after it covers the no-`"via "` case, but the "executable form" as printed is not executable.
4. **`B2-Q2j` pins the wrong half.** It asserts the `exId` flip and not `mgsTouched`. Executed (§5, N1x):
   two colliding-family lifts in **different muscle groups**, one CHEST receipt — base, no-Q2 **and** the
   reviewed `07fba76` all return `mgsTouched = ["chest"]` in both array orders; the **shipped** hunk returns
   `["chest"]` forward and **`["back"]`** reversed. `mgsTouched` is what the `volumePush` week budget and the
   Auto-Pilot tighten veto consume, so the muscle-group attribution is the load-bearing half of that residual
   and it is currently unpinned. Extend the cell to assert `mgsTouched` on every side.
5. **The strongest argument for Q2 is missing, and its absence understates the cost of the alternative.**
   §4's C6 census, executed: of eight receipt shapes, **base disagrees on 5, `f70dd23` (no-Q2) on 6, the
   reviewed `07fba76` on 4, and the shipped `2ada13f` on 3** — and all three remaining are the declared
   double-ownership residuals. **Reverting Q2 does not return to base: it is strictly worse than base on
   C6**, because D3 repairs `_volDeltas` and leaves `structuralMovesThisWeek` on the substring rule, so the
   two readers disagree in *both directions* on r1's own B-1 fixture. The brief says only that leaving the
   line unconverted "ships a WRONG owner where base shipped a missing one". Put the table beside §7 Q2; it is
   the material fact for the ruling the PM is being asked to make.

Nothing here is a frozen-law objection, a golden regeneration, a protected-surface change or an engine
change. The package acceptance bar (artifact, `--full`, private census, receipt, authorized rerun) is **not
met and is not claimed** by the fixer; this review does not grant it.

---

## 1. The rebase preserved f70dd23's engine bytes exactly, and `2ada13f` touches only `volume.cjs`

sha256 of the three product files at every commit on the branch, extracted from git and hashed on disk:

| commit | `plan.cjs` | `progression.cjs` | `volume.cjs` |
|---|---|---|---|
| base `acd3b67` | `1b26c87f…` 19,784 B | `7031838d…` 53,582 B | `c32298e7…` 23,465 B |
| builder `c39d1cb` | `4c6f9817…` 19,853 B | `ad989ed4…` 54,180 B | `73550ef8…` 24,053 B |
| r1 fixer `f70dd23` | **`4c6f9817…`** | **`9adaeecb…`** 54,466 B | `73550ef8…` 24,053 B |
| r2 review `d8e4040` | `4c6f9817…` | `9adaeecb…` | `73550ef8…` |
| r2 fixer `9edefe5` | `4c6f9817…` | `9adaeecb…` | `73550ef8…` |
| **tip `2ada13f`** | **`4c6f9817…`** | **`9adaeecb…`** | `30e4dc21…` 24,898 B |

**`plan.cjs 4c6f9817…` and `progression.cjs 9adaeecb…` are byte-identical from `f70dd23` through the tip —
the git blob ids are the same object (`7c9481cf…` / `673bc8a1…`), which is a stronger statement than equal
content.** `volume.cjs` is the only product file the rebase moved, and it moves only at `2ada13f`. The
withdrawn hunk's `volume.cjs 4a04f4e8…` appears on no commit reachable from the tip.

**Per-commit scope, exactly as the fixer listed it in R2.0:**

```
c39d1cb  M plan.cjs · M progression.cjs · M volume.cjs · A BUILD-REPORT-B2.md · A m4/spec/b2-inherited-carriers.cjs   (5 files)
5a4205c  A reviews/B2-REVIEW-r1.md                                                                                    (1 file, 305 ln)
f70dd23  M progression.cjs · A BRIEF-…-v1.2.md · M BUILD-REPORT-B2.md · A b2-delta-cells.cjs                           (4 files)
d8e4040  A reviews/B2-REVIEW-r2.md                                                                                    (1 file, 336 ln)  <-- PRESENT
9edefe5  A BRIEF-…-v1.3.md · M BUILD-REPORT-B2.md (+330) · M b2-delta-cells.cjs (21 -> 28)                             (3 files)
2ada13f  M volume.cjs                                                                     (1 file, 4 insertions / 1 deletion)
```

**The r2 review file is on the branch, committed BEFORE the new Q2 commit, exactly as R2.0 claims.** The
post-r2 pass touched exactly the four files it lists and no others.

Cumulative `acd3b67…2ada13f` — **10 files, +4,947 / −14**:
`M rebuild/engine/{plan,progression,volume}.cjs` · `A rebuild/lanes/b/BRIEF-…-v1.2.md` ·
`A …-v1.3.md` · `A rebuild/lanes/b/BUILD-REPORT-B2.md` · `A rebuild/lanes/b/b2-delta-cells.cjs` ·
`A rebuild/lanes/b/reviews/B2-REVIEW-r1.md` · `A …-r2.md` · `A rebuild/m4/spec/b2-inherited-carriers.cjs`.
**No path under `rebuild/conform/**`, `tools/**`, `rebuild/engine/test/**`, `.github/**`,
`rebuild/m4/spec/acceptance-*.json` or `package-lock.json` appears in any commit** — no frozen law, witness
file, tool, golden, accepted artifact or lockfile byte moved. `BRIEF-…-v1.1.md` and `BRIEF-…-ERA.md`
pre-exist at `acd3b67` and are untouched, so v1.3's "carried whole from v1.1" claim is checkable and was
checked.

**The revert still drops Q2 whole — executed.** `git revert --no-commit --no-edit 2ada13f` applies cleanly
(`M rebuild/engine/volume.cjs`); `git diff f70dd23 --stat` on the reverted tree lists **only** the four
documentation/cell/review files added after `f70dd23` and **no engine file at all**. Restored with
`revert --abort` + `reset --hard 2ada13f`; status clean.

## 2. v1.2 → v1.3 — every difference, and which need PM re-acceptance

`git diff --no-index` v1.2 → v1.3: **227 insertions, 13 deletions**, 704 → 888 lines. Twelve distinct edits:

| # | edit | class | needs PM re-acceptance? |
|---|---|---|---|
| 1 | H1 `v1.2, POST-REVIEW-r1` → `v1.3, POST-REVIEW-r2`; both keep `(PROPOSED, NOT ACCEPTED)` | editorial | — |
| 2 | NEW §"v1.3 amendment" block, ~167 ln: provenance table, the four changes B1–B4, the final hunk, the residual tables, the register wording, an evidence table | new material, all r2-requested | no (disclosure) |
| 3 | v1.2's heading "READ THIS FIRST, BEFORE THE v1.1 NOTE" → "READ THIS **SECOND**, …" | editorial | — |
| 4 | inserted v1.3 NOTE withdrawing v1.2's "C1–C6 are verbatim" | r2 change 2, required | no |
| 5 | §v1.2-A2 heading gains "— HUNK SUPERSEDED BY §v1.3-B1" + a NOTE block | r2 change 1 | no |
| 6 | the "comparison is against `x.n` only… second, unrequested behaviour change" sentence struck through and WITHDRAWN | r2 change 1 | no |
| 7 | "Still open for the PM" paragraph extended with **R2-1…R2-7** and r2's KEEP recommendation | r2 changes 3 + 4 | no |
| 8 | tail note "carried WHOLE and UNEDITED" → "carried WHOLE" + §2 C3/C6 exception | r2 change 2 | no |
| 9 | §2 preamble "C1–C5 verbatim" → "C1, C2, C4, C5 verbatim; C3 and C6 `[corrected in v1.3]`; B3 must implement the C3 BELOW" | r2 change 2 | **yes — see below** |
| 10 | **§2 C3 rewritten in place** (tail; LAST `" (now "`; two exact comparisons; executable form; "known bound" pointer) | r2 change 2, exactly as asked | **yes** |
| 11 | **§2 C6 rewritten in place** — adds (a) explicit C1→C2→C3 order, (b) **a NEW falsifiable obligation**, (c) a direct instruction to B3 to implement the v1.3 C3, (d) names `volume.cjs:302` and "any writer that still omits `exId`" as off-convention | (a)(c) r2-requested; **(b)(d) are NEW normative content r2 did not request** | **yes** |
| 12 | **§7 Q2 edited in place** — appended `**[v1.3] …**` paragraph | **beyond the C3/C6 wording**; content non-substantive but the file denies it (required change 2 above) | **yes, as a correction** |

**C1, C2, C4, C5 are byte-unchanged, Q1 and Q3–Q9 are byte-unchanged, all fourteen D-hunk sections are
byte-unchanged, and no scope, package-bar, parent or file-ownership statement moved.** The only behaviour
difference between the two briefs is the former-name term, which is r2's required change 1.

**Judgment.** Edits 1–8 ride under the PM's existing acceptance: they withdraw claims that execution proved
wrong, which is what an amendment is for. **Edits 9–12 do not.** `DECISIONS:103` item (3) accepts
**"BRIEF-B2 v1.2"** by name, and `PLAN…:157` makes **§2 the durable convention B3 implements** — C6 itself
hands C1–C5 to B3's D37/D38/D39/D44. Rewriting C3 and C6 changes the contract the PM accepted and the one
B3 inherits; edit 11(b) additionally creates a new normative test that did not exist in any accepted
document **and that the shipped engine fails** (required change 1). The C3 correction is right on the
merits and should be accepted — it aligns the text with code the PM already accepted — but it must be
accepted, not assumed. **B2 needs a DECISIONS line naming `BRIEF-B2 v1.3` (or an explicit PM ruling that
the C3/C6 correction rides under the v1.2 acceptance) before the package can seal.**

## 3. The executed evidence — reproduced, independently, on four sha-pinned engine copies

Four disposable copies of `rebuild/engine` with the three product files replaced from git and sha-verified:
`eng-base` `1b26c87f/7031838d/c32298e7` · `eng-noq2` `4c6f9817/9adaeecb/73550ef8` · `eng-oldq2` (the
**withdrawn** `07fba76`) `…/4a04f4e8` · `eng-q2` `…/30e4dc21`.

**3.1 The 45-law runner** (`ENGINE_MAIN` = this reviewer's own `ed1fa321…`, three product files swapped in
place by `git checkout <ref> --`, sha-verified and restored each time):

| variant | TOTAL line | exit |
|---|---|---|
| BASE `acd3b67` | `45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| no-Q2 `f70dd23` | `45 · 45 · **25** · **88** · **83/104** · 0 · AUDIT RED-FIRST FAIL` | 1 |
| withdrawn `07fba76` | identical to the line above | 1 |
| **tip `2ada13f`** | **identical to the line above** | 1 |

**MOVED LINES: base vs no-Q2 = 15 · base vs +Q2 = 15 · no-Q2 vs +Q2 = 0** (the 46-line stdouts are
**byte-identical**, verified with `Buffer.equals`, not line counting). The fifteen are stdout lines
1–7, 9, 18, 28–32 and 46 — i.e. **D1 D2 D3 D4 D5 D6 D7 D9 D18 D28 D29 D30 D31 D32 + TOTAL**, each moving
`RED-frozen / RED-candidate / mutant-DETECTED` → `RED-frozen / GREEN-candidate / AUDIT-FAIL`, and nothing
else. **14/14, exactly 15 lines move, 0 between the two candidate variants.**

**D18 with Q2 in, verbatim:**
`D18 P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix · RED-frozen / GREEN-candidate / AUDIT-FAIL`
— **GREEN**; the Q2 change sits inside D18's own repair and does not weaken it. The two predicted side
effects reproduce to the number (`89 → 88`, `97/104 → 83/104`).

**3.2 Public direct-call census — this reviewer's own, 572 cells/run, four engines × two matrix days.**
Two state readings (`SEED`, `migrate(null)`) over `programmeVolume`, `muscleVolume`, `volumeImbalance`,
`structuralMovesThisWeek`, `nowModel`, `canonicalizePlan`, `dayType` at eight dates, and per lift over all
16 seeded lifts: `targetsFor`, `progressAnchor`, `loadRungs`, `maxedOut`, `nextLoad`, `prevLoad`,
`deloadLoad`, `snapLoad`, `repsLostOnJump`, `deriveSighting`, `_volDeltas`, `setOneRead`,
`volumeConversion`, `liftTrend`, `liftTrend({asOf})`, `liftCall`, `exActive`.

```
2026-09-03 and 2026-09-07, identical both days:
  base -> +Q2 (shipped)      : 4 of 572     SEED/perLift/fly/deloadLoad        5 -> null
  base -> no-Q2              : the same 4   SEED/perLift/hipthrust/deloadLoad  5 -> null
  no-Q2 -> +Q2 shipped       : 0 of 572     migrated/perLift/fly/deloadLoad    5 -> null
  07fba76 -> +Q2 shipped     : 0 of 572     migrated/perLift/hipthrust/deloadLoad 5 -> null
```
**Exactly the single D6 cell, in four JSON positions, at both matrix days. The Q2 hunk adds no census cell
in either form.** (First attempt returned 0/572 because this reviewer passed the state as `deloadLoad`'s
second argument, which is `pct`, not `s`; the harness was corrected against the engine's real arities and
re-run. Recorded because a census that silently reads `null` on both sides proves nothing — r1's residual
**R-1** is exactly this hazard and it stands.)

**3.3 Protected cell `tools/engine-test.jsx:70`**, reproduced at the second gate's own hard pin
`MEASURED_TEST_NOW=2026-07-29` over `tools/snapshots/2026-08-06-ledger.json`, sha256 re-verified **inside
every probe process** as `62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f` (the brief's pin):

| engine | `nLifts` | `state` | `:70` | `:71` | `:72` | `:76` |
|---|---|---|---|---|---|---|
| base `acd3b67` | 3 | `unknown` | **HOLDS** | holds | holds | holds |
| no-Q2 `f70dd23` | 3 | `unknown` | **HOLDS** | holds | holds | holds |
| withdrawn `07fba76` | 3 | `unknown` | **HOLDS** | holds | holds | holds |
| **tip `2ada13f`** | 3 | `unknown` | **HOLDS** | holds | holds | holds |

**Does not move on any variant.** (`cleanCapable = 0` on all four, so `:76` holds too.)

**3.4 Carrier, witnesses, cells.**
```
node rebuild\m4\spec\b2-inherited-carriers.cjs
  base acd3b67 : B2 INHERITED CARRIERS FAIL at defect-witnesses: ERR_ASSERTION            exit 1  <- not vacuous
  f70dd23      : 5/5 PASS; 17 exact substitutions (9 + 3 + 5 + 0 + 0)                     exit 0
  07fba76      : 5/5 PASS; 17 exact substitutions — identical text                        exit 0
  2ada13f      : 5/5 PASS; 17 exact substitutions — identical text                        exit 0

node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs   exit codes
  base acd3b67 : 0 · 1 · 0 · 0 · 1 · 0 · 1
  f70dd23      : 1 · 1 · 0 · 1 · 1 · 0 · 1
  2ada13f      : 1 · 1 · 0 · 1 · 1 · 0 · 1      <- the same 8 + 1 + 5 flip shape, unchanged by Q2

node rebuild\lanes\b\b2-delta-cells.cjs <engineDir>
  eng-base  : 28/28 HOLD · side BASE      · Q2 n/a          exit 0
  eng-noq2  : 28/28 HOLD · side CANDIDATE · Q2 NOT APPLIED  exit 0
  eng-q2    : 28/28 HOLD · side CANDIDATE · Q2 APPLIED      exit 0
  eng-oldq2 : 25/28      · side CANDIDATE · Q2 APPLIED      exit 1   <- VACUITY CONTROL
              MOVED: B2-Q2f, B2-Q2g, B2-Q2j — i.e. exactly the withdrawn 07fba76 hunk
```
**28/28 on all three shipped sides and 25/28 on the withdrawn hunk: the seven new cells are not vacuous,
and the three that move are precisely the ones encoding required change 1.** r2's noted weakness stands —
`B2-Q2a` self-detects its own side and cannot fail; `B2-Q2b`/`B2-Q2d` are the discriminating pair.

**3.5 `rebuild/conform/run.cjs`** (`cwd=rebuild/conform`, `MEASURED_TEST_NOW=2026-09-03`,
`TZ=America/New_York`, **both** reviewer-built bundles supplied):
```
base / no-Q2 / +Q2 :  SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families   exit 1
stdout 21,924 B, 85 lines, sha256 3a8ebd55eb2a94d4… — IDENTICAL on all three · 0 differing lines · 0-byte stderr on all three
INFO 9 engine-track rig185: W1 PASS, W2 PASS  on all three
```
**Environment (r2's R2-6), not a B2 signal:** with `ENGINE_OLD` supplied this public clone also prints
`BAD 2 port oracle` and `BAD 3 sensitivity` beside `BAD 7 privacy — 0 private lines`. **Every BAD line is
identical on all three sides**, so none is B2's. The claim is "the conform suite is *identical*", never
"clean" — and r2 is right to insist on the distinction.

**3.6 `rebuild/engine/test/second-gate.mjs --candidate`**, run on all three sides:
```
reference : SECOND GATE reference FINAL108: 3072 passed, 0 failed
            vacuity gate — 9 known hit(s), baseline matched, nothing new
            SYNC-LAWS: 18 laws hold across 59 committed seeds
            reference surface: byte-identical to committed baseline (123077 bytes)
driver stdout 1,836 B sha=d80d54d82b3cd9ae · stderr 1,248 B sha=73a32ea293c39cd1 · exit 1
candidate log .tmp/m2-second-gate/candidate-engine-test.stdout.log : 31,489 B, 268 lines, sha=cf407f73586b89ec
ALL THREE SIDES BYTE-IDENTICAL — 0 differing lines in stdout, stderr and the candidate log.
```
The candidate side stops at the **pre-existing D12 cell on every side** —
`FAIL — SNAPSHOT 08-07 ITEM B — the live stepeff fit (-0.079 lb/wk per 1k) exceeds the walking-physics
ceiling (0.059)…`, the site the accepted step-efficacy custody owns. **B2 adds no failure inside the
observable assertions, with or without Q2. The remaining 2,811 stay unobserved — r1's R-2 / Q9, still open,
still not B2's to close.**

## 4. This reviewer's own bites — TWO NEW, and the C6 census they produced

All bites on disposable engine copies; the repo was never modified by a bite.

### R3-A (NEW). A FORMER name that equals another LIVE lift's CURRENT name

Lift `cur` currently named `Bench`; lift `old` currently named `Bench press` with
`renames:[{prevN:"Bench"}]`. One current-week receipt `VOLUME +1 — CHEST via Bench (now 3 sets)`.

```
                               base    no-Q2   07fba76   2ada13f (SHIPPED)
sets, exercises [cur, old]     ["cur"] ["cur"] ["cur"]   ["cur"]
sets, exercises [old, cur]     ["cur"] ["cur"] ["cur"]   ["old"]   <- NEW order-dependence
_volDeltas(cur) / _volDeltas(old)   both [["2026-09-01",1]] on EVERY side
with f.exId = "old"            ["cur"] ["cur"] ["old"]   ["old"]   <- C2 terminal only with Q2
```
This is the `B2-Q2j` class and the brief declares the trade. **What is NOT declared is the consequence the
budget actually consumes.** Re-run with the two lifts in **different muscle groups** (`cur` chest, `old`
back), same CHEST receipt:
```
mgsTouched, [cur, old]   base ["chest"] · no-Q2 ["chest"] · 07fba76 ["chest"] · SHIPPED ["chest"]
mgsTouched, [old, cur]   base ["chest"] · no-Q2 ["chest"] · 07fba76 ["chest"] · SHIPPED ["back"]
```
**A receipt whose own text says CHEST is charged to `back`, decided by `s.exercises` array order, only on
the shipped hunk.** `mgsTouched` feeds the `volumePush` week budget and the Auto-Pilot tighten veto.
`B2-Q2j` pins the `exId` and not this. → **required change 4.**

### R3-B (NEW). A receipt whose tail is exactly `" (now )"` — an empty inner

```
row "VOLUME +1 — CHEST via Press (now )", lifts pa "Press" and pb "Press (now )"
  sets [pa,pb] / [pb,pa]      ["pa"] / ["pb"]   on ALL FOUR sides
  _volDeltas(pa) / (pb)       both credited     on ALL FOUR sides
```
**`" (now )"` is a full delimiter to `lastIndexOf`, so an empty inner is indistinguishable from a legacy
suffix-less row: double-owned and array-order-decided on every side, including base.** A writer emitting a
nullish count produces exactly this. It is a **third instance of the `B2-Q2i` residual class**, unmentioned
and unpinned. Fails-closed neighbours, all sides: `via  (now 3 sets)` (empty owner) → `[]`;
`via (now )` with no owner text → `[]` **unless a lift is literally named `(now )`**, which then owns it;
`via Press (now  sets)` → `["pa"]`; `VOLUME PASSED` → `[]`, still not a move.

### The C6 census — C6 as v1.3 states it, executed over eight receipt shapes

For each shape and each lift: does `_volDeltas(ex, s)` non-empty **equal** `ex.id ∈ structuralMovesThisWeek(s).sets`?

| receipt shape | base | no-Q2 `f70dd23` | withdrawn `07fba76` | **tip `2ada13f`** |
|---|---|---|---|---|
| r1-B1 `via Press incline (now 3 sets)` | ✗ `inc` | **✗ `press` AND `inc`** | ✓ | **✓** |
| r2-R2A renamed lift `via Press heavy (now 3 sets)` | ✓ | ✓ | **✗ `p9` (the regression)** | **✓** |
| nested suffixed `via Press (now heavy) (now light) (now 3 sets)` | ✗ `p2`,`p3` | ✗ `p1`,`p3` | ✓ | **✓** |
| suffix-less legacy `via Press (now heavy)` — `B2-Q2i` | ✗ `p2` | ✗ `p2` | ✗ `p2` | **✗ `p2`** |
| colliding families `via Bench (now 3 sets)` — `B2-Q2j`/R3-A | ✗ `old` | ✗ `old` | ✗ `old` | **✗ `old`** |
| empty inner `via Press (now )` — **R3-B, unpinned** | ✗ `pb` | ✗ `pb` | ✗ `pb` | **✗ `pb`** |
| no space `via Press(now 3 sets)` | ✓ | **✗ `press`** | ✓ | **✓** |
| plain single owner `via Press (now 3 sets)` | ✓ | ✓ | ✓ | **✓** |
| **shapes where the two readers DISAGREE** | **5 / 8** | **6 / 8** | **4 / 8** | **3 / 8** |

Two conclusions, both new:

1. **The shipped hunk removes every *resolvable* C6 disagreement.** The three that remain are exactly the
   double-ownership class — `_volDeltas` returns two legal owners and `.find` can return one. They are not
   closable by any reader, and they are why v1.3's unqualified C6 is false → **required change 1**.
2. **Reverting Q2 is strictly worse than base on C6 — 6 shapes vs 5.** D3 repairs `_volDeltas` and leaves
   `structuralMovesThisWeek` on the substring rule, so on r1's own B-1 fixture the two readers disagree in
   *both* directions (`press` credited by moves only, `inc` by `_volDeltas` only). **The PM's live
   alternative — "carry Q2 to B3 for the cost of one `git revert`" — costs more than one release of
   misattribution: it ships a package whose own two readers contradict each other more often than the code
   it replaces.** Neither r1, r2, the build report nor v1.3 states this → **required change 5.**

### R3-C. The register candidate, re-derived and widened

`B2-REG-1` / `B2-REG-1b` reproduce exactly, on all four sides:
```
2026-08-21 entries [k=2, k=3] -> volumeConversion READING, changedAt 2026-08-25 · liftTrend null · setOneRead LIVE n=9
2026-08-21 entries [k=3, k=2] -> volumeConversion LIVE,    changedAt 2026-08-21 · liftTrend n=4  · setOneRead LIVE n=9
deleting the shadowed entry changes nothing — it was never read
```
Two additions this reviewer measured, identical on all four sides: a **third** same-day entry is equally
invisible (still first-only), and the duplicate does **not** have to sit on the change boundary — a
duplicate on `2026-08-29` moves `changedAt` to `2026-09-01` and flips the verdict to `READING` just the
same. **So the register item is "any same-day duplicate anywhere in the window", not "a duplicate on the
first post-change day".** Worth one clause in the §v1.3-B4 wording; still correctly **not fixed in B2**.

## 5. Residual risks

- **R3-1 … R3-5 — the five required changes above.** All documentation/cell; no engine byte.
- **R2-1, R2-2 — CLOSED.** Verified by execution, not by reading the fixer's claim.
- **R2-3, R2-4, R2-5, R2-6, R2-7 — OPEN and correctly carried.** R3-B adds a third instance to R2-3's class;
  R3-C widens R2-4's statement. `volume.cjs:302` (`_setsMovesSince`) is still off the convention and still
  behind its own 120-row cap — with Q2 in, it is the one reader in this file not on C6.
- **R-1 … R-7 from r1 all stand.** R-1 bit this reviewer directly (§3.2) and is a real hazard, not a note.
- **R3-6 (new, lane-tooling, not B2).** `rebuild/conform/engines/build-engines.mjs` cannot run on Windows
  (`ERR_UNSUPPORTED_ESM_URL_SCHEME` — `import(absolutePath)` without `pathToFileURL`). Every reviewer so far
  has silently worked around it. One-line fix, someone else's file.
- **R3-7 — the package bar is NOT met and is NOT claimed**, correctly: no
  `acceptance-b2-targets-identity-era.json`, no `b2-package.cjs`, no 19-gate identity run, no `--full`, no
  private census, no receipt, no authorized rerun.

## 6. Is B2 READY TO SEAL as a package? — **NO, and it is not supposed to be yet**

The engineering is sound and independently reproduced. Four things stand between this branch and a seal,
and **three of them are not lane B's to do**:

1. **`BRIEF-B2 v1.3` is not accepted.** `DECISIONS:103` item (3) accepts **v1.2** by name, and v1.3 rewrites
   §2 — the durable convention `PLAN…:157` hands to B3. It is still headed `(PROPOSED, NOT ACCEPTED)`.
   **The PM must accept v1.3 by name** (after required changes 1–3 land).
2. **The chain.** `DECISIONS:103` item (1) orders **B-NTC → B1 → B2 → B4 → B3** and rules that "the second
   package re-takes its pre-image shas at the first's accepted head". B2's §0 pre-image (`acd3b67`:
   `1b26c87f / 7031838d / c32298e7`) will be stale the moment B-NTC and B1 land. **B2 must be rebased onto
   B1's accepted head and its pre-image shas, its census baseline and its `b2-delta-cells` BASE expectations
   re-taken there.** `defect-witnesses.cjs` is a shared carrier with B1 (§6.3 of the build report), so that
   rebase is not free.
3. **The parent.** No artifact can be written for B2 until the parent is claimable, which it is not while
   B-NTC and B1 sit ahead of it (r2's P-1, now partially ruled by `:103` item 1 — the *order* is settled,
   the *accepted head* is not yet a thing that exists).
4. **`rebuild/m4/spec/b2-inherited-carriers.cjs` placement** is still unresolved (r2's P-5). `LANES.md` gives
   `rebuild/m4/spec` to the PM; `DECISIONS:103` item (4) permits lane-B files there with the `b<N>-` prefix
   **on lane branches**, with the PM owning the folder at merge — so this is now ruled for the branch and
   becomes a merge-time decision, not a blocker.

**Verdict on readiness: the package is READY FOR THE PM'S Q2 RULING and for its place in the queue, and is
NOT READY TO SEAL.** Once required changes 1–5 land, nothing in B2's own evidence needs redoing before the
rebase — the laws, census, protected cell, carrier, witnesses, conform suite and second gate will all have
to be re-executed at the new head anyway, and this review's numbers are the baseline they must reproduce.

## 7. Every command this reviewer executed

```
git -C <design-pin> fetch origin                                                   -> origin/rebuild/lane-b-b2 = 2ada13f
git -C <review-b2> fetch origin ; checkout --detach origin/rebuild/lane-b-b2       -> 2ada13f, status clean (left 2 commits behind: c4129c9, 07fba76)
git ls-tree / cat-file blob + sha256, 3 files x 6 commits                           -> the table in §1; plan/progression blob ids IDENTICAL f70dd23..tip
git show --stat per commit ; git diff --name-status acd3b67 2ada13f                 -> §1; 10 files, +4947/-14; r2 review file present
git diff --no-index BRIEF v1.2 BRIEF v1.3                                           -> 227+/13-, the twelve edits of §2
git show origin/rebuild/t2-client-core:rebuild/DECISIONS.md                         -> 104 lines; :103 item (3) accepts BRIEF-B2 v1.2 with Q2 INSIDE B2
<r3 build-r3.mjs: private detached worktrees fe516c1 / a0009c3, esbuild 0.28.1>      -> engine-main ed1fa321… 814,747 B (= r1's, byte-for-byte); engine-old 19843fba… ; worktrees removed
node rebuild\conform\v4\run-defect-laws.cjs  x4 in place, sha-verified + restored    -> 45/39/89/97-104 · 45/25/88/83-104 x3; exit 1 x4
<r3 movediff.mjs over the four 46-line stdouts>                                      -> 15 / 15 / 0 / 0 MOVED LINES; the 14 D-ids + TOTAL; noq2 stdout == q2 stdout byte-for-byte
<r3 engines.ps1 -> eng-base / eng-noq2 / eng-oldq2 / eng-q2, sha-pinned>             -> c32298e7 / 73550ef8 / 4a04f4e8 / 30e4dc21
<r3 census.cjs x4 engines x2 matrix days (572 cells) + censusdiff.mjs>               -> 4 cells (the D6 cell x2 states) both days; 0 noq2->q2; 0 oldq2->q2
<r3 probe70.cjs x4 engines at MEASURED_TEST_NOW=2026-07-29>                          -> :70 :71 :72 :76 HOLD x4; snapshot sha 62f9e051… verified in-process
node rebuild\m4\spec\b2-inherited-carriers.cjs  x4 refs in place                     -> FAIL ERR_ASSERTION exit 1 on base; 5/5 + 17 subs exit 0 on the other three
node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs  x3 refs                     -> 0·1·0·0·1·0·1  /  1·1·0·1·1·0·1  /  1·1·0·1·1·0·1
node rebuild\lanes\b\b2-delta-cells.cjs  x4 engines                                  -> 28/28 · 28/28 · 28/28 · 25/28 (B2-Q2f, B2-Q2g, B2-Q2j)
cd rebuild\conform && node run.cjs   (base, no-Q2, +Q2; ENGINE_MAIN + ENGINE_OLD)    -> SUITE INCONSISTENT 99/99/29/70 x3; stdout sha 3a8ebd55… IDENTICAL; 0-byte stderr
node rebuild\engine\test\second-gate.mjs --candidate  (base, no-Q2, +Q2)             -> reference FINAL108 3072/0 x3; stdout/stderr/candidate-log sha IDENTICAL x3; log 268 lines
<r3 probe.cjs / probe2.cjs / probe3.cjs x4 engines>                                   -> §4: R3-A, R3-B, R3-C and the C6 census
git revert --no-commit --no-edit 2ada13f ; git diff f70dd23 --stat ; revert --abort   -> applies clean; reverted tree carries NO engine diff vs f70dd23
git reset --hard 2ada13f ; git status --porcelain                                     -> clean; HEAD 2ada13f
git worktree list | grep earned-r3                                                    -> none (both temp worktrees removed)
```

`ledger/` and `rebuild/conform/private/**` were never opened, never named with values, never hashed, never
quoted. **Protected surfaces, verdict only:** `tools/engine-test.jsx:70` **does not move** on any of the four
engines (§3.3); the second gate's reference surface is **byte-identical to the committed baseline** on all
three sides (§3.6); the public census `setOneRead` / `volumeConversion` / `liftTrend` cells are **identical**
across all four engines at both matrix days (§3.2), which is the only statement this review makes about the
seeded set-one laboratory card. The private LIVE census for D30 remains the PM's own `--full` on the owner's
PC. `rebuild/conform/engines/engine-main.cjs` in the worktree was **not** overwritten (still r1's
`ed1fa321…`); this reviewer's bundles live in scratch. No other worktree was touched.
