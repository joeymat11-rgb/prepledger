# B1+B2 native capture — independent ER verdict

**REJECT: two capture false-PASS mechanisms. Hold any real native invocation.**
PM336 / Astra ER; authority `5b81dc8fa0c8b31f46865b7588e190dcab7f9a15` and complete PM330 bar; author report/outcomes unread for this verdict.
Candidate `f9e45f922bcb489d8ef4a4eded83b968356f16e4`; tested source `8986d493058f1f6488781a105586c3177dd4f3fc`; base A `3bfed63febef002b8540d6ff3c56e19d08368711`.
Own `work/pm-caretaker/er-b1b2-native-capture`, branch `codex/astra-er-b1b2-native-capture`; full 1610-path index retained, original tree `d29ebfbe09df0402a618121073b7ada1f938082a`.

1. **R1 / blocking — completion can outrun a late observer failure.** Helper lines 495–514 remove the pending marker in an exit listener; a subsequently registered exit listener can call the observer again, setting `failed` after the marker is already gone. The failure has no durable effect.
Actual unmodified helper/operator, real invented four-test Node child: two valid observations, then a third observation in the later exit listener. Child 4/4, exit 0, no signal; marker absent before/after that third call; operator incorrectly returns gate PASS / capture PASS and complete:true.
Controls: normal completion passes; the same third observation before natural exit correctly yields capture FAIL while preserving child 4/4 exit0. This isolates listener ordering, not a fabricated comparison or loader failure.
Required behavior: a later observer failure must remain a capture failure through the child's final close; do not change the original comparison, child outcome or first-failure reach.

2. **R2 / blocking — contradictory TAP can be accepted as complete 4/4.** Operator `tapCensus` lines 86–103 keeps only `ok`/`not ok`, ignores result SKIP/TODO directives and ignores `Bail out!` before the trailer.
Three independent invented streams contain respectively SKIP, TODO or bailout plus a false all-pass trailer; both actual observations complete, child exits0, and the actual operator publishes gate PASS / capture PASS for each. Canonical manual control passes.
Required behavior: refuse these contradictions; no counter-only all-pass conclusion may override skipped/todo/bailout evidence. These are parser controls, not a claim about an executed original native child.

Execution: unchanged committed cohort **26/28, exit1**. Two identity/main positives stop at the builder-basename requirement; these are fixture failures, not behavioral kills. The direct raw-sentinel main check also stops early and receives no child-reach credit.
PM-approved nested exact-source identity/main replay **2/3, exit1**: positive main reaches invented child but unchanged Git source-delta validation refuses the nested relative pathspec. This original failure is retained.
Explicit synthetic GIT_DIR/GIT_WORK_TREE transport then restores root-relative metadata semantics: the same three selected checks **3/3, exit0**, all six copies/Node unchanged, actual production guards preserved. No broad cohort rerun or original child execution.
Independent nine-case cohort **5/9, exit1**: four named failures prove R1 and R2; other controls pass. Four guard removals each lose the intended reviewer assertion and freshly restored source passes. Setup errors do not count as kills.

Source facts: exact five changed paths; final candidate commit changes report only; tested implementation bytes equal candidate. Removing only the bounded observer block and single hook from the new helper reproduces the complete A helper bytes.
Original fieldDiff/validation/assertions/return/inputs remain unchanged; hook sees actual deltas before assertion. Profile differs only in helper postimage: 112 keys, 26 argv, 24 D-ids and all other duties/authority/native expectations retained. Whole engine/m3 trees, public map and static child are unchanged.
Synthetic positives/refusals cover all fixed categories, state-shape/state-other and dotted ambiguity, disabled no-write behavior, sentinel privacy, first failure/no writer, canonical records/counts, IO/overflow and drainage to natural exit, signals/census, identity/root/argv, exclusive paths/junctions, and actual Windows ACL/readback.
Independent real hardlink control retains the pending marker; original and reviewer guard evidence is preserved separately. The production pin/command checks were evaluated with disclosed synthetic identity transport, not a real native commission.
Owned Node22.23.2 win-x64, 86997320 bytes, SHA256 `0d0f5e39f9f3d9587bc19f73eab3c2c9c4903fd02d6dbf9c853dd81b3d95fad4`; complete input/bar/profile hashes, argv, raw failed/final outputs, reversals and replay sources are in `b1b2-native-capture-annex/`.
Public diagnostics contain only fixed categories/counts; exact native field deltas remain UNKNOWN. No original H3/native/seed/history/frozen/private/FULL/CI/artifact/receipt/phone/import execution, candidate fix, push or deployment occurred.
Next: PM disposition and separate builder repair if commissioned. Full author-report/archive reconciliation follows this committed and sent first verdict; it cannot erase these findings or the original failed runs.
