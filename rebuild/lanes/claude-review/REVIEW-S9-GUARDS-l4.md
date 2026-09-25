# CLAUDE REVIEW: S9-GUARDS, round 4 (the D-S9G-QUOTED-KEY fix)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; named the debt at be33f0d, wrote no byte of the fix.
Asked at DECISIONS:743, class (b), D-S9G-QUOTED-KEY only. Run on Joe's word "review". STATIC ONLY as ordered.
Head fb9996451b0fbd2964c7c91cd4472f7fe8e29a9c, base f123133922868ea2a976e399e5b8abb133a3d540, red bf520db.
Brief caa0abf:rebuild/lanes/b/S9-UI-PINS-BRIEF.md sha256 re-measured abf3f670835803b94ac768bf0c0b0a0de5d2570302abd7651179e9005efb3f58,
equal to :743. Owner's PC, Node v24.19.0, PC clock 2026-09-22 14:05 to 14:08 ET. Scratch %TEMP%\claude-r3 only.
Author report (58 lines) and Astra 8aa3946 (56 lines) read whole AFTER my own reading and probe.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. The debt I named is paid exactly in the shape I gave: paired quotes, three copies,
refused by name, real workflow still passes. My probe found a hole in the same readers that no earlier round
tried (mine included): a comment line ends the step block early, so a key after it is not seen.
## EVERY HUNK (4 paths, +183 -3; NO product, workflow, runner, pin or engine byte)
pack-pin +40 -1, release-object +39 -1, fence +46 -1: in each reader the one continue-key regex becomes
  /^(\s*)(?:continue-on-error|"continue-on-error"|'continue-on-error')\s*:/  (one line; unmatched quotes do not match);
  decoyWorkflows gains seven quoted worlds; one D-S9G-QUOTED-KEY row per cell (the fence's runs its three files).
S9-GUARD-QUOTED-KEY-REPORT.md +58. Nothing removed, no expectation weakened, no if: or matcher change.
The three regex lines are byte-identical (measured 1/1/1). Candidate sha256 of all three cells re-measured equal
to the author's report and to Astra's (22569236..., 22f4ce0a..., 1ba03267...).
## WHAT I RAN: no cell. probe4.mjs (mine, in claude-r3) lifts conditionIsNotCancelled plus assertConditionedRun
## (pack, release) and conditionOfStepRunning plus assertNotCancelled (fence) byte for byte from the head, runs
## them over synthetic step text, and asks the yaml 2.9.0 parser (existing node_modules, no install) what the key is.
   world                                                   yaml says   pack / release / fence
   control                                                 no key      ACCEPTED x3 (right)
   "continue-on-error": true  (the debt)                   true        REFUSED BY NAME x3 (D-S9G-QUOTED-KEY: CLOSED)
   dash-first  - continue-on-error: true                   true        REFUSED, other name x3 (falls safe)
   COMMENT CUT, col 6: run, "      # note", then the key   true        ACCEPTED x3   <- the debt
   COMMENT CUT, col 0: same with "# note" at column 0      true        ACCEPTED x3
   escaped key  "continue-on-error": true             true        ACCEPTED x3   (note N1)
   explicit key  "? continue-on-error" then ": true"       true        ACCEPTED x3   (note N1)
   21 outcomes, 7 worlds x 3 readers. REAL rebuild.yml: 443 lines, 0 continue-on-error lines, 339 indented comments.
## NAMED DEBT
D-S9G-COMMENT-CUT  The block walk stops at the first non-blank line indented at or left of the "- name:" dash;
  a YAML comment is such a line, but YAML ignores comments at any column, so keys after it still belong to the
  step. The if: side falls safe (no condition found, refused); the continue side falls open. Indented comments are
  this workflow's house style (339), so this is an ordinary edit, not an exotic one. Smallest shape: in the one
  while condition of each copy, also step over comment-only lines (/^\s*#/), plus one comment-cut world beside
  quotedDoubleTrue in each cell, red first. PAYS: the same Sol, before the S9 pins; three copies, one clause each.
  It needs no separate Claude round: I check it inside the Claude final read before the seal.
## NOTES (not blockers)
N1 The escaped and explicit-key spellings are real YAML and fall open too, but no one writes them by accident.
   They and the comment cut close together only when the reader stops matching lines and reads parsed YAML
   (yaml is already in the junctioned node_modules). That is C-UI-GATES-2, as be33f0d N3 said.
N2 Astra's 270 probes and 60 callbacks cover spelling and nesting well; none varies the block boundary. Same
   for the author's rows. Nothing in either report is wrong; the gap is the input no one tried.
N3 be33f0d N1 (job-level continue-on-error; the CI sentence names the job conclusion) still stands for S9.
## MY MISTAKE
At round 3 I lifted the same block walk and did not try a comment. The hole was there then.
## NOT DONE
No cell run, no real fence or pack row, no CI, no seal tooling; the author's and Astra's runs not repeated.
No protected path, private fixture, ledger directory, old-app source, quarantined scratch or real measurement
was opened or reached.
