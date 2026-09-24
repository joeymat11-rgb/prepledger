# C-UI Linux witness workflow independent rereview L2
Reviewer: Astra, separate from Sol author and PM integrator; static scope only.
VERDICT: ACCEPT the scoped preflight correction; no hosted proof or C-UI acceptance.
Candidate: cf14982050a8169c7f4848ec0bf1f69c2bb5759f.
Workflow SHA256: f3b3061bef03e0b8c2fb4b6782d617789bc98f585d6ddbcf92a6b911c838669f.
Author report SHA256: aa8d214711accf7265cd7f4759ef9343c66a3a04806b45314476a1033b367c52.
Both frozen files were read whole and hashed; explicit two-path diff from published 4c744e4 was reviewed.
Run 35662825212 is a reported terminal preflight failure before dependency install or either gate.
No Linux rendering pass is credited; reviewer did not inspect raw remote logs or execute this workflow.
The prior L1 static acceptance missed two checkout framing assumptions; this correction closes both.
An absent cone key now defaults to false; invalid config/read failure still refuses explicitly.
Sparse enablement separately must be true, so default false cannot silently disable sparse checking.
The direct mapfile read permits empty framing lines but requires exactly one nonempty pattern.
That sole value must exactly equal the rooted approved-pack pattern; duplicates and other patterns refuse.
Whitespace-only lines are nonempty and refuse; leading/trailing blank LF lines do not broaden checkout.
Pattern read failure is fatal before any pack helper; named constant diagnostics disclose no file contents.
Exact HEAD, populated-file footprint, forbidden-root existence checks and pre-hash link refusal remain.
Tracked and actual file digests/counts still detect source/reference additions, removals and changes.
Only quality/run is excluded from actual footprint; all substantive failures propagate before echo.
The post-custody phase, both-gates-even-red behavior and final missing/red/drift enforcement are unchanged.
Read-only permissions, no persisted credentials, pinned actions/candidate/dependencies and narrow trigger remain.
Seven exact artifact paths, seven-day retention, no accept flag and no baseline reset remain unchanged.
Shell/YAML sequencing and quoting were read; this rereview does not claim an executed Bash fixture.
PM may publish this exact pair for another hosted witness; eventual run/job and artifacts still need review.
Linux rendering, Claude, whole-rebuild CI, seal/integration and final C-UI judgment remain separate gates.

