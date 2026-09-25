S9 PASSPHRASE STATIC BOUNDARY REVIEW L1
Verdict: ACCEPT the current runtime STOP; permission proposal is not execution readiness.
Independent reviewer read public source first, then both complete author reports.
No repository module/test executed; no protected/private source opened or hashed.
Bound source head b3fb9ce92084e1dd4abe6608d2d914b79924a12d.
Observed current head f191b2e1bde801fdff8cce6dcc56bf24b389782f changes only measure needle to '# pass 11'.
All passphrase source bytes and argv therefore remain unchanged.
Source chain: route/unlock -> import/test/support -> source-admission -> browser-replay -> engine-provider.
Provider line 3 synchronously requires protected migrate.cjs and merge.cjs during dependency evaluation.
This precedes test registration. A test-name filter does not contain those module effects.
Route line 19 and unlock line 34 separately call sealInventedBundle at top level.
Support creates synthetic OS-temp source/output trees and spawns the real port.cjs.
Port selects oracle-shim by default, requires its engine, and runs frozen/unfrozen oracle checks.
Thus the two successful seals entail four oracle checks, beyond a read/hash allowance.
Oracle line 14 unconditionally probes private/live.json and includes it if present.
The synthetic source argument does not disable that separate private selector.
Oracle check calls runLaws with conform/run.log; harness appendFileSync writes that log.
Port captures child output; support can expose final 600 stdout plus 600 stderr characters on failure.
Outer TAP/assertion output is not capped by the supplied command.
These are actual execution boundaries, not a ban inferred from an engine directory name.
V2 correctly retains unchanged combined argv; v1 helper-split suggestion is not adopted.
V2 disposable-copy direction still needs concrete preparation before an owner request/run.
Tracked-only copies can retain tracked old-app/ledger paths; they are not an isolation mechanism.
Network denial and bounded capture require specified enforced mechanisms, not prose promises.
Protected downstream effects remain unreviewed; exact five hashes alone do not establish their behavior.
No approval for private census, protected execution, source changes, or whole-child execution is given.
Author v1 SHA256 8dae4d4320e7689b1844b0bfd152c2cdbb6181179b4c668eeef04eae3c04dabf.
Author v2 SHA256 e0dde033147f5559662a0c3edfd2eb6862a5acd39daa677146ccf52bfc215f34.
route SHA256 0a9a4dde7a59d9b46f6267313d29c8f630d73509610b553864b9ed92691033dc.
unlock SHA256 1d109886b26c7dd52a452a1b0ff7e2e508f29bd47d690cf4f691d9f75a0340f8.
support SHA256 adea55fcd2ff7aab1177385b8ac8c43135203d15e977dc88a1cd24c361edd2cb.
source-admission SHA256 2f477147b79d3fc1b03feae873b25f40359334425051a851570880b7423113a3.
browser-replay SHA256 2b7112798db0ba41497aae0b38bdbf7deea5116b23f872ada0ebe6a52f0f10ba.
engine-provider SHA256 1899ba3c451c830b904f65c8e4afd4012e59ca18fcfa0b990993c58c2786f896.
port SHA256 b83bfd0f61bdae0aeb4c2ed48404c46a7ab30d8b5f2204f76321998d53756d16.
port-oracle SHA256 a61393d69bb50e3e4c8390c8a1795fd9e0ab61887c7d84021473dbd493af60e1.
harness SHA256 f8667e3e0119ab4b04e417f20f4fc6d602612ebc7aff847d7e432d86c399e79e.
Scope: static first-boundary review only; no complete transitive containment or final S9 acceptance.
