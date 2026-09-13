# Existing public native-capture evidence

PM336 clause6 archive; source candidate f9e45f922bcb489d8ef4a4eded83b968356f16e4 remains unchanged.
Tested source: 8986d493058f1f6488781a105586c3177dd4f3fc.
MAPPING.json binds all 14 copied files to exact original paths, archive paths, byte counts and SHA256 values.
Every copied file is byte-identical to existing public evidence in the builder’s own .tmp/native-capture-runs/.
first/: original input manifest, TAP, empty stderr and public evidence; 9/22 passed, 13 failed.
second/: explicitly retrospective input metadata, TAP, empty stderr and public evidence; 17/22 passed, 5 failed.
third/: original input manifest, TAP, empty stderr and public evidence; 28/28 passed.
replay-evidence.json retains all source identities, actual run outcomes and guard-reversal/restoration records.
d1-static.json is the existing redacted static inspection record; it contains no historical source/value payload.
Replay/reversal implementation remains in the unchanged candidate’s committed public test; no new driver or execution.
No runtime, packages, source snapshots, native/private raw output, synthetic repositories/worktrees or unrelated scratch copied.
ER reads this author evidence only after committing and sending its independent first verdict.
This archive records author evidence; it does not confer independent acceptance or permission for a native run.
