# Plan-edit companion v2 - independent review, ROUND 2

Lane D independent reviewer (Opus, high). Subject `8bd6f61` (code `1cb334e` + report), rebased
onto `60cb6187` (:471), confirmed an ancestor of HEAD. Detached in `%TEMP%\earned-pe-rv`.

## VERDICT: ACCEPT

All six items the PM ordered after round 1 (ACCEPT, 2 MAJOR / 3 MINOR / 4 NOTE) are closed. I
re-ran my 14 round-1 cells plus six new ones (`%TEMP%\pe-rv\rv-cells.mjs`, 20/20) and the
author's whole evidence chain from scratch. One new MINOR arrived with the fix itself.

## The order-2 deviation is correct and I endorse it

The PM ordered the dead `rejected[...]` branches made reachable "with a cell each"; the author
retired them. I checked the claim behind that, not the wording. PE09-rejection
(`durable-host.test.mjs:335`) tampers with exactly `{op_id: <the saved edit>}`, so admitting
that shape as proof makes the accepted law red: the deviation was the only way to keep it.
**RV17** drives each retired branch (the `rejected[origin.op_id]` clause, the edits-loop
duplicate-proof check, the tombstone clause, the `statuses` 'rejected' arm) over a real
authenticated generation carrying a well-formed tombstone; all four refuse at the narrowed
gate, so retiring beat dead code with an opinion. The re-pointed mutant
`unproved-rejection-is-authority` mutates the gate to admit well-formed records and is killed.

## Findings

**1. MINOR (new, arrived with the r2 fix): the rejection classifier reads the KEY alone.**
`planClass(id)` resolves `ops[id]` and never asks whether `rejected[id]`'s own body names
`id`. The r1 code did cross-check the two (`rejected[op.op_id].op_id !== op.op_id`); that check
was retired with the dead branches, so nothing cross-checks them now. **RV18**, over a real
generation: a record filed under a non-plan op while NAMING a plan op (a weigh-in key holding
`{op_id: <the plan edit>, kind: 'plan-mutation'}`) is classified unrelated and **reads straight
through**. Bounded, since no rejection is ever acted on, so it still cannot exclude an edit or
move a basis; what is lost is fail-closed reach over a record that visibly names a plan op.
Fix: classify the union of the key and any `op_id` the record carries. S6.

**2. NOTE: the client backstop behind `PLAN_EDIT_DAY_TURNED` is now asserted nowhere.**
The old PE15 asserted `refused.invalid === ['WORKOUT_INPUT_INVALID']`, proving the client's own
closed validator refuses the built operation; the new PE15 rightly asserts `invalid ===
undefined` (nothing was built), but the defence in depth is now unproven, since only the
`day-turned-unnamed` mutant exercises the fall-through and it kills on the code string, not on
the client still refusing. That removal is the ONLY one in the whole diff and its cell gained
five assertions; no law, guard or test is weakened anywhere.

**3. NOTE: two shapes of "incomplete host".** `PLAN_EDIT_HOST_INCOMPLETE` comes from
`Commands.fail` (carries `.code`), the neighbouring client/clock/liveDay/intent checks from a
bare `TypeError`. Pre-existing; worth aligning when the host next moves. **4. NOTE:** I could
not reproduce the declared today-17 enumeration, so I ran a superset (21 files): **677/677**;
the S5 gate executes the exact `today-17` child at exit 0, so it is green here regardless.

## The six ordered items, re-proved independently

- **2 MAJOR over-reach (RV14): CLOSED. RV15**, an unrelated rejection in five shapes reads
  byte-identically to the clean read (state, basis, parents, intent status) and the editor
  still previews over it. **RV16**, a PLAN rejection still refuses read and editor in four
  shapes, record intact, edit on disk. **RV14** (r1 probe, unchanged) is now the fail-closed
  half: an op the generation lacks cannot be shown unrelated.
- **1 MAJOR currency: CLOSED.** 60cb6187 is an ancestor of HEAD, section 6 cites 1cb334e, and
  I re-ran S5 at the report head 8bd6f61 myself: EXIT 0. **3 MINOR drift: CLOSED**, `git diff
  --name-only 60cb6187 HEAD` gives exactly the 18 listed, all additions, none S5-declared.
- **4 MINOR astra tree dirt: CLOSED, and then some.** After the ENTIRE evidence chain `git
  status --porcelain` is EMPTY, `rebuild/lanes/.tmp/` only ignored; the depth argument holds.
- **5 MINOR unnamed day-turn (RV06): CLOSED. RV19**, exact sentence, no dash by code point,
  `invalid` absent, nothing durable moved, still after the stale check. **RV13** re-tightened:
  the host's one `clock.today()` read IS that comparison, and tomorrow still comes from the
  live athlete-local day only. **6 NOTE identity: CLOSED**, **RV20**, six absent/blank/
  mistyped shapes refuse `PLAN_EDIT_HOST_INCOMPLETE`; with both present the host reads.
- Incidental: an op injected into the durable store is refused by the lane's own T2 history
  authentication (`T2_INTEGRITY_UNPROVEN`) before the projector sees it, so the host path
  cannot be fed a forged unrelated op; RV15/17/18 therefore drive the classifier at the model
  layer, over a clone of the real authenticated generation.

## Tails I took myself, at 8bd6f61

lane `# tests 68 / # pass 68 / # fail 0`; `{"baseline":true,"total":16,"killed":16,
"survived":0,"originalsUnchanged":true}`; `9/9 host mutants killed by selected assertions`;
Astra `4 of 4 adaptations` on both annexes at the published sha256s, `tests 22 / pass 22 / fail
0`; my cells 20/20; today-17 superset 677/677; W6 586/586; A0 38/38; coach 231/231; client
18/18; `rig187 => PASS`; `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs`;
`B PACKAGE S5 SEAL BASE ON THE TIP` naming 60cb618 an ancestor of HEAD, `0 unlisted drift`,
`B PACKAGE S5 PUBLIC CI EVIDENCE PASS`, S5-EXIT=0. Not pushed.
