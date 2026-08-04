# Research Brief — Prep Ledger

**Read this before running any new research.** GOALS.md says to extend prior work rather
than restart it. This file is that prior work.

Everything here was established in a deep audit session on 2026-07-29 covering roughly
ten evidence reviews. Each entry gives the finding, the number, the citation, and — most
importantly — **what the app was doing wrong before**, so the same mistake is not
re-derived.

**The single most useful section is [NEGATIVE FINDINGS](#negative-findings): things with
NO evidence behind them.** Nine rules were retired from this app for that reason. If a
future session is tempted to add one back, the reason it went is recorded there.

---

## HOW TO USE THIS FILE

- A claim in the app must trace to a line in here, or to the athlete's own data, or it
  should not be in the app. GOALS.md: "The current implementation does X" is not evidence.
- Effect sizes are given because they decide whether something is worth building. Pelland
  2025's smallest detectable effect for hypertrophy is **2.05%**. A recommendation whose
  modelled effect is smaller than that is below the noise floor of its own source and must
  not ship.
- Population flags matter enormously in this literature. Most large pro-intervention
  effects are in **untrained** subjects; the trained-subject replications are mostly null.
  Where a source population is not lean trained males, it says so.

---

## 1. PROGRESSION AND RECORDS

**A new best is confirmed against measurement error, not against sleep.**

- The athlete's own set-to-set spread, measured from repeats at identical load:
  **±0.77 reps** (n=31 paired sets). Published SEM for reps-to-failure in trained lifters
  is 0.7–1.1 reps (**Mitter et al. 2022**, n=24 resistance-trained, sessions a week apart,
  ICC 0.82–0.86). His number sits mid-range.
- A +1 rep "record" is inside that. So confirmation is required — but universally, not for
  a sleep-selected minority. This is the **ACSM two-for-two rule** (Ratamess 2009), the
  only published precedent, which carries no readiness qualifier.
- Load: **Grgic et al. 2020** (32 studies, 1,595 participants) put trained 1RM test-retest
  CV at a median 3.3%, so a 5 lb jump on a 160 lb machine (3.1%) is inside one standard
  error too.
- Implementation: `typicalError()`, `beatsNoise()`. A session clearing the old line by two
  standard errors of the session total banks immediately.

**Sleep does not gate progression.**

- **Craven et al. 2022** (69 studies, 959 participants): acute sleep loss costs **−2.85%**
  on strength — smaller than the 1.8–3.3% test-retest CV.
- The subgroup matching this athlete (late bedtime, not early waking) is **−5.85%,
  95% CI −13.4 to +1.66, p=0.125** — not distinguishable from zero. Early waking is the
  reliable subgroup (−7.39%, CI −10.1 to −4.66).
- **Knowles et al. 2022**: nine consecutive nights at 5 h; volume load fell **under 1%**.
- **Gong et al. 2024**: start-of-night restriction d = −0.25 (95% CI −0.53 to +0.04), NS.
- RIR autoregulation is the readiness method with actual outcome evidence:
  **Helms et al. 2018** ES 0.48, 72% likelihood of benefit; **Larsen et al. 2021** ES
  0.51–0.64 across 14 studies.
- The old gate (3 consecutive nights ≥7.5 h) opened on **3 of his 42 nights** and produced
  **zero clean sessions ever**. A flag that fires 93% of the time is a constant.

**Where the sleep flag now earns its keep:** a short-sleep session cannot count toward a
STALL, so he is never deloaded for a bad night. The thresholds are `DEBT_LAST_H` 6.5 and
`DEBT_MEAN3_H` 7.0, chosen because that is where the performance literature lives —
Craven's protocols run 3–5.5 h, not 7.

**The separate sleep question — duration in a deficit — is real and belongs to nutrition,
not the session.** **Nedeltcheva et al. 2010**: 5.5 h vs 8.5 h during energy restriction
shifted **60% more of the loss onto fat-free mass**. ⚠ Overweight non-athletes, protein
fixed. His 7.5 h target stands on this, not on session performance.

---

## 2. VOLUME AND SET COUNTING

**Pelland et al. 2025** (*Sports Med*), 67 studies, 2,058 participants, 79.1% male, mean
age 25.2 — the dose-response backbone of this app.

- Return per set is highest at **5–10 weekly sets**, intermediate 11–18, lower above.
- Marginal slope **0.24% per set (95% CrI 0.15–0.33)** at the average 12.25 fractional sets.
- **Smallest detectable effect for hypertrophy: 2.05%.** Use this as a shipping gate.
- Minimum effective dose: **4 fractional sets/week.**
- **Frequency → hypertrophy: β = 0.32%/session (95% CrI −0.14 to 0.82)** — contains null.
  Frequency is a strength lever (β = 3.27%, CrI 2.74–3.84), not a size lever. 2×/week per
  muscle is correct and needs no change.

**Half-credit for indirect sets is CORRECT — this was audited and I was wrong to doubt it.**
Pelland explicitly tested direct=1/indirect=0.5 ("fractional") against direct-only and
total, and made fractional the **primary** method; Bayes factors favour it over both
(2×logBF 9.5–46). Their worked example matches this app's rule verbatim.

⚠ **Comparability trap:** earlier bands (Schoenfeld 2017's "10+", Baz-Valle 2022's "12–20")
counted everything as 1.0. Quoting them next to a fractional count **understates**. Convert
(`total = fractional + 0.5 × indirect`) or quote Pelland's tiers.

**Muscles with separately-trained heads get separate buckets.** Pooling the three deltoid
heads produced a "17" comparable to no published band and generated a reallocation
recommendation below the literature's own noise floor. `programmeVolume()` buckets by
`head || mg`; `indirectOnly` marks buckets fed solely by what compounds lend.

**Retention is cheap; growth is expensive — AND THE APP DID NOT KEEP THIS.** This entry
already existed when `volumeImbalance()` was still preparing to propose **+7 weekly sets on
hamstrings** to a man in a deficit. The finding was written down and the code ignored it.
That is this file's whole reason for existing; see RECURRING FAILURE MODES.

- **Roth et al. 2023** (*Scand J Med Sci Sports*), n=38 resistance-trained males, ≤25% BF,
  6 wk at a **30 kcal/kg deficit** with protein **2.8 g/kg FFM** — close to Joe's exact
  situation. High volume (5 sets/exercise, **~20 weekly sets** on quads) vs moderate
  (3 sets, **~12**). Lean mass **−0.51 kg vs −0.92 kg, NOT significant**; **no difference
  in muscle thickness**; comparable total weight loss (~1.7 kg) and similar load
  progression. Title states the finding: *volume does not influence lean mass preservation
  during energy restriction*.
- **Bickel et al. 2011** (n=70; 39 young 20–35, 31 older 60–75). 16 wk training, then 32 wk
  at a reduced dose. Young adults held thigh lean mass on **one-ninth** of the original
  volume (1 day/wk, **1 set**/exercise) and *gained* strength. One-third also held.
  ⚠ Older adults could not hold mass on either dose — do not generalise across age.
- Practical synthesis: growth wants ~9–18 weekly sets; **maintenance runs on ~2–5.**

**⇒ THE RULE THIS IMPLIES, now enforced in code.** Pelland's 6–12 band is a **growth**
dose-response measured in people eating enough to build. It is the wrong yardstick for a
man in a deficit, where the goal is retention and retention is not volume-sensitive.
`volumeImbalance()` therefore returns `cutting` and `actionable`: during a deficit the gap
is **detected and filed with its citations, never proposed**, and the proposal only fires
once `targets.exitStart` is set. Adding sets in a deficit costs recovery he has less of and
session time he has to find, for an effect the direct evidence cannot detect.

**Do not ramp volume across a block.** **Barsuhn et al. 2025** (trained males, +30%/+60% vs
maintenance): maintenance produced the **greatest** 1RM strength, no group differences in
size. **Enes et al. 2024** (n=31, 5.1 yr trained): clear dose-response for strength, **no
between-group difference in CSA**.

---

## 2b. EXERCISE SELECTION — THE LARGEST TRAINING LEVER, AND HIS IS ALREADY RIGHT

For a **biarticular** muscle the joint you are *not* training sets the muscle's length, and
length under load is what the growth difference tracks. These dwarf everything the app used
to prescribe:

| comparison | effect | what the app used to fuss over | effect |
|---|---|---|---|
| standing vs seated calf raise | **d = 0.88–1.58** | rep tempo | SMD 0.09 |
| overhead vs pushdown triceps | **d = 0.54–0.61** | accentuated eccentrics | −0.06 |
| seated vs lying ham curl | favours seated | periodisation model | d = −0.02 |
| | | machines vs free weights | −0.055, p=0.751 |

**Audited against his real gym, confirmed by him directly (July 2026):** calf raise is
**standing** with a stretch pause; ham curl is **seated**, hips pinned; leg extension is
**reclined** for max quad stretch. He is on the right side of every one. `exerciseSelection()`
checks this and the TRAIN card says so — an app that only speaks up to correct you teaches
nothing about what to protect.

**Triceps: settled, do not reopen.** He uses a Prime 3-peg (pushdown pattern) rather than an
overhead variation. The peg changes the **resistance profile**, not the **shoulder angle** —
so no peg setting could ever have bought the overhead effect; the old `q_peg` queue item had
those two variables confused. Shown the d = 0.54–0.61 case, he chose to keep the Prime.
Defensible: it is the lift he will actually do, adherence is the largest lever in the
literature, triceps are one muscle of ~10, and his pressing loads them indirectly.

**Consequence worth stating plainly: there is no training-side upgrade left to chase.** The
remaining levers are volume *when he starts building*, and everything on the nutrition side.

---

## 3. NUTRITION

**Protein: one number, every day.**
- **Refalo, Trexler & Helms 2025** (Bayesian meta-regression, 29 studies, n=729
  energy-restricted resistance-trained): per-FFM b = **0.06 (95% HDI 0.01–0.12)**, 99%
  probability positive; per-bodyweight HDI **includes zero**. Scale to lean mass.
- Trend line crosses zero net FFM change at **~2.5 g/kg FFM**.
- Body-fat moderator: **<12.2% b=0.12; 12.2–18.9% b=0.07; >18.9% b=0.03.** He is in the
  MEDIUM band at ~15%. The 3.0 g/kg figure unlocks below 12.2%.
- **Do not vary by day type.** **Moore et al. 2024** (IAAO, n=7 endurance-trained) found
  requirement **HIGHER on rest days**. **Bandegan et al. 2017** (n=8 male bodybuilders,
  13.0±6.3% BF): non-training-day requirement 1.7 g/kg mean, 2.2 upper 95% CI.
- No study has ever tested raising protein on a short-sleep or low-recovery day.

**Energy availability — the convention trap.**
- **EA = (EI − EEE) / FFM where EEE is structured exercise.** IOC 2023 REDs consensus.
  NEAT and walking are NOT in the numerator.
- **Espinar et al. 2026**: swapping structured EEE for activity-induced expenditure dropped
  EA from **~32 to ~20** in the same free-living athletes. Pure bookkeeping.
- On this ledger the same swap runs **29.9 → 24**. Band on the conventional number; show
  the walking-inclusive one as a second convention. **Subtracting steps AND comparing to 25
  is the one thing that is definitely wrong.**
- ⚠ **The 25 threshold is extrapolated, not measured.** **Fagerberg 2018** proposes it from
  Keys 1950, Müller 2015, Pasiakos 2013 and **three n=1 bodybuilder case reports**, and says
  plainly no controlled male threshold study exists. IOC 2023 declines a cut-off and gives
  males **~9–25**. **Guisado-Cuadrado et al. 2026** (13 studies, n=145) found testosterone
  fell in only 50% of interventions and identified **no threshold**.

**The calorie floor is derived, not authored.**
- Checked ACSM/AND/DC 2016, IOC 2023 REDs, ISSN diets stand, Helms 2014 — **not one
  contains an absolute kcal floor for an athlete.** All index to fat-free mass.
- `floor = 25 × FFM_kg + net EEE` → **~1,750** for him, ABOVE the 1,700 that was hardcoded.
- ⚠ The 1,200/1,500 "minimums" everyone repeats are **not a micronutrient finding**. They
  are arithmetic from applying a 500–750 kcal deficit to a typical sedentary adult in the
  2013 AHA/ACC/TOS obesity guideline, and carry **no independent evidence grade**. No study
  establishes an intake below which a well-built diet cannot meet micronutrient needs.
- **The rate cap should bind before the floor.** At 1,700 he would run 1.04 %BW/wk, past
  the ACSM ≤1%/wk line. A floor that fires routinely means the rate target is misconfigured.

**Deficit magnitude is the lean-mass variable.**
- **Murphy & Koehler 2022** (*Scand J Med Sci Sports*), meta-regression: lean mass in
  deficit vs balance **ES −0.57/−0.58, p=0.02**; strength **ES −0.31, p=0.28**. Coefficient
  **−3.1×10⁻⁴ per kcal/day**; **~500 kcal/day prevented lean-mass gains.**
- ⚠ Population is mean age 51–60, predominantly women, largely previously sedentary. Treat
  as directional.
- **Consequence: strength holding up is NOT evidence of muscle retention.** The paper's own
  framing is that deficits impair lean mass but *not* strength. Never present a held lift as
  proof of a held muscle.

**Energy density of tissue lost: ~3,800 kcal/lb, not 3,500.** Wishnofsky's 1958 figure is
arithmetically equivalent to assuming 23% of loss is lean — a sedentary partitioning. For a
lean high-protein training male ~87% is fat. **Hall 2008**: fat 4,282 kcal/lb, lean 816.

**THE THERMODYNAMIC CHECK.** If implied deficit per pound exceeds the energy density of
pure lipid, the model is claiming the impossible. This is what caught the lean-mass drip:
the app implied **4,402 kcal/lb** against 4,282 in pure fat. `observedTDEE` now carries
`impliedPerLb` and `impossible` so the check runs continuously.

**Lean mass in a deficit: assume FLAT, never positive.**
- **Roth et al. 2022** (*EJAP*), the closest population match — trained males, **14.9% BF**,
  6.0 yr trained, 3.06 g/kg FFM protein: median **−0.11 lb/wk**, mean −0.34.
- **Roth et al. 2023** (n=38 trained males, 2.8 g/kg FFM): 0.5–0.9 kg lean lost in 6 weeks.
- **Forbes partitioning** (via Hall 2007): at ~11 kg fat mass the untreated baseline is
  **49% of loss from fat-free mass**. Leanness is a headwind.
- The two studies showing gains are population mismatches: **Longland 2016** (overweight,
  explicitly untrained, novel stimulus) and **Garthe 2011**'s slow arm (elite athletes newly
  added to a strength programme, 1.6 g/kg, n≈6 men).
- `model.drip` is **0.0** and must stay there absent a measurement. Body fat is reported as
  a **band** widening from the anchor, because a coach's-eye anchor carries ±3–4 points that
  never wash out.

**Rate of loss should be expressed in %bodyweight, not pounds.** An absolute band against a
shrinking denominator tightens as he leans — exactly backwards. **Garthe et al. 2011**: the
0.7%/wk arm **gained 1.7% lean mass** while the 1.0%/wk arm **lost 2.0%**, on identical
total weight lost.

---

## 4. TRAINING MECHANICS

**Exercise selection for biarticular muscles is the only large effect in this area.**
A muscle crossing two joints has its length set by the joint you are *not* training.

| Comparison | Effect | Source |
|---|---|---|
| Standing vs seated calf raise | gastroc **+9–12% vs +0.6–1.7%**, d = **0.88–1.58** | Kinoshita/Maeo 2023, n=14 within-person MRI ⚠ untrained |
| Overhead vs pushdown triceps | long head **+28.5% vs +19.6%**; whole **+19.9% vs +13.9%**, d = 0.54–0.61 | Maeo et al. 2023, n=21 within-subject |
| Seated vs lying ham curl | direction established, magnitude not retrieved | Maeo et al. 2021 |
| Leg extension hip angle 40° vs 90° | rectus femoris BF>100; vastus lateralis BF=0.07 (no difference) | Larsen et al. 2024, n=22 ⚠ untrained |

Mechanism (**Pedrosa, Pereira & Kassiano 2026**): the advantage appears "when there is a
relevant external torque in the lengthened position." **Loaded** length, not length alone.

**Rep ceilings are arbitrary; window WIDTH is mechanical.**
- Hypertrophy is indifferent from ~5–30 reps at matched proximity to failure.
  **Schoenfeld 2017** (21 studies, all to failure): high vs low load ES 0.53 vs 0.42, p=0.10.
  **López 2021** (28 studies, n=747): no differences, p=0.113–0.469.
- Fibre type does not justify per-muscle rep ranges: **Schoenfeld 2020** found soleus and
  gastrocnemius grew the same regardless of load. This kills "calves need high reps".
- **Reps lost on a load jump ≈ (top + 30) × step/(load + step)** — roughly **0.4 reps per 1%
  of load**. Derived from **Nuzzo et al. 2024** (*Sports Med*, 952 reps-to-failure tests,
  7,289 individuals, 269 studies, 60% trained). Epley-derived MAE 0.31 reps; **Brzycki
  underestimates ~40% and is not used.**
- **ACSM 2009** asks for 2–10% increments, **lower on small-muscle exercises**. His fixed
  plates deliver the inverse: 12.5% on a rear-delt fly, 1.6% on calves.
- ⚠ **There is NO published guidance on rep-window width in double progression.** The
  formula in `windowFor()` is derived, not cited. Say so wherever it surfaces.

**Proximity to failure is the training variable with the dose-response.**
**Refalo et al. 2023** (15 studies): set failure vs non-failure ES 0.19 (95% CI 0.00–0.37,
p=0.045); momentary failure vs non-failure ES 0.12 (CI −0.13 to 0.37, NS). **Refalo 2024**
meta-regressions: hypertrophy slope on RIR negative with CI excluding null; strength slope
CI contains null. **Lasevicius 2019**: light sets *must* reach failure (2.8% vs 7.8% CSA);
heavy sets need not.

---

## 5. THE DIET EXIT

**Reverse dieting is not supported.** Exactly one controlled trial exists and it is a
conference abstract; the reverse-dieting arm produced **numerically the most** weight
regain of three arms.

**Adaptive thermogenesis recovers within ~2 weeks of restoring intake** — which removes the
entire rationale for a slow calorie ramp. Plausible magnitude for him: **0–150 kcal/day**,
much of it deficit-contingent rather than permanent.

**Fat overshoot does not occur in athletes.** Meta-analysis of 74 studies: no overshoot; in
strength athletes fat mass was *lower* post-cycle.

**Optimal surplus: 5–10% over maintenance, ~0.25–0.5 %BW/week** — ⚠ evidence is one n=17
8-week trial plus narrative reviews. **Slater et al. 2019** states plainly: *"there are no
rigorously controlled investigations to date that have directly assessed the role of an
energy surplus on resistance training outcomes."*

**Rate of gain for a 6+ year trained male: no longitudinal data exists.** ~2–4 lb lean over
six months is **expert recommendation (Iraki 2019), not measurement**. Do not let anyone
quote "1–2 lb of muscle per month" for this athlete.

**No post-cut rebound.** Not tested. The observational bodybuilder literature shows slow,
incomplete return toward baseline over 5–6 months with strength recovering last
(**Rossow 2013**: strength did not fully recover in 6 months). **Muscle memory does not
apply** — he is training through a deficit, not detraining, and **Rahmati et al. 2022**
(147 studies) found myonuclei are **not** permanent in humans anyway.

**Diet breaks (a full week at maintenance) have replicated ADHERENCE benefits and no
metabolic ones in trained people.** ICECAP (**Peos et al. 2021**, n=61 resistance-trained):
fat mass p=0.321, FFM p=0.309, RMR/leptin/testosterone/free T3 all null; hunger p=0.002,
satisfaction p=0.016. **Weekly refeed DAYS have neither** — see negative findings.

---

## 6. MORNING MONITORING

**Three of five inputs were deleted for firing inside their own measurement noise.**

| Input | App's rule | Actual noise | Verdict |
|---|---|---|---|
| Resting pulse | +5 bpm | CV 8.2% ≈ 4.5 bpm; a 5-sec manual count quantises at **6–12 bpm** | DELETED — and **directionally wrong** |
| Morning temperature | −0.4 °F | within-person SD **0.58 °F** → 0.72 SD → fires ~**24% of mornings** | DELETED |
| Grip strength | −8% | minimal detectable change **~11%** | DELETED |
| Perceived recovery | ≤2 of 5, 5-day baseline | — | **KEPT**, rescaled 0–10, 14-day baseline |
| Soreness | 2 sore mornings blocks volume | — | ITEM kept, **RULE deleted** |

- **Pulse is pointed the wrong way.** IOC 2023 REDs lists **bradycardia** (<40 bpm) as an
  indicator of energy deficiency; elevated resting HR appears nowhere. Buchheit's smallest
  worthwhile change for resting HR is **−2%**.
- **Bellenger et al. 2016 did not analyse resting HR at all** — it examined HRV and
  post-exercise measures. The rule never had the support it was credited with.
- **Temperature has no validated athletic use.** **Lundy/Torstveit 2022** (LEAM-Q, n=310
  male athletes): thermoregulation items **not associated with any clinical marker**.
  Peripheral thermometers have 95% limits of agreement of **±2.6 °F** (Niven 2015, 75
  studies).
- **Grip does not track systemic readiness.** In a direct test, 10×10 back squats moved leg
  extension torque (p=0.03) and jump velocity (p=0.04) while grip did not (p=0.47). ⚠ n=6.
  It is a forearm test that flags the morning after pulling.
- **Perceived recovery is the one with a base.** **Tolusso et al. 2022** (n=11
  resistance-trained men): PRS vs countermovement jump **r = .84**; vs mean bar velocity
  **r = .80**. **Saw, Main & Gastin 2016** (56 studies): subjective measures track training
  load with **superior sensitivity and consistency** to objective ones. ⚠ **Jeffries 2020**
  (21 studies) is the counterweight: single-item measures ranged from no association to
  moderate, and "energy" specifically returned **trivial** associations — hence the rename
  to *readiness to train*.
- **Soreness is a valid load readout and an invalid readiness predictor.**
  **Schoenfeld & Contreras 2013**: poorly correlated with strength loss, ROM, circumference
  and creatine kinase. **Damas et al. 2016**: myofibrillar protein synthesis tracks
  hypertrophy only *after* damage subsides. No trial shows training a sore muscle impairs
  adaptation; the frequency literature points the other way. The old volume-block rule
  suppressed progression in the hardest-trained muscles.

**Do not add HRV.** No study associates HRV with strength or hypertrophy outcomes after a
training programme; consumer PPG MAPE is 17.5% vs 2.16% for a chest strap; and
Bellenger 2016 found resting HRV largely unaffected by overreaching anyway.

**Psychological cost is real and lands on this profile.** **Linardon & Messer 2019**
(n=122 men recruited via fitness social media): calorie-tracking app users vs non-users,
EDE-Q global **d = 0.91**, dietary restraint **d = 1.06**; **38% perceived the app as
contributing to disordered eating**. ⚠ Cross-sectional; direction of causation unknown. But
it makes a non-zero cost against a zero benefit an easy call for the deleted fields.

---

## REPS IN RESERVE — what the evidence supports, and what it does not

Added 2026-08-04. Relevant to `progressStep`, `rirPlan`, and any future proposal to adjust
a reported RIR.

**Direction.** Lifters systematically **underestimate** reps remaining — they stop earlier
than they think. Mean underprediction ~0.95 reps across the literature, individual studies
0.65–1.2. Believing two remain typically means three remain.
https://www.strongerbyscience.com/reps-in-reserve/

**Timing dominates accuracy.** Error falls from roughly 4.8 reps when estimating a third of
the way through a set to about 1.2 reps at 90% through, and from 1.2 reps at 5 RIR to 0.46
at 1 RIR. Accuracy is better in sets of ≤12 reps and on single-joint movements. This is the
evidence behind capturing last-set RIR at the set rather than at lift-done, and behind
dropping the opener prompt.
https://www.ovid.com/jnls/nsca-jscr/fulltext/10.1519/jsc.0000000000002995

**Training status does not clearly help.** Experienced vs novice on back squat: −1.19 vs
−1.25 reps at a 3-RIR target, no significant difference (p > 0.05). n = 8 per group — treat
as "the claim that experience improves accuracy is unsupported", not as proven equivalence.
https://pmc.ncbi.nlm.nih.gov/articles/PMC13215226/

**Reliability of the bias as a personal trait is unsettled.** Paired self-determined-stop
vs true-failure trials reported ICC 0.5 (95% CI 0.03–0.8) in one experiment and 0.96
(0.92–0.98) in another, and a pooled gap of 2.0 reps with a 95% CI of 0.0–4.0. Whether a
personal bias is even stable enough to model is an open empirical question.
https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.565416/full

**What this licenses.** Asking for the last set's RIR at the moment it is banked; treating
the opener as a weak signal; keeping the 0/1/2/3+ scale rather than widening it.

**What it does NOT license.** Silently correcting a logged RIR by a population constant.
The bias is real, but its spread (SD 1.3–2.4 reps) and its uncertain per-person stability
mean applying it to one athlete would be the app inventing a fact about him. Declined by
Joe, Aug 2026.

---

## NEGATIVE FINDINGS

**The most valuable section. Nine rules were retired for having nothing behind them. Do not
re-add these without new evidence.**

1. **The clean-sleep gate on records.** Zero trials have tested damping progression on
   low-readiness days. The gate opened on 3 of 42 nights.
2. **Weekly refeed days.** The only matched-energy RCT in trained people (**Campbell 2020**)
   had its FFM result **overturned on independent reanalysis** (**Peos et al. 2020**, same
   journal — only *dry* FFM differed). **Poon et al. 2025** (12 RCTs, n=881): fat mass
   0.26 kg p=0.38; FFM 0.17 kg p=0.67; RMR benefit in resistance-trained subgroups
   **11 kcal/day, 95% CI −67 to +46, p=0.71**. Leptin, testosterone and free T3 all flat.
   **Henselmans 2022/2026**: no isocaloric carbohydrate study has ever improved strength or
   hypertrophy (2026 meta SMD 0.15, 95% CI −0.10 to 0.40, p=0.230).
3. **"Defend load on a cut."** Folklore. **Carlson et al. 2022** (n=115 trained, 80% vs 60%
   1RM both to failure, 20% deficit) — the only trial to manipulate load under energy
   restriction — found **no difference** in fat or lean mass. Defend *effort*.
4. **Lengthened partials as a system.** **Gschneidner et al. 2025**, randomised across 15
   sites, **n=297**: pre-registered equivalence testing, condition×time −0.032 (arm) and 0
   (thigh) — **practically equivalent** to full ROM. **Wolf et al. 2025** (n=30 trained):
   **Bayes factors 0.16–0.30**, moderate evidence *for* the null. The pattern: large
   pro-lengthened effects are in **untrained** subjects; trained-subject studies are null.
   **Zero ROM studies exist for pectoralis major, deltoid or latissimus dorsi.**
5. **Rep tempo.** **Enes et al. 2025** (Bayesian, 14 studies): between-condition
   **0.09 (95% CrI −0.04 to 0.22)**, trivially favouring **faster**. Anything 2–8 s is fine.
6. **Slow / accentuated eccentrics.** **Zhang et al. 2026** (49 studies, n=773): muscle CSA
   **SMD −0.06 (95% CI −0.47 to 0.36)** while **RPE SMD +1.72**. A fatigue tax with no return.
7. **Periodisation for hypertrophy.** **Grgic et al. 2017** (13 studies): linear vs
   undulating **d = −0.02 (95% CI −0.25 to 0.21)**.
8. **Planned deloads.** **Zero positive RCTs.** **Coleman et al. 2024** (n=39 trained): no
   hypertrophy difference, squat 1RM **−3.6 kg** and isometric **−14.4 N·m** favouring
   *continuous*, plus reduced motivation. **Pancar et al. 2026** (untrained): all
   between-condition CIs include zero.
9. **Machines being inferior to free weights.** **Haugen et al. 2023** (13 RCTs, n=1,016):
   hypertrophy **SMD −0.055, 95% CI −0.397 to 0.287, p=0.751.** The machine-heavy programme
   costs nothing.

**Also with no evidence in either direction, so the app must not assert them:**
paused reps, "constant tension", avoiding lockout (zero chronic trials); optimal number of
exercises per muscle; optimal duration of a build phase; post-cut hypertrophy rebound;
frequency manipulation under energy restriction; raising protein on short-sleep days;
per-muscle dose-response curves (all published bands are whole-body averages); a validated
male EA threshold; the mind-muscle connection in trained lifters (one 8-week untrained
study, never replicated).

---

## RECURRING FAILURE MODES IN THIS CODEBASE

Recorded because they recurred, not because they were interesting.

1. **Authored constants sitting next to derived ones**, inheriting their authority. Eight
   were found: protein 175, steps 16.5k, calories 1,725–1,800, the 7.5 h sleep gate, volume
   band 8–14, rate band 1.0–1.4 lb, 3,500 kcal/lb, lean drip +0.3. Sweep for these
   systematically; do not wait to be asked.
2. **Prose running ahead of arithmetic.** A proposal whose `apply()` did nothing; a Rulebook
   describing an engine that had moved; "45/100" quoting a score the engine had stopped
   computing; "leaner" used to mean "ate less" in an app that tracks lean mass. **Bind text
   to the functions that produce it and test the binding.**
3. **Windows and units that don't match what they're compared to.** TDEE (21-day intake vs
   35-day rate); EA (subtract steps, compare to a threshold built without them); the rate
   band (pounds against a shrinking bodyweight).
4. **Thresholds nobody validated against the data they would meet.** The sleep gate fired
   3/42; MIN_ASSERTIONS sat at 380 while the suite ran 591; the temperature rule would fire
   24% of mornings.
5. **Data collected and discarded.** 28 RIR ratings logged, zero used — the entry form wrote
   to `rirSets[0]` while the engine read `rirSets[last]`, and a debt short-circuit sat above
   every RIR branch.
6. **Insertion order mistaken for date order.** `dailyLogs` is a plain object; sort before
   any `.slice()`.

---

## WHAT IS STILL OPEN

- **Caffeine, alcohol and creatine** — all three are logged; none has been researched. He
  runs 400 mg caffeine and his median sleep is 7.0 h against a 7.5 h target.
- **Waist measurement** — the Rulebook claimed "waist beats the scale" with zero entries
  logged. Whether it is worth collecting is unresearched.
- **Rest intervals** — the 150 s/90 s prescription predates this audit.
- **The build-phase programme structure** beyond volume and surplus.
