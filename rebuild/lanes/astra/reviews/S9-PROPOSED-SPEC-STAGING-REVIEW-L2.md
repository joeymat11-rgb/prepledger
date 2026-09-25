# S9 PROPOSED spec staging review L2
Verdict: ACCEPT for local immutable PROPOSED staging and reviewed static source closure only.
Reviewer: independent Astra; author Sol; PM retains integration and authority decisions.
No package, seal, runtime, full-private census, or final Claude acceptance is granted.

Inputs independently hashed:
JSON: 7fc3f7496fdc29986f4e88b53f942cb5eb888ac58c01f9b2a750720ea4e1ff24
Procedure: 65b552214320d508fe3fb863a7f2f4e532966e5df97b261067b501b66bde3578
Folder: %TEMP%/earned-s9-spec-proposal
Files: S9-PROPOSED-NONFINAL.json and S9-FIELD-COMPLETION-PROCEDURE.md.
Candidate: 80082fae7e61c2d3c4a1c8a67bf77927e3ca9a50.
SourceBase: 0cd07be7cf967dfbfea8c84947ba8477f58cfb5f, preserved exactly.
Public map: 92b6f32:rebuild/lanes/astra/S9-PROSPECTIVE-CHILD-MAP.json.

Observed corrections:
Original draft reversed lanePackage/packageId; corrected to S9 / M2-S9-UI-PINS.
Runner b-package.cjs:1863-1866 independently confirms those exact identities.
Reverse-replacing only those two fields reproduces preserved v1 JSON exactly.
Procedure now orders immutable commit and CANDIDATE delta, independent review, then invocation.
Runner PM-A1 comment is already corrected at lines 1250-1264; no repeat edit is needed.
Procedure makes ancestor repins conditional on an actual runner-byte change.

Static shape and custody:
Only .proposedSpec is canonical payload; envelope planning fields stay outside S9.json.
Status PROPOSED; acceptedLedgerLine null; authorizations empty; no fabricated grant.
33 groups and 83 JS targets exactly match the map's name/argv pairs, with zero differences.
All 83 target occurrences resolve to regular 100644 Git blobs at the candidate.
Every child has only name/argv/needle; every needle is null.
Argv uses admitted test flags or one bare JS script; no Python/inline execution target.
Product count 255: carried 201, edited 21, new 21, pinned-unchanged 9,
released 2, superseded-by-child 1. These are provisional declarations, not final proof.
The two release paths remain today/build.mjs and today/preview.css.
Five protected pins are explicit provisional S8 references, not invented hash results.
Stage1 PASS is attributed to PM evidence; Stage2 remains HELD, not a claimed closure.
No deferred CUI1 product/reference promotion or Python child was introduced.

Both layout cells correctly use pinned-unchanged and equal pre/post SHA256:
layout-v2.test.mjs: 1833df024af7a2fd593e0b7c63fa3bac7b7b9c3e7e38b5869acc76cc8a9b1c46
projector-parity.test.mjs: 2222ca121b5ff6814b02627b1164b65f81edee3e26e01fb0f5e8cd311c20b66a
For each, sourceBase blob = candidate blob = raw disk hash-object; disk SHA256 matched draft.
Their directory is rebuild/lanes/d/p3-layout-v2/. No protected bytes were read or hashed.

Bounded next action:
PM may serialize only .proposedSpec to packages/S9.json and commit the local draft.
Review that exact payload and CANDIDATE-only checker update before the same authorized check.
The retained checker reads sourceBase/children.argv without invoking runner spec().
Thus unresolved grants, needles, coverage and provisional pins need not be fabricated for closure.
No source closure was executed by this reviewer; no parent-pin audit was repeated.
Later procedure execution/export steps retain their existing containment and authority conditions.
This acceptance does not make the incomplete draft admissible to runner spec() or --ci.
No tests, repository modules, protected sources, private census, or exporter were executed.
No repository, integration, ledger, product, guard, or pin was changed by this reviewer.
