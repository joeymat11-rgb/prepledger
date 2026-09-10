# Authenticated history reader — nonshipping boundary candidate

Public source dependency: retained R1 `003c816e695fce7e77e17665f25d8cdcc2435211`.
The factory links that actual codec, public verifier and authority shape validator;
response fields never choose dependencies. This is new executed preparation, not
promotion of the earlier assumption-only 21-case decoder to production.

## Contract

`linkR1HistoryReader({codec, createR1Verifier, validShape})` is trusted composition.
Its factory accepts pinned public keys/WebCrypto and the authenticated local
athlete/device binding. No private key, signer, storage or network callback is used.
`read({manifest,pages,request,expected})` captures caller inputs before its first
await and invokes the actual `createR1Verifier().assemble`. The existing signed
request/challenge/scope/page/payload/retained-row/disposition checks all run.
The expected request context remains a trusted caller input: this reader does
not establish login, an outstanding challenge, standing or lifetime itself.

Refusal is `{verified:false, code, history:null, decisionReady:false}`. A successful
read returns an authenticated **captured prefix**, its `through` watermark,
original manifest/request/payload bytes, accepted facts with the exact retained
operation/log/disposition row DTOs, and partial legacy START interpretation.
No reconstructed DTO masquerades as a newly signed receipt. Rejected/waiting
operations remain in the retained proof but never enter the accepted-fact list.

Schema1 START's existing `payload.slot` is read without inventing a default;
missing plan basis and the unimplemented liveness/eligibility fold remain explicit.
Other effects/unsupported shapes are retained with interpretation issues, not
silently treated as no-ops. `decisionReady` is always false in this cut. A consumer
must join each `starts` entry to `issues` by `opId`: a slotless START or one with
unsupported fields/effective formatting is still present in `starts`, whereas an
unsupported operation shape or schema is excluded from that interpretation list.
Neither membership in `starts` nor absence of one particular issue qualifies it.
The original record remains in `facts` in either case. This is partial decoding,
not a validated START domain; consumers must preserve the issues and unknowns.
A consumer
may not use raw retained facts as a resolved workout/prescription or assume that
an old signed prefix is the current head. No progression, answer applicability,
operation, frontier, outbox, authority admission or durable state is changed.
Before product promotion, the consumer must define truthful history display and
the actual qualified fold, currentness and storage joins; unknown remains unknown.

## Executed evidence

From the repository root with Node24, pass a separate checkout at the exact R1
revision, with its existing dependency installation. No private preparation needed:
The dependency manifest is specifically `<R1 checkout>/rebuild/m3/w5/package.json`
and its pinned `pnpm-lock.yaml`, not the repository-root package. Where missing,
install there with `pnpm install --ignore-workspace --frozen-lockfile --ignore-scripts`
using the declared package-manager version. No dependency file change is needed.

```text
node rebuild/m4/spec/r1-history-reader.test.cjs <checkout-at-003c816> <new-result-json>
```

The optional result file must not exist. The runner pins all tracked `.cjs` files
in the actual authority/client/W5 dependency trees to Git before import and checks
their hashes afterward. It compiles only the unchanged public fixture/packet
definitions preceding the first test in tracked `r1-codec.test.cjs`; it does not
edit/register its laws or run unrelated tests. That fixture supplies synthetic
rows and per-run signing keys. The actual projector, signatures and browser-safe
R1 verifier execute, but no issuance API, D1/HTTP server or phone is exercised.

Result: `R1 HISTORY READER: 16/16 PASS; 1/1 effective no-plan fault; no product source changed`.
Controls cover signed START and reading, exact row retention, forged outer/page/
inner evidence, missing page, wrong key/challenge/account/device, waiting/rejected
exclusion, concurrent input mutation, output alias detachment and exact repeated
read. The isolated source fault substitutes `NO_ACCEPTED_PLAN` for the missing
basis: authenticated execution reaches that wrong value and the normal assertion
fails; unchanged source returns null. No dependency omission or pin failure earns
mutation credit. This is author evidence, not independent acceptance or a full gate.

Three initial harness errors are retained in the coordinator evidence: foreign
VM object prototypes correctly refused by the real validator; comparison of two
fresh nonidentical P-256 signatures; and deliberate input mutation leaking into
a shared fixture buffer. Corrected the harness, not R1/reader expectations. The
final reader itself was unchanged during these fixes. The published test differs
from scratch only in explicit source-checkout requirement and local file names.

## Reuse correction and limits

R1 already implements `resolveIssuedLease` in `authority/admit.cjs:45–53` and
wires `issuedLeases` at `w5/bridge.cjs:176–187`. Do not implement the separate
older-source one-line `leases` proposal here or claim no issuer exists on R1.
That scoped review remains valid only for its inspected87366ae source.
R1's current proof/resource qualifications and rejected lower-cap workaround are
unchanged: using this code in a synthetic reader does not award provider/resource
PASS or activate its transport profile for private use. Browser bundling, durable
W6 view, history interpretation, future schema support, complete workout UI,
prescription rationale, full mandatory gates and independent acceptance/integration
remain required. This module is not shipped, deployed or fed private data.
