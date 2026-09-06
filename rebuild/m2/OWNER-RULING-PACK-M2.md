# EARNED — YOUR RULINGS ON THE ENGINE AUDIT (M2-PACK v3) — 2026-09-06
Written by cowork after verifying Astra's audit by execution. Read time ≈ 5 minutes. You answer with ONE short reply (example at the bottom).

## What was found, in one paragraph
While copying the old app's calculation engine into the new app, 45 questionable behaviours were preserved on purpose so the copy stayed exact. Each now has a test that fails today and will pass once fixed. I re-ran all 45 tests on both the old and the new engine (all 45 fail on both — same behaviour, as intended), re-ran the 104 "broken test" checks (all caught), and re-ran the private check of whether YOUR real ledger hits each one today (4 do). Nothing is fixed yet; nothing changes without your say-so.

## The 4 that your ledger triggers (checked locally on the audited snapshot of your ledger — the pinned copy, not your phone's data today; only the verdict is public)
- D12 — plain bug (Batch A): the "extra steps" effect can be computed a thousand times too large (a units mistake), so the app wrongly dismisses it.
- D16 — YOUR RULING (Batch B, question 3): a "7-day forecast hit" can be credited from a weigh-in that arrives well after the seventh day (example: weeks later). How late is too late is a rule, not a bug.
- D30 — plain bug (Batch A): a "first-set improvement" can be computed mixing sessions before and after a recorded technique change.
- D45 — plain bug (Batch A): the analyst's instruction text describes the increase rule wrongly (the app's actual behaviour is right; no wrong athlete-facing output has been demonstrated).

## BATCH A — 38 plain bugs (no training judgement involved): approve as one batch
These are wrong numbers, wrong receipts, lost facts, or crashes — e.g. an increase queued with the old per-set weights left behind (D41), a session that stores the configured load instead of the one you actually lifted (D43), a "VOLUME −1" receipt printed when nothing was removed (D44), a merge that drops a trial accept/decline (D38), "undo a break" leaving the scale seal active (D42). Full list: rebuild/m2/AUDIT-REGISTER.md. Estimated ≈ 105 engineering hours in total (Astra's estimate, not measured; some fixes share code). Astra sequences them (my suggestion, not a rule: the ledger-triggered ones and the "lost fact" ones first). Every fix turns its red test green and is re-verified by me on your ledger. How outputs are allowed to change: the frozen old app and its reference results stay untouched; each accepted fix gets its own reviewed, versioned expected results for the NEW engine, tied to the exact ruling, with the change disclosed — nothing is ever silently regenerated to make a test pass.
→ Reply: "batch A yes" (or name any ID you want held back).

## BATCH B — 7 questions only you can answer (training/product rules). Recommendation first; say "all recommended" or override by ID.
1. D8 — Missing last night's sleep. Should the app treat recovery as UNKNOWN and not apply a sleep restriction today (recommended; your other recovery checks still apply), or carry forward the last logged NIGHT's status until you log again?
2. D10 — "A week". Should date-only week counts mean 7 CALENDAR days (recommended), or 168 elapsed hours (which drifts by an hour across a clock change)?
3. D16 — 7-day forecast grading. Should a hit require an eligible weigh-in on the due day, or failing that the next day (recommended — one day of grace; with no such reading the forecast is UNGRADED, not a miss), or exactly the due day only? (The day arithmetic follows your answer to question 2.)
4. D25 — First protein day. Should "protein: good" require at least one successful day within the current seven-logged-days window before the one-miss allowance kicks in (recommended), or may the very first missed day still read "good"?
5. D32 — Replication after a technique change. Should "benefit replicated" count only sessions from the CURRENT technique (recommended), or also earlier-technique sessions? (All other replication thresholds stay as they are.)
6. D37 — A merged earned receipt. When two phones' copies combine on a later day, should the receipt keep the assessment as of the day it was earned (recommended), or be relabelled as today's reassessment? Plainly: the recommended option can change more than wording — in some cases it changes whether a single-sighting increase counts as earned at all, and the numbers printed on past earned receipts.
7. D40 — Two phones disagree on a day's calories with equal detail. Should ONE deterministic shared winner be chosen with the conflict kept visible (recommended), or should whichever phone does the merge keep its own value? Plainly: today's test only proves the answer differs by merge direction; the exact tie-break rule, keeping BOTH original entries, and how the conflict is shown are not yet specified — your ruling picks the direction, and the fix brief must spell out the rest before anything is built.
→ Reply: "batch B all recommended" (or e.g. "B3 exact day 7", "B7 receiving phone").

## What happens next
Your reply goes into the ledger as rulings; Astra writes the fix briefs per theme (the 7 rulings add ≈ 26 estimated hours if their fixes follow); I verify each fix by execution (red → green, ledger re-run); the suite's v4 version absorbs the new laws with versioned expectations; then M2 closes. None of this blocks W5/W6 (server and phone bridges), which continue in parallel.

## Example reply (copy, edit, send)
batch A yes · batch B all recommended
