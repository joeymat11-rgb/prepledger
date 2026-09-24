# REVIEW NATIVE-LOAD-SPEC R9.1 (l6) - reviewer claude-fable-5-1

Input: earned-astra-96 rebuild/coach/NATIVE-LOAD-SPEC.md uncommitted, sha256 df90e70f...e8d9c8 (verified), numstat +24/-7 vs b849508 (verified). Diff read blind, then Astra R9 L1. Static reads on the build-0e4fc74 scratch copy (public files only; no protected file, no src/, nothing executed this round).

## 1. Is each item paid?
- D-R9-1: paid. S8 "actual loads" now = the values S4 binds (original fact + the record's listed edits); post-yes correction stays BASIS_REPAIR_REQUIRED.
- D-R9-2: paid. LEGACY-EARNING COST stated in :127 and in N26's legacy control row.
- B-R9-1: paid. DECODE FIRST names the wire shape (presence wrappers, typed Loads), dec(), ABSENT vs null, unit 'lb', wSets presence agreement; N25 gains the genuine-v1 control under R1/R2.
- B-R9-2: paid. RESIDUAL widened to inc/steps, ineligible candidate (hot opener PROPOSED 110, DEBUT 105 without a comparator) and unproved order/context; ADMISSION GATE binds now, names the import refusal (today-bindings.mjs:644-656) and sync as gated; N28 carries it.
- B-R9-3: paid, more strictly than asked: a pre-FC16 capture never earns; adoption and compensation are exempt (N10 baseline row in N26).
- B-R9-4: paid. RESTORE (applied adoption: target = recorded base) vs RETIRE (queued/held/conflicted: no w write, target display only, not compared); S2 for compensate = ['native-load-compensation', lift, compensates], verified at native-load.cjs:341/:360; tombstone :342 and descendants :336/:344 kept; N24 routed through the RETIRE case; :208 reconciled; stale B0/G/H closed by note 9.

## 2. Cost of the stricter legacy rule for Joe's trial
Acceptable. On an existing install each lift loses at most the earn on its last pre-FC16 completion: the next completion is captured with window_hi and earns normally; facts and sightings still count; adoption is untouched; accepted records apply under :793. New installs never see it (every exercise starts w:null, athlete-state.cjs:55-56,:134-136, so the first workouts are DEBUT/adoption anyway). Condition: FC16 must land in the same seal as FC01/FC03, otherwise no lift earns at all; the spec should say that in one sentence.

## 3. "Set a new working weight": does the route exist? NO.
- plan-edit-commands.cjs:46 CHANGES = ['n','day','sets','hi','inc','steps']: an athlete plan edit cannot carry w; plan-edit-model.cjs:347-352 forces w:null on every projected row. plan-edit-host.mjs has no screen importer; replay-registry.cjs:100-115 records that no shipped screen reaches a plan writer.
- machine-settings-commands.cjs:94-95 (the GSS candidate) writes class 'event' kind 'fact' with payload {machine}: equipment rungs only, never w, and not a plan op.
- client/index.cjs:348 planEdit({domain,value}) writes a plan-mutation member named by domain (plan.cjs:15 knows 'press' in lb); no engine or m4 reader maps such a member into an exercise's w, and source-admission.mjs:170 refuses a non-empty plan collection in the local era.
- The only writers of w today are native-load itself: adoption and earn landing. Under NO TRAP those are refused while the lift is held, so exit (b) is circular.
Consequence: NO TRAP promises "both exits" and N27 asserts "an explicit plan op setting w 102.5 ... releases the hold", but no such op exists; after exit (a) (compensation) the invalid record still holds the lift, permanently. That is the trap the PM directed against, restated as if closed.

## 4. Contradictions
- C1 (blocking): NO TRAP exit (b) vs the codebase, above. Fix options, PM's choice: (i) add w to plan-edit CHANGES with a training-domain reader (a new FC, counts +1 under every answer, own N row), or (ii) let a hold pass step 3 so an adoption accepted after every holding record is exit (b) (adoption is window-free and its record is a plan op), and rewrite N27 to that op. Either way :158, N27 and the FA02 control text must name the real writer.
- C2 (wording): :127 says the window rule "binds only the earn branch (steps 4-10)" yet "runs ... before any reader of steps 3-10"; state that it is evaluated after step 3 chooses earn, or that its refusal is suppressed when step 3 yields adoption.
- No conflict found between THREAT MODEL, ADMISSION GATE, ORIGINAL CUT, :208 and the table rows; refs/field shapes match :176.

## Verdict: REJECT (one blocking item, C1)
Everything Astra and I raised is paid on paper; the new NO TRAP clause is not, because its second exit names a writer that does not exist, and N27 as written cannot be built. R9.2 needs C1 resolved and C2 worded; the FC16-same-seal sentence from section 2 should ride along. No debts otherwise beyond D-R9-CAPTURE/EDIT/DELIVERY already listed.
