# P3-REPLAY-ALL-FAMILIES - INDEPENDENT REVIEW R3 (Fable final, DECISIONS:439)

VERDICT: ACCEPT

Reviewed sha 8632507 on `rebuild/d-p3-replay-all` (off 53e1ae78; the sha R1 reviewed, so
R1's MINOR 3-6 are carried unaddressed) in my own detached worktree, three junctions, Node
24.19, TZ=America/New_York. My own cells live under %TEMP%\raf-rv\ and are not in the tree.

## What I re-derived

RV-1. ENUMERATION, MY OWN NET. I built the same page graph (112 pinned modules) and scanned
every module for (a) any accepted class as a quoted string anywhere, (b) any DYNAMIC
`class:` site, (c) every client write API name. The only dynamic sites are the producers'
own in-file `OP_CLASS`, `spec.class` (ops.cjs), `a.class` (commitBatch) and `rej.class`
(fixRejected) in client/index.cjs. `local-client.mjs:49` routes exactly five commands
(weighIn, logSet, logSession, finishSession, workout), so fixRejected, correction and
tombstone are unreachable from the page and the `workout` command writes only what an
injected producer prepares. The register's ten (module, class) pairs are the writers, name
for name. NO WRITER IS MISSING. checkin-model.mjs:285 refuses a second check-in per day
(ALREADY_RECORDED), so F5's one-per-day rule matches what the page can write.

RV-2. JOE'S REAL DAILY SLEEP PATH, both orders, through the real hosts on one installation
(my RV-A/RV-B): a check-in with sleep_hours ENTERED, "Use these hours" (a night CITING that
check-in), "Change sleep" (a correction with `supersedes`), a bed/wake night, and a night
dated 2026-08-20, BEFORE the file's last read. Written first: the import ADMITS, F5 and F8
answer, the four nights come back retained in date order (08-20, 11-18, 11-19, 11-19),
none reaches state.sleep.nights, every sleep op is in `view.retained` byte-equal to the
store, op count unchanged, and the sleep screen reads exactly what it read. Import first:
the same path writes, the imported lifts still stand. The producer's own
`revisionIsCurrent` (sleep-commands.cjs) reads `op-<device>-<seq>` below the op's own seq,
so a correction re-validates at replay against the same history it was committed against.

RV-3. MALFORMED BY NAME, through the real controller (my RV-C0..3): a sleep CORRECTION kind,
a night whose `supersedes` names a non-winner, a night recorded after the day admission
stands on, and a body-composition record carrying the SLEEP profile - each refuses its own
code (SLEEP_UNRESOLVED x3, BODY_COMPOSITION_UNRESOLVED), never the catch-all, nothing
committed. The author's SF3 seven shapes and CM1-4 also green.

RV-4. RED SIDE, MY MUTANTS (reverted, tree clean): `const OP_CLASS = "steps"` appended to a
pinned page module (food-model.cjs) turned P3-EN1 red naming
`rebuild/m3/w7-preview/today/food-model.cjs#steps`. A second mutant, a writer whose class is
read from ANOTHER module's constant (`class: Model.X`), left P3-EN1 GREEN - R1 finding 6
confirmed; none such exists today (RV-1).

RV-5. NO LAW WEAKENED, NO RECORD REWRITTEN. The source-admission.mjs hunks route the two
owned classes before the generic day guard exactly as F7 already was; the per-op context
check at the top of replay() still covers every op of every class. No engine, today/**,
measure/**, sleep-*, gym-*, client/**, coach/** or packages/*.json byte; all 12 files LF,
no BOM; the runbook gains one em dash (operator doc); A1 dash scan PASS.

RV-6. THE S5 STOP IS A BASE CONDITION AND A REBASE CLEARS IT - PROVED. On 8632507: FAIL
SEAL-BASE-IS-NOT-THE-CHAIN-TIP (53e1ae78 is not an ancestor of the tip; the merged measure
family is a554ac9, the same bytes re-committed; `git diff 53e1ae78 origin/tip` touches 4
non-product files). 8632507 cherry-picks CLEANLY onto the current tip 380db82 and on that
HEAD `b-package --ci --package S5` = `SEAL BASE ON THE TIP ... PUBLIC CI EVIDENCE PASS`.

## Findings

1. MAJOR (carried; the ticket's own allowance). ONE writer stays closed to pre-import use:
   the gym card, refused by F3's own law (P3-WO1[session] pins LOCAL_SOURCE_WORKOUT_
   UNRESOLVED, nothing committed). Runbook pre-check 8 names it and nothing else. Joe trains
   as often as he sleeps: `local-capture-start-resume` is on the port's critical path.
2. MAJOR (writer-side, correctly NOT fixed here) - NOW REPRODUCED, which R1 did not: on a
   LIVE era (my RV-F, live 2026-09-16T17:00Z) food-host.save and machine-settings-host.save
   both return `ok:false, state 20, "Connect once to keep saving ... after 2027-10-21"`
   and write nothing, while sleep-host.save on the same era returns ok:true. FOOD LOGGING
   AND MACHINE NOTES DO NOT SAVE ON THE SHIPPED PAGE. Cause as R1 read it: both hosts call
   `clientClockFor(day)` without `live`. Needs its own lane ticket NOW; until it lands the
   F2 and F4-machine per-writer cells stand only on the pinned clock (stated in the file).
3. MINOR (runbook wording). Pre-check 8 says the six writers "may all be used before the
   import, in any order, and the import still admits". True for a record dated after the
   file's last day; a weigh-in or food day dated ON or BEFORE the file's last read/held day
   refuses by F1/F2's own law (my RV-D: 2026-08-31 and 2026-08-20 -> READING_UNRESOLVED).
   Say "dated after the file's last entry" so the line cannot be read as unconditional.
4. MINOR (R1-3, carried). `body-composition-class.cjs` attaches `profile` to its refusal but
   `issue(code,id)` keeps only {code, op_id}; through the real controller the profile is
   dropped. Carry it or stop claiming it (module header, author report).
5. MINOR (R1-4, carried). P3-EN2's "admission really runs this family" disjunction ends in
   two unconditionally-true clauses; only the `'F<n>'` literal check tests anything.
6. MINOR (R1-6, carried, now demonstrated by mutant). The enumeration sees a class only as
   a literal or an in-file OP_CLASS; a writer importing its class constant is invisible.
   State the reach in the cell, or also resolve `class: <Ident>.<NAME>` against the import.
7. MINOR. P3-SF2's "all dated BEFORE the import's last day" guard is `night.date <= last ||
   night.date < '2026-09-04'`; the second disjunct is always true for these nights, so the
   guard proves nothing (the fact holds: the fixture's last day is 2026-09-03).
8. MINOR (R1-5, carried). "m4/import 86/86" is not what I land on: 5 non-s3 files 35/35;
   s3 harness + production-* 40/41 with S3_RUN_ROOT set (the one fail is the untouched
   harness's S3_NODE22_REQUIRED preload under Node 24). State the command with the figure.
9. NOTE. R1-7 stands (`op.effective.local_date` after validate, unreachable). S6 must
   declare the three new m4/import modules and enumerate lanes/d/p3-replay-all/*.test.mjs
   in rebuild.yml. My two RV-6 cherry-pick commits are unreferenced objects only.

## Tails I ran (Node 24, TZ=America/New_York; MEASURED_TEST_NOW=2026-09-03 where named)

- this lane 4 files + measure-family: `tests 32 / pass 32`; p3-replay-measure both files
  `tests 9 / pass 9`; my rv-cells `tests 6 / pass 6`.
- w7-preview/import (15 incl. the P2 witness) `tests 15 / pass 15`.
- m4/import: browser-parity, engine-provider, local-source-order, prepare, reading-replay
  `tests 35 / pass 35`; s3 harness + production-admission + production-mapping `tests 41 /
  pass 40 / fail 1` (S3_NODE22_REQUIRED, environmental, untouched file).
- retract + admission-swap + local-source-admission/consumer/commit `tests 51 / pass 51`.
- W6 `tests 586 / pass 586`. today-17 + 4 measure suites `338 + 328 = 666 / pass 666`.
- port + port-harden + seal `tests 65 / pass 65`. `rig187 => PASS`.
- `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client)`.
- `b-package --ci --package S5`: on 8632507 `FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP`; on
  8632507 cherry-picked onto tip 380db82 `PUBLIC CI EVIDENCE PASS`.

SYNTHETIC ONLY: no rebuild/conform/private, ledger/, src/history.js or EarnedPort path was
opened, listed or named; every --out and S3_RUN_ROOT went under %TEMP%\raf-out.
