# C6 relay candidate

Built to DECISIONS:156/:158. No deployment, provider call, account inspection or credential mint has run. The checked-in configuration cannot admit a session. The Worker has no public route or preview enabled.

From this directory: install pinned dependencies with `pnpm install --frozen-lockfile --prod=false --ignore-scripts`, then `node --test --test-reporter=tap test/*.test.mjs`. From the repository root: `node rebuild/lanes/d/c6/mutants.mjs`. All outbound provider requests in these tests are intercepted; Workerd tests disable external networking. Logs and emulator storage stay in this worktree's .tmp.

## Operator configuration, only after review and owner authorization

| binding | purpose |
|---|---|
| APP_ORIGIN | Exactly one HTTPS origin for the reviewed phone application. Empty until deployment. |
| OPENAI_PROJECT_ID | The same serving project the owner checked; never returned to the phone. |
| OPENAI_API_KEY | Cloudflare secret binding installed by the owner, never a file, chat or log. |
| PHONE_CREDENTIALS_JSON | Secret binding containing [{user,digest}] for enrolled phones; SHA-256 digest of each owner-minted 32-byte base64url credential. Remove mapping to revoke future admission. |
| CAP_VERIFICATION_JSON | Closed operator attestation: {project_id,month_limit_usd:50,verified_at,verified_by:"owner",model:"gpt-live-1",minute_price_usd:0.05,enabled:true}. Set only after the owner's actual project check; recheck within 30 days or on project/price/cap changes. |
| CONSENT_SCREENS_JSON | Exact reviewed screen-version to wording map, supplied by C; no production wording is invented here. |
| COMPANION_REVIEW_JSON | {artifact_sha,policy_sha,reviewed:true}, installed only after independent review of C's actual deployed companion commit and SHA-256(JSON.stringify(COMPANION_POLICY)). Shape validation does not perform that review or inspect the phone's running build. |
| COACH_ADMISSION | One SQLite Durable Object namespace, one fixed global object for both users. Never partition this by caller/user; that would reset the shared allowance. |

No usable values or secrets are supplied. Per-phone credentials go directly through the owner's enrollment flow into the phone and server configuration with PM; D neither mints nor reads them. Configuration duplication/unknown cap fields refuse. Origin assignment, public route and secret installation belong to the explicitly authorized deployment step, not this build.

The C handoff remains POST /session, request {user,opt_in,nonce,sdp_offer}, plus Bearer admission credential; success {nonce,session_id,sdp_answer,session_minute_cap:10,deadline_at,provider,model}. C owns fixed copy for the nine errors. A failed or lost POST must not automatically create a fresh-nonce retry; a retained nonce returns 409 and no cached SDP. Replay memory ends at deadline+24h under the ruled retention bound. One user's new start during the admitted window returns 429. A later deliberate start still consumes another allowance.

The $15 starting allowance is 300 admitted voice minutes, allocated 150 each. Every attempt reserves ten before provider IO; no refund is inferred from an error or disconnection. A month-spanning admission reserves ten in each UTC month. Thus unused minutes may be forfeited. No metered cost is presented. Budget changes require PM's post-week instruction; changing the binding/namespace or restoring old state could erase accounting and is not a budget-reset workflow.

`deadline_at` begins at admission, including provider startup time. C stops microphone/peer connection at the earlier remaining deadline or its ten-minute timer. Its caption describes the phone action, not remote billing cessation. C must prove actual confirmation/number/unit/pre-playback gates for the 19 served tools; the relay prompt, hash or SDP success cannot prove them.

Residuals: provider WebRTC REST hangup and a numeric Live idle timeout are still unproved. The owner accepted the layered phone/provider approach, but no maximum billed overrun is measured. Project spend limits document delay/overshoot. Worker alarms delete live control rows when due; platform downtime can delay execution, and SQLite PITR can restore prior state for 30 days. Do not restore this admission database to resume spending. PM must weigh this provider-retention residual before deployment.

Official references: [Live create](https://developers.openai.com/api/reference/resources/live/methods/create), [Live WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc), [Cloudflare SQLite storage/transactions/PITR](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/), [Workers fetch](https://developers.cloudflare.com/workers/runtime-apis/fetch/). Deployment uses the supported SQLite `new_sqlite_classes` migration configuration; compatibility date matches the pinned local Workerd release.
