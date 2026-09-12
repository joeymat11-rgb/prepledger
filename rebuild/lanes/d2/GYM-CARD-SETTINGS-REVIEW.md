# Gym-card settings independent review, round 3, D2, 2026-09-12

FINAL VERDICT: ACCEPT. No remaining blocking findings on this exact head. Supersedes the round-2 review at db30e96; this is a lane review, not PM acceptance or merge authority.

Exact Claude candidate rebuild/lane-c-settings @ ea78c24b8c1efd987c62ebfaad923026dac5d262, base 63f3a1c. Original GYM-CARD-SETTINGS-DISPLAY-BRIEF.md unchanged; C REQUESTS 16:21 names changed cells. Own sparse worktree work/lane-d2/review-settings, branch rebuild/lane-d2-review-settings-r3. Brief/bar and prior findings first, independent execution before builder report; effort MAX. No private input.

## Findings and closure
1. R2-1 CLOSED: gym-app.mjs:100 leaveCard relinquishes mount ownership before every Back/check-in/finish navigation callback. show at :192 and paint at :504 refuse after ownership is lost, including after the asynchronous model read. A late settings result can update its cache without replacing the destination screen.
2. Independent real-workout probe drives actual Back and check-in controls, each with delayed read success and failure. All four combinations preserve the destination and its half-entered draft; the old log control never returns. Reintroducing retained ownership is killed by that probe.
3. Earlier blocking findings remain closed: pending reads do not hold up the card or logging, failed reads never claim confirmed-empty settings or seed a replacement editor, and real log-handler tests cover absent settings and unsaved editor text. S-M6's settings-required log-handler variant is killed by four tests. No new blocker found.

## Independent evidence
- machine-settings-ui.test.mjs 51/51; combined today/coach/W6/host suites serially 1,275/1,275. All ten original S-M1 through S-M10 variants killed; failed-test counts 5,7,3,4,1,4,1,4,38,5. Restored tracked diff empty; settings 51/51 again.
- Build PASS: 3 assets, 107 inputs. machine-settings-check.mjs PASS on this head with three verified Edge process kills, correction/cancel/reopen, Back-to-Today, real logging with the editor open, and 390px/320px checks. Input/tap dimensions, one primary action, no horizontal overflow or off-origin requests verified.
- Bindings at rebuild/m3/w6/local/today-bindings.mjs and all four PAGE_PINS files byte-identical to integration 6447987. Candidate has no engine/client/m4/workflow/src edits against 63f3a1c.
- GitHub API independently verified full-head CI 34715966705: Windows and Ubuntu success. CI 34715966766: suite and preview success, production skipped. These are inherited-suite results; the new settings suite/check remain outside the workflow's enumerated steps.

## Non-blocking residuals
4. CI registration remains disclosed follow-up work in the existing custody process, not a workflow waiver from this review. The owner's physical-phone hand test is not performed by this lane.
5. Local B-NTC remains custody-blocked by the excluded src/history.js traces dependency established in round 1; not rerun, restored or bypassed. Remote exact-head gate green. An authorized owner may run the local gate.

Builder report read last: its mount-ownership claim agrees with independent execution. Executable synthetic probe and command/mutation evidence are in GYM-CARD-SETTINGS-REVIEW-ANNEX.md. Any rebase after N1 produces a different review head; this verdict does not assert that future combined tree has already been checked.

## Rebase delta, 2026-09-12, supersedes exact-head limit above
FINAL VERDICT: ACCEPT at rebuild/lane-c-settings @ 8672875d033fcbd9bbd91c7e89c3bd8143dff7ff on N1 integration 358f4eb. This extends the product review to the combined tree only. It does not review an unposted CI-inventory edit or grant PM integration authority under :177.
Independent delta inspection: settings product/test bytes unchanged from ea78c24; build REQUIRED_INPUTS and declared-copy unions retain both N1 and settings. Bindings/four PAGE_PINS/workflow bytes unchanged from 358f4eb. Serial today/coach/W6/host regressions 1331/1331; actual-control Back/check-in x late read success/failure probe 4/4. Final build PASS, tracked diff empty. Both food-check and machine-settings-check PASS on this head, three verified process kills each; normal correction/refusal/reopen and navigation hold on the combined build. Original mutation evidence remains applicable to byte-identical settings code; no new mutation claim.
GitHub API verified full-head CI 34720335776 (Windows/Ubuntu success) and 34720335748 (suite/preview success, production skipped). Builder's re-pin paragraph read after execution; claims agree. Suite enumeration remains absent on this head and :177 assigns its separate edit/review; no CI-inventory candidate was posted at review time. Return that exact head for the priority inventory check.
