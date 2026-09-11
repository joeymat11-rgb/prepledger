# EARNED — LANE B · PACKAGE B3 — MERGE, RECEIPTS & SYNC — BEHAVIOUR/DELTA BRIEF v1 (PROPOSED, NOT ACCEPTED)

**Package** B3 (`rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md:93–102`, file sha256 `9376e3448c707955d93f1325a41104225dffc546e9ba9974b57d0070021b5aac`).
**Base tree** `origin/rebuild/t2-client-core` @ `8205b7f5d19df007fb0a03c66fcc1609aceeae9d` (`8205b7f`, "lane B: STATUS — r1 fixes pushed on b1/b2/tooling"). Every line number, sha256 and measured value below was re-read or re-executed on that tree in a private detached worktree; `npm ci --include=dev` local, never committed. **Nothing in the repo was modified, committed or pushed.** No private data was read: `rebuild/conform/private/` does not exist on this tree and must not; `ledger/` was never opened.
**D-ids, package order** D45 → D36 → D22 → D44 → D42 → D37 → D38 → D39 → D40 (9 defects, 39 register hours).
**Modules** `rebuild/engine/writers.cjs`, `merge.cjs`, `migrate.cjs`, `earn.cjs`, plus **one line** in `progression.cjs` (D37's `beatsNoise` signature) and **four** in `sleep.cjs` (D22's readers). Read-only reach into `volume.cjs:154–160` and `progression.cjs:225–241`.
**Author** Opus builder, lane B. Research + writing only, executed entirely in the cloud.

**Parent — both options stated, the PM rules once.** The chain on disk is `acceptance-import-guards.json → acceptance-step-efficacy.json → acceptance-load-writes.json 5073977b… → acceptance-native-carriers.json` sha256 **`295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`** (receipt `rebuild/DECISIONS.md:96`, reviewed commit `84d8f288…`, superseding `:95`'s `12597632…`; integration merge recorded at `:97`).
- **Option A — the PM's chain ruling holds B3 LAST** (`PLAN…:113` "NATIVE-CARRIERS → B2 ∥ B1 → B4 → B3"; `DECISIONS:94` "B2 ∥ B1 → B4 → B3"): B3's immutable parent is **the accepted B4 artifact**, and every pre-image sha256 in §2 is re-taken at B4's accepted head.
- **Option B — B3 is advanced ahead of B4** (`PLAN…:144` explicitly offers a re-split; B4 and B3 share no file — B4 is `energy.cjs` + the `policy.cjs`/`today.cjs` caches): B3's parent is **the accepted B2 artifact**. B3 can never take `295762f0…` directly, because B3 **must** rebase onto B2 (§6).
Lane B has no preference beyond "decide once and hold it" (`REQUESTS.md:3`, `:5`, `:7`). Authority for the package itself: `DECISIONS.md:60` (owner M2-RULE, 45/45 APPROVED-FIX — "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance"); `DECISIONS.md:88` (batch the 39); `DECISIONS.md:93` (NATIVE-CARRIERS accepted, merged at `:97`); `DECISIONS.md:94` (LANES, lane B owns the engine packages, "the PM's own FULL run is the acceptance").

---

## 0. Pre-image pins, and the NATIVE-CARRIERS dependency

`DECISIONS.md:93` records the carriers merge moving `writers.cjs 008d9296…→00291236…`. **Confirmed on this tree: `rebuild/engine/writers.cjs` sha256 `00291236ee0fe5a5bf0130d50219cb7753013302ae82a2c0af507f5a7aa649e6`** — the ledger's post-image is the live byte state, so every `writers.cjs` coordinate below is a carriers-era coordinate and the register's pre-carriers cites (`:1428–1432,1469,2292`, `:2188–2194,2381–2388`, `:2297–2298,2312`, `:2306–2317`, `:2463`) are re-pinned in §2.

| file B3 edits | sha256 @ `8205b7f` | hunks |
|---|---|---|
| `rebuild/engine/writers.cjs` | `00291236ee0fe5a5bf0130d50219cb7753013302ae82a2c0af507f5a7aa649e6` | 8 (D45 1, D44 1, D42 2, D38 3, D39 1) |
| `rebuild/engine/merge.cjs` | `b69dd11f6a44b41001741bd88b0e6cffbd8e0140837216775360b33b2d7e3d98` | 7 (D38 2, D39 2, D40 3) |
| `rebuild/engine/migrate.cjs` | `60959d58f63ca79e210d6ace763e93507bf5f30e5f744fe068a58eb653414f41` | 3 (D36 2, D22 1) |
| `rebuild/engine/sleep.cjs` | `3dd34e111fe56f757d55ad2a419e019109a4746430a76c1477d1bdfb94145da0` | 4 (D22) |
| `rebuild/engine/earn.cjs` | `4b8838807ee973e6cc31a75a74c5d5b389efc8b640433c09df0dd12dfd0584da` | 3 (D37) |
| `rebuild/engine/progression.cjs` | `7031838d37cfc522d3757437abc957b0a8e3688af0b540a830673d9aad030ef5` | 1 (D37) |

Read but not edited: `volume.cjs c32298e7…`, `index.cjs 40ccc489…`, `dates.cjs 19e9ce7e…`. Laws and harness: `laws-merge-tie-identity.cjs a8c4044d…`, `laws-receipt-truth.cjs 871a5fca…`, `laws-clock-and-as-of.cjs cf177466…`, `laws-undo-half-effects.cjs 4db1af68…`, `laws-analyst-writer-contract.cjs 1eb16752…`, `laws-state-shape-and-failure.cjs 104803f6…`, `helpers.cjs a9c03c7a…`, `run-defect-laws.cjs 2819a7e0…`, `postfix/run.cjs` GATES at `:9–23`. **Total 26 hunks across 6 files.** Frozen bundle for the RED-frozen half: built in the scratchpad from `fe516c1:src/app.jsx` (blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`, verified by `helpers.cjs:15–17`'s own check; file sha256 `d1ac52b5…`), bundle 813 751 bytes, sha256 `cc97582cb0f1af2dfabccf96bd9da8599fc35949f4d894c266f193ff880e5068`. **Never written into the repo.**

---

## 1. Red-first, executed on BOTH engines, before any change

`TZ=America/New_York ENGINE_MAIN=<bundle> node rebuild/conform/v4/run-defect-laws.cjs` on `8205b7f`:

```
TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

All nine B3 rows print **`RED-frozen / RED-candidate`**, each with its repair control GREEN and every listed mutant RED:

| D | law id | frozen | candidate | control | mutants |
|---|---|---|---|---|---|
| D45 | `V4-analyst-effort-rule-matches-writer` | RED | RED | GREEN | 2/2 RED |
| D36 | `V4-curl-receipt-prices-actual-vector` | RED | RED | GREEN | 1/1 RED |
| D22 | `E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash` | RED | RED | GREEN | 1/1 RED |
| D44 | `V4-volume-receipt-requires-actual-change` | RED | RED | GREEN | 2/2 RED |
| D42 | `V4-break-undo-restores-scale-effect` | RED | RED | GREEN | 1/1 RED |
| D37 | `V4-merge-earned-receipt-historical-asof` | RED | RED | GREEN | 1/1 RED |
| D38 | `V4-merge-preserves-written-trial-decisions` | RED | RED | GREEN | 1/1 RED |
| D39 | `V4-merge-preserves-offer-dismissal` | RED | RED | GREEN | 2/2 RED |
| D40 | `V4-daily-conflict-direction-independent` | RED | RED | GREEN | 1/1 RED |

**One row prints `AUDIT-FAIL` on the base tree and it is not B3's: D45.** Its frames-parity check fails because `askContext`'s rendered text embeds the STEP EFFICACY line, and the accepted D12 repair (`DECISIONS:87`) already changed it: frozen prints `Across 4 clean week-pairs the fitted association is 78.9 lb/wk per 1k steps`, the candidate prints `Across 4 clean week-pairs (1 excluded …): each extra 1k daily steps associates with ~0.08 lb/wk slower loss`. Measured: first differing character at offset 13 204 of a 15 030-character frame, both engines otherwise identical. **This is an accepted repair showing through a neighbouring law's trace and B3 neither causes nor closes it.** B3 must not "fix" it and must not claim D45 reaches frames parity.

**The whole package, applied to a discarded scratch copy (26 hunks, exact-string replacement with a match-count assertion per hunk, 26/26 applied, 0 failures), re-run on both engines:**

```
TOTAL 45 laws · 45 RED-frozen · 30 RED-candidate · 89 GREEN repair controls · 88/104 mutant executions DETECTED · 0 HARNESS_ERROR
```

Row-by-row against base: **exactly nine rows move — D22, D36, D37, D38, D39, D40, D42, D44, D45 — and the other thirty-six are byte-identical.** RED-frozen stays 45 (the frozen engine is untouched); GREEN repair controls stay 89; detected mutant executions fall `97 → 88`, i.e. precisely the nine candidate-side law mutants going inert on a repaired source — the same phenomenon B2 recorded as its condition Q6(a) (`BRIEF-B2 v1.2 §7 Q6`). **The register laws' own mutants therefore cannot serve as B3's fault mutants; only the 30 named source mutants of §2 can.**

---

## 2. Per defect, in package order

Every quoted hunk is verbatim from `8205b7f`. "base →" values are measured on the unmodified candidate; "→ patched" on the discarded scratch copy. Cells were measured by a single 82-cell probe run against both trees (§10).

### D45 — analyst context contradicts the writer's earn rule

**Plain** (`AUDIT-REGISTER.md:479`): "The app tells its analyst that a final-set effort rating blocks an increase even though the app awards that increase under its existing rule." Register 477–485; BAR `:481` none; **LIVE `:482` TRIGGERED** (one of only three live-triggered defects in the whole remainder, `PLAN…:62`); FIX `:484` "rebuild/engine/writers.cjs / askContext: Describe the existing opener-based eligibility rule and terminal-set sizing role accurately in analyst context… Changes a frozen analyst prompt string but no athlete receipt directly".

**Current code** — `writers.cjs` (sha256 `00291236…`) `:2484` `function askContext(s, docs)`, the offending clause inside the `laws` template literal at **`:2490`** (a single line; the phrase occurs exactly once in the whole engine, measured `grep -rn "gates every earn" rebuild/engine/*.cjs` → 1 hit):

```js
const laws = `DATA WEATHER LAW: … a new best becomes official on ONE repeat, … ;
  terminal RIR gates every earn (0 blocks it), can take an earn early off one honest sighting —
  always by his tap, never automatically — and sizes the jump where the machine's rung ladder is on file; …`;
```

The writer's actual rule is at `earn.cjs:44–45`: `const openRir9 = en.rir;   /* the OPENER's rating — never the terminal set's */ … if (openRir9 === 0 || ex.holdFlag)`, under the comment at `:40–43` "a terminal 0 must never gate the earn — it is the instrument that SIZES the step".

**Owner semantics.** Batch A plain FIX at `DECISIONS.md:60` ("D45 APPROVED-FIX"); no rule text is set, and the repair must not invent one — it may only restate `earn.cjs`'s existing behaviour.

**Proposed behaviour.** The analyst prompt states the rule the writer runs: the OPENER's RIR gates the automatic earn, the terminal set is programmed to failure and sizes the jump, and a terminal 0 never blocks an earn. No threshold, no policy, no other sentence of the block changes.

**Proposed hunk** (`writers.cjs:2490`, one substring):
```
- terminal RIR gates every earn (0 blocks it), can take an earn early off one honest sighting
+ the OPENER's RIR gates the automatic earn (an opener at 0 blocks it) while the terminal set is
+ programmed to failure and SIZES the jump — a terminal 0 never blocks an earn, and a terminal set
+ with reps in reserve can take an earn early off one honest sighting
```

**Law** `V4-analyst-effort-rule-matches-writer` (`laws-analyst-writer-contract.cjs:7`; assertion `:8`: `!/terminal RIR gates every earn \(0 blocks it\)/ && /opener[^.;\n]{0,80}(earn|eligib)/i && /terminal[^.;\n]{0,80}(target|siz|programmed)/i`, after a precondition that a REAL terminal-zero earn actually queues `newW 105`). **RED on both engines** because all three clauses fail on the current text. **→ GREEN.**

**Delta cells (base → patched).** `has_obsolete_clause` `true`→`false`; `opener_eligibility` `false`→`true`; `terminal_sizes` `false`→`true`; `askContext(s).length` `13440`→`13608`. **Must NOT change (measured identical both trees):** `DATA WEATHER LAW` and `the scale seal quarantines event water` still present; `GLOSSARY` key count; `LEDGER_DICT`'s own `LAWS: a single terminal failure set per exercise` line (`writers.cjs:2464`) — the dictionary is a different frozen string and B3 does not touch it.

**Named source mutants (all executed, all CAUGHT).** (1) `drop-the-opener-clause` — killed by the law and by `opener_eligibility`/`terminal_sizes`. (2) `reinstate-the-obsolete-prohibition` — killed by the law's negative clause and `has_obsolete_clause`. (3) `blank-the-rule-clause` — killed by both positive clauses; this is the "silence cannot pass" mutant the register names at `:483`.

**Objection to the register and the plan.** The register's EVIDENCE line (`:480`) and `PLAN…:60` both cite `rebuild/engine/migrate.cjs:218–224` for D45. On this tree `migrate.cjs:218–224` is the SCALE-4 canonical pick for `MORNING READ MISSED` / `READ GAP` receipts and has nothing to do with analyst context or terminal RIR; `migrate.cjs` is byte-identical to `ffabbca` (`60959d58…`), so the citation was never right on any recent tree. **B3 does not edit `migrate.cjs` for D45.** Record the cite as a register erratum.

---

### D36 — the curl upgrade receipt prints hard-coded next weights

**Plain** (`:285`): "The app's curl upgrade receipt prints the wrong next weights when it should print the weights calculated from that curl's actual loads." Register 283–291; BAR `:287` **untrue value or receipt the athlete sees**; LIVE `:288` NOT APPLICABLE; FIX `:290` "Format the next-load vector from the converted exercise and the actual nextLoad result… **Directly touches a frozen receipt string** and may affect RAW migration output goldens".

**Current code** — `migrate.cjs` (sha256 `60959d58…`), `patchV60` at `:1221`; the converted exercise is bound at `:1262` (`const cu9 = (s.exercises || []).find((x) => x && x.id === "curl")`) and the vector installed at `:1288` (`cu9.w = vec9[0]; cu9.wSets = vec9.slice()`). The receipt at **`:1291–1295`**:

```js
for (const q9 of (s.queue || [])) {
  if (q9 && q9.id === "q_curl_grad" && !q9.done) {
    q9.done = true; q9.state = "SUPERSEDED";
    if (!(s.feed || []).some((f) => f && f.op === "patch60:curlgrad"))
      (s.feed = s.feed || []).unshift({ d: "2026-08-19", op: "patch60:curlgrad", t: "CURL GRADUATION — THE WALK OWNS IT NOW", how: "… two sessions at the top of the window bank the graduation and price the next line at 60·60·55. The coach flag is superseded …" });
```

`60·60·55` is authored. It is *accidentally* right for the live `55·55·50` preimage and wrong for every other — which is why LIVE reads NOT APPLICABLE and the defect is still an untrue receipt.

**Owner semantics.** Batch A plain FIX (`DECISIONS.md:60`, "D36 APPROVED-FIX").

**Proposed behaviour.** The sentence prices the converted exercise through the engine's own `nextLoad`, or — where no numeric vector exists — makes no pricing claim at all. `nextLoad` is already delegated in this module at `migrate.cjs:24`; `cu9` is `const`-scoped to the enclosing `try` at `:1262` and is in scope at `:1291`.

**Proposed hunk** (`migrate.cjs`, insert before `:1294`, and one substring at `:1295`):
```js
+ /* D36 — the receipt prices the CONVERTED exercise through the actual nextLoad, never an authored vector */
+ const nx60 = cu9 ? nextLoad(cu9) : null;
+ const px60 = (cu9 && Array.isArray(cu9.wSets) && typeof cu9.w === "number" && typeof nx60 === "number")
+   ? cu9.wSets.map((x60) => x60 + (nx60 - cu9.w)).join("·") : null;
  if (!(s.feed || []).some((f) => f && f.op === "patch60:curlgrad"))
-   … bank the graduation and price the next line at 60·60·55. The coach flag …
+   … bank the graduation" + (px60 ? " and price the next line at " + px60 + "." : ".") + " The coach flag …
```

**Law** `V4-curl-receipt-prices-actual-vector` (`laws-receipt-truth.cjs:78`; assertion `:79` `claimed === actual` where `actual = e.wSets.map(w => w + nextLoad(e) - e.w).join('·')`). **RED on both engines:** with `w: '40·40·35'`, `inc 5`, the receipt claims `60·60·55` and the actual vector is `45·45·40`. **→ GREEN.**

**Delta cells.** `receipt_40_40_35` `"60·60·55"` → `"45·45·40"` (= `actual_40_40_35`, identical on both trees). `receipt_no_vector` (numeric `w: 45`, no vector): `"…price the next line at 60·60·55."` → `"…bank the graduation."` — the sentence stops claiming rather than claiming nothing-shaped. **Must NOT change (measured identical):** `receipt_55_55_50` stays **`"60·60·55"`** — *the live preimage's printed number is unchanged, so the private census is expected to be untouched by D36*; the receipt's `t` (`"CURL GRADUATION — THE WALK OWNS IT NOW"`); `q_curl_grad` → `[done:true, state:"SUPERSEDED"]`; a state with no curl still mints no `patch60:curlgrad` line.

**Named source mutants (3/3 CAUGHT).** (1) `hard-code-the-authored-vector` (`px60 → "60·60·55"`) — the register's own mutant, killed by the law and `receipt_40_40_35`. (2) `price-the-opener-only` (`String(nx60)`) — killed by `receipt_40_40_35` and `receipt_55_55_50`. (3) `price-without-the-step` (`x60 + nx60`) — killed by both.

---

### D22 — numeric-keyed sleep records crash the readers · **the package's highest lost-fact risk**

**Plain** (`:339`): "The app crashes when saved sleep records use numbered entries instead of a list, although the nights themselves are present." Register 337–345; BAR `:341` none; LIVE `:342` NOT TRIGGERED; FIX `:344` **"Normalize recognized numeric-keyed night collections without losing entries and reject other invalid shapes explicitly before readers run. Estimate 3 hours. Normalization changes the synthetic exception result and can alter derived golden values; do not silently replace recorded nights with an empty list."**

**Current code** — every reader takes the collection at face value. The crash the law names comes from `sleep.cjs` (sha256 `3dd34e11…`) `:1012–1013`:
```js
function nightsBefore(s, iso) {
  return (((s || {}).sleep || {}).nights || []).filter((n) => n.d < iso).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
}
```
`|| []` never fires for an object (it is truthy), so `.filter` throws `TypeError: (((s || {}).sleep || {}).nights || []).filter is not a function` — the exact message the law matches. The register's three cited readers re-pin to **`recoveryIndex` `sleep.cjs:218`** (its own direct read at `:240` `s.sleep.nights.slice(-5)`), **`sleepAnchor` `sleep.cjs:1069`** (`:1070`), **`bodyAlarmSignal` `sleep.cjs:1625`** (`:1629` `s.sleep.nights.find(...)` — a different throw: `s.sleep.nights.find is not a function`). There are ~20 such sites in `sleep.cjs` alone; a per-site fix is not the repair.

**Owner semantics.** Batch A plain FIX (`DECISIONS.md:60`, "D22 APPROVED-FIX").

**THE LOST-FACT RISK, stated plainly.** The obvious repair is `Array.isArray(x) ? x : []`. That satisfies every reader, passes the law's crash clause, and **deletes the athlete's entire sleep history without a word** — the register anticipates exactly this at `:344`. A second, subtler loss: a numeric-keyed object with a **gap** (`{0:…, 2:…}`) is indistinguishable from an array that already lost entry 1; reading it as a two-night history is silent loss dressed as success. The purpose-written check below fails closed on both.

**Proposed behaviour.** One normalizer, shared, at two levels:
1. **Recognized = a DENSE `0..n-1` index set**, which is the only shape a JSON round-trip of an array can produce. It is restated entry-for-entry, in recorded order.
2. **Anything else non-array is REFUSED BY NAME** — `TypeError("SLEEP_NIGHTS_SHAPE_UNRECOGNIZED")` — never read as `[]`. A sparse index set, named keys, a string, an array containing a null: all refused.
3. **Absence stays absence.** `undefined`/`null` still reads as no nights, byte-identically to today.
4. The normalizer is **identity** on every shape the engine actually writes, so every existing path is byte-unchanged.

**Proposed hunks** — `sleep.cjs`, above `recoveryIndex` at `:218`, plus three one-line reader rebinds and one export:
```js
+ /* D22 — a recognized numeric-keyed collection is RESTATED entry for entry; any other non-array
+    shape is REFUSED by name; absence stays absence. Never [] for an unrecognized shape (:344). */
+ function _nightsArray(v) {
+   if (Array.isArray(v)) return v;
+   if (v == null) return [];
+   if (typeof v === "object") {
+     const ks9 = Object.keys(v);
+     if (ks9.length && ks9.every((k9, i9) => k9 === String(i9))) {   /* DENSE 0..n-1 only — see below */
+       const out9 = ks9.map((k9) => v[k9]);
+       if (out9.length !== ks9.length || out9.some((n9) => n9 == null)) throw new TypeError("SLEEP_NIGHTS_SHAPE_UNRECOGNIZED");
+       return out9;
+     }
+   }
+   throw new TypeError("SLEEP_NIGHTS_SHAPE_UNRECOGNIZED");
+ }
+ function nightsArrayOrRefuse(v) { return _nightsArray(v); }        /* the migrate boundary's handle */
+ function _sleepShaped(s) {
+   const n9 = s && s.sleep ? s.sleep.nights : undefined;
+   if (n9 === undefined || Array.isArray(n9)) return s;             /* identity on every engine-written shape */
+   return { ...s, sleep: { ...s.sleep, nights: _nightsArray(n9) } };
+ }
- function recoveryIndex(s) {
+ function recoveryIndex(s0) { const s = _sleepShaped(s0);
```
identically for `sleepAnchor` (`:1069`) and `bodyAlarmSignal` (`:1625`), and `nightsArrayOrRefuse` added to `sleep.cjs`'s export object (`:1957`). **Plus the boundary the register names** (`migrate.cjs`, top of `migrate` at `:2125`):
```js
+ const n22 = old && old.sleep ? old.sleep.nights : undefined;                     /* D22 — THE BOUNDARY */
+ if (n22 !== undefined && !Array.isArray(n22)) {
+   const arr22 = E.nightsArrayOrRefuse(n22);                                      /* refuses by name, never [] */
+   if (arr22.length !== Object.keys(n22).length) throw new TypeError("SLEEP_NIGHTS_SHAPE_UNRECOGNIZED");
+   old = { ...old, sleep: { ...old.sleep, nights: arr22 } };
+ }
```
The boundary hunk was executed separately: **it is a measured no-op on every gate and on all 45 laws** (`45 RED-frozen · 30 RED-candidate · 89 controls · 88/104 mutants · 0 HARNESS_ERROR`, identical to the package without it), because no existing fixture carries a non-array collection. It is in the package because the register requires it and because the readers alone leave the persisted shape unrepaired.

**Law** `E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash` (`laws-state-shape-and-failure.cjs:8`; `:10` asserts `recoveryIndex(keyed)` neither throws nor differs from `recoveryIndex(array)`). **RED on both engines** with the exact `TypeError` quoted above. **→ GREEN.**

**Delta cells.** `recoveryIndex_keyed_equals_array` `THROW` → `true`; `recoveryIndex_keyed_band` `THROW` → `"WATCH"`; `sleepAnchor_keyed` `THROW` → `true`; `bodyAlarmSignal_keyed` `THROW` → `true`; **`PURPOSE_eleven_keyed_nights_in_order`** (eleven nights, the last short) `THROW` → `[true, "WATCH"]` — this is the cell that pins RECORDED ORDER, because a lexicographic key sort puts `"10"` before `"2"`. **The fail-closed cells:** `LOSTFACT_sparse_indexed_refused` `{0,2}` → `THROW SLEEP_NIGHTS_SHAPE_UNRECOGNIZED`; `LOSTFACT_named_keys_refused` → same; `LOSTFACT_string_refused` (`nights: "[]"`) → same. **Must NOT change:** `NEG_array_identity` (the whole `recoveryIndex` return on an ordinary array state) byte-identical; `NEG_absent_nights` (`delete s.sleep.nights`) still reads without throwing.

**Named source mutants (4/4 CAUGHT).** (1) `empty-list-on-any-unrecognized-shape` (`throw` → `return []`) — **the register's own warning, made a mutant**; the law stays GREEN, and the only thing that kills it is the three LOSTFACT cells. (2) `accept-a-sparse-index-set` — killed by `LOSTFACT_sparse_indexed_refused` alone. (3) `normalize-only-the-named-law-reader` (drop `_sleepShaped` from `sleepAnchor`) — law GREEN, killed by `sleepAnchor_keyed`. (4) `order-the-index-by-string-key` — law GREEN, killed by `PURPOSE_eleven_keyed_nights_in_order`. **Three of the four are invisible to the v4 law**, which is why the delta-cell file is a required package artifact (§7).

---

### D44 — a phantom set removal is printed and charged

**Plain** (`:295`): "The app says it removed a set and spends the weekly change allowance even though the exercise still has the same one set." Register 293–301; BAR `:297` **untrue value or receipt the athlete sees**; LIVE `:298` NOT APPLICABLE; FIX `:300` "rebuild/engine/writers.cjs / sweepVolume / applyAgentProposal: Exclude one-set removal candidates and recheck the actual set delta at consent before emitting or charging a move… Directly changes which frozen VOLUME receipt is emitted… the current minimum-one-set rule remains."

**Current code** — `writers.cjs` (`00291236…`) `:2318–2319` inside `applyAgentProposal` (`:2282`). Register `:2292` re-pins to **`:2319`**:
```js
const ex7 = s.exercises.find((x) => x.id === ap.exId);
if (ex7) { ex7.sets = Math.max(1, (ex7.sets || 1) + ap.dir); ex7.setsAt = clock.nowISO();
  s.feed.unshift({ d: tISO, at: clock.nowISO(), t: `VOLUME ${ap.dir > 0 ? "+1" : "−1"} — ${ap.mg.toUpperCase()} via ${ex7.n} (now ${ex7.sets} sets)`, how: "…" }); }
```
With `sets = 1` and `dir = -1`, `Math.max(1, 0) === 1` — nothing changes, and the receipt still says `VOLUME −1 … (now 1 sets)`. Both downstream parsers then charge it: `volume.cjs:157–160` counts **any** feed row whose title begins `"VOLUME "` and contains `"via <ex.n>"` as a structural move (it never inspects the sign), and `progression.cjs:229–238` (`_volDeltas`) reads the signed magnitude.

**Owner semantics.** Batch A plain FIX (`DECISIONS.md:60`, "D44 APPROVED-FIX").

**Proposed behaviour.** At consent, the actual delta is recomputed against the minimum-one-set rule that is already in force. A clamped no-op emits **no `VOLUME` receipt at all** and charges nothing; the offer still closes and the athlete is told why, in the file's own existing offer-closing idiom (`"OFFER SUPERSEDED — "` `:2291`, `"OFFER EXPIRED AT THE TAP — "` `:2315`). A real removal and a real addition are untouched.

**Proposed hunk** (`writers.cjs`, immediately above `:2318`):
```js
+ /* D44 — the set delta is RE-CHECKED at consent against the minimum-one-set rule already in
+    force: a clamped no-op emits no VOLUME receipt and charges no structural move. */
+ if (ex7 && Math.max(1, (ex7.sets || 1) + ap.dir) === Math.max(1, ex7.sets || 1)) {
+   s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
+   s.feed.unshift({ d: tISO, t: "OFFER CLOSED — NO SET TO GIVE BACK — " + (ap.title || "VOLUME"),
+     how: `${ex7.n} is already at the one-set minimum, so there is nothing to give back. Nothing changed and no move was charged against this week's budget.` });
+   return s;
+ }
```
The title deliberately does **not** begin `"VOLUME "`: that is the exact needle `volume.cjs:158` tests, so the line is invisible to the budget, and `_volDeltas` skips it for want of a sign.

**Law** `V4-volume-receipt-requires-actual-change` (`laws-receipt-truth.cjs:88`; `:89` asserts `delta === reported && (delta !== 0 || budget === 0)` and the positive control `increased.sets === 3 && addition === 1 && budget === 1`). **RED on both engines:** `delta 0` vs `reported −1`, `budget 1`. **→ GREEN.**

**Delta cells.** `accept_feed_title` `"VOLUME −1 — CHEST via Synthetic press 0 (now 1 sets)"` → `"OFFER CLOSED — NO SET TO GIVE BACK — VOLUME −1 — CHEST via Synthetic press 0"`; `accept_volDeltas_sum` `−1` → `0`; `accept_budget_charged` `1` → `0`. **Must NOT change (measured identical both trees):** `offer_still_made` `true`; `accept_sets` `1`; `accept_offer_closed` `false` (the offer is consumed either way); **`NEG_real_removal_2to1` `[1, "VOLUME −1 — CHEST via Press two (now 1 sets)", 1, −1]`** — a genuine 2→1 removal still prints and charges exactly once, the load-bearing positive control; `NEG_addition_2to3` `[3, 1, 1]`; `NEG_reset_kind_untouched`.

**Named source mutants (3/3 CAUGHT).** (1) `clamped-no-op-still-prints-and-charges` — the register's own mutant; killed by the law and all three moved cells. (2) `close-silently-but-still-charge-the-budget` (keep the `VOLUME …` title on the no-op path) — killed identically; this is the mutant that proves the *title* is the load-bearing choice. (3) `refuse-every-removal` — law **GREEN**, killed only by `NEG_real_removal_2to1`.

**OBJECTION — the register's FIX clause 1 is unimplementable and would destroy D44's own law.** `:300` says "**Exclude one-set removal candidates** and recheck the actual set delta at consent". Executed: filtering one-set lifts out of `sweepVolume`'s `-1` candidate pool (`writers.cjs:1457–1461`) makes the pool empty, `if (!pick) return;` fires, `sweepVolume` returns `null`, and D44's law — whose precondition at `laws-receipt-truth.cjs:89` **requires** the one-set offer to exist (`if(!ap||…) throw Error('D44 actual one-set offer missing')`) — reports `HARNESS_ERROR: TypeError: Cannot read properties of null (reading 'agentProposals')`, not even RED. **B3 implements clause 2 only.** Clause 1 ("should a give-back even be offered on a one-set lift?") is a product-shaped question about the offer surface, not the receipt, and it is filed as PM question Q5 rather than smuggled in.

---

### D42 — undoing a break leaves its scale seal active

**Plain** (`:467`): "The app says a break was undone but keeps excluding weigh-ins because of that break, when undo should reverse both effects." Register 465–473; BAR `:469` **untrue value or receipt the athlete sees**; LIVE `:470` NOT APPLICABLE; FIX `:472` "Record the break's prior scale-seal effect and reverse that effect on undo **without overwriting a later independent seal**. Estimate 5 hours. Touches the effect behind the existing MOVE UNDONE receipt, not its wording."

**Current code** — `writers.cjs` (`00291236…`), `applyProposal` at `:2088`; the adjustment row is minted at `:2112` (`const row = { rid, id, d, at, title, nudge }`); the break arm at **`:2209–2221`** (register `:2188–2194` re-pinned) records the plan field and silently overwrites the seal:
```js
} else if (p.apply.kind === "break" && p.apply.start && p.apply.end) {
  row.planUndo = { field: "brk", prev: (s.plan && s.plan.brk) || null };
  _stampPlan(s, { brk: { start: p.apply.start, end: p.apply.end, planned: isoOf(todayStart()) } }, …);
  const dbA = dietBreakState(s);
  s.blackout = { until: isoOf(new Date(mk(p.apply.end).getTime() + 3 * DAY)) };
```
and `undoAdjustment` at **`:2378`** (register `:2381–2388`) restores only `planUndo` at `:2408` and `exUndo` at `:2412–2414`. `s.blackout` is the scale seal read at `sleep.cjs:1879` and `:1913` (`blackoutOn`).

**Owner semantics.** Batch A plain FIX (`DECISIONS.md:60`, "D42 APPROVED-FIX").

**Proposed behaviour.** The seal becomes a recorded, reversible effect of the decision, in the exact shape `planUndo`/`exUndo` already use — but the row records **both** the prior seal and the seal it set, so undo reverses only its own effect and leaves a later independent seal standing (`:472`'s condition, which `planUndo`'s one-field shape cannot express).

**Proposed hunks** (`writers.cjs:2221`, and above `:2412`):
```js
- s.blackout = { until: isoOf(new Date(mk(p.apply.end).getTime() + 3 * DAY)) };
+ /* D42 — the break's scale seal is a dated effect like the plan field: record the PRIOR seal and
+    the seal this decision SETS, so undo reverses exactly its own effect and never a later one. */
+ const seal42 = { until: isoOf(new Date(mk(p.apply.end).getTime() + 3 * DAY)) };
+ row.scaleUndo = { field: "blackout", prev: (s.blackout != null ? JSON.parse(JSON.stringify(s.blackout)) : null), set: JSON.parse(JSON.stringify(seal42)) };
+ s.blackout = seal42;
…
+ /* D42 — reverse the seal this decision set, and ONLY if it is still the seal in force */
+ if (a.scaleUndo && a.scaleUndo.field === "blackout" && JSON.stringify(s.blackout || null) === JSON.stringify(a.scaleUndo.set || null)) {
+   s.blackout = a.scaleUndo.prev == null ? null : JSON.parse(JSON.stringify(a.scaleUndo.prev));   /* explicit null, never delete */
+ }
  if (a.exUndo && a.exUndo.field === "sets") {
```
**`null`, never `delete`**, measured and deliberate: `mergeState` builds `out = { ...remote, ...local }` (`merge.cjs:859`), so an *absent* key on the undoing replica lets the other replica's stale seal win the merge, while an explicit `null` beats it.

**Law** `V4-break-undo-restores-scale-effect` (`laws-undo-half-effects.cjs:7`; `:8` asserts `JSON.stringify(undone.blackout) === JSON.stringify(s.blackout)` **and** that the subsequent read's `sealed` flag and `trend` match the never-broke state). **RED on both engines:** `blackout` stays `{"until":"2026-09-12"}` and the 2026-09-03 read comes back `sealed: true` where the unbroken state reads `false`. **→ GREEN.**

**Delta cells.** `blackout_after_undo` `{"until":"2026-09-12"}` → `{"until":"2026-08-01"}`; `read_sealed_after_undo` `[true, false, false]` → `[false, false, true]` (candidate sealed, control sealed, trends equal); `NEG_no_prior_blackout` `[true, {"until":"2026-09-12"}]` → `[true, null]`. **The condition cell:** `LATER_SEAL_not_clobbered` — a later independent seal (`{until:"2026-12-31"}`) written after the break survives the undo, **identical on both trees** (`{"until":"2026-12-31"}`). **Must NOT change:** `blackout_after_apply` `{"until":"2026-09-12"}`; `plan_brk_after_undo` `null`; `NEG_move_undone_receipt` `"MOVE UNDONE"` (the wording the register protects); `NEG_non_break_undo_leaves_seal` — a calorie-nudge undo touches no seal.

**Named source mutants (3/3 CAUGHT).** (1) `undo-plan-without-scale-seal` — the register's own mutant; killed by the law. (2) `restore-over-a-later-independent-seal` (drop the `=== set` guard) — law **GREEN**, killed only by `LATER_SEAL_not_clobbered`; this is the mutant that encodes `:472`'s condition. (3) `record-the-prior-seal-but-not-the-one-set` — killed by the law.

---

### D37 — a past earned increase is re-explained at a later merge clock · **the riskiest defect in B3**

**Plain** (`:159`): "The app changes the explanation of the same past earned increase when copies are combined on a later day; whether it should describe the past or today's interpretation is the owner's call." Register 157–165; BAR `:161` **untrue value or receipt the athlete sees**; LIVE `:162` NOT APPLICABLE; FIX `:164` "Pass the earned session's historical as-of date through every noise calculation used by a joint earn. Estimate 6 hours. **May change frozen earned-receipt numbers and whether a one-sighting earn qualifies; port reader goldens and merge writer fixtures need rechecking after the ruling.**"

**Binding owner semantics, verbatim (`DECISIONS.md:60`):**
> **D37 APPROVED-FIX — a merged earned receipt keeps the assessment as of the day it was earned, accepting that this can change whether a single-sighting increase counts as earned and the numbers printed on past earned receipts.**

**Current code.** `earnWalk` moved verbatim into `earn.cjs` (sha256 `4b883880…`) per `DECISIONS:85` (`PLAN…:54`); it receives the earned day and then discards it for every noise question:
```js
// earn.cjs:11-12
function earnWalk(s, ex, en, r, prevMeta, push, dEarn) {
  const grad9 = String(dEarn || (en && en.d) || "");
// earn.cjs:38
      const bn = beatsNoise(s, ex.id, r, (prevMeta && String(prevMeta.w) === String(en.w) && prevMeta.reps) || null);
// earn.cjs:78 (the EARNED receipt's own printed number) and earn.cjs:99 (the PROVISIONAL line)
        : `… One is inside your ±${(typicalError(s, ex.id).reps).toFixed(2)}-rep spread; two is not.`;
        const te = typicalError(s, ex.id);
```
and `progression.cjs` (sha256 `7031838d…`) `:593–594`:
```js
function beatsNoise(s, exId, reps, prev) {
  const te = typicalError(s, exId);
```
while `typicalError` at `progression.cjs:553–555` **already accepts an as-of and falls back to the wall clock**:
```js
function typicalError(s, exId, asOf) {
  const byId = {};
  const at9 = asOf || isoOf(todayStart());   /* v7.53.0 (b) — no date means "now", and now belongs to whichever era today is in */
```
with the era cut at `:563` `if (!sameEra(fkOf(id), d, at9)) continue;`. So the noise pool a *historical* earn is priced against is selected by the era **today** is in. `merge.cjs:1085` reaches it through `reconcileSightings` → `earnWalk`; `migrate.cjs:62,145` likewise (register `:160` cites `merge.cjs:1085`, `migrate.cjs:215–216,259`, `progression.cjs:444–449`).

**Proposed behaviour.** The earned session's own day is threaded through every noise calculation the joint earn consults — and nowhere else. `beatsNoise` gains an optional fifth parameter; a call without it is byte-identical to today.

**Proposed hunks** (`progression.cjs:593–594`, `earn.cjs:38,78,99`):
```js
- function beatsNoise(s, exId, reps, prev) {
-   const te = typicalError(s, exId);
+ function beatsNoise(s, exId, reps, prev, asOf) {
+   const te = typicalError(s, exId, asOf);   /* D37 — a dated earn is priced from the pool AS OF its own day */
…
- const bn = beatsNoise(s, ex.id, r, (…) || null);
+ const bn = beatsNoise(s, ex.id, r, (…) || null, grad9 || undefined);   /* D37 */
- … ±${(typicalError(s, ex.id).reps).toFixed(2)}-rep spread …
+ … ±${(typicalError(s, ex.id, grad9 || undefined).reps).toFixed(2)}-rep spread …
- const te = typicalError(s, ex.id);
+ const te = typicalError(s, ex.id, grad9 || undefined);   /* D37 */
```

**Law** `V4-merge-earned-receipt-historical-asof` (`laws-clock-and-as-of.cjs:130`; `:131` merges the same pair at wall days `2026-08-30` and `2026-09-03` and asserts the `SYNTHETIC PRESS 105 EARNED` row has the same `d` and the same `how`). **RED on both engines:** `how` reads `±5.01-rep spread` at the 08-30 clock and `±0.90-rep spread` at the 09-03 clock, because a `2026-09-01` technique fork puts the noise rows inside the pool at one clock and outside it at the other. **→ GREEN, at `±5.01` — the earned day's own number, at both clocks.**

**Delta cells.** `how_at_merge_0903` `±0.90` → `±5.01`; `how_at_merge_0830` **unchanged at `±5.01`** — the receipt stops moving and settles on the as-of-the-earn value, which is precisely what the owner ruled. `d_equal` unchanged. **The two purpose cells the law does not reach** (§ the mutant finding below): `PURPOSE_beatsNoise_asof_earnday` `[true, 3.6, 4]` → `[false, 19.8, 4]`; **`PURPOSE_earnWalk_one_sighting` `["SYNTHETIC PRESS 105 EARNED"]` → `["SYNTHETIC PRESS — TOP OF WINDOW, PROVISIONAL"]`** — the owner's own sentence made concrete: *"this can change whether a single-sighting increase counts as earned"*. **Must NOT change:** `NEG_earnWalk_two_sightings_unchanged` (a two-for-two earn is unaffected); `NEG_beatsNoise_no_asof_unchanged`; `NEG_typicalError_no_asof_is_today`.

**Named source mutants (3/3 CAUGHT).** (1) `wall-day-noise-in-historical-earn` — the register's own mutant; **law GREEN**, killed only by the two purpose cells. (2) `as-of-only-inside-beatsNoise` (the prose keeps the wall clock) — killed by the law. (3) `as-of-from-the-wall-clock-not-the-earned-day` — **law GREEN**, killed only by `PURPOSE_earnWalk_one_sighting`.

**FINDING — the `beatsNoise` half of the hunk has no detector in the register laws.** The law's fixture earns through `topRun >= 2`, so `bn.clear` is never the deciding value and the `beatsNoise` argument is unobserved. This is the B1-§A3 class ("a hunk resting on no committed cell"), and the same class the D8×D21 review blocker came from. **`rebuild/engine/test/b3-delta-cells.cjs` carrying the two D37 purpose cells is therefore a required package artifact, not an optional extra.**

**FINDING — D37 makes the merge's earn path CLOCK-FREE, and that moves `merge-differential`.** `rebuild/engine/test/merge-differential.cjs:212–224` runs a hostile dependency cut: the clock is trapped so any access throws, and the gate asserts the candidate matches the frozen engine and that the blocked clock **suppresses** the earn. Measured, base vs B3 candidate, on the same complete tree:

| assertion (`merge-differential.cjs`) | base | B3 candidate |
|---|---|---|
| ordinary-merge frames parity | SAME | SAME |
| `hostile dependency cut matches frozen behavior` (minted case, `:219`) | SAME | **DIFFERENT** |
| `mintedBlocked.accesses.includes('clock.today')` (`:225`) | **true** | **false** |
| `mintedBlocked.frozenAccess.includes('new Date()')` (`:226`) | true | true |
| `queue.some(q => q.newW === 105 && !q.done)` (`:227`) | **false** | **true** |
| `feed.some(f => f.t === 'SYNTHETIC PRESS 105 EARNED')` (`:228`) | **false** | **true** |

`accesses` becomes `[]`: passing the earned day removes `typicalError`'s `isoOf(todayStart())` read, so the merge no longer consults a clock on the earn path at all — which is the file's own stated principle for ordinary merges and `merge.cjs:911`'s "*Dated at the record's date: a merge has no clock*". **This is the approved repair, not a regression**, and the register's FIX line anticipates it (`:164`, "merge writer fixtures need rechecking after the ruling"). But the second row is a **frozen↔candidate equivalence that D37 deliberately breaks on this fixture**: it cannot be handled by an expectation substitution the way a string can. It needs a named reviewed successor with an explicit frozen-parity exception, and the gate's own summary line ("blocked access suppresses the earn in both engines", `:230`) becomes false for the candidate. **This is B3's single biggest acceptance risk and it is PM question Q1.**

---

### D38 — an accepted/declined trial is lost on merge

**Plain** (`:413`): "The app loses an accepted or declined trial when saved copies are combined, even though the receipt still says that decision was recorded." Register 411–419; BAR `:415` **lost fact; untrue value or receipt the athlete sees**; LIVE `:416` NOT APPLICABLE; FIX `:418` "Give trial decisions a stable semantic identity and preserve legacy writer-shaped decisions through union… **No existing receipt wording must change.**"

**Current code** — the two writers produce rows with neither `id` nor `d` (`writers.cjs` `00291236…` `:2324–2325` register `:2297–2298`, and `:2339` register `:2312`):
```js
const rec = ap.custom ? { custom: ap.custom, started: tISO } : { tplId: ap.tplId, started: tISO };
s.trials = [...(s.trials || []), rec];
…
s.trials = [...(s.trials || []), ap.custom ? { custom: ap.custom, declined: true } : { tplId: ap.tplId, declined: true }];
```
and the merge keys on exactly those two absent fields (`merge.cjs` sha256 `b69dd11f…` `:714`, register `:518–523`):
```js
events: (e) => e && (e.id || e.d + "|" + e.t), trials: (t) => t && (t.id || t.d),
```
`_unionBy`'s `add` at `:520` is `if (k == null) return;` — **a null key silently drops the row.** Measured on base: both writer-shaped rows vanish in **both** merge directions.

**Owner semantics.** Batch A plain FIX (`DECISIONS.md:60`, "D38 APPROVED-FIX").

**Proposed behaviour — B2's IDENTITY CONVENTION, applied unchanged.** Per `BRIEF-B2 v1.2 §2` (sha256 `24241aeb5bc53a621acd2373348b06b679911d6438cf31ce713eb5e9709c6370`): **C1** identity is the record id, never a name; **C2** a structured owner field decides terminally, and B2 states that "B3 … adds the writer half and must use this exact field name and this exact terminal semantics" — the field is **`id`** on the record itself; **C3** the legacy boundary is read from the producer, never guessed; **C4** complete, not heuristic; **C5** total and side-effect-free; **C6** one reader shape, C2 → C3 in that order. B3 adds the writer half and one reader fallback, and introduces **no second scheme**.

The identity is a pure function of the decision's own content — never the clock, never the device — so two replicas that record the same decision offline produce the same key and the merge keeps one row, not none.

**Proposed hunks** (`writers.cjs` above `:2282`, at `:2324`, at `:2339`; `merge.cjs` above `:707` and at `:714`):
```js
+ /* D38 — B2 C2, writer half: a trial decision carries a structured id derived from the decision's
+    OWN content (the trial's identity plus the word decided), never the clock or the device. */
+ function _trialId(t) {
+   if (!t || typeof t !== "object") return null;
+   const who9 = t.custom && t.custom.abId != null ? "c:" + String(t.custom.abId) : (t.tplId != null ? "p:" + String(t.tplId) : null);
+   if (who9 == null) return null;
+   return "trial_" + who9 + "_" + (t.declined ? "declined" : "started");
+ }
…
  const rec = ap.custom ? { custom: ap.custom, started: tISO } : { tplId: ap.tplId, started: tISO };
+ { const tid9 = _trialId(rec); if (tid9) rec.id = tid9; }   /* D38 — writers.cjs:2324 */
…
+ { const rec9 = ap.custom ? { custom: ap.custom, declined: true } : { tplId: ap.tplId, declined: true };
+   const tid9 = _trialId(rec9); if (tid9) rec9.id = tid9; s.trials = [...(s.trials || []), rec9]; }   /* :2339 */
```
```js
+ function _trialKey9(t) { …identical body… }              /* merge.cjs — the same function, read-side */
  const MERGE_ARR = {
    events: (e) => e && (e.id || e.d + "|" + e.t),
-   trials: (t) => t && (t.id || t.d),
+   /* D38 — C2 then C3: a structured id decides terminally; a legacy writer-shaped row with neither
+      id nor d is keyed by the SAME content-derived identity the writer now stamps. */
+   trials: (t) => (t && t.id != null ? String(t.id) : (t && t.d != null ? String(t.d) : _trialKey9(t))),
```

**Law** `V4-merge-preserves-written-trial-decisions` (`laws-merge-tie-identity.cjs:7`; `:8` writes an accepted and a declined trial with the REAL writers and requires each row, byte-for-byte, to survive a merge with an empty replica in **both** directions). **RED on both engines:** the row is absent in all four merges. **→ GREEN.**

**Delta cells.** `applyAgentProposal_row` gains `"id":"trial_c:synthetic-ab_started"`; `dismissAgentProposal_row` gains `"…_declined"`; all four `survives_AB`/`survives_BA` `false` → `true`; `accept_and_decline_both_survive` `0` → `2`; `NEG_idempotent_self_merge` `[0,false]` → `[1,true]`; `NEG_two_devices_same_decision_collapse` `[0,0]` → `[1,1]`. **The two purpose cells for the legacy half — the half Joe's real blob actually needs:** `PURPOSE_legacy_row_no_id_no_d_survives` `[0,0,false,false]` → `[2,2,true,true]`; `PURPOSE_legacy_row_meets_its_stamped_twin` `[0,0,true]` → `[1,1,true]` (a pre-id row and its newly stamped twin collapse to one, from both directions). **Must NOT change:** `NEG_legacy_dated_row_key` — a row carrying `d` still keys on `d`, base `1` = patched `1`. **No receipt wording changes anywhere** (`:418`'s condition): `"TRIAL STARTED — "` (`:2326`) and `"TRIAL PASSED — "` (`:2340`) are untouched.

**Named source mutants (4/4 CAUGHT).** (1) `trial-key-id-or-day-only` — the register's own mutant; **law GREEN once the writer half exists**, killed only by `PURPOSE_legacy_row_no_id_no_d_survives`. (2) `trial-id-from-the-clock` (fold `started` into the id) — law GREEN, killed by `NEG_two_devices_same_decision_collapse` and the twin cell. (3) `one-key-for-accept-and-decline` — law GREEN, killed by `accept_and_decline_both_survive` (2 → 1: a recorded refusal eats a recorded consent). (4) `drop-the-legacy-reader-fallback` — law GREEN, killed by the legacy purpose cell. **Three of the four are invisible to the law.**

---

### D39 — a declined offer reopens after merge

**Plain** (`:423`): "The app reopens the same declined offer after combining saved copies even though its receipt says the offer will stay quiet." Register 421–429; BAR `:425`; LIVE `:426` NOT APPLICABLE; FIX `:428` "Persist a dismissal fact keyed to the proposal and union that fact so the same offer stays closed… **Existing decline prose can remain**; … including later re-earned offers with distinct identities."

**Current code** — `dismissAgentProposal` at `writers.cjs` (`00291236…`) `:2333` (register `:2306–2317`) records **nothing** about the refusal; it only filters the live list at `:2342`:
```js
s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
```
and `merge.cjs:715` (register `:715`) unions `agentProposals` by id, so a stale replica that still holds the card restores it. Measured on base: `["synthetic-volume","unrelated-reset"]` from one direction and `["unrelated-reset","synthetic-volume"]` from the other — reopened both ways.

**Owner semantics.** Batch A plain FIX (`DECISIONS.md:60`, "D39 APPROVED-FIX").

**Proposed behaviour.** The refusal becomes a monotone, unionable, value-independent FACT keyed to the proposal's own id — the attestation pattern this codebase already uses for the suggestion undo (`writers.cjs:2398–2406`, "`sugundo:` … value-independent, unionable, feedop-guarded by presence"). The merge unions the facts and closes the offers they name, from either direction. A later re-earned offer carries a different id (`"vol" + mg + clock.nowMs()`, `:1486`, `:1496`) and is untouched.

**Proposed hunks** (`writers.cjs:2334`, `merge.cjs` before `:882`):
```js
  function dismissAgentProposal(state, ap, tISO) {
    const s = JSON.parse(JSON.stringify(state));
+   /* D39 — the refusal is a FACT keyed to the proposal, not the absence of a row. */
+   if (ap && ap.id != null && !(s.offerDismissals || []).some((x) => x && String(x.id) === String(ap.id))) {
+     s.offerDismissals = [...(s.offerDismissals || []), { id: String(ap.id), d: tISO }];
+   }
```
```js
+ /* D39 — unioned HERE, not through MERGE_ARR: a state that has never dismissed an offer must not
+    grow an empty array on every merge (a shape change in every migrate/merge golden). */
+ if (Array.isArray(remote.offerDismissals) || Array.isArray(local.offerDismissals)) {
+   out.offerDismissals = _unionBy(remote.offerDismissals, local.offerDismissals, (x) => x && x.id != null && String(x.id));
+ }
+ if (Array.isArray(out.offerDismissals) && out.offerDismissals.length && Array.isArray(out.agentProposals)) {
+   const dis9 = new Set(out.offerDismissals.map((x) => x && String(x.id)));
+   out.agentProposals = out.agentProposals.filter((p) => !(p && dis9.has(String(p.id))));
+ }
```
The "not through `MERGE_ARR`" half is a **measured correction**: routing the new key through the table made `_unionBy(undefined, undefined, …)` mint `offerDismissals: []` on **every** merge of two states that never dismissed anything — a state-shape change in every migrate/merge golden and in the port oracle. The guarded form leaves such states byte-identical (cell `NEG_no_dismissal_no_change` is identical on both trees under the final hunk).

**Law** `V4-merge-preserves-offer-dismissal` (`laws-merge-tie-identity.cjs:17`; `:18` requires the dismissed offer gone and the unrelated one present in **both** directions). **RED on both engines.** **→ GREEN.**

**Delta cells.** `dismissed_stays_closed_AB` `["synthetic-volume","unrelated-reset"]` → `["unrelated-reset"]`; `…_BA` `["unrelated-reset","synthetic-volume"]` → `["unrelated-reset"]`; `tombstone_row` `null` → `[{"id":"synthetic-volume","d":"2026-08-30"}]`; `NEG_reearned_distinct_id_survives` → `["unrelated-reset","synthetic-volume-2"]`; `NEG_idempotent` `[[…],0]` → `[[…],1]`. **Must NOT change:** `NEG_no_dismissal_no_change` (identical); the decline prose `"VOLUME PASSED — <MG>"` (`:2335`) and `"TRIAL PASSED — "` (`:2340`) untouched, per `:428`.

**Named source mutants (3/3 CAUGHT).** (1) `union-stale-offer-without-decision` — the register's own mutant; killed by the law. (2) `suppress-by-muscle-group-not-by-proposal` — **law GREEN**, killed only by `NEG_reearned_distinct_id_survives`; this is the mutant that encodes `:428`'s "later re-earned offers with distinct identities" condition, and it is also the one that would violate B2's **C4** (no fuzzy widening). (3) `tombstone-written-but-not-unioned` — killed by the law in one direction only, and by `dismissed_stays_closed_BA`.

---

### D40 — same-day calorie entries depend on merge direction

**Plain** (`:433`): "The app keeps different calorie entries depending on which saved copy is combined first; which entry should win is the owner's call." Register 431–439; BAR `:435` **lost fact**; LIVE `:436` NOT APPLICABLE (needs two replicas); FIX `:438` "Implement the owner's chosen same-day authority and deterministic tie rule for daily entries while **retaining enough conflict evidence to explain the selection**… May change athlete-visible calorie values and downstream reader goldens."

**Binding owner semantics, verbatim (`DECISIONS.md:60`):**
> **D40 APPROVED-FIX — when two phones disagree on a day's calories with equal detail, ONE deterministic shared winner is chosen with the conflict kept visible and BOTH original entries retained; the exact tie-break rule and how the conflict is shown are NOT decided here and must be specified in the reviewed fix brief before anything is built.**

**Current code** — `merge.cjs` (sha256 `b69dd11f…`) `:15–16`, `:725`, `:884` (register `:16,525–529,725,884`):
```js
function _mergeScore(v) { try { if (v && Array.isArray(v.entries)) { … } return JSON.stringify(v).length; } catch (e) { return 0; } }
function _richer(x, y) { return _mergeScore(y) >= _mergeScore(x) ? y : x; }   // ties -> local (y)
…
const MERGE_OBJ = ["dailyLogs", "sessionLog", "dayCtx", "labSeen"];
…
for (const k of MERGE_OBJ) out[k] = _unionObj(remote[k], local[k], k === "sessionLog" ? _mergeSession : _richer);
```
The comment says it: on an exact score tie the **argument position** decides. Measured on base: `{cal:2000}` vs `{cal:2100}` gives `{cal:2000}` one way and `{cal:2100}` the other.

**§3 below is the full proposal and the single owner question.**

**Law** `V4-daily-conflict-direction-independent` (`laws-merge-tie-identity.cjs:27`; `:28` asserts `JSON.stringify(ab.dailyLogs) === JSON.stringify(ba.dailyLogs)`). **RED on both engines.** **→ GREEN.**

---

## 3. THE D40 PROPOSAL — one deterministic shared winner, the conflict visible, both originals retained

The owner left three things to this brief: the tie-break rule, how the conflict is shown, and nothing else. Each is answered from the engine's own already-ruled precedent rather than invented.

### 3.1 The tie-break rule — **the canonically greater record wins, on `_canonJ`**

Two obvious candidates were considered and rejected on evidence:
- **"lexicographically smaller device id wins"** — rejected: **no device id exists on a `dailyLogs` day record**, and the register's own owner question (`:439`) is explicitly about "**unstamped** equal-authority entries". The rule would require a new per-write field on every day record and a schema migration, and it would still answer nothing for the years of rows already on Joe's blob.
- **"earlier wall-clock wins"** — rejected for the same reason plus one more: day records carry no `at`, and `merge.cjs:911` states the governing principle for this file — "*a merge has no clock*". D37 spends its whole hunk **removing** the merge's last clock dependency (§2 D37); D40 must not put one back.

**The rule proposed is the engine's own, already ruled and already executed for exactly this problem.** `merge.cjs:474` and `:509–512` record FIX-13 and FIX-14 (Sol): the *session* merge had the identical direction-dependence, and the answer was a canonical total order, with the reasoning quoted verbatim at `:499–501` — "*`_tieKey` is a total order on exactly the fields the pick decides, so it is associative and commutative*" — and at `:504–508` — "*`">= ? x : y"` answered by ARGUMENT position … A stable canonical order on the BODY is a function of the two records*". `_readPick` at `:23–29` does the same for reads, under the SCALE-4 note at `:861–869`: "*CLASS first …, then record length …, then the canonical byte tie — transitive, so the day's read is the same from every grouping and every direction*". `dailyLogs` is the one collection that was left on argument position.

**So: richer still wins (unchanged); on an exact tie the record whose `_canonJ` sorts GREATER wins.** `_canonJ` (`merge.cjs:234–237`) is already the file's canonical serializer — key-order-free, total, and used by the feed dedup at `:896`, the multi-union key at `:724` and the read tie at `:28`. Transitive, commutative, associative, device-free, clock-free, schema-free, and it needs nothing that is not already on the record.

### 3.2 How the conflict is shown — **a conflict set on the day, projected into one op-keyed receipt**

"Both originals retained" cannot live only in prose: a later merge re-projects receipts from the record, so if the originals are not ON the record they cannot be re-derived. The shape is the one `merge.cjs:900–927` already uses for a carve — "*A CARVE IS TOLD, NOT SWALLOWED, TOLD TRUTHFULLY, AND TOLD ONCE FROM THE RECORD … every existing "carve:<date>" line is removed, and exactly one is written back if the record still has a dropped set … Dated at the record's date: a merge has no clock*".

1. The winning day record carries `conflict: [ …distinct canonical variants, sorted… ]` — **a set union, so it is idempotent and associative**, and it never shrinks until the athlete settles the day.
2. `conflict` is **merge provenance, not athlete data**: it is stripped before scoring and before the canonical comparison, exactly as `_tieKey` strips `entries/skipped/corrLog/dropped` at `:231–232` ("*dropped is merge provenance, not athlete metadata — a key that includes it changes with the grouping*"). Without this the evidence a merge adds changes who wins the next merge.
3. Exactly one `dayconflict:<date>` feed line is projected from that set per merge, dated at the day itself, removed and rewritten every time — so it is direction-free, self-healing, and disappears when the athlete corrects the day.
4. **A conflict is recorded only on an equal-detail tie.** Where one side is strictly richer, today's rule already gives a direction-free answer and nothing is minted — an ordinary sync in which one phone simply knows more is not a disagreement the athlete must settle. (This was a measured correction: the first draft minted a conflict on every richer-wins sync.)

**Proposed hunks** (`merge.cjs`, above `:725`; at `:884`; before `:928`):
```js
+ const _dayBare = (v) => { if (!v || typeof v !== "object" || Array.isArray(v) || !("conflict" in v)) return v; const { conflict, ...rest } = v; return rest; };
+ const _dayScore = (v) => _mergeScore(_dayBare(v));
+ const _dayConflictSet = (x, y, carryOnly) => {   /* carryOnly: never DROP evidence, but mint none */
+   const seen9 = new Map(), take9 = (v) => { if (v == null) return; const k9 = _canonJ(_dayBare(v)); if (!seen9.has(k9)) seen9.set(k9, JSON.parse(k9)); };
+   for (const v of [x, y]) { if (!carryOnly) take9(v); for (const c9 of (v && Array.isArray(v.conflict) ? v.conflict : [])) take9(c9); }
+   return [...seen9.keys()].sort().map((k9) => seen9.get(k9));
+ };
+ const _dayPick = (x, y) => {
+   const bx9 = _dayBare(x), by9 = _dayBare(y);
+   const kx9 = _canonJ(bx9), ky9 = _canonJ(by9);
+   const sx9 = _dayScore(x), sy9 = _dayScore(y);
+   if (sx9 !== sy9) { const w8 = sx9 > sy9 ? bx9 : by9, c8 = _dayConflictSet(x, y, true); return c8.length > 1 ? { ...w8, conflict: c8 } : w8; }
+   if (kx9 === ky9) { const c7 = _dayConflictSet(x, y, true); return c7.length > 1 ? { ...bx9, conflict: c7 } : bx9; }
+   return { ...(kx9 > ky9 ? bx9 : by9), conflict: _dayConflictSet(x, y) };
+ };
- for (const k of MERGE_OBJ) out[k] = _unionObj(remote[k], local[k], k === "sessionLog" ? _mergeSession : _richer);
+ for (const k of MERGE_OBJ) out[k] = _unionObj(remote[k], local[k], k === "sessionLog" ? _mergeSession : (k === "dailyLogs" ? _dayPick : _richer));
+ /* …one dayconflict:<date> line projected from the record, exactly as the carve block at :913-927… */
```
**`_dayBare` returns the record ITSELF when it carries no conflict.** This is not cosmetic: `merge-differential` pins the merge's structural sharing in an alias table, and returning a copy on the ordinary path broke `$/result/dailyLogs/<d>` ≡ `$/inputs/1/dailyLogs/<d>`. With the identity form, **that gate stops moving for D40 entirely** (measured; the only residual `merge-differential` movement is D37's, §2).

### 3.3 Measured properties

| property | base | B3 |
|---|---|---|
| `{cal:2000}` ↔ `{cal:2100}`, both directions | `{cal:2000}` / `{cal:2100}` — **direction-dependent** | `{cal:2100, conflict:[{cal:2000},{cal:2100}]}` both ways |
| conflict receipt | none | 1 `dayconflict:2026-08-30` line, both directions |
| **associativity** (3 replicas, `(A+B)+C` vs `A+(B+C)`) | equal (by accident — both dropped to `{cal:2000}`) | equal: `{cal:2200, conflict:[2000,2100,2200]}` |
| **idempotence** (re-merge the merged state) | equal | equal, and still exactly one receipt |
| re-settle after the athlete corrects the day to `{cal:2050}` | — | `{cal:2050}`, **0 receipts** — the evidence retires with the disagreement |
| richer side wins | unchanged | unchanged, **and no conflict minted** |
| identical days | unchanged | unchanged, no conflict |
| one-sided day | unchanged | unchanged |
| `dayCtx`, `labSeen`, `sessionLog` paths | — | **unchanged** (`_richer`/`_mergeSession` as before) |
| `rebuild/engine/test/merge-laws.cjs` (`convergence, associativity, idempotence, merge-fixed-point, keyless-max-multiset, …`) | PASS | **PASS** |

The receipt reads: *"Two saved copies recorded different numbers for this day and neither is more detailed than the other, so the app picks the same one from either direction and keeps both on the record: {"cal":2000} / {"cal":2100}. Kept: {"cal":2100}. Correct the day to settle it."* (The wording is the brief's proposal and is the PM's to edit; the mechanism is what needs ratifying.)

**Named source mutants (4/4 CAUGHT).** (1) `equal-richness-local-wins` — the register's own mutant; killed by the law and four cells. (2) `tie-by-argument-order-inside-the-new-pick` — killed identically. (3) `score-the-record-with-its-own-conflict-evidence` — **law GREEN**, killed only by `ASSOC_three_replicas`; this is §3.2(2) made a mutant. (4) `winner-kept-originals-dropped` — law GREEN (direction-independence alone does not need the originals), killed by four cells; this is the mutant that encodes the owner's "BOTH original entries retained".

### 3.4 **THE OWNER QUESTION — one line, and the only one in this package**

> **D40 — when two phones disagree on a day's calories with equal detail, is it right that the app keeps the entry that sorts higher in its own canonical order (so the same one wins from either phone, using the same tie rule the app already uses for sessions and weigh-ins), shows both numbers on a "two copies disagreed on <date>" line, and keeps both on the record until you correct the day?**

Nothing else in B3 needs the owner. Everything else at `DECISIONS.md:60` is either a plain Batch A FIX or, for D37, a Batch B rule already fully specified there. Per `PLAN…:153` the recommendation stands: **do not block B3's other eight defects on the answer** — D40's three hunks are confined to `merge.cjs` and can be lifted into a successor package if the answer is slow, at the cost of one re-pin of `merge.cjs`'s post-image sha.

---

## 4. Ordering, and the interactions to prove rather than assume

The plan's order (`PLAN…:95`) holds and the rationale is confirmed by execution: **D45 → D36** are the two cheap receipt/string repairs and touch nothing else; **D22** is the shape normalization at the migrate boundary that every later reader depends on; **D44 → D42** are the two writer-effect repairs; **D37** changes the historical as-of through `earnWalk`; **D38 → D39 → D40** all edit `merge.cjs` and must not race each other.

Corrections and interactions, each measured:
- **D22 → D37/D38/D39/D40 is real but weaker than "every later reader depends on it".** No merge fixture carries a numeric-keyed collection, so D22 is a measured no-op on every gate. It goes early because its *boundary* hunk must be in place before the port (§6), not because the merge repairs need it.
- **D37 × D38/D39/D40 — none.** D37 changes `earn.cjs`/`progression.cjs`; the three merge repairs change `merge.cjs`'s tables and `mergeState`. Measured: all nine laws GREEN with the full package applied and exactly nine law rows move.
- **D38 × D39.** Both add to `MERGE_ARR`/`mergeState` and D39's union is deliberately placed **outside** the table (§2 D39). Pin one case where a trial decision and an offer dismissal cross in the same merge.
- **D40 × `_richer`.** `_richer` is the default pick for `_unionBy` (`:528`) and for `dayCtx`/`labSeen`; **B3 does not change `_richer`.** `dailyLogs` gets its own pick, exactly as `sessionLog` already has `_mergeSession`. Cell `NEG_dayCtx_still_richer` pins it.
- **D44 × D18 (B2).** D18 removes the 80-row slice at `volume.cjs:157`, inside the exact range D44's budget assertion reads (`:154–160`). D44 asserts `budget === 0`; with the cap lifted the same assertion is *stronger*, not weaker. **B3 must re-run D44's law on B2's post-image**, not on this tree's.
- **D37/D44 × `_volDeltas` (B2 D3).** B2's D3 rewrites `progression.cjs:231`'s owner test; D44's `_volDeltas` sum cell reads it. The cell values above were measured pre-B2 and **must be re-measured on B2's post-image**.

---

## 5. Golden, receipt and gate surfaces — and how each is re-pinned

**The three frozen receipt strings B3 changes, all named by their register FIX lines:**
1. **D45** — the analyst prompt at `writers.cjs:2490` (`:484` "Changes a frozen analyst prompt string but no athlete receipt directly; `askContext` is not a port-oracle reader surface, and no analyst-service output is asserted"). Measured: no gate moves.
2. **D36** — the `patch60:curlgrad` receipt at `migrate.cjs:1295` (`:290` "Directly touches a frozen receipt string and may affect RAW migration output goldens; committed pins must change only in the later authorized fix tranche"). Measured: `migrate-differential` is **token-identical** on base and candidate (the only difference in its output is the absolute path), and the printed number for the **live** `55·55·50` preimage is unchanged at `60·60·55`.
3. **D44** — the `VOLUME ±1 …` receipt at `writers.cjs:2319` (`:300` "Directly changes which frozen VOLUME receipt is emitted"). Measured: the receipt is not reworded; it is **withheld** on the no-op path and byte-identical on every real change.

Plus **D37's printed number**, which the owner's own words authorise ("*and the numbers printed on past earned receipts*").

**Gate movement, measured by running each gate on a complete unpatched copy and a complete patched copy of the same tree** (both with `TZ=America/New_York MEASURED_TEST_NOW=2026-09-03` and the frozen bundle):

| gate (`postfix/run.cjs:9–23`) | unpatched | B3 | disposition |
|---|---|---|---|
| `witnesses-1`, `witnesses-3`, `witnesses-4` | PASS | **PASS** | unchanged |
| `merge-laws` | PASS | **PASS** | unchanged — convergence/associativity/idempotence hold under D40 |
| `migrate-differential` | FAIL (pre-existing, `migrate exit v61`) | FAIL, **token-identical** | pre-existing, not a B3 delta |
| `witnesses-2`, `witnesses-5`, `witnesses-7`, `migrate-source`, `merge-source`, `writers-source`, `writers-differential` | FAIL | FAIL, identically | pre-existing at the tip (B1 §3 and B2 §4 record the same) |
| **`witnesses-6`** | PASS | **FAIL** | **carrier successor — one substitution** |
| **`merge-differential`** | PASS | **FAIL** | **carrier successor — four assertions + one summary line** |
| `second-gate`, `conformance`, `selftest`, `strict`, `migrate-full` | not run here | — | PM's PC (§7) |

**`witnesses-6`** fails on exactly one fact: its D37 case asserts exact frozen↔candidate whole-state parity, and the only differing bytes are `±0.90-rep spread` → `±5.01-rep spread` in the `SYNTHETIC PRESS 105 EARNED` receipt. One `exactReplace` substitution.

**`merge-differential`** is the hard one and is not a substitution — see §2 D37.

**How the re-pin is done: never in place.** Each witness file's sha256 is a pinned carrier input (`legacy-carriers.cjs ORIGINAL_PINS`; `legacy-step-efficacy-carriers.cjs:9 WITNESS_PIN = '833db043…'`, the exact sha of `defect-witnesses-2.cjs`), so editing a byte fails `STEP-WITNESS-ORIGINAL-PIN`. The established mechanism is in-memory expectation substitution by a named successor child with the file left byte-identical (`legacy-step-efficacy-carriers.cjs:17–18`, `parent.exactReplace(source, '<old>', '<new>', '<edit id>', edits)`), and the accepted parent routes such a gate away from bare execution through `coverage.covered` + `coverage.byChild` (`acceptance-native-carriers.json`; `native-carriers-package.cjs:76–81` enforces "a gate is either covered or run, never both"). **So B3 authors `rebuild/conform/v4/postfix/legacy-b3-carriers.cjs`** as the closed successor, adding `defect-witnesses-6.cjs` (`71a5fa27293b6e7837ec627b273b266db9d6c4987ff850fb6fe9e2a5f86092c4`) and `merge-differential.cjs` to `CARRIER_IDS` with those original sha256s as new pins, and moves `witnesses-6` and `merge-differential` from `coverage.run` to `coverage.covered` with `byChild` naming a `rebuild/m4/spec/b3-inherited-carriers.cjs`. The witness/differential files stay byte-identical. **Frozen tools and goldens (`rebuild/conform/goldens`, `tools/engine-test.jsx`) are NOT re-pinned by B3**: per `DECISIONS:82`'s condition an executed difference at a protected surface is "a RED stop for a reviewed successor cell, never a golden regeneration".

**The golden budget B1 hands B3, cited and re-pinned.** `BRIEF-B1 v1.2 §0.1 item 12` and `§6 Q4` record that D10's `weeksBetween` repair changes behaviour in B3's own files through the `< 1` weekly-window predicate — measured `weeksBetween('2026-03-02','2026-03-09') = 0.994047619047619 < 1` flips `true → false` in the spring-forward week. **Confirmed on `8205b7f`, four sites, re-pinned:**
`migrate.cjs:301` and `:1203` (`… r.d >= w.wk && weeksBetween(w.wk, r.d) < 1`), `writers.cjs:1587` (`… weeksBetween(monday, r.d) >= 0 && weeksBetween(monday, r.d) < 1`, was `:1560`) and `writers.cjs:2432` (`… x.d >= monday && weeksBetween(monday, x.d) < 1`, was `:2405`).

B1 edits none of them and enumerates them as delta cells; **B3 owns both files and must budget their goldens.** Concretely: if B1 merges before B3, B3's pre-image sha256 for `migrate.cjs` and `writers.cjs` are re-taken at B1's accepted head and B3's `migrate-*` / `writers-*` gate expectations are measured against post-B1 behaviour. If B3 merges first, B1 inherits the same obligation. **This is PM question Q3.**

**Protected surfaces, verdict-only, expected UNCHANGED:** the P6 second-gate cells `tools/engine-test.jsx:8790–8793`; the seeded set-one laboratory card (`sleep.cjs:1141` `labAnalytics2`); `rebuild/conform/goldens`; the frozen app `fe516c1:src/app.jsx`. B3 touches no `volume.cjs`, `today.cjs` or `policy.cjs` byte, so no B3 hunk is on the `setOneRead` or `progressionTrend` path. Proved by execution on the PM's PC, reported as a verdict with no cell values, hashes or prose.

---

## 6. Shared surfaces — with B2, and with Track C's C2 port

**With B2 (B2 goes first, `PLAN…:91`; `BRIEF-B2 v1.2 §3`).**
- `progression.cjs:225–241` `_volDeltas` — B2's D3 rewrites its owner test; B3's D44 asserts over it. B3 changes **no byte** of `_volDeltas`.
- `progression.cjs:608` `_deriveSightingFull` — B2's D4 rewrites it; B3's D37 reads the same sighting derivation through `earnWalk`. B3 changes no byte of it.
- `progression.cjs:593–594` `beatsNoise` — **B3's only `progression.cjs` hunk.** B2's enumerated `progression.cjs` hunks are `targetsFor`, `loadRungs`, `parseRungs`, `deloadLoad`, `progressAnchor`, `liftTrend`, `_volDeltas`, `_deriveSightingFull` (`BRIEF-B2 v1.2 §6.6`) — `beatsNoise` is not among them, so the two packages share the file but not a line. B3 still rebases onto B2's post-image and re-takes `7031838d…`.
- `volume.cjs:154–160` — B2's D18 removes the 80-row cap at `:157`; B3's D44 budget assertion reads the range. B3 changes no byte of `volume.cjs`.
- **The identity convention is reused, not re-invented.** B3's D38/D39 implement B2's **C2 writer half** with B2's stated field semantics (a structured id decides terminally) and B2's **C3 legacy boundary** read from the producer's own recorded fields, with `===` comparison and no substring, prefix, fuzzy or case-insensitive widening (**C4**), total and side-effect-free (**C5**), one reader shape C2→C3 (**C6**). D37 and D44 consume C1–C5 unchanged and add nothing. **B3 introduces no second identity scheme, no per-set immutable-id model and no name-normalisation pass**, exactly as `BRIEF-B2 v1.2 §2 C6` requires. The one place B3 extends the convention is that the trial identity is derived from *content*, never the clock or device — necessary for offline convergence, and consistent with C1 (identity is the record's, not the session's).
- If the PM answered B2's **Q2** "inside B2", B3 finds `volume.cjs:159` already converted and asserts it unchanged; if Q2 was carried to B3, it becomes a tenth B3 hunk and D44's cells are re-measured. **PM question Q4.**

**With Track C's C2 port (`PLAN-SLICE-v1.md:10,25`, `LANES.md:10`).** C2 is "Joe's port script on the PC (migrate → merge → verify 10/10 port-oracle on the real blob)". **Six of B3's nine defects are on exactly that path** — D22 (the migrate boundary), D36 (a migration receipt), D37 (the merge's earn receipts and whether a one-sighting earn qualifies), D38 (trials through the merge), D39 (a new top-level `offerDismissals` key), D40 (a new `conflict` field on day records). D38's legacy reader half and D22's boundary exist *specifically* for rows Joe's real blob already holds. **Therefore: migrate → merge → port-oracle must be re-run after B3 merges, or C2 must be scheduled after B3.** Two specific obligations for C2:
1. `offerDismissals` and `dailyLogs[d].conflict` are **new state keys**. The port oracle's 10/10 expectation must be re-derived, and B3's hunks are written so that a state that never dismissed an offer and never had a day conflict grows **neither** key (measured, §2 D39; §3.2(4)).
2. D37 changes the numbers on **past** earned receipts in the ported history. That is the owner's ruling, not a regression, but the port oracle will see it. **PM question Q2.**

---

## 7. Acceptance bar for B3 — `PLAN…§3 (:121–132)` made specific

1. **Brief** — this document, accepted by the PM as a `rebuild/DECISIONS.md` ledger line before implementation, naming its path, byte count and sha256 and recording the conditions below, exactly as `DECISIONS:85` did for LOAD-WRITES. **Plus the owner's answer to §3.4, or the PM's explicit decision to carry D40 to a successor package.**
2. **Artifact** `rebuild/m4/spec/acceptance-b3-merge-receipts-sync.json`, bound by sha256, raw bytes byte-equal to `JSON.stringify(parsed,null,2)+'\n'`, duplicate-key pre-parser and closed schema, verified from Git at its reviewed commit and byte-identical on disk. `authorizations { owner = DECISIONS:60, contract = DECISIONS:49, theme = this brief's accepting ledger line by sha256, review = {prefix: "POSTFIX-ACCEPTANCE M2-B3-MERGE-RECEIPTS-SYNC", terminal: "ACCEPTED"} }`; `PENDING` iff the review receipt is null. **Parent: the accepted B4 artifact under Option A, the accepted B2 artifact under Option B (header).** Runner `rebuild/m4/spec/b3-package.cjs`, shaped like the accepted `native-carriers-package.cjs` — **`--full` or `--ci`, no third mode**, `assert(args.length===1&&['--full','--ci'].includes(args[0]))`, wrapping the immutable `rebuild/conform/v4/postfix/run.cjs`, never forking it. `product` must supersede the parent's pins for `writers.cjs`, `progression.cjs` (and `sleep.cjs`) and **introduce** `merge.cjs`, `migrate.cjs` and `earn.cjs`, which the NATIVE-CARRIERS parent does not pin.
3. **Required package artifacts, named:** `rebuild/conform/v4/postfix/legacy-b3-carriers.cjs` (§5) and **`rebuild/engine/test/b3-delta-cells.cjs`** — the latter is not optional: eleven of the thirty named source mutants are invisible to every v4 law and are killed **only** by cells in that file (D22 3/4, D37 2/3, D38 3/4, D39 1/3, D40 2/4, D42 1/3, D44 1/3).
4. **What the FULL run must show.** All 45 laws executed: **D45, D36, D22, D44, D42, D37, D38, D39, D40 GREEN on the candidate and RED on the frozen engine**; the accepted D12/D33/D34/D35/D41/D43 carried GREEN; the remaining 30 still raw RED with approved preservation deltas only (`BRIEF-IMPORT-GUARDS.md:87`). Measured here: exactly nine rows move, thirty-six byte-identical, `45 RED-frozen · 30 RED-candidate · 89 GREEN controls · 88/104 mutants · 0 HARNESS_ERROR`. All 19 gates OBSERVED/PASS with `witnesses-6` and `merge-differential` carried by the named successor child and the eight pre-existing failures carried as they are today — **B3 must not "fix" any of them and must not expect a bare PASS**. **Second gate** `second-gate.mjs --candidate` = `SECOND GATE candidate: PASS` under the accepted D12 custody, all 3,072 assertions, with engine/sync/surface accounting; B2 records that on this tree the candidate side aborts at `tools/engine-test.jsx:106` so only 261 assertions are observable without that custody, and any movement in the remaining ~2,811 is a RED stop. **Own bites:** one disclosed source bite quoting its RED line, then exact byte/sha restoration and a restored-GREEN direct gate, plus one unlisted receipt/input-field delta bite proving the comparator fails closed (`:88`). **Real fault mutants:** the **30 named in §2/§3**, mutated in disposable candidate copies in fresh processes — measured **30/30 CAUGHT, 0 NOT CAUGHT, 0 NO-APPLY**; "a source-pin refusal, syntax error, missing target or timeout earns no kill" (same line), and the register laws' own mutants are inert post-repair (§1) and are **not** counted. **Fidelity diff:** no source change outside §2/§3's 26 enumerated hunks in 6 files; `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/lanes/*`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md`.
5. **Cloud `--ci` vs the owner's PC `--full`.** **Cloud, both OS (`--ci`, "explicitly public evidence only"):** focused tests, review controls, browser package, profile refusals, source carriers, traces, direct, inherited carriers, witnesses, legacy differential, second gate. Everything in this brief was produced there. **PC only (`--full`):** anything reaching `rebuild/conform/private/live.json` — `run.cjs:115–117` hard-requires it and the private `live.main` golden for `migrate-full`, failing `REQUIRED-PRIVATE-PREPARATION-MISSING` without them; therefore the three-blob oracle in both Date modes, **the private LIVE predicate re-evaluation for D45** (B3's only LIVE-TRIGGERED defect, register `:482`), and every `POSTFIX PACKAGE PASS` are the PM's own execution (`DECISIONS:92`; `:93` C4). **Verdict-only reporting: no private values, counts, hashes or prose in any report** (`BRIEF-IMPORT-GUARDS.md:89,103`). D45's census change is anticipated and is a *prompt* string, not an athlete receipt; **D36's is anticipated to be nil** (the live `55·55·50` preimage still prints `60·60·55`, measured); a census change on any of the other seven is a RED stop for a reviewed successor cell, never a golden regeneration.
6. **Receipt then authorized rerun.** PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word; the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and re-runs the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0 (executed that way at `DECISIONS:86–87` and `:95–96`).

**Conditions carried into implementation, in the shape of `DECISIONS:82`'s.** **(C1)** D45's law can never reach frames parity on this tree — the accepted D12 repair shows through `askContext`'s rendered text (§1); B3 reports D45 as `RED-frozen / GREEN-candidate` with parity explicitly excluded, and never "fixes" the step-efficacy line. **(C2)** The register laws' own mutants are inert on a repaired source (97→88 detections, exactly the nine); only the 30 named source mutants count. **(C3)** `merge-differential`'s minted-blocked case loses frozen↔candidate parity **by design** under D37 (§2); it needs a reviewed successor with an explicit parity exception, not a substitution, and the gate's summary sentence must be re-worded in the successor, never in the file. **(C4)** D44's register FIX clause 1 is not implemented (§2 D44, executed proof) and is filed as Q5. **(C5)** Protected surfaces are verdict-only UNCHANGED, proved by execution on the PC.

---

## 8. Objections to the plan and the register

1. **`PLAN…:60` and `AUDIT-REGISTER.md:480` cite `migrate.cjs:218–224` for D45. Wrong on this tree and on `ffabbca`** (`migrate.cjs` is byte-identical across the carriers merge): those lines are SCALE-4's canonical pick for missed-read receipts. The whole of D45 is one substring at `writers.cjs:2490`. Register erratum.
2. **`AUDIT-REGISTER.md:300`'s D44 FIX clause 1 ("Exclude one-set removal candidates") is unimplementable as written** — executed, it turns D44's own law into a `HARNESS_ERROR`, because the law's precondition requires the one-set offer to exist (§2 D44). B3 implements clause 2 only and files clause 1 as a PM scope question.
3. **`PLAN…:95`'s rationale for D22's position ("the shape normalization … which every later reader depends on") overstates the coupling.** Measured: D22 is a no-op on every existing gate and every merge fixture. Its real reason for going early is the **port** (§6), not the later B3 hunks. Keep the order; correct the reason.
4. **`PLAN…:97` lists nine laws "expected GREEN" without saying that three of them are only weakly connected to their hunks.** D22's normalizer, D37's `beatsNoise` argument, D38's legacy reader fallback and D40's "both originals retained" are each invisible to their own law; eleven named mutants pass every v4 law. The plan's per-package acceptance must name a committed delta-cell file as a required artifact, as it does not today.
5. **`PLAN…:102` says B3 conflicts "with **B2** on `progression.cjs`/`volume.cjs`". True but incomplete:** it omits `merge-differential` and `witnesses-6`, the two gate carriers B3 actually moves, and it omits that D37 removes the merge's last clock dependency — the single largest structural consequence in the package.
6. **`PLAN…:113` and `:146` still disagree with `DECISIONS:94`** on whether B1/B2 are parallel or serialized, and neither names B3's parent. A single-parent immutable chain cannot have two heads. **Decide before implementation** — B3 is the last link either way and cheapest to pin correctly now.
7. **`PLAN…:101` calls D40 "the only package carrying an unfinished owner rule" and lists "three frozen-receipt surfaces". There are four** (D45, D36, D44, **and D37's printed number**, which `DECISIONS:60` explicitly authorises). Budget four.

---

## 9. Open questions

**For the PM (six; none of them product rules).**
**Q1 (blocking, the biggest).** `merge-differential`'s minted-blocked case loses frozen↔candidate parity under D37 because the merge's earn path becomes clock-free (§2 D37, six measured rows). Authorize a reviewed successor carrier **with an explicit frozen-parity exception** on that one fixture, and ratify the re-worded summary line — or rule that D37's as-of must stop short of `beatsNoise`, in which case the register's FIX ("every noise calculation used by a joint earn", `:164`) is not met and D37 should be re-scoped.
**Q2.** Track C's C2 port: schedule it **after** B3, or commit to re-running migrate → merge → 10/10 port-oracle after B3 merges (§6). Six of nine defects are on that path.
**Q3.** B1's D10 reach into `migrate.cjs:301,1203` and `writers.cjs:1587,2432` (§5). Confirm which package owns the golden re-pin for those four sites, and in which order.
**Q4.** B2's Q2 (`volume.cjs:159`): answered "inside B2" or carried to B3? If carried, it is a tenth B3 hunk and D44's cells are re-measured.
**Q5.** D44's register FIX clause 1 — should a give-back even be *offered* on a one-set lift? Not implementable inside D44 (§2, executed). File as a new non-D register item, or rule it out of scope.
**Q6.** Package boundary. `PLAN…:144` offers a B3a/B3b split. On the measured evidence a split is **not** recommended: D38/D39/D40 all edit `MERGE_ARR`/`mergeState` and would race across two closed profiles, while D37's `merge-differential` successor is needed by whichever half ships first. If the owner's D40 answer is slow, lift **D40 alone** into a successor (three `merge.cjs` hunks, one re-pin) rather than splitting the package.

**For the owner: exactly one — §3.4.** It is the rule `DECISIONS.md:60` explicitly left to this brief, and nothing else in B3 invents a threshold, interval or policy the owner has not set.

---

## 10. Executed evidence — commands and outcomes

Worktree `git worktree add --detach <wt> 8205b7f` on a full clone; `npm ci --include=dev` in that worktree (44 packages, never committed); the frozen bundle built in the scratchpad from the verified `fe516c1` checkout, **never into the repo**.

1. `TZ=America/New_York ENGINE_MAIN=<bundle> node rebuild/conform/v4/run-defect-laws.cjs` on `8205b7f` → `45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR`. Per-law inspection of the nine: each `RED` on both engines, control GREEN, every mutant RED; frames parity `true` for eight and `false` for D45, whose first differing character (offset 13 204 / 15 030) is the accepted D12 step-efficacy line.
2. **Discarded scratch copy** (`cp -r` of `rebuild/`, `tools/`, `src/`, `scripts/`, never the tree that will be committed): 26 hunks applied by exact-string replacement with a match-count assertion per hunk — **26/26 applied, 0 failures**.
3. Same runner on the patched copy → `45 RED-frozen · 30 RED-candidate · 89 GREEN controls · 88/104 mutants · 0 HARNESS_ERROR`; the status diff against base is **exactly the nine B3 rows**.
4. **Delta-cell probe, 82 cells per engine** (§2/§3's measured values): **43 differ, 39 identical**; every difference is inside an enumerated delta list and every identical row is a quoted negative control.
5. **Named source mutants**: 30 mutants, each applied to a disposable copy of the repaired scratch and run in fresh processes against both its v4 law and the 82-cell probe → **30 CAUGHT · 0 NOT CAUGHT · 0 NO-APPLY**; eleven were caught by cells alone with their law still GREEN (§7.3).
6. **Gate probes** on complete unpatched and patched copies of the same tree with the gate env: `witnesses-1/-3/-4` and `merge-laws` PASS on both; `migrate-differential` fails identically (token-identical output, only the absolute path differs); `witnesses-2/-5/-7`, `migrate-source`, `merge-source`, `writers-source`, `writers-differential` fail identically and pre-existingly; **`witnesses-6` and `merge-differential` move**, diagnosed to the exact assertion. **D22's migrate-boundary hunk measured separately**: every gate result and all 45 law totals identical with and without it.
7. **D44's register FIX clause 1 executed** on a disposable copy: `sweepVolume` returns `null` and D44's law reports `HARNESS_ERROR: TypeError: Cannot read properties of null (reading 'agentProposals')`. **D40's four merge-algebra properties measured directly** (direction independence, associativity over three replicas, idempotence under re-merge, re-settlement after an athlete correction), plus `merge-laws` PASS.

No private data was read; nothing in the repository was modified, committed or pushed.
