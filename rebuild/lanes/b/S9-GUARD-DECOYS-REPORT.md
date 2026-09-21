# S9 guard decoys: author report

Role: commissioned Sol builder under PM ledger 658. Author evidence only.
Base: cf4fc766b7e7ab711eaa9a13257df3b25db70d00.
Red checkpoint: 747de184e8e3ca6b8517099dce5ac8786016e493.
Review: 171058207c068ba460e6758b3277d5c5528529ba.

## Scope

D-S9G-DECOY in the five existing condition readers only. No workflow, runner,
engine, pin, spec, ledger, STATUS, historical report or seal work is in scope.

## Red first

Three positively selected regression rows exercised only injected synthetic
workflow text through the actual reader callbacks. Each row kept an honest
five-step control and required refusal of D (nested env.if only), E (nested
good env.if before a false direct condition), and F (earlier echo of the path
before a false actual runner condition).

At the defective base, the three cells each produced 1 test, 0 passes, and 1
failure. The first missing refusal was D in each cell. The fence loop stopped
at its first file's D; its other readers and later E/F assertions were not
reached in this author run. Logs: %TEMP%/s9-decoy-red-{release,pack,fence}.log.

## Result

PM published the red checkpoint before the fix.

## Fix

Each reader now selects a named step only through an exact path token in a
step-level `node --test` run. It requires one owning run and exactly one `if:`
at the run indentation, then checks the whole permitted expression. Echoes,
nested keys, sibling paths, duplicate conditions, and duplicate owners refuse.

## Green

The same three positively selected rows each produced 1 test, 1 pass, and 0
failures. Together they exercised all five readers with honest direct and
after-run conditions, D/E/F, duplicate-condition, duplicate-runner, and sibling
path controls. Logs: %TEMP%/s9-decoy-green-{release,pack,fence}.log.

No full cell, real workflow row, fence, seal, artifact, filesystem helper, or
child process was run. Independent candidate review remains required.
