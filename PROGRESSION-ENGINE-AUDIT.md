# Independent audit of the Measured load/rep progression engine

**Audit date:** 11 August 2026  
**Scope:** Load/rep progression only. The settled volume-engine decisions are treated as fixed.  
**Athlete:** Experienced male lifter; four sessions per week; approximately 0.70% body-mass loss per week; current recovery green and reported lifts rising approximately 4% per session.  
**Review standard:** Published literature current through the audit date, with trained populations prioritized. Reviewer-derived calculations are explicitly separated from study findings. No code is proposed.

## Executive determination

The double-progression interface is a defensible way to organize training, but no direct evidence establishes it as superior for hypertrophy-led recomposition. It should be retained provisionally because the alternatives have not shown a meaningful hypertrophy advantage, not because the exact engine has been validated.

Three parts of the current engine fail the audit:

1. **The max-of-three, per-set anchor is statistically upward-biased.** With the athlete’s stated 0.77-rep repeatability scale, the expected selection bias is about 0.65 rep per set before any true change is considered. Across three sets, separately selected maxima can create an anchor nearly two reps above current mean capacity and can combine performances that never occurred in one session. A flat athlete will therefore be labelled stalled surprisingly often.
2. **The record rule does not model the quantity it tests.** A new-minus-old record comparison contains uncertainty in both observations. Session-total uncertainty also depends on within-session covariance; it is not generally proportional to the square root of set count. The present one-sighting rule can therefore bank false records even while sounding conservative.
3. **The Nuzzo attribution is false.** Nuzzo et al. fitted a natural cubic spline to repetitions-to-failure means and a linear model to log standard deviations. They did not validate Epley, report an Epley mean absolute error of 0.31 rep, or reject Brzycki for a roughly 40% underestimate. The Epley jump equation is algebraically coherent, but it is an app-derived model, not a result of that paper.

The engine is also more conservative than the athlete’s data in several places: the high-rep/large-rung window formula, the automatic hold after two hot openers, the estimated-food exclusion, the AMBER record veto, and the three-session reset pathway when driven by the biased anchor. Conversely, one-sighting record banking can be anti-conservative. “Conservative” is therefore not one dimension; prescription aggressiveness and evidential certainty must be assessed separately.

The highest-value redesign is to make every strength decision rest on comparable observations and a correctly defined change distribution. That means replacing the selected-maximum anchor, defining the 0.77-rep statistic, estimating set covariance, standardizing rest/warm-up/ROM/machine setup, and making records provisional until real change is supported. The progression style, rep windows, and deficit phase are secondary.

## Verdict language and evidence grades

- **SUPPORTED:** Evidence or a mathematical/statistical identity supports the component for its stated purpose.
- **CONTRADICTED:** Evidence, statistical logic, or internal coherence conflicts with the component as stated.
- **UNDERDETERMINED:** Direct evidence is absent or too indirect to choose the constant or policy.
- **Grade A:** Direct, convergent, high-quality evidence in a relevant population, or a mathematical/statistical result that does not depend on a biological assumption.
- **Grade B:** Moderate evidence, but with population, intervention, or outcome indirectness.
- **Grade C:** Limited, small, exploratory, or substantially indirect evidence.
- **Grade D:** No direct outcome evidence; the decision is an owner preference or untested operational policy.

An A grade can accompany UNDERDETERMINED when strong evidence precisely shows that no tested option is superior.

## 1. Verdict table

| Audit area | Component | Verdict | Grade | One-line reason |
|---|---|---:|:---:|---|
| Scheme | Double progression as a viable interface | SUPPORTED | B | Trained and novice trials show that adding reps or load can both produce strength and hypertrophy, but the exact window-then-jump system was not tested. |
| Scheme | Double progression is better than percentage, DUP, APRE, VBT, or RPE autoregulation | UNDERDETERMINED | A | Comparative evidence shows small or null average differences, especially for hypertrophy, and no head-to-head trial matches this athlete and engine. |
| Scheme | Helms/Larsen prove a roughly 0.5 outcome advantage for RIR autoregulation | CONTRADICTED | A | Helms had imprecise between-group estimates and no conventional group difference; Larsen did not pool a comparative 0.51–0.64 advantage. |
| Window | Epley lost-reps equation is algebraically coherent | SUPPORTED | A | Holding Epley-estimated capacity constant yields lost reps = (hi + 30) × step/(load + step). |
| Window | The equation was validated by Nuzzo 2024 | CONTRADICTED | A | Nuzzo used spline meta-regression, not Epley, and reported neither the claimed 0.31-rep MAE nor the claimed Brzycki error. |
| Window | One Epley slope works across 6–20 reps and isolation machines | CONTRADICTED | B | It roughly tracks the aggregate spline around 6–12 reps but becomes increasingly conservative at high reps/large jumps; isolation-machine evidence is sparse. |
| Window | Width = ceiling(predicted loss) + 1 is the correct buffer | UNDERDETERMINED | D | No trial or validation study identifies the optimal forecast quantile or loss function for a double-progression window. |
| Window | Flag jumps above 10% and seek microloading | SUPPORTED | C | The old ACSM 2–10% progression heuristic is indirect, but avoiding an unnecessarily coarse jump is mechanically sensible and preserves measurement resolution. |
| Rep step | Use terminal-set RIR to inform the next target | SUPPORTED | B | RIR contains useful effort information, although its error is large and context-dependent. |
| Rep step | Exact mapping 0→+1, 1–2→+2, ≥3→+3 | UNDERDETERMINED | D | No study compares these target increments or validates an effort-conditioned rep-step function. |
| Effort | Universal 2/1/0-RIR set sequence | UNDERDETERMINED | B | Close-to-failure work is effective, but no evidence identifies this exact within-exercise sequence as optimal. |
| Stall | Per-set maximum of the last three sessions as anchor | CONTRADICTED | A | Selection creates upward bias and can assemble a total never performed; it materially inflates non-beat and false-stall rates. |
| Stall | Three consecutive non-beats diagnose a true stall | CONTRADICTED | A | With the present selected anchor, three non-beats are common even under flat capacity; no false-alarm target was specified. |
| Stall | A stall should automatically cause a load reduction | CONTRADICTED | B | A plateau can reflect noise, task drift, fatigue, or insufficient stimulus; deload studies do not validate automatic load reduction. |
| Reset | Approximately −5%, snapped to a rung | UNDERDETERMINED | D | No direct study validates this magnitude, and uneven rungs mean the realized reduction is not actually a common 5%. |
| Rebuild | Fourteen days/usually three sessions | UNDERDETERMINED | D | No evidence establishes that capacity should return on this schedule across lifts, causes, or training phases. |
| Anchor rationale | Missed reps are cheap and ambitious targets are therefore better | UNDERDETERMINED | C | Failure/nonfailure studies address chronic effort, not repeated misses against selected-max targets or the proposed cost function. |
| Records | One sighting above old record by 2 current-session SE | CONTRADICTED | A | The difference includes old-record error and selection; treating the old record as noiseless misstates false-positive risk. |
| Records | Session-total SE = per-set error × square root of set count | CONTRADICTED | A | This only holds for equal-variance, uncorrelated set errors; shared readiness and fatigue make positive covariance plausible. |
| Records | ACSM two-for-two is a record-confirmation precedent | CONTRADICTED | A | It is a load-progression heuristic after exceeding a prescribed rep target, not a validated change-detection rule for records. |
| Records | CUSUM would necessarily be better | UNDERDETERMINED | C | Sequential methods can detect persistent shifts but require baseline stability, autocorrelation, and explicit false-alarm tuning. |
| Governor | Two hot openers force a hold | UNDERDETERMINED | D | No outcome evidence validates two exposures or a full hold; repeated easy performance may instead show that the prescription is stale. |
| Protection | RED means skip | UNDERDETERMINED | D | A safety override is defensible, but RED is undefined, so sensitivity and false-veto rates cannot be graded. |
| Protection | AMBER means no all-out work | UNDERDETERMINED | D | It may be appropriate for specified symptoms, but the category is undefined and no universal rule can be tested. |
| Protection | AMBER means no record can count | CONTRADICTED | C | A label does not invalidate an otherwise standardized, technically valid observation; only defined safety or validity failures should veto it. |
| Protection | Rushed sessions cannot set comparable anchors/trends | SUPPORTED | A | Changed rest or execution alters the test protocol, so the result is not interchangeable with a standardized session. |
| Protection | Short sleep counts for performance/records but cannot trigger a stall | SUPPORTED | B | Acute sleep loss modestly depresses strength on average; retaining valid performance while protecting against a fatigue diagnosis is a defensible asymmetry. |
| Protection | Sleep’s −2.85% effect is smaller than the athlete’s rep noise | CONTRADICTED | A | Percent strength and rep-count repeatability are different outcomes and units; they cannot be ordered without a common measurement model. |
| Protection | Estimated-food days are excluded from strength trends and stalls | CONTRADICTED | A | Nutrition-estimation quality affects causal interpretation, not the validity of a standardized strength observation. |
| Maxed ladder | Never prescribe below confirmed delivered capacity | SUPPORTED | A | This is a coherent owner constraint when “delivered” is protocol-valid and the record remains reversible if later shown spurious. |
| Maxed ladder | Permanent floor after one sighting | CONTRADICTED | A | A noisy one-off can permanently ratchet prescriptions upward; the floor inherits every defect in the record rule. |
| Rep placement | Broad rep/load flexibility for hypertrophy | SUPPORTED | A | Meta-analysis finds similar average hypertrophy across broad loads when effort is high, with strength specificity favoring heavier loads. |
| Rep placement | Universal literal 5–30 equivalence | UNDERDETERMINED | B | Most studies are short, sets often go to failure, highly trained subjects are underrepresented, and exact exercise-specific edges remain uncertain. |
| Rep placement | Hack squat 6–10 is uniquely optimal | UNDERDETERMINED | B | It is a permissible owner choice and strength-specific range, not an evidence-selected hypertrophy optimum. |
| Rep placement | Loaded-length findings determine rep-window placement | CONTRADICTED | B | ROM/length studies concern where force is produced, not which repetition window an exercise should use. |
| Strength instrument | Four sessions are enough for a reliable slope | UNDERDETERMINED | A | Reliability depends on cadence, expected slope, heteroscedasticity, and autocorrelation; four is not a universal resolution threshold. |
| Strength instrument | Restart all strength inference after a set-count change | CONTRADICTED | B | Total reps become noncomparable, but standardized first-set and per-set information remain usable; a full restart discards evidence. |
| Strength instrument | Athlete’s ±0.77 is ready to use as an SE | UNDERDETERMINED | A | Its meaning changes if it is an SD of paired differences, single-observation SEM/TE, confidence bound, or SE of a mean. |
| Strength instrument | Pool other lifts or published SEM as direct fallback | UNDERDETERMINED | C | Partial pooling can stabilize estimates, but exercise, load, rep range, set position, and metric definitions must be exchangeable. |
| Missing lever | Standardized inter-set rest | SUPPORTED | A | Rest strongly affects repetitions within a session and therefore instrument comparability, even though long-term hypertrophy differences are small/uncertain. |
| Missing lever | Standardized warm-up | SUPPORTED | B | Specific warm-up can acutely alter force/velocity; a fixed protocol is needed for repeatable readings. |
| Missing lever | Fixed ROM, technique, tempo, and machine setup | SUPPORTED | A | Task drift can masquerade as strength change; ROM-specific strength effects make this a measurement requirement. |
| Missing lever | A different per-lift frequency rule is required now | UNDERDETERMINED | B | Frequency has diminishing strength effects and little independent hypertrophy effect when volume is considered; current two-times-weekly exposure is plausible. |
| Missing lever | Planned overreaching must be added | CONTRADICTED | C | Very small studies do not establish benefit, and added fatigue would reduce measurement quality during a successful deficit phase. |
| Deficit | Automatically change progression constants during the deficit | CONTRADICTED | B | Energy deficit impairs lean-mass gain more clearly than strength gain, and no evidence validates phase-specific step, stall, reset, or window constants. |
| Deficit | Tag phase/body-mass trajectory for diagnosis | SUPPORTED | B | Energy availability changes the prior probability of recovery/lean-mass constraints without invalidating observed green performance. |
| Coherence | Let the running failure A/B also change RIR-conditioned rep steps | CONTRADICTED | A | Different target increments alter progression exposure and confound the settled failure comparison. |
| Coherence | Reset below a confirmed maxed-ladder floor | CONTRADICTED | A | The two rules issue mutually exclusive prescriptions unless an explicit safety/diagnostic exception is defined. |
| Coherence | Full trend restart after settled set-count changes | CONTRADICTED | A | It discards strength evidence exactly when the volume engine intentionally changes delivery. |
| Structural pacing | One structural change per session without exception | UNDERDETERMINED | D | This is an operational preference, not an adaptation result; safety and equipment-invalidity exceptions are still required. |

## 2. Evidence audit by question

### 2.1 Scheme: retain the interface, withdraw the superiority claim

The closest direct trial is Plotkin et al. [1]. Thirty-eight resistance-trained adults completed eight weeks of lower-body training while progressive overload came primarily from load increases or repetition increases. Rectus femoris growth modestly favored repetition progression by 2.8 mm (90% CI −0.5 to 5.8), while dynamic strength favored load progression by 2.0 kg (90% CI −2.4 to 7.8). Other between-group muscle-thickness differences were under 1 mm and performance differences were small. Both strategies worked; neither interval excludes a practically relevant advantage in both directions.

Chaves et al. [2] used a within-person design in 39 untrained young adults for ten weeks of unilateral leg extension. One leg progressed load and the other repetitions. Strength rose from 52.90 ± 16.32 to 69.05 ± 18.55 kg under load progression and from 51.67 ± 15.84 to 66.82 ± 17.95 kg under repetition progression; quadriceps cross-sectional area increased by approximately 2.19 and 2.31 cm², respectively. The paper supports viability, but its novice population and absence of a directly reported compatible between-condition CI in the abstract limit transfer to this athlete. It does not test double progression.

For periodization, Moesgaard et al. [3] found a small average 1RM advantage for periodized over nonperiodized, volume-equated programs (ES 0.31, 95% CI 0.04 to 0.57), but no clear hypertrophy advantage (ES 0.13, 95% CI −0.10 to 0.36). Undulating versus linear periodization favored undulating for 1RM (ES 0.31, 95% CI 0.02 to 0.61) and was larger in trained subgroups (ES 0.61, 95% CI 0.00 to 1.22), yet hypertrophy remained indistinguishable (ES 0.05, 95% CI −0.20 to 0.29). A newer synthesis found linear-versus-undulating effects close to zero for upper-body pushing (SMD 0.08, 95% CI −0.15 to 0.31) and squat strength (SMD 0.08, 95% CI −0.10 to 0.26) [4]. These results do not select a better hypertrophy-led progression engine.

Autoregulation also fails to identify a clear winner. Hickmott et al. [5] pooled 15 studies and found a small, uncertain 1RM difference for autoregulated versus standardized prescription: MD 2.07 kg (95% CI −0.32 to 4.46), SMD 0.21. Subjective autoregulation was MD 3.15 kg (95% CI −0.14 to 6.45), SMD 0.30; objective methods were MD 0.88 kg (95% CI −2.59 to 4.34), SMD 0.10. These were mostly strength-focused trained populations, not machine-based hypertrophy programs.

The newest network meta-analysis is more favorable to some alternatives [29]. Across 27 randomized trials and 694 healthy active participants, APRE improved back-squat 1RM versus percentage-based training by SMD 0.59 (95% CI 0.16 to 1.02) and VBT by 0.41 (0.10 to 0.73), while RPE/RIR autoregulation was uncertain at 0.12 (−0.31 to 0.56). APRE and VBT also favored countermovement jump by 1.08 (0.30 to 1.87) and 0.62 (0.23 to 1.02). This raises a credible strength/power advantage, but it is an indirect network spanning adolescents, students, novice lifters, trained athletes, and dissertations; it reports squat and jump, not hypertrophy or machine-isolation progression. It cannot select an engine for this goal.

The brief overreads two supporting sources. In Helms et al. [6], 21 resistance-trained men used RPE- or percentage-based loading for eight weeks. Conventional between-group tests did not show a difference; magnitude-based estimates were imprecise: squat ES 0.50 ± 0.63, bench ES 0.28 ± 0.73, and total ES 0.48 ± 0.68 using 90% intervals. The “ES 0.48” is therefore not a clean advantage. Larsen et al. [7] reviewed 14 studies (356 participants) but did not produce a comparative pooled 0.51–0.64 superiority estimate. Bartolomei et al. [8] is particularly relevant: in 24 trained men, readiness/RIR autoregulation produced 8,519.9 ± 901.2 versus 7,893.0 ± 267.8 repetitions over ten weeks (approximately 7.4% more; partial η² = 0.183) without superior strength, power, or hypertrophy.

**Decision:** Keep double progression as a transparent interface. Do not claim it is physiologically superior. Its value is usability, machine-rung compatibility, and auditability. An APRE, VBT, DUP, percentage, or RPE alternative has not shown a sufficiently certain hypertrophy advantage to justify switching this athlete.

### 2.2 Window width: algebra correct, empirical attribution and universality wrong

#### What the equation actually says

Under Epley, estimated 1RM is load × (1 + reps/30). If capacity is assumed unchanged across a load jump, equating old and new estimated 1RM and solving for repetitions lost gives:

**Predicted lost reps = (current reps + 30) × load step/(current load + load step).**

That algebra is correct. It does not establish that Epley is accurate for an individual isolation exercise, at 6–20 reps, over repeated sets, or at a fixed nonzero RIR.

It also does not match the engine’s own top-hit protocol exactly. The opener is prescribed at 2 RIR, middle sets at 1 RIR, and only the terminal set at failure, while later-set targets decline by set index. Under the same Epley assumptions, a set completed at k RIR would use estimated capacity reps + k, not completed reps alone. Across later sets, accumulated fatigue and correlated readiness add larger uncertainties. One width derived from hi is therefore a pragmatic block-design choice, not a common physiological boundary for all sets.

#### What Nuzzo et al. actually estimated

Nuzzo et al. [9] synthesized 952 first-set repetitions-to-failure tests from 7,289 individuals in 452 groups and 269 studies. Samples were 66% male, 97% healthy, 92% younger than 59, and 60% resistance-trained. Bench press supplied 42% of tests, leg press 14%, squat 12%, knee extension 11%, and chest press 9%; 39% used machines. The authors fitted a natural cubic spline to log mean repetitions and a linear model to log between-person SD. They explicitly noted minimal data for overhead press, pulldown, row, triceps extension, knee flexion, and calf raise.

The aggregate point estimates were:

| %1RM | Mean failure reps (95% CI) | Between-person SD (95% CI) |
|---:|---:|---:|
| 95% | 3.28 (2.66 to 4.04) | 1.66 (1.45 to 1.90) |
| 90% | 4.94 (4.35 to 5.61) | 1.90 (1.69 to 2.14) |
| 85% | 7.15 (6.69 to 7.65) | 2.19 (1.97 to 2.42) |
| 80% | 9.75 (9.32 to 10.20) | 2.51 (2.29 to 2.75) |
| 75% | 12.37 (11.87 to 12.88) | 2.88 (2.65 to 3.13) |
| 70% | 14.80 (14.23 to 15.40) | 3.31 (3.06 to 3.58) |
| 65% | 17.11 (16.36 to 17.90) | 3.80 (3.51 to 4.12) |
| 60% | 19.53 (18.52 to 20.59) | 4.37 (4.01 to 4.76) |

Exercise differences matter: at 80% and 70% 1RM, leg-press means were 13.1 reps (95% CI 9.8 to 17.5) and 19.0 (14.2 to 25.5), versus bench-press means of 8.8 (7.7 to 10.1) and 14.1 (12.4 to 16.1). Those are group means for failure on a fresh first set—not within-athlete transition error after a rung change and not a three-set 2/1/0-RIR sequence.

#### Reviewer cross-check against the published spline table

I inverted the published 5%-point aggregate table with monotone interpolation, applied a relative rung jump, and predicted the new failure-rep mean. This is a reviewer calculation, not a result reported by Nuzzo. Values below are predicted reps lost, shown as **Nuzzo-table approximation / Epley**:

| Window top | Approximate starting %1RM | 1.6% jump | 5% jump | 12.5% jump |
|---:|---:|---:|---:|---:|
| 6 | 87.5% | 0.60 / 0.57 | 1.73 / 1.71 | Not estimable inside Nuzzo’s 95%-1RM upper table boundary |
| 8 | 82.9% | 0.67 / 0.60 | 2.00 / 1.81 | 4.34 / 4.22 |
| 10 | 79.5% | 0.67 / 0.63 | 2.10 / 1.90 | 4.85 / 4.44 |
| 12 | 75.7% | 0.63 / 0.66 | 1.99 / 2.00 | 4.94 / 4.67 |
| 15 | 69.6% | 0.53 / 0.71 | 1.67 / 2.14 | 4.34 / 5.00 |
| 20 | 59.1% | 0.51 / 0.79 | 1.51 / 2.38 | 3.59 / 5.56 |

Epley is close enough to be a rough planning prior around 6–12 reps and modest jumps. At high reps it increasingly predicts more loss than the aggregate spline, especially for large jumps. At a 20-rep top and a 12.5% jump, the engine predicts 5.56 lost reps while the aggregate spline approximation predicts 3.59. After ceiling and the extra rep, the current rule creates a seven-rep-wide window rather than roughly five—a two-rep conservative expansion before accounting for the ceiling’s own rounding buffer.

This does **not** prove that the athlete’s rear-delt fly should use the aggregate spline. Nuzzo lacks precise exercise-specific data for that machine, and the athlete’s own response can differ. It does prove that “Nuzzo validated Epley across these uses” is untenable.

#### The +1 buffer

No published study identifies +1 as optimal. If 0.77 were a centered, single-observation SD/typical error for post-jump rep-loss forecasts and errors were Gaussian, a one-rep buffer alone would cover an adverse forecast error with probability Φ(1/0.77) ≈ 90.3%. But those assumptions are unverified; ceiling already adds between 0 and almost one rep of buffer, and 0.77 measures repeated sets, not formula residuals. Nuzzo’s reported SD is between individuals, not the athlete’s within-person transition uncertainty.

**Evidence-based alternative:** There is no validated universal replacement formula. Use an explicit forecast hierarchy:

1. Estimate the athlete’s observed rep loss after each valid rung transition, separately by lift and, where data allow, by rep region and jump size.
2. Choose a stated adverse-error quantile based on the owner’s loss function: how often may the first post-jump prescription fall below target versus how costly is an unnecessarily wide block?
3. Until enough transitions exist, use the Nuzzo curve or Epley only as a weak prior, with partial pooling across genuinely similar lifts—not as validation.
4. When a coarse rung would place the expected post-jump performance outside a technically safe/desired range, hold reps, microload, or change equipment. Do not manufacture a very wide window and call it precision.

### 2.3 RIR-conditioned rep steps: useful signal, unvalidated dose function

Halperin et al. [10] pooled 262 effects from 12 studies and 414 participants. Lifters underpredicted repetitions remaining to failure by 0.95 rep on average (95% CI 0.17 to 1.73), with extreme heterogeneity (I² = 97.9%). Accuracy improved near failure: the meta-regression slope was −0.025 (95% CI −0.050 to 0.0014). Error increased markedly in sets above 12 reps: slope 0.47 (95% CI 0.44 to 0.49), compared with 0.06 (0.04 to 0.09) at 12 or fewer reps. Later set number also modestly changed error (slope −0.07, 95% CI −0.14 to −0.005).

This supports treating RIR as noisy information. It does not support the exact target function. Average underprediction means a reported 0 RIR may sometimes be approximately 1 true RIR, so the current mapping tends to issue a smaller next step than true effort alone would imply. That is conservative on average, but the very high heterogeneity forbids a blanket +1 correction. The correct calibration is athlete-, lift-, rep-range-, and set-position-specific.

No trial compares +1 versus +2 versus +3 target increments conditional on terminal RIR. Autoregulation outcome studies manipulate load, volume, or exercise selection and cannot validate this discrete rep target. Therefore:

- Keep terminal RIR as a covariate and calibration signal.
- Do not present the current bins as evidence-based.
- While the settled failure-versus-1–2-RIR A/B is running, use the same progression-target rule in both conditions or freeze progression targets. Otherwise effort assignment changes both the treatment and the future dose.

### 2.4 Stall, reset, rebuild, and the ambitious anchor

#### The anchor creates the stall it claims to detect

For three independent Gaussian observations with constant true capacity and per-observation SD σ:

**E[max of 3] = mean + 0.846σ.**

If the athlete’s 0.77-rep number is the applicable σ, selecting the maximum adds approximately 0.65 rep per set. Selecting each set separately across three sessions can add about 1.95 reps to a three-set total. The selected set maxima can come from different days, so the constructed anchor may be a “Frankenstein” total that the athlete never delivered under one readiness state.

I also ran a reviewer Monte Carlo sensitivity analysis under flat true capacity, Gaussian session errors, three sets, a rolling three-session per-set-max anchor, and 0.77-rep marginal error. This is not a published study and should be replaced by the athlete’s actual logs:

| Within-session correlation between set errors | Chance current total beats anchor | Chance of three consecutive non-beats |
|---:|---:|---:|
| 0.00 | 12.0% | 66.6% |
| 0.25 | 16.4% | 55.7% |
| 0.50 | 19.9% | 48.1% |
| 0.75 | 22.6% | 42.5% |
| 1.00 | 25.0% | 38.4% |

Integer reps and ties are likely to make “strictly beat” harder. These results are sufficient to reject the current anchor statistically even before biological uncertainty enters.

#### Does aiming high have a proven favorable cost asymmetry?

No. Failure-versus-nonfailure literature answers a different question. Grgic et al. [11] found no clear overall strength advantage from failure (ES −0.09, 95% CI −0.22 to 0.05) and an uncertain hypertrophy difference (ES 0.22, 95% CI −0.11 to 0.55); a trained hypertrophy subgroup modestly favored failure (ES 0.15, 95% CI 0.03 to 0.26). A 2026 RCT-only synthesis found nonfailure training modestly favored dynamic strength (SMD 0.24, 95% CI 0.06 to 0.42), particularly in trained participants (SMD 0.38, 95% CI 0.09 to 0.66), while hypertrophy was uncertain (SMD −0.15, 95% CI −0.39 to 0.09) [12]. Neither study tests repeated target misses, motivation, technique drift, or a selected-max anchor.

The owner may rationally prefer occasional misses over slow progression. That preference should be encoded as an explicit target quantile, not smuggled into a biased estimator.

#### Stall should trigger diagnosis, not an automatic −5% command

A non-beat can mean:

- ordinary measurement variation;
- a changed test protocol—rest, setup, ROM, tempo, or assistance;
- acute fatigue, illness, pain, or sleep disruption;
- accumulated training fatigue;
- a target made unrealistic by a coarse rung;
- stable adaptation with insufficient time;
- insufficient stimulus; or
- a true decline.

The direction of the intervention differs by cause. Reducing load can help some fatigue or pain situations, but can be irrelevant or counterproductive for inadequate stimulus, a noisy anchor, or a technique change.

Direct deload evidence is sparse. Pancar et al. [13] studied 19 untrained young men with a randomized within-person design over eight weeks. Deload limbs reduced weekly sets and frequency—not load by 5%—at weeks 4 and 8. Between-condition changes were small and uncertain: leg-extension 10RM +0.79 kg (95% CI −0.66 to 2.24) and curl 10RM +0.13 kg (95% CI −0.14 to 0.41); muscle-thickness intervals also crossed zero. Coleman et al. [14] studied 39 trained adults and inserted a complete one-week training cessation at midpoint; hypertrophy, endurance, and power were similar, while continuous training showed some lower-body strength advantages. A Delphi consensus [15] describes common deload practice, but it is expert opinion, not outcome validation.

None supports three non-beats, −5% snapped load, or a 14-day/three-session rebuild. A snapped “5%” reset is especially incoherent on machines whose next lower rung may be much farther away.

**Decision:** A stall flag should open a cause check after repeated comparable observations. A load reduction should follow only when the evidence favors fatigue, pain, technique recovery, or a deliberately easier exposure. If the athlete remains green and performance is rising, a fixed reset is a typed constant overriding the instrument.

### 2.5 Record confirmation: test change, not the new observation alone

#### First resolve what ±0.77 means

The same number implies different error scales:

- If 0.77 is the SD of paired differences, single-observation typical error is approximately 0.77/√2 = 0.54 rep under equal independent error.
- If 0.77 is already a single-observation SEM or typical error, it remains 0.77.
- If ±0.77 is a confidence interval, an SE of the mean across 31 pairs, or a mean absolute difference, neither conversion is valid.
- Repeatability does not remove systematic RIR bias or protocol drift.

Mitter et al. [16] tested 24 resistance-trained men at 70%, 80%, and 90% 1RM. First-set repetitions-to-failure SEM was approximately 0.7–1.1 reps; reliability varied by load, including ICC 0.86 (90% highest-density interval 0.71 to 0.93) at 70% and ICC 0.65 (0.39 to 0.83) at 90%. Those figures are useful external priors, but they are not multi-set session-total SEs for this athlete’s machines.

#### The correct comparison includes both observations

For new total N and old record O:

**Var(N − O) = Var(N) + Var(O) − 2Cov(N,O).**

If two independent observations have equal single-session SEM, the standard error of their difference is √2 × SEM. The familiar two-sided 95% minimum detectable change is 1.96√2 × SEM [17]. A one-sided “new is higher” rule would use a different critical value, such as 1.645 for a 5% false-positive rate. The engine’s 2 × current-session SE treats the old selected maximum as noiseless. Under equal independent errors it is only 1.414 standard errors of the difference, a one-sided false-positive probability of about 7.9% before selection bias.

The old record is not an ordinary observation: it was selected because it was high. That winner’s-curse component further complicates a one-off comparison.

#### Square-root-of-set-count is a special case

For a session total S = X₁ + … + Xₙ:

**Var(S) = ΣVar(Xᵢ) + 2ΣCov(Xᵢ,Xⱼ).**

If all sets have SD 0.77 rep and common correlation ρ, the session-total SD is 0.77√[n + n(n − 1)ρ]. For three sets:

| Assumed within-session ρ | Three-set total SD |
|---:|---:|
| 0.00 | 1.33 reps |
| 0.25 | 1.63 reps |
| 0.50 | 1.89 reps |
| 0.75 | 2.10 reps |

The square-root rule understates uncertainty by about 18–37% across correlations 0.25–0.75. These correlations are illustrative, not estimates of this athlete’s data.

#### Two-for-two and CUSUM

The 2009 ACSM “two-for-two” recommendation says to increase load by roughly 2–10% when the athlete can perform one or two repetitions above the desired number on two consecutive sessions [18]. It is a progression heuristic, not a validation study of record banking, readiness, session totals, or minimal detectable change. The 2026 ACSM update synthesizes 137 systematic reviews and supersedes the old broad position stand; it does not validate one-sighting record machinery [19].

CUSUM, EWMA, or a state-space model can detect persistent shifts more efficiently than isolated thresholding when their baseline, serial correlation, shift size, and false-alarm cost are specified. They are not automatically better for a one-off personal record. The defensible near-term policy is simpler:

- Log an observed best immediately.
- Label it **provisional** unless it clears a correctly specified change threshold or is replicated.
- Keep the previous confirmed best and allow reversal.
- Apply the maxed-ladder floor only to a confirmed, protocol-valid observation, or make the floor reversible.

### 2.6 Governor and protection ladder: separate safety, test validity, and interpretation

The ladder currently mixes three distinct questions:

1. **Is training safe today?**
2. **Is the observed performance comparable enough to update a strength instrument?**
3. **Should a contextual variable change how a low result is interpreted?**

They should not share one veto.

| Condition | Training decision | Use of performance | Audit |
|---|---|---|---|
| Defined RED safety symptom | Skip or modify according to the safety rule | No performance observation | Defensible in principle; cannot grade thresholds until RED is defined. |
| Defined AMBER symptom | Modify effort only when the symptom makes all-out work unsafe | Retain technically valid submaximal data; do not blanket-veto records | Current universal no-record rule is overprotective. |
| Rushed/short-rest session | Train if safe | Keep the raw session, but do not compare it with standard-rest anchors or slopes | Supported as protocol-invalid for the main instrument. |
| Short sleep | Train if safe; no automatic derating | Keep valid performance and records; protect an isolated low from causing a fatigue/reset diagnosis | Current asymmetry is broadly defensible. |
| Estimated food | No automatic training change | Keep strength data; tag nutrition quality only for causal interpretation | Current exclusion is contradicted. |
| Two hot openers | Check RIR calibration and prescription fit | Do not impose an automatic two-session full hold | Fixed hold is underdetermined and can oppose green data. |

Craven et al. [20] synthesized 69 studies and 227 outcomes. Overall performance changed by −7.56% (95% CI −11.90 to −3.13); the strength subset across 25 studies and 289 participants was −2.85% (95% CI −4.47 to −1.23), with I² = 62.2%. Morning strength was −1.78% (95% CI −3.22 to −0.33) and afternoon/evening strength −4.58% (95% CI −7.59 to −1.58). Samples were predominantly male and often not highly trained. This supports contextual protection against interpreting one low as a stall. It does not permit a numerical comparison with 0.77-rep repeatability without mapping both to the same lift and outcome.

Bartolomei et al. [8] reinforces restraint: readiness-based autoregulation increased completed work but did not improve adaptation. Readiness labels may guide safety and explain data; they do not automatically deserve authority over valid performance.

### 2.7 Rep-window placement and the hack-squat case

López et al. [21] analyzed 28 studies and 747 healthy adults. Twenty-one of 28 studies involved untrained participants, no study involved highly trained participants, and included sets were generally taken to failure. Hypertrophy differences were uncertain: high versus low load SMD 0.12 (95% CI −0.06 to 0.29), moderate versus low 0.20 (−0.04 to 0.44), and high versus moderate −0.09 (−0.33 to 0.16). Strength showed load specificity: high versus low SMD 0.60 (95% CI 0.38 to 0.82), moderate versus low 0.34 (0.05 to 0.62), and high versus moderate 0.26 (−0.02 to 0.54).

The defensible statement is “hypertrophy occurs across a broad load/rep range when sets are sufficiently hard,” not literal universal indifference from 5 to 30 reps. High-rep work may carry more RIR error and local discomfort; low-rep work raises joint/load demands and produces fewer stimulating repetitions per set. Exercise stability, safe proximity to failure, joint tolerance, ROM fidelity, fatigue cost, and machine-rung geometry are reasonable placement criteria because they affect execution and measurement. Evidence does not supply a single optimum.

Loaded-length research does not select a rep range. Wolf et al. [22] found small/uncertain full-versus-partial ROM differences across outcomes (SMD 0.12, 95% CI −0.02 to 0.26), strength (0.14, −0.01 to 0.29), and muscle size (0.04, −0.17 to 0.25). Lengthened partials had an uncertain hypertrophy estimate favoring partials (SMD −0.28, 95% CI −0.81 to 0.16). These findings concern ROM and task specificity.

**Hack squat 6–10:** Keep it as an owner ruling. It is within a productive range, makes sense if high-rep systemic discomfort or technique loss is limiting, and favors load-specific strength. Do not cite it as the hypertrophy optimum. Because its 10-rep top lies in the region where Epley and the aggregate Nuzzo spline are reasonably close, the width formula is less problematic here than at a 20-rep isolation top.

### 2.8 Strength instruments

The current session-total metric mixes at least five constructs: strength/endurance capacity, set count, rest interval, set order fatigue, and proximity to failure. A trend in it can be useful, but it is not a protocol-invariant strength estimate.

Four sessions are not a validated threshold. A slope can be computed with fewer observations, but detecting a meaningful slope requires the expected rate of change, residual variance, serial correlation, missingness, and decision error costs. If lifts truly rise about 4% per session, a standardized instrument should detect that quickly; if the apparent rate is derived from changing reps, loads, set counts, or Epley estimates, its interpretation must be verified.

The best hierarchy is:

- preserve a standardized set-level performance read, ideally the same set position, load region, RIR protocol, rest, ROM, and setup;
- model or report later sets separately rather than treating their covariance as zero;
- use session total for delivered work/endurance only when set count and protocol match;
- retain data through set-count changes and mark the design change rather than restarting every strength history;
- treat direct standardized 1RM or fixed-load repetition tests, if safely and periodically used, as criterion checks rather than forcing every training set to be a strength test.

Grgic et al. [23] found good test–retest reliability for direct 1RM across 32 studies (n = 1,595): median ICC 0.97 and median CV 4.2%; among participants with resistance-training experience, median ICC was 0.98 and median CV 3.3%. But 1RM CV is not interchangeable with repetitions-to-failure SEM or a three-set total. The brief is correct about the 3.3% subgroup and incorrect if that number is used directly to size rep-window or session-total noise.

The 0.77-rep dataset is more relevant than a pooled study only after its estimand is defined. Estimate repeatability by lift, rep region, load, set position, rest, and effort where sample size permits, with partial pooling rather than unconditional substitution.

### 2.9 Missing levers

#### Rest interval: highest-priority omission

Rest directly changes how many reps can be delivered in later sets. It must therefore be fixed or recorded for anchor, stall, record, and slope comparisons. Long-term hypertrophy evidence is less decisive: Singer et al. [24] pooled nine studies and found small/uncertain longer-versus-shorter rest effects for arm hypertrophy (SMD 0.13, 95% credible interval −0.27 to 0.51), thigh hypertrophy (0.17, −0.13 to 0.43), and whole-body hypertrophy (−0.08, −0.45 to 0.29). A small trained-men trial found some advantages to three versus one minute [25], but precision and generalizability are limited. Standardize rest for measurement even if no universal hypertrophy-optimal rest is declared.

#### Warm-up: standardize; do not overengineer

In a crossover study of 34 trained men, a specific warm-up improved first-set mean velocity with reported squat ES 0.91 and bench ES 0.56 and squat peak velocity ES 1.23; confidence intervals were not reported [26]. The acute literature supports consistency, not a unique protocol. Use the same machine setup and a reproducible sequence of low-fatigue specific warm-up sets before comparable reads.

#### Technique, ROM, machine setup: measurement prerequisites

Seat position, lever start, pin/hang-on plates, foot/hand placement, ROM endpoint, assistance, pauses, and repetition acceptance must be stable. ROM-specific strength in the Wolf synthesis favored the trained/tested ROM (SMD 0.32, 95% CI 0.14 to 0.49) [22]. A shorter or mechanically easier rep can therefore create a “record” without a strength gain.

#### Frequency: monitor rather than change

The 2026 ACSM overview associates at least twice-weekly exposure and heavier loading with strength development, while hypertrophy responds primarily to sufficient weekly volume [19]. Recent dose-response meta-regression reports a small, diminishing independent frequency relationship for strength and little identifiable independent hypertrophy effect once volume is considered [27]. The athlete already exposes upper and lower musculature twice weekly. No evidence requires a per-lift frequency change before his own standardized data indicate a need.

#### Planned overreaching: not a missing requirement

Planned overreaching evidence in resistance-trained lifters remains small, heterogeneous, and protocol-specific. A scoping review included 47 papers, with cohorts generally no larger than 43, and concluded that both functional and nonfunctional overreaching can follow increased volume/intensity while no robust rule identifies the transition [30]. It does not justify deliberately degrading a currently green, rising instrument during an energy deficit. If used later, it should be a separate planned experiment with a recovery criterion, not a hidden response to three noisy non-beats.

### 2.10 Deficit versus coming surplus

Murphy and Koehler [28] found that resistance training during energy deficit impaired lean-mass gain versus nondeficit training (ES −0.57, p = 0.02; an approximate 95% CI reconstructed from the reported effect and p value is −1.05 to −0.09), while the strength difference was uncertain (ES −0.31, p = 0.28; approximate reconstructed 95% CI −0.87 to 0.25). Their meta-regression estimated that about a 500-kcal/day deficit eliminated average lean-mass gain. Critically, most underlying participants were sedentary or untrained, so preserved novice strength gain does not prove zero cost in an experienced lifter.

The evidence supports a different prior for adaptation and recovery, not different engine constants. For each requested constant:

| Constant | Deficit ruling | Surplus ruling | Reason |
|---|---|---|---|
| RIR-conditioned rep step | No automatic change | No automatic change | No phase-specific validation; observed performance already supplies the relevant signal. |
| Stall trigger | No fixed extra patience or faster reset | No fixed tightening | Calibrate to measurement error and false-alarm cost, then use phase as diagnostic context. |
| Reset size | No automatic larger/smaller reset | No automatic change | Reset should follow diagnosed cause; no study validates a phase-specific percentage. |
| Window placement | No phase-wide shift | No phase-wide shift | Exercise mechanics, safe effort, and rung geometry dominate; the phase may affect tolerability, not a universal range. |
| Window width | No phase-wide shift | No phase-wide shift | Width is a transition-forecast uncertainty problem, not a calorie-phase constant. |
| Record threshold | No change | No change | Measurement validity and false-positive control should not depend on diet phase. |

At this moment, green recovery and rising lifts are stronger athlete-specific evidence than a population prior for preemptive derating. Tag body-mass trend and energy phase; if performance turns down, include deficit severity, protein, sleep, illness, pain, and accumulated fatigue in diagnosis. Do not reinterpret estimated-food days as invalid strength tests.

### 2.11 Coherence with the settled volume engine

Four conflicts require explicit resolution:

1. **Failure A/B versus rep-step mapping.** A failure terminal set is assigned +1 while a 1–2-RIR terminal set is assigned +2. The next exposure therefore differs because of the tested condition. That contaminates the settled A/B. Freeze identical progression targets or treat progression as part of the intervention and accept that the experiment no longer isolates failure.
2. **Maxed-ladder floor versus reset.** “Never prescribe below delivered” and “three stalls force a lower rung” cannot both be laws. A confirmed safety/diagnostic override must be named; otherwise the reset is invalid.
3. **Set-count change versus strength history.** The settled volume engine may intentionally change delivered sets. Restarting the entire strength window discards exactly the evidence needed to understand that transition. Break session-total comparability, not set-level history.
4. **One structural change versus safety.** Operational pacing is reasonable, but a new safety issue, broken machine, or invalid exercise setup may require more than one change. Safety must outrank the pacing rule.

No settled volume gate, cadence, ceiling, conversion read, rollback/hold rule, sleep-veto ruling, budget separation, owner routing, failure-study outcome, cut rate, or soreness decision is reopened here.

## 3. Ranked changes by expected effect on the athlete’s goal

### 1. Replace the selected-max anchor and decouple “non-beat” from “stall”

**Expected effect: Very high—fewer false stalls, fewer unnecessary resets, cleaner progression targets.**

Use the most recent comparable performance or a robust estimate of current capacity, with uncertainty, rather than per-set maxima from three sessions. State the intended target percentile if the athlete prefers ambitious aims. Require a sustained, probabilistic flat/declining signal before diagnosing a stall; then identify cause before intervention. The statistical selection result is decisive; failure studies do not rescue the current estimator [11,12].

### 2. Repair record confirmation before allowing permanent maxed-ladder floors

**Expected effect: Very high—prevents noisy one-offs from permanently ratcheting prescriptions.**

Define ±0.77, estimate old and new observation error, account for within-session set covariance, distinguish one- from two-sided error control, and acknowledge old-record selection. Until then, keep one-sighting records provisional and reversible. ACSM two-for-two is not validation [16–19,23].

### 3. Standardize the strength test embedded in training

**Expected effect: High—improves every anchor, record, stall, and trend downstream.**

Fix or record inter-set rest, warm-up, machine configuration, ROM, technique acceptance, and assistance. Preserve raw observations from rushed or modified sessions but exclude them from same-protocol comparisons. Nutrition-estimate quality is not a test-validity criterion [22,24–26].

### 4. Recalibrate post-jump rep loss from the athlete’s transitions

**Expected effect: High on coarse-rung lifts; modest on small-rung lifts.**

Withdraw the claimed Nuzzo/Epley validation. Use the aggregate curve or Epley as a weak prior, then learn per-lift/rung residuals and choose an explicit adverse-error quantile. The current formula is acceptably close around 6–12 reps with modest jumps but can be two or more reps unnecessarily conservative at high reps and large jumps [9].

### 5. Protect the running failure A/B from progression confounding

**Expected effect: High for inference quality; neutral immediate training effect.**

Use the same next-session target rule across matched A/B lifts until the experiment is complete, or explicitly redefine the intervention to include different progression. RIR error is too heterogeneous to justify the current asymmetric target dose [10].

### 6. Turn reset into a diagnosis outcome, not a three-count reflex

**Expected effect: Moderate to high—avoids responding in the wrong direction.**

After comparable performance truly declines, check protocol, pain/illness, acute and accumulated fatigue, rung size, and stimulus. Choose reduced volume/frequency/effort/load only when that diagnosis supports it. Neither −5% nor 14 days is evidence-selected [13–15].

### 7. Build a set-count-tolerant strength read

**Expected effect: Moderate—preserves learning through volume changes.**

Keep standardized set-level histories and separate session-total work capacity. Mark set-count transitions rather than resetting all strength inference. Do not use 1RM CV as a direct substitute for rep-total SEM [16,23].

### 8. Rewrite the protection ladder around safety, validity, and interpretation

**Expected effect: Moderate—removes typed vetoes while retaining legitimate safeguards.**

Define RED and AMBER. Let rushed protocol changes invalidate comparison, not erase delivered data. Let sleep protect against a low-result diagnosis while preserving valid records. Remove estimated-food exclusion. Replace the two-hot-opener hold with a calibration check [8,20].

### 9. Retain broad rep flexibility and the 6–10 hack-squat owner choice

**Expected effect: Low immediate change—prevents unnecessary redesign.**

Place windows using stable technique, safe proximity to failure, joint tolerance, fatigue cost, and rung geometry. Do not use loaded-length evidence as a rep-range selector [19,21,22].

### 10. Keep progression constants phase-invariant unless athlete data show a phase interaction

**Expected effect: Low now; protects against preemptive underloading.**

Use the deficit/surplus as context for adaptation and diagnosis, not as a blanket multiplier. The deficit evidence is clearer for lean mass than strength and largely novice-derived [28].

## 4. Explicit disagreements with the brief

1. **Nuzzo did not validate Epley.** The paper fitted a spline and never reported Epley MAE = 0.31 rep [9].
2. **Nuzzo did not reject Brzycki for a roughly 40% underestimate.** That statement is absent from the paper and should be removed unless another source is supplied.
3. **The Epley equation is not uniformly consistent from 6 to 20 reps on isolation machines.** Aggregate agreement deteriorates at high reps, and relevant exercise-specific data are sparse [9].
4. **Helms ES 0.48 is not proof that RIR autoregulation improves outcomes.** It is an imprecise estimate with a 90% uncertainty width of ±0.68 and no conventional between-group difference [6].
5. **Larsen’s 0.51–0.64 values are not a pooled comparative benefit.** The review does not validate the engine’s readiness method [7].
6. **RIR bias does not validate the +1/+2/+3 mapping.** Mean underprediction is heterogeneous and changes with rep range and set number [10].
7. **A bad session is not corrected by choosing a maximum.** Maximum selection replaces downward noise with predictable upward bias and raises false-stall risk.
8. **Three non-beats are not evidence of a stall under this anchor.** Reviewer simulation shows the event can be more likely than not under flat capacity.
9. **A plateau does not identify fatigue.** Automatic −5% reset chooses a cause before diagnosis; deload trials test different interventions [13–15].
10. **Two current-session SEs do not test new-minus-old change correctly.** The old selected record has uncertainty and set covariance matters [17].
11. **Square-root-of-set-count is not a general session-total error model.** It assumes zero covariance.
12. **ACSM two-for-two is not a record-confirmation precedent.** It is a load-progression heuristic [18], and the 2026 position stand does not renew it as record statistics [19].
13. **Craven’s −2.85% cannot be declared smaller than ±0.77 reps.** They are different metrics [20].
14. **Estimated food does not invalidate measured strength.** It should affect causal interpretation only.
15. **AMBER cannot automatically erase a record.** Only a defined safety or protocol-validity problem should do that.
16. **Loaded length does not determine rep-window placement.** ROM evidence and rep-range evidence answer different questions [21,22].
17. **A 14-day rebuild is not evidence-based.** It is an operational guess.
18. **The current deficit does not justify gentler constants.** The athlete’s green/rising data should govern until a standardized instrument shows otherwise [28].

## 5. LOOK-DON’T-ACT: contradictions requiring the athlete’s own data

The following are audit targets, not instructions to alter live training. They should be checked against logs before any accepted specification is queued.

| Flag | What to verify in the athlete’s data | Why it matters before action |
|---|---|---|
| **LOOK-DON’T-ACT** | Identify exactly how ±0.77 was computed: SD of paired differences, SEM/typical error, confidence interval, mean absolute difference, or SE of a mean. | Every record, stall, and interval calculation changes with the definition. |
| **LOOK-DON’T-ACT** | Estimate repeatability by lift, rep region, set position, and load; estimate within-session set covariance/correlation. | Pooled 0.77 and square-root set scaling may over- or understate uncertainty. |
| **LOOK-DON’T-ACT** | Recalculate how often the current rolling per-set-max anchor is beaten, tied, and followed by three non-beats. | The simulation predicts high false-stall rates, but actual serial dependence and integer ties should decide magnitude. |
| **LOOK-DON’T-ACT** | List which per-set anchors were assembled from different sessions and whether the constructed total was ever delivered. | This identifies “Frankenstein” targets created by the estimator. |
| **LOOK-DON’T-ACT** | Compare predicted versus realized rep loss at every valid rung transition, especially 12.5% jumps and 15–20-rep tops. | This determines whether the current formula is actually conservative for this athlete and by how much. |
| **LOOK-DON’T-ACT** | Verify current window widths against Nuzzo-table and Epley predictions, without changing them yet. | The aggregate cross-check shows potential, not athlete-specific error. |
| **LOOK-DON’T-ACT** | Audit every permanent/maxed record banked from one sighting and its margin under a correct new-minus-old error model. | A spurious record can create an irreversible delivered floor. |
| **LOOK-DON’T-ACT** | Check whether failure and 1–2-RIR A/B lifts currently receive different target increments or reach rung changes at different rates. | If so, the settled comparison is confounded. |
| **LOOK-DON’T-ACT** | Quantify hot-opener holds during green sessions and whether the next valid performance rose despite the hold. | This tests whether the two-session constant overrides a responsive instrument. |
| **LOOK-DON’T-ACT** | Compare estimated-food, rushed, short-sleep, and ordinary sessions after controlling for test protocol. | Tags may be predictive, but only rushed protocol changes are automatically invalid comparisons. |
| **LOOK-DON’T-ACT** | Define what “lifts rising approximately 4% per session” measures and whether set-count/load/window changes are embedded. | A true standardized 4% signal should overwhelm noise; a derived estimate may not. |
| **LOOK-DON’T-ACT** | Identify any reset that prescribed below a confirmed maxed-ladder delivery and any volume change that erased the strength window. | These are direct coherence conflicts, but exact affected lifts must be verified. |
| **LOOK-DON’T-ACT** | Check rest times, warm-up, ROM, assistance, machine seat/pin setup, and rep acceptance on record/stall sessions. | Apparent strength change may be protocol drift. |
| **LOOK-DON’T-ACT** | During the current deficit, plot standardized performance against body-mass trend and phase without forcing a phase coefficient. | Green rising data argue against a preemptive phase rule; the athlete’s trajectory can test interaction later. |

## 6. Bottom-line specification guidance

If the athlete accepts only the audit’s highest-certainty findings, the eventual specification should say:

- Double progression remains the interface, with no superiority claim.
- The Nuzzo/Epley validation language is removed.
- The selected-max anchor is prohibited for stall detection.
- A stall is a probabilistic signal from comparable observations and triggers diagnosis.
- Records compare new and old uncertainty, include set covariance, and remain provisional/reversible when uncertainty is unresolved.
- Rest, warm-up, ROM, technique, and machine setup define the strength-test protocol.
- Estimated-food quality cannot invalidate strength observations.
- Progression targets remain identical across the running failure A/B.
- Deficit/surplus is diagnostic context, not a fixed progression multiplier.
- Reset size, rebuild duration, hot-opener count, exact RIR step, +1 window buffer, four-session slope threshold, and structural pacing remain UNDERDETERMINED pending athlete calibration or owner policy.

That package follows the governing test: it removes typed constants that override green data while retaining limits that arise from measured resolution.

## 7. Full citations, populations, and preprint status

1. **Plotkin D, Coleman M, Van Every DW, et al.** “Progressive overload without progressing load? The effects of load or repetition progression on muscular adaptations.” *PeerJ*. 2022;10:e14142. [DOI/full text](https://peerj.com/articles/14142/). **Population:** 38 completing resistance-trained young adults, men and women; eight-week lower-body program. **Preprint:** No; peer-reviewed version of record.

2. **Chaves TS, Scarpelli MC, et al.** “Effects of Resistance Training Overload Progression Protocols on Muscle Strength and Muscle Cross-Sectional Area.” *International Journal of Sports Medicine*. 2024. [PubMed](https://pubmed.ncbi.nlm.nih.gov/38286426/) [DOI](https://doi.org/10.1055/a-2256-5857). **Population:** 39 untrained young men and women; randomized within-person leg-extension design; ten weeks. **Preprint:** No; peer-reviewed.

3. **Moesgaard L, Beck MM, Christiansen L, Aagaard P, Lundbye-Jensen J.** “Effects of Periodization on Strength and Muscle Hypertrophy in Volume-Equated Resistance Training Programs: A Systematic Review and Meta-analysis.” *Sports Medicine*. 2022;52:1647–1666. [PubMed](https://pubmed.ncbi.nlm.nih.gov/35044672/) [DOI](https://doi.org/10.1007/s40279-021-01636-1). **Population:** 35 studies; trained and untrained healthy participants; volume-equated programs. **Preprint:** No; peer-reviewed.

4. **Zhang Z, Ya X, Zhao X, Liu Z, Luo J, Liu Y, Bu Y.** “Comparison of linear and undulating periodization resistance training on athletic capacities and health promotion: a systematic review and meta-analysis.” *Frontiers in Public Health*. 2026;14:1707627. [Full text](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2026.1707627/full). **Population:** 29 studies, 704 participants aged approximately 14–80; trained and untrained, both sexes, with trained subgroup analyses. **Preprint:** No; peer-reviewed.

5. **Hickmott LM, Chilibeck PD, Shaw KA, Butcher SJ.** “The Effect of Load Autoregulation on Maximal Strength Gain: A Systematic Review and Meta-analysis.” *Sports Medicine - Open*. 2022;8. [DOI](https://doi.org/10.1186/s40798-021-00404-9). **Population:** 15 studies, predominantly resistance-trained/athletic participants; subjective and objective autoregulation. **Preprint:** No; peer-reviewed.

6. **Helms ER, Byrnes RK, Cooke DM, et al.** “RPE vs. Percentage 1RM Loading in Periodized Programs Matched for Sets and Repetitions.” *Frontiers in Physiology*. 2018;9:247. [Full text](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2018.00247/full). **Population:** 21 resistance-trained men; eight weeks. **Preprint:** No; peer-reviewed.

7. **Larsen S, Kristiansen E, van den Tillaar R.** “The use of rating of perceived exertion in resistance training prescription: a systematic review.” *PeerJ*. 2021;9:e10663. [Full text](https://peerj.com/articles/10663/). **Population:** 14 studies, 356 participants; mixed training status and resistance-training applications. **Preprint:** No; peer-reviewed.

8. **Bartolomei S, Laterza F, Latini D, Hoffman JR.** “Autoregulation Does Not Provide Additional Benefits to a Mixed Session Periodized Resistance Training Program in Trained Men.” *Journal of Strength and Conditioning Research*. 2024;38(9):1535–1542. [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC11343444/) [DOI](https://doi.org/10.1519/JSC.0000000000004836). **Population:** 24 resistance-trained men; ten weeks, five sessions per week. **Preprint:** No; peer-reviewed.

9. **Nuzzo JL, Pinto MD, Nosaka K, Steele J.** “Maximal Number of Repetitions at Percentages of the One Repetition Maximum: A Meta-Regression and Moderator Analysis of Sex, Age, Training Status, and Exercise.” *Sports Medicine*. 2024;54:303–321. [DOI/full text](https://link.springer.com/article/10.1007/s40279-023-01937-7). **Population:** 952 first-set repetitions-to-failure tests, 7,289 people; 66% male, 60% resistance-trained; exercise mix dominated by bench and leg press. **Preprint:** No; peer-reviewed.

10. **Halperin I, Emanuel A, Bland N, et al.** “Accuracy in Predicting Repetitions to Task Failure in Resistance Exercise: A Scoping Review and Exploratory Meta-analysis.” *Sports Medicine*. 2022;52. [PubMed](https://pubmed.ncbi.nlm.nih.gov/34542869/) [DOI](https://doi.org/10.1007/s40279-021-01559-x). **Population:** 12 studies, 414 participants, 262 effects; mixed training status, exercises, loads, and set positions. **Preprint:** No; peer-reviewed.

11. **Grgic J, Schoenfeld BJ, Orazem J, Sabol F.** “Effects of Resistance Training Performed to Repetition Failure or Non-Failure on Muscular Strength and Hypertrophy: A Systematic Review and Meta-analysis.” *Journal of Sport and Health Science*. 2022;11:202–211. [Full text](https://www.sciencedirect.com/science/article/pii/S2095254621000077). **Population:** 15 studies in healthy young adults; trained and untrained subgroup analyses. **Preprint:** No; peer-reviewed.

12. **Wu et al.** “Effects of resistance training to muscle failure versus non-failure on strength, hypertrophy and muscle architecture in adults: a systematic review and meta-analysis of randomized trials.” *BMC Sports Science, Medicine and Rehabilitation*. 2026. [DOI/full text](https://link.springer.com/article/10.1186/s13102-026-01861-z). **Population:** 20 randomized trials, 556 adults; 203 trained and 353 untrained. **Preprint:** No; peer-reviewed.

13. **Pancar Z, et al.** “Effects of deload periods in resistance training on muscle hypertrophy and strength-endurance in untrained young men using a randomized within-subject design.” *Scientific Reports*. 2026. [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13031491/). **Population:** 19 untrained young men; eight weeks; within-person limb assignment. **Preprint:** No; peer-reviewed version of record. An earlier protocol/accepted manuscript existed, but this audit uses the published article.

14. **Coleman M, et al.** “Gaining more from doing less? The effects of a one-week deload during supervised resistance training on muscular adaptations.” *PeerJ*. 2024;12:e16777. [Full text](https://peerj.com/articles/16777/) [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10809978/). **Population:** 39 resistance-trained men and women; nine weeks. **Preprint:** No; peer-reviewed.

15. **Bell L, et al.** “Integrating Deloading into Strength and Physique Sports Training Programmes: An International Delphi Consensus Approach.” *Sports Medicine - Open*. 2023. [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC10511399/). **Population:** International coach/athlete expert panel; no adaptation trial. **Preprint:** No; peer-reviewed consensus.

16. **Mitter B, et al.** “The Reliability of Estimating Repetitions to Failure and Repetition Maximums at Different Relative Loads in Trained Men.” *PLOS ONE*. 2022;17:e0268074. [Full text](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0268074). **Population:** 24 resistance-trained men; first-set tests at 70%, 80%, and 90% 1RM. **Preprint:** No; peer-reviewed.

17. **Weir JP.** “Quantifying Test-Retest Reliability Using the Intraclass Correlation Coefficient and the SEM.” *Journal of Strength and Conditioning Research*. 2005;19(1):231–240. [PubMed](https://pubmed.ncbi.nlm.nih.gov/15705040/). **Population:** Methodological/statistical paper with sport-science applications; not an intervention population. **Preprint:** No; peer-reviewed.

18. **American College of Sports Medicine; Ratamess NA, et al.** “Progression Models in Resistance Training for Healthy Adults.” *Medicine & Science in Sports & Exercise*. 2009;41(3):687–708. [PubMed](https://pubmed.ncbi.nlm.nih.gov/19204579/). **Population:** Narrative position stand for healthy adults, including novice through advanced lifters; not a validation trial of two-for-two. **Preprint:** No; peer-reviewed position stand.

19. **Currier BS, D’Souza AC, Fiatarone Singh MA, et al.** “American College of Sports Medicine Position Stand. Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews.” *Medicine & Science in Sports & Exercise*. 2026. [PubMed](https://pubmed.ncbi.nlm.nih.gov/41843416/) [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/). **Population:** Overview of 137 systematic reviews and more than 30,000 healthy adults; not specific to advanced machine-trained lifters. **Preprint:** No; peer-reviewed position stand.

20. **Craven J, McCartney D, Desbrow B, et al.** “Effects of Acute Sleep Loss on Physical Performance: A Systematic and Meta-Analytical Review.” *Sports Medicine*. 2022;52. [PubMed](https://pubmed.ncbi.nlm.nih.gov/35708888/) [DOI](https://doi.org/10.1007/s40279-022-01706-y). **Population:** 69 studies, 227 outcomes; strength subset 25 studies/289 participants; samples predominantly male, mixed training status. **Preprint:** No; peer-reviewed.

21. **López P, Radaelli R, Taaffe DR, et al.** “Resistance Training Load Effects on Muscle Hypertrophy and Strength Gain: Systematic Review and Network Meta-analysis.” *Medicine & Science in Sports & Exercise*. 2021;53. [PubMed](https://pubmed.ncbi.nlm.nih.gov/33433148/) [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8126497/). **Population:** 28 studies, 747 healthy adults; 21 studies untrained, none highly trained; sets generally to failure. **Preprint:** No; peer-reviewed.

22. **Wolf M, Androulakis-Korakakis P, Fisher JP, et al.** “Partial vs Full Range of Motion Resistance Training: A Systematic Review and Meta-analysis.” *International Journal of Strength and Conditioning*. 2023. [Full text](https://journal.iusca.org/index.php/Journal/article/view/182). **Population:** 23 studies; trained and untrained healthy participants, with limited trained lengthened-partial evidence. **Preprint:** No; peer-reviewed.

23. **Grgic J, Lazinica B, Schoenfeld BJ, Pedisic Z.** “Test–Retest Reliability of the One-Repetition Maximum (1RM) Strength Assessment: a Systematic Review.” *Sports Medicine - Open*. 2020;6:31. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32681399/) [DOI](https://doi.org/10.1186/s40798-020-00260-z). **Population:** 32 studies, 1,595 participants; trained and untrained, both sexes, young through older adults. **Preprint:** No; peer-reviewed.

24. **Singer A, et al.** “Give it a rest: a systematic review with Bayesian meta-analysis on the effect of inter-set rest interval duration on muscle hypertrophy.” *Frontiers in Sports and Active Living*. 2024;6:1429789. [Full text](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1429789/full). **Population:** Nine longitudinal studies; healthy adults, limited resistance-trained evidence. **Preprint:** No; peer-reviewed.

25. **Schoenfeld BJ, Pope ZK, Benik FM, et al.** “Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy in Resistance-Trained Men.” *Journal of Strength and Conditioning Research*. 2016;30(7):1805–1812. [PubMed](https://pubmed.ncbi.nlm.nih.gov/26605807/). **Population:** 21 resistance-trained young men; eight weeks. **Preprint:** No; peer-reviewed.

26. **Ribeiro B, et al.** “The Role of Specific Warm-up during Bench Press and Squat Exercises: A Novel Approach.” *Journal of Men’s Health*. 2021. [Full text](https://www.jomh.org/articles/10.31083/jomh.2021.069). **Population:** 34 resistance-trained men; acute randomized crossover. **Preprint:** No; peer-reviewed.

27. **Pelland JC, et al.** “Resistance Training Dose-Response Meta-Regressions Exploring the Effects of Weekly Volume and Frequency on Muscle Hypertrophy and Strength.” *Sports Medicine*. 2026. [DOI/full text](https://link.springer.com/article/10.1007/s40279-025-02344-w). **Population:** 67 studies, 2,058 predominantly young male participants; training status adjusted, with mixed experience. **Preprint:** No; peer-reviewed.

28. **Murphy C, Koehler K.** “Energy Deficiency Impairs Resistance Training Gains in Lean Mass but not Strength: A Meta-analysis and Meta-regression.” *Scandinavian Journal of Medicine & Science in Sports*. 2022;32:125–137. [Publisher](https://onlinelibrary.wiley.com/doi/10.1111/sms.14075) [PubMed](https://pubmed.ncbi.nlm.nih.gov/34623696/). **Population:** Randomized resistance-training trials lasting at least three weeks; predominantly sedentary/untrained adults, limited experienced-lifter evidence. **Preprint:** No; peer-reviewed.

29. **Bao J, Liu X, Huang Y, Liu X, Wang Z.** “Relative effectiveness of different resistance training modalities on lower-body strength and explosive power: a systematic review and network meta-analysis.” *Frontiers in Physiology*. 2026;17:1823323. [Full text](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2026.1823323/full). **Population:** 27 randomized trials, 694 healthy physically active participants spanning adolescents, students, novice lifters, trained athletes, and sport populations; lower-body strength/power only. **Preprint:** No; peer-reviewed.

30. **Bell L, Ruddock A, Maden-Wilkinson T, Rogerson D.** “Overreaching and Overtraining in Strength Sports and Resistance Training: A Scoping Review.” *Journal of Sports Sciences*. 2020. [Accepted manuscript](https://shura.shu.ac.uk/26176/1/Overreaching%20and%20Overtraining%20in%20Strength%20Sports%20and%20Resistance%20Training.%20A%20Scoping%20Review.pdf). **Population:** 47 heterogeneous papers in weightlifters, other strength-sport athletes, and resistance-training populations; cohorts generally 1–43 and predominantly male. **Preprint:** No; peer-reviewed article (linked file is the accepted manuscript).

## Methodological notes and limits

- This is a targeted independent audit, not a preregistered systematic review. Searches prioritized direct comparisons, current systematic reviews/meta-analyses, reliability/change-detection methods, and trained populations.
- Confidence intervals are reported wherever the source supplied them. The Murphy and Koehler intervals are explicitly labelled approximate reconstructions because the article abstract reports effect size and p value but not the interval.
- The Nuzzo interpolation, Epley comparison, max-selection expectation, session-covariance examples, and Monte Carlo stall probabilities are reviewer calculations. They are not attributed to the cited studies.
- The athlete-specific calculations assume the reported 0.77 value is on the relevant rep scale. The LOOK-DON’T-ACT checks must resolve its definition before implementation.
- All cited sources are published, peer-reviewed versions of record or peer-reviewed position/consensus papers. No preprint is used as outcome evidence.
- Evidence on advanced, machine-dominant, hypertrophy-trained men remains limited. UNDERDETERMINED constants should remain owner policies or be calibrated from this athlete rather than dressed as universal physiology.
