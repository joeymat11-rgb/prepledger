# S9 guard continue-on-error red report

Task: D-S9G-CONTINUE.
Base: 1e978224f86820f4cd549fd177b54cdc8d637947.
Scope: the three commissioned guard cells and this report only.

## Invariant
A workflow step that owns a guarded `node --test` run must not carry a
step-level `continue-on-error` key. Both `true` and `false` are refused because
the key itself weakens the closed workflow grammar and can later change value.
The required refusal marker is `STEP-CONTINUE-ON-ERROR-FORBIDDEN`.

## Static red
Each actual reader now receives a synthetic owning step with the valid
`if: ${{ !cancelled() }}` line plus direct `continue-on-error: true` and false
variants. The current readers inspect only `if:` and therefore accept both.
The regression expects refusal, so the new rows are red before repair.

The fence row collects outcomes for its own, passphrase and local-import paths
before asserting. This exercises all three fence-owned callbacks even while all
three are wrong. Pack and release-object carry their own equivalent rows.

Controls keep an ordinary runner, a grouped runner, a sibling step carrying the
key, and nested `env` and `with` keys green. The refusal is therefore limited to
the owning step at the run indentation.

## Runtime containment
PM granted the three rows after the static import/top-level/child-process
inspection. Only positively selected `D-S9G-CONTINUE` rows ran, one Node
process at a time, with the fixed time and timezone environment values.
No whole cell, real row, fence engine, pack real row or legacy reader ran.
Logs: %TEMP%/earned-s9g-continue-red-b4dd4c04115445b38a693d58547b7cd0.

Executed commands under the explicit runtime grant:
`$env:MEASURED_TEST_NOW='2026-09-03'`
`$env:TZ='America/New_York'`
`& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-name-pattern '^D-S9G-CONTINUE:' 'rebuild/lanes/c/ui-port/pack-pin.test.mjs'`
`& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-name-pattern '^D-S9G-CONTINUE:' 'rebuild/lanes/c/ui-port/release-object.test.mjs'`
`& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-name-pattern '^D-S9G-CONTINUE:' 'rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs'`

Static reachability check: pack imports only Node built-ins; its selected row
does not call the ACL child-process helper. Release-object reads only the named
runner and fence sources as text and builds pure functions from exact anchors;
its selected row makes no filesystem or child-process call. Fence imports only
Node built-ins; its selected row reaches no git or filesystem helper, and its
registered cleanup sees no fixture directory. Every other row is skipped by the
anchored positive test-name selector.

Expected red: each selected row reports that direct `continue-on-error` was
accepted. Expected controls: ordinary, grouped, sibling and nested cases pass.

## Candidate evidence
Published red dd973e3656d5444586923785300bdbe3983159e9 proved all five readers accepted both keys.
Each candidate file ran exactly one selected test, zero skips, and passed.
Logs: %TEMP%/earned-s9g-continue-candidate-848c07837ac2497abdef14a5b49d6f52.
Pack log sha256: 635cc5339ab2f6fe50e46733a31f48fcd2f1aca3f207e161092596fdc3850722.
Release log sha256: cb4eb50072a46ac2a1f66c2fc075b32f8bb6abccc06dac7803a523fca4404062.
Fence log sha256: 4bcf70bb60651ce244e491246bce50d3037d07f81ff55cb73e6ffd48be4b604a.
All five readers now refuse both direct keys by name; every scoped control passes.
No product, workflow, runner, package, pin, seal, ledger or status file changed.
