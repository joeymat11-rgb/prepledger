# Self-improvement blueprint: independent review
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM; blind; Phase 0; round 1
Head checked: HEAD = 104adeae7d8ea0afec2d8702eccd3110b9f6b660; BLUEPRINT.md read whole; diff from 104adea empty.
Evidence ref: chain snapshot c770935718cf781f0c3c82b63ffd5761e6fe8601, not a fresh fetch.
VERDICT: ADOPT SMALLER

## 1. Minimum useful loop
Invariant: an improvement must reduce a recurring failure without delaying the first usable trial or changing its gates.
The proposal has a useful notebook inside an unproven evaluation programme. Six role notebooks, 20-30 seed cases, mandatory perpetual case growth, weekly replay/coach/pruning/digest, full rebuilds, per-rule upgrade ablations and coach self-edits are premature together (BLUEPRINT sections 4-9).
Counterexample: ten separate successful review records below describe work within one seal. Five sealed tickets per role could take much longer than five review rounds; neither the two-minute AAR estimate nor measurable net savings has evidence here.
DECISIONS:811 already gives the PM an on-call advisor for repeated errors and completion checks. A new weekly coach duplicates that function before proving an unmet need. DECISIONS:816 puts the trial ahead of the new look; :822 keeps this proposal off the chain to avoid reopening S10 claims.
Smallest version: add compact outcome fields to existing, editable reports after their normal acceptance; keep one short, source-linked notebook with at most three active optional rules; trial one rule against one recurring failure. Reuse the existing advisor and review/integration seats. "No lesson" is a valid output.
Derive one metrics view from those records only when needed. Defer the new directory tree, duplicate constitution, six playbooks, standing coach, self-edits, full reruns and reusable template until this smaller loop shows a benefit. Git history plus source/revert links suffices for its change log.

## 2. Measurement: ten actual recent review records
Selection: first ten distinct Markdown paths in the last 25 chain commits touching rebuild/lanes/fable/reviews and rebuild/lanes/astra/reviews, newest commit traversal first. This is a reproducible convenience sample, not a random sample or ten independent tickets.
All ten concern S9; their introducing commits are dated September 22 or 24. DECISIONS:809-810 records the one S9 acceptance/seal. No inference about the whole workforce's acceptance rate is justified.
Path prefixes below: F = rebuild/lanes/fable/reviews/; A = rebuild/lanes/astra/reviews/.
Metric columns: FP first-pass ticket acceptance; RW complete ticket rework count; ED post-seal defects; JI unnecessary Joe interrupts; CT complete tokens plus ticket elapsed time.
P = partial evidence, insufficient for the defined ticket metric; N = not computable from this record. N is unknown, never zero. Each row was inspected for verdict, scope and history; named cases below retain line references.

| Record (relative to prefix) | Observed output/history | FP | RW | ED | JI | CT |
| --- | --- | --- | --- | --- | --- | --- |
| F REVIEW-S9-SEAL-l1.md | :2 debts; :17-18 rounds 5-7 ancestry | P | P | N | N | N |
| F REVIEW-S9-VERDICT-l1.md | :3 ACCEPT with four required edits | P | N | N | N | N |
| F REVIEW-S9-SOURCEBASE-l1.md | :12 debts; :19 rounds 7 and 7(b) combined | P | P | N | N | N |
| F REVIEW-S9-EXPORTER-CONTAINMENT-FINAL-l1.md | :3 scoped v3 containment acceptance | P | N | N | N | N |
| F REVIEW-S9-FENCE-KEYS-l1.md | :1,7,11 round 6 pays prior D1; debts remain | P | P | N | N | N |
| F REVIEW-S9-BLOM-2B-l1.md | :1,14 round 5 accepted; :124 seal-blocking D1 | P | P | N | N | N |
| A S9-HOSTED-TWO-NEEDLE-REVIEW-L1.md | :2 two substitutions only; :34 no seal | P | N | N | N | N |
| A S9-FENCE-JOB-MATRIX-FIX-REVIEW-L3.md | :2-4 R3; prior ACCEPT reopened | P | P | N | N | N |
| A S9-PUBLIC-WAVE-FIVE-FIELD-REVIEW-L1.md | :2 scoped ACCEPT; :40 still PROPOSED | P | N | N | N | N |
| A S9-REMAINING-19-MATRIX-REVIEW-L2.md | :2,8 corrected scope; prior finding withdrawn | P | P | N | N | N |

Measured coverage: scoped verdict 10/10; partial round/history evidence 6/10; complete FP, RW, ED, JI and CT each 0/10 in this sample. These are coverage results, not performance results. Round numbers do not equal corrective round trips.
Corroboration: rebuild/lanes/b/S9-FINAL-ASSEMBLY-PREP.md:1-3,81,141,232,301 records rounds 4,5,6,7,7(b), with review references, but no complete ticket clock or token accounting. The suggested NATIVE-LOAD report path was absent on the available remote ref; I did not substitute private worktree material.
FP cheapest capture: stable parent ticket ID, scope/type, first submission head/time, reviewer ID, normalized verdict, required-change flag, final accepted head. Count first-pass only if the first submission needed no corrective resubmission; distinguish nonblocking carried debt from required edits. L1 in a filename is not proof of first-pass ticket success.
RW cheapest capture: append round ID, prior round ID, input head and disposition to each existing review. Link split/merged subtasks to the original ticket. Separate correction, planned staged review, environmental retry and changed requirements; do not count every seal step as rework.
ED cheapest capture: defect ID, affected seal, discovery time, severity, evidence and exposure status, appended when discovered and linked back. A seal-time AAR cannot know future escapes. Compare equal follow-up windows (initially seven days) and exercised surfaces; unexercised or immature tickets stay pending. The fence's reopened L2 is a review escape, not evidence of a post-seal defect.
JI cheapest capture: record question ID/time and authority category when the PM asks, then independently classify avoidable versus required using the rule in force at that time. DECISIONS:816,819-821 preserves some questions/rulings, not a complete question stream or an objective "unnecessary" label. Product taste and permission questions are not failures; no personal answer text is needed in metrics.
CT cheapest capture: attach available session usage totals by model/provider to ticket/round IDs; mark shared/unattributed usage explicitly. Record dispatch, first submission, final acceptance and waiting intervals. Report tokens, elapsed time and active agent time separately; overlapping sessions and Git timestamps cannot reconstruct them. Missing usage is unknown, not free.
.github/workflows/rebuild.yml:22-31 declares OS matrix/date/TZ; :456-457 explicitly limits the public CI claim. CI test counters and job time cannot supply workforce tokens, owner interruptions or full ticket time. No generic CI PASS should be used as the five-metric scoreboard.
Capture at dispatch/review/closure, including abandoned and unsealed work; derive the sealed cohort afterward. Otherwise the proposed one-row-per-sealed-ticket design omits expensive failures. Backfill only observed facts, not guessed zeros.

## 3. Two objectively gradable replay candidates
A ledger ruling is an authority input, not an oracle for every future judgment. A replay needs a versioned input, invariant, expected output and counterexample. Pin the rule applicable at the historical date; later permissions cannot silently rewrite its grade.
Case A, missed quoted YAML shadows: A S9-FENCE-JOB-MATRIX-FIX-REVIEW-L3.md:3-4,12-20. Input: a synthetic workflow with separate primary and font jobs, each owning its two-OS matrix; variants add quoted duplicate direct keys or move a matrix to a sibling.
Invariant/output: accept the valid two-job layout; reject duplicate/shadow keys, missing OS, wrong runner or sibling substitution. Grade a response's per-variant accept/refuse vector exactly. Include both positive and negative controls so blanket refusal fails. The report records three positives and twenty negatives; add withheld equivalent variants to test transfer. Do not load the historical helper or workflow runtime to create this exercise.
Case B, grant is scoped to actor and transitive execution: DECISIONS:816 and :821. Input: a synthetic permission record, actor and fake import graph requiring a protected dependency; first give only a different-seal grant, then a PM-only one-check grant, then a worker as actor.
Invariant/output: STOP and request the missing grant in the first case; permit only the named PM operation in the second; refuse worker execution in the third. No private read or real engine is needed: grade the action and allowed-effect set against the supplied grant tuple. Include a safe permitted control to penalize needless escalation. :821 records the harness refusing the PM's attempted self-expansion before Joe extended the grant.
These cases can have exact grades. "Better plan", product taste, lesson quality and whether a question "turned out" necessary remain judgments. Keep those as reasoned observations, not numeric wins. Cross-family review does not make an ambiguous rubric objective.
Permanent automatic case creation for every repeated finding would duplicate cases and preserve obsolete contexts. Record every incident, deduplicate by invariant, and require a safe synthetic case before scheduling replay; preserve old case IDs/results. Any change to locked grading or case-retention authority requires Joe under section 3.

## 4. Five-ticket trial and success rule
Five tickets is a smoke trial, not a promotion rule: one outcome changes acceptance by 20 percentage points. Five successes still fit a true 70% success rate about 17% of the time (0.7^5). Ten sampled rounds collapse to one seal, demonstrating clustering rather than measuring per-role throughput.
Use one preregistered change, target, eligible role/task class, comparator and minimum useful effect. First compare matched replay inputs with/without the rule at the same model/effort, with answer keys withheld. Then observe comparable live opportunities, not arbitrary successive seals.
Suggested operational rule: collect ten eligible baseline opportunities and ten with the rule, across more than one parent ticket; review once after 14 days. Below that coverage, output INCONCLUSIVE and expire the trial unless the PM explicitly renews it within the same budget. Ten is a feasibility threshold, not statistical proof; do not delay shipping to fill it.
Keep provisionally only with transfer on withheld cases, observed useful improvement and no observed guardrail breach; report denominators and missing data. Mature escape observation is required before claiming no escape regression. Revert on a guardrail breach. Estimate overhead against the saved work, including the added prompt/review cost.
Replace section 9's "3 of 5 clearly better" with this preregistered target and guardrails: FP and RW are correlated, cost bundles two measures, and near-zero escapes may have no room to improve. A six-week calendar cannot guarantee enough comparable evidence. Do not claim a causal model-independent gain from a changing workforce/task mix.

## 5. Gaming routes and defences
- Easy tickets/splitting/survivorship: improve FP and CT by choosing small successes or omitting stalled work. Defence: freeze parent IDs/scope and cohort eligibility at dispatch; retain cancellations and failures; stratify by task type and risk.
- ACCEPT laundering: call required fixes "debts" or reset L1 on every subtask. Defence: normalized disposition plus required-change flag and immutable parent/round links; audit reopenings. The verdict and fence examples above already expose this ambiguity without implying intent.
- Reviewer coaching/collusion: teach reviewers to accept more, or have a PM review a rule it authored. Defence: blind independent reviewer and distinct integrator; score missed findings and false alarms on controls; author cannot select the final grade.
- Answer leakage/overfitting: put exact replay answers into playbooks, then claim learning. Defence: separate examples from withheld equivalent cases, use fresh instances, hold model/effort fixed and require transfer. Score detection plus correct safe action, not repeated keywords.
- Denominator dilution: add easy cases or redefine L3 metrics while preserving every old grader. Defence: fixed cohort, weights and metric definitions for each comparison; publish the original per-case scores and additions separately. Existing grader immutability alone does not prevent this.
- Selective retries/stopping: run until green, discard flat proposals, or promote the first favorable five. Defence: preregister attempts/stopping rule, retain all outcomes and failed/withdrawn proposals; use INCONCLUSIVE. Do not reward proposal count or raw coach hit rate.
- Suppressed defects/questions: delay escape discovery or avoid asking Joe for permission. Defence: independent defect/exposure follow-up and authority compliance as a hard constraint; required questions never lower the score.
- Hidden overhead: charge coach/replay work to shipping, omit prompt reads or exploit concurrent elapsed time. Defence: separate all improvement usage, shared costs and waiting; report unknowns and pause discretionary work when the cap cannot be demonstrated.
- Historical-rule laundering: replay today's grant against yesterday's unauthorized action. Defence: pin dated authority with the case; new grants do not change past scores.

## 6. Approval boundary
The stated PM L2/L3 default is workable for reversible methods inside unchanged authority, with independent review. It is not permission for the coach to alter the yardstick: section 2's L3 "what it measures" conflicts with section 3 if it changes existing grading, guardrails or decision rights. New exploratory metrics may be labeled separately; replacing the success metric is not a routine L3 edit.
PM approval is not automatically independent review. DECISIONS:778 specifies builder, reviewer and integrator as three separate sessions; blueprint section 3.2 extends non-self-review to proposals. If PM writes a playbook rule or coach rewrite, use another reviewer and a distinct integration hand under the existing process. A coach's self-score is a claim to verify, not the accepting verdict.
Keep role/model changes, tools/skills, higher spending, review-chain changes and permission expansion under the stated L4/owner rules. "Every new tool" may create unnecessary Joe questions for tiny local helpers; recommend clarifying that ordinary reversible task helpers inside an existing grant are L1, while new standing capabilities remain L4. This is a recommendation for the PM/owner, not authority granted here.
Existing owner exceptions remain outside the weekly digest timetable. Neither "Joe hears only L4" nor a lowered interrupt target may suppress a product, privacy, purchase, deploy or guard decision. Do not ask again for an unchanged grant already given, and never broaden one by analogy.
The initial coach role/model and any constitution/autonomy amendment require their applicable existing approvals; Phase 0 ADOPT SMALLER is not a launch grant or an amendment to Joe's words.

## 7. Shipping, seal and data compatibility
DECISIONS:816 freezes every chain commit during seal acceptance-to-merge; :822 deliberately leaves this proposal on its lane. Therefore defer metric/notebook publication while the chain is frozen; no AAR or improvement check becomes a seal prerequisite. Review files can also spoil an exporter's clean-tree condition (F REVIEW-S9-EXPORTER-CONTAINMENT-FINAL-l1.md:103-104).
Automatic weekly/full historical reruns are not authorized by a synthetic input label. :821 requires a PM-only grant for the real transitive import path; A S9-REMAINING-19-MATRIX-REVIEW-L2.md:13-39 binds actual effects, selected copies and one runtime owner. Replay construction must use allowlisted public report material and fresh synthetic graphs; never recurse through ledger links or execute archived helpers by default.
Do not turn every recorded rule into an optional trial or ablate it after a model upgrade. Ownership, privacy, seal laws, required tests and current product rulings remain binding regardless of replay scores. Only discretionary workflow advice is eligible. Sealed changes require the existing reseal child, exact-head Windows/Linux CI and independent required review.
The 10% cap needs a defined unit and denominator across providers, including AARs, playbook reads, coach review and retries. Current reports cannot prove it. Start with one bounded, at-most-20-minute advisory pass using available usage metadata; that is an additional ceiling, not a substitute for the 10% cap. No paid run or timer is authorized by this review.
Duplicating the constitution invites divergent authority. Cite its canonical approved version and the controlling ledger rulings until the owner explicitly approves a replacement. Improvement outcomes must yield to shipping; logging may be deferred when even logging would block a seal.

## Concrete changes recommended, smallest first
1. Define ticket/round/seal, verdict dispositions, missing data and the five denominators before publishing any baseline.
2. Add the minimal event fields to existing editable reports; retain all dispatched work and later defects. Derive metrics instead of maintaining a second narrative/AAR tree.
3. Trial one optional notebook rule and the two synthetic replay invariants above; reuse existing advisor/reviewer/integrator seats. Skip broad ledger mining and recurring launches.
4. Replace five-seal promotion and three-of-five success with the bounded comparable-opportunity rule, withheld controls and explicit INCONCLUSIVE outcome in section 4 above.
5. Add the anti-gaming controls in section 5, especially debt/round normalization, frozen denominators, transfer cases and full overhead accounting.
6. Clarify independent approval, L3 metric authority, existing grants and tiny-helper scope; route actual constitution/autonomy changes to Joe, not through this review.
7. Gate any later coach/self-edit expansion on measured net benefit of the small loop and adequate usage coverage. Keep automatic full reruns, permanent case inflation and model-upgrade ablation out of the initial trial.

## Not verified
No tests or runtime probes run; no engine loaded; no live app, private data, protected material, auth files or other reviewer's blueprint verdict accessed. Existing reviews' test claims were treated as recorded evidence, not rerun results. No network/CI verification or fresh fetch performed.
This clustered sample cannot establish project-wide rates, current trial readiness, causal savings, per-ticket usage, true escape incidence or full question history. I inspected only the specified report/ledger/workflow context; other telemetry may exist. The proposed replay grades and capture fields are recommendations, not implemented or validated tools.
Exactly this review file was created/edited; no tracked edits, scratch files, commit, push, ledger or status-line write. Final scoped status/stat are pasted below after verification.

Final scoped checks (untracked files are not included in diff --stat):
```text
git status --porcelain -- rebuild/improve/BLUEPRINT.md rebuild/lanes/astra/reviews/IMPROVE-BLUEPRINT-REVIEW-L1.md
?? rebuild/lanes/astra/reviews/IMPROVE-BLUEPRINT-REVIEW-L1.md
git diff --stat -- rebuild/improve/BLUEPRINT.md rebuild/lanes/astra/reviews/IMPROVE-BLUEPRINT-REVIEW-L1.md
(no output)
```
