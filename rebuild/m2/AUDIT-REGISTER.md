# M2 post-extraction audit register — D1–D45

Base: rebuild/t2-client-core at ef83543aa825fb581671951d287854166717ad28, carrying module-7 merge eeb4935. Audit branch: rebuild/m2-audit-register. Frozen engine: fe516c1. No product fix is included.

LIVE is the witness predicate evaluated at the audit clock against the locally regenerated, hash-pinned fe516c1 private snapshot. It does not inspect the owner's current phone or remote store. Only verdicts appear here; NOT APPLICABLE records a missing temporal or input prerequisite, not a clean bill of health. The reproducible invocation is in the report.

BAR is strict evidence from the witness. A false numeric receipt meets untrue value even when the underlying change was clamped. A crash, a latent vector inconsistency or internal analyst wording alone does not establish one of the four harms. Multiple bars appear only where separately supported.

LAW describes proposed desired behavior, not an approved product rule. Each seed returns a failing assertion on both unchanged engines. Each has a narrow test-only repair control that passes and named mutants that fail; those controls are demonstrations of satisfiability, not production fixes. The OWNER RULING laws follow the recommended answer and must be amended if the owner chooses the other answer. Hours estimate implementation and focused regression work after ruling; they are not a schedule or a substitute for the oracle review.

## Target and load domain

### D1

- **PLAIN** — The app can show fewer or more first-session sets than the exercise currently calls for, when the first-session targets should fit the current set count.
- **EVIDENCE** — app.jsx @ fe516c1:1114–1123; rebuild/engine/progression.cjs:155–164 (targetsFor); rebuild/engine/test/defect-witnesses.cjs — D1 first targets bypass the current set count.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D1-first-targets-fit-current-set-count · progression · First-session authored targets preserve their existing slots and use the existing authored-array fit rule when the set count grows or shrinks. Mutant: first-array-bypasses-existing-authored-fit.
- **FIX** — rebuild/engine/progression.cjs / targetsFor: route ex.first through the same fitN helper as std and reclaim. Estimate 1 hour. No receipt string changes; port-oracle target goldens change only for affected shapes and must be handled in the later ruled fix tranche.
- **RECOMMENDATION** — FIX — The function already states that authored arrays must fit the current count; applying that existing rule to the omitted branch needs no new training judgement.

### D2

- **PLAIN** — The app accepts an impossible number of sets as valid and can crash while preparing the exercise, when it should keep that record marked invalid.
- **EVIDENCE** — app.jsx @ fe516c1:1858,1901,1123; rebuild/engine/plan.cjs:84,123 (_bornValid/canonicalizePlan), rebuild/engine/progression.cjs:164 (targetsFor); rebuild/engine/test/defect-witnesses.cjs — D2 negative sets pass validity and unquarantine, then throw.
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D2-invalid-set-count-stays-quarantined · engine · A negative set count is invalid, retains its quarantine across canonicalization, and never reaches target allocation as an active exercise. Mutant: numeric-type-admits-negative-count-and-clears-quarantine.
- **FIX** — rebuild/engine/plan.cjs / _bornValid and canonicalizePlan: require a finite positive integral set count and finite positive rep ceiling before clearing quarantine. Estimate 2 hours. No frozen receipt strings need change; migrated invalid-shape census output may change and requires later golden review.
- **RECOMMENDATION** — FIX — Rejecting a negative array length is basic record validity; the demonstrated crash is an availability defect, and the witness does not establish loss of a stored fact or a false printed receipt.

### D5

- **PLAIN** — The app can call an exercise's equipment maxed out merely because the same available weight was entered twice, when duplicates should not create a valid equipment ladder.
- **EVIDENCE** — app.jsx @ fe516c1:1258–1262,1321–1324; rebuild/engine/progression.cjs:239–243,299–302 (loadRungs/parseRungs); rebuild/engine/test/defect-witnesses.cjs — D5 duplicate-only rungs become a one-rung maximum.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D5-ladder-minimum-counts-distinct-rungs · progression · Duplicate copies of one weight do not satisfy the existing two-rung minimum and do not block the ordinary next increment. Mutant: raw-rung-count-checked-before-deduplication.
- **FIX** — rebuild/engine/progression.cjs / loadRungs and parseRungs: validate the existing minimum after deduplicating finite positive rungs. Estimate 1 hour. No receipt template changes; targets and load census values can change for duplicate-only ladders.
- **RECOMMENDATION** — FIX — Both entry points already require two rungs; counting distinct rungs consistently corrects that implementation without inventing a new equipment policy.

### D6

- **PLAIN** — The app can propose a reduced weight even though no working weight has been recorded, when it should keep the missing weight unknown.
- **EVIDENCE** — app.jsx @ fe516c1:1310–1319, especially 1311–1314; rebuild/engine/progression.cjs:287–296, especially 288–291 (deloadLoad); rebuild/engine/test/defect-witnesses.cjs — D6 missing load is converted into deload 5.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D6-deload-preserves-absent-load · progression · Null, omitted and empty-string loads have no deload value, while a recorded numeric load still yields its ordinary deload. Mutant: numeric-coercion-turns-absence-into-deload-five.
- **FIX** — rebuild/engine/progression.cjs / deloadLoad: apply the same pre-coercion absence guard as nextLoad and prevLoad. Estimate 1 hour. No receipt text change is required; any census path containing an invented deload will change in the later fix.
- **RECOMMENDATION** — FIX — The neighboring load helpers already establish that absence is not zero, so extending their guard requires no new training judgement.

## Receipt identity

### D3

- **PLAIN** — The app can count a set change for another similarly named exercise as a change to this exercise, when each exercise should keep its own set history.
- **EVIDENCE** — app.jsx @ fe516c1:1071–1087, especially 1077; rebuild/engine/progression.cjs:118–134, especially 124 (_volDeltas); rebuild/engine/test/defect-witnesses.cjs — D3 a longer lift name claims another lift's volume receipt.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D3-volume-receipt-belongs-to-whole-lift-name · progression · A volume receipt for a longer distinct lift name contributes no set change to the shorter lift while its own receipt still contributes. Mutant: volume-owner-is-name-substring.
- **FIX** — rebuild/engine/progression.cjs / _volDeltas, with identity fields from the volume receipt writers in writers.cjs: prefer stable lift identity and use a whole-name legacy boundary for old receipts. Estimate 4 hours. Preserve visible receipt prose if adding structured identity; correcting historical ownership can change progression goldens.
- **RECOMMENDATION** — FIX — A different exercise's change is not this exercise's fact; identity correctness needs no training-rule ruling.

### D4

- **PLAIN** — The app can erase this exercise's progress credit when a different exercise with a longer similar name earns a weight increase, when that credit should belong to this exercise alone.
- **EVIDENCE** — app.jsx @ fe516c1:2220–2263, especially 2232; rebuild/engine/progression.cjs:492–538, especially 504 (_deriveSightingFull/deriveSighting); rebuild/engine/test/defect-witnesses.cjs — D4 a longer lift name clears another lift's sightings.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D4-other-lift-earn-cannot-spend-sightings · progression · An earn receipt for another exercise leaves this exercise's two qualifying performances intact, while this exercise's own earn still spends them. Mutant: earn-owner-is-unbounded-name-prefix.
- **FIX** — rebuild/engine/progression.cjs / _deriveSightingFull: bind earn receipts to lift identity, with a complete legacy name-and-load boundary for old prose. Estimate 4 hours. Existing receipt text can stay; derived progress credit and resulting census goldens may change.
- **RECOMMENDATION** — FIX — Spending one exercise's earned credit on another is an identity bug; the source performances remain stored, so the bar is a false derived value rather than demonstrated loss of a fact.

## Clock and as of

### D7

- **PLAIN** — The app can use sessions dated after the day being viewed to describe earlier progress, when an earlier view should use only evidence available by that day.
- **EVIDENCE** — app.jsx @ fe516c1:983–985,3188–3191; rebuild/engine/progression.cjs:68–70,562–565 (progressAnchor/liftTrend); rebuild/engine/test/defect-witnesses.cjs — D7 future sessions enter an earlier anchor and trend.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D7-anchor-and-trend-exclude-future-sessions · progression · The current anchor and an explicitly earlier trend omit later sessions while a later as-of view can still use those same records. Mutant: as-of-restricts-era-but-not-session-dates.
- **FIX** — rebuild/engine/progression.cjs / progressAnchor and liftTrend: exclude session dates beyond their current or supplied as-of day before deriving evidence. Estimate 2 hours. No receipt-template edits; earlier-view or future-dated-fixture goldens may change.
- **RECOMMENDATION** — FIX — A future session cannot be evidence for an earlier as-of claim; filtering by the declared date is a reader-contract correction.

### D8

- **PLAIN** — The app can treat an old short night as today's sleep debt when no recent night is recorded; whether missing sleep should keep that old restriction is the owner's call.
- **EVIDENCE** — app.jsx @ fe516c1:6994–7001; rebuild/engine/sleep.cjs:1009–1018 (nightsBefore/cleanAtDate); rebuild/engine/test/defect-witnesses.cjs — D8 an eight-month-old night controls current sleep context.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — D-D8-stale-sleep-does-not-claim-current-debt · policy · With no entry for last calendar night, stale sleep has the same nonblocking effect as the existing missing-sleep baseline, while last night's short sleep still flags debt. Mutant: last-logged-night-stands-in-for-last-calendar-night.
- **FIX** — rebuild/engine/sleep.cjs / cleanAtDate and its sleep-context consumers: require the latest night to be last calendar night before treating its status as current, and expose missing evidence distinctly where shown. Estimate 3 hours. Recovery wording and any resulting target/Today goldens may change; this is conditional on the ruling.
- **RECOMMENDATION** — OWNER RULING — Should missing last-night sleep leave recovery unclassified and nonblocking (recommended), or carry the last logged night's restriction forward? The recency and missing-data policy is a product/training rule, not merely a date calculation.

### D9

- **PLAIN** — The app can show a different workout day when the same schedule records arrive in a different order, when the most recently effective schedule should determine the day.
- **EVIDENCE** — app.jsx @ fe516c1:656–662, especially 660; rebuild/engine/plan.cjs:11–17, especially 15 (dayType); rebuild/engine/test/defect-witnesses.cjs — D9 split selection depends on array order.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D9-split-selects-latest-effective-date · engine · Reordering the same distinct effective-date schedule records leaves today's day type unchanged and selects the newest applicable record. Mutant: last-array-row-wins-effective-split.
- **FIX** — rebuild/engine/plan.cjs / dayType: select the qualifying record with the greatest effective date rather than the final qualifying array row. Estimate 1 hour. No receipt string changes; unsorted-schedule Today goldens may change.
- **RECOMMENDATION** — FIX — Record arrival order is not an effective date; the witness uses distinct dates and needs no tie-breaking product rule.

### D10

- **PLAIN** — The app counts seven calendar days across a clock change as slightly less or more than a week; whether a week means calendar days or elapsed hours is the owner's call.
- **EVIDENCE** — app.jsx @ fe516c1:306,311; rebuild/engine/dates.cjs:8,23 (mk/weeksBetween); rebuild/engine/test/defect-witnesses.cjs — D10 calendar-week arithmetic counts elapsed DST hours.
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D10-calendar-week-is-seven-calendar-dates · engine · Seven calendar dates apart is exactly one week in either direction across either New York daylight-saving transition. Mutant: calendar-week-count-divides-local-elapsed-hours.
- **FIX** — rebuild/engine/dates.cjs / weeksBetween: subtract calendar-day ordinals instead of local elapsed milliseconds if calendar semantics are ruled. Estimate 2 hours. No receipt strings require editing; rate, body-composition and date-dependent goldens need review where an interval crosses a clock change.
- **RECOMMENDATION** — OWNER RULING — Should date-only week intervals count calendar days (recommended), or actual elapsed hours? The witness proves a difference, but the intended unit must be ruled before calling either result false.

### D15

- **PLAIN** — The app says workouts happened more often when food was logged less often, although the workouts and dates are unchanged.
- **EVIDENCE** — src/app.jsx @ fe516c1:4435-4437; rebuild/engine/energy.cjs:805-807; rebuild/engine/test/defect-witnesses-2.cjs / D15 food-row count inflates session frequency across a sparse interval
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D15-session-frequency-does-not-change-with-food-row-density · engine · Adding otherwise identical food records must not change the weekly frequency of an unchanged workout record. Mutant: food-row-count-is-elapsed-weeks
- **FIX** — rebuild/engine/energy.cjs / energyAvailability: Use the elapsed observation interval for logged workout frequency while retaining the existing scheduled-frequency floor. Estimate 3 hours. The training-cost numbers and their existing receipt interpolation change; downstream calorie and Today goldens may change.
- **RECOMMENDATION** — FIX — This corrects a denominator error without changing the existing preference for the higher logged or scheduled estimate.

### D19

- **PLAIN** — The app says a seven-day break is on day six and the cut resumes today while today is still inside the break.
- **EVIDENCE** — src/app.jsx @ fe516c1:5559,5594,5605; rebuild/engine/policy.cjs:531,563,573; rebuild/engine/test/defect-witnesses-2.cjs / D19 break-end wording resumes the cut while the break is still active
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D19-inclusive-break-end-prose-agrees-with-active-day · policy · An inclusive break calls its last active day day seven and names the following calendar date as the cut resumption. Mutant: zero-based-break-day-and-same-date-resumption
- **FIX** — rebuild/engine/policy.cjs / phaseArc: Keep the existing inclusive active interval and derive one-based day numbering and next-day resumption wording from it. Estimate 2 hours. The frozen phase receipt string changes in both line and next.when; phase/Today golden impact must be checked.
- **RECOMMENDATION** — FIX — The active interval already establishes the rule; the two displayed dates and day number must agree with it.

### D21

- **PLAIN** — On the day the clocks move back, the app can call sleep clean even after a short night logged for that day.
- **EVIDENCE** — src/app.jsx @ fe516c1:14455; rebuild/engine/sleep.cjs:1883-1887; rebuild/engine/test/defect-witnesses-2.cjs / D21 fall-back sleepInfo skips the same-date night
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date · engine · The fall-back day's sleep cleanliness includes the night recorded on that calendar date. Mutant: tomorrow-is-exactly-twenty-four-hours-later
- **FIX** — rebuild/engine/sleep.cjs / sleepInfo: Advance to the next calendar date instead of adding a fixed twenty-four hours. Estimate 1 hours. No stored receipt wording changes; sleep and recovery outputs on fall-back dates change, with downstream golden risk.
- **RECOMMENDATION** — FIX — The existing date-based sleep reader is passed the wrong calendar day.

### D28

- **PLAIN** — The app counts planned weekly sets using an old training schedule after a newer schedule has taken effect.
- **EVIDENCE** — src/app.jsx @ fe516c1:8676,656-666; rebuild/engine/volume.cjs:62-64; plan.cjs:11-21; rebuild/engine/test/defect-witnesses-4.cjs / D28 fixed July week ignores a later training-frequency change
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D28-programme-volume-follows-the-current-effective-split · engine · Designed weekly volume uses the currently effective weekly split. Mutant: programme-volume-uses-authored-july-week
- **FIX** — rebuild/engine/volume.cjs / programmeVolume: Derive the relevant week from the as-of calendar and use the effective split for its days. Estimate 2 hours. Planned volume numbers and their dependent advice change; port golden impact is possible even without editing prose templates.
- **RECOMMENDATION** — FIX — The plan reader already exposes the effective schedule; an authored historical week is the wrong input.

### D37

- **PLAIN** — The app changes the explanation of the same past earned increase when copies are combined on a later day; whether it should describe the past or today's interpretation is the owner's call.
- **EVIDENCE** — src/app.jsx @ fe516c1:14441,2493,2533,2163,2132; rebuild/engine/merge.cjs:1085, rebuild/engine/migrate.cjs:215–216,259 and rebuild/engine/progression.cjs:444–449; rebuild/engine/test/defect-witnesses-6.cjs case D37 same merge inputs yield a different earned receipt at a later clock.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs two replicas merged at different clocks)
- **LAW** — V4-merge-earned-receipt-historical-asof · engine · The same historical joint earn carries the same measured receipt regardless of the wall day of merge. Mutant: wall-day-noise-in-historical-earn prices a dated earn using today's noise pool.
- **FIX** — rebuild/engine/migrate.cjs; rebuild/engine/progression.cjs / _mintJointEarn / earnWalk / beatsNoise / typicalError: Pass the earned session's historical as-of date through every noise calculation used by a joint earn. Estimate 6 hours. May change frozen earned-receipt numbers and whether a one-sighting earn qualifies; port reader goldens and merge writer fixtures need rechecking after the ruling.
- **RECOMMENDATION** — OWNER RULING — Should a dated earned receipt retain the decision-day assessment or be explicitly relabeled as today's reassessment (recommended: retain the decision-day assessment)?

## Numeric values and units

### D11

- **PLAIN** — The app can show a lower maintenance estimate above its upper estimate while calling unchanged activity a meaningful change, when the range should stay ordered and no activity change should mean no adjustment.
- **EVIDENCE** — app.jsx @ fe516c1:3815–3816,3840,3844; rebuild/engine/energy.cjs:449–450,474,478 (observedTDEE); rebuild/engine/test/defect-witnesses-2.cjs — D11 gaining rate reverses TDEE endpoints and promotes zero step drift.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted · engine · A gaining-state maintenance interval stays ordered around its point estimate and zero step change cannot promote an adjusted headline. Mutant: clamp-only-lower-endpoint-to-zero.
- **FIX** — rebuild/engine/energy.cjs / observedTDEE: transform both interval endpoints consistently through the existing rate-to-energy calculation, order them, and compute promotion from a nonnegative halfwidth. Estimate 3 hours. The stepsWhy receipt embeds the interval and promotion claim and must be regenerated consistently; affected numerical/prose goldens change.
- **RECOMMENDATION** — FIX — Reversed endpoints and promotion of a zero change are arithmetic contradictions; correcting them does not choose a new training rule or tissue-energy model.

### D12

- **PLAIN** — The app can report the effect of extra steps a thousand times too large and dismiss the relationship as implausible, when the calculation should use one consistent unit.
- **EVIDENCE** — app.jsx @ fe516c1:6962,7176; rebuild/engine/energy.cjs:1169,1186 (liveRollups/stepEfficacy); rebuild/engine/test/defect-witnesses-2.cjs — D12 step efficacy scales an already-per-thousand slope again.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — TRIGGERED
- **LAW** — E-D12-step-slope-keeps-per-thousand-units · engine · A synthetic relationship of 0.1 pounds per week per thousand steps remains 0.1 after fitting and is evaluated against the existing bound in the same unit. Mutant: multiply-already-per-thousand-slope-by-thousand.
- **FIX** — rebuild/engine/energy.cjs / stepEfficacy: remove the extra thousand-fold scaling because both live and seed rollups already express steps in thousands. Estimate 3 hours. Existing templates may print changed values and resolution claims; step-policy and prose goldens may change without editing their strings.
- **RECOMMENDATION** — FIX — This is dimensional consistency, not a judgement about whether activity causes weight change; all existing confidence and bound rules remain in force.

### D14

- **PLAIN** — The app can show an invalid fat-loss rate when a missing model setting already has a defined default, when the rate should use that same default.
- **EVIDENCE** — app.jsx @ fe516c1:3485,3501,2835; rebuild/engine/energy.cjs:285,301,21 (currentRate/dripOf); rebuild/engine/test/defect-witnesses-2.cjs — D14 currentRate bypasses the missing-drip default and returns NaN.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D14-current-rate-uses-missing-drip-default · engine · A measured current rate with an omitted drip setting is finite and equals the result with the existing dripOf default supplied explicitly. Mutant: fat-rate-adds-undefined-drip-directly.
- **FIX** — rebuild/engine/energy.cjs / currentRate: use dripOf(s) in both measured-return branches instead of reading s.model.drip directly. Estimate 1 hour. No receipt template changes; any raw-rate or downstream census path that formerly carried NaN may change.
- **RECOMMENDATION** — FIX — The missing-setting default already exists and is zero; applying it consistently adds no new physiological assumption.

## Cache identity

### D13

- **PLAIN** — The app can keep showing an old energy estimate after the underlying body-weight estimate changes, when a fresh reading should reflect the updated record.
- **EVIDENCE** — app.jsx @ fe516c1:5158–5163,4798,4803; rebuild/engine/energy.cjs:1130–1136,1005,1009 (memoOnState/_energyDensityLoss/energyDensity); rebuild/engine/test/defect-witnesses-2.cjs — D13 energy-density identity cache survives changed state.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs a write between two cached reads of the same object)
- **LAW** — E-D13-energy-density-cache-tracks-relevant-state · engine · After relevant contents of the same state object change, energyDensity equals a fresh uncached calculation on that updated object. Mutant: memo-key-is-object-identity-without-invalidation.
- **FIX** — rebuild/engine/energy.cjs / memoOnState and energyDensity: bind the memo to a state revision or relevant immutable input snapshot so in-place writers cannot retain a stale result. Estimate 4 hours. No template wording changes are needed; formerly stale numerical and embedded-label goldens can change after writer sequences.
- **RECOMMENDATION** — FIX — The extracted engine already exposes writers that mutate state, so a cache keyed only by object identity violates its actual mutable-state contract.

### D20

- **PLAIN** — The app keeps an earlier forecast after the observations used to make it have changed.
- **EVIDENCE** — src/app.jsx @ fe516c1:5202,5205,5157-5166; rebuild/engine/policy.cjs:271-274; energy.cjs:1130-1139; rebuild/engine/test/defect-witnesses-2.cjs / D20 forecast identity cache retains an earlier rate
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs an earlier cached read followed by a write to the same in-memory state)
- **LAW** — E-D20-forecast-refreshes-after-an-observed-rate-change · engine · Changing the recorded daily observations refreshes the forecast rate even when the same state object is retained. Mutant: forecast-is-cached-only-by-state-object
- **FIX** — rebuild/engine/policy.cjs / forecast / _forecastCached: Invalidate the forecast when relevant state content changes or require a fresh immutable state at every writer boundary. Estimate 3 hours. No receipt template needs editing; refreshed forecasts and dependent Today golden values can change.
- **RECOMMENDATION** — FIX — Returning an earlier rate after the underlying rate changed is a stale-value bug.

### D26

- **PLAIN** — The app can keep showing yesterday after midnight when no new record has been entered.
- **EVIDENCE** — src/app.jsx @ fe516c1:15425,15535-15536,5158-5163; rebuild/engine/today.cjs:508,622-625; energy.cjs:1130-1139; rebuild/engine/test/defect-witnesses-3.cjs / D26 unchanged state keeps yesterday's Today model after the clock advances
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs a cached Today read before a calendar rollover)
- **LAW** — E-D26-today-model-refreshes-when-the-calendar-day-changes · engine · The Today model refreshes its calendar date after a coherent clock rollover even if the state is unchanged. Mutant: today-cache-omits-clock-validity
- **FIX** — rebuild/engine/today.cjs / nowModel / _nowMemo: Include calendar validity in the cache key or expire the cached model when the required clock boundary changes. Estimate 3 hours. No stored receipt string changes; date-dependent Today values and golden outputs can change.
- **RECOMMENDATION** — FIX — The reader explicitly depends on the clock, so state identity cannot establish freshness.

## Receipt truth

### D16

- **PLAIN** — The app calls a forecast a seven-day success using a weigh-in from a month later; the owner must choose how late a reading may be.
- **EVIDENCE** — src/app.jsx @ fe516c1:5483,5488,5491-5495; rebuild/engine/policy.cjs:474-486; rebuild/engine/test/defect-witnesses-2.cjs / D16 a much later read is graded as a seven-day forecast hit
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — TRIGGERED
- **LAW** — E-D16-seven-day-forecast-does-not-grade-a-month-late-read · engine · The proposed seven-day forecast window grades eligible readings on the due day or following day and leaves later readings ungraded. Mutant: first-later-read-has-no-horizon-limit
- **FIX** — rebuild/engine/policy.cjs / trackRecord: Require an eligible read inside the owner-ruled forecast horizon before recording a hit. Estimate 4 hours. The historical hit totals and calibration receipt change; no direct port census field is known, but downstream golden impact must be checked.
- **RECOMMENDATION** — OWNER RULING — Should a seven-day forecast require a reading on the exact seventh day or also allow the following day (recommended)?

### D17

- **PLAIN** — The app says an adjustment is still applied after the athlete has undone it.
- **EVIDENCE** — src/app.jsx @ fe516c1:5502-5503; rebuild/engine/policy.cjs:494-495; rebuild/engine/test/defect-witnesses-2.cjs / D17 an undone adjustment is reported as applied
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D17-undone-adjustment-is-not-described-as-applied · engine · An undone adjustment stays in decision history with applied false. Mutant: applied-means-only-not-dismissed
- **FIX** — rebuild/engine/policy.cjs / trackRecord: Include the existing undone flag when deriving whether the adjustment is applied. Estimate 1 hours. Decision-history status changes without rewriting stored receipt text; verify downstream golden selectors.
- **RECOMMENDATION** — FIX — The existing undo fact must be reflected in the displayed status.

### D24

- **PLAIN** — The app says yesterday is complete after only steps were entered even though the ledger still says yesterday's food is missing.
- **EVIDENCE** — src/app.jsx @ fe516c1:8454,8460-8461,6875-6876; rebuild/engine/today.cjs:196,202-203; sleep.cjs:997-998; rebuild/engine/test/defect-witnesses-3.cjs / D24 a partial yesterday row disappears from what is owed
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D24-partial-yesterday-remains-owed-until-calories-are-present · engine · A yesterday row lacking calories remains owed in both Today and the ledger. Mutant: any-yesterday-row-counts-as-complete
- **FIX** — rebuild/engine/today.cjs / nowFocus: Use the same calorie-completeness predicate for yesterday that the existing ledger and today checks use. Estimate 1 hours. Today obligation labels and clear status change; existing label wording can remain intact, but Today golden impact is possible.
- **RECOMMENDATION** — FIX — The two views already disagree about the same explicit completion field.

### D25

- **PLAIN** — The app calls protein good when the only recorded day misses the target; whether one forgiven miss should apply immediately is the owner's call.
- **EVIDENCE** — src/app.jsx @ fe516c1:8507-8512; rebuild/engine/today.cjs:238-244; rebuild/engine/test/defect-witnesses-3.cjs / D25 zero protein on the sole logged day is GOOD 0/1
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D25-zero-protein-successes-cannot-be-a-good-protein-read · engine · Zero successful protein days cannot produce a good protein status. Mutant: one-miss-allowance-permits-zero-successes
- **FIX** — rebuild/engine/today.cjs / fiveLevers: Require at least one successful observation before the one-miss allowance can produce good. Estimate 1 hours. The status changes while the existing 0/1 detail stays truthful; downstream Today golden risk is limited but must be checked.
- **RECOMMENDATION** — OWNER RULING — Should good require at least one successful protein day (recommended), or may the one-miss allowance mark the first missed day good?

### D27

- **PLAIN** — The app tells an athlete already at maintenance that a long calorie cut has stalled and a diet break is due.
- **EVIDENCE** — src/app.jsx @ fe516c1:8564-8569,5579-5581,14459-14461; rebuild/engine/today.cjs:298-303; policy.cjs:549-550; sleep.cjs:1891-1894; rebuild/engine/test/defect-witnesses-3.cjs / D27 committed maintenance still receives the long-cut diet-break instruction
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D27-maintenance-is-not-described-as-a-long-stalled-cut · policy · Committed maintenance cannot receive a diagnosis that weeks of a calorie cut have stalled. Mutant: global-programme-week-substitutes-for-committed-cut
- **FIX** — rebuild/engine/today.cjs / theOneFix: Gate stalled-cut advice on the committed phase and derive long-cut duration from that phase's recorded start. Estimate 3 hours. The inappropriate instruction disappears; phase/Today golden receipts can change.
- **RECOMMENDATION** — FIX — The committed maintenance fact contradicts the claim that a deficit has been maintained for weeks.

### D36

- **PLAIN** — The app's curl upgrade receipt prints the wrong next weights when it should print the weights calculated from that curl's actual loads.
- **EVIDENCE** — src/app.jsx @ fe516c1:11387–11396; rebuild/engine/migrate.cjs:1378–1387; rebuild/engine/test/defect-witnesses-5.cjs case D36 curl migration receipt hard-codes the next per-set loads.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs the pre-v60 migration input)
- **LAW** — V4-curl-receipt-prices-actual-vector · engine · The migration receipt's next per-set load vector equals the vector priced by the migrated exercise. Mutant: hard-code-authored-next-loads restores the fixed authored vector in migration prose.
- **FIX** — rebuild/engine/migrate.cjs / patchV60: Format the next-load vector from the converted exercise and the actual nextLoad result. Estimate 3 hours. Directly touches a frozen receipt string and may affect RAW migration output goldens; committed pins must change only in the later authorized fix tranche.
- **RECOMMENDATION** — FIX — A printed number that differs from the actual transition is an untrue receipt, not a training-rule question.

### D44

- **PLAIN** — The app says it removed a set and spends the weekly change allowance even though the exercise still has the same one set.
- **EVIDENCE** — src/app.jsx @ fe516c1:9179–9183,9220,10120,1071; rebuild/engine/writers.cjs:1428–1432,1469,2292, rebuild/engine/progression.cjs:118–134 and rebuild/engine/volume.cjs:154–160; rebuild/engine/test/defect-witnesses-7.cjs case D44 a real one-set give-back offer records a phantom decrement and spends the budget.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs accepting a one-set removal offer)
- **LAW** — V4-volume-receipt-requires-actual-change · policy · An unchanged set count creates no decrement or spent move, while an allowed one-set addition still applies, reports and charges exactly once. Mutant: clamped-no-op-prints-volume-minus-one restores the phantom decrement; ignore-all-volume-acceptances checks the allowed-addition positive control.
- **FIX** — rebuild/engine/writers.cjs / sweepVolume / applyAgentProposal: Exclude one-set removal candidates and recheck the actual set delta at consent before emitting or charging a move. Estimate 3 hours. Directly changes which frozen VOLUME receipt is emitted, and can change downstream budget and progression goldens; the current minimum-one-set rule remains.
- **RECOMMENDATION** — FIX — The existing minimum already makes this a no-op; a numerical receipt for a change that never happened is untrue.

## Counts only guards

### D18

- **PLAIN** — The app forgets this week's set change when enough ordinary notes appear ahead of it.
- **EVIDENCE** — src/app.jsx @ fe516c1:8827-8830; rebuild/engine/volume.cjs:157-160; rebuild/engine/test/defect-witnesses-2.cjs / D18 an eighty-row feed prefix hides a current-week volume receipt
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix · policy · A current-week set change remains in the structural budget regardless of how many ordinary notes precede it. Mutant: eighty-feed-lines-only
- **FIX** — rebuild/engine/volume.cjs / structuralMovesThisWeek: Scan all qualifying current-week volume records instead of limiting the scan to the first eighty feed rows. Estimate 1 hours. No stored receipt wording changes; policy holds and downstream golden values may change.
- **RECOMMENDATION** — FIX — The finite display prefix is an accidental limit on the existing weekly budget; this witness proves an internal omission, not an unconsented apply.

### D33

- **PLAIN** — The app allows a saved set or weigh-in day to disappear when the number of records stays the same, when it should refuse an unexplained loss.
- **EVIDENCE** — src/app.jsx @ fe516c1:13294–13297,13329–13334; rebuild/engine/migrate.cjs:2281–2286,2320–2326; rebuild/engine/test/defect-witnesses-5.cjs case D33 counts-only guard permits unfiled set loss and replacement of a read day.
- **BAR** — lost fact
- **LIVE** — NOT APPLICABLE (needs a proposed write that removes a set or replaces a read day)
- **LAW** — V4-guard-record-identities-and-sets · engine · An unchanged write passes, while the loss guard refuses an unfiled set removal and a read-day replacement even when record counts stay equal. Mutant: counts-only-protection removes identity and nested-set checks; deny-every-write proves the unchanged-write positive control.
- **FIX** — rebuild/engine/migrate.cjs / dataLossGuard / recordCounts: Compare durable read identities and session set facts, allowing shrinkage only when covered by the existing correction record. Estimate 8 hours. No frozen receipt rewrite or direct port-reader change is expected, but import/save acceptance and correction exemptions need regression coverage.
- **RECOMMENDATION** — FIX — Preserving recorded facts is already the guard's job; counting containers fails that job.

### D34

- **PLAIN** — The app calls changed records an untouched starter copy when it should recognize that their contents differ.
- **EVIDENCE** — src/app.jsx @ fe516c1:13235–13239; rebuild/engine/migrate.cjs:2268–2275; rebuild/engine/test/defect-witnesses-5.cjs case D34 pristine-seed fingerprint ignores edited record values.
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — V4-pristine-compares-record-content · engine · A wholly synthetic pristine record is recognized regardless of object key order, while changed record values fail despite an identical coarse fingerprint. Mutant: fingerprint-only-pristine removes content comparison; nothing-is-pristine and object-order-is-record-content test the positive and order-invariance checks.
- **FIX** — rebuild/engine/migrate.cjs / isPristineSeed: Compare the relevant persisted record content against the authored starter copy before classifying it as pristine. Estimate 3 hours. No receipt rewrite or reader-golden change expected; the restore prompt's eligibility changes and needs an integration check.
- **RECOMMENDATION** — FIX — A false untouched classification is a predicate bug; the witness does not prove that any replacement or data loss occurred.

## State shape and failure

### D22

- **PLAIN** — The app crashes when saved sleep records use numbered entries instead of a list, although the nights themselves are present.
- **EVIDENCE** — src/app.jsx @ fe516c1:3592,7062,7821; rebuild/engine/sleep.cjs:237,1067,1621; synthetic-pending-debut full-reader exception parity (census-partial.cjs; REPORT-M2-2-ASTRA.md D22)
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash · engine · The recovery read preserves identical sleep facts from an accepted numeric-keyed collection without crashing. Mutant: reader-assumes-array-methods-on-accepted-indexed-shape
- **FIX** — rebuild/engine/migrate.cjs + sleep.cjs / migrate boundary / recoveryIndex / sleepAnchor / bodyAlarm: Normalize recognized numeric-keyed night collections without losing entries and reject other invalid shapes explicitly before readers run. Estimate 3 hours. Normalization changes the synthetic exception result and can alter derived golden values; do not silently replace recorded nights with an empty list.
- **RECOMMENDATION** — FIX — This repairs a representation failure for already present facts; the witness proves a reader crash, not a deleted fact or an untrue returned value.

### D23

- **PLAIN** — The app shows a rest day when a lower-body workout is scheduled and its first-use weight is ready.
- **EVIDENCE** — src/app.jsx @ fe516c1:1474,15484,15491; rebuild/engine/today.cjs:54,567,574; rebuild/engine/test/defect-witnesses-3.cjs / D23 missing sleep input hides a scheduled hack workout as REST DAY
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day · engine · A scheduled lower-body session with a ready hack debut is displayed as the scheduled workout. Mutant: missing-sleep-argument-falls-through-to-rest-day
- **FIX** — rebuild/engine/today.cjs / nowModelUncached / genSession / pickStructural: Supply the required sleep input when deriving the next workout and distinguish a failed derivation from a rest day. Estimate 2 hours. Workout title and date change from the false rest fallback; Today golden values may change.
- **RECOMMENDATION** — FIX — The same real session generator succeeds when its required argument is supplied.

### D35

- **PLAIN** — The app rewrites fields in a file from a newer app version even though it promises to return that file untouched.
- **EVIDENCE** — src/app.jsx @ fe516c1:12266,12268–12274; rebuild/engine/migrate.cjs:2217–2229; rebuild/engine/test/defect-witnesses-5.cjs case D35 newer-schema untouched exit mutates the supplied state first.
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT APPLICABLE (needs a newer-schema import)
- **LAW** — V4-unknown-schema-return-untouched · engine · Migration returns an unknown newer-schema input by identity with every supplied field unchanged. Mutant: heal-before-version-guard restores container healing before the newer-version return.
- **FIX** — rebuild/engine/migrate.cjs / migrate: Return unsupported newer versions before container healing or any other mutation. Estimate 2 hours. No frozen receipt or existing v60 golden change expected; unknown-version imports change behavior deliberately.
- **RECOMMENDATION** — FIX — The existing unsupported-version contract explicitly promises an untouched return; no future-schema health fact or commit is claimed by this witness.

## Evidence comparability

### D29

- **PLAIN** — The app counts pressing toward front-shoulder work in the plan but drops that credit when reporting the completed work.
- **EVIDENCE** — src/app.jsx @ fe516c1:8631,8693; rebuild/engine/volume.cjs:41,81; rebuild/engine/test/defect-witnesses-4.cjs / D29 logged front-delt volume loses press indirect credit
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit · progression · Completed planned presses and front raises use the same front-delt indirect-credit mapping as planned volume. Mutant: press-credit-goes-to-unreturned-coarse-delt-bucket
- **FIX** — rebuild/engine/volume.cjs / muscleVolume: Route indirect delts credit to the same delts_front bucket already used by programmeVolume. Estimate 2 hours. Logged volume numbers and zone/advice may change; no stored receipt wording changes, but derived golden risk exists.
- **RECOMMENDATION** — FIX — This aligns two readers to the existing head-specific mapping without changing the training credit fraction.

### D30

- **PLAIN** — The app reports a current first-set improvement by mixing lifts performed before and after a recorded technique change.
- **EVIDENCE** — src/app.jsx @ fe516c1:8887-8893,3187-3191; rebuild/engine/volume.cjs:193-202; progression.cjs:561-566; rebuild/engine/test/defect-witnesses-4.cjs / D30 set-one trend pools sessions across a technique fork
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — TRIGGERED
- **LAW** — P-D30-first-set-trend-respects-the-recorded-technique-era · progression · A first-set trend with only one current-era session remains counting instead of borrowing observations across a technique fork. Mutant: same-load-first-sets-pool-across-technique-forks
- **FIX** — rebuild/engine/volume.cjs / setOneRead: Apply the existing sameEra boundary before selecting the same-load sessions for the first-set fit. Estimate 3 hours. First-set status, sample count and trend values change; volume advice and downstream golden risk must be checked.
- **RECOMMENDATION** — FIX — liftTrend already excludes the earlier technique era; the first-set reader must honor that same recorded comparability boundary.

### D31

- **PLAIN** — The app says an added set was tolerated using only workouts from before that set was added, when it should wait for evidence after the change.
- **EVIDENCE** — src/app.jsx @ fe516c1:8917–8932,3213,3237–3243; rebuild/engine/volume.cjs:224–243 and rebuild/engine/progression.cjs:581–618; rebuild/engine/test/defect-witnesses-4.cjs case D31 volume tolerance is inferred entirely from pre-change sessions.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — V4-volume-tolerance-post-change · progression · A live tolerance finding uses qualifying sessions after the change at the reported set count. Mutant: reuse-pre-change-tolerance restores the unfiltered pre-change trend as tolerance evidence.
- **FIX** — rebuild/engine/volume.cjs / volumeConversion: Require the trend's set count and contributing dates to match the post-change block before returning a tolerance finding. Estimate 4 hours. Changes volume-reader status/prose and may change port-oracle reader goldens; no receipt string needs an editorial rewrite.
- **RECOMMENDATION** — FIX — This enforces the reader's existing post-change claim without choosing a new training threshold.

### D32

- **PLAIN** — The app says a benefit repeated under comparable conditions even though the earlier workouts used a different technique; whether those workouts may count is the owner's call.
- **EVIDENCE** — src/app.jsx @ fe516c1:8971–8979,1798–1813; rebuild/engine/volume.cjs:278–288 and rebuild/engine/plan.cjs:46–56; rebuild/engine/test/defect-witnesses-4.cjs case D32 replication claims comparable blocks from different technique eras.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — V4-volume-replication-same-era · progression · A replication claim requires an earlier qualifying block in the same technique era. Mutant: compare-earlier-technique-block restores pre-fork observations as comparable replication evidence.
- **FIX** — rebuild/engine/volume.cjs / volumeConversion: Exclude earlier technique eras from the stable blocks eligible to establish replication. Estimate 4 hours. Can change REPLICATED status and existing explanatory text selections in port goldens; threshold changes require a separate ruling.
- **RECOMMENDATION** — OWNER RULING — Should replication count earlier techniques or only the current technique (recommended: only the current technique)?

## Merge tie identity

### D38

- **PLAIN** — The app loses an accepted or declined trial when saved copies are combined, even though the receipt still says that decision was recorded.
- **EVIDENCE** — src/app.jsx @ fe516c1:10125–10126,10138,13876,14070; rebuild/engine/writers.cjs:2297–2298,2312 and rebuild/engine/merge.cjs:518–523,714; rebuild/engine/test/defect-witnesses-6.cjs case D38 merge drops actual writer-shaped accepted and declined trial records.
- **BAR** — lost fact; untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs a merge of a written trial decision with another replica)
- **LAW** — V4-merge-preserves-written-trial-decisions · engine · Actual accepted and declined trial rows survive merging with an empty replica in either direction. Mutant: trial-key-id-or-day-only drops writer-shaped trials that lack both fields.
- **FIX** — rebuild/engine/merge.cjs; rebuild/engine/writers.cjs / MERGE_ARR.trials / applyAgentProposal / dismissAgentProposal: Give trial decisions a stable semantic identity and preserve legacy writer-shaped decisions through union. Estimate 6 hours. No existing receipt wording must change; merge output and trial state change, and any port surfaces consuming trials must be rechecked.
- **RECOMMENDATION** — FIX — A recorded consent or refusal must survive sync; identity repair does not select a new training rule.

### D39

- **PLAIN** — The app reopens the same declined offer after combining saved copies even though its receipt says the offer will stay quiet.
- **EVIDENCE** — src/app.jsx @ fe516c1:10132–10141,14071,14216; rebuild/engine/writers.cjs:2306–2317 and rebuild/engine/merge.cjs:715,860; rebuild/engine/test/defect-witnesses-6.cjs case D39 a stale replica restores a dismissed current-generation offer.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs a dismissed offer and its stale replica)
- **LAW** — V4-merge-preserves-offer-dismissal · engine · A stale replica cannot reopen the exact dismissed current-generation offer, while an unrelated offer remains available. Mutant: union-stale-offer-without-decision restores keyed union without dismissal suppression; drop-every-offer-on-merge checks unrelated-offer preservation.
- **FIX** — rebuild/engine/writers.cjs; rebuild/engine/merge.cjs / dismissAgentProposal / mergeState: Persist a dismissal fact keyed to the proposal and union that fact so the same offer stays closed. Estimate 6 hours. Existing decline prose can remain; new decision metadata and merge behavior require compatibility checks, including later re-earned offers with distinct identities.
- **RECOMMENDATION** — FIX — Preserve the already-made refusal and the existing promised quiet period; the witness does not show an unconsented second application.

### D40

- **PLAIN** — The app keeps different calorie entries depending on which saved copy is combined first; which entry should win is the owner's call.
- **EVIDENCE** — src/app.jsx @ fe516c1:13372,13881–13885,14081,14240; rebuild/engine/merge.cjs:16,525–529,725,884; rebuild/engine/test/defect-witnesses-6.cjs case D40 equal-richness daily calorie conflicts resolve differently by merge direction.
- **BAR** — lost fact
- **LIVE** — NOT APPLICABLE (needs two replicas with conflicting same-day entries)
- **LAW** — V4-daily-conflict-direction-independent · engine · Equal-authority same-day calorie conflicts produce the same daily record in either merge direction. Mutant: equal-richness-local-wins restores receiver-dependent selection.
- **FIX** — rebuild/engine/merge.cjs / _richer / MERGE_OBJ dailyLogs / mergeState: Implement the owner's chosen same-day authority and deterministic tie rule for daily entries while retaining enough conflict evidence to explain the selection. Estimate 6 hours. May change athlete-visible calorie values and downstream reader goldens; no receipt rewrite is inherently required, but conflict presentation depends on the ruling.
- **RECOMMENDATION** — OWNER RULING — Should unstamped equal-authority entries keep the receiving device's value or use one deterministic shared winner (recommended: one deterministic shared winner with the conflict retained)?

## Scalar per set load

### D41

- **PLAIN** — The app changes the main exercise weight while leaving its individual set weights behind, when both should advance together.
- **EVIDENCE** — src/app.jsx @ fe516c1:2617–2625,10123; rebuild/engine/writers.cjs:260–268,2293–2295; rebuild/engine/test/defect-witnesses-7.cjs case D41 queued debut and reset change scalar load without advancing the per-set vector.
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — NOT TRIGGERED
- **LAW** — V4-load-writes-advance-per-set-vector · progression · A completed debut adopts its queued set weights and a consented reset translates all set weights by the actual load change. Mutant: scalar-only-debut-write and scalar-only-reset-write independently leave the old per-set vector behind.
- **FIX** — rebuild/engine/writers.cjs / completeSession / applyAgentProposal: Copy newWSets when the queued debut lands and apply the reset load delta to the exercise's per-set vector. Estimate 4 hours. No frozen receipt string must change; subsequent prescriptions and progression reader goldens can change wherever the stale vector had been used.
- **RECOMMENDATION** — FIX — The queued vector and the existing load-delta rule already specify the intended weights; this completes two incomplete writes.

### D43

- **PLAIN** — The app saves the configured exercise weight instead of the weight the athlete entered when completing a previously set standard.
- **EVIDENCE** — src/app.jsx @ fe516c1:2586,2628–2651,2757; rebuild/engine/writers.cjs:230,271–299,400; rebuild/engine/test/defect-witnesses-7.cjs case D43 own/std completion stores the configured load instead of the entered load.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT TRIGGERED
- **LAW** — V4-owned-session-retains-entered-load · progression · The owned-standard completion branch records the athlete-entered load in the session ledger. Mutant: owned-early-return-records-configured-load restores recording from ex.w after the early return.
- **FIX** — rebuild/engine/writers.cjs / completeSession: Make each persisted session entry take its actual performed load from the validated input even on an early-return standard branch. Estimate 3 hours. Session truth and subsequent reader goldens change for affected entries; the OWNED wording need not change, but old records cannot be silently reconstructed without evidence.
- **RECOMMENDATION** — FIX — A performed-load field must preserve the athlete's input; no choice about training progression is needed.

## Undo half effects

### D42

- **PLAIN** — The app says a break was undone but keeps excluding weigh-ins because of that break, when undo should reverse both effects.
- **EVIDENCE** — src/app.jsx @ fe516c1:10015–10021,10252,3675; rebuild/engine/writers.cjs:2188–2194,2381–2388 and rebuild/engine/writers.cjs:423–450; rebuild/engine/test/defect-witnesses-7.cjs case D42 undoing a break leaves its scale seal active.
- **BAR** — untrue value or receipt the athlete sees
- **LIVE** — NOT APPLICABLE (needs a break approval and undo sequence to attribute the remaining seal)
- **LAW** — V4-break-undo-restores-scale-effect · engine · Undoing a break restores the prior scale seal and the subsequent weigh-in behavior as well as the plan. Mutant: undo-plan-without-scale-seal reverses only plan.brk while retaining the break's quarantine.
- **FIX** — rebuild/engine/writers.cjs / applyProposal / undoAdjustment: Record the break's prior scale-seal effect and reverse that effect on undo without overwriting a later independent seal. Estimate 5 hours. Touches the effect behind the existing MOVE UNDONE receipt, not its wording; later independent seals and downstream scale goldens need coverage.
- **RECOMMENDATION** — FIX — The athlete revoked the break and the receipt says reversed; its remaining scale effect violates that existing action.

## Analyst writer contract

### D45

- **PLAIN** — The app tells its analyst that a final-set effort rating blocks an increase even though the app awards that increase under its existing rule.
- **EVIDENCE** — src/app.jsx @ fe516c1:12544,2498–2500; rebuild/engine/writers.cjs:2463 and rebuild/engine/migrate.cjs:218–224; rebuild/engine/test/defect-witnesses-7.cjs case D45 analyst context says terminal zero blocks earns while the writer awards one.
- **BAR** — none: cosmetic / internal / performance
- **LIVE** — TRIGGERED
- **LAW** — V4-analyst-effort-rule-matches-writer · policy · Analyst context positively states opener-based earn eligibility and the terminal-set role without prohibiting the actual terminal-zero earn. Mutant: obsolete-terminal-zero-earn-prohibition reinstates the outdated instruction; blank-analyst-rule-text checks that silence cannot pass.
- **FIX** — rebuild/engine/writers.cjs / askContext: Describe the existing opener-based eligibility rule and terminal-set sizing role accurately in analyst context. Estimate 1 hours. Changes a frozen analyst prompt string but no athlete receipt directly; askContext is not a port-oracle reader surface, and no analyst-service output is asserted.
- **RECOMMENDATION** — FIX — PROGRESSION-1 already ruled the opener/terminal distinction; correcting stale explanatory text does not reopen that rule.

## SUMMARY TABLE

| id | theme | bar | live | recommendation | fix hours |
|---|---|---|---|---|---:|
| D1 | Target and load domain | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D2 | Target and load domain | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 2 |
| D3 | Receipt identity | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 4 |
| D4 | Receipt identity | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 4 |
| D5 | Target and load domain | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D6 | Target and load domain | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D7 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D8 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | OWNER RULING | 3 |
| D9 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D10 | Clock and as of | none: cosmetic / internal / performance | NOT TRIGGERED | OWNER RULING | 2 |
| D11 | Numeric values and units | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D12 | Numeric values and units | untrue value or receipt the athlete sees | TRIGGERED | FIX | 3 |
| D13 | Cache identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a write between two cached reads of the same object) | FIX | 4 |
| D14 | Numeric values and units | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D15 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D16 | Receipt truth | untrue value or receipt the athlete sees | TRIGGERED | OWNER RULING | 4 |
| D17 | Receipt truth | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D18 | Counts only guards | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 1 |
| D19 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D20 | Cache identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs an earlier cached read followed by a write to the same in-memory state) | FIX | 3 |
| D21 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D22 | State shape and failure | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 3 |
| D23 | State shape and failure | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D24 | Receipt truth | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D25 | Receipt truth | none: cosmetic / internal / performance | NOT TRIGGERED | OWNER RULING | 1 |
| D26 | Cache identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a cached Today read before a calendar rollover) | FIX | 3 |
| D27 | Receipt truth | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D28 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D29 | Evidence comparability | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D30 | Evidence comparability | untrue value or receipt the athlete sees | TRIGGERED | FIX | 3 |
| D31 | Evidence comparability | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 4 |
| D32 | Evidence comparability | untrue value or receipt the athlete sees | NOT TRIGGERED | OWNER RULING | 4 |
| D33 | Counts only guards | lost fact | NOT APPLICABLE (needs a proposed write that removes a set or replaces a read day) | FIX | 8 |
| D34 | Counts only guards | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 3 |
| D35 | State shape and failure | none: cosmetic / internal / performance | NOT APPLICABLE (needs a newer-schema import) | FIX | 2 |
| D36 | Receipt truth | untrue value or receipt the athlete sees | NOT APPLICABLE (needs the pre-v60 migration input) | FIX | 3 |
| D37 | Clock and as of | untrue value or receipt the athlete sees | NOT APPLICABLE (needs two replicas merged at different clocks) | OWNER RULING | 6 |
| D38 | Merge tie identity | lost fact; untrue value or receipt the athlete sees | NOT APPLICABLE (needs a merge of a written trial decision with another replica) | FIX | 6 |
| D39 | Merge tie identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a dismissed offer and its stale replica) | FIX | 6 |
| D40 | Merge tie identity | lost fact | NOT APPLICABLE (needs two replicas with conflicting same-day entries) | OWNER RULING | 6 |
| D41 | Scalar per set load | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 4 |
| D42 | Undo half effects | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a break approval and undo sequence to attribute the remaining seal) | FIX | 5 |
| D43 | Scalar per set load | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D44 | Receipt truth | untrue value or receipt the athlete sees | NOT APPLICABLE (needs accepting a one-set removal offer) | FIX | 3 |
| D45 | Analyst writer contract | none: cosmetic / internal / performance | TRIGGERED | FIX | 1 |

FIX: 38 · OWNER RULING: 7 · KEEP: 0 · DEFER-M4: 0. Total estimated fix work: 131 hours. Estimates may overlap when several defects share one function.
