# C6 provider transport candidate

2026-09-12. Read PM decisions 156 and 158 from origin/rebuild/t2-client-core. This is a synthetic-tested transport candidate; no provider, account, audio, deployment or phone test occurred.

`createLiveSession({apiKey,projectId,sdpOffer,fetchImpl,signal})` resolves `{sessionId,sdpAnswer}`. The default runtime fetch is only used when a caller invokes it without injection. All tests supply synthetic fetch. There is no automatic retry, sideband, hangup, storage, logging or additional provider call.

The caller must satisfy its admission, verified-cap and reviewed-companion gates BEFORE invocation. This transport does not turn an operator's declaration into proof. C6-09 remains pending until C supplies the real dispatcher and pre-playback verification; no review attestation is included.

## Fixed provider request and companion policy

The exact endpoint is `POST https://api.openai.com/v1/live/sessions`; server headers carry bearer authentication and `OpenAI-Project`. Redirects fail. Body: `{session:COMPANION_POLICY.session,transport:{type:"webrtc",sdp:sdpOffer}}`. Model is `gpt-live-1`, `store:false`, delegation `{type:"client"}`. No paid Responses backend, caller configuration or invented Live tool schema is accepted. [Create schema](https://developers.openai.com/api/reference/resources/live/methods/create), [project header](https://developers.openai.com/api/reference/overview#authentication).

`COMPANION_POLICY` is recursively frozen and stable under `JSON.stringify`. Admission hashes that exact object and binds it to the independently reviewed C companion commit. It includes the actual server session configuration, nineteen served wave-one tool names/tiers and required phone safeguards. Its tool map is checked against `createWave1Tools(...).TIERS`, not only against a copied test list.

Frontend send allowlist: `session.commentary.append`, `session.close`. It excludes `session.update`, instruction appends, Responses commands and audio-by-data-channel commands. Receive allowlist: `session.started`, input/output transcript deltas, `session.delegation.created`, `session.commentary.appended`, `session.usage.updated`, `session.closed`, `error`, `info`. There is no `all` or omitted permissions default. [Startup event permissions](https://developers.openai.com/api/reference/resources/live/methods/create).

Client delegation does not configure or execute backend tools. Its event identifies the delegation but carries no tool call or task text; C must correlate it with transcript and turn state. Commentary appends are intended to be paraphrased, and an append acknowledgment does not prove playback or wording. A prompt cannot enforce Earned's exact-value rule. [Client delegation contract](https://developers.openai.com/api/docs/guides/live-delegation).

C's required companion: exact nineteen-tool dispatch through `wave1-tools.cjs`; strip model-supplied confirmation and use only harness-recorded yes; engine-issued proposals only; maximum six calls and one draft per turn; same-turn value/field/unit and charter checks; discard failed drafts without repair. Buffer/gate actual audio before playback, including spontaneous speech, paraphrasing and late/cancelled output. Maintain only the permitted local context and honor the ten-minute phone cutoff. Returning checked text to Live alone does not satisfy these safeguards.

## Responses and failures

Only HTTP 201 JSON with the closed `{session:{id},transport:{type:"webrtc",sdp}}` shape succeeds. Duplicate keys, escaped duplicate spellings, wrong transport, additional properties, invalid/empty IDs, invalid UTF-8, overlong bodies and empty/overlong SDP refuse. Opaque ID prefixes are preserved. Defensive bounds are local interoperability choices: SDP 65,536 UTF-8 bytes, ID 1,024 bytes, upstream JSON 262,144 bytes.

Errors are always `LiveProviderError`, code `COACH_PROVIDER_UNAVAILABLE`, message `Coach provider unavailable.` No upstream body/text/status/cause is attached. Remote error bodies are not inspected. Every attempted request failure is `creation:"unknown"`; only a local refusal before fetch uses `"not_attempted"`. No remote error releases a budget reservation by implication.

Validation: `node --test rebuild/lanes/d/c6/test/provider.test.mjs` passed **17/17**. Tests inspect emitted endpoint, headers, body, event lists and signal; compare the actual served tool tiers; prove policy immutability; exercise ambiguous failures, no retries, redirect refusal, strict replies, byte bounds and stream cancellation. Parse check and whitespace check passed. This establishes no provider behavior or live enforcement.

## Narrow termination and idle-timeout recheck

The current Live create schema and lifecycle guide document no numeric idle timeout or configurable minute-cap input. `expired` identifies a provider duration limit but supplies no number there. Do not claim that a stuck call has a known maximum additional billable time. [Live lifecycle](https://developers.openai.com/api/docs/guides/live-conversations).

The Live REST hangup reference still describes SIP: `POST /v1/live/sessions/{session_id}/hangup`. WebRTC applicability remains unproved; no synthetic provider call was authorized or made in this subtask. Sideband receives reflected PCM audio and therefore does not meet the relay's receive-no-audio condition. [Live hangup](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/hangup), [server controls](https://developers.openai.com/api/docs/guides/voice-server-controls).

Owner decisions set a ten-minute phone cap, $15 starting relay budget and separately verified $50 project cap. Provider spend enforcement can lag and slightly overshoot; this transport asserts no exact dollar ceiling or in-flight cutoff. [Spend controls](https://developers.openai.com/api/docs/guides/spend-limits).
