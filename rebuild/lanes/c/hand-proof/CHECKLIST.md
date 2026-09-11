# C3 hand proof — the one-page checklist

Tear-off companion to `../C3-HAND-PROOF.md`. Read the full script once; carry
this. **One line per row back: PASS, FAIL or SEE. No data, no screenshots.**

| # | do | it passed if |
|---|---|---|
| 0 | is there a URL? | yes — the Netlify secret is in and a push has deployed |
| 1 | Safari → Share → Add to Home Screen → open it | named **Earned**, green check icon, no Safari chrome |
| 2 | log a weigh-in of 170.6 | *This morning ✓ 170.6 lb* and the "encrypted local store" sentence |
| 3 | start a workout, log 2 sets, swipe-kill, relaunch | *Workout in progress*, primary action is **Resume**, both sets there |
| 3b | *(optional)* power the phone off and on, reopen | both sets still there |
| 4 | recovery check-in, answer one question, reopen | *Recorded today at HH:MM* |
| 5 | wait for **offline-ready ✓**, airplane mode, kill, relaunch, log 171.1 | it opens and saves with no signal |
| 6 | tomorrow: weigh-in, then try the workout | yesterday intact; a workout refusal here is **expected** |
| 7 | **throwaway only** — clear website data, relaunch | empty and calm, or *Restore required — sign in* |
| 8 | send the lines | — |

## The three SEEs — expected, not bugs

* **Row 5**, if you were quick: *Storing this build on this device: N of M files*
  or *not being served by its offline copy yet*. Reconnect, reload once, retry.
* **Row 6**: the refusal code `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`. A fresh
  athlete gets one session per lift group until lane B's `B-NTC` merges
  (DECISIONS:102). Any **other** code is a real finding — copy it exactly.
* **Row 7**: a completely empty first run with a new era. Nothing survived that
  could prove a history existed, so the app must not claim one did.

## Two hard stops

* **Row 7 deletes everything and cannot be undone.** Throwaway data only.
  `7 skipped` is a good answer.
* **Do not** change the phone's clock, restore from an old backup, or let the
  battery die to "test" it. None of those proves anything here, and two of them
  risk your real phone state.

## Before handing this over

```
node --test rebuild/lanes/c/hand-proof/expected-strings.test.mjs
```

Red = the screens moved and the script is stale. Fix the script, not the phone.
