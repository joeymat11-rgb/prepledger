# M2 MODULE 2 — SCORECARD (cowork, 2026-09-05; PR #14 @ 46556db, re-run on a fresh checkout)

| # | Item | Result |
|---|------|--------|
| 1 | GATE (must) | cumulative census-partial PASS on cowork's machine: lifts + progression + energy + raw Today inputs byte-identical — preimage 822 leaves, synthetic 136, both Date modes; LIVE blob GREEN (private golden re-cut here, sha matched the committed pin). Astra's run.cjs CONSISTENT / selftest PASS / check.mjs "Safe to ship" per its report. |
| 2 | INDEPENDENCE (must) | rebuild/engine requires only its own modules; zero ambient `new Date()` / `Date.now()`; no conform import. |
| 3 | FIDELITY (must) | observedTDEE, calorieTarget, _regimeRaw, cutRateBand, forecastUncached, phaseSupervisor, cleanAtDate, bodyAlarm compared line-by-line against src/app.jsx @ fe516c1: all VERBATIM. Astra's independent audit: 310 declarations match. |
| 4 | BITE (scored) | Astra's bite (observedTDEE +123): five energy paths differ on each public blob, live FAIL, restored sha dca9e0c2… — reproduced here. cowork's bite (a syntax-level break in energy.cjs): the gate fails CLOSED ("isolated candidate execution FAIL"), not silently. |
| 5 | SEAMS (scored) | Astra listed 12. cowork-found omissions: 0. The big one is disclosed twice (seam 2, RECON correction): bodyAlarm's call graph drags the LAB layer (labAnalytics/labAnalytics2/sleepLab/shelfItems/trialProposals/prophetGrades, ≈1,700 lines) into sleep.cjs, which RECON had excluded as narration. Copied intact rather than stubbed — the right call for fidelity; the BOUNDARY decision (is bodyAlarm a Today input, or does the lab closure get its own module?) goes to the post-extraction audit. |
| 6 | DEFECT LOG | D11–D22, 11/11 witnesses reproduced here. Material: D14 (currentRate.fat is NaN when model.drip is absent), D13/D20 (memo caches return stale forecast/energyDensity after state changes — RECON's impurity, now witnessed), D22 (a golden-migrated fixture carries sleep.nights as an object and three readers throw on it), D16/D17 (forecast grading and trackRecord read the wrong records). |
| 7 | COST | ≈17 min build (parallel with the M3 plan); tokens not exposed. cowork verification ≈30 min. |

Verdict: module 2 ACCEPTED for merge. Third consistent sample. Module 3 (Today read side) stays with Astra.
