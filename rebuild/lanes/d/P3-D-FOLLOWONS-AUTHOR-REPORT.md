# P3-D-FOLLOWONS - author report (Opus high, lane D, size S+)

DECISIONS:475 Route 1 prerequisites, carrying both MAJORs and the MINORs of the retract and mapping reviews. Branch off
`origin/rebuild/d-p3-retract` b74c660 with `origin/rebuild/d-p3-mapping` d4ab43e merged in: NO file overlap, clean merge.
All SYNTHETIC - bundles sealed by the real `port.cjs` from a file invented through the accepted clean-init constructor, as
`w7-preview/import/test/support.mjs` does. No ledger, private fixture or owner byte read, named or reachable; nothing
written outside the OS temp folder and the worktree's gitignored `.tmp`.

## 1. The four changes

1. **IMPORT SWAP.** `source-admission.mjs:16` imports the accepted page-safe mirror `m3/w6/host/engine-runtime-host.cjs`,
   not `m4/workout/engine-runtime.cjs`: one line and its reason. It uses only `createEngineRuntime` and `sessionMembership`.
2. **MAPPING BOUND AT QUALIFY TIME** (mapping r1 and r3 MAJOR 2, and r1's other half). `createProductionProducerRegistry
   ({hash})`, with NO digest, now builds the execution row from the digest the CONTROLLER presents at `qualify()`, so
   production wiring needs no sixth copy of source-admission's private `:74` derivation. `{hash, materialDigest}` still
   pins a REVIEWED row - the brief's section 5 shape, now reachable through the shipped constructor - and other material
   then refuses SOURCE_ENGINE_CONTEXT_UNPROVEN. TEST-ONLY registries are `Profile.createProducerRegistry`, untouched.
3. **SEEDED-SIBLING GUARD** (retract r1 MAJOR 1, its RV-9). `priorSidecar` refuses LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN when
   ANY OTHER live entry is itself `seeded(entry)`, so a retract can never restore a cache over one a live entry seeded;
   wider than the direction the review reproduced, because the other would need this module to INFER a cache. The header
   now also names LOCAL_IMPORT_NAME_TAKEN for a different file under a retracted name (r1 MINOR 2, r3 NOTE 5) and the
   one-way door once anything is logged on a seeded import (r1 MINOR 3, r3 MINOR 1).
4. **RUNBOOK**: new pre-check 7, the phone must resolve to America/New_York when the import is admitted (mapping r3 MINOR
   4); plus a paragraph on item 6 saying its caveat lifts when P3-IMPORT-UI-2 wires this mapping in. No other edit.

## 2. The module-graph figure (the accepted bundler, scratch entry in the gitignored `.tmp`)

    page alone 121 modules 1 668 175 B law PASS | page + admission BEFORE: build DID NOT COMPLETE (esbuild glob-expanded
    rebuild/engine), 159 only with engine/test stubbed | AFTER 133 modules 1 927 799 B law REFUSES | admission alone 63

**133 modules** - the brief's row E figure exactly. `engine/seed.cjs`, `engine/index.cjs`, `engine/test/**`,
`rebuild/conform/**` and `m4/workout/engine-runtime.cjs` are all ABSENT; the remaining FORBIDDEN names are exactly three,
`engine/migrate.cjs`, `engine/merge.cjs` and `m4/import/*` over six files. The page's OWN law still refuses that graph -
P3-IMPORT-UI-2's ruling, not this ticket's. **A1 still PASSES at 121 inputs: nothing entered the page.**

## 3. Cells per item, and the red side of each (each mutant applied, run, reverted byte-equal, tree clean)

- **(1)** `lanes/d/p3-followons/admission-swap.test.mjs` P3F-0/1/2, 4 cells: a PRE-SWAP COPY of source-admission (one
  import reverted, every other specifier made absolute, in the OS temp folder; the product file only READ) runs the SAME
  admission over the SAME repository - whole view, basis and its five digests deep-equal, summer and winter, and again
  with a NATIVE completed workout so the one branch that calls the runtime is truly reached.
- **(1)** `page-bundle.test.mjs` REWRITTEN, still 4 cells, as its own header demanded of whoever brought the wall down;
  nothing relaxed - swept-in names asserted ABSENT, the page law still RUN and still refusing, over those three names.
- **(2)** `production-mapping.test.cjs` P3-M13 (rewritten) + P3-M16 (new); `production-admission.test.mjs` P3-P4 (end to
  end with nothing derived outside the controller: `material()`'s private copy never called, the digest read back out of
  the committed basis) and P3-P5 (a REVIEWED row on the wrong digest refuses at review and writes nothing).
- **(3)** `retract.test.mjs` P3D-11 (RV-9), P3D-12 (its RED SIDE: the same retract succeeds once no seeded sibling is
  live), P3D-13 (RV-6: retract, re-import, retract again, two records).
- **RED:** revert `:16` -> 7 of 8 red across P3F and P3-B, only P3-B1 (the page alone) surviving; reviewed pin ignored ->
  P3-M13 and P3-P5 red, P3-M16 green; guard dropped -> P3D-11 red; Fable's M7 -> P3D-13 red, which the old ten left GREEN.

## 4. Drift, seal, hygiene, stops

Ten files - `w6/local/{source-admission,import-bundle}.mjs`, `m4/import/production-mapping.cjs` + its two tests,
`page-bundle.test.mjs`, `import-retract/retract.test.mjs`, `P3-RUNBOOK.md`, `p3-followons/admission-swap.test.mjs` (new)
and this report - each findstr'd against `packages/S5.json`: 0 hits, all UNDECLARED; control `today-bindings.mjs` 1 hit,
so `--ci` sees 0 unlisted drift (the :473 custody hole, not a licence: S6 must declare the two runtime files and add both
suites to rebuild.yml). 0 engine bytes, 0 `today/**`, 0 `today-bindings.mjs`, no assertion removed; LF only, 0
CRLF/tabs/trailing WS in all nine source files, 0 non-ASCII added. **STOPS:** `today/build.mjs`
FORBIDDEN is UNTOUCHED and the migrate/merge ruling stays with P3-IMPORT-UI-2 as :475 asks; the mapping still has no
production caller; `b-package --ci --package S5` prints FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP on this base (the tip is now
50aa74e, :477), exactly as both final reviews recorded. Merged onto that tip in a scratch worktree, since removed, it
prints SEAL BASE ON THE TIP, PRODUCT IMPLEMENTED 0 unlisted drift, 10 of 10 children exit 0, PUBLIC CI EVIDENCE PASS.

## 5. Tails (mine, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03)

    retract.test.mjs 13/13 (was 10) | admission-swap 4/4 (new) | production-* 24/24 (was 21) | w7 import 15/15
    local-source-consumer 6/6 | m4/import suite 86/86 (was 83) | W6 586/586 (8 681 ms) | port 65/65
    today-17 by name 666/666 (53 827 ms) | rig187 => PASS | A1 => PASS, 3 assets, 121 pinned inputs, earned-584832560dad
    b-package --ci --package S5 => EXIT 0, FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP (section 4)
