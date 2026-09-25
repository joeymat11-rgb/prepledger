# REVIEW-S10-R11-l1 - independent Fable review of S10 builder round 11 (runbook T3a)

Reviewer: Claude Fable 5.1 (independent; did not write the work). Date: 2026-09-25. Left UNCOMMITTED for the PM.
Object: the uncommitted diff in W = %TEMP%\earned-s10int against f97924a over the four paths the builder named:
rebuild/m3/w7-preview/today/test/problem.test.mjs (+93), rebuild/lanes/c/today-split-spike/cut.cjs (+27),
rebuild/lanes/b/tooling/packages/S10.json (notes[8], 1 line), rebuild/lanes/b/S10-INTEGRATION-REPORT.md (Round 11, +27).
Read against: runbook S10-SEAL-RUNBOOK.md T3a and section 3; brief c58b892 sections 3.2, 6.1, 7.1, 13; DECISIONS :810-:817
(read from refs/remotes/origin/rebuild/t2-client-core = 85653f4, one line past the 94977a9 the builder read; :817 is the
S12 look ruling and touches nothing in T3a). Rules 51706c33 kept: nothing protected loaded, read or output; no b-package run.

## VERDICT: ACCEPT WITH NAMED DEBTS

## 1. What I measured myself (not taken from the builder)
- sha256 of the four files as on disk = the builder's four values (5fe767e0..., 10ea939b..., 194eaf1e..., 96ccddbb...);
  CR count 0 in all four; 148 added diff lines, 0 contain U+2013/U+2014; S10.json still parses (35 children, 297 product keys).
- Head cell re-run through pm-run shared (job fable-s10r11-f1, guard.cjs preloaded, GUARD_LOG empty = 0 refusals):
  node --test --test-name-pattern "^S10 " problem.test.mjs -> 3/3 ok, EXIT=0 (%TEMP%\fable-s10r11\f1-head.tap).
- D6/D7 harness re-run in the same job: HEAD cut 3/10 (the 6 D7 increments and D6-NESTED-COMPETING exit 0, the last with a
  DIFFERENT today-app.cjs), W cut 10/10 refused by name; EXIT-RED=1, EXIT-GREEN=0 (f1-d67.log). Harness writes only to scratch.
- The three mutant reds I did NOT re-run: mut.cjs writes today-lanes.cjs INTO W and Astra L7 reads W in parallel (job 127).
  I read the builder's TAP instead (d3b-m18/m21/sr33.tap): each mutant fails exactly its own row and the failing assertion is
  the intended one (M18: trace missing the second 'read'; M21: expected '' actual '7.5'; S-R33: lane mounted is laneA, not the
  handed-over laneB), and each run ends RESTORED HEAD today-lanes.cjs f1d954267ee8; d3b-head.tap HEAD-EQUAL.
- CI-0 36158401022 per step (ci-steps.cjs, public API): step 23 'E - EPP proposed-pick' and 25 'C - the Today split writer
  fence' success on ubuntu-latest AND windows-latest; step 13 failure on both. notes[8]'s new sentence is true as written.
- IR:51 corroborates the notes[8] claim "writer fence 404/404 at 47983ba (round 4)".

## 2. Code read of the two product changes
- cut.cjs:259-270 (D7): the check re-derives headLines/closeLines with exactly gen-witness.cjs:135's expression
  ((P.head||[]).length, (P.close||[]).length) inside checkDeclaredText(), which runs unconditionally (cut.cjs:658), so it
  reaches every --product cut. The declared-text digest (declaredProdSha) already pins head/open/close; the witness's two
  count fields were the only unread ones and are now refused by name. D7 is paid by validation, the stronger of its two options.
- cut.cjs:743-757 (D6): pairwise, order-independent, inclusive-range overlap over every replace that `enclosing` maps to a
  seam, within one file. Completeness argument, checked by reading :721-:763: only replaces inside seams leave the flat set;
  a nested replace cannot overlap a flat row without that row overlapping its seam, which the flat check refuses; and the
  flat adjacent-pair check is complete for a set sorted by start (the first row that overlaps an earlier one overlaps its
  immediate predecessor). The move/move case (TA-S01/TA-S02) still refuses through the flat check. D6-NESTED-EXTEND is now
  refused as OVERLAP before the parsed-structure refusal reached it at HEAD; that is stricter, not weaker.
- problem.test.mjs:3596-3688: every helper the rows use resolves in the file (faultDatabase :14, webcrypto :12, JSDOM :13,
  createCheckInEntry :19, createCleanInitState :21, mountToday/createTodayModel :44, shell :61, opsOf :393, NIGHT :1077,
  device :1088, laneOver :1108, screenOn :1110, sleepFirstRunDocument :1143). The file is in the today-17 child (S10.json
  :1658), so the three rows will run on both OS in every hosted run and become part of the today-17 needle.
- D9 spot-check of the reading arguments (mutation text from astra-split-l3-67/clause-mutations-final.json): I172 (cut.cjs
  :495 canon key filter) is equivalent because canon only sees nodes from parseFragment/parseWhole (:426-:432), which set
  neither locations nor ranges (the :799/:1028 parses that do set locations feed other functions); I235/I236 are unreachable
  because the candidate list always ends with the whole file (:528) whose pre-image fileStructure (:405) already parsed with
  the same options. Confirmed. The other 12 reading arguments I did not re-derive; the 6 distinguished ones are measured
  (d9.log 6/6, each against control exit 0).

## 3. Findings (file:line)
F1 (brief 3.2, DEBT) S10-INTEGRATION-REPORT.md:139 says the M/R/N census (299 hunks, 0 unclassified) is "at f97924a
  (before this round's two files)". Round 11's own hunks - problem.test.mjs:3596-3688 (N, test rows) and cut.cjs:259-270,
  :743-757 (N, instrument checks; no product byte of any cut output moves, re-cut 6/6 EQUAL) - are therefore unclassified
  under 3.2 as the report stands. Trivial to classify, but the census must be re-stated at the final bytes before T4, or the
  brief's "unclassified hunk is a STOP" reads literally against this round.
F2 (correction to IR:117 "CI-only ... the split instruments") instruments.test.cjs and PART2-DOM-LISTENERS.mjs are
  product-pinned (S10.json :308, :318) but NO S10.json child argv and NO step in .github/workflows/*.yml runs either
  (grep 'instruments|DOM-LISTENERS|spike' over the workflows: 0 hits). They are not CI-only; they run nowhere in the
  pipeline. So the cut's instrument evidence (47/53; DOM 7/7) is builder-local only, and with D-S10R11-1 (PART2 cannot run
  on Windows as committed) and D-S10R11-3 (row 27 red by construction) the committed instrument cells have no green anywhere.
  Not a round-11 regression (true at f97924a), but the PM should not carry "CI-only" for them. Named here as D-S10R11-5.
F3 (D-S10R11-4, endorsed with a recommendation) the D6/D7/D9 red-first inputs exist only in %TEMP%\opus55-s10r11
  (d67.cjs, d9.cjs) and a scratch folder is not reviewable evidence next month. Because this round already forces REGEN
  --write, adding the D6/D7 negative rows to instruments.test.cjs NOW costs no extra child re-opening; after T4 it would.
  Caveat from F2: a row in instruments.test.cjs is still run by nothing in CI, so the durable home question is really
  "which executing cell", not "which file". PM's call, as the builder says.
F4 (observation, no change asked) problem.test.mjs:3686 pins sleep: 2. That count discloses the residual double read in
  today-lanes.cjs bootFoodDays (L2 F2), exactly as brief 7.1 asks ("the accepted acquisition count ... at the integrated
  bytes"). A later refactor that reads options.sleep once at the right moment would fail the count while passing the lane
  identity assertion at :3681; when that day comes the count is the thing to re-pin, not a contract that sleep is read twice.
F5 (cosmetic) IR:144 calls the provenance ruling "B12"; IR:116 item 12 and the builder's report call it "STOP 12" /
  "PM ruling owed (B5 L5 LIMIT)". One name, please.
F6 (disclosure, my own slip) one Select-String over .github/workflows/*.yml (for F2) matched against soak.yml's bytes as
  well; the three patterns hit nothing there and nothing from it was printed, read or kept. No other *soak* path touched.
F7 (accuracy) IR:120 "CHAIN 94977a9 read for :810-:816 only" is correct for what the builder read; the chain has since
  moved to 85653f4 (:817). No :817 text bears on T3a; T0's re-read rule applies at the next PM step.

## 4. Claims accepted as reported (measured by the builder, consistent with what I could see, not re-run by me)
D-SPLIT-PARENT 3/3; Track A re-cut 6/6 EQUAL b35a48e and 4/4 EQUAL HEAD (ta-cmp-final.log); recon.cjs 6/6, 0 problems;
DOM/listener 7/7 + 7/7 at d7f6540 on the Windows-path scratch copy (D-S10R11-1 is real: the committed harness's ESM path
form is the only change); machine-settings-ui Windows red 52/66 -> green 65/66 with S14 guard-stopped in all three runs
(PM/CI only); M/R/N 299 (M 15, R 141, N 143 per mrn-rows.json, matching the report's split); D-GSS-PASSTHROUGH census
(acorn AST only, not scope; retirement stays a separate ruling); eslint-scope absent on every existing route, so D5 and the
six scope rows are a STOP (D-S10R11-2), correctly not paid by a substitute (brief 6.1). Guard refusals 3, all migrate.cjs
from the S14 build row; none in my run.

## 5. Named debts carried out of this review
D-S10R11-1 (PART2 Windows path form), D-S10R11-2 (no eslint-scope route; D5 + rows 12/13/14/16/32/33), D-S10R11-3
(instruments row 27 red at integrated bytes), D-S10R11-4 (D6/D7/D9 inputs in scratch), D-S10R11-5 (NEW, F2: the cut's
instrument cells are executed by no child and no workflow step; "CI-only" is not true of them), F1 (M/R/N census to be
re-stated at the final bytes before T4).

## 6. What the PM does next (per runbook T3a and Fable fix 6)
REGEN --write again at parent d7f6540 (the two product bytes moved), review the new S10.json, then T4 needles; nothing
in this diff needs a builder round 12 before that. The round-11 files stay uncommitted until the PM commits them.
