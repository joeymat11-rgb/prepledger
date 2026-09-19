# COACH-TEXT-TAG-SWEEP author report

Hypothesis for the independent Claude reviewer: B1-B4 and the ordered F1/F2/F3/F8
changes are closed by the measurements below. Please disagree. This is author
evidence, not acceptance. Branch rebuild/c-coach-text-tags, starting HEAD 2450391.
All changes remain uncommitted; PM owns commit and push.

## Corrected prior-build record

The earlier build d88faee8 recorded 311 base tests and 319 final tests, with its
original eight cells going 1 pass / 7 fail before product edits. Those are
historical author measurements, independently checked in REVIEW-R1.md; I did not
re-run 6268e7f in this round. I re-measured 2450391 first: 319 tests, 319 pass,
0 fail, cancelled/skipped/todo 0/0/0. Initial git status --porcelain was empty.

The earlier claim that the copy table showed athlete copy was wrong: the
renderers appended tails. The earlier claim that the catch refusal proved no
check-in answer survived was wrong: the live draft retained partial answers.
The earlier sweep missed the save() diagnostic leak. log_set confirmation is
inside this defect class and is fixed separately below. verifyCostCap and
verifyOptIn are operator gates outside this class; no follow-up is claimed for
them. This report makes no blanket safety claim about accepted-layer forwarding.

Node for every command:
C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe

Before test commands, each on its own PowerShell line:
```powershell
$env:MEASURED_TEST_NOW='2026-09-03'
$env:TZ='America/New_York'
```

## Review R1: fixed

### Reproductions before any edit

I ran the reviewer's B1-B4 paths myself against unchanged product. Output follows.
Non-ASCII output is escaped as <U+....> here to obey the ASCII authoring rule;
the probe constructed the hostile dash with String.fromCharCode(0x2014).

```text
B1 wave Symbol THREW Cannot convert a Symbol value to a string
B1 onboarding Symbol THREW Cannot convert a Symbol value to a string
B1 wave null-prototype THREW Cannot convert object to primitive value
B1 onboarding null-prototype THREW Cannot convert object to primitive value
B1 wave throwing-toString THREW nope
B1 onboarding throwing-toString THREW nope
B2 {"reason":"I could not record that check-in answer. Nothing was recorded.","writes":0,"before":{"sleep_quality":null,"energy":null,"soreness":null,"stress":null},"after":{"sleep_quality":"Good","energy":null,"soreness":null,"stress":null}}
B2 second host write [{"sleep_quality":"Good","stress":"Low"}]
B3 wave {"line":"Something went wrong inside that tool on this device. I could not complete the request. Nothing was recorded.","state_unchanged":true}
B3 onboarding {"line":"Something went wrong inside that tool on this device. I could not complete the request. Nothing was recorded.","state_unchanged":true}
B3 checkin line I could not record that check-in answer. Nothing was recorded. Nothing changed.
B3 accepted memory {"code":"COACH_MEMORY_TOOL_THREW","reason":"Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again.","state_unchanged":true,"line":"Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed."}
B4 {"code":"CHECKIN_NOT_RECORDED","reason":"This check-in could not be recorded on this device, and no part of it was recorded. <U+00B7> ZQPROBE<U+2014>777333","line":"This check-in could not be recorded on this device, and no part of it was recorded. <U+00B7> ZQPROBE<U+2014>777333 Nothing changed.","untraceable":[]}
F1 {"load":987654,"reps":3210,"reason":"Say yes and I will log 987654 lb for 3210 reps. Nothing is recorded yet.","untraceable":[]}
F1 {"load":"9876<U+2014>HOSTILE","reps":8,"reason":"Say yes and I will log 9876<U+2014>HOSTILE lb for 8 reps. Nothing is recorded yet.","untraceable":["987654","3210"]}
F1 {"load":null,"reps":-1,"reason":"Say yes and I will log Infinity lb for -1 reps. Nothing is recorded yet.","untraceable":["987654","3210"]}
F1 {"load":"110","reps":"8","reason":"Say yes and I will log 110 lb for 8 reps. Nothing is recorded yet.","untraceable":["987654","3210"]}
F1 {"load":0,"reps":1,"reason":"Say yes and I will log 0 lb for 1 reps. Nothing is recorded yet.","untraceable":["987654","3210"]}
F1 {"load":110,"reps":1.5,"reason":"Say yes and I will log 110 lb for 1.5 reps. Nothing is recorded yet.","untraceable":["987654","3210"]}
```

### Cells first: unchanged product

Only test/text-tags.test.cjs had changed for this first red run.
Command: node --test --test-reporter=tap rebuild/coach/test/text-tags.test.cjs
Exit 1. git diff --numstat over the seven product modules was empty.
The original eight cells still passed. Six legitimate-copy controls and the two
Symbol-name controls also passed. The failing TAP lines were:

```text
not ok 9 - R1 B1 waveCatch returns a closed refusal for symbol
not ok 10 - R1 B1 onboardingCatch returns a closed refusal for symbol
not ok 11 - R1 B1 checkinCatch returns a closed refusal for symbol
not ok 12 - R1 B1 submitCatch returns a closed refusal for symbol
not ok 15 - R1 B1 waveCatch returns a closed refusal for nullPrototype
not ok 16 - R1 B1 onboardingCatch returns a closed refusal for nullPrototype
not ok 17 - R1 B1 checkinCatch returns a closed refusal for nullPrototype
not ok 18 - R1 B1 submitCatch returns a closed refusal for nullPrototype
not ok 19 - R1 B1 waveName returns a closed refusal for nullPrototype
not ok 20 - R1 B1 onboardingName returns a closed refusal for nullPrototype
not ok 21 - R1 B1 waveCatch returns a closed refusal for throwingString
not ok 22 - R1 B1 onboardingCatch returns a closed refusal for throwingString
not ok 23 - R1 B1 checkinCatch returns a closed refusal for throwingString
not ok 24 - R1 B1 submitCatch returns a closed refusal for throwingString
not ok 25 - R1 B1 waveName returns a closed refusal for throwingString
not ok 26 - R1 B1 onboardingName returns a closed refusal for throwingString
not ok 27 - R1 B2 refused mixed answer restores draft and cannot cross turns
not ok 28 - R1 B2 rollback restores cleared details and sleep confirmation
not ok 29 - R1 B4 real save exception is provenance only and licenses no digits
not ok 36 - R1 B4 unknown code or copy cannot pass even beside a legitimate value
not ok 37 - R1 B3 dispatch catch after write makes no unchanged assertion
not ok 38 - R1 F1 confirmation numbers license nothing until yes writes the set
not ok 39 - R1 F1 invalid numbers never reach a confirmation or a write
not ok 40 - R1 F2 sibling-list names get one list-neutral sentence including memory
not ok 41 - R1 B3 real refusal envelopes print whole fixed lines without extra tails
# tests 41
# pass 16
# fail 25
```

The final cells were also replayed against all seven HEAD product modules loaded
from git show HEAD:<exact coach path> into the Node module loader, in memory.
No checkout or product-file rewrite was used. This second control returned
41 tests / 8 pass / 33 fail: the same 25 failures above, TT3a/TT5a now pinning the
owner's new sentence, and the six legitimate-copy cells now also checking the
whole rendered line. They failed because the old renderer appended a tail, not
because the model's fixed reason changed. This control also covers the final
numeric-string compatibility cases described under F1. Final product cells:
41 tests / 41 pass / 0 fail, exit 0.

Additional failing TAP lines from that unchanged-HEAD replay:

```text
not ok 3 - TT3a wave-one unknown tool has fixed reasons
not ok 7 - TT5a onboarding unknown tool has fixed reasons
not ok 30 - R1 B4 accepted save copy stays byte-identical: ALREADY_RECORDED
not ok 31 - R1 B4 accepted save copy stays byte-identical: NOTHING_ANSWERED
not ok 32 - R1 B4 accepted save copy stays byte-identical: NO_STORE
not ok 33 - R1 B4 accepted save copy stays byte-identical: HOURS_OUT_OF_RANGE
not ok 34 - R1 B4 accepted save copy stays byte-identical: DAYS_INVALID
not ok 35 - R1 B4 accepted save copy stays byte-identical: SAVE_REFUSED
```

### B1: diagnostic conversion and the submit file name

One exported helper, tools.cjs provenance(value), uses its own try and fixed
"(unprintable)" fallback. It formats check-in, machine-settings, submit and both
dispatch diagnostics, both unknown-tool names, and save() code/copy provenance.
Both dispatchers reject non-string names before hasOwnProperty can coerce them.
A Symbol is printable as Symbol(probe); null-prototype and throwing-toString
objects select the fallback.

Eighteen cells cover all three message shapes at both dispatch catches, the
check-in catch and submit catch, and all three name shapes at both unknown-tool
envelopes. Every cell returns its expected closed refusal code, a string source,
and file provenance. Submit source now starts "setup-commands.mjs prepare(): "
and retains the message; the existing declared-code cell still pins all five
CLEAN_INIT codes, SETUP_INPUT_INVALID, inherited names and a hostile prefix.

Red lines 9-12 and 15-26 above are B1. Symbol names (13-14) were already safe.
These are returns, not assertions that an escaped exception is acceptable.

### B2: rollback, not weaker wording

Choice: snapshot the live draft and restore through its public setters.
Read-only source: checkin-model.mjs createCheckInDraft and draft() getter.
The mutable state lives in closures, state() copies its choice/issue/field maps,
and there is no setter to replace the held draft. A detached JS clone would lose
those closures. Rollback preserves the actual accepted draft and its methods.

Snapshot/apply/rollback have no await between them. Restore choices, issues and
sleep confirmation first, then fields, because those setters can clear hidden
detail. This handles a selected choice toggled off, an issue whose details were
cleared, and rejection of an existing sleep record before field conversion fails.

Measured: the refused mixed answer leaves the full state() equal to its preimage,
writes nothing, and the second turn passes ONLY {"stress":"Low"} to the host.
Additional cases restore soreness detail, away detail, and sleep confirmation.
Red lines 27-28; both now pass. No sealed model byte changed.

### B3: the line actually printed and unknown write status

First measurement of accepted memory:
- code COACH_MEMORY_TOOL_THREW
- reason: Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again.
- state_unchanged: true
- coach-text.cjs line: Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed.

That catch-all's reason and appended tail claim more than an arbitrary throw can
establish. Reported, not changed. A final control pins the same reason, member
and complete coach-text line.

WAVE1_TOOL_THREW and ONBOARDING_TOOL_THREW keep the neutral sentence C and no
renderer appends a tail. The decision is keyed on the code, through the shared
refusalHasOwnEnding predicate, never on a sentence pattern for those two codes.
Other touched complete refusals also avoid an extra ending, including A, the
unknown-tool line, submit's no-part-recorded line and all six check-in copies.

state_unchanged: true would assert that the failed request changed no state.
That is not knowable here: wave1 log_set awaits gym.logSet, then awaits gym.read;
gym-model.logSet returns ok only after executeResumedWorkout acknowledges.
The following read can throw. Onboarding submit awaits host.save, whose rejection
alone cannot prove no write occurred. The synthetic drive records a write and
then throws at each boundary. Both resulting envelopes now OMIT state_unchanged.
Absence means unknown, not proof of a write. TOOL-CONTRACT.md states this.

Red line 37 covers post-write failures; line 41 covers whole-line rendering.
The matrix runs all three real renderer functions over real returned envelopes:
check-in apply/save, machine-settings catch, both unknown-tool envelopes, both
dispatch catches, all five declared submit codes plus its fallback, memory's
unknown tool, log_set confirmation and invalid input. Six legitimate save-copy
cells also run all three renderers. The table below is captured output, not
sentences inferred from source.

### B4: save route closed by the actual model vocabulary

The sealed checkin-model.mjs save() exposes NO declared refusal code. Even its
host-error code is joined into copy and then omitted from the returned object.
The exact closed code set for fixed-copy results is therefore {undefined},
paired with these six constants:

| Model constant | saved.code | Reason comparison before/after |
|---|---|---|
| ALREADY_RECORDED | absent | byte-identical to model constant |
| NOTHING_ANSWERED | absent | byte-identical to model constant |
| NO_STORE | absent | byte-identical to model constant |
| HOURS_OUT_OF_RANGE | absent | byte-identical to model constant |
| DAYS_INVALID | absent | byte-identical to model constant |
| SAVE_REFUSED | absent | byte-identical to model constant |

Each row drives the real model's branch, compares direct save().copy with its
exported constant, then compares the tool's reason with that direct result.
Each still yields CHECKIN_NOT_RECORDED, the previous tool fallback code.
The complete sentences are in the renderer table below.

Any other saved.code or saved.copy selects CHECKIN_NOT_RECORDED and sentence A.
Both diagnostic values remain only in source, through provenance().
The real throwing-host marker, its digits and its dash occur in no athlete-facing
member. untraceable("It was 777333.", [r], TURN) now returns ["777333"].
Before it returned []. Unknown code beside legitimate model copy also refuses.
Red lines 29 and 36; both now pass. Six legitimate-copy controls initially passed;
their added renderer assertions fail on HEAD and pass on the fixed product.

### F1: separate change to log_set confirmation

This is its own wave1-tools.cjs log_set hunk, separate from diagnostic/refusal
changes. Measured before: 987654 lb / 3210 reps licensed both numbers before a
yes; arbitrary text plus a dash, Infinity, zero load and fractional reps all
reached confirmation copy. Numeric strings also reached it.

Applied memory-tools.cjs's data-text pattern: confirmation.text carries display,
value, source, kind, licensed: false and NO turn_id. It still names both numbers.
The tagged refusal reason is fixed: "Nothing is recorded yet. Say yes to confirm
the weight and reps." No number is licensed by that result. A confirmed,
successful save returns the stored load and reps as tagged values.

Validation reuses read-only m4/workout/edit-values.cjs validValue, version 2:
load must be finite and positive; reps must be a nonnegative safe integer and
not negative zero. There is no additional maximum load in that accepted domain.
Numeric strings remain accepted, converted before validation; objects are not
coerced. This preserves the existing W8 fixture ("110", "8"). The first candidate
cell classified those numeric strings as invalid; I corrected that expectation
to match the measured accepted input and replayed the final cells against HEAD.
Nonnumeric strings, blank strings, whitespace, objects, Symbols, non-finite
numbers, nonpositive load and invalid rep counts never reach confirmation text
or gym.logSet. Both confirmed and unconfirmed paths are driven.

Red lines 38-39. Final checks: untraceable("You lifted 987654 lb.") returns
["987654"]; untraceable("That is 3210 reps.") returns ["3210"]; no write.
After yes and successful synthetic logSet, both are traceable and one write
occurred. Existing W8/D6 still checks both figures and no operation written
without yes, now in the unlicensed confirmation member.

### F2, F3, F8 and every edited existing assertion

F2: one shared tools.cjs UNKNOWN_TOOL_COPY, used by all three dispatchers.
Onboarding rejects today_plan/current_set/remember, wave-one rejects submit/
set_name, and memory rejects submit with the owner's exact list-neutral line.
Red line 40. Existing assertions changed as follows (line numbers at HEAD):

| File / old line | Old assertion or expected value | New assertion or expected value | Why not weaker |
|---|---|---|---|
| text-tags.test.cjs:14; assertions at 31/32 in TT3a and TT5a | UNKNOWN_COPY = "That is not one of the coach's tools, so I did nothing." | UNKNOWN_COPY = "I cannot use that tool here, so I did nothing." | Same full equality for both reasons; provenance and numeric non-licensing assertions retained |
| onboarding-closed-list.test.cjs:72 | assert.equal(r.reason, "That is not one of the coach's tools, so I did nothing."); | assert.equal(r.reason, "I cannot use that tool here, so I did nothing."); | Full equality remains; unavailable.reason equality and exact source retained |
| onboarding-closed-list.test.cjs:83 | assert.equal(r.unavailable.reason, "That is not one of the coach's tools, so I did nothing."); | assert.equal(r.unavailable.reason, "I cannot use that tool here, so I did nothing."); | Full equality remains; code, allowed list, state and exact source retained |
| memory.test.cjs after 1716 | No full-sentence assertion; includes(name) == false and no digits | Added assert.equal(r.unavailable.reason, "I cannot use that tool here, so I did nothing."); | Strengthens existing checks; both original hostile-name/numeric assertions remain |
| wave1-demo.test.cjs:296 | assert.match(r.unavailable.reason, /110/); | assert.match(r.confirmation.text.display, /110/); | Same number in the required confirmation; new assertions prevent licensing |
| wave1-demo.test.cjs:297 | assert.match(r.unavailable.reason, /8/); | assert.match(r.confirmation.text.display, /8/); | Same number in the required confirmation; durable no-write assertion remains |
| wave1-demo.test.cjs:298 | assert.match(r.unavailable.reason, /nothing is recorded yet/i); | assert.match(r.confirmation.text.display, /nothing is recorded yet/i); | Same confirmation claim plus exact fixed-reason equality, licensed false and absent turn_id |

No tests were weakened, skipped or deleted. The memory cell had no old literal
sentence assertion to replace; its new full equality is additional.
F3: BRIEF-C6-VOICE-ONBOARDING.md:93 now documents the exact owner-ruled sentence.
F8: the title now says the attempted name is in routing and source. Its code,
tool-name, fixed-reason and source assertions remain.

## COPY FOR THE OWNER TO RULE

Every line below was printed by the named renderer's real unavailable function
over a real envelope from the final cells. Identical outputs are grouped; where
renderers differ they have separate rows. No tail is omitted from this table.
The sealed ALREADY_RECORDED apostrophe is encoded as &#8217; in this ASCII
Markdown source; that entity displays the exact U+2019 character the renderer
returned. A/B/C are the current printed lines, superseding the prior table.
The memory throw row is an unchanged defect report, not proposed new copy.

| Code / path | Renderer(s) actually run | Whole printed line |
|---|---|---|
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. |
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Answer at least one question, or leave the check-in for today. Nothing was recorded. |
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | This device could not open its encrypted local store, so no check-in can be recorded here. |
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded. |
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Days away from training is recorded as a whole number of days. Nothing was recorded. |
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | This check-in could not be recorded on this device, and no part of it was recorded. |
| CHECKIN_INPUT_INVALID | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | I could not record that check-in answer. Nothing was recorded. |
| COACH_MACHINE_SETTINGS_INVALID | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | I could not keep that, and I have kept nothing. |
| WAVE1_TOOL_NOT_IN_LIST | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | I cannot use that tool here, so I did nothing. |
| ONBOARDING_TOOL_NOT_IN_LIST | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | I cannot use that tool here, so I did nothing. |
| WAVE1_TOOL_THREW | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Something went wrong inside that tool on this device. I could not complete the request. |
| ONBOARDING_TOOL_THREW | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Something went wrong inside that tool on this device. I could not complete the request. |
| CLEAN_INIT_SETUP_REQUIRED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Your week could not be recorded on this device, and no part of it was recorded. |
| CLEAN_INIT_SPLIT_REQUIRED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Your week could not be recorded on this device, and no part of it was recorded. |
| CLEAN_INIT_EXERCISES_REQUIRED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Your week could not be recorded on this device, and no part of it was recorded. |
| CLEAN_INIT_EXERCISE_REQUIRED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Your week could not be recorded on this device, and no part of it was recorded. |
| CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Your week could not be recorded on this device, and no part of it was recorded. |
| SETUP_INPUT_INVALID | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Your week could not be recorded on this device, and no part of it was recorded. |
| CHECKIN_NOT_RECORDED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | I could not record that check-in answer. Nothing was recorded. |
| COACH_CONFIRMATION_REQUIRED | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | Nothing is recorded yet. Say yes to confirm the weight and reps. |
| COACH_SET_NOT_RECORDED | coach-text.cjs | Tell me the weight and the reps you actually did. Nothing changed. |
| COACH_SET_NOT_RECORDED | wave1-text.cjs, onboarding-text.cjs | Tell me the weight and the reps you actually did. Nothing was recorded. |
| MEMORY_TOOL_NOT_IN_LIST | coach-text.cjs, wave1-text.cjs, onboarding-text.cjs | I cannot use that tool here, so I did nothing. |
| COACH_MEMORY_TOOL_THREW | coach-text.cjs | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed. |

F1 confirmation data (separate from the rendered refusal): the measured
confirmation.text.display is "Say yes and I will log 987654 lb for 3210 reps.
Nothing is recorded yet." It is unlicensed data, not a renderer-added tail.

## Final bar

Command: node --test --test-reporter=tap "rebuild/coach/test/*.test.cjs"
Exit 0. Final measured output:

```text
...
1..342
# tests 352
# suites 0
# pass 352
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2811.8972
```

352 = unchanged HEAD's 319 plus 33 new cells. No cancelled, skipped or todo tests.
git diff --check: exit 0, no output. Ownership audit: 14 changed paths, zero
outside the assignment. Added non-ASCII lines: 0. git diff --numstat over
rebuild/engine, rebuild/m3, rebuild/m4, rebuild/client and .github: empty.
The ASCII/scope audit ran after the report draft was written; only this report's
final results and command transcript were filled in afterward.

## What I did not verify

No live model, browser, phone, owner data, hosted service, independent Claude
review or new owner copy approval. No conformance/private gate, sealed engine
gate, rig187, client control suite, receipt, seal generator, soak or GitHub CI.
No prohibited data/auth paths were read. No dependency install or node_modules
edit. No commit, push, checkout, reset, stash, clean or fetch.
Synthetic host failures prove the control flow, not real device I/O failures.
No exhaustive hostile getter/proxy fuzzing. I did not widen this assignment into
F6's full upstream pass-through audit. The accepted memory catch overclaim
remains, including its state_unchanged member and printed tail, as instructed.
No accepted model, engine, client or workflow bytes changed.

## Final working tree evidence

Last shell commands, in this order; both exit 0. Output captured immediately
before appending this transcript to the report (the stat therefore excludes this
transcript's own lines). No shell command was run after them.

```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/coach/BRIEF-C6-VOICE-ONBOARDING.md
 M rebuild/coach/TOOL-CONTRACT.md
 M rebuild/coach/coach-text.cjs
 M rebuild/coach/memory-tools.cjs
 M rebuild/coach/onboarding-text.cjs
 M rebuild/coach/onboarding-tools.cjs
 M rebuild/coach/test/memory.test.cjs
 M rebuild/coach/test/onboarding-closed-list.test.cjs
 M rebuild/coach/test/text-tags.test.cjs
 M rebuild/coach/test/wave1-demo.test.cjs
 M rebuild/coach/tools.cjs
 M rebuild/coach/wave1-text.cjs
 M rebuild/coach/wave1-tools.cjs
 M rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md

git diff --stat
 rebuild/coach/BRIEF-C6-VOICE-ONBOARDING.md         |   2 +-
 rebuild/coach/TOOL-CONTRACT.md                     |  34 +-
 rebuild/coach/coach-text.cjs                       |   2 +
 rebuild/coach/memory-tools.cjs                     |   2 +-
 rebuild/coach/onboarding-text.cjs                  |   2 +
 rebuild/coach/onboarding-tools.cjs                 |  14 +-
 rebuild/coach/test/memory.test.cjs                 |   1 +
 rebuild/coach/test/onboarding-closed-list.test.cjs |   6 +-
 rebuild/coach/test/text-tags.test.cjs              | 247 ++++++++++-
 rebuild/coach/test/wave1-demo.test.cjs             |   9 +-
 rebuild/coach/tools.cjs                            |  50 ++-
 rebuild/coach/wave1-text.cjs                       |   1 +
 rebuild/coach/wave1-tools.cjs                      |  33 +-
 rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md   | 483 +++++++++++++++------
 14 files changed, 720 insertions(+), 166 deletions(-)
```
