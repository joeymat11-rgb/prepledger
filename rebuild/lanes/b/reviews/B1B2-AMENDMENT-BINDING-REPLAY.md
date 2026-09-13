# Replaying the independent PM316 evidence

This is a public tooling replay recipe, not additional execution authority. Keep PM316's input and runtime restrictions. The immutable candidate is083bd47efc16d02105b3ebe2912bcf5aa4a5f240. Use an owned Node22.23.2 with the SHA256 recorded in the evidence, no injected Node preload/coverage settings, and TZ America/New_York.

Create a new owned no-checkout worktree under work/pm-caretaker/er-b1b2-amendment-binding in an isolated clone/root. Initialize and verify its **full** index against candidate tree390990830a73bbfb6e5022da3cccc58867fe6de2, with explicit non-cone sparse patterns for NEXT.md/AGENTS.md; apply those patterns with read-tree -mu HEAD. Do not use an empty index or broad checkout. Read the current rebuild instructions and commissioned bars.

The committed EVIDENCE.json `publicInputs.files` is the exact126-path public materialization list and per-path byte/hash record. Hydrate only those exact candidate Git paths after checking the existing PM allowance, retaining all other full-index entries as skip-worktree. The list has no seed/private/history/soak data; many listed public source files are hash-only inputs, not executable dependencies. Original author report/README remain absent before the first verdict. Historical and shared Git objects cited by the public tests must be available, but no dependency tree is borrowed from another actor.

Copy only the five companion reviewer .cjs files from this review commit, never its candidate ancestry. Create owned `.tmp/er-binding/`; restore `publicInputs` as `initial-public-inputs.json`, `initialization` as `initialization.json`, and `inputReconciliation` as `input-reconciliation.json` from EVIDENCE.json. The old control driver text is archived under `firstControlDriver.source`; write it exactly to `control-driver-before-validator-correction.cjs` only if regenerating the aggregate evidence. It is provenance, not a recommended runner.

From that fresh candidate tree, execute with the owned Node:

1. `rebuild/lanes/b/reviews/B1B2-AMENDMENT-BINDING-SOURCE.cjs` — verify candidate/source/input closure and emit source-preflight.json. Its fixed directory-suffix assertion is deliberate.
2. `rebuild/lanes/b/reviews/B1B2-AMENDMENT-BINDING-RUN.cjs cohort` — only the exact nine public entries, their original argument order and TAP reporter. Expect331/331, no skipped/cancelled cases.
3. `rebuild/lanes/b/reviews/B1B2-AMENDMENT-BINDING-RUN.cjs independent` — seven original-source refusal controls. Expect7/7.
4. `rebuild/lanes/b/reviews/B1B2-AMENDMENT-BINDING-CONTROLS.cjs` — seven separate source reversals and seven fresh restored fixtures. Each reversed child must exit1 at its own named missing-refusal assertion; each restored child must exit0. The driver checks this, so its own successful exit is0. A previously completed identical child may be reused only after exact source/output-hash checks; no test-name filter hides skipped cases.
5. `rebuild/lanes/b/reviews/B1B2-AMENDMENT-BINDING-EVIDENCE.cjs` — validate and pack the actual own results. New timestamps, synthetic commit/fixture identities and output hashes will differ; the recorded original outputs remain immutable provenance.

RUN stores raw child stdout/stderr and status before restoration checks. The annex restores exact fixture source bytes in finally, then removes only its own verified synthetic fixture directories. Source guards are changed only in those synthetic runners; the real candidate remains byte-identical. Receipt and reviewed-source controls are explicitly isolated actual code legs, and whole unsealed envelope paths can return ABSENT. Nothing here runs package main, native/frozen/private/full/currentCI or device workflows.
