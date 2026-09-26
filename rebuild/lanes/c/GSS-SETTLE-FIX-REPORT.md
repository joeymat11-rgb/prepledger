# GSS settle fix (S10 CI-M1 STOP, DECISIONS:832) - builder report

Builder: Claude Opus 5.5 subagent (BUILDER role only). Worktree C:\Users\joeym\AppData\Local\Temp\earned-s10gss,
branch rebuild/c-s10-gss-settle-fix at ccc2f63 (uncommitted edits only). Scratch: C:\Users\joeym\AppData\Local\Temp\s10gss-scratch.
Status: COMPLETE. VERDICT: FIX-READY (test-only; no product race; S10.json pin carrier update needed - section 6).

## 0. Host timer fact (measured, probe-timer.mjs, win32 node v24.19.0)

settle() = 8 x setTimeout(0) lasts ~123 ms on this PC (5 samples 122.4-124.1 ms); until() = 400 x setTimeout(1) lasts ~6.1 s
(6088-6158 ms). The PC's timer granularity is ~15.4 ms, so every fixed turn is ~15 ms here. On a 1 ms-granularity host
(typical hosted Linux) the same settle() is ~8-10 ms and the same until() is ~0.4-0.5 s. That is why the file passes alone on
the PC and fails on hosted runners: the fixed-turn budget is ~12x smaller there.

## 1. Inventory of every wait (five files at ccc2f63)

Helpers (identical text in the files that have them): settle() = 8 x setTimeout(0) (fixed turns); tick() = 5 x setTimeout(0)
(identity file); within(value,label,ms=5000) / bounded(1500 ms) = wall-clock Promise.race deadline; until(check,label) =
400 x setTimeout(1) ITERATION budget (no wall clock). Classes: (a) liveness bound on a condition / settle with no oracle on
async-painted state behind it; (b) fixed-turn assumption before an oracle on asynchronously painted state (flake risk);
(c) intentional ordering / negative oracle (asserts something has NOT happened) - must not change.

### 1a. gss-annex-g6-g8.test.mjs (514 lines)

| line | wait | what follows | class |
|---|---|---|---|
| 107,109 | within(mount), within(settings read) | page setup | (a) |
| 110 | settle() in page() | inputs only; mount + read (incl. its repaint) already awaited | (a) |
| 131 | until(editor open) | editor inputs | (a) condition, iteration budget |
| 199, 201 | within(held.reached), until(added row) | row inputs | (a) |
| 205 | within(held.done) then settle() | 208-209 GSS-G6-SAVED-SCREEN, 210 GSS-G6-UNDO, 211 click primary | **(b)** - saved screen needs paint() -> model.read() (IDB + webcrypto) AFTER done |
| 212 | until(next log) | 213-215 GSS-G6-ROWS-LOST | (a) |
| 220 | settle() after Back | durable maps + changed count (224 ==1 ok path; before-commit ==0) | (a) / (c) for the ==0 negative |
| 271, 279 | within(read held), within(held.reached) | | (a) |
| 282 | settle() after Why click | followed by until() at 289, not an oracle | (a) |
| 285-287 | within(settings.read()) + settle() | readDelivered, set before the awaited op resolves | (a) |
| 289 | until(advanced repaint) | GSS-G6-NEUTRAL-* advanced asserts | (a) condition, iteration budget |
| 304 | within(held.done) then settle() | 307-308 capture saved/undo (asserted 336 GSS-G6-NEUTRAL-SAVED-SCREEN-kind, 337 GSS-G6-NEUTRAL-UNDO-kind) and gate the next-card block | **(b)** same mechanism |
| 315 | until(next read + log) | next-card asserts | (a) |
| 370, 376 | within(held.reached), until(added row) | | (a) |
| 379 | within(held.done) then settle() | ok path: 383-384 GSS-G7-CLEAN-SAVED-SCREEN, 385 GSS-G7-CLEAN-UNDO, 386 click primary; refusal path: error text set synchronously in logOutcome | **(b)** ok path only (clean-after-repaint); refusal oracles (a) |
| 387 | until(next log) | rows | (a) |
| 413 | settle() after Back | GSS-G7-REFUSAL-WROTE / -CALLBACK (changed==0) | (c) negative |
| 452-464 | within(mount / read held / ack) | | (a) |
| 469-470 | within(done), within(settings.read()) + settle() | 471 readDelivered (a); 473-476 GSS-G8-DESTINATION-LOST / ownership: a stale repaint must NOT reclaim the phone | (c) negative |
| 479 | (none) | GSS-G8-RETIRED-CALLBACK changed==0 | (c) negative |

### 1b. gss-annex-log-timing.test.mjs (363 lines)

| line | wait | what follows | class |
|---|---|---|---|
| 106-109 | within(mount), within(read), settle() | | (a) |
| 130 | until(editor open) | | (a) |
| 182, 184 | within(held.reached), within(remount) | | (a) |
| 189 | within(held.done) then settle() | 190-200 newer draft / replacement DOM NOT overwritten by the stale delivery | (c) negative (retired mount has no delivery path) |
| 201 | settle() after Back | durable maps | (a) |
| 241 | within(held.reached) | | (a) |
| 245 | within(held.done) then settle() | 248 capture savedTitle (asserted 293 GSS-G5-SAVED-SCREEN-MISSING), 249 undoPresent (294 GSS-G5-UNDO-MISSING), 251 click primary (GSS-LOG-MISSING-CONTROL if absent) | **(b)** |
| 252-253 | until(next log), settle() | | (a) |
| 259 | retired Save click + settle() | GSS-G5-RETIRED-CONTROLS-WROTE | (c) negative |
| 275-276 | within(pending) + settle() | durable settings | (a) |
| 288, 320 | settle() after Back | durable / next page() awaited | (a) |

### 1c. gss-annex-remount.test.mjs (395 lines)

The G3 model is synthetic (`read: async () => copy(view)`), so every repaint here is microtask-only once the settings read
(awaited in mount()) is cached; no IDB or crypto sits between a click and its paint.

| line | wait | what follows | class |
|---|---|---|---|
| 56 | settings-open click + settle() | GSS-G3-EDITOR-DID-NOT-OPEN | (b) in shape, microtask-only paint (low risk) |
| 77-78 | within(read) + settle() | | (a) |
| 91 | within(pending) | settings-error text (set inside the pending op) | (a) |
| 96 | Cancel + settle() | GSS-G3-CANCEL-DID-NOT-CLOSE | (b) shape, microtask-only |
| 122, 127 | within(refusal), within(pending) + settle() | error precondition | (a) |
| 131, 154 | within(remount), within(pending) + settle() | fresh-save durable + editor cleared (inside pending) | (a) |
| 172 | Cancel + settle() | GSS-G3-REMOUNT-CANCEL-DID-NOT-CLEAR | (b) shape, microtask-only |
| 210, 213 | within | | (a) |
| 218 | within(pending) + settle() | GSS-G3-STALE-OUTCOME-OVERWROTE-* | (c) negative |
| 226, 306, 357, 376 | settle() after Cancel/Back | nothing async-painted asserted | (a) |
| 248, 252 | within | | (a) |
| 283 | settings-add + settle() | inputs on row 1 (GSS-G3-MISSING-INPUT if absent) | (b) shape, microtask-only |
| 291 | within(remount) | | (a) |
| 297 | replacement add + settle() | 298-305 values + 3-row count; old-DOM must NOT mutate | (b) shape microtask-only + (c) negative |
| 324-325 | within(pending) + settle() | | (a) |
| 349 | settle() after Back | owns() false (synchronous in leaveCard) | (a) |
| 354 | retired Cancel + settle() | GSS-G3-RETIRED-CANCEL-MUTATED-REPLACEMENT | (c) negative |
| 381, 386 | within | | (a) |

### 1d. gss-annex-timing.test.mjs (351 lines)

Every held-Save wait awaits `mounted.settings.pending()`, which covers recordSettings -> refresh read + its repaint ->
outcome callback -> its awaited paint(), so the settle() after it has no async-painted state left to cover.

| line | wait | what follows | class |
|---|---|---|---|
| 97-99 | await mount, await read, settle() | | (a) (no within(); test timeout bounds it) |
| 114 | until(editor open) | | (a) iteration budget |
| 183-184, 197-198, 258-259, 314-315, 328-329 | within(pending) + settle() | G1/G2/ABA observed editor/draft + durable write | (a) |
| 189, 236 | settle() before Save click | | (a) |
| 192, 239, 322 | within(hold.reached) | | (a) |
| 194 | until(value six) | | (a) |
| 217, 278, 343 | within(cleanup, 2000).catch | cleanup only | (a) |

### 1e. gss-annex-identity-reentrancy.test.mjs (85 lines)

Fully synthetic lane (no IDB, no crypto). tick() = 5 x setTimeout(0); bounded() = 1500 ms wall clock.

| line | wait | what follows | class |
|---|---|---|---|
| 25 (complete) | bounded(pending) + tick() | outcomes (delivered inside pending) | (a) |
| 33, 57, 72 | bounded(entered) | | (a) |
| 41 | stale re-click + tick() | calls.length stays 1 | (c) negative |
| 82 | rejects(bounded(pending)) + tick() | no command started | (a) |

## 2. Red first: UNCHANGED files under a deterministic slowdown

Preload `slow-subtle.mjs` (scratch) is loaded with `node --import file:///.../slow-subtle.mjs`; with GSS_SLOW_MS=d it wraps every
async SubtleCrypto.prototype method (encrypt, decrypt, sign, verify, digest, generateKey, deriveKey, deriveBits, importKey,
exportKey, wrapKey, unwrapKey) with a fixed setTimeout(d) before the real call. No CPU stress. Each run is a fresh
`node --test-reporter=tap <file>` in-process run (driver `run-batch.cjs`), guard preload on (NODE_OPTIONS), env per brief,
through `pm-run.cjs shared`. Per-run logs: scratch\logs\<tag>-<i>.log; per-batch: scratch\logs\<tag>.summary.
Note: on this PC every setTimeout(d<=15) lasts one ~15 ms tick, so d=2/5/10 behave alike here; the crypto op counts per
g6-g8 run (d=5) are decrypt 349, verify 128, encrypt 36, importKey 27, generateKey 18, exportKey 18, sign 9.
No second (IndexedDB) slowdown variant was needed: the crypto slowdown alone reproduces every red deterministically.

| file (unchanged) | d=0 | d=2 | d=5 | d=10 | failing cells / error codes |
|---|---|---|---|---|---|
| gss-annex-g6-g8 | 0/1 red (smoke) | 10/10 red | 10/10 red | 10/10 red | every red run fails exactly 4 tests: D-GSS-G6 (GSS-G6-SAVED-SCREEN), both D-GSS-NEUTRAL-REPAINT (GSS-G6-NEUTRAL-SAVED-SCREEN-why-toggle, -settings-read), D-GSS-G7 (GSS-G7-CLEAN-SAVED-SCREEN); D-GSS-G8 green 30/30 |
| gss-annex-log-timing | - | 10/10 red | 10/10 red | 10/10 red | D-GSS-G5 only: GSS-LOG-MISSING-CONTROL [data-slot="primary"] (line 251, the click on the saved screen's primary control); D-GSS-G4 and the foreign-carry test green |
| gss-annex-remount | - | 0/10 red | 0/10 red | 0/10 red | none (its (b)-shaped sites paint from a synthetic in-memory model: microtask-only) |
| gss-annex-timing | - | 0/10 red | 0/10 red | (see 2a) | none |
| gss-annex-identity-reentrancy | - | 0/10 red | 0/10 red | (see 2a) | none (no IDB, no crypto) |

No until() expired and no within() fired in any of these runs (no GSS-ANNEX-TIMEOUT / GSS-ANNEX-BOUNDED-WAIT code anywhere).
So the red (b) sites are exactly: g6-g8 lines 205 (G6), 304 (NEUTRAL x2), 379 (G7 clean ok path) and log-timing line 245 (G5).

### 2a. Same unchanged set in `node --test` mode (the package child's mode, 5 files concurrently)

`node --import slow-subtle.mjs --test --test-reporter=tap` over the five gss-annex files: d=5 5/5 red with exactly the 5 cells above
(GSS-G6-SAVED-SCREEN, GSS-G6-NEUTRAL-SAVED-SCREEN-why-toggle, -settings-read, GSS-G7-CLEAN-SAVED-SCREEN, GSS-LOG-MISSING-CONTROL
[data-slot="primary"]); d=0 0/5 red. Remaining d=10 rows: gss-annex-timing 0/10 red, gss-annex-identity-reentrancy 0/10 red.

## 3. Product question first (probe, scratch only) - VERDICT: NO PRODUCT RACE

Probe generator `make-probe.cjs` copies each UNCHANGED test file to scratch\probe (relative imports rewritten to absolute
worktree file URLs, jsdom via createRequire of the worktree test dir; product modules load unchanged from the worktree). At each
red (b) site it installs a MutationObserver on the phone BEFORE held.release(), then after held.done waits up to 10 s
(wall clock, setTimeout(0) turns) for the saved screen, then watches 1 s more that it is not wiped; then the ORIGINAL settle()
and every original assertion run unchanged (rows, durable one-set proof, onChanged count, plants). v2 also times every until().

| probe batch | runs | red runs | saved screen appeared (ok cells) | wiped within 1 s | appear time after done | turns needed |
|---|---|---|---|---|---|---|
| g6-g8 d=2 | 10 | 0 | 50/50 (G6, G6-plant, NEUTRAL x2, G7-clean) | 0 | 82-96 ms | max 16 |
| g6-g8 d=5 | 10 | 0 | 50/50 | 0 | 78-97 ms | max 16 |
| g6-g8 d=10 | 10 | 0 | 50/50 | 0 | 83-121 ms | max 16 |
| g6-g8 v2 d=10 | 10 | 0 | 50/50 | 0 | 84-108 ms | max 16 |
| g6-g8 v2 d=0 | 3 | 0 | 15/15 | 0 | 10-14 ms | max 8 |
| log-timing d=2 / d=5 / d=10 | 10 / 10 / 10 | 0 / 0 / 0 | 20/20 each (G5, G5-plant) | 0 | 78-112 ms | max 17 |
| log-timing v2 d=10 | 10 | 0 | 20/20 | 0 | 83-111 ms | max 16 |

Every refusal cell (G6 before-commit, G7 quota-result-held (+plant), quota-after-repaint, clean-before-commit) returned ok=false
and never painted a saved screen (correct). Each ok cell's observer recorded exactly one phone replacement after release, to
'saved', and nothing after it within the window: no stale repaint. With the saved screen awaited, every probe run passed all
original assertions, so the rows survive (GSS-G6-ROWS-LOST, GSS-G7-ROWS-LOST, GSS-G5-* never fired) and the plants still
rejected. KEY NUMBER: with NO slowdown (d=0) the saved screen already needs up to 8 setTimeout(0) turns after held.done, and
settle() gives exactly 8: the fixed-turn budget has zero margin even on an unloaded PC, which is why load alone flips it.

until() timings (v2 probe, d=10, this PC): max 116 ms / 23 iterations of 400 (G6 next active repaint); d=0 max 17 ms / 8
iterations. No until() expired anywhere (0 of 379 timed calls). See section 7 for the residual-risk note.

## 4. The fix (test-only, purely additive: +30 lines (g6-g8 +16, log-timing +14), 0 lines removed or changed)

Only the four red (b) source sites (five red cells: NEUTRAL runs twice) are touched (step 2). Each gets one line, `await painted(() => savedScreen(mounted));`, placed
directly BEFORE its oracle and after every existing line of the site (the original `await settle()` on the release line stays,
the G7 fault disarm stays where it was, and the wait sits inside `if (envelope.result.ok)` for G6/G7 so refusal paths are
untouched). `savedScreen` is exactly the conjunction the following oracles assert (saved-title matches /logged/ AND the undo
control exists). `painted()` is a wall-clock deadline (performance.now(), default 5000 ms like within()), never throws, and
after the condition first holds it waits settle()'s original 8 turns again, so a saved screen that is painted and then wiped
is still caught by the unchanged oracle (mutant M2 below proves it). Unchanged: every assertion line and label, every plant,
every oracle, every (c) site, until() (no until() expiry was reproduced, so its iteration budget stays), within(), all
test-level timeouts (no measurement needed a raise), remount / timing / identity files (never red).

Exact diff (`git diff -- rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs`,
extracted byte-exact with cmd /c to scratch\fix.diff):

```diff
diff --git a/rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs b/rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs
index cb88c15..959dea3 100644
--- a/rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs
+++ b/rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs
@@ -43,6 +43,19 @@ async function until(check, label) {
   }
   throw new Error('GSS-ANNEX-TIMEOUT: ' + label);
 }
+/* A Log delivery paints its saved screen through paint() -> model.read() over the encrypted
+   store, so the event-loop turns it needs after held.done depend on host speed; settle()'s
+   fixed 8 turns is not a bound on it. painted() waits on the exact condition the next oracle
+   asserts, against a wall-clock deadline like within(). It never asserts: at the deadline it
+   returns and that unchanged oracle fails with its own code. Once the condition holds it waits
+   settle() again, so a screen wiped right after it appears is still caught by that oracle. */
+async function painted(check, milliseconds = 5000) {
+  const deadline = performance.now() + milliseconds;
+  while (!check() && performance.now() < deadline) await new Promise((done) => setTimeout(done, 0));
+  await settle();
+}
+const savedScreen = (page) => /logged/.test(page.pick('[data-slot="saved-title"]')?.textContent || '')
+  && !!page.pick('[data-action="undo"]');
 
 async function collections(repository) {
   const value = (await repository.load()).generation.collections;
@@ -205,6 +218,7 @@ async function runG6(seam, plant = false) {
     held.release(); const envelope = await within(held.done, 'G6 delivery'); await settle();
     assertTyped(envelope, 'GSS-G6-' + seam.toUpperCase());
     if (envelope.result.ok) {
+      await painted(() => savedScreen(mounted));
       assert.match(mounted.pick('[data-slot="saved-title"]')?.textContent || '', /logged/,
         'GSS-G6-SAVED-SCREEN');
       assert(mounted.pick('[data-action="undo"]'), 'GSS-G6-UNDO');
@@ -304,6 +318,7 @@ async function runG6NeutralRepaint(kind) {
     held.release(); const envelope = await within(held.done, 'G6 neutral delivery'); await settle();
     assertTyped(envelope, 'GSS-G6-NEUTRAL-' + kind.toUpperCase());
     assert.equal(envelope.result.ok, true, 'GSS-G6-NEUTRAL-ACK-' + kind);
+    await painted(() => savedScreen(mounted));
     const saved = /logged/.test(mounted.pick('[data-slot="saved-title"]')?.textContent || '');
     const undo = !!mounted.pick('[data-action="undo"]');
     const clearedEntry = copy(draft.entry), clearedEffort = copy(draft.effort);
@@ -380,6 +395,7 @@ async function runG7(mode, plant = false) {
     unit.fault.state.armed = false; unit.fault.state.mode = null;
     assertTyped(envelope, 'GSS-G7-' + mode.toUpperCase());
     if (envelope.result.ok) {
+      await painted(() => savedScreen(mounted));
       assert.match(mounted.pick('[data-slot="saved-title"]')?.textContent || '', /logged/,
         'GSS-G7-CLEAN-SAVED-SCREEN');
       assert(mounted.pick('[data-action="undo"]'), 'GSS-G7-CLEAN-UNDO');
diff --git a/rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs b/rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs
index a98e2bf..55ef713 100644
--- a/rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs
+++ b/rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs
@@ -43,6 +43,19 @@ async function until(check, label) {
   }
   throw new Error('GSS-ANNEX-TIMEOUT: ' + label);
 }
+/* A Log delivery paints its saved screen through paint() -> model.read() over the encrypted
+   store, so the event-loop turns it needs after held.done depend on host speed; settle()'s
+   fixed 8 turns is not a bound on it. painted() waits on the exact condition the next oracle
+   asserts, against a wall-clock deadline like within(). It never asserts: at the deadline it
+   returns and that unchanged oracle fails with its own code. Once the condition holds it waits
+   settle() again, so a screen wiped right after it appears is still caught by that oracle. */
+async function painted(check, milliseconds = 5000) {
+  const deadline = performance.now() + milliseconds;
+  while (!check() && performance.now() < deadline) await new Promise((done) => setTimeout(done, 0));
+  await settle();
+}
+const savedScreen = (page) => /logged/.test(page.pick('[data-slot="saved-title"]')?.textContent || '')
+  && !!page.pick('[data-action="undo"]');
 
 async function collections(repository) {
   const value = (await repository.load()).generation.collections;
@@ -245,6 +258,7 @@ async function runG5(plant = false) {
     const envelope = await within(held.done, 'G5 Log delivery'); await settle();
     assert.equal(envelope.kind, 'returned', 'GSS-G5-LOG-THREW');
     assert.equal(envelope.result?.ok, true, 'GSS-G5-LOG-NOT-ACKNOWLEDGED');
+    await painted(() => savedScreen(mounted));
     const savedTitle = mounted.pick('[data-slot="saved-title"]')?.textContent || '';
     const undoPresent = !!mounted.pick('[data-action="undo"]');
     const performed = copy({ entry: draft.entry, effort: draft.effort });
```

sha256 (Get-FileHash on the worktree file, byte-exact; "before" also verified on a `cmd /c git show HEAD:path >` extraction
in scratch\orig):

| file | before (ccc2f63, = S10.json post pin) | after |
|---|---|---|
| rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs | 83f4c1db2e7e0216345e5f7478e88f2e5476dd941368ca67b2fd3877052b4a2c (blob cb88c15) | 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd (blob 959dea3) |
| rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs | cea1cd3f392d8ef679e0659eb2b8cf6c6b9742e23b343ab1927fb797d6fbb74b (blob a98e2bf) | ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0 (blob 55ef713) |

Both after-files: LF only (0 CR), pure ASCII (0 bytes > 127), trailing newline.

## 5. Evidence (every N >= 10; batch summaries in scratch\logs\<tag>.summary, full TAP per run in <tag>-<i>.log)

(i) UNCHANGED files under slowdown (step 2, before the edit): g6-g8 d=2/5/10: 10/10, 10/10, 10/10 red; log-timing d=2/5/10:
10/10, 10/10, 10/10 red (codes in section 2). 5-file `node --test` set d=5: 5/5 red.

(ii) FIXED files under the same slowdown:

| batch | result |
|---|---|
| s5-fixed-g6g8-d2 / -d5 / -d10 | 10/10, 10/10, 10/10 green (0 red) |
| s5-fixed-logtiming-d2 / -d5 / -d10 | 10/10, 10/10, 10/10 green |
| s5-set5-nodetest-fixed-d5 / -d10 (all five files, `node --test`, concurrent) | 10/10, 10/10 green |

(iii) FIXED files with no slowdown: s5-fixed-g6g8-d0 20/20 green; s5-fixed-logtiming-d0 20/20 green;
s5-set5-nodetest-fixed-d0 10/10 green. (These ran concurrently with 2-3 other streams, i.e. under extra CPU load.)

(iv) MUTANT proof that the new wait hides nothing. `make-mutants.cjs` writes scratch\mutants\gym-app.M1.mjs / .M2.mjs from the
worktree gym-app.mjs (relative imports rewritten to absolute worktree URLs; one line differs). `mutant-hook.mjs`
(`--import`, module.registerHooks resolve hook) redirects the worktree gym-app.mjs URL to the mutant; every run printed
`GSS-MUTANT Mx redirected=1`. M1 = phase 'saved' is never painted; M2 = saved screen painted, then the phone is cleared on the
next timer turn.

| batch (FIXED file unless noted) | red | codes | wall time |
|---|---|---|---|
| s5-fixed-g6g8-M1-d0 | 10/10 | GSS-G6-SAVED-SCREEN, GSS-G6-NEUTRAL-SAVED-SCREEN-why-toggle, -settings-read, GSS-G7-CLEAN-SAVED-SCREEN (each 10) | ~24 s/run; each failing test ends at 5.4-6.6 s (deadline 5 s), far under its 30-60 s timeout; D-GSS-G8 still green |
| s5-fixed-g6g8-M2-d0 | 10/10 | same four oracle codes (each 10) | ~24 s/run |
| s5-fixed-g6g8-M2-d5 | 10/10 | same four oracle codes (each 10) - the post-condition settle() window catches the wipe under slowdown too | |
| s5-fixed-logtiming-M1-d0 | 10/10 | GSS-LOG-MISSING-CONTROL [data-slot="primary"] (10) (the named control assert at the saved screen's primary click, same as the unchanged file) | D-GSS-G5 ends at 5.36 s |
| s5-fixed-logtiming-M2-d0 / -d5 | 10/10, 10/10 | GSS-LOG-MISSING-CONTROL [data-action="back"] (10 each) | |
| unchanged file, same mutants (s5-orig-*, before the edit) | g6-g8 M1 10/10, M2 10/10 (same four codes); log-timing M1 10/10 [primary], M2 10/10 [back] | | ~3.5 s/run |

Note on log-timing M2 (pre-existing, not introduced): the G5 cell's own failure is masked by its finally block, whose cleanup
`mounted.click('[data-action="back"]')` (line 317 fixed / 303 unchanged) throws GSS-LOG-MISSING-CONTROL on the emptied phone.
Same code before and after the fix; still a named red, never a hang. Left unchanged (cleanup, not an oracle).

## 6. Children and CI wiring

- S10 package children (rebuild/lanes/b/tooling/packages/S10.json children[].argv): ONLY `today-17` runs either changed file
  (it runs all five gss-annex files, S10.json:1684-1688, via `--test --test-reporter=tap`). No other child names any of them.
- .github/workflows/rebuild.yml: `git grep -n -e <name> HEAD -- .github/workflows/rebuild.yml` finds each of the five files
  on line 259 (the Today-step `node --test ...` list). Not run here (whole Today step is forbidden to this role).
- CARRIER FOLLOW-UP FOR THE PM (not done by me; not a test edit): S10.json pins both changed files by sha256 -
  S10.json:900 `"post": "83f4c1db..."` for gss-annex-g6-g8.test.mjs and S10.json:910 `"post": "cea1cd3f..."` for
  gss-annex-log-timing.test.mjs (role "new"). They must become 64b0875225bcd7f64009f1ab67a10c88c542821f3b794794fee36c9cbb4718fd
  and ae42d717897e00d2b532ba8fd420abe7c9fdc3d631c5fbea685766441b26a7c0, or the package pin check will refuse the edit.
  `git grep` of both old hashes over rebuild/lanes/b/tooling/packages, rebuild/m3/w7-preview/today and .github/workflows finds
  no other pin. rebuild/lanes/c/GSS-ANNEX-G6-G8-REPORT.md and GSS-ANNEX-LOG-TIMING-REPORT.md describe these tests (not read,
  not changed); whether they need a note is the PM's call.

## 7. Residual risks and notes (measured, not acted on)

1. until() is an ITERATION budget (400 x setTimeout(1)): ~6.1 s on this PC (15 ms ticks) but ~0.4-0.5 s on a 1 ms-tick host.
   No until() expired in any run (0 of 379 timed calls; worst 116 ms / 23 iterations here at d=10, 17 ms at d=0). Per the
   brief it is unchanged because no expiry was reproduced. The margin on a 1 ms host is roughly 4x at d=10 (the same waits
   would take ~100+ iterations there); if a hosted run ever shows GSS-ANNEX-TIMEOUT, the same painted()-style wall-clock
   deadline is the fix.
2. The (b)-shaped fixed-turn sites in gss-annex-remount.test.mjs (lines 56, 96, 172, 283, 297) never went red (0/30) because
   the G3 model is an in-memory synthetic read; left unchanged.
3. (c) negative oracles that follow a fixed settle() (G4 189, G5 259, G7 413, G8 470-479, G3 218/297/354, identity 41) are
   untouched. A fixed window is inherently only a sample for "did NOT happen"; not a flake source.
4. Why the PC passed alone: settle() = ~123 ms here vs ~8-10 ms on a 1 ms-tick host, and with NO slowdown the saved screen
   already needs up to 8 of settle()'s 8 turns (probe d=0). Earlier "load timing" waivers of D-GSS cells were this defect.
5. I did not run today-17, the Today step, b-package or anything that writes a receipt. The CI-M1 re-proof on hosted runners
   is for the PM. No S10-T4-GUARD line appeared in any run.

(v) Plants still reject with their named codes. `make-plantlog.cjs` copies the FIXED files to scratch\plantlog with each
plant call wrapped to print its rejection message (`GSS-PLANT <first line>`) before assert.rejects checks it; nothing else
differs. All four batches green (0 red of 10 each) and every run printed every plant:

| batch | plant rejections (per 10 runs) |
|---|---|
| s5-plantlog-g6g8-d0, -d5 | GSS-G6-ROWS-LOST-after-commit x10, GSS-G7-CURRENT-ERROR-quota-result-held x10, GSS-G8-DESTINATION-LOST x10 (each batch) |
| s5-plantlog-logtiming-d0, -d5 | GSS-G4-NEWER-LOAD-LOST after-commit x10, GSS-G5-ANSWER-LOST-AFTER-LOG x10 (each batch) |

Guard: 0 `S10-T4-GUARD` lines in all run logs; %TEMP%\s10-t4-guard.log has 0 lines tagged gssfix.

## 8. Commands (all node runs through `node C:\Users\joeym\AppData\Local\Temp\pm-run.cjs shared <job> <cmd>`)

Every .cmd sets MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, S10_T4_CHILD=gssfix,
NODE_OPTIONS=--require C:\Users\joeym\AppData\Local\Temp\s10-t4-guard.cjs, git folder on PATH, cwd = the worktree.
Scratch files: slow-subtle.mjs (slowdown preload), run-batch.cjs (driver: `node --import <url>... [--test] --test-reporter=tap
<file(s)>` N times, one process per run), probe-timer.mjs, make-probe.cjs + probe-helpers.txt (step 3; `v2` arg adds until()
timing), agg-probe.ps1, make-mutants.cjs + mutant-hook.mjs (iv), make-plantlog.cjs (v). Jobs: smoke.cmd, step2-a.cmd,
step2-b.cmd, step2x.cmd, step3.cmd, step3v2.cmd, step5-orig-mutants.cmd (run BEFORE the edit), step5-a/b/c/d.cmd (after).
Nothing was written inside the worktree except the two test edits; nothing in C:\Users\joeym\AppData\Local\Temp\earned-s10int
or earned-astra-131 was touched; no npm install; node_modules junctions untouched; no git write command was run.

Final `git status --porcelain` (whole worktree, then HEAD):

```
 M rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs
 M rebuild/m3/w7-preview/today/test/gss-annex-log-timing.test.mjs
ccc2f6320805eaba92963e7158cbe9b2df3a23f2
```

Final `git diff --stat -- <the five gss-annex files> rebuild/lanes/b/tooling/packages/S10.json .github/workflows/rebuild.yml`:

```
 .../m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs    | 16 ++++++++++++++++
 .../w7-preview/today/test/gss-annex-log-timing.test.mjs  | 14 ++++++++++++++
 2 files changed, 30 insertions(+)
```

## 9. Summary

- Verdict FIX-READY. Cause: four fixed-turn settle() sites (five red cells) placed before oracles on the saved screen, which a Log delivery
  paints via paint() -> model.read() over the encrypted store AFTER held.done. With no slowdown it already needs up to 8 of
  settle()'s 8 turns; a deterministic 2/5/10 ms webcrypto delay makes it need up to 17, turning the cells red 10/10.
- Red first (unchanged files, crypto slowdown, N=10 per delay): g6-g8 30/30 red (G6, NEUTRAL x2, G7 clean), log-timing 30/30
  red (G5); remount/timing/identity 0/90 red. No until()/within() expiry anywhere.
- Product question: the saved screen appeared in 100% of ok cells (probe: 295 ok cells across d=0/2/5/10), 78-121 ms after
  held.done, never wiped within 1 s, rows and durable one-set proof intact: no product race.
- Fix: +30 test-only lines, 2 files; one bounded wall-clock `painted()` wait per red site on the oracle's exact condition;
  every oracle line, label, plant and (c) site byte-identical.
- After: fixed files green 30/30 + 30/30 under slowdown, 20/20 + 20/20 without, 5-file --test set 30/30; mutants M1/M2 red
  10/10 in every batch with named codes (GSS-G6-SAVED-SCREEN etc.), each failing cell ending ~5.4 s, no hang; plants 100%.
- PM follow-ups: S10.json:900 and :910 post-sha pins; hosted CI-M1 re-proof; optional until() deadline if hosted ever shows
  GSS-ANNEX-TIMEOUT.
