# B-LOM: the legacy order-mapping provider

**STATUS: SPEC FOR LANE D TICKET B-LOM (DECISIONS:486), NOT A PACKAGE.** Sections 1 to 4 are the specification the lane D ticket now building on `rebuild/d-b-lom` works to. B-LOM is not an engine-tier package: it moves no `rebuild/engine` byte (DECISIONS:486 (a)), and its sealed moves ride M2-S6-TODAY-CHILD, whose post is measured only after B-LOM merges (`:486 (c)`, `:487`). It has no package spec, no `--ci --package B-LOM`, no receipt, no GATE-SUPERSESSION line and no coach constant of its own; the coach constant moves ONCE, at S6's fast-forward. The SKELETON `rebuild/lanes/b/tooling/packages/B-LOM.json` on the tip is deleted with its id by the S6 author as a disclosed hunk, never re-pinned (`:487` stop 2).

Walked on `origin/rebuild/t2-client-core` `ff099d14` (DECISIONS 488). Every citation was read in the tree. Synthetic data only.

**Why now.** Fable's final review of LOCAL-CAPTURE-START-RESUME (`rebuild/lanes/d/CAPTURE-START-RESUME-REVIEW-R3.md`, MAJOR 1, carried at `:486`) measured that once an imported history and one native workout coexist, the gym card's NEXT scheduled day is `blocked` with `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`, in both orders, and that this is the open boundary B-LOM (DECISIONS:102, :103, :113 (6), :425), not that ticket's defect. The owner trains daily and his port is days away, so B-LOM is on the critical path: it must land before the port or the card refuses every day after his first post-import workout.

## 1. THE BOUNDARY, IN THE ENGINE'S OWN WORDS

`rebuild/engine/performed.cjs:145` `performedHistory(s, chronology)` splits rows into `legacy` (keys of `s.sessionLog`) and `native` (`s.workoutFacts.sessions`). When `legacy.length` is non-zero it demands two things:

```js
172   const baseline=s.workoutFacts.legacy_baseline,anchor=order.import_anchor;
176   if(!baseline||baseline.profile!=='earned/imported-engine-history/v1'||baseline.session_log!==s.sessionLog||
177     !text(baseline.source_generation_id)||!text(baseline.activation_op_id))
180    unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
181   if(chronology&&(!anchor||!text(anchor.source_generation_id)||!text(anchor.activation_op_id)||
182     baseline.source_generation_id!==anchor.source_generation_id||baseline.activation_op_id!==anchor.activation_op_id))
183    unresolved('PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED');
```

**INPUT the engine asks for.** Two fields on the state, nothing else:

* `s.workoutFacts.legacy_baseline = {profile:'earned/imported-engine-history/v1', source_generation_id:<non-empty string>, activation_op_id:<non-empty string>, session_log:<the SAME object reference as s.sessionLog>}`. `baseline.session_log!==s.sessionLog` is REFERENCE equality. `rebuild/m4/spec/PERFORMED-ENGINE-v1.md:178` states the rule and its reason: the shared reference avoids a second copy of the imported log and is "a trusted internal composition invariant"; "replacing only sessionLog or the generation identity fails the mapping check".
* `s.workoutFacts.order.import_anchor = {source_generation_id, activation_op_id}`, both strings EQUAL to the baseline's two. This branch fires only when `chronology` is true, and `performedHistoryRows = s => performedHistory(s,true)` (`:255`) is what `plan.cjs:308` and `progression.cjs:67/558/686/777` read, so the prescription path always takes it (`performedHistoryMembers`, `:258`, is `writers.cjs:822` alone).

**OUTPUT the engine gives back.** `legacy.concat(native)` with the native rows sorted by the rank of `order.start_ids`: the imported prefix first in its own engine's order, then the proven post-activation native order. Nothing else changes.

**Why it refuses today.** Nothing on the installation composes either field. `legacy_baseline` and `import_anchor` occur in exactly one product file, `performed.cjs`, plus the S3 node lane below (measured by `findstr /s` over `rebuild/engine`, `rebuild/m4/import`, `rebuild/m4/workout`, `rebuild/m3/w6/local`, `rebuild/m3/w6/host`, `rebuild/m3/w7-preview/today`). The page builds the state at `gym-model.mjs:213-215` (`delete state.workoutFacts; if (projection.workout_history) state.workoutFacts = clone(projection.workout_history);`) and `projection.workout_history` comes from `source-admission.mjs:239` `projector.project(history,g,{sourceRevision:held.expected.revision})`, which passes NO `importAnchor` and attaches NO `legacy_baseline`. Both fields are simply absent, in both orders, and the card is blocked.

**The shape exists once, on a lane the page does not use.** `rebuild/m4/import/replay-core.cjs:384-395` composes exactly what the engine wants: `result.workout_baseline={profile:'earned/imported-engine-history/v1',source_generation_id:source.source_id,activation_op_id:source.intent_op_id,session_log:log}`, then `result.workout_history.legacy_baseline=result.workout_baseline`, then `projectAccepted(...,{sourceRevision,importAnchor:{source_generation_id,activation_op_id}}).order`. It is reached only through `workoutInput()` (`:423`), the S3 node-side reading replay. B-LOM's job is to let the page's lane answer the same question from the installation's own recorded evidence.

**What already exists on an installation to answer it.**

| the engine wants | what is on disk | where |
| --- | --- | --- |
| the imported prefix | `replayed.state.sessionLog`, published as `view.workout_baseline.session_log` under profile `earned/imported-engine-history/local-v1` with `local_source_basis` in place of the two ids | `source-admission.mjs:264` |
| the identity answer | `order_map.assertion = {kind:'athlete-confirmed-legacy-prefix', answer:true, prompt_version:'earned/legacy-prefix-prompt/v1', review_digest}`; `answer!==true` refuses `ORDER_EVIDENCE_REQUIRED` | `m4/import/local-source-order.cjs:26-32` |
| which native Start heads the chain | `order_map.native_root_id`, the one Start every other descends from | same file, `inspect()` `:20` |
| the binding to THIS installation | `installation_id`, `era_id`, `athlete_id`, `source_digest`, `legacy_members_digest`, `native_members_digest`, `checkpoint_digest`, `root_interpretation_digest` | same file `:29-33` |
| the source identity | the recorded selection `{id, basis:Q, order_map, order_input, identity_review}` under `generation.metadata.localSources.selections[active]`, and `metadata.localSourceApplication.{selection_id, source_digest}` | `source-admission.mjs:270-276` |
| the native Starts | the null lane's Starts and `causalTips`, ordered by `orderWorkoutStarts` | `today-bindings.mjs:396-401`, `m4/workout/engine-order.cjs` |

The one thing NOT on disk is an `activation_op_id`: the local era's admission mints no operation ("the op count is unchanged (nothing minted)"); the selection lives in `metadata` and `collections.derived`. That is ruled at section 5.

## 2. THE PROVIDER

The same kind of seam as B-NTC's `nativeTrendContext`: one named module under `rebuild/m4/workout/`, qualified (it refuses rather than guesses), deterministic (a pure function of durable inputs), digest-bound, no clock, no network, no private data, no state mutated in place. It differs from B-NTC in one structural way.

**B-NTC is a FUNCTION the engine calls. B-LOM is DATA the engine reads.** `createPerformed(E,{nativeTrendContext})` (`performed.cjs:4`) takes a resolver; `performedHistory` takes none. `:176-183` only tests the two fields for shape, string-ness and mutual equality; it does not verify descent, provenance or authorisation, and `:171-175` says so in the source ("The authenticated import controller owns the generation/activation binding; this is not a caller proof").

**Therefore NO `rebuild/engine` byte is required, and none is moved.** Moving one would weaken a rule the engine deliberately delegates. This is why B-LOM is not an engine-tier package (DECISIONS:486 (a)). Two engine-TIER files under `rebuild/m4/workout` ARE touched, because that is where the delegated proof lives.

| id | file | hunk |
| --- | --- | --- |
| H1 | NEW `rebuild/m4/workout/legacy-order-mapping.cjs` | `createLegacyOrderMapping({orderMap, selection, sessionLog})` returning `{baseline, anchor, digest, REFUSAL}`; `attach(workoutFacts, state)` sets `legacy_baseline` and `order.import_anchor` and returns the same object, refusing `LEGACY_ORDER_MAPPING_UNPROVEN` on a missing digest, `assertion.answer!==true`, an installation/era/athlete/source/checkpoint mismatch, or a `session_log` that is not the identical reference to `state.sessionLog` |
| H2 | NEW `rebuild/m4/workout/test/legacy-order-mapping.test.cjs` | the provider's own red-first cells: every refusal above, plus one mutant per digest field |
| H3 | `rebuild/m4/workout/engine-order.cjs`, ONE hunk at `:24-30` and ONE at `:88-91` | the anchor's identity may be proved by the recorded order map as an alternative to `sequence.has(importAnchor.activation_op_id)` and to `dependency.followsImport`, ONLY when the map's `assertion.answer === true` and its digests bind this installation, era, athlete, source and checkpoint. Every other refusal (`WORKOUT_ORDER_START_INVALID`, `_STATUS_UNRESOLVED`, `_SCOPE_INVALID`, `_CAUSAL_CYCLE`, `_CONCURRENT_LOCAL_UNRESOLVED`, `_START_INTERPRETATION_REQUIRED`) is untouched |
| H4 | `rebuild/m4/workout/engine-history.cjs`, ZERO bytes expected | `project(history,generation,{sourceRevision,importAnchor,originalThrough})` already forwards `importAnchor` at `:13-15`; read and confirmed, and a cell pins it |

H3 is the only rule genuinely widened, for one reason: in the **train then import** order the native Start was written BEFORE the import, so it can never causally descend from it (`engine-order.cjs:89-91` `WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN`), and `replay-core.cjs:396` swallows exactly that code, leaving `order` with no `import_anchor` and the card blocked. The athlete's recorded identity answer is the evidence that his imported history precedes his native work; H3 is the engine reading that answer instead of inferring it from a graph that cannot contain it.

**Where the page supplies it.** `rebuild/m3/w6/local/today-bindings.mjs`, ONE hunk beside the B-NTC binding at `:378-390`: when the generation carries an active `localSources` selection, the composed engine state gets its `workoutFacts` through `attach()` with the adopted `sessionLog` passed BY REFERENCE, never cloned. This is the same one-seam licence B-NTC holds there (DECISIONS:113 (5)).

**Where admission supplies it.** `rebuild/m3/w6/local/source-admission.mjs:264`, ONE hunk: the published view gains `workout_baseline` in the engine's own profile (`earned/imported-engine-history/v1`, with the two ids) ALONGSIDE, not in place of, today's `local-v1` shape, and `workout_facts` is passed through `attach()` so `order.import_anchor` is present on the admitted view. `interpretation_digest` and `order_map_digest` at `:262` therefore cover the attached fields (bar row 5).

**Where the host mirror supplies it.** `rebuild/m3/w6/host/engine-runtime-host.cjs` needs NO change: the provider is not a runtime dependency. `gym-model.mjs:213-215` needs none either, since it clones whatever `workout_history` the host published. Both are S5-pinned and staying out of them is deliberate (but see STOP 1).

## 3. LAWS, NONE WEAKENED

* **`performed.cjs`:** untouched. Both refusal branches keep firing whenever the two fields are absent, malformed or disagree. The positive path is reached only by supplying what the engine already asks for.
* **`engine-order.cjs`:** one alternative anchor proof added, nothing removed; every named refusal keeps its cell and gains a mutant.
* **`local-source-order.cjs`:** untouched. `ORDER_EVIDENCE_REQUIRED` (`:26`) stays the only door and `answer!==true` stays a strict identity, so No, absent, `'yes'` and `1` still refuse.
* **`engine-history.cjs`:** untouched, pinned.
* **The pinned refusal cell, re-reasoned.** `rebuild/m3/w7-preview/today/test/gym.test.mjs:1117-1139` ("an athlete carrying a LEGACY session log (Joe after the S3 port) is refused a second session outright") becomes the positive cell with its rule stated in place, and its red side moves rather than disappearing:

  > **A2 (B-LOM): an athlete carrying a LEGACY session log opens every later scheduled day, and only under a recorded order map.** Day+1, +3, +4, +7 read `phase !== 'blocked'` and carry a prescription. The RED side, kept as its own sub-test: with the selection's `order_map` removed from the generation, the same four days are `blocked` with `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` and `copy === null`.

  `gym.test.mjs` is S5-declared product, so this is a sealed-byte move S6 carries and the reviews diff line by line. No assertion is deleted: the `copy === null` assertion and the exact code string both survive, on the red side.

## 4. BAR: executed real-world invariant rows (DECISIONS:439)

Every row is a stub-free cell on the REAL route (real setup lane, real Measure host, real gym host and card model, real admission controller, fake-indexeddb, the S4 live clock ADVANCING between days), never a harness shortcut. Rows 1 to 4 run on summer (2026-10-30 Fri, 2026-10-31 Sat, EDT `-04:00`) and winter (2026-11-06, 2026-11-07, EST `-05:00`) dates.

| # | the claim | how it is measured |
| --- | --- | --- |
| 1 | **import then train**: the NEXT scheduled day OPENS with the right prescription | day+1, +3, +4, +7: `phase !== 'blocked'`, the card names the lift the engine prescribes, `card.prev` reads the imported load where the imported history governs and the native record where it governs |
| 2 | **train then import**: one native workout, then admit, then the next scheduled day OPENS | the same assertions, and `import_anchor` is present although the Start predates the selection, which is exactly H3's rule |
| 3 | **two native workouts before the import** | both Starts keep device order in `order.start_ids`, both appear once in `readWorkoutHistory`, neither is absorbed into `sessionLog`, and day+1 after the import opens |
| 4 | the prescription is the RIGHT one, not merely non-blocked | a hand table over the imported loads and the native record, matched cell for cell, in both orders |
| 5 | **mirror installs member-for-member equal on the digests that hold the Start's position**, so a DROPPED workout is DETECTED | the repair of P3-CSR5, which the final review measured as insensitive (`adopted(a) deepEqual adopted(b)` compares the imported replay only and holds with B's workout dropped; `interpretation_digest` and `order_map_digest` sit on MIRROR_DIFFERS by construction): compare `interpretation_digest` and `order_map_digest` (`source-admission.mjs:262`) plus `order.start_ids` and `legacy_baseline`, member for member, and carry a MUTANT that drops one native Start and turns the cell red |
| 6 | the basis-digest claim that can never hold is not re-asserted | A's pre-import session is prescribed from the clean-init athlete and B's post-import session from the adopted basis, so the cell states that difference as the expected truth and compares only row 5's members |
| 7 | **no verdict changes for an installation with no import** | a fresh athlete, `sessionLog` empty, `legacy.length === 0`, the `if(legacy.length)` block never entered, every Today, gym, check-in, measure and sleep verdict byte-identical to the base |
| 8 | nothing minted, nothing rewritten | op count unchanged across admit and every later day; `sessionLog` identical to the imported days; `trialStart()` unmoved |
| 9 | the refusal is still reachable | section 3's red side, plus one mutant per digest field in H2 |
| 10 | offline reload, force-kill and reopen, local-midnight rollover | the standing `:439` rows, on the day after an import that has a native workout on it |
| 11 | no `rebuild/engine` byte moves | `git diff` over the 45 tracked `rebuild/engine` files is empty |
| 12 | no law, guard or test weakened | every amended cell states its rule and its red side in place; no assertion removed |

## 5. THE TWO BLOCKING QUESTIONS, RULED (DECISIONS:486 (b))

1. **The anchor proof.** No activation operation is minted on the local era, so the recorded `order_map` IS the anchor proof. That is H3, and it is ruled, not proposed: nothing mints an op, and `rebuild/client` custody is not opened.
2. **What `source_generation_id` and `activation_op_id` MEAN on the local era.** This is the author's to fix, from the admission's OWN digests (`Q.source_digest` / `metadata.localSourceApplication.source_digest`, the selection id, and the order map's eight bindings). It is stated in the author report BEFORE the first cell is written, because the two values enter `interpretation_digest` and `order_map_digest`, and the Fable final checks the choice against the engine's own text at `performed.cjs:172-183` and `PERFORMED-ENGINE-v1.md:178`.

## 6. WHAT S6 CARRIES (DECISIONS:486 (c), :487 stop 1)

B-LOM merges to the chain from `rebuild/d-b-lom` on its own CI, last in the `:487` merge order, and S6's post is measured once after it. S6 carries, as declared or disclosed hunks:

* **Sealed moves:** `rebuild/m3/w6/local/today-bindings.mjs` (1 hunk) and `rebuild/m3/w7-preview/today/test/gym.test.mjs` (the section 3 re-reasoning, red side kept).
* **New product:** `rebuild/m4/workout/legacy-order-mapping.cjs` and `rebuild/m4/workout/test/legacy-order-mapping.test.cjs`, with the test enumerated in `rebuild.yml` as a disclosed hunk.
* **Engine-tier edits:** `rebuild/m4/workout/engine-order.cjs`, 2 hunks; `rebuild/m3/w6/local/source-admission.mjs`, 1 hunk.
* **The P3-CSR5 repair:** bar row 5's member-for-member mirror comparison and its dropped-workout mutant, replacing the insensitive `adopted(a) deepEqual adopted(b)` cell.
* **Bar rows 1 to 12 above** fold into S6 section 8; B-LOM contributes no bar of its own and no coach constant of its own.

## 7. STOPS AND UNKNOWNS

1. **Unknown, measure first: whether the reference identity survives the page's clone.** `gym-model.mjs:214-215` does `clone(projection.workout_history)` and `clone(projection.accepted_state)` as TWO separate clones, which breaks `baseline.session_log === s.sessionLog` unless both come from ONE `structuredClone` of a shared view. `PERFORMED-ENGINE-v1.md:178` says "a whole view structured clone preserves the shared reference", so the composition point in `today-bindings.mjs` must hand the card a single cloned view. Measured at author time before anything else; if it does not hold, `gym-model.mjs` gains a hunk and S6's sealed-byte list grows by one.
2. **Unknown: reopen and rollback after training.** Import first, train, then reopen or rollback replays with `order_map` null, so the answer is `undefined` and the review returns `ready:false`. No product caller reaches it today. B-LOM makes it reachable the day the Import screen offers a second pass, so it gets a named cell and a named refusal, not a silent pass (the ordered cell of `:486`).
3. **Carried to S6, not B-LOM's:** bar row 22, the `MAPPING_ID` proof with the author STOP before the coach constant moves; and the windows-latest today-child flake, which is reproduced and reported, never masked by a widened timeout.
4. **Not in scope:** the owner's real history, the port itself, the Import screen, and every private path. Synthetic data only; no private census value is printed anywhere outside the PM's own verdict-only FULL at S6.
5. **Estimate:** about two serial working days on top of S6 (`:486`), Mon 21 to Wed 23 Sep for the owner's history.
