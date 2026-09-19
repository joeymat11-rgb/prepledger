# S9-TODAY-CARRY, independent review R2 (the fix round on R1)

Reviewer: cowork (Earned lane hand), told to disagree. Branch `rebuild/c-s9-today-carry`,
head `6feb83d7078037a462d135e45e5c5cfbea26e37c`, cut from the chain tip `9e1ece8`.

## VERDICT: ACCEPT WITH NOTES. BLOCKING: none.

Method, in the order I did it. I read `git diff 9e1ece8..HEAD` and the engine's own
`marchingOrder` producer (`rebuild/engine/today.cjs:486-517`, read only) and formed a view
BEFORE opening either report. Then R1, then the author's fix round (section 9 of the author
report). I re-ran the whole bar on this PC. I proved red first in a detached scratch worktree
of my own at commit 1 - and, separately, proved it for the assertion the FIX ROUND added,
which commit 1 does not carry. I ran two mutation probes in a second detached worktree. I ran
my own probe matrix as scratch scripts under `%TEMP%`; none is committed. Both scratch
worktrees were removed with `git worktree remove`. Environment for every run:
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, node from the codex runtime, Windows.

Nothing below is taken from either report on its word. Where my number differs from R1's or
the author's, I say so and give mine.

## 1. R1's findings, one by one

| R1 note | my ruling | evidence |
|---|---|---|
| N1, four pinned paths, not three | FIXED, and it still needs the PM | my own pin script over `acceptance-s8-real-shape.json` returns exactly four PINNED paths on this branch and five unpinned; the two by-design reds name the same four and nothing else |
| N2, two colons | DISPUTE UPHELD, and the fork is live | the join is the adopted record's own; changing it is this lane writing engine copy. It is the owner's line, not a reviewer's |
| N3, no terminal full stop | DISPUTE UPHELD | measured: no shape ends stopped, and none did at the tip either. Same owner question as N2 |
| N4, the slot got longer and nothing measures it | DISPUTE UPHELD as a fix here | re-measured: a 400-character clause composes to 431 characters with no complaint. There is no approved figure to assert against, so a bound here would be a layout rule this lane minted |
| N5, the widened vocabulary is worth it | FIXED, nothing to change | 30 entries here, 15 at the tip, 11 carrying `${...}`, longest 77 characters. All mine |
| N6, U+2192 and U+2212 reach the athlete | DISPUTE UPHELD on the count, STILL OPEN as an engine finding | my own count over the 30 collected entries: TWO arrows, ONE minus. The author is right and R1's third arrow is in a title the collector does not admit. Nothing can move here; it is engine copy |
| N7, an assertion that cannot fail | FIXED, and genuinely red first | see section 3 |
| N8, the added-line count | FIXED | my own count: 935 added, 11 removed, ZERO carrying U+2013 or U+2014 |
| N9, the stale red | FIXED, re-measured by me on both trees | see section 2 |
| N10, the worktree junctions | FIXED as a note | both of my scratch worktrees needed the same three junctions. Nothing was installed |
| could not measure 1, Linux | STILL OPEN | I did not run this branch on ubuntu either. Structural check only, section 5 |
| could not measure 2, a real browser | STILL OPEN | unchanged, and it is the same item as N4 |
| could not measure 3, a rest day | FIXED as a record | I read the engine's `marchingOrder` myself: it reads `nowFocus`, the two targets, `theOneFix` and `safeCrossing`, and branches on the session nowhere. A rest day is not a sixth shape |

## 2. The bar, re-measured by me on this tree

| suite | my measurement | the report's claim | agree |
|---|---|---|---|
| the CI today step, 13 today cells + 4 measure cells, the exact argv in `rebuild.yml` | 682 tests, 680 pass, 2 fail, exit 1 | 682 / 680 / 2 | yes |
| the new lane C CI step, the exact command line | 9 tests, 9 pass, 0 fail, exit 0 | 9 / 9 | yes |
| `rebuild/slice/pwa/test/pwa.test.cjs` | 38 / 38, exit 0 | 38 / 38 | yes |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | 14 / 14, exit 0 | 14 / 14 | yes |
| `rebuild/m3/w7-preview/today/build.mjs` | exit 0 | exit 0 | yes |
| `rebuild/slice/pwa/build-pwa.mjs` | exit 0 | exit 0 | yes |

No re-run was needed. Nothing flaked in any run of mine, including the today-17 measure
journey the standing note warns about.

THE TWO REDS ARE THE TWO BYTE PINS, and between them they name exactly four paths:

- `today/test/setup.test.mjs`, "re-pin": `.github/workflows/rebuild.yml`,
  `today/test/adapter.test.mjs`, `today/test/view.test.mjs`, each with its on-disk and its
  pinned hash.
- `measure/test/boundary.test.mjs`, "P-MEASURE (g)": the same three plus `today-app.cjs`.

I read the failure bodies myself. Neither names `today-model.cjs` or `design.cjs`, which is
the independent confirmation of the pin table below. The reds are listed, never edited; S9
is the package that re-pins them.

MY OWN PIN CHECK, a small script walking `rebuild/m4/spec/acceptance-s8-real-shape.json`:

| path | pinned? | where |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | PINNED | `product` |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | PINNED | `product`, `executionPins`, `children/0/argv` |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | PINNED | `product`, `executionPins`, `children/0/argv` |
| `.github/workflows/rebuild.yml` | PINNED | `product` |
| `today-model.cjs`, `design.cjs`, both lane C cells, both reports, this file | unpinned | zero hits each |

Nine files move on the branch plus this review. None is under `rebuild/lanes/b/tooling`,
none is a `packages/*.json`, a receipt or an acceptance artifact. No licence is minted here.
`git diff --numstat 9e1ece8..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md` is
EMPTY, re-measured by me at this head.

THE STALE RED, re-measured by me on BOTH trees rather than taken from R1:
`rebuild/m4/spec/b-ntc-successors.test.cjs` is 6 tests, 2 pass, 4 fail on this branch AND at
`9e1ece8` in a detached worktree, with the same four failing names in the same order. Stale
at the tip, not caused here.

## 3. Red first, proved twice: for commit 1, and for the FIX ROUND's own assertion

R1 proved red first for commit 1 (`1ddaf59`). I repeated it, and then did the thing R1 could
not have done: the fix round REPLACED an assertion in `plan-sentence.test.mjs` after R1 ran,
so the cell that ships is not the cell R1 proved red. A fix round that rewrites a cell owes
its own red.

Scratch worktree of my own, detached at `1ddaf59`, three `node_modules` junctions, removed
afterwards. First I checked the premise rather than assuming it:
`git diff --numstat 9e1ece8 -- today-app.cjs today-model.cjs design.cjs` at that commit is
EMPTY, so the product really is the tip's.

| cell, at commit 1 against the UNCHANGED product | my result |
|---|---|
| `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs` (commit 1's version) | 5 tests, 0 pass, 5 fail |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | 4 tests, 3 pass, 1 fail |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | 23 tests, 21 pass, 2 fail |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | 20 tests, 20 pass, 0 fail (the honest exception) |
| **the FIX ROUND's `plan-sentence.test.mjs` (`6feb83d`), same unchanged product** | **5 tests, 0 pass, 5 fail** |

The red that matters reads `actual: undefined`, `expected: 'Before coffee, log last night:
bed, wake, and how long you took to drop off: the body-composition read leans on this harder
than anything else you enter'`. The `view.test.mjs` reds are the weight shape at the fixture:
`actual: 'one number, fasted: ...'`, `expected: 'When you wake, log the scale: one number,
fasted: ...'`. That is the defect, written down and then removed.

N7's REPLACEMENT IS RED AGAINST THE UNCHANGED `design.cjs`, measured directly and not
inferred from the suite. I ran the cell's own `covers` logic over the vocabulary on both
trees:

| tree | entries | entries whose literal runs cover the headline the owner read |
|---|---|---|
| `9e1ece8` (unchanged `design.cjs`) | 15 | 0 |
| this branch | 30 | 1, and it is the `propose()` second-argument template |

So the assertion that replaced the tautology fails on the tip's collector and passes on this
one. The author's claim is exact. The second replacement assertion (the product's own
headline is inside the measured vocabulary) is NOT red at the tip, and the author says so
himself rather than claiming it; my M2 mutation below is what falsifies that one.

## 4. Two mutation probes of my own

Second detached worktree at `HEAD`, one file edited in place, reverted with
`git checkout --` between runs, worktree removed afterwards. Nothing committed.

M1, THE JOIN. I changed `cue + ", " + action + ": " + why` to `cue + " and " + action + "
and " + why` in `today-model.cjs` and ran `view.test.mjs` with `plan-sentence.test.mjs`:
28 tests, 24 pass, 4 FAIL - both new `view.test.mjs` assertions, the S2 golden, and the
proposals-bearing cell. So the exact join is pinned in three places and cannot drift
silently.

What M1 also showed, and it is worth recording: the SHAPE WALK ("every marching-order shape
composes one whole sentence") stayed GREEN under M1. It asserts `startsWith(ifText)`,
`includes(thenText)` and `endsWith(why)`, which any join satisfies. That is deliberate and
right for a walk over five shapes, but it means the join is guarded by the golden and by
`view.test.mjs` alone. See note R2-N3.

M2, THE HOTFIX ITSELF. I neutered `planMove` to `if (true) return nowModel.move;` and ran
`adapter.test.mjs`, the S1 cell and the S2 cell: 29 tests, 23 pass, 6 FAIL. Both
`assertHeadlineLaw` call sites went red (`the instruction changes because the ENGINE
changed` at `:158`, `every number in the view DTO is reproduced independently from the
engine` at `:291`), both S1 cells went red, and so did the two S2 cells that reach the
headline. This is my own independent confirmation of R1 section 3: the rewritten
`adapter.test.mjs` lines are not a tautology and not the implementation restated.

## 5. Does anything guard LESS than before? No, and here is how I checked

`adapter.test.mjs`. The two lines removed asserted one equality. `assertHeadlineLaw` asserts
that same equality verbatim, and adds four things: that the state really carries zero open
proposals (so the identity half is asserted rather than assumed), that the reference engine
STILL puts a card title on the move when one is open (so the law fails loudly if the engine
stops doing it), that the projection's headline is the engine's own answer for the same
state with proposals set aside, and that `decisionsN` is still the real state's. Strictly
more, and M2 proves it bites. The rewrite states the true law and weakens nothing.

`view.test.mjs`. Two assertions changed. Each one now pins MORE than the line it replaced
(the whole sentence, its join, that it starts with a capital, and that it is not the clause
alone). Two assertion lines and a comment moved in that file, nothing else; I read the whole
diff of it.

`rebuild.yml`. No YAML parser is installed and installing one is forbidden, so I checked it
structurally and then executed it. The file is LF only with no tab anywhere. The new step is
at line 305 of the `public-gates` job, whose `runs-on` is `${{ matrix.os }}` with
`os: [ubuntu-latest, windows-latest]`, so the lane cells run on BOTH runners. Its `- name:`
sits at six spaces and its `run:` at eight, identical to all 24 sibling steps; the run line
names two paths with forward slashes and no glob, so both shells agree. The nine added lines
carry no U+2013 and no U+2014. I then ran that exact command line: 9 / 9, exit 0.

`today-app.cjs`. The binding change is ONE line, `view.marchingOrder.why` to
`view.orderSentence`. The other four lines are a comment that described the old behaviour
and would have been false if left. Minimal, and I agree with R1 that a stale comment in a
sealed file would be the worse outcome. The hunk sits at `:862-873`, which C-UI-1 also
edits: the integrator should land these two in a known order, not in parallel.

## 6. My own probes

Scratch scripts under `%TEMP%`, nothing committed. Every string below is what the athlete
reads, after `plainCopy`.

| probe | my result |
|---|---|
| each part missing in turn, plus whitespace-only, a non-string, `{}`, `null`, `undefined` | `null` in all ten cases. Never a half sentence |
| a REST day | not a sixth shape, and I checked it in the engine rather than in a fixture: `marchingOrder` reads `nowFocus`, the two targets, `theOneFix` and `safeCrossing`, and branches on the session nowhere. Unreached, not covered |
| a fresh-start phone with no import (`setPendingAdoption(true)`) | `marchingOrder` is `{}`, `orderSentence` is `null`, the slot shows "Still learning your baseline: keep logging and the read sharpens." A whole engine sentence. The composer cannot put the fragment back by another door |
| an imported state with TWO open proposals | headline "CLOSE THE BOOKS FIRST" (in the vocabulary), `decisionsN` 2, sentence whole and identical to the one-proposal case. S2 does not depend on the proposal count |
| a very long clause (400 characters) | composes to 431 characters, the whole `why` carried, no truncation, no complaint. Agrees with R1 N4 |
| a clause that already ends in a full stop | "Before coffee, log last night: It is done." Correct |
| copy rules over every shape | no U+2013 and no U+2014 survives `plainCopy` in any of the five; no U+2192 and no U+2212 reaches this slot (they are a HEADLINE problem, not a sentence one); every sentence starts with a capital; no readiness word appears; none ends stopped |

THE ONE THING BOTH REPORTS GET WRONG, and it took a probe to see it. The author's section 6
and R1 section 4 both present a five-row BEFORE/AFTER table of "what the athlete reads in
the slot". Measured end to end through the real binding, only TWO of those five rows reach
the slot at all:

| shape | `hasReadToday` | which branch `today-app.cjs:868` takes | what the slot really shows |
|---|---|---|---|
| night (the owner's own imported shape) | false | `view.orderSentence` | the whole composed sentence, 152 characters |
| weight (the synthetic fixture) | false | `view.orderSentence` | the whole composed sentence, 120 characters |
| day | true | `view.statusFace.cause` | "The cut is working: this week's drop is real now, not noise." |
| yesterday | true | `view.statusFace.cause` | the same status sentence |
| nothing owed | true | `view.statusFace.cause` | the same status sentence |

The slot is guarded by `const owed = !view.hasReadToday`, and in the states the cell builds
for `day`, `yesterday` and `nothing owed` a weigh-in has already been recorded, so the
composed sentence is never painted. Three of the five rows in each report therefore describe
a string the screen does not show, in the BEFORE column as much as the AFTER one: at the tip
those states did not show the bare clause either. This does not change the verdict and it
does not change one byte of the fix. It changes what the PM is being handed: the defect and
its cure are demonstrated on exactly the two shapes that can reach this slot, one of which
is the owner's own, and the other three rows are unit coverage of the composer. See R2-N1.

## 7. Did the fix round break anything?

No. The fix round (`6feb83d`) moves exactly two files: `plan-sentence.test.mjs` and the
author report. I checked it four ways. The diff of the cell is the one replaced assertion
plus two helpers and their comment, and nothing else. No pinned byte moved in that round, so
the two by-design reds name the same four paths as before it (I read both failure bodies).
The lane C step is still 9 tests, 9 pass, exit 0, so the round neither added nor lost a test.
And the replaced assertion is red against the unchanged product where the one it replaced
could not fail at all (section 3). The bar in section 2 is measured at this head, after the
round.

## NOTES

R2-N1. THE FIVE-ROW TABLE IS A THREE-ROW OVERSTATEMENT, in both reports. Measured in section
6. The composer is correct for all five shapes and the cells that walk them are honest unit
coverage; what is not established is that three of those shapes can reach this slot at all.
No cell states the reachability law (`the composed sentence is what the slot shows exactly
when no weigh-in is recorded today`), and neither report notices that the slot has that
guard. For the PM: the S2 evidence is strong where it matters (the owner's own night rung,
and the weight rung the fixture renders) and thinner than it reads elsewhere. Not blocking,
because nothing in the product is wrong and nothing would be improved by editing a pinned
file again to say it.

R2-N2. THE ACTION WORD NOW APPEARS TWICE ON THE SCREEN. `today-app.cjs` binds
`marchingOrder.thenText` into the `primary-label` button, and `view.test.mjs:125` pins that.
The slot underneath now reads "<cue>, <thenText>: <why>". Measured: the action string is
repeated inside the slot in all five shapes. On the owner's own rung the button says "log
last night" and the body says "Before coffee, log last night: bed, wake, ...". This is new,
it arrived with this change, and neither report mentions it. It is the price of composing in
the engine's own order and it is not wrong; it is the third thing to put in front of the
owner in the same breath as N2 and N3, because all three are the same question: is this the
sentence he wants under "Your plan for today".

R2-N3. THE JOIN IS GUARDED IN THE UNPINNED CELL AND IN THE PINNED SUITE, BUT NOT IN THE
WALK. My M1 mutation shows the shape walk tolerates any join. The golden in
`plan-sentence.test.mjs` is the only assertion that pins the sentence without composing it
from the same parts the product uses, and it is the strongest cell on this branch. It lives
outside the seal, in a directory that had no CI home until this ticket gave it one. That is
the right outcome and worth saying plainly, because it means the lane C step in
`rebuild.yml` is now load-bearing: if that step is ever dropped, the only non-restating
guard on this sentence goes with it.

R2-N4. `view.test.mjs` COMPOSES ITS EXPECTED STRING THE WAY THE PRODUCT DOES. Both new
assertions build `order.ifText + ", " + order.thenText + ": " + order.why` in the test. They
pin the join characters literally, so they are not tautologies and M1 kills them; but they
are the closest thing on this branch to the flaw R1's own M2 named, inside the file the seal
pins. The golden is what carries the honest weight. No change asked for: a literal sentence
in a pinned test file would have to be re-pinned every time the engine changes a word.

R2-N5. A SMALL FALLBACK CHANGE NOTHING NAMES. At the tip the slot printed `marchingOrder.why`
whenever the why was non-empty, whatever else the order carried. Here it prints nothing
unless all three parts are present, so an order with a why but an empty `thenText` now falls
through to `statusFace.cause`. That is strictly better (a whole sentence instead of a
fragment) and I could not build such an order out of the engine: `ifText` always resolves
through `cueBy[kind] || "Next"` and `thenText` comes from the rung's own `t`. Recorded
because it is a behaviour change in a pinned file that no cell and no report states.

R2-N6. THE STOP RULE, and why I think the author was right not to invoke it. The ticket says
to stop if the sentence is a taste call with more than one reasonable answer. R1 offered a
second reasonable answer (a full stop and a raised letter) and the author declined it. I
looked hard at this, because it is the one place this lane could have been overruled. The
join `ifText + ", " + thenText + ": " + why` is character for character the sketch in the
adopted diagnosis of record, and DECISIONS:534 adopted that document and ruled (b) that S2
rides this child. The fork was ruled before the ticket was written, so taking it back to the
owner would have re-opened a ruling rather than escaped a taste call. What IS still live is
the finish: two colons, no terminal stop, and now the repeated action word (R2-N2). That is
one question with three parts and one line from the owner settles it. It is a copy question,
not a correctness one, and I would not hold the branch for it.

R2-N7. FOR LANE B'S ENGINE WINDOW, unchanged from R1 except in the count. Two of the thirty
collected titles carry U+2192 and one carries U+2212, and `plainCopy` normalises neither, so
those characters reach the athlete in a HEADLINE unexamined. My count is the author's, not
R1's. Pre-existing, visible only because this lane widened the vocabulary, and unfixable
from here: the characters are written in `rebuild/engine`.

R2-N8. THE PM STILL OWES THIS LANE FOUR DECLARED PATHS, not three. Verified by my own pin
script and by both by-design reds, which name exactly `today-app.cjs`, `test/view.test.mjs`,
`test/adapter.test.mjs` and `.github/workflows/rebuild.yml` between them. The declaration and
the reds can be checked against each other before the S9 licence is minted. `view.test.mjs`
is the one the ticket did not name, the author flagged it himself and asked rather than
assumed, and the adopted diagnosis says in terms that it had to move.

## What I could not measure, stated rather than claimed

1. LINUX. Everything above ran on this Windows PC. The new CI step is shell-agnostic by
   construction and I checked it structurally and confirmed it sits in the two-OS matrix
   job, but I did not execute it on ubuntu. Nothing on this branch has ever run there.
2. A REAL BROWSER. `browser-check.mjs` is stale-red at the tip (DECISIONS:534), so neither
   the widened headline vocabulary nor the longer `instruction-why` slot has been through
   the fluid-floor layout check on a real frame. This is R1 N4 and the author's open
   question 4, and it is the single largest thing nobody has measured about this change.
3. THE SLOT'S REACHABILITY for the `day`, `yesterday` and `nothing owed` shapes. I proved
   they do not reach it in the states these cells build. I did not prove they can never
   reach it, and no cell says either way. See R2-N1.

Nothing in this review was taken from the author report or from R1 without re-measuring it.
Every number here is mine. Where they disagree with each other (the arrow count) I measured
it and said whose is right; where they agree with each other and both are wrong (the
five-row table) I said so too.
