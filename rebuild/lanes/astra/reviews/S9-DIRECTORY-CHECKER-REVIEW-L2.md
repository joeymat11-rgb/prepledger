# S9 directory-reference checker independent review L2
Verdict: ACCEPT for the existing authorized Windows-local PM read-only check only.
No Linux/path cross-OS proof, complete source closure, package acceptance, or seal is claimed.
Candidate remains a23c079b1bda934257cce944fc2763d914636956; sourceBase is unchanged.
Final helper s9-source-custody-check-a23c079-directory-fix.cjs SHA256:
fb75b6a2b67b7e49776d920b23a505ccb5e87f0d211a2253eb2e1340e20f5ef7
Helper folder: %TEMP%/earned-s9-source-custody-checker-sol-20260921.
Original helper SHA256: 20ac3a95edde0134bd1f43f17c828843ac20f78d8ec12db2b16a02f793cda8b6
Preserved actual STOP log SHA256:
f30f0460b68c028b86cd41bd70074ea917cec6632910fddd64dbe76b3761a6f9

Own source observations before reading the correction report:
Public local-real-day.test.mjs:34 supplies a relative URL to the repository directory.
Runner executedClosure skips non-files and tries base/.cjs/.js/.mjs candidate spellings.
The original checker refused normalized './' before reaching directory classification.
Final change is confined to executedClosure candidate iteration; surrounding bytes match exactly.
Slash-ended direct candidates are canonicalized then pass unchanged path and Git type checks.
Root/tree/missing direct candidates are skipped; regular direct blobs are queued.
Link/gitlink metadata still refuses before directory skipping; extension candidates are normalized.
Fallbacks retain original spelling: './.cjs' becomes '.cjs'; 'dir/.cjs' stays inside dir.
Targets, sourceBase, five-file permission policy, cap, forbidden roots and output code are unchanged.

Independent synthetic measurements, pinned Node v24.19.0, fixed date/TZ:
The harness uses builtins and a new disposable Git repository; no project modules are imported.
It compiles actual helper definitions with synthetic CANDIDATE and main replaced by exports only.
PID57472 exit1 found first correction's trailing-slash link bypass: PASS instead of link refusal.
Its preserved log SHA256: 87406c63e96a2e71da3a3d7dcabf674f56dc3add3edb489841fdca5699f2b003
Its harness SHA256: a38ea8d3612eb81a280f81c73e58bc9c093c01e6efe206d7df92fae3d8eda729
PID63372 exit0 tested the final correction; terminal runtime was released immediately.
Final independent-controls-l2.cjs SHA256:
9d91ba325abcecf16f55f872cbb5baf5b3a99b9ee4517d903a5f6ef36f42c478
Final independent-green-l2.log SHA256:
f506c04700c8383d0aa4a5d8ddfe8f616e68d4f14da09b71cbb44b45ac6df54f
Ten named outcomes passed: exact four-file closure, eight refusal controls, regular-slash parity.
Closure covers root and nested directory references plus their precise extension fallbacks.
Refusals cover forbidden/out-of-root/protected alias/overlength/plain link/slash link,
directory child and a real directory whose name ends in .mjs.
Windows runner's actual existsSync(path.join(...,'plain.cjs/')) && stat.isFile() was true.
Final helper queues that regular blob too; this is measured Windows parity, not POSIX inference.
Gitlink shares unchanged rejecting metadata branch; a separate gitlink fixture was not run.
The 512-file closure cap is unchanged and was not re-exercised in this focused correction.
Original PATH_REFUSED reproduction is retained author evidence; independent red targets link bypass.
Final helper hash was verified before and after independent execution and stayed identical.

PM may run the exact final helper under permission 766, retaining any typed STOP/HELD outcome.
No real integration checker, protected source read/hash, private census, or package runner ran here.
No repository edits, grant changes, product/test weakening, or source-pin substitutions were made.
Final both-OS package execution and independent final acceptance remain owed.
