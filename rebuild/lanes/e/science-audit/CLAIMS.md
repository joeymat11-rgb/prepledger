# Science audit — claims, static traces and proposed dispositions

Owner356 • E author • completed 2026-09-13 America/New_York / 2026-09-14 UTC.
**Author findings for PM and subsequent independent D2 reconciliation. No policy acceptance, product change, runtime result, deployment assertion or personalized prescription.**

## Scope and reference key

- A = PREPARED 3bfed63febef002b8540d6ff3c56e19d08368711.
- M = INTEGRATED LAUNCH comparison 100820aa47a4f8729642033499eaec0f0ee282e1; this label is not evidence of live deployment.
- D = prior documents/rulings at 34fce6323d78adb7363a7e05f81dc92e27eb9017.
- Authority = 45eb03a02e0dc268178f87927a8bb56fe0e8730c, rebuild/lanes/astra/SCIENCE-AUDIT-GO.md and SCIENCE-AUDIT-INPUTS.json.
- Unless expanded, engine paths mean rebuild/engine/, Today paths mean rebuild/m3/w7-preview/today/, coach paths mean rebuild/coach/. References are exact pinned file:line locations; ranges describe the static excerpts inspected.
- All 72 authorized input identities were verified. Separately granted A rebuild/m3/w7-preview/browser-engine.cjs and rebuild/m4/workout/engine-runtime.cjs were also verified/read; the original inventory remains unchanged. INPUT-CUSTODY.json separates identity, requested excerpts and actual selected inspection. The full manifest is not a full-file review claim.
- A and M have identical energy.cjs and constants.cjs; consequently findings in those exact files apply to both snapshots. Relevant changed progression/sleep/volume/policy/Today excerpts were compared selectively. This is not an assertion that every line of all 15 engines was reviewed.
- Static consumer means a named call/export/data path is present. No app, test, fixture, personal history or imported product module was executed. Native capture dependencies outside the grant were not loaded. Actual UI activation and effects on Joe/Dad remain unverified.

Source records R01–R28, publication dates, access levels, contrary findings and material correction/supplement limits are in SOURCES.md. “Keep” refers to the existing concept within its documented scope; it does not certify an individual dose. “Change-proposed” is a recommendation to PM, not permission to implement it.

## All twelve questions

| ID | Primary disposition | Main conclusion |
| --- | --- | --- |
| S01 | change-proposed | Preserve matched-window estimates; remove measurement certainty, reconcile target consumers, and route existing arithmetic defects. |
| S02 | change-proposed | Preserve contextual EA/symptom review; remove safety/partition guarantees and reconcile residual severity rules. |
| S03 | clarify | Keep the chosen 2.5 g/kg FFM starting point provisional; correct source authorship and personal-floor claims. |
| S04 | clarify | Monthly units are already corrected; gain caps and surplus selection remain choices, not measured biology. |
| S05 | change-proposed | Retain fractional accounting; do not turn group SDES into a compulsory individual set increase. |
| S06 | investigate | Keep uncertainty-aware progression; the exact algorithm and record error rate need their own justification. |
| S07 | change-proposed | Keep missing-sleep honesty and downside protection; correct overconfident sleep/readiness claims. |
| S08 | change-proposed | Strength, scale and one body-composition anchor do not identify personal tissue changes or their cause. |
| S09 | clarify | Breaks remain optional behavior tools; reconcile trigger/copy conflicts and update the reverse-dieting evidence statement. |
| S10 | investigate | Establish relevant applicability facts at use; do not infer either user's current profile. |
| S11 | investigate | Preserve explicit consent; trace what is recommended separately from what an accepted operation changes. |
| S12 | change-proposed | Give each consequential claim one current ruling and a source-to-consumer verification record. |

## S01 — Maintenance, energy density, windows, uncertainty and cold start

**Current rule and prior ruling.** A/M energy.cjs:225–488 estimates rate from dated weights and observedTDEE from food plus modeled weight-change energy. The matched-calendar path is a material improvement. D NUTRITION-TDEE-VERDICT.md:75–78 and 130–150 require honest uncertainty; its A2 at 68–73 explicitly calls maintenance apparent and inclusive of logging error. A energy.cjs:1018–1051 implements empirical forecast-error weighting in tdeeLearned; older comments about imposed precision do not describe all current code.

**Unresolved mismatch.** Energy.cjs:760–781 still describes maintenance as measured, while 1018–1051 contains 3,500-based explanatory wording and constants.cjs/energyDensity at 984–1000 use 3,800 until another modeled partition is selected. The correct repair is to agree the intended model and make arithmetic, units and explanation consistent, not blindly substitute either constant. A fixed density cannot establish individual expenditure ([R09 Hall](https://pubmed.ncbi.nlm.nih.gov/17848938/)). Food recording, tissue/water changes, step-cost assumptions and conditional rate uncertainty remain separate error sources. The printed interval is not demonstrated total personal uncertainty.

**Static consequential paths.** Today today-app.cjs:825 and coach tools.cjs:415–443 / 478–486 read calorieTarget/observedTDEE. Today today-model.cjs:92–101 simultaneously returns calorieTarget and nowModel; engine today.cjs:483–555 obtains energyBalanceTarget. Energy.cjs:575–680 can change that latter recommendation to maintenance/surplus based on regime, while 684 onward supplies the direct calorieTarget. Browser-engine.cjs composes the public factories without a replacement nutrition reader; today-engine.cjs wraps that factory. This is a concrete two-reader consistency risk, not an executed demonstration that a particular screen showed conflicting numbers.

**Cold start and known defects.** D DECISIONS:124/142, A workout athlete-state.cjs:139–199 and Today today-app.cjs:791–891 must be read together. H3 no longer means “constructor always throws”: anchor scaffolding exists, lean mass remains absent rather than invented, and the display checks unavailable/nonfinite targets. Protein still lacks its own complete finite-input contract. Do not restore an invented FFM or claim this audit reproduced the old exception. D11 (energy.cjs around 449) and D15 (805–810) remain known arithmetic concerns in identical A/M energy bytes: reversed gaining-rate endpoints and food-row rather than calendar duration. They already have entries in AUDIT-REGISTER; no duplicate discovery credit.

**Test/review disposition.** A test/defect-witnesses-2.cjs:21–37 and 76–95 document frozen defective behavior; they are not desired-output proofs and were not run. Investigate step-window correspondence (energy.cjs around 455) and whether adaptationSignal's 21-day sample spacing (1056–1127) actually gives non-overlapping fitted windows; the source does not prove it. Keep matched periods and conservative unknowns. PM should route one canonical recommendation/uncertainty contract plus the existing arithmetic repairs. No corrected calorie number is proposed here.

## S02 — Deficit, loss rate, calorie floor and male EA

**What is already settled.** D NUTRITION-TDEE-VERDICT.md:59–73, 96–114 treats deficit/rate as graded choices and EA as a contextual signal, not clearance. A/M cutRateBand at energy.cjs:877 onward and constants.cjs retain a body-mass-relative corridor; the later 0.70%/week upper-default framing must not be replaced by an old absolute-pound rule. Garthe supports caution with faster loss, but its small athlete study does not prove one universal optimum ([R03](https://doi.org/10.1123/ijsnem.21.2.97)). Murphy's 500 kcal model crossing does not establish an individual muscle-preservation boundary ([R04](https://onlinelibrary.wiley.com/doi/10.1111/sms.14075)).

**Residual claims.** CalorieFloor at energy.cjs:493–504 openly labels 25 a convention, which is good. EnergyAvailability at 824 nevertheless emits ADEQUATE above its selected band; 844 misattributes a recalculation to an Espinar experiment. PhaseSupervisor at policy.cjs:614–628 still contains “over 40%” muscle-loss and sparing-line language. Its current kind routes EA to leaSentinel; phaseProposal at 641–648 replaces the old automatic-break rationale with a symptom-check note. Therefore the old supervisor sentence is a residual helper/export claim with uncertain direct display reach, not proof that the current EA proposal automatically prescribes a break.

**Science and convention.** The IOC rejects universal male safety thresholds ([R06](https://doi.org/10.1136/bjsports-2023-106994)); its corrected figure/supplement remain unverified here. The Espinar/Taguchi chain concerns methods and reinterpretation, not measured physiological equivalence ([R07](https://www.mdpi.com/2072-6643/18/3/379), [R08](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.885631/full)). Neither “structured only” nor “all deliberate walking” may silently change definition while retaining the same cutoff. One number or symptom is not a diagnosis.

**Static reach and severity.** Coach tools.cjs:489–490 carries calorieFloor. Policy phaseProposal is called by coach tools.cjs:784–786. RecoveryIndex at sleep.cjs:270–274 gates the EA flag on hi (the structured estimate) but then uses lo (which can include walking) to select severity. That severity contributes to WATCH/LOW and can feed liftCall at sleep.cjs:136–139 and phaseProposal at policy.cjs:661. This is a specific residual mixing of conventions to review; it is not the already-fixed claim that the main EA band always uses all walking. Fixed 300 kcal/session, four-session fallback, rounded floor and partition fractions remain model choices, not measurements.

**Disposition/test boundary.** Keep food-first contextual advice, the sentinel and human review route. Propose replacing personal safety/partition claims and reconciling the severity convention. D15's static witness concerns the input denominator, not validation of EA physiology. No clinical threshold, personal stop rule or new mandatory questionnaire is authorized by this report.

## S03 — Protein basis, restriction and age

**Current rule.** A/M energy.cjs:117–140 computes 2.5 g/kg modeled FFM, rounds to 5 g and carries a band from FFM uncertainty. The old 12.2% switch is already gone. D NUTRITION-TDEE-VERDICT.md:89–94 and 130–138 explicitly approve a provisional value with an FFM interval.

**Evidence/applicability.** Final R01 authors are Refalo, Trexler and Helms; their energy-restriction meta-regression supports a population starting point with substantial variation, not an established personal minimum ([R01](https://scholars.duke.edu/publication/1665427)). The unrestricted-training body-mass literature answers a different question; its breakpoint is uncertain, not a universal ceiling ([R26](https://pubmed.ncbi.nlm.nih.gov/28698222/)). Neither review supplies a one-number age correction for Dad. Current goal, credible body-composition basis, restriction/training context, food practicality and relevant clinical constraints matter at use.

**Reach.** The target and “floor/measured lean mass/over is never a miss” explanation flow through coach tools.cjs:420–426 and 483, coach-text.cjs:48–64, and Today today-app.cjs:825–829. Policy.cjs:459 retains authorship TBC and a lean-retention-floor claim. The model's FFM-derived band captures only one uncertainty source. The explanation about rest days having a higher requirement was not directly validated in the reviewed outcome evidence; flag it as unverified, not automatically false.

**Disposition/test boundary.** Clarify the chosen target and source; do not silently change the dose. Keep unknown FFM unknown. The existing H3 unavailable display and D25 first-protein-day correction are separate engineering issues; A test/defect-witnesses-3.cjs:67 onward preserves the old D25 witness, not a nutritional adequacy experiment. No rest-day escalation or personal age/health adjustment is approved here.

## S04 — Surplus, gain-rate units and other macros

**Current rule.** A/M constants.cjs:203–218 converts a monthly 0.25–0.5% body-mass gain band to weekly units, and uses a chosen monthly lean-gain cap. This audit does **not** reopen the already-corrected weekly/monthly defect. Energy.cjs:606–616 uses a surplus when regime reads accretionBound; partitionRates and partitionPrior at 929–1000 attach seemingly precise body-composition projections.

**Evidence.** R20's small surplus study gives reason to avoid unnecessary rapid gain, while also reporting a bench-strength result favoring the larger surplus. It neither proves surplus is useless nor establishes a universal personal muscle ceiling ([R20](https://link.springer.com/article/10.1186/s40798-023-00651-y)). A precise cap may be a conservative planning choice; “MPS ceiling” or measured partition language overstates the evidence.

**Reach and limits.** EnergyBalanceTarget feeds nowModel/marchingOrder; the direct calorieTarget route in S01 remains separate. Today today-app.cjs:826–829 explicitly declines to prescribe fat/carbohydrate numbers, which is honest. An engine constant or comment about bulk protein is not proof of a live fat/carbohydrate prescription. No macro plan for either person was derived.

**Disposition/test boundary.** Keep corrected units, preference-sensitive gradual adjustment and absent unsupported macro numbers. Clarify caps as choices and investigate the trigger that treats failed progression as a need for surplus (S08). No body-composition trial or consumer parity test was executed; static code cannot establish benefit of these personal caps.

## S05 — Training dose, fractional sets and retention/growth

**Current rule and reach.** A volume.cjs:65 onward counts the current programmed week; the fixed-July-week D28 mechanism is already repaired relative to M. At 100–145, hypGain uses a square-root curve, then volumeImbalance searches +1 through +12 sets until its modeled gain clears 2.05%. Actionability also requires a confirmed free regime. Coach tools.cjs:769–777 can carry addWeeklySets, expectedGainPct and smallestDetectablePct in an engine-owned proposal. Thus this is more than inert commentary, though actual use was not executed.

**What the evidence supports.** R02 supports fractional accounting as a useful group convention and diminishing average returns. Its SDES is a group interpretive quantity from external controls; it does not prove an individual must add enough sets to clear that percentage ([R02](https://link.springer.com/article/10.1007/s40279-025-02344-w)). The code converts both a group curve and detectability statistic into a precise personal intervention/expected gain. That extra inference needs justification independent of agreement with the source's average slope.

**Incorrect supporting explanation.** Volume.cjs:144 calls Roth's intake a 30 kcal/kg deficit, omits the protein FFM basis, and interprets nonsignificance as identical preservation. R05 tested 12 versus 20 sets, not a universal low-volume retention floor ([R05](https://onlinelibrary.wiley.com/doi/10.1111/sms.14237)). Bickel's age-dependent reduced-dose experiment is not a trained-dieter guarantee ([R19](https://doi.org/10.1249/MSS.0b013e318207c15d)). Do not reverse this into the equally unsupported claim that every low-volume muscle urgently needs more work.

**Ruling reconciliation.** The prior retention/growth distinction remains valuable. However, current growthOK is free + confirmed, not a strict “outside deficit” test: free itself can mean falling scale weight with stable/rising lifts. The receipt says this sanctions growth. Its causal/body-composition inference is addressed in S08. The audit does not claim all deficits trigger extra sets or that the current code ignores its gate.

**Disposition/test boundary.** Propose removing the compulsory SDES-derived minimum/precision from recommendations pending a reviewed policy; keep fractional enumeration and uncertainty. A test/volume-projection.cjs and volume-reference.cjs compare engine behavior to a reference; they do not validate a hypertrophy prediction. They were read statically only. A future authorized repair should test the approved decision behavior, not merely reproduce this formula.

## S06 — Progression, RIR, failure and records

**Current rule.** A progression.cjs:19 onward maps terminal RIR to chosen +1/+2/+3 rep changes; unknown is treated conservatively. TargetsFor around 270 and the prepared native-anchor changes use recorded performance/eligible dates. RepsLost at 423 uses an Epley-derived transformation to size load windows. TypicalError at 564 and beatsNoise at 604 distinguish repeatability from a new record.

**Evidence and existing correction.** R12's RPE trial is compatible with benefit but imprecise, not decisive superiority; R15 documents substantial RIR prediction error ([R12](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2018.00247/full), [R15](https://pubmed.ncbi.nlm.nih.gov/34542869/)). Current ACSM guidance does not require failure or validate this exact mapping ([R11](https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/)). D PROGRESSION-ENGINE-AUDIT.md already corrects old Nuzzo/Epley and effect-size claims. Do not revive those as evidence for the algorithm.

**Effort-default mismatch.** Supplemental runtime exposes rirPlan. Its actual body at A writers.cjs:791–841 initializes the last set to 0 RIR; alarm handling can raise it, while hold/hot-opener handling affects the opener. The adjacent 815–817 comment instead describes 1–2 RIR with only occasional all-out last sets. No general occasional-set selector appears in that body. This is a concrete default-versus-stated-policy inconsistency for PM to reconcile, not proof of a particular user's executed prescription. It is not justified simply by needing terminal RIR as an instrument.

**Noise is not fully settled.** A/M beatsNoise already includes the two-session square-root-of-two factor; “missing √2” would be a false new finding. The remaining √number-of-sets assumption requires covariance justification, and sequential comparisons against selected records may have a different false-positive rate. Mitter is a useful limited bench-test benchmark, not validation of this whole classifier ([R14](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0268074)). The source's test design also differs from repeated absolute-load work sets.

**User path and reach limit.** Supplemental A workout engine-runtime.cjs:28–59 composes the named factories and exposes genSession, rirPlan, dayWeather and cleanAtDate through thin forwarders; it does not expose liftCall or adaptive writers. Engine today.cjs:66–124 calls targetsFor from genSession. Coach local-world.mjs:59/126 constructs this runtime; Today gym-model.mjs:136 calls engine.genSession for previous-performance context. The citation at gym-model:169 is a comment, not that call site. Gym-model:27–75 displays capture values and explicitly offers unknown RIR; coach tools.cjs:505 onward reads that layer. These are actual static bindings, but do not prove the full durable prescription/application route or every legacy reader's native reach. Remaining capture dependencies were outside the grant; no native gate or personal record calculation was run.

**Disposition.** Preserve unknowns, real performance precedence, downside-only protection and corrected record arithmetic. Treat exact rep mappings/load windows as chosen heuristics, with potential future calibration rather than scientific certainty. PM should reconcile the applicable capture route before changing a gym prescription. Inspected defect witnesses and progression audit are static history, not current whole-gate results.

## S07 — Sleep, recovery, downside protection and deload

**Keep the repaired behavior.** A sleep.cjs:1025–1063 and the prepared A/M differences distinguish missing/stale observations from a measured short night. CleanAtDate/sleepMean3At returning nonrestrictive on unknown is not a claim that sleep was good. A test/b1b2-sleep-target-cells.cjs:75–128 contains relevant missing-target/UNKNOWN assertions; they were not executed. D8/D21 and absent-target improvements should not be reopened by relying on old source comments.

**Residual inference.** LiftCall's receipt at sleep.cjs:66–80 compares acute strength loss to personal spread as if the categories were interchangeable; writers.cjs:795–801 repeats that reasoning beside the exposed rirPlan. R16 reports separate, differently supported strength and strength-endurance outcomes; neither justifies dismissing all multi-set sleep effects or automatically cutting a particular user's load ([R16](https://d-nb.info/126507996X/34)). Today.cjs:302–305 tells the user a full night keeps loss in fat, overgeneralizing a tiny controlled dieting experiment ([R17](https://pubmed.ncbi.nlm.nih.gov/20921542/)). The 6.5-hour/latest and 7-hour/three-night boundaries are operational defaults, not thresholds derived exactly from that meta-analysis.

**The score still has consequences.** RecoveryIndex at sleep.cjs:220–287 openly acknowledges arbitrary costs. Despite improved UNKNOWN handling, the remaining known costs can classify WATCH/LOW. LiftCall:126–139 can then use that classification with stalls/holds to prescribe a reset; policy.cjs:661 can use it in break eligibility. Removing the score headline does not make its downstream thresholds scientifically validated. The EA severity interaction is in S02.

**Reach and limitations.** TheOneFix recovery/sleep text flows through coach tools.cjs:472–477 and Today nowModel.move around today.cjs:580. The gym capture boundary in S06 remains unverified. The planned cessation experiment in R18 is not a direct test of this reactive reset. No conclusion here says sleep does not matter or that a person should train through pain.

**Disposition.** Propose correcting the universal fat-preservation/“rounding error” implication, and require PM to justify any readiness threshold that changes a prescription. Keep downside protection and missing-input honesty. No new sleep gate, target or mandatory deload is approved.

## S08 — Strength, body composition and personal estimates

**Current rule.** A/M energy.cjs:185–223 classifies free/costing/accretionBound from performance and weight trends, with repeated confirmation. EnergyBalanceTarget:606–680 can recommend surplus, reduced deficit or continued cutting from those states. VolumeImbalance then uses the result to sanction extra sets. The repeated classification is still built from these same kinds of observations; repetition alone does not identify tissue or cause.

**Evidence/inference.** R04 shows why strength change cannot establish muscle retention ([R04](https://onlinelibrary.wiley.com/doi/10.1111/sms.14075)). Falling weight and stable lifts do not identify fat-only loss; stalled lifts may reflect several causes and do not by themselves establish that food or volume is limiting. The scientifically defensible statement describes the observed weights/performance, then labels any causal hypothesis.

**Other modeled certainty.** Energy.cjs:83–113 keeps drip at zero and prints uncertainty, which is preferable to assumed muscle accrual. Its anchorTighten output nevertheless labels waist-derived trajectory “measured.” A one-scan condition at partitionPrior:953 onward sets identified and supports energyDensity's measured-partition description at 999. A level at one time cannot measure the composition of change. R27 distinguishes precision and measurement conditions; it does not validate the fixed ±1/±3.5-point interval as calibrated for either user ([R27](https://durham-repository.worktribe.com/output/1256019/short-term-precision-error-of-body-composition-assessment-methods-in-resistance-trained-male-athletes)).

**Reach.** Regime affects nowModel/marchingOrder and the coach's volume proposal path. AnchorTighten is an exported modeled display helper; no direct consumer was located in the granted Today/coach/workout sources, so its current user reach is unverified. Do not assign equal delivery priority to those two cases. CalorieTarget/energyBalanceTarget divergence is S01.

**Disposition/test boundary.** Propose replacing tissue/causal certainty and seeking a reviewed trigger before those inferences change recommendations. Keep zero unmeasured drip, uncertainty bands identified as model assumptions, and observed trend descriptions. No personal history, scan, waist series or biological validation was accessed; the report cannot declare either user's tissue change.

## S09 — Refeeds, diet breaks and reverse dieting

**Settled intent and current copy.** D NUTRITION-TDEE-VERDICT.md:80–87 and 101–108 keep dated history, distinguish replenishment from metabolic recovery, and make breaks a preference/behavior decision. A policy.cjs:641–672 has a contextual sentinel and a separate break proposer; it does not universally turn low EA into a maintenance break. However, Today.cjs:316–321 still tells an in-cut user that a long stalled cut has earned a break. D27's maintenance/phase repair is already present; the remaining duration-as-sufficiency wording is a distinct issue.

**Trigger needs contract review.** Policy.cjs:650–665 describes a sustained cluster but reads up to seven energy/food entries; the food rows are not sorted or bounded to a recent calendar window there. SleepMean3At at sleep.cjs:1052–1063 is a boolean and intentionally returns true when evidence is absent/incomplete. It must not be misreported as a numeric-mean bug, nor automatically interpreted as confirmed adequate sleep for break eligibility. PM should reconcile “sustained/after sleep and logging checked” with these actual predicates. No example state was executed.

**Evidence update.** Break trials support possible appetite benefits, without established extra muscle preservation or precise metabolic repair timing ([R21](https://pubmed.ncbi.nlm.nih.gov/33587549/), [R23](https://academic.oup.com/nutritionreviews/article-abstract/83/1/59/7513121)). Campbell's disputed result should not be described as completely overturned: the Peos comment retains a dry-FFM difference and disputes the broader FFM/RMR inference ([R24](https://mdpi-res.com/d_attachment/jfmk/jfmk-05-00085/article_deploy/jfmk-05-00085-v2.pdf?version=1606199050)). A 2025 preliminary randomized reverse-dieting abstract exists, so energy.cjs dietExit's absolute “no RCT” wording is stale; it does not prove a reverse-dieting advantage ([R25](https://www.tandfonline.com/doi/pdf/10.1080/15502783.2025.2550185)).

**Reach/disposition.** TheOneFix is exposed through coach explanation; phaseProposal through coach replan; dietExit's full current consumer reach was not proven. Clarify benefits and evidence limits, reconcile trigger logic under existing rulings, and preserve consent plus dated history. No fixed weekly refeed or clock-driven automatic break should be reinstated from an old research note. Static D27/other defect witnesses are not physiological benefit tests.

## S10 — Applicability to Joe and Dad

**What is known here.** These are two intended users. Historical GOALS/research notes are not current clinical or training profiles. No age, current weight/body fat, injury, diagnosis, medication, nutritional restriction, goal or training status was inferred from the names or relationship, and no private records were read.

**Implementation facts.** A workout athlete-state.cjs:66 requires label/split/exercises/priority muscles; 139–199 avoids fabricating FFM. Today setup-model.mjs:1–125 explicitly labels starter parameters as chosen rather than sourced and limits available split forms. Starter-week.mjs:1–60 uses generic volume choices. Meanwhile engine today.cjs:254–260 evaluates training against four sessions and energy.cjs:497 uses a four-session fallback. Those deserve consistency review for a configured schedule; they are not evidence that either actual user has the wrong schedule.

**Applicable evidence and missing facts.** Healthy-adult guidance allows several effective schedules ([R11](https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/)); reduced-dose retention varies by studied age/context ([R19](https://doi.org/10.1249/MSS.0b013e318207c15d)). To make a personal recommendation, establish the person's current goal, recent training/effort competence and feasible schedule; body-mass/FFM provenance when the formula needs it; and any reported symptoms, constraints or clinical advice relevant to that recommendation. Unknown health or missing measurements cannot be replaced by a family-role assumption. This is a use-time applicability requirement, not authorization for broad health-data collection.

**Disposition/test boundary.** Investigate only missing facts needed by an actual feature and reuse existing onboarding/availability paths. Keep user records separate and no inherited body-composition anchor. The public setup/constructor code and prototype routes do not establish current deployment or personal data completeness. No new onboarding questionnaire, personalized training plan or clinical screening score is approved.

## S11 — Consent and the coach's actual words

**Static positive boundary.** Coach tools.cjs:736–908 obtains an engine proposal, rejects caller-supplied numerical plan changes, and requires an issued proposal ID plus explicit confirmation/consent handling. Athlete-state.cjs:42–50 uses proposal-level autonomy. Coach-text.cjs:1–76 is a deterministic prototype template, not evidence of a deployed free-form AI coach. Wave1-tools.cjs:270–325 includes the older tools in its dispatch, so they cannot all be dismissed as a dead catalogue.

**Why this still needs investigation.** Provenance proves where a value came from, not that its science is correct. Tools.cjs:472–490 passes consequential explanations unchanged, including the walking/sleep/protein claims identified above. The volume proposal carries expectedGainPct. Read-only recommendations can also differ between energyBalanceTarget and calorieTarget without any persisted mutation. A good consent boundary does not settle which recommendation is justified.

**Mutation limit.** Returning a confirmation or recording consent is not evidence that the intended plan change was applied exactly once through the current durable client. The granted sources do not cover every command/capture/application dependency. No tool, database or proposal was invoked in this audit. Existing requirements that a proposal do what its text promises therefore remain unverified here, not disproved.

**Disposition/test boundary.** Preserve explicit consent and engine provenance. PM should route exact proposal-to-operation and recommendation-to-display cases to authorized existing engineering/review work, starting with the disputed claims; verify the user sees the same current approved rule across surfaces. No new autonomy or messaging authority is granted.

## S12 — Source-to-rule traceability and existing rulings

**The planning gap.** The repository has an extensive corpus and later rulings, but some corrected interpretations coexist with old executable explanations or alternate consumers. The audit register proves that many defects were already found; it does not establish whether the current prepared candidate, integrated comparison or phone has a particular repair. A source citation and an engine/reference parity check are also different kinds of evidence.

| Concern | Pinned evidence and present interpretation |
| --- | --- |
| Weekly versus monthly gain | A=M constants.cjs:203–208 already converts monthly values. Keep the correction. |
| Unmeasured lean-mass drip | A=M constants.cjs retains zero. Keep; do not restore assumed gains. |
| 12.2% protein switch | A=M energy.cjs:117–140 already removed it. Source/floor wording still needs clarification. |
| Record √2 factor | A/M progression beatsNoise has the two-session factor. Do not relabel the retired omission as current. |
| Stale/missing sleep and absent target | Prepared A sleep changes and test/b1b2-sleep-target-cells.cjs contain explicit unknown handling. Preserve; no new runtime result claimed. |
| Fixed July volume week (D28) | A volume.cjs counts current week; M differs. Do not report as unfixed in A. |
| First missed protein day (D25), horizon grading (D16), wrong-phase break copy (D27) | Prepared A has corresponding guard/horizon/phase changes in Today/policy. Their old witnesses describe earlier behavior. Whole-gate execution is outside scope. |
| Gaining interval (D11), sparse food/session denominator (D15) | Known register items and unchanged A/M energy mechanisms. Route existing work; do not duplicate planning. |
| H3 clean initialization | Old “both readers throw” prose is stale as a blanket claim. D124/142 plus current constructor/display show scaffold + explicit unavailable inputs, not complete personal nutrition initialization. |
| Native replay, as-of record history, actual deployment | Public static snippets do not settle these. No protected history/gate was executed and no current phone state is known. |

**Proposed review record.** For each consequential recommendation, bind the current ruling to the source/population/outcome, the chosen defaults and unknowns, one canonical producer, every user-facing consumer, and the authorized behavior check. Put exact source corrections and the reason a group estimate becomes an operational choice beside the rule. Use the existing PM/engineering/review lanes; another builder would not resolve these scientific or ownership questions.

**Test boundary.** Defect-witnesses-2.cjs:3–5 explicitly says it preserves frozen defects. Volume-reference.cjs uses a reference comparison if run. Those are useful engineering artifacts, but neither a green result nor source parity establishes scientific truth. No product tests were run or edited. Proposed checks must be authorized and target the agreed behavior, rather than lowering a gate to match the model.

## Eight unresolved review items for PM

These are explicit residual items, not eight accepted product changes. All twelve topics were covered; zero personal prescriptions or new policy rules were approved.

| Item | Existing route | Concrete next decision or evidence |
| --- | --- | --- |
| U1 | PM → current engineering/review | Bind calorieTarget and energyBalanceTarget to the intended approved goal; reconcile estimate wording/density units; use existing D11/D15 repairs. |
| U2 | PM + D2, then existing owner of training/nutrition rules | Decide which observed facts may justify changing calories/sets; remove tissue/cause certainty unsupported by those facts. |
| U3 | PM + D2 | Separate EA convention, uncertainty and symptom review from safety labels/partition claims; review recovery severity using the alternate walking value. |
| U4 | PM + D2 | Replace or justify SDES-derived individual dose/expected-gain fields; correct Roth/Bickel applicability before an actionable volume proposal. |
| U5 | PM → existing progression/review | Reconcile rirPlan's default with its stated effort policy, confirm the native prescription route and justify exact rep/noise/readiness choices; preserve corrected unknown/record behavior. |
| U6 | PM → existing nutrition/coach work | Reconcile break duration/cluster predicates and user copy; clarify protein, surplus and reverse-dieting claims without silently changing doses. |
| U7 | PM → existing onboarding/consumer work | Resolve necessary per-user missing inputs and configured-week consistency; prove proposal acceptance causes the promised durable change. |
| U8 | D2 independent review, then PM | Independently verify material conclusions, remaining source/supplement limits and exact A/M/caller traces before acceptance. |

Priority should follow confirmed consequential reach: exported but unobserved copy is not automatically as urgent as a field already passed into a recommendation. Known consequential defects retain their existing gates. This author audit imposes no blanket new release hold. If a new coaching choice is required, PM can turn the concrete reviewed alternative into a plain yes/no owner question.

## Self-corrections retained in the final assessment

The audit checked potentially misleading first impressions and corrected them before publication: Garthe's quoted male subgroup is real; the monthly gain conversion and record √2 are already present; EA's main band uses the structured estimate; sleepMean3At is boolean, not a numeric truthiness bug; the prepared constructor no longer supports a blanket H3-throws claim; and the old SDES/diet-break/progression statements cannot be treated as new instructions. Remaining findings above distinguish those repairs from unresolved inference, copy, consumer and applicability gaps.
