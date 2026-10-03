# REVIEW S11 DISTFIX - independent read (Fable, l1)

Scope: `git -C %TEMP%\earned-s11-dist diff` at c55036c (rebuild/b-s11-distfix), one file,
rebuild/m3/w7-preview/today/test/copy.test.mjs (blob 2659dcb -> d733659, +16/-6). Read against
build.mjs:34-38 and :473-:521, DECISIONS:888, DISTFIX-REPORT.md, run-a/b/a2/b2.txt. No test run,
nothing edited, no forbidden path opened.

## (1) Assertions byte-identical
Every `-` line is either a bare `buildToday()` call (5 sites) or P1's asset read
(`path.join(DIST, name)` -> `path.join(result.dist, name)`). Every `+` line is a comment, a
`buildToday({ dist, scratch })` call or that read line. No `assert` line is in the diff.
Confirmed on the diff itself. PASS.

## (2) No shared-directory traffic left; names distinct
Post-change grep of copy.test.mjs for `buildToday(`, `DIST`, `SCRATCH`, `readFileSync`: every
build passes its own dist/scratch (p1, a1, launch-guard, clean, again-markup, again-string, and
plant-<pid>-<seq> for the copy-tree build); the only reads of built output are
`result.dist` (P1 :173, A1 :216-217, launch guard :281). `DIST` survives only as the import and
as the parent for `path.join(DIST, '..', ...)`, which resolves to ROOT/.tmp/w7-*, inside the
workspace, so build.mjs realDirectory() :462-:470 admits it.
Across the today-17 argv (S11.json children[0].argv, 23 files): food:900, machine-settings-ui:953,
package:27/:370, problem:244/:260/:1952/:3561 call `buildToday()` with defaults and read
`build.DIST`/`DIST`; setup:931 reads `build.DIST`; the four measure tests match nothing. No
file outside copy.test.mjs names any w7-p1/a1/clean/again-*/launch-guard directory (git grep over
the worktree, forbidden paths excluded by pathspec). `w7-clean-*` is reused by the two REFUSES
tests, but node --test runs a file's top-level tests serially in one process and the argv sets
no --test-concurrency, so that reuse is sequential. PASS.

## (3) Still proves what it claimed
buildToday() returns `dist` as passed (:518) and, before returning, writes all three ASSETS into
it (:514) and asserts readdir == ASSETS (:515). P1 therefore scans the files this call just
wrote, and :190-:191 tie the on-disk scan to this build's in-memory result
(`result.dashes.admitted == report.admitted`, `admitted > 100`), so an empty or stale directory
cannot pass. A1 reads app.js/index.html from the same result.dist and still requires the one
export clause, boot() and mountToday(). clean/again read only in-memory `dashes.offences`, as
before. Nothing became vacuous. PASS.

## (4) Leftover risk
- D1 Directories never cleaned: .tmp/w7-{p1,a1,clean,again-markup,again-string,launch-guard}-
  {dist,build} persist between runs (12 dirs, gitignored). Stale bytes cannot satisfy an
  assertion (every asset is rewritten and extras unlinked per build, :510-:515); cost is disk
  only. Plant dirs are rm'd in `finally`.
- D2 Names are per-file, not per-process. Two concurrent processes running copy.test.mjs in one
  worktree (a directory glob that also picks up a stray copy, or two seal runs sharing a tree)
  would collide on w7-p1-dist exactly as before. today-17 runs the file once, so out of scope
  for the ruling; the plant paths already show the per-pid pattern if this is ever wanted.
- D3 Worktree is NOT clean: `git status` now shows two untracked leftovers from the stress
  harness, rebuild/m3/w7-preview/today-plant-40884-1/ (empty dir, an interrupted plant) and
  rebuild/m3/w7-preview/today/test/zz-s11-pre-copy.test.mjs (sha256 290a90ab..., byte-identical
  to the OLD copy.test.mjs). Neither is in the diff. Both must be deleted before any commit;
  the zz file would also run and collide (D2) under any directory-glob invocation.
- D4 The MARKUP red was not observed on the old file at 40x3 (run-a2 0/40), so the round-2
  moves (clean/again) rest on the build.mjs reading (shared SCRATCH app.js and .meta.json,
  :486-:493), not on a reproduced failure. The reading is correct; the evidence is weaker.
- D5 Prose drift: package.test.cjs:139 cites copy.test.mjs :395/:405, now :403/:414. Cosmetic.

## Stress evidence (pass/fail only, as given)
P1 OLD 2/40 FAILED (run-a), P1 NEW 0/40 (run-b); MARKUP OLD 0/40 not observed (run-a2),
MARKUP NEW 0/40 (run-b2). Red-first holds for the cell the ruling named.

VERDICT: ACCEPT WITH NAMED DEBTS (D3 blocks the commit until the two untracked leftovers are
removed; D1, D2, D4, D5 are recorded, not blocking.)
