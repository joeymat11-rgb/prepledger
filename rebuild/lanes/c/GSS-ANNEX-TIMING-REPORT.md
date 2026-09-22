# GSS annex timing proof: G1/G2 candidate report

Status: REVIEW RED. Original three pass; four of seven identity/reentrancy rows fail.
Candidate under review: 46af1b846801cbbf67f6ac8ef1e582038a133f9f.
Scope: G1, ABA, G2, plus seven bounded writer ownership controls.
Owned tests: today/test/gss-annex-{timing,identity-reentrancy}.test.mjs.

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
The appended ABA row proves edit-then-revert remains a newer editor revision.
Seven synthetic controls cover exact opaque token identity and post-read invalidation.

## Teeth and safety
G1 and G2 first run a second real mounted/store journey through held delivery.
At that seam G1 hides the mounted editor; G2 resets the mounted load field.
The same DOM capture and durable reopen checks then require the named failure:
GSS-G1-STALE-EDITOR-CLEAR or GSS-G2-INDEPENDENT-LOAD-LOST.
Rows have node:test timeouts; held acknowledgement and delivery waits are bounded.
Imports use current mountGym and createMachineSettingsHost APIs only.
No lifecycleState, refreshState, archived counter, old app, private, or soak path.
Red static manifest: C:/Users/joeym/AppData/Local/Temp/earned-gss-annex-static-04ea69e-g1g2/import-closure-effect-scan.txt
Manifest SHA256: 31803a36079cfbda100757d5dbc9abd66472fcdae5b882d3b94264fca5db4a25.
It hashes 130 repository files, records zero forbidden paths, and names all ten
literal dynamic branches. They are conservatively included in the closure.
Its named OS/external-effect text patterns had zero matches; this is not a purity claim.
The mounted proof import graph is unchanged; the controls import the real writer and jsdom.
Shell, JSDOM, IndexedDB, host/store, and journey helpers run inside test callbacks.
Imported ESM/CJS initializers still run; package internals are outside the manifest.
The harness opens no network, browser, server, subprocess, or external target.
## Published red and measured candidate runtime
Pinned Node exists at C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe.
Run these exact PowerShell commands sequentially from the candidate root:
1. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G1:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
2. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G1-ABA:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
3. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G2:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
Each original anchored command selected one row: three pass, zero fail.
Repository controls ran seven: three pass, four fail, exit 1.
Failures: revised token identity and replace/leave/dispose stale delivery.
Control log: C:/Users/joeym/AppData/Local/Temp/earned-gss-identity-red-db4c824cae8a4c55b107958422360eb1/red.log
Control log SHA256 f0a85cd5293d783a2fa8059cf50400757ade7f2b00e1abd7d32a8fbd6a84ca08.
Control test SHA256 35b7e1550ecb84aea96eb7de978e4653a2454c2ce230b19336d4b0833d29c141.
Original green logs remain under earned-gss-g1g2-fix-b433956ce11c4fef914d53c067e722f2.
## Limits
G3-G8 are outside this initial batch and remain open.
Mounted DOM plants prove the observation seam; they do not claim a source-level
guard-removal mutant is killed.
No annex closure, acceptance, repair, or full-candidate PASS is claimed.
