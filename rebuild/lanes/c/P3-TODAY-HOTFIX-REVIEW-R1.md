# P3-TODAY-HOTFIX: independent review, round 1

Reviewer: Opus, independent of the author, same worktree (%TEMP%\earned-todayfix),
read-only on product. Branch `rebuild/c-p3-today-hotfix` at 7daf5b9 over
`origin/rebuild/t2-client-core` (37fad8e). Ruling under review: DECISIONS:534 (a).

## VERDICT

**ACCEPT WITH NOTES.** No blocking item. The seal line is clean, every suite I ran
myself is green, and I re-measured the two claims the fix actually rests on (the
24px cascade figure and the aside gate) in a real browser rather than trusting the
report. Three notes below should be answered before the deploy is called done: one
is a product comment that states the opposite of what the code does, one is a cell
that pins nothing about the copy the owner will now read, and one is a limit of the
S4 fix that the phone read must not be mistaken for covering.

## BLOCKING

None.

## MAJOR

### M1. `today-model.cjs:104-105` says the opposite of what the code does

The comment reads "Nothing else is taken from that second projection" and
"`decisionsN` all stay the real state's, so nothing hides what is genuinely waiting."

Measured, not argued. `projectionOf` returns `{ ...nowModel, move }`, so the WHOLE
`move` object comes from the proposals-free projection. Over the fixture basis with
one and with three unresolved proposals I read back:

```
proposals 1 -> move.kind "fix"  move.title "CLOSE THE BOOKS FIRST"  move.n undefined  decisionsN 1
proposals 3 -> move.kind "fix"  move.title "CLOSE THE BOOKS FIRST"  move.n undefined  decisionsN 3
```

So `move.kind`, `move.body`, `move.n` and `move.lever` are all the second
projection's, and `move.body` reaches two further slots: `today-app.cjs:870`,
`today-app.cjs:1093` and `today-model.cjs:267` (the "What supports ..." why section).
The author report states this correctly ("The whole `move` object moves together");
the product comment does not, and in this tree the comment is the declaration.

Worse for the second sentence: a content search over `rebuild/` for `decisionsN`
returns it only in `rebuild/engine/today.cjs`, `today-model.cjs:105`, the new cell
and non-product review JSON. **No renderer reads it.** Before this change an open
proposal was named in the headline and counted in the body ("+N more"); after it the
open decision is invisible on Today. Ruling (a) asks for exactly that ("Today's
projection carries no proposals until C-UI-3 gives them their card"), so the
BEHAVIOUR is correct and in scope. The comment claiming the opposite is not.

Ask: rewrite those two sentences to say what is true. The count survives in the
projection, nothing renders it, and Today is silent about an open decision until
C-UI-3 gives it a card. That is a fact the PM and C-UI-3 both need on the record.

### M2. The S1 cell does not pin the copy the owner will now read

`today-headline.test.mjs:54-80` asserts what the headline is NOT (four negatives
against the owner's own string) and then asserts it EQUALS
`model.engine.nowModel(bare).move.title`, which restates the implementation and
cannot fail while the implementation stands. Nothing pins that the replacement is a
headline the approved design admits. Measured, it is "CLOSE THE BOOKS FIRST": engine
copy, upper case exactly as this slot already renders every headline, no dash, no
readiness word, and it is what a proposal-free state already shows today, so it is
acceptable under the copy rules and needs no `headlineVocabulary` widening. That is
my finding, not the cell's. One assertion tying the headline to
`design.cjs` `headlineVocabulary` (or to the literal) would make the cell carry it.

## MINOR

### N1. S4 reserves the inset in the document, not against the viewport

`.stage` padding pushes the fixed 844px phone frame down. Measured on the real
deployed folder at 393x852 with both asides hidden: document height 1014px against
an 852px viewport, so the page still scrolls and the wordmark can still be scrolled
under the status bar. The fix holds at scroll-top, which is what the owner will see
on open. A complete answer needs the frame dropped (C-UI-2) and is not in ruling (a).
Name this to the owner so the phone read is not taken as more than it is.

### N2. Only the top and bottom insets are reserved

`safe-area-inset-left` and `-right` are not. The manifest is `orientation: portrait`,
but the deploy URL opened in a Safari tab is not bound by the manifest, and that tab
is one of the two places ruling (a) names.

### N3. The child combinator in the S3 rule is narrower than it needs to be

`body[data-earned-app] .stage > .review:not(#pwa-preflight)`. Injected into the real
deployed page and read back from the browser:

```
aside.review                -> display none   (correct)
aside class="review note wide" -> display none   (correct, extra classes are fine)
aside.review one level nested  -> display block  (NOT hidden)
```

`pwa.test.cjs` (f) pins only the FIRST aside's adjacency
(`/<main class="stage">\s*<aside class="review">/`), so if A1 ever wraps the SECOND
aside, the developer prose returns to the owner's phone with every cell green. A
descendant combinator costs nothing and closes it.

### N4. `clone` is a JSON round trip

`today-model.cjs:57`. `{ ...state, proposals: [], agentProposals: [] }` gives the
engine the same answer without re-serialising the whole state on every read in the
proposals case. Not a defect: the state is already JSON-cloned upstream at `:223`.

### N5. The seal now pins an identity this fix deliberately breaks

`test/adapter.test.mjs:126` and `:259` assert
`view.nowModel.move.title === reference.nowModel(state).move.title`. Green only
because no fixture carries a proposal. The next reseal child should re-author those
two lines rather than inherit them unread.

### N6. The S1 cell runs in no workflow

The author names this, reverted the `slice-host.yml` step in full because that file
is not in ruling (a)'s list, and proposes the `rebuild.yml` lane step as the honest
home. I agree with the reasoning and with the revert. It is the PM's to rule.

## Did the author weaken a test or a guard?

No. I read `d381abb..3435fa9` for `pwa.test.cjs` line by line. The figures moved
12px/25px to 24px/24px (a correction of the DIAGNOSIS's figure, verified below, not
a relaxation), and the scans moved from the raw stylesheet to the comment-stripped
rules, which is stricter in substance: the prose in that file quotes the approved
sheet's own selectors, so a scan over the raw text passes or fails on a sentence.
The replaced `css.includes(".stage {") === false` was already satisfied either way,
and the pair that replaced it also forbids an unscoped `body` rule. No law, guard or
existing cell was touched anywhere on the branch.

## What I re-measured myself

**Seal line.** `git diff origin/rebuild/t2-client-core...HEAD --name-only` names six
paths: `rebuild/lanes/c/P3-TODAY-HOTFIX-AUTHOR-REPORT.md`,
`rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs`,
`rebuild/m3/w7-preview/today/today-model.cjs`, `rebuild/slice/pwa/preflight.css`,
`rebuild/slice/pwa/shell.cjs`, `rebuild/slice/pwa/test/pwa.test.cjs`. `findstr` for
each against `rebuild/m4/spec/acceptance-s8-real-shape.json`: zero hits. The string
"pwa" appears zero times in that artifact and "today-model.cjs" zero times. The
pinned Today files (`preview.css`, `today-app.cjs`, `build.mjs`, `test/view.test.mjs`
and the other twelve in that directory) are untouched, and so is `index.shell.html`,
which ruling (a) allowed but the fix did not need. **No pinned path moved.**

**Suites, run by me** (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, node from
the codex primary runtime, node_modules junctioned):

| suite | result |
|---|---|
| `rebuild/slice/pwa/test/pwa.test.cjs` | 38 tests, 38 pass, 0 fail |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | 3 tests, 3 pass, 0 fail |
| the thirteen Today cells, `rebuild/m3/w7-preview/today/test/` | 661 tests, 661 pass, 0 fail |
| `h3-clean-init.test.cjs` + `workflow.test.cjs` + `pinned-unchanged-and-ruled-substitutions.test.cjs` | 38 tests, 38 pass, 0 fail |
| `node rebuild/m3/w7-preview/today/build.mjs` | PASS |
| `node rebuild/slice/pwa/build-pwa.mjs` | PASS, 13 files, 11 precached |

The 661 and the 38 match the author's counts exactly.

**S3, on the deployed bytes and in a real browser.** `.tmp/slice-pwa-dist/index.html`
carries `<body data-earned-app>` and still contains `#today-storage`, `#today-status`
and `#pwa-preflight`, so the hooks C-UI-1 relies on survive. Chromium over that real
output:

```
deployed       393x852  marker true   asides: none(0px), none(0px), #pwa-preflight grid(106px)  .stage 24px/24px
deployed       900x852  marker true   asides: none(0px), none(0px), #pwa-preflight grid(106px)  .stage 24px/24px
A1 preview     393x852  marker false  asides: block(143px), block(57px)                          .stage 24px/24px
A1 preview     900x852  marker false  asides: block(143px), block(57px)                          .stage 24px/24px
```

So the review prose is gone from the page the owner installs and unchanged on A1's
own page at both widths. The screenshot at 393x852 shows the phone frame starting
24px down with no prose above it.

**S4, and the figure the diagnosis got wrong.** The emitted meta is
`width=device-width,initial-scale=1,viewport-fit=cover` and the old meta does not
survive; `env(safe-area-inset-top, 0px)` and `-bottom` are in the shipped
`preflight.*.css` with a `max()` fallback. The author is right and the diagnosis is
wrong about the 12px: `design.cjs` `composeStyles` concatenates APPROVED in order,
Refinement A then Additions C, and Additions C's unconditional
`.stage{...padding:24px 8px}` follows Refinement A's
`@media(max-width:430px){.stage{padding:12px 8px 25px}}` at equal specificity, so the
narrow-screen rule is dead. I confirmed that from the cascade AND from the browser:
24px top and bottom at 393px and at 900px. `max(24px, inset)` therefore reproduces
today's figure exactly where no inset is reported and can only add. A declaration
that drops on a browser without `env()` falls back to the approved `.stage` rule,
which is the same 24px. `body[data-earned-app] .stage` is (0,2,1) against `.stage`
(0,1,0) and the sheet is linked after `styles.css`, so the cascade holds; `.stage`
left and right padding is left to the approved sheet and is unchanged. On iOS in a
plain Safari tab the top inset is 0 and the page renders exactly as today; in
standalone on a notched phone it is roughly 47 to 59px and the frame moves down by
that much; on Android the inset is typically 0 to 24px and the same arithmetic holds.

**Dash law.** Zero added lines on the branch carry U+2013 or U+2014.

**Not re-measured.** `browser-check.mjs` (the author records it as stale-red at the
tip for a first-run reason unrelated to this branch; I did not re-run it, so its
in-browser dash sweep is unrun on both sides). No device inset was read: the 59px row
in the author report is a substitution, correctly labelled as one, and the first
person with the phone still owes the wordmark's position.
