# S11 T6 re-cite: fourth T5b run 37124738303

Tree C:\Users\joeym\AppData\Local\Temp\earned-s11int, HEAD b02a368, branch rebuild/b-s11-integration.
Pre-check: rev-parse --short HEAD = b02a368; git status --short empty (after the PM's `git checkout -- .`).
Only edit: rebuild/lanes/b/tooling/packages/S11.json notes[14], left uncommitted. No commit, push, dispatch or tests.

## Inputs
- record S11-T5B-OBSERVATION-37124738303.md sha256 07783ff8b56d6854ecc877cb7486a491749c61b8b2bc150a5d5e3be6ec8448c3 (matches brief)
- Linux\s11-t5b-Linux.txt sha256 531adced36905ddd6e09dcfee859f90fb93f864ae414a98563891ac3e8d360c0
- Windows\s11-t5b-Windows.txt sha256 748f31c0233a1d6243ae194f1b2d13ef0d2815fe7adca8f70fb3d30f11878431
- both artifact sha256 values are the ones the record's RUN section cites; each record block equals the artifact block byte for byte
- record rows: 39/39 per OS have status 0, signal none, error none, tail none, green; withheld none; red none

## 39-needle comparison (script t6tools\retake.cjs; full output t6tools\retake-out.txt)
Rule: exactly one line of the needle form per OS inside the child's published block, byte-identical on Linux and Windows
('# pass N'; '# tests N' for 20 and 22; for 35 the one grammar sentence cut after "; 2 named files move, each").
Never taken from a tail or a withheld block.
Every retaken needle EQUALS children[i].needle at HEAD: 39/39.
 1 today-17 "# pass 829" | 2 measure-hermetic "# pass 11" | 3 s4-real-day "# pass 15" | 4 a0-journeys "# pass 23"
 5 d-plan-edit "# pass 90" | 6 m4-import "# pass 74" | 7 m4-import-production "# pass 28" | 8 d-import-retract "# pass 13"
 9 d-admission-swap "# pass 4" | 10 d-replay-measure "# pass 9" | 11 d-capture-start "# pass 14" | 12 food-live-save "# pass 6"
 13 w7-import "# pass 35" | 14 w6-host-seams "# pass 9" | 15 w6-local-source "# pass 31" | 16 d-replay-all "# pass 48"
 17 d-port-admission "# pass 35" | 18 d-real-shape "# pass 62" | 19 sealed-inventory-fence "# pass 62" | 20 ui-pack-pins "# tests 121"
 21 reference-closure "# pass 5" | 22 release-object "# tests 14" | 23 today-carry "# pass 9" | 24 passphrase-normalize "# pass 29"
 25 w6-local-import "# pass 22" | 26 f2-land "# pass 81" | 27 epp-proposed-pick "# pass 9" | 28 d-epp-2-capture "# pass 13"
 29 today-split-fence "# pass 404" | 30 s11-sup-source-carriers "# pass 4" | 31 s11-sup-inherited-carriers "# pass 3"
 32 s11-sup-defect-witnesses "# pass 3" | 33 s11-sup-writers-differential "# pass 3" | 34 s11-sup-second-gate "# pass 3"
 35 s11-engine-files-differential "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this package's declared product, all byte-identical to the parent; 2 named files move, each"
 36 s10-copy-lock "# pass 11" | 37 native-load-fc12 "# pass 478" | 38 w6-local-source-commit "# pass 9" | 39 w6-local-today-journey "# pass 51"
Child 20: Linux '# pass 118' (skipped 3), Windows '# pass 121' (skipped 0); '# tests 121' is the line equal on both, as before.

## notes[14] change (same form as cb04b0d)
Replaced only the run citation: run 37124738303 attempt 1, "the fourth T5b run", branch obs/s11-4, head O 05f8d6d = H b02a368
plus the observation workflow only; H b02a368; job s11-observe (ubuntu-latest) success (2026-10-03T13:00:43Z to 13:14:03Z)
and job s11-observe (windows-latest) success (2026-10-03T13:00:43Z to 13:20:03Z); record name and sha256; both artifact sha256.
Added one sentence: "A first push of the same O on branch obs/s11-3 (45f17e8, stale reused commit message) was withdrawn before any record."
Rules text, DECISIONS refs and the 39-child needle list are unchanged. The new note is ASCII only.

## Diff proof (script t6tools\diffproof.cjs)
- disk == JSON.stringify(obj,null,2)+LF: true; no CR; non-ASCII count 87 at HEAD and 87 on disk (pre-existing, none added)
- notes[14] differs: true; deepStrictEqual(HEAD, disk) with notes[14] masked: true; key order equal: true
- HEAD with disk notes[14] substituted and re-serialised == disk bytes: true
- line-level: 2186 lines each, the only differing line is 2183 (notes[14])
- git status --short: ` M rebuild/lanes/b/tooling/packages/S11.json` only; git diff --stat: 1 file, 1 insertion, 1 deletion
- S11.json sha256 at HEAD 7d27bb7f060cf6391328726041ea854103918b1e40c8fb972d3c20d25723470d
- S11.json sha256 NEW (disk) 728c31961a748d86c16a724dd76d4a4b98ce82ea29898c5d8e5b1fb666584190

## S11-REGEN DRY (W11 root, git on PATH; exit 0; full output t6tools\regen-dry.txt)
Command: node rebuild/lanes/b/S11-REGEN.cjs --parent edb8381ea6a9f5373c8519ee7e9d7d8a303c2369 --receipt-line 837
It did not refuse the dirty disk. Last lines:
  product: 320 paths {"edited":54,"carried":246,"new":19,"superseded-by-child":1}; 0 entr(ies) would change
  parent.options[0]: artifact sha256 42a3eb020557..., review sha256 8d9132787373..., receiptLedgerLine 837
  runnerSha256 at HEAD bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3
  PENDING census on disk: 0 value(s)
  notes regenerated: PRODUCT MAP [1], PARENT-UNPINNED PATHS [2], EXECUTION PIN SUPERSEDED [3]
  DRY RUN: nothing written
Result: 0 changes, PENDING 0, as expected.

## Note
At the first retry, the dirty status listing printed three rebuild/m3/soak-stub/*.png paths. They were not opened or read.
Helper scripts and outputs are in C:\Users\joeym\AppData\Local\Temp\s11-t5b4\t6tools (outside the tree).
