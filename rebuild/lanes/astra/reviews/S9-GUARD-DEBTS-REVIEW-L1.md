# S9 guard debts: independent review L1
Reviewer: Astra (Codex), independent highest-effort seal-guard reviewer under DECISIONS:633; never author or PM.
Base: 15ab6e83a9a3f1ce8d6b3183c3280e320a294ed3.
Head checked: cf4fc766b7e7ab711eaa9a13257df3b25db70d00.
VERDICT: ACCEPT
Scope: D-NULL-ARTIFACT, D-CONDITION-MATCHER, D-REPORT-DENOMINATORS only. This verdict does not accept S9 part 2 or its held design/artifact work.

D-NULL-ARTIFACT: CLOSED. Before the author report, my actual real-row callback accepted both a valid release object and JSON null; seven wrong/absent shape controls refused at base.
At head, valid input still passes. JSON null yields exactly ["RELEASE-OBJECT ARTIFACT-NOT-JSON rebuild/m4/spec/acceptance-s9-ui-pins.json: it parses, but not as a JSON object"].
Array, primitive, empty-object, wrong released-block, malformed JSON and absent inputs refuse. Non-null baseline observations are unchanged, including one refusal for malformed JSON. Additional boolean/released-null/released-primitive controls refuse.
The real row calls releaseObjectRefusals(abs); the new fixture calls that same reader. The added parsed flag distinguishes parse failure from successfully parsed null without broadening the artifact contract.
D-CONDITION-MATCHER: CLOSED. Blind base probes ran all FIVE actual condition-reader callbacks: canonical passed5/5, &&false passed5/5 incorrectly, ||true passed5/5 incorrectly, cancelled/missing each failed5/5.
At head, canonical stays5/5; wrong conjunction, disjunction, cancelled and missing each pass0/5. Thirty additional actual-row cases refuse prefixed disjunction, extra conjunction, trailing text, prefixed text and missing expression delimiters.
The three complete-condition matchers are identical; four call sites serve five logical readers: release, pack, fence, passphrase and local import. No general workflow grammar or semantic equivalence is claimed.
D-REPORT-DENOMINATORS: CLOSED. Historical text distinguishes incoming triple-dot preflights from the two-dot whole-branch inventory, two first-parent F2 merges from49 newly reachable commits, and six incoming P4B papers.
The F2 graph counts were independently re-taken as2 and49; remaining wording matches the prior independent review's recorded correction. No accepted part-1 lane was re-audited.

Independent execution and boundaries
Only positively selected actual callbacks ran in the retained safe harness; four added rows passed, alongside the independent actual-reader controls. No full cell, original real-fence execution, b-package command or receipt generation was run by this reviewer.
Synthetic artifact/workflow reads drive the actual cell code. Unexpected reads and child processes refuse; temporary writes/cleanup stay within harness-created OS-temp fixture roots. No dependency was installed.
The full fence() body, original fence REAL ROW, and original pack REAL ROW sections are byte-identical to base. The real release row retains its assertion and now calls the extracted reader.
The named acceptance artifact and approved-pack directory are absent. The synthetic absent-artifact callback still gives ARTIFACT-ABSENT. Existing design/artifact real-row reds remain owed; they were not skipped or weakened to obtain this verdict.
No new C-UI-1, proposed artifact, owner copy, workflow, runner, pin, product, spec or engine dependency is introduced. PM separately confirms the final diff has only the five commissioned paths and the brief is unchanged.
Author report was read after blind source/counterexamples; its scoped guard claims agree. Its accidental full-fence run is EXCLUDED from all acceptance evidence here.

Single-clause table
| Mutated clause group | Independent result |
| --- | --- |
| Three matcher bodies: start/end, indentation, expression delimiters, negation, call, substring regression | 24/24 distinguished by actual condition callbacks. |
| Four matcher call sites serving five logical readers | 4/4 distinguished; bypasses allow an improper condition through its actual row. |
| Parse state, null/object/array branches, invalid reset, default artifact label, return and actual-row reader call | 12/12 distinguished by exact actual-row pass/refusal observations. |
| Total | 40/40 distinguished; no survivor or broad semantic-oracle claim. |
Each mutant starts from original head source, changes one clause, and is compared with its unmodified control. Tests and production files were not edited; exact edits and outputs remain in scratch.

Safety limitation and remaining gates
The unchanged fence helper requests content from selected acceptance/package JSON and fixed runner source paths, but its unscoped git diff --name-status can inspect repository-wide metadata and may internally read blobs for rename detection. Source inspection cannot certify that accidental run's privacy.
The accidental log was not opened, copied, published or deleted. No claim is made that prohibited content was or was not accessed; that run is not a substitute for contained execution.
Claude review, PM integration, safe original full-cell/real-row verification, Linux/hosted exact-head CI and the existing S9 part-2 design/artifact/seal gates remain. No commits or pushes by this reviewer.
Evidence: C:/Users/joeym/AppData/Local/Temp/astra-s9-guard-review-70/INDEX.txt; blind-base.json, focused-head-evidence.json, clause-evidence.json and safety-notes.txt.
