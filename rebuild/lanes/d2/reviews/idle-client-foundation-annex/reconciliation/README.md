# D2 PM318 reconciliation replay

Run only after the independent review is committed and sent. The first review remains unchanged at00c6237a2169aa6da2b3348c6b28ac8e821dbf9d.

The immutable author archive is b7dc5a041cdcfdc9488b74ac0d84a28dcd8aa661 under rebuild/lanes/e/reviews/idle-client-foundation-evidence/. It is author evidence, not D2 execution.

In an explicitly authorized own candidate worktree, copy read-author.mjs, verify-author-archive.mjs and reconcile-evidence.mjs into .tmp. Use owned verified Node22.23.2. Run in that order. They read only the pinned public Git blobs/map and licensed candidate source plus the owned D2 inventories already in .tmp; they never execute author source or inspect another lane's filesystem. Acquisition verifies the pinned report/index/map, exact39-path evidence-only diff and all37 mapped bytes; analysis checks original RED output equality, unchanged test block, source identities, loader/dependency agreement and failed/restored author counts.

first-read.json records the temporal boundary. archive-verification.json records all37 copied files, their hashes and RED report identity. Reconciliation JSON distinguishes author evidence from D2 experiments and states remaining scope limits. Raw author reports/TAP were read from Git into owned ignored scratch and are referenced by immutable hash rather than duplicated here.
