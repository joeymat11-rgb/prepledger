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


## Review R2: fixed

Fix round 3, Astra, 2026-09-19. Working branch rebuild/c-coach-text-tags,
HEAD 00d006d4; changes are UNCOMMITTED. This is the builder's measured hypothesis
for the next independent reviewer, not an acceptance verdict. This section and
its tables supersede the round-2 copy table and memory deferral above.

### Finding-to-evidence map

| Finding | Change and measured evidence |
|---|---|
| B1 | local-world exports CHECKIN_SOURCE_UNAVAILABLE and SLEEP_NIGHT_CHANGED as frozen refusal objects and save returns those same objects. The gate compares BOTH code and copy against those exports, or an absent code against the six model constants. Two real-wrapper cells preserve the code/reason and all three base renderer outputs; four mismatched-pair controls collapse. The existing real host-exception and unknown-copy cells still pass. |
| B2 | COMPLETE_REFUSALS now contains exactly WAVE1_TOOL_THREW, ONBOARDING_TOOL_THREW, COACH_MEMORY_TOOL_THREW. Direct helper drive: those three true, all twelve deleted entries false. Three new cells compare ALREADY_RECORDED, missing machine identity and arbitrary host copy to executable 24503919 renderers. Six existing model-copy cells and the refusal matrix now assert each renderer's base ending. |
| Memory catch | The existing memory control became a separate synthetic write-then-throw cell. It measures one completed synthetic write, exact neutral reason, absent own state_unchanged property, and the exact no-tail line through all three renderers. Existing memory read/write exception, source and numeric-licensing cells pass in the full bar. |
| N1 | Removed both confirmation-code sentence tests. Coach and onboarding extend their own-ending patterns with nothing is recorded yet; wave1 already matches it. The new non-confirmation-code cell was red and now passes. Contract distinguishes exactly three code exceptions from every other renderer's pattern. |
| N2 | model-adapter.md states that absent state_unchanged means unknown, never a claim that state was unchanged or that a write happened. |
| N4 | Both vocabulary imports are inside try/catch. One cell substitutes a rejecting data-module import in an in-memory compilation of tools.cjs: generic CHECKIN_NOT_RECORDED, fixed reason, SYNTHETIC_IMPORT_FAILURE in source. No product file is altered by the injection. |
| N5 | log_set invalid-input source is now wave1-tools.cjs log_set invalid-input refusal. Exact reason/source cell red then green. |
| N6 | Required paragraph copied verbatim to TOOL-CONTRACT.md; exact-string comparison measured one occurrence. No confirmation surface was built. |
| N7 | All caught values in the four tool modules go whole to provenance; .message is read inside its try. Three new throwing-getter cells cover waveDispatchCatch, onbDispatchCatch and checkinApplyCatch: red throws became coded refusals with (unprintable) in source. |
| N8 | All three dispatchers guard non-string names before lookup/delegation; tool becomes (not a tool name), source uses provenance(name). Three revoked-Proxy cells: red throws, green refusals including assertNoLeak. Contract corrected. |
| N10 | The two tables below were generated from actual tool envelopes and renderer calls, including all four omitted renderer lines and old/new memory catches. |

N3 NOT DONE: no new checkin.draft guard or rollback-shape hardening.
N9 NOT DONE: string routing metadata and source remain unbounded; no truncation or Unicode filtering.

### Red-first evidence per cell

Product remained unchanged while cells were added/edited. The focused command was
node --test --test-reporter=tap rebuild/coach/test/text-tags.test.cjs.
Measured red run: tests 60, pass 38, fail 22, cancelled/skipped/todo 0.
There are 18 new behavioral cells (14 red, four green controls), plus the old
memory control split into its own cell. Eight edited cells were red: six model
copies, the refusal matrix, and memory. Net test-count increase is 19.

The four mismatched-pair controls already passed before the product edit; they
are not claimed as red-first defect witnesses. Red entries below failed at the
first bad assertion/throw, not necessarily at every assertion within the cell.
The memory cell reached its old-sentence mismatch after measuring the write.
The matrix's red first failure was CHECKIN_INPUT_INVALID in coach.

| Cell at red run | Unchanged product | Final bar |
|---|---|---|
| R1 B4 accepted save copy stays byte-identical: ALREADY_RECORDED | RED: missing base tail | PASS |
| R1 B4 accepted save copy stays byte-identical: NOTHING_ANSWERED | RED: missing base tail | PASS |
| R1 B4 accepted save copy stays byte-identical: NO_STORE | RED: missing base tail | PASS |
| R1 B4 accepted save copy stays byte-identical: HOURS_OUT_OF_RANGE | RED: missing base tail | PASS |
| R1 B4 accepted save copy stays byte-identical: DAYS_INVALID | RED: missing base tail | PASS |
| R1 B4 accepted save copy stays byte-identical: SAVE_REFUSED | RED: missing base tail | PASS |
| R1 B3 real refusal envelopes print whole fixed lines without extra tails | RED: missing coach tail for CHECKIN_INPUT_INVALID | PASS |
| R2 memory catch after synthetic write makes no state claim or tail | RED: old reason after measured write | PASS |
| R2 B1 real wrapper preserves CHECKIN_SOURCE_UNAVAILABLE | RED: CHECKIN_NOT_RECORDED instead | PASS |
| R2 B1 real wrapper preserves SLEEP_NIGHT_CHANGED | RED: CHECKIN_NOT_RECORDED instead | PASS |
| R2 B1 mismatched wrapper CHECKIN_SOURCE_UNAVAILABLE code collapses | GREEN control | PASS |
| R2 B1 mismatched wrapper CHECKIN_SOURCE_UNAVAILABLE copy collapses | GREEN control | PASS |
| R2 B1 mismatched wrapper SLEEP_NIGHT_CHANGED code collapses | GREEN control | PASS |
| R2 B1 mismatched wrapper SLEEP_NIGHT_CHANGED copy collapses | GREEN control | PASS |
| R2 B2 base tails: already | RED: base tail absent | PASS |
| R2 B2 base tails: machine read | RED: base tail absent | PASS |
| R2 B2 base tails: machine host | RED: base tail absent | PASS |
| R2 N7 throwing message getter: waveDispatchCatch | RED: MSG GETTER escaped | PASS |
| R2 N7 throwing message getter: onbDispatchCatch | RED: MSG GETTER escaped | PASS |
| R2 N7 throwing message getter: checkinApplyCatch | RED: MSG GETTER escaped | PASS |
| R2 N8 revoked Proxy name: wave | RED: revoked Proxy TypeError escaped | PASS |
| R2 N8 revoked Proxy name: onboarding | RED: revoked Proxy TypeError escaped | PASS |
| R2 N8 revoked Proxy name: memory | RED: revoked Proxy TypeError escaped | PASS |
| R2 N4 check-in vocabulary import rejection is contained | RED: SYNTHETIC_IMPORT_FAILURE escaped | PASS |
| R2 N1 own ending is independent of confirmation code | RED: coach appended Nothing changed. | PASS |
| R2 N5 invalid set copy names its coach source | RED: gym-model.mjs ENTER_PERFORMED | PASS |

The refusal matrix's final title is R1 B3 real refusal envelopes follow base
endings and catch-all exceptions. Its red-run title is retained in the table
above to identify the actual TAP row. No cell was skipped or deleted.

### Edited existing assertions

All edits below are in test/text-tags.test.cjs. C/Y/X are the coach, wave1 and
onboarding renderers. R2.baseLine executes the corresponding renderer retrieved
with git show 24503919:rebuild/coach/<file>; it is not a copied expectation or
current-product oracle. The six direct code/reason equalities remain unchanged.

| Existing assertion or input | Old text | New text | Why this does not weaken the cell |
|---|---|---|---|
| Six model-copy renderer assertions, one for each ALREADY_RECORDED / NOTHING_ANSWERED / NO_STORE / HOURS_OUT_OF_RANGE / DAYS_INVALID / SAVE_REFUSED | for (const renderer of [C, Y, X]) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), direct.copy); | for (const [i, renderer] of [C, Y, X].entries()) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), R2.baseLine(i, r.unavailable)); | B2 explicitly restores renderer-specific base tails. Full string equality through all three renderers remains; code and direct-copy equality remain. |
| Refusal matrix expected line | const want = r.unavailable.code === "COACH_SET_NOT_RECORDED" && name === "coach" ? SET_COPY + " Nothing changed." : expected; | const want = ["WAVE1_TOOL_THREW", "ONBOARDING_TOOL_THREW", "COACH_CONFIRMATION_REQUIRED"].includes(r.unavailable.code) ? expected : R2.baseLine(["coach", "wave1", "onboarding"].indexOf(name), r.unavailable); | Same actual assertion, assert.equal(line, want, name + " " + r.unavailable.code). Every non-exception row compares the exact base line. Catch-alls and the separately authorized confirmation line still compare fixed full sentences. |
| Memory control input | forTopic() throws before a recall result; dispatch("recall", { topic: "training" }, TURN) | save(value) pushes value then throws; propose remember, then dispatch remember with the issued confirmation_id and confirmed: true; assert.deepEqual(writes, [fact]); | Strengthens the witness: a write has happened, so unchanged cannot be asserted. Same real dispatcher and code assertion retained. |
| Memory reason | assert.equal(r.unavailable.reason, "Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again."); | assert.equal(r.unavailable.reason, THREW_COPY); | Exact new owner-ruled sentence; THREW_COPY is Something went wrong inside that tool on this device. I could not complete the request. |
| Memory state claim | assert.equal(r.state_unchanged, true); | assert.equal(Object.hasOwn(r, "state_unchanged"), false); | Asserts actual property absence, stronger than comparing its value to undefined. The write assertion prevents a no-write-only witness. |
| Memory rendered tail | assert.equal(C.ALL_TEMPLATES.unavailable(r.unavailable), "Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed."); | for (const renderer of [C, Y, X]) assert.equal(renderer.ALL_TEMPLATES.unavailable(r.unavailable), THREW_COPY); | Exact full line in all three renderers instead of coach only. |

No assertion outside this file changed. The old memory control was moved out of
the matrix so its red failure could be observed independently; its code check
remains. Existing hostile-text, rollback, numeric gate, confirmation-number,
untraceable, source and durable-write checks were retained.

### COPY FOR THE OWNER TO RULE

Capture command: node rebuild/coach/test/review-r2-copy.cjs. It measured 44
synthetic refusal paths at each of current, 24503919, 6268e7f and 00d006d4,
through all three renderers: 528 renderer executions. Historical coach modules
are compiled in memory with their same-ref tool dependencies. Accepted models
are unchanged. Both wrapper paths use the real current local world (the refusal
values and runtime branching are unchanged from base), and the historical coach
is given that wrapper. No manually constructed unavailable envelope is used in
these tables. The copy fixture reuses the regression's realWrapper function.

C = coach-text.cjs; W = wave1-text.cjs; O = onboarding-text.cjs. Each line below is
whole, including every tail. Non-ASCII inherited characters are HTML entities
in this ASCII report (for example &#8217; and &#183;); displayed characters are
exactly the renderer's output. Identical lines are grouped only for the listed
renderers/paths. In particular, the restored base coach sometimes prints both
Nothing was recorded. and Nothing changed.; that is the requested base behavior.

The two host-copy branches are open text domains: no finite literal table can
enumerate every caller string. Their measured synthetic examples appear below
(machine/host copy and set/host copy); for any other host string S, C prints S
plus Nothing changed. unless /nothing chang|nothing is recorded yet/i matches;
W prints S plus Nothing was recorded. unless /nothing (is|was) recorded|unchanged|I have not recorded|I have kept nothing/i matches;
O prints S plus Nothing was recorded. unless /unchanged|nothing was recorded|not recorded|nothing is recorded yet/i matches.
This describes the entire unbounded family, not an omitted fixed sentence.
The no-host-copy set row also captures the renderer's fallback sentence.

| Code / real-envelope path(s) | Renderer(s) | Whole printed line |
|---|---|---|
| CHECKIN_NOT_RECORDED / checkin/ALREADY_RECORDED | C | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/ALREADY_RECORDED | W, O | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing was recorded. |
| CHECKIN_NOT_RECORDED / checkin/NOTHING_ANSWERED | C | Answer at least one question, or leave the check-in for today. Nothing was recorded. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/NOTHING_ANSWERED | W, O | Answer at least one question, or leave the check-in for today. Nothing was recorded. |
| CHECKIN_NOT_RECORDED / checkin/NO_STORE | C | This device could not open its encrypted local store, so no check-in can be recorded here. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/NO_STORE | W, O | This device could not open its encrypted local store, so no check-in can be recorded here. Nothing was recorded. |
| CHECKIN_NOT_RECORDED / checkin/HOURS_OUT_OF_RANGE | C | An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/HOURS_OUT_OF_RANGE | W, O | An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded. |
| CHECKIN_NOT_RECORDED / checkin/DAYS_INVALID | C | Days away from training is recorded as a whole number of days. Nothing was recorded. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/DAYS_INVALID | W, O | Days away from training is recorded as a whole number of days. Nothing was recorded. |
| CHECKIN_NOT_RECORDED / checkin/SAVE_REFUSED | C | This check-in could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/SAVE_REFUSED | W, O | This check-in could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| CHECKIN_INPUT_INVALID / checkin/input | C | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| CHECKIN_INPUT_INVALID / checkin/input | W, O | I could not record that check-in answer. Nothing was recorded. |
| CHECKIN_NOT_RECORDED / checkin/host exception, checkin/host code, checkin/host copy | C | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| CHECKIN_NOT_RECORDED / checkin/host exception, checkin/host code, checkin/host copy | W, O | I could not record that check-in answer. Nothing was recorded. |
| CHECKIN_SOURCE_UNAVAILABLE / wrapper/source unavailable | C | The check-in could not be read on this device. Nothing was recorded. Nothing changed. |
| CHECKIN_SOURCE_UNAVAILABLE / wrapper/source unavailable | W, O | The check-in could not be read on this device. Nothing was recorded. |
| SLEEP_NIGHT_CHANGED / wrapper/night changed | C | This night changed while you were editing. Review the saved record before trying again. Nothing was recorded. Nothing changed. |
| SLEEP_NIGHT_CHANGED / wrapper/night changed | W, O | This night changed while you were editing. Review the saved record before trying again. Nothing was recorded. |
| COACH_MACHINE_SETTINGS_INVALID / machine/read missing identity | C | I need to know which machine you mean. Nothing changed. |
| COACH_MACHINE_SETTINGS_INVALID / machine/read missing identity | W, O | I need to know which machine you mean. Nothing was recorded. |
| COACH_MACHINE_SETTINGS_INVALID / machine/save throw | C | I could not keep that, and I have kept nothing. Nothing changed. |
| COACH_MACHINE_SETTINGS_INVALID / machine/save throw | W | I could not keep that, and I have kept nothing. |
| COACH_MACHINE_SETTINGS_INVALID / machine/save throw | O | I could not keep that, and I have kept nothing. Nothing was recorded. |
| COACH_MACHINE_SETTINGS_INVALID / machine/host copy | C | Your device would not accept that write. Nothing changed. |
| COACH_MACHINE_SETTINGS_INVALID / machine/host copy | W, O | Your device would not accept that write. Nothing was recorded. |
| WAVE1_TOOL_NOT_IN_LIST / unknown/wave | C | I cannot use that tool here, so I did nothing. Nothing changed. |
| WAVE1_TOOL_NOT_IN_LIST / unknown/wave | W, O | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| ONBOARDING_TOOL_NOT_IN_LIST / unknown/onboarding | C | I cannot use that tool here, so I did nothing. Nothing changed. |
| ONBOARDING_TOOL_NOT_IN_LIST / unknown/onboarding | W, O | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| MEMORY_TOOL_NOT_IN_LIST / unknown/memory | C | I cannot use that tool here, so I did nothing. Nothing changed. |
| MEMORY_TOOL_NOT_IN_LIST / unknown/memory | W, O | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| WAVE1_TOOL_THREW / catch/wave | C, W, O | Something went wrong inside that tool on this device. I could not complete the request. |
| ONBOARDING_TOOL_THREW / catch/onboarding | C, W, O | Something went wrong inside that tool on this device. I could not complete the request. |
| COACH_MEMORY_TOOL_THREW / catch/memory read, catch/memory write | C, W, O | Something went wrong inside that tool on this device. I could not complete the request. |
| COACH_MEMORY_INPUT_INVALID / memory/invalid input | C | I could not keep that, and I have kept nothing. Tell me again in your own words. Nothing changed. |
| COACH_MEMORY_INPUT_INVALID / memory/invalid input | W | I could not keep that, and I have kept nothing. Tell me again in your own words. |
| COACH_MEMORY_INPUT_INVALID / memory/invalid input | O | I could not keep that, and I have kept nothing. Tell me again in your own words. Nothing was recorded. |
| COACH_CONFIRMATION_REQUIRED / confirmation/memory | C | I have not kept that yet. Your own words are in this result beside the yes I am asking for: say yes and I will keep them exactly as they are. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/memory | W, O | I have not kept that yet. Your own words are in this result beside the yes I am asking for: say yes and I will keep them exactly as they are. Nothing was recorded. |
| CLEAN_INIT_SETUP_REQUIRED / submit/CLEAN_INIT_SETUP_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| CLEAN_INIT_SETUP_REQUIRED / submit/CLEAN_INIT_SETUP_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| CLEAN_INIT_SPLIT_REQUIRED / submit/CLEAN_INIT_SPLIT_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| CLEAN_INIT_SPLIT_REQUIRED / submit/CLEAN_INIT_SPLIT_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| CLEAN_INIT_EXERCISES_REQUIRED / submit/CLEAN_INIT_EXERCISES_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| CLEAN_INIT_EXERCISES_REQUIRED / submit/CLEAN_INIT_EXERCISES_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| CLEAN_INIT_EXERCISE_REQUIRED / submit/CLEAN_INIT_EXERCISE_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| CLEAN_INIT_EXERCISE_REQUIRED / submit/CLEAN_INIT_EXERCISE_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / submit/CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / submit/CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| SETUP_INPUT_INVALID / submit/SYNTHETIC_DIAGNOSTIC_777333 | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| SETUP_INPUT_INVALID / submit/SYNTHETIC_DIAGNOSTIC_777333 | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| COACH_SET_NOT_RECORDED / set/invalid | C | Tell me the weight and the reps you actually did. Nothing changed. |
| COACH_SET_NOT_RECORDED / set/invalid | W, O | Tell me the weight and the reps you actually did. Nothing was recorded. |
| COACH_EFFORT_REQUIRED / set/effort absent | C | Tell me how many clean reps you had left, or say you are unsure. Nothing changed. |
| COACH_EFFORT_REQUIRED / set/effort absent | W, O | Tell me how many clean reps you had left, or say you are unsure. Nothing was recorded. |
| COACH_SET_NOT_RECORDED / set/host copy | C | Your device would not accept that set. Nothing changed. |
| COACH_SET_NOT_RECORDED / set/host copy | W, O | Your device would not accept that set. Nothing was recorded. |
| COACH_SET_NOT_RECORDED / set/no host copy | C | I cannot answer that from what the app holds. Nothing changed. |
| COACH_SET_NOT_RECORDED / set/no host copy | W, O | I cannot answer that from what the app holds. Nothing was recorded. |
| COACH_CONFIRMATION_REQUIRED / confirmation/set | C, W, O | Nothing is recorded yet. Say yes to confirm the weight and reps. |
| COACH_CONFIRMATION_REQUIRED / confirmation/fact | C | A fact is recorded only after you say yes. Nothing was recorded. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/fact | W, O | A fact is recorded only after you say yes. Nothing was recorded. |
| COACH_CONFIRMATION_REQUIRED / confirmation/proposal | C | Nothing is accepted without your yes. Your plan is unchanged. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/proposal | W, O | Nothing is accepted without your yes. Your plan is unchanged. |
| COACH_CONFIRMATION_REQUIRED / confirmation/wave settings, confirmation/onboarding set_machine_settings | C | Nothing is written until you say yes. I have not recorded those settings. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/wave settings, confirmation/onboarding set_machine_settings | W, O | Nothing is written until you say yes. I have not recorded those settings. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding set_name | C | Nothing is written until you say yes. I have not recorded a name. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding set_name | W, O | Nothing is written until you say yes. I have not recorded a name. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding set_days | C | Nothing is written until you say yes. I have not recorded your training days. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding set_days | W, O | Nothing is written until you say yes. I have not recorded your training days. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding add_exercise_from_catalogue | C | Nothing is written until you say yes. I have not recorded that exercise. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding add_exercise_from_catalogue | W, O | Nothing is written until you say yes. I have not recorded that exercise. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding set_priorities | C | Nothing is written until you say yes. I have not recorded what matters most. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding set_priorities | W, O | Nothing is written until you say yes. I have not recorded what matters most. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding submit | C | Nothing is written until you say yes. I have not recorded your week. Nothing changed. |
| COACH_CONFIRMATION_REQUIRED / confirmation/onboarding submit | W, O | Nothing is written until you say yes. I have not recorded your week. |

The four lines R2 N10 called missing are machine/read missing identity,
machine/host copy, and the C versus W/O rows for set/effort absent. Both wrapper
sentences now retain their codes and all three base outputs. The memory catch
line is the same for its measured read and write paths. Other reasons sharing
COACH_CONFIRMATION_REQUIRED are included, not only log_set.

### LINES THIS LANE CHANGES OR REMOVES

The base column names 24503919, and 6268e7f for round 1. To make the current
correction reviewable, 00d006d4 is also included as the round-2 input. References
are grouped only when their measured full old line and full new line agree.
Rows with no change are omitted from this second table only; the current table
above includes unchanged copy. Code changes are shown with ->. The two wrapper
lines are RESTORED versus round 2 and byte-identical to both requested bases.
The table includes diagnostic examples, not any person's data.

| Base ref / path / code | Renderer(s) | Base whole line | New whole line |
|---|---|---|---|
| 24503919, 6268e7f / checkin/host exception / CHECKIN_NOT_RECORDED | C | This check-in could not be recorded on this device, and no part of it was recorded. &#183; SYNTHETIC_DIAGNOSTIC_777333 Nothing changed. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 24503919, 6268e7f / checkin/host exception / CHECKIN_NOT_RECORDED | W, O | This check-in could not be recorded on this device, and no part of it was recorded. &#183; SYNTHETIC_DIAGNOSTIC_777333 Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. |
| 24503919, 6268e7f / checkin/host code / CHECKIN_NOT_RECORDED | C | Synthetic host refused. &#183; STATE_20 Nothing changed. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 24503919, 6268e7f / checkin/host code / CHECKIN_NOT_RECORDED | W, O | Synthetic host refused. &#183; STATE_20 Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. |
| 24503919, 6268e7f / checkin/host copy / CHECKIN_NOT_RECORDED | C | Synthetic host refused. Nothing changed. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 24503919, 6268e7f / checkin/host copy / CHECKIN_NOT_RECORDED | W, O | Synthetic host refused. Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. |
| 24503919 / unknown/wave / WAVE1_TOOL_NOT_IN_LIST | C | That is not one of the coach's tools, so I did nothing. Nothing changed. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 24503919 / unknown/wave / WAVE1_TOOL_NOT_IN_LIST | W, O | That is not one of the coach's tools, so I did nothing. Nothing was recorded. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 24503919 / unknown/onboarding / ONBOARDING_TOOL_NOT_IN_LIST | C | That is not one of the coach's tools, so I did nothing. Nothing changed. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 24503919 / unknown/onboarding / ONBOARDING_TOOL_NOT_IN_LIST | W, O | That is not one of the coach's tools, so I did nothing. Nothing was recorded. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 24503919, 6268e7f / unknown/memory / MEMORY_TOOL_NOT_IN_LIST | C | That is not one of the coach's tools, so I did nothing. Nothing changed. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 24503919, 6268e7f / unknown/memory / MEMORY_TOOL_NOT_IN_LIST | W, O | That is not one of the coach's tools, so I did nothing. Nothing was recorded. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 24503919 / catch/wave / WAVE1_TOOL_THREW | C | Something went wrong inside that tool on this device. I could not complete the request. Nothing changed. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919 / catch/wave / WAVE1_TOOL_THREW | W, O | Something went wrong inside that tool on this device. I could not complete the request. Nothing was recorded. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919 / catch/onboarding / ONBOARDING_TOOL_THREW | C | Something went wrong inside that tool on this device. I could not complete the request. Nothing changed. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919 / catch/onboarding / ONBOARDING_TOOL_THREW | W, O | Something went wrong inside that tool on this device. I could not complete the request. Nothing was recorded. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f, 00d006d4 / catch/memory read / COACH_MEMORY_TOOL_THREW | C | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f, 00d006d4 / catch/memory read / COACH_MEMORY_TOOL_THREW | W | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f, 00d006d4 / catch/memory read / COACH_MEMORY_TOOL_THREW | O | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing was recorded. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f, 00d006d4 / catch/memory write / COACH_MEMORY_TOOL_THREW | C | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing changed. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f, 00d006d4 / catch/memory write / COACH_MEMORY_TOOL_THREW | W | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f, 00d006d4 / catch/memory write / COACH_MEMORY_TOOL_THREW | O | Something went wrong inside that on this device, so I have kept nothing and read nothing back. Try me again. Nothing was recorded. | Something went wrong inside that tool on this device. I could not complete the request. |
| 24503919, 6268e7f / set/invalid / COACH_CONFIRMATION_REQUIRED -> COACH_SET_NOT_RECORDED | C | Say yes and I will log bad lb for 8 reps. Nothing is recorded yet. Nothing changed. | Tell me the weight and the reps you actually did. Nothing changed. |
| 24503919, 6268e7f / set/invalid / COACH_CONFIRMATION_REQUIRED -> COACH_SET_NOT_RECORDED | W | Say yes and I will log bad lb for 8 reps. Nothing is recorded yet. | Tell me the weight and the reps you actually did. Nothing was recorded. |
| 24503919, 6268e7f / set/invalid / COACH_CONFIRMATION_REQUIRED -> COACH_SET_NOT_RECORDED | O | Say yes and I will log bad lb for 8 reps. Nothing is recorded yet. Nothing was recorded. | Tell me the weight and the reps you actually did. Nothing was recorded. |
| 24503919, 6268e7f / confirmation/set / COACH_CONFIRMATION_REQUIRED | C | Say yes and I will log 110 lb for 8 reps. Nothing is recorded yet. Nothing changed. | Nothing is recorded yet. Say yes to confirm the weight and reps. |
| 24503919, 6268e7f / confirmation/set / COACH_CONFIRMATION_REQUIRED | W | Say yes and I will log 110 lb for 8 reps. Nothing is recorded yet. | Nothing is recorded yet. Say yes to confirm the weight and reps. |
| 24503919, 6268e7f / confirmation/set / COACH_CONFIRMATION_REQUIRED | O | Say yes and I will log 110 lb for 8 reps. Nothing is recorded yet. Nothing was recorded. | Nothing is recorded yet. Say yes to confirm the weight and reps. |
| 6268e7f / checkin/input / CHECKIN_INPUT_INVALID | C | unknown answer SYNTHETIC_DIAGNOSTIC_777333 Nothing changed. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 6268e7f / checkin/input / CHECKIN_INPUT_INVALID | W, O | unknown answer SYNTHETIC_DIAGNOSTIC_777333 Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. |
| 6268e7f / unknown/wave / WAVE1_TOOL_NOT_IN_LIST | C | SYNTHETIC_DIAGNOSTIC_777333 is not one of the wave-one tools Nothing changed. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 6268e7f / unknown/wave / WAVE1_TOOL_NOT_IN_LIST | W, O | SYNTHETIC_DIAGNOSTIC_777333 is not one of the wave-one tools Nothing was recorded. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 6268e7f / unknown/onboarding / ONBOARDING_TOOL_NOT_IN_LIST | C | SYNTHETIC_DIAGNOSTIC_777333 is not one of the seven onboarding tools Nothing changed. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 6268e7f / unknown/onboarding / ONBOARDING_TOOL_NOT_IN_LIST | W, O | SYNTHETIC_DIAGNOSTIC_777333 is not one of the seven onboarding tools Nothing was recorded. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 6268e7f / catch/wave / WAVE1_TOOL_THREW | C | SYNTHETIC_DIAGNOSTIC_777333 Nothing changed. | Something went wrong inside that tool on this device. I could not complete the request. |
| 6268e7f / catch/wave / WAVE1_TOOL_THREW | W, O | SYNTHETIC_DIAGNOSTIC_777333 Nothing was recorded. | Something went wrong inside that tool on this device. I could not complete the request. |
| 6268e7f / catch/onboarding / ONBOARDING_TOOL_THREW | C | SYNTHETIC_DIAGNOSTIC_777333 Nothing changed. | Something went wrong inside that tool on this device. I could not complete the request. |
| 6268e7f / catch/onboarding / ONBOARDING_TOOL_THREW | W, O | SYNTHETIC_DIAGNOSTIC_777333 Nothing was recorded. | Something went wrong inside that tool on this device. I could not complete the request. |
| 6268e7f / submit/SYNTHETIC_DIAGNOSTIC_777333 / SYNTHETIC_DIAGNOSTIC_777333 -> SETUP_INPUT_INVALID | C | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 6268e7f / submit/SYNTHETIC_DIAGNOSTIC_777333 / SYNTHETIC_DIAGNOSTIC_777333 -> SETUP_INPUT_INVALID | W, O | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / checkin/ALREADY_RECORDED / CHECKIN_NOT_RECORDED | C | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing changed. |
| 00d006d4 / checkin/ALREADY_RECORDED / CHECKIN_NOT_RECORDED | W, O | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. | Today&#8217;s check-in is already recorded on this device. Changing a recorded answer needs the correction path, which is not wired yet. Nothing was recorded. |
| 00d006d4 / checkin/NOTHING_ANSWERED / CHECKIN_NOT_RECORDED | C | Answer at least one question, or leave the check-in for today. Nothing was recorded. | Answer at least one question, or leave the check-in for today. Nothing was recorded. Nothing changed. |
| 00d006d4 / checkin/NO_STORE / CHECKIN_NOT_RECORDED | C | This device could not open its encrypted local store, so no check-in can be recorded here. | This device could not open its encrypted local store, so no check-in can be recorded here. Nothing changed. |
| 00d006d4 / checkin/NO_STORE / CHECKIN_NOT_RECORDED | W, O | This device could not open its encrypted local store, so no check-in can be recorded here. | This device could not open its encrypted local store, so no check-in can be recorded here. Nothing was recorded. |
| 00d006d4 / checkin/HOURS_OUT_OF_RANGE / CHECKIN_NOT_RECORDED | C | An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded. | An approximate sleep length is recorded between 0 and 24 hours. Nothing was recorded. Nothing changed. |
| 00d006d4 / checkin/DAYS_INVALID / CHECKIN_NOT_RECORDED | C | Days away from training is recorded as a whole number of days. Nothing was recorded. | Days away from training is recorded as a whole number of days. Nothing was recorded. Nothing changed. |
| 00d006d4 / checkin/SAVE_REFUSED / CHECKIN_NOT_RECORDED | C | This check-in could not be recorded on this device, and no part of it was recorded. | This check-in could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / checkin/SAVE_REFUSED / CHECKIN_NOT_RECORDED | W, O | This check-in could not be recorded on this device, and no part of it was recorded. | This check-in could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / checkin/input / CHECKIN_INPUT_INVALID | C | I could not record that check-in answer. Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 00d006d4 / checkin/host exception / CHECKIN_NOT_RECORDED | C | I could not record that check-in answer. Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 00d006d4 / checkin/host code / CHECKIN_NOT_RECORDED | C | I could not record that check-in answer. Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 00d006d4 / checkin/host copy / CHECKIN_NOT_RECORDED | C | I could not record that check-in answer. Nothing was recorded. | I could not record that check-in answer. Nothing was recorded. Nothing changed. |
| 00d006d4 / wrapper/source unavailable / CHECKIN_NOT_RECORDED -> CHECKIN_SOURCE_UNAVAILABLE | C | I could not record that check-in answer. Nothing was recorded. | The check-in could not be read on this device. Nothing was recorded. Nothing changed. |
| 00d006d4 / wrapper/source unavailable / CHECKIN_NOT_RECORDED -> CHECKIN_SOURCE_UNAVAILABLE | W, O | I could not record that check-in answer. Nothing was recorded. | The check-in could not be read on this device. Nothing was recorded. |
| 00d006d4 / wrapper/night changed / CHECKIN_NOT_RECORDED -> SLEEP_NIGHT_CHANGED | C | I could not record that check-in answer. Nothing was recorded. | This night changed while you were editing. Review the saved record before trying again. Nothing was recorded. Nothing changed. |
| 00d006d4 / wrapper/night changed / CHECKIN_NOT_RECORDED -> SLEEP_NIGHT_CHANGED | W, O | I could not record that check-in answer. Nothing was recorded. | This night changed while you were editing. Review the saved record before trying again. Nothing was recorded. |
| 00d006d4 / machine/read missing identity / COACH_MACHINE_SETTINGS_INVALID | C | I need to know which machine you mean. | I need to know which machine you mean. Nothing changed. |
| 00d006d4 / machine/read missing identity / COACH_MACHINE_SETTINGS_INVALID | W, O | I need to know which machine you mean. | I need to know which machine you mean. Nothing was recorded. |
| 00d006d4 / machine/save throw / COACH_MACHINE_SETTINGS_INVALID | C | I could not keep that, and I have kept nothing. | I could not keep that, and I have kept nothing. Nothing changed. |
| 00d006d4 / machine/save throw / COACH_MACHINE_SETTINGS_INVALID | O | I could not keep that, and I have kept nothing. | I could not keep that, and I have kept nothing. Nothing was recorded. |
| 00d006d4 / machine/host copy / COACH_MACHINE_SETTINGS_INVALID | C | Your device would not accept that write. | Your device would not accept that write. Nothing changed. |
| 00d006d4 / machine/host copy / COACH_MACHINE_SETTINGS_INVALID | W, O | Your device would not accept that write. | Your device would not accept that write. Nothing was recorded. |
| 00d006d4 / unknown/wave / WAVE1_TOOL_NOT_IN_LIST | C | I cannot use that tool here, so I did nothing. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 00d006d4 / unknown/wave / WAVE1_TOOL_NOT_IN_LIST | W, O | I cannot use that tool here, so I did nothing. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 00d006d4 / unknown/onboarding / ONBOARDING_TOOL_NOT_IN_LIST | C | I cannot use that tool here, so I did nothing. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 00d006d4 / unknown/onboarding / ONBOARDING_TOOL_NOT_IN_LIST | W, O | I cannot use that tool here, so I did nothing. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 00d006d4 / unknown/memory / MEMORY_TOOL_NOT_IN_LIST | C | I cannot use that tool here, so I did nothing. | I cannot use that tool here, so I did nothing. Nothing changed. |
| 00d006d4 / unknown/memory / MEMORY_TOOL_NOT_IN_LIST | W, O | I cannot use that tool here, so I did nothing. | I cannot use that tool here, so I did nothing. Nothing was recorded. |
| 00d006d4 / submit/CLEAN_INIT_SETUP_REQUIRED / CLEAN_INIT_SETUP_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / submit/CLEAN_INIT_SETUP_REQUIRED / CLEAN_INIT_SETUP_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / submit/CLEAN_INIT_SPLIT_REQUIRED / CLEAN_INIT_SPLIT_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / submit/CLEAN_INIT_SPLIT_REQUIRED / CLEAN_INIT_SPLIT_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / submit/CLEAN_INIT_EXERCISES_REQUIRED / CLEAN_INIT_EXERCISES_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / submit/CLEAN_INIT_EXERCISES_REQUIRED / CLEAN_INIT_EXERCISES_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / submit/CLEAN_INIT_EXERCISE_REQUIRED / CLEAN_INIT_EXERCISE_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / submit/CLEAN_INIT_EXERCISE_REQUIRED / CLEAN_INIT_EXERCISE_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / submit/CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED | C | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / submit/CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED | W, O | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |
| 00d006d4 / submit/SYNTHETIC_DIAGNOSTIC_777333 / SETUP_INPUT_INVALID | C | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing changed. |
| 00d006d4 / submit/SYNTHETIC_DIAGNOSTIC_777333 / SETUP_INPUT_INVALID | W, O | Your week could not be recorded on this device, and no part of it was recorded. | Your week could not be recorded on this device, and no part of it was recorded. Nothing was recorded. |

Confirmation data is still separate and unlicensed: the measured set example's
confirmation.text.display is Say yes and I will log 110 lb for 8 reps. Nothing
is recorded yet. This is not a line any of the three refusal renderers prints.
The verbatim N6 contract paragraph assigns the display/yes duty to C-UI-6.

### Bar and scope

Environment set before every test execution, each on its own PowerShell line:

```powershell
$env:MEASURED_TEST_NOW='2026-09-03'
$env:TZ='America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-reporter=tap 'rebuild/coach/test/*.test.cjs'
```

Final measured TAP summary (node exit 0):

```text
# tests 371
# suites 0
# pass 371
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

371 = 352 input tests + 18 new cells + one split-out existing memory control.
The focused red file had 22 failures; all corresponding final cells pass.
The full bar also includes all memory read/write, numeric licensing, rollback
and demo tests. No install, commit, push or forbidden git mutation was run.

Measured git diff --numstat -- rebuild/engine rebuild/m3 rebuild/m4 rebuild/client .github:
EMPTY. git diff --check: exit 0. Added tracked lines and both new helper scripts:
zero non-ASCII characters (report additions checked separately after writing).
Transient TAP/JSON capture outputs are removed after their measurements are
recorded here; only files created during this assignment are removed. The two
reproducible support/capture scripts remain under rebuild/coach/test/.

### What I did not verify

- No physical phone, deployed coach surface, rendered confirmation UI, or spoken-audio session was exercised.
- No private fixture, protected soak or personal data was opened. The conformance/private bar, rig187 and client suite were not run; the task's coach bar was runnable in this sandbox and passed.
- This is not an independent Claude review or acceptance. No commit or PR was made, per the fix-round instruction.
- The synthetic write-then-throw witness measures a completed fixture write; it does not simulate every storage implementation or claim that every thrown tool wrote.
- N3 and N9 remain as explicitly deferred above. Arbitrary host-copy domains are represented by the exact renderer rule plus measured examples, not a claim to have executed every possible string.

### Final working-tree snapshots

git status --porcelain:

```text
 M rebuild/coach/TOOL-CONTRACT.md
 M rebuild/coach/coach-text.cjs
 M rebuild/coach/local-world.mjs
 M rebuild/coach/memory-tools.cjs
 M rebuild/coach/model-adapter.md
 M rebuild/coach/onboarding-text.cjs
 M rebuild/coach/onboarding-tools.cjs
 M rebuild/coach/test/text-tags.test.cjs
 M rebuild/coach/tools.cjs
 M rebuild/coach/wave1-tools.cjs
 M rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md
?? rebuild/coach/test/review-r2-copy.cjs
?? rebuild/coach/test/review-r2-support.cjs
```

git diff --stat (tracked paths; the two new scripts appear in status above):

```text
 rebuild/coach/TOOL-CONTRACT.md                   |  35 +-
 rebuild/coach/coach-text.cjs                     |   3 +-
 rebuild/coach/local-world.mjs                    |   7 +-
 rebuild/coach/memory-tools.cjs                   |  19 +-
 rebuild/coach/model-adapter.md                   |   3 +
 rebuild/coach/onboarding-text.cjs                |   3 +-
 rebuild/coach/onboarding-tools.cjs               |   8 +-
 rebuild/coach/test/text-tags.test.cjs            | 136 +++++++-
 rebuild/coach/tools.cjs                          |  36 ++-
 rebuild/coach/wave1-tools.cjs                    |   8 +-
 rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md | 388 +++++++++++++++++++++++
 11 files changed, 589 insertions(+), 57 deletions(-)
```

## Review R2: fixed, PM read

Follow-up to round 3, 2026-09-19. PM read the prior round 3 hunks and reported
371/371 outside this sandbox. This addendum records my two requested changes;
it does not claim the PM or independent Claude reviewer has reviewed them yet.
Branch rebuild/c-coach-text-tags, HEAD 00d006d4; still uncommitted.

Change 1: text-tags.test.cjs now holds BASE_LINES, a table of string literals
keyed by refusal code, renderer and case. Its 72 entries cover six model copies
(18), two wrapper pairs (6), already-recorded and two machine-settings reasons
(9), and all 13 R1 B3 rows using historical endings (39). B3 case numbers are
zero-based matrix row indexes. The three explicit catch/confirmation exception
rows retain their existing expected sentences. No test row was removed.

Before removing the historical path, I loaded the written literal declaration
and compared every entry with the existing helper's renderer output at 24503919
for that captured synthetic envelope. Environment was set as shown below.
Exact comparison output, while the historical helper was still present:

```text
AGREE CHECKIN_NOT_RECORDED / coach / model:ALREADY_RECORDED
AGREE CHECKIN_NOT_RECORDED / wave1 / model:ALREADY_RECORDED
AGREE CHECKIN_NOT_RECORDED / onboarding / model:ALREADY_RECORDED
AGREE CHECKIN_NOT_RECORDED / coach / model:NOTHING_ANSWERED
AGREE CHECKIN_NOT_RECORDED / wave1 / model:NOTHING_ANSWERED
AGREE CHECKIN_NOT_RECORDED / onboarding / model:NOTHING_ANSWERED
AGREE CHECKIN_NOT_RECORDED / coach / model:NO_STORE
AGREE CHECKIN_NOT_RECORDED / wave1 / model:NO_STORE
AGREE CHECKIN_NOT_RECORDED / onboarding / model:NO_STORE
AGREE CHECKIN_NOT_RECORDED / coach / model:HOURS_OUT_OF_RANGE
AGREE CHECKIN_NOT_RECORDED / wave1 / model:HOURS_OUT_OF_RANGE
AGREE CHECKIN_NOT_RECORDED / onboarding / model:HOURS_OUT_OF_RANGE
AGREE CHECKIN_NOT_RECORDED / coach / model:DAYS_INVALID
AGREE CHECKIN_NOT_RECORDED / wave1 / model:DAYS_INVALID
AGREE CHECKIN_NOT_RECORDED / onboarding / model:DAYS_INVALID
AGREE CHECKIN_NOT_RECORDED / coach / model:SAVE_REFUSED
AGREE CHECKIN_NOT_RECORDED / wave1 / model:SAVE_REFUSED
AGREE CHECKIN_NOT_RECORDED / onboarding / model:SAVE_REFUSED
AGREE CHECKIN_INPUT_INVALID / coach / B3:0
AGREE CHECKIN_INPUT_INVALID / wave1 / B3:0
AGREE CHECKIN_INPUT_INVALID / onboarding / B3:0
AGREE COACH_MACHINE_SETTINGS_INVALID / coach / B3:1
AGREE COACH_MACHINE_SETTINGS_INVALID / wave1 / B3:1
AGREE COACH_MACHINE_SETTINGS_INVALID / onboarding / B3:1
AGREE WAVE1_TOOL_NOT_IN_LIST / coach / B3:2
AGREE WAVE1_TOOL_NOT_IN_LIST / wave1 / B3:2
AGREE WAVE1_TOOL_NOT_IN_LIST / onboarding / B3:2
AGREE ONBOARDING_TOOL_NOT_IN_LIST / coach / B3:3
AGREE ONBOARDING_TOOL_NOT_IN_LIST / wave1 / B3:3
AGREE ONBOARDING_TOOL_NOT_IN_LIST / onboarding / B3:3
AGREE CLEAN_INIT_SETUP_REQUIRED / coach / B3:6
AGREE CLEAN_INIT_SETUP_REQUIRED / wave1 / B3:6
AGREE CLEAN_INIT_SETUP_REQUIRED / onboarding / B3:6
AGREE CLEAN_INIT_SPLIT_REQUIRED / coach / B3:7
AGREE CLEAN_INIT_SPLIT_REQUIRED / wave1 / B3:7
AGREE CLEAN_INIT_SPLIT_REQUIRED / onboarding / B3:7
AGREE CLEAN_INIT_EXERCISES_REQUIRED / coach / B3:8
AGREE CLEAN_INIT_EXERCISES_REQUIRED / wave1 / B3:8
AGREE CLEAN_INIT_EXERCISES_REQUIRED / onboarding / B3:8
AGREE CLEAN_INIT_EXERCISE_REQUIRED / coach / B3:9
AGREE CLEAN_INIT_EXERCISE_REQUIRED / wave1 / B3:9
AGREE CLEAN_INIT_EXERCISE_REQUIRED / onboarding / B3:9
AGREE CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / coach / B3:10
AGREE CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / wave1 / B3:10
AGREE CLEAN_INIT_PRIORITY_MUSCLES_REQUIRED / onboarding / B3:10
AGREE SETUP_INPUT_INVALID / coach / B3:11
AGREE SETUP_INPUT_INVALID / wave1 / B3:11
AGREE SETUP_INPUT_INVALID / onboarding / B3:11
AGREE CHECKIN_NOT_RECORDED / coach / B3:12
AGREE CHECKIN_NOT_RECORDED / wave1 / B3:12
AGREE CHECKIN_NOT_RECORDED / onboarding / B3:12
AGREE COACH_SET_NOT_RECORDED / coach / B3:14
AGREE COACH_SET_NOT_RECORDED / wave1 / B3:14
AGREE COACH_SET_NOT_RECORDED / onboarding / B3:14
AGREE MEMORY_TOOL_NOT_IN_LIST / coach / B3:15
AGREE MEMORY_TOOL_NOT_IN_LIST / wave1 / B3:15
AGREE MEMORY_TOOL_NOT_IN_LIST / onboarding / B3:15
AGREE CHECKIN_SOURCE_UNAVAILABLE / coach / wrapper
AGREE CHECKIN_SOURCE_UNAVAILABLE / wave1 / wrapper
AGREE CHECKIN_SOURCE_UNAVAILABLE / onboarding / wrapper
AGREE SLEEP_NIGHT_CHANGED / coach / wrapper
AGREE SLEEP_NIGHT_CHANGED / wave1 / wrapper
AGREE SLEEP_NIGHT_CHANGED / onboarding / wrapper
AGREE CHECKIN_NOT_RECORDED / coach / tails:already
AGREE CHECKIN_NOT_RECORDED / wave1 / tails:already
AGREE CHECKIN_NOT_RECORDED / onboarding / tails:already
AGREE COACH_MACHINE_SETTINGS_INVALID / coach / tails:machine read
AGREE COACH_MACHINE_SETTINGS_INVALID / wave1 / tails:machine read
AGREE COACH_MACHINE_SETTINGS_INVALID / onboarding / tails:machine read
AGREE COACH_MACHINE_SETTINGS_INVALID / coach / tails:machine host
AGREE COACH_MACHINE_SETTINGS_INVALID / wave1 / tails:machine host
AGREE COACH_MACHINE_SETTINGS_INVALID / onboarding / tails:machine host
LITERAL AGREEMENT: 72/72 rows; 0 mismatches; historical helper still present.
```

Removed atBase and baseLine and the process import from review-r2-support.cjs;
only fromSource remains for N4. Deleted the untracked review-r2-copy.cjs created
in round 3, whose historical census depended on atBase. No executable process
or historical lookup remains in the coach test tree. Existing tests that name
forbidden process tokens in source-deny assertions remain unchanged.

Change 2: checkin-refusals.cjs exports exactly the two frozen wrapper pairs and
requires nothing. local-world.mjs requires and re-exports the same names;
tools.cjs requires the leaf at the top and checks exact wrapper pairs before
attempting the model import in its own try. A model import failure therefore
cannot erase either wrapper pair. The model copies still fall back to the
generic refusal, with the import failure preserved in provenance.
TOOL-CONTRACT.md documents the leaf and the import-failure behavior.

Extended N4 from one row to four: existing NO_STORE plus ALREADY_RECORDED and
both wrapper pairs with the model import replaced by a throwing data module.
Added one source assertion excluding an import of local-world from tools.cjs.
Before the product change, the focused file measured 64 tests / 61 pass / 3 fail:

```text
not ok 60 - R2 N4 check-in vocabulary import rejection is contained: CHECKIN_SOURCE_UNAVAILABLE
not ok 61 - R2 N4 check-in vocabulary import rejection is contained: SLEEP_NIGHT_CHANGED
not ok 64 - R2 N4 tools source does not import local-world
# tests 64
# pass 61
# fail 3
```

Final coach bar, one Node process with test isolation disabled to respect the
other hand's timing-sensitive work. All files selected by the same coach glob:

```powershell
$env:MEASURED_TEST_NOW='2026-09-03'
$env:TZ='America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none --test-reporter=tap 'rebuild/coach/test/*.test.cjs'
```

```text
# tests 375
# pass 375
# fail 0
# cancelled 0
# skipped 0
# todo 0
NODE_EXIT=0
```

375 = prior 371 + three additional N4 behavior rows + one source assertion.
The focused file now has 64 rows, all included in that full passing bar.
The sandbox could run this single-process Windows coach bar and the one-time
historical capture. I could not run the PM's Linux reading-room half here.
The default child-process-isolated runner was not run, to honor the one-Node
constraint. No private/conformance, protected soak, phone or deployed UI bar was
run; this result is the public synthetic coach bar only.

Verification: git diff --check exit 0. New lines are ASCII and the changed code
and contract files use LF. The six other round 3 product files are byte-identical
to their arrival snapshots. Only the requested coach files and this appended
report changed during this follow-up. The report's prior bytes are preserved.
The leaf exports exactly two frozen pairs and has no dependencies. Temporary
captures from this follow-up were removed after recording their evidence.
No protected path was opened or written; no git mutation, install or publish
was performed. PM commit/push and independent Claude review remain external.

### Final follow-up working-tree snapshots

git status --porcelain:

```text
 M rebuild/coach/TOOL-CONTRACT.md
 M rebuild/coach/coach-text.cjs
 M rebuild/coach/local-world.mjs
 M rebuild/coach/memory-tools.cjs
 M rebuild/coach/model-adapter.md
 M rebuild/coach/onboarding-text.cjs
 M rebuild/coach/onboarding-tools.cjs
 M rebuild/coach/test/text-tags.test.cjs
 M rebuild/coach/tools.cjs
 M rebuild/coach/wave1-tools.cjs
 M rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md
?? rebuild/coach/checkin-refusals.cjs
?? rebuild/coach/test/review-r2-support.cjs
```

git diff --stat (tracked paths; the new leaf and remaining helper appear in status):

```text
 rebuild/coach/TOOL-CONTRACT.md                   |  38 +-
 rebuild/coach/coach-text.cjs                     |   3 +-
 rebuild/coach/local-world.mjs                    |   6 +-
 rebuild/coach/memory-tools.cjs                   |  19 +-
 rebuild/coach/model-adapter.md                   |   3 +
 rebuild/coach/onboarding-text.cjs                |   3 +-
 rebuild/coach/onboarding-tools.cjs               |   8 +-
 rebuild/coach/test/text-tags.test.cjs            | 342 ++++++++++++-
 rebuild/coach/tools.cjs                          |  42 +-
 rebuild/coach/wave1-tools.cjs                    |   8 +-
 rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md | 584 +++++++++++++++++++++++
 11 files changed, 996 insertions(+), 60 deletions(-)
```
