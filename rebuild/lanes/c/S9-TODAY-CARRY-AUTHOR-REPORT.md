# S9-TODAY-CARRY, author report

Lane C (screens), riding the S9 reseal child. Branch `rebuild/c-s9-today-carry`, cut from
the chain tip `9e1ece8`. This report is a hypothesis, not evidence: every number in it was
measured on this tree and can be re-measured by the commands named beside it. The reviewer
is asked to disagree wherever the evidence lets them.

Environment for every run below: `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`,
node from the codex runtime, Windows.

## 1. What the ticket asked, and what moved

| ticket item | what moved |
|---|---|
| (1) S2, the sentence | `today-model.cjs` gains one pure function; `today-app.cjs` binds it on one line; `design.cjs` widens `headlineVocabulary`; a golden and a proposals-bearing cell on the real imported shape |
| (2) the hotfix cell's CI home | a lane C step in `.github/workflows/rebuild.yml` naming both lane C cells; the S1 cell strengthened per review R1 M2 |
| (3) the adapter identity lines | `adapter.test.mjs:126` and `:259` now state the whole law through one helper |

## 2. Every touched path, with its pin status

Pin status was re-read from `rebuild/m4/spec/acceptance-s8-real-shape.json` with a small
script before the first edit and again before each commit. "PINNED" means the path appears
in that artifact; the role it appears under is named.

| path | pinned by S8? | where |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-model.cjs` | unpinned | zero hits |
| `rebuild/m3/w7-preview/today/design.cjs` | unpinned | zero hits |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | unpinned | zero hits |
| `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs` | unpinned (new file) | zero hits |
| `rebuild/lanes/c/S9-TODAY-CARRY-AUTHOR-REPORT.md` | unpinned (new file) | zero hits |
| `rebuild/m3/w7-preview/today/today-app.cjs` | PINNED | `product` |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | PINNED | `product`, `executionPins`, `children[0].argv` |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | PINNED | `product`, `executionPins`, `children[0].argv` |
| `.github/workflows/rebuild.yml` | PINNED | `product` |

### The one pinned file this ticket did not name, and why it moved

The ticket names `today-app.cjs`, `adapter.test.mjs` and `.github/workflows/rebuild.yml`.
`view.test.mjs` is pinned too and it moved. It had to: `view.test.mjs:102` and `:116`
assert that the `instruction-why` slot equals `plainCopy(marchingOrder.why)`, which is the
defect written down as a law, and the fixture render changes the moment the slot carries a
whole sentence. This is not an extra scope I chose: the adopted diagnosis of record says it
in terms ("S2 has NO unpinned route: the composition changes what the fixture renders, so
`view.test.mjs:102` and `:116` must be edited too, and both files are pinned. This one must
ride a lane B reseal child"), and DECISIONS:534 adopted that document and ruled (b) that S2
rides this child. Two assertion lines moved, plus a comment; nothing else in that file.
PM: this is the one item to confirm rather than assume.

## 3. Red first

Commit 1 (`1ddaf59`) carries the cells only. The three product files were reverted to the
tip before it was measured, so what follows is the cells against the UNCHANGED product.

| suite | result against the unchanged product |
|---|---|
| `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs` | 5 tests, 0 pass, 5 fail |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | 4 tests, 3 pass, 1 fail |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | 23 tests, 21 pass, 2 fail |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | 20 tests, 20 pass, 0 fail |

The golden failed with `actual: undefined`, `expected: 'Before coffee, log last night: bed,
wake, and how long you took to drop off: the body-composition read leans on this harder than
anything else you enter'` - the owner's own screen, made whole.

The S1 cell's one red was the new vocabulary assertion: the card title he actually read was
invisible to both gates. The two `view.test.mjs` reds are the two lines the diagnosis names.

HONEST EXCEPTION. `adapter.test.mjs` was green from the start and stayed green. Its new law
states a behaviour that ALREADY landed with P3-TODAY-HOTFIX (DECISIONS:534 (a)), so there is
no red to show for it; it is a law made complete, not a defect fixed. Its red side is a
regression that removes `planMove` from `today-model.cjs`, which I did not stage.

## 4. The bar, measured after the change (commit `5111716`)

| suite | at the tip | here |
|---|---|---|
| today, the thirteen cells of the CI step | 661 / 661 | 661 tests, 660 pass, 1 fail (by design, section 5) |
| the lane C step (S1 cell + the new S2 cell) | 3 / 3, in no workflow | 9 tests, 9 pass |
| `h3-clean-init.test.cjs` | 14 / 14 | 14 / 14 |
| `rebuild/slice/pwa/test/pwa.test.cjs` | 38 / 38 | 38 / 38 |
| the four measure page-stack suites | 21 / 21 | 21 tests, 20 pass, 1 fail (by design) |
| `rebuild/m3/w7-preview/today/build.mjs` | PASS | PASS, exit 0 |
| `rebuild/slice/pwa/build-pwa.mjs` | PASS | PASS, exit 0 |

Suites that execute a file this branch moves: the today thirteen (all of them read
`today-app.cjs`, `today-model.cjs` or `design.cjs`), the measure four (they read the S4 seal
list), and the two lane C cells. All are in the table.

Added U+2013 and U+2014 across the whole branch: ZERO, measured by walking every added line
of `git diff 9e1ece8` (336 added lines).

`git diff --numstat 9e1ece8..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md` is
EMPTY.

## 5. The reds that are BY DESIGN, and the one that is stale

Listed, not edited. Every one is a byte pin over a file this branch moves on purpose, and
S9 is the package that re-pins them.

1. `rebuild/m3/w7-preview/today/test/setup.test.mjs` - "re-pin - every file the B-NTC
   package pins is untouched by A4b, on disk". It names exactly
   `.github/workflows/rebuild.yml`, `test/adapter.test.mjs` and `test/view.test.mjs`, each
   with its on-disk and pinned hash, and says "no package on this branch declares it".
   That is precisely what the S9 tooling round declares. This is the today suite's one red.
2. `rebuild/m3/w7-preview/measure/test/boundary.test.mjs` - "P-MEASURE (g) - no S4-sealed
   file drifts except where a declaring spec says so". It names the same three plus
   `today-app.cjs`. The measure suite's one red.
3. `rebuild/m4/spec/b-ntc-successors.test.cjs` is 2 / 6 here. It is 2 / 6 AT THE TIP TOO,
   with the same four failing names (measured on a detached checkout of `9e1ece8` in this
   worktree, then returned to the branch): it is STALE-RED, not caused here. One of its four
   names is `.github/workflows/rebuild.yml`, which this branch does move; the other three
   (`engine-runtime.cjs`, `native-trend-context.cjs`, the whole-preflight cell) are files
   this branch never touches.

## 6. The sentence, for every marching-order shape the engine can produce

Each row is what the athlete reads in the slot under "Your plan for today", after
`plainCopy` (which is why the engine's em dashes appear as colons). BEFORE is what the slot
showed at the tip; AFTER is what it shows here. No engine word is added, changed or dropped
in any row; the comma and the colon are the only characters this lane contributes.

| shape | BEFORE (the tip) | AFTER (this branch) |
|---|---|---|
| `night`, the owner's own imported shape | bed, wake, and how long you took to drop off: the body-composition read leans on this harder than anything else you enter | **Before coffee, log last night:** bed, wake, and how long you took to drop off: the body-composition read leans on this harder than anything else you enter |
| `weight`, the synthetic fixture | one number, fasted: the trend absorbs the noise so a single morning never moves a decision | **When you wake, log the scale:** one number, fasted: the trend absorbs the noise so a single morning never moves a decision |
| `day` | calories, protein, steps: three numbers, then it is done | **Before bed tonight, close the day:** calories, protein, steps: three numbers, then it is done |
| `yesterday` | same numbers, honest timestamp: the ledger marks it logged-late, which is a fact rather than a fault | **Right now, yesterday never closed:** same numbers, honest timestamp: the ledger marks it logged-late, which is a fact rather than a fault |
| nothing owed (`owed: false`) | Nothing to fix: hold the line | **If it's a meal, protein first:** Nothing to fix: hold the line |
| no marching order at all (`{}`, the pending-adoption gate) | the status face's own sentence | unchanged: the composer returns null and the slot falls back exactly as before |

The `owed: false` row's reason varies with the state (the one fix's title, the foresight
sentence, or "Hold the line ..."); the cue and the action are the fixed if-then, so the
shape of the sentence is the same whichever of the three the engine writes.

## 7. One environment repair, which moved no repository byte

The worktree's three `node_modules` junctions pointed into `%TEMP%\earned-realshape`, which
no longer exists, so `jsdom`, `fake-indexeddb` and `esbuild` resolved nowhere and the today
suite reported 89 tests with 21 failures before a line was changed. The junctions were
re-pointed (root at the main clone's `node_modules`, the W5 and W6 ones at `earned-adm`'s),
after which the tip measured 661 / 661. Nothing was installed and no package was modified.
Worth telling whoever cuts the next worktree.

## 8. Open questions

1. TWO COLONS. The composition joins with a colon, which is the diagnosis of record's own
   sketch, and the engine's own aside inside the why is already rendered as a colon by
   `plainCopy` (DECISIONS:114). So every sentence in section 6 carries two. It is whole and
   it is true, but it is not elegant. The alternative, which I did NOT take because it puts
   a word of this lane's own into engine copy, is to end the cue with a full stop and raise
   the why's first letter: "Before coffee, log last night. Bed, wake, and how long you took
   to drop off: the body-composition read leans on this harder than anything else you
   enter." One character changed, one sentence became two. The owner's call if he wants it.
2. THE ENGINE'S OWN RUN-ON, not this lane's to fix. `nowFocus`'s weight rung appends a
   second sentence to its why with no full stop before it ("... never moves a decision First
   read after a gap: it carries N days of information ..."), `rebuild/engine/today.cjs:216`.
   The composition carries it through faithfully. It is an engine copy defect, it is only
   reachable after a two-day gap, and lane B's engine window owns it.
3. THE NIGHT RUNG ITSELF. The diagnosis's "second, cheaper half" still stands and is still
   not lane C's: `nowFocus` orders the owed list night first, so a man whose imported history
   carries no sleep at all is asked for last night before he is asked for the scale. The
   sentence is now whole either way, but the ORDER is an engine question.
4. `browser-check.mjs` is a consumer of the widened vocabulary and is stale-red at the tip
   for an unrelated reason (a clean profile boots the setup wizard, DECISIONS:534). So the
   two longest new titles (77 and 69 characters, both template literals with placeholders)
   have NOT been through the fluid-floor layout check in a real browser. Widening the
   vocabulary is what makes that check possible; running it is not something this lane could
   do honestly today.
5. The S9 tooling round must declare four pinned paths for this lane: `today-app.cjs`,
   `test/view.test.mjs`, `test/adapter.test.mjs` and `.github/workflows/rebuild.yml`. The
   two new lane C files and the report are unpinned and need no declaration; the licence is
   the tooling round's to mint, not this lane's.

## 9. The fix round: R1 findings, fixed or disputed

Review R1 (`rebuild/lanes/c/S9-TODAY-CARRY-REVIEW-R1.md`, commit `fc812f1`) returned ACCEPT
WITH NOTES with BLOCKING: none, and re-measured every number in sections 1 to 6 above
independently. This section is the author fix round on it. The first author's work was not
discarded: one cell assertion is replaced, the report is corrected where R1 caught it loose,
and every remaining note is disputed with the evidence that says why nothing moves here.
Everything measured below was measured by me on this tree, Windows, node from the codex
runtime, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`.

| R1 note | verdict | what happened |
|---|---|---|
| N1, four pinned paths not three | FIXED | already carried in section 2 and open question 5; restated below as a demand on the S9 tooling round |
| N2, two colons in every sentence | DISPUTED here, carried to the owner | the join is the adopted record's own; the alternative is engine copy, which this lane does not own |
| N3, no terminal full stop | DISPUTED | pre-existing at the tip; adding one would invent punctuation on an engine string. Asked with N2 |
| N4, the slot got longer and nothing measures it | DISPUTED here, carried to C-UI-0 | no approved figure exists to assert against; my own measurements below |
| N5, the widened vocabulary is worth it and half is source text | FIXED | the `design.cjs` comment already says so; nothing to change |
| N6, U+2192 and U+2212 reach the athlete unexamined | DISPUTED | engine copy, lane B's window; my count differs from R1's and is below |
| N7, one assertion in the new cell cannot fail | FIXED | replaced with two falsifiable ones, one of them red against the unchanged `design.cjs` |
| N8, the added-line count is loose | FIXED | recounted below, across the whole branch |
| N9, the stale red is stale | FIXED | R1 re-measured it on two detached worktrees and agrees with section 5.3; nothing to change |
| N10, the worktree junctions | FIXED | already section 7; R1 hit the same thing and confirms it |
| could not measure 1, Linux | carried | unchanged: this branch has never run on ubuntu. The new CI step is what makes it run there |
| could not measure 2, a real browser | carried | same item as N4 and open question 4 |
| could not measure 3, a rest day | FIXED | recorded below as unreached rather than covered |

### N7, FIXED, and it is red against the unchanged product

What stood in `plan-sentence.test.mjs` was `assert.equal(title, title.toUpperCase())` over
every vocabulary entry. `headlineVocabulary` upper-cases each entry as it collects it, so
that assertion was satisfied by construction and could not fail: the exact flaw R1's own M2
raised against the S1 cell, in the cell written to answer it. R1 is right. It is gone.

Two falsifiable assertions replace it.

1. THE RENDERED TITLE, which is what N7 asked for. A vocabulary entry's LITERAL RUNS are
   what it contributes to a headline whatever its `${...}` placeholders resolve to. The cell
   now asks whether any entry's literal runs appear, in order, inside the headline the owner
   actually read (`SIDE DELT: EARNED VOLUME: 10`, a U+2192, `12 WEEKLY SETS`, which is what
   `plainCopy` leaves of his card title: see N6 on that arrow).
   RED-FIRST, measured: the tip's collector finds 15 entries and NOT ONE of them covers that
   headline; this branch's finds 30 and exactly one does (the `propose()` second-argument
   template). So this assertion fails against the unchanged `design.cjs` and passes here,
   which is the red the widening deserved and did not have.
2. THE PRODUCT'S OWN HEADLINE, for every shape the cell walks plus the imported shape with a
   decision open: the string `today-app.cjs` puts in the `instruction` slot is one the
   approved layout is measured against. Measured: all six render `CLOSE THE BOOKS FIRST` or
   `NOTHING NEEDS YOU`, both in the vocabulary. This one is NOT red against the tip's
   narrower vocabulary (both strings are quoted `title:` literals the old collector saw), so
   I do not claim it as red-first evidence; it is falsified by a different mutation, the one
   R1 ran: neuter `planMove` to `return nowModel.move` and the imported-plus-proposal row
   renders the card title, which no entry carries, and the cell goes red.

The vocabulary walk is unchanged in count: the lane C step is still 9 tests, 9 pass, exit 0.

### N2 and N3, DISPUTED here, and this is the one question for the owner

The two-colon sentence and the missing full stop are the same question, and it is his.
R1 section 5 re-derived what section 6 above reports: the join is character for character
the sketch in the adopted diagnosis of record, which DECISIONS:534 adopted and whose ruling
(b) sent S2 to this lane. Taking R1's preferred version means ending the cue with a full
stop and RAISING THE FIRST LETTER OF AN ENGINE STRING, which is this lane writing engine
copy. That is the line the ticket draws and I will not cross it on a reviewer's taste or my
own. Both versions, for the owner, on his own night rung:

- as it stands: `Before coffee, log last night: bed, wake, and how long you took to drop
  off: the body-composition read leans on this harder than anything else you enter`
- R1's version: `Before coffee, log last night. Bed, wake, and how long you took to drop
  off: the body-composition read leans on this harder than anything else you enter.`

The second also answers N3, since it ends stopped. Neither is wrong; the first is the
record's and is what this branch ships unless he says otherwise. One line from him settles
it, and the change is one line of `today-model.cjs` if he wants the second.

### N4, DISPUTED as a fix here, with my own numbers

The slot does get longer, and R1 is right that nothing measures it. Measured by me, the
`instruction-why` slot after `plainCopy`, BEFORE (the clause alone, the tip) and AFTER:

| shape | before | after | growth |
|---|---|---|---|
| night | 121 | 152 | +31 |
| weight | 90 | 120 | +30 |
| day | 56 | 91 | +35 |
| yesterday | 100 | 135 | +35 |
| nothing owed | 29 | 60 | +31 |

(R1's three figures are each one character above mine; the difference is a trailing
character in how the clause was taken, and it changes nothing.) The growth is the cue plus
the action plus three characters of punctuation, so it is bounded by the engine's own
`ifText` and `thenText`, which are short fixed strings.

I will not add a character bound to a cell. There is no approved figure to assert against,
so any number I picked would be a layout rule this lane invented, and the ticket's own law
says a gate is not something an author mints to feel covered. The honest home is the
fluid-floor check on a real frame (`browser-check.mjs`), which is stale-red at the tip for
an unrelated reason (DECISIONS:534). Carried to the C-UI-0 gates round, beside the widened
headline vocabulary, and stated in open question 4 already.

### N6, DISPUTED, and my count differs from R1's

Measured by me over the 30 vocabulary entries this branch collects: TWO carry U+2192 and
ONE carries U+2212 (a true minus, inside `VOLUME ${DIR > 0 ? "+1" : "-1"}`, written there
with the minus sign, not a hyphen). R1 says three arrows; the third is in a title the
collector does not admit, so the number that matters for the gates is two. `plainCopy`
normalises neither character, which R1 has right and which the copy rule in both lane C
cells does not check, because DECISIONS:114 names U+2013 and U+2014 and not these.

Nothing moves here. The characters are written in `rebuild/engine`, which this lane may not
touch, and a cell asserting their absence would be red on the engine's own bytes: a red I
could not honestly turn green, which is a finding and not a fix. Reported to lane B's engine
window as open question 6.

### N1, FIXED by restating it as a demand, not a hope

THE S9 TOOLING ROUND MUST DECLARE FOUR PINNED PATHS FOR THIS LANE, not the three the ticket
names: `rebuild/m3/w7-preview/today/today-app.cjs`,
`rebuild/m3/w7-preview/today/test/view.test.mjs`,
`rebuild/m3/w7-preview/today/test/adapter.test.mjs` and `.github/workflows/rebuild.yml`.
The two by-design reds in section 5 name exactly those four between them and nothing else,
so the declaration and the reds can be checked against each other before the licence is
minted. No other pinned file moves on this branch; `today-model.cjs`, `design.cjs`, both
lane C cells and this report are unpinned, re-checked against
`rebuild/m4/spec/acceptance-s8-real-shape.json` again at the head of this fix round.

### A rest day, recorded as unreached

R1 asked for it and it is worth writing down: there is no rest day in the synthetic week
(every one of the seven days is an UPPER or a LOWER session), and `marchingOrder` does not
branch on the session at all, so a rest day produces one of the same five shapes in section
6. It is unreached by these cells, not covered by them, and it is not a sixth shape.

### N8, FIXED: the count, recounted

Across the whole branch, `git diff 9e1ece8` measured at the head of this fix round:
ADDED LINES 935, of which 557 are the two lane C reports (330 this one, 227 the review) and
378 are product, cell and workflow lines. U+2013 and U+2014 in those added lines: ZERO, every
line walked. The report's section 4 said "336 added lines", which was the product and cell
lines of the first two commits and not the branch; R1 is right that the wording was loose
and the conclusion unaffected.

## 10. The bar, re-measured after the fix round

| suite | result |
|---|---|
| the CI today step, 13 today cells + 4 measure cells | 682 tests, 680 pass, 2 fail (the two byte pins of section 5, by design) |
| the lane C CI step, the exact command line in `rebuild.yml` | 9 tests, 9 pass, exit 0 |
| `rebuild/slice/pwa/test/pwa.test.cjs` | 38 tests, 38 pass, exit 0 |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | 14 tests, 14 pass, exit 0 |
| `rebuild/m3/w7-preview/today/build.mjs` | exit 0 |
| `rebuild/slice/pwa/build-pwa.mjs` | exit 0 |

The two reds name the same four paths as before this round, unchanged: the fix round moved
one unpinned cell and this report and no pinned byte. `git diff --numstat 9e1ece8..HEAD --
rebuild/engine rebuild/coach rebuild/DECISIONS.md` is EMPTY, re-measured at the head of this
round. No re-run was needed anywhere: nothing flaked in this round.
