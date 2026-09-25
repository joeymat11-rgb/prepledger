# REVIEW-S10-COPYLOCK-CI-l1: the copy-lock CI registration (rebuild.yml one name, S10.json child 36, brief :162) and the T4 needle plan

Reviewer: Claude Fable 5.1 (independent; did not write the hunks). 2026-09-25. Lane W =
C:\Users\joeym\AppData\Local\Temp\earned-s10int, HEAD 2ad3e91e834cd69cad8b50a67284befded1ce72a, three files
modified and uncommitted (`git status --short -- rebuild .github`: exactly rebuild.yml, the brief, S10.json).
Rules opus55-RULES.txt (51706c33) and runbook S10-SEAL-RUNBOOK.md (a39a0253) read whole. Every run below went
through %TEMP%\pm-run.cjs shared; nothing was committed, pushed, written with --write, or written to DECISIONS.md;
no protected file was opened or executed (the graph tool records a resolve to one as a name and never reads it).

## VERDICT: READY FOR --write (after the PM commits the three files; REGEN measures post at HEAD)

## 1. The rebuild.yml hunk (git diff -U0 2ad3e91 -- .github/workflows/rebuild.yml)
- Exactly one hunk `@@ -259 +259 @@`, the Today step `run:` line (YML:259). The only token added is
  `rebuild/m3/w7-preview/today/test/copy-lock.test.mjs`, inserted between checkin.test.mjs and copy.test.mjs.
  No other line, step, `if:`, env or matrix entry moved (diff --stat: 1 insertion, 1 deletion in this file).
- H3/13 (rebuild/m4/workout/test/h3-clean-init.test.cjs:720-746) re-derived independently in
  %TEMP%\fable-copylock-ci-static.cjs (loads no engine module, runs no test; log fable-copylock-ci-static.log):
  step found at line 259; setup.test.mjs named; no `*`/`?`; 19 today/test tokens, 19 unique; every named file
  exists; onDisk `*.test.(mjs|cjs)` sorted (19) deepEquals NAMED (19). Sort order agrees: '-' (0x2D) precedes
  '.' (0x2E), so copy-lock.test.mjs sorts before copy.test.mjs in both lists. At 2ad3e91 the same cell is
  18 vs 19 (red), so the hunk is exactly the fix and nothing more. PASS statically.
- Bytes: LF only (no CR); the U+2013/U+2014 count is unchanged (the 18 pre-existing em dashes at lines 66, 194,
  198, 205, 238, 258, 288, 297, 318, 322, 324, 345, 347, 399, 401, 403, 405 are identical at HEAD and on disk;
  the hunk line is ASCII). Disk sha256 e3b9c9d1dabdc1de46801e12556a7a334fea0d90c7d6f9670d3d0ebca88b1372; HEAD
  (git show 2ad3e91:.github/workflows/rebuild.yml, cmd redirect) 45b286b73aa6b0f80613790820d4992a8fcc94e5a5e1c26437affea33592d540
  = S10.json product post for `.github/workflows/rebuild.yml` (role edited, pre bce0594f...). After the commit
  REGEN --write moves that post to e3b9c9d1...; that is the only product entry this change touches.
- Other readers of rebuild.yml (git grep -n 'rebuild\.yml' -- the test roots, comments excluded): only H3/13
  (today-step enumeration) and rebuild/coach/test/engine-revision.test.cjs:56-58 (the standing
  `--package S10` step, untouched). ci-second-gate.test.cjs mentions it in a comment only. No cell pins the
  rebuild.yml sha or a today-step count other than H3/13.
- CI shape (YML:19-31, :39): both OS (ubuntu-latest, windows-latest), MEASURED_TEST_NOW=2026-09-03,
  TZ=America/New_York, Node 22; the Today step has no `if:` so it runs once the standing step passes (runbook T7,
  Q12). The lock's answer 7 requires identical results on both OS; the PM's Linux run (section 3) pays that.

## 2. The S10.json child (git diff -U0 2ad3e91 -- rebuild/lanes/b/tooling/packages/S10.json)
- One hunk `@@ -2029,0 +2030,9 @@`: a 36th child appended after s10-engine-files-differential:
  `{"name":"s10-copy-lock","argv":["--test","--test-reporter=tap","rebuild/m3/w7-preview/today/test/copy-lock.test.mjs"],"needle":null}`.
  Keys name/argv/needle in that order, name matches ^[a-z0-9][a-z0-9-]{1,39}$ (b-package.cjs:1962-1967), argv is
  byte-for-byte COPY-LOCK.md answer 8 (:67) and brief section 8 answer 8, needle null like the other 35 (notes[0]
  "Every child needle is null" stays true). Shape equals the precedent today-split-fence / s10-sup-* (single-file
  TAP child, three argv strings). Names unique across 36. No other S10.json byte moved (9 insertions, 0 deletions).
- The argv target is declared in product with role new and post 55ceef754cdfa091e0eb810f61fd1551c7999920102acf3938ec61be484d6cfa
  = the disk sha256 of copy-lock.test.mjs = the brief section 8 sha; copy-lock.cjs, copy-lock-states.mjs,
  copy-lock.corpus.json (post e3b1be10..., the CORPUS_SHA256 pinned in the test) and copy-lock-measure.mjs are
  declared new. rebuild/lanes/c/COPY-LOCK.md is not declared, which is REGEN's rule for Markdown reports outside
  rebuild/engine (notes[1]) and matches answer 8 "the five new files"; not a finding. The target's role new means
  ownChildren() (BP:814) counts the child toward MIN_OWN_CHILDREN.
- Guard-clean, the runner side: the runner executes the argv as given (BP:2798-2860) with no preload, so
  guard-cleanliness is a property of the test's import graph, and it is MEASURED, not inferred: Windows
  (T3C, Fable l1: 6/6 under the resolve guard, guard log never created, brief section 8) and Linux (section 3).
  Static caveat recorded for T4: the literal import graph of copy-lock.test.mjs reaches 138 files and, through
  gym-app.mjs -> today-app.cjs -> import-screen / engine-runtime-host, names migrate.cjs and merge.cjs by
  literal path (COPY-LOCK.md "today-app.cjs requires the import screen, which loads the protected five locally").
  Those requires are lazy (never executed by the six cells); the two guarded runs prove it. So T4 keeps the guard
  on this child too, as on every child; the static walk over-approximates and cannot replace it.
- S10.json disk sha256 a047b641b32d5bc8771d34f7516f1b9916ad90fa2f72d44901c6235ec351c6e1 (was 2f89ecd2... at HEAD).

## 3. The Linux evidence (%TEMP%\s10-copylock-linux-evidence.md, 9 lines) against the lock's own contract
- Tree = origin/rebuild/b-s10-integration at 2ad3e91 (the pushed head; the lock bytes are the same five files,
  copy-lock.test.mjs 55ceef75 declared at that head). Node v22.22.2 = the CI major (YML:39 '22'); dependencies
  installed exactly as rebuild.yml does; env MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York = YML:30-31.
- Command = answer 8's argv with `--require pguard.cjs` in front: a resolve guard (CJS _resolveFilename and
  module.registerHooks, so ESM too) on the protected five, log never created. Result exit 0, 6 tests, 6 pass,
  0 fail, 0 skipped, the six named cells CL-PIN, CL-HOLDS, CL-TWO-SIDED, CL-PLANTS, CL-COMPOSED, CL-CLOSURE =
  the sealed cell list of brief section 8; corpus e3b1be10 held. TAP sha256 1bb32247... (1457 bytes) recorded.
- Consistent with answer 7 (text and jsdom only; identical on windows-latest, ubuntu-latest and the PC): the
  Windows 6/6 and the Linux 6/6 are the same six cells on the same corpus. It pays D-COPYLOCK-LINUX as the
  file says. It does NOT pay answer 8's "on both OS" in CI (that needs the hosted Today step at T7, which is
  why brief section 9 orders the workflow registration last); the brief section 8 debt list still names
  D-COPYLOCK-LINUX and may be re-worded at the next brief revision, not here (not a STOP).
- One caution: the evidence is a PM cloud sandbox, not a GitHub runner; it is the standalone-row evidence
  section 9 asks for ("after the standalone new rows have run on both systems"), and the hosted step remains
  owed at T7/T26 exactly as the brief says ("its presence is checked at the seal, not claimed here").

## 4. The brief line (git diff -U0 2ad3e91 -- rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md)
- One hunk `@@ -162 +162 @@`: "all 35 child needles" -> "all 35 child needles (36 with s10-copy-lock, section 8
  answer 8)". The sentence is pinned to S10.json at f97924a (sha 66df4c06, 35 children), so keeping 35 and adding
  the parenthetical is the honest form; no other count in the brief names the children (the 32 at :184 is S9's).
  LF, no U+2013/U+2014. Disk sha256 e5aabac9809f70dc5dcc105892a4f4ff468193d713c6e6d99a044bf40e5b74c8.
- Sign-off on the brief-of-record level: ACCEPT this one line. The brief's own sha is measured by the PM on the
  committed bytes and carried by L4 only (2.1 row S10_PACKAGE_ID), so this edit precedes L4 and voids nothing.
  Section 8 answer 8 "Not in rebuild.yml at this revision" and the 2.1 copy-lock row "not yet in rebuild.yml"
  describe revision 3's tree and stay true of it; they say presence is checked at the seal, which T6/T16 do.

## 5. REGEN dry run re-run (pm-run shared fable-copylock-regen-dry; cmd = pm6-s10regen-w.cmd without --write)
`node rebuild\lanes\b\S10-REGEN.cjs --parent d7f654017962d35661adea8cf3688251ad686b9e --receipt-line 809` at HEAD 2ad3e91:
scope 36 reviewed roots, 626 pairs validated, 78 changed paths in scope (7 never read); inventory 309; product 302
{"edited":20,"carried":232,"new":47,"superseded-by-child":1,"released":2}, 0 entries would change (against HEAD);
build.mjs and preview.css left undeclared; 7 parent-unpinned declared new; S9.json pre bb169a67847d superseded-by-
child; parent.options[0] f2447622... / 7f372d97... / 809; runnerSha256 9fbfdd2d...; D-SPLIT-PARENT EQUAL x3;
`PROBLEM disk differs from HEAD (commit first): .github/workflows/rebuild.yml`; notes regenerated [1], [5], [6];
`DRY RUN: nothing written`; EXIT=1. Identical to the integrator's log line for line. The EXIT=1 is the designed
refusal (disk != HEAD), so the order is: PM commits the three files -> dry run (expect 1 entry would change:
rebuild.yml post 45b286b7 -> e3b9c9d1, EXIT=0) -> --write (expect "WROTE ... S10.json <64>", EQUAL x3, EXIT=0).
Note: notes[1] currently names HEAD 166a5c73 as the post measurement head; --write re-authors it to the commit.

## 6. Findings
- F0 (none blocking). The hunk is one name; H3/13 passes statically at 19/19; the child is the precedent shape
  with the accepted argv; nothing else moved; the Linux evidence matches the contract.
- N1 (note, no action here): the brief section 8 debt text "D-COPYLOCK-LINUX (measured on Windows only; Linux at
  the first CI run that reaches the step)" is now partly paid by the PM's Linux run; the hosted half stays owed
  until T7. Re-word at the next brief revision if one happens; do not touch the brief for it alone.
- N2 (T4 design input): static import graphs over-approximate (section 2). The guard, not the walk, classifies.

## 7. T4 NEEDLE PLAN, the exact steps after the next REGEN --write (runbook T4; brief 12.1 fix 6; grant (g) DECISIONS:816 (1))
Preconditions: the three files committed; REGEN --write done and its new S10.json reviewed (12.1 fix 6); no product
byte moves afterwards (a later move voids every needle taken). Needles are read at the composed candidate only,
never copied from S9. The Today-step registration is already in place, so no rebuild.yml hunk follows the needles.
7.1 The guard (builder writes it once): %TEMP%\s10-t4-guard.cjs, a resolve guard on
    /[\\/]rebuild[\\/]engine[\\/](seed|migrate|merge|index|oracle-shim)\.cjs$/i hooking BOTH Module._resolveFilename
    (CJS) and require('node:module').registerHooks({resolve}) (ESM); on a hit it appends "<S10_T4_CHILD> <basename>
    from <parent>" to %TEMP%\s10-t4-guard.log and throws. No protected byte is read by a resolve hook. It is
    preloaded through NODE_OPTIONS so the SP argv stays exact and the guard reaches every node child process
    (node:test workers, `spawnSync(process.execPath, ...)` in writer-fence, local-import, s10-sup-source-carriers).
7.2 One cmd file per child, %TEMP%\s10-t4-<child>.cmd (write_file, ASCII, LF), exactly:
    @echo off | cd /d %TEMP%\earned-s10int | set "PATH=<G folder>;%PATH%" | set "MEASURED_TEST_NOW=2026-09-03" |
    set "TZ=America/New_York" | set "S10_T4_CHILD=<child>" | set "NODE_OPTIONS=--require %TEMP%\s10-t4-guard.cjs" |
    "<N>" <the child's SP argv, verbatim, space separated> > %TEMP%\s10-t4-<child>.tap 2>&1 |
    >>%TEMP%\s10-t4-<child>.tap echo EXIT=%ERRORLEVEL%
    Run: node %TEMP%\pm-run.cjs shared s10-t4-<child> %TEMP%\s10-t4-<child>.cmd (up to 4 at once), EXCEPT
    today-17 and measure-hermetic: pm-run exclusive (runbook T4). Start via Start-Process as in runbook section 0
    for anything over 45 s; poll '^PM-RUN s10-t4-<child> exit '.
7.3 Read-out per child, FILTER only (never print a TAP whole): Select-String -Pattern '^(# (tests|pass|fail|skipped)
    |EXIT=)' on the .tap; and Test-Path %TEMP%\s10-t4-guard.log plus Select-String '^<child> ' in it.
    - guard.log has no line for the child AND EXIT=0 AND '# fail 0': GUARD-CLEAN; the needle is the exact
      '# pass N' line (>= 8 chars, line start, no break; BP:1966/2839; SP notes[2]). For s10-engine-files-
      differential (node <script>, no TAP) the needle is the script's own terminal line at line start.
    - guard.log has a line for the child: GUARD-TRIPPED; the builder stops there (the throw happened before any
      protected load) and hands the child name to the PM. Not re-run by a builder or reviewer.
    - EXIT != 0 with no guard line: a real red at the composed candidate; report red-first, no needle (BP:2823
      CHILD-REQUIRED-EXIT-ZERO would refuse it at T8 anyway).
7.4 Expected split, from the static literal import graph of every SP argv (%TEMP%\fable-t4-graph.cjs, pm-run shared,
    log fable-t4-graph.log; executes nothing, never reads a protected path) plus the measured guarded runs on
    record. The guard log is the ruling; this list only orders the work.
    EXPECTED GUARD-CLEAN, a BUILDER may take these needles (10):
      s10-copy-lock (measured clean on Windows and Linux, section 3; shared), today-split-fence (measured clean,
      round 4 404/404 guard log empty; static reach is lazy; shared), measure-hermetic (graph 5, no engine path;
      EXCLUSIVE per runbook), reference-closure (graph 1), today-carry (graph 27, engine constants.cjs only),
      f2-land (graph 6), ui-pack-pins (spawns whoami/icacls only), release-object (graph 1, reads the S9 artifact),
      sealed-inventory-fence (git only; needs origin refs in W), w6-local-import (spawns the w6 port script; the
      guard follows through NODE_OPTIONS).
    EXPECTED GUARD-TRIPPED, PM seat ONLY under grant (g) (DECISIONS:816 (1)), pass/fail lines only (26):
      today-17 (22 files; index/migrate/merge by literal path; EXCLUSIVE), s4-real-day, a0-journeys, d-plan-edit,
      m4-import, m4-import-production, d-import-retract, d-admission-swap, d-replay-measure, d-capture-start,
      food-live-save, w7-import, w6-host-seams, w6-local-source, d-replay-all, d-port-admission, d-real-shape,
      passphrase-normalize (all: migrate/merge/index reached through rebuild/m3/w6/host/engine-runtime-host.cjs
      or workout-host); epp-proposed-pick and d-epp-2-capture (dynamic requires of index.cjs / seed, migrate,
      oracle-shim; IR: CI-only); s10-sup-inherited-carriers, s10-sup-defect-witnesses, s10-sup-writers-
      differential, s10-sup-second-gate (require(path.resolve(...)) of ../index.cjs, the real rows; IR "the
      s10-sup cells' real rows" CI-only); s10-sup-source-carriers (spawns the GATE script) and s10-engine-files-
      differential (git show of engine paths; IR CI-only).
    The PM runs a tripped child with the SAME cmd shape minus the NODE_OPTIONS line, pm-run shared (today-17
    exclusive), and reads it with FILTER '^# (tests|pass|fail) ' and EXIT= only; the needle is the '# pass N'
    line; nothing else leaves the PC. A child that the guard clears but this list expected to trip simply moves
    to the builder column (record the surprise); the reverse moves it to the PM column.
7.5 Order: builder starts the 10 expected-clean children (4 shared slots; measure-hermetic exclusive, alone) and
    the guard probe of the 26 others (each probe ends at the throw, seconds); PM takes the tripped set as the
    probes report. Every needle goes into S10.json at T6 in one commit with the other final fields (runbook T6),
    never one by one, and only after the last product byte change (12.1 fix 6).

## 8. Files, hashes, what I did not do
- Written (uncommitted, W): rebuild/lanes/fable/reviews/REVIEW-S10-COPYLOCK-CI-l1.md (this file).
- Scratch (%TEMP%): fable-copylock-ci-static.cjs/.cmd/.log (STATIC: every H3/13 and child check PASS; the
  script's two extra probes, "no U+2013/U+2014 anywhere in rebuild.yml" and "COPY-LOCK.md declared", are my
  over-strict checks and fail on pre-existing dashes and on REGEN's Markdown rule, see sections 1-2),
  fable-copylock-regen-dry.cmd/.log (EXIT=1 by design), fable-t4-graph.cjs/.cmd/.log, fable-yml-head.bin,
  fable-decisions-chain.bin (git show extracts; hashed in node, never from a PowerShell redirect).
- Measured shas (node sha256, disk, LF): rebuild.yml e3b9c9d1dabdc1de46801e12556a7a334fea0d90c7d6f9670d3d0ebca88b1372;
  S10.json a047b641b32d5bc8771d34f7516f1b9916ad90fa2f72d44901c6235ec351c6e1;
  S10-TODAY-SPLIT-BRIEF.md e5aabac9809f70dc5dcc105892a4f4ff468193d713c6e6d99a044bf40e5b74c8 (all three equal the
  integrator's report).
- CHAIN read: refs/remotes/origin/rebuild/t2-client-core = 75f8b317 (824 lines); :816 carries grant (g) verbatim
  (":796 (d) extends to the S10, S11 ... PM seat only, pass/fail lines only"); :819 lineSha256 prefix ab0b8edf
  matches the brief's copy-lock acceptance citation.
- Not done: no test executed (the six copy-lock cells were not re-run here; the two runs on record are cited),
  no commit, no --write, no protected file opened, no b-package run.
