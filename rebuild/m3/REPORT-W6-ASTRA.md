# W6 — storage, T2 staging and public browser integration, ASTRA

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

The exact bounded public research note is published as `w6/CLERK-INGRESS-RESEARCH.md` for K1 review. Current Clerk JS source has independent refresh/channel paths despite polling:false/touchSession:false. A no-SDK direct Frontend API adapter is a documented option and **unimplemented candidate only**; production cookies/CORS/challenges/JWT and cancellation/closure barriers are unproved. No protocol, account, secret, product exception or SDK dependency was introduced. Browser hardening plus report took approximately09:08–09:10UTC; independent re-execution of these latest tests remains next. Same PR32 DRAFT/claim, production dependencies unchanged.
