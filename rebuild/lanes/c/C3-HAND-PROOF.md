# C3 HAND PROOF v2 — the iPhone script, re-pinned to the merged tree

**For Joe, on his iPhone. Nobody has to paste anything, coordinate with anyone or
wait for a reply.** Read a row, do it, write one word.

## What changed since v1, and why v1 must not be run

v1 was written when the phone rows were NOT RUN and before two things landed:

* **C4 ONE STORE** (DECISIONS:111). Today's weigh-in, the workout sets and the
  recovery check-in are now **one** local-era generation under **one** lease
  (`rebuild/m3/w6/local/today-bindings.mjs`). v1's "make sure you are not on the
  Today page, Today saves the old way" STOP is **obsolete** — Today *is* the
  local era now, and there is no separate harness page to be sent to.
* **A5 PWA shell** (DECISIONS:101). There is a real installable phone host with
  an offline-launch preflight, so v1's "rows 4 and 5 need Track A5" asterisks
  are gone, replaced by row 5, which tests the shell itself.

v1 also had no verbatim expected copy. **Every quoted string below is taken from
the source on the merged tree with a `file:line` citation, and
`rebuild/lanes/c/hand-proof/expected-strings.test.mjs` asserts every one of them
is still there, on that line.** If a screen's words change, that test goes red
and this script is re-written before it is handed over again — the owner never
compares his phone against copy the tree no longer contains.

**Synthetic numbers only.** The phone host serves public source with a synthetic
athlete. Type made-up weights (170.6, 171.1, 200 lb x 5) — nothing here is your
real log, and your real history reaches the phone only through the on-PC port
(C2, after S3).

---

## ROW 0 — before any of this: does the phone host exist yet?

**A precondition, not a test — and the one thing only you can do.**

The URL does not exist until **both** of these are true:

1. **The Netlify secret is in place** (DECISIONS:101, A5-REPORT §9): Netlify →
   Add new site → Deploy manually (drop an empty folder) → copy its **Site ID**
   → GitHub → the repo → Settings → Secrets and variables → Actions → New
   repository secret named `SLICE_NETLIFY_SITE_ID` = that id.
   (`NETLIFY_AUTH_TOKEN` is already there.)
2. **A push to `rebuild/t2-client-core` then touches the path filters** —
   `rebuild/slice/pwa/**` or `rebuild/m3/w7-preview/today/**`. A merge does it.
   There is **no Run-workflow button**: GitHub lists `workflow_dispatch` only for
   workflows on the default branch, and `slice-host.yml` is never on `main`.

**What you see when it is NOT yet deployed.** There is no URL and no error page —
the deploy simply does not happen, and the workflow run's log says so five times,
every line beginning

> `SLICE HOST NO-OP`
> — `.github/workflows/slice-host.yml:124`

naming the missing secret and saying that only the repository owner can add it.
**No URL means row 0 FAIL and the script waits.** Nothing below is attemptable,
and nothing below is then a phone problem.

---

## ROW 1 — install it from Safari (2 minutes)

1. Open the site's URL in **Safari** (not Chrome — this proof is about WebKit).
2. Wait for the line under the phone frame that starts **Offline launch** to stop
   saying `checking this device…`. Give it one reload with a signal if needed.
3. **Share → Add to Home Screen.**
4. Open **Earned** from the Home Screen.

**Expected, verbatim from source:**

* the on-page guidance, and nothing more:
  `On iPhone: in Safari, tap Share, then Add to Home Screen.`
  — `rebuild/slice/pwa/preflight.html:13`
  (it is hidden once you are launching from the Home Screen);
* the name offered by Add to Home Screen is **Earned** —
  `const APP_NAME = "Earned";` at `rebuild/slice/pwa/pwa.cjs:29`;
* the icon is a **green square with a paper check mark** (authored in
  `rebuild/slice/pwa/icons.cjs`; no wordmark, no photo);
* launched from the Home Screen it opens **with no Safari chrome** —
  `display: "standalone"` at `rebuild/slice/pwa/pwa.cjs:152`.

**Something is wrong if:** Add to Home Screen is not offered at all, the name is
anything but Earned, or the launched app still shows Safari's address bar.

> **Not a fault:** the page draws a fixed phone frame inside a wider stage, so in
> standalone it reads as the design inside its frame rather than edge to edge.
> That is A1's chrome and a known screens-tier item (A5-REPORT §8), not a bug.

---

## ROW 2 — first run: a weigh-in that is durably committed (2 minutes)

This is the row the whole local era exists for. "Saved" here is not a toast — it
means the operation is in the sealed generation on this phone's disk before the
app said anything (C3-BRIEF, `W-KILL-AFTER-ACK`).

1. On Today, before you do anything, look at the morning line.
2. Log a morning weight of **170.6**.
3. Look at the morning line again, and at the sentence under the sheet.

**Expected, verbatim from source:**

* before: `return "This morning — not logged yet"`
  — `rebuild/m3/w7-preview/today/today-app.cjs:46`
  (on screen: *This morning — not logged yet*);
* after: the line becomes `const line = "This morning ✓ "` plus the pounds
  — `rebuild/m3/w7-preview/today/today-app.cjs:47`
  (on screen: *This morning ✓ 170.6 lb*, possibly followed by the engine's own
  note about the reading, which is the engine talking and is fine);
* the store sentence, exactly:
  `Saved in this device's encrypted local store. It survives a reload, a restart, a reboot and a crash.`
  — `rebuild/m3/w7-preview/today/today-model.cjs:103`.

**Something is wrong if:** you see instead
`This device could not open its encrypted local store, so nothing can be recorded here.`
(`rebuild/m3/w7-preview/today/today-model.cjs:101`) — that is a FAIL of this row
and a real finding; send it. Also wrong: the figure appears and then reverts.

---

## ROW 3 — two sets, then kill the app and relaunch (4 minutes)

1. On Today, tap the primary action to **start** today's workout.
2. Log **two sets** (any weight and reps; answer the effort question honestly or
   pick *Unsure* — both are valid).
3. Go back to Today. It must say a workout is in progress.
4. **Swipe up from the bottom and stop in the middle**, find the **Earned** card,
   and **swipe it up off the top of the screen.** It was not asked to save
   anything first — that is the point.
5. Wait five seconds. Open Earned again from the Home Screen.

**Expected, verbatim from source:**

* Today's workout line while a session is open:
  `const WORKOUT_IN_PROGRESS = "Workout in progress";`
  — `rebuild/m3/w7-preview/today/today-app.cjs:67`;
* the single primary action is the **resume**, not a restart:
  `resuming ? "Resume " + view.workout.title`
  — `rebuild/m3/w7-preview/today/today-app.cjs:250`
  (on screen: *Resume* followed by the workout's title);
* tapping it reopens the card with **both sets already there** and the action
  `export const FINISH_WORKOUT = 'Finish this workout';`
  — `rebuild/m3/w7-preview/today/gym-app.mjs:28`;
* finish it and Today reads
  `const WORKOUT_RECORDED_TODAY = "Workout recorded";`
  — `rebuild/m3/w7-preview/today/today-app.cjs:68`.

**Something is wrong if:** either set is missing, a set you never logged appears,
or the primary action offers to **start** a workout again rather than resume one.

> **What this row is and is not.** On iOS the storage runs in its own process, so
> swiping the card away does not reliably kill it. A pass here is real but
> modest. The desktop matrix carries the hard-kill weight (`W-KILL-IDLE`,
> `W-KILL-AFTER-ACK`, both PASS on the PC); what this row adds is that the same
> thing holds under **WebKit**, which no PC row can say.

---

## ROW 4 — the recovery check-in (2 minutes)

The check-in is the third write path into the **same** generation (C4c,
DECISIONS:111), so this row is also the proof that three lanes share one store
without treading on each other.

1. From Today, open the **recovery check-in**.
2. Answer **at least one** question. Leave the rest blank — blank means unknown,
   never "none" and never zero; that is deliberate.
3. Save, go back to Today, then open the check-in again.

**Expected, verbatim from source:**

* reopening the check-in shows
  `export const RECORDED_AT_PREFIX = 'Recorded today at ';`
  — `rebuild/m3/w7-preview/today/checkin-model.mjs:38`
  (on screen: *Recorded today at HH:MM*);
* Today's recovery entry gains
  `const CHECKIN_RECORDED_TODAY = "— recorded today";`
  — `rebuild/m3/w7-preview/today/today-app.cjs:83`.

**Something is wrong if:** the time is not today's, a blank answer comes back as
"none" or 0, or Today does not pick up that a check-in was recorded.

---

## ROW 5 — airplane mode, then a cold launch (3 minutes)

Rows 2–4 were online. This one is the shell.

1. **Still online**, open Earned and scroll to the line beginning
   **Offline launch**. Wait until it reads ready.
2. Turn on **Airplane Mode** (Control Centre, the aeroplane icon goes orange).
3. **Kill Earned** (swipe up) and **open it again from the Home Screen.**
4. Log a weigh-in of **171.1** while still offline.
5. Kill and open it once more, still offline.

**Expected, verbatim from source:**

* the ready state, and the only place the phrase is written:
  `say(true, 'offline-ready ✓',`
  — `rebuild/slice/pwa/preflight.js:57`
  (on screen: *Offline launch — offline-ready ✓*);
* under it, the fact the worker actually verified:
  `files of this build are stored on this device — everything the launch needs is here.`
  — `rebuild/slice/pwa/preflight.js:58` (it is preceded by "All *N*");
* the app **opens and shows Today** with the network off, and the 171.1 saves
  with no spinner, no error and no "syncing" — there is no server;
* it survives the second kill.

**Expected, and NOT a failure, if you were too quick at step 1:** a partial
install reads `'Storing this build on this device: '` then *N* of *M* files
(`rebuild/slice/pwa/preflight.js:63`), or
`This page is not being served by its offline copy yet. Reload once, with a connection, to finish.`
(`rebuild/slice/pwa/preflight.js:66`). Both mean **turn the network back on and
reload once**, then start row 5 again. Write **SEE** for the row, not FAIL.

**Something is wrong if:** offline-ready ✓ was shown and the app then still
cannot open with no signal, or the offline weigh-in is refused or vanishes when
the network returns.

---

## ROW 6 — tomorrow: the second workout of the same lift group WILL refuse

**Read this row before you do it.** On the merged tree a fresh athlete gets
**exactly one session per lift group** until lane B's `B-NTC` provider merges
(DECISIONS:102). The second upper day — day+3 — **refuses, and that is the
expected, recorded behaviour, not a bug on your phone.**

1. Tomorrow morning, open Earned. Log a weigh-in of **170.4**.
2. Check yesterday's entries are all still there and the new one is dated today.
3. Try to open today's workout.

**Expected, verbatim from source — and this is what "expected, not a bug" looks
like:**

* Today's workout line becomes
  `const WORKOUT_CANNOT_OPEN = "Today’s workout cannot open";`
  — `rebuild/m3/w7-preview/today/today-app.cjs:70`;
* the single action becomes
  `const WHY_WORKOUT_CANNOT_OPEN = "Why today’s workout cannot open";`
  — `rebuild/m3/w7-preview/today/today-app.cjs:71`;
* tapping it shows the neutral lead —
  `Earned could not prepare today’s workout, and nothing was recorded.`
  — `rebuild/m3/w7-preview/today/gym-app.mjs:26` — followed by the layer's own
  code, exactly once.

**The word that means "expected".** If that code is
`'PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED'`
(`rebuild/engine/performed.cjs:193`), **the row is a PASS-AS-EXPECTED.** Write
`6 SEE — native trend context`. It is DECISIONS:102's headline limit, it closes
the day `B-NTC` merges, and nothing was recorded, so nothing was lost.

**Any OTHER code in that slot is a real finding.** Copy the code exactly and send
it. So is: yesterday's entries gone, today's weigh-in dated yesterday, or the app
claiming to have recorded a workout it refused.

> A weigh-in and a check-in are **not** blocked by this. Only the second session
> of the same lift group is. So rows 2, 4 and 5 keep working on day 2.

---

## ROW 7 — clear website data — ⚠️ THROWAWAY ONLY (3 minutes)

> **This deletes everything the app holds on this phone, and there is no undo.**
> There is no recovery path in this build. Do it only while the phone host holds
> synthetic data. **Never** once your real log lives here. If you are not certain,
> write `7 skipped` — a skipped row is a perfectly good answer; a lost log is not.

**Read the two outcomes before you start, because they mean opposite things.**

The app decides what it is looking at from **three independent signals** (the
sealed store, the device key, the enrolment marker), at
`rebuild/m3/w6/local/local-client.mjs:152–155`:

* **all three absent → first run.** `state: "first-run", code: "LOCAL_FIRST_RUN"`
  (`rebuild/m3/w6/local/local-client.mjs:152`). The app opens silently, empty,
  with a **new** era. **This is what Safari's Clear History and Website Data will
  almost certainly produce**, because iOS erases an origin wholesale.
* **any subset absent → restore required, and it never re-enrols.**
  `state: "restore-required", code: "STORE_MISSING"`
  (`rebuild/m3/w6/local/local-client.mjs:153`),
  `state: "restore-required", code: "KEY_MISSING"`
  (`rebuild/m3/w6/local/local-client.mjs:154`),
  `state: "restore-required", code: "ENROLLMENT_MARKER_MISSING"`
  (`rebuild/m3/w6/local/local-client.mjs:155`).

**The verbatim word, if you ever see it.** The page says what the client says and
invents no sentence: `export const RESTORE_REQUIRED = Client.copy.RESTORE_REQUIRED;`
(`rebuild/m3/w6/local/today-bindings.mjs:517`), whose text is
`RESTORE_REQUIRED: "Restore required — sign in",`
(`rebuild/client/copy.cjs:44`), rendered as
`status.textContent = RESTORE_REQUIRED + " (" + restoreRequired + ")"`
(`rebuild/m3/w7-preview/today/today-entry.mjs:199`) — i.e. on screen:

> **Restore required — sign in (KEY_MISSING)**

**Do this:**

1. Screenshot Today first, so the before-state exists.
2. Settings → **Safari** → **Clear History and Website Data** (or the per-site
   clear, if it offers one). Confirm.
3. Open Earned from the Home Screen again.

**How to score it:**

* **Empty app, no history, no error, no claim that anything was recovered →
  PASS.** That is `W-ERASE-ALL`, an accepted, written-down residual: when the
  data *and* the key are both gone, nothing survives that could say a history
  ever existed, and an app that claimed to "recover" here would be inventing it.
* **The words *Restore required — sign in* with a code in brackets → also PASS,**
  and a more informative one: something partial survived and the app refused to
  start a second life over it.
* **FAIL** if it crashes, hangs, shows half a history, claims a recovery, or —
  the one that matters most — shows the old entries **and** a new era at the same
  time, which would mean it re-enrolled on top of a record it could not read.

---

## ROW 8 — what to send back

**One line per row. PASS, FAIL or SEE. No numbers, no screenshots of data, no
explanation unless a row went wrong.** SEE means "it did something the script
told me was expected but not a plain pass" — row 5's *not yet*, row 6's native
trend context, row 7's first-run.

```
0 PASS
1 PASS
2 PASS
3 PASS
4 PASS
5 PASS
6 SEE — native trend context
7 PASS
```

If a row went wrong, say **what you saw**, not what you think it means: "the
170.6 was gone after I reopened it" is worth ten times "the save is broken". If
something looked odd but you are not sure it counts, send it — the odd ones are
the useful ones. A refusal code (a word in CAPITALS_WITH_UNDERSCORES) is always
worth copying exactly.

---

## THE MAP — each row to the witness it discharges

`id` is a row in `rebuild/m3/w6/test/local-witnesses.mjs`. The PC run
(C3-REPORT) was **17 proved / 0 failed / 6 not-provable-here**; the phone rows
are what the PC cannot say, because every PC row is Chromium and none of them is
WebKit.

| row | witness id | what the phone adds that the PC could not | expected string, from source |
|---|---|---|---|
| 0 | `W-IOS-SAFARI` | that a phone-reachable host exists at all | `.github/workflows/slice-host.yml:124` |
| 1 | `W-IOS-SAFARI` | installed-app identity and standalone launch on iOS | `rebuild/slice/pwa/preflight.html:13`, `rebuild/slice/pwa/pwa.cjs:29`, `rebuild/slice/pwa/pwa.cjs:152` |
| 2 | `W-KILL-AFTER-ACK` | that "Saved" means durably committed under WebKit's IndexedDB | `rebuild/m3/w7-preview/today/today-app.cjs:46`, `:47`, `rebuild/m3/w7-preview/today/today-model.cjs:103` |
| 3 | `W-KILL-IDLE` | app-switcher kill and relaunch on iOS's process model | `rebuild/m3/w7-preview/today/today-app.cjs:67`, `:250`, `:68`, `rebuild/m3/w7-preview/today/gym-app.mjs:28` |
| 4 | `W-KILL-IDLE` | the third write path (check-in) in the same generation, on the phone | `rebuild/m3/w7-preview/today/checkin-model.mjs:38`, `rebuild/m3/w7-preview/today/today-app.cjs:83` |
| 5 | `W-NO-NETWORK` | that the page **launches** offline, which needed the A5 shell | `rebuild/slice/pwa/preflight.js:57`, `:58`, `:63`, `:66` |
| 6 | `W-DAY-GAP` | a real date rollover and a real timezone, not an injected clock | `rebuild/m3/w7-preview/today/today-app.cjs:70`, `:71`, `rebuild/m3/w7-preview/today/gym-app.mjs:26`, `rebuild/engine/performed.cjs:193` |
| 7 | `W-ERASE-ALL` / `W-ERASE-PARTIAL` | that iOS's own origin erasure produces the same shape | `rebuild/m3/w6/local/local-client.mjs:152`, `:153`, `:154`, `:155`, `rebuild/client/copy.cjs:44`, `rebuild/m3/w6/local/today-bindings.mjs:517`, `rebuild/m3/w7-preview/today/today-entry.mjs:199` |
| 8 | — | the report itself; no witness | — |

### The six the PC could NOT decide, and what this script does about each

C3-REPORT records six `NOT-PROVABLE-HERE` rows. This script closes some of them
and honestly leaves the rest open — a silent skip is how a residual turns into a
claim.

| not-provable on the PC | does this script close it? |
|---|---|
| `W-IOS-SAFARI` | **Yes — this is the script's whole reason to exist.** Every row above runs on WebKit, which no Chromium row can speak for. |
| `W-PHONE-REBOOT` | **Only if you take one extra step.** A swipe-kill (row 3) ends the app; a reboot also restarts the phone's storage stack. **Optional:** after row 3 passes, power the phone fully off and on, reopen Earned, and check the two sets are still there. If you do it, add `3b PASS` to your report. If you skip it, `W-PHONE-REBOOT` stays open and that is fine. |
| `W-POWER-LOSS` | **No, and nothing can.** Killing an app is not power failing mid-write. The storage layer asks for strict durability and reports what the platform claims; whether the bytes reached flash is the platform's claim, not ours. Do **not** try to test this by letting the battery die. |
| `W-REAL-ELAPSED` | **No.** Days 201 / 401 / 402 were an injected clock on the PC. Row 6 proves one real day, which is one real day more than the PC has — and nothing proves a year. Do **not** change the phone's clock: it changes nothing here and risks leaving a real clock wrong. |
| `W-IOS-EVICTION` | **No.** Row 7 is *you* clearing data. iOS deciding to reclaim it — because the phone is full and the app has not been opened in weeks — cannot be triggered on purpose, only waited for. Row 7 shows the *shape* that results, never the event. |
| `W-SEQ-EXHAUSTION` | **No, and it is a residual, not a browser limit.** The local era implements the wall-clock half of DECISIONS:24 and **no slot budget at all**, deliberately (C3-BRIEF, W-FACE-DISAGREES). There is no face to exercise until the PM rules on it. |

### What this script deliberately does NOT ask you to do

* **Restore the phone from an old iCloud backup.** It is a real risk and it is
  written down (`W-OLD-RESTORE`: a coherent old restore is undetectable offline,
  by construction, until a hosted authority remembers the slots). It costs an
  hour, risks your actual phone state, and proves nothing the PC row did not.
* **Roll the clock back.** `W-CLOCK-ROLLBACK` is a recorded red witness, already
  reproduced on the PC. Reproducing it by hand changes nothing and risks a real
  clock left wrong.
* **Fill the phone up to force an eviction.** See `W-IOS-EVICTION` above.

---

## The pin

`rebuild/lanes/c/hand-proof/expected-strings.test.mjs` asserts that every string
quoted above is still in the file and on the line this document cites, that this
document quotes and cites every one of them, and that every witness id named here
is a real id in `rebuild/m3/w6/test/local-witnesses.mjs`. Run it before handing
this script over:

```
node --test rebuild/lanes/c/hand-proof/expected-strings.test.mjs
```

A red run means the screens moved and **this script is stale** — re-write the
affected row from the new source before the owner is asked to run anything. It
reads public source only, prints no athlete data, and writes nothing.
