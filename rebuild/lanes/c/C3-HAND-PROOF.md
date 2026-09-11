# C3 HAND PROOF — the 15-minute phone test

**For Joe, on the iPhone.** Everything else in C3 ran on a PC in Microsoft Edge.
Your phone is not Edge. Safari stores data its own way and clears it its own way,
and there is no way to test that from a computer — so these eight rows are the
only evidence that exists for the phone.

Eight rows, about fifteen minutes of your time, spread over two days (row 6 is
"open it again tomorrow morning"). One photo per row is enough.

---

## Before you start

**1. The page — and this is a STOP, not advice.** Open the link you were sent for
this test. It has to be the **local-era test page**. Do **not** run this against
the normal Today page: Today still saves the old way (`localStorage`), so every
row below would pass and none of it would mean anything.

**You do not have to take anyone's word for which page you have — row 1 checks
it.** The local-era page shows an **era id**, a long string of letters and
numbers. Today has none, and cannot have one; it is produced by the storage this
test is about and by nothing else. **If row 1 shows no era id, STOP. Do not do
rows 2–8. Send a photo and say "no era id".** A green result on the wrong page is
worse than no result, because it would be filed as evidence.

**2. Synthetic numbers only.** Type made-up weights and sets. Nothing here should
be your real log. Use 170.6, 171.1 and so on — they match what the PC test used,
which makes the photos easy to read.

**3. Two rows need a throwaway.** Row 7 **deletes everything** and cannot be
undone. Only do it on a test page you do not care about. If in doubt, skip row 7
and say so — a skipped row is fine, a lost log is not.

**4. What each row needs.**

| row | works in Safari today | needs the installed app (Track A5) |
|---|---|---|
| 1 open it | yes | — |
| 2 log a weigh-in and a set | yes | — |
| 3 swipe-kill and reopen | yes | — |
| 4 reboot the phone | yes, **if** the page still loads with signal | the offline launch half needs A5 |
| 5 airplane mode | yes, once the page is already open | opening it fresh offline needs A5 |
| 6 come back tomorrow | yes | — |
| 7 clear website data | yes, **throwaway only** | — |
| 8 two tabs | yes | — |

Rows 4 and 5 have an asterisk: **Safari can only open a page it can reach.**
Until the app is installable (Track A5 — the "Add to Home Screen" shell), a fresh
launch with no signal may show Safari's "You are not connected" page. That is
Safari, not lost data — reconnect, open it again, and the entries are still
there. Write down which happened.

---

## ROW 1 — open it (1 minute)

1. Open **Safari**.
2. Go to the test link.
3. Wait for the page to finish loading.

**You should see:** a first-run screen, or an empty entry list, and somewhere on
the page a short code called the **era id** (a long string of letters and
numbers). If the page offers a "start" or "enrol" button, tap it once.

### 🛑 STOP CONDITION — read this before row 2

**Is there an era id on this page, yes or no?**

- **Yes** → carry on. Write the first six characters down; row 7 compares against
  it.
- **No** → **STOP HERE.** Do not do rows 2–8. Send Photo 1 and the words "no era
  id". It means you are on a page that saves the old way, and all eight rows
  would pass without testing anything this proof is about. Stopping is the
  correct outcome, not a failure on your part.

**📷 Photo 1:** the whole screen, including the era id.

**Something is wrong if:** the page is blank, shows an error, or never finishes
loading.

---

## ROW 2 — log a weigh-in and one set (2 minutes)

1. Enter a weigh-in of **170.6**. Tap save.
2. Log one set: **squat, 200 lb, 5 reps**. Tap save.
3. Look at the entry list.

**You should see:** both entries listed. The era id has **not** changed.

**📷 Photo 2:** the entry list with both entries visible.

**Something is wrong if:** you get "Entry not saved", or an entry appears and then
disappears when you scroll.

---

## ROW 3 — swipe-kill and reopen (2 minutes)

This is the important one. You are going to kill Safari the hard way — not close
the tab, *kill the app*.

1. Swipe up from the bottom of the screen and **stop in the middle**, then let go.
   You will see all your open apps as cards. (On an iPhone with a Home button:
   double-press the Home button.)
2. Find the **Safari** card.
3. **Swipe the Safari card up and off the top of the screen.** It disappears.
   Safari is now killed — it was not asked to save anything first, which is the
   whole point.
4. Wait five seconds.
5. Open Safari again and go back to the test page.

**You should see:** both entries from row 2 still there. Somewhere the page should
say something like *"Last saved: Set 1 of squat."*

**📷 Photo 3:** the entry list after reopening.

**Something is wrong if:** either entry is gone, or a set you never logged
appears.

> **What this row is and is not.** On iOS the part of Safari that holds the data
> runs in its own process, and swiping the card away does not reliably kill it.
> So a pass here is real but modest — it says the data survived the app going
> away. **Row 4 is the one that carries the weight**, because a reboot ends
> every process there is. Do not let anyone read row 3 as the phone's version of
> "killed the instant it said Saved"; nothing on the phone tests that.

---

## ROW 4 — reboot the phone (3 minutes)

A swipe-kill ends the app. A reboot also restarts the phone's storage. They are
not the same test.

1. Hold the **side button + volume up** until "slide to power off" appears, then
   slide it. (Or: Settings › General › Shut Down.)
2. Wait until the screen is fully black, then hold the side button to turn it back
   on.
3. Unlock, open Safari, go back to the test page.

**You should see:** both entries still there, exactly as in row 3.

**📷 Photo 4:** the entry list after the reboot.

**Something is wrong if:** anything is missing. If the page will not load at all,
check you have signal — that is Safari not reaching the page, not lost data.

---

## ROW 5 — airplane mode (2 minutes)

1. With the test page **already open**, swipe down from the top-right corner to
   open Control Centre and tap the **aeroplane** icon. It turns orange.
2. Log a weigh-in of **171.1**.
3. Turn airplane mode back off.

**You should see:** the 171.1 saves normally, with no spinner, no error, and no
"syncing" message. Nothing about this app needs the internet — there is no server
yet.

**📷 Photo 5:** the entry list with 171.1 on it, **with the orange aeroplane icon
visible in the status bar**. That is what makes the photo evidence.

**Something is wrong if:** the save is refused, or it appears and then changes
when the network comes back.

---

## ROW 6 — come back tomorrow morning (1 minute, next day)

1. Tomorrow, open Safari and the test page again.
2. Log a weigh-in of **170.4**.

**You should see:** yesterday's three entries still listed, and the new one dated
**today**, not yesterday.

**📷 Photo 6:** the entry list showing both days.

**Something is wrong if:** yesterday is gone, or today's entry is dated yesterday.

---

## ROW 7 — clear website data — ⚠️ THROWAWAY ONLY (2 minutes)

> **This deletes everything on that page and there is no undo.** There is no
> recovery path in this build — the entries are gone for good. Only do this on the
> test page. **Never** do it once your real log lives on this phone. If you are
> not certain, skip this row and write "skipped" — that is a perfectly good answer.

1. Take Photo 6 **first**, so the before state is recorded.
2. Settings › **Safari** › scroll down › **Clear History and Website Data**.
   (If it offers to clear for a specific site only, use that.) Confirm.
3. Open Safari and go back to the test page.

**You should see:** the app behaves as if it has never been used — a first-run
screen, an empty list, and a **new** era id, different from Photo 1's.

That is the correct behaviour, and it is worth understanding why it looks so
blunt: when the data and the key are both gone, there is nothing left that could
tell the app a history ever existed. It cannot warn you about something it has no
evidence of, and an app that claimed to "recover" here would be making it up.

**📷 Photo 7:** the first-run screen with the new era id.

**Something is wrong if:** the app crashes, gets stuck, shows half a history, or
claims anything was recovered.

---

## ROW 8 — two tabs (2 minutes)

1. Open the test page in a Safari tab.
2. Tap the tabs button (bottom-right, the two squares) › **+** › open the test
   page again in a second tab.
3. In the **second** tab, log a weigh-in of **171.2**.
4. Switch back to the **first** tab and reload it (pull down on the page).

**You should see:** the first tab now shows 171.2 too, and nothing that was
already there has gone.

**📷 Photo 8:** the first tab's list after the reload.

**Something is wrong if:** one tab's entry replaced the other's.

---

## Sending the results

Send the photos back however is easiest — a single message with all eight, in
order, is ideal. For each one, one line is plenty:

```
1 ok
2 ok
3 ok
4 ok
5 ok
6 ok
7 skipped — not a throwaway
8 ok
```

If a row went wrong, say **what you saw**, not what you think it means:
"the 170.6 entry was gone after the reboot" is worth ten times more than "the
save is broken". If something looked odd but you are not sure it counts, send it
anyway — the odd ones are the useful ones.

## What this does NOT test, so nobody claims it later

- **A dead battery mid-save.** Killing an app is not the same as power failing at
  the exact instant of a write. Nothing tests that, on any platform.
- **A year going by.** The lease rows (days 201 / 401) were tested on the PC by
  moving a clock. No real time has passed anywhere.
- **iOS deciding to reclaim space on its own.** Row 7 is *you* clearing data. iOS
  clearing it, because the phone is full and the app has not been opened in weeks,
  cannot be triggered on purpose — it can only be waited for.
- **Restoring the phone from an old iCloud backup.** That is a real risk and it is
  written down (a restored backup can bring back an old copy of your log and
  quietly overwrite newer entries), but it costs an hour and risks your real phone
  state, so it is deliberately not in this script.
