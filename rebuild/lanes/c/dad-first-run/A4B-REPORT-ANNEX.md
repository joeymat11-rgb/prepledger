# A4B REPORT ANNEX

Evidence for `A4B-REPORT.md`. Head: `rebuild/lane-c-a4b`, base
`origin/rebuild/t2-client-core` @ 4ee62da. Three commits.

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

## 5. WHAT WAS NOT DONE

- S44, the hand test. A person's.
- `run-current-head.cjs --all` still needs a retained R1 repository path as
  argv[2], which this worktree does not have. Not run, not faked (carried from
  A4).
- The CI half of LANES.md:16: `rebuild.yml` enumerates five of the eight today
  suites, and now does not enumerate `catalogue.test.mjs` either. `.github` is
  editable only inside an engine package that re-pins it (DECISIONS:112, :117
  (4)), so this stays a residual on A4b's ledger line.
