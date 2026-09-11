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
