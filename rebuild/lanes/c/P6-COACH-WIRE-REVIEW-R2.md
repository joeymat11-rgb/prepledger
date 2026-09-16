# P6-COACH-WIRE independent review, round 2

VERDICT: ACCEPT (the ticket's own STOP clause, correctly exercised and now
correctly evidenced). Subject 79fcbe6cf823508d69d3a474ef1c1b84c9bb9b6c, base
f2fc4f4977e99dd657573eaa0e8ebd028168268b. Every check below was made with the
reviewer's OWN cells at %TEMP%\wire-rv\rv.test.cjs (5 cells, 5 pass).

## What the reviewer proved, not read

- V1, recording fake consent: accept_proposal calls `respond` FIRST with
  exactly `(id, "accept")`, then `recordIssuance` with exactly
  `{accepted, id, instance}`. BAR (a), (b), (c), (e) unmet, as a STOP implies.
  `git diff f2fc4f49 HEAD -- rebuild/coach/tools.cjs` is EMPTY.
- V2, real client over an in-memory store: a real yes is acknowledged and
  `reasonFor(id)` still answers `recorded:false, reason:null, revision:null`.
  The P6 carry-over is open and the STOP does not hide it.
- V3, real client: an issuance built ONLY from the issued record plus a
  revision is acknowledged, and `reasonFor` reads back reason, revision,
  source and moment; deleting any ONE of the six refuses, and a tampered
  reason refuses on the digest. The client seam is sound; the single missing
  ingredient is a revision VALUE.
- V4, seam probe: no `revision`, `version`, `profile`, `clock`, `now`,
  `moment` or `stamp` on the today adapter, on `today.engine`, on the client
  api, or on `face()`; engine-runtime exposes only its five reader names and
  `COMPOSITION` carries no revision; `rebuild/engine/index.cjs` exports only
  `createEngine`; `today.today` (tools.cjs:411) is a 10-character DAY string,
  not a clock. The STOP is factually correct.
- V5: the three pre-existing refusals answer with byte-identical code and
  copy. `world.era.revision` (local-world.mjs:350) is local-client.mjs:258
  `revision: 1`, an integer device-era counter, and tools.cjs never reads
  `world.era`; the author's rejection of it is right.
- Diff is two ADDED files. LF only, pure ASCII, no U+2013 or U+2014.

## Findings

1. MINOR, fix before merge: 79fcbe6 is authored and committed as
   `lane-b-builder-h3c <builder-h3c@earned.local>`, not the mandated
   `cowork (Earned PM) <joeymat11@gmail.com>` (8c376fe did comply), and its
   trailer says `Claude Sonnet 5` where the ticket names `Claude Sonnet`.
   Lane C work signed with a lane B builder identity. Amend; content is fine.
2. MINOR, fix before merge: the report still carries the WITHDRAWN claim.
   "Secondary, unrelated environment note" still states 49 failures and
   "pre-existing on this exact tip", and "Open items" still states the
   rig187/client/S4/today-13 tails were not produced. Both are false. Round 1
   rejected for false report evidence; strike them, do not merely supersede.
3. MINOR: the ticket caps the author report at 60 lines; it is 132. Striking
   the two dead sections in finding 2 closes most of the gap.
4. NOTE: `moment` may need no new seam. The client requires only a string
   with a finite `Date.parse` (client/index.cjs:101), and `today.today`
   parses. The PM can rule a day-grained moment and hand back ONE seam
   (revision); the two-seam framing is defensible but not forced.
5. NOTE: the new tripwire must die with the build. engine-revision-gap.test
   R1 asserts on the SOURCE TEXT of tools.cjs and goes red the moment this is
   really built; the follow-up must DELETE R1 and R2, never weaken them.
6. NOTE: neither commit uses the mandated subject, which would have asserted
   a build that did not happen. Correct call; PM ratifies.
7. NOTE: out-of-custody environment repair, disclosed by the author. A
   mistaken `npm install` at the shared prepledger-dev root pruned 41 packages
   and was repaired with `npm ci --include=dev`. No repo byte moved, every
   suite here is green, the root matches the lockfile. Accepted as disclosed.

## Suites, re-run by the reviewer on 79fcbe6

coach   : tests 222, pass 222, fail 0 (duration_ms 965.8978)
client  : tests 18, pass 18, fail 0 (duration_ms 126.237)
rig187  : `rig187 => PASS  -- SUITE GAP: both subjects are 35 GREEN under
          run.cjs; B-durability never restarts from the store`
S4 --ci : `B PACKAGE S4 PUBLIC CI EVIDENCE PASS`, EXIT 0, with
          `SEAL BASE ON THE TIP ... f2fc4f4 ... ancestor` and
          `0 unlisted drift`; `findstr "rebuild/coach" S4.json` matches none.
today-13: MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York, all 13 files by
          name: tests 645, pass 645, fail 0 (duration_ms 15984.7093)

## To the PM

The build cannot proceed until an accepted engine revision STRING reaches
tools.cjs. Cheapest honest options: a frozen `REVISION` on the composition in
`rebuild/engine/index.cjs`, threaded through `today-engine.cjs:30` onto the
object the coach holds; or an explicit `world.revision` from whoever composes
the engine. Both are outside lane C and outside this ticket.
