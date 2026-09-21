# CLAUDE REVIEW: TMH-SPEC (TODAY-MODEL-HANDOFF specification), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; not the paper's author or its Astra reviewer.
Asked at DECISIONS:646, class (a) paper ordering data-path changes. Run on Joe's word "review". PAPER ONLY.
Head 45ea25a1c1c187198972201102a55556f7db3775; base and measured source c02b001e3646555050594c39856bfd31f2d48590.
Paper rebuild/lanes/c/TODAY-MODEL-HANDOFF-SPEC.md, 172 lines, read whole; sha256 re-measured here
fb192ca78578356d34b9052ae7bf32049cf270c9ed28becb73c5075bfe346cc3 (equal to :646). PC clock 2026-09-21, 14:46 to 15:10 ET.
base..head is that one file: there is NO product hunk to list under DECISIONS:439.
Under :645 I ran no repository test and no helper. My one cell reads one tracked file. All numbers are invented.
## VERDICT
ACCEPT WITH NAMED DEBTS, PAPER ONLY. Fit to brief a builder after S10 once D-TMH-F8 has a ruling.
I carry the blind review's D-TMH-BUILD, -RECOVERY, -CAP, -PRICE and -FINAL unchanged and add two of my own.
## WHAT I CHECKED MYSELF, before reading the blind review (39d2e9a8, 44 lines, then read whole)
1. THE 32. My own scanner (%TEMP%\claude-epp\tmh-count.cjs: blanks comments, strings and template text, counts
   the bare identifier) on rebuild/m3/w7-preview/today/today-app.cjs: TOTAL 32, on lines 357, 384, 635, 868,
   883, 917, 1022x3, 1023x3, 1030x3, 1219x2, 1220x2, 1352, 1437, 1444, 1486x3, 1520, 1576x2, 1668x3, 1898;
   property-position .model 0. The paper's table A row for row, by a third instrument (neither F's tokenizer
   nor the blind review's Acorn).
2. THE SUBMIT. READ today-app.cjs:855-877: preventDefault, the disabled early return, disable, trim,
   model.weighIn(raw === "" ? raw : Number(raw)), the catch sentence with its trailing space, re-enable,
   plainOrDrop plus focus on refusal, else close() and render("today", true). Section B keeps each of these
   and moves only the trim, the conversion and the call behind hooks.submitWeighIn. Correct.
3. THE WRITER'S ORDER. READ today-readings.cjs:46-66: ALREADY, then range and precision for finite numbers
   only, then NO_STORE, then the host. Section E's branch-order rows are right; "-0", "180.01" and
   "180.00000000000003" do fall to RANGE by that test; "Infinity" and "junk" skip it and reach the client.
4. THE RACE IS REAL. ALREADY reads stateFromOps(), which cannot see a held, uncommitted write. So today a
   second sheet can send a second reading for the same day while the first is in flight: the "second stored
   operation" the writer's own comment (:47-49) says must never exist. I-PENDING closes that. It is a
   correction of the data path, not parity, and the paper says so honestly.
5. THE AUTHORITY. READ DECISIONS:626 whole: point (5) assigns submitWeighIn's in-flight flag and
   recoverWorkout's hook to this ticket; point (2) puts it after S10. The paper's scope claims hold.
## NAMED DEBTS (mine)
D-TMH-F8 THE SILENT SECOND SUBMIT. The released comment at today-app.cjs:857-860 and the writer's at
  today-readings.cjs:35-40 both record review F8: nothing is ever refused silently. The paper's in-flight
  answer has no text, focus or repaint (section F: it "quietly does nothing"), and F8 is never cited.
  Follow the case the flag exists for, by the code: sheet A submits 180 and the commit is held; he cancels,
  opens sheet B, types 181, taps Record. New path: in-flight, nothing shown. When A settles, A's continuation
  runs close() and render("today", true); a render ends in phone.replaceChildren(root) (:624) and B was
  appended to phone (:835), so B vanishes with his 181 in it. He tapped Record and the sheet went away:
  that reads as saved. Nothing wrong is STORED (one reading, 180, and Today shows it), so this is an honesty
  debt, not a data harm; and it is READ, not executed by me, so it is a debt and not a blocker.
  OWED before the build: a PM ruling that either records an F8 exception for the in-flight case or gives it
  words (a PROPOSED sentence is Joe's to see), and a row TMH-SECOND-SHEET pinning what is on screen after A
  settles with B open, for A's success, refusal and rejection. PAYS: the next paper revision.
D-TMH-LATE-PAINT NAMED, NOT JUST KEPT. The paper keeps "old late-paint behavior" without saying what it is.
  By :838-842 and :870-877 it is: A's close() sets page.inert = false and moves focus to returnFocus while
  another sheet may be open; then a refusal writes into A's removed error node, or a success replaces the
  whole phone. Keeping it is fair for this ticket, but the paper must state it, so the parity row has a named
  expectation instead of "whatever the old code did". PAYS: the next paper revision.
## NOTES (not debts)
N1 hooks.submitWeighIn returns a plain object OR a Promise. It works (a Promise has no kind) and keeps the
   in-flight path free of any await. Plant "await the in-flight answer" and "a resolved Promise for in-flight",
   so nobody tidies the union away and adds a suspension.
N3 structuredClone throws on a function-bearing result: the fail-closed the paper wants, but it throws inside
   paint. TMH-PROJECTION-CAPABILITY should assert where it surfaces and that no half-painted page is left.

## WHAT I DID NOT DO
No candidate exists: no DOM run, no durable run, no browser, no phone, no CI. I did not re-run or open the
author's or the reviewer's scratch probes. I did not read DECISIONS:550, :574, :610 or :628. No protected path,
private fixture, ledger directory, old-app source or real measurement was opened or reached by any process.
