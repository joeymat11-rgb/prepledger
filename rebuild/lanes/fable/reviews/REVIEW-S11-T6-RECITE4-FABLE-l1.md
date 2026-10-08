# REVIEW S11 T6 re-cite (fourth T5b run 37124738303) - Fable l1

Tree C:\Users\joeym\AppData\Local\Temp\earned-s11int, HEAD b02a368 (verified). Independent reviewer; did not write the change.
Helper scripts/outputs: s11-t5b4\fable-check1.cjs, fable-check2.cjs, fable-check3.cjs, fable-regen-dry.txt (outside the tree). Tree edited: nothing.

## (1) Only notes[14] differs
- git status --porcelain: ` M rebuild/lanes/b/tooling/packages/S11.json` only; diff --stat 1 file, +1/-1.
- Parsed HEAD:S11.json (git show) and disk; masked notes[14]; JSON.stringify equal: TRUE. notes[14] itself differs: TRUE.
- Disk bytes == JSON.stringify(obj,null,2)+LF: TRUE; no CR; single trailing LF; new notes[14] is printable ASCII.
- Non-ASCII bytes: 209 at HEAD, 209 on disk (pre-existing elsewhere in the file, none added).

## (2) Facts in the new note vs primary sources
- Record S11-T5B-OBSERVATION-37124738303.md sha256 07783ff8...8448c3 (computed; matches note and brief).
- Linux artifact sha256 531adced...d360c0, Windows 748f31c0...878431 (computed; match note and the record's RUN section).
- Record RUN section: run 37124738303, attempt 1, repo joeymat11-rgb/prepledger, workflow s11-observe.yml, push, branch obs/s11-4,
  head O 05f8d6d, H5 b02a368; s11-observe (ubuntu-latest) success 13:00:43Z-13:14:03Z; s11-observe (windows-latest) success
  13:00:43Z-13:20:03Z; red none; withheld none; 39/39 per OS. All equal to the note.
- git: 05f8d6d parent is b02a368 and diff b02a368..05f8d6d adds .github/workflows/s11-observe.yml only (sha256 788acbd1...,
  byte-identical to c2688c4's), so "O = H plus the observation workflow only; H b02a368" is exact.
- Workflow run conclusions/times were read from the record, not from GitHub (no network use by this review).

## (3) Independent re-derivation of the 39 needles
- Both artifacts parsed (LF only, 39 S11-OBSERVE/END blocks each, no text outside blocks, no tail or withheld marker in any block,
  every block status=0 signal=none error=none). Child names in the blocks equal children[i].name for all 39.
- Rule applied: the one line of the child's form present byte-identically in both OS blocks ('# pass N'; '# tests N' for 20 and 22;
  for 35 the ENGINE FILES DIFFERENTIAL sentence cut after "; 2 named files move, each"); form occurs exactly once per block.
- Result: 39/39 derived needles equal children[i].needle on disk (and HEAD, since children is unchanged). Child 20: Linux '# pass 118',
  Windows '# pass 121', so '# tests 121' is the only equal line, as the note says.

## (4) The withdrawn obs/s11-3 sentence
- 45f17e8 exists locally: parent b02a368, tree cdfe9d7d == tree of 05f8d6d, workflow sha256 788acbd1 (same bytes); its subject is the
  third-run message ("on H 48f1f20"), i.e. stale/reused. No obs/s11-3 branch remains locally or on origin. The record's DIFFERENCES
  section says the same and adds that its runs 37124717283/37124717314 are not this record's run. Sentence is accurate and harmless.
- Wording quibble, not a debt: 45f17e8 is a distinct commit with the same tree as O, so "the same O" means "same content", not same id.

## (5) S11-REGEN DRY (tree root, git+node on PATH; exit 0; tree unchanged afterwards, status still only S11.json)
  product: 320 paths {"edited":54,"carried":246,"new":19,"superseded-by-child":1}; 0 entr(ies) would change
  parent.options[0]: artifact sha256 42a3eb02...50ae8, review sha256 8d913278...a2a0a, receiptLedgerLine 837
  runnerSha256 at HEAD bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3
  PENDING census on disk: 0 value(s)
  notes regenerated: PRODUCT MAP [1], PARENT-UNPINNED PATHS [2], EXECUTION PIN SUPERSEDED [3]
  DRY RUN: nothing written

Precedent cb04b0d also touched only S11.json (+1/-1); this edit has the same shape. Hard limits respected (no private/, src/, ledger/,
soak, engine files opened; no tests run).

VERDICT: ACCEPT
