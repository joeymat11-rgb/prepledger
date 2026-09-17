# P3-P6-SEAL-WINDOW - independent review R1 (Opus). VERDICT: ACCEPT
SCOPE. `git diff 065bebb 40cdff8`: exactly two paths, one product -
`rebuild/m4/import/test/production-admission.test.mjs` (+74/-7) - plus the new
29-line author report. `rebuild/engine/**` untouched, no npm, tree clean.
DERIVED, NOT LITERAL. Both former literals are gone. Step 1 asserts the shape
`/^[^@]+@[0-9a-f]{16}$/`, then `Mapping.ENGINE_REVISION === standingSeal(REPO)
.expected`; the "cache restore leaked" assertion compares to that same value.
`REVISION_RULE` + `sha16` + `receiptId` + `standingSeal` duplicate
`production-mapping.test.cjs:73-119`: compared line by line, every code line
byte-identical (the .cjs carries three extra comment lines). Expected comes from
receipts/packages/rebuild.yml on disk and the asserted value from the coach
literal, so the assertion is not vacuous - the red runs below confirm it.
THE CELL'S MEANING IS INTACT. Steps 2 and 3 are untouched: `ROTATED` is the expected
id + `-NOT-A-REAL-ROTATION@` + sha16('rotate:'+expected), so only the tail moves, the
MAPPING_ID prefix and two-digests-differ checks still bite, step 4 still re-admits,
adopts and retracts, and `ROTATED != expected` is asserted.
RE-MEASURED (TZ=America/New_York MEASURED_TEST_NOW=2026-09-03): the pair gives tests
28, pass 28, fail 0; alone, mapping 20/20, admission 8/8. Child needle STAYS 28.
SEAL CASE PROVED BY ME, not taken from the report. In a scratch worktree I wrote a
synthetic `receipts/S6.json` (packageId M2-S6-TODAY-CHILD) and moved the coach
constant to `M2-S6-TODAY-CHILD@da785557f9fe424a`, its own sha16: the rule flipped to
`sealed` and the pair came back 28/28, fail 0 - the post-seal side the old literal
could never reach. Wrong sha under that seal: pass 7 / fail 1, "...its receipt is
sealed: bar row 23 runs against S6 as ...da785557f9fe424a, not ...ffffffffffffffff"
+ the rule. Window red (receipt deleted, constant set to S6 early): pass 7 / fail 1,
"...its receipt is window: ...runs against S5 as M2-S5-TODAY-CHILD@0df73b01f3d2d935,
not M2-S6-..." + the rule. Real tree (window) green. Deadlock gone both ways.
TAILS. LF only, no CR byte, no U+2013/U+2014; report 29 lines; authorship and
Co-Authored-By correct; not pushed; no private path opened or named.
NOTE, not a defect: `standingSeal(REPO)` runs at module top level, so a missing rule input fails the whole file, not one cell - louder, not weaker.
