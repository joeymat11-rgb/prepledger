# R&D lab — feature/instrument pitches

House law: deterministic engines compute, models interpret · everything measured-or-badged · every action is a consent-gated proposal · the coach holds structural authority. Every live pitch states its map: which logged inputs feed it, what sits downstream.

## THIS WEEK'S TOP 3

**1. Event-Aware Adherence — S.** Reruns Weekend Split and Miss Archaeology on non-event days only, tagging each sub-target day by whether an event was on record. Measures: true adherence minus sanctioned events. Map: dailyLogs + events[] → corrects the weekend/miss verdicts. Why him: all three light weekends (7/18, 7/22, 7/25) were events — "50% weekend protein" is an artifact.

**2. Meds-Clock Confound Panel — M.** Crosses meds timing against next-morning energy and drift-off (signal-crossing, pairwise). Measures: whether a 1:00 PM dose, not training, explains a flat morning. Map: medsLog.at + energy + sleep.sol → an attribution flag on energy/sleep. Why him: meds is the app's "biggest confound," now clocked. Data: partial — energy/meds n=1; needs ~2–3 weeks.

**3. Seal-Aware Trend Guard — S.** Suppresses trend/rate/Compounding-Curve verdicts while the blackout is active, showing damped-only plus a seal-lift countdown. Measures: stops instruments reading quarantined water. Map: blackout + reads[].sealed → gates every scale-derived verdict. Why him: trend sat flat at 164.7 for four sealed days and the Compounding Curve reported a meaningless "−0.0 lb gap."

## BENCH

- Grip CNS gate — morning grip gates whether provisional lifts can be owned; blocked on a grip baseline (grip[] is n=0).
- Sodium/alcohol scale-noise decoder — dailyLogs.sodium/alc vs raw-read jumps; waits for the seal to lift 7/27.
- Soreness × volume map — soreness.mgs vs weekly sets/muscle (delts ran 7 sets this week).
- Caffeine-tail × sol model — caffLog.at (350–400 mg near 1:30–2:00 PM) vs drift-off minutes.
- Estimate-day damper audit — do est days actually get midpoint-bracketed, as the dictionary claims?

## GRAVEYARD

- **Estimate/event-day pre-declaration nudge** — REJECTED. Pitched 7/24 and 7/25, adopted zero times. The athlete enters rough numbers *after* an event and never pre-flips the flag (events[wed2].estimated still false on 7/26). Never re-pitch.
- **Cold-start volume proposals** — REJECTED. Already recalled by the app (7/24 misfire — it compared week 1 of logs against a pre-app week). The engine now waits 14 full days and speaks Sundays, ≤2 proposals. Do not resurrect.
