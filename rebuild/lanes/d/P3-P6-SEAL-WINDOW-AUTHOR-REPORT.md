# P3-P6-SEAL-WINDOW - author report (lane D, XS)
THE DEADLOCK. `production-admission.test.mjs` cell `P3-P6 - BAR ROW 23` asserted
twice against the LITERAL `M2-S5-TODAY-CHILD@0df73b01f3d2d935`. That file is S6-declared
product (role new) pinned in the sealed artifact: before the seal the constant is still
S5's so it cannot be edited to S6 (red); after the seal it moves to S6 so the literal is
red in the declared child `m4-import-production`. Byte-identity run and CI both fail.
THE FIX, THAT CELL ONLY. The expected constant is derived through the SAME rule
ENGINE-REVISION-SEAL-WINDOW put into `production-mapping.test.cjs`: `REVISION_RULE`
+ `sha16` + `receiptId` + `standingSeal(repoRoot)`, duplicated here the way that
file and `coach/test/engine-revision.test.cjs` each carry their own copy (neither
exports it). `EXPECTED_SEAL = standingSeal(REPO)` is read once; step 1 asserts shape,
then `Mapping.ENGINE_REVISION === EXPECTED_SEAL.expected`, naming the standing package,
its state, the seal it runs against and the whole rule. The "cache restore leaked"
assertion compares to the same value. `ROTATED` stays a distinct fabricated revision
DERIVED from it (expected id + `-NOT-A-REAL-ROTATION@` + sha16 of `'rotate:' +
expected`), only the tail moves, steps 2 and 3 keep their meaning, and `ROTATED !=
expected` is asserted. Nothing else in the cell moves; the row's intent holds.
MEASURED. TZ=America/New_York MEASURED_TEST_NOW=2026-09-03, `node --test
production-mapping.test.cjs production-admission.test.mjs`: `# pass 28`, fail 0.
The `m4-import-production` needle STAYS 28 (no cell added). Rule state here: standing
`S6`, no receipt -> `window`, parent `S5`, expected
`M2-S5-TODAY-CHILD@0df73b01f3d2d935`, the literal the cell used to hold.
RED SIDES, both applied, run, restored. (1) window: expected substituted with
`M2-NOT-THE-STANDING-SEAL@...` -> `pass 7 / fail 1`, "the standing package is S6
and its receipt is window: bar row 23 runs against S5 as ..." + the rule quoted.
(2) sealed: a fabricated `receipts/S6.json` -> the rule flips to `sealed` and the
cell refuses "runs against S6 as M2-S6-TODAY-CHILD@afcb10f9..., not M2-S5-...";
the post-seal side no literal could reach. Fixture deleted, green pair re-run 28.
No guard weakened, no `rebuild/engine/**` byte moved, no private path touched.
