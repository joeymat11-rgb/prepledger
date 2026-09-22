# CLAUDE REVIEW: S9-GUARDS, round 3 (the D-S9G-CONTINUE fix)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; author of rounds 1 and 2, not of this fix.
Asked at DECISIONS:714, class (b), D-S9G-CONTINUE only. Run on Joe's word "review". STATIC ONLY as ordered.
Head f123133922868ea2a976e399e5b8abb133a3d540, base 1e978224f86820f4cd549fd177b54cdc8d637947, red dd973e3.
Brief sha256 re-measured d8140074ccccfc2cbbbdcc011974981907e71c141a246625308adbe10c31300d (equal to :714); not read whole.
Owner's PC, Node v24.19.0, PC clock 2026-09-21 22:40 to 22:44 ET. Scratch %TEMP%\claude-r2; nothing under claude-epp (:658).
Author report (60 lines) and Astra 6244696 (31 lines) read AFTER my own reading of every hunk.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. The ordered key is refused at all five readers, by name, in either value, and the real
workflow passes every reader. One spelling of the same key still passes; three characters close it.
## EVERY HUNK (4 paths, +170 -0; NO product, workflow, runner, pin or engine byte)
pack-pin +34, release-object +33, fence +43: each reader gains, between the glob test and the condition test, a
filter for  continue-on-error:  at the run indentation and refuses when it finds one, message
STEP-CONTINUE-ON-ERROR-FORBIDDEN; decoyWorkflows gains grouped, siblingContinue, nestedContinue, continueTrue,
continueFalse; one D-S9G-CONTINUE row per cell (the fence's runs all three of its files). The three reader copies
stay byte-identical to each other. S9-GUARD-CONTINUE-REPORT.md +60. Nothing weakened, nothing removed.
## WHAT I RAN: no cell. One probe of mine lifts assertConditionedRun and the matcher byte for byte from the head's
## pack-pin.test.mjs and runs them over synthetic workflow text, then over the real rebuild.yml.
   control                                             ACCEPTED
   I   continue-on-error: true  at the step level      REFUSED by name   (the ordered debt: CLOSED)
   I2  continue-on-error: false                        REFUSED by name   (deliberate: the key itself is forbidden)
   I3  continue-on-error: ${{ true }}                  REFUSED by name
   I4  the key written after the run: line             REFUSED by name
   I6  the key nested under env: (not a step key)      ACCEPTED (right)
   I7  a sibling step carries it                       ACCEPTED (right: another step's business)
   I8  timeout-minutes beside a good if                ACCEPTED (right)
   I5  "continue-on-error": true  (quoted key)         ACCEPTED  <- the debt
   REAL rebuild.yml, all five files: ACCEPTED, and the file holds no continue-on-error at any level (0 lines).
## NAMED DEBT
D-S9G-QUOTED-KEY  "continue-on-error": true  and  'continue-on-error': true  are the same YAML key as the bare one,
  and GitHub reads them the same; the reader's  /^(\s*)continue-on-error\s*:/  does not. The if: reader has the same
  blind spot but falls safe (a quoted if: is simply not found, so the step has no condition and is refused); the
  continue reader falls open. Smallest shape: allow an optional matching quote pair round the key in that one regex,
  with a quoted-key row beside continueTrue in each cell. PAYS: before the S9 pins, since the PM has already put
  this reader on the seal path; three copies, one line each.
## NOTES
N1 One level up, jobs.<id>.continue-on-error: true would let the job fail and the run still conclude success. The
   step readers cannot see job keys and should not grow into a workflow parser. The cheaper closure is in the
   rule of :627: the CI sentence names the JOB conclusion for each pinned cell, not the run's. For the S9 brief.
N2 Refusing false as well as true is right: the key has no honest use on these steps, and a value check would
   invite the next round (${{ vars.X }}).
N3 Each round of this debt has closed the named hole and left a neighbour: matcher, decoys, continue, now quoting.
   The readers are good enough to pin once D-S9G-QUOTED-KEY lands; further hardening belongs in C-UI-GATES-2 as a
   single allowlist of step keys, not another S9 round.
## NOT DONE
No cell run, no real fence or pack row, no CI, no seal tooling; Astra's 3 kills and pure-220 not re-run. No protected
path, private fixture, ledger directory, old-app source, accidental log or real measurement was opened or reached.
