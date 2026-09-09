# Captured workout continuation — retained host integration

This is the supported synthetic integration path, not personal-use qualification. It extends the existing `mountPreparedWorkoutPanel`, public client, T2 committer and encrypted repository. There is no second app, production key bootstrap, new training rule or implicit consent. CAPTURE-START v1.1 remains the original/current-instructions boundary.

## Supported journey

Open → Start → record sets → close the page → reopen → resume the same Start and remaining slots → normal Finish → reopen authenticated history. Stored original prescriptions and performed values survive exactly. Current instructions and the reason for them are displayed separately. The renderer never fills a performed value from a prescription. Skips stay distinct from performed sets; normal Finish requires each captured slot to have an interpreted performed or skipped record, not proof that every set was performed or progression-bearing.

`mountPreparedWorkoutPanel(root, {client, plannedSplitSlotId, enableContinuation: true})` opts the statically configured host into this path. Legacy callers retain their previous refusal. Reopen first authenticates history, then asks the client to interpret one surviving open session. Multiple open candidates, unresolved edits/slots, missing originals, incomplete known prefix or a refused current assessment cannot silently become a new Start. Finished workouts reopen as history. Preparing another workout requires an explicit button; existing Start guards and candidate-relationship rules still apply.

## Client boundary

| API/configuration | Contract |
|---|---|
| Static `workoutResumePolicy(generation, context)` | Trusted configured producer, not a renderer request. Closed result `{allowed_actions, reason, current_capture}`. Actions are a unique subset of `set`, `skip`, `close`; reason is nonblank. Current capture is validated against configured producer and resolved current basis/revision. Original slot identities/order must match; new/removed slots need an explicit mapping. An empty action set grants nothing. |
| `prepareWorkoutContinuation({session_start_op_id})` | In the scoped queue: load actual encrypted generation, verify original authority/local identity evidence, interpret history, resolve current basis, run current policy, and recheck scope/revision/token/lifetime. Returns an opaque one-attempt `resumeId` plus copied original/current display and interpreted completion. Preparing again retires older continuation handles. This local path does not call `observationGuard.run`; its earlier description did. K1 managed-ingress/clock knowledge remains unqualified, not established by epoch checks. |
| `executeResumedWorkout({resumeId,action,input})` | Validates closed JSON through the existing command mapper without invoking getters. Requires the exact Start and an available captured slot, allowed action and completed slots for normal Finish. Consumes the handle for one attempt. Existing durable bridge rechecks exact revision/token/session/observation plus operation kind/envelope/payload against the submitted command at the final commit cut. No implicit rebase or changed performed value. |
| `retireWorkoutPreparations()` | Also retires continuation handles and any active continuation. An already durable operation is not claimed cancelled. |
| `readWorkoutHistory()` | Still grants no write permission. Its original facts and supported nonconcurrent edit projection are reused by the separate continuation interpreter. |
| `prepareWorkoutEdit({target_op_id})` | Authenticates actual stored history under the existing history observation guard, checks the complete known prefix and exact interpreted target, and returns a copied original/current view plus opaque one-attempt `editId`. The private entry binds revision/token/context, original target and lineage. Parents comprise the original and its observed nonconcurrent edits. A returned display cannot retarget the edit. |
| `commitWorkoutEdit({editId, action, change})` | `action` is `correct` with replacement fields, or `remove` with a reason. Existing descriptor-safe mapper and shape/relationship validation apply. Target, lineage and parents come only from the private entry. Exact payload/target/parents and current revision/token/context are checked at the durable commit. Consumes one attempt; a lost acknowledgement requires fresh authenticated history. No rewrite, plan change or progression grant. |

The host refreshes the current assessment before each continuing command and after an acknowledged Set/Skip. A changed generation retires a prepared command. A lost acknowledgement cannot be blindly replayed using the same handle; fresh authenticated history determines whether its exact set exists. A changed assessment may disable Set while retaining explicitly permitted Skip/early Close. Original capture remains untouched.

## Interpretation limits

`continuation.mjs` uses the actual `client/session.cjs` candidate rule, including the same-day and adjacent-day 23:00–01:00 boundary. Only a singleton component needs no relationship decision. No default generation is borrowed as authority. Multiple-start partition/generation mapping remains required; closed Starts still participate in that existing rule. Non-minute effective times, extra slots, competing corrections, unresolved statuses and missing legacy capture yield named refusals, not corrupt-empty-state guesses or fabricated original instructions.

Known complete prefix means local verified W equals the locally known authority W. It is not proof that an offline device knows unseen remote work. Qualified issuer/current-head/standing/clock contracts remain applicable. Missing/inconsistent stored truth remains state18; independently known standing loss17, rejection19, clock allowance20 and relationship ambiguity14 keep their separate meanings. The owner’s elapsed-time exception does not waive knowledge-loss fencing.

The policy in the tracked demonstration is deliberately synthetic. A valid callback shape does not prove that it is scientifically correct or authorized for Joe/Dad. Production policy, supported prescription combinations, governing plan/consent/effect projection, legacy port, resolved multiple-device workouts, full design, K1/keys/CLOCK, storage capacity, private import/restore and physical phones remain open. Generic legacy `execute` is not relabelled as globally enforcing the new continuation policy. The selected host uses the guarded continuation API.

## Correcting the completed workout

The same host's finished-history view offers an explicit editor for load/repetitions/effort and reasoned removal. It reads current recorded values when opened; these are existing facts being corrected, never fabricated performed entries. No change means no commit. Save waits for real transaction completion, then rereads authenticated history. A stale editor retains typed values and requires reviewing fresh history; a lost acknowledgement is not blindly retried. Removal excludes the targeted fact from interpretation but leaves the original operation and later facts intact. Prior edits are causal parents of the new correction; transport order alone is not used as edit order.

An exact, known fact may be corrected/removed even if another recorded fact shares its slot. This does not resolve a workout partition or grant eligibility. Conflicting concurrent edits without one current value still require interpretation. Unknown/missing/rejected/removed targets, incomplete known prefix and changed context refuse. Bounds remain bounds (`3+` is not exact3); unknown, skipped and not-asked remain distinct. Plan undo and plan consent are separate operations, not overloaded onto fact removal.

The correction history read calls `observationGuard.run`; the local commit uses the existing local-write path with final generation/context checks. Neither establishes the proposed production K1 closure or guarantees persistence of learned negative knowledge across restart. This distinction also corrects the prior resume table's inaccurate guard wording without changing K1 or adding a new rule.

## Executed evidence and reproduction

Use the retained R1 checkout and W6's real installed dependency directory. No private input or account is needed for these synthetic commands; `W6_BROWSER_BIN` points at installed Chromium/Chrome.

```
node rebuild/m3/w6/test/run-current-head.cjs <R1> --all --resume-browser
node rebuild/m3/w6/test/run-current-head.cjs <R1> --resume-bite
```

Final combined331/331 tests, zero skipped; native WORKOUT RESUME PASS24. The native test drives the actual retained UI/client/encrypted IndexedDB at390CSSpx, closes the page and creates fresh JS realms twice, verifies the same Start/slots/originals and one normal Close, and tests a current-policy Set refusal. Generated test keys remain only in the test process to reopen its synthetic database. This is neither production key custody nor an iOS/process-crash/storage-pressure claim. Other-device relationship rows are explicitly pure interpretation tests below signature authentication, not forged HTTP evidence.

Parent f7aea3f received independent ACCEPT142 for its intermediate331/24 journey. Its resume bite removed revision/token binding and went RED, restoring public-client0087c3c1. The correction successor passes343/343 tests and44 native checks, including the same journey followed by correction/reopen/removal with original and later facts preserved, a held IndexedDB write, no-change/no-commit, stale refusal, ≥16px inputs and200% text at390CSSpx. A screenshot was visually inspected; full approved-design/iPhone acceptance remains separate. Its edit-binding bite makes the stale correction incorrectly Saved, native exit1; restores exact public-client SHA256 `fb635f48bdb33df262b705888083b5a8b7912ded3e422b8619654dd3b49c1018`. Independent acceptance of this correction successor is pending.
