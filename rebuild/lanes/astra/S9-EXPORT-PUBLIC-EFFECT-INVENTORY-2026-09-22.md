# S9 prospective export: public effect inventory
PM static preparation at integration e5d3d05bee3aaecdc4e01815b281111058a42d03.
This narrows the remaining containment review; it is not runtime or protected-source approval.
No exporter, runner or repository module was evaluated. No protected bytes were read or hashed.
Existing exporter7541ad and procedure9911a2 remain unchanged; no second mechanics review implied.

## Observed public load path
The runner imports run, legacy-gates, strict-json, target, native-carriers-errors and load-write-reference.
Target imports trace-v2; load-write-reference imports load-write-source plus legacy-gates.
The eight public module paths and hashes below bind this inventory to the current snapshot.
Native-carriers-errors reads public run.cjs at module load to derive the closed error vocabulary.
Trace-v2 captures built-in descriptors; it does not call user getters during these declarations.
The run and target CLI bodies are guarded by require.main===module; imported use does not enter them.
load-write-source declares engine filenames/source-transform functions; its baseline/verify functions
are not called by load-write-reference's module initialization. Their protected reads are deferred.
Reference.create is excluded by the exporter's main-sequence cut, not replaced with a stub.
Its actual implementation calls publicReferences, which rebuilds frozen legacy source; this remains
outside this export procedure and cannot be inferred permitted for a later full package run.

## Selected invocation effects still needing final-input review
spec() reads canonical S9.json, verifies disk/Git runner/spec, then reads all declared-child literal
closure through executedClosure. That actual final closure remains blocked by the protected rule.
parent()/option() read the pinned public artifact/review, receipt ledger at its stated commit,
all sibling package JSON on disk/HEAD, and acceptance JSON on the frozen chain ref.
proposed() hashes brief/carrier/child bytes, reads the exact release ruling from the chain ledger,
and constructs coverage/released metadata. It does not invoke children or reference construction.
The exporter's later allPins loop also reads every declared product post and execution pin.
Final review must bind the sibling-spec/acceptance inventory as well as the final spec, input pins,
chain ref and public module load path. Clean tracked status alone is not a complete read inventory.
Source/pin permissions do not imply engine execution, private census, import or deploy.
S9.json is absent, so this inventory cannot prove final call effects or grant export execution.

## Public SHA256 coordinates
rebuild/conform/v4/postfix/run.cjs 654288e073ea6815ce699c1eacb61c7030b0de0781b277477f3800fa06eb245a
rebuild/conform/v4/postfix/legacy-gates.cjs b8891d9ba12f38713582634b7709b6f3a3a5c05e008a10c7f2d74a91e169b0df
rebuild/conform/v4/postfix/strict-json.cjs 5722f233e704149f03f2898bf739c3cc42fe323a0c91e0eee55eb82cc57a3478
rebuild/conform/v4/postfix/target.cjs e19f3399d9e4e4dff7d3a6dae2c2c251c9fda5b88ead9640e95adc3e4a7908bb
rebuild/conform/v4/postfix/trace-v2.cjs 5804390be453b9321955c1b498d7b5a80ee96f9b14ef701b33176a15f6ce9e2d
rebuild/m4/spec/native-carriers-errors.cjs ddcfa7d212a6291e7c84c50106813c4f9c1ead46bb11723bb505e58e423e51c7
rebuild/m4/spec/load-write-reference.cjs dfc836b34e5d48b06105fdf097db6e6154a25e145220d47569bab269ea6778df
rebuild/m4/spec/load-write-source.cjs 77bd6b7116f42b7e676473ec00cb57a13b86ec4d6daa30aa3514f90ad01a24d0
