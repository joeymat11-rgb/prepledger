# Inactive rows-v3 staging — implemented component, not recovered-account acceptance

Implements the durable inventory portion of PR43's reviewed `PAGED-RECOVERY-PROPOSAL.md` v0.4 at734986a688366293349145e6feb80fd4130d3702. The full approved product goal and M4 briefv0.41 remain unchanged. This is a prerequisite to faithful recovery and complete workouts, not a substitute for either.

`openRepository(...).recovery({protocol,codec,verificationKeys,validateContext})` uses the same version1 IndexedDB database, existing `generations` object store and existing AES-GCM key provider. `protocol` and `codec` are the published R1 `paged-codec.cjs` and `codec.cjs` implementations; verification keys are public only. No alternate database, schema migration, new provider/key custody, service worker or seeded-soak change. The frame-format2 repository is not silently converted or supported by this component.

## Stored representation

- Active/previous generation keys remain untouched. Staging keys are compound arrays prefixed `earned/recovery-rows/v1` and a random128-bit attempt ID.
- One encrypted head contains caller-held expected bindings, the signed manifest/current cursor, page count and terminal flag. This is recovery bookkeeping, never positive permission.
- Each encrypted page retains the complete original signed response. Each encrypted row index points to its page and row position. Payloads are not independently copied into a second accepted-data ledger.
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

The final consumer is still required to bind the actual authenticated athlete/device/request and perform every existing `project.validateRetained/scopeCheck/claimsAgainst/payloadState` and `verify.assemble/originalRecord/lease` condition through bounded indexed access. It must reconcile current local originals/outbox, authenticate final source currentness, preserve learned negative facts and pass the existing atomic active-generation switch. No such switch or receipt sink is exported here. Any later active write/context change still invalidates stale activation under the existing final fence.

The finite transport controller and live negative-ingress connection are not yet wired to this staging API. Reopening stored pages alone does not authorize continuation: the network path must re-prove current standing and the same snapshot, preserving the accepted retry/deadline policy. Superseded staging attempts are retained; safe cleanup/capacity and frame-format2 integration remain explicit work before release. Active originals and the outbox are never deleted here.

## Reproduction

From the W6 repository root, with a real existing dependency directory and the retained R1 tree passed explicitly:

```
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --browser
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --bite
```

The runner rejects differing public R1 codec dependencies rather than falling back. Browser mode uses `W6_BROWSER_BIN` or the recorded Windows Chrome path, a disposable loopback server and native IndexedDB/WebCrypto. It is desktop evidence, not an installed-iPhone result. The synthetic complete-account test uses the real Worker/D1/P1 path and the existing whole-history validator as a TEST ORACLE only; product staging never calls that validator or collects every original.

NEXT: bounded complete-profile/claim/original-signature validation and actual finite transport/negative-ingress join, then the original resource, activation, private port/drill, independent integration and both-phone gates. No profile validity or first-use PASS is inferred from this storage component.
