# TMH-R2-REPORT: TODAY-MODEL-HANDOFF-SPEC revision R2 (with round R2.2)
Builder: Claude (Opus 5.5), PAPER ONLY. Worktree earned-astra-87, branch rebuild/c-today-model-handoff-spec, HEAD 45ea25a (clean before R2).
Inputs read whole: the R1 spec (sha256 fb192ca7...6cc3, equal to DECISIONS:646); Claude review cd789e7 REVIEW-TMH-SPEC-l1.md;
Astra review 39d2e9a TODAY-MODEL-HANDOFF-SPEC-REVIEW-L1.md; DECISIONS :626 :628 :633 :635 :645 :646 :660 :661 :662;
R2.2: Fable review REVIEW-TMH-R2-l1.md (earned-tmh-review, 59 lines). DECISIONS:782 is NOT in the local ref (origin/rebuild/t2-client-core
0526ed7 has 781 lines; no fetch allowed); its ruling is cited as relayed by the coordinator.
Static reads only (git show, explicit paths, at b35a48e3): today-app.cjs, today-readings.cjs, today-lanes.cjs,
screens.template.html, writer-fence.test.mjs; git diff --stat c02b001e..b35a48e3 over those plus today-model.cjs.
No probe, test, product code, protected path, src/, soak, private or ledger dir. No commit. No product or test byte changed.

## Debts paid (spec line numbers are current physical lines)
D-TMH-F8 (Claude; :660): :80 Second sheet paragraph; PROPOSED PENDING sentence as a released-view constant, outside the seal
  (F:1668-1675, F:1366-1371 check sealed files only); S1/S2/S3 pinned. Also :11, :77, :90, :111, row :112, :117, :159, :166, :167, :172.
D-TMH-LATE-PAINT (Claude; :660): :79 L1 (ok: close() re-runs, inert=false, returnFocus, render replaceChildren, h1 focus;
  app:619-630, :824-842, :876-877) and L2 (refused/thrown: detached error text and focus, nothing shown; app:871-874). Row :114.
Astra N1: REQUIRED labels at :143, :145, :160. Claude N1: :77, :111. Claude N3: :107.
Split-guard question: answered at :171 (b35a48e3 differs from c02b001e only in the lanes banner; :4-5).
R2.2 D-TMH-REACH (Fable): :80 "only" struck; repaint route added: late lane, rebind or refresh callback of this mount
  (READ app:1699-1702, :1927-1929) renders while A is open, show() :624 replaceChildren removes A without close(), B opens (:825)
  into the same held write; A's late close() then touches only the detached page. New variant row :113 TMH-SECOND-SHEET-REPAINT.
  Midnight re-boot: READ that it disposes the mount (render returns null at :1702) and B opens in the NEW mount with its own
  pending slot, so B is admitted, not in-flight; stated at :80 and raised at :174 rather than claimed as same-write.
R2.2 D-TMH-L2-RULING (PM, DECISIONS:782): cited verbatim at :79 and :173: "L2 means a closed sheet's refused write is shown
  nowhere. It is carried as its own named debt, D-TMH-L2-SILENT, to TODAY-OUTCOME-TYPE, and is not fixed in this ticket."
  Carried list at :179. The R2 recommendation question is replaced by the ruling.
R2.2 Fable N1: note for Joe's copy review at :172 ("Try again in a moment" leads into ALREADY after S1; fits only S2/S3).
R2.2 Fable N2: :79 and row :114 pin document.activeElement unchanged by the detached input.focus().
Carried, not payable by paper: D-TMH-BUILD/RECOVERY/CAP/PRICE/FINAL and D-TMH-L2-SILENT (:179).

## Kept
Every accepted clause not named above is unchanged; every change carries an [R2:...] or [R2.2:...] tag. Each replacement string was
asserted to occur exactly once by script (R2: 19+2+1; R2.2: 9). R1's finish.cjs line is labeled "R1" at :183.

## Remaining questions (for the PM)
1. Owner copy: the PENDING wording goes to Joe in the sheet context before build, with Fable N1 attached (:172). No build before that.
2. Midnight variant (:174): Fable's review says B opens "into the same held write"; my READ says B is in a new mount with a new pending
   slot and a new day, so it is admitted. Recommend a READ note only unless the PM wants a cross-mount cell.
3. DECISIONS:782 could not be read locally (ref at 781 lines, no fetch); the PM should confirm the wording cited matches the ledger.
4. Alternative (refuse opening B while pending) priced in words only; not recommended (:80).
5. Unchanged from R1: post-S10 administrative pin surface for the child brief (G).

## Hashes (sha256, LF, ASCII)
R1 spec at 45ea25a: fb192ca78578356d34b9052ae7bf32049cf270c9ed28becb73c5075bfe346cc3
R2 spec (reviewed by Fable): 82e53f5fe53f9183b949852891b15d7ea5f820099290e8830696f59cf1c42a25
R2.2 spec rebuild/lanes/c/TODAY-MODEL-HANDOFF-SPEC.md (183 lines, 0 CR, 0 non-ASCII, final LF):
  ba4da05e87b424643eb5a08eff4b6fce5ffedf85e89549ec90fd01fd1f734fca
This report: stated in the builder's final message (a file cannot hold its own hash).
Scratch (not shipped): C:/Users/joeym/AppData/Local/Temp/opus55-tmh-r2 (patch.cjs to patch5.cjs, source copies).
