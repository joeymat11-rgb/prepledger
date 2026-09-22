# CUI sequencing amendment proposal
Status: PM-authored proposal for independent review, not an effective ruling or acceptance.
Author: Astra PM, 2026-09-21. No product, seal artifact, gate, pin or release changed.
Problem: independent CUI1-INTERFACE-SEQUENCING-L1.md at c38cc0a proves a dependency cycle.
CUI1 requires real named screen roles; CUI2/3/4/6 create them only after S10 releases views.
S9 currently waits for accepted CUI1, while S10 depends on S9.

Authority and constraints
Joe's 2026-09-21 PM-chat words: "move maximally fast without compromising quality".
This author treats that as scheduling authority, never a waiver of a guard or owner choice.
DECISIONS:530 governs the exact final design; :575/:578 require the look before the trial.
:536/:542 preserve the two-path S9 release; :543/:626 put writer splits and views in S10.
:627 accepts S9-UI-PINS-BRIEF.md at8c2bc36e, SHA256
d8140074ccccfc2cbbbdcc011974981907e71c141a246625308adbe10c31300d.
Its section11.2 explicitly makes S9 wait for CUI1; this proposal cannot silently bypass it.
Accepted S9-RELEASE-SPEC.md C.5.3 expressly allows design.APPROVED to retain 09-08 refs
at S9; APPROVED-PIN reads those paths at runtime and independently pins their actual bytes.
PACK-PIN separately pins the entire approved09-18 pack, including quality and baselines.
Therefore retaining old reference bindings during infrastructure seals need not remove a pin.

Proposed order, effective only after independent review and a formal PM disposition
1. Finish CUI0 and required independent Claude closure before measuring the approved pack.
2. Amend S9's carry dependency: exclude unfinished CUI1 product/pin promotion from S9.
   Preserve S9's other accepted carries, guards, closed release list and all seal obligations.
   Measure PACK-PIN over the final approved09-18 pack and APPROVED-PIN over actual references.
   Keep the current design.test references and applicable E17 declarations unless separately reviewed.
   Any needed source-read boundary repair is a separately reviewed carry, not CUI1 acceptance.
3. Seal S9, then the accepted GSS/S10 work under its existing contract and copy-lock prerequisites.
   GSS acceptance, S10 copy-lock answers and exact source closures remain mandatory dependencies.
4. Commission the real screen work after S10 releases its explicit paths, preserving ticket order.
   Build on isolated candidates; no incomplete CUI1 package or screen package is accepted.
5. Compose CUI1 with actual dependent screen roles; run all original named font/copy/scene/motion
   checks and all applicable screen gates. No empty probes, renamed old bindings or prototype substitution.
6. Move design pins only through the reviewed later reseal child that carries completed CUI1.
   Re-measure APPROVED-PIN, design.test and every affected sealed declaration in that child.
   Both OS exact-head CI, separate author/reviewer/integrator and Claude final remain required.
7. Deliver the complete approved look before trial day1; preserve phone-earned weights and the queue.

Required review before adoption
Verify this retains every existing refusal and pin; identify any guarantee that is weakened.
Check accepted spec plus binding R4 corrections, brief sections2/5/9/11, :530/:536/:549/:627.
Enumerate exact amendments to S9, S10 working brief and CUI1/2/3/4/6 dependencies.
Confirm no change moves a private-data boundary, a writer exception, a released path or an owner choice.
Do not claim current CUI1 browser/font failures pass, or turn acceptance into an infrastructure subset.
If the proposal lowers a guard, stop with the exact guarantee and prepare the owner's concrete choice.
If compatible, return a bounded amendment list and verdict for one PM ruling, not another design loop.
No new runtime or queue ticket is authorized by this paper.
