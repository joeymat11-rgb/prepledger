# EARNED — M2 module 6 report — ASTRA

## 1. Module map

Branch rebuild/m2-engine-6 starts at **f2f745847ced09524282e74c5b1d645a6fe30da0**, the current fetched integration tip carrying module-5 merge 6a5e53c and its ACCEPTED SCORECARD-M2-5.md. It does not start from the module-5 author branch or an older integration tip. Frozen src/app.jsx remains fe516c1, git blob **f98671d823f0d8cd83e730cdd930afe5f5e7b628**, v7.56.0/schema 60.

merge.cjs copies the COMPLETE **1,082-line interval 13371–14452**, including comments, with **42 declarations** and only _stampCorr's authorized clock substitution. mergeState's body is 14212–14447; the RECON 241-line interval extends to the next declaration boundary. index.cjs adds only the merge factory, LAST after migrate. BRIEF-6 and BRIEF-7 have exactly sections 0–5; module 7 is only specified, not built.

| Delivered file (under rebuild/) | Physical lines (excluding terminal empty line) |
|---|---:|
| engine/merge.cjs | 1099 |
| engine/index.cjs | 30 |
| engine/test/merge-source.cjs | 44 |
| engine/test/merge-laws.cjs | 150 |
| engine/test/merge-laws-adapter.mjs | 4 |
| engine/test/merge-differential.cjs | 231 |
| engine/test/defect-witnesses-6.cjs | 124 |
| m2/BRIEF-6.md | 161 |
| m2/BRIEF-7.md | 214 |

Every copied declaration's exact frozen source range (the uninterrupted range also retains all intervening comments):

| Declaration | app.jsx lines | Existing overlapping binding? |
|---|---:|---|
| _mergeScore | 13371–13371 | New in module 6 |
| _richer | 13372–13372 | New in module 6 |
| _readRank9 | 13378–13378 | Yes; prior copy retained |
| _readPick | 13379–13385 | Yes; prior copy retained |
| _stampCorr | 13422–13426 | Yes; prior copy retained |
| _corrOf | 13428–13435 | New in module 6 |
| _valOr | 13440–13440 | New in module 6 |
| _takeStamped | 13450–13454 | New in module 6 |
| CACHE_RIDERS | 13466–13466 | Yes; prior copy retained |
| CORR_KINDS | 13504–13504 | Yes; prior copy retained |
| _fileCorr | 13514–13560 | Yes; prior copy retained |
| _unionCorrLog | 13561–13582 | New in module 6 |
| _tieKey | 13587–13589 | New in module 6 |
| _canonJ | 13590–13593 | Yes; prior copy retained |
| _replayCorrections | 13594–13647 | New in module 6 |
| _mergeSession | 13650–13826 | New in module 6 |
| _sessionAtMs | 13827–13827 | New in module 6 |
| _richerSession | 13828–13872 | New in module 6 |
| _unionBy | 13874–13880 | New in module 6 |
| _unionObj | 13881–13887 | New in module 6 |
| _unionMulti | 13888–13896 | New in module 6 |
| _isoOr | 13910–13910 | New in module 6 |
| _exDate | 13911–13911 | New in module 6 |
| _queueRank | 13912–13912 | New in module 6 |
| _adjRank | 13913–13913 | Yes; prior copy retained |
| _adjInstant | 13920–13925 | Yes; prior copy retained |
| _sugRank | 13926–13926 | Yes; prior copy retained |
| _unionKeyed | 13927–13942 | Yes; prior copy retained |
| PLAN_POLICY_SCALARS | 13960–13960 | Yes; prior copy retained |
| _unionExOrder | 13980–14004 | New in module 6 |
| _unionPlan | 14006–14026 | New in module 6 |
| _unionLearned | 14034–14041 | New in module 6 |
| MERGE_KEYED | 14042–14062 | New in module 6 |
| MERGE_ARR | 14063–14072 | New in module 6 |
| MERGE_MULTI | 14080–14080 | New in module 6 |
| MERGE_OBJ | 14081–14081 | New in module 6 |
| _isFeedProjection | 14123–14123 | New in module 6 |
| _isFeedDerived | 14133–14140 | Yes; prior copy retained |
| _feedDayOrder | 14141–14179 | New in module 6 |
| _feedSorted | 14180–14183 | Yes; prior copy retained |
| _sugSorted | 14189–14211 | Yes; prior copy retained |
| mergeState | 14212–14447 | New in module 6 |

Exactly eight external source dependencies are reused through E: **_skinSeriesKey, normalizePlan, reconcileDebutQueue, reconcileEraTransitions, reconcileReadReceipts, reconcileSightings, reconcileSuggestionEffects, reconcileTrendChain**. There is no missing helper, unrelated writer closure or reference fallback. All 42 declarations are exported by the new factory. The candidate __test.migrate remains its actual module-5 closure, __test.mergeState is the actual new closure, and records remains absent for the oracle's independent DTO.

The 15 overlaps are _readRank9, _readPick, _stampCorr, CACHE_RIDERS, CORR_KINDS, _fileCorr, _canonJ, _adjRank, _adjInstant, _sugRank, _unionKeyed, PLAN_POLICY_SCALARS, _isFeedDerived, _feedSorted, _sugSorted. Their source bodies/initial values match the accepted earlier copies; module 1–5 files and oracle-shim are unchanged. E's final exports select merge's copies while migrate keeps its lexical copies. This preserves the requested contiguous copy and ordinary execution, but does NOT give arbitrary caller mutations of exposed constants one shared binding across factories; see §5. Arrays/maps are still separate between engine instances.

The exact pass order is preserved: input guards; scalar spread; ARR/read authority/reclassLog; trend chain; MULTI; feed-day order; OBJ/session replay; op-dedup; carve receipt; KEYED/suggestion order; stamped fields/forks/renames/cache riders; insertion/sleep/plan/learned/order/generation/retirement registers; normalizePlan/era reconciliation; **mint:true at 14441**; debut/read/suggestion reconciliation; final feed sort. Boot's _settleExit still does not request mint. No ladder repair was inserted into an intermediate binary merge.

## 2. Executed gates and output

Node 24.19.0, Windows; MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York for the port/law gates. ENGINE_MAIN/ENGINE_OLD are explicitly set to locally verified frozen bundles; the suite's machine-specific default was not trusted. All three RAW fixture/golden sets were present and their complete committed stamps/pins checked. Public pins are unchanged. Ignored preparation used commit-verified existing code bundles and reproduced complete goldens before normalizing only their packaging stamp to the committed stamp. No private state or golden is shipped. Initial strict starts stopped before tests because this fresh worktree lacked yaml; an ignored junction to the existing dependency installation supplied it without manifest/lockfile edits, then strict was rerun.

The actual unchanged CLI ran in separate fresh processes and was rerun after bite restoration:

```sh
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-6-frozen
node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-6-unfrozen
```

Frozen run, all required verdicts and tail verbatim:

```text
== PORT ORACLE v2 — check 'm2-6-frozen' vs golden 'main' (clock 2026-09-03 America/New_York; manifest PROVISIONAL — the FINAL golden is cut from the frozen old engine after the PROGRESSION-1 decision (owner); this golden is from main fe516c1 (v7.56.0, frozen main))
GREEN                  PORT-manifest-clock-zone-and-census-version-match-the-run  [Sol suite-pass-1 port objection 4 (fail closed)]  — {"manifest":["2026-09-03","America/New_York",3],"run":["2026-09-03","America/New_York",3]}
GREEN                  PORT-preimage-2026-08-15-manifest-pins-fixture-golden-engine-and-stamp  [manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)]  — {"fixture":true,"golden":true,"goldenBlob":true,"stampEngine":true,"stampClock":true,"stampCensus":true} engine fe516c1 (v7.56.0, frozen main) · PUBLIC (repo tools/fixtures/ledger-preimage-2026-08-15.json)
GREEN                  PORT-preimage-2026-08-15-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction  [sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)]  — counts held on 10 classes; sets 250 → 246 (4 struck by filed attested corrections with feed receipts, 0 undeclared)
GREEN                  PORT-preimage-2026-08-15-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — byte-identical required census (3897 leaves, 16 active lifts)
GREEN                  PORT-synthetic-pending-debut-manifest-pins-fixture-golden-engine-and-stamp  [manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)]  — {"fixture":true,"golden":true,"goldenBlob":true,"stampEngine":true,"stampClock":true,"stampCensus":true} engine fe516c1 (v7.56.0, frozen main) · SYNTHETIC (oracle/make-synthetic.cjs; pending debuts with newWSets, a former name, a volume receipt)
GREEN                  PORT-synthetic-pending-debut-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction  [sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)]  — counts held on 10 classes; sets 10 → 10 (0 struck by filed attested corrections with feed receipts, 0 undeclared)
GREEN                  PORT-synthetic-pending-debut-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — byte-identical required census (736 leaves, 2 active lifts)
GREEN                  PORT-live-manifest-pins-fixture-golden-engine-and-stamp  [manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)]  — [private fixture: detail withheld in code] · PRIVATE — the athlete's live ledger, never shipped; verdict lines only
GREEN                  PORT-live-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction  [sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)]  — [private fixture: detail withheld in code]
GREEN                  PORT-live-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — [private fixture: detail withheld in code]
   10 GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
```

Native-Date run, all required verdicts and tail verbatim:

```text
== PORT ORACLE v2 — check 'm2-6-unfrozen' vs golden 'main' (clock 2026-09-03 America/New_York; manifest PROVISIONAL — the FINAL golden is cut from the frozen old engine after the PROGRESSION-1 decision (owner); this golden is from main fe516c1 (v7.56.0, frozen main))
GREEN                  PORT-manifest-clock-zone-and-census-version-match-the-run  [Sol suite-pass-1 port objection 4 (fail closed)]  — {"manifest":["2026-09-03","America/New_York",3],"run":["2026-09-03","America/New_York",3]}
GREEN                  PORT-preimage-2026-08-15-manifest-pins-fixture-golden-engine-and-stamp  [manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)]  — {"fixture":true,"golden":true,"goldenBlob":true,"stampEngine":true,"stampClock":true,"stampCensus":true} engine fe516c1 (v7.56.0, frozen main) · PUBLIC (repo tools/fixtures/ledger-preimage-2026-08-15.json)
GREEN                  PORT-preimage-2026-08-15-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction  [sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)]  — counts held on 10 classes; sets 250 → 246 (4 struck by filed attested corrections with feed receipts, 0 undeclared)
GREEN                  PORT-preimage-2026-08-15-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — byte-identical required census (3897 leaves, 16 active lifts)
GREEN                  PORT-synthetic-pending-debut-manifest-pins-fixture-golden-engine-and-stamp  [manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)]  — {"fixture":true,"golden":true,"goldenBlob":true,"stampEngine":true,"stampClock":true,"stampCensus":true} engine fe516c1 (v7.56.0, frozen main) · SYNTHETIC (oracle/make-synthetic.cjs; pending debuts with newWSets, a former name, a volume receipt)
GREEN                  PORT-synthetic-pending-debut-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction  [sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)]  — counts held on 10 classes; sets 10 → 10 (0 struck by filed attested corrections with feed receipts, 0 undeclared)
GREEN                  PORT-synthetic-pending-debut-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — byte-identical required census (736 leaves, 2 active lifts)
GREEN                  PORT-live-manifest-pins-fixture-golden-engine-and-stamp  [manifest.json (immutable pins: fixture hash, golden hash, engine hash/commit, clock, zone, census version)]  — [private fixture: detail withheld in code] · PRIVATE — the athlete's live ledger, never shipped; verdict lines only
GREEN                  PORT-live-counts-law-nothing-lost-SILENTLY-through-migrate-every-struck-set-is-a-filed-attested-correction  [sheet §A counts law / PRESENCE LAW + A3 kind correction (a strike is a NEW filed correction with a feed receipt, never a silent edit)]  — [private fixture: detail withheld in code]
GREEN                  PORT-live-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — [private fixture: detail withheld in code]
   10 GREEN · 0 RED-as-specified · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
```

Both exit 0: ten required law IDs each, all three raw blobs, no HARNESS_ERROR, skipped blob or partial mode. The retained migrate-full.cjs separately ran the REAL CLI with loading/execution Date observers and compared exact post-migration return/input JSON on all three blobs. Its historical M2-5 labels are unchanged cumulative evidence, not a different candidate:

```text
GREEN M2-5 oracle Date=frozen: native startup, selected mode, candidate loading and full execution identity; migrate callable; records absent
PASS M2-5 actual full oracle Date=frozen: all ten required law IDs; all three blobs
GREEN M2-5 oracle Date=unfrozen: native startup, selected mode, candidate loading and full execution identity; migrate callable; records absent
PASS M2-5 actual full oracle Date=unfrozen: all ten required law IDs; all three blobs
GREEN M2-5 frozen full-state reference preimage-2026-08-15: actual raw migration and whole required census match the committed golden
GREEN M2-5 frozen full-state reference synthetic-pending-debut: actual raw migration and whole required census match the committed golden
GREEN M2-5 frozen full-state reference live: [private fixture: detail withheld in code]
GREEN M2-5 SEED: exact JSON bytes before migration in both modes
GREEN M2-5 full-post-state preimage-2026-08-15 Date=frozen: exact JSON.stringify return and post-call input bytes; identity behavior and whole required census; cross-mode identical
GREEN M2-5 full-post-state preimage-2026-08-15 Date=unfrozen: exact JSON.stringify return and post-call input bytes; identity behavior and whole required census; cross-mode identical
GREEN M2-5 full-post-state synthetic-pending-debut Date=frozen: exact JSON.stringify return and post-call input bytes; identity behavior and whole required census; cross-mode identical
GREEN M2-5 full-post-state synthetic-pending-debut Date=unfrozen: exact JSON.stringify return and post-call input bytes; identity behavior and whole required census; cross-mode identical
GREEN M2-5 full-post-state live Date=frozen: [private fixture: detail withheld in code]
GREEN M2-5 full-post-state live Date=unfrozen: [private fixture: detail withheld in code]
PASS M2-5 full migration gate: actual full oracle and exact post-state supplement; all three raw blobs; both Date modes
```

**Re-pointed merge gate:** node rebuild/engine/test/merge-laws.cjs. It imports the original tools/sync-laws.mjs through its EXISTING PL_ENGINE seam, with no law copy or edit. Source git blob is **f4166764c6fc2978f6de75dbbc70ca8c09380a0d**. A frozen-reference child and two candidate-only children execute every committed seed; capability inventory, law names, counts, carve-outs, exits and Date identity are checked. Post-restoration output, including each actual SYNC-LAWS line:

```text
PUBLIC REFERENCE SHA256: ef574bc82f18fe555d70a9387e9cd8c5c8984b988be3fbea5f4272770f041ab5 (artifact identity; source pin f98671d823f0d8cd83e730cdd930afe5f5e7b628)
PASS frozen reference: 18 laws / 59 committed seeds / 0 capability skips / 8 superset exemptions (14431, 14433, 14434, 14435)
SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8× (14431, 14433, 14434, 14435) — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity
PASS candidate frozen: 18 laws / 59 committed seeds / 0 capability skips; unchanged Date during load and execution; identical reference law inventory and carve-outs
SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8× (14431, 14433, 14434, 14435) — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity
PASS candidate native: 18 laws / 59 committed seeds / 0 capability skips; unchanged Date during load and execution; identical reference law inventory and carve-outs
SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8× (14431, 14433, 14434, 14435) — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity
PASS exact sync-laws source: tools/sync-laws.mjs:37 via PL_ENGINE; 18 named laws GREEN in both candidate Date modes
LAW IDS: sighting-faithful, convergence, associativity, idempotence, merge-fixed-point, keyless-max-multiset, day-order-kept, non-shrink, correction-survival, athlete-word-priority, stamp-value-coupling, load-on-ladder, receipt-truth, session-superset, session-fixed-point, self-consistent, one-placement, reseed-integrity
```

The 18 laws hold on all 59 committed seeds with zero capability skips. Eight superset exemptions on the listed synthetic seeds remain the frozen law's explicit contract; they were not removed or invented. These law projections/canonical comparisons are not a claim that every byte of arbitrary merge directions agrees.

**Full merge differential:** node rebuild/engine/test/merge-differential.cjs. Each result is compared to G.mergeState from the real frozen bundle under the equivalent injected clock, with independent inputs and no candidate helper on the reference side. Immediate serialized cuts include the result, both post-call inputs and aliases before the next merge can mutate a shared subtree. Post-restoration final output:

```text
M6 SYNTHETIC frozen: PASS — 152 exact whole-state differential cases; 17 two-device scenarios, both directions, repeat batch twice, two injected clocks; complete returns/inputs/aliases/receipts.
M6 CLOCK frozen: ordinary merge makes no clock/ID/draft access; qualifying mint reads clock.today (frozen new Date), and blocked access suppresses the earn in both engines.
M6 SYNTHETIC native: PASS — 152 exact whole-state differential cases; 17 two-device scenarios, both directions, repeat batch twice, two injected clocks; complete returns/inputs/aliases/receipts.
M6 CLOCK native: ordinary merge makes no clock/ID/draft access; qualifying mint reads clock.today (frozen new Date), and blocked access suppresses the earn in both engines.
```

The 152 cases PER mode cover 17 synthetic two-device scenarios, both directions, the same remote batch replayed twice, two injected dates, absent/junk sides, and explicit scalar-local-wins behavior. Scenarios cover keyed/disjoint unions, same-day read authority, keyless multiplicity/receipt order, stamped cache/load/ladder boundaries, equal stamps, fork classes/renames, plan generations, plan/learned/sleep unions, older schema, filed struck-set corrections plus receipts, legacy carve receipts, suggestion effects and qualifying/nonqualifying mint.
Additional old/current-schema cuts exercise raw merge then migrate AND the actual host sequence migrate(remote) → merge(local,remoteMigrated) → migrate(result), in both directions and both clocks. The accepted test-only migration source helper supplies reference migration for nondefault clocks; MERGE expectations always call the frozen bundle's mergeState. Boot-only qualifying history is separately proven not to mint. No matched unexpected exception is accepted as success. Unprovoked commutativity/idempotence/purity assertions are not added over the frozen behavior.

**Cumulative source/parity checks:** merge-source.cjs, migrate-source.cjs, migrate-differential.cjs, census-partial.cjs and defect-witnesses 1–5 all exited 0 after restoration. The old partial census is regression only: its frozen pre-migration/identity seam is not a substitute for raw module-5 acceptance. Verbatim evidence:

```text
MERGE SOURCE PASS: complete 1082-line frozen range / 42 declarations; only _stampCorr clock substitution; pass order and comments exact
PRIOR SOURCE PASS: modules 1–5 and oracle-shim byte-identical to accepted base; index adds merge last; per-engine maps and callable candidate exports
MIGRATE SOURCE PASS: 93 exact declarations / 2291 source lines; three authorized ID/instant rewrites; 57 patches in source order with ascending table
PRIOR SOURCE PASS: all modules 1–4 and oracle-shim byte-identical to accepted base; independent seed/patch/function identities; candidate migrate directly exported, records absent
```

```text
M5 SYNTHETIC frozen: PASS — 126 exact differential cases; 64 migration exits/repeats; identity, receipt bytes, draft scans, seed/ID isolation, real mint and boot boundaries.
M5 SYNTHETIC native: PASS — 126 exact differential cases; 64 migration exits/repeats; identity, receipt bytes, draft scans, seed/ID isolation, real mint and boot boundaries.
```

```text
GREEN M2-4 manifest: fe516c1 / v7.56.0; clock, zone and census version pinned
GREEN M2-4 preimage-2026-08-15: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-4 synthetic-pending-debut: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-4 SEED: canonical byte equality to frozen __test.SEED in both Date modes
GREEN M2-4 preimage-2026-08-15 Date=frozen: lifts + progression + energy + today + raw Today inputs byte-identical (829 leaves); volume byte-identical (468 additional leaves; 0 matched exceptions)
GREEN M2-4 preimage-2026-08-15 Date=unfrozen: lifts + progression + energy + today + raw Today inputs byte-identical (829 leaves); volume byte-identical (468 additional leaves; 0 matched exceptions)
GREEN M2-4 preimage-2026-08-15: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-4 synthetic-pending-debut Date=frozen: lifts + progression + energy + today + raw Today inputs byte-identical (141 leaves); volume byte-identical (155 additional leaves; 1 matched exceptions)
GREEN M2-4 synthetic-pending-debut Date=unfrozen: lifts + progression + energy + today + raw Today inputs byte-identical (141 leaves); volume byte-identical (155 additional leaves; 1 matched exceptions)
GREEN M2-4 synthetic-pending-debut: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-4 live: [private fixture: detail withheld in code]
PASS M2-4 partial census: all required blobs; two Date modes; migration once per fixture
```

```text
DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 2: 11/11 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 3: 5/5 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 4: 5/5 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 5: 4/4 reproduced; behavior intentionally unchanged
```

The new preserved-defect command is node rebuild/engine/test/defect-witnesses-6.cjs; every witness executes frozen and candidate merges, in both Date modes:

```text
REPRODUCED D37 same merge inputs yield a different earned receipt at a later clock (app.jsx:14441,2493,2533,2163,2132)
REPRODUCED D38 merge drops actual writer-shaped accepted and declined trial records (app.jsx:10125-10126,10138,13876,14070)
REPRODUCED D39 a stale replica restores a dismissed current-generation offer (app.jsx:10132-10141,14071,14216)
REPRODUCED D40 equal-richness daily calorie conflicts resolve differently by merge direction (app.jsx:13372,13881-13885,14081,14240)
M6 preserved defects frozen: 4/4 PASS; frozen and candidate execute every merge witness.
REPRODUCED D37 same merge inputs yield a different earned receipt at a later clock (app.jsx:14441,2493,2533,2163,2132)
REPRODUCED D38 merge drops actual writer-shaped accepted and declined trial records (app.jsx:10125-10126,10138,13876,14070)
REPRODUCED D39 a stale replica restores a dismissed current-generation offer (app.jsx:10132-10141,14071,14216)
REPRODUCED D40 equal-richness daily calorie conflicts resolve differently by merge direction (app.jsx:13372,13881-13885,14081,14240)
M6 preserved defects native: 4/4 PASS; frozen and candidate execute every merge witness.
```

**Unchanged conformance suite:** node rebuild/conform/run.cjs exited 0. COMPLETE SUMMARY block verbatim (local artifact paths identify generated code, not private input):

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

node rebuild/conform/run.cjs --selftest exited 0:

```text
SELFTEST PASS
```

With MEASURED_TEST_NOW unset, node scripts/check.mjs --strict is the final staged-file check. Its tail:

```text
  PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
  PASS  health data stays unreadable from the public site
  PASS  no token-shaped string anywhere in the tree
  PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
  PASS  CI parses, deploy needs test, production is main-only, ship merges and never rebases
  PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)

All checks passed. Safe to ship.
```

The unchanged suite/strict still cover their existing frozen engine and authority/client families. The 29 expected RED-first laws remain absent policy/progression adapter scope. They do not prove the unbuilt general writers; the new candidate merge law run above supplies this module's separate behavioral gate.

## 3. Clock, ID, storage and mutable ownership

ONE new direct ambient-read substitution in the copied range: **_stampCorr at app.jsx:13424, new Date().toISOString() → clock.nowISO()**. It is the same seam already accepted in module 5. The range has no direct random/ID/storage read or other ambient now read. _corrOf/_fileCorr/_sessionAtMs/_adjInstant retain explicit date parsing and historical arithmetic; _fileCorr:13533 advances the record's own prior timestamp by one millisecond, not today's time. No Date global is installed by product code.

The direct "a merge has no clock" line at 14268 describes receipt dating from the record. It is NOT transitive clock freedom: mergeState → reconcileSightings({mint:true}) → _mintJointEarn → earnWalk → beatsNoise/typicalError reaches typicalError's default todayStart at 2132 (the earned receipt also calls it at 2533). The existing injected clock carries that read; no product change is made. A hostile-dependency witness records accesses even when caught: ordinary merge makes none; a qualifying mint touches clock.today, and refusing that read suppresses the earn in both engines. A nonthrowing two-date witness produces different prose with identical input (D37). Never interpret an exception-swallowing return as a no-clock PASS.

The law adapter captures genuine native Date at process start. The unchanged law entrypoint first installs its own frozen Date; for the native candidate child only, the TEST adapter restores that captured constructor BEFORE requiring the candidate, while its explicit injected clock stays fixed. It checks Date/now/parse/UTC identity after loading and after all laws. The law generator's own date operations use explicit arguments. The differential independently tests an ambient September freeze and native Date while injecting both September and February-2031 clocks. These are test adaptations, not product clock reads.

No new ID or draft provider is consumed by the merge range. Existing module-5 injection/default facade and independent deterministic providers are retained for the migrate/merge host composition. The hostile merge witness arms clock/ids/drafts proxies AFTER engine construction so a swallowed read is still recorded. It establishes the observed paths, not universal lack of clock-dependent callees.

MERGE_KEYED/ARR/MULTI/OBJ, CACHE_RIDERS, PLAN_POLICY_SCALARS and CORR_KINDS are factory-local; separate engines have distinct arrays/maps, nested map definitions and functions. Mutating one test engine's MERGE_OBJ does not alter the other. No memo/WeakMap was introduced or invalidated. Earlier owners remain energy _ebtMemo/_energyDensityLoss via memoOnState (4253/4798/5157–5166), policy _forecastCached (5202), today _nowMemo (15535), and sleep _labMemo (12413). Their existing D13/D20/D26 staleness remains untouched. Source _docketMemo is still outside the current product extraction.

## 4. Bite and exact restoration

FIRST and only mutation: at the copied app.jsx:14240 OBJ selector, change **k === "sessionLog" ? _mergeSession : _richer** to **k === "sessionLog" ? _richer : _richer**. That sends session conflicts through ordinary richness instead of keyed correction replay. The actual unchanged law gate then reported:

```text
PASS frozen reference: 18 laws / 59 committed seeds / 0 capability skips / 8 superset exemptions (14431, 14433, 14434, 14435)
FAILED candidate frozen
BROKEN-LAWS: convergence, correction-survival, non-shrink, session-superset
SYNC-LAWS: 34 violation(s) · superset exemption taken 0× across 59 committed seeds
FAIL merge-laws: exact public law gate or precondition failed; raw diagnostics withheld
```

The affected named assertions are convergence, correction-survival, non-shrink and session-superset across the committed synthetic worlds. The frozen baseline stayed GREEN. This is semantic failure from the candidate merge, not an import error or source-text SHAPE check. No silent attempt occurred. The port census does not call merge and was not used as the bite's failure detector.

The exact saved bytes were restored in finally. Restored public merge.cjs SHA256: **b69dd11f6a44b41001741bd88b0e6cffbd8e0140837216775360b33b2d7e3d98**. Both actual full-port Date modes, the frozen/candidate sync-law runs, the final merge differential, source checks and affected cumulative regressions then passed. No mutant is committed.

## 5. SEAMS and limits of the evidence

- The unchanged sync laws compare selected/canonical state with declared carve-outs. Exact same-direction serialized output/input and receipt order are checked separately against the frozen merge. D40 proves that all laws GREEN does not imply universal full-state commutativity. The differential preserves returns that alias a junk-side input and nested mutations across repeated calls; it does not silently turn merge into a deep-pure function.
- The PL_ENGINE adapter supplies ONLY candidate __test. There is no runtime reference fallback; the reference child is separate. The harness's SHAPE assertions still inspect frozen app.jsx and its own correction-operation composition, exactly as authored. The complete-range source audit independently checks the extracted bodies/order; these two evidence types are not conflated.
- A fixed required SHA for the locally generated reference bundle was removed during runner review: build-engines.mjs explicitly documents packaging hashes varying with entry path/esbuild. The runner pins actual frozen source and law source, prints the reference artifact identity and requires the complete unchanged reference result. AGENTS preparation plus the separately executed migrate-full/golden checks validate the prepared reference; a public package hash is identity evidence, not a portable source pin.
- Full contiguous copying duplicates 15 accepted helper/constant bindings. Within an engine, E exports select the merge copy while migrate retains its lexical copy. Initial values/function bodies are equal, and tested ordinary execution matches; a caller that mutates an exported constant will not mutate both copies. This is a disclosed packaging limit, not a claim of one shared binding. No internal code here mutates those exported constant tables, and no automatic reconciliation or refactor was added.
- Synthetic old-schema inputs vary the version/shape of invented states; they are not a full archive of every historic schema. Required three-blob RAW migration remains separately gated. Exact JSON covers the JSON state contract; it does not prove exotic prototype/non-JSON semantics or arbitrary graph behavior. Alias checks supplement serialized values for the actual synthetic graphs.
- D38/D39 create input using the real frozen apply/dismiss writer with invented data, then compare both merges. That input-generation seam proves the trial/proposal shape exists; it does not provide a candidate writer or claim module-7 runtime coverage. No private fixture enters the synthetic/deliberate-defect tests.
- BRIEF-7 exposes second-gate scope conflicts rather than stubbing them: runtime-required pure lab/draft/preference/ask/day helpers must be copied; original source/asset assertions remain classified separately; three ghSync upload assertions need a proposed, isolated, test-only legacy carrier bound to candidate engine calls and mocked I/O. Cowork reviews that boundary before module 7. None of that future carrier or writer code is built here.
- Three same-family assistants supplied bounded brief/test/audit work; they are not Cowork's independent execution. Review caught and corrected missing host-composition/nonqualifying test cuts, a nonportable artifact-hash precondition, omission of intermediate actual arguments from repeated-merge frames, and missing boot alias comparison before final runs. Source/body fidelity was also checked by independently parsing the pinned source and candidate, not only by this branch's source checker. Finite green evidence is not a comprehensive product audit.

## 6. RECON disagreements and corrections

The FINAL golden is already fe516c1; provisional-v59 and approximate older gate counts are historical. The actual unchanged sync gate has 18 laws/59 committed seeds. RECON's automatic memo-invalidation suggestion is a later semantic decision, not authorization; no invalidation was added. Its drafts.dates() proposal remains superseded by the accepted storage-shaped facade.

RECON §1(d)/§2 calls merge clock-free while also noting beatsNoise's default-clock dependency elsewhere. The copied range is directly free of ambient now after _stampCorr injection, but the reachable mint is not: D37 and the hostile-access witness resolve that claim by execution. _fileCorr's explicit predecessor-time arithmetic is not an ambient clock read. Record-dated receipts may still contain clock-sensitive analysis.

The source's documented local-wins tie and shallow sharing prevent a blanket claim of commutativity or deep purity. Preserve them and their pass order; D40 is a recorded convergence limitation. BRIEF-7's complete gate also contradicts RECON's proposed sweepLab stub and its exclusion of some runtime-called helpers; the brief names those future boundaries without editing RECON or the frozen tests. Merge's mint:true stays at 14441; module-5 boot remains non-minting.

## 7. What module 6 does not cover

No completeSession, runAdaptive, apply/dismiss/undo family, volume/stall/ladder sweeps, full engine-test or engine-surface second-gate implementation. Existing callable closure writers remain where previously accepted; no general module-7 family is newly built. BRIEF-7 is a future task for review, not executed acceptance.

No changes to the frozen app, tools/scripts, conformance suite, client, authority, M3 or seeded soak stub; no cloud/storage/network integration, on-device import or private publication. The complete writer second gate and post-extraction defect-law/owner-ruling pass remain outstanding. **M2 is not complete.** Cowork verifies this module and reviews BRIEF-7 before the next build. This PR is not merged by ASTRA.

## 8. Wall-clock and token accounting

Recorded fetched-base checkpoint: **2026-09-05 05:36:29 UTC**. Report-assembly checkpoint: **2026-09-05 05:46:57 UTC**, 10 minutes 28 seconds between observations. This interval includes branch setup, parallel extraction/brief/test work, the bite, local verification and review; it is elapsed wall time, not summed agent engineering hours. Report completion/staging/strict and subsequent PR/CI waiting are additional. Per-task token usage was not exposed; no token total is invented.

## 9. DEFECT LOG — D37–D40 (preserved)

SCORECARD-M2-5 accepts D33–D36 and specifies D37 next. The new tracked defect-witnesses-6.cjs executes every example against frozen and candidate merges in BOTH Date modes; all four reproduce. These are candidate red-first laws/contract questions for later owner ruling, not fixes introduced by extraction.

| ID | Frozen app.jsx evidence | Concrete executed witness; later ruling needed |
|---|---|---|
| D37 | 14441 → 2493/2533 → 2163 → 2132 | Identical invented merge inputs include two qualifying target sightings and noisy pre-fork repeats on another lift. On Aug 30 the EARNED receipt says ±5.01; on Sep 3 it says ±0.90 because default as-of selects a different noise pool. The receipt date stays Aug 30 and both queues earn 105. Thus a record-dated merge can print different prose based on wall day. Later rule the historical as-of boundary; preserve today's default now. |
| D38 | 10125–10126/10138 writer shape; 13876/14070 merge key | Actual frozen trial apply/dismiss produces rows shaped {custom,started} or {custom,declined}, without id/d. Merging either decision with an empty synthetic replica drops the trial row in BOTH directions because the union key is absent; its TRIAL STARTED/PASSED receipt survives. Later define a stable trial identity/decision union; no fix here. |
| D39 | 10132–10141; 14071; 14216 | The real frozen writer dismisses a current-generation volume offer by removing it and printing VOLUME PASSED. Merging with a stale copy restores that exact offer in BOTH directions while retaining the passed receipt. The test does not claim a second application occurred. Later rule durable decision/tombstone semantics for this proposal family. |
| D40 | 13372; 13881–13885; 14081; 14240 | Two equal-length same-day dailyLogs rows hold cal=2000 and cal=2100. A←B keeps 2000; B←A keeps 2100. This is the documented local-wins richness tie, a preserved full-state convergence limitation despite the existing selected law suite being GREEN. Later rule the field's authority/tie behavior; do not assert or implement commutativity during extraction. |

Earlier D1–D36 keep their IDs and behavior; none is fixed or renumbered. If this report is accepted unchanged, the next new defect is D41.
