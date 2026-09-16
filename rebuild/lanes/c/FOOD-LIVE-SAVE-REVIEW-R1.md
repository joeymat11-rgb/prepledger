# FOOD-LIVE-SAVE - independent review, round 1 (Opus high)

VERDICT: ACCEPT, with one MAJOR follow-on finding that does not block this fix.

Reviewed 3124d71 on a detached worktree off the PM repo, junctions only, no install; base
78911ad1 (`origin/rebuild/d-p3-replay-all`); Node 24, TZ=America/New_York.

## 1. The reproduction, mine
My own cells, my own figures (`{cal:1780,pro:132}`, `leg-press` / "seat 3, back pad 2")
and my own instants (2026-09-16T21:35Z EDT, 2026-11-20T23:10Z EST), over the shipped
boot path `today-entry.boot({ now })` with no declared day. With ONLY the two host files
checked out at the base bytes:

```
AssertionError: food save: null state 20      (RV/1 summer 2026-09-16 EDT)
AssertionError: food save: null state 20      (RV/1 winter 2026-11-20 EST)
```

With HEAD bytes restored my four cells and the author's six pass together,
`tests 10 / pass 10 / fail 0`. RV/1 also asserts both ops carry the page's own day, the
offset in force at that instant, and NOT the pinned `08:00` hour; RV/2 holds the
declared-day path at `08:00` / `-05:00`; RV/3 walks the census off the directory. So the
RED side is real at the base on both dates, and this change is what turns it green.

## 2. The cause, and the choice of defect
Confirmed at the source. `rebuild/m3/w6/local/host-bindings.mjs:244` is
`const clock = hostClock || scope.clock;`, commented "With no `clock` the installation's
own is used, exactly as before" - a documented path, not a hole. `live` is reachable only
inside the installation and `today-bindings.mjs` is pinned, so a lane outside it cannot
literally pass live the way today-bindings does; declaring none is the only available
spelling of option (i), and it is what `sleep-host.mjs:106` and `measure-host.mjs:159`
already do. The era rule is untouched, no guard widened, no existing test edited.

## 3. Drift
`git diff --name-only 78911ad1 HEAD`, each findstr'd against `packages/S5.json`:

```
rebuild/lanes/c/FOOD-LIVE-SAVE-AUTHOR-REPORT.md          UNDECLARED
rebuild/m3/w6/host/test/food-live-save.test.mjs          UNDECLARED
rebuild/m3/w7-preview/today/food-host.mjs                UNDECLARED
rebuild/m3/w7-preview/today/machine-settings-host.mjs    UNDECLARED
```

No engine byte, no conform, no ledger, no existing test. CR=0 and zero U+2013/U+2014 in
all four. THE AUTHOR'S CORRECTION TO THE TICKET IS CORRECT, verified twice: `findstr`
over `packages/*.json` finds neither host name in any package, and a throwaway worktree
at the current tip `1d30eebb` with 3124d71 cherry-picked onto it reports `0 unlisted
drift` from `b-package --ci --package S5` - byte-identical to clean `1d30eebb` with the
commit absent. No sealed drift, and no S6 declaration owed for these two files.

## 4. b-package: his account is right, his remedy line is overstated
At the review HEAD I reproduce his tail verbatim,
`B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`. Rebased onto `1d30eebb` the base
check clears (`SEAL BASE ON THE TIP ... ancestor of this HEAD`) but S5 still fails, on
`AUDIT RED-FIRST FAIL` / `FAIL CHILD-REQUIRED-EXIT-ZERO` (`97/104 mutant executions
DETECTED`) - and clean `1d30eebb` without this commit prints the SAME two lines. S5 is
red at the tip for a reason that is not this ticket's, so a rebase does not make it green.

## 5. Findings
1. MAJOR - `food-host.mjs:85`, `machine-settings-host.mjs:72`. Taking the installation's
   clock takes its DAY too, so a host handed an `era` standing on another day now stamps
   the ERA's day and silently cannot read its own write back. Measured, not argued: a
   declared-day installation on 2026-09-10, `createFoodHost({ day: '2026-09-11', era })`
   gives HEAD `save ok:true ... stamped 2026-09-10, forDate('2026-09-11') 0`; the base
   bytes give `stamped 2026-09-11, forDate('2026-09-11') 1`.
   NOT BLOCKING: no product caller passes `era` (`today-app.cjs:550`, `gym-app.mjs:161`
   pass only `day`, which `openTodayHosts` adopts); the old behaviour on a live era was a
   refusal, not a right answer; and `sleep-host.mjs` and `measure-host.mjs` have carried
   the identical exposure since they were written. But it is the silent drop that
   `host-bindings.mjs:236-240` and today-bindings `reconcile()` both say must be refused
   BY NAME, and FLS/5 now makes "declare no clock" a law for four hosts without pinning
   the day half anywhere. Follow-on ticket over all four family-(b) hosts: refuse by name
   when a supplied `era.liveDay()` disagrees with the host's `day`, with a cell.
2. MINOR - the b-package remedy sentence in his report section 7; see section 4 above.
3. NOTE - census complete: I walked `today/` and `measure/` off the directory rather than off a list, and got exactly the eight files FLS/5 names.
4. NOTE - no assertion anywhere was removed or relaxed. The only law-adjacent edit is
   the comment rewording forced by `food.test.mjs` N1.19, and N1.19 is green.
5. NOTE - his section 8 owner sentence is accurate against what I measured: refused,
   state 20, nothing written, nothing recoverable.

## 6. Tails, mine, verbatim
```
my cells + the author's six                          tests 10 / pass 10 / fail 0
base bytes, my cells       RV/1 summer and winter FAIL "food save: null state 20"
W6 (w6/test/*, w6/host/test/*)                       tests 639 / pass 639 / fail 0
today-17 (MEASURED_TEST_NOW=2026-09-03)              tests 666 / pass 666 / fail 0
w7-preview/import                                    tests 15 / pass 15 / fail 0
m4/import (6 suites)                                 tests 83 / pass 83 / fail 0
lanes/d replay-all + replay-measure + retract + admission-swap + w6 local-source
  consumer and admission                             tests 77 / pass 77 / fail 0
coach 231/231, client 18/18, port (m3/setup/port) 65/65, rig187 => PASS
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256
b-package --ci --package S5   FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP   (base position)
```

`m4/import/test/browser-parity.test.mjs` and `.../s3/harness.test.mjs` were not run: a
real owned dispatcher scratch this lane may not open. Pre-existing. My review cells were
transient and are not committed; only this report is.
