# P6-COACH-WIRE review r1 (independent)

VERDICT: REJECT

Subject 8c376fea9ab91fdeef603e624d3f313b808c95a3. Diff vs f2fc4f49: 1 file,
+76, only rebuild/lanes/c/P6-COACH-WIRE-AUTHOR-REPORT.md. No product file
touched. The STOP itself is CONFIRMED and must be preserved in round 2; the
rejection is about the report's evidence, wrong in one place and absent in
four others, plus one unreported half of the same gap.

## Verified by my own cells (%TEMP%\wire-rv\review.test.cjs, 4/4 pass)

- R1: tools.cjs still has `consent.respond(id, "accept")` with no issuance and
  `recordIssuance({ id, accepted: true, instance: null })` after it; no
  producer/revision, no coach clock. Untouched.
- R2: over the REAL rebuild/client on an in-memory store, request_replan then
  accept_proposal returns ok, and `client.reasonFor(id)` still answers
  recorded:false, reason:null, revision:null. Both P6 r3 MAJOR carry-overs are
  still open at this sha.
- R3: revision is the real blocker and the ONLY one. With the issued record's
  producer/body/reason plus source=turn_id and moment=clock, the real client
  refuses revision undefined, "" and 1, and acknowledges a string revision,
  after which reasonFor returns the stored reason AND revision. Bar (a)-(g) is
  reachable the moment an honest revision exists, and not before.
- R4: no revision or clock on any seam the coach receives: today-model has no
  .revision/.clock, today.engine has no .revision/.version, engine-runtime
  COMPOSITION has no revision, rebuild/engine/index.cjs exports exactly
  createEngine.

## Findings

1. MAJOR (report evidence false). The report's only tail claims the coach
   suite is 218 tests, 169 pass, 49 fail, all ERR_MODULE_NOT_FOUND
   fake-indexeddb, and concludes the junctioned node_modules is broken. On the
   SAME sha with the three junctions the ticket prescribes (root, m3/w6, m3/w5
   from %TEMP%\earned-ci) it is 218 tests, 218 pass, 0 fail. fake-indexeddb is
   absent from the ROOT node_modules, which is exactly why the m3\w6 junction
   exists. Author setup error, not a pre-existing environment gap; the report
   sends PM after a CI break that does not exist.
2. MAJOR (mandated evidence missing). Client, rig187, S4 and the today 13 were
   declined "since no code changed". They are what proves nothing else moved
   and they are cheap. Run here, all green; tails below.
3. MINOR (gap reported by half). `moment` has no accepted source either and
   the report does not say so. tools.cjs takes no clock: world is read at
   :395-401 as today/gym/consent/checkin only, `day` is `today.today`, and the
   one `new Date()` in the file (:938) is verifyCostCap's own option default;
   today-model builds an engine clock internally (today-model.cjs:77,158) and
   does not expose it. PM's follow-up ticket is TWO seams, revision and coach
   clock. `source` is fine: turn_id is in hand.
4. MINOR (STOP without its red proof). Cells R2 and R3 are what the report
   should have carried: carry-over still open, and the whole wiring working
   the instant a revision exists. Neither needs a product-file change, so
   "no cells, nothing to test" does not hold.
5. NOTE (claims checked, SOUND). No made-up literal anywhere. EXPOSED
   (engine-runtime.cjs:40) has no revision; today-engine.cjs:22-36 is
   createBrowserEngine + writers.cjs with no version; local-world.mjs:350
   era.revision is local-client.mjs:258 `revision: 1`, a sealed IndexedDB
   generation integer, and stringifying it would put a device era counter
   where the client's B1 cell expects a build identity. Rejecting it was
   right. No Date.now in the diff (there is no diff). The three pre-existing
   refusals are byte-identical because tools.cjs is byte-identical. No new
   user-facing string exists, so the dash rule is trivially met.
6. NOTE. Commit subject is the STOP wording, not the mandated subject. Right
   call for the outcome, but PM should ratify it rather than let it pass.

## Tails measured by this review (worktree %TEMP%\earned-p6wire-rv)

- coach glob: tests 218 / pass 218 / fail 0 / duration_ms 956.166
- client: tests 18 / pass 18 / fail 0 / duration_ms 129.4673
- rig187: `rig187 => PASS` (SUITE GAP line unchanged, suite v4 candidate)
- b-package S4 --ci: `B PACKAGE S4 PUBLIC CI EVIDENCE PASS`, EXIT 0; seal base
  on the tip, 0 unlisted drift; findstr "rebuild/coach" S4.json: no match
- today 13 by name, MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York:
  tests 645 / pass 645 / fail 0 / duration_ms 16127.3047, EXIT 0
- review cells: tests 4 / pass 4 / fail 0 / duration_ms 101.105

Round 2: keep the STOP, drop the false 49-failure claim, carry these tails,
add cells R2 and R3, and state the gap as two missing seams. The build cannot
proceed until PM names the revision seam; this review found none.
