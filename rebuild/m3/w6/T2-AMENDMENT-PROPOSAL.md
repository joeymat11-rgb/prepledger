# W6 narrow T2 amendment — concrete proposal, PENDING REVIEW

Prepared against storage checkpoint `e934f9b1787fbe01dc241081594254b5caeb1d8a` and W5 `d44706123d4be8844db6f919a8238255b73e3fb2`. This published proposal replaces the initial tentative amendment without changing the submitted storage code. No T2 file, dependency or dependent implementation has changed. BRIEF-W6 references this proposal as PENDING REVIEW; cowork must independently review it before these product paths are edited.

**Correction to the checkpoint report:** W5's callable implementation is already published at that SHA, not merely its WIRE document. I have now read `public-client.cjs`, `crypto.cjs`, fixtures and the build/package files. The required public API can be pinned immediately. Sufficient production time bounds and reconciliation/renewal remain genuinely OPEN. This correction changes no executed storage verdict.

## 1. Smallest T2 source allowlist and unchanged defaults

After independent acceptance, amend exactly `rebuild/client/index.cjs`, `rebuild/client/lease.cjs`, `rebuild/client/sync.cjs`. Do **not** edit `ops.cjs`, `plan.cjs`, canonical encoding, Store, Face, Copy, session logic, authority or any frozen suite. Browser bundling will replace only the two observed Node SHA-256 imports at the explicit boundary in §3, through adapter code under W6 that must be tested before acceptance. No committer is copied.

Add these optional inputs to the existing factory `createClient(config)`:

```ts
config.authorityVerification?: {
  verifyLease(lease: Readonly<Lease>): boolean;
  verifyDisposition(disposition: Readonly<Disposition>, operation: Readonly<Operation>): boolean;
};
config.permissionNowIso?: () => string;
config.onPreparedBatch?: (batch: Readonly<PreparedBatch>) => void;
type PreparedBatch = {
  version: 'earned/client-batch/v1'; athleteId: string; deviceId: string;
  count: number; firstSequence: number; lastSequence: number; leaseId: string;
  operations: readonly Readonly<Operation>[];
};
```

These are trusted application integration inputs, not server-supplied functions or durable `verified:true` flags. All optional functions are synchronous. When absent, retain today's HMAC verification, required `authorityKey`, clock calls, exact envelopes, returned values and source behavior. No new default clock sample, batch callback or metadata is introduced into existing tests. With `authorityVerification` present, require **both** functions and permit omission of `authorityKey`; reject partial configuration rather than supply a dummy HMAC authority secret.

| File / current lines | Exact amendment and failure behavior |
|---|---|
| `index.cjs:36,112,128` | Validate the optional verifier pair, pass its lease/disposition predicates through to Lease.check/createSync, and select `permissionNowIso()` only for Lease.check's `nowIso`. `clock.now()` at athlete effective-time and outbox-enqueued uses remains unchanged. A supplied invalid/nonfinite/unavailable permission sample produces a lease refusal, never a fallback to wall time; higher-priority integrity/standing states still govern. |
| `lease.cjs:11–25` | Extend `verifySignature(lease, authorityKey, verifyLease?)` and pass `ctx.verifyLease` from `check`. A supplied predicate must return exactly `true`; exceptions/Promise/object/truthy values fail verification. Keep device/athlete binding, issued time and inclusive sequence endpoints unchanged. It replaces only the signature primitive. |
| `sync.cjs:18–33` | Accept optional `ctx.verifyDisposition`; replace only the HMAC condition with exact-true synchronous predicate approval of the same disposition and stored operation. Preserve status, operation identity/commitment, device/sequence, outbox, duplicate and atomic WAITING/ACCEPTED/rejection logic. Exceptions/Promise/truthy results refuse without effects. |
| `index.cjs:134–148` | After successful construction of all actual operations and before any Store.transaction, call `onPreparedBatch` with a deep-cloned, recursively frozen descriptor. `count` is **actions.length**, endpoints are the actual first/last assigned sequence and operations are the actual built envelopes. Callback must return undefined; a throw/Promise/other return refuses state 3 before writes. The callback captures evidence only: it does not claim durable success or charge a budget. No callback for a lease/build refusal. |

The permission factory captures one immutable permission sample for each staged candidate; the face and both committer endpoints use that same evidence. W6 repeats its current-policy validation at the final IndexedDB cut. Real `[Tlo,Thi]` or checkpoint creation still requires W5's missing assumptions; a synthetic ISO value can test separation but cannot earn CLOCK PASS. No permission estimate is ever injected into the athlete's timestamp/identity clock.

## 2. Published W5 API and exact durable sinks

Use the unchanged pinned module `rebuild/m3/w5/public-client.cjs` with its pure `authority/canonical.cjs` dependency. Do not bundle `w5/crypto.cjs` or any signing/private-key code.

```ts
createPublicBoundary({
  keys, athleteId, deviceId, client,
  subtle, crypto, monotonicMs, maxTimeRoundTripMs, schemaVersion
});
createPublicVerifier({keys, subtle});
```

`keys` contains pinned `{kid, publicKey: verificationOnlyP256Jwk}`. Bind a frozen `client` sink object permanently to one authenticated installation/session epoch; never redirect an existing boundary to a different account. All high-level accept methods are async. The lower verifier exposes async `verifyRecord`, `verifyDisposition`, `verifyReceipt`, `verifyPull`, `verifySnapshot`, `verifyLease`, `verifyServerTime` (source44–74).

| Public call / source lines | Exact sink / W6 adaptation |
|---|---|
| `acceptDisposition(record, expectedOperation)` /116–124 | `client.deliverDisposition(disposition)`. Supply the stored immutable expected operation explicitly; the optional `client.envelope(opId)` fallback is synchronous. After public verification, stage T2.deliverDisposition with a predicate approving **only those exact authenticated bytes**, then await durable commit. Rejection handling also requires the knowledge fence; no unconditional production use before that proof. |
| `acceptPull(envelope)` /126–132 | `client.deliverReceipts(receipts)`. Stage existing T2 receipt/history ingestion. Retain complete signed envelope/receipts separately in the same W6 generation because T2's receipt DTO strips signatures. No frontier publication before durability. |
| `acceptSnapshot(snapshot, expectedWatermark)` /134–141 | `client.receiveSnapshot(snapshot)`. W5's accepted-log snapshot is not T2's projected-product snapshot. Store its signed proof and pass entries through verified history ingestion; do not call T2.receiveSnapshot with the wrong shape. W7 projection remains separate. |
| `acceptLease(lease)` /143–151 | `client.receiveLease(lease)`. This is a W6 sink, absent in T2. Store the exact signed capability in metadata and reverify on reopen before configuring T2. It does not renew a lease or issue a checkpoint. |
| `beginTimeChallenge()` /153–159 | Returns `{challenge}` for POST `/time`; generate only within a durably armed authenticated exchange once that fence is proven. The 30,000ms maximum is the published challenge lifetime, not a proven clock error bound. |
| `acceptServerTime(record)` /161–174 | `client.syncedServerTime(record)`. Store authenticated sampled-time evidence; no `[Tlo,Thi]`, refill or checkpoint inferred. Challenge consumption occurs before sink invocation; retry a failed durable exchange with a fresh challenge. |

The proposed W6 factory `createDurablePublicClient({repository, stage, namespace, sessionEpoch, isCurrentSession, keys, subtle, crypto, monotonicMs, maxTimeRoundTripMs, schemaVersion})` owns that immutable boundary and its serialized sinks. Public callers submit raw HTTP responses; sinks and verification-grant construction stay private to the factory. Check HTTP wire-version headers before delivery, including disposition/lease responses which lack a signed wire-version field. Do not convert typed HTTP failures into terminal dispositions.

W5 `forward()` (104–109) treats `false` or `{stored|durable|confirmed:false}` as sink failure. It incorrectly appears successful if a sink returns raw W6 `{acknowledged:false,state:18}`. Every W6 sink must therefore return `{stored:true,durable:true,...}` only after complete, and `{stored:false,durable:false,state,code}` on refusal. Preserve W6's underlying states 17, 18, 19 and 20 in its presentation; W5's outer state 3 or caught-exception state 12 does not replace them. This adaptation is necessary without changing W5.

A same-family executed probe confirmed that result mismatch. It also held a raw WebCrypto verification, mutated the caller's lease, and observed success for the earlier bytes while reverification of the changed object failed. High-level accept methods copy their inputs; low-level use must copy/freeze first and use that isolated snapshot throughout. Async signature verification completes outside IndexedDB; synchronous T2 predicates compare the **entire verified immutable snapshot including signature**, scope and current session epoch, never `Promise` truthiness, a bare op_id or persisted verification flag. Reverify stored proofs on every new process/key context. If CAS retries against a new generation, rebind the expected operation and grant to that fresh staged basis.

## 3. Browser crypto and bundle choice

Propose runtime dependency **`@noble/hashes` exactly `2.2.0`** and development dependency **`esbuild` exactly `0.28.1`**, both explicitly declared under `w6/package.json`; no root dependency or lockfile changes. Do not depend on an already installed or root-resolved esbuild. Import only `hmac.js`, `sha2.js` and `utils.js` from noble-hashes. This release supplies synchronous HMAC/SHA-256 with byte-array inputs and no runtime dependencies; its package/version and API are published by the maintainer. [Pinned package](https://github.com/paulmillr/noble-hashes/blob/2.2.0/package.json), [pinned API](https://github.com/paulmillr/noble-hashes/blob/2.2.0/README.md#hmac).

Security qualification: the maintainer describes a self-audit for 2.2.0 and an independent Cure53 audit for 1.0.0. Do not label 2.2.0 independently audited or promise constant-time JavaScript. This choice needs review and exact Node/browser vector parity; it is not implemented/installed by this proposal. [Audit scope](https://github.com/paulmillr/noble-hashes/blob/2.2.0/README.md#security). Native WebCrypto stays responsible for AES-GCM and W5 P-256; its Promise-based signing interface cannot be inserted as a synchronous HMAC return inside today's committer. [WebCrypto interface](https://w3c.github.io/webcrypto/#subtlecrypto-interface).

New `w6/node-sha256-browser.mjs` exports only the observed subset `createHmac('sha256', stringKey)` and `createHash('sha256')`, returning chained `update(text,'utf8')` and `digest('hex')` methods backed by the library. UTF-8 byte encoding and lowercase hex preserve Node's exact contract, including lone-surrogate replacement. Reject other algorithms/encodings/methods. HMAC key conversion remains the existing `String(identityKey)` in ops.cjs. The SHA-256 path is also necessary for `plan.cjs:12,52` issuance identities; omitting it would break browser loading/issuance even if a weigh-in passes.

New `w6/build-browser.mjs` resolves the proposed local W6 esbuild 0.28.1 dependency. Its `onResolve` replacement is limited to literal `node:crypto` **only when importer is the exact accepted client/ops.cjs or client/plan.cjs**. Reject any unexpected Node builtin or signer import. Bundle the actual T2/W5 sources; never text-rewrite the committer. Save a build input/metafile inventory and code hashes for review. This is an explicit declared browser import boundary, not a global node-crypto polyfill. [esbuild importer-aware resolution](https://esbuild.github.io/plugins/#on-resolve).

## 4. Actual batch and final-cut metadata

Extend only W6's stage result to `{generation, view, result, commit: {kind, batch}}`, where `kind` is `'local-operation'` or `'inbound-proof'`; `batch` is the captured actual PreparedBatch for a successful local command and null for inbound proof processing. The bridge recognizes this explicit commit intent instead of treating an inbound receipt as an athlete Saved acknowledgement. Existing callers lacking the new metadata retain their checkpoint behavior until migrated/tested; production factories require it.

After T2 staging, require `result.acknowledged === true`, descriptor count = operations.length = result.op_ids.length, contiguous actual sequence endpoints, same namespace/device, and exact new operation/outbox membership before preparing local allowance metadata. The W6 allowance function receives the surviving checkpoint/high-water/standing/fence plus that real batch; it produces the candidate metadata for the **whole action**. Refusal discards the candidate, consumes no sequence/slots and retains input. An inbound proof/replay consumes zero new slots. No smaller count inferred from a UI command and no split of an atomic session.

`validateCommit(context)` receives a recursively frozen copy of `{namespace, sessionEpoch, snapshotRevision, kind, batch, basisMetadata, candidateMetadata}` at the write cut; it returns null or `{state,code}` synchronously. It checks current session/standing/fence, schema, exact lease/time/sequence/budget endpoints and whether the prepared candidate metadata still matches the permitted transition. It never mutates the sealed candidate. If later evidence requires a different metadata update, abort and restage/reseal rather than acknowledge stale metadata. CAS retry re-creates the entire context from fresh durable state. All fields shown are candidate state, not new server guarantees.

Persisted future metadata separates `wireProofs`, `leaseHistory`, `clockCheckpoint`, `allowance`, `standing` and `recoveryFence`; namespace is authenticated by the outer envelope. Exact inner checkpoint/fence schemas belong to the reviewed recovery design and W5 reconciliation contract, not invented defaults here. Until those fields and sufficient bounds are proven, integration can test synthetic metadata and remains CLOCK BLOCKED.

## 5. Required tests and amendment acceptance

1. **Unchanged-default differential:** old versus amended T2 for every existing client law and actual action fixture; exact envelopes, canonical/HMAC bytes, outbox timestamps, issuance IDs, returns and storage state. Default HMAC and all missing-config failures remain unchanged; clock-call observations verify no new default sampling.
2. **Real browser parity:** bundle actual T2 and the scoped hash adapter; compare operation/member HMAC and issuance SHA-256 against Node for Unicode/lone surrogates, canonical edge numbers, timezone/DST and multi-operation sessions. Include standard HMAC vectors; no constant-time claim. Assert bundle graph contains no authority signer/private keys or unexpected Node imports.
3. **Predicate negatives:** missing/partial provider, false/object/Promise/throw, mutated after verification, wrong account/device/epoch/sequence/operation and expired capability all refuse without writes. Re-run every pinned W5 public-signature vector/forged surface in the real browser and retain original signed proofs.
4. **Sink durability:** W5 delivered response → actual browser-T2 candidate → delayed IDB complete/abort. Refusal returns stored:false and preserves each underlying state 17/18/19/20, outbox/frontier and prior generation. Race responses and account changes; never let a stale account callback write to the new account. Snapshot ingestion preserves the actual second-device fact.
5. **Batch/final cut:** exact one/many-operation count, final valid/first invalid full range, callback throw before writes, caller mutation, count-mismatch refusal, budget abort unchanged, independent-writer CAS restage, receipt/replay zero charge and stale final metadata rejection. Different permission sample leaves athlete timestamps/HMAC unchanged. Synthetic budget/time tests are labelled preliminary.
6. Keep the existing 28 storage tests and effective early-Saved bite; real browser repository tests; unchanged W3 red witnesses; full conformance/SELFTEST/strict; both OS jobs and independent cowork execution. Reproduce the browser build from a clean W6 dependency install, without root node_modules or bundled-tool fallback. Register W6 cases only through the reviewed W5 runner interface, not concurrent edits to shared files.
7. **Hard blockers remain:** no CLOCK PASS before sufficient W5 bounds, reconciliation/renewal and proven reachable knowledge-loss fencing. No private release before production custody/recovery and W8/W9. A successful signature/atomic-write test does not waive these conditions.

NEXT: root/cowork review this concrete amendment and record any authorization in BRIEF-W6. Only then implement the three-file T2 diff and named W6 adapters on the existing sole W6 claim/PR32; keep the submitted e934f9b checkpoint intact as review evidence. This draft requests no owner action or new product ruling.
