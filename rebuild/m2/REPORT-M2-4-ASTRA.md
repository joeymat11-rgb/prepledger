# M2 module 4 — ASTRA report

## 1. Module map and frozen source

Base: rebuild/t2-client-core at 3564e6957467c23fc4f100af406fca08ff3c018d; branch rebuild/m2-engine-4.
Copied the volume READ side from src/app.jsx @ fe516c1 (v7.56.0/schema 60). Its unchanged git blob is f98671d823f0d8cd83e730cdd930afe5f5e7b628.
Twelve declarations, 258 source lines: seven ownership moves and five new copies. Every declaration, including its body comments, is byte-identical to the frozen slice. No reader required a writer exclusion; volumePush/sweepVolume/sweepStalls remain absent.

| File | Physical lines |
|---|---:|
| rebuild/engine/volume.cjs | 308 |
| rebuild/engine/sleep.cjs | 1942 |
| rebuild/engine/policy.cjs | 827 |
| rebuild/engine/progression.cjs | 751 |
| rebuild/engine/index.cjs | 27 |
| rebuild/engine/oracle-shim.cjs | 25 |
| rebuild/engine/test/census-partial.cjs | 210 |
| rebuild/engine/test/volume-reference.cjs | 28 |
| rebuild/engine/test/volume-projection.cjs | 39 |
| rebuild/engine/test/defect-witnesses-4.cjs | 125 |
| rebuild/m2/BRIEF-4.md | 64 |
| rebuild/m2/BRIEF-5.md | 165 |

Every copied declaration:

| Declaration | Frozen app.jsx lines | volume.cjs lines | Origin |
|---|---|---|---|
| coarseLifts | 1398–1401 | 26–29 | Moved from progression.cjs |
| mgLabel | 8361–8361 | 32–32 | New exact copy |
| volBucket | 8627–8627 | 35–35 | Moved from sleep.cjs |
| muscleVolume | 8628–8649 | 38–59 | Moved from sleep.cjs |
| programmeVolume | 8674–8705 | 62–93 | New exact copy |
| hypGain | 8713–8713 | 96–96 | New exact copy |
| volumeImbalance | 8744–8787 | 99–142 | New exact copy |
| structuralMovesThisWeek | 8815–8836 | 145–166 | Moved from policy.cjs |
| _blockSlope | 8862–8879 | 169–186 | Moved from sleep.cjs |
| setOneRead | 8883–8911 | 189–217 | Moved from sleep.cjs |
| volumeConversion | 8913–8989 | 220–296 | Moved from sleep.cjs |
| _setsMovesSince | 9015–9021 | 299–305 | New exact copy |

The source audit also compared all 186 unrelated top-level declarations in sleep/policy/progression against their pre-edit bytes: unchanged. All seven moved declarations have exactly one implementation. Sleep now delegates muscleVolume/setOneRead/volumeConversion through E; policy delegates structuralMovesThisWeek; progression has no remaining coarseLifts caller. The existing whole-E oracle shim exposes all twelve volume exports without edits and still has no migrate.
Read-only closure additions are volBucket and hypGain. The other dependencies are already extracted: 18 lazy function bindings (_tCrit, cap, dayType, dayWeather, energyBalanceTarget, exActive, fmtShort, isoOf, liftCall, liftTrend, mk, paceRushed, phaseArc, recoveryIndex, rirSetsOf, sessionScore, todayStart, windowFor), plus 12 per-engine constants (DAY, DELIVERED_MAJ, HYP_B, HYP_SDES, INDIRECT, MG_LABEL, REVIEW_CLASSIFY_D, REVIEW_DELIV_D, REVIEW_OUTCOME_D, TREND_MIN_SESSIONS, TREND_SE_FLOOR, VOL_BANDS).
BRIEF-4.md and BRIEF-5.md both use sections 0–5. BRIEF-5 is planning only; no migration implementation or new migration export is in this PR. Its owner-ruled mint inclusion preserves the actual boot-versus-merge distinction.

## 2. Executed gates

Windows, Node v24.19.0. Census/oracle/suite/selftest use MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict unsets MEASURED_TEST_NOW. ENGINE_MAIN/ENGINE_OLD reuse the byte-verified fe516c1/a0009c3 artifacts built for module 2. The reference builder was not rerun; no frozen script was changed. The worktree uses an ignored junction to existing dependencies, with no package/lock edits.
Regenerated the private fixture locally from git show fe516c1:ledger/state.json. Re-executed the unchanged golden operation in an isolated scratch mirror. Every complete golden matches its committed pin after only engine-packaging stamp normalization; committed manifest and public goldens are unchanged. No private payload, hash or count is reported or committed.

Final cumulative census, after byte restoration: exit 0. Existing 829/141 leaves remain intact; volume adds 468/155 separately counted leaves. Each raw blob is migrated exactly once by the frozen engine, then the snapshot is passed by value to fresh candidate processes. Verbatim output:

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

The synthetic volume exception is deliberately visible: muscleVolume reaches the already logged D22 sleep.nights shape failure. Both frozen and candidate throw TypeError with `(((s || {}).sleep || {}).nights || []).filter is not a function`. That is exception parity, not a valid muscle-volume answer. An initial exception counter used dot paths although leafPaths returns slash paths; it was corrected before the final output above. The equality comparison always included the exception class/message.

The real `node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-4` exits **1**, as expected before module 5: all six data laws stop at missing T.migrate, while four metadata laws pass. Verbatim verdict/law-ID excerpts and summary (annotations and stack paths omitted):

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

The cumulative runner does not turn those six full-oracle laws green. It proves read-side parity on the frozen migrated inputs; migration/counts/records fidelity still awaits module 5.

`node rebuild/conform/run.cjs`: exit 0. Verbatim SUMMARY block:

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

`node rebuild/conform/run.cjs --selftest`: exit 0, final line:

```text
SELFTEST PASS
```

`node scripts/check.mjs --strict`, without MEASURED_TEST_NOW: exit 0. Verbatim tail:

```text
  PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
  PASS  health data stays unreadable from the public site
  PASS  no token-shaped string anywhere in the tree
  PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
  PASS  CI parses, deploy needs test, production is main-only, ship merges and never rebases
  PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)

All checks passed. Safe to ship.
```

The new file and three moved-from factories passed syntax checks. Two engine instances have distinct function, mutable constant and SEED identities. Public immutable-state/missing-E/ambient-Date probes made 128 reader calls: zero missing dependencies, ambient-clock attempts or attempted state writes; the one retained D22 exception is described above. These source/closure probes ran as scratch diagnostics; the cumulative runner and defect witnesses are tracked and executable by the verifier.
Re-ran the three prior tracked defect-witness files after the ownership moves: module 1 reproduced 10/10, module 2 reproduced 11/11, and module 3 reproduced 5/5. D22 is covered by the fixture exception comparison rather than a separate retained module-2 witness.

`TZ=America/New_York node rebuild/engine/test/defect-witnesses-4.cjs`: exit 0. Verbatim output:

```text
REPRODUCED D28 fixed July week ignores a later training-frequency change (app.jsx:8676,656-666)
REPRODUCED D29 logged front-delt volume loses press indirect credit (app.jsx:8631,8693)
REPRODUCED D30 set-one trend pools sessions across a technique fork (app.jsx:8887-8893,3187-3191)
REPRODUCED D31 volume tolerance is inferred entirely from pre-change sessions (app.jsx:8917-8932,3213,3237-3243)
REPRODUCED D32 replication claims comparable blocks from different technique eras (app.jsx:8971-8979,1798-1813)
DEFECT WITNESSES 4: 5/5 reproduced; behavior intentionally unchanged
```

## 3. Clock sites and memos

**Zero new clock/ID/storage rewrites; zero new memos.** The twelve exact declarations contain no ambient zero-argument Date/Date.now/random read. muscleVolume, structuralMovesThisWeek and volumeConversion call the existing clock-backed todayStart; historical date arithmetic remains explicit. programmeVolume's authored 2026-07-27 week is copied unchanged (D28).
Reused memo paths: volumeImbalance → energyBalanceTarget (app.jsx:4254) → _ebtMemo (4253), and energyBalanceTargetUncached → energyDensity (4802–4809) → _energyDensityLoss (4798); both are created by memoOnState (5157–5166, WeakMap at 5158). muscleVolume → liftCall → bodyAlarm → labGroupsM (12414) → _labMemo (12413). Those existing owners remain in energy/sleep, per engine. No automatic invalidation or altered memo key was introduced; identity-only caching defects remain preserved.

## 4. Bite check and restoration

First and only attempted mutation: volume.cjs:82 / frozen app.jsx:8696, programmeVolume's `const sets = +by[mg].toFixed(1);` temporarily became `const sets = +by[mg].toFixed(1) + 0.1;`. This corrupts the designed allocation without modifying any fixture, reference or expected result. The cumulative check exited 1 and live went RED:

```text
FAIL M2-4 live: [private fixture: detail withheld in code]
```

Restored the exact saved file bytes. Before/after SHA256: **c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4**. Final all-three-blob/two-Date-mode census then exited 0, as quoted in §2. No silent first attempt and no committed mutation. This bite proves an exercised numeric volume leaf; it is not a claim that every prose branch was mutation-tested.

## 5. SEAMS and limits of the evidence

- The unchanged oracle offers no partial mode and has no volume group. The tracked cumulative harness retains the four pinned groups and raw Today inputs, then compares a separate complete volume projection against the same frozen engine/snapshot. No new golden was authored or suite file edited. Canonical comparison preserves string content and array order; object-key ordering follows the existing harness.
- The only migration shim is test-only identity migration after the frozen engine migrates each raw fixture once. No migration enters the product table. New volume outputs include full nested values/prose and explicit exception outcomes. This covers all exercise IDs on the fixtures, not just active IDs; _blockSlope sees stable set-count blocks, and _setsMovesSince is exercised at all-history/current-Monday bounds.
- Four helpers are absent from frozen __test: volBucket, hypGain, _blockSlope, _setsMovesSince. The tracked volume-reference.cjs reads the pinned fe516c1 git blob, verifies its git-object hash, and evaluates exact line slices plus their frozen constants/_tCrit. sessionScore comes from the frozen bundle. It imports no candidate implementation; the four helpers are available only on the reference test table. This extra source-probe seam is required to test them directly.
- volume-projection.cjs's current Monday (2026-08-31) is derived from the pinned manifest day (2026-09-03); the manifest precondition rejects another day. Empty helper cases and a two-set hypGain increment are explicit test inputs, not product rules. These finite fixtures do not establish every branch or call combination.
- The public synthetic muscleVolume exception remains D22. Exceptions are compared, never silently dropped; private exceptions/counts are not exposed. Neither this parity nor the new defect witnesses establishes that the preserved behavior is desirable.
- Scratch source/closure diagnostics complement the tracked checks; the frozen suite/strict gate does not substitute for the later re-pointed writer gate. Three same-family assistants helped with extraction, defect checks and brief drafting/review; this is not Cowork's independent execution or scorecard.
- BRIEF-5 makes a deliberate injection-interface choice: a read-only length/key drafts facade bound locally as localStorage preserves patchV51's exact loop, instead of RECON's proposed drafts.dates() shape. It explicitly requires current empty-default parity and synthetic scan/clock tests. No facade or migration code is built here.
- Brief review reproduced another existing oracle gap with invented state: legacy-records.cjs:11 projects rename .at, while the frozen engine reads .from (app.jsx:544,1822–1828). Altering .from changes historical nameAt but leaves that DTO unchanged. BRIEF-5 requires a synthetic witness and full-post-migration-state differential to detect it. The frozen suite stays unchanged; this is a test seam, not a new copied-volume defect number.

## 6. RECON corrections, not edits

The volume row mixes readers and writers; the current owner ruling explicitly excludes volumePush/sweepVolume/sweepStalls from module 4. Previous closure extraction already housed four volume readers and volBucket in sleep, structuralMovesThisWeek in policy, and coarseLifts in progression; this step relocates those bodies rather than copying duplicates.
RECON's earlier provisional-golden warning is historical: final fe516c1 pins are already present. Its proposed cache invalidation is a future semantic decision, not extraction authorization. Its §5/full-census language does not create a partial CLI; both counts and whole-census laws require migrate. BRIEF-4 says so explicitly.
BRIEF-5 quotes RECON §6 risks 1, 3 and 11 verbatim, followed by those caveats. The module-1 ruling keeps _mintJointEarn with reconcileSightings in module 5, but source inspection shows _settleExit calls reconcileSightings without mint; only merge's exit passes mint:true. Preserve that distinction rather than introducing a new boot write. RECON itself remains untouched.

## 7. What module 4 does not cover

No migrate/patch/reconcile/merge implementation, full-port acceptance, volume writers, general adaptive writers or product-rule correction. No changes to the frozen app, suite, authority/client, deployment, M3 or soak stub. No physical-device test, new cloud service or private import. The post-extraction audit/owner defect rulings and re-pointed second gate remain outstanding. Cowork must execute module 4 independently and review BRIEF-5 before module 5 starts.

## 8. Wall-clock and token accounting

Recorded branch/setup checkpoint: 2026-09-05 02:47:24 UTC. Report assembly checkpoint: 2026-09-05T02:55:51.012Z. Elapsed between those checkpoints: 8.5 minutes, including parallel work, local checks and report preparation. This is wall time, not summed agent engineering time; subsequent PR/CI waiting is excluded. Per-task token usage was not exposed, so no token figure is claimed.

## 9. DEFECT LOG — D28–D32 (preserved)

All five witnesses use invented states with the full extracted createEngine, no substituted dependencies and no private fixtures. Their input objects are deep-frozen. Separate frozen-source probes reproduced the same outcomes. These are candidate future red-first laws, subject to the owner's ruling; no fix is smuggled into this copy.

| ID | Frozen app.jsx evidence | Reproduced behavior and proposed later correction |
|---|---|---|
| D28 | 8676, compared with state-aware dayType 656–666 | programmeVolume always walks 2026-07-27…08-02. A synthetic split effective Aug 1 schedules one current upper day with three sets, but the reader reports six from the old two-day week. Later derive the relevant week from the as-of clock/split contract; preserve the authored date here. |
| D29 | 8631 versus 8693 | programmeVolume maps press's indirect delts credit to delts_front; muscleVolume adds it to delts instead. Two complete upper sessions match designed chest volume, but a synthetic front-delt bucket is designed at seven and logged at four; three half-credit sets vanish from that returned head bucket. Later use one ruled bucket mapping. |
| D30 | 8887–8893 versus 3187–3191 | setOneRead pools four same-load sessions across a technique fork and says LIVE with a positive interval, although only one session belongs to the current era and liftTrend returns null. Later apply the protocol/era boundary before fitting, once ruled. |
| D31 | 8917–8932 versus liftTrend 3213/3237–3243 | The sole post-change three-set session is a hard-event exclusion. volumeConversion nevertheless says LIVE/TOLERATED using four pre-change two-set sessions: its trend ends before changedAt and trend.k differs from result.k. Later require a qualifying post-change trend at the current dose before declaring tolerance. |
| D32 | 8971–8979 versus sameEra 1798–1813 | A rising earlier stable block predates a technique fork. volumeConversion uses it to call the current block REPLICATED and says the blocks are comparable, despite sameEra rejecting every prior point. Later enforce protocol/era comparability on replication evidence. |

Existing D18 (structural feed-prefix truncation), D22 (synthetic sleep shape) and other earlier reports remain applicable; they are not relabeled as new findings. If this report is accepted unchanged, the next new defect number is D33.
