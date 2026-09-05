# CLOCK CONTINUITY — W3 design note

Scope: PLAN-M3-v1 §2 W3 / §6 CLOCK, runtime sheet v1.7.38 A2, B11/B17/B18/B20 and C1/C11. W3 is separate from the storage soak and must not open or alter that installation. This note changes no product or suite rule and creates no service.
Target supplied by the owner: iPhone 17 Pro / iOS 26.6.1. **Physical target tests: NOT RUN.** Browser documentation and synthetic models cannot establish its clock behavior.

## Finding and decision boundary

A persisted signed time sample plus browser timestamps is not a demonstrated offline clock across process termination, reboot or restored storage. When continuity is unproved, this spike must return state 20 and refuse new athlete-operation acknowledgement. A successful conservative refusal proves safety of that refusal; it does not satisfy C1's requirement to cold-start offline and write.

The proposed browser route therefore has an unresolved C1/C11 conflict: trusting an unproved restored anchor risks extending the lease, while refusing every fresh execution prevents offline cold-start writes. Record the C1 failure of that proposed policy separately from physical-phone evidence. Runtime C:660 requires the native decision when a C-row fails; the builder must surface that decision, not label the route feasible, weaken C1 or silently switch platforms. A native implementation would also need its own tested clock, reboot and restore contract.

## What the platform evidence establishes

The current [High Resolution Time Level 3 working draft, 1 September 2026](https://www.w3.org/TR/2026/WD-hr-time-3-20260901/) scopes its monotonic clock to one user-agent execution. It permits a new epoch estimate after restart or isolation; Window time origin refers to navigation, worker origin to worker startup. Background callback throttling should not change clock accuracy. These are specification statements, not proof of this iOS build. The draft does not supply this application's maximum elapsed-time error budget.

[WebKit bug 225610](https://bugs.webkit.org/show_bug.cgi?id=225610), still NEW when checked, records performance.now stopping during system sleep on macOS and discusses Darwin's clock selection. It is evidence against assuming universal sleep coverage, not an executed iOS 26.6.1 failure. [WebKit's power guidance](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/) separately documents iOS page suspension. Timer callbacks are not a clock-survival witness.

[Service Worker lifetime rules](https://www.w3.org/TR/service-workers/#service-worker-lifetime) permit termination when no event needs handling; keeping an object reference or an installed registration does not keep a process clock alive. Moving the anchor into a worker does not close the restart gap.

| Mechanism / event | What can be established | What remains unproved / resulting policy |
|---|---|---|
| performance.now inside one known uninterrupted execution | Ordered relative samples, independent of athlete wall-clock edits | Real elapsed upper bound still needs a qualified clock/error profile; monotonic alone does not mean sleep-inclusive |
| performance.timeOrigin + performance.now | A shared timeline within compatible live contexts | No durable boot identity or cross-restart clock certificate; never infer continuity from a numerically plausible sum |
| Date.now, local date, offset, DST or timezone | Athlete/system time presentation and diagnostic observations | Cannot authorize a lease or lower its high-water value; rollback can manufacture an apparent unexpired date |
| Background, lock, suspension, BFCache/page restoration | Lifecycle notifications can invalidate an anchor | Notification absence is not proof of uninterrupted time; restored JavaScript object identity alone does not measure omitted sleep |
| Process kill, new page, reboot | A new execution can read intact saved data | Reading an old anchor does not establish elapsed time since it; default state 20 |
| Old local-state restore | Its signature/checksum may still verify | Integrity is not recency; a rolled-back lease/high-water/sequence snapshot cannot become current offline |
| Signed response to a fresh challenge | Authorized signer, unchanged bound content, response to this challenge | A signature cannot bound delivery delay or guarantee correct server time by itself |
| Durable high-water checkpoint | Prior acknowledged clock evidence can survive ordinary storage reopening | It is a past bound, not a clock that advances while the process is absent; an old restore can also roll it back |

The table's refusal decisions are this design's conservative inference, not browser guarantees. No cookie, IndexedDB receipt, service-worker cache, build ID or random page ID is treated as a trusted OS boot witness.

A complete, internally valid old-state rollback cannot be detected from those local records alone: its signed lease, integrity checkpoint, high-water and sequence may all agree while omitting later history. The model refuses every new execution until independently supplied prerequisites are met; it does not identify which intact snapshot is old. Its historyReconciled call accepts trusted synthetic booleans, not an implemented server-history or recovery proof. Fresh signed time alone cannot make an old sequence safe.

## Conditional signed-time protocol — no athlete wall-clock authority

The following protocol includes obligations for later W5/W6 integration, not a deployed time service. The executable model implements a conditional subset with a fixed synthetic verification key; it has no production key-epoch protocol, browser verifier or history-recovery implementation. The existing authority committer's caller-supplied continuity flag and signed-time method are integration seams; the client currently accepts clock.now from its caller. Their tests do not establish browser continuity.

1. Hold a newly generated unpredictable challenge in the current execution. Bind the reply to the challenge, athlete, enrolled device, lease, schema, protocol domain and authority verification-key epoch. Reject wrong bindings, replay, malformed fields and unknown keys. Consume a challenge once; an interrupted request or replaced execution cannot reuse its pending reply.
2. Verify the exact signed bytes with the pinned authority public key. The M3 plan requires P-256/SHA-256 verification on phones; no authority signing secret is delivered to the browser. [Web Cryptography's ECDSA definition](https://www.w3.org/TR/webcrypto/#ecdsa) specifies signing/verification, not time freshness. A local test signer is synthetic evidence only.
3. Let m0 and m1 be the elapsed-clock samples before request dispatch and at response receipt. Authenticate the response before accepting its anchor, and include verification/processing time in the subsequent Δhi(m1,m) permission check. Let S be the signed server timestamp sampled after receipt of that challenge. The server must have an independently justified error bound εs. The elapsed-clock provider must supply a conservative upper bound Δhi(a,b) that includes drift, quantization, sleep and any interruption. All values and bounds must be finite and nonnegative where applicable. This model supplies that provider explicitly from synthetic traces; it certifies no browser profile.
4. At receipt, use the interval [S − εs, S + εs + Δhi(m0,m1)]. Advance the upper end by Δhi(m1,m) at each decision; keeping the lower end fixed at S − εs is conservative and is sufficient for this spike. Advancing it would need a separately qualified lower elapsed bound. This deliberately does not assume symmetric network delay. Refuse a reply whose measured interval exceeds the qualified freshness policy; do not invent a universal RTT or drift tolerance.
5. Preserve H = max(previous H, current conservative upper bound) within the same verified storage lineage. The permitted interval must be at or after not_before and at or before not_after; use its lower bound for not_before and max(H, upper bound) for not_after. Check the signed schema/device/athlete binding and the entire proposed device-sequence range too. A midpoint estimate, raw signed S or persisted H alone is insufficient.
6. Unknown continuity, an invalid elapsed reading, a changed provider epoch, a known lifecycle interruption, or unproved snapshot lineage invalidates write permission. A new challenge can restore permission only when its own elapsed-time bound is qualified; “online” and “signature valid” are not continuity proofs. Restore or new-execution state never inherits a serialized continuityProven=true. Require a separate, nonpersisted history-reconciled condition for lease/sequence lineage after reopening: fresh time alone cannot establish that an old restored device-sequence counter is safe to reuse.
7. Persist the lease, clock evidence/high-water, sequence, operation and outbox at the declared local commit boundary; never publish Saved before durable completion. Check permission at that boundary, not only at button press or before asynchronous crypto. W6 must inject expiry, standing changes and continuity loss during pending work. This spike cannot certify the asynchronous IndexedDB commit cut or silently turn its synchronous model check into a durability claim.

[RFC 8915 §8.6](https://www.rfc-editor.org/rfc/rfc8915.html#section-8.6) explains why authentic time packets remain susceptible to delay attacks. This design uses an upper bound rather than its NTP offset formula. If the local timer can omit an unbounded sleep interval, even an apparently small round trip has no established real-duration ceiling. Such a browser profile remains unqualified; zero error, a guessed drift allowance or a visibility flag must not manufacture that proof.

The executable model's 1,000 ms maximum round trip and zero server error are synthetic fixture defaults for an ideal signed clock; neither is a production bound. Its injected upperElapsed function is an explicit premise. It detects a decreasing reading, but has no readEpoch API or independent lifecycle detector: provider-epoch changes require the caller to invalidate or the provider to return an unavailable bound. An epoch replacement that still returns plausible increasing readings is not automatically detected. Node's local P-256 signer/verifier and JSON field-order encoding do not implement the production Web Crypto wire format or key lifecycle.

A wall-clock jump may be recorded as a diagnostic but cannot improve permission, extend expiry or recover continuity. Lease comparisons use instants; DST/timezone changes affect athlete-attested display only. Renewed server time may not retroactively shorten a legitimately issued lease or rewrite previously acknowledged operations.

## Exact runtime-state mapping

Runtime source lines: A2 132–149; durability/precedence 318–326; B11 542–544; B17/B18 597–607; B20 623–628; C1/C11 631–660.

| Condition | Required state / action |
|---|---|
| Missing, evicted or corrupt store/checkpoint | 18 before plan or athlete-data paint; restore flow, never first use inferred from emptiness |
| Known sign-out, revocation, closed account, unavailable decryption or recovery | 17; refuse new writes even with valid clock/lease; retain entered values and name recovery; no new future-sync promise |
| Intact store/standing but unproved continuity, expired cutoff, unrenewed required schema or exhausted sequence range | 20; no acknowledgement; retain fields and name the needed connect/sign-in/update action |
| Authentication session expired, still enrolled and decryptable, valid time and sequence lease | 11; logging remains permitted under durability rules, sync pauses; do not misclassify as 17 |
| Valid standing, interval and sequence; local durable transaction fails | 3; no Saved, no ghost operation or sequence consumption |
| Offline with every gate satisfied and durable commit complete | 1 / ordinary offline face; saved locally, not yet synced, with the existing visibility rules |
| Previously valid committed operation reconnects after not_after | Preserve and replay; authority must not reject merely for late arrival; the explicit revocation barrier remains the exception |

Data paint precedence is 18 before 17. Write permission precedence is 17 before 20 before 3. State 19 remains the orthogonal authenticated rejection ledger; local range exhaustion routes to 20, not an invented terminal authority rejection. State 7 can coexist with 20. A fresh token cannot repair missing enrollment, key material, storage lineage or clock proof.

This clock model supplies permission decisions only. It does not authorize deleting saved outbox records, replacing the local-store recovery contract, storing unacknowledged fields durably without the declared draft mechanism, or changing causal ordering to use timestamps.

## Executable witness and evidence boundary

Executed from this checkout with the bundled Node runtime: `node --test rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs`. Independent review run after the immutable-lease correction: **39 tests, 39 PASS, 0 FAIL** — 32 in continuity.test.mjs and 7 in core-witness.test.mjs. The latter contains five RED WITNESS tests that reproduce unchanged T2 gaps and two controls; passing a red assertion does not pass C11.

continuity-model.mjs starts each model instance unproven, requires explicit upperElapsed and history-reconciliation premises, and routes model.weighIn through the real T2 weighIn path. Its wrapper stages the signed lease/high-water checkpoint in the same synchronous transaction as sequence/operation/outbox, and checks permission at its simulated commit hook. The tests verify rollback and result mapping at that hook. The exposed underlying client is used for test controls and inspection; direct client writes are not the guarded model API. No asynchronous IndexedDB transaction, browser elapsed provider, deployed signer or physical phone is exercised by these commands.

Named assertions below are model/core evidence; they do not certify the browser events appearing in their names.

| Executed assertion(s) | Observed result and boundary |
|---|---|
| C11 time: last valid cutoff is inclusive; first invalid millisecond is state20 | Exact last valid time commits; next millisecond refuses without durable changes |
| C11 sequence: last valid slot saved; first invalid slot and exhaustion are state20; C11 sequence: below authorized start is also refused state20 | Inclusive end and both out-of-range directions checked; next state remains 20 |
| Seven C11 wall-observation cases: minus24h skew, plus24h skew, wall rollback, wall roll-forward, DST forward, DST backward, timezone change | Mutating deliberately non-authoritative synthetic wall/zone fields never changes lease permission; no OS clock or timezone was changed |
| C11 process kill / reboot / restored old local state: durable outbox survives but a new execution has no proof, state20 | New model instances with retained or restored memory snapshots refuse 20; a fresh signed time without reconciliation also refuses |
| C11 suspension / unqualified elapsed source: even authentic time cannot establish an upper bound; C11 monotonic rollback and explicit lifecycle invalidation refuse state20 | Missing bound, decreasing sample and explicit invalidation refuse; real sleep and lifecycle delivery remain NOT RUN |
| Freshness: signed nonce replay, forged signature and mismatched bindings never reanchor; Freshness: bounded reply delay is charged conservatively; oversized delay is refused | Synthetic replay/binding tamper refuses; bounded delay and drift are charged; a 1,001 ms reply exceeds the fixture limit |
| Fresh anchor never decreases a surviving persisted high-water mark | Reopening with a newer surviving checkpoint retains its upper bound; this does not detect a wholly rolled-back valid checkpoint |
| State11 session expiry pauses sync but a valid lease still saves; state17 outranks20; four State17 standing cases | Session expiry permits a valid save with sync paused; known sign-out/revocation/closed account/key or recovery loss refuses and retains the input |
| State18 partial loss and whole-store erasure block before first-use/clock decisions; State18 loss of the clock checkpoint after anchoring refuses before acknowledgement | Explicitly enrolled model fixtures fail closed on missing rows, complete empty storage or checkpoint deletion; no physical origin eviction was performed |
| Commit cut: expiry or lost continuity during staging rolls back operation/outbox/sequence/high-water | Both simulated permission faults return 20 with an unchanged snapshot |
| Commit cut: ordinary storage failure is state3 and rolls back high-water too; Commit cut: failure after clock record is staged also rolls back every durable record | Both synchronous injected storage faults return 3 and preserve the entire prior snapshot; pending IndexedDB work remains outside this test |
| Commit cut: caller mutation cannot extend the originally signed lease during staging | The model copies/freezes its lease; caller mutation during staging cannot extend the original cutoff |
| C11 late reconnect: actual T3 accepts original valid outbox after cutoff, including replay; C11 declared revocation: state17 for known loss; authority barrier preserves accepted prefix | Real T3 admission accepts a valid late operation/replay; declared revocation preserves its accepted prefix and rejects beyond the barrier |
| Five RED WITNESS assertions in core-witness.test.mjs | Unchanged T2 reproduces wall rollback reopening, ignored high-water/continuity, erased-store sequence reuse, coherent-restore identity collision and exhausted-range face mismatch |
| Two CONTROL assertions in core-witness.test.mjs | Unchanged T3 independently preserves valid-cutoff late admission/replay and the declared revocation barrier |

**C1/C11 red witness:** the executed `C1-C11-RESTART RED WITNESS: identical local observations cannot distinguish pre/post expiry` constructs a saved lease/high-water/state snapshot and two labeled histories: A is absent for one second; B for 31 days, beyond the 30-day cutoff. Both reopen with the same synthetic observations and snapshot; hidden real elapsed time is deliberately not an input. The assertion observes [20,20], unchanged storage and retained values. Its documented timeOrigin is part of the indistinguishability example, not a browser API exercised by the model. If a proposed offline policy permits A using only these observations, it also permits B, violating C11. Refusing both preserves safety while leaving C1 cold-start writes **UNSATISFIED**. This model result supports the native-trigger decision discussion; it does not show either history was physically run on the iPhone or prove that no future platform-specific continuity source could distinguish them.

For the physical CLOCK appointment, use a separate installed spike with synthetic records and an independent time reference. Record actual device/OS, browser/build, fresh anchor challenge, documented provider assumptions, last valid/first invalid time and sequence, lock/sleep, one-hour resume, force kill, reboot, old-store restore, ±24-hour clock edits, DST/timezone cases and late reconnect. Store/standing/durability verdicts remain separate. Preserve entered values and original saved operations in every refusal case. Do not run these probes on the idle soak origin.

The included browser app records diagnostic wall/performance/origin observations and explicitly remains at state 20 for lease permission. Storing a diagnostic observation is not acknowledging an athlete operation. It has no signed-time endpoint or qualified elapsed provider; installing or using it alone cannot execute all the model's conditional lease cases or finish this physical appointment.

A positive short foreground timing observation is not a supported-device continuity certificate. A phone result requires recorded target execution; the 30-day storage experiment cannot establish lease-clock correctness.

## Native decision and open work

There is presently no demonstrated browser-only provider satisfying offline cold-start continuity under these rules. The conservative route must expose C1 as unsatisfied and carry the native-trigger decision to Cowork/the owner. W3 may complete its investigation while the D1 feasibility gate remains open or red; it must not claim M3 D2 or design freeze complete.

Native is a possible engineering route, not a proven remedy. Apple's [mach_continuous_time documentation](https://developer.apple.com/documentation/driverkit/mach_continuous_time) describes a monotonic clock that includes system sleep; Apple's [public Darwin header](https://github.com/apple/darwin-xnu/blob/main/osfmk/mach/mach_time.h) declares its iOS availability. These sources do not prove a specific native client's reboot detection, anti-rollback storage, clock-error budget or target behavior. Native work would need an authenticated anchor, a trustworthy same-boot continuity mechanism, safe refusal after unproved reboot/restore, atomic storage and the same C1/C11 device tests. No native app is built or platform ruling made here.

Open integration facts are the real authority clock/error policy and key lifecycle; the browser/native elapsed provider's tested guarantees; rollback-resistant state lineage/sequence recovery; the asynchronous local commit boundary; and the physical iPhone verdict. None is supplied by a caller setting a boolean, a model test passing, or this note.
