# EARNED — LANE B · PACKAGE B2 — TARGETS, IDENTITY & TECHNIQUE ERA — BUILD REPORT (SPECULATIVE IMPLEMENTATION, BRIEF NOT ACCEPTED)

2026-09-11 · Opus builder of LANE B, working directly on the owner's PC in its own worktree
`work/lane-b/b2` on branch `rebuild/lane-b-b2`. **The brief this implements is NOT accepted.**
This is parallel authoring under `rebuild/DECISIONS.md:100` and `rebuild/lanes/LANES.md`
("SPECULATIVE AUTHORING: a lane may implement a package on a candidate branch before its brief
is accepted; nothing merges before acceptance; the branch is rebased/adjusted to the accepted
brief"). **Nothing here merges.** No `ledger/` path and no `rebuild/conform/private` path was
opened. Every protected surface is reported verdict-only. No frozen law, golden, witness file or
accepted artifact was edited.

Contract read in full before any edit: `rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.1.md`
(573 lines, including the identity convention C1–C6, the D30 section that reuses
`rebuild/m2/BRIEF-SET-ONE-ERA.md` verbatim with both `DECISIONS:82` conditions, Q8's narrowed
`liftTrend` cut and the protected surfaces), `rebuild/lanes/LANES.md` incl. its Amendments,
`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md` §B2 and §3, `rebuild/DECISIONS.md` lines 60, 82,
88–100, and the NATIVE-CARRIERS package files under `rebuild/m4/spec/*native-carriers*`
(inherited-carriers shape).

---

## 0. Base, environment, and exactly what changed

| item | value |
|---|---|
| worktree | `C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\lane-b\b2` |
| branch | `rebuild/lane-b-b2`, created from `origin/rebuild/t2-client-core` |
| base commit | `acd3b6755404ab75e91087d179e48ed07467549a` (`acd3b67`) |
| brief's base | `87eddad` — `git diff --stat 87eddad..HEAD -- rebuild/engine rebuild/conform tools rebuild/m4/spec` is **EMPTY**, so every coordinate, citation and pre-image in the brief stands at `acd3b67` unchanged |
| node | `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` v24.19.0 |
| npm | **no `npm.cmd` exists beside that node** (`dependencies\node\bin` holds only `node.exe`, and `dependencies\node\node_modules` has no `npm`). `npm ci --include=dev` was run with the machine's own npm, `C:\Users\joeym\AppData\Local\nodejs\npm.cmd` (npm 11.16.0 / node v24.18.0); everything else ran under the codex node by full path. `package-lock.json` is unmodified (`git status` clean for it). |
| frozen bundle | built into `rebuild/conform/engines/engine-main.cjs` — **gitignored** by `rebuild/conform/.gitignore:2` (`engines/*.cjs`), from a B2-private detached worktree `%TEMP%\earned-b2-frozen-wt` at `fe516c1f2b1d7d756a24e46d000d23ac1c747aa8`, esbuild 0.28.1, sha256 `a575ac58a55c5e2929b584be6ed6b1d5db8c36c81b449415d0909dc4b1958eec`, 814,639 bytes. A private worktree was used deliberately so the concurrent B1 builder's own build cannot race it. |
| scratch | `%TEMP%\b2-scratch` (harnesses, logs, disposable engine copies) — outside the repo, nothing committed |

### 0.1 Product files — sha256 before → after

| file | pre-image (brief §0, verified) | post-image | diff |
|---|---|---|---|
| `rebuild/engine/plan.cjs` | `1b26c87f6fa037259a4ce480585e07714f5b38d4995a56bc94965f49386af2a3` | `4c6f981706694771501d3d050440eb4f9a62e64b6eac7c59ff9c4742dfaa7e93` | `2 +, 2 -` |
| `rebuild/engine/progression.cjs` | `7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5` | `ad989ed4edc1094244491e7d68bdb9ddb1c795f9797e699edfdad2652a52c70a` | `14 +, 6 -` |
| `rebuild/engine/volume.cjs` | `c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4` | `73550ef80b17f9517923c0ecc69783c89aa24a6670dd13c0a464cc57d4a2a9be` | `12 +, 5 -` |

`git status --porcelain` at the end of the run is exactly:

```
 M rebuild/engine/plan.cjs
 M rebuild/engine/progression.cjs
 M rebuild/engine/volume.cjs
?? rebuild/m4/spec/b2-inherited-carriers.cjs
```

`writers.cjs`, `merge.cjs`, `migrate.cjs`, `earn.cjs`, `sleep.cjs`, `today.cjs`, `index.cjs`,
`performed.cjs`, `entered-load.cjs` and every file under `rebuild/conform/`, `tools/`,
`rebuild/engine/test/` and `rebuild/m2/` are **byte-untouched**.

---

## 1. The fourteen hunks, applied in package order D9 → D2 → D1 → D5 → D6 → D7 → D3 → D4 → D29 → D18 → D28 → D30 → D31 → D32

Every hunk is the brief's **v1.1** text, applied by content (never by line number) and verified by
`git diff`. Nothing outside the enumerated declarations moved.

### D9 — `plan.cjs:15`, `dayType` (unchanged from brief)
```
- for (const x of list) if (x && x.from && x.from <= iso) ent = x;
+ for (const x of list) if (x && x.from && x.from <= iso && (!ent || String(x.from) >= String(ent.from))) ent = x;
```

### D2 — `plan.cjs:84`, `_bornValid` (unchanged from brief)
```
- function _bornValid(e) { return !!(e && typeof e.sets === "number" && typeof e.hi === "number" && …
+ function _bornValid(e) { return !!(e && Number.isInteger(e.sets) && e.sets > 0 && Number.isFinite(e.hi) && e.hi > 0 && …
```
`setup` / `day` / `mg` conjuncts unchanged and in place. One hunk fixes both the `:114` flagging
path and the `:123` clearing path, because `canonicalizePlan` calls the module-internal
declaration — **no second hunk in `canonicalizePlan`**, exactly as the brief instructs the
reviewer to expect.

### D1 — `progression.cjs:271`, `targetsFor(ex, s)` (the brief's v1.1 rewrite, carriers' `governingLast` kept)
```
- if (!governingLast(ex, s)) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
+ if (!governingLast(ex, s)) return ex.first ? fitN(ex.first) : Array(ex.sets).fill(Math.max(1, ex.hi - 2));
```
The removed `.slice()` on the fresh `Array(...).fill(...)` is a value-identical no-op; that it is
still a *copy* on the `ex.first` path is pinned by probe `d1-first-length-equal-returns-a-copy`
(same contents, `got !== ex.first`).

### D5 — `progression.cjs:347–348` (`loadRungs`) and `:408` (`parseRungs`) (unchanged)
```
-   if (r.length < 2) return null;
-   return [...new Set(r)].sort((a, b) => a - b);
+   const u9 = [...new Set(r)].sort((a, b) => a - b);
+   return u9.length < 2 ? null : u9;
```
```
-   return r.length >= 2 ? [...new Set(r)].sort((a, b) => a - b) : null;
+   const u9 = [...new Set(r)].sort((a, b) => a - b);
+   return u9.length >= 2 ? u9 : null;
```

### D6 — `progression.cjs:394–395`, `deloadLoad` (unchanged)
```
  function deloadLoad(ex, pct = 0.95) {
+   if (ex.w == null || ex.w === "") return null;   /* C6 — absence is not zero; the same guard nextLoad/prevLoad already apply */
    const w = Number(ex.w);
```

### D7 — three sites, `progression.cjs:157` (native anchor loop), `:163` (legacy anchor loop), `:692` (`liftTrend`), with the trend cut **narrowed to a supplied `opts.asOf`** per Q8
```
      const row = rows[i];
+     if (row.d > atA) continue;
      if (!sameEra(fkA, row.d, atA)) continue;
```
```
  for (let i = days9.length - 1; i >= 0; i--) {
+   if (days9[i] > atA) continue;
    if (!sameEra(fkA, days9[i], atA)) continue;
```
```
    const {d}=row;
+   if (opts && opts.asOf && d > atT) continue;
    if (!sameEra(fkT, d, atT)) continue;
```

### D3 — `progression.cjs:230–231`, `_volDeltas` (unchanged; §2 C2→C3 reader)
```
    let named9 = false;
-   for (const n9 of names9) if (n9 && f9.t.indexOf("via " + n9) > -1) named9 = true;
+   if (f9.exId != null) named9 = String(f9.exId) === String(ex && ex.id);
+   else { const at9 = f9.t.indexOf("via "); const own9 = at9 < 0 ? null : f9.t.slice(at9 + 4).split(" (now ")[0];
+     for (const n9 of names9) if (n9 && own9 === n9) named9 = true; }
```

### D4 — `progression.cjs:619–620`, `_deriveSightingFull` (unchanged; the accepted law's own boundary regex adopted verbatim)
```
      let hit9 = false;
-     for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;
+     if (f9.exId != null) hit9 = String(f9.exId) === String(ex.id);
+     else for (const n9 of names9) if (f9.t.indexOf(n9) === 0 && /^ [-+]?(?:\d+(?:\.\d+)?|\.\d+) EARNED$/.test(f9.t.slice(n9.length))) hit9 = true;
```

### D29 — `volume.cjs:41`, `muscleVolume`'s `count` closure (unchanged)
```
- const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; });
+ const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { const k6 = mg2 === "delts" ? "delts_front" : mg2; by[k6] = (by[k6] || 0) + n6 * f2; });
```

### D18 — `volume.cjs:157`, `structuralMovesThisWeek` (unchanged)
```
- (s.feed || []).slice(0, 80).forEach((f) => {
+ (s.feed || []).forEach((f) => {
```
The brief's recorded objection about `volume.cjs:159`'s unbounded substring owner test is **NOT**
acted on: Q2 is unanswered, so B2 does not widen its own scope. `volume.cjs:302`
(`_setsMovesSince`, behind its own untouched 120-row cap) is likewise left alone.

### D28 — `volume.cjs:64`, `programmeVolume` (unchanged)
```
- for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY)), s); … }
+ const d9 = mk(isoOf(todayStart())); const mon9 = new Date(d9.getTime() - ((d9.getDay() + 6) % 7) * DAY);
+ for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mon9.getTime() + i * DAY)), s); … }
```

### D30 — `volume.cjs`, the ACCEPTED `BRIEF-SET-ONE-ERA.md` rule, literally: two late-bound delegates plus one guard line
Delegates added in the module's existing alphabetical `E.` block (no third binding, no new import):
```
+ const forksOf = (...args) => E.forksOf(...args);
+ const sameEra = (...args) => E.sameEra(...args);
```
`setOneRead`, immediately after the untouched IDLE guard, and the era skip **before** the session
record is read:
```
  if (!ex9 || typeof ex9.w !== "number") return { status: "IDLE", exId };
+ const fk9 = forksOf(s, exId);
+ const at9 = fk9.length ? isoOf(todayStart()) : null;
  const pts = [];
  for (const d of Object.keys(s.sessionLog || {}).sort()) {
+   if (!sameEra(fk9, d, at9)) continue;   /* D30 — a first-set trend never pools two technique eras */
    const sl = s.sessionLog[d];
```
This is `BRIEF-SET-ONE-ERA.md:17` word for word — `forksOf` once, the query day read **only** when
forks are nonempty (`null` otherwise), the skip before the record read, all remaining original code
unchanged. No `d <= today`, no cache, no as-of, no threshold, writer, formatter, receipt or schema
change. Both `DECISIONS:82` conditions are carried and honoured (§6.3, §7).

### D31 — `volume.cjs:238`, `volumeConversion` (unchanged)
```
- if (!t || t.n < TREND_MIN_SESSIONS) return { status: "READING", exId, changedAt,
+ if (!t || t.n < TREND_MIN_SESSIONS || t.k !== lastK || t.pts.some((p8) => p8.d < changedAt)) return { status: "READING", exId, changedAt,
```

### D32 — `volume.cjs:283`, the replication branch, reusing D30's two delegates (unchanged)
```
-       const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && (mk(…) - mk(…)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
+       const fk2 = forksOf(s, exId), at2 = isoOf(todayStart());
+       const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && g9.every((p8) => sameEra(fk2, p8.d, at2)) && (mk(…) - mk(…)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
```
`TREND_MIN_SESSIONS`, `REVIEW_OUTCOME_D`, `_blockSlope`, the segment construction, `segs.pop()` and
both `why` strings are untouched — the owner's "all other replication thresholds stay as they are"
(`DECISIONS:60`, D32) implemented literally and no more.

---

## 2. The fourteen laws — 14/14 GREEN on the candidate, RED on the frozen engine, nothing else moved

Setup, once:

```
node %TEMP%\b2-scratch\build-frozen.mjs <worktree> %TEMP%\earned-b2-frozen-wt
  → built frozen @ fe516c1f2b1d7d756a24e46d000d23ac1c747aa8
    → <worktree>\rebuild\conform\engines\engine-main.cjs
    sha256=a575ac58a55c5e2929b584be6ed6b1d5db8c36c81b449415d0909dc4b1958eec (814639 bytes)
```

Runner, identical command on both sides (`TZ=America/New_York`, `ENGINE_MAIN=<the bundle above>`):

```
node rebuild\conform\v4\run-defect-laws.cjs
```

**BASE (pre-image bytes, before any hunk):**
```
TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

**CANDIDATE (all fourteen hunks applied):**
```
TOTAL 45 laws · 45 RED-frozen · 25 RED-candidate · 88 GREEN repair controls · 83/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

Both `AUDIT RED-FIRST FAIL` lines are expected and are **not** B2's: the runner's own pass rule
demands `RED-candidate` for all 45, and the six accepted repairs (D12, D33, D34, D35, D41, D43) are
already GREEN-candidate at this tip, exactly as `DECISIONS:87` records. The `39 RED-candidate`
baseline is the `39 + 15 non-D open` register state, executed and confirmed.

**Line-by-line diff of the 45-law output, base vs candidate — exactly fifteen lines move: the
fourteen laws and the TOTAL line. No other law changes status, detail, or mutant verdict.**

| D | law id | frozen | base candidate | B2 candidate |
|---|---|---|---|---|
| D9 | `E-D9-split-selects-latest-effective-date` | RED | RED | **GREEN** |
| D2 | `E-D2-invalid-set-count-stays-quarantined` | RED | RED | **GREEN** |
| D1 | `P-D1-first-targets-fit-current-set-count` | RED | RED | **GREEN** |
| D5 | `P-D5-ladder-minimum-counts-distinct-rungs` | RED | RED | **GREEN** |
| D6 | `P-D6-deload-preserves-absent-load` | RED | RED | **GREEN** |
| D7 | `P-D7-anchor-and-trend-exclude-future-sessions` | RED | RED | **GREEN** |
| D3 | `P-D3-volume-receipt-belongs-to-whole-lift-name` | RED | RED | **GREEN** |
| D4 | `P-D4-other-lift-earn-cannot-spend-sightings` | RED | RED | **GREEN** |
| D29 | `P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit` | RED | RED | **GREEN** |
| D18 | `P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix` | RED | RED | **GREEN** |
| D28 | `E-D28-programme-volume-follows-the-current-effective-split` | RED | RED | **GREEN** |
| D30 | `P-D30-first-set-trend-respects-the-recorded-technique-era` | RED | RED | **GREEN** |
| D31 | `V4-volume-tolerance-post-change` | RED | RED | **GREEN** |
| D32 | `V4-volume-replication-same-era` | RED | RED | **GREEN** |

### 2.1 Executed detail per law, frozen vs candidate — every one matches the brief's prediction

```
D9   frozen RED {"ordered":"U","reversed":"L"}        candidate GREEN {"ordered":"U","reversed":"U"}
D2   frozen RED {"accepted":true,"quarantined":false,"negativeArrayCrash":true}
     candidate GREEN {"accepted":false,"quarantined":true,"negativeArrayCrash":false}
D1   frozen RED {"grow":[8,7],"shrink":[8,7]}         candidate GREEN {"grow":[8,7,6],"shrink":[8]}
D5   frozen RED {"parsed":[100],"rungs":[100],"maxed":true,"next":null}
     candidate GREEN {"parsed":null,"rungs":null,"maxed":false,"next":105}
D6   frozen RED {"missing":[5,null,5],"known":95}     candidate GREEN {"missing":[null,null,null],"known":95}
D7   frozen RED anchor [11,10], a four-point trend from 2026-09-10 to 2026-09-13, laterCount 4
     candidate GREEN {"anchor":[8,7],"trend":null,"laterCount":4}
D3   frozen RED {"deltas":[["2026-09-01",1],["2026-09-02",1]]}   candidate GREEN {"deltas":[["2026-09-01",1]]}
D4   frozen RED {"before":{"topAt":100,"topRun":2},"afterOther":{"topAt":null,"topRun":0},"afterOwn":{"topAt":null,"topRun":0}}
     candidate GREEN {"before":{"topAt":100,"topRun":2},"afterOther":{"topAt":100,"topRun":2},"afterOwn":{"topAt":null,"topRun":0}}
D29  frozen RED / candidate GREEN — "Completing the planned presses and front raises retains the same indirect front-delt credit in the logged total."
D18  frozen RED / candidate GREEN — "An ordinary-note prefix cannot hide a same-week set change from the structural budget."
D28  frozen RED / candidate GREEN — "Designed weekly sets use the current effective training split."
D30  frozen RED / candidate GREEN — "A single session in the current technique era cannot inherit a live first-set trend from three earlier-era sessions."
D31  frozen RED / candidate GREEN — "Tolerance must use qualifying evidence after the set change."
D32  frozen RED / candidate GREEN — "No current-era earlier block exists to establish replication."
```

D1's `{"grow":[8,7,6],"shrink":[8]}`, D6's `{"missing":[null,null,null],"known":95}` and D7's
`{"anchor":[8,7],"trend":null,"laterCount":4}` are byte-identical to the brief's §1 predictions —
including D7's detail being **the same under the narrowed hunk as under v1's**, because the law's
trend case supplies `asOf` explicitly.

### 2.2 Two measured, brief-predicted side effects of repairing the source

* **GREEN repair controls fall 89 → 88.** The lost one is D29's: its `control`
  (`laws-evidence-comparability.cjs:11`) *adds* the indirect delta on top of `muscleVolume`'s own
  output, so on a repaired reader it double-counts. Frozen-side satisfiability demonstration only;
  never a candidate oracle. (Brief §1.9 / Q6(b) — confirmed to the exact number.)
* **Detected mutant executions fall 97/104 → 83/104** — precisely the fourteen laws'
  candidate-side mutants, which all restore `T.__auditOriginal[name]` through the export wrapper
  (`helpers.cjs:49–58`) and are therefore inert once the repair is in the *source*. The laws'
  listed mutants consequently **cannot** serve as this package's fault mutants; only the named
  source mutants of §3 can. (Brief §6(5) / Q6(a) — confirmed to the exact number.)

---

## 3. Named source mutants — 57 named, 53 CAUGHT, 4 proved EQUIVALENT/INERT, 0 uncaught

Harness (`%TEMP%\b2-scratch\mut-driver.cjs` + `mut-child.cjs` + `probes.cjs`): for every named
mutant it makes a **disposable copy of `rebuild/engine`**, applies the mutation **to the copy only**
with a uniqueness assertion (a non-unique or missing target is an APPLY-ERROR and earns no kill),
and runs each check in a **fresh process** against that copy. A kill = the check goes RED. A
HARNESS_ERROR is never counted as a kill.

Command:
```
node %TEMP%\b2-scratch\mut-driver.cjs <worktree> %TEMP%\b2-scratch
```

**Control first** — on the unmutated repaired copy: `CONTROL: 14 laws + 47 probes · 0 failures`.
So no probe is capable of a false kill.

**Result:** `MUTANTS: 57 named · 53 caught · 4 equivalent/inert (reason recorded) · 0 not caught ·
0 apply errors · control failures 0` (exit 0).

| D | mutant | caught by |
|---|---|---|
| D9 | `split-selection-returns-to-last-array-row` | law D9 |
| D9 | `split-tie-prefers-first-array-row` (`>=`→`>`) | probe `d9-tie-keeps-array-order` (law D9 GREEN — its fixture uses distinct dates) |
| D9 | `split-selection-drops-the-effective-date-bound` | law D9 + probe `d9-future-split-row-ignored` |
| D2 | `numeric-type-admits-negative-count` | law D2 |
| D2 | `integral-check-omits-positivity` | law D2 |
| D2 | `hi-ceiling-unchecked` | probe `d2-hi-nan-invalid` (NaN / Infinity / 0 all refused) |
| D1 | `first-array-bypasses-existing-authored-fit` | law D1 |
| D1 | `first-array-pads-but-never-truncates` | law D1 |
| D1 | `first-array-padded-with-hi-minus-two` | law D1 |
| D1 | `first-fit-bypasses-the-native-governing-test` (restore `!ex.last`) | probe `d1-native-governing-null-with-stale-cache` — **the native-view case the brief demands** |
| D5 | `raw-rung-count-checked-before-deduplication` | law D5 |
| D5 | `dedupe-in-loadrungs-only` | law D5 |
| D5 | `dedupe-drops-the-sort` | probe `d5-rungs-sorted` |
| D6 | `numeric-coercion-turns-absence-into-deload-five` | law D6 |
| D6 | `guard-omits-empty-string` | law D6 |
| D6 | `guard-also-rejects-zero` (`!ex.w`) | probe `d6-zero-load-keeps-existing-result` (`w:0` still 5) |
| D7 | `as-of-restricts-era-but-not-session-dates` (all three guards deleted) | law D7 |
| D7 | `future-cut-applied-to-the-trend-only` | law D7 |
| D7 | `trend-future-cut-applied-without-a-supplied-asof` (**v1's unconditional cut**) | probe `d7-snapshot-trend-nlifts` (the protected `tools/engine-test.jsx:70` cell) **and** probe `d7-no-asof-trend-reads-its-whole-era` |
| D7 | `future-cut-is-inclusive-of-the-next-day` (`>`→`>=`) | probe `d7-session-on-the-query-day-is-evidence` |
| D7 | `anchor-future-cut-omits-the-native-loop` (v1's hunk) | probe `d7-native-anchor-excludes-future-row` |
| D3 | `volume-owner-is-name-substring` | law D3 |
| D3 | `volume-owner-is-name-prefix-of-the-via-tail` | law D3 |
| D3 | `volume-owner-boundary-ignores-the-now-suffix` | law D3 |
| D3 | `volume-owner-trusts-exid-only` | law D3 |
| D4 | `earn-owner-is-unbounded-name-prefix` | law D4 |
| D4 | `earn-boundary-accepts-any-tail` | law D4 |
| D4 | `earn-boundary-rejects-decimal-loads` | probe `d4-decimal-load-still-spends` (`PRESS 102.5 EARNED`) |
| D4 | `earn-owner-trusts-exid-only` | law D4 |
| D29 | `press-credit-goes-to-unreturned-coarse-delt-bucket` | law D29 |
| D29 | `indirect-credit-remaps-every-key-to-delts-front` | law D29 + probe `d29-indirect-buckets-exact` |
| D29 | `indirect-credit-doubled-into-both-keys` | probe `d29-indirect-buckets-exact` (law D29 GREEN — `delts_front` is unchanged by the doubling) |
| D29 | `indirect-credit-rounded-before-summing` | law D29 + probe `d29-indirect-buckets-exact` |
| D18 | `eighty-feed-lines-only` | law D18 |
| D18 | `weekly-bound-dropped-with-the-prefix` | probe `d18-out-of-week-row-not-a-move` |
| D18 | `duplicate-moves-no-longer-deduped` | probe `d18-two-rows-one-move` |
| D28 | `programme-volume-uses-authored-july-week` | law D28 |
| D28 | `programme-week-starts-on-sunday` | probe `d28-designed-week-is-the-query-week` |
| D28 | `programme-week-reads-the-next-week` | probe `d28-designed-week-is-the-query-week` |
| D28 | `programme-week-ignores-the-split-argument` | law D28 |
| D30 | `remove era guard` | law D30 |
| D30 | `invert predicate` | law D30 |
| D30 | `replace query era with latest fork` | probe `d30-query-era-not-the-latest-fork` (ERA30-FUTURE) |
| D30 | `exclude the inclusive boundary` | probe `d30-fork-boundary-is-inclusive` (ERA30-BOUNDARY) |
| D30 | `borrow pre-era points to meet minimum` | law D30 |
| D30 | `break legacy-fork dispatch` | probe `d30-legacy-single-fork-honoured` (ERA30-LEGACY) |
| D30 | `add a future-date cutoff` | probe `d30-future-in-era-session-stays-eligible` — the D7 × D30 divergence the accepted brief forbids widening |
| D30 | `use an ambient clock` | probe `d30-pinned-clock-decides-the-era` (ERA30-CLOCK ambient-Date trap) |
| D31 | `reuse-pre-change-tolerance` | law D31 |
| D31 | `post-change-check-on-the-count-only` | probe `d31-count-matches-but-pts-predate-the-change` |
| D32 | `compare-earlier-technique-block` | law D32 |
| D32 | `replication-era-uses-the-latest-stored-fork` | probe `d32-latest-fork-is-not-the-query-era` |
| D32 | `replication-era-excludes-the-inclusive-boundary` | probe `d32-block-member-on-the-fork-date-counts` |

D30's eight are the eight faults the **accepted** `BRIEF-SET-ONE-ERA.md:62` names verbatim ("remove
era guard; invert predicate; replace query era with latest fork; exclude the inclusive boundary;
borrow pre-era points to meet minimum; break legacy-fork dispatch; add a future-date cutoff; use an
ambient clock") — all eight killed, each by its named behavioural case.

### 3.1 The four mutants that CANNOT be killed, with the reason (this is a finding, not a gap)

Each was executed against the law and against purpose-written probes and stayed GREEN. Each is an
*equivalent* or *structurally unreachable* mutation of the brief's own hunk, and each is recorded
here rather than quietly dropped or "killed" by a harness artefact.

1. **D31 `post-change-check-on-the-dates-only`** (drop `t.k !== lastK`) — **EQUIVALENT on legacy
   states.** `t.k !== lastK` *implies* `t.pts.some(d < changedAt)`: `pts[].k` is `reps.length`, and
   by `volumeConversion`'s own cut every session dated `>= changedAt` has `k === lastK`, so
   `t.k !== lastK` can only arise when `liftTrend`'s trailing run ends before `changedAt`.
   **Consequence for the reviewer: the brief's D31 hunk carries one redundant conjunct.** It is
   left exactly as the brief specifies (minimal diff, brief fidelity). The only way to separate the
   two is a native (`workoutFacts`) row whose `performedTrendObservation().k` differs from
   `reps.length` — which is also the only place the conjunct could ever earn its keep.
2. **D31 `post-change-check-is-inclusive-of-the-prior-day`** — **STRUCTURALLY UNREACHABLE on legacy
   states.** The session immediately preceding `changedAt` *is* the k-change session by
   construction of the cut, so no trend point can be dated exactly `changedAt − 1` unless a
   native-only row supplies one.
3. **D32 `replication-era-checked-on-the-block-start-only`** — **STRUCTURALLY UNREACHABLE with D31
   in force.** Separating start-only from every-member needs a prior block that *starts* in the
   query era and *ends* in a later one; that puts the current block past the same fork, and D31
   then returns `READING` before D32's replication branch is reached. A real D7 × D31 × D32
   interaction, discovered by execution.
4. **D32 `replication-threshold-relaxed-with-the-era-cut`** — **EQUIVALENT.** `_blockSlope` itself
   returns `null` below `TREND_MIN_SESSIONS`, so `(_blockSlope(g9) || {}).lo > 0` is already false
   for a shorter block; relaxing the segment-length threshold admits nothing.

### 3.2 Negative controls and interaction pins (all GREEN on the repair, all in the 47-probe control set)

D9 falsy/absent `from` still skipped and duplicate `from` keeps array order · D2 `sets:3,hi:10`
still born-valid, `3.5` and `0` invalid, and the F1 self-heal still clears a poison quarantine on a
valid record · D1 `first.length === ex.sets` returns the same contents **and still a copy**, and
`targetsFor({last:[14,13,13],hi:15,sets:3})` is still `[14,14,13]` · D5 `[100,105]` unchanged in
value and order, single-element still `null`, `parseRungs('')` still `null` · D6 `w:0` keeps 5,
`w:"100"` still deloads, a ladder with an absent `w` returns `null` before `loadRungs` ·
D7 **`liftTrend` with no `asOf` is byte-identical to the merged engine and still sees later sessions
(`d7-no-asof-trend-reads-its-whole-era`) — the narrowing, asserted explicitly as the brief
requires** · D3 `VOLUME PASSED` has no owner and is skipped not thrown on, a former name from
`renames[].prevN` still matches, `exId` is terminal in both directions
(`d3-exid-is-terminal`) · D4 `PRESS EARNED` and `BENCH PRESS 100 EARNED` do not spend, and an
`exId` mismatch with matching prose is **refused** (`d4-exid-mismatch-with-matching-prose-is-refused`) ·
D28 a state with no `split` reproduces the legacy dow reading for the as-of week, and
`structuralMovesThisWeek.monday` and `programmeVolume`'s Monday agree on the same clock ·
D30 no-fork / IDLE states byte-identical, boundary inclusive, legacy single fork honoured ·
D31 a clean post-change block still reaches its tier, a point dated exactly on `changedAt`
qualifies · D32 a same-era earlier block still yields `REPLICATED` with the original prose, and a
no-fork state is byte-identical.

**Carrier-collision pins the brief demands (§3 "real interactions to prove, not assume"):**
`d9xd28-unsorted-split-and-the-query-week` (D9 picks the greatest `from` out of array order and D28
then counts that week) · `d5xd6-duplicate-ladder-with-an-absent-load` (returns `null` once, not 5) ·
`d2xd1-quarantined-record-never-reaches-targetsfor` (quarantine survives, `exActive` false, and the
`RangeError` at `progression.cjs:271` stays reachable exactly as before — recorded as an unrepaired
latent, **not** a B2 obligation, per register :30) · `d3xd4-joint-prefix-collision` (one state where
both a VOLUME and an EARNED receipt belong to the longer-named lift) ·
`d7xd30-anchor-cuts-the-future-that-setoneread-keeps` · **`native-reset-mapping-still-refuses`** — a
native state whose reset date collides still throws `PROGRESSION_RESET_MAPPING_REQUIRED` through
**both** `targetsFor` and `progressAnchor` after the hunks, so B2's D1/D7 edits do not swallow the
carriers' refusal.

---

## 4. The protected second-gate cell `tools/engine-test.jsx:70` — the brief's Q8 check, settled by execution

`tools/engine-test.jsx:70` is `ok(pt.nLifts === 3 && pt.state === "unknown", …)` where
`pt = __test.progressionTrend(SNAP)` and `SNAP` is `tools/snapshots/2026-08-06-ledger.json`
(sha256 `62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f`, exactly the brief's pin),
evaluated under the anchor `second-gate.mjs:64` hard-pins, `MEASURED_TEST_NOW = "2026-07-29"`.

Direct reproduction (`%TEMP%\b2-scratch\gate70.cjs`), three engine copies, identical command:

| engine | nLifts | state | `:70` holds |
|---|---|---|---|
| pre-image bytes (base) | 3 | unknown | **true** |
| **B2 candidate (v1.1 narrowed cut)** | **3** | **unknown** | **true — the cell does NOT move** |
| v1's unconditional `liftTrend` cut | **0** | unknown | **false — the cell flips** |

`nExcludedNonNumeric = 2` and `excludedIds = [curl, hanging]` are identical on all three.

**This is confirmed inside the real gate, not only by the probe.** `second-gate.mjs --candidate`
compiles and runs the actual `tools/engine-test.jsx` against the candidate engine; its candidate-side
stdout log (`.tmp/m2-second-gate/candidate-engine-test.stdout.log`, 267 lines) contains

```
PASS — SNAPSHOT (R17) — progressionTrend now READS this snapshot: 3 lifts carry a usable trend where 0 did before the split. …
```

and that log is **byte-identical between the pre-image bytes and B2** across all 261 observed
assertions (`Compare-Object` → no differences; `FINAL2: 251 passed, 1 failed` · `FINAL3: 256 passed,
1 failed` · `FINAL4: 260 passed, 1 failed` on both sides). So B2 adds **zero** failures inside the
observable part of the protected gate, and Q8's recommended option (a) is proved on the owner's PC.

The single failure on the candidate side, on **both** the pre-image bytes and B2, is the
pre-existing D12 step-efficacy cell — `FAILED ASSERTION tools/engine-test.jsx:106`, the site the
accepted custody owns (`rebuild/conform/v4/postfix/step-efficacy-second-gate.cjs`,
`ci-second-gate.cjs:10` `SITE='tools/engine-test.jsx:106:5'`). **Not fixed here, by instruction.**

---

## 5. Public census delta — exactly one cell, in four JSON positions

Method: two disposable full copies of `rebuild/engine`, one carrying the **pre-image bytes extracted
from git** (`%TEMP%\b2-scratch\extract-orig.cjs`, which re-prints the three pre-image sha256 and so
proves the base side is byte-honest: `1b26c87f…` 19,784 B · `7031838d…` 53,582 B · `c32298e7…`
23,465 B), one carrying the candidate. The same thirteen-read census
(`%TEMP%\b2-scratch\census.cjs`) is run on each at both matrix days and diffed structurally.

Reads covered, over **all 16 seeded lifts**: `programmeVolume`, `muscleVolume`, `volumeImbalance`,
`structuralMovesThisWeek`, `nowModel`, `dayType` (at 2026-07-29 / 08-03 / 08-09 / 08-31 / 09-03 /
09-07 / 09-13), and per lift `targetsFor`, `progressAnchor`, `loadRungs`, `maxedOut`, `nextLoad`,
`prevLoad`, `deloadLoad`, `snapLoad`, `repsLostOnJump`, `deriveSighting`, `_volDeltas`, `setOneRead`,
`volumeConversion`, `liftTrend`, `liftTrend({asOf})`, `liftCall`.

```
===== 2026-09-03 =====
/perLift/fly/deloadLoad: 5 -> null
/perLift/hipthrust/deloadLoad: 5 -> null
cells changed: 2
===== 2026-09-07 =====
/perLift/fly/deloadLoad: 5 -> null
/perLift/hipthrust/deloadLoad: 5 -> null
cells changed: 2
```

**Census delta = ONE cell — `deloadLoad` for `fly` and `hipthrust`, `5 → null` (D6) — at both matrix
days; four JSON positions for one primitive change; nothing else moved.** v1.1's finding reproduces
exactly. The cell is unreachable through the engine's only internal consumer, `sleep.cjs:136`, which
guards on `typeof ex2.w === "number"` before calling — so no receipt string and no card inside the
engine ever carried the invented 5.

`programmeVolume` and `volumeImbalance` on the seed are byte-identical at both matrix days (the seed's
own week and the authored 2026-07-27 week yield the same U/L counts), so **D28's public golden risk
on the seed is zero at both days**, exactly as the brief recorded. `muscleVolume` returns `[]` at both
days (no session inside the 14-day window), so D29 does not move the seeded census either.

### 5.1 Comparator fails closed — unlisted-field bite

One **unlisted** output field (`unlistedProbeField: 1`) added to `setOneRead`'s IDLE return in a
disposable copy only. The exact comparator refuses it immediately:

```
/perLift/fly/setOneRead/unlistedProbeField: undefined -> 1
/perLift/hack/setOneRead/unlistedProbeField: undefined -> 1
/perLift/hanging/setOneRead/unlistedProbeField: undefined -> 1
/perLift/hipthrust/setOneRead/unlistedProbeField: undefined -> 1
cells changed: 4
```

### 5.2 Disclosed source bite and exact restoration

D6's absence guard was removed **in the worktree** (`%TEMP%\b2-scratch\bite-d6.cjs apply`):

```
BITE APPLIED: D6 absence guard removed; sha256 now 8ef2f7c1c63de195a9bf70ec118ac9122e705db16375f5e4171e96bc5cb56b44
RED line: D6 P-D6-deload-preserves-absent-load · RED-frozen / RED-candidate / mutant-DETECTED
carrier under the bite: B2 INHERITED CARRIERS FAIL at defect-witnesses: ERR_ASSERTION
```

then restored and re-verified:

```
BITE RESTORED: sha256 ad989ed4edc1094244491e7d68bdb9ddb1c795f9797e699edfdad2652a52c70a
D6 P-D6-deload-preserves-absent-load · RED-frozen / GREEN-candidate / AUDIT-FAIL
B2 INHERITED CARRIERS: 5/5 PASS; 17 exact substitutions …
```

The base-restoration cycle (`git checkout --` the three files, run, then restore from the saved
copies) was performed four times in total for base-vs-candidate measurement; **every** restoration
was verified by sha256 back to `4c6f9817…` / `ad989ed4…` / `73550ef8…` and by `git diff --numstat`
back to `2/2 · 14/6 · 12/5`.

---

## 6. Frozen defect-witness gates

### 6.1 Measured base vs candidate, failure-tolerant (every assertion reported, not just the first)

`%TEMP%\b2-scratch\witness-measure.cjs` runs an **original** witness file against one engine copy
with an in-memory failure-tolerant `witness` wrapper — the file on disk is never modified.

| gate | original sha256 | pre-image bytes | B2 candidate | carrier needed |
|---|---|---|---|---|
| `witnesses-1` `defect-witnesses.cjs` | `557c12e72690c39733369a09dba920055ffa6fbbb8b4508d6307fbdc66294644` | **10/10 reproduced** | **2/10** — D1, D2, D3, D4, D5, D6, D7, D9 flip; **D8 and D10 still reproduce** | **new** — and it is B2's eight *plus* B1's two in one file |
| `witnesses-2` `defect-witnesses-2.cjs` | `833db0431e656f862636ab96383c64b8e52f4cbaf94e28da14c1bae52115aaf2` | **10/11** — D12 already RED (repaired at `DECISIONS:87`) | **9/11** — exactly one more flips: **D18** | **extend** the accepted `legacy-step-efficacy-carriers.cjs` D12 successor |
| `witnesses-3` `defect-witnesses-3.cjs` | `f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6` | 5/5 | **5/5 unchanged** | none |
| `witnesses-4` `defect-witnesses-4.cjs` | `c90ffeaa953a9b04146432f39702f87fc8c51ce7f0be77876f075fc4142b87f7` | **5/5 reproduced** | **0/5** — D28, D29, D30, D31, D32 all flip | **new**, all five B2's |
| `witnesses-6` `defect-witnesses-6.cjs` | `71a5fa27293b6e7837ec627b273b266db9d6c4987ff850fb6fe9e2a5f86092c4` | 4/4 PASS | **4/4 PASS unchanged** | none |
| `witnesses-5` | (parent pin) | **FAIL** on the pre-image bytes | **FAIL identically** | **none — pre-existing at the tip, not a B2 delta** |
| `witnesses-7` | (parent pin) | **FAIL** on the pre-image bytes | **FAIL identically** | **none — pre-existing at the tip, not a B2 delta** |

Direct `node rebuild/engine/test/<id>.cjs` exit codes confirm it in the real repo (git-dependent
assertions satisfied): base `0 · 1 · 0 · 0 · 1 · 0 · 1`, candidate `1 · 1 · 0 · 1 · 1 · 0 · 1` for
witnesses 1…7. The measured witness flip count is therefore **14 assertions across three files**:
eight in witnesses-1, one in witnesses-2, five in witnesses-4 — the brief's numbers exactly
(10→2, 10→9, 5→0).

### 6.2 The successor file

**`rebuild/m4/spec/b2-inherited-carriers.cjs`** (new, 244 lines). Name derived from the accepted
parent's own convention (`native-carriers-inherited-carriers.cjs` → `b2-inherited-carriers.cjs`);
the brief names B2's artifact and runner (`acceptance-b2-targets-identity-era.json`,
`b2-package.cjs`) but not this file, so the naming is stated here rather than assumed silently.

It never rewrites a witness file. For each carried identity it reads the original bytes, **asserts
the sha256 against a hard pin**, and builds the successor with
`legacy-carriers.exactReplace(source, before, after, site, edits)` — which itself refuses unless the
`before` text occurs **exactly once** (`CARRIER-ONE-SITE:<site>`). `witnesses-2` first inherits the
**accepted** D12 successor verbatim by calling `legacy-step-efficacy-carriers.prepareCarrier`, then
adds exactly one more substitution on top.

Executed:
```
node rebuild\m4\spec\b2-inherited-carriers.cjs
B2 CARRIER defect-witnesses: PASS; 10 cases; 9 exact expectation substitution(s) [D1-first-targets-fit,
  D2-born-valid-refuses-negative-sets, D2-quarantine-survives-the-healer,
  D3-volume-receipt-owner-is-the-whole-name, D4-other-lift-earn-cannot-spend,
  D5-ladder-counts-distinct-rungs, D6-deload-preserves-absent-load,
  D7-anchor-and-supplied-asof-trend-exclude-the-future, D9-split-selects-the-latest-effective-date];
  DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged
B2 CARRIER defect-witnesses-2: PASS; 11 cases; 3 exact expectation substitution(s) [D12-slope, D12-resolved,
  D18-structural-budget-sees-past-the-display-prefix]; DEFECT WITNESSES 2: 11/11 reproduced; …
B2 CARRIER defect-witnesses-4: PASS; 5 cases; 5 exact expectation substitution(s) [D28-designed-week-is-the-query-week,
  D29-logged-front-delt-keeps-press-indirect-credit, D30-first-set-trend-respects-the-era,
  D31-tolerance-needs-post-change-evidence, D32-replication-counts-only-the-current-era];
  DEFECT WITNESSES 4: 5/5 reproduced; …
B2 CARRIER defect-witnesses-3: PASS; 5 cases; 0 exact expectation substitution(s) (unchanged); …
B2 CARRIER defect-witnesses-6: PASS; 8 cases; 0 exact expectation substitution(s) (unchanged); …
B2 INHERITED CARRIERS: 5/5 PASS; 17 exact substitutions (witnesses-1 new, witnesses-2 extends the accepted
  D12 successor, witnesses-4 new, witnesses-3/6 unchanged); witnesses-5/7 pre-existing at the tip,
  no B2 successor; PACKAGE receipt PENDING
```
(17 = 9 + 3 + 5, of which the two `D12-*` are inherited from the accepted successor; 15 are B2's.)

**The carrier is not vacuous.** Run against the **pre-image** bytes it refuses:
`B2 INHERITED CARRIERS FAIL at defect-witnesses: ERR_ASSERTION`, exit 1. It also refuses under the
D6 source bite (§5.2). witnesses-3 and witnesses-6 are asserted to receive **zero** substitutions
and are run as-authored (witnesses-6 as its own child process, because it re-execs itself per mode
and calls `process.exit`).

Substituted expectations, in full:

* **witnesses-1** — D1 `[8,7]`→`[8,7,6]` · D2 `_bornValid` `true`→`false` and `!!ex.quarantined`
  `false`→`true` (the `assert.throws(RangeError)` is untouched and still holds) · D3
  `[["2026-09-02",1]]`→`[]` · D4 `{topAt:null,topRun:0}`→`{topAt:100,topRun:2}` · D5 `parseRungs`
  and `loadRungs` `[100]`→`null`, `maxedOut` `true`→`false`, **plus a new positive assertion**
  `parseRungs("100,105,100") === [100,105]` · D6 `deloadLoad({w:null,inc:5})` `5`→`null` ·
  D7 anchor `[11,10]`→`[8,7]` and the supplied-`asOf` trend →`null`, **plus a new assertion that the
  no-`asOf` trend still reads all four future sessions** (`n:4`, `2026-09-10`→`2026-09-13`) — the
  narrowing pinned inside the carrier itself · D9 `"L"`→`"U"`.
* **witnesses-2** — inherited `D12-slope` (`100`→`0.1`) and `D12-resolved` (`false`→`true`) from the
  accepted successor, plus `D18` `last.sets.length` `0`→`1`.
* **witnesses-4** — D28 `programmeVolume chest` `6`→`3` · D29 `logged delts_front n7` `4`→`7` (the
  designed `7` and `chest 6` are **unchanged**: that fixture carries no `split`, so both weeks read
  the same U/L counts) · D30 `LIVE / n:4 / from:2026-08-10 / lo>0` → `COUNTING / n:1 / need:4 /
  from and lo absent` · D31 `LIVE / TOLERATED / trend.n:4 / trend.k:2` → `READING / tier absent /
  have:1 / need:4`, with the same trend facts re-asserted directly through `liftTrend` so the
  original observation is preserved rather than deleted · D32 `REPLICATED` → `OUTCOME-COMPATIBLE`
  and the `why` match moved to the existing OUTCOME-COMPATIBLE prose.

### 6.3 SHARED CARRIER WITH B1 — what B1 also touches in `defect-witnesses.cjs`

`rebuild/engine/test/defect-witnesses.cjs` (witnesses-1) is the **one** gate carrier B1 and B2 both
need, and this is the reconciliation note the merge requires:

* **B2 owns eight assertion sites** in that file: `D1`, `D2` (two sites), `D3`, `D4`, `D5`, `D6`,
  `D7`, `D9` — the nine substitutions listed above.
* **B1 owns exactly two**, and B2 leaves them **byte-untouched and still reproducing** on the B2
  candidate (measured: 2/10 reproduced = precisely D8 and D10):
  * **`D8`** — `witness("D8 an eight-month-old night controls current sleep context (app.jsx:6997)")`,
    whose single assertion is
    `assert.equal(T.cleanAtDate({ sleep: { nights: [{ d: "2026-01-01", h: 5 }] } }, "2026-09-03"), false);`
    B1's owner-ruled D8 ("when last night's sleep is missing, recovery is UNKNOWN and no sleep
    restriction is applied today", `DECISIONS:60`) flips it.
  * **`D10`** — `witness("D10 calendar-week arithmetic counts elapsed DST hours (app.jsx:311)")`,
    guarded by `if (process.env.TZ === "America/New_York")`, whose two assertions are
    `Math.abs(T.weeksBetween("2026-03-08","2026-03-15") - 167/168) < 1e-12` and
    `Math.abs(T.weeksBetween("2026-11-01","2026-11-08") - 169/168) < 1e-12`.
    B1's owner-ruled D10 ("date-only week counts mean 7 CALENDAR days, not 168 elapsed hours") flips
    both.
* **No other site in the file is touched by either lane**, and the two lanes' sites do not overlap.
  So the two carriers are **mergeable by union**: at merge, one successor file must carry
  B2's nine substitutions **and** B1's D8/D10 substitutions, and its `EXPECTED_TAIL` must still be
  `DEFECT WITNESSES: 10/10 reproduced`. Whichever lane merges second simply adds its own entries to
  the other's `SUCCESSORS['defect-witnesses']` table; the `exactReplace` one-site rule guarantees a
  collision would refuse rather than silently double-apply. This is the brief's §4 / Q4
  recommendation restated with the exact site list the PM asked for.
* `witnesses-2` is **also** shared in principle (B1's D11/D13–D17/D19–D21 live there) but B2 adds
  only `D18` and preserves every other assertion, so the same union rule applies with no conflict.

---

## 7. Package-runner refusals (pinned engine bytes changed)

```
node rebuild/m4/spec/load-write-package.cjs --ci
LOAD PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
exit=1
```

That is the quoted refusal the task asked for. **But it is honest only with its attribution**, and
the attribution is a correction to the expected story: **the identical line, with the identical
exit code, is printed on the UNMODIFIED pre-image bytes too.** On this tip `load-write-package.cjs`
is superseded (`DECISIONS:97`, "load-write-package --ci is superseded on this tip"), so its refusal
is **not** a pinned-engine-bytes signal from B2.

The runner that *does* carry B2's product pins is the accepted parent's own, and there the
difference is sharp:

```
node rebuild/m4/spec/native-carriers-package.cjs --ci
  · pre-image bytes:  POSTFIX M2-NATIVE-CARRIERS AUTHORIZED artifact=295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1
                      NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   (exit 1)
  · B2 candidate:     NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld   (exit 1)
                      — and it never reaches the AUTHORIZED line, because Profile.verify() refuses first
```

Isolated:
```
node -e "require('./rebuild/m4/spec/native-carriers-profile.cjs').verify()"
  → ERR_ASSERTION :: Unchanged parent pin: rebuild/engine/volume.cjs
```

**That assertion is the pinned-engine-bytes refusal, and it is exactly right: the accepted parent
holds B2's three files and B2 changed them, so the closed profile refuses until B2's own artifact
supersedes those pins.** (The base-side failure after the AUTHORIZED line is the separate
environment limit the brief already recorded for a research clone.)

---

## 8. Frozen conformance suite, and the second gate

```
cd rebuild/conform; MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York; node run.cjs
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
exit=1
```

Byte-for-byte the same line the brief recorded at `ffabbca` and `87eddad`, and — verified by
`Compare-Object` over the two full logs — the **entire suite output is IDENTICAL on the pre-image
bytes and on B2**. It is the public-clone-without-the-private-directory state, not a B2 regression.
`INFO 9 engine-track rig185: W1 PASS, W2 PASS` on both sides; the only `BAD` line on both sides is
`BAD 7 privacy: … 0 private lines`, which is the absent private fixture.

```
node rebuild/engine/test/second-gate.mjs --candidate
SECOND GATE I/O tripwire: PASS — a caught unmocked request fails the process; zero delegated requests
SECOND GATE reference FINAL108: 3072 passed, 0 failed
SECOND GATE reference condition-origin counts: {…} exact executed-site multiset; NOT branch coverage
SECOND GATE reference vacuity gate — 9 known hit(s), baseline matched, nothing new
SECOND GATE reference SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8× …
SECOND GATE reference surface: byte-identical to committed baseline (123077 bytes)
FAIL second gate candidate engine-test: exit=1
FAILED ASSERTION tools/engine-test.jsx:106
SECOND GATE candidate: FAIL — second gate failed; inspect ignored public diagnostic logs
exit=1
```

**The pre-existing D12 abort at `tools/engine-test.jsx:106` occurred, and is NOT fixed** (by
instruction, and because the accepted D12 custody owns that site). It aborts identically on the
pre-image bytes. The reference (frozen) side completes `3072 passed, 0 failed` on both.

**Obligation carried forward, unchanged:** only **261 of 3,072** engine-test assertions are
observable without the D12 custody in place. The remaining ~2,811 must be re-run by the implementer
under that custody; any movement there is a §5(a) **RED stop** for an exact reviewed successor cell,
never a regenerated golden, never a suppressed assertion (brief §5, Q9).

---

## 9. Protected surfaces — verdict only

Per `DECISIONS:82` condition (2) and the brief §5. No cell values, no hashes, no prose.

* **P6 second-gate cells `tools/engine-test.jsx:8790–8793`** — reproduced directly at the gate's
  hard-pinned `2026-07-29` anchor on both engine copies:
  **UNCHANGED.** Both cells hold on the pre-image bytes and on B2. (Structurally expected: the
  fixture carries no `forks` on `ham` and every session is dated 2026-06-01…2026-06-15, so D30's era
  cut is inert there, D7's cut is `asOf`-gated and inert there, and D31/D32 are not on the
  `setOneRead` path.) These cells sit beyond the 261 observable assertions, so this is a direct
  reproduction, not a gate observation — flagged as such.
* **The seeded set-one laboratory card** (`sleep.cjs` `labAnalytics2`, whose `setOneRead` call at
  `sleep.cjs:1286` is the only engine consumer of `setOneRead`): **UNCHANGED at both matrix days.**
  Compared by digest between the two engine copies; digests withheld.
* **`rebuild/conform/private/live.json` and the private `live.main` golden**: never opened, never
  named with values, never hashed, never quoted. The `migrate-full` three-blob oracle and the
  private LIVE re-evaluation for **D30** — the only LIVE-TRIGGERED defect in B2 (register :384) —
  are **NOT RUN here** and remain the PM's own `--full` execution (`DECISIONS:92`, `:93` C4). If
  authorized private execution finds a consequence, the gate stays **RED** and a protected successor
  expectation is reviewed.
* **The frozen app** (`fe516c1:src/app.jsx`, blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`) —
  read only, via the frozen bundle build and `helpers.cjs`'s own pin check; never edited. The
  original 45-law seeds, `rebuild/conform/oracle`, every witness/differential/source test file and
  the seeded soak are byte-untouched (`git status` in §0.1 is the proof).
* **`ledger/`** was never opened.

---

## 10. Discrepancies between the brief and the executed code — code followed, brief recorded

Per the instruction "if brief and code disagree, follow the code and record it".

**D-1 (material, affects the artifact). The accepted parent DOES pin `rebuild/engine/volume.cjs`.**
Brief §6 states: "The accepted parent's `product` map pins plan/progression/sleep/today/writers/index
and the w7-preview pair — **`volume.cjs` is not in it**, so B2 introduces `rebuild/engine/volume.cjs`
(pre-image `c32298e7…`) as a new pinned product file". Read from the artifact itself,
`rebuild/m4/spec/acceptance-native-carriers.json.product` has **20 keys** and `rebuild/engine/volume.cjs`
is one of them, pinned at `c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4` — the
full list is plan, progression, sleep, today, writers, index, the two w7-preview files, performed,
entered-load, constants, dates, earn, energy, merge, migrate, oracle-shim, policy, seed, **volume**.
Executed proof: `native-carriers-profile.verify()` throws
`Unchanged parent pin: rebuild/engine/volume.cjs` on the B2 candidate. **Consequence: B2's artifact
must SUPERSEDE three parent product pins (plan, progression, volume) and carry the other seventeen
forward byte-identically. It introduces nothing.** The brief's §6 sentence must be corrected before
the artifact is written.

**D-2 (recorded in §3.1).** The brief's D31 hunk carries a **redundant conjunct**: on legacy states
`t.k !== lastK` is implied by `t.pts.some(p8 => p8.d < changedAt)`, so the brief's own named mutant
`post-change-check-on-the-dates-only` is an *equivalent* mutant and cannot be killed. The hunk is
left exactly as the brief specifies (minimal diff, brief fidelity), but the reviewer should know the
conjunct only earns its keep on a native (`workoutFacts`) row whose `observation.k` differs from
`reps.length`.

**D-3 (recorded in §3.1).** The brief's D31 mutant `post-change-check-is-inclusive-of-the-prior-day`
is **structurally unreachable** on legacy states.

**D-4 (recorded in §3.1).** The brief's D32 mutant
`replication-era-checked-on-the-block-start-only` is **structurally unreachable with D31 in force** —
a genuine D7 × D31 × D32 interaction found by execution — and
`replication-threshold-relaxed-with-the-era-cut` is **equivalent**, because `_blockSlope` enforces
`TREND_MIN_SESSIONS` itself. So D32 has **three** killable named mutants, not five.

**D-5 (attribution, §7).** The brief's §6 environment note and the task's expectation both frame
`load-write-package.cjs --ci` as the pinned-engine-bytes refusal. On this tip it refuses
**identically on the unmodified bytes** (superseded per `DECISIONS:97`). The pinned-engine-bytes
refusal is `native-carriers-package.cjs --ci` / `native-carriers-profile.verify()` →
`Unchanged parent pin: rebuild/engine/volume.cjs`.

**D-6 (confirmation, not a conflict).** The brief's §4 claim that B2 adds "**none at all** under
v1.1's narrowed hunk" inside the observable second gate is now proved by a byte-identical
candidate-side engine-test log across all 261 observed assertions, not just by the `:70` cell.

**D-7 (pins the brief does not carry).** `witnesses-3` sha256
`f5169bebd527ac13c8a570859bb5d728535a2a71734e135904a77be36c8506e6` and `witnesses-6`
`71a5fa27293b6e7837ec627b273b266db9d6c4987ff850fb6fe9e2a5f86092c4` are measured and pinned here for
the first time, so the "explicitly unchanged" claim is enforceable rather than asserted.

**D-8 (environment, not the brief's fault).** There is **no `npm.cmd` beside the codex runtime
node** on this PC; `npm ci --include=dev` had to use the machine's own npm. `package-lock.json` is
unmodified. `esbuild@0.28.1`'s postinstall is blocked by npm's allow-scripts policy, but
`@esbuild/win32-x64/esbuild.exe` is present and the bundle built cleanly, so nothing was approved or
worked around.

---

## 11. Reviewer open items

* **O-1 — file ownership.** `rebuild/m4/spec` is the **PM's** exclusive folder (`LANES.md`), yet the
  brief §6 places B2's artifact and runner there and the accepted precedent lives there. This build
  therefore wrote one new file into the PM's folder, `rebuild/m4/spec/b2-inherited-carriers.cjs`, on
  a branch that **does not merge**. The PM should either confirm the m4/spec placement for B-lane
  package files or name a lane-B location (e.g. under `rebuild/conform/v4/postfix/`, where the
  accepted D12 successor already lives) before anything merges.
* **O-2 — the brief is not accepted.** Q1 (parent chain), Q2 (`volume.cjs:159`), Q3 (reader-side
  `exId`), Q4 (`witnesses-1` serialization), Q5 (`witnesses-2` carrier), Q6 (three conditions),
  Q8 (this hunk shape) and Q9 (the unobserved second gate) are all still the PM's. This branch
  implements the brief's **recommended** answers: Q3 **in** (the two reader-side `exId` lines are in
  D3/D4), Q2 **out** (`volume.cjs:159` untouched), Q8 **(a)** (narrowed cut). Any other ruling means
  a rebase of this branch, not a rewrite.
* **O-3 — no artifact, no package runner.** `acceptance-b2-targets-identity-era.json` and
  `b2-package.cjs` are **not authored**: the artifact cannot be written before Q1 names the parent,
  and per `PLAN…:146` two packages cannot both claim one parent. The formal acceptance bar items that
  live in the runner — the `--full`/`--ci` two-mode dispatch, the receipt/PENDING lifecycle, the
  structural-fidelity diff over `PIN_PATHS`, the 19 gate identities, and the private census — are
  therefore **not** discharged here. What *is* discharged is listed in §2–§9.
* **O-4 — the ~2,811 unobserved second-gate assertions** (§8) must be run under the accepted D12
  custody. Any movement is a RED stop for a reviewed successor cell.
* **O-5 — the private LIVE census for D30** is the PM's own PC execution. Not run here.
* **O-6 — `volume.cjs:302` (`_setsMovesSince`)** carries the same unbounded `indexOf("via ")` owner
  test behind its own untouched 120-row cap. B2 does not widen it and does not repair it; it is a
  non-D register candidate either way. `volume.cjs:159` is the same shape and **is** widened in
  exposure by D18 — that is Q2, still unanswered, still untouched.
* **O-7 — the `RangeError` at `progression.cjs:271`** for a record that was never quarantined stays
  exactly where it is (register :30 scopes D2's FIX to `plan.cjs` only). Pinned by
  `d2xd1-quarantined-record-never-reaches-targetsfor`. Recorded as an unrepaired latent, not a B2
  obligation.
* **O-8 — Track A.** `targetsFor`'s signature is already `(ex, s)` from the carriers merge, but
  `programmeVolume`, `muscleVolume` and `targetsFor` are rendered by A1/A2 and B2 changes
  `programmeVolume`'s denominator (D28) and `muscleVolume`'s `delts_front` (D29). A's expectations
  must be written against post-B2 behaviour or re-pinned after merge (`PLAN…:149` risk 6).

---

## 12. Everything that was executed, as commands

```
git -C <design-pin> fetch origin rebuild/t2-client-core
git -C <design-pin> worktree add <worktree> -b rebuild/lane-b-b2 origin/rebuild/t2-client-core
git -C <worktree> diff --stat 87eddad..HEAD -- rebuild/engine rebuild/conform tools rebuild/m4/spec   → empty
C:\Users\joeym\AppData\Local\nodejs\npm.cmd ci --include=dev
node %TEMP%\b2-scratch\build-frozen.mjs <worktree> %TEMP%\earned-b2-frozen-wt
node rebuild\conform\v4\run-defect-laws.cjs                                   (base, then candidate)
node %TEMP%\b2-scratch\probe-details.cjs <worktree>                           (per-law frozen/candidate detail)
node %TEMP%\b2-scratch\mut-driver.cjs <worktree> %TEMP%\b2-scratch            (control + 57 mutants)
node %TEMP%\b2-scratch\extract-orig.cjs <worktree> %TEMP%\b2-scratch\engine-orig
node %TEMP%\b2-scratch\census.cjs <worktree> <engine-orig|engine-cand> 2026-09-03   (and 2026-09-07)
node %TEMP%\b2-scratch\census-diff.cjs <orig census> <cand census>
node %TEMP%\b2-scratch\bite-unlisted.cjs <engine-bite>\volume.cjs   + census + census-diff
node %TEMP%\b2-scratch\gate70.cjs <worktree> <engine-orig|engine-cand|engine-v1cut>
node %TEMP%\b2-scratch\witness-measure.cjs <engine-orig|engine-cand> defect-witnesses[-2|-3|-4]
node rebuild\engine\test\defect-witnesses[-2..-7].cjs                         (base, then candidate)
node rebuild\m4\spec\b2-inherited-carriers.cjs                                (candidate PASS, base FAIL)
node %TEMP%\b2-scratch\bite-d6.cjs <progression.cjs> apply | restore <saved>
node rebuild\m4\spec\load-write-package.cjs --ci                              (base and candidate)
node rebuild\m4\spec\native-carriers-package.cjs --ci                         (base and candidate)
node -e "require('./rebuild/m4/spec/native-carriers-profile.cjs').verify()"
cd rebuild\conform && node run.cjs                                            (base and candidate)
node rebuild\engine\test\second-gate.mjs --candidate                          (base and candidate)
node %TEMP%\b2-scratch\p6-verdict.cjs   <worktree> <engine-orig|engine-cand>  (protected, verdict only)
node %TEMP%\b2-scratch\lab-verdict.cjs  <worktree> <engine-orig|engine-cand>  (protected, verdict only)
```

Environment on every engine run: `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03` (except the
`:70` and P6 reproductions, which use the second gate's hard pin `2026-07-29`, and the frozen
conformance suite, which sets its own), `ENGINE_MAIN`/`ENGINE_OLD` = the gitignored
`rebuild/conform/engines/engine-main.cjs`. Which anchor produced which piece of evidence is stated
at that piece of evidence, as the brief §6 requires.

**Verdict of this build: the fourteen hunks are in, 14/14 laws GREEN on the candidate and RED on the
frozen engine with no other law moved, 53 of 57 named source mutants caught and the other four proved
equivalent or unreachable, the public census delta is the single D6 cell the brief predicted, the
protected `:70` cell does not move, both protected surfaces are UNCHANGED, and the three witness
carriers are authored as pinned successors rather than edits. The package bar is NOT met and is not
claimed: no artifact, no package runner, no private census, no second gate beyond its 261 observable
assertions, and no accepted brief.**

---

# POST-REVIEW r1 — the fixer's pass

2026-09-11 · lane-B **fixer** (Opus; author ≠ builder ≠ reviewer), working directly on the owner's PC in the
same worktree `work/lane-b/b2`, branch `rebuild/lane-b-b2`, reset hard to `origin/rebuild/lane-b-b2` @
`5a4205c` (clean tree) before any edit. Contract read first, in full:
`rebuild/lanes/b/reviews/B2-REVIEW-r1.md` (305 lines, **ACCEPT WITH CHANGES**),
`rebuild/lanes/b/BUILD-REPORT-B2.md` (910 lines), `rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.1.md`
(573 lines), `rebuild/lanes/LANES.md` incl. its Amendments, `rebuild/DECISIONS.md` 60, 82, 88–100.
`ledger/` and `rebuild/conform/private` were **never opened**; every protected surface is verdict-only.
`package-lock.json` is unmodified; no other worktree was touched.

## R.0 What this pass changed, in two commits

| commit | files | why |
|---|---|---|
| **1 — fixes + brief v1.2** | `rebuild/engine/progression.cjs` (D3 boundary), `rebuild/lanes/b/b2-delta-cells.cjs` (**new**), `rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.2.md` (**new**), this report | review Changes 1, 3, 5 + bite B-2 |
| **2 — PM-optional Q2** | `rebuild/engine/volume.cjs` | review Change 2. Titled so it can be reverted whole if the PM carries Q2 to B3. |

Review **Change 4** (the `REQUESTS.md` line for `rebuild/m4/spec/b2-inherited-carriers.cjs`) needed no new
work: the line is **already filed** on the tip at `16302cd` — `rebuild/lanes/REQUESTS.md`, 2026-09-11
02:10 ET, B → PM, "…Also: permission for lane-B carrier files under rebuild/m4/spec
(b2-inherited-carriers.cjs is already on the b2 branch; LANES.md gives m4/spec to the PM) — or name a
lane-B path for carriers". `REQUESTS.md` is a shared append-only file on the integration tip, not on this
branch, which is why this worktree's copy does not show it; nothing was appended twice. Recorded in brief
v1.2 §v1.2-A6.

### R.0.1 Product files — sha256, this pass

| file | at `5a4205c` (reviewed) | after commit 1 | after commit 2 |
|---|---|---|---|
| `rebuild/engine/plan.cjs` | `4c6f981706694771501d3d050440eb4f9a62e64b6eac7c59ff9c4742dfaa7e93` | unchanged | unchanged |
| `rebuild/engine/progression.cjs` | `ad989ed4edc1094244491e7d68bdb9ddb1c795f9797e699edfdad2652a52c70a` | **`9adaeecb715e42533fcd51483e67f52a9d8d530a0de80865e28ae572152599a8`** (54,466 B, 902 lines) | unchanged |
| `rebuild/engine/volume.cjs` | `73550ef80b17f9517923c0ecc69783c89aa24a6670dd13c0a464cc57d4a2a9be` | unchanged | **`4a04f4e81ca8debdce36b1b4f4a0957c413a9c6dc9289583a500f878ae66ed9c`** (24,444 B, 318 lines) |

Pre-image (base `acd3b67`) re-verified byte-exact from git before every base-side run:
`plan.cjs 1b26c87f…` 19,784 B · `progression.cjs 7031838d…` 53,582 B · `volume.cjs c32298e7…` 23,465 B.

New files:

| file | sha256 | size |
|---|---|---|
| `rebuild/lanes/b/b2-delta-cells.cjs` | `0b0a240df4f623863a67a2bee1fff0e7d36ad902f572eb7a99e51eb12fd60e12` | 14,162 B, 259 lines |
| `rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.2.md` | `24241aeb5bc53a621acd2373348b06b679911d6438cf31ce713eb5e9709c6370` | 115,534 B, 896 lines |

`rebuild/m4/spec/b2-inherited-carriers.cjs` is **unchanged** by this pass
(`f023ad8c8ef15809cefea577e7835f3bd7bfb864af3b7f33875983d773ead00d`, 12,543 B). No frozen law, golden,
tool, witness file, `tools/` path, `rebuild/conform/**` path or accepted artifact was edited; `migrate.cjs`,
`earn.cjs`, `writers.cjs`, `merge.cjs` (B3's) and `dates.cjs`, `sleep.cjs`, `policy.cjs`, `today.cjs`
(B1's) are byte-untouched.

## R.1 The 45-law runner — re-run on BOTH sides, with and without the Q2 commit

Frozen bundle: the gitignored `rebuild/conform/engines/engine-main.cjs`, sha256 re-verified before each run
as `a575ac58a55c5e2929b584be6ed6b1d5db8c36c81b449415d0909dc4b1958eec` (814,639 B). Base side produced by
`git checkout acd3b67 -- <the three files>` in place, sha-verified, then restored byte-exactly (asserted).

```
TZ=America/New_York  node rebuild\conform\v4\run-defect-laws.cjs
```

| run | TOTAL line | exit |
|---|---|---|
| BASE (`acd3b67` bytes) | `TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| CANDIDATE, commit 1 (no Q2) | `TOTAL 45 laws · 45 RED-frozen · 25 RED-candidate · 88 GREEN repair controls · 83/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| CANDIDATE, commit 2 (Q2 in) | **identical to the line above** | 1 |

**Line-by-line diff of the two 47-line outputs: MOVED LINES = 15 — the fourteen laws and the TOTAL line,
nothing else — on BOTH candidate variants.** The fourteen, each `RED-frozen / RED-candidate` →
`RED-frozen / GREEN-candidate`:

```
D1  P-D1-first-targets-fit-current-set-count
D2  E-D2-invalid-set-count-stays-quarantined
D3  P-D3-volume-receipt-belongs-to-whole-lift-name
D4  P-D4-other-lift-earn-cannot-spend-sightings
D5  P-D5-ladder-minimum-counts-distinct-rungs
D6  P-D6-deload-preserves-absent-load
D7  P-D7-anchor-and-trend-exclude-future-sessions
D9  E-D9-split-selects-latest-effective-date
D18 P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix
D28 E-D28-programme-volume-follows-the-current-effective-split
D29 P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit
D30 P-D30-first-set-trend-respects-the-recorded-technique-era
D31 V4-volume-tolerance-post-change
D32 V4-volume-replication-same-era
```

No other law moved status on either side. The six accepted repairs (D12, D33, D34, D35, D41, D43) are
GREEN-candidate on both sides, so `39 → 25` is the fourteen exactly. The two predicted side effects
reproduce to the number: GREEN repair controls `89 → 88` (D29's non-idempotent control) and detected mutant
executions `97/104 → 83/104` (the fourteen laws' export-wrapper mutants going inert on a repaired source).
`AUDIT RED-FIRST FAIL` is the runner's own all-45-must-be-RED rule on both sides and is not B2's.
**D18's law is GREEN on the candidate with the Q2 hunk in** — the Q2 change does not weaken the repair it
sits inside.

## R.2 Q2 — the reviewer's misattribution case, proved correct

Cell file `rebuild/lanes/b/b2-delta-cells.cjs`, cells `B2-Q2a…2e`, on the reviewer's own r1 §7 B-1 fixture
(lifts `Press` id `press` and `Press incline` id `inc`; 95 ordinary feed notes; then one current-week
receipt `VOLUME +1 — CHEST via Press incline (now 3 sets)` at row 95):

```
CELL HOLDS  B2-Q2a  a current-week VOLUME receipt for "Press incline" PAST feed row 80   ["inc"]
CELL HOLDS  B2-Q2b  the same receipt at feed row 0 — the owner bug is pre-existing        ["inc"]
CELL HOLDS  B2-Q2c  D18 still SEES the receipt past the cap                               {"seenPastRow80":true}
CELL HOLDS  B2-Q2d  a lift whose NAME contains " (now " keeps its own structural move     ["pnh"]
CELL HOLDS  B2-Q2e  NEGATIVE CONTROL: VOLUME PASSED is still not a move                   0
B2 DELTA CELLS: 21/21 HOLD · side CANDIDATE · Q2 APPLIED
```

The same file, run against the three engine states, gives the whole table:

| state | `structuralMovesThisWeek().sets` (row 95) | (row 0) | name contains `" (now "` |
|---|---|---|---|
| base `acd3b67` | `[]` (invisible past the cap) | `["press"]` | `["press"]` |
| B2 without Q2 | `["press"]` — **misattributed** | `["press"]` | `["press"]` |
| B2 with Q2 | **`["inc"]`** | `["inc"]` | `["pnh"]` |

The cell file detects the side and the Q2 state from the engine itself and asserts the pinned value for
whichever it finds, so it exits 0 on base, on commit 1 and on commit 2 — and it names in its own output
which of the three it observed. Reverting commit 2 therefore leaves the cell file correct and passing.

## R.3 D3 — a lift's OWN receipt is no longer dropped (reviewer bite B-2, fixed)

One line of `progression.cjs` (brief v1.2 §v1.2-A1): C3's whole-name boundary now splits at the **last**
`" (now "` and also accepts the whole tail, so a lift whose own name contains the producer's delimiter keeps
its own receipt while the shorter lift still refuses it. Cells `B2-DELTA-3a…3f`:

```
                                                         base            v1.1 hunk   v1.2 hunk
"Press (now heavy)" reads its OWN receipt                 [["…",1]]       []          [["2026-09-01",1]]
"Press" reads that same receipt                           [["…",1]]       []          []
"Press (now heavy)", row with NO " (now …)" suffix        [["…",1]]       [["…",1]]   [["2026-09-01",1]]
"Press" vs "Press incline"'s receipt  (D3 proper)         [["…",1]]       []          []
VOLUME PASSED (no "via ")                                 []              []          []
exId match / mismatch  (C2 terminal)                      [..] / [..]     [..] / []   [..] / []
```

The `witnesses-1` D3 substitution in `rebuild/m4/spec/b2-inherited-carriers.cjs` (whose fixture row carries
no ` (now …)` suffix) is unaffected and still flips; the carrier is unchanged and still applies 17
substitutions.

## R.4 D7 — the reviewer is right, and no caller was invented

**Source fact, now an executable cell (`B2-D7a`).** The cell walks every `*.cjs` in the engine directory,
finds each `liftTrend(` call, extracts its balanced argument list, skips the declaration and the late-bound
`(...args) => E.liftTrend(...args)` delegates, and asserts that **none** of the remaining call sites
contains `asOf`:

```
["progression.cjs:815","progression.cjs:847","sleep.cjs:1748","sleep.cjs:1748","volume.cjs:245","volume.cjs:284","writers.cjs:1399"]
```

`liftTrend(s, id)` · `liftTrend(s, t.id, { cleanOnly, minN })` · `liftTrend(s, tpl.exA|exB)` ·
`liftTrend(s, exId)` · `liftTrend(s, exId, { window: 999 })` · `liftTrend(s, ex.id)`. **Not one supplies
`opts.asOf`.** `regime` takes its earlier view through `energy.cjs:214`/`:634` → `_stateAsOf` state
truncation, not through `liftTrend`. **So the `liftTrend` half of D7 is inert on every engine-internal
path, and the brief's "every `liftTrend` consumer that passes one (`progressionTrend`, `liftCall`,
`volumeConversion`, `regime`)" sentence is wrong.** Corrected in brief v1.2 §v1.2-A3, and corrected here.
**No call site was added, and the guard was not removed.**

**But the guard is NOT dead code, and the law says so.** Executed on this branch with
`if (opts && opts.asOf && d > atT) continue;` deleted from `liftTrend` (mutant `progression.cjs` sha256
`31d976f8687b1d07da661ddd3ff6cbcce360f6c628198e3c62b0100742cd5931`), everything else identical:

```
with the guard     D7 P-D7-anchor-and-trend-exclude-future-sessions · RED-frozen / GREEN-candidate / AUDIT-FAIL
                   TOTAL 45 laws · 45 RED-frozen · 25 RED-candidate · 88 controls · 83/104 · exit 1

without the guard  D7 P-D7-anchor-and-trend-exclude-future-sessions · RED-frozen / RED-candidate / AUDIT-FAIL
                   TOTAL 45 laws · 45 RED-frozen · 26 RED-candidate · 88 controls · 84/104 · exit 1
                   (D31 stays GREEN-candidate; D7 is the ONLY law that moves)
```

**Answer to "does the brief's D7 law need the `asOf` path to turn GREEN": YES, explicitly.** The law's own
`run` calls `T.liftTrend(s, ex.id, { asOf: '2026-09-03' })` and requires `trend === null`
(`rebuild/conform/v4/laws-clock-and-as-of.cjs:11`), and the `witnesses-1` D7 substitution asserts the same
shape (`defect-witnesses.cjs:55` supplies `{ asOf: "2026-09-03" }`). The honest statement is therefore two
clauses, both executed: **inert to every in-engine consumer, load-bearing to the oracle and to the exported
API.** `progression.cjs` was restored byte-exactly after the experiment (asserted by sha).

Behavioural halves, cells `B2-D7b/7c/7d`, base → candidate:

```
liftTrend(s,id)                   n=4, 2026-09-10 → 2026-09-13   ==   n=4, 2026-09-10 → 2026-09-13   (identical: the narrowing)
liftTrend(s,id,{asOf:'2026-09-03'}) a 4-point trend               →    null
liftTrend(s,id,{asOf:'2026-09-14'}) n=4                           →    n=4        (a later as-of still sees them)
progressAnchor(ex,s)              [11,10]                         →    [8,7]      (the half that IS live in-engine)
```

## R.5 The three unlisted delta sites — enumerated, executed, pinned

New lane-B cell file `rebuild/lanes/b/b2-delta-cells.cjs` (21 cells; exits 0 on base and on candidate,
naming which side it observed). It is **not** a frozen witness and lives in lane B's own folder
(`LANES.md`: lane B owns `rebuild/lanes/b/*`); it edits nothing.

**(i) `migrate.cjs:1629` — the third `_bornValid` consumer.** `migrate.cjs` is **B3's** file and **not one
byte of it was edited**; the delta arrives through `plan.cjs`'s repaired predicate. `patchV51` (the split
patch) binds `const bornValid = _bornValid;` and its `put()` judges a pre-existing record wearing a new id
with `const wasValid = bornValid(have)`. Measured by replaying the patch (state re-stamped to `v: 50`, the
seeded `fly` replaced by a brought record) — cells `B2-DELTA-1a/1b/1c`:

| brought `fly` | base | B2 candidate |
|---|---|---|
| `sets: -1` | `quarantined: null`, filled (`w`, `inc`, `setsAt` stamped) | **`quarantined: "invalid:2026-08-12"`, NOT filled** |
| `sets: 0` · `sets: 3.5` · `hi: 0` | `null` · `null` · `null` | `invalid:2026-08-12` ×3 |
| `sets: 2, hi: 20` (control) | `null`, filled | `null`, filled — unchanged |

`put` returning **false** means no seams, no insertion markers and no FRESH BASELINE receipts fire for that
record. This is the site's own F1 rule ("quarantined IFF invalid") finally holding, so it is very likely the
*intended* consequence of D2 — but it is a behaviour delta in a file outside B2's allowlist and it is not in
§1.2's delta list. **B3 must be told: it rebases onto a tree where `patchV51` quarantines impossible brought
records instead of healing them.** No edit was made and none is proposed here.

**(ii) `targetsFor({sets:-1, first:[8]})`.** Cells `B2-DELTA-2a/2b/2c`:

```
targetsFor({sets:-1, last:null, first:[8]}, {sessionLog:{}})   base [8]    ->   candidate []
targetsFor({sets:-1, last:null},            {sessionLog:{}})   RangeError on BOTH sides (unchanged, per §1.2)
targetsFor({sets: 3, last:null, first:[8,7]})                  [8,7] -> [8,7,6]   (D1's own repair, already pinned)
```

`fitN` is `arr.slice(0, ex.sets)` plus a `while (t9.length < ex.sets)` pad, so a negative `ex.sets` makes
`slice(0,-1)` drop the last element and the pad loop never runs. Reachable only for a record that was never
quarantined. Added to §1.3's delta list in brief v1.2.

**(iii) D3's boundary dropping a lift's OWN receipt** — **fixed**, §R.3 above.

## R.6 Carriers, witnesses and the flips — re-measured

`node rebuild\m4\spec\b2-inherited-carriers.cjs`, unchanged file, both candidate variants:

```
CANDIDATE (commit 1, and commit 2):
  B2 CARRIER defect-witnesses-6: PASS; 8 cases; 0 exact expectation substitution(s) (unchanged);
    M6 preserved defects native: 4/4 PASS; frozen and candidate execute every merge witness.
  B2 INHERITED CARRIERS: 5/5 PASS; 17 exact substitutions (…); PACKAGE receipt PENDING    exit 0
BASE (acd3b67 bytes):
  B2 INHERITED CARRIERS FAIL at defect-witnesses: ERR_ASSERTION                            exit 1
```

Failure-tolerant flip measurement (original witness bytes read, never written; the tolerant `witness`
wrapper is an in-memory exact replacement):

| gate | base | B2 candidate | flips |
|---|---|---|---|
| `witnesses-1` `defect-witnesses` | **10/10 reproduced** | **2/10** | D1 D2 D3 D4 D5 D6 D7 D9 — **8** (D8, D10 still reproduce; they are B1's) |
| `witnesses-2` `defect-witnesses-2` | 10/11 (D12 already RED) | **9/11** | D18 — **1** |
| `witnesses-3` | 5/5 | **5/5** | **0** |
| `witnesses-4` | 5/5 | **0/5** | D28 D29 D30 D31 D32 — **5** |

**14 assertion flips across three files (8 + 1 + 5)** — the builder's and the reviewer's numbers exactly,
with the corrected D3 hunk and with the Q2 hunk in.

Direct `node rebuild\engine\test\defect-witnesses[-2..-7].cjs` exit codes:
base `0 · 1 · 0 · 0 · 1 · 0 · 1`, candidate `1 · 1 · 0 · 1 · 1 · 0 · 1` — identical to r1.
`witnesses-5` and `witnesses-7` fail identically on both sides: pre-existing at this tip, not a B2 delta.

## R.7 The protected second-gate cell `tools/engine-test.jsx:70` — still does not move

Reproduced directly at the gate's hard pin `MEASURED_TEST_NOW="2026-07-29"` (`second-gate.mjs:64`) over
`tools/snapshots/2026-08-06-ledger.json`, whose sha256 re-verified as
`62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f` (the brief's pin) on every run:

| engine | `nLifts` | `state` | `nExcludedNonNumeric` / `excludedIds` | `:70` |
|---|---|---|---|---|
| pre-image bytes | 3 | `unknown` | 2 / `["curl","hanging"]` | **holds** |
| **B2 candidate (both commits)** | **3** | **`unknown`** | 2 / `["curl","hanging"]` | **holds — the cell does NOT move** |
| v1's unconditional `liftTrend` cut (rebuilt here) | **0** | `unknown` | 2 / `["curl","hanging"]` | **fails — the cell flips** |

## R.8 Public census and the public conformance suite — base vs candidate

**Direct-call census** (the builder's `census.cjs`: the thirteen full-engine reads over the seeded state,
per lift over all 16 seeded lifts, at both matrix days), base → candidate **with the corrected D3 hunk and
with the Q2 hunk in**:

```
===== 2026-09-03  base -> candidate =====      ===== 2026-09-07  base -> candidate =====
/perLift/fly/deloadLoad: 5 -> null             /perLift/fly/deloadLoad: 5 -> null
/perLift/hipthrust/deloadLoad: 5 -> null       /perLift/hipthrust/deloadLoad: 5 -> null
cells changed: 2                               cells changed: 2
```

**Exactly the single D6 cell — `deloadLoad` for `fly` and `hipthrust`, `5 → null` — at both matrix days.
Nothing else moved.** Neither the D3 boundary correction nor the Q2 hunk adds a census cell (the seeded
feed is 9 rows and carries no VOLUME receipt; no seeded lift's name contains `" (now "`).

**`rebuild/conform/run.cjs`** (`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`), base vs candidate:

```
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families   (exit 1)
```

on **both** sides, with the **entire 82-line stdout identical (0 differences) and 0-byte stderr on both**.
The only `BAD` line on both is the absent private fixture on a public clone; not a B2 regression.

**`second-gate.mjs --candidate`**, base vs candidate:

* reference side completes `SECOND GATE reference FINAL108: 3072 passed, 0 failed` on both, with identical
  condition-origin counts, vacuity gate, SYNC-LAWS and `reference surface: byte-identical to committed
  baseline (123077 bytes)`;
* candidate side aborts at the same pre-existing D12 cell on both —
  `FAILED ASSERTION tools/engine-test.jsx:106` — the site the accepted custody owns;
* `.tmp/m2-second-gate/candidate-engine-test.stdout.log` is **267 lines on both sides with ZERO
  differences**, and the 12-line driver stdout and 179-byte stderr are identical.

So **B2 adds no failure inside the 261 observable assertions**, with the corrected D3 hunk and with Q2 in.
The remaining **2,811** assertions stay unobserved without the accepted D12 custody — residual risk R-2,
still open, still §7 Q9.

## R.9 Protected surfaces — verdict only

* **P6 second-gate cells `tools/engine-test.jsx:8790–8793`**, reproduced on both engine copies at the
  gate's `2026-07-29` anchor: **UNCHANGED** — both cells hold on the pre-image bytes and on B2. No cell
  values, no hashes, no prose.
* **The seeded set-one laboratory card** (`sleep.cjs:1141` `labAnalytics2`, whose `setOneRead` call at
  `sleep.cjs:1286` is the only engine consumer of `setOneRead`), compared by digest between the two engine
  copies at both matrix days: **UNCHANGED**. Digests withheld.
* **`rebuild/conform/private/live.json`, the private `live.main` golden and `ledger/`**: never opened, never
  named with values, never hashed, never quoted. The private LIVE census for D30 remains the PM's own
  `--full` on the owner's PC.

## R.10 The reviewer's bites, re-run on both engine copies

| bite | re-run result |
|---|---|
| **B-1** D18 × `volume.cjs:159` | reproduced exactly (`[]` → `["press"]`), and **closed** by the Q2 commit (`["inc"]`). §R.2. |
| **B-2** D3 boundary vs a name containing `" (now "` | reproduced (`[["2026-09-01",1]]` → `[]` under the v1.1 hunk) and **fixed**. §R.3. |
| **B-3** D32 technique-era boundary sweep (the accepted witness's own fixture) | fork none / `2025-01-01` / `2026-01-01` (the prior block's FIRST date — the inclusive `f.from <= d` boundary, honoured) / `2026-09-20` (future) → `REPLICATED` on **both** sides; fork `2026-01-02` and `2026-04-01` → `REPLICATED` (base) → **`OUTCOME-COMPATIBLE`** (candidate); a **foreign** lift's forks cannot change the tier (`REPLICATED` on both); both `why` strings are the pre-existing prose — no new string. No defect found. |
| **B-4** D5 duplicate rungs, coercion, D5×D6 | `loadRungs([100,100])` and `([100,"100"])` → `null` (base `[100]`); `[100,105]` and `[105,100]` → `[100,105]` on both; `parseRungs("100,100")` → `null` vs `[100]`; `parseRungs("100,105,100")` → `[100,105]` on both; duplicate-only ladder at `w:100`: `maxedOut` `true→false`, `nextLoad` `null→105`, `deloadLoad` `100→95`, `snapLoad` `100` on both; **D5×D6** duplicate ladder + `w:null` → `0` (base) → `null` (candidate). No defect found. |
| **B-5** D7 future sessions with and without `asOf` | reproduced exactly. §R.4. |
| **B-6** D7 × D30 | a future in-era session: `setOneRead` = `LIVE n=4 (2026-08-10 → 2026-09-13)` on **both** engines — D7's cut was **not** extended into `setOneRead`, as `BRIEF-SET-ONE-ERA.md:19` requires. Cross-era (fork `2026-09-01`): `LIVE n=4` (base) → `COUNTING n=1 need=4` (candidate), as designed. |
| **B-7** D9 × D28, unsorted multi-row split | `dayType` for `2026-09-01/02/03` = `["U","U","REST"]` (base, last-array-row) → `["REST","REST","REST"]` (candidate, latest effective date — i.e. it now agrees with the sorted reading, which is `["REST","REST","REST"]` on both); `programmeVolume` chest `9 → 3` (the authored July week → the query week); `structuralMovesThisWeek.monday` `2026-08-31` on both and agrees with `programmeVolume`'s week. Both repairs exercised together. No defect found. |
| **B-8** the D2 predicate directly | base returns `true` for `sets:-1`, `sets:0`, `sets:3.5`, `hi:NaN`, `hi:0`; candidate returns `false` for all five and `true` for `{sets:3,hi:10}` and `{sets:3.0,hi:10.5}`. The `RangeError` from `targetsFor` on a still-unquarantined impossible record with no `first` survives on both. |
| **B-9** D6's guard shape vs its siblings | `[nextLoad, prevLoad, deloadLoad]` — `w:null` `[null,null,5]`→`[null,null,null]`; `w:""` same; `w:"   "`, `w:false`, `w:0` `[5,5,5]` on both (`w:0` must not change, and does not); `w:"100"` `[105,95,95]` on both. |

## R.11 What this pass could NOT do

* **The package acceptance bar is still not met and is still not claimed.** No
  `rebuild/m4/spec/acceptance-b2-targets-identity-era.json`, no `b2-package.cjs`, no 19-gate identity run,
  no `--full`, no receipt, no authorized rerun. The artifact cannot be written until the PM rules **which B
  package is first** (`REQUESTS.md` 02:20 ET / 02:10 ET, both unanswered); two packages cannot claim one
  parent. Brief v1.2 §v1.2-A5 now states the correct `product` shape for whenever it is written.
* **The 2,811 unobserved second-gate assertions** cannot be reached without the accepted D12 custody, which
  this fixer does not own and did not author. Residual risk R-2 stands; §7 Q9 is not closed.
* **The private LIVE census for D30** was not run: it needs `rebuild/conform/private/live.json` and is the
  PM's own `--full` on the owner's PC by `DECISIONS:92`/`:93` C4. Nothing private was opened.
* **Q1, Q3, Q4, Q5, Q6, Q7, Q8, Q9 are not answered** — they are the PM's. Q2 is answered only in the sense
  that its hunk now exists on a commit the PM can revert in one step.
* **`migrate.cjs:1629` was not edited** (B3's file) and **`volume.cjs:302` (`_setsMovesSince`) was not
  repaired** — both are recorded, neither is a B2 hunk.
* **No caller was invented for `opts.asOf`.** The guard stays, its inertness is stated, and the D7 law's
  dependence on the `asOf` path is proved by executing the law without the guard.
* **`rebuild/lanes/STATUS.md` was not edited** (per this fixer's instruction); the STATUS line is handed back
  in the final message for the lane lead to append.

## R.12 Everything this pass executed, as commands

```
git -C <b2> fetch origin ; git -C <b2> reset --hard origin/rebuild/lane-b-b2      -> clean at 5a4205c
node .tmp\fixer\setup.js            -> engine-base (acd3b67 bytes, sha-verified), engine-cand, engine-noasof
node .tmp\fixer\v1cut.js            -> engine-v1cut (v1's unconditional liftTrend cut)
node .tmp\fixer\laws.js noq2 | q2   -> run-defect-laws.cjs base & candidate, in place, restored + line-diff
node .tmp\fixer\noasof.js           -> the same runner with D7's asOf guard deleted, restored
node .tmp\fixer\gates.js            -> b2-inherited-carriers.cjs, defect-witnesses[-2..-7], b2-delta-cells.cjs, :70 x3
node .tmp\fixer\flips.js            -> failure-tolerant witness flip counts, both engine copies
node .tmp\fixer\census.js base cand -> census x 2 days + structural diff
node .tmp\fixer\suite.js            -> rebuild/conform/run.cjs and second-gate.mjs --candidate, both sides, diffed
node .tmp\fixer\bites.js  <engine>  -> r1 bites B-4, B-6, B-8, B-9
node .tmp\fixer\bites2.js <engine>  -> r1 bites B-3, B-7 on the witnesses-4 fixture shape
node <builder p6-verdict.cjs | lab-verdict.cjs> <engine>   -> protected surfaces, verdict only
node rebuild\lanes\b\b2-delta-cells.cjs [engineDir]        -> 21/21 on base, on commit 1 and on commit 2
```

Every engine run: `TZ=America/New_York`; `MEASURED_TEST_NOW=2026-09-03` except the `:70` and P6
reproductions, which use the second gate's hard pin `2026-07-29`, and the frozen conformance suite, which
sets its own. `.tmp/` is gitignored (`.gitignore:4`); nothing from it is committed. After every base-side
run the three product files were restored and asserted byte-identical by sha256.

**Verdict of this pass: the five required changes are in (three as edits, one as a correction of record, one
already filed as a REQUESTS line); the reviewer's own B-2 regression is fixed; the fourteen laws are still
14/14 GREEN-candidate / RED-frozen with MOVED LINES = 15 and D18 GREEN with the Q2 hunk in; the carrier is
5/5 with 17 substitutions and the flips are still 8 + 1 + 5; `tools/engine-test.jsx:70` does not move; the
public census delta is still the single D6 cell; `rebuild/conform/run.cjs` and the observable second gate
are byte-identical base vs candidate; both protected surfaces are UNCHANGED. The package bar is NOT met and
is not claimed.**


---

# POST-REVIEW r2 — lane-B fixer round 2

2026-09-11 · Opus **fixer round 2** of LANE B (author ≠ builder ≠ r1 reviewer ≠ r2 reviewer ≠ r1 fixer),
working directly on the owner's PC in `work/lane-b/b2`, branch `rebuild/lane-b-b2`. Review of record:
`rebuild/lanes/b/reviews/B2-REVIEW-r2.md` — **ACCEPT WITH CHANGES**, sha under review
`07fba76695b0c70ac41f8f287b4104f3d57b5904`, base `acd3b67`. **All four required changes concern the
PM-OPTIONAL Q2 commit and §2's text; `f70dd23` needs none and received none.** `ledger/` and
`rebuild/conform/private/**` were never opened. No frozen law, witness file, tool, golden, accepted
artifact or `package-lock.json` byte moved. No other worktree was touched.

## R2.0 What changed, and the shape of the branch

| item | value |
|---|---|
| branch before | `acd3b67` → `c39d1cb` → `5a4205c` → `f70dd23` → `07fba76` → `c4129c9` (r2 review file) |
| branch after | `acd3b67` → `c39d1cb` → `5a4205c` → `f70dd23` → **r2 review file** → **post-r2 fixes (docs + cells)** → **ONE Q2 commit** |
| why the reshape | the task's constraint and r2 §5.2's guarantee: the Q2 work must stay in **exactly one** commit sitting on `f70dd23`-equivalent **product** content, so `git revert <Q2>` still returns the tree to `f70dd23` byte-for-byte. `07fba76` is **replaced**, not amended in place, because its hunk is superseded. The review file stays on the branch, committed **before** the new Q2 commit. |
| node | `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` **v24.19.0**, by full path · `TZ=America/New_York` · `package-lock.json` unmodified · `node_modules` present (39 entries) |
| frozen bundle | the gitignored `rebuild/conform/engines/engine-main.cjs`, sha256 `a575ac58a55c5e2929b584be6ed6b1d5db8c36c81b449415d0909dc4b1958eec`, 814,639 B (the builder's; re-verified by sha before use). `engine-old.cjs` is **not** present on this clone — see R2.7 for what that changes in `run.cjs`'s output (nothing that differs between sides). |

**Files this pass touched, and nothing else:**

```
M  rebuild/engine/volume.cjs                                      (the Q2 commit — ONE delegate + ONE find predicate)
M  rebuild/lanes/b/b2-delta-cells.cjs                             (+7 cells: 21 -> 28)
A  rebuild/lanes/b/BRIEF-B2-TARGETS-IDENTITY-ERA-v1.3.md          (v1.2 carried whole; §2 C3/C6 corrected in place; four new sections)
M  rebuild/lanes/b/BUILD-REPORT-B2.md                             (this section)
```

`plan.cjs` and `progression.cjs` are **byte-identical to `f70dd23`** (`4c6f9817…` / `9adaeecb…`,
re-verified after every experiment). `volume.cjs` goes `73550ef8…` (`f70dd23`) →
`30e4dc2153fd8f4a8dbe3769f686065171215f79228903a547cc34359ea5befc` with the Q2 commit; the withdrawn
`07fba76` volume.cjs was `4a04f4e8…`. `BRIEF-…-v1.2.md` is **kept** on the branch for audit; v1.3
supersedes it.

## R2.1 Required change 1 — the Q2 hunk lost a correctly-attributed move. Reproduced, then fixed.

**Reproduced on the tip (`c4129c9`, product content = `07fba76`) BEFORE any edit**, exactly as r2 §6 R2-A
describes it. Lift `p9`, current name `Press`, `renames:[{prevN:"Press heavy"}]`, one current-week receipt
written under the former name `VOLUME +1 — CHEST via Press heavy (now 3 sets)`:

```
                                           base(acd3b67)  no-Q2(f70dd23)  Q2 reviewed(07fba76)  Q2 SHIPPED
_volDeltas(p9, s)                          [["…",1]]      [["…",1]]       [["…",1]]             [["…",1]]
structuralMovesThisWeek().sets             ["p9"]         ["p9"]          []   <-- LOST         ["p9"]
… the same with forks:[{prevN:"Press wide"}]  ["p8"]      ["p8"]          []   <-- LOST         ["p8"]
```

The reviewed hunk compared `own9`/`tail9` against `x.n` **only**. `"Press heavy" !== "Press"`, so the move
vanished — while `_volDeltas`, which resolves through `_formerNames`, went on crediting it. Two readers,
two owners, one receipt: a **§2 C6** violation, and a deviation from **C3**'s own "`===` against
`_formerNames(ex)`". `structuralMovesThisWeek().sets` feeds the Auto-Pilot tighten veto, the `volumePush`
week budget and the offer-expiry branch (`writers.cjs:2313`), so a lost move is a week budget that believes
no set was added.

**The fix, exactly as r2 prescribed** — the former-name term supplied by a **late-bound `E._formerNames`
delegate**, the pattern `volume.cjs:16` already uses for `liftTrend` and `migrate.cjs:12` already uses for
`_formerNames` itself. **`volume.cjs` gains no `require`.**

```
+const _formerNames = (...args) => E._formerNames(...args);   /* Q2 — §2 C1 … so volume.cjs still gains no require */
 const _tCrit = (...args) => E._tCrit(...args);
...
-    const ex = (s.exercises || []).find((x) => (f.exId != null ? String(f.exId) === String(x.id) : (own9 === x.n || tail9 === x.n)));
+    const ex = (s.exercises || []).find((x) => (f.exId != null ? String(f.exId) === String(x.id) : _formerNames(x).some((n9) => n9 && (own9 === n9 || tail9 === n9))));
```

That predicate is now the same shape `_volDeltas` runs at `progression.cjs:232–236`: C2's `exId` tier,
then C3's two exact comparisons, over the whole name family. **That identity is what C6 asserts**, so cell
`B2-Q2f` asserts the *agreement* of the two readers, not two separate literals.

**Executed after the fix:** `structuralMovesThisWeek().sets` = `["p9"]`, `_volDeltas` = `[["2026-09-01",1]]`
— and the `forks[].prevN` case likewise returns `["p8"]`. Nothing else in the probe moved.

## R2.2 Required change 2 — §2 C3 corrected in place, C6 rewritten to hand B3 the corrected rule

C3 said the owner is "the exact string between `"via "` and the **first** `" (now "`". The boundary that
actually ships cuts at the **LAST** `" (now "` and additionally accepts the whole tail. v1.2 §A1 fixed the
code and explicitly declined to rewrite C3. Because `PLAN…:157` makes §2 the durable convention and **C6
tells B3 to reuse it**, a B3 author implementing C3 verbatim would have reproduced exactly the regression
r1's bite B-2 found and the r1 fixer repaired — a documentation defect with a code-level consequence one
package downstream.

**In `BRIEF-…-v1.3.md`:** §2 C3 is rewritten in place and marked `[corrected in v1.3]`, with the tail /
last-delimiter / two-exact-comparisons rule stated as prose **and** as its executable form; the superseded
sentence is quoted in §v1.3-B2 for audit. §2 C6 is rewritten to (a) say the order is **C1→C2→C3**, (b) make
C6 *falsifiable* — "for any one receipt, `_volDeltas` and `structuralMovesThisWeek` must agree" — naming
r2's R2-A as the failure the clause exists to catch, (c) tell B3 **in terms** to implement the v1.3 C3 and
not the superseded text, and (d) name the two readers still off the convention (`volume.cjs:302`, and any
writer still omitting `exId`). C1, C2, C4 and C5 are untouched: C4/C5 state the standard the convention is
held to, and where the implementation misses it the gap is recorded as a residual rather than the standard
being lowered.

## R2.3 Required change 3 — the suffix-less residual, resolved as "document + cell"

r2 offered "resolve per the convention **or** document explicitly as a bounded residual with a cell". It is
documented and pinned, because it is **not repairable by a reader**: a row with no ` (now N sets)` suffix
makes both (a) the tail-cut-at-its-own-delimiter and (b) the whole tail legal owner names, so two lifts
answer "mine". Loosening or tightening either comparison trades one wrong answer for another; the correct
close is **C2's writer-side `exId`**, which is B3's half. Executed on four engine copies, both
`s.exercises` orders:

| shape | base | no-Q2 | Q2 reviewed | Q2 SHIPPED | cell |
|---|---|---|---|---|---|
| producer-written (suffixed) nested receipt, fwd / rev | `["p1"]` / `["p3"]` | `["p1"]` / `["p3"]` | `["p3"]` / `["p3"]` | **`["p3"]` / `["p3"]`** | `B2-Q2h` |
| suffix-less legacy row `… via Press (now heavy)`, fwd / rev | `["p1"]` / `["p2"]` | `["p1"]` / `["p2"]` | `["p1"]` / `["p2"]` | `["p1"]` / `["p2"]` | `B2-Q2i` |
| colliding NAME FAMILIES, fwd / rev | `["cur"]` / `["cur"]` | `["cur"]` / `["cur"]` | `["cur"]` / `["cur"]` | `["cur"]` / **`["old"]`** | `B2-Q2j` |
| `_volDeltas` on the suffix-less row, short lift / long lift | both `[["…",1]]` | both | both | both | `B2-Q2i` |

Three things are now on the record that were not:

1. **The improvement Q2 *does* deliver, claimed.** For the shape the producer writes, Q2 removes the
   `s.exercises`-order dependence outright (`B2-Q2h`). r2 is right that this was worth claiming.
2. **The residual Q2 does not close**, with both halves pinned — the double ownership in `_volDeltas` **and**
   the array-order resolution inside `structuralMovesThisWeek` — on **every** side including base
   (`B2-Q2i`). This is the executed counterexample to C4 and C5, stated as such in v1.3 §B3.
3. **The one new order-dependence the former-name term introduces** (`B2-Q2j`): when two lifts' name
   families collide, `_volDeltas` has always credited both; before this fix `structuralMovesThisWeek`
   silently preferred the current-name lift, and now it inherits the same ambiguity and resolves it by array
   order. Declared rather than discovered later: the trade is deliberate — **agreement between the two
   readers (C6) is worth more than a deterministic-but-different answer at one of them** — and it is the
   same residual class as (2).

## R2.4 Required change 4 — same-day duplicate entries, recorded as a REGISTER CANDIDATE, NOT fixed

`sessionLog` is keyed by date, so two observations of one lift on one calendar day can only be two entries
in that day's `entries` array; `volumeConversion`, `liftTrend` and `setOneRead` all reach the lift with
`(entries || []).find(e => e.id === exId)` — the first entry only. Executed, **identical on base, on
`f70dd23`, on `07fba76` and on the shipped hunk**:

```
2026-08-21 entries [k=2, k=3]  ->  volumeConversion READING,            changedAt 2026-08-25 · liftTrend null · setOneRead LIVE n=9
2026-08-21 entries [k=3, k=2]  ->  volumeConversion LIVE (tolerated),   changedAt 2026-08-21 · liftTrend n=4  · setOneRead LIVE n=9
```

One state, two array orders, two opposite tolerance verdicts — and deleting the shadowed entry outright
changes nothing, because it was never read (`B2-REG-1b`). **Not fixed in B2, deliberately**: repairing it
means ruling which same-day observation is authoritative, which is a behaviour decision for the register and
the PM, not a reader tweak inside an in-flight package whose brief is not accepted. Cells `B2-REG-1` and
`B2-REG-1b` pin current behaviour on every side so a future repair has to move a written number, and v1.3
§B4 carries the proposed register wording.

## R2.5 The fourteen laws, with and without Q2 — re-executed

```
TZ=America/New_York   node rebuild\conform\v4\run-defect-laws.cjs
```
with the three product files swapped **in place** by `git checkout <ref> --`, sha-verified on every run and
restored afterwards (`git status --porcelain` checked after each swap):

| variant | product sha256 (plan / progression / volume) | TOTAL line | exit |
|---|---|---|---|
| BASE `acd3b67` | `1b26c87f` / `7031838d` / `c32298e7` | `45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` | 1 |
| CANDIDATE no-Q2 `f70dd23` | `4c6f9817` / `9adaeecb` / `73550ef8` | `45 · 45 · **25** · **88** · **83/104** · 0 · AUDIT RED-FIRST FAIL` | 1 |
| CANDIDATE +Q2 **shipped** | `4c6f9817` / `9adaeecb` / `30e4dc21` | **byte-identical to the line above** | 1 |

**Line-by-line diff of the 46-line stdout: base vs no-Q2 → MOVED LINES = 15 · base vs +Q2 → MOVED LINES = 15
· no-Q2 vs +Q2 → MOVED LINES = 0.** The fifteen are the fourteen laws and the TOTAL line and nothing else:

```
D1 D2 D3 D4 D5 D6 D7 D9 D18 D28 D29 D30 D31 D32 + TOTAL
```

each moving `RED-frozen / RED-candidate / mutant-DETECTED` → `RED-frozen / GREEN-candidate / AUDIT-FAIL`.
**D18's law is GREEN-candidate with the Q2 hunk in** — the change sits inside D18's own repair and does not
weaken it. The two predicted side effects reproduce to the number (`89 → 88` GREEN repair controls,
`97/104 → 83/104` detected mutant executions). `AUDIT RED-FIRST FAIL` is the runner's own all-45-must-be-RED
rule on both sides and is not B2's. These are r1's, the r1 fixer's and r2's numbers exactly.

## R2.6 Census, `:70`, carrier, witnesses, cells

**Public direct-call census — this fixer's own, 572 cells per run.** Two state readings (`migrate(null)` and
`SEED`) × both matrix days, over `programmeVolume`, `muscleVolume`, `volumeImbalance`,
`structuralMovesThisWeek`, `nowModel`, `canonicalizePlan`, `dayType` at eight dates, and per lift over all
16 seeded lifts: `targetsFor`, `progressAnchor`, `loadRungs`, `maxedOut`, `nextLoad`, `prevLoad`,
`deloadLoad`, `snapLoad`, `repsLostOnJump`, `deriveSighting`, `_volDeltas`, `setOneRead`,
`volumeConversion`, `liftTrend`, `liftTrend({asOf})`, `liftCall`, `exActive`. Run on four sha-pinned
disposable engine copies (`eng-base`, `eng-noq2`, `eng-oldq2` = the withdrawn `07fba76`, `eng-q2`):

```
===== 2026-09-03  base -> B2 (+Q2 shipped) =====      ===== 2026-09-07  base -> B2 (+Q2 shipped) =====
  SEED/perLift/fly/deloadLoad:           5 -> null      (the identical four cells)
  SEED/perLift/hipthrust/deloadLoad:     5 -> null
  migrated/perLift/fly/deloadLoad:       5 -> null
  migrated/perLift/hipthrust/deloadLoad: 5 -> null
cells changed: 4 of 572                                cells changed: 4 of 572

base -> B2 (no Q2)          : the same 4 cells, both days
B2 no-Q2 -> B2 +Q2 shipped  : 0 cells, both days
B2 +Q2 reviewed -> +Q2 shipped : 0 cells, both days      <- the former-name term adds no census cell either
```

**Exactly the single D6 cell (`deloadLoad` for `fly` and `hipthrust`, `5 → null`) at both matrix days in
both state readings.** The Q2 hunk adds no census cell in either form, and R-1 stands: the seeded state has
no sessions, so this is a thin oracle for the era/trend readers.

**`tools/engine-test.jsx:70`**, reproduced at the second gate's own hard pin `MEASURED_TEST_NOW=2026-07-29`
over `tools/snapshots/2026-08-06-ledger.json`, whose sha256 was re-verified inside every probe process as
`62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f` (the brief's pin):

| engine | `nLifts` | `state` | `:70` | `:71` | `:72` | `:76` |
|---|---|---|---|---|---|---|
| base `acd3b67` | 3 | `unknown` | **HOLDS** | holds | holds | holds |
| no-Q2 `f70dd23` | 3 | `unknown` | **HOLDS** | holds | holds | holds |
| Q2 reviewed `07fba76` | 3 | `unknown` | **HOLDS** | holds | holds | holds |
| **Q2 shipped** | 3 | `unknown` | **HOLDS** | holds | holds | holds |

**The protected cell does not move, with or without Q2, in either Q2 form.** Q8's finding stands: the
narrowing is what keeps `:70` still.

**Carrier, witnesses, cells** (on the working tree, Q2 shipped):

```
node rebuild\m4\spec\b2-inherited-carriers.cjs
  -> B2 INHERITED CARRIERS: 5/5 PASS; 17 exact substitutions (9 + 3 + 5 + 0 + 0); exit 0
     witnesses-1 10 cases / 9 subs · witnesses-2 11 cases / 3 subs · witnesses-4 5 cases / 5 subs
     witnesses-3 5 cases / 0 subs · witnesses-6 8 cases / 0 subs + M6 preserved defects native 4/4
node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs
  -> exit codes 1 · 1 · 0 · 1 · 1 · 0 · 1      (base is 0 · 1 · 0 · 0 · 1 · 0 · 1 — the same 8+1+5 flip shape)
node rebuild\lanes\b\b2-delta-cells.cjs <engineDir>
  -> eng-base   28/28 HOLD · side BASE      · Q2 n/a          · exit 0
  -> eng-noq2   28/28 HOLD · side CANDIDATE · Q2 NOT APPLIED  · exit 0
  -> eng-q2     28/28 HOLD · side CANDIDATE · Q2 APPLIED      · exit 0
  -> eng-oldq2  25/28      · side CANDIDATE · Q2 APPLIED      · exit 1   <-- VACUITY CONTROL
                  MOVED: B2-Q2f, B2-Q2g, B2-Q2j — i.e. the withdrawn 07fba76 hunk
```

**The cell file is not vacuous on the new material either.** Pointed at the withdrawn hunk it reports
**25/28, exit 1**, moving exactly the three cells that encode required change 1 and the family-collision
residual. That run is the mutant `volume-owner-drops-the-former-name-term` executed against the shipped
pins, and it is the reason the new cells are worth their lines: `B2-Q2f`/`B2-Q2g` pin the same value on
base, on no-Q2 and on Q2, so the only thing they can catch is exactly the defect r2 found.

The seven added cells: `B2-Q2f` (renamed lift, + the C6 agreement assertion), `B2-Q2g` (`forks[].prevN` and
the current name after a rename), `B2-Q2h` (nested delimiter, both array orders), `B2-Q2i` (suffix-less
double ownership, both readers, both orders), `B2-Q2j` (colliding name families), `B2-REG-1` and
`B2-REG-1b` (the same-day duplicate register candidate). 21 → 28.

## R2.7 The conform suite and the second gate — byte-identical with and without Q2

```
cd rebuild\conform && MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York ENGINE_MAIN=<a575ac58…> node run.cjs
  no-Q2 : SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families   exit 1
  +Q2   : the same, 81 stdout lines, 0-byte stderr                                                                                        exit 1
  stdout sha256 IDENTICAL (3978571cc5311bdc…), 0 differing lines
  INFO 9 engine-track rig185: W1 PASS, W2 PASS  on both sides

node rebuild\engine\test\second-gate.mjs --candidate
  no-Q2 : reference FINAL108: 3072 passed, 0 failed · reference surface byte-identical to committed baseline (123077 bytes)   exit 1
  +Q2   : the same; stdout sha256 IDENTICAL (650cddc45a09d318…), stderr 181 B sha256 IDENTICAL (73db6a9fb1e58c6d…)            exit 1
  .tmp/m2-second-gate/candidate-engine-test.stdout.log : 267 content lines; the candidate side stops at the
  pre-existing D12 cell tools/engine-test.jsx:106 ("SNAPSHOT 08-07 ITEM B — the live stepeff fit … exceeds
  the walking-physics ceiling"), which is why FINAL2/FINAL3 read 251/1 and 256/1 — identical on every side.
```

**Environment note (R2-6), not a B2 signal.** This clone carries only `engine-main.cjs`; with no
`ENGINE_OLD` the suite prints `BAD 0 engine artifacts present (main + old)` beside the expected
`BAD 7 privacy … 0 private lines`. r2, running with both bundles, saw `BAD 2` (port oracle) and `BAD 3`
(sensitivity) instead. **Every one of those lines is identical on both sides here**, so none of them is
B2's — the claim is "the conform suite is *identical*", never "the conform suite is clean". **B2 adds no
failure inside the 261 observable assertions, with or without Q2. The remaining 2,811 stay unobserved —
R-2 / Q9, still open, and not B2's to close.**

## R2.8 Protected and private surfaces — VERDICT ONLY

* **P6, `tools/engine-test.jsx:8790–8793`** — not re-derived by this pass; the r1 fixer's and r2's
  verdict (UNCHANGED on base, `f70dd23`, `07fba76` and under the v1 cut) is not disturbed, because the
  shipped Q2 change produces **zero** census cells and **zero** second-gate output differences against
  `07fba76` and against `f70dd23`, both executed above. No cell value, no hash, no prose.
* **The seeded set-one laboratory card** (`sleep.cjs:1141`) — `setOneRead` is unchanged by this pass and the
  census `setOneRead` cells are identical across all four engine variants at both matrix days. **UNCHANGED.**
  Nothing quoted, nothing hashed.
* **`rebuild/conform/private/**`, the private `live.main` golden, and `ledger/`** — never opened, never
  named with values, never hashed, never quoted. The private LIVE census for D30 remains the PM's own
  `--full` on the owner's PC (`DECISIONS:92` / `:93` C4).

## R2.9 What this pass did NOT do

* **`f70dd23` was not touched.** r2 says it needs no change; it got none. `progression.cjs` and `plan.cjs`
  are byte-identical to `f70dd23` on the branch tip.
* **Required change 4 was NOT implemented as a repair** — r2 says "do NOT fix in B2", and it is recorded as
  a register candidate with cells instead.
* **`volume.cjs:302` (`_setsMovesSince`) was not converted** (r2 residual R2-5). It stays the one reader in
  this file off the convention, now named in C6 rather than only in a brief footnote.
* **No writer-side `exId` was added** — that is C2's half and B3's file.
* **`rebuild/lanes/STATUS.md` was not edited**; the STATUS line is handed back in the final message.
* **`rebuild/m4/spec/b2-inherited-carriers.cjs` was not moved** — placement is still the PM's (r2 P-5), and
  the `REQUESTS.md` line is already filed on the tip at `16302cd`.
* **The package bar is still NOT met and is NOT claimed**: no `acceptance-b2-targets-identity-era.json`, no
  `b2-package.cjs`, no 19-gate identity run, no `--full`, no receipt, no authorized rerun. It cannot be
  claimed until the PM rules which B package claims the parent (r2 P-1).

## R2.10 Everything this pass executed, as commands

```
git -C <b2> fetch origin ; git -C <b2> reset --hard origin/rebuild/lane-b-b2     -> clean at c4129c9
<probe-r2a.cjs on the tip, BEFORE any edit>                                      -> R2-A/B/C/D all four reproduce
<edit volume.cjs: + _formerNames delegate, + the family term at :159>            -> vol 4a04f4e8… -> 30e4dc21…
<probe-r2a.cjs again>                                                            -> sets ["p9"]; nothing else moved
<setup-engines.ps1>  eng-base / eng-noq2 / eng-oldq2 / eng-q2, sha-pinned        -> c32298e7 / 73550ef8 / 4a04f4e8 / 30e4dc21
node rebuild\conform\v4\run-defect-laws.cjs  x3 in place, restored + sha-checked  -> 45/39/89/97-104 · 45/25/88/83-104 · identical
<movediff2.cjs over the three 46-line stdouts>                                    -> 15 / 15 / 0 MOVED LINES; the 14 laws + TOTAL
<probe-all.cjs x4 engines>                                                        -> the R2.3 and R2.4 tables
<census.cjs x 4 engines x 2 matrix days (572 cells) + censusdiff.cjs>             -> 4 cells both days; 0 noq2->q2; 0 oldq2->q2
<probe70.cjs x4 engines at MEASURED_TEST_NOW=2026-07-29>                          -> :70 HOLDS x4; snapshot sha 62f9e051… verified in-process
node rebuild\m4\spec\b2-inherited-carriers.cjs                                    -> 5/5 PASS, 17 subs, exit 0
node rebuild\engine\test\defect-witnesses[ ,-2..-7].cjs                           -> 1·1·0·1·1·0·1
node rebuild\lanes\b\b2-delta-cells.cjs  x4 engines                               -> 28/28 · 28/28 · 28/28 · 25/28 (vacuity control)
cd rebuild\conform && node run.cjs   (no-Q2, +Q2)                                 -> SUITE INCONSISTENT 99/99/29/70; stdout sha IDENTICAL; 0-byte stderr
node rebuild\engine\test\second-gate.mjs --candidate  (no-Q2, +Q2)                -> reference FINAL108 3072/0; stdout+stderr sha IDENTICAL; log 267 lines
git status --porcelain  after every in-place swap and at the end                  -> only the intended files
```

Every engine run: `TZ=America/New_York`; `MEASURED_TEST_NOW=2026-09-03` except the `:70` reproduction, which
uses the second gate's hard pin `2026-07-29`, and the frozen conformance suite, which sets its own. All
scratch scripts and engine copies live **outside** the worktree (`work/lane-b/b2-fixer2/`); nothing from
them is committed. After every base-side run the product files were restored and asserted byte-identical by
sha256.

**Verdict of this pass: r2's four required changes are all in — one as a code fix at the site r2 named, one
as an in-place correction of §2's C3 and C6, and two as written residuals with executable cells. The
fourteen laws are still 14/14 `RED-frozen / GREEN-candidate` with MOVED LINES = 15 and 0 between the two
candidate variants, D18 GREEN with Q2 in; the public census delta is still the single D6 cell;
`tools/engine-test.jsx:70` does not move; the carrier is 5/5 with 17 substitutions and the witness exit
codes are unchanged; `rebuild/conform/run.cjs` and the observable second gate are byte-identical with and
without Q2; the delta cells are 28/28 on base, on no-Q2 and on Q2, and 25/28 on the withdrawn hunk. The Q2
work is ONE commit and `git revert` still drops it whole. The package bar is NOT met and is not claimed.**
