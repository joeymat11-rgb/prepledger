# CLAUDE REVIEW: NATIVE-LOAD-SPEC, round 3, final (class (a): the paper orders engine bytes)
Reviewer: Claude (claude-fable-5-1), independent, review only; author of rounds 1 and 2. Builder: Claude Opus.
Hashes VERIFIED first: rebuild/coach/NATIVE-LOAD-SPEC.md 8984c62d...541d02 (375 lines, uncommitted M); the R3 report is
rebuild/coach/NATIVE-LOAD-SPEC-R2-REPORT.md eac1fe7b...99cd19 (55 lines, untracked; same file name as R2, as :5 says).
Diff vs 264f76a: 29 hunks; every R3-changed line read (:5,:68-72,:154,:202,:220,:229,:264,:267,:281,:292,:331,:343,
:357,:363-365). DECISIONS:780 read (explicit path). Worktree not modified; lock taken for one probe and released.

## VERDICT
ACCEPT WITH NAMED DEBTS (D-NLS-7, one-line). D-NLS-5 and D-NLS-6 are paid; H6/H7/H8 are settled correctly; nothing from
rounds 1 and 2 has regressed (every earlier section re-grepped: B0, coexistence, capture :69-70, two views, TARGET_QUEUED,
COMPLETION_SUPERSEDED, FC14, N21, inventory table all present and unchanged in substance).

## 1. D-NLS-5, tried to break
YES (:154, :202): apply the recorded body when the revision is absent, structural checks only, issue
  PRODUCER_REVISION_ABSENT_APPLIED, re-validate only when present. Correct; landing prices nothing. Holds.
NO (:71-72): durable {class:'plan', kind:'native-load-automatic', payload:{proposal_id, issuance}}, no answer field;
  written by FC08 in its OWN transaction after the Close is durable, never at Finish or inside the Close.
  Replay double-application: log search by spend_id before staging, identical bodies coalesce, overlapping
  incompatible bodies EFFECT_CONFLICT; two devices produce one effect with all refs. Holds.
  Crash between Close and record: next projection under the same revision re-derives and writes; under a later
  revision derives nothing (PRODUCER_REVISION_UNAVAILABLE) and the tops stay unspent, so the next top under the new
  capture carries run 2 and earns then. The rung is delayed one session, never doubled and never lost with its facts.
  Derivation never happening across a re-seal is therefore bounded and stated. Holds.
  Revision gating through the Start capture (commands.cjs:67 prescription_capture.producer): verified in round 2.
  N22 (:264, :292) covers R1->R2 swap, lost ack + restart = one record, Close first projected under R2 = nothing.
  Two gaps, small: (i) :72 says the record goes "through the guarded capability (FC06/FC07)", but :161 still says only
  'respond' with 'accept' reaches FC06 and :213-214 carry no [NO-ONLY] command; the NO branch needs a second guarded
  command (client.recordAutomatic) named in FC06/FC07 with the same fences. D-NLS-7. (ii) Until the record is durable
  the projection shows the derived entry with AUTOMATIC_RECORD_PENDING (:72) and FC03 also runs on "new capture" (:154):
  a Start could capture a pending entry whose record then never lands (write failure, then re-seal), leaving a captured
  debut with no queue entry. Recommend one sentence: a pending automatic entry is not capturable. Note N4, not a debt.

## 2. FC15 and counts
index.cjs:356-357 refuses any issuance unless answer is 'accept' and validIssuance holds; :360-363 digest check; :164
  and :225-233 enumerate plan kinds by name. So a record without an answer needs FC15 in rebuild/client/index.cjs (F in
  S8; other pins on this shared client file are unmeasured, as :220 says). Counts recomputed: YES 13 / 15 / 16; NO 14 /
  16 / 17. The options paper's 15/17/15 is a PLANNING ESTIMATE, not a constraint: EARN-ON-PHONE-OPTIONS.md at 686010d5
  :361 "SIZE: ESTIMATE 15 + R incremental component files" (A), :385 (B, 17), :406 (C, 15), labelled by :46 "ESTIMATE
  labels proposed scope" and :631 "Changed source-line counts were NOT measured or estimated"; a7b0e24 keeps that table
  unchanged (its diff touches only the column heading). Exceeding it by one file is a fact for the brief, not a gate.

## 3. D-NLS-6 and N11, executed (lock free; taken and released)
r3-probe.cjs composed the 12 public factories by explicit name under a Module._load guard blocking the protected five;
  none loaded; invented fixture only. N11 with steps [100,105,110,115] and rirSets [2, token(3)]: queue order PROPOSED
  110 [110,105] then DEBUT 105 [105,100], exactly :281. String ladder: DEBUT only (D1 :267 is right). rirEnd-only
  variant and rirSets [2,null]+rirEnd: SAME two entries, because earn.cjs:61/:74/:95 fall back to rirEnd; so :267's
  clause "an rirEnd-only fixture gives a different, green-looking answer" is not true for the terminal (the mapping
  [o,m,t] is still the right instruction). One word to fix; not a debt. N12 terminal exact 2: DEBUT only.
  N22's derivation parts are fold logic that does not exist yet; not executable beyond the earnWalk step above.

## 4. H6, H7, H8 and G
H6 (:69, :363, H0 (d) :357): yes-required adoption built under both answers, question put to Joe in plain words, N09/N10
  never stopped. Right default; the H0 (d) wording is honest. H7 (:68, :364): B then A under NO, per DECISIONS:780.
H8 (:365): LEGACY_PENDING under every answer, settled by :639/:644 and I6. G :343 no longer says "as today"; it names
  the one difference (an older untaken offer is no longer cleared). Owner section still 14 lines. Consistent.

## 5. Not done
No fold, capture, landing, IDB or import code exists to run; no suite, build, browser or phone; no protected path,
src/, private data, ledger directory or soak file opened. Nothing written outside my review folder; no Set-Content.
