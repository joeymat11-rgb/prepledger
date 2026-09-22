# S9 source-custody checker static recheck
Verdict: one small normalization correction remains; no execution or permission granted.
Checker SHA256: 98f79d60125c8a4f690fbbc71b40519a7a0cf0bc7162c817a24f3d66f8472cfe.
Proposal SHA256: 310b9f3d8a513a8c60371d8d2abdc53ba35802a8d2bab74a2043cb8d706c33d5.
Both frozen files read in full, checker first; actual public runner clauses compared.
Candidate5c62cb4 and SourceBase0cd07be remain fixed; S9.json remains absent.

Six prior findings
Product/executionPins normalize separately and conflicting shared values refuse before union.
Closure no longer requires all five allowed protected paths; it reports the actual subset.
Exact Git entry names, regular blob modes, directory skip and link/gitlink STOP replace cat-file -e.
Protected aliases and forbidden patterns are checked case-insensitively before blob reads.
Invalid raw specifiers are dropped; retained path output is bounded, encoded and metadata-derived.
Child roots, prohibited flags, duplicate/order/reporter rules and target checks match runner semantics,
with explicit additional safe-name and Git regular-file restrictions.
Git replacement objects are disabled on every call; stdout/stderr remain captured.
One read-only public-file metadata query verified the exact ls-tree literal syntax; no checker ran.

Remaining correction
normalizedPins still uses const out = {} followed by out[file] assignment.
The valid own key __proto__ therefore invokes the inherited setter and vanishes for a string hash.
Use Object.create(null), Object.fromEntries or Map so every parsed own path is preserved.
This is a static normalization mismatch, not a claimed failure measured on the fixed parent artifact.
The correction is within the existing overlap/key-preservation concern, not a new parser expansion.

Scope and size
Checker is 13023 bytes, above the original 10KB ceiling; latest clarity-first steering is recorded.
Do not minify or weaken safety to reduce size; PM must disposition this explicit size variance.
Git regular-file snapshot scope, suffix order and 512-file refusal are stated honestly.
Computed references remain outside the literal walk; no runtime-complete closure is claimed.
Stage1 without the flag stops before protected bytes; only five exact paths are prospectively allowed.
Even authorized Stage1 success would leave absent-spec Stage2 HELD and overall verification incomplete.
No source checker/module/test execution, protected read/hash/traversal, or author/worktree write.
No private census, full S9, source-export runtime, seal, import or deploy authority follows.
Return frozen corrected hash for the final one-line recheck before a narrow owner permission request.
