# EARNED MEASUREMENT PLAN v1.0 (owner ask, 2026-09-15)

Destination: rebuild/lanes/pm/MEASUREMENT-PLAN-v1.md
Owner: Joe. Status: proposed. The PM records acceptance as a ledger line and schedules the build behind P0; nothing here changes the critical path order or any owner gate.

## 1. Purpose

Answer one question with Joe's own data: over the first 8 to 12 weeks of training on Earned, do body composition, strength and adherence move at least as well as they did over the last 8 to 12 weeks on the frozen app? This is an N=1 comparison. It says whether Earned works for Joe, not whether it beats other apps.

## 2. What is measured

Same measures, same method, both windows.

| Measure | How | Cadence | Read as |
|---|---|---|---|
| Body weight | Morning, after bathroom, before food, same scale | Daily | 7-day rolling average; single readings are noise |
| Waist | At the navel, relaxed, tape level, same tape | Weekly, same weekday | Weekly value and 4-week trend |
| Strength markers | Top working set (load x reps) on 3 to 4 main movements Joe already tracks, chosen once and fixed | Every session they occur | Estimated 1RM trend per movement |
| Training adherence | Sessions completed / sessions planned | Weekly | Percent |
| Logging adherence | Days with a food entry / days in week; days with an energy entry / days in week | Weekly | Percent |
| Sleep | Already captured by the engine | As logged | Nights meeting the app's own qualifying rule |

Not included: scale body-fat percentage (bounces more than the signal), photos (fine to take, not scored), any lab or clinical value.

## 3. Windows

- Baseline: the last 8 to 12 complete weeks on the frozen app, taken from the imported history after P3 (Joe's real port). If the frozen app lacks waist or energy entries for that window, those measures start at zero baseline and are compared on trend only.
- Trial: from day one of Joe's two-day trial through week 12 on Earned. The first two weeks are recorded but flagged as run-in; comparisons use weeks 3 to 12.
- Same rules for Dad when he starts, with his own baseline if one exists.

## 4. What the app must do (one screens/plumbing ticket, size S)

1. Record every measure in section 2 on the device from day one of the trial, using existing entry paths where they exist (weight, sleep, food, energy) and adding waist as a weekly entry if it does not exist.
2. Compute the derived values (7-day weight average, weekly waist, estimated 1RM per marker, the four adherence percentages) locally.
3. Show one comparison view: baseline window on the left, trial window on the right, same measures, same units, weekly rows. No verdicts, no coaching copy; numbers and trends only.
4. Export the comparison as a plain table on demand (device only).
5. All of this data stays on the phone and on Joe's PC. None of it enters a cloud session, an AI pack, a review artifact or the ledger. Reviewers verify the view with synthetic data only.

Acceptance bar: with a synthetic 12-week history, the view renders the table in section 2 for both windows with correct arithmetic (checked against a hand-computed fixture), adherence percentages match the fixture, and no measure is read from or written to any path outside the device store. CI green both OS, one independent reviewer, mechanical integrator, per the screens/plumbing tier.

## 5. What Joe does

- Weigh and measure the same way every time (section 2).
- Pick the 3 to 4 strength markers once, before the trial starts, and do not change them mid-window.
- Do not start another large change in the same window (new diet approach, new sleep schedule, new supplement stack). If one is unavoidable, note the date in the app so the comparison can be split.

## 6. How the result is read

At week 12, the comparison view is read as a whole: weight and waist trend in the intended direction for the current goal, strength markers flat or rising, adherence at or above baseline. Better on most measures with adherence held is the pass condition. Worse on adherence is the most important fail signal regardless of the other numbers, because adherence is what drives the rest.

The result is one person over three months. It informs Joe's own use and the Dad decision. It is not evidence for wide beta claims and is never quoted as such in app copy.

## 7. Timing

The ticket lands before P3 so the comparison view exists on trial day one. It sits behind P0 and never displaces P1, P2 or P3 on capacity.
