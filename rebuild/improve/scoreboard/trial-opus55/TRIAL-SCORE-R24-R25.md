# NATIVE-LOAD model trial score: rounds 24 and 25

Scorer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; neutral cross-family scorer

Evidence: the six supplied trial-data reports; selected static product reads only. No tests run; reported executions were not independently reproduced. Spec references below are the reports' R9.13 references (the spec file is absent here). No project acceptance or model-substitution decision is made.
Scoring unit: one clause plus one defect, not one report heading or mutant. Classes are the readers' own blocker/debt decisions, not this severity rubric. A debt counts as a catch. '-' means no qualifying finding, not proof the reader never considered the clause.
Severity concerns the counterexample's consequence, not a claim the unchanged head has that defect. SERIOUS includes wrong or omitted required stored load vectors, wrong shown/adopted loads, and rows accepting their own claimed wrong outcome. COVERAGE covers missing specified refusals/metadata/recovery assertions with correct head behavior; MINOR covers other real concerns. Merely passing a suite on an untested input is not by itself a wrong-row finding; otherwise COVERAGE would have no meaning. This rubric boundary is discussed below.
FABLE-ORIGIN is a separate exclusive bucket: both reports identify the defect, but Opus used the earlier cut-off Fable scratch mutant. It earns no independent Opus credit. Serious misses mean absent detection in the union of qualifying Claude findings and Astra extras; downgraded debts are listed separately.

## Round 24

| id | clause | defect in one line | caught by | Fable class | Opus class | severity | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 24-01 | (v), FC03:270 | Null-w lift with stored array wrongly keeps legacy entry and refuses day. | BOTH | blocker | blocker | COVERAGE | B-R24F-1(a)/fx05 = B-R24-O-3/C05; same excluded array input and hide outcome despite different predicates; import reachability not proved. |
| 24-02 | (v), FC03:271 | Legacy entry carrying newWSets over null w wrongly remains visible and refuses day. | FABLE-ORIGIN | blocker | blocker | COVERAGE | B-R24F-1(b) = B-R24-O-2, both a34 from earlier Fable; separate from 24-01's lift-side condition. |
| 24-03 | (v), legacy PROPOSED, :81 | Hiding PROPOSED on numeric w lets a refused two-entry day prescribe a load. | FABLE | blocker | - | SERIOUS | B-R24F-2/fx06; merge lone-entry and pair witnesses: same hide predicate; pair establishes wrong prescription. |
| 24-04 | B/:127, FC01:222 | Truthy nonboolean done wrongly blocks the check as LEGACY_PENDING. | FABLE | blocker | - | COVERAGE | B-R24F-3/fx07b; observed refusal replaces PROVISIONAL; no wrong load demonstrated. |
| 24-05 | (iv) conversion invariant | Equal target skips required stored vector despite unchanged current card. | FABLE | debt | - | SERIOUS | D-R24-F-1/fx01 = L17-B3/M07; omitted required newWSets; severity boundary noted below. |
| 24-06 | (iv) numeric target definition | Numeric-string target is coerced into a stored newWSets vector. | FABLE | debt | - | SERIOUS | D-R24-F-2/fx15; writes a load vector where numeric-type contract requires no conversion; import-only input. |
| 24-07 | :96-97/:123/:154/:158 | Host reports an undone spend as uncancelled. | BOTH | debt | blocker | COVERAGE | D-R24-F-3/fx08 = B-R24-O-4/C07 = L17-B4/M11; same cancelled flag; no changed panel load demonstrated. |
| 24-08 | :123/:154/:158 spent index | Host drops cancelled spend entirely instead of retaining its tombstone. | FABLE | debt | - | COVERAGE | D-R24-F-3/fx14; distinct from wrong flag on a retained entry; Opus C07 did not identify this deletion defect. |
| 24-09 | :97/:161 Fold.issues | Host omits superseded hold issues and their superseded_by mark. | FABLE | debt | - | COVERAGE | D-R24-F-3/fx09; separate issues output, not a cancelled-spend duplicate. |
| 24-10 | :157 host admission gate | Empty sourceImports incorrectly refuses the host projection. | FABLE | debt | - | COVERAGE | D-R24-F-4/fx11; durable empty-collection reachability not shown. |
| 24-11 | :159 held projection | Head also hides finished native entries, potentially preventing MISSED judgement. | FABLE | debt | - | MINOR | D-R24-F-5/fx12; conditional product/spec discrepancy, not an established wrong load; ruling needed. |
| 24-12 | (v) finished history | Done legacy entry outside ESTABLISH is incorrectly removed. | FABLE-ORIGIN | debt | blocker | COVERAGE | D-R24-F-6 = B-R24-O-1/a30 from earlier Fable; same done/state defect; card unchanged. |
| 24-13 | B/:127, FC01:223 | Empty-but-truthy reclaim branch is wrongly treated as inactive. | OPUS | - | debt | COVERAGE | D-R24-O-1/C15; check refusal changes; reachability not shown; ladder/pendingThird are head examples, not extra mutants. |
| 24-14 | (iv) exact shift expression | Reassociated non-dyadic arithmetic changes stored and captured load by an ulp. | OPUS | - | debt | SERIOUS | D-R24-O-2/C03 and x3 non-dyadic variant: same exact-shift defect; own C03 supports independent credit; reachability unproved. |
| 24-15 | :97 fresh source basis, TB:648 | Missing revision-mismatch guard admits a mixed-revision project read. | OPUS | - | debt | COVERAGE | D-R24-O-3/C13; live overlay, race witness not executed; no wrong load shown. |
| 24-16 | :157 FC03 admission gate | Native-only gate row may allow an import the literal gate wording forbids. | OPUS | - | debt | MINOR | D-R24-O-4; retain substantive scope/row objection only, not its inaccurate-comment complaint; spec interpretation unsettled. |

### Astra-extra table (L17)

| id | clause | defect in one line | caught by | Fable class | Opus class | severity | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 24-A1 | (iv) finite base | Excluding negative finite w omits the required stored vector and refuses capture. | ASTRA | - | - | SERIOUS | L17-B1/M01; independent negative-base condition, not per-element lower-bound debt. |
| 24-A2 | (iv) full stored length | Conversion truncates stored vector; later higher set count gets wrong final load. | ASTRA | - | - | SERIOUS | L17-B2/M06; not Fable fx02's vector-length eligibility predicate, which was killed. |
| 24-A3 | :97/:169 detached host | Closed host plus closed installation throws instead of refusing its old handle. | ASTRA | - | - | COVERAGE | L17-B5/M12; no accepted write or wrong load shown. |
| 24-A4 | :60/:148/:172 exact issuance | Digest-collision retry reports a different offered load already saved. | ASTRA | - | - | SERIOUS | L17-B6/S24-H08; both Claude reads called H08 spec-silent, not a finding; forced collision, not a discovered hash collision. |

Totals R24: 16 Claude findings = FABLE only 8, OPUS only 4, BOTH 2, FABLE-ORIGIN 2. Astra extras 4 (3 SERIOUS, 1 COVERAGE); L17-B3/B4 merge into 24-05/07. Union 20 = SERIOUS 7, COVERAGE 11, MINOR 2. Serious detection misses: Fable 4 (24-14, A1, A2, A4); Opus 6 (24-03, 05, 06, A1, A2, A4). Serious caught but called debt: Fable 24-05/06; Opus 24-14. FABLE-ORIGIN is excluded from BOTH and OPUS-only, not silently counted twice.

## Round 25

| id | clause | defect in one line | caught by | Fable class | Opus class | severity | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 25-01 | (v)/B/:127, FC01:544 | Truthy-done history blocks transition, leaving accepted load unapplied. | BOTH | debt | blocker | SERIOUS | D-R25F-1(a)/fy01 = B-R25C-4/K05; same transition predicate; distinct from R24 evaluation reader. |
| 25-02 | :159, FC03:255 | Held projection wrongly hides truthy-nonboolean done legacy history. | FABLE | debt | - | COVERAGE | D-R25F-1(b)/fy10; card unchanged; separate held reader from 25-01 and 24-12. |
| 25-03 | (v), FC03:270 | Present-null wSets exempts an unheld null-w lift from hiding and refuses day. | FABLE | debt | - | COVERAGE | D-R25F-1(c)/fy21; new null input hole after array row; same import-class caveat as 24-01. |
| 25-04 | :149/:172 exact issuance | Body-only or moment-ignoring retry accepts a different issuance moment. | BOTH | debt | debt | COVERAGE | D-R25F-3/fy22/fy23 = D-R25C-5/H10; same moment-only counterexample; scope interpretation uncertain. |
| 25-05 | (iv) element upper bound | abs(w) bound admits out-of-P negative-base vector, storing a load above target. | FABLE | debt | - | SERIOUS | D-R25F-4(b)/fy14; not L18 fractional/zero/negative-target eligibility defects. |
| 25-06 | :169/:188, TB:710 | Wrong proposal ID with genuine handle still writes and adopts the load. | BOTH | debt | blocker | SERIOUS | D-R25F-5/fy04 = B-R25C-2/H02 = L18-B5/M12; same scope guard. |
| 25-07 | :170 host decline | Decline loses dismissed:true and instead reports RECORD_INVALID. | FABLE | debt | - | COVERAGE | D-R25F-5/fy05; no writes and same panel outcome; separate answer value from 25-12. |
| 25-08 | :172 lost acknowledgement | Late log recovery is omitted after a durable write loses its acknowledgement. | BOTH | debt | debt | COVERAGE | D-R25F-5/fy18 = D-R25C-2/H05; same late lookup, not earlier interleaved-project debt; no executed fault witness. |
| 25-09 | :97/:170/:188, TB:641 | After close, project/check refuse with a different error code. | OPUS | - (equivalent) | debt | MINOR | D-R25C-1/H01; Fable fy06 measured same behavior but named no debt; both fail closed, code requirement uncertain. |
| 25-10 | :172 found AND folded | Saved-response lookup can omit proof that its spend was folded. | OPUS | - (spec-silent) | debt | COVERAGE | D-R25C-3/H04; Fable fy15 explicitly not a debt; new precise clause, unlike carried rejected-op selection H05; guarded-host witness absent. |
| 25-11 | :157 registrar gate, TB:528 | Registrar fails to refuse a non-ready fold and could register empty state. | OPUS | - | debt | COVERAGE | D-R25C-4/H08; different gate from project(); proposed counterexample not executed, so wrong-load consequence unproved. |
| 25-12 | :60/:97/:170, TB:707 | Absent or invalid answer can act as accept and adopt a load. | OPUS | - | blocker | SERIOUS | B-R25C-1/H03 = L18-B8/M16; omitted guard and absent-answer default share explicit-accept invariant and absent-answer defect. |
| 25-13 | :207 technique basis | Changed forks do not hold an accepted effect, allowing its prescription on a changed basis. | OPUS | - | blocker | SERIOUS | B-R25C-3/C06; w-only test survives removed technique guard; wrong prescription authority, not necessarily changed numeric queue value. |

### Astra-extra table (L18)

| id | clause | defect in one line | caught by | Fable class | Opus class | severity | note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 25-A1 | (iv) finite target | Negative finite target omits required stored load vector. | ASTRA | - | - | SERIOUS | L18-B1/M01; both current cards refuse, but required stored vector is missing; severity boundary below. |
| 25-A2 | (iv) finite base | Zero base omits required stored vector and wrongly refuses capture. | ASTRA | - | - | SERIOUS | L18-B2/M02; not negative upper-bound 25-05. |
| 25-A3 | :97/:110-111/:154 | Undo displays target null instead of zero while storing zero. | ASTRA | - | - | SERIOUS | L18-B3/M08; target display mapping. |
| 25-A4 | :97/:110 | Offer displays current null instead of numeric zero. | ASTRA | - | - | SERIOUS | L18-B4/M09; base display mapping, distinct from target. |
| 25-A5 | (iv) finite base | Fractional base omits required vector and wrongly refuses capture. | ASTRA | - | - | SERIOUS | L18-B6/M13; integer-only eligibility differs from R24 floating-operation order. |
| 25-A6 | :139 displayed issuance | Host omits displayed reason while persisting and accepting that reason. | ASTRA | - | - | COVERAGE | L18-B7/M15; substantive consent explanation, not style; no wrong numeric load shown. |
| 25-A7 | :110/:139 ordered base | Host reverses nonuniform displayed current loads. | ASTRA | - | - | SERIOUS | L18-B9/M17; current-vector order. |
| 25-A8 | :111/:139/:149 ordered target | Displayed target order differs from the target durably accepted. | ASTRA | - | - | SERIOUS | L18-B10/M18; target-vector order, distinct consent defect from 25-A7. |

Totals R25: 13 Claude findings = FABLE only 4, OPUS only 5, BOTH 4, FABLE-ORIGIN 0. Astra extras 8 (7 SERIOUS, 1 COVERAGE); L18-B5/B8 merge into 25-06/12. Union 21 = SERIOUS 12, COVERAGE 8, MINOR 1. Serious detection misses: Fable 9 (25-12/13 and seven serious extras); Opus 8 (25-05 and seven serious extras). Serious caught but called debt: Fable 25-01/05/06; Opus none.

## Judgement calls

- All duplicate merges and bundle splits are identified in the row notes. R24 Fable B1 splits into lift-wSets and entry-newWSets predicates; D-F3 splits cancelled flag, tombstone retention and superseded issues. R25 F1 splits three predicates; F5 splits scope, decline and late recovery. Sharing a heading, file or broad invariant is insufficient to merge different defects.
- 24-01's two predicates differ outside the reported array input; I merge their identical clause violation on that input. 24-14 merges reassociation and non-dyadic clamp only for the same exact-expression/load-rounding defect; Fable explicitly called x3 equivalent, so it receives no finding credit. Opus's own C03 prevents this from being only borrowed credit.
- 24-07 versus 24-08 is a close granularity choice: falsely marking a retained tombstone and deleting it both impair cancellation fidelity, but their required outputs differ. Opus caught the first, not the second. Merging would lower Fable-only and total R24 findings by one, without changing serious misses.
- SERIOUS for 24-05 and 25-A1 is uncertain at the rubric boundary: the required stored load vector is absent, but no wrong current card was demonstrated. I include stored omissions under 'wrong stored load'. If these two are instead COVERAGE: R24 serious union becomes 6 and Opus misses 5 (Fable still 4); R25 serious union becomes 11, Fable misses 8, Opus misses 7. Other omitted-vector cases also lose an otherwise valid capture; their storage defect remains the scored consequence.
- Wrong refusals alone are COVERAGE (24-01/02/04/10/13, 25-02/03), not invented numeric-load failures. Wrong acceptance on a changed technique basis (25-13) is SERIOUS even if the queue number remains the same: the prescription should be unavailable. 25-A6 is COVERAGE for a missing specified explanation; no changed load was shown. These are severity choices, not endorsements of shipping the gaps.
- The rubric's 'row would pass for a wrong product' overlaps 'specified outcome with no row ... product correct'. I apply the former to demonstrated false assurance on a row's claimed outcome, not every absent input in a green suite. All three readers describe correct head products and missing cases; no supplied report establishes a new contradictory expected-value row. A broader interpretation would promote many COVERAGE rows; the table preserves their counterexamples for rescoring.
- 24-11 and 24-16 remain MINOR, provisional real concerns: their named debts assert possible substantive product/row discrepancies, but neither establishes a violated unambiguous outcome. I do not convert ambiguous wording into a proved serious defect. 25-09 is also provisional: :170/:188 may govern respond rather than project/check, and both observed outputs refuse.
- 25-04 is a new surviving moment-only subcase after R25's body-difference repair, not another count of the repaired full-comparison omission. It was already mentioned in L17; Opus calls its requirement ambiguous. I count the newly named post-repair coverage debt once, with no wrong-load claim. Excluding it as restated would reduce BOTH and R25 totals by one only.
- 25-10 and 25-11 assert live omitted guards, so qualify as named debts, but their guarded-host counterexamples were not executed. 25-08 likewise lacks a lost-ack execution. COVERAGE is provisional; no wrong stored/shown load is inferred. Fable's explicit 'not a debt' treatment of fy15 is not counted as a qualifying catch under the requested method; raw awareness is visible in the row.
- Excluded: old repaired findings and carried debts; spec-silent/equivalent mutants not named as substantive findings; R24 Opus D-O5's ruling-list bookkeeping; R25 Fable D-F2's future-flip/title wording; D-F4(a)/fy03's deterministic-row preference (the existing walk kills it, so the specified outcome has a failing row). L17's eighteen D-S24 domain/API caveats were already discussed by both Claude reads and are not extra catches. L18 D-M11 has no admitted nonboolean-native witness and fails a pin; T11/T14 are old domain/diagnostic debts, not extras.
- Catch totals do not validate blindness. R24 a30/a34 are contaminated for independent Opus credit as instructed; no comparable R25 contamination is established by these files. The reports' different search coverage, import-reachability standards and classification thresholds limit any model comparison. Two rounds with serious misses by both and disputed severity boundaries do not establish replacement with no quality loss.
