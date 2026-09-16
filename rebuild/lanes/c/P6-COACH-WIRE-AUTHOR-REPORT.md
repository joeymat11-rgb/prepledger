# P6-COACH-WIRE author report

Lane C, size S. Branch rebuild/c-p6-coach-wire. Round 2 commit 544a1a8d
(P6-COACH-WIRE-2, DECISIONS:456): 6 files, +372/-56 (git show --numstat
544a1a8d), and accept-proposal-issuance.test.cjs holds 6 test() cells
(a/b/e merged into one, c, d, f, g, h) before round 3's new cell below.

## History (compressed)
R1 (Sonnet medium): STOP before touching accept_proposal, no engine
revision seam reached tools.cjs; report only. Review R1 (e5f66c6): REJECT,
false environment evidence. R1 fix (79fcbe6c): junctions corrected, coach
suite 222/222; added engine-revision-gap.test.cjs (R1-R4) as red proof of
the stop. Review R2 (e07d2736): ACCEPT. PM ruling DECISIONS:456: STOP
correct; ENGINE_REVISION = sealed-receipt label; MOMENT = today.today;
SOURCE = turn_id; routed as P6-COACH-WIRE-2.

## Round 2: P6-COACH-WIRE-2 (lane C, size S, Sonnet, effort high)
Base origin/rebuild/t2-client-core @ 57d056cbad808e694b3348cf7e59299767d19a6f.
engine-revision.cjs (new); tools.cjs (require, CODES entry, accept_proposal
records then responds with the whole issuance); engine-revision.test.cjs
(new, 3 cells); engine-revision-gap.test.cjs (R1/R2 deleted as closed, R3
kept, R4 rewritten as a contract cell); accept-proposal-issuance.test.cjs
(new, bar cells a-h); tiers.test.cjs ("EXACTLY what the durable store
keeps" rewritten for the closed gap).

Review r1 (Opus high, sha 9d990bf over 8f56cb5 = author 54b7e5fb rebased
onto c76fb7f): ACCEPT with 1 MAJOR, 3 MINOR, 3 NOTE.

## Round 3: closes r1's MAJOR and MINOR 3/4/5 (this commit)
1. MAJOR - CONSENT_SURFACE_ABSENT guard (tools.cjs) now also requires
   typeof consent.recordIssuance === "function"; a consent surface with
   respond and no recordIssuance refuses instead of throwing. Existing
   accept_proposal cells exercise this call path; no new cell needed.
3. MINOR - accept_proposal now writes a compensating
   consent.recordIssuance({accepted:false,...}) when respond() refuses.
   New cell "e2" in accept-proposal-issuance.test.cjs, over the REAL
   client: the backend's issuances row reads accepted:false and
   reasonFor(id) is null (its own contract when no proposal-response op
   exists - never a falsely-recorded reason).
4. MINOR - engine-revision-gap.test.cjs's R4 regex now also matches a
   quoted literal (e.g. "S9@deadbeef"). New "R4 mutant" cell proves the
   old class let a quoted literal through and the new one catches it.
5. NOTE - accept-proposal-issuance.test.cjs's unused fs/path requires
   removed.
2. MINOR - this header's sha/diff-stat/cell-count corrected against git
   (git show --numstat, git log, and the suite's own cell names).
6. NOTE - rebased onto origin/rebuild/t2-client-core @ c76fb7f before this
   report (git merge-base --is-ancestor origin/rebuild/t2-client-core HEAD).

## Suite tails (this worktree, %TEMP%\earned-p6wire, post round-3 edits)
coach: 231 tests, 231 pass, 0 fail (was 229; +e2, +R4 mutant)
client: 18 tests, 18 pass, 0 fail
rig187: `rig187 => PASS`
S4 --ci: exit 0; `SEAL BASE ON THE TIP`; `PUBLIC CI EVIDENCE PASS`
today-13 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, 13 files by
  name): 645 tests, 645 pass, 0 fail

## Open items
- Not pushed.
