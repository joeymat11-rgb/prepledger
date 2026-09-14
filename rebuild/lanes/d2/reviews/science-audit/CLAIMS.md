# Independent claim register

All S01–S12 assessed before E outcomes. Dispositions are review recommendations, never acceptance. A means prepared `3bfed63febef002b8540d6ff3c56e19d08368711`; M means integrated comparison `100820aa47a4f8729642033499eaec0f0ee282e1`; P means prior corpus/rulings `34fce6323d78adb7363a7e05f81dc92e27eb9017`. All line numbers below are at A unless explicitly P/M. Source IDs link to [SOURCES.md](SOURCES.md). No current athlete values were inspected. Static calls establish possible consumers, not that a branch ran on a phone.

## S01 — Maintenance, density, windows, uncertainty, cold start

**CLARIFY + CHANGE-PROPOSED; known arithmetic issues retained for PM.**

- `rebuild/engine/energy.cjs:225–305 currentRate` uses dated OLS/HAC with a minimum read count; `:369–487 observedTDEE` matches logged intake to the rate interval when sufficiently populated. Keep these corrections and explicit fallback/matched flags. A rate confidence interval is not the uncertainty of true maintenance: missing/self-reported food, changing water and assumed tissue partition also matter. `:781 calorieTarget.why` still calls the result measured maintenance. `rebuild/m3/w7-preview/today/today-model.cjs:92–106,216–218` and `rebuild/coach/tools.cjs:415–500` carry the target/explanation to people. This is an inference from source arithmetic, not a validation against calorimetry.
- At `energy.cjs:455`, the step baseline selects the latest `cals.length` daily-log dates rather than the matched intake/rate dates; `:469–487` tests the 70%-of-gross correction against the interval, then promotes the compensation midpoint (72.5% of gross) into `tdeePrimary`, used at `:734`. Date counts are not a shared calendar. Proposed engineering check: moving unrelated out-of-window food/step rows must not alter a matched-window baseline. No such experiment was run here. D11 endpoint reversal/zero-drift promotion is already documented at P `rebuild/m2/AUDIT-REGISTER.md` and A `test/defect-witnesses-2.cjs:21–36`; do not count it as newly found.
- The code's 3,800 kcal/lb is a partition assumption (`constants.cjs:132–246`, `energy.cjs:953–1014`), not a value measured merely by weighing or one DEXA. Hall [R01] supports composition-dependent energy density, not this trained person's exact mixture. `partitionPrior` treats a DEXA-labelled anchor as identified; `energyDensity` can call the result a measured partition despite no observed partition trajectory. The density feeds maintenance and calorie instructions. Do not substitute a different universal constant from this audit.
- `tdeeLearned:1018–1052` has an own-forecast error band and clearer net-log-error language, but its 3,500 label conflicts with its actual density-dependent computation. Its user-facing consumer was not established in the inspected subset: keep this as a source inconsistency with unresolved reach, not a proved live message.
- Careau [R02] does not identify an individual's walking compensation at 25–30%. It includes both cross-sectional and longitudinal observational analyses; the latter is not a walking intervention. Keep compensation as an uncertain model scenario. The step-restoration proposal should not promise a personal calorie response.
- Cold start `energy.cjs:684–723` returns no target without body weight and labels the weight-times-12 fallback as a convention. `today-app.cjs:799–835,875–908` catches unavailable nutrition reads; keep the missing-data state. A completed form does not create measured maintenance.

**M/status/tests:** the whole energy and constants files are byte-identical A/M. Static D11/D15 witnesses preserve defects; they do not demonstrate repairs or source validity. No suite was run. NUTRITION-TDEE-VERDICT N2/N3/N10 already require apparent-maintenance and residual uncertainty: this finding enforces that direction.

## S02 — Deficit, loss rate, calorie floor, male EA

**KEEP the graded/default distinction; CLARIFY consequential claims.**

- `energy.cjs:877–900 cutRateBand` expresses rate relative to body weight and uses 0.70%/week as an upper default, not an optimum. P `NUTRITION-TDEE-VERDICT.md` N1 corrected assigned versus achieved Garthe rates. [R03/R04] support caution about larger deficits; they do not prove a personal 500-kcal loss cliff or one optimal weekly rate. Do not silently restore a hard deficit wall.
- `energy.cjs:493–504 calorieFloor` derives a 25-kcal/kg-FFM convention plus estimated exercise cost; its own explanation acknowledges a non-universal threshold. Keep it labelled as a precautionary policy if the owner retains it. `:786–847 energyAvailability` estimates exercise expenditure (including a 300-kcal/session fallback) and bands at 20/25/28. The ADEQUATE band cannot provide medical or muscle-retention clearance. `eaAll` is a separate convention, not a measurement of everything burned.
- A reachable contradictory receipt remains: `sleep.cjs:272–274 recoveryIndex` assigns muscle-sparing meaning to 25; `today.cjs:309–313` copies recovery flags into the fix and `:580–583 nowModel` carries that material to Today. `coach/tools.cjs:488–490` carries the floor. Separately `policy.cjs:615 phaseSupervisor` associates the low band with a precise muscle-loss fraction; it is called by phaseArc, but display of that particular receipt was not established here. [R05/R06] do not validate those personal thresholds. The 2026 review includes women and men; it is not a new male cutoff trial.
- D15 at `energy.cjs:805–807` divides sessions by food-row count rather than elapsed weeks; it is already a registered implementation defect with a static witness. Keep that correction separate from choosing any EA policy.
- `policy.cjs:633–657 phaseProposal` now sends EA concerns through a reported-symptom sentinel and says the calculation cannot diagnose or clear someone. Do not misreport it as an automatic diet-break prescription. Unknown health/recovery facts must remain unknown.

**M/status/tests:** energy is identical; phaseSupervisor's named body is identical A594–630/M591–627. phaseProposal and recoveryIndex differ; this trace is explicitly A. Static sleep-cell tests cover unknown observations, not clinical safety or EA threshold validity. IOC's corrected Figure 6 and supplements were not fully inspected.

## S03 — Protein basis and applicability

**KEEP as a provisional, conditional default; CLARIFY the asserted requirement.**

- `energy.cjs:117–141 proteinTarget` uses 2.5 g/kg FFM rounded to 5 g, propagates the model's body-fat band and no longer uses a 12.2% switch. Its explanation calls the FFM measured and the target an evidence floor; its rest-day claim can sound like a higher requirement established for this person. The rule is not phase-specific.
- Refalo/Trexler/Helms [R07] offers exploratory evidence in non-obese, trained, predominantly young adults in energy restriction. The practical FFM basis assumes a reasonably accurate FFM estimate. The study-level association does not identify a universal minimum or this person's optimal grams; the model's uncertainty also is not a validated personal interval. A body-mass basis may be easier when FFM is poorly known, but this audit does not pick a replacement number for Joe or Dad.
- Direct consumers: `today-model.cjs:103,217`, `coach/tools.cjs:464–483`, and `coach/coach-text.cjs:53,61–64,153–155` carry the value and reinforce a floor. Retain the grams as a labelled starting target if desired, distinguish estimate from measurement, and allow preference/phase/context to be considered without claiming a study proved the individual's requirement.

**M/status/tests:** energy identical. P verdict N5 already retired the body-fat switch. `today.cjs:230–280 fiveLevers` now requires at least one observed protein hit before calling a rate good; D25's old 0/1 witness is not a current defect assertion. No individual protein response or health status was assessed.

## S04 — Surplus, gain units, fats/carbs

**KEEP monthly units and honest absent targets; CLARIFY/change only with an owner decision.**

- `constants.cjs:326–398` uses weekly equivalents of 0.25–0.5% body weight per month. This is already corrected; do not recommend a tenfold weekly increase. The app cap remains a cautious choice, not a measured muscle-synthesis ceiling or established optimum. The small surplus RCT [R08] does not establish that precise monthly range.
- `energy.cjs:594–675 energyBalanceTarget` prices a surplus using an accretion bound after the strength/scale regime calls fat loss exhausted. The cap is labelled more cautiously at `:616`, but the causal statement at `:615` is unsupported (S08). `today.cjs:483–494 marchingOrder` and `:531–604 nowModel` consume this calculation. The separate Today nutrition projection calls `calorieTarget`; agreement between those paths was not executed or proved.
- `today-app.cjs:875–908` displays carbohydrate/fat amounts without fabricating numeric targets when only calorie/protein targets exist. No new universal fat/carbohydrate floor is proposed. P verdict N4/N8 already corrected gain units and parked the fat-floor question. Any policy expansion requires a concrete owner choice and appropriate applicability facts.

**Tests/status:** energy/constants identical A/M; Today file differs. No executed proof of surplus response or cross-consumer agreement. The plateau-to-surplus policy must be separated from a biological diagnosis.

## S05 — Sets, indirect work, maintenance and growth

**KEEP fractional counting as a convention; CHANGE-PROPOSED for SDES-to-person inference.**

- `volume.cjs:65–97 programmeVolume` reads the actual effective programme week and separate muscle heads, with 0.5 credit for configured indirect exercises. That matches a supported analytic convention [R09], not a claim that every exercise stimulates each head by exactly half a direct set. The catalogue-specific indirect map and direct-only starter display need their conventions stated; they are not interchangeable counts.
- `:100 hypGain` is a hand-calibrated square-root function; `:103–146 volumeImbalance` searches up to 12 extra sets for a modelled change clearing 2.05%, then makes the increment actionable only in the confirmed free regime. `coach/tools.cjs:777–824` directly emits `addWeeklySets`, `expectedGainPct` and `smallestDetectablePct`. Thus this is a proposal-sizing rule, not merely a bibliography note.
- Pelland [R09] uses variability from non-training control research to contextualize group-level effects. Its tier point estimates do not establish this athlete's detectable improvement, and its fitted mean is not a personal guaranteed dose-response curve. The current personal expected-gain framing and threshold-sized increment exceed that evidence. Keep descriptive research context; an increment/review schedule must be identified as chosen policy. The owner must decide that policy rather than have D2 invent a smaller increment.
- `volumeImbalance:145` also treats Roth as identical preservation and calls 30 kcal/kg a deficit. [R10] used that as total intake, with no detected between-volume difference and appreciable variation. Bickel [R11] concerns training-dose reduction after an initial training block, with age differences, not a guaranteed deficit-retention floor. Four weekly hamstring sets are not thereby proved a retention emergency or proved sufficient for everyone. Maintenance/growth and energy balance remain distinct.

**M/status/tests:** programmeVolume differs A/M, while volumeImbalance's complete named body is identical A103–146/M99–142. A `test/volume-projection.cjs` and `volume-reference.cjs` are static parity/reference checks. They do not test an individual's response, validate SDES transfer, or establish that a proposal was applied. None ran.

## S06 — Effort, progression, records and noise

**KEEP recorded performance and repaired comparisons; CLARIFY heuristic steps; INVESTIGATE intended failure policy.**

- `progression.cjs:19–54 progressStep` uses exact rep increments (+1/+2/+3) from terminal RIR, capped at >=3; `:270–316 targetsFor` distributes the next line. [R12/R13] support useful effort regulation and uncertainty near failure, not the precise next-session dose. Native `performed.cjs:109–122 performedStepWhy` now honestly calls this the current rule; preserve that improvement. Legacy prose still implies uniquely justified stimulus. `today.cjs:66–173 genSession` renders the target/reason/runway; `gym-model.mjs:128–176` reads the same governing comparison.
- `writers.cjs:791–842 rirPlan` initializes the terminal set at 0 RIR for each exercise, except alarm flooring and opener changes. Its later comment at 815–817 says 1–2 RIR with occasional failure. This is a static policy/copy contradiction, not proof of the owner's latest intent. [R13] does not require failure or establish exact RIR targets; absence of need is not a ban on voluntarily using it. PM-authorized supplement2 `rebuild/m4/workout/engine-runtime.cjs:28–30,50–59` exposes the writer-factory reader through a direct forwarder. The UI reads stored effort targets at `gym-model.mjs:70–76,281–284`. The intervening prescription-capture producer was not among the inspected inputs, so an end-to-end call-chain claim remains incomplete; the gym comment claiming only two exposed readers is stale (the runtime exposes four).
- `progression.cjs:423–444 repsLostOnJump/windowFor` uses Epley plus a one-rep buffer to set a window; `today.cjs:156–172` renders it. Treat this as a prediction/operating window, not an established cost of every load jump on every lift. The old programme-specific debut calibration also cannot be assumed to transfer to Dad.
- Fixed issues: `progressAnchor:138–179` now uses the last comparable session, not a selected maximum. `beatsNoise:604–616` now includes both old/new error through sqrt(2). Do not re-open those prior bugs. Remaining `typicalError:564–601` pools same-load repeat differences or falls back to published error; learning, protocol drift, within-session dependence and selection can limit a personal confidence interpretation. [R14] is repeat bench testing in trained men and women, not validation of this multi-set banking threshold. ACSM two-for-two is an operating progression heuristic, not such validation either.

**M/status/tests:** progressStep/windowFor/typicalError/beatsNoise and rirPlan bodies are identical (rirPlan A791–842/M789–840); anchor/targets differ with native handling. Tests were only searched/read as source, including preserved defect witnesses; no claim of passing or calibration. Proposed checks should exercise rule/wording consistency and missing ratings, without asserting scientific validity from a green suite.

## S07 — Sleep, readiness and deloads

**KEEP downside-only bookkeeping and unknown states; CLARIFY advice; INVESTIGATE untraced alarm copy.**

- `sleep.cjs:1035–1049 cleanAtDate` uses a performance convention (6.5 last night / 7 mean), while `:1925–1962 sleepInfo` and the target path distinguish the chosen target. These are not experimentally validated individual thresholds. A's currentSleepObservation/recovery changes distinguish missing nights and unknown targets; keep the protections covered by the static sleep-target-cell sources.
- Craven [R15] reports a mean strength effect with uncertainty; it cannot be dismissed because its magnitude resembles test-retest variability. Conversely it does not establish that short sleep invalidates a personal record or mandates a particular rep penalty. Retain the separation of delivered performance from readiness policy. No upward sleep gate should be restored.
- `today.cjs:299–305 theOneFix` says more steps carry no recovery/lean-mass cost and directly prioritizes sleep over a smaller plate using the acute trial. `:580 nowModel` exposes the fix body; `today-model.cjs:218–219` repeats it. Its companion full-night-keeps-loss-as-fat statement is in `whyNot`, whose current display was not proved by this trace. [R02/R16] do not support individual guarantees or this precise tradeoff. Replace with bounded expectations, not a blanket claim that walking is dangerous or sleep irrelevant.
- `sleep.cjs:1647–1681 bodyAlarmSignal` combines pulse and personal anomalies; `writers.cjs:814` uses it for an RIR floor. `sleep.cjs:1684–1717 bodyAlarm` adds precise hydration, eating and exit advice. Its presentation consumer was not established; do not call that copy live. Its numbers remain chosen rules, not a diagnosis or a clinically validated clearance protocol.
- [R17] tests one week of complete training cessation mid-programme, not this app's 5% reset, symptom-triggered reduction or a validated deload frequency. No trial identified here validates the complete app policy. The next useful review is a named rule and consumer with an owner decision, not a generic request for more readiness tracking.

**M/status/tests:** bodyAlarmSignal identical; cleanAtDate/recoveryIndex/bodyAlarm/Today differ. Static `b1b2-sleep-target-cells.cjs` includes missing/unknown guards and preserved finite behavior. Some long inline controls were not fully read. No test was executed, and retained finite copy does not become scientifically correct by parity.

## S08 — Strength and personal body composition

**CHANGE-PROPOSED to the interpretation; owner decision before changing the decision rule.**

- `energy.cjs:185–221 _regimeRaw/regime` combines strength/scale trends; `:575–675 energyBalanceTarget` turns them into fat-loss/growth interpretations and calorie directions. `volume.cjs:103–146` uses the same free regime to permit a growth proposal. Strength and scale alone cannot identify tissue changes. [R03/R18] separate strength outcomes from lean-mass outcomes; neither proves an individual is losing muscle either.
- P `RESEARCH-DESIGN.md:366–465` deliberately introduced this regime policy and explicitly recognized strength as an imperfect proxy. The defect in the reviewed advice is unwarranted biological certainty, not an accidental unapproved addition of a known policy. Label the observed lift/scale changes and uncertain inference. A new requirement for body-composition evidence or a new surplus gate would alter the policy and must go to Joe.
- `energy.cjs:83–114 bfEst/anchorTighten` carries an eye/DEXA anchor and modelled uncertainty; a waist observation can tighten its band. No user-facing consumer of anchorTighten was established. A band is useful only with its actual assumptions; it is not a measured personal confidence interval. The single-DEXA partition problem in S01 has a clearer target consumer.

**M/status/tests:** energy identical, active Today/coach/volume traces noted above. No personal body-composition measurement or retention was verified. No numeric strength-to-muscle conversion is proposed.

## S09 — Refeeds, breaks and exit claims

**KEEP dated history/consent; CLARIFY mechanistic absolutes and contrary evidence.**

- `policy.cjs:511–518 dietBreakHonest` and `:659–675 phaseProposal` describe breaks as adherence help without metabolic rescue. A week at maintenance and a two-day refeed are different interventions. [R19/R20] support possible appetite/tolerability benefits; failure to detect a long-term group difference does not prove no effect, and short pre/post changes do not prove durable rescue. Hunger improvement is not automatically improved adherence.
- [R21] has a material corrected figure; its mixed-population RMR result cannot be silently relabelled a trained-person benefit or certainty of zero effect. The exact trained subgroup interval in older notes was not independently verified and is not repeated as fact.
- [R22/R23/R24] contain real contrary evidence: the Campbell FFM/RMR interpretation was challenged, but a dry-FFM difference survived reanalysis and the reply correctly distinguishes nonsignificance from equivalence. This does not warrant promising a refeed benefit, reinstating a retired programme, or saying it can never help.
- `energy.cjs:518–546 dietExit` has categorical water-wash-in/return-to-maintenance wording; early scale changes include uncertain water, glycogen and tissue components. Its claim of no controlled reverse-diet evidence is now too broad given the preliminary randomized abstract [R25], which itself is not a fully reported definitive trial. Keep immediate maintenance as a policy option without pretending it was uniquely proved or that early gain is necessarily all water. Its further phase-arc consumer was not fully traced here.

**M/status/tests:** energy identical; dietBreakHonest body identical A511–518/M509–516; phaseProposal differs. N8 safeguards and dated refeed retirement stand. No proposal was applied or programme changed.

## S10 — Joe, Dad and unknown applicability

**INVESTIGATE only relevant missing facts at use; KEEP honest missing-data handling.**

- No current individual age, health, training status, energy phase or measurement quality is established by this audit. Relationship and old corpus anecdotes are not profiles. Applicability of [R07/R09/R11/R13/R16] varies by age, training, energy balance and measurement setting. Unknown does not mean contraindicated or safe; this audit gives neither person a clinical clearance.
- `setup-model.mjs:81–161,261–290` and `starter-week.mjs` author an editable starting programme from stated choices and do not invent a working load. `today.cjs:84–94` keeps the baseline ask; `today-app.cjs:799–835,875–908` permits unavailable nutrition targets. This is a useful boundary, not personalized scientific validation.
- If using an FFM-based deficit target, establish source/date/uncertainty and whether the evidence's phase/training context fits. If changing effort or volume, use actual training experience, constraints and reported tolerance. Relevant health restrictions need appropriate human handling when present, not invented numerical screening cutoffs. These are applicability gaps, not permission for a new medical form or new data collection.

## S11 — Consent, coach words and action semantics

**KEEP explicit proposal confirmation; CLARIFY claims and what has actually occurred.**

- `coach/tools.cjs:405–500` takes numbers and reasons from engines; `coach/coach-text.cjs:53,61–64,153–156` governs how they are narrated. Source attribution can faithfully transmit an overclaim: provenance does not establish truth. Trace and correct the engine reason plus consumer wording together.
- `coach/tools.cjs:761–824` issues the volume proposal with unchanged state and an awaiting-yes condition. `:831–882` requires explicit confirmation and an issued proposal ID before recording the response. Keep that boundary. The admitted trace does not prove a subsequent programme application, nor that promised work has happened. No product tool was invoked.
- The proposed corrections in S01–S09 should distinguish description-only corrections from changing numeric policy. A new smaller volume step, different protein target or altered calorie regime is not authorized merely because a research review recommends it.

## S12 — Traceability and existing rulings

**CLARIFY audit coverage; no acceptance or whole-app validation.**

- 72/72 manifest identities verified; 15 engine pairs compared (7 identical, 8 different). Selected named bodies compared where science claims depend on them. Identity-only files, finite search hits, selected ranges and byte-equality re-use are recorded separately in INPUT-CUSTODY. The source-ingestion protocol/runtime sheet were identity-checked, not fully read or treated as fresh execution instructions.
- P research-brief negative findings and recurring failure modes, later nutrition verdict/N1, progression audit, RESEARCH-DESIGN and owner rulings were considered before labelling defects. Known D11/D15 remain distinct; the selected-max anchor, old error term, monthly surplus unit, protein switch, protein-hit cold start and programme-week counting have present corrections. An old defect witness intentionally asserting the former result is not a new current failure.
- Supplied browser-engine, today-engine and supplemental workout-engine-runtime composition were read as source. No imports/dependencies were followed by execution. Unresolved source-to-UI reach (the intervening rirPlan capture producer, anchorTighten, tdeeLearned, bodyAlarm presentation, dietExit end consumer) is not called proven live advice. Pending E reconciliation must resolve all 12 dispositions and each material proposed change without erasing this independent first assessment.
- Recommended verification, if PM licenses implementation later: named consumer wording/number consistency; window/date invariance; unknown-state and consent behavior; no historical rewrites. Statistical calibration or an individual intervention response needs evidence beyond an app test suite. Neither those tests nor a scientific validation study were run here.
