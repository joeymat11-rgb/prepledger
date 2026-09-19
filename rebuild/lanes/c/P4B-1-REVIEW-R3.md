# P4b-1 REMEMBER AND RECALL: review R3 (the PM's short final round)

Independent re-check, one pass, security-minded. The author is gone; every claim
in `P4B-1-AUTHOR-REPORT.md` section 13 was treated as a hypothesis and measured
again with probes of my own. Head reviewed: `93d8a551160e9f7ab678b8f8180a8be5272666de`
(merge of the chain tip `753ba870` into `f89db283`). Base: `c9c34aef`.

## VERDICT: REJECT, on ONE blocking finding

Everything the PM asked for in P-F1, P-F3 and P-F4 is done and I could not break
it. P-F2's fix is right in shape and is defeated by a road nobody tested: the
turn's allowance is READ before the store read and SPENT after it, so recalls
that are in flight together each see the whole five. **Six concurrent recalls in
one turn publish twelve facts on the reviewed head.** The remedy is about four
lines and the file already contains the right discipline one screen below, in
`remember()`. Nothing else in this round should be reopened.

## R3-B1 BLOCKING: the turn's five facts are not held against concurrent recalls

`rebuild/coach/memory-tools.cjs`

```
175:    const allowance = allowanceOf(turn_id);      <- read
181:    const read = await lane.forTopic(topic);     <- the store read, an await
224:    if (account) account.used += bounded.shown;  <- spent, inside envelopeFor
```

Between 175 and 224 there is an `await`. Two or more recalls issued in the same
turn without awaiting each other therefore all pass the `allowance <= 0` check,
all call `Model.recall` with `max: 5`, and only then add up their own `shown`.
The account ends at zero, having published far more than five.

MEASURED at the reviewed head, my own probe, six topics with two memories each,
one turn, `Promise.all` over the six recalls:

```
CONCURRENT.facts_in_one_turn = 12
CONCURRENT.per_call = [2,2,2,2,2,2]
CONCURRENT.allowance_left = 0
```

Sequentially the same fixture gives `5` and `[2,2,1,BOUND,BOUND,BOUND]`, so the
bound holds only for a caller that serialises its own tool calls. Nothing in
`model-adapter.md` requires a live adapter to serialise them, and a model that
emits parallel tool calls is the ordinary case the adapter exists for.

**Why this is blocking and not a note.** The ruling's section 3 point 4 bounds
what leaves the phone in a turn, not what leaves it in a call; that is a data
minimisation property, and doubling it is the thing the bound exists to stop.
`model-adapter.md` now states the promise in so many words: "Asking about six
subjects in one turn therefore returns five facts in total, not thirty." On the
reviewed head that sentence is false for a parallel adapter, and
`model-adapter.md` is precisely the document the adapter author will rely on.
The measured byte figure in the same file rests on the same bound.

**The file already knows the answer.** Thirteen lines below, `remember()` spends
the confirmation handle BEFORE the write, with the comment "The handle is spent
BEFORE the write, so a yes cannot be in flight twice." The allowance needs the
same treatment: reserve at the check, give back what was not used.

```
const account = turns.get(turn_id);
const allowance = allowanceOf(turn_id);
if (allowance <= 0) { return refuse(... MEMORY_TURN_BOUND ...); }
if (account) account.used += allowance;                    // reserve
... after the read, in envelopeFor:
if (account) account.used -= (allowance - bounded.shown);  // give back
```

A refusal after the reserve (`MEMORY_UNREADABLE`, `MEMORY_ABSENT`, a throw
caught in `dispatch`) must give the whole reserve back, or a turn whose first
recall finds nothing will refuse the next one. The cell this round owes is the
`Promise.all` one above, red first.

I did NOT edit any product file. This review changes nothing but itself.

## What I re-ran, and where

| what | where | result |
| --- | --- | --- |
| the coach bar of record | PC, `%TEMP%\earned-p4b` at `93d8a551` | **tests 305, pass 305, fail 0**, exit 0 |
| the byte measurement | same run | `turnContextBytes 9494`, as the author reports |
| my own red/green probe | PC scratch worktree, `c9c34aef` and `93d8a551` | below |
| four mutants | PC scratch worktree at `93d8a551` | below |
| CI, both OS | GitHub, public API | below |

Environment note for the next hand: a detached scratch worktree needs THREE
junctions, not one. `dir /AL` at the worktree root shows only `node_modules`;
`rebuild\m3\w5\node_modules` and `rebuild\m3\w6\node_modules` are junctions into
`%TEMP%\earned-adm` as well, and without them 98 of the 305 cells die on
`ERR_MODULE_NOT_FOUND` for `fake-indexeddb` and `@noble/hashes/sha2.js`. My
first mutant run was invalid for that reason and was thrown away; the baseline
below was taken before any mutant was applied.

## P-F1, P-F2, P-F3: red first at `c9c34aef`, green at `93d8a551`

My probe is not the author's cells. It drives the real `memory-tools.cjs`,
`memory-commands.cjs`, `memory-model.cjs` and the real `tools.cjs` traceability
gate with a stub world and a stub lane at the seam the shipped host occupies, so
it reaches the refusal paths without a durable installation. Same file, both
heads, one run each.

| probe | `c9c34aef` | `93d8a551` |
| --- | --- | --- |
| F1a reason quotes the exception | `true` | `false` |
| F1a reason carries a digit | `true` | `false` |
| F1a message travels in `source` | `false` | `true` |
| F1a **"Your protein target is 999 grams."** | `[]` LICENSED | `["999"]` refused |
| F1a "Your floor is 999 kcal." | `["999"]` | `["999"]` |
| F1b reason quotes the tool name | `true` | `false` |
| F1b **"Your protein target is 999 grams."** | `[]` LICENSED | `["999"]` refused |
| F2 facts published in ONE turn | `12` | `5` |
| F2 per call | `[2,2,2,2,2,2]` | `[2,2,1,BOUND,BOUND,BOUND]` |
| F3 `memoriesIn` over a damaged generation | 4 rows, malformed included | 1 row |
| F3 envelope items on that generation | `3` | `1` |
| F3 **envelope carries "210 grams"** | `true` | `false` |
| F3 `skipped` on the answer / on the absence | `null` / `null` | `3` / `3` |
| F3 "I could not read 3 of them." | `["3"]` | `["3"]` |

The two rows in bold are the finding, not an assertion about it: at `c9c34aef`
the traceability gate returned an EMPTY untraceable list for a sentence stating
a figure that came from an exception message and from a caller's tool name. At
`93d8a551` the same sentence is refused. F1a's `kcal` row is the unit keying
working as designed at both heads: the message said "grams", so only `g` was
licensed, which is why the finding needed the `grams` sentence to show it.

P-F3 at `c9c34aef` is worse than "a malformed row is published": the malformed
`text` was an OBJECT (`{display: "my target is 210 grams"}`) and it reached the
envelope whole. At the reviewed head it does not, and `skipped` is `3` on both
the answer and `COACH_MEMORY_ABSENT`, so the two answers stay different.

## The mutants: one source edit each, loaded, run, reverted

Scratch detached worktree at `93d8a551`, whole coach suite each time.
Baseline before any mutant: **305 pass, 0 fail**. After the last revert:
**305 pass, 0 fail**, `git status --porcelain` empty. No mutant was a parse
error; each loaded and ran the suite.

| mutant | the one edit | what died |
| --- | --- | --- |
| R3-M1 | the dispatch catch publishes `error.message` as the reason again | "P-F1 a lane that THROWS", and only it (304/305) |
| R3-M2 | the unknown-tool refusal publishes `String(name)` again | "P-F1 an unknown tool name", and only it (304/305) |
| R3-M3 | `allowanceOf()` returns `RECALL_MAX` whatever the account holds | "P-F2 six topics in ONE turn", and only it (304/305) |
| R3-M4 | `readMemories()` copies the payload instead of `memoryOf()`ing it | BOTH P-F3 cells (303/305) |

R3-M3 is a different edit from the author's M-U and kills the same single cell,
which is the stronger result: the boundary is pinned by behaviour, not by the
shape of one edit. R3-M4 confirms the read gate and the count are one fix with
two graves. No other cell in the suite picked up any of the four, so none of the
five P-F cells is load-bearing for anything it does not name.

## The hunt for a THIRD site

The PM's definition: any value in any memory envelope whose display can carry
text this lane does not control and whose tag unit the traceability gate
licenses. I enumerated every tagged value the two tools publish and measured the
three that are not fixed by this lane. `memoryId`, `shown` and `more` publish an
empty display and license nothing; `recordedOn` is the envelope's own date;
`kind` and `label` are closed sets, and P-F3 is what makes that true on the read
side as well as the write side.

**H1, FOUND, narrow. The topic tag licenses date components.**
`memory-tools.cjs:227` and `:211` publish the topic with `display` equal to the
topic string, under unit `topic`. `topicOf()` bounds length and trims; it
constrains no character. `allowedTokens()` promotes a declared unit to `date`
whenever the display itself reads as a date. So a memory filed under the topic
`"2019-04-17"` licenses `2019`, `04` and `17` in the `date` unit for the turn.
Measured at BOTH heads, my probe:

```
H1.date_sentence_untraceable = []        "You told me that on 2019-04-17."
H1.bare_untraceable          = ["2019"]  "That is 2019 of them."
```

The coach may therefore state a date nothing dated. It is narrow: the bare form
still refuses, the topic must be date shaped, and it must be a topic the athlete
said yes to, since the echoed topic is exact matched against a stored one. It is
the same family as P-F1 all the same. It is NOT fixable inside this lane without
either a charset rule on `topicOf()` or a change to the promotion rule in
`allowedTokens()`, and the second is a traceability core change, so I file it as
a candidate first design point for P4b-2 beside the quote frame rather than as a
finding against this round.

**H2, the declared carve-out, not a defect today.** `memory-tools.cjs:317` still
carries `saved.copy` verbatim into the reason, which is a `T.text` tag. Measured
at both heads: a lane whose save returns
`copy: "the store refused: your protein target is 777 grams"` makes
`"Your protein target is 777 grams."` fully traceable. The file declares this
("the accepted layer's own copy is still carried verbatim ... reading a client
refusal out loud is what tools.cjs:328 intends"), so it is a decision, not an
oversight. I checked the suppliers: `memory-host.mjs` `save()` sets `copy: null`
on a throw and otherwise passes `result.copy` through, and every `copy` I can
find on that path in `rebuild/m3/w6/public-client.mjs` and
`rebuild/m3/w6/local/local-client.mjs` is a FIXED sentence with no interpolation
of the submitted input. So the carve-out is safe as long as that stays true. It
is worth one line in the contract saying that it is a standing condition on the
accepted layer, because nothing enforces it and no cell would notice.

**H3, the "worst case" figure is the RECALL envelope's, not the turn's.**
`model-adapter.md` heads its new paragraph "Coaching memory's worst case is
MEASURED, and it is OVER that budget" and gives 9494, then says a turn "cannot
go past it by asking again". True as worded, and it will be read as a per turn
ceiling, which it is not: the allowance counts recalls, and `remember()`
publishes an item of its own with a full `TEXT_MAX` text on every success.
Measured at the reviewed head, one turn, one recall of five memories at
`TEXT_MAX` and then three remembers of the same size:

```
H3.allowance_left_after_recall                      = 0
H3.turnContextBytes_after_one_recall                = 8414
H3.remember_items_published_after_allowance_spent   = 3
H3.turnContextBytes_after_recall_plus_3_remembers   = 20183
```

Eight memory facts with full texts in one turn, and 20183 bytes against a budget
of 8192. No law is broken: `remember()` is a write the athlete confirmed one at
a time, and design point 4 bounds recall. But the figure the contract now pins
is 2.4 times low for the quantity the budget is about. The honest wording is
"one recall of five memories at TEXT_MAX measures 9494; a turn that also writes
memories measures more". This belongs with the choice the author already carried
to P4b-2, and it makes that choice more urgent, not less.

## The other roads to a sixth fact in one turn

| road | at `c9c34aef` | at `93d8a551` | judgement |
| --- | --- | --- | --- |
| six recalls in one turn, sequential | 12 facts | 5 facts | CLOSED |
| `dispatch()` beside `openTurn()`, SAME opened turn id | +12 facts | +0 facts | CLOSED, and this is the road I expected to be open |
| `dispatch()` with a turn id nobody opened | 12 facts | 12 facts | ruled open by the PM, pinned by its own cell, stated in both contracts |
| a SECOND `createMemoryTools` over the same world, same turn id | +12 facts | +5 facts | per instance, see note R3-N1 |
| a recall inside `remember()`'s result | n/a | `remember` publishes its own item, see H3 | not a recall; the byte consequence is H3 |
| **six recalls in one turn, concurrent** | 12 facts | **12 facts** | **OPEN: R3-B1** |

## P-F4, the copy list

Complete and accurate. I enumerated every sentence literal in
`memory-tools.cjs` independently and every one of the twenty in that file maps
to a row of the author's table at the line the table gives; `memory-model.cjs`
contributes the three join sentences and `tools.cjs` the `:458` one. Every row
is marked PROPOSED and no sentence was changed in this round. Two remarks:

1. The author's own catch on row 6 is right and should be ruled, not lost. Since
   P-F2 the turn allowance can clip a recall to fewer than five, and "I am
   showing the five most recent" is then untrue while `shown` and `more` are
   true. R3-B1's remedy does not change that; the sentence does.
2. Row 23 is the `tools.cjs:458` one liner the ruling folded in, and I confirm
   the compensating `accepted:false` write now checks its own `{stored}` result
   and that the refusal copy says so when it fails.

## Notes, none blocking

- **R3-N1 the allowance is per coach instance.** Two `createMemoryTools` over
  one world and one turn id publish five facts each. The author declares this
  ("per INSTANCE and never durable, exactly like the pending yeses") and for the
  pending yeses it is a security asset. For an allowance it is the opposite:
  a second instance refills it. The shipped wiring builds one instance, so this
  is a stacking hazard rather than a live defect; it deserves a sentence in
  `TOOL-CONTRACT.md` saying the account belongs to the instance that opened the
  turn, so a consumer knows not to stack.
- **R3-N2 `turns` grows without bound.** `turns.set(turn_id, ...)` on every
  `openTurn` and nothing ever deletes. Same shape as `pending`, so it is
  pre-existing in kind, but the memory tools are the first to add an entry on
  EVERY turn rather than on a proposal. A long lived process leaks one small
  object per turn.
- **R3-N3 `unavailable.code` can carry an exception message.**
  `memory-host.mjs` `save()` puts `error.message` in `code` on a throw, and
  `memory-tools.cjs` passes `saved.code` through as the refusal code. It is NOT
  a licensing hole: the code tag publishes an empty display. It is still a
  message nobody controls travelling in a field named "code", which the
  `TOOL-CONTRACT.md` code table presents as a closed set.
- **R3-N4 `faceOf()` never sees an interval.** `itemFor()` publishes no
  `interval` member, so `faceOf(item).interval` is always null and `joinOf()`
  falls back to the published `label`. That happens to be correct, because the
  label already carries `needs-review`, but the `interval: item.interval || null`
  line in `memory-tools.cjs` reads as if it were live and is dead. N10 said the
  interval is part of the memory shape; one line of comment would stop a later
  hand trusting it.
- **R3-N5 H1 and H2 above**, carried as P4b-2 candidates.
- **R3-N6 H3 above**, the byte figure's scope.

## The bar of record, on the owner's PC, at `93d8a551`

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, win32,
`node --test "rebuild/coach/test/*.test.cjs"` in `%TEMP%\earned-p4b`:

```
tests 305   pass 305   fail 0   skipped 0   todo 0   EXIT=0
P-F2 MEASURED worst case: one recall, five memories at TEXT_MAX,
turnContextBytes 9494
```

All seven P-F cells ran with a nonzero duration and passed. 305 is above the
ruling's floor of 234 plus the new cells. The lane's own diff
`c9c34aef..f89db283` touches `rebuild/coach` and `rebuild/lanes/c` only; the
chain tip merge `f89db283..93d8a551` brings `rebuild/DECISIONS.md` and
`rebuild/lanes/STATUS.md` and nothing else, so engine, m3, m4 and DECISIONS are
empty for this lane's own work, as the ruling requires. No U+2013 and no U+2014
in anything this round added, including this file.

## CI, both OS, at the exact head

Run 35440101975, workflow `rebuild`, head `93d8a551`:

| job | result |
| --- | --- |
| `rebuild-public (ubuntu-latest)` | **completed, success**, no step failed |
| `rebuild-public (windows-latest)` | **completed, success**, no step failed |

The whole `rebuild` run for `93d8a551` is `completed / success`, as are
`pipeline` (35440101986) and `shared-preflight` (35440101987). No step 13
`SEAL-BASE-IS-NOT-THE-CHAIN-TIP` refusal: the chain tip has not moved since the
author's merge, so nothing is owed here and I merged nothing myself.

The author's merge of the chain tip did its job. The previous head `f89db283`
has `rebuild` **failure** (run 35440062819), which is the step 13
`SEAL-BASE-IS-NOT-THE-CHAIN-TIP` refusal the PM described, skipping every later
step including the coach suite; so every CI run of this branch before the merge
proved nothing about the coach, and this one does.

## What I did NOT check, so that nobody reads more into this than it holds

- I read nothing under `rebuild/conform/private`, no `ledger/` directory, no
  `src/history.js`, no `EarnedPort`, no protected soak, on either machine, and I
  created no junction to `rebuild\conform\private`. I never ran
  `b-package.cjs --full`.
- H2's safety rests on the accepted layer's refusal copy being a fixed sentence.
  I read the two client files on that path and found only fixed sentences. I did
  not audit every producer that could reach `result.copy`.
- My probe reaches the refusal paths through a stub lane, which is the same seam
  the author's P-F1 and P-F3 cells use. The durable installation cells are the
  author's, and they are the ones the 305 count covers.
- The concurrency in R3-B1 is a property of the code, measured; I did not go and
  find a shipped caller that issues parallel recalls today, and I do not claim
  one exists. The contract's promise is what makes it blocking.

## Summary for the PM

P-F1 is done at both sites and I could not find a third one on that pattern.
P-F3 is done, and it was covering more than the ruling said: a malformed `text`
was reaching the athlete as an object. P-F4 is complete, accurate, and the
author flagged a copy defect the PM should rule. P-F2 is right in intent and
short by one discipline it already uses elsewhere in the same file. One fix
round, one cell, and this slice is done.
