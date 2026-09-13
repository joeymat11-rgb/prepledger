# Executable annex: independent plan-edit review

Candidate `6b3465efba4a9c4de1aace60ae3dc05b28b6e71d`. Reviewer source is adjacent `PLAN-EDIT-REVIEW-ANNEX.mjs`; it imports the actual same-tree companion, T2 builder, local installation and encrypted W6 repository. Every fixture is newly authored synthetic data in an isolated fake IndexedDB factory. No source override or fake durable acknowledgment is used.

From an authorized public worktree of that candidate with the annex files present, install the tracked W5/W6 pnpm locks with development dependencies (`pnpm install --frozen-lockfile --prod=false --ignore-scripts` in each package). No root install or lock conversion is needed. Create the worktree's `.tmp` directory for logs/browser scratch. Never use another lane's worktree.

Run from that worktree root:

```text
node --test --test-reporter=tap rebuild/lanes/astra/reviews/PLAN-EDIT-REVIEW-ANNEX.mjs
node --test --test-reporter=tap --test-name-pattern=I08 rebuild/lanes/astra/reviews/PLAN-EDIT-REVIEW-ANNEX.mjs
node --test --test-reporter=tap --test-name-pattern=I09 rebuild/lanes/astra/reviews/PLAN-EDIT-REVIEW-ANNEX.mjs
node --test --test-reporter=tap --test-name-pattern=I10 rebuild/lanes/astra/reviews/PLAN-EDIT-REVIEW-ANNEX.mjs
node rebuild/lanes/astra/reviews/PLAN-EDIT-BROWSER-IMPORT.mjs
```

At the reviewed head, the full independent suite exits 1: 16 tests, 13 pass, three assertion failures (I08/I09/I10), zero skipped or cancelled. Each named failure runs independently. The browser command builds current bytes before loading the exported module in installed Edge, uses an ephemeral local port, serves only synthetic HTML and that bundle, and closes both browser and server. It proves module import only.

| Witness | Boundary and expected result | Observed candidate result |
| --- | --- | --- |
| I08 / R1 | Save once, close the real local installation, observe read refusal, retry same review: refusal must propagate | Cached acknowledged true |
| I09 / R1 | Save 3 sets, use actual T2 producer/commit to tombstone that op, verify next-day read says tombstoned and 2 sets, retry same review: inactive-intent refusal | Cached acknowledged true with original edit |
| I10 / R2 | After a real save, inject only `{op_id}` into encrypted rejection collection without any disposition proof; operation bytes unchanged: refuse unproved status | Read true, status rejected, 2 sets |
| I11 control | Change an existing plan member without updating its HMAC | Read refused |
| I13 control | Durably tombstone an ancestor of a second edit | Read refused as PLAN_EDIT_BASIS_INVALIDATED; both plan operations retained |

I01–I07/I12/I14–I16 cover concurrent idempotency, cancel/close in encryption, date rollover, exact-intent recovery, old equal-value false-commit defense, unrelated-exercise stale review, factual-operation/outbox retention, dated rename/replacement and complete operation basis. They pass on the candidate and must remain passing after fixes.

I10 deliberately writes a controlled malformed semantic record through the repository's real encryption/commit API. It does not claim that a supported UI can author a rejection or that an external actor can access the device key. The brief's qualified-inactive-state and authenticated-read boundaries are the asserted contract.

Baseline commands also executed on the exact candidate:

```text
node --test --test-reporter=tap rebuild/lanes/d/plan-edit/model.test.cjs rebuild/lanes/d/plan-edit/durable-host.test.mjs rebuild/lanes/d/plan-edit/browser-build.test.mjs
node rebuild/lanes/d/plan-edit/model-mutants.cjs
node rebuild/lanes/d/plan-edit/host-mutants.mjs
```

Results: 46/46 baseline, model 9/9 and host 4/4 assertion mutants killed. Raw synthetic logs remain in the review worktree's `.tmp`; no raw logs or private data are published. These commands do not supply C's actual consumer proof, B's package/private admission, both-OS CI or any owner phone result.
