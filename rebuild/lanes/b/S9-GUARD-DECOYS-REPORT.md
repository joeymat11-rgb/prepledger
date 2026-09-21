# S9 guard decoys: author report

Role: commissioned Sol builder under PM ledger 658. Author evidence only.
Base: cf4fc766b7e7ab711eaa9a13257df3b25db70d00.
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

RED READY for PM publication before the narrow reader fix.
