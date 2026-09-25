# REVIEW-IMPROVE-DERIVE-l1: derive-metrics.cjs (DECISIONS:824 (d)), independent check, round 1
VERDICT: ACCEPT WITH NAMED DEBTS (D-DERIVE-1, D-DERIVE-2)

Reviewer: Claude Fable 5.1, independent (did not write the tool); static reads only, no node run, no slot taken.
Inputs (untracked in worktree earned-improve; sha256 by certutil, all three match the builder's report):
derive-metrics.cjs d0c549d3...f80556 (127 lines); tools/README.md ca9cc2cd...e28f (18 lines); METRICS.csv 50965d1d...b180a
(77 rows + header). Authorities: DECISIONS:822 and :824; both Phase 0 reviews (Fable c69d0ffa, Astra 424b9dcc).

## Checks
1. Paths read: git rev-parse; ls-tree -r --name-only REF -- <3 review dirs>; log --name-only -- <same dirs> (metadata only);
   show REF:path only for paths from that ls-tree that passed REFUSE. No other read; the only write is the --out CSV. PASS.
   git show streams the whole blob and the script keeps 12 lines (disclosed in README).
2. Refusal: REFUSE = /private|soak|earnedport|src\/|ledger/i runs on every listed path before any show. The live run refused 0
   (no such path exists there), so I ran the same regex on 7 synthetic paths in PowerShell: *SOAK*, PRIVATE-*, .../src/x.md,
   .../ledger/a.md, EarnedPort-* refused; REVIEW-S9-SOURCEBASE-l1 and S9-SOURCE-CHECKER-REVIEW-L1 ("source") pass. PASS.
3. Vocabulary: TABLE is explicit (14 prefixes, longest first, ^prefix\b, case-insensitive); no entry => UNKNOWN; no verdict
   line => empty. In the CSV "ADOPT SMALLER" (both blueprint reviews), "G4 PASS; G5 REJECT", "one small normalization
   correction remains", "G6 VALID PRODUCT RED" are all UNKNOWN, never guessed. PASS. BLOCKED -> NOT READY and PASS -> ACCEPT
   are reasonable builder choices; "no ACCEPT" is correctly ignored by the mixed flag.
4. Five files hand-checked (first 12 lines via git show, explicit path): C-UI-HARNESS-REVIEW-L1 = NOT READY, mixed 1 (the
   word "pass" in "pass claim", disclosed false positive); REVIEW-S9-SEAL-l1 = ACCEPT WITH NAMED DEBTS, debt_ids 4 from
   D-S9SEAL-1..4; GYM-SETTINGS-WRITER-SEAL-REVIEW-L3 = PASS -> ACCEPT; CUI1-INTERFACE-PREFLIGHT-L1 = BLOCKED -> NOT READY,
   mixed 0; REVIEW-S9-BLOM-2B-l1 = empty. All five CSV rows match the files.
5. Counts: 77 md rows, 70 stems, 9 empty rows; git grep for a verdict line over the 9 empty files finds exactly one (below).

## Named debts (fix the script and rerun; never hand-edit the CSV)
- D-DERIVE-1: the 12-line window misses REVIEW-S9-BLOM-2B-l1.md line 14 "## VERDICT: ACCEPT WITH NAMED DEBTS"; the row is
  empty, so that class counts 5 where the files say 6. Widen the window (20) or scan to the first heading after the title.
- D-DERIVE-2: :824 (a) asks for a required-change flag; there is no column. REVIEW-S9-VERDICT-l1 ("E1-E4 required edits
  before commit") and CUI-SEQUENCING-AMENDMENT ("WITH REQUIRED FORMAL AMENDMENTS") are classed plain ACCEPT.
Not verified: the node run itself (builder reports exit 0 via pm-run shared); first_commit_date values; the other 72 rows.

## AAR
asked: independent check of derive-metrics.cjs, README and METRICS.csv (allowlist, refusal, vocabulary, 5 hand counts).
happened: all checks pass; two debts found (one verdict below line 12 missed; no required-change flag column).
rework: none of mine; the builder owes one small script change and a rerun.
escaped: unknown; 5 of 77 rows hand-checked, refusal branch exercised on synthetic paths only.
lesson: a fixed line window silently turns a real verdict into unknown; print verdict lines found vs files as a self-check.
cost: about 15 minutes wall clock, 9 tool calls, no runtime slot.
