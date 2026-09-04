# M2 module 3 — ASTRA report

## 1. Module map and frozen source

Base: rebuild/t2-client-core at 8d573d18c540b19672dfe03f0b197d799d4e979c; branch rebuild/m2-engine-3.
Copied the Today read side from src/app.jsx @ fe516c1. Its git blob remains f98671d823f0d8cd83e730cdd930afe5f5e7b628.
Eighteen declarations (17 exported functions and one private memo) match the exact source slices after only the one clock and eight tone substitutions in §3. No listed reader required a writer exclusion.

| File | Physical lines | Change |
|---|---:|---|
| rebuild/engine/today.cjs | 628 | New factory, exact copied readers plus declared E bindings |
| rebuild/engine/index.cjs | 26 | One factory registration |
| rebuild/engine/oracle-shim.cjs | 25 | Unchanged: existing whole-table export exposes all six required selectors |
| rebuild/engine/test/census-partial.cjs | 200 | Cumulative four-group comparison, both Date modes |
| rebuild/engine/test/defect-witnesses-3.cjs | 105 | Invented-state observations D23–D27; preserves current behavior |

Exact declaration boundaries, including body comments, in frozen app.jsx:

| Declaration | Source lines |
|---|---|
| pickStructural | 1471–1478 |
| genSession | 1481–1595 |
| nowFocus | 8436–8476 |
| fiveLevers | 8489–8539 |
| theOneFix | 8540–8580 |
| whyDecompose | 8593–8626 |
| lastUndoable | 10189–10221 |
| apAutoHandledFor | 10269–10271 |
| oweTarget | 15246–15250 |
| statusFace | 15295–15352 |
| marchingOrder | 15364–15395 |
| statusTarget | 15404–15414 |
| nowModelUncached | 15424–15504 |
| _plain9 | 15508–15517 |
| _rateStrip | 15519–15525 |
| _rateWord | 15526–15534 |
| _nowMemo | 15535 |
| nowModel | 15536 |

The previous eight factory modules, their constants/SEED and all previously copied function bodies are unchanged; REPORT-M2-1-ASTRA.md and REPORT-M2-2-ASTRA.md retain their source maps.

## 2. Executed gates

Windows, Node v24.19.0, esbuild 0.28.1. For the census, oracle, suite and selftest: MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York. ENGINE_MAIN/ENGINE_OLD point to the byte-verified reference artifacts from module 2, built from detached fe516c1/a0009c3 sources. Their bytes were rechecked; the builder was not rerun here (its existing POSIX-path/deletion behavior was not changed).
Regenerated the raw private fixture from git show fe516c1:ledger/state.json locally. Ran the unchanged golden operation in an isolated scratch mirror: complete public and private goldens match committed pins after only engine-packaging stamp normalization. Public manifest/goldens stayed byte-identical; only ignored private inputs were installed for the gate. No raw state, private hash or private count is reported or committed.

Executed node rebuild/engine/test/census-partial.cjs: exit 0. It migrates each raw fixture once with the frozen engine, passes the dumped snapshot by value into isolated candidate processes, and checks all four committed groups plus the retained raw Today inputs. Verbatim final output:

```text
GREEN M2-3 manifest: fe516c1 / v7.56.0; clock, zone and census version pinned
GREEN M2-3 preimage-2026-08-15: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-3 synthetic-pending-debut: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-3 SEED: canonical byte equality to frozen __test.SEED in both Date modes
GREEN M2-3 preimage-2026-08-15 Date=frozen: lifts + progression + energy + today + raw Today inputs byte-identical (829 leaves)
GREEN M2-3 preimage-2026-08-15 Date=unfrozen: lifts + progression + energy + today + raw Today inputs byte-identical (829 leaves)
GREEN M2-3 preimage-2026-08-15: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-3 synthetic-pending-debut Date=frozen: lifts + progression + energy + today + raw Today inputs byte-identical (141 leaves)
GREEN M2-3 synthetic-pending-debut Date=unfrozen: lifts + progression + energy + today + raw Today inputs byte-identical (141 leaves)
GREEN M2-3 synthetic-pending-debut: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-3 live: [private fixture: detail withheld in code]
PASS M2-3 partial census: all required blobs; two Date modes; migration once per fixture
```

Also executed exactly node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-3: **exit 1**, not PASS. The unchanged census calls T.migrate at census.cjs:31 before its readers. All six data laws therefore stop with TypeError: T.migrate is not a function; all four metadata laws pass. Below are verbatim verdict/law-ID excerpts and the summary; annotations and local stack paths are omitted:

```text
GREEN                  PORT-manifest-clock-zone-and-census-version-match-the-run
GREEN                  PORT-preimage-2026-08-15-manifest-pins-fixture-golden-engine-and-stamp
HARNESS_ERROR          PORT-preimage-2026-08-15-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction
HARNESS_ERROR          PORT-preimage-2026-08-15-census-v2-required-identical-to-golden
GREEN                  PORT-synthetic-pending-debut-manifest-pins-fixture-golden-engine-and-stamp
HARNESS_ERROR          PORT-synthetic-pending-debut-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction
HARNESS_ERROR          PORT-synthetic-pending-debut-census-v2-required-identical-to-golden
GREEN                  PORT-live-manifest-pins-fixture-golden-engine-and-stamp
HARNESS_ERROR          PORT-live-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction
HARNESS_ERROR          PORT-live-census-v2-required-identical-to-golden
   4 GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 6 HARNESS_ERROR
```

The partial runner does not turn those six laws green. Candidate migration, counts and the records DTO remain unproved; §6 corrects the brief's narrower expectation.

Executed node rebuild/conform/run.cjs: exit 0. Verbatim SUMMARY block:

```text
== SUMMARY
OK   0 clock and zone set and equal to the oracle manifest — run 2026-09-03/America/New_York manifest 2026-09-03/America/New_York
OK   0 engine artifacts present (main + old) — a missing engine is BAD, never SKIP — {"main":"C:\\Users\\joeym\\Documents\\Codex\\2026-09-04\\read-rebuild-t3-brief-md-and\\work\\m2-2-artifacts\\engine-main.cjs","old":"C:\\Users\\joeym\\Documents\\Codex\\2026-09-04\\read-rebuild-t3-brief-md-and\\work\\m2-2-artifacts\\engine-old.cjs"}
OK   1 inventory laws/sheet-A-authority.cjs == frozen manifest (34 laws, family authority)
OK   1 inventory laws/sheet-B-client.cjs == frozen manifest (35 laws, family client)
OK   1 inventory laws/d13-d14.cjs == frozen manifest (20 laws, family policy)
OK   1 inventory laws/progression.cjs == frozen manifest (9 laws, family progression)
OK   1 inventory laws/soak.cjs == frozen manifest (1 laws, family authority)
OK   1 inventory global ids unique and total == frozen total — 99 vs frozen 99
OK   2 port oracle main-vs-main under the manifest — all GREEN and exactly the frozen PORT ids — 10 ids
OK   3 sensitivity: every leaf compared + semantic mutants DETECTED + old-vs-main DETECTED, exactly the frozen PORT ids — 13 ids
OK   6 adapter loading: only an exact MODULE_NOT_FOUND counts as absent; any other load failure is HARNESS_ERROR — present: authority,client
OK   4 reference laws/sheet-A-authority.cjs: all GREEN — 34/34 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-A-authority.cjs: every law STRONG — 34 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/sheet-B-client.cjs: all GREEN — 35/35 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-B-client.cjs: every law STRONG — 35 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-B-client.cjs: family client present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 35 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/d13-d14.cjs: all GREEN — 20/20 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/d13-d14.cjs: every law STRONG — 20 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/d13-d14.cjs: family policy absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 20 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/progression.cjs: all GREEN — 9/9 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/progression.cjs: every law STRONG — 9 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/progression.cjs: family progression absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 9 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/soak.cjs: all GREEN — 1/1 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/soak.cjs: every law STRONG — 1 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/soak.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 1 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   7 privacy: every private-fixture law line in the log is verdict-only (detail withheld in code) — 14 private lines
OK   8 gate artifacts verified (files present, hashes match, results pass, clock matches) — 10 gates
OK   8 coverage: every TESTED section's ids exist, every law id is covered by a section, every gated section's gates verified — {"TESTED":26,"SEPARATELY_GATED":2,"DEFERRED":2}
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
```

The suite's port pass above is frozen-main versus frozen-main; it is not the failing candidate-shim run. Its 29 RED-as-specified laws are the absent policy/progression adapters, not beta acceptance.

Executed node rebuild/conform/run.cjs --selftest: exit 0. Verbatim output:

```text
== SELFTEST
OK   selftest (a) adapter that throws at require → INCONSISTENT
OK   selftest (a) adapter with a syntax error → INCONSISTENT
OK   selftest (a) adapter with a missing transitive dependency → INCONSISTENT (not treated as absent)
OK   selftest (b) no adapters → CONSISTENT, every family RED
OK   selftest (b) client-only → CONSISTENT, client family GREEN, authority family still RED
OK   selftest (b) authority-only → CONSISTENT, authority + soak GREEN, client still RED
OK   selftest (b) both → CONSISTENT, both families GREEN, policy/progression still RED
OK   selftest (c) a deleted law → INCONSISTENT (inventory)
OK   selftest (c) a renamed law → INCONSISTENT (inventory)
OK   selftest (d) privacy canaries (count, queue text, feed text, lift name, nested rule, note) never reach stdout or the log — 0 leaked across golden/check/sensitivity output + log
SELFTEST PASS
```

Executed node scripts/check.mjs --strict with MEASURED_TEST_NOW **unset**, retaining the frozen gate's own clock: exit 0. Verbatim tail:

```text
  PASS  app.js matches a fresh build of src/ (1081 KB)
  PASS  no tool runs esbuild's binary through node — the build API is the only path, so the gate means the same thing on Windows, Linux and CI
  PASS  contrast audit: 124 resolved pairs, both themes, all >= 4.5:1
  PASS  affordance lint: the tap-color grammar holds (gauge tappable, jade/orange state, brass never a control)
  PASS  SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8× (14431, 14433, 14434, 14435) — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity
  PASS  the suite reads no moving file — 9 gate readers pinned to the frozen preimage (ledger-preimage-2026-08-15.json); ledger/state.json is exercised out of band
  PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
  PASS  health data stays unreadable from the public site
  PASS  no token-shaped string anywhere in the tree
  PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
  PASS  CI parses, deploy needs test, production is main-only, ship merges and never rebases
  PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)

All checks passed. Safe to ship.
```

Strict validates the unchanged frozen app and repository boundaries; the cumulative partial census validates this copied reader surface. These are different claims.

## 3. Clock, tone and memo handling

Exactly **one newly copied ambient clock site** changed: nowFocus, app.jsx:8437, new Date().getHours() → clock.hour(). Its explicit hour argument still overrides the default. Existing todayStart/daysUntil/weekDay calls resolve through the already injected factories. Explicit-date arithmetic remains unchanged. No new random/ID rewrite or UI side effect was copied.

Exactly **eight authorized tone substitutions** in statusFace; every other field, branch and prose byte is unchanged:

| Source lines | Frozen expression | Copied token string |
|---|---|---|
| 15315,15323 | T.orange | "orange" |
| 15326,15329,15337 | T.steel | "steel" |
| 15332,15345 | T.gauge | "gauge" |
| 15348 | T.brass | "brass" |

No theme object/hex is added. Nine controlled cases separately checked token mapping and all other statusFace fields, because the census intentionally omits tone/glyph.
The new _nowMemo at 15535 is created inside each Today factory through unchanged memoOnState (5157–5166); nowModel at 15536 preserves the explicit truthy-deps bypass. Its WeakMap keys only by state identity. D26 records clock rollover staleness; no invalidation/version field was added.
The dependency graph also meets the unchanged earlier memos: _ebtMemo (4253), _energyDensityLoss (4798), _forecastCached (5202) and _labMemo (12413–12414). Their factory-local lifetimes and known identity-cache defects remain as reported in module 2. _docketMemo is outside this closure and was not copied.
Two-engine checks found no shared memo results or constant/SEED object graph. Explicit nowModel dependencies bypassed its cache. Instrumented synthetic execution attempted zero ambient Date/Date.now calls; the cumulative gate additionally passed with native Date restored before candidate loading.

## 4. Bite check — first attempt detected, exact restoration

Changed only the final statusFace return in rebuild/engine/today.cjs, copied from app.jsx:15351, from return { word, glyph, tone, cause }; to return { word, glyph, tone, cause: cause + " (bite)" };. The frozen app was not edited.
Both public fixtures in both Date modes reported exactly one differing path, /today/statusFace/cause. The live verdict and overall result were:

```text
FAIL M2-3 live: [private fixture: detail withheld in code]
FAIL M2-3 partial census: all required blobs; two Date modes; migration once per fixture
EXIT 1
```

Restored the saved original bytes in finally; Buffer equality and SHA256 both match the pre-bite file:
af4c65d2998c2fd588d6251a220262db5395e7ca5410ad36fe314826a04cbe0d.
Then reran the entire partial census: exit 0, all three fixtures and both Date modes GREEN (§2). No silent first mutation. This proves detection of this exercised return field, not every branch or writer.

## 5. SEAMS and coverage limits

1. Retained the per-engine factory E table for cycles: 43 lazy function bindings and five per-instance constants (AUTONOMY_META, DAY, DEFICIT_CEILING, NOW_DOORS, SET_REALLOCATIONS) come from existing factories. No reference-engine selector is installed on the candidate table. The Today factory exports 17 readers; all six brief-required names reach __test through the unchanged shim.
2. Full read-only closure additions beyond the explicit list: pickStructural, genSession, nowModelUncached and private _nowMemo. The first two allocate fresh session descriptions; they do not file/apply queue items. They live in today.cjs for this slice although RECON assigns them to progression. No sessionFromDraft, writer or UI was pulled in. The exact functions preserve omitted-argument exceptions (D23).
3. Tone names are the explicit product-boundary rewrite, not a fixture-dependent substitute. The census pins statusFace.word/cause and statusTarget.key/id/label; full-reader and tone checks are separate from that reduced DTO.
4. The unchanged oracle has no partial mode. Only the test runner supplies identity migrate over an already golden-migrated clone so census can read it. The candidate shim still has no migrate. The four groups exclude records/counts/migration; they are not literally the whole required oracle minus one function.
5. Retained module 2's unrounded currentRate/regime/progressionTrend comparisons as extra in-memory references from the same pinned golden engine and snapshot. They add no committed golden and cannot hide the four-group comparison against the committed golden.
6. Complete selected outputs for all 17 new exports were additionally compared on both public snapshots. Helpers absent from the original __test were loaded from exact frozen declarations with the existing dependency table; nowModelUncached was compared through the frozen explicit-deps bypass. Deep-frozen input and instrumented catches/dependency access found no missing binding or attempted state write; a separate Proxy probe exercised all 17 methods and counted even swallowed write attempts (zero).
7. On synthetic-pending-debut, five full-reader calls preserve the original exceptions: nowFocus, theOneFix, marchingOrder, nowModelUncached and nowModel. The existing sleep.nights object/array assumption is D22; successful census fields do not imply those five full calls succeed. The exact original and copied .some/.filter errors matched. No array fallback was smuggled in.
8. D23's diagnostic uses nowModel's existing optional face/fix/prog arguments to isolate its workout branch; real dayType/genSession/pickStructural execute unchanged. All five diagnostics use invented frozen states. They assert observations of defects, not acceptance of those behaviors as future rules.
9. Bytewise source comparison, full public-reader comparisons, nine tone cases and cache/clock probes ran as scratch diagnostics. The cumulative census and D23–D27 witnesses are committed; those additional inspection tools are not product/test hooks. Source comments and the report identify reproducible source ranges and cases.
10. Windows reference packaging was reused and checked rather than rebuilding with the existing destructive/POSIX-only helper. Golden regeneration used a scratch mirror and normalized only the packaging stamp; it did not relax a public fixture/manifest/golden hash check in the committed runner.
11. Passing the fixed-date fixtures does not cover all hours, timezones, DST boundaries, arbitrary schemas, proposal combinations or all full-reader branches. Module 1's unexercised same-day-decrease bite remains a disclosed coverage gap. There was no new silent bite in this module.
12. Suite/strict still exercise historical reference/model artifacts and absent-family semantics. Neither is a repointed engine-writer second gate, physical-phone test, real backend, data port or milestone release. No independent cross-family milestone approval is claimed.

## 6. RECON / brief corrections — documents not edited

- RECON's provisional/old-engine introduction is stale: the concrete accepted golden pin is fe516c1. Its approximate ranges include following comments; §1 gives exact declaration bounds.
- The Today writer-family row groups lastUndoable/apAutoHandledFor with writers. These two inspect state and return descriptions only; BRIEF-3's read classification agrees with execution. No listed reader required a stop. The owner's earlier _mintJointEarn exclusion remains in force.
- RECON's proposed genSession placement in progression does not make it optional for nowModel. Its complete read closure is copied here and listed in §5; moving it later should preserve one implementation.
- The port oracle offers no partial flag. Missing migrate causes both counts AND entire required-census laws to HARNESS_ERROR before reads, not just a counts mismatch. The required census also includes records DTO fields, omitted by this authorized four-group partial gate. No fake migration is exported to improve the headline.
- RECON risk 3's suggested invalidation/versioned cache is a semantic change. Identity-only memo behavior is preserved (including D26) until an owner-ruled post-extraction law.
- BRIEF-3 §4(7)/(9) says “module 1”; this report applies those inherited scope/fidelity obligations to module 3. No broader rule change is inferred.

## 7. Not covered

No candidate migrate/merge, completeSession/earnWalk, applyRead/undoRead, runAdaptive, proposal/suggestion/agent apply/dismiss/note paths, undoAdjustment, sweepLab or other filing writers. No policy/progression adapter, Today UI, client/network/storage integration, private port or deployment. The engine-test/sync-laws/engine-surface second gate is not repointed here. Defects D1–D27 remain for owner rulings; this copy fixes none of them.

## 8. Time and review

Worktree creation: 2026-09-04 23:27:19 UTC. Technical validation/report preparation: 2026-09-04 23:37:07 UTC; elapsed 9 minutes 48 seconds. This is wall time, not estimated engineering hours; PR publication follows. Exact token usage is not exposed.
Three same-family subagents handled Today extraction, cumulative-gate preparation and separate source/defect auditing while the root wired the factory, checked the full readers, executed suite/selftest/strict/oracle/bite and wrote this report. The second source inspection matched all 18 declarations with precisely the declared nine substitutions. This is separate execution evidence, not the cross-family reviewer or owner's acceptance.

## 9. DEFECT LOG — D23 onward, unchanged

All source lines are app.jsx @ fe516c1. Each observation also reproduced with the exact frozen Today declarations and accepted module-1/2 dependency table. These are candidates for later red-first laws; no product rule was changed. Existing D22 also affects the five Today readers identified in §5, without a duplicate defect number.
Reproduce: set TZ=America/New_York, then node rebuild/engine/test/defect-witnesses-3.cjs. Each state is synthetic, and the test asserts the currently preserved defect explicitly.

| ID | Source lines | Executed evidence | Candidate later ruling |
|---|---|---|---|
| D23 | 1474;15484;15491 | A scheduled Lower day with a READY hack debut produces LOWER when genSession receives {last:null}; nowModel omits sleep, triggers slp.last TypeError inside its swallowed catch, and displays REST DAY with no workout date. | Supply/validate the needed input and make failed derivation distinguishable from a rest day. |
| D24 | 8454;8460–8461;6875–6876 | Yesterday's steps-only row makes nowFocus clear with no yesterday obligation; owedLedger still reports that day open because calories are missing. Removing only the partial row restores the nowFocus obligation. | Derive both views from one explicit completeness rule. |
| D25 | 8507–8512 | One logged day with zero protein gives fiveLevers.protein state good, detail 0/1, despite proteinTarget.lo = 170. The condition allows one miss even when there is only one observation. | Rule minimum evidence and success proportion before returning good. |
| D26 | 15425;15535–15536;5158–5163 | With the same immutable state, advancing every clock field coherently Sep 3→4 keeps the cached tISO Sep 3; nowModel(s,{}) returns Sep 4. State immutability alone cannot fix this clock dependency. | Include clock validity in cache ownership or invalidate at the required boundary. |
| D27 | 8564–8569;5579–5581;14459–14461 | A committed maintenance phase with measured flat trend still returns rung break and says the deficit has been held for weeks; it uses global program week 13 rather than elapsed committed-cut time. | Gate the instruction on the actual phase and derive duration from that phase's evidence. |

Verbatim diagnostic output:

```text
REPRODUCED D23 missing sleep input hides a scheduled hack workout as REST DAY (app.jsx:1474,15484,15491)
REPRODUCED D24 a partial yesterday row disappears from what is owed (app.jsx:8454,8460-8461,6875-6876)
REPRODUCED D25 zero protein on the sole logged day is GOOD 0/1 (app.jsx:8507-8512)
REPRODUCED D26 unchanged state keeps yesterday's Today model after the clock advances (app.jsx:15425,15535-15536,5158-5163)
REPRODUCED D27 committed maintenance still receives the long-cut diet-break instruction (app.jsx:8564-8569,5579-5581,14459-14461)
DEFECT WITNESSES 3: 5/5 reproduced; behavior intentionally unchanged
```
