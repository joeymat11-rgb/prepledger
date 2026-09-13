# Executable annex: plan-edit fix review

Reviewed head `74920fb0c7658c0bbd8d47388e23d0e8f98508f2`. The original sixteen-test `PLAN-EDIT-REVIEW-ANNEX.mjs` is copied byte-for-byte from prior review `0006409`: SHA256 `5662293f8c6f976c9ebbb1a8f19dbac4534744b085ac2ff1537cd76644732c7e`. It previously produced 13 passes and three assertion failures on product `6b3465e`; it now produces **16/16 PASS**. No prior witness was weakened or skipped.

`PLAN-EDIT-REVIEW-R1-ANNEX.mjs` adds six independent checks of the changed async boundaries. It reuses the reviewer's synthetic local-installation scaffold, adds a hold on the real repository `load()` call, and loads the unmodified same-tree product. It does not replace a product source, committer, acknowledgment or authentication result.

| New check | Witness | Result |
| --- | --- | --- |
| R1-A ×3 | After a successful Save, hold retry's actual disk reread; cancel review, close host or close installation before releasing it | All refuse; readable durable generation unchanged |
| R1-B | Actually commit, lose reply, hold reconciliation reread, then cancel | No late acknowledgment; original durable edit remains readable from a new host |
| R1-C | Corrupt one stored operation without updating its HMAC after a successful Save | Cached retry refuses and does not alter the damaged generation |
| R1-D | Durably tombstone a saved intent, then queue eight retries of its old review | All refuse; no duplicate, restoration or generation change |

All **6/6 PASS**, zero skipped or cancelled. The actual-commit retention assertion distinguishes suppressing a late UI result from claiming that a completed historical write never happened.

Use an authorized public checkout of the exact candidate with these review files. Install unchanged W5/W6 tracked pnpm locks with `pnpm install --frozen-lockfile --prod=false --ignore-scripts` in each package. Create the worktree's `.tmp` for logs/browser scratch. Commands run from its root:

```text
node --test --test-reporter=tap rebuild/lanes/astra/reviews/PLAN-EDIT-REVIEW-ANNEX.mjs
node --test --test-reporter=tap rebuild/lanes/astra/reviews/PLAN-EDIT-REVIEW-R1-ANNEX.mjs
node --test --test-reporter=tap rebuild/lanes/d/plan-edit/model.test.cjs rebuild/lanes/d/plan-edit/durable-host.test.mjs rebuild/lanes/d/plan-edit/browser-build.test.mjs
node rebuild/lanes/d/plan-edit/model-mutants.cjs
node rebuild/lanes/d/plan-edit/host-mutants.mjs
node rebuild/lanes/astra/reviews/PLAN-EDIT-BROWSER-IMPORT.mjs
```

Results in that order: 16/16, 6/6, 50/50, model10/10 and host5/5 selected assertion kills, fresh Edge module import PASS. Browser import compiles current bytes, records actual Git HEAD and bundle hash, serves only synthetic HTML/the bundle on an ephemeral local port, and closes browser/server. It does not call the editor, perform a browser Save or substitute for PE12/phone evidence.

Synthetic logs remain in the reviewer's `.tmp`. No raw logs, private fixture or personal-history data are published. This annex supplies no B cumulative/private receipt, Ubuntu CI or owner phone result.
