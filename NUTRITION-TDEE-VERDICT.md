# NUTRITION / TDEE ENGINE — THREE-AUDIT CONSOLIDATED VERDICT
**For the cowork spec chat. Produced by the audit chat (read-only), 2026-08-11.**
**v2 — Joe's rulings recorded same day; section B is now DECIDED. Build may spec.**

Legs: Grok · Fable 5 (blind) · GPT-5.6 Sol (blind, deepest — its thesis: heuristics
promoted into biological facts). Adjudicated against the code at main and the live
ledger. Sequencing: accepted findings queue THIRD, behind the volume and progression
builds. **All three legs and every live check agree on today: NO live change to
calories, protein, steps, or anything else — hold. His +160 above midpoint is an
owner call and is respected everywhere.**

---

## V. ADJUDICATOR VERIFICATIONS — run on the code and live ledger

**V1. The 500-kcal ceiling is COPY-ONLY — confirmed live.** DEFICIT_CEILING appears in
a card's advice line and the Analyst prompt; it is never consulted in band placement.
The live band (2,240–2,332 at measured maintenance 2,864) already implies 532–624
kcal/day — past the ceiling the app's own words tell him to respect. Words-vs-
mechanism violation, the top fix of this round (see A1: the words soften; no new
mechanism hardens).

**V2. The adaptation detector is structurally SOUND — Sol's harshest claim dissolves,
and the fault was the brief's.** The code's expectation is
`base.tdee + 12×(weight − base.weight)` — anchored to his own measured starting
maintenance, 12 kcal/lb applied only to the mass CHANGE (not the absurd 12×165 level
the brief's wording implied; erratum owned by the audit chat). Better: the
deterministic step-cost subtraction Fable demanded is ALREADY BUILT (measured J/kg·m
on logged step deltas), plus a variance-abstention gate ("activity-drift" is a
first-class answer). What SURVIVES of the three-leg critique: (a) overlapping daily
windows make the ≥3-update persistence pseudo-replication (Sol) — use nonoverlapping
windows; (b) the −85 kcal calibration is from formerly-elite, now overweight
middle-aged adults' RESTING expenditure — soft prior only; (c) log-drift is still
inside the residual — rename to "unexplained residual", forecast-informing only,
never a causal phase/break trigger; (d) VERIFIED GAP: estimated-food days feed the
daily maintenance fits unweighted — Fable's cheapest fix stands.

**V3. The 565-vs-500 live arithmetic is benign.** It reconciles to the logging-bias
label exactly as designed, and (Sol) the 65-kcal gap is smaller than the estimator's
own error. No instrument is broken; no calories move.

**V4. The gain-rate unit clash is RESOLVED: the settled cap is %BW/MONTH (0.25–0.5).**
The audit chat's volume verdict (A6) wrote "/week" — erratum owned; spec chat corrects
it on sight. The code's bulk corridor (0.125–0.25 %BW/WEEK) must be reconciled to the
monthly cap at build time.

**V5. Source-reading corrections adopted (Sol):** Garthe's fast arm was ASSIGNED
1.4%/wk but ACHIEVED ~1.0%/wk — so the 1.0 redline matches the fast arm's achieved
mean and the "set below the fast arm" copy is wrong; 0.70 is "the slower arm of one
confounded two-arm trial," an upper default, not a discovered optimum. Sanghvi 2015
validated a different estimator (model-estimated intake change vs objective methods)
— the in-code ±130–215 band attribution is mislabeled; keep a band, source it from
his own empirical forecast error.

---

## A. CONSENSUS — build-ready (queued third)

**A1. Both hard seals demote to GRADED PRIORS; no winner is declared.** Grok said the
corridor binds; Fable said the ceiling binds in recomp mode; Sol's arbitration
supersedes both: the conflict is between two uncertain approximations, not two laws.
Build: remove the false hard-ceiling language (V1) and replace with graded risk copy
carrying the population hedge; corridor stays the steering target with 0.70 described
as "upper default"; deficit numbers, where shown, display in RATE space (immune to
log bias — Fable); hard stops reserved for genuine health/recovery red flags. His
green outcomes arbitrate — the governing test, applied.

**A2. Estimator honesty rebuild.** Rename the output "apparent maintenance under a
3,500-kcal/lb convention, including net log error" (log error has either sign — the
one-sided "minus logging bias" phrasing goes). Drop the Sanghvi attribution (V5);
calibrate the band empirically on his own rolling forecast errors. Report
estimated/missing-day coverage inside the matched window; widen or abstain when
missingness clusters; down-weight estimated days in the daily fits (V2d).

**A3. Adaptation signal → "unexplained residual."** Keep the (verified-sound)
delta-anchored, step-subtracted construction; switch persistence to nonoverlapping
windows; −85 becomes a soft directional prior; feeds forecasts only — never a phase
transition or diet-break trigger.

**A4. Phase semantics.** Seal/blackout the rate window at regime boundaries (the diet
exit; any diet break — ICECAP measured +0.6 kg scale / +0.7 kg FFM of water inside
one week). Exit mechanics (Fable+Sol convergent): jump to the recorded maintenance
target; ~14 days labeled REPLENISHMENT WASH-IN (never "adaptation recovered" — that
claim dies); re-measure; then the build starts at +100–150 kcal (~3–5%) governed by
the settled MONTHLY gain cap. The surplus loop must tolerate "not yet measurable"
(the cap band sits below the current window's resolution — Fable) with longer
windows/monthly aggregation.

**A5. Protein: the 12.2% switch is REMOVED.** It is a sample-quartile boundary with
subgroup intervals overlapping zero and each other (β=.06, HDI .01–.12 overall);
carrying a range cannot rescue an unsupported discontinuity (Sol over Fable,
adjudicated). 2.5 g/kg FFM stays as the provisional target, displayed against his
FFM interval (~152–166 g today); anything above is continuous owner preference,
never body-fat-triggered. See B1 — his current 175 g is NOT wrong.

**A6. Steps-first becomes CONDITIONAL.** Steps fell below baseline → restore first
(unchanged). Steps at baseline → steps-vs-a-50-kcal-trim is an adherence experiment,
not a hierarchy. Haircut the credited step kcal for compensation and never
double-count the step model against the scale-derived maintenance (Fable+Sol).

**A7. Diet break: symptom-proposed, owner-approved, honestly labeled.** Never
auto-triggered by duration, one rate-floor event, or the residual. Proposal condition:
a SUSTAINED athlete-reported adherence/recovery cluster (hunger/food preoccupation,
disinhibition, inability to execute the band, performance/recovery decline) after
sleep and logging are checked. Card copy states the benefit is adherence/recovery and
body-comp superiority is unproven (trained-subgroup RMR effect: 10.8 kcal/day, CI
−45.8 to +67.4). Ships with the A4 seal. Refeed stays retired; an owner-chosen
isocaloric pattern for preference is not prohibited.

**A8. Male LEA sentinels.** Calculated EA is never clearance; the floor stays a soft
guardrail (net exercise cost). Add a small symptom cluster surfaced on floor-binding
or residual events (libido/morning function is the one discriminating item — LEAM-Q,
n=405; the rest are context); persistent clusters → human medical review, not another
calorie heuristic. His parked fat-intake floor stays parked.

**A9. Corroboration and tags.** Weekly standardized waist (direction only, duplicate
readings, never a BF conversion); interpretation tags for sodium/carb/alcohol/
creatine/travel/illness/late meals (flags, not triggers); a weekday term only if his
own residuals prove it earns its keep.

**A10. Rate instrument: keep, with honesty patches.** OLS on actual dates + HAC
stays; add the small-sample caveat to its label. "95% CI clears zero" demotes to a
high-confidence BADGE — small, reversible steers may act on graded evidence rather
than waiting for full significance (Sol). Window length, robustness, and any weekday
term get calibrated on his own held-out history — the named place where individual
data outranks group heuristics.

## B. RULINGS — DECIDED (Joe, 2026-08-11)

- **B1. Protein display — RULED: always a DYNAMIC evidence-based target.** The
  static 175 g is retired as the stated target. The displayed target is computed
  from his CURRENT measured FFM every time it updates: 2.5 g/kg FFM (provisional
  per A5), shown against his FFM interval (~152–166 g today), and it moves as the
  body-fat/FFM estimate moves — in either direction. Eating above it stays legal as
  preference, but the TARGET shown is always the evidence number, never a pinned
  constant. Owner's phrasing, on the record: *"it should always be a dynamic
  evidence based target"* — treat this as a standing principle for all future
  target displays, not just protein.
- **B2. Copy bundle — RULED YES, all approved as one bundle:** ceiling →
  graded-risk wording; "0.70 = upper default, not optimum"; redline copy corrected
  to "matches the fast arm's achieved rate"; adaptation renamed "unexplained
  residual"; maintenance renamed per A2.
- **B3. Diet-break card copy — DELEGATED to the audit chat ("whatever you think");
  recommended concept-copy below, final words at spec time under B2's voice.**
  The card is titled as a PROPOSAL and names the actual observed symptom cluster
  that triggered it; states plainly that the evidence supports adherence/recovery
  benefits, NOT faster fat loss or extra muscle (RMR effect ~11 kcal/day, CI
  spanning zero); states the scale seal in advance ("expect ~1–2 lb of water back —
  it is not fat, and the trend window is sealed across it"); approve/decline, no
  urgency mechanics (charter).

## C. CORRECTIONS ON THE RECORD

The audit chat's brief mis-described the adaptation baseline, causing Sol's
"structurally incoherent" finding — dissolved by the code (V2), erratum owned. The
volume verdict's gain-cap units (%/wk) — erratum owned (V4). Grok's "Refalo 2025"
protein attribution: authorship unconfirmed (the β=.06/quartile numbers triangulate
across two legs; spec cites "2025 Bayesian deficit-protein meta-regression,
authorship TBC"). Grok's corridor-binds and Fable's ceiling-binds-in-recomp are both
superseded by A1's graded-priors arbitration.
