# Review/integration efficiency pilot - ASTRA preparation report

## 1. What and why
Prepared one small operational amendment after the owner asked how to proceed with the completed efficiency research. It proposes automation of repetitive evidence collection and nonbinding Opus/Sonnet comparisons inside the existing three-change pilot. The current independent reviewer and integrator retain their respective execution/acceptance duties.
No model, effort, account setting, paid run, new schedule, product behavior, acceptance rule or expected value changed. The proposal is not accepted or implemented by this PR.

## 2. Base and file map
Branch `rebuild/review-efficiency-pilot` from verified integration `213300c6c49f772dcb2ff859e1c1375dd571b837`.
Exactly two additions: `rebuild/process/BRIEF-REVIEW-EFFICIENCY-PILOT.md` and this report. Existing development worktrees, owners, draft PRs and paused continuation remain retained.
The brief defines role boundaries, zero-extra-spend launch conditions, an initial calibration set, three unseen comparison changes, complete failure reporting and a separate reviewed adoption decision. It does not add a release gate or authorize a default model switch.

## 3. Executed gate output
The unchanged checks ran in a real dependency directory. Required private fixture/golden preparation remained local and emitted verdicts only; public manifest/goldens are unchanged.
```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
```
All four commands exited 0. Scope 0.264s; conformance 7.038s; selftest 22.746s; strict 47.846s.
Conformance/selftest used `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, and explicit `ENGINE_MAIN`/`ENGINE_OLD`; strict ran with `MEASURED_TEST_NOW` unset. No frozen suite edits or fixture substitutions.
Preparation reused byte-verified frozen main/old artifacts from the retained module-2 build. The private golden was regenerated with the unchanged oracle in an isolated scratch mirror, package stamp normalized to committed pins, and every complete public/private golden pin verified. No private values/hashes were printed or committed.
`git diff --check` passes. Direct comparison to the recorded base confirms frozen app, product directories, conformance files, lockfile and seeded soak unchanged. Existing CI will run on publication; exact-head CI results are separate from these local verdicts.

## 4. Independence and negative checks
A retained same-family helper checked the proposed brief against FINISH-PROMPT and BRIEF-POSTFIX-GATE and found no concrete defect. This is preparation QA, not Cowork's independent acceptance.
No new product or wrapper was built; no new bite or calibration execution is claimed. Later automation requires its own scoped implementation and effective negative tests; this PR never relabels an existing test run as a model-comparison result.

## 5. Seams and limits
Read-only account inspection supports preparing an included-allowance trial; account amounts and settings remain outside the public report. Remaining allowance alone cannot prevent paid fallback, and no actual model entitlement/launch control has been exercised.
The owner's prior instruction preserves model settings. Approval to prepare this proposal does not supersede that instruction; obtain explicit authorization for the concrete model and zero-paid-fallback configuration before executing the trial.
The current authoritative review route is retained. A stopped reviewer is not replaced by a shadow model. Product work may continue only through existing accepted/published-contract permissions; this proposal neither resolves current recovery/workout blockers nor delays their eligible work.

## 6. What is unsure
Actual per-change savings, review miss rates, model/harness compatibility and no-credit controls remain unproved. The 20% target is a hypothesis. Three comparisons cannot establish equivalent quality, and no outcome changes models automatically.
GitHub/model account controls must be checked in the intended environment before use; Claude Code routing is not assumed to configure Cowork. No new research loop is needed to prepare that bounded operational choice.

## 7. Wall-clock and NEXT
Worktree preparation began `2026-09-06T23:59:02Z`; the four mandatory local commands used 77.894 seconds in total. This is preparation/test elapsed time, not a billing statement or a forecast of app completion.
NEXT: publish this one PR for the existing reviewer route; update only the existing compact checkpoint with its pending status. Present the concrete zero-additional-paid-usage model-trial choice in the existing owner conversation. Do not send a duplicate review task or start a paid run. Preserve the retained D30/workout briefs and R1/W6 dependencies.
