# REVIEW NATIVE-LOAD-SPEC R9 (l5) - reviewer claude-fable-5-1

Input: earned-astra-96 rebuild/coach/NATIVE-LOAD-SPEC.md uncommitted, sha256 88371bfd...7af94f (verified), numstat +15/-5 vs b849508 (verified). Read the diff blind (:18, :127, :155-157, :179, :188-189, :227-228, :236, :274-275, :306-307) before the report. No protected file read or executed; one probe on the 12 public factories (build-0e4fc74 scratch copy, runtime lock held, lift invented).

## 1. S1-S8 + DERIVABLE against Astra L7
- The 12 forgeries fall by the named fields: relabelled lift (S1/S2), spend pointing at another lift (S2), self-made or foreign Start/Close (S3), evidence not matching authentic slots or edits (S4), coverage/order gaps (S5/S6), foreign source basis (S7), inflated base_load (S8), inflated candidate or target (DERIVABLE, r2 gated on ladder+PROPOSED+at_least 3), forged adoption (target must equal authentic actual loads), forged compensation (must equal an effect's recorded base_load, can only lower). Matches N25.
- Genuine records survive rename (S1 uses lineage id, not name), window edits (S1-S8 never read hi; the window rule is step 2 of a NEW check, not FC03 replay), cache rebuild (only authentic ops and the record's own load_basis are read). Edits after the yes pass S4 because the recorded edits need only be a prefix of the current edit Refs.
- Bypasses tried on paper: consume an older, heavier authentic session (S8 anchors to the latest consumed Start; base above the current effect is the movedBase EFFECT_CONFLICT of D7b, held not applied); double-consume the same session (spend_id tombstone, DECISIONS:792); rung inflation via load_basis.inc/steps - real, and it is exactly the RESIDUAL. None executed: S1-S8 are not in any build yet, so there is nothing to run against; execution belongs to the build review of the commit that implements them.

## 2. Threat model (:18)
Fair. Direct store writes and a hostile device with the signing identity are out of scope and named as such; everything that reaches FC03 (local host, cold boot, reopen/rollback, import replay) is inside and covered by S1-S8. Import is the only path that admits records not produced by the guarded host and it stays stopped (FC09/FC10 SOURCE_FRONTIER_UNPROVEN), so the RESIDUAL has no live entrance today.

## 3. FC16 old readers
Safe. capture.cjs:12 CELL=['state','display','source_json'] and :54-61 check only those cell keys, the state enum, display text and strict JSON of source_json; inner keys of the parsed source are not enumerated (copyData only). Readers of the reps cell (native-load-effects.cjs:171-172 value/unit; prepared-panel.mjs:210, gym-model.mjs:70/:359 display/state) ignore extra keys. Additive window_hi cannot fail an old validator or reader; the revision moves anyway (engine-capture.cjs is in the 14).

## 4. Legacy-capture rule (:127) - never offers in the ambiguous case
Confirmed by reading: B25 refuses when a captured target exceeds current hi; B27 refuses when a performed rep beats the largest captured target while hi sits above that target. The forged (hi lowered onto the performed rep) and genuine (hi reached above target) shapes are byte-identical without window_hi, so refusing both is the only sound choice. Cost, executed: genSession on the factories gives captured targets below hi in the ordinary progression (sets 3/hi 10 -> [8,8,8]; sets 2/hi 12 -> [10,10]; last [10,10] -> [11,10]); target equals hi only when last already sat at hi. So a pre-FC16 completion that reaches hi from a lower target is always PLAN_CHANGED: legacy captures earn only where target already equalled hi. Correct, but the spec should say this plainly (transition note).

## 5. RESIDUAL honest
Yes: it names inc/steps as unanchored, states the exploit (heavier rung from an authentic base), states why it is unreachable today and names the two closures (issuer attestation per D-B7-1, or an authenticated equipment anchor) with the PM decision point before import delivery. Nothing in the paragraph overclaims.

## 6. Contradictions / ambiguity
- D-R9-1 (ambiguity, not contradiction): S8 for earn says "the latest consumed completion's actual original loads equal that vector (step 3)". If a reader takes "actual" from the CURRENT edited slot, a genuine record whose loads were corrected after the yes turns RECORD_INVALID, while :157 says a post-yes correction is BASIS_REPAIR_REQUIRED with the effect kept and compensation reachable. S4 already fixes "original" to the pre-edit value; S8 should say "original (pre-edit) loads, as S4 defines original" so the two rules cannot be read against each other.
- D-R9-2 (omission): the legacy-earning loss in section 4 is stated nowhere; one sentence in :127 or N26.
- No text conflicts found between :127, :155-157, :179 and the refusal table; refs/field shapes match :176.

## Verdict: ACCEPT WITH NAMED DEBTS
D-R9-1 wording of S8 "original", D-R9-2 legacy-earning transition note. Neither changes behaviour; both are one-line edits. The build that implements S1-S8/DERIVABLE/FC16 must carry N25 and N26 executed and gets a fresh review; the RESIDUAL decision (attestation vs equipment anchor) must precede FC09/FC10 delivery.
