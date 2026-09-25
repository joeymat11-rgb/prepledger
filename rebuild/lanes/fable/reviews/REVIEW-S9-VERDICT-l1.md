# REVIEW-S9-VERDICT-l1

VERDICT: ACCEPT WITH NAMED DEBTS (E1-E4 required edits before commit; D1-D3 carried)

Reviewer: Claude Fable 5.1, independent (did not write the draft), runbook T17 reviewer read, cloud only.
Object: /home/claude/s9-verdict/VERDICT-S9.md, 158 lines, 12886 bytes, sha256
224f75a314dff59d989736843497872062dd7016ac622732d45c360b67aaed67. Not edited by me.
Method: everything below was re-taken from bytes at A = 9c95afa5b840fedbe914652b2f0bd83d1b0800c2 and
R = 60be3c6fb53975f60d4f54922d12ea9f17fbfb33 with explicit paths only (git show REV:path). V 4d649bc, M2 c30a0bc
and C1 c3b04be do not resolve in the public clone, as the brief said; every fact that lives only there is
marked PM-FACT and carried as D1.

## BLOCKING classes (the four the brief names): none found

- B-class 1, T19 fall-back to FULL. Runner at A (sha256 5321181a14bd57.. verified), sealedRunReceipt():
  :3570 VERDICT_FILE = rebuild/lanes/b/VERDICT-S9.md; :3647 file must exist on disk; :3649-3650 the verdict
  must include sr.artifactSha256, sr.specSha256, sr.runnerSha256 as full 64-hex; :3655 must include the
  receipt's own disk sha256. Measured in the draft: artifact f2447622.. x3, spec bb169a67.. x2, runner
  5321181a.. x2, receipt cb31838f.. x2 (full 64-hex each). PASS, conditional on D1 (the receipt sha is a
  PM-FACT; see D1 for the check that makes it a measurement).
  fidelity() :2596-2604 diffs sourceBase..HEAD over rebuild/engine, rebuild/conform, rebuild/m4/spec and
  rebuild/lanes/b/tooling only and excuses the own receipt (:2602); rebuild/lanes/b/VERDICT-S9.md and
  rebuild/coach/engine-revision.cjs are outside that scope, and rebuild/coach/* is not in the S9 product map
  (0 coach entries), so committing verdict, receipt and coach constant cannot print UNLISTED-SOURCE-CHANGE
  or SEALED-RUN-RECEIPT-VOID. H12 :3666-3667 and H13 :3637-3642 read as the draft says.
- B-class 2, wrong sha. Every 40/64-hex string in the draft enumerated (11 distinct): A, R, sourceBase
  e8712f48b32e.. (= S9.json sourceBase), brief abf3f670.. (blob at A hashes to it, 122946 B), parent artifact
  3cf58e0e.. (= S9.json parent.options[0].sha256 and :788), :809 lineSha256 66ff27e7.. (re-hashed from
  DECISIONS:809 at R: match), artifact/spec/runner (re-hashed from their blobs at A: all three match).
  Receipt cb31838f.. and review envelope 7f372d97.. are PM-FACTs (D1). The 16-hex coach constant
  cb31838ff0db8406 is the receipt sha's first 16 hex; 3b1b8b91dd5a6ff0 is S8's (VERDICT-S8.md:47). No wrong sha.
- B-class 3, private content. None. "# pass 30" is the public ledger's TAP count (:798); 254/256/2 are the
  runner's and the spec's counts; the draft names no protected-five content, no *soak* path (it says "a
  protected path" where S9.json notes name it), no census value.
- B-class 4, bytes. 12886 bytes, 0 bytes >= 0x80, 0 CR, 0 tabs, 0 trailing spaces, final byte LF, 158 lines.
  The S8 middle-dot separators were correctly replaced by "-" and "|".

## Ledger and spec cross-checks (all PASS)

- :786 line sha256 46a64dc0.. = S9.json release.rulingLineSha256; names exactly preview.css and build.mjs; RULED.
- :787 line sha256 b8d088af3eb8.. = S9.json coverage.superseded.rulingLineSha256; five carriers, nine gates; RULED.
- :788 THEME sha256 ff25c85a.. = S9.json authorizations.theme.lineSha256; :789 BRIEF-BY-SHA names abf3f670..
  (122946 bytes) = S9.json brief.acceptedLedgerLine.
- :809 = "POSTFIX-ACCEPTANCE M2-S9-UI-PINS 9c95afa5.. rebuild/m4/spec/acceptance-s9-ui-pins.json f2447622..
  ACCEPTED"; the draft's "reviewed commit is A" is that line's own word.
- :798 (2(b), "# pass 30", protected until 2026-10-05), :799 (24 children, hosted-blom re-point), :800
  ("Yes, deploy at seal", slice-host.yml, synthetic athlete), :804 (sourceBase to e8712f48): each as drafted.
- S9.json at A: 256 product entries; roles edited 21, carried 201, released 2 (build.mjs, preview.css),
  superseded-by-child 1, new 22, pinned-unchanged 9; 256 - 2 = 254 (D-S9SEAL-1 as drafted). All 18
  rebuild/engine/* entries role carried with pre == post ("No engine byte" section as drafted). 32 children
  (T7/T9/T15 "32 CHILD" as drafted). b-lom absent from children; the three b-lom files role carried.
- Runner strings the draft quotes, checked against their say()/out() sites: POSTFIX .. mode= (:3832),
  ENVELOPE PENDING (:3701), ENVELOPE AUTHORIZED (:3770), AUTHORIZED STEP UNAVAILABLE (:3881, exact),
  SEALED RUN RECORDED with 12-hex slices (:3907-3909, exact), SEALED RUN NEXT STEP (:3681),
  POSTFIX PACKAGE REVIEW-PENDING (:3913, exact), POSTFIX PACKAGE PASS (:3912), SEAL BASE ON THE TIP with
  rule=ancestor (:3528-3530, SEAL_TIP_RULE = 'ancestor' at :112). The [cut] marks correctly stand where the
  real lines carry U+2014 (:3689, :3784, :3897).
- Shape against VERDICT-S8.md at A (sha256 ac6801c9..): same section order (header, Authority, evidence
  hashes, Sealed-run receipt, Terminals, notes/debts, athlete paragraph), same receipt sentence, same
  coach-constant sentence, same "PASS word is the runner's" framing. Additions (CI, Source custody,
  Released pair, Debts) are warranted by S9's facts.

## E: required edits before commit (not in a BLOCKING class; each is a false or unfinished sentence in a
## verdict of record, and the PM is editing the file anyway for the placeholders)

E1 (lines 130-131, FALSE CARRY). "The two rebuild/lanes/d/p3-layout-v2 cells remain CI-homed by exact
  path but undeclared by any package (DECISIONS:524)." Measured at A: S9.json child d-real-shape argv ends
  with rebuild/lanes/d/p3-layout-v2/layout-v2.test.mjs and rebuild/lanes/d/p3-layout-v2/projector-parity.test.mjs
  (needle "# pass 62"); both files are product, role pinned-unchanged; runner :449 and :487 add the
  CHILD_ROOTS root rebuild/lanes/d/p3-layout-v2/ "DECISIONS:524 N1's two carried cells". S9 PAID this S8
  note, and Fable T11's D-S9SEAL-2 list (rebuild.yml comment, S8.json numbers, lane D (a)-(e), D-BLOM,
  released pair) does not include it. Replace lines 130-131 with:
  "- The S8 note on the two `rebuild/lanes/d/p3-layout-v2` cells (`layout-v2.test.mjs`,
    `projector-parity.test.mjs`; `DECISIONS:524` N1) is PAID here, not carried: both are declared product
    (role pinned-unchanged) and are executed by the `d-real-shape` child under the runner's
    `rebuild/lanes/d/p3-layout-v2/` child root."
  Also fix line 105 accordingly: "this verdict restates the unpaid V8 prose carries (below), D-BLOM and the
  released pair (above); the p3-layout-v2 note is paid (below)."

E2 (line 64, PLACEHOLDER IN A QUOTE). "[cut: the origin chain ref]" is a constant, not a redaction: runner
  :193 `const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core';` and VERDICT-S8.md:69 and :96 quote
  it. Replace with: `SEAL BASE ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at 60be3c6 and that
  commit is an ancestor of this HEAD (DECISIONS:135 (4), rule=ancestor)` (no [cut] needed; the line is ASCII).

E3 (lines 71-72, MISATTRIBUTED PARENTHETICAL). The FULL EVIDENCE line (:3817-3821) prints "... and 9
  SUPERSEDED under DECISIONS:787, each replaced by this package's own executed evidence; second gate
  included". It never prints a carrier list; "(defect-witnesses, inherited-carriers, second-gate,
  source-carriers, writers-differential)" is the COVERAGE line's clause (:3303-3306, with per-carrier counts).
  The PM facts for T15 carry no such list either. Replace the T15 FULL EVIDENCE quote with the T9 form:
  `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried [cut] and 9 SUPERSEDED under
  DECISIONS:787 [cut]`. (If the PM wants the carriers named, quote the COVERAGE line from the T15 log as
  its own item; do not paste it into FULL EVIDENCE.)

E4 (line 107, WRONG ORIGIN). "first seen on S8": DECISIONS:496 (S6 FULL RUN 1) records "today-17 681/682
  once" on S6; VERDICT-S8.md:122-124 calls it "the DECISIONS:496 class" and records a second sighting on
  S8. Replace "first seen on S8" with "first recorded at `DECISIONS:496` on S6, seen again on S8".

Placeholders the PM fills, as the builder said: line 80 "PENDING T19", line 88 "PENDING CI-2", line 150
"COACH SUITE COUNT PENDING". Order that keeps :800 satisfied: commit verdict (with E1-E4) -> run T19 ->
write terminal 4 and the coach count -> commit -> CI-2 at THAT head -> write CI-2 -> commit; :800 makes CI
at the exact final head binding, so the CI-2 sentence must not name a run taken at an earlier head than
the one it is committed on, or say so.

## D: named debts carried

D1 (PM-FACT hashes, T19-relevant). cb31838ff0db840609adfb63476c824f28d0690913f4143f2c47ee5c05154d2e
  (receipt), 7f372d97.. (review envelope), 4d649bc/c30a0bc/c3b04be, 32291 B, CI run ids, "28/28",
  "VERDICT PASS scope=SOURCE_CUSTODY_CLOSURE" cannot be re-taken from GitHub. The one that decides T19 is the
  receipt sha (:3655 compares the verdict text against diskSha of receipts/S9.json, which :3598 requires to
  equal the HEAD blob). PM check before committing the verdict, on the PC, byte-exact extraction per rules
  line 13: sha256 of `git show HEAD:rebuild/lanes/b/tooling/receipts/S9.json` must print cb31838ff0db8406..
  and `git status --porcelain -- rebuild/lanes/b/tooling/receipts/S9.json` must be empty. A mismatch prints
  SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-RECEIPT and T19 falls back to FULL.
D2 (unverifiable in the clone, not T19-relevant). The M2 diff claim (DECISIONS.md and the HANDOFF file only)
  and "committed unmodified as C1" rest on the PM's measurement; the ledger rule at :800 ("no ledger append
  between it and SEALED AND MERGED") is satisfied only if the DECISIONS.md hunk in V..M2 is the merged :809
  line and nothing appended on the lane. PM to confirm with `git diff 4d649bc c30a0bc -- rebuild/DECISIONS.md`
  showing :809 only.
D3 (prose, optional). Line 3 "Lane" where S8 wrote "Branch"; line 1 title uses "-" for S8's middle dot
  (correct under the ASCII rule); line 16 "located by its own bytes" for :786 is true of the runner's
  releaseRuling() but the draft gives no 12-hex prefix as it does for :787 (46a64dc05fce.. if wanted).
  None of these changes a fact.

## What I did not do
No commit, no push, no edit of the draft, no read of src/**, rebuild/conform/private/**, any ledger/ dir,
any *soak* path or the protected five; the S9.json product map was read for paths and roles only.
