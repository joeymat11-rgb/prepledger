# REVIEW-S11-SEAL-T16-FABLE-l1 - S11 seal read at A (runbook T16, brief pm9-brief-s11-t16)

Reviewer: Claude Fable 5.1, static only, 2026-10-03. Role: REVIEWER; nothing decided or committed, no test, package or
exporter run. Helpers in %TEMP%\s11-t16-scratch\ (t16-read.cjs .. t16-read4.cjs: read-only git show / rev-parse /
diff-tree / merge-base / status with explicit paths, node sha256 over blob bytes, JSON compare). No src/, private,
ledger/, soak, EarnedPort, log, app.js or protected engine file was opened, listed or hashed (the protected five are
the runner's at T20). No private value, count, hash or prose appears here. Only this file and my scratch were written.

OBJECT: W = %TEMP%\earned-s11int, HEAD = A = 24982cf1eb92c092cfd53a70ea14269ec219d59e = origin/rebuild/b-s11-integration.
A's parent M1 04560046 = merge of cb04b0d (H, T6 again) + d01dac7 (chain tip, DECISIONS:890) = origin/rebuild/t2-client-core
(unmoved since M1). Lane history behind A: 01a7050 (H1) - 71dc0a8/5ab2780 (M1 first) - c55036c (A first, 93f55718) -
9a880d3 (copy.test.mjs fix) - c0f0039 (withdraws that artifact) - 48f1f20 (REGEN) - cb04b0d - 04560046 - A.

VERDICT: ACCEPT WITH NAMED DEBTS (D-T16S11-1 .. D-T16S11-7). Nothing in A, the spec, the runner or the artifact must
be changed before L5. What must be IN HAND before L5 is the PM's, not a defect: CI-1 at A green on both OS (T15, ids;
not among my inputs) and the T7-T16 record line of D6 carrying every red of BOTH chains (section 6).

## 1. Commit A and the artifact bytes (artifact = export)
- diff-tree M1..A: `A rebuild/m4/spec/acceptance-s11-native-load.json` only; subject "S11: proposed artifact (exporter
  s11 v1 s11-final-2, sha256 d5ac8ee6...)". The path is absent in M1's tree.
- git show A:<artifact>: 121136 bytes, sha256 d5ac8ee62d1d25191deda133479b2cce71581ee6c6e8ad06b9b64abdf79b372c = the
  export line's artifact64 (log %TEMP%\s11-export2.log, 3 lines, the one EXPORTED line read; chain=d01dac7b...49 =
  origin/rebuild/t2-client-core = M1's merged tip; node v24.19.0, git 2.53.0.windows.3). The lane disk copy and the
  scratch copy %TEMP%\earned-s11-profile-export-results\s11-final-2\acceptance-s11-native-load.json hash identically.
- Review envelope: scratch review-s11-native-load.json 61 B sha256 5c2811a4...4204cb30 = the export line's review64 =
  sha256 of JSON.stringify({version:1,status:"PENDING",receipt:null},null,2)+"\n" (recomputed; S10's value). NOT in
  A's tree; STILL ON THE LANE DISK as `?? rebuild/m4/spec/review-s11-native-load.json` (git status, explicit paths
  rebuild/m4 rebuild/lanes .github: that one entry, nothing else) - D-T16S11-1. Artifact: LF only, trailing LF, 2-space
  JSON; non-ASCII only under authorizations (the verbatim DECISIONS:60/:49/:874 lines, as S10.json and notes[7] say).

## 2. The artifact's content = what the runner derives from the spec at A
- spec.sha256 c97e468ca692240c3f4d5c8e57cd4e9ecc75fc1e408f8c1747d25687196b02da = sha256 of S11.json at A (132585 B;
  byte-identical at M1). runner.sha256 bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3 = b-package.cjs
  at A (317089 B) = SP.tooling.runnerSha256. All three equal the ci2 and full2 ENVELOPE PENDING line values.
- packageId M2-S11-NATIVE-LOAD, lanePackage S11, sourceBase edb8381e... = SP; parent = SP.parent.options[S10] (artifact
  42a3eb02, review 8d913278, receiptLedgerLine 837) plus reviewedCommit dcb73ec7, the runner's derived form.
- product: 320 keys in both, key sets equal both ways; every artifact post = SP.product[path].post (0 mismatches); 315
  re-hashed from the blobs at A equal the pin (0 mismatches), 5 skipped = the protected five. Roles edited 52 / carried
  248 / new 19 / superseded-by-child 1 (S10.json 0f55a704 -> 566539de), 0 released (the runbook's 51/249 is one older
  than :889, consistent). 0 product or executionPins keys under src/, private, soak or ledger/; 0 rebuild/coach paths.
- executionPins: 100 = the 97 distinct argv files + runner + spec + brief; all 100 re-hashed at A equal the pin; brief
  4f7d431f97fc16f7d0df043fcce9a8339d70e1cfb3801ec1e3447bb7cba05465 (352743 B) = the :875 sha and byte count.
- children: 39, JSON byte-identical to SP.children. gates 19 = coverage.run 10 (conformance, merge-differential,
  merge-laws, migrate-full, selftest, strict, witnesses-1/3/4/6) + superseded 9 under the five carriers exactly as
  :873 names them; supersessions.rulingLineSha256 76c110f6 = :873. authorizations (owner :60, contract :49, theme :874,
  review {cowork, "POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD", ACCEPTED}) identical to SP's. dIds [], laws {},
  carriedAcceptedIds D12,D33,D34,D35,D41,D43, witnessFlips [], carrierSuccessor null, privateLiveTriggered [],
  protectedSurfaces = S10's two names. No release or released key anywhere (SP has none).
- Nothing private: the only "private"/"golden"/"census" strings are the protectedSurfaces names, the verbatim :60 text
  and the evidence key "census":"runner-live-triggered-line"; no path value, no drive letter, no census target.

## 3. S11.json at A against the ledger and the third T5b record
- status BRIEF-ACCEPTED; brief.acceptedLedgerLine {875, cowork, line, lineSha256 3eae16a8} = :875 text and sha on
  refs/remotes/origin/rebuild/t2-client-core (890 lines). coverage.superseded.rulingLineSha256 76c110f6 = sha256(:873)
  (cowork (PM), GATE-SUPERSESSION ... five carriers ... nine gates ... RULED); every why cites :873 and names its
  s11-sup-* cell; authorizations.theme {874, cowork} = :874 text and sha e3cfb1c0 (... ACCEPTED); owner :60 ebb565c6
  and contract :49 f14f5e92 text-equal and sha-equal on the chain. All measured by me.
- D:886 FC09 declarations: native-load-replay.cjs 82cc19d5, test/native-load-replay.test.cjs 132f8b09 (in m4-import
  argv), lanes/d/p3-replay-all/native-load-import.test.mjs fc4c9fe6 (in d-replay-all argv), each new pre null; the 11
  moved posts :886 names by hash all match (native-load.cjs ab2a1ca8 new, FC03 80393920, FC12 ced43957, today-entry
  b3de1c31, today-bindings 3cb27682, source-admission 902df9ff, production-mapping c178c0bd, s3-portable-sources
  71e40171, replay-registry fe0b95a7, lift-correspondence a9640fa0, legacy-order-mapping 73bd6da7). D:889: copy.test.mjs
  pre 290a90ab post 78779d8f edited. Engine: 21 paths; native-load.cjs new, writers.cjs and progression.cjs edited.
- notes [8]-[14]: [8] D-BLOM carried; [9] D-S11-W6DIR; [10] D-S3-PORTABLE-STALE; [11] D-S11-NNT; [12] D-S11-LSP-PORT-
  PINS; [13] D-S11-COPY-PANEL-MOUNT alias D-COPYLOCK-TODAY-MOUNT ("named again in VERDICT-S11" on each); [14]
  OBSERVATION cites run 37108132701 attempt 1, O 3c8af05 = H 48f1f20 + the workflow, both jobs success, record
  2e2fe4d1, artifacts d595952f / 83c19752, and lists all 39 needles.
- %TEMP%\s11-t5b3\S11-T5B-OBSERVATION-37108132701.md hashes 2e2fe4d16ae8f11d72efb416548e80822b5f41d676627b4cfd2ba2d
  03e538fe5 = notes[14] = :890; Linux\s11-t5b-Linux.txt 8001 B d595952f... and Windows\s11-t5b-Windows.txt 8056 B
  83c19752... likewise. Parsed: 39 blocks, Linux 39/39 and Windows 39/39 status 0, signal none, error none; every
  published line is a (b1) '# <key> N' or the (b2) sentence (0 non-grammar lines); DERIVED FLAGS red none, withheld
  none. Each of the 39 needles begins exactly one published line on BOTH OS inside its own block (39 of 39):
  ui-pack-pins '# tests 121' (pass 118 Linux / 121 Windows), release-object '# tests 14', child 35 = the sentence cut
  after "; 2 named files move, each" (the S10 cut, T6 (e)), the rest '# pass N' incl. today-17 829 and FC12 478.
- No release block; artifact block = {acceptance-s11-native-load.json, review-s11-native-load.json} in both files.

## 4. The PM's FILTERed lines (%TEMP%\s11-t16-inputs.txt) against the runbook
- First chain (M1 5ab2780 / A c55036c, artifact 93f55718, spec 321967ee): ci0, ci1, full1 FAIL CHILD-REQUIRED-EXIT-
  ZERO EXIT=1; ci0b and ci1b PUBLIC CI EVIDENCE PASS EXIT=0, 39 children. Names only: all three reds are today-17
  copy.test.mjs:167 P1 (828/829), the build-dir race the PM ruled FIXED not re-run around (:888), fixed test-only at
  :889 (Fable l1 ACCEPT; old 2/40 and 2/100 red, new 0). That artifact was withdrawn at c0f0039; c55036c is an ancestor.
- Second chain (M1 04560046 / A 24982cf1): ci2 ENVELOPE PENDING artifact=d5ac8ee6 spec=c97e468c runner=bdbb8a93 | OPEN
  acceptance PENDING | PUBLIC CI EVIDENCE PASS | EXIT=0 | 39 children: every T12 expectation met. full2 REVIEW-PENDING
  mode=--full | ENVELOPE PENDING (same shas) | PRIVATE ORACLE PRESENT; verdict-only | FULL EVIDENCE: 10 of the 19
  re-executed, 0 carried, 9 SUPERSEDED under DECISIONS:873 (L2 = :873) | OPEN ... PENDING | POSTFIX PACKAGE REVIEW-
  PENDING: 1 open obligation(s) | EXIT=2 | 39 children | 10 LEGACY lines = predicted. ONE DIFFERENCE from the runbook's
  predicted T14 text: "ENVELOPE ABSENT" was predicted; full2 ran with the PENDING envelope on disk. The verdict path
  is the same (receipt null -> acceptance PENDING -> REVIEW-PENDING, no PASS word), nothing in A differs: D-T16S11-1.
- No T8 line exists for the second M1 (skippable when CI-M1 is green, D4); no CI-M1 / CI-1 ids for the second chain
  were given to me (:888 has the first CI-M1 37104337049); T17's "CI-1 green" clause is the PM's T15 read.

## 5. Custody of the exporter and the scratch output
- %TEMP%\export-s11-profile-v1.cjs: 14124 B sha256 9e6ac28c64a64989ce5c5fbf87c2a316474a0d50c081bc68dcd921c4b26d6958,
  byte-identical to e93b1ed:rebuild/lanes/astra/s11-exporter-v1/export-s11-profile-v1.cjs.txt; e93b1ed6c31c... =
  origin/rebuild/p-s11-exporter-v1 (3 files: port, containment selfcheck, word-diff vs S10 v1). :888 records the
  final-inputs containment read (Fable b3c7b565, D-S11EXP-1..3), selfcheck PASS 23, negative control REFUSED.
  Scratch s11-final-2\: exactly the artifact (d5ac8ee6) and the 61 B envelope (5c2811a4); nothing else. Custody holds.

## 6. Before L5 (the PM's T17 preconditions; none is a change to A)
1. CI-1 at A 24982cf1 read at T15 (rebuild-public and C font transport, both OS, "completed | success"; the S11-REGEN /
   W6 / C4B verdicts by name; ids) and CI-M1 at 04560046 likewise (D:627 sentence form).
2. The T7-T16 record line (D6) BEFORE L5: both M1s and both As, the withdrawn 93f55718 at c55036c, every red (ci0, ci1,
   full1; the :888 ruling; the :889 fix and its read), T8 skipped or run at 04560046, ci2 and full2 with EXIT, the
   envelope deviation (D-T16S11-1), the census target by Test-Path only, E1-E5 dispositions, this read's id.
3. L5 exactly: "- 2026-10-DD <U+00B7> cowork <U+00B7> POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD 24982cf1eb92c092cfd53a70ea
   14269ec219d59e rebuild/m4/spec/acceptance-s11-native-load.json d5ac8ee62d1d25191deda133479b2cce71581ee6c6e8ad06b9b
   64abdf79b372c ACCEPTED" (one line; prefix and terminal = authorizations.review). The chain tip is still d01dac7 =
   M1's merged tip, so the record line is :891 and L5 :892 if nothing else lands first; T19's diff V..M2 = DECISIONS.md.

## Named debts (VERDICT-S11 carries each by name; none is excused)
- D-T16S11-1 (record + hygiene): T14 full2 ran with the PENDING review envelope on the lane disk (ENVELOPE PENDING, not
  the predicted ENVELOPE ABSENT); same verdict path, EXIT=2. The file is untracked at A; T18 overwrites it with the
  ACCEPTED one; never commit it as PENDING; any re-export repeats T9 first (the clean step refuses untracked entries).
- D-T16S11-2 (record): every red of this seal in VERDICT-S11 and L6 per :835: ci0, ci1, full1 (today-17 P1 828/829),
  the first chain's artifact 93f55718 / spec 321967ee / A c55036c (withdrawn c0f0039), T5b run 1 (child 16 red, :877),
  the record-tool correction (:887), and the three T5b runs 37079669559 / 37102082564 / 37108132701.
- D-T16S11-3 (spec prose, stale, no edit): S11.json notes[0] "product bytes final at ee86334" and notes[5] "These are
  the final product bytes" predate FC09 (:886) and the copy.test.mjs fix (:889); notes[1] measures posts "at HEAD
  c0f0039" (the REGEN seat, one commit before H 48f1f20). Pins, children and notes[14] are current and re-hashed; an
  edit would move the spec sha and the export, so VERDICT-S11 names it instead.
- D-T16S11-4 (runbook stale, record): S11-SEAL-RUNBOOK.md 3b04bcd2 names s11-final-1, 321967ee, a96550dc, 37102082564;
  the chain re-ran from T7 under :888 with s11-final-2, c97e468c, 2e2fe4d1, 37108132701. The record line says so.
- D-T16S11-5 (= S10 D-T16-3): full2's conformance/selftest LEGACY lines run frozen reference bundles, not D-EPP-3's gates.
- D-T16S11-6 (rulings to carry by line): C2-FC09-BRIEF (:890 (1): brief 4f7d431f unamended, FC09 declared in S11.json
  only) and C2-COPY-BIND (:890 (2): THEME :874's dd197849 cite is history; native-load.cjs ab2a1ca8 and today-entry.mjs
  b3de1c31 carry the same approved copy; s10-copy-lock '# pass 11' both OS); the :890 (3) citation fix.
- D-T16S11-7 (record): the Fable/Astra review files of this chain (T3g exporter, b3c7b565 containment, the T6 reads at
  :887/:890, the :889 fix read, this file) are not in A's tree; T25 commits every one or the sealed record loses them.
- Inherited and S11 lists, by name, exactly as runbook section 3 enumerates them: S10's D-T16-1..5, D-EPP-3, D-EPP-4,
  D-BLOM, D-GSS-TIMER, D-SPLIT-LISTEN, D-PATH-NODE, D-NODE-MODULES-HOME (E1, now a junction to a separate physical
  copy, :888), the released pair as S10's; the FC09 debts of :878-:885; D-S11EXP-1..3; the :889 D1/D2/D5; notes[8]-[13].

## AAR (6 lines)
1. Verified: A adds only the artifact; artifact/spec/runner at A = d5ac8ee6 / c97e468c / bdbb8a93 = the export line and the ci2/full2 lines; 315+100 pins re-hashed equal; 39 children identical; :873/:874/:875/:60/:49 sha-matched on the chain; 39 needles each begin one published line on both OS in the third T5b record; exporter and scratch custody hold.
2. Found: T14 ran with the PENDING envelope on disk (untracked at A), a deviation from the runbook's predicted ENVELOPE ABSENT text with the same verdict path.
3. Found: two spec notes still call ee86334 the final product bytes (history since :886/:889); the pins are right, the prose is not.
4. Not measured by me: CI-M1/CI-1 at the second chain (not in my inputs; T15 is the PM's), the private census target, the protected five.
5. Rule check: no src/, private, ledger, soak, log, EarnedPort, app.js or protected engine content read; git reads carried explicit paths; node hashed and parsed only the named files; nothing edited or committed.
6. Verdict ACCEPT WITH NAMED DEBTS D-T16S11-1..7; L5 may be appended once CI-1 at A is read green and the T7-T16 record line precedes it.
