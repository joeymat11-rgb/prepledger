# Scoreboard runs

Score history for the self-improvement blueprint (BLUEPRINT.md section 4.3). One row per scored round.

## TRIAL-OPUS55-SECOND-READ (started 2026-09-26, DECISIONS:848; note claude/PM-NOTE-OPUS55-TRIAL-2026-09-26.md, owner-approved)

Question: can Claude Opus 5.5 take the second Claude read of engine-tier reviews (DECISIONS:843) instead of Claude Fable, to save cost, with no quality loss.
Pass bar: Opus misses NO serious finding Fable caught, and matches Fable overall, over three rounds extended until the two reads have faced at least 10 real findings. Then a one-line yes/no to Joe (L4). Fail: nothing changes.
Scorer: Astra (Codex), a neutral cross-family scorer, fixed rubric: SERIOUS = a wrong stored, shown or adopted load would ship, or a row would pass for a wrong product; COVERAGE = a specified outcome with no failing row, product correct; MINOR = other real concerns. Full tables: trial-opus55/TRIAL-SCORE-R24-R25.md.

| round | findings (Claude reads) | Fable only | Opus only | both | Fable-origin | serious in union | serious missed by Fable | serious missed by Opus | serious Fable caught that Opus missed | Astra extras (serious) | caveats |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NATIVE-LOAD R24 | 16 | 8 | 4 | 2 | 2 | 7 | 4 | 6 | 3 (24-03, 24-05, 24-06) | 4 (3) | Opus read reused two mutants from a cut-off Fable read (scored Fable-origin); effort of both reads was the launch default (not set explicitly; DECISIONS:849) |
| NATIVE-LOAD R25 | 13 | 4 | 5 | 4 | 0 | 12 | 9 | 8 | 1 (25-05) | 8 (7) | effort was the launch default for both reads (DECISIONS:849) |
| NATIVE-LOAD R26 | 11 | 2 | 7 | 2 | 0 | 8 | 5 | 6 | 2 (26-01, 26-04) | 5 (4) | effort was the launch default for both reads (DECISIONS:849); both reads told to use no other reviewer's mutants |

TRIAL RESULT (DECISIONS:851, after 3 rounds and 40 real findings, above the 10-finding minimum): FAIL. Opus missed 6 serious findings that Fable caught (24-03, 24-05, 24-06, 25-05, 26-01, 26-04), so the pass bar "Opus misses NO serious finding Fable caught" is not met; nothing changes (Fable stays the primary Claude reader). Over the same rounds Fable missed 4 serious findings Opus caught (24-14, 25-12, 25-13, 26-07); findings by one reader only: Fable 14, Opus 16, both 8. Reading: the two Claude reads are complementary, not substitutes, and Astra's later cross-family read caught serious findings both missed in every round (3, 7, 4). Caveat: effort could not be set explicitly on this launch surface for any read (DECISIONS:849).
