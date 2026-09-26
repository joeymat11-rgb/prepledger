# REVIEW-S10-SEAL-PREP-l1 - independent Fable check of the S10 seal-prep artifacts (Claude Fable 5.1, 2026-09-25)

VERDICT: ACCEPT WITH NAMED DEBTS (D-SP-1..D-SP-6 below; none blocks T5/T6a/T6b).
Role: independent checker (did not write any prepared artifact). STATIC ONLY: git show/diff/log/status/rev-parse/cat-file/ls-tree by
explicit path, node fs/crypto, read_file. No test, child, runner, b-package, REGEN, T5-make.cjs, T6-apply.cjs or census.cjs was run.
Nothing committed or pushed; W (%TEMP%\earned-s10int) untouched. New files written ONLY under %TEMP%\s10-seal-prep\checker\ (section 6).
Rules file opus55-RULES.txt read whole, sha256 51706c33... (5367 B) - matches. Runbook S10-SEAL-RUNBOOK.md read whole, sha256 a39a0253... (41133 B) - matches.
DECISIONS read: :816, :818, :819, :821, :826, :827 only (git show fd13078:rebuild/DECISIONS.md, lines selected in node); chain tip fd13078 has 827 lines.
S9 precedent read: git log on %TEMP%\earned-s9int with explicit paths (S9.json, artifact, review, receipt, VERDICT-S9.md, engine-revision.cjs), and
the S9 T6 commit 6dc2596 diffed (S9.json 6dc2596~1 vs 6dc2596) to compare field shapes; no S9 DECISIONS line was printed.

## 0. State measured
- W HEAD f4125cdbb12a (= origin/rebuild/b-s10-integration); refs/remotes/origin/rebuild/t2-client-core = fd13078 (827 lines; L1-L4 NOT on it yet).
- git status --porcelain --untracked-files=all -- rebuild .github: exactly ` M rebuild/lanes/b/S10-FINAL-CENSUS.tsv` and ` M rebuild/lanes/b/S10-INTEGRATION-REPORT.md`.
- Every sha256 the author cited was recomputed and matches: census TSV 953d8bdb (53324 B, 361 data rows), report 017a6875 (57377 B),
  census-addendum-apply.cjs 8bb38497, census-addendum-section.md fb284d06, T5-make.cjs 31b08357, bodies 4c806526/35cbed2d/40d84425/e678a927,
  T6-apply.cjs aeae991e, CHECKLIST.md 32884d10, work\S10.simulated.json c47915a3, work\S10.base.json = S10.json on disk = f4125cd blob baa1c660,
  needle table s10-t4-needles-f4125cd.txt ad2374d6, brief at f4125cd e5aabac9 (81810 B, 1223 lines, ASCII), exporter blob d8ffbcf:...cjs.txt de3aeb76 (13799 B).
- All prepared files are LF; ASCII except the U+00B7 dots in the four bodies (L1 4, L2 4, L3 3, L4 3 dots), which the runner splits on.

## 1. Census addendum (item 1) - CORRECT; recounted from the raw diffs
- git diff --name-status 92be4e3 f4125cd -- rebuild .github = 8 paths: L8 review (A), TSV (A), report (M), S10.json (M), FINAL-CENSUS review (A),
  T4-FIX review (A), page-bundle.test.mjs (M), production-mapping.cjs (M). d7f6540..92be4e3 touches neither page-bundle nor production-mapping (so
  they were carried at 92be4e3 and had no rows): every P..f4125cd hunk of those two is new to the census.
- Recount by git diff -U0 d7f6540 f4125cd: page-bundle.test.mjs 6 hunks (-182 +182 1/9, -184 +192 1/1, -187 +195 1/2, -384 +394 0/8,
  -386 +403 1/1, -388 +405 2/3); production-mapping.cjs 1 hunk (-55 +55, 1/2: the treeSha256 re-pin plus one added comment line, so hexOnly()
  is false and the instrument classes it N - the f4125cd commit message's "2 R re-pin hunks" is wrong on both count and class; the author
  says so and gives the alternative totals R 144 N 201). Three new review records, one new-file hunk each (0/47, 0/164, 0/137). 10 rows, all N.
  The 10 appended TSV rows (git diff f4125cd -- the TSV) carry exactly these coordinates, roles (edited/undeclared), status (M/A) and bases.
- Totals: 115+5 = 120 paths, 351+10 = 361 staged rows, 329+10 = 339 physical hunks, M 16 R 143 N 202, 0 UNCLASSIFIED - arithmetic checks.
- The addendum's hunks()/hexOnly()/role logic was compared line by line with %TEMP%\opus55-s10census\census.cjs (sha256 eef1f0a0..., the
  accepted instrument): identical for the five paths it is applied to (it drops census.cjs's S10.json record clause, which none of the five needs).
- The two D-CENSUS-STAGED-COUNT label rewrites are present in the disk report (table row and "Machine table" sentence) and the addendum section
  is appended after the accepted census section. Report on disk = 190 lines; TSV rows 361.
- D-SP-1 (named): the existing TSV row for S10-INTEGRATION-REPORT.md still reads 0/144 (it is 0/165 at f4125cd and longer after T6a); the author
  discloses this in the section ("Existing rows are not rewritten"). Hunk count and class are unchanged. PM to accept the disclosure at T6a.
- D-SP-2 (named, PM-RULE): the TSV itself is UNCLASSIFIED under the unmodified census.cjs (record rule admits .md only); the addendum leaves it out
  under the accepted census's limit (5) (self-reference). The PM rules it at T6a; if counted, 121 paths / 362 staged / 340 physical / N 203 as stated.

## 2. T5 token lines (item 2) - CORRECT; recomputed from committed bytes
- Each body file is one line + LF. Each equals the brief's Appendix A line (1121, 1132, 1144, 1153 of git show f4125cd:...BRIEF.md) with
  <U+00B7> -> C2 B7, 2026-09-DD -> 2026-09-25, <sha256> -> e5aabac9809f70dc5dcc105892a4f4ff468193d713c6e6d99a044bf40e5b74c8, <bytes> -> 81810.
- The brief hash is of the COMMITTED bytes (git show f4125cd:path, hashed in node) and the disk brief is byte-equal. Brief history: rev 3 at
  166a5c7 (55aed1b1, :821), then 9479958 changed exactly one line (:162 "(36 with s10-copy-lock, section 8 answer 8)"); nothing after. No PENDING
  mark remains (only OWED-T26, which the brief itself assigns to the seal chain at 1085-1087). Brief 11.1 (i)-(iii) are satisfied by :821/:818.
- lineSha256 (UTF-8 bytes, no newline): L1 6f6b5410071eab452cfa0a9f46748ea08c1db8533345f46361ea91626106c525 (349 B);
  L2 d8884ec6f13e0df0ff078bc2c0d2d90ffc1c06d1820c15fdcf5e3ddcaa550c92 (789 B); L3 c497e941acaf414c9dfa9a2c2a562af27d02149065cee4e0b3780df141c1c17b (989 B);
  L4 1fa5309c2d70eaa39873439e85e689c43083a720eb857d8102667dd640e3bea0 (324 B). Valid only for the date 2026-09-25 (any other date moves all four).
- Runner predicates re-applied with the regexes copied byte-equal from b-package.cjs at f4125cd (:1018 SUPERSESSION_GRANT, :1031 RELEASE_GRANT,
  :1051 ruledTerminal): L1 has exactly one RELEASE grant clause naming M2-S10-TODAY-SPLIT and the two paths, last clause RULED; L2 exactly one
  GATE-SUPERSESSION clause with the five carriers, last clause RULED; L3 names the package, carries " <U+00B7> cowork <U+00B7> ", ends " <U+00B7> ACCEPTED" (BP:2065);
  L4 names the package and brief.file, carries the true sha/bytes, matches /(?:^|[ <U+00B7>])ACCEPTED$/ (BP:1889-1890). L1/L2 use "cowork (PM)" as S9 did.
- L1 path set == S10.json role:released set; each pre == the S9 artifact's post (today-app.cjs efaf6c0d, gym-app.mjs 4c8ba0c9), post null; neither
  is an S9 executionPins key nor an S10 child argv target. L2 carriers == BYTE_IDENTITY_CARRIERS (BP:964-965) == S10.json superseded gates keys ==
  parent S9.json carriers, same order. L3's cited commits b35a48e3, 66d32530, 0d38b8e exist; the S9 artifact at f4125cd hashes f2447622.
- L1 cites brief section 4.3: the RELEASE GRANT paragraph is at brief :375-:388 inside 4.3 (353-397). OK.

## 3. T6-apply.cjs (item 3) - read, not run; CORRECT with two named limits
- Field diff base (baa1c660) -> work\S10.simulated.json (c47915a3), deep-diffed in node: 55 changed paths = 36 child needles + exactly these 19:
  packageId, status, brief.file, brief.sha256, brief.acceptedLedgerLine, authorizations.theme, authorizations.review.prefix, artifact.file,
  artifact.review, release.rulingLineSha256, coverage.superseded.rulingLineSha256, the 5 gates[*].why, notes[0], notes[2], notes[7]. No key
  added or reordered at any level (so the fence's SPEC_KEYS closure is untouched); notes[8] unchanged.
- Claims: theme and brief.acceptedLedgerLine have exactly the 4 keys ledgerLine, role, line, lineSha256 (BP:1376-1379, CLAIM shape as S9 6dc2596),
  role cowork, line == body, sha256(line) == lineSha256. release/superseded rulingLineSha256 == L1/L2 lineSha256. review.prefix
  "POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT"; artifact paths acceptance-/review-s10-today-split.json (slug rule BP:2071-2075). status BRIEF-ACCEPTED.
- The five whys open with "DECISIONS:153 (the standing role) and the token clause DECISIONS:<L2> (RULED) for M2-S10-TODAY-SPLIT, located by its own
  sha256 <12>...: " - the exact shape S9's whys took at 6dc2596 (":787 (RULED) for M2-S9-UI-PINS, located by its own sha256 b8d088af3eb8...") - and
  no PROPOSED / "null until" survives. notes[0] and [7] no longer say PROPOSED DRAFT / PROPOSED drafts; notes[4]'s "PROPOSED entry" is an engine
  proposal state, not spec status. The 33 U+2013/U+2014 in the spec are all inside the carried owner claim line (:60), identical in base and output.
- Needles: 36 rows in the table, order == S10.json child order; every simulated needle == the table's NEEDLE (TERMINAL: prefix stripped), except
  m4-import-production = PM-MEASURE-AFTER-T6 in phase 1 (the table's "# pass 19" is the sealing-window red and correctly never enters the spec).
  Every green row has EXIT=0, # fail 0, pass == tests. s10-engine-files-differential's needle is a line-start prefix (BP:2839 matches
  ^escapeRe(needle) multiline) that states 27, names rebuild/engine and says byte-identical (BP:3253-3258).
- Refusals (read): HEAD must be f4125cd or ONE commit on it whose rebuild/.github diff is exactly the two addendum files at the prepared shas;
  status under rebuild/.github may show only the addendum (' M', uncommitted case) and S10.json; disk S10.json must be the f4125cd blob or the
  script's own earlier output (rebuilt and compared); brief on disk == HEAD blob; needle table sha pinned; L1-L4 each located exactly once by
  text AND once by sha on refs/remotes/origin/rebuild/t2-client-core (a live run today refuses, as the author says, since L1 is not on the chain);
  base fields must be the expected nulls; needles must satisfy CHILD-NEEDLE-EMPTY. The patch is a pure function of the m4 needle, so phase 2
  rewrites phase 1 deterministically. Output is JSON.stringify(x,null,2)+LF and the base is canonical, so no other byte moves.
- T6c is sound: production-mapping.test.cjs :104-:112 reads packages/<standing>.json from DISK and only its status and parent.chosen; the
  placeholder needle is not read there.
- D-SP-3 (named): the tree check's pathspec is rebuild + .github, so a stray root-level file or a commit touching app.js would not refuse. Same
  pathspec the runbook itself uses (T9 verify, T11); acceptable, stated.
- D-SP-4 (named): T6-apply.cjs is single-use at f4125cd(+addendum). After T6g (two commits on f4125cd) or T7 (merge) it refuses, so a T8 refusal
  of the CHILD-NEEDLE kind that sends the PM "back to T7" cannot be paid by re-running it; the needle would be hand-edited with a Fable read, or
  the script re-based by its author. Name it in T6g's freeze note.

## 4. CHECKLIST.md (item 4) vs the runbook T6..T28 - COMPLETE, in order, every freeze and grant marked
- Steps T6a-T6g then T7..T28 appear once each in runbook order; T6 is split (addendum commit, phase 1, m4 re-observe, phase 2, static check,
  reviews, commit H) consistent with runbook T6's "one commit" for S10.json. PRE (T5) precedes T6 as LEDGER ORDER requires (L1-L4 before the
  T6 static check, T8, T10).
- Grants: (g) marked on T6c, T8, T10, T12, T14, T20, T23, T24 = the runbook's J1 list (T4-part, T8, T10, T12, T14, T20, T23, T24); grant (g) is
  DECISIONS:816 (1) verbatim: ":796 (d) extends to the S10, S11 ... seals, PM seat only, pass/fail lines only, private census and D-EPP-3
  private gate included". Deploy at T27 cites :816 (2) "Yes, at each seal" -> :800 extends to each seal's fast-forward - verbatim. Single-OS
  today-17 re-run rule cites :816 - verbatim ("re-run by an empty commit (as d7f6540)"). Chain-freeze scope cites :816 - verbatim.
- Freezes: PRODUCT FREEZE at T6g; EXPORT FREEZE at T10; HOLD THE LEDGER at T13; CHAIN FREEZE STARTS at T17 (with the :816 scope), "frozen chain"
  on T18/T19, LIFTED at T28; junction stays until T24 (T14) and is removed at T24. Matches runbook T13/T17/T24/T28.
- Counts updated correctly: 36 children (9479958), product 302 = edited 22 + carried 230 + new 47 + released 2 + superseded-by-child 1 (counted
  from the f4125cd blob), n PREDICTED 300 = 302 - 2 (record, never assert). Exporter T10: commit d8ffbcf exists, blob de3aeb76 13799 B (:818).
- D-SP-5 (named): T6f names "separate Claude final + PM exact-byte read" but not the runbook's scope for the Claude final (moved writers, GSS
  writer logic, released exception hunks, declarations, the two EPP clauses; BR 12.9, :626 (4)); add those words so the final is not read as a
  spec-diff review only.
- D-SP-6 (named, from the author's own list): T6e (static check in the shape of S9-FINAL-ASSEMBLY-PREP.md section 4) and the T22 VERDICT text are
  not prepared; T6e must print the Q25 "not an execution route" step for both released paths. The author's recommendation to re-observe
  sealed-inventory-fence at T6c is reasonable and cheap: my static read of sealed-inventory-fence.test.mjs found it reads the spec's KEY SET
  (SPEC_KEYS :84-:87) and the reseal-child files, not status or needles, and T6 adds no key - so the re-observation is confirmation, not a fix.

## 5. What this checker could not do
- Run nothing (role and rules): the T6-apply live refusal, the simulation and census.cjs reruns are the author's claims, cross-checked by
  recomputation only. The fence's runtime behaviour on the phase-1 bytes is a static read. Ledger line numbers, the append date, the m4 needle
  after T6c and every (g) step are PM measurements.

## 6. Files written (all new, under %TEMP%\s10-seal-prep\checker\, read-only helpers; LF, ASCII)
run.cmd (PATH for node/git, cd), hash.cjs, decline.cjs (DECISIONS lines by number), lines.cjs, grep.cjs, specdiff.cjs (deep JSON diff),
verify.cjs (the T5/T6/needle recomputation, 80+ PASS lines, 1 over-broad FAIL on carried dashes explained in section 3), dash.cjs, misc.cjs,
argv.cjs, S9.pre.json / S9.post.json / S9.final.json (git show extracts of S9.json for the precedent diff). Nothing under W or P.

## AAR
1. Did: recomputed every hash, every T5 body against Appendix A at f4125cd, the T6 field diff and claim shapes against the S9 6dc2596 precedent, the needle table against the simulated spec, the addendum's 10 hunks from raw -U0 diffs, and the checklist against runbook T6-T28 and :816.
2. Verdict: ACCEPT WITH NAMED DEBTS D-SP-1..6; the T5 bodies, T6-apply.cjs and the census addendum are correct as prepared and may go to the PM.
3. Nothing ran but git and node over bytes; no test, child, runner, REGEN, T5-make, T6-apply or census.cjs; nothing committed, pushed or written outside s10-seal-prep\checker.
4. Sharpest finding: T6-apply.cjs binds to f4125cd(+addendum) and refuses after T6g/T7, so a post-T7 needle fix needs a re-based script (D-SP-4); the bodies are date-bound to 2026-09-25.
5. Rule slips: none; DECISIONS read only at the six granted line numbers; the S9 precedent was taken from git log and the S9.json diff, not from S9 ledger lines.
6. Next for the PM: rule D-SP-2 at T6a, add the D-SP-5 words to T6f, append L1-L4 (rerun T5-make --date if not today), then T6b.
