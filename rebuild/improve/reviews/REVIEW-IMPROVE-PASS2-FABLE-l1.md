# REVIEW-IMPROVE-PASS2-FABLE-l1: blueprint Phase 1 pass 2 (D-DERIVE-1, D-DERIVE-2)

Verdict: ACCEPT WITH NAMED DEBTS (D-DERIVE-3, D-DERIVE-4)

Reviewer: Claude Fable 5.1 (independent, blind to the builder's reasoning). Date: 2026-09-26.
Object: the uncommitted changes in the earned-improve worktree at d78d5f0: rebuild/improve/tools/derive-metrics.cjs (M),
rebuild/improve/tools/derive-metrics.test.cjs (new), rebuild/improve/METRICS.csv (M), rebuild/improve/tools/README.md (M).
Required-change flag: none. The two named debts are disclosures for the next pass, not blockers.

## Object hashes (sha256, LF, ASCII, CR=0, non-ASCII=0 on every file)

- tools/derive-metrics.cjs       9937 bytes  15352605e7da64c22efdda68b937422059856d0de6263b3884844c0ae0b80308
- tools/derive-metrics.test.cjs  7187 bytes  bcfd2a465f38771821cd449a5aeabcf9bd76cbf62c043ec5a438339365d644e5
- tools/README.md                4206 bytes  ff630e3363c856b2b4b8ff4e9d3c424127d2ae71e2322aab5c287efd93e492b4
- METRICS.csv                   16701 bytes  ee42ff1446945e7fb95e0982965eb9f2bc255e65cbc15f24cc26c0278df073e5

## What I ran (one shared slot, job bp2-fable-review, one node process at a time, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)

Cmd file C:\Users\joeym\AppData\Local\Temp\bp2-check\bp2.cmd, log C:\Users\joeym\AppData\Local\Temp\bp2-check\run.log.
1. node derive-metrics.test.cjs against the pass-2 script: 11/11 PASS (T0-T10), exit 0.
2. Red-first: the pass-1 script extracted byte-exact from d78d5f0 (cmd /c git show > file), same test with
   DERIVE_SCRIPT pointed at it: 9 FAIL / 2 PASS, exit 1. Failing cells: T9 (no required_change column), T1 (verdict at
   line 14 read as empty class), T7 (a body-only "Verdict: REJECT" at line 5 was read as the header verdict), T2-T6 and
   T8 (required_change undefined). T0 and T10 pass on both scripts, as they should (the fixture and row count did not change).
3. node derive-metrics.cjs d78d5f0 --out C:\Users\joeym\AppData\Local\Temp\bp2-check\METRICS-regen.csv: exit 0,
   listed=140 refused=0 annex_skipped=62 md_rows=78 stems=71.
4. certutil sha256 of the regenerated file and of the worktree METRICS.csv: both ee42ff14...73e5; fc /b: no differences.

## Checks

D-DERIVE-1 (header verdict below the 12-line window) - PAID, red-first. The script now reads the header block (line 1
up to the first ## or deeper heading that is not itself a verdict line, HEADER_MAX 40). Test T1 plants a "## VERDICT:"
heading at line 14 with 12 non-heading preamble lines; pass-1 fails it (class empty), pass-2 passes. On the real tree the
script reports exactly one such file (REVIEW-S9-BLOM-2B-l1.md:14) and 0 verdict-shaped lines after any header block, so the
header rule loses nothing today. The new SECTION guard is an actual evaluated path: T7 proves a verdict-shaped line quoted in
the body is no longer taken (pass-1 took it).

D-DERIVE-2 (required_change column) - PAID, red-first. REQUIRED maps ACCEPT and ACCEPT WITH NAMED DEBTS to no, NOT READY
and REJECT to yes, UNKNOWN and no-verdict to empty. T2, T3, T4, T8 cover the four classes; T5 and T6 cover the two empties;
T9 checks the column exists. Pass-1 fails all of them.

METRICS.csv is derived - CONFIRMED by bytes (step 3-4). The committed CSV at d78d5f0 was generated from
origin/rebuild/t2-client-core; the pass-2 CSV is generated from d78d5f0 itself (ref column now reads d78d5f0), which the
README states. No row dropped: 78 rows before and after (79 insertions / 78 deletions in the diff = header line plus the
new column on every row).

Unknown is never zero - CONFIRMED on the real CSV (PowerShell Import-Csv, 78 rows): 0 rows with an empty or UNKNOWN class
and a non-empty required_change; 0 rows with an empty class and a non-empty debt_ids or mixed; 0 rows with
required_change=0. required_change tally: empty=15 (8 no-verdict + 7 UNKNOWN), no=57, yes=6. The six yes rows are the four
NOT READY and two REJECT rows.

No protected or private source read - CONFIRMED by reading the script: git ls-tree / log / show are always given the three
explicit review DIRS or a listed path from them; REFUSE (/private|soak|earnedport|src\/|ledger/i) is tested on every listed
path before any read (refused=0 on this tree); nothing under rebuild/engine is required or executed; the test runs the script
only through a fake git (one node file per verb in a temp folder), so no repository is touched by the test at all. Every
fixture line is invented; no real review text, ticket or measurement is in the test.

Nothing weakened: no existing row or check was removed; the pass-1 TABLE, mixed logic and debt-id expansion are unchanged.

## Named debts (numbers proposed; the PM assigns)

D-DERIVE-3: required_change on a mixed verdict is read from the lead words only. Real row
rebuild/lanes/astra/reviews/S9-RUNTIME-PACKET-REVIEW-L1.md is mixed=1, class ACCEPT, required_change=no although its
verdict text says NOT READY for the execution grant. The README discloses the "REQUIRED FORMAL AMENDMENTS" variant of this
but not the mixed-row variant. Next pass: either leave required_change empty when mixed=1, or add an explicit rule, with a
red-first fixture row.

D-DERIVE-4: the committed CSV is generated from this branch (d78d5f0), not the chain tip; the S10 seal reviews on
rebuild/t2-client-core (a04cb83) are not in it. README already names this under "Next pass". Regenerate with the chain ref
after rebase or merge and record the new hash.

Observation, not a debt: a review whose verdict sits after a non-verdict section heading (e.g. "## Scope" then
"Verdict: ...") is classified empty by design; the body counter (0 today) is the self-check that would surface it.

## AAR

1. Outcome: ACCEPT WITH NAMED DEBTS (D-DERIVE-3, D-DERIVE-4); no required change.
2. Evidence: 11/11 pass on pass-2, 9/11 fail on pass-1 (real red), regenerated CSV byte-identical (sha256 ee42ff14...73e5).
3. What surprised me: T7 was red on pass-1 too; the 12-line window had been reading body-quoted verdicts as headers.
4. What I could not do: verify the chain-tip CSV (branch is behind the chain; not my role to fetch or rebase).
5. Cost: one shared slot, one cmd file, about 15 s of node; no exclusive run needed.
6. Next: PM assigns the debt numbers, commits the four files, and schedules the mixed-row rule for pass 3.
