# S9 source-custody checker static independent review
Verdict: NEEDS CORRECTION; not ready for a protected-source permission request or execution.
Reviewed frozen s9-source-custody-check.cjs before PROPOSAL.md and compared public runner clauses.
Checker SHA256: 630d8e167a7ec033686e109d37c48fb1bc30b47e39766287dab089e4adf9b10e.
Proposal SHA256: 3be85d9343bab6e2ca1f2cdce4fd6ce9daed3fc650744aae9ab06f82d6688854.
Checker is 9252 bytes, ASCII/LF, below the 10KB limit; final rehash unchanged.
Candidate fixed: 5c62cb423848b72c260552dd1f425b2a31ca04c0.
SourceBase fixed: 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f.
Comparison: candidate rebuild/lanes/b/tooling/b-package.cjs childArgv, executedClosure, parentPin.

Required correction batch
1. StageOne line120 spreads executionPins over product before validation.
   A shared key's conflicting or malformed product pin disappears, so 227 unique keys is insufficient.
   Normalize each map independently; require agreement on every overlap before forming the union.
2. Line185 requires every prospectively allowed protected file to occur in the closure.
   Permission is a maximum allowance, not a required graph membership set. Report actual subset/count.
3. existsAt line87 accepts any Git object, unlike runner existsSync plus statSync.isFile.
   A directory masks a later valid suffix then blobAt fails; symlink blobs are read as source text.
   Use exact tree-entry metadata: regular blob files only; skip directories for suffix selection.
   STOP on links/gitlinks rather than claim working-tree equivalence or follow their destinations.
   Deny/protected checks must reject case aliases consistently, retaining only five exact allowed paths.
4. repoPath passes rejected raw text to ClosedRefusal; emitPath prints it without sanitization.
   Regex-derived specifiers can contain controls/newlines or arbitrary source text, even when refused.
   Print only bounded, safely encoded validated Git metadata paths; redact all other path payloads.
   Apply the same rule to parent/refusal fields and target output; source bytes must not leak on failure.
5. childTargets omits runner CHILD_ROOTS, duplicate-flag and reporter-without-test rules.
   Its path checks also differ from childArgv's flag-order and target spelling requirements.
   Preserve exact runner childArgv target derivation/validation, with explicit stricter safety refusals.
6. Git calls do not disable replacement objects; fixed rev-parse identity alone does not prevent them.
   Use Git's no-replace-objects control for every metadata/blob read before claiming immutable custody.

What is sound and what remains limited
Built-ins only; spawnSync uses no shell, captures Git stdout/stderr, and never runs repository modules.
Unexpected exceptions become a fixed code without stack/message; no explicit writes/network/tests.
ParentPin's literal-null fallback, literal specifier regex, suffix order and 512-file refusal align.
StageOne without flag stops before protected bytes; five literal paths are its prospective allowance.
StageTwo is honestly HELD because S9.json is absent at the fixed candidate; a new head needs review.
Proposal's claim of copied Git-tree existence behavior is wrong: the runner walks working-tree files.
Document regular-file Git-snapshot scope and deliberate STOP boundaries, not general runtime equivalence.
Computed references remain outside this literal algorithm; PASS cannot prove an exhaustive runtime graph.
Neither stage runs private census or grants test execution, full S9, pin fills, seal, import or deploy.
Static review only: checker never executed; no protected file was read, hashed or traversed.
No author/worktree/ledger changes; corrections sent as one batch through PM's existing author relay.
Re-review frozen corrected bytes before asking Joe; no permission was granted by this artifact.
