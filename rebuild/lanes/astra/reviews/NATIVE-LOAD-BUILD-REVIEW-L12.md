# Native Load Build Review L12
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM under DECISIONS:777-794; blind review, round 12; highest effort; engine tier
Head checked: 189d0767db31d44b0f9e53bbacacc9545cca8754
VERDICT: REJECT
Reject for one minimized genuine-consent counterexample (also present on dfc4445) and four regression-carrier gaps. The admitted load does not silently rise; the real counterexample loses a genuine baseline yes and its Undo.

Scope: dfc4445..189d076, build round 19, R9.10 at d3a3ffa, including section L; DECISIONS:795-808 resolve the two reported STOPs. R9.11 is outside this review.
Blind order: spec/rulings and code first; prior L1-L10 reviews next; author report and REVIEW INDEX last. L11 was not available on this branch.
All inputs and numbers below are invented. R1 = present producer; R2 = absent producer. P = C:/Users/joeym/AppData/Local/Temp/native-load-astra-l12-189d076.
Containment: public factories and positively selected callbacks/files only; unexpected filesystem and child-process access refused. Scratch copies and overlays only; one Node at a time under the owned runtime lock.
Measured baseline: FC12 191/191 selected PASS (192 registered; protected-loader GUARD not selected); FA03 44/44 PASS. Five independent edge checks also PASS, 196/196 with FC12.
Red comparison: the same 30 round-19 rows over dfc4445's four product files give 21 behavioral failures and 9 passes; reviewed head gives 30/30 passes. No row was weakened.

## 1. Restore and retire by record shape (B28)
PASS. R12-RESTORE, R13-RESTORE-SHAPE, R16-B28, R16-CANON-SHAPES, R6-B15c and R7-B18a/b executed.
An earn with a RESTORE-shaped target is refused target_load. An adoption's forged 95 restore is refused; its genuine 100 restore applies. RESTORE 100 replayed over unordered 102.5 restores 100, compensates the authority and keeps the tombstone; R1/R2 agree.
Yes, restoring an APPLIED adoption from every field of auth.prior is now the spec: R9.10 DERIVABLE and DECISIONS:795 separate shape validation from the write. An applied adoption's RETIRE-shaped Undo also restores prior; unapplied RETIRE writes no weight. The older review objection is superseded.
Independent RESTORE_COUNT: accepted 95 over prior 100 at three original slots, then sets=5; Undo target has three 100s, restores w=100 with wSets absent, keeps sets=5, next capture [100,100,100,100,100], no issue. Typed/v1 x R1/R2 all pass. Added fourth performed slot does not enlarge the original three-slot null restore.

## 2. Spend suffix and cancellation equality (B29)
BLOCKING L12-B5: a genuine baseline yes and its Undo are refused after an unordered base returns. This failure precedes exact-body cancellation re-evaluation; it does not establish that every-versus-some equality caused it. Provenance separately remains D-L12-ISSUANCE below. R16-B29: after C1/C2 yes and Undo, C3 is PROVISIONAL; only C3/C4 fund the next offer. No refunded sightings.
R16b-COMP-REPRICE and COMP-EVERY refuse the re-digested RESTORE copy at a reproducible present-revision cut: RECORD_INVALID issuance, w=102.5. The genuine RETIRE applies. Under absent revision the structurally valid RESTORE applies as written, restoring 100, as the spec requires.
The named R6/R7/R16 and FA03 duplicate/restart/base-return cases pass, but fresh seed 12035226 exposes their missing baseline-exit combination. The minimized case fails with or without the duplicate and under R1/R2; see L12-B5.
Premise P needs qualification: the programme/queue digests do NOT authenticate effect_frontier. FC03:623-640 checks those digests and fact-op coverage; :783-786 supplies the recorded basis, including its frontier, back to FC01. Equality therefore reproduces the claimed frontier, not proof of its origin.
Executed FRONTIER_ECHO_COPY: change only the genuine queued-earn Undo's first frontier response Ref to l12-absent-frontier-ref, leave plan/queue digests unchanged, re-digest the body and fold it as a synthetic local record. Output: cancelled=1, w=100, no issue. This disproves the stronger authenticity premise, not genuine-body reproducibility. No guarded host route to write that body was found.
The weaker reproducibility argument stands: the echoed request/basis, bound exercise/queue, and immutable original slot count determine this compensation body. Future external admission cannot rely on this argument as issuance proof.

## 3. Earliest-cut placement
PASS. R16b-CANON-CUT and R17c-B36 plus independent EARLY_CUT_EXIT, R1/R2: genuine Undo plus an empty-cut copy is refused RECORD_INVALID compensates, refs [fx-resp-2,fx-resp-9]; adoption stays at 105 and capture is the baseline ask.
That refusal follows earliest-cut placement: the cancellation precedes the live effect it must name. A new Undo cannot repair the same refused group and returns that hold's exact refs.
Executed exit (b), beyond just checking an offer: a later causally ordered baseline completion at 90, followed by its explicit yes, yields w=90, capture [90,90,90], zero active holds. The original invalid issue remains recorded and superseded. NO TRAP holds.

## 4. Missed debut and the adopt-baseline anchor (N29-N31, B30)
BLOCKING L12-B5 for a genuine other-hold baseline anchor that stops being classified as holding after a base return. The wrong-ref and missed-debut checks below still pass.
R9.10's ordinary missed debut is no longer a hold: accepted Q105, captured 105, performed 95 -> Q done/MISSED, prior w=100, no hold, optional adopt-observed 95; no unanswered adoption. N29/N30/N31, skipped sets, two Close orders and corrected landing rows passed.
Independent non-reproduced anchor probes replace the claim with the Start, an older Close, the non-holding earn yes, a set Ref, or an extra Ref: each R1/R2 output is RECORD_INVALID base_load, w=100, nothing adopted. The executed R17-ANCHOR-STRUCTURAL row also rejects another lift's yes and baseline claims naming the consumed Close or a non-holding yes. Claims come from FC03; FC01 does not invent them.
LATER_HOLD, typed/v1 x R1/R2: after correcting Q's evidence, the 95 yes stays spent/unapplied; its recorded Undo cancels it, restores 100, leaves Q pending/hidden and only BASIS_REPAIR_REQUIRED [fx-resp-1]. No RECORD_INVALID. This matches DECISIONS:807's resolution of STOP-R19-1.
Independent C3 checks pin the exact output: BASIS_REPAIR_REQUIRED [fx-resp-1], field null, no offer, for both slot types and revisions. The production C3 row currently pins only refusal/no offer; D-R19-C3-CODE remains the explicitly deferred round-20 pin.

## 5. No silent increase
PASS in executed admitted paths. FC12 consent cases and FA03's durable Finish/check/no-answer/decline/reopen/yes paths passed. Presenting an offer writes no response or adopted weight; accepted targets appear only after yes.
Independent FIT matrix: vectors [130,120,115], [80,85], [90,90] x card counts 1..5 -> exact prefix/last-entry repeat, 15/15; input unchanged. The values are existing accepted vector values, never a new rung.
FIT-STORED/PARITY/DEVICE and N29-VECTOR-LAYOUT: fitted vector debut at another layout is consumed MISSED, with original w/wSets intact; next capture uses the ordinary fitted vector. A new check refuses SET_COUNT_BASIS_UNPROVEN, not an earned/adopted increase. Restoring the count before Start restores ordinary landing eligibility.
READER rows preserve native history/load-tenure behavior and legacy scalar behavior. Independent explicit-zero, sparse-vector, original-versus-added-slot and scalar-debut mapping probes pass. No silent new increase was found. L12-B5 does lose an accepted Undo and retains stored 105 instead of its promised null prior; the invalid-record hold keeps that stored value off the card.

## 6. Mutants
Author round-19 suite rerun from copied public files: 39 compiled mutations, 36 behavioral kills, three LIVE. Revision/source-text checks were not counted as behavioral kills. The two walk-only variants fail at seeds 20267349 (restore count) and 20266433 (later-hold cancellation).
Independent: 12 single-clause mutations compiled; eight killed by existing FC12, four LIVE in all 191 existing rows and killed only by my added probes (L12-B1..B4). All five added checks pass on the unmutated head, 196/196 including FC12. These four are distinct observable inputs/results, not equivalent mutants. Historical host: R11-window-legacy-host killed by R17b-B33 (43/44 pass); R7-comp-reprice-host and R16b-comp-some-host each remain 44/44 green.
Three round-19 survivor judgments: M19-guard-drop-fc03 is redundant with FC01's earlier guard; M19-reader-plannow-old differs only beyond the vector length, already refused by both count guards; M19-lh-no-repair is redundant for genuine claimed misses: the original entry otherwise consumes at its Close, later earns occur later in fold order, and a moved-base hold refuses before this branch. Legacy blockage does not supply a pending native entry. No reachable distinguishing input found.
The two historical cancellation host survivors are host-equivalent only: the host retains the exact issuance and rechecks freshness; a caller cannot replace one cancellation body or inject a second differently shaped copy. FC03's direct forged-body rows kill both changes (R7 direct: 2/2 fail; R16b direct: 1/2 fails). This argument depends on the admission gate and does not extend to future import/sync.

## 7. Property walk
COMPLETED: R8 17000 seeds, 12024001..12041000, ALL mode; exactly one counterexample, seed 12035226, I2 proven cancellation lost. Successful-walk tally: sets edits=6749; undo-yes-restore=431; missed-consumed=423. The two-completion reduction reproduces on head and dfc4445 under R1/R2, with/without a duplicate. It is not a mutation and no oracle exemption was added.
The walk covers scalar set-count changes, corrections, forks, vector plans, legacy pending entries, revisions, two-device delivery and cancellations. It does not walk arbitrary fitted vector layouts; deterministic FIT rows cover those.

## 8. What is owed
Exact-head Windows/Linux CI, protected-path regressions and package acceptance are not supplied by a local source review. FC12 is explicitly carried by rebuild.yml:176-177; FA03 by :238. Both standalone capture test files lack an explicit workflow entry; their public-boundary round-19 behavior is exercised inside FC12, accepted by DECISIONS:808. The safe configuration-capture suite was also executed: head 10/11 pass; parent capture 9/11 pass. Its R9.10 row is red on the parent and green on head; both retain the same pre-existing error-code mismatch in the v1 numeric-only row (D-L12-CONFIG).
Progression is an edited S8 carrier and needs the PM's FG02 custody/successor work; current FC03 revision and FC16 must travel with the same seal. The author's broad 80-file run reported 67 common failures; it is not a green CI receipt and was not repeated here.
No deploy, merge, import, history port, external admission, account/model change or new copy approval occurred.

## BLOCKING items
L12-B5 BLOCKING - Genuine baseline exit and its recorded Undo are lost after a base return (FC03 correspondence, ADOPT-BASELINE anchor; native-load-effects.cjs:443). Unmutated input: base 100; C1 captures 100, performs 105; check offers adopt-observed 105 and y1 accepts. C2 (host v1) captures/performs 105 after y1. Replay with unordered base 102.5 holds y1 EFFECT_CONFLICT load_basis. The check on C2 genuinely offers adopt-baseline 105, authority_refs=[y1]; y2 accepts. Before further training its genuine Undo targets null on three original slots; that yes is recorded.
At base 102.5: w=null, y2 cancelled=true, RECORD_INVALID=[], baseline-ask card. Return only the base to 100: y1 applies again, y2 becomes RECORD_INVALID base_load, Undo becomes RECORD_INVALID compensates, y2 is absent from spent, cancelled=false, stored w=105. Card remains the baseline ask because of the new holds. Same outputs for R1/R2 and with/without a duplicate y2 on device B. P/hold-return.json and hold-return-prior.json are identical, proving it predates this range.
Cause: y2's genuine original hold Ref is checked against active holds of the new replay; y1 is no longer held, so S8 invalidates y2 before compensation can find its spend. This follows the literal active-hold test but contradicts original-cut consent retention and I2's permanent cancellation. PM must resolve that rule interaction and retain a failing regression; do not silence the walk with an exemption. The baseline and Undo were issued by checkOf, not fabricated.
L12-B1 BLOCKING - FIT-MALFORMED cannot detect skipped sparse suffix validation (FC12:3758; engine-capture.cjs:22). L12-M03 changes only Array.from(v).every to v.every. All 191 existing rows stay green. A sparse stored vector with first entry 100, length 3, card count 1 must refuse ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. The mutant captures [100] without refusal; L12-SPARSE catches it. The existing sparse case has two holes and three card slots, so the unchanged final guard always catches the hole even when the new full-vector guard is broken. Add the cropped-hole case to the persistent row.
L12-B2 BLOCKING - READER-IDENTITY/PARITY omit explicit zero (FC12:3914; progression.cjs:81). L12-M07 changes only the non-null entry test to truthiness. All 191 existing rows stay green. With w=100, wSets=[100,0], sets=3 and native actual [100,100,100], the correct reader says not-at-current-load; mutant says at-current-load. L12-ZERO catches this changed result. R9.10 preserves every in-range non-null value and permits zero; add this negative tenure case to the persistent matrix.
L12-B3 BLOCKING - RESTORE-COUNT never distinguishes original from added slots (FC12:3996; native-load.cjs:401). L12-M08 changes only originalSlots(entry).length to entry.slots.length. All 191 existing rows stay green. Input: baseline 60 accepted from three original sets plus one added set; later count 2. The genuine Undo must target [null,null,null], restore w=null and keep sets=2. Mutant targets four nulls and the accepted Undo is refused RECORD_INVALID target_load, leaving w=60 and sets=2; L12-ADDED catches it. Add an added-set fixture and assert both the offered vector and accepted Undo result.
L12-B4 BLOCKING - LATER-HOLD rows do not pin the kept spend record (FC12:4064-4107; native-load-effects.cjs:749). L12-M12 keeps the held yes but replaces its consumes with []. All 191 existing rows, including the configured property windows, stay green. Input: genuine missed-debut adoption of 95, then correct the earlier earned basis so that yes is held back. Its record consumes [C3]; unmutated Fold.spent and Fold.coverage both retain [C3], mutant returns [] in both. This violates the canonical context.spent/Fold.spent transport contract (spec :123) and LATER HOLD conservation. L12-CONSUMES kills it. Add the conserved completion root to the persistent assertions; equal load/issue outputs alone do not prove this field.

## NAMED DEBTS
D-L12-ISSUANCE: Keep external native-record import/sync refused until verified issuance or equivalent complete historical proof is accepted; exact-body replay and cut digests do not authenticate effect_frontier or candidate origin.
D-R19-C3-CODE: In round 20 pin N29-LATER-HOLD-C3 to BASIS_REPAIR_REQUIRED [Q105 response Ref], field null, for typed v2 and host v1 under R1/R2, as DECISIONS:807 requires.
D-L12-CUSTODY: PM must carry progression as an edited carrier in FG02 and complete successor pins/receipts with FC03, FC16 and both runtimes at one accepted seal.
D-L12-CI: Exact-head Windows/Linux CI and protected engine/capture regressions remain owed; the author's 67 common broad-suite failures are not independently cleared here.
D-L12-CONFIG: configuration-capture.test.cjs v1 numeric-only expects WORKOUT_CAPTURE_INVALID but receives ENGINE_CAPTURE_PROFILE_INVALID on both parent and head; the shared failure remains a named pre-existing test debt.
D-L12-OWNER: Live deploy, private import/history port, lowering the external-admission guard and unapproved copy require owner rulings; physical-phone crash/reopen and live-slice behavior are unverified.

## Mutation table
| Mutation | Measured result / witness |
|---|---|
| M19-fit-fill-cardw | KILL: FIT-ORDINARY-UP |
| M19-fit-fill-null | KILL: FIT-ORDINARY-UP |
| M19-fit-fill-0 | KILL: FIT-ORDINARY-UP |
| M19-fit-fill-first | KILL: FIT-ORDINARY-UP |
| M19-fit-slice-end | KILL: FIT-ORDINARY-DOWN |
| M19-fit-debut-only | KILL: FIT-ORDINARY-UP |
| M19-fit-ordinary-only | KILL: FIT-DEBUT-UP and FIT-DEBUT-DOWN |
| M19-fit-validate-part | KILL: FIT-MALFORMED |
| M19-fit-write-back | KILL: FIT-ORDINARY-UP |
| M19-land-fitted | KILL: FIT-STORED |
| M19-miss-pending | KILL: FIT-STORED |
| M19-selected-exact-close | KILL: FIT-STORED |
| M19-selected-exact-fc01 | KILL: FIT-STORED |
| M19-captured-after-exact | KILL: FIT-UNDO |
| M19-guard-drop | KILL: FIT-STORED |
| M19-guard-drop-fc01 | KILL: FIT-GUARD |
| M19-guard-drop-fc03 | LIVE; equivalence argument in Q6 |
| M19-guard-after | KILL: FIT-GUARD |
| M19-consume-early | KILL: FIT-DEBUT-UP and FIT-DEBUT-DOWN |
| M19-reader-E-old | KILL: READER-UP |
| M19-reader-fc01-old | KILL: READER-PARITY |
| M19-reader-projectbase-old | KILL: READER-PARITY |
| M19-reader-plannow-old | LIVE; equivalence argument in Q6 |
| M19-reader-first | KILL: READER-UP |
| M19-reader-zero | KILL: READER-UP |
| M19-reader-last-nonnull | KILL: READER-IDENTITY |
| M19-reader-legacy | KILL: READER-IDENTITY |
| M19-reader-below | KILL: N11 VECTOR-PREFIX |
| M19-restore-current | KILL: RESTORE-COUNT |
| M19-restore-current-prop | KILL: R8-PROPERTY MODEL WITH ORACLE |
| M19-restore-n0-sets | KILL: RESTORE-COUNT |
| M19-restore-write-sets | KILL: RESTORE-COUNT |
| M19-restore-scalar-only | KILL: RESTORE-FORGED |
| M19-lh-none | KILL: N29-LATER-HOLD |
| M19-lh-none-prop | KILL: R8-PROPERTY MODEL WITH ORACLE |
| M19-lh-every-tq | KILL: LATER-HOLD-SCOPE |
| M19-lh-apply | KILL: N29-LATER-HOLD |
| M19-lh-no-repair | LIVE; equivalence argument in Q6 |
| M19-lh-hold | KILL: N29-LATER-HOLD-UNDO |
| L12-M01 debut reads ordinary vector | KILL: FIT-DEBUT-UP and FIT-DEBUT-DOWN |
| L12-M02 drop scalar mapping guard | KILL: FIT-MALFORMED |
| L12-M03 skip sparse whole-vector validation | LIVE in existing FC12; KILL independent L12-SPARSE FIT |
| L12-M04 reverse selected target | KILL: N29-VECTOR |
| L12-M05 land an expanded vector | KILL: FIT-STORED |
| L12-M06 allow reduced vector count | KILL: N29-VECTOR-LAYOUT-R9.10 |
| L12-M07 zero treated as missing | LIVE in existing FC12; KILL independent L12-ZERO READER |
| L12-M08 count added slots in Undo | LIVE in existing FC12; KILL independent L12-ADDED RESTORE |
| L12-M09 null restore at current count | KILL: RESTORE-COUNT-BASELINE |
| L12-M10 wrong later-hold kind | KILL: N29-LATER-HOLD |
| L12-M11 invert claim presence | KILL: N29-LATER-HOLD |
| L12-M12 erase held consumes | LIVE in existing FC12; KILL independent L12-CONSUMES |
| R11-window-legacy-host | KILL: R17b-B33; host 43 pass, 1 behavioral failure |
| R7-comp-reprice-host | LIVE: host 44/44; guarded-host equivalence only |
| R16b-comp-some-host | LIVE: host 44/44; guarded-host equivalence only |

## What I did not verify
No protected engine module or private/legacy source was loaded. The protected-loader GUARD row and standalone engine-capture suite were not run locally; engine-capture's Source.baseline dependency reaches the prohibited engine graph. Configuration-capture was inspected separately, found safe and run as stated above. No whole engine/today directory or receipt-writing suite ran.
No independent Fable verdict, exact-head remote CI, full seal/package acceptance, real phone/browser themes or production deployment was verified. The older 221-mutant inventory is outside dfc4445..189d076 and was not rerun; the requested three historical host survivors are separately measured.
Reproduce in P with the required Node path and MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York: harness.cjs baseline, prior, own-checks, mutate-author, mutate-own, mutate-historical, walk, hold-return, hold-return-prior, or observe (ASTRA_MUTANT_ID selects one L12 mutant; unset is the control). host-run.mjs takes the named host mutation JSON, or no argument for its control. Hold the shared runtime lock and run one Node at a time.
Scratch JSON files contain executed synthetic outputs and failure details; harness.cjs, own-checks.js, probes.js, own-mutants.cjs, hold-return.js, observations.js, capture-run.mjs and host-run.mjs preserve the selected callbacks, exact mutations and guards. Only this new review file is written in the worktree.
Final scoped status/diff (the final two shell commands; diff produced no output):
```text
git status --porcelain -- rebuild/engine/native-load.cjs rebuild/engine/progression.cjs rebuild/m4/workout/engine-capture.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/m4/workout/test/engine-capture.test.cjs rebuild/m4/workout/test/configuration-capture.test.cjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L12.md
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L12.md
git diff --stat -- rebuild/engine/native-load.cjs rebuild/engine/progression.cjs rebuild/m4/workout/engine-capture.cjs rebuild/m4/workout/native-load-effects.cjs rebuild/m4/spec/native-load-options.test.cjs rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs rebuild/m4/workout/test/engine-capture.test.cjs rebuild/m4/workout/test/configuration-capture.test.cjs rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L12.md
```
