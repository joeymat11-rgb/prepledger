# GSS annex timing proof: G1/G2 candidate report

Status: LOCAL CANDIDATE GREEN. Three anchored rows pass; independent review remains owed.
Base: published red 7931f57fa469e14cde260a73a8599fa3a381fea9.
Scope: G1 and G2 only, plus a same-harness G1 ABA safety row.
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
The appended ABA row proves edit-then-revert remains a newer editor revision.

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
Imports are unchanged; top level now has two Object.freeze calls and three registrations.
Shell, JSDOM, IndexedDB, host/store, and journey helpers run inside test callbacks.
Imported ESM/CJS initializers still run; package internals are outside the manifest.
The harness opens no network, browser, server, subprocess, or external target.
## Published red and measured candidate runtime
Pinned Node exists at C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe.
Run these exact PowerShell commands sequentially from the candidate root:
1. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G1:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
2. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G1-ABA:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
3. $env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --test --test-concurrency=1 --test-name-pattern '^D-GSS-G2:' 'rebuild/m3/w7-preview/today/test/gss-annex-timing.test.mjs'
Each anchored command selected exactly one row and terminated: three pass, zero fail.
Published red retained G1 failure GSS-G1-STALE-EDITOR-CLEAR and G2 pass.
Candidate logs: C:/Users/joeym/AppData/Local/Temp/earned-gss-g1g2-fix-b433956ce11c4fef914d53c067e722f2/.
G1 log SHA256 127ac42b10fd20bae9988f4df6da0a1e0b31b2a0e754442966ac30694bb4ee2a.
ABA log SHA256 0619176fc834673e70c59e4b42f9b9f9c48651ff3ace6c87152c50a1834a1a5a.
G2 log SHA256 bfa6936366625236d1c8ca0e0cb05dd08137079112ffad3869b50857fbafba69.
Recovery uses lock-pinned fake-indexeddb 6.2.5 in the test-only task donor.
Candidate hashes: gym-app 7ae8a87fb7571c921622eeb49a9498a27542cfafc1392d255718bdc7ca6904d2;
gym-settings-lane 2f94a2ccff052bb680def846f5be7685c5a5595c4be0ad5aa78f3747a3e738a5;
proof 026daa0fb5c371f67faefa6a047268d8a5a0182d5f7223499ba325df6ef290b3.
## Limits
G3-G8 are outside this initial batch and remain open.
Mounted DOM plants prove the observation seam; they do not claim a source-level
guard-removal mutant is killed.
No annex closure, acceptance, repair, or full-candidate PASS is claimed.
