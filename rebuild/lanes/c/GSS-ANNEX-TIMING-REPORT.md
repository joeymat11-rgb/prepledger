# GSS annex timing proof: G1/G2 static author report

Status: MEASURED RED. G1 fails its named oracle; G2 passes.
Candidate: 04ea69e60dea5875a5a82b562af24b2f2f71c7be.
Scope: G1 and G2 from GSS-ANNEX-CLOSURE-BRIEF only.
Owned test: rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs.

## Proof rows
G1 holds acknowledgement after a real settings commit, then edits the same live
editor. It requires the newer answer and existing named error to remain visible.
After reopening the real host, it requires the originally submitted payload in
exactly one new operation and its one linked outbox entry.
G2 runs two fresh-store variants while the real Save acknowledgement is held.
The first changes both entry fields. The second uses the load stepper and changes
effort. Both require the unchanged editor to close without clearing those changes.
G2 executes both variants even if the first records a failed assertion.
Each variant reopens the host and compares full serialized ops/outbox maps.

## Teeth and safety
Each row first runs a second real mounted/store journey through held delivery.
At that seam G1 hides the mounted editor; G2 resets the mounted load field.
The same DOM capture and durable reopen checks then require the named failure:
GSS-G1-STALE-EDITOR-CLEAR or GSS-G2-INDEPENDENT-LOAD-LOST.
Rows have node:test timeouts; held acknowledgement and delivery waits are bounded.
Imports use current mountGym and createMachineSettingsHost APIs only.
No lifecycleState, refreshState, archived counter, old app, private, or soak path.
Retained static manifest: C:/Users/joeym/AppData/Local/Temp/earned-gss-annex-static-04ea69e-g1g2/import-closure-effect-scan.txt
Manifest SHA256: 31803a36079cfbda100757d5dbc9abd66472fcdae5b882d3b94264fca5db4a25.
It hashes 130 repository files, records zero forbidden paths, and names all ten
literal dynamic branches. They are conservatively included in the closure.
Its named OS/external-effect text patterns had zero matches; this is not a purity claim.
Owned top-level helper calls are two Object.freeze calls and two test registrations.
Shell, JSDOM, IndexedDB, host/store, and journey helpers run inside test callbacks.
Imported ESM/CJS initializers still run; package internals are outside the manifest.
The harness opens no network, browser, server, subprocess, or external target.

## Exact runtime attempt
Pinned Node exists at C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe.
Run these exact PowerShell commands sequentially from the candidate root:
1. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G1:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
2. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G2:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
Each command selects one candidate row; the other row is skipped by name.
No product, package, engine, fence, seal, workflow, or ledger command is planned.
The earlier pre-enumeration dependency failure remains environmental non-evidence.
After offline recovery each command selected exactly one row and terminated.
G1 exited 1 at AssertionError GSS-G1-STALE-EDITOR-CLEAR; G2 exited 0.
Logs: C:/Users/joeym/AppData/Local/Temp/earned-gss-g1g2-run-b3efaddaceae4d4889a53226c05db3ae/.
G1 log SHA256 3b00ac299d89316fe6155ef7b10f346b7a462b4df697aa8e50e8e50dcc776da6.
G2 log SHA256 75bc94b783d67771cac7fc48c52a9b2ad6f024a80d7baa373a9810035b849271.
Recovery uses lock-pinned fake-indexeddb 6.2.5 in a test-only task-owned junction.
Its verified cache blob and archive scan are recorded in the static custody note.
Both rows resolve the same ESM package; jsdom and W6-local noble hashes are unchanged.
Test SHA256 b2a5470b8ad82ca588876a208f343af189d94c5277716804481c6411619ac9db.
HEAD 04ea69e60dea5875a5a82b562af24b2f2f71c7be remained unchanged after both rows.
## Limits
G3-G8 are outside this initial batch and remain open.
Mounted DOM plants prove the observation seam; they do not claim a source-level
guard-removal mutant is killed.
No annex closure, acceptance, repair, or full-candidate PASS is claimed.
