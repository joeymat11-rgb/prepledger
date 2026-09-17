# S7-BASELINE-WALK - INDEPENDENT REVIEW R1

VERDICT: ACCEPT (0 BLOCKING, 4 NOTES)

Reviewer: Opus high, blind to the author's working notes until after the measurements
below were taken. Branch rebuild/b-s7-port-admission, HEAD 40ce52067d1963bd (equal to
origin/rebuild/b-s7-port-admission), parent of the round 742f3543. Worktree clean before
and after every measurement in this file.

Commits under review:
- e0f3345 cell, red first
- 3e41d7e raise the hop bound; S7.json re-measured
- 40ce520 author report

## 1. The ruling, and whether the change is the one that was ordered

DECISIONS:516 does not stand in this worktree: rebuild/DECISIONS.md here is 515 lines and
its last commit is 4e86064 (:512-:515). The line stands at 516 on the chain ref
origin/rebuild/t2-client-core (516 lines), which is where the runner reads DECISIONS from
(CHAIN_REF), and that is the text I read. It rules, verbatim in substance: the bound "is a
runner literal that encoded the chain's depth at the time it was written, not a law; it
moves to a generous constant with its reason in a comment, pinned red-first by a tooling
cell that walks S7's real chain and asserts the baseline is found at the measured hop, and
the round re-measures S7.json (runnerSha256 and the runner's post sha)". The same line
dispatches the re-propose, --ci and --full to "an integrator hand", not to this round.

The delivered change is exactly that, and nothing more.

## 2. The runner diff is one literal replaced by a named constant

`git diff 742f3543..HEAD -- rebuild/lanes/b/tooling/b-package.cjs` is a single hunk,
+11/-1, and the only executable change is:

```
+const BASELINE_WALK_MAX_HOPS = 64;
 function baselineOf(bound) {
   let file = bound && bound.option.artifact;
-  for (let hop = 0; file && hop < 8; hop++) {
+  for (let hop = 0; file && hop < BASELINE_WALK_MAX_HOPS; hop++) {
```

The other ten added lines are the required comment, which says in the runner's own voice
that the bound is a cycle guard and not a statement about chain depth, that the old literal
encoded the depth at the time it was written, and that S7 (DECISIONS:516) is the first
generation to fall off it. The loop body, the baseline predicate and the parent link are
untouched. No law, guard, needle or assertion anywhere in the runner is weakened: the
walk still requires baseline.publicPins and a string baseline.auditCommit, and the walk
still terminates - a malformed cycle now costs 64 reads instead of 8.

## 3. The cell walks the real chain and calls the real baselineOf

The cell is at the end of rebuild/lanes/b/tooling/test/parent-pin-shapes-and-spec-successors.test.cjs,
the suite that already covers pins() and the parent.artifact links. It compiles a SECOND
instance of the UNMODIFIED runner source at the runner's own path, so `root`
(b-package.cjs:91, `path.resolve(__dirname, '../../../..')`) resolves to this checkout and
`rel()` (:588) reads the artifacts that are actually on disk. I confirmed both lines. The
fixture instance compiled earlier in the file is a different module object and is not used
by this cell. Nothing is forged, nothing is written (the tree is clean after every run).

The cell asserts three things: (a) the baseline-bearing artifact reached by hand through
parent.artifact links is rebuild/conform/v4/postfix/acceptance-step-efficacy.json; (b) it
stands at hop 8 from the S7 bound's own parent; (c) the runner's own baselineOf returns
that same baseline, carrying publicPins and the auditCommit, with the audit runner
rebuild/conform/v4/run-defect-laws.cjs present in publicPins. Hop 8 and the nine-artifact
walk agree with the PM's own reading in DECISIONS:516.

### RED FIRST, re-measured by me, not taken on the author's word

I restored the parent runner with `git checkout 742f3543 -- rebuild/lanes/b/tooling/b-package.cjs`,
ran the suite, restored HEAD's runner, and confirmed `git status --porcelain` empty.

- OLD runner (742f3543): tests 9 / pass 8 / fail 1, exit 1. The single failure is the new
  cell, and it fails at line 298 - assertion (c) - with
  `BASELINE-UNRESOLVED; baselineOf returned null for the S7 bound whose baseline stands at
  hop 8`, actual null. Assertions (a) and (b) precede it and were green, so the cell
  measures the runner's defect and not a mis-stated hop.
- NEW runner (HEAD): tests 9 / pass 9 / fail 0, exit 0.

The cell is therefore red for the right reason and green for the right reason.

## 4. Suites and cells, re-run by me

- Nine lane B tooling suites, named explicitly: tests 106 / pass 106 / fail 0, exit 0
  (105 stood before this cell; the one added test is the whole delta).
- Five rebuild/m4/workout/test/s7-supersede-*.test.cjs: tests 16 / pass 16 / fail 0, exit 0.
- rebuild/m4/workout/test/s7-engine-files-differential.cjs: exit 0, and its sentence is
  whole: "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s) outside this
  package's declared product, all byte-identical to the parent; 18 named and NOT ONE moves,
  so all 45 tracked rebuild/engine file(s) stand byte-identical to the parent's own post;".

## 5. The re-measure, re-hashed by me

I re-hashed every declared path in rebuild/lanes/b/tooling/packages/S7.json from bytes,
against disk AND against Git at HEAD, with my own script (no runner code involved):

- 206 declared paths. DISK MISMATCHES 0. GIT MISMATCHES 0.
- roles: 23 edited / 9 new / 173 carried / 1 superseded-by-child. Unchanged from the
  S7-TOOLING round's accepted shape, as the ruling requires.
- 0 declared paths under any private or excluded location (checked by pattern before any
  file was opened; nothing under rebuild/conform/private was read, listed or hashed).
- runner on disk: sha256 0fb0570d812ea1c1a9426281ae39c8101c1ddd0206b11ad5efa7a3778339cf8d,
  257673 B. tooling.runnerSha256 equals it in all six specs: H3, S3, S4, S5, S6, S7. Those
  are exactly the five ancestors 3514616 re-pinned, plus S7 itself; no other spec moved.
- packages/S7.json sha256 e7658e21f1178f8316ae6dadc3f13d1cd62210fd37693086fd7c4fcbe65ba285,
  83449 B.
- Every author-reported number above reproduced exactly.

## 6. Lockdown and hygiene

- `git diff --numstat 742f3543..HEAD -- rebuild/engine rebuild/coach rebuild/m3
  rebuild/m4/import rebuild/m4/workout/plan-edit-model.cjs rebuild/DECISIONS.md` is EMPTY.
- The whole 742f3543..HEAD numstat touches nine files: the runner, six package specs, the
  one tooling test suite, and the author report. rebuild/m4/spec/acceptance-s7-port-admission.json
  and the brief are untouched.
- 295 added lines across the round, every one of them pure ASCII: 0 U+2013, 0 U+2014, and
  in fact no non-ASCII character at all in any added line.
- HEAD equals origin/rebuild/b-s7-port-admission (40ce5206...); no other ref moved.
- Working tree clean; nothing private read, opened, hashed or quoted at any point.

## 7. Findings

### BLOCKING

None.

### N1 (NOTE) - DECISIONS:516 is not on this branch yet

The ruling the runner comment and the cell both cite stands at line 516 of
rebuild/DECISIONS.md on origin/rebuild/t2-client-core only; this branch's copy is 515 lines
and the round was right not to touch it (lockdown). The citation is therefore correct as
of the chain ref and will be correct here once the tip is merged again. The integrator
should confirm the line is present in Git at the receipt base before the receipt is
written, exactly as claim() requires; no action for the author.

### N2 (NOTE) - the edited suite is not a declared S7 product path

rebuild/lanes/b/tooling/test/parent-pin-shapes-and-spec-successors.test.cjs gained 57 lines
in this round but is ABSENT from S7.json's 206 declared paths. It survives fidelity()'s
UNLISTED-SOURCE-CHANGE check only because it is named in the fixed TOOLING_FILES inventory
at b-package.cjs:343-351, which is the runner's own W7 exemption and is not something this
round introduced or altered. The consequence is narrow but worth stating: the bytes of the
cell that pins this fix are not carried in S7's artifact, while a sibling suite
(test/pinned-unchanged-and-ruled-substitutions.test.cjs) IS a declared product path, so the
chain is inconsistent about which tooling suites it pins. I am not asking for a change in
this round - adding a product entry would move S7.json again for a file the runner already
exempts, and the precedent was set before this round. Worth one line in VERDICT-S7.md.

### N3 (NOTE) - stale runner sha in the brief and in the proposed artifact

The brief names the old runner a07df1e0 at S7-PORT-ADMISSION-BRIEF.md:250, and
rebuild/m4/spec/acceptance-s7-port-admission.json carries it in three places. Both were
correctly left alone: the brief's bytes are bound by DECISIONS:513 and brief.acceptedLedgerLine,
and the artifact is the integrator's to re-propose. The artifact's three occurrences clear
themselves on the re-propose; the brief's one does not, and should be corrected in
VERDICT-S7.md exactly as the S7-TOOLING round handled N7.

### N4 (NOTE) - no --ci or --full in this round, and that is correct

The fix is proven at the level of baselineOf itself, not end to end: nothing in this round
shows HISTORICAL AUDIT SKIPPED actually gone from a --full run, or the open obligation count
back down to one. That is not a gap in the author's work - DECISIONS:516 dispatches the
re-propose, --ci and --full to an integrator hand, and the cell does assert the two things
historical() needs from the resolved baseline (publicPins present, and the audit runner
rebuild/conform/v4/run-defect-laws.cjs inside them). The obligation simply has not been
discharged yet, and the seal must not be read as reachable until the integrator's --full
prints REVIEW-PENDING with exactly one open obligation.

## 8. Counts

| measurement | result |
| --- | --- |
| runner diff | 1 hunk, +11/-1, one literal to one named constant plus its comment |
| cell red against 742f3543 | tests 9 / pass 8 / fail 1, exit 1, BASELINE-UNRESOLVED at (c) |
| cell green at HEAD | tests 9 / pass 9 / fail 0, exit 0 |
| nine lane B tooling suites | 106 / 106 pass / 0 fail, exit 0 |
| five s7-supersede-* cells | 16 / 16 pass / 0 fail, exit 0 |
| s7-engine-files-differential | exit 0, needle whole |
| S7.json declared paths re-hashed | 206, 0 disk mismatches, 0 Git mismatches |
| roles | 23 edited / 9 new / 173 carried / 1 superseded-by-child |
| runnerSha256 agreement | H3 S3 S4 S5 S6 S7 all equal to disk 0fb0570d..., 257673 B |
| lockdown numstat | EMPTY |
| added lines / non-ASCII | 295 / 0 |

VERDICT: ACCEPT.
