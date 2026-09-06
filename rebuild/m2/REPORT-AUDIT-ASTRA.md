# M2 post-extraction audit — ASTRA

## 1. What and why

Audit-only branch rebuild/m2-audit-register from rebuild/t2-client-core **ef83543aa825fb581671951d287854166717ad28** (module-7 merge **eeb4935**). The accepted extraction preserved D1–D45; this PR makes every preserved behavior an executable red-first proposal and supplies the technical half of the owner's ruling pack. It does not close M2, approve a training rule, fix the product or change suite v3.

Files: AUDIT-REGISTER.md; 13 theme law files under rebuild/conform/v4/; helpers.cjs; run-defect-laws.cjs; live-predicates.cjs; run-live-checks.cjs; this single builder report. Laws use the existing id/cite/expect/run/mutants shape, with defect/theme/family metadata and a test-only control. They are not wired into run.cjs or its manifest.

## 2. Executed law runner — full output

Command: node rebuild/conform/v4/run-defect-laws.cjs. ENGINE_MAIN may select the locally built frozen bundle; default is rebuild/conform/engines/engine-main.cjs. Candidate calls the actual rebuild/engine factory. The runner fixes America/New_York, creates a fresh engine for each case, and fails closed for a missing/duplicate law, a GREEN unchanged engine, a failing repair control, a surviving mutant or an unexpected exception. It also requires identical frozen/candidate snapshots of every directly invoked function's inputs, return value, caught exception and post-call inputs. Traces stay in memory.

```text
D1 P-D1-first-targets-fit-current-set-count · RED-frozen / RED-candidate / mutant-DETECTED
D2 E-D2-invalid-set-count-stays-quarantined · RED-frozen / RED-candidate / mutant-DETECTED
D3 P-D3-volume-receipt-belongs-to-whole-lift-name · RED-frozen / RED-candidate / mutant-DETECTED
D4 P-D4-other-lift-earn-cannot-spend-sightings · RED-frozen / RED-candidate / mutant-DETECTED
D5 P-D5-ladder-minimum-counts-distinct-rungs · RED-frozen / RED-candidate / mutant-DETECTED
D6 P-D6-deload-preserves-absent-load · RED-frozen / RED-candidate / mutant-DETECTED
D7 P-D7-anchor-and-trend-exclude-future-sessions · RED-frozen / RED-candidate / mutant-DETECTED
D8 D-D8-stale-sleep-does-not-claim-current-debt · RED-frozen / RED-candidate / mutant-DETECTED
D9 E-D9-split-selects-latest-effective-date · RED-frozen / RED-candidate / mutant-DETECTED
D10 E-D10-calendar-week-is-seven-calendar-dates · RED-frozen / RED-candidate / mutant-DETECTED
D11 E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted · RED-frozen / RED-candidate / mutant-DETECTED
D12 E-D12-step-slope-keeps-per-thousand-units · RED-frozen / RED-candidate / mutant-DETECTED
D13 E-D13-energy-density-cache-tracks-relevant-state · RED-frozen / RED-candidate / mutant-DETECTED
D14 E-D14-current-rate-uses-missing-drip-default · RED-frozen / RED-candidate / mutant-DETECTED
D15 E-D15-session-frequency-does-not-change-with-food-row-density · RED-frozen / RED-candidate / mutant-DETECTED
D16 E-D16-seven-day-forecast-does-not-grade-a-month-late-read · RED-frozen / RED-candidate / mutant-DETECTED
D17 E-D17-undone-adjustment-is-not-described-as-applied · RED-frozen / RED-candidate / mutant-DETECTED
D18 P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix · RED-frozen / RED-candidate / mutant-DETECTED
D19 P-D19-inclusive-break-end-prose-agrees-with-active-day · RED-frozen / RED-candidate / mutant-DETECTED
D20 E-D20-forecast-refreshes-after-an-observed-rate-change · RED-frozen / RED-candidate / mutant-DETECTED
D21 E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date · RED-frozen / RED-candidate / mutant-DETECTED
D22 E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash · RED-frozen / RED-candidate / mutant-DETECTED
D23 E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day · RED-frozen / RED-candidate / mutant-DETECTED
D24 E-D24-partial-yesterday-remains-owed-until-calories-are-present · RED-frozen / RED-candidate / mutant-DETECTED
D25 E-D25-zero-protein-successes-cannot-be-a-good-protein-read · RED-frozen / RED-candidate / mutant-DETECTED
D26 E-D26-today-model-refreshes-when-the-calendar-day-changes · RED-frozen / RED-candidate / mutant-DETECTED
D27 P-D27-maintenance-is-not-described-as-a-long-stalled-cut · RED-frozen / RED-candidate / mutant-DETECTED
D28 E-D28-programme-volume-follows-the-current-effective-split · RED-frozen / RED-candidate / mutant-DETECTED
D29 P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit · RED-frozen / RED-candidate / mutant-DETECTED
D30 P-D30-first-set-trend-respects-the-recorded-technique-era · RED-frozen / RED-candidate / mutant-DETECTED
D31 V4-volume-tolerance-post-change · RED-frozen / RED-candidate / mutant-DETECTED
D32 V4-volume-replication-same-era · RED-frozen / RED-candidate / mutant-DETECTED
D33 V4-guard-record-identities-and-sets · RED-frozen / RED-candidate / mutant-DETECTED
D34 V4-pristine-compares-record-content · RED-frozen / RED-candidate / mutant-DETECTED
D35 V4-unknown-schema-return-untouched · RED-frozen / RED-candidate / mutant-DETECTED
D36 V4-curl-receipt-prices-actual-vector · RED-frozen / RED-candidate / mutant-DETECTED
D37 V4-merge-earned-receipt-historical-asof · RED-frozen / RED-candidate / mutant-DETECTED
D38 V4-merge-preserves-written-trial-decisions · RED-frozen / RED-candidate / mutant-DETECTED
D39 V4-merge-preserves-offer-dismissal · RED-frozen / RED-candidate / mutant-DETECTED
D40 V4-daily-conflict-direction-independent · RED-frozen / RED-candidate / mutant-DETECTED
D41 V4-load-writes-advance-per-set-vector · RED-frozen / RED-candidate / mutant-DETECTED
D42 V4-break-undo-restores-scale-effect · RED-frozen / RED-candidate / mutant-DETECTED
D43 V4-owned-session-retains-entered-load · RED-frozen / RED-candidate / mutant-DETECTED
D44 V4-volume-receipt-requires-actual-change · RED-frozen / RED-candidate / mutant-DETECTED
D45 V4-analyst-effort-rule-matches-writer · RED-frozen / RED-candidate / mutant-DETECTED
TOTAL 45 laws · 45 RED-frozen · 45 RED-candidate · 90 GREEN repair controls · 104/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST PASS
```

No law was silently removed or relabeled as an already-fixed defect. All 45 are RED on both engines today. The D2 RangeError and D22 specific array-method TypeError are explicit observed failure modes; unrelated exceptions are HARNESS_ERROR, never successful detection. The 52 named mutants run on each engine's GREEN repair control (104 executions).

## 3. Preparation and unchanged gates

- Built engine-main from fe516c1 and engine-old from a0009c3 with exact Git source bytes and the installed esbuild. The prescribed build-engines.mjs command was attempted; its POSIX URL handling fails on Windows, as already recorded by M2-1. An ignored local preparation script uses ordinary Windows paths and copies only pinned source dependencies into ignored build directories; no frozen script was edited.
- Regenerated private/live.json directly from the pinned Git blob. Ran the actual golden command in an ignored oracle mirror. Both public goldens match committed goldenSha256 after engineSha256 normalization; the regenerated private golden matches its committed goldenSha256 after the same normalization. The committed public goldens and manifest were never changed. PRIVATE GOLDEN PIN PASS.
- With MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York: **SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families** (exit 0).
- Same environment, node run.cjs --selftest: **SELFTEST PASS** (exit 0).
- Strict: PASS — node scripts/check.mjs --strict with MEASURED_TEST_NOW/PL_ENGINE/PL_LAWS_LIB unset.
- The initial strict attempt hit the Windows sandbox directory restriction; its approved retry inherited the wrong conformance clock and failed historical engine checks. The final strict invocation uses the frozen app's default clock, as REPORT-M2-7 requires. No baseline was regenerated to resolve this.

The accepted module-7 second-gate result remains the extraction evidence; this audit does not claim a new full candidate second-gate run. Product and frozen-suite paths are byte-unchanged on this branch.

## 4. LIVE execution and limits

Command: node rebuild/conform/v4/run-live-checks.cjs --today 2026-09-06. This is a separate opt-in local command, never imported by the synthetic law runner. It checks the private blob's committed hash, gives each predicate a fresh clone and engine, validates an allowlist of verdict strings, suppresses error details, and verifies the file hash remains unchanged. Two complete executions agreed. Only the allowed verdicts are copied into the table.

These are snapshot predicates, not proofs of what an athlete saw on a device. Historical bad rows can still trigger a reader today. Current-day predicates use the audit clock; cache history and absent replica/write inputs cannot be recovered from one saved blob. D41 detects the current scalar/vector symptom but does not attribute its writer. D43 excludes correction-stamped or unattributable mismatches. D45 tests internally generated analyst context; it does not call an analyst service or claim an athlete-facing response.

NOT APPLICABLE prerequisites:

- D13: NOT APPLICABLE (needs a write between two cached reads of the same object)
- D20: NOT APPLICABLE (needs an earlier cached read followed by a write to the same in-memory state)
- D26: NOT APPLICABLE (needs a cached Today read before a calendar rollover)
- D33: NOT APPLICABLE (needs a proposed write that removes a set or replaces a read day)
- D35: NOT APPLICABLE (needs a newer-schema import)
- D36: NOT APPLICABLE (needs the pre-v60 migration input)
- D37: NOT APPLICABLE (needs two replicas merged at different clocks)
- D38: NOT APPLICABLE (needs a merge of a written trial decision with another replica)
- D39: NOT APPLICABLE (needs a dismissed offer and its stale replica)
- D40: NOT APPLICABLE (needs two replicas with conflicting same-day entries)
- D42: NOT APPLICABLE (needs a break approval and undo sequence to attribute the remaining seal)
- D44: NOT APPLICABLE (needs accepting a one-set removal offer)

## 5. Seams and independent execution review

Frozen public exports omit diagnostic helpers. helpers.cjs verifies the fe516c1 src/app.jsx Git-blob SHA, then compiles only exact declarations at 305–311 (date primitives), 1003–1005 (maxedOut), 1858 (_bornValid), 2824/2835 (drip default), 4779–4797 (uncached energy density) and 6994–6996 (nightsBefore). Their dependencies come from the same frozen bundle; no extracted implementation supplies frozen expected behavior. Existing writers-reference.cjs wraps the frozen bundle with a deterministic clock/ID source and has its existing exact-source supplement for three unexported suggestion writers; those three are not invoked by these laws.

D12 replaces only the fresh engine instance's authored rollup array with empty synthetic history; D34 replaces its seed containers with wholly invented records before testing pristine and changed states. No committed law loads any fixture, private blob, golden or preimage. Reader probes use invented states; writer-shaped seams use actual writers, as itemized below. Controls patch an observed public function only; they are deliberately smaller than complete fixes and do not establish migration safety or production completeness.

- D1: Reader-only synthetic; no writer required. The law checks growth and truncation, including the existing one-rep padding rule.
- D2: Uses the real canonicalizePlan writer directly on a synthetic invalid record; the frozen _bornValid diagnostic is compiled from its exact pinned declaration; canonicalizePlan itself runs from the frozen bundle. Only the specific invalid-array-length RangeError is a recorded observation; every other exception fails the runner.
- D3: The real reader accepts a synthetic receipt directly. The narrow law control recognizes its legacy suffix and exact name ending; a production fix still needs broader historical receipt-format coverage. LIVE removes only receipts proven to belong to a distinct lift by the longest full known current/former name and a recognized suffix; unfamiliar prose is not called a collision.
- D4: Reader-only synthetic sessions plus receipts; no writer-only setup. The control's numeric-load parser is limited to the retained witness format, not a production migration. LIVE instead recognizes finite numeric load spellings including exponent notation and removes only a proven distinct longest full known current/former-name owner; unfamiliar prose is not called a collision.
- D5: Reader-only synthetic; covers parser, normalized ladder, maxed-out status, next load and preservation of a valid two-distinct-rung ladder.
- D6: Reader-only synthetic; the law also confirms that the ordinary known-load result remains unchanged.
- D7: Reader-only synthetic; the law checks both exclusion from the earlier view and retention in the later view.
- D8: Reader-only synthetic. The proposed law makes the recommended ruling executable but does not authorize it; the current boolean API cannot itself express a separate unknown label.
- D9: Reader-only synthetic includes a future schedule record to verify eligibility as well as ordering; equal-date conflicts remain outside this specific law.
- D10: Reader-only synthetic requires TZ=America/New_York. LIVE checks only actual adjacent weekly snapshot intervals and the actual model-anchor-to-today interval used by current readers; it does not manufacture a DST pair from the private ledger.
- D11: Reader-only synthetic uses ten real synthetic readings and food/step rows with no dependency substitutes. The control repairs observed endpoint/promotion fields only; the production repair must also regenerate its prose coherently.
- D12: Synthetic-only seed seam: clear this test engine instance's ROLLUPS array so the five invented weeks are the entire sample, as in the retained witness; no function is stubbed. LIVE keeps all real seed and private rows intact.
- D13: A read/change/read sequence is required; the synthetic changes trend in place and compares with the real uncached reader. LIVE is NOT APPLICABLE because a persisted snapshot contains no cache lifetime or intervening in-memory write evidence.
- D14: Reader-only synthetic compares omission with explicit default and checks the measured scale-rate result remains identical.
- D15: The red assertion compares sparse and dense food logging over the same synthetic dates; the narrow control corrects the frequency field only.
- D16: The law and test-only control instantiate the recommended due-day or following-day grace, pending owner ruling; explicit positive due-day and grace-day cases prevent an always-ungraded implementation from passing.
- D17: The synthetic adjustment carries an existing undone flag; no writer is needed to reach the reader.
- D18: The bar remains none because this seed observes the internal budget reader and does not demonstrate a displayed false receipt or an actual applied write; the control filters ordinary notes before the existing bounded scan.
- D19: Uses the existing optional as-of, break and empty-supervisor arguments to isolate phase wording.
- D20: The original witness substituted six policy dependencies; this seed instead mutates invented daily observations and executes real currentRate, digitalTwin and forecast bodies on both engines, with no dependency substitutions; LIVE needs an earlier in-memory cached read and later write.
- D21: A synthetic fall-back date is necessary for the red witness; the LIVE predicate checks today and returns not triggered when today is not that boundary.
- D22: D22 was logged through census exception parity rather than a numbered witness-runner case; this seed uses an invented numeric-keyed collection and compares recoveryIndex with the exact same array-encoded nights, catching the original exception as RED.
- D23: Existing optional face/fix/prog presentation arguments isolate the actual workout branch; no real dayType, genSession or pickStructural body is replaced in the red drive.
- D24: Reader-only invented steps row; no writer seam.
- D25: The law proposes requiring at least one successful day, pending owner ruling; the printed fraction is truthful and the good label is an evaluative product choice, so the four-part bar is none.
- D26: Uses one immutable-in-practice synthetic state and a mutable complete clock advanced coherently; LIVE cannot infer an earlier cache from a ledger snapshot.
- D27: The seed supplies current invented weigh-in and clean nights so logging and sleep rungs do not mask the false break instruction; the control targets the phase contradiction.
- D28: The control remaps the current week onto the old reader's input boundary; no writer is required to represent a future-effective split.
- D29: Whole-engine invented sessions; no writer or dependency substitution.
- D30: The red drive compares the actual first-set and full-lift readers on invented same-load sessions; the control filters only cross-era session rows.
- D31: Synthetic hard-event exclusion leaves four qualifying earlier sessions; real dayWeather and liftTrend run without stubs.
- D32: The proposed law follows the recommended answer; the control uses the real sameEra predicate before the real reader.
- D33: Both before/after loss pairs are synthetic and contain no correction; an unchanged-write positive control rejects a deny-all guard. The control is limited to these red-first classes, not a complete proposed guard.
- D34: In each fresh engine, Object.assign replaces the exported SEED containers with a wholly synthetic state; the frozen predicate closes over that same object. No authored record values or shape-derived fixtures enter the law. LIVE leaves the real seed untouched and compares record content canonically.
- D35: Invented future-schema null containers are enough; the law does not infer the semantics of any future field.
- D36: The law drives full migrate from an invented v59 curl; current v60 state alone cannot establish what its pre-migration load vector was.
- D37: Two synthetic replicas contain genuine qualifying sightings and noisy earlier technique evidence; the control dates the whole merge at its newest recorded session to demonstrate a passing boundary, not a complete multi-date merge fix.
- D38: Both frozen and candidate run their own real applyAgentProposal and dismissAgentProposal before both merge directions; no invented trial-record shortcut is used.
- D39: The real dismissal writer makes one replica and an actual stale pre-dismissal copy makes the other; no product effects are applied after resurrection.
- D40: No two-device write order exists in the snapshot; the control demonstrates a canonical deterministic tie but is not an authorized authority policy or complete conflict-retention implementation.
- D41: Two actual completeSession calls create the debut and its vector, then a third lands it; the separate consented reset is also a real writer. The scalar genSession card alone does not display the stale vector. LIVE detects the persisted scalar/vector inconsistency; the snapshot does not establish whether the debut writer, reset writer or another historical path caused it.
- D42: Real applyProposal and undoAdjustment are followed by actual applyRead on the undone and untouched states; the control demonstrates the isolated-break case and does not claim to solve interleaved seals.
- D43: The real writer records entered load in lastMeta while its session row disagrees, providing an independent internal witness without a stub. LIVE requires a mismatched session and lastMeta load plus the matching OWNED receipt, excluding explicit load-correction payloads or wCorrAt; a mismatch with missing attribution returns NOT APPLICABLE because the original completion input is needed.
- D44: The actual sweepVolume chooser produces the one-set offer from invented workout history; applyAgentProposal, _volDeltas and structuralMovesThisWeek all execute. A separate accepted +1 proposal checks that the fix does not suppress all volume writes.
- D45: Actual askContext and two real completeSession calls demonstrate the contradiction; no analyst request, generated answer or athlete-visible misinformation is inferred.

Three parallel technical passes were cross-reviewed by executing adversarial controls. Closed findings: D3/D4 LIVE false positives for unusual own-lift names/number notation; D28/D29 missing-output LIVE false negatives; D22 unrelated-error swallowing; D16 never-grade vacuity; D33 refuse-all-writes, D34 never-pristine and property-order, D39 drop-all-offers, D44 ignore-all-volume-actions, and D45 blank-context shortcuts. Positive cases and/or named mutants now reject each shortcut. D25 was reclassified as an owner ruling because the one-miss allowance is a product judgment, while its printed fraction is true.

## 6. Summary table (identical to the register)

| id | theme | bar | live | recommendation | fix hours |
|---|---|---|---|---|---:|
| D1 | Target and load domain | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D2 | Target and load domain | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 2 |
| D3 | Receipt identity | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 4 |
| D4 | Receipt identity | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 4 |
| D5 | Target and load domain | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D6 | Target and load domain | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D7 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D8 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | OWNER RULING | 3 |
| D9 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D10 | Clock and as of | none: cosmetic / internal / performance | NOT TRIGGERED | OWNER RULING | 2 |
| D11 | Numeric values and units | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D12 | Numeric values and units | untrue value or receipt the athlete sees | TRIGGERED | FIX | 3 |
| D13 | Cache identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a write between two cached reads of the same object) | FIX | 4 |
| D14 | Numeric values and units | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D15 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D16 | Receipt truth | untrue value or receipt the athlete sees | TRIGGERED | OWNER RULING | 4 |
| D17 | Receipt truth | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D18 | Counts only guards | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 1 |
| D19 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D20 | Cache identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs an earlier cached read followed by a write to the same in-memory state) | FIX | 3 |
| D21 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D22 | State shape and failure | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 3 |
| D23 | State shape and failure | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D24 | Receipt truth | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 1 |
| D25 | Receipt truth | none: cosmetic / internal / performance | NOT TRIGGERED | OWNER RULING | 1 |
| D26 | Cache identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a cached Today read before a calendar rollover) | FIX | 3 |
| D27 | Receipt truth | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D28 | Clock and as of | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D29 | Evidence comparability | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 2 |
| D30 | Evidence comparability | untrue value or receipt the athlete sees | TRIGGERED | FIX | 3 |
| D31 | Evidence comparability | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 4 |
| D32 | Evidence comparability | untrue value or receipt the athlete sees | NOT TRIGGERED | OWNER RULING | 4 |
| D33 | Counts only guards | lost fact | NOT APPLICABLE (needs a proposed write that removes a set or replaces a read day) | FIX | 8 |
| D34 | Counts only guards | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 3 |
| D35 | State shape and failure | none: cosmetic / internal / performance | NOT APPLICABLE (needs a newer-schema import) | FIX | 2 |
| D36 | Receipt truth | untrue value or receipt the athlete sees | NOT APPLICABLE (needs the pre-v60 migration input) | FIX | 3 |
| D37 | Clock and as of | untrue value or receipt the athlete sees | NOT APPLICABLE (needs two replicas merged at different clocks) | OWNER RULING | 6 |
| D38 | Merge tie identity | lost fact; untrue value or receipt the athlete sees | NOT APPLICABLE (needs a merge of a written trial decision with another replica) | FIX | 6 |
| D39 | Merge tie identity | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a dismissed offer and its stale replica) | FIX | 6 |
| D40 | Merge tie identity | lost fact | NOT APPLICABLE (needs two replicas with conflicting same-day entries) | OWNER RULING | 6 |
| D41 | Scalar per set load | none: cosmetic / internal / performance | NOT TRIGGERED | FIX | 4 |
| D42 | Undo half effects | untrue value or receipt the athlete sees | NOT APPLICABLE (needs a break approval and undo sequence to attribute the remaining seal) | FIX | 5 |
| D43 | Scalar per set load | untrue value or receipt the athlete sees | NOT TRIGGERED | FIX | 3 |
| D44 | Receipt truth | untrue value or receipt the athlete sees | NOT APPLICABLE (needs accepting a one-set removal offer) | FIX | 3 |
| D45 | Analyst writer contract | none: cosmetic / internal / performance | TRIGGERED | FIX | 1 |

FIX: 38 · OWNER RULING: 7 · KEEP: 0 · DEFER-M4: 0. Total estimated fix work: 131 hours (shared work may overlap).

## 7. Unsure and next actor

The open rules are sleep recency (D8), calendar versus elapsed weeks (D10), forecast grace (D16), the first-day protein allowance (D25), cross-technique replication (D32), historical versus current analysis in a merged receipt (D37), and calorie-conflict authority (D40). The proposed laws follow the recommendations; their training/product choices require the owner's ruling. Identity migrations, correction exemptions, cache invalidation ownership and receipt/golden consequences remain implementation work, not solved by the narrow controls.

The private source is the locally regenerated pinned snapshot, not independently verified current phone/server data. No LIVE claim establishes cache call history or missing cross-device inputs. No external analyst output, UI, network operation, port or deployment was tested. Cowork next verifies the runner and LIVE predicates locally, then assembles the ruling pack. This PR must not be merged by ASTRA.

## 8. Wall-clock

First recorded clock: 2026-09-06T03:41:35.000Z. Report checkpoint: 2026-09-06T07:04:39.764Z. Elapsed 203.1 minutes, including approval waits and parallel work; not summed engineering hours. Final commit, PR creation and any review follow this checkpoint. No per-task token count is claimed.
