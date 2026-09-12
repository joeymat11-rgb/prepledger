# P3 PREVIEW GUARD v1.0, proposed by Lane D2

Proposal for the PM's named judgment, not implementation or authority acceptance. Dispatch: PM REQUESTS 2026-09-12 17:49; DECISIONS:112(3), :116(5), :159. Source base f40d27b. P3 is the frozen-app deployment workflow guard, not a new banner inside Earned.

## Outcome
A push to an Earned rebuild branch runs its checks without publishing a misleading draft of the frozen app to the legacy Netlify site. The real Earned slice continues through its separate host workflow. Main production and genuine legacy-app branch previews keep their existing test dependency.

## READ-LIST
- .github/workflows/deploy.yml:18, :37, :54, :157: events, suite, production and legacy draft job. The preview condition currently admits every non-main, non-PR ref.
- .github/workflows/slice-host.yml:27, :32, :55, :90, :117: the separate Earned slice deployment and its explicit branch/site guards.
- scripts/check.mjs:218: YAML parsing and production-needs-test checks; this existing gate does not establish the preview policy proposed here.
- rebuild/DECISIONS.md:112(3): PR 51 refused as-is; the preview guard is a PM-owned .github item after B-NTC. Reuse no void authority lines from that PR.
- rebuild/DECISIONS.md:101, :116(5), :144: separate slice host, P3 queue and B-NTC integration. :173's suite-enumeration dispatch does not silently assign deploy.yml to lane C.

## Contract and exact operational copy
Proposed namespace rule, INVENTED for PM approval: a branch whose full ref starts with `refs/heads/rebuild/` never runs the legacy preview job. Match the complete prefix, not a substring; `refs/heads/fix/rebuild-label` remains an ordinary legacy branch. This does not claim arbitrary branches outside that namespace contain no Earned work.
Keep the suite running on the existing events. Gate the preview job itself, before runner checkout or credential use, with the conjunction: branch ref; not main; not pull_request; not rebuild namespace. A failed/cancelled required suite still prevents the preview through needs:test. Do not add always(). Tags or missing refs are ineligible. Existing production condition, production steps, site selection, draft=true and all slice-host bytes remain unchanged.
Proposed exact job name remains `preview`; no new athlete-facing copy. GitHub's skipped job is sufficient feedback. If a human-readable explanation is added to documentation, use: "Rebuild branches use the Earned slice host. The legacy preview is skipped."
No path-based heuristic, checkout of another branch, new secret, credential output, network probe or deploy is needed to establish this guard. Do not import PR 51's unrelated changes.

## States to demonstrate
| Event/ref | Required outcome |
| --- | --- |
| push main | Existing suite/production behavior; preview skipped |
| push rebuild/t2-client-core or rebuild/lane-c-example | Suite runs; legacy preview skipped |
| workflow_dispatch on a rebuild branch | Legacy preview skipped |
| push or dispatch on fix/example | Legacy preview eligible only after suite success |
| pull_request, including a rebuild head targeting main | Suite runs; both deploy jobs ineligible |
| tag, empty or malformed/non-branch ref | Preview skipped |

## Executable acceptance bar
IDs and example refs below are INVENTED test cases, not measured counts.
| Cell | Proof required on the candidate |
| --- | --- |
| P3-01 | Parse actual deploy.yml as YAML; assert preview needs test and evaluate its actual expression against every row above. A duplicated policy function disconnected from YAML is insufficient. |
| P3-02 | Add prefix boundary cases rebuild/, rebuild/lane-d2-a, rebuilding/a, fix/rebuild-label and mixed case; record the explicitly case-sensitive policy. The first pair skips, the latter three retain ordinary branch behavior. |
| P3-03 | Simulate success/failure/cancelled/skipped required suite; only success can make an otherwise eligible preview run. No event or ref bypasses needs:test. |
| P3-04 | Prove production job, slice-host.yml, secret names, site selection and draft=true bytes are unchanged. Any additional workflow edit is listed separately for PM custody approval. |
| P3-05 | Execute mutants: remove namespace exclusion; negate it; use contains(ref,'rebuild'); remove PR exclusion; remove branch-only check; drop needs:test. Each is caught by tests reading the mutated workflow. |
| P3-06 | New proposed command `node --test rebuild/slice/test/preview-guard.test.cjs` passes on Windows and Ubuntu. PM names its CI home explicitly; no glob or undocumented future registration claim. |
| P3-07 | Rebuild-branch push at the exact head has suite success and preview SKIPPED in GitHub's actual run. Report run ID/head/job conclusions only. Do not trigger a main or ordinary-branch deployment merely to test the truth table. |
| P3-08 | Independent cross-model review runs the table and mutants before reading the builder report. No raw log/secret output, deploy or acceptance line from D2. |

## Custody and handoff
| Files | Owner / rule |
| --- | --- |
| .github/workflows/deploy.yml; proposed rebuild/slice/test/preview-guard.test.cjs; P3 report | PM-owned workflow builder, expressly assigned by PM under :112(3) |
| CI registration outside deploy.yml | PM names the file/owner and coordinates any artifact pin; this proposal grants no exception |
| today/**, engine, client, m4, frozen app, private data, other deployment workflows | No changes |
| This brief | D2 only; PM judges, another family reviews any Astra-authored implementation |

Size estimate: SMALL, one job condition plus focused tests and CI registration; INVENTED planning estimate, not a time promise. No Today build slot consumed. Return exact head, diff inventory, mutant failures and CI IDs. Before build, PM must confirm the rebuild namespace policy and name its workflow builder; that is the remaining product/custody decision.
