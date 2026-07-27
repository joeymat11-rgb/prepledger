# Self-training scorecard — analyst hit-rate ledger

Grades the analyst's own past calls (CONSIDER items, staged proposals, AUDIT verdicts, QUESTIONS) against what actually happened. Updated nightly. Outcome codes: ADOPTED / DISMISSED / CONFIRMED / CONFOUNDED / PENDING / MOOT / RESOLVED.

## Running tally
- Calls made: 11 · Graded: 5 · Hits: 1 · Misses: 3 · Watch resolved: 1 · Pending: 6
- Miss cluster: 2 of 3 misses are the SAME retired idea (estimate-day pre-declaration, pitched twice, adopted zero times). The third is a wrong hypothesis on a benign log (extension "transposed" → Real). No process miss stands alone.
- Honesty note (7/27): the estimate-day flag DID eventually land — 7/25 shows dayCtx.est=true, "declared estimate day." That does NOT rescue the pitches: both proposed PRE-declaration, and the athlete set the flag post-hoc, at the day level, on his own. The retirement stands and is now caselaw (CL-9). Reality confirmed the doctrine, not the pitch.

## Ledger

| Date | Type | Call | Outcome | Note |
|---|---|---|---|---|
| 2026-07-24 | CONSIDER | Pre-declare 7/25 Wedding #2 as an estimate/event day before it happens | DISMISSED (miss) | Athlete never pre-flipped. He declared 7/25 an estimate day POST-hoc (dayCtx.est=true) after the meal; events[wed2].estimated stayed false. Pre-declaration was the wrong lever → CL-9. |
| 2026-07-24 | AUDIT | Step Efficacy (n=5) verdict → weakened; keep steps for health, don't act on it | PENDING | Grade if the instrument is re-run with more pairs or if a step change is ever proposed on its basis |
| 2026-07-24 | QUESTION | Pronated 7/23: skipped-per-note vs logged 40×12,12 — which is right? | CONFIRMED (hit) | Athlete answered "Skipped" (feed ANALYST ANSWER, 7/24). The flagged log was phantom; the note prose was right. Ruled into caselaw CL-6. |
| 2026-07-25 | CONSIDER | Mark today (7/25) an estimate/event day so the wedding meal reads as a sanctioned event, not a protein miss | DISMISSED (miss) | Re-issue of the 7/24 pitch. Athlete set dayCtx.est=true himself, after the fact — not in response to the pitch. Retired to the graveyard; do not pitch a third time. |
| 2026-07-25 | AUDIT | Weekend Split (50% weekend vs 81% weekday protein) → weakened; recent Saturdays are event days, untracked at the table | PENDING | Still no clean non-event weekend graded. 7/26 (Sun) is the first post-event candidate but its numbers aren't synced yet. Grade once a clean weekend lands. |
| 2026-07-25 | QUESTION | Extension 7/24 logged 150×6,9 — second set above first; real or transposed? | CONFIRMED — benign (miss on hypothesis) | Athlete answered "Real" (feed ANALYST ANSWER, 7/25). The reads were genuine — the "transposed" lean was wrong. Distinct from CL-6 (no contradicting note here) → ruled CL-7. |
| 2026-07-26 | AUDIT | Miss Archaeology → weakened; its "no sleep link, 0% of misses followed a sub-7 night" claim rests on only ~2 sub-7 nights | PENDING | Grade if the instrument is re-run with more sub-7 nights, or if a day-structure change is ever proposed on its basis |
| 2026-07-26 | CONSIDER | Stage a grip baseline this week (3 mornings) so the CNS-readiness signal has a floor before the reverse phase | PENDING | grip[] still empty as of 7/27. Not re-pitched this run (avoid the estimate-day nag pattern); let it ride one more cycle. |
| 2026-07-26 | WATCHING | Do events dent sleep? Both event nights ran short (Wedding #1 7.0h, refeed 6.0h) under the 7.5h streak | RESOLVED (weakened) | Wedding #2's night was the tiebreaker and came in FULL — 7.58h. n=3 now reads two short, one clean. "Dented, not doomed" — no clean event→short-sleep link. Worth having watched; verdict is soft. |
| 2026-07-27 | AUDIT | Sleep-reset gate (declared 7/22, the same night sleep fell to 6.0h) → survives; three clean nights since (7/23–25, all ≥7.5h) re-cover it, PRs stay ownable | PENDING | Grade if a sub-4.5h night ever tests the "ownable" gate, or if an owned PR is later contested on recovery grounds |
| 2026-07-27 | CONSIDER | Seal lifts today — stage a 3-day scale re-entry: ignore the first two unsealed reads (Sat had 8 drinks + high sodium), anchor on the third | PENDING | Check next runs whether the first post-seal reads are trusted immediately or held; grade against how the athlete treats the reopening number |

## Notes
- Run 1 (2026-07-24): scorecard opened. No prior briefs in git history to back-grade — first honest measurement of the analyst starts here.
- Run 2 (2026-07-25): first graded call — the pronated QUESTION landed a hit (phantom-log catch confirmed, → CL-6). Log-integrity questions that pit a note against a set are earning their keep.
- Run 3 (2026-07-26): three grades landed. Estimate-day pitch dead (two swings, zero adoptions); log-integrity questions calibrated (CL-6 note-vs-log real; CL-7 bare rep-shape benign). Honest hit-rate 1/4 graded.
- Run 4 (2026-07-27): sync backlog cleared; Saturday's books landed. The estimate-day flag turned up on 7/25 — but POST-hoc and day-level, vindicating the retirement, not the pitch (→ CL-9). Events-dent-sleep watch resolved soft after Wedding #2 slept full (n=3). Audit rotated to the sleep-reset gate (survives). Did NOT re-pitch grip — one pending cycle is enough before it risks becoming the next dead-horse pitch.
