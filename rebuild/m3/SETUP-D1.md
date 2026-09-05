# M3 SETUP — creating the D1 database `earned-us` (prepared 2026-09-05; NOT RUN YET — runs the moment CLOUDFLARE_API_TOKEN is in place)

Owner ruling: D1 created with `--jurisdiction=us`. Integrator seat executes; nothing here touches the frozen app.

## 0. Tooling (already committed on the rebuild branch)
`rebuild/m3/tooling/package.json` declares `wrangler` as a devDependency of the REBUILD only. The frozen app's root `package.json`
and `package-lock.json` are untouched; `rebuild/m3/tooling/.npmrc` sets `package-lock=false` so no lockfile is ever written there.
Installed here: wrangler **4.129.0** (`npm install --no-package-lock --include=dev` inside `rebuild/m3/tooling`, 38 packages).
Invoke it as `node rebuild/m3/tooling/node_modules/.bin/wrangler …` (or `npx --prefix rebuild/m3/tooling wrangler …`).

## 1. Facts checked before writing the steps
- `wrangler d1 create --help` (4.129.0) lists `--jurisdiction` choices **eu · fedramp · us** ("us: The United States"). The public
  docs page (developers.cloudflare.com/d1/configuration/data-location, fetched 2026-09-05) still lists only `eu` and `fedramp` — the
  CLI is ahead of the page. The ruling `--jurisdiction=us` is therefore executable as written; if the API rejects `us` on the day,
  the fallback is `--location=wnam` (a HINT, not a residency guarantee — the same doc says so) and that needs the owner's word.
- Jurisdictions "can only be set on database creation and cannot be added or updated after the database exists" (same page). So the
  name and jurisdiction are decided once; a mistake means delete-and-recreate BEFORE any data exists, never after.
- `wrangler d1 info <name> --json` exists (4.129.0) and prints the database id, version, size and read/write counts as JSON.

## 2. The steps (integrator, in this order, each output kept in the report as a verdict line — no ids beyond the database id)
```
export CLOUDFLARE_API_TOKEN=…        # NOT typed: it arrives from the Windows USER environment (SETUP-TOKEN.md §3); never echoed
W=node\ rebuild/m3/tooling/node_modules/.bin/wrangler

$W whoami                                                   # 1. proves the token; names the account; lists the token's permissions
$W d1 list --json                                           # 2. must NOT already contain earned-us (idempotence guard)
$W d1 create earned-us --jurisdiction=us                    # 3. THE create (once). Output: database_name, database_id, the binding stanza
$W d1 info earned-us --json                                 # 4. read-back: uuid, version, num_tables (0), file_size, running_in_region
```
Record from step 4 into `rebuild/m3/D1-CREATED.md`: `database_name`, `database_id`, `created_at`, `version`, and the jurisdiction as
reported. The database id is not a secret (it goes in wrangler.toml); the token is. Do NOT run `d1 create` twice — a second run with
the same name errors, a second run with a different name leaves an orphan database billed against the $5 plan.

## 3. What comes AFTER (not this document): the Worker's `wrangler.toml` gets
```
[[d1_databases]]
binding = "EARNED_DB"
database_name = "earned-us"
database_id = "<from step 4>"
```
and the schema migration (`wrangler d1 migrations create/apply`) lands with Astra's W2 bridge PR — the integrator applies it, never
authors the tables by hand.

## 4. Abort conditions
- `whoami` fails → the token or its permissions (SETUP-TOKEN.md §2) — fix the token, do not retry blindly.
- `d1 list` already shows `earned-us` → STOP and report; someone created it already (do not create a second).
- `d1 create … --jurisdiction=us` is rejected → STOP; report the exact error; the owner rules between `--location=wnam` (hint) and waiting.
