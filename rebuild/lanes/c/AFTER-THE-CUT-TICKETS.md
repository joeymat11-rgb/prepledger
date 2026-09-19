# AFTER THE CUT: FOUR TICKETS FOR PM4

Paper by Astra, 2026-09-19. No ruling, product change, test authoring, or cut review.
Head: e08bc11cec423e5d5878110e78d16ccc5f3f8a29; branch rebuild/c-after-the-cut-tickets.
T = rebuild/m3/w7-preview/today. W = rebuild/m3/w6.
F = rebuild/lanes/c/today-split/writer-fence.test.mjs.
Spec = rebuild/lanes/c/TODAY-SPLIT-SPEC.md; R2 = TODAY-SPLIT-BUILD-REPORT-2.md in that directory.
S8 = rebuild/m4/spec/acceptance-s8-real-shape.json. Code citations are physical lines at this head.
READ means source inspection, including deductions explicitly labelled as such. MEASURED means executed here on synthetic inputs; it does not inherit another author's run.
Every design and row below is PROPOSED, unbuilt and unexecuted. Sizes are estimates of changed files, authored lines (excluding verbatim moves), and rows; not elapsed time.
Ledger citations refer to the six requested single lines of refs/remotes/origin/rebuild/t2-client-core:rebuild/DECISIONS.md, read individually without fetching.
"Released" below describes the split's intended custody, not an assertion that S10 has sealed or released this branch already.

Shared durable tail, READ (expanded here once, used by each trace):
- W/public-client.mjs:597 execute -> enqueue -> completedOutcome(bridge.execute) at :600; Start instead enters startPreparedWorkout at :432 and bridge.execute at :458.
- W/bridge.mjs:61 execute clones input -> enqueue (:8) -> perform (:13) -> repository.load (:17) -> injected stage (:18) -> successful-result/batch checks (:21,:28) -> validateCommit through repository.commit (:45).
- W/repository.mjs:300 commit clones generation -> seal (:301) -> sealAdoption (:306) -> publish (:307,:215) -> revision/token checks (:239) -> write (:244), synchronous validator (:246), store.put previous/active (:249,:250), optional adoption put (:256), transaction completion (:259).
This is a source trace to the durable put, not an executed transaction or a review of the injected producers/stage. No repository instance or private data was opened.

## T1 GYM-SETTINGS-WRITER-SEAL

1. WHAT THE CODE DOES TODAY
- READ T/gym-app.mjs:213 settingsPaint obtains facade.entryFor at :223; settings-open click (:232) -> MachineSettingsView.draftFrom (:233; T/machine-settings-view.mjs:28) -> paint (:235). Save click (:249) -> recordSettings (:257) -> hooks.saving (:250; T/gym-settings-lane.mjs:100).
- READ T/gym-app.mjs:258 the released recordSettings decides whether this mount, draft identity and lift may write; :267 calls machineFromDraft, :268 refuses an empty draft, :269 calls acceptable, :274 disables the current node, :276 chooses the machine passed to facade.lane().save. These are released decisions about WHETHER/WHAT is stored.
- READ T/machine-settings-view.mjs:39 machineFromDraft selects exercise_id, trims fields, drops blank rows and omits empty cues (:40-:47); acceptable (:53) asks the producer's machineOf (:55). The released caller invokes these existing rules; no new validator is needed.
- READ T/gym-settings-lane.mjs:88 facade.lane returns the actual host. T/machine-settings-host.mjs:93 save checks alive, then client.execute('workout', {action: ACTION, input: {machine}}) (:97) -> shared durable tail. The coach producer is supplied at :72. Post-save draft clearing/cache refresh remain at T/gym-app.mjs:282,:287,:288.
- MEASURED T/gym-settings-lane.mjs:51,:58,:93: after startRead('synthetic-lift') on a synthetic latest() host, entryFor returns the same unfrozen entry; assigning its state changes stateFor, and editing nested settings changes the next entryFor result. No host save or real durable put was executed.
- READ T/gym-app.mjs:388,:414,:468,:474 uses a released busy flag for set/finish/advance/undo; settingsSaving is only a promise slot (T/gym-settings-lane.mjs:36,:100), not an entry refusal. Other call paths: logSet (:390) -> T/gym-model.mjs:502 prepareWorkoutContinuation (:508) -> executeResumedWorkout (:510); finishNow (:413) -> finish (:538) -> continuation (:539) -> executeResumedWorkout (:542); undo (:476) -> undo (:526) -> prepareWorkoutEdit (:527) -> commitWorkoutEdit (:529). W/public-client.mjs:387,:365 reach bridge.execute and the shared tail.
- READ T/gym-app.mjs:469 -> T/gym-model.mjs:536 forget only assigns saved = null; it has NO durable tail. Start (:517) is T2; recovery (T/today-app.cjs:750) is T3's proposed boundary work. These distinctions matter to STOP 6's subject count.

2. THE INVARIANT WANTED
A released settings view passes raw answers and a sealed editor token to a sealed writer, cannot change cached reads or acquire the settings host for drawing/admission (apart from the exactly pinned public passthrough), and cannot initiate a second same-writer operation while the first is pending (DECISIONS:574 S-R29/G1; Spec B.9:1322 and B.3:687, with the flag bundle's scope still open).

3. WHAT CAN GO WRONG FOR THE ATHLETE TODAY
- READ T/gym-app.mjs:223,:233,:267 and T/gym-settings-lane.mjs:93 imply this later-look failure: a look edit mutates a cached Seat value while formatting it; opening the editor then seeds that changed value, and Save can record it. The existing displayed reader is not shown doing that mutation. Nothing reachable was demonstrated in today's unmodified UI; the cache risk is to a later look ticket.
- READ T/gym-app.mjs:249,:274,:276 has no sealed pending check; a replacement enabled Save node during a pending operation could submit again. This is a candidate sequence for a red row, not a demonstrated duplicate durable record. Existing node disabling, stale-draft checks and lower-layer refusals must be preserved and measured.

4. SMALLEST DESIGN, AND ONE ALTERNATIVE
- PROPOSED minimum: put recordSettings admission, save and completion ownership in the existing gym-settings-lane. Mint editSeq/editLift on open; invalidate on cancel, replacement editor and leave; compare before save and before applying the result. Copy raw draft values at entry. Return typed status; keep draft/error DOM painting released. Deep-clone then recursively freeze returned read data; replace drawing/admission lane() calls with readiness data and narrowly owned hooks. Preserve first.settings.lane through a separate exact-window API passthrough (Spec B.7:1003); do not let the drawing facade acquire that host.
- PROPOSED custody detail: move machineFromDraft/acceptable bodies into that lane and re-export them from machine-settings-view, avoiding a sealed import of a drawing module or a duplicated rule. This changes S-R11's future pinned-unchanged disposition and needs explicit declaration. The helper relocation is a pure move; caller/signature rewrites are declared statement rewrites; editor tokens, invalidation, snapshots and in-flight checks are NEW WRITER LOGIC requiring their own writer-path review.
- PROPOSED alternative: retain the existing identity protocol inside a sealed settings controller that owns the draft identity and issues detached editable snapshots. Same producer and copy stay in their current roles. This needs broader editor-state migration and NEW WRITER LOGIC; freezing the facade wrapper alone is not an alternative that meets S-R29.
- PROPOSED flag bundle: add sealed wrappers for the agreed gym subjects, set pending before await and clear in finally, with a silent in-flight result. A gesture guard and a pending flag solve different problems. Do not turn STOP 6's disputed count into seven invented gym functions; T3/T4 may carry the weigh-in/food flags that B.3 actually names.

5. FILES TOUCHED
- READ S8:696 T/gym-app.mjs = sealed S8 product key; proposed main caller edits.
- READ T/gym-settings-lane.mjs:4 = born by split; proposed writer, snapshots, hooks, and moved pure helpers.
- READ S8 product/executionPins key sets (:200,:1600): T/machine-settings-view.mjs is free in S8, but Spec:1335 fixes it as S10 pinned-unchanged; the proposed helper move requires a declared changed disposition.
- READ S8:756,:1611 T/test/machine-settings-ui.test.mjs = sealed S8 product AND executionPins key; F = free in S8, born as split tooling. Both gain the proposed rows.
- READ S8:751,:1610 T/test/gym.test.mjs = sealed S8 product AND executionPins key if the wider gym flag bundle lands. No host, producer or build dependency needs changing in the minimum design.

6. ROWS, RED FIRST
- PROPOSED T1-STALE-EDITOR: plant wrong seq/lift, cancel-then-save, replacement editor, leave-before-submit; zero new operations. T1-LATE-RESULT: old completion cannot clear or paint a new draft, but a committed save still refreshes its lift.
- PROPOSED T1-RAW-ANSWER-PARITY: empty, partially blank, cues-only, whitespace, producer refusal and success preserve the old payload/refusal; compare operations after reopen. T1-IN-FLIGHT: two dispatched saves with the first deferred produce at most one operation; retry after settled failure remains possible.
- PROPOSED T1-DETACHED-DEEP-READ: change wrapper state and nested rows; a fresh facade read is unchanged and returned nested data is frozen. RED on today's mutable entry, then replace F:1404 "S-R29 recorded laxity" deliberately; do not merely delete it.
- READ F:202,:789,:552,:958 holds six gym seams, acquisition windows and imports. PROPOSED remove the settings save seam and drawing/admission lane acquisitions, preserve only the separately pinned public passthrough (Spec:1003), change import rows for the moved helpers, and keep look-only controls green. F:882's three shallow wrappers cannot stand as the new deep-copy proof. Add T1-PUBLIC-API-PARITY for first.settings key order, descriptors and promised host identity; adding a separate API object changes wrapper-count assertions deliberately.
- READ F:1755,:1817,:1899 exempts 19 gym listeners and guards two writers. PROPOSED route gym listeners through a sealed shim, lower the exemption to zero, and add five named subjects from Spec E.6:1814-:1818: settings/logSet/finish/forget/undo (2 of 9 -> 7 of 9 as the spec counts). The forget classification remains an open fact, not quietly corrected here. Start stays exempt pending T2.

7. ORDER
DECISIONS:574 explicitly fixes AFTER part 2 and BEFORE S10 for G1 and S-R29. Sealing the known settings defect first would contradict that ruling and force a reseal. The author recommends attaching STOP 6 (R2:82-:92); :574 previously assigned the flag to part 2. Reassigning it and fixing its exact subjects is PM4's open ruling, not this paper's decision.

8. SIZE
Minimum core: 5 files, about 150-230 authored lines plus helper moves, 12-16 rows. Gym-wrapper bundle: 1 additional test file, about 60-110 more authored lines, 8-12 rows. Alternative controller: 5-6 files, 220-340 authored lines, 18-24 rows. Shared fence rows count once across tickets.

9. WHAT THE OWNER WOULD NOTICE
Normally nothing: same settings, refusals and saved notes. A stale or repeated submission must stop quietly; a late completion must not take over his new editor.

## T2 GYM-START-IN-PAINT

1. WHAT THE CODE DOES TODAY
- READ T/today-app.cjs:745 primary click -> render('workout', true) (:754); render's workout branch (:1781) -> workout.open (:1786). T/today-entry.mjs:218 open -> mountGym. Separately requestedScreen (:1831) reads ?screen=workout and boot renders it (:1862).
- READ T/gym-app.mjs:99 mountGym -> first = paint() (:539) -> paint (:506) -> await model.read (:511) -> released phase === 'ready' decision (:516) -> model.start (:517) -> onChanged (:519) -> recursive paint (:520). The released phase branch decides WHETHER a Start is stored, not its payload.
- READ T/gym-model.mjs:395 read -> history (:398) -> sessionsToday (:400) -> prepareWorkout (:408) -> orderRefusal (:421) -> preparedId (:423). start (:472) checks adoption (:478), prepares if needed (:482), rechecks order (:487), then startPreparedWorkout (:489). W/public-client.mjs:432 validates its handle, creates start args from captured plan/parents (:456), and enters the shared durable tail (:458).
- MEASURED T/gym-app.mjs:506 paint body extracted unchanged into an in-memory function with a synthetic model: ready then finished caused 2 reads and 1 start call, with 0 DOM events. No full mount, real client or durable put was executed.

2. THE INVARIANT WANTED
Painting, repainting or booting a workout view never commits Start; only an explicit workout-start action may request the sealed Start operation (the follow-up purpose in DECISIONS:550 S-R12/:562/:574; the particular action/entry contract is still for PM4).

3. WHAT CAN GO WRONG FOR THE ATHLETE TODAY
- READ T/today-app.cjs:1831,:1862 and T/gym-app.mjs:516 imply that opening a workout URL on a ready day can record a Start before a new Start tap; leaving without sets can leave a started workout. This route-level sequence is source-derived, not driven here. Normal entry already follows the button labelled Start (:743), so that normal tap is not evidence of an unwanted workout.
- READ T/gym-model.mjs:478,:487 and W/public-client.mjs:438 retain adoption/order/preparation checks. This paper does not claim repeated paints create repeated valid Starts or bypass those checks.

4. SMALLEST DESIGN, AND ONE ALTERNATIVE
- PROPOSED minimum: paint a ready card without saving; its Start handler calls a sealed start hook synchronously under the listener shim, which awaits model.start and repaints on completion. Keep model preparation/adoption/order policy unchanged. Released readiness/presentation edits are declared statement rewrites; relocating the trigger and adding pending/gesture ownership are NEW WRITER LOGIC, never a pure move.
- PROPOSED alternative: preserve the existing single Start tap on Today by having that gesture mint a sealed, one-use start intent; an entry coordinator consumes it after preparation, before painting active. Opening a route alone supplies no intent. NEW WRITER LOGIC with more navigation, expiry and await-boundary cases; a boolean flag supplied by a released painter is not adequate authority.

5. FILES TOUCHED
- READ S8:696 T/gym-app.mjs = sealed S8 product; T/gym-settings-lane.mjs = born by split (existing model handoff can host the hook); F = free S8/split tooling; T/test/gym.test.mjs = sealed S8 product AND executionPins (:751,:1610). Minimum 4 files.
- READ S8:786,:1606 T/today-app.cjs = sealed S8 product and T/test/checkin.test.mjs = sealed S8 product AND executionPins; alternative may additionally change these to carry entry intent across Today/navigation. T/today-lanes.cjs = born by split. T/gym-model.mjs is free in S8 but future pinned-unchanged (Spec:2047); minimum needs no model edit.

6. ROWS, RED FIRST
- PROPOSED T2-PAINT-NO-START: ready first paint, repeated paint, optional-settings repaint and boot with workout route -> zero Start operations after reopen. RED on today's ready paint; count operations, not just a source spelling.
- PROPOSED T2-EXPLICIT-START: one accepted gesture -> one Start, then active card; already-started/finished/blocked/adoption-pending retain their current results. T2-PENDING-START: repeated gesture, navigation during prepare/save and thrown/uncertain outcome preserve one attempt and honest state.
- READ F:995 E.5 row 16 asserts exactly one paint writer; :1010 rejects a second. PROPOSED replace with ZERO and a red plant for the FIRST start, through both direct and hook calls. Keep nonwriter first-paint/openers as positive controls.
- READ F:1817 counts two guarded entries and Spec:1821 excludes start. PROPOSED add start once its paint reach is removed: after all agreed nine subjects, the list becomes ten as historically counted, subject to the forget correction. The runtime entry check must occur before await; a gesture counter is not retained throughout the asynchronous save.

7. ORDER
:550/:562/:574 fix a separate ticket after the split and forbid changing Start during the pure move. They do NOT explicitly require T2 before S10. Before S10 avoids sealing a known exception; a later reseal CHILD is technically possible only if PM4 expressly carries the exception into S10 (Spec:1840-:1844). New Start custody/trigger and whether it changes the visible action are open. This paper does not convert that preference into an existing ruling.

8. SIZE
Minimum: 4 files, 60-100 authored lines, 8-12 rows. Intent alternative: 6-7 files, 130-210 authored lines, 12-18 rows. No changes to capture or workout admission are priced.

9. WHAT THE OWNER WOULD NOTICE
Minimum design may add a Start action inside the ready card and therefore an extra tap; that needs a PM/product choice. The intent alternative can preserve today's single Start tap. Opening a workout link alone would no longer start a session.

## T3 TODAY-MODEL-HANDOFF

1. WHAT THE CODE DOES TODAY
- READ T/today-app.cjs:855 weigh-in submit listener -> released disabled check (:864) -> trim (:866) -> empty-string/Number conversion and model.weighIn (:868). The released conversion determines the VALUE handed to the writer; the disabled check decides whether a concurrent request reaches it. The catch (:869) supplies the current failure sentence.
- READ T/today-model.cjs:412 createReadingsWriter receives day/readings/adoptedRead/stateFromOps/read/NO_STORE/setMessage; its functions are returned again at :440, and the raw readings host at :443. T/today-readings.cjs:46 weighIn refuses an adopted same-day reading (:50), out-of-form-range/precision value (:54), or missing host (:59); readings.weighIn({date: day, lb}) (:63) is the writer call.
- READ T/reading-host.mjs:41 delegates to era.createReadingHost; W/local/today-bindings.mjs:340 weighIn -> client.execute('weighIn') (:342); W/local/local-client.mjs:347 execute -> bridge.execute (:352) -> shared durable tail. The date is chosen in the reading writer, not the released input field.
- MEASURED T/today-readings.cjs:46 with a synthetic host: 10000 was refused, 180 forwarded once as {date: '2026-09-03', lb: 180}. This verifies the extracted writer's form branch only; no durable store or full Today submit was executed.
- READ T/today-readings.cjs:69 reopen -> readings.restart (:71) -> W/local/today-bindings.mjs:346 client.boot. W/local/local-client.mjs:291 can renew a due lease and repository.commit (:295), then bridge.reopen (:301). Reopen is not another weight submission; it still exposes a path with possible durable metadata work. No such call appears in the released submit trace.
- READ F:1713,:1718 pins 32 code-position model identifiers by equality. T/today-app.cjs:357,:384 are parameter/handoff; remaining uses include read (:635), food/sleep projections (:1022,:1219), today (:1352), engine.sleepSpanH (:1444), stateFromOps (:1576), and returned read (:1898). Renaming the variable would not remove this capability.
- READ T/today-app.cjs:745 stranded-workout click -> facade.workout().recover (:750) -> T/today-entry.mjs:202 recover -> gym.closeUnfinished (:204) -> T/gym-model.mjs:564 hostForDay -> prepareWorkoutContinuation (:566) -> executeResumedWorkout close/early (:569) -> W/public-client.mjs:387 bridge.execute -> shared tail. Released stranded-branch selection and disabled control (:746,:749) remain outside the seal.

2. THE INVARIANT WANTED
After the single model handoff, the released Today view can read only declared projections and submit raw weight through a sealed gesture/pending hook, with zero remaining writer-capable model uses (Spec B.3:678, B.7, SEAM 1:1067; DECISIONS:550 S-R10/S-R12 and R2 STOP 1).

3. WHAT CAN GO WRONG FOR THE ATHLETE TODAY
- READ T/today-app.cjs:864 and T/today-readings.cjs:50,:54 already protect the normal submit with a disabled button and form/duplicate rules. No bad weight or lost record was demonstrated. For the missing handoff itself: nothing reachable was demonstrated; the risk is to a later look ticket that changes conversion, bypasses a UI-only pending guard or calls the retained writer from painting.
- READ T/today-app.cjs:750 is a real recovery gesture today, not an accidental paint write. Moving it into a guarded hook is needed if PM4 expects E.6's outstanding recovery subject closed by these four tickets; a model-only substitution will not close it.

4. SMALLEST DESIGN, AND ONE ALTERNATIVE
- PROPOSED minimum: add individual facade projections in today-lanes; rewrite post-handoff model reads without changing freshness, null fallbacks, argument defaults or the exported createTodayModel surface. Expose sleepSpanH by reference as the spec requires, not the whole engine. Preserve read/stateFromOps result semantics; never return the raw model/readings as a shortcut.
- PROPOSED sealed submitWeighIn(rawText) owns the empty/Number conversion, existing invocation and catch-result policy, plus pending and gesture checks. The view keeps field access, display and navigation. Plain projection rewrites are declared statement rewrites; the submit relocation includes pure moved statements, but new guards/capability routing are NEW WRITER LOGIC requiring writer-path review.
- PROPOSED add recoverWorkout behind the same sealed table and gesture guard; keep workout.open/summary entry behavior, while forbidding released acquisition of recover except declared API passthroughs. This is an explicit scope addition to STOP 1, for PM4 to assign; it closes the second outstanding Today gesture subject without changing the recovery producer.
- PROPOSED alternative: split model construction into a read-only object and separate sealed commands before mountToday receives it; move the raw host handoff into sealed composition and pass only the read object to the view. This can enforce a stronger boundary but changes entry/public callers and the factory contract. It is NEW WRITER LOGIC and a wider declared interface rewrite, not a variable rename or pure move.

5. FILES TOUCHED
- READ S8:786 T/today-app.cjs = sealed S8 product; T/today-lanes.cjs = born by split; F = free S8/split tooling; T/test/checkin.test.mjs and T/test/gym.test.mjs = sealed S8 product AND executionPins (:731,:751,:1606,:1610). Minimum including recovery: 5 files.
- READ S8 product/executionPins key sets: T/today-model.cjs is free in S8; T/today-readings.cjs is born by split. The minimum preserves both; the constructor alternative changes these plus T/today-entry.mjs (sealed S8 product) and likely T/test/adapter.test.mjs (sealed S8 product AND executionPins).
- READ Spec:1850,:2046 retains a choice over today-model custody. Free in this S8 inventory does not mean permission to redesign its injected writer dependencies in a look ticket.

6. ROWS, RED FIRST
- PROPOSED T3-HANDOFF-NO-CAPABILITY: retain one post-handoff model use, destructured alias, returned raw model, readings handle or writer through a facade; each fails. Keep extra projection fields and ordinary look edits green.
- READ F:1713,:1720 is 32 with assert.equal, despite its "ceiling" label. PROPOSED replace FENCE-MODEL-HELD/E.5 row 8 with the requested 32 -> ZERO retained-use rule: pin the two legitimate parameter/handoff acquisition sites separately, then assert zero outside them, and fail on the FIRST new retained use. This is 2 total identifiers under Spec:678, not 0 total; PM4 must settle the counting wording rather than a renamed alias fooling the row.
- PROPOSED T3-WEIGHT-PARITY: empty, whitespace, nonnumeric, range endpoints, excess precision, existing reading, no store, refusal and success retain payload, acknowledgment and exact copy after reopen. T3-WEIGHT-PENDING: deferred same-form second event cannot create another operation; settling refusal permits retry. T3-PROJECTION-LIVE: new read/basis/day results still paint without reopening the mount. T3-PUBLIC-API-PARITY preserves module exports, mount API key order, live ready accessor and the exactly pinned sleep/workout passthroughs (Spec:938,:1010).
- READ F:225,:1633 permits three Today seams including model.weighIn and recover. PROPOSED retire those two sites; retain the explicitly unrelated importScreen.reopen site. Update measured model/holder windows and import controls, not just the numeric ceiling.
- READ F:1817,:1899 guards two entries. PROPOSED add submitWeighIn and, if assigned here, recoverWorkout: 2 -> 4 of the historical 9; with T1's five additions -> 9 of 9. Add outside-gesture zero-operation and real-dispatch positive rows for each. Re-measure reachability before accepting that denominator.

7. ORDER
DECISIONS:550 fixes the writer sibling and one-handoff direction; R2:37-:47 explicitly asks the PM to rule STOP 1's follow-up. No cited line specifically assigns T3's landing order. Meeting the stated release boundary requires it BEFORE S10; sealing today-lanes first knowingly prices a reseal. A reseal CHILD is possible only if PM4 explicitly accepts the remaining model access as S10 debt. Recovery's assignment and the stronger constructor alternative are open.

8. SIZE
Minimum with recovery: 5 files, 100-180 authored lines, 12-18 rows. Constructor alternative: 8-9 files, 180-300 authored lines, 18-26 rows. The input conversion is small; public API compatibility, projection defaults and capability windows make up the rest.

9. WHAT THE OWNER WOULD NOTICE
Normally nothing: the same morning value, validation, recovery action and screen. Repeated submissions while a write is pending are quietly suppressed.

## T4 TODAY-OUTCOME-TYPE

1. WHAT THE CODE DOES TODAY
- READ T/today-app.cjs:1068 Save click -> hooks.recordIntake(save, cal, pro, error); T/today-lanes.cjs:907 gesture wrapper -> foodSaving = recordIntake (:351). That function reads cal.value/pro.value (:353), runs FoodModel.refusalFor (:354), chooses dayFromEntry (:359), and foodLane.save (:366). The sealed-to-be writer currently touches DOM; the released fields supply raw answers, with admission performed in the moved body.
- READ T/today-lanes.cjs:254 foodEntryFor.save -> host.save (:255) -> T/food-host.mjs:104 save -> foodClient.execute (:108) -> shared durable tail. Unknown write and unavailable readback remain separate state (:368,:387); refusal sentences are composed at :356 and :379.
- READ T/today-app.cjs:1423 Sleep Save -> hooks.recordSleep(map); T/today-lanes.cjs:909 gesture wrapper -> sleepSaving = recordSleep (:484). The map parameter is unused throughout :484-:607. The writer instead reads sleepDraftHeld (:499), sealed date/rollover (:490-:496), refusalFor (:500), nightFromEntry (:505), and supersedes from sleepOpsFor (:510-:511).
- READ T/today-lanes.cjs:520 sleepLane.save(night, {supersedes}) -> sleepEntryFor.save (:161) -> host.save (:162) -> T/sleep-host.mjs:136 pre-read/source/staleness checks (:141-:153) -> sleepClient.execute (:158) -> shared durable tail. Committed-sleep reconciliation and consumer rebind remain at T/today-lanes.cjs:538,:604.
- READ T/today-lanes.cjs:38 injects twelve named copy values; :489 say composes/holds sleepErrorText and repaints. The eleven B.6 paths include clears (:492,:549), rollover (:496), admission refusal (:502), uncertain outcomes (:528,:557), not-saved (:564), late-refusal choices (:578) and suffix (:581). retrySleepRead (:452) adds the separate composition at :467. These are status choices, not a second choice of stored night.
- READ T/today-app.cjs:1422 still disables sleep Save from busy/unknown/readback. T/today-lanes.cjs:485 independently fences those three states. Passing map currently grants no exercised capability in recordSleep; passing live food controls does, since their values/text/disabled properties are accessed.

2. THE INVARIANT WANTED
Food/sleep writer hooks consume raw data rather than DOM nodes and expose a closed outcome value whose released mapper reproduces every existing sentence, while all record/refusal/uncertain-write decisions stay sealed (Spec B.3:598, B.6:849-:912; DECISIONS:550 S-R13 and R2 STOPs 2/3).

3. WHAT CAN GO WRONG FOR THE ATHLETE TODAY
- READ T/today-lanes.cjs:356,:379,:489 currently composes the existing reviewed copy, and :485,:538,:556 retains the unknown-write fence. No incorrect durable food/night or misleading sentence was demonstrated from the missing outcome type. Nothing reachable was demonstrated; the main risk is a later copy/look ticket interacting with writer-owned composition or live controls.
- READ T/today-lanes.cjs:484's unused map is an interface violation, not evidence that sleep Save reads the wrong node. Food's node mutation at :374,:379 can target a detached node after a repaint; whether that leaves a missing visible refusal needs a driven navigation/repaint row, not a claim of data loss.

4. SMALLEST DESIGN, AND ONE ALTERNATIVE
- PROPOSED minimum: recordIntake takes raw {cal, pro}; return/store structured validation/refusal/readback outcomes and let the released handler/mapper own disabled and error nodes. Remove recordSleep's unused map argument; keep its raw bound sleep draft and sealed date/precondition ownership unchanged. This satisfies the DOM-argument rule without a new sleep-draft protocol.
- PROPOSED convert all three regions, including retrySleepRead, to the B.6 outcome vocabulary; move exact string expressions into a released mapper, keep raw code/copy fields where required, and preserve when ownership permits painting versus when committed consumer state must update. Retire twelve copy injections and sleepErrorText in favor of an immutable outcome. Do not substitute one free-form message property for the named constants.
- PROPOSED classify: removing the unused map is a declared signature/call rewrite; moving exact sentence expressions is a declared statement rewrite. Returning outcomes, handling async state and adding a sealed food pending flag are NEW WRITER LOGIC at the boundary and require writer-path review even if payloads stay identical. Add the flag if the DOM disabled guard is no longer the only entry fence (scope shared with T1 STOP 6).
- PROPOSED alternative: split T4 into a typed-outcome rewrite first and a raw-argument rewrite second, preserving existing nodes until the second is ready. Each stage needs declared rewrites and independent behavioral evidence; only the completed pair meets the invariant. A data-only sleep snapshot on every Save is possible but broadens this ticket into draft/clock ownership and is not needed merely to remove map.

5. FILES TOUCHED
- READ S8:786 T/today-app.cjs = sealed S8 product; T/today-lanes.cjs = born by split; F = free S8/split tooling.
- READ S8:746,:771,:736,:1609,:1614,:1607 T/test/food.test.mjs, T/test/problem.test.mjs, T/test/copy.test.mjs = each sealed S8 product AND executionPins. Proposed cases move assertions to their real writer/mapper owner without losing the old payload and copy checks.
- READ Spec:1335 food-model.cjs and sleep-model.cjs are free in S8 but fixed as S10 pinned-unchanged; minimum changes neither. No new host, producer, module input or copy-source-list widening is proposed.

6. ROWS, RED FIRST
- PROPOSED T4-RAW-HOOK-ARGS: the actual food/sleep DOM listeners must pass only raw data/no argument; fail if a node, map of nodes, event or node-bearing wrapper crosses a durable hook. Separately drive raw-value hooks successfully. hooks.listen/unlisten necessarily take elements and are explicit infrastructure exceptions, not durable commands.
- PROPOSED T4-OUTCOME-EXHAUSTIVE: null/rollover/refused/refused-before-write/uncertain/not-saved/late-refusal/retry-failed plus in-flight are exhaustively mapped; unknown kind is a failure. Pin exact lane-specific fields and success/ack/readback states before implementation; B.6's food detail needs completion, not invented blank fallbacks.
- PROPOSED T4-COPY-PARITY: drive all eleven sleep mappings, two food compositions and retry composition; exact copy/spacing for stale night, SLEEP_SOURCE_* and empty reason. RED mutant drops filter(Boolean): double-space output must fail. Keep the copy multiset and its declared source inventory.
- PROPOSED T4-DURABLE-PARITY: payload/date/supersedes, throw-then-land, throw-then-absent, unreadable reconciliation, failed readback after acknowledged commit, correction and navigation all retain the prior operation and consumer behavior. T4-FOOD-PENDING tests two dispatched saves with deferred completion and later retry.
- READ F:1669 checks no athlete-facing literals, but T/today-lanes.cjs:38 composes injected copy legally under that row. PROPOSED add FENCE-OUTCOME-NO-COPY-INJECTION and mapper-exhaustiveness evidence; retain FENCE-COPY-IN-SEAL rather than treating it as proof of B.6.
- READ F:1822,:1824 directly call the old DOM signatures. PROPOSED update them to raw/no-argument calls, retain real-listener positive controls (:1828) and zero-write negative controls. T4 does not increase E.6's subject count; it retains the two already guarded subjects while T1/T3 expand it.

7. ORDER
:550 S-R13 fixes zero literals; the present injection approach can meet that narrower row while B.6/B.3 remain unmet. :584 pre-rules only listed statement-rewrite families, so R2 STOPs correctly request a separate scope decision. To meet the full specified seam before freezing it, T4 belongs BEFORE S10; PM4 can instead explicitly defer it as a reseal CHILD with the precise DOM/copy exceptions recorded. No cited ledger line already rules that deferral or makes the whole type a new independent S10 precondition. Copy lock/source inventory must still hold (Spec G.4:2022).

8. SIZE
Minimum: 6 files, 140-230 authored lines, 18-26 rows. Two-stage alternative: same 6 paths across two tickets, about 180-290 authored lines, 24-32 rows including stage-specific parity checks. Shared food pending/gesture rows are counted once, not billed again under T1.

9. WHAT THE OWNER WOULD NOTICE
Normally nothing, including exact refusal sentences and what happens after an uncertain save. This is an interface/custody change, not permission to improve his wording or reinterpret his night.

## COMPARISON TABLE

All sizes below are proposed minimums; the flag bundle and recovery assignment need the PM's named scope.

| Ticket | Boundary that remains open | Change class beyond moves | Proposed minimum | S10 order already fixed / open | Owner-visible effect |
|---|---|---|---|---|---|
| T1 settings | Released admission and live cache | NEW WRITER LOGIC: token, snapshots, pending | 5 files; 150-230 lines; 12-16 rows | BEFORE explicitly fixed by :574 for G1/S-R29; STOP 6 bundle open | Normally none |
| T2 start | Ready paint requests durable Start | NEW WRITER LOGIC: action/intent ownership | 4 files; 60-100 lines; 8-12 rows | Separate after-split ticket fixed; before S10 versus reseal CHILD open | Ready action may add a tap; intent alternative need not |
| T3 model | Released model conversion/capability | Declared projection rewrites + NEW WRITER LOGIC for hooks | 5 files; 100-180 lines; 12-18 rows | BEFORE meets full handoff; deferral needs express PM debt ruling | Normally none |
| T4 outcomes | Writer copy composition and DOM arguments | Declared copy rewrites + NEW WRITER LOGIC at async boundary | 6 files; 140-230 lines; 18-26 rows | BEFORE meets B.3/B.6; narrower S-R13 already differs; deferral open | Normally none |

READ Spec:2028 fixes that split product stays off the chain until S10 carries it. "Before S10" here means compose/review on its candidate before sealing, not independently land these edited S8 bytes on the chain first.
READ F:1817 and Spec:1810 describe overlapping gesture work: T1 five historical subjects + T3 two + existing T4 two = nine; T2 would add Start only after its paint reach is removed. This arithmetic preserves the cited table, not a verified count of actual durable functions.
PROPOSED review scope: Claude author on writer-path changes, independent Claude hand told to disagree with this paper, and PM4 ruling/final read. No agent here accepts its own design or these estimates.

## CONTRADICTIONS AND OPEN FACTS

Paired statements only; these are not resolutions or new rulings.

- READ Spec:687-:694 names seven in-flight subjects: submitWeighIn, recordIntake, recordSettings, logSet, finish, forget, undo. READ R2:83-:92 instead says seven gym writers, six in gym-app, and recommends their flag rides T1. Those are different subject lists; start and recover do not appear in B.3's seven.
- READ REACH.md:75 under rebuild/lanes/c/today-split-spike labels model.forget PUT; Spec:1817 includes it in nine guarded subjects. READ T/gym-model.mjs:536 only sets saved = null, with no host/client call. A word-list classification is not a traced durable put.
- READ R2:88-:91 says sleepBusy clears in its own finally and calls the gesture guard a stronger substitute for the flag. READ T/today-lanes.cjs:485,:517,:541,:569 clears sleepBusy on explicit paths, with no finally in recordSleep; :69 ends gesture scope when the synchronous listener returns, before an awaited write settles.
- READ R2:44 and F:1724 call 32 a ceiling. READ F:1720 uses equality, so fewer identifiers also fail. Spec:678 fixes two total model names for declaration/handoff; this assignment requests 32 going to zero. The paper's proposed row separates pinned acquisition sites from retained uses; PM4 must fix the final counting contract.
- READ T/today-readings.cjs:2 calls its body sealed, and F:226 describes the writer as sealed. READ T/today-model.cjs:440,:443 returns writer functions/raw readings, while T/today-app.cjs:868 still chooses the conversion and calls weighIn. Physical extraction and sealed caller authority are different claims.
- READ Spec:1329 predicts a two-function gym paint handle and T/gym-settings-lane.mjs:22 says the token protocol is part 2. READ T/gym-app.mjs:133 has only repaint; DECISIONS:574 accepts that one-entry handle and moves G1 to its own pre-S10 ticket. Future token/mount ownership still needs an explicit interface; the current banner is historical here.
- READ Spec:876,:908 requires zero references to twelve copy constants and eight outcome shapes plus in-flight. READ T/today-lanes.cjs:38,:467,:489 still uses injected copy/stateful sentences; F:1669 tests literals. Zero literals is not zero writer-owned sentence composition.
- READ Spec:598 says no callback entry takes or returns a DOM node. READ T/today-lanes.cjs:907,:909 accepts DOM arguments today, while :941,:942 are the necessary listener infrastructure. The durable-hook rule needs an explicit scope; applying it to every hook would reject the shim itself.
- READ Spec:1003 preserves first.settings.lane as a writer-capable passthrough, while S-R29 asks for detached read data. READ T/gym-app.mjs:543 currently exposes the actual host through facade.lane; detaching data does not remove that separate public capability or authorize deleting the public key.
- READ Spec:1335 fixes machine-settings-view as pinned-unchanged for S10. READ T/machine-settings-view.mjs:39,:53 owns machine payload construction/validation and F:958 constrains sealed imports. T1's proposed shared-helper custody cannot be declared a pure unchanged pin without a PM-approved disposition change.
- READ DECISIONS:574 explicitly orders G1/S-R29 before S10. READ :550/:562 only queue Start's separate later ticket, and :584 stops unlisted statement rewrites. The supplied six ledger lines do not settle T2/T3/T4's S10 deferrals or authorize calling all four pure moves.
- READ Spec:578 acknowledges that projection calls are outside its bare-binding census. READ T/today-model.cjs:413 still injects adoptedRead/stateFromOps/read into the reading writer. A successful Today handoff is not proof that every released dependency of every writer has become immutable; this paper has not audited that wider contract.
- READ F:1444 keeps explicit residue and :1755 a counted gym-listener exception; DECISIONS:584/:592 require narrow scanner fixes and retain a tripwire, not a soundness proof. Proposed fence count changes cannot replace independent review of the new authored writer statements.

## WHAT I DID NOT VERIFY

- No review of the big cut's equivalence, acceptance or stops as a merge verdict; that is the separately assigned blind reviewer. No product/test edit, new test file, commit, push, checkout, reset, stash, clean, fetch, install, or merge.
- No full Today step, conformance gate, S8/S9/S10 package run, browser/phone drive, durable reopen, crash/restart, network service, protected soak, auth file or private data. No real repository instance was opened. All proposed red rows and estimates remain unexecuted.
- Three inline synthetic probes only, sequential in one Node process: mutable settings cache, extracted paint with a stub model, readings writer with a stub host. They measured no durable puts. Existing reports' pass counts were read, not rerun or adopted as my evidence.
- Runtime used exactly C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe; MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York set on separate lines before that process. No scratch file or node_modules change.
- Source citations were read at the stated local head; remote ledger lines were the existing remote-tracking ref, not a fetched current server view. S8 keys were inspected, not their hashes or descendant custody revalidated. Named source traces stop short of auditing injected producers, staging and cryptography.
- Spec/report/review evidence was inspected for these four follow-ups; no claim of resolving every historical review finding. rg was unavailable; bounded PowerShell reads/searches were used instead. The initial NEXT/ROADMAP output was too large; no conclusions below depend on its truncated historical portion.

## FINAL COMMAND OUTPUT

The target remains untracked, so ordinary git diff --stat does not include it. No git add was run.

```text
git status --porcelain
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied
?? rebuild/lanes/c/AFTER-THE-CUT-TICKETS.md

git diff --stat -- rebuild/lanes/c/AFTER-THE-CUT-TICKETS.md
(no stdout)
```
