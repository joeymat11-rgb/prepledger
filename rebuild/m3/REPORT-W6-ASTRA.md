# W6 — independent storage/staging slice, ASTRA

## What changed and why

This is a reviewable **partial W6 implementation**, not W6 completion or permission to import the owner's data. The real T2 client can acknowledge a Promise-backed save before the write finishes. The new W6 boundary runs that unchanged client against an isolated candidate and publishes its view/acknowledgement only after an IndexedDB transaction completes. An abort retains the entry, exact previous generation and sequence. Missing or unproven stored truth enters state 18 and clears the previously published view.

Branch `rebuild/m3-w6-browser-bridge`; integration base `df09f438a93cb9548ef3f66b28b39deecc7fb347`. This base records cowork's acceptance of BRIEF-W6 v1.1 (`c31592b5e7fcbb5169075de6c23afbb7d037fd9b`) and the retained **24 observed hours / 64 operation slots**, rollback allowance invalidation, conditional lease mapping, hard knowledge-loss blocker and corrected18/17/19 table. These rules are not implemented by preserving a metadata object. No budget, CLOCK or full standing acceptance is claimed here.

The local storage contract was committed before implementation as `7e14ec72a9ab78b861c9a3e913edbb5a467af93d`. During this build W5 published `d44706123d4be8844db6f919a8238255b73e3fb2`; I read its `w5/WIRE.md` and `w5/fixtures/contract-v1.json` directly at that commit. Post-checkpoint correction: its callable `public-client.cjs` implementation already exists at the same SHA; I have now read that implementation and pinned its exact factory/sinks in the concrete amendment proposal. The earlier statement that publication was still needed was too cautious. No W5 file was copied or changed. There are no T2, frozen-app, engine, existing-law/oracle/runner, W3 or seeded-soak changes.

## Module map and compatibility

| File or boundary | Implemented behavior and remaining limitation |
|---|---|
| `w6/repository.mjs` | One full-generation IndexedDB store, active+previous; strict durability requested, actual mode reported; revision+whole authenticated-record token checked inside the same transaction. Encryption occurs before that transaction; only complete resolves success. Stale snapshots retry through the bridge. |
| Local seal | AES-GCM-256, fresh random 96-bit nonce, 128-bit tag, JSON UTF-8 payload, AAD binding `earned/local-generation/v1`, format 1, installation namespace and revision. Key provider is injected. Synthetic keys only; production custody, recovery and key/schema migration are unimplemented. Integrity is not freshness. |
| Generation | Every supplied T2 collection/key/value, including unknown empty collections, plus W6 metadata. Exact JSON-safe values required. Previous generation is retained atomically but never silently promoted or used to reseed. |
| `w6/t2-stage.cjs` | Node-only adapter calls the actual unchanged T2 client/memory backend. Requires its surviving valid inner checkpoint and integrity before boot; allowlisted real actions are weighIn, logSet, logSession and finishSession. No copied committer or simulated browser crypto. Existing public synthetic HMAC test material stays in Node tests; it is not a phone authority-key design. |
| `w6/bridge.mjs` | Serializes commands/reopen per instance; independent instances rely on stored CAS. Clones submission, staging result and published result/view. No candidate is exposed while commit waits. Thrown or returned18 clears truth; failed writes retain typed input. Final validator is mandatory and synchronous. |
| W5 wire now known | Every route is POST JSON, version `earned/w5-http/v1`; ES256 P-256/SHA-256, low-S 64-byte P1363 and canonical base64url/domain fixtures. This slice invokes none of its transport APIs and does not pretend Node T2's shared-HMAC verifier accepts P-256. |
| W5 still OPEN | Its callable public API is pinned, but `/enrol` is a preprovisioned lookup and `/lease` supplies current capability. No combined terminal/WAITING/history/head/standing/lease-history reconciliation or renewal proof; no sufficient production UTC-error/rate/qualified-RTT bounds. No checkpoint C, `[Tlo,Thi]`, refill or CLOCK PASS follows from signed time alone. |
| `w6/T2-AMENDMENT-PROPOSAL.md` | PENDING REVIEW: exact index/lease/sync allowlist, factory signatures, unchanged defaults, actual batch/final-cut metadata and W6-local @noble/hashes 2.2.0 / esbuild 0.28.1 dependency proposal. W5 sink normalization preserves underlying states 17/18/19/20. BRIEF-W6 references the proposal; no T2 edit or dependency installation/build is authorized by publication alone. |

## Executed gates, with their actual boundary

Windows, Node 24; real `node_modules` directories, no symlink or root-lockfile change. The host has no npm executable, so the bundled pnpm installed development dependencies with `--ignore-scripts --lockfile=false --node-linker=hoisted`. W6 pins fake-indexeddb 6.2.5 and playwright-core 1.62.1. README gives normal npm reproduction; an already installed pinned Playwright package was selected explicitly for the browser run.

`node --test rebuild/m3/w6/test/*.test.mjs` (latest run):

```text
ℹ tests 28
ℹ suites 0
ℹ pass 28
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 145.3079
```

Those tests include the actual T2 early-Saved witness, delayed transaction completion and abort, injected quota after the first generation write, exact fresh-client reopen, concurrent independent writers, whole multi-operation sessions, corruption/missing-key/binding failures, stale basis mutation, returned18 after prior truth paint, missing inner checkpoint, whole-collection preservation and mutable candidate isolation. Fault injection wraps IndexedDB outside product code. Metadata equality proves preservation, not implemented allowance charging.

`node rebuild/m3/w6/test/browser-check.mjs` with an explicitly selected installed Edge and pinned Playwright (fresh synthetic profile, external traffic refused):

```text
W6 BROWSER-REPOSITORY PASS — 6/6 real IndexedDB cases; Chromium 152.0.4191.66; persistent process reopen, two-tab CAS, abort and tamper18
W6 browser-T2 / iPhone / CLOCK acceptance NOT RUN — repository-only synthetic evidence
```

This executes the repository inside a real browser, compares the entire synthetic T2-generated payload after closing/reopening the browser process, races two tabs, refuses an injected17 and detects persisted tampering after relaunch. T2 itself runs in Node to prepare the candidate; it is **not** browser-T2 integration, Safari, abrupt OS-kill durability or physical iPhone evidence.

Unchanged W3: `node --test rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs` → **39 tests, 39 pass, 0 fail**. Existing red-witness assertions remain unchanged; their successful reproduction does not make strict continuity true or implement the v1.1 refinement.

Full unchanged regressions used explicit ENGINE_MAIN/ENGINE_OLD built from pinned public sources with accepted W0's builder. AGENTS' private fixture/golden preparation was performed only in ignored local paths; the committed pins matched and no private values, hashes, counts or receipts were emitted. The original builder's global temporary-worktree cleanup was avoided so other active worktrees remained untouched. Public goldens/manifest remained byte-identical. Suite/selftest used MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; strict removed MEASURED_TEST_NOW.

```text
PRIVATE PREPARATION PASS — private fixture/golden match committed pins; public pins unchanged; no other worktree touched
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

The strict tail concerns the unchanged existing app package; it does not certify W6 for private use. `git diff --check` passed. Linux/both-OS CI and independent cowork execution are NOT RUN by this builder.

Post-checkpoint independent evidence, relayed by the coordinator: cowork re-executed exact `e934f9b` on Linux, reporting 28/28 storage tests, 39/39 W3 and 6/6 browser cases on Chromium 141. Cowork's separate disabled-CAS bite was detected by the Node and browser tests and restored. It reported no checkpoint defects while expressly withholding full W6 acceptance and keeping PR32 DRAFT. This independent storage review does not accept the new T2 amendment; its verdict is still pending. The docs-only follow-up leaves all submitted product/test bytes unchanged.

| Required acceptance | Current verdict |
|---|---|
| IDB-187 full browser-T2 / physical matrix | INCOMPLETE;28 preliminary Node cases and6 real browser repository cases above; no full IDB-187 PASS claimed |
| MIGRATE schema/key transition and old-tab matrix | NOT RUN; format1 creation/absence/corruption coverage only |
| STANDING whole signed-response/sign-out/recovery table | BLOCKED; only storage refusal/final-cut17 tests implemented |
| CLOCK v1.1 | BLOCKED; sufficient W5 time/reconciliation assumptions and proven knowledge-loss fence absent; allowance implementation pending |
| SESSION-RESUME one real hour / iPhone | NOT RUN; no elapsed time accelerated into acceptance |
| HTTP/signature integration, remote, owner-phone, isolated-restore | NOT RUN; no runner registration or simulated remote success |

## Required bite and restoration

Tracked `w6/test/bite.test.mjs` alters one awaited commit in a disposable copied bridge, leaves the real fake-IndexedDB transaction pending, observes premature acknowledgement, then aborts that transaction. Exact negative verdict and restored source hash:

```text
IDB-187 FAIL — early acknowledgement before IndexedDB complete; delayed transaction abort left no saved operation (disposable mutant)
W6 BITE RESTORED — bridge.mjs sha256 f74996052078b7362fe0f8197addb86a8ca515a811a58f43f62dce56fec67354
```

The altered copy was restored byte-for-byte and compared, and the original source was unchanged throughout. The affected 28-case run passed after restoration. This proves bite sensitivity at the preliminary boundary, not full phone IDB-187 acceptance.

## Review corrections, seams and red witnesses

One bounded same-family agent reviewed storage code/tests and executed synthetic probes; it is not the independent cowork reviewer. It found six defects in the draft: mutable expected CAS basis during encryption, live candidate view/result references, returned18 retaining old truth, missing T2 checkpoint treated as first use, an unsupported positional writer exposed through a single-argument dispatcher, and dropped unknown empty collections. All six were fixed in W6 only. The reviewer re-ran five exact regression cases (5/5 PASS) and confirmed removed unsupported actions refuse without durable changes. Root independently identified the returned18 problem; the actual T2 corruption witness now clears view, retains input and makes no new operation/sequence.

1. **Actual batch/final-cut seam OPEN:** validator currently receives command, cloned args and snapshot revision only. A reviewed T2 amendment must publish actual committer batch count/range and candidate allowance/standing/fence metadata, then charge it in this same transaction. No guessed count, fake checkpoint or unconditional production validator is supplied.
2. **Time/identity seam OPEN:** keep athlete effective timestamps and HMAC preimages unchanged; permission evidence cannot replace all clock calls. T2's Node crypto and shared-HMAC authority verifier need narrow reviewed integration, not a duplicate committer or re-signing W5 responses.
3. **W6-KNOWLEDGE-LOSS HARD CLOCK BLOCKER:** durable local success does not solve learned expiry/revocation/rejection followed by failed persistence and relaunch. Controlled remote verification/sign-out channels need proven durable pre-arm/recovery coverage; ordinary session expiry remains11, not automatic revoked17. No blanket restart fence is implemented. Root's separate evidence note is preparatory analysis, not an accepted amendment.
4. **W6-RESTORE-BOUND accepted residual:** a coherent old generation may restore old budget/sequence; encryption cannot distinguish it. Preserve the owner's bounded-rule exposure and Sol's31-day-kill example; do not reopen strict by stealth.
5. **W6-LATE-CREATION:** valid offline envelopes can arrive after lease expiry; no arrival-time expiry rule, renewal rewrite, renumbering or old-envelope replacement is introduced.
6. The outer seal does not prove inner product completeness; preboot T2 integrity is required. Its existing count-based integrity semantics are unchanged; this wrapper does not claim a new full semantic-history validator.
7. Retained previous encrypted generation is not a backup/recovery protocol. Full-generation write cost, key epochs, schema migrations, independent tab standing, old-store restoration, eviction and physical commit timing need their remaining gates. Production identity/key custody and real recovery still depend on W4/W8.
8. W7's remote-history projection and W9's actual-device tests remain unimplemented. The different sealed store cannot inherit the seeded soak's eventual survival verdict.

## Wall-clock and what remains unsure

The contract commit at 2026-09-06 07:09:31 UTC precedes this report checkpoint at 07:27 UTC: approximately 18 minutes for this implementation/testing interval, excluding earlier preparation, subsequent independent review, W5 work and remaining integration. The plan's 18 engineering hours is historical allocation, not an elapsed-time result or a promise that remaining W6 takes that long. Missing remote, browser-T2 and physical evidence has no defensible completion date here.

## NEXT

Actual claim remains **W6** on this branch; this is the storage foundation for later W7 integration/W9 testing, not a completed predecessor or private-port unblock. The storage checkpoint has cowork's preliminary re-execution; root obtains the separate independent verdict on the now-published concrete BRIEF-W6/T2 amendment before any T2 or dependent build work, using the pinned W5 callable API. W5 time/reconciliation/renewal, W4 custody, knowledge-loss fencing and W8/W9 remain explicit dependencies. Original base is preserved; no next implementation stream, full W6 acceptance or merge is claimed by this report.
