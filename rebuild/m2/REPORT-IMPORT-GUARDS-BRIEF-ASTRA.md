# Import-guard repair brief — ASTRA

2026-09-06. Documentation proposal on `rebuild/m2-import-guards-brief`, from integration `3e02e1bf9bf47267449b3a402e42089b49222b6b`. No engine repair or independent acceptance of this brief is claimed.

## 1. What and why

`BRIEF-IMPORT-GUARDS.md` specifies the first post-extraction repair package: D33, D34 and D35. These protect recorded identities and set slots, distinguish edited records from the authored starter, and return newer-schema objects untouched. The owner's “Batch A and all seven recommended choices” and exact M2-PACK v3 correspondence are committed in `402ab9ef2b57d0f0b1d40425e130e228c69f752c`. Implementation also requires acceptance of this behavior brief and its precise expected changes.

The original frozen app, audit and goldens remain historical evidence. The accepted post-fix infrastructure (PR37, `01eff99de9ad9a4c8ff152b546f945785704837a`, integrated into this base) provides separate reviewed expectations for a repaired candidate. This brief supplies the behavior missing from that infrastructure; it does not turn its pending package into a passed repair.

## 2. Evidence and challenge

Read the accepted register, owner pack, post-fix gate contract and actual engine/host source. A same-family reviewer independently checked the proposed correction exceptions and the real save/import/sync call sites. A filed skip or unskip can legitimately have an op-less receipt; a strike has explicit payload and matching operation receipt. A load-only amendment cannot explain removed set slots.

An old correction stamp without an operation history can make the frozen merge discard an unrelated lift. The proposed guard refuses saving that loss while leaving the merge and existing explicit import/reset paths unchanged. No ratified rule requiring a guard exemption for that ambiguous loss was found. This is an implementation of approved D33 for Cowork to challenge, not a new training rule or a claim that imported local evidence is cryptographically authentic.

Independent review C1–C6 required six corrections: compare pt too; preserve ambiguous-body multiplicity while permitting additions; define occupied slots precisely; disclose repeated guard refusal and the unguarded restore host; protect skipped placements; and make getter checks reach the real engine. Revision2 incorporates each. Skipped records are actual objects with id, verified in the frozen source.

Additional executed harness probes found Error and TypeError with the same message currently compare equal, and Object.prototype.toString can invoke a Symbol.toStringTag getter during tracing. The revised PACKAGE descriptor profile must close both. Existing replacement-only delta pointers also need explicitly reviewed absent/present cells for future-schema container preservation; this is scoped test work, not a product expansion.

Cowork independently accepted C1–C6 at96e298f and reproduced both trace defects. Revision3 adds its confirmed non-circular acceptance mechanism: an exact-byte substantive artifact, a separate closed receipt envelope, actual Git/ancestry checks, strict pending/accepted states and effective refusal tests. Cowork additionally demonstrated v1 can treat its own NOT ACCEPTED line as acceptance because it searches for the substring ACCEPTED; the successor requires a dedicated exact terminal verdict. Old owner/contract receipts keep their exact historical mappings. The PR37 post-integration false-stale check was independently reproduced and has an explicit ancestry correction. These seven mechanism conditions and the hand-filed incomplete-unskip negative are the only new revision3 requirements; product scope remains five changes.

Root executed `PRISTINE FOUR-FAMILY INCLUDING-PT PASS` at four injected dates with actual migrate/settle and unmodified SEED. Under AGENTS preparation, the frozen private blob was regenerated locally and only the requested ambiguous-session-entry predicate ran: **NOT TRIGGERED**. No private values, counts, dates, hashes or receipt prose were exposed or committed. Full private gates remain unrun for this documentation proposal.

## 3. Scope and verification

This PR adds exactly the brief and this report under `rebuild/m2/`. It changes no product, test, queue, ledger, dependency, lockfile, frozen app or seeded soak. Executed `scope-package.mjs`: `FROZEN-PATHS PASS — pinned authorized base; committed and working copy`; `OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified`; final `SCOPE-FREEZE PENDING`. Whitespace and two-file inventory passed. The initial head b4b12f3 passed both OS CI jobs and strict; revision2 is rechecked separately. Reproduction requires a real node_modules directory, not a symlink. Full repair, private port and phone gates are not executed or claimed by this proposal.

## 4. Seams and uncertainties

Every repair must retain the other 42 defect witnesses and queued non-D obligations. Ambiguous legacy shapes must receive explicit limited coverage or a demonstrated blocking case; no fabricated correction identity, silent receipt rewrite or global golden regeneration is permitted. The exact source/output pins will be produced from the implemented candidate and independently reviewed before acceptance; this brief cannot precompute repaired source hashes.

The register's 13 engineering hours for this package are an estimate, not measured agent speed. Additional PACKAGE infrastructure is estimated at18–26 engineering hours pending implementation, separately from those13. An unexpected full-oracle or second-gate difference requires a specific reviewed successor expectation. M2 closes only after all required dispositions, repairs and the separately accepted suite-v4 tranche.

## 5. NEXT

Cowork reviews this exact brief. Once the owner-ruling record and behavior acceptance are committed, `M2-FIX` may claim the first package on `rebuild/m2-import-guards`; the builder opens one PR and does not merge. Root retains this documentation claim for review corrections. W6 continues on its existing separate claim. No duplicate dispatch or further owner approval of the same batch is required.

Preparation/check intervals: 14:37–14:46 UTC initial publication; revisions2–3 began14:56 UTC, including source checks, synthetic probes, the verdict-only private predicate and independent review corrections. Final revision commit records completion time. Earlier draft research is excluded. No separate token budget was requested or measured for this documentation slice.
