# CLAUDE REVIEW: S10 working brief revision 2, round 1
Reviewer: Claude Fable 5.1, independent reviewer (:635 point 1, :778); no hand in the brief. Paper only, no runtime, no lock taken.
Under review: worktree earned-s10-working-brief, branch rebuild/b-s10-working-brief at ffc10ea, uncommitted.
Hashes verified before reading: S10-WORKING-BRIEF.md 3aadfbcd654ba01beb31ccb6e116bf713be6b98fb658fe2a426946a553173762 (615 lines);
S10-WORKING-BRIEF-REPORT.md 8baab5d9e09120989d125f4d6e5bdcfeabe863ed949b50f84f9a37478020b4c5 (59 lines). Both equal the request.
BLIND FIRST: DECISIONS on origin/rebuild/t2-client-core 37a18d21 (779 lines) read whole at :626-:665, :699, :724-:779, plus
:694, :700, :701, :707, :711 by grep; a12be09 disposition (47 lines); caa0abf brief (383 lines); 1b41692 receipt; 31c88922; c6fb3017;
324b994a; 84302990; 175f6323 debts; f0a5eb1a debts; ae96e30. Then git diff ffc10ea..caa0abf and caa0abf..worktree, explicit paths.
## VERDICT
ACCEPT WITH NAMED DEBTS. Nothing that depends on the S9 seal is stated as fact: every seal-dependent value is a 2.1 STOP or OBSERVED
and re-measured by me (below). No accepted clause of ffc10ea or caa0abf is dropped or weakened. Debts D3/D5/D6/D7/D9 and the 21
survivors equal 175f6323:93-99,132 byte for byte; L4 D4 and D5 locator equal 84302990. The four S-R30 exceptions, the "SO AFTER S10"
sentence, guard (4) and flag (5) equal :626 exactly. CUI1 sequencing matches :732 and a12be09 A1/A4/A5/A6 (brief 2, 12.1, 14).
## MEASURED BY ME (all equal to the brief)
fe9f14b ls-tree: today-app ea98aef6, today-model 6a146ff9, gym-app 48bf0531 (brief 3.1). 66d32530 ls-tree: lane 40d59ee9, gym-app
d8ab53aa, msv c8131055, today-app 57b7ad2c (= b35a48e3), today-lanes d66a80ef (4.1). merge-base --is-ancestor b35a48e3 66d32530 exit 0.
diff b35a48e3..66d32530 -- rebuild/m3: 9 files, exactly the 3 product + 5 gss-annex tests + machine-settings-ui.test.mjs (4.2).
D-EPP-1/-4 quotes equal f0a5eb1a:87-91,104-106; D-EPP-3 payer "the S9 seal chain" at :103. No EPP acceptance or S9 carriage at :646-:779.
caa0abf brief = ffc10ea brief +20/-3 (fold paragraph, S9 and C-UI rows, step 1, boundary section); every one of those 20 lines is
present in the worktree brief or restated with citation (header, 2, 12.1, 14). "This fold needs independent review" was rightly
dropped: :740 records the fold accepted (f41121f) and names caa0abf paper-of-record.
## NAMED DEBTS (each cites the line it contradicts or omits; none changes a STOP into a pass)
D-S10B-CI-627  brief 10.2:493-500 and 13 say the GSS exact-head step-13 red must be "diagnosed by its owner and either paid in the GSS
  lane or shown to belong to the S9 parent" before Track B enters. :627 already rules the cause class: step 13 (b-package --ci S8)
  refuses SEAL-BASE-IS-NOT-THE-CHAIN-TIP on EVERY lane branch from its first append after base, whatever it touches, and hosted CI is
  measured at the merge-forward (:565), not on a lane; :650 and :700 record the same pattern for the split, EW2, GSS and CUI bases.
  As written the STOP can never be satisfied inside the GSS lane. Rewrite: cite :627/:565; the evidence owed is exact-head both-OS CI
  at the composed S10 candidate (12.14), and the hosted refusal name stays unread, so no green is inferred either (:627).
D-S10B-GSS-707  brief 6.2:286-289 gives the GSS base chain as 79d981a7 -> 66d32530 and cites only :765 for superseding "Candidate 04ea
  in independent L3 review". The line that made 04ea69e an accepted input is :707 (Claude l1 50e2886, ACCEPT WITH DEBTS at 04ea69e,
  base b35a48e3): add 04ea69e (:701, :707) at the head of the chain. :707 also rules "LISTEN stays TODAY-OUTCOME-TYPE" (D-GSS-LISTEN,
  50e2886:51-53: hooks.listen drops a fourth argument, same shape as D-SPLIT-LISTEN): section 1 child 2 must name it beside D-SPLIT-LISTEN.
D-S10B-FENCE  brief 4.2:200-205 enumerates GSS 66d32530's test changes as five gss-annex files plus machine-settings-ui.test.mjs and
  says "Between them the diff under rebuild/m3 touches only ..." (4.1:189). Outside rebuild/m3, rebuild/lanes/c/today-split/
  writer-fence.test.mjs changes +222 lines in that range (git diff --stat, explicit path). It is the fence that pins the S-R30
  exception sites (:626 (3)(4)); name it in 4.2 with its own declared role and CI home.
D-S10B-PARSER  brief 6.1:281-282 "no parser may be installed to close it (RULES: never npm install)" overstates the accepted wording
  (ae96e30: "parser absence is not a pass or permission to install"). D5 (175f6323:95) requires "the real eslint-scope stack"; the
  brief must say how that stack is provided (existing junctions or a PM ruling), or D5 is unpayable by its own text.
D-S10B-FLAG  brief 5:260 "S10 does not pay any of these": the gym subjects' in-flight flag (:626 (5)) enters S10 as accepted Track B
  bytes. Say "S10 authors none of these; the gym subjects arrive as the Track B input".
D-S10B-D2  brief 6.2:297-299 keeps "D2 annex coverage" as a retained debt while 6.2:300-301 records D-GSS-ANNEX-SILENT closed (:765) and
  :707 closes the D2 census at 12 ("no cell is owed"). Reconcile: what remains from :628 is D-GSS-TIMER, D-GSS-PASSTHROUGH (the
  destructure-aware api.lane census, expressly "a question for S10's brief"), D-GSS-LINES (M/R/N), and the six scope rows (:653).
D-S10B-EPP-OBS  (optional, non-blocking) at fe9f14b: git grep proposed-pick in S9.json, rebuild.yml and the S9 brief finds nothing and
  rebuild/engine/test/proposed-pick.test.cjs is absent (ls-tree). Recording this as OBSERVED, non-final, would show the S9 PROPOSED
  package does not carry EPP today; the 7.2 STOP stands unchanged.
## OPEN QUESTIONS Q1-Q7, where the ledger settles them
Q1 SETTLED: :635 point 1 keeps Claude as the independent reviewer of the data path and the final read before a seal; :636 made it a
  CLAUDE REVIEW ASKED line; :778 fixes that reviewer's model as Fable 5.1 in a separate session. "The PM's Fable final" of :626 (4) is
  now the Claude Fable 5.1 final, not a PM-seat act. Brief 5:262-264 should say so and drop the open question.
Q2 SETTLED: :778 "No other rule changes"; :635 keeps a separate Astra review of a builder's work. Both remain: Astra independent review
  (12.8) and the Claude Fable final (12.9). Brief 11:542-544 may close the question.
Q3 NOT SETTLED by the ledger: f0a5eb1a names "the S9 seal chain"; :631 allows S10 carriage; a PM ruling is needed. Brief 7.2 is right.
Q4 PARTLY SETTLED: :707 closes the D2 count at 12; :765 closes ANNEX-SILENT; api.lane census stays S10's (:628 D-GSS-PASSTHROUGH);
  M/R/N and TIMER stay (:628); six scope rows stay (:653, :662). See D-S10B-D2.
Q5 NOT SETTLED: :765 only carries the note into S10 (1b41692); copy-lock owner and PM decide. Brief 6.3 is right to keep it open.
Q6 SETTLED in kind by :627 (see D-S10B-CI-627): no lane diagnosis is owed; exact-head both-OS CI at the composed candidate is.
Q7 SETTLED: :740 "E17/fold f41121f accepted ... S9/S10 paper-of-record caa0abf"; :735 had it pending. Carrying it is correct.
## NOT DONE
No cell, suite, CI, seal tooling or runtime; no protected path, private fixture, ledger directory, src, soak or quarantined scratch
opened. I did not re-audit accepted GSS or split internals. Scratch: %TEMP%\earned-s10-review (git show copies of public papers only).
