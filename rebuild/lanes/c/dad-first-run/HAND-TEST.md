# DAD FIRST-RUN — THE 5-MINUTE HAND TEST

Companion to `BRIEF.md` §8 and acceptance check A12. Run it on the mock
(`dad-first-run-mock.html`) for the design review, and again on the real build
before Dad's beta.

The point of this test is not to prove the flow works. It is to find the place
a beginner stops. Everything below exists to stop the observer rescuing him.

---

## 1. What you need

- An iPhone, charged, unlocked, screen timeout set long, **Safari open on
  screen 1 of the flow and nothing else on the display.** No other tabs, no
  notifications, no keyboard shortcuts set up.
- A timer the tester cannot see.
- This sheet, printed or on a second device, for the observer.
- A person who has **never seen Earned** and was not in the room when it was
  discussed. For the real run that person is Dad.
- Nothing else. No pen for the tester, no notes, no printed instructions.

## 2. What you say

Exactly this, once:

> "This is the app. Have a go."

Then start the timer and stop talking.

If he asks a question, say: *"Do whatever seems right."* Write the question
down verbatim. Do not answer it, do not point, do not lean in, do not make a
face. A question you had to answer for him to continue is a **fail** — record
it and let him carry on so the rest of the flow still gets tested.

## 3. What you record, while it happens

One line per event. Do not summarise afterwards — write it as it happens.

| time | screen | what he did or said |
|---|---|---|

Specifically capture:

- **Every question he asks**, word for word.
- **Every pause over 10 seconds**, and which screen it was on.
- **Every Back tap**, and what he changed when he got there.
- **Every field he left blank**, and whether he seemed to mean it.
- **Every number he typed that he did not read off a machine** — if he guessed
  a weight to get past a box, that is the most important finding in the test.
- **Any moment he re-read a line twice.** That line is unclear.
- Where he expected to tap and nothing happened.

## 4. What "pass" means

All four, or it is not a pass:

1. **Under 5 minutes**, from "Have a go" to the Today screen.
2. **No question you had to answer** for him to keep going.
3. **No number on the final screen that he did not supply**, except the date,
   the "n of 6" counter, and the 5 lb standard step — which is labelled as
   ours on the screen where it is used.
4. Asked afterwards, **"what happens tomorrow?"**, he can answer it from what
   he saw. ("Nothing, tomorrow's a rest day" is a correct answer.)

A **refusal at screen 6 is not a fail.** Reaching "Earned can't build your week
yet", reading what is missing, tapping back and filling it in is the flow
working exactly as designed. The failure mode this test hunts is the opposite:
a silent default that let him through with a guess.

## 5. What "fail" means

Any one of these:

- He asks what a screen means and cannot continue until you tell him.
- He **invents a number** to get past a field — a weight he did not read off
  the machine, a rep count he picked because the box wanted one.
- He reaches Today on a state built from a guess.
- The timer passes 5 minutes.
- He lands somewhere he cannot get back from.
- He finishes and cannot say what happens tomorrow.

## 6. The three questions afterwards

Ask in this order, and write the answers verbatim. Do not correct him.

1. **"What happens tomorrow?"**
2. **"What did it ask you that you didn't know the answer to?"**
3. **"Was there anything on there you don't think is true?"** — this one
   catches numbers the app supplied that read as claims about him.

Then, and only then, answer anything he asked during the run.

## 7. Where the time actually goes

Budget, for a three-exercise upper/lower week. If a real run diverges badly
from this, the divergent screen is the one to redesign.

| screen | budget |
|---|---|
| 1 name | 0:20 |
| 2 days | 0:50 |
| 3 exercises + sets/reps | 2:00 |
| 4 loads | 1:20 |
| 5 priority | 0:20 |
| 6 summary | 0:30 |
| **total** | **5:20 worst case, ~4:00 expected** |

Screen 3 is the budget risk, and screen 4 the accuracy risk. If the test blows
the clock, the first thing to cut is exercises — a week with three lifts that
he actually names beats a week with nine he half-remembers.

## 8. Running it on the mock (design review)

The mock is a single file and opens from anywhere — AirDrop it to the phone
and open it in Safari, or serve the folder over the LAN. It makes no network
request and saves nothing, so a reload is a clean restart.

Two differences from the real build, both honest and both visible on screen:

- "Start upper body" on the Today screen does nothing. The gym card is A2, a
  different piece of work.
- A "Run the setup again (mock only)" link sits under it so the observer can
  reset between testers. The real build has no such link — first-run runs once
  and refuses to overwrite an existing state (`BRIEF.md` §6, acceptance A10).

## 9. The record to keep

One file per run, in this folder or wherever the build's reviewer keeps its
evidence, containing: the date, who the tester was (first name is enough), the
build or file hash under test, the event log from §3, the pass/fail verdict
against §4, and the three answers from §6.

One human run per build, named in the reviewer's ACCEPT. A green suite with no
hand-test record does not meet the acceptance bar in `BRIEF.md` §7.
