# Post-fix gate brief — ASTRA

2026-09-06. Documentation proposal on `rebuild/m2-postfix-brief`, from integration `811d1c0a34756b12e2ebf56163e3c018672797ed`. No engine repair, new runner, owner disposition or independent acceptance is claimed.

## 1. What and why

`BRIEF-POSTFIX-GATE.md` proposes the acceptance contract needed before repairing the extracted engine. The original audit intentionally requires all 45 defects to remain RED; it cannot accept a repaired candidate. Its repair controls prove test sensitivity and must never substitute for actual product fixes.

The first proposed repair package is D33–D35 (import guards), pending the owner's disposition and a concrete behavior brief. The new gate must keep the original audit, source, suite and goldens intact; check the real candidate; and accept only individually reviewed changes. All 45 defects and the queued non-defect suite findings remain accounted for.

## 2. Evidence and challenge

Read the actual audit at PR30 `614e20315b01543d3b7bbc4fa1fe8a5c20bcb690`, extraction checks, current engine and accepted master prompt. Same-family source review and synthetic in-memory probes identified five necessary clarifications: explicit baseline/package states; exact assertion and change accounting; compatible old-law adapter calls; migration return/input cuts; and the real pristine-seed/restore-offer path.

Those clarifications are incorporated. The probes established that a real fresh migrated seed is pristine, supported old migration can return another object, and the old audit trace collapses aliases, key order and an undefined/tag distinction. They did not run the proposed gate or any private fixture. Cowork has not accepted this new brief.

## 3. Scope and verification

This PR adds exactly this report and the brief under `rebuild/m2/`. No product, test, queue, ledger, dependency, root lockfile, frozen app or seeded soak changes. Executed `scope-package.mjs`: `FROZEN-PATHS PASS — pinned authorized base; committed and working copy`; `OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified`; final `SCOPE-FREEZE PENDING`. Whitespace check passed; status contains the two named new Markdown files only. Full private/candidate repair gates are not claimed for a documentation proposal. The eventual implementation's required gates and negative witnesses are specified in the brief.

## 4. Seams and uncertainties

The D33 correction-coverage algorithm and D34 compared record families need the future repair brief. An unexpected current-oracle or second-gate difference requires a precise reviewed successor expectation; preserving old goldens does not mean silently skipping a contradictory check. The final suite-v4 tranche remains separate. Estimated repair hours come from the audit register and are not observed build time.

## 5. NEXT

Cowork reviews this exact brief against the accepted audit and engine. Its acceptance resolves the successor-gate portion of OPEN-FIX/OPEN-V4 only; M2-FIX still requires actual owner dispositions and the selected theme brief. Root retains this documentation claim for review corrections; the sole W6 builder continues its separately owned stream. No builder merge. Publication/check interval: 07:50–07:51 UTC (worktree creation and observed clock); earlier parallel research/probes were not separately timed and are not represented as fresh test execution.
