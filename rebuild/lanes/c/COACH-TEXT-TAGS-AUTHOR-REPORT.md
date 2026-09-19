# COACH-TEXT-TAG-SWEEP author report
Hypothesis for the independent Claude reviewer: the named diagnostic paths no longer publish caller text in athlete-facing reasons or arbitrary exception codes. Please disagree.
Base measured: branch rebuild/c-coach-text-tags, HEAD 6268e7f. All work is uncommitted. No owner copy ruling or independent review is claimed.

## Measured commands and results
Node: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
PowerShell environment set on separate lines before each measured test invocation:
`$env:MEASURED_TEST_NOW = "2026-09-03"`
`$env:TZ = "America/New_York"`
Base: `--test "rebuild/coach/test/*.test.cjs"`: tests 311, pass 311, fail 0, exit 0.
Red: `--test --test-reporter=tap "rebuild/coach/test/text-tags.test.cjs"`: exit 1.
Product was unchanged for both red runs. The first run was 0/8: its positive-control
envelope lacked turn_id. I corrected that fixture before changing product; rerun below.
Final: `--test "rebuild/coach/test/*.test.cjs"`: tests 319, pass 319, fail 0, exit 0.
Final cancelled/skipped/todo: 0/0/0; duration_ms 1810.8644.
Intermediate full bar: 318 pass, 1 fail, exposing the second old leaking assertion below.
A cmd.exe multiline attempt emitted no TAP; it is not counted as test evidence.
`git diff --check`: exit 0.

## Red-first TAP excerpts
```text
not ok 1 - TT1 real check-in rejects hostile choice without publishing the TypeError
ok 2 - TT2 machine-settings save exception is provenance only
not ok 3 - TT3a wave-one unknown tool has fixed reasons
not ok 4 - TT3b wave-one dispatch exception is provenance only
not ok 5 - TT4 submit cannot use an arbitrary exception message as its code
not ok 6 - TT4b submit preserves only declared setup codes, never inherited or prefixed names
not ok 7 - TT5a onboarding unknown tool has fixed reasons
not ok 8 - TT5b onboarding dispatch exception is provenance only
# tests 8
# pass 1
# fail 7
```
TT1, TT3a/b and TT5a/b failed with "athlete-facing member carries hostile text".
TT4 failed with "code must be in the closed refusal table".
TT4b failed at `assert.ok(String(r.unavailable.source).includes(message))`.
TT2 already passed: the nominated machine-settings catch was not a sentence leak.
All eight new cells passed after product edits.
TT1 drives the real check-in model with a hostile choice. Other throws are injected at dependency seams, driving real tools/dispatch and real setup fixtures/models.
Cells check closed codes, exact reasons, source retention, every non-routing member minus source, and numeric traceability with a positive synthetic control.
Routing tool/tier/turn_id/allowed are excluded, matching the accepted memory pattern.

## Named sites, before and after
Locations below name functions; quoted expressions are from base or final source.
1. tools.cjs writeCheckIn: before code "CHECKIN_INPUT_INVALID", reason
   `(error && error.message) || null`; after CODES.CHECKIN_INPUT_INVALID and copy A.
   Exception message now occupies source; fallback is the existing file provenance.
2. wave1-tools.cjs record_machine_settings: before AND after reason
   "I could not keep that, and I have kept nothing." and code W1_CODES.MACHINE_SETTINGS_INVALID;
   `(error && error.message) || "machine-settings-commands.cjs"` was already SOURCE.
   Retained; its refusal helper now applies T.assertNoLeak to the entire envelope.
3. wave1-tools.cjs dispatch: before both reasons were
   `String(name) + " is not one of the wave-one tools"`; after both are copy B.
   Before catch reason `(error && error.message) || "the tool refused"`; after copy C.
   Codes remain "WAVE1_TOOL_NOT_IN_LIST"/"WAVE1_TOOL_THREW", now in W1_CODES.
4. onboarding-tools.cjs submit: before code
   `(error && error.message) || "SETUP_INPUT_INVALID"`; after exact own string keys
   of model.REFUSAL_SENTENCES or C6_CODES.SETUP_INPUT_INVALID; reason remains
   `model.COPY.saveRefused`. Message now occupies source.
   Existing closed table: setup-model.mjs:213, five CLEAN_INIT_* keys, enumerated
   in TOOL-CONTRACT.md and driven by TT4b, including inherited/prefix rejection.
5. onboarding-tools.cjs dispatch: before both reasons were
   `String(name) + " is not one of the seven onboarding tools"`; after copy B.
   Before catch reason `(error && error.message) || "the tool refused"`; after copy C.
   Codes remain "ONBOARDING_TOOL_NOT_IN_LIST"/"ONBOARDING_TOOL_THREW", in C6_CODES.
All three refusal helpers and both unknown-tool envelopes now call assertNoLeak.
Unknown names remain routing metadata in tool, as in memory-tools.cjs, and diagnostic source; they no longer appear in either reason. Contract documents this distinction.

## COPY FOR THE OWNER TO RULE
| ID | Sites | Exact sentence(s) | Status |
|---|---|---|---|
| A | Check-in validation | I could not record that check-in answer. Nothing was recorded. | NEW, proposed |
| B | Both unknown-tool dispatches | That is not one of the coach's tools, so I did nothing. | Reused memory copy at new sites |
| C | Both dispatch catches | Something went wrong inside that tool on this device. I could not complete the request. | NEW, proposed |
C avoids claiming that a failed request proves no earlier write happened.

## Sweep findings beyond the nominated sites
Scope: all 13 immediate rebuild/coach/*.cjs and *.mjs files, excluding tests. rg was unavailable; PowerShell Select-String inspected catches, messages, names,
reason/copy/code construction and refusal call sites. Findings below are source observations.
- memory-tools.cjs remember validation/dispatch/unknown name: already fixed sentences;
  messages/names only source plus routing metadata. No edit.
- memory-host.mjs read(): copy = error.message and code = error.code are dynamic.
  NOT a tool envelope: recall uses a fixed reason/code and only read.code in source;
  remember read-back uses a fixed refusal. Host copy does not reach these tool reasons.
  No edit outside ownership; no claim that the host return itself is closed.
- memory-host.mjs save(): fixed COACH_MEMORY_WRITE_REFUSED, message in detail;
  memory-tools remember carries detail into source. Already protected, unchanged.
- tools.cjs verifyCostCap(): annotation keys enter reason; verifyOptIn(): optIn.user
  enters mismatch reason. startLiveSession forwards these. Unfixed dynamic diagnostics
  outside tool envelopes, not registered tools; flagged for reviewer follow-up.
- wave1-tools log_set confirmation interpolates caller load/reps into reason.
  Unfixed: explicit existing W8/D6 requirement names both in the confirmation.
  This is adjacent arbitrary-text exposure, not an exception/tool-name path.
- tools current_set and wave1 log_set interpolate gym phase; onboarding submit joins
  model missing copy. Unchanged accepted-model outputs; not caller tool names/errors.
- tools cannot_change_via_coach and onboarding cannot_set_via_coach echo topic tags;
  names, machine settings/cues and stored read-backs also publish caller-origin facts.
  Unchanged intentional read-back contracts, outside diagnostic sentences.
- Accepted-layer code/copy pass-throughs: tools gymView/writeCheckIn/correct_set/
  accept_proposal; wave1 record_machine_settings/log_set; onboarding submit;
  memory remember; local-world setup/machine host wrappers and memory-host save.
  Unchanged contract carve-out; safety depends on upstream fixed refusal vocabulary.
- tools cost-cap age/missing keys, opt-in missing/wording labels, WHY_TOPICS,
  REPLAN_FACTS, named users and confirmation 'what' use computed or closed vocabulary.
  No additional arbitrary exception/name interpolation found at those sites.
- coach-text CLI catch writes error.stack to stderr, not an athlete tool envelope.
  Other producer validation throws/catches and text renderers add no diagnostic leak.

## Every edited existing assertion
Only rebuild/coach/test/onboarding-closed-list.test.cjs changed.
Base line 72: `assert.match(r.reason, /^set_rep_target is not one of the seven onboarding tools$/);`
New: `assert.equal(r.reason, "That is not one of the coach's tools, so I did nothing.");`
Added exact equality for unavailable.reason and source "onboarding-tools.cjs TIERS: set_rep_target".
Base line 81: `assert.match(r.unavailable.reason, /set_sets/);`
New: `assert.equal(r.unavailable.reason, "That is not one of the coach's tools, so I did nothing.");`
Added exact source equality "onboarding-tools.cjs TIERS: set_sets".
Strengthening: fixed full sentences and exact diagnostic provenance replace caller-text licensing; existing code/tool/list/state assertions retained. No cells removed or skipped.

## What I did not verify
No live model, browser rendering, phone, real owner data, conformance/private gate, receipt/sealing operation, hosted service, independent Claude review or owner ruling.
No exhaustive hostile-object/proxy fuzzing or upstream accepted-layer copy audit.
The sweep is not a claim that all dynamic prose is removed; unfixed cases are above.
Existing state_unchanged semantics on dispatch failures were not redesigned.
No new model provider integration or shipping action. PM retains commit/push custody.

## Final working tree evidence
Last shell commands (both exit 0); stat excludes the two untracked files.
```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/coach/TOOL-CONTRACT.md
 M rebuild/coach/onboarding-tools.cjs
 M rebuild/coach/test/onboarding-closed-list.test.cjs
 M rebuild/coach/tools.cjs
 M rebuild/coach/wave1-tools.cjs
?? rebuild/coach/test/text-tags.test.cjs
?? rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md
git diff --stat
 rebuild/coach/TOOL-CONTRACT.md                     | 36 ++++++++++++++++++++++
 rebuild/coach/onboarding-tools.cjs                 | 30 ++++++++++--------
 rebuild/coach/test/onboarding-closed-list.test.cjs |  7 +++--
 rebuild/coach/tools.cjs                            | 10 +++---
 rebuild/coach/wave1-tools.cjs                      | 22 +++++++------
 5 files changed, 78 insertions(+), 27 deletions(-)
```
