# C3 HAND PROOF — integrated Today, gym and recovery check-in

Revision: 2026-09-11, source `7b1678a4a8449053000d52a0a8e9e070f32a240e`.
**Phone rows NOT RUN. This is the test script, not a phone-readiness verdict.**

For Joe on the iPhone. Eight rows across two days, with an extra same-lift-group
workout after B-NTC lands. Desktop Edge evidence cannot establish iPhone behaviour.

## Before the PM sends a test link

The integrated Today page now uses C4's ONE encrypted IndexedDB generation for
weigh-ins, workout sets and recovery check-ins. The old instruction to avoid Today
because it uses localStorage is obsolete. A visible era id is NOT a requirement:
the integrated screen does not display one. Verify the deployed source/build before
handing over the link; a screen photo alone cannot identify the storage implementation.

**The current source remains a synthetic preview.** Its normal `boot()` supplies no
options: Today defaults to **2030-02-04** and the fictional athlete in
`rebuild/m3/w7-preview/fixtures.cjs`. Reopening tomorrow cannot establish a real
change of date. The daily-use build must first wire the accepted clean-init setup
and actual local calendar through all three hosts. See `PHONE-READINESS-REPORT.txt`.
A5's PWA shell is already integrated; it does not need to be built again.

The PM supplies a short test receipt before row 1:

- HTTPS origin, source commit, successful deployment run and build/cache identity.
- Whether this is the fixed-date preview or the reviewed fresh-use build. Row 6
  remains BLOCKED on the preview; never change the phone clock to manufacture a pass.
- A disposable test installation with invented inputs, separate from real daily logs.
- Device/model, iOS version, test date/time and whether Safari or Home Screen was used.

No current app URL was verified in the September 11 audit. A green `slice-host`
job can be a no-op; the latest public run's post-deploy probe was skipped. Never
substitute the frozen app or the protected `earned-soak` site for this test.
Do not open, clear, reinstall or inspect the protected soak before its booked date.

## Row 1 — open Safari, then install

1. Open the verified test URL in Safari. Photograph the whole screen and date.
   Today should load, with no storage error. A fresh installation enrols silently;
   an explicit first-run button, empty preview history or era id is not promised.
2. Find **Offline launch — offline-ready ✓**. Its detail must say all files of
   this build are stored. If it says **not yet**, record the reason and reload
   once while connected. Do not mark offline launch ready from a spinner or hope.
3. Use Safari's Share menu → Add to Home Screen. Open **Earned** from that icon.
   Record whether it opens standalone, without Safari chrome; check the icon,
   paper background, readable status bar, and absence of install guidance.
4. Check offline-ready again in this installed app. Safari and the installed
   app's storage must not be assumed identical. Use the installed app for rows 2–6.

A blank screen, error or wrong source/date is a recorded failure/blocker. Stop
saving on an unverified build. Missing era id alone is not a failure.

## Row 2 — record all three kinds of entry

Use invented values only; no actual workout is required.

1. On an unused test day, log morning weight **170.6** and wait for the saved
   reading on Today. Take a photo. A second weight for that same date is currently
   refused because the correction path is not wired; do not expect 171.1 to replace it.
2. Open **How are you feeling today?** All unanswered choices should be unselected.
   Choose an invented answer, clear it by tapping again, open a conditional branch,
   and save a small invented check-in with **Add today's context**. Photograph its
   recorded state. Reopen and verify the saved answers. Blank is not an answer.
3. Open the workout card, Start, and enter a set for the exercise actually shown
   (do not look for the old harness's arbitrary squat). Record exercise, load,
   repetitions and the saved-set count; wait for **Set … logged**. Photograph it.
4. Briefly exercise Undo, re-log the intended set, advance, and eventually Finish;
   verify the saved count on Today. Keep an active session for row 3 first if useful.
   Check keyboard access, readable inputs, reachable buttons and no sideways scroll.
   The recovery form may need vertical scrolling to its save button.

Returning from an UNSAVED check-in must not create a record or discard a half-entered
set during that same page session. Unsaved set inputs are not promised across a kill.
If saving a set after a reading/check-in returns `WORKOUT_RESUME_STALE`, record the
exact message and counts. C4 names this residual; do not count a refused save as saved.

## Row 3 — swipe-kill and reopen

Swipe up and pause to show the app cards; swipe **Earned** away, wait five seconds,
then reopen it from its Home Screen icon. Check the morning reading, saved workout
count/set details and recorded check-in in their own screens; there is no combined
entry list promised by this UI. Photograph them and note any missing or ghost set.

Repeat in Safari separately if testing the Safari context; record which context
contains which test entries. A swipe-kill may leave WebKit's storage process alive.
This proves app-dismissal survival, not a process kill timed to the instant of save.

## Row 4 — reboot the phone

After the entries have visibly saved, shut the phone down, then restart it. Open
Earned from the same icon and check all three recorded kinds again. First do this
with a connection. Photograph the reading, workout count and check-in evidence.

A reboot ends all processes, making it stronger than row 3, but does not test a
battery failure mid-write. If the page cannot load, record a launch failure; once
reconnected, check stored facts separately before concluding that data was lost.

## Row 5 — airplane mode and a fresh offline launch

1. With offline-ready confirmed, turn on airplane mode and ensure Wi-Fi is also off.
2. Kill Earned and reopen it from Home Screen while still offline. Today, the gym
   and check-in must load. Photograph the screen with the offline state visible.
3. Log the next available test set and verify it saved; kill/reopen offline again.
   The set count and facts must remain. A new morning weight is an alternative only
   if that date has no reading yet; do not bypass the same-day refusal.
4. Reconnect and reopen. No saved entry should vanish, duplicate, or claim a server
   sync. This slice stores locally; hosted sync is deferred. The first download and
   updates still require a connection.

If the worker says it has not finished storing the build, record that message.
It is not an offline-launch pass, even if a subsequent online reload works.

## Row 6 — tomorrow's actual date (BLOCKED on the fixed-date preview)

On the reviewed real-calendar build, leave the app overnight. Reopen the SAME
installation tomorrow without changing the phone clock. Today must show the actual
new local date. Save **170.4**, verify it belongs to the new date, and confirm the
previously saved workout/reading evidence remains wherever the UI exposes it.
Yesterday's recovery answers must not silently become today's answers; today's
check-in starts unanswered. Photograph before/after dates and saved evidence.

Also exercise the rollover while a page remains open overnight: it must refresh
or explicitly require reopening before writing, never silently backdate a new log.
An abandoned prior-day session must follow the app's recovery/close route without
losing its saved sets. If the UI cannot expose older evidence, mark that aspect
UNOBSERVABLE and have the reviewer supply a privacy-safe count/verdict; do not invent
an entry list or ask Joe to extract IndexedDB.

Daily use additionally needs B-NTC accepted and the next SAME lift group on day+3
(or the actual chosen schedule) to open, start, record sets and finish. Verify native
**Last time** against the known earlier test set. C4's native reader unit checks do
not establish this real-phone path; B-NTC is absent from the audited integrated head.

## Row 7 — website-data loss (separate disposable test only)

**Not part of normal owner use. No deletion is authorized or executed by this audit.**
Keep this loss requirement, but book a separate disposable-origin test before anyone
uses a website-data removal control. Never clear all Safari history/data, the soak,
the frozen app, or an installation holding real logs. If no verified disposable origin
and explicit authorization are available, write **SKIPPED — no disposable origin**.

The later test must identify the exact test origin and record its before state,
then remove only that origin's data using the site's own scoped browser controls.
If the control cannot isolate the test origin, stop. After total loss of data AND
keys, a fresh empty installation is the expected limit: the app cannot know a prior
history existed. There is no visible era id to compare on Today; record the visible
fresh behaviour, and let a separate reviewer verify a new installation identity.
Partial loss is different: surviving evidence with a missing key/marker must show
restore-required, never silently re-enrol. Do not claim row 7 covers partial loss.
A lost launch cache may require an online load before this can be observed.

## Row 8 — two Safari tabs, one origin

Use a separate disposable Safari test context; do not assume it shares the installed
app's records. On a date with no reading, open the exact same origin in two Safari
tabs. Save **171.2** in the second tab, then reload the first. It must show that same
reading. Check any pre-existing saved workout/check-in counts remain unchanged.
If the date already has a reading, use an available workout set instead; a second
same-date weight must remain refused. This is cross-tab visibility after reload,
not proof of simultaneous writes or automatic cross-tab refresh.

## Results and limits

Return photos labelled 1–8, the receipt from row 1, and one short result per row:
PASS / FAIL with what appeared / BLOCKED with prerequisite / SKIPPED / UNOBSERVABLE.
Keep real health values out of public reports. Saved facts must be compared in the
same origin and launch context; do not treat a different browser store as data loss.

Not established here: power loss during the exact write; an old whole-profile/iCloud
restore (desktop witness can reuse a spent operation slot); wall-clock rollback and
clock continuity; 400-day real elapsed lease behaviour; automatic iOS eviction;
long idle survival/pressure; partial-key loss on the phone; hosted recovery or sync.
C1's local era has a self-renewing 400-day lease and no slot budget, a recorded
residual against DECISIONS:24. The existing C3 desktop harness reproduced limitations;
its PASS rows do not mean those limitations were repaired. The protected 30-day soak
remains a separate experiment, earliest readback **2026-10-05**. None of these eight
rows replaces it or qualifies iOS storage merely because Chromium passed.
