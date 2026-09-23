# REVIEW NATIVE-LOAD-SPEC R9.3 (l8) - reviewer claude-fable-5-1

Input: earned-astra-96 rebuild/coach/NATIVE-LOAD-SPEC.md uncommitted, sha256 8a9dea77...acd4a1 (verified), numstat +33/-11 vs b849508 (verified). Diff read blind, then Astra R9 L3. Executed r93-probe.cjs on the 12 public factories (build-0e4fc74 scratch copy, runtime lock held, invented lifts fx-press/fx-row); static reads of today.cjs:53-112, native-load.cjs:324-357, engine-capture.cjs:64.

## Payments
- l7 G1: paid. HELD PROJECTION names the replacement of quarantined:true, the queue-entry drop and the all-held day refusal (D-B2-1); :168 and the FC08 row carry it.
- l7 G2: paid. APPLIED BASE: Undo evaluated on the fold's applied state. Verified against the build: a repair-disputed applied adoption still has native_load_authority kind 'adopted' (:346), so FC01 takes :355-357 (prior image), base 60 / target null, RESTORE by shape; DERIVABLE's RESTORE test (target = the adoption's recorded base, all null) passes.
- l7 G3: paid. OTHER COMPLETIONS: pre-hold Start on a numeric card -> PLAN_CHANGED [Close Ref] (matches :179's plan-op-less form); pre-hold baseline capture or unlinked device-B completion -> the hold's own code and refs; LEGACY_PENDING kept.
- Astra B-R9-6: paid and executed. With the lift's native entries hidden, genSession gives fx-press {w:null, tgt:[0,0,0], baselineAsk:true, isDebutNow:false} and fx-row its normal 80/[8,8,8]; with the entry visible (old build) it gives w:105 + baselineAsk, which engine-capture.cjs:64 refuses for the whole day. D-R9-RECOVERY-SCOPE correctly limits exit (b) to :144-145.

## N27 (c)-(e), attempts to break
- (c) holds as above; a coApproved rider on another lift does not change it; hidden entries stay in the fold (spend, TARGET_QUEUED for earns), so no 105 reaches a card or lands without the adoption's yes; Undo on C2-captured Q105 is COMPENSATION_DESCENDANTS by :344 (later row), unchanged.
- (d) holds; see G2. The reverse misclassification is impossible: a RETIRE issued on the applied state has target = base by :353.
- (e) holds; a Start captured on the old numeric card and closed after the hold is explicitly PLAN_CHANGED, so no completion straddling the hold can adopt.
- Break found (named debt, executed): the projection hides NATIVE entries only. A LEGACY debut/unlock entry (kind 'unlock', newW 110, no native_load_spend) on a held lift is still selected by today.cjs:55, :98 sets w 110 with baselineAsk true, and engine-capture.cjs:64 throws ENGINE_CAPTURE_BASELINE_UNPROVEN: the day is refused, exactly what NO TRAP forbids. Reachable only if a lift carries a legacy branch and a native hold at once (a RECORD_INVALID record can sit on any lift), so rare, but the text must say either that every debut/unlock entry of a held lift is hidden from selection, or that a lift with an active legacy branch is not projected null (LEGACY_PENDING precedence), and N27 needs the row.

## Verdict: ACCEPT WITH NAMED DEBTS
D-R9-LEGACY-ENTRY (above; one sentence in HELD PROJECTION plus an N27 row). Existing debts D-R9-RECOVERY-SCOPE/ADMISSION/CAPTURE/EDIT-RECOVERY/DELIVERY stand. No contradiction found between NO TRAP, HELD PROJECTION, APPLIED BASE, OTHER COMPLETIONS, :156, :168, the FC08 row and the table; nothing raises a load or releases a hold without a yes.
