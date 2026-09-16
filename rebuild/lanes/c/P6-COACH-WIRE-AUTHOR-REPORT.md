# P6-COACH-WIRE author report

Lane C, size S. Branch rebuild/c-p6-coach-wire, this round's sha 91c30744.

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
Files:hunks (this commit, 6 files, +372/-56):
- rebuild/coach/engine-revision.cjs (new, 27 lines): ENGINE_REVISION const
- rebuild/coach/tools.cjs (+39/-9, one hunk): require, CODES entry,
  accept_proposal body (recordIssuance before respond, whole issuance)
- rebuild/coach/test/engine-revision.test.cjs (new, 52 lines): 3 cells
- rebuild/coach/test/engine-revision-gap.test.cjs (77 changed): R1/R2
  deleted (asserted the closed gap), R3 kept, R4 rewritten as contract cell
- rebuild/coach/test/accept-proposal-issuance.test.cjs (new, 188 lines):
  bar cells a-h
- rebuild/coach/test/tiers.test.cjs (45 changed): "EXACTLY what the durable
  store keeps" rewritten for the closed gap

Receipt sha256 over rebuild/lanes/b/tooling/receipts/S4.json's raw bytes =
171ebcd4d4b3b2b43707d681cf0511c9eb9d609e3fc32e699a94d88ff7f5dcc1, via
`node -e "console.log(crypto.createHash('sha256').update(fs.readFileSync(
'rebuild/lanes/b/tooling/receipts/S4.json')).digest('hex'))"`; first 16 hex
= 171ebcd4d4b3b2b4. receipt.packageId = M2-S4-REAL-DAY; rebuild.yml's
standing step is `--package S4`. ENGINE_REVISION =
"M2-S4-REAL-DAY@171ebcd4d4b3b2b4".

## Bar cells (accept-proposal-issuance.test.cjs unless noted)
a/b/e one cell "recordIssuance runs BEFORE respond..."; c "recordIssuance
stored:false leaves respond uncalled..."; d "a tampered reason is refused
by the real client's own digest check..."; f "after accept, the real
client's reasonFor(id) returns the stored reason..."; g
engine-revision.test.cjs's 2 cells, green in the same suite run; h "the new
CONSENT_ISSUANCE_NOT_STORED code and copy carry no long dash".

## Suite tails (this sha, %TEMP%\earned-p6wire)
coach: 229 tests, 229 pass, 0 fail
client: 18 tests, 18 pass, 0 fail
rig187: `rig187 => PASS`
S4 --ci: exit 0; `SEAL BASE ON THE TIP`; 0 unlisted drift;
  `PUBLIC CI EVIDENCE PASS`; rebuild/coach absent from S4's product map
today-13 (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, 13 files by
  name): 645 tests, 645 pass, 0 fail

## Open items
- rebuild/coach/local-world.mjs untouched: ENGINE_REVISION is required
  directly by tools.cjs, so no constant-threading was needed there.
- Not pushed.
