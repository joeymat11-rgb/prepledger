# P-MEASURE v1 - AUTHOR REPORT (ROUND 3)

Lane C, screens/plumbing. Model/effort: Opus, high. Branch rebuild/c-measure-v1, rebased
onto origin/rebuild/t2-client-core f2fc4f49 (merge base IS f2fc4f49). Closes REVIEW-R2
in full. All data synthetic; nothing personal read or written.

## Files : hunks

New and unpinned, under rebuild/m3/w7-preview/measure/: measure-sources.mjs (233) is THE
reader both windows share - one replayed state (reads, sleep.nights, dailyLogs,
sessionLog, split, exercises) plus this device's own rows become all seven section-2
measures; measure-screen.mjs (202) is the whole screen (lazy lane, day one, markers
pick, waist entry, both windows, export toggle); test/ holds 6 suites and support.mjs,
32 cells, all executed. `git mv`d there and edited: measure-model.mjs (2 hunks, R2-8 and
R2-5); measure-view.mjs (5: baseline left, trial right, the Epley note, the export
control and its copyable block R2-3, mountMarkerPick R2-7); measure-commands.cjs (2:
earned/measure-trial-start/v1, written once, R2-2); measure-host.mjs (6: liveOps,
sessionSetsIn, sessionDatesIn, foodDays, trialStartIn, firstEnrolledDateIn,
ensureTrialStart); measure-baseline.mjs (rewritten, 47, reading the import through
measure-sources, R2-5); measure-fixture.json (regenerated: 12 weeks with gaps). Outside
it: today-app.cjs (1 hunk, -93/+34) keeps the route, the tile and the accessors only
that page can supply, and is THE ONLY SEALED FILE THIS TICKET TOUCHES;
machine-settings-ui.test.mjs is back at its S4 post bytes; and shared-preflight.yml plus
its registration regression run the two HERMETIC cells, the P6 pattern.

## Cells per bar item, and the R2 finding each closes

(a) journey "the real route renders the trial table week by week" (R2-1, 6, 7): the real
Today route in jsdom over fake-indexeddb, enrolled through the real setup host; 69
weigh-ins, 78 intakes, 72 nights and 42 sets through their own real commands; markers
ticked and submitted on the real pick screen; two waist readings typed into the real
box; 12 rendered rows compared cell for cell with measure-fixture.json's committed
hand-computed table. (b) adherence x4: every weekly percentage, the elapsed-day
denominator (3 of 3 reads 100, not 42.9), the clamp, an unknown plan reading absent. (c)
baseline x4 (R2-5): no import renders NO_BASELINE_YET and no table; a synthetic C2b
import admitted through local-source-basis renders all ten columns in all eight weeks,
none a fabricated zero. (d) journey "the export block text equals the rendered table"
(R2-3): the control is on the screen, the block is a read-only copyable textarea, every
rendered row is in it verbatim, no verdict word and no dash. (e) journey "day one
survives a reload and a later day" and lane "written once, and a later day never
re-bases it" (R2-2). (f) boundary x2: nine modules scanned for network, browser storage,
a second store and the filesystem. (g) boundary x2 (R2-4): S4 pins none of the new
files, exactly one S4 file drifts, the restored test file matches its declared post.
Plus model x7 (the arithmetic the reviewer checked in R2, with R2-8 and R2-5) and lane
x8 over the real encrypted repository.

## Verbatim tails (this PC, this HEAD, after the rebase)

```
[today 13 by name]  tests 645  pass 645  fail 0
[measure 6 suites]  tests  32  pass  32  fail 0   duration_ms 51581.8903
[W6 586]            tests 586  pass 586  fail 0
[coach]             tests 218  pass 218  fail 0
[shared-preflight]  tests  96  pass  96  fail 0   (85 + this lane's 11)
[A1] A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)
[A5] A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached
[rig187] rig187 => PASS
[b-package S4] SEAL BASE ON THE TIP; origin/rebuild/t2-client-core is at
  f2fc4f4 and that commit is an ancestor of this HEAD ... then
  B PACKAGE S4 FAIL WORKTREE-SOURCE-PIN; required evidence missing or failed
```

## The drift, proved

`git diff --name-only f2fc4f49 HEAD` is 19 paths: today-app.cjs, which S4 pins, and 18
S4 names nowhere (this report, the two shared-preflight files, 15 new files under
measure/). Restoring today-app.cjs's f2fc4f49 bytes on disk takes S4 from FAIL to PUBLIC
CI EVIDENCE PASS, so those bytes are the whole red; the code is WORKTREE-SOURCE-PIN, not
SEALED-PROFILE-RECOMPUTATION, because legacy-gates.cjs:16 hashes the WORKING COPY
against the candidate base first.

## Open items

The four store-backed and DOM-backed suites are executed here but registered in no
workflow: shared-preflight materializes a closed public allowlist and cannot open this
page's stack, and rebuild.yml names the today suite file by file and is pinned;
enumerating them there is a lane-B action. writers.cjs's SIGNALS string still calls
waist an unlogged input: pinned, out of custody, now stale. A trial date no enrolled
split covers counts no planned session, so training adherence reads absent rather than
guessing.
