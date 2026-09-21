# Gym settings writer seal build report

Builder: Sol
Base: b35a48e35a1f3e3c278c377934794a32b632535b
Authority: accepted specification at 6fe4d12c; no acceptance claimed

## Baseline and red

- Six owned existing paths equal c38ed5fb; only fence differed from e08bc11c.
- Remeasured app, lane, view, UI, gym and fence anchors from the paper.
- Counts: gym sites 6; direct listeners 19; interfaces 3; static lane imports 0;
  dynamic host edge 1; painter entries 1. No substantive disagreement.
- Red run gss-red-b35a48e3: gym 65/65 baseline green.
- UI: 54 pass/6 intended GSS red; fence: 405 pass/4 intended GSS red.
- Red logs: %TEMP%/gss-red-b35a48e3/*.log.

## Physical implementation accounting

- M +23/-23: helper/comment bytes view:36-58 -> lane:24-46; SHA256
  824e9dba46a288110190b4bac497e53484a955f86ce2fa158655d86f13dd33ff.
- R +36/-34: view wiring +6/-5; lane import/default +2/-1; app +28/-28.
- App R comprises 14 listener lines, six paint calls on seven physical lines,
  five API mappings, the constructor handoff and model-read retarget.
- N +369/-162: lane controller +299/-79; app lifecycle/outcomes +70/-83.
- Test N/R verification +549/-50: changed fence anchors are R; new rows are N.
- Candidate equalities: gym sites 6 -> 1 Start; listeners 19 -> 0;
  interfaces 3 -> 4; static imports 0 -> 1; host edge 1 -> 1; painter 1 -> 1.
- Fence 409 -> 401: nine obsolete facade.lane syntax cases removed, one API
  token row added with unrelated/reformat controls and four leak plants; net -8.

## Verification

- Candidate2: syntax 5/5; gym 65/65; UI 60/60; fence 401/401.
- Immutable d1fa563 reds: listener identity 0/1; raw-copy depth 0/1.
- Repaired candidate: lane/UI syntax 2/2 and expanded UI 65/65.
- L1 REJECT: 6/6 replacement editors stayed disabled; baseline retried 6/6;
  eight same-editor refusal/rejection controls retried.
- Added mounted six-case GSS-L1-1 regression at test-only checkpoint; author
  execution awaits the serialized runtime slot. Product bytes are unchanged.
- Red/green logs: %TEMP%/gss-final-proof-b35a48e3.
- Candidate versus helper/host reference: three deterministic separate-store
  sequences have equal complete serialized operations/outbox after reopen.
- This is not immutable old-card parity or full section E UI parity; rendered
  text/editor/visibility/disabled/focus/tap comparison remains required.
- Harness: %TEMP%/gss-parity-b35a48e3/parity.mjs.
- parity2.log is the completed custody output; exclude the first harness failure.
- D2 manifest: %TEMP%/gss-d2-manifest-b35a48e3.json; 12 cells + 2 supports,
  all byte-equal to e08bc11c. The paper's thirteenth cell has no identity.
- D2 review launch completed six named settings assertions.
- Eleven historical cells ran through both supports but failed before settings
  purpose: five 0/37 and six 0/4, missing later lifecycleState/refreshState APIs.
- Accepted lifecycle 7e64848d/source 4d004985 is not an ancestor of this base;
  the missing APIs predate GSS and are not added by this build.
- Those failures are not proof and do not discharge the 13+2 obligation.
- Separate rebuild/lanes/c/LAUNCH-ADOPTION-PROBES.mjs completed 2/2;
  retained settings operation count was unchanged.
- No full Today step, private input, engine byte, seal or receipt was used.
- Status: UNACCEPTED candidate; independent Astra and Claude gates remain.
