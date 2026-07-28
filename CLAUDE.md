# Prep Ledger — project rules

Single-file React PWA. Personal N=1 training/nutrition ledger for one athlete.
Live at <https://fitnessledger2.netlify.app>. Full context: read `HANDOFF.md`
before your first substantial change.

---

## Working from scratch

Everything below assumes you have nothing but this repo and a GitHub token.

```bash
git clone https://github.com/joeymat11-rgb/prepledger.git
cd prepledger
node scripts/bootstrap.mjs      # or: bash setup.sh
```

`bootstrap` installs the pinned dependencies and runs the whole gate. When it
says **"Green from a bare clone"**, the checkout is proven — you can change
things.

### The five commands

| | |
|---|---|
| `npm run bootstrap` | fresh clone → proven green. Safe to re-run anytime. |
| `npm test` | the suite only (engine, render, dom and beacon smokes) |
| `npm run check` | the suite **plus** the gate. What CI runs. |
| `npm run serve` | preview the site locally, on a port the OS picks |
| `npm run ship -- "note"` | test → build → commit → push → confirm live |

### The gate — `scripts/check.mjs`

Seven things must be true before anything reaches her phone. Each one exists
because it has already gone wrong once, or would go wrong silently.

1. **Suite green** — 359 engine assertions, every tab rendered in three states,
   the committed `app.js` boots in a DOM, and the error beacon is proved unable
   to throw.
2. **`app.js` is not stale.** `app.js` is a *committed build artifact*: Netlify
   serves this repo as-is with no build step, so an un-rebuilt commit silently
   deploys yesterday's app while every test passes. The gate rebuilds `src/` and
   compares bytes. `--strict` (CI) makes a mismatch a hard failure.
3. **Service worker version matches `APP_V`.** If `sw.js`'s cache name and
   `APP_V` drift, installed phones keep serving the old bundle forever and the
   ship is a no-op that looks like a success. `npm run ship` syncs them for you.
4. **The lockdown is intact.** `/ledger/*`, `/src/*` and `/tools/*` must still be
   404 + `no-store` in `_redirects` / `_headers`.
5. **No secrets committed.** The tree is scanned for anything token-shaped.
6. **The deploy manifest is clean.** The exact set of files sent to the CDN is
   asserted to contain everything the app needs and nothing private.
7. **The pipeline is still wired.** A YAML error in a workflow does not fail
   loudly — GitHub just stops running it, and everything after ships ungated.
   So the gate checks that `deploy` still needs `test` and is still main-only.

### Shipping

```bash
npm run ship -- "raised the analyst read above the fold"
```

Rebuilds, runs the gate, refuses to push anything red, then waits for the deploy
beacon and only reports success once the site is actually live. It reads
`GH_TOKEN` from the environment (on Windows, from the *user* environment
variable, which a shell opened earlier will not have inherited) and hands it to
git through a credential helper — the token never lands on a command line, in a
config file, or in any output.

**Token permissions.** The fine-grained PAT needs, on this repository:

| permission | why |
|---|---|
| Contents — Read and write | ship, and the app's own ledger sync |
| Workflows — Read and write | **required to push any change under `.github/workflows/`** |

(The daily production check files its issues with the Actions `GITHUB_TOKEN`,
granted in the workflow itself — that does not come from this PAT.)

Without *Workflows*, git rejects the push outright with "refusing to allow a
Personal Access Token to create or update workflow ... without `workflow`
scope", and it rejects the **whole push**, not just that file. If you hit that,
this is why.

### CI — `.github/workflows/deploy.yml`

| job | when | what |
|---|---|---|
| `test` | **every push, every branch, every PR** | the full gate, `--strict` |
| `deploy` | `main` only, after `test` is green | production |
| `preview` | any other branch, after `test` is green | a Netlify draft URL |

Production cannot be reached from a branch, and nothing publishes without a
green suite. Commits touching only `ledger/**` skip the pipeline, so the app's
own data syncs do not trigger deploys.

**`ledger/` is no longer uploaded to Netlify at all.** The 404 rules remain as a
second layer, but her health data now never reaches the CDN in the first place,
so a bad redirect cannot expose it. `src/`, `tools/` and `scripts/` are excluded
too. If you add a new *site* asset, it deploys automatically — the zip is a
denylist, not an allowlist.

### The error beacon — `src/beacon.js`

Every test here runs in jsdom. Her phone runs iOS Safari. Without this, an
iOS-only crash is invisible: she just quietly stops opening the app.

Unhandled errors, unhandled rejections, and anything React's error boundaries
catch (including `TabGuard`) are buffered in `localStorage` and filed to
`ledger/errors.json` through the same GitHub API the app already uses. No new
service, no new secret, no endpoint to keep alive.

**Read `ledger/errors.json` at the start of any debugging session.** It is the
only place an iOS fault ever shows up.

Its one rule: *it must never be able to break the app*. Every entry point is
wrapped, every failure is swallowed, the upload is deferred past first paint,
faults are deduped and rate-limited, and the payload carries only version,
message, stack and user agent — never anything from the ledger itself.

### The daily production check

`.github/workflows/prod-check.yml` runs `scripts/prod-check.mjs` every morning
and asserts that the live site loads, serves the version this repo says it
should, has every asset, **still 404s every private path**, and can still reach
GitHub and Anthropic. On failure it opens a `production-check` issue (and
comments on the existing one rather than filing a new one daily); it closes the
issue once production is healthy again.

Run it by hand anytime with `npm run prodcheck`.

### Things that will bite you on Windows

This project is developed on a Windows machine. All three of these were real,
and all three are now handled — do not reintroduce them.

- **Never hardcode `/tmp`.** Node resolves it to `C:\tmp`, which does not exist.
  Use `tmp()` from `scripts/lib.mjs`, which writes to the repo's own `.tmp/`.
- **`.gitattributes` forces LF.** With `core.autocrlf`, a Windows checkout
  rewrites the committed `app.js` and the byte comparison in check 2 can never
  pass. Do not remove that file.
- **`NODE_ENV=production` is set globally on that machine**, which makes npm
  silently skip devDependencies — esbuild and jsdom never arrive and every test
  fails with a confusing import error. Every install passes `--include=dev`.

Nothing in `scripts/` or `tools/` may hardcode an absolute path or a port.
Paths derive from `ROOT` in `scripts/lib.mjs`; servers bind to port 0.

---

## Non-negotiables

- **Every input is 16px.** Smaller triggers iOS zoom-on-focus and the page pans
  sideways. Do not "clean this up".
- **Do not re-architect the layout frame.** Normal document flow, `minHeight:
  100vh` shell, tab bar `position: fixed; bottom: 0`, content padded to clear
  it. Eight attempts at something cleverer all failed and were reverted.
- **The safe-area inset belongs to the tab buttons' padding.** Never add a
  second one to the container.
- **The service worker must not cache `api.github.com`.** A cached sha caused a
  two-day unkillable 409.
- **Never send a `Cache-Control` request header to the GitHub API** from the
  browser — CORS preflight kills the fetch silently.
- **Nothing mutates itself.** Machine-initiated changes file a proposal for the
  athlete to tap. The engines rule, the agents narrate, the athlete overrides.
- **Instruments gate on n.** Cold-start data must say "counting only", never
  produce a verdict.
- **The token lives in `GH_TOKEN`, never in a file.** The repo is private, but
  it is also *deployed* — treat everything in it as one bad redirect away from
  public, which is exactly why `ledger/` is now excluded from the upload.
- **Never delete ledger data.** `ledger/state.json` holds her real history —
  45 weigh-ins as of this writing. Preserve every read.

## Editing this codebase

`src/app.jsx` is ~5,800 lines and is edited with string/line surgery.

- Anchors are unreliable at first occurrence — a stamp pattern once matched
  three elements and produced three rogue stamps. **Grep-count after every
  batch to confirm the change landed exactly once.**
- Check for symbol collisions before adding a component.
- JSX inserted between ternary branches breaks the parse — read the structure
  around the anchor, not just the line.
- `applyRead` is pure: it clones and returns. Tests must capture the return.
- Adding a law or an instrument requires amending the census assertions, or the
  suite fails by design.
- The beacon deliberately lives in `src/beacon.js` and wires in through
  `src/main.jsx`, so error reporting stays outside that 5,800-line blast radius.

### Progression and the debrief

`targetsFor` is autoregulated — see PROGRESSION_NOTE in `src/app.jsx` for the
evidence and the numbers that forced it. Three invariants:

- **The step is sized by the terminal RIR, capped at 3.** RIR is least accurate
  far from failure, so a claimed 5 buys the same step as a claimed 3.
- **A flagged day never sets the anchor.** Short sleep or a rushed session
  cannot become the line the next target is built from, and cannot serve as the
  historical benchmark either. An honest decline on a clean, unhurried day can.
- **`atTopOfWindow` allows a natural one-rep-per-set fade.** Demanding a flat
  maxed window was what produced the 10-week calves gate.

`sessionDebrief` has four rules in its header comment. The one that keeps
getting violated: **a line must be able to come out different for a different
lift**. If it can't, hoist it into the summary and say it once — that is what
`sharedWhy` does for the step reason. There is a test that fails on any sentence
repeated verbatim across lifts; do not weaken it.

### Adding a schema version

State on his phone is versioned, and every old version has to walk forward
without losing a byte. The ritual is three steps and nothing else:

1. Write `patchVn(s)` — mutate, set `s.v = n`, `return s`. It must be safe to
   run on a state that already has the field (`s.x = s.x || []`), because the
   v1/v2 path replays the whole chain over a fresh seed.
2. Append it to `PATCHES` and bump `SCHEMA_V` (declared once, next to `APP_V`).
3. Author the same shape into `SEED` inside `weave()`. **The seed is authored
   already-current — it does not go through the patch chain on a fresh
   install.** Two assertions hold `SEED.v === SCHEMA_V` and check that a fresh
   install's PREV blocks are shaped like migrated ones.

Two failures this design exists to prevent, both of which have actually
happened here:

- `migrate()` used to be a 31-deep nest of `patchV31(patchV30(...))`. A missing
  paren is invisible on review and only surfaces as an esbuild error. It is a
  `reduce` over `PATCHES` now — appending is a one-token edit.
- `SEED.v` carried the version number independently of `migrate()` and drifted
  a version behind, so fresh installs and migrated states disagreed. One
  constant, referenced from both, plus a test.

**Not every new field needs a version.** `pace` (v3.99.10) added a field to
`sessionLog` with no patch and no bump, on purpose: there was nothing in the old
records to derive it from, so a patch could only have written `null` onto four
historical sessions. Law 12 calls that a decorative field. Absent reads as
unknown at every call site (`paceRushed`), which is the correct answer for a day
the app never asked about. Bump the version when old data can be *restated* into
the new shape; skip it when the only honest value is "we don't know".

A patch may only restate what was already recorded. `patchV31` lifts the legacy
`rir` into `rirSets[0]` because `rir` has always meant the opener — that is a
restatement. It leaves every other slot `null`, because the app never asked. A
migration that invents a plausible value is worse than no migration: the ramp
cannot tell a real reading from a manufactured one.

## Workflow

Recon before editing. One batch. Grep-verify each change. Parse-check. Run the
suite. Ship. Confirm the beacon shows the new version.

When something is broken, find the mechanism before shipping a fix. Ship an
instrument, not a theory.
