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

---

## 13. Round 2 (delta bb2640c) - evidence

Candidate @ **bb2640c**, base **d9fee35**. `git diff --stat e67fde6..bb2640c -- rebuild/m3`
is **one file, `test/setup.test.mjs`, +12/-2**; everything else in the delta is docs (the
brief's two amendments, the report, this reviewer's two round-1 files carried onto the
branch) plus lane B's own `DECISIONS`/`REQUESTS`/`STATUS` lines picked up in the rebase.
`git status --short` empty at start and end.

**C1 CLOSED.** `serve.mjs` is now pid 48880 and this reviewer compared the served bytes
against a build run in its OWN worktree:

```
index.html  fresh 21380  207b6bb02b7ac651 | served 21380  207b6bb02b7ac651 | IDENTICAL true
styles.css  fresh 175055 fe551a904643e8d2 | served 175055 fe551a904643e8d2 | IDENTICAL true
app.js      fresh 1429756 e74d9352...     | served 1429780 4d00aa72...     | IDENTICAL false
   intent line in served app.js: TRUE | in fresh app.js: TRUE
```

The `app.js` difference is **24 bytes and entirely cosmetic**: four esbuild module-banner
paths for `@noble/hashes` files under `rebuild/m3/w6/node_modules`, which the builder's
worktree reaches through a `../../m3-w6-browser-bridge/` relative path and this
reviewer's resolves directly. It matters only because `plain-copy.cjs`'s build guard
attributes string literals by those banners, so this reviewer re-ran the guard on the
SERVED bytes:

```
served bundle: banners 112 , banners owned by today/ 25
banners carrying the bridge prefix: 4 ; any of them a today/ module: FALSE
P1 guard re-run on the SERVED bundle: offences 0 , frozen strings admitted 904
```

All 25 page-owned modules are attributed, none of the four bridged banners is a `today/`
module, and the guard's numbers on the served bytes are identical to the fresh build's
line. The stale-bundle finding is closed and nothing about it weakened the dash guard.

**C2 CLOSED.** Brief 4.2 now deletes the false clause and states the per-kind sizes in a
table (UPPER 8/24 at every day count; LOWER 8/24 at `D <= 2` and **5 lifts / 15 sets** at
`D >= 3`), names the catalogue `kinds` that make it so, and records both reasons this
reviewer gave for not "fixing" it: a second lower major lift would read 18 sets, HIGH,
and 4.3 is per bucket and unaffected. The one code hunk is the S32 assertion, which now
sums `r.sets` and pins 24 for upper at every count, 24 for lower at `D_L <= 2` and 15 at
`D_L >= 3`. Re-run here: **setup 145 / 145 / 0, catalogue 43 / 43 / 0.**

**C4 CLOSED.** Brief section 1 carries an AMENDED paragraph naming `today-bindings.mjs`
(+11/-2, with the reason that `save()` is what carries the payload), `today-entry.mjs`
and the journey `PAGE_PINS` re-pin, and stating that the other three pins stay
byte-identical.

**C5 CLOSED.** `A4B-REPORT.md` carries an OWNER LOOK NOTES section naming the straight
apostrophe in the F1 sentence against the curly one everywhere else on screen 2.

**C3 remains open as a residual**, correctly: it is a REQUESTS line for the lane lead to
the PM and no such line is on the tip yet. The code is unchanged and right.

---

## 14. Round 3 (owner look `DECISIONS:133`, delta 8e558ce) - evidence

Candidate @ **8e558ce** (code **c4a95d2**), base **9d493d0**. `git status --short` empty at
start and end. **Code delta `bb2640c..8e558ce` under `rebuild/m3` is exactly the four
files named**: `setup-app.mjs` (+16/-7), `setup-model.mjs` (+35/-4), `setup-check.mjs`
(+59/-1), `test/setup.test.mjs` (+93/-2). Everything else in the delta is docs, and the
non-`dad-first-run` docs (`LANES.md`, `REQUESTS.md`, `STATUS.md`, `lanes/d/CHARTER.md`,
`slice/P6-...`) arrive with the rebase onto 9d493d0, not from A4b's own commits.

### (1) The three `:133 (2)` strings, rendered with the owner's own row

`screenAt(6)` in jsdom with one exercise whose name is a lone comma - and again with
`""` and with `" "`. All three name shapes give the same screen:

```
week row  : One exercise (unnamed): What does it work? · 3 sets · aim for 10 reps
equip row : One exercise (unnamed): lightest setting not answered yet · jump: 5 lb, Earned's standard step
p.gap blocks: 3
  gap 1: One exercise on your upper body day still has no name.
  gap 2: One exercise has nothing it works yet.
  gap 3: One exercise has no lightest setting yet.
every gap a full sentence with a subject (capital + full stop): true
no glued run-on ("., " anywhere in the block): true ; old screen-3 label leaked: false
stray leading punctuation row (",:"): false
```

The three defects the owner read in the pane - `",: What does it work? · sets of each
exercise 3 · 10 reps"`, the glued `"... has no exercises in it., has nothing it works
yet., has no lightest setting yet."` and the form-label sets line - are all gone, and the
sets line reads exactly `3 sets · aim for 10 reps` as `:133 (2)` words it.

### RED-first, executed: the tests at c4a95d2 against the code at c4a95d2~1

```
not ok 136 - S42 - the two honest sentences render exactly when their predicate holds
not ok 146 - :133 (2) a - an unnamed exercise reads "One exercise (unnamed)", never punctuation
not ok 148 - :133 (2) c - the gaps are ONE PER LINE, each a full sentence with a subject
not ok 149 - :133 (2) d - the sets line is a sentence, not a form label
not ok 150 - :132 (3) - screen 2 uses ONE apostrophe, the curly one, in every sentence
# tests 150  # pass 145  # fail 5
```

(`hasName` is absent from the old `setup-model.mjs`, confirmed by grep.) The report claims
**fail 4**; the true figure is **fail 5** - the fifth is `S42`, which asserts the F1
sentence verbatim and so moved with the apostrophe. `:133 (2) b - a named exercise still
reads as its own name` is green on both sides, correctly: it is a regression guard, not a
defect cell, and a reviewer should not expect it to have been red.

### (2) The one naming predicate

`hasName = /[\p{L}\p{N}]/u`. Probed:

```
""  " "  "  "  ","  "-"  "--"  "..."  "…"  "!?"  "()"  "·"  U+2014  " \t\n "  "💪"   -> hasName FALSE
"a"  "  a"  "1"  "0"  "Ω"  "一"  "٣"  "3 sets"                                    -> hasName TRUE
null, undefined, 5, {}                                                            -> FALSE (no throw)
```

**The predicate is right.** A name of only punctuation counts as unnamed, which is the
case the owner actually hit, and it is the honest reading: a lone comma is not a name.
Letters and digits in any script count, so the rule is not Latin-only. `namedExercise`
returns the trimmed name or `"One exercise (unnamed)"`, `exerciseSubject` the trimmed name
or `"One exercise"`, and every place that talks about a lift asks one of the two, which is
what stops the three defects returning one at a time. One observation, not a defect: an
emoji-only name ("💪") is treated as unnamed, so the flow ASKS for a name rather than
silently accepting one the summary could not read back; the document refuses until he
answers, which is A4's own named-refusal behaviour.

### (3) `DECISIONS:132 (3)`, the apostrophe

Zero straight apostrophes in the ten screen-2 strings, and zero anywhere in `COPY` at all.
`screen2TwoDays` is byte-equal to `:125 (2)`'s sentence with the curly apostrophe, and
normalising the apostrophe shows the WORDS are unchanged from the ledger. Typography only,
as `:132 (3)` rules.

### (4) Screen 6 re-checked by this reviewer in a REAL browser

Own build, own `serve.mjs` on a random port, msedge at 390x844, driven to screen 6 with
one exercise named `,`:

```
p.gap blocks: 4   (three of the owner's, plus the empty lower day I also left)
  gap 1 (top 843px):  Your lower body day has no exercises in it.
  gap 2 (top 895px):  One exercise on your upper body day still has no name.
  gap 3 (top 964px):  One exercise has nothing it works yet.
  gap 4 (top 1016px): One exercise has no lightest setting yet.
distinct vertical positions: 4 of 4      <- genuinely one gap per LINE, measured
rows:
  One exercise (unnamed): What does it work? · 3 sets · aim for 10 reps
  One exercise (unnamed): lightest setting not answered yet · jump: 5 lb, Earned's standard step
```

The shipped `setup-check.mjs` also carries its own step now and passed here on a fresh
build: "screen 6 with an unnamed exercise: named row, sentence sets line, 3 gaps each on
its own line", inside a run with **7** real `taskkill /F /T` kills, the mid-flow kill still
leaving zero operations and no partial athlete, and A4's C1 landing sentence still shown.
NOTE for the record: the first time this reviewer ran that check it FAILED on the straight
apostrophe - because the reviewer's own `.tmp` dist was still the round-2 build, not
because anything on the branch was wrong. Rebuilt and re-run: PASS.

The served page on 4178 (pid 16880) IS the round-3 build; a raw `includes()` on the bundle
is not evidence either way, because esbuild escapes every non-ASCII character, so this was
checked through `plain-copy.cjs`'s own `decodeEscapes`:

```
served 4178: 1430855 bytes  curly F1 true / straight false / One exercise (unnamed) true / sets line true
fresh dist : 1430831 bytes  same four, all true
```

The 24-byte difference is the same cosmetic `m3-w6-browser-bridge` module-banner delta
judged in round 2; no page-owned module is affected.

### (5) Counts and mutants

setup **150** (145 -> 150, the five new cells) / catalogue **43** / today **64** / copy
**36** / gym **64** / checkin **28** / W6 **552** / journey **51** / A0 host **31** /
w7-preview **19** / `--ci` **PASS** with the worktree clean before and after / `build.mjs`
**PASS**, **102** pinned inputs. Zero regressions.

Five mutants, **5 killed / 0 survived**, each restored byte-identical with an empty
`git status --short`:

| # | mutation | result |
|---|---|---|
| X1 | the naming predicate reverts to the old `=== ''` emptiness test | KILLED 149/1 - `:133 (2) a` |
| X2 | the gaps are glued back into one run of inline buttons | KILLED 143/7 - `S4`, `S23 (b)`, `A4 - the named refusal ... is tappable back` |
| **X3** | REVIEWER: the sets line goes back to screen 3's form label | KILLED 149/1 - `:133 (2) d` |
| **X4** | REVIEWER: an unnamed exercise stops reporting its OTHER gaps (the pre-fix short-circuit) | KILLED 149/1 - `:133 (2) c` |
| **X5** | REVIEWER: the straight apostrophe comes back to screen 2 | KILLED 148/2 - `S42`, `:132 (3)` |

---

## 15. Round 4 (B-NTC re-pin, delta 5ba2419) - evidence

Candidate @ **5ba2419** (code **52f7eb8**), base **0964b30** (carries the B-NTC merge
ce38aa3). Worktree clean at start and at end.

### Custody, and the three files

`git diff --stat 0964b30..5ba2419` touches **only** `rebuild/m3/w7-preview/today/**` and
`rebuild/lanes/c/dad-first-run/**`. Nothing under `rebuild/m3/w6`, `rebuild/m4`,
`rebuild/engine`, `rebuild/client`, `rebuild/conform` or `.github`. The three files A4b
used to touch are byte-identical to the tip, checked by sha256 against
`git show 0964b30:<path>`:

```
IDENTICAL rebuild/m3/w6/local/today-bindings.mjs        95315f7a0e63cd49648a8c6c031d38a7bbce3f8e8f64e2fdfaf713b3ee174ce8
IDENTICAL rebuild/m3/w6/test/local-today-journey.test.mjs 4572517ce67b99ae93fc369821a387029bcbc2907ff9463ed33c6d123f4d62a7
IDENTICAL rebuild/m3/w7-preview/today/today-entry.mjs   b50b92314b8e7730b4aab56e79a9bff2f03d949d234eeaf2a7270ec83f3fa111
```

`today-entry.mjs` is back to its A4 value: A4b now changes it not at all.

### The B-NTC gate, run alone

```
==BEFORE==   (empty)
B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the package verdict ...
==AFTERGATE== (empty)   ==AFTER== (empty)
```

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` **PASSES** with the
worktree clean before and after. NOTE, and it is not A4b's: `native-carriers-package.cjs
--ci` now reports FAIL on this tree. That gate is **retired from CI** - `rebuild.yml:82`
runs the B-NTC gate in its place, on the tip as well as on this branch - and the B-NTC
package's own PROTECTED SURFACES line says the parent "keeps its own pin and therefore
REFUSES on these bytes; that refusal is this child's to supersede". The bytes in question
are `rebuild/m4/workout/engine-runtime.cjs`, which A4b does not touch. An earlier run of
mine reported both gates failing; that was my own fault - I had left
`rebuild/m4/spec/acceptance-native-carriers.json` modified by a concurrent run, and both
gates hash the worktree. Restored, re-run alone, results as above.

### Counts, executed here

```
setup                      156 / 156 / 0        W6                    552 / 552 / 0
catalogue                   43 /  43 / 0        journey                51 /  51 / 0  (PAGE_PINS unmoved)
today4                      64 /  64 / 0        host (3 test files)    32 /  32 / 0
copy                        36 /  36 / 0        w7-preview             19 /  19 / 0
gym                         64 /  64 / 0        build.mjs  PASS, 103 pinned inputs
checkin                     28 /  28 / 0
ntc-h6-delta                 8 /   8 / 0
rebuild.yml today step AS WRITTEN   164 / 164 / 0
the same step + setup.test.mjs      320 / 320 / 0
```

**The six new setup subtests**, by name (`test(` names 135 -> 141, none removed):

1. `re-pin - every file the B-NTC package pins is untouched by A4b, on disk`
2. `re-pin - the three files A4b used to touch are the tip's bytes`
3. `re-pin - the durable lane writes the tags and reads them back, from setup-host.mjs`
4. `re-pin - envelopeOf tells an envelope from a document, and never guesses`
5. `re-pin - a write with tags but NO setup is refused, and writes nothing`
6. `re-pin - tags for an id the week does not have are refused at the lane`

### The store, dumped on both paths

```
PATH 1, lane C's wrapped host, save({setup, tags}):
  ok true, op-device-...-1 ; second save -> SETUP_ALREADY_RECORDED
  generation: ops 1 | outbox 1
     kind=fact class=event payload keys IN ORDER ["profile","setup","tags"] profile=earned/first-run-setup/v1 schema=2
  read back: rows 1 | label Dad | tags 16 ids | tag ids === document ids TRUE
  lease local-era:e8ac6085...
PATH 2, W6'S OWN createSetupHost and its unchanged one-argument save(envelope):
  ok true ; generation: ops 1 | outbox 1 ; payload keys IN ORDER ["profile","setup","tags"]
  reading-host lease === setup lease TRUE      (one era, one lease, one clock)
  w6's own read-back carries tags: NO (w6's setupsIn predates A4b)
  lane C's setupsIn over the SAME generation reads them: yes
```

ONE op, ONE generation, first-run-only, tags read back and keyed to the document's own
ids - semantically what round 3 accepted, moved without loss.

### THE SEAM JUDGMENT: honest, with one undeclared coupling

Read, not assumed:

- **`rebuild/client/index.cjs:216-231` has no payload allowlist.** It checks the command's
  `schemaVersion === 2` and that `prepare`/`validate` are functions, calls
  `prepare(actions[0].workout)`, refuses only if `action.extra` collides with a reserved
  ENVELOPE key (`op_id, athlete_id, ..., payload, ...`), builds the op, then requires
  `validate(op, readOperation) === true`. The payload's shape is the producer's business
  by design - that is the A3 seam (`DECISIONS:107`) and `:129 (2)` ruled the widening.
- **w6's `save(setup)` validates nothing.** Read at the tip
  (`today-bindings.mjs:546-557`): it checks `alive`, re-reads `enrolled()`, then calls
  `execute("workout", { action: "first-run-setup", input: { setup } })`. The argument is
  forwarded opaquely. Passing an envelope therefore evades no check w6 performs.
- **The producer's own gate got STRICTER, not looser:** `validate` now requires
  `Object.keys(op.payload).length === 3` and re-runs `tagsOf` on the built envelope.
- **`envelopeOf` cannot confuse the two shapes**, proved rather than argued: a real
  document's keys are `["athlete_label","split","exercises","priority_muscles"]`; every
  malformed shape I fed it falls through to the document branch and is then refused -
  `setupOf({setup:1, tags:2})` throws `SETUP_INPUT_INVALID`.

So nothing is smuggled past a validator: the only validator on that path is lane C's own,
and it was widened by ruling and tightened in fact. **The judgment is HONEST USE.**

The one thing it leaves behind is a coupling nobody can read from w6: that file's
parameter is named `setup` and now sometimes carries `{setup, tags}`, and w6 cannot be
annotated because it is pinned on disk. That is a readability hazard for the next reader
and a latent breakage if anyone ever adds a shape check to `save`. Condition C8.

### Mutants: 3 killed, 2 survived, and what the survivors mean

| # | mutation | result |
|---|---|---|
| Y2 | the producer writes the op WITHOUT the tags member | KILLED 141/15 |
| Y3 | tags need not match the week's exercise ids | KILLED 153/3 - incl. `re-pin - tags for an id the week does not have are refused at the lane` |
| **Y5** | ONE byte changed in the B-NTC-pinned `today-bindings.mjs` | KILLED 154/2 - `re-pin - every file the B-NTC package pins is untouched by A4b, on disk` and `... are the tip's bytes`, AND the gate: `B PACKAGE B-NTC FAIL WORKTREE-SOURCE-PIN` exit 1. The pin test bites exactly as claimed |
| Y1 | `envelopeOf` dropped from `prepare` | **SURVIVED** 156/0 |
| Y4 | `envelopeOf` dropped from the wrapped `save` | **SURVIVED** 156/0 |

The two survivors mask each other, and I proved it:

```
BASELINE            w6.save(envelope) -> ok true
Y1 alone            w6.save(envelope) -> ok false, state 3, WORKOUT_INPUT_INVALID, nothing written
Y1 + Y4 together    suite pass 153 fail 3  (KILLED)
```

Y4 alone is harmless because `prepare`'s split catches it - benign redundancy. **Y1 alone
is not harmless**: it breaks the w6 one-argument path, which is the whole point of this
round's design, and the suite stays green. The new subtest `envelopeOf tells an envelope
from a document` tests the FUNCTION; nothing drives an envelope through w6's own
`createSetupHost().save()` into `prepare`. Condition C9, with the red-first test being
exactly the probe above.

### Browser and the served page

Four msedge checks PASS with verified real `taskkill /F /T`: `setup-check.mjs` with
**7** kills, the mid-flow kill still leaving zero operations and no partial athlete, and
its round-3 step "screen 6 with an unnamed exercise: named row, sentence sets line, 3 gaps
each on its own line"; plus `browser-check`, `gym-check`, `checkin-check`.
`http://127.0.0.1:4178/?screen=setup` returns **200**, and through
`plain-copy.cjs`'s `decodeEscapes` the served bundle carries every round-3 marker:
`One exercise (unnamed)` true, the sentence sets line true, the curly F1 sentence true,
the straight one false, the two doors true, `screen2Why` true.

### Residual noted

`w6`'s own `setupsIn` returns rows WITHOUT `tags`; only lane C's `setup-host.mjs`
`setupsIn` reads them. Nothing reads tags yet (F2, `DECISIONS:127 (6)`), so there is no
defect today - but F2 must take its tags from lane C's read-back, not from a host obtained
straight from w6.
