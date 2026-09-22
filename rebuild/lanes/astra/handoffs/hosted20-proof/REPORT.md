# S9 hosted20 frozen packet, round 3 (final): builder report (claude-opus-5-5, 2026-09-22)
Status: PROPOSAL_NOT_AUTHORIZED. Nothing committed, pushed or dispatched. No real group, engine or protected module ran.
Worktree rebuild/p-s9-hosted20-proof at fe9f14b5a764efe0cc66fa0380a27b1e32d5672c. The l2 verdict was ACCEPT WITH NAMED DEBTS; D1, D2, D4 and D6 are closed.
The inventory bytes are unchanged (sha256 15042fbc...). The design, groups, HELD path, budget and all earlier controls are unchanged.

## Changes in round 3
- D3b, authorization pin and provenance:
  - The workflow now pins HOSTED20_AUTHORIZATION_SHA256 next to the inventory and runner pins, and checks all three with sha256sum. The runner also checks the authorization pin.
    The pin is required for the real inventory. For a synthetic inventory it is enforced whenever it is set.
  - AUTHORIZATION.json has an authorizedBy block: { ledger: "rebuild/DECISIONS.md", decisionsLine: <integer>, ownerQuote: "<verbatim>" }. It is null in the proposal.
    The runner STOPs with AUTHORIZED_BY_MISSING if the block is absent or null, and AUTHORIZED_BY_MALFORMED if it has the wrong keys, a bad ledger or line, or an empty or control-character quote.
    The runner does not judge the content; the PM checks it against the ledger.
  - The public receipt records the pin triple (inventory, runner, authorization sha256). It records authorizedBy as ledger and line plus the sha256 of the quote, not the quote itself.
    It also records runnerEnvironment: ImageOS, ImageVersion, `uname -a`, OS type and release, and arch.
- Pins, each checked through the PC shell on 2026-09-22. No value was invented.
  - checkout 11d5960a326750d5838078e36cf38b85af677262: `git ls-remote https://github.com/actions/checkout "refs/tags/v4*"` shows v4 and v4.4.0 at this SHA. They are lightweight tags (no ^{} lines).
  - setup-node 49933ea5288caeca8642d1e84afbd3f7d6820020: re-verified the same way; v4 and v4.4.0 are at this SHA.
  - Node 22.23.2: the newest v22.x in https://nodejs.org/dist/index.json (2026-07-28, LTS Jod). The workflow also asserts `node --version`.
  - pnpm 9.15.9: newest 9.x on https://registry.npmjs.org/pnpm, where dist-tag latest-9 is 9.15.9 (integrity sha512-aARhQYk8...lMQ==). The workflow also asserts `pnpm --version`.
  - Accepted limitation: the ubuntu-24.04 hosted image cannot be pinned. Its identity is recorded in the receipt instead. No OPEN_PINS remain.
- Self-test (SELFTEST.cjs.txt): 62 of 62 checks PASS (52 before). The new checks:
  - A3: the real packet with inventory and runner pinned but no authorization pin is refused (AUTHORIZATION_SHA256_NOT_PINNED).
  - A5: with all three pins, the real authorization is still refused (NOT_AUTHORIZED).
  - A6: a forged authorization that grants everything, swapped in behind the reviewed pins, is refused by the pin.
  - F11 and F12: a swapped synthetic authorization is refused, and a matching pinned one passes.
  - F13 to F15: authorizedBy missing, null or malformed (5 variants) is refused.
  - H14 to H16: the receipt carries the pin triple, the authorizedBy line with only a hash of the quote, and the runner environment.
- Search hygiene: from now on I exclude any path whose name matches a forbidden glob, even a public file. No search in round 3 touched such a path.
  The round-2 soak.yml slip is self-disclosed and left for the PM to record.

## For Joe (unchanged)
The proof machine can list the NAMES and blob IDs of forbidden files (ledger, conform/private, src/history.js, soak-stub; 42 names at current). Their CONTENTS are never downloaded or written.

## Group status
Groups 1-17, 19 and 20 are INVENTORIED_NEEDS_REVIEW_AND_OWNER_PERMISSION, with authorization PENDING. Group 18, b-lom, is SPLIT_REQUIRED and HELD because of the soak-stub walk.

## Open questions
1. Is rebuild/m3/soak-stub the protected soak? If not, b-lom can be re-inventoried instead of HELD.
2. rebuild.yml runs the w6 install with scripts on; this packet forces --ignore-scripts on all three installs. If esbuild fails as a result, it shows as RED.
3. Materialization is subtree-based (940 public files). Should it be minimized?
4. GitHub serving blob IDs by `want`, and old commits by SHA, is unmeasured on hosted. The reviewer confirmed all 7 commits are reachable from origin refs.
5. The self-test ran on Windows (Git 2.55, Node 24), not hosted Ubuntu. It is not OS network isolation.
6. HELD_INCOMPLETE proves 19 groups, not 20. Who approves that as enough?
7. Authorization order: Joe's words go in DECISIONS, then AUTHORIZATION.json is filled, then its sha256 is pinned in the workflow, then the PM verifies the line and quote against the ledger.

## Owner permissions for the real run (none granted now)
- EXECUTE_PROTECTED_ENGINE_COMPOSITION: the 19 authorized groups. It includes hydrating and writing the protected-five blobs, current and historical.
- CONSUME_PROTECTED_E_SEED_OR_FROZEN_RECORD_VALUES: 18 authorized groups (all except m4-import).
- READ_CURRENT_AND_FE516C1_SRC_APP_JSX: s9-sup-source-carriers only (blob f98671d823f0d8cd83e730cdd930afe5f5e7b628).
- Operational: set the three workflow pins, fill AUTHORIZATION.json including authorizedBy, put the packet on a proof branch, and dispatch once.

## sha256
- AUTHORIZATION.json f0250b221fd00accaf7a047e878e67a7b9459b6096fa0018d3440c51bc5e9c2c
- HOSTED20-INVENTORY.json 15042fbcd813ec5b4de032f05771020d19e1839213438ba605a26c0ae32b2a22 (unchanged)
- HOSTED20-RUNNER.cjs.txt 7a2f6f2bf78479597afa5e6031e9911e474bc0c889b4c7feaa669f0c9ab52b99
- HOSTED20-WORKFLOW.yml.txt 84ec3ba472e23bc246be8c1ae68d2b85f2b88e43a8503b4b528b7b556a8f2ca4
- SELFTEST.cjs.txt ee74bc678a34a2aa7704f4ae00e3aff582b5c2f22540d635d086b57b5a66575f
- SELFTEST-RESULT.json 491681f14e6c2e7ad92cb94b3ac527004a565d44bf458c497c42d5b6ece2d35d
- REPORT.md: this file's hash is in the PM summary.
