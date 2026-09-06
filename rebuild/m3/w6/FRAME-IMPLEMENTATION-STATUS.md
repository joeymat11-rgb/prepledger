# W6 frame mechanics — first runnable checkpoint, incomplete

Authorization: Cowork accepted mechanical proposal7cfca45 with R1–R4 and the coordinator's R1′/R2′ correction. Docs890657d were matched by the coordinator before code; a5f58e3 separately clarified that code checkpoint06d79f4 still awaits independent execution. This is the same W6 claim/PR32 DRAFT, not production permission or CLOCK acceptance.

## Implemented scope

- `frame-format.mjs`: closed352-byte encoding, maximum922-byte AAD, exact v1/v2 typed records, complete predecessor digest and full-pair token. Unknown fields/types/accessors/reserved bits, missing reference bytes and unsafe numeric fields fail. Frame key epoch revision windows are enforced as operational rotation only.
- `frame-crypto.mjs`: fixed32-byte key/12-byte nonce,352-byte plaintext/368-byte ciphertext; private copies and one encryption per opaque attempt, burned before a throw. AES256GCM-SIV only. An abandoned/aborted attempt cannot be reused. No claim of global nonce uniqueness, hardware key isolation or durable attempt budget.
- `strict-json.mjs`: explicit-stack duplicate-decoded-name pre-parser then native JSON.parse; UTF-8 fatal, no trailing content, finite numbers, no arbitrary nesting cap; insertion order and native string/number semantics retained. Safe integer requirements belong to typed frame schemas. A bounded child wrote only this parser and its focused tests; this is same-family implementation, not independent review.
- `frame-repository.mjs`: **opt-in separate factory**, not silently substituted into the current W6 public client. Full body prepares asynchronously; proof validation, batch comparison and large digests precede the final callback. The small final frame encrypts synchronously, then active+previous commit in one real transaction, and success waits for complete. Control refusals preserve the exact prior body and U, never publish staged operation data. Current operations use actual T2 batch descriptors and full ops/outbox; partial slot charging refuses.
- The opaque expected snapshot must be the object returned by this repository's `load()`; its authenticated contents are retained as a private copy. Caller mutation cannot substitute prior-body metadata/U. Returned copied/forged snapshot objects are not accepted as authorization. CAS still checks exact active+previous bytes in IDB, independent of that local ownership safeguard.
- Read authenticates both retained records; previous uses its own stored parent digest, so no third generation is required. Any changed previous field or coherent older predecessor substitution refuses18. Coherent complete old active+previous restoration remains the accepted residual.
- Explicit v1 conversion is synthetic compatibility only. Legacy bytes use the original v1 key-provider/AAD; kind3 retains the full v1 predecessor. No checkpoint/refill is invented; resulting unproven state remains18. Version1 open against version2 refuses; no deleting/recreating storage.
- Unknown proof kind/version validators refuse. No production semantic validators are implemented. Tests explicitly inject synthetic batch validation and a synthetic finalizer. Missing checkpoint/guard resolution is returned as `unproven:true`, never a fresh allowance.

Exact new factory: `openFrameRepository({indexedDB?,crypto?,databaseName,namespace,bodyKeyProvider,frameKeyProvider,legacyKeyProvider?,proofValidators?,authorizeEnrollment?})`.
Methods: `load({compatibility:false}?)`; `prepare(loadedSnapshotOrNull,body,{bodyKeyEpoch,frameKeyEpoch,batch:null,compatibility:false})` returns an opaque one-use capability; `commitPrepared(expectedSnapshotOrNull,capability,finalizeSync,{enrollmentEvidence}?)`; `close()`.
The finalizer receives a copied frozen authenticated basis, actual batch and prepared body identity. It returns the proposal's publish/control/abort union. Future live owner/session/observation/fence checks remain the caller's unimplemented production contract; current tests demonstrate a synthetic epoch abort only. No generic success from this mechanical repository permits a product view, Saved, private import or clock checkpoint.

## Dependency and source review

Exact package2.4.0, release commit `4b0040dd772f0de985bd8cc2d1cf46dfa3a62b43`, integrity and the three actual browser input hashes are tracked in `cipher-imports.json` and the W6 lockfile. Browser build rejects changed/unlisted cipher inputs. Actual imports are aes.js, _polyval.js, utils.js; neither root dependencies nor the authority signer changes.
Primary source review checked [pinned AES-GCM-SIV implementation](https://github.com/paulmillr/noble-ciphers/blob/2.4.0/src/aes.ts), input wrapping, and the [1.0.0→2.4.0 source changes](https://github.com/paulmillr/noble-ciphers/compare/1.0.0...2.4.0) around input ownership, typed arrays, endian/POLYVAL conversion and cipher renaming. These files changed substantially; this focused integration review is not a new cryptographic audit.
The actual gcmsiv body independently limits its nonce to12 despite varSizeNonce metadata; the wrapper still proves its own exact12 rule. The library accepts a24-byte key extension, which this adapter refuses. Published independent audit coverage is1.0.0 (`2b9e8e30245b3aaa5356ac3319d91c8e1c660fb6`), not2.4.0. No constant-time/guaranteed-zeroization claim.
[RFC8452](https://www.rfc-editor.org/rfc/rfc8452) is Informational IRTF/CFRG. Section1's two-message equality description is qualified by section9 usage/security bounds. Operational2^24 revision rotation does not count aborted encryptions or prevent coherent-restore reuse, so a production per-key attempt budget remains OPEN.
The26 committed AES256/counter-wrap public test vectors derive from RFC8452 C.2/C.3 via the pinned vendor vector file; they are public synthetic vectors, not real application keys. Node/browser execution of the same library is bundle parity, not independent implementations.

## Evidence and remaining work

Initial c238e7b had16 codec/parser tests and9 frame-repository tests. After coordinator review corrections, codec/parser17 and repository17 pass: entire current W6 suite **86 tests PASS/0fail**, including unchanged35-law/56-vector defaults and original early-ack bite. Actual Chromium frame runner:

```text
W6 FRAME RFC8452 PASS — 26 AES256/counter-wrap vectors
W6 FRAME-BROWSER PASS — 26 RFC8452 vectors, fixed frame/AAD and ten refusal controls; actual T2 multi-op final sample, IndexedDB reopen and body-preserving control; Chromium 152.0.4191.66
W6 FRAME semantics / CLOCK / custody / phone BLOCKED — mechanical synthetic evidence only
```

Reproduce from root: `node --test rebuild/m3/w6/test/*.test.mjs`; with W6_BROWSER_BIN set, `node rebuild/m3/w6/test/frame-browser.mjs`; `node rebuild/m3/w6/test/clean-build.mjs` under the existing W6 package-manager selection. No remote/account/phone action.
Coordinator witnesses found kind-tag charging bypasses, shadowed typed-array/ArrayBuffer size/copy methods, and an untyped malformed-previous error. All are now named regressions: kind2 publish is refused on existing bases; kind3 requires explicit valid v1 conversion; kind1 cannot add a local outbox/sequence and its positive case uses actual T2 synthetic incoming history (not a production signature proof). Captured intrinsic lengths/set copy plus closed instance properties enforce actual32/12 and private ownership in Node and browser. Null/primitive/malformed previous data gives18 during read and same-revision CAS.
Additional executed cases: control quota failure retains known20 in-process with durable:false but cannot claim durable knowledge; invalidation/H/W_last cannot regress, and guard/checkpoint closure transitions remain unimplemented/refused. Missing historical body/frame keys refuse18. Same-revision predecessor changes fail at the transaction cut. Disposable partial-charge and predecessor-comparison mutations each demonstrably produce the wrong durable result and are restored byte-for-byte:

Follow-up correction after86-test checkpoint: any non-batch commit on an existing v2 basis must preserve U exactly while checkpoint transitions are unavailable. Actual T2 incoming history now tests priorU>0 with upward/downward attempts refused and the unchanged-U positive accepted. Focused frame repository18/18 PASS; the previously recorded full86-test run predates this one additional test and is not relabelled without rerunning.

```text
W6 FRAME MUTANT DETECTED — partial-charge; actual wrong durable result witnessed; copy restored byte-for-byte
W6 FRAME MUTANT DETECTED — predecessor-compare; actual wrong durable result witnessed; copy restored byte-for-byte
```

Still required before this mechanics implementation is complete: full old-tab/versionchange queued-write race; remaining migration/crypto/key-transition fault cuts; import-pin sensitivity; remaining effective mechanical mutations; exact-byte independent re-execution. These are remaining implementation tests, not waived gates.
Still blocked beyond mechanics: production semantic proof/transition validators, owner/session/closed-ingress and child-obligation coordination, finite W5 time assumptions, reconciliation/renewal, actual final-cut allowance policy and knowledge-loss recovery, per-key security/custody/retained-body limits, supported Safari/phone evidence. The current main public factory still uses format1; integrating format2 into it is separate remaining W6 work after those contracts and mechanical review.

NEXT: retain this first runnable mechanical checkpoint separately from the exact06d79f4 T2 review. Continue the named focused matrix and independent review under the same claim. No full FRAME, W6, CLOCK, private-use or M3 completion claim.
