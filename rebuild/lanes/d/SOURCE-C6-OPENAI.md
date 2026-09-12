# C6 OpenAI feasibility sources — 2026-09-12

Documentation findings only; no credentials, account access, provider calls, or deployment. This note preserves the owner's GPT-Live-1 choice. It is not an acceptance or an implementation claim.

## Exact model and wire contract

**Proved:** `gpt-live-1` is the documented request model. Voice costs $0.05/minute, billed per second; backend model/tool costs are separate. Published rate limits count concurrent sessions (Free unsupported, Tier 1: 25). The owner's account access/tier is unverified. [Model and pricing](https://developers.openai.com/api/docs/models/gpt-live-1).

**Proved:** GPT-Live WebRTC uses a trusted server to exchange the phone's SDP offer with OpenAI; microphone/speaker audio uses negotiated media tracks and JSON events use the data channel. The project key stays on the trusted server. The documented flow does not mint a client secret. Origin checking alone does not authenticate users. [WebRTC guide, GPT-Live section](https://developers.openai.com/api/docs/guides/voice-webrtc).

**Proved schema:** `POST /v1/live/sessions` accepts `{session:{model:"gpt-live-1",...},transport:{type:"webrtc",sdp}}`; response is `{session:{id},transport:{type:"webrtc",sdp}}`. Preserve the opaque session ID. `store` defaults false. Startup `client.data_channel.allowed_client_events` and `allowed_server_events` can restrict the untrusted frontend; omission allows all. These permissions do not restrict trusted sideband connections. Frontend instructions are immutable after startup. [Create session](https://developers.openai.com/api/reference/resources/live/methods/create).

**Inference for C6:** replace an assumed Realtime token-mint contract with a reviewed Live SDP-exchange contract. Server-author the model, instructions, delegation and frontend event allowlists; do not accept arbitrary session configuration from the phone.

## Session duration and server termination

**Not established:** no configurable minute cap, `max_duration`, or expiration input appears in the inspected Live create-session schema. This is absence in the reviewed public contract, not proof that no private capability exists. Do not invent such a field. [Create session schema](https://developers.openai.com/api/reference/resources/live/methods/create).

**Proved:** Live emits cumulative `session.usage.updated` seconds and final `session.closed` usage. `expired` denotes its duration limit, but these inspected lifecycle docs do not state the limit's numeric value. `session.close` cancels queued Responses; an active response can finish. An application timeout or socket close is not proof of finalization. [Live lifecycle](https://developers.openai.com/api/docs/guides/live-conversations).

**Proved endpoint, unresolved WebRTC applicability:** `POST /v1/live/sessions/{session_id}/hangup` authenticates server-side, but its reference describes ending a SIP call. This does not establish that it terminates a Live WebRTC session. No distinct Live WebRTC REST end/delete endpoint was found in the inspected reference navigation. [Live hangup](https://developers.openai.com/api/reference/typescript/resources/live/subresources/sessions/methods/hangup).

**Proved privacy constraint:** Live sideband connects at `wss://api.openai.com/v1/live/sessions/{session_id}/attach`, can send `session.close`, and receives reflected input/output PCM audio while the primary connection carries the conversation. No receive-audio opt-out is documented there. Discarding received audio would not satisfy a promise that the relay never receives it. [Server controls, GPT-Live section](https://developers.openai.com/api/docs/guides/voice-server-controls).

**Inference:** a stateless SDP relay that never receives audio has no demonstrated arbitrary server-enforced minute cutoff from these docs alone. A phone timer supplies cooperative behavior only. Reliable server cutoff requires verified Live WebRTC REST hangup or a provider-native duration field, plus a trusted scheduler/session handle; a timer inside a disposable request handler is not durable enforcement. Sideband is not compatible with the strict receive-no-audio requirement as documented.

## Spend controls and cost accounting

**Proved:** the API now documents hard project spend limits, distinct from spend alerts. `POST /v1/organization/projects/{project_id}/spend_limit` sets a USD monthly amount in cents and returns its enforcement state. The sample shows `enforcement.status: "enforcing"`; this note did not inspect or change the owner's configuration. [Project spend-limit schema](https://developers.openai.com/api/reference/typescript/resources/admin/subresources/organization/subresources/projects/subresources/spend_limit/methods/update).

**Proved limitation:** enforced organization/project limits return affected requests as 429 with the respective spend-limit error code. Enforcement and updates propagate with delay, allowing slight overshoot. These docs do not guarantee an immediate cutoff of an already-running Live session or specify a maximum overshoot. Therefore an exact dollar ceiling cannot be claimed from this control alone. [Spend-limit guide](https://developers.openai.com/api/docs/guides/spend-limits).

**Proved:** silence, user/assistant speech and backend waiting all count toward active Live duration. WebRTC creation bills 15 seconds during initialization, credited against duration after startup; it is not an extra 15 seconds on a running session. Reconnect/session-creation cost and separate backend usage must be counted. [Live cost accounting](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live).

**Inference:** use verified provider hard spend enforcement as a backstop, with conservative application admission/reservations where required. A stateless worker alone cannot maintain cross-request monthly accounting or concurrent-session reservations; an external trusted state/control is necessary for those promises. Provider-cap availability, permissions, configured amount, enforcing state and Live in-flight behavior remain account/integration verification items.

## Realtime research is not a substitute for GPT-Live

**Separate API facts:** Realtime `client_secrets` TTL admits new sessions only; sessions may outlive it, a secret can start multiple sessions, and client connections can override attached configuration. Its TTL range is 10–7200 seconds, default 600. None of this is the documented Live SDP contract. [Realtime client secrets](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create).

**Separate API facts:** Realtime documents a 60-minute maximum and a REST hangup that explicitly covers SIP and WebRTC. These guarantees must not be transferred to GPT-Live. [Realtime lifecycle](https://developers.openai.com/api/docs/guides/realtime-conversations), [Realtime hangup](https://developers.openai.com/api/reference/typescript/resources/realtime/subresources/calls/methods/hangup).

## Items for PM/provider resolution before any enforcement claim

1. Confirm Live WebRTC REST hangup support or another provider-enforced duration control; obtain its actual limits and failure semantics.
2. Decide whether SDP-exchange plus trusted deadline state is within the intended stateless-relay scope; no provider switch is proposed.
3. Confirm the account can use `gpt-live-1`, and that the intended project cap is configured and enforcing; measure cap propagation and running-session behavior with separately authorized synthetic calls.
4. Keep backend delegation costs distinct from the voice-minute limit, and ensure allowed frontend commands cannot expand server-chosen capabilities.
