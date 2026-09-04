# Earned — client core (tranche T2)

The new client's core, built against the 35 §B laws of sheet v1.7.38. CommonJS, Node ≥ 18, zero dependencies
(`node:crypto` only). It has no reference to the conformance suite and loads on its own:

    node -e "require('/home/claude/rebuild/client')"

## Module map

| module | responsibility |
|---|---|
| `canonical.cjs` | canonical-v1 encoder (NFC strings, canonical decimals, sorted maps, de-duplicated sorted SET fields, absent ≠ null ≠ value). Independent implementation; byte-identical to the ratified v1 profile. |
| `ops.cjs` | the A3 operation envelope, A4 presence validation, and the A1 identity: `commitment = HMAC-SHA256(K_identity, "earned/op/v1" ‖ encode(envelope minus commitment and authority metadata))`; the shared `signatureOver` primitive for authority-signed records. |
| `store.cjs` | the durable local store: real all-or-nothing transactions over a pluggable backend, the integrity checkpoint, `integrity()`. The in-memory backend ships here. |
| `outbox.cjs` | op_id-keyed outbox accounting: attempts, backoff `[0, 1000, 2000, 4000]` ms, eligibility, retry of the same op_id, the sent log. |
| `sync.cjs` | send, authenticated dispositions (WAITING / ACCEPTED / REJECTED as one atomic transaction), receipts, the contiguous frontier W, reduce-through-W, plan-transaction "Applied" tracking, the four copy-law labels. |
| `lease.cjs` | the offline-write lease: authority signature, device/athlete binding, time window by the local clock, sequence range. |
| `plan.cjs` | plan projection, state-5 fallback (transitive exclusion of inherited values), issuance instance derivation, the initial-plan offer, members from session facts, domain units. |
| `session.cjs` | candidate edges and ambiguity components, generations, complete-partition validation and canonical form, SAME-WORKOUT basis selection, set-collision resolution. |
| `face.cjs` | the governing state machine (write precedence 18 > 17 > 20 > 3; machine output 14 > 7 > 11 > 6/2/1), the two-layer face, dependency-aware withdrawal, the D7 board ladder, state-4 conflict copy. |
| `copy.cjs` | every exact face string in one place. |
| `bodycomp.cjs` | lean mass from a body-fat fraction interval (`1 − bf`, "midpoint" when no central estimate). |
| `index.cjs` | `createClient(config)` — the composition root: boot/restart from the store, the named actions under the durability rule, and the API. |

## createClient(config)

```js
const { createClient, memoryBackend } = require("/home/claude/rebuild/client");
const client = createClient({
  deviceId: "dev-A", athleteId: "ath-1",
  identityKey: "<K_identity for this epoch>", authorityKey: "<authority verification key>",
  backend: memoryBackend(),                       // any object implementing the backend interface below
  clock: { now: () => isoNow, today: () => "YYYY-MM-DD", tz: "-04:00", monotonicMs: () => ms },
  lease,                                          // the authority-signed offline-write lease for this device
  transport: { send(op) {/* → { disposition } | undefined */}, pull(W) {/* → { receipts } */} },   // optional
  online: true, contract: { client: "1", required: "1" }, standing: "enrolled", signInRequired: false,
});
client.boot();      // integrity check → load the complete local frontier; before boot() the face paints a SKELETON
```

Named actions (`weighIn`, `logSet`, `decision`, `correction`, `tombstone`, `undoRequest`, `finishSession`, `planEdit`,
`respond`, `logSession`, `acceptInitialPlan`, `resolveAmbiguity`) each return
`{ acknowledged, state, copy, op_id }`. An action is acknowledged only after ONE durable transaction wrote the operation
and its outbox entry; otherwise nothing is recorded (state 3) and the entered value stays in `fieldValue(name)`.

## Backend interface (store.cjs)

```
begin() → handle                         start a transaction
write(handle, collection, key, value)    stage a durable write inside it (throw on storage full / denied / corrupt)
remove(handle, collection, key)          stage a durable delete
commit(handle)                           make every staged write durable at once
rollback(handle)                         discard everything staged in the transaction
get(collection, key) · keys(collection)  reads; a transaction sees its own staged writes
clear(collection)                        erase a collection outright (D2 erasure)
```

`store.transaction(fn)` runs `fn(txn)`; every `txn.put`/`txn.del` reaches the backend immediately inside the open
transaction. If `fn` throws or any backend call throws, the store calls `rollback` and returns `{ ok: false, error }` —
nothing staged survives (the shipped in-memory backend applies writes immediately and keeps an undo journal, so a
rollback genuinely reverts partial work). On success the store writes an integrity checkpoint (record counts of `ops`
and `outbox`) inside the same transaction; `boot()` compares it against the store and enters state 18 on disagreement.

Collections the client uses: `ops`, `outbox`, `dispositions`, `rejected`, `receipts`, `planTxns`, `plan`,
`planTransactions`, `planHistory`, `suspensions`, `issuances`, `sessionStarts`, `sessionResolutions`, `drafts`,
`sync` (`snapshot`, `frontier`, `reductions`), `meta` (`device`, `standing`, `checkpoint`).

## Fault injection is done from outside

The product contains no test hooks. To make storage fail, hand `createClient` a backend that fails:

```js
const inner = memoryBackend();
const faulty = { ...inner, write(h, c, k, v) { if (c === "outbox") throw new Error("disk full"); return inner.write(h, c, k, v); } };
```

Such a backend makes a weigh-in fail after the operation write and before the outbox write; the store rolls the
operation back and the action reports state 3. Storage loss is simulated the same way (`backend.clear("ops")`, then
`client.restart()`), a rejected-ledger crash by failing writes to `rejected`, and an authority by a `transport` object
that answers `send` with a signed disposition and `pull` with receipts. The suite's adapter
(`rebuild/conform/adapters/client.cjs` in the repo) is the worked example.

## Not in T2

No UI, no real persistence backend (only the in-memory one), no real transport, no key-epoch rotation or payload
sealing (P1/P2), no engine (Layer-2 numbers come from the last sync snapshot only).
