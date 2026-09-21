# CLAUDE REVIEW: TODAY-SPLIT part 2 (the cut, with the S-R31 / S-R32 fix round), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; no hand in the cut, its fixes or its Astra reviews.
Asked at DECISIONS:653, classes (a) moved writers and (b) S10 sealed files. Run on Joe's word "review".
Head b35a48e35a1f3e3c278c377934794a32b632535b; part-2 product base 33cc25fc45639788700e434896f4ab941cc8ca66; fix range
c02b001e3646555050594c39856bfd31f2d48590..head. Owner's PC, Node v24.19.0, PC clock 2026-09-21 15:00 to 15:06 ET.
Spec rebuild/lanes/c/TODAY-SPLIT-SPEC.md sha256 re-measured 239cd2c2acaf7fdf87049eb4e7fac13e2183e8c4756a21ed2452dedf3cb994f9
(equal to :653); I did NOT read the spec whole: scope was held to DECISIONS:626 and :633, both read whole.
## VERDICT
ACCEPT WITH NAMED DEBTS. The cut is a faithful move, the source door closes L3-B1, the banner now says only what I
could count. I carry L4's D1 to D7 and D9 to the tickets :633 names, unchanged, and add one small debt.
## PRODUCT HUNKS (DECISIONS:439), 33cc25fc..head: 5 files under rebuild/m3, +1164 -823
today-app.cjs (2627 to 1972 lines), today-lanes.cjs (new, 985), build.mjs (8), test/food.test.mjs (6),
test/problem.test.mjs (5). In the fix range the ONLY product change is six banner lines of today-lanes.cjs (numstat
6/6); today-app.cjs is blob 57b7ad2c at c02b001e and at the head, sha256 d1e1f1e7e69a7ed1..., the hash :633 records.
HOW I READ 1800 CHANGED LINES HONESTLY: my own move check (%TEMP%\claude-epp\split-move.cjs, no project instrument):
every head line that sits in a run of 3 or more lines byte-equal and in order to the BASE today-app.cjs is "moved";
every other line is written out and READ BY EYE against the base line it replaced.
 today-lanes.cjs: 639 lines in 58 moved runs; 347 other lines, all read: the banner, 3 requires, the factory line,
   7 declarations, the gesture guard, 34 region labels, 3 one-line regions equal to base :392 :454 :767, the declared
   handle rewrites (screen to painter.screenNow(), render to painter.repaint, mountToken to painter.token(),
   clearSleepDraft to painter.clearDraft, sleepDraft to sleepDraftHeld), and the frozen return block.
 today-app.cjs: 1768 lines in 96 moved runs; 204 other lines, all read: each is a base binding turned into a
   facade getter, a base assignment turned into a hook, or addEventListener turned into hooks.listen.
 base lines in neither file: 231, all read, each paired by eye with its successor above. I found no pair whose two
   sides differ in meaning. 8 base lines appear in both files (blank and brace lines).
 Consistent with the banner's 34 regions / 679 lines / 39 rewritten rows; not an independent proof of those counts.
## WHAT ELSE I MEASURED
1. THE BANNER (S-R32). My own literal scanner (split-lits.cjs): 127 string literals in today-lanes.cjs; 10 authored
   ("use strict", 3 require paths, "function" twice, the guard's refusal name, the two guarded writer names, and the
   one empty string at :957); 117 moved. Twelve copy constants in the factory signature. As the banner says.
2. THE SOURCE DOOR (S-R31), read whole in cut.cjs and gen-witness.cjs: the raw blob is hashed before any anchor
   resolves, the same buffer is what gets cut, gen-witness refuses a source that is not the named ref's blob.
3. IS s9 THE RIGHT PIN? The input nobody measured. Blob ids of the three cut sources: at the s9 ref da9f868 and at
   today's S9 lane head 15ab6e83 they are IDENTICAL (today-app ea98aef6, today-model 6a146ff9, gym-app 48bf0531), and
   33cc25fc's today-app.cjs is that same ea98aef6. The chain tip c705307a holds older blobs (bc91374d, 487ea1a1),
   which are exactly the blobs at the fork point ad8ced07: the chain has not touched these files since the S9 lane
   left it. So when S9 lands, the S10 parent holds the pinned source, and the committed product is the cut of it.
   That stays true only while S9 part 2 and the chain leave those three files alone; see D-SPLIT-PARENT.
4. instruments.test.cjs at the head, import chain read first (:645: node builtins, resolve.cjs, git show of the
   table's own Today files at its two named refs; nothing else): 53 tests, 33 pass, 20 fail, exit 1, worktree clean.
   All 20 failures are one cause: Cannot find module acorn. The instruments look for a parser under CENSUS_INSTRUMENT
   (default a cloud path) and I found no acorn on this PC in the places I may look; I installed nothing.
   Of the 12 rows named S-R31 or S-R32, 10 pass here (every door refusal, both gen-witness rows, the L3 plant at both
   refs, the banner row); the 2 that need the parser (product equality after a re-witness; the unpinned report row)
   are L4's numbers, not mine. L4's 47/53 is NOT reproduced by me.
## NAMED DEBTS (mine)
D-SPLIT-PARENT S10 BRIEF: re-measure the three source blob ids at the actual S10 parent before sealing. If any
  differs from regions.json sourceBlobs.s9, the door will refuse, correctly, and the order is: new named ref,
  visible re-witness, re-cut, byte equality and the DOM cells again. Say it in the brief so a refusal on seal day
  reads as the instrument working. PAYS: the S10 brief.
D-SPLIT-LISTEN hooks.listen(el, type, fn) and unlisten drop a third addEventListener argument without a word.
  Measured: the base file has 27 addEventListener calls and none passes one, so nothing is lost today. But the
  fence forces every later look ticket through this shim, and a dropped { once: true } on a save button is a
  listener that fires again. Smallest shape: refuse a fourth argument by name inside listen, with one fence row.
  PAYS: TODAY-OUTCOME-TYPE or the S10 brief, whichever the PM names.
## NOT DONE
No DOM replay, no reconstruction with a parser, no product regeneration, no Today suites, CI, seal, linux, phone.
build.mjs gains one required input; the two test hunks retarget a source read to today-lanes.cjs; nothing weakened.
No protected path, private fixture, ledger directory, old-app source or real measurement was opened or reached.
