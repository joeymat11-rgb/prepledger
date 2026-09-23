# CLAUDE REVIEW: TMH-SPEC revision R2.2 (TODAY-MODEL-HANDOFF specification), round 2 of the R2 loop
Reviewer: Claude (Fable 5.1), same hand as REVIEW-TMH-R2-l1.md (eee85c6c); independent of author, R1 reviewers and R2 builder. PAPER ONLY.
Under review, uncommitted in earned-astra-87 (HEAD 45ea25a, worktree otherwise clean):
spec rebuild/lanes/c/TODAY-MODEL-HANDOFF-SPEC.md 183 lines, sha256 re-measured ba4da05e87b424643eb5a08eff4b6fce5ffedf85e89549ec90fd01fd1f734fca;
report rebuild/lanes/c/TMH-R2-REPORT.md 48 lines, sha256 914622b215e833d24990f4b80b35389ad5f4401d525150d69b53f1bc32165b10. Both equal the brief.
DECISIONS:782 read at d72384e (782 lines, present locally, no fetch). Static git show of public paths at b35a48e3 only. No test, probe, lock.

## VERDICT
ACCEPT, PAPER ONLY. My two R2 debts are paid; the two build gates the paper already names (owner copy, D-TMH-F8 rows) remain build gates, not paper debts.

## CHECKED
1. D-TMH-REACH paid. Spec :80: "only" struck; route reads "by cancel/Escape ... or by the repaint route". Against source: app:1699-1702 names late lane,
   rebind and refresh callback; :1927-1929 the dispose comment; show() :624 replaceChildren removes A without close(); :825 finds no dialog in the new
   root, so B opens. Spec adds that A's captured page (:833) stays inert while detached and the new root is not inert: consistent with :834/:840.
   Row TMH-SECOND-SHEET-REPAINT present at :113 with the two plants I asked for (pending slot freed by a render-removed A; B admitted as second call).
2. Midnight claim (spec :80, :174; report Q2) VERIFIED STATICALLY. today-entry.mjs :448 calls api.dispose() in teardown and :459 reopen() runs
   rollover.stop(), teardown(), then boot(); today-app.cjs :357 mountToday creates a fresh mount and :384 a fresh createTodayLanes, so the pending
   slot is per mount; render() returns null when disposed at app:1703. So on the midnight route B is a new mount's first submit: admitted, not
   in-flight, and A's late render paints nothing. The same-day duplicate cannot arise: A carries the old mount's day, B the new. The builder is right
   and my l1 wording ("into the same held write") was wrong for the midnight case; DECISIONS:782 rules it a note only, and :174 recommends exactly that.
   Citation slip: spec :80 and report say the disposed return is ":1702"; it is app:1703 (:1702 is the comment's last line). One-line fix, no debt.
3. D-TMH-L2-RULING closed by DECISIONS:782. Ledger text: "TMH L2 means a closed sheet's refused write is shown nowhere; carried as named debt
   D-TMH-L2-SILENT to TODAY-OUTCOME-TYPE, not fixed in TMH." Spec :79 and :173 carry the same substance and name; :179 lists D-TMH-L2-SILENT as
   carried. The report's word "verbatim" is not exact (the spec's sentence is a faithful restatement); the spec itself does not claim verbatim. Fine.
   Report Q3 (could not read :782 locally) is now answered: the wording matches.
4. N1 landed at :172 for Joe's copy review, with the ALREADY consequence stated. N2 landed twice: :79 REQUIRED pin "document.activeElement unchanged"
   and row TMH-LATE-PAINT :114. Both as asked.
5. Nothing regressed. git diff 45ea25a: 28 insertions, 17 deletions; the 17 removed lines are the same 17 as R2 (listed by first 90 chars), so
   R2.2 added only :113, :173-:174 and in-place tagged extensions. Every R2 clause I accepted in l1 is still present (items 1-7 of that review re-found
   by grep: :77 in-flight paint and N1 plants, :107 N3, :111 TMH-PENDING, :112 TMH-SECOND-SHEET, :117 WEIGHT-PAINT plant, :143-:145/:160 REQUIRED labels,
   :166-:167 F, :171 guard answer, :179 carried list). Line arithmetic 172 + 28 - 17 = 183 TRUE.

## NOTES (not debts)
N1 app:1703 citation, above. N2 Report line "cited verbatim" should read "cited"; no paper change needed.
N3 Report's "R2.2: 9 replacements asserted by script" unverified (scratch not opened); the diff is verified directly.

## WHAT I DID NOT DO
No test, probe, browser, harness or lock; no worktree file modified; no protected five, src/, soak, private, ledger directory or old-app checkout
opened. Outputs: this file and scratch-r22*.txt in the same folder.
