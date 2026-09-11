# C3 REPORT — the restart/kill/reboot proof harness

Branch `rebuild/lane-c-c3`, cut from `84ea2a2` (accepted C1 + C1b on the
integration tip). Worktree `work/lane-c/c3` on the owner's Windows PC, Node
v24.19.0, Microsoft Edge 152.0.4191.66. Every number below was executed there.

**Nothing outside C3's ownership was touched.** Two new files under
`rebuild/m3/w6/test/` and three new files under `rebuild/lanes/c/`. No file in
`rebuild/m3/w6/local/**`, `host/**`, `client/**` or `engine/**` was edited, no
existing W6 test was changed, no lockfile moved, and no install of any kind was
run. `git status --porcelain` before the commit shows exactly the five new paths.

## WHAT WAS BUILT

| file | sha256 | lines | bytes |
|---|---|---|---|
| `rebuild/m3/w6/test/local-witnesses.mjs` | `2235bc13d3f2f93c40a446a47bcb649b35b53e5bc92c1cd2bf804bc6c7c8b659` | 531 | 34,208 |
| `rebuild/m3/w6/test/local-witnesses.test.mjs` | `0f61ff6709bce1152f91d910bd81cc2cf4ecef17e678aa46967d824a9a7243b5` | 272 | 14,217 |
| `rebuild/lanes/c/C3-BRIEF.md` | `199726252e0c3255c0dd768da9ec0caab5b21673ce15c2bfaa6da513a07b5d59` | 381 | 24,591 |
| `rebuild/lanes/c/C3-HAND-PROOF.md` | `10bd11f8fa9c7ba17784d1dc2213597357879a243965dd9f142c29ec9dbe8679` | 238 | 9,115 |
| `rebuild/lanes/c/C3-REPORT.md` | this file | — | — |

All LF-only (`crlf=0` on every file, checked byte-wise), so `.gitattributes`
cannot rewrite them.

`startModuleServer` (C1b), `buildLocalBrowser` (C1) and the pinned
`playwright-core` 1.62.1 are used UNCHANGED. C3 adds no product code and no test
seam inside product code — see "the hook that was not added" below.

## THE ONE THING THAT MAKES THIS DIFFERENT FROM C1's BROWSER RUNNER

`local-browser.mjs` ends a context with `context.close()`. That is a **graceful**
shutdown: Chromium is asked to stop, flushes, and closes IndexedDB in an orderly
way. A phone never delivers that event — iOS discards the web view.

Every kill in `local-witnesses.mjs` is `taskkill /F /T` on the real OS process,
found by matching the profile directory in the Windows process table (Playwright
exposes no pid for a persistent context, so the OS is asked). No beforeunload, no
unload handler, no orderly IndexedDB shutdown. One run killed nine processes at
once and relaunched on the same profile directory.

## THE DESKTOP MATRIX — every row, with its evidence line

`W6_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
`node rebuild/m3/w6/test/local-witnesses.mjs`, **exit 0**:

```
W6 LOCAL-WITNESSES PASS — 17 proved, 0 failed, 6 not provable in any desktop
browser; 152.0.4191.66; 19 browser contexts; 36 pinned bundle inputs
W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only;
the phone rows are rebuild/lanes/c/C3-HAND-PROOF.md
```

| verdict | row | evidence as printed |
|---|---|---|
| PASS | `W-KILL-IDLE` | 9 process(es) `taskkill /F` while idle; relaunch on the same profile: revision 3, 2 operations, resume `"Last saved: Set 1 of squat."`, ghost false; durability `{"requested":"strict","actual":"strict"}` |
| PASS | `W-REBOOT-PROCESS` | pids `46992,42652,19568,…` → `31348,36288,17476,…` on one profile directory: not one process survived, every operation did — a reboot's NEW-PROCESS half, not its power-cycle half |
| PASS | `W-CONTINUITY-FLAG` | **RED WITNESS 2 REPRODUCED** — `boot()` reports `[derived derivedCode derivedStale eraId leaseExpired leaseId leaseRenewalCode leaseRenewedUntil notAfter notBefore ops ready revision view]`: no continuity flag, boot identity or wall high-water exists |
| PASS | `W-KILL-AFTER-ACK` | "Saved" at revision 4, then `taskkill /F` with no close: the relaunched profile reads revision 4 with 3 operations — an acknowledged save survives a SIGKILL |
| PASS | `W-KILL-INFLIGHT` | killed with a commit in flight: the batch COMMITTED (ops 3 → 4, revision 4 → 5) — atomic or absent, never half, and the next save takes `op-dev-phone-A-5` with no gap |
| PASS | `W-DAY-GAP` | killed on day 0 and reopened with the page clock on day 1: revision 2 and the 170.6 read intact, next save `op-dev-phone-A-2` |
| PASS | `W-RENEW-200` | day 201: the still-valid lease re-signed to `2028-05-04T06:44:53.508Z` in a real durable commit (revision 4), same lease id `local-era:fba01ce9…aad9d`, save works |
| PASS | `W-PAST-CLIFF` | day 402 — past the original 400-day cliff — boots ready with 3 operations and saves `op-dev-phone-A-4` |
| PASS | `W-LAPSE-400` | 401 days unopened: status `restore-required/LOCAL_LEASE_EXPIRED`, boot `readable:true leaseExpired:true state 20` at revision 2 with the read still visible, execute refused state 20 |
| PASS | `W-CLOCK-ROLLBACK` | **RED WITNESS 1 REPRODUCED** — the installation that refused every write at day 401 accepts `op-dev-phone-A-2` the moment the page clock reads day 0 again |
| PASS | `W-FACE-DISAGREES` | **RED WITNESS 5 REPRODUCED (expiry variant)** — `status()` answered `ready/LOCAL_READY` while the very next `execute()` refused state 20; C1 then names it `LOCAL_LEASE_EXPIRED` |
| PASS | `W-TWO-TABS` | two tabs, two factories, one profile, one revision raced: both acknowledged (`op-dev-phone-A-2`, `op-dev-phone-A-1`), revision 3, 2 operations, neither lost |
| PASS | `W-ERASE-ALL` | **RED WITNESS 3 REPRODUCED** — all three origin databases deleted → `{"state":"first-run","code":"LOCAL_FIRST_RUN"}`, identical to a profile that never held anything |
| PASS | `W-ERASE-PARTIAL` | marker gone → `ENROLLMENT_MARKER_MISSING`, key gone → `KEY_MISSING`; `boot()` refuses and `enroll()` is refused both times |
| PASS | `W-OLD-RESTORE` | **RED WITNESS 4 REPRODUCED** — a whole browser profile restored from a revision-2 backup boots ready at revision 2 with 1 operation, and the next save re-issues `op-dev-phone-A-2` for 177.7 lb, a slot already spent on 171.1 lb; 171.2 lb is simply gone |
| PASS | `W-QUOTA` | origin quota capped at 12 MiB and filled to within 256 bytes (11.97 MiB of junk, then the browser's OWN `QuotaExceededError`): refused `3/TRANSACTION_ABORTED`, generation holds at revision 2 with 1 operation and the 170.6 read intact, and after the junk is dropped the next save still takes `op-dev-phone-A-2` |
| PASS | `W-NO-NETWORK` | 0 non-origin requests from the app's own frames across 19 browser contexts |
| NOT-PROVABLE-HERE | `W-POWER-LOSS` | `taskkill /F` ends a process; it does not cut power mid-`fsync`. `durability {requested, actual}` is the platform's claim and is printed, not asserted |
| NOT-PROVABLE-HERE | `W-REAL-ELAPSED` | days 1 / 201 / 401 / 402 are an injected page clock — that IS `C1-C11-RESTART` |
| NOT-PROVABLE-HERE | `W-IOS-EVICTION` | a scripted `deleteDatabase` is not iOS reclaiming site data; the shape is provable, the event is not |
| NOT-PROVABLE-HERE | `W-IOS-SAFARI` | every row above is Chromium; WebKit is the hand proof |
| NOT-PROVABLE-HERE | `W-PHONE-REBOOT` | the new-process half is proved; the power-cycle half is the phone's row 4 |
| NOT-PROVABLE-HERE | `W-SEQ-EXHAUSTION` | unreachable by construction: range `[1, 2147483647]`, no 24 h / 64-slot allowance, because there is no authority to reconcile with |

## COMMANDS + RESULTS (Windows, this worktree)

`NODE` is
`C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
(v24.19.0). PowerShell blocks `npm.ps1`, so node is called directly; long output
was redirected to a file under `%TEMP%` and read back, because the shell mangles
`✔`/`ℹ` and em dashes. Exit codes were captured, not inferred.

| command | before C3 | after C3 |
|---|---|---|
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `tests 473 · pass 473 · fail 0` | **`tests 479 · pass 479 · fail 0`**, exit 0 — the 473 unchanged plus 6 new |
| `NODE --test rebuild/m3/w6/test/local-witnesses.test.mjs` | — | `tests 6 · pass 6 · fail 0`, exit 0 (144 ms) |
| `NODE rebuild/m3/w6/test/local-witnesses.mjs` (Edge) | — | **`17 proved, 0 failed, 6 not provable`**, exit 0 |
| `NODE --test …/host/test/journey.test.mjs …/host/test/engine-equivalence.test.cjs` | `tests 22 · pass 22 · fail 0` | `tests 22 · pass 22 · fail 0`, exit 0 — `host/` untouched |
| `NODE rebuild/m3/w6/build-browser.mjs` | `w6.js` `b733c830…3143d` | **byte-identical** `B733C8309F4617F809B794EDC39F0CF6842776D39E67FD0C26A2130E54B3143D`; `w6.js.meta.json` `FFE65850…9B00C`, exit 0 |
| `NODE rebuild/m3/w6/local/build.mjs` | `local.js` `68825b6a…e49e`, `host.js` `6e13f09a…5b323` | **unchanged**: `68825B6A28655AB1DC2655C9F70F3FCD8028D3317723BBD4E552BB40EE1DE49E` / `6E13F09AFB45C137E063A682EA578E4E4334CEC8EC84578DF9A1ABE03D65B323`; 36 and 96 pinned inputs, exit 0 |
| `NODE rebuild/m3/w6/test/local-bite.cjs` | RESTORED PASS | **RESTORED PASS**, exit 0 — all four bites still RED; source `a055c623…14ea9` before and after |
| `NODE rebuild/m3/w6/test/browser-check.mjs` (Edge) | `6/6` | `6/6` PASS, exit 0 |
| `NODE rebuild/m3/w6/test/local-browser.mjs` (Edge) | `8/8` | `8/8` PASS, exit 0 |
| `NODE rebuild/m3/w6/test/local-host-browser.mjs` (Edge) | `6/6` | `6/6` PASS, exit 0 |

The six node cases: the C3 clock rows without a browser (day gap, renewal at 201,
past the cliff at 402, the lapse at 401 on an installation never opened between);
RED WITNESS 1 (rollback reopens expiry); RED WITNESS 2 (no continuity flag — the
sealed metadata key sets are asserted exactly, so a future field cannot be added
silently); RED WITNESS 3 (erasure `deepEqual` first run, and a NEW era id on
re-enrolment); RED WITNESS 4 (a byte-exact old generation record restored, the
next save re-issuing a spent slot); and witness 5's exhaustion half asserted
unreachable (`range [1, 2**31−1]`, the checkpoint holding counts and never a
budget, `sync` empty).

They exist because **CI runs no W6 test on either OS** (C1-REPORT, "CI RELEVANCE
— THE AUTOMATED GATE FOR C1 IS NIL"). `--test rebuild/m3/w6/test/*.test.mjs` is
the only thing anybody runs by habit, so the browser matrix's claims needed a
node-side tripwire or they would rot between hand runs.

## THREE THINGS FOUND WHILE BUILDING IT

### 1. A quota cap has to be set BEFORE the origin's first IndexedDB use

The first two runs reported `W-QUOTA` as NOT-PROVABLE-HERE: 64 MiB of junk went
into an origin whose quota had just been capped at 12 MiB, with no error. The CDP
call `Storage.overrideQuotaForOrigin` returned `{}` and was not refused, so it was
easy to conclude the browser ignores it. It does not. **Chromium settles a storage
key's quota on first use**, and the cap was being applied after the client had
already opened three databases. Moving it ahead of the first IndexedDB touch — the
`afterGoto` hook in `launch()` — made the browser raise its own
`QuotaExceededError` at 11.97 MiB.

**And one chunk size is not enough.** Filling with 1 MiB blocks stops with up to
1 MiB free, which is far more room than one sealed generation needs, so the app's
save simply fitted and reported Saved. That would have been a *false green* had
the row been written the obvious way. The filler now walks a ladder —
1 MiB → 128 KiB → 16 KiB → 2 KiB → 256 B — and the row only counts if the origin
is full to within 2 KiB or less. Then the save is refused `3/TRANSACTION_ABORTED`,
the previous generation is untouched, and the sequence is unspent.

### 2. Counting network requests needs attribution, not a host list

The first run failed `W-NO-NETWORK` on a request to `ntp.msn.com` — Edge's own
new-tab page, which lives in the same browser context and has nothing to do with
the app. Filtering by hostname would have been a lie waiting to happen. The route
handler now attributes each request to the frame that made it and counts only
those from a frame on the app's origin; browser-chrome traffic is reported
separately in the same line. Across 19 contexts the app's own frames made **zero**
non-origin requests.

### 3. A1's Today page does not use the local era

`rebuild/m3/w7-preview/today/` writes through `createWebStorageBackend` over
`localStorage` (`today-model.cjs:120–136`); `openLocalDurableClient` appears
nowhere in that tree. It is a legitimate T2 backend, but it is not the sealed,
encrypted, revision-guarded generation C1 proves, it holds no era, no lease and no
device key, and `localStorage` is the first thing iOS reclaims.

**Consequence, stated plainly: hand-running the phone script against today's
Today page would prove the durability of `localStorage` and nothing about C1.**
Every row would pass and none of it would be evidence. The hand proof therefore
opens with that check, and the rebind is a REQUEST below, not a C3 edit —
`rebuild/m3/w7-preview/**` is Track A's.

## DESIGN NOTES — every decision taken without asking

1. **The hook that was NOT added.** The task allowed a page hook for a slow
   transaction *if C1 already exposed one*. It does not, and C3 did not add one:
   a test seam inside the durable write path is a worse defect than the timing
   imprecision it removes. So `W-KILL-INFLIGHT` fires `execute()` without awaiting
   it, kills immediately, and asserts the property that must hold on either side
   of the commit — **atomic or absent**, with op count and revision moving
   together and the next sequence following with no gap. The row prints which
   side it landed on (it COMMITTED in the recorded run), because pretending the
   race is not a race would be the dishonest part. C1's `local-client.test.mjs`
   case 6 already covers the *forced* version by injecting the delay at the IDB
   API, outside product code; the two together cover the property from both sides.
   A REQUEST is filed below in case the lane lead wants determinism anyway.
2. **Profiles live under `%TEMP%`, not in the repo.** A hard-killed Chromium
   leaves lock files behind and one row copies a whole profile directory; putting
   that in `.tmp/` would leave debris inside the worktree after a failed run.
3. **`W-OLD-RESTORE` copies the whole browser profile, not just the IndexedDB
   record.** A record-level restore is what the node case does (and it is enough
   to prove the slot replay); the directory copy is the closer analogue of a phone
   restored from a backup, and it also proves the device key and the generation
   travel together. If the copy ever fails on a machine the row degrades to
   NOT-PROVABLE-HERE with the OS error, rather than failing.
4. **Kills are found through the OS process table.** Playwright exposes no pid for
   a persistent context. The harness reads `Win32_Process` (or `ps` off Windows)
   and matches the profile directory in the command line, then `taskkill /F /T`.
   `settle()` then waits for the pids to actually disappear before relaunching, so
   a row can never race a zombie holding the profile.
5. **Playwright rejections caused by the kills are counted, not fatal.** Killing a
   browser makes Playwright's own in-flight promises reject; an unhandled
   rejection would end the process mid-matrix. They are collected and the count is
   printed. It was 0 in the recorded run.
6. **Rows are grouped into acts with their own profile and their own try/catch**,
   so one failure marks its own rows FAIL with actual-vs-expected and the line it
   fired on, and the rest of the matrix still runs. A half-run matrix would be the
   easiest way to ship a false green.
7. **`NOT-PROVABLE-HERE` is printed, never skipped**, and does not affect the exit
   code. Exit 0 = every provable row passed; exit 1 = a provable row failed;
   exit 2 = BLOCKED (no `playwright-core`, or no `W6_BROWSER_BIN`).

## RESIDUALS

C1's residual list is unchanged and C3 discharges none of it by argument. What C3
changes is that each item is now either executed or printed as unprovable, with a
reason, every time the harness runs.

**Still open, by construction** (full statements in C3-BRIEF.md):

1. A coherent old restore is undetectable offline — now **proved**, not assumed.
2. A rolled-back clock reopens expiry — **proved**. No trusted time exists locally.
3. Whole erasure is first run — **proved indistinguishable** from a virgin profile.
4. No elapsed time is ever proved; every day-N row is an injected clock.
5. The 400-day cliff survives, reachable by not opening the app for 400 days, with
   no way out designed in C1. Renewal needs writable storage; 200 consecutive days
   of failing renewals would lapse an era and no case simulates that.
6. Power loss: untested and untestable from here. `durability {requested, actual}`
   is printed as the platform's claim.
7. iOS eviction cannot be forced; only the erasure *shape* is provable.
8. Real DST and a real old-phone restore remain NOT RUN, as at W3. Neither is in
   the hand proof, and the brief says why for each.
9. Witness 5's exhaustion half is unreachable, not proved. The node case fails
   loudly the day a slot budget arrives.

**New residuals C3 itself creates:**

10. **The phone rows are NOT RUN.** This branch ships the script, not the result.
    Until Joe runs it, every iOS claim in this lane is still `NOT RUN`, and all
    three runners keep printing that line.
11. **`W-KILL-INFLIGHT` is a race, not a schedule.** In the recorded run the batch
    committed. A run where it does not commit proves the other half of the same
    invariant; neither run proves the kill can be *placed* inside the transaction.
12. **The quota row depends on a CDP override.** If a future browser drops
    `Storage.overrideQuotaForOrigin`, the row degrades to NOT-PROVABLE-HERE rather
    than failing — correct, but it means the row can go quiet. The printed verdict
    is the only warning.
13. **Chromium only.** Edge 152 is one engine. Nothing here says anything about
    WebKit, and the `W-IOS-SAFARI` row exists to keep saying so.

## REQUESTS — hooks and edits C3 did not make

None of these block C3. All of them are outside its ownership and are written
here rather than made.

### To the owner of `rebuild/m3/w6/local/**` (C1's author, or the lane lead)

1. **An optional commit-delay seam, if determinism is wanted for
   `W-KILL-INFLIGHT`.** Nothing is asked for by default — the current row is
   honest and C1's case 6 covers the forced version at the IDB API, which is the
   better place for it. If the lane lead wants the browser row deterministic too,
   the narrowest possible shape is a *build-time* export used only by the harness,
   never a runtime option on `openLocalDurableClient`:
   `export const __commitBarrier = { before: null }` in `local-client.mjs`, awaited
   immediately before `repository.commit` when non-null. It must not be reachable
   from the factory's options, or it becomes a way to stall a real athlete's save.
   **Recommendation: do not add it.** It buys a schedule for a property already
   proved from both sides, and it puts a seam in the one path the whole lane is
   about.
2. **Nothing else.** No other hook was wanted. Every other row was reachable
   through the existing public surface (`status`, `enroll`, `boot`, `execute`,
   `current`, `resumeAfterKill`, `close`) plus same-origin IndexedDB, which is the
   right answer: a harness that needs product changes is testing a different
   product.

### To Track A (`rebuild/m3/w7-preview/**`, A1/A5)

3. **Rebind Today's model to the local era.** Today writes through
   `createWebStorageBackend` over `localStorage`; the phone rows only become slice
   evidence when it writes through `openLocalDurableClient`. This is already the
   W7 integration step the preview README describes ("replace `model.cjs` with a
   real adapter over `rebuild/client` ops"); C3 only records that the hand proof
   depends on it.
4. **Rows 4 and 5 of the hand proof need A5.** A fresh launch with no network is
   a PWA-shell question, not a storage question. Until the shell exists, those two
   rows are run with the page already open and the script says so.

### To the PM

5. **C1b's two REQUEST TO PM items still stand** (`subtle` passthrough in
   `composeWorkoutHost`; `host-entry.mjs` naming its bootstrap). C3 touched
   neither and neither affects this matrix.
6. **CI still runs no W6 test on either OS.** The six node cases added here are
   only a tripwire if something eventually runs them. That is a PM call, not a
   lane-C one, and it is the single cheapest thing that would stop this lane's
   evidence decaying.

## VERDICT

The desktop half of C3 is done and executed: **17 rows proved, 0 failed, 6 stated
as not provable in any desktop browser**, with all five unchanged-core witnesses
reproduced rather than argued about. The phone half is written and **NOT RUN** —
by design, because it needs Joe, a phone, and a page that actually uses the local
era.
