# W5-R1 implementation — ASTRA

Status: implementation candidate for review; **R1-COMPLETE FAIL — resource ceiling unsatisfied**. Full focused, original regression and complete bite suites are PENDING rerun after the streaming-digest change; 117/117 affected tests pass. The proposed1MiB successor is not adopted. No R1 acceptance or release claim.

## Claim and authority

One coordinator claim on `rebuild/m3-w5-r1`, from actual integration `0e3103431b1bf824d577e40cd83a401b0d7ce571`. PR40 contract/core amendment and queue were independently accepted and integrated; exact brief SHA256 `ce789234b67de08329ebeee5307cefafe382262c9b860f87201329261df488ac` verified. Ledger has 67 newline-terminated entries, SHA256 `bd4a0defc7f658844a15922505c8b440f16231f33ef6225ae14898fb1af67a45`; prior 65 entries remain exact. Start: 2026-09-06, actual timestamp recorded in the coordinator's local execution log.

This claim uses the retained W6 delivery slot sequentially. W6 product edits are PAUSED at draft PR32 / `6f62455`; the M2 slot is independent. This creates no third product stream. No root merge, provider action, private import, policy change or seeded-soak edit is authorized.

## What changed and why

New immutable issuance/enrollment/standing history makes old-device operations verifiable after renewal and recovery. Enrollment and renewal reuse stable intents across new nonces; current standing remains distinct from the historical response. Migration0002 adds six SQL statements protecting retained rows and identity uniqueness. Only `authority/index.cjs` and `authority/admit.cjs` change in the synchronous core, at the accepted optional read-only `resolveIssuedLease` boundary; omission preserves legacy behavior, including default single-key signature bytes.
The asynchronous bridge retains a consistent global snapshot and revision assertion. Issuance/replay stage all effects before one guarded commit; successful responses follow durability. Reconciliation's dedicated read path checks the same complete snapshot, inventory and two-statement guard without constructing the writer backend. A malformed foreign R1 profile cannot make waiting drain rewrite another account's operations. The sole dependency addition is pinned `@noble/hashes`2.2.0 for browser-compatible exact-byte hashing; root lockfile unchanged.

## Exact wire and client boundary

`w5/reconciliation/contract-v1.json` preserves the original16MiB contract. `contract-v2.json` enumerates the proposed versioned1MiB fields/order, complete21-collection inventory, row schemas, digest domains, ordering and verifier inputs. `codec.cjs` rejects duplicate decoded keys, malformed UTF-8/base64, invalid numbers, shapes and bounded inputs; exact transport bytes and full-value equality are separate checks. P-256/SHA-256 uses the existing low-S/p1363 public-verification profile with retained public epochs; operation HMAC/canonical/identity domains are unchanged. Test keys are generated per run.

| POST route | Exact top-level request keys | Reply and required consumption |
|---|---|---|
| `/enrol/create` | intent_id, schema_version, nonce | Signed enrollment result containing exact historical issuance plus current standing; verify pinned issuer/subject/origin, intent and nonce. |
| `/lease/renew` | device_id, intent_id, expected_creation_epoch, expected_lease_id, schema_version, nonce | Signed renewal result; replay retains original lease bytes while current epoch can be newer. |
| `/reconcile` | device_id, request_b64, continuation, page_index | Original signed manifest plus signed page. Embedded request keys: version, mode, nonce, context_id, claims, requested_lease_ids. Bind every page to exact manifest/request/scope/context/nonce; assemble complete retained bytes before any positive sink. |
| `/recovery/replay` | device_id, envelope_b64, nonce | Signed result for exact surviving source-device bytes, authorized through the independently enrolled same-account actor. Existing operation identity/HMAC and revocation barrier still apply. |

The proposed request version is `earned/reconcile-request-1m/v1`; manifest/page domains end `-1m/v1`. Limits:1MiB encoded request,1MiB complete proof,32KiB pages/32pages; old operations retain256KiB request maximum. Oversize proof gives413 RECONCILE_LIMIT, never truncation or deleted history. Claim outcomes are KNOWN_TERMINAL, KNOWN_WAITING, IDENTITY_CONFLICT, ENVELOPE_MISMATCH and UNKNOWN_AT_SNAPSHOT. Errors retain typed HTTP status and retryability; SNAPSHOT_CHANGED is409, unavailable authority503.
`verify.cjs` returns owned verified evidence, not permission or persistence. `transport.cjs` permits at most three manifests, two network retries per page,30-second request timeout and ten-minute monotonic watchdog, with persisted attempt budgets and explicit Retry after exhaustion. Restoring an incomplete proof remains18; ordinary refresh does not erase established truth. Every response, including late200/negative evidence, reaches the supplied negative-ingress boundary before positive activation; W6 must implement K1 and its atomic durable sink.
ENVELOPE_MISMATCH evidence describes the stored variant only. The synthetic R3 consumer proves explicit restore relocates exact divergent local bytes to LOCAL_COPY_NEEDS_REVIEW, installs actual authority status/history atomically, and never drains through ordinary commitment-only T2 receipts. ACCEPTED alone contributes fact; WAITING and rejection stay their actual statuses. Actual W6 durable recovery is still required.

## Executed gates and bites

Previous codec `590b01401a5a5a57072c9413d516a53b311535127d4721f6d679f30170c38b6b`: `node rebuild/m3/rigs/rig-r1.cjs --case FOCUSED --env local` produced **128/128 tests PASS; R1-FOCUSED PASS**,60.26seconds. This includes default-core/crypto parity, immutable history/intent replay, malformed inventory, maximum old operation wrapper, actor/source recovery, alias states with96 kill cuts/20 controls, real HTTP restart exhaustion/quiet recovery,100 independent invocation races with ownership/waiting drain, complete byte vectors, retries and all effective bites. These results do not certify the later streaming-digest code.
`R1-RESOURCE FAIL`: five actual instrumented runs are summarized below; no passing local resource result. The previous codec's original regression completed: R1-REGRESSION PASS. AUTH-D1, HTTP-190, conformance, SELFTEST and strict passed on those previous product bytes; strict unsets MEASURED_TEST_NOW. Their full reruns and complete bites on current codec `1150930b9aafa55e5321d9a74ecbb86b3c17a3b839ae0bf13165ce8200fcabe3` are **PENDING**, not implied by affected-test success. Remote invocation explicitly returned exit2: `R1-COMPLETE BLOCKED (W4 remote database not yet created)`; actual owner-phone remains PENDING.
Eight independently effective mutation boundaries are covered: optional resolver during WAITING drain; nonce-dependent intent; omitted rejected contender, issued lease and initial plan; skipped actor/source account binding; incomplete pages; and removed revision assertion. Disposable copies preserve originals; controls must succeed before each mutant fails. Final read-path revision bite restores bridge SHA256 `7d6a22c1793a9c71c603208c02ddec24e25f5bf24c2c9e32c465b5c5f191c666`; complete focused logs retain each RED verdict and restored hash.

Previous-codec regression and effective-bite verdict lines, retained as historical evidence:

```text
AUTH-D1 PASS (34/34 mapped laws GREEN on local D1 + rig191 10/10 EFFECTIVE breaks)
HTTP-190 PASS (5/5 over real local HTTP with the C6 cuts)
run.cjs SUMMARY local: 2 PASS / 0 FAIL / 0 BLOCKED / 0 PENDING
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
R1-REGRESSION PASS
R1 CORE BITE RED — WAITING drain omitted historical resolver; exact accepted log assertion failed
R1 CORE BITE RESTORED PASS sha256=cf84becb194ed2451464306dd7b632a72f68d521767423bd16421f222fe6b5dc
R1 BITE RED INTENT-NONCE — contract assertion failed in disposable module
R1 BITE RESTORED PASS INTENT-NONCE sha256=590b01401a5a5a57072c9413d516a53b311535127d4721f6d679f30170c38b6b
R1 BITE RED REJECTED-CONTENDER — contract assertion failed in disposable module
R1 BITE RESTORED PASS REJECTED-CONTENDER sha256=3d818bc32cc223ffbde93e03be0afeb2aa98de391b846ec92c489d2c29ad9865
R1 BITE RED ISSUED-LEASE — contract assertion failed in disposable module
R1 BITE RESTORED PASS ISSUED-LEASE sha256=3d818bc32cc223ffbde93e03be0afeb2aa98de391b846ec92c489d2c29ad9865
R1 BITE RED INITIAL-PLAN — contract assertion failed in disposable module
R1 BITE RESTORED PASS INITIAL-PLAN sha256=3d818bc32cc223ffbde93e03be0afeb2aa98de391b846ec92c489d2c29ad9865
R1 BITE RED SOURCE-ACCOUNT — contract assertion failed in disposable module
R1 BITE RESTORED PASS SOURCE-ACCOUNT sha256=3d818bc32cc223ffbde93e03be0afeb2aa98de391b846ec92c489d2c29ad9865
R1 BITE RED PAGE-COMPLETENESS — contract assertion failed in disposable module
R1 BITE RESTORED PASS PAGE-COMPLETENESS sha256=508b648e319c5a4c3df7bb3dc1bfc18ec95001c79a4efb719f46b5ba5b93b0f4
R1 REVISION BITE RED — removed R1 revision assertion returned stale owner-bound proof
R1 REVISION BITE RESTORED PASS sha256=7d6a22c1793a9c71c603208c02ddec24e25f5bf24c2c9e32c465b5c5f191c666
```

## Resource evidence and limits

Actual pinned workerd application isolate + real local D1/HTTP; owned runtime user+kernel CPU includes D1/inspector/overlap, Windows guard32ms. Memory is observed `totalSize + embedderHeapUsedSize + backingStorageSize`, without adding usedSize twice; sampling/native omissions are disclosed. SQL statistics come from actual D1 result metadata. Revision control writes are counted separately from zero domain writes. No runtime flags, forced collection or deliberate idle pauses occur in acceptance.
| Run | Complete pages | Largest observed allocation | Verdict |
|---|---:|---:|---|
| Original16MiB | 512 + partial166/166 overlap | 1,900,159,455bytes | FAIL; overlap also exceeded CPU; extra-byte case not run |
| Initial1MiB | 32+32+32, plus typed413 | 347,626,921bytes | FAIL memory |
| Indexed decoding | Same96 + refusal | 524,584,712bytes | FAIL memory |
| Dedicated read path/key-only scanning | Same96 + refusal | 180,073,345bytes | FAIL memory; max125.75CPUms,5 statements, zero domain writes |
| Streaming tagged SHA-256 | Same 96 + refusal | 176,504,664 bytes | FAIL memory; max 110.125 CPUms, 5 statements, zero domain writes |
Ceiling remains96MiB/1000CPUms/1000statements/batch<30s/zero domain writes. Five original evidence hashes and sanitized metrics are tracked in `w5/fixtures/r1-resource-failures.json`; samples remain ignored. The1MiB proposal is versioned and requires independent technical acceptance; a smaller cap does not by itself resolve memory.
Two post-workload diagnostics failed at inspector collection; no after vector exists and no collectible-memory conclusion is claimed. The pinned standalone runtime has no hosted-style isolate enforcer and disables idle/incremental collection; that is a diagnostic lead, not a reason to discard the gate. Details/reproduction are in `w5/reconciliation/RESOURCE-LIMITS.md`. Stop repeating the same failed premise; the remaining resource profile needs focused technical review before any acceptance claim.

E1 follow-up on2026-09-06T20:01Z ran the unchanged complete1MiB workload once in an isolated child with `MINIFLARE_WORKERD_V8_FLAGS=--max-old-space-size=128`, using the installed Miniflare5.20260903.0-alpha passthrough. Parent/default environment unchanged; no product edit, forced collection or acceptance-metric/cap revision. **DIAGNOSTIC — NOT ACCEPTANCE; original observations FAIL**:32+32+32 pages and extra-byte typed413,97 requests, no OOM/request failure, exit1. Peak simultaneous total+embedder+backing209,507,497bytes exceeds the unchanged96MiB ceiling; sequential and oversize phases also exceeded it. At the peak, used86,181,360 / total190,230,528 / embedder258,024 / backing19,018,945bytes; all206 vectors and component maxima are retained. Guarded CPU max110.125ms, max5 statements/request, zero domain writes. Old-space128MiB does not constrain total isolate memory to128MiB or establish production equivalence; usedSize alone cannot replace the original metric.
Tracked helper: `node rebuild/m3/w5/test/r1-resource-constrained-diagnostic.cjs`, SHA256 `31e6cde76491337bf41207d1f87fcf965c8d05b0b1afc27435ddf7311888ef35`; ignored evidence `r1-resource-constrained-diagnostic.json`, SHA256 `f135eae3318847d72725003d72b105aeebcb79eed20ea6ab3a416f0154befbb3`. Held source pins are in the evidence and resource note; the four preceding acceptance failures and both earlier diagnostics rehash unchanged. No additional E1 experiment was performed; R1-COMPLETE remains FAIL.

The subsequent bounded product experiment replaces only the concatenated digest buffer with two streaming SHA-256 updates, preserving the defensive input copy and exact tag plus NUL bytes. New independent Node SHA/input-isolation regression plus existing codec/base64/boundary/limits/transport tests: **117/117 PASS**, 4.464 seconds. New codec SHA256 `1150930b9aafa55e5321d9a74ecbb86b3c17a3b839ae0bf13165ce8200fcabe3`; new `r1-streaming-digest.test.cjs` SHA256 `25b1d1d376900168538e39a02c6423dcc42ee791fcc410f69cf644417d69b52a`. One unchanged original-resource run with default runtime flags completed 96 pages and typed +1-byte413: **FAIL**, three memory violations, no request failure. Peaks sequential/overlap/oversize: 150,521,780 / 176,504,664 / 159,708,066 bytes. Guarded CPU max/p95 110.125ms, max 5 statements, zero domain writes. Ignored `r1-resource-1m-streaming-digest-fail.json` SHA256 `e43b9665e3233997da4749f8e22b9883614dc2267a81e27747a829a445ae843b`; prior artifacts remain unchanged. The difference from 180,073,345 bytes is **not a statistically established improvement** and grants no resource acceptance. No full focused/regression/bite rerun or further optimization followed; the constrained-heap and streaming-buffer hypotheses require reassessment.

Population A/B follow-up on the same product `777caa5` is **DIAGNOSTIC — NOT ACCEPTANCE**. Two fresh identical runtimes completed 192 pages plus two typed +1-byte refusals, 194 requests, no OOM/request failure. A: own account only, 18 rows / 649,819 JSON bytes. B: the same own scope/request/1MiB-proof semantics plus 23 valid foreign rows / exactly 9,437,184 JSON bytes, using a guarded whitespace-only update to seven mutable foreign rows; all parsed values and own raw bytes remained unchanged. Each actual own expected proof was pinned and verified. Original total+embedder+backing peaks A/B: **165,864,407 / 652,866,449 bytes**, both FAIL. Diagnostic used+embedder+backing peaks: 91,858,687 / 563,481,621 bytes; these do not replace the original metric. Guarded CPU maxima 110.125 / 235.125ms; rows read 2,132 / 4,460; query duration sums 37 / 711ms; arm durations including setup/cleanup 8.217 / 16.562 seconds. Both max five statements/request and zero domain writes. All 12 prior evidence files and 15 source pins remain unchanged.
Tracked helper `w5/test/r1-population-diagnostic.cjs` SHA256 `1ddd076abf1472b6f77ecce7495a55ce79236a13aaacb0eebf190aeb7bc05125`; executed helper was `1f307379e00648275e7231f5134c33bb5afdbb794412a53e451bac04d03d9883`, followed only by a documented pre-workload publication-guard/metadata adjustment. Ignored pair evidence SHA256 `40dc1278d83ed8afd92df651a3cea7b42acdd38833aaef532905d265fc1b61bb`, with individual hashes/vectors in the resource note. A single A/B pair establishes neither a universal cause nor a peak distribution. Own-only still exceeds 96MiB; scoped SQL alone cannot claim acceptance. `w5/reconciliation/SCOPED-READ.md` proposes a reconciliation-only subject-bound read batch retaining the global revision guard, and explicitly leaves oversized-own-account preflight and a separate versioned-metric definition OPEN for C review. No SQL/product/metric/cap change or further experiment was performed; full current-codec focused/regression/bite reruns remain PENDING.

## Seams, not covered and accounting

Local tests do not establish remote D1, Clerk production, phone survival, checkpoint C, CLOCK, K1 knowledge-loss fencing, T1 finite signed-time bounds or P1 key availability. Privacy-D2 sign-out retention/erasure still needs the applicable owner decision before private behavior; synthetic construction does not choose it. The initialized soak and frozen app are untouched. The consumer is a synthetic contract witness, not a substitute for IndexedDB/device evidence.
Gates use pinned frozen bundles and locally regenerated private fixtures under AGENTS.md, with verdicts only. The Windows frozen-builder raw-path ESM issue was handled using previously commit-verified bundle bytes and isolated unchanged-golden preparation, preserving public pins. Reproduction requires real dependency directories, not a symlinked node_modules. Linux independently rebuilds its own frozen bundles.
Claim recorded2026-09-06T18:03:54Z; final regression completed by2026-09-06T19:53Z (about109 minutes calendar, not active engineering time). Work spans the recorded usage interruption; calendar duration includes simultaneous D12 work and waits, not engineering time. Attributable tokens/cost are unavailable. Current models and ownership were retained. No new provider, purchase, secret, policy or physical action was performed.

## NEXT

Current claim: W5-R1 implementation. Publish this single candidate and measured resource failure for independent review, resolve the resource profile without relabeling FAIL. W6 stays paused in this retained slot until the reviewed dependency permits resumption; its eventual durable sink must repeat the recovery cases. D12 proceeds independently. No R1 merge or owner action requested by this report.
