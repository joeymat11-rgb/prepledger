# EARNED — M2 MODULE 2 BRIEF (the engine extraction, second gated step: sleep + energy + policy READ side) — builder ASTRA

Date 2026-09-05. Module 1 (PR #11) was scored and merged (rebuild/m2/SCORECARD-M2-1.md). This is the second gated step. Same rules:
the suite is the gate, you never edit it, you never touch the frozen app, nothing private ships, and you write an honest report.
Read `AGENTS.md`, `rebuild/ROADMAP.md`, `rebuild/m2/RECON.md` (§4 boundary, §5 gate, §6 risks), your own `rebuild/m2/REPORT-M2-1-ASTRA.md`
and the merged `rebuild/engine/` before writing a line. Module 1's conventions (factory-local E, per-instance constants/seed, source-range
comments, the two-Date-mode partial census) are the conventions; extend them, do not reinvent them.

## 0. Branch and base
Base: `rebuild/t2-client-core` at its current tip (it now carries module 1, the FINAL golden, suite v3.2 and the frozen v7.56.0 app —
check `git log -1 -- rebuild/engine/index.cjs` exists and the port oracle's manifest says `fe516c1`). Branch: `rebuild/m2-engine-2`.
Open a PR against `rebuild/t2-client-core`. Do NOT merge.

## 1. What module 2 is (RECON §4, extraction order step 3 — READ side only)
Add to `rebuild/engine/`, COPIED from the frozen `src/app.jsx` @ fe516c1 (the base now carries it; still copy, never refactor; the frozen
app stays byte-identical — `git diff --exit-code -- src app.js index.html` empty at the end):
- `sleep.cjs` — cleanAtDate and nightsBefore MOVE here from progression.cjs (module 1 parked them there; keep the export names so the
  module-1 gate still passes), plus atSleepTarget, sleepMean3At, sleepInfo, owedNights/owedLedger, sleepAnchor (if it exists — RECON
  marks it "?"), recoveryIndex, bodyAlarm, dayWeather/weekWeather (dayWeather moves from progression.cjs), nextEvent/lastEvent/eventFocus,
  weekDay, blackoutOn.
- `energy.cjs` — the READ side: currentRate, _stateAsOf/_regimeRaw/regime, observedTDEE, stepKcal, calorieFloor, bfEst/dripOf/anchorTighten,
  proteinTarget/proteinHit, skinfold*, cutRateBand/bodyCompBand/apModeOf, calorieTarget, energyBalanceTarget (+ its memo — RECON §2: a
  WeakMap memo is an impurity; keep it per-engine-instance, never module-global), costingStep/_costingWeeks, energyAvailability,
  energyDensity/partitionPrior, tdeeLearned, adaptationSignal, readRecency, paceProjection/paceShown, readWindow/missedReadCost,
  stepTarget/stepPush/stepEfficacy, etaWeeks/etaRange, dietExit, partitionRates/rtAdherence. NOT module 2: applyRead/undoRead (writers).
- `policy.cjs` — the READ side: signalState/weightNoise/trendSeries/signalReadCopy (minus wordColor — UI), autoPilot, autonomyOf/escalation/
  autoPilotPolicy/confidenceField/whyThisNumber/trackRecord, the forecast family (digitalTwin, twinBodyComp, forecastUncached/forecast/
  safeCrossing, redlineCrossing, rateDivergence, coneHalfWidth, normCdf, conditionalForesight, etaReached), the phase family (phaseArc,
  dietBreakState/dietBreakHonest, phaseSupervisor, phaseProposal — NOT _stampPlan, a writer), activeAdjustment/apSteerHandled/
  proposalEffect/proposalDial (read side only; anything that FILES a proposal is NOT module 2).
- `index.cjs` / `oracle-shim.cjs` — extend the table; `__test` must now ALSO expose: calorieTarget, cutRateBand, calorieFloor, proteinTarget,
  observedTDEE, currentRate, regime, energyBalanceTarget, stepTarget, forecast, signalState, cleanAtDate, atSleepTarget.
Boundary rule (learned in module 1): if a listed function WRITES state (queue/feed/proposals/agentProposals) or calls a writer, do not copy
it — STOP that item, record it in §6 as a RECON correction, continue with the rest; cowork rules on it from the PR.

## 2. The gate for module 2 (RECON §4 step 3, §5) — cumulative with module 1
Run `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-2`
in the mode the oracle offers for a PARTIAL surface: the census groups `lifts`, `progression` AND `energy` (plus the `today` inputs that regime/statusFace read — RECON §5 lists them:
T.currentRate ALL fields, T.regime UNROUNDED incl. its `why` prose, T.progressionTrend) must be byte-identical to the FINAL golden on
the preimage and synthetic blobs, with the selectors called on the golden engine's MIGRATED state dumped once (migrate is module 5, not yours).
Extend `rebuild/engine/test/census-partial.cjs` (module 1's) to the new groups; it may import the suite's census and harness, it may not edit them.
Module 1's groups must still pass — the partial census is cumulative. Then:
- `node rebuild/conform/run.cjs` → still SUITE CONSISTENT (you changed nothing under rebuild/conform, so the frozen manifest proves it).
- `node scripts/check.mjs --strict` WITHOUT MEASURED_TEST_NOW (the frozen gate has its own clock) → "Safe to ship."
- The private live blob: run the same partial census locally against `private/live.json` regenerated from
  `git show fe516c1:ledger/state.json` — report the VERDICT ONLY, never a value; never commit private/.
- Determinism: run the partial census once with the Date shim in place and once with `globalThis.Date` UNFROZEN (clock still injected);
  identical output or you missed a clock site.

## 3. Bite check (deliberate, documented, restored)
Break ONE thing in `energy.cjs` that the LIVE blob exercises (e.g. the KCAL_PER_LB_MIX term in observedTDEE, or the deficit band edge in
cutRateBand) and show the partial census go RED on the live blob; restore byte-for-byte and show the SHA. Note: cowork found on module 1
that a break with no fixture behind it (the FIX-4c same-day-decrease line) does NOT bite — if your first break is silent, say so, pick
another, and list the silent one in §5 as a coverage gap.

## 4. Report — `rebuild/m2/REPORT-M2-2-ASTRA.md`
(1) module map with line counts and, per function, the app.jsx line range it was copied from; (2) the gate output tails verbatim (partial
census on the two public blobs; run.cjs SUMMARY block; check.mjs tail; live-blob verdict line); (3) every clock site you rewrote (count +
list) and every memo/WeakMap you met; (4) the bite check; (5) SEAMS — anything shaped by the oracle rather than by the product; (6) anything
in RECON.md you believe is wrong (not edited); (7) what module 1 does NOT cover; (8) wall-clock and, if exposed, tokens;
(9) DEFECT LOG (continue the numbering at D11) — anything in the code you copied that you would change (a wrong rule, a hidden assumption, a value that should be
derived, a bug): file it with the app.jsx line and the evidence, and DO NOT change it. Module 1 must reproduce the frozen engine
byte-for-byte — the golden is the proof, and one changed word fails it by design. Every entry in this log becomes a candidate
red-first law for the audit that follows extraction; the owner rules on each. An improvement smuggled into a copy is a defect here.
Same honesty bar as T3: the owner's scorecard counts seams you omit at double weight.

## 5. Never
Edit `src/`, `app.js`, `rebuild/conform/`, `rebuild/client/`, `rebuild/authority/`; commit `private/`, engines, or any golden other than the
committed public ones; print or handle a token; delete anything; push to main.
