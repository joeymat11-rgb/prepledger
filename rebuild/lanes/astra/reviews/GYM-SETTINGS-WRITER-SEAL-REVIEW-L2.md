# GYM-SETTINGS-WRITER-SEAL independent review L2
Verdict: REJECT. L1 retry fixed; two executed specification failures remain.
Reviewer: Astra, separate from author, PM and integrator. Date: 2026-09-21.
Candidate: bda6a93e9621cb00aa743f2dd97063dbedee75d1.
Baseline: b35a48e35a1f3e3c278c377934794a32b632535b; paper: accepted6fe4d12c.
Read actual two-line repair and63-line mounted test before the author's report.
Whole author report read after independent source/runtime conclusions.

L1 replay:24 mounted cases, two immutable versions, three settlements, two theme
attributes, same/replacement editor. Candidate replacement retry now succeeds6/6.
Eight same-editor refusal/rejection retry controls remain green. L1 blocker closed.

GSS-L2-1 BLOCKING: older success steals the replacement input's focus.
Repro: valid deferred Save; open/type replacement; focus its value INPUT;
settle older success. Candidate moves focus to H1 in2/2 theme cases.
Old refusal/rejection retain INPUT focus4/4. Replacement answers remain intact.
gym-settings-lane.mjs:137 repaints on the successful cache refresh;
gym-app.mjs:174 unconditionally focuses the freshly painted heading.
This also happens on the baseline: inherited behavior newly forbidden by this spec,
not another L1-introduced regression. B/E GSS-LATE-COMPLETION forbid focus takeover.
The new UI test:1540 explicitly EXPECTS success to replace focus, and never focuses
the replacement input. Correct this expectation and prove real input focus survives.
Required fix: refresh the captured lift while preserving replacement-editor focus,
answers and errors; do not weaken the owned late-completion rule to match baseline.

GSS-L2-2 BLOCKING: same-count API host leaks pass the entire writer fence.
Plant1: first.settings.pending returns api instead of api.pending().
Plant2: first.settings.ready calls api.lane() instead of api.ready().
Each actual fence run remains401/401, exit0, zero skips/cancellations.
Mounted reach proof: each altered route returns the EXACT injected host and permits
one unbound synthetic save; pristine routes expose none and make zero saves.
Cause: writer-fence.test.mjs:2159-2171 pins bareApi=6 and exactLane=1 only.
Both substitutions preserve those counts but violate B/D's exact api use windows,
pending/ready types and sole host passthrough. This is not an arbitrary-JS claim.
Required fix: pin all holder acquisition/use mappings with existing scanner tools;
retain unrelated/reformat positives and add both same-count negative plants.
Controls: pristine/unrelated/pending-format401/401 each; extra alias400/401, exit1,
with the intended GSS-API-PARITY bareApi7-versus6 failure. No candidate source changed.

Evidence root: %TEMP%/gss-review-l2-ef2f05f2c5e04cd28680dc3ee52a8797/.
Mounted proof: replacement-editor.mjs and replacement-editor-results.json,24cases.
Fence: fence-override.mjs, run-fence-mutations.mjs, six fence-*.log final runs.
Use fence-results-final.json, including each final log hash; NOT fence-results.json.
Corrected control: fence-reformat.log; terminal687b6a exit0,401/401,141source reads.
Its SHA256:835afe064b5aee26fa2466046d1433652bacfd58597bba8a3a527c653688da62.
Reach: api-route-reach.mjs and api-route-results.json,3completed modes, exit0.
Excluded: initial Windows import-URL startup failure; first lane-format control
collided with the fence's own exact reformat anchor. Both failures remain retained.
The corrected control reformats pending; original JSON/logs are not rewritten.

Static custody: helper bodies/comments equal accepted base;12direct D2 cells plus2
supports independently enumerated, all14blobs equal e08bc11c. No13th identity found.
No D2 runtime rerun or count waiver; failed lifecycle cells remain unresolved evidence.
Remaining: all17 groups and defect plants, complete mounted Section E matrix and
full operation/outbox bytes after reopen. Helper/host-reference parity is insufficient.
Theme attributes/jsdom are not phone-browser visual proof; no such claim is made.
No real store write, forbidden input, product edit, commit/push/fetch or deployment.
Pinned Node; TZ=America/New_York; MEASURED_TEST_NOW=2026-09-03. Runtime RELEASED.
Still owed: corrections/replay, unfinished independent checks, Claude final,
exact-head Windows/Linux CI, separate integration and seal. Nothing accepted/sealed.
