# S9 hosted20: authorization and activation (builder claude-opus-5-5, 2026-09-23)
Base: rebuild/p-s9-hosted20-proof at 07ea6f8. All changes uncommitted; nothing committed, pushed or dispatched; no real group ran.
Grant: origin/rebuild/t2-client-core rebuild/DECISIONS.md:784 (owner: "I approve the hosted 19-group run.") and :785 (PM reading: 19 groups as 07ea6f8 scopes them, b-lom HELD).
## Diff
- AUTHORIZATION.json: status REVIEWED_AND_AUTHORIZED, three grants (EXECUTE, CONSUME, READ_CURRENT_AND_FE516C1_SRC_APP_JSX), 19 groups AUTHORIZED, b-lom HELD, authorizedBy {rebuild/DECISIONS.md, 784, "I approve the hosted 19-group run."}.
  The inventory's per-group needs: EXECUTE for 19, CONSUME for 18 (not m4-import), APP_JSX for s9-sup-source-carriers only. SELFTEST A5 checks all of this.
- Scope note (unchanged design, reviewed l1-l3): grants are one list, and with APP_JSX granted src/app.jsx is materialized into the one shared island, so every group's island contains it.
- New .github/workflows/s9-hosted20-proof.yml, byte-identical to HOSTED20-WORKFLOW.yml.txt. Changes from the reviewed text:
  - The only trigger is `on: push: branches: [rebuild/p-s9-hosted20-run]`: no workflow_dispatch, pull_request, schedule, tag or paths filter.
  - Job `if:` requires a push event and ref refs/heads/rebuild/p-s9-hosted20-run, and a first step runs `test` on GITHUB_EVENT_NAME, GITHUB_REF and GITHUB_REF_TYPE. Concurrency cancel-in-progress stays false.
  - The three pins are set and the controls path moved; every other step is byte-for-byte unchanged. PyYAML 6.0.3, run on a sha-matched copy, parses it as one job with 9 steps.
- The controls live in handoffs/hosted20-proof/run/ (runner .cjs, inventory, authorization), byte-identical to the packet copies.
  - Not in rebuild/lanes/b/tooling: b-package.cjs fidelity() (:2598) diffs that directory, and a new file there makes the rebuild.yml package step fail with UNLISTED-SOURCE-CHANGE.
- SELFTEST.cjs.txt round 4: optional 6th argument (the workflow); A5 rewritten; W1, W2, A7, A8 new. SELFTEST-RESULT.json regenerated. REPORT.md (round 3) left as history.
## Pins (workflow env; the runner re-checks all three)
HOSTED20_INVENTORY_SHA256 15042fbcd813ec5b4de032f05771020d19e1839213438ba605a26c0ae32b2a22 (bytes unchanged)
HOSTED20_RUNNER_SHA256 7a2f6f2bf78479597afa5e6031e9911e474bc0c889b4c7feaa669f0c9ab52b99 (bytes unchanged)
HOSTED20_AUTHORIZATION_SHA256 0c60030a5902ccd0396a7d8cc684c35897612464a2e601c7b237c05dc9f9cca5
## SELFTEST (synthetic, runtime lock, Windows Git 2.55 / Node 24.19)
- Red-first: the round-3 SELFTEST against the new authorization gave 61 of 62; A5 (expects NOT_AUTHORIZED) was false.
- Round 4: 66 of 66 PASS, exit 0, with the packet copies. 66 of 66 PASS, exit 0, with the run/ copies and the .github workflow.
- W1: the workflow's pins equal the final bytes. A5: the load checks accept the real authorization under those pins exactly as granted.
- A1-A3, A6: the real packet is refused without a pin or with swapped bytes. A7: no APP_JSX grant gives OWNER_PERMISSION_MISSING. A8: b-lom AUTHORIZED gives SPLIT_GROUP_NOT_HELD.
## sha256 of changed or new files
- 0c60030a5902ccd0396a7d8cc684c35897612464a2e601c7b237c05dc9f9cca5: AUTHORIZATION.json and run/s9-hosted20-authorization.json.
- ea40e27a2829ca8b395161cf6d2f15a53e2aef0cefbd65fbfa7a3ed1bcf77a93: HOSTED20-WORKFLOW.yml.txt and .github/workflows/s9-hosted20-proof.yml.
- e78a8c336c7194c7b9dfa121f896ab8d0c3ebd7d41ed4088bdee5010db2bd57c: SELFTEST.cjs.txt. 78ef0ce66d9bd79d2ebc61641978973fd52cf9a80dfa9bc473f72ca35ebd8346: SELFTEST-RESULT.json.
- run/s9-hosted20-runner.cjs = 7a2f6f2b... and run/s9-hosted20-inventory.json = 15042fbc... (copies). This report's hash is in the PM summary.
## Other workflows on a push to rebuild/p-s9-hosted20-run (static reads)
- They run as on any rebuild/** push: deploy.yml "pipeline" (suite, then a Netlify DRAFT preview, never production), rebuild.yml and shared-preflight.yml. slice-host.yml (rebuild/t2-client-core only) and prod-check.yml (schedule or dispatch) do not run.
- The new files do not affect them. No test or script lists .github/workflows (each reads named files only), and no new path is under a b-package CHILD_ROOT, the fidelity scope or the coach test glob.
- No new path is a key in the chain's acceptance-s7 or acceptance-s8 artifact (0 of 271 and 0 of 295), so the fence is unaffected.
- check.mjs secretScan finds no token-shaped string, the site manifest excludes .github/ and rebuild/, and shared-preflight reads only its fixed allowlist.
- Not verified: soak.yml, which the job rules forbid reading. The PM must check its triggers.
## The push the PM must do (once)
- Commit these changes onto rebuild/p-s9-hosted20-proof (parent 07ea6f8) as commit X. Then `git push origin X:refs/heads/rebuild/p-s9-hosted20-run` (a new branch). Every push to it is a new run, so never re-push.
- Pushing X to rebuild/p-s9-hosted20-proof is optional and does not start the proof. The best expected verdict is HELD_INCOMPLETE (exit 2, job red by design) because b-lom is held.
