# REVIEW S10-GSS-SETTLE-FIX - Fable (Claude Fable 5.1), round 1, blind read

Reviewer: Claude Fable 5.1 (subagent of the Earned PM seat), 2026-09-25.
Object: uncommitted edits in C:\Users\joeym\AppData\Local\Temp\earned-s10gss,
branch rebuild/c-s10-gss-settle-fix, HEAD ccc2f6320805eaba92963e7158cbe9b2df3a23f2.
Context read: rebuild/DECISIONS.md line 832 at refs/remotes/origin/rebuild/t2-client-core
(in earned-s10int; 832 lines total): the S10 CI-M1 STOP, red GSS-G6-SAVED-SCREEN at
gss-annex-g6-g8.test.mjs:208, remedy = test-only fix on this branch, red-first under a
deterministic slowdown, every oracle and every plant kept; if the saved screen never
appears at all the STOP is a product race, reported and not tested around.
Blind protocol: the builder report GSS-SETTLE-FIX-REPORT.md was NOT opened before the
sections below were written; it is read only in section 9.

## 0. Object as measured

git status --porcelain (worktree earned-s10gss):
 M rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs
 M rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs
No untracked files. git diff --stat: 2 files changed, 30 insertions(+), 0 deletions.

Diff content (both files get the same 13-line helper block after until(); then
one call site per Log-success oracle):
- helper painted(check, milliseconds = 5000): polls check() every setTimeout(0)
  turn until it holds or the wall-clock deadline passes, then awaits settle()
  (the existing fixed 8-turn drain). It never throws and never asserts.
- helper savedScreen(page): /logged/ on [data-slot="saved-title"] AND an
  [data-action="undo"] control present.
- g6-g8: `await painted(() => savedScreen(mounted));` inserted in runG6 (inside
  `if (envelope.result.ok)`, before GSS-G6-SAVED-SCREEN), in runG6NeutralRepaint
  (before the saved/undo capture), in runG7 (inside `if (envelope.result.ok)`,
  before GSS-G7-CLEAN-SAVED-SCREEN).
- log-timing: `await painted(() => savedScreen(mounted));` inserted in runG5
  before the savedTitle/undoPresent capture.
Nothing deleted; no assertion text, no plant, no timeout number, no test title
changed.

Byte identity of the pre-fix bytes: git ls-tree ccc2f63 gives blobs cb88c15 (g6-g8) and
a98e2bf (log-timing); git show ccc2f63:<path> extracted through cmd /c redirection into
the review scratch hashes to sha256 83f4c1db2e7e0216... and cea1cd3f392d8ef6..., which
are exactly the "post" pins S10.json:900 and :910 carry for these two files. The fixed
worktree bytes hash to 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd
(g6-g8, 28870 bytes, 530 lines) and ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0
(log-timing, 19540 bytes, 377 lines).

## 1. Q1 - test-only, inside the five annex files, minimal?  YES

- git status names exactly the two annex test files; no product file, no workflow, no
  package json, no untracked file. gym-app.mjs is clean (git status --porcelain on it
  is empty; its sha256 d41d1e5c52a8850058485129de2eb8c357a6f38bb770c9f2b482ce2f7b528159
  is the checked-in one).
- 30 added lines, 0 removed. Per file: one 13-line helper block (6 comment lines,
  painted(), savedScreen) and one `await painted(...)` line per Log-success oracle
  (3 in g6-g8, 1 in log-timing). Each helper sits next to the file's own settle /
  within / until helpers, which are already duplicated per annex file, so the
  duplication follows the files' existing self-contained style.
- Nothing in the three untouched annex files (identity-reentrancy, remount, timing)
  asserts a saved screen (grep saved-title: only the two edited files), so the fix
  reaches every saved-screen oracle of the annex and no more.
- Minimality note (not a finding): the drain inside painted() is the file's own
  settle(), reused, not a new constant; the 5000 ms deadline is within()'s existing
  bound, not a new number.

## 2. Q2 - any weakening?  NO, measured line by line

- Oracles: every assert text that existed at ccc2f63 still exists, byte-identical:
  GSS-G6-SAVED-SCREEN, GSS-G6-UNDO, GSS-G6-NEUTRAL-SAVED-SCREEN-<kind>,
  GSS-G6-NEUTRAL-UNDO-<kind>, GSS-G7-CLEAN-SAVED-SCREEN, GSS-G7-CLEAN-UNDO,
  GSS-G5-SAVED-SCREEN-MISSING, GSS-G5-UNDO-MISSING (diff shows 0 deletions).
- The predicate the oracle checks is the same predicate painted() waits on
  (/logged/ on saved-title AND an undo control). painted() itself asserts nothing:
  at the deadline it returns and the unchanged oracle fails with its own code (see
  mutant 1 in section 4: the failure code is still GSS-G6-SAVED-SCREEN).
- Plants untouched: PLANTED_LOSS (G6 rows), the #gym-error wipe (G7 CURRENT-ERROR),
  planted-loss (G5), PLANTED_RECLAIM (G8) are not in the diff; the assert.rejects
  expectations at the test() level are not in the diff.
- Negative / refusal paths untouched: in runG6 and runG7 the new line sits inside
  `if (envelope.result.ok)`, so the before-commit refusal (WORKOUT_RESUME_REQUIRED),
  the quota refusals (TRANSACTION_WRITE_FAILED) and their "wrote nothing" and
  "callback 0" oracles run exactly the code they ran before. In runG6NeutralRepaint
  the line follows the existing `assert.equal(envelope.result.ok, true)`, so no
  refusal can reach it.
- Ordering: no wait was removed and no wait was reordered; painted() is inserted
  after the existing `await settle()` and before the first saved-screen read. The
  G5 capture of savedTitle/undoPresent, later asserted at the end of runG5, moves
  by that one bounded wait and nothing else.
- Timeouts: no test() timeout number changed (45000/30000/60000/30000 as before);
  no within() bound changed.
- Wipe detection: after the condition first holds, painted() drains settle() (8
  turns) and only then does the oracle read the DOM, so a stale repaint landing
  inside that window is still caught (mutant 2, section 4). The window is the same
  8-turn drain the pre-fix oracle had after held.done, so nothing narrowed.

## 3. Q3 - the red reproduced with my own slowdown; counts

Method (nothing in the worktree edited, no builder artefact reused):
- Slowdown preload C:\Users\joeym\AppData\Local\Temp\s10gss-review-scratch\fable-slow.cjs:
  wraps SubtleCrypto.prototype.decrypt so every decrypt result is delivered only after
  FABLE_SLOW_TURNS extra setTimeout(0) hops (9 in the campaigns, 12 in the smoke).
  Turn-based, not wall-clock: settle() drains exactly 8 such turns, so a paint whose
  model.read() needs even one decrypt cannot land inside settle(); whether it lands is
  then decided by event-loop order, not by host speed. The preload counts its decrypts
  and prints FABLE-SLOW decrypts=N on exit.
- Unchanged-bytes runs: load hook fable-swap.cjs (Module.registerHooks load) serves the
  ccc2f63 bytes extracted into scratch (orig-gss-annex-*.test.mjs, sha256 verified
  above) under the worktree file's own URL, so every relative import resolves in the
  worktree and the worktree stays untouched. Each run logs FABLE-SWAP <worktree> <=
  <scratch> and the failing frames name the ORIGINAL line numbers (208, 336, 383),
  which are the pre-fix positions of those asserts.
- Every run went through node pm-run.cjs shared <job> <cmd> with the S10-T4 guard in
  NODE_OPTIONS, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, S10_T4_CHILD=gssfixrev,
  and the file executed directly (node <file>), never today-17 and never --test over
  the set. The guard log line for gssfixrev: none (guard clean; checked in section 7).

Counts (each "run" = the whole file, all its tests):

| file | bytes | slowdown | runs | result | failing oracle (every red run) |
|---|---|---|---|---|---|
| gss-annex-g6-g8 | ccc2f63 (orig) | 9 turns/decrypt | 10 | 10/10 RED (pass 1, fail 4 each) | GSS-G6-SAVED-SCREEN @orig:208, GSS-G6-NEUTRAL-SAVED-SCREEN-why-toggle @orig:336, GSS-G6-NEUTRAL-SAVED-SCREEN-settings-read @orig:336, GSS-G7-CLEAN-SAVED-SCREEN @orig:383; x10 each |
| gss-annex-g6-g8 | fixed (worktree) | 9 turns/decrypt | 10 | 10/10 GREEN (pass 5, fail 0 each; 516 decrypts each run) | - |
| gss-annex-g6-g8 | fixed (worktree) | 12 turns/decrypt (smoke) | 1 | GREEN 5/5, 95.7 s | - |
| gss-annex-log-timing | ccc2f63 (orig) | 9 turns/decrypt | 10 | 10/10 RED (pass 2, fail 1 each) | GSS-LOG-MISSING-CONTROL [data-slot="primary"] @orig:251 (runG5's click on the saved screen's primary control before the screen is painted) x10 |
| gss-annex-log-timing | fixed (worktree) | 9 turns/decrypt | 10 | 10/10 GREEN (pass 3, fail 0 each; 339 decrypts each run) | - |
| gss-annex-g6-g8 | fixed (worktree) | none | 1 | GREEN 5/5, 4.9 s | - |
| gss-annex-log-timing | fixed (worktree) | none | 1 | GREEN 3/3, 4.3 s | - |

Each orig run logged exactly one FABLE-SWAP line for the test file (10 + 10 swap lines in
camp-orig-g6.swap.log / camp-orig-lt.swap.log); the decrypt count per run is constant
(516 / 341 / 339 / 253), i.e. the fixture and the slowdown are deterministic, not a
sampled race.

Two observations from the reproduction:
- The G6 red the ledger names (GSS-G6-SAVED-SCREEN at :208) is exactly the first red
  the unchanged bytes throw under the slowdown, and the three sibling oracles
  (NEUTRAL x2, G7-CLEAN) go red the same way; the fix covers all four.
- The pre-fix log-timing file has the same latent hazard but shows it under a different
  code: runG5 reads savedTitle without asserting and then asserts the primary control
  (GSS-LOG-MISSING-CONTROL), so CI would have reported that code, not
  GSS-G5-SAVED-SCREEN-MISSING. The fix's painted() before that capture removes it.
- Timer quantum, for the record: (95.7 s - 4.9 s) / (516 x 12 hops) = 14.7 ms per
  setTimeout(0) hop on this PC, so settle()'s 8 turns are about 120 ms of wall clock
  here but about 8 ms on a Linux host with a 1 ms timer floor. That is why the file
  passed 12/12 locally at the PM seat and went red on the hosted runner: the drain
  is turn-counted, and its wall-clock length is host-specific.

## 4. Q4 - mutants against the FIXED test (worktree untouched; gym-app.mjs served from
   scratch copies through the same load hook, each run logged FABLE-SWAP for gym-app.mjs)

| mutant (scratch copy of gym-app.mjs) | fixed g6-g8 | fixed log-timing | same mutant on ccc2f63 bytes |
|---|---|---|---|
| M1 saved title says "recorded", never "logged" (screen never satisfies the oracle) | RED 4 fail: GSS-G6-SAVED-SCREEN @222, NEUTRAL-SAVED-SCREEN x2 @351, G7-CLEAN-SAVED-SCREEN @399 (each after painted()'s 5 s deadline, actual '' vs /logged/) | RED: GSS-G5-SAVED-SCREEN-MISSING @307 | not run (trivially red) |
| M2 stale repaint of the OLD active view 1 timer turn after the saved screen appeared (wipe inside settle's drain) | RED 4 fail, same four saved-screen oracles; also RED under the 9-turn slowdown (4 fail, same oracles) | RED: GSS-LOG-MISSING-CONTROL primary @265 (the wiped screen has no primary control) | RED 4 fail, same oracles |
| M3 the same wipe 20 timer turns after the saved screen appeared (outside the drain) | pass 4, fail 1: the one red is the mutant's own uncaught "missing approved template t-gym" after teardown, not a saved-screen oracle | not run | identical: pass 4, fail 1, same teardown throw |

Answer: (a) the fixed test cannot pass while the saved screen never appears: painted()
returns at its deadline and the unchanged oracle fails with its own code (M1). (b) A
wipe by a stale repaint inside the 8-turn drain after the screen appears is caught
(M2), with and without the slowdown. (c) A wipe landing later than that drain is not
caught by the saved-screen oracles (M3) - and the ccc2f63 bytes behave identically,
because the pre-fix oracle read the DOM at the same 8-turn distance from held.done.
So the fix narrows nothing; the detection window is unchanged. The product-level
guard against a stale repaint is the neutral-repaint pair (why-toggle, settings-read),
which stays in force and is green under the slowdown.

## 5. Q5 - is the product-race question settled correctly?  YES

DECISIONS:832 draws the line: if the saved screen never appears at all the STOP is a
product race; if it appears late, the annex bytes are wrong. Measured: with the paint's
own decrypts held back 9 and 12 event-loop turns each, the fixed oracles pass 20/20 runs
(g6-g8 + log-timing) with the same predicate the pre-fix oracle used, on the same mount
(no remount, no relaxed selector), so the screen does appear and does say "logged" with
its undo control; it simply needs more macrotask turns than settle()'s fixed 8 after
held.done, because logOutcome's `await paint()` runs hooks.readView() -> model.read()
over the encrypted store (fake-indexeddb transactions plus subtle.decrypt on the
threadpool). That is the product's designed path (gym-app.mjs logOutcome, unchanged
here), not a race between two writers of the phone element: `owns` is still true, no
leaveCard ran, and M2/M3 show what a real stale-writer race would have looked like
under these oracles. The pre-fix drain was never a bound on that path; painted() is,
with within()'s 5 s. No product byte is touched and no product semantics are inferred
that the test did not already assert. Not measured here: the hosted runner itself (the
diag branch run the ledger names); this review's evidence is the local deterministic
reproduction plus the timer-quantum arithmetic above.

## 6. Q6 - children affected, rebuild.yml naming

- S10.json children: 36 children scanned; the two edited paths appear in exactly one
  argv, today-17 (24 argv entries: --test, --test-reporter=tap, 22 files, the five
  annex files among them). No other child names them, so T4 = today-17 only; the
  s10-sup-* and today-split-fence children do not run these files.
- S10.json file pins :898-912: both edited files carry role "new" with post sha256 equal
  to the ccc2f63 bytes (83f4c1db..., cea1cd3f...). The fixed bytes (64b08752...,
  ae42d717...) are not pinned anywhere yet; S10-REGEN must re-pin them, exactly as the
  :832 remedy path already says. Until then the seal would trip on these two pins.
- .github/workflows/rebuild.yml:259 (the A1/A2/A3/A4 step) names 23 test paths by
  exact path, the five gss-annex files among them, and the diff does not touch the
  workflow; no rename, no glob, nothing to change for this fix. The step comment
  (S10 NAMES THE FIVE GSS ANNEX FILES HERE) still matches the run line.
- rebuild/lanes/b/S10-FINAL-CENSUS.tsv rows 312/314 record the pre-fix hunk stats
  (0/514, 0/363 lines) for the two files; it is a lane record, not a pinned input of
  S10.json, so it is informational, but the PM may want the census row refreshed by
  whatever regenerates it.

## 7. Q7 - what a seal would trip on

- sha drift: S10.json:900 and :910 (see 6) - expected, handled by S10-REGEN.
- CRLF: git ls-files --eol shows i/lf w/lf attr text=auto eol=lf for both files; raw
  byte scan: CR=0, TAB=0, last byte 0x0A, in both.
- non-ASCII: 0 bytes > 0x7F in both files and 0 in the diff text; the comment uses
  "->" and plain hyphens.
- git diff --check: clean (exit 0).
- stray files: git status --porcelain shows only the two M lines; no ?? entries, no
  ignored files under today/ (status --ignored=matching on that path shows only the
  two M lines).
- junctions: the only reparse points under the worktree are the three existing
  node_modules junctions (root, m3/w5, m3/w6), i.e. the dependency junctions the rules
  describe, untouched.
- Guard: s10-t4-guard.log has 0 lines for S10_T4_CHILD=gssfixrev; no S10-T4-GUARD text
  in any of this review's outputs.
- Line numbers cited in the ledger (:208) move to :222 in the fixed file; any
  needle in S10.json that quotes a line number for these files would need REGEN, but
  the today-17 needle is "the runner's grammar" (S10.json:2054), not a line number.

## 8. Verdict: ACCEPT WITH NAMED DEBTS

The edit is test-only, confined to two of the five annex files, purely additive, keeps
every oracle, plant, negative path and timeout byte-identical, reproduces red-first
under an independent deterministic slowdown (20/20 red on the ccc2f63 bytes, 20/20
green on the fixed bytes), and the fixed oracles still fail with their own codes when
the saved screen never appears or is wiped inside the drain. No blocker.

Debts (pre-existing hazards made visible by this round; none introduced by the fix,
none blocking):
- D-GSSFIX-1 until() is an iteration budget (400 x setTimeout(1)), so its wall-clock
  length is host-specific like settle()'s was (about 6 s on this PC, about 0.4-0.5 s
  on a 1 ms-timer host). No GSS-ANNEX-TIMEOUT was reproduced in any run here, so it
  was rightly left alone under the red-first rule, but it is the same defect class
  as the one just fixed and the first hosted GSS-ANNEX-TIMEOUT would land on it. Fix
  shape when it does: the same wall-clock deadline painted() uses.
- D-GSSFIX-2 the saved-screen oracles detect a stale wipe only inside settle()'s
  8-turn drain after the screen appears (mutant M3: a wipe 20 turns later passes the
  same oracles on the ccc2f63 bytes and on the fixed bytes alike). The product-level
  guard for that class is the neutral-repaint pair, which stays green; recorded so
  nobody reads painted() as a wipe detector beyond that window.

Required follow-ups already named by DECISIONS:832 (not debts of this fix): S10-REGEN
re-pins S10.json:900/:910 to 64b08752... / ae42d717...; T4 for today-17 (the only
child that runs the files); T6; a new T7 merge; hosted CI-M1 re-proof.

## 9. After the blind read: the builder report (GSS-SETTLE-FIX-REPORT.md), compared

Read only after sections 0-8 were written. Agreement on every measured point: the same
four red sites and five red cells, the same codes (including GSS-LOG-MISSING-CONTROL
[data-slot="primary"] as G5's pre-fix symptom), the same ~15 ms timer quantum and the
same explanation of local-green / hosted-red, the same diff bytes and sha256 pairs,
the same today-17-only child list, the same S10.json:900/:910 pin follow-up, and the
same mutant outcomes for "never appears" and "wiped inside the drain". Differences,
none of which change the verdict:
- The builder's slowdown is a wall-clock setTimeout(d) on every SubtleCrypto method
  loaded with --import; mine is a turn-counted delay on decrypt only, loaded with
  --require, and runs the unchanged bytes through a load hook under the worktree URL
  instead of rewritten-import copies. Both reproduce 10/10.
- The builder additionally measured that with no slowdown the saved screen already
  needs up to 8 of settle()'s 8 turns (zero margin) and that the saved screen appeared
  in 295/295 ok cells 78-121 ms after held.done; I did not repeat the probe, and my
  20/20 green under a harsher turn-based delay is consistent with it.
- The builder's residual-risk note 1 (until() iteration budget) is what I name
  D-GSSFIX-1; the builder's log-timing M2 code differs from mine ([data-action="back"]
  from the finally cleanup vs my [data-slot="primary"]) because the builder's M2 empties
  the phone while mine repaints the old active view; both are named reds, both
  pre-existing in shape.
- My M3 (wipe outside the drain) is not in the builder's set; it is D-GSSFIX-2.
- Builder says S10_T4_CHILD=gssfix; this review used gssfixrev as instructed. Guard log
  clean under both.

## 10. Files this review wrote (all outside the worktree)

- This file: C:\Users\joeym\AppData\Local\Temp\s10gss-scratch\REVIEW-S10-GSS-SETTLE-FIX-FABLE-l1.md
- Scratch C:\Users\joeym\AppData\Local\Temp\s10gss-review-scratch\: fable-slow.cjs,
  fable-swap.cjs, orig-gss-annex-g6-g8.test.mjs, orig-gss-annex-log-timing.test.mjs,
  mutant1/2/3-gym-app.mjs, smoke-*.cmd, camp-{fixed,orig}-{g6,lt}.cmd, mutants.cmd,
  mutant3-orig.cmd, and their .out/.err/.slow.log/.swap.log outputs.
- Worktree: no file edited or created; git status unchanged (two M lines); no git
  write command run; nothing under earned-s10int or earned-astra-131 touched.

## AAR
- Asked: blind round-1 review of the S10 GSS settle fix: Q1-Q7 by measurement, own slowdown, 10+ runs each way, mutants, verdict with sha256.
- Happened: 2-file/+30-line diff read; ccc2f63 bytes extracted and run via a load hook under my turn-based decrypt slowdown: orig 10/10 + 10/10 red at the ledger's oracles, fixed 10/10 + 10/10 green; three product mutants (never/wiped-inside/wiped-outside) run on fixed and orig bytes; children, pins, EOL, ASCII, junctions checked; builder report read last and found consistent.
- Went well: turn-counted slowdown gave a deterministic red with constant decrypt counts per run; the load hook let the unchanged bytes run without touching the worktree; the review stayed blind until section 9.
- Went badly: the first smoke used 12 turns and cost 96 s per run because of the 15 ms Windows timer quantum, so campaigns were slow; one poll exceeded the 60 s call limit and had to be re-issued; I held three of four shared slots for a few minutes while Astra was also running.
- Change next time: measure the timer quantum first and size the slowdown to it; run campaigns at two slots max; add a "wipe outside the drain" mutant to the standard set so D-GSSFIX-2-type windows are stated up front.
- Verdict: ACCEPT WITH NAMED DEBTS (D-GSSFIX-1 until() iteration budget, D-GSSFIX-2 wipe window), no blocker; S10-REGEN must re-pin S10.json:900/:910.
