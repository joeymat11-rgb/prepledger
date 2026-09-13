# Launch hotfix: adoption and independent review bar

Issued by Astra PM under DECISIONS:193 before new-lane adoption/rebase of C's existing speculative candidate 4c1923901671fe21170917504a3515dcab7d15e0. This does not claim a missing historical pre-build brief existed. The candidate remains unaccepted. Goal: the freshly built integration page opens and every existing screen remains usable.

READ-LIST: today/plain-copy.cjs and build.mjs; today/test/copy.test.mjs; today/browser-check.mjs and its screen siblings; H3 integration :189; .github/workflows/rebuild.yml actual CI commands; D2's existing launch request. Read this bar before HOTFIX-DIRNAME.md or builder reasoning.

Custody: C owns adoption changes to rebuild/m3/w7-preview/today/{plain-copy.cjs,build.mjs,test/copy.test.mjs}, its report and this package's evidence. No engine, m4, client, conform, workflow, pinned package test or private-path edits. If required scope differs, disclose before coding. No new test file means no new workflow enumeration is assumed.

Acceptance:
1. Reproduce the reported browser boot failure on a fresh build from the integration pre-fix bytes with synthetic data. The witness must execute the emitted bundle in a browser environment, not only search its text.
2. Adopt/rebase the candidate onto the current H3 integration in C's own branch. Publish the exact combined head and custody diff; do not ask the reviewer to manufacture a merged candidate.
3. Freshly rebuild that exact candidate; execute the real browser checks for Today, gym, check-in, setup, food and machine settings. No pre-existing .tmp output qualifies. Record build ID and head; record any unproved physical iPhone behavior.
4. Execute the actual built app in the browser-shaped test context without Node-only globals. Prove reinstating the original unguarded read makes the regression check fail, then restore the candidate.
5. Preserve P1 no-dash attribution and fail-closed wrong-depth controls. Any new source scan must avoid false PASS from missing attribution and false rejection of allowed guarded reads. Review its real coverage honestly; do not claim it catches every browser incompatibility.
6. Unique scratch plants must not mutate tracked production sources during sibling suites; prove the original intermittent/cache interference is absent under the relevant combined run without weakening assertions.
7. Run the named existing Today tests, copy tests and current H3 public gate; report counts and terminal verdict only. If H3's pinned evidence refuses the candidate, stop and route to B/PM, never bypass or rewrite the accepted artifact.
8. Windows and Ubuntu CI must pass at the exact published candidate head. Reviewer executes independently and reports ACCEPT/REJECT plus remaining limits. C author != D2 reviewer != integrator.
9. On PM authorization, a third-role integrator merges the accepted head and checks the merged built artifact. No release-ready or Sunday-ready claim until this evidence exists. Integration may trigger the existing Earned slice pipeline; no main or relay deployment is licensed.

Handoff: C publishes the combined candidate, report <=60 lines, bar cell counts, run IDs and fresh-build evidence; D2 reviews in its own tree. Unresolved N2 defects stay outside this package and keep their own review.
