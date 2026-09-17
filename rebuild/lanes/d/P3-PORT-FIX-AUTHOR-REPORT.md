# P3-PORT-FIX: author report

Lane D, BUILD. Worktree %TEMP%\earned-portfix, branch rebuild/d-p3-port-fix on
top of the chain tip 3d002174. Spec of record
`rebuild/lanes/d/P3-PORT-FIX-SPEC.md` v2 (1dec0410, accepted at DECISIONS:508),
with `-REVIEW-R1.md` and `-REVIEW-R2.md`. The three binding corrections of
REVIEW-R2 (B-1, N-1, N-2) are carried and are named where they land.

Every figure in every cell is SYNTHETIC. No private fixture, no ledger and no
path under the owner's port folder was read, named or reachable from any file
this branch adds or changes.

## 1. THE COMMITS

| sha | subject |
|-----|---------|
| `54ee8da` | P3-PORT-FIX: cells, red first |
| `8a2ac64` | P3-PORT-FIX: the programme rule (OPT-2 + OPT-3) and the companion predicate |
| `05f736c` | P3-PORT-FIX: author report |
| `68874ec` | P3-PORT-FIX: independent review R1 (ACCEPT WITH NOTES), the reviewer's own file |
| (this file) | P3-PORT-FIX: fix round after review R1 |

THE FIX ROUND (after `68874ec`) adds THREE cells and ONE assertion, and moves NO
product file. Section 11 is the disposition of every finding the review raised.

## 2. RED FIRST (spec 5 (j))

Every cell was written and run against the UNCHANGED tree at `eb43fee9` before
any product file moved. Logs are the four `%TEMP%\portfix-red*.log`.

| suite | pre-fix | the red that matters |
|-------|---------|----------------------|
| `lanes/d/p3-port-fix/programme-rule.test.mjs` | 1 pass / 11 fail | cell (a) (PF-a) red with exactly `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`, which is the refusal the owner read on his phone on 2026-09-17, reproduced on a document the shipped screens can actually write |
| `lanes/d/p3-port-fix/owner-route.test.mjs` | 0 pass / 4 fail | D-PRR-1 red with `{code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', detail: null}` off the real screen |
| `lanes/d/p3-port-fix/capture-codes.test.mjs` | 0 pass / 2 fail | the inner code came out renamed: `['LOCAL_SOURCE_PROGRAMME_UNRESOLVED','LOCAL_SOURCE_WORKOUT_UNRESOLVED']` |
| `lanes/d/plan-edit/model.test.cjs` | 45 pass / 9 fail | the 8 cell (k) ACCEPTS rows red with `PLAN_EDIT_ORIGIN_UNPROVEN` / `PLAN_EDIT_TAG_BASIS_UNPROVEN`, plus the retargeted `:388` trip-wire. Every pre-existing cell green |

SPEC 8's CLOSING INSTRUCTION, ANSWERED. "The build's FIRST task is to execute
cell (a) with the companion assertion against the pre-fix `plan-edit-model.cjs`
and confirm it is red. If it is green, 1.6 is wrong and the build stops." It is
RED, twice over and independently: at model level the eight cell (k) ACCEPTS
rows are red against the pre-fix module with the file's own numbers on an
admitted basis, and at route level D-PRR-2's companion read is inside a cell
that is red pre-fix. Finding 1 is now an executed failure, not a code reading.

## 3. THE DIFF, FILE BY FILE

Product diff touches EXACTLY the four files spec 4.1 lists.
`rebuild/m4/import/replay-core.cjs` is byte-identical, as 4.1 predicted;
`git diff --stat 3d002174 -- rebuild/m3 rebuild/m4 rebuild/engine rebuild/coach`
does not name it.

### `rebuild/m3/w6/local/source-admission.mjs` (+97 / -14)

| line | change |
|------|--------|
| `:80` | `fail(code, detail)` widened. Backwards compatible with all twenty-odd existing call sites, which pass no detail |
| `:81-95` | `KNOWN_REPLAY_CODES`, the frozen allowlist of the codes this module itself raises, and `detailOf(e)`, the GUARDED spread of spec 1.3's third note |
| `:159-198` | `programme(source, ops, {today})`, spec 1.3. PROVED: every split period's `map`, the lift id multiset, each lift's `day` and `mg`. BOUNDED: every period is closed over `{from, map}`, every `from` is a valid day not after `today`, at least one period is in force. RETAINED: `sets`, `hi`, `inc`, `steps`, `head`, `secondary`, `priority_muscles`. `fields = ['day','mg']` and `PROJECTED_FIELDS` are SEPARATE constants, so the comparison narrows and the programme digest does not. The returned `priority_muscles` is now the FILE's, because that is what lands in the admitted state |
| `:218-219` | the call site hoists ONE `currentDay()` read and passes it in (spec 1.2 B-A, the build requirement), and spreads the detail through the guard |
| `:328,:330,:331,:341` | the four inner `fail`s carry `capture_producer`, `capture_lift`, `capture_sets`, `capture_membership` |
| `:347` | the catch surfaces an ALLOWLISTED inner code under its own name. Anything not on the list keeps `LOCAL_SOURCE_WORKOUT_UNRESOLVED`, exactly as today |

### `rebuild/m3/w7-preview/import/import-screen.mjs` (+34 / -8)

| line | change |
|------|--------|
| `:83-91` | `COPY.programmeMismatch`, the sentence of spec 3.2, verbatim |
| `:101-110` | the map comment restated, and `REFUSAL_SENTENCE` gains `LOCAL_SOURCE_PROGRAMME_UNRESOLVED` |
| `:380-395` | `confirm()` builds the detail from the SAME issues array: the remaining codes as today, plus each issue's `field` then `exercise_id`, deduplicated. Both come from the machinery's CLOSED vocabulary; no value from the file can ride out |

### `rebuild/m4/import/replay-registry.cjs` (+9 / -3)

`:61-69`, the F4 rule text, restated per spec 1.5 so the registry stops implying
a comparison it no longer describes. The other three clauses are unchanged in
substance: one document, proved against, retained once the proof stands.

### `rebuild/m4/workout/plan-edit-model.cjs` (+45 / -11), spec 1.6

| line | change |
|------|--------|
| `:22-29` | `P2_ROW` narrowed IN PLACE to `['id','day','mg']`. This is REVIEW-R2 B-1's first requirement, taken as the option that leaves no dead constant: nothing is kept alive only for the assertion about it. BEFORE `['id','day','mg','sets','hi','inc','steps']` |
| `:30-40` | `splitShapeOk(periods, documentSplit)`, admission's own P-A plus B-C. `from` is NOT compared, and the "not after today" bound is NOT re-evaluated: admission applied it at admission time and a committed import must not start refusing the editor because a clock moved |
| `:70-76` | `const localSource = basisSource === 'local-source'`, read only to CHOOSE the comparison. The `basisSource` VALIDATION stays exactly where it was (`:110` after the edit, unmoved relative to the predicate) and an unknown value still takes the strict first-run comparison first, which is the comparison it took before this line existed. No refusal order changes |
| `:76-81` | the local-source branch compares the split by SHAPE and drops the `priority_muscles` comparison. The first-run branch is byte-untouched on both |
| `:121-126` | the local-source tag-snapshot comparison is dropped. `C.tagsOf(row, tags, validateTags)` above it STAYS (it validates the DOCUMENT's own tag shape and reads nothing from the basis) and the key-set check at `:142-143` STAYS |
| `:88-101` | the module comment restated to the new field list, because the predicate it derives from moved |

WHAT DID NOT MOVE, checked against spec 1.6's own list: the `COLLECTIONS`
trip-wire, `importPresentIn`, the `basisSource` validation, the basis hash,
`inspect()`, `PLAN_EDIT_BASIS_SOURCE_CHANGED` in `plan-edit-host.mjs:77`
(REVIEW-R2 N-1's corrected cite), and every line of the first-run branch. The
host does not move at all.

## 4. THE BAR

Every run is `node --test <files>` with `TZ=America/New_York` and the pinned
node on PATH. Counts are the runner's own `pass` / `fail` lines.

RE-RUN IN FULL IN THE FIX ROUND after review R1, on the tree this commit
publishes. The only row that moves is the lane's, by the three added cells
(`23 -> 25`; `D-PF-f1` gained assertions rather than a cell of its own).

| what | pass | fail | log |
|------|------|------|-----|
| lane cells (a) to (g), the carried-forward diagnosis cells, and the three fix-round cells: `p3-port-fix/programme-rule.test.mjs`, `owner-route.test.mjs`, `capture-codes.test.mjs` | 25 | 0 | `%TEMP%\fix-lane2.log` |
| cell (k) and the whole companion suite: `lanes/d/plan-edit/model.test.cjs` | 54 | 0 | `%TEMP%\fix-planedit.log` |
| the full import corpus: `route`, `refusals`, `refusal-route`, `live-clock`, `page-bundle` | 35 | 0 | `%TEMP%\fix-corpus.log` |
| `rebuild/m3/w6/test/local-source-admission.test.mjs` | 19 | 0 | `%TEMP%\fix-w6admit.log` |
| `rebuild/lanes/d/import-retract/retract.test.mjs` | 13 | 0 | `%TEMP%\fix-retract.log` |
| S6 children under `rebuild/m4/import`: `prepare`, `reading-replay`, `engine-provider`, `local-source-order`, `browser-parity`, `production-mapping`, `production-admission` | 90 | 0 | `%TEMP%\fix-m4import.log` |
| S6 child `rebuild/m3/w6/test/local-source-consumer.test.mjs` | 7 | 0 | `%TEMP%\fix-consumer.log` |
| TOTAL | 243 | 0 | |

THE TWO ROWS THE REVIEWER ADDED, now part of this bar and re-run here, because a
regression the author would not have seen is worth keeping in the standing list:

| what | pass | fail | log |
|------|------|------|-----|
| `lanes/d/plan-edit/durable-host.test.mjs` + `browser-build.test.mjs` (the companion HOST and its browser build) | 32 | 0 | `%TEMP%\fix-planedit-extra.log` |
| `w6/test/local-source-commit` + `local-import` + `import-custody` | 42 | 0 | `%TEMP%\fix-w6extra.log` |
| GRAND TOTAL, all nine rows | 317 | 0 | |

`w6/test/import-custody/engine-join.test.mjs` and
`recovery-stage/source-import.test.mjs` are NOT in this bar and are not
regressions: as the review measured, both refuse for a missing `EARNED_*_ROOT`
env var and demand their own runner. Harness-gated at this tip either way.

The S6 executed test list was read from
`rebuild/lanes/b/tooling/packages/S6.json`; the child files it names under
`rebuild/m3/w6/test`, `rebuild/m3/w7-preview/import/test` and
`rebuild/m4/import` are the fourteen above, and all fourteen were run.

### The four FOUR cells that went red for the OLD rule, rewritten not deleted

Named here with before and after, as spec 5 (h) requires. None of them was
weakened: each asserts more after the rewrite than before.

| cell | before | after |
|------|--------|-------|
| `refusal-route.test.mjs:175` P3-X5 | `REFUSAL_SENTENCE.LOCAL_SOURCE_PROGRAMME_UNRESOLVED === undefined`, "a sentence was invented for a code that already says what it means" | the one sentence of spec 3.2, asserted verbatim, AND asserted present on the rendered screen |
| `refusal-route.test.mjs:473` P3-X11 | the refusal box holds the bare code | the box is exactly `refusalLines(code, detail).join(' ')` and starts `LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split.map)` |
| `route.test.mjs:421` P3-U5 | the bare code | the code printed ONCE, carrying `(setup_document)`, which is what an UNENROLLED phone refuses under. See open question 1 |
| `m3/w6/test/local-source-admission.test.mjs:149` S3-Q-F3-LAYOUT | `issues` includes `LOCAL_SOURCE_WORKOUT_UNRESOLVED` | `issues` includes `{code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'capture_sets', exercise_id}` |

REVIEW-R2 N-2 is UPHELD by measurement: `route.test.mjs:264` did NOT go red.
Retargeting its seal line to `STRANGER_WEEK_SETUP` was harmless and the cell
asserts `LOCAL_IMPORT_REBASE_REQUIRED` exactly as before. The reds the spec
predicted at the stranger sites were TWO, not three, and both are in
`refusals.test.mjs` / `refusal-route.test.mjs`; the retarget kept them refusals.

### The 4.4 stranger fixture, four call sites, by name

| site | before | after |
|------|--------|-------|
| `import/test/refusals.test.mjs:20` | `sealInventedBundle(STRANGER_SETUP)` | `sealInventedBundle(STRANGER_WEEK_SETUP)` |
| `import/test/refusal-route.test.mjs:23` | same | same |
| `import/test/route.test.mjs:264` | same | same (harmless, per N-2) |
| `lanes/d/import-retract/retract.test.mjs:28` | same | same |

`STRANGER_SETUP` itself stays byte for byte and keeps its role as the
admits-then-not-adopted fixture of cell (e); only its `:72-76` comment is
corrected, because the rule change falsified it. `firstRun()`, `SETUP` and
`TAGS` are untouched.

## 5. THE GUARD SWEEP (spec risk 7.1.0)

VERDICT: NO THIRD GUARD. Two sweeps over `rebuild/m3`, `rebuild/m4`,
`rebuild/engine`, `rebuild/coach`, `rebuild/client` and `rebuild/authority`,
excluding `node_modules`, every `test/` directory, every `*.test.*` file and
every `lanes/` directory. Logs `%TEMP%\portfix-sweep.log` and
`%TEMP%\portfix-sweep2.log`.

SWEEP A, 35 hits, for `P2_ROW`, a `priority_muscles` comparison, `payload.setup`
or `payload.tags`, a split compared against a setup document, a `sets` compared
against `setup.exercises`, and every consumer of
`admittedLocalSourceState` / `admittedLocalSourceBasis`. SWEEP B, 5 hits, for a
comparison operator on the same line as a RETAINED field name and a
document-or-basis name. Every hit classified:

| file:line | what it is | disposition |
|-----------|------------|-------------|
| `m3/w6/local/source-admission.mjs:172,:180` | THE SUBJECT | moved by this ticket |
| `m4/workout/plan-edit-model.cjs:29,:76,:81,:124,:126,:127,:142,:143,:322` | THE SECOND GUARD | moved by this ticket (spec 1.6) |
| `m3/w6/host/plan-edit-host.mjs:13,:46,:50,:75` | chooses the branch and passes the basis; compares nothing | reader, fine, unchanged |
| `m3/w7-preview/today/today-app.cjs:2484` | the adoption chain: takes the admitted state or falls back to the clean init | reader, fine |
| `m3/w7-preview/measure/measure-baseline.mjs:13,:39,:42` | takes the admitted state at `:42` and passes it straight to `baselineWeeksFromState`, with no comparison against any setup document | CONSUMER, not a guard. Confirms REVIEW-R2 N-3 by measurement |
| `m3/w7-preview/today/local-source-basis.mjs:32,:61,:68` | the join itself; its only guards are the admission marker, the installation and the athlete LABEL, none of which this rule touches | reader, fine |
| `m3/w6/local/today-bindings.mjs:657,:664`, `today/setup-host.mjs:54,:61,:62`, `today/setup-commands.mjs:142,:145,:146` | setup plumbing that CARRIES and VALIDATES the document; none of it holds a basis to compare it to | plumbing, fine |
| `m4/workout/athlete-state.cjs:244` | the constructor validating the document's own `priority_muscles` shape | validation, not a comparison |
| `engine/plan.cjs:84` (`_bornValid`), `engine/policy.cjs:686`, `engine/writers.cjs:1900` | shape checks and unrelated prose on the same line as a field name | false positives |

So the narrowing is observed in exactly TWO files, both named in spec 4.1 and
both moved here, and the question 7.1.0 asks is answered explicitly rather than
left implicit.

## 6. THE U+2013 / U+2014 SCAN

`node -e` over every changed file, counting code point U+2013 (en dash) and
code point U+2014 (em dash). Neither character appears in this report either:

    source-admission.mjs 0/0    import-screen.mjs 0/0
    replay-registry.cjs 0/0     plan-edit-model.cjs 0/0
    import/test/support.mjs 0/0 route.test.mjs 0/0
    refusals.test.mjs 0/0       local-source-admission.test.mjs 0/0
    retract.test.mjs 0/0        plan-edit/model.test.cjs 0/0
    p3-port-fix/*.test.mjs 0/0 (all three)

ONE FILE reports a hit and it is PRE-EXISTING, outside this diff:
`import/test/refusal-route.test.mjs:241`, a `const dash` regex literal holding
the two characters themselves, which
is the suite's own guard asserting no dash reaches the screen. Measured: of the
28 lines this branch ADDS to that file, 0 carry either character
(`git diff 3d002174 -- <file>`, added lines only). The line is left alone.

## 7. DEVIATIONS FROM THE SPEC, each with its reason

Stated rather than absorbed. None of them weakens a law, a guard or a cell;
each is a cell the spec asked for that this build did not execute, and the
reason it did not.

1. CELL (f) IS PARTIAL. The spec asks for four cells, one per inner `fail`, plus
   a foreign-error cell and a `CLEAN_INIT_*` cell. EXECUTED: `capture_sets`
   (`:273`) and its control, which are the two that sit on the owner's own path.
   NOT EXECUTED: `capture_producer` (`:270`), `capture_lift` (`:272`),
   `capture_membership` (`:284`), the foreign-error allowlist cell and the
   `CLEAN_INIT_*` no-field cell. REASON, measured rather than assumed: under the
   NEW rule the first three are unreachable without surgery on a sealed capture.
   `:272` needs a slot naming a lift the admitted state does not hold, but P-B
   has already proved the id sets equal; `:284` needs a membership disagreement,
   but P-A and P-C have already proved the week and each lift's day; `:270`
   needs a capture written by a producer the gym card cannot write. Each would
   need a hand-built capture, which is a stub on the very path the cell claims
   to prove (DECISIONS:439 (2)). The allowlist and the guarded spread are
   IMPLEMENTED exactly as the spec writes them and are readable at
   `source-admission.mjs:81-95` and `:347`; what is missing is their executed
   proof. RECOMMENDATION: the reviewer should either write those three against a
   hand-built capture and SAY it is a stub, or the PM should accept them as
   argued. This is the largest gap in this build and it is named first.
2. CELL (a)'s COMPANION ASSERTION IS AT PROJECTOR LEVEL, not through
   `createPlanEditHost`. `owner-route.test.mjs` D-PRR-2 opens the companion with
   the REAL admitted generation from the REAL page route, the REAL first-run
   document this installation wrote, the REAL `admittedLocalSourceBasis` join and
   `basisSource: 'local-source'`. What is NOT exercised is the host wrapper that
   CHOOSES that branch. REASON: `plan-edit-host.mjs` does not move in this ticket
   (spec 4.1 and 4.2 both say so) and its branch choice is already covered by the
   companion suite. The predicate, which is what moved, is exercised end to end.
3. CELL (e)'s THIRD ASSERTION is not executed. PF-e2 proves both halves the spec
   names: the stranger bundle ADMITS at the controller, and the page's own join
   returns `null` for this installation's label while returning the state for the
   stranger's. What is not executed is the follow-on claim that the Train screen
   then shows the SETUP DOCUMENT's numbers. REASON: the not-adoption is the
   mechanism, and it is asserted through the real join; painting the fallback is
   a second page boot for a claim lane C's own consumer cells already hold.

4. CELL (i) IS PARTIAL. EXECUTED: the device timezone offset row (every run is
   `TZ=America/New_York` and the existing `live-clock.test.mjs` proves the
   stamped offsets, 35/0 above); the force-close-and-reopen row (D-PRR-2 closes
   the page and reopens the era on the NEXT local day over the SAME IndexedDB,
   then reads the gym card and the companion); and the bound-against-today row
   (PF-d1 and PF-d3 bracket the bound at exactly today and tomorrow). NOT
   EXECUTED: the moving-clock 60 s real wait, the local-midnight rollover, the
   one-clock-per-file row, and the offline-reload row. REASON: the one-clock
   requirement is IMPLEMENTED at `source-admission.mjs:218` and is readable, but
   executing it needs a cell that crosses a real local midnight between two
   period checks, which is a wall-clock wait this build did not take. The other
   three are rows the accepted `live-clock.test.mjs` already owns for the era's
   own clock and which this rule does not change. RECOMMENDATION: the reviewer
   runs the one-clock row, since it is the one the spec calls a BUILD
   REQUIREMENT rather than a property of the code.
5. THE DIAGNOSIS CELLS WERE CARRIED, NOT RE-RUN IN PLACE.
   `rebuild/lanes/d/p3-port-refusal/` does not exist on this branch; it lives on
   `rebuild/d-p3-port-refusal` and spec 4.3 says the build carries its cells
   forward rather than editing them, so the diagnosis branch stays readable as
   what it was. Where each one landed: D-PR-0, D-PR-4 a/b/c and D-PR-6 are in
   `p3-port-fix/programme-rule.test.mjs`, carried and, where the rule changed,
   INVERTED. D-PR-1 and D-PR-2 are PF-a: the two differed only in whether the
   phone's document carried the file's own start date, and under the new rule
   the one the SCREENS can write is the one that admits, so D-PR-1's
   unproducible document is retired by the rewrite spec 5 (h) requires rather
   than kept as a second green. D-PR-3 is PF-e1 and PF-e2. D-PRR-1 and D-PRR-2
   are in `p3-port-fix/owner-route.test.mjs`, both rewritten onto the shipped
   reducer's document. D-PR-5's delta is RE-MEASURED by D-PF-f1 and D-PF-f2 and
   the answer changed: see open question 2.
6. `sealVariedBundle()` is exported from `support.mjs` but the lane cells call
   `variedProgramme()` and `variedLegacyState()` directly, because each negative
   cell varies ONE thing and needs the two halves separately. Named so a reviewer
   does not read the unused export as a leftover.

## 8. OPEN QUESTIONS FOR THE PM

### 1. A SECOND REFUSAL STANDS ON THE OWNER'S OWN PATH, and this ticket does not remove it

This is the finding, and it is not in the spec. Cell D-PF-f1
(`p3-port-fix/capture-codes.test.mjs`) measures it on the real machinery:

A phone that RECORDED A WORKOUT before importing wrote that workout's capture
against the PHONE's setup document, so the capture's slot count per lift is the
DOCUMENT's set count. After this ticket the admitted state's set count is the
FILE's, and `source-admission.mjs:273` compares the two. A file whose set counts
differ from the document's therefore STILL REFUSES on that path, now as
`{code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field: 'capture_sets',
exercise_id}` instead of a silent `LOCAL_SOURCE_WORKOUT_UNRESOLVED`.

WHY IT MATTERS. This is not a regression: before the fix the same phone refused
at `programme()` anyway. But the owner's real path is exactly this shape, and
the diagnosis's own D-PR-5 recorded a full week of writes on the phone before
importing. If he has logged ANY Earned workout before he retries the port, and
his old app's set counts differ from the ones he typed on the phone, he will be
refused again, on a different check, with the same fate. D-PF-f2 is the control
that proves it is the SET COUNTS and not the workout: with the document's set
counts restored and every other retained field still the file's own, the same
phone and the same recorded workout ADMIT.

WHAT I DID NOT DO, and why. I did not touch `:273`. Spec 6 does not authorise it,
spec 1.4 argues the RETENTION of `sets` on the ENGINE path and says nothing about
this check, and `:273` is a real safety check: it is verifying that the athlete's
own recorded Earned session has as many slots as the state says the lift carries.
Narrowing it is a decision about what a recorded native workout means when the
basis under it is replaced, and that is a PM ruling, not a build's.

THE OPTIONS I CAN SEE, for the PM, not for this branch:
(a) accept it: the owner retries the port on a phone with no recorded workout,
    which is what a fresh-start owner would do anyway;
(b) a follow-on ticket compares the capture's slot count against the DOCUMENT's
    set count for the lift rather than the admitted state's, which is what the
    capture was actually written under;
(c) a follow-on ticket rebases the recorded capture onto the admitted state.
Each is bigger than a line and none belongs inside this seal.

### 2. THE ONE SENTENCE IS WRONG FOR A PHONE THAT WAS NEVER SET UP

Spec 3.2 rules exactly ONE sentence for `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`, and
the code covers `field: 'setup_document'` too, which is the case where the phone
holds ZERO first-run documents. `route.test.mjs:421` (P3-U5) now renders:

    LOCAL_SOURCE_PROGRAMME_UNRESOLVED (setup_document)
    This file was written by a different training week than the one you set up
    on this phone. Nothing on this phone was changed.

The second line is false on that phone: he set up nothing. The first line is
true and the field says so. I did NOT invent a second sentence, because the spec
rules one and inventing copy is not a build's job. The question for the PM is
whether an unenrolled installation deserves its own line, or whether the honest
answer is that the route should not be reachable at all on an unenrolled phone,
which is exactly what P3-U5 exists to assert. My own view: leave the copy, and
let P3-U5's own claim (the route is offered nowhere before the first run is
saved) carry the weight. Cheap to change either way.

### 3. THE MULTI-PERIOD JUDGEMENT (spec 7.1.3) stands unresolved by measurement

The rule proves EVERY period's map, so a file whose owner genuinely changed his
week at some point in the past refuses under `split.map` even though it is his
own file. The spec calls this the judgement it is least certain of, and nothing
this build ran can settle it: it depends on what his real bundle carries. PF-d2
proves the bound is per period, and cell (k)'s two-period ACCEPTS row proves the
companion is happy with several periods of one week, so the machinery is ready
either way. If the retry after S7 refuses on `split.map`, this is the first
thing to look at, and OPT-3's detail is now what will say so.

### 4. THE ONE STUB THAT STANDS, repeated as spec 5 (i) requires

Every admitting cell qualifies its engine context through a TEST-ONLY producer
mapping, because DECISIONS:472 BLOCKER 2 is not closed by this ticket and no
production producer mapping exists in the tree. THE ROUTE-LEVEL CELLS
(`owner-route.test.mjs`) are the exception and are worth more for it: they run
on the PRODUCTION registry the shipped page builds, because that is the one the
screen builds, and they admit. Even so, a green bar here proves the RULE on the
real path and is NOT a promise that the owner's real bundle will qualify. That
is the separate S3-R3 context capability, and the port retry after S7 still
depends on it.

## 9. WHAT THIS BUILD DID NOT TOUCH (spec 6, checked)

- IDENTITY. `LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED` at `:298`, the prefix
  question at `:80` and DECISIONS:472 (a)'s ruling on where the identity guard
  lives: unchanged, word for word.
- CUSTODY AND RETRACT. `importBundle` still commits first, `reviewSource` still
  reads from custody, a refused entry is still retracted under `review-refused`.
  Every negative cell asserts the durable record before and after.
- THE SIX-WORD UNSEAL, `BUNDLE_AUTH_FAILED` and the sealed bundle's sha:
  untouched.
- THE OTHER FAMILIES. F1, F2, F3, F5, F6, F7 and F8 keep their rules, their
  codes and their dispositions. F4's field list narrows, in `programme()` and in
  the one other guard that derives its predicate from `programme()` by its own
  written statement.
- `setup-model.mjs`: not touched. D-PR-6 holds it to that.
- `replay-core.cjs`: byte-identical.
- `plan-edit-host.mjs`: not touched.
- No ledger path is read, written or referenced. No `rebuild/DECISIONS.md` edit.

## 10. FOR THE REVIEWER

Run these first, in this order, and you will see the whole of it:

    node --test rebuild/lanes/d/p3-port-fix/*.test.mjs
    node --test rebuild/lanes/d/plan-edit/model.test.cjs
    node --test rebuild/m3/w7-preview/import/test/*.test.mjs
    node --test rebuild/m3/w6/test/local-source-admission.test.mjs
    node --test rebuild/lanes/d/import-retract/retract.test.mjs

with `TZ=America/New_York`. Then push on, in this order: deviation 1 (cell (f)
is partial and I have said why); open question 1 (the second refusal on the
owner's path, which is the finding this build made and did not fix); and
`git diff 3d002174 -- rebuild/m4/workout/plan-edit-model.cjs`, because the
companion is the file where a narrowing could quietly reach the first-run branch
and the cell that would catch that is the one I wrote last.

---

## 11. REVIEW DISPOSITION (R1)

`rebuild/lanes/d/P3-PORT-FIX-REVIEW-R1.md` (`68874ec`, ACCEPT WITH NOTES) raised
ONE blocking finding, SEVEN notes and NINE probes. Every one is dispositioned
here. NO PRODUCT FILE MOVED IN THIS ROUND: the fix round's diff is three added
cells, one added assertion block, one added assertion inside D-PRR-2, and this
report. `git diff --numstat 05f736c..HEAD -- rebuild/m3 rebuild/m4` names only
`lanes/` test files.

### BLOCKING 1. The owner's real path is still refused, at `source-admission.mjs:273`

REPRODUCED, by me, first. `%TEMP%\fix-base-lane.log` is the lane run on the
UNCHANGED reviewed tree: D-PF-f1 green, which is the refusal itself, and D-PF-f2
green, which is the control. The finding is REAL and I do not dispute one word
of its description.

DISPOSITION: **CONFIRMED, NOT FIXED IN THE PRODUCT, PINNED BY CELLS, ESCALATED.**

WHY NOT FIXED HERE, in three parts, none of them "it is inconvenient":

1. NO AUTHORITY. Spec 4.1 authorises exactly one edit at `:273`: give the
   existing `fail` a `{field:'capture_sets', exercise_id:id}`. Spec 3.4 says so
   in the same words. What the check COMPARES is nowhere in the spec, and spec 6
   is the lockdown that says a build does not widen on its own reading.
2. IT IS A LIVE GUARD, not a leftover. It asserts that the athlete's own
   recorded Earned session carries as many slots as the state says the lift
   carries. Changing its right-hand side from the admitted state to the setup
   document (open question 1, option (b)) makes admission accept a file it
   refuses today, and that is a rule change. A build that quietly widens a
   refusal guard to make its own ticket's path green is doing the thing this
   lane's reviews exist to catch.
3. THE FIX IS NOT ONE LINE. The capture was written under the DOCUMENT; the
   basis under it is now the FILE. Option (b) compares against the document,
   option (c) rebases the capture. Each needs its own argument about what a
   recorded native workout means when the basis under it is replaced, its own
   cells, and its own PM ruling. The reviewer reached the same conclusion
   independently ("it wants its own small ticket").

WHAT I DID INSTEAD, so the gap cannot be lost or silently changed:

| added | where | what it pins |
|-------|-------|--------------|
| **D-PF-f3** | `p3-port-fix/capture-codes.test.mjs` | THE PM GATE'S TRIP-WIRE. The same phone, the same file, the same answers, and the pre-import workout REMOVED: the file ADMITS. So the trigger is exactly the PAIR (a workout recorded before the import) AND (per-lift set counts that differ from the one number the setup flow can write). f1 shows the refusal, f2 shows it is the set counts, f3 shows it is the workout. The day `:273` changes, f1 goes red and f3 stays green, and whoever changed it must come back and say which half is now true |
| **the copy block in D-PF-f1** | same file | WHAT HE WOULD READ on that refusal, rendered by the screen's own `refusalLines()`: `LOCAL_SOURCE_PROGRAMME_UNRESOLVED (capture_sets db-bench)` and then the one sentence of spec 3.2. No dash, no digit, no label, no date, no set count. See the new open question 5: the sentence is keyed on the CODE, and on this path the code arrives for a reason the sentence does not describe |

ESCALATED: open question 1 stands as written and is the PM gate the review asks
for. Nothing in this branch should be read as a promise that the owner's retry
after S7 succeeds; there are TWO things between him and that, this one and the
producer mapping of DECISIONS:472 BLOCKER 2.

### THE SEVEN NOTES

| note | disposition |
|------|-------------|
| **2. cell (a)'s next morning is not read through the booted page** | **CLOSED IN THE FIX ROUND.** D-PRR-2 now reads `next.booted.workout.gym.read()` BEFORE it opens any host of its own, and asserts that card's `total` is the FILE's `U` set count. That card is the one `today-entry.mjs` boot() built, adopted through `today-app.cjs:2482` `athleteBasisState()` and rebased by `gym.rebase()`; no basis, no host and no day is passed in. A `read()` prepares and mints nothing, so it runs before the cell's own Start rather than after it. The projector-level companion read is UNCHANGED and stays declared as deviation 2: `plan-edit-host.mjs`'s branch choice is proved in `durable-host.test.mjs` (32/0, now a standing bar row) |
| **3. B-B is a dead line, in the spec and in the build** | **AGREED, NOT CHANGED, RECORDED.** B-A refuses any period with `from > today`, so `periods.some(p=>p.from<=today)` is unconditionally true by the time it runs. It is spec 1.3's own diff line for line and removing it would be an unauthorised edit to the rule for no behavioural gain. The guarantee is delivered by B-A plus the non-empty check. A later reader should not believe there are two independent bounds |
| **4. the retained numbers are bounded by nothing** | **REPRODUCED AND PINNED, NOT CLOSED.** New cell **D-PF-n4** (`programme-rule.test.mjs`): a file whose `db-bench` carries `sets: 0` and whose `lat-pulldown` carries `sets: 40` ADMITS and is ADOPTED, both numbers riding into the basis. It is labelled KNOWN GAP and says in its own comment that the day a bound lands it must be rewritten to assert the refusal, not deleted. ONE THING THE REVIEW'S PROBE DID NOT SAY, which I found writing it: the lane's own builder CANNOT make such a file through `createCleanInitState` (`athlete-state.cjs:126` refuses `sets: 0` outright, `CLEAN_INIT_EXERCISE_REQUIRED / sets`), so the cell writes the numbers into the file's state after it is built. That is the exact shape of the hazard: the bound lives in the DOCUMENT constructor, which an old app's ledger never went through, and not in admission. Closing it is a PM ticket (spec 6), not a guard this build adds on its own authority |
| **5. the `CLEAN_INIT_*` case `detailOf` is written for cannot occur through `programme()`** | **AGREED, RECORDED.** `Setup.validate` at `:171` already runs `createCleanInitState` through `setupOf` and returns false on any throw, so an unusable document has refused with `{field:'setup_document'}` before `:172` is reached. The guard stays: it earns its place on the OTHER call site, the `:347` catch, where `storedWorkoutHistory`, `projector.project` and the engine runtime can genuinely throw a fieldless error. The missing cell is missing because the case is unreachable, which is now written down rather than implied |
| **6. the one sentence is untrue on an unenrolled phone** | **AGREED, NOT CHANGED** (open question 2, unchanged). Spec 3.2 rules ONE sentence; inventing a second is a spec change, not a build's. The fix round found a SECOND field the same argument applies to, `capture_sets`, and open question 5 below carries both to the PM as one decision rather than two |
| **7. B-C is enforced indirectly in admission, directly in the companion** | **AGREED, RECORDED, NO BEHAVIOURAL GAP.** `programme()` closes the period over `{from,map}` by rejecting any other key; a missing member is caught downstream (`split.from`) or upstream (`LOCAL_SOURCE_NON_JSON`). `plan-edit-model.cjs` `splitShapeOk` asserts both members directly. The two predicates are not one expression and a later reader should not read them as one |
| **8. the declared partial cells are declared accurately** | Noted, nothing to do. Cell (f) is 2 of 6 plus the copy measurement added here; cell (i) is 3 of 7; cell (e)'s third assertion is absent; cell (a)'s companion is projector-level. All four stay declared in section 7 |

The lane copy `f2-tag-adapter.cjs:166` is carried forward as the review asks: it
is F2's `setup-tags.cjs` byte for byte, every caller passes a clean-init state at
setup time and `m4/workout/setup-tags.cjs` is not in this tree, so it is not a
third guard TODAY. **If F2 merges, `projectSetupTags` is re-checked against this
rule before that merge lands.** Recorded here so it is not lost with the review.

### THE NINE PROBES

I reproduced PR7 (as D-PF-n4, above) and PR4 is already PF-e2 in this suite.
PR1, PR2, PR3a, PR3b, PR5 and PR6 each reproduce a cell this lane already holds
(PF-d2, PF-d4, PF-c2, PF-b2, PF-d4 and the `split.from` negatives) with a
different hand, and all agree. PR8 is the one-clock-per-file row of cell (i) the
build handed to the reviewer, and his answer is stronger than the spec expected:
`stamp()` carries `asOf` (`:111-112`), so a local day that MOVES inside one walk
refuses the whole walk with `LOCAL_SOURCE_STALE` before the rule could straddle
a midnight. The hoist at `:224` is belt-and-braces and stays. Cell (i)'s
real-midnight and offline rows remain unexecuted and stay declared.

### A FIFTH OPEN QUESTION FOR THE PM, raised by the fix round

THE ONE SENTENCE IS KEYED ON THE CODE, AND TWO FIELDS NOW ARRIVE UNDER IT FOR
REASONS IT DOES NOT DESCRIBE. Measured in D-PF-f1, rendered by the screen's own
`refusalLines()`:

    LOCAL_SOURCE_PROGRAMME_UNRESOLVED (capture_sets db-bench)
    This file was written by a different training week than the one you set up
    on this phone. Nothing on this phone was changed.

Nothing is wrong with his training week on that path: the week, the lifts, the
days and the muscle groups all agreed, and what refused was his OWN recorded
Earned session's slot count. The same shape of untruth is open question 2's
`setup_document` on an unenrolled phone. The honest fix in both cases is a
sentence keyed on the FIELD rather than the code, which is a one-line widening
of `REFUSAL_SENTENCE` plus the copy itself, and copy is a PM decision. I did NOT
write it: spec 3.2 rules exactly one sentence and a build does not invent copy.
The two cases are one decision and should be taken together.

### WHAT THE FIX ROUND CHANGED, file by file

| file | change |
|------|--------|
| `rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs` | ADDED D-PF-f3 (the PM gate's trip-wire) and the copy measurement inside D-PF-f1; `importAfterAWorkout` takes `{workout}` so f3 can hold everything else fixed |
| `rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs` | ADDED D-PF-n4 (KNOWN GAP, review finding 4) |
| `rebuild/lanes/d/p3-port-fix/owner-route.test.mjs` | D-PRR-2 reads the BOOTED PAGE's own gym card before it opens one of its own (review note 2) |
| `rebuild/lanes/d/P3-PORT-FIX-AUTHOR-REPORT.md` | this section, the commit table and the re-run bar |

NO product file, no `support.mjs`, no pinned import suite and no `DECISIONS.md`
line moved in this round. The seal is the same four product files as at review.
