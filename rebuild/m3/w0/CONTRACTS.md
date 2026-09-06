# W0 contracts and handoff — version 1

Source baseline: `8fa4912093be7d7fdf9164343be0473d2127e042`, PLAN-M3-v1 §§1–3/6, DECISIONS (including the superseding 2026-09-06 role ruling), runtime v1.7.38 and the accepted T2/T3/M2 scorecards. This publishes requirements; implementation acceptance is separate. The PR commit containing this file pins its version.

## Settled inputs

| Contract | Required behavior | Next owner / evidence |
|---|---|---|
| Scope | One Today screen first; I1 preview uses synthetic values and earns no remote/offline/two-phone PASS; complete I1 still requires those actual tests | W7/W9; PLAN §1/6 and DECISIONS acceleration entry |
| Mock | Build from `rebuild/m1/earned-mock.public.html`, SHA256 `e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563`; artifact ID `65168842-178a-40c6-a503-e44d56aa11a8` | W7-PREVIEW; `rebuild/m1/MOCK.md` @8fa4912. W0 checks the public file hash only; no private original read or privacy audit repeated |
| Engine | Accepted modules 1–7 reproduce the frozen engine; compatibility is not correctness of the 45 preserved defects | M2-X @ef83543; all audit/ruling/fix/v4 steps still gate M2 closure and private port |
| Standing | Known sign-out/revocation/closure/unavailable decryption or recovery refuses new writes in 17; expiry-only session is 11 with valid leased logging; missing/corrupt storage is 18 before truth paint | W6/W9; runtime B11/B17/B18 and plan §3 |
| Durable save | Stage candidate changes; publish model and Saved only after one successful IndexedDB commit; reserve the full batch and recheck standing/clock/sequence/revision at the commit boundary | W6; records include ops/envelopes/outbox/sequences/receipts/rejections/frontier/keys/lease/high-water/checkpoint |
| Rejection persistence | A known authenticated rejection cannot reappear as accepted merely because its local write failed; keep the recovery fence until disposition, rejected ledger and outbox removal commit together, including after relaunch | W6; runtime B19:608–615 / plan §3; mechanism remains W6's implementation obligation |
| Restart clock | Owner chose bounded wall-clock + sequence-budget logging after unproven restart; exhaustion or proved expiry is 20. Never reset allowance merely by reopening | W6-BRIEF proposes exact budget and residual exposure; Sol reviews refinement. No numeric budget is accepted by W0; older blanket refusal text is superseded only as ruled |
| Late delivery | Original legitimately leased operations remain immutable and may arrive after expiry; server admission still checks identity, range, binding and revocation | W5/W6; runtime A2:138–149. Arrival time cannot prove when an offline operation was created |
| Authority atomicity | One consistent snapshot with all ownership/dependency/drain inputs and global revision; stage synchronous core; guarded atomic batch commits all effects before success; stale work retries | W5; plan §3 and TASK-W5. No W0 wrapper implements this boundary |
| Verification | P-256/SHA-256 authority verification; phone has public verification material only. Verify every disposition/pull/snapshot/lease/challenge-time reply before trusted client mutation | W5 contract then W6; keep T3 operation HMAC/domain/canonical/identity bytes unchanged |
| Projection | Include verified remote-device facts, not only ownOps; truthful Today and matching frontiers alone are insufficient without matching displayed facts and basis | W7/W9; plan §3/6 |
| Import/rollback | Immutable generation + checkpoint + atomic activation; retain provenance and every later accepted/pending operation on rollback | W7/W8; no private port before M2 closure and all synthetic F2/handoff/review gates |
| Idle experiment | Never open/change the seeded soak origin or edit `rebuild/m3/soak-stub/`; it proves its particular implementation only | SOAK-1; new storage implementation still needs relevant evidence/qualifying survival test |

## W4 setup can proceed from these requirements

The account/domain purchases are already recorded. W4-PACKET prepares only unfinished actions; owner attendance is not deployment completion. Use the existing SETUP-TOKEN/SETUP-D1 and private secret-entry workflow. This document authorizes no new permission, purchase or private-data upload.

| Item | Fixed choice / constraint | Evidence before claiming ready |
|---|---|---|
| Hosting/database | Cloudflare Workers Paid + D1; create with jurisdiction `us`, never a location hint | I records intended account/database configuration; US-CONFIG on the actual account, synthetic first |
| Cost | $5 means observed informational alert plus conservative limits; it is not a provider hard cap | I inventories meters/limits, preserves outbox on retryable refusal, obtains any bounded spending-drill allowance, observes the real threshold alert |
| Sign-in | Clerk Free email codes, production instance, owned domain/DNS and verified email delivery | I completes synthetic production sign-in/recovery; passkeys/paid add-ons are not assumed |
| Deployment access | Existing reviewed custom token scope; separate secrets from code; do not add DNS/KV/R2/route access without need and the existing authorization process | I verifies actual required permissions, private local handover, expiry/rotation and revocation; no credential enters PR/log/CLI arguments |
| Key roles | Authority P-256 signing private key stays server-side; verification public keys go to clients. Payload encryption keys and identity/HMAC keys are distinct, epoch-addressed and recoverable | W5 publishes signature/key profile; I prepares custody and rollback/rotation records; W6 publishes local sealing profile. Never guess missing encoding or overwrite an old epoch |
| Backups/recovery | Encrypted export and required keys survive primary PC/account loss; restore into an isolated account/database/environment with original signed identities | I prepares off-device custody and clean second-machine path, obtains unresolved recovery objectives, then W8/W10a execute. Do not rewind live D1 |
| Deploy boundary | Current old-app manifest excludes rebuild. M3 needs a distinct allowlisted build/package and origin; do not deploy repository root or use the idle origin | W7 publishes actual build manifest; I checks actual upload archive and required checks on exact deployed commit |

Account setup, custody preparation and synthetic database provisioning need no completed W5 implementation. Actual binding/deploy/remote acceptance waits for its published contract/code and relevant review. W0 leaves no fictitious remote-ready receipt.

## Explicit OPEN implementation fields

- W5: route/body/error schemas, domain-separated canonical bytes, P-256 encoding, key epochs, enrollment/sequence reconciliation, challenge/time freshness assumptions, paging/frontier and retry/terminal-disposition contracts. `TASK-W5.md` assigns these; unpublished local files are not a published contract.
- W5/W6: lease renewal must preserve outstanding legitimately issued capabilities. Current core lookup is a single device lease; replacing it naïvely can strand immutable old outbox envelopes. Publish and test the renewal/history contract before browser integration.
- W6: local cipher/key-storage/recovery profile, schema migration/fence mechanism, multi-tab revision handling and exact bounded budget. A coherent old-state restore can reset every local counter; a finite accepted sequence range does not cap repeated conflicting local acknowledgements. Carry that red witness into the refinement; W0 resolves no product rule by numeric guesswork.
- W7/I: new PWA artifact manifest/origin, private import comparator and private source custody. W0's old-app ZIP check is not verification of an uploaded deployment or an unfinished PWA archive.
- I/O: remaining loss/recovery objectives, encrypted-backup destination/access, alert allowance and phone/pressure appointments remain their existing queue steps. Completed purchases and the bounded/strict ruling are not reopened.
- Administrative required-check settings are not changed by this PR. The new workflow runs automatically on rebuild pushes/PRs; I must treat its exact checks plus strict and local private evidence as acceptance requirements. Future M3 deploy wiring must consume the accepted gates; a skipped platform check is not a PASS.

## Evidence contract

`PUBLIC-CONFORMANCE` executes frozen assertions on synchronous product adapters; `PUBLIC-ORACLE`/`PUBLIC-CANDIDATE` use only the two already-public fixtures with unchanged pins; the existing second gate checks writers/merge/surface. None is a private-data, real D1, browser or phone verdict. Use the full unchanged suite/selftest and all-three-blob oracle locally for private acceptance, with verdict-only reporting.

Every report records tested commit, environment, real boundary versus model, negative witness and residual blockers. A physical or remote runner cannot turn an absent environment into a simulated PASS. The shared M3 runner and rig190/191 belong to W5; W0 does not create competing versions.
