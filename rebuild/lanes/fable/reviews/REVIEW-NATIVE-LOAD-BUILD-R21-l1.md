# REVIEW-NATIVE-LOAD-BUILD-R21-l1 (Fable, independent reviewer of round 21 as a whole: 21a cells + 21b build)

Reviewed: earned-nlr (rebuild/e-native-load-red) uncommitted working tree on 40eb702, `git diff 40eb702 --` the six named files, against
spec R9.13 (the UNCOMMITTED working-tree revision of rebuild/coach/NATIVE-LOAD-SPEC.md in earned-astra-96 on top of e092afa = R9.12 rev 3;
48 insertions, 8 deletions, section N plus edits at :5, :102, :155, :158, :500, :537-538, :555). PM rulings (i)-(v) of 2026-09-25 as the brief
states them. Read whole: the diff (627 lines), spec section N, FC03 :225-300 and :383-480 and :690-790 on the head, L/source-admission.mjs
:405-505 and :837-863, FC12 :1312-1325, the 21a and 21b report sections, Astra's P folder (read only: probes-head.json B5_TYPED_C2). Every
run went through node %TEMP%\pm-run.cjs shared (jobs fable-r21-p1, fable-r21-w1), guard preloaded ("GUARD protected-in-cache: none; refused:
none" in every TAP), TZ America/New_York, MEASURED_TEST_NOW 2026-09-03. Scratch %TEMP%\nlr21-fable (run.ps1, p1.txt, w1.txt, out\*.txt).
Nothing committed, pushed or written to DECISIONS.md; no protected-five file opened or loaded; no worktree file edited.

## VERDICT: ACCEPT WITH NAMED DEBTS (D-R21L1-1 test coverage, D-R21L1-2 spec (viii) unbuilt parts / R7 bound; both before the commit)

Product bytes are sound and implement rulings (i), (iv) and (v) as the spec states them; (ii) and (iii) are on paper and pinned as ruled.
Red-first is real and was re-shown here independently; nothing was weakened; the walk counts are honest (16 shard reports read, my own
shard re-run byte-identical). The two debts are test/paper work, not product changes, and neither needs a ruling.

## 1. Rulings, checked clause by clause

(i) REFS-ARM-EVERY-REVISION, form (B). FC03 refsArm(body,{facts,byId,issues}) :363-381 is the refs half of the old S8 arm, line for line:
null/non-map ref -> false (old: r===null || !authentic(r)); authentic = byId.has(op_id) && commitment equal (old authentic :425); class
'plan', kind 'proposal-response', map issuance body of this lift; holding = an ACTIVE hold of the lift names it; dissolved = NO hold issue of
the lift names it, active or superseded; provenBefore([o], byId.get(latest.start), byId) with latest ranked by facts.order.start_ids (rank
?? -1) and cap over the original slots, exactly as S8 :467-471; a non-numeric capture -> true (numeric-only arm, R9.11 M (1) governs the null
form); no consumes, unresolvable Start or session -> false (correspondence then names its own field); non-adopt-baseline (every compensate
body) -> true. The base-null test stays in correspondence (:479). Correspondence's S8 arm calls it at :482; the gate at :765 is
`present && !changed && members.every(sameCut) && refsArm(body,{facts,byId,issues})` with the SAME facts, byId and issues that the
correspondence call at :768 receives, so a record that fails REFS-ARM takes the correspondence branch under R1 exactly as R2 does: R1 = R2 by
construction. exitB, dissolvedExit, V, the moved-base gate and the exit branch: no hunk. L13-B1-ORDERED-CONTROL green on 40eb702 and after
(a genuine host exit unchanged), L13-B1-REDUCE-I6 and the three seeds red on 40eb702 (re-shown here), green after; R1 path = correspondence.
(ii) REVISION-MOVES. Spec :538's rebind claim is marked SUPERSEDED in place, :102/:155/:158/:500 pointed, the rule and the FOLD-ONLY list
are in N (ii). PRODUCER_REVISION ...1d7dbe40 unchanged (FC03:1131), R2-REVISION green. The four FC03 hunks (refsArm, the S8 call, the gate,
heldProjection) are FOLD-ONLY by the list; (iv) is outside FC03. See F3 on the rule's wording.
(iii) D-L13-TYPED-C2. Spec N (iii) states the boundary, the cause and NO TRAP as a named carried limit; FC12 R913-TYPED-C2-CARRIED pins (a)
the carried tuple [NATIVE_LOAD_EFFECT_CONFLICT, load_basis, [l12-y1 Ref]] = Astra's probes-head.json B5_TYPED_C2 (read here), (b) host v1
C2 offered exactly [adopt-baseline 105, [l12-y1]], (c) the typed-v2 C3 no-trap exit; R1 and R2; green before and after (a pin, as ruled).
(iv) A-LEGACY-VECTOR. L/source-admission.mjs legacyVectorAdmission :850-862 writes ONLY q.newWSets, on a queue item that is not done, not
PROPOSED, kind debut|unlock, no native_load_spend string, finite numeric newW, newWSets === undefined, whose lift has an array wSets, under P
(finite numeric w, every set a finite number <= w); the value is wSets.map(x => x + (newW - w)). Under P every element <= newW, so NO SET IS
EVER ABOVE THE OLD APP'S CARD newW; it never creates, deletes or re-kinds an entry (NO DEBUT IS MINTED); a converted entry carries newWSets
and is skipped on the next run (idempotent); an out-of-P entry is left as is and named (N-Q1). replay() calls it once (:493) after the
document-lift append (:483-485) and before the first family read (`reading(...)` :494); programme() ran at :438, before it; the replayed
state is not a digest input (the same precedent as athlete_label at :460-463). Not engine, not engine-capture. My mutant fable-m1 (P's
`x <= ex.w` dropped) is killed by R913-ALV-P and -IDEMPOTENT (4/6). The five builder mutants (iv1-iv4) are as reported.
(v) LEGACY-OVER-NULL. heldProjection :265-273 first projects the held lifts as before (projectHeld legacy:true, unchanged), then hides every
unfinished legacy debut/unlock entry of any lift whose PROJECTED w == null; native entries keep the held-only rule; projectHeld as the fold
(:696) and the check (:993) call it is byte-unchanged (diff), so LEGACY_PENDING still sees the entry (measured: the check on the baseline-ask
completion refuses NATIVE_LOAD_LEGACY_PENDING [Close Ref] 'queue', w stays null, no authority, no 'adopt:' receipt). heldProjection's only
callers are L/today-bindings.mjs :605 and :677 (the registered/host projection). Nothing raised: hiding an entry never prescribes a load.
R20-RESTORE-OVER-LEGACY is flipped, not deleted, with its 40eb702 output named as the retained red; -CONTROL green-kept; FA03 -HOST red under
the old FC03 and green on the head, D1 and a cold reopen on D3.

## 2. Red-first, re-shown here (independent of the builder's scratch; in-memory only, no file written)
- 40eb702's FC03 blob (extracted byte-exact, sha256 373c9b1c... = the spec's READ BASIS) swapped in memory under the head FC12 (SWAP applied
  1), rows ^R913-,^R20-RESTORE,^L13- strict: 21 tests, 15 pass, 6 fail = R20-RESTORE-OVER-LEGACY, L13-B1-REDUCE-I6, the three L13-B1 seeds,
  R913-LEGACY-OVER-NULL-UNHELD (out\red-fc03-rows.txt). Exactly the rows the reports call red; -CONTROL, -TYPED-C2-CARRIED, L13-B2/B3 and
  -ORDERED green on the old product, as claimed.
- A-LEGACY-VECTOR markers hidden from FC12's reader (fsoverlay applied 1): R913-ALV-* 0/6, all RED A_LEGACY_VECTOR_ABSENT (out\red-alv.txt).
- FA03 R913-LEGACY-OVER-NULL-HOST under the 40eb702 FC03: red (out\red-fa03.txt). Walk seed 20261046 (RUNS 1, ALL 1): red at the widened
  I16 under the old FC03, green on the head (out\red-walk-20261046.txt, out\green-walk-20261046.txt).

## 3. Runs on the final bytes (my own, pm-run shared)
- FC12 whole: 234 tests, 230 pass, 0 fail, 4 todo (the KNOWN_RED L13-B1 rows print "ok ... # TODO"); strict ^L13- 11/11; FA03 47/47.
- sha256 recomputed here = the builder's for all six files (b25d2e61, 10bd5cfb, f5380f51, 285027b0, bcc6df4d, 38eaba3a); CR 0, ASCII only;
  FC01 92a4a0b4 unchanged; node --check passes for L/source-admission.mjs and the w6 admission test file.
- Walk: the builder's 16 shard reports (%TEMP%\nlr21b\out\w-*.json) each carry runs 4250 and found 0 (68000 seeds, four intervals of
  17000 from 13024001, 20261001, 1000001, 5000001); the coverage maps show legacy draws, vector toggles and LEGACY_PENDING refusals in each.
  My own re-run of Astra's first shard 13024001 x 4250 (ALL=1, out\w-13024001.json, 379 s): found 0; coverage map byte-identical to the
  builder's shard (legacy 1728, vector 1498, LEGACY_PENDING 532, i17-exit-refs 1483, class-base 942). The walk is deterministic and honest.

## 4. Findings
F1 (MEDIUM, test coverage; D-R21L1-1). My mutant fable-m2 on FC03 refsArm, `return ar.length > 0 && ar.every(ok)` -> `return ar.every(ok)`
(an adopt-baseline with a NUMERIC capture and EMPTY authority_refs passes REFS-ARM in the gate and in correspondence), SURVIVES the whole
FC12 strict: 234/234, OVERLAY applied 1 (out\m2-emptyrefs.txt). The product refuses that record (base_load) and the guarded host never
issues it (exit (b) fills the active holds' Refs), so this is a forged-record guard with no pin. The clause predates round 21 (the inline
`!ar.length` of R9.9) but round 21 moved it into the shared function and none of (r1)-(r3) covers it. Ask: one FC12 row, test bytes only,
e.g. R913-REFS-ARM-EMPTY: the L12-B5/reduce input with the exit's authority_refs rewritten to [] -> RECORD_INVALID base_load [its response
Refs] active, not in spent, w and card unchanged, R1 and R2 (under fable-m2 R2 would apply it: an unverified adoption over the held base).
F2 (MEDIUM, spec (viii) partly unbuilt; D-R21L1-2). (a) The R8 twoDevice transform (FC12:3183-3195) is fixed by construction (each op gains as
parents the op(s) immediately before it on its ORIGINAL device, byDev computed before the move; the plan ops of device d move to
'fx-2dev|'+d in original order; I checked the closure argument: sound), but the walk does NOT assert the rule's precondition (provenBefore
identical for every pair before and after each transformed log, "fails loudly, never a skip"); no provenBefore call exists in FC12. (b) The
R7 transform (FC12:1315-1321) keeps the order-adding shape (one global device_seq sort chained, every plan op on one device B) and was
neither checked nor reported, as (viii) requires. (c) The R7 bound was not re-run on the changed FC03 (the report says so). None of this is
product; the walk evidence of record for (i)/(iv)/(v) is the R8 bounds, which are complete. Ask: the PM runs the R7 bound (shared shards)
before the commit, or rules (viii)(a)-(c) carried to round 22 by name.
F3 (LOW, paper). N (ii)'s RULE opens "whenever a change can alter what checkNativeLoad issues for some input" and then exempts FOLD-ONLY
hunks. The two are not the same test: (i) is FOLD-ONLY by the list, yet in the unproven layout it changes which records the fold holds, and
the check issues on the fold's holds (holdRefusal, the exit's Refs fill), so for that input the check's output does change. The four hunks
are classified correctly BY THE LIST; the PM should make the list the rule (or say "the issuance function over a given fold") so N-Q4 is
not decided by wording. No byte change.
F4 (LOW, wording). Ruling (iv)'s "trailing sets equal or lower" is a property of the imported vector, not of the conversion: P does not
require ex.wSets non-increasing, so [95,100,100] at w 100 converts to [100,105,105]. No set is ever above newW, so nothing is raised above
the card either way; the spec's PROPERTIES paragraph ("exactly as ex.wSets had them, a uniform shift") is the accurate statement.
F5 (LOW, housekeeping, before the commit). (a) KNOWN_RED 'L13-B1' (FC12:4887) is still registered: in the default run the four L13-B1 rows
print "ok ... # TODO", so a regression there would NOT fail a default whole-file run; delete the entry (the 21a convention names the PM).
(b) The round-21b report header says "spec R9.13 at e092afa": R9.13 is the uncommitted astra-96 working tree on top of e092afa (R9.12 rev
3); commit the spec and cite its hash in the report. (c) STOP-R21B-1: the three w6 admission cells (R913-ALV-CONVERT/-KINDS/-IDEMPOTENT in
test/local-source-admission.test.mjs) have run on no seat; they parse (re-checked) and must run where the protected suites run (CI) before
the seal; local-today-journey's two C4b page-pin failures are pre-existing on 40eb702 per the report (not re-run here).
F6 (INFO, for the PM's N-Q2). (v) creates the standing state the spec names: a w-null lift with a hidden pending legacy debut shows the
baseline ask every day and the check refuses NATIVE_LOAD_LEGACY_PENDING on every completion (measured in R913-LEGACY-OVER-NULL-UNHELD), so
no adoption is ever offered and w stays null until a plan authority or a re-admission clears the entry. Nothing raised, no refused day; it
should be a named product limit for the trial (spec's option (a)) so the athlete-facing behaviour is known.

## 5. What I could not do
- Run the w6 admission cells or anything loading the protected five (guard; STOP-R21B-1 stands). - Re-run the R7 bound (F2 (c)); an
independent 4250-seed R8 shard was run instead. - The 80-file broad set (exclusive; not in the brief).
