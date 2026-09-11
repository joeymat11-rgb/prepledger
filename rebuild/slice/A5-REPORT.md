# A5 — PWA shell and the phone-reachable host for the slice

Branch `rebuild/slice-a5`, from `rebuild/t2-client-core` @
`6f22545` (A1 Today rebind merged, ledger line 99). Builder: Opus builder
(Earned A5). **Candidate, not accepted.** An independent Opus reviewer plus CI
is the acceptance (screens/plumbing tier, DECISIONS:88). Nothing here is
self-accepted, nothing is merged, main is untouched, and **nothing is
deployed** — the one act only the owner can perform is in §9.

Node v24.19.0, on Joe's PC. Nothing installed, nothing purchased, no account
created, no secret entered or printed. No `rebuild/conform/private/`, no
`src/history.js`, no `ledger/` was read. No athlete data printed, nothing
deleted. The frozen app, `rebuild/engine/**`, `rebuild/conform/**`,
`rebuild/m4/spec/**`, `.github/workflows/rebuild.yml`, `.github/workflows/deploy.yml`,
`.github/workflows/soak.yml` and the pinned `rebuild/m3/w7-preview/test/*` are
byte-untouched.

`git status --porcelain` at the head of this branch is the whole claim:

```
?? .github/workflows/slice-host.yml
?? rebuild/slice/pwa/
```

**A5 adds files and modifies none.** A1's `today/build.mjs` is *consumed*, not
changed — there was no hook to add, and A1's 58 tests are green at this head.

---

## 0. Review round 1 — what changed

The independent review of `839d212` returned **ACCEPT WITH FIXES (1 blocking)**.
All five items are applied; the blocking one is a report and log-text fix, so the
evidence below is re-executed at the new head rather than merely re-quoted.

* **F1 (blocking) — §9 sent Joe to a button that will never exist.** FIXED. GitHub
  lists a `workflow_dispatch` workflow only once its file is on the **default
  branch**, and `slice-host.yml` is deliberately never on `main` — so
  "Actions → slice-host → Run workflow" would have been an instruction to look for
  something that is not offered. §9 now names the real route (**a push to
  `rebuild/t2-client-core` touching the path filters**, with the PM's own merge of
  this branch as the cheapest first deploy, and "Re-run all jobs" as the third
  option), states the button's precondition, and the workflow's header comment and
  its **fifth no-op log line** now say the same thing in the log itself. Two tests
  hold it.
* **F2 — the new tests had no CI home at all.** FIXED. `slice-host.yml` now runs
  `workflow.test.cjs` alongside `pwa.test.cjs` in its bundler-free step (one line;
  `yaml` is a root devDependency already installed in that job), and
  `package.test.cjs` runs there after the build — so all 53 run in CI today. A new
  test enumerates `rebuild/slice/pwa/test/*.test.cjs` off disk and asserts every
  file is run by some step, so a suite added later cannot quietly have none. §8
  keeps the `rebuild.yml` deferral and now names **both** ways that home is
  narrower (one branch; ubuntu only).
* **F5 — the on-page iPhone sentence claimed a result nothing had confirmed.**
  FIXED. It was "…tap Share, then Add to Home Screen. Earned then launches from
  the Home Screen, with or without a signal." It is now guidance only: **"On
  iPhone: in Safari, tap Share, then Add to Home Screen."** The ready line was
  also promising behaviour ("Earned opens with no network") and now states the
  verified fact instead ("…everything the launch needs is here"). A test pins the
  guidance verbatim and rejects six result words.
* **F4 (non-blocking) — the deploy target was guarded only by `repo_url`.**
  TAKEN, not documented away: a **third refusal** now reads the account's site
  list and refuses by **site id** if the given id is one the list identifies as
  the frozen app's (`deploy.yml`'s own rule) or the soak's. It is independent of
  what the target's own record says, read-only, and **fails closed** — an
  unreadable list stops the deploy. §6 and decision 10.
* **F6 (non-blocking) — the two edges were not named.** TAKEN: §3 now names both
  (the deploy/takeover window, and a browser-trimmed cache) and says exactly what
  the athlete sees in each.

Nothing else changed. `preflight.html` and `preflight.js` changing moved the
hashed asset name, `index.html`, `_headers`, `sw.js` and therefore the cache name
— which is the derivation in §2 working, and every hash below is re-measured.

---

## 1. What this is

A5 turns the page A1 built into something Joe can put on his Home Screen and
open with no signal, and gives that page somewhere his phone can reach.

Five parts, all additions:

| part | where |
|---|---|
| the shell's whole behaviour, as pure functions over bytes | `rebuild/slice/pwa/pwa.cjs`, `shell.cjs`, `icons.cjs` |
| the launch service worker's source | `rebuild/slice/pwa/sw-source.js` |
| the install / offline-launch preflight | `rebuild/slice/pwa/preflight.{html,css,js}` |
| the build step and a local host with the real headers | `rebuild/slice/pwa/build-pwa.mjs`, `serve-pwa.mjs` |
| the deploy workflow (no-op until Joe creates the site) | `.github/workflows/slice-host.yml` |

Checks: `rebuild/slice/pwa/test/{pwa,package,workflow}.test.cjs` (53 — 35 + 10 + 8)
and `rebuild/slice/pwa/browser-offline-check.mjs` (a real Chromium, really
offline). All three run in `slice-host.yml`.

### Where it lives, and why not beside A1

`rebuild/slice/pwa/`, not `rebuild/m3/w7-preview/today/pwa/`. The build does not
need to co-locate: `build-pwa.mjs` imports A1's `buildToday()` and reads the three
files it emitted into `.tmp/w7-today-dist`, then writes a **separate** folder,
`.tmp/slice-pwa-dist`. Keeping A5 out of A1's directory means A1's package
allowlist test ("the built package is exactly the three reviewed assets") and its
`readdir` assertions stay literally true, and a reviewer can diff the two
concerns apart. `test/package.test.cjs` asserts both: A1's folder still holds
exactly three files, and A1's source directory contains no A5 file.

---

## 2. The cache name: the APP_V bug class, removed rather than avoided

The frozen app's rule was a version string a human had to remember to bump. The
failure mode is not "someone was careless"; it is that a **constant** and the
**bytes** are two separate things that can disagree.

Here there is no constant. `pwa.cacheName(manifest)` is

```
"earned-slice-" + sha256( sorted("<path> <sha256-of-that-file>") ).slice(0,32)
```

over the precache manifest itself, and the precache manifest is built from the
files that are about to be written. Nothing can be bumped, forgotten or drift.

Three tests hold it:

* `pwa.test.cjs` — one byte of one asset changes ⇒ a different name; a renamed
  asset changes it; the same bytes in any order give the same name; an empty
  list, a bad sha, a duplicate path or a traversal path are refused.
* `package.test.cjs` "the cache name in the shipped worker is derived from the
  shipped bytes" — re-reads every file **off disk**, recomputes the name, and
  asserts it equals the literal inside the emitted `sw.js`. Any shipped byte
  changing without `sw.js` changing fails this.
* `package.test.cjs` "REBUILDING a changed asset changes the cache name, the
  file name and the page" — copies A1's three assets, appends one byte to the
  bundle, runs the same compose step, and asserts the cache name, the bundle's
  URL and the page all moved, while the files that did *not* change kept their
  URLs.

Observed at this head: `earned-slice-1ec71a41d7f415afe16753e5961d08f0`.
(Review round 1 is itself a demonstration: changing two lines of `preflight.js`
and `preflight.html` moved the hashed script name, `index.html`, `_headers`,
`sw.js` and the cache name — from `earned-slice-8ac4f894df47ddaf64ff51a34140da5c`
at `839d212` to the value above — with nobody editing a version anywhere.)

---

## 3. The service worker, and the policy it runs

`sw-source.js` is the reviewable source; `build-pwa.mjs` fills two placeholders
(`"__EARNED_CACHE_NAME__"`, `__EARNED_PRECACHE__`) with a replacement that must
match exactly once, so a future edit that drops or duplicates one fails the
build rather than shipping a worker whose cache is the literal string
`__EARNED_CACHE_NAME__`.

It registers four listeners and no others — `install`, `activate`, `fetch`,
`message`. No `sync`, no `periodicsync`, no `push`, no background fetch, no
offline write queue, no cache of anything it did not precache. The athlete's
durable record stays `rebuild/client`'s own local storage; the worker never
reads or writes it.

**The policy, and why each half is the safe one.**

* **Navigations are network-first** (4 s timeout, then the stored shell). An
  athlete with a signal always gets the *deployed* `index.html`; the cached copy
  answers only when the network does not. A 200 is served; a 500 is not mistaken
  for a fresh page and falls back.
* **Every other precached asset is cache-first** — and that is only safe because
  **their URLs carry their own content hash**. `build-pwa.mjs` renames A1's
  `styles.css` → `styles.<16 hex>.css` and `app.js` → `app.<16 hex>.js` (and the
  two preflight files likewise) and rewrites the two references inside
  `index.html`. A hashed URL's bytes never change, so "cached" and "fresh" are
  the same bytes by construction, and an old build and a new one can sit in one
  browser without ever mixing. **This is the decision that makes "never serve a
  stale asset" true rather than nearly true**: with unhashed names, a fresh
  `index.html` served network-first could have pulled the *old* `app.js` out of
  the *old* worker's cache during the update window. With hashed names the fresh
  page asks for a URL the old cache does not hold, falls through to the network,
  and is correct.
* A precached URL that is somehow missing from this device's cache goes to the
  network and is **not** written back: this cache holds one build, whole.
* **Nothing cross-origin is ever answered or stored.** A request whose origin is
  not the scope's is not intercepted at all — no `respondWith`, in either
  direction, navigation or subresource.
* **Nothing but GET is intercepted.** POST/PUT/DELETE/HEAD fall straight through.
* A same-origin URL that this build does not precache (including `sw.js` itself)
  is left to the browser.
* `skipWaiting` + `clients.claim` on install/activate, and `activate` deletes
  every other `earned-slice-` cache — and leaves caches belonging to anything
  else alone.

### The two edges this policy has (review F6)

Neither is hidden and neither is a bug, but a reviewer should know both.

**Edge 1 — the window between a deploy and the new worker taking over.** A new
build is published while a device still has the old worker installed. The device
navigates: network-first gives it the **new** `index.html`. Its subresource URLs
are the new hashes, which the old cache does not hold, so cache-first misses and
falls through to the network — correct, because the device is online (a
navigation only reached the network at all if it was). On that same navigation
the browser re-reads `sw.js` (served `no-store`), sees new bytes, installs,
`skipWaiting`s and claims, so from the next load the device is wholly on the new
build. **If the device loses the network inside that window**, the navigation
falls back to the *cached* `index.html`, which references the *old* hashed URLs,
which are still in the old cache: Earned opens, one build behind, internally
consistent, and the preflight still reads offline-ready — for that build. It is
never a new page wired to old code, which is exactly what unhashed names would
have allowed.

**Edge 2 — a cache the browser trims.** `cache.addAll` is all-or-nothing, so a
*failed* install leaves no partial cache and the worker does not activate; the
preflight reads "not yet" with a count. But iOS and Chromium both evict site
storage under pressure, and eviction can take part of a cache. If it does, the
preflight stops saying offline-ready and reports `present of total` with the
missing names, and a missing precached URL goes to the network and is **not**
written back (this cache holds one build, whole; a half-repaired cache is worse
than a reported one). Online that is invisible; offline, that one asset fails and
the indicator has already said so. The repair is a single online load: the next
navigation re-reads `sw.js`, and a reinstall refills the cache whole.

All of that is executed, not asserted: `pwa.test.cjs` evaluates the **real
emitted `sw.js`** in a `node:vm` sandbox with a fake `ServiceWorkerGlobalScope`
(a Map-backed CacheStorage and a `fetch` spy) and drives the handlers with fake
events — 14 tests, including a deeper scope that must confine the worker to its
own folder, and a cache-busting query that must not defeat the pinned asset nor
create a second cache entry.

---

## 4. The preflight, on Today's own face

`preflight.html` is an `<aside class="review">` — the page's own **approved
secondary style** (13 px, `var(--muted)`; `.review` is A1's existing aside
class and is a selector in the pinned approved stylesheets). It is injected into
the built `index.html` immediately before `</main>`, so A1's page source and its
design-binding tests are untouched.

It shows three things:

* **`Offline launch — offline-ready ✓` / `— not yet`.** The word "offline-ready"
  is written in exactly one place in `preflight.js`, inside the one branch that
  has a status object **and** its `ready` flag. The status comes from the worker,
  which answers by looking every precached URL up in its own cache and counting:
  `{ ready, total, present, missing, cache }`. Evict one file and the answer
  changes — that test is in `pwa.test.cjs`. There is no optimistic path: no
  service-worker support, no secure context, no controller yet, no answer within
  3 s, or a partial install all read **"not yet"**, each with its own reason.
* **The detail line** — "All 11 files of this build are stored on this device —
  everything the launch needs is here.", or "Storing this build on this device: 7
  of 11 files." Every figure comes from this device; the fragment itself carries
  no digit at all (tested). Per review F5 the ready line states the fact the
  worker verified (the cache is complete) rather than promising a launch.
* **The iOS guidance** — **"On iPhone: in Safari, tap Share, then Add to Home
  Screen."** and nothing more. This is the one sentence the approved design cannot
  supply, because it has no such screen; the test asserts the approved references
  do **not** contain "Add to Home Screen", so if a future approved design gains
  that screen the test fails and a builder must bind to it instead. Per review F5
  it is **guidance about where the control is, not a claim about what follows**:
  no iPhone has confirmed this build's installed behaviour (§8), so the page does
  not describe it, and a test pins the sentence verbatim and rejects six result
  words. It is hidden under `@media (display-mode: standalone)` — once Earned is
  launching from the Home Screen there is nothing left to add it to.

A5's own stylesheet sets no colour of its own (the single colour it names is
`var(--green)`) and no measurement the approved stylesheets do not already
declare — both checked.

---

## 5. The deployable folder and its `_headers`

`node rebuild/slice/pwa/build-pwa.mjs` → `.tmp/slice-pwa-dist`, 13 files:

```
326a30018f7cb6b2fd488af28c6c0cc932d16ca9e09151b696f91c28d065c493  styles.326a30018f7cb6b2.css
7b849f5e0331a8669a8ae986c9c91edd1a8e31d38abb2b6e93c6219acf6ef26c  app.7b849f5e0331a866.js
1fcd43b13cd64f99c90ccfefb10dc6b63086be9daf9e7c7353edb64664a06da5  preflight.1fcd43b13cd64f99.css
a92a3b018f3a17bc7f4f7b9795f3a738869e51f01f49b370a7a2eabffcba5a0f  preflight.a92a3b018f3a17bc.js
85f46817be379b9734022fc01b7f92e0e16673195d1d30a13b83c44ce3bfbc79  index.html
df424e94dfced04afd11b0458bedc162702cece6ff9d4ddebaa869b3cd8cc88d  manifest.webmanifest
764b7a054d19b906823b7439fd591aa55f6f1bae48f5e87659199c775293e3bb  icon-180.png
4400317bc52fa0ddf02f5fabe838455860e45e509cbf1938bc48704c501984d5  icon-192.png
167404684ef82eed26d5c537805fc8bc98d2cf73d2bf56cd60a8b71477e75ec9  icon-512.png
6bd81a5b3bb88fca44af22b46fdc62db6159450c231b28685b84c79f088b9673  icon-512-maskable.png
153baf654025a6153f9a0f4fab424ff68399a4bc1bea38acb89d0fc9e2e6158b  icon.svg
18df666a11fa2d3809eb33767aefa337c5d9b9ae43eb50a7b3584bf7c09f6011  sw.js
dcbafb1a8052679607eac96a4bd95e42d1ca3670cf7264072fc3a72165808bf2  _headers
```

11 of those are precached. `sw.js` is not (it is served `no-store`, so the
browser re-reads it on every update check — the one file whose staleness would
pin every other file). `_headers` is not (Netlify reads it as configuration and
never serves it; `serve-pwa.mjs` 404s it too, and that is tested).

### The manifest

`name` "Earned", `display` `standalone`, `id`/`scope` `./`, `start_url`
`./index.html` (tested to be inside scope), `orientation` portrait, icons
192/512/512-maskable, and

* `theme_color` **#E7E1D4** — the approved design's `--ground`, what the phone's
  chrome sits against;
* `background_color` **#F4F0E8** — the approved design's `--paper`, so the launch
  splash is the page's own surface.

`pwa.assertApprovedColours()` **reads those three values back out of
`rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html` at build time**
and refuses if the design has moved; a test flips `--ground` in a copy and
watches it refuse.

### The icons

Authored here, in `icons.cjs`; nothing is copied from anywhere. The mark is the
approved green field (`--green #2E5A3C`) with a paper check (`--paper #F4F0E8`) —
the check is what Today itself says when the morning is logged ("This morning ✓").
The geometry is declared once in normalised coordinates and used by **both** the
SVG and the raster, so they cannot drift. The PNGs are encoded here too
(`node:zlib` plus a CRC32 and three chunks — IHDR/IDAT/IEND), 3×3 supersampled,
opaque, and byte-deterministic for a given size (which matters: a churning icon
would churn the cache name). The maskable variant draws inside the 80 % safe
zone, and a test sweeps every pixel to prove no green leaves it.

### `_headers` — the lockdown, mirrored

Netlify applies **every** matching rule, so two rules that both set
`Content-Security-Policy` are sent as two policies and intersected — which is how
a "more specific override" silently becomes something stricter than either.
Every rule therefore names an **exact path** and no two rules match the same
request; `assertHeaderRules` proves it and a test plants an overlap and a
wildcard to watch it fail.

* documents (`/`, `/index.html`) — `Cache-Control: no-cache` and
  `default-src 'none'; script-src 'self'; style-src 'self'; font-src data:;
  img-src 'self' data:; connect-src 'none'; manifest-src 'self'; worker-src 'self';
  object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`
* `/sw.js` — `Cache-Control: no-store`, `Service-Worker-Allowed: /`, and
  `default-src 'none'; script-src 'self'; connect-src 'self'`
* hashed assets — `public, max-age=31536000, immutable`
* `manifest.webmanifest` — `no-cache`; icons — one week
* every rule: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `Cross-Origin-Resource-Policy: same-origin`

This is A1's own policy (`today/serve.mjs`) with exactly three necessary
differences, none of which opens an origin: `manifest-src 'self'` (with
`default-src 'none'` the browser refuses to read the manifest at all, so "Add to
Home Screen" offers nothing), `worker-src 'self'` (A1's page forbids workers
outright — the launch worker is the whole point of this folder), and
`connect-src 'self'` **on the worker script only**, because the worker's
`fetch()` is what precaches and what answers a navigation. **The page keeps
`connect-src 'none'`**, and the Chromium check proves it by asking the page to
fetch its own manifest and recording the browser's refusal.

No policy in the file names any remote origin — the same proof A1 relies on that
an offline launch has nothing left to fetch.

### The private guard

`pwa.assertNothingPrivate(files, sources)` runs on the staged bytes **before a
single file is written**, and refuses on three grounds:

1. a file whose **source path** is under `rebuild/conform/private`,
   `rebuild/conform/engines`, `ledger/`, or is `src/history.js`;
2. an output **name** under any of those;
3. a shipped **byte** that names `rebuild/conform/private/`, `ledger/state.json`
   or `src/history.js`, or that matches one of ten published credential shapes
   (GitHub PAT / fine-grained / OAuth-app-refresh, Netlify PAT, Slack, AWS key
   id, Google API key, PEM private key, JWT, and a secret assigned to a
   secret-named key in source).

`data:` payloads are collapsed first, exactly as A1's network-reference check
does, so the inlined base64 typeface is bytes rather than a haystack. Generic
"long random string" rules are deliberately absent — this folder legitimately
ships a typeface and a SHA-256 implementation full of hex constants, and a guard
that cries wolf gets muted. Every one of the ten shapes is **planted and watched
to fire** (and the test asserts the planted set equals the claimed set, so a
shape cannot be claimed without being probed); a clean folder passes; the
generated `_headers` is scanned like everything else.

`assertNoNetworkReference` re-executes A1's claim over the whole folder. The one
permitted string is the SVG namespace `http://www.w3.org/2000/svg`, allowed by
exact value in `icon.svg` only — a test adds a second URL to that same file and
watches it fail, and puts the namespace in `index.html` and watches that fail too.

---

## 6. The workflow

`.github/workflows/slice-host.yml` — new file, modelled on `soak.yml`.

* `on: workflow_dispatch` and `push` to **`rebuild/t2-client-core`** only, paths
  `rebuild/m3/w7-preview/today/**`, `rebuild/slice/pwa/**`, and its own file. No
  `pull_request` (a fork's PR must never reach a deploy secret), and a run-time
  refusal if `GITHUB_REF` is `refs/heads/main`.
* `permissions: contents: read`.
* Installs the root lockfile, then the **pinned** W6 browser-build dependencies
  with `pnpm@9 --frozen-lockfile` (that lockfile is `pnpm-lock.yaml`; pnpm 9
  rather than 10 because pnpm 10 would skip esbuild's own install script).
* Runs the A5 checks, **builds the folder**, runs the folder's checks — all
  before the deploy step, so a run with no secrets still proves the folder is
  buildable — then stages exactly what the build emitted and prints a
  `sha256sum` of every staged file into the job summary.
* Deploys by **site id**, never by name, and never creates a site — the only
  write to the Netlify API in the whole file is the deploy itself (tested).
  **Three refusals, by two independent routes (review F4):** the target's own
  record must not be linked to the `prepledger` repository (that is the frozen
  app's production site — `deploy.yml` identifies it exactly that way) and must
  not be named `earned-soak`; and, independently of what the target says about
  itself, the account's site list is read and the deploy is refused if the given
  id **is** one of the ids that list identifies as the frozen app's or the soak's.
  That third check exists because the first two read one record: if Netlify ever
  answers without `build_settings`, they see nothing. It is read-only and it
  **fails closed** — if the list cannot be read, nothing is deployed.
* Then probes the URLs a phone asks for and prints `sw.js`'s and `/`'s actual
  `Cache-Control` / `Content-Security-Policy`.

**Secrets — names chosen here, documented for Joe in §9:**

| secret | new? | what it is |
|---|---|---|
| `NETLIFY_AUTH_TOKEN` | no — already in the repo, the same one `soak.yml` uses | the Netlify API token |
| `SLICE_NETLIFY_SITE_ID` | **yes** | the Site ID of the new, empty Netlify site for the slice |

**With either secret absent the deploy step exits 0 after printing five lines
beginning `SLICE HOST NO-OP`**, naming which secret is missing, saying that only
the owner can create the site, pointing at this report, and — since review F1 —
saying in the log itself that the deploy route is the **next push** to
`rebuild/t2-client-core` and that there is no Run-workflow button for a file that
is not on the default branch. Nothing is called, nothing is deployed.

`test/workflow.test.cjs` (8) reads the YAML as data and asserts all of the above,
including that the file names **exactly** those two secrets and no others, that
every `$NT`/`$SITE` use in the script is one of five reviewed forms (an
`Authorization: Bearer` header, an emptiness test, an `api/v1/sites/$SITE` path,
or the id comparison in the third refusal — so nothing echoes a secret), that the
no-op path contains no `curl`, that exactly one `curl -X POST` exists in the file,
and that `deploy.yml` and `soak.yml` are unedited and know nothing about the slice.

**This job is the CI home for both lockfile-only A5 suites (review F2).** Step
"The A5 shell's own checks, and this workflow's own (no bundler)" runs
`node --test rebuild/slice/pwa/test/pwa.test.cjs rebuild/slice/pwa/test/workflow.test.cjs`
— 43 checks, on the root lockfile alone (`workflow.test.cjs` needs only `yaml`,
already a root devDependency that `npm ci --include=dev` installs), before the
build. `package.test.cjs` runs in the same job after the build, where the W6
dependencies exist. A test in `workflow.test.cjs` enumerates
`rebuild/slice/pwa/test/*.test.cjs` off disk and asserts **every one of them** is
run by some step of this workflow, so a suite added later cannot quietly have no
CI home.

---

## 7. What was executed, at this head

| command | result |
|---|---|
| `node --test rebuild/m3/w7-preview/today/test/{design,adapter,view,package}.test.cjs` | **58 pass / 0 fail** (A1, unchanged) |
| `node --test rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19 pass / 0 fail** |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs …/engine-equivalence.test.cjs` | **22 pass / 0 fail** |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`**, exit 0 — no pinned file changed |
| `node rebuild/m3/w6/test/run-current-head.cjs <this tree> --all` | **435 pass / 0 fail** |
| `node --test rebuild/slice/pwa/test/{pwa,package,workflow}.test.cjs` | **53 pass / 0 fail** (new; 52 at `839d212` plus the F2 CI-home test) |
| `node rebuild/slice/pwa/build-pwa.mjs` | `A5 PWA BUILD PASS` (below) |
| `node rebuild/slice/pwa/browser-offline-check.mjs` (with `W7_BROWSER_BIN`) | `A5 OFFLINE LAUNCH CHECK PASS` (below) |
| `node rebuild/m3/w7-preview/today/browser-check.mjs` (with `W7_BROWSER_BIN`) | `A1 TODAY BROWSER CHECK PASS`, unchanged |

```
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256;
cache name earned-slice-1ec71a41d7f415afe16753e5961d08f0 derived from those bytes (no
version constant); 13 exact header rules, no-store on sw.js; 10 credential shapes and 4
private roots refused across 13 files; theme #E7E1D4 / background #F4F0E8 read back from
the approved design; no network reference in any shipped byte
```

```
A5 OFFLINE LAUNCH CHECK PASS — installed one worker over the host's own headers; cache
earned-slice-1ec71a41d7f415afe16753e5961d08f0 holds all 11 files; preflight read
"offline-ready ✓" only after verifying them; with the network OFF Today rendered from the
engine, a weigh-in (This morning ✓ 178.2 lb · spike — damped in trend) was recorded and
survived a reload and a new page; the same folder with the worker blocked could not open
offline at all; no page error and no offsite request.
```

The offline check does this, in one real Chromium, over `serve-pwa.mjs`, which
**parses the emitted `_headers`** rather than restating it, so the browser gets
the headers Netlify will send:

1. loads the page, asserts the page's own `fetch` of its manifest is **refused**
   by `connect-src 'none'` (and reads the manifest over the wire instead);
2. waits for the preflight to reach `offline-ready ✓` and asserts one worker is
   registered and `caches.keys()` is exactly the built cache name;
3. `context.setOffline(true)` — and **everything below happens offline**;
4. reloads: Today renders its engine instruction and calorie figure;
5. logs a weigh-in **while offline** (178.2 lb) through the real sheet, and it
   reaches the screen with the engine's own note, and the instruction changes;
6. reloads again, still offline — the reading and the trend survive; a brand-new
   page in the same origin sees the same reading (the app-kill path);
7. **the control**: the same folder in a context with `serviceWorkers: "block"`,
   offline, **cannot load at all** — so the pass above is a property of this
   worker and not of the browser's HTTP cache;
8. asks the worker directly and asserts `{ready:true, total:11, missing:[]}` and
   the cache name.

---

## 8. Not qualified, and what is NOT in CI

* **The 53 new tests ARE run by `slice-host.yml`, and are NOT in `rebuild.yml`**
  (review F2). `.github/workflows/rebuild.yml` is pinned by the accepted
  NATIVE-CARRIERS artifact — a one-line change turns
  `native-carriers-package.cjs --ci` RED — so, exactly as A1 recorded at
  DECISIONS:99, this branch adds no step there. What changed at review round 1 is
  that all 53 now have a CI home anyway: `slice-host.yml` runs all three suites on
  every push to `rebuild/t2-client-core` under its path filters (§6). **That is
  narrower than `rebuild.yml` in two ways the PM should weigh, not one:** it runs
  on **one branch** (so a slice branch like this one gets no CI for them until it
  is merged) and on **ubuntu only** (so the "both OS" half of the screens tier is
  still unmet for them). The batched re-seal at **B1** should therefore still add,
  alongside A1's 58, the lockfile-only step
  `node --test rebuild/slice/pwa/test/pwa.test.cjs rebuild/slice/pwa/test/workflow.test.cjs`
  to `rebuild.yml`'s existing `[ubuntu-latest, windows-latest]` matrix.
  `test/package.test.cjs` needs the W6 pnpm dependencies and belongs where
  `slice-host.yml` already runs it.
* **Nothing is deployed.** The workflow has never run; it will no-op until §9.
  No URL is claimed in this report because none exists yet.
* **No real iPhone was touched.** "Add to Home Screen", the standalone splash,
  the iOS status-bar colour and iOS's own service-worker behaviour are asserted
  by the manifest and by Chromium, not by Safari. §10 is the hand test. Since
  review F5 the page reflects that: the on-page iPhone line is **guidance about
  where the control is** ("On iPhone: in Safari, tap Share, then Add to Home
  Screen.") and says nothing about what happens after the tap, and the ready line
  states the fact it verified ("All 11 files of this build are stored on this
  device — everything the launch needs is here.") rather than promising a launch.
  A test asserts the guidance sentence verbatim and that it contains no result
  word (`launch`, `will`, `signal`, `offline`, `work`, `then opens`).
* The page's layout is A1's: a fixed 390×844 `.phone` frame inside a `.stage`,
  with the two review asides and now the preflight around it. On a real phone in
  standalone that reads as the design inside its frame rather than edge-to-edge.
  That is A1's decision and A5 did not change it; if the PM wants a true
  full-bleed standalone layout that is a screens-tier change to A1's chrome, not
  a shell change.
* A `beforeinstallprompt` button for Android/Chrome is deliberately absent —
  "no service-worker cleverness beyond launch", and Joe's phone is an iPhone.
* The worker uses `skipWaiting` + `clients.claim`, so a new build takes over as
  soon as it has installed. The hashed asset URLs are what make that safe (§3).

---

## 9. The ONE thing only Joe can do — five clicks, no CLI

The workflow is finished and will deploy the moment the site exists. Creating a
Netlify site and adding a repository secret cannot be done by an agent, and
should not be: it is an account action.

1. **Netlify → Add new site → Deploy manually.** On
   <https://app.netlify.com/> press **Add new site**, choose **Deploy manually**,
   and drop **any** empty folder (or a folder with one empty `index.html`) onto
   the drop zone. This creates an empty site with a random name — that is all it
   needs to be. *(Do not connect it to a Git repository; this workflow deploys to
   it directly, like `soak.yml` does.)*
2. **Rename it if you like** — Site configuration → Site details → Change site
   name → e.g. `earned-slice`. Optional; the workflow finds it by id, not name.
   It must **not** be named `earned-soak`, and must not be the existing
   prepledger site — the workflow refuses both.
3. **Copy the Site ID.** Site configuration → Site details → **Site information
   → Site ID**. It looks like `1234abcd-56ef-78ab-90cd-1234567890ab`. Copy it.
4. **GitHub → the repository → Settings → Secrets and variables → Actions →
   New repository secret.** Name: `SLICE_NETLIFY_SITE_ID`. Value: the Site ID you
   just copied. Press **Add secret**.
5. **Check `NETLIFY_AUTH_TOKEN` is already there** in that same list (it is —
   `deploy.yml` and `soak.yml` use it). If it is not, Netlify → User settings →
   Applications → Personal access tokens → New access token, and add it under
   that exact name.

### How the deploy is then RUN — by a push, not by a button (review F1)

**There is no "Run workflow" button for `slice-host`, and there will not be one.**
GitHub only lists a `workflow_dispatch` workflow once its file is on the
**default branch** (`main`), and `slice-host.yml` is deliberately never on main —
it lives on the rebuild branches only. `workflow_dispatch` is still declared, so
the button appears automatically if this file ever *does* reach main; until then,
looking for it under Actions → slice-host would be looking for something that is
not offered.

**The deploy route is the push.** Once both secrets exist, the next push to
**`rebuild/t2-client-core`** that touches `rebuild/slice/pwa/**`,
`rebuild/m3/w7-preview/today/**` or `.github/workflows/slice-host.yml` runs the
job, and the job deploys. Three ways to cause that, in order of least effort:

* **the PM's next merge of a slice branch into `rebuild/t2-client-core`** — A5's
  own merge is one, so the first deploy can simply be that merge;
* a trivial commit to that branch touching a file **under `rebuild/slice/pwa/`**
  — note that `rebuild/slice/A5-REPORT.md` is *not* in the path filter, so
  editing this report alone would not trigger it;
* **Actions → slice-host → the latest run → Re-run all jobs**, which works for a
  run that already exists and will pick up the secrets added since.

The run prints `PUBLISHED <url>`, puts the URL in the job summary, and then
probes the URLs the phone asks for. The workflow's own no-op log says all of
this too, so the log a secret-less run leaves behind is not misleading.

Nothing else is needed, no CLI is involved, and no token is ever typed into a
chat or a file.

---

## 10. What the PM runs to verify, once the site exists

**On a machine (30 seconds).**

```
curl -sI https://<site>/          | grep -iE 'content-security-policy|cache-control'
curl -sI https://<site>/sw.js     | grep -iE 'cache-control|content-type'
curl -s  https://<site>/manifest.webmanifest
```

Expect: the page policy with `connect-src 'none'`, `worker-src 'self'`,
`manifest-src 'self'` and no remote origin anywhere; `no-store` and
`text/javascript` on `sw.js`; and a manifest whose `display` is `standalone`.
The workflow run prints the same three things itself.

**On Joe's iPhone (the real test).**

1. Open `https://<site>/` in **Safari**.
2. Wait for the preflight line under the phone to read **`Offline launch —
   offline-ready ✓`** with "All 11 files of this build are stored on this device
   — everything the launch needs is here." If it says *not yet*, it says why;
   reload once with a signal.
3. **Share → Add to Home Screen.** The icon is a green square with a paper
   check; the name is *Earned*.
4. Open Earned **from the Home Screen**. It launches with no Safari chrome, on
   the paper background, and the "Add to Home Screen" guidance is gone.
5. **Put the phone in Airplane Mode.**
6. Kill Earned (swipe up) and open it again from the Home Screen. **It must open
   and show Today** — the plan line, "Eat about … kcal / … g protein", the
   workout card, the trend line, one primary action.
7. Log a morning weight. The figures on Today move because the engine moved.
8. Kill it and open it again, still in Airplane Mode. **The weigh-in is still
   there.**
9. Turn Airplane Mode off, open it once more: still Today, now from the network.

If step 6 shows "Earned has not finished storing itself on this device yet", the
worker had not completed its first install — step 2 was skipped or the signal
dropped during it. That is the honest message, not a crash.

**Synthetic data only.** This site serves public source with a synthetic athlete.
Joe's real history never goes near it: it enters only through the on-PC port and
this device's own local save (Track C), and the build refuses to emit a folder
that contains a private path or anything shaped like a credential.

---

## 11. Decisions taken where the plan was ambiguous

Recorded rather than asked, per the brief.

1. **`rebuild/slice/pwa/`, not under `today/`** — §1. The build consumes A1's
   output through an import; co-location was not required, and separation keeps
   A1's package allowlist literally true.
2. **A1's assets are re-named with a content hash in the deploy folder**
   (`styles.<h>.css`, `app.<h>.js`) and the two references in `index.html` are
   rewritten. This is a post-processing of A1's *output*; A1's own build,
   folder, names and 58 tests are untouched. It is what makes "cache-first for
   hashed assets" literally true and removes the stale-subresource window a
   network-first navigation would otherwise open (§3). The two rewrites each
   assert they matched exactly once, so an upstream change to A1's shell fails
   this build loudly.
3. **The preflight is injected into the built page, not added to A1's
   template.** A1's `design.cjs` binds every class and every static sentence in
   `screens.template.html` to the approved references; the iOS guidance is a
   sentence the approved design does not contain, so putting it in that template
   would have meant either weakening A1's binding or inventing approved copy.
   Injecting an A5-owned `.review` aside into the output keeps A1's binding
   exactly as strict as it was, and A5 binds its own fragment to the approved
   classes in its own test.
4. **`theme_color` = `--ground`, `background_color` = `--paper`**, both read back
   from the approved reference at build time (§5). The design of record names no
   theme colour for a browser chrome, so these are the two it does name, used for
   what each actually is.
5. **The icon is an authored check mark**, not a wordmark: the approved brand
   mark is "Earned" set in Instrument Serif, and rasterising a licensed typeface
   into an icon is a licensing question nobody asked for. The check is the
   design's own vocabulary ("This morning ✓") and is drawn from its own two
   colours.
6. **`sw.js` is excluded from the precache** and served `no-store`; `_headers` is
   excluded and never served.
7. **`_headers` uses exact paths, never a wildcard** — §5, because Netlify stacks
   matching rules and two CSP headers intersect.
8. **pnpm 9, not 10**, for the W6 dependencies in CI (§6).
9. **The workflow builds before it checks for secrets**, so a secret-less run
   still proves the folder is buildable and prints its hashes. The no-op is a
   deploy no-op, not a job no-op.
10. **Safety rails on the deploy target, by two independent routes** (review F4).
    The target's own record must not be `prepledger`-linked and must not be named
    `earned-soak`; **and** the account's site list is read and the deploy refused
    if the given id is one that list identifies as the frozen app's or the soak's.
    The reviewer's option was "add a second refusal **or** document the limit" —
    I added it, because the first two checks read a single record and would see
    nothing at all if Netlify answered without `build_settings`. The list read is
    read-only, no site is ever created (the only `curl -X POST` in the file is the
    deploy itself, and a test counts them), and it **fails closed**. The plan said
    "second Netlify site"; these make "second" enforceable rather than
    aspirational.
11. **The Chromium check carries its own control** (a worker-blocked context that
    must fail offline), so a green line cannot come from the HTTP cache.
12. **The guard's ten probe strings are assembled from fragments at run time**, so
    no file in this branch contains a string that is itself shaped like a
    credential. The first push of the test commit was **refused by GitHub's own
    push protection**, which read the literal Slack probe as a real token. That is
    the correct behaviour on its side, and the fix is to remove the shape, not to
    click the "allow this secret" link: a builder who asks for an exception has
    taught everyone to wave the next one through. **No unblock was requested and
    no secret-scanning exception exists for this branch.** The commit was rewritten
    before any push succeeded, so nothing token-shaped is in the branch's history.

---

## 12. Files

At the review-round-1 head. Six files changed since `839d212`; the eight unchanged
ones carry the same hashes they did there.

| file | lines | sha256 | vs `839d212` |
|---|---|---|---|
| `.github/workflows/slice-host.yml` | 169 | `a54906a189d800f0d55f138e88a000fa731019557f482bf7f806697d38ee8c21` | F1, F2, F4 |
| `rebuild/slice/pwa/browser-offline-check.mjs` | 168 | `60115c80370cb94c810d4d9ec2e7a9eb230a98ca56a965d47ce83961b04b8763` | — |
| `rebuild/slice/pwa/build-pwa.mjs` | 124 | `21c26ca4a8075f6fa86befe42814a576f1eb25669962acd406801034e2d46b48` | — |
| `rebuild/slice/pwa/icons.cjs` | 172 | `f72b491ffa64b935494c815ba9e456756aaca6663b3c03a93e1099a5a78fc3fb` | — |
| `rebuild/slice/pwa/preflight.css` | 16 | `1fcd43b13cd64f99c90ccfefb10dc6b63086be9daf9e7c7353edb64664a06da5` | — |
| `rebuild/slice/pwa/preflight.html` | 14 | `98ead3de24388cb3d5c70f304e7e519d5e9a6021842b3f2fa651f9c445e63ebf` | F5 |
| `rebuild/slice/pwa/preflight.js` | 80 | `a92a3b018f3a17bc7f4f7b9795f3a738869e51f01f49b370a7a2eabffcba5a0f` | F5 |
| `rebuild/slice/pwa/pwa.cjs` | 181 | `4c83e58093e8fd4df28fc269c34d0a9a329ad36131007b5cd4a7c074eec0f088` | — |
| `rebuild/slice/pwa/serve-pwa.mjs` | 100 | `76d5cfb5020efd64dce56771104a56a3fb3595d2b034795cd18f0f64c7aeeb63` | — |
| `rebuild/slice/pwa/shell.cjs` | 188 | `86d6a1776c96a3573bd616aa3fc9444cddb80277aff6ac1cdf7a9dfc9f823881` | — |
| `rebuild/slice/pwa/sw-source.js` | 112 | `d4429ec7ade76d6eeefeea743bf1c3adb26d19f9f0884a7a0c7c3964cc1b72eb` | — |
| `rebuild/slice/pwa/test/package.test.cjs` | 205 | `9f8ba8b37fd871dbdad56798428590b3594599cab8ea04b220814cdb2b846f92` | — |
| `rebuild/slice/pwa/test/pwa.test.cjs` | 645 | `15ca6618f235f0a74f0c2e62ffc49532292696ef412fac8b9d21d3659a1647c4` | F5 |
| `rebuild/slice/pwa/test/workflow.test.cjs` | 164 | `0962c0094ff19e289d185a4f8e9da2fca2b715bd888abef7cf35ef0dd57d21e9` | F1, F2, F4 |

(`rebuild/slice/A5-REPORT.md` — this file — is the fifteenth addition, and carries
F1, F4 and F6.)
