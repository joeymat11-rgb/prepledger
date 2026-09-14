# Proposed correction behavior and owner choices

PM380 synthesis only. These are symbolic or fully invented cases, not executed tests, current personal data, new clinical rules or accepted prescriptions. The three questions below are for PM to present after review; no answer is assumed.

## Input and output contract

A means prepared 3bfed63febef002b8540d6ff3c56e19d08368711. Engine paths are under rebuild/engine/; Today under rebuild/m3/w7-preview/today/; coach under rebuild/coach/. The product candidate base for any later implementation must be named by PM; these anchors are audited A, not a claim of current deployment.

Keep two distinct purposes:

- calorieTarget (energy.cjs:684–782) is the cut-budget calculation: apparent maintenance, selected cut-rate convention, modeled floor and any valid already-approved calorie adjustment. Its existence is useful; it is not automatically the instruction for maintenance or gain.
- energyBalanceTarget (575–681) is the intended instruction selector. At present it overlays regime-derived changes onto the cut budget. Q1 would make it answer the accepted goal and return regime concerns separately. An equivalent arrangement is allowed; no forced merge of functions or new framework.
- Maintenance M is a modeled estimate including logging error, with its original interval and method/coverage. D is the cut-rate-derived energy range, F the modeled floor, J a valid consented cut adjustment, G the already selected monthly-gain-derived energy range. None is a measured tissue outcome.
- A saved finite target/goal decision must have genuine accepted provenance. A current formula input is not a remembered approval. A missing or unrecognized goal does not license a new assumed cut.
- All instruction consumers use one decision snapshot for the same athlete/state/date/accepted goal: direction, lo/hi/mid, availability, provenance, uncertainty, approved adjustment and reason must agree. No adapter computes a second diet rule. Diagnostic cut budget may still be shown explicitly as a calculation, never mislabeled as today's instruction.
- An unavailable base input cannot produce zero, NaN, a plausible copied target or a silently changed goal. A valid existing committed maintenance/break hold may remain visible with its date and “not re-estimated” qualification while new rate data are sealed. If no such target exists, say which input is unavailable. Preserve logging and the valid parts of the plan.
- Weekly intake comparisons must use the selected instruction's band and direction. A surplus case cannot retain the cut reader's “slower fat loss” explanation. Use observed intake versus target numbers; no tissue-gain prediction follows.
- Preserve existing rounding, dose coefficients, monthly units and approved adjustment semantics unless a row explicitly proposes a change. Do not reapply J after the chosen instruction already includes it, or carry a cut adjustment into a different goal.

## Q1 — Goal-consistent calories and reviewed volume changes

**Owner question:** Should Earned keep calorie advice tied to your chosen goal, flag scale-and-lift concerns for review, and stop generating set increases from the research curve?

**Recommendation: Yes.** This changes the deliberately adopted regime policy's authority, not its observed-data calculation. Regime may describe measured weight/performance patterns and flag review; it must not silently select maintenance/surplus or sanction added sets. Unknown regime means no regime-based suggestion, not deletion of a valid accepted target.

**Exact proposed behavior:**

1. Current valid active-break decision takes priority for its dated interval; retain its accepted finite maintenance target and existing scale seal. Then honor a valid committed gain or maintenance/exit decision. An explicit cut uses the cut budget. Missing goal with no valid accepted target is unavailable for a new prescription; do not treat phaseArc's historical cut fallthrough as user consent.
2. In a cut, retain the current cut calculation and any valid accepted small steer J. Weight/lift deterioration creates a review note with the observations, not a priced automatic transition. Existing recorded health/recovery warnings and existing blocks on deepening a cut remain. The note must not say that muscle loss was measured.
3. In maintenance, show M (or the still-valid committed hold while the rate window is sealed); stalled lifts do not select a surplus. In gain, use M + G only when that goal and its existing gain-rate convention are accepted and required inputs are usable. Monthly aggregation and “not yet measurable” remain. No new surplus size, gain cap, body-fat cutoff or personal optimality claim is introduced.
4. Do not let two competing goals or an unpriced accepted decision fall through to cut. Report the conflict/missing input for existing goal review; do not write a new goal/history record as a repair.
5. Volume still reports current programmed fractional sets by muscle/head and distinguishes growth from retention. Remove personal expectedGainPct, smallestDetectablePct and the SDES-selected addWeeklySets from the actionable proposal path. Show a non-actionable allocation-review explanation; no alternative numerical increment is invented.
6. Existing explicit programme edits and separately approved engine-issued proposals remain possible through their existing authorized route. DECISIONS:89 still forbids changing phase, calorie/protein floors, progression rules or consent policy through the conversational coach; goal approval in these cases uses the separately authorized product/owner route, never a new coach power. The coach still cannot accept arbitrary numerical replan arguments. If the current volume command can issue only the disputed numerical proposal, it returns the existing no-proposal response and explains that the allocation needs a reviewed change. It must not disguise a review note as an applied set change.
7. This choice does not freeze evidence-derived estimates forever, require a scan before training, or change record/RIR progression. It separates a changing estimate under an accepted goal from a new goal or training-dose decision.

**Before/after cases (symbolic):**

| Case | Present audited behavior or risk | Proposed Yes behavior and evidence to require |
| --- | --- | --- |
| C1 Cut, adequate inputs, free regime | Both readers may give cut numbers, with fat-only certainty. | Instruction is the cut budget using F/D/J once. Same band/reason on Today, food panel and coach; describe weight/lifts only. |
| C2 Cut, costing regime, then repeated calls | energyBalanceTarget can step toward maintenance; direct calorieTarget remains cut. | Cut instruction remains under accepted goal; a review note names falling performance/weight. No transition or persisted plan change from evaluations/reload alone. |
| C3 Maintenance, stalled lifts and weight | accretionBound can yield surplus while phaseArc says maintenance. | Maintenance stays M or the valid committed hold. Surplus needs an explicit reviewed goal decision; all instruction surfaces agree. |
| C4 Gain selected, regime unknown/free | direct cut reader can still be presented as today's target. | M + accepted G, monthly cap correctly labeled; regime does not turn it into a cut. No cut-only weekly explanation or stale J. |
| C5 Active dated break, new rate estimate sealed | Calorie readers can gate without distinguishing the accepted hold. | Display only a valid previously accepted finite maintenance hold, clearly dated and not re-estimated. Otherwise unavailable; seal and end/resume dates unchanged. |
| C6 No weight, no FFM, unknown goal or unpriced decision | Some paths return gated numerical estimates or nonfinite values. | Named unavailable fields, no directive calorie/protein figures derived from missing inputs; food/training facts can still be recorded. No inferred goal/profile. |
| C7 Six planned fractional sets and model-selected increment K | Personal gain and SDES fields produce a set-change proposal. | Six remains an observed programme count; no K or expected gain supplied by the curve. Allocation-review/no-proposal response cannot change sets. |
| C8 Eligible plan change offered through its authorized control, declined, then accepted twice/restarted | Consent receipt alone does not establish effect. | Decline changes no plan; accepted action matches exact issued terms and has one durable effect across retry/restart. Do not claim this until the existing client route is proved. |
| C9 Same goal/state, different consumer and read order | Two readers and cached helpers can return mixed purposes. | Equality of instruction direction/numbers/availability and purpose labels; no recursion introduced between decision selector, phaseArc, dietExit and phaseSupervisor. |

**Implementation scope:** energy.cjs calorieTarget/energyBalanceTarget/dietExit and related decision metadata; policy.cjs phaseArc/phaseProposal/activeAdjustment consumer use; volume.cjs volumeImbalance; Today today-model.cjs projectionOf and today-app.cjs nutrition block; engine today.cjs nowModel/marchingOrder/fiveLevers; coach tools.cjs today_plan/why_this_instruction/engineProposal and coach-text.cjs. Existing changes need explicit PM custody and the appropriate engine or screen review. Actual durable goal/plan command dependencies are an evidence dependency, not a new E source grant.

**No answer or No:** do not replace the adopted regime/dose policy. Existing certainty/copy corrections still stand. Mark the new behavior unresolved under current release controls; a rejected choice is not approval to ship unsupported personal gain claims.

## Q2 — Normal final-set effort

**Owner question:** Should normal final sets finish with one clean rep left, with all-out sets left to an explicit choice rather than scheduled automatically?

**Recommendation: Yes.** One rep is a chosen operating default within the already discussed 1–2 RIR approach, not the measured optimum. Preserve the actual performed result, even when it differs from the target.

**Exact proposed behavior:** In writers.cjs rirPlan:791–842, initialize a multi-set exercise as opener 2, middle sets 1, final set 1; a one-set exercise starts at 1. Apply existing hold, alarm and hot-opener adjustments in their existing order: hold makes opener at least 2; a positive alarm makes every target at least 1; the established hot-opener rule adds one to the opener. An observed short night alone does not reintroduce the retired upside restriction. Unknown RIR stays unknown. No automatic periodic failure schedule or new UI/persisted override is created by this contract. A user may record an actual zero-RIR set; any prescribed all-out exception would need an already supported explicit plan choice and must not bypass the current alarm/hold protections.

| Case | Current normal output | Proposed Yes output |
| --- | --- | --- |
| E1 Three sets, no modifiers | 2 / 1 / 0 | 2 / 1 / 1 |
| E2 One set, no modifiers | 0 | 1 |
| E3 One set, hold and hot-opener history | Existing opener modifiers apply. | 1 → hold at least 2 → hot opener 3. Do not drop an existing protection to force a 1–2 headline. |
| E4 Three sets with an alarm | Every zero floors to 1. | 2 / 1 / 1; keep alarm reason and validity of actual performance. |
| E5 Only recorded short sleep, or no current sleep | No direct RIR sleep penalty. | Same new normal target; existing downside/unknown rules remain. |
| E6 Athlete records final effort 0 or Unsure | Actual rating is the input to later progression. | Preserve that actual rating/tag; never replace it with the prescribed 1. Repaired record/noise calculations remain. |

**Static producer qualification:** D2 final RECONCILIATION.md's reviewer-only trace records engine-runtime → engine-capture:58–61 → source_json.target/layout:85–101 → gym display:281–284. E does not directly read engine-capture.cjs under this assignment. The change must be verified through that actual producer and stored capture, not only in the standalone function or its comment. Do not rewrite previously stored workout prescriptions when applying the new default to future captures.

**Implementation/evidence:** B owns writers.cjs plus the named engine package tests; C owns any required explanatory display changes under the single Today writer rule. D2/ER review the exact candidate independently, including E1–E6 and each retained exception. Future native producer/storage proof uses the designated authorized runner after B's separate capture capability issue is resolved. A pure synthetic helper result may be proved sooner but cannot stand in for that later evidence.

**No answer or No:** retain current executed effort behavior pending another explicit choice; remove contradictory certainty only where wording is otherwise settled. Do not quietly change the default to 2 RIR or invent how frequently failure occurs.

## Q3 — One EA convention and a defined break-advice window

**Owner question:** Should Earned use one consistent energy estimate for its warning, and suggest a diet break only from a recent pattern of low energy and missed food targets after checking sleep?

**Recommendation: Yes, using the explicit conservative rule below.** The calendar/coverage choices make the existing sustained-cluster intent operational. They are not research-derived clinical thresholds.

**EA behavior:** Keep the current structured-training EA value and its existing 25/20 conventions for both the main flag and that flag's existing 15/25 severity cost. The walking-inclusive alternative remains clearly labeled context and does not increase severity. Keep other existing recovery contributions and unknown-input handling; do not remove all recovery information or recalibrate the whole score. The sentinel remains a symptom-review note; EA alone does not prescribe a break, a calorie increase, a diagnosis or personal safety clearance.

**Break eligibility proposed for routine app-generated suggestions:**

1. Evaluate the seven completed local calendar dates [today−7, today), with date helpers rather than a fixed millisecond duration. Exclude today, future and older entries. Use existing per-date authoritative projections; do not merge conflicting raw records or treat insertion order as chronology.
2. Require at least four distinct finite reported-energy days in that window and their current upper-median definition ≤2; require at least four finite calorie days and at least three above the same currently accepted target band's high end. Use both of these observed conditions, rather than letting an EA/recovery score substitute for either. The card calls them low recorded energy and repeated intake above plan, not a proven diagnosis of hunger, nonadherence or muscle loss.
3. The accepted target band/goal must be applicable throughout the counted window; if this cannot be established from existing provenance, show the review need and make no routine break proposal. Do not compare old food entries to a newly changed target or add a new target-history store in this package.
4. Require three finite consecutive recorded nights ending yesterday, with mean ≥7 hours and latest ≥6.5 hours, using the current thresholds. Missing, stale, partial or nonfinite sleep is “not checked,” not adequate sleep. Existing nonrestrictive cleanAtDate/sleepMean3At behavior for workout progression is unchanged.
5. Keep the existing estimated-food share <0.5 check, now over the same calorie days. Missing estimate tags retain their existing semantics; no fabricated “verified food” classification. The evidence record names what is and is not known.
6. Suggest only in a known current cut, with a finite accepted maintenance price available for the proposed break and no active or future approved break. All counted dates must follow the end of the last completed break; this avoids the present recent-status path reusing the previous break's week. Missing date/target provenance means no new automatic suggestion.
7. Offer the existing one-week maintenance break as a proposal, with approve/decline, exact start/end, actual observed reasons and existing scale seal. A manual request for a break or a reported health concern can still reach the existing coach/human-review path with incomplete logs; the app must not demand seven days of logging before a person can seek help. No new clinical questions, symptom thresholds or emergency policy.
8. Today theOneFix uses this same eligibility result and purpose. A long cut or slow scale trend alone becomes an observation/review prompt, never “a break has earned its place.” Preserve higher-priority logging and recorded safety messages; no contradictory “all covered” statement when evidence is missing.

| Case | Audited risk | Proposed Yes behavior |
| --- | --- | --- |
| B1 Structured EA 22, alternative EA 18; other inputs unchanged | Flag gates on structured value, cost uses alternative under 20. | Existing lower EA cost from 22; changing only walking cannot increase this cost. No personal safety verdict. |
| B2 Structured EA 19 | Existing higher cost can apply. | Keep higher cost by the declared structured convention, plus contextual symptom review. EA alone issues no break. |
| B3 Old/reordered/future food or energy entries | Last seven entries can be treated as recent. | Only named completed calendar dates count; order changes do not change the result. |
| B4 Four recent low-energy days and three high-calorie days, one sleep night | Unknown sleep can currently satisfy sleepOK. | Sleep not checked; no routine break proposal. Logging and manual review remain available. |
| B5 Four qualifying energy days, four food days including three above band, adequate known sleep, stable cut, valid maintenance, no recent break overlap | Existing score/entry-order routes can obscure the actual cause. | One reviewable, priced one-week break proposal with these observations; zero plan mutation before consent. |
| B6 Long cut, stalled scale, no qualifying reported pattern | Separate Today duration rule can recommend a break. | State the observations and invite review; no break-specific instruction. |
| B7 Energy and food qualify, but target changed or prior break overlaps window | Old conditions can be compared to the new plan or reused. | No routine suggestion until a wholly applicable window exists; no new storage fabricated. |
| B8 Maintenance/gain, missing FFM/maintenance, or future break already approved | A generic cluster could be misapplied or unpriced. | No new cut-break proposal; honor the current accepted goal, keep unavailable inputs explicit. |

**Implementation/evidence:** B sleep.cjs recoveryIndex and policy.cjs phaseProposal/phaseSupervisor; engine today.cjs theOneFix; C coach tools.cjs and Today renderers consume a single qualified result. Keep energyAvailability's current structured main band. Tests must separate altered EA cost from other factors, cover DST/calendar/date order, incomplete/stale sleep, each coverage edge, cut/maintenance/gain, repeat requests, dates/seal and target provenance. Durable acceptance evidence follows the existing client route and is distinct from predicate tests.

**No answer or No:** existing “sustained cluster,” no duration-only trigger, date-order honesty and non-clearance wording remain binding; the proposed seven-day/coverage/sleep/severity policy is not implemented. PM may commission neutral review wording and settled fixes, but cannot declare an unspecified replacement classifier complete.

## Decision independence

Q1, Q2 and Q3 can be answered separately. With Q1 No and Q3 Yes, Q3's food comparison uses the current accepted instruction/provenance and abstains if its stability for the window cannot be proved; it must not silently adopt Q1's goal switch. With Q1 Yes and Q3 No, goal-consistent instructions and volume-review behavior can proceed while existing break-policy issues remain held. Q2 changes only future effort prescriptions and their explanation. None of the three approvals is permission to execute private gates, import data, deploy, waive review or change unrelated coefficients.
