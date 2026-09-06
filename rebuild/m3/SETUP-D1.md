# M3 SETUP — creating the D1 database `earned-us` (prepared 2026-09-05; NOT RUN YET — runs the moment CLOUDFLARE_API_TOKEN is in place)

Owner ruling: D1 created with `--jurisdiction=us`. Integrator seat executes; nothing here touches the frozen app.

## 0. Tooling (committed on the rebuild branch; hardened 2026-09-06)
`rebuild/m3/tooling/package.json` pins `wrangler` EXACTLY to **4.129.0** as a devDependency of the REBUILD only. The frozen app's
root `package.json` and `package-lock.json` are untouched; `rebuild/m3/tooling/.npmrc` sets `package-lock=false` so no lockfile is
ever written there. Install once with `npm install --prefix rebuild/m3/tooling --no-package-lock --include=dev`.
**A direct pin is not a transitive lock:** wrangler's own dependencies resolve fresh at install time; only the wrangler package
identity and version are guaranteed and checked.
Invoke it ONLY through the launcher — `node rebuild/m3/setup/wrangler.cjs …` — never via `node_modules/.bin/wrangler` (a symlink on
Linux, a `.cmd`/`.ps1` shim on Windows). The launcher resolves the installed package's own `bin` file, refuses any version other
than 4.129.0, runs it with the same `node` (argument array, no shell), refuses `login`/`logout`, and never installs, fetches or
prints a credential. `node rebuild/m3/setup/wrangler.cjs --launcher-check` verifies the install and spawns nothing.

## 1. Facts checked before writing the steps
- `wrangler d1 create --help` (4.129.0) lists `--jurisdiction` choices **eu · fedramp · us** ("us: The United States"). The public
  docs page (developers.cloudflare.com/d1/configuration/data-location, fetched 2026-09-05) still lists only `eu` and `fedramp` — the
  CLI is ahead of the page. The ruling `--jurisdiction=us` is therefore executable as written; if the API rejects `us` on the day,
  the fallback is `--location=wnam` (a HINT, not a residency guarantee — the same doc says so) and that needs the owner's word.
- Jurisdictions "can only be set on database creation and cannot be added or updated after the database exists" (same page). So the
  name and jurisdiction are decided once; a mistake means delete-and-recreate BEFORE any data exists, never after.
- `wrangler d1 info <name> --json` exists (4.129.0) and prints the database id, version, size and read/write counts as JSON.

## 2. The steps (integrator, in this order, in a FRESH process; each output kept in the report as a verdict line — no ids beyond the database id)
```
# CLOUDFLARE_API_TOKEN is NOT typed or exported here: it arrives from the Windows USER environment (SETUP-TOKEN.md §3) into a
# process started FRESH after the hand-over; it is never echoed.
W="node rebuild/m3/setup/wrangler.cjs"

$W --launcher-check                                         # 0. pinned wrangler 4.129.0 resolved; nothing spawned
$W whoami                                                   # 1. proves the token; names the account; lists the token's permissions (keep private)
$W d1 list --json                                           # 2. INSPECT BEFORE CREATE — see the rule below
$W d1 info earned-us --json                                 # 2b. only if earned-us exists: identity + jurisdiction read-back
$W d1 create earned-us --jurisdiction=us                    # 3. ONLY if step 2 showed no earned-us. Output: database_name, database_id, binding stanza
$W d1 info earned-us --json                                 # 4. read-back: uuid, version, num_tables (0), file_size, running_in_region / jurisdiction
```
**Inspect / reuse before create (W4-READY-PACKET §3):** if `earned-us` already exists, read its identity and jurisdiction (step 2b)
and REUSE it only if it is the intended database with jurisdiction `us` and no unknown contents. A name collision, unknown
contents or a wrong jurisdiction is a NAMED BLOCKER — report it; never delete or recreate a database from this document. Create
(step 3) only when step 2 shows the name absent. If `d1 info` omits the jurisdiction, verify it through the account-scoped D1 API
before recording `US-CONFIG PASS`; the create command alone is not evidence.
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
- `d1 list` already shows `earned-us` → do NOT create; inspect with `d1 info` (§2 step 2b): reuse only the intended `us` database,
  otherwise STOP and report the collision as a named blocker (never delete, never create a second).
- `--launcher-check` fails → the pinned install is missing or the wrong version; reinstall from `rebuild/m3/tooling/package.json`
  (the launcher never installs by itself).
- `d1 create … --jurisdiction=us` is rejected → STOP; report the exact error; the owner rules between `--location=wnam` (hint) and waiting.
