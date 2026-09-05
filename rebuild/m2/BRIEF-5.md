# EARNED — M2 MODULE 5 BRIEF (the engine extraction, fifth gated step: migration and reconciliation) — builder ASTRA

Date 2026-09-05. This is the NEXT brief, authored with module 4; module 5 is NOT built by the module-4 PR.
Cowork reviews this brief before work starts. Read `AGENTS.md`, `rebuild/ROADMAP.md`, `rebuild/m2/BRIEF-3.md`,
`rebuild/m2/RECON.md` (§1(a), §4, §5, §6), the accepted module-4 report/scorecard and merged `rebuild/engine/`.
Preserve the existing factory-local E table, per-instance seed/constants/memos, source-range comments and injected clock/IDs.
Copy the frozen engine, including its defects. Do not fix a rule or reword a receipt to satisfy a gate.

## 0. Branch and base
Start ONLY after Cowork's brief review and approved module-4 integration into `rebuild/t2-client-core`.
Record that integration commit in the report; do not start from the module-4 author's unapproved worktree or guess a future SHA.
Branch: `rebuild/m2-engine-5`. Open one PR against `rebuild/t2-client-core`. Do NOT merge.
Verify source `src/app.jsx` matches `fe516c1` (v7.56.0, SCHEMA_V 60) and that the FINAL manifest pins every required main golden to
`fe516c1 (v7.56.0, frozen main)`, clock 2026-09-03, TZ America/New_York. The manifest's stale PROVISIONAL sentence is not a new golden.
Follow AGENTS.md's local engine/private-fixture preparation with the integrator; inspect no private payload in chat or reports.
Required blobs are preimage-2026-08-15, synthetic-pending-debut AND private live: the oracle skips absent files, so check all three exist
and require their law IDs in both full-check runs. An exit 0 with a missing blob is NOT completion. Keep committed public pins unchanged.

## 1. What module 5 is (RECON §4, extraction order step 5 — migrate, patches and reconcilers)
Add `rebuild/engine/migrate.cjs`, copied from frozen `src/app.jsx` @ fe516c1, with the complete callable dependency closure:
- patchV4…patchV60, every declaration in SOURCE FILE ORDER, plus _hashId, _fileKnownCorr and PATCHES. Declaration order is nonnumeric;
  PATCHES itself remains the exact ascending 57-entry [4…60] table. Preserve filtering, replay order, mutation, catches and receipt bytes.
- reconcileLiftCaches, ensureLoadOnLadder, reconcileCorrectedLoads; reconcileReadReceipts, reconcileTrendChain, reconcileSuggestionEffects.
- reconcileSightings, _mintJointEarn, reconcileDebutQueue and required reconcileEraTransitions. The owner deferred _mintJointEarn from
  the module-1 READ side to modules 5/6 with reconcileSightings; it is INCLUDED here as a writer, never disguised as a reader.
- anchorDexa, _settleExit, migrate, isPristineSeed, recordCounts and dataLossGuard.
- Reuse already-copied dependencies through E. Copy missing helpers only when the listed functions actually require them, including
  the later-file read/sort/guard helpers (_readPick/_readRank9, _canonJ, _feedSorted, _sugSorted, _isFeedDerived and their closure).
  _mintJointEarn calls earnWalk (2304); include its exact implementation if absent so the export is callable, not a swallowed missing-function
  exception. List every such writer/helper and source range. Do not import the reference bundle or oracle as a product dependency.
- Preserve _settleExit's ordering and boot semantics: reconcileSightings(st) at 12258 does NOT request minting. The {mint:true} call is
  at mergeState's exit (14441), which belongs to module 6. Including the mint's closure does not authorize adding it to boot.
- In index.cjs, register require("./migrate.cjs") AFTER the existing factories. Its factory takes (E, deps) and returns the candidate
  migrate, PATCHES and every named patch/reconciler/guard/helper export required above. Pass drafts through createEngine's deps.
  The existing Object.assign(E, createModule(E, deps)) wiring must put those functions directly on E and its final __test table, retaining
  every prior export. In oracle-shim.cjs, keep module.exports = { __test: createEngine({ clock, ids, drafts: emptyFacade }).__test }
  (or rely on the equivalent empty default). T.migrate must be the candidate closure itself, never a wrapper invoking reference migration.
  Keep T.records absent: the unchanged oracle's legacy-records.cjs supplies the engine-independent records DTO.
- NOT module 5: mergeState or the general merge API, completeSession, runAdaptive, apply*/dismiss*/undo writers, UI/storage/sync/restore
  entry points, or the rest of module 7. A necessary helper is a disclosed closure addition, not permission to extract unrelated families.

Source anchors to verify per declaration: _mintJointEarn 2277–2318; reconcileSightings 2321–2335; reconcileDebutQueue 2362–2380;
reconcileEraTransitions 2381–2453; earnWalk 2466–2558; read/trend/suggestion reconcilers 10298/10370/10439; anchorDexa 10657–10672;
patch block 10675–11983; lift/load reconcilers 12001/12057/12099; _settleExit 12222–12262; migrate 12263–12311;
isPristineSeed 13233–13241; recordCounts 13289–13327; dataLossGuard 13328–13361. Do not copy adjacent cloud/React code.

Injection is narrowly defined:
- patchV51's storage scan (11784–11791) must never touch ambient localStorage. Extend createEngine's optional deps with a read-only
  per-engine `drafts` facade exposing `length` and `key(index)`; bind it factory-locally as `localStorage` so the frozen loop remains
  byte-identical. Default to an empty facade (length 0, key(index) returns null), including in the oracle. This reproduces the frozen
  Node scan's caught-missing-localStorage outcome. Test facades must preserve browser length/key behavior: a key string or null at each
  index, not a prefiltered date list. No getItem, values, storage writes or global installation.
  Preserve both key prefixes, suffix/regex checks, scan order and caught exceptions, including work completed before a scan throws.
  This intentionally uses a storage-shaped facade instead of RECON §6 item 6's proposed drafts.dates() API to preserve the exact loop;
  disclose the API seam. Synthetic tests must compare empty, matching/nonmatching keys, malformed suffixes and a throwing scan to the source.
- patchV51's current-day session check (11783) uses the existing clock-backed todayStart. Its bump helper (11782) constructs an EXPLICIT
  UTC date and advances UTC: preserve it exactly. Do not convert historical date arithmetic, Date.parse, or explicit-date weekday reads.
- The v1 hack3 stamp at 12299 becomes clock.nowISO(); audit every other newly copied zero-argument Date/Date.now/hour/day/random site
  and route actual ambient reads through the established clock/ids boundary. anchorDexa's _freshId must use the injected ID provider;
  disclose each exact substitution and test deterministic IDs. No new ambient clock capture at module evaluation.
- patchV60 reads THIS engine's SEED.insertions (11351), not a module-global import, hard-coded replacement or fixture. Keep SEED after
  its frozen weave, including the authored insertion map. All patch SEED reads and isPristineSeed bind the same per-instance object.
  Two engines must not share mutable seed, patch table, memo, ID sequence or draft provider state; caller-injected shared objects are the
  caller's responsibility. Prove independent instances with synthetic inputs; preserve behavior within one instance.

RECON §6 items 1, 3 and 11 are reproduced VERBATIM below:

1. The provisional golden is v59; the frozen tip is v60. Extracting against the wrong golden wastes the first day. Cut the FINAL golden first.

3. Hidden shared mutable state: SEED mutated at load and read by patches/isPristineSeed; `_freshSeq`; WeakMap memos keyed on state identity
   (a client that mutates its state object in place between reads will get stale energyBalanceTarget/energyDensity/forecast/nowModel). In the
   engine module: keep memos but expose `engine.invalidate(s)` or key on a version counter; never share one state object across ticks.

11. Size/coupling of migrate: ~2,000 lines of patches that reference SEED, INSERTION_PAIRS, RULED_ORDER, _bornValid, applyInsertionSeams,
    reconcile*, pinsUnfilled, exById, _hashId. Copy the block whole; the census on the live blob is the only proof that matters.

Annotations: item 1 is historical; the FINAL fe516c1 goldens already exist and must be verified, not recut to excuse a mismatch.
Item 3 identifies a real preserved behavior; its invalidate/version-counter proposal is NOT authorization to change the copied engine.
Keep memos per instance and report stale-cache witnesses; do not add automatic invalidation to migrate. Item 11 does not waive the two
public blobs, counts/records laws, source fidelity, determinism or the additional uncensused checks required below.

## 2. The gate for module 5 (RECON §4 step 5, §5) — cumulative with modules 1–4
The real FULL port-oracle check is now mandatory. No partial mode exists. No identity migrate, pre-migrated golden input, omitted group,
reference migration on the candidate table, or translated expected DTO can stand in for it. Supply RAW fixtures to the candidate migrate.
With MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York set, run these in separate fresh Node processes from the repository root:

```sh
node --import ./tools/_fixed-now.mjs rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-5-frozen
node rebuild/conform/oracle/port-oracle.cjs check rebuild/engine/oracle-shim.cjs m2-5-unfrozen
```

The --import preload runs before the oracle and candidate module evaluation. The existing oracle-shim constructs noon with explicit
year/month/day/hour arguments; _fixed-now leaves explicit Date arguments unchanged, so both modes inject the same local-noon clock.
Check Date identity before and after candidate loading/execution; matching clock construction alone cannot prove no ambient engine reads.
These are module-5 acceptance requirements, not full-check results already executed while authoring this brief.

Both must exit 0 with every required law GREEN for all THREE blobs against golden main: manifest/pins, the counts law (including filed
strike corrections and their receipts), and the WHOLE required census. This includes counts/rawCounts, migration.recordsChangedByMigrate,
records DTO, lifts, progression, energy and today with exact required prose. Verify __test.migrate exists before calling the oracle.
Prove globalThis.Date remains native in the second process and that both candidate outputs match the same whole required census; the clock
is still injected in both. A HARNESS_ERROR, missing migrate or a private-file omission is no longer an expected partial result.
A supplemental engine-owned full-census runner may add explicit presence/Date checks and privacy-safe verdicts, but it cannot replace or
modify port-oracle.cjs. Retain and run the cumulative modules 1–4 parity/source checks, including the prior four-group partial census as
regression evidence only; it no longer establishes migration correctness.

Add synthetic differential checks against the exact frozen source for uncensused paths: every migration exit (null/fresh, v1/v2 including
the hack3 stamp, v3–59, same schema, future schema), repeated migration, input mutation/identity, patchV51 draft/clock cases, patchV60
per-instance SEED.insertions, anchorDexa, isPristineSeed and dataLossGuard. Test guards with lost records and receipt/correction cases.
Include a rename effective-date witness: the frozen engine uses renames[].from, while legacy-records.cjs:11 projects .at; changing .from
can change historical nameAt without changing that DTO. The full-state comparison must detect it. Do not fix or expand the frozen oracle.
Expected behavior comes from execution, not comments: for example migrate heals containers BEFORE its newer-schema early return.
Compare all post-call bytes as well as returns; preserve any reference defect and file it. Test the callable mint closure separately with
synthetic qualifying/nonqualifying sightings; prove boot still does not request mint. Audit exact copied bodies, free dependencies, memo
ownership and every ambient clock site. No golden helpers may fill a missing candidate helper.

Then, with the pinned environment above:
- `node rebuild/conform/run.cjs` → SUITE CONSISTENT, with its unchanged required families.
- `node rebuild/conform/run.cjs --selftest` → SELFTEST PASS.
- Unset MEASURED_TEST_NOW, then `node scripts/check.mjs --strict` → “Safe to ship.” The frozen gate has its own clock.
Private fixture/golden preparation stays local and ignored, per AGENTS.md. Reports contain private VERDICT LINES ONLY: no values,
counts, paths, state hashes, error payloads or migrated snapshots. Report missing/private setup failures honestly; never silently substitute
a public blob. Existing frozen strict checks do not prove the extracted merge/writers: their re-pointed second gate remains for modules 6–7.

## 3. Bite check (deliberate, documented, restored)
**Receipt prose must match.** For every exercised string, one changed word, punctuation mark, space or embedded value is a mismatch;
do not normalize, trim or reword it. The whole required census includes legacy-records.cjs's records.feed projection: every feed row's
d/t/how/op becomes date/text/how/op, with rows sorted by date/text/op. Thus emitted feed text and how strings compare exactly, but original
feed array order and extra receipt fields are not fully represented. records.volumeReceipts additionally retains the raw VOLUME title
and its parsed sign/magnitude/muscle/via/set-count fields. records.queue also compares gate/rule/text strings. This is a semantic DTO,
not proof that the entire migrated state is identical.
Add a separate exact full-post-migration-state differential against the frozen engine on all three raw blobs in both Date modes,
including complete receipt objects and array order, with no DTO projection or string normalization; private results remain verdict-only.
Use synthetic witnesses for relevant receipt paths absent from those blobs. This supplement catches changes the required DTO omits.

Change ONE copied migration/reconciler behavior exercised by the LIVE blob, in the extracted file only, and show the FULL oracle go RED
on the live blob. Prefer a records DTO/receipt change or removed required record so this proves the newly added migration path is covered.
Map a proposed live prose mutation to its final required records.feed text/how or volumeReceipts.raw field before claiming a prose bite.
If no live prose branch is exercised/mapped, disclose that gap and use a distinct exercised required-census mutation for the live RED;
an uncensused receipt change caught only by the full-state supplement is additional evidence, not a successful FULL-oracle bite.
Do not change the frozen source, fixture, golden or checker. Capture only the live verdict; public path evidence may explain the mutation.
If the first change is silent, disclose it as a coverage gap, restore it and choose an exercised change. Restore exact file bytes, record
the restored public-code SHA, and rerun BOTH full Date modes plus the affected cumulative checks. No mutant may be committed.

## 4. Report — `rebuild/m2/REPORT-M2-5-ASTRA.md`
Use exactly these nine report sections, with executed evidence and no invented results:
(1) Module map: line counts, every copied function's app.jsx source range, every closure addition and reused dependency.
(2) Gate output tails verbatim: both full oracle runs and all required public law verdicts; private verdict lines only; cumulative modules
1–4 checks; run.cjs SUMMARY; selftest; strict tail. Distinguish synthetic differential checks from the frozen and re-pointed gate coverage.
(3) Clock/ID/storage rewrites: count and exact sites, patchV51 injected contract/default, patchV60 per-instance seed proof, every memo/WeakMap.
(4) Bite: mutation, exercised path, any silent attempt, RED verdict, byte-for-byte restoration SHA and restored GREEN runs.
(5) SEAMS: everything shaped by the oracle rather than the product, required helpers drawn from later modules, retained defects and test gaps.
(6) RECON disagreements: state them without editing RECON, including stale golden text and the prohibited cache-invalidation recommendation.
(7) What module 5 does NOT cover: missing merge/general writers, uncensused behavior and remaining second-gate work; never claim M2 complete.
(8) Wall-clock time and, if exposed, token usage; distinguish build work from waiting/review.
(9) DEFECT LOG: continue immediately after the highest D-number in the ACCEPTED module-4 report. D23–D27 belong to module 3; module 4
starts D28, so do NOT restart D28 here or reserve a range before its report is final. Cite app.jsx line, concrete evidence and a reproducible
synthetic witness for every wrong rule, hidden assumption, derivable constant or bug found. Cross-reference existing entries without
renumbering or duplication. DO NOT fix any entry: each becomes a candidate red-first law for the post-extraction audit and owner ruling.
Same honesty bar as T3: the owner's scorecard counts omitted seams at double weight. One changed required word fails fidelity by design.

## 5. Never
Edit `src/`, `app.js`, `index.html`, `ledger/`, `scripts/`, `tools/`, `rebuild/conform/`, `rebuild/client/` or `rebuild/authority/`;
change a product rule, patch order, catch, receipt wording or memo semantics; hide a missing helper with a stub; add an M2 records DTO;
commit private data, generated engine bundles, new goldens or dependency/lockfile churn; print or handle a token; delete anything; push to main.
Only this brief is authored during module 4. Module 5 code waits for Cowork review and the approved module-4 base.
