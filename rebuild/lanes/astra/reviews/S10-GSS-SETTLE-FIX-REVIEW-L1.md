# S10 GSS settle fix review L1
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; test tier; round 1
Head checked: e9ff2ca24e6e3a7632fb1e1724928d8db0fb4945; parent ccc2f6320805eaba92963e7158cbe9b2df3a23f2; checkout detached.
VERDICT: ACCEPT WITH NAMED DEBTS
Test synchronization delta accepted. Seal remains pending the PM's repins and gates. No other review was opened.

Q1. Invariant: preserve all previous test inputs and oracles.
Commit-tree comparison finds exactly the two commissioned test files, with +16 and +14 lines, zero removed/replaced lines. Line-sequence byte comparison proves every old assertion, label, plant, negative check, until(), within(), and timeout unchanged. Worktree bytes equal e9ff2ca; both files contain zero CR bytes and zero non-ASCII bytes. Product bytes did not change.

Q2. Input: independent deterministic crypto slowdown; output: repeatable old red/new green.
Windows, Node v24.19.0; every process used MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York. One file/process at a time, direct node:test execution with TAP, no child Node process. Base/head test copies retain their exact committed bytes; a resolve hook maps their imports to this worktree.
The preload returns the genuine AES-GCM result after 16 zero-delay timer turns when the async stack names prepareWorkoutContinuation and the synthetic decrypted collection contains a session-set. It changes result timing only. Completed runs show 10/9 delayed results in the two base files and 28/24 in the two head files, respectively.
| File | ccc2f63, 10 runs | e9ff2ca, 10 runs |
| --- | --- | --- |
| gss-annex-g6-g8.test.mjs | 10 exits 1; 1 pass/4 fail each | 10 exits 0; 5 pass each |
| gss-annex-log-timing.test.mjs | 10 exits 1; 2 pass/1 fail each | 10 exits 0; 3 pass each |
All 40 runs had zero skipped/cancelled rows. All original plants remained executable. Head total: 80/80 top-level rows. Base runtimes 4.94-5.73 s; head 10.58-12.14 s.
Base failure codes: GSS-G6-SAVED-SCREEN; GSS-G6-NEUTRAL-SAVED-SCREEN-why-toggle; GSS-G6-NEUTRAL-SAVED-SCREEN-settings-read; GSS-G7-CLEAN-SAVED-SCREEN. G5 fails GSS-LOG-MISSING-CONTROL [data-slot="primary"] before its deferred saved-title assertion. This reproduces the five named failing rows, not a G5 saved-title error that these base bytes cannot reach on a wholly absent screen.

Q3. Counterexamples: product variants served from scratch through the resolve hook; original test bytes retained.
| Variant input | Observed output |
| --- | --- |
| Suppress saved render permanently | Both head files red: the four G6/G7 saved-screen codes above; G5 missing-primary code |
| Render saved controls with empty title | Same four codes; GSS-G5-SAVED-SCREEN-MISSING |
| Render title but remove Undo | GSS-G6-UNDO; GSS-G6-NEUTRAL-UNDO-why-toggle; GSS-G6-NEUTRAL-UNDO-settings-read; GSS-G7-CLEAN-UNDO; GSS-G5-UNDO-MISSING |
| Clear title+Undo immediately before head painted-settle callback 8 resolves | Both files red at all five saved-screen codes; 5 connected roots cleared |
| Same clear on timer turn 9 | Both complete head files GREEN; 7 connected roots cleared |
| Clear title+Undo before base delivery-settle callback 8 resolves | Both files red at all five saved-screen codes; 5 connected roots cleared |
| Same base clear on timer turn 9 | Both complete base files GREEN; 7 connected roots cleared |
| Replace saved root with prior active root at head observation turn 8 | Both files red; four saved-screen codes plus G5 missing-primary; 5 connected replacements |
| Same whole-screen stale repaint on turn 9 | Both complete head files GREEN; 7 connected replacements |
Eighteen variant file executions; no skipped/cancelled rows. Boundary timers target the named settle call stacks. Old-boundary probes delay continuation decrypts only after saved becomes visible, keeping the root connected while Next is pending; head-boundary probes use the Q2 slowdown. Extra clears of already detached roots are excluded from connected counts.
Exact horizon: before the fix, the snapshot follows 8 timer callbacks after held.done. After the fix, first wait for logged title AND Undo, then 8 more timer callbacks before the snapshot. A persistent clear before that snapshot is caught; the next timer turn is already outside it. These are ordering bounds, not guaranteed millisecond durations. The nominal 5000 ms appearance deadline also has the final settle tail. At turn 9 the tests have already sampled success and requested Next; they do not prove idle-screen retention beyond their snapshot, or detect every disappear/reappear interval.

Q4. Product output under the independent slowdown.
Every successful Log path exercised by all 20 head file runs reached the asserted saved title and Undo, and subsequent existing draft, durable-op/outbox, callback and navigation oracles passed. No never-appearing screen or real stale-clear race was observed. The lane's readSequence/installView guard rejects obsolete read results (gym-settings-lane.mjs:307-329). This finite experiment supports the asynchronous-read explanation; it is not proof over every possible schedule.

Q5. Seal inputs.
S10.json:900 still pins base g6-g8 SHA256 83f4c1db2e7e0216345e5f7478e88f2e5476dd941368ca67b2fd3877052b4a2c; head is 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd.
S10.json:910 still pins base log-timing SHA256 cea1cd3f392d8ef679e0659eb2b8cf6c6b9742e23b343ab1927fb797d6fbb74b; head is ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0.
Only package child today-17 names either changed file in its argv (lines 1684/1686). PM S10-REGEN, pin review, affected-child T4, T6 and T7 remain outstanding per DECISIONS:832; none was executed here.

BLOCKING: None for this test-only delta. The stale package pins prevent sealing the current package as-is.
NAMED DEBTS: GSS-LATE-CLEAR: inherited finite sampling horizon; unconditional claims that any late stale repaint is caught are false. GSS-G5-DIAGNOSTIC: a wholly missing saved screen fails at primary-control lookup before its more specific saved-screen oracle. Neither debt is newly introduced by this delta.
Not verified: hosted Windows/Linux exact-head CI, hosted diagnostic logs, full package/conformance/engine suites, other three annex files, or a real phone. No seal, import, ledger/status write, tracked edit, commit, push, fetch, install, or protected-source execution performed.
Containment: helper reads inspected before test execution; explicit module/file read allowlist, write and child-process refusal. The only invoked application filesystem readers load the two selected HTML templates. Forbidden engine entrypoints remained excluded. Calibration containment refusals occurred before the completed measurement matrix; all 58 measured file runs were guard-clean.
Reproduction retained at C:/Users/joeym/AppData/Local/Temp/astra-s10-settle-vf49tt27: matrix.py, variants.py, graph.json, base/head copies, preload.mjs, variant-preload.mjs, variant-gym-app.mjs, matrix.jsonl, variants.jsonl and TAP files. Nothing deleted.
Slowdown preload SHA256: 5c4cb2009db357c84f4fd21bb8883d4b58c92d6dd022a3b64b7b1e54376bd050. Variant preload SHA256: a9251a6dff5a7d29c4d88328650262b534871a269e4a23bcc49df74f4679b534.

Final worktree verification (command outputs):
```
git status --porcelain
?? rebuild/lanes/astra/reviews/S10-GSS-SETTLE-FIX-REVIEW-L1.md
git diff --stat -- rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs rebuild/lanes/astra/reviews/S10-GSS-SETTLE-FIX-REVIEW-L1.md
(no output)
```
