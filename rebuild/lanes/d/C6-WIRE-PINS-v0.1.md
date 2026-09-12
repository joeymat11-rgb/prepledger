# C6 wire pins v0.1

Lane D proposal, 2026-09-12. Supplements BRIEF-C6-RELAY v0.1 at f3eea83; C response: REQUESTS 09:21 and C brief section 3.6 at 033fd3f. These are contract artifacts, not a live adapter, approval or enforcement proof.

## Pin 2: exact JSON and credential carriage

The three schemas and synthetic examples are under `c6/wire/`. Request has FOUR members, success SEVEN, error THREE; no version/config/token member is added. JSON object keys must be unique before schema validation. Media type is `application/json`; response caching is disabled with `Cache-Control: no-store`. No request or response body is logged.

| request member | required value/type |
|---|---|
| user | exact string `joe` or `dad` |
| opt_in | closed object: user matching top-level user; accepted boolean true; accepted_at canonical UTC timestamp; screen_version and wording nonempty strings |
| nonce | lower-case UUIDv4 string, newly generated for a start attempt; same logical retry retains it |
| sdp_offer | nonempty string, at most 65,536 UTF-8 bytes; not a URL or a configuration object |

Canonical wire timestamps use `YYYY-MM-DDTHH:mm:ss.sssZ`, with valid calendar/clock values. This format, UUID convention and SDP bound are INVENTED interoperability limits for C to review. Structural matching is not proof of authentication or consent. C must still supply the supported screen-version/wording allowlist and consent lifecycle.

Success is `{nonce,session_id,sdp_answer,session_minute_cap,deadline_at,provider,model}`: matching nonce; provider-returned opaque nonempty session id; SDP string with the same byte limit; positive safe-integer minutes; canonical UTC deadline; `provider:"openai"`; `model:"gpt-live-1"`. The integer's representation bound is not a permitted duration. Validate nonce equality, current deadline, admitted duration and provider/config bindings semantically before using the reply. No success before the real enforcement prerequisites pass.

Error is `{ok:false,code,nonce}`. Echo only a valid parsed nonce; use null when it is missing, malformed or the body cannot be safely parsed. Nine fixed code/status pairs remain exactly BRIEF-C6-RELAY section 2. A non-JSON gateway response, unknown code, mismatched nonce or invalid success is a local relay-unavailable outcome; do not render its text or start media. An ambiguous network failure after POST is not permission to invent a new nonce and create another paid session; replay/recovery policy remains a prerequisite.

**Proposed HTTP carriage:** `Authorization: Bearer <relay admission credential>`. It is a relay-scoped admission credential, never an OpenAI key, not part of the JSON body, SDP, query or logs. No cookie fallback or query-string credential is introduced by this proposal. The credential's issuer, cryptographic profile, enrollment, user binding, expiry, refresh and revocation are still an OPEN C/D companion contract; a header's existence never authenticates a caller. C can review JSON handling independently, but neither lane may implement admission as a string-presence check. Do not reuse a ledger credential without its separately reviewed scope.

## Pin 1: origins are still open

Relay origin remains UNASSIGNED. The selected flow's browser HTTP request goes to that relay; the server exchanges SDP with the Live create endpoint. Media/data use negotiated WebRTC tracks/channels. The official guide does not supply an exhaustive fixed browser transport hostname list, so neither `api.openai.com` nor a wildcard can be asserted as the tested media inventory. Before C pins CSP, record actual browser HTTP/WebSocket requests separately from negotiated media connectivity and verify the deployment origin. [Official WebRTC guide](https://developers.openai.com/api/docs/guides/voice-webrtc).

## Pin 3: cutoff and what the phone observes

No asynchronous relay notification channel is defined by this POST contract. Do not promise a cutoff event or infer its cause from peer disconnection. The proposed provider-backed scheduler remains blocked on the PM's control-state amendment and verified Live WebRTC termination. C6-05 must prove termination when the phone does not cooperate; a successful timer or REST response alone is insufficient.

The phone's own deadline action stops microphone tracks and closes its peer connection; a suggested factual caption is `Audio stopped on this phone.` (INVENTED copy, C owns final wording.) It does not attest provider finalization or billing. If an authenticated provider terminal event arrives, C may report the documented terminal state it actually carries; receipt, loss and deadline attribution must be covered by the eventual transport proof. No event is a possible outcome. Origin, credential issuance and server cutoff notification remain UNPINNED, not simulated as delivered.

## Two brief corrections and the wave-one bar

C brief 033fd3f:240 introduces an owner-watched demo exception before C6-05. D's contract contains no such exception: `/session` refuses before provider creation until its prerequisites hold. Separately authorized synthetic verification after the required cap check is not an enabled product demo. The PM must rule any change to that boundary; lane agreement cannot relax it.

C brief :253 points the server surface at onboarding tools despite wave one being the gym demo. Use the served wave-one tool/tier artifact (`wave1-tools.cjs:278-288` at that source) for wave one. Re-pin the old criteria at :201/:207/:209, which assume no spoken write, one setup op and an onboarding hand test. Wave one permits confirmed settings/set writes through its existing dispatcher; no client-supplied tool/config field is sent to `/session`. Onboarding stays wave three.

Control-state storage and a retention bound still await PM judgment; C's conditional agreement is not custody. F1/F2 remain on their existing branches and gate dependencies. Current verification is JSON parse/schema-shape inspection only; no provider session, authentication, cap enforcement, deployment, independent relay review or live phone proof is claimed.
