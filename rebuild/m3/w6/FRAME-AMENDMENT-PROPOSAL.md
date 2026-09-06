# W6 encrypted final frame — proposed amendment, NOT ACCEPTED

2026-09-06 · Documentation only; no dependency installation, format migration, cipher implementation or CLOCK PASS. This is separate from the conditionally accepted three-file T2 amendment. Independent review must accept this profile before code adopts it.
Basis: `BRIEF-W6.md` §1 bounded refinement / knowledge-loss limit and §2.2–5; `repository.mjs:57–83,104–168`; `T2-AMENDMENT-PROPOSAL.md` §4. The existing reject-only callback runs after whole-generation encryption and therefore cannot authenticate a genuinely later H/W_last. Repeated asynchronous resealing does not remove that gap.
Propose an encrypted small frame sealed synchronously at the final sample, paired atomically with the asynchronously prepared AES-GCM body. This preserves the current confidentiality of permission metadata. It solves recording that sample, not W5 time bounds, knowledge-loss containment, reconciliation, production custody or phone durability.

## 1. Cipher and narrow dependency boundary

Propose W6 runtime dependency **`@noble/ciphers` exactly `2.4.0`**, importing only `gcmsiv` from `@noble/ciphers/aes.js` and its necessary transitive implementation files. Keep bulk WebCrypto AES-256-GCM and W5 P-256 unchanged. No root dependency, frozen code, T2 canonical bytes, authority signer or seeded-soak change. [Pinned package](https://github.com/paulmillr/noble-ciphers/blob/2.4.0/package.json).
Frame adapter: `sealFrameSync(key32, nonce12, aad, plaintext352)` calls a fresh `gcmsiv(key, nonce, aad).encrypt(plaintext)` once and returns exactly 368 bytes, including the full 16-byte tag; authenticated inverse returns exactly 352 bytes or no plaintext.
Require private Uint8Array copies, a 32-byte key and 12-byte nonce; reject AES-192, truncated tags, unknown algorithms and caller-supplied verification flags. [Pinned implementation](https://github.com/paulmillr/noble-ciphers/blob/2.4.0/src/aes.ts).
AES-GCM-SIV is specified by **RFC 8452, an Informational IRTF/CFRG profile, not an IETF standards-track specification**. Accidental nonce repetition has less severe consequences than GCM but can reveal equality; it is not permission for intentional reuse. [RFC 8452 §§1,9](https://www.rfc-editor.org/rfc/rfc8452).
The maintainer reports independent Cure53 coverage of **1.0.0**, not 2.4.0. Later self-audits do not establish independent 2.4.0 review.
Before adoption pin the full release commit, package integrity and browser import inventory; review changes to imported AES/POLYVAL/utilities since that audit. No constant-time JavaScript or guaranteed zeroization claim. [Version-specific audit statement](https://github.com/paulmillr/noble-ciphers/blob/2.4.0/README.md#security).

## 2. Exact envelope, body and ownership

V2 active/previous records have **exactly** `{format:2,namespace,commitRevision,body,frameKeyEpoch,frameNonce,frameCiphertext}`.
`body` has exactly `{format:2,keyEpoch,aadRevision,iv,ciphertext}`. Epochs/revisions are positive safe integers; `aadRevision <= commitRevision`; IV/nonce are Uint8Array(12), body ciphertext ArrayBuffer of at least 16 bytes, frame ciphertext Uint8Array(368). Reject extra/missing properties, accessors, unexpected prototypes/types and unsupported versions before cryptography. Never coerce a number/string or ignore trailing bytes.
Namespace is the already authenticated installation/account/device scope string: nonempty Unicode scalar sequence, UTF-8 length at most 768 bytes, exact bytes with no normalization. The existing namespace encoding must itself be checked against W5's enrolled scope; this profile does not make an ambiguous caller-supplied name trustworthy. Oversized namespace refuses configuration; it is never shortened or hashed into another account.
New body plaintext is exactly `{format:2,collections,retainedMetadata,proofs}`. `collections` preserves all existing T2 collection names/JSON values, including unknown empty collections; `retainedMetadata` preserves the complete prior metadata as **historical, nonauthoritative material**.
Neither may supply W6 permission fields. New W6 permission consumers receive only the separately verified frame/proof view; no object spread of retained metadata into it. The literal JSON bytes are the encryption input; strict decoding rejects duplicate member names, invalid UTF-8 and non-JSON values.
`proofs` is an array of exact `{kind,version,digest,bytes}` entries: kind is one of `checkpoint`, `lease`, `batch`, `guard`, `session`, `permission`, `standing`, `recovery`, `wire`; version is a positive safe integer, digest is lowercase SHA-256 hex of decoded bytes, bytes is canonical unpadded base64url.
Duplicate digests with different entries, digest mismatch and unsupported kind/version refuse18. Full immutable content stays encrypted here; never truncate evidence to fit a frame or retain only its digest. Identical content is retained once without discarding its provenance.
Wire/lease contents retain their published signed bytes. A batch proof encodes the exact actual `PreparedBatch`; it never invents N from the UI action.
**Checkpoint, guard, session, permission, standing and recovery payload validators/versions are OPEN** until their governing contracts are published; reserved names are not permission to accept arbitrary JSON. Unknown/unimplemented validators refuse18. Synthetic fixtures may use explicitly test-only validators; they cannot enable a production checkpoint or CLOCK PASS.
Sole authoritative dynamic locations: H/W_last/U, conditional lease-time high-water, invalidation latch, refusal/guard codes, observation counter and selected proof references are in the frame.
W0, signed time interval/assumptions, complete issued leases, immutable epoch/standing/recovery evidence and full operation bodies are in referenced body proofs. No duplicate current H/W_last/U in the body; historical metadata is never consulted to fill a missing frame field. Updating a referenced immutable proof requires a newly sealed body.
Body AES-GCM uses fresh random 12-byte IV, 128-bit tag and the existing asynchronous key provider extended with the exact body key epoch. Its AAD is UTF-8 JSON of `['earned/local-body/v2',2,namespace,keyEpoch,aadRevision]`; control-only commits retain the old body's exact bytes and original aadRevision. Existing v1 AAD/bytes remain valid only through the explicit v1 reader/migration below.

## 3. Closed 352-byte frame and AAD

All offsets below are decimal byte offsets from zero; integer encoding is big-endian. U64 fields must be 0..Number.MAX_SAFE_INTEGER; signed wall/server milliseconds must be integral and within ±8,640,000,000,000,000. Overflow, NaN, fractional or unavailable samples refuse without rounding/clamping. References are 32-byte digests of exact retained proof bytes, never truncated IDs.

| Offset / bytes | Field and allowed encoding |
|---|---|
| 0 / 4; 4 / 2; 6 / 2 | ASCII `EWF2`; schema U16=1; length U16=352 |
| 8 / 1 | kind: 0=operation, 1=inbound proof, 2=control only, 3=migration |
| 9 / 1 | guard: 0=unproven, 1=OPEN, 2=resolved; resolved requires the still-OPEN closure contract, never absence of activity |
| 10 / 1; 11 / 1 | refusal state: 0,17,18,19,20; allowanceInvalidated: 0 or 1 |
| 12 / 2; 14 / 2 | presence U16 bits 0..7 correspond to the eight references below, bit8 to leaseTimeHigh; other bits and bytes14–15 must be zero |
| 16 / 8; 24 / 8; 32 / 8 | H U64 observed milliseconds; W_last signed milliseconds; U U64 committed slots |
| 40 / 8; 48 / 8 | leaseTimeHigh signed milliseconds (conditional proof only); observationCounter U64 |
| 56 / 8; 64 / 8; 72 / 8 | firstSequence, lastSequence, batchCount U64 |
| 80 / 32; 112 / 32; 144 / 32; 176 / 32 | checkpointRef, leaseRef, batchRef, guardRef |
| 208 / 32; 240 / 32; 272 / 32; 304 / 32 | sessionRef, permissionRef, standingRef, recoveryRef |
| 336 / 16 | Reserved, all zero; no extensions or trailing data under schema1 |

Absent reference/scalar bytes must be zero and their presence bit clear; a present all-zero digest is invalid.
Kind0 requires a present batch, N>=1 and `last-first+1=N`, matching its complete proof and the exact new operations/outbox; validate range arithmetic without unsafe Number overflow. Other kinds require N/first/last=0 and absent batchRef; they consume no new slots. This describes the current commit, not deletion of historical batch proofs. All referenced entries must exist and pass the corresponding semantic validator before truth/permission; a missing checkpoint is unproven, never a zero-budget first use.
Epoch identities are immutable proof references, not coerced numeric versions of caller session IDs. observationCounter only orders events inside the referenced owner/session; it does not prove cross-context exclusion or survival. Invalidated allowance cannot be cleared by a format conversion, sign-in refresh, empty outbox or new frame key. Exact permitted proof/epoch transitions remain OPEN with reconciliation/fence contracts.
Frame AAD is the following concatenation, with no JSON/optional fields: ASCII `earned/local-permission-frame/v2` + U16(2) + U16(namespaceUtf8Length) + namespaceUtf8 + U64(commitRevision) + U64(frameKeyEpoch) + U16(body.format) + U64(body.keyEpoch) + U64(body.aadRevision) + body.iv(12) + U64(body.ciphertext.byteLength) + SHA256(body.ciphertext)(32).
All U64 values here are positive safe integers. The maximum AAD length is 890 bytes (122 fixed + 768 namespace), below 1024; digest is over ciphertext plus its GCM tag, never low-entropy plaintext.
Repository computes/fixes the body digest before opening a transaction; callers cannot supply a trusted digest.
AAD binds the exact immutable body, namespace, both key epochs and commit identity; the full frame ciphertext authenticates all frame fields. Swapping old/new body or frame, relabeling an AAD revision, or altering a reserved byte fails18. A coherent old complete pair remains the accepted RESTORE-BOUND exposure; neither digest nor AEAD proves recency.

## 4. Keys and one-shot nonce attempts

Proposed async `frameKeyProvider({namespace,format:2,keyEpoch})` supplies exactly `{keyEpoch,keyBytes}` before IDB begins, matching the requested positive epoch and a privately copied Uint8Array(32).
The provider must supply an independent frame key; never export/reuse the existing AES-GCM CryptoKey, an operation-HMAC key, authority signing material or public verification key. Unknown/missing historical epoch returns18; no automatic key generation during load/recovery.
W4 chooses wrapped independent keys or separately labelled HKDF-SHA-256 derivation under its approved high-entropy sealing root.
That custody choice, installation salt, binding, rotation and backup recovery are OPEN; the adapter contract does not silently select them. Raw synchronous key material exists in the owning JS context; copy minimally and clear best effort, with no hardware-isolation claim. [HKDF construction](https://www.rfc-editor.org/rfc/rfc5869).
Every prospective encryption gets a fresh `crypto.getRandomValues(new Uint8Array(12))` draw outside the transaction, privately owned by one opaque attempt.
Consume/burn that attempt **before** its single encrypt invocation, including a throw; a second invocation fails. CAS conflict, invalidated candidate, abort or retry discards it permanently and creates a new draw/attempt. No nonce from revisions, sequences, clocks, restored counters or caller input; missing RNG refuses3 without a deterministic fallback. [Browser randomness API](https://www.w3.org/TR/webcrypto/#Crypto-method-getRandomValues).
The conservative writer does not reuse a failed sealed candidate even when its bytes match; every new encrypt uses a new instance/nonce. Tests inject draws only through a test harness. Randomness is probabilistic, not a proof of global uniqueness across restores. Per-key usage/security budget and maximum supported retained-body size need review before private use; this draft invents no restore-proof durable invocation counter.

## 5. Read, migration and old-tab refusal

Load snapshots active+previous together, validates the active outer shape, derives its complete CAS token, obtains exact historical keys, authenticates/decrypts both active body and frame, verifies proof/binding/ownership relationships, then returns the combined snapshot.
No plaintext or truth view escapes until both checks finish. Missing/corrupt active, mixed pair, unknown format/epoch/validator or unresolved stored integrity gives18; previous is recovery evidence, never an automatic fallback or reseed.
CAS token is the exact typed serialization of **every** active outer/body field including both ciphertexts/nonces/epochs, not revision alone; snapshot tokens/records are frozen private copies. Different commitRevision means reload/restage; same revision with different bytes is integrity failure18. Comparing the token does not authenticate an unseen current pair; reload/decrypt it before a retry.
Use IDB database version2 to exclude v1 writers. Versionchange closes/refuses the old tab; upgrade blocking remains18. Upgrade changes only the store-version compatibility boundary, with no crypto/network await and no record reset. An existing v1 active record may remain after a crash at that cut; v2 loader recognizes it for explicit migration only and still refuses ordinary writes/truth until conversion succeeds.
Migration reads/decrypts v1 through its unchanged AAD and original `{namespace,format:1}` key-provider contract, never by inventing a missing historical key epoch; prepares the v2 body/frame outside IDB; then CAS-commits active v2 and **complete previous v1** together.
Keep all collections/metadata bytes' meaning and immutable operation/signature bytes; no allowance refill or inferred checkpoint. Because v1 has no proven frame/checkpoint schema, default conversion carries guard=unproven/state18 until the published recovery contract supplies a justified mapping. If that contract is unavailable migration is BLOCKED; do not silently manufacture a usable checkpoint.
Crash before/within migration leaves the prior active intact; crash after complete loads v2.
Reopening an old version1 build against database2 must refuse, never delete/recreate. Race a real old tab's queued transaction against versionchange and assert it cannot commit after successful v2 migration. Preserve the existing active/previous two-generation policy with each retained record complete; full history/recovery obligations remain in the new body. This change introduces no history compaction, evidence trimming or new retention limit.

## 6. Proposed final-cut API and refusal

W6-only `commitPrepared(expectedHead, preparedBody, finalizeSync)` replaces the reject-only API only after acceptance.
Repository owns immutable basis/body/key/nonce attempts. Callback receives frozen verified basis, actual batch, prepared-body identity and captured/live owner/session/observation epochs; it returns exactly `{kind:'publish',frameFields}` or `{kind:'control',frameFields,state,code}` or `{kind:'abort',state,code,retryable}`. Extra fields, Promise/thenable, throw or unsupported state refuse without writes. Repository validates/copies/freezes returned fields before use, retaining no caller aliases; callbacks cannot supply ciphertext, tags, keys or preverified flags.
Inside one readwrite callback: CAS-check the full current head; require the live captured epoch/ingress preconditions; take one final permission sample W; evaluate current standing, both full-batch endpoints and bounded allowance; encode exact resulting H/W_last/U; synchronously encrypt the 352-byte frame; queue previous+new **complete pair**.
The callback's frame result is validated against actual batch and bound proof data by repository-owned code; no caller can charge a smaller N or choose a different body. No Promise, network, bulk crypto or further informative clock read within this sequence.
For publish, final frame/body become durable together; only transaction complete permits model publication/Saved. Any abort leaves both old body/frame and sequence/U unchanged. A newer runtime epoch before completion invalidates the old presentation; if the transaction already completed, preserve its durable facts rather than calling it aborted. The unresolved fence contract must handle newly learned knowledge and presentation after that cut.
For control-only refusal, repository selects the prior **exact** body, preserves U/sequence, makes batch absent, and increments commitRevision while sealing only the new refusal/control frame. Never install the prepared operation body or report Saved. A new immutable proof not already retained in the old body requires restaging; a digest alone is not its preservation. Control-only cannot clear an OPEN guard or claim a newly reconciled checkpoint.
Detected rollback can persist allowance invalidation/state20 while retaining the last valid W_last/H; do not replace surviving evidence with a lower wall value.
Failed control persistence retains typed input and current known17/19/20, and any already durable OPEN guard remains OPEN. On relaunch unresolved guard/integrity is18 until re-proven; absent successful pre-arming, this mechanism does not prove knowledge survived. That reachable failure is still a HARD CLOCK blocker.
Amend BRIEF §2.2's “after crypto” to **after bulk asynchronous crypto**, followed by the final sample and bounded synchronous frame encryption.
Encrypting authenticates a sample that necessarily precedes it. Physical time still elapses during encryption/put/complete; synchrony provides no duration or server-error bound. Lease-time mapping, closed informative ingress, pending-child resolution, multi-context ownership and post-complete callbacks remain OPEN, not assumed from a counter/CAS.

## 7. Proposed tests and review decision

All below are NOT RUN and proposed W6-only tests; retain existing 28 storage tests/bite, real-browser repository cases, T2 default/crypto parity and unchanged W3 witnesses.

1. **Cipher/profile:** RFC8452 C.2 AES-256 empty/short/multi-block/AAD and C.3 counter-wrap vectors, fixed frame/AAD byte fixtures, Node plus actual browser bundle; malformed lengths/reserved bits/unknown keys/prototypes/duplicate JSON/unsafe integers and every altered namespace/key/IV/tag/body/epoch/refuse18.
Two environments of one library prove bundle parity, not independent crypto implementations. [Public vectors](https://www.rfc-editor.org/rfc/rfc8452#appendix-C).
2. **Ownership/read:** unknown T2 collections and historical metadata survive; conflicting historical H/W_last never supplies current permission; missing proof/full bytes/validator fails; no plaintext on a failed half-pair; no mixed-pair recovery; same-revision changed bytes fails18; coherent old pair preserves the RESTORE-BOUND witness.
3. **Nonce/key:** one attempt's second encrypt fails even after throw; CAS/retry/abort/reopen/two tabs consume separate injected draws; missing RNG/epoch refuses; key/nonces/AAD caller mutation cannot alter owned copies; synthetic forced repeated nonces test misuse behavior only. Old frame/body key epochs still recover without changing operation commitments.
4. **Actual final cut:** advance W while body encryption is pending; decrypt committed frame and assert the genuinely later H/W_last and entire N, inclusive 24h/64 and issued endpoints. Invalid/rollback/overflow samples refuse as specified; controls never publish staged ops/consume slots. Runtime epoch change without durable revision restages; no early acknowledgement on request success or delayed abort.
5. **Migration/faults:** cuts before/after version upgrade and before/during/after pair commit; blocked/old tab, missing active, invalid mapping, unknown format, key loss and refusal persistence failure. Verify complete previous pair, no silent seed/refill, no evidence trimming and reloaded18 on unresolved guard. Clean bounded offline restart remains a required control once its actual checkpoint/fence contract exists.
6. **Effective mutations:** omit frame field/binding, accept unknown data, mix body/frame, reuse nonce attempt, ignore epoch, persist old sample, charge partial batch, publish operation body on control refusal, or acknowledge before complete must fail their behavioral test; source-pin failure alone earns nothing.

**Review request:** accept/reject the mechanical 352-byte profile, confidential cipher/dependency exception, ownership partition, nonce/key interface and read/CAS/migration/finalize API.
Accepted mechanics may be implemented with synthetic fixtures. Do not treat acceptance as approval of the OPEN semantic validators, final time bounds, custody/security budget, fence closure/reconciliation or physical-phone gate; those require their named evidence before production permission or CLOCK PASS.

NEXT: coordinator publishes this proposal separately; Cowork reviews the exact diff. Continue already-accepted T2/browser seams in parallel. No ciphers installation, record-format change or final-frame code before that review.
