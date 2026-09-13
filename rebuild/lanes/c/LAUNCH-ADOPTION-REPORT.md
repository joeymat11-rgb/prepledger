# Astra C: launch adoption candidate

Authority: DECISIONS:194, :196, :197 and :199; prospective bar: astra/LAUNCH-HOTFIX-ADOPTION-BRIEF.md.
Candidate is the commit carrying this report on rebuild/astra-c-launch-adoption. It is not an acceptance or release.
Exact publication receipts follow in rebuild/lanes/c/LAUNCH-ADOPTION-RECEIPT.md on the coordination branch; report-only publication does not stand in for executing that exact candidate.
The original HOTFIX-DIRNAME.md is historical builder evidence at 4c19239, not this candidate's measurements.

## Change and custody

Adopt the old builder's guarded plain-copy path. In a browser, the fallback avoids evaluating the absent Node global.
build.mjs rejects bare dirname/filename/require reads in attributed repository modules and fails closed without enough attribution.
Its exemptions now require typeof dirname/filename === string or typeof require === function; an undefined true branch is unsafe and is refused.
This is a narrow static guard, not proof against every browser incompatibility. Vendored modules remain excluded.
copy.test.mjs executes the actual emitted bundle without Node globals, reinstates the original crash in that bundle, and checks attribution/unsafe-guard negatives.
Scratch plants are unique per call; neither sibling suite nor Node's require cache can reuse another plant's path.
gym-app.mjs retains each draft's refusal across repaint, fences handlers/results by draft identity, and clears only the submitted draft on success.
The existing settings test adds held-read refusal and late-old-result cases, plus actual-completion waits for only the routed S7/S8 and D2.1 boundaries.
machine-settings-check.mjs changes only openCard: visible block plus bounded opener-enabled readiness. Every data/layout/kill assertion is unchanged.
LAUNCH-ADOPTION-PROBES.mjs is runnable synthetic evidence for :199, not a new CI test file or browser-kill witness.
No engine, client, m4, conform, workflow, binding, pinned package-test, history or private data change; no main/relay deployment.

## Executed before publication

Baseline product bytes at b36cc1d: fresh earned-1e4d3c938f09; real Edge boot FAIL with __dirname is not defined.
Baseline bundle sha256: 67bf9005bddaaed3e4908b4bce617f25bbf198650bac95752b6dd6485646af22.
Original emitted-bundle crash reinstatement is caught by the VM regression; wrong-depth attribution still refuses the plant.
Guard negative was RED before correction (1 assertion failure); corrected copy suite 38/38, zero skips. Six isolated guard controls agree 6/6.
New settings cases before the runtime fix: 1 pass / 2 assertion failures (erased refusal; old success cleared replacement draft).
After the fix: settings 54/54, zero skips; actual invalid draft and operation/outbox invariants retained.
At runtime source 0d2ffc019131865a2d030ce02acc0510bf5a33db, the exact rebuild.yml 13-file Today step passed 552/552 three consecutive times, zero fail/cancel/skip.
That fresh build: earned-b6acba5d032b, 110 inputs (13 engine, 12 client), 3 assets, 68 bound classes, 2 pinned fonts.
Bundle sha256: a622171f9bf82ce52204a577bd8ed6de66f168b683f0278e4ddf1d62174a63f8.
First five browser flows passed there; official machine-settings check FAILED at 320px relaunch, [] versus Seat/five. This was not a 6/6 result.

## Readiness witness and final receipt requirements

Before tracked harness edit, save Seat/five with the real public producer, close/reopen the same encrypted fake-indexeddb installation, hold its actual latest result.
Held: original visible-block predicate true, opener disabled, displayed pairs [], original equality fails, workout Log enabled.
Release the same result: opener enabled, identical equality passes Seat/five, settings ops 1 -> 1. No retry write or invented record.
The preserved annex repeats these two phases over real public client/storage code in jsdom. It does not execute a real browser shutdown.
An untracked real-browser harness copy with the readiness wait passed all original assertions and three real kills; that diagnostic is not the official final result.
The added readiness predicate does not wait for expected pair contents: known missing/wrong values still reach the unchanged assertions; failed reads remain disabled and time out.
Final exact-candidate receipt must record fresh build/hash, official six browser verdicts including three settings profile kills, named suite count, both-OS rebuild CI run/jobs, and custody/preflight.
B alone runs the unchanged H3/cumulative gate under :196. C has not run that private-reading gate; historical builder gate prose is not C's receipt.
D2 independently executes/reviews this final candidate, including the added harness path. A third integrator checks the merged tree after PM judgment.
Physical iPhone behavior is not proved by Windows Edge. N2's rejected sleep work remains a separate next package.
