# EDIT MY WEEK v1.0, proposed by Lane D2

PM judgment requested; this is not an accepted brief, product change or implementation review. Authority: DECISIONS:159 and PM REQUESTS 2026-09-12 10:26 after :167. Source base 361ea25; author branch rebuild/lane-d2-edit-week. All proposed behavior below is subject to the PM's named scope decision.

## Outcome
After setup, the athlete can change days, one exercise, machine settings or priorities without restarting setup. Open the current week, choose one area, inspect the change and save deliberately. Existing measurements, sessions, established loads and unrelated programme values survive. The next eligible gym session uses the saved change and its actual operation basis.

## READ-LIST, in order
- rebuild/design/CLAUDE-DESIGN-TECH-BRIEF.md:55, S8; rebuild/design/CLAUDE-DESIGN-BRIEF.md:76, section 4.7: the four doors and setup vocabulary.
- rebuild/m3/w7-preview/today/setup-model.mjs:58, :73, :148, :187, :255, :593: weekdays, copy, priorities, muscle vocabulary, regenerated IDs and shared prescription values. Reuse vocabulary and field components, not its document writer.
- rebuild/m3/w7-preview/today/setup-host.mjs:102 and setup-commands.mjs:84: first-run save refuses a second setup; its envelope is not a plan-edit contract.
- rebuild/m4/workout/athlete-state.cjs:111, :129, :149: the constructor deliberately starts with unknown loads and empty history; priorities currently cause no programme change.
- rebuild/client/index.cjs:207, :220, :227, :270; rebuild/client/ops.cjs:44; rebuild/client/plan.cjs:2: producer validation, plan-mutation construction and the distinction between athlete edits and consented plan transactions.
- rebuild/m3/w6/t2-stage.cjs:9, :63, :83: the durable stage accepts workout but does not expose planEdit as a staged command. An injected producer can return a plan member through the existing builder; that is a candidate seam, not proof of a complete edit contract.
- rebuild/m4/workout/workout-basis.cjs:40; rebuild/m4/workout/edit-values.cjs:1: explicit workout bases; recorded-set corrections are not programme edits.
- rebuild/engine/plan.cjs:11, :59, :87: dated split lookup, names have seams independent of technique forks, retirement controls active exercises.
- rebuild/coach/machine-settings-commands.cjs:33, :48, :139, :156; rebuild/coach/local-world.mjs:151: existing machine-note validation, projection and durable host. Empty settings cannot currently clear a note.
- rebuild/m3/w7-preview/today/today-entry.mjs:66, :160; rebuild/m3/w6/today-bindings.mjs:334, :580: captured consumer state and named public hosts. N2 is accepted under :167; coordinate the shared projector and pin transition under :154(5).
- rebuild/DECISIONS.md:155, :163, :167: tag snapshot policy, F1 acceptance and N2 narrowings. Judge against the actual landed F1/F2/H3 heads before implementation, not an assumed release order.

## Contract and boundaries
- Read the current projected plan plus later athlete edits, not the original setup document alone. Opening, switching doors, previewing and cancelling write nothing. No setup replay, no clean-init constructor over an enrolled athlete, no second repository or clock.
- One save changes one chosen area. Preserve unrelated exercise fields individually, including sets, rep aim, increments, rungs, known loads, tags and order. No global setup defaults applied to existing rows. No automatic regeneration of the whole programme after changing days or priorities.
- PROPOSED timing: structural days/exercise changes take effect tomorrow in the existing athlete-local calendar; show the exact date before save. Today's open session and completed history keep their existing basis. Notes and priorities take effect when durably saved. This is an INVENTED product choice for PM judgment, not an engine law. It avoids asking a date-only history seam to distinguish two same-day programmes.
- Several structural saves before tomorrow compose from the pending next-day plan; the review shows that pending plan. Reopen shows current and pending dates distinctly. It must not replace the previous pending edit with a fresh copy of today's plan.
- Days: reuse weekday and day-kind words. Keep existing kind assignments until the athlete changes them; show the complete result before save. Refuse incomplete or incompatible coverage without discarding the draft. Only offer Full body after F1 and the consuming engine path are available. Changing frequency does not silently add exercises, sets or progression rules.
- Exercises: choose an existing lift, then edit its label, its day, its own sets/rep aim/equipment values, or choose Replace exercise / Remove from week. Add exercise uses setup's exercise fields and muscle vocabulary. Preserve valid existing values even when outside setup's starter chips; chips are not an established-athlete limit.
- Rename keeps the stable ID, working load, tags, technique era and notes; append the engine-compatible dated name seam. Replacement/addition mints a new stable ID once, even when labels duplicate; the new lift starts with unknown load and no borrowed record. Removal is dated exclusion from future scheduling, never physical deletion of the lift or its historical sets. Restore/reordering and editing historical plans are outside this brief.
- Tags remain explicit snapshots under :155: unchanged tags survive; explicit empty secondary stays empty; a catalogue update never rewrites an existing lift. An actual new selection previews and stores its own tags. A label edit does not retag or reset technique.
- Machine settings means remembered seat/pin/position values and cues on the existing exercise ID. It does not alter weight increments, available weights, technique forks or load anchors. Those equipment values belong to the exercise door. Reuse the current command and its limits. Clearing the final note is not offered in v1 because no clear contract exists; partial deletion is allowed only if the remaining valid note is saved as the replacement. Never claim a blank save erased a note.
- Priorities reuses the setup vocabulary and permits an explicitly empty selection. Store the selection without changing frequency, sets, exercise order or targets. Retain setup's honest statement that priorities do not change sessions yet until an independently accepted consumer changes that behavior.
- A programme change requires a validated athlete plan-edit operation with a named conflict domain, effective date, identity, explicit changed members and seen basis. Do not encode a new setup or anonymous fact and silently treat it as an accepted plan. Do not manufacture authority consent. Respect existing local-edit versus accepted-transaction semantics.
- Before build, name the producer, validator, projector and durable host ownership. The existing injected workout producer may carry the plan-shaped command if that path is approved and proved; otherwise request the owned client companion. Merely enabling client.planEdit on the stage does not define dated week projection, retirement or historical lookup. No blanket client/engine licence is conferred by this brief.
- Op/outbox and authenticated generation must commit together before saved UI. Lease expiry, storage failure, integrity refusal and closed era preserve the draft and use existing actionable refusal behavior. Reload reconstructs from stored operations. Stale basis refuses/rebases only after the athlete sees the new proposed result; no silent last-writer choice.
- Refresh actual Today and future gym consumers after commit without erasing an in-progress check-in or workout. Exercise notes appear on the corresponding gym card. Existing sessions retain their recorded basis; a newly opened eligible session uses the changed plan basis. Cosmetic repaint of the editor alone is insufficient.

## Exact copy
All new copy here is INVENTED; weekday, day-kind, exercise-field and muscle terms are SOURCED from setup-model above. Dynamic braces are actual values, never placeholders left in the UI.
| Location | Copy |
|---|---|
| Entry and title | Edit my week |
| Intro | What would you like to change? |
| Doors | Days / Exercises / Machine settings / Priorities |
| Days | Which days? |
| Exercise list | Choose an exercise / Add exercise |
| Exercise actions | Edit exercise / Replace exercise / Remove from week |
| Label helper | Changing the name keeps this exercise's records. |
| Replace helper | The new exercise starts without a recorded load. Your old sessions stay in your history. |
| Remove helper | This exercise will leave your week on {date}. Your old sessions stay in your history. |
| Machine helper | Keep the settings you want to remember for this machine. |
| Last-note empty error | Keep a setting or a cue. Clearing the last note is not available here yet. |
| Priorities title | Anything in particular? |
| Priorities helper, SOURCED setup-model:150 | We will keep this with your plan. It does not change your sessions yet. |
| Structural review | Starts {date} / Current / After this change |
| Existing pending edit | Changes already saved for {date} |
| Actions | Review change / Save change / Keep editing / Cancel |
| No changes | Nothing has changed yet. |
| Saved structural | Saved for {date}. |
| Saved notes or priorities | Saved on this device. |
| Stale review | Your week changed while this was open. Review the latest week before saving. |
| Coverage error | Choose a training day for each exercise before saving. |
| Validation | Reuse the relevant existing setup/machine field error verbatim. A new error must be listed in the implementation copy inventory. |

## States to draw
Entry with current summary and any pending date; each door populated from current/pending data; exercise selection/add/rename/replace/remove; day coverage error; empty priorities; machine note edit and invalid empty remainder; unchanged draft; before/after review; saving; saved current/pending result; stale-basis review; durable refusal with draft retained. Back/cancel returns to the editor's caller. Reuse established layout and focus behavior. Inputs 16px, touch target 44px and control height 48px are SOURCED from CLAUDE-DESIGN-BRIEF.md:31. No new navigation shell.

## Executable acceptance bar
Proposed suite path: rebuild/m3/w7-preview/today/test/edit-week.test.mjs. This file does not exist yet. Implement individually selectable tests with the exact EW IDs below; run `node --test rebuild/m3/w7-preview/today/test/edit-week.test.mjs`. Every row is mandatory at the judged head unless the PM narrows by name. Use synthetic encrypted-store fixtures, injected athlete clock and the actual entry/host composition. No private fixtures.
| ID | Executable assertion |
|---|---|
| EW-01 | Enrolled athlete opens all four doors without first-run setup; read/open/cancel/no-op leave operation and outbox counts unchanged. |
| EW-02 | Edit only one exercise's sets; every unrelated ID, field, established load and tag remains deep-equal. Existing non-chip values render without coercion. |
| EW-03 | Rename preserves ID/load/era/notes and historical name lookup; a new eligible session uses the new name, old sessions retain their names. |
| EW-04 | Replace with a duplicate label: distinct stable ID survives retry/reopen; new load unknown; old sessions, lift and records survive; no borrowed targets. |
| EW-05 | Dated removal excludes the lift only from eligible future scheduling; current/open and historical sessions remain unchanged; unrelated order survives. |
| EW-06 | Days edit respects explicit kinds and coverage; unsupported kinds/incomplete coverage refuse with draft retained. No automatic exercise or set rewrite. |
| EW-07 | Test midnight with local/UTC dates differing, open workout and two edits before activation. Effective date follows athlete-local tomorrow; pending changes compose; existing session basis stays fixed. |
| EW-08 | Change equipment values only for selected lift; unchanged readings, notes and other lifts survive. Invalid/blank/rung ordering uses real validation; no zero/NaN/hidden default. |
| EW-09 | Machine notes save through the existing command and appear on the same ID's actual gym card. Rename retains them, replacement does not inherit them, empty final-note save refuses. |
| EW-10 | Empty and nonempty priorities persist after reopen; genSession and target outputs are identical before/after with all other inputs fixed. |
| EW-11 | Actual producer/validator and projector prove plan identity/domain/effective date/seen basis, actor edits and causal linkage. Malformed or stale-basis operations refuse; no forged consent or fact-to-plan shortcut. |
| EW-12 | Actual encrypted generation: one deliberate save yields one durable edit intent and its complete outbox; injected pre-commit failure changes neither, retry does not duplicate. Lease/integrity/closed-era failures never show Saved. |
| EW-13 | Reopen/replay reconstructs current and pending plans. Reject/tombstone an edit using supported machinery and prove it is not still applied by an editor-local cache. All preexisting history entries remain byte-equivalent. |
| EW-14 | Same-page commit reaches real Today and the next eligible gym entry with the new operation basis; existing workout/check-in drafts survive. Test the actual host composition, not only a projector helper. |
| EW-15 | Tagged lift, explicit secondary [], rename, replacement and changed catalogue prove :155 snapshots. F1 supported-kind tests name the landed dependency head or stay blocked, never silently skip. |
| EW-16 | DOM tests exercise four doors, before/after/date copy, invalid/saving/saved/refusal states, keyboard labels/focus and narrow viewport without a new shell. Copy census forbids em/en dash, emoji and exclamation marks. |

Run inherited setup, check-in, sleep, workout and machine-note suites at the exact candidate head as regressions. The implementation report must name their real paths, the EW cell counts and both-OS CI IDs covering this new suite. Register the suite through the PM-owned CI/pin handoff; a green run without EW cells is not this bar. D2 independently executes the accepted bar before reading the builder report. These are proposed tests, not claimed passes.

## Custody and size
| Work | Owner / boundary |
|---|---|
| This brief and source recon | D2, docs only; no authority lines |
| Named scope/timing and implementation dispatch | PM, sole judge |
| Editor, exact copy, consumer refresh, DOM/host tests | C after N1/N2 and the PM's order; one Today build at a time |
| Plan producer/validation/projector and durable composition | PM assigns an explicit owner and reviewed companion boundary before build; C may use only granted screens/producer seams |
| H3, F1/F2 and entry/bindings pin transition | Their existing owners; no D2/C engine rewrite or pin bypass |
| CI registration and protocol/schema changes if required | Named PM handoff; this brief grants no .github or client-core custody |
| Independent implementation review | D2 for Claude-authored code at an exact branch/head; PM assigns cross-model review for any Astra companion |

INVENTED planning estimate: medium-large, two reviewable parts (plan-edit companion, then editor and actual consumer integration), with about two builder days after dependencies. No elapsed-time promise. PM may narrow the four-door scope by name, but a released structural editor must retain EW identity/history/durability proofs. Open scope choices for judgment: tomorrow activation, final-note clearing deferred, and named ownership of the plan-edit contract. No implementation has begun.
