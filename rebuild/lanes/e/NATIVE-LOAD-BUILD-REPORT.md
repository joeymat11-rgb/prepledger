# NATIVE-LOAD build (common part + YES-only + route B): builder report
Builder claude-opus-5-5, 2026-09-23. Worktree earned-nlr, branch rebuild/e-native-load-red at 6b8da5f, ALL UNCOMMITTED. Grant DECISIONS:784-785; spec R7 6ddf7af (sha256 98c0cf7a..., verified). Consent constant sealed 'yes-only'; adoption asks first (H6); route B = FB01 trigger + A button. No [NO-ONLY] clause built (FC15 not built). Protected five never loaded or read (preload guard refuses load AND fs reads; every run reports "protected-in-cache: none").

## Step 1 (tests only) - red at precise gates
- FC12 rebuild/m4/spec/native-load-options.test.cjs +14 [Y] rows: N02c/N03c/N04c/N11/N12/N13/N18/N21 evaluator rows; fold rows N21, N05 landing, N05 forged record, N15, N22.
  Run: 38 tests, 1 pass (GUARD), 37 fail: 30 x RED NATIVE_LOAD_MODULE_ABSENT, 2 x RED UPDATE_OPENER_HOLD_NOT_EXPORTED, 5 x RED NATIVE_LOAD_EFFECTS_ABSENT, nothing else (%TEMP%\nlr-build\step1-red-fc12.txt).
- FA03 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs (new): A01, A02, B01, B02 over the real encrypted stack (fake-indexeddb, jsdom). Green preconditions first (two native U days trained, Finish acknowledged), then 4/4 RED NATIVE_LOAD_HOST_ABSENT (step1-red-fa03.txt).
- Step-1 bytes: FC12 05eba6c4...3b16 (707 lines), FA03 27467c9a...0592 (200 lines); unchanged since (tests were never edited to go green).

## Step 2 (product) - green
- Final run (lock held): FC12 38/38, FA03 4/4, engine-equivalence, native-trend-context: 86 tests, 86 pass (final-green.txt).
- Planted defects (scratch, bytes restored and re-hashed): DEBUT withheld from offers -> 13 [Y] FC12 rows red; FB01 notification removed -> B01, B02 red; host re-evaluation at yes removed -> A02 red; registrar decorator removed -> A01 red.
- Broad local run of the 80 suites that do not name a protected file, compared test-by-test with the same run on a scratch checkout of 6b8da5f (git worktree add, removed after): every failure except the pins in "New red pins" below is identical at the base (missing wrangler, recovery runner env, esbuild cannot resolve @noble/hashes, historical carriers).

## Files changed (sha256 of working bytes) and spec line
- rebuild/engine/native-load.cjs NEW 69958ed2...9487 (451): FC01, section C engine item 1. evaluateNativeLoad/applyNativeLoadDecision; typed effort token; two full views; spend suffix on _deriveSightingFull output; moved governor; unchanged earnWalk once; adoption; landing; compensation offer/transition.
- rebuild/engine/writers.cjs c7b11beb...9739: FG01, section C item 2. Pure move of :234-239 into updateOpenerHold (six lines byte-identical, incl. their original em-dashes), one call at the site, one return-table member; +14/-7.
- rebuild/m4/workout/native-load-effects.cjs NEW 27b79bb8...a91c (299): FC03. foldNativeLoad, checkNativeLoad, issuanceFor, basisOf; native-load family (strict record checks, digest, coalesce, EFFECT_CONFLICT, revision retention, BASIS_REPAIR_REQUIRED, landing with causal seq proof).
- rebuild/m4/workout/engine-runtime.cjs b9a655ab...6350: FC04. MODULES +native-load, EXPOSED +2, forwarders, capability text.
- rebuild/m3/w6/host/engine-runtime-host.cjs 06bce58c...5976: FC05 literal require mirror. build-host.mjs 750f8513...9386: FC14 ALLOWED_ENGINE.
- rebuild/m3/w6/t2-stage.cjs 84b06b54...a482: FC06 explicit positional respond, trusted capability only.
- rebuild/m3/w6/local/local-client.mjs 95039dcf...004c: FC07 construction-time capability, respondNativeLoad (not in COMMANDS), respondFailure in the sync validator.
- rebuild/m3/w6/local/today-bindings.mjs a986310c...dabcb: FC08 ticket capability, decorated null registrar (fold before registration), createNativeLoadHost {project,check,respond,close}, lost-ack search.
- rebuild/m3/w7-preview/today/gym-model.mjs 58a4fb2a...a339: FB01 onClosed after acknowledged normal Close, contained.
- rebuild/m3/w7-preview/today/today-entry.mjs 783db9c9...450b: FA02 controller (Check next weight, offers, yes/Not now, failure copy), owned region + gym child mount, adoptBasis refresh from the immutable basis.
- .github/workflows/rebuild.yml 764a4347...5e27: FC13 FC12 step; FA03 appended to the Today enumeration.
- Tests: FC12/FA03 above; pinned updates below.

## Pinned updates (exact transforms, comment cites the spec line)
engine-equivalence.test.cjs:27 12->13 (d73291d4); journey.test.mjs:420-422 13 modules + 2 names (e4b29fdf); native-trend-context.test.cjs:453 (3d85838f); s3-companion-membership.test.cjs:186 (71fb7a6e); s3-supersede-defect-witnesses.test.cjs:152 (f4165de7).
NOT edited (spec :298 and inventory say ancestor/byte pins get declared child carriers in R, never edits): native-next-targets.test.cjs:41/:43 (already red at base), s3/h3-supersede-inherited-carriers, native-carriers-source.cjs:89, native-next-target-candidate/fixture.cjs:70, reach.cjs:8,12, m4/import/test/s3/run.mjs:135-136, load-write.test.cjs:7.

## New red pins OUTSIDE the inventory (not edited; need the successor's re-pin in R)
local-today-journey.test.mjs PAGE_PINS (today-entry.mjs); journey.test.mjs:414-417 sha pins of engine-runtime.cjs and the host runtime; food.test.mjs N1.18, machine-settings-ui.test.mjs S10 (x2), problem.test.mjs N2-08 (today-bindings.mjs + PAGE_PINS byte pins, DECISIONS:144).

## CI-only suites (name or load a protected module)
All rebuild/m4/workout/test/{h3,s3..s9}-supersede-* and s3-companion-* (expected red on writers.cjs/engine dir/runtime bytes: carriers owed), engine-history, h3-clean-init; rebuild/m4/spec/load-write*.test.cjs, workout-edit-model; rebuild/m4/import/test/{engine-provider,production-mapping,production-admission,prepare,reading-replay,browser-parity,s3/harness}; rebuild/m3/w6/test/{local-source-admission,local-source-commit,local-source-consumer,import-custody/engine-join,recovery-stage/source-import}; today/test/{adapter,catalogue,copy,package,setup,view,design(one cell)}; plus the S8 package step (b-package.cjs) and build tests (esbuild deps).

## Open items / STOPs
1. STOP FC09/FC10 (import family): historical-cut reconstruction in import is unproven and every import test loads migrate (spec H5: stop the lane SOURCE_FRONTIER_UNPROVEN). Today an import carrying native accepts refuses by the existing names (LOCAL_SOURCE_EFFECT_UNMAPPED / ACCEPTED_ENGINE_CONTEXT_UNMAPPED); FC08 refuses checks on imported generations. N14 not built.
2. STOP governor projection onto the card (step 6 last sentence): FC03 may call only the two exposed functions and N20 forbids exposing updateOpenerHold; no contract carries a hold-only projection. The evaluator replays the governor itself (idempotent over the legacy rirHist); the card's rirPlan does not see a native hold.
3. N01 needs the accepted repaired parent (D-EPP-2 engine-capture.cjs:69-70 is not in this base).
4. Rows not built: N06 (IDB kill/abort seams), N07 import orders, N08 after-yes and N16 durable compensation (FC01/FC08 support it, untested), N17, N20 bundle; FC14 build unverified locally (esbuild cannot resolve @noble/hashes here).
5. PRODUCER_REVISION is the placeholder 'earned/native-load/v1+unsealed-build'; the seal child must bind it.
6. Declared encodings (spec leaves them to the builder): spend_id = JSON ['native-load', lift, native authority spend or null, last reset-fork date or null, consumes]; root = JSON [start, lift, close]; consumes exclude already-spent roots and include the comparator when earnWalk received it; ex.native_load_authority records adopted/landed/compensated authority; adoption on a lift with wSets refuses VECTOR_ADOPTION_UNDEFINED; landing needs same-device seq order (single local era).
7. Disclosures: one git grep ran without its path list (PowerShell array bug) and printed repo-wide file NAMES only, no content; one 5-line SHA self-check ran without the lock; dependencies resolved read-only through existing junctions of earned-adm/earned-astra-47 via a scratch loader (no junction or install created).
Scratch: %TEMP%\nlr-build (guard.cjs, deps-loader.mjs, run.ps1, mutant.cjs, all TAP outputs). This report cannot carry its own hash.
