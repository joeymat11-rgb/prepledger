# EARNED — LANE B · PACKAGE B2 — TARGETS, IDENTITY & TECHNIQUE ERA — BEHAVIOUR/DELTA BRIEF (PROPOSED, NOT ACCEPTED)

2026-09-11 · Opus builder of LANE B ("EARNED — LANE B — engine fixes"), research only. Nothing in the repo was modified, committed or pushed; every edit reported here was made in a throw-away copy under the session scratchpad and discarded. No `ledger/` and no `rebuild/conform/private` path was opened; that directory does not exist on this tree and must not.

## 0. Header — base, dependency, authority

**Package id** `B2` · theme `TARGETS, IDENTITY & TECHNIQUE ERA` · fourteen D-ids in package order **D9 → D2 → D1 → D5 → D6 → D7 → D3 → D4 → D29 → D18 → D28 → D30 → D31 → D32** (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:84`).

**Base tree** `origin/rebuild/t2-client-core` @ **ffabbca** (`ffabbcac0d9802fcb8b74334f9dfa49366295f74`, read in a dedicated worktree). Product modules: `rebuild/engine/plan.cjs`, `rebuild/engine/progression.cjs`, `rebuild/engine/volume.cjs` — **no fourth file**.

Pre-image sha256 at ffabbca (all three verified equal to the accepted M2-LOAD-WRITES artifact's `product` pins, i.e. the engine has not moved since `DECISIONS:87`):

| file | sha256 at ffabbca | status |
|---|---|---|
| `rebuild/engine/plan.cjs` | `2b834933ce0b93164064a7be36462f68683eb48a31d57c17a41cd81ed32c45b7` | **rewritten by NATIVE-CARRIERS → `1b26c87f…`** |
| `rebuild/engine/progression.cjs` | `adeb1b103260278452bd840185d7dfecd2642c4744955bf06bb0b495e02f9d4e` | **rewritten by NATIVE-CARRIERS → `7031838d…`** |
| `rebuild/engine/volume.cjs` | `c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4` | not in the carriers set — survives |

**NATIVE-CARRIERS dependency (blocking).** `rebuild/DECISIONS.md:93` accepts the M2-NATIVE-CARRIERS behaviour/delta contract and states verbatim that it adopts "plan.cjs 2b834933…→1b26c87f…, progression.cjs adeb1b10…→7031838d…" byte-for-byte, plus `sleep.cjs`, `today.cjs`, `writers.cjs`, `index.cjs` and the new `performed.cjs` / `entered-load.cjs`. **Two of B2's three product files are pre-image-identical to that package's own pre-images.** Therefore: NATIVE-CARRIERS merges first (`PLAN…:113`, `:145`); **B2's implementation rebases onto it after it merges, and every `plan.cjs` / `progression.cjs` pre-image sha256 and every line coordinate in §1 below is re-pinned at that point** before the artifact is written. `volume.cjs` coordinates are not affected. B2's brief may be accepted before the rebase; B2's *artifact* cannot.

**Authority lines (read, not inferred).**
- `rebuild/DECISIONS.md:60` (owner, M2-RULE; line sha256 of the line text without trailing newline = `ebb565c65ba1a33dbc5b007d8854e6c203f1f8ae218bef7521c2dc07ffd596c8`, byte-equal to the value the accepted `acceptance-load-writes.json` carries as `authorizations.owner.lineSha256`). It disposes all fourteen of B2's D-ids: D1, D2, D3, D4, D5, D6, D7, D9, D18, D28, D29, D30, D31 as plain Batch-A `APPROVED-FIX`; **D32 as a Batch-B `APPROVED-FIX` with its exact rule** (quoted verbatim in §1.14). The same line states what it does *not* do: "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance; the frozen app and its goldens stay untouched".
- `rebuild/DECISIONS.md:88` (speed plan) — "batch the 39 remaining approved defect fixes", "two-tier rigor (engine full gate; screens/plumbing one reviewer + CI)". Line sha256 `2fdbd9d2745e0caf83313db2ce8659f49ff9004bb667add0c39f3826a3f8543b`.
- `rebuild/DECISIONS.md:94` (LANES ruling) — "the reviewer chat becomes LANE B lead (engine-fix packages per rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md: B2 ∥ B1 → B4 → B3; FULL engine gate unchanged; **the PM's own FULL run is the acceptance**)". Line sha256 `8bd97d771528bac19ae44600feb3d4c9ccd312f0a5f3eeefd0ec0b2e53de55b0`.
- `rebuild/DECISIONS.md:82` (SET-ONE-ERA brief ACCEPTED, D30) — line sha256 `2862e7ab8aae34ec2817a9339020ed696959bbaf6cefb32a63d8f1d629d58bf2`. Carries the **two conditions** restated verbatim in §1.12 and the protected-surface rule used in §5.
- Parent chain pins: `rebuild/DECISIONS.md:85` (LOAD-WRITES theme, `9117a07f17d945ec3e0c1c971681886214eede3b025e0fe74ee4755e8c960f70`), `:86` (receipt, `b3bedd8c51348c627492669a43fd32141421ee2a328994fbe99e3c657732a507`), `:87` (integrated; "Register: 6/45 repaired (D12, D33, D34, D35, D41, D43); 39 + 15 non-D open").
- Frozen baseline inherited unchanged: audit commit `614e20315b01543d3b7bbc4fa1fe8a5c20bcb690`, extraction `ef83543aa825fb581671951d287854166717ad28`, frozen `fe516c1`, frozen blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628` (`rebuild/conform/v4/postfix/acceptance-step-efficacy.json`, `baseline`).

**RED-first evidence executed for this brief.** All fourteen laws were run against the engine at ffabbca through the v4 runner's own `inventory`/`execute` entry points (`rebuild/conform/v4/run-defect-laws.cjs:71`) on the `candidate` bundle (`helpers.cjs:39–48`): **14/14 raw RED, 14/14 `control` GREEN, 14/14 listed mutants RED.** The runner's *frozen* side (`helpers.cjs:15`) needs `git show fe516c1:src/app.jsx`; this is a shallow clone and `fe516c1` is not fetchable by sha, so **frozen-side RED must be reproduced by the implementer in a full clone** — it is not asserted here. `rebuild/m4/spec/load-write-package.cjs --ci` exits non-zero on this tree with `LOAD PACKAGE FAIL` (the LOAD-WRITES profile pins its own frozen reference build, which the shallow clone cannot construct); that is an environment limit of this research session, not a finding about the package.

## 1. Per defect, in package order

Every "current code" hunk below was read at ffabbca. `progression.cjs` / `plan.cjs` / `volume.cjs` sha256 as in §0. Register citations are `rebuild/m2/AUDIT-REGISTER.md` line numbers.

### 1.1 D9 — the workout day depends on schedule record order (register 97–105)

- **PLAIN** (:99) "The app can show a different workout day when the same schedule records arrive in a different order, when the most recently effective schedule should determine the day."

**Current code** `rebuild/engine/plan.cjs:11–17`, defect at `:15`:
```js
function dayType(iso, s) {
  const d = mk(iso).getDay();
  const list = (s && s.split) || [];
  let ent = null;
  for (const x of list) if (x && x.from && x.from <= iso) ent = x;
```
Last qualifying **array row** wins, not the greatest effective date.

- **Owner semantics** — plain Batch-A FIX (`DECISIONS:60`); no Batch-B rule.
- **Behaviour change.** `dayType` selects the qualifying record with the greatest `from`, keeping every other byte: the `from <= iso` eligibility bound, the `ent.map` branch, the Wednesday refeed branch and the legacy dow fallback. Ties on an identical `from` keep the existing array-order winner (`>=`), because the register states the witness uses distinct dates and "needs no tie-breaking product rule" (:105) — inventing one here would be an unapproved rule.

**Exact hunk** (`plan.cjs:15`):
```
- for (const x of list) if (x && x.from && x.from <= iso) ent = x;
+ for (const x of list) if (x && x.from && x.from <= iso && (!ent || String(x.from) >= String(ent.from))) ent = x;
```

- **Law** `E-D9-split-selects-latest-effective-date` — "Reordering the same distinct effective-date schedule records leaves today's day type unchanged and selects the newest applicable record." RED today because `:15` overwrites `ent` unconditionally, so `[future, current, old]` ends on `old`.
- **Delta cells.** Changes: `dayType` for an unsorted `s.split`. Must NOT change: any sorted split (the SEED's own single row `from: 2026-08-01` and the dated-split census `tools/engine-test.jsx:7819–7822` are order-free); the pre-config legacy readings; `dayType("2026-07-29")` = `REFEED`; the six stateless callers counted at `engine-test.jsx:7868`. Executed at both matrix days on the seeded state: `dayType` for `2026-08-03 / 08-09 / 08-31 / 09-03 / 09-07 / 07-29` byte-identical.
- **Source mutants.** (1) `split-selection-returns-to-last-array-row` — delete the new conjunct. (2) `split-tie-prefers-first-array-row` — `>=` → `>`; must be killed by the duplicate-`from` preservation control. (3) `split-selection-drops-the-effective-date-bound` — delete `x.from <= iso`; killed by the law's own `future` row.
- **Negative controls.** Duplicate identical `from` rows keep the existing winner; a row with a falsy/absent `from` is still skipped; an `ent.map` value other than `U`/`L` still reads `REST`; a state with no `split` is byte-identical.

### 1.2 D2 — impossible set count passes validity, then crashes (register 23–31)

- **PLAIN** (:25) "The app accepts an impossible number of sets as valid and can crash while preparing the exercise, when it should keep that record marked invalid."

**Current code** `rebuild/engine/plan.cjs:84`:
```js
function _bornValid(e) { return !!(e && typeof e.sets === "number" && typeof e.hi === "number" && typeof e.setup === "string" && (e.day === "U" || e.day === "L") && typeof e.mg === "string"); }
```
and the healer it feeds, `plan.cjs:123`: `for (const eH of (s.exercises || [])) { if (eH && eH.quarantined && _bornValid(eH)) delete eH.quarantined; }`. `typeof -1 === "number"`, so a `sets: -1` record is "born valid", its quarantine is deleted at `:123`, and `progression.cjs:164`'s `Array(ex.sets)` then throws `RangeError: Invalid array length`.

- **Owner semantics** — plain Batch-A FIX.
- **Behaviour change.** `_bornValid` requires a finite positive **integral** set count and a finite positive rep ceiling, exactly as the register's FIX line states (:30). Because `canonicalizePlan`'s healer calls the module-internal declaration, one hunk fixes both the `:114` flagging path and the `:123` clearing path — **no second hunk in `canonicalizePlan`**. (The accepted law's `control` patches both exported names only because a patched export cannot reach a closed-over internal call; it is a satisfiability demonstration, not the shape of the fix. State this in the artifact so the reviewer does not require two hunks.)

**Exact hunk** (`plan.cjs:84`):
```
- function _bornValid(e) { return !!(e && typeof e.sets === "number" && typeof e.hi === "number" && …
+ function _bornValid(e) { return !!(e && Number.isInteger(e.sets) && e.sets > 0 && Number.isFinite(e.hi) && e.hi > 0 && …
```
(the `setup` / `day` / `mg` conjuncts unchanged and in place).

- **Law** `E-D2-invalid-set-count-stays-quarantined` — "A negative set count is invalid, retains its quarantine across canonicalization, and never reaches target allocation as an active exercise." RED today: `accepted:true`, `quarantined:false`, `negativeArrayCrash:true`.
- **Delta cells.** Changes: `_bornValid` for non-integral, non-positive, NaN or Infinite `sets`/`hi`; the healer's retirements→quarantine conversion for those records; nothing else. Must NOT change: every real lift (all SEED lifts are integral-positive — executed, `canonicalizePlan` output and `exActive` identical at both matrix days); `targetsFor`'s `RangeError` on a *still-unquarantined* impossible record, which stays exactly where it is (D2's repair is quarantine retention, not a `targetsFor` guard — the register scopes the FIX to `plan.cjs` only, :30). Record that RangeError as an unrepaired latent, not a B2 obligation.
- **Source mutants.** (1) `numeric-type-admits-negative-count` — restore `typeof e.sets === "number"`. (2) `integral-check-omits-positivity` — `Number.isInteger(e.sets)` without `> 0`. (3) `hi-ceiling-unchecked` — restore `typeof e.hi === "number"`, killed by a `hi: NaN` control.
- **Negative controls.** `sets: 3, hi: 10` stays born-valid and an existing poison quarantine is still cleared at `:123` (the F1 self-heal must survive); `sets: 3.5` and `sets: 0` are invalid; a record with no matching retirement is untouched.

### 1.3 D1 — first-session targets do not fit the current set count (register 13–21)

- **PLAIN** (:15) "The app can show fewer or more first-session sets than the exercise currently calls for, when the first-session targets should fit the current set count."

**Current code** `rebuild/engine/progression.cjs:161,164` inside `targetsFor`:
```js
  const fitN = (arr) => { const t9 = arr.slice(0, ex.sets); while (t9.length < ex.sets) t9.push(Math.max(1, _padFrom9(t9, ex.hi) - 1)); return t9; };
  if (ex.std) return fitN(ex.std);
  if (ex.reclaim) return fitN(ex.reclaim);
  if (!ex.last) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
```
`ex.first` is the one authored array that bypasses `fitN`.

- **Owner semantics** — plain Batch-A FIX. The rider comment at `:155–160` already states the rule ("A set-count change must not silently shrink or crash the session: pad to ex.sets one rep under the last authored slot … truncate when sets fall").
- **Behaviour change.** Route `ex.first` through the existing `fitN` helper — the same helper `std` and `reclaim` already use — and leave the no-`first` default fill exactly as it is. No new fit rule, no new padding arithmetic.

**Exact hunk** (`progression.cjs:164`):
```
- if (!ex.last) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
+ if (!ex.last) return ex.first ? fitN(ex.first) : Array(ex.sets).fill(Math.max(1, ex.hi - 2));
```
`fitN` already returns a fresh array via `arr.slice(0, ex.sets)`, so the removed `.slice()` on the fresh `Array(...).fill(...)` is a value-identical no-op; pin that as a named observation, not a delta.

- **Law** `P-D1-first-targets-fit-current-set-count` — "First-session authored targets preserve their existing slots and use the existing authored-array fit rule when the set count grows or shrinks." RED today: `first:[8,7]` with `sets:3` returns `[8,7]` (law wants `[8,7,6]`) and with `sets:1` returns `[8,7]` (law wants `[8]`).
- **Delta cells.** Changes: `targetsFor` only for a lift with `ex.first`, no `ex.last`, no `std`, no `reclaim`, and `ex.first.length !== ex.sets`. Must NOT change: the `std`/`reclaim`/anchor branches; the MAXED ladder assertions (`engine-test.jsx:7087–7099`); `targetsFor({last:[14,13,13],hi:15,sets:3})` = `[14,14,13]` (`engine-test.jsx:156`). **Executed:** the only seeded lift with `first` and no `last` is `abs` (`sets:3`, `first:[12,12,12]`), already fitting — `targetsFor` over all seeded lifts is byte-identical at both matrix days.
- **Source mutants.** (1) `first-array-bypasses-existing-authored-fit` — restore the old return. (2) `first-array-pads-but-never-truncates` — `arr.length < ex.sets ? fitN(arr) : arr.slice()`. (3) `first-array-padded-with-hi-minus-two` — pad from `ex.hi - 2` instead of `_padFrom9`, changing the padded value.
- **Negative controls.** `first.length === ex.sets` returns the same array contents (and still a copy — mutating the result must not touch `ex.first`); no `first` and no `last` still yields `Array(ex.sets).fill(max(1, hi-2))`; `ex.last` present still goes through `progressAnchor`.

### 1.4 D5 — duplicate rungs make equipment look maxed out (register 33–41)

- **PLAIN** (:35) "The app can call an exercise's equipment maxed out merely because the same available weight was entered twice, when duplicates should not create a valid equipment ladder."

**Current code** `rebuild/engine/progression.cjs:239–243` and `:299–302`:
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
Both check the **raw** count before de-duplicating, so `[100,100]` becomes a one-rung ladder and `maxedOut` (`:83–85`, via `nextLoad` `:261–262`) reads the stack as topped out.

- **Owner semantics** — plain Batch-A FIX.
- **Behaviour change.** De-duplicate and sort first, then apply the existing two-rung minimum, in both entry points. `maxedOut`, `nextLoad`, `prevLoad`, `snapLoad`, `deloadLoad` and `repsLostOnJump` all call `loadRungs` internally and are corrected without an edit.

**Exact hunks** (`progression.cjs:240–242` and `:300–301`):
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

- **Law** `P-D5-ladder-minimum-counts-distinct-rungs` — "Duplicate copies of one weight do not satisfy the existing two-rung minimum and do not block the ordinary next increment." RED today: `parseRungs('100,100')` returns `[100]`, `loadRungs({steps:[100,100]})` returns `[100]`, `maxedOut` true, `nextLoad` null (law wants `null, null, false, 105`).
- **Delta cells.** Changes: duplicate-only ladders — `loadRungs`/`parseRungs` null, `maxedOut` false, `nextLoad`/`prevLoad` fall to the `ex.inc` arithmetic, `deloadLoad` to the percentage branch, `snapLoad` returns `w`. Must NOT change: `parseRungs('100,105,100')` = `[100,105]` (already deduped); the LADDER assertions at `engine-test.jsx:5231–5237`, `:7974`, `:7995`, `:8017`; `repsLostOnJump`. **Executed:** no seeded lift has a duplicate-only `steps`; `loadRungs`/`maxedOut`/`nextLoad` identical over all seeded lifts at both matrix days.
- **Source mutants.** (1) `raw-rung-count-checked-before-deduplication` — restore both originals. (2) `dedupe-in-loadrungs-only` — fix `loadRungs`, leave `parseRungs`. (3) `dedupe-drops-the-sort` — `[...new Set(r)]` unsorted, killed by an out-of-order `steps` control.
- **Negative controls.** A genuine two-rung ladder `[100,105]` is unchanged in value and order; a single-element `steps` still returns null; non-finite and non-positive entries are still filtered before the count; `parseRungs('')` still null.

### 1.5 D6 — a deload is invented where no working weight exists (register 43–51)

- **PLAIN** (:45) "The app can propose a reduced weight even though no working weight has been recorded, when it should keep the missing weight unknown."

**Current code** `rebuild/engine/progression.cjs:287–291`:
```js
function deloadLoad(ex, pct = 0.95) {
  const w = Number(ex.w);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (!rungs) return Math.max(5, Math.round((w * pct) / 5) * 5);
```
`Number(null)` and `Number("")` are both `0`, `isFinite(0)` is true, so `Math.max(5, 0)` prints **5**. The sibling helpers already refuse this: `nextLoad:257–258` and `prevLoad:269–270` both carry `if (raw9 == null || raw9 === "") return null;` under the C6 comment (`:253–256`) that names exactly this case — "the live hip thrust, never performed, advertised '5'".

- **Owner semantics** — plain Batch-A FIX.
- **Behaviour change.** Apply the identical pre-coercion absence guard `nextLoad`/`prevLoad` already apply, ahead of the `Number()` call. Nothing after it moves.

**Exact hunk** (`progression.cjs:287–288`):
```
  function deloadLoad(ex, pct = 0.95) {
+   if (ex.w == null || ex.w === "") return null;   /* C6 — absence is not zero; the same guard nextLoad/prevLoad already apply */
    const w = Number(ex.w);
```

- **Law** `P-D6-deload-preserves-absent-load` — "Null, omitted and empty-string loads have no deload value, while a recorded numeric load still yields its ordinary deload." RED today: `[5,5,5]` for `null`/`undefined`/`""` (law wants `[null,null,null]`, `known === 95`).
- **Delta cells.** **This is the one executed public-census delta in the whole package.** Changes: `deloadLoad` for the two seeded lifts with no working weight — `fly` and `hipthrust`: `5 → null`, at both matrix days. Must NOT change: `deloadLoad({w:100,inc:5})` = `95`; the rung branch; `engine-test.jsx:3093`. The delta is unreachable through the engine's only internal consumer — `sleep.cjs:133` guards with `typeof ex2.w === "number"` before calling — so no receipt string and no card carries the invented 5 inside the engine; the change surfaces only in a direct-call census. Full-engine reads over the seeded state (programmeVolume, muscleVolume, volumeImbalance, structuralMovesThisWeek, targetsFor, deriveSighting, _volDeltas, setOneRead, volumeConversion, liftTrend, progressAnchor, dayType, nowModel) were byte-identical at both matrix days except this one cell.
- **Source mutants.** (1) `numeric-coercion-turns-absence-into-deload-five` — delete the guard. (2) `guard-omits-empty-string` — `ex.w == null` only. (3) `guard-also-rejects-zero` — `!ex.w` instead, killed by a `w: 0` control (the existing engine returns `5` for a true numeric `0`; that is not this defect and must not change).
- **Negative controls.** `w: 0` (a real recorded zero) keeps its existing result; `w: "100"` (numeric string) still deloads; a lift with a ladder and an absent `w` returns null before `loadRungs` is consulted; `pct` override path unchanged.

### 1.6 D7 — sessions after the viewed day describe earlier progress (register 77–85)

- **PLAIN** (:79) "The app can use sessions dated after the day being viewed to describe earlier progress, when an earlier view should use only evidence available by that day."

**Current code** `rebuild/engine/progression.cjs:67–70` (`progressAnchor`) and `:561–565` (`liftTrend`):
```js
  const fkA = forksOf(s, ex.id);
  const atA = isoOf(todayStart());
  for (let i = days9.length - 1; i >= 0; i--) {
    if (!sameEra(fkA, days9[i], atA)) continue;   /* FIX 3c — an anchor from another technique era anchors nothing */
```
```js
  const fkT = forksOf(s, exId);
  const atT = (opts && opts.asOf) || isoOf(todayStart());   /* v7.53.0 (b) — era-aware: the trend reads the regime containing the query date */
  const pts = [];
  for (const d of days) {
    if (!sameEra(fkT, d, atT)) continue;
```
Both readers compute an as-of day and then use it **only** for the era membership test — never to bound the session dates. The register's mutant name says it exactly: `as-of-restricts-era-but-not-session-dates`.

- **Owner semantics** — plain Batch-A FIX.
- **Behaviour change.** Exclude session dates strictly after the reader's own current or supplied as-of day, before any evidence is derived, in both declarations. The era filter, the rushed/hard/debt exclusions, the same-load and `wKey` matching, the set-count cut at `:611–614` and every return shape stay byte-identical.

**Exact hunks** (`progression.cjs:70` and `:565`):
```
  for (let i = days9.length - 1; i >= 0; i--) {
+   if (days9[i] > atA) continue;
    if (!sameEra(fkA, days9[i], atA)) continue;
```
```
  for (const d of days) {
+   if (d > atT) continue;
    if (!sameEra(fkT, d, atT)) continue;
```

- **Law** `P-D7-anchor-and-trend-exclude-future-sessions` — "The current anchor and an explicitly earlier trend omit later sessions while a later as-of view can still use those same records." RED today: the anchor takes `[11,10]` from `2026-09-13` at a `2026-09-03` clock and `liftTrend({asOf:'2026-09-03'})` returns a four-point trend.
- **Delta cells.** Changes: `progressAnchor` and `liftTrend` for any state holding sessions later than the query day — and, transitively, every `liftTrend` consumer (`progressionTrend`, `liftCall`, `volumeConversion`, `regime`). Must NOT change: `liftTrend({asOf:'2026-09-14'})`, i.e. a later view still uses the same records; the `resetAt` / `k` / `pts` contract at `:640`; `engine-test.jsx:6290` (`tHam.n === 4`, `resetAt === isoV(7)`), `:6304`, `:6320`, `:6505`, `:7759–7790`, `:75`. **Executed:** all seeded sessions are on or before both matrix days, so `liftTrend` and `progressAnchor` over every seeded lift are byte-identical at both.
- **Source mutants.** (1) `as-of-restricts-era-but-not-session-dates` — delete both guards. (2) `future-cut-applied-to-the-trend-only` — guard `liftTrend`, leave `progressAnchor`. (3) `future-cut-uses-the-wall-clock-not-the-supplied-asof` — compare against `isoOf(todayStart())` in `liftTrend` instead of `atT`, killed by the law's `asOf: '2026-09-14'` case. (4) `future-cut-is-inclusive-of-the-next-day` — `d > atT` → `d >= atT`, killed by a session logged *on* the query day.
- **Negative controls.** A session dated exactly on the as-of day is still evidence; `opts.asOf` absent still means today; a state with no future session produces a byte-identical trace including the same `dayWeather` / `paceRushed` / `cleanAtDate` call sequence; an excluded future date must never be read (no `dayWeather` call for it).

### 1.7 D3 — a similarly-named lift's set change is credited to this lift (register 55–63)

- **PLAIN** (:57) "The app can count a set change for another similarly named exercise as a change to this exercise, when each exercise should keep its own set history."

**Current code** `rebuild/engine/progression.cjs:118–134`, defect at `:124`:
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
Unbounded **substring** match: `"VOLUME +1 — CHEST via Press incline"` contains `"via Press"`, so the incline's receipt is charged to `Press`.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:62): "prefer stable lift identity and use a whole-name legacy boundary for old receipts … Preserve visible receipt prose if adding structured identity".
- **Behaviour change.** Owner resolution becomes two-tier, per the identity convention in §2: if the feed row carries a structured `exId`, that decides, full stop; otherwise the owner is the **whole name** parsed out of the receipt at its recorded boundary — the text between `"via "` and the first `" (now "` (or end of string) — compared for exact equality against `_formerNames(ex)`. **No byte of `writers.cjs` changes in B2**: both VOLUME producers (`writers.cjs:2135` and `:2292`) already emit exactly `VOLUME ±N — <MG> via <ex.n> (now <n> sets)`, so the boundary is already in the data; the `exId` tier is a forward-compatible reader so that B3's D44 hunk at `writers.cjs:2292` can add the field without re-opening `progression.cjs`.

**Exact hunk** (`progression.cjs:123–124`):
```
    let named9 = false;
-   for (const n9 of names9) if (n9 && f9.t.indexOf("via " + n9) > -1) named9 = true;
+   if (f9.exId != null) named9 = String(f9.exId) === String(ex && ex.id);
+   else { const at9 = f9.t.indexOf("via "); const own9 = at9 < 0 ? null : f9.t.slice(at9 + 4).split(" (now ")[0];
+     for (const n9 of names9) if (n9 && own9 === n9) named9 = true; }
```

- **Law** `P-D3-volume-receipt-belongs-to-whole-lift-name` — "A volume receipt for a longer distinct lift name contributes no set change to the shorter lift while its own receipt still contributes." RED today: both rows are credited (`[["2026-09-01",1],["2026-09-02",1]]`).
- **Delta cells.** Changes: `_volDeltas`, and therefore `_setsAtTime` and the incompleteness cut in `_deriveSightingFull:527`, for any state where one lift's name is a prefix-word of another's. Must NOT change: a lift's own receipt still contributes (`[["2026-09-01",1]]`); `VOLUME PASSED` rows carry no `via` and are still skipped; renamed and forked former names still match through `_formerNames:109–114`; the sign/magnitude parsing at `:126–131`. **Executed:** `_volDeltas` and `deriveSighting` over every seeded lift are byte-identical at both matrix days (no seeded VOLUME receipt, and no seeded prefix-collision).
- **Source mutants.** (1) `volume-owner-is-name-substring` — restore `indexOf(...) > -1`. (2) `volume-owner-is-name-prefix-of-the-via-tail` — `own9.indexOf(n9) === 0`. (3) `volume-owner-boundary-ignores-the-now-suffix` — omit the `" (now "` split, so a real receipt never matches (killed by the own-receipt positive). (4) `volume-owner-trusts-exid-only` — drop the legacy branch, killed by a legacy row without `exId`.
- **Negative controls.** A row whose `t` has no `"via "` (including `VOLUME PASSED`) is skipped, not thrown on; a row with `exId` matching but a *different* name follows `exId`; a row with `exId` mismatching but the name matching is **refused** (pin this explicitly); a shorter name that is a whole distinct name (`"Press"` vs `"Press"`) still matches; a `forks[].prevN` and a `renames[].prevN` still match exactly.

### 1.8 D4 — another lift's earn erases this lift's progress credit (register 65–73)

- **PLAIN** (:67) "The app can erase this exercise's progress credit when a different exercise with a longer similar name earns a weight increase, when that credit should belong to this exercise alone."

**Current code** `rebuild/engine/progression.cjs:492–538`, defect at `:504`:
```js
    for (const f9 of ((s && s.feed) || [])) {
      if (!f9 || typeof f9.t !== "string" || !/ EARNED$/.test(f9.t)) continue;
      let hit9 = false;
      for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;
      if (hit9 && f9.d && (!lastEarn9 || String(f9.d) > String(lastEarn9))) lastEarn9 = String(f9.d);
    }
```
Unbounded **prefix** match on the uppercased name. `"PRESS INCLINE 100 EARNED"` starts with `"PRESS"`, so the incline's earn spends `Press`'s sightings at `:520` (`topAt9 = null; topRun9 = 0; tops9.length = 0`).

- **Owner semantics** — plain Batch-A FIX. Register FIX (:72): "bind earn receipts to lift identity, with a complete legacy name-and-load boundary for old prose. … Existing receipt text can stay".
- **Behaviour change.** Same two-tier convention as D3. Structured `exId` wins where present; otherwise the legacy boundary is **complete**: the row must begin with a whole former name and the remainder must be exactly ` <load> EARNED`. The sole producer is `earn.cjs:89` — `push(\`${ex.n.toUpperCase()} ${upNext} EARNED\`, …)` — so the boundary is already in the data. `earn.cjs` is not edited (it is B3's file, `DECISIONS:85`).

**Exact hunk** (`progression.cjs:503–504`):
```
      let hit9 = false;
-     for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;
+     if (f9.exId != null) hit9 = String(f9.exId) === String(ex.id);
+     else for (const n9 of names9) if (f9.t.indexOf(n9) === 0 && /^ [-+]?(?:\d+(?:\.\d+)?|\.\d+) EARNED$/.test(f9.t.slice(n9.length))) hit9 = true;
```
(the regex is the accepted law's own control expression, adopted verbatim so the product and the oracle agree on the boundary).

- **Law** `P-D4-other-lift-earn-cannot-spend-sightings` — "An earn receipt for another exercise leaves this exercise's two qualifying performances intact, while this exercise's own earn still spends them." RED today: `afterOther.topRun === 0` (law wants `2` and `topAt === 100`), while `afterOwn.topRun === 0` is already correct.
- **Delta cells.** Changes: `_deriveSightingFull.start9` / `lastEarn9`, hence `deriveSighting`, `topAt`, `topRun` and `tops`, for prefix-colliding names. Must NOT change: the lift's own earn still spends (`afterOwn.topRun === 0`); the era-start rule at `:496–497,513,519`; the incompleteness cut at `:527`; the `catch` fallback at `:533`; `engine-test.jsx:8235`. **Executed:** `deriveSighting` over every seeded lift byte-identical at both matrix days.
- **Source mutants.** (1) `earn-owner-is-unbounded-name-prefix` — restore the bare `indexOf === 0`. (2) `earn-boundary-accepts-any-tail` — drop the load-and-` EARNED` regex. (3) `earn-boundary-rejects-decimal-loads` — `\d+` only, killed by a `102.5 EARNED` positive. (4) `earn-owner-trusts-exid-only` — drop the legacy branch.
- **Negative controls.** `"PRESS 100 EARNED"` still spends; `"PRESS 102.5 EARNED"` still spends; `"PRESS EARNED"` (no load) does not; `"BENCH PRESS 100 EARNED"` does not spend `PRESS`; a former name from `renames[].prevN` still spends (the FIX-4b §1 rule at `:495` must survive); a row with `exId` mismatching but the prose matching is refused.

### 1.9 D29 — press indirect front-delt credit is dropped when logged (register 369–377)

- **PLAIN** (:371) "The app counts pressing toward front-shoulder work in the plan but drops that credit when reporting the completed work."

**Current code** `rebuild/engine/volume.cjs:41` (`muscleVolume`) against `:81` (`programmeVolume`):
```js
const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; });
```
```js
const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => add(mg2 === "delts" ? "delts_front" : mg2, n * f2));
```
`INDIRECT.press = {triceps:0.5, delts:0.5}`; `muscleVolume`'s bucket list at `:43` is built from `volBucket = head || mg`, so the coarse `"delts"` key it writes is never returned — the logged credit is silently discarded.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:376): "Route indirect delts credit to the same delts_front bucket already used by programmeVolume … without changing the training credit fraction".
- **Behaviour change.** Apply `programmeVolume`'s existing head mapping in `muscleVolume`'s `count` closure. No fraction, no bucket list, no band, no zone rule changes.

**Exact hunk** (`volume.cjs:41`):
```
- const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; });
+ const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { const k6 = mg2 === "delts" ? "delts_front" : mg2; by[k6] = (by[k6] || 0) + n6 * f2; });
```

- **Law** `P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit` — "Completing the planned presses and front raises use the same front-delt indirect-credit mapping as planned volume." RED today: designed `delts_front` = 7, logged `n7` = 4 (the 3 indirect press sets vanish).
- **Delta cells.** Changes: `muscleVolume`'s `delts_front` `n7`/`p7`, its `zone`, and every `delts_front` consumer downstream (`volumeImbalance`, the volume push candidate/sev ordering in `writers.cjs`, the front-delt advice). Must NOT change: `triceps`, `biceps`, `forearms` indirect credit (unmapped keys pass through unchanged); any bucket with no indirect lender; `programmeVolume` (untouched); the `fmtN` one-decimal formatting at `:56`; `engine-test.jsx:2395`, `:2416`, `:2604`, `:3641`, `:4077–4085`. **Executed:** on the seeded state `muscleVolume` returns `[]` at both matrix days (no session inside the 14-day window), so the seeded public census does not move; `volumeImbalance` identical.
- **Source mutants.** (1) `press-credit-goes-to-unreturned-coarse-delt-bucket` — restore the raw key. (2) `indirect-credit-remaps-every-key-to-delts-front` — drop the `mg2 === "delts"` test, killed by the triceps control. (3) `indirect-credit-doubled-into-both-keys` — write both `delts` and `delts_front`, killed by the exact `n7 === 7` equality. (4) `indirect-credit-rounded-before-summing` — `Math.round(n6*f2)`, killed by a half-set control.
- **Negative controls.** `triceps` from the same press row is unchanged; a lift with no `INDIRECT` entry is unchanged; a state with a `delts_front` lift but no press is unchanged; the `prev7` window mirrors the `now7` change exactly. **New condition to record:** the accepted law's `control` (`laws-evidence-comparability.cjs:11`) **adds** the indirect delta on top of `muscleVolume`'s own output, so on a repaired engine it double-counts and goes RED (executed). It may serve as a frozen-side satisfiability demonstration only and must never be re-run as a candidate oracle — the same shape as D30's recorded condition (1).

### 1.10 D18 — this week's set change is lost behind 80 feed rows (register 305–313)

- **PLAIN** (:307) "The app forgets this week's set change when enough ordinary notes appear ahead of it."

**Current code** `rebuild/engine/volume.cjs:157–160`:
```js
  (s.feed || []).slice(0, 80).forEach((f) => {
    if (!f || !f.t || !f.d || f.d < monday || f.t.indexOf("VOLUME ") !== 0) return;
    const ex = (s.exercises || []).find((x) => f.t.indexOf("via " + x.n) > -1);   /* "VOLUME PASSED" carries no "via" — declines are not moves */
    if (ex && !moves.some((m) => m.kind === "sets" && m.exId === ex.id)) moves.push({ kind: "sets", d: f.d, rid: null, exId: ex.id, mgs: spillOf(ex.id) });
```
An accidental display prefix bounds a weekly budget scan.

- **Owner semantics** — plain Batch-A FIX.
- **Behaviour change.** Scan the whole feed; the `monday` bound, the `VOLUME ` prefix test, the de-duplication by `exId` and the `spillOf` mapping stay exactly as they are.

**Exact hunk** (`volume.cjs:157`):
```
- (s.feed || []).slice(0, 80).forEach((f) => {
+ (s.feed || []).forEach((f) => {
```

- **Law** `P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix` — "A current-week set change remains in the structural budget regardless of how many ordinary notes precede it." RED today: with 80 notes ahead of the VOLUME row, `b.sets.length === 0`.
- **Delta cells.** Changes: `structuralMovesThisWeek.moves` / `.sets` / `.mgsTouched` when more than 80 feed rows precede a current-week VOLUME receipt, and hence the Auto-Pilot tighten veto (`engine-test.jsx:8079`), the `volumePush` week budget and the offer-expiry branch at `writers.cjs:2286`. Must NOT change: the `adjustments` loop at `:152–156`; `calOrSteps`; a VOLUME row outside the week; `VOLUME PASSED`; `engine-test.jsx:6351`, `:6404`, `:6593`, `:8088`, `:8114`. **Executed:** the seeded feed is 9 rows, so the seeded census is unchanged at both matrix days.
- **Source mutants.** (1) `eighty-feed-lines-only` — restore the slice. (2) `weekly-bound-dropped-with-the-prefix` — drop `f.d < monday`, killed by a last-week VOLUME control. (3) `duplicate-moves-no-longer-deduped` — drop the `!moves.some(...)` test.
- **Negative controls.** A same-week VOLUME row inside the first 80 is still found exactly once; two VOLUME rows for one lift still yield one move; `VOLUME PASSED` yields none; a feed with 5,000 rows is a performance observation, not a correctness delta (pin a bounded time assertion, not a golden).

**Objection recorded.** `volume.cjs:159` resolves the receipt's owner by the *same* unbounded-substring rule D3 repairs in `progression.cjs:124` — `find((x) => f.t.indexOf("via " + x.n) > -1)` — so after D18 lifts the 80-row cap this reader can attribute a longer-named lift's receipt to the shorter lift across the whole feed, which is D3's defect in a reader the register does not give a D-id. Recommendation: apply §2's convention here inside B2 as a fourth one-line hunk (`f.exId != null ? String(f.exId) === String(x.id) : own9 === x.n`), because D18 measurably widens the exposure. PM decision required (§7 Q2); B2 will not do it silently.

### 1.11 D28 — planned weekly sets use a superseded schedule (register 147–155)

- **PLAIN** (:149) "The app counts planned weekly sets using an old training schedule after a newer schedule has taken effect."

**Current code** `rebuild/engine/volume.cjs:62–64`:
```js
function programmeVolume(s) {
  const perWeek = {};
  for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
```
A hard-coded authored week (2026-07-27) is the denominator of every designed-volume number.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:154): "Derive the relevant week from the as-of calendar and use the effective split for its days."
- **Behaviour change.** Derive the week from the query day using the Monday convention this very module already uses for the structural budget (`volume.cjs:146–148`), so the two weekly readers agree by construction. `dayType` remains the only schedule authority, and it is already dated (D9's repair lands underneath).

**Exact hunk** (`volume.cjs:64`):
```
- for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
+ const d9 = mk(isoOf(todayStart())); const mon9 = new Date(d9.getTime() - ((d9.getDay() + 6) % 7) * DAY);
+ for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mon9.getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
```

- **Law** `E-D28-programme-volume-follows-the-current-effective-split` — "Designed weekly volume uses the currently effective weekly split." RED today: with `split:[{from:'2026-08-01',map:{1:'U'}}]` the current week has exactly one `U` day so `chest` must be 3; the July week yields 6.
- **Delta cells.** Changes: `perWeek`, so every `programmeVolume` `sets`/`zone`/`tier`, `volumeImbalance`, the volume-push routing target and the front-delt indirect total — **whenever the as-of week's U/L counts differ from the 2026-07-27 week's**. Must NOT change: `bucket`, `exActive` filtering, `indirectOnly`, `lifts[]` projection, the `.toFixed(1)` rounding, the descending sort. **Executed, and this is the load-bearing finding:** on the seeded state the July week yields `{U:2, L:2}` and the as-of week yields `{U:2, L:2}` at **both** matrix days (as-of Mondays 2026-08-31 and 2026-09-07), so `programmeVolume` is byte-identical — `[["biceps",11],["back",10],["chest",10],["abs",10],["triceps",9],["delts_side",8],["quads",8],["forearms",7],["delts_rear",6],["calves",6],["glutes",6],["hams",4],["delts_front",3]]` — and `volumeImbalance` with it. D28's public golden risk on the seed is therefore **zero at both matrix days**; the private census must still be checked on the owner's PC because the private split history is not visible here.
- **Source mutants.** (1) `programme-volume-uses-authored-july-week` — restore the literal. (2) `programme-week-starts-on-sunday` — `d9.getDay()` instead of `(getDay()+6)%7`, killed by a split whose U/L days straddle the Sunday/Monday seam. (3) `programme-week-reads-the-next-week` — `+ 7*DAY`, killed by a mid-week fork case. (4) `programme-week-ignores-the-split-argument` — `dayType(iso)` with no state.
- **Negative controls.** A state with no `split` reproduces the legacy dow reading for the as-of week; the dated REFEED retirement (`engine-test.jsx:7822`) is untouched; `structuralMovesThisWeek.monday` and `programmeVolume`'s Monday agree on the same clock (assert them equal — this is the point of reusing the convention).

### 1.12 D30 — first-set trend pools lifts across a technique change (register 379–387) — **ACCEPTED BRIEF, REUSED VERBATIM**

B2's D30 section **is** `rebuild/m2/BRIEF-SET-ONE-ERA.md` at ffabbca — 75 lines, 18,912 bytes, **sha256 `a2e88bed8edf566b4551d9a48b79282b9e367b2fd195bde5f1be41f13baa84b3`**, byte-equal to the bytes accepted at `rebuild/DECISIONS.md:82` (re-verified on this tree). It is incorporated **verbatim and unmodified**; nothing in it is rewritten, narrowed or widened here, and its §0 product allowlist ("`rebuild/engine/volume.cjs` only, the `setOneRead` declaration plus two late-bound delegates to existing `E.forksOf`/`E.sameEra`"), its §1 behaviour, its §2 twelve ERA30 case families, its §3 fault list and its §5 "never" list all carry into B2 as written. Its accompanying review is `rebuild/m2/REPORT-SET-ONE-ERA-BRIEF-ASTRA.md` (58 lines, 6,770 bytes, sha256 `670e303e8739bc3cd11336b093417a3102c6cab1cbf6f7befa31cbaf7b3926d2`).

Its §1 product rule, quoted verbatim (`BRIEF-SET-ONE-ERA.md:17`): "Preserve the initial exercise lookup and IDLE guard exactly. Immediately after that guard, obtain `forksOf(s, exId)` once; obtain `isoOf(todayStart())` once only when that returned array is nonempty, otherwise use `null` as the unused query-era argument. Inside the existing sorted-date loop, before reading that date's session record, skip it when `sameEra(forks, d, at)` is false. All remaining original code is unchanged."

Current code it applies to, `rebuild/engine/volume.cjs:189–196`:
```js
function setOneRead(s, exId) {
  const ex9 = (s.exercises || []).find((x) => x && x.id === exId);
  if (!ex9 || typeof ex9.w !== "number") return { status: "IDLE", exId };
  const pts = [];
  for (const d of Object.keys(s.sessionLog || {}).sort()) {
    const sl = s.sessionLog[d];
```
Law `P-D30-first-set-trend-respects-the-recorded-technique-era` — "A first-set trend with only one current-era session remains counting instead of borrowing observations across a technique fork." RED today: three pre-fork sessions plus one post-fork session return `LIVE, n:4`; the law requires `COUNTING, n:1`.

**The two conditions recorded at `DECISIONS.md:82`, verbatim, carry into B2 unchanged:** "(1) the accepted law's `control` patch (laws-evidence-comparability.cjs:24) reads the query day unconditionally, whereas the product rule reads it only with nonempty forks — the control may serve as a result oracle, never as the clock-trace oracle for ERA30-CLOCK / ERA30-NONE; (2) the P6 second-gate sites 8790–8793 and the seeded set-one card are the named protected surfaces for this theme — cowork's verdict is UNCHANGED, and any executed difference is a RED stop for a reviewed successor cell, never a golden regeneration."

Two B2-specific notes, neither altering the accepted scope: the two delegates D30 introduces are **also** D32's dependency (§1.14), which is why D30 precedes D31/D32 in the package order; and `volume.cjs`'s pre-image `c32298e7…` is not disturbed by NATIVE-CARRIERS, so D30's coordinates survive the rebase.

### 1.13 D31 — added-set tolerance inferred only from pre-change workouts (register 389–397)

- **PLAIN** (:391) "The app says an added set was tolerated using only workouts from before that set was added, when it should wait for evidence after the change."

**Current code** `rebuild/engine/volume.cjs:226–239` (with the trend's own cut at `progression.cjs:611–617`):
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
`seq` (`:224`) is built over **all** logged days; `liftTrend`'s `pts` (`progression.cjs:589`) excludes hard-session days at `:587`. When the most recent session is a hard day, the two disagree about `lastK`, `liftTrend`'s reset cut lands on the **pre**-change run, and `volumeConversion` reports `LIVE`/`TOLERATED` from pre-change evidence while its own prose claims the post-change block.

- **Owner semantics** — plain Batch-A FIX. Register FIX (:396): "Require the trend's set count and contributing dates to match the post-change block before returning a tolerance finding."
- **Behaviour change.** Before any tolerance tier is produced, require the trend actually to describe the post-change block: its reported set count equals `lastK` and every contributing point is dated on or after `changedAt`. Otherwise the existing `READING` return is used — whose prose ("the read window is open — N of 4 post-change sessions logged") is already the truthful statement. No threshold, no new tier, no change to `liftTrend`.

**Exact hunk** (`volume.cjs:238`):
```
- if (!t || t.n < TREND_MIN_SESSIONS) return { status: "READING", exId, changedAt,
+ if (!t || t.n < TREND_MIN_SESSIONS || t.k !== lastK || t.pts.some((p8) => p8.d < changedAt)) return { status: "READING", exId, changedAt,
```
(`t.k` and `t.pts` are already on `liftTrend`'s return, `progression.cjs:640` — no new export.)

- **Law** `V4-volume-tolerance-post-change` — "A live tolerance finding uses qualifying sessions after the change at the reported set count." RED today: with one hard-session post-change day the reader returns `LIVE` whose `trend.k` and `trend.pts` belong to the pre-change block.
- **Delta cells.** Changes: `volumeConversion` `LIVE → READING` (and the disappearance of `tier`/`tolerated`/`delivered`/`subtract`/`trend` from that return) exactly when the trend does not describe the post-change block. Must NOT change: any `LIVE` whose trend already matches; `IDLE`; the `READING` prose and its derived review dates; `blockDays`; `have`/`need`; `UNDELIVERED`, `NOT-TOLERATED`, `MIXED-PHASE`, `UNCLEAR`, `TOLERATED`, `OUTCOME-COMPATIBLE`, `REPLICATED` selection for matching trends; `engine-test.jsx:6413–6520`, `:6619`, `:6812`. **Executed:** every seeded lift returns `IDLE` from `volumeConversion` at both matrix days, so the seeded census is unchanged.
- **Source mutants.** (1) `reuse-pre-change-tolerance` — delete the added condition. (2) `post-change-check-on-the-count-only` — keep `t.k !== lastK`, drop the date test. (3) `post-change-check-on-the-dates-only` — the converse. (4) `post-change-check-is-inclusive-of-the-prior-day` — `p8.d < changedAt` → `p8.d < prevDay`, killed by a boundary session on `changedAt`.
- **Negative controls.** A clean post-change block of ≥4 sessions still reaches its tier with byte-identical prose; a session dated exactly on `changedAt` qualifies; `t === null` still returns `READING` with the same `have`; a `dK < 0` (set removal) block behaves as before; the `subtract`/`safety` receipt is unchanged where the tier still fires.

### 1.14 D32 — replication counts workouts from a different technique era (register 399–407)

- **PLAIN** (:401) "The app says a benefit repeated under comparable conditions even though the earlier workouts used a different technique; whether those workouts may count is the owner's call."

**Current code** `rebuild/engine/volume.cjs:278–288`:
```js
        /* replication — any EARLIER stable block of outcome length that also rose */
        const segs = [];
        let s0 = 0;
        for (let i = 1; i <= seq.length; i++) { if (i === seq.length || seq[i].k !== seq[i - 1].k) { segs.push(seq.slice(s0, i)); s0 = i; } }
        segs.pop();
        const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
        tier = priorOK ? "REPLICATED" : "OUTCOME-COMPATIBLE";
```
No comparability boundary: a stable block from before a recorded technique fork can establish replication. The era tools are already on the engine — `plan.cjs:36–43` `forksOf`, `:46–50` `eraIdx` (`f.from <= d`, inclusive), `:52–56` `sameEra` (empty forks → true), both exported at `plan.cjs:331`.

- **Owner semantics — Batch B, verbatim from `rebuild/DECISIONS.md:60`:**
> D32 APPROVED-FIX — "benefit replicated" counts only sessions from the CURRENT technique; all other replication thresholds stay as they are.

- **Behaviour change.** A candidate earlier block establishes replication only if **every** session in it belongs to the query day's technique era, using the engine's existing `sameEra` membership and the same query-day convention `liftTrend` (`progression.cjs:562`) and D30's accepted rule use. `TREND_MIN_SESSIONS`, `REVIEW_OUTCOME_D`, `_blockSlope`, the segment construction, the `segs.pop()` exclusion of the current block and both `why` strings are untouched — that is the owner's "all other replication thresholds stay as they are".

**Exact hunk** (`volume.cjs:283`, reusing D30's two delegates — `volume.cjs` gains no third binding):
```
-       const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
+       const fk2 = forksOf(s, exId), at2 = isoOf(todayStart());
+       const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && g9.every((p8) => sameEra(fk2, p8.d, at2)) && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
```

- **Law** `V4-volume-replication-same-era` — "A replication claim requires an earlier qualifying block in the same technique era." RED today: a five-session pre-fork block at `k:2` earns `REPLICATED` for a post-fork `k:3` block.
- **Delta cells.** Changes: `tier` `REPLICATED → OUTCOME-COMPATIBLE` (and the corresponding `why` selection at `:285–287`) when every qualifying earlier block is cross-era. Must NOT change: a same-era earlier block still yields `REPLICATED` with byte-identical prose; no-fork states (empty `forks` → `sameEra` true, so `priorOK` is unchanged and, per the clock condition below, the query day is still read once by the surrounding code); `tLong`; `delivered`; `blockDays`; the `needD9` leangain branch; `engine-test.jsx:6619`. **Executed:** every seeded lift is `IDLE` here, so the seeded census is unchanged.
- **Source mutants.** (1) `compare-earlier-technique-block` — delete the era predicate. (2) `replication-era-checked-on-the-block-start-only` — `sameEra(fk2, g9[0].d, at2)` instead of `every`, killed by a block that straddles a fork. (3) `replication-era-uses-the-latest-stored-fork` — `at2 = last fork's from`, killed by moving the query day across a later fork. (4) `replication-era-excludes-the-inclusive-boundary` — `f.from < d` semantics, killed by a session logged exactly on a fork date. (5) `replication-threshold-relaxed-with-the-era-cut` — drop `REVIEW_OUTCOME_D`, proving the owner's "all other thresholds stay" clause.
- **Negative controls.** No forks → byte-identical result; an unrelated exercise's forks cannot change this lift; a legacy single `fork.from` is honoured (`plan.cjs:41`); a block entirely inside the current era with a rising slope still replicates. **Condition to record (D30 condition (1) generalized):** the accepted law's `control` (`laws-evidence-comparability.cjs:45`) derives `asOf` from the last logged day, while the product rule reads the query day (`todayStart()`); in the law's fixture those coincide. The control may serve as a result oracle, never as the clock-trace oracle for D32's clock family.

## 2. THE IDENTITY CONVENTION (D3/D4 — and the scheme B3's D37/D38/D39 must reuse)

`PLAN…:157` requires this brief to state the convention so the engine does not end up with two. It is stated here as a **durable lift-identity scheme**, not a string trick, and it is deliberately reader-first so B2 can land it without touching `writers.cjs`, `merge.cjs`, `earn.cjs` or `migrate.cjs`.

**C1 — identity is the record id, never a name.** A lift's durable identity is `String(ex.id)`. Names (`ex.n`, `forks[].prevN`, `renames[].prevN`) are *display history*, resolved through `_formerNames` (`progression.cjs:109–114`) and used only to interpret prose written before the id was carried.

**C2 — structured identity is authoritative and terminal.** When a feed/receipt/adjustment record carries a structured owner field, that field decides ownership on its own: a match is ownership, a mismatch is **non**-ownership, and the prose is not consulted as a fallback. The field name is **`exId`** — the name `writers.cjs` already uses on `agentProposals` (`:1459`, `:1469`), on `adjustments[].exUndo.exId` (read at `volume.cjs:155`) and on `structuralMovesThisWeek`'s own `moves[].exId` (`:160`). B2 implements only the *reader* half; B3 (whose D44 hunk already edits `writers.cjs:2292`, and whose D37/D38/D39 edit `merge.cjs`/`writers.cjs`) adds the writer half and must use this exact field name and this exact terminal semantics.

**C3 — the legacy boundary is a WHOLE-NAME boundary at the producer's own recorded delimiter. Never a substring, never a bare prefix.** Two boundaries exist because two producers exist, and each is read from the producer, not invented:
- **VOLUME receipts** (`writers.cjs:2135`, `:2292`) emit `VOLUME ±N — <MG> via <ex.n> (now <n> sets)`. The owner is therefore the exact string between `"via "` and the first `" (now "`, or to end-of-string when that suffix is absent. Compared with `===` against `_formerNames(ex)`. A row with no `"via "` (e.g. `VOLUME PASSED`) has **no owner** and is skipped, never guessed.
- **EARNED receipts** (`earn.cjs:89`) emit `<EX.N.toUpperCase()> <load> EARNED`. The owner is a former name that both starts the string **and** is followed by exactly ` <numeric load> EARNED` — regex `/^ [-+]?(?:\d+(?:\.\d+)?|\.\d+) EARNED$/` applied to the remainder. Name-only or arbitrary-tail matches are **not** ownership.

**C4 — the boundary is complete, not heuristic.** No substring search, no `startsWith` without a terminator, no fuzzy or case-insensitive widening beyond the uppercasing the producer itself applies (`progression.cjs:495`), no invented delimiter. If a future producer's format has no such delimiter, the correct move is to add `exId` at that producer (C2), not to loosen C3.

**C5 — resolution is total and side-effect-free.** Ownership resolution answers exactly one of *mine* / *not mine* / *unattributable*, never throws, never mutates the record, never consults the clock, ids or storage, and treats an unattributable record as "not mine" for spending/crediting purposes while leaving it in the history.

**C6 — one convention, one reader shape.** Every reader that attributes a written receipt to a lift uses C2→C3 in that order: `progression.cjs:124` (`_volDeltas`, D3), `progression.cjs:504` (`_deriveSightingFull`, D4), and — pending the PM's answer to §7 Q2 — `volume.cjs:159` (`structuralMovesThisWeek`, discovered under D18). B3's `earnWalk` as-of repair (D37, now in `earn.cjs`), trial-decision preservation (D38), offer-dismissal preservation (D39) and the VOLUME-receipt truth guard (D44) reuse C1–C5 unchanged; **B3 must not introduce a second identity scheme, a per-set immutable-id model, or a name-normalisation pass.**

## 3. Ordering and interactions inside B2, and the shared surfaces

**Why this order** (`PLAN…:85`, verified against the source): D9 first because `dayType` is the schedule authority D28 then reads; D2 next because `_bornValid` gates whether an impossible record ever reaches `targetsFor`, which D1 edits; D1/D5/D6 are three independent pure-helper repairs inside `progression.cjs`; D7 precedes D3/D4 because it changes `liftTrend`/`progressAnchor`, which D31 reads through `volumeConversion:237`; D3 before D4 because both adopt §2 and D3 establishes the VOLUME boundary that D4's EARNED boundary mirrors; D29/D18/D28 are three independent `volume.cjs` repairs; **D30 must precede D32** because D30's accepted scope introduces the `forksOf`/`sameEra` delegates that D32's hunk consumes; D31 before D32 only because both edit `volumeConversion` and D31's guard sits above D32's replication branch.

**Real interactions to prove, not assume.**
- **D7 × D30.** D30's accepted brief forbids a `d <= today` cut in `setOneRead` ("a future session before the next fork remains eligible … That historical behavior is outside this correction", `BRIEF-SET-ONE-ERA.md:19`). D7 introduces exactly that cut — but only in `progressAnchor` and `liftTrend`, which is the register's own scope (:84). **B2 must not extend D7's cut into `setOneRead`**; pin a case where a future in-era session is excluded from `liftTrend` and still eligible in `setOneRead`, so the divergence is deliberate and reviewed.
- **D7 × D31.** D31's guard reads `t.pts`/`t.k` from a `liftTrend` that D7 has just narrowed; D31's expectations must be constructed against post-D7 behaviour.
- **D9 × D28.** D28's law asserts one `U` day in the current week under a single split row; D9 changes *which* row wins. Pin one case with an unsorted multi-row split so both repairs are exercised together.
- **D3 × D4.** They share `_formerNames` and both change what `_deriveSightingFull` sees (D3 through `_volDeltas`→`_setsAtTime`→the incompleteness cut at `:527`, D4 through `lastEarn9`). Pin a joint case.
- **D2 × D1.** With `_bornValid` fixed, an impossible record stays quarantined and never reaches `targetsFor`; the `RangeError` at `progression.cjs:164` remains reachable only for a record that was never quarantined. D1's hunk must not change that (see §1.3).
- **D5 × D6.** Both feed `deloadLoad`; a duplicate-only ladder plus an absent load must return `null` once, not `5`.

**Shared surfaces with B3 (B2 goes first, `PLAN…:91`).** `progression.cjs:118–134` `_volDeltas` — D3 rewrites its owner test; B3's **D44** asserts over `_volDeltas` and B3's **D37** rewrites `earnWalk`'s as-of, which reads the same sighting derivation D4 changes. `volume.cjs:154–160` — D18 removes the 80-row slice at `:157` inside the exact range D44 reads. B3 must rebase onto B2's post-image, adopt §2's convention, and (if §7 Q2 is answered yes) find `volume.cjs:159` already converted.

**Shared surfaces with NATIVE-CARRIERS (that package goes first, `DECISIONS:93`, `PLAN…:145`).** `plan.cjs` and `progression.cjs` are rewritten wholesale. Specific collisions to re-verify at rebase: `DECISIONS:93` records that carriers package touches `eraFresh` ("eraFresh sees native sessions") — `eraFresh` is a `plan.cjs` export (`:331`) alongside the `forksOf`/`eraIdx`/`sameEra` D32 and D30 depend on; and it adds a `PROGRESSION_RESET_MAPPING_REQUIRED` refusal inside `progression.cjs`. B2's line coordinates for D1, D2, D5, D6, D7, D3, D4 and D9 are all re-pinned after that merge; the *behaviour* contract in §1 is unaffected, because each hunk is specified against a named declaration, not a line number alone.

**Shared surface with Track A.** `programmeVolume`, `muscleVolume` and `targetsFor` are rendered by A1/A2. A's expectations must be written against post-B2 behaviour or re-pinned after the merge (`PLAN…:149`, risk 6).

## 4. Gate-carrier collisions — an objection to the plan's "disjoint" claim

The plan's merge recommendation calls B2 ∥ B1 "disjoint: B2 = progression/plan/volume, B1 = dates/sleep/policy/today" (`PLAN…:113`). That is true of the **product** files and **false of the gate carriers**, and this brief objects on that point.

Executed at ffabbca and on the repaired scratch copy:
- `rebuild/engine/test/defect-witnesses.cjs` (gate `witnesses-1`) prints `REPRODUCED D1 … D10` and `DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged` on the base, and **throws** on the repaired candidate. It carries **B2's D1, D2, D3, D4, D5, D6, D7, D9 and B1's D8, D10 in one file.** Both packages need a successor carrier for it; whichever merges second must rebase its carrier onto the other's. There is **no existing carrier** for `witnesses-1`.
- `rebuild/engine/test/defect-witnesses-4.cjs` (gate `witnesses-4`) prints `DEFECT WITNESSES 4: 5/5 reproduced` on the base and throws on the repaired candidate at `:47` (`programmeVolume chest 6 → 3`). It carries **D28, D29, D30, D31, D32 — all five are B2's**, which is the one place the plan's grouping is exactly right. No existing carrier.
- `rebuild/engine/test/defect-witnesses-2.cjs` (gate `witnesses-2`) **already fails on the unmodified base** at `:51` (the D12 witness, `0.1 !== 100`, D12 being repaired at `DECISIONS:87`) and already has an accepted carrier: `rebuild/conform/v4/postfix/legacy-step-efficacy-carriers.cjs:7,15,79` ("11 original witnesses; only D12 slope/resolution expectations changed"), inherited by `rebuild/m4/spec/load-write-inherited-carriers.cjs:12,32`. B2 must **extend** that carrier with D18's replaced expectation and preserve D11–D17 and D19–D21 unchanged — not author a new one.

Recommendation to the PM: serialize B1 and B2 on the `witnesses-1` carrier even if their product merges stay parallel, or accept one rebase pass on that file.

## 5. Golden / receipt surfaces, and the protected surfaces

**Receipt and prose surfaces: none are edited.** No hunk in §1 changes a feed string, a receipt template, a `why` string, a card, a schema or a threshold. D31 can *select* the existing `READING` prose instead of a tier's prose, and D32 the existing `OUTCOME-COMPATIBLE` prose instead of `REPLICATED`'s; both strings already exist verbatim (`volume.cjs:239`, `:287`).

**Executed public-census scope.** Over the seeded state at both matrix days (`2026-09-03`, `2026-09-07`), thirteen full-engine reads — `programmeVolume`, `muscleVolume`, `volumeImbalance`, `structuralMovesThisWeek`, `targetsFor`, `loadRungs`/`maxedOut`/`nextLoad`, `deriveSighting`, `_volDeltas`, `setOneRead`, `volumeConversion`, `liftTrend`, `progressAnchor`, `dayType`, `nowModel` — are byte-identical between base and repaired candidate **except one cell**: `deloadLoad` for `fly` and `hipthrust`, `5 → null` (D6). That cell is unreachable through the engine's only internal consumer (`sleep.cjs:133` guards on `typeof ex2.w === "number"`).

**Recommendation on re-pinning (`PLAN…:148`, risk 5): re-pin in-package, not in a separate successor.** The whole executed public delta is one primitive cell created by an owner-approved repair whose FIX line anticipates it (register :50, "any census path containing an invented deload will change in the later fix"). Splitting a one-cell re-pin into a reviewed successor buys nothing and adds a chain link. The three witness carriers of §4 are in-package by construction. **Two hard exceptions**, both pre-committed: (a) any *unlisted* public or private delta beyond that cell is a **RED stop** for an exact reviewed successor expectation — never a regenerated golden, never a suppressed assertion (`BRIEF-IMPORT-GUARDS.md:90`, `:89`); (b) the protected surfaces below are verdict-only and never re-pinned in-package.

**Protected surfaces (`DECISIONS:82` condition (2)), kept verdict-only.**
- The **P6 second-gate cells at `tools/engine-test.jsx:8790–8793`** — `S6 = clP(SEED)` with synthetic June sessions, `r6.status === "LIVE" && r6.n === 5 && r6.pct > 0`, then the sub-minimum `COUNTING` assertion. Read at ffabbca: the fixture carries **no `forks`** on `ham` and every session is dated 2026-06-01…2026-06-15, so D30's era cut and D7's future cut are structurally inert there and D31/D32 are not on the `setOneRead` path at all. B2's expectation is therefore **UNCHANGED**, exactly as cowork recorded; **the package proves it by execution on the owner's PC and reports the verdict only** — no cell values, no hashes, no prose. An executed difference is a RED stop for a reviewed successor cell.
- The **seeded set-one laboratory card** (`sleep.cjs:1283–1292`, `labAnalytics2`, the only engine consumer of `setOneRead`; frozen `app.jsx:7407`). Same rule: verdict-only UNCHANGED, proved by execution, never regenerated.
- **`rebuild/conform/private/live.json` and the private `live.main` golden** are never opened, named-with-values, hashed or quoted in any report (`run.cjs:115–117`, `BRIEF-IMPORT-GUARDS.md:89,103`). D30 is the only LIVE-TRIGGERED defect in B2 (register :384; the summary table at :487–535 marks D16/D30/D45 as the only LIVE-TRIGGERED remainders), so D30 is the one place a private-census consequence is genuinely anticipated. If authorized private execution finds one, **the gate stays RED and a protected successor expectation is reviewed** (`DECISIONS:82`, "Not accepted here … private census effects").
- The frozen app (`fe516c1:src/app.jsx`, blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`), the original 45-law seeds, `rebuild/conform/oracle`, the original witness/differential/source test files and the seeded soak are never edited. The three witness successors are **pinned carriers**, not edits (the rule D30's brief states at `BRIEF-SET-ONE-ERA.md:61`).

## 6. Acceptance bar for B2

**Artifact** `rebuild/m4/spec/acceptance-b2-targets-identity-era.json`, bound by sha256, raw bytes byte-equal to `JSON.stringify(parsed,null,2)+'\n'`, duplicate-key pre-parser and closed schema, verified from Git at its reviewed commit and byte-identical on disk (`BRIEF-IMPORT-GUARDS.md:97`). Runner `rebuild/m4/spec/b2-package.cjs`, shaped like `load-write-package.cjs` — **`--full` or `--ci`, no third mode** (`assert(args.length===1&&['--full','--ci'].includes(args[0]))` at `:7`), the immutable `rebuild/conform/v4/postfix/run.cjs` wrapped, never forked.

**`authorizations`** (the `:49` addition (1) binding, mechanically confirmed at the receipt base): `owner` = `DECISIONS:60` line sha256 `ebb565c6…` (inherited byte-equal from the D12→load-writes chain); `contract` = `DECISIONS:49`; `theme` = **this brief's accepting ledger line, by sha256**; `review` = `{role: cowork, prefix: "POSTFIX-ACCEPTANCE M2-B2-TARGETS-IDENTITY-ERA", terminal: "ACCEPTED"}`. `PENDING` iff the review receipt is null.

**Parent — flagged for the PM.** The plan proposes B2 first in the chain (`PLAN…:146`), so the immutable accepted parent is **`rebuild/m4/spec/acceptance-load-writes.json`, sha256 `5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82`**, receipt `DECISIONS:86` (`b3bedd8c…`), integrated at `DECISIONS:87`. **But `DECISIONS:93` records M2-NATIVE-CARRIERS as a "successor of M2-LOAD-WRITES 5073977b…", so that package already claims the same parent.** Two packages cannot both claim it (`PLAN…:146`). Since NATIVE-CARRIERS merges first by ruling, B2's parent is almost certainly **the NATIVE-CARRIERS accepted artifact**, not `5073977b…`. **PM must fix the chain link before the artifact is written** (§7 Q1).

**What the FULL run must show** (`PLAN…:124–132`, `BRIEF-IMPORT-GUARDS.md:87–90`):
1. all 45 register laws executed: **D9, D2, D1, D5, D6, D7, D3, D4, D29, D18, D28, D30, D31, D32 GREEN on the candidate and RED on the frozen engine**; the accepted D12/D33/D34/D35/D41/D43 carried GREEN; the remaining 25 still raw RED with approved preservation deltas only; D27's dated GREEN-BY-FIXTURE-DATE and D44's nondefault THROWS/UNDEFINED pins retained without repair credit; `newlySelectedIds` = the fourteen, `carriedAcceptedIds` = the six, `requiredIds` unchanged, all 15 non-D obligations still OPEN. **Never call the other 25 repaired or M2 closed.**
2. all 19 original gate identities OBSERVED/PASS (`run.cjs:9–23`), with **three witness carriers** per §4 (`witnesses-1` new, `witnesses-4` new, `witnesses-2` extended) and every other inherited carrier unchanged.
3. **second gate** — `second-gate.mjs --candidate`, `SECOND GATE candidate: PASS`, with engine/sync/surface accounting and the protected P6 verdict of §5.
4. **own bites** — one disclosed source bite quoting its RED line, then exact byte/sha restoration and a restored-GREEN direct gate; plus one unlisted receipt/input-field bite proving the comparator fails closed.
5. **real source fault mutants** per D — the ≥2 named in each §1 subsection, mutated in **disposable candidate copies** loaded in fresh processes. A source-pin refusal, syntax error, missing target or timeout earns **no kill**. **Critical, executed finding:** once the repair is in the source, the register laws' own `mutants` — which all restore `T.__auditOriginal[name]` through the export wrapper (`helpers.cjs:49–58`) — become **inert** and report GREEN on the repaired candidate (observed for all fourteen). The laws' listed mutants therefore **cannot** serve as this package's fault mutants; only the named source mutants can. Likewise D29's and D32's law `control`s are non-idempotent over a repaired reader (D29's went RED, executed) — record both as conditions in the sense of `DECISIONS:82` (1).
6. **fidelity / structural diff** — no source change outside the enumerated hunks (four declarations in `progression.cjs`: `targetsFor`, `loadRungs`, `parseRungs`, `deloadLoad`; three more: `progressAnchor`, `liftTrend`, `_volDeltas`, `_deriveSightingFull`; two in `plan.cjs`: `dayType`, `_bornValid`; five in `volume.cjs` plus the two D30 delegates: `muscleVolume`, `programmeVolume`, `structuralMovesThisWeek`, `setOneRead`, `volumeConversion`); `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md`.
7. **census on the private blob** — `migrate-full` hard-requires `rebuild/conform/private/live.json` and the private `live.main` golden, failing `REQUIRED-PRIVATE-PREPARATION-MISSING` without them (`run.cjs:115–117`). **Verdict-only reporting.**
8. **receipt then authorized rerun** — PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word; the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and reruns the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0.

**Cloud (`--ci`) vs owner's PC (`--full`).** Cloud, both OS: focused tests, review controls, browser package, profile refusals, source carriers, traces, direct, inherited carriers, witnesses, legacy differential, second gate — `load-write-package.cjs:44` is explicit that "CI is explicitly public evidence only". Owner's PC only: anything reaching the private blob — the `migrate-full` three-blob oracle in both Date modes, the private LIVE re-evaluation for **D30**, therefore the whole `--full` run and every `POSTFIX PACKAGE PASS`; per `DECISIONS:92` the PM operates the PC directly and per `DECISIONS:93` C4 "FULL incl. the private oracle is the PM's own execution before any receipt". Reported verdict-only. Note for the PM: on a *public clone without the private directory*, `rebuild/conform/run.cjs` reports `SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families` (executed at ffabbca, unmodified tree); the `CONSISTENT` verdict the accepted bar names requires the PC's private preparation and is not a B2 regression.

## 7. Open questions for the PM — none for the owner

**Q1 (blocking the artifact, not the brief). Parent chain.** `DECISIONS:93` already makes M2-NATIVE-CARRIERS a successor of `acceptance-load-writes.json 5073977b…`. If B2 is also to claim `5073977b…` the chain forks; if NATIVE-CARRIERS merges first (as ruled), B2's parent should be the NATIVE-CARRIERS accepted artifact. Name the exact parent artifact path + sha256 before the artifact is written.

**Q2 (scope, one line). `volume.cjs:159`.** D18 lifts the 80-row cap over a reader that resolves the receipt's owner by the same unbounded substring rule D3 repairs. Extend §2's convention to that line inside B2 (recommended — one line, same convention, and D18 measurably widens the exposure), or record it as a new non-D register item and leave the widened exposure shipped? B2 will not widen its own scope without this answer.

**Q3 (scope, two lines). Reader-side `exId` in B2.** §2 C2's *reader* half is two lines across D3 and D4 and is fully backward-compatible (executed: laws GREEN, seeded census unchanged). Including it lets B3 add the writer field at `writers.cjs:2292` without re-opening `progression.cjs`, which B2 owns. Confirm it is in B2's allowlist; if not, B3 must own both halves and the convention is stated but unimplemented until then.

**Q4 (sequencing). `witnesses-1` carrier serialization** — §4. Serialize B1/B2 on that one carrier, or accept one rebase pass?

**Q5 (gate hygiene). `witnesses-2` is already RED at ffabbca** on the D12 witness (`:51`, executed). Confirm the inherited `legacy-step-efficacy-carriers.cjs` carrier is the accepted way that gate passes today and that B2 extends it rather than authoring a second one.

**Q6 (conditions). Three new conditions** to record alongside D30's two, all executed: (a) the register laws' export-wrapper mutants are inert on a repaired source and cannot be counted as fault mutants; (b) D29's law `control` double-counts over a repaired `muscleVolume` and is a frozen-side demonstration only; (c) D32's law `control` derives `asOf` from the log while the product reads the query day — result oracle only, never the clock-trace oracle.

**Q7 (flag, not a request). H1.** `DECISIONS:93` C3 assigns `today.cjs`'s `e.id === "hack"` per-athlete special case to Track B as register item H1. It is **not** in B2 (no `today.cjs` in B2's allowlist, no D-id, no v4 law) and B2 claims nothing about it (`PLAN…:150`).

**Nothing for the owner.** All fourteen dispositions are recorded at `DECISIONS.md:60`, and the only Batch-B rule in this package — D32 — is already fully specified there ("'benefit replicated' counts only sessions from the CURRENT technique; all other replication thresholds stay as they are"), which §1.14 implements literally and no more: the era membership changes, no threshold moves. D30's product-rule question was likewise closed at `DECISIONS:82` ("D30 is an owner-APPROVED-FIX at line 60 with the register's plain FIX … so no product-rule question is raised"). Unlike B3's D40, B2 carries no unfinished owner rule. The one candidate for an owner question — Q2's `volume.cjs:159` — is not one: it is the same identity-correctness direction the owner already approved for D3/D4 applied to one more reader, which is a scope decision for the PM, not a product rule for the owner.
