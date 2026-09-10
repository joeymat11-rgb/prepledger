# Current-head durable consumer — retained W6 implementation slice

2026-09-08. Retained PR32/branch rebuild/m3-w6-browser-bridge, base
0d7f5e0cb5bd114ff87f699574fc45bb052703ea. Coordinator resumes this bounded product
slice; both preparatory helpers are finished. No competing W6 owner or new stream.
Dependency: published, bounded-reviewed R1 d26795a47d638ec1e67840455273cc05eeca9926,
CURRENT-HEAD-CONTRACT.md and WIRE.md. ResourceFAIL and all release holds remain.

Scope: public-client.mjs, t2-stage.cjs, new history-proof.mjs, owned focused tests
and a disposable composition runner, this contract and REPORT-W6-ASTRA.md only.
No R1/core/client/clock/repository semantics, original suite, dependency lock or
seeded store change. Older local W5 code must return typed unsupported for this
new operation; it must not simulate the dependency or silently accept a legacy pull.

API: exchangeCurrentHead(request, {issuanceAttempt}) captures the authenticated
repository's revision and contiguous frontier under its existing local queue,
creates the R1 challenge and releases the queue during network waiting. Local
writes can continue. The caller supplies the already selected attempt identity;
this slice does not issue a workout question or choose its basis/eligibility.
invalidateCurrentHead() retires that pending attempt immediately. Replacement,
restart, failed writes and replay cannot reuse it. Existing observationGuard must
cover the exchange; its production lifecycle/knowledge fence is still required.

R1 verifies the exact outer signature, request, scope, head/range and every receipt
before the W6 sink runs. W6 stages the actual T2 receipt path in one generation,
retaining the complete unchanged envelope in metadata.wireProofs.currentHead,
keyed by its original signature. No test-only metadata field or legacy signature
relabeling. Conflicting retained operation content refuses rather than replacing
the existing fact. Outbox disposition behavior remains unchanged.

The actual final repository validator compares snapshotRevision with the ORIGINAL
captured client revision and checks the same pending attempt/session/observation.
A CAS retry may restage, but cannot update that capture. These are local revisions,
never the server revision. Commit completion precedes confirmed:true. An adverse
change after commit returns stored:true/confirmed:false and hides the observation;
it must not pretend the disk rolled back. No blanket change to legacy acknowledgments.

On reopen, verify complete current-head signature/profile/scope/key epoch/range,
unique contiguous receipt identity and every receipt signature. This is historical
evidence only; no pending challenge or fresh permission is reconstructed. Missing
or invalid proof refuses18. The production persistent knowledge-loss fence,
normalizer, question issuance, Q1, CLOCK/T1/P1, schema activation, resource/provider,
private import and physical-phone requirements remain open, including full
current-head contract cases6/7. Passing these mechanics does not close them.

Tests must execute the owned product consumer, actual T2 and encrypted repository
on fake IndexedDB, including a competing actual writer, abort/quota, held
transaction, inner signature failure, replacement/replay/reopen and late context
loss. Add a real local-D1/HTTP producer control. A disposable source composition
pins R1 d26795a and uses current W6 candidate files plus its existing T2 browser
hooks (client/index, lease, sync); these must not be replaced by R1's older T2.
All composed W6/client source hashes are recorded;
it is not an integration commit or production package. Existing W6 regressions,
mandatory original gates and independent affected review remain required.
