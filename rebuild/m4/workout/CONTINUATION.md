# Captured workout continuation — retained host integration

This is the supported synthetic integration path, not personal-use qualification. It extends the existing `mountPreparedWorkoutPanel`, public client, T2 committer and encrypted repository. There is no second app, production key bootstrap, new training rule or implicit consent. CAPTURE-START v1.1 remains the original/current-instructions boundary.

## Supported journey

Open → Start → record sets → close the page → reopen → resume the same Start and remaining slots → normal Finish → reopen authenticated history. Stored original prescriptions and performed values survive exactly. Current instructions and the reason for them are displayed separately. The renderer never fills a performed value from a prescription. Skips stay distinct from performed sets; normal Finish requires each captured slot to have an interpreted performed or skipped record, not proof that every set was performed or progression-bearing.

`mountPreparedWorkoutPanel(root, {client, plannedSplitSlotId, enableContinuation: true})` opts the statically configured host into this path. Legacy callers retain their previous refusal. Reopen first authenticates history, then asks the client to interpret one surviving open session. Multiple open candidates, unresolved edits/slots, missing originals, incomplete known prefix or a refused current assessment cannot silently become a new Start. Finished workouts reopen as history. Preparing another workout requires an explicit button; existing Start guards and candidate-relationship rules still apply.

## Client boundary

| API/configuration | Contract |
|---|---|
| Static `workoutResumePolicy(generation, context)` | Trusted configured producer, not a renderer request. Closed result `{allowed_actions, reason, current_capture}`. Actions are a unique subset of `set`, `skip`, `close`; reason is nonblank. Current capture is validated against configured producer and resolved current basis/revision. Original slot identities/order must match; new/removed slots need an explicit mapping. An empty action set grants nothing. |
| `prepareWorkoutContinuation({session_start_op_id})` | Under the existing observation guard: load actual encrypted generation, verify original authority/local identity evidence, interpret history, resolve current basis, run current policy, and recheck scope/revision/token/lifetime. Returns an opaque one-attempt `resumeId` plus copied original/current display and interpreted completion. Preparing again retires older continuation handles. |
| `executeResumedWorkout({resumeId,action,input})` | Validates closed JSON through the existing command mapper without invoking getters. Requires the exact Start and an available captured slot, allowed action and completed slots for normal Finish. Consumes the handle for one attempt. Existing durable bridge rechecks exact revision/token/session/observation plus operation kind/envelope/payload against the submitted command at the final commit cut. No implicit rebase or changed performed value. |
| `retireWorkoutPreparations()` | Also retires continuation handles and any active continuation. An already durable operation is not claimed cancelled. |
| `readWorkoutHistory()` | Still grants no write permission. Its original facts and supported nonconcurrent edit projection are reused by the separate continuation interpreter. |

The host refreshes the current assessment before each continuing command and after an acknowledged Set/Skip. A changed generation retires a prepared command. A lost acknowledgement cannot be blindly replayed using the same handle; fresh authenticated history determines whether its exact set exists. A changed assessment may disable Set while retaining explicitly permitted Skip/early Close. Original capture remains untouched.

## Interpretation limits

`continuation.mjs` uses the actual `client/session.cjs` candidate rule, including the same-day and adjacent-day 23:00–01:00 boundary. Only a singleton component needs no relationship decision. No default generation is borrowed as authority. Multiple-start partition/generation mapping remains required; closed Starts still participate in that existing rule. Non-minute effective times, extra slots, competing corrections, unresolved statuses and missing legacy capture yield named refusals, not corrupt-empty-state guesses or fabricated original instructions.

Known complete prefix means local verified W equals the locally known authority W. It is not proof that an offline device knows unseen remote work. Qualified issuer/current-head/standing/clock contracts remain applicable. Missing/inconsistent stored truth remains state18; independently known standing loss17, rejection19, clock allowance20 and relationship ambiguity14 keep their separate meanings. The owner’s elapsed-time exception does not waive knowledge-loss fencing.

The policy in the tracked demonstration is deliberately synthetic. A valid callback shape does not prove that it is scientifically correct or authorized for Joe/Dad. Production policy, supported prescription combinations, governing plan/consent/effect projection, legacy port, resolved multiple-device workouts, full design, K1/keys/CLOCK, storage capacity, private import/restore and physical phones remain open. Generic legacy `execute` is not relabelled as globally enforcing the new continuation policy. The selected host uses the guarded continuation API.

## Executed evidence and reproduction

Use the retained R1 checkout and W6's real installed dependency directory. No private input or account is needed for these synthetic commands; `W6_BROWSER_BIN` points at installed Chromium/Chrome.

```
node rebuild/m3/w6/test/run-current-head.cjs <R1> --all --resume-browser
node rebuild/m3/w6/test/run-current-head.cjs <R1> --resume-bite
```

Final combined331/331 tests, zero skipped; native WORKOUT RESUME PASS24. The native test drives the actual retained UI/client/encrypted IndexedDB at390CSSpx, closes the page and creates fresh JS realms twice, verifies the same Start/slots/originals and one normal Close, and tests a current-policy Set refusal. Generated test keys remain only in the test process to reopen its synthetic database. This is neither production key custody nor an iOS/process-crash/storage-pressure claim. Other-device relationship rows are explicitly pure interpretation tests below signature authentication, not forged HTTP evidence.

The resume bite removes revision/token binding in a disposable copy: the stale-generation law becomes RED because a write is incorrectly acknowledged. Exact public-client bytes are restored, SHA256 `0087c3c1ea897e8879c3f9d125373ab694bb7c2d6759bd6038ac96ee2bc2c41d`. Earlier red-first tests exposed substituted payload acceptance and nested getter execution in the new draft; both now refuse. Independent acceptance of this combined delta is pending.
