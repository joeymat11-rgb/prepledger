# REVIEW-S11-VERDICT-C2-FABLE-l1 - T22 read of VERDICT-S11.draft.md (M2-S11-NATIVE-LOAD, runbook T22)

Reviewer: Claude Fable 5.1, static only, 2026-10-03. Role: REVIEWER; nothing edited or committed; no test, package or
exporter run. Tools: read-only git (show, rev-parse, log -1, diff-tree, diff --stat, diff --name-only counted only,
merge-base --is-ancestor, cat-file -e, branch -r --list) and node sha256/JSON over the named blobs, from one helper
%TEMP%\s11-verdict-scratch\t22-fable-check.cjs. No src/, private, ledger/, soak, EarnedPort, log, app.js, .tmp or
protected engine content was opened, listed or hashed; the runner was grepped for seven line shapes only. No private
value, count, hash or prose appears here. Only this file and my scratch were written.

OBJECT: C:\Users\joeym\AppData\Local\Temp\s11-verdict-scratch\VERDICT-S11.draft.md, sha256
f144b0f1219e2212aa8885485e9d643c71d5e2d46da633cb531e4f972263e3ed (68546 B, 660 lines, LF only), read in full.
W11 HEAD = C1 f4fae8a91a95c830705831c00d2289ff97209ab3 on rebuild/b-s11-integration; origin/rebuild/t2-client-core
rebuild/DECISIONS.md 892 lines (lines 862-892 read, nothing else of the ledger).

VERDICT: ACCEPT WITH NAMED DEBTS. One correction is owed before C2 (section 4, item 1); the rest are optional.

## 1. Hashes, commit ids, run ids, line numbers (judge (1))
- Artifact d5ac8ee6...b372c 121136 B, spec c97e468c...02da 132585 B, runner bdbb8a93...4dd3 317089 B: re-hashed by me
  from git show at HEAD, at A 24982cf1 and at C1; all equal the draft. Artifact spec/runner blocks carry the same two;
  spec tooling.runnerSha256 = runner; spec sourceBase and artifact sourceBase = edb8381e...2369.
- Receipt rebuild/lanes/b/tooling/receipts/S11.json at C1 f4fae8a: sha256
  6ead5e9e87c0ec849cde25f95e07f4db374b8fd7a4a732ad7a18cc4d73d26af1, 40726 B, byte-equal at HEAD; keys version,
  lanePackage S11, packageId M2-S11-NATIVE-LOAD, sealedRun {artifactSha256, specSha256, runnerSha256 = the three above,
  envelopeKey ACCEPTED:<artifact64>:<A40>:<R...>, verdictFile rebuild/lanes/b/VERDICT-S11.md, product 320 keys}. The
  receipt id M2-S11-NATIVE-LOAD@6ead5e9e87c0ec84 is the first 16 hex of that sha256. diff-tree M2..C1 = that one file.
- Commits: A 24982cf1eb92...19d59e parent M1 04560046f31b...8126c; M1 parents cb04b0d147ee...da005 (H) and
  d01dac7b18d0...47b49 (tip); V bf51eb18b00a...9af6e parent A; M2 a5a92ea381bd...4c059 parents V and R
  84f5bca1784f...66409; C1 parent M2; diff-tree M1..A = the artifact only; diff V..M2 = rebuild/DECISIONS.md, 2
  insertions; 84f5bca is an ancestor of HEAD. First pass: 5ab2780 = 01a7050 + 71dc0a8, c55036c parent 5ab2780,
  9a880d3 -> c0f0039 -> 48f1f20 -> cb04b0d. 35859dc, 0b8d074, 7cf4a87, 9b6d2aa, 7b1668c, 84f8421, 86eca40, dcb73ec7,
  e93b1ed (= origin/rebuild/p-s11-exporter-v1) all resolve with the parents and subjects the draft implies. R's
  subject is "DECISIONS:892 L5 POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD (...); S11 chain freeze starts".
- Ledger lineSha256 recomputed on origin/rebuild/t2-client-core: :873 76c110f6, :874 e3cfb1c0, :875 3eae16a8, :892
  4a416036, :60 ebb565c6, :49 f14f5e92 = the draft, S11.json and the review envelope. :892 text = the draft's
  paraphrase (date 2026-10-03, cowork, POSTFIX-ACCEPTANCE, A40, the artifact path, artifact64, ACCEPTED) = %TEMP%\
  s11-t17.json (lineNumber 892, R 84f5bca) = rebuild/m4/spec/review-s11-native-load.json at HEAD (0f30ed86, 484 B,
  absent at A, present at C1).
- Every citation of :862-:892 in the draft was checked against the line text: :866 (2) owner bar, :867 D-R33-1,
  :868 (2) D-READER-ONLY, :869 (1) R8, :870 closure ids, :872 (1)-(5), :873-:875, :876 (1)-(5), :877 run 1 and
  artifacts, :878 (1)-(5), :879 Q1 and the :443 ruling, :880 (1)-(3), :881 option (b), :882, :883 incident, :884
  (1)-(4), :885 ids and 9b6d2aa, :886 declarations and 18 posts, :887 run 2, correction and dispositions, :888 first
  pass and E1, :889 distfix, :890 run 3 and rulings (1)-(3), :891 second pass and 3834565d. All correct, including
  the run ids 37103576075, 37104337049, 37109597259, 37110080030, 37079669559/266, 37102082564/581, 37108132701/699,
  36224004547 and the three T5b artifact and record hashes and byte counts.
- Terminals T8-T14 (both passes) match %TEMP%\s11-t16-inputs.txt line for line, EXIT codes and counts included; the
  first-pass spec sha 321967ee...11ed and artifact 93f55718...ee81 match that file and :888. The T20 lines are the
  PM's; their seven shapes (SEAL BASE ON THE TIP, AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT, SEALED RUN
  RECORDED, SEALED RUN NEXT STEP, PARENT PINS RE-ASSERTED, BYTE-IDENTITY RE-VERIFY) exist in the runner at HEAD, and
  the RECORDED/NEXT STEP values equal the receipt. Coach :25 at HEAD is "M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699".
- Brief lines cited (88, 211, 225, 243, 251, 295, 296, 415-420) say what the draft says; brief 4f7d431f, 352743 B
  at HEAD, A and C1. git diff --name-only edb8381 HEAD counts 137 paths (STOP-S11-80); the "34 test files" split is
  the PM's classification, not re-derived. Placeholders: exactly <<PM: T22 Fable read id>>, C3, C2, T24 line, C4,
  CI-2 and L6 (twice), all in the expected places; no other.
- Not re-verified here (outside my sources): :816, :819, :826, :835-:848, :853-:855 cites; S11-FC09-REVIEW-L3.md,
  the containment and distfix read texts, the T3k :841/:842 citation check (892-line count confirmed only).

## 2. The four 64-hex values and the runner (judge (2))
d5ac8ee6...b372c appears 3 times, c97e468c...02da 2, bdbb8a93...4dd3 3, 6ead5e9e...6af1 2, each as a full 64-hex
token. The runner at HEAD checks the verdict file by substring: lines 3673-3676 (VERDICT-FILE-ABSENT, then
[artifactSha256, specSha256, runnerSha256].filter(h => !verdict.includes(h)) -> SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-
EVIDENCE-HASHES) and 3681 (!verdict.includes(receiptSha) -> ...-DOES-NOT-NAME-THE-RECEIPT); VERDICT_FILE is the
receipt's verdictFile. The draft satisfies all four once it is on disk at rebuild/lanes/b/VERDICT-S11.md.

## 3. Reds and incidents (judge (3))
Every red of :862-:892 is in the draft and none is excused: ci0/ci1/full1 EXIT=1 with the re-runs ci0b/ci1b beside
them; T5b run 1 child 16; the T4 seat candidates of :876 (3); S4/2, LOM-S6, I15, the page-bundle seat offset; the
review REJECTs of :863, :865, :867, :868, :869, :882, :884; full2 EXIT=2 as predicted; the cancelled CI run; the
HARD-LIMIT INCIDENT of :883 and the T22 builder's own names-only listing. The red-first cells are named as method,
which :872/:879-:885/:889 support. Optional: :862 (2) "N15 red on its cell" (a mutant kill on the r31 joint run)
could join the red-first parenthetical; it is not a defect red. The runbook's section 3 red list is fully covered.

## 4. Carried debts (judge (4))
1. CORRECTION OWED: D-R31F-1 is carried (draft lines 397-398 and 518-519) under a PM re-judgment "not reachable from
   genuine use". The ledger says it was PAID: :863 rules round 32 "semantic equality at EVERY comparison site" with
   D-R31-1 closed, :864 builds "one order-free comparator at every site", :865 (Claude R32) finds "every compare
   order-free", :870 closes T1 on those bytes. Member order deciding a Load compare WAS reachable (:863 Astra L22-B1
   PRODUCT), so the stated basis is false. Move D-R31F-1 to PAID (round 32, :863-:865) and delete the re-judgment
   bullet. Carrying a paid item is harmless to the athlete, but a PM ruling recorded in a frozen chain must not
   misstate reachability.
2. Every other carried debt names a basis I could trace: the :866 bar by the read that applied it (:876 (1), :888),
   the PM rulings of :878 (4), :882, :884 (4), :885, :887, :890, the owner-approved spec (RESIDUAL (iv), D-L12-
   ISSUANCE, D-L14-RECOVERY), or the brief's owner steps (T29/T30 for D-L14-OWNER, STOP-S11-PHONE, STOP-S11-R20B1 and
   the capture-class limit; T26 for CI-2). Items a person could hit in ordinary use are each tied to an owner step or
   spec ruling: D-L14-OWNER (phone, theme, crash/reopen, two-device: T29), the first-run-phone question (T29),
   D-S11-EXIT-CODE (:884 (4), reviewers agreed), D-S11-EN3-COPY (:878 (4), owner copy approval needed). None is carried
   without a basis. The D-L12-CONFIG, D-L13/14/15-* and 17-deferred-files quotes come from review files and ledger
   lines outside my window; their re-judgments are the PM's and read as consistent with their quoted text.
3. Optional wording: lines 484, 486, 503-535 repeat "(PM ruling, chain frozen; restated in the PM line after L6)"
   eleven times inside one paragraph; one statement at the section head would read better. No change of substance.

## 5. Private, ASCII, shape (judge (5))
No private value, count, hash, path or prose: the census target is "by Test-Path only, never listed"; forbidden
paths appear only as exclusion names (as :884 (3) and :885 do). 0 non-ASCII bytes (no U+2013, U+2014, U+00B7; the
ledger's middle dots are paraphrased, not quoted); LF only. Section order follows VERDICT-S10 (Authority; evidence
hashes; Sealed-run receipt; Terminals; CI; Export custody; Engine bytes; declared departures; Records; carried
debts; Inherited; D-BLOM; coach constant; athlete), with S11's FC09 and T5b sections in place of S10's released-pair,
D-EPP-4, D-GSS and D-SPLIT sections, as runbook T22 allows.

## AAR (5 lines)
1. Verified: all four 64-hex values, every commit id and parent, every run id, every :862-:892 cite, the receipt's content and sha at C1, the runner's substring checks, the T8-T14 lines, ASCII/LF.
2. Found: D-R31F-1 carried as a debt though :863-:865 paid it in round 32; the re-judgment misstates reachability.
3. Not measured: lines outside :862-:892, the review files the draft quotes, the T20 log itself (confirmed through receipt and HEAD only), the PM's 34-test-file split.
4. Rule check: read-only git and node hashing only; no forbidden path opened, listed or hashed; nothing edited or committed.
5. Verdict ACCEPT WITH NAMED DEBTS; C2 may be committed once item 4.1 is corrected.
