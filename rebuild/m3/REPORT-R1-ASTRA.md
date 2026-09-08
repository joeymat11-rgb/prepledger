# W5-R1 implementation — ASTRA

## September 8 workout admission — bounded component, not schema activation

Actual retained base: d26795a47d638ec1e67840455273cc05eeca9926. PR46 published
the source amendment at1fe2e090, received Opus Message80 PERMISSION TO IMPLEMENT
with C-1–C-5, then published every correction at92d48fdd6cf09dbe5787559a4e6b5aec74d38a6e
BEFORE these changes were adopted into the retained R1 source. The reviewer’s
10/10 demonstration was scratch evidence, not the implementation adopted here.
No new branch, issuer/codec/SQL/route/client/W6/dependency change or activation.

The actual admission/index/bridge now accept a trusted static synchronous profile
for lease-granted schema2. The exact accepted shared shape file is copied from
PR46: SHA2564702fdeeb25fb958f7f89bdedfe12d513f575db06df25db938af2fa58d12155e.
The static profile checks a declared start's same-athlete/session-start type and
an edit target's same-athlete/session-set type and matching lift lineage. Core
unions original causal parents, target and profile refs in first-occurrence order;
WAITING/rejected/foreign dependencies retain their existing paths and drain.
The new gate follows existing version equality, revocation, range and occupied
slot checks. Missing/broken/nonboolean/Promise profile results throw fresh internal
errors WITHOUT rejectionCode, yielding UNAVAILABLE with unchanged rows; valid
boolean false means MALFORMED. Terminal exact replay is preserved. Native rejected
Promises are observed only to prevent a later unhandled host rejection; they are
still refused synchronously. No asynchronous authority transaction was added.

Focused tracked commands (Node from repo root):
`node rebuild/m3/w5/test/workout-core.test.cjs`,
`node rebuild/m3/w5/test/workout-http.test.cjs`,
`node rebuild/m3/w5/test/workout-bite.cjs`.
The core test uses the actual authority/P-256/operation builder and all six kinds;
it checks status AND unchanged rows on dependency failures, existing error order,
mixed old/new exact retries, late arrival, waiting drain, second-device edits and
missing/wrong-kind/foreign/rejected starts. HTTP uses actual local Worker/auth,
P-256, R1 staged bridge, migrations and D1, with a healthy accountRegistry control.
The existing local-workerd harness gains only an optional authorityRoot for the
disposable bite; default callers retain the same source. Keys are ephemeral.

```text
WORKOUT ACTUAL CORE PASS — 34/34; synthetic capabilities, NOT ACTIVATED
WORKOUT R1 HTTP PASS — 9/9; artificial unissued capability, full recovery NOT QUALIFIED
WORKOUT BITE RED-core: FAIL rejected-start-terminal-dependency: ERR_ASSERTION
WORKOUT BITE RED-http: FAIL http-rejected-start-child-terminal: ERR_ASSERTION
WORKOUT ACTUAL CORE PASS — 34/34; synthetic capabilities, NOT ACTIVATED
WORKOUT R1 HTTP PASS — 9/9; artificial unissued capability, full recovery NOT QUALIFIED
WORKOUT BITE PASS — both boundaries detected; restored admit SHA256 95ecf1c7c25f16efeec2a2b4ead73edb53570e83ad13ec74020d8088fbfdadea
```

Both bites exited1 from named behavioral assertions, not harness failures; restored
runs exited0. All real authority source pins remained unchanged during the bite.
Removing only declared workout refs in the disposable core wrongly accepts a
child of a rejected start: both actual core and HTTP tests detect this.

Preparation failures are retained, not converted to successful product evidence:
unchanged core4/18 and HTTP3/9 failed the proposed new-profile cases; these are
not new frozen-engine defect rulings. Early scratch tests exposed a sparse refs
array and an unhandled rejected Promise (21/22 plus host rejection), then the
reviewer's placement/error requirements (24/31); corrected scratch passed31/31
before actual adoption. Expanded actual source now passes34/34. One later HTTP
setup failed ERR_ASSERTION before cases; no initial location trace was available.
Inspection found raw base64url nonce could start with an invalid intent-ID prefix.
Test intent/lease IDs now have a fixed valid prefix and enrollment requests pass
the ACTUAL codec before HTTP. This removes that identifiable test hazard, but the
original setup failure's exact cause is not established. No product guard relaxed.

SEAMS: artificial signed historical schema2 capabilities are inserted ONLY by the
synthetic test beside actual schema1 enrollment. The real issuer STILL refuses
schema2; complete recovery STILL refuses the artificial registry with
RETAINED_INTEGRITY. These two negative controls are required and pass. This is
admission evidence, not legitimate issuance, complete registry, recovery, client
Saved, full semantic admission or phone evidence. Ordinary readings under a
schema2 lease are MALFORMED; schema1 coexistence uses R1's original-issued-lease
resolver. The workout-only component cannot be activated as a complete app schema.
Authenticated plan/lift registry, corrected-state fold/concurrent edit semantics,
full manifest/issuer/activation, recoverable prescription capture, actual W6
command/commit join, scientific applicability and all release gates remain open.
R1 resource FAIL162050118 versus96MiB remains unchanged; no rerun/metric waiver.

First mandatory run: R1-FOCUSED178/179/native1. The failing owned test requires
non-reconcile construction source to equal the older pinned bridge exactly;
the sole difference is the reviewed workoutProfile binding in each constructor.
`r1-scoped-read.test.cjs` now requires exactly those two substitutions and no
others. It retains the historical bridge/hash and all remaining source plus the
exact two-statement revision guard. This is a disclosed owned source-pin update,
not a frozen law/runner edit or removed behavioral check. Targeted test1/1 passes;
the actual assertion also rejects three author synthetic changes to the read
query, writer delta and revision guard. Full affected rerun179/179/native0 in
92.7seconds; original failing run retained. No unrelated successful gate repeated
after this test-only source-pin clarification. Mandatory package results:

```text
CURRENT-HEAD CANDIDATE: 28/28 PASS
CURRENT-HEAD BITES: 4/4 EFFECTIVE; original candidates byte-identical; restored28/28 PASS
R1-FOCUSED PASS
AUTH-D1 PASS (34/34 mapped laws GREEN on local D1 + rig191 10/10 EFFECTIVE breaks)
HTTP-190 PASS (5/5 over real local HTTP with the C6 cuts)
run.cjs SUMMARY local: 2 PASS / 0 FAIL / 0 BLOCKED / 0 PENDING
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
All checks passed. Safe to ship.
DIFF-CHECK PASS
```

Private preparation emitted verdicts only; public pins unchanged. Strict ran with
MEASURED_TEST_NOW unset; its release wording applies to the frozen old app only.
The first package wrapper exits1 because it preserves the original178/179 result;
the corrected full R1-FOCUSED separately exits0. Logs retained locally under
r1-current-head-gates-2026-09-08T20-03-09-744Z and workout-r1-focused-corrected.log.
New PWA package, private/release and resource gates remain open. CI and affected
independent implementation review are pending at this publication.
Wall-clock to publication: about45minutes from19:27Z, including proposal review,
its required corrections, focused implementation and mandatory tests; not a
claim of complete app progress or time needed for remaining review/integration.
NEXT: review this actual delta on retained PR43, then
continue complete manifest/command and prescription-recovery joins under PR46/W6.
The full Joe/Dad workout-and-plan goal is unchanged; no merge or private use.

## September 8 current-head candidate — implementation, not R1 completion

Retained branch/base 003c816e695fce7e77e17665f25d8cdcc2435211; no new product stream.
Implements the separately accepted proposed current-head contract at the narrow
worker/crypto/public-client boundary. Preserved contract plus existing brief/WIRE
explain exact API, request/domain/canonical nonce, pending lifecycle, callback
acknowledgement and errors. No bridge/core/operation/schema/lease/W6 changes.
Legacy original signed objects remain valid; reserved history_profile cannot
upgrade a legacy-domain response. Existing R1-COMPLETE resource FAIL remains.

Before tracked placement:28/28 actual local D1/HTTP and controlled-sink cases PASS;
four disposable-file mutations fail behavioral assertions after7–21 controls,
restored public-client SHAe692ba364c6b53c8287effe07d99064b9cad92095af43c9faa8bd4997a4e5e74,
restored28/28 PASS. Portable tracked-path runner also28/28 PASS. These are author
focused evidence, not the pending full regression/publication/independent cut.
An initial subject-remap fixture violated the existing unique binding constraint
and got503; corrected by releasing the other synthetic binding before remap.
Original failure retained. No product guard removed or expectation softened.

HEAD-QA-01 author-side helper found no material issue, checked stable hashes and
ran two actual-WebCrypto inner-receipt races. Its correction is adopted: wrapper
refusal is not an actual issuance transaction. Actual R1 uses executeR1 at319,
not the older proposed-text execute call path; same complete guard is reused.
No independent acceptance, physical claim or measured usage saving follows.

Tracked candidate validation: current-head28/28 and four effective/restored bites
PASS; original AUTH-D134/34 plus10/10 effective breaks and HTTP-1905/5 PASS;
conformance99reference/99STRONG/29absent/70present CONSISTENT, rig185W1/W2,
SELFTEST, strict, frozen paths and old-package18actualZIP PASS. New PWA package
remains PENDING. Original full run failed R1-FOCUSED177/178: the existing owned
crypto test enumerated candidate domains, then called a historical convenience
method that cannot exist for a new domain. Preserve that failed run. Enumerate
every historical domain instead, add exact-domain equality, keep every original
assertion, and separately check new-domain historical public verification,
rotation, tamper/wrong-key rejection and cross-domain rejection. Focused crypto
16/16 PASS. No production workaround or frozen conformance change. Full corrected
R1-FOCUSED179/179 PASS in93.4seconds, native0; CI and independent review pending.
Local logs: r1-current-head-gates-2026-09-08T16-22-20-406Z and
current-head-implementation/r1-focused-corrected.log (synthetic; original retained).
Real W6 atomic sink,
knowledge-loss fence, normalized basis, Q1 and attempt-bound issuance remain open;
as do provider/resource/deployment/private port/phone gates. Nothing merges.
NEXT: publish the same R1 PR/claim with these candidate checks,
obtain independent affected review, then join qualified producer to actual W6.

Status: **R1-COMPLETE FAIL — resource ceiling unsatisfied**. Cowork independently accepted the scoped-read v1.2 checkpoint at9f08c01 after178/178 focused tests, full original regression and three own effective bites; this is not complete R1 acceptance. The proposed occupied-memory v2 metric was rejected. Neither1MiB successor nor a replacement resource gate is adopted. W6 remains paused; no release claim.

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
| Scoped reconciliation read | Same96 + refusal |162,050,118 bytes|FAIL memory; max125.75CPUms,5 statements, zero domain writes|
Ceiling remains96MiB/1000CPUms/1000statements/batch<30s/zero domain writes. Six original evidence hashes and sanitized metrics are tracked in `w5/fixtures/r1-resource-failures.json`; samples remain ignored. The1MiB proposal is versioned and requires independent technical acceptance; a smaller cap does not by itself resolve memory.
Two post-workload diagnostics failed at inspector collection; no after vector exists and no collectible-memory conclusion is claimed. The pinned standalone runtime has no hosted-style isolate enforcer and disables idle/incremental collection; that is a diagnostic lead, not a reason to discard the gate. Details/reproduction are in `w5/reconciliation/RESOURCE-LIMITS.md`. Stop repeating the same failed premise; the remaining resource profile needs focused technical review before any acceptance claim.

E1 follow-up on2026-09-06T20:01Z ran the unchanged complete1MiB workload once in an isolated child with `MINIFLARE_WORKERD_V8_FLAGS=--max-old-space-size=128`, using the installed Miniflare5.20260903.0-alpha passthrough. Parent/default environment unchanged; no product edit, forced collection or acceptance-metric/cap revision. **DIAGNOSTIC — NOT ACCEPTANCE; original observations FAIL**:32+32+32 pages and extra-byte typed413,97 requests, no OOM/request failure, exit1. Peak simultaneous total+embedder+backing209,507,497bytes exceeds the unchanged96MiB ceiling; sequential and oversize phases also exceeded it. At the peak, used86,181,360 / total190,230,528 / embedder258,024 / backing19,018,945bytes; all206 vectors and component maxima are retained. Guarded CPU max110.125ms, max5 statements/request, zero domain writes. Old-space128MiB does not constrain total isolate memory to128MiB or establish production equivalence; usedSize alone cannot replace the original metric.
Tracked helper: `node rebuild/m3/w5/test/r1-resource-constrained-diagnostic.cjs`, SHA256 `31e6cde76491337bf41207d1f87fcf965c8d05b0b1afc27435ddf7311888ef35`; ignored evidence `r1-resource-constrained-diagnostic.json`, SHA256 `f135eae3318847d72725003d72b105aeebcb79eed20ea6ab3a416f0154befbb3`. Held source pins are in the evidence and resource note; the four preceding acceptance failures and both earlier diagnostics rehash unchanged. No additional E1 experiment was performed; R1-COMPLETE remains FAIL.

The subsequent bounded product experiment replaces only the concatenated digest buffer with two streaming SHA-256 updates, preserving the defensive input copy and exact tag plus NUL bytes. New independent Node SHA/input-isolation regression plus existing codec/base64/boundary/limits/transport tests: **117/117 PASS**, 4.464 seconds. New codec SHA256 `1150930b9aafa55e5321d9a74ecbb86b3c17a3b839ae0bf13165ce8200fcabe3`; new `r1-streaming-digest.test.cjs` SHA256 `25b1d1d376900168538e39a02c6423dcc42ee791fcc410f69cf644417d69b52a`. One unchanged original-resource run with default runtime flags completed 96 pages and typed +1-byte413: **FAIL**, three memory violations, no request failure. Peaks sequential/overlap/oversize: 150,521,780 / 176,504,664 / 159,708,066 bytes. Guarded CPU max/p95 110.125ms, max 5 statements, zero domain writes. Ignored `r1-resource-1m-streaming-digest-fail.json` SHA256 `e43b9665e3233997da4749f8e22b9883614dc2267a81e27747a829a445ae843b`; prior artifacts remain unchanged. The difference from 180,073,345 bytes is **not a statistically established improvement** and grants no resource acceptance. No full focused/regression/bite rerun or further optimization followed; the constrained-heap and streaming-buffer hypotheses require reassessment.

Population A/B follow-up on the same product `777caa5` is **DIAGNOSTIC — NOT ACCEPTANCE**. Two fresh identical runtimes completed 192 pages plus two typed +1-byte refusals, 194 requests, no OOM/request failure. A: own account only, 18 rows / 649,819 JSON bytes. B: the same own scope/request/1MiB-proof semantics plus 23 valid foreign rows / exactly 9,437,184 JSON bytes, using a guarded whitespace-only update to seven mutable foreign rows; all parsed values and own raw bytes remained unchanged. Each actual own expected proof was pinned and verified. Original total+embedder+backing peaks A/B: **165,864,407 / 652,866,449 bytes**, both FAIL. Diagnostic used+embedder+backing peaks: 91,858,687 / 563,481,621 bytes; these do not replace the original metric. Guarded CPU maxima 110.125 / 235.125ms; rows read 2,132 / 4,460; query duration sums 37 / 711ms; arm durations including setup/cleanup 8.217 / 16.562 seconds. Both max five statements/request and zero domain writes. All 12 prior evidence files and 15 source pins remain unchanged.
Tracked helper `w5/test/r1-population-diagnostic.cjs` SHA256 `1ddd076abf1472b6f77ecce7495a55ce79236a13aaacb0eebf190aeb7bc05125`; executed helper was `1f307379e00648275e7231f5134c33bb5afdbb794412a53e451bac04d03d9883`, followed only by a documented pre-workload publication-guard/metadata adjustment. Ignored pair evidence SHA256 `40dc1278d83ed8afd92df651a3cea7b42acdd38833aaef532905d265fc1b61bb`, with individual hashes/vectors in the resource note. A single A/B pair establishes neither a universal cause nor a peak distribution. Own-only still exceeds 96MiB; scoped SQL alone cannot claim acceptance. The diagnostic publication proposed the reconciliation-only subject-bound read in `w5/reconciliation/SCOPED-READ.md`; its subsequent contract acceptance is recorded below. Oversized-own-account preflight and a separate versioned-metric definition remain OPEN. No SQL/product/metric/cap change or further experiment was performed; full current-codec focused/regression/bite reruns remain PENDING.

## Scoped-read contract v1.2 — docs-only publication

C Message74 independent review, 2026-09-06, accepted scoped-read WITH SEVEN AMENDMENTS. `BRIEF-W5-R1.md` v1.2 §3 and `w5/reconciliation/SCOPED-READ.md` now bind only reconciliation to a consistent subject-bound three-statement read batch; R1-D1 GLOBAL revision assertion/increment and full snapshots on all other paths remain. Required implementation evidence includes the actual-migration SCAN→named-index SEARCH witness, captured principal bound twice, missing-binding403/no authority-row read → malformed-revision503 → own-integrity500 precedence after HTTP authentication, exact sorted projection/retained-byte/unsigned-body/digest equality, and revisioned remap/revocation/closure reload/refusal. Existing T03 enrolment refusal remains; foreign malformed-row isolation changes reconciliation only.
C independently reported Linux A/B total-based peaks 225,479,258 / 1,189,983,091 bytes and used-based peaks 136,203,486 / 1,078,416,355 bytes; CPU maxima 210 / 650ms; rows read 2,132 / 4,460. Both arms FAIL both 96MiB metrics. These are C's reproduction results, not an additional Astra execution. Own-account memory remains unresolved; all five original FAILs and separate diagnostics remain. Scoped SQL alone grants no acceptance, and OPEN-BYTE-PREFLIGHT / OPEN-RESOURCE-V2 remain unadopted.
This publication changes three documents only: no SQL, product, helper, cap or metric change and no new experiment. Unchanged v1 resource, full focused/regression and effective bites on final source remain required; current full reruns remain PENDING and R1-COMPLETE remains FAIL. Coordinator publication/ledger precedes the bounded implementation assignment.
C also identified two non-blocking diagnostic-helper fixes for the next focused change: create `.generated` before its clean-clone `readdir`, and replace the padding assertion's binary 2MiB ceiling with D1's decimal 2MB limit. Neither helper is edited here. The measured B fixture's largest row was 1,357,356 bytes, below both limits; the existing A/B evidence is retained.

## Scoped-read implementation — final executed result

Implemented only the v1.2 reconciliation read: capture the authenticated subject once, bind it to both indexed subject predicates in the consistent read batch, and preserve the global revision assertion/increment. Other action paths retain their full snapshot. The actual migration planner changes from SCAN to `SEARCH authority_rows USING INDEX sqlite_autoindex_authority_rows_1 (athlete=?)`, with a subject primary-key subquery. No index or schema change was necessary.
Nine new real-D1/HTTP tests PASS, including exact complete proof/retained-whitespace/unsigned-body/digest equality under reversed SQL ordering, missing binding without fallback, malformed foreign-row isolation, all six unchanged non-reconcile paths, and revisioned remap/revocation/closure retries. The combined new/issuer run passes24/24. Its first run was23/24: the one old test required reconciliation to reject malformed foreign JSON, the behavior explicitly replaced by v1.2. That exact cell now requires the same successful proof with foreign corruption and still requires RETAINED_INTEGRITY when identical corrupt bytes belong to the requesting athlete; poison-core and initial-proof controls remain.
Precedence clarification from an executed old/new witness: with both an unknown subject and a missing revision, the old bridge returns UNAVAILABLE503. An initial early403 candidate failed the new test and was corrected before this publication. The final source retains revision-first503; a valid revision plus missing binding gives403 and zero authority rows; malformed own retained bytes give500. The preceding docs-only paragraph's arrow ordering must not be read as a new403-over503 rule. HTTP authentication still precedes the bridge.
The population diagnostic now creates its evidence directory before inventory, applies the documented2,000,000-byte limit to each individual string (not the whole row), and requires an explicit caller receipt pinning HEAD/helper/all15 source files for candidate runs. Nine helper tests PASS; prior A/B files cannot be overwritten. The focused runner includes the streaming-digest, scoped-read and population-helper tests while retaining all prior tests. Bridge SHA256 `970bf75ebbb1c966bacbd5df20a75aea4376f8e20e5ac8344d6697b167dafe2f`; no resource metric/cap change. Full focused/resource/regression/bite results follow only after execution on these stable bytes.
Read-only instrumentation review found no concrete cross-request payload retention: request metrics contain scalars, inspector calls return scalar heap measurements without remote object handles, and fixture/evidence storage resides in the Node harness outside the measured isolate. This does not discount any previous resource FAIL or prove absence of a runtime problem.

Final source `ed71de2e7406bd83dee8eeec358c8bd163cb2f80`: `rig-r1.cjs --case FOCUSED --env local`178/178 PASS in91.131s; all eight effective bites detect their fault and restore exact source bytes. `R1 SNAPSHOT RACE PASS — 100 real-workerd HTTP invocations; complete guarded proofs or state17; zero read domain writes`. Exact guard bite: `R1 REVISION BITE RED — removed R1 revision assertion returned stale owner-bound proof`; restored bridge SHA256 `970bf75ebbb1c966bacbd5df20a75aea4376f8e20e5ac8344d6697b167dafe2f`.
Unchanged `--case RESOURCE` finished the full97-request workload and +1-byte refusal, exit1: `R1-RESOURCE FAIL — 96 actual pages; 3 resource violations`, overall `R1-COMPLETE FAIL (required RESOURCE evidence incomplete)`. The new A/B diagnostic completed194 requests on caller-pinned identical current sources: original metric161,795,629 /178,667,024 bytes (both FAIL); diagnostic used-based83,715,877 /86,555,640 bytes. Foreign-population amplification is reduced in this one pair, not universally bounded. Both max110.125CPUms,5 statements and zero domain writes. All six FAILs and full simultaneous vectors are retained; exact evidence hashes, source receipt and reproduction are in RESOURCE-LIMITS.md.
Unchanged original regression, explicit frozen ENGINE_MAIN/ENGINE_OLD, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict removes MEASURED_TEST_NOW:
```text
AUTH-D1 PASS (34/34 mapped laws GREEN on local D1 + rig191 10/10 EFFECTIVE breaks)
HTTP-190 PASS (5/5 over real local HTTP with the C6 cuts)
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
R1-REGRESSION PASS
```
These PASS lines do not override the resource FAIL. The full source/fixture/report proposal is ready for independent execution. `RESOURCE-V2-PROPOSAL.md` is a separately labelled technical-review proposal with retained-heap/buffer negative controls and both-host evidence requirements, not an adopted metric or an implemented runner; earlier Linux used-based own-only failures remain explicitly cited. OPEN-BYTE-PREFLIGHT remains unresolved too. No further micro-optimization or collection experiment was run.

## Seams, not covered and accounting

### Independent scoped checkpoint and rejected metric — 2026-09-06
Cowork executed exact9f08c01eba964ce3422e622671ebe94d9d8fa92a on Linux (product/tested71de2e, bridge970bf75ebbb1c966bacbd5df20a75aea4376f8e20e5ac8344d6697b167dafe2f) and accepted only the scoped checkpoint. FOCUSED178/178 includes the real planner, missing subject/revision precedence, exact proof bytes, foreign isolation, revisioned standing changes and100-invocation race. Original AUTH-D1 34/34+rig19110/10,HTTP1905/5,conformance99/99/29/70+rig185,SELFTEST and strict PASS. Its own three bites were effective: restore global reads, bypass revision guard, move denied before revision validation; original bridge SHA restored each time. The contract/checkpoint ledger pin awaits the existing integration handoff.
Its original resource workload still FAILS three phases:116725610/196262483/202545974 bytes,96pages+typed413,97requests,5statements,2326rows read and0domain writes. Source-pinned A/B diagnostic reports own-only220328508 total/128604204 used-based bytes; foreign arm238279292/133795156; CPU230/240ms. Both occupied views exceed96MiB. These are independent reported observations, not locally reproduced Linux results. Existing six local failures remain unchanged.
Cowork rejects RESOURCE-V2-PROPOSAL.md as an acceptance successor; the original proposal at9f08c01 has SHA791575c64578f42d6d0ec9bfe000ec773127100be6e22a8fa64b6be5a7e6a6ef. Changing formulas cannot pass its own both-host requirement. Runtime/GC behavior is a plausible contributor to the differing samples; no measurement here proves hosted live-set or provider-limit equivalence. Original v1 FAIL stays recorded; no remote-only replacement, cap reduction or omitted phase is authorized. A separately bounded heap-limited diagnostic or hosted successor would need an explicit contract and evidence; HTTP200 alone is insufficient.
Accounting discrepancy retained: cowork's B arm reports2348rows/10statements versus root2326/5. Padding entering SQL request counters is ruled out by source ordering: populate is awaited before measurement (population diagnostic62–80; resource test97–102), setup uses a direct DB handle, and counters are fresh per request (r1-workerd31–53). An actual revision retry could explain10statements and additional rows (bridge122–125,156–161), but request-level attribution awaits cowork's vector. Statement attempts increment before await; row/query totals use returned successful metadata, so unavailable failed-batch row work is not asserted zero. No new workload or gate change follows from this note.

Local tests do not establish remote D1, Clerk production, phone survival, checkpoint C, CLOCK, K1 knowledge-loss fencing, T1 finite signed-time bounds or P1 key availability. Privacy-D2 sign-out retention/erasure still needs the applicable owner decision before private behavior; synthetic construction does not choose it. The initialized soak and frozen app are untouched. The consumer is a synthetic contract witness, not a substitute for IndexedDB/device evidence.
Gates use pinned frozen bundles and locally regenerated private fixtures under AGENTS.md, with verdicts only. The Windows frozen-builder raw-path ESM issue was handled using previously commit-verified bundle bytes and isolated unchanged-golden preparation, preserving public pins. Reproduction requires real dependency directories, not a symlinked node_modules. Linux independently rebuilds its own frozen bundles.
Claim recorded2026-09-06T18:03:54Z; final regression completed by2026-09-06T19:53Z (about109 minutes calendar, not active engineering time). Work spans the recorded usage interruption; calendar duration includes simultaneous D12 work and waits, not engineering time. Attributable tokens/cost are unavailable. Current models and ownership were retained. No new provider, purchase, secret, policy or physical action was performed.

## NEXT

Current claim: W5-R1 implementation. Exact scoped-read functional/regression evidence is published for independent execution; resource acceptance remains FAIL. C reviews the explicit unadopted resource-v2 proposal and own-account preflight question before further implementation. No existing gate changes by publishing a proposal. W6 stays paused until the reviewed dependency permits resumption; its eventual durable sink must repeat recovery cases. D12 proceeds independently. No R1 merge or owner action requested by this report.
