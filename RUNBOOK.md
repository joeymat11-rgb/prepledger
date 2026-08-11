# RUNBOOK — how EARNED ships, updates, and un-ships

This file closes board finding RB-5. It is operational law, not documentation
flavor: every rule here has already been violated once, and each violation is
named where it matters.

## THE UPDATE MECHANISM (how a change actually reaches the phone)

Netlify serves this repo as-is. The installed phone runs a **cache-first
service worker** (`sw.js`): every asset is served from the cache named
`earned-vX.Y.Z`, and the network is consulted only for what the cache lacks.

**An update reaches the phone ONLY when the bytes of `sw.js` change** —
in practice, when the `CACHE` name bumps. The flow on the phone:

1. Next app open, iOS fetches `sw.js` (SW files bypass the HTTP cache).
2. Bytes differ → the new worker installs, caches the new assets under the
   new name, `skipWaiting()` + `clients.claim()` activate it.
3. The old cache is deleted on activate. The user sees the new build on that
   open or the one after (UPDATE READY semantics).

If `sw.js` bytes do NOT change, the deploy is a **silent no-op on installed
phones** — the CDN updates, the phone never does, and nothing anywhere says
so. That is the RB-5 finding and the reason for the ritual below.

## THE RITUAL — NO MERGE WITHOUT THE BUMP

**Never merge app-visible changes to `main` without, in the same merge:**

- `APP_V` in `src/app.jsx` bumped, and
- the `CACHE` name in `sw.js` bumped to the same version
  (`earned-vX.Y.Z`), and
- `app.js` rebuilt (the gate's byte-check enforces this one).

The gate (`scripts/check.mjs`) asserts APP_V === the sw cache name, so a
half-bump fails loudly. What the gate cannot see is a merge with NEITHER
bumped — both sides consistent, both stale. That case is this ritual's whole
reason to exist: **the human (or agent) merging checks the bump is present
before the merge word is acted on.** Docs-only merges (`[skip ci]`,
NEXT.md/RUNBOOK.md) are the one exception — they must not bump.

## LAUNCH-DAY STEPS (any release)

1. Branch green: `npm run check` strict — suite, freeze, lockdown, manifest.
2. Bump APP_V + sw cache ON THE BRANCH (so the audit sees the exact bytes
   that ship).
3. Merge `--no-ff` per the merge word. Plain merge; never rebase a branch
   that already contains the merge commit (the v7.37.0 lesson: a rebase
   flattened the merge silently — reset and re-merge instead).
4. `npm run prodcheck` until: version match, 7 assets 200, private paths
   404, beacon `published vX.Y.Z`.
5. Confirm `ledger/deploy.json` names the version. Done means live ON THE
   PHONE's next open — not just on the CDN.

## THE UN-SHIP PATH — ROLL FORWARD, NEVER BACK

To pull a bad release, **never re-point at an old cache name and never
reuse one**. iOS treats a byte-identical `sw.js` as "no update" — reusing
`earned-v7.40.0` after v7.41.0 means phones that ever held v7.40.0 may
never fetch the rollback at all, and phones on v7.41.0 see no change.

The correct un-ship:

1. `git revert` the bad merge (or restore the old code) on a branch —
   the CODE goes backward, history goes forward. Never force-push main.
2. Bump APP_V + the sw cache to a **NEW, HIGHER** version
   (old code, new name — e.g. v7.41.1 containing v7.40.0's behavior).
3. Ship through the same ritual. The board proved both directions: a
   forward-named rollback reaches every phone; a reused name reaches none.

## THE FAILURE MODES THIS FILE EXISTS FOR

- **Silent no-op deploy** (no bump): CDN moves, phones don't. RB-5.
- **Reused cache name**: phones never update, or update inconsistently.
- **Rebase after merge**: the audited merge commit silently flattened
  (v7.37.0) — reset to origin and re-merge instead.
- **Push race with the ledger auto-sync**: integrate by re-merging from a
  clean reset, never by rebasing the branch that holds the merge.
- **Stale `app.js`**: committed bundle ≠ `src/` — the gate catches it;
  rebuild before every gate run.
