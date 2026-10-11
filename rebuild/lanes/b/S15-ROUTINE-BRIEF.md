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
