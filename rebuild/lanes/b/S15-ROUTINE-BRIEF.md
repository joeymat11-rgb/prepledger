# S15 CHANGE MY ROUTINE - brief (M2-S15-ROUTINE)

Package: M2-S15-ROUTINE, an UNSEALED `--ci` child of the SEALED M2-S14-HOLD (artifact
rebuild/m4/spec/acceptance-s14-hold.json, receipt DECISIONS:932), the S12/S13 shape. It moves no
rebuild/engine byte, declares no D-id and no gate supersession; no seal, receipt or VERDICT.

## Scope
An athlete-facing "Change my routine" editor in the Today app for ANY enrolled user (first run or an
admitted import): add (typed or catalogue), remove, replace, rename, sets, rep aim, move between Upper
and Lower, reorder within Upper and within Lower, and change which weekdays are Upper, Lower or rest.
Built on the reviewed plan-edit companion (rebuild/m3/w6/host/plan-edit-host.mjs); new page modules
routine-host.mjs, routine-model.mjs, routine-app.mjs; wiring in today-entry.mjs, today-lanes.cjs,
today-app.cjs; preview.css block; build.mjs REQUIRED_INPUTS.

## New plan-edit kinds (plan-edit-commands.cjs, plan-edit-model.cjs)
- `reorder {day: U|L, order: [ids]}`: exactly that workout's lifts still in the week; else
  PLAN_EDIT_ORDER_MISMATCH; unchanged order PLAN_EDIT_NO_CHANGE. Sets `exOrder[day]`, which
  genSession sorts by (RULED_ORDER applies only in runAdaptive at planGen 51, never on the page).
- `split {map '0'..'6': U|L|REST}`: a new dated period from starts_on; earlier periods kept; two saves
  on one date leave one period; a workout with lifts but no day refuses PLAN_EDIT_DAY_UNCOVERED.

## Owner rules
- Every NEW exercise starts at setup's STANDARD_SETS (3), STANDARD_HI (10), no known load (w null,
  no forks); the first logged workout sets the load; increases are only engine proposals.
- Kept exercises keep every field and all history; nothing in history is deleted or rewritten.
- Every change starts on the next local day; today's session keeps its basis; the start date is
  shown before every save.

## PM rulings
- (2) Refuse removing, moving or replacing the last lift of a workout that still has days, and a week
  that gives a day to a workout with no lift: PLAN_EDIT_WORKOUT_EMPTY (judged on new edits only).
- (3) The start-date line is enough; no separate review screen.
- (4) The three routine modules are build.mjs REQUIRED_INPUTS.
- (5) Adoption reads the generation once per boot; accepted.
- B1 (b) (Fable l1): Today adopts kept lifts with EXACTLY the members of the basis it stands on
  (clean or imported), never the tag-projected members; only edited fields and new or replacing
  lifts differ.

## Copy (approved by the PM under DECISIONS:913 (5); CL-S15-DELTA, 33 pieces)
Change my routine; Opening your routine.; Changes start on DATE. Today's workout stays as it is.;
Saved. It starts on DATE.; Move up; Move down; Save this order; Change; Change my days; Your week;
Save my days; Sets; Which workout?; Save changes; Replace it; Remove it; Remove NAME from your
routine? Its history stays.; Yes, remove it; Keep it; New exercise; Replace NAME; A new exercise
starts at SETS sets with no weight. Your first workout sets it.; Give it a name.; Add it; Nothing
has changed yet.; Your routine cannot be changed on this device right now. Nothing was changed.
(CODE); That change was not saved. Nothing was changed. (CODE); Your routine changed while this was
open. Look it over and save again.; The day has changed. Look it over and save again.; Each workout
that has exercises needs at least one day.; Each workout with days needs at least one exercise.;
Your routine needs at least one exercise.; Change my routine: no host element (internal).

## Not done
- No way to drop a workout type entirely (ruling 2 refuses each single step of it).
- No restore of a removed lift; no editing of past plans; no Full-body days ('F' shows as Rest).
- Fable l1 N3 (adoption reads the boot day; a page open past midnight keeps yesterday's routine
  until the rollover reboot), N4 (saving one workout's order drops the other's unsaved order
  draft), N5 (an imported 'F' day) are left as noted.
- The local-source path is proved on a hand-built admitted generation; the real import is the PM's
  T30 run.

## S15 round 5 polish (PM UI pass over the 2026-10-12 iPhone captures)
Same package, same parent, same rules. Each item has a red-first cell.
1. Workout header: the gym card read its title from the Today view at boot, before Today adopted the
   athlete's own week, so a Lower day was headed with the preview athlete's session. The title is read
   when the card reads (today-entry.mjs, gym-model.mjs). Cell RT-10.
2. Prefill: when the engine prescribes no load (a debut), the next set of the same lift opens at the
   load just logged in this session; still editable, Log still records only the box; reps are not
   prefilled; a prescribed load and S14's hold/bodyweight rules are unchanged (gym-model.mjs). S15P-2.
3. Entry refusals: an entry that is not a number ("BW") is refused on the card in plain words before
   anything is sent; a number the layer refuses (0, a negative) still goes to the layer and the card
   says which box in plain words, keeping the draft. Other layer refusals keep W-21 (gym-model.mjs,
   gym-app.mjs). S15P-3, S15P-3b; gym.test A2 step 7 unchanged.
4. The offline-launch footer stays in the document (problem report, browser-offline-check) and leaves
   the deployed page's screen (slice/pwa/preflight.css). pwa.test "S15 polish".
5. Today on a training day: workout card first, weigh-in as one row, headline after the cards; a rest
   day keeps its order; the quiet links take the pack's text glow (today-app.cjs data-day,
   preview.css). RT-12.
6. Set entry boxes drawn before typing; the machine row clears the effort row (preview.css). RT-12.
7. After Finish, when the existing after-Close check finds a working-weight offer, the card shows the
   recorded workout with the offer cards (existing Yes / Not now) instead of returning to Today; no
   engine logic is new (today-entry.mjs). S15P-7.
8. Exercise search (setup and routine) answers as he types; the typed-name Add is live while typing
   (setup-app.mjs, routine-app.mjs). S15P-8a, S15P-8b, RT-09.
9. "1 clean rep left" (gym-model.mjs, S15P-9); Why this plan shows no protein section when there is
   no protein target instead of NaN (today-model.cjs, RT-11).
New strings: That weight cannot be saved. Enter it as a number above zero, like 25.; Enter the reps
as a whole number, like 10.; " clean rep left" / " clean rep left." (fragments).
Re-pins: PAGE_PINS today-entry.mjs 0e4b3388... -> 559463e0...; copy-lock corpus 523145... -> b28f9f05...
