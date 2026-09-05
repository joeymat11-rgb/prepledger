# EARNED — M2 MODULE 4 BRIEF (the engine extraction, fourth gated step: VOLUME read side) — builder ASTRA

Date 2026-09-05. Modules 1–3 are merged. Same rules: copy, never refactor; the suite is the gate, the frozen app stays byte-identical,
nothing private ships, and the report distinguishes extraction evidence from product correctness. Read `AGENTS.md`, `rebuild/ROADMAP.md`,
`rebuild/m2/RECON.md` (§4 boundary, §5 gate, §6 risks), `rebuild/m2/REPORT-M2-3-ASTRA.md`, and the merged `rebuild/engine/` first.
Keep module 1's factory-local E, per-instance constants/seed, source-range comments and two-Date-mode cumulative census conventions.

## 0. Branch and base
Base: `rebuild/t2-client-core` tip, pinned for this step to `3564e6957467c23fc4f100af406fca08ff3c018d` (modules 1–3, M3 plan and soak stub).
Branch: `rebuild/m2-engine-4`. Open ONE PR against `rebuild/t2-client-core`; do NOT merge. This PR also writes `BRIEF-5.md`; it does not build module 5.

## 1. What module 4 is (RECON §4, the VOLUME read side)
Add `rebuild/engine/volume.cjs`, COPIED from frozen `src/app.jsx` @ fe516c1 (v7.56.0/schema 60):
- READ side: muscleVolume, programmeVolume, volumeImbalance, structuralMovesThisWeek, _blockSlope, setOneRead, volumeConversion,
  _setsMovesSince, coarseLifts, mgLabel, and their read-only closure. Inventory identifies volBucket and hypGain as local helpers;
  reuse all other already-extracted dependencies through E. List every declaration and dependency in the report; do not duplicate implementations.
- MOVE the exact muscleVolume/_blockSlope/setOneRead/volumeConversion declarations and volBucket from sleep.cjs into volume.cjs;
  re-point sleep's needed bindings through E. MOVE structuralMovesThisWeek from policy.cjs, preserving its E export and existing callers.
  MOVE coarseLifts from progression.cjs too, retaining its export name and forwarding any remaining callers. These are ownership moves, not rewrites.
- NOT module 4: volumePush, sweepVolume, sweepStalls, or any other writer. A listed reader found to write: STOP that item, record it in report §6,
  and continue the rest. Preserve explicit dates, thresholds, prose and known defects; use existing injected clock readers without new policy.
- Register volume.cjs in index.cjs. The existing whole-E oracle shim must expose every listed reader; it must still NOT expose candidate migrate.
  No changes to modules 1–3 beyond required ownership moves/bindings and the cumulative test extension. No browser, network or storage dependency.

## 2. The gate for module 4 (RECON §5) — cumulative with modules 1–3
The oracle has NO partial CLI mode. Run the tracked `rebuild/engine/test/census-partial.cjs` with
`MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York ENGINE_MAIN=<verified frozen fe516c1 bundle>` (environment variables, then `node` and that path).
It verifies pinned fixture/golden/stamps, migrates each raw blob ONCE using the frozen engine and passes that snapshot by value to candidate readers.
Keep lifts + progression + energy + today and raw Today inputs byte-identical: the existing **829 preimage / 141 synthetic leaves**, plus live,
remain the cumulative baseline. Exact statusFace cause prose stays in that baseline; one changed word fails.
Extend this test with a separately counted volume projection against the SAME frozen engine/snapshot, not a fabricated new committed golden:
muscleVolume, programmeVolume, volumeImbalance, structuralMovesThisWeek, coarseLifts; per-exercise setOneRead/volumeConversion;
_setsMovesSince at the current Monday and an all-history bound; mgLabel/volBucket for exercise buckets; _blockSlope on fixture lift-history blocks,
and hypGain on programme allocations. Compare complete outputs, including prose; record any frozen exception parity explicitly, never call it valid data.
Require all ten named readers and both helpers on the candidate table. Any helper not exported by the frozen test table needs a disclosed exact-source
reference probe; it may not fall back to candidate code. Do not change `rebuild/conform/`, its census, manifest, fixtures or goldens.
- Run default (all three blobs), once per isolated candidate Date mode: frozen Date and native/unfrozen Date, with the same injected clock.
  Both outputs must match each other and the frozen reference. Report public baseline and additional volume leaf counts separately; live verdict ONLY.
- Regenerate ignored `private/live.json` locally from `git show fe516c1:ledger/state.json`; verify fixture/golden pins and never print its values or counts.
- Run the real `node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-4` under the same clock/zone and report its actual laws.
  Without migrate, BOTH counts and whole-census laws are expected HARNESS_ERROR (not a partial PASS); metadata rows can pass. Full port acceptance waits for module 5.
- `node rebuild/conform/run.cjs` under AGENTS' reference-engine/clock setup → SUITE CONSISTENT; also `--selftest` → SELFTEST PASS.
- `node scripts/check.mjs --strict` WITHOUT MEASURED_TEST_NOW, with dependencies available → "Safe to ship."
- Run the tracked synthetic defect witnesses. They prove the copied behavior, not permission to correct it. Frozen paths and the suite must have zero diff.

## 3. Bite check (deliberate, documented, restored)
Break ONE copied value or prose fragment in volume.cjs that the LIVE fixture exercises. The extended cumulative census must go RED on live.
Restore the file byte-for-byte and publish its matching before/after SHA plus the final PASS. Never publish private mismatches, values or hashes.
If the first mutation is silent, say so, choose an exercised mutation, and list the silent branch in report §5 as a coverage gap.
Receipt/explanation strings compare as complete strings: changing one word, punctuation or embedded value must fail an exercised projection.

## 4. Report — `rebuild/m2/REPORT-M2-4-ASTRA.md`
(1) module map with line counts and every copied declaration's app.jsx range, including moves and closure; (2) verbatim public cumulative census tails,
run.cjs SUMMARY block, strict tail and live verdict; (3) every clock rewrite (count/list) and memo/WeakMap encountered, including reused dependencies;
(4) bite and restored SHA; (5) SEAMS — every oracle-shaped choice, extra reference probe, exception parity and coverage gap; (6) RECON corrections,
not edits to RECON; (7) what module 4 does NOT cover; (8) wall-clock and tokens only if exposed; (9) DEFECT LOG continuing at **D28**.
Each defect: frozen app.jsx line, concrete evidence (prefer a tracked invented-state witness), what should change after owner ruling, and confirmation
that the copied behavior is preserved. No fixes in extraction. Existing D1–D27 findings are cross-references, not renumbered discoveries.
Same honesty bar as T3: omitted seams count double. Cowork independently executes module 4 and reviews BRIEF-5 before module 5 begins.
End the PR description with the census verdict line, run.cjs SUMMARY line, and both paths `rebuild/m2/BRIEF-4.md` and `rebuild/m2/BRIEF-5.md`.

## 5. Never
Edit `src/`, `app.js`, `rebuild/conform/`, `rebuild/client/`, `rebuild/authority/`; commit `private/`, engines, or any golden other than the
committed public ones; print or handle a token; delete anything; push to main.
