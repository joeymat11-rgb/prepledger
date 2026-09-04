# M2 MODULE 1 — SCORECARD (cowork, 2026-09-04; same items as the T3 scorecard, run by cowork on a fresh checkout of PR #11 @ 65ee883)

| # | Item | Result |
|---|------|--------|
| 1 | GATE (must) | census-partial PASS on cowork's machine: manifest fe516c1 · SEED byte-equal · preimage 128 leaves + synthetic 15 leaves byte-identical in BOTH Date modes · LIVE blob GREEN (private golden re-cut here matched the committed goldenSha256 exactly once its stamp carried the integrator's engine sha — census identical across three machines) · run.cjs CONSISTENT · selftest PASS |
| 2 | INDEPENDENCE (must) | rebuild/engine requires only its own six modules; no conform import; no ambient clock (the four `new Date(y,m,d…)` calls are explicit-argument constructors, disclosed); no test-hook smells |
| 3 | FIDELITY (must; new item for extraction) | targetsFor, _setsAtTime, progressionTrend, canonicalizePlan compared line-by-line against src/app.jsx @ fe516c1: VERBATIM. Astra's own AST comparison: 113 + 57 declarations, one authorised rewrite (todayStart) |
| 4 | BITE (scored) | Astra's bite (targetsFor +1): bit on all blobs. cowork's bite A (progressStep RIR-1 step 2→1): bit on the LIVE blob (public blobs unaffected — the live ledger is the oracle that matters). cowork's bite B (the FIX-4c line: same-day increases instead of decreases): **NO-BITE on any blob** — a SUITE GAP, not a module-1 fault: no fixture carries a same-day decrease. Recorded for v4 (rig185 W1 becomes a fixture-backed law). |
| 5 | SEAMS (scored) | Astra listed 10. cowork-found omissions: 0. |
| 6 | DEFECT LOG | 10 defects, all reproduced by cowork with Astra's witness file (10/10). None fixed (correct). D2 (negative set count → RangeError), D3/D4 (name-prefix matching claims another lift's receipts/earns), D7 (future-dated sessions enter the anchor) look real and material; D10 (DST week arithmetic) is a design question. All go to the post-extraction audit for the owner's rulings. |
| 7 | COST | ≈16 min build (Astra's clock); tokens not exposed. cowork verification ≈40 min. |

Verdict: module 1 ACCEPTED for merge into rebuild/t2-client-core. Second sample for the builder decision: consistent with T3 (gate clean, honest seams, a defect log that found real things). Module 2 stays with Astra.
