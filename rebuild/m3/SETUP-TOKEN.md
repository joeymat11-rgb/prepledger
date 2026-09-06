# M3 SETUP — the deploy token (Cloudflare API token for the integrator seat) and how the owner hands it over

Prepared 2026-09-05 by the integrator seat (Claude Code). No secret value appears in this file or in any report, ever.

## 1. What the token is for
The integrator runs `wrangler` on the owner's behalf to: create the D1 database `earned-us`, deploy the Worker, set the Worker's
secrets (the authority signing key, later Clerk's secret), and read back `d1 info` / `whoami`. Nothing else. It is NOT the
Worker's runtime secret, NOT Clerk's key, and it never leaves the owner's PC except as an HTTPS header from wrangler to Cloudflare.

## 2. The permission list (create it as a CUSTOM token, not from a template)
Cloudflare dashboard → My Profile → API Tokens → Create Token → **Create Custom Token**.

| permission (exact dashboard label) | level | why this project needs it | verified how |
|---|---|---|---|
| Account · **Workers Scripts** | Edit | `wrangler deploy`, `wrangler secret put`, `wrangler tail` (tail also needs Read, Edit covers it) | wrangler needs it for every Worker write; Cloudflare's CI page says to use the "Edit Cloudflare Workers" policy, whose core is this permission |
| Account · **D1** | Edit | `wrangler d1 create / info / execute / migrations` | wrangler `d1 create --help` acts on remote D1 databases; D1 has its own permission group |
| Account · **Account Settings** | Read | `wrangler whoami` and account-id discovery when `account_id` is not in wrangler.toml | Cloudflare's API-token page: read-only "Read" level exists per permission; the account lookup is a read |
| User · **User Details** | Read | `wrangler whoami` on a user-scoped token (prints the account list and the token's own permissions) | same |
| Account · **Workers Tail** | Read | live logs during the drills (`wrangler tail`) — optional, add only when a drill needs it | wrangler tail requires it |

**NOT included (deliberately):** Workers KV Storage (this project has no KV), Workers R2 (no R2), Zone · DNS (no DNS edits from
the integrator: earnedcoach.com records are the owner's clicks in the dashboard), Workers Routes / custom domains (M3 ships on
`*.workers.dev`; a custom domain on earnedcoach.com is a later step and will need Zone · Workers Routes:Edit + Zone:Read on THAT
zone only — add then, not now), Memberships:Read (only needed for multi-account tokens), Pages (the soak host is a separate origin,
see SETUP-HOST.md), Access, Billing.

**Clerk's CNAME:** Clerk production on a custom domain needs CNAME records under earnedcoach.com. Those are the OWNER's dashboard
clicks (Cloudflare DNS UI), not this token — so the token still carries **no DNS permission**. If the owner later wants the
integrator to add those records, that is a second, DNS-only token with a short expiry, ruled separately.

Scoping fields on the same screen:
- **Account Resources** → *Include* → **the owner's account only** (never "All accounts").
- **Zone Resources** → *not needed* (leave as "All zones — none required" by not adding a zone permission).
- **Client IP Address Filtering** → leave empty (the owner's PC IP changes).
- **TTL** → **start date today, end date +90 days**. Wrangler stops working the day it expires; that is the reminder to rotate.

Verification the docs allow today: Cloudflare's docs describe the "Edit Cloudflare Workers" template as the CI policy and describe
Edit/Read levels and the TTL field, but do NOT itemise the template's contents (fetched 2026-09-05:
developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/ and /fundamentals/api/get-started/create-token/). The table
above is therefore the MINIMAL custom set derived from what wrangler 4.129.0 actually calls; if `wrangler whoami` or `d1 create`
reports a missing permission on first use, the exact name is in wrangler's error and gets added — nothing is granted speculatively.

## 3. Handing it over WITHOUT a terminal (the owner's part, ~2 minutes) — hardened 2026-09-06 (W4-READY-PACKET §1)
**First PC-session action, BEFORE any token exists — the dummy-only self-test:**
- In the repo folder on the PC open `rebuild\m3\setup\` and **double-click `store-secret-selftest.cmd`**. It writes a temporary
  variable named `EARNED_SELFTEST_<random>` with a dummy marker value into your Windows USER environment, reads it back, removes it,
  and prints ONE line: `store-secret selftest OK — a temporary owned variable round-tripped through the Windows USER environment
  and was removed` (or a `FAIL — …` line naming what went wrong). Quote that one line to the integrator. No real secret is involved,
  nothing of yours is read, no value or length is ever printed.
- Optional, also dummy-only: **double-click `store-secret-tests.cmd`** — runs the helper's unit tests against in-memory stand-ins
  (nothing touches your environment) and ends with `store-secret tests: N passed, 0 failed`.
If the window says PowerShell scripts are disabled, stop and report the exact sentence; do not change any policy and do not ask
for an administrator — that is a decision for the owner, not a step in this file.

**Second PC-session action, still dummy-only — the FRESH-PROCESS proof (required before any token exists):**
- Double-click **`store-secret-freshproof-arm.cmd`**. It writes a temporary variable `EARNED_FRESHPROOF_<random>` with a dummy value
  into your USER environment and prints ONE line with its NAME (never a value). The dummy value is derived from that NAME, so the
  NAME is the only thing to relay. The window stays open until you press a key.
- **Close every Claude Code window and every terminal. Open Claude Code again FRESH from the Start menu or taskbar** (this is the
  LOCAL Claude Code on the PC — see "Which integrator process" below). In that fresh session the integrator runs
  `store-secret.cmd --verify-fresh-proof NAME` (the NAME may be omitted when only one is armed) and reports the one printed line:
  `fresh-proof OK` means a freshly started program really inherits what the helper stored; `FAIL — … not started fresh` means the
  window was opened from a stale parent, not that anything is broken — close everything and start again.
- Afterwards double-click **`store-secret-freshproof-cleanup.cmd`** (or the integrator runs `store-secret.cmd --cleanup-fresh-proof`).
  It removes armed dummy variables only when their value is EXACTLY the expected one; anything else is left alone and named.
Both dummy steps prove the mechanism (persistence + fresh-process visibility) without any real secret.

**Which integrator process (authentication reality, W4-READY-PACKET §2):** the proofs above, the `whoami` in §4 and the D1 steps run
in the **LOCAL Claude Code installed on the PC** (2.1.221 as of 2026-09-06), because only a process on the PC can inherit the Windows
USER environment. The cloud Claude Code session that integrates PRs cannot see it and must never be sent the variable, its value or
any private data. On 2026-09-06 the local install's `claude auth status --json` returned exit 1 / `loggedIn: false` (no credential
file inspected, no account detail printed, no login attempted). So the same PC appointment includes, BEFORE token creation and
before the fresh-process proof counts: the owner signs the LOCAL Claude Code in the ordinary way (existing account, no new plan or
purchase), and the integrator makes one harmless real request in that fresh local session and reports only success/failure and the
client version. No new owner action is requested now — it is bundled into the one appointment.

**Then the real hand-over (only after BOTH dummy proofs have their OK lines and the local sign-in has worked):**
1. Create the token (§2). Cloudflare shows the value ONCE. Do not paste it into any chat.
2. In `rebuild\m3\setup\` **double-click `store-secret.cmd`**.
3. A small window asks which secret → choose **CLOUDFLARE_API_TOKEN** → Next. (If a value already exists it asks whether to replace
   it, without showing it; No keeps the old one.)
4. Paste the token into the masked box (dots) → **Store**. A message confirms `Stored CLOUDFLARE_API_TOKEN in your Windows user
   environment (value not shown)`.
5. **Close Claude Code and every terminal, then open them again FRESH from the Start menu or taskbar.** A program started from an
   already-running window inherits that window's OLD environment and will not see the new variable — a child of a stale parent is
   not refreshed. The fresh process now sees `CLOUDFLARE_API_TOKEN` as a Windows USER environment variable.
The same file stores **CLERK_SECRET_KEY** later (choose it in step 3).

What the file does and does not do: it writes exactly one Windows user environment variable (HKCU\Environment) through
`[Environment]::SetEnvironmentVariable(name, value, 'User')`, verifies by reading it back and comparing, and prints only FIXED
sentences with an allowlisted name and an OUTCOME word (stored / unverified / failed / cancelled). It never echoes the value, its
length, or ANY argument it was given (a misplaced secret typed as an argument cannot reach the screen), never writes a file, never
touches the repo, refuses any variable name not on its two-name allow-list, and never overwrites an existing value without asking.
If Windows accepts the write but returns something different on read-back, it says UNVERIFIED — it does not claim success. Its
dummy variables (`EARNED_SELFTEST_*`, `EARNED_FRESHPROOF_*`) are removed only when they still hold the EXACT value it wrote; a
changed value is never deleted, only reported.
**Where the value lives:** the Windows USER environment is part of your Windows profile, protected only by your Windows sign-in. It
is NOT an encrypted vault. Anything that runs as you can read it; that is the accepted trade-off for "no terminal, no file".

**Test status (honest):** the integrator's build session runs on Linux (no `cmd.exe`, no PowerShell), so nothing in this section
could be executed there. The launcher in §4 was tested on Linux; the PowerShell helper's core logic has unit tests
(`setup\test\store-secret.tests.ps1`) that have NOT RUN yet. An earlier agent attempt to run the `.ps1` directly was refused by the
PC's script policy; that says nothing about the owner-run double-click route, which has NOT been tried. Until the owner's OK line
exists, treat the mechanism as written-not-proven, and create no token.

## 4. After the token is in place (integrator, one FRESH session — the dummy fresh-process proof in §3 must already have passed)
```
node rebuild/m3/setup/wrangler.cjs --launcher-check        # resolves the pinned wrangler 4.129.0; spawns nothing
node rebuild/m3/setup/wrangler.cjs whoami                  # AUTHENTICATION proof (separate from the fresh-process proof): report only "success/failure" + the client version
```
`wrangler.cjs` is a small reviewed launcher: it finds the installed package under `rebuild/m3/tooling`, checks it is exactly
wrangler 4.129.0, and runs it with the same `node` that runs the launcher (argument array, no shell). It never installs or fetches
anything, never logs in (`wrangler login`/`logout` are refused), never prints a credential, and turns wrangler's telemetry off.
The `whoami` output names the account and the token's permissions — keep it private; the report carries only the verdict.
The token is read from the environment only; wrangler never writes it to disk on our side (no `~/.wrangler/config` token file).
Then the D1 steps in `SETUP-D1.md`.

## 5. Rotation and revocation
- Rotate at 90 days (TTL) or immediately after M3's drills; revoke in the dashboard (API Tokens → Roll / Delete) and re-run §3.
- If the token is ever suspected exposed: dashboard → delete it → new token → §3. Nothing in the repo changes.
