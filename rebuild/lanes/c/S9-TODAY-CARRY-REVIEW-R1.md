# S9-TODAY-CARRY, independent review R1

Reviewer: cowork (Earned lane hand), told to disagree. Branch `rebuild/c-s9-today-carry`,
author head `3b00900f9625e2ba0cf7b4fe772cfb873f247e53`, cut from the chain tip `9e1ece8`.

## VERDICT: ACCEPT WITH NOTES. BLOCKING: none.

Method: I read `git diff 9e1ece8..HEAD` and formed a view before opening the author report.
I re-ran every cell and the whole bar myself on this PC, proved red-first in a detached
scratch worktree of my own, ran a mutation probe the author did not run, and ran nine probes
of my own as scratch scripts under `%TEMP%` (none committed). Environment for every run:
`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, node from the codex runtime, Windows.
This branch was not run on Linux by me; see "What I could not measure".

## 1. The bar, re-measured by me on this tree

| suite | my measurement | author's claim | agree |
|---|---|---|---|
| the CI today step (13 today cells + 4 measure cells) | 682 tests, 680 pass, 2 fail | 661 + 21 with 1 fail each | yes |
| the new lane C CI step (both cells, the exact CI command line) | 9 tests, 9 pass, exit 0 | 9 / 9 | yes |
| `rebuild/slice/pwa/test/pwa.test.cjs` | 38 / 38, exit 0 | 38 / 38 | yes |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | 14 / 14, exit 0 | 14 / 14 | yes |
| `rebuild/m3/w7-preview/today/build.mjs` | exit 0 | PASS | yes |
| `rebuild/slice/pwa/build-pwa.mjs` | exit 0 | PASS | yes |

The two reds are exactly the two byte pins the report names, and they name exactly four
paths between them, no more:

- `today/test/setup.test.mjs` "re-pin": `.github/workflows/rebuild.yml`,
  `today/test/adapter.test.mjs`, `today/test/view.test.mjs`, each with its on-disk and
  pinned hash.
- `measure/test/boundary.test.mjs` "P-MEASURE (g)": the same three plus `today-app.cjs`.

Neither red names `today-model.cjs` or `design.cjs`, which independently confirms the pin
table in section 2 of the author report. I re-ran the pin check against
`rebuild/m4/spec/acceptance-s8-real-shape.json` myself and got the author's nine rows
unchanged: PINNED for `rebuild.yml`, `today-app.cjs`, `test/view.test.mjs`,
`test/adapter.test.mjs`; unpinned for `today-model.cjs`, `design.cjs`, both lane C cells and
the report.

`git diff --numstat 9e1ece8..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md` is
EMPTY, re-measured by me. Nine files move in total; none is under `rebuild/lanes/b/tooling`,
none is a `packages/*.json`, a receipt or an acceptance artifact. No licence is minted here.

## 2. Red first: proved by me, not taken from the report

I added a detached worktree of my own at commit 1 (`1ddaf59`, the cells alone, the three
product files still at the tip), junctioned the same `node_modules` the branch worktree uses,
and ran the four suites there. Removed afterwards with `git worktree remove`.

| cell, at commit 1 against the UNCHANGED product | result |
|---|---|
| `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs` | 5 tests, 0 pass, 5 fail |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | 4 tests, 3 pass, 1 fail |
| `rebuild/m3/w7-preview/today/test/view.test.mjs` | 23 tests, 21 pass, 2 fail |
| `rebuild/m3/w7-preview/today/test/adapter.test.mjs` | 20 tests, 20 pass, 0 fail |

The golden's red is the one that matters and it is the right red: `actual: undefined`,
`expected: 'Before coffee, log last night: bed, wake, and how long you took to drop off: the
body-composition read leans on this harder than anything else you enter'`. That is the
owner's own screen, made whole. Every number above matches the author report exactly.

The author's HONEST EXCEPTION is honest: `adapter.test.mjs` is green at commit 1 because the
behaviour it now states landed with P3-TODAY-HOTFIX. I did not accept that on the report's
word. I ran a MUTATION PROBE the author did not: in the scratch worktree I neutered
`planMove` in `today-model.cjs` to `return nowModel.move` unconditionally and re-ran
`adapter.test.mjs`. Result: 20 tests, 18 pass, 2 fail, one at each of the two call sites.
So the new `assertHeadlineLaw` guards real behaviour at both `:158` and `:291`; it is not a
tautology and it is not the implementation restated.

## 3. Does `adapter.test.mjs` guard LESS than before? No.

The two lines it replaces asserted `view.nowModel.move.title === reference.nowModel(state)
.move.title`. The helper asserts that same equality verbatim, and adds three things: that
the state really does carry zero open proposals (so the identity half is asserted rather than
assumed), that the reference engine still puts a card title on the move when one IS open (so
the law fails loudly if the engine stops doing it), and that the projection's headline is the
engine's answer for the same state with proposals set aside, with `decisionsN` still the real
state's. Strictly more. I confirm the rewrite states the true law and weakens nothing.

## 4. My own probes

Scratch scripts under `%TEMP%`, nothing committed. Every sentence below is what the athlete
reads, after `plainCopy`.

| probe | result |
|---|---|
| each part missing in turn (`ifText`, `thenText`, `why`), and whitespace-only, and non-string | `null` in every case; never a half sentence |
| `undefined`, `null`, `{}`, and a partial order object | `null` in every case |
| a REST day | no rest day exists in the synthetic week (all seven days are UPPER or LOWER); `marchingOrder` does not branch on the session at all, so a rest day yields one of the same five shapes. Not a distinct shape. Stated as unreached, not as covered |
| a fresh-start phone with no import (`setPendingAdoption(true)`, the real gate today-app drives) | `marchingOrder` is `{}`, `orderSentence` is `null`, the slot shows "Still learning your baseline: keep logging and the read sharpens." A whole engine sentence, byte-identical to what the tip showed. The composer cannot put the fragment back by another door |
| an imported state with TWO open proposals | headline "CLOSE THE BOOKS FIRST" (an engine move title), `decisionsN` 2, sentence whole and unchanged. S2 does not depend on the proposal count |
| a very long clause (400 characters) | composes to 418 characters, the whole `why` carried, no truncation. See note N4 |
| a clause that already ends in a full stop | "Before coffee, log last night: It is done." Correct |
| copy rules over all five shapes | no U+2013 and no U+2014 survives `plainCopy`; no readiness word appears; every sentence starts with a capital. Two colons in every one, and no terminal full stop in any. See N2 and N3 |
| the real render end to end (jsdom, `design.shellHtml()` + `mountToday`, the imported fixture) | the `instruction-why` slot renders the whole golden sentence and the `instruction` slot renders "CLOSE THE BOOKS FIRST". The fix reaches the glass, not just the model |

I measured the composed sentence for every shape independently of the author's table and got
his table back, word for word, including the `owed: false` row. I also confirmed the defect is
genuinely reachable on the fixture of record: `order.owed` is `true`, `order.kind` is
`"night"`, and `order.why` still begins lower case. The cell is not asserting into thin air.

## 5. The join is the record's, not this lane's taste

I checked the STOP rule before anything else, because a taste call with two reasonable
answers had to come back to the PM. It does not apply. The join
`ifText + ", " + thenText + ": " + why` is character for character the sketch in the adopted
diagnosis of record (`P3-TODAY-COPY-DIAG`, section S2, "Smallest safe fix"), which
DECISIONS:534 adopted and whose ruling (b) sent S2 here. The author took the record's
composition and did not invent a joining word. Two small improvements on the sketch, both in
the right direction: the logic moved out of the pinned `today-app.cjs` into the unpinned
`today-model.cjs`, leaving one changed line in the pinned file where the sketch would have
put eight; and the guard is stricter than the sketch's (`mo && mo.owed && mo.why`), requiring
all three parts, which is what makes the "no half sentence" probe come back clean.

## 6. The `today-app.cjs` hunk, and the workflow

The binding change is ONE line: `view.marchingOrder.why` becomes `view.orderSentence`. The
other four lines of the hunk are a comment that described the old behaviour and would have
been false if left. I judge the hunk minimal; a stale comment in a sealed file is worse than
four lines of diff. The hunk sits at `today-app.cjs:862-873`, which C-UI-1 also edits; the
integrator should expect to land these two in a known order rather than in parallel.

`rebuild.yml`: no YAML parser exists on this machine and installing one is forbidden, so I
checked the file structurally instead. No tabs anywhere, LF only, the new `- name:` at six
spaces and its `run:` at eight, identical to every sibling step, the comment block at six
spaces like its neighbours, the step name a plain scalar with no colon in it (an apostrophe
mid-scalar is legal), and the `run:` a single line naming two paths with forward slashes and
no glob. It is the last step but one of the same `rebuild-public` job, so it runs under the
existing `matrix.os` on both runners. I then ran that exact command line on Windows: 9 / 9,
exit 0. The step is where the S1 cell's honest home is, and both new cells have a home with it.

## NOTES

N1. THE ONE PINNED FILE THE TICKET DID NOT NAME. `today/test/view.test.mjs` is pinned and it
moved. I agree it HAD to: the ticket's own bar demands the today suite pass, `view.test.mjs`
is one of its thirteen cells, and its `:102` and `:116` assert the defect as a law. The
adopted diagnosis says so in terms ("S2 has NO unpinned route ... `view.test.mjs:102` and
`:116` must be edited too"), and I verified that quotation against
`origin/rebuild/d-p3-today-copy-diag`. The author flagged it himself and asked the PM to
confirm rather than assume, which is the right instinct. PM: the S9 tooling round must declare
FOUR pinned paths for this lane, not the three the ticket names. Two assertion lines plus a
comment moved in that file and nothing else; I checked the whole diff.

N2. TWO COLONS, and I disagree with nobody about it but want it recorded sharply. Every
sentence on screen now carries two: the one this lane adds, and the one `plainCopy` already
made out of the engine's own em dash. The night rung reads "Before coffee, log last night:
bed, wake, and how long you took to drop off: the body-composition read leans on this harder
than anything else you enter". It is whole and it is true. It is not elegant. The author's
alternative in his open question 1 (end the cue with a full stop and raise the why's first
letter) costs one character of this lane's own and reads better. I would not block on it and
I would not decide it here: it is the owner's sentence. Worth putting in front of him with
both versions side by side, since he is the one who saw the fragment.

N3. NO TERMINAL FULL STOP, in any of the five shapes. "Before bed tonight, close the day:
calories, protein, steps: three numbers, then it is done" ends bare. This is NOT a regression
(the clause alone ended bare too, and the approved design evidently does not stop this slot),
so it is not this lane's to fix and I raise no objection. But "a complete sentence" was the
ticket's word, and a reader could reasonably call an unstopped line incomplete. If the owner
is asked about N2 anyway, this is the same question and should be asked in the same breath.

N4. THE SLOT GOT LONGER AND NOTHING MEASURES IT. The author's open question 4 worries about
the widened HEADLINE vocabulary. The bigger unmeasured thing is the slot this ticket actually
changes. Measured by me, `instruction-why` grows by the length of the cue and the action:
night 122 to 152 characters, yesterday 101 to 135, weight 91 to 120. The composer has no
bound and my 400-character probe composed a 418-character line without complaint. No cell and
no gate measures this slot's layout, and `browser-check.mjs` (the fluid-floor check) is
stale-red at the tip for an unrelated reason, so nothing will catch a two-line slot becoming
four on a 390px frame. Not a defect in this change and not blocking; it belongs on the
C-UI-0 gates round's list, beside the headline vocabulary.

N5. THE WIDENED VOCABULARY IS WORTH IT, AND HALF OF IT IS SOURCE TEXT. Measured by me:
15 titles at the tip, 30 here. Four of the fifteen new ones are plain literal headlines that
neither the copy gate nor the layout gate could see before ("VOLUME BAND SITS ABOVE THE
HIGH-RETURN REGION", "THE WEEKLY REFEED HAS NO EVIDENCE BEHIND IT", "TWO LIFTS HAVE PLATES
TOO COARSE FOR THEM", "THREE MACHINES MIGHT BE THE WRONG ONES ...") and that alone justifies
the widening. Eleven carry raw `${...}` placeholders and are measured as SOURCE, not as
anything an athlete reads. The author says so himself in the `design.cjs` comment, which is
the honest thing to do. The practical consequence to record: the owner's own 45-character
rendered headline is still not in the vocabulary; its 77-character TEMPLATE is. For a
maximum-length layout floor that is conservative and therefore safe. For a copy rule it means
the gate is reading `${CAP(MGLABEL(VP.MG))}` where the athlete reads a muscle group. The
literal parts of those titles ARE now measured, which is where the defect was.

N6. A BYPRODUCT THE WIDENING EXPOSED, for lane B's engine window, not for this lane. Three
engine titles carry U+2192 and one carries U+2212 (a true minus sign, in `VOLUME ${DIR > 0 ?
"+1" : "-1"} ...`). `plainCopy` normalises neither. The copy rule and both cells here check
only U+2013 and U+2014, so those characters reach the athlete unexamined. Pre-existing, not
caused here, and only visible at all because this lane widened the vocabulary. Worth one line
to whoever owns engine copy.

N7. ONE ASSERTION IN THE NEW CELL CANNOT FAIL, which is the exact flaw review R1 M2 raised
against the old one. `plan-sentence.test.mjs` asserts `title === title.toUpperCase()` for
every entry of the vocabulary, but `headlineVocabulary` uppercases every entry as it collects
it, so the assertion is satisfied by construction. Harmless, one line, and the rest of that
cell is genuinely behavioural (the golden, the shape walk, the null matrix). Worth deleting
or replacing with a check on the RENDERED title next time that file is opened. Not blocking.

N8. THE REPORT'S ADDED-LINE COUNT. Section 4 says "336 added lines". The branch adds 509,
of which 173 are the report itself; the author evidently measured the product and cell lines
and called it the whole branch. I re-measured all 509 added lines across all nine files:
ZERO U+2013 and ZERO U+2014. The conclusion stands, only the wording of the count is loose.

N9. THE STALE RED IS STALE. I did not take this on the report's word either. I added a second
detached worktree at `9e1ece8` and ran `rebuild/m4/spec/b-ntc-successors.test.cjs` there and
on the branch: 6 tests, 2 pass, 4 fail in BOTH. Stale-red at the tip, not caused here.
Worktree removed.

N10. ENVIRONMENT, for whoever cuts the next lane C worktree. The author's section 7 is
correct and I hit the same thing: a worktree's three `node_modules` junctions must be
re-pointed at a live clone (root at the main clone's, W5 and W6 at `earned-adm`'s) or the
today suite reports a fictitious 89 tests with 21 failures before anything is changed. Both
of my scratch worktrees needed the same three junctions. Nothing was installed by me.

## What I could not measure, stated rather than claimed

1. LINUX. Everything above ran on this Windows PC. The new CI step is shell-agnostic by
   construction and I checked it structurally, but I did not execute it on ubuntu.
2. A REAL BROWSER. `browser-check.mjs` is stale-red at the tip (DECISIONS:534), so neither
   the widened headline vocabulary nor the longer `instruction-why` slot has been through the
   fluid-floor layout check on a real frame. See N4 and N5.
3. A REST DAY. The synthetic week contains none, and `marchingOrder` does not branch on the
   session, so I report it as unreached rather than as covered.

Nothing in this review was taken from the author report without re-measuring it. Every number
here is mine. The report's numbers and mine agree everywhere except the added-line count of
N8, which changes nothing.
