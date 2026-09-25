# S9 hosted protected-20 proof proposal

- Proposal only; no workflow was dispatched and no repository file changed.
- Source is immutable `fe9f14b5a764efe0cc66fa0380a27b1e32d5672c`.
- Canonical S9 SHA-256 is `7dcdab1f0dc5c1b826d6fe993e88176cb5420bb386b98cfda938ed4f9cbb27e5`.
- Manifest carries exactly the canonical 20 null-needle child groups and unchanged argv, in canonical order.
- Proposed artifacts are one manual proof workflow, one serial receipt runner, and one reviewed manifest.
- They live only on a proof branch; existing workflow, runner, guards, tests, product and S9 stay unchanged.

## Source island

- Bootstrap checkout is blobless and sparse to the three proof controls, with persisted credentials disabled.
- The proof repo starts empty and fetches named commits blobless, no checkout, no tags, and depth one.
- Required identities currently include current, S9/S8/S4 bases, native-carrier base, `fe516c1`, and `7347ca...`.
- Before use, review must enumerate every required `ref:path` pair and its exact blob object ID in the manifest.
- Hydration uses only those pairs. Current files are materialized from a separate exact path allowlist.
- After hydration, remotes, alternates, replace refs, promisor settings/files, and bootstrap checkout are removed.
- Child env sets `GIT_NO_LAZY_FETCH=1`; allowed reads must pass and forbidden/ref-path probes must fail before tests.
- Object inventory must contain only reviewed commits/trees/tags and reviewed blob IDs; an ignored filter stops.
- Commit/tree identity is retained. Sparse checkout alone is not treated as exclusion.
- PM's invented-file Git 2.53 control proved selective hydration/no-lazy behavior; hosted controls remain required.

## Hard boundary

- Never hydrate `ledger/**`, `src/history.js`, `rebuild/conform/private/**`, protected soak, or owner-PC paths.
- Current and `fe516c1:src/app.jsx` are separate explicit owner-permission items for source-carriers.
- Protected-five execution, protected `E.SEED`/frozen-record consumption, and old-app reads need Joe's words.
- If a required test path conflicts with the forbidden set, stop and split; do not rewrite or filter the test.
- The five SUP groups require exact Git blobs; no fake Git wrapper or response substitution is proposed.
- This contains source reachability. It does not claim an OS network sandbox.

## Runtime and evidence

- Fresh Ubuntu hosted runner, Node 22, `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`.
- Locked dependencies install in a separate prep root with `npm ci --ignore-scripts --no-audit --no-fund`.
- Dependency lifecycle scripts do not run. Their copied tree is read-only input to the proof root.
- Twenty unchanged argv run serially. No retry, skip, target filter, fallback, full runner, import, or deploy.
- Child stdout/stderr go to exclusive runner-local files. They are never echoed or uploaded.
- Public output is group name, exit, TAP counters, source/tool hashes and stdout/stderr hashes only.
- Assertion failures remain nonzero/red; exception values and source stay in ephemeral raw files.
- The proposal runner exits nonzero on spawn error, nonzero child, malformed counters, failure, or skip.
- Fixed Git blobs, object allowlist, hosted Git behavior, dependency closure and failure redaction need blind review.
- Until those checks and Joe's explicit permission, manifest status remains `PROPOSAL_NOT_AUTHORIZED`.
