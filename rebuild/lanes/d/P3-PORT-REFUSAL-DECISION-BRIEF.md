# P3-PORT-REFUSAL: why the owner's own history was refused

Lane D, DIAGNOSIS. No product behaviour is changed by this branch. Cells only.

## 1. What refused, and where

At CONFIRM, not at review: `reviewSource` never calls `programme()`, which runs
inside `replay()`, which only `prepareSource` runs. `review-refused` is the
screen's label for EVERY refusal after custody (`import-screen.mjs:93`), which
is why his entry says that though the walk reached the confirm. Returned:

    { ready:false, pending:true,
      issues:[ {code:'LOCAL_SOURCE_PROGRAMME_UNRESOLVED'} ],
      families:[ ..., {family:'F4', state:'unresolved', op_id:<his setup op>} ] }

No `op_id` on the issue, no detail. `REFUSAL_SENTENCE` has no entry for the code
(`import-screen.mjs:100`), so he gets one machine word and no reason.

## 2. The refusing check

    rebuild/m3/w6/local/source-admission.mjs:146
    if(encode(source.split)!==encode(scratch.split)||source.exercises?.length!==scratch.exercises.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');

`source` is the BUNDLE's migrated candidate state (the old app's programme).
`scratch` is `createCleanInitState({setup: op.payload.setup})` built from THIS
INSTALLATION's own setup operation (:145). `split` is `{from, map}`, and `from`
is compared. The two cannot agree for a fresh-start owner: the phone's document
comes from `setup-model.mjs:633`, `split:{from:today,map}`, commented
"split.from is TODAY'S LOCAL date, always, and the flow offers no start date",
so his phone carries 2026-09-16, while the file carries the OLD app's start
date, months earlier. One field is enough, and it is bracketed below. A second
makes the rule unsatisfiable even if `from` were excluded: setup writes ONE
global `sets` and ONE global `hi` onto EVERY lift (`setup-model.mjs:622-623`),
so an old programme with per-lift set or rep targets is unanswerable.

## 3. EVERY path that yields the code

Seven reach an athlete, all inside `programme(source, ops)`, called at :171 by
`try{programmeBasis=programme(state,ops);}catch(e){issue(e.code);}`.

| # | line | installation fact tested | against source fact |
|---|------|--------------------------|---------------------|
| P1 | 142 | count of ops with `payload.profile === earned/first-run-setup/v1` is not 1 | none: unenrolled, or setup saved twice |
| P2 | 143 | that op is not `schema_version 2` or fails `Setup.validate` | none |
| P3 | 146 | clean-init `split` (map AND start date), exercise COUNT | `state.split`, `state.exercises.length` |
| P4 | 147 | each clean-init lift `id` present exactly once | ids in `state.exercises` |
| P5 | 147 | `id day mg sets hi inc steps` per lift | same per lift |
| P6 | 148 | `payload.tags[id].head` and `.secondary` | `head`, `secondary` on the file's lift |
| P7 | 149 | `payload.setup.priority_muscles` | `state.priority_muscles` |

Not causes, being uncompared: name `n`, load `w`, forks, schema, first-run date,
the sample athlete's residue, the live-clock era. S5-then-S6 is excluded by
measurement: `git diff 122f7252 02d3219a` over the four setup files is EMPTY.

UNREACHABLE by this name (:270, :272, :273, :284): those four `fail(...)` calls
sit inside `resolveCapturedLayout`, under the projector's
`try{...}catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');}` at :289, which
reads no `e.code`, so a capture whose producer profile, slot membership, set
count or day membership disagrees is RENAMED on the way out. A second, smaller
defect; not his: D-PR-5 records a gym session and the delta is unchanged.

## 4. The reproduction and the bracket

`p3-port-refusal/owner-route.test.mjs` walks his path on ONE IndexedDB: fresh
installation, setup through the real setup lane on 2026-09-16, the era reopened
on 2026-09-17 (what reopening the app does), the SHIPPED page booted by
`today-entry.mjs`, its Import route, a bundle sealed by the real `port.cjs`
picked on the real file input, the six words, Unlock, identity Yes, then
"Import this history". `programme-bracket.test.mjs` brackets at the controller
on two setup documents differing in NOTHING but `split.from`. 11 cells, green.

| cell | phone's setup document | bundle | pre-import writes | answer | result |
|------|------------------------|--------|-------------------|--------|--------|
| D-PR-1 | file's programme, `from` 2026-08-31 | file's | none | Yes | ADMITS |
| D-PR-2 | same answers, `from` = setup day | file's | none | Yes | one issue, `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`; F4 `unresolved`; nothing written |
| D-PR-3 | file's programme | ANOTHER athlete (one lift 4 sets) | none | Yes | same single code |
| D-PR-4 a/b/c | same answers, `from` = setup day | file's | none | Yes / No / none | same single code, all three |
| D-PR-5 | both documents side by side | file's | weigh-in, food day, night, trial start, waist, markers, check-in, ONE complete gym session | Yes | delta between the two runs is EXACTLY the programme code |
| D-PR-6 | driven through the real setup reducer | n/a | n/a | n/a | `document().setup.split.from === today`, every day tried |
| D-PRR-1 | same answers, `from` = setup day, REAL page | file's | none | Yes | his screen verbatim: code alone, picker reset, one `review-refused` entry, durable record unchanged |
| D-PRR-2 | file's programme, REAL page | file's | none | Yes | ADMITS |

One variable, one code: not S5/S6, not his writes, not his answer, not the
clock. WHY THE CORPUS MISSED IT: `import/test/support.mjs` seals its bundle
from `createCleanInitState({setup: SETUP})` and its `firstRun()` saves that
SAME document, so every admitting cell has an installation whose setup document
IS the file's programme. They never run `setup-model.mjs`, which alone decides
`split.from` on a real phone.

## 5. Classification: (b), a product defect, with an (a) inside it

The rule "the imported history's programme must equal a CLEAN INIT of this
phone's setup answers" is not owner-decidable: no answer satisfies it, since
`split.from` is never asked for and per-lift sets and reps are not askable. Nor
a runbook gap: no instruction avoids it. It is a defect in what :146 compares.

OPT-1 (recommended). Compare the programme, not the enrolment date. Drop
`split.from` from the :146 comparison (compare `split.map` and keep the exercise
count), leaving P4 to P7 as they are. Lane C or D, one line plus cells, half a
day with review. He sees his own history admit on a phone he set up this week.
Risk: none to identity. DECISIONS:472 (a) already records that the bundle
carries no athlete identity and the only guard is his own answer; `split.from`
was never an identity fact.

OPT-2. Widen further: compare only the split MAP, the lift ids and their day and
mg; RETAIN rather than prove `sets`, `hi`, `inc`, `steps`, tags and
`priority_muscles`. Lane D, two to three days: each widened field needs its own
retained-not-projected argument and the F4 evidence rule
(`replay-registry.cjs:63`) is restated. Needed if his file also drifts per-lift.

OPT-3 (do with either). Give the code a sentence and a detail: the issue should
carry WHICH field disagreed and `REFUSAL_SENTENCE` should say "This file was
written by a different training programme than the one on this phone." Lane C, a
few hours. Also fix the :289 catch so :270 to :284 keep their own names.

STOPS. (1) I did not confirm which fields of HIS file disagree: that would mean
opening his ledger, which this ticket forbids, so OPT-1 may be necessary and not
sufficient. The cheap next step is for HIM to read the two `split.from` values.
(2) I changed no product file; the one-line fix above is described, not made.
(3) The :289 renaming defect is named, not fixed.
