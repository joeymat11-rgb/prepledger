# W6 — storage, T2 staging and public browser integration, ASTRA

## Finite rows recovery through actual IndexedDB — successor to fe2d22a, 2026-09-09

Adds `recovery-transport.mjs`, an actual rows-v3 adaptation of the accepted W5 finite transport. It uses the encrypted stage, indexed profile verifier and durable attempt metadata; no whole-download page array remains. `createRowsFetcher` retains bounded original HTTP bytes through strict decoding, with HTTPS/loopback restrictions, explicit authenticated headers, no ambient cookies/shared cache/redirects and the published request/response ceilings. Byte collection uses at most 92 fixed 64 KiB blocks rather than an object for every potentially tiny network chunk. This is a per-response bound, not resource-gate acceptance.

The accepted 2 restarts / 2 retries / 30-second request timeout / 10-minute attempt watchdog are unchanged and source-pinned. Encrypted CAS-protected attempt markers commit before fetch; ACTIVE, EXHAUSTED and VALIDATED markers all require explicit Retry after reopening. Browser timer receivers are correct; monotonic boundaries are rechecked after awaits. Cancellation stops further positive profile reads/scans and later handle reads, while late raw replies still reach the mandatory negative-ingress callback. Quiet recovery returns `evidenceReady:true,complete:false,activated:false,checkpoint:false`; active generation, frontier and outbox remain untouched.

**Production durable negative-ingress/knowledge-loss policy and its connection to every writer remain OPEN.** The callback is mandatory, but requiring it is not implementing that policy. Tests use declared synthetic callbacks, including real signature verification; no CLOCK/state 17/state 19 persistence claim is made. Final local-original/outbox reconciliation, current-source/current-generation fences and activation remain separate obligations. The full approved goal v3 and M4 delivery brief v0.41 are preserved; no private-use milestone is narrowed to a download.

Final runs:

```
run-recovery-stage.cjs <retained-R1>: 79 tests; 79 pass; 0 fail; 0 skipped
RECOVERY TRANSPORT NATIVE PASS — 20 checks; actual Worker/D1/P1 originals through native HTTP fetcher/IndexedDB/crypto/controller, quota and retry fences; NOT production negative-ingress, activation or phone acceptance
run-current-head.cjs <retained-R1> --all: 312 tests; 312 pass; 0 fail; 0 skipped
RECOVERY TRANSPORT BITE RED — late signed rejection discarded after request timeout; native exit1
RECOVERY TIMER BITE RED — unbound browser timer receiver prevents native recovery; native exit1
RECOVERY TRANSPORT BITE RESTORED PASS — native exit0; SHA256 4f73fa7d4adca2456ae3ecb94039bead6a92004eac891de7d80d44399b435b2f
```

The 79 include prior 59, actual indexed cancellation and 19 transport tests. Real local Worker/D1/P1 HTTP produces an account larger than the old whole-payload limit; the actual byte fetcher, durable controller and indexed verifier interpret it while preserving a pre-existing synthetic unsynced entry. Controller-unit cases explicitly substitute semantic success for their generic signed inventories; those are not additional complete-profile proofs. Native 20 uses a loopback replay of actual Worker/D1/P1-produced signed originals through native HTTP/IndexedDB/WebCrypto; it is not live Clerk production or a phone test. Native quota on the attempt transaction prevents any fetch; reopened VALIDATED state cannot silently restart. Separate cases enforce duplicate/BOM/parsed-only refusal, byte ceilings, same-controller exclusion, competing durable CAS, request-before-marker ordering, late signed 200 rejection observation and refresh semantics.

Both new bites are effective in disposable copies and restored byte-for-byte: `earned-stage-bite-QROHNc` (late ingress) and `earned-stage-bite-agBsX4` (native timer), whose restored native 20 evidence is `earned-native-recovery-SrcyqC`. Final 79 took 8.24s; existing 312 took 4.83s. Final profile SHA 2b6b616c8cefb56c132b7a6363a74fdc0cc40644fa84929131385c9936a0aeb5, stage SHA cfc6d20b0645fe745ec6e4762050557d224a139c29802ae78556296d308b623b. Positive validation can no longer keep scanning after its abort signal; the actual indexed cancellation case stops at the first observed row.

Failures and corrections retained: first combined run 72/74; the new observer was given extra consumer-context fields, which the exact seven-field wire verifier correctly refused. The wire context and separate athlete/device scope are now distinct. That made the late-observer test wait; its diagnostic wait now measures actual monotonic elapsed time instead of assuming 1 ms timer delivery. The new browser adaptation initially called native timers with the wrong receiver; native recovery failed before fetch. The corrected default wrappers pass native 20, and the timer bite reproduces that failure. Original raw HTTP bytes now reach the decoder instead of passing through JSON.parse first. These changes do not modify accepted W5/core/frozen source or a conformance law.

Mandatory final logs `capture-publication-gates-2026-09-09T08-27-13-999Z`: preparation/private-verdict/public pins, frozen paths/actual 18-file ZIP, conformance, selftest, strict with measured clock unset and diff ALL native 0. Explicit engine/client paths, fixed 2026-09-03 and America/New_York were used for conformance. Private inputs stayed local and public pins remained unchanged.

```
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
DIFF-CHECK PASS
```

The strict tail is not release approval. Parent fe2d independently ACCEPTED in review 135 for snapshot interpretation only, reproducing 59/312/native 16/three bites and relation-by-relation mapping; 16 additional checks included source-anchored resident-structure evidence and a withdrawn/misattributed probe. Archive 7,408 bytes SHA c9588bf58f83ed3c2c20b720b92874cc36cc8c5a615eef0c1af584f4a16e91db ATTACHED, not locally received/rehashed/replayed. Parent fe2d CI terminal 7 SUCCESS / 3 SKIP both OS. Two wording corrections to that review: there are five claim outcomes, and requested-lease scope already exists in old `project` (though not inside `claimsAgainst`). No acceptance of successor bytes is inherited.

NEXT / SEAMS: implement the production durable negative-knowledge fence and connect every writer; reconcile local originals/outbox and final source/local-generation before activation. Keep frame 2/cleanup, original 96 MiB/default-runtime/CPU resource work, CLOCK/key custody, qualified same-session workout resume/next prescription, private port/rollback/drills, integrator and Joe/Dad phone gates. No provider, funding, model, schedule, product-rule or private-data change; no merge/activation. Remaining lease-history repeated-pass cost is unmeasured and unwaived.

## Indexed recovery profile interpretation — successor to40709c2, 2026-09-09

Implements `recovery-profile.mjs` over the actual inactive repository inventory: required records, every original operation/history/log relation, ownership/slots/transactions, device/lease/intent/standing links, accepted1..W, original disposition/lease public signatures, current-device scope and the exact manifest-bound claims/requested leases. Original values remain indexed; no whole-account payload/stringify/map is created. Lazy history results preserve the five existing claim outcomes without multiplying history arrays. The returned profile interpretation remains `complete:false,activated:false`; no active-generation switch, outbox drain or present-day permission is exported. Full approved goalv3 / delivery briefv0.41 remain intact; this advances accurate recovery before qualified workout resume.

Encrypted collection/page markers now publish in the original page transaction. A key-only cursor reads at most32 marker keys and verifies page ordinal, original row index/position and exact collection cardinality. Collection scans do not traverse unrelated page payloads. Missing/substituted markers refuse rather than silently dropping originals. Previously staged attempts without markers require explicit retry for populated collections; the active generation is retained. `keyRange` uses the native browser IDBKeyRange, explicitly injected in fake-IDB tests. No schema upgrade, private data, new custody, service-worker/soak or frozen source/law change.

Executed final evidence:

```
run-recovery-stage.cjs <retained-R1>: 59 tests; 59 pass; 0 fail; 0 skipped
RECOVERY PROFILE NATIVE PASS — 16 checks; actual Worker/D1/P1 HTTP originals, native IndexedDB/P-256/AES-GCM, indexed relational validation and untouched active outbox; NOT activation or phone acceptance
run-current-head.cjs <retained-R1> --all: 312 tests; 312 pass; 0 fail; 0 skipped
RECOVERY PROFILE BITE RED — forged original disposition accepted after signature bypass; native exit1
RECOVERY ORDINAL BITE RED — coherent signed log gap accepted after contiguous-log bypass; native exit1
RECOVERY PROFILE BITE RESTORED PASS — native exit0; SHA256 b614a0b47a9ec1ddabc5d505a8fa741515435ffdd485f50dfba74609f839dca8
RECOVERY STAGE BITE RED — known standing loss committed when final context guard bypassed; native exit1
RECOVERY STAGE BITE RESTORED PASS — native exit0; SHA256 f8cd4753a683fb4fe68331d9ab6d32eb8eb6123a02cb0cd3e7b8c3ab1c5e871c
```

The59 include the12 storage/actual-transport tests plus47 named old-oracle comparisons. The full local HTTP/P1 account exceeds the old1MiB whole-payload limit and validates through actual indexed storage. For exact compatibility, an under-cap synthetic prefix retains two writer-created signed originals and adjusts its metadata/last-accepted prefix; the unchanged old projector and `verify.assemble` are TEST ORACLES. Forty-one adversarial comparisons reject on both implementations, including a coherent signed1..W gap with unchanged counts, forged originals, absent history/ownership/slots, bad lease origins and standing. Positive comparisons cover claim/lease bytes and signed synthetic WAITING/renewal/second-device interpretations; these constructed states are not additional authority-admission or real two-phone claims. Negative comparisons use a test-only memory view to isolate semantics; actual transport/storage and native-browser positives are separate evidence. No claim that every negative vector was replayed through IndexedDB or real HTTP.

Final signature-bite restored run59/59 in8.17s; ordinal-bite restored59/59 in8.12s. Evidence directories: `earned-stage-bite-5b16qC`, `earned-stage-bite-YiA92J`, `earned-stage-bite-fvElOn`; final native `earned-native-recovery-wLZkck`. All three bites are disposable and restored byte-for-byte. Native16 includes the prior durability/failure checks, indexed cursor checks and an actual Worker/D1/P1 HTTP two-operation account interpreted inside real Chromium/WebCrypto. Existing312 composed regression stays green. The first implementation passed54; additions for WAITING/renewal/second-device/marker tampering and the coherent signed gap bring the final count to59. No failed semantic vector was removed or weakened.

Mandatory `capture-publication-gates-2026-09-09T07-53-19-126Z`: preparation/private verdict/public pins, frozen paths and actual18-file ZIP, conformance, selftest, strict with measured clock unset, diff all native0. Conformance uses explicit engine paths/client directory, fixed2026-09-03 and America/New_York. Exact lines:

```
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
DIFF-CHECK PASS
```

The strict tail is its existing wording, not release approval; new-PWA packaging/final evidence remains pending. Parent407 independently ACCEPTED134, reproduced11/312/native11/bite and26 additional checks; one namespace check was explicitly source-anchored, not executed. Archive6,984bytes SHA05564c51db2c531e48c4cce6ee490659e7c78dec974acb45e11fe3bf9a82c5b0 ATTACHED, not locally received/rehashed/replayed. Parent407 CI terminal7SUCCESS/3SKIP both OS; neither its review nor CI covers this successor.

SEAMS/UNSURE: the actual finite transport/live negative-ingress controller, final current-source/local-generation fence, local-original/outbox reconciliation and atomic activation are still owed. This validator interprets snapshot truth, not current standing/safety. Frame-format2 integration/cleanup, original96MiB/default-runtime/CPU resource workloads, CLOCK/key recovery, accurate private port/rollback, integrator and Joe/Dad phone gates remain. Lease ordinal/origin validation uses repeated indexed passes (potential quadratic lease-history cost); no performance/resource acceptance is claimed. Metadata/device keys and the bounded original request remain in memory; full history does not. `RECOVERY-STAGING.md` maps the old conditions to the new reads. No product-rule judgement was silently changed.

NEXT: connect finite actual recovery transport and live negative ingress to this indexed interpretation, reconcile local originals and final source/current-generation fences, then execute original resource/activation gates. Continue the actual qualified Start → multiple Sets → leave/reopen/resume SAME session → normal Finish → corrected history → next-prescription journey; no first-use claim from profile validation alone.

## Inactive encrypted recovery staging — successor to914b79c, 2026-09-09

This increment connects the independently reviewed R1 rows-v3 codec at734986a688366293349145e6feb80fd4130d3702 to the actual W6 `openRepository().recovery(...)` boundary. It stores verified original pages and encrypted row indexes in the existing version1 database, with one transaction per page/index/head and a final context guard. Active/previous generations and the unsynced outbox remain untouched. It implements inactive inventory storage, not complete semantic recovery, active-generation switching or qualified workout resume. The approved PRODUCT-GOALv3 and M4 briefv0.41 remain unchanged; this supports accurate port/recovery on the first-use path.

`RECOVERY-STAGING.md` gives the API and remaining obligations. Pinned public codec dependencies are injected; no authority signing key, private fixture, new key provider, database upgrade, service worker, seeded-soak edit or product-rule change. Row indexes retain base64 IDs to bound control-character expansion and address original values without collecting the complete account. A near-row-limit synthetic NUL-key case proves that representation; it is not a profile-valid account claim. The complete-account test instead uses real Worker/D1/P1 enrolment/admission and real local HTTP. Its whole-history relational comparison is a TEST ORACLE only, never a product staging operation.

Executed from the retained W6 tree with the explicit retained R1 path:

```
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1
11 tests; 11 pass; 0 fail; 0 skipped
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --browser
RECOVERY STAGE NATIVE PASS — 11 checks; actual IndexedDB/P-256/AES-GCM, held transaction, quota abort, context cut, reopen, indexes and untouched active outbox; NOT full profile or phone acceptance
node rebuild/m3/w6/test/run-current-head.cjs ../m3-w5-r1 --all
312 tests; 312 pass; 0 fail; 0 skipped
node rebuild/m3/w6/test/run-recovery-stage.cjs ../m3-w5-r1 --bite
RECOVERY STAGE BITE RED — known standing loss committed when final context guard bypassed; native exit1
RECOVERY STAGE BITE RESTORED PASS — native exit0; SHA256 37d87c2c5bbe8fd97d50b819063a0abb58716cdf8fd164355ad90bc1f76bb78e
```

The browser run uses actual desktop Chrome IndexedDB/WebCrypto and a disposable loopback origin. It holds a transaction to check no early progress, aborts quota failure after a queued page write, changes known standing during the IDB reads before the final write cut, reopens storage, and compares the active generation/outbox unchanged. Final native evidence directory `earned-native-recovery-nsKyvj`; bite `earned-stage-bite-kKffvn`. Focused run6.69s, composed run4.74s; these are test durations, not a whole-app delivery estimate.

Initial composed regression was303/312: nine disposable mutation tests could not import the newly referenced `recovery-stage.mjs`. Their explicit public-source copy inventories now include that dependency; every original mutation/assertion/restoration remains. No frozen suite edit, skipped case or weakened gate. Final312/312 and native11 were rerun after the correction. During focused development, the context guard was placed at the final put cut after IDB slot reads, row indexes changed from raw JSON IDs to base64, and indexed reads gained actual page-signature verification; the published results cover those final bytes.

Mandatory publication gate logs: `capture-publication-gates-2026-09-09T07-31-07-988Z`; preparation, scope/package, conformance, selftest, strict and diff all native exit0. Regenerated private inputs stayed local; their verdict passed and committed public pins remained unchanged. Explicit engine paths, `EARNED_CLIENT_DIR`, `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` were used for conformance; strict ran with `MEASURED_TEST_NOW` unset.

```
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
DIFF-CHECK PASS
```

The strict script's final wording is its existing verdict, not owner-release approval. `SCOPE-FREEZE PENDING` still applies to the new PWA archive, full private suite and final implementation evidence. Independent review/CI for this new W6 increment are not claimed by these local runs. R1 server prerequisite734 independently ACCEPTED133 with39 additional checks and terminal CI7SUCCESS/3SKIP on both OS jobs; its acceptance does not extend to this new storage code. Reviewer archive4345f3e1cb54d8f2b62b8317086bcc8bb0e82c64412ce5dac95ef170b35688c1 is attached, not locally received/rehashed/replayed.

SEAMS: this component does not implement the bounded complete-profile/claims/original-signature validator, finite network controller, live negative-ingress join, final current-active-generation fence/switch or frame-format2 support. The caller must bind current authenticated scope; staged progress is never positive standing. `visit` callbacks are validation inputs, not permission to paint data before the terminal/final-head checks. Superseded inactive attempts remain retained; safe cleanup/capacity is still owed. Original96MiB resource failures remain open and unwaived. Private port/rollback, currentness/CLOCK/key custody, independent integration, full workout journey and Joe/Dad phone gates remain. Nothing was merged or privately activated.

NEXT: complete bounded profile/claim/original-signature validation and finite transport/negative-ingress integration, then original resource and activation checks. Keep the first-use target Start → multiple Sets → leave/reopen/resume the same session → normal Finish → corrected history → qualified next prescription; preserve broader coherent plan scope without gating first use on every future capability.

## Current-head history verification coverage — successor to73b0de9, 2026-09-09

Independent128 **ACCEPT WITH ONE OPEN GATE G-1** reproduced the parent44/309/native32+7+7, both effective bites and51 additional checks. It found no product defect in that increment, but demonstrated that the history-specific currentHead identity exemption had no positive execution or effective mutation coverage. This successor changes only the focused tests, their disposable composition runner and this report; all product bytes remain identical to73b0de9.

Three tests exercise actual `exchangeCurrentHead` signing/verification/durable persistence, then a fresh encrypted repository/client history read. The positive case verifies exact accepted original history with a different current identity key. Two storage-key-only attacks retain the real signed proof but lower the local frontier, then rewrite or remove its operation. Both refuse18/HISTORICAL_PROOF_UNPROVEN without returning history, writing or invoking the producer. Lowering the frontier intentionally bypasses an earlier prefix comparison so these tests reach the currentHead-specific comparison itself.

Executed: `node rebuild/m3/w6/test/run-current-head.cjs ../m3-w5-r1 --workout-history` **47/47 PASS**; `--all` **312/312 PASS, 0 skips**, including unchanged actual historical R1 BASIC HTTP. The runner composes the already-pinned accepted R1 dependency `bec056d6b8f86069c500d958e86f212bd6e5f392`; the old standalone W6 fixture lacks this signer and now fails explicitly instead of skipping or inventing a signer. `--head-history-bite` removes only the currentHead retained-record comparison while keeping the exemption: **47 tests /45 PASS /2 FAIL, native1**, exactly the rewritten/missing-record cases. Disposable earned-w6-current-head-W8ymZv; original/restored public-client SHA256 `817afb4198932d70d567d3d787b1656690ad8a1742c1dc95a078f65941b43ccd`, mutant `b70d8f72ca7e8900f0ef443a178776df5979e544709401e7d9b34b7bd7f83c0e`. The restored exact copy was executed again: **47/47 PASS, native0**. Coordinator logs: workout-current-head-{focused,bite,restored,composed}.log.

Parent native32+7+7 remains source-pinned evidence; no UI/product change warrants repeating it here. Parent exact CI terminal7SUCCESS/3SKIP on both OS jobs is recorded, not rerun as a status check. Mandatory `work/capture-publication-gates-2026-09-09T05-46-16-863Z` all native0: prepared private fixture/golden verdict only, public pins unchanged, FROZEN-PATHS/OLD-PACKAGE18actualZIP PASS, SUITE CONSISTENT99/99/29/70 +rig185W1/W2 PASS, SELFTEST PASS, strict with measured clock unset PASS, DIFF-CHECK PASS. Independent G-1 closure remains pending. Review128 archive18,651bytes SHA256 `379abd172f3942d64529325192ec3fce1cf03fed1ebb0c2d8605456685c87def` is ATTACHED, not locally received/rehashed/replayed.

Review128 observations retained for the next actual join: O1 a rejected intermediate operation can remain a causal ancestry link between edits; this is a recorded semantic question, not authorization to remove a causal edge or silently change history. O2 a removed Set retains its original/last payload, with `included:false` authoritative; consumers must use inclusion and issue status, never treat a nonempty payload alone as performed work. O3 reconcile daily-plan method coordinates when that join is implemented. Full partition/current-safety, qualified resume/producer, schema/issuer/captured recovery, K1/CLOCK/resource/port/scientific/device gates remain open.

NEXT: request one focused independent G-1 verification on this successor; continue the retained coherent-workout integration and the already-requested bounded complete-history recovery contract. No merge, private activation, new dispatch, product rule, funding/model change or broader audit.

## Actual correction history and explicit normal Finish — successor tob60cab3e, 2026-09-09

The same actual prepared host now offers **Finish workout** after the last entry has an acknowledged Set or explicit Skip. Finish calls the existing normal-Close writer only on an explicit click. Pending persistence disables the action and says Saving; only durable acknowledgment says finished. Recorded and skipped entries remain distinct, and neither a Close nor visiting every entry proves the prescription was fully performed. Early Finish is unchanged. This completes the demonstrated within-visit Start → multiple Sets/Skip → normal Finish sequence, not qualified reopen/resume or private use.

The real encrypted `readWorkoutHistory()` now retains every original record and attaches `session.projection`, a deliberately limited nonconcurrent Set-edit projection. A first correction locates its immutable Set through the actual target reference even when the committer emitted no causal parent. Multiple edits apply only when their **explicit causal ancestry** orders every pair; references, device sequence, receipt order and clocks never fabricate causal edges. Whole original fields remain; replacement fields change only their named values; a targeted removal excludes only its named Set. Competing edits, missing/cyclic ancestry, edits after removal, unresolved status and colliding slot records stay explicitly unresolved. Original observations and edit operations are never rewritten. Skips and normal/early Close records remain separate facts. Both continuation and progression eligibility remain false; session/slot partition and current-safety permission are still missing.

Important source reconciliation: the earlier PR46 nonconcurrent **review model** assumes a direct causal target edge. Actual schema/commands permit a first target reference without that edge. No writer/envelope/authority change was made to retrofit the model or past records. This actual projection follows references for identity and existing causal parents for semantic ordering; it does not claim the model's broader fixture coverage or concurrent-resolution policy. The top-level raw-history interpretation remains `original-facts-and-edits-unfolded`; the attached projection names its narrower `nonconcurrent-set-edits-only` interpretation.

Independent126 O1 became material at this join. For this history read, after historical proof verification, the public boundary passes an internal set of **exactly matched signed receipt operations** to the actual T2 staging boundary. Every remaining retained operation must have the configured athlete/device and reproduce its original identity HMAC with the existing trusted client key. A resealed storage generation alone cannot promote substituted capture producer/basis, performed payload or correction fields. Failure returns `LOCAL_HISTORY_IDENTITY_UNPROVEN`/18 before any history is returned; no key is exposed to the helper, public caller or fixture output. Signed older history need not match the current identity key. T2 construction still requires a configured current key; missing or unmatched local identity is a recovery refusal, not a fabricated empty history. No key-epoch registry, new identity contract or production key-recovery implementation was added.

Limits of that repair: it authenticates existing canonical commitment semantics, not new byte-level identity. Canonically equivalent source encodings and the ratified excluded metadata remain outside HMAC differentiation; exact server-signed original comparisons remain. A holder of both storage and identity keys is outside this witness. Producer identity authenticity does not scientifically qualify the producer or prove a current safety/input basis. Structural assembly/projection occurs privately before T2 consumes indexes; no result escapes until the same generation passes all signatures, local HMAC, standing and revision/token checks. This history-specific verification does not silently claim every older read/prepare API was upgraded.

Executed final LF source: **44 focused PASS; 309 composed PASS / 0 skips**, including actual historical R1 BASIC HTTP (not captured-authority recovery). Four actual-committer projection cases cover reference-only first edit, transitive edit chain/removal/unrelated Set, competing edits in both stored insertion orders, and same-slot collision/targeted removal. Seven identity cases cover four independently resealed substitutions, missing/changed local key, and exact signed history with a different current key (plus keyless construction refusing18). Native prepared host: **32 lifecycle/display/history +7 UI +7 observer PASS**; four additional normal-Finish assertions use real controls/committer/IndexedDB and a held transaction, with exact two Sets/one Skip/one normal Close and no producer or duplicate write. Existing panel57+38, native durability/layout and 390/320px/200% text PASS. The producer and observation guard remain synthetic, not qualified personal safety.

Effective disposable bites, with tracked files untouched and each restored44/44/native0:
- `--projection-bite`: ignore actual correction application → **44 tests /42 PASS /2 FAIL**, native1; first correction and chain tests fail. Original/restored `project-history.mjs` SHA256 `e66a4c738867586699fd090dd9cc23ca9d5462a5ca7a7172b35c40ea2a400a87`; mutant `564306cd26072c8e3d55bed20011fbe8b1c68ba9b5b505e8d0891496e24fb908`; disposable earned-w6-current-head-cnsP9f.
- `--local-history-bite`: bypass actual stage identity verification → **44 tests /37 PASS /7 FAIL**, native1; the seven identity tests fail. Final original/restored `t2-stage.cjs` SHA256 `85425ac0f14ff5f8878147f0e53bff690c4a3bf53852d002dca24c97a0bdfdaa`; mutant `345a98b3240a67a8d13b77a4930ae511d19876c633f02e034f915c0dfff467b7`; disposable earned-w6-current-head-xF5VBR.

Public-client SHA256 `817afb4198932d70d567d3d787b1656690ad8a1742c1dc95a078f65941b43ccd`; stored-history `c3e9d78ba9deda6624b1c19b413bb0ec1dd9d7dabdb98028a993cf8a5ed68ff4`; command-panel `129f80a609072f636805f1aef892c4d4d8f6954f78cee1487ef7e27041653300`. Initial keyless signed-history test exposed T2 construction returning generic3; the final declared key-recovery refusal is18, and the positive test supplies a different current key. Initial stage/runner working copies had mixed CRLF; normalized to repository-required LF, then re-executed final composed/native/identity bite/restoration. Earlier stage hash72f3/mutant2659 belong only to pre-normalization evidence, not published pins. Logs at coordinator: workout-projection-identity-{focused,composed-final,native-final}.log, workout-{projection,local-history}-{bite,restored}*.log and workout-finish-panel.log.

Mandatory `work/capture-publication-gates-2026-09-09T05-16-01-264Z`: all native0; private preparation verdict-only/public pins unchanged; FROZEN-PATHS/OLD-PACKAGE18actualZIP PASS; SUITE CONSISTENT99/99/29/70 +rig185W1/W2 PASS; SELFTEST PASS; strict with measured clock unset PASS; DIFF-CHECK PASS. Only LF normalization and this report followed that mandatory run; affected execution was repeated on final LF as above. Roughly45minutes author work across retained continuation, including source reconciliation and focused verification; not an app ETA. No frozen/source/schema/core/law/private/soak or funding/model changes.

Parentb60 and companion PR46c6a independently **ACCEPT126**, bounded raw read and documentary adoption respectively: author33/298/native28, effective33/32/1 plus40 independent checks. Archive13,012bytes SHA256 `5614076b3fcc57f7c5d9fde24f4a1103f148bd0348b8a553428f45a07deab632` ATTACHED, not locally received/rehashed/replayed. Both exact parent CI runs terminal7SUCCESS/3SKIP with both OS jobs observed once. O1 addressed here within the stated scope; O2 index-key observation unchanged; O3 daily-plan contract's old pinned coordinates must be reconciled with actual methods when that separate join is implemented. Parent acceptance does not accept this successor. Prior strict2658/native1, unreviewed3653bb6/075f37c and original Start19/foreign18 coverage remain open as recorded, not erased by these passes.

NEXT: continue the primary coherent workout journey through actual same-session reopen/resume, session/slot partition and current-safety permission, then applicable visible correction and qualified next prescription. Within-visit normal Finish is implemented here; normal Finish after a qualified resumed session is not yet demonstrated. The retained BRIEFv0.41/full goal remain the queue; no new framework or audit. Full legacy/rich-fact mapping, captured authority/schema/issuer recovery, bounded R1 complete-history paging/resource fit, scientific prescription qualification, accurate private port/rollback/custody, independent integration and both-phone checks still gate private use. Publish this compatible correction/Finish/identity cut together for one scoped independent review; no merge or private activation.

## Stored workout recovery join — successor toc77b216d, 2026-09-09

The next real-workout prerequisite is recovering original facts after reopening, before choosing an active session or granting continuation. `readWorkoutHistory()` now runs on the actual public client/serialized observation boundary and encrypted repository. It privately assembles original captured Starts and their exact Set/correction/tombstone/Skip/Close records, then verifies the SAME generation's historical signatures and standing through existing `stageVerified`. A second authenticated load and observation check refuse a changed revision/token/context. It never invokes the producer, builds an operation, drains an outbox or writes. No caller-supplied athlete or history is accepted. The new `stored-history.mjs` is a private assembly dependency, not a public verifier or permission source.

Read result: `{read:true,source_revision,history:{frontier,sessions,interpretation,continuation}}`. Every session retains its original Start, optional original capture and exact related records. Status distinguishes signed accepted-through-frontier records from locally stored outbox records, rejected records and unresolved status. Accepted status requires the contiguous actual T2 receipt index to match retained signed pull/snapshot/current-head receipt operations exactly. Index values alone are insufficient. Foreign/missing references and invalid shape/index/proof refuse rather than return an empty first-use view. Legacy formats return the named mapping requirement; missing legacy instructions are not regenerated from today's plan. Returned copies cannot mutate retained data.

**Not a successful resume milestone:** `interpretation` is explicitly `original-facts-and-edits-unfolded`; edits are retained separately, never arrival-sorted into a claimed corrected result. The result does not choose the active workout, infer liveness/partitions, prove a fresh complete authority head, qualify the original prescription or provide current-safety permission. `continuation.allowed` is false. No new UI exposes this as a resumable workout. The next join must use the qualified correction/partition/current-safety projection to continue the same host, support normal Finish and a visible applicable correction. This is the actual encrypted-read prerequisite for that whole journey, not an alternate logger or new release gate.

Executed: **33 focused PASS; 298 composed PASS / 0 skips**, including the existing actual W6→historical R1 BASIC HTTP path (not captured-authority recovery). Six new focused cases use real committer/encrypted generations: fresh-client original Set/edit/Skip/Close recovery, signed accepted-prefix versus local pending status, invented unsigned receipt refusal, standing lost during staging, interleaved durable revision refusal, malformed-index integrity refusal. The original Set remains separate from its correction; no fold correctness is claimed. Actual native browser: **28 lifecycle/display/history checks**, existing7 UI checks and7 controlled observer checks PASS; fresh native repository/client returns exact original capture and logged performed load without producer/write or resume permission. Added `[320,32]` to the actual prepared layout loop per independent124 O1; existing widths/large-text remain. O2's documented DOM/order tie is unchanged and remains covered at the existing insertion point.

Effective disposable `--stored-history-bite` trusts a fabricated receipt index as though signed: **33 tests / 32 PASS / 1 FAIL**, native1, exactly `invented stored receipt/frontier cannot promote an unsigned operation to accepted history`. Final original/restored stored-history SHA256 `b525a7e4920a155a489018c9f50c8c551ef45400fa2d893ce9e83cbb8bb9318d`; mutant `b8f781329b358e32eb4527da1e66e13b4378dcc8ae2436506b9dc69e4821b381`; disposable earned-w6-current-head-9cFQ1d. Restored33/33native0, tracked source untouched. Earlier31/296 runs preceded the last two cases. A new malformed-index case exposed a real wrong refusal (state3 from T2 consuming null instead of integrity18); private structural assembly now precedes T2 consumption, with historical authentication still mandatory before any result. This RED/native1 was repaired, not waived. Final public-client SHA `8f205bb471e28fe974f6fa074f89bab48f269710050d9bf23acb0582f03f5149`.

Mandatory `work/capture-publication-gates-2026-09-09T04-42-56-696Z`: allnative0; private preparation verdict-only/public pins unchanged; FROZEN-PATHS/OLD-PACKAGE18actualZIP PASS; SUITE CONSISTENT99/99/29/70 +rig185W1/W2 PASS; SELFTEST PASS; strict with measured clock unset PASS; DIFF-CHECK PASS. Logs at coordinator: stored-workout-history.log, stored-history-{composed-final,native-final,bite-final,restored}.log. Roughly30minutes author source/join/test work plus the bounded brief adoption; not a delivery-date estimate.

Parentc77 independently **ACCEPT124**:12 own attacks+3 gap-fill checks, author27+7UI+7observer and57+38/native/layout re-executed. Archive11173bytes SHA `15759a421e15521407c6a355a8eeb7c90c49d09f4e45a2702ec768f3f234fcdd` ATTACHED, not locally received/rehashed/replayed. Exactc77 CI7SUCCESS/3SKIP bothOS observed terminal once. This successor needs its scoped review/CI; parent approval does not approve the read API.

NEXT: one primary retained integration task—original/current-safe prescription → Start/multiple Sets → same-session reopen/resume → normal Finish → accurate corrected history → qualified next prescription. PR46c6a878f/BRIEFv0.41 adopts CURRENT-PRODUCT-DECISIONS revision2 and the released proposed daily-plan contract without expanding scope or infrastructure. The exact next workout blockers are the actual correction/partition/liveness fold and current-safety continuation, plus applicable schema/issuer/captured recovery where required. R1 full recovery resource FAIL/history fit remains first-use blocking; next is the bounded complete-history paging/materialization contract, not more heap variants. All scientific, private import/rollback/custody, independent integration and Joe/Dad phone gates remain. No model/funding/schedule/new-review-lane changes.

## Exact active-set instructions — successor to20e1ac30, 2026-09-09

The real prepared host now displays the selected slot's original weight, repetitions and effort immediately above a separate **What you did** entry. A trusted synchronous `onActiveSlotChange` observer receives only a fresh frozen copy of logical slot, lineage, index and count. The host binds both identities to its immutable original capture; it never parses display/source JSON into prescription operands, regenerates the producer, prefills performed fields or writes on navigation. Notification occurs on initial valid mount and explicit permitted Next only. Failed/pending saves cannot advance; an observer exception disables further commands with a named instruction-display error. Disposal prevents later notification. Current safety, qualified prescriptions and resume remain separate obligations.

An entry-position strip, original-target typography and performed-entry heading carry the approved active-workout hierarchy into the actual component. The strip names global **entries**, not an invented per-exercise grouping or completion claim. Unknown/not-prescribed/bounded-effort text remains explicit. Removed the two obsolete skip/close flex-order declarations flagged by independent review122. No operation, clock, storage, signature, guard or privacy boundary changed: public-client SHA remains `ac234a29150d70c8368f3d7f064f008c0b49094b4643247a90d2a4c1cc751893`.

RED-first: the added actual prepared-browser case failed on20e with `Prepared panel check: current instructions select exact first slot, not the entire workout` (native1). Final actual browser output:
```
UI DISCLOSURES PASS — 7 native presentation checks; keyboard, correction focus, saved-only feedback and blank performed fields
ACTIVE SLOT PASS — 5 actual prepared-display checks + 7 controlled observer checks; exact slot identity, frozen original values, no prefill/write, blocked advancement and failed-display refusal
PREPARED PANEL PASS — 27 native lifecycle/display checks plus keyboard original-instructions disclosure; actual prepared Start/Set/next, held IndexedDB/no early Saved, original capture, lost-reply reconciliation, disposal/standing, encrypted reopen and fresh-client duplicate refusal; synthetic producer/guard, not phone/qualified prescription
```
Existing panel57+38, actual delayed/quota Set/Skip/earlyClose, encrypted reopen and 390/320px/200%text checks PASS. Prepared-host checks additionally assert actual original-target-before-entry layout/no overflow/current entry at390/320px and200%text. Synthetic same-lineage slots with different loads, later producer mutation, absent targets, no early Saved and no extra producer/write are exercised. Observer tests separately prove frozen primitive-only identity, external-selection mutation isolation, unstarted/pending/failed advancement refusal, observer-error refusal and disposal. Harness corrections disclosed: initial expected count remained22 after adding cases (actual26); new observer probe initially imported `/retained-w6.js` rather than this rig's actual `/app.js`. Both corrected; neither counted as a product failure or PASS.

Root visually inspected the approved `design-refinement/Refinement-Workout.png` and actual compiled active prepared host, then generated a local side-by-side at390CSSpx each (`outputs/active-slot-comparison/comparison.{html,png}` at coordinator; actual images/evidence in ignored `.tmp/prepared-panel`). This is partial fidelity, not a redesign or full P3 acceptance. Actual controls remain blank because they record performed facts; optional/unrecorded/unknown/skipped effort stays intact. Source-bound original targets now exist; qualified previous performance, current-safe targets, exercise/context grouping/navigation, rest, Undo and full resume still require their actual interfaces. No placeholder personal target/history or mock value was added. The hostile-text/unknown-value fixture deliberately remains a synthetic engineering fixture, not the owner's app or a qualified plan.

Parent20e independently **ACCEPT122**: reviewer11 integrity and9UI attacks,27focused/292composed/0skips, effective27/25/2receipt bite and native browser checks. Attribution corrected: earlier close-rejection test exercised state3; Start-state19/foreign-state18 remain untested by those original tracked cases. O1receipt-index branch inert on real stored indexes is acknowledged; the new signed-proof comparison is operative. Archive12640bytes SHA `d526f05bd557a8155d9ee9a093128253c55eb245fb6bdb39aa4fcecd6f905860` ATTACHED, not locally received/rehashed/replayed. Parent CI7SUCCESS/3SKIP bothOS already observed, not rerun. This successor needs its own scoped review/CI; no full-app acceptance inherited.

Mandatory `work/capture-publication-gates-2026-09-09T04-22-44-666Z` allnative0: private preparation verdict-only/public pins unchanged; FROZEN-PATHS and OLD-PACKAGE18actualZIP PASS; SUITE CONSISTENT99/99/29/70 plusrig185W1/W2 PASS; SELFTEST PASS; strict with measured clock unset PASS; DIFF-CHECK PASS. Approximately20minutes of author implementation, source comparison and validation, excluding independent review; not an app delivery estimate. No redundant292composed run for display-only changes with public-client unchanged. NEXT: independent active-slot delta review; actual active-workout/history reconstruction, current-safety continuation, normal Finish/corrections; adopt the separately owned daily-plan contract into existing PR46 only after APM handoff. Full approved product goal, scientific/producer, authority/resource/history fit, private port, independent integration and both-phone gates remain unchanged.

## Approved-direction UI integration — successor to2ba4893, 2026-09-09

Adopted only UI-INTEGRATION-01 presentation hunks onto actual2ba4893da2c006c40c7364571c825f740b9c64a0, not the helper's old ffb source wholesale. Patch SHA256 `72639d07018348e2b45bd4faec576189a2cfb4b32710ce49414caa533385c8ab` rechecked before apply. Command panel exactly matches helper SHA `8388625c126f563d3b69b3d6c6f682e9e8087a87bfac0d24e83d908846606fd9`; prepared host SHA `c1d2a4ef46c99f99a902cc93024a548fcc4e8135946ba6757923295acdc996d8` retains the successor's state19 and retained-history refusal branches. Public-client remains exactly `ac234a29150d70c8368f3d7f064f008c0b49094b4643247a90d2a4c1cc751893`, including the signed-receipt comparison. No logic rollback or discarded concurrent changes.

After an acknowledged Start its form retires from view; pending/unknown Start stays visible. Performed inputs and primary action move higher, Workout options/visit readback/original instructions use native disclosures, and the last acknowledged non-Start event remains visible. Typing cannot change that saved-only summary. Existing invalid Skip/early-Close opens and focuses the relevant real control. Immutable original instructions, unknown/not-prescribed meanings, blank performed fields, optional effort encodings, actual payloads and saved/unknown/disposal behavior remain. This is a partial synthetic engineering screen approaching approved Refinement A/additionsC, not a newly approved mock, finished paid-app UI, personal prescription, normal Finish or resume. Current-slot target display still needs the exact read-only active-slot identity seam; previous performance/rest/Undo need their actual qualified interfaces. Do not fill them with fixtures in the owner flow.

Root executed actual integrated successor: original57 controlled plus38 extension checks PASS; native delayed/quota Set/Skip/earlyClose and exact encrypted reopen PASS; prepared22 lifecycle plus keyboard original disclosure PASS; **UI DISCLOSURES PASS — 7 native presentation checks** (acknowledged Start hidden, saved-only last fact, two default-collapsed keyboard disclosures, unsaved typing distinction, Skip/Close correction focus). Root inspected actual390px screenshot and ran actual390/320px and **200% text** fit/44px controls/status checks PASS. This exceeds the helper's explicitly175% test without relabeling its evidence. The native extension now clicks the real Workout-options summary before selecting Skip; layout inventory adds summary controls. Existing command/durability assertions remain. Logs ui-integration-current-{prepared,panel}.log; screenshots/evidence remain gitignored .tmp. Root used the frontend-design skill's explicit-reference direction; no redesign or new assets/network fonts.

The combined review will cover the small2ba signed-fact integrity repair above its accepted722 parent plus these presentation hunks; no separate UI review campaign. Parent722 ACCEPT120 and exact CI remain scoped;2ba has author27/292/native22 and effective27/25/2 receipt bite, not yet independent acceptance. The present UI does not change that client source; no redundant composed rerun for presentation-only changes. Mandatory `work/capture-publication-gates-2026-09-09T04-04-29-395Z` allnative0: private preparation verdict-only/publicpins, frozen18actualZIP, SUITE CONSISTENT99/99/29/70+rig185W1/W2, SELFTEST, strictclockunset anddiff. Root adoption/affected validation approximately10minutes; helper time is separate. Successor CI/independent review pending. All first-use correctness/data/private/device gates remain.

NEXT: independently review the combined affected successor; continue exact active-slot display and authenticated active-workout/history reconstruction/current-safety continuation, normal Finish/corrections. The separately owned macro-plan contract remains a prerequisite to actual full daily-plan display, not a new policy choice or instruction to calculate missing values.

## Retained signed fact must still exist — successor to72202d04, 2026-09-09

Parent72202d04a8af0d01c8f80ed5db7f0027f473642d independently ACCEPTED120 (bounded): reviewer reproduced25 focused/22 native/290 composed, effective25/19/6 bite,12 guard attacks plus3 state-mapping checks. Exact CI7SUCCESS/3SKIP bothOS. Its H2 fresh-client duplicate is closed for the demonstrated single-install path. Archive11,310 bytes SHA256 `16f2268cbb708a66e43b9b3407053adc24696e7f2ad16bba6c0dbee58e209275` ATTACHED, not locally received/rehashed/replayed. Attribution correction: reviewer said the guard18/19 branches were author-covered; the tracked test reached rejected CLOSE/state3, not both those branches. Do not inherit that broader coverage claim. Other-device/new-install and legacy release/resume remain expressly incomplete.

Resume source tracing found a new integrity gap. Actual `client/sync.cjs` stores receipts as an index with op_id/commitment, not an embedded receipt.op; original signed pulls/snapshots live separately in metadata. The prior receipt-only test used an explicitly richer synthetic input and was not proof of that actual index representation. Through the actual P-256 signed pull, T2 sink and encrypted repository, a synthetic generation with the acknowledged operation missing but counts adjusted still allowed preparation on722: **RED native1**, expected no preparation but receivedtrue (`workout-receipt-index-red.log`). This demonstrates incomplete cross-record validation, not breaking AES-GCM, an observed owner-data loss or a permitted product deletion.

`verifiedHistory` now checks that every receipt in a retained signed pull/snapshot has an exactly equal original operation in the authenticated operation collection, using existing sameRecordedValue. Missing or rewritten truth gives existing HISTORICAL_PROOF_UNPROVEN/state18 before producer or command. Signature/domain/identity/NFC contracts and raw original bytes remain unchanged. This comparison does not create currentness, standing, an active-session reducer or complete history coverage; signed current-head and remaining recovery/knowledge gates retain their separate contracts. No original T2/writer/schema/authority/law modification.

Actual missing and rewritten-operation cases both use real signed pull acceptance and verify the persisted index has no .op before altering the isolated authenticated synthetic generation. Final focused27/27, composed292/292/0skips (historicalR1 BASIC HTTP), native prepared-panel22 lifecycle+keyboard PASS. First291-case run preceded the added rewritten case; not relabeled292. Disposable --receipt-bite removes only the retained-operation comparison: **27 tests / 25 PASS / 2 FAIL / 0 skips**, native1, exactly the missing/rewritten cases. Original/restored public-client SHA256 `ac234a29150d70c8368f3d7f064f008c0b49094b4643247a90d2a4c1cc751893`; mutant `68f2699fcb810b6ae1c724fe136c7f92d1415cd07140df65acb519983622dd76`; disposable earned-w6-current-head-5r0UxV, tracked source untouched, restored27PASS/native0. Logs: workout-receipt-index-{red,composed,composed-final,native,bite,restored}.log at coordinator. No owner values or keys are logged/committed.

Mandatory publication `work/capture-publication-gates-2026-09-09T03-58-08-063Z` allnative0: private prep verdict-only/public pins unchanged; FROZEN-PATHS/OLD-PACKAGE18actualZIP PASS; SUITE CONSISTENT99/99/29/70 plusrig185W1/W2 PASS; SELFTEST PASS; strict with measured clock unset PASS; diff PASS. Approximately10 minutes of focused source tracing/author repair and validation, not full-app build time. Successor CI/review pending at publication.

NEXT: focused independent comparison review, then actual active-workout/history reconstruction and current-safety continuation on the same host; approved UI scratch remains separately owned and must preserve this successor. No new personal prescription or complete resume claim. Full goal, history-fit/resource FAIL, K1/CLOCK, issuer, private port/integration and both-phone gates remain.

## Reload duplicate-Start refusal — successor to ffb420cd, 2026-09-09

Parent ffb420cd3950468b5bdeb09c5fdacfff4ada3cfb received independent ACCEPT (bounded), Message118: 18 focused / 20 native browser lifecycle / 283 composed, effective 283/282/1 lifetime bite, nine durable plus nine DOM attacks. Its exact CI finished 7 SUCCESS / 3 SKIP on Windows and Linux. Review archive 13,033 bytes, SHA256 `8f87136963914ebdf0e358516713b75e08ae6b0c763b0294d65732fd83d13237`, ATTACHED, not locally received/rehashed/replayed. That acceptance does not extend to this successor.

The review's H2 exposed an actual remaining path: a fresh client over the same repository could prepare and commit another Start while the original Start's reply was unresolved. The new regression reproduced on the parent (native exit1, expected no preparation but received true; `workout-cross-instance-red.log`). The client now reads the authenticated retained workout facts before invoking a new producer. An unclosed Start requires history reconciliation, including after client/repository recreation; the existing revision AND token CAS carries that generation through the final Start transaction. Two instances that prepared together still produce only one durable Start. No new persistent marker, operation, sequence, identity, schema, clock or consent rule is introduced.

For the supported same-device schema2 path, only a shape-valid, non-rejected close naming that exact Start at a later device sequence releases it. Another workout's close does not clear it. A rejected Start refuses19; foreign-athlete stored Start refuses18. Legacy/other-device/receipt-only or conflicting receipt history conservatively needs the separately qualified history projection, without calling missing legacy capture corruption. This is a negative duplicate-prevention guard, NOT full active-workout reconstruction or a qualified cross-device/legacy resume implementation. It supplies no permission to execute historical prescriptions. Unresolved stored truth, standing, current safety, corrections, normal Finish, manifest/issuer and K1/CLOCK remain their existing gates. Users are not instructed to reload to clear a fence.

Executed: focused 25/25, zero skips; actual historical-R1 BASIC HTTP composition 290/290, zero skips; real Chromium prepared-panel 22 lifecycle checks plus keyboard disclosure PASS, including new client/new repository mount, named recovery/no Start controls, unchanged encrypted generation and no producer rerun. The first extended browser run completed the 22 checks but failed its old hardcoded total of20; corrected harness total, then native exit0. This is disclosed harness bookkeeping, not a passed first run or product defect. Screenshots remain partial synthetic engineering surfaces, not the approved finished design or phone acceptance.

One disposable `--history-bite` removes only the retained-history guard: **25 tests / 19 PASS / 6 FAIL / 0 skips**, native1. The first failing line is `fresh client cannot create another prepared Start over an unresolved durable workout`; other failures cover confirmed reload, rejected close, another-workout close, post-race preparation and receipt-only history. The race's one-durable-Start CAS assertion itself still passes; the later new-preparation assertion fails. Disposable path `earned-w6-current-head-pB8Jz4`; original/restored public-client SHA256 `d5edfaacbc7bc9286fe6e49632dbf4694e771226a5fd0221251a1b411e444fc2`, mutant `25c2027dea746a85081755034e61002d84ad2fc4ffa56862871367959dff2834`. Tracked source never mutated. Restored focused run25/25/native0. Logs at coordinator: workout-cross-instance-{red,focused,composed,bite,restored,native,native-restored}.log.

Mandatory publication gates in `work/capture-publication-gates-2026-09-09T03-44-21-645Z`: all native0; local private preparation verdict-only/public pins unchanged; FROZEN-PATHS PASS; OLD-PACKAGE PASS18 actual ZIP; SUITE CONSISTENT99 reference GREEN/99 STRONG/29 RED-first/70 present GREEN, rig185W1/W2 PASS; SELFTEST PASS; strict with MEASURED_TEST_NOW unset PASS; DIFF-CHECK PASS. Old-app strict permission is not new-app/private-release permission. Focused implementation/author validation approximately15 minutes, not an estimate of completed first use; successor independent review and CI still pending at publication.

NEXT: independently review this narrow successor; then implement authenticated active-workout/history reconstruction and current-safety-aware continuation on the same host. Approved Refinement A plus additionsC remains the UI direction; a separately owned scratch presenter must preserve this successor's refusal paths. Complete normal Finish/corrections and qualified prescriptions remain first-use work. Resource FAIL, private port/integration and both-phone gates are not waived.

## Prepared instructions joined to the actual workout screen — successor to70d4371e, 2026-09-09

`mountPreparedWorkoutPanel(root,{client,plannedSplitSlotId})` now wraps the SAME command panel with the actual accepted prepareWorkout/startPreparedWorkout API. It requires a dedicated statically configured client; prepares once; renders a separate immutable copy of the original instructions; derives ordered slot/lineage/label selection from that copy; and starts only through the private preparedId. Performed fields remain blank, independent of prescribed values. The session instruction stays visible and the full original prescription is keyboard-expandable. Its caption changes from not-yet-saved only after actual durable acknowledgment. No caller-provided capture or separate operation is introduced. Further Sets/Skip/early Close use the same actual client and acknowledged Start. All producer/observation fixtures remain synthetic and unissued.

Disposal retires preparations, removes the old screen and suppresses late paint without canceling an already permitted transaction. A same-client remount after any issued Start refuses until the outer host reconciles active/saved history; constructing another client is **not** that reconciliation. This implements a conservative component lifetime boundary, not full remount/restart recovery. One uncertain Start reply triggers exactly one same-handle authenticated disk reconciliation; unresolved outcomes show recovery, never a blind new Start. Retired ready/committed entries are removed from the map; an in-flight/uncertain operation's existing private fence survives separately.

Two actual published-local-join limitations were witnessed RED while connecting the host, then repaired here. A preparation already queued before retirement could adopt the later lifetime when its queue slot began; lifetime is now captured at public invocation and checked before work and before returning a handle. A commit whose reply was lost lacked an explicit unknown-outcome marker and inherited “not saved” copy; captured Start now reports outcomeUnknown and confirmation uncertainty, including unresolved retries. These are implementation repairs, not changes to lease/consent/prescription rules. Original RED logs `prepared-host-retirement-red.log` and `prepared-host-outcome-red.log` remain at the coordinator root. The latter exits1; the former's failing test was displayed by a shell whose final Get-Content exited0, not a GREEN test.

Executed:18 focused actual T2/P256/AES-GCM tests PASS; final actual historicalR1bec/currentW6 composition **283/283 PASS, zero skips**, with BASIC-profile real HTTP regression and unchanged original vectors. Native baseline5/5 and56vectors passed before the final copy/accessibility-only edits; final original browser-panel57+38, delayed/quota/reopen and390/320/200% layout checks PASS. New tracked `browser-prepared-panel.mjs`: **PREPARED PANEL PASS —20 native lifecycle checks plus keyboard original-instructions disclosure**, actual prepared Start/Set/Next, held native IndexedDB/no early Saved, exact original capture despite later producer mutation, one lost-reply disk recovery with one write, disposal after permission, named standing refusal and encrypted reopen. Root inspected the actual390px screenshot. First new browser harness runs incorrectly looked for `kind:set`, then read fields outside `payload`; both failed, corrected to the existing `session-set`/payload contract, product unchanged for those failures. Earlier19-case PASS remains separate from final20-case evidence.

Effective disposable `--all --host-bite`: move queued preparation lifetime capture to execution time. **RED native1,283/282/1**, exactly `retirement also invalidates a preparation queued before disposal`. Temp `earned-w6-current-head-wpIo8E`; actual original/restored public-client SHA256 `f0ac937c93b1c42d8c15a32458907d940c9645536d108febdd0c534f0279c9ae`, then18/18 restored PASS native0. Tracked source never mutated by the bite. Logs: `prepared-host-composed-final.log`, `prepared-host-native-20.log`, `prepared-host-panel-final.log`, `prepared-host-bite-final.log`, `prepared-host-restored.log`. New host SHA256 `6360d0e24d848ed8acbf7d6fedb854a663f303b5571867777edddcfce4ba75f5`. No private input or keys in this report or tracked evidence.

Parent70d4371e independently **ACCEPTED (bounded), Opus116**, exact source-only residual/11classes confirmed;57+38/native layout/durability and four keyboard/focus/status checks. Archive9563bytes SHA256 `f0c8afeb7cc8a0a560efb9b46df39400b2adc62ee6d11c8b16715fb4c61dddc1` ATTACHED, not locally received/rehashed/replayed. Its two non-blocking observations are repaired in this functional join: enabled input borders return to #6F6759; DOM reading order now matches progress/Start/entry/status/Next/Skip/Close/readback/disclosure visual order. This changes structure/copy, so the new delta is not labeled CSS-only. Actual Next is exercised by both retained extension and new native host tests.

Mandatory publication `capture-publication-gates-2026-09-09T03-17-54-178Z`: all native0, private preparation verdict-only/public pins unchanged; FROZEN-PATHS PASS; OLD-PACKAGE PASS18 actual ZIP files; `SUITE CONSISTENT —99 reference GREEN ·99 STRONG ·29 RED-first against absent families ·70 GREEN against present families`; rig185 W1 PASS/W2 PASS; SELFTEST PASS; strict clock unset `All checks passed. Safe to ship.`; DIFF-CHECK PASS. That old-app strict tail is not new-app release approval. Independent acceptance of this successor and new-head CI remain pending. No source-delta waiver, schema/core/crypto/engine rule, original conformance, private input, frozen app, dependency/lockfile or seeded-soak change. New native checks use synthetic guard/producer and unissued schema2, not K1, scientific or phone qualification. Actual personal producer/semantic basis, full manifest/issuer/captured authority/recovery, history fit/resource FAIL, corrected history, normal Finish/resume, private port and Joe/Dad device gates remain open.

NEXT: independent affected host/lifecycle review, then the qualified producer/basis and selected captured authority/recovery join; keep same-screen complete logging/normal Finish/corrected history/resume on the first-use path. P1–P6 and the broader coordinated training/nutrition/recovery/lifestyle/phases goal remain in retained M4v0.39; early safety/macro-plan contracts retain their explicit dependencies. This concrete connection is not a personal prescription or usable-private-release verdict.

## Approved workout presentation adopted — successor to b37366bb, 2026-09-09

Adopts APM's completed WORKOUT-PANEL-03 into the existing real command panel: warm paper/ink/green, serif heading with local fallbacks, aligned performed-weight/repetition fields, responsive controls and clearer primary/secondary action hierarchy. Exact candidate SHA256 `3d31a5ea4281cc1572bf05c62ca29c6adfbd1d0216c57b8e18b5cc8799d7c6eb`. Only scoped CSS and eleven class assignments differ from the accepted panel; after removing those two regions and normalizing line endings, all other source is identical. No command, choice, default, validation, acknowledgment, handler or disposal behavior changes. No font download or network dependency was added.

Root executed the actual compiled browser panel, preserving all existing assertions: `PANEL DOM PASS — 57 focused checks`; `PANEL EXTENSION DOM PASS — 38 focused checks`; native delayed/quota Start/Set/Skip/early-Close and exact encrypted reopen passed. Added tracked layout assertions to that same native run: `PANEL PRESENTATION PASS — actual compiled durable panel at390/320px and200% text; no horizontal overflow, >=44px controls, scaled inputs and status preserved`. Root log `panel03-native.log`; actual screenshots and source-pinned evidence are in the gitignored `w6/.tmp/panel/`. Root inspected390px and320px/200% screenshots. Large text creates long vertical scrolling and native selected-option text may elide; full native options remain available. These are desktop Chromium checks, not iPhone/VoiceOver acceptance. Helper controlled/render evidence remains separately scoped to its scratch candidate.

Parent b37366bb independently **ACCEPTED (bounded), Opus Message114**: reviewer executed17 focused,10 native browser assertions,282 composed/zero skips and the intended282/281/1 disposable-token bite/restoration. Its additional source-amendment challenges8/8 plus T8b and19 integration attacks passed. Archive15125bytes SHA256 `754c0cd5c1df3af64815956cf0633ed1eee998b72929a317508a591f5c9bc82e` is ATTACHED, not locally received/rehashed/replayed. Non-blocking observations retained: shape self-equality does not prove semantic producer/basis qualification; retired preparation entries need pruning at disposal; last-wins unresolved assignment is latent while only one operation can reach those phases. Parent b373CI terminal7 SUCCESS/3 SKIP, both OS jobs. Owner-placement PR46v0.39/8a973ed5CI also terminal7 SUCCESS/3 SKIP, both OS jobs; canonical goal/P1–P6 unchanged.

Mandatory publication `capture-publication-gates-2026-09-09T03-02-50-502Z`: all native0. Private preparation verdict-only/public pins unchanged; FROZEN-PATHS PASS; OLD-PACKAGE PASS18 actual ZIP files; `SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`; rig185 W1 PASS/W2 PASS; SELFTEST PASS; strict with MEASURED_TEST_NOW unset ends `All checks passed. Safe to ship.`; DIFF-CHECK PASS. The legacy strict tail is not new-app release permission. No unchanged memory/science workload was rerun for this visual adoption.

This presentation adoption still uses the basic synthetic command path. It does not join the panel to prepareWorkout/startPreparedWorkout, qualify a real producer, issue the captured authority profile, implement normal Finish/corrections/resume, or deliver an installed app. Existing synthetic disclosures remain. Private data, frozen app, original conformance, seeded soak and resource FAIL remain untouched. New-head CI and this delta's independent acceptance remain pending; parent acceptance does not cover these changed bytes.

NEXT: publish this bounded actual-component adoption; join the same panel/host to accepted prepared Start with truthful pending/unknown-outcome/disposal behavior, then the qualified producer/basis and captured authority/recovery dependencies. Preserve early recovery/macro-plan contract work and broader coherent product goal in the existing M4 scope, without inventing physiology constants or adding a second app.

## Prepared original prescription → actual durable Start — successor to9563a918, 2026-09-09

### What / why and scope
Base `9563a918d6db5097ac9ae87a79f90923d24e15eb` received independent Opus112 ACCEPT for the capture validator/copy component only: 61 focused tests, 7 native browser checks, effective/restored freeze bite and 18 reviewer attacks. Archive13343bytes SHA256 `038a6bd567175d45d9855605d980097cdcaabdea38ff435675ff369bfff9f466` is attached, not locally received/rehashed/replayed. Its observations remain: Proxy traps are not getters, trusted-parser failure is flattened into a typed invalid-capture error, and a disposable-copy bite is preferable to mutating the tracked file. This successor uses a disposable-copy bite.

Connect the published `prepareWorkout({planned_split_slot_id})` and `startPreparedWorkout({preparedId,effective?})` methods to the existing verified public client, real T2 mapper/builder and encrypted repository. Static `workoutProducer`, `workoutProducerIdentity`, `resolveWorkoutBasis` and `prescriptionCapture` are mandatory together for this selected path. The resolver returns plan/input basis and explicit causal parents from the loaded generation; the host supplies the actual source revision. This wiring does not qualify those supplied functions as an athlete's prescription producer. Current fixtures are deliberately synthetic, not the ratified individual engine projection.

Preparation uses the existing verified staging/read path and current context, copies/freeze-validates the producer result before any operation is built, retains the exact snapshot revision **and token**, and returns a separate view plus a random instance-local handle. The renderer cannot replace the capture, producer, basis or parents. A final validator checks the actual one-Start batch, capture bytes, basis, scope and earlier token before the existing repository's own transaction-token check. Same revision alone is insufficient: the earlier preview and the later commit are different cuts. New context `snapshotToken` is private to the trusted commit validator, not a UI field.

The selected unissued schema-2 mapper/shape accepts a mandatory inline capture only when statically configured; the existing basic default stays unchanged. `createT2Stage` accepts the corresponding static selected commands. No schema1, canonical/HMAC, operation identity, payload{} or authority core semantic change. Captured Start uses ONE actual builder/batch/generation/outbox commit. The final public boundary detects captured Start in the actual batch even if installation mistakenly omits the preparation configuration; a raw caller cannot turn that omission into authorization. Existing causal-parent/relationship checks remain; complete manifest registration and the authority's semantic basis qualification are not implemented here.

The same handle serializes duplicate clicks and never regenerates its prescription. Stale preparation refuses3 unless an existing higher-priority context refusal applies. Definite atomic abort permits retry while the source still matches. A lost reply locks new preparation until that exact operation is reconciled from authenticated local storage; no second operation is built. `retireWorkoutPreparations()` invalidates these local handles, including preparation awaiting verification. Retirement before the final guard refuses; retirement after durable permission does not cancel the operation or say Saved. The eventual host must call this method on disposal and reconcile stored active Start/sets after remount; it is not yet automatically wired into the presentation panel.

### Executed evidence and failures retained
- New `prepared-workout.test.mjs`: **17/17 PASS**, actual T2/P-256/AES-GCM repository on fake IndexedDB. Includes original exact capture/outbox/reopen; concurrent/replayed Start; raw caller/configuration omission; stale revision and same-revision different authenticated token; scope changes; final-validator retirement; quota retry; lost commit reply; retirement after permission and during preparation; request copying/zero getter calls; cross-instance handle refusal; actual competing commit/CAS retry.
- `browser-prepared-workout.mjs`: **PREPARED WORKOUT BROWSER PASS — 10 native assertions**. Actual exported graph, native WebCrypto/T2/held IndexedDB write transaction, no early acknowledgment, original Unicode/source strings, one Start/outbox, identical replay and encrypted reopen. Synthetic producer/observation guard, unissued schema; not iPhone, CLOCK or remote recovery acceptance.
- Final `run-current-head.cjs <R1-repo> --all --browser`: **282/282 PASS**, no skips; native current-head5/5, exact T2 vectors56, signed-surface/tamper and public sink checks PASS. Its actual HTTP test still exercises the basic workout profile, not the new captured authority profile. The composition remains pinned to historical R1 `bec056d6b8f86069c500d958e86f212bd6e5f392`, not latest P1/resource acceptance.
- Initial composition failed native1 with `Accepted shared source differs: rebuild/m4/workout/schema.cjs`. Correctly detected this intentional selected-profile change. `prepared-shape-delta.cjs` now permits exactly the two disclosed literal edits against the git-verified baseline; every other shape byte and the entire authority-profile file must still match. This is a non-frozen W6 composition runner change, not an edit to original conformance laws or a generic source-drift exemption.
- A new adversarial configuration test was RED before repair: `a selected captured writer without the preparation configuration still fails closed`, actual acknowledgment true versus required false. The final guard now inspects the actual batch independently of the optional installation flag; the same test is GREEN. Original `prepared-config-red.log` is retained. No published prior component behavior was relabeled.
- Effective `--all --prepared-bite`: omit only `context.snapshotToken !== entry.token ||` in a disposable copy. **RED native1: 282 tests /281 pass /1 fail**, `same revision with a different authenticated token invalidates the earlier preparation`. Exact restored public-client SHA256 `4718127c4605a280b9cb3e837bcfe448afb24e4aa16eff70eab6759ca1753c1f`; tracked source never mutated. Temp `earned-w6-current-head-kqySu6` contains the failed run, original/mutant/restored hashes. Restored focused run is recorded separately. Earlier17-test precursor counts16 and281-test results remain in their original logs.

Final mandatory publication `capture-publication-gates-2026-09-09T02-41-54-539Z`: all native0, private preparation verdict-only/public pins unchanged; FROZEN-PATHS PASS; OLD-PACKAGE PASS18 actual ZIP files; `SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`; rig185 W1 PASS/W2 PASS; `SELFTEST PASS`; strict clock unset ends `All checks passed. Safe to ship.`; DIFF-CHECK PASS. The legacy strict tail is not new-app release approval. Earlier02:39 checks do not substitute for this post-repair run. Restored disposable17/17 PASS is in `prepared-workout-final-restored.log`; original/restored SHA above matches. Other logs: `prepared-workout-final-composed.log`, `prepared-workout-final-browser.log`, `prepared-workout-final-bite.log` at the retained coordinator root. New-head CI and independent successor review pending.

### Seams, owner direction and NEXT
This implements the original-capture local Start mechanism, not full workout delivery. G3 producer/basis qualification, complete supported/issued profile, captured authority/HTTP/other-device recovery, full-history fit, current safety/corrected history and remount remain open, along with K1/CLOCK/P1/resource/private-port/integration/Joe-Dad phone gates. Resource FAIL is unchanged. The static producer cannot be described as scientifically justified merely because this storage path passes.

Owner-approved hosted additions v2 SHA256 `caf9c2dc683e220112bc8bf85ed8dbe670428c8015b1ae8ec7d68a35720b2a45` and APM `EARNED-APPROVED-HANDOFF.md` are assigned to the existing post-capture Today/panel integration. Preserve initially unselected optional sleep hours/quality, energy, soreness and stress; conditional pain/illness/re-entry detail; dated provenance and distinct blank/none/clear/uncertain states; no invented readiness score or automatic penalty. Add the qualified current full calorie/protein/fat/carbohydrate plan after its typed plan/source contract, then intake totals. The fictional preview supplies design, never values or prescription rules. Stage1 grounded coach stays after usable core. PANEL03 remains separate scratch and unadopted in this change.

APM `PRESCRIPTION-QUALITY-REQUIREMENT.md` is adopted in the existing affected review: each delivered volume, nutrition, steps, load/rep/effort and rest prescription needs evidence/applicability, actual implemented decision and coherent consented follow-through. Check relevant combinations and repeated decisions so targets cannot compound or ratchet on the same evidence. No new broad audit, universal training restriction, whole-app clearance or personal target is introduced. RECOVERY-NUTRITION-01's source-grounded candidate moves narrow existing recovery-rule qualification and the explicit daily-plan contract earlier; its unexecuted proposed scenarios are not PASS.

NEXT: independent review of this actual local join, then qualified producer/semantic basis and selected authority/recovery integration under the same capture contract. Original versus current instructions, normal Finish, faithful corrected/resumed logging and practical first use remain required. Work on the existing owner-approved nutrition/recovery connection contracts may proceed at its independent dependencies; no second app or status-only PR. Full PRODUCT-GOALv3 stays unchanged. Engineering progress is not proof of safer/better physiological outcomes or credit savings.

## Original-prescription preparation component — successor to17fa69f, 2026-09-09

### What / why / exact scope
Implements the shared descriptor-safe preparation step from PR46 CAPTURE-STARTv1.1 at `b176a7595ad728ca62327eb587510fea3a06749f`, independently accepted in Opus110 (R-1–R-3 closed; G-1–G-7 remain implementation gates). Base is retained W6 `17fa69f09a19e0b6a72566c9504fddebdd599a0b`. New `rebuild/m4/workout/capture.cjs` is exported through the actual browser entry; no caller/command/authority/schema/acknowledgment/presentation behavior is replaced. No frozen engine, original laws, private data, dependency/lockfile, seeded soak, issuer or training-rule change.

`createPrescriptionCapture({parseStrictJson}).prepare(capture, {producer,basis})` takes a trusted static synchronous parser dependency; the browser uses the existing W6 strict parser. It returns a private deeply frozen descriptor-safe copy, preserving JSON member order, original Unicode/source strings, slot order, repeated lineages, opaque per-set representations and specified/unknown/not-prescribed distinctions. It rejects malformed structures/strings, decoded duplicate JSON keys, accessors without invoking getters, hidden/symbol fields, cycles, sparse/extended arrays, caller-selected extras and mismatched producer/basis values. All refusal paths return a typed `WORKOUT_CAPTURE_INVALID` error without input contents. This method does not normalize numbers, convert bounded effort to exact effort, infer a prescription or create an operation.

Expected producer/basis equality is a necessary check, **not qualification or an authorization token**: a trusted integration must supply those values from the real verified snapshot, approved producer and basis resolver. The parser is not selectable through a UI request. Before actual adoption into Start, the private prepared handle, snapshot/token/final-batch fence, selected manifest/commands, full request-size limit, uncertainty/retry/disposal and actual durable/recovery joins remain required. The current basic Start command and validator still correctly reject the additional field. No capture is currently saved merely by adding this component. Existing operations/log storage and NFC-equivalent commitment contracts remain unchanged.

### Executed evidence
`node --test rebuild/m3/w6/test/prescription-capture.test.mjs`: **61/61 PASS**, including actual client builder/authority commitment preservation, caller-mutation isolation, every closed object/required field, trusted context mismatch, Unicode equivalence, malformed/duplicate source JSON, exact raw decimal/key/escape text and12,000-level valid JSON without recursive-call failure. The test uses the actual existing strict parser, not a permissive stub. Its actual builder example is synthetic/unissued, not admission or saved-state evidence.

`W6_BROWSER_BIN=<installed Chromium> node rebuild/m3/w6/test/browser-capture.mjs`: **CAPTURE BROWSER PASS — 7 native browser assertions; actual exported capture + existing strict parser; no Start/IDB/issuer/phone qualification**. First run failed one harness assertion: non-strict page evaluation silently ignored a frozen-property assignment rather than throwing. The stored value stayed unchanged. Corrected the assertion to require Object.isFrozen and the original value; no product fix or failed-run relabeling.

`node rebuild/m3/w6/test/capture-bite.cjs`: **CAPTURE FREEZE BITE RED — private frozen copy regression failed; native1**. Removing only deep-freeze from the NEW module breaks the targeted actual-module test. Finally restored original bytes, then **CAPTURE FREEZE RESTORED PASS —61checks; sha256 dfd7b51edbc510ea67e6d4ec2a68d3ac076f004fa438f2fa3da2bfd94e80bea6**. Logs in a unique local Temp directory `earned-capture-bite-3yctN2`; runner reproduces the mutation/restoration without editing any accepted prior module.

`node rebuild/m3/w6/test/run-current-head.cjs <retained-R1-repo> --all --browser`: **265/265 PASS**, no skips, native0. This unchanged runner composes the pinned historical R1 `bec056d6b8f86069c500d958e86f212bd6e5f392` with actual current W6 files in a disposable tree; it is not a claim of new-P1/R1-capacity acceptance. Existing actual HTTP/C6/disposition/durable-drain/reference test PASS; native browser current-head5/5, exact T2 vectors56, public sink proof/refusal PASS. Synthetic observation guard, issuer/recovery refusal and CLOCK/full-STANDING/iPhone BLOCKED remain disclosed. Full output `capture-composed.log` at retained coordinator root; new61 tests are included through the existing test-file discovery, no frozen suite edit.

Mandatory publication, `capture-publication-gates-2026-09-09T02-12-55-941Z`: all native0. Private preparation is verdict-only; committed public pins unchanged. FROZEN-PATHS PASS; OLD-PACKAGE PASS (18 allowlisted files, actual ZIP bytes); `SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families`; rig185 W1 PASS/W2 PASS; `SELFTEST PASS`; strict with MEASURED_TEST_NOW unset ends `All checks passed. Safe to ship.`; git diff check PASS. That legacy strict tail does not qualify the unfinished new app for release. New-head CI and independent component review remain pending.

### Seams, limitations and NEXT
This closes the concrete copy/shape mechanism needed before the actual builder; it does not implement the full prepareWorkout/startPreparedWorkout interface, qualified producer, active schema, captured Start/outbox, corrected history, complete workout or phone release. Existing actual W6/T2 behavior and saved-state precedence are untouched. The server counterpart must use its qualified strict parser and actual admission/basis checks before claiming a shared end-to-end profile. Full-history growth and the independently reproduced96MiB resource FAIL remain unwaived; Opus110's R1-PAGED recommendation is a proposed versioned amendment, not an accepted implementation/capacity solution.

Full PRODUCT-GOALv3 and approved first-use scope stay intact. APM's WORKOUT-PANEL-03 presentation candidate is separate scratch, unadopted here; no overlap. Approved RefinementA and later conversational coach remain at their existing implementation slots, without prototype rules or new release gates. NEXT root: integrate the independently reviewed preparation component into the private handle and actual Start/commit path under the published capture contract; implement the required selected shared shape and authority bindings, preserving the real snapshot token and every mandatory gate. Estimated/observed development time is not a claim of improved user outcomes or credit savings.

## Multi-slot workout panel — successor to accepted f74a815, 2026-09-08

### What / why and exact scope
Extend the SAME exported `mountWorkoutCommandPanel` with optional `additionalSlots`.
Omitting it preserves the accepted single-slot behavior; an explicit array (including
empty) enables multi-slot controls. Each entry supplies logical_set_slot,
lift_lineage_id and label as nonblank primitives. Malformed/sparse/duplicate IDs
refuse before Start. Unique slot IDs across this host list are a conservative UI
constraint, not a new authority identity law; the qualified partition join remains.
Source WORKOUT-PANEL-02 adopted byte-for-byte SHA256
29f7f66ed8522696f93499ef5c68af987562cce45667a478c2b9297206dde7f6.
Executes the bounded PANEL02 brief and existing PR46 owner-workout requirements.

One acknowledged Start serves every Set/Skip/Close. Acknowledged Set or explicit
reasoned Skip completes the current slot; only explicit Next changes selection and
clears those completed-slot controls. Blank values never become skipped/zero facts.
Skip carries actual skip_scope:set. Explicit Finish early carries completion_kind:
early, freezes this mount after acknowledgment and keeps remaining typed work
visible and unlogged. No normal Finish is offered: this synthetic selection does
not establish complete prescribed/accepted partitions or the skipped/completed
policy. The brief permits early-only here; required normal finish stays in the full
app, not silently removed. Correction/removal, resume and corrected history remain.

Readback lists only exact requests acknowledged locally in this visit, with their
operation identity internal. It is not a remote receipt, current/corrected history,
captured prescription or plan-completion claim. Missing acknowledged op identity,
uncertain durable outcome, throwing response or lost standing requires host recovery,
never blind retry. Existing single-slot refusal semantics and 16px input treatment
remain. Disposal cannot cancel an already issued durable write; Opus90's known
dispose/remount duplicate-Start concern remains a host reconciliation requirement.

### Executed evidence
Actual retained R1 bec056d + W6/T2/P256/AES-GCM composition: 204/204, native0;
35 client-law traces and56 baseline vectors unchanged. Source inventory and logs:
Temp/earned-w6-current-head-fC9pej and work/panel-extension-bounded-full.log.
Tracked browser-panel imports the actual compiled graph, verifies source hashes,
and now calls tracked panel-extension.mjs, not the helper's standalone entry.

PANEL DOM PASS — 57 focused checks (controlled outcomes; not durable evidence)
PANEL EXTENSION DOM PASS — 38 focused checks
PANEL EXTENSION DURABLE PASS — one Start, mixed-load Sets, explicit Skip, early Close; native delayed/quota Set/Skip/Close; preserved originals/drafts/unlogged slot after encrypted reopen
PANEL DURABLE BROWSER PASS — actual retained W6/T2/P256/AES-GCM/native IndexedDB, pending atomic commit, keyboard start/set, exact payload/reference, preserved draft and encrypted reopen; synthetic guard/unissued2, not lifecycle acceptance

Native Chromium proof: one Start,40.5lb/8/3+ then35lb/6/unrecorded, explicit Skip,
early Close; the fourth slot's typed20lb/4 remains unlogged. Exact5 operations and
outbox, shared Start, original first Start/Set bytes, unrelated draft/session metadata
survive encrypted reopen. Held native transactions and injected quota failures on
Set/Skip/Close cannot advance or paint a new fact before acknowledgment. Root viewed
the actual390px multiple-closed.png: labels/readback fit; no physical-phone verdict.

Effective bite, disposable copy ONLY: change Skip's session_start_op_id from startId
to 'wrong-start'. RED line: `page.evaluate: Error: Extension check failed: all slots reference one acknowledged Start`.
Exact restored source SHA25629f7f66ed8522696f93499ef5c68af987562cce45667a478c2b9297206dde7f6;
restored57+38/native tests PASS. Raw panel-extension-bite-red.log and
panel-extension-restored.log retained in that composition. Retained source unmutated.

Failure disclosed: first full run reported177 tests/174 pass/3 fail when concurrent
Node test-file workers failed at startup with fatal out-of-memory (including frame
repository and HTTP test processes). No product test assertion was waived. The
existing runner now bounds test-file workers to2; all assertions, per-test timeout,
and races INSIDE tests are unchanged. Full rerun204/204 passed, including actual
HTTP. No user process killed, memory limit raised, or R1 resource gate waived.
Original failure work/panel-extension-full.log/Temp/earned-w6-current-head-O8sbGu.
Publication gates all native0 at work/w6-current-head-gates-2026-09-08T22-31-38-915Z:
fresh private preparation/verdict only/public pins, frozen18 actual ZIP,
SUITE CONSISTENT99/99/29/70 + rig185W1/W2, SELFTEST PASS, strict(clock unset), diff.
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
W6 CIPHER-PIN DETECTED — disposable wrong AES input hash refused actual browser build; manifest restored byte-for-byte
No private-release meaning attaches to the old strict runner's Safe to ship tail.

### Seams / uncertainty / NEXT
Prior Opus90 ACCEPT f74 applies to the original bounded panel; successor independent
review and CI pending. Synthetic guard/unissued schema2 remains test-only. Complete
manifest, real issuance, original-instruction capture, normal finish/refresh/resume,
corrected history/engine join, CLOCK/K1, private port/recovery/integration and Joe/Dad
device qualification remain. No private use, merge, outcome-superiority claim or new
prescription. Full approved goal remains; this is another portion of its workout flow.
Root adoption/evidence approximately20minutes, plus separately retained helper work;
not a measured causal speedup. NEXT: review this same-component extension, then join
qualified capture/history and host lifecycle; preserve all existing first-use gates.

## Mounted workout panel — successor to accepted9296897, 2026-09-08

### What / why and exact scope
The existing browser graph now exports mountWorkoutCommandPanel(root,{client,selection}).
It mounts a real Start -> one explicitly selected Set interaction using the accepted
client.execute('workout',...) API. No replacement committer, default plan identity,
lease/issuer, storage implementation or training prescription is introduced. The
panel source is WORKOUT-PANEL-01 revision2, adopted byte-for-byte (working SHA256
c163bbdfc602427b80ff8e49cffe48b98075f51bf35f4352643239313c244f41). The root inspected
source, helper evidence, and the saved390px screenshot, then ran its adopted build.
Executes current PR46 v0.31 f9fe635, amendments26/27 and existing schema §6. Same PR32.

This is one useful bounded portion of the actual workout journey, explicitly
synthetic. The approved complete app/individualized plan goal and first-use holds
remain. A successful set exhausts only this demonstration's explicit slot; the host
owns additional selection, history, original prescription capture and lifecycle.
It does not manufacture a new start on refresh or claim resume/finish support.

Entries are labelled16px, keyboard operable, and retained on failure. Optional effort
keeps absence, exact0/1/2, at_least3, unknown and skipped distinct. Blank load/reps,
fractional reps and malformed input refuse without coercing a workout fact. Supplied
labels are text. The sole next enabled action follows acknowledged Start. Saving
persists until the actual durable client acknowledges; no Synced claim. Explicit
refusal3 allows retry,17/18/20 require host resolution. Stored/durable/committed but
unacknowledged, a throw or unknown result requires reconciliation, never a blind
retry or false assertion that nothing was written. Disposal retires handlers and
late painting, not an already issued disk write.

### Executed evidence
Actual R1bec/W6 disposable composition:204/204 native0, unchanged35 client-law traces
and56 baseline vectors. Evidence work/panel-adoption-full.log and
Temp/earned-w6-current-head-K6q9tX/source-manifest.json and test stdout/stderr.
Tracked test/browser-panel.mjs builds/imports the ACTUAL exported browser graph,
records all source-input hashes, checks them unchanged, and uses caller-supplied
existing W6_BROWSER_BIN. No machine-specific checkout/browser default or dependency
install; clean-build and composition include the exact panel source. The helper's
machine-bound preparation harness was adapted to this portable existing runner.

PANEL DOM PASS — 57 focused checks (controlled outcomes; not durable evidence)
PANEL DURABLE BROWSER PASS — actual retained W6/T2/P256/AES-GCM/native IndexedDB, pending atomic commit, keyboard start/set, exact payload/reference, preserved draft and encrypted reopen; synthetic guard/unissued2, not lifecycle acceptance

The57 controlled cases include pending/double submission, 3/17/18/20 refusals,
exact late-context {acknowledged:false,stored:true,durable:true,confirmed:false,
committed:true,committedRevision,state} for Start/Set, unknown/throw, optional effort,
exhausted slot, explicit new mount, disposal, labels/injection, input retention and
numeric noncoercion. They do not claim a real late-context race was executed.
Separate native Chromium151 proof uses actual T2/P256/AES-GCM and native IndexedDB:
held readwrite transaction remains Saving; completion then Saved; exact returned
start reference/empty start payload/typed40.5lb8reps3+; encrypted reopen identical;
unrelated draft preserved; injected native quota preserves the previous generation
and entered35.5lb0reps. Keys generated per run; browser context nonpersistent and
network confined to the local test server. No private data or real key committed.

Clean offline frozen-lockfile build PASS; cipher input mutation DETECTED/restored.
Effective panel bite in the disposable copy only: replace
`if (result?.acknowledged !== true)` with `if (false)`.
PANEL ACK BITE DETECTED — ignored acknowledgement refusal; native exit 1; safe refusal 3 retains input FAILED
PANEL RESTORED SHA256 c163bbdfc602427b80ff8e49cffe48b98075f51bf35f4352643239313c244f41
Restored57/native browser PASS. Raw panel-bite-red.log/panel-restored.log and source
inventory/synthetic screenshots remain in the disposable composition. No retained
source was mutated for this bite. Mandatory current publication gates all native0 at work/w6-current-head-gates-2026-09-08T21-54-09-155Z: fresh private preparation/verdict only/public pins, frozen18 actual ZIP, conformance99/99/29/70+rig185W1W2, SELFTEST, strict(clock unset), diff. No app-release meaning is assigned to the old strict runner's Safe to ship tail.

Preparation errors disclosed: one root Git diff was mistakenly called outside the
retained repository (exit1, no modification); rerun in the proper worktree passed.
One supplementary rg used wrong relative/glob paths; corrected focused script lookup
found the existing pinned package manager. No product/test failure was hidden.
The adopted browser harness initially named a nonexistent build.metafile property
in evidence only; corrected to actual build.inventory and verified hashes before
publication. The original executed panel assertions had already passed.

### Seams / uncertainty / next
Host selection must be qualified; no new identity/current-plan inference. The page
is a same-runtime synthetic demonstration, not the private app. Real schema2 issuance,
complete manifest, recoverable original prescription capture, panel refresh/resume,
more slots/close/edit/skip/removal/readback, corrected history/engine projection,
CLOCK/K1/custody, private port and Joe/Dad physical qualification remain open.
Labels/layout demonstrate pending feedback, retained entries and one clear action;
comparative mental-work reduction and superior outcomes are NOT established.
Preserve the existing full first-use cut and broader product goal.
Opus88 ACCEPT929 is prior scoped evidence, not acceptance of this new panel. Current
panel independent review and new-head CI pending. Original reviews/archives retained.
Implementation/adoption and focused evidence approximately15minutes; helper work
separate, no claimed speedup or attributable dollar saving.
NEXT: independent review of this actual mounted portion; extend the SAME journey
with accepted remaining commands/readback and required capture/history/issuance joins.

## Callback diagnostic hardening — successor to accepted09f5bce

Opus86 independently ACCEPTED09f5bce: Linux202/202, native workout browser, existing
current-head5/56/six36 browser checks, schema bite/restoration, core34/HTTP9 and11
own challenges native0. It reconciled committedLF75a55737... with WindowsCRLF3273...
and independently checked shared source equality. Original29413-byte archive SHA
def370a612bc9bad4ce2ce77ae8e7b650ee4a0f8376d1af22dad1a40976bbead attached, NOT locally
received/hashed/replayed. Original verdict retained. Exact09f5CI7SUCCESS/3SKIP bothOS
terminal; no repoll. Reviewer publication/cleanbuild/Windows checks NOT RUN.

Author final diagnostic found a separate narrow §6 requirement gap: a faulty
configured prepare method can return an action whose payload GETTER throws.
The actual Ops.build reads it after the inner prepare try/catch, so09f5 refused3
with zero operations/outbox but exposed the synthetic callback marker in its error
text. This is a direct configured-core fault; the actual pinned W6 static profile
never returns that object and a provider cannot replace it. No request-exploitable
path, saved-data failure or training-rule defect is claimed. The existing contract
requires callback errors sanitized. New focused test RED/native1 before the fix;
its paired helper-copy assertion passed (1/2 overall). Raw first output retained in
work/workout-callback-red.log; a direct native-exit repetition confirmed1.

Change only the new-workout outer build-error branch to a fixed diagnostic; legacy
errors remain exact. Add the property-accessor regression and Opus86's nonblocking
N1 assertion that the duplicated descriptor helper matches accepted schema code
(CRLF/LF normalized for source-text comparison, no refactor). Focused10/10 native0;
actual composed204/204 native0 (149existing+54focused+1HTTP), same baseline35/56.
work/workout-client-callback-full.log and temporaryearned-w6-current-head-CANpaC
retain actual outputs. Current-source schema bite DETECTED/native1; byte-restored WindowsworkingSHA bd340c32239413adf4752c68ca2b084b059777c5458641c833a4c3a40bbb75c1 with54focusedPASS, native browser workout PASS;
original09f5 boundary acceptance remains attributed only to its own bytes.
Required successor publication gates all native0 atwork/w6-current-head-gates-2026-09-08T21-25-09-509Z: preparation/private-verdict/public pins, frozen18actualZIP, conformance99/99/29/70+rig185W1W2, SELFTEST, strict3072(clockunset), diff. Affected independent re-review and new-head CI pending. Correction work approximately10minutes; review separate.
No other source, interface, rule, scope, custody or existing release hold changes.
NEXT: close this affected correction, then use APM FIRST-USE-CUT-01 findings to
extend the smallest sufficientlyclosed actual workout journey, as amendment§26
requires. Full goal remains; helper mapping is preparation, not an acceptance gate.


## Actual workout command component — 2026-09-08, successor to cdf698d

Executes PR46 BRIEF-OWNER-WORKOUT v0.29 / WORKOUT-BASIC-SCHEMA §6 at
8aafb0450c52b5138c8fcd33f7f6d13b81161f23, including Opus84 R-1–R-3 and all four
precision items BEFORE retained source adoption. Actual base W6cdf698d43bc027ab6f1c075e179b42b133d9cfcf;
composed actual R1bec056d6b8f86069c500d958e86f212bd6e5f392. Same retained PR32.
This is a command/admission component, not a complete workout app, manifest or activation.

### What / why

Adds client.workout({action,input}) for explicit start/set/skip/close/correct/remove
through the ACTUAL T2 commitBatch and W6 P-256/AES-GCM/IndexedDB path. The closed
static mapper supplies exact envelope fields, literal empty start payload and
unchanged quantities. Every target and explicit causal parent is locally known,
non-rejected and same-athlete; pending same-athlete dependencies remain admissible.
No same-device restriction. References supplied to validation are copies.
The static profile is pinned AFTER provider/trusted spreads. All six actions leave
drafts/active metadata and original operations unchanged. No captured instruction
or plan consent is fabricated. The same Ops.build call explicitly selects version2
ONLY for the new command; original command construction/canonical/HMAC bytes remain.
Known standing/integrity/lease priority remains before preparation, retained input
survives refusal, and selected version comes from VERIFIED cfg.lease, not Lease.check.
Missing/broken/async profile refuses3 with no effect or raw callback error; old lease
refuses20. Existing outer OPERATION_SCHEMA_MISMATCH guard remains unchanged.
No authority/R1/issuer/SQL/codec/public-client/repository, original conformance law,
engine/frozen app, dependency/lock, private data or seeded-soak modification.

### Executed evidence and exact limits

Actual disposable composition202/202 native0: all149 existing tests plus52 focused
command/fault/relationship cases and1 real R1 Worker/D1/HTTP journey. Original35/35
client-law traces and56 full default action/state/clock vectors remain byte-equal
to accepted cb5580a3. Mixed-load sets, exact0/absence/unknown/bounded effort, later
effort correction, skip/early-close/removal, immutable original bytes and draft
retention survive encrypted reopen. Quota/abort/delayed transaction and two actual
public clients racing one IDB revision preserve whole ops/outbox/sequence and slots.
Some local relationship negatives explicitly seed the actual T2 model; they are
NOT claims of authenticated delivery. The separate actual HTTP case supplies that
proof: other-device target REFUSES before signed pull, WORKS after verified delivery.

WORKOUT ACTUAL CLIENT/R1 HTTP PASS — exact local commands, both C6 cuts, one effect, signed disposition/receipt, delayed durable drain, second-device reference; issuer/recovery still REFUSE
WORKOUT ACTUAL CORE PASS — 34/34; synthetic capabilities, NOT ACTIVATED
WORKOUT R1 HTTP PASS — 9/9; artificial unissued capability, full recovery NOT QUALIFIED
WORKOUT BROWSER PASS — native IndexedDB/WebCrypto/T2 start/set/early-close, schema2, malformed refusal, preserved draft, reopen, atomic quota refusal; synthetic guard, not Safari/K1

Actual Node HTTP preserves one accepted effect after a deliberately discarded reply,
verifies signed dispositions before outbox drain, rejects a forged signature without
changing disk, and delays the drain until real IDB transaction completion. Both
same-athlete devices use actual client-created envelopes. The test deliberately
installs an UNISSUED schema2 historical capability, as accepted for R1 admission;
real issuer still refuses schema2 and full recovery still returns RETAINED_INTEGRITY.
No synthetic transaction/committer replaces actual production code. Keys per run.

Existing composed browser: current-head5/5, Node/browser56 exact vectors, original
six signature surfaces/36 tamper-domain refusals, actual public sink/IDB; native0.
New browser test runs Chromium152.0.4191.66, blocks non-loopback network and uses
native IndexedDB/WebCrypto. Observation guard is explicitly synthetic, NOT K1/CLOCK
or Safari/iPhone evidence. Clean offline pinned-dependency browser build PASS with
only the three new M4 transitive sources added to dependency copying; cipher-pin
mutation DETECTED/restored. Root/dependency locks unchanged; real node_modules in
retained worktrees, temporary composition junctions only.

### Effective bite / preparation failures preserved

WORKOUT SCHEMA BITE DETECTED — actual encrypted workout save fails when selected schema is omitted; native1
WORKOUT SCHEMA RESTORED PASS — 3273b883d62cdc97c898f0fd6ece0eef0544b3dd1b963bc4de4f4da513e2ed2f; full focused client cases native0

Tracked test/workout-bite.cjs requires a pinned temporary composition. Omitting ONLY
the shared builder's schema selection makes the valid actual encrypted save fail
(false !== true). Existing outer schema guard refuses20; no guard is removed.
Restored source bytes/hash exactly; all52 focused cases then PASS. Accepted shared
schema/profile source is pinned byte-for-byte to R1bec by the composition runner.

Initial unchanged-client preparation3/6 exposed unsupported commands; draft6/6,
then49/49. First52-case run51/52: the CAS TEST wrapped the synchronous public stage
in an async function, so even start refused. Fixed test gates competing repository
commits while retaining the genuine synchronous stage; targeted CAS1/1 then full202
PASS. First HTTP draft reached its final duplicate check then called nonexistent
authority method pull; changed that TEST to the actual /pull HTTP route, then PASS.
Evidence wrapper initially named absent workout-profile.test.cjs; corrected to
tracked workout-core.test.cjs and ran34/34+9/9. No product fix inferred from these
harness failures. Original outputs remain in coordinator records/disposable logs.

Evidence: coordinator work/workout-client-before.log, workout-client-full.log,
workout-client-clean-build.log; disposable earned-w6-current-head-FXfNvi contains
source-manifest, native stdout/stderr, focused bite/red/restored, browser and actual
core/HTTP logs. These are synthetic/public evidence, not integration/private replay.
Mandatory retained publication gates all native0 atwork/w6-current-head-gates-2026-09-08T21-09-28-936Z:
preparation/private fixture verdict/public pins, frozen paths/actual18-file ZIP,
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SELFTEST PASS
Strict clock-unset3072 assertions and All checks passed. Safe to ship.; diff PASS.
These checks do not override the release holds. Independent implementation review
and new-head CI remain pending, not inherited from Opus84 design permission.

Reproduce with a REAL node_modules directory in both retained source trees:
node rebuild/m3/w6/test/run-current-head.cjs <R1-repo-containing-bec056d> --all
Then use the printed temporary composition as cwd to run test/browser-workout.mjs,
test/browser-contract.mjs (W6_BROWSER_BIN points at installed Chromium), and
node <retained-W6>/rebuild/m3/w6/test/workout-bite.cjs <printed-composition>.
The browser scripts are under rebuild/m3/w6/test; no network except loopback.
Original workout-core.test.cjs/workout-http.test.cjs under rebuild/m3/w5/test
also run in that composition. clean-build.mjs uses the locally installed pinned
package manager through W6_PNPM_JS and an OFFLINE frozen-lockfile install.
The reported3273... restoration hash is the exact Windows working bytes; the
runner pins and restores each platform's actual original bytes, with canonical
source identity also tied to the reviewed Git commit. No line-ending waiver of
byte-exact restoration within a run.

### Seams / remaining full goal

Still NOT enabled: full immutable schema/issuer/renewal and recovery qualification,
non-workout schema2 and richer edit/clearing/effective-time/partition/lineage/consent
records, nonnumeric loads, explicit legacy start/target qualification, corrected-state
fold and same-generation recoverable prescription capture. New actions deliberately
do not reuse legacy implicit-current-session or draft-deletion behavior. Capture,
resumed workouts and useful UI are still open. K1 knowledge fence, currentness/time
bounds, CLOCK, P1/T1/Q1/contract6–7, R1 resource FAIL162050118 vs96MiB, provider,
private import/recovery, integrator replay and Joe/Dad phones remain applicable holds.
No scientific/training rule change, scope reduction or progress percentage claimed.

NEXT: independent affected implementation review + exact-head CI; then complete
manifest/legacy qualification and prescription-capture joins through retained
coordinator. Full dependable, scientifically justified private workout/plan goal
remains ACTIVE. Wall-clock: started20:28:57Z; publication preparation completed21:13Z, approximately44minutes. Review/CI time is separate.


## Composed browser evidence — successor to ffaeaad, 2026-09-08

Product files and their hashes in the next section are UNCHANGED. This follow-up changes only the existing browser-contract test, composition runner and report; eight cumulative files from0d7f5e0. The independently requested product review remains pinned to ffaeaad. No original frozen suite, validator, identity/signature contract or historical assertion changes.

Running the existing browser test against the actual composed new dependency first failed with `verified:7/refused:49` versus its hardcoded historical `6/36`: it enumerated every newly added signer domain while expecting only the original six. The correction explicitly enumerates and verifies the immutable fixture's six historical domain strings, keeps their original six successes/36 tamper-domain refusals, and adds a separate current-head product path. This preserves original coverage rather than lowering its expected count or asserting a dynamically shrinking domain set. New profile absence is explicitly BLOCKED when testing the retained old W5; the composed dependency must supply it and the Node dependency check fails otherwise.

Five new browser cases execute actual compiled public-client, WebCrypto, T2 stage and real IndexedDB: empty/nonempty reply retains the exact complete signed envelope and existing outbox; a newly created client verifies persisted history without fresh observation or a write; a valid outer envelope with damaged inner signature is refused12 with the complete prior state unchanged; an actual local write while reply delivery waits invalidates the original capture18 and preserves the competing write. Transport/signing and observation guard are explicitly synthetic in these browser cases. Reopen means a new client over the same repository/key, not a phone reboot or new key-recovery claim. The prior separate Node case uses actual R1/local-D1/HTTP.

```text
W6_BROWSER_BIN=<installed Chromium executable>
node rebuild/m3/w6/test/run-current-head.cjs <R1-checkout> --all --browser
149 tests;149 pass;0 fail; native exit0
W6 BROWSER-CURRENT-HEAD PASS — 5/5 actual WebCrypto/T2/IndexedDB cases: empty/nonempty exact envelope+outbox, historical reopen, inner-signature refusal, real competing local write; synthetic signer/transport/observation guard; not phone/CLOCK
W6 BROWSER-T2 PASS — 56 exact Node/browser action/state/clock vectors; 6 signed surfaces +36 tamper/domain refusals; actual T2 session/finish persisted in IndexedDB; Chromium 152.0.4191.66
```

The same disposable original-revision bite now fails BOTH Node tests and the actual browser local-write assertion (`true !== false`, browser-contract.mjs:169), browser native1; restored product bytes yield149/149 and5/5, both native0. Product/restoration hashes remain the next section's exact pins. The runner records separate browser native exits/stdout/stderr; its child environment does not change the retained checkout. The retained-old-W5 browser baseline also passes all original assertions and truthfully prints the new capability BLOCKED. Logs: work/w6-current-head-composed-browser-first.log, work/w6-current-head-browser-{bite,restored}.log and their printed disposable directories. First result remains preserved. This approximately17:39–17:43Z follow-up closes an author browser-evidence gap; independent execution, real Safari, knowledge fence, production joins and private/integrator gates remain open. NEXT remains the same bounded review and full-workout dependency work; no new stream or schedule.

Fresh mandatory gates on this test/report successor PASS/native0: preparation/private-verdict and unchanged public pins; frozen paths/actual18-file ZIP; original conformance99/99/29/70 and rig185W1/W2; SELFTEST; strict3072 with test clock unset; diff-check. Logs work/w6-current-head-gates-2026-09-08T17-42-48-634Z. Product pins rechecked unchanged. Exact successor CI remains pending publication; the reviewer is asked to preserve its product assessment and inspect the added browser evidence separately.

## Current-head durable consumer — 2026-09-08

Retained PR32, base `0d7f5e0cb5bd114ff87f699574fc45bb052703ea`; paired public dependency R1 `d26795a47d638ec1e67840455273cc05eeca9926`. The coordinator resumes the existing paused W6 claim for the bounded `w6/CURRENT-HEAD-CONSUMER.md` contract. This adds the actual durable consumer to the reviewed producer; it does not merge R1, relax its resource failure, implement question issuance, or establish private/phone readiness. Seven changed/added files: this report, that contract, public-client.mjs, t2-stage.cjs, history-proof.mjs and two owned test/runner files. Frozen app, original suite, existing T2/core, storage/clock implementation, dependencies and seeded soak remain unchanged.

The new `exchangeCurrentHead(request, {issuanceAttempt})` captures the authenticated local revision/frontier and pending attempt, releases the queue while HTTP waits, then verifies through the actual R1 public boundary. The actual T2 receipt path stages one encrypted generation retaining the exact envelope, signed records and outbox. Conflicting retained operation content refuses18 rather than replacing an existing fact. The final repository validator compares the ORIGINAL captured revision, including after a real competing writer causes CAS restaging; a new revision cannot silently become the original observation. It checks context again after an injected final validator that might itself learn adverse information. Success is confirmed only after transaction completion. Post-validation cancellation after an unavoidable disk commit reports stored/durable but unconfirmed, hides old truth, and never claims rollback.

`invalidateCurrentHead()` retires the pending request immediately. Replacement/replay/restart cannot reuse it. Reopen authenticates the complete historical profile, scope, key epoch, challenge encoding, range and all individual receipts, but does not reconstruct a pending challenge, permission or new question. Existing observationGuard/session/schema/lease protections are reused; a synthetic pass-through observation guard in these tests does not implement the production knowledge-loss fence.

### Executed evidence and reproduction

From the W6 repository root, with an existing checkout of the exact R1 commit and the already installed locked W5/W6 dependency directories:

```text
node rebuild/m3/w6/test/run-current-head.cjs <R1-checkout> --all
CURRENT-HEAD REAL D1/HTTP/ENCRYPTED-CONSUMER PASS
tests 149; pass 149; fail 0; skipped 0; native exit 0
W6 DEFAULT PARITY PASS — 35/35 client laws and 56 exact action/state/clock vectors
```

Fourteen new cases run the actual consumer, T2 stage and AES-GCM repository against fake IndexedDB. They cover empty/nonempty exact proof retention, preserved outbox/unknown collection, separate-repository reopen, replay, quota/abort with a reached-write precondition, held completion, a local write during HTTP, an actual competing repository/CAS retry, two cancellation cuts, replacement, valid outer/invalid inner signature, conflicting retained identity, and authenticated malformed historical proof. The final case uses the actual R1 scoped authority, tracked six-statement migration0002, local D1, per-run keys/test issuer and real localhost HTTP; the accepted remote fact reaches the real encrypted consumer. A receipt alone still does not drain an outbox requiring a disposition. No private data or live provider was used.

The tracked runner composes immutable R1 public files and this W6 candidate in a disposable directory; it records every copied W6/client hash and verifies the originals unchanged. It retains W6's existing client hooks rather than substituting R1's older client. The unchanged default-parity test needs historical Git objects: child-only GIT_DIR points to the retained object database and GIT_WORK_TREE to the disposable directory for its read-only ls-tree/show commands. Original law/lib/adapter files are copied unchanged. Existing installed dependencies are linked only in the disposable tree; the retained repository has a real node_modules directory. This is explicit test composition, not a merged or deployable package. Direct execution against the old W5 protocol fails with CURRENT_HEAD_DEPENDENCY_MISSING, never a simulated PASS; the public API returns typed unsupported12 there.

Disclosed setup/debugging: the first composition replaced W6's T2 hooks with the older R1 client and failed before reaching the intended path; two early fault assertions lacked a reached-write precondition and were strengthened. Its blocked test child was stopped, with unrelated processes untouched. The second run was11/14: a test compared internal pending-input state as if it were unchanged published truth, the new refusal API lacked a consistent accepted:false marker, and the real-D1 fixture had not built the generated core. The assertion now checks actual published view/refusal; the public result is normalized; the fixture builds the actual core. The third focused run passed14/14. First full regression148/149 lacked the Git history needed by an unchanged baseline test; supplying the read-only history and original law/adapter dependencies yielded149/149. Failed outputs remain locally preserved. No original test or frozen law was weakened.

```text
node rebuild/m3/w6/test/run-current-head.cjs <R1-checkout> --bite
FAIL local writes proceed while HTTP waits; their revision invalidates the captured request
FAIL actual CAS retry compares the original capture, never the restaged revision
tests 14; pass 12; fail 2; native exit 1
RESTORED full regression: tests149; pass149; fail0; native exit0
```

The bite removes only the original-revision comparison in a disposable product copy. Both failures are false acceptance (`true !== false`), not syntax, missing dependency or source-pin failure. Original/restored public-client SHA256 `cc6b913a17e6f7515020bfbc3845a9d0275e4bfcd1ad2107660273dd04ae55c8`; mutant `958d9fc92375eb09b030763d54d5d47062b2c1952f4a5d1741530f130b569f43`. Root bytes never changed. history-proof SHA256 `9abd450ad2d13ff9f4bb343f340437a2047a5d13ce2370d3db90435c9cab0114`; t2-stage `e487aaf8508e7d824d625e71ea1d3b5bfaf87b0075ac5ce822d43fd5f6e0f577`.

Fresh retained-W6 browser regressions pass: browser build34 inputs; clean offline frozen-lock build and effective cipher-pin refusal; actual Chromium152.0.4191.66 T2 parity56 vectors, six signed surfaces/36 tamper-domain refusals, public disposition sink; repository6/6, frame/key/migration/nonce/old-tab checks and their restored existing bites. These existing browser checks use the retained older W5 and do not execute the new head exchange. Separately, the composed new-R1/new-W6 browser graph builds with34 inputs and no authority private implementation. New head behavior is Node WebCrypto plus fake-IDB/actual-local-HTTP evidence, not physical Safari evidence. W3 remains39/39.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS engine suite — 3072 assertions passed
PASS APP_V 7.56.0 === sw cache earned-v7.56.0
PASS 18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
DIFF-CHECK PASS
```

Original gates use explicit ENGINE_MAIN/ENGINE_OLD and this W6 client, MEASURED_TEST_NOW=2026-09-03 and America/New_York; strict unsets the test clock. Locally regenerated private preparation matches its pins; only its PASS verdict is reported. Public goldens/manifest remain unchanged. Full regression2338ms and browser/build checks are local execution timings, not latency/phone guarantees. Retained continuation work ran approximately17:10–17:35Z through this publication preparation; earlier setup failures are included, no per-agent cost claim. Coordinator logs: work/w6-current-head-{first,second,third,regression,regression-fixed,bite,restored}.log, work/w6-current-head-browser-20260908 and work/w6-current-head-gates-2026-09-08T17-30-36-175Z.

**Remaining seams:** K1 and persistent knowledge-loss fence; production observation/currentness and normalization; issuance eligibility/Q1 and contract cases6/7; schema activation and complete workout encoding/captured prescriptions; R1 resource/provider qualification; CLOCK/T1/P1, private port and real Joe/Dad phones. Historical proof is not fresh permission. Exact-head CI and affected independent execution are still pending at this authored checkpoint. The broader approved individualized training/nutrition/recovery/lifestyle/phase goal remains in the retained owner-workout brief; this storage slice supports it without substituting logging-only completion.

**NEXT:** this publishes the W6 mechanical current-head consumer for independent review on the same PR32. Root takes the existing full-workout schema/activation and captured-prescription dependency next while review runs; no separate implementation stream or new schedule. Only applicable completed independent/integrator/recovery/phone evidence can close OWNER-TODAY. No merge or owner action requested.

## Current K1 FAPI source and protected-record binding — 2026-09-07

Same retained draft PR32 at90a3787c5b36eee80a6e6826dc0c3cfe8dad50a7; exactly the existing K1 proposal/report change. §§2.5–2.6 close another authorable gap: exact source-defined fields/statuses/response references for the five selected email-code/session-token/session-end actions, followed by proposed protected header/body-or-prefix records and parser-result lineage. No product code, dependency, SDK/provider test, credential/config read, actual token, private/soak interaction or new protocol adoption.

The source mapping uses immutable Clerk OpenAPI7987d1b776258d5ddd9163e1a03d256b5ac4d64a/fapi/2026-05-12.yml, SHA2561b16fc8d2886210d8f23175bd3113e7c20c24fdb408347a1219994d413104c57. All47 transitive schema references resolve in that public file; the source extraction remains scratch only (FAPI-SELECTED-ACTIONS.json SHA25638b7a7a62f32a2ab8081c5599ac0dbb299db8b35336c57b855146443c4b6e044), not a new tracked fixture or response oracle. Form-body conditional fields/absent-null distinctions, redirect/error responses, pending/challenge/task states and the actual unchanged W5 verifier are explicit. The token response does not guarantee the configured W5 issuer/audience/azp/key join.

QA corrections are preserved: email_code implies identifier required only when that strategy is selected, not universally or in reverse; SessionTask has no declared payload semantics but does not prohibit undeclared fields; the global server/security citation is S33–44. auth-body.headersRef is the exact header reference selected by its originating raw response, with captureId equality; matching common fields alone cannot substitute another header proof. All raw paths are raw.capture.response.*, not a fabricated top-level bodyState. The parser's five emitted codes are pinned; catch-all TextDecoder/JSON.parse failures mean reproduced UTF8/SYNTAX codes are mechanical observations, not proof that provider bytes were invalid or every native/resource error is distinguishable. No parser change is proposed.

The proposed records retain complete protected bytes and original root/child/request/profile/source scope, distinguish UNREAD/COMPLETE/READ_FAILED prefix, and bind replay to one exact raw/body/parser profile. Parsing a prefix is not permitted; no second persisted decoded-secret copy, generic trusted boolean, cross-scope re-homing or unbound result supplies authority. Actual custody permission/retention/erasure/unlock and first-sign-in bootstrap remain OPEN; history retention cannot be silently traded for credential deletion, hashes, GC or new caps. Provider transport/version/error/task/challenge, actual ownership/delivery, effects and qualified C1 remain unresolved. These shapes do not authorize their own storage, dispatch or positive permission.

Source scope: the existing18 public source pins remain unchanged; the actual public W5 auth.cjs policy is now an additional pin, SHA25694e5afbf4f0d3d59e8b8ac6642d97e59435a36abee0dd162ced2a278937e8945. All19 listed file hashes match by read-only source comparison. No product source or existing model/diagnostic changes. Prior24 partial graph checks do not cover ANY new auth/custody wrapper/decoder/edge; they were not rerun or expanded. The original12 named manager acceptance groups remain NOT RUN with unchanged inventory. This batch has no behavioral execution, producer PASS, C1/CLOCK/phone/private-use or independent acceptance claim. Fresh required original/scope/CI gates and final diff QA remain the coordinator's publication work; no prior gate is represented as the new candidate's result.

NEXT: review the concrete missing custodyProfileRef policy/payload against the named sensitive response/request material and immutable-history/recovery obligations, plus the still-missing production/task/bootstrap/owner bindings. This is authorable technical work, not an automatic new owner question or permission to retain bearer/OTP material. Continue the same claim/models; root integrates no unaccepted product scope.


### Current binding publication gates

Final same-family read-only QA found no material insertion issue: exact corrected draft/source limits preserved; no independent acceptance inferred. Reviewed document SHA256bee2bb5133f67ef6022bfff60d85f5b3b210f5d9f61937d62961c97709510082. Only the proposal/report changed; product and standalone diagnostic/model bytes are unchanged, so their prior focused runs are historical and were not repeated for credit.

Fresh original Windows/Node24.19.0 package: all five preparation/gate subprocesses exited0, with real dependencies, explicit frozen ENGINE_MAIN/ENGINE_OLD and checkout client; fixed2026-09-03/America-New_York conformance/selftest, strict test clock/PL overrides unset. Private preparation was local/verdict-only with public pins unchanged. Logs: `work/w6-active-gates-2026-09-07T21-27-36-199Z`; scope0.209s,conformance8.572s,selftest25.572s,strict48.182s. These are measured local check durations, not app/savings estimates.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
```

Two-document scope/whitespace PASS. Exact new-commit Windows/Linux CI is checked after publication. No original gate waiver, updated private-use verdict or independent product acceptance follows; the strict closing line is old-app validation. PR47's assigned peer review remains separate and its policy requires designated integration.

## Previous K1 authentication/context capture binding — 2026-09-07

Same retained draft PR32 atbb70d54264a024efddbc61413504c13c2e006ab4; exactly the existing K1 proposal/report change. New §2.4 publishes the already prepared, QA-corrected AUTH_EXCHANGE/CONTEXT_SWITCH outer descriptor, field/reference/null and source-scope rules. This is the specific authorable binding named by the preceding checkpoint, completed while the separately authorized PR47-only review runs. It grants no W6 independent acceptance or product authority.

AUTH requests bind a nonnull request commitment and the original child/source scope. A context switch's final SCOPE_BOUND capture stays evidence of its originating obligation; it cannot move the old proof to another athlete or authorize target truth. Protected header/body references name complete custody records, not bare hashes: UNREAD has no body record; COMPLETE retains one even for an empty body; READ_FAILED retains any observed prefix with incomplete status. A token flag, caller response or source ID cannot supply origin/ownership proof.

Credential/body material remains excluded from public reports, logs and hashes. The provider profile, actual JWT acceptance, protected-record kinds/encodings/decoders, custody/erasure, first-ever sign-in bootstrap, native source retirement/acquisition/barriers and qualified C1 recovery remain explicit unresolved contracts. The enrolled-scope root cannot invent an initial athlete/device/key. Existing11/17/18 and known19/20 outcomes remain unchanged. Dispatch, semantic use and phase advancement stay blocked on the referenced definitions; no provider or browser assumption is silently accepted.

All18 existing public source pins match. Product/test source remains identical to1a5098d; prior135 Node/actual Edge and24 partial graph checks were not rerun and do not cover any new auth/context schema or edge. All12 manager groups remain NOT RUN. No SDK, HTTP/provider, account, phone, secret or seed interaction. Fresh original candidate checks and final focused diff QA follow below; no gate reuse/conditional deferral operates before PR47 acceptance/integration.

NEXT: the remaining concrete binding is the complete selected FAPI transport/action profile plus protected header/body custody records, reference kinds/decoders and actual ownership/bootstrap/C1 evidence. Obtain the exact-profile independent verdict before implementation. Continue within the same retained claim and continuation; no extra review stream, purchase or owner relay. Whole-app acceptance remains3/10.

### Current binding publication gates

Final same-family read-only QA found no material insertion issue: exact corrected draft/source limits preserved; no independent acceptance inferred. Reviewed document SHA256f2ba0cd03a9e0185920a9aed45bb57e5d515d971114a9651969a88657de25f92. Only the proposal/report changed; product and standalone diagnostic/model bytes are unchanged, so their prior focused runs are historical and were not repeated for credit.

Fresh original Windows/Node24.19.0 package: all five preparation/gate subprocesses exited0, with real dependencies, explicit frozen ENGINE_MAIN/ENGINE_OLD and checkout client; fixed2026-09-03/America-New_York conformance/selftest, strict test clock/PL overrides unset. Private preparation was local/verdict-only with public pins unchanged. Logs: `work/w6-active-gates-2026-09-07T21-00-16-561Z`; scope0.205s,conformance8.646s,selftest25.361s,strict48.558s. These are measured local check durations, not app/savings estimates.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
```

Two-document scope/whitespace PASS. Exact new-commit Windows/Linux CI is checked after publication. No original gate waiver, updated private-use verdict or independent product acceptance follows; the strict closing line is old-app validation. PR47's assigned peer review remains separate and its policy requires designated integration.

## Previous K1 retained-proof closure checkpoint — 2026-09-07

Same retained draft PR32 atc5696458b97028bb5ea181bac883d8a49aa1047b; exactly the existing K1 contract/report change. §2.3 now specifies the known complete proof graph and conservative historical retention rule. All published proof tuples and relative order remain, including unselected historical negative evidence. Existing terminal outbox transitions remain permitted; outer grandparent retirement does not authorize inner history deletion. Active and previous bodies validate separately. No count cap, compaction, archive/import deletion or new checkpoint policy is introduced.

The proposed graph distinguishes actual references from request/children digests, operation commitments and identifiers. Known wrapper/target kinds are declared; owner/session/basis/effects/barrier and other unknown schemas remain OPEN. Current frame-repository checks individual proofs and direct selected references, not a complete K1 body graph; the precise production integration is still unimplemented. Product and test source remain identical to1a5098d, and all12 manager groups remain NOT RUN. Prior135 Node/actual Edge evidence is historical and cannot prove this proposal's manager, C1 or CLOCK.

Nonshipping scratch `work/k1-knowledge-prep/proof-closure-contract-v2.mjs` uses the actual pinned makeProof, digest helper and strict parser against invented finite records, with six exact leaf records explicitly ASSUMED. It checks transitive omission, retained unselected history, shared dependencies, forbidden cross-generation lookup, non-reference hashes and declared kind mismatches. Original18-check fixture/result are preserved: same-family QA found it lacked transitive wrapper/target-kind checks. V2 adds five valid-byte wrong-kind negatives plus a control refusing to invent an owner kind; it is the superseding24-check fixture. This fixes a model coverage gap, not a product defect.

```text
K1 PARTIAL GRAPH 24/24 | omission fault EFFECTIVE | production source unchanged true
No semantic, lifecycle, GC, IDB, C1 or CLOCK acceptance.
```

The omission fault accepts a graph whose required outcome effect bytes are missing; the unchanged expectation detects it. Only scratch code is mutated. Five actual graph/helper/source pins remained exact. V2 fixture SHA292c0f69868bddab413292f883f20e3cda08a3fbe39cf2fdf1445bb0b41aa53a; result SHA3d6d320a66534c4b00cb5b33cbcfdf6a5a219eab500361cc706fae7ba7448a9d. Reproduce in a disposable coordinator-layout copy so its output files do not replace the retained author receipt. The fixture's assumed leaves and limited wrapper checks are not full semantic validators, producers, lifetime barriers or real storage evidence.

Previous c569645 exact-head CI passed Windows/Linux: push34156931298 and pull_request34156934017. Final same-family QA independently ran the byte-identical v2 fixture in a fresh disposable copy:24/24 PASS, effective omission fault, actual sources unchanged; unknown same-kind subtypes and lifecycle/signature semantics remain unproved. Fresh original candidate gates and full public pin verification are recorded below. No independent acceptance is inferred; old CI is not reused as a new candidate result. Authoring interval is recorded in existing local logs; no savings or whole-app-date promise. Whole-app acceptance remains3/10.

NEXT: close the actual remaining producer/lifetime/semantic schemas inside this same W6 claim and obtain exact-profile independent review before product adoption. C1 clean-control recovery, T1, P1 custody, real backend/phone and every private-use gate remain explicit. No new stream, schedule, model or owner relay.


### Retained-proof appendix publication gates

Fresh original Windows gates on this candidate all exited0: local private preparation/verdict-only with public pins unchanged, frozen paths/actual18-file ZIP, conformance/rig185, SELFTEST and strict with its clock unset. Explicit original engine paths and checkout client, fixed2026-09-03/America-New_York conformance/selftest; no suite/fixture/dependency substitution. Logs: `work/w6-active-gates-2026-09-07T20-08-33-551Z`; scope0.214s,conformance8.779s,selftest25.621s,strict48.406s. K1 PUBLIC SOURCE PINS18/18 PASS. No overall speed-saving claim.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
All checks passed. Safe to ship.
```

Two-document scope/diff PASS; exact new-commit CI remains a publication check. Original CI does not execute this scratch partial graph fixture. Strict's literal final line grants no rebuild/private-use approval. Independent review and all K1/C1/T1/P1/physical gates remain unchanged.

## Previous K1 LOCAL-binding checkpoint — 2026-09-07

Same retained draft PR32, source head `d9c1bd21add03533ba16625fb1fca9997b2fa8b8`; exactly the existing K1 contract and report change. §2.2 now supplies the proposed local permission-sample and final-sign-out request/null/capture forms, with the actual public-client/T2/face/lease call sites pinned. Strings retain every UTF-16 code unit without surrogate replacement; invalid objects/functions/promises and thrown values produce finite refusal tags without getters, coercion or private exception capture. An omitted optional provider remains the existing unbound clock fallback, not a claimed returned-undefined sample. No product/core/test/accepted schema/suite/soak change.

Sign-out capture requires the actual owned control/lifetime and completed OPEN-root/ARMED-child evidence; a caller flag or event.isTrusted alone cannot prove it. A genuine unexpected intent still establishes17 rather than disappearing because its descriptor is absent. The earlier duplicated expiry/failed-persistence diagnostic was deliberately NOT repeated: it already established that gap and would add no implementation evidence.

Same-family QA confirmed the current source joins and identified two corrected schema details: use OPEN for root phase and ARMED for child phase; preserve original parsing environment/interpretation as an explicitly OPEN replay dependency because noncanonical Date.parse strings can vary with runtime/timezone. Unproved replay cannot erase potentially learned expiry and remains18. This does not impose a new canonical-time rule or claim the interpretation binding is implemented.

Fifteen public source pins now name the concrete relevant source. All twelve proposed manager acceptance groups remain NOT RUN. AUTH_EXCHANGE/CONTEXT_SWITCH and other producers, complete provider/parser/T1 basis, real native ownership/delivery/closure, proof retention/custody and qualified-original-C interrupted-arm comparison remain OPEN. There is no new CLOCK/phone/private-use or independent acceptance; whole-app checklist remains3/10. Fresh original-gate results and measured batch evidence follow when complete.

NEXT: continue concrete remaining schema/closure preparation within this claim, with exact-profile independent review before product adoption. Do not rerun a duplicate boundary merely to generate output. I integrates only accepted revisions; same coordinator/workers/models/continuation, no owner relay or new stream.

### K1 LOCAL validation

K1 PUBLIC SOURCE PINS15/15 PASS; same-family source QA corrections above incorporated. A separate synthetic Node v24.19.0 probe confirmed identical noncanonical date text has two different finite interpretations in UTC and America/New_York: `SYNTHETIC PARSE-CONTEXT WITNESS PASS: identical text; different timezone interpretations; no real clock proof`. Reproduction is coordinator `work/k1-knowledge-prep/parse-context-diagnostic.cjs`; it is a language-runtime example, not an executed W6 ingress/CLOCK case. Earlier failed inline shell quoting ran no probe and earned no result.

Fresh original gates used real dependency directories, explicit frozen ENGINE_MAIN/ENGINE_OLD and branch client, fixed2026-09-03/TZ America/New_York for conformance/selftest, strict test clock/PL overrides unset. Private preparation stayed local/verdict-only and public pins unchanged. All five processes exited0. Logs: `work/w6-active-gates-2026-09-07T19-41-56-149Z`; scope0.209s, conformance8.610s, selftest25.812s, strict48.499s. No overall usage/savings estimate follows.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
All checks passed. Safe to ship.
```

Two-file scope/whitespace PASS. Product/test source remains unchanged from1a5098d; original browser/135-node evidence is historical, not a new manager run. Twelve K1 groups remain NOT RUN; current-commit CI and independent acceptance remain distinct. The strict tail supplies no private-use/release authorization.

## Previous K1 W5-binding checkpoint — 2026-09-07

Retained PR32, source head `8233f892fe8547deedce3a79c9940b519b042505`. Exactly the existing K1 proposal and this report change. The new §2.1 specifies each published W5 route's request/null combinations, complete signed result, raw browser-visible capture and unsigned error treatment. It pins the actual wire document, fixture, worker, verifier, crypto and canonical implementation alongside the original five sources. No product/core/test/schema, original suite, dependency, frozen app or seeded-soak bytes change.

The proposed manager binds pull.after to the original request and always supplies the existing snapshot expectedWatermark argument. /time requires an OPEN child before beginTimeChallenge's own sample, then durable storage of the returned challenge/request binding before fetch. Its proof cannot resurrect private pendingTime after restart or turn observed timeout into a UTC bound. Genuine configured-service403 retains the published scope17 meaning; arbitrary/error JSON cannot establish standing or a terminal operation result. Invalid/incomplete/failed responses never drain the original outbox or establish clean reconciliation. This does not add renewal, restore, provisioning or combined-recovery APIs.

All new manager/producer cases remain NOT RUN. AUTH/UI/local-sample schemas, origin/custody/ownership barriers, C1 interrupted arms, proof retention and complete replay/closure remain OPEN. The fixed whole-app reporting checklist stays3/10 independently accepted; this is useful authoring, not another accepted app checkpoint. Same-family review is preparation QA, never the designated independent verdict. Fresh source-pin/original-gate evidence and any review correction are recorded below when completed; no full-development time or savings claim.

NEXT: publish this bounded contract update on the existing draft PR32; continue the named authorable auth/UI/local-sample/closure gaps and preserve unresolved C1 evidence. Existing C independently reviews the exact profile; I integrates accepted revisions only. No owner relay, new schedule/model, product rule, private-use or release authority follows.

### K1 W5-binding review and current gates

Same-family QA checked the actual route/signature/state joins and required four wording corrections, incorporated before publication: distinguish signed-message preimage from signature bytes; explicitly reject fetch redirects and retain Response.redirected while never treating captured flags as origin proof; retain immutable queued envelopes on400/413; apply new closed-field rules to K1 wrappers without replacing inherited signed-record validators or dropping extras. This is source review, not an executed manager or independent acceptance.

K1 PUBLIC SOURCE PINS11/11 PASS. Fresh original gates ran on Windows/Node v24.19.0 with real dependencies, explicit frozen ENGINE_MAIN/ENGINE_OLD and this checkout's EARNED_CLIENT_DIR. Conformance/SELFTEST used2026-09-03 and America/New_York; strict unset the test clock and PL overrides. Private preparation remained local/verdict-only and preserved public pins. Every preparation/gate process exited0; log directory `work/w6-k1-w5-gates-20260907`.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
All checks passed. Safe to ship.
```

Measured scope0.203s, conformance6.651s, SELFTEST22.083s, strict47.916s; these are local gate durations only. Two-file whitespace/scope check PASS. The strict tail is old-app validation, not rebuild release permission. Twelve proposed manager case groups remain NOT RUN; no new browser/phone/CLOCK/production acceptance. Exact-head CI remains a publication check.

## Previous K1 authoring checkpoint — 2026-09-07

Retained PR32, source checkpoint `1a5098d44e7cc4202bf3387f22681491bc13714d`. This continuation adds only `w6/K1-MANAGED-INGRESS-CONTRACT.md` and this report. The proposal identifies concrete current gaps: caller-owned responses arrive before the guard, and execute/reopen permission samples are not owned by that guard. It specifies proposed producer ownership, durable root/child records, earliest informative cuts, atomic outcomes, concurrent-write preservation, closure/transfer obligations and ten NOT RUN acceptance groups. The existing source and tests remain byte-identical; no production fence or CLOCK completion is claimed.

The document deliberately retains authorable OPEN bindings: each producer's exact capture/null schema, local-sample/C1 crash comparison, complete source allowlist, ownership/UI/cancellation barriers and proof retention. Web Lock/no-SDK selection remains a proposed profile requiring technical review; actual FAPI/T1/R1/P1/phone evidence is separate. These are Astra authoring responsibilities, not work that inherently requires Fable to draft. The K1 file is a concrete reviewable partial contract, not implementation-ready closure of every binding or permission to alter accepted product semantics. Independent adoption and actual boundary execution remain required.

Source hashes are pinned in the contract; same-family review is preparation QA only. Fresh mandatory original-suite/package/strict results are recorded below when executed. Earlier browser/135-test evidence applies to the unchanged source checkpoint and is not relabelled a new K1 run. Full continuation time was not separately instrumented; no cost or delivery-date guarantee.

NEXT: publish this two-file follow-up on the existing draft PR32. Astra closes the remaining authorable K1 bindings within the retained claim; C independently reviews the exact profile and checkpoint, I integrates accepted revisions only. Keep W6/R1 ownership, model settings and existing coordinator/continuation. No production setup, private use, merge, new stream or owner relay follows.

### K1 authoring validation

All five public source pins in the contract match. Same-family QA found that pre-arming an enabled but unpressed sign-out/switch control can leave OPEN on an idle kill just like intent plus failed persistence. The document now records that concrete C1 comparison and labels preservation of clean bounded restart REQUIRED BUT UNPROVED. It does not invent a new rule or claim the ten proposed K1 cases were executed.

Fresh original gates used Node v24.19.0/Windows, real dependency directories, explicit frozen ENGINE_MAIN/ENGINE_OLD and this checkout's client; conformance/SELFTEST use2026-09-03 and America/New_York, strict unsets the test clock and PL overrides. Normal Git private preparation passed with verdict-only output and unchanged public pins. Every preparation/gate subprocess exited0; log directory `work/w6-k1-gates-20260907`.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
All checks passed. Safe to ship.
```

Scope0.214s, conformance8.659s, SELFTEST25.673s, strict48.405s. These are gate durations, not full engineering time. The strict tail is the old-app verdict only. Unchanged browser/product tests retain their prior evidence; no K1 manager, production/profile validation, independent review or release is newly claimed. Exact-head CI remains a publication check.

## Prior source publication checkpoint — 2026-09-07

The retained SIX-file follow-up from `e01daf9d96d97e096231156486791f554373f7a6` now passes every missing local publication gate. Normal Git, compiler and installed-browser access work in this session; earlier access failures below are historical evidence, not current blockers. No source/test change was needed to pass these fresh gates. The follow-up preserves the complete-pair/key-window/source-fault tests and the previously prepared public-client schema/alias/unknown-proof-family corrections. It changes no frozen app, suite, root lockfile, W5 core or seeded-soak bytes.

Executed with bundled Node v24.19.0, installed Edge Chromium152.0.4191.66, real dependency directories, explicit frozen ENGINE_MAIN/ENGINE_OLD and this checkout's EARNED_CLIENT_DIR. Conformance uses MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict unsets the test clock and both PL overrides. Private preparation was local and verdict-only, public pins preserved, with no Git trust override. Browser profiles and test state were disposable and synthetic; network traffic was localhost only. Clean-build uses the existing frozen W6 lockfile and offline package store.

```text
W6 Node: 135/135 PASS; 0 failed; 0 skipped
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors
FRAME source faults: 5/5 original/behavioral-RED/restored cases PASS
W3: 39/39 PASS
W6 BROWSER BUILD PASS — 33 pinned local inputs; exact client crypto importers only
W6 BROWSER-T2 PASS — 56 exact Node/browser action/state/clock vectors; 6 signed surfaces +36 tamper/domain refusals; actual T2 session/finish persisted in IndexedDB; Chromium 152.0.4191.66
W6 BROWSER-PUBLIC-SINK PASS — verified P-256 disposition through actual T2 and IndexedDB, forged response no drain, original proof retained, final20 abort preserves generation
W6 BROWSER-REPOSITORY PASS — 6/6 real IndexedDB cases; Chromium 152.0.4191.66; persistent process reopen, two-tab CAS, abort and tamper18
W6 FRAME-BROWSER PASS — 26 RFC8452 vectors, fixed frame/AAD and ten refusal controls; actual T2 multi-op final sample, IndexedDB reopen and body-preserving control; Chromium 152.0.4191.66
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
W6 CIPHER-PIN DETECTED — disposable wrong AES input hash refused actual browser build; manifest restored byte-for-byte
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
FROZEN-PATHS PASS
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP bytes verified
PASS engine suite — 3072 assertions passed
PASS APP_V 7.56.0 === sw cache earned-v7.56.0
All checks passed. Safe to ship.
```

The last line is the unchanged old-app check, not rebuild release permission. FRAME-PREVIOUS, FRAME-KEY-BROWSER, FRAME-MIGRATION-BROWSER, FRAME-NONCE-BROWSER and FRAME-OLD-TAB also pass in this run. The first three include an effective disposable browser mutation and literal restoration followed by the passing contract; their expected FAIL lines are sensitivity evidence, not failing restored gates. Existing CAS, key-window and other Node bites also pass. Complete new logs/results and source hashes are retained in coordinator `work/w6-publication-20260907/` and `work/w6-publication-browser-20260907/`; historical logs remain untouched. All gate subprocess exits were 0. Local durations: Node1.353s, W3 0.133s, conformance6.716s, SELFTEST22.217s, strict48.460s; all five browser/build commands together5.987s. The whole continuation was not separately timed.

Product hashes remain `public-client.mjs` SHA256 `43395ee9244c27357c492d0fc909d64bfcf09526e0089f623203bf239b49f3ec` and `frame-repository.mjs` SHA256 `0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0`. Exact-head CI and independent acceptance are separate publication/review steps. Production clock/standing/fence/custody/remote/phone evidence is still BLOCKED; no FRAME/W6/M3 or usable private-app completion is claimed. The sections below retain the chronological evidence and earlier limits; this section supersedes only their current publication/access status.

## What changed and why

This is a reviewable **partial W6 implementation**, not W6 completion or permission to import the owner's data. The actual T2 client can acknowledge a Promise-backed save before it finishes. W6 runs that client against an isolated candidate and publishes its view/acknowledgement only after IndexedDB complete. Abort retains the entry, previous generation and sequence; unproven stored truth refuses18. The new checkpoint also executes actual T2 in a browser, verifies W5 public signatures before durable sinks, preserves original signed proofs and keeps network waits outside the short local staging queue.
Only the independently accepted optional T2 integration seams change: `client/index.cjs`, `lease.cjs`, `sync.cjs`. Defaults remain identical; operation HMAC/identity/canonical contracts and athlete timestamps remain unchanged. All other implementation/test/dependency files are W6-local. No frozen app, engine, existing laws/oracles/runner, W5 source, W3 witnesses or seeded-soak bytes were changed. Root package/lock remain unchanged.

## Base, dependency and authorization receipts

| Receipt | Exact public reference |
|---|---|
| Original branch/base | `rebuild/m3-w6-browser-bridge` from `df09f438a93cb9548ef3f66b28b39deecc7fb347`, preserved |
| Adopted refinement | BRIEF-W6 v1.1, `c31592b5e7fcbb5169075de6c23afbb7d037fd9b`:24 observed hours/64 client-policy slots; rollback invalidates allowance; conditional lease bound; hard knowledge-loss blocker; corrected18/17/19 table |
| Storage contract before code | `7e14ec72a9ab78b861c9a3e913edbb5a467af93d` |
| Independently reviewed storage checkpoint | `e934f9b1787fbe01dc241081594254b5caeb1d8a`; cowork Linux28/28, W3 39/39, browser6/6 and independent effective CAS bite; review explicitly partial, PR32 DRAFT |
| Concrete T2 amendment review | `2f789734d906fb3864ca747abfe6351455b732cc`: cowork ACCEPTS WITH FOUR CONCRETE CHANGES before T2 edits |
| Four corrections applied first | docs-only `cc46d1bbd09e694cb5ba5bfa05a056a0560948e1`; root exact-diff PASS and cowork independent confirmation before implementation |
| W5 callable API first published | `d44706123d4be8844db6f919a8238255b73e3fb2`; WIRE, contract-v1 fixture and public-client.cjs all read, not just the prose contract |
| W5 accepted source/integration | source `9dd8dae3e0955dee079e91a2d0f426cdaac95a9a`; pushed integration `cb5580a3c3b778e614127026a3769d383f07611b`, containing merge `de494a8` |
| Deliberate integration into this branch | `1d3d25356197341539700b6a5713555fe4c484b2`; no conflict, old base/evidence preserved |
| Separate frame proposal | `7cfca45a8dbaae214b4d553a5d33a2b5035f89e3`; documentation only, no new cipher/format installed or frame semantics implemented in this checkpoint |

The four accepted corrections are implemented: invalid optional permission time refuses20 before Lease.check; actual numeric/object/throw T2 sinks normalize after durability with bounded reasons; structural grants permit repeated predicates only within one candidate and renew on CAS retry; final validation explicitly cannot authenticate later H/W_last in presealed ciphertext. Its actual batch metadata and live epoch guards do not earn CLOCK PASS.

## Store, crypto and W5 compatibility

| Boundary | Implemented behavior and remaining limit |
|---|---|
| Repository format1 | One full-generation IndexedDB store, active+previous, all collections/metadata; requested strict durability; revision plus complete authenticated-record token CAS; only complete resolves. AES-GCM-256, random96-bit nonce/tag128, JSON UTF-8; AAD binds format/namespace/revision. This file remains unchanged from storage checkpoint e934f9b. |
| Missing/corrupt store | Refuses18, never infers first use, reseeds, or silently promotes previous. Requires valid surviving inner T2 checkpoint too. Explicit initialization needs injected enrollment authorization. Production key/enrollment custody is still OPEN. |
| Actual staged T2 | Real memory backend and committer, complete generation/reopen, real weighIn/logSet/logSession/finishSession. Missing inner truth clears old paint; abort retains input and does not consume sequence. No copied committer. |
| Three optional T2 hooks | Complete exact-true public verifier pair without HMAC dummy; permission-only time sample; recursively frozen actual batch observer before store transaction. Absent hooks preserve defaults. Throw/object/Promise cannot authorize or drain. Invalid optional time is20 before parsing; athlete effective/time calls remain original. |
| Browser crypto | W6-local @noble/hashes2.2.0 and esbuild0.28.1, integrity-pinned lockfile. SHA256/HMAC subset aliases literal node:crypto imports only in client/ops.cjs and client/plan.cjs; reject other builtins/importers. Exact Unicode/lone-surrogate vectors. No authority signer/private key in the browser graph. External audit1.0.0 is not a2.2.0 audit claim. |
| Actual final metadata | Frozen command/args/snapshotRevision/kind, actual batch count/range/operations, basisMetadata/candidateMetadata and namespace/session/observation epochs. Count is actual actions.length, never an estimate. Samples/metadata precede sealing; live epoch can invalidate runtime changes that durable CAS alone cannot see. |
| W5 wire | Every route POST JSON, `earned/w5-http/v1`; ES256 P-256/SHA-256, low-S64-byte P1363; published canonical/base64url/domain fixtures. W6 uses W5's existing public boundary; no rewritten protocol or re-signing. |
| Signed inputs | Dispositions, pulls, individual receipts, snapshots, leases and challenge-bound server time verify before sinks. Complete original proof bytes remain in generation metadata and are reverified in later candidate/key contexts. Structural grants bind complete signed bytes+scope+epoch and retire after one candidate outcome; repeated face/first/last checks and canonical clones work within it. |
| Actual sinks | T2 deliverReceipts numeric0 is success and storage exceptions are caught; deliverDisposition rejection preserves reason/state. W5 accepted-history snapshots ingest through real T2 receipts, not T2's differently shaped product snapshot. W7's engine projection remains separate. |
| Truthful completion delivery | After IDB complete, a newly changed context gets no Saved or old-account view. Disk stays committed: stored:true/durable:true/confirmed:false/committedRevision, local acknowledged:false or inbound accepted:false. Callers cannot paint from stored:true alone. Subsequent local commands refuse without a new write; RAM latch is not a knowledge-loss fence. |
| Time transport | One outstanding W5 challenge; its network wait does not own the local stage queue. Response verification/staging serializes only after it arrives; no timeout clears an unresolved real guard. A synthetic permitted local write during a pending request proves queue separation, not production fence availability. |
| W5 still OPEN | No sufficient production UTC-error/rate/qualified-RTT bounds, combined terminal/WAITING/history/head/standing/lease-history reconciliation or renewal proof. A different lease refuses rather than inventing renewal. Signed time alone creates no interval/checkpoint C/refill or CLOCK PASS. |

README defines the exact public factory, method/body shapes and exceptional completed-disk presentation refusal. Both an explicit trusted observation guard and final validator are mandatory; tests use **synthetic** guards. No production guard is shipped or implied.

## Executed gates by actual boundary

Windows, Node24; real node_modules directories. W6 dependencies installed using bundled pnpm, `--ignore-workspace --ignore-scripts`, with the committed W6 lockfile. A separate frozen **offline clean install/build** uses fresh dependencies and a copied public source tree without any root node_modules. No account, live Clerk call or private content enters these tests. Synthetic private signing keys are generated per run; none is committed.

`node --test rebuild/m3/w6/test/*.test.mjs`:

```text
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors; accepted T2 baseline cb5580a3c3b778e614127026a3769d383f07611b
ℹ tests 52
ℹ suites 0
ℹ pass 52
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 592.8132
```

The default comparison runs all35 existing client laws in fresh processes against a disposable accepted-T2 checkout and this candidate, comparing exact traces.56 vectors cover real multi-op logSession/finishSession, consent/plan/correction/undo, exhaustion/range crossing, valid projected snapshot and receipt numeric0, four timezone offsets and every clock call/state/return/full backend. The preserved default exhausted face1/write20 witness remains unchanged. New tests also cover structural grants, final actual batch descriptors, whole-generation abort/CAS, forged signatures, signed second-device history, replay, original proof retention, all17/18/19/20 sink/guard failures, context changes after actual IDB complete, subsequent reopen/retry and B11 pending-network control.

`node rebuild/m3/w6/test/browser-contract.mjs` with installed Edge selected explicitly, fresh synthetic profile and localhost-only test traffic:

```text
W6 BROWSER-T2 PASS — 56 exact Node/browser action/state/clock vectors; 6 signed surfaces +36 tamper/domain refusals; actual T2 session/finish persisted in IndexedDB; Chromium 152.0.4191.66
W6 BROWSER-PUBLIC-SINK PASS — verified P-256 disposition through actual T2 and IndexedDB, forged response no drain, original proof retained, final20 abort preserves generation
W6 CLOCK / full STANDING / iPhone acceptance BLOCKED — time bounds, knowledge fence and phone evidence remain unproved
```

`node rebuild/m3/w6/test/browser-check.mjs`:

```text
W6 BROWSER-REPOSITORY PASS — 6/6 real IndexedDB cases; Chromium 152.0.4191.66; persistent process reopen, two-tab CAS, abort and tamper18
W6 browser-T2 / iPhone / CLOCK acceptance NOT RUN — repository-only synthetic evidence
```

That runner's NOT RUN line refers to its repository-only boundary; the separate browser-contract runner above now exercises actual browser T2. Neither proves Safari, abrupt OS-kill survival or the owner's physical phone.

`node rebuild/m3/w6/test/clean-build.mjs`:

```text
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
```

Unchanged W3: `node --test rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs` → **39 tests,39 pass,0 fail**. Retained red-witness assertions still reproduce the old gaps; they do not establish implemented bounded CLOCK.
Unchanged conformance/selftest use explicit ENGINE_MAIN/ENGINE_OLD, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict unsets MEASURED_TEST_NOW. AGENTS private preparation occurred only in ignored local paths, verdict-only; public pins remained unchanged. The existing global temporary cleanup was avoided to protect concurrent worktrees. No private values/counts/dates/receipt text or private hashes are in this report.

```text
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

The strict tail covers the existing app package; it does not certify this partial W6 for private use. Independent cowork execution and both-OS CI of **this new checkpoint** are pending; prior e934f9b storage review is not inherited acceptance of changed bytes.

## Required bite and restoration

The tracked bite changes only a disposable copied bridge to stop awaiting the real IndexedDB transaction. It observes premature acknowledgement, then aborts the delayed transaction. The current source and restored copy are compared byte-for-byte:

```text
IDB-187 FAIL — early acknowledgement before IndexedDB complete; delayed transaction abort left no saved operation (disposable mutant)
W6 BITE RESTORED — bridge.mjs sha256 b3f871ce76295192ef89f79ba074881987848e8731aa2615d398ea037e3d4e3b
```

The52-case run passes after restoration. Historical e934f9b bite restored hash was `f74996052078b7362fe0f8197addb86a8ca515a811a58f43f62dce56fec67354`; later bridge changes intentionally update it. This remains preliminary IDB-boundary evidence, not a full phone IDB-187 verdict.

## Review corrections, seams and red witnesses

1. The original bounded same-family storage review found mutable CAS basis, live candidate references, returned18 retaining truth, missing inner checkpoint treated as first use, an unsupported positional writer exposed and dropped empty collections. W6 fixes were independently rechecked before e934f9b; they are not engine-rule changes.
2. Root's current read-only review found immediate account-switch stale paint, context change after durable complete before result delivery, time-guard failures losing their specific state and time-request waiting blocking local writes. New real-T2 tests reproduce the cuts and verify the W6 fixes. Completed facts remain on disk while confirmation is withheld; no false rollback/abort claim is made.
3. **W6-KNOWLEDGE-LOSS HARD CLOCK BLOCKER:** learned expiry/revocation/rejection followed by failed persistence and relaunch remains unresolved. Production controlled observations need proven durable pre-arm and recovery; ordinary session expiry is11, not automatic17. The injected test guard and RAM late-refusal latch do not satisfy this obligation. No permanent restart fence or new product rule was introduced.
4. **Final-time seam OPEN:** actual batch/evidence metadata and permission separation are now implemented, but presealed ciphertext still cannot authenticate later H/W_last. Live epoch refusal is useful and not durable knowledge persistence. The separate proposed frame requires its accepted mechanics/semantics/key/privacy review before implementation; no silent schema or cipher change here.
5. **W6-RESTORE-BOUND accepted residual:** a coherent old generation can restore old budget/sequence. Encryption cannot distinguish it; keep the owner's bounded exposure and Sol's31-day-kill example, not stealth strict continuity.
6. **W6-LATE-CREATION:** valid offline operations can arrive after lease expiry. No arrival-time expiry, old-envelope rewrite, renumbering or guessed refill/renewal is introduced.
7. Inner T2 count-based integrity is preserved, not claimed as a stronger complete-history validator. Retained previous generation is not a backup. Production keys/enrollment, migrations, full standing and old-tab recovery, authenticated history projection and W8/W9 device/recovery gates remain required. This store does not inherit the seeded soak's survival verdict.

| Required acceptance | Current verdict |
|---|---|
| IDB-187 full matrix | INCOMPLETE:52 Node and actual Chromium T2/repository cases pass; physical/supported-target and remaining matrix not complete |
| MIGRATE schema/key transitions | NOT RUN; format1 creation/corruption only, no adopted frame migration |
| STANDING full signed-response/sign-out/recovery | BLOCKED; tested public sinks/context refusals are partial; production knowledge fence absent |
| CLOCK v1.1 | BLOCKED; time/reconciliation assumptions, allowance implementation, final-time persistence and knowledge-loss contract unproved |
| SESSION-RESUME one real hour/iPhone | NOT RUN |
| Remote/owner-phone/isolated-restore | NOT RUN; no simulated remote success or runner registration |

## Wall-clock and what remains unsure

Historical storage interval: contract at2026-09-06 07:09:31UTC to checkpoint07:27UTC, approximately18 minutes, excluding preparation/review. Current authorized T2/browser implementation interval starts at accepted integration merge08:11:46UTC and ends at this checkpoint around08:36UTC, approximately24 minutes, including tests/report; it excludes earlier amendment review and future independent review/remaining W6. The plan's18 engineering hours remains historical allocation, not measured wall time or a completion guarantee.
Production fence/key custody, finite time assumptions, reconciliation/renewal, full Safari/phone survival and recovery remain uncertain with named blockers above; no credible full-app completion date is inferred from these local test durations.

## NEXT

Subsequent first mechanical-frame checkpoint: corrections890657d matched the already-issued independent R1′/R2′/R3/R4 verdict; clarity-only a5f58e3 preceded implementation. `w6/FRAME-IMPLEMENTATION-STATUS.md` records the exact new API, dependency/source pins and remaining test matrix. New format2 is an explicit separate factory, not an automatic change to the current public client or production permission rules.

```text
ℹ tests 77
ℹ pass 77
ℹ fail 0
W6 FRAME RFC8452 PASS — 26 AES256/counter-wrap vectors
W6 FRAME-BROWSER PASS — 26 RFC8452 vectors, fixed frame/AAD and six refusal controls; actual T2 multi-op final sample, IndexedDB reopen and body-preserving control; Chromium 152.0.4191.66
W6 FRAME semantics / CLOCK / custody / phone BLOCKED — mechanical synthetic evidence only
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
```

This adds25 tests to the52-test checkpoint without changing the T2 amendment or previous public-client code. First-frame engineering interval is roughly08:38–08:49UTC,11 minutes; its remaining matrix and independent execution are not included. Old-tab queued writes, complete migration/key/control-failure cuts, further effective frame mutations and independent review remain incomplete. Existing conformance/selftest/strict receipts above belong to the06d79f4 checkpoint and are not relabelled as final format2 acceptance.
Subsequent independent evidence: cowork accepted exact06d79f4 **scope only**, reporting Linux52 Node,35 laws/56 parity vectors, browser execution and an independently effective truthy-verifier bite. It found pnpm10's interpretation of package-lock=false disabled the lockfile; this branch now explicitly sets lockfile=true. The builder re-executed the documented frozen install and fresh offline clean build with **pnpm10.33.0 and npm_config_lockfile unset**, successfully; its normal dependency cache was populated first. No inherited environment override hides the correction.
Coordinator mechanical witnesses found and reproduced three further gaps: kind2/kind3 could hide a local T2 batch; own typed-array length/slice properties could evade fixed-key/copy rules; malformed previous=null escaped as an untyped exception. The corrections have named Node regressions and actual-browser shadow-input negatives. Further quota/known-state, monotonic evidence, at-CAS predecessor and historical-key cases pass, with two effective restored frame mutants. Current combined Node **86/86 PASS**, actual browser frame **26 RFC vectors/ten refusals PASS**, clean build PASS. See FRAME-IMPLEMENTATION-STATUS for exact lines and still-open matrix; frame code has not received independent acceptance.
Presentation seam for W7: permission-unavailable20 is not proof of expiry; preserve a cause-aware reconnect explanation rather than blindly showing the retained T2 expired-only copy. No current screen/product rule changed.
Final focused correction: non-batch commits preserve existing U, with actual incoming history tested after nonzero local usage; both increasing and reducing U refuse. Focused frame repository18/18 PASS. This adds one test after the full86 run above; no additional full-suite or independent frame acceptance is claimed.
Subsequent tested checkpoint: full Node suite rerun **90 tests/90 pass/0 fail**,603.5764ms; focused frame repository21/21. Added body-crypto failure/delayed final sample, distinct body/frame epoch rotation with historical-key refusal, and aborted compatibility conversion retaining exact legacy bytes. Actual two-tab/versionchange queued-write preservation and old-tab refusal pass; a disposable wrong AES import hash fails the fresh offline build and its manifest restores byte-for-byte. Clean-build used pnpm10.33.0, npm_config_lockfile unset, ordinary populated cache and fresh dependencies. These are additional synthetic mechanical checks, not independent acceptance or a production CLOCK claim:

```text
W6 FRAME-OLD-TAB PASS — queued v1 write commits before version2 upgrade; complete conversion retains it; old tab cannot write after conversion
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
W6 CIPHER-PIN DETECTED — disposable wrong AES input hash refused actual browser build; manifest restored byte-for-byte
```

Remaining mechanics: complete the accepted proposal's per-cut evidence map, any uncovered migration/key/control failure cuts and effective mutations, then independent execution of exact corrected bytes. Old-tab and import-pin checks above are now executed; earlier checkpoint paragraphs record their historical pending status only. Production semantic validators, closed ingress/knowledge fence, sufficient time and reconciliation bounds, key custody/security budget, main-public-client format2 integration and physical Safari/phone gates remain OPEN. No additional feature is inferred from these tests.
Keep **W6** as the same actual claim and PR32 DRAFT. Continue the named remaining focused mechanics tests and independent review, not production permission integration. This prepares W7 integration and W9 physical testing but does not mark W6 done or unblock private import. W5 time/reconciliation/renewal, W4 custody/security budget, knowledge fencing and W8/W9 remain dependencies; no extra implementation stream or merge is claimed.

Latest independent review: cowork accepted exact6032061 narrow mechanics/pnpm correction, reporting90 combined Node,21 focused frame, Chromium141 frame/old-tab and unchanged regressions PASS. Its effective reader-predecessor omission exposed a browser coverage gap; this subsequent test-only correction now detects the same omission in the actual browser, after separately checking altered and coherent-older retained predecessors. No product file changed. Full updated browser runner PASS on Chromium152.0.4191.66, with the expected disposable RED and exact restored hash:

```text
W6 FRAME-PREVIOUS PASS — altered retained predecessor and coherent older substitution refuse18 on actual IndexedDB; complete pair restored
W6 FRAME-PREVIOUS FAIL — omitted reader predecessor recompute accepts coherent older substitution in actual browser (disposable mutant)
W6 FRAME-PREVIOUS RESTORED — frame-repository.mjs sha256 0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
```

The exact bounded public research note is published as `w6/CLERK-INGRESS-RESEARCH.md` for K1 review. Current Clerk JS source has independent refresh/channel paths despite polling:false/touchSession:false. A no-SDK direct Frontend API adapter is a documented option and **unimplemented candidate only**; production cookies/CORS/challenges/JWT and cancellation/closure barriers are unproved. No protocol, account, secret, product exception or SDK dependency was introduced. Browser hardening plus report took approximately09:07–09:09UTC; independent re-execution of these latest tests remains next. Same PR32 DRAFT/claim, production dependencies unchanged.

## Browser key-transition follow-up — 2026-09-07, test-only

The retained branch starts this follow-up at `6f62455bda53f21310c69cd313235d1f5825f062`; original base/dependencies above are retained. Accepted `FRAME-AMENDMENT-PROPOSAL.md` sections4–7 already require historical key lookup, complete retained-pair authentication, no success before transaction completion and effective failure witnesses. Node already covered key loss; the browser runner did not. This follow-up changes only that runner plus this report and the existing frame implementation status. Product/source/dependencies/frozen app/original laws/oracle/goldens/soak remain byte-identical to the retained head.

The new actual-IndexedDB cases execute a T2 multi-operation session with its nonempty outbox, then: abort epoch2 rotation after the active put succeeds but before transaction complete; prove exact old pair after reopening; complete the rotation and reopen both epochs; remove historical body/frame keys separately and require18 without returned plaintext or stored mutation; restore each identical key and recover; and publish a control with frame epoch3 while retaining the epoch2 body exactly. Complete body/metadata/proofs/ops/outbox/U are compared, not only counts. `unproven:true`, no checkpoint and state18 remain explicit throughout.

Environment: Windows/Node24; real dependency directories; installed **Chrome151.0.7922.174** via `W6_BROWSER_BIN`; pnpm10.33.0 via `W6_PNPM_JS`, `npm_config_lockfile` unset. W6 dependency lock is unchanged. Private/reference preparation revalidated reused commit-verified main/old bundles and regenerated ignored fixtures/goldens locally; committed public pins were compared unchanged. This is not a claim that the Windows frozen-engine builder was rerun. No private values, counts, dates, receipts or state hashes leave local preparation.

Reproduction from repo root: enumerate the W6 `test/*.test.mjs` files for `node --test` (Windows needs explicit argument expansion); run `build-browser.mjs`, `test/browser-contract.mjs`, `test/browser-check.mjs`, `test/frame-browser.mjs`, `test/clean-build.mjs` under `rebuild/m3/w6/`; then the unchanged W3 two-file command, W0 `scope-package.mjs`, `rebuild/conform/run.cjs`, `--selftest`, and `scripts/check.mjs --strict`. Conformance uses explicit ENGINE_MAIN/ENGINE_OLD/EARNED_CLIENT_DIR, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict unsets MEASURED_TEST_NOW. Root's complete local gate run was **01:25:13–01:26:37UTC, approximately84 seconds**, after the focused browser run. All commands exited0; earlier evidence remains historical rather than silently overwritten.

```text
W6 Node: tests90; pass90; fail0
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors; accepted T2 baseline cb5580a3c3b778e614127026a3769d383f07611b
W6 BROWSER BUILD PASS — 33 pinned local inputs; exact client crypto importers only
W6 BROWSER-T2 PASS — 56 exact Node/browser action/state/clock vectors; 6 signed surfaces +36 tamper/domain refusals; actual T2 session/finish persisted in IndexedDB; Chromium 151.0.7922.174
W6 BROWSER-PUBLIC-SINK PASS — verified P-256 disposition through actual T2 and IndexedDB, forged response no drain, original proof retained, final20 abort preserves generation
W6 BROWSER-REPOSITORY PASS — 6/6 real IndexedDB cases; Chromium 151.0.7922.174; persistent process reopen, two-tab CAS, abort and tamper18
W6 FRAME-BROWSER PASS — 26 RFC8452 vectors, fixed frame/AAD and ten refusal controls; actual T2 multi-op final sample, IndexedDB reopen and body-preserving control; Chromium 151.0.7922.174
W6 FRAME-KEY-BROWSER PASS — actual IndexedDB rotation abort after request success; epoch2 complete/reopen; two historical-key refusals and same-key recoveries; exact T2 ops/outbox and retained pairs; independent body/frame epochs; unproven remains true
W6 FRAME-KEY-BROWSER FAIL — omitted previous-record unsealing returns a decoded snapshot with missing historical body key in actual browser (disposable mutant)
W6 FRAME-KEY-BROWSER RESTORED PASS — full key contract rerun; frame-repository.mjs sha256 0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
W6 FRAME-OLD-TAB PASS — queued v1 write commits before version2 upgrade; complete conversion retains it; old tab cannot write after conversion
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
W6 CIPHER-PIN DETECTED — disposable wrong AES input hash refused actual browser build; manifest restored byte-for-byte
W3: tests39; pass39; fail0
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
W6 FRAME semantics / CLOCK / custody / phone BLOCKED — mechanical synthetic evidence only
```

Bite: omit `await unseal(previous)` only in a disposable copied repository; the new browser case specifically observes a successful read with the historical body key missing. It must fail that assertion; a build/import failure earns nothing. Restore copied source byte-for-byte, rebuild and rerun the full key contract. Real repository SHA stays `0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0`. Existing predecessor-comparison, partial-charge, early-ack and cipher-pin witnesses remain. One retained helper implemented the bounded test; another reviewed its actual diff/accepted scope without edits. This is same-family assistance, not cowork acceptance.

Seams/unknowns: the new key test reopens repository objects, not an operating-system process; its keys, proof validators and finalizer are synthetic. It demonstrates adapter completion timing, not UI Saved timing. Existing public-browser tests separately exercise the real T2/signature sink. No supported Safari/iPhone, production key custody, permission, time-bound or knowledge-fence verdict follows. CI's existing public jobs do not execute the new browser runner; local Chromium evidence and later independent browser execution must remain explicit. Full accepted per-cut mechanics mapping is still incomplete.

Separately, a local scratch diagnostic exercised a genuine P-256 REJECTED disposition through the existing public client/T2 plus an outer fake-IDB quota abort, with the fixture's declared no-op observation guard. Its12 controls passed, but current state3/stale contribution and fresh-client recovery without18 reproduce the still-missing K1 manager obligations (19 now,18 after unresolved relaunch). This is executed evidence for an already-known integration hole, not a new guard design, a production failure claim, or a reason to weaken acceptance. It changed no tracked source and earns no CLOCK/standing PASS; the retained diagnostic remains local for the next K1 contract review.

## NEXT — current follow-up

Same claimed item **W6**, same draft PR32, no merge. The named browser key-mechanics gap now has executable coverage; independent exact-candidate acceptance is pending. W7 integration/W9 physical preparation gain test evidence, but no production dependency becomes DONE. Next eligible work remains accepted mechanical coverage under this claim; production W6/workout integration still needs R1/T1/K1/P1/W4 and the existing reviewer/integrator. No new approval request, stream, model, schedule or account action.

## Browser migration and nonce lifecycle — 2026-09-07, test-only

This continuation starts from retained `8e7e1b00658f273874c9fe840aadb233a6a83693`. Accepted frame amendment sections5/7 require interruption-safe conversion and fresh attempts across concurrent/retried writes. Existing Node conversion-abort and primitive attempt tests did not exercise those complete browser paths. Add two host test helpers (`test/frame-browser-migration.mjs`, `test/frame-nonce-browser.mjs`) and invoke them from the existing frame browser runner; update only this report and the existing status/coverage map. No product, dependency, T2, frozen app, law/oracle, W5/W3 or seeded-soak bytes change.

Migration: create distinct complete v1 active/previous generations carrying actual T2 operations/outbox and synthetic unknown collection/history. Observe an actual1→2 versionchange abort, then prove database1/stores/both records and v1 decode unchanged. After a successful database2 upgrade but before conversion, ordinary reads/writes refuse18 and leave records unchanged; only explicit compatibility reads expose historical material. Abort conversion after the active put succeeds, require3/no completion and a consumed capability, reopen and compare the entire legacy pair, then prepare a fresh conversion. Success retains the exact legacy active as previous and the complete old body; the frame remains unproven18 with no invented checkpoint/allowance. Missing active with surviving previous refuses both load modes without fallback/reseeding; the synthetic pair restores exactly.

Nonce lifecycle: two actual same-origin pages with separate JS realms stage actual T2 batches against identical pair tokens. Exactly one CAS wins; the loser is retryable and its capability consumed. Reload that page, verify the same winning pair, restage, then exercise an active-request-success abort, consumed aborted capability and repository reopen/fresh retry. Six preparations use six observed frame nonce/body IV pairs, matched to actual stored or aborted record fields; failed cuts preserve complete body/pair/U. Missing RNG refuses preparation3 without durable effect while existing data still authenticates. Draws are deterministic test inputs with separate realm prefixes; they demonstrate calls and value routing, not a production random source/global nonce uniqueness/security budget. Six preparations are not six successful or synchronous frame-encryption invocations.

The effective migration bite omits publishing the legacy active as previous in a disposable repository copy. The full successful conversion then fails its **raw exact-predecessor assertion before unseal**, rather than merely hitting a source pin or generic load error. Restore the copy byte-for-byte, rebuild and rerun the entire migration matrix. Actual `frame-repository.mjs` remains SHA256 `0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0`. Existing key/predecessor/charge/early-ack/pin witnesses remain unchanged. The nonce helper adds no new source-fault coverage claim.

```text
W6 FRAME-MIGRATION-BROWSER PASS — real versionchange abort preserves version1/whole pair; database2 before conversion refuses18; conversion abort after request success preserves both legacy records and consumes capability; fresh retry/reopen preserves exact T2 ops/outbox, unknown/history and legacy predecessor; missing active refuses without fallback/reseed; unproven remains true
W6 FRAME-MIGRATION-BROWSER FAIL — omitted legacy predecessor publish fails exact stored-pair assertion before unseal in actual browser (disposable mutant)
W6 FRAME-MIGRATION-BROWSER RESTORED PASS — full migration matrix rerun; frame-repository.mjs sha256 0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
W6 FRAME-NONCE-BROWSER PASS — two real pages and three realms; six observed frame/body draw pairs across CAS loss, fresh-realm retry, request-success abort and reopen; consumed capabilities cannot write; absent RNG refuses3 without effect; exact T2 history/outbox/U; synthetic draws are not a uniqueness or security-budget proof
W6 FRAME semantics / CLOCK / custody / phone BLOCKED — mechanical synthetic evidence only
```

Reproduce with the same commands/environment listed in the preceding follow-up. The new helpers run automatically from `node rebuild/m3/w6/test/frame-browser.mjs`; no extra build target or dependency. Windows/Node24, real dependency directories, Chrome151.0.7922.174, pnpm10.33.0 and no npm_config_lockfile override. Ignored private fixtures were regenerated locally and public/reference pins revalidated using the disclosed reused commit-verified bundles; no private output or committed golden changes. All required local checks exited0:

```text
W6 Node: tests90; pass90; fail0
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors; accepted T2 baseline cb5580a3c3b778e614127026a3769d383f07611b
W6 BROWSER BUILD PASS — 33 pinned local inputs; exact client crypto importers only
W6 BROWSER-T2 PASS — 56 exact Node/browser action/state/clock vectors; 6 signed surfaces +36 tamper/domain refusals; actual T2 session/finish persisted in IndexedDB; Chromium 151.0.7922.174
W6 BROWSER-PUBLIC-SINK PASS — verified P-256 disposition through actual T2 and IndexedDB, forged response no drain, original proof retained, final20 abort preserves generation
W6 BROWSER-REPOSITORY PASS — 6/6 real IndexedDB cases; Chromium 151.0.7922.174; persistent process reopen, two-tab CAS, abort and tamper18
W6 CLEAN BUILD PASS — frozen W6 lockfile, fresh dependency directory, no copied root node_modules, offline install and actual browser graph
W6 CIPHER-PIN DETECTED — disposable wrong AES input hash refused actual browser build; manifest restored byte-for-byte
W3: tests39; pass39; fail0
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

Timing/evidence: unchanged regression commands ran01:51:00–01:52:22UTC (~82seconds) while the separate nonce helper was finalized; its final integrated frame runner ran01:53:22–01:53:24UTC (~2seconds). Node/product/browser-build inputs of the earlier checks did not change afterwards. The migration helper's prior focused run and the first integrated nonce run both succeeded without unexpected harness failures. One retained agent implemented each bounded helper; a third read their exact source and root executed the integrated runner. This is same-family assistance, not independent acceptance. Root's approximate implementation/review/preparation interval was01:39–01:55UTC (~16minutes), excluding publication/CI and eventual cowork execution.

Seams/unknowns: v1 is synthetic compatibility evidence, not a deployed private migration. IDB abort, repository reopen and page reload do not prove operating-system crash, device reboot or iPhone storage survival. The new six-row section7 coverage index in `FRAME-IMPLEMENTATION-STATUS.md` distinguishes executed mechanics from remaining source-fault/whole-repository epoch/CAS-field checks and production semantics. K1 diagnostic remains RED and was not rerun or changed. T1/P1/R1/W4, production frame integration, independent exact-candidate review and phone/private gates remain open. CI public jobs still do not run these new browser cases; report their local boundary separately from CI.

## NEXT — migration and nonce follow-up

Same W6 claim, same draft PR32, no merge or owner action. These two accepted mechanical coverage gaps are now executed and ready for independent review; next eligible work is the remaining explicit mechanical evidence matrix, not another run of these completed cases. W7/W9 receive preparation evidence only; production W6 and the complete workout app remain dependent on the existing contract, review, backend and physical gates. No new process, branch, model, paid usage or schedule.

## Complete pair CAS — 2026-09-07, local test-only follow-up

Start from retained e01daf9d96d97e096231156486791f554373f7a6 on the same W6 branch/draft PR32. Accepted frame amendment sections5/7 require every current/previous record field and absence marker to participate in the final transaction comparison. Existing complete predecessor mutations ran on load; commit-time checks covered nonce/malformed cases only. Add the missing matrix to test/frame-repository.test.mjs and update this report/coverage map. Product frame repository, dependencies, original laws/oracle/goldens, frozen app and seeded soak remain unchanged.

The matrix primes actual T2 operations with a nonempty outbox, prepares the next batch, then changes the raw pair without any intervening load. It separately tests all ten mutable fields on active and previous: namespace, commitRevision, frameKeyEpoch, frameNonce, frameCiphertext, previousRecordDigest, body.keyEpoch, body.aadRevision, body.iv and body.ciphertext. Both stored AAD revisions exceed one before their decrement, so these are structurally valid cuts. A changed valid active revision yields STALE_REVISION/state3/retryable; the other19 field changes yield FRAME_HEAD_CHANGED_WITHOUT_REVISION/state18. Two absence-marker transitions and a genuinely saved coherent older predecessor also give18. Four format-tag changes have no shape-valid single-field alternative and earn structural-refusal evidence only, not CAS credit.

Each refusal asserts no finalizer/publication, zero record-write calls, one aborted transaction, and an unchanged complete injected pair. Restore the synthetic pair byte-exactly, prove the used capability cannot start a new transaction, then reload/restage a fresh actual T2 batch and verify durable success, complete body/previous/U, and still-unproven state18. That control prevents an always-refuse implementation from passing. These are synthetic validators and fake-IDB transactions, not browser/iPhone or production permission evidence.

Effective bite: remove only the exact pairToken comparison from a disposable native-ESM copy. A valid changed previous nonce then permits the actual T2 batch to publish durably: finalizer1, two record writes, transaction complete, exact staged body. The same new refusal assertion fails for that success; no import/compiler/source-pin failure earns credit. Restore copied bytes and rerun all27 matrix rows. Real source remains SHA256 0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0.

Executed Windows/Node24 commands: node --test --test-reporter=tap --test-name-pattern="full-pair CAS" rebuild/m3/w6/test/frame-repository.test.mjs; then node --test --test-reporter=tap rebuild/m3/w6/test/*.test.mjs (literal glob handled by Node24.19.0). Final exits both0, no skipped tests. Retained local logs: work/w6-full-pair-evidence/focused-final.tap and full-node-final.tap. The original conformance/SELFTEST and W3 commands use MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York and explicit unchanged ENGINE_MAIN/ENGINE_OLD, with EARNED_CLIENT_DIR pinned to this worktree. Direct scope-package execution avoids the already-observed nested Git ownership issue without changing Git settings.

```text
W6 focused full-pair CAS: tests29; pass29; fail0; skipped0
W6 Node: tests119; pass119; fail0; skipped0
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors; accepted T2 baseline cb5580a3c3b778e614127026a3769d383f07611b
W6 FRAME CAS BITE RED — previous.frameNonce comparison omission permitted actual durable publication
W6 FRAME CAS RESTORED — 20 shape-valid field cuts + 2 absent-marker cuts + 1 older predecessor + 4 structural cuts; source SHA256 0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
W3: tests39; pass39; fail0
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
```

Run history: the first fixture assertion compared decoded plain JSON objects with T2's internal null-prototype dictionaries and failed; it was corrected to complete serialized JSON equality, without weakening record-byte assertions or changing product behavior. Its captured failure excerpt is retained and explicitly not a full raw log. The first28/28 targeted and118/118 full run passed before read-only QA found the explicit older-whole-predecessor CAS requirement; that row was added, then the final29/29 and119/119 runs passed. Same-family QA supplements implementation; it is not independent acceptance. Final targeted duration1.061seconds; final full Node1.272seconds; original conformance7.050seconds and SELFTEST23.085seconds. End-to-end wall-clock was not instrumented; approximately15minutes for this bounded continuation including preparation, same-family review, reporting and packaging (estimate, excluding later independent review). The exact measured test durations above are separate; no full-app completion estimate is inferred.

Remaining gates: this local patch is not committed/published. The common Git metadata is outside the session's writable roots and remote HTTPS support is unavailable; preserve retained ownership and do not bypass those controls. The current compiler environment already fails ancestor-directory access in the unchanged strict path on the companion retained branches. No repeated identical compiler attempt or substituted full-build/browser/strict PASS is claimed here; these mandatory checks, exact-revision both-OS CI and independent review remain outstanding before acceptance. Older e01daf9 browser/strict/CI evidence above remains historical. C/I are currently quota-stopped; no paid retry, fallback qualification or model change was made.

## NEXT — complete pair CAS follow-up

Same W6 claim and draft PR32; the named full-pair CAS coverage obligation is locally executed. Publish and independently review this exact patch through the existing route when available. Other accepted source-fault and whole-repository epoch-window coverage remains; R1/T1/K1/P1/W4 and physical/private joins still gate production W6 and the complete workout app. No product-rule change, new schedule, merge or owner action.

## Repository key window and effective faults — 2026-09-07, local test-only follow-up

Same retained e01daf9d96d97e096231156486791f554373f7a6/draft PR32, with preceding local CAS changes preserved. Accepted FRAME-AMENDMENT sections7.3/7.6 name the integrated key-window boundary and effective mechanical source faults. Append to the existing repository test, add test/frame-source-faults.test.mjs and update only this report/status map. Product, dependencies, frozen app, original laws/oracle/goldens and seeded soak remain unchanged. No publication/merge or new branch/stream.

The window fixture encrypts two actual-T2 synthetic generations under exact unchanged v1 AAD at authored revisions2^24−2/2^24−1. Both original v1 and v2 compatibility loaders authenticate them and create genuine trusted snapshots. Real migration writes the last epoch1 revision2^24. The next old-epoch prepare refuses FRAME_KEY_WINDOW/state3, nonretryable, before any capability/finalizer/write transaction, preserving the complete pair. Next independent epoch2 starts at2^24+1, publishes the complete unchanged body via the actual inbound write path, and retains the last epoch1 active as previous. Reopen actually requests both frame/body epochs; removing either historical key separately refuses18 without returning combined truth or changing storage, and reinstating that same key restores exact reads. Epoch1 material/window is never relabelled. This is an authenticated synthetic boundary fixture, not millions of executed commits or a cryptographic invocation-budget proof.

The window bite omits only the exact keyMaterial window condition. The mutant durably writes epoch1 at the first forbidden revision; the constant no-publication assertion goes RED, while an unmutated reader refuses that stored record18. Restore actual mutated bytes, then use a fresh directory/module graph so cached mutated dependencies cannot contaminate the restored test. The full integrated boundary contract passes again.

Five other effective source faults run original source, one exact-site coherent mutation, a constant behavioral law, literal byte/hash restoration of the actual mutated file and fresh restored module graph. Import/fixture/crypto setup failures cannot count as detection:
- FRAME-ATTEMPT-SINGLE-USE: second encryption after success and after throw refuses3; removing the consumed guard permits actual second encryption. The first attempt cleared its copied key, so this is API single-use evidence, not same-key nonce reuse.
- FRAME-CONTROL-BODY: a real T2 batch is staged over already saved operations/outbox. Omitting all three prior-body/entries/digest selections publishes the entire staged body under refusal20 with unchanged U. Exact raw-body comparison precedes load; the bad record reopens, so later decryption failure cannot conceal the hidden commit. Original/restored retain complete prior body/history.
- FRAME-BODY-DIGEST-BINDING: omit only body ciphertext digest from frame AAD. Using its own synthetic key, the fixture creates another valid same-size ciphertext with identical IV/AAD/epochs, changing only a legitimate unknown-collection value. Original refuses specifically at frame authentication; mutant accepts that mixed body with the unchanged frame, predecessor and T2 history. This deliberately test-key-authenticated ciphertext is a component-binding witness, not a production forgery or permission claim.
- FRAME-UNKNOWN-VERSION: an authentic frame carries binary schema2 with other decoded fields unchanged. Removing just the version predicate admits its body/frame; original/restored refuse18. This covers the version predicate, not every possible unknown field or validator. Legitimate unknown collections remain supported.
- FRAME-FINALIZER-SAMPLE: after actual batch preparation, a finalizer supplies later synthetic H/W_last. The fault serializes prior values instead, while storing the complete T2 batch and correct U. Independent raw-frame decryption exposes stale values; original/restored preserve the exact supplied values. This establishes faithful serialization only, not elapsed-time proof, clock freshness or write eligibility.

Final commands on Windows/Node24.19.0: focused node --test --test-reporter=tap --test-name-pattern="repository key window" rebuild/m3/w6/test/frame-repository.test.mjs; focused node --test rebuild/m3/w6/test/frame-source-faults.test.mjs; combined direct node --test --test-reporter=tap rebuild/m3/w6/test/*.test.mjs. The direct combined run uses MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, explicit unchanged ENGINE_MAIN/ENGINE_OLD and worktree-pinned EARNED_CLIENT_DIR. Original conformance/SELFTEST and W3 use the same clock/pins; direct scope-package verifies frozen files and the actual old-app archive. Private artifacts remain local and only verdicts are reported.

```text
W6 repository key-window focused: tests2; pass2; fail0; skipped0
W6 source-fault focused: tests5; pass5; fail0; skipped0
W6 combined Node: tests126; pass126; fail0; skipped0
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors; accepted T2 baseline cb5580a3c3b778e614127026a3769d383f07611b
W6 FRAME WINDOW BITE RED — omitted window allowed epoch1 durable publication at first forbidden revision
W6 FRAME WINDOW RESTORED — exact integrated boundary contract; format SHA256 c2b062eeb075894b9adc173feddd1c4bb56739ee8aedef2056d5642bd9676e61; repository SHA256 0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
FRAME-ATTEMPT-SINGLE-USE ORIGINAL PASS source-sha256=72ead7a77bed7eb61d0a6aebfa7c354a84ec0564cba04458c88cf42fc3b43ac2
FRAME-ATTEMPT-SINGLE-USE BEHAVIORAL-RED mutant-DETECTED source-sha256=3d79a4ecaa016005e26ed37c249e668b85d4e8f718771916901cb5b656b63046
FRAME-ATTEMPT-SINGLE-USE RESTORED PASS source-sha256=72ead7a77bed7eb61d0a6aebfa7c354a84ec0564cba04458c88cf42fc3b43ac2
FRAME-CONTROL-BODY ORIGINAL PASS source-sha256=0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
FRAME-CONTROL-BODY BEHAVIORAL-RED mutant-DETECTED source-sha256=2637b5d491c6eceac69cdc78141e29979a95f1cd7ae5a82ac761a0cb38256494
FRAME-CONTROL-BODY RESTORED PASS source-sha256=0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
FRAME-BODY-DIGEST-BINDING ORIGINAL PASS source-sha256=c2b062eeb075894b9adc173feddd1c4bb56739ee8aedef2056d5642bd9676e61
FRAME-BODY-DIGEST-BINDING BEHAVIORAL-RED mutant-DETECTED source-sha256=4a387d3834446c86b8826b448ad3556c95e3282d1d1eb6ca8a8a210fdb91c95f
FRAME-BODY-DIGEST-BINDING RESTORED PASS source-sha256=c2b062eeb075894b9adc173feddd1c4bb56739ee8aedef2056d5642bd9676e61
FRAME-UNKNOWN-VERSION ORIGINAL PASS source-sha256=c2b062eeb075894b9adc173feddd1c4bb56739ee8aedef2056d5642bd9676e61
FRAME-UNKNOWN-VERSION BEHAVIORAL-RED mutant-DETECTED source-sha256=c4dbe3115a131d181af2263cda919e605f94daf84284226010ce4e8ea17901fe
FRAME-UNKNOWN-VERSION RESTORED PASS source-sha256=c2b062eeb075894b9adc173feddd1c4bb56739ee8aedef2056d5642bd9676e61
FRAME-FINALIZER-SAMPLE ORIGINAL PASS source-sha256=0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
FRAME-FINALIZER-SAMPLE BEHAVIORAL-RED mutant-DETECTED source-sha256=943ed0657a1615e4a7e74e5997043f8138b741cb24f17ad76745e829b8de4da3
FRAME-FINALIZER-SAMPLE RESTORED PASS source-sha256=0a3cbfc9e69cd8853c01b6c290fc67adae2cbe6ca809ee17169d31cf570841b0
W3: tests39; pass39; fail0
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
```

Evidence/history: work/w6-remaining-mechanics-evidence retains focused results and exact source/test hashes, final w6-node-direct.log/result.json and original-regression logs. Window first execution2/2 passed; the source-fault setup initially compared decoded JSON with T2 null-prototype dictionaries (no mutant credit), corrected to exact serialized plaintext while preserving raw-byte assertions. The earlier four-case pass preceded literal-copy restoration refinement and the finalizer case; it remains labelled intermediate. Root's nested-supervisor combined run125/126 failed only at baseline Git ownership lookup; the unchanged direct test command then passed126/126. No test, expected outcome, Git trust setting or product protection was changed to resolve that environment failure.

Timings: focused window192.2ms, source faults349.1173ms, final combined Node1352.104ms; original conformance7.146s and SELFTEST22.869s. This bounded continuation took approximately15minutes including preparation, same-family implementation/review, focused debugging, reports and packaging (estimated wall time; independent review/publication wait excluded). Same-family QA found no remaining concrete mismatch after the named refinements; it is not C acceptance.

Remaining seams: operational key-window enforcement is distinct from OPEN live owner/session/observation epochs. No source test invents a manager for those epochs, production proof validators, sufficient W5 time bounds, the K1 learned-invalidity fence or P1 custody/recovery. No new browser/strict/locked-build/CI verdict is claimed; mandatory full-package completion and independent exact-candidate review remain pending in the retained environment, with the previously documented compiler access and Git-publication limits. Existing reviewer/integrator usage stop was not retried; models, paid use and schedules are unchanged. Prior e01daf9 browser/CI evidence does not accept this local four-file patch.

## NEXT — key-window/source-fault follow-up

Same W6 claim/draft PR32. Keep the combined local CAS/window/fault patch intact for the existing publication and independent-review route. These implemented mechanical gaps now have execution evidence; do not repeat them or convert OPEN production semantics into fixture-only success. Production W6 and full workout development still require the named R1/T1/K1/P1/W4, accepted workout interfaces, real backend/device/recovery/import gates and qualifying C3 evidence. The full EARNED goal remains unachieved.
# Local schema-capability guard follow-up — 2026-09-07

Retained HEAD `e01daf9d96d97e096231156486791f554373f7a6`, same PR32 and ownership. This local follow-up adds a real public-boundary correction to the prior CAS/window/fault tests: `public-client.mjs` now synchronously copies the staged candidate and checks every emitted operation's schema against the already verified lease. A mismatch refuses state20 before sealing, the final commit callback or durable publication, retaining the full entered command and existing generation. No T2/default/schema-version/lease-renewal/clock/frame change. The governing existing requirement is A2:132–140, a capability bound to device/schema; no new training or data-schema authority is claimed.

RED-first: a valid synthetic schema2 P-256 lease plus matching factory configuration let actual unchanged T2 emit schema1 and release Saved. The new test failed with `AssertionError: a verified lease for another schema cannot authorize the actual schema1 T2 writer; true !== false`. This is a future-configuration witness, not an observed owner-data loss or a statement that schema2 is implemented. Actual browser storage here is fake IndexedDB in Node; existing actual-browser evidence belongs to its earlier revision.
Six new public test cases cover single/multiple operations, a mixed batch whose first operation matches but a later one does not, unchanged disk/sequence/outbox/input and no final cut; known standing17 precedence before execution and session17/observation18 precedence when the real stage changes context; existing default-schema mismatch18; and a supplied stage's queued post-inspection mutation. The implementation captures the actual candidate rather than hardcoding a currently supported version or stamping a new one onto old operations. General malformed-batch checks and the required external production validator remain. Same-family read-only QA identified the alias and mixed-member controls; it is not independent acceptance.

```text
W6 public boundary:22/22 PASS
W6 full Node:132/132 PASS,0fail,0skip
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors
W6-SCHEMA-BITES 4/4 EFFECTIVE: missing guard / first-member-only / post-check alias / staging-context priority
Restored public-client.mjs SHA25600b0eecb7fccb117ca4cc3d0e905a13acf49ccebce8e6312471ab3effe356f3f
W3:39/39 PASS
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
```

Each temporary product bite caused the ordinary assertion to fail behaviorally; literal bytes were restored in finally before the final focused/full package. No missing-module, syntax, source-pin failure or merely altered implementation text earned mutation credit. Omitted guard and first-member-only returned Saved incorrectly; omitted synchronous copy durably stored schema2 despite a checked schema1 candidate. Final full-node duration1554.5338ms; times are local evidence, not a performance promise. Logs/source pins/bite runner are retained in `work/w6-schema-guard-evidence` in the coordinator workspace. The complete continuation was not separately timed.

Final same-family QA found a staging-time precedence cut: real T2 staging changed the session or observation epoch before returning an otherwise successful mismatched candidate. Both tests failed RED (`20 !== 17`, `20 !== 18`). The schema refusal now checks the existing context-failure policy first; both pass with unchanged durable bytes and no final validator call. Removing that recheck is the fourth effective behavioral bite. This is a scoped correction at the new refusal branch; it does not implement a production observation guard or knowledge-loss fence. All mandatory runnable local checks above were repeated on the final corrected source.

Current limits: no fresh bundle/browser/strict/CI, publication or C acceptance. The existing compiler/filesystem and Git-metadata restrictions remain; unchanged failing compiler setup was not retried or replaced. Mandatory missing checks remain prerequisites of acceptance/integration. No service/account/private/soak interaction. The cumulative public patch now covers SIX files and supersedes the old four-file W6 patch; preserve the earlier artifact and do not apply both. Existing frame source and accepted core/laws stay intact.
NEXT: independently review this small existing-capability correction with the retained W6 packet; complete missing build/browser/strict and exact-head CI through the authorized route. Continue the real workout schema/projection and R1/T1/K1/P1/production joins; do not treat this fix or132tests as owner-workout/private-import readiness. No new queue, schedule, model or implementation stream.

## Local historical-proof dispatch repair — 2026-09-07

Same retained head e01daf9/PR32 and SIX cumulative local files. The new product delta is confined to `public-client.mjs` `verifiedHistory`: accept a persisted proof-family name only when it is an own entry in the declared disposition/pull/snapshot/lease/time method map. Previously an own JSON key named constructor/toString/__proto__ found Object.prototype values. An empty unknown family bypassed verification; a populated one could throw and produce ordinary save failure3, leaving earlier published truth visible, instead of integrity refusal18. This implements the existing unknown-proof/integrity contract; no new schema, signed bytes, time/fence policy, frame format or accepted T2/authority semantics.
RED-first used the existing fixture pattern: the test owns its synthetic sealing key and writes an outer-valid generation with invalid inner proof metadata, after a successful prior paint. It is not a forged ciphertext, private-data exploit or observed owner-ledger corruption. New ordinary assertions failed: empty map `true !== false` (Saved), populated map `3 !== 18`. The fix returns the existing `HISTORICAL_PROOF_UNPROVEN`18 before any final permission callback, preserves complete durable generation/input, hides old truth and refuses a fresh reopen.
Three new tests cover four unknown family names in both empty/populated forms and all five allowed empty-family maps. Existing authentic disposition/pull/snapshot/lease/time and bad-signature tests remain. This does not claim a complete schema for the optional outer wireProofs value: the existing contract permits generic JSON metadata and its producer uses maps, but does not yet expressly settle every empty/falsy outer representation. Same-family QA recommended keeping that distinct from the proven unknown-family error; no broad extra refusal was added.

```text
W6 public boundary:25/25 PASS
W6 full Node:135/135 PASS,0fail,0skip
W6 DEFAULT PARITY PASS — 35/35 client laws and56 exact action/state/clock vectors
W6-PROOF-FAMILY BITE EFFECTIVE — unknown empty family Saved; populated family3 instead of18
W6-SCHEMA-BITES 4/4 EFFECTIVE: missing guard / first-member-only / post-check alias / staging-context priority
Restored public-client.mjs SHA25643395ee9244c27357c492d0fc909d64bfcf09526e0089f623203bf239b49f3ec
W3:39/39 PASS
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
```

The new own-entry-check omission reproduces both ordinary assertion failures. All four previous public-client bites were also re-executed on this final source after the new change; each source restoration is literal and focused25/25 pass. No missing dependency, syntax/pin error or merely changed source text earned mutation credit. Focused test duration222.7102ms; combined Node1421.3142ms; these are local execution timings, not a speed guarantee. The full continuation was not separately timed; the manifest records the observed evidence/packaging window. Same-family source/test review is preparation QA, never the mandated independent acceptance.
Evidence is retained under coordinator `work/w6-proof-family-evidence`: red-first, final public/full Node, original conformance/selftest/W3/scope outputs, source hashes and five restored behavioral bites. Full Node and original regressions used explicit ENGINE_MAIN/ENGINE_OLD, gate date2026-09-03, America/New_York and this checkout's client. Logs stayed outside the repository. No new browser/build/strict/exact CI/publication/independent verdict is claimed; unchanged compiler-access failures were not retried or bypassed. Private, remote and seeded-soak state were untouched.
NEXT: the current SIX-file W6 patch supersedes the earlier SIX-file patch from EARNED-next-workout-step.zip; do not stack them. Fresh local build/browser/strict and all other mandatory publication gates now PASS as recorded at the top. Publish on the retained PR32, verify exact-head CI and request independent execution of this bounded checkpoint; the builder does not merge. This supplies W6/W9 review evidence, not W7/OWNER-TODAY permission. Astra retains the same W6 claim and takes only the next contract-ready workout dependency after its own prerequisites resolve; otherwise record the exact blocker. PR46 v0.6 and PR47 have separate acceptance paths. Production/storage/clock/custody and full-workout contracts still gate owner use. No new task, model setting, schedule, purchase or owner relay.
