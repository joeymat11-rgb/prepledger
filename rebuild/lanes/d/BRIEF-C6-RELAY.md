# BRIEF-C6-RELAY v0.1

Status: BRIEF-READY, proposed contract amendment; no live build, acceptance or deployment authority claimed.
Lane D (Astra), 2026-09-12; source base 4d0eac3; branch rebuild/lane-d-c6.
Authority: DECISIONS:134/:138/:140; response to C's 04:08 token handoff. F1/F2 assignments remain open.
Effort: author HIGH; one independent plumbing reviewer HIGH, mechanics LOW; the PM is the sole judge.

## 1. Outcome and selected model

The relay admits an authenticated Joe or Dad to an optional GPT-Live-1 gym conversation, keeping the project key on the server and media directly between phone and provider. The phone's existing tools remain the only route to facts and writes. Wave one is the five-step COACH-EXPERIENCE-BRIEF demo; onboarding is wave three under :140, not this package's first live bar.

The proposed token endpoint cannot be adopted verbatim. The selected `gpt-live-1` uses a trusted-server SDP exchange through `POST /v1/live/sessions`, not the separate Realtime client-secret API. No provider switch is proposed. The official contract and uncertainties are cited in SOURCE-C6-OPENAI.md; repository guarantees are in SOURCE-C6-CONTRACT.md.

## 2. Proposed C/D handoff

**Replace `POST /session-token` with `POST /session`**, subject to PM judgment of :134's token wording. JSON request: `{user,opt_in,nonce,sdp_offer}` plus separately authenticated request credentials. These names are INVENTED wire vocabulary; `user` and the five opt-in members retain their existing meanings. Reject any client-supplied model, instructions, backend, tools, cap, billing receipt, provider URL or session configuration.

On success return `{nonce,session_id,sdp_answer,session_minute_cap,deadline_at,provider,model}`. The SDP answer and opaque session id come from the provider. The deadline is a committed server deadline only after the enforcement prerequisite below is proved; it is never a token expiration relabeled as a session limit. Echo the nonce for matching; that alone is not replay protection. No credential, cap receipt, account id, charge or usage amount appears in the reply.

The Worker builds the provider request with `model:'gpt-live-1'`, `transport.type:'webrtc'`, `store:false`, and reviewed startup event allowlists. Omitting those allowlists permits all frontend events in the documented API; do not rely on a prompt to restrict capability. The server binds the closed coach delegation surface approved with C. Backend choice is still engine tools first (VOICE-COACH-BRIEF:33); no free-form paid backend is silently added.

Proposed error envelope `{ok:false,code,nonce}`; fixed codes only, never provider text: 400 `COACH_REQUEST_INVALID`; 403 `COACH_AUTH_REQUIRED`, `COACH_USER_NOT_NAMED`, `COACH_OPT_IN_REQUIRED`; 409 `COACH_SESSION_REQUEST_REPLAYED`; 429 `COACH_SESSION_CAP_REACHED`; 503 `COACH_CAP_NOT_VERIFIED`, `COACH_ENFORCEMENT_UNAVAILABLE`, `COACH_RELAY_UNAVAILABLE`. New codes/status mappings are INVENTED and require C's fixed-copy mapping. No success-shaped partial response after an admission failure.

**Origin is UNASSIGNED.** Proposed Worker name `earned-coach-relay` is a name, not an existing endpoint. No workers.dev hostname, owner account or custom domain has been inspected or created. Keep one exact configurable relay origin and the documented provider transport origins; no wildcard CSP/CORS. Give C the verified origin before its CSP change; a placeholder is not evidence that deployment exists. Fetch/WebRTC transport inventory must be tested, not inferred from one REST hostname.

## 3. Authentication and consent

The body string `joe` or `dad` and CORS are insufficient authentication. Proposed binding: a server-controlled allowlist maps an enrolled credential to one of those two ids. C owns the phone proof; D verifies it before admission. Enrollment, credential form, expiry and revocation are an explicit companion contract to settle with C before implementation. No existing ledger authority key is reused for another signing purpose without a separately reviewed domain and custody.

Keep `{user,accepted,accepted_at,screen_version,wording}`. Bind its user to the authenticated principal; require strict types, a supported screen version and that version's actual transfer wording. The old regex is disclosure-shape validation only, not proof of a user gesture. Consent is separate from authentication; declining or withdrawing closes the phone session and leaves the tap path. C retains the real consent record locally, without sending athlete history to D.

Replay/race behavior must be explicit: one accepted nonce cannot create two paid sessions; concurrent starts share the same admission budget. This needs trustworthy state or equivalent provider idempotency, neither supplied by the current stateless proposal. Do not claim an echoed nonce implements it.

## 4. Enforcement gaps requiring a PM decision

**Minutes:** the inspected Live create schema exposes no configurable session duration. Its REST hangup page documents SIP calls; WebRTC applicability is unverified. Live sideband can close a session but receives reflected PCM audio, conflicting with the strict requirement that this relay never receive audio. Realtime's WebRTC hangup guarantee cannot be transferred to Live. Stopping later mint requests or running a phone timer does not terminate an existing provider stream.

**Proposed resolution, conditional:** retain GPT-Live-1 and the no-audio relay; first obtain a documented or authorized synthetic proof of WebRTC REST termination. If available, permit a trusted deadline scheduler with minimal session-control state (authenticated user, nonce digest, opaque session id, deadline, terminal/admission state and reservations). No SDP, audio, transcript, tool results, opt-in text or provider token is stored. Storage choice and retention bound must be reviewed; a request-handler timeout is not durable enforcement. This is a requested amendment to "stores nothing", not a reinterpretation already authorized by C's counters paragraph.

No arbitrary gym-session minute value is installed by this brief. The selected duration must fit the owner's verified session allowance, including initialization/retry cost and any backend costs, and be appropriate for wave one's conversation. A voice price alone does not derive a safe total session spend.

**Money:** OpenAI now documents enforced monthly project spend limits, separate from alerts. It also documents propagation delay and possible overshoot without a maximum overshoot or an in-flight Live termination guarantee. The current local cap validator checks a human receipt, not the account or runtime controls. It does not enforce :134's exact $50 maximum. Preserve the hard-cap requirement and report these semantics to the PM; do not mark a receipt verified from a schema or set a local boolean in lieu of the owner's account check. No live call precedes the owner's actual cap verification.

If WebRTC termination, authenticated admission, replay accounting or the cap requirement cannot be proved, `/session` must refuse before any provider session creation with a named unavailable result. A nonfunctional endpoint is not a completed relay. Do not silently use sideband/audio transit, switch models or relax a dollar promise to unblock it.

## 5. Proposed custody and boundaries

| owner | files and work | estimate |
|---|---|---:|
| D | lanes/d/c6/**: Worker entry, closed protocol, admission/identity boundary, provider adapter, tests, deployment configuration | 300-600 product lines; measure after mechanism decision |
| D | lanes/d/BRIEF-C6-RELAY.md, source notes, later report | docs; reports at most 60 lines |
| C | its voice-session/voice-app companion and existing opt-in/tool harness; auth proof and new wire mapping | C measures; no D edits |
| B/PM | exact CI child registration where workflow custody/pins require it; independent reviewer arrangement | name before PR-READY |

No engine, client, m4, conformance, C-owned coach or shared Today product edit is part of D's proposed relay. No deployment, secret installation, provider session or owner-account request is authorized by this brief. Existing F1/F2 worktrees stay separate. The only current files added are this brief and two source notes.

## 6. Acceptance bar, written before implementation

| id | decisive evidence required |
|---|---|
| C6-01 | Only two enrolled identities can start; a forged user, mismatched receipt, expired/revoked auth and unknown consent version each refuse before the provider call. |
| C6-02 | Request/response shapes are closed; nonce echoed; fixed errors contain no upstream text, secrets, billing amount, SDP on error or another user's data. |
| C6-03 | Real adapter request uses exact Live SDP schema, server-owned model/store=false/event policy; arbitrary frontend config and expanded delegation are rejected. |
| C6-04 | Concurrent/replayed starts cannot create duplicate sessions or exceed admitted limits; failures release or retain reservations deliberately and retry safely. |
| C6-05 | The server terminates a synthetic WebRTC session at its committed deadline despite a noncooperating phone, reload, offline phone control, scheduler restart and provider failure; actual cessation/finalization is observed, not just a successful timer. |
| C6-06 | Monthly/session cap verification is bound to the serving project and current enforcement state; missing/unverified/disabled cap refuses; race and delayed-enforcement semantics are disclosed and tested against the accepted owner requirement. |
| C6-07 | No relay path receives media or transcript; minimal permitted state only; no content in logs/errors/telemetry; lifecycle cleanup and retention bound proved. |
| C6-08 | Exact origins and preflight/error CORS are tested; wrong origins refused; no arbitrary outbound URL or cross-user session control. |
| C6-09 | C's closed tools, harness-owned confirmation and discard-before-speaking traceability remain effective in the actual voice path; streamed speech cannot bypass the check. The relay does not claim the text rehearsal proves this. |
| C6-10 | The owner's five-step wave-one iPhone demo passes, including unknown settings/why and a failed save. Optional voice, mic/network refusals and tap fallback preserve data. Onboarding waits for its ruled wave. |
| C6-11 | Independent plumbing review, exact-head CI on both OS, builder preflight, report/counts and secret scans pass; actual Worker deployment waits for the owner's explicit deploy at point of need. |

Mutants: trust claimed user; consent user mismatch; nonce replay creates twice; use client cap/config; omit event allowlist; treat phone timeout or token TTL as server cutoff; start despite unverified cap; accept provider error text; persist SDP/audio; change a tool confirmation flag. Each needs a named assertion failure, not an import error.

## 7. READ-LIST and handoff

AGENTS READ FIRST and Lane D charter already read; LANES; DECISIONS:134/:138/:140/:148/:150-151; coach/{VOICE-COACH-BRIEF.md,COACH-EXPERIENCE-BRIEF.md,BRIEF-C6-VOICE-ONBOARDING.md,TOOL-CONTRACT.md,model-adapter.md,tools.cjs:921-1033,cap.schema.json,test/cost-cap.test.cjs}; this brief and both SOURCE-C6 notes. Future implementation reads only proposed custody plus an agreed authentication/scheduler companion and current official Live/Workers documentation. No private/ledger/history/seed paths or cloud checkout.

C: this is D's AMEND answer to the token proposal; resolve SDP/auth wiring and the stale onboarding-first/voice-day-kind hand rows before your phone build. PM: judge the SDP contract and minimal control-state amendment, resolve the cap semantics and obtain the missing Live WebRTC shutdown guarantee. B: F1/F2 remain held on the previously reported cumulative predecessor path; no D gate ruling is added here. Evidence now: source research plus the existing local cost-cap tests 12/12; no live session, minute enforcement, account-cap verification, independent C6 review or deployment claimed.
