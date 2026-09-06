# W6 independent storage/staging slice

Implementation claim: `rebuild/m3-w6-browser-bridge`, base `df09f438a93cb9548ef3f66b28b39deecc7fb347`, accepted `BRIEF-W6.md` v1.1 and `DECISIONS.md:37`.
This contract is recorded before implementation. It publishes a local storage boundary, not W5's wire protocol. Full W6, CLOCK, browser-T2 integration, remote use and physical-phone acceptance remain incomplete.

## Contract version 1

- `repository.mjs` uses one IndexedDB object store and an authenticated encrypted full-generation record. The active generation's revision is the compare-and-swap token; the previous active generation is retained atomically when the next generation commits. It preserves every collection supplied by the real T2 backend, plus a separate W6 metadata object. No fixed list silently drops future collections.
- AES-GCM-256, fresh random 96-bit IV per candidate, UTF-8 JSON payload, and additional authenticated data binding format version, namespace (athlete/device installation binding), and revision. Keys are supplied by an injected key provider; a missing/unavailable key refuses state 18. This slice's keys are synthetic. Production key custody, epoch migration/recovery and W5 compatibility remain unpublished dependencies; a seal proves content integrity, not freshness or rollback resistance.
- `load()` reads the active record from IndexedDB, then authenticates/decrypts outside the transaction. Missing, malformed, tampered or unsupported generations refuse state 18. It never initializes an empty database automatically or promotes an old generation silently.
- Explicit initialization requires an injected enrollment authorization callback and an absent active/previous store. No callback means refusal; test callbacks are synthetic and are never claimed to verify production enrollment. Production initialization waits for W5's published authenticated enrollment contract.
- `commit(expectedRevision, generation, validate)` seals outside an active transaction, opens one read/write transaction with strict durability requested, checks the current revision, invokes the synchronous final-cut validation, writes previous+active, and resolves only on transaction complete. Quota/abort produces state 3; a stale revision is a retry signal. Failed integrity produces state 18. Actual durability support is recorded; complete is not a claim against eviction or arbitrary physical failure.
- `bridge.mjs` loads a durable generation, executes a command against an isolated candidate through an injected stage adapter, then commits the full candidate. It exposes no candidate view or synchronous T2 acknowledgement while commit is pending. Only complete publishes the new view and success. Failed local writes retain the input and prior durable view; stale work reruns from a fresh generation with a bounded retry count.
- `t2-stage.cjs` is a Node-only integration adapter for the unchanged `rebuild/client` committer. It supplies T2's real memory backend from the isolated generation, calls an allowlisted actual client action, snapshots all backend collections and obtains the actual face. It is not a copied committer, a browser shim or a new operation/signature protocol.
- No incoming network/authenticated-rejection processing is implemented by this slice. Discarding an uncommitted local command does not authorize restoring a known rejected contribution. W6's recovery-intent/fence and learned-knowledge persistence requirements remain HARD CLOCK blockers until proved.

## Interfaces and review seams

Generation payload: `{ collections: { [collection]: { [key]: JSONValue } }, metadata: { ...W6Fields } }`.
Namespace: an explicit nonempty installation binding supplied by the authenticated host. No default athlete/device identity.
Initialization: `initialize(generation, enrollmentEvidence)` verifies the injected authorization before writing. It never infers first use from absence.
Commit: returns `{ revision, durability }` after `complete`; errors have `state`, `code`, and optional retryability, never private values.
Bridge: `execute(command, args)` returns a cloned command result only after durable completion; `current()` returns the last published cloned view plus retained input and an optional refusal. Concurrent callers through one bridge are serialized; separate bridges are protected by the stored revision.

Required narrow T2 amendment before browser integration: separate permission-time checking at `client/index.cjs:112` from athlete timestamp uses at `:132,143`; introduce an explicit crypto/verified-capability seam for Node crypto and the existing shared-HMAC authority verification. No T2 file is changed here. Do not publish a fake HMAC lease or re-sign W5 records to disguise incompatibility.
The installed PWA must consume verified remote operations, not only T2's `ownOps`; this slice preserves all collections but does not claim W7 projection is complete.
Final standing/clock validation occurs at the transaction's write cut. The physical interval between queued writes and durable completion still needs the accepted W6 clock/standing integration proof; this repository primitive alone earns no STANDING/CLOCK PASS.

## Tests and limits

Run `npm install --no-package-lock --ignore-scripts` in this folder, then `npm test` (Node >=22). Only fake-indexeddb is a local dev dependency; the frozen root lockfile is untouched.
The test runner must reproduce the original early-Saved witness, then prove delayed completion/abort, full-generation reopen, missing/tampered state18, stale independent-writer races, whole-batch commits and candidate/view isolation through the real T2 Node adapter. Fake IndexedDB is preliminary evidence, not iPhone durability.
The required disposable early-ack bite changes only a copied bridge and must be detected; its original bytes/hash are restored and compared. Unchanged W3 and public conformance checks remain separate regression evidence.
No browser/remote/phone gate is passed merely because these tests pass. W5's immutable wire/time/renewal contract, sufficient time bounds, the knowledge-loss fence, production key custody, real IndexedDB tests and W9 physical tests remain required.
The seeded soak and its origin are untouched. This different store cannot inherit its survival verdict automatically.

## NEXT

This slice prepares W6's storage and command-staging boundary. It does not unblock private import or complete W6. Continue W6 on this claim when its reviewed T2 amendment and pinned W5 contract are available; root coordinates independent cowork review and one eventual implementation PR.
