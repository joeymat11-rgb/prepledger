# W5 — staged D1 authority, Worker HTTP and public signatures

2026-09-06. ASTRA. Branch `rebuild/m3-w5-authority-bridge`; original module-7 base `ef83543aa825fb581671951d287854166717ad28`. Issued task: `rebuild/m3/TASK-W5.md`, read at integration ref `df09f438a93cb9548ef3f66b28b39deecc7fb347`. W6 v1.1 read at the same ref. First published W5 contract: `d44706123d4be8844db6f919a8238255b73e3fb2`; integrate the final PR head for the native Worker compatibility fix and final evidence.

## What changed and why

- `w5/bridge.cjs` loads one consistent D1 batch containing the global revision, every athlete row, ownership/dependency/drain inputs and subject bindings. The accepted synchronous T3 authority runs on a staged memory cache. One atomic D1 batch first asserts the revision with a named failing CHECK, publishes the complete delta and increments the revision. Stale snapshots retry from a new read, up to 256 attempts with bounded backoff. Transport failure after commit also reloads; it does not republish an old delta. No successful result leaves before the awaited commit. Reads also check/increment the revision, including authenticated scope checks.
- `w5/migrations/0001_authority.sql` records athlete/op identity, device/sequence and log-position uniqueness, and one-to-one subject bindings; bridge initialization refuses subject rebinding. The global revision deliberately includes cross-athlete ownership and waiting drains.
- `w5/worker.cjs` and `auth.cjs` implement bounded JSON requests, pinned local RS256 Clerk verification, subject/device scope and private/no-store responses. Storage failure is 503, never a false revocation or advanced frontier. The real HTTP rig exercises the unchanged T2 client's Store, Outbox, weigh-in, sync, frontier and restart paths.
- `w5/crypto.cjs` replaces only the authority's declared signing boundary. P-256/SHA-256 signatures use native crypto, P1363 encoding and low-S checks. `public-client.cjs` is a browser-safe verification-only boundary. Existing operation/member HMAC, domain and canonical-v1 contracts remain unchanged. Native workerd requires keys exported to in-memory PEM for sign/verify options; no key material is printed, written or committed.
- `rigs/` contains the 34 async law wrappers, ten effective disposable-copy breaks, real HTTP interop/C6 cuts, 100 concurrent native Worker invocations, SQL rollback cuts, lost database reply and persisted close/reopen checks. `verify-local.cjs` runs the complete verification sequence and keeps local logs ignored.

## W6 wire contract

Normative detail and executable vectors: `w5/WIRE.md`, `w5/fixtures/contract-v1.json`. Every route is POST JSON with `device_id`, `Authorization: Bearer <JWT>` and an exact allowed Origin. No query strings or body `athlete_id`/`subject` selectors. Immutable operation athlete/device fields must match the server-derived scope. Every response carries `Earned-Wire-Version: earned/w5-http/v1`, private/no-store caching headers and `Vary: Authorization, Origin`.

JWT checks: pinned RS256 kid/signature, exact issuer, configured audience, azp equal to Origin, nonfuture iat/nbf and future exp. Local fixtures use `https://clerk.w5-test.invalid`, `earned-w5-test`, `https://today.w5-test.invalid` and keys generated per run; no live Clerk/discovery call.

| Route | Body beyond device_id | Response / required interpretation |
|---|---|---|
| `/op` | `operation`: unchanged T3 envelope and HMAC | 200 `{disposition}` after commit. T3 fields: op_id, canonical_content_commitment, device_id, device_seq, status, decided_at, authority_signature; ACCEPTED adds athlete_log_seq/accepted_at and applicable core plan fields; rejection adds rejection_code. WAITING remains queued. Exact accepted retry returns the stored signed disposition and one effect. |
| `/pull` | `after`: nonnegative safe integer | 200 signed `{athlete_id,device_id,after,through,receipts,wire_version,key_epoch,authority_signature}`. Full contiguous remaining range after+1..through. Every receipt independently signed. Verify outer and every inner record before one durable sink call. after beyond head is 409/state18. |
| `/snapshot` | `watermark`: nonnegative safe integer | 200 signed `{athlete_id,device_id,W,partial:false,pending:0,records,entries,label,rejectedAppendix:[],otherDeviceNote,wire_version,key_epoch,authority_signature}`. Independently signed receipts 1..W. Beyond head is 409/state18. W6 must add its local pending/rejected export qualification. |
| `/time` | `challenge`: unpredictable base64url nonce, 22–128 characters | 200 signed `{athlete_id,device_id,challenge,server_time,wire_version,key_epoch,time_profile,authority_signature}`; profile `earned/challenge-time/v1`. Authenticated sample only; bounds/checkpoint remain OPEN below. |
| `/lease` | none | 200 `{lease}`: lease_id, athlete_id, device_id, schema_version, range[lo,hi], not_before, not_after, signature. Currently provisioned durable lease only, no renewal/replacement. Invalid stored capability is 503. |
| `/enrol` | none | 200 `{lease}` for already provisioned subject/device only. Unknown scope is 403/state17. New enrollment is not implemented. |
| `/import`, `/restore` | none | Authenticated/scoped 501 NOT_IMPLEMENTED; no import/restore data effects, success or checkpoint. The common scope check still increments the revision. |

Receipt: `{seq,op_id,canonical_content_commitment,accepted_at,op,authority_signature}`. Its operation athlete must match pull scope. A disposition must match the exact queued op identity, commitment, device and sequence. Unknown dispositions never advance a frontier. Successful verification is not an IndexedDB commit or Saved acknowledgement.

Lease schema_version must match configured schemaVersion (default1); range endpoints are safe integers with 1<=lo<=hi. Dates must be canonical UTC seconds or exactly three fractional digits, with not_before<=not_after. issued_server_time is retained if present; it is not challenge-bound freshness evidence. The same canonical UTC format applies to /time.

W6 must normalize refused durable callbacks to `false` or `{stored:false}`, `{durable:false}` or `{confirmed:false}`; `{acknowledged:false}` alone is not recognized. Preserve specific inner state17/18/19 rather than replacing it with the wrapper's generic state3. High-level accept methods copy records; low-level verifier callers must isolate immutable records across the await. Use permanently account/device-bound sinks and serialization/CAS for final durable scope/frontier checks. Preserve signed receipts separately from T2 projections, and do not treat an accepted-log snapshot as T2 product state. These caller obligations were confirmed by W6 integration review; they add no W6 durability claim here.

| HTTP | Error body `{error:{code,state?}}` | W6 action |
|---|---|---|
| 400 / 413 | MALFORMED_REQUEST / REQUEST_TOO_LARGE | Preserve entered values and queue. Request limit 262144 bytes, enforced while streaming. |
| 401 | UNAUTHENTICATED, state11 | Sign in to sync. Token expiry does not revoke an offline capability or reset allowance. |
| 403 | SCOPE_FORBIDDEN, state17 | Refuse scope; require enrollment/recovery and preserve learned standing. |
| 404 / 405 | NOT_FOUND / METHOD_NOT_ALLOWED | Protocol/configuration failure; no drain. |
| 409 | FRONTIER_AHEAD, state18 | Integrity/reconciliation required; no silent rewind/reseed. |
| 501 | NOT_IMPLEMENTED | Capability unavailable; no checkpoint or success. |
| 503 | UNAVAILABLE | Retry identical immutable bytes with bounded backoff; never allocate a new op_id/sequence/HMAC. |

Signed terminal T3 rejection codes remain unchanged: IDENTITY_COLLISION, DEVICE_SEQ_REUSE, CROSS_ATHLETE_REFERENCE, REJECTED_DEPENDENCY, MALFORMED, LEASE_UNKNOWN, LEASE_FORGED, DEVICE_SEQ_OUT_OF_RANGE, LEASE_REVOKED_BEYOND_BARRIER and core plan outcomes. These differ from transport errors. Arrival after not_after does not invalidate previously saved leased work.

Signature input is UTF-8(domain + canonicalEncode(record excluding its signature field)), without an added delimiter. Wire encoding: `ES256.<pinned-kid>.<unpadded-base64url>` containing exactly 64 bytes, 32-byte big-endian r then s; require canonical encoding, 0<r<n and 0<s<=n/2. Reject unknown keys, DER, high-S and private JWK material on the phone. Public key sets may retain historical keys; operational rotation remains open.

| Record | Domain | Excluded field |
|---|---|---|
| Disposition | earned/disposition/v1 | authority_signature |
| Lease | earned/lease/v1 | signature |
| Time | earned/server-time/v1 | authority_signature |
| Receipt | earned/receipt/v1 | authority_signature |
| Pull | earned/pull/v1 | authority_signature |
| Snapshot | earned/snapshot/v1 | authority_signature |

Time/pull/snapshot also sign wire_version and key_epoch; key_epoch equals signature kid. The client creates a fresh 32-byte nonce and same-execution monotonic send sample, replacing any old challenge. It accepts only the matching signed scope/version/profile/epoch and canonical UTC value, then rejects replay, replacement, restart, negative/nonfinite observed elapsed and elapsed above the default 30000ms inclusive timeout. This does not detect every timer rollback. Verification precedes consumption and sink invocation; failed persistence needs a new challenge. Time alone never drains an outbox.

## Executed gates

Final Windows run: Node v24.19.0, 2026-09-06 07:34Z. `verify-local.cjs --browser --playwright-path <installed playwright>` exited0. Each ordinary gate exited0; synthetic-remote deliberately exited2.

```text
PUBLIC-CRYPTO PASS (6 signed domains; Node/WebCrypto; canonical/encoding vectors; scope/time/durability refusals)
PUBLIC-BROWSER PASS (6 native/browser signed domains; esbuild browser-only bundle; tampered state untouched; single-use time)
PUBLIC-BROWSER ENGINE 151.0.7922.34
WORKER-WORKERD PASS (bundled Worker + nodejs_compat + local D1 + RS256 auth + P-256 signatures + replay)
RIG191 PASS 10/10 EFFECTIVE breaks
D1-RACE PASS 100 independent workerd invocations; foreign ownership and waiting drain; 100 unique contiguous accepted records across two athletes
D1-CRASH PASS 11/11 atomic batch cuts; no partial rows; exact retry one effect
D1-LOST-REPLY PASS durable write then fetch failure; fresh snapshot retry; original signed bytes and one plan effect
D1-REOPEN PASS persisted rows and signed replay survive workerd close/reopen
AUTH-D1 PASS (34/34 mapped laws GREEN on local D1 + rig191 10/10 EFFECTIVE breaks)
HTTP-190 PASS (5/5 over real local HTTP with the C6 cuts)
run.cjs SUMMARY local: 2 PASS / 0 FAIL / 0 BLOCKED / 0 PENDING
AUTH-D1 BLOCKED (W4 remote database not yet created)
HTTP-190 BLOCKED (W4 remote database not yet created)
run.cjs SUMMARY synthetic-remote: 0 PASS / 0 FAIL / 2 BLOCKED / 0 PENDING
GOLDEN PREPARATION PASS public byte-identical after engine stamp normalization; private committed hash matches; manifest pins restored
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
  PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)

All checks passed. Safe to ship.
VERIFY-LOCAL PASS
```

Executed frozen-path comparison against the original base: no differences in src/, index.html, ledger/, scripts/, tools/, app.js, rebuild/conform/, rebuild/authority/, rebuild/client/ or the seeded soak. `git diff --check` passed. Golden preparation emitted verdicts only. No package-lock changed.

## Bite

The tracked `rigs/bite.cjs` inserts `return true` into W5's `verifyRecord`, rebuilds the boundary, requires both local cases to fail, restores the original bytes and rebuilds. No law or authority core is edited.

```text
AUTH-D1 FAIL (31/34 mapped laws GREEN on local D1; 0 HARNESS_ERROR)
HTTP-190 FAIL (Expected values to be strictly equal: + actual - expected + 'ACCEPTED' - 'REJECTED' )
run.cjs SUMMARY local: 0 PASS / 2 FAIL / 0 BLOCKED / 0 PENDING
BITE RESTORED sha256=eb2d1721ca69e23ca9d8fd8df2e7fbde398b5591b36045f3e51f5f94258671ee
```

Bite runner exit0 means it observed both required failures and restored the exact file; the deliberately broken local runner exited1.

## Seams and limits

1. The authority core and its transactions stay synchronous-memory. The bridge supplies the durable boundary; all athletes are loaded for each invocation and every read consumes a revision. This first global design is intentionally coarse. Local correctness is not a production throughput, latency, D1 batch-limit or scale claim; full pulls are unpaginated.
2. The 34 wrappers hash-pin the frozen law source, add awaits/sequential maps and retain IDs/assertions. They call the trusted bridge/D1 API; Clerk/HTTP coverage is separate. Valid legacy fixture leases are checked before conversion to P-256; forged fixtures remain invalid. Disposable loading injects the unchanged core plus crypto boundary. Staged failure injection is external to product code. Lease-only laws retrieve the capability through D1, then exercise the synchronous public-key committer. Locally signed fixture time strings are not challenge-exchange proof.
3. HTTP190 uses actual T2 code with an external public-signature adapter in an isolated module loader, plus its real memory Store/Outbox; it does not prove W6 IndexedDB. Its signatureOver compatibility hook returns the supplied signature only after public verification. The 100-way race uses fresh bridges in actual workerd requests with native D1, no shared authority, mutex or queue. Setup/readback and SQL cuts use the Node D1 binding. SQL statement-failure rollback and orderly persisted close/reopen are proven; hard process-kill/power-loss is not claimed.
4. The first 100-way Node proxy run lost local RPC replies (`fetch failed`). The final race preserves 100 concurrently launched invocations inside the actual Worker runtime. The bridge also tests fresh-snapshot retry after a durable batch whose reply is deliberately lost. No remote database is simulated.
5. Pinned Wrangler 4.129.0 uses Miniflare 5.20260903.0-alpha and workerd 1.20260903.1 here. Persistence uses the Miniflare resourcePersistencePath setting, checked by disk reopen. Node24/Windows and headless Edge151 are executed. Linux, Safari, the owner's phone, isolated restore and remote D1 remain unexecuted here. Cowork must re-run on Linux before integration.
6. W4 production activation must configure the real Clerk issuer, allowed origins, audience-bearing tokens and pinned public JWKS; protect private signing/identity keys; provision subject/device mappings and the D1 US resource. This is an exported Worker factory and tested runtime bundle, not a deployed service. Enrollment currently means lookup of a preprovisioned device. No live account, token, deployment or secret is required by local tests.
7. **W6-TIME-BOUND OPEN; no CLOCK PASS.** The /time sample follows the awaited scope revision commit. Deployed Workers clocks advance after I/O; local timing differs (sources in WIRE.md). No finite UTC-error bound, maximum authority-clock forward rate/step or qualified client elapsed-time bound has been established. The observed timeout cannot establish [Tlo,Thi], justify Thi+H, create checkpoint C or reset the owner's settled 24-observed-hour/64-slot allowance. Fixed-clock tests prove conditional protocol handling only; accepted restart/coherent-restore undercount exposure remains explicit.
8. **W6 reconciliation/renewal OPEN.** Lease/enrol do not renew. Pull/snapshot do not jointly reconcile terminal/WAITING dispositions, pending immutable envelopes, sequence/head, standing and lease history. Fresh time, token refresh, successful reads and an empty outbox do not create C. Preserve original pending bytes/lease_id. History/multiple-lease design must prevent stranding old pending work. Failed-persistence knowledge-loss fencing, sealing/recovery custody and rotation drills remain W6/W4/W8 obligations.
9. Frozen conformance semantics and public pins are unchanged. Canonical-v1's known decimal/ordering defects remain unchanged. The prescribed frozen engine builder fails on Windows with ERR_UNSUPPORTED_ESM_URL_SCHEME for a drive path; the tracked W5 portable helper exports only the two public engine sources and uses file URLs with the same bundle settings. Golden regeneration checks public bytes except engine stamp, checks the private committed hash after stamp normalization, then restores all committed public/manifest pins. Private fixtures/bundles/logs remain untracked and unquoted.

## Reproduction and wall-clock

Install W5's pinned dependencies once with `pnpm --dir rebuild/m3/w5 install --frozen-lockfile`; root frozen regression dependencies must also be present. Installation needs registry access; subsequent local tests use no account/token/network beyond loopback. From the repo root run `node rebuild/m3/w5/build.cjs`, then `node rebuild/m3/rigs/run.cjs --env local`; `--case AUTH-D1` or `--case HTTP-190` selects one case. Synthetic-remote exits2; owner-phone and isolated-restore emit typed pending/blocked results.

Frozen preparation: attempt the prescribed `build-engines.mjs <root>`; on this Windows path use `node rebuild/m3/w5/build-engines-portable.mjs`, then `node rebuild/m3/w5/prepare-gate.cjs`. `node rebuild/m3/rigs/verify-local.cjs` runs local crypto, Worker smoke, bite, local/remote gates, golden preparation, frozen conformance/selftest and strict. It sets explicit absolute ENGINE_MAIN/ENGINE_OLD plus MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York for conformance, and unsets MEASURED_TEST_NOW for strict. Optional `--browser --playwright-path <installed playwright>` adds the real browser check; Playwright is not required by the local gate.

Wall-clock: implementation files began approximately 2026-09-06 03:41Z; final verification finished 07:34Z, about 3h53 elapsed including substantial dependency/permission waits and diagnostic iterations. This is elapsed time, not claimed active coding time. PR publication follows verification; Linux execution remains Cowork's next actor.

## NEXT

- **W5-VERIFY — Cowork:** execute the claimed gates on Linux at the exact final PR head and record the verdict before integration.
- The published contract unblocks **W6 transport implementation start only**. It does not accept W5, prove browser durability or authorize a release.
- **W4-DEPLOY / W5-REMOTE:** actual provisioning remains necessary; remote execution depends on the provisioned service and accepted W5. Local fixtures do not satisfy those dependencies.
- **CLOCK / time bounds / reconciliation / lease renewal remain OPEN** under the limits above.
- The actual **W5 claim remains held for review corrections until explicit release**. This handoff does not create another implementation claim or transfer ownership implicitly.
