# M2 post-fix gate infrastructure — ASTRA

## 1. What and why

This is the **BASELINE phase only** of accepted `BRIEF-POSTFIX-GATE.md`. It preserves the original audit as historical evidence and establishes a separate, explicit candidate loader and fail-closed test infrastructure before any product repair. No D-ID is approved or implemented here; no product declaration, receipt, oracle expectation or source-fidelity exception changes. M2 and full suite v4 remain open.

Branch `rebuild/m2-postfix-gate`; unique coordinator claim recorded before edits at 2026-09-06 08:10 UTC. Initial verified base was `4e561e5cea692468638a5d0096194f55d49f99e8`; before publication it fast-forwarded to actual accepted integration **`5310f6206ee61d8b9a62446d30f910b159591b6f`** (accepted W5, PR34 and the docs-only PR35 queue refresh). The manifest pins that base, audit `614e20315b01543d3b7bbc4fa1fe8a5c20bcb690`, extraction `ef83543aa825fb581671951d287854166717ad28`, frozen `fe516c1` / app blob `f98671d823f0d8cd83e730cdd930afe5f5e7b628`, and accepted brief `45d52cbbde5290d6a1f09e8dbfabf2777076e537`.

The exact cowork acceptance line is verified from `git show 5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/DECISIONS.md`, not from an existing filename or uncommitted text. Its SHA256 is `f14f5e9280bc4a4316757ccfb5ed68e57152f8913bbe6979d6c1ad4f2cefac52`; the brief file SHA256 is `a5ab10cd91e4c692c8d079e87952df7e64671a28bcb10079365288387cb45797`. Actual owner/theme authorization fields are null. `requiredIds` preserves the intended D33/D34/D35 package; `selectedApprovedFixIds: []` records the absence of approved fixes. Those are separate concepts.

## 2. Scope and implementation

Exactly six new files under `rebuild/conform/v4/postfix/`, plus this report:

- `target.cjs`: explicit inventory/hash-checked candidate factory in fresh child processes; real internal E graph; unchanged old raw-law bodies; separate legacy B adapter; ordered typed object/alias traces; no fallback or repair helper in candidate execution.
- `run.cjs`: fixed all-45 and non-D inventories, phase/base/receipt/source preflight, unchanged original audit, real current-candidate raw comparisons and mandatory existing engine/frozen gates. PACKAGE exits 2 while its concrete acceptance work is absent.
- `manifest.json`: exact public source/case/contract pins and truthful UNRULED/PENDING rows. Version 1 claims no accepted repaired candidate or manifest review.
- `laws/import-guards.cjs`: required D33/D34/D35 case and fault inventories, explicitly PENDING. Its `run` throws `THEME-CASES-PENDING`; it cannot supply a test control or GREEN repair.
- `legacy-gates.cjs`: exact baseline fidelity and gate helpers, exact ledger-line verification, assertion occurrence accounting, bounded exact synthetic delta validation, disposable actual source mutations with executed-declaration coverage and restored-source checks. No declaration exemption or legacy case replacement exists yet.
- `test/runner.test.cjs`: 73 synthetic infrastructure tests, including real internal host calls, fresh processes and real on-disk mutants. These are infrastructure fixtures, not approved D33–D35 implementations.

All candidate module imports must remain in the explicit hash inventory. Source pins also include the unchanged original audit, engine tests, fixtures/oracle/laws, frozen source and tools/scripts/package inputs; deleting a descriptor pin cannot silently reduce that inventory. No product, existing audit seed/helper/runner, conform law/oracle/manifest, frozen app, package lock, other worktree or seeded soak file changed.

## 3. Reproduction and gate output

Executed on Windows with Node 24.19.0, real `node_modules` directories and existing esbuild 0.28.1; no new dependency or lockfile change. The runner builds public frozen main/old bundles from pinned Git source into ignored `.tmp/postfix/reference/`, then prints the explicit ENGINE_MAIN/ENGINE_OLD paths and `MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York`. Strict runs with MEASURED_TEST_NOW unset. Raw candidate children receive neither reference engine path.

Use a clean original checkout at the audit SHA above, with its real root dependencies installed from its unchanged lockfile. At the candidate root, perform AGENTS' authorized private fixture preparation; the existing portable W5 build/preparation tools are available on this base. Preparation produced only the permitted verdict: `GOLDEN PREPARATION PASS public byte-identical after engine stamp normalization; private committed hash matches; manifest pins restored`. Private raw data and goldens remain ignored/local. No LIVE predicate or health values were read for this infrastructure task.

```text
node --test rebuild/conform/v4/postfix/test/runner.test.cjs
node rebuild/conform/v4/postfix/run.cjs --manifest rebuild/conform/v4/postfix/manifest.json --baseline <clean-audit-checkout> --candidate rebuild/engine
node rebuild/conform/v4/postfix/run.cjs --manifest rebuild/conform/v4/postfix/manifest.json --baseline <clean-audit-checkout> --candidate rebuild/engine --phase PACKAGE
```

Full runtime gates below ran on `095ddf12f6aea70d6625a4ca6ac3c38bd0ec4084`. The final fast-forward to `5310f6206ee61d8b9a62446d30f910b159591b6f` changed only DECISIONS.md, QUEUE.md and REPORT-QUEUE-DELIVERY-ASTRA.md. Exact source preflight confirmed unchanged runtime/test inputs and the same acceptance line; all 73 tests, the actual stale-base rejection and PACKAGE exit 2 were rerun on that final base. No private gate was repeated for this docs-only movement.

The first two commands must exit 0; the third must exit 2. The baseline command has no skip/partial gate flag. Missing authorized private preparation is BLOCKED, never silently replaced with synthetic input. Child diagnostics are retained only in ignored `.tmp/postfix/gates/`; public output contains verdict lines.

```text
TOTAL 45 laws · 45 RED-frozen · 45 RED-candidate · 90 GREEN repair controls · 104/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST PASS
RAW BASELINE PASS 45/45 IDs; 90 exact mode comparisons; zero repair controls in candidate execution
LEGACY migrate-source PASS | MIGRATE SOURCE PASS: 93 exact declarations / 2291 source lines; three authorized ID/instant rewrites; 57 patches in source order with ascending table
LEGACY merge-source PASS | MERGE SOURCE PASS: complete 1082-line frozen range / 42 declarations; only _stampCorr clock substitution; pass order and comments exact
LEGACY writers-source PASS | WRITERS SOURCE PASS: 90 declarations / 2594 source lines; 30 authorized clock substitutions; exact bodies/order/header/exports
LEGACY witnesses-1 PASS | DEFECT WITNESSES: 10/10 reproduced; behavior intentionally unchanged
LEGACY witnesses-2 PASS | DEFECT WITNESSES 2: 11/11 reproduced; behavior intentionally unchanged
LEGACY witnesses-3 PASS | DEFECT WITNESSES 3: 5/5 reproduced; behavior intentionally unchanged
LEGACY witnesses-4 PASS | DEFECT WITNESSES 4: 5/5 reproduced; behavior intentionally unchanged
LEGACY witnesses-5 PASS | DEFECT WITNESSES 5: 4/4 reproduced; behavior intentionally unchanged
LEGACY witnesses-6 PASS | M6 preserved defects native: 4/4 PASS; frozen and candidate execute every merge witness.
LEGACY witnesses-7 PASS | PASS 5 preserved writer defects; 18 exact frozen/candidate call pairs; native Date
LEGACY migrate-differential PASS | M5 SYNTHETIC native: PASS — 126 exact differential cases; 64 migration exits/repeats; identity, receipt bytes, draft scans, seed/ID isolation, real mint and boot boundaries.
LEGACY merge-differential PASS | M6 SYNTHETIC native: PASS — 152 exact whole-state differential cases; 17 two-device scenarios, both directions, repeat batch twice, two injected clocks; complete returns/inputs/aliases/receipts.
LEGACY writers-differential PASS | M7 WRITERS native: PASS 84 scenarios / 314 call cuts / 27 methods; two clocks; full returns/errors/arguments/state/aliases/receipts.
LEGACY merge-laws PASS | PASS exact sync-laws source: tools/sync-laws.mjs:37 via PL_ENGINE; 18 named laws GREEN in both candidate Date modes
PASS M2-5 actual full oracle Date=frozen: all ten required law IDs; all three blobs
PASS M2-5 actual full oracle Date=unfrozen: all ten required law IDs; all three blobs
LEGACY migrate-full PASS | PASS M2-5 full migration gate: actual full oracle and exact post-state supplement; all three raw blobs; both Date modes
SECOND GATE candidate surface: byte-identical to committed baseline (123077 bytes)
LEGACY second-gate PASS | SECOND GATE candidate: PASS; exact original harnesses; July lazy-clock bridge; closed synthetic I/O; manifest .tmp/m2-second-gate/candidate-manifest.json
INFO 9 engine-track rig185: W1 PASS, W2 PASS
LEGACY conformance PASS | SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
LEGACY selftest PASS | SELFTEST PASS
LEGACY strict PASS | All checks passed. Safe to ship.
POSTFIX TOTAL 45 UNRULED / 0 APPROVED-FIX / 0 PRESENT / 0 KEEP / 0 DEFER / 15 non-D OPEN; theme cases and deltas PENDING
BASELINE PASS / FIXES PENDING
SECOND GATE candidate FINAL108: 3072 passed, 0 failed
SECOND GATE candidate SYNC-LAWS: 18 laws hold across 59 committed seeds · superset exemption taken 8× (14431, 14433, 14434, 14435) — convergence, associativity, idempotence, non-shrink, correction survival, athlete-word priority, stamp/value coupling, load-on-ladder, receipt truth, reseed integrity
  PASS  engine suite — 3072 assertions passed
BASELINE PROCESS EXIT 0
RUNNER TESTS 73/73 PASS
```

## 4. Candidate inventory and preservation

The unchanged historical runner confirms RED on frozen and accepted extracted engines, with its original 90 repair controls and 104 mutant executions. Those historical controls are not repaired product evidence. The new target then invokes only each original seed's raw `run` on a clean pinned extracted baseline and the current real candidate, in separate processes for both frozen/native Date modes. Every call cut preserves arguments, return/error, post-input mutation, ordered properties, identity/alias and receipt bytes; all 90 comparisons match. Typed trace unsupported values/prototypes fail closed rather than normalize silently.

```text
D1 P-D1-first-targets-fit-current-set-count | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D2 E-D2-invalid-set-count-stays-quarantined | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D3 P-D3-volume-receipt-belongs-to-whole-lift-name | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D4 P-D4-other-lift-earn-cannot-spend-sightings | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D5 P-D5-ladder-minimum-counts-distinct-rungs | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D6 P-D6-deload-preserves-absent-load | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D7 P-D7-anchor-and-trend-exclude-future-sessions | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D8 D-D8-stale-sleep-does-not-claim-current-debt | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D9 E-D9-split-selects-latest-effective-date | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D10 E-D10-calendar-week-is-seven-calendar-dates | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D11 E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D12 E-D12-step-slope-keeps-per-thousand-units | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D13 E-D13-energy-density-cache-tracks-relevant-state | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D14 E-D14-current-rate-uses-missing-drip-default | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D15 E-D15-session-frequency-does-not-change-with-food-row-density | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D16 E-D16-seven-day-forecast-does-not-grade-a-month-late-read | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D17 E-D17-undone-adjustment-is-not-described-as-applied | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D18 P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D19 P-D19-inclusive-break-end-prose-agrees-with-active-day | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D20 E-D20-forecast-refreshes-after-an-observed-rate-change | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D21 E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D22 E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D23 E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D24 E-D24-partial-yesterday-remains-owed-until-calories-are-present | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D25 E-D25-zero-protein-successes-cannot-be-a-good-protein-read | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D26 E-D26-today-model-refreshes-when-the-calendar-day-changes | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D27 P-D27-maintenance-is-not-described-as-a-long-stalled-cut | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D28 E-D28-programme-volume-follows-the-current-effective-split | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D29 P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D30 P-D30-first-set-trend-respects-the-recorded-technique-era | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D31 V4-volume-tolerance-post-change | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D32 V4-volume-replication-same-era | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D33 V4-guard-record-identities-and-sets | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D34 V4-pristine-compares-record-content | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D35 V4-unknown-schema-return-untouched | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D36 V4-curl-receipt-prices-actual-vector | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D37 V4-merge-earned-receipt-historical-asof | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D38 V4-merge-preserves-written-trial-decisions | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D39 V4-merge-preserves-offer-dismissal | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D40 V4-daily-conflict-direction-independent | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D41 V4-load-writes-advance-per-set-vector | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D42 V4-break-undo-restores-scale-effect | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D43 V4-owned-session-retains-entered-load | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D44 V4-volume-receipt-requires-actual-change | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
D45 V4-analyst-effort-rule-matches-writer | RED-original / RED-candidate; frozen+native trace PASS | UNRULED / PENDING
```

The four-entry mode/clock matrix declares future direct acceptance requirements. This BASELINE run executes every raw law in both Date modes at its original matching clock. Synthetic adapter tests separately exercise the nondefault clock, a mutated clock object and independent engine instances in fresh children in both modes. It does not claim that unimplemented D33–D35 direct cases have run that matrix.

## 5. Fail-closed tests and deliberate bite

All 73 tests passed. Tests reject missing/duplicate/unknown IDs and options; empty package inventory; invalid disposition/implementation pairs and dependency cycles; stale integration base; wrong or absent ledger content/disposition; uncommitted authorization; missing/wrong/imported candidate modules; repair-control state; no-call/empty-output targets; missing/duplicate assertion observations; unlisted/overlapping/unused deltas; trace alias/key-order/tag collisions; unchanged, inert, syntax-error or unexecuted-declaration mutants. A genuine on-disk synthetic fault fails its named behavior through the internal host call, not merely a source-pin check. A deny-all substitute fails a positive case.

One deliberate infrastructure bite used a disposable copy: replaced the candidate loader's SHA assertion with `if(false)`. The intended test failed; then the original target bytes were restored and all 73 tests passed again. Actual candidate product/test files were never changed by the bite.

```text
✖ candidate file hash and missing module are enforced
AssertionError [ERR_ASSERTION]: Missing expected exception.
BITE RED: test process exit 1
BITE RESTORED: 072dea5bbc7979e2aa6b038ada3882c80e514da5ee092674887705869d35ed75; tests PASS
Actual candidate target unchanged: true
```

Synthetic mutation fixtures generate their own local Git repositories and fake ledger lines. They neither authorize a real D-ID nor use the private ledger. Mutation copies are confined to the declared ignored scratch directory; source verification before/after each mutation and fresh restored execution are required.

## 6. Seams and exact remaining package work

This version deliberately cannot emit `POSTFIX PACKAGE PASS`, even if someone fills JSON fields with APPROVED-FIX/PRESENT. Actual PACKAGE output is:

```text
PACKAGE BLOCKED D33 requires APPROVED-FIX/PRESENT
PACKAGE BLOCKED D33 actual reviewed cases/mutants/source/output deltas pending
PACKAGE BLOCKED D34 requires APPROVED-FIX/PRESENT
PACKAGE BLOCKED D34 actual reviewed cases/mutants/source/output deltas pending
PACKAGE BLOCKED D35 requires APPROVED-FIX/PRESENT
PACKAGE BLOCKED D35 actual reviewed cases/mutants/source/output deltas pending
PACKAGE BLOCKED successor reviewed manifest, concrete import-guard cases and declaration/legacy-case carriers not implemented
POSTFIX PACKAGE BLOCKED / FIXES PENDING
PACKAGE PROCESS EXIT 2
```

Before product repair: obtain actual owner dispositions, an independently accepted import-guards brief, and a reviewed successor manifest. That brief must define D33's real correction coverage, D34's compared/derived families and marker host, D35's exact supported/newer schema contract, and concrete composition/receipt/alias expectations. Then implement the declared direct positive/negative cases and actual product mutants, exact reviewed declaration/binding/output deltas, and case-by-case legacy carriers preserving every unaffected original assertion. None is replaced by this version's synthetic range-check demonstration.

The source/delta/assertion/mutation helper APIs are tested only on declared synthetic fixtures; full PACKAGE orchestration and exact legacy declaration/case replacement remain PENDING. The manifest contains no source/output delta exceptions. No proposed repair has been compared directly GREEN on actual product, and no D33–D35 behavioral mutant earns a count here. The current original source/defect/differential gates pass because no product has changed. Future expected defect mismatches must be explicitly superseded per accepted brief; an old runner's failure cannot become a PASS label.

Both full three-blob oracle modes, migrate-full, complete second gate, sync laws, engine-surface baseline and migration/merge/writer differentials remain unchanged requirements for D33–D35. Any concrete conflicting receipt/DTO/assertion needs a narrow reviewed expectation amendment; this infrastructure grants none. The frozen conformance/strict runs prove their own frozen/package boundaries alongside, not in place of, actual candidate checks.

## 7. Non-D obligations retained

All 45 D rows remain UNRULED/PENDING. These separate fixed manifest IDs remain OPEN; later findings require an explicitly reviewed successor manifest version, and overlap with W5/W6 is not automatic completion:

| ID | Status | Pinned source |
|---|---|---|
| T2-serialized-restart | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/ROADMAP.md` M0 lines 54–56 |
| T2-unsigned-pull | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6e |
| CANONICAL-v2-decimals | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/ROADMAP.md` M0 lines 54–56 |
| RIG185-rename-shape | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/ROADMAP.md` M0 lines 54–56 |
| ENGINE-explicit-defaults | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/ROADMAP.md` M0 lines 54–56 |
| SYNC-all-MERGE_ARR | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/DECISIONS.md` line 20 |
| REVIEW-Sol-v3 | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/ROADMAP.md` M0 lines 54–56 |
| REVIEW-Grok-v3 | OPEN | `5310f6206ee61d8b9a62446d30f910b159591b6f:rebuild/ROADMAP.md` M0 lines 54–56 |
| T3-6a | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6a |
| T3-6b | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6b |
| T3-6c | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6c |
| T3-6d | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6d |
| T3-6e | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6e |
| T3-6f | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6f |
| T3-6g | OPEN | `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md` §6g |

## 8. Limits and wall-clock

Linux independent execution is PENDING cowork review. No phone, provider, deployment, native feasibility, CLOCK, private-port or final-v4 verdict is claimed. The source-pinned loader is an acceptance target selector, not a security sandbox for hostile JavaScript. Exact typed traces cover observed call arguments/results/errors; they do not claim coverage of every hidden internal branch. Real fault execution is separately checked using Node V8 coverage in the synthetic mutation tests.

Claim/start: 2026-09-06 08:10 UTC. Final build/gate/report preparation completed 2026-09-06 08:34 UTC; elapsed approximately 25 minutes. This measures this infrastructure preparation only, not independent review, PR integration or app completion.

## 9. NEXT

Unblocks: independent execution/review of this BASELINE infrastructure; then the first import-guards theme can use a concrete reviewed acceptance foundation once its owner dispositions and behavior brief exist. Astra next: the coordinator's next published unblocked item; D33/D34/D35 product repairs remain blocked on those dispositions and accepted theme requirements. No new product stream, automatic FIX approval, M2 CLOSED claim or merge is authorized by this PR.
