# REVIEW-S11-VERDICT-C2-FABLE-l2 - T22 read of rebuild/lanes/b/VERDICT-S11.md at C2 (restarted chain, package M2-S11-NATIVE-LOAD)

File under review: W11\rebuild\lanes\b\VERDICT-S11.md, untracked on disk at HEAD = C1 1c300907501ccb5e62bb2f760369dbccdcfdedc0,
sha256 2b0a468c20a4b460ac41055a0b45826647fbc029d3772c299882b7b0de46d199, 90138 B, 849 lines; byte-identical to
%TEMP%\s11-verdict2\VERDICT-S11.c2.md (same sha256). Reviewer: Fable (independent; did not write the file). Read-only: git show/
log/diff-tree/rev-parse/merge-base/diff on named paths and commits, Get-FileHash, node one-liners hashing and parsing the named
files. No src/, conform/private, ledger/, soak, EarnedPort, port-real.log, joe-data, astra-job, app.js or protected engine content
was opened, listed or read; no recursive search over W11; no test or b-package run; nothing edited under W11; nothing committed.

VERDICT: ACCEPT WITH NAMED DEBTS (D-T22S11b-1 .. D-T22S11b-4, section 8). Every hash, commit id, line number and lineSha256 the
file names reproduces from the sources; the T20 line is the FILTERed log's in substance and claims nothing stronger; every red of
both attempts is recorded and none excused; every T16 l2 debt and every runbook section 3 item is carried by id with a reason or
stated PAID and true; nothing private; ASCII, LF, no U+2013/U+2014/U+00B7; no doubled prefix, no stale first-attempt value
presented as this chain's evidence. The T24 byte-identity step is AVAILABLE on this file: it names the artifact, spec, runner and
receipt sha256 in full (lines 66-68 and 76) and the receipt id's 16-hex form (line 79). Nothing found would make T24 fall back
to FULL. One omission is asked to be fixed before C2 (D-T22S11b-1, exact text in section 8); the rest are record or prose.

## 1. Every hash and commit id against the sources
- Artifact rebuild/m4/spec/acceptance-s11-native-load.json: verdict line 66 bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4
  (121134 B). Measured: Get-FileHash on the W11 disk at C1 = the same; git show 834dd3e:<path> hashed through node = the same,
  121134 B; = receipt sealedRun.artifactSha256; = the T10 export line (verdict 222-223; :895); = L5 :896; = t20f.txt ENVELOPE
  AUTHORIZED artifact=.
- Spec rebuild/lanes/b/tooling/packages/S11.json: verdict line 67 728c31961a748d86c16a724dd76d4a4b98ce82ea29898c5d8e5b1fb666584190
  (132775 B). Measured: disk at C1, git show 6b69407:<path> and fd3637f:<path> all = the same, 132775 B; = receipt
  sealedRun.specSha256; = the artifact's own spec.sha256; = t20f.txt "spec 728c3196..." and the ci3/ci4 ENVELOPE PENDING lines.
- Runner rebuild/lanes/b/tooling/b-package.cjs: verdict line 68 bdbb8a938a9f84715ba129fd51157ecb1127b07a1499cd8dd00df9e79b514dd3
  (317089 B). Measured: disk, 6b69407 and fd3637f all = the same, 317089 B; = receipt sealedRun.runnerSha256; = the artifact's
  runner.sha256; = t20f.txt and the ci3/ci4 lines; = the first attempt's runner (the verdict's "unchanged" claim holds).
- Receipt rebuild/lanes/b/tooling/receipts/S11.json: verdict line 76 48574b8d8f252e87c56de8b1159dae008865343571d1b31cfa05cbed70624064
  (40726 B). Measured: git show 1c30090:<path> hashed through node = the same, 40726 B; Get-FileHash on the disk file = the same;
  = the SEALED RUN NEXT STEP sha256 in t20f.txt. Receipt id computed as packageId + '@' + sha256[0:16] =
  M2-S11-NATIVE-LOAD@48574b8d8f252e87 = the verdict's form at lines 79 and 827 ("followed by the first 16 hex of <64>").
  Receipt fields: version 1, lanePackage S11, packageId M2-S11-NATIVE-LOAD; sealedRun.artifactSha256/specSha256/runnerSha256 =
  the three above; envelopeKey ACCEPTED:bde69f15...:834dd3e4...:82eaabf7...; verdictFile rebuild/lanes/b/VERDICT-S11.md; product
  320 entries (= "over 320 pinned product files"), 0 under rebuild/coach (so C3 does not void it, as line 828 says).
- Review envelope rebuild/m4/spec/review-s11-native-load.json: verdict line 55 6388db96f429e498b7c78bfd5ebb3c04ae08b7550ee274ef0b0ee0c466a41f5b.
  Measured: disk and HEAD blob = the same, 484 B; content {status ACCEPTED, receipt {commit 82eaabf7..., path rebuild/DECISIONS.md,
  line = the :896 text, lineSha256 654fc120...}} = %TEMP%\s11-t17c.json (R 82eaabf7..., lineNumber 896, same lineSha256).
- C1 1c300907501ccb5e62bb2f760369dbccdcfdedc0: parent fd3637fbb2e1ed000b3acc844b5c85553cc03b77 (M2); show --stat = that one file,
  334 insertions; message "M2-S11-NATIVE-LOAD: sealed-run receipt of T20 (sha256 48574b8d...)". HEAD = C1.
- M2 fd3637f: parents f501ecd (V) and 82eaabf7 (R); diff-tree V..M2 = rebuild/DECISIONS.md only (verdict 60, STOP-S11-BASE 723).
- V f501ecd: parent 834dd3e (A). A 834dd3e43e169f6a28abd6b52e6ee3966edb1d74: parent 6b69407 (M1); diff-tree M1..A = the artifact
  only (verdict 230). M1 6b6940755232af9a51abca460620247c3db3b162 = merge of 509398e937398380312d04629fef36e7b2309c49 (H) and
  d6d4f632f9890387645129798efd126103d51702 (the :894 commit), message "S11: merge tip d6d4f63 into the lane (DECISIONS:563)"
  (verdict 5-7, 219-220). H 509398e parent b02a368 (REGEN of record). R 82eaabf7 = origin/rebuild/t2-client-core now, message
  "DECISIONS:896 L5 ...", and merge-base --is-ancestor R HEAD exit 0 (verdict 7-8, rule=ancestor). sourceBase
  edb8381ea6a9f5373c8519ee7e9d7d8a303c2369 exists (the S10 terminal commit) = S11.json sourceBase = the artifact's sourceBase.
- diff 4949d82..6b69407: 12 paths, 0 under rebuild/engine (verdict 182-184, 305-306; names not printed).
- lineSha256 values re-derived from git show 82eaabf7:rebuild/DECISIONS.md (LF, 896 lines): :874 e3cfb1c0... (THEME, verdict
  18-19), :875 3eae16a8... (BRIEF, 25-26), :873 76c110f6... (33-34), :60 ebb565c6... and :49 f14f5e92... (45-46), :896 654fc120...
  (the envelope). All six equal the spec's authorizations/brief/coverage.superseded values and the verdict's text.
- Parent block: S11.json parent.options[0] and the artifact's parent = 42a3eb02... / 8d913278... / receiptLedgerLine 837 /
  reviewedCommit dcb73ec7 (verdict 41-44). S11.json: status BRIEF-ACCEPTED, 39 children, product 320, 15 notes, notes[14] cites run
  37124738303; no release/released key in spec or artifact (verdict 39-40). Brief sha 4f7d431f... and 352743 B = :875.
- Ledger ids used by the verdict (checked against :862-:896 as read in full): 35859dc/0b8d074 (:870/:871); dd197849, 3c862537 ->
  a860376d, b8e8eb3d (:872); 84f8421 H5, adafcc8 O, 37079669559/37079669266 (:876-:877); ab2a1ca8, c178c0bd, 73bd6da7 (:881);
  f6c531b, 22ac52b, 7cf4a87, 9b6d2aa and the nine FC09 read ids (:882-:885); the three FC09 files and 18 posts (:886); 7b1668c,
  8bd959f, 37102082564/37102082581, 339ce90a -> 645f4555, a96550dc, 01a7050, 321967ee (:886-:887); 5ab2780/71dc0a8, 37103576075,
  37104337049, 93f55718, c55036c, b3c7b565, e93b1ed, ci0/ci0b/ci1/ci1b/full1 (:888); 290a90ab -> 78779d8f, 9a880d3, c0f0039,
  48f1f20, 3c8af05, 37108132701/37108132699 (:889); 2e2fe4d1, cb04b0d, the three :890 rulings (:890); 04560046/d01dac7,
  37109597259, d5ac8ee6, c97e468c, 24982cf1, 37110080030, 3834565d (:891); the :892 text; bf51eb1, 0f30ed86, a5a92ea, 84f5bca,
  f4fae8a, 6ead5e9e... (64 hex equal), 763432e, ff626435, 9e98a68, 2b5d657, 4949d82, 37114462157, d7b4cc2, 37117862366, 1175 s,
  1229 s, 340779 ms, 29.5/29.3 min, 37119545918/37119550420 (:893); 3ab0aab, 37120960396, 37124719703, 9bd6706, b02a368,
  7d27bb7f, 37124738303, 05f8d6d, 07783ff8, 45f17e8, 37124717283/37124717314, 509398e, about 240 files, 13:30Z (:894);
  37798943653, e82d85a4, the ci3/ci4/full5 line kinds, 834dd3e (:895). Every one matches. 10177a0f... (rebuild.yml post) = the
  receipt's product entry for .github/workflows/rebuild.yml (sampled). e82d85a4 = sha256 of REVIEW-S11-SEAL-T16-FABLE-l2.md on
  disk (first 8 hex). No invented value found.

## 2. T20's terminal line against %TEMP%\s11-verdict2\t20f.txt
t20f.txt (the PM's FILTERed T20 lines, prefix "B PACKAGE S11 " dropped): POSTFIX M2-S11-NATIVE-LOAD AUTHORIZED mode=--full | SEAL
BASE ON THE TIP; origin/rebuild/t2-client-core is at 82eaabf and that commit is an ancestor of this HEAD (DECISIONS:135 (4),
rule=ancestor) | ENVELOPE AUTHORIZED artifact=bde69f15<64> reviewed at 834dd3e4<40>; receipt base 82eaabf7<40>; spec 728c3196<64>
and runner bdbb8a93...[cut] | PRIVATE LIVE-TRIGGERED none | AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT; the FULL run
with the private census is required (DECISIONS:136 (3)) | PRIVATE ORACLE PRESENT; verdict-only reporting | FULL EVIDENCE: 10 of
the 19 original gates re-executed, 0 carried by successor children that executed in this run and 9 SUPERSEDED under
DECISIONS:873 | SEALED RUN RECORDED receipts/S11.json; artifact=bde69f156c4f spec=728c31961a74 runner=bdbb8a938a9f over 320
pinned product file(s) | SEALED RUN NEXT STEP commit ... write its sha256 48574b8d...<64> into rebuild/lanes/b/VERDICT-S11.md |
POSTFIX PACKAGE PASS M2-S11-NATIVE-LOAD | EXIT=0 | CHILD OBSERVED exit 0 count: 39 | LEGACY PASS/OBSERVED count: 0.
Verdict terminal 7 (line 234): SEAL BASE ON THE TIP 82eaabf, ENVELOPE AUTHORIZED bde69f15 reviewed at A, PRIVATE ORACLE PRESENT,
FULL EVIDENCE 10 + 9 SUPERSEDED under :873, SEALED RUN RECORDED receipts/S11.json (artifact=bde69f156c4f spec=728c31961a74
runner=bdbb8a938a9f over 320 pinned product files), 39 CHILD OBSERVED, POSTFIX PACKAGE PASS M2-S11-NATIVE-LOAD, EXIT=0.
Every clause is in the log in that order; the 12-hex forms and the count 320 are the runner's; no LEGACY count is claimed (the
FILTER's count is 0; see D-T22S11b-2); "AUTHORIZED mode=--full" is the heading "T20 full at M2" and the PASS word is the
runner's (lines 14-15). Line 78 "equal to the sha256 the runner printed on its SEALED RUN NEXT STEP line" = the NEXT STEP sha. The
T14 line (231-232) = s11-full5 in t16b-inputs.txt (REVIEW-PENDING mode=--full, ENVELOPE ABSENT, PRIVATE ORACLE PRESENT, FULL
EVIDENCE 10 + 9 SUPERSEDED, 39 CHILD OBSERVED, POSTFIX PACKAGE REVIEW-PENDING, EXIT=2); ci3 (226-228) and ci4 (229) = s11-ci3 and
s11-ci4 (BLOCKED BASELINE-ESBUILD-MISSING, EXIT=2; ENVELOPE PENDING bde69f15, 39, PUBLIC CI EVIDENCE PASS, EXIT=0). The T10 line
(222-223) = :895's export line. No stronger claim anywhere; the first attempt's full3/full4 lines (122-127) are under the HISTORY
heading and line 218 says none of them is evidence for this seal.

## 3. Every red of both attempts (ledger :888-:896), recorded and none excused
Required by :888, :891, :893, :894, :895 and the T16 l2 read's D-T16S11b-2; found in the verdict at the lines given:
- T8 ci0 EXIT=1 and ci0b, T12 ci1 EXIT=1 and ci1b, T14 full1 EXIT=1 (:888): 92-99; their one cause copy.test.mjs:167 P1 828/829
  and the :888 "fixed, not re-run around" ruling: 100-103; artifact 93f55718 withdrawn at c0f0039: 103; Every red item 6: 395-396.
- T14 full2 EXIT=2 with ENVELOPE PENDING instead of ABSENT (:891, D-T16S11-1): 117-119, 397-398, 487-490. CI run 37109597259
  cancelled by concurrency, "not red": 251, 397-398 (as :891 states it).
- CI-2 37114462157 windows CANCELLED (timeout, step 16 after step 13 1175 s); re-run 37117862366 ubuntu FAILURE (today-17 exit 1,
  340779 ms) and windows CANCELLED (1229 s); "RED (a cancelled required job is not green)"; the :893 rulings (1)-(3): 130-141;
  item 8: 399-401.
- Hunter 37120960396, 2 reds in 28 (ubuntu P-MEASURE (a) week 12; windows gym A2 null textContent), each "RECORDED, NOT EXCUSED",
  mechanisms, fixes in F 3ab0aab, hunter 37124719703 28/28: 143-169; the four fixed sleeps found by the sweep: 157-159; item 9:
  402-403.
- Seal cells red before REGEN on the uncommitted edits (setup re-pin 151, boundary P-MEASURE (g)): 186-188; item 10: 404-405.
- T5b run 1 child 16 red on both OS (:877) and its FC09 cure: 278-280, 329-331; item 3: 388-389; every "summary withheld" block by
  child and OS: 299.
- PM-seat T4 candidate reds of :876 (3) and d-plan-edit 89/90: item 2, 385-387. I15 calibration 2/4 (D-S11-I15CAL): item 1, 384.
  FC09 seat reds (S4/2 clock flake, LOM-S6, the page-bundle seat offset E1): item 4, 390-392. Review REJECTs of rounds 31-34 and
  FC09: item 5, 393-394.
- Restarted chain: ci3 BLOCKED BASELINE-ESBUILD-MISSING, "RECORDED, NOT EXCUSED: environment", the cleaner and the junction:
  226-228, 205-213, item 11: 406-407. T23/T24/CI-2 of this chain: "PENDING at C2, filled at C4" and "on L6": 236-239, 830, item
  12: 408-409.
- Red-first cells are listed as the method, not as defects (380-383), as :835 and the runbook's "every red-first cell recorded as
  such" require. The stale-message slips (2b5d657/4949d82; obs/s11-3 45f17e8) and the oracle-shim single run: 195-204, 410-452.
Nothing in :888-:896 that is red, cancelled or BLOCKED is missing, and no red is written as excused; each carries its EXIT or its
run id. The FILTER's "LEGACY PASS/OBSERVED count: 0" lines are not reds (see D-T22S11b-2).

## 4. Debts: the T16 l2 read (D-T16S11b-1..8) and runbook section 3
- D-T16S11b-1..8: each present by id at lines 465-485 with the T16 read's own substance (first attempt in history, :893/:894 by
  line; every red of three passes; three export roots, D-T16S11-1 closed for this pass; notes[0]/[5]/[6] stale, no edit; runbook
  3b04bcd2 stale values vs this chain's; D-T16S11-2/-5/-6/-7 restated; the timeout fix with D-TM-1 paid and D-TM-2/-3 carried;
  the cleaner, restored, 415 re-hashes). D-T16S11-1..7 restated at 486-506. D-S11EXP-1..3 at 507-511 and 660-663. Distfix D1, D2,
  D5 at 512-519 with D3/D4 disposed as :889 says.
- Runbook section 3 EVIDENCE: artifact/spec/runner/receipt (66-68, 76); the T5b records (run 4 of record with artifacts, record
  sha, flags, differences: 284-292; runs 1-3 with their records and the 339ce90a -> 645f4555 correction: 278-283); the :877/:887
  lines (278-280); every cancellation and the HTTP 403 pipeline runs (258-261, 420); the job read's (vii)/(viii) findings as
  D-L4-INPUTS / D-S11R9-2 (633-636); exporter custody e93b1ed / 9e6ac28c / s11-final-3 / chain40 (262-274). CI-1 and CI-2 are
  named (244-249); CI-M1 of THIS chain and the CI run at H are NOT named: D-T22S11b-1.
- EVERY RED and EVERY INCIDENT: section 3 above and verdict 410-452 (hard-limit incident :883, exclusions :884 (3)/:885 with the
  symlink residual, HTTP 403, the dangling junctions, the record-tool correction, the two PC outages, the reboot, job 161, the
  runbook analyst's listing, the :849/:851/:847/:840/:842 items, the first T22 builder's listing, the restart slips, the T6
  re-cite builder's three image path names, the P-MEASURE reviewer's stray log, the draft builder's reads at 448-452).
- INHERITED FROM S10 (791-813): D-BLOM (815-823), the released pair as S10's (794-795), D-EPP-3's four owed gates and D-EPP-4's
  red half (369-374, 796), D-GSS-*, GSS-LATE-CLEAR, GSS-G5-DIAGNOSTIC, D-GSSFIX-1/-2 (797), D-SPLIT-LISTEN and the split debts
  (798-799), the ci0 red of :835 and D-T16-1..5 (800), D-PATH-NODE (801-802), D-NODE-MODULES-HOME live again twice (803-805),
  D-S9SEAL-1..4 (806-811), D-CF-1..3 and the rest as VERDICT-S10 lists them (812-813).
- BRIEF T22 LIST and SECTION 8 (5) HANDOFF LIST (618-643, 644-697, 743-790): D-L12-CUSTODY PAID (772); D-L14-CI (674-676),
  D-L12-CONFIG (670-672), D-L14-HOST-MUTANTS (628-629), D-L14-CALIBRATION (673), D-L14-OWNER (626-627), D-L14-LEGACY-NULL PAID
  (771); D-R22L3/L4/L5, D-L15-HOST-SHOW, L16 B1-B6 and the round 24-28 items PAID (772-775); D-L15-EQUIVALENCE with the live
  equivalents (677-680); the capture-class limit (571-573); D-S11-W6DIR (607-608), D-S3-PORTABLE-STALE (609-611), D-S11-NNT
  (612-613), D-S11-80-CIHOME new (614-615), D-S11-LSP-PORT-PINS (615-617); D-S11-A1/A2 PAID (782); D-S11-COPY-PANEL-MOUNT alias
  D-COPYLOCK-TODAY-MOUNT (604-606); D-S10EXP-3 = D-S11T3g-1 (660-663); D-S11T3g-2 (691-692), D-S11T3g-3 PAID (762); the copy
  approvals with the :872 re-bind and the FC09 moves (47-49, 359-364); D-R24-SPEC-SILENT (570); S24-H08 = L17-B6 (773); T3M-1/-2
  (598-599); D-S11T3k-3 verified again at M1 6b69407 (600-603); D-S11T3c-4, D-S11T3d-1/-2, D-S11T3e-1/-3, D-S11T3l-2/-3 (683-696),
  D-S11T3d-3 and D-S11T3e-2 PAID (765-766); the Astra 146/148 items (782, 787); TODAY17-HARDEN outside S11 (630-632); D-R25C-5 and
  the POST-S11 SPEC CLARIFICATION LIST as one item (566-569); D-S11R8-1 (637), D-S11R8-2..4, D-L3-CITES/-FILL, L4-B1/B2, L5-B1,
  D-S11R9-1, D-S11R10-1/-2, D-T5B-1 paid (783-786); D-L4-INPUTS/-MEASURE/-DEPLOY with owner steps (633-636); H-05 = SS-19 and
  D-R28A-1 (565); H-06/H-07 (567); the stale PROPOSED comments (639-641); VECTOR-COUNT-STUCK (619), SET_COUNT_BASIS (620),
  D-L12-ISSUANCE (621-622), D-R13-LEGACY-OVER-NULL-ASK and D-R13L1-3 (623-625), D-L13-TYPED-C2 (667-669), the 17 deferred files
  (681-682), RESIDUAL (iv) and D-L14-RECOVERY (702-710).
- NATIVE-LOAD AT THE S11 HEAD (547-574): D-R33-1..5, D-R33F-1..5, D-R33C-1..6, D-READER-ONLY, D-R34F-1..3, D-R34C-1..3,
  D-L25-M08/M09, D-L26-SCOPE, R8 EFFECT_CONFLICT accepted, D-R32C-3..4, D-R32F-1..4, D-R31F-2..4, D-R31C-1..5, D-HSW2-1, D-HSW-3/-4,
  D-R29*, D-R30*, D-L21-*, D-S11R11-1/-2, D-L6-STOP-SCOPE, D-R24-SPEC-SILENT; D-R31F-1 PAID (779-781) and D-R32C-1/-2 closed (778)
  as :863-:865 and :870 record them.
- S11 RESEAL / FC09 (575-617): D-S11-I15CAL (576), D-S11-FC10 (578), D-S11-EN3-COPY (579), D-S11-EXIT-CODE (581), Astra L3 D1/D2
  (583-586), the workout_facts split, F9 superseded-only, the resolver refusal (587-588), the symlink walkers (589-590), the T29
  open question (591-592), Fable/Claude l3 N-items (593-597); D-S11T3iF-1..4, D-L3-MULTI/-SPEC81/-T1-CARRY accepted under the
  :866 bar (653-659); the :879 PRODUCER_REVISION move and (i-b) refused (322-327); the pin-search :63 correction (318-321); the
  FC09 reads with their ids (343-347); STOPs closed, carried or open by design (711-741).
- Restart items (520-546): D-TM-2 (521), D-TM-3 (523), the RISKY list with its reason (525-535), the :2174 sentence (536), the
  deliver() note (539), the owner's two 2026-10-08 product rulings queued for the next slice, no S11 byte (542-546, 740-741).
- PAID (743-790), each checked against its cited line: FC09 closures (:885), the P1 race (:889), the timeout and race fixes (:894
  (1)/(2)), D-TM-1, P-MEASURE D1/D2, the cleaner restoration (:894/:895), E1 (:888), E3, E4, D-S11T3g-3, D-S11EXP-2 (:888 text),
  D-S11T3d-3 (:887 T6 (e)), D-S11T3e-2 (runner unchanged, section 1), D-S11T3k-3, the STOP closures (:887, :872, :870), D-R31F-1
  (:863-:865), D-S11-A1/A2, the copy-lock needle (notes[14]), C2-FC09-BRIEF/C2-COPY-BIND (:890). "Paid in the hosted rebuild job
  only when CI-1 and CI-2 of this chain are green on both OS" (749-750) is the honest form. Nothing is stated as paid that the
  sources show unpaid.

## 5. Nothing private
Searched the file for census values, counts, hashes or prose and for owner body measurements: no number, weight, intake, step,
sleep or body value; "weight(s)" occurs three times (833, 545, 847) only as the lift-load sense of the athlete section; "census"
six times (4, 77, 127, 231, 238, 686) only as the junction's name, its Test-Path-only handling and the brief's census-identity
rows; no gym name, no decrypted-export mention, no personal series (the :895 owner-analysis sentence is not reproduced). The
PRIVATE ORACLE line is quoted only as "PRIVATE ORACLE PRESENT". The private census target is never named by path. Holds.

## 6. ASCII, LF, no U+2013 / U+2014 / U+00B7
Bytes: 90138; non-ASCII bytes (> 0x7F): 0; CR (0x0D) bytes: 0; LF line ends; 849 lines plus a terminal LF. The ledger's middle
dot is described, not reproduced (56-58). Holds.

## 7. Internal consistency
- Doubled prefixes: "DECISIONS:DECISIONS", "D:D:", "::": 0 occurrences.
- Stale first-attempt values: 321967ee (97, 428, 478), c97e468c (115), 6ead5e9e (11, 83, 124, 126, 139, 467, 827), 24982cf1,
  d5ac8ee6, 84f5bca, "LEGACY 10"/"LEGACY PASS 10" (118, 123), full2/full3/full4: every occurrence is inside FIRST SEAL ATTEMPT
  ABORTED, the HISTORY bullet of CI, the runbook-stale debts or the coach constant's "withdrawn" clause; none is presented as this
  chain's evidence (218: "none of them is evidence for this seal").
- The CI-2 sentence (246-249): "the hosted rebuild run started by the push of C4 (a file cannot name the run that tests its own
  commit). Its run id and both runners' conclusions are named on the ... ledger line (L6) ... This file is not edited after that
  run." Honest; consistent with the runbook's T26/T28 and with terminal 8 and the coach constant being filled at C4, not here.
- The three PENDING-at-C2 fields (63, 236, 830) are the T22 read id, the T24 line and the T23 counts, by design (runbook T25).
- The receipt-id form (79, 827), the count 320 (71, 82, 234), the 12-file diff (182-184, 305-306), notes[14]'s run id (292-297,
  601-602), the "same seven citations resolve at M1 6b69407" claim (600-603, consistent with :894/:895 appending only), the
  "415 re-hashes" (485, from the T16 l2 read), "S11.json 7d27bb7f at b02a368 and 728c3196 at H" (:894 (4), :895): all consistent.
- Observation for the PM, not a defect of the file: git status in W11 at C1 shows rebuild/coach/engine-revision.cjs MODIFIED on
  disk (the :25 literal already reads M2-S11-NATIVE-LOAD@48574b8d8f252e87, the correct C3 value) beside the untracked verdict.
  C2 must be VERDICT-S11.md alone (runbook T22 "and nothing else"): stage that one path; do not commit with -a.

## 8. Named debts (D-T22S11b-n); none is excused
- D-T22S11b-1 (omission, record; FIX BEFORE C2): the restarted chain's own CI-M1 at M1 6b69407, run 37793721986, and the CI run at
  H 509398e, run 37793594764, both "completed success, rebuild-public and C font transport on ubuntu and windows (windows 38m38s
  and 22m00s under the 60-minute limit)" (:895), are not named anywhere in the file (grep 37793: 0). Runbook section 3 EVIDENCE
  requires "CI-M1, CI-1, CI-2 run ids" and the L6 shape carries "CI-M1 at M1 <7> run <id> <conclusion>". Line 242's "Between F
  3ab0aab and H 509398e, :894 names no hosted rebuild run" is true of :894 but reads as if no hosted run at timeout 60 preceded
  CI-1, while the 38m38s windows job at H is the strongest measurement for D-L4-MEASURE (it exceeds the old 30-minute limit and
  stayed under 60). Both runs are green, so this is not a missing red. Exact fix:
  line 243, old:  "  `37124719703` (28/28) and the fourth T5b `37124738303` (39/39 on both OS)."
  line 243, new:  "  `37124719703` (28/28) and the fourth T5b `37124738303` (39/39 on both OS). The first hosted rebuild runs at
  `timeout-minutes: 60` are this chain's own (`:895`): CI at H `509398e` run 37793594764 and CI-M1 at M1 `6b69407` run
  37793721986, each completed success, rebuild-public and C font transport on ubuntu and windows (windows rebuild-public 38m38s
  and 22m00s)."
  line 244, old (tail): "It is the rebuild run of record with rebuild-public at `timeout-minutes: 60`; its windows job"
  line 244, new (tail): "It is the rebuild run of record at A (windows rebuild-public 31m59s); with the 38m38s at H, these"
  line 245, old:  "  time is the measurement that keeps the 60 sized from evidence (D-L4-MEASURE)."
  line 245, new:  "  windows job times are the measurements that keep the 60 sized from evidence (D-L4-MEASURE)."
  (Line wrapping of the new text is the builder's; content as given. After the fix, re-hash and give me the new sha256.)
- D-T22S11b-2 (prose, record; no fix required): lines 372 and 499 speak of "the LEGACY conformance and selftest lines of T14 and
  T20" (restated from S10's D-T16-3 and the first attempt's T20, which :893 recorded as "10 LEGACY PASS"). The PM's FILTER for
  this chain prints "LEGACY PASS/OBSERVED count: 0" for ci3, ci4, full5 and T20, and the line-kind summary of full5 has no LEGACY
  kind. The verdict's own terminals 4-7 claim no LEGACY count (correct). Before L6's "<j> legacy PASS" the PM should take the count
  from the T20 log itself (pass/fail lines only), since the runner is byte-identical to the first attempt's and the first attempt
  reported 10; if the T20 log has no LEGACY lines, L6 says so and the two sentences stand as S10's inherited wording.
- D-T22S11b-3 (cosmetic): the T7-T16 record line is referred to three times (59, 221, 479) without its number; it is
  `DECISIONS:895` (the line before L5 :896) and is known at C2. Optional fix at 221: "the T7-T16 record line before L5." ->
  "the T7-T16 record line `DECISIONS:895` before L5." Also, :895 calls this chain's T14 run "full5"; the verdict's terminal 6 says
  "T14 full at A" (no number) while the first attempt's runs are numbered full1-full4; harmless.
- D-T22S11b-4 (environment, record): the modified rebuild/coach/engine-revision.cjs on the W11 disk at C1 (section 7, last
  bullet). Not a defect of the file; C2 stages VERDICT-S11.md alone and C3 then commits the coach literal with the T23 counts.

## AAR (4 lines)
1. Verified: the four 64-hex values (artifact, spec, runner, receipt) and the review envelope's sha256 against the W11 disk, the Git blobs at A/M1/M2/C1 hashed through node, the receipt's own sealedRun fields, the artifact's spec/runner blocks, t20f.txt and t17c.json; receipt id M2-S11-NATIVE-LOAD@48574b8d8f252e87; C1 parent M2, one file; A parent M1, one file; V..M2 DECISIONS.md only; R ancestor of HEAD; six lineSha256 values re-derived from :49/:60/:873/:874/:875/:896; every ledger id of :862-:896 the verdict cites.
2. Found: the restarted chain's two green hosted runs (CI-M1 37793721986, CI at H 37793594764) are missing from CI (fix given); the LEGACY prose at 372/499 is inherited wording while this chain's FILTER counted 0 LEGACY lines (PM to take the count from the T20 log for L6); :895 never named; the coach literal already modified on disk beside the untracked verdict.
3. Not measured by me: the raw run logs, the private census target, the protected five, CI-2 (future), the coach and production-pair suites (T23), the 320 pinned product shas one by one (T24's job). Rule check: no src/, conform/private, ledger/, soak, log, EarnedPort, joe-data, astra-job, app.js or protected engine content read; names of forbidden paths not printed; git reads carried explicit commits and paths; nothing edited under W11; nothing committed; this file ASCII, LF.
4. Verdict ACCEPT WITH NAMED DEBTS D-T22S11b-1..4; D-T22S11b-1's text fix before C2, then C2 = VERDICT-S11.md alone; T24 byte-identity is available on the file as it stands and stays so after the fix (the four sha256 lines are untouched).
