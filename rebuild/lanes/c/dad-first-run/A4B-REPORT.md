# A4B REPORT

Branch `rebuild/lane-c-a4b`, base `origin/rebuild/t2-client-core` @ 4ee62da.
Brief `A4B-BRIEF.md`. Evidence, hunks by file and the S26-S44 roll-up:
`A4B-REPORT-ANNEX.md`. Served http://127.0.0.1:4178/ , `serve.mjs` pid 60960.

## WHAT LANDED

Screen 2 asks only for the DAYS; `split-kinds.mjs` proposes each day's kind, the
screen prints the mechanism as Earned's own INVENTION and the intent it serves
(citation in the module header, DECISIONS:129 (3)), and a tap makes a day his: no
re-proposal may move it after that. Screen 3 offers TWO DOORS above the SAME
editable week, so neither is a wall: "Build my week for me" fills the chosen days
from the catalogue, "I'll choose" opens search-by-name and the two-layer picker,
and A4's by-hand path is still there. The payload widens to three closed members
`{profile, setup, tags}`; the document is unchanged, no load is asked and screen
4 is untouched.

## FILES (16 changed, +2470 / -40 vs the base)

NEW under `today/`: `split-kinds.mjs` 73, `exercise-catalogue.mjs` 305 (83
entries), `starter-week.mjs` 157, `test/catalogue.test.mjs` 365. EDITED, all in
custody, hunks by file in the annex: the four A4 setup modules, `build.mjs` (99
to 102 pinned inputs), `design.cjs`, `today-entry.mjs`, `today-bindings.mjs` and
`local-today-journey.test.mjs`. `screens.template.html` needed NO edit.

## COUNTS (Windows, this head)

setup **145** (was 104) / catalogue **43** (new) / today **64** / copy **36** /
gym **64** / checkin **28** / W6 **552** / journey **51** / A0 host **31** / w7
**19** / `native-carriers-package.cjs --ci` **PASS** / `build.mjs` **PASS**. Four
msedge checks PASS (browser, gym, checkin, setup; setup does 6 real taskkills,
each verified dead). Mutants **M21-M32: 12/12 killed**, each restored
byte-identically. S26-S43 met; S44 hand test NOT RUN, it is a person's. Two
subtests changed SETUP, none moved or removed: "2.8 row 13" now tests for the
autonomy member and the quoted level, not the bare word "propose"; "screen 2
names an unanswered day" reaches blank through the override-clear route.

## THE FIVE OPEN QUESTIONS AND THEIR SEAMS

Three were RULED at DECISIONS:129 during the build; the build matches all three.
(1) Licence: custody as measured is the ruling's list exactly. (2) Tags: seam is
`tagsOf` plus its one call in `validate`. (3) Day-kind rule: seam is
`proposeKinds`; the ruling's cited intent (Schoenfeld, Ogborn and Krieger 2016)
is folded into that header and one screen line, `COPY.screen2Why`. (4) F1/F2 out
of scope: seam is `COPY.screen2TwoDays`, predicate only, and the `tags` map
nothing reads. (5) Composition: the five `starter-week.mjs` exports.

## RESIDUALS, AND ONE DISAGREEMENT WITH THE BRIEF

1. Brief 4.2's "always 8 lifts x 3 sets = 24 sets at every day count" does NOT
   hold for LOWER at D >= 3: the minors list names four upper minors and one
   lower (abs), so a lower session is 5 lifts / 15 sets there. Every 4.3 cell is
   per BUCKET and unaffected. Built the RULE, not the sentence, and pinned it.
2. S41: screen 3 legitimately scrolls (a built two-day week is ~8300px in an
   842px viewport: a whole editable week plus both doors). The primary action is
   fully visible once scrolled to, at 390px and at 320px, in every state.
3. No owner screen 4-6 notes landed at the rebase; nothing folded. Carried from
   A4: H3, H2, F1, F2, and `catalogue.test.mjs` joins the unenumerated suites.
