# W0-RIGS — publish contracts, rig inventory and early CI

## 0. Authority and scope

Execute PLAN-M3-v1 §2 W0 and §6, and the accepted QUEUE W0-RIGS row. ASTRA owns technical delivery under the owner's 2026-09-06 ruling; cowork independently verifies; Claude Code integrates. One PR, no merge. Base and task claim are in CLAIM.md.

Deliver only `.github/workflows/rebuild.yml`, `rebuild/m3/w0/` and `rebuild/m3/REPORT-W0-ASTRA.md`. The existing deployment workflow and its strict job remain unchanged. No product-rule, frozen app/suite, seed, private fixture, root dependency/lockfile or W5-owned rig edits. A new workflow is authorized by W0's early-CI requirement, not a production deployment.

## 1. Deliverables

Publish a source-pinned contract and rig inventory mapping every M3 done-line and §C case to current assertions, missing boundary tests, owner and required verdict. Reuse the current 34 authority laws, 35 client laws, rig187, authority interop and supplemental tests explicitly; do not relabel synchronous memory tests as D1/HTTP/IndexedDB/phone tests. W5 owns rig190/191 and the shared M3 case runner.

Publish the setup contract W4 needs: settled stack/region/auth/signing/sealing/recovery decisions, exact dependencies and unresolved implementation fields. Pin the public ratified mock once its reported commit is available; its private original is never copied. W6's exact bounded budget and W5 wire fields stay pending their own published contracts.

Add early public CI with no credentials or private fixture access. Run unchanged public law/reference/mutant/adapter assertions and public oracle checks where available, explicitly require authority/client presence, and check archived artifact/coverage integrity. The public job must not print SUITE CONSISTENT or imply the full private oracle/selftest ran. Full `run.cjs`, its selftest and all-three-blob evidence remain required in the integrator's local environment before acceptance/release; no synthetic replacement for the private fixture or changed manifest pins.

Add a frozen-path check against the pinned authorized baseline and a packaging check that builds and inspects the actual old-app ZIP from its unchanged site manifest. No excluded directory may ship. Record the new app's package as PENDING until W7 supplies an actual allowlisted build; W0 must not fabricate SCOPE-FREEZE PASS for unfinished M3.

## 2. Gates

Public CI must fail on an absent/broken required adapter, missing/renamed law, bad archived artifact, changed frozen path or excluded archive entry. Named verdicts distinguish PUBLIC-CONFORMANCE, PUBLIC-ORACLE, FROZEN-PATHS and OLD-PACKAGE from the final M3 SCOPE-FREEZE. Run meaningful disposable fault probes and restore normal inputs.

Local acceptance additionally requires the unchanged `run.cjs` SUMMARY, SELFTEST PASS and `node scripts/check.mjs --strict` with the prescribed preparation; strict runs with MEASURED_TEST_NOW unset. Only private PASS/FAIL lines may enter the report. No acceptance claim from CI alone.

## 3. Report and NEXT

Report what/why, exact source/base/claim, executed verdicts, fault-probe output, public versus private coverage, unfinished M3 boundaries, wall-clock and NEXT. Preserve the existing two task claims. Name W6-BRIEF as proposed next work, not started implementation; record any additional readiness learned from the integrated queue/mock bundle. Cowork checks the actual PR; no self-acceptance.
