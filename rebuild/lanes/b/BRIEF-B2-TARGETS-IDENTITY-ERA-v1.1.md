# EARNED — LANE B · PACKAGE B2 — TARGETS, IDENTITY & TECHNIQUE ERA — BEHAVIOUR/DELTA BRIEF **v1.1, RE-PINNED ONTO THE NATIVE-CARRIERS MERGE** (PROPOSED, NOT ACCEPTED)

2026-09-11 · Opus builder of LANE B, research only. Nothing in the repo was modified, committed or pushed; every edit reported here was made in throw-away copies under the session scratchpad and discarded. No `ledger/` and no `rebuild/conform/private` path was opened.

## v1.1 changes (read this first)

v1 was written against `ffabbca` and said its `plan.cjs` / `progression.cjs` coordinates would be re-pinned after M2-NATIVE-CARRIERS merged. That merge is in (`52a74b6`, tip **`87eddad`**). This is that re-pin. Seven substantive changes:

1. **All pre-image sha256 and all line coordinates re-pinned on `87eddad`.** `plan.cjs 2b834933… → 1b26c87f6fa037259a4ce480585e07714f5b38d4995a56bc94965f49386af2a3`, `progression.cjs adeb1b10… → 7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5` — both exactly the post-images `DECISIONS:93` predicted. `volume.cjs c32298e7…` **unchanged**, so every `volume.cjs` coordinate in v1 stands byte-for-byte. Full map in §0.
2. **D1's hunk is rewritten (carrier collision, real).** The carriers replaced `if (!ex.last)` with `if (!governingLast(ex, s))` inside `targetsFor`, and `targetsFor` is now `(ex, s)`. New pre-image text, same one-line shape (§1.3).
3. **D7 gains a second guard (carrier collision, real).** `progressAnchor` now has a **native** row loop (`_nativeView(s)`) ahead of the legacy `days9` loop, and `liftTrend` now iterates `performedHistoryRows` rows (`for (const row of rows) { const {d}=row;`). v1's single anchor guard covered only the legacy loop; v1.1 guards both (§1.6).
4. **D7's `liftTrend` guard is NARROWED to the supplied as-of — a blocking defect in v1's hunk, found by execution.** v1's unconditional `d > atT` cut turns `progressionTrend(SNAP).nLifts` 3 → 0 and **flips `tools/engine-test.jsx:70` inside the protected second gate**, which hard-pins `MEASURED_TEST_NOW="2026-07-29"` (`second-gate.mjs:64`) while `tools/snapshots/2026-08-06-ledger.json` carries sessions to 2026-08-04. v1 missed it because v1's census was a direct-call census on the seeded state. v1.1's hunk cuts only when `opts.asOf` is supplied: **14/14 laws still GREEN, census delta unchanged (one cell), and `:70` no longer moves.** Full account, evidence and the PM's alternative in §1.6 and §7 Q8.
5. **Frozen-side RED is now asserted, not deferred.** v1 could not reach `fe516c1`. This clone is not shallow: the frozen bundle was built and the full 45-law runner executed both sides. `45/45 RED-frozen` on the merged tree; the fourteen are `RED-frozen / RED-candidate`; on the repaired scratch copy exactly the fourteen flip to `GREEN-candidate` and **no other law moves** (§3, §4).
6. **Carrier accounting is now exact and one file is added.** `witnesses-1` 8 of 10 flip; `witnesses-2` gains exactly one flip (D18) on top of its pre-existing D12 RED; `witnesses-4` 5 of 5 flip; **`witnesses-3` 5/5 and `witnesses-6` 4/4 unchanged**; `witnesses-5` / `witnesses-7` fail identically on both sides at the merged tip (pre-existing, not B2's). §4.
7. **Parent statement (§6) is now structural, not inferred**: `acceptance-native-carriers.json` itself carries `parent = acceptance-load-writes.json 5073977b…`, so the chain is LOAD-WRITES → NATIVE-CARRIERS and B2's parent is the NATIVE-CARRIERS artifact **if the PM rules B2 first**. The choice stays the PM's (`REQUESTS.md` already asks).

Corrections of fact carried from v1: the SEED's single split row is `from: "2026-08-09"` (`seed.cjs:180`), not `2026-08-01`; `plan.cjs`'s export line is `:341`, not `:331`; `sameEra` begins at `plan.cjs:53`, not `:52`. Everything else in v1 — every objection, every condition, C1–C6 verbatim, all seven PM questions — is carried unchanged.

## 0. Header — base, dependency, authority

**Package id** `B2` · theme `TARGETS, IDENTITY & TECHNIQUE ERA` · fourteen D-ids in package order **D9 → D2 → D1 → D5 → D6 → D7 → D3 → D4 → D29 → D18 → D28 → D30 → D31 → D32** (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:84`, file unchanged since ffabbca).

**Base tree** `origin/rebuild/t2-client-core` @ **`87eddad`** (`87eddad7e9e7141e28ea575b3b99038eac61585a`, read in a dedicated worktree). Merge commit `52a74b6`. Product modules: `rebuild/engine/plan.cjs`, `rebuild/engine/progression.cjs`, `rebuild/engine/volume.cjs` — **no fourth file**. The carriers' new `rebuild/engine/performed.cjs` (`2372e66ba4e31f7229c870e4d1e2e95855d7a49ee705394c23b53b84ec249f3a`) and `entered-load.cjs` (`2a0cd97ec843924e6dc428f2dbb0fe3c5bf10335610a3315c205c84fc324a3a3`) are **not** in B2's allowlist and receive no hunk.

Pre-image sha256 at `87eddad` (all three verified on the merged tree; plan/progression byte-equal to the accepted artifact's own `product` pins):

| file | sha256 at ffabbca (v1) | sha256 at 87eddad (v1.1) | coordinate drift |
|---|---|---|---|
| `rebuild/engine/plan.cjs` | `2b834933…` | **`1b26c87f6fa037259a4ce480585e07714f5b38d4995a56bc94965f49386af2a3`** | 343 lines (+10); both B2 hunk sites at **identical** line numbers |
| `rebuild/engine/progression.cjs` | `adeb1b10…` | **`7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5`** | 891 lines (+164 net); every B2 site moved, two rewritten |
| `rebuild/engine/volume.cjs` | `c32298e7…` | **`c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4`** (identical) | none — all v1 coordinates stand |

Other files B2 cites, re-pinned: `sleep.cjs` `3dd34e11…` (deload consumer `:133 → :136`; `labAnalytics2` `:1141`; the only `setOneRead` consumer `:1283–1292 → :1286`), `writers.cjs` `00291236…` (**+27 lines**: VOLUME receipt producers `:2135 → :2162` and `:2292 → :2319`; `agentProposals.exId` `:1459 → :1486`, `:1469 → :1496`; offer-expiry `:2286 → :2313` — every cited line byte-identical in text), `today.cjs` `397532ec…`, `index.cjs` `40ccc489…`, `earn.cjs` `4b8838807ee973e6cc31a75a74c5d5b389efc8b640433c09df0dd12dfd0584da` (**not** a carriers file; the sole EARNED producer is still `earn.cjs:89`).

**Nothing outside `rebuild/engine/`, `rebuild/m3/w7-preview/`, `rebuild/m4/spec/`, `rebuild/lanes/`, `rebuild/DECISIONS.md` and `.github/workflows/rebuild.yml` changed between `ffabbca` and `87eddad`** (verified by `git diff --stat`). Therefore **every** v1 citation into `tools/engine-test.jsx` (sha `df3abc40a8d2b538fc09db4468117f1bb13afa451b264e3e39a8026cf0ef1428`, byte-equal to the custody pin at `step-efficacy-second-gate.cjs:38`), `rebuild/engine/test/*`, `rebuild/conform/**` (the fourteen laws, `helpers.cjs`, `run.cjs`, `laws-evidence-comparability.cjs:11/24/45`, the postfix carriers), `rebuild/m2/**` (the register, `BRIEF-SET-ONE-ERA.md`) and `PLAN-TRACK-B-PACKAGES-v1.md` **stands unchanged**.

**D30's incorporated brief is byte-identical.** `rebuild/m2/BRIEF-SET-ONE-ERA.md` — 75 lines, 18,912 bytes, sha256 **`a2e88bed8edf566b4551d9a48b79282b9e367b2fd195bde5f1be41f13baa84b3`** — re-verified on the merged tree, byte-equal to the bytes accepted at `DECISIONS:82`. Its review `rebuild/m2/REPORT-SET-ONE-ERA-BRIEF-ASTRA.md` — 58 lines, 6,770 bytes, `670e303e8739bc3cd11336b093417a3102c6cab1cbf6f7befa31cbaf7b3926d2` — unchanged.

**NATIVE-CARRIERS dependency — DISCHARGED.** `DECISIONS.md:93` accepted the theme; **`DECISIONS.md:95`** recorded `POSTFIX-ACCEPTANCE M2-NATIVE-CARRIERS 16413b1f… acceptance-native-carriers.json 12597632… ACCEPTED` and **`DECISIONS.md:96`** supersedes it with `POSTFIX-ACCEPTANCE M2-NATIVE-CARRIERS 84d8f28892973b6cf68f37d2fe5ce80d97b1d165 rebuild/m4/spec/acceptance-native-carriers.json 295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1 ACCEPTED` (the F-PM-4 refusal-test fix re-sealed the artifact; the live sha256 of that file on this tree is `295762f0…`, verified). `295762f0…` is therefore the accepted artifact. B2's brief no longer waits on anything; B2's **artifact** waits only on the PM's chain ruling (§6, §7 Q1).

**Authority lines (read, not inferred).** Unchanged from v1 and re-read on `87eddad`:
- `rebuild/DECISIONS.md:60` (owner, M2-RULE; line sha256 `ebb565c65ba1a33dbc5b007d8854e6c203f1f8ae218bef7521c2dc07ffd596c8`). It disposes all fourteen: D1, D2, D3, D4, D5, D6, D7, D9, D18, D28, D29, D30, D31 as plain Batch-A `APPROVED-FIX`; **D32 as a Batch-B `APPROVED-FIX` with its exact rule** (verbatim in §1.14). The same line states what it does *not* do: "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance; the frozen app and its goldens stay untouched".
- `:88` (speed plan) `2fdbd9d2745e0caf83313db2ce8659f49ff9004bb667add0c39f3826a3f8543b`; `:94` (LANES ruling, "the PM's own FULL run is the acceptance") `8bd97d771528bac19ae44600feb3d4c9ccd312f0a5f3eeefd0ec0b2e53de55b0`; `:82` (SET-ONE-ERA brief ACCEPTED, D30) `2862e7ab8aae34ec2817a9339020ed696959bbaf6cefb32a63d8f1d629d58bf2`, carrying the **two conditions** restated verbatim in §1.12.
- Parent chain: `:85` (LOAD-WRITES theme `9117a07f…`), `:86` (receipt `b3bedd8c…`), `:87` (integrated; "Register: 6/45 repaired (D12, D33, D34, D35, D41, D43); 39 + 15 non-D open") — **now executed and confirmed**: the merged engine reads exactly `39 RED-candidate` with D12/D33/D34/D35/D41/D43 GREEN (§3).
- Frozen baseline inherited unchanged: audit `614e20315b01543d3b7bbc4fa1fe8a5c20bcb690`, extraction `ef83543aa825fb581671951d287854166717ad28`, frozen `fe516c1`, frozen blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`.

## 1. Per defect, in package order

Every "current code" hunk below was read at **`87eddad`** and located **by content**, then its line number recorded. `progression.cjs` / `plan.cjs` / `volume.cjs` sha256 as in §0. Register citations are `rebuild/m2/AUDIT-REGISTER.md` line numbers (file unchanged).

### 1.1 D9 — the workout day depends on schedule record order (register 97–105)

**PLAIN** (:99) "The app can show a different workout day when the same schedule records arrive in a different order, when the most recently effective schedule should determine the day." · **Current code** `rebuild/engine/plan.cjs:11–17`, defect at **`:15`** (v1 coordinate survives the merge unchanged):
```js
function dayType(iso, s) {
  const d = mk(iso).getDay();
  const list = (s && s.split) || [];
  let ent = null;
  for (const x of list) if (x && x.from && x.from <= iso) ent = x;
```
Last qualifying **array row** wins, not the greatest effective date.

- **Owner semantics** — plain Batch-A FIX (`DECISIONS:60`); no Batch-B rule. · **Behaviour change.** `dayType` selects the qualifying record with the greatest `from`, keeping every other byte: the `from <= iso` eligibility bound, the `ent.map` branch, the Wednesday refeed branch and the legacy dow fallback. Ties on an identical `from` keep the existing array-order winner (`>=`), because the register states the witness uses distinct dates and "needs no tie-breaking product rule" (:105).

**Exact hunk** (`plan.cjs:15`) — **unchanged from v1**:
```
- for (const x of list) if (x && x.from && x.from <= iso) ent = x;
+ for (const x of list) if (x && x.from && x.from <= iso && (!ent || String(x.from) >= String(ent.from))) ent = x;
```

- **Law** `E-D9-split-selects-latest-effective-date`. Executed at `87eddad`: **raw RED**, control GREEN, mutant `last-array-row-wins-effective-split` RED; GREEN on the repaired copy with detail `{"ordered":"U","reversed":"U"}`.
- **Delta cells.** Changes: `dayType` for an unsorted `s.split`. Must NOT change: any sorted split (**correction to v1** — the SEED's own single row is `from: "2026-08-09"`, `seed.cjs:180`, and is order-free either way; the dated-split census `tools/engine-test.jsx:7819–7822` likewise); the pre-config legacy readings; `dayType("2026-07-29")` = `REFEED`; the six stateless callers counted at `engine-test.jsx:7868`. **Re-executed on the merged tree at both matrix days:** `dayType` for `2026-08-03 / 08-09 / 08-31 / 09-03 / 09-07 / 07-29` = `U / U / L / U / L / REFEED`, byte-identical base vs repaired.
- **Source mutants.** (1) `split-selection-returns-to-last-array-row`. (2) `split-tie-prefers-first-array-row` (`>=` → `>`). (3) `split-selection-drops-the-effective-date-bound`.
- **Negative controls.** Duplicate identical `from` rows keep the existing winner; a falsy/absent `from` is still skipped; an `ent.map` value other than `U`/`L` still reads `REST`; a state with no `split` is byte-identical.

### 1.2 D2 — impossible set count passes validity, then crashes (register 23–31)

**PLAIN** (:25) "The app accepts an impossible number of sets as valid and can crash while preparing the exercise, when it should keep that record marked invalid." · **Current code** `rebuild/engine/plan.cjs:84` (v1 coordinate survives unchanged):
```js
function _bornValid(e) { return !!(e && typeof e.sets === "number" && typeof e.hi === "number" && typeof e.setup === "string" && (e.day === "U" || e.day === "L") && typeof e.mg === "string"); }
```
and the healer it feeds, `plan.cjs:123` (unchanged), with the flagging path at `:114`. `typeof -1 === "number"`, so a `sets: -1` record is "born valid", its quarantine is deleted at `:123`, and **`progression.cjs:271`**'s `Array(ex.sets)` then throws `RangeError: Invalid array length` (**re-pinned: was `progression.cjs:164`**).

- **Owner semantics** — plain Batch-A FIX. · **Behaviour change.** `_bornValid` requires a finite positive **integral** set count and a finite positive rep ceiling, per the register's FIX line (:30). Because `canonicalizePlan`'s healer calls the module-internal declaration, one hunk fixes both the `:114` flagging path and the `:123` clearing path — **no second hunk in `canonicalizePlan`**. (The accepted law's `control` patches both exported names only because a patched export cannot reach a closed-over internal call; a satisfiability demonstration, not the shape of the fix. State this in the artifact so the reviewer does not require two hunks.)

**Exact hunk** (`plan.cjs:84`) — **unchanged from v1**:
```
- function _bornValid(e) { return !!(e && typeof e.sets === "number" && typeof e.hi === "number" && …
+ function _bornValid(e) { return !!(e && Number.isInteger(e.sets) && e.sets > 0 && Number.isFinite(e.hi) && e.hi > 0 && …
```
(the `setup` / `day` / `mg` conjuncts unchanged and in place).

- **Law** `E-D2-invalid-set-count-stays-quarantined`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy with `{"accepted":false,"quarantined":true,"negativeArrayCrash":false}`.
- **Delta cells.** Changes: `_bornValid` for non-integral, non-positive, NaN or Infinite `sets`/`hi`; the healer's conversion for those records; nothing else. Must NOT change: every real lift (all SEED lifts are integral-positive — re-executed, `canonicalizePlan` output and `exActive` identical at both matrix days); `targetsFor`'s `RangeError` on a *still-unquarantined* impossible record, which stays exactly where it is (now `progression.cjs:271`; the register scopes the FIX to `plan.cjs` only, :30). Record that RangeError as an unrepaired latent, not a B2 obligation.
- **Source mutants.** (1) `numeric-type-admits-negative-count`. (2) `integral-check-omits-positivity`. (3) `hi-ceiling-unchecked` (killed by a `hi: NaN` control).
- **Negative controls.** `sets: 3, hi: 10` stays born-valid and an existing poison quarantine is still cleared at `:123` (the F1 self-heal must survive); `sets: 3.5` and `sets: 0` are invalid; a record with no matching retirement is untouched.

### 1.3 D1 — first-session targets do not fit the current set count (register 13–21) — **HUNK REWRITTEN BY THE MERGE**

**PLAIN** (:15) "The app can show fewer or more first-session sets than the exercise currently calls for, when the first-session targets should fit the current set count." · **Current code** `rebuild/engine/progression.cjs:268,271` inside `targetsFor` (**was `:161,164`**; the rider comment is now `:262–267`, was `:155–160`):
```js
  const fitN = (arr) => { const t9 = arr.slice(0, ex.sets); while (t9.length < ex.sets) t9.push(Math.max(1, _padFrom9(t9, ex.hi) - 1)); return t9; };
  if (ex.std) return fitN(ex.std);
  if (ex.reclaim) return fitN(ex.reclaim);
  if (!governingLast(ex, s)) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
```
**What the carriers changed.** `targetsFor` is now `targetsFor(ex, s)` and the branch test is `!governingLast(ex, s)` (new declaration at `progression.cjs:120–125`) instead of `!ex.last`. `governingLast` returns `ex.last` verbatim when `!_nativeView(s)` (`:121`, `_nativeView` at `:64` = `!!(s && s.workoutFacts)`), so on every legacy input the branch is byte-equivalent to v1's. `ex.first` is still the one authored array that bypasses `fitN`, and `fitN` itself is byte-identical.

- **Owner semantics** — plain Batch-A FIX. The rider already states the rule ("A set-count change must not silently shrink or crash the session: pad to ex.sets one rep under the last authored slot … truncate when sets fall"). · **Behaviour change.** Unchanged from v1: route `ex.first` through the existing `fitN`, leave the no-`first` default fill exactly as it is. No new fit rule, no new padding arithmetic, and **no change to the `governingLast` test** — the carriers' native/legacy resolution is left exactly as merged.

**Exact hunk** (`progression.cjs:271`) — **minimally rewritten: the condition is the carriers' `governingLast(ex, s)`, the replaced return is v1's**:
```
- if (!governingLast(ex, s)) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
+ if (!governingLast(ex, s)) return ex.first ? fitN(ex.first) : Array(ex.sets).fill(Math.max(1, ex.hi - 2));
```
`fitN` already returns a fresh array via `arr.slice(0, ex.sets)`, so the removed `.slice()` on the fresh `Array(...).fill(...)` is a value-identical no-op; pin that as a named observation, not a delta.

- **Law** `P-D1-first-targets-fit-current-set-count`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy with `{"grow":[8,7,6],"shrink":[8]}`.
- **Delta cells.** Changes: `targetsFor` only for a lift with `ex.first`, no governing last line, no `std`, no `reclaim`, and `ex.first.length !== ex.sets`. Must NOT change: the `std`/`reclaim`/anchor branches; the MAXED ladder assertions (`engine-test.jsx:7087–7099`); **re-executed on the merged tree** `targetsFor({last:[14,13,13],hi:15,sets:3},{sessionLog:{}})` = `[14,14,13]` (`engine-test.jsx:156`). The only seeded lift with `first` and no `last` is `abs` (`sets:3`, `first:[12,12,12]`), already fitting — `targetsFor` over all 16 seeded lifts is byte-identical at both matrix days.
- **New condition to record (carrier interaction).** The native branch of `governingLast` returns `_lineOf(rows[rows.length - 1])` or `null`; a native state with no governing row therefore reaches this same return. B2 must pin one native-view case (`s.workoutFacts` present, no governing row, `ex.first.length !== ex.sets`) so the repair is proved on **both** halves of the carriers' resolution, not only the legacy half. The seeded state has **no** `workoutFacts` (executed), so the seeded census cannot prove it.
- **Source mutants.** (1) `first-array-bypasses-existing-authored-fit`. (2) `first-array-pads-but-never-truncates`. (3) `first-array-padded-with-hi-minus-two`. (4) **new** `first-fit-bypasses-the-native-governing-test` — restore `!ex.last` in place of `!governingLast(ex, s)`, killed by the native-view case above.
- **Negative controls.** `first.length === ex.sets` returns the same contents (and still a copy); no `first` and no governing last still yields `Array(ex.sets).fill(max(1, hi-2))`; a governing last present still goes through `progressAnchor`.

### 1.4 D5 — duplicate rungs make equipment look maxed out (register 33–41)

**PLAIN** (:35) "The app can call an exercise's equipment maxed out merely because the same available weight was entered twice, when duplicates should not create a valid equipment ladder." · **Current code** `rebuild/engine/progression.cjs:345–349` and `:406–409` (**was `:239–243` / `:299–302`**), text byte-identical:
```js
function loadRungs(ex) {
  const r = Array.isArray(ex && ex.steps) ? ex.steps.map(Number).filter((x) => isFinite(x) && x > 0) : [];
  if (r.length < 2) return null;
  return [...new Set(r)].sort((a, b) => a - b);
}
…
function parseRungs(text) {
  const r = String(text || "").split(/[^0-9.]+/).map(Number).filter((x) => isFinite(x) && x > 0);
  return r.length >= 2 ? [...new Set(r)].sort((a, b) => a - b) : null;
}
```
Both check the **raw** count before de-duplicating, so `[100,100]` becomes a one-rung ladder and `maxedOut` (now `progression.cjs:177`, was `:83–85`, via `nextLoad` now `:368–369`, was `:261–262`) reads the stack as topped out.

- **Owner semantics** — plain Batch-A FIX. · **Behaviour change.** De-duplicate and sort first, then apply the existing two-rung minimum, in both entry points. `maxedOut`, `nextLoad`, `prevLoad`, `snapLoad`, `deloadLoad` and `repsLostOnJump` all call `loadRungs` internally and are corrected without an edit.

**Exact hunks** (`progression.cjs:347–348` and `:408`) — **text unchanged from v1**:
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

- **Law** `P-D5-ladder-minimum-counts-distinct-rungs`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy with `{"parsed":null,"rungs":null,"maxed":false,"next":105}`.
- **Delta cells.** Changes: duplicate-only ladders — `loadRungs`/`parseRungs` null, `maxedOut` false, `nextLoad`/`prevLoad` fall to the `ex.inc` arithmetic, `deloadLoad` to the percentage branch, `snapLoad` returns `w`. Must NOT change: `parseRungs('100,105,100')` = `[100,105]`; the LADDER assertions at `engine-test.jsx:5231–5237`, `:7974`, `:7995`, `:8017`; `repsLostOnJump`. **Re-executed:** no seeded lift has a duplicate-only `steps`; `loadRungs`/`maxedOut`/`nextLoad` identical over all seeded lifts at both matrix days.
- **Source mutants.** (1) `raw-rung-count-checked-before-deduplication`. (2) `dedupe-in-loadrungs-only`. (3) `dedupe-drops-the-sort`.
- **Negative controls.** `[100,105]` unchanged in value and order; a single-element `steps` still null; non-finite and non-positive entries still filtered before the count; `parseRungs('')` still null.

### 1.5 D6 — a deload is invented where no working weight exists (register 43–51)

**PLAIN** (:45) "The app can propose a reduced weight even though no working weight has been recorded, when it should keep the missing weight unknown." · **Current code** `rebuild/engine/progression.cjs:394–399` (**was `:287–291`**), text byte-identical:
```js
function deloadLoad(ex, pct = 0.95) {
  const w = Number(ex.w);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (!rungs) return Math.max(5, Math.round((w * pct) / 5) * 5);
```
`Number(null)` and `Number("")` are both `0`, `isFinite(0)` is true, so `Math.max(5, 0)` prints **5**. The sibling helpers already refuse this: `nextLoad:364–365` and `prevLoad:376–377` (**was `:257–258` / `:269–270`**) both carry `if (raw9 == null || raw9 === "") return null;` under the C6 comment (`:360–363`, was `:253–256`) that names exactly this case — "the live hip thrust, never performed, advertised '5'".

- **Owner semantics** — plain Batch-A FIX. · **Behaviour change.** Apply the identical pre-coercion absence guard `nextLoad`/`prevLoad` already apply, ahead of the `Number()` call. Nothing after it moves.

**Exact hunk** (`progression.cjs:394–395`) — **unchanged from v1**:
```
  function deloadLoad(ex, pct = 0.95) {
+   if (ex.w == null || ex.w === "") return null;   /* C6 — absence is not zero; the same guard nextLoad/prevLoad already apply */
    const w = Number(ex.w);
```

- **Law** `P-D6-deload-preserves-absent-load`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy with `{"missing":[null,null,null],"known":95}`.
- **Delta cells.** **This is still the one executed public-census delta in the whole package.** Changes: `deloadLoad` for the two seeded lifts with no working weight — `fly` and `hipthrust`: `5 → null`, at both matrix days, **re-executed on the merged tree and byte-identical to v1's finding** (§5). Must NOT change: `deloadLoad({w:100,inc:5})` = `95`; the rung branch; `engine-test.jsx:3093`. The delta is unreachable through the engine's only internal consumer — **`sleep.cjs:136`** (`was :133`) guards with `typeof ex2.w === "number"` before calling — so no receipt string and no card carries the invented 5 inside the engine.
- **Source mutants.** (1) `numeric-coercion-turns-absence-into-deload-five`. (2) `guard-omits-empty-string`. (3) `guard-also-rejects-zero` (`!ex.w`), killed by a `w: 0` control (the existing engine returns `5` for a true numeric `0`; that is not this defect and must not change).
- **Negative controls.** `w: 0` keeps its existing result; `w: "100"` still deloads; a lift with a ladder and an absent `w` returns null before `loadRungs` is consulted; `pct` override path unchanged.

### 1.6 D7 — sessions after the viewed day describe earlier progress (register 77–85) — **TWO CARRIER COLLISIONS AND ONE EXECUTED DEFECT IN v1's HUNK**

**PLAIN** (:79) "The app can use sessions dated after the day being viewed to describe earlier progress, when an earlier view should use only evidence available by that day." · **Current code — `progressAnchor`, `progression.cjs:138–173`** (was `:67–70`). The carriers inserted a **native** row loop ahead of the legacy one; both now compute the same `fkA`/`atA` at `:149–150`:
```js
  const fkA = forksOf(s, ex.id);
  const atA = isoOf(todayStart());
  if (_nativeView(s)) {
    const rows = _governingRows(ex, s) || [];
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      if (!sameEra(fkA, row.d, atA)) continue;          /* NATIVE loop — new at 52a74b6 */
      …
  const days9 = Object.keys(s.sessionLog || {}).sort();
  for (let i = days9.length - 1; i >= 0; i--) {
    if (!sameEra(fkA, days9[i], atA)) continue;         /* FIX 3c — legacy loop, v1's only guarded site */
```
**Current code — `liftTrend`, `progression.cjs:682–693`** (was `:561–565`). The carriers replaced the sorted-date loop with a rows loop:
```js
  const rows = s?.workoutFacts ? E.performedHistoryRows(s) : Object.keys(log).sort().map(d=>({d,rec:log[d],source:'legacy'}));
  const fkT = forksOf(s, exId);
  const atT = (opts && opts.asOf) || isoOf(todayStart());   /* v7.53.0 (b) — era-aware */
  const pts = [];
  for (const row of rows) {
    const {d}=row;
    if (!sameEra(fkT, d, atT)) continue;
```
Both readers still compute an as-of day and use it **only** for era membership, never to bound session dates. The register's mutant name still says it exactly: `as-of-restricts-era-but-not-session-dates`.

- **Owner semantics** — plain Batch-A FIX. · **Behaviour change (v1.1, narrowed).** Exclude session dates strictly after the reader's own as-of day, before any evidence is derived — in **both** `progressAnchor` loops unconditionally (its as-of *is* the wall clock; it takes no `opts`), and in `liftTrend` **only when the caller supplied `opts.asOf`**. The era filter, the rushed/hard/debt exclusions, the same-load and `wKey` matching, the native `performedTrendObservation` path, the set-count cut at `:746–749` (was `:611–614`) and every return shape (`:771`, was `:640`) stay byte-identical.

**Exact hunks — three sites** (`progression.cjs:157`, `:163`, `:692`):
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

**Why `liftTrend`'s guard is conditional — executed, and this is the load-bearing v1.1 finding.** v1's unconditional `if (d > atT) continue;` is **wrong against the protected second gate.** `second-gate.mjs:64` hard-pins `MEASURED_TEST_NOW = "2026-07-29"` (the engine suite's own anchor, `tools/_fixed-now.mjs:54`), while `tools/snapshots/2026-08-06-ledger.json` (frozen pin `62f9e0515bf3d34bc1e0d53cfc309cba0fa9acdf63f87e0fb42f246e6a7c199f`) carries eight sessions from `2026-07-23` to `2026-08-04` — **five of them after the pinned clock**. With no `opts.asOf`, `atT` is that clock, so v1's cut deletes them, `progressionTrend(SNAP).nLifts` falls **3 → 0**, and **`tools/engine-test.jsx:70`** (the R17 instrument assertion) fails inside the candidate second gate. Executed, isolated: a liftTrend-only probe reproduces it; the `progressAnchor` guards alone do not; at any anchor on or after `2026-08-04` (e.g. the v4 harness's own `2026-09-03`) `nLifts` is `3` on both sides. With the conditional guard: **all fourteen laws GREEN, the seeded census delta unchanged at exactly the one D6 cell, the fourteen witness flips unchanged, and `engine-test.jsx:70` no longer moves** — the only candidate-side second-gate failure left is the pre-existing D12 cell at `:106` (§4, §5). The alternative — keep v1's unconditional cut and re-pin `:70` through a new protected second-gate custody — is a real option and is **§7 Q8** for the PM; B2 recommends the narrowed hunk and will not touch the protected second gate without a ruling.

- **Law** `P-D7-anchor-and-trend-exclude-future-sessions` — "The current anchor and an explicitly earlier trend omit later sessions while a later as-of view can still use those same records." Executed at `87eddad`: **raw RED** (the anchor takes `[11,10]` from `2026-09-13` at a `2026-09-03` clock and `liftTrend({asOf:'2026-09-03'})` returns a four-point trend); GREEN on the repaired copy with `{"anchor":[8,7],"trend":null,"laterCount":4}` — **identical detail under v1's hunk and under v1.1's narrowed hunk**, because the law's trend case supplies `asOf` explicitly and its anchor case goes through `progressAnchor`.
- **Delta cells.** Changes: `progressAnchor` (both loops) for any state holding sessions later than the wall clock; `liftTrend` only for an explicit `opts.asOf` — and, transitively, every `liftTrend` consumer that passes one (`progressionTrend`, `liftCall`, `volumeConversion`, `regime`). Must NOT change: `liftTrend({asOf:'2026-09-14'})`; **any `liftTrend` call with no `asOf`** (this is the narrowing); the `resetAt` / `k` / `pts` contract at `:771`; `engine-test.jsx:70`, `:6290` (`tHam.n === 4`, `resetAt === isoV(7)`), `:6304`, `:6320`, `:6505`, `:7759–7790`, `:75`. **Re-executed:** all seeded sessions are on or before both matrix days, so `liftTrend` and `progressAnchor` over every seeded lift are byte-identical at both.
- **Source mutants.** (1) `as-of-restricts-era-but-not-session-dates` — delete all three guards. (2) `future-cut-applied-to-the-trend-only` — guard `liftTrend`, leave both anchor loops. (3) **v1.1 replaces v1's `future-cut-uses-the-wall-clock-not-the-supplied-asof`, now structurally impossible, with `trend-future-cut-applied-without-a-supplied-asof`** — restore v1's unconditional cut; **killed by the protected second gate's `tools/engine-test.jsx:70`** (executed). (4) `future-cut-is-inclusive-of-the-next-day` — `>` → `>=`, killed by a session logged *on* the query day. (5) **new** `anchor-future-cut-omits-the-native-loop` — guard only the legacy `days9` loop (this is v1's hunk), killed by a native-view anchor case.
- **Negative controls.** A session dated exactly on the as-of day is still evidence; `opts.asOf` absent leaves `liftTrend` byte-identical to the merged engine (assert this explicitly — it is the narrowing); a state with no future session produces a byte-identical trace including the same `dayWeather` / `paceRushed` / `cleanAtDate` call sequence; an excluded future date must never be read (no `dayWeather` call for it); the native `progressAnchor` loop excludes a future `row.d` without consulting `_rowRushed` / `_rowAtCurrentLoad`.

### 1.7 D3 — a similarly-named lift's set change is credited to this lift (register 55–63)

**PLAIN** (:57) "The app can count a set change for another similarly named exercise as a change to this exercise, when each exercise should keep its own set history." · **Current code** `rebuild/engine/progression.cjs:225–241`, defect at **`:231`** (**was `:118–134` / `:124`**), text byte-identical:
```js
function _volDeltas(ex, s) {
  const names9 = _formerNames(ex);
  const out9 = [];
  for (const f9 of ((s && s.feed) || [])) {
    if (!f9 || typeof f9.t !== "string" || f9.t.indexOf("VOLUME ") !== 0) continue;
    let named9 = false;
    for (const n9 of names9) if (n9 && f9.t.indexOf("via " + n9) > -1) named9 = true;
    if (!named9) continue;
```
Unbounded **substring** match: `"VOLUME +1 — CHEST via Press incline"` contains `"via Press"`, so the incline's receipt is charged to `Press`. `_formerNames` is now `:216` (was `:109–114`); `_setsAtTime` `:244`.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:62): "prefer stable lift identity and use a whole-name legacy boundary for old receipts … Preserve visible receipt prose if adding structured identity". · **Behaviour change.** Two-tier, per §2: a structured `exId` decides, full stop; otherwise the owner is the **whole name** between `"via "` and the first `" (now "` (or end of string), compared with `===` against `_formerNames(ex)`. **No byte of `writers.cjs` changes in B2**: both VOLUME producers (**`writers.cjs:2162` and `:2319`**, re-pinned from `:2135`/`:2292`, text byte-identical) already emit exactly `VOLUME ±N — <MG> via <ex.n> (now <n> sets)`, so the boundary is already in the data; the `exId` tier is a forward-compatible reader so B3's D44 hunk at `writers.cjs:2319` can add the field without re-opening `progression.cjs`.

**Exact hunk** (`progression.cjs:230–231`) — **text unchanged from v1**:
```
    let named9 = false;
-   for (const n9 of names9) if (n9 && f9.t.indexOf("via " + n9) > -1) named9 = true;
+   if (f9.exId != null) named9 = String(f9.exId) === String(ex && ex.id);
+   else { const at9 = f9.t.indexOf("via "); const own9 = at9 < 0 ? null : f9.t.slice(at9 + 4).split(" (now ")[0];
+     for (const n9 of names9) if (n9 && own9 === n9) named9 = true; }
```

- **Law** `P-D3-volume-receipt-belongs-to-whole-lift-name`. Executed at `87eddad`: **raw RED** (both rows credited); GREEN on the repaired copy with `{"deltas":[["2026-09-01",1]]}`.
- **Delta cells.** Changes: `_volDeltas`, and therefore `_setsAtTime` and the incompleteness cut in **`_deriveSightingFull:643`** (was `:527`), for any state where one lift's name is a prefix-word of another's. Must NOT change: a lift's own receipt still contributes; `VOLUME PASSED` rows carry no `via` and are still skipped; renamed and forked former names still match through `_formerNames:216`; the sign/magnitude parsing at `:233–238` (was `:126–131`). **Re-executed:** `_volDeltas` and `deriveSighting` over every seeded lift byte-identical at both matrix days.
- **Source mutants.** (1) `volume-owner-is-name-substring`. (2) `volume-owner-is-name-prefix-of-the-via-tail`. (3) `volume-owner-boundary-ignores-the-now-suffix`. (4) `volume-owner-trusts-exid-only`.
- **Negative controls.** A row whose `t` has no `"via "` (including `VOLUME PASSED`) is skipped, not thrown on; a row with `exId` matching but a *different* name follows `exId`; a row with `exId` mismatching but the name matching is **refused** (pin this explicitly); a shorter name that is a whole distinct name still matches; a `forks[].prevN` and a `renames[].prevN` still match exactly.

### 1.8 D4 — another lift's earn erases this lift's progress credit (register 65–73)

**PLAIN** (:67) "The app can erase this exercise's progress credit when a different exercise with a longer similar name earns a weight increase, when that credit should belong to this exercise alone." · **Current code** `rebuild/engine/progression.cjs:608–650`, defect at **`:620`** (**was `:492–538` / `:504`**), text byte-identical:
```js
    for (const f9 of ((s && s.feed) || [])) {
      if (!f9 || typeof f9.t !== "string" || !/ EARNED$/.test(f9.t)) continue;
      let hit9 = false;
      for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;
      if (hit9 && f9.d && (!lastEarn9 || String(f9.d) > String(lastEarn9))) lastEarn9 = String(f9.d);
    }
```
Unbounded **prefix** match on the uppercased name. `"PRESS INCLINE 100 EARNED"` starts with `"PRESS"`, so the incline's earn spends `Press`'s sightings at `:637` (was `:520`: `topAt9 = null; topRun9 = 0; tops9.length = 0`). The other cited sites re-pin as: uppercasing `:611` (was `:495`), era start `:612–613` and `:636/:638` (was `:496–497,513,519`), `start9` `:623`, `eraFirst9` `:630`, incompleteness cut `:643` (was `:527`), `catch` fallback `:649` (was `:533`), `deriveSighting` `:653`.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:72): "bind earn receipts to lift identity, with a complete legacy name-and-load boundary for old prose. … Existing receipt text can stay". · **Behaviour change.** Same two-tier convention as D3. Structured `exId` wins where present; otherwise the legacy boundary is **complete**: the row must begin with a whole former name and the remainder must be exactly ` <load> EARNED`. The sole producer is `earn.cjs:89` — `push(\`${ex.n.toUpperCase()} ${upNext} EARNED\`, …)`, **re-verified unchanged at `87eddad`** (`earn.cjs` is not a carriers file) — so the boundary is already in the data. `earn.cjs` is not edited (it is B3's file, `DECISIONS:85`).

**Exact hunk** (`progression.cjs:619–620`) — **text unchanged from v1**:
```
      let hit9 = false;
-     for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;
+     if (f9.exId != null) hit9 = String(f9.exId) === String(ex.id);
+     else for (const n9 of names9) if (f9.t.indexOf(n9) === 0 && /^ [-+]?(?:\d+(?:\.\d+)?|\.\d+) EARNED$/.test(f9.t.slice(n9.length))) hit9 = true;
```
(the regex is the accepted law's own control expression, adopted verbatim so the product and the oracle agree on the boundary).

- **Law** `P-D4-other-lift-earn-cannot-spend-sightings`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy with `{"before":{"topAt":100,"topRun":2},"afterOther":{"topAt":100,"topRun":2},"afterOwn":{"topAt":null,"topRun":0}}`.
- **Delta cells.** Changes: `_deriveSightingFull.start9` / `lastEarn9`, hence `deriveSighting`, `topAt`, `topRun`, `tops`, for prefix-colliding names. Must NOT change: the lift's own earn still spends; the era-start rule; the incompleteness cut at `:643`; the `catch` fallback at `:649`; `engine-test.jsx:8235`. **Re-executed:** `deriveSighting` over every seeded lift byte-identical at both matrix days.
- **Source mutants.** (1) `earn-owner-is-unbounded-name-prefix`. (2) `earn-boundary-accepts-any-tail`. (3) `earn-boundary-rejects-decimal-loads`. (4) `earn-owner-trusts-exid-only`.
- **Negative controls.** `"PRESS 100 EARNED"` still spends; `"PRESS 102.5 EARNED"` still spends; `"PRESS EARNED"` does not; `"BENCH PRESS 100 EARNED"` does not spend `PRESS`; a former name from `renames[].prevN` still spends (the FIX-4b §1 rule at `:611` must survive); a row with `exId` mismatching but the prose matching is refused.

### 1.9 D29 — press indirect front-delt credit is dropped when logged (register 369–377)

**PLAIN** (:371) "The app counts pressing toward front-shoulder work in the plan but drops that credit when reporting the completed work." · **Current code** `rebuild/engine/volume.cjs:41` (`muscleVolume`) against `:81` (`programmeVolume`) — **`volume.cjs` is untouched by the merge, so every coordinate here is v1's**:
```js
const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; });
```
```js
const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => add(mg2 === "delts" ? "delts_front" : mg2, n * f2));
```
`INDIRECT.press = {triceps:0.5, delts:0.5}`; `muscleVolume`'s bucket list at `:43` is built from `volBucket = head || mg`, so the coarse `"delts"` key it writes is never returned.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:376): "Route indirect delts credit to the same delts_front bucket already used by programmeVolume … without changing the training credit fraction". · **Behaviour change.** Apply `programmeVolume`'s existing head mapping in `muscleVolume`'s `count` closure. No fraction, no bucket list, no band, no zone rule changes.

**Exact hunk** (`volume.cjs:41`) — unchanged:
```
- const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; });
+ const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { const k6 = mg2 === "delts" ? "delts_front" : mg2; by[k6] = (by[k6] || 0) + n6 * f2; });
```

- **Law** `P-D29-…-same-indirect-credit`. Executed at `87eddad`: **raw RED** (designed `delts_front` = 7, logged `n7` = 4); GREEN on the repaired copy.
- **Delta cells.** Changes: `muscleVolume`'s `delts_front` `n7`/`p7`, its `zone`, and every `delts_front` consumer downstream. Must NOT change: `triceps`, `biceps`, `forearms` indirect credit; any bucket with no indirect lender; `programmeVolume`; the `fmtN` one-decimal formatting at `:56`; `engine-test.jsx:2395`, `:2416`, `:2604`, `:3641`, `:4077–4085`. **Re-executed:** on the seeded state `muscleVolume` returns `[]` at both matrix days (no session inside the 14-day window), so the seeded public census does not move; `volumeImbalance` identical.
- **Source mutants.** (1) `press-credit-goes-to-unreturned-coarse-delt-bucket`. (2) `indirect-credit-remaps-every-key-to-delts-front`. (3) `indirect-credit-doubled-into-both-keys`. (4) `indirect-credit-rounded-before-summing`.
- **Negative controls.** `triceps` from the same press row unchanged; a lift with no `INDIRECT` entry unchanged; a state with a `delts_front` lift but no press unchanged; the `prev7` window mirrors the `now7` change exactly. **Condition to record (re-executed and now quantified):** the accepted law's `control` (`laws-evidence-comparability.cjs:11`) **adds** the indirect delta on top of `muscleVolume`'s own output, so on a repaired engine it double-counts and goes RED. The full 45-law run measures this exactly: GREEN repair controls fall `89 → 88`, and D29's is the one lost. It may serve as a frozen-side satisfiability demonstration only and must never be re-run as a candidate oracle.

### 1.10 D18 — this week's set change is lost behind 80 feed rows (register 305–313)

**PLAIN** (:307) "The app forgets this week's set change when enough ordinary notes appear ahead of it." · **Current code** `rebuild/engine/volume.cjs:157–160` (coordinates unchanged):
```js
  (s.feed || []).slice(0, 80).forEach((f) => {
    if (!f || !f.t || !f.d || f.d < monday || f.t.indexOf("VOLUME ") !== 0) return;
    const ex = (s.exercises || []).find((x) => f.t.indexOf("via " + x.n) > -1);   /* "VOLUME PASSED" carries no "via" — declines are not moves */
    if (ex && !moves.some((m) => m.kind === "sets" && m.exId === ex.id)) moves.push({ kind: "sets", d: f.d, rid: null, exId: ex.id, mgs: spillOf(ex.id) });
```
An accidental display prefix bounds a weekly budget scan.

- **Owner semantics** — plain Batch-A FIX. · **Behaviour change.** Scan the whole feed; the `monday` bound, the `VOLUME ` prefix test, the de-duplication by `exId` and the `spillOf` mapping stay exactly as they are.

**Exact hunk** (`volume.cjs:157`) — unchanged:
```
- (s.feed || []).slice(0, 80).forEach((f) => {
+ (s.feed || []).forEach((f) => {
```

- **Law** `P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix`. Executed at `87eddad`: **raw RED** (`b.sets.length === 0` with 80 notes ahead); GREEN on the repaired copy.
- **Delta cells.** Changes: `structuralMovesThisWeek.moves` / `.sets` / `.mgsTouched` when more than 80 feed rows precede a current-week VOLUME receipt, and hence the Auto-Pilot tighten veto (`engine-test.jsx:8079`), the `volumePush` week budget and the offer-expiry branch at **`writers.cjs:2313`** (was `:2286`). Must NOT change: the `adjustments` loop at `:152–156`; `calOrSteps`; a VOLUME row outside the week; `VOLUME PASSED`; `engine-test.jsx:6351`, `:6404`, `:6593`, `:8088`, `:8114`. **Re-executed:** the seeded feed is 9 rows, so the seeded census is unchanged at both matrix days.
- **Source mutants.** (1) `eighty-feed-lines-only`. (2) `weekly-bound-dropped-with-the-prefix`. (3) `duplicate-moves-no-longer-deduped`.
- **Negative controls.** A same-week VOLUME row inside the first 80 is still found exactly once; two VOLUME rows for one lift still yield one move; `VOLUME PASSED` yields none; a feed with 5,000 rows is a performance observation, not a correctness delta (pin a bounded time assertion, not a golden).

**Objection recorded (carried from v1, unchanged and re-verified at `87eddad`).** `volume.cjs:159` resolves the receipt's owner by the *same* unbounded-substring rule D3 repairs in `progression.cjs:231` — `find((x) => f.t.indexOf("via " + x.n) > -1)` — so after D18 lifts the 80-row cap this reader can attribute a longer-named lift's receipt to the shorter lift across the whole feed, which is D3's defect in a reader the register does not give a D-id. Recommendation: apply §2's convention here inside B2 as one more one-line hunk (`f.exId != null ? String(f.exId) === String(x.id) : own9 === x.n`), because D18 measurably widens the exposure. PM decision required (§7 Q2); B2 will not do it silently. **v1.1 addendum:** a fourth site, `volume.cjs:302` (`_setsMovesSince`), carries the same `indexOf("via ") > -1` test behind its own `slice(0, 120)` cap; D18 does **not** lift that cap, so its exposure is unchanged by B2 — record it as a non-D register candidate, not a B2 hunk.

### 1.11 D28 — planned weekly sets use a superseded schedule (register 147–155)

**PLAIN** (:149) "The app counts planned weekly sets using an old training schedule after a newer schedule has taken effect." · **Current code** `rebuild/engine/volume.cjs:62–64` (coordinates unchanged):
```js
function programmeVolume(s) {
  const perWeek = {};
  for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
```
A hard-coded authored week (2026-07-27) is the denominator of every designed-volume number.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:154): "Derive the relevant week from the as-of calendar and use the effective split for its days." · **Behaviour change.** Derive the week from the query day using the Monday convention this very module already uses for the structural budget (`volume.cjs:146–148`), so the two weekly readers agree by construction. `dayType` remains the only schedule authority, and it is already dated (D9's repair lands underneath).

**Exact hunk** (`volume.cjs:64`) — unchanged:
```
- for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
+ const d9 = mk(isoOf(todayStart())); const mon9 = new Date(d9.getTime() - ((d9.getDay() + 6) % 7) * DAY);
+ for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mon9.getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
```

- **Law** `E-D28-programme-volume-follows-the-current-effective-split`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy.
- **Delta cells.** Changes: `perWeek`, so every `programmeVolume` `sets`/`zone`/`tier`, `volumeImbalance`, the volume-push routing target and the front-delt indirect total — whenever the as-of week's U/L counts differ from the 2026-07-27 week's. Must NOT change: `bucket`, `exActive` filtering, `indirectOnly`, `lifts[]` projection, the `.toFixed(1)` rounding, the descending sort. **Re-executed on the merged tree, and the finding holds byte-for-byte:** at both matrix days `programmeVolume` is identical base vs repaired — `[["biceps",11],["back",10],["chest",10],["abs",10],["triceps",9],["delts_side",8],["quads",8],["forearms",7],["delts_rear",6],["calves",6],["glutes",6],["hams",4],["delts_front",3]]` — and `volumeImbalance` with it. D28's public golden risk on the seed is **zero at both matrix days**; the private census must still be checked on the owner's PC.
- **Source mutants.** (1) `programme-volume-uses-authored-july-week`. (2) `programme-week-starts-on-sunday`. (3) `programme-week-reads-the-next-week`. (4) `programme-week-ignores-the-split-argument`.
- **Negative controls.** A state with no `split` reproduces the legacy dow reading for the as-of week; the dated REFEED retirement (`engine-test.jsx:7822`) untouched; `structuralMovesThisWeek.monday` and `programmeVolume`'s Monday agree on the same clock (assert them equal).

### 1.12 D30 — first-set trend pools lifts across a technique change (register 379–387) — **ACCEPTED BRIEF, REUSED VERBATIM**

B2's D30 section **is** `rebuild/m2/BRIEF-SET-ONE-ERA.md` at `87eddad` — 75 lines, 18,912 bytes, **sha256 `a2e88bed8edf566b4551d9a48b79282b9e367b2fd195bde5f1be41f13baa84b3`, re-verified unchanged by the merge**, byte-equal to the bytes accepted at `rebuild/DECISIONS.md:82`. It is incorporated **verbatim and unmodified**; nothing in it is rewritten, narrowed or widened here, and its §0 product allowlist ("`rebuild/engine/volume.cjs` only, the `setOneRead` declaration plus two late-bound delegates to existing `E.forksOf`/`E.sameEra`"), its §1 behaviour, its §2 twelve ERA30 case families, its §3 fault list and its §5 "never" list all carry into B2 as written. Its review is `rebuild/m2/REPORT-SET-ONE-ERA-BRIEF-ASTRA.md` (58 lines, 6,770 bytes, `670e303e8739bc3cd11336b093417a3102c6cab1cbf6f7befa31cbaf7b3926d2`, unchanged).

Its §1 product rule, quoted verbatim (`BRIEF-SET-ONE-ERA.md:17`): "Preserve the initial exercise lookup and IDLE guard exactly. Immediately after that guard, obtain `forksOf(s, exId)` once; obtain `isoOf(todayStart())` once only when that returned array is nonempty, otherwise use `null` as the unused query-era argument. Inside the existing sorted-date loop, before reading that date's session record, skip it when `sameEra(forks, d, at)` is false. All remaining original code is unchanged."

Current code it applies to, `rebuild/engine/volume.cjs:189–196` (coordinates unchanged by the merge):
```js
function setOneRead(s, exId) {
  const ex9 = (s.exercises || []).find((x) => x && x.id === exId);
  if (!ex9 || typeof ex9.w !== "number") return { status: "IDLE", exId };
  const pts = [];
  for (const d of Object.keys(s.sessionLog || {}).sort()) {
    const sl = s.sessionLog[d];
```
Law `P-D30-first-set-trend-respects-the-recorded-technique-era`. Executed at `87eddad`: **raw RED** (three pre-fork sessions plus one post-fork session return `LIVE, n:4`); GREEN on the repaired copy.

**The two conditions recorded at `DECISIONS.md:82`, verbatim, carry into B2 unchanged:** "(1) the accepted law's `control` patch (laws-evidence-comparability.cjs:24) reads the query day unconditionally, whereas the product rule reads it only with nonempty forks — the control may serve as a result oracle, never as the clock-trace oracle for ERA30-CLOCK / ERA30-NONE; (2) the P6 second-gate sites 8790–8793 and the seeded set-one card are the named protected surfaces for this theme — cowork's verdict is UNCHANGED, and any executed difference is a RED stop for a reviewed successor cell, never a golden regeneration."

Two B2-specific notes, neither altering the accepted scope: the two delegates D30 introduces are **also** D32's dependency (§1.14), which is why D30 precedes D31/D32 in the package order; and **`volume.cjs`'s pre-image `c32298e7…` was in fact not disturbed by NATIVE-CARRIERS (verified), so D30's coordinates survived the rebase exactly as v1 predicted.** The engine has both delegates available (`plan.cjs:36–43` `forksOf`, `:46–50` `eraIdx`, `:53–56` `sameEra`, exported at `plan.cjs:341` — **re-pinned from `:331`**), and `volume.cjs` already delegates `isoOf` (`:18`) and `todayStart` (`:22`), so the rule adds exactly two `const … = (...args) => E.…` lines and one guard line.

### 1.13 D31 — added-set tolerance inferred only from pre-change workouts (register 389–397)

**PLAIN** (:391) "The app says an added set was tolerated using only workouts from before that set was added, when it should wait for evidence after the change." · **Current code** `rebuild/engine/volume.cjs:226–239` (unchanged), with the trend's own cut now at **`progression.cjs:746–749`** (was `:611–617`):
```js
  const lastK = seq[seq.length - 1].k;
  let cut = seq.length;
  while (cut > 0 && seq[cut - 1].k === lastK) cut--;
  …
  const post = seq.slice(cut);
  const changedAt = post[0].d;
  …
  const t = liftTrend(s, exId);
  if (!t || t.n < TREND_MIN_SESSIONS) return { status: "READING", exId, changedAt, prevK, k: lastK, dK, have: post.length, … };
```
`seq` (`:224`) is built over **all** logged days; `liftTrend`'s `pts` excludes hard-session days (`progression.cjs:722`, was `:587`). When the most recent session is a hard day the two disagree about `lastK`, `liftTrend`'s reset cut lands on the **pre**-change run, and `volumeConversion` reports `LIVE`/`TOLERATED` from pre-change evidence while its own prose claims the post-change block.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:396): "Require the trend's set count and contributing dates to match the post-change block before returning a tolerance finding." · **Behaviour change.** Before any tolerance tier is produced, require the trend actually to describe the post-change block: its reported set count equals `lastK` and every contributing point is dated on or after `changedAt`. Otherwise the existing `READING` return is used. No threshold, no new tier, no change to `liftTrend`.

**Exact hunk** (`volume.cjs:238`) — unchanged:
```
- if (!t || t.n < TREND_MIN_SESSIONS) return { status: "READING", exId, changedAt,
+ if (!t || t.n < TREND_MIN_SESSIONS || t.k !== lastK || t.pts.some((p8) => p8.d < changedAt)) return { status: "READING", exId, changedAt,
```
(`t.k` and `t.pts` are already on `liftTrend`'s return, **`progression.cjs:771`**, was `:640` — no new export.)

- **Law** `V4-volume-tolerance-post-change`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy, and GREEN under the narrowed D7 hunk as well (the `volumeConversion` call site passes no `asOf`, so D31's expectations are now constructed against an **unchanged** `liftTrend` — see §3's D7 × D31 note, revised).
- **Delta cells.** Changes: `volumeConversion` `LIVE → READING` (and the disappearance of `tier`/`tolerated`/`delivered`/`subtract`/`trend`) exactly when the trend does not describe the post-change block. Must NOT change: any `LIVE` whose trend already matches; `IDLE`; the `READING` prose and its derived review dates; `blockDays`; `have`/`need`; `UNDELIVERED`, `NOT-TOLERATED`, `MIXED-PHASE`, `UNCLEAR`, `TOLERATED`, `OUTCOME-COMPATIBLE`, `REPLICATED` selection for matching trends; `engine-test.jsx:6413–6520`, `:6619`, `:6812`. **Re-executed:** every seeded lift returns `IDLE` from `volumeConversion` at both matrix days, so the seeded census is unchanged.
- **Source mutants.** (1) `reuse-pre-change-tolerance`. (2) `post-change-check-on-the-count-only`. (3) `post-change-check-on-the-dates-only`. (4) `post-change-check-is-inclusive-of-the-prior-day`.
- **Negative controls.** A clean post-change block of ≥4 sessions still reaches its tier with byte-identical prose; a session dated exactly on `changedAt` qualifies; `t === null` still returns `READING` with the same `have`; a `dK < 0` block behaves as before; the `subtract`/`safety` receipt unchanged where the tier still fires.

### 1.14 D32 — replication counts workouts from a different technique era (register 399–407)

**PLAIN** (:401) "The app says a benefit repeated under comparable conditions even though the earlier workouts used a different technique; whether those workouts may count is the owner's call." · **Current code** `rebuild/engine/volume.cjs:278–288` (unchanged):
```js
        /* replication — any EARLIER stable block of outcome length that also rose */
        const segs = [];
        let s0 = 0;
        for (let i = 1; i <= seq.length; i++) { if (i === seq.length || seq[i].k !== seq[i - 1].k) { segs.push(seq.slice(s0, i)); s0 = i; } }
        segs.pop();
        const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
        tier = priorOK ? "REPLICATED" : "OUTCOME-COMPATIBLE";
```
No comparability boundary. The era tools are already on the engine — `plan.cjs:36–43` `forksOf`, `:46–50` `eraIdx` (`f.from <= d`, inclusive), `:53–56` `sameEra` (empty forks → true), all exported at `plan.cjs:341`.

- **Owner semantics — Batch B, verbatim from `rebuild/DECISIONS.md:60`:**
> D32 APPROVED-FIX — "benefit replicated" counts only sessions from the CURRENT technique; all other replication thresholds stay as they are.

- **Behaviour change.** A candidate earlier block establishes replication only if **every** session in it belongs to the query day's technique era, using the engine's existing `sameEra` membership and the same query-day convention `liftTrend` (`progression.cjs:688`, was `:562`) and D30's accepted rule use. `TREND_MIN_SESSIONS`, `REVIEW_OUTCOME_D`, `_blockSlope`, the segment construction, the `segs.pop()` exclusion and both `why` strings are untouched — that is the owner's "all other replication thresholds stay as they are".

**Exact hunk** (`volume.cjs:283`, reusing D30's two delegates — `volume.cjs` gains no third binding) — unchanged:
```
-       const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
+       const fk2 = forksOf(s, exId), at2 = isoOf(todayStart());
+       const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && g9.every((p8) => sameEra(fk2, p8.d, at2)) && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
```

- **Law** `V4-volume-replication-same-era`. Executed at `87eddad`: **raw RED**; GREEN on the repaired copy.
- **Delta cells.** Changes: `tier` `REPLICATED → OUTCOME-COMPATIBLE` (and the `why` selection at `:285–287`) when every qualifying earlier block is cross-era. Must NOT change: a same-era earlier block still yields `REPLICATED` with byte-identical prose; no-fork states; `tLong`; `delivered`; `blockDays`; the `needD9` leangain branch; `engine-test.jsx:6619`. **Re-executed:** every seeded lift is `IDLE` here, so the seeded census is unchanged.
- **Source mutants.** (1) `compare-earlier-technique-block`. (2) `replication-era-checked-on-the-block-start-only`. (3) `replication-era-uses-the-latest-stored-fork`. (4) `replication-era-excludes-the-inclusive-boundary`. (5) `replication-threshold-relaxed-with-the-era-cut`.
- **Negative controls.** No forks → byte-identical result; an unrelated exercise's forks cannot change this lift; a legacy single `fork.from` is honoured (`plan.cjs:41`); a block entirely inside the current era with a rising slope still replicates. **Condition to record (D30 condition (1) generalized):** the accepted law's `control` (`laws-evidence-comparability.cjs:45`) derives `asOf` from the last logged day, while the product rule reads the query day (`todayStart()`); in the law's fixture they coincide. The control may serve as a result oracle, never as the clock-trace oracle for D32's clock family.

## 2. THE IDENTITY CONVENTION (D3/D4 — and the scheme B3's D37/D38/D39 must reuse)

`PLAN…:157` requires this brief to state the convention so the engine does not end up with two. It is stated here as a **durable lift-identity scheme**, not a string trick, and it is deliberately reader-first so B2 can land it without touching `writers.cjs`, `merge.cjs`, `earn.cjs` or `migrate.cjs`. **C1–C5 are reproduced verbatim from v1; only the three line citations inside them are re-pinned onto `87eddad`, marked `[re-pinned]`.**

**C1 — identity is the record id, never a name.** A lift's durable identity is `String(ex.id)`. Names (`ex.n`, `forks[].prevN`, `renames[].prevN`) are *display history*, resolved through `_formerNames` (`progression.cjs:216` `[re-pinned from :109–114]`) and used only to interpret prose written before the id was carried.

**C2 — structured identity is authoritative and terminal.** When a feed/receipt/adjustment record carries a structured owner field, that field decides ownership on its own: a match is ownership, a mismatch is **non**-ownership, and the prose is not consulted as a fallback. The field name is **`exId`** — the name `writers.cjs` already uses on `agentProposals` (`:1486`, `:1496` `[re-pinned from :1459, :1469]`), on `adjustments[].exUndo.exId` (read at `volume.cjs:155`) and on `structuralMovesThisWeek`'s own `moves[].exId` (`:160`). B2 implements only the *reader* half; B3 (whose D44 hunk already edits `writers.cjs:2319` `[re-pinned from :2292]`, and whose D37/D38/D39 edit `merge.cjs`/`writers.cjs`) adds the writer half and must use this exact field name and this exact terminal semantics.

**C3 — the legacy boundary is a WHOLE-NAME boundary at the producer's own recorded delimiter. Never a substring, never a bare prefix.** Two boundaries exist because two producers exist, and each is read from the producer, not invented:
- **VOLUME receipts** (`writers.cjs:2162`, `:2319` `[re-pinned from :2135, :2292]`) emit `VOLUME ±N — <MG> via <ex.n> (now <n> sets)`. The owner is therefore the exact string between `"via "` and the first `" (now "`, or to end-of-string when that suffix is absent. Compared with `===` against `_formerNames(ex)`. A row with no `"via "` (e.g. `VOLUME PASSED`) has **no owner** and is skipped, never guessed.
- **EARNED receipts** (`earn.cjs:89`) emit `<EX.N.toUpperCase()> <load> EARNED`. The owner is a former name that both starts the string **and** is followed by exactly ` <numeric load> EARNED` — regex `/^ [-+]?(?:\d+(?:\.\d+)?|\.\d+) EARNED$/` applied to the remainder. Name-only or arbitrary-tail matches are **not** ownership.

**C4 — the boundary is complete, not heuristic.** No substring search, no `startsWith` without a terminator, no fuzzy or case-insensitive widening beyond the uppercasing the producer itself applies (`progression.cjs:611` `[re-pinned from :495]`), no invented delimiter. If a future producer's format has no such delimiter, the correct move is to add `exId` at that producer (C2), not to loosen C3.

**C5 — resolution is total and side-effect-free.** Ownership resolution answers exactly one of *mine* / *not mine* / *unattributable*, never throws, never mutates the record, never consults the clock, ids or storage, and treats an unattributable record as "not mine" for spending/crediting purposes while leaving it in the history.

**C6 — one convention, one reader shape.** Every reader that attributes a written receipt to a lift uses C2→C3 in that order: `progression.cjs:231` (`_volDeltas`, D3) `[re-pinned from :124]`, `progression.cjs:620` (`_deriveSightingFull`, D4) `[re-pinned from :504]`, and — pending the PM's answer to §7 Q2 — `volume.cjs:159` (`structuralMovesThisWeek`, discovered under D18). B3's `earnWalk` as-of repair (D37), trial-decision preservation (D38), offer-dismissal preservation (D39) and the VOLUME-receipt truth guard (D44) reuse C1–C5 unchanged; **B3 must not introduce a second identity scheme, a per-set immutable-id model, or a name-normalisation pass.**

## 3. Ordering and interactions inside B2, and the shared surfaces

**Why this order** (`PLAN…:85`, re-verified against the merged source): D9 first because `dayType` is the schedule authority D28 then reads; D2 next because `_bornValid` gates whether an impossible record ever reaches `targetsFor`, which D1 edits; D1/D5/D6 are three independent pure-helper repairs inside `progression.cjs`; D7 precedes D3/D4 because it changes `liftTrend`/`progressAnchor`; D3 before D4 because both adopt §2 and D3 establishes the VOLUME boundary D4's EARNED boundary mirrors; D29/D18/D28 are three independent `volume.cjs` repairs; **D30 must precede D32** because D30's accepted scope introduces the `forksOf`/`sameEra` delegates D32's hunk consumes; D31 before D32 only because both edit `volumeConversion` and D31's guard sits above D32's replication branch.

**Real interactions to prove, not assume.**
- **D7 × D30.** D30's accepted brief forbids a `d <= today` cut in `setOneRead` ("a future session before the next fork remains eligible … That historical behavior is outside this correction", `BRIEF-SET-ONE-ERA.md:19`). **B2 must not extend D7's cut into `setOneRead`**; pin a case where a future in-era session is excluded from `progressAnchor` and still eligible in `setOneRead`. **v1.1 note:** with D7's `liftTrend` guard narrowed to `opts.asOf`, the divergence is narrower still and easier to state — `setOneRead` and a no-`asOf` `liftTrend` now agree.
- **D7 × D31 — REVISED.** v1 said "D31's expectations must be constructed against post-D7 behaviour". With the narrowed hunk, `volumeConversion`'s `liftTrend(s, exId)` call passes **no** `asOf`, so D31 now reads an **unchanged** `liftTrend`. Executed: D31's law is GREEN under both hunk variants with identical detail. Pin the no-`asOf` invariance explicitly so this stays true.
- **D9 × D28.** D28's law asserts one `U` day in the current week under a single split row; D9 changes *which* row wins. Pin one case with an unsorted multi-row split so both repairs are exercised together.
- **D3 × D4.** They share `_formerNames` and both change what `_deriveSightingFull` sees (D3 through `_volDeltas`→`_setsAtTime`→the incompleteness cut at `:643`, D4 through `lastEarn9`). Pin a joint case.
- **D2 × D1.** With `_bornValid` fixed, an impossible record stays quarantined and never reaches `targetsFor`; the `RangeError` at `progression.cjs:271` remains reachable only for a record never quarantined. D1's hunk must not change that.
- **D5 × D6.** Both feed `deloadLoad`; a duplicate-only ladder plus an absent load must return `null` once, not `5`.
- **NEW: D1 × the carriers' native view, and D7 × the carriers' native loops.** The seeded state has **no `workoutFacts`** (executed), so neither native path is exercised by the seeded census or by any of the fourteen law fixtures. B2 must pin one native-view case for `governingLast`-gated `targetsFor` (§1.3) and one for `progressAnchor`'s native loop (§1.6), or both halves of the merged resolution ship with one half unproved.

**Shared surfaces with B3 (B2 goes first, `PLAN…:91`).** `progression.cjs:225–241` `_volDeltas` — D3 rewrites its owner test; B3's **D44** asserts over `_volDeltas` and B3's **D37** rewrites `earnWalk`'s as-of, which reads the same sighting derivation D4 changes. `volume.cjs:154–160` — D18 removes the 80-row slice at `:157` inside the exact range D44 reads. B3 must rebase onto B2's post-image, adopt §2's convention, and (if §7 Q2 is answered yes) find `volume.cjs:159` already converted.

**Shared surfaces with NATIVE-CARRIERS — DISCHARGED, with the specific collisions now named.** v1 flagged `eraFresh` and the `PROGRESSION_RESET_MAPPING_REQUIRED` refusal for re-verification. Executed at `87eddad`: `eraFresh` is at `plan.cjs:291` and is exported at `:341` alongside `forksOf`/`eraIdx`/`sameEra`, all four **unmodified in body** — D30's and D32's delegates are safe. `PROGRESSION_RESET_MAPPING_REQUIRED` is thrown at `progression.cjs:117` inside `_governingRows`, i.e. inside the native path `governingLast` and `progressAnchor` now take — so **B2's D1 and D7 hunks sit above a throwing call** and must not swallow it: pin that a native state whose reset date collides still throws `PROGRESSION_RESET_MAPPING_REQUIRED` through `targetsFor` and `progressAnchor` after the hunks. The two genuine hunk-level collisions (`governingLast`, the native anchor loop) are handled in §1.3 and §1.6. No other B2 site moved in text.

**Shared surface with Track A.** `programmeVolume`, `muscleVolume` and `targetsFor` are rendered by A1/A2 — and `targetsFor`'s **signature** is now `(ex, s)`, which A must already have absorbed from the carriers merge. A's expectations must be written against post-B2 behaviour or re-pinned after the merge (`PLAN…:149`, risk 6).

## 4. Gate-carrier collisions — the objection to the plan's "disjoint" claim, now measured exactly

The plan's merge recommendation calls B2 ∥ B1 "disjoint: B2 = progression/plan/volume, B1 = dates/sleep/policy/today" (`PLAN…:113`). That is true of the **product** files and **false of the gate carriers**, and this brief maintains that objection. Every number below was executed on the merged tree (`87eddad`) and on the discarded repaired copy, with the witness harness made failure-tolerant so **every** assertion is reported, not just the first:

| gate | on `87eddad`, unmodified | on the repaired copy | carrier needed |
|---|---|---|---|
| `witnesses-1` (`defect-witnesses.cjs`, `557c12e7…`) | `10/10 reproduced` | **`2/10`** — D1, D2, D3, D4, D5, D6, D7, D9 flip; **D8 and D10 still reproduce** | **new**, and it is **B2's eight + B1's two in one file** |
| `witnesses-2` (`833db043…`) | `10/11` — **D12 already RED** at `:51` (`0.1 !== 100`), D12 repaired at `DECISIONS:87` | **`9/11`** — exactly one more flips: **D18** at `:106` | **extend** the accepted `legacy-step-efficacy-carriers.cjs:17–18` (D12 slope/resolved) with D18; preserve D11, D13–D17, D19–D21 |
| `witnesses-3` (`5/5`, D23–D27) | `5/5 reproduced` | **`5/5` unchanged** | **none** — new v1.1 evidence that B2 does not reach it |
| `witnesses-4` (`c90ffeaa…`) | `5/5 reproduced` | **`0/5`** — D28, D29, D30, D31, D32 all flip; first throw at `:47` (`programmeVolume chest 6 → 3`) | **new**, and **all five are B2's** — the one place the plan's grouping is exactly right |
| `witnesses-6` | `4/4 PASS` | `4/4 PASS` | none |
| `witnesses-5`, `witnesses-7` | fail on the **unmodified** merged tree | fail identically | pre-existing at the tip; **not a B2 delta**, flag to the PM |

**Second gate.** `second-gate.mjs --candidate` on the merged tree: the reference side completes `FINAL108: 3072 passed, 0 failed`; the **candidate** side aborts with `FAILED ASSERTION tools/engine-test.jsx:106` — the D12 step-efficacy cell, which is exactly the site the accepted protected custody owns (`rebuild/conform/v4/postfix/step-efficacy-second-gate.cjs`, and `ci-second-gate.cjs:10` `SITE='tools/engine-test.jsx:106:5'`). So on this tree only the first 261 engine-test assertions are observable without that custody. **Within them, B2's repaired copy adds exactly one failure — `tools/engine-test.jsx:70` under v1's D7 hunk, and none at all under v1.1's narrowed hunk** (§1.6, §5). **Obligation:** the remaining ~2,811 assertions of the 3,072-assertion surface are *not* observed here and must be re-run by the implementer with the D12 custody in place; any movement there is a RED stop under §5(a).

Recommendation to the PM, unchanged from v1: serialize B1 and B2 on the `witnesses-1` carrier even if their product merges stay parallel, or accept one rebase pass on that file (§7 Q4).

## 5. Golden / receipt surfaces, and the protected surfaces

**Receipt and prose surfaces: none are edited.** No hunk in §1 changes a feed string, a receipt template, a `why` string, a card, a schema or a threshold. D31 can *select* the existing `READING` prose instead of a tier's prose, and D32 the existing `OUTCOME-COMPATIBLE` prose instead of `REPLICATED`'s; both strings already exist verbatim (`volume.cjs:239`, `:287`).

**Executed public-census scope, re-run on `87eddad`.** Over the seeded state at both matrix days (`2026-09-03`, `2026-09-07`), the same thirteen full-engine reads — `programmeVolume`, `muscleVolume`, `volumeImbalance`, `structuralMovesThisWeek`, `targetsFor`, `loadRungs`/`maxedOut`/`nextLoad`/`deloadLoad`, `deriveSighting`, `_volDeltas`, `setOneRead`, `volumeConversion`, `liftTrend`, `progressAnchor`, `dayType`, `nowModel` — are byte-identical between base and repaired **except one cell**: `deloadLoad` for `fly` and `hipthrust`, **`5 → null`** (D6), at both days. That is four JSON positions for one primitive change, and nothing else moved: v1's finding reproduces exactly. The cell is unreachable through the engine's only internal consumer (`sleep.cjs:136` guards on `typeof ex2.w === "number"`). The **public conformance suite** (`rebuild/conform/run.cjs`) output is byte-identical base vs repaired apart from absolute paths, on both variants.

**The one public-golden surface v1 missed, and how v1.1 closes it.** The direct-call census above cannot see `tools/engine-test.jsx`'s own fixtures. Under **v1's** unconditional D7 `liftTrend` cut, `tools/engine-test.jsx:70` fails (`progressionTrend(SNAP).nLifts` 3 → 0) because the protected second gate hard-pins the suite's `2026-07-29` anchor while `tools/snapshots/2026-08-06-ledger.json` runs to `2026-08-04`. Under **v1.1's** narrowed hunk the cell is byte-identical and the executed public golden delta over everything reachable here is **still exactly the one D6 census cell**. §7 Q8 puts the alternative (keep v1's cut, re-pin `:70` through a new protected second-gate custody) to the PM.

**Recommendation on re-pinning (`PLAN…:148`, risk 5): re-pin in-package, not in a separate successor.** The whole executed public delta is one primitive cell created by an owner-approved repair whose FIX line anticipates it (register :50, "any census path containing an invented deload will change in the later fix"). The three witness carriers of §4 are in-package by construction. **Two hard exceptions**, both pre-committed: (a) any *unlisted* public or private delta beyond that cell — including anything in the ~2,811 unobserved engine-test assertions — is a **RED stop** for an exact reviewed successor expectation, never a regenerated golden, never a suppressed assertion (`BRIEF-IMPORT-GUARDS.md:90`, `:89`); (b) the protected surfaces below are verdict-only and never re-pinned in-package.

**Protected surfaces (`DECISIONS:82` condition (2)), kept verdict-only.**
- The **P6 second-gate cells at `tools/engine-test.jsx:8790–8793`** — `S6 = clP(SEED)` with synthetic June sessions, `r6.status === "LIVE" && r6.n === 5 && r6.pct > 0`, then the sub-minimum `COUNTING` assertion. Re-read at `87eddad` (`engine-test.jsx` unchanged): the fixture carries **no `forks`** on `ham` and every session is dated 2026-06-01…2026-06-15, so D30's era cut is structurally inert there, D7's cut is now `asOf`-gated and inert there too, and D31/D32 are not on the `setOneRead` path. B2's expectation is therefore **UNCHANGED**, exactly as cowork recorded; **the package proves it by execution on the owner's PC and reports the verdict only** — no cell values, no hashes, no prose. An executed difference is a RED stop for a reviewed successor cell.
- The **seeded set-one laboratory card** (`sleep.cjs:1141` `labAnalytics2`, whose `setOneRead` call is `sleep.cjs:1286` `[re-pinned from :1283–1292]`, the only engine consumer of `setOneRead`; frozen `app.jsx:7407`). Same rule: verdict-only UNCHANGED, proved by execution, never regenerated.
- **`rebuild/conform/private/live.json` and the private `live.main` golden** are never opened, named-with-values, hashed or quoted in any report (`run.cjs:115–117`, `BRIEF-IMPORT-GUARDS.md:89,103`). D30 is the only LIVE-TRIGGERED defect in B2 (register :384), so D30 is the one place a private-census consequence is genuinely anticipated. If authorized private execution finds one, **the gate stays RED and a protected successor expectation is reviewed** (`DECISIONS:82`, "Not accepted here … private census effects").
- The frozen app (`fe516c1:src/app.jsx`, blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628` — **verified reachable and byte-correct on this tree**), the original 45-law seeds, `rebuild/conform/oracle`, the original witness/differential/source test files and the seeded soak are never edited. The three witness successors are **pinned carriers**, not edits (`BRIEF-SET-ONE-ERA.md:61`).

## 6. Acceptance bar for B2

**Artifact** `rebuild/m4/spec/acceptance-b2-targets-identity-era.json`, bound by sha256, raw bytes byte-equal to `JSON.stringify(parsed,null,2)+'\n'`, duplicate-key pre-parser and closed schema, verified from Git at its reviewed commit and byte-identical on disk (`BRIEF-IMPORT-GUARDS.md:97`). Runner `rebuild/m4/spec/b2-package.cjs`, shaped like the accepted `native-carriers-package.cjs` (the parent's own runner, now the closer precedent than `load-write-package.cjs`) — **`--full` or `--ci`, no third mode**, the immutable `rebuild/conform/v4/postfix/run.cjs` wrapped, never forked.

**`authorizations`**: `owner` = `DECISIONS:60` line sha256 `ebb565c6…`; `contract` = `DECISIONS:49`; `theme` = **this brief's accepting ledger line, by sha256**; `review` = `{role: cowork, prefix: "POSTFIX-ACCEPTANCE M2-B2-TARGETS-IDENTITY-ERA", terminal: "ACCEPTED"}`. `PENDING` iff the review receipt is null.

**`product`** must supersede the parent's pins for the two files B2 edits and **add the one the parent does not carry**. The accepted parent's `product` map pins `plan.cjs 1b26c87f…`, `progression.cjs 7031838d…`, `sleep.cjs 3dd34e11…`, `today.cjs 397532ec…`, `writers.cjs 00291236…`, `index.cjs 40ccc489…` and the w7-preview pair — **`volume.cjs` is not in it**, so B2 introduces `rebuild/engine/volume.cjs` (pre-image `c32298e7…`) as a new pinned product file while carrying the four it does not touch byte-forward.

**Parent — the PM's call, with the chain now read rather than inferred.** `rebuild/m4/spec/acceptance-native-carriers.json` (sha256 **`295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`**, receipt `DECISIONS:96` at commit `84d8f28892973b6cf68f37d2fe5ce80d97b1d165`, superseding `DECISIONS:95`) carries, in its own `parent` object, `{"artifact":"rebuild/m4/spec/acceptance-load-writes.json","sha256":"5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82","packageId":"M2-LOAD-WRITES","receiptLine":"…POSTFIX-ACCEPTANCE M2-LOAD-WRITES f34332ef… ACCEPTED"}`. So `5073977b…` is **already claimed** and the chain is LOAD-WRITES → NATIVE-CARRIERS. Therefore, stated plainly and left to the PM:

> **If the PM rules B2 first in the B chain, B2's closed profile parent = `rebuild/m4/spec/acceptance-native-carriers.json`, sha256 `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`, receipt `rebuild/DECISIONS.md:96`. If the PM rules B1 first, B2's parent is B1's accepted artifact and B1's parent is `295762f0…`.** Lane B has no preference beyond "decide once and hold it" (`REQUESTS.md`, 2026-09-10 21:40). Two packages cannot both claim one parent (`PLAN…:146`), and nothing in B2 should be written until the link is named (§7 Q1).

**Carrier inheritance is now a chain of three, not two.** The accepted parent ships `rebuild/m4/spec/native-carriers-inherited-carriers.cjs`, which itself loads `rebuild/conform/v4/postfix/legacy-step-efficacy-carriers.cjs` (the D12 carrier) through the immutable `manifest-step-efficacy.json` envelope and pins every accepted carrier input. **B2 extends that file's successor, not `load-write-inherited-carriers.cjs`.** Note for the implementer: that accepted program sets `MEASURED_TEST_NOW='2026-09-03'` for the carrier runs while `second-gate.mjs:64` hard-pins `'2026-07-29'` — the two anchors are the reason the `:70` cell in §1.6 is anchor-conditional, and B2's own runner must state which anchor each piece of evidence was produced at.

**What the FULL run must show** (`PLAN…:124–132`, `BRIEF-IMPORT-GUARDS.md:87–90`):
1. all 45 register laws executed: **D9, D2, D1, D5, D6, D7, D3, D4, D29, D18, D28, D30, D31, D32 GREEN on the candidate and RED on the frozen engine**; the accepted D12/D33/D34/D35/D41/D43 carried GREEN; the remaining 25 still raw RED with approved preservation deltas only; D27's dated GREEN-BY-FIXTURE-DATE and D44's nondefault THROWS/UNDEFINED pins retained without repair credit; `newlySelectedIds` = the fourteen, `carriedAcceptedIds` = the six, `requiredIds` unchanged, all 15 non-D obligations still OPEN. **Never call the other 25 repaired or M2 closed.** *(v1.1: this is now executed, not projected — see §3 of the summary below and the numbers in the "v1.1 changes" note.)*
2. all 19 original gate identities OBSERVED/PASS (`run.cjs:9–23`), with **three witness carriers** per §4 (`witnesses-1` new, `witnesses-4` new, `witnesses-2` extended), `witnesses-3` and `witnesses-6` explicitly unchanged, and every other inherited carrier unchanged.
3. **second gate** — `second-gate.mjs --candidate` under the accepted D12 custody, `SECOND GATE candidate: PASS`, all 3,072 assertions, with engine/sync/surface accounting and the protected P6 verdict of §5. This is the one piece of the bar this session could not complete (§4) and it is where the `:70` question is settled.
4. **own bites** — one disclosed source bite quoting its RED line, then exact byte/sha restoration and a restored-GREEN direct gate; plus one unlisted receipt/input-field bite proving the comparator fails closed.
5. **real source fault mutants** per D — the ≥2 named in each §1 subsection, mutated in **disposable candidate copies** loaded in fresh processes. A source-pin refusal, syntax error, missing target or timeout earns **no kill**. **Critical, re-executed and now quantified:** once the repair is in the source, the register laws' own `mutants` — which all restore `T.__auditOriginal[name]` through the export wrapper (`helpers.cjs:49–58`) — become **inert** and report GREEN on the repaired candidate. The full run measures it exactly: detected mutant executions fall **97/104 → 83/104**, i.e. precisely the fourteen laws' candidate-side mutants. The laws' listed mutants therefore **cannot** serve as this package's fault mutants; only the named source mutants can. Likewise D29's law `control` is non-idempotent over a repaired reader (GREEN repair controls `89 → 88`, D29's the one lost) — record both as conditions in the sense of `DECISIONS:82` (1).
6. **fidelity / structural diff** — no source change outside the enumerated hunks (in `progression.cjs`: `targetsFor`, `loadRungs`, `parseRungs`, `deloadLoad`, `progressAnchor` (**both** loops), `liftTrend`, `_volDeltas`, `_deriveSightingFull`; in `plan.cjs`: `dayType`, `_bornValid`; in `volume.cjs`: `muscleVolume`, `programmeVolume`, `structuralMovesThisWeek`, `setOneRead`, `volumeConversion` plus D30's two delegate lines); `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/lanes/*`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md`.
7. **census on the private blob** — `migrate-full` hard-requires `rebuild/conform/private/live.json` and the private `live.main` golden, failing `REQUIRED-PRIVATE-PREPARATION-MISSING` without them (`run.cjs:115–117`). **Verdict-only reporting.**
8. **receipt then authorized rerun** — PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word; the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and reruns the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0.

**Cloud (`--ci`) vs owner's PC (`--full`).** Cloud, both OS: focused tests, review controls, browser package, profile refusals, source carriers, traces, direct, inherited carriers, witnesses, legacy differential, second gate. Owner's PC only: anything reaching the private blob — the `migrate-full` three-blob oracle in both Date modes, the private LIVE re-evaluation for **D30**, therefore the whole `--full` run and every `POSTFIX PACKAGE PASS`; per `DECISIONS:92` the PM operates the PC directly and per `DECISIONS:93` C4 "FULL incl. the private oracle is the PM's own execution before any receipt". Reported verdict-only. **Environment notes for the PM, both re-executed at `87eddad`:** on a public clone without the private directory, `rebuild/conform/run.cjs` reports `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families` — **the identical line v1 recorded at ffabbca, and identical on base and repaired**, so it is not a B2 regression; and `rebuild/m4/spec/native-carriers-package.cjs --ci` prints `NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld` on the unmodified merged tree in this session (the closed profile pins evidence a public research clone cannot construct) — an environment limit of this session, not a finding about the accepted parent.

## 7. Open questions for the PM — none for the owner

**Q1 (blocking the artifact, not the brief). Parent chain.** Now read rather than inferred: `acceptance-native-carriers.json 295762f0…` already claims `acceptance-load-writes.json 5073977b…` as its own parent (§6). Name the exact parent artifact path + sha256 for the **first** B package before its artifact is written, and hold it.

**Q2 (scope, one line). `volume.cjs:159`.** D18 lifts the 80-row cap over a reader that resolves the receipt's owner by the same unbounded substring rule D3 repairs. Extend §2's convention to that line inside B2 (recommended — one line, same convention, and D18 measurably widens the exposure), or record it as a new non-D register item and leave the widened exposure shipped? B2 will not widen its own scope without this answer. (`volume.cjs:302` is the same shape behind an untouched 120-row cap — register candidate either way.)

**Q3 (scope, two lines). Reader-side `exId` in B2.** §2 C2's *reader* half is two lines across D3 and D4 and is fully backward-compatible (re-executed on the merged tree: laws GREEN, seeded census unchanged). Including it lets B3 add the writer field at `writers.cjs:2319` without re-opening `progression.cjs`, which B2 owns. Confirm it is in B2's allowlist.

**Q4 (sequencing). `witnesses-1` carrier serialization** — §4, now with exact counts (B2's eight flips, B1's D8/D10 preserved, in one file). Serialize B1/B2 on that one carrier, or accept one rebase pass?

**Q5 (gate hygiene). `witnesses-2` is already RED at `87eddad`** on the D12 witness (`:51`, re-executed: 10/11). Confirm the inherited `legacy-step-efficacy-carriers.cjs` carrier — reached through the accepted parent's `native-carriers-inherited-carriers.cjs` — is the accepted way that gate passes today and that B2 extends that successor rather than authoring a second one.

**Q6 (conditions). Three new conditions** to record alongside D30's two, all re-executed and now quantified: (a) the register laws' export-wrapper mutants are inert on a repaired source and cannot be counted as fault mutants — detected mutant executions fall `97/104 → 83/104`, exactly the fourteen; (b) D29's law `control` double-counts over a repaired `muscleVolume` and is a frozen-side demonstration only — GREEN repair controls fall `89 → 88`, D29's the one lost; (c) D32's law `control` derives `asOf` from the log while the product reads the query day — result oracle only, never the clock-trace oracle.

**Q7 (flag, not a request). H1.** `DECISIONS:93` C3 assigns `today.cjs`'s `e.id === "hack"` per-athlete special case to Track B as register item H1. It is **not** in B2 (no `today.cjs` in B2's allowlist, no D-id, no v4 law) and B2 claims nothing about it (`PLAN…:150`).

**Q8 (NEW, blocking D7's hunk shape). The `tools/engine-test.jsx:70` cell.** v1's unconditional `liftTrend` future cut flips that protected-second-gate assertion (`progressionTrend(SNAP).nLifts` 3 → 0) because the gate hard-pins the suite's `2026-07-29` anchor against a snapshot that runs to `2026-08-04`; v1.1's `opts.asOf`-gated cut keeps all fourteen laws GREEN, the census delta at one cell, all fourteen witness flips, and leaves `:70` untouched (all executed). **Choose:** (a) **recommended** — adopt v1.1's narrowed hunk, and record "a `liftTrend` call with no `asOf` still reads its whole era" as a deliberate, named non-obligation, with v1's cut retained as a source mutant killed by `:70`; or (b) keep the unconditional cut and authorize a **new protected second-gate custody** re-pinning `tools/engine-test.jsx:70` the way D12's custody re-pins `:106:5` — which enlarges B2 into the protected surface the owner's rule keeps verdict-only, and which B2 will not do without this ruling.

**Q9 (NEW, evidence completeness). The unobserved second gate.** On this tree the candidate second gate aborts at the pre-existing D12 cell `tools/engine-test.jsx:106`, so only 261 of 3,072 engine-test assertions were observed (§4). Confirm that B2's acceptance requires the full candidate second gate under the accepted D12 custody, and that any movement in the remaining ~2,811 assertions is a §5(a) RED stop for a reviewed successor cell rather than a regenerated golden.

**Nothing for the owner.** All fourteen dispositions are recorded at `DECISIONS.md:60`, and the only Batch-B rule in this package — D32 — is already fully specified there ("'benefit replicated' counts only sessions from the CURRENT technique; all other replication thresholds stay as they are"), which §1.14 implements literally and no more. D30's product-rule question was likewise closed at `DECISIONS:82`. Unlike B3's D40, B2 carries no unfinished owner rule. Neither Q2 nor the new Q8 is an owner question: Q2 is the same identity-correctness direction the owner already approved for D3/D4 applied to one more reader, and Q8 is a choice between two implementations of one already-approved direction plus a protected-surface authorization — both scope decisions for the PM, not product rules for the owner.
