# D2 PM334 report-last reconciliation custody

First verdict561d3b2779decaaa7f5b8e8bca21f1cbdd9a08ad was committed/sent before these reads. R1 remains open; no candidate fix was made.

The author evidence is immutable archive4c355b2751e14f281bd5c529a67d2492675dbaca under rebuild/lanes/e/reviews/frozen-build-setup-evidence/. Exact17-file byte/hash verification and report identity are preserved in archive-verification.json and first-read.json. Raw author evidence remains at that commit, not duplicated or executed here.

For authorized report-last replay in an own candidate worktree, copy read-author.mjs, verify-author.mjs and reconcile-author.mjs into .tmp and run them in that order with owned Node22.23.2. They read exact public Git blobs into owned scratch, verify pins/ancestry/archive scope and compare inventories and outcomes against the owned first-phase evidence. They never run the archived E setup/reversal source or touch E's filesystem. Reconciliation JSON distinguishes author setup/product failures, author reversals, D2's independent failures and still-open R1.

FILES.json hashes each other reconciliation artifact. These files add no execution, product acceptance, historical-input access, integration or release authority.
