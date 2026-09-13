# Astra C launch guard: round 2 preparation

Status: C correction prepared; final composition, review, gate, CI and integration remain pending.
Own tree work/pm-caretaker/c-launch-r2, branch rebuild/astra-c-launch-r2. R1 candidate 2b9b09a remains preserved.
Guard/test source commit: b538473c70166384b9a61895e6ad41c3200b81c4. This report-only descendant does not substitute for final exact-candidate execution.
Authority: original :194 build/test custody; D2 final R1 report at b38a1767ccc919232fb7d49f4c2da9e836480822 read before this report.

D2 finding 1 reproduced: executable code before the first banner was silently discarded by the segment parser, despite enough attributed modules elsewhere.
The new existing-file regression prefixes the actual emitted bundle with the same absent-global read and proves the VM throws; the original guard incorrectly accepts it.
RED before fix: 1 test, 0 pass, 1 assertion failure, 0 skips (Missing expected exception); .tmp/prelude-red.log.
Fix: retain the unattributed prelude and wholly unattributed script assets as scan segments. Scan them without increasing the owned-module count; label offences as unattributed.
The >20 owned-module floor, permitted typeof guards, vendor exclusion and original attributed-defect controls remain unchanged.
Negative controls cover dirname, filename and require in both a prelude and a separate JavaScript asset; positive controls preserve safe guarded preludes/assets and the actual clean bundle.
Source delta from R1: build.mjs and existing test/copy.test.mjs only, 39 insertions/7 deletions. No extra test filename, workflow, runner, pin or product-runtime file changed.

On the code/test bytes committed as b538473: copy 39/39 and the exact rebuild.yml 13-file Today step 553/553; zero fail/cancel/skip. Logs .tmp/prelude-copy-green.log and .tmp/r2-step15.log.
Fresh build passes: earned-b6acba5d032b, same 110 inputs and 3 assets; app SHA256 a622171f9bf82ce52204a577bd8ed6de66f168b683f0278e4ddf1d62174a63f8.
This matches the R1 emitted app. The R1 six official browser passes and D2's six independent settings controls remain evidence for those bytes; final-composition fresh-build/six-browser proof is still required.
R1 reports/receipts remain historical, including its original 320px failure, held-read diagnosis and final 20 verified browser kills.

B's unchanged R1 gate and both CI runners refused SEAL-BASE-IS-NOT-THE-CHAIN-TIP before any suite/census; this is :145 ancestry, not a settings/engine-law verdict.
No same-head H3/CI rerun was requested; C has not executed the private-reading gate or changed its refs, runner or pins.
Preflight :200 is D's separate correction, with independent D2 review. C keeps full runtime/UI custody and the recorded 26-unchanged-line FAIL; no application comment/regex cleanup or manual PASS.
PM's GATE-WINDOW.md is PREPARING. Wait for named composition/base/GO before importing D tooling, publishing a final candidate or requesting B/exact-head both-OS evidence.
During the active window, coordination stays on own branches/direct messages so the named integration ancestor stays stable. No self-acceptance or integration.
N2 remains next after accepted launch integration; physical iPhone behavior remains unproved.
