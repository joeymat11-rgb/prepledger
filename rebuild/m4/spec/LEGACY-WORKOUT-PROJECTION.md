# Authenticated legacy workout observations — nonshipping candidate

This follows the scoped accepted reader at PR46 `01cb2ed` (reader SHA256
`be06c0111ca1ccd0f587933f61d7ee91fb7235f8670e1cb31a6f239ddd316e25`).
Dependency: actual retained R1 `003c816e695fce7e77e17665f25d8cdcc2435211`.
New files: `legacy-workout-view.cjs`, `legacy-workout-projection.cjs` and its test.
These do not inherit the earlier reader's independent acceptance.

## Consumer contract

`createLegacyWorkoutView(reader)` and `createLegacyWorkoutProjection(reader)` link
a trusted reader instance created from the pinned modules. Call `.read` with the
same raw manifest/pages/request/expected input as the authenticated reader. A
caller-supplied `verified:true` history object cannot enter through this interface.
The actual verification occurs before any interpretation; refusal has no view or
projection. Interpretation is detached from caller bytes and changes no source.

The original-event view retains each operation and its exact log/operation/
disposition rows. It preserves per-set load/reps quantities, explicit legacy
`payload.session_start_id`, lift and slot, and joins reader issues by operation ID.
It does not infer a causal relationship, session partition or consent from day,
device, order or a legacy reference. Missing effort remains unknown and missing
plan basis remains null; unsupported payloads stay uninterpreted. Legacy
class-reading edits targeting session facts remain visible.

The observation projection supports schema1 original session-set quantities plus
explicit causal corrections of load/reps and a subsequent targeted tombstone.
Corrections must target the original set and causally cover all earlier edits of
that set, including transitive ancestry. Device predecessor/sequence are not
semantic descent (runtime B15); arrival positions alone cannot qualify a chain.
Original source bytes and all target effects remain retained. A supported removal
returns REMOVED and null contribution; unsupported replacement, effect or concurrent
edit returns UNRESOLVED and null observations for that set, leaving unrelated sets
available within this same limited historical domain. No partial chain becomes
purported corrected truth. Graph integrity failure leaves recorded evidence but
no projection. The original values remain accessible separately in every case.

This is the explicitly limited nonconcurrent profile already described by the
workout brief, now exercised on actual signed legacy operations. It does not
decide a concurrent field/removal policy, implement the future schema, refuse
athlete writes, emit an authority disposition or replace a runtime UI state.
`decisionReady` always remains false; currency is CAPTURED_PREFIX_ONLY. It does
not qualify the whole workout for progression, plan selection, completion,
currentness, safety, lineage, bounded-effort interpretation or private use.
Correctly reflecting recorded corrections is a prerequisite to those decisions,
not proof of their rules or of missing legacy plan consent.

## Executed reproduction and limits

Use Node24 and an explicit checkout at the R1 revision, with dependencies from
that checkout's `rebuild/m3/w5/package.json`/`pnpm-lock.yaml` installed as described
in R1-HISTORY-READER.md. From this repository root:

```text
node rebuild/m4/spec/legacy-workout-projection.test.cjs <R1-checkout> <new-result.json>
```

The optional result path must not exist. Actual authority/client/W5 tracked CJS
sources are pinned before import and after execution. Core bundling uses the
existing buildCore crypto-boundary substitution into a new OS temporary directory;
no dependency or repository source is rewritten. It is not a new production build.
Published-path result: **20/20 PASS**, native0; two effective source faults expose
invented effort and ignored correction. Same-target concurrent orders both remain
unresolved. Raw rows are unchanged by each read; signed replay is exact.

The tracked synthetic fixture provides genesis/registry rows, not actual issuer
calls. Actual T2 `logSession`, finish and correction commands generate original
operations on two devices. Additional chain/removal/unsupported cases use the
actual operation builder and actual P256 authority admission. The local legacy
T2 HMAC test lease and R1 P256 lease have matching capability fields but distinct
test signatures; no phone receives production signing power. Actual accepted rows,
WAITING-to-ACCEPTED historyCount2, R1 projector, signatures and verifier execute.
This is memory evidence, **not issuer, D1, HTTP, IndexedDB or physical-phone proof**.

Earlier harness errors and pre-fix scratch source are preserved with the
coordinator. Important observations: legacy SET can accept before its transport
predecessor; an explicit correction target supplies the waiting dependency.
The new view initially dropped a class-reading session correction, then exposed
a TypeError for an actual accepted null START; those were corrected while original
records were retained. Neither fix changed frozen/core behavior or expectations.
Original13-case view evidence and initial19-case projection result remain; final20
adds both concurrency orders and valid declared transport predecessor fixtures.

Next: independently assess this profile and integrate its supported observations
into the complete workout path only with required schema/engine/currentness/storage
and existing independent/phone gates. Do not rename this candidate a shipped logger,
approved prescription engine or completed private pilot.
