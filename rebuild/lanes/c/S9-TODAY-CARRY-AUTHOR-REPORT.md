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
