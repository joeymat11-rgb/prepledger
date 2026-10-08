# REVIEW-S11-SEAL-T16-FABLE-l2 - S11 seal read at A, restarted chain (runbook T16, brief pm9-brief-s11-t16b)

Reviewer: Claude Fable 5.1, static only, 2026-10-08. Role: REVIEWER of package M2-S11-NATIVE-LOAD; I built none of it. Nothing
decided, edited or committed; no test, package or exporter run. Helpers in %TEMP%\s11-t16-scratch\ (l2-brief.ps1, l2-read.cjs ..
l2-read4.cjs + .out.txt): read-only git rev-parse / log / diff-tree / show / status / ls-tree / grep with explicit paths, node
sha256 over blob bytes and JSON compare of the named files only. No src/, private, ledger/, soak, EarnedPort, joe-data, port-real,
raw b-package log, app.js or protected engine file was opened, listed or hashed (the protected five skipped by path). No private
value, count, hash or prose appears here. CI-M1 37793721986 and CI-1 37798943653 were still running at this read: not read by me.

OBJECT: W = %TEMP%\earned-s11int, HEAD = A = 834dd3e43e169f6a28abd6b52e6ee3966edb1d74 = origin/rebuild/b-s11-integration = local
rebuild/b-s11-integration. A's parent M1 6b6940755232af9a51abca460620247c3db3b162 = merge of 509398e (H, T6 again) +
d6d4f632f9890387645129798efd126103d51702 = origin/rebuild/t2-client-core = the chain tip (:894 is its last line; 894 lines +
trailing LF). Lane behind A: d7b4cc2 - 246d969 (:893) - 3ab0aab (F) - 9bd6706 (W) - b02a368 (REGEN) - 509398e (H) - M1 - A.
git status with explicit paths rebuild/m4, rebuild/lanes, .github: EMPTY (no untracked envelope this time).

VERDICT: ACCEPT WITH NAMED DEBTS (D-T16S11b-1 .. D-T16S11b-8, section 7). Nothing in A, the spec, the runner or the artifact
must change before L5. What must be IN HAND before L5 is the PM's, not a defect (section 6): CI-1 at A green on both OS (the PM
gates L5 on it separately), CI-M1 likewise, and the T7-T16 record line of D6 carrying every red of all three passes and the
aborted first seal.

## 1. Commit A and the artifact bytes (artifact = export)
- diff-tree M1..A: `A rebuild/m4/spec/acceptance-s11-native-load.json` only; subject "S11: proposed artifact (exporter s11 v1
  s11-final-3, sha256 bde69f15...)"; the path is absent in M1's tree. The aborted seal's files are absent at A (review-s11-
  native-load.json, tooling/receipts/S11.json, VERDICT-S11.md); coach/engine-revision.cjs:25 = "M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699".
- git show A:<artifact>: 121134 bytes, sha256 bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4 = the export
  line's artifact64 (%TEMP%\s11-export3.log: one EXPORTED PENDING line + "EXIT=0"; chain=d6d4f632... = M1's merged tip =
  origin/rebuild/t2-client-core; node v24.19.0, git 2.53.0.windows.3). The lane disk copy and the scratch copy %TEMP%\earned-
  s11-profile-export-results\s11-final-3\acceptance-s11-native-load.json are byte-identical to A's blob.
- Review envelope: scratch review-s11-native-load.json 61 B, sha256 5c2811a4...4204cb30 = the export line's review64 = sha256
  of JSON.stringify({version:1,status:"PENDING",receipt:null},null,2)+"\n" (recomputed). NOT in A's tree and NOT on the lane
  disk (the l1 deviation D-T16S11-1 did not recur: T14 full5 printed ENVELOPE ABSENT as the runbook predicts).
- Artifact bytes: LF only, trailing LF, no CR, 2-space JSON; non-ASCII only on lines 179/185/191 (the verbatim :60/:49/:874
  authorization lines); no drive letter, no path under private/soak/ledger/src; "private"/"golden"/"census" occur only as
  privateLiveTriggered [], the evidence label "census":"runner-live-triggered-line" (x5), the :60/:49 verbatim text, the public
  product path rebuild/lanes/c/today-split-spike/census.cjs and the two protectedSurfaces names. Nothing private.

## 2. The artifact's content = what the runner derives from the spec at A
- spec.sha256 728c31961a748d86c16a724dd76d4a4b98ce82ea29898c5d8e5b1fb666584190 = sha256 of S11.json at A (132775 B; byte-
  identical at M1). runner.sha256 bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3 = b-package.cjs at A
  (317089 B, byte-identical at M1) = SP.tooling.runnerSha256. All three equal the ci4 ENVELOPE PENDING line values.
- packageId M2-S11-NATIVE-LOAD, lanePackage S11, version 1, sourceBase edb8381e... = SP; parent = SP.parent.options[S10]
  (artifact 42a3eb02, review 8d913278, receiptLedgerLine 837) plus reviewedCommit dcb73ec7, the runner's derived form.
- product: 320 keys both sides, key sets equal both ways; every artifact post = SP.product[path].post (0 mismatches); 315 re-
  hashed from the blobs at A equal the pin (0 mismatches), 5 skipped by path = the protected five. Roles edited 54 / carried
  246 / new 19 / superseded-by-child 1 (S10.json 0f55a704 -> 566539de). 0 keys under src/, private, soak or ledger/. The :894
  REGEN moves are at their recorded posts: rebuild.yml edited 10177a0f (pre e3b9c9d1), support.mjs 3eaf32d5 (pre f72c6176),
  gym.test.mjs 464d6fb9 (pre 79aa531e), problem.test.mjs ccce9127, setup.test.mjs ad1574f9; the old posts 0c861be9/f72c6176/
  79aa531e survive only as pre values. copy.test.mjs 290a90ab -> 78779d8f (:889). The three FC09 declarations of :886 are
  role new, pre null: native-load-replay.cjs 82cc19d5 (in m4-import argv with its test 132f8b09), lanes/d/p3-replay-all/
  native-load-import.test.mjs fc4c9fe6 (in d-replay-all argv); the eleven :886 moved posts all found at their hashes. Engine:
  21 paths; native-load.cjs new ab2a1ca8, writers.cjs and progression.cjs edited, as :873/:874 say.
- executionPins: 100 keys (97 distinct argv files + runner + spec + brief 4f7d431f); all 100 re-hashed at A equal the pin.
- children: 39, JSON byte-identical to SP.children; no null/PENDING/short/multiline needle. gates 19 = coverage.run 10
  (conformance, merge-differential, merge-laws, migrate-full, selftest, strict, witnesses-1/3/4/6) + superseded 9 under the
  five carriers exactly as :873 names them; supersessions.rulingLineSha256 76c110f6 = sha256(:873), measured. authorizations:
  owner {60}, contract {49}, theme {874}, review {cowork, "POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD", ACCEPTED}, identical to
  SP's. dIds [], laws {}, carriedAcceptedIds D12,D33,D34,D35,D41,D43, witnessFlips [], carrierSuccessor null,
  privateLiveTriggered [], protectedSurfaces = S10's two names. No release/released key (SP has none).
- No stale id of the aborted passes is in the spec or the artifact: 0 hits for 24982cf1, d5ac8ee6, 6ead5e9e, ":892", 04560046,
  93f55718, c55036c, s11-final. The runner locates a receipt by its own lineSha256 (b-package.cjs :3564, :3782-3783, names and
  line numbers only), so the withdrawn :892 line in history cannot collide with a new L5.

## 3. S11.json at A against the ledger and the fourth T5b record
- status BRIEF-ACCEPTED; brief {4f7d431f..., acceptedLedgerLine 875, cowork, lineSha256 3eae16a8} = :875 text and sha on
  origin/rebuild/t2-client-core. coverage.superseded.rulingLineSha256 76c110f6 = sha256(:873); every why cites :873 and its own
  s11-sup-* cell; theme {874, cowork} = :874 (sha e3cfb1c0, ... ACCEPTED); owner :60 ebb565c6 and contract :49 f14f5e92 text-
  and sha-equal on the chain. All measured by me.
- notes [8]-[14]: [8] D-BLOM carried; [9] D-S11-W6DIR; [10] D-S3-PORTABLE-STALE; [11] D-S11-NNT; [12] D-S11-LSP-PORT-PINS;
  [13] D-S11-COPY-PANEL-MOUNT alias D-COPYLOCK-TODAY-MOUNT ("named again in VERDICT-S11" on each); [14] OBSERVATION cites run
  37124738303 attempt 1 on obs/s11-4, O 05f8d6d = H b02a368 + the workflow, both jobs success, the withdrawn obs/s11-3 push
  45f17e8, record 07783ff8, artifacts 531adced / 748f31c0, all 39 needles (= the Fable T6 re-cite read RECITE4-l1, ACCEPT).
- %TEMP%\s11-t5b4\S11-T5B-OBSERVATION-37124738303.md 27988 B sha256 07783ff8b56d6854ecc877cb7486a491749c61b8b2bc150a5d5e3be6ec84
  48c3 = notes[14] = :894; Linux\s11-t5b-Linux.txt 8031 B 531adced... and Windows\s11-t5b-Windows.txt 8050 B 748f31c0...
  likewise; record RUN rows equal. Parsed: 39 S11-OBSERVE/END blocks per OS, 0 text outside blocks, block numbers 1..39 in
  children order, status 0 / signal none / error none on both OS for 39/39; 610 published lines, every one a '# <key> N'
  grammar line or the ENGINE FILES DIFFERENTIAL sentence (0 non-grammar, no tail, no withheld marker); DERIVED FLAGS red none,
  withheld none. Each of the 39 needles begins exactly one published line on BOTH OS inside its own block (39 of 39): ui-pack-
  pins '# tests 121' (pass 118 Linux / 121 Windows), release-object '# tests 14', child 35 = the sentence cut after "; 2 named
  files move, each" (the S10 cut, T6 (e)), the rest '# pass N' incl. today-17 829, d-replay-all 48, native-load-fc12 478.
- No release block; artifact block = {acceptance-s11-native-load.json, review-s11-native-load.json} in both files. The record's
  DIFFERENCES section names exactly the five :894 product moves and the withdrawn obs/s11-3 push: consistent.

## 4. The PM's FILTERed lines (%TEMP%\s11-t16b-inputs.txt) against the runbook
- ci3 (T12 at M1, artifact bde69f15 on disk): ENVELOPE PENDING artifact=bde69f15 spec=728c3196 runner=bdbb8a93 | BLOCKED
  BASELINE-ESBUILD-MISSING | EXIT=2 | 0 children: a RED, environment (root node_modules absent after the PC-side cleaner of
  :894; junction restored to a complete install). Recorded, not excused; this pass's own red, in the record line with its EXIT.
- ci4 (T12 rerun at M1): ENVELOPE PENDING (same shas) | OPEN PENDING | PUBLIC CI EVIDENCE PASS | EXIT=0 | 39 children: as predicted.
- full5 (T14 at A, review absent, private census junction): REVIEW-PENDING mode=--full | ENVELOPE ABSENT ... no PASS word |
  PRIVATE LIVE-TRIGGERED none | PRIVATE ORACLE PRESENT; verdict-only | FULL EVIDENCE 10 of 19 re-executed, 0 carried, 9
  SUPERSEDED under DECISIONS:873 | OPEN ... not sealed | POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s) | EXIT=2 | 39
  children; line kinds identical to full2's. Exactly the runbook's predicted T14 text this time, ENVELOPE ABSENT included.
- T8 at this M1: no line (skippable when CI-M1 is green, D4; the first pass ran it, :888). CI-M1/CI-1: the PM's T15 read.

## 5. Custody of the exporter and the scratch output
- %TEMP%\export-s11-profile-v1.cjs: 14124 B sha256 9e6ac28c64a64989ce5c5fbf87c2a316474a0d50c081bc68dcd921c4b26d6958 = the
  e93b1ed port blob (rebuild/lanes/astra/s11-exporter-v1/export-s11-profile-v1.cjs.txt; e93b1ed = origin/rebuild/p-s11-exporter-
  v1); :888 records its containment read (Fable b3c7b565, D-S11EXP-1..3), selfcheck PASS 23, negative control REFUSED. Scratch
  s11-final-3\: exactly the artifact (bde69f15) and the 61 B envelope (5c2811a4); s11-final-1/-2 beside it are history. Holds.

## 6. Before L5 (the PM's T17 preconditions; none is a change to A)
1. CI-M1 37793721986 at M1 and CI-1 37798943653 at A read at T15 (rebuild-public and C font transport, both OS, "completed |
   success"; the S11-REGEN / W6 / C4B verdicts by name; ids, D:627 sentence form). Any red is a STOP, recorded.
2. The T7-T16 record line (D6) BEFORE L5, as :891 did: this M1 and A, export s11-final-3, ci3 RED with cause and EXIT, ci4,
   full5 with EXIT, T8 skipped, the census target by Test-Path only, E1-E5 dispositions, this read's id, and the history it
   restarts from: :888 (ci0, ci1, full1), :891-:892 (the first seal, L5 for 24982cf1 / d5ac8ee6, withdrawn), :893 (CI-2 STOP:
   two windows timeout cancellations, ubuntu today-17 red 37117862366), :894 (F, W, REGEN, hunter 2 of 28, obs/s11-3, slips).
3. L5 exactly: "- 2026-10-DD <U+00B7> cowork <U+00B7> POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD 834dd3e43e169f6a28abd6b52e6ee3966edb
   1d74 rebuild/m4/spec/acceptance-s11-native-load.json bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4
   ACCEPTED" (one line; prefix and terminal = authorizations.review). With the tip at d6d4f63 (:894), the record line is :895
   and L5 :896 if nothing lands first; T18's receipt cites that line, never :892.

## 7. Named debts (VERDICT-S11 carries each by name; none is excused)
- D-T16S11b-1 (record): the first seal attempt is part of this package's record: L5 :892 and receipt 6ead5e9e for A 24982cf1
  stay in history unmerged (V, M2, C1-C4, 4949d82, d7b4cc2); VERDICT-S11 and L6 name them, :893 and :894 by line (:835).
- D-T16S11b-2 (record): every red of all three passes by name: ci0, ci1, full1 (today-17 P1, :888); CI-2 37114462157 windows
  CANCELLED, 37117862366 ubuntu FAIL + windows CANCELLED (:893); hunter 37120960396 2 of 28 (P-MEASURE (a), gym A2); ci3
  BLOCKED BASELINE-ESBUILD-MISSING (this pass); T5b run 1 child 16 (:877); the :887 record-tool correction.
- D-T16S11b-3 (hygiene, record): three export scratch roots exist; T11/T18 use s11-final-3 only. The predecessor's D-T16S11-1
  (PENDING envelope on disk at T14) did not recur: closed for this pass, kept as first-seal record.
- D-T16S11b-4 (spec prose, stale, no edit): notes[0] "product bytes final at ee86334" and notes[5]/[6] "final product bytes"
  predate :886, :889 and the :894 race fixes; the :894 Fable l2 asked for the notes[5] sentence to be re-authored at REGEN and
  it was not; notes[1] "at HEAD 9bd6706" is right. An edit moves the spec sha and the export, so VERDICT-S11 names it instead.
- D-T16S11b-5 (runbook stale, record): S11-SEAL-RUNBOOK.md 3b04bcd2 names s11-final-1, 321967ee, a96550dc, 37102082564 and
  timeout 30; this pass ran with s11-final-3, 728c3196, 07783ff8, 37124738303, timeout 60. The record line says so.
- D-T16S11b-6 (carried from l1, unchanged): D-T16S11-2, -5 (conformance/selftest LEGACY lines run frozen bundles = S10
  D-T16-3), -6 (C2-FC09-BRIEF, C2-COPY-BIND, the :890 (3) citation fix), -7 (every Fable/Astra review file of the chain,
  these T16 reads and the s11-tmfix reads included, is outside A's tree; T25 commits them or the sealed record loses them).
- D-T16S11b-7 (the timeout fix, record): rebuild.yml :28 30 -> 60 sized from evidence; D-TM-1 paid in the :25-27 comment (read
  at A); D-TM-2/-3 record; P-MEASURE D1/D2 paid in v2; the today-17 l2 RISKY list and the deliver() no-handoff note stay named.
- D-T16S11b-8 (environment, record): the PC-side cleaner (:894) removed root node_modules and ~240 tracked files; both restored
  (junction; git checkout from HEAD; status empty); no product byte moved, shown by the 415 re-hashes.
- Inherited and S11 lists by name, exactly as runbook section 3 and the brief rev8-rev11 PART B notes enumerate them.

## AAR (4 lines)
1. Verified: A adds only the artifact; artifact/spec/runner at A = bde69f15 / 728c3196 / bdbb8a93 = the export line and the ci4/full5 lines; 315+100 pins re-hashed equal; 39 children identical; the :894 REGEN moves and the FC09 declarations at their hashes; :873/:874/:875/:60/:49 sha-matched; 39 needles each begin one published line on both OS in the fourth record; exporter and scratch custody hold; the aborted seal's files are gone from A and no stale id survives in spec or artifact.
2. Found: ci3 BLOCKED BASELINE-ESBUILD-MISSING, this pass's environment red, must be in the record line; the l1 envelope deviation did not recur; the spec's "final product bytes" prose is three REGENs stale (pins right, prose not; record only).
3. Not measured by me: CI-M1/CI-1 of this pass (running), the private census target, the protected five, the raw logs. Rule check: no src/, private, ledger, soak, log, EarnedPort, joe-data, app.js or protected engine content read; git reads carried explicit paths; node hashed and parsed only the named files; nothing edited or committed; ASCII, LF.
4. Verdict ACCEPT WITH NAMED DEBTS D-T16S11b-1..8; L5 may be appended once CI-1 at A (and CI-M1) read green and the T7-T16 record line precedes it.
