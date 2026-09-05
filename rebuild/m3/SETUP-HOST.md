# M3 SETUP — a SEPARATE origin for the soak stub (W2 host `earned-soak`) — prepared 2026-09-05

Purpose: the 30-day IndexedDB soak (PLAN-M3-v1 §2 W1 / §6 SOAK-30) runs on the owner's phone from an origin that is NOT the frozen
app's (fitnessledger2.netlify.app) and NOT the future product's. Same origin = shared storage quota and a shared service worker,
which would confound both the soak and the frozen app. The host deploys ONLY `rebuild/m3/soak-stub/` — nothing of the frozen app,
nothing private — and only when Astra's W1 PR has landed that folder on `rebuild/t2-client-core`.

## Status (honest)
**Not created yet.** The integrator's build session holds no Netlify credential and no Cloudflare token (the token is being created —
SETUP-TOKEN.md), so neither host could be created here "without a new secret". Both paths below are ready to run the moment one of
those credentials exists; the recommended path needs no NEW secret at all (path A).

## Path A (recommended) — a second Netlify site, created by the existing pipeline's own credential
The repo's GitHub Actions already hold `NETLIFY_AUTH_TOKEN` (deploy.yml uses it for production). A second site can be created and
deployed by that same secret inside a NEW, separate workflow — no secret is copied anywhere, no human ever sees it.
1. Astra's W1 PR lands `rebuild/m3/soak-stub/` (index.html, sw.js, manifest.webmanifest, the stub script; ≤ 10 files; no ledger data).
2. The integrator adds `.github/workflows/soak.yml` (below), pushes it on `rebuild/t2-client-core`. NOTE: pushing a workflow file needs
   the GitHub PAT's *Workflows: Read and write* permission (CLAUDE.md documents this); if the push is refused, the owner adds the file
   through the GitHub web UI once.
3. First run (manual `workflow_dispatch`): the job creates the site `earned-soak` if absent (Netlify API `POST /api/v1/sites`), then
   zips `rebuild/m3/soak-stub/` and deploys it exactly like deploy.yml does for production. It prints the site URL
   (`https://earned-soak.netlify.app`) in the run log — that URL is what the owner installs from.
4. Every later push touching `rebuild/m3/soak-stub/**` redeploys the same site. Nothing else triggers it.

```yaml
# .github/workflows/soak.yml — deploy ONLY rebuild/m3/soak-stub/ to the separate Netlify site "earned-soak"
name: soak-stub
on:
  workflow_dispatch:
  push:
    branches-ignore: [main]
    paths: ["rebuild/m3/soak-stub/**", ".github/workflows/soak.yml"]
jobs:
  soak:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create-or-find the site, deploy the stub folder only
        run: |
          set -o pipefail
          NT="${{ secrets.NETLIFY_AUTH_TOKEN }}"
          SITE=$(curl -s -H "Authorization: Bearer $NT" "https://api.netlify.com/api/v1/sites?per_page=100" \
            | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const s=JSON.parse(d).find(x=>x.name==='earned-soak');process.stdout.write(s?s.id:'')})")
          if [ -z "$SITE" ]; then
            SITE=$(curl -s -X POST -H "Authorization: Bearer $NT" -H "Content-Type: application/json" -d '{"name":"earned-soak"}' \
              "https://api.netlify.com/api/v1/sites" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>process.stdout.write(JSON.parse(d).id))")
            echo "created site earned-soak ($SITE)"
          fi
          test -d rebuild/m3/soak-stub || { echo "no rebuild/m3/soak-stub yet — nothing to deploy"; exit 1; }
          (cd rebuild/m3/soak-stub && zip -qr "$RUNNER_TEMP/soak.zip" .)
          DEP=$(curl -s -X POST -H "Authorization: Bearer $NT" -H "Content-Type: application/zip" --data-binary @"$RUNNER_TEMP/soak.zip" \
            "https://api.netlify.com/api/v1/sites/$SITE/deploys" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>process.stdout.write(JSON.parse(d).id))")
          for i in $(seq 1 30); do
            ST=$(curl -s -H "Authorization: Bearer $NT" "https://api.netlify.com/api/v1/deploys/$DEP" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>process.stdout.write(JSON.parse(d).state))")
            [ "$ST" = "ready" ] && echo "PUBLISHED https://earned-soak.netlify.app" && exit 0
            [ "$ST" = "error" ] && exit 1
            sleep 4
          done; exit 1
```
Guard rails: the job zips one folder; the frozen app's manifest (`scripts/site-manifest.mjs`) is not involved; `ledger/`, `src/`,
`private/` cannot be included because the zip is rooted inside `rebuild/m3/soak-stub`. The soak site gets its OWN `_headers`
(no-store on sw.js) inside that folder — Astra's W1 owns the folder's contents.

## Path B — Cloudflare Pages project `earned-soak` (once CLOUDFLARE_API_TOKEN exists)
Needs the token to carry **Cloudflare Pages: Edit** (NOT in the minimal M3 list — add it only if this path is chosen).
```
W=node\ rebuild/m3/tooling/node_modules/.bin/wrangler
$W pages project create earned-soak --production-branch rebuild/t2-client-core
$W pages deploy rebuild/m3/soak-stub --project-name earned-soak       # URL: https://earned-soak.pages.dev
```
Same origin-separation property; one more permission on the token; no GitHub Actions involvement. Choose B only if the owner prefers
one vendor for everything Cloudflare.

## What the owner does (either path), day 1 of the soak
Open the URL the integrator sends (`https://earned-soak.netlify.app` or `…pages.dev`) on the iPhone 17 Pro (iOS 26.6.1) in Safari →
Share → Add to Home Screen → open it once from the home screen → note the date the card shows → leave it alone for 30 days. The
stub's install date, device and iOS version go into `rebuild/m3/SOAK-1.md` (Astra's W1 deliverable) by the integrator.

## Blockers to record
- Path A needs the workflow file pushed (PAT *Workflows* permission or a one-time owner click in the GitHub UI).
- Path B needs the token (SETUP-TOKEN.md) plus the Pages permission.
- Both need Astra's W1 PR (`rebuild/m3/soak-stub/`) — nothing to deploy before it.
