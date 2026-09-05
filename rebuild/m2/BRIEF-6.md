# EARNED — M2 MODULE 6 BRIEF (the engine extraction, sixth gated step: merge) — builder ASTRA

Date 2026-09-05. Authored and executed with module 6 under the owner's technical-planner/builder split.
Read AGENTS.md, NEXT.md's rebuild pointer, ROADMAP v1.6, RECON §§1(d), 2–6, BRIEF-5, the accepted module-5 report/scorecard and merged engine.
Copy the frozen engine, including its defects. Never refactor passes, normalize prose, repair rules or use the reference to fill candidate gaps.

## 0. Branch and base
Module 5 is ACCEPTED in SCORECARD-M2-5.md. Start at the CURRENT rebuild/t2-client-core tip carrying that acceptance and merge:
**f2f745847ced09524282e74c5b1d645a6fe30da0** (includes module-5 merge 6a5e53c). Record the actual base in the report.
Branch rebuild/m2-engine-6; one PR against rebuild/t2-client-core, containing BRIEF-6, BRIEF-7, module 6 and its tests/report. Do NOT merge.
Verify src/app.jsx equals fe516c1 (git blob f98671d823f0d8cd83e730cdd930afe5f5e7b628; v7.56.0, schema 60).
Verify the FINAL manifest and all three required RAW blobs (preimage-2026-08-15, synthetic-pending-debut, PRIVATE live) and golden stamps.
Clock 2026-09-03, TZ America/New_York. Follow AGENTS' ignored local preparation; never expose private input, output, paths, counts or hashes.
The unchanged oracle skips absent files: require every law ID, not merely exit 0. Keep public pins byte-identical; no new golden.

## 1. What module 6 is (RECON §4 step 6 — merge)
Add rebuild/engine/merge.cjs, factory (E,deps), registered LAST after migrate in index.cjs. Export every declaration in the copied range.
Copy src/app.jsx **13371–14211 verbatim plus mergeState's source interval 14212–14452**, retaining comments and FILE order.
The actual mergeState body ends at 14447; RECON's 241-line interval reaches the next declaration's boundary, including intervening comments.
Include MERGE_KEYED (14042), MERGE_ARR (14063), MERGE_MULTI (14080), MERGE_OBJ (14081), CACHE_RIDERS (13466), PLAN_POLICY_SCALARS (13960).
This range also includes correction/read/union/receipt helpers. Several were already copied into migrate.cjs or constants.cjs as closure.
Keep those accepted files byte-identical; copy the full requested range into its own factory and disclose the overlapping bindings/export shadowing.
E exports then select merge's copies while migrate retains its lexical copies; arbitrary caller mutation of an exposed constant is not one shared
binding across these factories. Name this packaging limit explicitly; default-value parity is not proof of shared mutation semantics.
Every mutable map/array belongs to its engine. Do not relocate already accepted bodies, alias constants across engines or add a reference fallback.
Reuse _skinSeriesKey, normalizePlan, reconcileTrendChain, reconcileEraTransitions, reconcileSightings, reconcileDebutQueue,
reconcileReadReceipts and reconcileSuggestionEffects through E. Audit actual free dependencies; disclose any further closure before claiming it covered.
Keep T.migrate the candidate closure and T.records absent. mergeState itself never calls migrate; test the host's migration/merge composition separately.

Preserve the load-bearing pass order (RECON §1(d), expanded to include the opening scalar/ARR/reclassification stages):
input guards → remote/local scalar spread → ARR → read choice → reclassLog union → trendChain → MULTI → feedDayOrder → OBJ/session law →
op-dedup → carve projection → KEYED → sugSorted → stamped fields/forks/renames/cache riders → insertions → sleep → plan → learned → exOrder →
planGen register → retirements → reconcileEraTransitions(normalizePlan) → reconcileSightings({mint:true}) → reconcileDebutQueue →
reconcileReadReceipts → reconcileSuggestionEffects → final _feedSorted. Do not move a repair into intermediate binary merges.
The call at **14441** requests the joint-sighting mint HERE. Module 5's boot _settleExit still calls reconcileSightings without mint:true.
Preserve returned input identity on junk-side exits and nested input mutations/aliasing; a new top-level object does not promise a deep-pure merge.

Injection: the only DIRECT ambient clock read in 13371–14452 is _stampCorr:13424; use the already ruled clock.nowISO() substitution.
_corrOf/_fileCorr/_sessionAtMs keep Date.parse and explicit-date arithmetic, including _fileCorr:13533's previous-record-time +1 ms.
There is no direct random, ID-provider or storage read in this range. Keep ids/drafts in the existing createEngine boundary for dependencies;
do not introduce ambient localStorage, random IDs, Date.now or zero-argument Date. Migrate's V51 drafts facade and ID/clock seams remain unchanged.
Witness the direct "a merge has no clock" claim (14268), and separately inspect the TRANSITIVE mint path: earnWalk → beatsNoise/typicalError
can use the existing default as-of clock. A transitive clock-dependent receipt/decision is a preserved red witness, not permission to change it.
Test ordinary/qualifying merges with recorded or rejecting dependency access; a swallowed exception that suppresses the mint cannot prove clock freedom.

RECON §6 risks are reproduced VERBATIM below (including the surrounding migration/writer risks relevant to the merge boundary):

1. The provisional golden is v59; the frozen tip is v60. Extracting against the wrong golden wastes the first day. Cut the FINAL golden first.
2. Implicit clock (158 sites + hour/dow/instants). Mechanical rewrite, but any site missed shows up only under a different MEASURED_TEST_NOW/TZ.
   Mitigation: after extraction, run the shim with `globalThis.Date` UNFROZEN and assert every engine call gives the same census as with the shim
   frozen (proves no residual `new Date()`); grep the extracted tree for `new Date()`/`Date.now`/`getHours`/`getDay` (allowlist: dates.cjs).
3. Hidden shared mutable state: SEED mutated at load and read by patches/isPristineSeed; `_freshSeq`; WeakMap memos keyed on state identity
   (a client that mutates its state object in place between reads will get stale energyBalanceTarget/energyDensity/forecast/nowModel). In the
   engine module: keep memos but expose `engine.invalidate(s)` or key on a version counter; never share one state object across ticks.
4. Patches that read the feed prose / receipt text (op-guards, title dedup, "VOLUME…via NAME", " EARNED$", "TOP OF WINDOW, PROVISIONAL") and
   emit dated prose — any rewording, punctuation or U+2212/-/— difference breaks the records DTO and the sighting derivation. Copy verbatim;
   never "clean up" strings; keep both minus spellings.
5. Seam/fork/rename machinery has THREE restatement sites that must agree byte-for-byte (_settleExit 12240–12250, mergeState fork union
   14334–14371, deriveInsertionSeams 2064) plus INSERTION_PAIRS / patchV51 / patchV60 interplay; forks keyed by (from|class) with prevN tie rules.
   Port as one unit with sync-laws.mjs as the gate.
6. localStorage inside patchV51 (draft-key scan): in node it is a caught ReferenceError → seam floor "2026-08-14"; the extracted module must
   reproduce the SAME outcome by making that scan an injected `drafts.dates()` defaulting to []. On a phone with live drafts the frozen app moves
   the seam — a behaviour the rebuild has to decide to keep or drop (it only matters for v<51 states).
7. Non-determinism in writers: `_freshId` (Math.random), `"vol"+mg+Date.now()`, `"rs"+id+Date.now()`, `new Date().toISOString()` stamps. Not
   censused, but the second gate will need injected `ids`/`clock` and the engine-test pins that assert on ids must be re-derived.
8. Locale: `toLocaleString()` in 14 prose sites — Node ICU vs iOS Safari can differ ("16,526"); prose is not censused except regime.why/cause
   (neither uses it). Replace with a fixed formatter in the copy only if the client later censuses those strings.
9. TZ/DST: everything is local-time arithmetic; a client on a different TZ than the golden legitimately reads different weekdays. The oracle
   pins TZ; the rebuild client should pass a clock in the athlete's zone and the engine must never touch UTC (`bump()` in patchV51 uses UTC
   deliberately — keep it).
10. Cross-module cycles: regime ↔ progressionTrend/currentRate, energyBalanceTarget → regime → progressionTrend, calorieTarget →
    activeAdjustment (today.cjs), autoPilot → structuralMovesThisWeek (volume.cjs) + stepTarget (energy.cjs), nowModel → genSession
    (progression.cjs), liftCall → recoveryIndex/bodyAlarm (sleep.cjs). Solved by the single `createEngine` closure; do not try to make modules
    acyclic in M2.
11. Size/coupling of migrate: ~2,000 lines of patches that reference SEED, INSERTION_PAIRS, RULED_ORDER, _bornValid, applyInsertionSeams,
    reconcile*, pinsUnfilled, exById, _hashId. Copy the block whole; the census on the live blob is the only proof that matters.
12. `records(state)` DTO: keep using legacy-records.cjs (T.records absent) so the DTO stays engine-independent; do not implement `records` in M2.

Annotations: risk 1 is historical; FINAL fe516c1 pins already exist. Risk 3's invalidate/version-counter proposal is NOT extraction authorization.
Risk 6's drafts.dates() proposal was superseded by the accepted length/key facade; keep that caught scan contract.
Risk 7 does not authorize weakening expected IDs, and risk 8 does not authorize a formatter change. Risk 9's explicit UTC historical arithmetic stays.
Risk 11's live warning does not waive public blobs or writer checks. Preserve the three restatement sites and immutable DTO, with tests rather than edits.

## 2. The gate for module 6 — cumulative with modules 1–5
Set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; set ENGINE_MAIN and ENGINE_OLD explicitly to the locally verified frozen bundles
(the suite's default main path is a known machine-path seam, SCORECARD-M2-5 row 8). Run separate fresh processes from the repository root:

```sh
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-6-frozen
node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-6-unfrozen
node rebuild/engine/test/migrate-full.cjs
node rebuild/engine/test/merge-laws.cjs
node rebuild/engine/test/merge-differential.cjs
node rebuild/engine/test/merge-source.cjs
```

(a) FULL port-oracle stays **10/10 GREEN** in BOTH Date modes on ALL THREE RAW blobs: pins/counts/whole required census, no skip or partial mode.
Retain migrate-full's explicit presence checks, native-Date loading/execution proof and exact post-migration return/input bytes in both modes.
Retain migrate-source, migrate-differential, census-partial (prior read/volume regression only), and defect-witnesses 1–5; do not weaken their assertions.

(b) tools/sync-laws.mjs is the actual merge law gate, invoked UNCHANGED through its existing PL_ENGINE import seam. Do not copy/edit law bodies.
The tracked merge-laws.cjs must run the frozen bundle AND the candidate adapter in fresh children, with the same full COMMITTED seed inventory.
Measured frozen baseline on fe516c1: **18 laws / 59 committed seeds; BROKEN-LAWS: none; zero capability skips**. Candidate must match this complete
law/seed inventory and the frozen superset-exemption result; reject --only, --explore, LIB, missing exports, shape drift or zero/skipped evidence.
Run candidate with the harness Date frozen and with genuinely native Date, using the same explicit injected clock; assert identity around loading/execution.
The adapter supplies only candidate __test and clock/IDs/default drafts. No frozen functions may fill candidate exports. The current law requirements
fit modules 1–6; no general writer extraction is necessary for this gate. Report the exact command, source hash and both final SYNC-LAWS lines.
The harness's SHAPE guard still reads frozen app.jsx and tests its own composed correction operations; it is NOT a candidate-source audit.
merge-source must independently prove candidate bodies, pass order, map ownership and the narrow rewrite. No unrelated source-text check becomes runtime proof.

(c) Tracked merge-differential compares exact JSON.stringify output AND post-call local/remote state to the pinned frozen bundle, including complete
receipt objects, punctuation/whitespace and array/key order. Use independently cloned synthetic inputs and record alias/return behavior separately.
Required cases: two-device disjoint/keyed unions in BOTH directions; replay the same batch twice; one older-schema side through migrate(remote), then merge
and final migrate (also raw merge where meaningful); one side with a filed/attested struck-set correction and matching receipt; qualifying mint at the
merge exit and a nonqualifying control; old boot still does not mint. Exercise chronological correction replay and the stamped-field/cache/fork boundary.
Compare each direction/grouping to the SAME frozen direction/grouping. Do not impose byte commutativity, idempotence or deep input purity that the frozen
app does not have; record a reproducible difference as a defect. The unchanged law gate owns its specific projections/exemptions; exact full state is separate.
Test both Date modes, nondefault injected dates, independent engine maps/providers and the direct/transitive clock distinction above. No matched unexpected
exception is a PASS. Use no private fixture in this synthetic runner; private full-port outputs remain verdict-only.

Then run the unchanged gate suite, selftest, and strict gate:

```sh
node rebuild/conform/run.cjs
node rebuild/conform/run.cjs --selftest
# Unset MEASURED_TEST_NOW before:
node scripts/check.mjs --strict
```

Require SUITE CONSISTENT, SELFTEST PASS and "All checks passed. Safe to ship." The suite's absent policy/progression families remain its declared RED-first
scope; it does not substitute for the candidate merge gate. The general writer/engine-surface second gate is specified in BRIEF-7, not claimed here.

## 3. Bite check (deliberate, documented, restored)
Change ONE copied merge behavior in merge.cjs, exercised by a committed synthetic sync-law seed or the required differential (prefer a replay/union or
mint-at-exit behavior). Execute the relevant CANDIDATE gate and show a failing verdict; the frozen baseline stays GREEN. Map the mutation to the affected
assertion/serialized receipt field before claiming coverage. The port oracle does not call merge, so a green port after a merge mutation is not evidence.
Quote the failing verdict line, identify the tested behavior and disclose any silent attempt as a coverage gap. Do not edit a law, fixture, golden or source.
Restore the exact saved file bytes in finally; record the restored public-code SHA256. Rerun sync-laws and merge differential, both full-port Date modes and
affected source/cumulative checks after restoration. No mutant or private artifact may be staged. A red witness of a PRESERVED frozen defect is not this bite.

## 4. Report — rebuild/m2/REPORT-M2-6-ASTRA.md
Use exactly nine sections, as in the accepted module-5 report:
(1) Module map: base SHA, line counts, EVERY copied function/constant range, reused/overlapping dependencies and all callable exports.
(2) Gate output tails verbatim: both full oracle runs/all public law verdicts (private verdicts ONLY), frozen/candidate sync-law lines and inventory,
merge-differential PASS, cumulative checks, the COMPLETE run.cjs SUMMARY block, selftest, strict tail. Distinguish canonical law equality from exact bytes.
(3) Clock/ID/storage rewrites: exact direct site/count; all transitive reads; no-clock witness limits; every mutable map/memo/provider and instance proof.
(4) Bite: exact mutation, exercised path, silent attempts if any, failing verdict, restoration SHA and restored GREEN results.
(5) SEAMS: law import/Date adapter, frozen SHAPE checks, source overlap, synthetic limits, unimplemented surface, retained defects; omissions count twice.
(6) RECON disagreements: stale golden, prohibited automatic invalidation, storage facade, direct versus transitive clock claim, full-state ordering/purity.
(7) What module 6 does NOT cover: general writers, complete second gate, on-device transport and post-extraction owner rulings; never claim M2 complete.
(8) Wall-clock time and token usage if exposed; distinguish build/review/waiting and do not invent an unavailable meter.
(9) DEFECT LOG: module 5's accepted last entry is D36, so start new entries at **D37**. Cite app.jsx line(s), concrete synthetic evidence and a runnable
witness for every new wrong rule/hidden assumption/bug found; reuse earlier IDs without duplication. DO NOT fix any entry. Module 7 continues after the
highest ACCEPTED module-6 ID, not an invented reserved range. Cowork verifies module 6 and reviews BRIEF-7 before module 7 starts.
At the END of the PR description include the two port-oracle tail lines, sync-laws line, merge-differential PASS line, run.cjs SUMMARY line and both brief paths.

## 5. Never
Edit src/, app.js, index.html, ledger/, scripts/, tools/, rebuild/conform/, rebuild/client/, rebuild/authority/ or rebuild/m3/ (especially seeded soak-stub/);
change a product rule, merge pass/correction order, catch, receipt wording, memo semantics, fixture, golden or law; hide a missing helper/skip with a stub;
add an M2 records DTO, ambient clock/storage/random read, reference fallback or unrelated module-7 writer; commit private data/generated reference bundles,
goldens, dependency/lockfile churn or tokens; delete data; push to main; merge the PR. Only BRIEF-7 is authored here; its product build waits for review.
