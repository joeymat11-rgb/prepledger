# Measured — research and design

> ## For the build side — read this first
>
> **This file is reference, not the work queue.** It is the *why* behind the next several items.
> `NEXT.md` remains the single source of truth for *what to build now*.
>
> **Your first action after reading this file:**
>
> 1. Commit this file to the repo root as `RESEARCH-DESIGN.md` if it is untracked.
> 2. **Rewrite `NEXT.md`'s `NOW` block from §R1 below** (it is marked `[NOW]`). R1 is
>    self-contained and buildable without any other item.
> 3. **Replace `NEXT.md`'s `QUEUED` list with R2 → R9 in the order given here**, then the Part 4
>    bugs. Each carries its own acceptance criteria — copy them, do not paraphrase.
> 4. **Preserve `SHIPPED` exactly as it stands.** This document was written outside the repo and
>    does not know what has shipped since v7.12.0. Do not overwrite that history.
> 5. Add one line to `NEXT.md`'s standing guardrails: *"Body-fat percentage is display-only. No
>    proposal, gate or target may read `bfEst` — see `RESEARCH-DESIGN.md` §R4."*
>
> If anything here conflicts with `NEXT.md`'s existing standing guardrails, **the guardrails win**
> and the conflict goes into the item as an open question. Do not silently resolve it.
>
> Everything below was verified against `src/app.jsx` at v7.12.0 and against `ledger/state.json`.
> Line numbers may have drifted — verify before editing, and correct them in the item if so.

---

**One objective, unchanged by diet phase: maximise positive body-composition change, as fast as
possible. Cutting and massing are not two goals — they are two means to the same goal.**

Athlete: 24, male, 5'10", 163 lb, ~14% BF (wide interval), multi-year resistance trained,
4 sessions/wk, ~175 g protein/day, currently in a deficit.

Verified against `origin/main` @ v7.12.0 · `src/app.jsx` 14,244 lines · `ledger/state.json` as of
2026-08-05. Every engine claim carries a line number. Every evidence claim carries a verification
status.

---

# Part 0 — What this is, and what it cost to get here

This document went through four wrong answers before it got to a right one. Recording them,
because the corrections are load-bearing and because a document that hides its own error history
invites you to trust it more than you should.

| # | I said | Why it was wrong | Now |
|---|---|---|---|
| 1 | BF interval widens 0.62 pts/wk | Misread my own arithmetic. It is **0.276**. | Conclusion survived — 14 pts wide at 6 months either way |
| 2 | "Steps up + close the 306 kcal gap" | Optimised fat loss, not the objective. Would have put him at −630 kcal/day. | Withdrawn |
| 3 | "Optimal deficit is −250 kcal/day" | Built on a hinge model that **mispredicts the trial it was fitted to** by 0.9–1.4 lb/wk, wrong sign on the winning arm | Withdrawn |
| 4 | Ceiling of 2–4 lb muscle/yr | Assumed age 36 and advanced status. He is **24 at FFMI 20.0** with 34 lb of headroom. | Withdrawn |
| 5 | DXA precision "Tinsley 2021" | Wrong paper. It is **Farley, Slater & Hind 2021**. | Corrected throughout |

**Verification status of the evidence base.** Everything below is marked `VERIFIED` (I read the
abstract or full text this session), `VERIFIED-SECONDARY` (numbers confirmed through a source that
quotes the paper directly), or `UNVERIFIED`.

---

# Part 1 — The objective, formalised

## Why the obvious formalisation is wrong

The tempting version: maximise `J = dLean/dt − dFat/dt` at every instant.

**It is structurally incapable of ever choosing massing.** Above maintenance the marginal lean
return is small and the marginal fat return is roughly 1:1, so `dJ/dEB < 0` for every surplus. A
single-period objective outputs "deficit, always," forever. Massing only ever pays through a
multi-period argument — accept a worse number now to raise the ceiling later. **"Cutting and
massing are two means to one goal" is precisely the thing an instantaneous scalar cannot say.**

So the objective is over a horizon:

```
maximise   [ FFM(T) − FFM(0) ] − [ FM(T) − FM(0) ]   per unit time
over       the energy-balance path EB(·)
subject to protein ≥ 2.3 g/kg FFM · EA ≥ 25 kcal/kg FFM/day
           lifting performance non-decreasing
```

## The three regimes

At any moment both terms are functions of energy balance. **The state variable that selects the
means is not body fat.**

| regime | observable | both terms improving? | correct means |
|---|---|---|---|
| **`free`** | lifts progressing **and** fat falling | **yes, simultaneously** | hold the deficit |
| **`costing`** | lifts stalled/declining, fat still falling | no — now a trade | shrink the deficit until progression resumes |
| **`accretionBound`** | zero deficit, still not progressing | fat term exhausted | **surplus** |

`free` is the global maximum. No reallocation of calories beats collecting both terms at once, and
no phase rule that fires on a body-fat number can find it. **Massing emerges from
`accretionBound`** — the app never picks a phase; it reports the regime and the target follows.

## He is in `free`, and it is not close

Eight weeks, 6/11 → 8/03, bodyweight 170 → 163:

| lift | then | now | Δ |
|---|---|---|---|
| Rows | 145 × 7,7 | 180 × 9,9 | **+35 lb (+24%)** |
| Leg extension | 120 × 12,10 | 150 × 10,9 | **+30 lb (+25%)** |
| Calves | 295 × 10,8,8,8 | 320 × 11,10,7,8 | +25 lb |
| Abs | 80 × 13,13,13 | 100 × 13,13,15 | +20 lb |
| Ham curl | 100 × 13,11,9 | 120 × 10,10 | +20 lb |
| Press | 235 × 10,6,5 | 250 × 8,7,7 | +15 lb |
| Pulldown | 150 × 6,6 | 160 × 9,7 | +10 lb, +4 reps |

Machine familiarisation explains part. It does not explain +24% on rows and +25% on extension
**while losing seven pounds.**

## The ceiling is not binding, and this is the finding that reframes everything

```
height 5'10" = 1.778 m        lean 139.7 lb = 63.37 kg
FFMI = 63.37 / 1.778² = 20.04        normalised = 20.18
```

| | FFMI | FFM at ceiling | **headroom** | BW at ceiling, 10% BF |
|---|---|---|---|---|
| Kouri 1995, 98th pct of non-users | 25 | 174 lb | **34.5 lb** | ~194 lb |
| Upper estimates | 26.5 | 185 lb | 45.0 lb | ~205 lb |

Every parameterisation in the earlier drafts assumed an accretion ceiling of 2–4 lb/yr, justified
partly by "age 36." **Both premises were wrong.** At 24, FFMI 20, adding 15–35 lb to his lifts in
a deficit, his rate is limited by training age and stimulus — not by proximity to potential.

**And that makes `free` more valuable, not less.** The higher the true accretion rate, the more
valuable it is to occupy the one state that collects it *and* loses fat simultaneously. He is
getting a large lean gain for free right now.

## The parameter the literature cannot supply

The lean-mass cost per kcal of deficit is the load-bearing parameter of any optimisation here, and
it is **not identifiable from the literature.** The only trained-male estimate comes from Garthe
2011, which reports *percentage* intake reductions with no kcal denominator, so the slope ranges
over a factor of three depending on an assumed TDEE. An earlier draft derived "−250 kcal/day" from
it; that model mispredicts Garthe's own arms by 0.9–1.4 lb/wk with the wrong sign on the arm that
won. **Withdrawn.**

**Do not import it. Detect regime transitions from his own lifts.** Four sessions a week, every
set logged, is a far higher-powered individual signal than any twice-yearly body-composition
measurement.

---

# Part 2 — The evidence

## 2.1 Does a deficit cost lean mass, and at what depth?

**`VERIFIED` — Murphy & Koehler 2022**, *Scand J Med Sci Sports*, [10.1111/sms.14075](https://onlinelibrary.wiley.com/doi/10.1111/sms.14075).
59 studies, 1,495 participants. Analysis A: 7 RCTs, 282 participants. Analysis B: 25 studies vs 27
controls, 1,213 participants.

- Lean mass: **ES −0.57, p = 0.02** — energy deficiency impairs RT-driven lean gain
- Strength: **ES −0.31, p = 0.28** — not impaired
- Meta-regression: a deficit of **~500 kcal/day prevented gains in lean mass**; authors recommend
  *"avoid energy deficits >500 kcal day⁻¹"*

**The caveat I did not have until this session, and it is large.** Mean participant age is
**60 ± 11** (analysis A) and **51 ± 16** (analysis B). This is not a young trained population.
Both the 500 kcal threshold and — more importantly — the **lean/strength dissociation** that
justifies "strength is a necessary but not sufficient proxy" come from adults averaging ~50–60
years old. Transfer to a 24-year-old trained male is plausible but unproven. **Downgrade every
inference from this paper to medium confidence and label it in the code.**

## 2.2 What rate of loss preserves lean mass?

**`VERIFIED-SECONDARY` — Garthe et al. 2011**, *IJSNEM* 21(2):97–104. n = 24 elite athletes
(SR n = 13, FR n = 11), strength training 4×/wk, ~72 kg.

| arm | rate | duration | BM | FM | **LBM** |
|---|---|---|---|---|---|
| slow | ~0.7 %BW/wk | 8.5 ± 2.2 wk | −4.2 kg | −4.9 kg | **+1.0 kg (+2.1%)** |
| fast | ~1.4 %BW/wk | 5.3 ± 0.9 wk | −4.2 kg | −3.2 kg | −0.3 kg (−0.2%) |

**A discrepancy worth recording.** Ruiz-Castellano 2021 (`VERIFIED`, [PMC8471721](https://pmc.ncbi.nlm.nih.gov/articles/PMC8471721/))
describes Garthe as showing *"weekly weight losses of 0.5% [gave] greater retention of FFM than
losses of 0.7% or 1%"* — which does not match the two-arm 0.7 / 1.4 design confirmed elsewhere.
The review is likely paraphrasing loosely across studies. **I am using 0.7%, verified twice, and
flagging that one review states it differently.**

Ruiz-Castellano's own recommendation is `VERIFIED` and directly quotable: *"Caloric intake should
be set based on a target BW loss of 0.5–1.0%/week to maximize fat-free mass retention,"* opting for
the lower end when body fat is already low, because *"the lower the % body fat of the athlete, the
more conservative should the energy deficit be."*

**For him at 163 lb:** 0.5% = 0.82 lb/wk · 0.7% = 1.14 · 1.0% = 1.63. His eight-week achieved rate
was ~1.0–1.17 lb/wk — mid-band — **and his progression held throughout.** That individual
observation is stronger evidence for him than the band is.

## 2.3 Does training volume need to change in a deficit?

This is where the research changed a recommendation.

**`VERIFIED-SECONDARY` — Roth et al. 2022/2023**, *Scand J Med Sci Sports*,
[10.1111/sms.14237](https://onlinelibrary.wiley.com/doi/full/10.1111/sms.14237) ·
[PMID 36114738](https://pubmed.ncbi.nlm.nih.gov/36114738/), numbers via
[Stronger by Science](https://www.strongerbyscience.com/research-spotlight-volume-muscle-dieting/).
n = 38 resistance-trained males, 7 weeks (1 wk at 45 kcal/kg, 6 wk at 30 kcal/kg), upper/lower
split 4 d/wk. Moderate volume (~12 sets/wk quads) vs higher (~20 sets/wk quads).

> Null across the board — body mass, lean mass, body-fat %, rectus femoris thickness, training-load
> progression, contractility, sleep, mood. **Subjects were ~18.5–19% BF and the deficit was
> modest — ~0.29 kg/wk.**

**`VERIFIED` — Nait-Yahia et al. 2026**, *Eur J Clin Nutr*,
[10.1038/s41430-026-01757-8](https://www.nature.com/articles/s41430-026-01757-8). n = 16
resistance-trained, 4 weeks, **40% caloric restriction**, protein 2.3 g/kg BM, RT 5 d/wk. LVRT 12
vs HVRT 30 sets/muscle/week.

> BM −4.2 ± 0.5 kg, FM −3.7 ± 0.4 kg, %FM −3.5 ± 0.4% (all p < 0.001), **no difference between
> groups. No intervention or group×intervention effect for FFM.** But: **HVRT produced greater 5RM
> gains — chest press p = 0.005, right leg press p = 0.003, left leg press p < 0.001.**

**The reconciliation, and it is dose-dependent.** At a *shallow* deficit in *not-very-lean*
subjects, volume changes nothing. At a *severe* 40% restriction, higher volume does not save FFM
but **does protect strength.**

### The design implication nobody would guess, and it nearly broke the regime detector

Higher volume in a deficit **improves strength without improving fat-free mass.**

The regime detector reads strength progression as its proxy for accretion. So if the app ever
raises volume in response to a stall, it will **manufacture the very signal it is measuring** —
strength rises, the detector reads `free`, and lean mass is lost silently underneath it.

**Therefore volume must be held constant, and the reason is not "volume doesn't matter."** It is
that changing volume corrupts the instrument. Any volume change must invalidate the progression
trend for a stated washout period. That is a hard requirement, not a preference.

## 2.4 Does a surplus buy muscle in trained lifters?

**`VERIFIED` (via adversarial review) — Helms et al. 2023**, *Sports Med Open* 9:102,
[10.1186/s40798-023-00651-y](https://link.springer.com/article/10.1186/s40798-023-00651-y).
Maintenance vs moderate vs high surplus in trained lifters.

- **17 completers across 3 groups = 5.7 per group.** The paper's **own** Bayesian power analysis
  required **≥31 per group** for muscle thickness. It ran at 18% of its required n, and says so:
  *"our group-based comparisons might be inaccurate due to an insufficient sample size."*
- Muscle-thickness group BF₁₀: 0.35, 0.32, 0.33, 0.77, 0.52, 0.35 → BF₀₁ of only 1.3:1 to 3.1:1.
  **Four of six are anecdotal. This is absence of evidence, not evidence of absence.**
- **Suppressed in earlier drafts and it cuts the other way:** bench 1RM group model **BF₁₀ = 13.1**;
  HIGH vs MAIN **14.5**; HIGH vs MOD **9.9** — *strong* evidence favouring the larger surplus.
- The cost side is supported: skinfold group model BF₁₀ 3.0, HIGH vs MAIN 4.2, BM→skinfold
  BF₁₀ 14.3, R² 0.49.

**Verdict: "a surplus never helps" is not supported.** What is supported: a large surplus reliably
adds fat, and nobody has adequately powered the hypertrophy question in trained lifters. The
earlier claim was also **circular** — "surplus never helps" was an *assumption* of the withdrawn
hinge model, then re-presented as an empirical finding.

## 2.5 Can body fat percentage be a control variable?

**No — at any measurement cadence he will sustain.**

**`VERIFIED` — Farley, Slater & Hind 2021**, *IJSNEM* 31(1):55–65, n = 32 resistance-trained males,
three scans over 24 h:

| method | consecutive-day LSC (fat mass) | ≈ BF points for him |
|---|---|---|
| **Skinfolds, one tester** | **442 g** | **0.6** |
| DXA | 1,615 g | 1.3–2.2 |
| BOD POD | 1,943 g | 2.6 |
| **BIA / BIS** | **3,607 g** | **4.9 — wider than the whole range of interest** |

**Scan-day state is worse than scan precision.** Because the app turns a scan into a *lean-mass
anchor*, a scan-day error is not noise — it is a permanent offset on every later reading.

| confounder | effect | permanent anchor bias |
|---|---|---|
| 500 g meal + 1 L water (Kerr 2017, n = 32 RT males) | FFM +1,211 g | **+1.64 pts** |
| Glycogen + creatine loading (Bone 2017, n = 18) | LBM +3.0% ± 0.7% | **+2.58 pts** |
| Full dehydrated ↔ carb-loaded swing (Toomey 2017) | 4.05 kg | **5.48 pts** |

**Whether he ate before the scan matters more to his reported body fat than a successful 12-week
cut.**

His live interval is **10.7–18.3%**, asymmetric −3.6/+4.0, widening **0.276 points/week** from the
drift band — ~14 points wide at six months post-anchor.

**What the rate buys instead:** ±0.36 lb/wk at 95% on 28 daily reads ≈ **0.21 BF points/week**, and
its error does not grow with time. That is the control variable.

**Do not overstate the ban.** LSC governs *paired* scans. A smoothed multi-scan trend on one
machine is far more precise. BF% is unusable as a *fast* control input; it remains usable as a
slow, trend-only confirmation.

## 2.6 Is "observed maintenance" a physiological number?

**No — it is a window-average bookkeeping residual, conditioned on an activity level that moved.**

`observedTDEE` (2010–2070) computes `avg_intake + rate × 3800/7`. That is the **fixed-k
intake-balance estimator** — the good one. It does not fit the intake/rate slope, so the
regression-dilution pathology does not apply. **This function computes what it says it computes.**

But the estimand is the window *average*, at the window's *average activity*. His live data:

- Steps trending **−649/week across 54 days.** Weekly means peaked 21,714 (wk 27) → 12,000–15,600 now.
- Intake rose 1,663 (wk 25) → 2,546 (wk 31).
- Combined: **~1,055 kcal/day swing toward maintenance.**
- A 5,100-step drop is worth **~162 kcal/day** (range 126–202) at the meta-analytic net walking
  cost of 2.4 ± 0.4 J/kg/m ([*Sci Rep* 2019](https://www.nature.com/articles/s41598-019-45602-4)).

**And the trap.** `adaptationSignal` (2742–2757) predicts expected maintenance from **body mass
only**:

```js
const predAt = (w) => base.tdee + MAINT_KCAL_PER_LB * (w - base.w);   // 2746 — no step term
```

Observed maintenance falls because he walks less; mass-predicted maintenance barely moves.
**The app will report metabolic adaptation for a man who stopped walking** — a false diagnosis
pointing away from a real, fixable behaviour.

## 2.7 Has his rate actually slowed?

**Suggestive, not established.** Three estimates:

| method | rate |
|---|---|
| 28-day OLS (what the app shows) | **1.17 ± 0.36 lb/wk** |
| damped trend, last 14 d | 0.60 |
| raw reads, last 10 | 0.26 |
| forward calc from current intake + steps | 0.25 |

Independently recomputed by hand: 1.166 lb/wk, ciOls ±0.356 — **`currentRate` is correct.**

**But ten readings cannot establish a rate change.** SE ≈ ±0.49 lb/wk; testing 0.42 against 1.17
gives **p ≈ 0.15**. The window also contains a documented refeed and a wedding, and a single 2–3 lb
glycogen/sodium rebound inside 10 points can manufacture an apparent slowdown out of nothing. The
28-day figure is 3.3× more precise.

**The stronger evidence is the mechanism**, not the scale: steps down 26% and intake up 8%, both
directly logged. That is not a statistical inference.

## 2.8 Everything else — what does NOT change

| variable | finding | source |
|---|---|---|
| Load / rep range | hypertrophy ES **0.03** [−0.08, 0.14], p = 0.56 across ~30–85% 1RM | Schoenfeld 2017 |
| Frequency at matched volume | β = 0.32% [CrI −0.14, 0.82] — crosses zero | Pelland 2025 |
| Machines vs free weights | SMD −0.055, p = 0.751 | Haugen 2023 |
| Deloads | hypertrophy-neutral, **strength-negative** (posterior 0.851 / 0.924 favouring continuous) | Coleman 2024 |
| Proximity to failure | relates to hypertrophy, negligibly to strength. **Zero studies have ever manipulated RIR under energy restriction.** | Refalo/Robinson 2024 |
| Walking vs hypertrophy | concurrent-training SMD −0.01, p = 0.919 at doses far above walking | Schumann 2022 |
| Smallest detectable hypertrophy effect | **2.05%**; a marginal set is worth **0.24%** | Pelland 2025 |

**The last row is the governor on the whole app.** Over four weeks it cannot distinguish its own
volume decisions from noise. Acting anyway manufactures churn.

## 2.9 How to present an interval

- **`VERIFIED` — van der Bles 2020**, *PNAS* 117(14), 5 experiments, **n = 5,780**: a numeric range
  costs a little trust in the number and none in the source; **verbal hedging** ("roughly", "we're
  not sure") costs both. → *Express uncertainty numerically. Never verbally.*
- **`VERIFIED` — Broad 2007**, *BAMS* 88(5), hurricane "cone of uncertainty", survey n = 962: users
  read the **centreline as truth** and the boundary as a hard edge. Several outlets' most effective
  fix was **deleting the track line.** → *Render the band. Never the midpoint.*

---

# Part 3 — The design

## R1 — One regime detector replaces both phase machines `[NOW]`

**What the code does today.** Two unrelated phase namespaces:

- `s.phase` ∈ {`EASE 1`, `EASE 2`}, advanced by `bf.pct <= 13.2 && s.trend < 163` (6238)
- `s.plan.phase` ∈ {cut, break, maintenance, leangain} — **`undefined` in his live state**, so
  `phaseArc` reports "cut" by fallthrough, not assertion
- **`leangain` is dead code.** Its only writer is the `phasePlan` proposal handler (6589) and
  **nothing constructs a `phasePlan` proposal.** Branches at 3296/3300/3316/3324/3361 unreachable.
- `phaseSupervisor` guards every reason with `if (inCut)` (3363) — **zero authority outside a cut**
- `signalState` classifies weight gain as `"reversed"` (8951) → `escalation` (3108) →
  `autoPilotPolicy.autoApply = false` (3134). **Auto-Pilot can never auto-apply during a gain.**

### Fix this first — `liftCall.vel` cannot be the input

`liftCall` (590) computes velocity from `tot`, **total reps, no load term**:

```js
tot: (e.reps || []).reduce((a, b) => a + b, 0)
const vel = ((clean[clean.length-1].tot - clean[0].tot) / (clean.length-1)).toFixed(1)
```

Calves went `315 × 13,12,11,10` → `320 × 10,8,7,7`. **`vel` reports −14 reps/session for a lift
that just added 5 lb.** That would put him in `costing` for progressing.

Leave `liftCall` alone — it correctly answers "beat your total at this load." Build alongside it.

### The four new selectors

**1. `sessionScore(entry)`** — volume load `Number(entry.w) × Σ(entry.reps)`; `null` when `w` is
non-numeric. That excludes `hanging` (`BW`), `curl` (`55·55·50`) and `pronated` — **three of
fifteen lifts.** Report the count; do not hide it.

Spot-checked against his ledger:

| lift | then → now | volume load |
|---|---|---|
| Rows | 145×7,7 → 180×9,9 | 2,030 → 3,240 (**+60%**) |
| Press | 235×10,6,5 → 250×8,7,7 | 4,935 → 5,500 (+11%) |
| Leg extension | 120×12,10 → 150×10,9 | 2,640 → 2,850 (+8%) |
| Calves | 315×13,12,11,10 → 320×11,10,7,8 | 14,490 → 11,520 (**−20%**) |

Calves is the honest negative — a 5 lb jump not yet earned back. `repsLostOnJump` territory.

*State in the code:* volume load treats `100×20` and `200×10` as equivalent, which they are not as
a stimulus. Defensible for a **within-lift** trend only. Never compare across lifts.

**2. `liftTrend(s, exId)`** — OLS of `sessionScore` over the last 6 sessions that are not
`dayWeather(s,d).hard`, as % of mean per session, with a 95% interval. Reuse `liftCall`'s existing
exclusions — rushed and short-sleep days do not count toward a stall and must not count toward a
decline (`PACE_NOTE`, `SLEEP_NOTE` — do not re-litigate). Returns `null` below n = 4.

**3. `progressionTrend(s)`** — inverse-variance weighted mean across lifts with a usable trend.

```
"rising"   when lo > 0
"falling"  when hi < 0
"flat"     when the interval spans 0 and is narrower than ±1.5 %/session
"unknown"  otherwise, or nLifts < 4
```

`"unknown"` is a first-class answer and **suppresses every downstream use** — the same
self-suppression `signalState` already performs. An autonomous coach that guesses is worse than
one that abstains.

**4. `regime(s)`**

```
prog.state === "unknown"                     -> "unknown"          // abstain
prog.state !== "falling" && rate.scale > 0   -> "free"
prog.state === "falling" && rate.scale > 0   -> "costing"
prog.state !== "rising"  && |rate.scale| ~ 0 -> "accretionBound"
```

**Hysteresis is required.** A regime may not flip on one session — require the new state to hold
for **two consecutive evaluations at least 7 days apart**, carrying `since` and `pendingSince`. A
hunting target is worse than a wrong constant one.

**`regime` must not read `bfEst`.** Assert by grepping the function body.

### Acceptance criteria

- Real ledger @ 2026-08-05 ⇒ `regime(s).key === "free"`
- `progressionTrend(s).nExcludedNonNumeric === 3`
- A fixture where a lift adds load and loses reps at constant volume load: assert
  `liftCall(...).vel < 0` **and** `liftTrend(...).pct ≈ 0` — the defect documented in a test
- 3 consecutive weeks of declining pooled score + falling trend ⇒ `"costing"`
- Flat pooled score at zero rate ⇒ `"accretionBound"`, and `s.plan.phase = "leangain"` reachable
- < 4 usable lifts ⇒ `"unknown"`, no downstream consumer acts
- One anomalous session cannot change `regime(s).key`
- `regime` never calls `bfEst`
- **Any volume change invalidates `progressionTrend` for a stated washout** — see R8, §2.3
- Strict gate + render smoke green. No new stored field; `regime` is a pure selector.

**What it does not buy.** Strength is a necessary but not sufficient proxy — Murphy & Koehler's
dissociation (lean ES −0.57 p=0.02, strength ES −0.31 p=0.28) says progression can hold while lean
is lost. And that dissociation was measured in adults averaging 51–60 years old. This is the
**fast loop**; monthly skinfolds are the slow calibration loop (R5). Eight logged sessions is thin
— `"unknown"` will fire first, and that is the feature working.

## R2 — The calorie target must be able to return a surplus

`calorieTarget` (2195–2222) has **no phase branch**:

```js
const band = cutRateBand(s).band;                        // 2197 — always the cut band
baseHi = Math.max(floor, td.tdee - kcalFor(band[0]));    // 2221 — always subtracts
```

A committed `leangain` phase is still prescribed a 0.60–1.00 %BW/wk **deficit**. Five more paths
cannot represent a surplus either:

| path | line | failure in a surplus |
|---|---|---|
| `proteinTarget` | 1589 | serves the *deficit* meta-regression's 2.5–3.0 g/kg FFM; the cited `BULK_PROTEIN_G_PER_KG_BW = 1.6` sits unread |
| `dripOf` → `bfEst` | 1526/1530 | lean held flat ⇒ **100% of gained weight reports as fat** |
| `energyDensity` | 2667 | 3,800 kcal/lb is tissue *lost*; tissue gained ≈ 2,376 ⇒ every conversion **~60% too expensive** |
| `partitionPrior` | 2637 | **no direction argument**; centres on `PRIOR_FAT_FRAC 0.861` regardless |
| `VOL_BANDS` | 5678 | self-declared "deficit-calibrated" (3896) |

**Change.** `energyBalanceTarget(s)` becomes the single owner, branching on `regime(s).key`.
`accretionBound` ⇒ surplus capped at `BC.BULK_REDLINE_PCT` (0.25 %BW/wk — already present and
cited at 2466). `energyDensity` takes a direction. `proteinTarget` takes the regime.

**Assertions.** `regime === "accretionBound"` ⇒ target > `observedTDEE(s).tdee`. `energyDensity(s,
"gain").perLb` materially below `"loss"`. Round-trip free→costing→accretionBound→free produces a
monotone, non-hunting target path.

**What it does not buy.** The surplus *magnitude* has almost no adequately-powered trained-lifter
evidence (§2.4). `BULK_REDLINE_PCT = 0.25` is a defensible cap, not a measured optimum. Label it.

## R3 — The deficit rate: his record, with the band as prior

**Keep ~0.7 %BW/wk in `free`. Re-derive the justification.** The number is not "the recomp
constant" — it is *the rate at which his own progression stayed positive for eight weeks*, with
Ruiz-Castellano's 0.5–1.0 %BW/wk band (tilt low as he leans) and Garthe's 0.7% arm as priors. The
band moves only on a regime change — never on a body-fat threshold, never on a date.

**Two live bugs in the same change:**

- **`floor` and `redline` are still absolute pounds.** `cutRateBand` converts the band with
  `pctToLb` (2501) but reads `floor` (0.8 lb) and `redline` (1.9 lb) raw off `SEED.rate` (375) at
  2499–2500. They therefore represent a *larger* fraction of bodyweight as he leans out — **the
  redline gets more permissive exactly when lean tissue is most at risk**, the reverse of the
  file's own citation at 2452. An open `rateunit` proposal covers this. **Filed twice, unactioned
  eight days.**
- **Two live redlines.** `bodyCompBand` returns `redlinePct: 1.0 %BW` (= 1.63 lb); `cutRateBand`
  returns `redline: 1.9 lb` (= 1.157 %BW). `escalation` uses the first; `redlineCrossing` and the
  gauge use the second. The comment at 2508–2510 claims *"ONE function owns the corridor … never a
  second number."* There are two.

**Assertions.** `%BW` value of `.floor` and `.redline` invariant across two states differing only
in bodyweight. `bodyCompBand(s).redlinePct === cutRateBand(s).redline / bw * 100`.

**What it does not buy.** 0.7 %BW/wk is proven *survivable with progression intact* for him — a
weaker and more honest claim than *optimal*. The maximising rate could be higher; the only way to
find out is the experiment in Part 6.

## R4 — No decision may fire on a body-fat estimate

Two hardcoded thresholds in `runAdaptive` are the **only** producers of a phase or exit proposal:

```
6238   if (!sealed && s.phase === "EASE 1" && bf.pct <= 13.2 && s.trend < 163)
6247   if (!sealed && bf.lo <= 11.2 && pivQ && !pivQ.done)
```

`bf.lo <= 11.2` is the app's entire cut-ending decision. **Uncited.** It fired 2026-07-29 and has
been open ever since.

**Change.** No proposal, gate or target may read `bfEst`. Delete both thresholds with the `s.phase`
machine they serve. **Render no midpoint** (Broad 2007). Express uncertainty **numerically, never
verbally** (van der Bles 2020).

**Assertions.** No `runAdaptive` proposal condition references `bf.pct` / `bf.lo` / `bf.hi`.
`bfEst` unreachable from `energyBalanceTarget`, `regime`, or any `propose(` call. No UI path
renders `bf.pct` without its interval.

## R5 — The anchor becomes a skinfold sum in millimetres

**Σ7 skinfolds in mm — never converted to a percentage.** Conversion adds a modelling error that
destroys the precision advantage and reintroduces the point estimate R4 just removed. Helms 2023
used Σ8 skinfolds as its own outcome. The sum needs **no accuracy at all** — only consistency —
because the objective is defined on change.

New synced collection `s.skinfolds = [{ d, sites, sumMm, tester, note }]`.

**Data-safety, required in the same change:** keyed-union merge, refuse-to-shrink, additive
migration. New synced state does not ship without all three.

**Assertions.** 4 entries merging with 6 yields 6, never 4. Migration adds `s.skinfolds = []` and
nothing else. No code path converts `sumMm` to a percentage.

**What it does not buy.** Skinfolds measure subcutaneous fat, not total fat, and absolute accuracy
is poor. Precision is **entirely conditional on the same tester** — Machado 2025 (n=25) found a
novice's technical error exceeded 7.5% at two sites vs an expert's <5% everywhere. Record `tester`
and **break the trend line when it changes.**

**Disqualify bioimpedance explicitly.** BIS consecutive-day LSC 3,607 g ≈ 4.9 BF points, and a
500 g meal alone moved it 774 g (Kerr 2017). If a BIA input ever exists, it must refuse to plot as
change.

### Where to get it — Suffolk County, NY

| place | what | note |
|---|---|---|
| **DexaFit Long Island** — 213 Hallock Rd, Stony Brook NY 11790 · (516) 496-1717 · Tue 8–1, Thu 8–2, Sat 8–12 | DEXA $179 | Only body-comp facility confirmed inside Suffolk. Worth **one** visit as a level anchor — fasted, no training that morning, no carb load. |
| [**BodySpec**](https://www.bodyspec.com/dexa-scan-long-island) | mobile DEXA from $39.95 | **Waitlist-only** for Long Island right now |
| DexaFit Bellmore — 2570 Merrick Rd | DEXA $179–199 | Nassau. Listed only as fallback |
| [Northeast Medical Practice](https://northeastmedicalpractice.com/services/body-composition-test/) | **BIA only** | **Ruled out** — 4.9-point detectable change |

**I could not verify a dedicated ISAK-certified skinfold tester in Suffolk County.** They are rare
and do not market searchably. The call to make, to any sports-performance gym, physique coach or
registered dietitian: *"Do you do 7-site skinfolds with calipers, and can I book the same tester
every month?"* **Same tester is the whole ballgame** — a consistent novice beats a rotating expert
for tracking change. If nobody says yes: buy a caliper, mark the sites, have one person do it
monthly, and track the sum in mm.

## R6 — Condition maintenance on activity; stop `adaptationSignal` firing on a step drop

1. Report maintenance **with its conditioning variable visible** — `maintenance @ 17,200 avg steps
   (last 35 d)`, plus a second line at the current step level. The scalar becomes a lever.
2. `adaptationSignal` subtracts the deterministic step term (`β · Δsteps`) **before** looking for
   residual adaptation, and **abstains** when step variance across the window exceeds a threshold.
   Attributing deterministically beats estimating β from 35 noisy days.
3. **Steps are a diet variable, not a training variable.** Any proposal that changes steps must
   recompute energy balance in the same breath. Walking does not interfere with hypertrophy
   (Schumann 2022, SMD −0.01, p = 0.919); the risk of restoring steps is that it silently **deepens
   the deficit**.

**Assertions.** Real ledger ⇒ `adaptationSignal(s).detected === false`, reason names activity
drift. Constant steps + genuine divergence ⇒ still fires. Any `kind: "steps"` proposal carries a
non-null `deltaKcal`.

## R7 — `currentRate` must not silently average across a behaviour change

Report the long window as primary, **plus an explicit divergence flag** when the behaviour-implied
rate and the measured rate disagree by more than their combined error. Do not switch estimators
mid-cut — a discontinuity in the control input is itself a failure mode. Long-term fix is a
change-point or exponentially-weighted estimator.

**Assertions.** Real ledger ⇒ divergence flag raised. Constant-behaviour fixture ⇒ not raised.
Primary displayed rate does not change estimator between consecutive days on the same data.

**What it does not buy.** A divergence flag is a prompt to look. It must not drive a calorie change
on its own.

## R8 — Training: delete, do not build

| variable | rule | basis |
|---|---|---|
| weekly sets/muscle | **10–16 fractional, unchanged by energy state** | Roth 2022 (n=38, modest deficit) null; Nait-Yahia 2026 (n=16, 40% CR) null on FFM |
| set counting | **fractional: direct 1.0, indirect 0.5** | Pelland 2025's own best-fitting quantification |
| terminal RIR | **0–2, never modulated by energy state** | **Zero studies have ever manipulated RIR under restriction** |
| frequency | **4×/wk fixed** | Pelland 2025 β crosses zero |
| load / reps | **6–15, chosen for joint comfort and rep-count stability** | Schoenfeld 2017 ES 0.03 |
| machines vs free | **leave alone** | Haugen 2023 SMD −0.055 |
| deloads | **none scheduled, none autoregulated** | Coleman 2024 — strength-negative |

**Delete** the `"deficit-calibrated"` comment on `VOL_BANDS` (3896) and any deficit-conditional
volume logic.

**The revised reason for holding volume constant, and it is stronger than the old one.** It is not
that volume doesn't matter. Nait-Yahia found higher volume **improves strength without improving
FFM** under severe restriction. Since the regime detector reads strength as its accretion proxy,
**raising volume would manufacture the signal it measures** — strength rises, the detector reads
`free`, lean is lost silently. Volume must be constant for the instrument to be valid, and any
volume change must invalidate `progressionTrend` for a stated washout.

**Change gate.** No more than ±2 sets per muscle per 4 weeks, only on a ≥4-week trend. A 2-set
change is worth ~0.48% predicted growth against a **2.05%** smallest detectable effect. *(Design
judgement, derived from the evidence's own resolution.)*

**What it does not buy.** Both deficit-volume trials are small (n=38, n=16) and short (7 and 4
weeks) and neither used a lean population at a shallow deficit — which is exactly his situation.
"No evidence to change it" is the honest basis, not "evidence that it doesn't matter."

## R9 — The approval inbox must drain

Every recommendation here ends in "file a proposal," and the queue does not clear.

```
13 open · oldest 9 days · four duplicated kinds
recovery      ×2   07-27, 08-03
refeed_review ×2   07-28, 07-29
rateunit      ×2   07-28, 07-29    ← the absolute-lb redline bug, twice, unactioned
ap_tighten    ×2   08-02, 08-03
pivot         ×1   07-29  "WORTH ASKING: IS THE CUT DONE?"   (7 days open)
```

No expiry, no dedup, no supersede. **Change:** stable `kind` key; filing over an open `kind`
**supersedes** rather than appends; `kind`-specific expiry, stated; sort by consequence, not
recency.

**Assertions.** `runAdaptive` twice on the same state ⇒ one open proposal per kind. Superseded
proposals recorded in `feed`, not dropped. Real ledger post-migration ⇒ ≤1 per kind.

---

# Part 4 — Bugs, independent of the redesign

1. **`floor` / `redline` still absolute lb** — R3. Open proposal, filed twice, 8 days.
2. **Two live redlines** — 1.0 %BW vs 1.157 %BW, both displayed. R3.
3. **Two ETAs to 11%** — `etaRange(s,11).mid = 6` wk vs `digitalTwin(s).etaMid = 5`. Different
   methods, both rendered. Violates engine-owns-numbers.
4. **`typicalError`'s comment is stale by 3×** — says "0.75 reps across 33 paired sets"; actual
   **0.82 across 92**. Its method also pairs consecutive sessions at identical load, so each
   difference contains real adaptation, not only measurement noise. Error direction is
   conservative, so not dangerous — but the label is not what it computes.
5. **`leangain` unreachable** — R1.
6. **`weightNoise` takes `reads`, not `s`** — the only export with a different signature. An audit
   calling the surface uniformly gets a false "broken" reading.
7. **35 migration patches unexported**, and `patchV34` **changes a physiological constant** (forces
   `s.model.drip = 0`). Migrations that alter physiology need the same test surface as the
   functions that consume them.
8. **Inline engine arithmetic in React components** — `NegotiatorConsole` (13013) and
   `WhatIfConsole` (12439) recompute rates, goal weights, calorie cuts and pivot dates outside every
   exported owner, using `KCAL_PER_LB_MIX` directly rather than `energyDensity`.
   `NegotiatorConsole` also holds the file's only explicit body-fat corridor — stepper bounds
   `9, 14` at 13044. Under R4 that control goes.

---

# Part 5 — What NOT to build

- **A body-fat corridor rule.** The instrument cannot resolve 4 points at any sustainable cadence.
- **A personal RIR-bias calibration.** Requires sets past failure to generate the measurement;
  within-subject reliability across the source literature spans ICC 0.5 to 0.96; the correct
  application is a prescription shift, not a record rewrite. Not worth the cost.
- **Deload scheduling or autoregulated deloads.** Strength-negative.
- **Rest intervals, tempo, advanced techniques, periodisation, exercise rotation, set order.** No
  evidence supports autonomous manipulation at a signal that moves ~2% per quarter. Hold fixed and
  say so.
- **Any weekly autoregulation loop justified on hypertrophy grounds.** SDES 2.05%, marginal set
  0.24%. Over four weeks the app cannot distinguish its own decisions from noise.

---

# Part 6 — Confidence, and the one experiment

## What would change the answer

| finding | confidence | what would overturn it |
|---|---|---|
| He is in regime `free` | **high** | his own log — it is a direct observation, not an inference |
| BF% cannot be a fast control variable | **high** | nothing plausible; three independent lines agree |
| `regime` should drive the calorie target | **medium-high** | evidence that strength and lean mass dissociate in *young trained* lifters (Murphy & Koehler's population averaged 51–60) |
| ~0.7 %BW/wk is right for him now | **medium** | his progression stalling at that rate |
| Volume unchanged by energy state | **medium** | a lean-population trial at a shallow deficit — does not exist |
| A surplus is not needed *yet* | **medium** | his progression stalling, which flips it to `accretionBound` by design |
| The 500 kcal/day deficit threshold | **low-medium** | it comes from adults averaging 51–60 years old |

## The one experiment worth running

The parameter that decides everything — the lean cost of a deeper deficit — is unidentifiable from
the literature and identifiable from him.

**While `regime === "free"` and progression is intact, the rate can be raised.** If progression
survives, the previous rate was leaving fat loss on the table. If it degrades, the boundary is
found — and it is *his* boundary, not an average of 11 men from 2011 or 1,495 people averaging
55 years old.

It requires R1 and nothing else.

## Immediately actionable, before any code ships

1. **His steps are on a −649/week trend and his intake rose 883 kcal/day.** Whether or not the
   scale has caught up, both leading indicators have turned. This is a behaviour finding, not a
   model finding, and it needs no feature to act on.
2. **One DXA at Stony Brook — fasted, no training that morning, no carb load** — sets the anchor
   properly. A non-standardised scan is worth up to **5.5 points of permanent bias**, which is more
   than the entire range of interest.
3. **Find one skinfold tester and keep them.** 0.6-point resolution beats everything else available
   at any price.
