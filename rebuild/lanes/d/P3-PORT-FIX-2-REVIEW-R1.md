# P3-PORT-FIX-2 - INDEPENDENT REVIEW R1

VERDICT: **ACCEPT WITH NOTES.** All three rulings are built as ruled, the
author's bar reproduces exactly on my own run (322 pass / 0 fail over nine
rows), the red-first claim reproduces (8 cells red against the unchanged
product), R1's next morning OPENS on my own probe, and every note below is a
question for the PM rather than a defect in this change.

Reviewed at `b313793d0c5b6025b0914249b43bee615238c8ab`, base `94f298d`.
`HEAD` and `origin/rebuild/d-p3-port-fix` are the same sha; worktree clean.

## 1. WHAT I RAN

`git diff 94f298d..HEAD --numstat` is exactly six files:

    378   0  rebuild/lanes/d/P3-PORT-FIX-2-AUTHOR-REPORT.md
    230  95  rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs
     84  35  rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs
    105   4  rebuild/m3/w6/local/source-admission.mjs
     34   2  rebuild/m3/w7-preview/import/import-screen.mjs
     16   4  rebuild/m3/w7-preview/import/test/route.test.mjs

Product diff is inside the two files the ticket allows. The lockdown numstat
over `authority`, `client`, `engine`, `coach`, `port`, `w6-host`, `w7-today`,
`DECISIONS.md`, `m4/import/replay-core.cjs`, `m4/workout/athlete-state.cjs` and
`m4/workout/plan-edit-model.cjs` is EMPTY: all three of those last files are
byte-identical to `94f298d`. I read the whole product diff.

## 2. THE BAR, RE-RUN BY ME

All nine rows re-run through `pf-run.bat` (TZ=America/New_York) on the changed
tip. My counts are the author's counts, row for row.

| row | pass | fail | my log |
|-----|------|------|--------|
| lane cells (programme-rule + owner-route + capture-codes) | 30 | 0 | `%TEMP%\rv2-lane.log` |
| plan-edit `model.test.cjs` | 54 | 0 | `%TEMP%\rv2-planedit.log` |
| import corpus (route, refusals, refusal-route, live-clock, page-bundle) | 35 | 0 | `%TEMP%\rv2-corpus.log` |
| w6 `local-source-admission.test.mjs` | 19 | 0 | `%TEMP%\rv2-w6admit.log` |
| `import-retract/retract.test.mjs` | 13 | 0 | `%TEMP%\rv2-retract.log` |
| m4/import S6 children (7 files) | 90 | 0 | `%TEMP%\rv2-m4import.log` |
| w6 `local-source-consumer.test.mjs` | 7 | 0 | `%TEMP%\rv2-consumer.log` |
| SUBTOTAL | 248 | 0 | |
| durable-host + browser-build | 32 | 0 | `%TEMP%\rv2-planedit-extra.log` |
| w6 commit + local-import + import-custody | 42 | 0 | `%TEMP%\rv2-w6extra.log` |
| **GRAND TOTAL** | **322** | **0** | |

`cancelled 0`, `skipped 0`, `todo 0` in every one of the nine logs. No
difference from the author's table anywhere.

### Red first, verified independently

I checked the two PRODUCT files out at `94f298d`, left the new cells in place,
ran the lane trio plus `route.test.mjs`, then restored (`git status` clean
afterwards; `%TEMP%\rv2-red.log`): `tests 36, pass 28, fail 8`. The 8 are
exactly `D-PF-f1`, `D-PF-f4`, `D-PF-f5`, `D-PF-n4`, `D-PF-n5` hi / inc / steps
and `P3-U5`. The author's claim is true. `D-PF-f2` and `D-PF-f3` are green in
BOTH states (see NOTE 5).

## 3. R1, THE CAPTURE PROVENANCE CHECK

`source-admission.mjs:432` now reads `documentSets.get(id)!==count`.
`documentSets` is a `Map` filled at :204 from `scratch.exercises`, where
`scratch = createCleanInitState({setup: op.payload.setup})` and `op` is the
phone's single first-run setup op. So the right-hand side IS the DOCUMENT's set
count for that lift, resolved by id, from the phone's own first-run op. Correct.

The other three inner checks are byte-untouched in the diff: `capture_producer`
(:396, the producer rule profile), `capture_lift` (:398, still reading `state`,
the ADMITTED list, exactly once per slot lineage id) and `capture_membership`
(:437, still `sessionMembership(state, originalDay)` over the ADMITTED state at
the authenticated original Start day). Only the one comparison moved.

Ordering is right: `documentSets` is filled immediately after the document
builds, BEFORE the split, count, id, day and mg comparisons, so a file that
refuses at any of those still leaves the capture check a true document to read.
The one case where it stays empty is a `setup_document` refusal or a document
that will not build at all (see NOTE 2).

### Is provenance still proved?

The capture is read out of THIS phone's own stored history
(`storedWorkoutHistory(g, {athleteId, deviceId, prescriptionCapture})`) over the
local repository, so the binding to this installation is the store it came from,
not the set count. On top of that the check now pins: the producer rule profile
is one of the two engine profiles; every slot's `lift_lineage_id` is a lift the
admitted state carries exactly once; the per-lift slot count is the DOCUMENT's;
and the lift pool AND ORDER for that day are the engine's own membership reader's
answer over the admitted state. A hand-built capture must therefore agree with
the phone's document on every count and with the engine on the whole day's pool
and order. That is strictly MORE than the pre-change check pinned, because the
old right-hand side (the file's counts) was the untrusted side of the import.
Nothing here is a cryptographic signature over the capture, so a fabricated
capture that agrees with the document on every count and with the engine on the
whole day is still admitted - but that was equally true before this change and
is not something this ruling was asked to add. Provenance is proved to the same
standard as before, against the correct programme.

### D-PF-f4 is against the BOOTED PAGE, and it is TRUE on my run

`D-PF-f4` calls `reopenPage()`, which builds a real `shellWindow()`, points its
`indexedDB` at the SAME `IDBFactory` the import ran over, and calls
`Entry.boot({document, hosts: era, now: liveAt(...)})`, then awaits
`booted.api.ready` and reads `booted.workout.gym.read()`. That is the booted
page, not a hand-built host: it is the same technique cell (a) and D-PRR-2 use.
The cell asserts `card.code !== 'ENGINE_CAPTURE_SESSION_INVALID'` by name,
`card.phase === 'ready'`, `card.total === sumSets(FILE,'L')` with a guard that
the file and the document disagree on that day, and `gym.start()` `ok:true`.
It passes on my run. **D-PF-f4 (the next morning opens) is TRUE.** NO STOP.

## 4. R2, THE FIELD KEYED COPY

I read `DECISIONS.md` line 509 myself. It is NOT in this worktree (507 lines
here); I read it from `origin/rebuild/t2-client-core` (509 lines), which is
where the author said it is. Both sentences are BYTE EXACT to the PM's words:

- `capture_sets`: "A workout you already recorded on this phone has a different
  number of sets than this file has for that lift. Nothing on this phone was
  changed."
- `setup_document`: "This phone has no saved setup to compare this file with.
  Nothing on this phone was changed."

`REFUSAL_FIELD_SENTENCE` holds exactly those two keys; `refusalLines()` looks
for a known field token in the detail and falls back to `REFUSAL_SENTENCE[code]`
otherwise, so every other field and the bare code keep the programmeMismatch
sentence, as ruled. `codeLine()` is untouched, so the field + `exercise_id`
detail rendering is as it was. The lookup uses `Object.hasOwn`, so no prototype
key can match. Nothing from the file rides out: `detailOf` emits only `field`
(a literal chosen by the code path, never interpolated) and `exercise_id`, and
`D-PF-f5` asserts no digit, no dash, and none of the document's, the file's or
the stray capture's set counts reaches the rendered box.

U+2013 / U+2014 scan over all five changed files AND the author report: zero in
every one. No `.skip(`, `.todo(` or `.only(` in any of them.

## 5. R3, THE RETAINED BOUNDS, LINE BY LINE

`athlete-state.cjs` `checkExercise` (:118-136) against `programme()`:

| constructor | line | admission |
|---|---|---|
| `closed(raw, REQUIRED_EXERCISE)` (member PRESENT) | :119 | inherited: a file row missing the member substitutes `undefined` and the constructor refuses |
| `positiveInt(sets)` = `Number.isSafeInteger && > 0` | :126, :95 | inherited |
| `positiveInt(hi)` | :127 | inherited |
| `inc` a finite `number` `> 0` | :129 | inherited |
| `steps` non-empty array, every member a finite number `> 0`, STRICTLY ascending | :130-132 | inherited |
| any UPPER bound, on anything | none | none |
| `id`, `n`, `mg`, `day`, duplicate id | :121-125 | not substituted, so untouched |

No bound is invented and no number is copied: the implementation rebuilds the
phone's own valid document with exactly one member of one lift replaced by the
file's value and calls `createCleanInitState`. I checked the attribution
argument holds: the only cross-exercise validation in `createCleanInitState` is
the split-coverage check over `e.day` (:305-307) and the duplicate-id `seen`
set, and `day` and `id` are not in `BOUNDED_FIELDS`, so nothing but the
substituted value can make the probe throw. `head`, `secondary` and
`priority_muscles` are outside `REQUIRED_EXERCISE` and the constructor bounds
none of them; they stay retained and unbounded, and the author says so in the
report and in the comment. `n` is in `REQUIRED_EXERCISE` but is not in
`PROJECTED_FIELDS`, so the file's name never lands and needs no bound.

`D-PF-n4` passes on my run and says both halves out loud: `sets: 0` refused
`{field:'sets', exercise_id:'db-bench'}`, `sets: 40` still ADMITTED with a
failure message that tells whoever adds a ceiling to take it to the PM.
`D-PF-n5` executes `hi`, `inc` and `steps` under their own field names. The
positive cell is PF-a at the head of `programme-rule.test.mjs`, referenced by
the rewritten `D-PF-n4` comment as the ticket asks.

## 6. MY OWN PROBES

Written outside the worktree (`%TEMP%\rv2probe\probe.test.mjs`, synthetic only,
nothing committed), run through `pf-run.bat`; log `%TEMP%\rv2-probe.log`.
All three PASS.

**PROBE A (the PM's first probe: document 3, file 5, then the next morning).**
`lat-pulldown` is 3 in the phone's document and 5 in the file, and it sits on
the U day the phone recorded before importing. The import ADMITS. Booting the
page the next local morning over the same IndexedDB:
`phase=ready code=none total=4`, where the FILE's L day is 4 and the document's
is 3, `gym.start()` returns `ok:true`, and the pre-import session is in the
record with the DOCUMENT's U-day slot count (6), unrebased. The next morning
opens on the FILE's number. Independent of `D-PF-f4` and agreeing with it.

**PROBE B (is the right-hand side really the DOCUMENT, or "either side"?).**
This is the probe that would catch a check quietly widened to accept the file
too. Capture written with `db-bench` at the FILE's count (2) instead of the
document's (3): REFUSED,
`[{"code":"LOCAL_SOURCE_PROGRAMME_UNRESOLVED","field":"capture_sets","exercise_id":"db-bench"}]`.
The right-hand side is the document alone. Good.

**PROBE C (the PM's second probe: matches neither).** Capture written with
`db-bench` at 7 (document 3, file 2): REFUSED with the same single issue,
`field: capture_sets`, `exercise_id: db-bench`. This is `D-PF-f5` reproduced
from my own harness rather than the author's.

## 7. FINDINGS

**NO BLOCKING FINDINGS.**

**NOTE 1 - the field sentence is chosen by the FIRST known token in a
multi-issue detail string** (`import-screen.mjs:152-156`). `confirm()` joins
every issue's `field` and `exercise_id` into one string and `refusalLines()`
takes the first token the map knows. A refusal that carries BOTH a week fault
and a capture fault (for example `split.map` first, then `capture_sets`) prints
the code line with both fields but the CAPTURE sentence, because `split.map` is
not a key. The leading fault is then the one the sentence does not describe.
This is exactly the class of untruth DECISIONS:509 Q5 ruled against, one level
down. It needs both a week mismatch AND a capture that matches neither side, so
it is rare; the ruling did not say which field wins when several arrive. FOR THE
PM: rule the precedence, or key the sentence on the FIRST issue's field only.

**NOTE 2 - a `setup_document` refusal makes every capture refuse too.**
`documentSets` is filled only after the document builds, so when `programme()`
refuses at `setup_document` (zero or two setup ops, an op that does not
validate) or `createCleanInitState` itself throws, the map is EMPTY and
`documentSets.get(id)` is `undefined` for every lift, so each capture also
raises `capture_sets`. The author's comment says so. The code line the athlete
reads then carries both fields; the sentence is still the right one, because
`setup_document` is raised first and wins the token scan. No path I can
construct reaches it with a real recorded workout (a phone with no setup
document cannot have run the gym card), so I record it rather than block on it.

**NOTE 3 - provenance is proved by shape, not by a signature.** See section 3.
Not weakened by this change, and not in scope. Worth one line in the ledger so
nobody later reads "provenance" as "authenticated".

**NOTE 4 - Edit My Week leaves a residual owner path that still refuses.**
`plan-edit-model.cjs` amends the STATE and writes no second
`earned/first-run-setup/v1` op (and admission would refuse `setup_document` if
it did, because it requires exactly one). So a phone that edits a lift's set
count through Edit My Week, records a workout under the EDITED plan, and only
then imports, writes a capture whose slot count is the EDITED count while this
check reads the FIRST-RUN document: `capture_sets`, the same refusal shape Q1
just closed, one step further along. The ruling named the first-run setup
document and the build followed it exactly, so this is not a defect in this
change. FOR THE PM: is that order reachable for the owner, and if so is the
right-hand side the document AS AMENDED at the capture's date?

**NOTE 5 - the f1/f2/f3 trio no longer discriminates; the trip-wire is now f5.**
`D-PF-f2` and `D-PF-f3` are green against BOTH the unchanged and the changed
product on my red-first run, because all three now admit. The ticket asked for
exactly this ("keep f2 and f3 as controls with their meaning restated"), and the
author restated them honestly in the comments. But the old `D-PF-f3` carried the
words "THIS CELL IS THE PM GATE'S TRIP-WIRE ... It must not be edited away", and
that role has moved to `D-PF-f5` and `D-PF-n4`, neither of which carries the
same warning. Worth one sentence in each so the next author knows.

**NOTE 6 - cost.** The bound probe rebuilds the whole document once per bounded
field per lift, so `createCleanInitState` runs `4 x N` extra times per import.
On three lifts that is twelve calls on a path that runs once. Correct choice
(asking the constructor beats restating it), recorded only so it is not a
surprise if the lift count ever grows.

**NOTE 7 - DECISIONS:509 is not in this worktree.** `rebuild/DECISIONS.md` here
is 507 lines; line 509 lives on `origin/rebuild/t2-client-core` (509 lines). I
read it there and both PM sentences are byte-exact. The author's deviation note
is accurate; the ledger and this lane are simply on different tips.

## 8. NOTHING WEAKENED

I read all 547 lines of the test diff. `D-PF-f1` is INVERTED, not loosened: it
gained the projected-session assertions and the two "or this cell proves
nothing" guards, and its copy block moved intact to `D-PF-f5`, which keeps the
no-digit, no-dash and no-value-rides-out assertions and tightens
`exercise_id` from "one this phone holds" to the literal `db-bench`.
`D-PF-n4` kept its adopted-basis assertion and gained the floor half.
`P3-U5` gained four assertions and lost none. No assertion was deleted without
a stronger one taking its place, and no cell was deleted. No `.skip`, `.todo`
or `.only` anywhere. The author's three deviations that touch test data (the
`2026-09-20` producer day, the L-day import in `D-PF-f4`, the `workout_facts`
read) are each declared in report section 10 and each checks out against the
code.

## 9. WHAT I COULD NOT VERIFY

- That the widening R1 accepts is safe across MANY pre-import sessions over
  several weeks. `D-PF-f4` and my PROBE A each measure ONE recorded session on
  one day. The author raises the same limit as his first open question.
- Whether the Edit My Week order in NOTE 4 is reachable in the shipped route. I
  read `plan-edit-model.cjs` (unchanged here) but did not drive the Edit My Week
  screens, and it is outside this ticket's three rulings.
- Anything about the owner's real data. I ran synthetic fixtures only and read
  nothing under the private paths.
- The two suites the author excludes (`import-custody/engine-join.test.mjs`,
  `recovery-stage/source-import.test.mjs`). I did not run them; they demand
  `EARNED_*_ROOT` and their own runner, as P3-PORT-FIX already recorded.
