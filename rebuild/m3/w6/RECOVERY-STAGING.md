# Inactive rows-v3 staging and profile interpretation — not recovered-account activation

Implements the durable inventory portion of PR43's reviewed `PAGED-RECOVERY-PROPOSAL.md` v0.4 at734986a688366293349145e6feb80fd4130d3702. The full approved product goal and M4 briefv0.41 remain unchanged. This is a prerequisite to faithful recovery and complete workouts, not a substitute for either.

`openRepository(...).recovery({protocol,codec,verificationKeys,validateContext})` uses the same version1 IndexedDB database, existing `generations` object store and existing AES-GCM key provider. `protocol` and `codec` are the published R1 `paged-codec.cjs` and `codec.cjs` implementations; verification keys are public only. No alternate database, schema migration, new provider/key custody, service worker or seeded-soak change. The frame-format2 repository is not silently converted or supported by this component.

## Stored representation

- Active/previous generation keys remain untouched. Staging keys are compound arrays prefixed `earned/recovery-rows/v1` and a random128-bit attempt ID.
- One encrypted head contains caller-held expected bindings, the signed manifest/current cursor, page count and terminal flag. This is recovery bookkeeping, never positive permission.
- Each encrypted page retains the complete original signed response. Each encrypted row index points to its page and row position. Payloads are not independently copied into a second accepted-data ledger.
- Each collection appearing on a page has one small encrypted scan marker, committed in that same page transaction. A key-only cursor reads at most32 marker keys; it visits pages in ordinal order and checks original row indexes/positions and the signed collection count. This avoids repeatedly scanning unrelated account collections. Markers cannot duplicate a page or move it between collections. Older staging attempts without these markers refuse a populated scan and require explicit retry; active data is retained and never silently re-seeded.
- Row indexes contain base64 IDs, avoiding control-character JSON expansion. Their lookup keys hash the base64 ID under a separate domain. Ciphertext/AAD bind namespace, role, attempt and ordinal; a swapped ciphertext cannot become a different row or page.
- Page, all row indexes and new head publish in ONE strict transaction after cryptographic verification/sealing. The final synchronous context check runs immediately before writes. Head-token comparison serializes connections; occupied page/index slots cannot be overwritten. Progress resolves only on transaction completion.
- A page is bounded by the reviewed6,000,000-byte wire ceiling; local envelopes add16,384 plaintext/32,768 ciphertext framing allowances. Only one page and at most32 indexes are prepared at a time. No whole-history array or total-history byte cutoff is introduced.

## API and exact limits of its evidence

| Method | Result and refusal |
|---|---|
| `start({expected,explicitRetry})` | Starts encrypted inactive progress. A surviving attempt requires explicit retry; it does not infer first use. Expected scope/nonce/context/request/basis/claim-set digests and mode are checked and privately copied. |
| `progress()` | Returns authenticated staging metadata, or null for absent staging only. It says nothing about whether active app data exists or is healthy. |
| `append(responseBytes)` | Verifies the actual closed R1 proof, previous cursor, exact count/chain and finish. Atomically stores originals/indexes. Identical last-page replay is idempotent, including valid signature re-encoding; conflicting replay fails. Returns `staged:true,complete:false`. |
| `inventory()` | Available after terminal inventory only; exposes bounded `readRow` and `visit`, with `assertCurrent` for the caller's final staging-head fence. It is not a complete R1 proof. |
| `readRow(collection,id)` | Checks encrypted index/page identity and actual public signatures; preserves the original value string. Missing index returns undefined, so this alone is NOT a completeness check. |
| `visit(visitor)` | Re-verifies the entire contiguous signed prefix, checks every row index, terminal correspondence and unchanged head. Returns `inventoryVerified:true,complete:false,activated:false`. The visitor receives one original row at a time. |

Integrity/missing-proof failures are18; transaction/quota failures are3; a supplied current-context refusal preserves its state, including17. Neither staging bookkeeping nor an ordinary refresh overwrites independently known standing. `validateContext` must be the actual application's current fence when integrated, not a production `()=>null` placeholder.

`recovery-profile.mjs` now implements the relational and original-signature interpretation through `validateRecoveryProfile({inventory,codec,protocol,publicVerifier,requestBytes,expected})`. Pass the actual `stage.inventory()` view, pinned public codec/verifier and current caller-held athlete/device/scope/basis plus the original bounded request bytes. The manifest/request/claim-set bindings must match before interpretation. It returns `profileVerified:true,complete:false,activated:false`, with lazy summary/claim/history/lease reads and a staging-head fence. This is a snapshot interpretation, never present-day standing, current safety or permission to activate.

| Existing condition mapped | Indexed implementation |
|---|---|
| `validateRetained` collection closure, required rows, object values | Verified inventory plus exact-count collection cursors; metadata/registry checks; no retained whole-account map |
| Device/lease epochs, contiguous issuance, range/expiry progression, intents and standing origins | Original indexed lease rows, ordinal uniqueness/contiguity, pointer/intent/event cross-checks; original public lease signatures and UTC rules |
| Operations, slots, ownership, history count/status/final disposition | Exact keyed lookups; every original disposition signature; streamed history cardinality and terminal comparison |
| Accepted log and last-accepted frontiers | Exact operation/log relations, reverse lookup for every1..W, device maxima; counts cannot replace contiguity |
| Transactions and account/device standing | Accepted transaction links, required events and closed/revoked scope refusal |
| `scopeCheck`, `claimsAgainst`, lease lookups | Actor/mode checks; only the original manifest-bound request claims; five original outcomes; lazy original history/lease rows rather than copied history arrays |
| Relational `payloadState` / `assemble` projection | Direct interpretation of authenticated raw inventory; old under-cap full assembly is a TEST ORACLE, not a product allocation |

The two metadata records, one bounded request, device-key scalars, row/page data and fixed-size marker-key batches are retained; no whole-history stringify or graph map is introduced. Lease ordinal/origin checks use repeated indexed collection passes and can have quadratic cost in lease-history length. No CPU, memory-ceiling or large-device capacity claim follows from this implementation; the unchanged actual resource workload still has to pass. Further indexing, if needed by measurement, must preserve these comparisons.

The final consumer still must reconcile current local originals/outbox, authenticate final source currentness, preserve learned negative facts and pass the existing atomic active-generation switch. No such switch or receipt sink is exported here. Any later active write/context change still invalidates stale activation under the existing final fence. Lazy visitors must not paint or apply results before the caller's final checks.

The finite transport controller and live negative-ingress connection are not yet wired to this staging API. Reopening stored pages alone does not authorize continuation: the network path must re-prove current standing and the same snapshot, preserving the accepted retry/deadline policy. Superseded staging attempts are retained; safe cleanup/capacity and frame-format2 integration remain explicit work before release. Active originals and the outbox are never deleted here.

## Reproduction

From the W6 repository root, with a real existing dependency directory and the retained R1 tree passed explicitly:

```
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --browser
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --bite
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --profile-bite
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --ordinal-bite
```

The runner rejects differing public R1 codec dependencies rather than falling back. Browser mode uses `W6_BROWSER_BIN` or the recorded Windows Chrome path, a disposable loopback server and native IndexedDB/WebCrypto. It is desktop evidence, not an installed-iPhone result. The synthetic complete-account test uses the real Worker/D1/P1 path and the existing whole-history validator as a TEST ORACLE only; product staging never calls that validator or collects every original.

NEXT: independently verify the new indexed interpretation, connect actual finite transport/negative ingress and final active-generation fences, then run original resource/activation/private port/drill/integration/both-phone gates. A profile interpretation does not close first-use readiness.
