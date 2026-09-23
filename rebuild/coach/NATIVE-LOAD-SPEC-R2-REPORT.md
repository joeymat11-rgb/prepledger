# NATIVE-LOAD-SPEC builder report, R3 form (rounds 2 and 3)
Builder: Claude (claude-opus-5-5), 2026-09-23. Paper only: no engine, product or test byte; nothing committed.
Worktree earned-astra-96, branch rebuild/c-native-load-spec, HEAD 264f76a. Reviews paid: REVIEW-NATIVE-LOAD-SPEC-l1.md
(sha256 434fdca36100cd19bc78bc5b4fc0c42b7c4175cd8ddab945735cc4244a3f1fc2) and -l2.md (sha256
71dfe1cc68359889bafcfc99a6e3541a4892282cbd57440fc104c8dd2211df0a), both read whole; PM ruling DECISIONS:780 (H7).
Spec sha256: R1 9fa70186f8f54504b551e7e99a7743fc2dad2b1f82e670b586f8d2347cffc99a (277 lines);
R2 ffe0cb27e110e2c16f63d33fd024e6b89a5f7638cbcba1e966906e34f5532cc7 (369); R3 8984c62ddeb92b46dd9ea318fa552fc3453d265af0672206477d6ddbc1541d02
(375 lines, ASCII-only, LF-only, final LF, owner section 14 lines). Line refs below are the R3 spec.

## Round 3 (l2 debts and PM items)
D-NLS-5 revision retention. PAID.
  YES: :154 Apply "REVISION RETENTION": a recorded accept whose producer revision is absent is applied from its
  durable body (target_load, candidate, consumes, spend_id) after structural checks only, with issue
  PRODUCER_REVISION_ABSENT_APPLIED; it is re-validated only when the revision is present; never re-priced.
  NO: :71-72 B0 "AUTOMATIC RECORD": at first derivation the engine writes a durable engine-issued record.
  Shape {class:'plan', kind:'native-load-automatic', payload:{proposal_id, issuance}}; issuance is the accept shape,
  proposal_id = proposalDigest, no answer (no consent claimed). Written by FC08 as its own transaction after the
  Close is durable (post-commit refresh, else cold boot/reopen/import), never at Finish or inside the Close.
  Derivation only when the evaluating revision equals the Start capture's; otherwise nothing is derived
  (PRODUCER_REVISION_UNAVAILABLE) and the tops stay unspent. Idempotence: log search by spend_id before staging;
  identical bodies coalesce; different bodies give EFFECT_CONFLICT; replay applies the body, re-derives only if the
  revision is present (mismatch -> NATIVE_LOAD_RECORD_INVALID). Landing needs no record.
  Red rows: :264 N22 REVISION-RETENTION and D1 :292 (revision swap R1->R2; one record after lost ack and restart).
  Outcome row :202 updated. Cost: rebuild/client/index.cjs has only respond, which refuses an issuance without
  'accept' (:356-357), so NO adds FC15 (:220; F in S8). Under NO the counts become common 14, A/C 16, B 17 (:229):
  A and C then EXCEED the options ceiling of 15 by one file. This is stated, not hidden; under YES the counts stay
  13/15/16.
D-NLS-6 fixture types. PAID :267: ex.steps is a number array; e(o,m,t) maps to en.rir = o and en.rirSets = [o,m,t],
  with no rirEnd (earn.cjs:61,74,95 read the last element). N11 :281 now uses steps [100,105,110,115] and gives the
  output in push order: PROPOSED 110 [110,105] (earn.cjs:80), then DEBUT 105 [105,100] (:88). [Y] two offers; [N]
  PROPOSED only, with DEBUT as the automatic record.
H6: default yes-required adoption under both answers (:69, :363); N09/N10 are not stopped; the plain-words question
  is H0 (d) at :357.
H7: B then A under NO (:68, :364), per DECISIONS:780.
H8: settled as LEGACY_PENDING (:365). G :343 no longer says "as today"; it states that an older untaken offer is
  no longer cleared.
F1 :331: N22 is built under either answer; FC15 only under NO. Header :5; limits :373.

## Round 2 (l1 debts, confirmed paid by l2)
D-NLS-1 consent neutral: I1 :7, marks :16, B0 :62-72, N21, G, H0 carries the a7b0e24 questions verbatim.
D-NLS-2 engine-capture.cjs:69-70 named; with/without-repair table :77-84; LEGACY_PENDING may wait indefinitely.
D-NLS-3 inventory re-read: 3 of the reviewer's 8 lines are NOT red (l2 agreed); 3 new red pins; FC14 build-host.mjs.
D-NLS-4 two full views, spend applied to deriveSighting's output; TARGET_QUEUED, COMPLETION_SUPERSEDED.
N1-N3, D1 fixtures, N06 seams and the export mechanism are as in R2; l2 executed D1 and it matched except N11.

## Remaining owner / PM questions
Joe: (a) consent change and route; (b) the workout-preparation (third) repair; (c) A as fallback; (d) adoption asks
  first (default yes). The PM puts them; this paper answers none.
PM: carry the NO-branch file count over the ceiling (FC15) to the brief; H1-H5 from round 1 are unchanged.

## Limits
R3 ran nothing except the hash-guarded text-apply script (input R2 hash -> output R3 hash). N11's order is the
  reviewer's l2 execution, not mine. No test, probe, build or lock. Reads were by explicit file (client/index.cjs, the
  S8 manifest, DECISIONS:780). The R2 Select-String slip over engine/*.cjs was disclosed and recorded at :780.
  Nothing committed.
