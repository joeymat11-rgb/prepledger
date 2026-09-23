# CLAUDE REVIEW: S10 working brief revision 2, round 2
Reviewer: Claude Fable 5.1 (:635 point 1, :778). Paper only; no runtime, no lock; worktree under review not modified.
Hashes verified first: S10-WORKING-BRIEF.md d9ae6b54a728a9d4115a46f0141825204bac0abe62e8c60fc555cb97885bc355 (686 lines);
REPORT aa2f83e877e7166838b1e820d0b1b6bd89be92707b3019a9964da6da7fcc9fa1 (59 lines); branch rebuild/b-s10-working-brief at ffc10ea.
Ledger: origin/rebuild/t2-client-core d9464f2, 780 lines; :780 read whole. Disclosed slip: my first command ran git fetch of that one
ref in the reviewed worktree (remote-tracking ref only; no file, branch or index touched; hashes above re-taken after it).
## VERDICT
ACCEPT WITH NAMED DEBTS. All seven round-1 debts are paid in substance; no STOP weakened; debts, survivors, four exceptions,
"SO AFTER S10", guard (4), section 14 unchanged; diff against caa0abf loses no accepted line (62 removals, each restated or replaced
per D-S10B-D2). Two citation defects (D-S10B2-780, D-S10B2-TIP) must be fixed before adoption: a citation must match its line.
## 1. DEBTS OF ROUND 1: PAID
CI-627: 10.2:545-567, 2 GSS row, 2.1 row, 12.1, 13; owed evidence is the exact-head both-OS run at the composed candidate (:627, :565).
GSS-707: 2:81 and 6.2:310-313 chain 04ea69e (:701, 50e2886, :707) -> 79d981a7 (:754, :759) -> 66d32530 (:765); 1:58-61 D-GSS-LISTEN.
FENCE: 4.1:201-205 and 4.2:220-224; numstat +177 -45 and blobs f50a41a7 -> 09a6dd18 equal my explicit-path measurement.
PARSER: 6.1:300-304, 2.1:116, 13:655. FLAG: 5:279-280. D2: 6.2:321-341 (TIMER, PASSTHROUGH, LINES :628; six rows :653/:662).
EPP-OBS: 7.2:418-424; ls-tree and grep results equal mine (cell absent; no proposed-pick in rebuild.yml, packages, S9 brief).
## 2. FOLDED RULINGS AGAINST :780's WORDING
:780 text for S10: "Q3 if EPP rides S10, D-EPP-3 moves and S10 seal chain pays; Q5 copy lock covers every user-visible string state
incl c6fb3017 N2". Brief 7.2:437-440 (Q3) and 6.3:360-364, 8:469-472 (Q5) match it. Q6 (10.2 as :627) and Q7 (:740) as I settled.
D-S10B2-780  Brief 5:282-284 and 11:609-612 cite "PM ruling, DECISIONS:780" for Q1/Q2 (the :626 (4) final is a separate Claude
  Fable 5.1 session; Astra review stays). :780 says nothing about Q1, Q2, the Fable final or the Astra reviewer. Those two passages
  must rest on :635 point 1 and :778 alone (which do settle them) and drop the :780 citation.
D-S10B2-TIP  Header :7-8 says line numbers cite DECISIONS "at 37a18d21" and :28 "later rulings through :779", yet the paper cites
  :780, which exists only at d9464f2. Re-point the header to d9464f2 / :780 and strike report O1 (the line now exists and was read).
## 3. O2: b98f375 "authorized successor package" = the S10 reseal. RIGHT, with two qualifications the brief should carry
b98f375 measured SEALED-PROFILE-RECOMPUTATION at 04ea69e and b35a48e: UI-test and adapter-test bytes differ from S8 executionPins.
Those bytes are the split's and GSS's, whose pins :628 G-R1, :633 S-R33 and :653 class (b) assign to S10; S9 forked at 8c2bc36e.
Qualification 1: b98f375 does not name S10; say "this paper's reading" (10.2:559 does). Qualification 2, OBSERVED and missing from the
brief: S9 fe9f14b ALSO edits rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs (aad0c62 S9-PREP-A, +18 -1 vs 8c2bc36e,
blob 6f70c0e2), while the split edits it +9 -2 (037e9624) and GSS to 5626b88f. At the S9 parent Track B's test file is a three-way
merge, not an apply; 6.2:344-346's STOP-and-merge-forward rule fires by construction. Record it as OBSERVED in 4.2 so it reads as
expected, and require the merged test to be re-pinned and re-run red-first on both systems before any Track B claim.
## 4. O3: do the writer-fence changes in 66d32530 touch S-R30 exception-site rows? MEASURED (git diff b35a48e3 66d32530 --
rebuild/lanes/c/today-split/writer-fence.test.mjs, 334 diff lines read whole, no execution)
(a) today-app 32 model sites / weigh-in and (b) food and sleep hooks / twelve copy values: NO row touched; the only today-app text
  in the diff is unchanged context (E.5 row 8) and a NEW count row (GSS-GESTURE-CONTROL: today-app 0, today-lanes 2).
(c) paint's model.start: the GA-M06 seam text is byte-identical, but its container drops the five gym writer seams (recordSettings,
  logSet, finish, forget, undo) and GYM_DECLARED_SITES 6 -> 1; a new row re-pins `const started = await model.start();` and the six
  hooks.paint roots. Ordered by :628 G-R2 (the five seams sealed) and G-R5 (six-call-site shape): a PM ruling, so guard (4) holds.
(d) facade lane acquisition: RELEASED_FILES gym-app `lane:` loses its three facade.lane() spellings (lane: []); replaced by api.lane
  exact-mapping rows (GSS-API-PARITY exactLane 1, GSS-NO-HOST-LEAK). Ordered by :628 G-R4 (api.lane the one pinned passthrough).
  The Today facade (the 37 getters of :626) has no row in the diff. Also LISTENERS_OUTSIDE_SHIM gym-app 19 -> 0 (:628 G-R3).
D-S10B2-FENCE-RULING  4.2:223-224 says the rows "change only under a PM ruling" but names none. Name :628 G-R2/G-R3/G-R4/G-R5 as
  the ruling for the gym rows above, state that no today-app exception row changed in b35a48e3..66d32530 (this measurement), and
  require S10 to re-assert it at the integrated bytes. Tidy-up, not blocking: LOOK_EDITS keeps three dead keys for the removed
  facade.lane() spellings (fence :1254-1256 at 66d32530); GSS or S10 should drop them with a row, not silently.
## 5. NOTHING ELSE REGRESSED, one wording debt
D-S10B2-FAMILY  2:90-91 "which :627 says every lane branch is": :627's family is SEAL-BASE-IS-NOT-THE-CHAIN-TIP; b98f375 read
  SEALED-PROFILE-RECOMPUTATION at both GSS heads and 10.2:560 admits 66d32530's name is unread. Say "a lane step-13 red of one of the
  two design-class families (:627; b98f375)"; the conclusion (no lane diagnosis owed, evidence at the composed candidate) stands.
