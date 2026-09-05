# EARNED — M2 MODULE 7 BRIEF (the engine extraction, seventh gated step: writers and the second gate) — builder ASTRA

Date 2026-09-05. This is the NEXT brief, authored with module 6; module 7 is NOT built by the module-6 PR.
Cowork reviews this brief before work starts. Read `AGENTS.md`, `NEXT.md`, `rebuild/ROADMAP.md` v1.6 or its accepted successor,
`rebuild/m2/RECON.md` (§4, §5, §6), BRIEF-5/BRIEF-6, the ACCEPTED module-6 report/scorecard and merged `rebuild/engine/`.
Preserve factory-local E, per-instance seed/constants/memos, source-range comments and injected clock/IDs/drafts.
Copy the frozen engine, including its defects. This is extraction, not the later defect-law and owner-ruling pass.

## 0. Branch and base
Start ONLY after Cowork's brief review and approved module-6 integration into `rebuild/t2-client-core`.
Record that integration commit; do not start from module 6's unapproved author worktree or invent its future merge SHA.
Branch: `rebuild/m2-engine-7`. Open one PR against `rebuild/t2-client-core`. Do NOT merge.
Verify `src/app.jsx` is frozen `fe516c1` (v7.56.0, SCHEMA_V 60), and verify the second-gate source files and committed baseline
against their accepted pins before generating adapters. The files inspected while authoring this brief match fe516c1.
Verify the FINAL manifest's main goldens, clock 2026-09-03 and TZ America/New_York. Its stale PROVISIONAL sentence is historical.
Follow AGENTS.md's local engine/private-fixture regeneration with the integrator; keep committed public goldens/manifest unchanged.
Require preimage-2026-08-15, synthetic-pending-debut AND private live in both full oracle runs; absent-file skipping is not a pass.
Private payloads remain local and ignored. Reports contain private VERDICT LINES ONLY, never values, counts, paths or hashes.

## 1. What module 7 is (RECON §4, extraction order step 7 — writers and their complete callable closure)
Add `rebuild/engine/writers.cjs`, a factory `(E, deps)` registered after the accepted factories. Reuse every already-extracted
declaration through E; retain the complete existing table and its final __test exports. Do not replace a copied helper with a second
implementation. Necessary additional pure helpers may live in an explicitly mapped supporting factory, registered before writers;
E forwarding resolves cycles. An existing factory may gain missing exports/bindings, but unrelated copied bodies remain unchanged.

Copy these named roots from frozen src/app.jsx, in SOURCE FILE ORDER within their extraction units:
- sweepLadders 1234–1256; takeProposedDebut 2341–2354; completeSession 2559–2777; applyRead 3672–3702.
- volumePush 9022–9139; sweepVolume 9141–9223; sweepStalls 9224–9237; sweepLab 9256–9303; runAdaptive 9306–9793.
- _stampPlan 9875–9887; applyProposal 9888–10037; applySuggestion 10040–10057; noteSuggestion 10061–10069;
  dismissSuggestion 10070–10078; applyAgentProposal 10083–10131; dismissAgentProposal 10132–10143;
  dismissProposal 10149–10177; lastUndoable 10189–10221; undoAdjustment 10222–10264;
  apAutoHandledFor 10269–10271; undoRead 10274–10286.
- Include the session/plan dependencies needed by those roots: real earnWalk and the completeSession → queue/load/vector/receipt path,
  proposalEffect/proposalDial, structural selection, plan stamping, read replay and correction reconciliation. Reuse accepted copies,
  including module 5's callable mint and module 6's real merge exit; do not add minting to boot or change writer call order.
- Before copying, inventory every dynamic function/constant consumed by tools/engine-test.jsx, closure-sf1.mjs, closure-sf2.mjs,
  sync-laws.mjs and _engine-surface.jsx, including destructured aliases and computed lookups. Every runtime engine call must resolve
  to the candidate. Complete missing non-React closure, including pure lab/narration helpers and the actual labStatusList roster.
  The surface explicitly calls labStatusList at tools/_engine-surface.jsx:49; an absent helper caught as {err} is not coverage.
- The executable suite also calls pure draft/preference helpers: sessionFromDraft 1602–1632 when required by the closure;
  mergeSessionDrafts 19655–19693, phaseAfterSet 19715, backLift 19725–19733, gymEntries 19735–19760, REST_CUT_S/restCut 19767–19768,
  resumePhase 19848–19867, and UI_KEY/applyDisc/readDisc 15180/15186–15190. Copy needed declarations exactly, disclose this expansion,
  and keep their plain-object inputs/outputs. It does not authorize React components or browser storage accessors.
- Explicit additional roots required by engine-test, despite RECON's exclusion list: askContext 12538–12582 is a string builder over
  supplied state/docs, with no fetch or storage call; writeDaily 21012–21044 returns the copied day-row/fix-window/receipt state;
  captureAsk 21045–21060 is the scale/day-ask reader. Include these three exact declarations and their mechanical dependency closure.
  askContext directly uses dayWeather, cutRateBand, apModeOf, calorieFloor, typicalError, trialTpl, sleepInfo, currentRate, observedTDEE,
  energyBalanceTarget, energyAvailability, bfEst, EA_SPARING, proteinTarget, stepTarget, sleepAnchor, dietExit, exerciseSelection,
  volumeImbalance, mgLabel, LEDGER_DICT, DEFICIT_CEILING, dossierText, isoOf, exActive and liftCall; its seven-day Date.now() lookup must
  use clock.nowMs(). Its docs are arguments, never permission to fetch them. Reuse existing copies; copy absent read helpers/constants
  exactly. writeDaily uses isoOf/todayStart/DAY/proteinHit/proteinTarget; captureAsk uses isoOf/todayStart/DAY/readWindow/owedLedger/
  fmtShort. These are plain-state functions, not authorization for ask-network handlers, capture UI, persistence or analyst services.
  Inventory any further effectful dependency as a boundary conflict before copying it; this does not authorize additional feature families.
- The sweepLab arm must execute its actual labGroups/observedTDEE/currentRate/weekReview closure. RECON's suggested lab stub conflicts
  with the complete second gate and is NOT permitted. Report every added dependency and cache, including dependencies hidden by catches.

Inventory conflicts before broadening further. A pure helper named near UI may be required; a function performing browser storage,
network, mount/effect or DOM work is not silently an engine helper. Keep loadState/save/restore, findGymDraft's storage scan, React,
service workers, analytics and the legacy transport outside the product engine. The one test-only transport carrier is specified below.
Keep T.records absent; the unchanged oracle owns its legacy-records DTO. No reference bundle, checker or fixture is a product dependency.

Injection is narrowly defined:
- Preserve all explicit-date arithmetic. Replace actual ambient `new Date().toISOString()` with `clock.nowISO()` and `Date.now()` with
  `clock.nowMs()`, including completeSession's record.at and legacy `"vol" + mg + Date.now()` / `"rs" + id + Date.now()` identifiers.
  Keep their original concatenation/collision behavior; changing them to a different unique-ID algorithm would fix a frozen rule.
- sweepVolume's default weekday at 9141 and sweepLab's at 9256 become the equivalent weekday of `mk(clock.today())`; the Monday
  calculation starting with `new Date()` at 9198 starts with that explicit local calendar date. Preserve explicit caller-supplied dow.
  Audit all new closure sites, not only these anchors: hour/day reads, stamps, random numbers, default arguments and initializers.
- Reuse the accepted `_freshId` → `ids.fresh(prefix)` boundary. New IDs/stamps must retain identity, ordering and receipt relationships;
  inject a deterministic provider for tests and independent provider state per engine. Do not alter literal ID/prose pins to get GREEN.
- Preserve the optional, local, read-only `drafts.length/key(i)` facade and empty per-engine default from module 5. No new ambient
  localStorage access. Two engines must not share seed, mutable constants, caches, patch tables or implicit ID/provider state.
- Existing memo staleness is preserved. Do not add invalidation, an automatic version bump or a fresh engine per call to repair it.
  Test warm/cold behavior against the source and record defects. Retain source catch behavior and prove required positive branches ran.

## 2. The gate for module 7 (RECON §4 step 7, §5) — both gates, cumulative with modules 1–6
The census does not exercise the writer surface. BOTH the unchanged full oracle and the re-pointed second gate are mandatory.
Implement engine-owned test runners/adapters under `rebuild/engine/test/`; generated bundles/logs go in ignored scratch.
Do not edit tools/, scripts/, src/, conform/, fixtures, assertions, expected literals, baseline bytes or skip conditions.

The exact second-gate adapter strategy:
1. Implement `test/second-gate.mjs --reference` and `--candidate`. Build the existing tools/engine-test.jsx and _engine-surface.jsx
   with the existing esbuild dependency, bundle/platform node/JSX automatic, repository-root cwd and original tools resolve directory.
   For the candidate only, redirect the exact `../src/app.jsx` engine import to `test/second-gate-adapter.mjs` through an esbuild
   onResolve rule or a hash-checked import-only generated copy. All closure imports, assertions and fixture paths stay original.
   Check the intended replacement count and reject unexpected imports. No evaluator may fall back to src/app.jsx or a frozen bundle
   for a missing candidate engine function. Keep a manifest of harness hashes, redirects, dependency inventory and executed counts.
2. The adapter exports `__test` from one real createEngine instance for the process, plus only the disclosed transport carrier below.
   Import the unchanged tools/_fixed-now.mjs before candidate evaluation. Run this gate with MEASURED_TEST_NOW=2026-07-29 and
   TZ=America/New_York, separately from the September census. The harness's fixtures and committed surface baseline have this July anchor.
   Clock methods in THIS TEST ADAPTER read the harness's current Date lazily: local today/hour/dow, nowISO and nowMs. This is required
   because closure-sf2.mjs:2263–2269 temporarily replaces Date for its declared 2026-08-19T23:00:00Z pins. Capturing noon once would
   ignore those inputs. This harness bridge is not the native-Date proof; the product still reads only its injected clock.
3. Reproduce frozen ID formatting in the test provider: `(prefix || "") + clock.nowMs().toString(36) + (sequence++).toString(36)
   + random().toString(36).slice(2,6)`, with per-instance sequence and a recorded deterministic random stream. Use that same stream at
   the frozen reference's Math.random boundary in its isolated process. Do not rewrite IDs, drop fields, normalize receipt strings,
   round values or change pins. If a pin fails, first reproduce its reference result with the identical inputs/clock/random stream;
   fix an extraction/adapter error, or disclose an actual frozen conflict for review. A copied defect is never permission to re-pin.
4. Run the complete original engine-test entrypoint, including BOTH closure-sf1 and closure-sf2 and awaited runClosureSF2Sync.
   Parse the LAST `FINAL108: N passed, M failed`, require M=0 and process exit 0, and require the same N as the freshly executed
   unchanged reference. Neither RECON's approximate 2,600 nor scripts/test.mjs's stale 1,750 floor is the acceptance count.
   Run `node tools/vacuity-scan.mjs tools/engine-test.jsx --gate` unchanged. Missing names, an early section exit, a skipped closure,
   a caught missing-function error or a stub returning a plausible empty object cannot establish completion.
5. For sync-laws, use its EXISTING PL_ENGINE seam (tools/sync-laws.mjs:37), pointing at the adapter's real named __test export.
   Execute unchanged `node tools/sync-laws.mjs` in a fresh process with PL_LAWS_LIB unset and no --only/--explore/--mutations.
   Require all committed seeds, the measured reference law/seed counts, `BROKEN-LAWS: none`, zero violations/shape drift AND zero
   `SKIPPED (capability)` lines. PL_ENGINE deliberately allows missing-capability skips; exit 0 alone is insufficient.
   --explore is optional additional evidence. Its non-blocking exit and --mutations' frozen-source mutation builds are not candidate gates.
6. Run the entire unchanged _engine-surface roster on both committed snapshots. Capture stdout alone and byte-compare it with
   tools/engine-baseline.json exactly as tools/engine-diff.mjs does: no parsing/reserializing, whitespace changes or error suppression.
   Require an unchanged-reference GREEN first and candidate GREEN afterward. The roster includes runAdaptive proposals/feedHead and
   labRoster as well as readers. Do not call engine-diff --write or regenerate the baseline to bless a mismatch.
7. Many engine-test/closure assertions and sync-laws SHAPE guards read frozen src/app.jsx, index.html, sw.js or tool source. Leave
   those reads unchanged, but classify their counts as frozen-source assertions, not candidate execution. Publish the runtime export
   inventory and a separate declaration-by-declaration candidate fidelity/free-dependency audit for their extracted counterparts.
   The report must distinguish candidate-runtime assertions, frozen-source/asset assertions and the three transport-carrier assertions.

Test-only legacy transport carrier — a proposed boundary for Cowork's review of this brief:
runClosureSF2Sync requires ghSync and asserts THREE upload-body results; missing ghSync is explicitly FAIL. Keep product transport
excluded. In an engine-owned test-only file, copy exact pinned ghSync 12344–12390, snapshotMaybe 12746–12760 and their minimal literal
TOKEN_KEY/LEDGER_DICT dependencies at 12341–12342. Inventory/hash these declarations. Bind EVERY engine dependency to candidate E
(mergeState, migrate, normalizePlan, dataLossGuard, dates); no reference function provides their results. Supply only the closure's
mocked I/O through local injected delegates, with a hard-failing test tripwire for an unexpected/unmocked network attempt and isolated
fake storage. Track pending mocked requests, including snapshotMaybe's deliberately unawaited call; keep the tripwire active through
their completion and check it outside the carrier so a frozen catch cannot swallow the failure. ghSync resolving alone is insufficient.
Never read real credentials or issue a request to a real endpoint. Preserve carrier function bodies and asynchronous
snapshot behavior; run original assertions unchanged. Disclose these as tests of candidate engine behavior inside a frozen legacy
transport carrier, not extracted ghSync/storage/transport coverage. Do not export the carrier from product index.cjs or oracle-shim.cjs.

Run from the repository root; implement the two second-gate runner options above with explicit child environments, so July and
September clocks cannot leak between runs. These are required FUTURE commands, not results already executed in module 6:

```sh
node rebuild/engine/test/second-gate.mjs --reference
node rebuild/engine/test/second-gate.mjs --candidate
```

Each mode must run engine-test, vacuity, sync-laws and surface comparison with the contracts above, log the exact underlying commands
and child environment, propagate failures, and print separate verdicts. Reference --reference cannot import a candidate function.
Then set MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York and the locally prepared ENGINE_MAIN/ENGINE_OLD for the cumulative gates:

```sh
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-7-frozen
node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-7-unfrozen
node rebuild/engine/test/migrate-full.cjs
node rebuild/engine/test/migrate-differential.cjs
node rebuild/engine/test/merge-differential.cjs
node rebuild/engine/test/writers-differential.cjs
node rebuild/conform/run.cjs
node rebuild/conform/run.cjs --selftest
```

Retain and run every additional source/parity/defect check required by the accepted modules 1–6 reports, including prior partial
census as regression evidence only. Check all required public law IDs and privacy-safe live verdicts in BOTH full oracle modes.
The migration full-state supplement must still compare all three raw blobs with complete receipts/order in both Date modes.
Merge coverage remains the accepted module-6 whole-state differential plus the now-complete sync-laws runtime gate.
Assert Date identity before/after candidate loading and execution; the second full-oracle process must retain native Date.

Implement writers-differential.cjs against exact pinned source, using synthetic inputs and independent deterministic clock/ID/draft
providers. Compare returns, errors, caller mutation/identity, EVERY post-state field, array order and exact receipt/queue/proposal prose.
Exercise meaningful positive/refusal/repeat cases: completeSession debut/off-ladder loads, vectors and opener/terminal RIR; applyRead/
undoRead; runAdaptive repeat/structural budgets; ladders, volume and stall sweeps; apply/dismiss/note suggestion decisions and replay;
proposal/agent apply/refusal; phase/plan stamps; adjustment undo and no-undo. Test explicit dates versus default now, warm caches,
two-engine isolation, nondefault clocks and weekday/hour boundaries. Prove native-Date independence with an injected clock that does
not read ambient Date and a trap for ambient now/random/storage; retain explicit-date constructors. The harness bridge above cannot
substitute for this proof. Source-only helpers in expected results may not fill a candidate closure.

Finally unset MEASURED_TEST_NOW, PL_ENGINE and PL_LAWS_LIB and run `node scripts/check.mjs --strict` → “Safe to ship.”
That unchanged strict gate checks the frozen app; it does not replace the re-pointed second gate. Do not claim new-client DOM coverage.

## 3. Bite check (deliberate, documented, restored)
Prove the newly re-pointed writer gate can fail on THIS candidate. First identify an actually exercised completeSession/apply/sweep/
runAdaptive path and its specific runtime assertion or surface output. Change ONE copied writer behavior in the extracted file only:
for example a required emitted receipt word, queued newWSets field or applied set/load effect reached by the selected fixture.
Run the relevant candidate second gate and require RED from that behavior, not an import/build failure, source-string guard or missing
function. If possible choose a runAdaptive surface path and show both an assertion failure and the committed baseline byte mismatch;
one genuine candidate writer RED is mandatory, a dual catch is additional evidence. The census may remain GREEN: disclose that limit.
If the first mutation is silent, record the coverage gap, restore it and choose an exercised mutation; never call silence sensitivity.
Do not alter source tests, expected pins, fixtures, goldens, the carrier, reference bundle or adapter to manufacture the bite.
Restore exact candidate file bytes in finally, record the restored public-code SHA, verify the source map, and rerun the COMPLETE
candidate second gate, both full oracle modes, affected differentials and the required cumulative/strict gates. Commit no mutant.

## 4. Report — `rebuild/m2/REPORT-M2-7-ASTRA.md`
Use exactly these nine report sections, with executed evidence and no invented results:
(1) Module map: physical/source counts, every app.jsx declaration range, reused E dependencies, necessary pure closure additions,
    factory/memo ownership; separate test-only carrier source map and exact harness import substitutions.
(2) Gate output tails verbatim: both full oracle modes with all public law verdicts/private verdict lines only; complete reference and
    candidate engine-test FINAL108 counts and assertion classifications; zero-skip sync law/seed totals, BROKEN-LAWS and shape verdict;
    reference/candidate exact surface comparison; vacuity; cumulative source/full-state/merge/writer checks; SUITE CONSISTENT,
    SELFTEST PASS and strict tail. Distinguish frozen-source inspection and mocked legacy transport from candidate engine execution.
(3) Clock/ID/storage rewrites: exact sites/counts, preserved legacy ID concatenations, provider contracts/isolation, lazy second-gate
    clock bridge and scoped overrides, native-Date trap results, caches and retained stale results. Name every test-only I/O binding.
(4) Bite: one candidate writer mutation, exercised path, any silent attempt, actual RED signature, restored public SHA and full GREEN.
(5) SEAMS: oracle/harness-shaped APIs, exact ID boundary, pure lab/draft/preference expansion, source/asset assertions still inspecting
    the frozen app, three test-only ghSync assertions, caught-error parity, and anything else that limits what the green gates prove.
(6) RECON disagreements: stale golden/count estimates; prohibit its sweepLab stub, blind ID/clock re-pinning and cache-invalidation
    suggestion. Explicit-date UTC bump, local-time semantics and frozen locale/prose behavior remain copied, not modernized.
(7) What module 7 does NOT cover: actual React/new-client UI, persistence/transport/cloud/restore integration and the post-extraction
    defect audit/owner rulings. Both extraction gates GREEN may close the extraction step after review; it does not fix D1 onward or
    establish end-to-end beta readiness. Name any unresolved scope/gate conflict and keep completion open if a required gate is absent.
(8) Wall-clock time and token usage if exposed; distinguish active build/verification from waiting and review, never invent totals.
(9) DEFECT LOG: continue after the highest D-number in the ACCEPTED module-6 report. Module 5 ends at D36; module 6 begins at D37,
    but this brief does NOT reserve module 7's start. Verify accepted numbering at execution. For each new wrong rule, hidden assumption,
    derivable value or bug, give app.jsx line, concrete reference-and-candidate evidence and reproducible synthetic witness. Cross-reference
    prior defects without duplicating numbers. Preserve every defect; its later red-first law and owner ruling are separate work.
Same honesty bar as previous modules: the owner's scorecard counts omitted seams at double weight. A changed required word is a mismatch.

## 5. Never
Build module 7 as part of module 6; edit src/, app.js, index.html, ledger/, scripts/, tools/, rebuild/conform/, client/, authority/ or M3;
touch the seeded soak origin/data; modify an assertion, baseline, expected ID, fixture or golden to get GREEN; add stubs/fallbacks,
omit failing sections or accept capability skips; export a frozen/reference function as candidate; repair a copied defect or memo;
change source receipt wording, writer order or identity semantics; add product network/storage/React dependencies; use real I/O in the
test-only transport carrier; log or handle a real credential; delete data; commit private files, bundles, new goldens or dependency/lockfile
churn; merge your own PR or push to main. Only this brief is authored in module 6; module 7 waits for review and approved integration.
