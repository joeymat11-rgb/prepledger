# Earned — the server authority's core (tranche T3, builder CLAUDE)

CommonJS, Node ≥ 18, zero npm dependencies (`node:crypto` only). Pure logic over an injected STORE and CLOCK: no file
system, no timers, no globals, no network. It is the code that will run inside a Cloudflare Worker over D1; here it runs
in-process behind the conformance suite (`rebuild/conform/adapters/authority.cjs`) and behind the T2 client
(`transport.cjs`). It has no reference to the suite and loads on its own: `node -e "require('./rebuild/authority')"`.

## Module map

| module | responsibility |
|---|---|
| `canonical.cjs` | canonical-v1 encoder (independent implementation; byte-identical to every other v1 encoder) |
| `crypto.cjs` | HMAC-SHA256: disposition signing, lease verification, the client's A1 commitment, internal digests (plan effect, compensating group, conflict basis, instance identity) |
| `store.cjs` | the STORE seam: `createStore(backend)` with all-or-nothing `transaction(fn)`; the in-memory backend; row-key helpers |
| `reduce.cjs` | the athlete log: strictly increasing `athlete_log_seq`, append-only entries, frontier W, receipts for a pulling client, the state-16 export |
| `admit.cjs` | A1/A2 admission: identity + replay, shape (MALFORMED), lease capability, slot uniqueness, references (WAITING / REJECTED_DEPENDENCY / CROSS_ATHLETE_REFERENCE), acceptance, release of parked ops, device revocation |
| `plan.cjs` | A5 plan transactions, state-4 lineage keys (numeric vectors) and causal-maximal sets, conflict selection by compare-and-append, undo eligibility + compensation, the plan projection |
| `issue.cjs` | state 8: issuance, instance identity from content, responses, the A6 coverage check, apply results, basis confirmation |
| `committer.cjs` | the LOCAL COMMITTER (state 20): the device-side lease validator with a monotonic high-water clock |
| `transport.cjs` | `localTransport(authority, athleteId)` — the T2 client's `{ send, pull }` shape over an in-process authority |
| `index.cjs` | `createAuthority(config)` — the composition root and the public API |

## createAuthority(config)

```js
const { createAuthority, memoryBackend } = require("./rebuild/authority");
const a = createAuthority({
  authorityKey: "…",                       // signs dispositions; the key leases were signed with
  backend: memoryBackend(),                // any object implementing the STORE backend interface (below)
  clock: { now: () => new Date().toISOString() },
  athletes: { "ath-1": { devices: { "dev-A": { lease } }, plan: { protein_g: 150 } } },
  identityKeyFor: (athleteId) => undefined // optional: when a K_identity is known, the op commitment is re-derived (A1)
});
a.admit(athleteId, op)                     // → the signed disposition (WAITING | ACCEPTED | REJECTED | REJECTED_DEPENDENCY)
                                           //   or { status: "UNAVAILABLE", retry: true } when storage failed (nothing moved)
a.disposition(A, deviceId, deviceSeq) · a.dispositionHistory(…) · a.verifyDisposition(d)
a.log(A) · a.frontier(A) · a.receiptsAfter(A, W) · a.exportSnapshot(A, { outboxPending, rejected })
a.plan(A) · a.planTransactions(A) · a.planOfDomain(A, domain) · a.planState(A, domain) · a.txnDigests(A, txnId)
a.issue(A, issuance) · a.apply(A, request) · a.confirmBasis(A, instance, unchanged) · a.instanceOf(A, issuanceId) · a.instanceState(A, instance)
a.revokeDevice(A, deviceId) · a.enrolAthlete(id, spec) · a.grantLease(A, lease) · a.signLease(lease)
a.localCommitter({ lease, mono, highWater, serverTime, continuityProven, device_id, athlete_id, schema_version })
```

Every public method is ONE store transaction (or a read-only view). Inside `admit`, the admission record, the athlete-log
entry, the plan transaction (for a plan edit), the selection / undo / response effects and the release of parked children
are written together: a failure anywhere leaves both or neither (A5).

## The STORE backend interface

```
begin() → handle                       read(handle | null, collection, key) → text | undefined
keys(handle | null, collection) → [k]  write(handle, collection, key, text)   remove(handle, collection, key)
commit(handle)                         rollback(handle)
```

Rows are JSON text keyed by `(collection, key)`; keys are athlete-scoped (`"<athlete>|<…>"`), so a per-athlete export or
purge is a key-prefix scan. Reads inside a transaction see that transaction's own writes. `commit` is all-or-nothing;
a thrown storage error (`error.storage === true`) rolls the transaction back and surfaces as UNAVAILABLE. Collections:
`athletes`, `devices`, `plan`, `meta` (seq / txn / wait counters), `entries` (the log), `ops`, `slots` (disposition
history per device slot), `owners` (op_id → athletes), `waiting`, `last_accepted`, `revoked`, `plan_txns`, `domains`,
`suspended`, `undos`, `issuances`, `instances`, `applies`.

**What a D1 backend must implement:** one table per collection (or one table with a `collection` column), `TEXT key`,
`TEXT value`, primary key `(collection, key)`; `begin`/`commit`/`rollback` on a D1 batch or transaction with a single
writer per athlete; `keys` as `SELECT key … ORDER BY key`. Nothing else — the authority never relies on object identity
or on reads outside a transaction being consistent with each other beyond the row level.

## Fault injection from outside

The product contains no test hooks. A test injects faults through the backend: `rebuild/conform/adapters/authority.cjs`
wraps `memoryBackend()` so a write to the `plan_txns` collection fails while a crash point is armed. Because the
admission and the plan transaction share one store transaction, the failure rolls both back — the client sees
UNAVAILABLE and retries the same `op_id`, which is then admitted exactly once.

## Not in T3

No HTTP layer, no D1 backend (the interface is real, the only backend is in-memory), no sign-in, no key rotation or
sealing epochs, no scheduled lease sweep, no rate limiting, no multi-authority replication. See `rebuild/t3/REPORT-CLAUDE.md`.
