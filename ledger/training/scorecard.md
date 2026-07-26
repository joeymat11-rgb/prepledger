# Self-training scorecard — analyst hit-rate ledger

Grades the analyst's own past calls (CONSIDER items, staged proposals, AUDIT verdicts, QUESTIONS) against what actually happened. Updated nightly. Outcome codes: ADOPTED / DISMISSED / CONFIRMED / CONFOUNDED / PENDING / MOOT.

## Running tally
- Calls made: 8 · Graded: 4 · Hits: 1 · Misses: 3 · Pending: 4
- Miss cluster: 2 of 3 misses are the SAME retired idea (estimate-day pre-declaration, pitched twice, adopted zero times). The third is a wrong hypothesis on a benign log (extension "transposed" → Real). No process miss stands alone.

## Ledger

| Date | Type | Call | Outcome | Note |
|---|---|---|---|---|
| 2026-07-24 | CONSIDER | Pre-declare 7/25 Wedding #2 as an estimate/event day before it happens | DISMISSED (miss) | As of 7/26 events[wed2].estimated is still false and 7/25's day numbers were never entered/flipped. Not adopted. |
| 2026-07-24 | AUDIT | Step Efficacy (n=5) verdict → weakened; keep steps for health, don't act on it | PENDING | Grade if the instrument is re-run with more pairs or if a step change is ever proposed on its basis |
| 2026-07-24 | QUESTION | Pronated 7/23: skipped-per-note vs logged 40×12,12 — which is right? | CONFIRMED (hit) | Athlete answered "Skipped" (feed ANALYST ANSWER, 7/24). The flagged log was phantom; the note prose was right. Ruled into caselaw CL-6. |
| 2026-07-25 | CONSIDER | Mark today (7/25) an estimate/event day so the wedding meal reads as a sanctioned event, not a protein miss | DISMISSED (miss) | Re-issue of the 7/24 pitch; still not adopted after the wedding. Retired to the R&D graveyard — do not pitch a third time. |
| 2026-07-25 | AUDIT | Weekend Split (50% weekend vs 81% weekday protein) → weakened; recent Saturdays are event days, untracked at the table | PENDING | Still no non-event weekend in the record (7/25 was Wedding #2). Grade once a clean weekend lands outside the fortnight. |
| 2026-07-25 | QUESTION | Extension 7/24 logged 150×6,9 — second set above first; real or transposed? | CONFIRMED — benign (miss on hypothesis) | Athlete answered "Real" (feed ANALYST ANSWER, 7/25). The reads were genuine — the "transposed" lean was wrong. Distinct from CL-6 (no contradicting note here) → ruled CL-7. The question resolved cleanly, but the analytic instinct missed. |
| 2026-07-26 | AUDIT | Miss Archaeology → weakened; its "no sleep link, 0% of misses followed a sub-7 night" claim rests on only ~2 sub-7 nights | PENDING | Grade if the instrument is re-run with more sub-7 nights, or if a day-structure change is ever proposed on its basis |
| 2026-07-26 | CONSIDER | Stage a grip baseline this week (3 mornings) so the CNS-readiness signal has a floor before the reverse phase | PENDING | Check next run whether any grip entries appear (grip[] is currently empty) |

## Notes
- Run 1 (2026-07-24): scorecard opened. No prior briefs in git history to back-grade — first honest measurement of the analyst starts here.
- Run 2 (2026-07-25): first graded call — the pronated QUESTION landed a hit (phantom-log catch confirmed, → CL-6). Log-integrity questions that pit a note against a set are earning their keep.
- Run 3 (2026-07-26): three grades landed. Lesson 1 — the estimate-day pitch is dead: two swings, zero adoptions; the athlete enters rough numbers after events, he does not pre-flip the flag. Lesson 2 — calibrate log-integrity questions: CL-6 (note contradicts log) caught a real phantom; CL-7 (mere rep-shape surprise, no contradicting note) was benign. Only a note/flag CONTRADICTION should trigger the question; a bare ascending pair should not. Honest hit-rate now 1/4 graded — the misses are one retired idea plus one over-eager transposition suspicion, both now doctrine in orders-addendum.
