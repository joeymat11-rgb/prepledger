# NATIVE-LOAD model trial score: round 26

Scorer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; neutral cross-family scorer

Evidence: the four supplied trial-data reports; selected static product/test reads only. No tests run; reported executions were not independently reproduced. Clause numbers are the reports' R9.13 references, not a fresh spec audit. No project acceptance or model-substitution decision is made.
Scoring follows TRIAL-SCORE-R24-R25.md: one clause plus one defect; a named debt counts as a catch. Classes are the readers' decisions. '-' means no qualifying finding. SERIOUS concerns the counterexample's stored/shown/adopted load or authority, not an allegation that the correct head already has the mutation. Missing specified refusals/metadata/recovery with no demonstrated wrong load are COVERAGE; other real concerns are MINOR. A green suite on an absent input alone is not a wrong-row finding.

## Round 26

| id | clause | defect in one line | caught by | Fable class | Opus class | severity | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 26-01 | B/:127/:151, (v), FC01:544 | Narrowed structural-kind guard applies an accepted load beside unresolved own/reclaim/ladder history. | FABLE | blocker | - | SERIOUS | B-R26F-1/FN09; merge three kinds under the same transition-set defect; a native load is queued when it must be held back. |
| 26-02 | :165/:207, FC03:234 | Ignoring a moved wSets base omits its required hold and applies the accepted effect on that changed basis. | BOTH | blocker | blocker | SERIOUS | B-R26F-2/FN12 = B-R26C-1/N-F2 = L19-B6/N11; same removed comparison; authority boundary as 25-13, discussed below. |
| 26-03 | :100/:101/:170, TB:706 | Cancel returns RECORD_INVALID instead of dismissed:true, with no writes. | BOTH | debt | debt | COVERAGE | D-R26F-1/FN01 = D-R26C-3/N-H4; identical input and branch deletion; whether cancel is a host answer is disputed by Opus. |
| 26-04 | :110/:139, TB:700 | Baseline offer maps unprescribed current positions to numeric zero. | FABLE | debt | - | SERIOUS | D-R26F-2/FN03; current [null,null] becomes [0,0]; wrong host/view load, though not rendered by the current DOM. |
| 26-05 | :97/:149/:156, TB:718 | Revalidation checks only the first offer and refuses a genuine second offer. | OPUS | - | blocker | COVERAGE | B-R26C-2/N-H1; head accepts second DEBUT; mutant STALE_OFFER writes nothing; wrong refusal, not a demonstrated wrong stored load. |
| 26-06 | :110/:150, FC01:565 | Adoption leaves stale topRun instead of clearing it. | OPUS | - | blocker | COVERAGE | B-R26C-4/N-K1; later issuance carries wrong cache metadata and ID; no changed numeric load or authority outcome demonstrated. |
| 26-07 | :144/:150/:152/:199, FC01:256 | Equal performed loads on a vector plan produce a forbidden scalar adoption offer. | OPUS | - | blocker | SERIOUS | B-R26C-5/N-K3; shown target is offered where no adoption offer is permitted; transition still refuses its yes; severity boundary below. |
| 26-08 | :110/:153, FC01:647 | Qualified landing leaves own absent/true instead of false. | OPUS | - | blocker | COVERAGE | B-R26C-6/N-K5; merge absent/true inputs under one omitted reset; later issuance image/ID differs, with no demonstrated changed load. |
| 26-09 | FC03:728 overlap refusal refs | Overlap refusal omits the already-spent effects' response refs. | OPUS | - | debt | COVERAGE | D-R26C-1/N-F1; provisional: host reachability argued absent; external-record witness not executed; no wrong load inferred. |
| 26-10 | TB:697 host candidate state | Host offer loses its candidate state while business outcomes remain unchanged. | OPUS | - | debt | MINOR | D-R26C-2/N-H2; provisional named live metadata debt; specification does not require this display field; L19-N05 overlap discussed below. |
| 26-11 | TB:657, controller:201/:227 | Project labels non-normal completions normal, defeating the controller's selection filter. | OPUS | - | debt | COVERAGE | D-R26C-4/N-H6; provisional: no non-normal host Close constructed; no measured downstream load difference or precise spec clause supplied. |

## Astra-extra table (L19)

| id | clause | defect in one line | caught by | Fable class | Opus class | severity | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 26-A1 | :97/:110/:139, TB:700 | Host rounds fractional displayed current loads while saved issuance preserves them. | ASTRA | - | - | SERIOUS | L19-B1/N02; fractional value corruption, distinct from 26-04's null-to-zero coercion. |
| 26-A2 | :102/:139, TB:701 | Undo omits its displayed explanation while saving that explanation. | ASTRA | - | - | COVERAGE | L19-B2/N06; compensation-only survivor after the general reason omission was repaired; same severity as 25-A6. |
| 26-A3 | :60/:97/:101/:170, TB:707 | Boolean true acts as accept and durably adopts the offered load. | ASTRA | - | - | SERIOUS | L19-B3/N09; newly surviving answer class after R26 repaired absent/undefined and string answers. |
| 26-A4 | :169, TB:710 | Genuine handle with absent proposal_id still writes and adopts the load. | ASTRA | - | - | SERIOUS | L19-B4/N10; absent-key survivor after R26 repaired wrong nonempty identifiers. |
| 26-A5 | :60/:110/:139, TB:700 | Host drops unprescribed current-vector positions entirely. | ASTRA | - | - | SERIOUS | L19-B5/N12; [null,null] becomes []; deletion/cardinality defect, separate from numeric substitution in 26-04. |

Totals R26: 11 Claude findings = FABLE only 2, OPUS only 7, BOTH 2, FABLE-ORIGIN 0, OPUS-ORIGIN 0 (scored findings). Astra extras 5 (4 SERIOUS, 1 COVERAGE); L19-B6 merges into 26-02 and D-L19-N05 into 26-10. Union 16 = SERIOUS 8, COVERAGE 7, MINOR 1. Serious detection misses: Fable 5 (26-07, A1, A3, A4, A5); Opus 6 (26-01, 04, A1, A3, A4, A5). Serious caught but called debt: Fable 26-04; Opus none.

## Judgement calls

- 26-02 merges both Claude blockers and L19-B6: absent-to-array/null base changes and different synthetic vector values expose the same omitted wSets image comparison. R1/R2 are revisions, not separate defects. SERIOUS follows 25-13's changed-basis authority rule: a required hold disappears and the effect applies. The demonstrated registered-day consequence is refusal rather than a wrong numeric card; if classified only by that consequence, COVERAGE is plausible. Reclassification lowers serious union to 7, with neither reader's serious misses changing.
- 26-01 is SERIOUS because the mutant admits the native load beside an unresolved structural entry. I do not claim the report proved which of the competing entries wins a later card. 26-05 is COVERAGE under the earlier score's wrong-refusal rule: the genuine second offer is rejected, with no incorrect write.
- 26-07 is the closest new severity boundary: the forbidden offer shows a load and solicits adoption, although the transition prevents application. I score the inadmissible shown load offer as SERIOUS, consistent with the authority interpretation in 25-13. If only wrong numeric values or successful adoption count, use COVERAGE: serious union 7, Fable misses 4, Opus misses 6. No successful vector adoption is claimed.
- 26-04/A1/A5 use the same host/view meaning of 'shown' used for R25-A3/A4/A7/A8. Fable explicitly says current is forwarded but not painted. No new DOM assertion is inferred. Numeric substitution (26-04) and position deletion (A5) remain separate, like R24's cancelled-flag versus deleted-tombstone split. Merging them would yield 4 extras and union 15 (7 SERIOUS); Fable serious misses 4, Opus 5, because Fable would get credit for the merged case. A1 changes finite values, not null positions.
- 26-06/08 corrupt specified stored metadata and later issuance IDs, not demonstrated load values. COVERAGE avoids inventing a subsequent wrong prescription from topRun/own. Broader consequences may exist but are not established here. The own absent/true witnesses merge; topAt/std are requested companion assertions, not independently live mutants in these reports.
- 26-03 preserves the Fable/Opus classification difference in reasoning: Fable treats cancel as specified; Opus requests a ruling because the host answer enumeration names accept/decline. Provisional COVERAGE, not a proved API ruling. It is a new cancel-specific input, separate from the already-carried decline input.
- 26-09/11 retain explicitly named live guard/metadata debts without upgrading unexecuted reachability arguments into wrong-load findings, as for 25-10/11. The overlap-ref requirement and non-normal selection obligation were not independently spec-verified. If no admitted counterexample exists, remove the respective row; each removal reduces OPUS-only and COVERAGE by one, without changing serious misses.
- 26-10 is a provisional MINOR catch because the method includes named debts asserting live mutations. Both D-R26C-2 (state null) and D-L19-N05 (PROPOSED shown as DEBUT) identify unpinned host candidate-state fidelity; merge, with no Astra extra. Neither establishes a specified business-outcome defect. Excluding wholly unspecified metadata instead would give 10 Claude findings, OPUS-only 6, union 15, MINOR 0; serious counts are unchanged.
- Excluded as restated old defects: B-R26C-3/N-H3 (Opus blocker) and Fable's carried decline half of D-R26F-1 are 25-07, already credited to Fable as debt. Missing dismissed:true is the same decline-output defect whether replaced by RECORD_INVALID or simply omitted; no repair intervened. D-R26C-5/N-H7 (Opus debt) restates 25-09's closed-host wrong refusal code, despite mutating the relay instead of the upstream gate. These are not new catches merely because the mutations differ. Counting them anew would add a BOTH/COVERAGE decline row and an OPUS/MINOR closed-code row, with serious totals unchanged.
- Repaired commissioned items, held moment-only re-issuance, all other carried debts, bookkeeping, equivalent cases and unnamed spec-silent survivors are excluded. A2/A3/A4 are newly surviving post-repair boundary cases, following the earlier score's treatment of 25-04, rather than re-counts of the killed broad mutations. No supplied report establishes a new row with a contradictory required expected value.
- Origin disclosure: both Q2 sections explicitly reconstruct other reviewers' earlier mutations from report TEXT to verify the 14 repairs. Fable's Opus-derived H03/H02/C06/K05 are OPUS-ORIGIN repair rechecks, not independent discoveries; Astra-derived repairs are also borrowed inputs. Thus a literal ban on all use of others' mutation ideas was not met by those repair checks. Neither text shows a scored NEW finding borrowed from the other R26 reader: both call FN12/N-F2 their own, disclose own prior overlay infrastructure, and deny opening the other's R26 review/scratch. No FABLE-ORIGIN or OPUS-ORIGIN score adjustment is supported for the new findings. Textual disclosures do not independently prove blindness.
- Both readers miss serious cases under the same rubric, and both have unique catches. These reports do not establish replacement with no quality loss. This is a scoring conclusion, not a project or model-selection ruling.

Final scoped checks (existing supplied test modifications/input files are not my edits). Git was invoked by its bundled executable; bare git is not on PATH. The final commands below name every scored/read input and the output explicitly.
`git status --porcelain -- TRIAL-SCORE-R26.md trial-data/TRIAL-SCORE-R24-R25.md trial-data/R26-FABLE.md trial-data/R26-CLAUDE.md trial-data/L19.md rebuild/engine/native-load.cjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today/today-entry.mjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/m4/spec/native-load-options.test.cjs`
```text
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
 M rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs
 M rebuild/m4/spec/native-load-options.test.cjs
?? TRIAL-SCORE-R26.md
?? trial-data/L19.md
?? trial-data/R26-CLAUDE.md
?? trial-data/R26-FABLE.md
?? trial-data/TRIAL-SCORE-R24-R25.md
```
`git diff --stat -- TRIAL-SCORE-R26.md trial-data/TRIAL-SCORE-R24-R25.md trial-data/R26-FABLE.md trial-data/R26-CLAUDE.md trial-data/L19.md rebuild/engine/native-load.cjs rebuild/m3/w6/local/today-bindings.mjs rebuild/m3/w7-preview/today/today-entry.mjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/m4/spec/native-load-options.test.cjs`
```text
 .../today/test/native-load-panel.test.mjs          | 477 ++++++++++
 rebuild/m4/spec/native-load-options.test.cjs       | 975 +++++++++++++++++++++
 2 files changed, 1452 insertions(+)
```
