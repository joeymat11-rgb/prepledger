# CLAUDE REVIEW: EW2-SECOND-SOURCE (the second-source refusal paper and its measuring cells), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; not an author or Astra reviewer of this work.
Asked at DECISIONS:651, class (a). Run on Joe's word "review". PAPER AND SAFE CELLS ONLY; no product acceptance.
Head f34baa68b7b604f555f89d7b2b2343e3c2fc36cb, base 99fab1426184ab5ce879bd16d9237acb264e25e3, on the owner's PC,
Node v24.19.0, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, PC clock 2026-09-21 14:52 to 14:56 ET.
Paper rebuild/lanes/d2/EW2-SECOND-SOURCE-REFUSAL.md, 241 lines, read whole, sha256 re-measured
37b6d18474c9c851c44cc5c394ed1944ba48ee828e256229197a950219b27746 (equal to :651). EVERY NUMBER IS INVENTED.
base..head: 5 files, +781 -0, all under rebuild/lanes/d2. There is NO product hunk (DECISIONS:439 has nothing to
list). Read whole: the paper, the 51-line author report, ew2c-second-source-refusal.mjs (P, 123),
ew2c-guard-measure.mjs (M, 271), ew2c-synthetic-envelope.mjs (95). Reviews L1, L2, L3 read whole AFTER my own work.
## VERDICT
ACCEPT WITH NAMED DEBTS. The one-line prepare guard is the right guard in the right place, and it writes
nothing when it refuses. I carry L1's D3 (linked screen) and D4 (mixed history) unchanged and add one debt.
## WHAT I RAN, under :645 (each import chain read first: no port.cjs, no oracle, no git show, no private path;
support.mjs spawns port.cjs only inside its own sealInventedBundle, which these cells neither call nor re-export)
1. P on the unchanged product: exit 1, J1 J2 J4 J6 pass, RED journeys exactly 3 and 5 (both admitted).
2. P against MY OWN candidate (ew2-probe.mjs builds it: the paper's guard inserted after the unique anchor at
   source-admission.mjs:752, imports rewritten to file URLs, written to %TEMP%\claude-epp): exit 0, 6 of 6,
   J3 and J5 refuse LOCAL_SOURCE_SECOND_ADMISSION_REFUSED. M itself I read and did not run.
3. MY OWN PROBE, the input nobody tried: a ZERO-OPERATION installation, where import-bundle SEEDS the derived
   cache on carry (last file wins) and a seeded entry CANNOT be retracted once anything is logged
   (import-bundle.mjs:71-79, :707-735). If a refused second file could be seeded, the refusal would leave his
   cache holding the refused file with no way back. Measured on my candidate:
   ZERO-OP  carry A: LOCAL_IMPORT_SEEDED, cache changed; prepare A: LOCAL_SOURCE_PROGRAMME_UNRESOLVED, no selection.
   ENROLLED carry A: LOCAL_IMPORT_REBASE_REQUIRED, cache unchanged; admit A: 1 selection; carry B: not seeded,
            cache unchanged, revision +1; prepare B: the new code; retract B: LOCAL_IMPORT_RETRACTED, revision +2,
            1 retraction, imports back to A alone, cache and admitted basis unchanged; reopen A: ready.
   So an admission needs a setup operation, an installation that holds a selection is never zero-op, a file
   carried after an admission is never seeded, and its retract cannot meet BASIS_UNPROVEN. HYPOTHESIS DISPROVED.
   The paper's lifecycle holds on the state it silently assumed; one sentence in section B should say why.
4. READ source-admission.mjs:749-829: the public api.prepareSource drops the third argument, so only reopen and
   rollback can pass existingSelection; the guard reads the review-time generation under current(held), and M's
   prequalified race shows CAS (STALE_REVISION) covering the window. I found no public road around the guard.
## NAMED DEBT (mine)
D-EW2-REACH WHO ACTUALLY MEETS THIS SENTENCE. import-screen.mjs:626-627 shows no chooser when admitted() is
  true, and today-app.cjs:2482-2488 sets that flag from admittedLocalSourceState(setup), which "refuses on any
  doubt and never throws" and is wrapped in catch(() => null). So through the real screen the guard is reached
  in exactly one state: a selection IS committed, but the basis read doubted it (marker, the three bases,
  installation, state shape or label). In that state Today paints clean-init, his imported history is NOT
  showing, the import link is offered, the same file answers LOCAL_IMPORT_ALREADY_PRESENT and a different file
  answers the PROPOSED "This phone already uses one history file, so importing another is not available yet."
  True of the record, false to what he sees, and it leaves him no road. The guard is still right: it protects
  the record, and nothing is published. But the paper never names this reach (section A says only that the
  presentation guard "supplies no named admission refusal"), and Joe is being asked to rule on a sentence
  without being told the only screen on which it can appear. READ, not executed by me: a debt, not a blocker.
  OWED: the next paper revision states the reach in one plain paragraph; B1a or L1's D3 gains a row that
  drives the REAL screen in the adoption-doubt state (selection committed, admitted() false) through pick,
  refusal, retract and redraw; and the copy goes to Joe WITH that context, so he can choose between this
  sentence and one that also says his first history is kept but could not be opened.
  PAYS: the paper revision before B1a is briefed; the row inside B1a / D3.
## NOTES (not debts)
N1 The refusal comes late by design: after the identity question, after file B's original is written to
   encrypted custody (it stays; retract deletes nothing) and, on a mixed history, after the prefix question.
N2 After a refused B is retracted its NAME stays taken (import-bundle.mjs:62-69): other bytes under that name
   refuse LOCAL_IMPORT_NAME_TAKEN; the same bytes re-stage. Section F's open door should list it as a sixth item.
## WHAT I DID NOT DO
M not run; no inherited ew2b or real-port cell run; no oracle, port, seal, CI, linux, browser or phone.
No private fixture, ledger directory, old-app source or real measurement was opened or reached by any process.
To run P I added three ignored node_modules junctions to my own lane worktree, as pm4-mk-lane.cmd does.
