# S9 today-carry execution route v2

- Static inspection only; v1 STOP remains preserved. No source/module/test/protected-byte execution or copy occurred.
- Current metadata-only head `841c71ec19ecfa7da8a2694830c3fe36e9ae7974`; public source bytes remain those at `f191b2e1bde801fdff8cce6dcc56bf24b389782f`.
- Current S9 spec SHA-256: `8c25dd8ece37576eeff357fbb4b697eedb0982e98fadad4e97da82a5ee2bf6d4`.
- Exact argv is unchanged and declares 9 rows; the companion has 31 repository-relative paths and exact hashes.

## Closed graph

- All 26 public module bodies were inspected for imports, dynamic import/eval, filesystem, subprocess, network, environment, and write operations.
- Their import graph is closed. The engine factories create no hidden source reads; only reachable `design.headlineVocabulary()` uses the filesystem.
- It lists direct `rebuild/engine` entries and reads names ending exactly `.cjs`: 18 expected regular files, comprising 13 public files plus the five protected files.
- The v2 manifest names all 18 in expected enumeration order by Git metadata and requires a fresh destination with no extra direct `.cjs`, aliases, or links.
- The protected five use the current reviewed `S9.product[*].post` pins. This author did not read or hash their bytes.
- They are never imported, required, or evaluated: the helper reads UTF-8 text and regex-extracts title literals/propose arguments for internal comparisons.

## Proposed bounded route

- In a fresh no-Git directory, an authorized hand copies only the 31 manifest paths, preserves their relative paths, then verifies every file is regular/no-link and matches its manifest SHA-256.
- It separately verifies `rebuild/engine` contains exactly the 18 named direct `.cjs` files before invoking pinned Node 24.19.0 with the manifest argv, fixed `TZ=America/New_York` and `MEASURED_TEST_NOW=2026-09-03`.
- This route relies only on existing authority 766 for bounded protected-five read/hash/static traversal. Runtime still requires PM assignment; this report grants none.
- Success TAP contains row names, counters, and timing. Failure assertions can expose extracted source title strings; keep raw TAP local and share only process id, exit, counters, verdict, and evidence hashes.
- No writes, network, subprocesses beyond Node test workers, package dependencies, owner state, Git, or repository history are reachable.
