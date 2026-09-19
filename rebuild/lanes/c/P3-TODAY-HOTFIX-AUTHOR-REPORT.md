# P3-TODAY-HOTFIX: author report (lane C slice hotfix)

Branch `rebuild/c-p3-today-hotfix` off `origin/rebuild/t2-client-core` at 37fad8e.
Scope is exactly DECISIONS:534 ruling (a): S1, S3 and S4, unpinned files only, nothing else.
S2 is not touched and rides the next lane B reseal child (ruling (b)). No engine byte, no
coach byte, no pinned byte, no law weakened, no test relaxed to reach green.

NOTATION. DECISIONS:114: no U+2013 and no U+2014 anywhere. The em dash and the arrow in
the owner's own headline are written as `<U+2014>` and `<U+2192>` where they must be quoted.

## What changed, per defect

### S3: the developer prose on the production screen

`rebuild/slice/pwa/shell.cjs:115-131` (the comment on the page edits, now four), `:143`
(`VIEWPORT_META`), `:146-150` (the two new `once()` edits: the viewport meta, then
`<body>` to `<body data-earned-app>`), `:168-173` (three new assertions on the emitted
page), `:214` (`VIEWPORT_META` exported so the cell names the same bytes the build does).
`rebuild/slice/pwa/preflight.css:17-30` (the gate's own header and the S3 rule):

```css
body[data-earned-app] .stage > .review:not(#pwa-preflight) { display: none; }
```

THE GATE IS A BODY MARKER, NOT `@media (display-mode: standalone)`. The diagnosis sketched
the standalone media query and named its own trap in the same paragraph: standalone does not
match the deploy URL opened in a Safari tab, and that is one of the two ways the owner reads
this page. A marker that `installableHtml()` writes onto the page THIS folder emits covers
both, and A1's own preview page never carries it, so the PC review harness and every one of
the desktop cells that mount A1's shell are byte-for-byte what they were. The diagnosis's
blunter alternative (delete the prose from `index.shell.html`) would have taken the harness
off the PC preview too, which is where it is right and where A1's reviewers still want it.

The elements stay in the document. `today-app.cjs` and `today-entry.mjs` write the boot and
store lines into `#today-storage` and `#today-status` by id, and eight test cells read them;
only the asides that hold them are unpainted. A5's own preflight aside is the athlete's and
stays visible.

### S4: the header under the status bar

`rebuild/slice/pwa/shell.cjs:146-148` (the viewport meta gains `viewport-fit=cover`) and
`rebuild/slice/pwa/preflight.css:31-47`:

```css
body[data-earned-app] .stage {
  padding-top: max(24px, env(safe-area-inset-top, 0px));
  padding-bottom: max(24px, env(safe-area-inset-bottom, 0px));
}
```

S3 and S4 ship in the same commit because they must: `env()` resolves to 0 without
`viewport-fit=cover`, so the padding alone is a no-op, and the meta alone makes the overlap
certain. And S3 removes the leading aside that was the only thing holding the wordmark down
the document, so S3 without S4 is strictly worse than today.

THE 24px FALLBACKS ARE MEASURED, AND THE DIAGNOSIS'S FIGURE WAS WRONG. The diagnosis read
12px and 25px off `@media(max-width:430px){.stage{padding:12px 8px 25px}}` and warned that
its pixel account was not measured. Rendering A1's own built page (`.tmp/w7-today-dist`) in
a real browser at 393x852 and at 900x852 computes `.stage` padding 24px top and 24px bottom
AT BOTH WIDTHS: that narrow-screen rule is dead in the shipped cascade, because a later rule
of equal specificity (`.stage{padding:24px 8px}`) follows it in `styles.css`. With 12px as
the fallback the deployed page would have LOST 12px of top padding on every device that
reports no inset. With 24px, `max()` can only ever add the device's own inset and never
takes a pixel away from what the page renders today, at any width.

`rebuild/m3/w7-preview/today/preview.css` is pinned and was not touched, which is also the
honest layer: the harness and the fixed insets are only wrong on the page this folder emits.

### S1: the proposal title in the "Your plan for today" headline

`rebuild/m3/w7-preview/today/today-model.cjs:92-122` (the reasoning, `hasOpenProposal()`,
`planMove()`), `:124-127` (`projectionOf` serves the plan's own move).

```js
function planMove(E, state, nowModel) {
  if (!hasOpenProposal(state)) return nowModel.move;
  const bare = clone(state);
  bare.proposals = [];
  bare.agentProposals = [];
  return E.nowModel(bare).move;
}
```

The diagnosis's shape B, narrowed. Only `move` is served from the proposals-free projection;
`statusFace`, `decisionsN`, the workout and every figure stay the real state's, so nothing
hides what is genuinely waiting. The whole `move` object moves together, not just `title`,
because `today-app.cjs:870` and `:1093` print `move.body`: swapping the title alone would put
the day's plan in the headline and a proposal's effect in the sentence under it.

Every word on the screen is still an engine result: the same `nowModel()` over the same state
with its proposals set aside. This adapter writes no copy. With no open proposal the second
projection is never computed and `nowModel` is returned by identity, so the fixture render is
untouched and the engine's memoisation is not defeated.

`design.cjs`'s `headlineVocabulary` was NOT widened: that is S2's reseal child (ruling (b)).

## Red first

Every cell was written before its fix, and each was re-run red against the tip after the
fix was finished, by stashing only the three product files and leaving the cells as they
ship. Both runs below are that re-run, so the cell text is identical red and green.

| suite | tip (product stashed) | with the fix |
|---|---|---|
| `rebuild/slice/pwa/test/pwa.test.cjs` | 38 tests, 36 pass, **2 fail** | 38 tests, 38 pass, 0 fail |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | 3 tests, 2 pass, **1 fail** | 3 tests, 3 pass, 0 fail |

RED, S3 (`pwa.test.cjs:698`, "S3 - the page A5 emits hides A1's review asides, and A1's own
page keeps them"):

```
AssertionError: the emitted body carries no slice marker, so nothing can gate the harness off
  actual: false, expected: true
```

RED, S4 (`pwa.test.cjs:724`, "S4 - the emitted page draws under the status bar and reserves
it as a quantity"):

```
AssertionError: the emitted viewport meta does not opt into the full screen
  actual: false, expected: true
```

RED, S1 (`today-headline.test.mjs:54`, "S1 - an unresolved proposal is not the headline over
'Your plan for today'"):

```
AssertionError: the proposal card title is still the headline
  actual:   'Side delt <U+2014> EARNED VOLUME: 10 <U+2192> 12 WEEKLY SETS'
  operator: notStrictEqual
```

That is the owner's string character for character, off a state carrying one unresolved
volume proposal. The same cell asserts, before that, that the engine really does choose the
card title, so it cannot pass by the defect going away somewhere else.

GREEN: all three, plus the two further S1 cells (the open count is still 1 in the projection;
the fixture path is identity).

## Where the S1 cell lives, and why

Its natural home is `rebuild/m3/w7-preview/today/test/adapter.test.mjs`. That file is pinned
by the S8 seal artifact, and so are all thirteen files in that directory (named twice: the
`product` map at `acceptance-s8-real-shape.json:726-781` and the sha map at `:1604-1616`) and
`.github/workflows/rebuild.yml:201`. A FOURTEENTH file in that directory is not a seal
violation by itself but turns `rebuild/m4/workout/test/h3-clean-init.test.cjs` H3/13 red:
that cell reads the today step's named set off `rebuild.yml` and asserts
`deepEqual(onDisk, NAMED)` in both directions, and `rebuild.yml` is pinned. So there is no
place for this cell inside the seal, and the cell lives in its own lane C directory instead.
Verified: H3 suite 14 tests, 14 pass, including H3/13.

CONSEQUENCE THE PM MUST RULE ON, and the one thing this round leaves open: the S1 cell runs
by hand and in review, and in no workflow. The interrupted hand had added a step to
`.github/workflows/slice-host.yml` naming it. THAT FILE IS NOT IN RULING (a)'S LIST and the
fix deploys without it (the build and deploy steps are untouched; the step only runs a test),
so it is REVERTED HERE IN FULL, and no part of it is kept. Two notes for whoever rules:
`slice-host.yml` is unpinned, so a one-line step is available; but
`rebuild/slice/pwa/test/workflow.test.cjs` already carries the cell "this workflow is the CI
home for every A5 test file", and this cell is not an A5 file, so the honest home is the
`rebuild.yml` lane step that already enumerates every lane D cell directory (`:269`, `:271`,
`:280`, `:289`) and that the next reseal child can move.

## The seal line

`findstr` for each path against `rebuild/m4/spec/acceptance-s8-real-shape.json`, run before
the first edit and again before each commit:

```
=== rebuild/slice/pwa/shell.cjs                               ABSENT-FROM-SEAL
=== rebuild/slice/pwa/preflight.css                           ABSENT-FROM-SEAL
=== rebuild/slice/pwa/test/pwa.test.cjs                       ABSENT-FROM-SEAL
=== rebuild/m3/w7-preview/today/today-model.cjs               ABSENT-FROM-SEAL
=== rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs   ABSENT-FROM-SEAL
=== rebuild/lanes/c/P3-TODAY-HOTFIX-AUTHOR-REPORT.md          ABSENT-FROM-SEAL
```

Those six are every path this branch moves. `preview.css`, `today-app.cjs`, `build.mjs`,
`test/view.test.mjs`, `index.shell.html` (unpinned, but not needed) and every engine and
coach file are untouched. `git diff --stat 37fad8e` names those six files and nothing else.

## The fixture render is byte-identical, proven by bytes

The fixture projection was dumped to a file through `today-model.cjs` with the fix and again
with `today-model.cjs` alone stashed, and the two files compared. No value is quoted here:

```
sha256 (tip) 1f58d1e76360994b948764e26959f32eb1be0259539ea79fb05b7641b4d4a254
sha256 (fix) 1f58d1e76360994b948764e26959f32eb1be0259539ea79fb05b7641b4d4a254
fc /b: FC: no differences encountered
```

The third S1 cell asserts the same thing from inside the suite.

## The combined S3 and S4 result, measured on the deployed folder

`node rebuild/slice/pwa/build-pwa.mjs` then a real headless browser over the REAL output
(`.tmp/slice-pwa-dist`, the 13 files the deploy publishes) at 393x852. The safe-area inset
cannot be simulated through any browser API, so the second row substitutes a literal 59px
for the `env()` term in the SAME `max()` rule the page ships; that row is a substitution and
is not a device reading.

| | viewport meta | body marker | review asides painted | `.stage` padding | mast top |
|---|---|---|---|---|---|
| A1's own built page | no `viewport-fit` | absent | 2 | 24px / 24px | 209px |
| the deployed page | `viewport-fit=cover` | present | 0 (preflight still painted) | 24px / 24px | 50px |
| the same, inset 59px substituted | `viewport-fit=cover` | present | 0 | 59px / 34px | 85px |

So: the review prose is gone from the page the owner installs, `#today-storage` and
`#today-status` are still in the document, the page reserves exactly today's 24px where no
inset is reported, and a 59px inset moves the wordmark 35px further down instead of being
drawn under the clock. Zero console errors and zero page errors on that render.

## Suites

| suite | result |
|---|---|
| the thirteen Today cells (`rebuild/m3/w7-preview/today/test/`, the CI today step's set) | 661 tests, **661 pass**, 0 fail |
| `rebuild/slice/pwa/test/pwa.test.cjs` + `workflow.test.cjs` | 46 tests, **46 pass**, 0 fail |
| `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` | 3 tests, **3 pass**, 0 fail |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` (H3/13 guards the today directory) | 14 tests, **14 pass**, 0 fail |
| `node rebuild/m3/w7-preview/today/build.mjs` | PASS, 3 assets, 141 pinned inputs |
| `node rebuild/slice/pwa/build-pwa.mjs` | PASS, 13 files, 11 precached, no network reference, no dash |

DASH LAW: not one line this branch ADDS, in any file, carries U+2013 or U+2014 (scanned over
`git diff 37fad8e`). The dashes that remain in `shell.cjs`, `pwa.test.cjs` and
`today-model.cjs` are on lines this branch does not touch.

Environment: `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, node from the codex
primary runtime, `node_modules` junctioned (never installed). The preview build DOES run on
this machine, unlike the diagnosis's worktree: `@noble/hashes` is present here. Two further
junctions were needed for the Today suite and are worth recording for the next hand:
`rebuild/m3/w6/node_modules` and `rebuild/m3/w5/node_modules`, without which twelve of the
thirteen Today cells die on `Cannot find package 'fake-indexeddb'`.

## What I could not run, and what I am not claiming

1. `rebuild/m3/w7-preview/today/browser-check.mjs` DOES NOT PASS ON THIS MACHINE, AND DOES
   NOT PASS AT THE TIP EITHER. With `W7_BROWSER_BIN` set to the installed chromium it fails
   identically with every change stashed (`tip_bc_exit=1`) and with the fix
   (`bc_exit=1`): `page.waitForSelector: Timeout 30000ms exceeded, waiting for
   locator('[data-slot="instruction"]') to be visible`. The cause is a first-run state, not
   this branch: on a clean browser profile the page boots into the setup wizard ("Let's set
   up your week.", 1 of 6), so the Today headline slot never paints and the check's flow
   never starts. It is stale-RED at 37fad8e and this round did not mend it, because mending
   it is not in ruling (a). ITS IN-BROWSER DASH SWEEP THEREFORE DID NOT RUN. The dash law is
   still covered three other ways on this branch: `copy.test.mjs` (in the green Today suite)
   scans the built HTML, `pwa.test.cjs` asserts no em or en dash in anything A5 emits, and
   both builds report their own dash scan as part of PASS.
2. The real device. No iPhone confirmed this build's installed behaviour; the inset row in
   the table above is a substitution, and whether iOS was overlaying the status bar before
   `viewport-fit=cover` remains a device fact. The fix adds both the meta and the inset, so
   it does not depend on the answer, but the first person with the phone should read the
   wordmark's position off it.
3. `display-mode: standalone` is deliberately not the gate, so nothing here was tested
   through the installed-app media query; the marker is in the emitted bytes instead, which
   is what the S3 and S4 cells assert.
4. CI on both operating systems, the independent Opus review told to disagree, and Fable
   final are the PM's steps and have not run.
