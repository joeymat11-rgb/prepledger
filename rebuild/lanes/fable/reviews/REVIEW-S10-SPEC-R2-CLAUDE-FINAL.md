# REVIEW S10 SPEC R2 - CLAUDE FINAL (Claude Opus 5.5, independent of Fable and Astra)

Object: worktree %TEMP%\earned-astra-135, detached at e9ff2ca24e6e (parent ccc2f63), one
uncommitted file rebuild/lanes/b/tooling/packages/S10.json. Read only; nothing written there.
Disk sha256 of that file measured: 68e7f964ab0a7adfbb86da9ea422fd8cfc94a8b7c0847c80637308bef3adb614
(equals the stated value). Committed blob at e9ff2ca and at 4dc2029 is the same blob 41193030,
sha256 fbb4a49044e65130f1fbedee5257c61266c6fb340c09e40ae07cd1a1001d7bc4 (extracted with
cmd /c "git cat-file -p REV:path > file", then Get-FileHash).
No node run, no slot taken, no protected file loaded. Ledger read: lines 816, 826-832 only, of
refs/remotes/origin/rebuild/t2-client-core (4ea143a). Line 833 exists; not read (only its commit
subject was seen in git log). Fable's R2 file in this folder was not opened.

VERDICT: ACCEPT WITH NAMED DEBTS (D-R2C-1..4). The REGEN output is exactly the expected
three-line move; every other byte equals the committed final spec. The debts are owed by the
PM's T4/T6-again/T7 steps, not by this file.

## Q1 - what moved (git diff HEAD -- rebuild/lanes/b/tooling/packages/S10.json)
3 insertions, 3 deletions, nothing else:
- L900 product["rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs"].post
  83f4c1db2e7e... -> 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd (pre null, role new)
- L910 product["rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs"].post
  cea1cd3f392d... -> ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0 (pre null, role new)
- L2053 notes PRODUCT MAP: "bytes at HEAD dc08f36f56ce..." -> "bytes at HEAD e9ff2ca24e6e3a76..."
  Roles line unchanged {"edited":22,"carried":230,"new":47,"superseded-by-child":1,"released":2}.
Finding: none beyond the expected three.

## Q2 - posts recomputed from e9ff2ca bytes (not disk)
git cat-file -p e9ff2ca:<path> > file (cmd redirection, byte exact), SHA256:
- gss-annex-g6-g8.test.mjs      28870 bytes 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd  EQUAL
- gss-annex-log-timing.test.mjs 19540 bytes ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0  EQUAL
Same extraction at ccc2f63 gives 83f4c1db... (27789 b) and cea1cd3f... (18557 b) = the old posts.
Disk copies in the worktree hash to the same new values.

## Q3 - every other field unchanged versus 4dc2029
The diff is the whole difference, so all other bytes are identical to 4dc2029. Spot checks at e9ff2ca:
- status BRIEF-ACCEPTED; packageId M2-S10-TODAY-SPLIT; sourceBase d7f654017962...; 36 children, 36
  needles, child 1 today-17 needle '# pass 726', child 7 m4-import-production '# pass 28', child 35
  s10-engine-files-differential needle = its terminal line (unchanged).
- tooling.runnerSha256 9fbfdd2d9b09fe2aa8f8bd93... = sha256 of e9ff2ca:rebuild/lanes/b/tooling/b-package.cjs. EQUAL.
- brief.sha256 e5aabac9809f... = sha256 of e9ff2ca:rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md, 81810 bytes. EQUAL.
- L1-L4 recomputed as sha256 of the UTF-8 ledger line (no newline) at 4ea143a:
  :828 6f6b5410... (cited 2x in spec), :829 d8884ec6... (cited 7x), :830 c497e941... = authorizations.theme
  lineSha256, :831 1fa5309c... = brief.acceptedLedgerLine lineSha256. All match.

## Q4 - the fix commit touches only the two test files
git show --stat e9ff2ca -- rebuild .github: 2 files, 30 insertions,
0 deletions: gss-annex-g6-g8.test.mjs +16, gss-annex-log-timing.test.mjs +14. Parent ccc2f63.
git diff --name-status 4dc2029 e9ff2ca -- rebuild .github: M rebuild/DECISIONS.md, M the two test files,
D 157 (the cleanup phase 1 commit 3b54a72 arriving through the ccc2f63 merge; none of the 157 paths
appears in S10.json). Read of the hunks: purely additive; one helper painted() (bounded wall-clock
wait on the exact oracle condition, never asserts, then settle()) and one predicate savedScreen(),
called before 4 unchanged oracles (G6, G6 neutral, G7 clean, G5 Log). No oracle, code string or plant
removed or loosened; no test() call added, so the today-17 count 726 is not expected to move.

## Q5 - which needles the PM must re-observe
Brief 12.1 item 6 (brief of record e5aabac9): "A child needle taken before the last product byte
change is void." The two test files are declared product (role new), so the last product byte change
is now e9ff2ca. Every one of the 36 needles was taken before it (35 at f4125cd per :827, m4-import-
production at the 4dc2029 bytes per notes[0]). By the brief's rule ALL 36 are void until re-observed at
the candidate that carries e9ff2ca plus this S10.json, not only today-17.
:832 words the remedy as "T4 for every child that runs a changed file"; only today-17 runs a changed
file (it is the only child whose argv names gss-annex). That wording is narrower than brief 12.1(6).
Finding F-R2C-A: the brief rule governs; re-observe all 36 (today-17 and measure-hermetic exclusive,
rest shared, guard-tripped ones by the PM seat under grant (g)), or the PM records an explicit ruling
that narrows it. Children with a direct data dependency on the moved S10.json bytes (static read):
- today-17: runs both changed files; its food, machine-settings-ui, problem, setup and measure boundary
  files walk the declaring-spec chain including packages/S10.json;
- s10-sup-source-carriers, -inherited-carriers, -defect-witnesses, -writers-differential, -second-gate and
  s10-engine-files-differential: each JSON.parses rebuild/lanes/b/tooling/packages/S10.json as SPEC.
m4-import-production: production-mapping.test.cjs and production-admission.test.mjs standingSeal()
reads the standing id from .github/workflows/rebuild.yml, then JSON.parses packages/S10.json and uses
only .status (must be BRIEF-ACCEPTED) and .parent.chosen, then hashes the PARENT receipt bytes. It does
not hash S10.json bytes, and both fields are unchanged, so its outcome should not move; its needle is
still void by the blanket rule and must be re-observed with the rest.

## Q6 - what T6/T7 still need before the new T7 merge (named debts)
D-R2C-1 NEEDLE PROVENANCE TEXT. notes[0] still says 35 needles were "observed at f4125cd ... recorded
  at DECISIONS:827 (needle table sha256 ad2374d64792...)", and the today-17 note says "observed at
  f4125cd as '# pass 726'". :832 corrects :827 (a load-sensitive cell entered that table). T6-again
  must re-author both notes to cite the re-observation head, its ledger line and the new needle table
  sha; if any count differs, the needle changes S10.json again and needs its own review.
D-R2C-2 CENSUS GAP. rebuild/lanes/b/S10-FINAL-CENSUS.tsv at e9ff2ca covers d7f6540..f4125cd (addendum
  2c4d24e). The six hunks of e9ff2ca (4 in g6-g8, 2 in log-timing) and this S10.json re-pin are not
  classified anywhere I could find (census-addendum-section.md here has 0 hits for e9ff2ca/gss-annex).
  Brief 13 STOPs on an unclassified hunk: an M/R/N addendum is owed before the seal.
D-R2C-3 LANE CUSTODY. origin/rebuild/b-s10-integration is at ccc2f63 and does not contain e9ff2ca
  (only origin/rebuild/c-s10-gss-settle-fix does). Before the new T7 the lane must take e9ff2ca (a
  fast-forward is available: ccc2f63 is its parent), then the T6-again S10.json commit. T7 preflight
  measured now: merge-base with the chain is 194f03f; 194f03f..4ea143a changes only
  rebuild/DECISIONS.md (-- rebuild .github), so 0 hits are expected; re-measure at the tip actually read.
D-R2C-4 RE-RUN THE FINAL CHECKS ON THE NEW BYTES (brief 12.15, 12.9, 12.10): the T6e static check
  (0 REFUSED, verifyReceipt L3/L4, release/supersession rulings) and the PM exact-byte read must run on
  this S10.json, and the Fable and Astra reads of the fix ruled at :832 must be on record before T6.

Informational, no action: the old proofs 83f4c1db/cea1cd3f still appear in historical Markdown only
(lanes/c GSS-ANNEX-*-REPORT.md, astra reviews, a claude-review l3); no pin, mirror or spec holds them.
rebuild.yml and the brief name the two files by path only.
RULE SLIP DISCLOSED: I also ran one "git show --stat e9ff2ca" with no path after -- (stat only,
names and counts, no content); it listed the same two files. No other git show/diff/grep lacked paths.
An untracked Astra review (rebuild/lanes/astra/reviews/S10-FINAL-SPEC-REVIEW-L2.md) sits in that
worktree; not opened.
