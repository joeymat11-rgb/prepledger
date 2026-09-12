# C6 relay candidate

Lane D, 2026-09-12. CANDIDATE-BUILT to :156/:158 and BRIEF-C6-RELAY-v1.0.md. No independent review, CI integration, deployment or live proof claimed.

- Fixed GPT-Live-1 SDP adapter, closed request/error protocol, exact-origin Worker and one SQLite Durable Object for both users.
- Measured product: four modules, 572 lines; 19 new files including configuration, lockfile, tests and docs, all under D custody. Whitespace and staged credential-pattern scan pass.
- Ten-minute phone deadline; $15 = 300 admitted minutes per UTC month, declared equal 150/user allocation. Atomic reservations precede provider calls; same-nonce replay and active-window starts refuse; uncertain failures retain allowance.
- Owner-installed phone digest mappings, reviewed consent versions, serving-project cap attestation and reviewed companion/policy binding are required. All deployment values remain absent/default-refusing.
- Minimal control state only; durable cleanup at deadline+24h and next-month-start+7d. Corrupt rows/config duplication refuse; late provider replies cannot resurrect expired records.
- Local suite 57/57: protocol 16, provider 17, admission 20, Workerd provider 2, Workerd Worker/SQLite/config 2. Actual Worker import, concurrent admission and SQLite restart/replay pass with all provider networking intercepted.
- Fault mutants 9/9 killed by assertions; unchanged-copy control passes. Covers identity, cap, companion, replay, duration, raw nonce storage, retention, provider storage/model. No syntax/import failure earns a kill.
- Runtime failure found and fixed: Workerd rejects redirect:error before IO. Manual redirect mode plus strict 201 acceptance proves redirects are not followed. Infrastructure 503 retains exact-origin CORS.
- Logs: .tmp/c6-tests.tap; .tmp/c6-mutants-wySNW2/summary.json. All tests use public synthetic data, no real credential/account/athlete content.

C handoff: c6/README.md, provider.mjs COMPANION_POLICY, wire/ schemas and BRIEF-C6-RELAY-v1.0.md. Actual delegation dispatch, confirmation stripping, same-turn/unit traceability BEFORE playback, mic/timer/cancel handling and five-step phone demo remain C's evidence. The configuration attestation is not that evidence.

PM residuals: Live WebRTC REST termination and numeric idle timeout remain undocumented in inspected sources, so no maximum billed tail is proved. SQLite PITR keeps earlier states for 30 days; live-row deletion is not physical erasure. The owner/PM still performs project-cap and per-phone credential setup, then explicit deployment authorization.

B/PM handoff: add `pnpm --dir rebuild/lanes/d/c6 install --frozen-lockfile --prod=false --ignore-scripts` and `node --test --test-reporter=tap rebuild/lanes/d/c6/test/*.test.mjs` to the owned both-OS CI path, plus `node rebuild/lanes/d/c6/mutants.mjs`. D has not edited .github or tooling. Request independent Claude HIGH plumbing review after exact-head CI registration; report remains CANDIDATE-BUILT until preflight is satisfied.

No private path, engine/client/Today file, athlete data, acceptance line, merge or deployment changed. F1 two-set proof is separate at d852a84; F2 proceeds under :155; B1+B2 pre-build still awaits B's branch name.
