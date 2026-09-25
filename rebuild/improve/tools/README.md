# rebuild/improve/tools

derive-metrics.cjs (DECISIONS:824 (d)): pure node, no dependencies, loads nothing under rebuild/engine. Run it only through `node %TEMP%\pm-run.cjs shared <job> <cmd file>`.
`node derive-metrics.cjs [ref=refs/remotes/origin/rebuild/t2-client-core] [extra refs...] [--out path]` writes rebuild/improve/METRICS.csv (never hand-edit it; rerun instead).

What it derives, one row per review .md under rebuild/lanes/fable/reviews, rebuild/lanes/astra/reviews and rebuild/improve/reviews (git ls-tree with explicit paths; first ref wins):
- file, reviewer (Fable/Astra from the path), round (-L<n>/-l<n> suffix), stem (ticket key = file name minus the round suffix), ref;
- verdict_class from the first `Verdict:` line in the first 12 lines (git show REF:path, the rest is discarded), mapped by the explicit TABLE to ACCEPT / ACCEPT WITH NAMED DEBTS / NOT READY / REJECT; legacy words NEEDS CORRECTION, BLOCKED, USABLE WITH FIXES -> NOT READY; PASS, STATIC ACCEPT, READY TO PUSH -> ACCEPT; PASS WITH FINDINGS -> ACCEPT WITH NAMED DEBTS; anything else UNKNOWN;
- mixed = 1 when the verdict line names more than one keyword family (e.g. "ACCEPT X only; NOT READY as Y"): the class is still read from the lead words, so the PM should read those rows;
- debt_ids = distinct D-* ids on the verdict line (D-X-1..4 counts 4), first_commit_date = oldest add commit of the path (--no-renames).
- Printed per stem: files, rounds, first-round class (the L1 row only), final class (highest round).
Unknown is empty, never zero: no verdict line in the first 12 lines leaves class and debt_ids empty; no L1 file leaves the first-round class empty.
Refusal list: any listed path matching private, soak, EarnedPort, src/ or ledger is skipped before any read and counted as refused. Non-.md annexes are skipped and counted.

What it cannot derive (not recorded yet): escaped defects after a seal, Joe interrupts (only questions Joe himself labels unnecessary count), cost per ticket (tokens, wall clock), abandoned work with no review file, and reopenings not visible as a later round file. L1 in a file name is not proof of a first-pass ticket; a stem is a naming convention, not a ticket id.

Dispatch and return fields the PM now records on every dispatch and return line (DECISIONS:824 (b)), for a later version of this script to join:
ticket, round, prior round, input head, start time, return time, model, effort.
