# TODAY17-HARDEN - builder report (test-only; a later reseal carries it; NOT part of S11)

Builder: Claude Opus 5.5 subagent (BUILDER role only). Worktree C:\Users\joeym\AppData\Local\Temp\earned-t17h, branch
rebuild/c-today17-harden at the sealed S10 head edb8381 (uncommitted edits only). Scratch: C:\Users\joeym\AppData\Local\Temp\t17h-scratch.
Input: today17-hunt3\HUNT-REPORT.md (read whole), its preloads (today17-hunt2\h2-preload.mjs reused unchanged, loaded by URL;
today17-hunt2\files19.txt read). Precedent method: s10gss-scratch\GSS-SETTLE-FIX-REPORT.md (red first, a bounded wait on the
oracle's own condition, assertion bytes unchanged, purely additive, product mutants). Date 2026-09-26, node v24.19.0, win32.

## 0. Verdict: FIX-READY (test-only)

- All six ranked cells fixed, each by a wait on the observable condition its oracle depends on (never a longer sleep or a
  bigger count): 5 files, +121 / -0 lines, every original line byte-identical, journey.test.mjs untouched, no product byte.
- RED FIRST on the unchanged bytes: R3 2/2 (a5p), R4 2/2 (a2), R5 2/2 (a2), R6 trio 1/1 (a2, all three together), R1
  natural 1 of 2 in the set shape under a2p (d5 alone 0/5 today) plus the deterministic slow-store witness MS-SLOW2ND 2/2
  (R1 at :69 and R2's LOCAL_CLIENT_CLOSED); R2 natural did not recur today (hunt2's two natural logs are cited).
- GREEN AFTER: 128 of 128 runs, 0 red, under v0 and all seven hunt variants (d5 a2 a5p a10p a2p c16 b5): each of the five
  changed files alone x3 per variant (120 runs) and the whole guard-clean set once per variant (8 runs, 621/623 each). 0
  deadline hits, 0 unhandled rejections, 0 S10-T4-GUARD lines. The only failures in any green run are the two PIN GUARDS
  that name exactly this ticket's edited files (boundary.test.mjs:213, setup.test.mjs:2437): by design until the reseal
  declares the new bytes.
- The new waits hide nothing: every "the screen never arrives" product mutant still fails on the cell's own oracle with the
  natural red's message; MS-NOREPAINT fails loudly at the new wait's deadline; MS-SLOW2ND goes 2/2 red -> 0/2.
- For the PM: re-pin rebuild/lanes/b/tooling/packages/S10.json :789/:790, :854/:855, :924/:925, :945, :950 at the reseal
  (section 6). Environment limit: package.test.cjs and seven build-dependent tests cannot resolve their bundle packages in
  this junction-less worktree (esbuild), so the file was stopped and the seven skipped by name (section 2); set = 18 files.

## 1. What changed (purely additive: +121 lines, 0 removed, 5 files; journey.test.mjs untouched)

| file | + | what |
|---|---|---|
| rebuild/m3/w7-preview/measure/test/support.mjs | 51 | typeWaist: one more wait, on the section the save's OWN repaint put up holding its table (R1). page(): a MutationObserver records every #measure-screen section the page puts up; close(): waits until every one reached a paint() end state before the stores close (R2). |
| rebuild/m3/w7-preview/today/test/checkin.test.mjs | 16 | reached() helper; one wait before :548's oracle on #gym-weight (R3) |
| rebuild/m3/w7-preview/today/test/gym.test.mjs | 18 | reached() helper; one wait before :508-513 on the saved-set screen (R4) |
| rebuild/m3/w7-preview/today/test/setup.test.mjs | 15 | reached() helper; one wait before :1473 on api.screen() === 'today' (R5) |
| rebuild/m3/w7-preview/today/test/problem.test.mjs | 21 | reached() helper; `const beforeReady = ...ready` before the tap in S6C.3/S6C.4 (P0C.1 already had it); one wait each on api.ready !== beforeReady before :990, :3244, :3273 (R6) |

Every original line is byte-identical (git diff --numstat: 0 deletions in all five files; fix.diff has 0 removed lines), so
every assertion, label, plant and sleep is unchanged; each existing fixed wait stays where it was and the new wait follows
it. reached() (today files) is the precedent's painted(): a wall-clock deadline (performance.now(), 10 000 ms) polling
setTimeout(0) turns on the exact condition the next oracle asserts; it never asserts: at the deadline it prints
`TODAY17-HARDEN-DEADLINE <ms> ms: <what>` on stderr and returns, so the unchanged oracle fails with its own message; once the
condition holds it repeats the site's own original wait (settle() / 60 ms / 50 ms), so anything the old window saw is
still seen. The measure waits use that file's own settle(), which already fails loudly (MEASURE-SETTLE-DEADLINE, 30 000 ms,
overridable by MEASURE_SETTLE_DEADLINE_MS).

## 2. Method and environment

- Every node run: `node pm-run.cjs shared t17h-<job> t17h-scratch\job.cmd` (one shared slot at a time; runner.ps1 strictly
  sequential; chain.ps1 starts the next list only after the previous runner wrote RUNNER DONE), MEASURED_TEST_NOW=2026-09-03,
  TZ=America/New_York, NODE_OPTIONS=--require %TEMP%\s10-t4-guard.cjs, S10_T4_CHILD=t17h-<job>. Driver batch.cjs (adapted
  from today17-hunt3\h3-batch.cjs): `node --import nlr-build\deps-loader.mjs --import today17-hunt2\h2-preload.mjs
  [--import t17h-scratch\mutant-hook.mjs] --test --test-reporter=tap [--test-name-pattern] --test-skip-pattern x7 <files>`,
  NODE_PATH = earned-adm\rebuild\m3\w6\node_modules;earned-astra-47\node_modules (exactly as nlr-r22-l5-scratch\run5.ps1).
  One invocation at a time; "alone" = the file alone; set18 = one concurrent invocation of the set (the today-17 shape).
- Variants = the hunt's knobs, unchanged: a2 H2_CRYPTO_MS=2; a2p 2 precise; a5p 5 precise; a10p 10 precise; b5
  H2_IDB_MS=5; c16 H2_TIMER_MIN=16; d5 H2_TIMER_FAST=1 + crypto 5 precise; plus v0 (no knob) as the control.
- ENVIRONMENT LIMIT (said; file stopped as the brief requires): this worktree has no node_modules junction and esbuild
  resolves bundle imports on the file system only (neither the ESM loader nor NODE_PATH reaches it); build.mjs
  buildToday() fails `Could not resolve "@noble/hashes/sha2.js"` (6 errors; logs\smoke-v0-package-1.log). So
  package.test.cjs cannot resolve its packages this way and was STOPPED (set18 = files19.txt minus package.test.cjs), and
  the seven build-dependent tests in the other files are skipped BY NAME in every run: food N1.17, machine-settings-ui S14,
  problem R3 x2 / N2-16 / S6C.7b, setup S17 (S17 reads the build's dist). None is a hardened cell. Set count: 644 (hunt) -
  14 (package) - 7 = 623.
- PIN DRIFT OF THIS TICKET'S OWN EDITS (expected; not weakened, not skipped): two guards fail by design until a package
  declares the new test bytes: boundary.test.mjs:213 "P-MEASURE (g) - no S4-sealed file drifts..." (names exactly
  gym/checkin/setup/problem.test.mjs) and setup.test.mjs:2437 "re-pin - every file the B-NTC package pins is untouched..."
  (names gym.test.mjs 17901c4d95e9 vs pin 8ecfb69a47a6 and checkin.test.mjs 934cb87cccbf vs pin 3e7be3363105). batch.cjs
  counts such a failure as PIN-DRIFT only when it is one of these two guards AND every path its message names is one of
  this ticket's edited files; anything else is RED. They show as GREEN+PINDRIFTn in the per-run lines.
- Logs: scratch\logs\<tag>.summary (one line per run: result, pass/fail/tests, knob hit counts, other slots held at start,
  failing cells) and <tag>-<file>-<i>.log (full TAP); scratch\logs\ALL.summary; scratch\runner.log.

## 3. The cells: cause, red witness on the UNCHANGED bytes, change

Line numbers are edb8381's; after the edit the same oracle lines sit lower by the lines added above them (the fixed-file
line is given where a run names it).

### R1 journey.test.mjs "P-MEASURE (a)" :69 "week 12 as rendered" (waits: support.mjs typeWaist first change + :134 quiet, then :363 presence only)
- Cause (product read: today-app.cjs:471-480, :623-629; measure-screen.mjs:78-84, :137-199; today-lanes.cjs:327): the waist
  Save runs saveWaist(): lane.save(), THEN repaint() -> render('measure') -> renderMeasure(), which synchronously puts a NEW
  section#measure-screen on #phone (show(root)) and then paints it: chrome and entry after two reads, the comparison (the
  trial table) LAST, after four more reads and the baseline. A paint an earlier request started (the previous row's, or
  the markers pick's) keeps running; if it lands after this click it puts up a table read BEFORE this row was written.
  typeWaist's first-change wait is satisfied by that stale table, quiet() (3 still turns) ends inside it, and
  waitForTrialTable() (:363, presence only) accepts it: week 12 (the typed 2026-03-23 row, 34.4 in) reads 'Not enough data
  yet' twice.
- Red, unchanged bytes, natural: d5 file alone 0/5 today (logs\red-R1R2-d5.summary; hunt2 had 2/3, hunt3 1/1: the race is
  real, the PC's load today did not open the window alone); set18 under a2p (the shape hunt2 first saw it in): run 2 RED
  `P-MEASURE (a) ... | ERR_ASSERTION | week 12 as rendered | journey.test.mjs:69`, actual 'Not enough data yet' x2 against
  '34.4 in', '-0.6 in' (logs\red-R1-set18-a2p-set18-2.log). Deterministic witness (a targeted slow store, product mutant
  MS-SLOW2ND: the SECOND waist save answers 1.5 s late, then repaints exactly as before; nothing else differs), v0,
  unchanged support.mjs, cells (a)+(e): 2/2 red, run 2 `week 12 as rendered | journey.test.mjs:69`, run 1 the R2 face below
  (logs\o-msslow2nd-v0.summary). Recorded non-witnesses: MS-SLOWSAVE (every save 400 ms late) 0/2 red (the saves overlap and
  the presence wait rescues it); MS-FROZEN (waist rows frozen at the first read) red `week 11 as rendered :69` (a control:
  the product never shows the rows).
- Change (support.mjs typeWaist, +22): `screenBefore = view.doc.getElementById('measure-screen')` before the click; after the
  two existing waits, `settle(() => the #measure-screen on the phone is not screenBefore AND holds
  [data-slot="measure-trial-table"])`. The table on the phone is this row's answer exactly when it sits in a section other
  than the one there at the click: saveWaist asks for its repaint only after lane.save() resolved, the table is painted
  last, and every earlier repaint request has already put its own section up before this click (the previous typeWaist
  waited for its own; the markers pick's is up once the pick screen is gone, which pickMarkersOnScreen waits for). It is
  the FINAL table, not the first repaint; bounded by settle()'s loud 30 s deadline.

### R2 journey.test.mjs "P-MEASURE (e)" LOCAL_CLIENT_CLOSED (wait: support.mjs:310 close() quiet, then the stores close)
- Cause: close() waited only for the section ON the phone to be still. A paint can be still while unfinished (table taken
  down while it reads), and a paint whose section a later repaint replaced keeps running off screen; either one reaching
  its next lane read after lane.close() rejects LOCAL_CLIENT_CLOSED (measure-host.mjs all() :173, from measure-screen.mjs
  paint() :177) with no handler, charged to whichever test is running. It shares R1's root: the early-returning typeWaist
  let (e)'s first page reach close() with the save's own repaint still in flight.
- Red, unchanged bytes: natural not reproduced today (d5 alone 0/5); the natural witnesses on these same test bytes are
  hunt2's logs\a10p-journey-journey-3.log and logs\d5-journey-journey-3.log (unhandledRejection LOCAL_CLIENT_CLOSED at
  measure-host.mjs:173 <- measure-screen.mjs:177 <- today-app.cjs:479, charged to (e) :108). Deterministic witness
  MS-SLOW2ND, v0: run 1 `Test "P-MEASURE (a) ..." generated asynchronous activity after the test ended. This activity
  created the error "Error: LOCAL_CLIENT_CLOSED" ... unhandledRejection` and the same for (e); run 2 the same for (e)
  (file-level ERR_TEST_FAILURE both runs). Recorded non-witness: MS-LAG (a superseded paint lags 1.5 s before its reads)
  0/1 red on the unchanged bytes (at v0 the superseded paints had already passed their reads).
- Change (support.mjs page()/close(), +29): a MutationObserver on #phone records every section#measure-screen as it goes
  up; close() first waits (settle(), loud) until EVERY recorded section holds one of paint()'s own end states
  (measure-comparison, measure-marker-pick, measure-no-trial, measure-state), after each of which paint() reads no lane;
  then disconnects the observer and runs the existing quiet() and closes unchanged. The limitation is written in the code:
  a paint cut short by leaving Measure ends in none of them (close() would then fail loudly at its deadline); no cell
  leaves Measure mid-paint.

### R3 checkin.test.mjs "A3 - back from the check-in..." :548 "the gym card is on screen" (wait :546 settle() = 50 x setTimeout(2), def :406)
- Cause: a COUNT of 50 timer turns: ~650 ms while the loop idles on the ~15 ms tick, ~100 ms once pending setImmediate
  work keeps the loop hot (and on a 1 ms-tick host); the gym card behind render('workout') paints after the gym host's own
  read over the encrypted store (hunt3: card at 145 ms against settle's 103 ms at a5p).
- Red, unchanged: a5p file alone 2/2 `ERR_ASSERTION | the gym card is on screen | checkin.test.mjs:548`
  (logs\red-R3-a5p.summary).
- Change (+16): reached(() => doc.querySelector('#gym-weight'), ...) after the unchanged settle(), then settle() again.

### R4 gym.test.mjs subtest "choosing an effort, then logging, lands on the saved-set screen" :510 (wait :507 60 ms sleep)
- Cause: Log -> logSet (crypto + IDB) -> paint() -> renderSaved(); model.read() can already say 'saved' while the phone
  still shows the active set.
- Red, unchanged: a2 file alone 2/2 `ERR_TEST_FAILURE | Cannot read properties of null (reading 'textContent') |
  gym.test.mjs:510` (logs\red-R4-a2.summary).
- Change (+18): reached() on the saved-set screen as the oracles read it (saved-title matches /logged/, saved-facts present,
  Undo present) after the unchanged 60 ms, then 60 ms again.

### R5 setup.test.mjs "A4 - Start using Earned writes ONCE..." :1473 (wait :1472 50 ms sleep)
- Cause: the tap is answered by today-entry.mjs:139-142 onDone: host.save() (the durable write), refresh(), then done(),
  which renders Today; 50 ms is no bound on that chain.
- Red, unchanged: a2 file alone 2/2 `ERR_ASSERTION | the record holds the first run | setup.test.mjs:1473`
  (logs\red-R5-a2.summary; the other failure there is S17's environment ENOENT, section 2).
- Change (+15): reached(() => api.screen() === 'today'), the end of that chain, reached only after the write resolved,
  after the unchanged 50 ms, then 50 ms again.

### R6 problem.test.mjs P0C.1 :990 / S6C.3 :3245 / S6C.4 :3274 (waits :989 / :3243 / :3272, 50 ms each)
- Cause: the same onDone chain; done() arms a NEW adoption chain (today-lanes.cjs:950 reassigns ready) and renders Today.
  Until it runs, api.ready is still the settled boot chain, so `await api.ready` returns at once (S6C.3/S6C.4 still on
  'setup') and P0C.1's notEqual sees the old promise.
- Red, unchanged: a2 file alone, the trio together in run 1 (want-stop): P0C.1 `ERR_TEST_FAILURE | the transition armed a
  NEW adoption chain` (test :969, oracle :990), S6C.3 `ERR_ASSERTION | the existing setup-to-Today transition, unchanged |
  :3245`, S6C.4 `ERR_ASSERTION | the first load ended on Today | :3274` (logs\red-R6-a2.summary; its four other failures
  are the build-dependent tests of section 2).
- Change (+21): reached(() => api.ready !== beforeReady) after the unchanged 50 ms at each of the three sites, then 50 ms
  again; S6C.3 and S6C.4 gain the one line `const beforeReady = <booted>.api.ready;` before the tap (P0C.1 had it).

## 4. GREEN after the fix (every cell under every variant, 3 runs each; then the set once per variant)

Fixed bytes throughout (sha16 of each file recorded on every BATCH line). "x/3 red" = red runs of 3, the file alone;
set18 = one concurrent run of the 18 runnable guard-clean files, pass/tests. Mean wall time per run.

| file (cells) | d5 | a2 | a5p | a10p | a2p | c16 | v0 | b5 |
|---|---|---|---|---|---|---|---|---|
| checkin (R3) | 0/3 red 10.9s | 0/3 15.5s | 0/3 10.9s | 0/3 12.2s | 0/3 10.4s | 0/3 17.7s | 0/3 10.1s | 0/3 34.0s |
| gym (R4) | 0/3 11.5s | 0/3 27.0s | 0/3 11.4s | 0/3 20.0s | 0/3 6.2s | 0/3 2.7s | 0/3 2.7s | 0/3 87.4s |
| setup (R5) | 0/3 5.1s | 0/3 8.4s | 0/3 5.0s | 0/3 6.9s | 0/3 3.9s | 0/3 3.2s | 0/3 3.2s | 0/3 26.0s |
| problem (R6) | 0/3 21.3s | 0/3 53.5s | 0/3 21.5s | 0/3 38.2s | 0/3 11.8s | 0/3 5.9s | 0/3 4.9s | 0/3 190.7s |
| journey (R1, R2) | 0/3 202.3s | 0/3 252.7s | 0/3 204.2s | 0/3 260.6s | 0/3 171.1s | 0/3 152.0s | 0/3 149.5s | 0/3 485.4s |
| set18 | 0/1 621/623 205s | 0/1 621/623 254s | 0/1 621/623 206s | 0/1 621/623 262s | 0/1 621/623 175s | 0/1 621/623 153s | 0/1 621/623 152s | 0/1 621/623 484s |

- setup's three runs per variant each carry the one expected PIN-DRIFT cell (re-pin); every set18 run carries exactly the
  two (boundary (g) + re-pin), hence 621/623. Nothing else failed in any of the 128 runs.
- Against the unchanged bytes under the same knobs (hunt2 counts, same test bytes): checkin red at a5p/a10p/b5/d5 (2/2
  each), gym and problem red at a2/a10p/b5, setup red at a2/b5, journey red alone at a10p (1/3) and d5 (2/3), and 6 of 7
  set runs red; here all of those are green.
- Across all 128 green logs: 0 `TODAY17-HARDEN-DEADLINE`, 0 `MEASURE-SETTLE-DEADLINE`, 0 LOCAL_CLIENT_CLOSED, 0 "asynchronous
  activity after the test ended", 0 S10-T4-GUARD. checkin A3's later settle() sites (:557, :562, :576, :580), which :548's
  red used to mask, stayed green in all 24 checkin runs and all 8 set runs.
- Other agents held one or two other shared slots during most journey and set runs (logged per run), adding load only.

## 5. The new waits hide nothing: product mutants against the FIXED files (v0)

make-mutants.cjs writes scratch\mutants\<NAME>.<file> from the worktree product bytes (relative imports rewritten to the
worktree's absolute URLs; each mutation must match exactly once or it throws); mutant-hook.mjs (--import,
module.registerHooks resolve) redirects the worktree module to it; every run printed `T17H-MUTANT <NAME> known=true
redirected=<n>` with n > 0. No product byte in the worktree changed.

| mutant (product behaviour) | fixed file | red | what failed (own oracle, fixed-file line) | deadline / time |
|---|---|---|---|---|
| GYM-SAVED-NEVER (gym-app.mjs: the saved-set screen is never painted) | gym | 2/2 | `ERR_TEST_FAILURE Cannot read properties of null (reading 'textContent') gym.test.mjs:528` (= :510, the natural R4 code) | `TODAY17-HARDEN-DEADLINE 10000 ms: the saved-set screen after Log` x2; 12.8 s/run |
| GYM-ACTIVE-NEVER (gym-app.mjs: the active set is never painted) | checkin | 2/2 | `ERR_ASSERTION the gym card is on screen checkin.test.mjs:564` (= :548) | `...: the gym card after render(workout)` x2; 17.1 s |
| ENTRY-NODONE (today-entry.mjs onDone: the write lands, done() is never called) | setup | 2/2 | `ERR_ASSERTION and he lands on Today setup.test.mjs:1490` (= :1475; enrolled() and the one-op oracles pass: the write did land) | `...: the setup tap to land on Today` x2; 13.3 s |
| ENTRY-NODONE | problem | 2/2 | P0C.1 `the transition armed a NEW adoption chain`, S6C.3 `the existing setup-to-Today transition, unchanged :3264`, S6C.4 `the first load ended on Today :3295` (the natural R6 codes) | three deadline lines per run; 35.0 s |
| MS-SLOW2ND (measure-screen.mjs: the second waist save answers 1.5 s late, then repaints as before) | support.mjs, journey (a)+(e) | 0/2 (unchanged bytes 2/2 red, section 3) | green: typeWaist waited for the late section, close() for every paint; no unhandled rejection | none; 99.9 s |
| MS-FROZEN (measure-screen.mjs: waist rows frozen at the first read; the typed rows never reach the table) | support.mjs, journey (a) | 1/1 | `ERR_ASSERTION week 11 as rendered journey.test.mjs:69` (unchanged bytes: the same, 1/1) | none; 47.7 s |
| MS-NOREPAINT (measure-screen.mjs: the waist save never repaints), MEASURE_SETTLE_DEADLINE_MS=5000 | support.mjs, journey (a) | 1/1 | `ERR_TEST_FAILURE MEASURE-SETTLE-DEADLINE: waited 5010 ms over 334 macrotask turns for the trial table painted by the repaint the waist save for 2026-03-16 asked for, which never arrived` (support.mjs:243 = the new wait) | loud at its deadline; 52.3 s |

Every mutant that withholds the awaited screen fails on the cell's own oracle with the natural red's message (or, for the
measure wait, loudly at settle()'s deadline naming the wait); none hangs; the slow-store mutant, which only delays the
screen, goes green. Plants and negative oracles are untouched (no line removed); the precedent's plant-log step was not
repeated because none of the five files' plants sits on a changed line.

## 6. Carriers, children, CI (for the PM; nothing here was edited)

- sha256 pins the later reseal must move (git grep of the old hashes, explicit paths):
  rebuild/lanes/b/tooling/packages/S10.json :789/:790 support.mjs f72c6176... -> d62dd75e8e158d87cbff0a48c1cf384edbbc548e2f645dafc5427e1b8d3ab482;
  :854/:855 checkin.test.mjs 3e7be336... -> 934cb87cccbff550df41e29d308663f0db2c9942707e004d29c40f7eaea29755;
  :924/:925 gym.test.mjs 79aa531e... -> 17901c4d95e996cee48da619872a78292fd8671592e355e24bc4dc7ddf2633ed;
  :945 problem.test.mjs post 5fe767e0... -> a8b5cc4f193dfdd1402d110233e79e614439ee9d5ab5406c52c627e0ca338ccd;
  :950 setup.test.mjs post e43ed642... -> 2ff0ef129b47abc2760d2b6c49cfb3916e061f3c2e38b2c9fa14fdb51d43a924.
  The same old hashes also stand in older packages (S3-S9, H3, B-NTC) and receipts, which are history.
- The two guards that stay red until a package declares the new bytes: boundary.test.mjs:213 (S4-sealed drift: gym,
  checkin, setup, problem.test.mjs) and setup.test.mjs:2437 (B-NTC re-pin: gym, checkin). They are the reseal's gate.
- Children: S10.json children[name=today-17].argv runs all five changed files' suites (checkin :1680, gym :1689, problem
  :1693, setup :1694, journey :1696 via support.mjs). .github/workflows/rebuild.yml:259 (Today step) names the today/test
  files. Not run here (b-package, today-17 as a child, the Today step and any hosted re-proof are the PM's).
- journey.test.mjs is byte-identical (2520a774..., pinned in the S10.json :773 block): its pin does not move.

## 7. Residual risks and notes (measured or read, not acted on)

1. Only the six ranked cells were changed. The other fixed-turn / fixed-time sites of the hunt's static list (section 4
   A #2, #8, #11-#21; B until()/waitFor() iteration budgets = D-GSSFIX-1) are untouched; none went red in any run here.
2. typeWaist's new wait rests on two product facts read at edb8381: renderMeasure() puts a NEW #measure-screen section up
   for every measure repaint, and saveWaist() asks for its repaint only after lane.save() resolved. If either changes the
   wait cannot pass wrongly: it fails loudly at settle()'s deadline (MS-NOREPAINT shows that shape).
3. close() waits for every measure paint to reach an end state; a paint cut short by navigating away from Measure never
   does, so a future cell that closes mid-navigation would fail at the 30 s deadline (written in the code).
4. reached()'s 10 000 ms deadline is about 60x the slowest paint measured (145 ms, a5p, hunt3); it costs nothing when green.
5. The natural R1/R2 rate on this PC today was lower than the hunt's (d5 alone 0/5 against hunt2's 2/3); the natural R1
   red came in the set shape (a2p, 1 of 2), and the deterministic MS-SLOW2ND witness carries both R1 and R2.
6. Not run here: package.test.cjs and the seven build-dependent tests (environment, section 2); b-package, today-17 as a
   child, the Today CI step, hosted runners.

## 8. Files, hashes, git state (read-only git, explicit paths)

sha256 via Get-FileHash on the worktree file; "before" = edb8381 bytes, also extracted with `cmd /c git show edb8381:<path> >`
into scratch\orig\ and hashed identically (scratch\orig\ls-tree.txt holds the blob ids). All five after-files: LF only (0 CR),
no new non-ASCII byte (bytes > 127 unchanged: support 0, checkin 156, gym 204, setup 32, problem 47, all pre-existing),
trailing newline.

| file | before (edb8381, blob) | after |
|---|---|---|
| rebuild/m3/w7-preview/measure/test/support.mjs | f72c6176ecbaf3d60cabb731a9c4a612b4abcd8657ebe6dc260466aac8449cdf (d9ca3fa) | d62dd75e8e158d87cbff0a48c1cf384edbbc548e2f645dafc5427e1b8d3ab482 |
| rebuild/m3/w7-preview/today/test/checkin.test.mjs | 3e7be3363105b3fcc481cc1389168c48a92a7086b8ec1e7d86671acb63f6e044 (2a56582) | 934cb87cccbff550df41e29d308663f0db2c9942707e004d29c40f7eaea29755 |
| rebuild/m3/w7-preview/today/test/gym.test.mjs | 79aa531e5483f532736f2a387bc8839e7ac94395bcaaf67737c9e6869c12d508 (8cf4307) | 17901c4d95e996cee48da619872a78292fd8671592e355e24bc4dc7ddf2633ed |
| rebuild/m3/w7-preview/today/test/setup.test.mjs | e43ed642e8f3dc3ce6606a5b256064938ed3fc6d2b278f7b11a4b01ed26fdc32 (d9abc0d) | 2ff0ef129b47abc2760d2b6c49cfb3916e061f3c2e38b2c9fa14fdb51d43a924 |
| rebuild/m3/w7-preview/today/test/problem.test.mjs | 5fe767e02937745f22700316f8950af932977d05085ba09fe78fd068f2b1cbd8 (c728be6) | a8b5cc4f193dfdd1402d110233e79e614439ee9d5ab5406c52c627e0ca338ccd |
| rebuild/m3/w7-preview/measure/test/journey.test.mjs | 2520a774e8de269af2a032b2ac7c444753a4d87698e0ac68286ac26c2290306a (9678e9b) | unchanged |

`git status --porcelain -- <the six files> rebuild/lanes/b/tooling/packages/S10.json .github/workflows/rebuild.yml
rebuild/DECISIONS.md rebuild/STATUS.md`, then `git rev-parse HEAD`, `git branch --show-current` (scratch\final-status.txt):

```
 M rebuild/m3/w7-preview/measure/test/support.mjs
 M rebuild/m3/w7-preview/today/test/checkin.test.mjs
 M rebuild/m3/w7-preview/today/test/gym.test.mjs
 M rebuild/m3/w7-preview/today/test/problem.test.mjs
 M rebuild/m3/w7-preview/today/test/setup.test.mjs
edb8381ea6a9f5373c8519ee7e9d7d8a303c2369
rebuild/c-today17-harden
```

`git diff --stat -- <the six files> rebuild/lanes/b/tooling/packages/S10.json .github/workflows/rebuild.yml`
(scratch\final-diffstat.txt; scratch\final-numstat.txt shows 0 deletions in every file):

```
 rebuild/m3/w7-preview/measure/test/support.mjs    | 51 +++++++++++++++++++++++
 rebuild/m3/w7-preview/today/test/checkin.test.mjs | 16 +++++++
 rebuild/m3/w7-preview/today/test/gym.test.mjs     | 18 ++++++++
 rebuild/m3/w7-preview/today/test/problem.test.mjs | 21 ++++++++++
 rebuild/m3/w7-preview/today/test/setup.test.mjs   | 15 +++++++
 5 files changed, 121 insertions(+)
```

The full diff is scratch\fix.diff (`git diff -- <the six files>` through cmd /c redirection, byte-exact; 0 removed lines).

## 9. What was not done, and disclosures

- Nothing committed, pushed, fetched, checked out, reset, restored, stashed, cleaned or merged; rebuild/DECISIONS.md and
  STATUS.md untouched (status above); no package, receipt or workflow edited; no product byte changed (mutants live only in
  scratch\mutants and are reached through a resolve hook); no node_modules junction created, nothing installed.
- No forbidden path read, listed or scanned: no src/, no rebuild/conform/private, no ledger/, no *soak*, no app.js, no
  EarnedPort, no prepledger-dev, no .tmp folder (setup S17 would read the worktree's .tmp dist; it was skipped and never
  opened by me), no node_modules contents. The protected five were never executed, loaded or read; adapter/copy/view.test.mjs
  were not run. The S10-T4 guard was loaded on every run: no S10-T4-GUARD line in any log, and %TEMP%\s10-t4-guard.log has
  0 lines tagged t17h.
- One shared slot at a time throughout (runner + chain strictly sequential), as the brief says; the rules file lists
  timing-sensitive suites as exclusive (the hunt made the same call). Other agents' slots are logged per run.
- Two node invocations outside pm-run: `node --check` on scratch\batch.cjs and scratch\make-mutants.cjs (syntax parse only,
  nothing executed). Scratch working files written other than by write_file: runner.log (PowerShell Add-Content), logs\*
  (node fs), jobs-green-today.txt / jobs-green-journey.txt (split from jobs-green.txt with [IO.File]::WriteAllText),
  orig\*, fix.diff and final-*.txt (cmd /c redirection, byte-exact). No hash is cited of any of them.
- red-R1-set18-a2p (the natural R1 red) ran with this ticket's today-file edits already in place (journey.test.mjs and
  support.mjs were still the edb8381 bytes); its two other failures are section 2's pin guards.

## 10. Counts

- Red first (unchanged bytes): smoke 1 job; R3 2 runs; R5 2; R4 2; R6 1; R1/R2 d5 alone 5; set18 a2p 2; mutant witnesses
  on the unchanged bytes 6 runs (MS-SLOWSAVE 2, MS-LAG 1, MS-FROZEN 1, MS-SLOW2ND 2).
- Green (fixed bytes): 8 variants x (4 today files x 3 + journey x 3 + set18 x 1) = 128 runs, 0 red.
- Mutants on the fixed bytes: 11 runs (GYM-SAVED-NEVER 2, GYM-ACTIVE-NEVER 2, ENTRY-NODONE 2 + 2, MS-SLOW2ND 2, MS-FROZEN 1,
  MS-NOREPAINT 1), each as expected.
- Scratch tools: batch.cjs, job.cmd, runner.ps1, chain.ps1, make-mutants.cjs, mutant-hook.mjs, agg.ps1, extract-orig.cmd,
  extract-diff.cmd; job lists jobs-red.txt, jobs-orig-mut.txt, jobs-orig-mut2.txt, jobs-green-today.txt,
  jobs-green-journey.txt.
