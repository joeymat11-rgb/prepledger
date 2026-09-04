# EARNED — M2 MODULE 1 BRIEF (the engine extraction, first gated step) — builder ASTRA

Date 2026-09-04. You won the T3 bake-off on the owner's pre-registered scorecard; this is the first M2 module. Same rules as T3:
the suite is the gate, you never edit it, you never touch the frozen app, nothing private ships, and you write an honest report.
Read `AGENTS.md`, `rebuild/ROADMAP.md`, and `rebuild/m2/RECON.md` (the reconnaissance — module boundary §4, the gate §5, the risks §6)
before writing a line.

## 0. Branch and base
Base: `rebuild/t2-client-core` at its current tip (the FINAL golden for v7.56.0 is already cut and committed there — check the port
oracle's manifest says `fe516c1 (v7.56.0, frozen main)`; if it still says a0009c3 / v7.55.9, STOP and report — the golden is a
prerequisite and is not yours to cut). Branch: `rebuild/m2-engine-1`. Open a PR against `rebuild/t2-client-core`. Do NOT merge.

## 1. What module 1 is (RECON §4, extraction order steps 1 and 2)
Create `rebuild/engine/` with these files, COPIED from the frozen `src/app.jsx` — copy, never refactor; the frozen app imports nothing back
and stays byte-identical (`git diff --exit-code -- src app.js` must be empty at the end):
- `dates.cjs` — DAY, mk, isoOf, fmtShort, weeksBetween; `todayStart` / `daysUntil` rewritten over the injected `clock` (RECON §3).
- `constants.cjs` — every engine constant listed in RECON §4 (APP_V, SCHEMA_V, START, SEAL_UNTIL, CROSSOVER, PHASES, BC, FORE, KCAL_*, …).
  UI-only constants stay out (RECON marks them).
- `seed.cjs` — HISTORY, EXERCISES, SEED + weave(), weekRollups/ROLLUPS. Gate: the SEED JSON is byte-identical to the frozen bundle's
  `__test.SEED` after canonicalization.
- `plan.cjs` — dayType, exActive/_bornValid, forks/renames/era helpers, canonicalizePlan, normalizePlan, deriveInsertionSeams,
  applyInsertionSeams, pinsUnfilled/pinsBornOf.
- `progression.cjs` — the READ side only: _loadTenure … _setsAtTime, progressStep, progressAnchor, maxedOut, _padFrom9, targetsFor,
  progressionSetCount, atTopOfWindow, the rungs family, typicalError, beatsNoise, _deriveSightingFull/deriveSighting, _mintJointEarn,
  _volDeltas, progressionTrend. Writers (completeSession, earn walk, sweep*) are NOT module 1.
- `index.cjs` — `createEngine({clock, ids})` returning the function table for the modules above; a module-local `E` carries cross-module
  references so the call graph is unchanged. Everything reads the clock through `clock`; `new Date()` / `Date.now()` do not appear in
  `rebuild/engine/` (the gate greps for them).
- `oracle-shim.cjs` — reads MEASURED_TEST_NOW / TZ, builds the local-noon clock and a seeded id generator, exports
  `__test = createEngine(...).__test` with at least: exActive, targetsFor, deriveSighting, _volDeltas, progressionTrend, SEED.

## 2. The gate for module 1 (RECON §4 step 2, §5)
Run `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-1`
in the mode the oracle offers for a PARTIAL surface: the census groups `lifts` and `progression` must be byte-identical to the FINAL golden on
the preimage and synthetic blobs, with the selectors called on the golden engine's MIGRATED state dumped once (migrate is module 5, not yours).
If the oracle has no partial mode, write `rebuild/engine/test/census-partial.cjs` that does exactly that and nothing more — it may import the
suite's census and harness, it may not edit them. Then:
- `node rebuild/conform/run.cjs` → still SUITE CONSISTENT (you changed nothing under rebuild/conform, so the frozen manifest proves it).
- `node scripts/check.mjs --strict` WITHOUT MEASURED_TEST_NOW (the frozen gate has its own clock) → "Safe to ship."
- The private live blob: run the same partial census locally against `private/live.json` regenerated from
  `git show fe516c1:ledger/state.json` — report the VERDICT ONLY, never a value; never commit private/.
- Determinism: run the partial census once with the Date shim in place and once with `globalThis.Date` UNFROZEN (clock still injected);
  identical output or you missed a clock site.

## 3. Bite check (deliberate, documented, restored)
Break ONE thing in `progression.cjs` (e.g. `_setsAtTime` counting start-of-day instead of end-of-day — that is the FIX-4c line) and show the
partial census go RED; restore byte-for-byte and show the SHA.

## 4. Report — `rebuild/m2/REPORT-M2-1-ASTRA.md`
(1) module map with line counts and, per function, the app.jsx line range it was copied from; (2) the gate output tails verbatim (partial
census on the two public blobs; run.cjs SUMMARY block; check.mjs tail; live-blob verdict line); (3) every clock site you rewrote (count +
list) and every memo/WeakMap you met; (4) the bite check; (5) SEAMS — anything shaped by the oracle rather than by the product; (6) anything
in RECON.md you believe is wrong (not edited); (7) what module 1 does NOT cover; (8) wall-clock and, if exposed, tokens.
Same honesty bar as T3: the owner's scorecard counts seams you omit at double weight.

## 5. Never
Edit `src/`, `app.js`, `rebuild/conform/`, `rebuild/client/`, `rebuild/authority/`; commit `private/`, engines, or any golden other than the
committed public ones; print or handle a token; delete anything; push to main.
