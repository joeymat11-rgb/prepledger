# A4B-REVIEW - EXECUTED EVIDENCE

Independent reviewer, effort HIGH, author != reviewer, told to disagree. Candidate
`rebuild/lane-c-a4b` @ **e67fde6**, base **4ee62da** (`origin/rebuild/t2-client-core`,
which was still the tip when this reviewer fetched). Worktree `work/lane-c/review-a4`,
`git status --short` empty at start and at end. Bar: `A4B-BRIEF.md` S26-S44 + M21-M32.

## 1. Counts, every suite run by this reviewer

`npm ci --include=dev` + `pnpm@9 --dir rebuild/m3/w6|w5 install --frozen-lockfile`, the
same installs `.github/workflows/rebuild.yml` does; `NODE_ENV` cleared each time.

| suite | claimed | EXECUTED |
|---|---|---|
| `test/setup.test.mjs` | 145 | **tests 145 pass 145 fail 0** |
| `test/catalogue.test.mjs` | 43 | **43 / 43 / 0** |
| today (adapter, view, design, package) | 64 | **64 / 64 / 0** |
| `test/copy.test.mjs` | 36 | **36 / 36 / 0** |
| `test/gym.test.mjs` | 64 | **64 / 64 / 0** |
| `test/checkin.test.mjs` | 28 | **28 / 28 / 0** |
| W6 | 552 | **552 / 552 / 0** |
| journey | 51 | **51 / 51 / 0** |
| A0 host (journey + engine-equivalence + host-seams) | 31 | **31 / 31 / 0** |
| w7-preview | 19 | **19 / 19 / 0** |
| `native-carriers-package.cjs --ci` | PASS | **PASS**, `git status --short` empty before AND after |
| `build.mjs` | PASS, 102 | **PASS**, "3 assets; **102 pinned inputs**; 68 bound classes; 3/3 assets free of any network reference; no em/en dash in any text the athlete can see (904 frozen-source strings ... only through plainCopy)" |

Zero regressions against S43's base row: today 64, copy 36, gym 64, checkin 28, W6 552,
journey 51, host 31, w7 19 are all unchanged. setup 104 -> 145 is **+41** (S26-S44 asked
for at least 40); catalogue 43 (asked for at least 34).

Four msedge checks, all **PASS**, real `taskkill /F /T` each verified dead:
`setup-check.mjs` (**6** kills, one MID-FLOW leaving zero operations and no partial
athlete; screens 2 and 3 walked in three states each; 320px; the A4 C1 landing sentence
still shown), `browser-check.mjs`, `gym-check.mjs`, `checkin-check.mjs`.

## 2. `proposeKinds`, re-derived and property-checked (S26)

This reviewer wrote its own oracle from the brief's pseudocode AND, separately, the
three properties `DECISIONS:125 (1)` states, then ran both over **all 127 non-empty
subsets of {0..6}**:

```
all 127 non-empty day sets: spec diffs 0, property failures 0
proposeKinds([]) = {} ; DAY_KINDS ["U","L"]
  1 Wed               Wed U                                          D_U 1 D_L 0
  2 Mon,Thu           Mon U, Thu L                                   D_U 1 D_L 1
  3 Mon,Wed,Fri       Mon U, Wed L, Fri U                            D_U 2 D_L 1
  3 WRAP Sat,Sun,Mon  Sat U, Sun L, Mon U                            D_U 2 D_L 1
  4 Mon,Tue,Thu,Fri   Mon U, Tue L, Thu U, Fri L                     D_U 2 D_L 2
  5 Mon-Fri           Mon U, Tue L, Wed U, Thu L, Fri U              D_U 3 D_L 2
  6 Mon-Sat           Mon U, Tue L, Wed U, Thu L, Fri U, Sat L       D_U 3 D_L 3
  7 all               Sun U, Mon U, Tue L, Wed U, Thu L, Fri U, Sat L  D_U 4 D_L 3
```

All eight rows of brief 2.2 match. The properties checked independently of the
pseudocode, for every one of the 127 sets: keys are exactly the input days; no value is
ever anything but U or L; the number of cyclically consecutive same-kind pairs is 0 for
even counts and exactly 1 for odd; for every odd count that one pair straddles the
LARGEST cyclic gap; calling twice is deep-equal and the caller's array is untouched.
The wrap case `{Sat,Sun,Mon}` rotates the start to Sat as the brief says, and its
repeated pair is Mon to Sat, gap 5, the largest. At n=7 every gap is 1 and the
smallest-index tie rule makes the forced Sun/Mon stack deterministic.

## 3. The starter week, re-derived from the ENGINE (S32)

`VOL_BANDS` read straight out of `constants.cjs:327` (`{floor 6, lo 8, hi 14, ceil 22}`)
and the zone ladder and the bucket arithmetic restated here from `volume.cjs:74-83`
(`bucket = head || mg`, `n = sets * days`). `starter-week.mjs`'s own `zoneOf` and
`weeklySets` were NOT used. Applied to the rows `proposeWeek()` actually emits:

```
D=1  D_U 1 D_L 0 | U 8 lifts/24 sets            chest 6 LOW* delts_side 6 LOW* lats 6 LOW* upper_back 6 LOW*
D=2  D_U 1 D_L 1 | U 8/24  L 8/24               all eight majors 6 LOW*
D=3  D_U 2 D_L 1 | U 8/24  L 8/24               U majors 12 IN-BAND*, L majors 6 LOW*
D=4  D_U 2 D_L 2 | U 8/24  L 8/24               all eight majors 12 IN-BAND*
D=5  D_U 3 D_L 2 | U 8/24  L 8/24               U majors 9 IN-BAND*, L majors 12 IN-BAND*, U minors 9 IN-BAND
D=6  D_U 3 D_L 3 | U 8/24  L 5/15               every bucket 9 IN-BAND (abs included)
D=7  D_U 4 D_L 3 | U 8/24  L 5/15               U 12 IN-BAND, L 9 IN-BAND, minors U 12 / L 9
rows with a load or a non-standard set/rep: 0 at every day count; ids unique: true
```

Every cell of brief 4.3 reproduces, including the two honest LOW rows. No major is ever
UNDER the floor at any day count. Nothing is inflated: D=1 and D=2 sit at 6, the floor,
and are declared rather than padded.

## 4. JUDGMENT 1 - the builder's disagreement with brief 4.2

**The implemented rule is right and the brief's sentence is wrong.**

Brief 4.2's normative parts are the two lists and the composition rule. Its closing
clause, "Session size is therefore always 8 lifts x 3 sets = 24 sets at every day
count", does not follow from them: `MINORS` is `delts_front, delts_rear, biceps,
triceps, abs`, and this reviewer read the kinds off the catalogue itself -

```
delts_front  U 4 , L 0      biceps  U 6 , L 0      abs  U 0 , L 9
delts_rear   U 3 , L 0      triceps U 5 , L 0
```

- so four of the five minors are UPPER and exactly one (`abs`) is LOWER. At D >= 3 an
upper session is 4 majors + 4 minors = 8 lifts and a lower session is 4 majors + 1 minor
= **5 lifts / 15 sets**, which is what my re-derivation prints at D=6 and D=7. The
builder implemented the rule and pinned it rather than the sentence, which is the right
choice twice over: the brief's own lists say so, and the alternative - a second lift on
a lower major at D_L >= 3 - would put those buckets at 2 x 3 x 3 = **18 sets, HIGH**,
outside the band the whole section exists to hit. Brief 4.3, which is per BUCKET, is
unaffected and reproduces cell by cell. **Fix the brief, not the code.**

## 5. JUDGMENT 2 - S31 and `CUSTOM_REGION_REQUIRED`

**The builder's reading is right; the bar's sentence is the thing that fails.**

`DECISIONS:127 (3)` and brief S31 both say "stopping at the group is complete". Executed
against the shipped picker:

```
chest     mg=chest head=null        arms  REFUSED CUSTOM_REGION_REQUIRED
back      mg=back  head=null        legs  REFUSED CUSTOM_REGION_REQUIRED
shoulders mg=delts head=null
core      mg=abs   head=null
back/lats mg=back head=lats ; shoulders/delts_front mg=delts head=delts_front ;
arms/biceps mg=biceps head=biceps ; legs/quads mg=quads head=quads ; core/abs mg=abs head=abs
```

Four of the six groups have a single engine `mg` and complete at the group. `arms` and
`legs` have none: the engine's eleven labels split arms into biceps/triceps/forearms and
legs into quads/hams/glutes/calves. The three ways to honour the sentence literally are
(a) store a coarse `"arms"`/`"legs"` - which is precisely the seven-group invention
`DECISIONS:115` struck out, and would give `volume.cjs:74` a bucket no band or indirect
rule knows; (b) pick a member for him, fabricating a tag he never gave; (c) ask for the
part. Only (c) is honest, and it costs one tap on two of six groups. So the code is
right and S31 / `:127 (3)` asserted a property their own six-group list cannot satisfy.
Because it departs from an OWNER ruling rather than only from the brief, it belongs in
a REQUESTS line and in the owner-look note, not only in a report paragraph.

## 6. The catalogue (S28, S29) - machine checks and an 18-entry read

Labels re-derived HERE: the eleven `mg` values parsed out of `seed.cjs` and the three
delt heads out of `constants.cjs:333`, then every entry checked against them.

```
size 83 (60..100 true) ; ids unique true ; bad mg none ; bad head none ; bad group none
bad kinds none ; bad alias none ; bad lend none ; names an athlete false
distinct lend values used: 0.25, 0.5
per group: chest 11 | back 19 | shoulders 10 | arms 14 | legs 20 | core 9
```

Eighteen entries read, three per group, and judged by this reviewer's own anatomy:

| entry | mg / head | secondary | verdict |
|---|---|---|---|
| chest_press_machine, incline_chest_press_machine, barbell_bench_press | chest / null | triceps 0.5, delts 0.5 | RIGHT. `head: null` is correct: `:127 (2)` names no chest region, so the lift buckets on `mg` (`volume.cjs:74`). The two 0.5s are `INDIRECT`'s own press fractions (`constants.cjs:330`), the SOURCED class |
| lat_pulldown, wide_grip_pulldown, neutral_grip_pulldown | back / lats | biceps 0.5 (+ forearms 0.5 on two) | RIGHT. `INDIRECT` pays pulldown to biceps at exactly 0.5. Forearms 0.5 is grip work and is the same sourced fraction. Minor inconsistency: wide-grip carries no forearms lend where neutral-grip does; defensible (grip demand differs) and not a finding |
| shoulder_press_machine, overhead_press, dumbbell_shoulder_press | delts / delts_front | triceps 0.5 (+ abs 0.25 on the standing press) | RIGHT. The anterior head is the pressing head, which is what `INDIRECT` already encodes for bench. abs 0.25 on a standing press is trunk bracing, the INVENTED fraction, and is the smaller of the two as the header promises |
| barbell_curl, dumbbell_curl, preacher_curl | biceps / biceps | forearms 0.5 | RIGHT, and exactly `INDIRECT`'s curl-to-forearms 0.5 |
| back_squat, front_squat, hack_squat | quads / quads | glutes 0.5 (+ hams 0.25, abs 0.25 on the back squat; abs 0.25 on the front squat) | RIGHT. Glutes above hams on a squat is correct, and the back squat's trunk demand is real. Front squat without a hams lend is defensible |
| plank, hanging_leg_raise, cable_crunch | abs / abs | none; forearms 0.5 on the hanging raise | RIGHT, and the grip lend on a hanging movement is a nice catch rather than a stray |

Nothing sampled is wrong. Every `mg`, including every secondary's, is one of the eleven;
every `head` is either a `constants.cjs:333` delt key or on the `:127 (2)` region list;
only 0.25 and 0.5 are used and 0.25 only where the lift plainly pays less.

## 7. Storage (S35), executed over the real constructor

For every day count 1..7: the starter week is applied, screen 4 is answered by hand
(the proposal leaves `first` blank, which is S33 working - before screen 4 the document
refuses with `all 'no lightest setting yet': true`), then:

```
D=1 exercises 8  | setup keys = REQUIRED_SETUP true | exercise keys = REQUIRED_EXERCISE true
                 | w null true | payload ["profile","setup","tags"] | tag ids match true | frozen true
D=2..5 exercises 16 , D=6..7 exercises 13 - all the same eight columns true
day counts whose document + payload are fully accepted: 7/7
```

`head` and `secondary` never reach a document exercise; the payload is exactly three
closed members; the tags' key set equals the document's exercise ids exactly.

## 8. Mutants: 16 killed / 0 survived

Twelve of the brief's and four of this reviewer's own. Each applied to the real file,
`test/setup.test.mjs` + `test/catalogue.test.mjs` run, the file restored and
`git status --short` asserted empty before the next.

| # | mutation | result |
|---|---|---|
| M21 | odd counts start at the first day, ignoring the largest gap | KILLED 185/3 - `S26 - proposeKinds: 3 day(s) [0,1,6]`, `S26 ... 7 day(s)` |
| M22 | an override is re-proposed over | KILLED 187/1 - `S27 - adding a day re-proposes the days he did NOT speak for, and only those` |
| M23 | one head spelled `delts_lateral` | KILLED 184/4 - `S28 SOURCED: every delt head is a constants.cjs MG_LABEL key` |
| M24 | one entry stores `mg: "shoulders"` | KILLED 185/3 - `S28 SOURCED: every catalogue mg is one of those eleven` |
| M25 | one major lift at D=2 | KILLED 183/5 - `S32 - starter week at 3 day(s) ... from volume.cjs's own arithmetic` |
| M26 | three lifts at D=1 to force the band | KILLED 184/4 - `S32 - starter week at 1 day(s)`, `... 2 day(s)` |
| M27 | `head` added to a DOCUMENT exercise | KILLED 136/52 - `closed()` throws across the contract rows |
| M28 | `validate` still insists on a two-member payload | KILLED 177/11 - `A4 - validate() accepts its OWN envelope ...` |
| M29 | search stops matching aliases | KILLED 186/2 - `S30 search matches every alias of every entry` |
| M30 | stopping at the group is never complete | KILLED 186/2 - `S31 - the custom picker adds his own lift, and refuses to guess a bucket it cannot name` |
| M31 | an em dash in the F1 sentence | KILLED 186/2 - `S23 (a)`, `S42` AND the build: `AI_DASH_IN_BUILD: 1 em/en dash(es) in text the athlete can see` |
| M32 | the first-run write stops being once-only | KILLED 186/2 - `S13 - a SECOND "Start using Earned" ...` |
| **R11** | REVIEWER: the starter week under-fills a major (chest never placed) | KILLED 179/9 - `S32` at five day counts |
| **R12** | REVIEWER: a catalogue entry carries `lend` 1.5 | KILLED 182/6 - `S29 every lend is a finite number in (0,1]` |
| **R13** | REVIEWER: tags need not match the document's exercise ids | KILLED 186/2 - `S35 - validate accepts the three-member payload and every refusal cell` |
| **R14** | REVIEWER: the starter week invents a load | KILLED 187/1 - `S33 - the starter week invents no load, set count or rep target` |

## 9. The screens, driven on the served page

Screen 2 walked at one, two and three days on a fresh msedge profile at 390x844:

- 1 day: `With one day, Earned can give you one upper day. A second day is what lets it
  cover your lower body at all.` The builder's sibling sentence, which the brief left to
  him. Honest, dash-free, promises nothing, and names the real shortfall rather than
  implying F1 will fix one day. ACCEPTED.
- 2 days: `With two days, Earned's full-body plan is coming; for now one upper day and
  one lower day.` **Verbatim** from `DECISIONS:125 (2)`.
- 3 days: neither sentence. The predicate clears, S42 as written.
- Every state dash-free; **zero** off-origin requests.
- The rule is declared on screen: "Earned alternates upper and lower down your week, and
  when the count is odd it repeats the kind across your longest gap. That is Earned's own
  rule, not a published standard. Change any day and Earned will leave it alone after
  that." That is `:129 (3)`'s "marks the mechanism invented" met plainly, and it puts no
  fabricated authority in front of Dad.

Screen 3 opens on "How do you want to start? / Build my week for me / I'll choose", with
the standard-start block and the empty Upper/Lower lists beneath - both doors above one
editable week, which is `:127 (1)`. Brief 3.1's "and nothing else to read" is looser in
practice than on paper; that is the owner's to judge in the pane, not a bar failure
(S34, which is what the bar actually checks, passes).

## 10. THE STALE SERVED ARTIFACT (condition C1)

`COPY.screen2Why` - "The point is to work each muscle about twice a week, with a couple
of days between sessions of the same kind." - is the `:129 (3)` INTENT line. It is in the
source, it is appended at `setup-app.mjs:138`, and `test/setup.test.mjs:1955` asserts it.
It did NOT render in this reviewer's walk of the served page, and the reason is not the
code:

```
served app.js (pid 60960) bytes 1429004  screen2Why text in served bundle: FALSE
fresh dist on disk    bytes 1429563  screen2Why in the FRESH dist: TRUE
```

The running `serve.mjs` is serving a bundle built before that line was added. The owner
look, which the report points at `http://127.0.0.1:4178/`, would have been conducted on
a screen missing the one sentence `DECISIONS:129 (3)` requires. `build.mjs` then a
restarted `serve.mjs` closes it; the PM's own look procedure does exactly that, which is
why this is a precondition of the look and not a defect in the build.

## 11. Custody

`git diff --numstat 4ee62da..e67fde6`, 18 paths: the four docs under
`rebuild/lanes/c/dad-first-run/`, the three new modules (`split-kinds.mjs` 72,
`exercise-catalogue.mjs` 304, `starter-week.mjs` 156), `test/catalogue.test.mjs` (364),
`test/setup.test.mjs`, the four A4 `setup-*` modules, `build.mjs`, `design.cjs`,
`today-entry.mjs`, `rebuild/m3/w6/local/today-bindings.mjs` and
`rebuild/m3/w6/test/local-today-journey.test.mjs`. **Nothing** under `rebuild/engine`,
`rebuild/client`, `rebuild/conform`, `rebuild/m4/**`, `rebuild/m3/w6/host`, `.github`,
`src` or `ledger`. `screens.template.html` and `today-app.cjs` are licensed and untouched.

The three files outside the brief's ADD/EDIT lists, judged:

1. `today-bindings.mjs` (+11/-2): `save(setup)` becomes `save(setup, tags)` and
   `setupsIn` reads `tags` back, `null` for a pre-A4b op. **Within licence** - the file is
   lane C exclusive (`LANES.md`, `:106`, `:111`) - but brief section 1 states
   "`today-bindings.mjs` is NOT touched", which is **wrong**: `save()` is the function
   that carries the payload, so widening the payload cannot avoid it. The annex documents
   the hunk but does not name the brief sentence it contradicts.
2. `today-entry.mjs` (+2/-2): `onDone(document_, tags_)`. Within licence (`:106 (b)` /
   `:111`, the same one-store wrapper licence A4 used), and unavoidable for the same reason.
3. `local-today-journey.test.mjs` (+6/-1): the `today-entry.mjs` pin re-pinned
   `b50b9231... -> c2802779...` with its reason. Within licence (`w6/test/**` is lane C's,
   `:106`; the pin's own failure message instructs the editor), and **the other three pins
   are byte-identical** to A4's rounds (`gym-host 70a59b5c...`, `reading-host a3e92015...`,
   `checkin-host 029b3a9b...`), which is the check that the wrapper files were not disturbed.

## 12. Not run

`S44`, the hand test: a human run through both doors. This reviewer is not a person and
did not perform it. CI both OS: this reviewer does not push. No phone run.
