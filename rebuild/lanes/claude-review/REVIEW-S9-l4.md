# CLAUDE REVIEW: S9, round 4 (the P-S9-2 reference reader, and the :732 sequencing fold into seven papers)
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1; no hand in the reader, the fold or their reviews.
Asked at DECISIONS:735, class (b). Run on Joe's word "review". STATIC ONLY as ordered.
READER: rebuild/c-s9-reference-closure, head b9ea32f3325e0a4467d2975a3db81ca7f548a12f, base f123133 (the :714 head),
red 43d5a47. FOLD: rebuild/pm-cui-sequencing-papers, caa0abf05c4a61a4b932bd24f1a2249a3791c8af, parent f123133.
S9 brief sha256 at caa0abf re-measured abf3f670835803b94ac768bf0c0b0a0de5d2570302abd7651179e9005efb3f58 (equal to :735).
PC clock 2026-09-21 22:45 to 22:52 ET. Scratch %TEMP%\claude-r2; nothing under claude-epp read or run (:658).
Author report (51 lines), Astra 72c984f (reader) and 30bdbe4 (fold) read AFTER my own reading of every hunk.
## VERDICT
ACCEPT WITH ONE NAMED DEBT. The reader pins the four documents the brief says it must, with hashes I re-derived
from Git myself; the fold changes sequencing text only and weakens no check. The debt is about where the folded
tickets live, not what they say.
## THE READER (f123133..b9ea32f: reference-closure.test.mjs +78, author report +51; no product, runner or pin byte)
Read whole. Four references, each a literal relative new URL and a sha256 literal; one production row reads all
four and requires no refusal, asserts the path list equals a second literal list, and counts the reads; four rows
plant "constructed change" on one document each and require D-REFERENCE-CLOSURE CHANGED <path>. Imports: node
assert, test, crypto, fs. No network, no repository module, no runner.
MY OWN MEASUREMENT: sha256 of the four blobs as Git holds them at f123133: fddfe054..., caf9c2dc..., a0963e54...,
cdf8eb5c... equal the cell's four literals, and the four blob ids are identical at f123133, caa0abf, b9ea32f and
the chain tip c705307a. So the pin is of the documents as they stand everywhere today.
FIT TO THE FOLD: the fold's 2.4.1 and 11.2 say S9 retains exactly these four 09-08 references and that P-S9-2 must be
accepted before S9; the reader is that acceptance's object. Consistent. The reader is not yet declared in S9.json
and executedClosure is not re-measured: the author and Astra say so, and the brief assigns both to integration.
## THE FOLD (caa0abf~1..caa0abf: 7 files, +557 -35; papers only)
S9-UI-PINS-BRIEF +112 -35: a "Binding sequencing amendment, DECISIONS:732" section; 2.1, 2.4.1, section 5, the
  STOP-10 sentence, D-REFERENCE-CLOSURE's quoted debt, 9 items 3 / 17 / 18, 11.2 and 11.5 rewritten so CUI1 product
  and reference promotion leave S9 and go to a later named reseal child; the status line no longer says DRAFT.
  Every check list I read keeps its members: STOP eleven stays eleven, the six pinned-unchanged stay six, both-OS
  and exact-head stay, "measure this final accepted brief's actual SHA before any token" is added, not removed.
S10-WORKING-BRIEF +20 -3 against its accepted ffc10ea blob (not a new paper: the whole file appears in the stat
  because the PM branch had none): the S9-parent and C-UI input rows, step 12.1, and a closing boundary section.
  Accepted CUI1 stops being an S10 prerequisite; GSS, source closure and the copy lock remain STOPs.
C-UI-1, -2, -3, -4, -6 +20/+19/+18/+18/+22: against their 8719230 source each loses only its old SEQUENCING line
  (C-UI-1 also its old WHY and LOCKED lines) and gains SEQUENCING (:732), ACCEPTANCE BOUNDARY and PIN PROMOTION.
  The acceptance bullets and locks are byte-identical to the source. Read all five, both versions.
One reading of the whole: the fold says the same thing in seven places and contradicts itself nowhere I found;
it is the disposition a12be09 and review 9ece212 carried into the papers, not new policy.
## NAMED DEBT
D-FOLD-TWO-COPIES The five C-UI tickets now exist in two versions: the folded text on rebuild/pm-cui-sequencing-papers
  and the pre-fold text at 8719230 on rebuild/c-ui1-design, the base the CUI1 builder was dispatched from (:696).
  A builder or reviewer reading the ticket in that lane still sees "SEQUENCING: first. Pins move in this ticket
  only." Until the folded papers reach the branch each hand actually reads, or the ledger names the folded blob as
  the ticket of record, the fold binds on paper and not in the lane. Smallest shape: merge or cherry-pick caa0abf's
  five ticket files into rebuild/c-ui1-design (and the S9 lane for the brief) before the next dispatch, and say
  which blob is the ticket of record in the dispatching line. PAYS: the PM, before the next CUI dispatch.
## NOTES
N1 The reader's changed-document rows patch the read function, not the file, so the working tree is never touched;
   the one live read is of the four documents themselves. Fine for a cell that will run in CI at the S9 head.
N2 "The approved look and phone-earned weights precede Joe's trial; father's follows" appears in three papers. It is
   the owner's order as recorded (:631, :668, :680), not a schedule; the papers say so.
## NOT DONE
No cell run, no runner, no CI, no seal tooling; Astra's 5/5 and 17/17 not re-run. The other S9 papers the
disposition names (S9-RELEASE-SPEC C.5.3, E.2) were not opened; :735 asks for the fold commit only. No protected
path, private fixture, ledger directory, old-app source or real measurement was opened or reached.
