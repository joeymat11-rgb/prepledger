# BRIEF-F1-FULL-BODY v1.0

Status: BRIEF-READY for PM acceptance by name; incorporates owner starter ruling :157, not a Lane D acceptance.
Author: Lane D (Astra), 2026-09-12. Common product: 2d50e88 on rebuild/lane-d-f1; proof/report head 7371879; parent 964f183.
Authority: DECISIONS:125(2), :138, :148, :153, :155, :157, :159; sequence remains :136. Owner two-set ruling :157 supersedes :152.
Package name proposed: M2-F1-FULL-BODY. One independent Opus reviewer, then the PM.
Effort: author HIGH, independent Claude engine reviewer MAX from PM, mechanics LOW; own provider usage per :148.

## 1. Outcome and limits

An athlete with a full-body day can start, record, resume and finish one session containing exercises from both upper and lower families. F is a calendar/session kind; each exercise keeps its existing U or L family, id, load, set count and history. A full-body session counts as one session and as one exposure for each participating exercise. U/L-only athletes remain byte-identical to the accepted parent.

The low-day setup recommendation is a PROPOSED standard: two or three selected days receive F, with the athlete able to override each day. Four through seven days retain A4b's accepted alternation; the one-day policy remains unchanged and is not represented as comprehensive. The default starts a new setup proposal; it never rewrites an existing athlete's week.

This is a delivery mechanism, not a claim that full-body training is inherently superior at matched volume. Existing research-brief.md:84-86 separates frequency from hypertrophy and includes a null-compatible frequency estimate; DECISIONS:125 supplies the product instruction. No new literature finding is claimed. An exact optimal session length, fatigue discount or per-session set ceiling is not derived by that evidence.

## 2. READ-LIST

- AGENTS.md READ FIRST; GOALS.md; research-brief.md (volume and negative findings); HANDOFF.md 0.23/0.14/0.24; LANES.md and Lane D CHARTER.md; DECISIONS:88-146 as directed.
- rebuild/engine/plan.cjs, today.cjs, volume.cjs, writers.cjs, sleep.cjs, energy.cjs; constants.cjs:327-360 for existing bands and cap; progression.cjs:65-124,268-286,436-478,742-748 as unchanged set/history contracts.
- rebuild/m4/workout/athlete-state.cjs; workout-basis.cjs; native-trend-context.cjs; engine-runtime.cjs; rebuild/m3/w6/host/{workout-host.mjs,engine-runtime-host.cjs,test/journey.test.mjs,test/engine-equivalence.test.cjs}.
- rebuild/m3/w7-preview/today/{setup-model.mjs,setup-commands.mjs,setup-app.mjs,setup-host.mjs,today-model.cjs,gym-model.mjs,plain-copy.cjs,build.mjs,design.cjs,screens.template.html}; rebuild/m3/w6/local/today-bindings.mjs.
- A4b candidate rebuild/lane-c-a4b @ 5ba2419: rebuild/lanes/c/dad-first-run/A4B-BRIEF.md and today/{split-kinds.mjs,starter-week.mjs,exercise-catalogue.mjs,setup-model.mjs,setup-commands.mjs}; dependency evidence only, not adopted product bytes.
- rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md:294-339; BRIEF-B2-TARGETS-IDENTITY-ERA-v1.1.md:63,351-373,547; BRIEF-B4-NUMBERS-CACHE-IDENTITY.md:102-130; BRIEF-H3-CLEAN-INIT.md at its eventual accepted head.
- rebuild/lanes/b/tooling/README.md, b-package.cjs, packages/H3.json, packages/B-NTC.json; rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json for the current chain only. Future parent is the accepted immediate predecessor, not a hardcoded B-NTC parent.
- Excluded: ledger/, rebuild/conform/private/, src/history.js, any protected soak data. No Lane D process reads, copies or fetches those paths.

## 3. Representation and per-session volume rule

1. Split calendar vocabulary extends from U/L/REST to U/L/F/REST. Exercise vocabulary stays U/L. Invalid spellings still refuse. The closed setup document and operation retain their existing members; no new exercise day, id, schema version, saved F template or manufactured history is needed.
2. An F day covers both U and L exercises for constructor validation. An F setup must supply at least one active exercise in each family. Unknown ids, duplicate exercise ids and orphan families refuse before a write. Ordinary U/L constructor behavior stays unchanged.
3. F uses the active upper pool and active lower pool once each. Preserve each family's existing stable order, then interleave U[0], L[0], U[1], L[1], continuing the remaining family when the other ends. U-first and interleaving are INVENTED deterministic ordering conventions, not physiology. No persisted exOrder.F: generation-51 normalization can otherwise discard it (plan.cjs:218-229).
4. Each exercise carries exactly its configured e.sets to the existing target generator, including debut. Do not halve sets on F days, multiply them by two, allocate leftover sets by weekday, or truncate an already-issued workout. These would change vector length between appearances and repeatedly restart the native trend (progression.cjs:742-748). Work sets per F session equal the sum of generated target-slot counts, not U-session count plus L-session count.
5. For a seven-day query week, exposure(U) = count(U) + count(F), exposure(L) = count(L) + count(F); sessionCount = count(U) + count(L) + count(F). Designed direct volume is e.sets times exposure(e.day). Indirect credit retains the immediate parent's convention. Observed volume remains actual recorded sets; no projection writes a performed set.
6. Query each calendar date against the effective split, including a mid-week split change. Inherit B2/D9 and D28 for split selection/query week. Preserve the parent's no-F path exactly; no general repair of historical U/L volume is smuggled into F1.
7. F adds no new automatic total-session cap. VOL_SESS_CAP = 8 (constants.cjs:354) is the existing adaptive proposal cap, not a source for eight TOTAL sets or eight exercises. For F proposals, test the resulting sum of direct sets for that bucket across the complete F pool against that existing cap; do not silently reduce an athlete-authored plan. The U/L cap behavior stays the parent's. An F proposal's per-session delta and weekly consequence must both use exposure(e.day).
8. Missing body/sleep/readiness data remains unknown. No sleep-based upside gate, readiness multiplier, unearned load, new effort rule or automatic volume increase is introduced.

Synthetic arithmetic (fixtures, not either athlete's programme):

| calendar | upper exercise sets | lower exercise sets | total work sets/week | U exposure | L exposure | sessions |
|---|---:|---:|---:|---:|---:|---:|
| F, F | 3 | 2 | 10 | 2 | 2 | 2 |
| F, F, F | 3 | 2 | 15 | 3 | 3 | 3 |
| U, F, L | 3 | 2 | 10 | 2 | 2 | 3 |
| U, F, F | 3 | 2 | 13 | 3 | 2 | 3 |

## 4. Setup companion and its concrete product question

Lane C owns the setup screens and catalogue. This brief requests a sequenced companion, not concurrent edits to its page files. Before removing the coming-soon sentence, its real setup must create an F week accepted by the constructor and conduct a complete gym journey.

Owner-ruled F starter (:157): one catalogue exercise for each of A4b's eight named major buckets, stored in its original U/L family, at TWO sets each for both two-day and three-day weeks. Keep rep standard 10 and invent no first load. Eight exercises yield 16 work sets per session, 32 or 48 scheduled work sets per week. The eight-bucket list and rep standard are A4b's declared programming conventions (starter-week.mjs:55-56, setup-model.mjs:41 at 5ba2419); two sets is the owner's product choice. Every athlete override wins. The v0.1 ceil(VOL_BANDS.lo / F days) formula is retired.

Research boundary: research-brief.md:77-95 reports Pelland's four fractional sets/week minimum effective dose and distinguishes frequency from hypertrophy; :118-120 separates maintenance from growth bands. This brief adds no literature claim that this starter is optimal or guarantees growth. Two F days at two direct sets give four direct weekly sets per selected exercise; fractional helper totals require F2's saved-tag projection. Starting below the existing growth band is deliberate, not a retention emergency. The existing adaptive engine may propose one additional set when its own data and rules warrant it, under its existing cap and exposure pricing; it never changes the plan automatically. Declining leaves two sets in place, and staying there is permitted.

Seam that must not be hidden: A4b tags.head/secondary ride the setup op, but athlete-state.cjs accepts only eight exercise members and does not materialize head/secondary. Current engine programmeVolume buckets by e.head || e.mg (volume.cjs:74), whereas starter-week displays tags.head || row.mg. F2 is meant to connect those tags. F1 cannot claim those eight regional buckets are engine IN-BAND until F2's tag projection is in the accepted parent or is separately approved and reviewed. F2 labels in H3 alone do not close this seam.

PM handoff: accept this v1.0 by name using the owner-ruled two-set starter. Lane C owns F1-14/F1-15 and the starter setup companion; F2 custody/semantics are ruled at :155. Common F machinery already exists; regional band guarantees remain dependent on the real F2 companion journey.

## 5. Proposed custody, size and dependency order

Lane D common-engine custody was granted at :148; seven-module candidate 2d50e88 exists. This v1.0 keeps that envelope. Lane C owns setup screens; lane B owns tooling, package admission and private FULL. D may pre-build on B1+B2 once B names the branch (:159), without changing seal order.

Requested product envelope after acceptance (engineering estimate, not a measured diff):

| files | change | estimated changed/additional lines |
|---|---|---:|
| engine/plan.cjs | F day predicate, membership/order helpers, weekly F exposure; keep exercise identity | 55-90 |
| engine/today.cjs | F pool and structural candidates, full-body name, next workout; F denominator branch | 25-45 |
| engine/volume.cjs | F exposure in designed volume on B2's query-week successor | 10-25 |
| engine/writers.cjs | state-aware F frequency and truthful consequences/advice; F aggregate cap | 35-65 |
| engine/energy.cjs, sleep.cjs | F counts once as training; same health/advice predicates | 5-15 |
| m4/workout/athlete-state.cjs | separate session kinds/families; F coverage validation | 15-30 |
| lanes/d/** | proof cells, mutants, public differential/report; package declaration handoff | 300-600 |

Seven existing product modules; approximately 145-270 changed/additional product lines. No progression, migration, merge, runtime composition or data-schema edit is proposed. If execution proves one necessary, report the concrete seam before expanding custody.

Lane B owns runner F1 admission, package registration, cumulative profile, inherited-carrier substitutions, .github/workflows/rebuild.yml child step and the private FULL run. Request its runner or sealing service by REQUESTS. Lane D never appends THEME, BRIEF-BY-SHA, ruling, acceptance or receipt lines and never merges, even where older general lane rules grant those actions.

Default parent sequence is :136/:138, with H3, B1+B2 and B4+B3 ahead of the F1 seal unless the PM reorders. In particular inherit B2/D9+D28 and B1/D23, and preserve B4/D15's scheduled floor. Re-take all preimages on that parent and review the delta. _weeklyFreq's general U/L defect is not assigned in those briefs; F1 proposes only an F-aware branch, keeping the no-F legacy branch byte-equivalent.

## 6. RED-first laws and decisive probes

Each F1 cell has its own id and must execute the product entry point, candidate GREEN and parent RED where it witnesses new behavior. Existing U/L invariants are controls, expected GREEN on both. The isolated prototype is not evidence that product cells pass.

| id | required evidence |
|---|---|
| F1-01 | valid F-only setup with U and L exercises accepted; original constructor refuses it; malformed split, F exercise identity, duplicate ids and one-family F setup refuse atomically |
| F1-02 | dayType returns F on the intended date, REST remains rest; latest-effective split and before/after boundary use B2's successor |
| F1-03 | generated F contains both pools, each live id once, stable within-family order, retired/quarantined records excluded without deletion |
| F1-04 | original e.sets and target lengths preserved on F and mixed U/F or L/F; debut stays baseline ask with no invented load/reps |
| F1-05 | structural main+rider selection sees either family, one existing structural budget only; existing readiness protections unchanged |
| F1-06 | all four arithmetic rows in section 3; exact query-week exposures across a dated split transition; F counts once in scheduled-energy denominator |
| F1-07 | one-set adaptive proposal for U,F,F is +3 weekly for an upper lift and +2 for a lower; F aggregate bucket cap cannot be bypassed by using two exercises; zero exposure produces no proposal; a two-set starter with eligible athlete data below the growth floor produces the existing one-set proposal, no automatic increase; declining preserves two sets (:157) |
| F1-08 | actual Today/gym host: start F, record both families, close, reload, repeat at day+3 and day+7; native previous line and next targets remain qualified; no reset solely because the session label is F |
| F1-09 | partial F: abandon/resume, undo one set, leave an exercise unperformed, complete; only real sets persist in the existing operation/outbox transaction; failed save leaves both unchanged |
| F1-10 | mixed U/F/L history, same exercise id/load/era/set count; comparison and short-sleep downside-only rule preserved; no duplicate or artificial historical entries |
| F1-11 | nextTrainingISO, Today next workout, completion/debrief/advice/coach-consumed text all identify F as training and as Full body, never Lower body or REST; no new em/en dash |
| F1-12 | F-only session progress denominator reflects its declared week rather than four; no-F outputs unchanged |
| F1-13 | U/L public census and accepted laws byte-identical; repeat with no split, unsorted/dating cases and retired lifts; private census verdict supplied only by lane B |
| F1-14 | setup companion proposes F for every two-/three-day weekday combination (including adjacent days/week wrap); overrides persist; changed days never erase exercises or saved history; four-/seven-day A4b outputs unchanged |
| F1-15 | starter rows, displayed regional totals, generated session counts and runtime programmeVolume agree, or the surface explicitly reports unqualified regions; coming-soon copy clears only when this real journey is available |

Fault mutants: F->REST; omit one family; duplicate a pool; reverse family order; halve debut sets; count F twice as a session; omit F from exposure; fixed two-exposure pricing; per-exercise-only cap bypass; reject F in next-training lookup; label F Lower; auto-rewrite an override; ignore a failed save; copy tag-only band numbers as an engine result. Each must be killed by a named cell. Tests that only search source text do not satisfy these cells.

## 7. Package and review bar

FULL engine tier is unchanged: closed cumulative profile with the immediate accepted parent, all 45 register laws retaining their inherited statuses, own F1 children mandatory, 19 gates, second gate, independent own bites, fault mutants, fidelity and public U/L differential. No frozen law, golden or oracle is edited to obtain green. A required new successor uses the parent's own original body and the PM's explicitly scoped grant; :146 is H3-only, not F1 authority.

Lane D's --full run excludes the private fixture and must reach BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING, not be mislabeled PASS. Before a runner/spec exists the status is NOT RUN, not that expected terminal. Lane B runs the private gate on the PC and hands the PM a verdict with no values. The PM alone supplies judgments/citation/receipt lines. Seal on current-tip ancestry or explicit FREEZE; changed pins force a new FULL and receipt. The :136 byte-identity step is usable only through reviewed tooling and a real on-chain receipt.

One independent Opus reviewer, author != reviewer, at MAX, reviews the final product and package, challenges the F starter policy, executes the cases and preserves disagreement. Astra's helper reconnaissance or self-tests are not that review. Request the reviewer through the PM/lane B because this lane's available collaboration models do not include Opus.

Before PR-READY: builder preflight is the :155(6) hand checklist plus B runner --ci for engine tier (no separate preflight executable), exact-head CI green both OS, measured custody/counts, report <=60 lines, STATUS <=400 chars, no UI em/en dashes, no private reads. Final report separates isolated prototype, product proof, FULL/private handoff and real iPhone evidence. Real phone kill/relaunch and full-body workout hand test remain unperformed until witnessed; a jsdom or Edge run cannot stand in for them.

Current evidence remains F1-CANDIDATE-REPORT.md: public laws 27/28 (B2/D9 dependency RED), native 12/12, mutants 9/9; the new :157 decline cell and C starter journey are not yet claimed. Under :153 each package requires its own PM token and named-files differential; D cannot author that token or substitute an inherited gate.
