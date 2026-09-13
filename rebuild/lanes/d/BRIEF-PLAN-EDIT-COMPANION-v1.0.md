# PLAN EDIT COMPANION v1.0

Status: proposed builder contract; no acceptance or independent review claim.
Owner: Lane D. Source checkout: `2924c28`, `rebuild/lane-d-plan-edit`.
Candidate composition: `rebuild/lane-d-plan-edit-f2` on F1/F2 predecessor `f3e9561`; source recon remains pinned above.
Authority: DECISIONS:176(2), after the F2 candidate; D2 EDIT MY WEEK v1.0 at `f497e28`, narrowed by :176(1).
PM remains the single judge. C owns consumer wiring after N2; D2 owns its UI review.

## 1. Outcome and boundary

An enrolled athlete can edit Exercises or Machine settings without repeating setup.
Structural exercise edits start tomorrow on the installation's athlete-local calendar, with `Starts {date}` before Save.
Notes use the existing immediate machine-settings operation and limits. Clearing the final note stays deferred.
Days, priorities, restore/reorder tools and historical-plan editing are outside v1.
This package supplies a producer, validator, dated projector and durable host composition. It supplies no Today screen, client-core change, store, clock, authority, import activation or workflow change.
No producer, preparation, preview, cancel or projection writes anything. Only the athlete's Save reaches the existing durable writer.

## 2. Source recon

| Source at 2924c28 unless stated | Observed contract and consequence |
| --- | --- |
| `rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md` at f497e28 | EW01–05,08,09,11–16 are mandatory under :176; the two remaining doors and EW06/07/10 are deferred. |
| `rebuild/m3/w7-preview/today/setup-model.mjs:255,593` | Setup regenerates IDs and applies shared prescription values. Reuse vocabulary, never its full-document writer for an enrolled edit. |
| `rebuild/m3/w7-preview/today/setup-commands.mjs:40,84`; `setup-host.mjs:102` | First-run setup has a closed document, separate tag snapshot, and a second-setup refusal. A plan edit is a separate operation. |
| `rebuild/m4/workout/athlete-state.cjs:111,129` | Exercise document has eight members; constructor initializes unknown load and empty forks. Do not reinitialize enrolled state to edit one lift. |
| `rebuild/client/index.cjs:197,226,248,270` | `planEdit({domain,value,unit})` is scalar, uses snapshot basis or `basis-0`, and cannot express this reviewed dated intent. Ops and outbox share one transaction. |
| `rebuild/client/ops.cjs:44`; `rebuild/client/plan.cjs:2` | Existing builder creates plan-mutation identity, member commitment and causal envelope. Local athlete edits and accepted/consented transactions are distinct. |
| `rebuild/m3/w6/t2-stage.cjs:9,63` | Stage admits `workout`, not literal `planEdit`; injected commands can return a plan member to the existing builder. This is the proposed transport seam. |
| `rebuild/m3/w6/local/host-bindings.mjs:229,261,283` | Host bindings share the installation repository, lease and clock; commands are injected; the existing synchronous commit validator must remain composed. |
| `rebuild/m3/w6/bridge.mjs:14,40`; `repository.mjs:239,244,259` | CAS failures can restage against a newer generation. Final synchronous validation runs inside the transaction, and Saved follows completion. |
| `rebuild/m3/w6/build-browser.mjs:36`; `node-sha256-browser.mjs:22` | Browser crypto rewriting admits exact existing client importers only. The host uses the existing SHA256 browser adapter and injects hashing into the pure model; no build allowlist change. |
| `rebuild/m3/w6/public-client.mjs:213,256` | Authenticated storage is not alone proof of local immutable operation identity; local-history authentication must reach T2 on companion reads and writes. |
| `rebuild/engine/plan.cjs:59,87` | Names have their own dated `renames` seams. `exActive` treats any retirement as inactive, without querying its date; future retirement cannot be put into today's projection. |
| `rebuild/m4/workout/workout-basis.cjs:40`; `rebuild/m3/w6/local/today-bindings.mjs:305,348` | Current gym composition captures engineState and static plan-basis labels. Edited-plan state and actual operation basis must travel together. |
| `rebuild/m3/w7-preview/today/today-entry.mjs:160,175`; `rebuild/m3/w6/host/workout-host.mjs:189` | Refresh reads a captured host; it does not itself substitute a changed plan. C must bind a fresh eligible host without discarding active drafts. |
| `rebuild/coach/machine-settings-commands.cjs:33,48,139,156`; `local-world.mjs:150` | Existing note producer/readback/host: 80-character ID, at most 12 settings, 40-character setting text, 400-character cues, at least one answer. Rename preserves ID; replacement must not inherit notes. |

This is recon of named public modules only. No athlete fixture, seed, ledger, private history or protected soak was read.

## 3. Proposed new paths and interfaces

All listed files are NEW and D-owned for this package; no existing client, Today, engine or coach module is edited by this contract.

| New path | Interface and responsibility |
| --- | --- |
| `rebuild/m4/workout/plan-edit-commands.cjs` | `createPlanEditCommands({validateTags})` returns `{schemaVersion:2,prepare,validate}`; exports `PROFILE`, `ACTION`, `nextLocalDate` and input validation. Descriptor-safe closed records refuse getters, bad prototypes, symbols, non-enumerable members, sparse arrays, nonfinite quantities and unknown fields. |
| `rebuild/m4/workout/plan-edit-model.cjs` | `createPlanEditProjector({basisState,setupOperation,validateTags,projectNewExerciseTags,hashBasis}).read(generation,date)` returns frozen `{state,plan_basis,causal_parents,pending_dates,applied_ids,intents}` or an explicit refusal. `plan_basis` covers current and pending history independently of projection date. |
| `rebuild/m3/w6/host/plan-edit-host.mjs` | `createPlanEditHost({client,clock,basisState,setupOperation,validateTags,projectNewExerciseTags,newIntentId})`; `read(date?)`, `review(edit)`, `save(review_id)`, `cancel(review_id)`, `close()`. Uses the already-open installation and its existing clock. C supplies the trusted base projection and stable new exercise IDs, never renderer-authored state. |
| `rebuild/lanes/d/plan-edit/model.test.cjs` | Synthetic pure command/projector, identity/history and malformed-input cells. |
| `rebuild/lanes/d/plan-edit/durable-host.test.mjs` | Real existing encrypted repository, stage and local-era composition; failure, retry, reopen and captured-basis cells. |

`validateTags(exercise,tags)` is C's injected F2 validator over its canonical taxonomy; it returns true or refuses. No copied catalogue/anatomy list.
`projectNewExerciseTags(exercise,tags,{op_id,date})` is required for add/replace and supplies the source-owned F2 tag marker, including derived regionsByMuscle. It may not borrow another row's provenance; a missing binding refuses. Synthetic adapter tests do not claim the actual C/F2 integration is proved.
`hashBasis(canonicalText)` is required by the pure model and must return exactly 64 lowercase hexadecimal characters. The durable host binds the existing W6 browser SHA256 adapter internally; C's host interface remains unchanged. The model reuses client canonical encoding and imports no Node crypto.
The host/provider shape may be refined before code freeze to match C's real composition; any changed interface is named in REQUESTS before consumer implementation.

## 4. Proposed closed intent and operation

These profile/member/action names and shapes are INVENTED implementation vocabulary for PM review, not pre-existing wire law.
Request: `{action:'plan-edit',input:{intent_id,seen_plan_basis,starts_on,edit,causal_parents}}`.
`intent_id` is a nonempty stable opaque ID minted once by the host when preparing a reviewed change, retained across retries. A renderer cannot select operation, actor, device, sequence, lease or commitment fields.
`edit` is exactly one of:

- `{kind:'update',exercise_id,changes}`: nonempty changes drawn only from `n,day,sets,hi,inc,steps`; omitted means unchanged.
- `{kind:'add',exercise,tags}`: exercise is the existing eight-field `{id,n,mg,day,sets,hi,inc,steps}` document; tags is its explicit F2 snapshot.
- `{kind:'replace',exercise_id,exercise,tags}`: distinct new ID, even for an identical label; old ID retained historically.
- `{kind:'remove',exercise_id}`: dated exclusion only.

C's reviewed draft supplies the new exercise ID once; the host validates uniqueness against all retained and pending identities and preserves it on failed-save retry and committed readback. No slug is regenerated during Save/replay.
Existing non-chip values remain exact. `sets`/`hi` are positive safe integers; increment and rungs are finite positive numbers; rungs ascend strictly. Day is an existing supported family with training coverage in the unchanged calendar, including F1's full-body family once its candidate is composed.
Prepared action: `kind:'plan-mutation',class:'plan',payload:null`, with `plan.domain:'training'` and one member:
`{field:'training.exercise-edit',unit:'record',provenance:'athlete_edited',value:{profile:'earned/plan-edit/v1',intent_id,starts_on,edit}}`.
`plan.seen_plan_basis` and `parents` carry the reviewed basis and its real causal parent IDs. Client `Ops.build` supplies identity, lineage, transaction and member commitments.
The member is a replayable intent, not a complete flat accepted-plan snapshot. Generic `Plan.project` retaining the latest member is not this package's programme projector.
Do not set `group_provenance:'consented'`, call acceptInitialPlan, create an authority record, or populate accepted-plan tables to make this local edit visible.
The operation's effective tuple is the existing client's authored local day/time/offset. `starts_on` is the following calendar date and is rechecked against that tuple after Ops.build. This avoids inventing a future midnight offset or second clock.
Input and the actually built envelope are both validated. A producer's shape validation cannot prove authentication or freshness; the durable host owns those proofs.

## 5. Reviewed basis and durable protocol

1. Read through the existing authenticated local-era path. Reconcile exact athlete/device/setup identity, one unambiguous first-run origin and the actual operation commitments. Refuse unproved/imported/conflicting historical contexts; do not invent a zero-import source or generic accepted basis.
2. C supplies the trusted unedited programme basis plus the matching first-run operation; current measured/history state remains on the existing factual-history path. Validate provenance and plan correspondence; do not take editor-provided state, regenerate setup, or replace measured/history collections.
3. Replay all qualifying structural operations over that origin in proven causal order, including previously saved changes waiting for tomorrow. Read current and next-date projections from the same generation.
4. Proposed `seen_plan_basis` is a deterministic commitment to the whole reviewed pending programme, setup identity/commitment, ordered contributing operation IDs/commitments, relevant rejection/tombstone outcomes and the reviewed local dates. It is not merely the selected exercise, a timestamp, a fresh counter or `basis-0`.
5. `review(edit)` is the single public preparation method. It captures an immutable private preparation with the complete basis, exact diff, stable intent/new ID, authored day and tomorrow date, returning display data and opaque `review_id`. `cancel(review_id)` invalidates that review, including during encryption; `close()` invalidates every review. Foreign, cancelled or body-changed handles cannot authorize Save. The injected producer's internal `prepare(request)` only constructs the action; it is not a second public host preparation method.
6. Before each staged attempt, recompute the full basis from that attempt's generation and compare with the preparation. Preserve the reviewed intent across the bridge's retries. A changed plan or local day returns the D2 stale-review refusal; it is never silently rebased.
7. Compose, never replace, the host bindings' stage and synchronous validateCommit. Validate the actual one-operation batch, exact reviewed members, parents, dates, identity and same still-live preparation at the final transaction boundary. Recheck liveDay synchronously there.
8. Existing client construction writes one operation and one outbox entry in one local transaction; the existing repository seals the whole generation and commits by revision/token CAS. No additional collection, editor store, acknowledgement cache or durable clock is introduced.
9. Return `Saved for {date}.` only with the existing completed durable acknowledgement and exact stored intent identity. Failure retains the draft. If commit outcome is uncertain, authenticated disk resolves that intent before another attempt; never duplicate it because UI confirmation was lost.
10. Reopen reconstructs projections and saved intent IDs from stored operations. No in-memory preparation is required to see a completed edit; no draft flag establishes saved state. Lease, integrity, session/era closure and late context refusals propagate unchanged.

The full pending-plan basis covers edits to other exercises too. Unrelated non-plan generation changes may safely restage only after recomputing and matching that same basis; no global revision-only last-writer-wins rule.
Rejection/tombstone status is part of replay, not a date/device-sequence sorting shortcut. Exclude only qualified inactive operations; reject dangling parents, cycles, contradictory identity, concurrent incomparable edits and surviving descendants of invalidated basis rather than inventing an order or applying stale inherited content.
Machine settings retain the existing producer/profile/readback and host. C's editor supplies descriptor-safe review, selected-ID and stale-context guards around that existing command; this companion does not fork the note protocol or interpret numbers in the athlete's text.

## 6. Dated and historical projection

Projection is pure clone-and-freeze. Preserve all measurements, session facts/captures, operation records, standards, loads, technique forks and unrelated fields. Never call legacy canonicalizePlan to mutate a whole enrolled history for an editor change.
Before starts_on, a structural edit changes no active exercise, order or retirement. On/after starts_on, apply only its explicit fields. Consecutive pending saves compose before the next review.
Rename keeps ID and all evidence; append the engine's dated `{from,prevN}` name seam, not a technique fork. Multiple same-date renames preserve the correct pre-date name deterministically.
Add/replace uses a new retained identity with unknown `w:null` and empty own technique history. Replacement retires the old identity only in projections on/after its date and occupies its prior order position; unrelated order remains unchanged. Add uses existing day order without a reorder feature.
Remove keeps the historical exercise record and applies retirement only in the eligible dated projection. Historical reads use their own dated projection and the original captured session basis, never tomorrow's active map.
Unchanged tags, explicit empty secondary arrays, absence and catalogue-independent snapshots are preserved. New identities use the exact reviewed F2 tags and validation; do not rerun first-run projection over enrolled history or borrow the old lift's F2 provenance.
Notes follow the same existing ID across renames. New IDs have no inherited note. Settings save does not touch equipment increments/rungs, load anchors or technique eras.

## 7. RED-first executable cells

| Cell | Required counterexample and witness |
| --- | --- |
| PE01 / EW01,02 | Open/preview/cancel create zero ops/outbox; one valid non-chip field edit preserves every unrelated programme/history value. |
| PE02 / EW03 | Rename around activation boundary and two same-date renames: stable ID, prior nameAt, unchanged load/forks/notes. |
| PE03 / EW04 | Duplicate-label replace/add: new unique ID stable on failed-save retry/reopen, unknown load, no old notes or borrowed captures. |
| PE04 / EW05 | Remove today versus tomorrow versus historical projection: no deletion, correct active order and original captured basis unchanged. |
| PE05 / EW08 | Equipment-only change, malformed/ragged/unsorted/nonfinite rungs and non-chip values; only chosen exercise changes. |
| PE06 / EW09 | Existing machine command and real note readback: rename keeps, replacement does not inherit, empty final note refuses. |
| PE07 / EW11 | Real built plan-mutation: exact member/domain, own actor, stable intent, next local date, real parents and whole pending-plan basis; hostile descriptors never execute. |
| PE08 / EW11 | Other-exercise save, same-exercise save, relevant tombstone/rejection, invalidated ancestor, missing parent, cycle and incomparable edits all defeat stale review without loss. |
| PE09 / EW12 | Real encrypted generation: one intent plus outbox; abort, CAS race, stale retry, lease failure, integrity fault and close-during-encryption never report Saved. |
| PE10 / EW12,13 | Durable outcome followed by lost confirmation, retry and process reopen: exactly one intent; projections recovered from ops without an editor store. |
| PE11 / EW13 | Synthetic prior measurements/session facts and accepted machine notes survive byte-for-byte; imported or unqualified history refuses without a made-up baseline. |
| PE12 / EW14 | Actual future gym creation uses projected state and its matching operation basis; current/open workout capture and unsaved gym/check-in fields remain unchanged. |
| PE13 / EW15 | F1 full-body families and F2 empty/absent/specific/coarse tags: valid existing tags preserved; new selection uses its previewed snapshot after catalogue changes. |
| PE14 / :176 | Pending exercises compose across repeated saves; leap/month/year boundary arithmetic; midnight between review/stage/commit requires fresh review and a newly displayed start date. |

PE12 is a consumer composition proof jointly supplied with C, not satisfied by an injected fake gym. EW16 DOM/copy/viewport/focus remains C's editor and D2's review scope.
Actual future gym creation with its matching operation-derived basis and preservation of current/open workout, unsaved gym and check-in drafts are mandatory for end-to-end acceptance. Browser graph compilation and synthetic adapters do not satisfy PE12.
Run appropriate existing setup, workout, check-in, note and F1/F2 regressions on the exact composed candidate. No private/seed/source-history/soak fixture is permitted; synthetic logs stay in the lane's `.tmp`.
Exact companion command: `node --test --test-reporter=tap rebuild/lanes/d/plan-edit/model.test.cjs rebuild/lanes/d/plan-edit/durable-host.test.mjs rebuild/lanes/d/plan-edit/browser-build.test.mjs`.
Fault commands: `node rebuild/lanes/d/plan-edit/model-mutants.cjs` and `node rebuild/lanes/d/plan-edit/host-mutants.mjs`; run without construction-source overrides on the composed candidate.
CI handoff to lane B under DECISIONS:178: register those exact modules/commands on Windows and Ubuntu, using the existing pinned W5/W6 dependencies; publish exact-head run IDs. D does not edit workflows or claim local counts as both-OS CI.
Engine-consumed m4 work retains its applicable closed cumulative profile, ancestor/parent pins, private verdict, receipt, authorized rerun and re-verification admission. B supplies that admission and PM judges; plumbing proof or this brief does not waive it or grant sealing/tooling custody to D.

## 8. Delivery size and outstanding joins

Proposed size: three new runtime modules, two new test modules; target at most 900 runtime lines and 650 synthetic test lines. This is an estimate to make the package reviewable, not a test-count claim.
Built size at product `8a094da`: runtime 481 lines in three new modules; 629 lines in the two proposed suites, plus 46 lines for the browser graph/negative control and 134 lines in two mutation harnesses. These additional proof files stay under lane D; runtime custody is unchanged.
The scalar-method limitation is explicit: implementation uses the existing producer-injected client plan-mutation builder and durability path under :176, not an unapproved stage command or client-core edit.
Still to prove: same-generation authenticated durable wrapper; complete causal/rejection basis; operation-derived workout basis; historical tag/projection correspondence. These are mandatory implementation cells, not deferred defects.
C must confirm via REQUESTS the trusted base projection, live installation day, returned dated state/basis and refresh/new-gym hookup. Existing captured-state/static-basis hosts cannot meet EW14 by a redraw alone.
If a required imported/history context lacks a qualified source projector, return a named refusal and report the missing join; do not declare the entire UI outcome complete or guess the athlete's programme.
Candidate/report/STATUS are authored by D after evidence; PM alone judges. No acceptance line, commit, push, merge, deployment or Today/client-core modification is part of this brief-writing step.
