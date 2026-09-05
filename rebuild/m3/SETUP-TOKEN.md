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

## 3. Handing it over WITHOUT a terminal (the owner's part, ~1 minute)
1. Create the token (§2). Cloudflare shows the value ONCE. Do not paste it into any chat.
2. In the repo folder on the PC open `rebuild\m3\setup\` and **double-click `store-secret.cmd`**.
3. A small window asks which secret → choose **CLOUDFLARE_API_TOKEN** → Next.
4. Paste the token into the masked box (dots) → **Store**. A message confirms "Stored CLOUDFLARE_API_TOKEN (N characters)".
5. Close and reopen Claude Code (and any terminal). It now sees `CLOUDFLARE_API_TOKEN` as a Windows USER environment variable.
The same file stores **CLERK_SECRET_KEY** later (choose it in step 3).

What the file does and does not do: it writes exactly one Windows user environment variable (HKCU\Environment) through
`[Environment]::SetEnvironmentVariable(name, value, 'User')`, verifies by reading it back and comparing, and prints only the NAME
and the LENGTH. It never echoes the value, never writes a file, never touches the repo, and refuses any variable name not on its
two-name allow-list. Self-test (no real secret): run `store-secret.cmd --selftest` — it stores a random throw-away value under
`EARNED_SELFTEST_VAR`, reads it back, deletes it, and prints `store-secret selftest OK — … round-tripped (32 chars) and was removed`.

**Test status (honest):** the integrator's build session runs on Linux (no `cmd.exe`, no PowerShell available), so the dummy
round-trip could NOT be executed here. The self-test is built in; the FIRST person on the Windows PC (the owner, or the next local
Claude Code session) runs `store-secret.cmd --selftest` once and quotes the OK line into the next report. Until that line exists,
treat the mechanism as written-not-proven.

## 4. After the token is in place (integrator, one session)
```
node rebuild/m3/tooling/node_modules/.bin/wrangler whoami            # names the account; proves the token works; prints no secret
```
then the D1 steps in `SETUP-D1.md`. The token is read from the environment only; wrangler never writes it to disk on our side
(we do not use `wrangler login`, so no `~/.wrangler/config` token file exists).

## 5. Rotation and revocation
- Rotate at 90 days (TTL) or immediately after M3's drills; revoke in the dashboard (API Tokens → Roll / Delete) and re-run §3.
- If the token is ever suspected exposed: dashboard → delete it → new token → §3. Nothing in the repo changes.
