# Fresh nutrition qualification: bounded scope choice

PM204 preparation, source inspection only at9a4fe2148f0ae526fa5f0875ce4f9d201765551a. No implementation, engine ruling, executed journey or launch blocker. This complements J3 in BETA-JOURNEY-COVERAGE.md.

## What is established

- H3 deliberately leaves composition/lean-mass inputs absent; its accepted clean-init case must remain honest. A first valid weigh-in establishes a weight trend, not a composition measurement or qualified nutrition prescription (lanes/b/BRIEF-H3-CLEAN-INIT.md sections3-4).
- today/setup-model.mjs:630 carries the workout setup; it does not establish a nutrition qualification route. today-app.cjs:104 names the absent starting composition estimate; source wording alone does not prove that estimate is sufficient for every target.
- food-model.cjs:79-107 preserves recorded intake operations when an engine writer cannot project them. Qualification must eventually re-evaluate the preserved facts through the accepted writer; it must not require the user to re-enter or discard them.
- This lane has not traced the full current energy input/qualification contract. No estimate method, formula, numerical threshold, medical claim or new prescription is proposed here.

## Recommended disposition for PM

Keep the first phone trial's existing unknown-target behavior. For broader beta, prepare one small, explicit qualification journey using only the existing accepted engine inputs and rules. First map the actual target prerequisites, then decide whether an already-approved input method can supply them. Do not make memory the source of measured composition or a substitute for canonical intake/weight facts.

| Candidate | Meaning | Scope decision |
| --- | --- | --- |
| Preferred: accepted input route | A separate user-confirmed, source/date/unit-qualified canonical input is admitted through an existing approved writer; each target appears only when its own engine qualifications hold | PM/B first identify the exact accepted producer, input method, freshness/unknown rules and replay consumer. C owns the later visible flow. No automatic runtime release |
| Explicit beta limitation | Keep intake recording and honest unavailable targets, with a clear explanation of what Earned cannot yet calculate | If no accepted input route exists, PM brings the concrete limitation versus a newly specified route to the owner as one yes/no choice; no fabricated default |

The owner-facing question, only if an unapproved route is necessary: “Should beta include a separate nutrition setup that records the inputs Earned needs before showing qualified targets?” A yes sets product scope; it does not approve an unspecified estimation method or change the engine's rules. PM must make the exact method and limitation reviewable before requesting any further choice.

## Required design closure before code

1. B names each calorie/protein prerequisite, the existing source/writer and accepted consumer, units/provenance, unknown/freshness behavior and pin/CI route. Distinguish inputs sufficient for one target from those sufficient for another; do not infer sufficiency from FOOD_NO_TARGETS copy.
2. C names the actual same-installation setup/record/correction/retrieval surface and exact files; E updates J3 with its evidence obligations. Existing C launch/N2 work stays first.
3. PM determines whether that exact route implements existing scope or needs a new owner choice. Any engine change remains B's package route. This note authorizes neither a new read scope for E nor code edits.

## Positive and adverse journey to retain

- Fresh installation: log actual intake with targets unavailable, restart and read those same records; no sample history or zero target impersonating unknown.
- Record only the exact permitted qualification inputs with explicit confirmation and provenance. Observe each qualifying engine target through the real Today/coach consumer; otherwise retain its specific honest unavailable state.
- Reopen and recover the installation: inputs, preserved intake and target qualification agree. Qualification replays previously unprojectable intake without duplicate operations or lost history.
- Correct an input; observe the canonical correction and recomputation, including qualification becoming unavailable. Memory recall cannot override the corrected source.
- Exercise refusal, no confirmation, failed save/read, stale completion, cross-user isolation and insufficient inputs. Never show a prescription merely because a field exists or a number is finite.

Next dependency: PM/B accepted prerequisite/writer map, after urgent launch/CI work. No additional lane is proposed; E designs coverage, B owns rules/admission, C owns the visible product and D2 later independently checks it.
