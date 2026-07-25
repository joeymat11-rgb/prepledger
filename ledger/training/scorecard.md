# Self-training scorecard — analyst hit-rate ledger

Grades the analyst's own past calls (CONSIDER items, staged proposals, AUDIT verdicts, QUESTIONS) against what actually happened. Updated nightly. Outcome codes: ADOPTED / DISMISSED / CONFIRMED / CONFOUNDED / PENDING / MOOT.

## Running tally
- Calls made: 6 · Graded: 1 · Hits: 1 · Misses: 0 · Pending: 5

## Ledger

| Date | Type | Call | Outcome | Note |
|---|---|---|---|---|
| 2026-07-24 | CONSIDER | Pre-declare 7/25 Wedding #2 as an estimate/event day before it happens | PENDING | As of 7/25 AM the event flag is still estimated=false; wedding is today. Re-issued as a Run 2 CONSIDER. Grade after the wedding. |
| 2026-07-24 | AUDIT | Step Efficacy (n=5) verdict → weakened; keep steps for health, don't act on it | PENDING | Grade if the instrument is re-run with more pairs or if a step change is ever proposed on its basis |
| 2026-07-24 | QUESTION | Pronated 7/23: skipped-per-note vs logged 40×12,12 — which is right? | CONFIRMED (hit) | Athlete answered "Skipped" (feed ANALYST ANSWER, 7/24). The flagged log was phantom; the note prose was right. Ruled into caselaw CL-6. |
| 2026-07-25 | CONSIDER | Mark today (7/25) an estimate/event day so the wedding meal reads as a sanctioned event, not a protein miss | PENDING | Check next run whether estimated flipped to true and whether the weekend-split stat treated it as an event |
| 2026-07-25 | AUDIT | Weekend Split (50% weekend vs 81% weekday protein) → weakened; recent Saturdays are event days, untracked at the table | PENDING | Grade once a non-event weekend lands in the record and the split can be re-read outside the wedding fortnight |
| 2026-07-25 | QUESTION | Extension 7/24 logged 150×6,9 — second set above first; real or transposed? | PENDING | Grade when the athlete answers (watch for an ANALYST ANSWER feed entry). Parallels the CL-6 pattern. |

## Notes
- Run 1 (2026-07-24): scorecard opened. No prior briefs in git history to back-grade — first honest measurement of the analyst starts here.
- Run 2 (2026-07-25): first graded call — the pronated QUESTION landed a hit (phantom-log catch confirmed by the athlete, → CL-6). Log-integrity questions that pit a note against a set are earning their keep; the extension 6,9 question tests the same pattern again.
