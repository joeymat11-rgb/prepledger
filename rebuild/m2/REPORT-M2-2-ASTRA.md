# M2 module 2 — builder ASTRA

Cumulative sleep, energy and policy read extraction on `rebuild/m2-engine-2`,
base `74497d2` (ROADMAP v1.3 / suite v3.2). Frozen source is
`src/app.jsx @ fe516c1`, v7.56.0 / schema 60, blob
`f98671d823f0d8cd83e730cdd930afe5f5e7b628`; the base now carries those exact bytes.
All listed readers are implemented. No listed item required the writer-stop rule.
The new read closure is larger than RECON estimated; §5 names every expansion.
No preserved defect was repaired. Gate results below establish compatibility,
not correctness of the copied rules or completion of the later engine modules.

## 1. Module map and source ranges

| File under rebuild/engine | Physical lines |
|---|---:|
| dates.cjs | 26 |
| constants.cjs | 405 |
| seed.cjs | 262 |
| plan.cjs | 333 |
| progression.cjs | 757 |
| sleep.cjs | 2095 |
| energy.cjs | 1245 |
| policy.cjs | 849 |
| index.cjs | 25 |
| oracle-shim.cjs | 25 |
| test/census-partial.cjs | 196 |
| test/defect-witnesses-2.cjs | 163 |

Dates, seed, plan and oracle-shim are unchanged. The existing shim already exports
the entire factory table, including all new required names. index adds sleep,
energy and policy; energy initializes before policy because the forecast cache
uses its exact memoOnState helper. constants adds only T95:5745 and LAB_MIN_N:5752.
The 37 remaining progression readers keep their copied bodies; cleanAtDate,
nightsBefore and dayWeather move intact to sleep and remain exported by the engine.
Function bodies, internal comments, string bytes, arithmetic and statement order
are copied. Only three new hour sites and the explicit signalReadCopy color
exclusion differ, itemized in §3. Factories and E forwarding are integration wiring.
HISTORY retains the module-1 provenance and per-instance ownership; sleep now binds
it from E for the lab readers. No new history or athlete-default data was authored.

| Module | Copied declaration | Frozen app.jsx lines |
|---|---|---|
| progression.cjs | progressStep | 926–959 |
| progression.cjs | progressAnchor | 970–995 |
| progression.cjs | maxedOut | 1003–1005 |
| progression.cjs | _padFrom9 | 1019–1022 |
| progression.cjs | _loadTenure | 1034–1046 |
| progression.cjs | _formerNames | 1064–1070 |
| progression.cjs | _volDeltas | 1071–1087 |
| progression.cjs | _setsAtTime | 1098–1112 |
| progression.cjs | targetsFor | 1113–1159 |
| progression.cjs | proposeLadder | 1196–1229 |
| progression.cjs | loadRungs | 1258–1262 |
| progression.cjs | debutDebit | 1271–1274 |
| progression.cjs | nextLoad | 1275–1287 |
| progression.cjs | prevLoad | 1289–1298 |
| progression.cjs | snapLoad | 1300–1305 |
| progression.cjs | deloadLoad | 1310–1319 |
| progression.cjs | parseRungs | 1321–1324 |
| progression.cjs | repsLostOnJump | 1376–1385 |
| progression.cjs | windowFor | 1387–1396 |
| progression.cjs | coarseLifts | 1398–1401 |
| progression.cjs | progressionSetCount | 1414–1457 |
| progression.cjs | atTopOfWindow | 1458–1468 |
| progression.cjs | buildRirSets | 1649–1657 |
| progression.cjs | deriveLastMeta | 1664–1677 |
| progression.cjs | rirSetsOf | 1679–1686 |
| progression.cjs | rirReceipt | 1704–1711 |
| progression.cjs | paceRushed | 1738–1738 |
| progression.cjs | openerRir | 1740–1740 |
| progression.cjs | terminalRir | 1742–1742 |
| progression.cjs | typicalError | 2130–2160 |
| progression.cjs | beatsNoise | 2162–2174 |
| progression.cjs | _deriveSightingFull | 2220–2262 |
| progression.cjs | deriveSighting | 2263–2263 |
| progression.cjs | sessionScore | 3145–3155 |
| progression.cjs | _tCrit | 3160–3160 |
| progression.cjs | liftTrend | 3182–3267 |
| progression.cjs | progressionTrend | 3273–3372 |
| sleep.cjs | readyLowFor | 685–689 |
| sleep.cjs | liftCall | 699–861 |
| sleep.cjs | recoveryIndex | 3570–3630 |
| sleep.cjs | tCrit | 5746–5751 |
| sleep.cjs | ciOf | 5753–5776 |
| sleep.cjs | normSf | 5791–5796 |
| sleep.cjs | twoTail | 5797–5797 |
| sleep.cjs | coFlagRate | 5802–5818 |
| sleep.cjs | chanceWords | 5831–5831 |
| sleep.cjs | ciLine | 5833–5838 |
| sleep.cjs | labAnalytics | 5839–6387 |
| sleep.cjs | fmt12 | 6396–6396 |
| sleep.cjs | todayMeds | 6398–6400 |
| sleep.cjs | medianSOL | 6769–6773 |
| sleep.cjs | lightsOutT | 6789–6800 |
| sleep.cjs | sleepLab | 6803–6852 |
| sleep.cjs | owedLedger | 6863–6879 |
| sleep.cjs | owedNights | 6881–6883 |
| sleep.cjs | nightsBefore | 6994–6996 |
| sleep.cjs | cleanAtDate | 6997–7010 |
| sleep.cjs | sleepMean3At | 7016–7026 |
| sleep.cjs | atSleepTarget | 7029–7037 |
| sleep.cjs | hmToMin | 7057–7057 |
| sleep.cjs | minToHM | 7058–7058 |
| sleep.cjs | medOf | 7059–7059 |
| sleep.cjs | sdOf | 7060–7060 |
| sleep.cjs | sleepAnchor | 7061–7095 |
| sleep.cjs | shelfItems | 7121–7153 |
| sleep.cjs | labAnalytics2 | 7262–7690 |
| sleep.cjs | labGroups | 7769–7814 |
| sleep.cjs | bodyAlarm | 7817–7875 |
| sleep.cjs | pulseRead | 7878–7883 |
| sleep.cjs | tempRead | 7884–7889 |
| sleep.cjs | TRIAL_TPL | 7925–7942 |
| sleep.cjs | trialProposals | 7943–7945 |
| sleep.cjs | trialTpl | 7946–7946 |
| sleep.cjs | trialVerdict | 7961–8055 |
| sleep.cjs | prophetGrades | 8259–8287 |
| sleep.cjs | volBucket | 8627–8627 |
| sleep.cjs | muscleVolume | 8628–8649 |
| sleep.cjs | _blockSlope | 8862–8879 |
| sleep.cjs | setOneRead | 8883–8911 |
| sleep.cjs | volumeConversion | 8913–8989 |
| sleep.cjs | _labMemo | 12413–12413 |
| sleep.cjs | labGroupsM | 12414–12414 |
| sleep.cjs | dayWeather | 12419–12437 |
| sleep.cjs | weekWeather | 12438–12441 |
| sleep.cjs | sleepInfo | 14453–14458 |
| sleep.cjs | weekDay | 14459–14462 |
| sleep.cjs | blackoutOn | 14463–14463 |
| sleep.cjs | nextEvent | 14479–14487 |
| sleep.cjs | eventFocus | 14525–14536 |
| sleep.cjs | lastEvent | 14537–14542 |
| sleep.cjs | nextDow | 14545–14548 |
| sleep.cjs | nextMonthFirst | 14550–14550 |
| energy.cjs | dripOf | 2835–2835 |
| energy.cjs | _sitesKey | 2874–2877 |
| energy.cjs | _skinSeriesKey | 2878–2878 |
| energy.cjs | skinfoldCheck | 2883–2899 |
| energy.cjs | skinfoldSeries | 2902–2921 |
| energy.cjs | skinfoldTrend | 2924–2930 |
| energy.cjs | bfEst | 2932–2947 |
| energy.cjs | anchorTighten | 2959–2972 |
| energy.cjs | proteinTarget | 2977–3001 |
| energy.cjs | proteinHit | 3003–3003 |
| energy.cjs | stepTarget | 3032–3067 |
| energy.cjs | _stateAsOf | 3380–3389 |
| energy.cjs | _regimeRaw | 3391–3404 |
| energy.cjs | regime | 3413–3422 |
| energy.cjs | currentRate | 3424–3504 |
| energy.cjs | paceShown | 3530–3530 |
| energy.cjs | paceProjection | 3532–3549 |
| energy.cjs | readRecency | 3559–3566 |
| energy.cjs | readWindow | 3651–3659 |
| energy.cjs | missedReadCost | 3664–3671 |
| energy.cjs | stepKcal | 3729–3733 |
| energy.cjs | observedTDEE | 3735–3856 |
| energy.cjs | calorieFloor | 3902–3914 |
| energy.cjs | dietExit | 3948–3987 |
| energy.cjs | costingStep | 4118–4127 |
| energy.cjs | _costingWeeks | 4133–4143 |
| energy.cjs | energyBalanceTargetUncached | 4145–4245 |
| energy.cjs | _ebtMemo | 4253–4253 |
| energy.cjs | energyBalanceTarget | 4254–4254 |
| energy.cjs | calorieTarget | 4256–4355 |
| energy.cjs | energyAvailability | 4416–4478 |
| energy.cjs | etaWeeks | 4481–4491 |
| energy.cjs | etaRange | 4498–4505 |
| energy.cjs | apModeOf | 4590–4590 |
| energy.cjs | cutRateBand | 4591–4615 |
| energy.cjs | bodyCompBand | 4623–4636 |
| energy.cjs | rtAdherence | 4645–4651 |
| energy.cjs | partitionRates | 4652–4673 |
| energy.cjs | partitionPrior | 4749–4777 |
| energy.cjs | energyDensityUncached | 4779–4797 |
| energy.cjs | _energyDensityLoss | 4798–4798 |
| energy.cjs | energyDensity | 4802–4809 |
| energy.cjs | tdeeLearned | 4817–4852 |
| energy.cjs | adaptationSignal | 4859–4930 |
| energy.cjs | memoOnState | 5157–5166 |
| energy.cjs | liveRollups | 6935–6964 |
| energy.cjs | stepEfficacy | 7164–7187 |
| energy.cjs | stepPush | 7218–7260 |
| policy.cjs | cap | 3568–3568 |
| policy.cjs | digitalTwin | 4675–4712 |
| policy.cjs | twinBodyComp | 4718–4729 |
| policy.cjs | normCdf | 4955–4960 |
| policy.cjs | coneHalfWidth | 4967–4972 |
| policy.cjs | rateDivergence | 5007–5086 |
| policy.cjs | redlineCrossing | 5088–5133 |
| policy.cjs | forecastUncached | 5168–5201 |
| policy.cjs | _forecastCached | 5202–5202 |
| policy.cjs | forecast | 5205–5205 |
| policy.cjs | safeCrossing | 5210–5210 |
| policy.cjs | conditionalForesight | 5225–5242 |
| policy.cjs | etaReached | 5249–5249 |
| policy.cjs | autoPilot | 5264–5344 |
| policy.cjs | autonomyOf | 5366–5369 |
| policy.cjs | escalation | 5384–5401 |
| policy.cjs | autoPilotPolicy | 5410–5423 |
| policy.cjs | confidenceField | 5428–5439 |
| policy.cjs | whyThisNumber | 5446–5474 |
| policy.cjs | trackRecord | 5482–5509 |
| policy.cjs | daysBetween | 5530–5530 |
| policy.cjs | _phaseSafe | 5531–5531 |
| policy.cjs | dietBreakHonest | 5536–5543 |
| policy.cjs | dietBreakState | 5547–5563 |
| policy.cjs | phaseArc | 5569–5612 |
| policy.cjs | _phaseSince | 5615–5619 |
| policy.cjs | phaseSupervisor | 5630–5666 |
| policy.cjs | phaseProposal | 5672–5722 |
| policy.cjs | structuralMovesThisWeek | 8815–8836 |
| policy.cjs | proposalDial | 9812–9817 |
| policy.cjs | proposalEffect | 9833–9844 |
| policy.cjs | activeAdjustment | 9848–9862 |
| policy.cjs | apSteerHandled | 9866–9870 |
| policy.cjs | trendSeries | 15046–15053 |
| policy.cjs | weightNoise | 15059–15071 |
| policy.cjs | signalTicks | 15085–15093 |
| policy.cjs | signalState | 15094–15128 |
| policy.cjs | signalReadCopy | 15146–15168 |

Names beginning with an underscore memo and TRIAL_TPL are included above as
non-function dependencies so their provenance is explicit. Unchanged foundation
and plan ranges are in REPORT-M2-1-ASTRA.md. Independent verification results are
recorded in section 8.

## 2. Executed gates

Node 24.19.0, esbuild 0.28.1, Windows. Census/suite use
MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York. Strict uses the same zone with
MEASURED_TEST_NOW unset, retaining its own July 29 default. The partial runner
imports the unchanged census and harness, golden-migrates each fixture once and
passes that JSON snapshot to fresh frozen/native-Date candidate processes.

Commands: `node rebuild/engine/test/census-partial.cjs`;
`node rebuild/conform/run.cjs`; `node rebuild/conform/run.cjs --selftest`;
`node scripts/check.mjs --strict`. ENGINE_MAIN and ENGINE_OLD point to locally
rebuilt, commit-verified fe516c1 and a0009c3 artifacts outside the repository.

Partial census tail, including the private verdict only:

```text
GREEN M2-2 manifest: fe516c1 / v7.56.0; clock, zone and census version pinned
GREEN M2-2 preimage-2026-08-15: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-2 synthetic-pending-debut: fixture/golden/stamp pins; frozen migrated snapshot matches golden
GREEN M2-2 SEED: canonical byte equality to frozen __test.SEED in both Date modes
GREEN M2-2 preimage-2026-08-15 Date=frozen: lifts + progression + energy + raw Today inputs byte-identical (822 leaves)
GREEN M2-2 preimage-2026-08-15 Date=unfrozen: lifts + progression + energy + raw Today inputs byte-identical (822 leaves)
GREEN M2-2 preimage-2026-08-15: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-2 synthetic-pending-debut Date=frozen: lifts + progression + energy + raw Today inputs byte-identical (136 leaves)
GREEN M2-2 synthetic-pending-debut Date=unfrozen: lifts + progression + energy + raw Today inputs byte-identical (136 leaves)
GREEN M2-2 synthetic-pending-debut: frozen/unfrozen Date outputs identical; clock still injected
GREEN M2-2 live: [private fixture: detail withheld in code]
PASS M2-2 partial census: all required blobs; two Date modes; migration once per fixture
```

Unchanged suite SUMMARY:

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

Strict gate tail:

```text
Suite
  PASS  engine suite — 3072 assertions passed
  PASS  render smoke — RENDER-SMOKE: all tabs alive in all states — no silent fallbacks
  PASS  dom smoke — DOM-SMOKE: the shipped bundle boots clean, both hostile-storage boots banner without touching the blob, and reset over a corrupt blob stashes before it overwrites
  PASS  split smoke — SPLIT-SMOKE: both modes drive the debut load and the pre-upgrade draft through the REAL handlers — render, type, finish, persist
  PASS  beacon smoke — BEACON-SMOKE: records faults, redacts tokens, and cannot break the app

Gate
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

The 29 absent policy/progression adapter laws are RED-as-specified. Copying frozen
policy readers does not implement the later ratified rebuild/policy family.
Unlike module 1's old base, suite v3.2 now runs rig185 against the frozen engine:
W1 PASS, W2 PASS. Frozen app, suite, client and authority diffs remain empty.

The committed reference builder assumes POSIX file URLs and removes temporary
files/worktrees. A scratch helper instead verified existing detached source
commits and performed the same esbuild operation with Windows paths, preserving
all files. Sandbox path resolution required the build to run outside the sandbox.
Artifacts are ignored/outside the product. SHA256 main:
`ef574bc82f18fe555d70a9387e9cd8c5c8984b988be3fbea5f4272770f041ab5`;
old: `e6ce0c9e4d483744a8b7a579bf38e6bef923c57ccd0a8ef3382d5558d271a29b`.
Packaging hashes differ from the integrator's, as build-engines documents.
The unchanged port-oracle golden command was also run in an isolated scratch mirror:
`port-oracle.cjs golden <engine-main> main "fe516c1 (v7.56.0, frozen main)"`.
Both complete public goldens reproduce the committed bytes after replacing only
stamp.engineSha256 with the committed engine stamp. Private regeneration: PASS.
Normalized manifest semantics also match: only the rebuilt main engine/golden
packaging hashes and Windows path separators differ. The generated provisional
status sentence is identical to the committed one. All committed goldens and the
manifest remain byte-identical; the partial census, suite and selftest were run
again after regeneration. private/live.json was regenerated from fe516c1 and
matched its committed source pin without printing its contents.

## 3. Clock sites, explicit UI exclusion and memo inventory

Three new ambient hour expressions rewritten, and no other new clock rewrite:

| Source site | Frozen expression | Extraction |
|---|---|---|
| readWindow:3652 | new Date().getHours() | clock.hour() when explicit hour absent |
| owedLedger:6863 | new Date().getHours() default | clock.hour() default |
| owedNights:6881 | new Date().getHours() default | clock.hour() default |

Module 1's todayStart:308 rewrite remains mk(clock.today()). All explicit-argument
Date arithmetic and existing calls through todayStart/daysUntil are preserved,
including their local-zone/DST assumptions. There is no direct ambient Date
constructor or Date.now call in the extracted modules. The oracle clock already
provides hour and local-noon values; no new shim special case was needed.

The only other source transformation is mandated by BRIEF-2: signalReadCopy omits
the wordColor declaration:15150 and returned wordColor property:15167. All remaining
fields and prose match the frozen function. No theme dependency enters the engine.

| Memo | Source | Ownership and preserved behavior |
|---|---|---|
| _ebtMemo | 4253; memoOnState 5157–5166 | New WeakMap on each energy factory invocation; energyBalanceTarget retains its existing options bypass |
| _energyDensityLoss | 4798; memoOnState 5157–5166 | Separate per-engine WeakMap, identity-only state key |
| _forecastCached | 5202; memoOnState 5157–5166 | Per-policy-factory WeakMap via the shared helper; forecast(s, opts) bypass unchanged |
| _labMemo | 12413–12414 | Direct new WeakMap inside sleep factory; labGroupsM's caught-error and identity-cache semantics unchanged |

No cache invalidation, version key or changed copy discipline is smuggled in.
Per-instance isolation does not fix stale reads when the same state object or
clock changes; D13/D20 and RECON risk 3 describe that remaining contract problem.
Call-local arrays, maps and progression typicalError's fkCache are not shared memos.

## 4. Live bite and byte restoration

First and only attempted mutation: observedTDEE's source line 3807 calculation
`const tdee = kcal(fatWk);` temporarily became
`const tdee = kcal(fatWk) + 123;`. This changes one energy result, not the gate.
The candidate still loaded and compared; each public fixture had five mismatching
energy paths in each Date mode. Private verdict: FAIL. No silent first attempt.
A finally block restored the original buffer byte-for-byte, then the whole
cumulative gate passed again on all required blobs in both Date modes.

Restored energy.cjs SHA256:
`dca9e0c287cf64bf70881b2a13e7621478e0daa1221cc2dcbb94f6a75172b81c`.

## 5. SEAMS — extraction, coverage and evidence

1. Factories and E forwarding preserve cycles; snapshots, constants and caches
   belong to an engine instance. No frozen function imports the monolith or suite.
2. sleep's three moved functions preserve the cumulative module-1 surface. Its
   requested bodyAlarm reaches labGroupsM → labGroups → labAnalytics/labAnalytics2,
   sleepLab and shelfItems, including muscleVolume/liftCall and volume/trial helpers.
   This read closure is copied intact despite RECON's blanket lab/narration exclusion;
   a missing function would be caught and silently change bodyAlarm's canary output.
   sleep contains 53 readers plus TRIAL_TPL and _labMemo. The source table names them.
3. An independent full-reader probe caught an extraction omission the census missed:
   labAnalytics/labAnalytics2 need imported HISTORY, which a top-level-declaration-only
   scanner did not see. sleep now binds E.HISTORY. This fixes extraction wiring only;
   the copied bodies and source data are unchanged. No missing-dependency stub remains.
4. energy adds liveRollups:6935–6964 because stepEfficacy calls it. It reads the
   preserved seed ROLLUPS too; removing that coupling would change the frozen rule.
5. policy adds signalTicks, structuralMovesThisWeek, cap, daysBetween, _phaseSafe
   and _phaseSince. structuralMovesThisWeek is parked here for autoPilot until the
   later volume module; it reads receipts and returns evidence, never files a proposal.
6. The oracle has no partial mode. The cumulative runner projects lifts, progression
   and energy from its unchanged census. It keeps the mandatory private fixture,
   seed parity, pin checks, one migrated snapshot and isolated Date-mode workers.
7. The committed census rounds currentRate and projects progressionTrend. Additional
   raw currentRate/regime/progressionTrend references therefore come from the same
   pinned frozen engine over the same migrated state in memory, after the three
   committed groups match their golden. Every raw field and regime.why is compared;
   this supplements the committed golden and is not a new persisted golden.
8. statusFace/statusTarget are still absent; their Today DTO is not compared here.
   Their requested numerical/prose inputs are compared. Migration is the unchanged
   golden engine's once-per-fixture work, not candidate migration or a fallback reader.
9. The census does not independently cover every forecast, phase, proposal, sleep,
   lab, energyBalanceTarget or stepTarget branch. Full-source/dependency checks and
   synthetic witnesses are separate evidence; they do not replace the later second gate.
10. Preserved-defect diagnostics use invented data. D12 clears only the test engine's
    ROLLUPS array to isolate synthetic weeks; D20 builds a real policy factory with
    six explicitly disclosed deterministic read dependencies to isolate its cache.
    D19 uses the existing explicit date/supervisor arguments. No product test hooks.
11. Full suite PASS includes RED-as-specified absent families and historical model
    artifacts. Strict tests the unchanged frozen app, not the extracted engine.
    CI and local passes are not evidence of a phone soak, durable storage or launch.
12. The module-1 scorecard's same-day-decrease coverage gap remains disclosed; this
    module did not change frozen fixtures or attempt to turn that old gap green.

## 6. RECON / brief corrections (documents not edited)

- The golden is final at fe516c1 and the base now holds v7.56.0; RECON's provisional
  introduction is stale. Its function ranges include following comments, so §1 uses
  exact declaration bounds.
- sleepAnchor exists at 7061–7095; the question mark can be removed in a future edit.
- The blanket exclusions for labAnalytics/labAnalytics2/labGroups/sleepLab/shelfItems,
  lightsOutT/medianSOL, liveRollups and volume/trial helpers conflict with the requested
  readers' actual call graph. These read dependencies are required for faithful
  bodyAlarm and stepEfficacy. They are copied, not replaced with no-ops or partial labs.
- phaseProposal/trialProposals allocate returned proposal descriptions, not persisted
  proposals. No listed module-2 item invokes a writer; _stampPlan, applyRead/undoRead
  and all filing paths stay excluded. The owner's module-1 _mintJointEarn exclusion
  remains in force.
- RECON risk 3's proposed invalidate/versioned cache is a semantic improvement;
  this copy deliberately does not implement it. Date/timezone arithmetic and rounding
  likewise remain unchanged.
- BRIEF-2 §4(7)/(9) still says “module 1”; this report interprets those inherited
  labels as module 2's scope and continuing frozen-fidelity/defect-log obligations.

## 7. Not covered

No candidate migrate/merge, completeSession/earnWalk, applyRead/undoRead, _stampPlan,
runAdaptive/apply*/sweep writers or client integration. No Today screen/read facade,
new policy/progression adapter, persistent store, network, deployment, data port or
new athlete onboarding. The later engine-test/sync-laws/engine-surface second gate
has not been repointed here. Existing mathematical, date, heuristic and cache rules
are preserved pending the post-extraction audit and owner rulings.

## 8. Time and independent review

Module-2 branch creation was 2026-09-04 22:16:06 UTC. Technical validation completed
at 2026-09-04 22:33:03 UTC; branch-to-validation elapsed 16 minutes 57 seconds. The M3 plan
ran in parallel, so these are elapsed wall-clock figures, not allocated engineering
hours. Exact token usage is not exposed. Two subagents extracted energy and
policy in parallel; the root built sleep, closure wiring, cumulative gates and report;
one subagent additionally audited the complete extraction independently.

Independent audit: 310 copied declarations match the frozen source with only the
authorized day/hour and UI exclusions; all three moved helpers match exactly.
Deep object-graph checks found no shared instance objects, and four cache probes
confirmed separate outputs per engine. All callable new readers were exercised
with deep-frozen synthetic inputs, instrumented catches/dependency access and an
ambient-clock trap: no state writes, missing dependencies, ambient attempts or
synthetic exceptions after the HISTORY wiring correction. Full selected outputs
match the frozen engine on the public preimage (12 outputs) and pending fixture
(9 outputs plus the same 3 existing exceptions). The latter is a preserved input
shape assumption, not evidence that those readers successfully handle that fixture.

## 9. DEFECT LOG — D11 onward, preserved without fixes

All lines refer to app.jsx @ fe516c1. These are witnessed code facts and candidate
red-first laws for the owner, not clinical advice or an authorization to change rules.
Each D11–D20 observation matched exact frozen-source declarations and extracted code;
D21 also matched the original sleepInfo declaration. D22 is from the independent
full-reader comparison on the committed public synthetic fixture. Reproduce the
retained D11–D21 diagnostics:
`TZ=America/New_York node rebuild/engine/test/defect-witnesses-2.cjs` (PowerShell: set
`$env:TZ='America/New_York'` first). Every substitute is declared in its test comment.

| ID | Frozen app.jsx lines | Evidence | Candidate later ruling |
|---|---|---|---|
| D11 | 3815–3816,3840,3844 | Ten synthetic +0.1 lb/day readings, 2,000 kcal and identical steps yield rate −0.7, tdee 1620, lo 2000 > hi 1620. Negative halfwidth then makes stepPromoted true for stepDelta 0. | Preserve interval endpoint order for gains and losses; do not promote zero drift through a negative noise width. |
| D12 | 6962,7176 | liveRollups already reports avgSteps in thousands. Synthetic slope 0.1 lb/week per 1,000 steps becomes slopePer1k 100, against bound 0.065, resolved false. | Establish one unit owner and remove double scaling only after a ruled law. |
| D13 | 5158–5163,4798,4803 | energyDensity on a DEXA state remains the identical 3859 result after trend 180→160; energyDensityUncached returns 3499. | Enforce immutable state or define invalidation/version ownership; preserve identity caching now. |
| D14 | 3485,3501,2835 | Missing model.drip gives dripOf 0 and currentRate.scale 1, but currentRate.fat is NaN because it reads undefined directly. | Use one default consistently or validate the required field explicitly. |
| D15 | 4435–4437 | Eight sessions and eight food rows over 21 days produce sessPerWk 7/trainKcal 300, because weeks = food-row count/7. Sparse food logging inflates session frequency. | Derive elapsed weeks independently of food completeness; rule any fallback separately. |
| D16 | 5483,5488,5491–5495 | An Aug 1 seven-day forecast is graded a hit by the first available read on Sep 1; there is no latest acceptable date or read-class filter. | Bound or label the actual horizon and eligible read class. |
| D17 | 5502–5503 | A synthetic adjustment with undone:true is reported applied:true because trackRecord tests only !dismissed. | Preserve the undo state in the displayed decision history. |
| D18 | 8827–8830 | Eighty current-week ordinary notes hide a current-week volume receipt at row 81; moving the same receipt to row 1 changes structuralMovesThisWeek from zero to one. | Read the qualifying record set rather than a presentation-sized prefix. |
| D19 | 5559,5594,5605 | A Sep 1–7 break remains active on Sep 7, while phaseArc calls it day 6 of 7 and says the cut resumes Sep 7. | Rule inclusive boundaries and make day numbering/resumption prose consistent. |
| D20 | 5202,5205,5157–5166 | Under controlled actual-policy dependencies, forecast(s) retains rate 1.4 after the same state's rate changes to 0.5; forecast(s,{}) returns 0.5. | Define cache lifetime alongside state and clock lifetime. |
| D21 | 14455 | On New York's 2026-11-01 fall-back day, todayStart+DAY still formats as Nov 1. sleepInfo reports clean:true with a same-date one-hour night, while cleanAtDate for calendar tomorrow Nov 2 is false. | Decide calendar-day semantics and derive tomorrow accordingly; this is another concrete consequence of D10. |
| D22 | 3592,7062,7821 | The golden-migrated synthetic-pending-debut fixture retains sleep.nights as an object. Exact original and copied recoveryIndex, sleepAnchor and bodyAlarm each throw when array methods are called; the cumulative census can still pass because it does not call these full readers. | Rule a validated state-shape boundary or normalization ownership; do not disguise existing exceptions with empty-array fallbacks during extraction. |

```text
REPRODUCED D11 gaining rate reverses TDEE endpoints and promotes zero step drift (app.jsx:3815-3816,3840,3844)
REPRODUCED D12 step efficacy scales an already-per-thousand slope again (app.jsx:6962,7176)
REPRODUCED D13 energy-density identity cache survives changed state (app.jsx:5158-5163,4798,4803)
REPRODUCED D14 currentRate bypasses the missing-drip default and returns NaN (app.jsx:3485,3501,2835)
REPRODUCED D15 food-row count inflates session frequency across a sparse interval (app.jsx:4435-4437)
REPRODUCED D16 a much later read is graded as a seven-day forecast hit (app.jsx:5483,5488,5491-5495)
REPRODUCED D17 an undone adjustment is reported as applied (app.jsx:5502-5503)
REPRODUCED D18 an eighty-row feed prefix hides a current-week volume receipt (app.jsx:8827-8830)
REPRODUCED D19 break-end wording resumes the cut while the break is still active (app.jsx:5559,5594,5605)
REPRODUCED D20 forecast identity cache retains an earlier rate (app.jsx:5202,5205,5157-5166)
REPRODUCED D21 fall-back sleepInfo skips the same-date night (app.jsx:14455)
DEFECT WITNESSES 2: 11/11 reproduced; behavior intentionally unchanged
```
