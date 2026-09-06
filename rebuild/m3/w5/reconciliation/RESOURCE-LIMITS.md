# R1 resource evidence and proposed successor transport

Status: **RESOURCE FAIL; LOWER-CAP PROPOSED, NOT ADOPTED.** Neither functional HTTP success nor a smaller payload grants resource acceptance. The agreed ceiling remains 96 MiB observed allocation, 1,000 CPU ms per invocation, 1,000 D1 statements, each batch below30 seconds and zero reconciliation domain writes. No provider/account/spending action was performed.

The original contract-v1.json retains the16MiB/512-page proposal. The implemented candidate contract-v2.json proposes a1MiB/32-page complete-proof limit, with new request version `earned/reconcile-request-1m/v1` and signed manifest/page domains `earned/reconcile-manifest-1m/v1` / `earned/reconcile-page-1m/v1`. Old versions are not aliases. Original account/lease history, operation HMAC, canonical bytes, old response signatures, 256KiB operation request maximum and new1MiB encoded request maximum remain unchanged. A proof over the proposed cap returns typed413; it never deletes, truncates or changes stored history, and original APIs remain available. Independent technical acceptance is required before adopting any successor limit.

## Actual local measurement

The tracked experiment runs the production Worker, bridge and signer in the exact named workerd application isolate, with real local D1 and loopback HTTP. CPU uses the owned workerd process user+kernel counters, including competing D1/inspector activity. Windows adds32ms for observed accounting quantization; representation precision is not claimed as accounting accuracy. Overlapping request windows include competing work; their CPU values are not summed as independent totals.

Memory records periodic inspector `Runtime.getHeapUsage` vectors. The reported observed allocation is simultaneous `totalSize + embedderHeapUsedSize + backingStorageSize`; `usedSize` is contained in totalSize and not added again. Sampling can miss a peak and these fields do not cover every native allocation. No heap reset, forced collection, idle pause or runtime memory override is part of the acceptance experiments. D1 metrics come from actual binding results, not estimates. Two revision-control writes are separately counted; they are not domain writes.

| Experiment | Complete pages | Peak observed allocation | Result |
|---|---:|---:|---|
| Original16MiB | 512 sequential; two overlapping attempts deliberately stopped after166 pages each | 1,900,159,455 bytes sequential | FAIL; overlap also crossed CPU ceiling; +1 case not run |
| Initial1MiB proposal | 32 sequential +32+32 overlapping, then +1-byte refusal | 347,626,921 bytes | FAIL memory; CPU/SQL/domain-write checks pass |
| Indexed base64 decoder | Same complete96-page workload and +1 refusal | 524,584,712 bytes | FAIL memory; reduced allocations are not proof of a smaller observed peak |
| Dedicated read path and key-only JSON scan | Same complete96-page workload and +1 refusal | 180,073,345 bytes | FAIL memory; max guarded CPU125.75ms, max5 statements/request, zero domain writes |

The16MiB experiment was stopped only after actual failures were established; its overlapping attempts remain explicitly incomplete. The other experiments completed all97 requests including typed413 on the extra byte. Sanitized synthetic counts and original evidence hashes are in `../fixtures/r1-resource-failures.json`; full machine samples remain in ignored local evidence. No owner fixture entered these experiments.

The final allocation improvements avoid constructing the synchronous writer backend/core for a read-only proof, retain the same global read/revision guard, avoid a generic string iterator's intermediate base64 array, and avoid decoding non-key JSON string tokens twice. Independent full-value/byte vectors, missing/corrupt inventory checks, real races and revision mutation checks constrain these changes. They do not change the resource ceiling or repair authority rules.

## Remaining question

Determine how the pinned standalone runtime's garbage-collection policy relates to the deployment runtime before revising instrumentation. Upstream reports are diagnostic leads, not proof that this candidate meets its budget. Any constrained-heap or post-collection diagnostic must be separately labelled and cannot relabel the four recorded failures. [Cloudflare's memory limit](https://developers.cloudflare.com/workers/platform/limits/) is per isolate across concurrent requests; local success is not a remote deployment verdict.

The pinned Miniflare5.20260903.0-alpha reads `MINIFLARE_WORKERD_V8_FLAGS` at `dist/src/index.js:82751`; workerd1.20260903.1 exposes V8 flags with stability warnings (`workerd.capnp:70–77`). Its [exact server source](https://github.com/cloudflare/workerd/blob/v1.20260903.1/src/workerd/server/server.c%2B%2B#L2986) uses `NullIsolateLimitEnforcer`, while [V8 setup](https://github.com/cloudflare/workerd/blob/v1.20260903.1/src/workerd/jsg/setup.c%2B%2B#L53) disables idle tasks and incremental marking. These facts justify a diagnostic, not a production-equivalence claim or changing the acceptance metric. No runtime flag was changed.

Two separately labelled post-workload diagnostics completed32 sequential pages each, then failed to obtain a post-collection vector. The second reused the meter's existing connection and identified `HeapProfiler.collectGarbage` timing out after30 seconds; this does not establish collectible memory. Preserved ignored evidence: `r1-resource-gc-diagnostic-attempt1-failed.json` SHA256 `6d41bc9390d847126356c771adbd1a7984ef47784c768a67f9c94f3de5644e8a`; attempt2 SHA256 `4512564be4775d21012b9f2714c34bce50df62030907137900bf75001a3c24e0`. Tracked reproduction: `node rebuild/m3/w5/test/r1-resource-diagnostic.cjs`; the original resource gate is unchanged. The diagnostic method is never called by acceptance and never awards PASS. No further identical retry is planned.

If no reviewed resource profile meets the ceiling, R1-COMPLETE stays FAIL/BLOCKED and W6 may consume the published interface only as provisional work. No private import, CLOCK, checkpoint C, K1, P1 or phone recovery acceptance follows from these local tests.
