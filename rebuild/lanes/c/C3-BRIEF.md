# C3 BRIEF — the restart proof matrix

Lane C, item C3: *"restart/kill/reboot proof on the phone (the five unchanged-core
witnesses)"* (PLAN-SLICE-v1 §Three parallel tracks). This file is the matrix: for
every restart question the slice actually has, it states what the local era must
do, what a desktop Chromium harness can prove about it, what only the phone can
prove, and what **no browser can prove at all**.

The last column is the point of the document. C1 shipped with an honest residual
list and the reviewer confirmed it; C3's job is not to shrink that list by being
clever, it is to make every remaining item *executable or explicitly unprovable*,
so nobody later mistakes "we never tested it" for "it works".

## What a proof is here, and what it is not

Three definitions, used consistently below.

- **PROVED** — a row in `rebuild/m3/w6/test/local-witnesses.mjs` that runs in a
  real browser on real IndexedDB and asserts the outcome. The kills are
  `taskkill /F` on the OS process, not `context.close()`: no beforeunload, no
  unload handler, no orderly IndexedDB shutdown. `local-browser.mjs` (C1) closes
  gracefully, which is a weaker event than a phone ever delivers.
- **RED WITNESS REPRODUCED** — the harness executes the row and the app does the
  thing SCORECARD-W3 already ruled is wrong-but-accepted. The row passes when the
  observed behaviour *matches the recorded residual*. A green tick here is not
  approval; it is a tripwire that fires if the exposure ever changes size, in
  either direction.
- **NOT-PROVABLE-HERE** — no desktop browser can decide it. The harness prints
  the row with that verdict and one line of reason rather than skipping it.
  Some of these are the phone's (C3-HAND-PROOF.md); some are nobody's.

The C1/C11 ruling of 2026-09-05 (DECISIONS:24) is **bounded**: after an unproven
restart the phone keeps accepting offline writes, and the exposure that buys is
written down rather than designed away. Everything below is downstream of that.

## The five unchanged-core witnesses, as this lane inherits them

SCORECARD-W3 lines 6–8 retained five witnesses "for W6 … integration
obligations". Restated with what each means for a local era that has no
authority at all:

| # | W3 wording | in the local era |
|---|---|---|
| 1 | wall rollback reopens expiry (`client/index.cjs:112`, `lease.cjs:24`) | `leaseExpired()` (`local-era.mjs:80–83`) compares the device clock to `not_after`. Move the clock back and a lapsed era is writable again. There is no W_last to compare against, because BRIEF-W6's checkpoint C is only issued by an authenticated reconciled exchange and the local era never has one. |
| 2 | restored continuity flag ignored | There is no continuity flag to ignore. Nothing in `metadata` or `collections` records a boot identity, a wall high-water or a slot counter, so a restart is invisible in both directions — the client can neither distrust it nor trust it. |
| 3 | whole local erasure becomes "fresh" | Presence is three independent signals (`local-client.mjs:139–155`). Any subset missing is `restore-required`; all three missing is `first-run`, which is what a new phone looks like. |
| 4 | coherent old restore reuses a slot (T3 rejects IDENTITY_COLLISION) | A byte-exact old generation record, restored with the device key untouched, decrypts, verifies and boots. The next save re-issues a `device_seq` already spent on a different reading. Offline nothing can tell. |
| 5 | exhaustion face disagrees with refusal | `status()` is synchronous and reflects the last observation (`local-client.mjs:148`, `:334–338`); the write path re-checks the lease. They can disagree for one command. The *exhaustion* half is unreachable: the self-issued lease range is `[1, 2**31−1]` and no 24 h / 64-slot allowance is implemented, because DECISIONS:24 bounds writes relative to the last **reconciled** connection and there is none. |

## THE MATRIX

Every row below is an id in `local-witnesses.mjs`. Line citations are
`rebuild/m3/w6/local/local-client.mjs` unless another file is named.

### W-KILL-IDLE — killed with nothing in flight

- **The local era must:** lose nothing. Every acknowledged operation is in the
  sealed generation before `execute()` resolved (`bridge.mjs:45–48` publishes only
  after `repository.commit` completes), so a kill can take only unsaved input.
  On the next open, `status()` reads `ready/LOCAL_PRESENT` from the three presence
  probes (`:139–155`), `boot()` returns the view at the same revision (`:297–309`),
  and `resumeAfterKill()` rebuilds the resume line from the stored ops without
  writing anything (`:362–378`).
- **Desktop proves:** all of it. `taskkill /F` on the whole browser process tree,
  relaunch on the same profile, revision / op count / view / resume line asserted.
- **Phone only:** that iOS's own web-view discard behaves the same way — it is a
  different process model and a different IndexedDB implementation.
- **No browser:** nothing extra. This row is fully decidable.

### W-KILL-AFTER-ACK — killed the instant "Saved" returned

- **The local era must:** have meant it. "Saved" is
  DURABLY-COMMITTED-ON-THIS-PHONE (`local-era.mjs:1–10`), and the bridge returns
  the post-commit result, never the stage's own. `local-bite.cjs`'s durability-gate
  bite is the negative proof that this module depends on that.
- **Desktop proves:** yes — kill within milliseconds of the resolved promise and
  assert the operation is there. This is the durability claim itself.
- **Phone only:** the same claim against WebKit's transaction completion.
- **No browser:** that the bytes reached the flash rather than an OS cache. See
  W-POWER-LOSS.

### W-KILL-INFLIGHT — killed with a commit still open

- **The local era must:** be **atomic or absent**, never half. The whole batch —
  operations, outbox, `meta/device.seq`, `meta/checkpoint.counts` and the derived
  sidecar — rides one `repository.commit` (`:189–221`), and an abort consumes no
  sequence (C1 case 7).
- **Desktop proves:** the property, not the timing. **C1 exposes no
  slow-transaction hook and C3 did not add one** — a test hook in product code
  would be a worse defect than the one it measures. So the harness fires
  `execute()` without awaiting it, kills immediately, and then asserts the
  invariant that must hold whichever side of the commit the kill landed: op count
  and revision move together or not at all, and the next save takes the next
  sequence with no gap. The row prints which outcome it observed, because the race
  is real and pretending otherwise would be the dishonest part.
- **Phone only:** the same race under WebKit, where the transaction scheduler
  differs.
- **No browser:** a kill *guaranteed* to land inside the transaction. Without a
  product hook the timing is unforced; with one, the thing under test is no longer
  the shipping code. C1's `local-client.test.mjs` case 6 covers the forced version
  by injecting the delay at the **IDB API**, outside product code, which is the
  right place for it — this row is the unforced counterpart in a real browser.

### W-REBOOT-PROCESS / W-PHONE-REBOOT — a reboot

- **The local era must:** hold nothing in memory that matters. There is no cache
  to warm, no lock to release and no session to resume; `openLocalDurableClient`
  re-probes from disk every time (`:139–165`).
- **Desktop proves:** the NEW-PROCESS half. Every browser process is killed, the
  pids are printed before and after, and a different process reads the same data.
- **Phone only:** the POWER-CYCLE half — a phone reboot also restarts the storage
  stack and re-runs iOS's own recovery. `W-PHONE-REBOOT` stays NOT-PROVABLE-HERE
  and is row 3 of the hand proof.
- **No browser:** nothing extra once the phone row is done.

### W-DAY-GAP — a day passes

- **The local era must:** be unremarkable about it. Nothing expires in a day, the
  view is unchanged, and the next operation carries the new `effective.local_date`
  from the injected clock.
- **Desktop proves:** yes, with the page clock moved one day forward.
- **Phone only:** that the real date rollover and the real timezone behave the
  same. A real DST step is still NOT RUN anywhere (SCORECARD-W3 line 9).
- **No browser:** that a *real* day passed. See W-REAL-ELAPSED.

### W-RENEW-200 / W-PAST-CLIFF — the lease renews because the app was opened

- **The local era must:** re-sign a still-valid lease inside its last 200 days on
  every `boot()`, in a real durable commit, keeping `lease_id`, `range` and
  `not_before` (`:281–295`, `local-era.mjs:89–99`). **Opening the app is what keeps
  writing alive.** An expired lease is never renewed.
- **Desktop proves:** yes — day 201 renews (revision +1, later `not_after`, same
  lease id, save works) and day 402, past the original cliff, still boots ready.
- **Phone only:** nothing new in kind; the same code path on WebKit.
- **No browser:** that 201 days actually elapsed.

### W-LAPSE-400 — 400 consecutive days without opening the app

- **The local era must:** stop writing and say so. `status()` reads
  `restore-required/LOCAL_LEASE_EXPIRED` at open (`:157–165`), `boot()` returns
  `ready:false readable:true leaseExpired:true state 20` **with the view**
  (`:310–313`), and `execute()` refuses 20 with the named code and its own copy
  (`:346–355`). The data is intact; only writing stops.
- **Desktop proves:** yes, on a profile that was enrolled and then never opened
  until day 401.
- **Phone only:** nothing in kind.
- **No browser:** that the athlete really was away 400 days rather than moving a
  clock. That is the whole of C1-C11-RESTART.

### W-CLOCK-ROLLBACK — **RED WITNESS 1**

- **The local era must:** do the wrong thing, visibly. A lapsed era becomes
  writable again the moment the device clock reads a date inside the window,
  because `leaseExpired()` has nothing but the device clock to ask. BRIEF-W6 §1
  "Observed elapsed" would have a hosted era INVALIDATE its restart allowance on a
  detected rollback (`W < surviving W_last`); there is no surviving W_last here,
  and manufacturing one would be the "guessed tolerance" that brief forbids.
- **Desktop proves:** yes — the same profile refuses at day 401 and accepts at day
  0, with nothing renewed and nothing repaired.
- **Phone only:** nothing in kind. Joe can reproduce it by hand in Settings, and
  the hand proof deliberately does **not** ask him to: it changes nothing and
  risks a real clock left wrong.
- **No browser:** a fix. There is no trusted time in the local era —
  `authenticatedTimeSample` is a hosted mechanism — so this residual closes only
  when the hosted half exists.

### W-CONTINUITY-FLAG — **RED WITNESS 2**

- **The local era must:** persist no continuity evidence at all. The sealed
  metadata is exactly `{profile, namespace, enrolledAt, localEra}` and `localEra`
  is exactly `{profile, eraId, identityKey, authorityKey, lease, enrolledAt}`
  (`local-era.mjs:33–43`). No boot identity, no wall high-water, no slot counter.
- **Desktop proves:** yes, structurally — `boot()` reports no such field, and the
  node case asserts the sealed key sets exactly, so a future field cannot be added
  silently.
- **Phone only:** nothing.
- **No browser:** that this is *safe*. It is the accepted cost of the bounded
  ruling: a restart cannot be distrusted because it cannot be seen. BRIEF-W6 is
  explicit that `performance.timeOrigin` is not a trusted boot identity and that
  a persisted high-water is not elapsed time during absence, so the alternative
  is not "record it better" — it is a hosted checkpoint.

### W-ERASE-ALL — site data cleared — **RED WITNESS 3**

- **The local era must:** report `first-run` and enrol a NEW era, because nothing
  survives to say otherwise. The presence probe never creates what it asks about
  (`local-keys.mjs:28–56`), so "absent" is a real observation and not a
  side-effect.
- **Desktop proves:** the indistinguishability, which is the actual claim — the
  status of a wiped installation is asserted `deepEqual` to the status of a
  browser profile that never held anything.
- **Phone only:** that Settings › Safari › Clear History and Website Data
  produces the same shape. It is the same origin-scoped deletion, but it is worth
  seeing once.
- **No browser:** a warning. There is no evidence left to warn from, and
  synthesising one would be an invented fact. **This is the accepted browser
  limit**, and it is the reason P1 key custody stays BLOCKED and C2's PC port is
  the recovery path.

### W-ERASE-PARTIAL — one of the three signals gone

- **The local era must:** stay `restore-required` and refuse to reseed:
  `STORE_MISSING` / `KEY_MISSING` / `ENROLLMENT_MARKER_MISSING` (`:148–155`),
  `boot()` not ready, `enroll()` refused (`:238`).
- **Desktop proves:** yes — marker deleted, then key deleted, each checked.
- **Phone only:** nothing. iOS erases site data wholesale, so the partial shape is
  mostly reached by a failed write, not by the athlete.
- **No browser:** which of the three a real eviction would take first.

### W-OLD-RESTORE — a coherent old backup — **RED WITNESS 4**

- **The local era must:** accept it. A byte-exact older generation record with the
  device key untouched decrypts, verifies, boots ready, and the next save re-issues
  a `device_seq` already spent on a different reading. BRIEF-W6 W6-RESTORE-BOUND
  keeps this as "the expressly accepted residual".
- **Desktop proves:** more than expected. The harness copies the **whole browser
  profile directory** at revision 2, writes two more operations, restores the
  directory, and shows revision 2 with `op-dev-phone-A-2` issued a second time for
  a different weight — one real reading silently gone.
- **Phone only:** an iCloud/Finder device restore, which is the real-world shape.
  **This is deliberately NOT in the hand proof**: it costs an hour, risks Joe's
  actual phone state, and proves nothing the desktop row does not.
- **No browser:** detection. Offline, a coherent old restore is indistinguishable
  from an ordinary restart, by construction. Only an authority that remembers the
  slots can reject it (T3 IDENTITY_COLLISION), and there is no authority yet.

### W-FACE-DISAGREES / W-SEQ-EXHAUSTION — **RED WITNESS 5**

- **The local era must:** let the face be a cached observation and the write path
  be the truth. `status()` is synchronous and reflects the last probe (`:148`,
  `:334–338`); when the clock crosses `not_after` mid-session the face still says
  ready and the very next `execute()` refuses state 20. C1's answer is not to make
  them agree — it is to **name** the refusal by reading the sealed lease on the
  refusal path (`:346–355`), so a screen can say something true.
- **Desktop proves:** the expiry half, end to end, in a real browser.
- **Phone only:** nothing in kind.
- **No browser:** the *exhaustion* half — it is unreachable here by construction
  (range `[1, 2**31−1]`, no 24 h / 64-slot allowance, because DECISIONS:24 bounds
  writes relative to the last **reconciled** connection and the local era has
  none). The node case pins that, so if a slot budget ever arrives the row fails
  and somebody has to prove the face agrees with it.

### W-TWO-TABS — two tabs of one installation

- **The local era must:** lose neither operation. The bridge retries a
  `STALE_REVISION` from the fresh snapshot (`bridge.mjs:51`), so both commits land
  on consecutive sequences.
- **Desktop proves:** yes — two pages, two factories, one profile, raced.
- **Phone only:** the equivalent is two Safari tabs or the PWA plus Safari; worth
  one hand check once the PWA shell exists (Track A5).
- **No browser:** nothing extra.

### W-QUOTA — storage pressure

- **The local era must:** refuse state 3, keep the typed input, leave the previous
  generation byte-exact and spend no sequence (BRIEF-W6 §2 state table, "Quota/abort
  with no higher-priority fault").
- **Desktop proves:** yes, and with the **browser's own** `QuotaExceededError`, not
  an injected fault: the origin quota is capped through CDP
  (`Storage.overrideQuotaForOrigin`) before the origin's first IndexedDB use, then
  filled with junk down a ladder of chunk sizes until even 256 bytes fails. One
  chunk size is not enough — filling with 1 MiB blocks leaves up to 1 MiB free,
  which is far more than one sealed generation needs, and the save simply fits.
- **Phone only:** what iOS does when the *device* is full, which is eviction, not
  a clean refusal.
- **No browser:** W6-KNOWLEDGE-LOSS (BRIEF-W6, HARD CLOCK BLOCKER). Quota failure
  followed by a kill can erase knowledge that existed only in RAM. In the local era
  there is no learned authority knowledge to lose — nothing inbound is ever
  admitted — so the blocker does not bind this lane, and it is NOT discharged for
  the hosted half.

### W-NO-NETWORK — airplane mode

- **The local era must:** need nothing. `localEraConfig` sets `online: false` and
  never a transport (`local-era.mjs:104–112`), and every inbound kind is refused
  before verification (`host-bindings.mjs`, C1b test 10).
- **Desktop proves:** yes, negatively and by counting: every non-origin request is
  intercepted and attributed to the frame that made it, and the app's own frames
  make zero across the whole matrix. Requests from the browser's own new-tab page
  are reported separately rather than counted against the app.
- **Phone only:** that the page *loads* offline, which needs the PWA shell
  (Track A5) or a warm Safari cache. Until then the hand row is "airplane mode
  after the page is open".
- **No browser:** nothing.

### W-POWER-LOSS / W-REAL-ELAPSED / W-IOS-EVICTION / W-IOS-SAFARI

The four that no desktop browser decides, stated plainly because a silent skip is
how a residual becomes a claim:

| row | why nothing here can decide it |
|---|---|
| `W-POWER-LOSS` | `taskkill /F` ends a process; it does not cut power mid-`fsync`. The repository asks for `durability: "strict"` and reports `{requested, actual}` — whether the platform honoured it is the platform's claim, not ours, and the harness prints that pair rather than asserting it. |
| `W-REAL-ELAPSED` | Days 1 / 201 / 401 / 402 are an injected page clock. Nothing has been left for a year, and no browser can prove how much time passed while the process was absent — that IS `C1-C11-RESTART`. |
| `W-IOS-EVICTION` | A scripted `deleteDatabase` is not iOS deciding to reclaim site data. `W-ERASE-ALL` shows the SHAPE that results; nothing can force the decision, predict it, survive it, or tell the browser's erasure from the athlete's. |
| `W-IOS-SAFARI` | Every desktop row is Chromium. WebKit's IndexedDB has its own transaction and eviction behaviour. This is the hand proof's entire reason to exist. |

## THE DEPENDENCY THAT DECIDES WHETHER THE PHONE RUN MEANS ANYTHING

**A1's Today page does not use the local era.** `rebuild/m3/w7-preview/today/`
stores through `createWebStorageBackend` over `localStorage`
(`today-model.cjs:120–136`, `web-storage-backend.cjs:3–5`), and
`openLocalDurableClient` appears nowhere in that tree. It is a *durable* backend
in the T2 sense — writes land immediately and rollback has an undo journal — but
it is not the sealed, encrypted, revision-guarded IndexedDB generation C1 proves,
it holds no era, no lease and no device key, and `localStorage` is the first thing
iOS reclaims under pressure.

That matters for exactly one reason: **hand-running the phone rows against
today's Today page would prove the durability of `localStorage`, not the
durability of the thing C1 and C3 are about.** Every row would pass and none of
them would be evidence.

So the hand proof is written against a page that calls `openLocalDurableClient`.
Until A1 is rebound, that page is the local-era harness page, not Today. C3 does
not make the rebind — `rebuild/m3/w7-preview/**` is Track A's — and this note is
the request, recorded in C3-REPORT.md's REQUESTS section: *the phone rows become
slice evidence the day Today's model writes through the local era, and not a day
before.*

## THE ACCEPTANCE BAR FOR THE PHONE RUN

The hand script is `C3-HAND-PROOF.md`. What "pass" means, per row:

| # | phone row | PASS is | FAIL is | needs |
|---|---|---|---|---|
| 1 | open, first run | the page loads and shows a first-run/enrolled state; one era id is shown and stays the same for the rest of the run | a blank page, an error, or a second era id appearing later | Safari today |
| 2 | log a weigh-in and one set | both show as saved, and the era id is unchanged | "Entry not saved", or a saved entry that disappears on scroll | Safari today |
| 3 | swipe-kill from the app switcher, reopen | both entries are still listed, and the resume line names the last set | either entry gone, or a set that was never logged appearing (a ghost) | Safari today |
| 4 | reboot the phone, reopen | identical to row 3 after a full power cycle | any loss, or a page that will not load offline | Safari today; **offline launch needs A5** |
| 5 | airplane mode, log one more | it saves, with no spinner and no error | any refusal, or a save that vanishes when the network returns | Safari today |
| 6 | next morning, reopen | yesterday's entries are there and the new one takes today's date | yesterday's entries gone, or today's entry dated yesterday | Safari today |
| 7 | throwaway install only: clear website data | the app shows FIRST RUN, with no history and no error | a crash, a half-state, or a claim that data was "recovered" | Safari today, **throwaway origin only** |
| 8 | two tabs | a weigh-in in one tab appears in the other after reopening it | one tab overwriting the other's entry | Safari today |

A row is only evidence if Joe photographs it. One photo per row is enough; the
photo has to show the entry list, because a screenshot of a success toast proves
that a toast was drawn.

## RESIDUALS THAT STAY OPEN BY CONSTRUCTION

These do not close with more testing. Each is here because the alternative is
worse, or because it needs the hosted half that DECISIONS:88 deferred.

1. **A coherent old restore is undetectable offline** (W6-RESTORE-BOUND). Only an
   authority that remembers which slots it accepted can reject a replayed one.
   Proved, dated, and not fixable in this lane.
2. **A rolled-back clock reopens expiry.** There is no trusted time in the local
   era. BRIEF-W6 forbids inventing one from `performance.timeOrigin` or a
   persisted high-water, and it is right to.
3. **Whole erasure is first run.** The app cannot warn about a history it has no
   evidence existed. This is why P1 key custody stays BLOCKED and C2's PC port is
   the standing recovery path.
4. **No elapsed time is ever proved.** Every day-N row is an injected clock.
5. **The 400-day cliff still exists**, reachable by exactly one route — not
   opening the app for 400 days — and C1 designs no way out of it. Renewal also
   needs writable storage, so 200 consecutive days of failing renewals would lapse
   an era; no case simulates that, and none can cheaply.
6. **Power loss is untested and untestable from here.** `durability {requested,
   actual}` is the platform's claim; the harness prints it and asserts nothing
   about it.
7. **iOS eviction is unforceable.** Nothing can make Safari evict on demand, so
   "what happens after eviction" is only ever the erasure shape, not the event.
8. **Real DST and a real old-phone restore remain NOT RUN**, as they were at W3.
   Neither is in the hand proof: DST needs a date the calendar has not reached,
   and a device restore costs an hour and risks Joe's actual phone.
9. **The exhaustion half of witness 5 is unreachable, not proved.** It returns the
   day a slot budget does, and the node case will fail loudly when it does.

## WHAT C3 DELIBERATELY DID NOT DO

- **No hook was added to `rebuild/m3/w6/local/**`.** A slow-transaction hook would
  have made W-KILL-INFLIGHT deterministic and would have put a test seam in the
  product's durable path. The unforced race plus C1's IDB-level forced abort
  (`local-client.test.mjs` case 6) cover the same property from two sides without
  one.
- **No `host/`, `client/` or `engine/` file was touched**, and no existing W6 file
  was edited: `local-witnesses.mjs` reuses `startModuleServer` and
  `buildLocalBrowser` exactly as C1b left them.
- **No claim that the desktop matrix is the phone.** Every runner prints its own
  `iOS Safari acceptance NOT RUN` line, as C1's does.
