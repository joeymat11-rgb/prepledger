# GATE AUDIT - SPEC POINT - P2 "S3 import join"

Independent audit (Sonnet, HIGH), DECISIONS:416 point 5, executed 2026-09-15 in the cloud clone at tip ea0998fe (P1/P0-B/P5/P-COACH already MERGED at :425/:428/:429/:430), against origin/rebuild/astra-d-s3-core-r2 (R2 candidate 0df6ad3f) and preserve/d-s3-harness-repair (f0b01d9). No private, ledger, history.js, soak or conform/private path opened. Filed by the PM at DECISIONS:436; the P2 ticket folds findings 1-3 in.

## VERDICT: SPEC-READY-WITH-FINDINGS

The D proposal (S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md) is precise and its B-custody description matches the merged companion byte-for-byte. The P2 bar in CRITICAL-PATH section 4 has one real scope gap (the Today/gym consumer wiring is required by the bar but has no named files or acceptance cells) and two ambiguous/untested pin items. None block starting the D-side build; the gap is ticketed for lane C before the independent review.

## FINDINGS

1. [MAJOR] "Visible on Today and the gym card" has no consumer-side file list or test cell. rebuild/m3/w6/local/source-admission.mjs:143 (R2 branch) sets integration_pending:['local-capture-start-resume','today-gym-consumers'] on every successful import view. P0-B's adoption path (today-app.cjs setup.athleteState() -> today-model.cjs pendingAdoption) reads state built by replaying collections.ops; the import commit (source-admission.mjs:187-192) writes only metadata.localSources / collections.derived.localSource, never new ops. CRITICAL-PATH section 4 P2 names D's three files but no C file or cell for the one bar item that requires a screen to change.

2. [MEDIUM] The pin scheme the proposal says to update does not yet name what it updates. rebuild/m4/import/local-source-profile.cjs SOURCE_PINS (R2 branch) pins only oracle-shim.cjs and index.cjs, both unchanged on the tip because they merely require() merge.cjs/today.cjs. The two files S3 changed are pinned nowhere in this map. Proposal point 22 anticipates new pins but names neither the field nor a test; no cell in engine-provider.test.cjs exercises a changed merge.cjs/today.cjs. Needs a new cell asserting the mapping is re-qualified (or refused) after the companion's byte change.

3. [NOTE] "27 real Edge checks" is fully defined but its precondition is unstated: rebuild/m3/w6/test/local-source-browser.mjs:44-48 launches real headless Microsoft Edge via playwright-core chromium.launchPersistentContext against verifiedBrowser(process.env.W6_BROWSER_BIN); playwright-core and a real msedge.exe path are needed on the PC.

4. [NOTE] P3-STAGE (DECISIONS:431 point 15) had not been started at audit time; it is only a name in the ledger.

## ANSWERS

1. Bar completeness: each clause maps to an existing evidence class in S3-CORE-R3-HARNESS-REPORT.md (57/41 positives, 56 mutants/7 baselines, 27 Edge, 22 boundary, all previously executed at R2/R3). Two items need new cells: the pin re-qualification (finding 2) and the Today/gym visibility clause (finding 1). "27 real Edge checks" is not ambiguous, but its toolchain precondition is unstated (finding 3).

2. D custody vs the merged companion: identical. createMerge(E,{clock,nativeDate=Date}), five parse sites and one constructor (merged merge.cjs:4,87,172,188,526,576); sessionMembership(s,iso) null on non-U/L days else {day,exercise_ids} (merged today.cjs:68-86); runtime EXPOSED five names (engine-runtime.cjs:40,69). No mismatch.

3. R2 REJECT (:250): the harness repair f0b01d9 honestly scopes itself to R2-2/R2-3; R2-1/R2-4 remain open and are exactly the D wiring (engine-provider.cjs has no nativeDate in deps; local-source-profile.cjs has no native-Date capability; source-admission.mjs resolveCapturedLayout still calls genSession(state, originalDay) instead of sessionMembership).

4. Owner gates: no real port (synthetic bundle only; port.cjs README rule untouched); no private path in the R2 diff (30 files under m3/w6, m4/import, m4/spec); D8/PATH A honoured (no invented sleep; membership reads no sleep); D's three target files are pinned by no package; merge.cjs/today.cjs/engine-runtime.cjs are S3 pins that D consumes, not edits; rebuild/m3/w6/local/today-bindings.mjs IS pinned (H3/B-NTC/S3) and is a plausible landing spot for the consumer work, so the consumer wiring must avoid it or ride the next re-pin.

5. End-to-end witness: needs a further consumer change. The import commits metadata/derived fields and marks 'today-gym-consumers' integration_pending; P0-B's adoption path replays collections.ops. The P2 title already says "C the consumer"; the file list did not.

6. Longest remaining wait P2 -> P3: the independent MAX review of the complete successor (Node + Edge parity, the full-year/September-only context pair, and the new consumer path), serialised on the one PC; a REJECT costs 2-4 days. Shortened by ticketing the consumer files now, confirming the Edge toolchain once, and running review and PC runs in parallel (owner point 13).

7. P3 pre-stage risks: (a) an input shape outside the 41 import positives (multi-year gaps, an undo sequence, a correction chain) trips dataLossGuard or the port-oracle, which correctly refuses, but the refuse-and-retry loop is unrehearsed; (b) the --out / OneDrive-sync path check (port README 63-70) has a history of bypass tricks landing files inside the repo. Recommend P3-STAGE against an adversarial synthetic bundle before Joe's "run it now" sentence.
