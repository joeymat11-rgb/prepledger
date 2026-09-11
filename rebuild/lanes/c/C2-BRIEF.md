# LANE C — C2 BRIEF — Joe's port script for the PC (migrate → merge → port-oracle 10/10 → sealed bundle)

Lane: C. Tier: plumbing (ONE independent Opus reviewer + CI both OS). Base: rebuild/t2-client-core @ ffabbca. Branch: rebuild/lane-c-c2. Owner files only: rebuild/m3/setup/port/** (new), rebuild/lanes/c/C2-REPORT.md. NOT rebuild/engine/*, NOT rebuild/m4/import/* (reuse, never edit), NOT rebuild/conform/* (the oracle is a frozen gate; call it, never change it), NOT rebuild/client/*.

## Purpose (slice DONE item 5 + LANES.md C2)
Joe's real history (the frozen app's private ledger, SCHEMA_V 60) must reach the phone through the ACCEPTED migrate/merge modules (rebuild/engine/migrate.cjs, merge.cjs — modules 5/6, port-oracle 10/10 already proven on the private blob on 2026-09-05) with the private blob never leaving the PC. Output = one passphrase-sealed bundle file Joe moves to his iPhone himself; the phone side (import into the C1 local store) is C2b, a separate task after C1.

## Hard rules
- RUNS ONLY ON THE OWNER'S PC and only after an explicit owner ask right before the real run (LANES.md). This task builds and tests the script on SYNTHETIC/PUBLIC fixtures only: rebuild/conform/fixtures/preimage-2026-08-15.json (public frozen preimage) and synthetic-pending-debut.json (oracle/make-synthetic.cjs). The private blob (ledger/state.json on main, rebuild/conform/private/) is NEVER read by this task, never by a subagent, never in the cloud.
- Verdict-only reporting: when the real run happens, stdout contains path names, counts, hashes and PASS/FAIL — never a ledger value (port-oracle.cjs already enforces this for private blobs; the script must not print the blob or any field of it).
- No new dependencies. Node 24 built-ins only (node:crypto for PBKDF2/AES-GCM; the phone side uses WebCrypto with the same parameters).

## Deliverable: `rebuild/m3/setup/port/`
1. `port.cjs` — CLI: `node rebuild/m3/setup/port/port.cjs --source <path-to-ledger-state.json> --out <dir> [--local <phone-export.json>] [--engine <path>]`.
   Steps, each printed as a numbered line with PASS/FAIL and a hash:
   a. read source bytes; sha256; strict JSON via the W6 strict parser (rebuild/m3/w6/strict-json.mjs) — reuse rebuild/m4/import/prepare.cjs `createImportPreparation({engine, parseStrictJson})` exactly as its tests use it (locate rebuild/m4/import/test); never re-implement migrate/merge.
   b. prepare → migrated (and merged with --local when given) state; dataLossGuard result printed as counts only.
   c. port-oracle gate: find how MODULE 5/6 acceptance ran "port-oracle 10/10" (rebuild/engine tests / rebuild/conform/oracle/port-oracle.cjs `check` mode / DECISIONS.md 2026-09-05 module-5 line) and invoke that SAME gate on the migrated state with MEASURED_TEST_NOW/TZ pinned exactly as the accepted run did; print the verdict line. FAIL → no bundle written, exit 2.
   d. seal: generate a 6-word passphrase (embedded ~2048-word list, crypto.randomInt), derive key PBKDF2-SHA256 600 000 iterations / 16-byte salt → AES-GCM-256, 12-byte IV, AAD = JSON ["earned/local-import-bundle/v1", sourceSha256]. Payload JSON = `{profile:"earned/local-import-bundle/v1", createdAt, engine:{sha256, schemaV}, source:{sha256, bytes(base64 of the ORIGINAL source bytes)}, migrated:{sha256, state}, oracle:{verdict, gate}, dataLoss:{counts}}` (the original bytes ride along so the phone's import-custody can keep the immutable original per its profile).
   e. write `<out>/earned-port-<YYYY-MM-DD>.json` (the bundle) and `<out>/earned-port-<date>-PASSPHRASE.txt` (mode 600 where supported; the script prints WHERE it wrote it, never the words). Print a one-screen plain-language "what to do next" for Joe: move the .json to the phone (iCloud Drive / OneDrive / email-to-self are all fine — it is sealed), keep the passphrase file on the PC, delete both after import.
2. `unseal.cjs` — the reference decoder (same parameters) used by tests and later by C2b: `unseal(bundleBytes, passphrase) → payload | throws BUNDLE_AUTH_FAILED`.
3. `README.md` — the run instructions in Eli15 language + the exact owner-ask rule.

## Tests: `rebuild/m3/setup/port/test/*.test.cjs` (node --test, no network, public fixtures only)
- end-to-end on preimage-2026-08-15.json: exit 0, bundle written, unseal with the generated passphrase → migrated.state deep-equals prepare()'s output, source.bytes === the input bytes, oracle.verdict PASS.
- --local merge path on the synthetic fixture pair (make a second synthetic with one extra read) → merged state contains both; dataLoss counts printed.
- tampered bundle (one flipped byte) → BUNDLE_AUTH_FAILED; wrong passphrase → BUNDLE_AUTH_FAILED; wrong AAD (sourceSha256 changed) → fail.
- oracle FAIL path: feed a state that violates a law (e.g. corrupt one required leaf) → exit 2 and NO bundle file.
- privacy: capture stdout during a run and assert no value from the fixture's reads/sessions appears (search for a few known fixture values).
- Windows path handling (the real run is on Windows): paths with backslashes and spaces.

## Acceptance
Builder commits code + tests + `rebuild/lanes/c/C2-REPORT.md` (commands + pass counts on Windows, file sha256s, the exact oracle gate reused and where it was found, residuals). ONE independent Opus reviewer re-executes in work/lane-c/review-c2 and writes `rebuild/lanes/c/C2-REVIEW.md`. Lane C posts PR-READY in STATUS.md; the PM judges/merges. The REAL run on the private blob is a separate event: STATUS line "C2 READY FOR OWNER ASK"; lane C asks Joe in the chat; only his own words start it.

## Toolchain (owner's PC, Windows)
Node `C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` (24.19). Worktree `C:/Users/joeym/Documents/Codex/2026-09-04/read-rebuild-t3-brief-md-and/work/lane-c/c2` (branch rebuild/lane-c-c2; node_modules junctioned — never run npm/pnpm install). The conformance engines (rebuild/conform/engines/*.cjs) are gitignored build products: if the oracle gate needs engine-main, build it with `node rebuild/conform/engines/build-engines.mjs <repo root>` in the worktree (public step per AGENTS.md 4); never touch rebuild/conform/private/.
