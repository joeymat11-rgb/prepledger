# rebuild/improve/tools

derive-metrics.cjs (DECISIONS:824 (d)): pure node, no dependencies, loads nothing under rebuild/engine. Run it only through `node %TEMP%\pm-run.cjs shared <job> <cmd file>`.
`node derive-metrics.cjs [ref=refs/remotes/origin/rebuild/t2-client-core] [extra refs...] [--out path]` writes rebuild/improve/METRICS.csv (never hand-edit it; rerun instead).

What it derives, one row per review .md under rebuild/lanes/fable/reviews, rebuild/lanes/astra/reviews and rebuild/improve/reviews (git ls-tree with explicit paths; first ref wins):
- file, reviewer (Fable/Astra from the path), round (-L<n>/-l<n> suffix), stem (ticket key = file name minus the round suffix), ref;
- verdict_class from the first `Verdict:` line in the file's header block (pass 2, D-DERIVE-1: from line 1 up to the first `##` (or deeper) section heading that is not itself a verdict line, at most 40 lines; pass 1 used a fixed 12-line window and missed REVIEW-S9-BLOM-2B-l1.md's `## VERDICT:` at line 14), mapped by the explicit TABLE to ACCEPT / ACCEPT WITH NAMED DEBTS / NOT READY / REJECT; legacy words NEEDS CORRECTION, BLOCKED, USABLE WITH FIXES -> NOT READY; PASS, STATIC ACCEPT, READY TO PUSH -> ACCEPT; PASS WITH FINDINGS -> ACCEPT WITH NAMED DEBTS; anything else UNKNOWN. Lines after the header block are only counted (verdict-shaped lines, printed as a self-check), never parsed or written;
- required_change (pass 2, D-DERIVE-2, DECISIONS:824 (a)): yes for NOT READY and REJECT, no for ACCEPT and ACCEPT WITH NAMED DEBTS, empty for UNKNOWN or no verdict line (never 0). It is derived from the class only: an ACCEPT verdict whose text names required edits (e.g. "WITH REQUIRED FORMAL AMENDMENTS") is still `no`; the PM reads verdict_text for those;
- mixed = 1 when the verdict line names more than one keyword family (e.g. "ACCEPT X only; NOT READY as Y"): the class is still read from the lead words, so the PM should read those rows;
- debt_ids = distinct D-* ids on the verdict line (D-X-1..4 counts 4), first_commit_date = oldest add commit of the path (--no-renames).
- Printed per stem: files, rounds, first-round class (the L1 row only), final class (highest round).
Unknown is empty, never zero: no verdict line in the header block leaves class, required_change and debt_ids empty; no L1 file leaves the first-round class empty. No row is ever dropped: a stem with no later round (abandoned or still open) keeps its row.

Test: `derive-metrics.test.cjs` (pass 2) runs the script end to end on 8 invented review files through a fake git (one tiny node file per git verb in a temp folder; no repository is read or written) and checks the verdict-at-line-14 row, the required_change values and that unknown stays empty. `DERIVE_SCRIPT=<path>` points it at another copy (red-first: the pass-1 script fails 9 checks).
Committed METRICS.csv (pass 2): generated from this branch's own files at d78d5f0 (`node derive-metrics.cjs d78d5f0`): 78 rows, 71 stems.

Next pass:
- the S10 seal review files are on the chain (rebuild/t2-client-core), not on this branch; they are not imported here. Regenerate with the chain ref once rebuild/improve is rebased or merged;
- a required-edits flag read from ACCEPT verdict text (e.g. REVIEW-S9-VERDICT-l1, CUI-SEQUENCING-AMENDMENT-REVIEW-L1) needs an explicit vocabulary entry first; not guessed now;
- join the dispatch and return fields below once the PM's records exist in a readable file.

Refusal list: any listed path matching private, soak, EarnedPort, src/ or ledger is skipped before any read and counted as refused. Non-.md annexes are skipped and counted.

What it cannot derive (not recorded yet): escaped defects after a seal, Joe interrupts (only questions Joe himself labels unnecessary count), cost per ticket (tokens, wall clock), abandoned work with no review file, and reopenings not visible as a later round file. L1 in a file name is not proof of a first-pass ticket; a stem is a naming convention, not a ticket id.

Dispatch and return fields the PM now records on every dispatch and return line (DECISIONS:824 (b)), for a later version of this script to join:
ticket, round, prior round, input head, start time, return time, model, effort.
