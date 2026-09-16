# PLAN EDIT COMPANION v2 - independent review r1

VERDICT: ACCEPT (with findings below; none blocking).

Reviewer: Opus high, independent of the author. Subject `4f8808766cf89795a2bfc11ecb9cd98ff031243c`
on `rebuild/d-plan-edit-v2`, read in a detached worktree at that sha. No product file was edited by
this review; my own cells live outside the repo at `%TEMP%\pe-rv\rv-cells.mjs`. Synthetic data only.

## 1. What I re-derived rather than took on trust

**The Astra bytes.** The three `rebuild/lanes/astra/reviews/PLAN-EDIT-*` files committed here are
byte-identical (`fc /b`) to `f355ccce` / `96c4b101`. The four adaptations `astra-rerun.mjs` applies are anchored, counted (4 of
4 in each file) and, re-derived here, none weakens an assertion:
(1) the F2 require points at the lane's byte-identical copy; (2) `liveDay: () => clock.today()`
reproduces exactly what the Sept-13 host derived internally, and since the annex clock is
`today: () => time.now.slice(0,10)` it still MOVES, so the midnight witnesses (I03, I14) probe
what they always probed; (3) full-body `F` to `['U','L']` covers the same two families the
fixture's lifts use, and the model's own `covered()` accepts either, so no witness changes shape;
(4) `orderedExercisesForDay` to the tip's `sessionMembership` by date is a re-expression through
the accepted engine, not a hand-rolled substitute. Re-run: **22/22 PASS**, I08/I09/I10 included.
Both REJECT findings are closed at this head.

**The F2 copy.** `lanes/d/plan-edit/f2-tag-adapter.cjs` is sha256-equal to
`git show f3e9561:rebuild/m4/workout/setup-tags.cjs` (my cell RV13, computed from the blob, not
from the author's recorded digest). No runtime file names it or `setup-tags.cjs`.

## 2. My own cells (14/14, real fake-indexeddb + webcrypto + W6 repository, enrolled athlete, no stubs)

| Cell | What it proves |
| --- | --- |
| RV01 | One save is exactly one op plus one outbox entry at one durable revision. |
| RV02 | A fault thrown before `repository.commit` moves no byte; retry commits once; a third save returns the same commit and writes nothing. |
| RV03 | Two saves on consecutive live days; a fresh client over the same store reconstructs the current plan AND both pending plans, and the projection is byte-identical to the pre-reload one. |
| RV04 | A stale review refuses `PLAN_EDIT_REVIEW_STALE` and the refusal carries the new plan, its basis, its pending dates and the date a fresh review would offer. |
| RV05 | tz `-05:00`, instant already `2026-09-15Z`, athlete-local day `2026-09-14`: `starts_on` is `2026-09-15`, never UTC-tomorrow; the op stamps `local_date 2026-09-14`, `local_time 22:00`, `utc_offset -05:00`. |
| RV06 | A live day ahead of the stamp clock refuses and writes nothing; a day that turns under an open review refuses `PLAN_EDIT_REVIEW_STALE` and writes nothing. |
| RV07 | Rename keeps the ID, the load and the fork list, appends `{from, prevN}`, and `engine/plan.cjs nameAt` reads the OLD name for an old session; `sameEra` unchanged. |
| RV08 | Replace mints the new ID once with `w: null`, no borrowed renames, old record retained under `retirements`, new row in the old order slot; a second use of the ID refuses `PLAN_EDIT_ID_REUSED` and replay mints no copy. |
| RV09 | Remove is a dated exclusion: no earlier operation moves, today is byte-identical, the record is retained and only excluded from the future day. |
| RV10 | An admitted P2 import IS the basis: his own names are read, and the edit composes onto them. |
| RV11 | A clean-init state over an athlete whose generation carries an admitted import refuses `PLAN_EDIT_IMPORTED_BASIS_MISMATCH` and writes nothing. The setup document alone is never the basis. |
| RV12 | Four unadmitted shapes (pending, not ready, unresolved issue, another installation) each refuse `PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE` with either basis handed over. No fallback. |
| RV13 | Static: no `createCleanInitState`, no `Date.now()`/`new Date()` and no tag source in the three runtime files; the host never reads `clock.today()`; F2 blob identity. |
| RV14 | Probe for finding 2 below. |

Machine notes: no runtime file forks `rebuild/coach/machine-settings-commands.cjs` (PE06 drives the
real `local-world.mjs` host). `client/index.cjs` is not in the diff at all.

## 3. Suites I re-ran myself, verbatim tails

```text
lane companion suites          # tests 64 / # pass 64 / # fail 0 / # cancelled 0 / # skipped 0
model mutants                  {"baseline":true,"total":13,"killed":13,"survived":0,"originalsUnchanged":true}
host mutants                   7/7 host mutants killed by selected assertions
Astra annex + R1 annex         # tests 22 / # pass 22 / # fail 0 / # cancelled 0 / # skipped 0
reviewer cells (mine)          # tests 14 / # pass 14 / # fail 0 / # cancelled 0 / # skipped 0
today-17                       tests 666 / pass 666 / fail 0     (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York)
W6                             tests 586 / pass 586 / fail 0
A0                             tests 38 / pass 38 / fail 0
coach                          tests 231 / pass 231 / fail 0
client                         tests 18 / pass 18 / fail 0
rig187                         rig187 => PASS
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-c41c7b74a73f;
  approved design pinned; 69 bound classes; 2 pinned typefaces inlined; no literal figure in the
  template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the
  athlete can see
b-package --ci --package S5 at 4f88087:
  B PACKAGE S5 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local
    diagnostics withheld
b-package --ci --package S5 in a probe worktree (4f88087 merged --no-ff with the CURRENT chain tip
7042576; 0ac72ea and 7042576 differ only in rebuild/DECISIONS.md):
  B PACKAGE S5 PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 81
    carried byte-identical from the parent / ... / 0 unlisted drift; the inventory covers all 90
    parent-pinned product files
  B PACKAGE S5 CHILD today-17 .. engine-files-differential OBSERVED; exit 0 (10 of 10)
  B PACKAGE S5 PUBLIC CI EVIDENCE PASS
```

## 4. Drift

`git diff --name-status 0ac72ea HEAD`: **18 files, all additions, 0 named in
`lanes/b/tooling/packages/S5.json`.** Runtime: `m4/workout/plan-edit-commands.cjs`,
`m4/workout/plan-edit-model.cjs`, `m3/w6/host/plan-edit-host.mjs`. The rest is `lanes/d/**` (11)
and three reviewer witness files under `lanes/astra/reviews/`. **No `rebuild/engine` byte, no
`m3/w7-preview/today/**` byte, no `rebuild/client/**` byte.** Scan over all 18: no CRLF, no BOM;
two U+2013 in the brief only (finding 7). Tree clean at the reviewed sha.

## 5. Findings

1. **MAJOR (report).** Report section 6 names `b-package --ci --package S5 at HEAD 5c2ad35, exit 0`
   inside a list of head evidence. That is an intermediate commit, and at the reported head today
   the run stops at `SEAL-BASE-IS-NOT-THE-CHAIN-TIP`: `origin/rebuild/t2-client-core` has advanced
   to `7042576` (DECISIONS:469), which is not an ancestor of this HEAD. The substance holds (probe
   worktree above), so this is a currency and anchoring defect, not a product one. Carry the tip
   before the S6 landing and re-anchor every section 6 tail to the head it was taken at.
2. **MAJOR (fail-closed over-reach).** `plan-edit-model.cjs inspect()` refuses
   `PLAN_EDIT_REJECTION_UNPROVEN` when `collections.rejected` is non-empty AT ALL, without asking
   whether the rejected operation is a plan operation. RV14 puts one synthetic rejection of an
   unrelated food operation into the generation and the whole plan read, and with it the editor,
   refuses; every `rejected[...]` branch below that guard is therefore dead code. It fails closed
   and v1 is local-only, so not blocking, but once this installation syncs one unrelated rejection
   dark-screens Edit my week. Narrow the guard and retire the dead branches.
3. **MINOR.** Report section 7 says "17 files"; the drift is 18 (its own list has 18 entries).
4. **MINOR.** `lanes/d/plan-edit/astra-rerun.mjs` writes its adapted copies to
   `rebuild/lanes/astra/tmp-plan-edit-rerun/`, which `git check-ignore` does not ignore: running the
   lane's own evidence dirties a tracked area. Write them under `.tmp/` like the host mutants do.
5. **MINOR (copy handover).** The live-day / stamp-clock disagreement refuses at the client's own
   closed validator as the generic `WORKOUT_INPUT_INVALID` ("Nothing was recorded"), not a nameable
   plan-edit code (RV06). Nothing commits, but lane C cannot tell the athlete his day turned.
6. **NOTE.** `createPlanEditHost` defaults `athleteLabel` and `namespace` to `null`, which degrades
   `admittedLocalSourceBasis` to "any admitted import". It mirrors `admittedLocalSourceState`, and
   the page passes both, but a caller that forgets them silently loosens the P2 predicate.
7. **NOTE.** Two U+2013 in `BRIEF-PLAN-EDIT-COMPANION-v1.0.md`, inherited byte-identical from
   12a837f. Not a string the athlete can see; the A1 dash gate passes.
8. **NOTE.** `client.planEdit` (index.cjs:348) is deliberately unused: it is scalar and carries
   `basis-0`, and the accepted brief says so by name. The committed operation still carries the
   planEdit SHAPE (class `plan`, kind `plan-mutation`, `payload: null`, one `athlete_edited`
   training member, `seen_plan_basis`) through the `workout` stage, so I read the ticket's
   "existing client planEdit seam" as satisfied. The author's section 8 open items are correct as
   stated.
