# B1+B2 native capture — author reconciliation

**REJECT unchanged; R1 and R2 remain open. No real native invocation is accepted.**
First independent verdict `9de7bb79778224d581ddb9648ccbc5a44bd2ad13` was committed and sent to PM before any author report or archive access.
Then read the full 33-line candidate report (8071 bytes, SHA256 `7baed34a8b24c999ad22180f61000a164248c96dafc0da2ff341b0d683e0570d`) and complete archive `553a88d8f772b8fcb5f3a01307baf7f1a8718713`.
Verified archive is an evidence-only direct child of candidate `f9e45f922bcb489d8ef4a4eded83b968356f16e4`: 16 files, including 14 exact public copies totaling 112232 bytes, with every mapping/path/byte count/SHA256 matched. INDEX/MAPPING hashes match PM custody.
Full input manifests, TAP/stderr, public evidence, replay metadata and controls were reconciled; the replayed identities/counts/controls cross-bind to the archived bytes. Final four source hashes match the independently reviewed candidate. No author scratch was accessed.

Author first run `ef08dbf3244c040928d27eea9d791d7394c32df4`: **9/22, 13 failures, exit1**, 2633.4732ms; helper syntax failures and Windows ACL module failure preserved. The mutation test caught a SyntaxError and earns no behavioral-control credit.
Author second run `34e0cf063f6e86383deaf0383cd52c16a04a9b49`: **17/22, 5 failures, exit1**, 12449.905ms; missing invented-child census/observations and stale mutation anchor preserved. Exactly three completed controls are recorded; the anchor setup failure earns no kill credit. Its input manifest remains explicitly retrospective.
Author final run `8986d493058f1f6488781a105586c3177dd4f3fc`: **28/28, exit0**, 27901.0241ms; five reported source reversals/restorations retained as author evidence. All three runs have zero cancelled/skipped/todo and empty stderr.
These results agree with the report's history. They do not make the independent counterexamples pass or erase the ER's original 26/28 and nested 2/3 fixture failures; the documented bounded metadata replay remains separately 3/3.

R1 coverage gap: the author's late-observation test makes the extra call **before** invoking its simulated exit callback. It does not exercise a later real exit listener after pending-marker removal; the independent real-child counterexample still publishes false capture PASS.
R2 coverage gap: the author's fake-census cases cover counters, plan/result numbering, duplication and terminal placement. They do not reject SKIP/TODO directives or bailout paired with a contradictory all-pass footer; all three independent false-PASS streams remain reproducible.
Source/profile/caps/privacy/first-failure facts are consistent where independently verified. Claims that late calls cannot cause acceptance and that complete 4/4 is sufficiently proven must be narrowed until both findings are repaired and independently reviewed.
The seven-consumer check and D1 redacted static record are author evidence only. D1 names code ranges1–8 and redacted classification2514 with no new loader; ER did not read/evaluate the historical writer or embedded data and does not promote this to behavioral/native proof.
Custody and verification driver: `b1b2-native-capture-annex/AUTHOR-RECONCILIATION-CUSTODY.json` and `reconcile-author.cjs`. No candidate fix, new dependency, original child/native/private/frozen/history execution, push, integration or deployment occurred.
PM judges and commissions any bounded builder repair; ER's current review is complete and returns to LOW/paused under PM320. Exact native deltas remain UNKNOWN.
