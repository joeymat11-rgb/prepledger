# N1 independent review, round 3, D2, 2026-09-12

FINAL VERDICT: ACCEPT. No remaining blocking findings on this exact head. Supersedes the round-2 review at 08d75c7; this is a lane review, not PM acceptance or merge authority.

Exact Claude candidate rebuild/lane-c-n1 @ a61c851dfa1300a54be2be1ac3debcb6489c11c0, base 63f3a1c. Original N1-NUTRITION-BRIEF.md unchanged; C REQUESTS 16:21 names the changed cells. Own sparse worktree work/lane-d2/review-n1, branch rebuild/lane-d2-review-n1-r3. Brief/bar and prior findings first, independent execution before builder report; effort MAX. No private input.

## Findings and closure
1. R2-1 CLOSED: today-app.cjs:278 foodEntryFor.save preserves the acknowledged result when refresh fails; recordIntake at :747 distinguishes that from an unknown save outcome. The known intake, draft, read failure and read-only retry remain visible. The event promise resolves. retryFoodRead at :793 reads again without submitting another intake.
2. Independent probe executes the ACTUAL foodEntryFor function body over a real food host, rather than restating its save/refresh order. After an acknowledged write and failed read: one durable op, saved feedback, failure reason and draft survive. A failed retry and then successful retry each leave saveCalls=1 and durable ops=1; success clears the failure. Two changed-path mutants (throw away acknowledgment; write again on retry) are killed by this probe.
3. Earlier blocking findings remain closed: clean-init protein intake stays durable and visible while refused engine projection is named; returned refusals carry reason/action; stored time and offset render. The enrollment-bypass finding remains withdrawn. No new blocker found.

## Independent evidence
- food.test.mjs 56/56; combined today/coach/W6/host suites serially 1,280/1,280. Original P1-P12 variants all killed; failed-test counts 4,1,7,7,3,3,3,1,1,16,4,15. P2 is the disclosed over-cap-admission variant, not a full clamping implementation. Restored tracked diff empty; food 56/56 again.
- Build PASS: 3 assets, 107 inputs. food-check.mjs PASS on this head with three verified Edge process kills, correction/reopen/refusal, provenance and 390px/320px checks. Required input/tap dimensions, no horizontal overflow or off-origin requests verified.
- Bindings at rebuild/m3/w6/local/today-bindings.mjs and all four PAGE_PINS files byte-identical to integration 6447987. Candidate has no engine/client/m4/workflow/src edits against 63f3a1c.
- GitHub API independently verified full-head CI 34716744946: Windows and Ubuntu success. CI 34716744942: suite and preview success, production skipped. These are inherited-suite results; food.test.mjs and food-check.mjs remain outside the workflow's enumerated steps.

## Non-blocking residuals
4. CI registration and the pinned unwired-plan sentence remain disclosed follow-up work in the existing custody process. This review grants no pin or workflow waiver. The owner's physical-phone hand test is not performed by this lane.
5. Local B-NTC remains custody-blocked by its traces child's excluded src/history.js dependency, established in round 1. Not rerun, restored or bypassed here. The remote exact-head gate is green; an authorized owner may run the local gate.

Builder report read last: its round-2 acknowledgment/retry claims agree with the independent execution. Executable synthetic probe and command/mutation evidence are in N1-REVIEW-ANNEX.md. The verdict applies only to the full head above.
