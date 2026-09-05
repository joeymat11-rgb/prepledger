# EARNED — M2 module 5 report — ASTRA

## 1. Module map

Branch rebuild/m2-engine-5, based on approved integration commit **7347ca976b1131cc44adc6a562c2a795c9e78d0b**. SCORECARD-M2-4 accepts module 4 and BRIEF-5 before this start. Frozen app.jsx matches fe516c1 exactly (git blob **f98671d823f0d8cd83e730cdd930afe5f5e7b628**; v7.56.0, schema 60). All three required fixture/golden/engine stamps were checked against the committed FINAL manifest at 2026-09-03, America/New_York; committed public pins remain unchanged.

migrate.cjs contains **93 copied declarations spanning 2,291 source lines**, in source FILE order. The 57 patch declarations retain their nonnumeric file order; PATCHES retains its ascending [4…60] function table. Only the three authorized ID/instant body substitutions in §3 differ. Factories, source markers and exports add packaging lines; blank separators/adjacent unselected code are not copied declarations.

| Delivered engine file | Physical lines (excluding terminal empty line) |
|---|---:|
| migrate.cjs | 2506 |
| index.cjs | 29 |
| test/migrate-source.cjs | 58 |
| test/migrate-full.cjs | 277 |
| test/migrate-reference.cjs | 158 |
| test/migrate-differential.cjs | 344 |
| test/defect-witnesses-5.cjs | 94 |

index.cjs registers migrate LAST and passes the optional drafts dependency. The unchanged oracle-shim uses its equivalent empty default. E.migrate and E.__test.migrate are the same candidate closure; T.records remains absent. No reference bundle, source loader, DTO or oracle code is imported by the product. All earlier module files and oracle-shim are byte-identical to the accepted base; prior exports remain available.

Every copied declaration, including the complete required helper closure:

| Declaration | Frozen app.jsx lines | Source lines | Scope |
|---|---:|---:|---|
| _freshId | 375–375 | 1 | Closure addition |
| _mintJointEarn | 2277–2318 | 42 | Required |
| reconcileSightings | 2321–2335 | 15 | Required |
| reconcileDebutQueue | 2362–2380 | 19 | Required |
| reconcileEraTransitions | 2381–2453 | 73 | Required |
| earnWalk | 2466–2558 | 93 | Closure addition |
| reconcileReadReceipts | 10298–10353 | 56 | Required |
| reconcileTrendChain | 10370–10426 | 57 | Required |
| reconcileSuggestionEffects | 10439–10654 | 216 | Required |
| anchorDexa | 10657–10672 | 16 | Required |
| patchV4 | 10675–10680 | 6 | Required |
| patchV5 | 10681–10691 | 11 | Required |
| patchV6 | 10692–10699 | 8 | Required |
| patchV7 | 10700–10704 | 5 | Required |
| patchV8 | 10705–10718 | 14 | Required |
| patchV9 | 10719–10724 | 6 | Required |
| patchV10 | 10725–10730 | 6 | Required |
| patchV31 | 10731–10745 | 15 | Required |
| patchV32 | 10746–10764 | 19 | Required |
| patchV33 | 10765–10792 | 28 | Required |
| patchV34 | 10804–10884 | 81 | Required |
| patchV30 | 10885–10888 | 4 | Required |
| patchV29 | 10889–10892 | 4 | Required |
| patchV28 | 10893–10896 | 4 | Required |
| patchV27 | 10897–10902 | 6 | Required |
| patchV26 | 10903–10913 | 11 | Required |
| patchV25 | 10914–10927 | 14 | Required |
| patchV24 | 10928–10948 | 21 | Required |
| patchV23 | 10949–10949 | 1 | Required |
| patchV22 | 10950–10950 | 1 | Required |
| patchV21 | 10951–10951 | 1 | Required |
| patchV20 | 10952–10952 | 1 | Required |
| patchV19 | 10953–10953 | 1 | Required |
| patchV18 | 10954–10964 | 11 | Required |
| patchV17 | 10965–10969 | 5 | Required |
| patchV16 | 10970–10978 | 9 | Required |
| patchV15 | 10979–10983 | 5 | Required |
| patchV14 | 10984–10984 | 1 | Required |
| patchV13 | 10985–10985 | 1 | Required |
| patchV12 | 10986–10986 | 1 | Required |
| patchV11 | 10987–10993 | 7 | Required |
| patchV35 | 10997–11008 | 12 | Required |
| _hashId | 11014–11018 | 5 | Required |
| patchV36 | 11019–11036 | 18 | Required |
| patchV37 | 11037–11049 | 13 | Required |
| patchV39 | 11052–11052 | 1 | Required |
| patchV40 | 11053–11071 | 19 | Required |
| patchV41 | 11072–11099 | 28 | Required |
| patchV42 | 11100–11124 | 25 | Required |
| patchV43 | 11125–11143 | 19 | Required |
| patchV44 | 11144–11171 | 28 | Required |
| patchV45 | 11172–11189 | 18 | Required |
| KNOWN_CORR | 11201–11218 | 18 | Closure addition |
| _fileKnownCorr | 11219–11238 | 20 | Required |
| SCALE1_RECLASS | 11258–11258 | 1 | Closure addition |
| patchV59 | 11259–11309 | 51 | Required |
| patchV60 | 11322–11403 | 82 | Required |
| patchV58 | 11404–11416 | 13 | Required |
| patchV57 | 11417–11450 | 34 | Required |
| patchV56 | 11451–11493 | 43 | Required |
| patchV55 | 11494–11542 | 49 | Required |
| patchV54 | 11543–11579 | 37 | Required |
| patchV53 | 11580–11637 | 58 | Required |
| patchV52 | 11638–11702 | 65 | Required |
| patchV51 | 11703–11832 | 130 | Required |
| patchV50 | 11833–11853 | 21 | Required |
| patchV49 | 11854–11866 | 13 | Required |
| patchV48 | 11867–11900 | 34 | Required |
| patchV47 | 11901–11927 | 27 | Required |
| patchV46 | 11928–11957 | 30 | Required |
| patchV38 | 11958–11971 | 14 | Required |
| PATCHES | 11983–11983 | 1 | Required |
| reconcileLiftCaches | 12001–12044 | 44 | Required |
| ensureLoadOnLadder | 12057–12068 | 12 | Required |
| reconcileCorrectedLoads | 12099–12214 | 116 | Required |
| _settleExit | 12222–12262 | 41 | Required |
| migrate | 12263–12311 | 49 | Required |
| isPristineSeed | 13233–13241 | 9 | Required |
| recordCounts | 13289–13327 | 39 | Required |
| dataLossGuard | 13328–13361 | 34 | Required |
| _readRank9 | 13378–13378 | 1 | Closure addition |
| _readPick | 13379–13385 | 7 | Closure addition |
| _stampCorr | 13422–13426 | 5 | Closure addition |
| CORR_KINDS | 13504–13504 | 1 | Closure addition |
| _fileCorr | 13514–13560 | 47 | Closure addition |
| _canonJ | 13590–13593 | 4 | Closure addition |
| _adjRank | 13913–13913 | 1 | Closure addition |
| _adjInstant | 13920–13925 | 6 | Closure addition |
| _sugRank | 13926–13926 | 1 | Closure addition |
| _unionKeyed | 13927–13942 | 16 | Closure addition |
| _isFeedDerived | 14133–14140 | 8 | Closure addition |
| _feedSorted | 14180–14183 | 4 | Closure addition |
| _sugSorted | 14189–14211 | 23 | Closure addition |

Reused constants from this engine's E: AUTONOMY_LEVELS, DAY, INSERTION_PAIRS, LATE_READ_HOW, PLAN_POLICY_SCALARS, SCHEMA_V, SEED. Reused callable bindings through factory-local forwarding closures: _bornValid, _deriveSightingFull, _formerNames, applyInsertionSeams, atTopOfWindow, beatsNoise, bfEst, deriveLastMeta, deriveSighting, exActive, exById, isoOf, loadRungs, mk, nextLoad, normalizePlan, pinsUnfilled, todayStart, typicalError, weeksBetween. These resolve to the already accepted modules, with their existing clock/memo semantics. The 17 closure additions are _stampCorr, _fileCorr, SCALE1_RECLASS, KNOWN_CORR, _feedSorted, _canonJ, _readPick, _unionKeyed, _sugRank, _adjRank, _sugSorted, _adjInstant, earnWalk, _freshId, _isFeedDerived, CORR_KINDS, _readRank9; their ranges appear above. earnWalk is the mint/era writer dependency, not an extraction of the general writer family. Later-file correction, sorting, read-choice and guard helpers are included only to close the named migration exports.

## 2. Executed gates and output

Node 24.19.0 on Windows. The two commands below ran in separate fresh processes with MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York. Every input is RAW. Both were rerun after the bite restoration; each exited 0, with all ten required law IDs present. There is no partial success or private-blob skip.

```sh
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-5-frozen
node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-5-unfrozen
```

Frozen run — complete law verdicts and tail, verbatim:

```text
== PORT ORACLE v2 — check 'm2-5-frozen' vs golden 'main' (clock 2026-09-03 America/New_York; manifest PROVISIONAL — the FINAL golden is cut from the frozen old engine after the PROGRESSION-1 decision (owner); this golden is from main fe516c1 (v7.56.0, frozen main))
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

Native-Date run — complete law verdicts and tail, verbatim:

```text
== PORT ORACLE v2 — check 'm2-5-unfrozen' vs golden 'main' (clock 2026-09-03 America/New_York; manifest PROVISIONAL — the FINAL golden is cut from the frozen old engine after the PROGRESSION-1 decision (owner); this golden is from main fe516c1 (v7.56.0, frozen main))
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

The tracked supplemental command is node rebuild/engine/test/migrate-full.cjs (same environment plus locally prepared ENGINE_MAIN). It invokes the actual unchanged CLI in both modes, requires all law IDs, and observes Date before preload, at candidate loading and after oracle execution. Separate fresh workers compare the exact JSON.stringify return AND post-call input against the frozen engine on every raw blob, including key/array order and full receipt objects. Another raw clone supplies the whole required census. Reference callables never enter candidate workers. Its post-restoration evidence:

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

A scratch read interceptor simulated the required private input being absent without deleting or changing any fixture. migrate-full exited 1 before running an oracle; the failure verdict was:

```text
FAIL M2-5 live input pins: [private fixture: detail withheld in code]
FAIL CLOSED M2-5 full migration gate: precondition or execution failure; details withheld
```

Retained module 1–4 regression command: node rebuild/engine/test/census-partial.cjs. This old harness intentionally uses frozen pre-migration plus test-only identity migrate; it is regression evidence ONLY. Its 829/141 prior leaves, additional volume projection and preserved D22 exception do not establish module-5 acceptance. Post-restoration output:

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

Tracked source and synthetic commands: node rebuild/engine/test/migrate-source.cjs; node rebuild/engine/test/migrate-differential.cjs; and the five existing/current defect-witnesses*.cjs entry points. ENGINE_MAIN names the locally verified frozen bundle for the reference-dependent tests. Outputs:

```text
MIGRATE SOURCE PASS: 93 exact declarations / 2291 source lines; three authorized ID/instant rewrites; 57 patches in source order with ascending table
PRIOR SOURCE PASS: all modules 1–4 and oracle-shim byte-identical to accepted base; independent seed/patch/function identities; candidate migrate directly exported, records absent
```

```text
M5 SYNTHETIC frozen: PASS — 126 exact differential cases; 64 migration exits/repeats; identity, receipt bytes, draft scans, seed/ID isolation, real mint and boot boundaries.
M5 SYNTHETIC native: PASS — 126 exact differential cases; 64 migration exits/repeats; identity, receipt bytes, draft scans, seed/ID isolation, real mint and boot boundaries.
```

```text
DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 2: 11/11 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 3: 5/5 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 4: 5/5 reproduced; behavior intentionally unchanged
DEFECT WITNESSES 5: 4/4 reproduced; behavior intentionally unchanged
```

The 126 comparisons PER mode cover 64 exits/repeats (null/undefined/v0, v1/v2, every v3–59, v60 and future v61), input mutation and aliases, both v1 calf completion and nondefault hack3 stamp, V51 storage/default/null/clock/caught-partial-scan cases, V60 insertion/vector/receipt cases, deterministic anchor IDs, guard losses/corrections/receipts, rename .from, separate engines and a genuinely qualifying mint plus five refusal cases. Boot refuses to mint; explicit reconcileSightings({mint:true}) does mint. Full synthetic values, exact serialized bytes and aliases are compared; an unexpected exception on BOTH sides fails rather than counting as parity.

Unchanged frozen suite: node rebuild/conform/run.cjs. Its complete SUMMARY block, verbatim (artifact paths identify local generated code, not private input):

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
OK   7 privacy: every private-fixture law line in the log is verdict-only (detail withheld in code) — 6 private lines
OK   8 gate artifacts verified (files present, hashes match, results pass, clock matches) — 10 gates
OK   8 coverage: every TESTED section's ids exist, every law id is covered by a section, every gated section's gates verified — {"TESTED":26,"SEPARATELY_GATED":2,"DEFERRED":2}
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
```

node rebuild/conform/run.cjs --selftest exited 0:

```text
SELFTEST PASS
```

This remains 70 GREEN against the present authority/client families and 29 expected RED against absent policy/progression adapters. The existing reference-engine writer rigs are not silently re-pointed to the extracted engine. Module-5 acceptance comes from the separate candidate full oracle and full-state/synthetic checks above.

With MEASURED_TEST_NOW unset, node scripts/check.mjs --strict exited 0. Final tail (rerun after staging all deliverables for its whole-tree scan):

```text
  PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
  PASS  health data stays unreadable from the public site
  PASS  no token-shaped string anywhere in the tree
  PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
  PASS  CI parses, deploy needs test, production is main-only, ship merges and never rebases
  PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)

All checks passed. Safe to ship.
```

## 3. Clock, ID, storage and mutable ownership

Three copied-body substitutions, covering four ambient reads at three source sites: (1) _freshId at app.jsx:375 replaces Date.now(), Math.random() and the module-global _freshSeq generator with ids.fresh(prefix || ""); (2) migrate's v1 hack3 stamp at 12299 becomes clock.nowISO(); (3) _stampCorr at 13424 becomes clock.nowISO(). Missing ids.fresh throws only when a new identity is requested, never falls back to randomness. This is the established injected-ID seam, not a claim that random source IDs equal deterministic test IDs. Separate injected sequences and repeated anchorDexa calls are asserted. Nondefault hack3/_stampCorr timestamps and repeat behavior are compared against frozen callers under the equivalent test clock.

One storage binding addition: factory-local localStorage = drafts. createEngine supplies a fresh frozen empty facade {length:0,key:()=>null} only when drafts is undefined; an explicit null/throwing facade retains the frozen caught failure. patchV51:11784–11791 keeps its exact key loop, both prefixes, suffix matching, key order and prior progress after an exception. No global storage, key prefilter, value read or storage write is installed. The synthetic runner compares length/key access traces, matched/nonmatched/null keys, malformed dates, throwing length/key and partial advancement against the source, with exact insertion-date assertions. Default empty scan reproduces the frozen Node caught-missing-localStorage result.

patchV51:11783 reaches injected todayStart through E; its explicit UTC bump at 11782 stays unchanged. patchV59's explicit date at 11286, _fileCorr's parse/explicit successor date at 13533, Date.parse and other historical arithmetic retain their bytes. A free-dependency/source audit found no additional ambient read or missing helper. Native Date remains unchanged around candidate require, factory creation and execution; the frozen mode selects its preload before candidate evaluation.

patchV60:11351 reads E.SEED.insertions after the accepted seed weave. Tests change one engine's insertion map and prove its patch output changes without changing the other engine's seed/output. Every patch and isPristineSeed share their OWN engine's seed. PATCHES arrays, patch/function closures, constants and default facades are created inside each factory instance. Caller-supplied shared mutable providers remain the caller's responsibility. Tests use separate draft/ID providers and prove no cross-engine progress.

No memo or WeakMap is added or invalidated. Existing per-engine owners remain: energy's _ebtMemo (4253) and _energyDensityLoss (4798), through memoOnState (5157–5166; WeakMap at 5158); policy's _forecastCached (5202); today's _nowMemo (15535); sleep's _labMemo (12413). Source _docketMemo (12415) remains unextracted. Module files are unchanged, and existing D13/D20/D26 cache/identity/clock staleness is preserved, not repaired during migrate.

## 4. Bite and exact restoration

The FIRST and only mutation changed the copied _settleExit feed-sort statement into the same sort followed by appending the literal " [M2-5 BITE]" to the first string feed.t. It changed no source, fixture, golden or checker. The actual FULL frozen-Date oracle exited 1, with this live verdict:

```text
FAIL                   PORT-live-census-v2-required-identical-to-golden  [owner ruling 2026-09-03: the port is proven by IDENTICAL reads (records DTO + lifts + energy + progression + today)]  — [private fixture: detail withheld in code]
```

The public mapping is _settleExit → returned feed[].t → legacy-records.cjs records.feed[].text → required(census).records.feed. A separate in-memory live probe compared original and mutated factory instances and asserted that the altered final receipt text reaches that required DTO field, not merely an uncensused extra field. It emitted only a private-safe PASS verdict. No private index, receipt text, value, count, state hash or snapshot is published. There was no silent first attempt. Whole-state tests additionally cover original receipt fields/order that this sorted DTO omits.

The saved file was restored byte-for-byte in finally. Restored public migrate.cjs SHA256: **73a0082a8ca4ab005e4dd1c08482cef44eb202363f73944f9e7bc367135f7c3b**. Both exact CLI modes, tracked full-state runner, cumulative census and source check then passed; §2 contains restored results. No mutant is staged or committed.

## 5. SEAMS and limits of the evidence

- Product wiring is E/deps only. The empty default draft scan is the Node compatibility seam; a browser host must inject its read-only storage facade. migrate does not own persistence or acknowledge a durable save. ID generation belongs to the caller; the injection removes _freshSeq instead of creating another hidden global generator.
- The immutable oracle's required DTO is selective. It compares counts/rawCounts, migration.recordsChangedByMigrate and required records/lifts/progression/energy/today, including exact exercised prose. It normalizes object keys and sorts some arrays. The supplemental exact serialized post-state comparison is deliberately separate and includes unprojected fields, original receipt order and post-call input mutation.
- legacy-records.cjs:11 projects renames[].at, while nameAt reads .from (app.jsx:1822–1828). The synthetic test changes only .from on migrated states: historical nameAt changes, records DTO stays equal, full serialized state differs. The frozen oracle is not expanded. This known test seam is not re-numbered as a new copied migration defect.
- migrate-reference.cjs is TEST ONLY: 101 pinned source declarations plus 24 frozen-bundle dependencies, with source blob verification. Local ReferenceDate/drafts and deterministic _freshId expose otherwise uncensused paths; frozen dependencies run under that reference clock and restore Date before the candidate. It imports no candidate helper. It is not a second independent engine implementation or proof of original random IDs; the real full-port run still uses the original frozen bundle directly.
- earnWalk, correction writers and later-file read/sort/guard helpers are callable closure additions, not completed modules 6/7. _mintJointEarn's positive synthetic case produces two real derived tops, an earned receipt and a debut; swallowed missing-helper exceptions cannot satisfy it. _settleExit retains reconcileSightings(st) without mint:true.
- The synthetic and full-state checks are finite examples, not complete branch coverage. The v3–59 examples vary schema flags on synthetic SEED-shaped states with invented observations; they are not authentic snapshots of every historical schema. Full-state serialization covers the JSON state contract; exotic non-JSON objects/prototypes are outside these fixtures. Synthetic alias/deep-value checks add coverage for legacy returns that serialized state alone cannot describe. Real browser storage, interrupted persistence and private on-device import were not run.
- Test harness setup initially used a Windows absolute --import path rejected by Node; it was corrected to the exact relative preload in the brief. A source-check diagnostic also needed the AST end columns for two trailing comments outside function bodies. Neither issue changed product behavior or expected data. Existing D1–D32 behavior and the four new witnesses below remain frozen.
- Three same-family assistants supplied bounded test/audit work. Their review and my reruns do not replace Cowork's independent execution or the owner's post-extraction rulings. All private input/state comparisons remain local and ignored; reports expose private verdict lines only.

## 6. RECON disagreements and corrections

RECON §6 item 1's provisional-v59 warning and the manifest's PROVISIONAL sentence are historical; FINAL fe516c1 pins were verified, never recut to match this module. Item 3's cache-invalidation/version-counter suggestion would change frozen behavior: no invalidation was added. The per-instance ownership part is preserved. Item 11's live-census warning does not waive either public blob, full-state checks, deterministic seams or source fidelity.

The drafts.length/key facade deliberately differs from RECON's proposed drafts.dates(); BRIEF-5 rules this shape to keep the frozen caught loop intact. Its explicit UTC bump is not an ambient clock read. patchV60 uses the already woven per-instance SEED, including insertions, with no hard-coded replacement map.

The module-1 owner ruling includes _mintJointEarn here with reconcileSightings. Its classification as a writer is correct; the earlier suggestion that boot also mints is not: _settleExit:12258 omits mint:true, mergeState:14441 supplies it. General merge stays for module 6. The brief's shorthand "earnWalk (2304)" is the mint call site; the copied declaration is 2466–2558. T.records is not an engine export; the frozen oracle supplies its independent legacy DTO. RECON and the brief themselves remain unchanged.

## 7. What module 5 does not cover

No mergeState/general merge API, completeSession, runAdaptive, apply/dismiss/undo writers, volumePush/sweepVolume/sweepStalls, UI/storage/sync/restore entry points or complete module 7. No product-rule fixes, new law/golden/DTO, automatic memo repair or private import. The frozen app, suite, scripts/tools, client, authority, M3 and seeded soak stub are unchanged.

The full migration port now passes for the required three blobs and tested seams. That does NOT establish arbitrary uncensused behavior, the later re-pointed writer/merge gate, the second post-extraction audit or owner defect rulings. M2 is not complete. Cowork must verify this PR by execution before integration; no merge is performed here.

## 8. Wall-clock and token accounting

Recorded extraction checkpoint: **2026-09-05 04:50:49 UTC**; report assembly checkpoint: **2026-09-05 05:00:04 UTC**, 9 minutes 15 seconds between those observations. Branch/input setup began before the first recorded checkpoint, so this is not an exact task-total claim. The interval includes parallel implementation, local gates, bite, synthetic work and review; it is elapsed wall time, not summed agent engineering hours. Final report/staging checks and subsequent PR/CI waiting are additional. Per-task token usage was not exposed; no token figure is claimed.

## 9. DEFECT LOG — D33–D36 (preserved)

The accepted module-4 report ends at D32. These four new findings execute against BOTH the pinned frozen source and the candidate; the candidate runs under native Date. Reproduce with node rebuild/engine/test/defect-witnesses-5.cjs, TZ=America/New_York and the locally prepared ENGINE_MAIN. They use invented states; the pristine fingerprint case edits only the public authored SEED. They are evidence for later red-first laws and owner rulings, not desired-behavior assertions or fixes.

| ID | Frozen app.jsx evidence | Concrete witness and later question |
|---|---|---|
| D33 | 13294–13297; 13329–13334 | recordCounts counts session days rather than sets, and dataLossGuard checks shrinking counts. Removing one synthetic rep/set with no correction/receipt keeps counts equal and returns {safe:true,lost:[]}. Replacing the sole read date with a different date also passes. Later require record identities and attested set-loss accounting; a counts-only predicate cannot prove preservation. |
| D34 | 13235–13239 | isPristineSeed compares a coarse fingerprint (counts/last date), not record content. Increase the last public-seed read weight by one: the state differs yet the result remains true. Later define a content-based pristine check before using this predicate to justify replacement. |
| D35 | 12266 versus 12268–12274 | The future-schema comment promises an untouched return, but container healing runs first. A synthetic v61 object with null sleep/reads/dailyLogs/sessionLog returns by the same identity with those fields replaced. Later place the unknown-schema decision before mutation or explicitly rule the supported contract; preserve the current ordering here. |
| D36 | 11387–11396 | Full migrate on synthetic v59 curl "40·40·35" produces w=40, wSets=[40,40,35], nextLoad=45 and supersedes its unlock, while the emitted how still says the next line is 60·60·55. The implementation accepts a general vector but prints a fixed authored vector. Later derive receipt values from the actual transition or narrow eligibility by owner ruling; the receipt remains exact here. |

Existing cache staleness D13/D20/D26 and prior volume/read defects remain applicable without duplicate numbering. D22's matched synthetic exception remains visible in the cumulative gate. If accepted unchanged, the next new defect number is D37.
