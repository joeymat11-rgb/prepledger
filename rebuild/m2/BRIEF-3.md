# EARNED — M2 MODULE 3 BRIEF (the engine extraction, third gated step: TODAY read side) — builder ASTRA

Date 2026-09-05. Modules 1–2 (PR #11, #14) were scored and merged (rebuild/m2/SCORECARD-M2-1.md, -2.md). This is the third gated step. Same rules:
the suite is the gate, you never edit it, you never touch the frozen app, nothing private ships, and you write an honest report.
Read `AGENTS.md`, `rebuild/ROADMAP.md`, `rebuild/m2/RECON.md` (§4 boundary, §5 gate, §6 risks), your own `rebuild/m2/REPORT-M2-2-ASTRA.md`
and the merged `rebuild/engine/` before writing a line. Module 1's conventions (factory-local E, per-instance constants/seed, source-range
comments, the two-Date-mode partial census) are the conventions; extend them, do not reinvent them.

## 0. Branch and base
Base: `rebuild/t2-client-core` at its current tip (it now carries modules 1–2). Branch: `rebuild/m2-engine-3`.
Open a PR against `rebuild/t2-client-core`. Do NOT merge.

## 1. What module 3 is (RECON §4, extraction order step 4 — the TODAY read side)
Add `rebuild/engine/today.cjs`, COPIED from the frozen `src/app.jsx` @ fe516c1 (copy, never refactor; frozen app byte-identical):
- READ side: nowFocus, fiveLevers, theOneFix, whyDecompose, statusFace (its `tone` becomes a token NAME string, never a hex — RECON's one
  authorised rewrite for this module; say exactly how in §3), marchingOrder, statusTarget, oweTarget, nowModel, _plain9/_rateStrip/_rateWord,
  lastUndoable, apAutoHandledFor, and whatever read-only helpers their call graph needs (list every closure addition in §5, as module 2 did).
- NOT module 3 (writers): runAdaptive, applyProposal/dismissProposal, applySuggestion/noteSuggestion/dismissSuggestion,
  applyAgentProposal/dismissAgentProposal, undoAdjustment, sweepLab. Boundary rule as before: a listed reader that writes → STOP that item,
  §6, continue.
- `index.cjs` / `oracle-shim.cjs` — `__test` must now ALSO expose statusFace, statusTarget, nowFocus, marchingOrder, nowModel, oweTarget.
Then the FULL census surface required by RECON §5 is present (migrate, exActive, targetsFor, calorieTarget, cutRateBand, calorieFloor,
proteinTarget, observedTDEE, currentRate, regime, progressionTrend, statusFace, statusTarget) EXCEPT migrate — module 5.

## 2. The gate for module 3 (RECON §4 step 4, §5) — cumulative with modules 1–2
Run `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-3`
in the mode the oracle offers for a PARTIAL surface: the census groups `lifts`, `progression`, `energy` AND NOW `today` ({trend, phase, statusFace {word, cause}, statusTarget {key, id, label}}
— statusFace.cause is PROSE: one changed word fails, by design) must be byte-identical to the FINAL golden on
the preimage and synthetic blobs, with the selectors called on the golden engine's MIGRATED state dumped once (migrate is module 5, not yours).
Extend `rebuild/engine/test/census-partial.cjs` (module 1's) to the new groups; it may import the suite's census and harness, it may not edit them.
Modules 1–2's groups must still pass — the partial census is cumulative. With `today` in, the partial census equals the oracle's REQUIRED
census minus migrate: also run the real `port-oracle.cjs check` against your shim and report which of its laws now pass and which still
fail only for the missing migrate (expected: counts/migration rows), verbatim. Then:
- `node rebuild/conform/run.cjs` → still SUITE CONSISTENT (you changed nothing under rebuild/conform, so the frozen manifest proves it).
- `node scripts/check.mjs --strict` WITHOUT MEASURED_TEST_NOW (the frozen gate has its own clock) → "Safe to ship."
- The private live blob: run the same partial census locally against `private/live.json` regenerated from
  `git show fe516c1:ledger/state.json` — report the VERDICT ONLY, never a value; never commit private/.
- Determinism: run the partial census once with the Date shim in place and once with `globalThis.Date` UNFROZEN (clock still injected);
  identical output or you missed a clock site.

## 3. Bite check (deliberate, documented, restored)
Break ONE thing in `today.cjs` that the LIVE blob exercises (e.g. one word of a statusFace `cause` string) and show the partial census go
RED on the live blob; restore byte-for-byte and show the SHA. Note: cowork found on module 1
that a break with no fixture behind it (the FIX-4c same-day-decrease line) does NOT bite — if your first break is silent, say so, pick
another, and list the silent one in §5 as a coverage gap.

## 4. Report — `rebuild/m2/REPORT-M2-3-ASTRA.md`
(1) module map with line counts and, per function, the app.jsx line range it was copied from; (2) the gate output tails verbatim (partial
census on the two public blobs; run.cjs SUMMARY block; check.mjs tail; live-blob verdict line); (3) every clock site you rewrote (count +
list) and every memo/WeakMap you met; (4) the bite check; (5) SEAMS — anything shaped by the oracle rather than by the product; (6) anything
in RECON.md you believe is wrong (not edited); (7) what module 1 does NOT cover; (8) wall-clock and, if exposed, tokens;
(9) DEFECT LOG (continue the numbering at D23) — anything in the code you copied that you would change (a wrong rule, a hidden assumption, a value that should be
derived, a bug): file it with the app.jsx line and the evidence, and DO NOT change it. Module 1 must reproduce the frozen engine
byte-for-byte — the golden is the proof, and one changed word fails it by design. Every entry in this log becomes a candidate
red-first law for the audit that follows extraction; the owner rules on each. An improvement smuggled into a copy is a defect here.
Same honesty bar as T3: the owner's scorecard counts seams you omit at double weight.

## 5. Never
Edit `src/`, `app.js`, `rebuild/conform/`, `rebuild/client/`, `rebuild/authority/`; commit `private/`, engines, or any golden other than the
committed public ones; print or handle a token; delete anything; push to main.
