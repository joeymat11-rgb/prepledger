# BRIEF-C6-RELAY v1.0

Lane D build contract, 2026-09-12. Incorporates PM/owner DECISIONS:156/:158; supersedes conflicting v0.1 enforcement text and wire-pin claims. This document records the assigned implementation, not acceptance or permission to deploy.

## Authority and scope

Build under lanes/d/c6/** only: Worker, pure protocol/provider modules, admission Durable Object, synthetic tests and local runtime configuration. D does not edit coach, Today, engine, workflow, runner or private files. Author HIGH; PM supplies independent Claude plumbing reviewer HIGH. F1 remains separate; F2 follows under :155.

POST /session uses the closed four-field request and seven-field success in wire/. The nine fixed code/status pairs remain. Authentication is separate Authorization Bearer carriage, with an owner-minted per-phone 32-byte random credential encoded as 43 base64url characters; only its SHA-256 digest/user mapping is installed in server secret configuration. Removal revokes future admission; no automatic expiry is invented. Neither credential nor digest is a ledger authority key.

The owner sets and verifies the $50 provider project cap, mints phone credentials with PM, and explicitly authorizes deployment before the first call. The build installs none of these. A closed operator verification record binds project id, owner check date, model, $0.05/min and enabled $50 limit; it expires after 30 days, preserving the previous receipt freshness convention. This is a human attestation check, not an account inspection.

## Session and money behavior

Owner :158 sets 10 minutes per session and $15 starting voice-minute budget across both users. At $0.05/min that is 300 admitted minutes/calendar month. D declares an equal allocation of 150 minutes each, within :156's per-user counters; changing it requires the PM's post-week budget direction. There is one active admission window per user. These are admission limits, not measured charges.

Before provider IO, one global Durable Object atomically reserves ten minutes and records a digest of user+nonce. Concurrent/replayed attempts cannot purchase another session. A new nonce during an existing ten-minute window refuses with COACH_SESSION_CAP_REACHED. An attempt crossing UTC month end conservatively reserves ten in both months. All attempted calls keep the reservation on success, malformed reply, timeout or uncertain failure; no inferred refund. Retry of the same nonce refuses for the retained 24-hour window. No SDP answer is cached for retry.

Success declares session_minute_cap:10 and deadline_at computed at admission. C closes its peer connection and microphone by that deadline; it is a PHONE deadline, not a proved server stop. Provider SDP startup must finish before it. C6-05 now reads **phone termination + provider cap + idle timeout** per :158. Official docs have not yet supplied a numeric Live idle timeout or a WebRTC REST hangup guarantee. The relay cannot prove a maximum billed tail; report this to PM without inventing one. The owner's chosen layered path stands, with no server-stop claim.

Control state holds only user, nonce digest, opaque provider id, deadline, admission state, reserved minutes and monthly user counters. Session rows/digests are deleted at deadline+24 hours; counters at next-month-start+7 days, by a durable alarm and admission cleanup. A late alarm cannot be claimed as exact physical erasure. Cloudflare SQLite point-in-time recovery can retain prior database states for 30 days; this is a provider retention residual for PM, not application data saved in another store.

## Provider and phone companion

Fixed endpoint/model: Live sessions, gpt-live-1; server owns store:false, instructions, client delegation and exact data-channel event allowlists. No client tools/config/model/backend override. No sideband connection or media/transcript endpoint exists. The 19 served wave-one tool names/tiers and required phone guards live in a frozen COMPANION_POLICY, hashed at admission.

C owns actual delegation dispatch, model-confirmation stripping, same-turn number/unit traceability and discard BEFORE audio playback, cancellation, mic denial, timer, fixed error copy and tap fallback. A reviewed companion artifact/policy attestation is required in server configuration, absent by default. A matching hash is not proof of those behaviors; the independent reviewer must establish them on the real C artifact before the operator installs it. The transport can be tested synthetically without claiming this gate passed.

APP_ORIGIN is one exact HTTPS phone origin, assigned at deployment; Worker has no public route/preview enabled by default. C pins that relay origin plus verified transport inventory then. OPTIONS permits only POST with Authorization and Content-Type. Unknown origins, media uploads, WebSocket upgrades and alternate routes refuse. No request/response/content logs or telemetry are enabled.

## Executable bar and remaining external proof

| cell | required evidence |
|---|---|
| C6-01 | Enrolled phone principal bound to user and reviewed consent; forged/mismatched/revoked credentials and unsupported consent refuse before provider IO. |
| C6-02 | Closed JSON, duplicate-key handling, safe nonce reflection, UTF-8 bounds and fixed errors; no upstream body or secret reflected. |
| C6-03 | Real adapter emits exact documented Live schema with frozen policy; unsafe responses and client config refuse; synthetic fetch inspects bytes. |
| C6-04 | Atomic concurrent budget/replay decisions, durable reservation before IO, restart/commit/provider failures and no duplicate paid retry. |
| C6-05 | Owner's layered phone termination + provider cap + idle timeout; local tests prove ten-minute declaration only. Actual phone/provider proof remains external, with no numeric tail claimed. |
| C6-06 | Current serving-project cap attestation, absent/default refusal, 300 total/150 per-user admitted minutes, UTC month boundary and no automatic allowance increase. |
| C6-07 | Only permitted control data persists; durable cleanup/restart and no content paths; report platform retention limits honestly. |
| C6-08 | Exact-origin/preflight/error CORS, fixed provider destination and refusal of alternate media/control routes. |
| C6-09 | C's actual confirmed writes and pre-playback traceability on the reviewed policy-bound artifact; not supplied by a prompt, hash or text rehearsal. |
| C6-10 | Five-step gym demo on phone including missing facts and failed save; onboarding remains wave three. |
| C6-11 | Independent Claude review, exact-head both-OS CI, manual :155 preflight, custody/report counts; deployment still requires owner go. |

Tests use public synthetic fixtures and intercepted fetch only. Node fault tests supplement a local Workerd/SQLite run; neither is a real phone, account verification, bill measurement, deployed Worker or independent review. Fault mutants must fail assertions for auth bypass, replay, cap, allowance, persistence and provider policy errors.

READ-LIST: v0.1/source notes, C6 wire schemas, :156/:158, coach wave1-tools/tools/model-adapter/VOICE-COACH-BRIEF, local product files, official Live create/WebRTC and Cloudflare storage/config documentation. Excluded paths remain ledger/, conform/private/, src/history.js and seed. No acceptance/ruling/citation/receipt lines by D.
