# LANE B — B1 GRADING & TIME WINDOW — INDEPENDENT REVIEW r3 (blind, post-ruling)

**Reviewer:** lane-B reviewer r3 (Opus), a sixth agent — not the builder of `ffa4243`, not the r1 reviewer,
not the r1 fixer, not the r2 reviewer, not the r2 fixer of `1ed76d9`, not the r3 fixer of `3da6feb`.
**Under review:** `rebuild/lane-b-b1` @ `3da6feb32dec49ef3b7fa8fa6058eac1716121d3`.
**Base at review time:** `origin/rebuild/t2-client-core` @ `9f68d0afff574cd704388024b43cfcffe0e5af31`
(moved again since §9's `da63053`). `git diff --name-only acd3b67 9f68d0a -- rebuild/engine rebuild/conform`
is **empty**, so every engine and conform coordinate in the report still resolves byte-for-byte and every
base measurement below is taken on that tip.
**Method:** everything asserted here was executed on the owner's PC with harnesses I wrote, in
`work/lane-b/rv3/`, **outside** the worktree, against a frozen bundle I built myself. Two throwaway
worktrees (`rv3/wtbase`, `rv3/wtmut`) were created with `git worktree add --detach`, verified
`git status --porcelain` empty at the end, and removed. The shared `review-b1` worktree was never mutated.
No other worktree was read from or written to.

---

## VERDICT — **ACCEPT WITH CHANGES**

The PM's three acceptance conditions at `rebuild/DECISIONS.md:103` item 2 are **all met, by execution**.
Every headline figure in `BUILD-REPORT-B1.md` §§7–9 that I re-ran reproduced, including the two figures
this pass exists to establish: the eight outside-module D10 call sites, and `D10-2`'s kill.

Three changes. **Two are blocking and neither touches an engine byte**, so neither invalidates any executed
evidence in §9.5. The third is a measured behaviour change whose route is the PM's to choose.

### C-r3-1 — BLOCKING, docs-only. Say "33 of 33" the way the accepted brief says it.

`BUILD-REPORT-B1.md` §9.3 prints `= 33 / 33 caught by an artifact that is IN the repository`. The accepted
contract's own acceptance bar (BRIEF v1.2 §A5) reads: *"33 mutants run · 32 killed by a committed artifact ·
`D10-2` declared unkillable and carried by the package contract · 0 harness errors."* The word *caught* is
doing two different jobs in one line: thirty-two behavioural kills and one declaration-scoped source
assertion. The cell file's own summary line already draws the distinction
(`20 named mutants carried (D10-2 by source/alias assertion, every other by value)`) and §9.2 argues it
openly, so this is a wording correction, not a concealment. **Required:** §9.3's headline, and any sentence
derived from it in the verdict file and the sealed C7 artifact, must carry the distinction in the same
sentence as the count.

**And one number in §9.2 is wrong and should be corrected while that paragraph is open.** §9.2 says that
without `b1-delta-cells.cjs` listed as a required artifact "B1's committed coverage falls from 33/33 to
**1/33**". I measured it: I re-ran all 33 mutants with the cell file removed from the detector set, leaving
only the three carriers and the 45 laws including D22's frames parity. The answer is **12/33 · 21 NOT
CAUGHT** (§4). The direction of §9.2's argument is right and C-r2-2(a) is still exactly as necessary — the
cell file carries twenty-one of the thirty-three kills single-handedly — but the figure quoted is not.

### C-r3-2 — BLOCKING, `rebuild/engine/test/b1-delta-cells.cjs` only (no engine byte).

Add one cell pinning `sleepInfo(...).clean === false` on a **second and third fall-back year** —
`2027-11-07` and `2025-11-02`, the two the accepted BRIEF v1.2 §2 D21 already names as delta cells, which
r1 measured in its own battery (r1 §10) and which no committed artifact holds.
**Measured reason (§4 below):** a `D21-3 hardcode-fallback-date` mutant that special-cases the 2026
fall-back date survives **all 23 cells, 6/6 carriers and all 45 laws including D22's frames parity**. The
brief's own named killer for `D21-3` is *"the two other fall-back years"*; that killer is not in the
repository, so `D21-3`'s committed kill currently depends on which form a future harness picks.

### C-r3-3 — NOT blocking; the PM chooses the route. D27's new **unguarded** `phaseArc(s)`.

`today.cjs:309` `const arc = phaseArc(s);` is called bare from `theOneFix`, which `nowModelUncached:554`
calls bare in turn. `policy.cjs`'s own authors guard exactly this class of call (`_phaseSafe(() =>
dietExit(s), null)` at `:527` and `:545`), and B1's own D23 hunk two lines below uses the same idiom for
`sleepInfo`. Measured (§5, bite 2): for a **stalled cut** whose stored `plan.brk.end` or `plan.brk.start`
is not an ISO string, the pre-B1 base returns advice and the candidate throws
`TypeError: s.split is not a function` out of **both** `theOneFix` and `nowModel` — Today's whole model.
Either wrap it in B1's own `slp9` idiom and add the cell, or record a ledger line routing it to B3, where
ported/legacy rows arrive. `plan.brk` is written by the engine only at `writers.cjs:2216`, so this is a
robustness regression reachable through import/port, not through the engine's own normal write path.

---

## 1. The diff — the r3 pass changed only what it said it changed

```
git diff --numstat 1ed76d9 3da6feb
  374   8  rebuild/engine/test/b1-delta-cells.cjs     14 cells -> 23
  241   0  rebuild/lanes/b/BUILD-REPORT-B1.md         section 9
```

**No engine byte.** Re-read after every harness run in this review, and identical to §9.0:

```
dates.cjs  b51f3f1e0e94c6d7c1ae08d9049db6338e51c70e451674e3a87d94bf190fe067
policy.cjs 4d6c244efa6b34daed02e194dbbd5b7064abcde2d93fd28974a5f2df519187e1
sleep.cjs  77ced98c0b31c085e04da348592e936ce79dc85496a9df3febaef27e77380ffd
today.cjs  f8d0397abd75c02dd570741191124c32e26ab850702607826943d4394fda2e00
```

Cumulative `acd3b67..3da6feb`, whole tree, 10 files:

```
187   0  rebuild/conform/v4/postfix/legacy-b1-carriers.cjs   (NEW file, additions only)
  5   2  rebuild/engine/dates.cjs
  9   6  rebuild/engine/policy.cjs
  7   2  rebuild/engine/sleep.cjs
 26  18  rebuild/engine/today.cjs
844   0  rebuild/engine/test/b1-delta-cells.cjs             (NEW)
596 / 1402 / 364 / 345   the brief v1.2, the build report, reviews r1 and r2
```

Engine = `dates` / `policy` / `sleep` / `today` and nothing else, **5 + 9 + 7 + 26 = 47 added lines**.
`rebuild/m2/AUDIT-REGISTER.md`, `tools/`, `src/`, `.github/`, `rebuild/m4/spec/`, `rebuild/DECISIONS.md`,
`package-lock.json` — all byte-identical `acd3b67..HEAD`.

---

## 2. The PM's three conditions, verified by execution

### (a) Owner semantics are ONLY the verbatim `DECISIONS:60` rules per D-id

I read the ledger line **from Git**, not from the working copy, and from a ref that carries the whole
ledger: `git show origin/rebuild/t2-client-core:rebuild/DECISIONS.md`, line 60 (4 120 chars). I first
checked that line 60 is byte-identical (`-ceq`) to line 60 of `HEAD:rebuild/DECISIONS.md` on this branch —
**it is** — so the branch quotes the same bytes the integration tip carries.

Splitting Batch B on `D<n> APPROVED-FIX ` gives seven rules: `D8, D10, D16, D25, D32, D37, D40`. Four are
B1's. Byte-comparing each full rule (id + `APPROVED-FIX ` + text) against `BRIEF-B1-...-v1.2.md`:

```
D10  verbatim present RAW=True   UNESCAPED=True
D8   verbatim present RAW=True   UNESCAPED=True
D16  verbatim present RAW=True   UNESCAPED=True
D25  verbatim present RAW=False  UNESCAPED=True
```

`D25` is the only one that is not a raw substring, and the whole difference is two markdown escapes: the
brief writes `\"protein: good\"` where the ledger writes `"protein: good"`, because the rule is quoted
inside a quoted sentence. Character-code dump confirms nothing else differs. **Four of four verbatim.**

The other six B1 D-ids claim nothing. All ten `Owner semantics` blocks in the brief, enumerated
mechanically: four quote `DECISIONS.md:60` verbatim; six read `none specific; Batch-A plain FIX` (one adds
"it inherits D8's rule through `cleanAtDate`", which is a statement about the code, not an owner rule).
**No overclaim: no B1 D-id claims a verbatim owner rule it does not have.**

**The 47 added engine lines, scanned for untraceable literals** (my own census, comments stripped):

| literal | occurrences | where | traceable to |
|---|---|---|---|
| `-8` | 1 | `policy.cjs .slice(-8)` | pre-image, unchanged by the hunk |
| `2` | 1 | `today.cjs .slice(0, 2)` | pre-image `beats` |
| `7` | 2 | `weeksBetween`'s `/ 7`, `k9 < 7` | both pre-image; D10 moves `Math.round`, not the 7 |
| `10` | 1 | `arc.weeks >= 10` | pre-image `weekDay().wk >= 10` |
| `0` | 5 | `.length > 0`, `k9 = 0`, `k9 === 0`, `slice(0,2)` | pre-image |
| `-1` | 2 | `plusDays(iso, -1)` (D8), `plusDays(…, -1)` (D24) | D8's own words "last night"; register FIX `:260` |
| `1` | 8 | `plusDays(dueISO, 1)` | **D16 verbatim**: "or, failing that, the next day (one grace date)" |
| | | `plusDays(brkS.end, 1)`, `daysSince + 1` | register FIX `:134` "one-based day numbering and next-day resumption wording" |
| | | `plusDays(today9, 1)` | register FIX `:144` "Advance to the next calendar date" |
| | | `proHitN >= 1` | **D25 verbatim**: "at least one successful day … before the one-miss allowance applies" |
| | | `n[n.length - 1]`, `proRows.length - 1` | pre-image |

Every string literal on an added line is carried from the pre-image (`"PROTEIN"`, `"good"`, `"caution"`,
`"UPPER BODY"`, `"LOWER BODY"`, `"TODAY"`, `"TOMORROW"`, `" · "`, `" — beat "`, `"·"`, `"cut"`, `"U"`,
`"L"`, `"number"`, and D19's `note:` sentence, which the diff leaves byte-identical). I re-read
`rebuild/m2/AUDIT-REGISTER.md:134, 144, 240, 250, 260, 270, 280, 354` on this tree and each FIX line says
what the brief quotes it as saying; the register is byte-unchanged on this branch.

**There is no threshold, interval, band name or sentence in B1 that the owner, the register or the frozen
source did not already set.** Condition (a): **MET.**

### (b) No law was edited to pass

```
git diff --stat acd3b67 HEAD -- rebuild/conform/v4/laws-*        (EMPTY)
git diff --numstat acd3b67 HEAD -- rebuild/conform
  187  0  rebuild/conform/v4/postfix/legacy-b1-carriers.cjs      <- a NEW file, additions only
```

All thirteen `laws-*.cjs`, `helpers.cjs`, `run-defect-laws.cjs` and `postfix/run.cjs` are untouched; no
golden, witness or tool byte moved anywhere in the tree. The ten rows move for the engine's behaviour
alone. Condition (b): **MET.**

### (c) The eight D10 call sites outside B1's modules, with before/after values

I re-derived the list myself rather than reading it: a tree-wide search for `weeksBetween` across
`rebuild/**` and `src/**`, discarding the `dates.cjs` declaration, the eleven
`const weeksBetween = (...args) => E.weeksBetween(...args)` delegates, the laws, the helpers, the test
files and `src/app.jsx`. What is left is exactly eight **call sites**, in four modules B1 edits no byte of:

```
energy.cjs:84    bfEst                  energy.cjs:228   currentRate
sleep.cjs:634    labAnalytics cone      sleep.cjs:807    labAnalytics lift slope
migrate.cjs:301  reconcileTrendChain    migrate.cjs:1203 patchV59
writers.cjs:1587 runAdaptive (x2)       writers.cjs:2432 undoRead
```

That is the PM's own list (`energy/sleep/migrate/writers`) and the report's §9.1 list, arrived at
independently. `sleep.cjs` is a B1 file but neither `:634` nor `:807` is on a line B1 touches (B1's
`sleep.cjs` hunks are at `:22` and `:1903–1908`).

**Each has its own cell**, named for its coordinate, asserting the AFTER value with a failure message that
names the BEFORE value — cells 15–22 of 23, all present and all holding on the candidate.

**Two re-measured independently**, with my own probe (`rv3/probe-r3.js`), which does not use the builder's
harness, the cell file, or the engine's `plusDays`:

| site | BASE (`9f68d0a`) | CANDIDATE (`3da6feb`) | report §9.1 says |
|---|---|---|---|
| `writers.cjs:1587` `runAdaptive` weekly, read dated the NEXT Monday | `[{"wk":"2026-03-02","trend":180}]` | `[]` | same |
| `writers.cjs:1587` control, read inside the week | `[{"wk":"2026-03-02","trend":180}]` | `[{"wk":"2026-03-02","trend":180}]` | same |
| `sleep.cjs:807` regression x-axis | `[0, 0.994047619047619, 1.994047619047619]` | `[0, 1, 2]` | same |
| `sleep.cjs:807` reps/wk slope | `2.005964191091732` → printed `+2.01` | `2` → printed `+2.00` | same |
| `weeksBetween('2026-03-02','2026-03-09')` | `0.994047619047619` | `1` | same |

Both match the cells' declared BEFORE/AFTER to the last digit. Condition (c): **MET.**

---

## 3. The committed-artifact evidence, re-run

**Frozen bundle**, built by me from the repo's own recipe (`legacy-gates.publicReferences` with
`manifest.baseline.buildSources`, `FROZEN-BUILD-SOURCE-PIN` checked inside):

```
main  813 676 B  sha256 3ae1e0572657ff3b3bb7ccecbc7a7883ea44c9437c4b07f8d36c72be3c12f892
old   792 786 B  sha256 5c90a793de272cd59b733f765507b6c8c62f87e64e620b1630f00d93058f3cc9
```

(A different byte count and hash from the builder's, r1's and r2's — esbuild embeds the entry path, which
`build-engines.mjs` documents. Equivalence is behavioural, and it is demonstrated by the runs below
reproducing the base tip's terminal lines exactly.)

**The 45 v4 laws — exactly 10 rows move, all ten RED-frozen / GREEN-candidate, and `D22` is not one.**

```
[cand 3da6feb] TOTAL 45 laws · 45 RED-frozen · 29 RED-candidate · 89 GREEN repair controls · 87/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
[base 9f68d0a] TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
ROWS MOVED 10 · UNCHANGED 35 · moved ids: D8, D10, D16, D17, D19, D21, D23, D24, D25, D27
each moved row: RED-frozen / GREEN-candidate / AUDIT-FAIL   (base: RED-frozen / RED-candidate / mutant-DETECTED)
```

**D22 parity is TRUE**, and I say so from the runner's own logic rather than from a report: the runner
prints `mutant-DETECTED` only when `ok = f.ok && c.ok && parity`, where `parity` is
`isDeepStrictEqual(f.raw.detail, c.raw.detail) && isDeepStrictEqual(f.frames, c.frames)`. D22 reads
`RED-frozen / RED-candidate / mutant-DETECTED` on **both** trees, byte-identical, and D22 does not appear
in the candidate run's stderr `AUDIT-FAIL` JSON (the seventeen that do are
D8, D10, D12, D16, D17, D19, D21, D23, D24, D25, D27, D33, D34, D35, D41, D43, D45 — the ten repaired rows
plus the seven pre-existing ones, identical on base). So the frames comparison held.

**The B1 carrier — 6/6 PASS, witness files byte-identical to their pins.**

```
PACKAGE_ID M2-B1-GRADING-TIME-WINDOW · COVERS witnesses-1, witnesses-2, witnesses-3
  defect-witnesses    disk 557c12e72690c397  git@614e2031 557c12e72690c397  pin 557c12e72690c397  MATCH=true
  defect-witnesses-2  disk 833db0431e656f86  git@614e2031 833db0431e656f86  pin 833db0431e656f86  MATCH=true
  defect-witnesses-3  disk f5169bebd527ac13  git@614e2031 f5169bebd527ac13  pin f5169bebd527ac13  MATCH=true
PASS defect-witnesses   [native]/[frozen] reproduced=10 tail="DEFECT WITNESSES: 10/10"   edits=3 carrierHash=c2ea4423ec9b014a
PASS defect-witnesses-2 [native]/[frozen] reproduced=11 tail="DEFECT WITNESSES 2: 11/11" edits=8 carrierHash=a766bfe0abffc05d
PASS defect-witnesses-3 [native]/[frozen] reproduced=5  tail="DEFECT WITNESSES 3: 5/5"   edits=9 carrierHash=de59fa01b12e73ef
R3 B1 CARRIER: 6/6 PASS
```

`3 + 8 + 9 = 20` in-memory substitutions, of which **18 are B1's** — `defect-witnesses-2` inherits two
accepted D12 successors from the STEP-EFFICACY parent. The three `carrierHash` values are identical to
§9.5's. `git status --porcelain` empty afterwards; the four engine sha256s re-read and unchanged.

**The cells — 23/23 on the candidate, 0/23 on base.**

```
candidate : exit=0   B1 DELTA CELLS: 23/23 hold; 20 named mutants carried (D10-2 by source/alias
                     assertion, every other by value); 8 D10 call sites outside B1's modules enumerated
base      : exit=1   B1 DELTA CELLS: 0/23 hold
```

I ran the base case by checking the candidate's cell file into a throwaway worktree at
`origin/rebuild/t2-client-core` and running it there. Every one of the 23 fails; the site cells fail with
their declared BEFORE value printed beside what base actually produced (e.g. `writers.cjs:2432 … BEFORE
= [{"wk":"2026-03-02","trend":181}] | this run produced = [{"wk":"2026-03-02","trend":181}]`), which is
what makes those cells readable as an enumeration rather than only as a failure. The source/alias cell
fails on base for the honest reason the report states — `dates.cjs must declare 'plusDays' at the top
level`, a missing declaration, not a behavioural claim.

**Conform suite and the second gate — identical to base in all four streams.**

```
conform     cand exit=1  82 non-blank stdout, 0 stderr
            base exit=1  82 non-blank stdout, 0 stderr
            DIFFERING = 0 (stdout), 0 (stderr), after normalising the worktree root — the only text that
            differs is the absolute path in the `engine artifacts present` diagnostic
            assertion lines: cand 33, base 33, DIFFERING 0 · tally both {"BAD":6,"OK":26,"INFO":1}
            terminal, both trees: SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first
            against absent families · 70 GREEN against present families
second gate cand 6 stdout / 3 stderr · base 6 stdout / 3 stderr · DIFFERING 0 in both
            reference half GREEN on both: FINAL108 3072/0 · vacuity 9 known · SYNC-LAWS 18 laws /
            59 seeds · surface byte-identical, 123 077 bytes
            terminal, both trees: FAIL second gate candidate engine-test: exit=1 /
            FAILED ASSERTION tools/engine-test.jsx:106 / SECOND GATE candidate: FAIL
```

The second gate's failure is the pre-existing D12 abort at `tools/engine-test.jsx:106`, identical on base
and already `coverage.covered` byChild `second-gate` in the accepted parent artifact. **B1 moves nothing
in either gate.** My non-blank line counts (82 / 6+3) differ from §9.5's (79 / 6+3) because I counted with
a different spawner; both are internally consistent and both report zero differing lines, which is the
claim that matters. The path-spelling caveat is real and is the only normalisation I applied.

---

## 4. The mutant matrix — my own 33, against COMMITTED ARTIFACTS ONLY

I transcribed all 33 mutants myself from BRIEF v1.2 §2's "Source mutants" prose plus §A1's `D21-4`,
against this tree's bytes, as exact **single-occurrence** string edits. I wrote the table before reading
the builder's. Detectors, and nothing else:

1. `rebuild/engine/test/b1-delta-cells.cjs` (23 cells), run as its own process;
2. the three B1 carriers through `legacy-b1-carriers.runCarrier`, 3 files x 2 Date modes;
3. the 45 v4 laws — any of the ten moved rows losing `GREEN-candidate`, or `D22` losing `mutant-DETECTED`.

No scratch battery. Applied in a throwaway worktree at `3da6feb`; every file restored between runs and in
a process-exit handler; `git status --porcelain` empty at the end.

```
R3 MUTANTS 33 · CAUGHT 32 · NOT CAUGHT 1 · HARNESS 0
  survivor: D21-3 hardcode-fallback-date
```

All 33 anchors resolved exactly once (`HARNESS 0`). Thirty of the thirty-two kills are by a cell; two are
by the carrier (`D19-1 shift-daysSince-in-dietBreakState` and `D23-1 default-slp-to-empty-object`, both
taking `legacy-b1-carriers` from 6/6 to **4/6**, which independently confirms §9.3's `D23-1` finding and
the r2 note that `defect-witnesses-3` is load-bearing, not merely carried). No mutant needed the law column.

**How much of that is the cell file alone.** I re-ran all 33 with the cell file removed from the detector
set — carriers and laws only — to put a measured number on C-r2-2(a):

```
R3 MUTANTS WITHOUT THE CELL FILE: 33 · CAUGHT 12 · NOT CAUGHT 21
  by carrier (10): D10-3, D8-1, D21-1, D21-2, D19-1, D19-3, D17-1, D24-2, D27-1, D23-1
  by law     (2) : D16-2 (law D16) · D21-4 (D22 FRAMES PARITY — r1's finding, now a standing detector)
  survivors  (21): D10-1, D10-2, D8-2, D8-3, D21-3, D19-2, D16-1, D16-3, D16-4, D17-2, D17-3,
                   D24-1, D24-3, D25-1, D25-2, D25-3, D27-2, D27-3, D23-2, D23-3, D23-4
```

So **`rebuild/engine/test/b1-delta-cells.cjs` carries twenty-one of the thirty-three kills single-handedly**,
which is the measured case for C-r2-2(a), and it is also why §9.2's "1/33" figure needs the correction in
C-r3-1. Worth noting for the standing acceptance bar: `D21-4` is caught by **D22's frames parity and by
nothing else** in that configuration — r1's residual risk 1 ("require a full 45-row diff including frames
parity, not raw statuses") is not a hypothetical, it is load-bearing on this branch.

### `D10-2` — and the source/alias cell: positive assertion, or a forbidden source-pin refusal?

**`D10-2` is caught, by the source/alias cell and by nothing else.** My cell-by-cell result is identical
to the builder's (`cells 22/23`, the single failing cell being
`B1-D10-weeksBetween-is-calendar-based-by-source-and-is-the-primitives-only-definition`).

**My judgement: it is a positive assertion, not the refusal `BRIEF-IMPORT-GUARDS.md:89` forbids — but it
is not a behavioural kill either, and the package must keep saying both.** Reasoning, with the measurement
that decides it:

* `:89` reads *"Mutate bounded declarations in disposable candidate copies before fresh-process load.
  Require the named behavioral assertion to fail; **source-pin refusal**, syntax error, missing target or
  timeout earns no kill."* The thing it forbids is a **gate refusing** — a hash pin over a file's bytes
  that fails before anything runs, and which therefore "kills" every mutant indiscriminately, including
  inert and even correctness-preserving ones. That is not what happens here: nothing refuses, the cell
  runs, and it discriminates.
* **Measured discrimination.** Across all 33 mutants in my own run, that cell fired on exactly **three** —
  `D10-1`, `D10-2`, `D10-3`, the three that edit `dates.cjs` — and held under the other **thirty**,
  including the seven other mutants that edit `sleep.cjs`/`policy.cjs`/`today.cjs` date arithmetic. A byte
  pin would have fired on all 33. Declaration-scoped is a real distinction, and it is measured, not argued.
* Its load-bearing clauses are positive: `weeksBetween` must `Math.round(` the DAY count, must read both
  endpoints through `mk(` exactly twice, must divide by 7; `mk` must build `new Date(y, m - 1, d)`;
  `plusDays` must step `setDate`/`getDate`; the export set must be exactly the seven frozen names plus
  `plusDays`; and every consumer must alias the one definition. Only the *supporting* clause is negative
  (a forbid-list inside one declaration).
* **But** `:89` asks for *the named **behavioral** assertion* to fail, and this one is not behavioural. A
  semantics-preserving refactor of `weeksBetween` would fail it. So the honest reading is the accepted
  brief's own: 32 behavioural kills, plus `D10-2` declared behaviourally unkillable (five independent
  confirmations, now six — I measured no movement in any cell, carrier or law row from `D10-2` either) and
  carried by a declaration-scoped source assertion **because the contract requires one**, per BRIEF v1.2
  §A4 item 5 and §A5. That is C-r3-1.

One citation slip, non-blocking: BRIEF v1.2 §A4 item 5 cites `BRIEF-IMPORT-GUARDS.md:88`; the
"source-pin refusal earns no kill" sentence is at **`:89`** (`:88` is the strengthened-theme-claims
paragraph). The cell file and §9.2 cite `:89` correctly.

### The survivor — and why it is C-r3-2

My `D21-3` is the literal reading of the mutant's name: special-case the known fall-back date.

```js
const tomorrow = today9 === "2026-11-01" ? "2026-11-02" : isoOf(new Date(todayStart().getTime() + DAY));
```

Result: **cells 23/23 · carrier 6/6 · 10 law rows GREEN-candidate · D22 parity intact.** It survives
everything the repository holds.

The builder's transcription is a different mutation — *use today whenever the day is a DST transition* —
and that one the C2 cell does catch. Neither of us is wrong about the code; the point is that **the kill
is transcription-dependent**, and the accepted brief itself says what the real killer is: §2 D21's delta
cells name `2027-11-07` and `2025-11-02` alongside `2026-11-01`, and §2 D21's mutant (3) is to be
*"killed by requiring the ordinary and spring-forward controls byte-identical **and the two other
fall-back years to pass**"*. r1 measured `2027-11-07` in its own battery (r1 §10). **No committed artifact
holds either.** One cell closes it, in lane B's own file, with no engine byte — hence C-r3-2 is blocking
but cheap.

### One fragile kill, recorded rather than smoothed over

`D24-2 drop-the-empty-ledger-guard` is caught, but by **`B1-D27-an-active-diet-break-is-not-a-cut` and
`B1-D27-long-cut-is-the-committed-phases-own-age-not-the-programme-week`** — not by any D24 cell. It is
caught only because the D27 `stalled` fixture happens to carry an empty `dailyLogs`, so dropping the guard
makes yesterday owed and pushes `theOneFix` down to rung `logging`. The brief names the killer as "the
empty-`dailyLogs` control", which lives in D24's *Must NOT change* list and is not committed anywhere. If
B2 or B3 ever gives that fixture a `dailyLogs` row, `D24-2` goes uncaught silently. Not blocking — the
mutant is caught today — but it belongs in the verdict file's risk list, and one line in the D24 cell
(`pro([])`-style empty-ledger control) would make it robust.

---

## 5. TWO NEW BITES OF MY OWN (on neither the r1 nor the r2 list)

### Bite 1 — D21's committed kill depends on which mutant you write

Above, §4. r1's bite #1 was thirteen single-hunk reverts; r1's bite #2 was DST-boundary probes in its own
battery; r2's two bites were `N1e` (a row dated tomorrow) and the fall-back-eve short night. **None of them
asked whether the committed artifacts pin the fall-back behaviour on more than one year.** They do not, and
the accepted brief says they should. Measured survivor above.

### Bite 2 — D27's hunk makes `theOneFix` and `nowModel` throw where the frozen engine returned

B1's D27 hunk introduces `const arc = phaseArc(s);` at `today.cjs:309`, **unguarded**, inside `theOneFix`,
which `nowModelUncached:554` calls **unguarded** as `const fix = (deps && deps.fix) || theOneFix(s);`.
Before B1 that rung read `weekDay()`, which cannot throw. `phaseArc` can: it calls `dietBreakState(s)`
bare, and `dietBreakState` calls `daysBetween` -> `mk(brk.end)` -> `.split(...)` on whatever is stored.

Measured on a **stalled cut** fixture (flat trend, three 8 h nights, one read — the state that reaches
rungs 4/5), base `9f68d0a` vs candidate `3da6feb`:

| stored state | BASE `theOneFix` / `nowModel` | CANDIDATE `theOneFix` / `nowModel` |
|---|---|---|
| control, well-formed `plan` | `rung=break` / `move.kind=fix` | `rung=break` / `move.kind=fix` (identical) |
| `plan.brk.end` is a **number** | `rung=break` / `move.kind=fix` | **THROW** `TypeError: s.split is not a function` / **THROW** |
| `plan.brk.end` is an **object** | `rung=break` / `move.kind=fix` | **THROW** / **THROW** |
| `plan.brk.start` is a **number** | `rung=break` / `move.kind=fix` | **THROW** / **THROW** |

`nowModel` is Today's whole model — the S2 screen. **No committed artifact catches this**: no law, carrier
or cell exercises a malformed `plan.brk` on a state that reaches rungs 4/5, and I verified the 45-law run,
the carriers and all 23 cells are unmoved by it.

It is a *robustness* regression, not a live one: the engine writes `plan.brk` at exactly one place
(`writers.cjs:2216`, from a proposal's `apply.start/end`), so well-formed engine-written state never
reaches it. The realistic route is a ported or imported row — which is C2/S3 and B3 territory. The brief's
"Must NOT change (executed, identical on both engines)" discipline is nevertheless what this violates, and
the remedy is the idiom B1 itself uses two lines below for `sleepInfo`. Hence C-r3-3, with the route left
to the PM.

**Carried forward, not new:** r2's §8 bite 1 recommended adding the `N1e` case (last night 2 h plus a row
dated TOMORROW) to `b1-delta-cells.cjs` "next". The r3 pass added nine cells and not that one. I
re-measured it on the candidate: `sleepInfo.clean = false`, `recoveryIndex` GREEN/80 — the two-anchor form
handles it correctly. So this is a coverage gap, not a defect, and r2 raised it as advice rather than as a
required change. Worth folding into C-r3-2's cell while that file is open.

---

## 6. THE OPEN PM ITEM FROM r2 — UNKNOWN vs GREEN/100, restated in one paragraph

> **For the PM.** The owner's words at `DECISIONS.md:60` are: *"D8 APPROVED-FIX — when last night's sleep
> is missing, recovery is **UNKNOWN** and no sleep restriction is applied today; every other recovery check
> still applies (not carry-forward of the last logged night)."* B1 implements clauses two and three
> exactly and cannot implement clause one, because `recoveryIndex` has only two outputs in this region and
> neither of them means "unknown". Measured by me on four cells, base `9f68d0a` vs candidate `3da6feb`,
> `today = 2026-09-03`: **(A)** last night 8 h — `GREEN/100, factors []` on both, correct; **(B)** last
> night 2 h — `WATCH/70, ["sleep reset — 0 of 3 clean nights"]` on both, correct and preserved; **(C)** the
> newest night is three days old at 2 h — base `WATCH/70` → candidate **`GREEN/100`, zero factors**, which
> is exactly the no-carry-forward the owner ruled; **(D/E)** the newest night is three days old at 8 h, and
> an empty sleep history — `GREEN/100, zero factors` on **both** trees, unchanged by B1. So the gap is
> pre-existing (cell E is identical on base) but B1 **widens** it: after D8 the stale-short-night case
> joins the missing-history case in presenting as a positive claim of perfect recovery on a day the engine
> knows nothing about the athlete's sleep. The question is a product ruling, not a code review: **may "no
> sleep restriction" present to the athlete as GREEN/100, or must it present as UNKNOWN?** If UNKNOWN, that
> is a third recovery state — a new band, new prose, and new surfaces — which is beyond B1's ten accepted
> hunks, and which B1 could not invent without breaching the PM's own first condition, since no third band
> appears anywhere in D8's verbatim rule. If GREEN/100 is acceptable for now, one ledger line says so and
> it stops being re-raised by every reviewer.

**Is it a B1 blocker? r2 said no. I agree — no**, for three executed reasons. (1) Cell E is byte-identical
on base and candidate, so B1 is not the origin of the gap. (2) The only cell B1 moves, C, moves in exactly
the direction the owner ruled — the alternative is the carry-forward he forbade. (3) The remedy is a new
band that D8's verbatim rule does not contain, and inventing one would itself violate the PM's condition
that owner semantics be **only** the verbatim `DECISIONS:60` rules. **One amendment to r2's framing:**
because B1 widens the class, the ruling should land **before S2 daily use**, and B1's verdict file should
name the widening as an anticipated product-surface consequence rather than leaving it to the census to
discover. That is a sentence, not a change.

---

## 7. READY TO SEAL as the SECOND package? — what I checked, on the refs

**Lane B's half is ready once C-r3-1 and C-r3-2 land**, and both are zero-engine-byte, so neither
invalidates the 45-law diff, the carrier, the cells, the conform/second-gate comparison or the mutant
matrix above. **The seal itself is blocked on four things that are not lane B's**, each verified on the
actual refs rather than inferred:

1. **The C7 acceptance artifact does not exist anywhere.**
   `git ls-tree -r origin/rebuild/lane-b-b1 | origin/rebuild/lane-b-tooling | origin/rebuild/t2-client-core
   | origin/rebuild/lane-b-ntc -- rebuild/m4/spec` returns **no `b1-` prefixed path on any of them**. Until
   `rebuild/m4/spec/acceptance-b1-grading-time-window.json` (+ its runner and
   `review-b1-grading-time-window.json`) exists in the PM's directory, no gate can print PASS for B1.

2. **`rebuild/lanes/b/tooling/packages/B1.json` is stale against the ruling that accepted B1's brief.**
   It exists on `origin/rebuild/lane-b-tooling`, and reads:
   `status "PROPOSED"` · `brief.file "…-v1.1.md"` with `brief.acceptedLedgerLine: null` — but the PM
   accepted **v1.2** at `DECISIONS:103` item 2, so the file and its sha256 must be re-pinned to v1.2 and
   the line set to 103 · `parent.decided: false`, `parent.chosen: null`, with NATIVE-CARRIERS
   (`e940359b…`, receipt line 104) still offered as an option — but `DECISIONS:103` item 1 and `:108` (e)
   have since settled the chain, so `chosen` must become B-NTC's accepted artifact · **no
   `requiredArtifacts` entry**, so **C-r2-2(a) is not yet discharged**: `rebuild/engine/test/b1-delta-cells.cjs`
   must be listed REQUIRED. I measured what it is worth rather than quoting it: without that file the
   committed detectors catch **12 of 33** and twenty-one mutants survive (§4), including every `D25`, both
   `D24` predicate cases, three of four `D16`s and three of four `D23`s.
   The one standing rule already satisfied: **`coverage.moves` is `{}`** (tooling X1). ✓

3. **B-NTC is not accepted yet.** `origin/rebuild/lane-b-ntc` is at `a701ac5` ("B-NTC fix r1" after an
   ACCEPT-WITH-CHANGES review at `afb3bf4`), and `DECISIONS.md` carries no B-NTC acceptance or receipt
   line. `DECISIONS:103` item 1 puts B-NTC first and says the second package **re-takes its pre-image shas
   at the first's accepted head**; that head does not exist yet, so B1 cannot re-take against it today.

4. **Favourable, and cheaper than §9.6 anticipated: B-NTC moves nothing B1 owns.**
   `git diff --numstat $(git merge-base lane-b-ntc t2-client-core) origin/rebuild/lane-b-ntc` is nine files —
   the brief, the build report, the review, `packages/B-NTC.json`, a `gym-host` patch file,
   `rebuild/m3/w6/host/{workout-host.mjs,test/journey.test.mjs}`, and
   `rebuild/m4/workout/native-trend-context{,.test}.cjs`. **Nothing under `rebuild/engine` and nothing under
   `rebuild/conform/v4`**, and the intersection with B1's five files is empty. So when B-NTC merges, **B1's
   engine pre-image sha256s do not move**; only `parent.sha256` / `parent.receiptLedgerLine` /
   `parent.receiptBase` / `sourceBase` are re-taken at B-NTC's accepted head, and §9.5 need not be re-run
   for the rebase. (This should be re-checked at B-NTC's *accepted* head, not at `a701ac5`.)

The rest of §9.6's prerequisite list — the `--ci` public-evidence run both OS, the `--full`-without-the-
private-fixture BLOCKED line, the lane's own FULL on the owner's PC verdict-only, the receipt → AUTHORIZED
rerun chain, and the one residual `# pass 19` CI item — is correctly enumerated and correctly attributed;
`DECISIONS:105` really does close the rest of the batched re-seal, and `.github/` is untouched here.

---

## 8. RESIDUAL RISKS

1. **`D21`'s committed fall-back coverage is one year deep** (C-r3-2). Until the second and third
   fall-back years are cells, a mutant that special-cases 2026 passes the whole repository.
2. **`D24-2`'s only detectors are two D27 cells** whose fixture happens to have an empty `dailyLogs` (§4).
   Incidental, and it breaks silently if B2/B3 touches that fixture.
3. **`theOneFix`/`nowModel` inherit `phaseArc`'s failure modes** (C-r3-3), unguarded, with no committed
   detector. Reachable through import/port, not through the engine's own writes.
4. **`D10-2` has no behavioural kill and never will.** Six independent confirmations now. The package's
   coverage of that mutant is only as strong as the C7 artifact's willingness to list
   `b1-delta-cells.cjs` REQUIRED and carry the assertion — C-r2-2, still the PM's.
5. **`--full`, the private census and every browser/host surface are unexecuted here**, by design
   (`DECISIONS:92`, `:93` C4). `D16` is B1's only LIVE-TRIGGERED defect; a census change on any of the
   other nine is a RED stop only the owner's PC can see.
6. **Neither gate can say PASS on this branch**: `conform/run.cjs` and `second-gate --candidate` fail
   pre-existingly and **identically on base**, and B1's own profile does not exist. Acceptance rests on
   the v4 runner, the carriers, the cells, and the PM's own FULL.
7. **`sleepInfo().clean` has five consumers**, two of them `writers.cjs` goldens owned by B3 (r2's risk 5).
   Nothing here re-derived a golden; budget it with D10's reach into the eight sites of §2(c).
8. **The UNKNOWN/GREEN-100 ruling is still open** (§6) and B1 widens the class it covers.
9. **`2026-08-12` remains a derivation**: the D27-3 cell is correctly expressed as `START + 63`, and I
   re-confirmed `arc.weeks = 9` / `weekDay().wk = 10` there by execution.

---

## 9. EVERY COMMAND I RAN, AND ITS OUTCOME

| command | outcome |
|---|---|
| `git -C review-b1 fetch origin && checkout --detach origin/rebuild/lane-b-b1` | `3da6feb`, tree clean |
| `git diff --numstat 1ed76d9 3da6feb` / `acd3b67 3da6feb` / scoped `--name-only` x12 | §1 — 2 files / 10 files; every frozen scope empty; laws diff EMPTY |
| `rv3/s04` — `DECISIONS.md:60` from Git on two refs, `-ceq` compare | byte-identical across `HEAD` and `origin/rebuild/t2-client-core` |
| `rv3/s08b` — the four Batch-B rules byte-compared to brief v1.2 | D8/D10/D16 RAW true; D25 true after un-escaping `\"`; 10 `Owner semantics` blocks enumerated |
| `rv3/lits-r3.js` — every literal on the 47 added engine lines | numerics `{-8,-1,0,1,2,7,10}`, strings all pre-image; table in §2(a) |
| `rv3/s10` — tree-wide `weeksBetween` search, delegates/laws/tests discarded | exactly **8** call sites, in `energy`/`sleep`/`migrate`/`writers` |
| `rv3/probe-r3.js` on `wtbase` and on `review-b1` | `writers.cjs:1587` `[{2026-03-02,180}]` → `[]`; `sleep.cjs:807` slope `2.005964191091732` → `2` (`+2.01` → `+2.00`) |
| `rv3/build-frozen-r3.js` (`legacy-gates.publicReferences`, source pins checked) | main 813 676 B `3ae1e057…`; old 792 786 B `5c90a793…` |
| `run-defect-laws.cjs` on candidate and on `wtbase`, row-by-row diff | 45/29/89/87/104/0 vs 45/39/89/97/104/0 · **10 rows moved, 35 identical, all ten GREEN-candidate** · D22 `mutant-DETECTED` on both, absent from the stderr AUDIT-FAIL set |
| `rv3/run-carrier-r3.js` — 3 files x 2 Date modes, pins read from disk AND from Git | **6/6 PASS**, all three pins MATCH, 20 edits (18 B1 + 2 inherited D12) |
| `b1-delta-cells.cjs` on candidate; same file copied into `wtbase` | **23/23 exit 0** · **0/23 exit 1**, every site cell printing its BEFORE |
| `rv3/mutants-r3.js` + `run-mutants-r3.js` — my own 33, committed detectors only | **33 · CAUGHT 32 · NOT CAUGHT 1 · HARNESS 0**; survivor `D21-3` (§4) |
| — the source/alias cell's fire pattern across all 33 | fires on `D10-1`, `D10-2`, `D10-3` only; holds under the other 30 |
| `rv3/run-nocells-r3.js` — the same 33 with the cell file removed from the detector set | **33 · CAUGHT 12 · NOT CAUGHT 21** (10 by carrier, 2 by law, one of those two via D22 frames parity) |
| `rv3/cap-r3.js` + `streamdiff-r3.js` — `conform/run.cjs` and `second-gate.mjs --candidate` on both trees | 82/82 and 6+3 lines, **0 differing in all four streams**; 33/33 assertion lines identical, tally both `{BAD:6,OK:26,INFO:1}` |
| `rv3/probe-bites2.js` on both trees | base returns advice; candidate THROWS from `theOneFix` and `nowModel` on a malformed `plan.brk` (§5) |
| `rv3/probe-unknown.js` on both trees | the five recovery cells of §6 |
| `rv3/probe-n1e.js` on the candidate | r2's `N1e`: `clean=false`, GREEN/80 — handled, uncommitted |
| `git ls-tree` on four refs for `rebuild/m4/spec`; `B1.json` from the tooling branch; B-NTC's full diff | §7 |

Harnesses live in `work/lane-b/rv3/`, **outside** the worktree; build products in `rv3/tmp/`. Nothing
generated is committed except this file. The 33 mutants were applied only inside `rv3/wtmut`; both
throwaway worktrees ended `git status --porcelain` empty and were removed with `git worktree remove`.

**Privacy, verdict-only.** `rebuild/conform/private/` does not exist on this tree and I did not create it.
`ledger/` was never opened and was never checked out into either throwaway worktree. No `--full` was run.
No private value, count, hash or prose appears anywhere in this review.

---

*Reviewer's note on method: I re-executed everything asserted here with harnesses I wrote, including my own
transcription of all 33 mutants, which I completed before reading the builder's. Where our transcriptions
diverge I have said so and reported both results rather than adopting the one that agrees with the report.
Where I could not execute something — `--full`, the private census, the browser and host surfaces, the
19 original gates and `native-carriers-profile.verify()` — I have said so rather than inferring it. On
every point I could check, the r3 pass's section 9 is accurate, and it is candid about the two things that
weaken its own headline: that site 3 reaches no printed value, and that `D10-2`'s kill is not behavioural.*
