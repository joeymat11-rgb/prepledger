# A4B REPORT

Branch `rebuild/lane-c-a4b`, base `origin/rebuild/t2-client-core` @ 9d493d0 (tip
frozen for product merges until B-NTC lands; every move since round 1 is
docs-only, `today-bindings.mjs` untouched by them, both rebases clean). Round 1
ACCEPT WITH CONDITIONS at e67fde6, round 2 ACCEPT at bb2640c, round 3 = the
owner's look, `DECISIONS:133 (2)` + `:132 (3)`. Evidence: `A4B-REPORT-ANNEX.md`.

## ROUND 3: OWNER LOOK :133

All three screen-6 defects had ONE cause: a row or a gap was composed out of an
exercise's NAME without asking whether there was one, so a nameless exercise
printed its punctuation. `setup-model.mjs` now holds the single predicate - a
name is present when it carries a letter or a digit - and both summary rows and
every gap sentence ask THAT, so the three cannot come back one at a time. (His
own row was a lone comma, and a lone comma is not a name.)

- **(1) The lost fallback.** `namedExercise()` returns `One exercise (unnamed)`
  for the week row AND the equipment row. Was `",: What does it work? ..."`.
- **(2) The glued gaps.** They were bare inline buttons, so the browser flowed
  three into one run-on sentence. Each now sits in its own `p.gap` block and each
  copy is a whole sentence with a subject: an unnamed exercise is named as a gap
  of its own AND still speaks for its others (`One exercise has nothing it works
  yet.`), rather than hiding two of them behind the first.
- **(3) The form label.** `setsLine()` gives `3 sets · aim for 10 reps`; screen
  3's `Sets of each exercise` label is out of the summary.
- **`:132 (3)`.** `COPY.screen2TwoDays` keeps `:125 (2)`'s WORDS and takes the
  curly apostrophe the rest of screen 2 uses: typography only, through P1's
  boundary, dash-free, and screen 2 now carries no straight apostrophe at all.

RED then GREEN: the four new subtests failed first - **150 tests, 146 pass, 4
fail** - then passed. `setup-check.mjs` walks screen 6 with an unnamed exercise
in a real browser: named row, sentence sets line, 3 gaps each its own block.

Rounds 1 and 2 are unchanged: days-only screen 2, screen 3's two doors above one
editable week, three closed payload members over an unchanged document.

## COUNTS (Windows, this head)

setup **150** / catalogue **43** / today **64** / copy **36** / gym **64** /
checkin **28** / `build.mjs` **PASS**. Four msedge checks PASS, `setup-check.mjs`
now at **7** real taskkills each verified dead. W6 552 and journey 51 NOT re-run:
this round changed only `setup-app.mjs`, `setup-model.mjs`, `setup-check.mjs` (a
check harness, not in the bundle) and `test/setup.test.mjs`.

    A1 TODAY BUILD PASS: 3 assets; 102 pinned inputs (13 engine, 12 client);
    approved design pinned; 68 bound classes; no em/en dash in any text the
    athlete can see

## SERVED, AND PREFLIGHT (DECISIONS:135 (3), self-check)

http://127.0.0.1:4178/ , `serve.mjs` pid **16880**, rebuilt on this head;
`/app.js` served **1431048 bytes**, byte-for-byte the dist on disk (sha256
e5066af7...), carrying `One exercise (unnamed)`, ` sets \xB7 aim for `,
`el("p", "gap")` and `’s full-body plan is coming`. Preflight: diff inside
custody **PASS** (20 paths, nothing under engine / client / conform / m4 /
w6-host / .github / src / ledger); report <= 60 lines **PASS**; no U+2013 or
U+2014 in UI custody **PASS** (build guard + the browser check at every state);
counts present **PASS**, above; CI at the exact head reported with the push.
