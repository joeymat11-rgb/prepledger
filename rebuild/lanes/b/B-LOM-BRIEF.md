# M2-B-LOM: the legacy order-mapping provider

**STATUS: DRAFT.** Not accepted by name, not accepted by sha, no token line minted; nothing here authorises a run. Lane B, ENGINE-TIER PACKAGE PROCESS (`rebuild/lanes/b/tooling/b-package.cjs`), size M. Parent: the accepted head of the Today reseal chain at B-LOM's rebase (section 5). Walked on `origin/rebuild/t2-client-core` `c6b6d50c` (DECISIONS 485) and `origin/rebuild/d-capture-start-resume` `ff099d14`. Every citation was read in the tree. Synthetic data only.

**Why now.** Fable's final review of LOCAL-CAPTURE-START-RESUME (`rebuild/lanes/d/CAPTURE-START-RESUME-REVIEW-R3.md`, MAJOR 1) measured that once an imported history and one native workout coexist, the gym card's NEXT scheduled day is `blocked` with `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED`, in both orders, and that this is the open boundary B-LOM (DECISIONS:102, :103, :113 (6), :425), not that ticket's defect. The owner trains daily and his port is days away, so B-LOM is on the critical path: it must land before the port or the card refuses every day after his first post-import workout.

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

The one thing NOT on disk is an `activation_op_id`: the local era's admission mints no operation (R3 measured "the op count is unchanged (nothing minted)"); the selection lives in `metadata` and `collections.derived`. See STOP 1.

## 2. THE PROVIDER

The same kind of seam as B-NTC's `nativeTrendContext`: one named module under `rebuild/m4/workout/`, qualified (it refuses rather than guesses), deterministic (a pure function of durable inputs), digest-bound, no clock, no network, no private data, no state mutated in place. It differs from B-NTC in one structural way, and the brief says so plainly because the PM's intake expected the opposite.

**B-NTC is a FUNCTION the engine calls. B-LOM is DATA the engine reads.** `createPerformed(E,{nativeTrendContext})` (`performed.cjs:4`) takes a resolver; `performedHistory` takes none. `:176-183` only tests the two fields for shape, string-ness and mutual equality; it does not verify descent, provenance or authorisation, and `:171-175` says so in the source ("The authenticated import controller owns the generation/activation binding; this is not a caller proof").

**Therefore NO `rebuild/engine` byte is required, and none should be moved.** Moving one would weaken a rule the engine deliberately delegates. `engine-files-differential` stays empty over all 45 tracked `rebuild/engine` files, as S5's bar row 3 requires, and the GATE-SUPERSESSION line keeps its "changes no rebuild/engine byte" clause. Two engine-TIER bytes under `rebuild/m4/workout` ARE required, because that is where the delegated proof lives.

| id | file | hunk |
| --- | --- | --- |
| H1 | NEW `rebuild/m4/workout/legacy-order-mapping.cjs` | `createLegacyOrderMapping({orderMap, selection, sessionLog})` returning `{baseline, anchor, digest, REFUSAL}`; `attach(workoutFacts, state)` sets `legacy_baseline` and `order.import_anchor` and returns the same object, refusing `LEGACY_ORDER_MAPPING_UNPROVEN` on a missing digest, `assertion.answer!==true`, an installation/era/athlete/source/checkpoint mismatch, or a `session_log` that is not the identical reference to `state.sessionLog` |
| H2 | NEW `rebuild/m4/workout/test/legacy-order-mapping.test.cjs` | the provider's own red-first cells: every refusal above, plus one mutant per digest field |
| H3 | `rebuild/m4/workout/engine-order.cjs`, ONE hunk at `:24-30` and ONE at `:88-91` | the anchor's identity may be proved by the recorded order map as an alternative to `sequence.has(importAnchor.activation_op_id)` and to `dependency.followsImport`, ONLY when the map's `assertion.answer === true` and its digests bind this installation, era, athlete, source and checkpoint. Every other refusal (`WORKOUT_ORDER_START_INVALID`, `_STATUS_UNRESOLVED`, `_SCOPE_INVALID`, `_CAUSAL_CYCLE`, `_CONCURRENT_LOCAL_UNRESOLVED`, `_START_INTERPRETATION_REQUIRED`) is untouched |
| H4 | `rebuild/m4/workout/engine-history.cjs`, ZERO bytes expected | `project(history,generation,{sourceRevision,importAnchor,originalThrough})` already forwards `importAnchor` at `:13-15`; read and confirmed, and a cell pins it |

H3 is the only rule genuinely widened, for one reason: in the **train then import** order the native Start was written BEFORE the import, so it can never causally descend from it (`engine-order.cjs:89-91` `WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN`), and `replay-core.cjs:396` swallows exactly that code, leaving `order` with no `import_anchor` and the card blocked. The athlete's recorded identity answer is the evidence that his imported history precedes his native work; H3 is the engine reading that answer instead of inferring it from a graph that cannot contain it.

**Where the page supplies it.** `rebuild/m3/w6/local/today-bindings.mjs`, ONE hunk beside the B-NTC binding at `:378-390`: when the generation carries an active `localSources` selection, the composed engine state gets its `workoutFacts` through `attach()` with the adopted `sessionLog` passed BY REFERENCE, never cloned. This is the same one-seam licence B-NTC holds there (DECISIONS:113 (5)).

**Where admission supplies it.** `rebuild/m3/w6/local/source-admission.mjs:264`, ONE hunk: the published view gains `workout_baseline` in the engine's own profile (`earned/imported-engine-history/v1`, with the two ids) ALONGSIDE, not in place of, today's `local-v1` shape, and `workout_facts` is passed through `attach()` so `order.import_anchor` is present on the admitted view. `interpretation_digest` and `order_map_digest` at `:262` therefore cover the attached fields (bar row 5).

**Where the host mirror supplies it.** `rebuild/m3/w6/host/engine-runtime-host.cjs` needs NO change: the provider is not a runtime dependency. `gym-model.mjs:213-215` needs none either, since it clones whatever `workout_history` the host published. Both are S5-pinned and staying out of them is deliberate (but see STOP 3).

## 3. LAWS, NONE WEAKENED

* **DECISIONS:60 D-ids: none.** B-LOM carries no register repair and stays in the runner's `NO_REGISTER_IDS` set, so the Y1 replacement obligation applies: it must declare at least `MIN_OWN_CHILDREN` children executing its own `role:"new"` product, or the seal refuses `NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT`. H2 and the two admission suites are those children. `carriedAcceptedIds` D12, D33, D34, D35, D41, D43 stand as the skeleton records them.
* **`performed.cjs`:** untouched. Both refusal branches keep firing whenever the two fields are absent, malformed or disagree. The positive path is reached only by supplying what the engine already asks for.
* **`engine-order.cjs`:** one alternative anchor proof added, nothing removed; every named refusal keeps its cell and gains a mutant.
* **`local-source-order.cjs`:** untouched. `ORDER_EVIDENCE_REQUIRED` (`:26`) stays the only door and `answer!==true` stays a strict identity, so No, absent, `'yes'` and `1` still refuse (R3 measured all four).
* **`engine-history.cjs`:** untouched, pinned.
* **The pinned refusal cell, re-reasoned.** `rebuild/m3/w7-preview/today/test/gym.test.mjs:1117-1139` ("an athlete carrying a LEGACY session log (Joe after the S3 port) is refused a second session outright") becomes the positive cell with its rule stated in place, and its red side moves rather than disappearing:

  > **A2 (B-LOM): an athlete carrying a LEGACY session log opens every later scheduled day, and only under a recorded order map.** Day+1, +3, +4, +7 read `phase !== 'blocked'` and carry a prescription. The RED side, kept as its own sub-test: with the selection's `order_map` removed from the generation, the same four days are `blocked` with `PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED` and `copy === null`.

  `gym.test.mjs` is S5-declared product, so this is a sealed-byte move B-LOM declares and the review diffs line by line. No assertion is deleted: the `copy === null` assertion and the exact code string both survive, on the red side.

## 4. BAR: executed real-world invariant rows (DECISIONS:439)

Every row is a stub-free cell on the REAL route (real setup lane, real Measure host, real gym host and card model, real admission controller, fake-indexeddb, the S4 live clock ADVANCING between days), never a harness shortcut. Rows 1 to 4 run on summer (2026-10-30 Fri, 2026-10-31 Sat, EDT `-04:00`) and winter (2026-11-06, 2026-11-07, EST `-05:00`) dates.

| # | the claim | how it is measured |
| --- | --- | --- |
| 1 | **import then train**: the NEXT scheduled day OPENS with the right prescription | day+1, +3, +4, +7: `phase !== 'blocked'`, the card names the lift the engine prescribes, `card.prev` reads the imported load where the imported history governs and the native record where it governs |
| 2 | **train then import**: one native workout, then admit, then the next scheduled day OPENS | the same assertions, and `import_anchor` is present although the Start predates the selection, which is exactly H3's rule |
| 3 | **two native workouts before the import** | both Starts keep device order in `order.start_ids`, both appear once in `readWorkoutHistory`, neither is absorbed into `sessionLog`, and day+1 after the import opens |
| 4 | the prescription is the RIGHT one, not merely non-blocked | a hand table over the imported loads and the native record, matched cell for cell, in both orders |
| 5 | **mirror installs member-for-member equal on the digests that hold the Start's position**, so a DROPPED workout is DETECTED | the repair of P3-CSR5, which R3 MAJOR 2 measured as insensitive (`adopted(a) deepEqual adopted(b)` compares the imported replay only and holds with B's workout dropped): compare `interpretation_digest` and `order_map_digest` (`source-admission.mjs:262`) plus `order.start_ids` and `legacy_baseline`, member for member, and carry a MUTANT that drops one native Start and turns the cell red |
| 6 | the basis-digest claim that can never hold is not re-asserted | R3 MAJOR 2's second half: A's pre-import session is prescribed from the clean-init athlete and B's post-import session from the adopted basis, so the cell states that difference as the expected truth and compares only row 5's members |
| 7 | **no verdict changes for an installation with no import** | a fresh athlete, `sessionLog` empty, `legacy.length === 0`, the `if(legacy.length)` block never entered, every Today, gym, check-in, measure and sleep verdict byte-identical to the parent head |
| 8 | nothing minted, nothing rewritten | op count unchanged across admit and every later day; `sessionLog` identical to the imported days; `trialStart()` unmoved |
| 9 | the refusal is still reachable | section 3's red side, plus one mutant per digest field in H2 |
| 10 | offline reload, force-kill and reopen, local-midnight rollover | the standing `:439` rows, on the day after an import that has a native workout on it |
| 11 | no `rebuild/engine` byte moves | `engine-files-differential`: 45 tracked, 0 moved |
| 12 | no law, guard or test weakened | every amended cell states its rule and its red side in place; no assertion removed |

## 5. PACKAGING, AND THE ORDER QUESTION

**The flow** (S5's, DECISIONS:457 to :467, with B-LOM's names): brief accepted by name; three token lines on the tip in order (THEME `M2-B-LOM-LEGACY-ORDER-MAPPING`; BRIEF-BY-SHA; GATE-SUPERSESSION in `:462`'s exact shape); the author cites all three in `rebuild/lanes/b/tooling/packages/B-LOM.json` (`theme.acceptedLedgerLine`, `brief.acceptedLedgerLine`, `coverage.superseded.rulingLineSha256`), a null `rulingLineSha256` being a hard `GATE-SUPERSESSION-RULING-NOT-CITED` exit 1 before coverage prints; `--ci --package B-LOM` prints `PUBLIC CI EVIDENCE PASS` with the artifact re-proposed through the runner's own `proposed()` path, never hand-written; Fable final review over the sealed candidate (`:439`, high effort, independent of r1); PM `--full` with the private census on the PC, verdict-only, ending `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation`, exit 2; the receipt line `POSTFIX-ACCEPTANCE M2-B-LOM-LEGACY-ORDER-MAPPING <commit> rebuild/m4/spec/acceptance-b-lom-legacy-order-mapping.json <sha256> ACCEPTED` discharges it; `review-b-lom-legacy-order-mapping.json` cites that receipt; MERGE the tip into the reviewed head, NEVER rebase (`:467` note 1); authorized `--full` prints `SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/B-LOM.json` and `POSTFIX PACKAGE PASS`, exit 0; the coach constant moves to `ENGINE_REVISION = M2-B-LOM-LEGACY-ORDER-MAPPING@<first 16 hex of sha256 over receipts/B-LOM.json>` (`:456`, `:468`) BEFORE the fast-forward; a second authorized `--full` prints `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY`; CI green both OS; fast-forward.

**The existing skeleton is stale and is re-taken, not edited around.** `packages/B-LOM.json` still reads `status:"SKELETON"`, `sourceBase e9c50e10` and `parent.options[0].id:"B-NTC"` with every coordinate null. B-NTC sealed and four descendants have landed since. The parent becomes the accepted Today-chain head, `sourceBase` is re-taken at the rebase, and the note claiming B-NTC is the only option is corrected rather than carried.

**SIBLING RE-PIN (DECISIONS:113 (6)).** B-LOM re-takes `tooling.runnerSha256` and every child-superseded pin at its own rebase onto the accepted parent head, recorded here, with no separate ledger line. `carrierSuccessor` and the nine NATIVE-CARRIERS supersessions are declared again under B-LOM's own token line with its own red-first `blom-sup-*` children in S5's shape; a retirement is never inherited.

**THE ORDER: land B-LOM as a CHILD OF S6, after S6, not before it. Recommended.** Reasons, in weight order:

1. **A parent cannot re-pin bytes its child already moved.** B-LOM moves `gym.test.mjs` (section 3), `today-bindings.mjs` and `source-admission.mjs`. The first two are S5-declared, and `:485` records that S6 declares `source-admission.mjs` for the first time. If B-LOM lands first, S6's declaration list, which `:482` and `:485` describe as measured over four accepted branches, is measured against a tree B-LOM has already moved, and S6's own bar rows 1 and 2 (post equals the reviewed lane bytes; this package moves no product byte of its own) can no longer be stated. That is a re-walk of 81 declarations, not a re-pin.
2. **SIBLING RE-PIN points the same way.** `:113 (6)` has B-LOM re-taking pins at its own rebase onto an ACCEPTED head. S6 is the head being assembled now; rebasing onto it costs B-LOM one pin re-take. The reverse, S6 re-pinning at B-LOM's accepted head, costs a SECOND reseal, which `:455` prices at roughly half a day of lane B time plus one FULL on the PC.
3. **S6 is already drafted and already gated on this tree.** `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md` at `origin/rebuild/b-s6-brief` `bb11a41e` carries LOCAL-CAPTURE-START-RESUME as a placeholder row, and `:485` fixes the merge order with `d-capture-start-resume` merging on its own CI before the S6 post is measured. B-LOM inherits that same tree cleanly one step later.
4. **It does not cost the owner a day.** S6 is size M with its list already walked; B-LOM's authoring overlaps it almost entirely (section 6), and the two FULL runs on the PC are the only strictly serial cost.

**The question as posed, answered:** S6 does NOT need to re-pin at B-LOM's accepted head, because B-LOM should not be accepted first. B-LOM lands after S6 as S6's child, re-pinning S6's bytes under SIBLING RE-PIN, and no second reseal is needed. If the PM wants B-LOM first, then S6 must re-pin at B-LOM's accepted head and re-measure its 81 declarations, and that is the second reseal this recommendation avoids.

## 6. ESTIMATE

Working days, lane B, author Opus high, r1 review Opus high, Fable final at `:439`.

| stage | days |
| --- | --- |
| author: H1 to H4, the two page hunks, the `gym.test.mjs` re-reasoning, twelve bar rows stub-free on two seasons | 2.0 |
| r1 independent review with its own cells and mutants | 0.5 |
| one fix round (`:431` point 17) | 0.5 |
| citation round, artifact re-proposed, `--ci` to `PUBLIC CI EVIDENCE PASS` | 0.25 |
| Fable final over the sealed candidate | 0.5 |
| PM `--full` with the private census, receipt, authorized `--full` twice, coach constant, CI both OS, fast-forward | 0.75 |
| **total** | **4.5** |

**Overlap with S6:** the author stages (2.0) and the r1 review (0.5) run entirely in parallel with S6, on a branch based on S6's candidate head under the `:116 (3)` engine rehearsal rule (closed profile, bites, mutants and fidelity diff against the predecessor's candidate head; nothing merges on a rehearsal). Only the citation round onward is serial. Serial cost added to S6: about **2.0 working days**. Against the `:485` port estimate of Fri 18 to Tue 22 Sep, B-LOM lands inside that window if it starts as a rehearsal the day S6's candidate head exists.

## 7. STOPS AND UNKNOWNS

1. **STOP, blocking, and the reason H3 exists: the local era mints no activation operation.** `engine-order.cjs:24-30` requires `sequence.has(importAnchor.activation_op_id)`, that is, the activation must be an ACCEPTED operation in the generation. `source-admission.mjs:270-276` records the selection in `metadata.localSources` and `collections.derived.localSource` only, and R3 measured "the op count is unchanged (nothing minted)". No op id exists to name. Two ways out, and the author does NOT choose alone: (a) mint a durable activation op at admission, which changes the op count several pinned cells assert is unchanged and touches `rebuild/client` custody; (b) H3, widen the anchor's identity to the recorded selection id bound by the order map's digests. This brief recommends (b) and asks the PM to rule before H3 is written.
2. **STOP: what `source_generation_id` and `activation_op_id` MEAN on the local era.** `replay-core.cjs:384` uses `source.source_id` and `source.intent_op_id` from the guarded lineage. The local analogues are `Q.source_digest` (or `metadata.localSourceApplication.source_digest`) and the selection id. Fixing the exact two values is a one-line ruling that binds every later digest, and it must be fixed before the first cell is written, because the values enter `interpretation_digest` and `order_map_digest`.
3. **Unknown: whether the reference identity survives the page's clone.** `gym-model.mjs:214-215` does `clone(projection.workout_history)` and `clone(projection.accepted_state)` as TWO separate clones, which breaks `baseline.session_log === s.sessionLog` unless both come from ONE `structuredClone` of a shared view. `PERFORMED-ENGINE-v1.md:178` says "a whole view structured clone preserves the shared reference", so the composition point in `today-bindings.mjs` must hand the card a single cloned view. Measured at author time before anything else; if it does not hold, `gym-model.mjs` gains a hunk and the S5 sealed-byte list grows by one.
4. **Unknown: reopen and rollback after training.** R3 NOTE 5 measured that import first, train, then reopen or rollback replays with `order_map` null, so the answer is `undefined` and the review returns `ready:false`. No product caller reaches it today. B-LOM makes it reachable the day the Import screen offers a second pass, so it gets a named cell and a named refusal, not a silent pass.
5. **Unknown: `MAPPING_ID` and this reseal.** `:485` bar row 22 requires that an import admitted under one `ENGINE_REVISION` stays admitted, adopted and retractable after the constant moves. B-LOM moves the constant too. Its bar inherits that row verbatim, and if it cannot be shown the author STOPS before the constant moves.
6. **Unknown: the windows-latest today-child flake** (`:467`, `:481`, `:485` point 6) is not B-LOM's to fix and must not be masked by a widened timeout; a red is reproduced and reported, never retriggered away.
7. **Not in scope:** the owner's real history, the port itself, the Import screen, and every private path. Synthetic data only; no private census value is printed anywhere outside the PM's own verdict-only FULL.

## 8. THE EXACT COMMANDS THE PM RUNS TO ACCEPT THIS BRIEF AND MINT THE TOKEN LINES

S5's pattern (`:459`, `:460`, `:462`), on the chain branch, in this order. The acceptance-by-name line is appended FIRST; the sha in the second is measured from the bytes that line accepts, so the file must not move between the two.

1. `cd /d <worktree> && git checkout rebuild/t2-client-core && git pull --ff-only`
2. Append the ACCEPTED-BY-NAME line, then the THEME line; commit.
3. Measure the brief on that commit:

```
node -e "const f=require('fs'),c=require('crypto');const b=f.readFileSync('rebuild/lanes/b/B-LOM-BRIEF.md');console.log(c.createHash('sha256').update(b).digest('hex'),b.length)"
```

4. Append the BRIEF-BY-SHA line with that sha256 and byte count, then the GATE-SUPERSESSION line; commit and push.
5. Hand the author the three line NUMBERS. Each citation is sha256 over the EXACT line bytes, no trailing newline, and the method is validated against S5's `:459`, `:460`, `:462` values before it is used on B-LOM's:

```
node -e "const f=require('fs'),c=require('crypto');const n=Number(process.argv[1]);const L=f.readFileSync('rebuild/DECISIONS.md','utf8').split('\n')[n-1];console.log(c.createHash('sha256').update(Buffer.from(L,'utf8')).digest('hex'))" <line>
```

The three lines; the date, the parent coordinates, the sha256 and `<n>` are placeholders the PM substitutes.

```
- <date> · cowork · THEME M2-B-LOM-LEGACY-ORDER-MAPPING: the engine package that turns PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED (rebuild/engine/performed.cjs:176-183) into a real provider, so an installation carrying an imported history and native workouts opens every later scheduled day. It adds rebuild/m4/workout/legacy-order-mapping.cjs and its cells, widens engine-order.cjs's import anchor with the recorded athlete-confirmed order map as an alternative to causal descent, and composes legacy_baseline and order.import_anchor at rebuild/m3/w6/local/today-bindings.mjs and rebuild/m3/w6/local/source-admission.mjs. Open boundary DECISIONS:102, :103, :425; put on the critical path by the LOCAL-CAPTURE-START-RESUME final review (rebuild/lanes/d/CAPTURE-START-RESUME-REVIEW-R3.md MAJOR 1). Its behaviour/delta contract is rebuild/lanes/b/B-LOM-BRIEF.md; its parent is <PARENT PACKAGE ID>, <parent artifact path> sha256 <parent artifact sha256> (receipt DECISIONS:<n>, merge :<n>); it changes no rebuild/engine byte, and as a descendant of M2-S3-COMPANION it retires the same nine byte-identity gates again under its own token line below. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself · ACCEPTED
```

```
- <date> · cowork · BRIEF ACCEPTED BY SHA for M2-B-LOM-LEGACY-ORDER-MAPPING: rebuild/lanes/b/B-LOM-BRIEF.md, sha256 <64-hex, the accepted bytes of this file> (<n> bytes), is the brief of record; this line carries the binding sha256 and is the citation brief.acceptedLedgerLine cites · ACCEPTED
```

```
- <date> · cowork (PM) · GATE-SUPERSESSION M2-B-LOM-LEGACY-ORDER-MAPPING source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate · the token clause for DECISIONS:153, same conditions (i)-(iii), for the child of <PARENT PACKAGE ID>; the child changes no rebuild/engine byte and retires the parent's retired gates again under this line and its own evidence: the five carriers cover the nine gates merge-source, migrate-source, writers-source, migrate-differential, witnesses-2, witnesses-5, witnesses-7, writers-differential and second-gate · RULED
```

The third line must END in `RULED`, and its token clause must be exactly `GATE-SUPERSESSION M2-B-LOM-LEGACY-ORDER-MAPPING source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate`; any bracket, quote, backtick or extra word inside that clause leaves it something other than the token and frees nothing.
