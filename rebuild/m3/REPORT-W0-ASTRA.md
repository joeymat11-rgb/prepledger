# W0-RIGS — ASTRA report

## 1. What and why

W0 publishes the shared contracts, ratified public mock pin, existing-test inventory and early rebuild CI. It prevents a missing authority/client adapter, deleted law, altered evidence artifact, changed frozen file or extra package entry from receiving a public PASS. It does not implement a server, phone store or Today screen.

Start base: `0a139219472a2818b167addc8b8e675f90b2b9b7`; published start receipt: `78aaeb9`, branch `rebuild/m3-w0-rigs`. Accepted queue/mock/ledger integration arrived at `8fa4912093be7d7fdf9164343be0473d2127e042` and is included. The original published claim remains in history. Scope: `w0/BRIEF-W0.md`; one PR, no merge or self-acceptance.

## 2. Deliverables and status corrections

- `w0/CONTRACTS.md`: existing requirements and settled W4 setup inputs; W5 wire and W6 bounded-budget/sealing fields remain OPEN. Public mock hash checked; private original not read.
- `w0/RIG-INVENTORY.md`: every M3 done-line and C1–C11 maps to existing assertions, missing real boundaries and accountable work. W5 still owns rig190/191 and the shared case runner.
- `w0/public-conformance.cjs`: unchanged law/reference/mutant/product-adapter assertions, exact 99-law inventory, required authority/client presence, archived evidence and coverage metadata.
- `w0/public-oracle.mjs`: builds the two pinned frozen engines from allowlisted public source blobs, stages only public fixtures/goldens, runs unchanged public oracle checks and candidate checks in both Date modes, and requires rig185 W1/W2.
- `w0/scope-package.mjs`: freezes named paths against 8fa4912 and inspects a real locally generated ZIP using the unchanged production site manifest. Nine focused tests exercise these new failure boundaries.
- `.github/workflows/rebuild.yml`: public checks on Linux and Windows, existing rig187 and full extracted-engine second gate. Existing deploy/strict workflow, frozen code/laws/oracle/manifest, root dependencies and seeded soak are untouched.
- QUEUE/DECISIONS index Cowork's already-accepted resolutions, correct W1 to integration aeb330f, claim W0 and expose W7-PREVIEW readiness. W5 local implementation files were observed in its separate worktree; its current execution/PR and the audit's start remain unconfirmed. Neither task was duplicated or modified.

## 3. Reproduction and executed local output

Windows; local Node 24.19.0, workflow Node 22. Commands run from repository root. For public laws/oracle/second gate use `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`. Run the three W0 entry points, `node --test rebuild/m3/w0/test/public-conformance.test.cjs rebuild/m3/w0/test/scope-package.test.mjs`, existing `rebuild/t2/rig187.cjs` and `rebuild/engine/test/second-gate.mjs --candidate`.

For the unchanged full suite/selftest, locally regenerate the private fixture/golden as AGENTS specifies; restore and verify the committed public pins. Set ENGINE_MAIN/ENGINE_OLD explicitly to the two public-only built bundles in ignored `.tmp/m3-w0-engines/`. The builder reads only fe516c1/a0009c3 app/history/fixed-clock source; it does not check out the ledger. Private preparation output is verdict-only. Run strict with MEASURED_TEST_NOW unset.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
PUBLIC-LAWS laws/sheet-A-authority.cjs: 34 reference GREEN; 34 STRONG; 34 adapter GREEN; 0 RED-as-specified
PUBLIC-LAWS laws/sheet-B-client.cjs: 35 reference GREEN; 35 STRONG; 35 adapter GREEN; 0 RED-as-specified
PUBLIC-LAWS laws/d13-d14.cjs: 20 reference GREEN; 20 STRONG; 0 adapter GREEN; 20 RED-as-specified
PUBLIC-LAWS laws/progression.cjs: 9 reference GREEN; 9 STRONG; 0 adapter GREEN; 9 RED-as-specified
PUBLIC-LAWS laws/soak.cjs: 1 reference GREEN; 1 STRONG; 1 adapter GREEN; 0 RED-as-specified
ARCHIVED-GATES VERIFIED: 10/10 identities, hashes, declared counts and clock; archived evidence only, rigs not re-executed
COVERAGE-METADATA VERIFIED: 30 declarations; every law id covered; port declaration is NOT RUN here
PUBLIC-CONFORMANCE PASS: 99 reference GREEN; 99 STRONG (141 targeted mutants detected); 70 adapter GREEN; 29 RED-as-specified (policy/progression absent)
PUBLIC-ORACLE check PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-ORACLE sensitivity PASS — 9/9 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE frozen PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE native PASS — 7/7 unchanged public oracle laws; private NOT RUN
ENGINE-TRACK PASS — rig185 W1 PASS, W2 PASS on frozen engine; unchanged assertions
tests 9; pass 9; fail 0
SECOND GATE reference FINAL108: 3072 passed, 0 failed
SECOND GATE candidate FINAL108: 3072 passed, 0 failed
SECOND GATE candidate surface: byte-identical to committed baseline (123077 bytes)
SECOND GATE candidate: PASS; exact original harnesses; July lazy-clock bridge; closed synthetic I/O; manifest .tmp/m2-second-gate/candidate-manifest.json
PRIVATE PREPARATION PASS
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
  PASS  engine suite — 3072 assertions passed
  PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
  PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

The nine-test line above normalizes the test reporter's symbols only. Existing sync-laws also reports 18 laws across 59 seeds; rig187 PASS includes the effective half-write/restart mutation. A separate .NET ZIP reader opened and read all 18 generated archive entries. Strict's unchanged “Safe to ship” means that existing check passed; it is not a new M3 release approval.

## 4. Bite

Removed only the new required-adapter absence refusal in a disposable edit of `w0/public-conformance.cjs`. The tracked test failed; restored from its original buffer and re-ran all nine tests successfully:

```text
✖ adapter deletions and load failures never become permitted RED families
AssertionError [ERR_ASSERTION]: Missing expected exception.
W0 BITE DETECTED — required-adapter refusal removed; adapter deletion test FAIL (Missing expected exception)
W0 BITE RESTORED SHA256 370b3aeb2e4153bac2197c6dc3f832af24289a67fc6d58fe01ae4a0dc91c1fe8
```

The restored SHA is for public test-runner code, not private data. Other tracked negative tests cover missing/broken dependencies, law inventory, artifact hashes/status/clock, coverage references, ZIP corruption/extra paths and committed/working/untracked frozen changes.

## 5. Seams and honest limits

Public CI never receives the private blob/golden, regenerates manifest pins or claims the full suite/selftest ran there. The absent policy/progression families remain explicit, expected RED; that is neither M2 closure nor M4 readiness. Future accepted families require a deliberate inventory update. Archived artifact integrity is not re-execution of those old rigs.

The ZIP inspected here is newly generated from the production manifest, not the archive uploaded by the existing deployment workflow. I must inspect actual uploaded old/new artifacts on the release commit. New PWA packaging and final SCOPE-FREEZE remain PENDING. Repository required-check settings and deployment gating have not been changed; I/C must enforce acceptance until the eventual deployment pipeline consumes these gates.

No D1, HTTP, IndexedDB, actual iPhone clock/pressure/idle, recovery, spending or private port verdict is claimed. Full unchanged suite/selftest were executed locally, separately from public CI. W0 leaves the W5 wire-contract gap and W6 coherent-restore/lease-renewal risks visible without changing a rule.

## 6. Review, uncertainty and time

Same-family bounded code/contract reviews found no blocking issue and re-executed the nine public tests on Windows. This is assistance, not Cowork's independent acceptance. Linux and GitHub execution must be recorded on the PR; local evidence alone does not establish either. Remaining uncertainty is explicit in CONTRACTS, especially W5 lease history/time/signature fields and W6 durable rejection fence/budget exposure.

First published claim timestamp: 2026-09-06 04:35:38 UTC; restored tests reconfirmed at 04:48:39 UTC (about 13 minutes from claim; preliminary reading and later CI/review time excluded). This is observed wall-clock for that segment, not an estimate for completing M3 or proof that relay/independent review takes zero time.

## NEXT

Unblocks: W4's setup-contract input and W5's published W0 inventory, pinned to the PR commit; neither is W4/W5 acceptance. C-MOCK's accepted public artifact separately unblocks W7-PREVIEW. Next Astra item: W6-BRIEF, not yet claimed; only read-only preparation occurred. Audit/W5 remain with their existing tasks. Cowork verifies this exact PR by execution; Claude Code integrates only after that acceptance. No owner account/phone action is required for W0.
