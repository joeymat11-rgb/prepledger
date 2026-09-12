# A4B REPORT ANNEX

Evidence for `A4B-REPORT.md`. Head: `rebuild/lane-c-a4b`, base
`origin/rebuild/t2-client-core` @ **aa06544**, which carries the B-NTC merge
(4ee62da at round 1, d9fee35 at round 2, 9d493d0 at round 3). Every rebase so far
has been clean with no conflict.

Section 00 is the re-pin onto B-NTC and 00b the blocker it exposed; section 0 is
the owner's look (round 3), 0a round 1's conditions, and 1 to 5 the original
build's evidence, which still stands.

## 00c. CI AT THIS HEAD

Polled from `work/lane-c/main` with `node ..\tools\ci-status.js
rebuild/lane-c-a4b <sha>` until both runs completed:

    d5696bc pipeline  completed success  34680440032
    d5696bc rebuild   completed failure  34680439982
      job rebuild-public (windows-latest) failure
        Cumulative B-NTC native-carrier and legacy-census evidence
      job rebuild-public (ubuntu-latest)  failure
        Cumulative B-NTC native-carrier and legacy-census evidence

`pipeline` is green. `rebuild` fails on both operating systems at exactly one
step - the one that runs `b-package.cjs --ci --package B-NTC`, rebuild.yml line
82 - and at no other. That is the blocker in 00b, reproduced in CI, and it is
the only thing standing between this head and green. A later docs-only commit
moves the head; its run fails identically at the same step, for the same reason.

## 00. RE-PIN ONTO THE B-NTC MERGE (DECISIONS:144)

**The rebase.** `git rebase origin/rebuild/t2-client-core` (tip aa06544, which
carries the B-NTC merge ce38aa3) replayed all eleven commits with **no conflict
in any file**, `today-bindings.mjs` included. Git could merge it because lane B's
H6 wiring and A4b's change live in different functions of the same file: lane B's
`trendBinding` / `dayReader` / `scoped` / `engine.genSession` / `engine.rirPlan`
sit around line 325 inside the era builder, and A4b's three hunks sit at 533-563
inside `createSetupHost`. Verified two ways rather than trusting the merge:

    git diff origin/rebuild/t2-client-core...HEAD -- .../today-bindings.mjs
      3 hunks, +11 / -2, all A4b's:
        setupsIn(): tags read back beside the document, null for a pre-A4b op
        save(setup) -> save(setup, tags)
        execute(): input { setup } -> { setup, tags }
      nothing of lane B's wiring appears in the diff, in either direction

and by reading the file: lines 325-340 are lane B's, unchanged. The journey
suite's `PAGE_PINS` still pass (51/51), which is the second witness that the
wrapper files were not disturbed.

**What the tip moved under us, absorbed without edits.** `build.mjs` now reports
**103** pinned inputs, not 102 (B-NTC added a module to the page graph), and the
A0 host suite is **32**, not 31 (B-NTC added a host-seams subtest). Neither is
A4b's doing and neither needed a change here.

**Mutants NOT re-run.** No licensed non-test file changed in this round at all -
the rebase produced no conflict to resolve and no follow-on edit. The last mutant
run stands at the round 1 head (M21-M32, 12/12 killed) plus the reviewer's
R11-R14.

## 00a. THE UNBLOCK: TAGS HANDLING MOVED OFF THE PINNED FILES

The blocker in 00b is closed without a ruling and without a workaround, by
moving A4b's code rather than the pin.

**Which files the artifact actually reaches.** Two, not one. `packages/B-NTC.json`
pins `rebuild/m3/w6/local/today-bindings.mjs` AND
`rebuild/m3/w6/test/local-today-journey.test.mjs`, and the second pins
`today-entry.mjs` by sha256 inside its own `PAGE_PINS`. A4b had touched all
three. All three are now byte-identical to the tip:

    today-bindings.mjs            95315f7a0e63cd49...  = package pin
    local-today-journey.test.mjs  = package pin
    today-entry.mjs               = the sha PAGE_PINS carries

`rebuild/m3/w6/local/local-client.mjs` is NOT pinned (checked against the
package's `product` map before starting), so the extension point was available.

**Where the tags went.** The durable lane's `save()` takes ONE argument and that
signature is w6's. So the screens hand it ONE argument that is an envelope:

    setup-app.mjs   onDone({ setup, tags })              lane C
    today-entry.mjs onDone(document_) -> host.save(document_)   TIP BYTES
    w6 save(setup)  -> execute("workout", { input: { setup } }) TIP BYTES
    setup-commands.mjs prepare()  envelopeOf(input.setup, input.tags)  lane C
                    -> payload { profile, setup, tags }

`envelopeOf` lives in the PRODUCER, not in setup-host.mjs, and that placement is
the whole correctness argument: `boot()` hands today-entry.mjs its already-open
era, and today-entry then asks **w6's own** createSetupHost for the lane - with
OUR commands, but with w6's one-argument save. The envelope therefore has to come
apart inside the command, which is the one part of that path lane C owns
outright. A first shape of this fix unpacked it in setup-host.mjs instead; every
Node test passed and the BROWSER refused with `WORKOUT_INPUT_INVALID`, because in
the page the host is w6's, not this module's. That is recorded here because the
suite could not see it and only the real browser could.

**What setup-host.mjs adds.** It still calls w6's createSetupHost for the era,
the lease, the clock, the producer-hook client, reopen(), the refusal face and
close(). On top it supplies `all()` (the same read-back narrowed by profile, plus
`tags`), `enrolled()`, and a `save(document, tags)` that takes the two apart for
the suite. No second store, no second lease, no second clock, no second
generation.

**Guard, red-first.** Two new subtests read the pins out of `packages/B-NTC.json`
itself rather than restating a hash, and compare every pinned path to the bytes
on disk; a third checks `today-entry.mjs` against the sha `PAGE_PINS` carries.
Appending one comment line to `today-bindings.mjs` turns both red; removing it
turns them green.

**Mutants on the moved code, 6/6 killed, each restored byte-identically.**

| id | what was done | what went red |
|---|---|---|
| N1 | `envelopeOf` stops recognising the envelope | setup 4 fail, incl. the real "Start using Earned" write |
| N2 | the producer drops `tags` from the payload | setup 11 fail (S18, S13, S35, the durable lane) |
| N3 | `setupsIn` reads `tags` back as null | setup 1 fail, the read-back cell |
| N4 | `save` skips the enrolled() re-read | setup 2 fail, both S13 second-write cells |
| N5 | the screens send two arguments instead of the envelope | setup 1 fail, the UI write |
| N6 | one comment line appended to `today-bindings.mjs` | setup 2 fail, both pin guards |

Two of the six are the cells this dispatch named: **tags written without setup**
(a `{ setup: undefined, tags }` envelope is refused and writes nothing) and
**tags for an id not in the week** (`tags.ghost_lift` is refused at the lane);
both are asserted as their own subtests as well.

**One more thing the check gained.** `setup-check.mjs` now reports an
`unhandledrejection` from the page. Every control on these six screens is an async
click handler, so a throw inside one is a rejected promise nobody awaits: the
screen simply does not advance and the next `waitFor` times out with no reason
attached. That is exactly how the `WORKOUT_INPUT_INVALID` above presented, and it
cost a round of guessing.

## 00b. THE BLOCKER, IN FULL (now closed by 00a)

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` is what
`rebuild.yml` line 82 now runs in place of `native-carriers-package.cjs --ci`.
On this head it prints three OBSERVED lines and then:

    B PACKAGE B-NTC FAIL WORKTREE-SOURCE-PIN; required evidence missing or
    failed; local diagnostics withheld

The gate is `rebuild/conform/v4/postfix/legacy-gates.cjs:12-16`:

    for(const [file,hash] of Object.entries(pins)) {
      if(sha(object(root,commit,file))!==hash) fail('GIT-SOURCE-PIN');
      if(disk&&sha(fs.readFileSync(path.join(root,file)))!==hash)
        fail('WORKTREE-SOURCE-PIN');
    }

Two checks per pinned file: the git object at the pinned commit, and **the bytes
on disk**. Measured here:

    packages/B-NTC.json:228  today-bindings.mjs post  95315f7a0e63cd49...
    tip's bytes (git show origin/...:...)             95315f7a0e63cd49...  match
    this worktree's bytes                             20650a8821fc7105...  differ

So `GIT-SOURCE-PIN` passes and `WORKTREE-SOURCE-PIN` fails, and it fails for the
A4b delta the licence explicitly grants (`:129 (1)`, `:106 (b)`, `:111`). CI
checks the branch out, so the same step fails there; the run id is in section 00c.

**Why lane C cannot fix it.** The three places that could - `.github/rebuild.yml`,
`rebuild/lanes/b/tooling/packages/B-NTC.json` and `rebuild/m4/**` - are all named
OUT in A4b's custody and in this dispatch, and two of them are the seal itself:
editing a pin to match my bytes is forging the artifact the gate exists to
protect. The fourth option, reverting the `save(setup, tags)` delta, would leave
the third payload member unable to reach the producer, which is the whole of
A4b's storage ruling (`:129 (2)`).

**What it is an instance of.** `DECISIONS:132` froze the tip for the files B-NTC
pins, because a tree whose bytes the artifact does not pin makes the child gate
refuse. That freeze protected the seal while lane B sealed. The same rule now
points the other way: the merged artifact pins a file that lane C holds
exclusively and has a live licensed edit to, so ANY A4b head fails the gate. It
wants a ruling, not a workaround - a successor package, a re-seal on the A4b
merge, or a disk-check exemption for files in another lane's custody are all PM
calls.

## 0d. COUNTS ON THE REBASED HEAD (this round)

today 64 / copy 36 / gym 64 / checkin 28 / setup **156** / catalogue 43 /
ntc-h6-delta 8 / W6 552 / journey 51 (PAGE_PINS unmoved) / A0 host 32 / w7 19,
every one 0 fail. `rebuild.yml`'s today step run exactly as written (adapter,
checkin, design, gym, ntc-h6-delta, package, view) 164/164. `build.mjs` PASS at
103 pinned inputs, 68 bound classes. Four msedge checks PASS.

    node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the
    package verdict; the 19 original gates, the private oracle and independent
    exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is
    unavailable on this mode at any time

Run alone, `git status --short` carrying only A4b's own edits before and after.
One thing to know about that gate: it writes `rebuild/m4/spec/
native-carriers-changes.json` while it runs. It restores the file itself, and
this run left it clean, but a run interrupted part way would not - check for it
before committing.

Gym card after B-NTC, informational: `gym-check.mjs` still reports `"Last time"
prints on day 1's active set from the engine's own comparison (C4d), and day 2's
lifts, which have none on file, print nothing rather than an invented one`, and
no day+3 same-lift-group refusal text appears in any of the four checks' output.
No walk in those checks places a same-group lift three days apart, so that is an
absence, not a demonstration that the refusal is gone.

## 0c. WHAT WAS RE-RUN IN ROUND 3

setup 150/150, catalogue 43/43, today 64/64, copy 36/36, gym 64/64, checkin
28/28, `build.mjs` PASS (102 pinned inputs, 68 bound classes), and all four
msedge checks PASS - `setup-check.mjs` now does 7 real taskkills, each verified
dead, and walks screen 6 with an unnamed exercise.

W6 552 and journey 51 were NOT re-run. This round touched `setup-app.mjs`,
`setup-model.mjs`, `setup-check.mjs` and `test/setup.test.mjs` only:
`today-bindings.mjs` and `today-entry.mjs` did not move, and `setup-check.mjs` is
a check harness that nothing imports into the bundle (`build.mjs`'s
REQUIRED_INPUTS does not name it). The journey suite's `PAGE_PINS` cover
`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs` and `checkin-host.mjs`,
none of which changed, so the pin that instructed the round 1 re-pin has nothing
to say here.

**Served, for the PM's re-look.** `serve.mjs` pid **16880** on 127.0.0.1:4178,
started after `build.mjs` on this head. `/app.js` is **1431048 bytes** served and
**1431048 bytes** on disk (`.tmp/w7-today-dist/app.js`, sha256
`e5066af7b0c99025ffc58c7a76436209c471c185fcc36ab6fff6f1efcbed061d`), and the
bundle carries `One exercise (unnamed)`, `" sets \xB7 aim for "`, `el("p", "gap")`
and `’s full-body plan is coming`. (The bundle escapes non-ASCII, so a probe
must look for `\xB7` and `’`, not the characters themselves; an earlier probe
of mine looked for the characters and reported a false negative, which is worth
recording so the next one does not repeat it.)

## 0. ROUND 3: THE OWNER'S LOOK, DECISIONS:133 (2) AND :132 (3)

**The diagnosis.** The owner read three defects on screen 6 and they are one
defect seen three times. Every place that TALKS about an exercise built its
sentence out of `lift.n` and asked at most `=== ''` about it, which is not the
question: his row held a lone comma, so `=== ''` was false, the name went
through, and the screen printed `",: What does it work? ..."`. The gap copies
did the same with `NAME`, so `NAME has nothing it works yet.` became
`, has nothing it works yet.` - and because the gap list was a run of bare
inline `button`s, the browser laid three of those fragments end to end into the
sentence he quoted. The fix is one predicate in `setup-model.mjs`, asked by
everything:

    hasName(v)          -> /[\p{L}\p{N}]/u.test(v)     a letter or a digit
    namedExercise(v)    -> v.trim() | "One exercise (unnamed)"   (rows)
    exerciseSubject(v)  -> v.trim() | "One exercise"             (gap sentences)
    setsLine(sets, hi)  -> "3 sets \xB7 aim for 10 reps"

Two words, not one, because the ledger uses two: a ROW says which exercise it is
and a GAP takes it as a subject. `missingExercises()` no longer `continue`s past
an unnamed exercise either: it names the missing name AND still reports what else
that exercise is missing, because the owner saw all three at once and hiding two
of them behind the first would make the screen under-report itself.

**RED, recorded.** With the four new subtests in and no fix:

    node --test test/setup.test.mjs
    not ok 146 - :133 (2) a - an unnamed exercise reads "One exercise (unnamed)"...
    not ok 148 - :133 (2) c - the gaps are ONE PER LINE, each a full sentence...
    not ok 149 - :133 (2) d - the sets line is a sentence, not a form label
    not ok 150 - :132 (3) - screen 2 uses ONE apostrophe, the curly one...
    # tests 150   # pass 146   # fail 4

**GREEN.** Same command after the fix: `# tests 150  # pass 150  # fail 0`. The
jsdom cells cover `''`, `'   '` and `','` for the fallback, a named exercise for
the absence of the fallback, the per-gap block wrappers and sentence shape, the
sets wording, and screen 2 carrying no U+0027 at all.

**In a real browser.** `setup-check.mjs` gained a launch that walks screen 1 to 6
with ONE exercise and no name, then reads the rendered DOM: `One exercise
(unnamed)` present, `/,\s*:/` absent, `3 sets \xB7 aim for 10 reps` present,
`sets of each exercise 3` absent, and every `p.gap` a `display: block` with
exactly one button and a sentence in it. It reported `3 gaps each on its own
line`. Screen 2's assertion now requires the curly apostrophe and refuses any
straight one anywhere on that screen.

**:132 (3), what did and did not change.** `COPY.screen2TwoDays` is the same
WORDS as `DECISIONS:125 (2)`; only U+0027 became U+2019. It still renders through
P1's `plainOrDrop` boundary and the build's dash guard still passes. The two
places that asserted the straight form - S42 and `setup-check.mjs` - were updated
with it.

## 0a. ROUND 1 CONDITIONS, EXECUTED

**C1, the stale bundle, RED then GREEN.** The reviewer was right and the failure
was mine: the page had been served from a dist built before the `:129 (3)` intent
line went in, so the owner would have judged screen 2 without the sentence the
ruling requires.

    RED   GET http://127.0.0.1:4178/app.js  (pid 60960)
          Content-Length 1429197, body 1429004 bytes
          contains "The point is to work each muscle about twice a week" : False
          contains "That is Earned...own rule"                           : True
    FIX   node rebuild/m3/w7-preview/today/build.mjs   -> A1 TODAY BUILD PASS,
          3 assets, 102 pinned inputs, 68 bound classes
          stop pid 60960, start rebuild/m3/w7-preview/today/serve.mjs
    GREEN GET http://127.0.0.1:4178/app.js  (pid 48880)
          body 1429587 bytes
          contains "The point is to work each muscle about twice a week" : True
          contains "not a published standard"                            : True
          contains "full-body plan is coming"                            : True
          GET http://127.0.0.1:4178/  -> 200

The +583 bytes are `COPY.screen2Why` and the two lines of `setup-app.mjs` that
render it. The server now runs on the rebased head's build.

**C2.** `A4B-BRIEF.md` 4.2 amended in place, marked `AMENDED 2026-09-12 (review
round 1, condition C2; rulings DECISIONS:125 (1), :127 (4), :129 (3))`: the false
closing sentence is quoted, shown not to follow from the section's own two lists,
and replaced by a per-kind table. Its opening sentence now says "an UPPER session"
and points at the amendment. The S32 session-size subtest gained set-count
assertions: `want * 3` for every cell, plus 15 at `D_L >= 3`, 24 at `D_L <= 2`
and 24 for upper at every day count. Still 145 pass.

**C3.** The coordinator's REQUESTS line to the PM. Named in the report's owner-look
notes so the look does not have to rediscover it.

**C4.** `A4B-BRIEF.md` section 1 amended in place, marked `AMENDED 2026-09-12
(review round 1, condition C4; licence DECISIONS:129 (1))`: the "NOT touched"
sentence is quoted and corrected, `save(setup, tags)` and the `setupsIn` read-back
are named as the reason, the count is given as +11/-2, and `today-entry.mjs` (+4)
and the journey `PAGE_PINS` re-pin (+7) are disclosed beside it.

**C5.** Flagged in the report's owner-look notes. Nothing changed: the sentence is
verbatim from `:125 (2)`, and normalising its apostrophe to U+2019 would make it
no longer verbatim. The PM or the owner decides.

**C6.** S44, the hand test. Still a person's.

## 0b. WHAT WAS RE-RUN AFTER THE CONDITIONS

setup 145/145, catalogue 43/43, today 64/64, copy 36/36, gym 64/64, checkin 28/28,
`build.mjs` PASS. W6 552, journey 51, A0 host 31, w7 19 and the four msedge checks
were NOT re-run: between e67fde6 and this head the only changes are
`A4B-BRIEF.md`, the two report files, the two copied review files and one subtest
of `test/setup.test.mjs`. No licensed non-test file moved, so nothing those suites
cover can have changed. Section 4 below is the round 1 evidence and stands.

## 1. HUNKS BY FILE

`rebuild/m3/w7-preview/today/split-kinds.mjs` (NEW, 73 lines). `proposeKinds`
and `DAY_KINDS`. Header separates the INVENTED mechanism from the CITED intent
(DECISIONS:129 (3), Schoenfeld, Ogborn and Krieger 2016). `DAY_KINDS` is written
out rather than imported from `setup-model.mjs`, because the model now calls this
module when a day is tapped and an import back would be an initialisation cycle.

`rebuild/m3/w7-preview/today/exercise-catalogue.mjs` (NEW, 305 lines).
Provenance header, then `GROUPS`, `GROUP_MG`, `REGIONS`, `REGION_MG`,
`ENGINE_MG`, the frozen-entry helper, 83 entries (11 chest, 19 back, 10
shoulders, 14 arms, 20 legs, 9 core), then `bucketOf`, `byId`, `searchByName`,
`regionsOf`, `entriesFor`, `canStopAtGroup`, `customEntry`, `entriesInBucket`.

`rebuild/m3/w7-preview/today/starter-week.mjs` (NEW, 157 lines). `VOL_BANDS` and
`zoneOf` re-stated from constants.cjs:327 / volume.cjs:83; the five INVENTED
exports fenced in their own block; `planBuckets`, `weeklySets`, `zonesOf`,
`proposeWeek`.

`rebuild/m3/w7-preview/today/test/catalogue.test.mjs` (NEW, 365 lines, 43
subtests).

`setup-model.mjs` (+191). A4b COPY keys (`screen2Proposal`, `screen2Rule`,
`screen2Why`, `screen2Yours`, `screen2Ours`, `screen2TwoDays`, `screen2OneDay`,
the eight screen-3 door keys, `floorSentence`, `minorsSentence`); `GROUP_WORDS`
and `REGION_WORDS`; the `overrides` closure with `chosenDays` and `repropose`;
`toggleDay` and `setDayKind` rewritten; `overrides()` and `proposedKinds()`;
`applyProposal`, `addFromCatalogue`, `setHead`, `setSecondary`; `newExercise`
gains `head` and `secondary`; `document()` returns `tags` beside `setup`.

`setup-app.mjs` (+203). Imports the catalogue and the starter week; five view
state variables for screen 3; `screen2` prints the proposal line, whose choice
each day is, the rule, the intent and the one- and two-day sentences;
`doorsPanel`, `openDoor`, `kindFor`, `addEntry`, `repaintOnChange`,
`searchPanel`, `pickerPanel`; `screen3` composes them above the unchanged
standard block and week lists (now `screen3Standard`); `onDone(doc, tags)`.

`setup-commands.mjs` (+50). `tagsOf`; `prepare` accepts `tags` and builds the
three-member payload; `validate` requires exactly three and runs `tagsOf`.

`setup-check.mjs` (+66). Screen 2's rule, provenance label and the verbatim F1
sentence; screen 3's two doors, the built week, the two band sentences, the
search add and the two-layer picker; a full 320px pass over screens 1 to 3 while
the device is still unenrolled.

`build.mjs` (+8). Three new REQUIRED_INPUTS, 99 to 102.

`design.cjs` (+9). `assertSetupBinding` re-escapes a harvested sentence before
looking for it in the view source, so a sentence containing an apostrophe (the F1
sentence, quoted verbatim from the ledger) is still checked rather than failing.

`today-entry.mjs` (+4). `onDone(document_, tags_)` hands both to `host.save`.

`w6/local/today-bindings.mjs` (+13). `save(setup, tags)` forwards `tags` into the
command input; `setupsIn` reads `tags` back beside the document, `null` for an op
written before A4b.

`w6/test/local-today-journey.test.mjs` (+7). `PAGE_PINS['today-entry.mjs']`
re-pinned to `c2802779b0ff46251d65559a93a41e1d4baa151a5b9d5bfca4c1ce5b3e779668`
with the reason recorded beside it. Re-read against `today-bindings.mjs` first:
`boot()` still opens the local era by default, the `hosts` branch is unchanged,
and no wrapper opens a store of its own.

## 2. S26 TO S44 ROLL-UP

- **S26** MET. `KIND_ROWS`, eight rows, one subtest each, plus the stack-count,
  largest-gap, empty, keys-equal-days, never-REST and purity cells.
- **S27** MET. Four subtests: the proposal fills every tapped day; an override
  survives `next/goto/back/goto` and reaches `split.map`; adding a day re-proposes
  only the days he did not speak for; the screen labels whose choice each is.
- **S28** MET. `catalogue.test.mjs` re-derives the eleven `mg` labels from
  `seed.cjs`'s EXERCISES block, the three delt heads from `constants.cjs`'s
  MG_LABEL line, `0.5` from its INDIRECT line, and `bucketOf` from `volume.cjs`'s
  own `e.head || e.mg`. Regions, groups, REGION_MG agreement and secondary mgs
  all checked entry by entry.
- **S29** MET. 83 entries; ids unique; every entry has an alias; `kinds`
  non-empty and a subset of {U,L}; every lend finite in (0,1]; the file names no
  athlete (the one alias that did, "sulek wrist curl", was replaced with "barbell
  wrist curl"); entries and the array frozen.
- **S30** MET. Search matches `n`, every alias and the id, tolerates punctuation,
  honours its limit, returns nothing for empty and unknown, and is pure; group
  then region returns exactly the entries carrying that tag. On the screen: the
  search box adds a lift with its tags, and says so when it has nothing.
- **S31** MET. Stopping at a group that names one engine bucket yields a complete
  entry with `head: null`; opening a region sets `head` and its `mg`; free-text
  `mg` still works and refuses a non-engine label; the picker refuses rather than
  returning a half-entry. ARMS and LEGS cannot be a terminus: the engine has no
  such bucket, so the screen asks for the part (`CUSTOM_REGION_REQUIRED`) instead
  of inventing one. That is a deliberate reading of "stopping at the group is
  complete" and is called out here for the reviewer.
- **S32** MET. Seven subtests, one per day count, each recomputing weekly sets
  with volume.cjs's arithmetic re-typed in the test and each zone with
  volume.cjs:83's ladder, cell by cell, the two LOW rows included. Plus: every row
  is a catalogue entry carrying its tags; the proposer is pure and deterministic;
  session sizes pinned (see the report's disagreement).
- **S33** MET. `sets`/`hi` are A4's standards; `first`, `inc` and `rungs` come out
  blank; no row carries `w`; no catalogue entry carries a weight, load or step.
- **S34** MET. Both doors are on screen before either is opened; the build door
  fills 16 rows at four days; after either door every entry is renameable and
  removable and the other door is still one tap away; switching doors destroys
  nothing he added and building twice does not double the week.
- **S35** MET. Section 5's acceptance for all seven day counts, and seventeen
  refusal cells on `validate` plus seven on `prepare`: two and four members, a
  tags key the document lacks, a document id with no tag, tags not a map, head a
  number, head empty, head absent, a third tag member, secondary not an array,
  lend 0, 1.5, "0.5" and NaN, a secondary with no mg, a secondary with an extra
  member, and `head` added to a document exercise.
- **S36** MET. `setup-check.mjs`: one op, written once, six real taskkills each
  verified dead, a kill mid-flow leaving zero operations and no partial athlete.
- **S37** MET, unchanged from A4 and still green.
- **S38** MET. Every new string is a COPY key rendered through `plainOrDrop`; an
  em dash planted in the F1 sentence turned `build.mjs` RED with
  `AI_DASH_IN_BUILD` naming `setup-model.mjs`, and was removed (M31).
- **S39** MET. `design.cjs` harvests COPY, so the new screen-3 vocabulary is
  covered without a list; a declared sentence dropped from the view still fails
  the build (that subtest is green).
- **S40** MET. 390x844 and 320px, every state of screens 2 and 3 including both
  doors, the search open, the picker open and a sixteen-plus-entry week, all with
  `scrollWidth <= clientWidth`; inputs >= 16px and tap targets >= 44px measured on
  all six screens.
- **S41** MET with a named scroll: screen 3 is a whole editable week plus both
  doors, ~8300px of content in an 842px viewport at 390px and ~7400px at 320px.
  The primary action is fully visible once scrolled to in every state, measured.
- **S42** MET. The F1 sentence renders verbatim at exactly two days and clears at
  one and at three; the sibling one-day sentence does the same; screen 3's floor
  and minors sentences render at two days or fewer and clear above.
- **S43** MET. Counts in the report; no suite lost a subtest.
- **S44** NOT RUN. It is a person's hand test.

## 3. MUTANTS

| id | what was done | what went red |
|---|---|---|
| M21 | `if (n % 2 !== 0)` to `if (false)` in `proposeKinds` | setup 3 fail: the 3-day wrap row, the 7-day row, the largest-gap cell |
| M22 | `repropose` no longer skips overrides | setup 1 fail: S27 adding-a-day |
| M23 | `lateral_raise` head spelled `delts_lateral` | catalogue 4 fail: delt heads, region list, REGION_MG agreement, shoulders group |
| M24 | `front_raise` given `mg: "shoulders"` | catalogue 3 fail: the eleven labels, REGION_MG agreement, shoulders group |
| M25 | `liftsPerMajor` 1 lift at D=2 | setup 5 fail: the 3, 4 and 5-day rows, session size, S34 |
| M26 | `liftsPerMajor` 3 lifts at D=1 | setup 4 fail: the 1, 2 and 3-day rows, session size |
| M27 | `head` added to a document exercise | setup 29 fail: `closed()` throws through the whole suite |
| M28 | `validate` kept `payload.length !== 2` | setup 11 fail: S35 and every durable-lane subtest |
| M29 | search index drops each entry's first alias | catalogue 2 fail: alias search, id/punctuation |
| M30 | `customEntry` no longer refuses a group with no single bucket | catalogue 1 + setup 1 fail: S31 both halves |
| M31 | em dash planted in the F1 sentence | `build.mjs` FAIL `AI_DASH_IN_BUILD`, naming the file and the string |
| M32 | a write on every Next, and the enrolled guard removed | `setup-check.mjs` FAIL; setup 2 fail: both S13 second-write subtests |

Each mutant was reverted immediately and `git status --short` was clean of it
before the next one; the final tree carries none.

## 4. RUNS

All on Windows, in the worktree, against this head.

- `node --test test/setup.test.mjs` - tests 145, pass 145, fail 0.
- `node --test test/catalogue.test.mjs` - tests 43, pass 43, fail 0.
- `node --test test/adapter.test.mjs test/view.test.mjs test/design.test.cjs
  test/package.test.cjs` - 64/64.
- `node --test test/copy.test.mjs` - 36/36. `test/gym.test.mjs` - 64/64.
  `test/checkin.test.mjs` - 28/28.
- `node --test rebuild/m3/w6/test/*.test.mjs` - 552/552.
- `node --test rebuild/m3/w6/test/local-today-journey.test.mjs` - 51/51.
- `node --test rebuild/m3/w6/host/test/journey.test.mjs
  .../engine-equivalence.test.cjs .../host-seams.test.mjs` - 31/31.
- `node --test rebuild/m3/w7-preview/test/*.test.cjs` - 19/19.
- `node rebuild/m4/spec/native-carriers-package.cjs --ci` - every gate OBSERVED,
  "NATIVE CARRIERS PUBLIC CI EVIDENCE PASS".
- `node rebuild/m3/w7-preview/today/build.mjs` - PASS, 3 assets, 102 pinned
  inputs, 68 bound classes, no dash in any text the athlete can see.
- Four msedge checks with `W7_BROWSER_BIN` pointed at Edge: `browser-check.mjs`,
  `gym-check.mjs`, `checkin-check.mjs`, `setup-check.mjs` - all PASS.
  `dash-check.mjs` is a library the other three import, not a runnable check.

`setup-check.mjs` PASS line, verbatim tail: "6 REAL PROCESS KILLS (taskkill /F
/T, each verified dead); no off-origin request, no horizontal overflow at 390px
or 320px, every input >= 16px and every tap target >= 44px MEASURED ON 6 OF THE
SIX SCREENS, the primary action reachable on every screen, and no U+2013 or
U+2014 rendered anywhere on them."

## 4b. THE REVIEWER'S OWN MUTANTS

Round 1 added four beyond M21-M32 and all four were killed: R11 the starter week
under-fills a major (S32, 9 red), R12 a catalogue `lend` of 1.5 (S29), R13 tags
need not match the document's ids (S35), R14 the starter week invents a load
(S33). 16 killed, 0 survived.

## 5. WHAT WAS NOT DONE

- S44, the hand test. A person's.
- `run-current-head.cjs --all` still needs a retained R1 repository path as
  argv[2], which this worktree does not have. Not run, not faked (carried from
  A4).
- The CI half of LANES.md:16: `rebuild.yml` enumerates five of the eight today
  suites, and now does not enumerate `catalogue.test.mjs` either. `.github` is
  editable only inside an engine package that re-pins it (DECISIONS:112, :117
  (4)), so this stays a residual on A4b's ledger line.

## 6. CI AT 52f7eb8, AND THE WINDOWS-ONLY `b-ntc-journeys` RESULT

`pipeline` **34682324863 success**. `rebuild` **34682324819**: job
`rebuild-public (ubuntu-latest)` **success**, job `rebuild-public
(windows-latest)` **failure** at step 13, "Cumulative B-NTC native-carrier and
legacy-census evidence".

What is NOT the failure. Every pin line the unblock was about passes on BOTH
runners, windows included: `PRODUCT IMPLEMENTED; 33 at the declared post-image /
0 at the pinned pre-image / 20 carried byte-identical from the parent / 0
unlisted drift`, and `FIDELITY OBSERVED; sourceBase 50fa37a ancestor of HEAD
52f7eb8`. There is no `WORKTREE-SOURCE-PIN` and no `GIT-SOURCE-PIN` anywhere in
either log. The two heads before it (d5696bc, 70287c5) failed on BOTH runners;
this one does not.

Where it stops. On windows, 14 of the package's 15 declared children print
`CHILD <name> OBSERVED; exit 0`; the 15th, `durable-journeys`
(`rebuild/m4/spec/b-ntc-journeys.cjs`), prints nothing and the run ends 16s
later with `B PACKAGE B-NTC FAIL; required evidence missing or failed; local
diagnostics withheld`. That sentence is `b-package.cjs:1536-1538`: when the
refusing assertion's leading word is not one of the runner's own `FAIL_CODES`,
the child's captured stdout is never echoed, so the TAP is not in the log and
cannot be. On ubuntu the same child prints `53381 bytes of stdout` and is
OBSERVED, between `focused` and `profile-refusals`, in 11s.

What that child runs, and what this branch owns of it. `b-ntc-journeys.cjs` is
19 lines: it sha-pins ten files against `packages/B-NTC.json`'s `product` map,
then spawns ONE `node --test --test-reporter=tap` over all ten with
`TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`, `NODE_OPTIONS=''`,
`timeout:180000`, and asserts exactly `/^# pass 238$/m` and `/^# fail 0$/m`. The
ten are `rebuild/m3/w7-preview/today/test/{adapter,checkin,design.test.cjs,gym,
ntc-h6-delta,package.test.cjs,view}`, `rebuild/m3/w6/host/test/{journey,
engine-equivalence}` and `rebuild/m3/w6/test/local-today-journey.test.mjs`. This
branch modifies **none of the ten**; all ten are byte-identical to the tip,
which is why the sha loop (the only part of the child that can fail fast) passed.
What the branch does reach them with is indirect: `design.cjs` and `build.mjs`,
which `design.test.cjs`, `package.test.cjs` and `view.test.mjs` exercise, and
`today-entry.mjs`'s setup graph, which `local-today-journey.test.mjs` imports.

Attempts to reproduce it, all on this Windows PC, all from a deleted `.tmp`
(the build's `DIST` is `.tmp/w7-today-dist`, so a deleted `.tmp` is the
fresh-checkout state CI starts from):

- `node rebuild/m4/spec/b-ntc-journeys.cjs` on node **24.18.0**, CI env:
  `# pass 238 / # fail 0`, `B-NTC DURABLE JOURNEYS: 238/238 PASS`.
- the same child on node **22.22.0** (CI's `node-version: '22'`, downloaded for
  this): `# pass 238 / # fail 0`, same verdict, 9.5s.
- the same ten files on node 22 at `--test-concurrency=3` (a GitHub windows
  runner has 4 CPUs; this PC has more, and `node --test` sizes its file
  concurrency from `availableParallelism`): `# pass 238 / # fail 0`.
- `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC`, which runs
  the child itself: `B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS`, worktree clean
  before and after.

Ruled out on the evidence, not by assertion: CRLF (`.gitattributes` is `* text=
auto eol=lf`, so both runners check out the same bytes, and the child's own sha
loop would have refused first); a spawn timeout (180s budget, 16s elapsed); a
`maxBuffer` overrun (8MB budget, 53KB of TAP on ubuntu); and a stale `.tmp`
(deleted before every local run above).

Not yet ruled out, and it cannot be from here: an ordering or timing difference
on the runner itself - the ten files run under one `node --test`, and one of
them (`package.test.cjs`) rebuilds `.tmp/w7-today-dist` and binds a local HTTP
port while the other nine run beside it. A re-run of
the failed job would settle flake-or-not in one shot; the token this worktree
has cannot POST `rerun-failed-jobs` (403, "Resource not accessible by personal
access token"), so the next push is the second sample.

The honest statement of the residual, as written before the second sample: this
branch touches none of the ten files the failing child executes, passes that
child on both node versions CI could use and at the runner's concurrency, and
passes the gate command itself; the windows-latest result is unexplained.

THE SECOND SAMPLE SETTLED IT. The next push (8f4e6af) changed only these two
documents - the whole code tree, and every one of the ten files the child
executes, byte-identical to 52f7eb8 - and CI came back green on BOTH runners:
`rebuild` **34683297008 success**, with `rebuild-public (windows-latest)`
success at step 13 and every step after it, and `pipeline` **34683296919
success**. So the 52f7eb8 windows failure was transient: the same tree, the same
runner image, the same child, green. It is recorded here rather than erased,
because a flake in a gate whose diagnostics are withheld costs the next lane an
hour, and because `b-package.cjs`'s `local diagnostics withheld` branch is worth
a REQUEST to lane B - one line of the child's captured stderr would have named
this in a minute.

## 7. ROUND 4, C9: THE MUTANT THE SUITE COULD NOT SEE

The reviewer's round-4 mutants left two survivors, Y1 (`envelopeOf` dropped from
`prepare`) and Y4 (dropped from lane C's wrapped `save`), and they survived
because they mask each other: with both in place either half still splits the
envelope. Y4 alone is benign redundancy. **Y1 alone is not**: the page does not
get lane C's wrapper at all. `boot()` hands `today-entry.mjs` an already-open
era and today-entry asks **w6's OWN** `createSetupHost` for the lane, passing
lane C's commands but keeping w6's one-argument `save(setup)` - so with Y1 the
envelope reaches `setupOf` whole and the write is refused. The suite stayed
green anyway, because `re-pin - envelopeOf tells an envelope from a document`
tests the FUNCTION and every durable subtest went in through the wrapper.

The new subtest closes exactly that hole. It opens the era through
`openTodayHosts`, asks `era.createSetupHost({ day, commands: createSetupCommands(),
profile: PROFILE })` - w6's own handle, not lane C's - calls `w6.save({ setup,
tags })` with ONE argument, and asserts on the op as it sits in the generation:
one op, `Object.keys(payload)` deep-equal to `['profile', 'setup', 'tags']` in
that order, the document (not the envelope) under `setup`, and the tags beside it.

RED first, executed, with only `prepare`'s `envelopeOf` call replaced by a plain
`{ setup: input.setup, tags: input.tags }`:

```
Y1 applied     tests 157 | pass 156 | fail 1
               C9 - an envelope through w6's OWN createSetupHost().save()
               AssertionError: w6's one-argument save took the envelope
               false !== true          (ok false; no op written)
restored       tests 157 | pass 157 | fail 0
```

`git diff --stat` after the restore shows the one test file and nothing else, so
the mutation left no residue in `setup-commands.mjs`.

C8 is recorded and not fixed here, deliberately: w6's parameter is still spelled
`setup` and now sometimes carries `{setup, tags}`. Renaming it to `input` (or
restoring the second parameter) is a byte in `today-bindings.mjs`, which is the
one thing this whole round exists to avoid - so it rides the lane lead's REQUESTS
line to whoever next unpins that file.
