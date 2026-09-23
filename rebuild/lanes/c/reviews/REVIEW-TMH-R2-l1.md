# CLAUDE REVIEW: TMH-SPEC revision R2 (TODAY-MODEL-HANDOFF specification), round 2
Reviewer: Claude (Fable 5.1), independent of the R1 author (Astra), the R1 reviewers and the R2 builder (Opus 5.5). PAPER ONLY.
Under review, uncommitted in C:\Users\joeym\AppData\Local\Temp\earned-astra-87 (branch rebuild/c-today-model-handoff-spec, HEAD 45ea25a, clean base):
rebuild/lanes/c/TODAY-MODEL-HANDOFF-SPEC.md 181 lines, sha256 re-measured 82e53f5fe53f9183b949852891b15d7ea5f820099290e8830696f59cf1c42a25 (equal to brief);
rebuild/lanes/c/TMH-R2-REPORT.md 49 lines, sha256 beded6bf77a58ea78558a718fc6de85adbd12c2649e5fdd42a4f9a2aa3bc5550 (equal to brief).
Method: rules read whole; BLIND FIRST the two prior reviews (cd789e7 REVIEW-TMH-SPEC-l1.md 59 lines; 39d2e9a TODAY-MODEL-HANDOFF-SPEC-REVIEW-L1.md
44 lines) and DECISIONS :626 :628 :633 :645 :646 :660-662 (read at 31f9e09, the only local commit holding physical line 662); then git diff
45ea25a of the spec (26+/17-, one file); then the report; then static git show of named public paths at b35a48e3. No test, probe, lock or helper.

## VERDICT
ACCEPT WITH NAMED DEBTS, PAPER ONLY. Both R1 debts are paid in the paper's own terms; the two owner/PM gates the paper names stay open.

## WHAT I CHECKED MYSELF (every claim below is READ at b35a48e3 unless marked)
1. Byte-unchanged premise (spec :5). git diff --stat c02b001e b35a48e3 over today-app.cjs, today-lanes.cjs, today-readings.cjs, today-model.cjs,
   writer-fence.test.mjs, screens.template.html: ONLY today-lanes.cjs, one hunk @@ -29,6 +29,6 @@. So every R1 colon number holds. TRUE.
2. Sheet reachability (spec :80, report). app:825 `if (phone.querySelector('[role="dialog"]')) return;`; template :78 the t-weigh form carries
   role="dialog" aria-modal="true"; app:864-865 disabled early return then submit.disabled = true before the await at :868. TRUE. The HTML
   implicit-submission clause (a disabled default button is not activated) is a standards read, not measured; the :864 guard covers it anyway.
3. close()/render() (spec :79 L1/L2). app:838-842 close(): sheet.remove(), page.inert = false, returnFocus.focus() if isConnected; nothing
   cancelled. app:876-877 close(); render("today", true); app:623-628 show(): phone.replaceChildren(root) then h1 focus; app:621 data-go
   renders. Refusal path app:871-874 writes error.textContent and input.focus(), returns without close. L1 and L2 as written. TRUE.
4. N3 anchors (spec :107): app:917 `try { return model.read(); }` and app:1576 `try { state = ... model.stateFromOps() ... }` are the two
   existing catches. TRUE. Recovery anchor app:750 `await facade.workout().recover()` inside the :745 click callback. TRUE.
5. Copy custody (spec :80). F:1669-1675 FENCE-COPY-IN-SEAL asserts zero prose literals in today-lanes.cjs; F:1366-1371 the RED plant over
   SEALED files. A released-view constant beside app:869/:872 is outside both. TRUE.
6. No accepted R1 clause dropped. The 17 removed lines are each replaced by a tagged superset: I-PENDING/I-PAINT (:11), Required callback
   (:77), sketch sentence (:78), C app row (:90), TMH-PROJECTION-CAPABILITY (:107), TMH-PENDING (:111), TMH-WEIGHT-PAINT (:116), E copy
   names (:141), E header (:142), E rows (:144, :158, :159), F (:165-166), G guard question (:170), H finish line (:181). The only R1
   sentence struck outright is F's "quietly does nothing", which is the supersession :660 ordered. R1's carried debts restated at :177.
7. Report arithmetic: 172 + 26 - 17 = 181 lines. TRUE. Hashes TRUE (item above).

## DECISIONS
D-TMH-F8 PAID as paper. :660 asked for visible pending feedback proposed for owner copy review plus pinned second-sheet outcomes. Spec :80 gives
  the PROPOSED sentence, marks it PROPOSED at :80, :141, :158, :165, :171 and "never shipped before" Joe's review; S1/S2/S3 pinned; row
  TMH-SECOND-SHEET :112 with plants; the build gate stated twice (:80, :171). Routing correct: owner copy, released view, outside the seal.
D-TMH-LATE-PAINT PAID. :79 names L1 and L2 with line anchors I confirmed; row TMH-LATE-PAINT :113 pins old/new equality with plants.
L2 SILENCE RECOMMENDATION (:172, report Q2): I AGREE it is not this ticket's to fix (new late-paint policy, unpriced), and I agree it must not
  pass silently under :660's "no silent-refusal exception". It needs a PM ruling by name, not a paper's recommendation. Named below.

## NAMED DEBTS (mine, for the PM)
D-TMH-L2-RULING. :660 granted no silent-refusal exception; :79 L2 KEEPS one (a closed sheet's write is refused and nothing is shown). The paper
  asks the PM to record it as a separate debt (:172). OWED: a ledger ruling that either names it D-TMH-L2 for TODAY-OUTCOME-TYPE or later,
  or orders words here. Build cannot start on the paper's recommendation alone. PAYS: PM, before the build brief.
D-TMH-REACH. Spec :80 says in-flight "is reached only by cancel/Escape of A". READ app:1699-1702 and :1927-1929: a late lane, a rebind or a
  refresh callback of this mount, and the midnight re-boot, may render while A is open; show() :624 replaceChildren removes A WITHOUT close()
  (page left inert until A settles or is replaced), and B can then open into the same held write. Same S1/S2/S3 outcomes, but the reach clause
  is "only" and it is not. OWED: strike "only", add the repaint route, and give TMH-SECOND-SHEET one variant where A is removed by render, not
  by cancel (A's late close() then sets inert=false on a DETACHED page and returnFocus is unlikely connected). PAYS: next paper pass, small.

## NOTES (not debts)
N1 For Joe's copy review, not for this paper: after S1 the sentence's "Try again in a moment" leads to the ALREADY refusal (one reading a day),
   since A's 180 is now the day's reading. "This one was not recorded" is true in every branch; the instruction is only apt in S2/S3.
N2 Spec :79 rightly leaves focus() on a detached input as a REQUIRED cell; by the HTML focusing steps a detached element is not focusable, so
   the expectation to pin is "activeElement unchanged".
N3 Report Q3-Q5 and the "19+2+1 replacements asserted by script" claim are unverified here (scratch not opened); the diff itself is verified.

## WHAT I DID NOT DO
No test, probe, browser, harness or lock. No file modified in the worktree. No protected five, src/, soak, private, ledger directory, old-app
checkout or real measurement opened or reached. Sole outputs: this file and three scratch read dumps in the same folder (scratch-reads*.txt).
