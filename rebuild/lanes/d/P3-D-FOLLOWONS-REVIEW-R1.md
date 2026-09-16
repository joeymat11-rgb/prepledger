# P3-D-FOLLOWONS - independent review r1 (Opus high)

**VERDICT: ACCEPT.** Subject f0aff6f on `rebuild/d-p3-followons`, reviewed in my own detached worktree at that
sha, my own junctions, my own probes under `.tmp/rv-graph` and `%TEMP%\p3f-out`. Everything SYNTHETIC: no ledger,
`rebuild/conform/private`, `src/history.js` or `EarnedPort` path opened, listed or named. I re-ran every suite,
walked the bundler graph myself, and applied three mutants of my own.

## What I verified rather than took

**The module graph, walked by me** - my own scratch entry (the shipped page entry plus
`createLocalSourceController`) through `w6/build-browser.mjs`, read back through `today/build.mjs`'s own
`assertBundleInputs`:

    page alone      121 modules  1 668 330 B  law PASS
    page+admission  133 modules  1 927 904 B  law REFUSES
    TRIPPED  ["engine/migrate.cjs","engine/merge.cjs","m4/import/*"], the lane being exactly the six
      browser-replay daily-history engine-provider local-source-order local-source-profile replay-core

`engine/seed.cjs`, `engine/index.cjs`, `engine/test/**`, `rebuild/conform/**` and `m4/workout/engine-runtime.cjs`
are ABSENT. **133 is the brief's row E exactly** (:475). My byte figures run 105-155 B above the author's because
my scratch entry sits at a different path; the module counts are identical. `node today/build.mjs` still prints
**A1 ... PASS: 3 assets; 121 pinned inputs** - nothing from this ticket entered the page graph.

**The swap is behaviour-neutral where it matters.** `admission-swap.test.mjs` reads the product file, reverts the
one line in memory, absolutises every other specifier so the pre-swap copy shares every other module instance,
and deep-equals the whole qualified view - basis and its five digests, families, state, calculation,
`workout_facts`, `retained`, the review screen - in EDT and EST, and again over a device holding a native
completed workout, the one branch that calls `Runtime`. It pins the session log and the F4/F3 verdicts first.

**The registry surface is the whole surface, and the binding weakens no claimed guard.**
`source-admission.mjs:48` requires exactly `typeof producerRegistry?.qualify === 'function'` and `:90` calls only
`qualify`; `Profile.createProducerRegistry` itself returns `Object.freeze({qualify})`, so the new frozen wrapper
narrows nothing, and it fails as `new Error(code); error.code = code` - the shape `replay-core.cjs:14` throws.
Unpinned, the row is built from the digest presented, so the `material_digest` clause matches by construction -
exactly what the ALREADY ACCEPTED header says at `production-mapping.cjs:27-37` ("that match is therefore not a
guard in production and is not claimed as one"). The clauses that do bite still bite: P3-M16 refuses another
engine identity, another gate and `[undefined,null,'',7,{}]`, and the pinned path refuses foreign material end
to end (P3-P5: nothing committed, no op minted).

**The seeded-sibling guard is in the right place, and both header boundaries are true rather than merely named.**
The guard sits in `priorSidecar`, which `:787` reaches only when `seeded(entry)`; `importEntries` reads
`metadata.imports` (the LIVE register, which retract leaves), and `other.name !== entry.name` is sound because
`:484-490` refuses `LOCAL_IMPORT_NAME_TAKEN` on any byte mismatch and returns `"reused"` otherwise - header claim
(a), executed. Claim (b) is `priorSidecar`'s first line, the `opCount !== 0` refusal. `plan-edit-model.cjs:31` is
the `metadata.imports.length > 0` line (the PM's own citation at :477), and `engine-provider.cjs:3` does require
migrate and merge by literal path, as the new P3-B3 comment says.

**My own mutants - each applied, run, reverted, tree clean.**

    revert :16 to engine-runtime.cjs  -> 7 of 8 red across P3F-* and P3-B-*, only P3-B1 survives
    drop the seeded-sibling guard     -> P3D-11 red, alone
    reviewed pin ignored              -> P3-M13 and P3-P5 red, P3-M16 and P3-P4 green

**The rewrite of `page-bundle.test.mjs` relaxes nothing.** The old P3-B2 asserted esbuild REFUSES; that fact is
now false and could not be kept. What replaces it is narrower and harder: the swept names asserted absent by
`deepEqual` to `[]`, an exact module count, and a P3-B3 that still RUNS `assertBundleInputs` and now pins the
tripped set and the six lane files by `deepEqual` rather than `assert.ok(includes)`.

**Seal and hygiene.** In `packages/S5.json`, of the ten drifted files only the control `today-bindings.mjs`
appears - `source-admission.mjs` and `import-bundle.mjs` are UNDECLARED, so `--ci` has nothing to complain about.
On this base `b-package --ci --package S5` prints EXIT 0 and `FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`, as recorded.
Cherry-picked onto the CURRENT tip **ee5fc3d** (:478) in a scratch worktree, since removed: clean, same 10 files
/ +678 / -115, and b-package prints **SEAL BASE ON THE TIP**, **PRODUCT IMPLEMENTED ... 0 unlisted drift**,
**PUBLIC CI EVIDENCE PASS**. 678 added lines, 0 non-ASCII, 0 CRLF, 0 tabs, 0 trailing whitespace; 0 engine bytes,
0 `today/**`, 0 `today-bindings.mjs`. The runbook edit is confined to pre-check 7 and the item 6 caveat, its
P3-M15 citation resolves, and the author report is exactly 70 lines.

## Findings

1. **MINOR - "no assertion removed" is not accurate.** Two were: `assert.throws(() =>
   createProductionProducerRegistry({ hash }), TypeError)` from P3-M13, and old P3-B2's `assert.ok(refusal)` /
   `files.every(...)`. Both are forced by the change and explained in place, but the claim overstates it.

2. **MINOR - the base is stale two ways, and report and commit message disagree.** The commit message says the
   tip is `0986dd8` (:476); the report says `50aa74e` (:477); it is now `ee5fc3d` (:478). More usefully:
   `origin/rebuild/d-p3-mapping` d4ab43e is NOT an ancestor of the tip - that lane was rebased in as
   `b1a0923`/`7caccb1` - so this branch's merge carries patch-identical duplicates. Rebase onto ee5fc3d (git
   drops them) rather than merge; I confirmed the product commit applies with no conflict.

3. **NOTE - the production path's `material_digest` clause is now formally vacuous.** Accepted: the accepted
   header already disclaimed it, and engine identity, oracle gate and the New York calendar all still refuse.
   Recorded so a later reader of `local-source-profile.cjs:69` does not mistake it for a shipped guard.

4. **NOTE - test-file housekeeping in the rewrite.** P3-B3 and P3-B4 read module-level state written by P3-B2:
   sound under node:test's sequential ordering and guarded by `assert.ok(withAdmission, ...)`, but neither runs
   alone under `--test-name-pattern`. P3-B4's threshold also inverted sense (`> 400000` to `< 400000`) - a
   recording either way - and `preSwapCopy()` leaks a temp dir per call via `mkdtempSync`, three per run.

5. **NOTE - "every admission cell" is met by suite-level greens plus four byte-level A/B cells,** not by an A/B
   re-run of the 15 w7 cells, local-source-consumer and the m4/import 83 against the pre-swap module. Sufficient
   - those suites' pre-swap greens are the accepted baselines - but the report should say which of the two.

## Tails (mine, TZ=America/New_York; today-17 also MEASURED_TEST_NOW=2026-09-03)

    retract.test.mjs 13/13 | admission-swap 4/4 | production-* 24/24 | w7 import 15/15
    local-source-consumer 6/6 | m4/import suite 86/86 | W6 586/586 | today-17 by name 666/666
    port 65/65 | rig187 => PASS | A1 => PASS, 3 assets, 121 pinned inputs
    b-package --ci --package S5: on f0aff6f EXIT 0 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; cherry-picked onto
      ee5fc3d SEAL BASE ON THE TIP / PRODUCT IMPLEMENTED 0 unlisted drift / PUBLIC CI EVIDENCE PASS
