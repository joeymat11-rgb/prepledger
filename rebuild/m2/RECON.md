# M2 RECON — THE ENGINE (extraction of the decision engine from the frozen app)

Source: /home/claude/wt-live/src/app.jsx @ fe516c1 (v7.56.0, SCHEMA_V 60, 22,361 lines). Read-only; nothing under wt-live touched.
Oracle: /home/claude/conform/oracle/{census.cjs, port-oracle.cjs, legacy-records.cjs}; goldens in conform/golden + conform/private
(PROVISIONAL, cut from main a0009c3 = v7.55.9 SCHEMA_V 59; clock 2026-09-03 America/New_York; census v3, 3,816 required leaves on the preimage).
Target: /home/claude/rebuild/engine/*.cjs (CommonJS, zero deps, same shape as rebuild/client which already injects `clock`).

Layout of app.jsx that matters: lines 1–632 tokens/theme/date utils/SEED+weave; 630 "ENGINE — pure functions" banner; 633–12337 the engine
proper (with a few lab React components embedded at 7714–7768); 12338 `export const __test = {...}`; 12344–13290 sync/storage/analyst
(impure); 13289–14453 durability guard + merge; 14453–14712 derived helpers + ~160 more `__test.x = x` lines; 14718+ UI components;
15046–15536 signalState/statusFace/marchingOrder/statusTarget/nowModel (engine functions living among UI); 19595–19870 GymMode helpers.
The `__test` object is assembled at 12338 and extended at 14552–14712, 15255–15266, 15415, 15537–15552, 19769.

## 1. ENGINE INVENTORY

Line counts are "start → next top-level declaration" (comments included). R = reads, W = writes (in place unless noted).

### (a) Migration / state shape — ~1,900 lines
| function | lines | notes |
|---|---|---|
| SEED literal + weave() IIFE | 435–594 | seed authored already-current; weave reads HISTORY (src/history.js, 42 rows, 9 KB) into reads/dailyLogs/sleep.nights/weekly; MUTATES module-level SEED at load |
| EXERCISES | 386–432 | 16 lift records (part of SEED) |
| PATCHES table | 11983 | 57 entries [4..60]; migrate = reduce over PATCHES |
| patchV4–patchV60 | 10675–12000 (~1,300) | order in file is NOT numeric; W: everything; several unshift feed receipts; V51 (130 lines) reads localStorage + clock; V60 reads SEED.insertions; V5/V6/V7/V8/V10 read SEED.exercises/exOrder |
| _fileKnownCorr | 11219 | helper for V58/V59 correction receipts |
| migrate(old) | 12263 (81) | 4 exits: same-schema → _settleExit; v>SCHEMA_V → untouched; 3≤v<60 → deep-clone + patch chain + settle; else fresh SEED (+v1/v2 legacy replay, W: new Date().toISOString() at 12299) |
| _settleExit | 12222 (41) | reconcileLiftCaches, reconcileCorrectedLoads, reconcileEraTransitions(normalizePlan), suggestionLog/adjustments `ord` mint, fork restatement, plan.setAt/rev, reconcileTrendChain, reconcileReadReceipts, reconcileSuggestionEffects, reconcileSightings, reconcileDebutQueue, _feedSorted, _sugSorted |
| reconcileLiftCaches / ensureLoadOnLadder / reconcileCorrectedLoads | 12001 / 12057 / 12099 (~220) | W: ex.last, ex.lastMeta, ex.steps, ex.w (from sessionLog + corrLog) |
| reconcileReadReceipts / reconcileTrendChain / reconcileSuggestionEffects | 10298 / 10370 / 10439 (~360) | W: feed (lateread receipts), reads[].pt, s.trend, s.weekly, suggestionLog effects, adjustments |
| canonicalizePlan / normalizePlan / deriveInsertionSeams / applyInsertionSeams | 1876 / 1988 / 2037 / 2072 (~215) | W: retirements, exercises[].quarantined/forks, feed seam lines, exOrder, planGen, insertions; reads INSERTION_PAIRS, RULED_ORDER, _bornValid |
| reconcileSightings / reconcileDebutQueue / reconcileEraTransitions / _mintJointEarn | 2321 / 2362 / 2381 / 2277 (~170) | W: ex.topAt/topRun, queue[].done/state, feed replay/adoptshift lines |
| recordCounts / dataLossGuard | 13289 / 13328 (~80) | pure; the "never shrink" guard ghSync + save use |

R for the whole group: every top-level key of state. Census binds migration to behaviour (recordsChangedByMigrate per class) so every patch's receipt prose, order and dedup ops are load-bearing bytes.

### (b) Body-composition / energy — ~1,900 lines
| function | lines | R | W |
|---|---|---|---|
| currentRate | 3424 (106) | weekly, reads(!sealed,!offWindow, last 28), model.drip | — (HAC/Newey-West regression) |
| _stateAsOf / _regimeRaw / regime / REGIME_HOLD_D | 3380 / 3391 / 3413 (44) | progressionTrend + currentRate over a date-truncated shallow copy | — ; regime reads clock for asOf |
| observedTDEE | 3735 (167) | blackout.until (clock), dailyLogs (cal/steps), dayCtx.est, trend; energyDensity | — |
| calorieFloor | 3902 (46) | bfEst, energyAvailability | — |
| proteinTarget / bfEst / anchorTighten / dripOf | 2977 / 2932 / 2959 / 2835 (~90) | model.{lean,anchorISO,drip,src}, trend; bfEst default atISO = today (clock) | — |
| cutRateBand / bodyCompBand / apModeOf / BC | 4591 / 4623 / 4590 / 4523 (~110) | trend, plan.apMode | — |
| calorieTarget | 4256 (160) | observedTDEE, cutRateBand, calorieFloor, energyDensity, activeAdjustment, PHASES[s.phase], dailyLogs (last 7) | — |
| energyBalanceTargetUncached / energyBalanceTarget (memo) / costingStep / _costingWeeks | 4145 / 4254 / 4118 / 4133 (~140) | regime, calorieTarget, observedTDEE, energyDensity("gain"), BC; clock for asOf | — |
| energyAvailability / stepKcal | 4416 / 3729 (~70) | dailyLogs (21 days, clock), sessionLog, bfEst, trend | — |
| energyDensityUncached / energyDensity (memo) / partitionPrior | 4779 / 4802 / 4749 (~60) | bfEst, learned.anchors, model.src | — |
| tdeeLearned / adaptationSignal | 4817 / 4859 (~140) | learned.tdee, observedTDEE | — (not censused; forecasts/feed only) |
| readRecency / STALE_DAYS | 3559 (9) | reads; clock | — |
| signalState / weightNoise / trendSeries / signalReadCopy | 15094 / 15059 / 15046 / 15146 (~120) | currentRate, reads, trend | — (signalReadCopy returns a T.* colour) |
| autoPilot | 5264 (102) | currentRate, observedTDEE, bodyCompBand, readRecency, structuralMovesThisWeek, energyDensity, stepTarget, apSteerHandled(clock), proteinTarget, dailyLogs.pro | — |
| autonomyOf / escalation / autoPilotPolicy / confidenceField / whyThisNumber / trackRecord | 5366–5530 (~165) | plan.autonomy, autoPilot, signalState, readRecency, proposals(gate==="coach"), forecasts, adjustments | — |
| stepTarget / stepPush / stepEfficacy | 3032 / 7218 / 7164 (~210) | dailyLogs steps (21 d, clock), observedTDEE, activeAdjustment, recoveryIndex, bodyCompBand | — |
| paceProjection / readWindow / missedReadCost | 3532 / 3651 / 3664 (~50) | currentRate, trend; readWindow reads HOUR (new Date().getHours()) | — |
| applyRead / undoRead | 3672 / 10274 (~80) | blackout(clock), readWindow(hour), dailyLogs (sodium/alc), reads | returns a CLONE: reads[], feed lateread receipt, trend |
| forecastUncached / forecast (memo) / safeCrossing / redlineCrossing / rateDivergence / coneHalfWidth / normCdf / digitalTwin / twinBodyComp / conditionalForesight / etaWeeks / etaRange / FORE | 4675–5250 (~500) | currentRate, signalState, cutRateBand, digitalTwin(observedTDEE,bfEst,energyDensity,stepTarget), forecasts | — (statusFace reaches it via safeCrossing) |
| phaseArc / dietBreakState / phaseSupervisor / phaseProposal / _stampPlan / dietExit | 5547–5746, 9875, 3948 (~300) | plan.phase/brk/phaseLog, regime, observedTDEE, bfEst; clock | _stampPlan W: plan.setAt (new Date), phaseLog (+_freshId) |

D13/D14 note: those are the REBUILD's sheet policies (protein minimum by phase; floor = 30 kcal/kg lean_HIGH + training energy), modelled in
conform/reference/policy.cjs and expected as adapters/policy.cjs (tranche T4). They do NOT exist in the frozen app — the frozen engine has
proteinTarget (2.5 g/kg FFM, ±5 g rounding) and calorieFloor (EA_SPARING 25 × FFM + eee, /50 rounding). The census pins the FROZEN numbers.
D7 ladder (7 missing dates → WEIGH_IN_STALE) is likewise a rebuild policy; the frozen analogue is readRecency (STALE_DAYS 3) + autoPilot.heldForStale.
Staleness/confidence gates in the frozen engine: readRecency.stale, autoPilot.driftSig/heldForNoise, signalState, escalation.abstain.
Steer/proposal logic: autoPilot (action/corrKcal/proposed) → runAdaptive files a proposal card → applyProposal writes an adjustments row →
activeAdjustment offsets calorieTarget/stepTarget until the next weigh-in.

### (c) Training progression — ~2,300 lines
| function | lines | R | W |
|---|---|---|---|
| dayType | 656 (29) | split[], targets.refeedOff; DATED legacy fallback | — |
| exActive / _bornValid / RULED_ORDER / RULING_EPOCH / SPLIT_DATE | 1847–1875 | retirements, exercises[].quarantined | — |
| forksOf / resetForksOf / forkFrom / eraIdx / sameEra / nameAt / eraFresh / forkExposures / pinsUnfilled / pinsBornOf | 1773–2130 (~120) | exercises[].forks/renames/fork/calibratedAt/setup; sessionLog; clock (eraFresh default asOf) | — |
| _loadTenure / _formerNames / _volDeltas / _setsAtTime | 1034 / 1064 / 1071 / 1098 (~80) | sessionLog, ex.w/wKey, feed "VOLUME ±N — MG via NAME" prose (parsed by regex), forks/renames prevN | — |
| progressionSetCount / atTopOfWindow / maxedOut / _padFrom9 | 1414 / 1458 / 1003 / 1019 (~75) | above + clock (through default) | — |
| progressStep / progressAnchor / rirSetsOf / openerRir / terminalRir / deriveLastMeta / buildRirSets / rirReceipt | 926 / 970 / 1679 / 1740 / 1664 / 1649 / 1704 (~150) | ex.lastMeta, sessionLog, forks; clock (progressAnchor atA) | — |
| targetsFor | 1113 (83) | ex.std/reclaim/first/last/sets/hi, progressAnchor, progressStep, progressionSetCount, maxedOut | — (CENSUSED per active lift) |
| loadRungs / nextLoad / prevLoad / snapLoad / deloadLoad / parseRungs / windowFor / repsLostOnJump / coarseLifts / proposeLadder / sweepLadders / debutDebit | 1196–1400 (~200) | ex.steps/inc/w/hi/lo, sessionLog | sweepLadders W: proposals |
| typicalError / beatsNoise / PUBLISHED_SET_SEM | 2130 / 2162 (~90) | sessionLog same-load same-count pairs, forks; clock (asOf default) | — |
| _deriveSightingFull / deriveSighting | 2220 / 2263 (~45) | sessionLog, feed " EARNED$" lines by name family, forks, _volDeltas | — (oracle OPTIONAL) |
| earnWalk | 2466 (93) | ex.topAt/topRun/holdFlag/wSets, en.rir/rirSets/rirEnd, queue, beatsNoise, typicalError | W: ex.topAt/topRun, queue push (debut ids `q_<id>_<w>_<earnDay>[_1s|_2r]`, newWSets vector), feed via push() |
| completeSession | 2559 (276) | everything training-side | returns {s: clone, lines}: sessionLog[iso], ex.last/lastMeta/w/wAt/sets/setsAt/steps/stepsAt/topAt/topRun/holdFlag/rirHist, queue debut done, feed; `new Date().toISOString()` stamps at 2619/2620/2695/2699/2705 |
| takeProposedDebut / reconcileDebutQueue | 2341 / 2362 (~40) | queue | W: queue state/done/t (consent meaning) |
| liftCall | 699 (227) | sessionLog, sleep, pulse, energy, medsLog, feed "RESET APPLIED", recoveryIndex, bodyAlarm, dayWeather; clock | — (verdict + prose) |
| genSession / sessionFromDraft / pickStructural | 1481 / 1602 / 1471 (~180) | dayType, exOrder, queue debut/unlock, targetsFor, rirPlan, restFor | — (returns session plan) |
| liftTrend / progressionTrend / sessionScore / _tCrit / TREND_* | 3145–3372 (~230) | sessionLog, forks, dayWeather, paceRushed, cleanAtDate; clock (liftTrend atT) | — (CENSUSED) |
| muscleVolume / programmeVolume / volumeImbalance / structuralMovesThisWeek / volumeConversion / volumePush / sweepVolume / sweepStalls / sweepLab / INDIRECT / VOL_BANDS / HYP_B | 8628–9306 (~680) | sessionLog, exercises, feed "VOLUME" prose, adjustments, agentProposals, recoveryIndex; clock (Monday, dow) | sweep* W: agentProposals (ids embed Date.now()), proposals |
| cleanAtDate / atSleepTarget / sleepMean3At / nightsBefore / sleepInfo / owedNights / owedLedger / DEBT_* | 6994–7057, 6863–6886, 14453 (~90) | sleep.nights, sleep.cleanH/needed; clock+hour | — |
| dayWeather / weekWeather / nextEvent / lastEvent / eventFocus | 12419 / 12438 / 14479 / 14537 / 14525 (~110) | dayCtx, events, blackout, medsLog, dayType; clock (daysUntil) | — |
| recoveryIndex / bodyAlarm / rirPlan / restFor / restLine / effortWords / paceRushed | 3570, 7817, 6672, 19595, 19601, 19775, 1738 (~230) | sleep, pulse, energy, soreness, grip, sessionLog | — |

Seams/forks/renames: forks[] = technique (reset-bearing) vs context (split/insertion, comparability only); renames[] name history; INSERTION_PAIRS
[["fly",[]],["hipthrust",["ham"]]]; seams are (re)derived by deriveInsertionSeams on every canonicalizePlan; forks are restated at _settleExit AND
unioned by (from|class) in mergeState; the two restatements must stay byte-identical (SCALE-5/6 lesson at 12235–12250).
Set-count walk-back: _setsAtTime(ex.sets, _volDeltas, day) = end-of-day count + same-day decreases; both callers (progressionSetCount,
_deriveSightingFull) consume it. Queue reconciliation: reconcileDebutQueue (earliest id per exId|newW wins, others SUPERSEDED),
takeProposedDebut (consent supersedes lower loads), earnWalk's `already` guard, reconcileEraTransitions' consumption rule.

### (d) Merge / sync — ~1,100 lines (13371–14452)
| function | lines | notes |
|---|---|---|
| mergeState(local, remote) | 14212 (241) | returns NEW object but mutates it through reconcilers; reads/writes every key; order of passes is load-bearing (reads pick → trendChain → MULTI → feedDayOrder → OBJ → op-dedup → carve projection → KEYED → sugSorted → per-lift stamped fields/forks/renames/caches → insertions → sleep → plan → learned → exOrder → planGen register → retirements → reconcileEraTransitions(normalizePlan) → reconcileSightings({mint:true}) → reconcileDebutQueue → reconcileReadReceipts → reconcileSuggestionEffects → _feedSorted) |
| MERGE_KEYED / MERGE_ARR / MERGE_MULTI / MERGE_OBJ / CACHE_RIDERS / PLAN_POLICY_SCALARS | 14042–14081, 13466, 13960 | the merge maps; scoreOf fns _exDate/_queueRank/_adjRank/_sugRank at 13911–13926 |
| _unionKeyed / _unionBy / _unionObj / _unionMulti / _unionPlan / _unionExOrder / _unionLearned | 13874–14122 (~250) | pure |
| _readPick / _readRank9 / _richer / _mergeScore | 13371–13421 | pure |
| _mergeSession / _richerSession / _replayCorrections / _unionCorrLog / _fileCorr / _stampCorr / _corrOf / _tieKey / _canonJ | 13422–13873 (~450) | _stampCorr uses new Date() (UI correction path; merge itself never calls it); the rest pure |
| _takeStamped / _valOr / _isoOr / _sessionAtMs | 13440–13910 | pure |
| _feedDayOrder / _feedSorted / _sugSorted / _isFeedProjection / _isFeedDerived | 14123–14211 (~90) | pure |
| ghSync / snapshotMaybe / restoreFromCloud | 12344, 12746, 13242 | NOT engine: fetch/localStorage; call mergeState(state, migrate(remote)) + dataLossGuard |

Receipts: every merge-time feed line is a projection re-derived from the merged record (carve:, adoptshift:, replay:, seam:) and dated at the record's
date — "a merge has no clock" (14268). The merge is clock-free by design; only _stampCorr/_fileCorr (UI correction path) read the clock.

### (e) Today / decision surface — ~700 lines
| function | lines | R | W |
|---|---|---|---|
| statusFace | 15295 (69) | signalState, autoPilot, readRecency, blackout(clock), proposals(gate coach), autoPilotPolicy, autonomyOf, signalReadCopy, safeCrossing; STATUS_WORDS; AUTONOMY_META | — ; returns {word, glyph, tone: T.<colour>, cause} (CENSUSED word+cause) |
| statusTarget | 15404 (20) | proposals, agentProposals, escalation, nowFocus(hour), oweTarget, NOW_DOORS | — (CENSUSED key/id/label) |
| marchingOrder | 15364 (40) | nowFocus, energyBalanceTarget, proteinTarget, theOneFix, safeCrossing, oweTarget | — |
| nowModelUncached / nowModel (memo) / _plain9 / _rateStrip / _rateWord | 15424–15536 (~110) | energyBalanceTarget, statusFace, progressionTrend, structuralMovesThisWeek, proteinTarget, weekDay(clock), theOneFix, cutRateBand, currentRate, dayType, genSession (7-day look-ahead, clock), paceProjection, bfEst | — |
| nowFocus / fiveLevers / theOneFix / whyDecompose | 8436 / 8489 / 8540 / 8593 (~190) | hour (new Date().getHours()), owedNights, readWindow, dailyLogs, reads, sessionLog, sleep, stepTarget, currentRate, cutRateBand, proteinTarget, weekDay | — |
| oweTarget / NOW_DOORS / TRAIN_DOORS | 15237–15250 | constants ("now.capture2", "now.briefing", "now.room", "now.inbox") | — |
| runAdaptive(state, todayISO) | 9306 (506) | everything; the SWEEP: weekly snapshot, propose()/withdraw, cal/step/volume/phase/ladder/reset producers via autoPilot, energyBalanceTarget, volumePush, stepPush, regime, recoveryIndex, coarseLifts, missedReadCost | returns clone: proposals, feed, weekly, adjustments; todayISO is a PARAMETER (one stray todayStart at 9417) |
| applyProposal / dismissProposal / applySuggestion / noteSuggestion / dismissSuggestion / applyAgentProposal / dismissAgentProposal / undoAdjustment / lastUndoable / apAutoHandledFor | 9888–10274 (~390) | proposals, adjustments, suggestionLog, agentProposals, exercises | W (on a clone): adjustments row {id:_freshId, at:new Date()}, feed receipts, ex.sets/setsAt/w/wAt/steps/stepsAt, plan |
| activeAdjustment / apSteerHandled / proposalEffect / proposalDial | 9848 / 9866 / 9833 / 9812 (~65) | adjustments, reads | — |
| sweepLab → sweepStalls → sweepLadders → sweepVolume (+ lab) | 9256 (50) | called from the App effect (22027, 22086), not from runAdaptive | W: agentProposals, proposals |

Boot pipeline the app actually runs (loadState 13262): localStorage → migrate → runAdaptive(s, today) → save; then the App effect runs sweepLab.
The oracle runs ONLY migrate + the read selectors; runAdaptive/sweepLab/applyProposal are outside the census.

## 2. PURITY MAP

Already pure (state in → value out, no clock): dayType, exActive, forksOf/resetForksOf/eraIdx/sameEra/nameAt/pinsUnfilled/pinsBornOf,
_loadTenure/_formerNames/_volDeltas/_setsAtTime, progressStep (when eraFresh is given asOf), atTopOfWindow(with `through`), maxedOut, load
rungs family (loadRungs…parseRungs), rirSetsOf/openerRir/terminalRir/buildRirSets/deriveLastMeta, typicalError(with asOf), beatsNoise (via
typicalError default → clock), _deriveSightingFull/deriveSighting, earnWalk (mutates ex+queue but no clock), takeProposedDebut, reconcileDebutQueue,
reconcileSightings, reconcileEraTransitions, canonicalizePlan/normalizePlan/deriveInsertionSeams/applyInsertionSeams, the whole reconcile*
family, currentRate, _stateAsOf, _regimeRaw, progressionTrend/liftTrend(with asOf), sessionScore, proteinTarget/bfEst(with atISO),
cutRateBand/bodyCompBand/apModeOf, partitionPrior/energyDensity, tdeeLearned, calorieFloor (via bfEst default → clock), signalState/weightNoise/
trendSeries, autonomyOf/escalation/autoPilotPolicy, activeAdjustment/apSteerHandled(tISO param)/proposalEffect/proposalDial, cleanAtDate/
atSleepTarget/nightsBefore, dayWeather (except the refeed-yesterday dayType call, pure), recordCounts/dataLossGuard, every _union*/merge helper,
mergeState (clock-free), oweTarget/statusTarget (except nowFocus's hour).

Mutate state IN PLACE: every patchV*, _settleExit and all reconcile*, canonicalizePlan/normalizePlan/applyInsertionSeams, earnWalk,
reconcileSightings/_mintJointEarn, takeProposedDebut, reconcileDebutQueue, _stampPlan, _stampCorr/_fileCorr, sweep* (return a new top-level object
but share sub-objects), mergeState (mutates the object it builds; reconcilers mutate nested exercises/queue/feed that may be shared with inputs).
Return a deep clone: migrate (patch path), applyRead, undoRead, completeSession, runAdaptive, applyProposal & friends, applyAgentProposal.
Hidden shared mutable state: module-level SEED (mutated by weave(), read by patchV5/6/7/8/10/60, migrate, isPristineSeed), `_freshSeq`
(375), the WeakMap memos `_ebtMemo` (energyBalanceTarget), `_energyDensityLoss`, `_forecastCached`, `_nowMemo`, `_labMemo`, `_docketMemo` —
keyed on state OBJECT IDENTITY, so a state mutated in place after first read returns a STALE memo (deps-less calls only).

Impure dependencies found inside engine code (line → what):
- Clock (implicit): `todayStart()`/`daysUntil()` — 158 call sites in 630–14717; `new Date()` inside them (308). Notables: liftCall 700, progressAnchor
  983, sweepLadders 1246, progressionSetCount 1421, eraFresh 2104, typicalError 2132, bfEst 2932 (default arg), stepTarget 3039, liftTrend 3188,
  regime 3414, readRecency 3563, applyRead 3675/3678, observedTDEE 3736/3758/3759, dietExit, energyBalanceTarget 4204, energyAvailability 4417,
  rtAdherence 4646, redlineCrossing 5129/5130, autoPilot 5326, phase* 5549–5694, labAnalytics, sleepInfo 14455, weekDay 14460, blackoutOn,
  nextEvent/lastEvent/eventFocus, structuralMovesThisWeek 8816, nowFocus 8438/8459, fiveLevers 8490, theOneFix 8543, whyDecompose 8601,
  sweepVolume 9152/9198, runAdaptive 9417, applyProposal 9894…, dismissProposal 10154, anchorDexa 10660–10670, patches 10761/10789/10856/
  10866/10880/10900/10910/10924/10945/10960/10974 (patchV17–V34 receipt dates `d: isoOf(todayStart())` — fire only for states with v<34), patchV51 11783,
  migrate v1 12299, statusFace 15299, nowModel 15425/15481.
- Clock (hour): `new Date().getHours()` — readWindow 3652, owedLedger 6863, owedNights 6881, theOneThing 6886, nowFocus 8437 (→ statusTarget).
- Clock (weekday): `new Date().getDay()` — sweepVolume 9141/9198, sweepLab 9256.
- Instants: `new Date().toISOString()` — completeSession 2619/2620/2695/2699/2705, _stampPlan 9877, applyProposal 9912/9959/9962/9974/9975/9978,
  applySuggestion 10053/10054, noteSuggestion 10066, dismissSuggestion 10075, applyAgentProposal 10120/10123, dismissProposal 10154,
  undoAdjustment 10258, migrate 12299, _stampCorr 13424.
- `Date.now()` — _freshId 375; sweepVolume 9210/9220; sweepStalls 9234 (agentProposal ids); ghSync/snapshot (non-engine).
- `Math.random()` — _freshId 375 only (ids of adjustments/anchors/phaseLog rows written by applyProposal, applySuggestion, _stampPlan, anchorDexa).
- `localStorage` — patchV51 11785–11786 (scans draft keys to place the seam date; try/catch → no-op in node). Everything else localStorage is
  outside the engine (theme 95/342, TOKEN_KEY 12346, kit 12455, ask 12703, loadState 13270, restore 13260).
- `fetch(` — none in engine; ghSync 12357+, agentLoop 12658, askLedger 12681, snapshots 12759/12765/12773, useRepoDoc 13055, restoreFromCloud 13243.
- `window.`/`document.`/`navigator.` — none in engine functions; module-level guarded side effects at 313–356 (style injection, theme) and 15245
  (`window.__plDoors`); `hap()` 15003 (navigator.vibrate) is UI.
- `setTimeout` — none in engine (ghSync retry 12377, restore 13195).
- React: `useState` in MapView 7754 (lab component embedded at 7714–7768; not engine). No hooks in any engine function.
- Theme tokens `T.*`: statusFace 15315–15348 (`tone`), signalReadCopy 15150 (`wordColor`), GraduationMark 15138 (UI). The censused fields
  (word, cause) do not include them, but the returned objects do.
- `toLocaleString()` (Intl, locale-dependent prose): 3065, 3620, 3851 (observedTDEE.stepsWhy), 4353 (calorieTarget.why), 4472, 5085, 6324, 6534,
  6535, 6643, 7249, 7259, 8131, 9924. Not censused today (why/stepsWhy are not picked) but present in engine strings.
- Feed-prose reads (engine deriving state from receipt TEXT): _volDeltas regex on "VOLUME ±N — … via NAME" (1071), _deriveSightingFull on
  / EARNED$/ prefixed by name family (2229), _mintJointEarn on "TOP OF WINDOW, PROVISIONAL|NO NEXT LOAD ON FILE|BUT HOT" (2297–2300), liftCall on
  "RESET APPLIED — <name>" (767), structuralMovesThisWeek on "VOLUME " + "via <name>" (8827–8830), runAdaptive note-dedup by title (9352),
  patchV51/V60 op-guards, nowModel regex on progressionTrend.why (15429), legacy-records volumeReceipts regex (oracle side).

## 3. THE CLOCK

How "now" is obtained: ONE primitive — `todayStart()` (308) = `new Date()` truncated to local midnight; `daysUntil()`, `isoOf(todayStart())`,
`weeksBetween`, `mk()` build on it. Plus the HOUR (`new Date().getHours()`, 5 sites) and the WEEKDAY (`new Date().getDay()`, 3 sites), instants
(`new Date().toISOString()`, `Date.now()`) for stamps/ids. All are LOCAL-time: `mk("YYYY-MM-DD")` builds local midnight, `isoOf` prints local
Y-M-D, dayType uses `getDay()` of local midnight. TZ therefore changes engine output; the oracle fails closed unless TZ === manifest.tz.

Tests: tools/_fixed-now.mjs replaces `globalThis.Date` with a subclass whose zero-arg constructor and `Date.now()` return LOCAL NOON of
MEASURED_TEST_NOW (default 2026-07-29; the oracle passes 2026-09-03). Explicit-arg constructors are untouched. It must be imported BEFORE app.jsx
(module-level weave() and ROLLUPS run at import; SEED dates are literals so they do not depend on it, but any patch receipt dated "today"
does). conform/engines/build-engines.mjs bundles `import "./_fixed-now.mjs"; import { __test } from "../src/app.jsx"` with esbuild (platform
node, cjs) — that is how the oracle gets a clock: the engine bundle installs it itself; port-oracle.cjs only checks the env is set.

What the extracted engine needs injected: `clock = { today(): "YYYY-MM-DD" (local calendar date), hour(): 0–23, dow(): 0–6, nowISO(): instant
string, nowMs(): number, tz }` — same shape family as rebuild/client's `{ now, today, tz, monotonicMs }`. Concretely: replace `todayStart()` by
`mk(clock.today())`, `daysUntil(d)` by `(mk(d) - mk(clock.today()))/DAY`, the 5 hour reads by `clock.hour()`, the 3 dow reads by
`mk(clock.today()).getDay()`, `new Date().toISOString()`/`Date.now()` by `clock.nowISO()`/`clock.nowMs()`, and `_freshId` by an injected
`ids.fresh(prefix)` (deterministic in tests). `mk`/`isoOf`/`weeksBetween`/`fmtShort` stay as-is (explicit-date arithmetic in local time, which the
frozen Date shim also leaves alone); the module must be evaluated under the same TZ as the golden. For the oracle wrapper: build the clock from
`process.env.MEASURED_TEST_NOW` as local noon (exactly _fixed-now's FIXED) so `hour()` = 12 — nowFocus/readWindow/owedNights depend on it and
the golden's statusTarget was cut at hour 12.

## 4. EXTRACTION BOUNDARY (proposed rebuild/engine/*.cjs)

Copy, never refactor the frozen app; the frozen app imports nothing back. Every module takes `(deps)` = {clock, ids} through one factory
`createEngine({clock, ids})` returning the function table; a module-local `E` holds cross-module references so the call graph is unchanged.

| module | contents (from app.jsx) | approx lines |
|---|---|---|
| dates.cjs | DAY, mk, isoOf, fmtShort, weeksBetween, todayStart/daysUntil rewritten over `clock` | 40 |
| constants.cjs | APP_V, SCHEMA_V, START, SEAL_UNTIL, CROSSOVER, PHASES, BC, FORE, DT?(no — UI), KCAL_*, PRIOR_FAT_FRAC, DRIP_*, EA_*, TREND_*, REGIME_HOLD_D, STALE_DAYS, RATE_DP, PACE, VOL_BANDS, INDIRECT, MG_LABEL, HYP_*, VOL_*, REVIEW_*, DELIVERED_MAJ, LADDER_MIN_N, PUBLISHED_SET_SEM, RULING_EPOCH, SPLIT_DATE, RULED_ORDER, INSERTION_PAIRS, SET_REALLOCATIONS, CACHE_RIDERS, PLAN_POLICY_SCALARS, LATE_READ_HOW, DEFICIT_CEILING, AUTONOMY_*, AUTO_MAG_KCAL, PHASE_META, BREAK_LEN_DAYS, STATUS_WORDS, NOW_DOORS, TRAIN_DOORS, DEBT_*, MAINT_KCAL_PER_LB, WALK_*, STEP_*, TDEE_*, ADAPT_* | 250 |
| seed.cjs | HISTORY (history.js), EXERCISES, SEED + weave() (frozen), weekRollups/ROLLUPS | 260 |
| plan.cjs | dayType, exActive/_bornValid, forks/renames/era helpers, canonicalizePlan, normalizePlan, deriveInsertionSeams, applyInsertionSeams, pinsUnfilled/pinsBornOf | 420 |
| progression.cjs | _loadTenure … _setsAtTime, progressStep, progressAnchor, maxedOut, _padFrom9, targetsFor, progressionSetCount, atTopOfWindow, rungs family, proposeLadder/sweepLadders, typicalError, beatsNoise, _deriveSightingFull/deriveSighting, _mintJointEarn, reconcileSightings, takeProposedDebut, reconcileDebutQueue, reconcileEraTransitions, earnWalk, completeSession, rirSetsOf family, deriveLastMeta, genSession/sessionFromDraft/pickStructural, liftCall, rirPlan, restFor/restLine, sessionScore, liftTrend, progressionTrend | 1,900 |
| sleep.cjs | cleanAtDate, atSleepTarget, sleepMean3At, nightsBefore, sleepInfo, owedNights/owedLedger, sleepAnchor?, recoveryIndex, bodyAlarm, dayWeather/weekWeather, nextEvent/lastEvent/eventFocus, weekDay, blackoutOn | 350 |
| energy.cjs | currentRate, _stateAsOf/_regimeRaw/regime, observedTDEE, stepKcal, calorieFloor, bfEst/dripOf/anchorTighten, proteinTarget/proteinHit, skinfold*, cutRateBand/bodyCompBand/apModeOf, calorieTarget, energyBalanceTarget(+memo)/costingStep/_costingWeeks, energyAvailability, energyDensity/partitionPrior, tdeeLearned, adaptationSignal, readRecency, paceProjection/paceShown, readWindow/missedReadCost, applyRead/undoRead, stepTarget/stepPush/stepEfficacy, etaWeeks/etaRange, dietExit, partitionRates/rtAdherence | 1,700 |
| policy.cjs | signalState/weightNoise/trendSeries/signalReadCopy(minus wordColor), autoPilot, autonomyOf/escalation/autoPilotPolicy/confidenceField/whyThisNumber/trackRecord, forecast family (digitalTwin, twinBodyComp, forecastUncached/forecast/safeCrossing, redlineCrossing, rateDivergence, coneHalfWidth, normCdf, conditionalForesight, etaReached), phase family (phaseArc, dietBreakState/Honest, phaseSupervisor, phaseProposal, _stampPlan), activeAdjustment/apSteerHandled/proposalEffect/proposalDial | 900 |
| volume.cjs | muscleVolume, programmeVolume, volumeImbalance, structuralMovesThisWeek, _blockSlope, setOneRead, volumeConversion, _setsMovesSince, volumePush, sweepVolume, sweepStalls, coarseLifts, mgLabel | 700 |
| migrate.cjs | patchV4…patchV60 (file order preserved), _hashId, _fileKnownCorr, PATCHES, reconcileLiftCaches, ensureLoadOnLadder, reconcileCorrectedLoads, reconcileReadReceipts, reconcileTrendChain, reconcileSuggestionEffects, anchorDexa, _settleExit, migrate, isPristineSeed, recordCounts, dataLossGuard | 2,000 |
| merge.cjs | 13371–14211 verbatim + mergeState | 1,100 |
| today.cjs | nowFocus, fiveLevers, theOneFix, whyDecompose, statusFace (tone → a token NAME string, not a hex), marchingOrder, statusTarget, oweTarget, nowModel, _plain9/_rateStrip/_rateWord, runAdaptive, applyProposal/dismissProposal/applySuggestion/noteSuggestion/dismissSuggestion/applyAgentProposal/dismissAgentProposal/undoAdjustment/lastUndoable/apAutoHandledFor, sweepLab (minus lab) | 1,400 |
| index.cjs | createEngine(deps) → wires modules, returns the table; `__test` builder reproducing the frozen surface names | 150 |
| oracle-shim.cjs | reads MEASURED_TEST_NOW/TZ, builds the local-noon clock + a seeded id generator, `module.exports.__test = createEngine(...).__test` — the file the oracle is pointed at | 30 |

Excluded (narration / lab, not decision): labAnalytics (5839, 551), labAnalytics2 (7262, 452), sessionDebrief/debriefWords, weekReview,
dayProtocol, trialProposals/trialVerdict/activeTrial, dossierText/dossierData, prophetGrades/labDocket/labSections/labStatusList/labGroups,
sleepLab/medianSOL/lightsOutT/caffAt, shelfItems/debtLedger/liveRollups/weekDigest/theOneThing, GLOSSARY/CONSTITUTION/LEDGER_DICT, askContext/
agentToolExec, kit*, GymMode helpers (mergeSessionDrafts, gymEntries, backLift, restCut, resumePhase, findGymDraft), writeDaily/captureAsk/
expDigest, ghSync/snapshots/restore/loadState. If sweepLab is ported, its lab arm is stubbed (it only files agentProposals from lab verdicts).

Order to extract (lowest risk first, each step gated):
1. dates + constants + seed (no logic; diff SEED JSON against the frozen bundle's `__test.SEED`).
2. plan.cjs + progression.cjs read-side (exActive, targetsFor, deriveSighting, _volDeltas, progressionTrend) — gate: census `lifts` +
   `progression` groups identical on the raw fixtures WITHOUT migrate (call selectors on the golden engine's migrated state, dumped once).
3. sleep.cjs + energy.cjs + policy.cjs read-side — gate: census `energy` group + statusFace inputs.
4. today.cjs read-side (statusFace/statusTarget/nowFocus/…) — gate: census `today`.
5. migrate.cjs (patches + reconcilers + _settleExit) — gate: full census incl. `migration.recordsChangedByMigrate`, `records` DTO, `counts`
   on preimage + synthetic + private live; this is where most bytes are and where receipt prose must match.
6. merge.cjs — not censused; gate: tools/sync-laws.mjs (220 KB, self-merge/associativity/direction laws) re-pointed at the module.
7. runAdaptive/apply*/completeSession/earn writers — not censused; gate: tools/_engine-surface.jsx baseline (runAdaptive proposals + feedHead on
   the two frozen snapshots) + tools/engine-test.jsx (~2,600 assertions incl. closure-sf1/sf2) re-pointed via the `__test` table.
What the app imports back: NOTHING. The frozen app stays byte-identical; rebuild/client will `require("../engine")` and pass its own clock.

## 5. THE GATE

port-oracle.cjs `check <engine.cjs> <label> [golden=main]`: requires MEASURED_TEST_NOW + TZ; `require(engine).__test`; for each blob
(fixtures/preimage-2026-08-15.json PUBLIC v54; fixtures/synthetic-pending-debut.json SYNTHETIC v54; private/live.json PRIVATE — verdict lines only)
it (1) verifies manifest pins (fixture sha, golden sha, golden blob sha, engine sha/clock/tz/census version in the stamp), (2) runs the counts law
(no class shrinks through migrate; sets may only fall by filed `strike` corrections with feed receipts sharing the op), (3) diffs
`required(census(T, raw))` against the golden byte-for-byte after canonicalization (lib/harness diffPaths). `sensitivity` mode perturbs every
leaf and runs six semantic mutants (wrong target, dropped former name, missing volume receipt, stale sighting, missing newWSets, altered Today copy).

census(T, raw) calls: T.migrate(clone(raw)); T.records(s) if present else legacy-records.cjs (reads, foodDays, nights, sessions incl. every set and
rir, lifts incl. retired with renames/forks/last, queue incl. newWSets/state/gate/rule/text, feed {d,t,how,op}, volumeReceipts parsed from feed,
sightings topAt/topRun, events, waist, plan{planGen,exOrder,split,retirements}); counts(raw) and counts(s); per active lift (T.exActive)
{name, load r2, sets, targets: T.targetsFor(ex, s) rounded to integers}; T.calorieTarget (gated, from, lo, hi, mid, tdee, floor, floorSoft, wkAvg,
wkN, phaseLo, phaseHi, floorHit, floorBinds; band r2); T.cutRateBand (mode, pct, band, floor, redline); T.calorieFloor (floor, soft, eee, ffmKg r1);
T.proteinTarget (g, lo, hi, floor, perKg r2, ffmKg r1, bf r3); T.observedTDEE (tdee, days, avg, lo, hi, from, to, method, rate r2, rateCi, perLb r1);
T.currentRate (ALL fields r2 — incl. rates[], ci, ciOls, hacL, rho1, hacInflation, sigma, span string); T.regime (whole object UNROUNDED —
key, confirmed, pending, basis, why prose, the full progressionTrend incl. per-lift pts[] and protectedBy, and the full currentRate — the most
fragile leaf set in the census: raw floats and prose); T.progressionTrend (nLifts, excludedIds, setAsideDays, lifts[{id,n,nSoft,pct,lo,hi} r3]); today = {trend r1, phase, statusFace
{word, cause}, statusTarget {key, id, label}}. Optional (reported, never compared): internal schema, deriveSighting tops, _volDeltas.

"Engine-extracted" must satisfy: `require("rebuild/engine/oracle-shim.cjs").__test` exposes at least migrate, exActive, targetsFor,
calorieTarget, cutRateBand, calorieFloor, proteinTarget, observedTDEE, currentRate, regime, progressionTrend, statusFace, statusTarget (+
deriveSighting, _volDeltas, and ideally records) and `check` is GREEN on all three blobs against a golden cut from the FROZEN engine. Two
prerequisites before extraction starts: (i) cut the FINAL golden from wt-live v7.56.0 (SCHEMA_V 60) — the current manifest is PROVISIONAL from
v7.55.9 (SCHEMA_V 59) and the internalSchema in the golden reads 59; patchV60 changes forks/insertions/curl/queue, so the v59 golden will not
match a v60 engine; (ii) rebuild engines/engine-main.cjs from fe516c1 via build-engines.mjs and re-run `golden` + `sensitivity`. Also note the
regime `why` and statusFace `cause` are prose — one changed word fails the port, by design.

What census does NOT cover (second gate must add): mergeState and every _union*; completeSession/earnWalk writers (queue ids, newWSets,
receipts); runAdaptive proposal generation, applyProposal/agent/suggestion/undo effects, activeAdjustment offsets; sweep* (stalls, ladders,
volume); genSession/pickStructural/rirPlan (what the gym card shows); liftCall verdicts; energyBalanceTarget (only calorieTarget is censused;
regime is, but the costing/accretion branches' lo/hi are not); forecast/redlineCrossing/digitalTwin/phase family; stepTarget/stepPush;
signalState numbers; readRecency; marchingOrder/nowModel; every `why`/`stepsWhy`/`wkWhy` prose except regime.why and statusFace.cause;
statusFace.glyph/tone; hour/dow-dependent behaviour beyond hour 12; TZ other than America/New_York; clocks other than 2026-09-03; the v1/v2 and
fresh-SEED migrate exits; dataLossGuard; the lab layer. Existing assets for a second gate: tools/_engine-surface.jsx + tools/engine-baseline.json
(runAdaptive proposals, energyBalanceTarget, regime, stepPush/Target, forecast-adjacent reads on two frozen snapshots under 2026-07-29),
tools/engine-test.jsx (~2,600 assertions via `__test`), tools/sync-laws.mjs (merge laws), tools/split-smoke.mjs — all consume `__test`, so a
module exporting the same names can be re-pointed with a one-line import change in a copy of each harness.

## 6. RISKS + ESTIMATE

1. The provisional golden is v59; the frozen tip is v60. Extracting against the wrong golden wastes the first day. Cut the FINAL golden first.
2. Implicit clock (158 sites + hour/dow/instants). Mechanical rewrite, but any site missed shows up only under a different MEASURED_TEST_NOW/TZ.
   Mitigation: after extraction, run the shim with `globalThis.Date` UNFROZEN and assert every engine call gives the same census as with the shim
   frozen (proves no residual `new Date()`); grep the extracted tree for `new Date()`/`Date.now`/`getHours`/`getDay` (allowlist: dates.cjs).
3. Hidden shared mutable state: SEED mutated at load and read by patches/isPristineSeed; `_freshSeq`; WeakMap memos keyed on state identity
   (a client that mutates its state object in place between reads will get stale energyBalanceTarget/energyDensity/forecast/nowModel). In the
   engine module: keep memos but expose `engine.invalidate(s)` or key on a version counter; never share one state object across ticks.
4. Patches that read the feed prose / receipt text (op-guards, title dedup, "VOLUME…via NAME", " EARNED$", "TOP OF WINDOW, PROVISIONAL") and
   emit dated prose — any rewording, punctuation or U+2212/-/— difference breaks the records DTO and the sighting derivation. Copy verbatim;
   never "clean up" strings; keep both minus spellings.
5. Seam/fork/rename machinery has THREE restatement sites that must agree byte-for-byte (_settleExit 12240–12250, mergeState fork union
   14334–14371, deriveInsertionSeams 2064) plus INSERTION_PAIRS / patchV51 / patchV60 interplay; forks keyed by (from|class) with prevN tie rules.
   Port as one unit with sync-laws.mjs as the gate.
6. localStorage inside patchV51 (draft-key scan): in node it is a caught ReferenceError → seam floor "2026-08-14"; the extracted module must
   reproduce the SAME outcome by making that scan an injected `drafts.dates()` defaulting to []. On a phone with live drafts the frozen app moves
   the seam — a behaviour the rebuild has to decide to keep or drop (it only matters for v<51 states).
7. Non-determinism in writers: `_freshId` (Math.random), `"vol"+mg+Date.now()`, `"rs"+id+Date.now()`, `new Date().toISOString()` stamps. Not
   censused, but the second gate will need injected `ids`/`clock` and the engine-test pins that assert on ids must be re-derived.
8. Locale: `toLocaleString()` in 14 prose sites — Node ICU vs iOS Safari can differ ("16,526"); prose is not censused except regime.why/cause
   (neither uses it). Replace with a fixed formatter in the copy only if the client later censuses those strings.
9. TZ/DST: everything is local-time arithmetic; a client on a different TZ than the golden legitimately reads different weekdays. The oracle
   pins TZ; the rebuild client should pass a clock in the athlete's zone and the engine must never touch UTC (`bump()` in patchV51 uses UTC
   deliberately — keep it).
10. Cross-module cycles: regime ↔ progressionTrend/currentRate, energyBalanceTarget → regime → progressionTrend, calorieTarget →
    activeAdjustment (today.cjs), autoPilot → structuralMovesThisWeek (volume.cjs) + stepTarget (energy.cjs), nowModel → genSession
    (progression.cjs), liftCall → recoveryIndex/bodyAlarm (sleep.cjs). Solved by the single `createEngine` closure; do not try to make modules
    acyclic in M2.
11. Size/coupling of migrate: ~2,000 lines of patches that reference SEED, INSERTION_PAIRS, RULED_ORDER, _bornValid, applyInsertionSeams,
    reconcile*, pinsUnfilled, exById, _hashId. Copy the block whole; the census on the live blob is the only proof that matters.
12. `records(state)` DTO: keep using legacy-records.cjs (T.records absent) so the DTO stays engine-independent; do not implement `records` in M2.

Effort (agent-hours, an extraction that passes `check` on all three blobs + the frozen suite re-pointed):
- Cut FINAL golden from v7.56.0, rebuild engine bundles, re-run golden/check/sensitivity: 1–2 h.
- Mechanical copy into modules + createEngine wiring + clock/ids injection + oracle shim: 8–12 h (≈12,000 lines moved; most time is the
  clock rewrite and verifying nothing was dropped — diff function-by-function against the frozen source).
- Census GREEN on preimage + synthetic: 4–8 h of diff-chasing (expected failure classes: a missed clock site, a memo, a constant left in the
  UI region such as NOW_DOORS/PHASES/AUTONOMY_META, patch order).
- Census GREEN on the private live blob (run locally, verdict-only): 2–4 h.
- Second gate: re-point engine-test.jsx + _engine-surface + sync-laws at the module (copies under rebuild/engine/test/), fix the id/clock
  pins: 6–10 h.
- Unfrozen-Date determinism proof + TZ sweep (UTC vs America/New_York) + docs/handoff: 2–3 h.
Total: 23–39 agent-hours; call it 30, with the second gate as the long pole. Without the second gate (census only) 15–25 h.
