# REVIEW-S9-SEAL-l1
VERDICT: ACCEPT WITH NAMED DEBTS (D-S9SEAL-1..4)

Reviewer: Claude Fable 5.1, independent, static only (DECISIONS:796 (d)); runbook step T11 FABLE SEAL READ AT A for
M2-S9-UI-PINS. Nothing under review was authored by this reviewer. No test, b-package, harness or exporter was run;
no log, no W\.tmp, no rebuild/conform/private listing, no protected-five content; every hash below was taken by node
crypto over bytes extracted with git show REV:path (explicit paths) into %TEMP%\fable-s9-seal-l1. Date 2026-09-24.

## 0. Inputs measured
- Rules file %TEMP%\opus55-RULES.txt sha256 57d2794f... (4735 bytes); runbook %TEMP%\S9-SEAL-RUNBOOK.md sha256
  42767adad86e80e1dce40fa68defac0f7f04864c2cbbacf45b4b2cd131dfab93 (23206 bytes), read whole.
- W HEAD = refs/remotes/origin/rebuild/b-s9-integration = 9c95afa5b840fedbe914652b2f0bd83d1b0800c2 (A), branch
  rebuild/b-s9-integration, git status --short -- rebuild .github empty (review file removed per T7; no receipt, no
  VERDICT-S9.md yet). rebuild\conform\private is present (Test-Path only; T9 junction stays until T19). Chain
  refs/remotes/origin/rebuild/t2-client-core in W = 18a9651cf3e4ce116c137b000cd4f18da66de70d (DECISIONS:807).
- A = one-file commit "S9-UI-PINS: proposed artifact (exporter v3 s9-final-1, sha256 f2447622)" on b44ec01
  (1 file changed, 1919 insertions); first-parent chain A -> b44ec01 (round 7, :804) -> 8306c3f -> e3e22e2 (merge
  tip cd16a38 = :801) -> 63bf01d -> ffb31c6 (round 5) -> 6dc2596.

## 1. Artifact bytes at A (judgement 1) - PASS
- git show A:rebuild/m4/spec/acceptance-s9-ui-pins.json = f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c
  (100123 bytes) = worktree copy = %TEMP%\earned-s9-profile-export-results\s9-final-1\acceptance-s9-ui-pins.json
  (same sha, same size) = the T7 ENVELOPE PENDING artifact= value = the T4 exporter line. LF, no CR, 203 non-ASCII
  bytes (the U+00B7 separators inside the cited ledger lines, as in S8). Exporter review copy is
  {"version":1,"status":"PENDING","receipt":null} (BP:3699-3702 shape).
- Blob ids at A: S9.json 3c9a1dec, b-package.cjs ac7a4195, artifact 229a9114, acceptance-s8-real-shape.json cf03a372.

## 2. What the artifact binds, as the runner re-takes it at T15 (judgement 2) - PASS
Read paths: envelope() BP:3686-3777, proposed() BP:3389-3476, releaseRuling() BP:1543-1622, supersessionRuling()
BP:1475-1516, sealOnTheTip() BP:3514-3556 (SEAL_TIP_RULE 'ancestor' BP:112), sealedRunReceipt() BP:3588-3660,
fidelity() BP:2596-2621, ownChildren() BP:799-801, main BP:3825-3933; LG = legacy-gates.cjs verifyReceipt LG:19-27.
- artifact.spec = {rebuild/lanes/b/tooling/packages/S9.json, bb169a67847d10963fcaa0d69c14d5e157ad0a81525e22352ef116d6071ac86c}
  = git show A:S9.json (91741 bytes) = worktree; artifact.runner = {b-package.cjs,
  5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22} = git show A = worktree (314978 bytes). Both also
  stand in executionPins (BP:3390) and fidelity() re-asserts the runner at HEAD (BP:2605-2606).
- artifact.parent = S8 artifact rebuild/m4/spec/acceptance-s8-real-shape.json
  3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48 = git show A (89873 bytes); reviewSha256
  f7b9b51e..., receiptLedgerLine 528, reviewedCommit 0cd07be7 (ancestor of A: true). Chain :528 is the exact S8
  precedent line "- 2026-09-18 <U+00B7> cowork <U+00B7> POSTFIX-ACCEPTANCE M2-S8-REAL-SHAPE 0cd07be7... ...ACCEPTED".
- sourceBase e8712f48b32e33738cdf81dd8d6cd72d0a72523d in artifact = spec, per :804; merge-base --is-ancestor of A: true
  (BP:2597 and BP:3768 SOURCEBASE-NOT-BEHIND-HEAD hold).
- Ledger citations, each located by its own sha256 and found UNIQUE + byte-exact on the chain DECISIONS.md at 18a9651
  (808 split lines) and identically at A (802): owner :60 ebb565c6 role owner mentions M2-RULE; contract :49 f14f5e92
  role cowork mentions POSTFIX-GATE BRIEF; THEME :788 ff25c85a role cowork mentions M2-S9-UI-PINS; BRIEF :789 04b0f897
  role cowork mentions M2-S9-UI-PINS + rebuild/lanes/b/S9-UI-PINS-BRIEF.md (brief sha abf3f670 = git show A, 122946
  bytes). These are exactly the four `cited` re-verifications at BP:3753-3756 with the same roles and mentions.
- RELEASE :786 (spec.release.rulingLineSha256 46a64dc0, unique at line 786, tail "... no other path <U+00B7> RULED",
  token clause "RELEASE-FROM-SEAL M2-S9-UI-PINS rebuild/m3/w7-preview/today/preview.css,rebuild/m3/w7-preview/today/
  build.mjs" alone in its clause, RELEASE_GRANT BP:1016). Declared released set == granted set both directions; each
  released pre == the S8 artifact's pin (build.mjs d04a10ef, preview.css 7cf97598), post null (BP:1940-1941); neither
  is a child argv target nor brief/runner/spec/successor (BP:1603-1620). artifact.released carries lastSealedSha256 =
  those pins, sealedBy M2-S8-REAL-SHAPE, rulingLineSha256 46a64dc0 (BP:3442-3444).
- SUPERSESSION :787 (coverage.superseded.rulingLineSha256 b8d088af, unique at line 787, last clause RULED, token
  "GATE-SUPERSESSION M2-S9-UI-PINS source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate").
  artifact.coverage: run 10 (conformance, merge-differential, merge-laws, migrate-full, selftest, strict, witnesses-1/3/4/6),
  superseded 9 (merge-source, migrate-source, writers-source, migrate-differential, witnesses-2/5/7,
  writers-differential, second-gate), covered 0, supersededByCarrier maps the five carriers to those nine; gates 19.
- Roles :786/:787 read "cowork (PM)"; releaseRuling()/supersessionRuling() check no role (only uniqueness, RULED
  terminal, grant token), so this is fine there. It would NOT be fine for the T12 line (LG:24), see section 6.
- Pin closure as envelope() builds `reviewed` (BP:3762-3764): 84 executionPins + 254 product post||pre, 81 overlap,
  257 distinct paths; every one equals sha256(git show A:path): 0 mismatches, 0 absent (the protected five were hash-
  compared in memory only, bytes discarded, no content read). today-17's argv file
  rebuild/m3/w7-preview/today/test/catalogue.test.mjs is not in product but IS in executionPins (argv route BP:3392).
  L.checkSources at A (LG:12-18) therefore holds at A; at M2 the worktree half holds unless T14 merges a pinned path
  (measured below: none today).
- Y1 (BP:3740-3747, only asserted on the ACCEPTED branch, so never exercised by T7/T9): ownChildren() = 13 of 32
  children execute a role "new" product file (s9-sup-* x5, s9-engine-files-differential, sealed-inventory-fence,
  ui-pack-pins, reference-closure, release-object, today-carry, passphrase-normalize, f2-land) >= MIN_OWN_CHILDREN 1.
- Shared blocks artifact == spec: authorizations, carriedAcceptedIds (D12,D33,D34,D35,D41,D43), sourceBase,
  protectedSurfaces (2), carrierSuccessor null, witnessFlips [], dIds [], laws {}, privateLiveTriggered [],
  artifact {file, review}, children (32, identical arrays), coverage.supersessions == spec.coverage.superseded.
  ARTIFACT_KEYS (BP:3477-3489) all present incl. optional `released`. SEALED-PROFILE-RECOMPUTATION (BP:3695) was
  proven by T7 itself: ENVELOPE PENDING prints only after same(m, proposed()) held on these bytes.

## 3. S9.json at A (judgement 3) - PASS
- sha256 bb169a67... = the artifact's spec pin; blob 3c9a1dec at b44ec01 AND at A, so the source-custody re-point
  the PM ran at b44ec01 reads the same spec bytes as A (the PM's claim verified by blob id; the checker run itself is
  PM-only and not re-run here).
- 32 children, names unique, keys exactly {name, argv, needle}; no child named b-lom, no argv under lanes/d/b-lom;
  needles all >= 8 chars (BP:1951). Needles as declared (samples): today-17 "# pass 685", s9-sup-source-carriers
  "# pass 4" (the prediction, notes[1]), ui-pack-pins "# tests 121", release-object "# tests 14",
  passphrase-normalize "# pass 29", f2-land "# pass 81", s9-engine-files-differential the full ENGINE FILES DIFFERENTIAL
  sentence ("27 tracked ... 45 tracked rebuild/engine file(s) stand byte-identical").
- notes[4] is D-BLOM verbatim: 2(b) under :798, PM :799, both b-lom cell files role carried at the parent's bytes
  (legacy-order.test.mjs pre==post f091a560), rebuild.yml:331 keeps running them, S8 "# pass 30" is the last sealed
  evidence, the eight moved m3/m4 files named, re-measure after 2026-10-05.
- sourceBase e8712f48 (:804); status BRIEF-ACCEPTED; tooling.runnerSha256 5321181a; product 256 = edited 21,
  carried 201, new 22, pinned-unchanged 9, superseded-by-child 1 (packages/S8.json: its only change e8712f48..A is
  tooling.runnerSha256 e31dd206 -> 5321181a), released 2. Protected five all role carried. No rebuild/coach path,
  no receipts/*, no VERDICT-*.md in product (so C1-C3 cannot void the receipt, BP:3630-3642).
- Round-5 spec at 6dc2596 had product 255 / children 33 / sourceBase 0cd07be7; the runbook's "255 declared less 2
  released = 253" (T15) was computed there and is STALE: see D-S9SEAL-1.

## 4. The PM's FILTERed T7/T9 lines against the code (judgement 4) - PASS, nothing hidden
- T7 --ci (s9-ci2): "POSTFIX M2-S9-UI-PINS REVIEW-PENDING mode=--ci" = BP:3828 with first.authorized false;
  "ENVELOPE PENDING artifact=f2447622... spec=bb169a67... runner=5321181a...; independent exact-artifact acceptance
  required" = BP:3701 verbatim with the three shas measured above; "PUBLIC CI EVIDENCE PASS - public evidence only,
  NOT the package verdict; ..." = BP:3897 (the runner prints an em dash; the PM's copy has "-", a transcription
  artefact, not a different line); EXIT=0 = BP:3897 exitCode 0, reachable only when no ciBlocking obligation is open;
  32 CHILD OBSERVED = BP:2844 for all 32 declared children at exit 0 with needle at line start (BP:2808, 2824).
- T9 --full (s9-full1): "ENVELOPE ABSENT; ... not sealed yet - no PASS word is available" = BP:3689 (review removed
  at T7 end, as D:516 requires); "PRIVATE ORACLE PRESENT; verdict-only reporting ..." = BP:3784; "FULL EVIDENCE: 10 of
  the 19 original gates re-executed, 0 carried ... and 9 SUPERSEDED under DECISIONS:787, each replaced by this
  package's own executed evidence; second gate included" = BP:3817-3821 with covered.size 0, SUPERSEDED_RESOLVED.size 9
  and at=787 (matches the artifact's run/superseded split); 10 LEGACY OBSERVED = coverage.run (PASS rewritten to
  OBSERVED at BP:3813 because unauthorized); "POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s)" EXIT=2 =
  BP:3912-3914. The ONE open obligation is the note at BP:3888 'closed cumulative profile not sealed' (last.sealed ===
  null), which exists only while the envelope is ABSENT/PENDING. Since T15 needs `!open.length` (BP:3900), the count
  "1" at T9 is the important number: no other note (theme null BP:2636, historical baseline BP:3789, etc.) is open.
- s9-ci1 (before the artifact): FAIL CHILD-REQUIRED-EXIT-ZERO after 27 children = release-object is child 28 and its
  REAL ROW is red without the artifact (BP:2808, BP:2817 throws at the first red child), exactly runbook T2.
- Runner property noted, not an S9 defect: the needle match is a PREFIX at line start (BP:2824 '^' + escapeRe(needle),
  flag m), so "# pass 4" is also satisfied by "# pass 40". Inherited from S8 (same runner design), pinned; a tooling
  round if ever tightened.

## 5. VERDICT-S8 carries V8:108-143 (judgement 5) - handled, two to restate in VERDICT-S9
1 p3-layout-v2 cells (V8:109-113): PAID. Both files are S9 product role pinned-unchanged and executed by child
  d-real-shape (argv lines S9.json:1696-1697).
2 rebuild.yml comment "the brief predicts the exact refusal" (V8:114-116): prose-only carry; rebuild.yml at A still
  carries the sentence at :125/:148 (edited role, 185 insertions since e8712f48). Restate in VERDICT-S9 (D-S9SEAL-2).
3 S8.json ledger numbers one low (V8:117-121): NOT corrected in S8.json (only runnerSha256 moved). The runner locates
  lines by sha, so nothing rests on it; restate in VERDICT-S9 (D-S9SEAL-2).
4 today-17 P-MEASURE (a) flake (V8:122-124): the class is still inside today-17 (measure/test/journey.test.mjs in
  its argv, needle "# pass 685"). Every S9 run so far has it OBSERVED at exit 0. A red at T15/T19 is a rerun, not a
  seal defect; record it if it happens (D-S9SEAL-3).
5 Lane D (a)-(e) (V8:125-138), non-blocking, "(d) restated at every round as asked": the S9 brief does not mention
  rule_profile, construct.cjs, listImports or the identity trade (grep 0 hits). Restate in VERDICT-S9 (D-S9SEAL-2).
6 Passphrase hyphen-only input (V8:139-140, D:520): PAID by child passphrase-normalize (3 new cells, "# pass 29") and
  the new rebuild/m3/setup/port/passphrase.cjs.

## 6. T12-T23 soundness (judgement 6)
- T12 LINE. Tested the exact candidate "- 2026-09-24 <U+00B7> cowork <U+00B7> POSTFIX-ACCEPTANCE M2-S9-UI-PINS
  9c95afa5b840fedbe914652b2f0bd83d1b0800c2 rebuild/m4/spec/acceptance-s9-ui-pins.json
  f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c ACCEPTED" (216 bytes, sha256 66ff27e7... if written
  exactly so on 2026-09-24): BP:3757-3759 regex matches with v[1]=A and v[3]=hash; LG:24 ' <U+00B7> cowork <U+00B7> '
  matches; LG:25 mentions (packageId, artifact path, hash) all present. The seat tag "Claude Opus 5.5 PM" passes the BP
  regex but FAILS LG:24 RECEIPT-ROLE; "cowork (PM)" as in :786/:787 also FAILS. Plain cowork, as :528 and :800 rule.
  The line must end in ACCEPTED with no trailing space, LF terminated; chain DECISIONS.md is LF, no BOM, 807 lines
  today, so the line lands at :808 if nothing else is appended first. Write it ONCE: LG:23 requires exactly one line
  hashing to lineSha256, so a duplicated append refuses RECEIPT-EXACT-LINE-MISSING.
- T13 review shape: keys exactly version/status/receipt (BP:3697), receipt {commit=R, path rebuild/DECISIONS.md,
  line, lineSha256} (LG:20); ancestor(R, CHAIN_REF) BP:3767 needs R pushed and W fetched (T14 does both).
- T14/T15 chain state: the chain moved from cd16a38 (:801, merged in A) to 18a9651 (:807). git diff --name-only
  cd16a38..18a9651 -- rebuild .github = 2 names, rebuild/DECISIONS.md and
  rebuild/lanes/HANDOFF-PM-2026-09-24-B-CLAUDE-OPUS-5-5.md, 0 in the 257-path pin set, 0 in fidelity()'s scope
  (rebuild/engine, rebuild/conform, rebuild/m4/spec, rebuild/lanes/b/tooling). Lane-side 1462 names cd16a38..A,
  none touched on both sides. So T14's recorded diff will be DECISIONS.md + that HANDOFF file (the runbook expects
  DECISIONS.md, at most + STATUS.md): harmless, record it. Any FURTHER chain move that touches a pinned path or
  fidelity()'s scope before T15/T19 refuses WORKTREE-SOURCE-PIN / UNLISTED-SOURCE-CHANGE / SEAL-BASE-IS-NOT-THE-
  CHAIN-TIP; the Q8 freeze must hold from T12 to T22 (D-S9SEAL-4).
- T15 prediction: SEALED RUN RECORDED ... over 254 pinned product file(s), not 253 (BP:3907 counts
  Object.keys(receipt.product) = non-released files present on disk = 254 here). T19's BYTE-IDENTITY sentence says
  "all 254 pinned product file(s), plus 2 released" (BP:3863-3866). D-S9SEAL-1.
- T18 constant: ERT:56-63 reads the standing --package from rebuild.yml (:162 = S9) and, once receipts/S9.json exists,
  expects "M2-S9-UI-PINS@" + sha256(receipt)[0:16]; before C1 the window branch (ERT:64-80) expects the S8 literal,
  which engine-revision.cjs:25 still carries ("M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0"), consistent with CI-1 green.
  rebuild/coach is not in S9 product, so C3 does not void the receipt.
- b-lom at rebuild.yml:331 and coach at :351 have no `if:` and sit in the public-gates job before the `!cancelled()`
  steps (:270, :388 ...). A public-gates job that completed success on ubuntu and windows at A therefore ran both
  green on an S9 tree (Q2 answered, D-BLOM excuses nothing and nothing needs excusing). This rests on the PM's CI-1
  reading (run 36048172480, recorded at DECISIONS:806); I could not open GitHub (static brief).
- CI-1 is advisory (Q1: the standing step cannot reach sealOnTheTip with the review absent, BP:3688-3702); CI-2 at
  the exact final head C4 is the binding run (D:800). Nothing at A predicts a red there except a chain append
  between R and C4 (BP:3534 on both runners).
- T19 skip of the released pair: BP:3630-3642 keyed on role released bound by releaseRuling(); the receipt never
  carries them (BP:3665-3667). T22 fires slice-host.yml (Joe's "Yes, deploy at seal", :800).

## 7. Named debts (none blocks T12)
- D-S9SEAL-1 (runbook, PM): the T15/T19 counts are 254 pinned product files (256 declared less 2 released), not the
  runbook's 253 (computed on the round-5 spec, product 255). Read "254" as the expected value; 253 would be a defect.
- D-S9SEAL-2 (VERDICT-S9.md, T17): restate the unpaid V8 prose carries: V8:114-116 (rebuild.yml comment vs R01),
  V8:117-121 (S8.json cites :524/:525/:526 for lines at :525/:526/:527; S9 moved only its runnerSha256), and the lane D
  notes V8:125-138 (a)-(e), (d) restated as asked; plus D-BLOM as notes[4] and the released pair per T17.
- D-S9SEAL-3 (VERDICT-S9.md): today-17 still carries the DECISIONS:496 P-MEASURE (a) flake class; if any T15/T19 run
  goes red there, rerun and record the rerun in the verdict as V8:122-124 did.
- D-S9SEAL-4 (process, T12-T22): the chain freeze (Q8). The chain is at :807 and moving (NATIVE-LOAD rounds are
  ruled there); an append after R turns T15/T19 into SEAL-BASE-IS-NOT-THE-CHAIN-TIP and CI-2 red on both runners.
  Announce, and if it happens: merge forward once (D:565), never rebase, re-run.

## 8. May the PM write the T12 POSTFIX-ACCEPTANCE line?
YES. Artifact f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c at A 9c95afa5b840fedbe914652b2f0bd83d1b0800c2
is the exporter's bytes, binds spec bb169a67, runner 5321181a, parent 3cf58e0e, sourceBase e8712f48, :786/:787/:788/
:789 by unique line sha, 257 pins byte-exact at A; T7 PENDING and T9 REVIEW-PENDING (1 obligation) are what the code
prints; CI-1 green on both OS is recorded at :806. Preconditions of BR:668-669 are met. The line: tag plain cowork,
A's 40-hex, the artifact path, the 64-hex above, terminal ACCEPTED, written once, LF.

## 9. What this reviewer could not do
- Run anything: no proposed()/same() recomputation (loads the protected five; PM-only under :796 (d)); no exporter
  re-execution; no b-package run; no coach/production suites. The SEALED-PROFILE-RECOMPUTATION equality rests on the
  PM's T7 ENVELOPE PENDING line, which the code cannot print unless it held.
- Read any log (s9-ci1/ci2/full1, W\.tmp), the private census, the source-custody checker output, or GitHub (CI-1
  run 36048172480 and its jobs are the PM's reading, ledgered at :806).
- Verify the b-lom cells at :331 ran green other than by inference from the job conclusion and the absence of `if:`.
- Judge the S8 seal chain (0cd07be/e8712f48) beyond ancestry and the S8 artifact/precedent line bytes at A.
Scratch left in %TEMP%\fable-s9-seal-l1 (h.cjs, g.cjs, i1-i5.cjs, m1-m6.cmd, extracted blobs); nothing in W touched.
