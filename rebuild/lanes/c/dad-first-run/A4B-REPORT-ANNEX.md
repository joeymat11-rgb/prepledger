# A4B REPORT ANNEX

Evidence for `A4B-REPORT.md`. Head: `rebuild/lane-c-a4b`, base
`origin/rebuild/t2-client-core` @ 9d493d0 (4ee62da at round 1, d9fee35 at round
2; every move since is docs-only, no B-NTC code has merged, `today-bindings.mjs`
untouched by them, all three rebases clean with no conflict).

Section 0 is the owner's look (round 3), section 0a round 1's conditions, and
sections 1 to 5 the original build's evidence, which still stands.

## 0c. WHAT WAS RE-RUN THIS ROUND

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
