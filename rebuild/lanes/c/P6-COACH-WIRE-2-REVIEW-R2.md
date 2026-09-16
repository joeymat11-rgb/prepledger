# P6-COACH-WIRE-2 independent review, round 2

VERDICT: ACCEPT

Subject 75fd8efe6ad52d23acb734b61b2531c9829d282b, detached in
%TEMP%\earned-p6wire-rv, tree clean. Base is the tip: git merge-base HEAD
c76fb7f5 = c76fb7f5, and origin/rebuild/t2-client-core is at c76fb7f5.
Diff vs the tip: 7 files, +546/-24, all under rebuild/coach/** and
rebuild/lanes/c/**; no pinned path touched. Round 3 weakens no test - its
only test edits add two cells and tighten one regex.

## r1 items, re-verified against the code, not the report
1. MAJOR CLOSED. tools.cjs:848 now reads `if (!consent || typeof
   consent.respond !== "function" || typeof consent.recordIssuance !==
   "function")`. My V5 cell, which in r1 could only assert "a throw or a
   result", now asserts the refusal: a surface with respond and no
   recordIssuance returns ok:false, COACH_CONSENT_SURFACE_ABSENT and the
   tip's byte-identical copy - no throw, no issuances row, no answer on
   the face, empty ledger.
3. MINOR CLOSED, per the PM ruling. My r1 V8 was red; rewritten over the
   REAL client with a tampered reason it is green. Read off the shared
   backend (issuedInstance() returns only .instance, always null here, so
   it cannot tell accepted true from false) the row is {accepted:false,
   instance:null, producer:"volume.volumeImbalance",
   revision:"M2-S4-REAL-DAY@171ebcd4d4b3b2b4"}; reasonFor(id) is null;
   the face has no answer; consentLedger() and acceptedProposals() are
   empty; a cold reboot off the same backend still reads accepted:false.
4. MINOR CLOSED. My V9 lifts the shipped R4 regex verbatim out of
   engine-revision-gap.test.cjs (so it fails if that cell and the shipped
   assertion drift) and proves it red on five mutants: double-quoted,
   single-quoted and backtick "S9@deadbeef", a bare other identifier, and
   ENGINE_REVISION_FAKE, which the new \b catches. It also proves the OLD
   class was GREEN on the quoted mutant, so the claim is earned, not
   asserted. The regex stays green against real tools.cjs.
5. NOTE CLOSED. No node:fs/node:path require and no fs./path. use left in
   accept-proposal-issuance.test.cjs.
2. MINOR MOSTLY CLOSED - see N1. 6. NOTE CLOSED, checked with git.

## New findings (NOTE, neither blocks merge)
N1. The report's Round 2 section still opens "Base
    origin/rebuild/t2-client-core @ 57d056cb..."; the real base is
    c76fb7f5, which round 3's item 6 names, so the file contradicts
    itself. Also "6 files, +372/-56 (git show --numstat 544a1a8d)" is the
    product-file subset; that command prints 7 files, +425/-185, the
    difference being the author report itself.
N2. The compensating write drops its result:
    `consent.recordIssuance({ id, accepted: false, ... });` ignores
    {stored}. If the compensation itself fails to store, the row keeps
    accepted:true and the refusal copy says nothing. The seeding write one
    branch up IS checked (CONSENT_ISSUANCE_NOT_STORED). Narrow window, and
    the ruling asked only for the write, so I do not hold merge on it.

## Standing checks and suites, re-run here at 75fd8ef
Three pre-existing refusals byte-identical to c76fb7f5:tools.cjs (V6, vs
tip bytes pulled fresh from git). 546 added lines, 0 with U+2013/U+2014.
LF only, no CR in any changed file.
reviewer cells rv.test.cjs + rv2.test.cjs 15/15 | coach 231/231 |
client 18/18 | rig187 => PASS | S4 --ci EXIT 0, "SEAL BASE ON THE TIP ...
c76fb7f ... ancestor of this HEAD", 0 unlisted drift, "PUBLIC CI EVIDENCE
PASS" | today-13 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)
645/645. Every tail matches the author's report exactly.
