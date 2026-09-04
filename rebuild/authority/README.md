# Earned authority core

CommonJS, Node 18+, no package dependencies. Only `crypto.cjs` imports a Node
module (`node:crypto`); the admission, reduction and storage logic has no filesystem,
timers, environment access or implicit wall clock. Nothing imports the conformance
suite. This tranche supplies a synchronous core and in-memory backend, not a server.

## Modules

| Module | Responsibility |
| --- | --- |
| canonical.cjs | Independent canonical-v1 bytes, including the ratified decimal quirks |
| crypto.cjs | Operation/member commitments and signed dispositions, leases and time |
| store.cjs | Copied row values, one writer, transaction rollback, memory backend |
| validate.cjs | Envelope, quantities, payload completeness and reclassification |
| admit.cjs | Replay, slot histories, ownership, dependencies, leases and atomic acceptance |
| plan.cjs | Causal projection, numeric lineage keys, selection, compensation, suspension |
| issue.cjs | Issuances, shared instances, coverage, responses and idempotent effects |
| reduce.cjs | Contiguous watermark, immutable receipts and pinned export |
| committer.cjs | Local lease validation and monotonic high-water clock |
| transport.cjs | Synchronous local send/pull for the T2 client |
| index.cjs | Configuration, initialization and public API |

`require('./rebuild/authority')` exports `createAuthority`, `Store`, `memoryBackend`.
`createAuthority({authorityKey, identityKeys, clock, athletes, store?, backend?})`
requires a clock function returning an ISO timestamp, or `{now()}`. `identityKeys`
is an athlete-to-key object or synchronous lookup function. Lookup failure is
retryable; it never turns a valid operation into a terminal rejection. Athletes
contain enrolled `devices: {id: {lease}}` and an optional existing `plan` snapshot.
No initial nutrition or training prescription is fabricated. Initialization does
not replace existing rows when the same backend is reopened.

The API covers admission, log/receipts/frontier, disposition/history/verification,
plan/transactions/domain state/digests, revokeDevice, issue/apply/confirmBasis,
instanceOf/instanceState, exportSnapshot and localCommitter. The local transport
exports `localTransport(authority, athleteId)` with `send(op)` and `pull(W)`.

## Store contract

`new Store(backend)` adapts a backend with synchronous `begin()`, `get(key)`,
`scan()` returning `{key,value}[]`, `put(key,value)`, `commit()`, and `rollback()`.
The encoded primary key is JSON `[athlete_id, table, row_key]`; it preserves opaque
identifiers without delimiter collisions. Absent rows return `undefined`.
Get, scan, put and public return values cross the boundary by value.

`store.transaction(athlete, fn)` passes an athlete-scoped transaction with
`get(table,key)`, `scan(table)`, `insert(table,key,value)`, `put(table,key,value)`
and `owners(opId)`. It returns `{ok:true,value}` only after commit, otherwise
rolls back and returns `{ok:false,error}`. `store.read(athlete,fn)` is read-only.
Backend reads must see staged writes; commit must publish all rows or none;
rollback must release the writer and erase every staged change. A backend must
not report failure after committing unless it can reconcile the durable result.

Tables: `metadata` (head, enrollment, initial plan), `operations` (current
disposition and immutable operation), `slots` (device/sequence ownership),
`history` (one row per disposition transition), `ownership` (per-athlete set),
`log` (one accepted operation and receipt per sequence), `lastAccepted`,
`revocations`, `transactions`, `undo`, `suspensions`, `issuances`, `instances`,
and `applies`. Log, history, ownership and plan transaction rows cannot be
overwritten through Store. Other immutable records use insert; projection rows
are explicitly replaced. The backend snapshot is serializable data, not a graph
of JavaScript object identities.

Admission stages its accepted log row, plan/selection transaction, disposition,
slot and head in one transaction. A waiting child is reconsidered when parents
change and on its own retry; a failed drain can resume from persisted rows.
Contradictory responses suspend existing effects in the response's transaction.
Apply rows retain their first outcome. Replays have no second effect; a current
conflict/supersession overlays an old success so a lost reply cannot claim Applied.

## Fault injection and future D1 backend

Faults belong outside the core: wrap backend.put or backend.commit and throw.
The adapter identifies the requested crash point by the row being written.
Product code has no crash flags, test hooks or alternate rules. `memoryBackend()`
stages writes until commit; `snapshot()` and `memoryBackend(snapshot)` permit
reopen tests, but are not disk persistence.

A SQLite backend can implement the contract with one transaction and a composite
primary key. D1's asynchronous API needs an asynchronous request bridge: obtain a
consistent scoped row snapshot, run this core against a staged row cache, then
publish the resulting batch atomically under one writer or a checked revision.
Reject/retry stale revisions, and release the response only after the batch is
durable. D1.batch alone cannot make earlier unguarded reads atomic. A future
backend must include the ownership lookup and dependency drain in its consistency
model, enforce unique slots/log positions, and implement rollback and restart
tests against actual storage. That bridge is not supplied here.

## Protocol limits

The core expects authenticated enrollment and trusted issuance/basis inputs from
its caller. It is not HTTP authentication, encryption, key rotation, a policy
engine or a consent-contract validator. T3 supports APPLY/KEEP/NO response outcomes;
full A6 contract fields and decision-resolution operations remain future work.
Issuance aliases require identical content apart from issuance_id, and a watermark
cannot claim coverage beyond the current frontier. Issuances and plan effects are
stored separately from the client-operation receipt log in this tranche.

The local committer validates a capability; `{saved:true}` means permission to
commit, not a disk write. Its caller must persist the operation, outbox, sequence
and `snapshot()` high-water state atomically. After unproven restore, signed time
is required (`signServerTime({server_time,...bindings},key)`); the transport must
establish freshness. Persisted clock storage and a network time protocol are not
implemented. Canonical-v1 retains the known tiny-number and exponent collisions;
fixing them requires a versioned protocol change, not a unilateral encoder edit.
