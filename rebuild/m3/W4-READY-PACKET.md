# EARNED — the remaining setup, in one packet

Prepared by Astra on 2026-09-06 from accepted integration `df09f438a93cb9548ef3f66b28b39deecc7fb347`.
**Status: proposed setup packet for execution review. W4 is not ready or accepted. No account, key, database or deployment was created by preparing this file.**

## The owner's page

The next setup session connects the accounts you already own to the app under construction. Claude Code handles the technical work; you handle sign-ins, any confirmation that requires you, and the few choices below. You do not need to run commands or move task files between builders.

Your Cloudflare account, Workers Paid subscription, domain **earnedcoach.com**, domain renewal choice and budget-alert setup are already recorded. The phone storage experiment is already seeded. **Do not buy these again or open the storage-test icon.** The old app remains your everyday app until the new app's real-data checks pass.

**Before creating a token:** the integrator must resolve the blocked local secret-entry route and verify it with dummy data. Windows refused the PowerShell helper. The existing Claude Code cloud task is signed in and has successfully checked PR #29; the separate local command-line session has expired authentication. Neither the working cloud task nor Cowork's completed reviews prove that private Windows secret entry works. Use a working intended execution session and a tested private handoff before creating a token; do not repeat an existing working sign-in or send local credentials to the cloud task by default.

Once the setup is ready, this is the remaining list:

1. **Sign back into Claude Code only if the intended integrator session still needs it.** Astra first checks the existing session, so a working sign-in is not repeated. Use your existing account if prompted. No new plan or purchase is requested. The integrator then makes a harmless real request to confirm it works.
2. **Open your existing Cloudflare account** at [Cloudflare Dashboard](https://dash.cloudflare.com/). The integrator prepares the limited deployment-token permission summary for your account. Create the token only when the tested local secret-entry screen is ready; copy it directly there. Never paste it into this conversation, a task, a screenshot or a repository file.
3. **Open Clerk** at [Clerk Dashboard](https://dashboard.clerk.com/). Use an existing account/application if present; create the Earned application on the Free plan only if it is absent. Use email codes. The integrator checks the production instance before configuring anything again; passkeys and paid extras are excluded.
4. **Complete the prepared domain/sign-in steps.** The integrator shows the exact Clerk DNS records for earnedcoach.com. With the current permission arrangement, you add those specific records through Cloudflare's dashboard while guided; the deployment token has no DNS access. The integrator verifies production email delivery with synthetic test accounts. A separate DNS token would require its own scoped authorization; this packet does not grant it.
5. **Keep account recovery available away from this phone.** Choose an existing password manager that you can open from another device (recommended), or a securely kept printed recovery pack. Check that you can reach the sign-in mailbox from another device. The pack follows each provider's actual recovery method; email-code sign-in does not imply Clerk supplies printable recovery codes.
6. **Resolve the still-unrecorded choices once**, using the table below. The integrator fills in any provider, price or technical detail first. Skip any choice for which a newer accepted decision already exists.
7. **Arrange the later phone session.** Use your spare phone (recommended), or a borrowed phone you have permission to use for synthetic tests. Testing your actual history on two phones requires two phones you control. The integrator books the guided test, including an hour of passive waiting; it is not all completed in the account session.

| Unresolved choice | Two options and recommendation | What it blocks |
|---|---|---|
| Encrypted backup destination | A second computer you control, if available (recommended); or a private cloud destination after its provider, US location and cost are shown | Recovery custody and the restore drill |
| Recovery rehearsal machine | A clean second laptop/account, if available (recommended); or a clean cloud session after its provider, access and cost are shown | The clean-machine handoff drill |
| Disaster recovery objectives | Approve the proposed maximum 24 hours of server history lost and restoration within 4 hours (recommended starting target); or request tighter limits before the integrator sizes the work. Separately, no acknowledged entry should be lost while its phone store survives; an unsent entry can be lost if its only store is destroyed | Measured recovery acceptance; these figures are not yet accepted here |
| Spending-alert rehearsal | Wait for ordinary billable usage without added test spending (recommended if you prefer to wait); or authorize a separately demonstrated finite test costing at most $1 extra | The actual threshold alert must be observed before private import/M3 completion; waiting can delay those steps. No spending permission is inferred from this packet |
| Phone storage-pressure test | Disposable test material on your phone after a safe protocol is prepared (recommended only if safe); or a matching test phone | The later storage-survival verdict; never delete athlete data or reopen the idle test origin |

Estimated owner time: **plan for a 30–45 minute account/setup appointment once the preparation works**, plus the later guided phone/recovery checks. This is a scheduling allowance, not a measured completion time. Sign-in recovery and DNS verification can extend it. Clerk documents that DNS propagation can take up to 48 hours. [Clerk production setup](https://clerk.com/docs/guides/development/deployment/production).

The database's name and US requirement are already decided. The integrator creates or verifies it for you; you do not choose a “North America” location hint. Importing your history is a later, explicit approval after the required tests pass.

## The integrator's technical packet

**Accountable operator:** Claude Code (I). Astra coordinates and can prepare/review routine scoped fixes; cowork independently verifies acceptance. This file grants no merge, new spending, security-policy change or private-data release. Continue independent build work while setup is blocked.

### Evidence and actual state

| Item | Evidence as of this packet | Meaning |
|---|---|---|
| Integration inputs | Repository inspected at the full SHA above; `DECISIONS.md:33–37` supersedes older W6 status text | W6 v1.1 is accepted; old queue wording is not current acceptance evidence |
| Purchases / idle experiment | Existing ledger and roadmap record completed account/domain/alert actions and seeded W2 | Do not repeat purchases, deployment or seed from stale SETUP-HOST instructions |
| Local Cloudflare / Clerk handoff | Root reported presence-only checks of Windows **User** environment: both expected variables absent; no values printed | This does not prove credentials are absent from every process or provider, or that no token exists; do not manufacture duplicate credentials |
| Existing helper execution | Root's guarded `powershell.exe -NoProfile -NonInteractive -File … -SelfTest` was refused: scripts disabled / `UnauthorizedAccess`; no dummy-variable mutation occurred | `STORE-SECRET` BLOCKED; no success receipt exists from this attempt |
| Disallowed retry avoided | Root did not run the `.cmd` wrapper's `ExecutionPolicy Bypass` after the denial and did not change execution policy | Resolve through the normal authorized platform/administrator route; do not substitute another shell or mechanism to evade the restriction |
| Claude authentication | Actual local CLI request failed with expired OAuth despite logged-in status; the existing browser Cowork task independently accepted PR29 and PR30; the existing Claude Code cloud task executed PR29 preflight successfully | Local CLI route remains BLOCKED; browser review and cloud integrator execution are proven. The integrator's separate source-of-authority clarification is pending; neither route proves Windows secret handoff |
| Database | No tracked `rebuild/m3/D1-CREATED.md` on this base; no account inspection performed here | `US-CONFIG` NOT RUN; absence of a receipt is not proof no database exists |
| Tool version | `rebuild/m3/tooling/package.json` declares `wrangler: "^4"`; setup documents refer to 4.129.0; local `.npmrc` disables lockfiles | Declared dependencies do not reproduce the cited version |
| Full W4 / remote / phone gates | None run by preparing this packet | W4 BLOCKED; remote and physical verdicts remain NOT RUN or explicitly BLOCKED by their runners |

### 1. Prepare and review the narrow setup correction

Proposed scope for an integrator-owned setup correction: `rebuild/m3/SETUP-TOKEN.md`, `SETUP-D1.md`, `setup/`, `tooling/package.json`, plus one setup report. No product, frozen-app, suite, W5/W6-owned implementation, root lockfile or soak edits. Pin its actual base and scope before making the correction; cowork verifies the executed result. Do not mark this proposal itself accepted.

- **Reproducible Wrangler:** pin the required `4.129.0` exactly in the rebuild-only tooling package. Preserve the existing no-root-lockfile-churn contract. Record resolved runtime version and package identity. A direct version pin does not freeze every transitive dependency; document that residual rather than claiming a reproducible dependency tree.
- **Portable invocation:** replace `node …/node_modules/.bin/wrangler` in the instructions. A `.bin` entry may be a shell shim. Use a small reviewed Node launcher resolving the installed `wrangler/package.json` executable, invoking it through `process.execPath` with argument arrays, checking exactly 4.129.0 and failing if absent. It must never automatically fetch packages, discover accounts, echo credentials or alter environment policy. Validate version/help on Windows and Linux from the repository root.
- **Secret-entry self-test:** replace the fixed-variable overwrite/delete behavior. Use a collision-checked temporary test variable, or preserve and restore any pre-existing value in a `finally` cleanup path. Test failure/cleanup/cancel and `.cmd` argument forwarding. Never read or print a real credential during this test. A dummy-only in-memory test does not prove Windows User-environment persistence.
- **Execution restriction:** first record effective policy information without changing it, then follow the ordinary approved remediation route for this host. The existing `.cmd` wrapper includes a bypass flag; it must not be used as the response to the observed denial. Do not add a global permissive policy or rewrite the helper in another runtime to get around it. Until an authorized route is available and the genuine persistence self-test passes, keep secret-entry BLOCKED.
- **Handoff truth:** document that the existing design stores persistent Windows User environment variables under that user's profile; it is not an encrypted vault. Retain the accepted name allowlist. After successful entry, start a fresh intended integrator process and verify only presence and real authenticated behavior. Do not dump environment variables, token length, account emails or raw provider responses into public evidence.
- **Authentication reality:** use the already-proven browser verifier and existing cloud integrator for their public repository work. If the private deployment needs the local CLI, reauthenticate that session normally and execute one harmless real request first. Publish only success/failure and client version; do not inspect token files, repeat a working sign-in, or move private credentials/data into the cloud merely because the public route works.

These are setup/reproduction corrections, not changes to product behavior. The current script denial is an operating-system restriction, not an automatic approval-review rejection. No extra owner approval is requested by this packet; any required platform action must be named precisely when its normal resolution is known.

### 2. Prepare token, account and DNS screens

Use the existing custom-token requirements in `SETUP-TOKEN.md:10–41`: this Cloudflare account only; Workers Scripts Edit, D1 Edit, Account Settings Read and User Details Read as required by the actual calls; optional Workers Tail Read only when a drill needs it. Carry the reviewed 90-day expiry/rotation requirement. Verify actual provider permission names and need at setup; do not speculatively add KV, R2, Pages, billing, DNS or routes access. The table in the original file states that some scope details were derived, not tested on this account. [Cloudflare custom tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

The owner creates/copies a token only after the private local handoff has passed. Account/config readback must identify the intended account privately. Capture sanitized verdicts rather than printing `whoami` output into a report. If a token already exists through another approved handoff, verify and reuse it; do not rotate/revoke it merely because a User-environment presence check was false.

Inspect Clerk before creating an application or production instance. Preserve Free/email-code choices. Prepare the exact production issuer, allowed origins and redirect configuration against the **published W5** contract and the actual separate product origin. Do not invent a production URL, substitute a development instance for private data, or use the idle-soak origin.

For Clerk's verification CNAME, use DNS-only mode in Cloudflare. Preserve unrelated DNS/CAA records; do not bulk-remove records following generic troubleshooting advice. The token currently has no DNS scope, so the owner makes the prepared dashboard changes unless separately scoped access is authorized. Verify synthetic sign-in and mailbox recovery after DNS/certificate readiness. [Clerk production requirements and Cloudflare DNS note](https://clerk.com/docs/guides/development/deployment/production).

### 3. Execute idempotent US-database provisioning after setup readiness

The following is an execution sequence for I, **not a command the owner runs and not an executed verdict**:

1. Verify the approved token and explicit intended Cloudflare account/config using the pinned launcher; capture only a sanitized authentication/config verdict.
2. Read the account's database list. If `earned-us` exists, inspect its identity and jurisdiction; reuse only the intended matching database. A name collision, unknown contents or wrong jurisdiction is a named blocker. Do not delete or recreate any database from this packet.
3. Only if the intended database is absent, create `earned-us` with `--jurisdiction=us` and the explicit prepared config. Cloudflare documents `us` as a supported jurisdiction; a location hint is a different option. [Wrangler D1 commands](https://developers.cloudflare.com/workers/wrangler/commands/d1/).
4. Read back the actual database configuration with `d1 info … --json`; if jurisdiction is omitted, verify it through the account-scoped D1 API. The creation command alone is insufficient evidence. If `us` is unavailable or cannot be verified, leave `US-CONFIG BLOCKED`; do not fall back to `wnam` or `enam` without an owner ruling.
5. Prepare `rebuild/m3/D1-CREATED.md` with the existing approved nonsecret configuration receipt and `US-CONFIG PASS` only after actual readback. Keep account identities and raw provider output out of public logs. Do not add the token to config, commands or the report.
6. Keep the database free of owner data. Apply only W5's independently verified schema on the intended synthetic environment after checking the exact reviewed commit and migration target. Never author replacement tables from this setup packet.

Database provisioning does not require W5 implementation to be finished. Actual service binding/deployment and remote protocol acceptance do. Preserve the distinction between created, configured, deployed and tested.

### 4. Prepare recovery, cost and the later device appointment

- Produce a custody inventory covering the database export, payload keys, identity/HMAC keys and server signing-key epochs. Separate identity, encryption and signing roles. Authority private signing material remains server-side; W5/W6 publish the actual crypto profiles before production key setup. Do not invent recovery compatibility while those contracts are unpublished.
- Prepare an encrypted export/import runbook into a separate database and isolated logical account/environment, preserving signed identities and later writes. Never rehearse by rewinding the live database. The accepted plan proposes six-hour exports as margin within the still-proposed 24-hour loss objective; both actual schedule and agreed objectives must be recorded before claiming RESTORE PASS.
- Prepare the real spending-alert rehearsal: retain the existing $5 usage alert, inspect supported rehearsal thresholds and included allowances, calculate finite work/charge limits before seeking the remaining billing choice, then stop and await billing processing. Do not generate traffic until that choice is recorded. A configured alert or “send test” message is not the required observed threshold event; alerts do not stop spending. [Cloudflare budget alerts](https://developers.cloudflare.com/billing/manage/budget-alerts/).
- Book the two-phone synthetic session, recovery access and safe pressure window in this same packet after readiness. The real phone tests and private import remain later steps, not prerequisites for the account session. The clock diagnostic may share the appointment; it does not itself produce CLOCK acceptance.
- Treat the existing soak receipt as evidence of its pinned implementation only. Do not open, update, reseed, poll or host over that origin. Any production store with different survival assumptions needs its own qualifying evidence.

### 5. Verification and completion receipts

Use these rows as a checklist, not as prewritten passing output. Every result must name the tested commit, real environment and evidence location. For local setup checks, preserve exact executed output privately and publish a sanitized verdict. Physical/remote missing environments must never be simulated as passing.

| Check / stage | Prerequisites and required evidence | Current result |
|---|---|---|
| Portable tooling | Exact 4.129.0 resolved; version/help and argument forwarding verified on Windows and Linux, from repo root | NOT RUN for corrected setup |
| Secret handoff | Normal authorized helper execution; dummy persistence, cleanup, collision and cancel cases; fresh-process handoff proved without real values exposed | BLOCKED: Windows script execution refusal |
| Intended integrator execution | Prove the existing integrator session with a harmless real request; normal reauthentication only if needed | Existing cloud integrator executed PR29 preflight; public review route has returned acceptance. Local CLI still BLOCKED by expired OAuth; private deployment route not proven |
| W4-PACKET | Remaining screens/private handoff and known choices prepared; completed actions removed; no owner terminal work | DRAFT: this file needs execution review |
| US-CONFIG | Intended account/database and actual `us` readback | NOT RUN |
| W4 readiness | Production Clerk/email/DNS tested synthetically; actual key/sealing/recovery custody recorded; US-CONFIG PASS | BLOCKED by setup, credentials and unpublished crypto inputs |
| W4-DEPLOY | Independently verified W5 commit; correct schema/bindings/config; separate synthetic service and allowlisted upload | NOT RUN; W5 verification and W4 readiness required |
| AUTH-D1 / HTTP-190 remote | Real deployed synthetic service and real synthetic identities; required isolation/replay/C6 assertions executed | NOT RUN; no local model substitutes |
| W8 | Owner objectives/custody/billing choice plus W4–W7 readiness; RESTORE, KEYS-RECOVERY, IMPORT-ROLLBACK, TELEMETRY-COST PASS | NOT RUN |
| W9 / W10a | Ready synthetic phones and application, physical/lifecycle cases, then clean-machine HANDOFF PASS | NOT RUN |
| W10b owner import | M2 CLOSED; all synthetic pre-port/recovery/phone/handoff gates; cowork/Sol closure; correct account and owner's actual import approval | BLOCKED; this packet authorizes no private port |

For a scoped setup-code PR, run the meaningful new helper/launcher tests and the unchanged required regression checks. Use explicit `ENGINE_MAIN`/`ENGINE_OLD`, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York` for conformance after AGENTS preparation: `SUITE CONSISTENT` and `SELFTEST PASS`; unset `MEASURED_TEST_NOW` for strict checks. Require the existing accepted Windows/Linux rebuild CI on the exact reviewed/integrated commit. A real `node_modules` directory is required; no symlinked dependency shortcut. Do not publish private fixture contents or add frozen suite edits to make setup pass.

End the integrator report with the exact setup results, remaining owner actions, queue IDs advanced and NEXT. Cowork independently verifies the result before integration; Astra must not mark W4 or another gate DONE from this packet alone. If setup is blocked, state the precise failed operation and the smallest ordinary next action while builders continue independent work.

## Source and review record

Repository inputs at the pinned SHA: `AGENTS.md`; `GOALS.md`; `NEXT.md`'s rebuild redirect; `rebuild/ROADMAP.md`; `rebuild/DECISIONS.md:9–11,25–37`; `rebuild/QUEUE.md:35–43,48–64`; `rebuild/m3/PLAN-M3-v1.md:12–27,39–51,84–114,125–151`; `rebuild/m3/BRIEF-W6.md:11–12,35–48,81–112`; `rebuild/m3/w0/CONTRACTS.md`; `SETUP-TOKEN.md`; `SETUP-D1.md`; `SETUP-HOST.md` (historical setup instructions, not current soak status); `setup/store-secret.cmd`; `setup/store-secret.ps1`; `tooling/package.json`.

Primary vendor pages above were read on 2026-09-06. They support documented capabilities, not this account's entitlement or a passed setup. Local execution observations in the status table were supplied by the coordinating Astra task; this packet's author performed read-only repository/document review and wrote this file. No new local persistence, provider, credential, device, billing or acceptance test was run by this author. Root content review and a same-family challenge corrected appointment ordering, recovery-loss wording, alert-delay disclosure and the scope of the current Cowork review. **Proposed packet; independent execution verification remains required.**
