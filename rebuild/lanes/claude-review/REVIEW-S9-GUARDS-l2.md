# CLAUDE REVIEW: S9-GUARDS, round 2 (the D-S9G-DECOY fix)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; author of round 1 (17105820), not of this fix.
Asked at DECISIONS:669, class (b), narrow reader correction. Run on Joe's word "review".
Head 1e978224f86820f4cd549fd177b54cdc8d637947, base cf4fc766b7e7ab711eaa9a13257df3b25db70d00, red 747de184.
Brief sha256 re-measured on the PC d8140074ccccfc2cbbbdcc011974981907e71c141a246625308adbe10c31300d (equal to :669),
not read whole. Owner's PC, Node v24.19.0, PC clock 2026-09-21 19:28 to 19:31 ET. Fresh scratch %TEMP%\claude-r2;
nothing under claude-epp was read or run (:658). Author report (45 lines) and Astra ef89a23a (47) read whole AFTER.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. D, E and F are closed at all five readers, the real workflow passes every one of
them, and I found no decoy of the ordered class that survives. One neighbour of the same class survives
(continue-on-error), outside what :658 ordered; it is a one-line refusal and I name it rather than let it ride
into the pins unsaid.
## EVERY HUNK, all read (4 paths, +243 -58; NO product, workflow, runner, pin or engine byte)
pack-pin +65 -14, release-object +63 -13, fence +76 -25: each gains assertConditionedRun (the fence's is the
same text inside conditionOfStepRunning, now taking the yml lines as an argument), a decoyWorkflows fixture
and one D-S9G-DECOY row; each old reader call is replaced by the new one. The three matchers are unchanged.
S9-GUARD-DECOYS-REPORT.md +45. The three copies of the reader are byte-identical to each other (read side by side).
## WHAT I RAN (no cell, no real row; one probe of mine lifts assertConditionedRun and the matcher byte for byte from
## the head's pack-pin.test.mjs and executes them over synthetic workflow text, then over the real rebuild.yml)
   control  exact permitted step                                       ACCEPTED
   D        env key named if, no step condition                        REFUSED  must carry exactly one step-level if
   E        the decoy key, then the real  if: ${{ false }}             REFUSED  the condition is not not-cancelled
   F        earlier echo step with a good if, real step if false       REFUSED  the condition is not not-cancelled
   H        if: written before name: (valid YAML, step not found)      REFUSED  expected exactly one node --test step
   J        two files on one run line, target second                   ACCEPTED (the real pack and passphrase steps)
   K        run: | with the command on the next line                   REFUSED  (safe side: no owner found)
   L        if nested under with: plus a good step-level if            ACCEPTED (right: the nested one is not a condition)
   M        timeout-minutes beside a good if                           ACCEPTED (right)
   N        tab-indented if                                            REFUSED  (safe side)
   I        continue-on-error: true beside a good if                   ACCEPTED  <- the debt
   REAL rebuild.yml at this head, all five files (fence, pack-pin, release-object, passphrase helper,
   local-import):                                                       ACCEPTED, each with exactly one owner
   Every refusal is by name. H, K and N refuse a workflow a hand might honestly write; the message says why.
## NAMED DEBT
D-S9G-CONTINUE A step that runs the cell under  if: ${{ !cancelled() }}  but also carries  continue-on-error: true
  keeps every row green while the cell's failure no longer fails the job. Same silence, one key over. The real
  workflow carries no continue-on-error anywhere (fixed-string search of rebuild.yml: 0), so nothing is wrong
  today. Smallest shape: in assertConditionedRun refuse any  continue-on-error:  at the run indentation inside the
  owning block, one synthetic row per cell. Outside :658's order, so the PM decides whether it rides S9's pins or
  the S10 brief; my view is S9, because a re-pin later costs more than the three lines now.
## NOTES
N1 The reader recognises only  run: node --test <files>  on one line at the step's own indentation. That is the
   grammar of every step in rebuild.yml today; a later hand who reformats a step (run: |, an if: before name:)
   gets a by-name refusal, not a silent pass. Good trade, and Astra's L1 says the same.
N2 The author's base red stopped at the fence loop's first D; Astra's per-reader evidence and my table above
   cover E and F at every reader. Nothing owed there.
## NOT DONE
No cell run, no real fence or pack row, no CI, no linux, no seal tooling, no mutants of my own (Astra's 55 not
re-run). No protected path, private fixture, ledger directory, old-app source, accidental log or real
measurement was opened or reached by any process of mine.
