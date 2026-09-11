# P1 REPORT — NO AI DASHES IN THE UI

Brief: `rebuild/slice/P1-NO-DASHES-BRIEF.md` (authority DECISIONS:114 (1), amendment DECISIONS:117 (1)).
Branch: `rebuild/polish-p1`. Base: `origin/rebuild/t2-client-core` @ **5c6766eda6f74f638ff7e3b6f5d71a323341ac27**
(recorded at start; `git rev-parse HEAD` in a fresh worktree at
`work/pm-p1`). Builder: Opus. Author != reviewer: this file is the builder's; `P1-REVIEW.md` is the reviewer's.
Machine: the owner's Windows PC. Node modules junctioned from the CI-faithful `earned-ci` worktree; no install run,
no `package-lock.json` change.

Every claim below was executed. Nothing is quoted from memory.

---

## 1. WHAT CHANGED

18 files, all inside `rebuild/m3/w7-preview/today/**`, plus this report. `git diff --stat 5c6766e..HEAD`:

```
> git diff --stat 5c6766e..HEAD
 rebuild/m3/w7-preview/today/browser-check.mjs     |  42 +-
 rebuild/m3/w7-preview/today/build.mjs             |  15 +-
 rebuild/m3/w7-preview/today/checkin-app.mjs       |  17 +-
 rebuild/m3/w7-preview/today/checkin-check.mjs     |  23 +-
 rebuild/m3/w7-preview/today/checkin-model.mjs     |   2 +-
 rebuild/m3/w7-preview/today/dash-check.mjs        |  42 ++          (new)
 rebuild/m3/w7-preview/today/design.cjs            |  41 +-
 rebuild/m3/w7-preview/today/gym-app.mjs           |  21 +-
 rebuild/m3/w7-preview/today/gym-check.mjs         |  21 +-
 rebuild/m3/w7-preview/today/index.shell.html      |   2 +-
 rebuild/m3/w7-preview/today/plain-copy.cjs        | 262 ++++++++++  (new)
 rebuild/m3/w7-preview/today/screens.template.html |   4 +-
 rebuild/m3/w7-preview/today/test/checkin.test.mjs |  19 +-
 rebuild/m3/w7-preview/today/test/copy.test.mjs    | 568 ++++++++++  (new)
 rebuild/m3/w7-preview/today/test/view.test.mjs    |  38 +-
 rebuild/m3/w7-preview/today/today-app.cjs         |  41 +-
 rebuild/m3/w7-preview/today/today-entry.mjs       |  21 +-
 rebuild/m3/w7-preview/today/today-model.cjs       |   2 +-
 18 files changed, 1101 insertions(+), 80 deletions(-)
```

(This report is committed after that diff was taken, so it is not in the list.)

Nothing outside custody: no `rebuild/engine`, no `rebuild/conform`, no `rebuild/m4`, no `rebuild/client`,
no `rebuild/m3/w6`, no `.github`, no `rebuild/slice/pwa`, no lockfile. Bar item 5, executed:

```
> git diff --stat 5c6766e..HEAD -- . ':(exclude)rebuild/m3/w7-preview/today'
(no output)
```

---

## 2. EVERY CHANGED USER-FACING STRING, before -> after

The survey that produced this list: every U+2014 and U+2013 in a **string literal** of
`rebuild/m3/w7-preview/today/**`, extracted with a comment-stripping scanner (an apostrophe inside a comment cannot
fake a literal), plus every dash in the two HTML files and the stylesheet. **No meaning changed.** The rewrite rule
used is the brief's: aside or label suffix -> a colon; a range -> the word "to"; a leading or trailing decorative
dash -> dropped; a minus sign stays a minus sign.

### `index.shell.html`
| before | after | shape |
|---|---|---|
| `<title>Earned — Today</title>` | `<title>Earned: Today</title>` | label suffix |

### `screens.template.html`
| before | after | shape |
|---|---|---|
| `No — answer it here` (sleep confirmation button) | `No: answer it here` | label suffix |
| `placeholder="—"` (sleep hours) | `placeholder=""` | decorative dash, dropped |

Not changed, deliberately: the three `−` (U+2212) on the Decrease weight / Decrease reps buttons. The brief says a
dash used as a minus sign stays a real minus sign. They are minus signs.

The empty placeholder is the one judgement call in this sweep and the reviewer should push on it. The approved
2026-09-08 reference spells that placeholder as a bare em dash: it is an empty-state glyph, not a word. There is no
colon, comma or full stop that says the same thing, the field already carries its own visible label
("hours asleep, approximately"), and inventing a word ("hours", "0") would put content on the screen the design never
had. So it is dropped and nothing is lost but the glyph. See §3 for how the design binding keeps it honest.

### `today-app.cjs`
| before | after | shape |
|---|---|---|
| `"This morning — not logged yet"` | `"This morning: not logged yet"` | label suffix |
| `const NOT_WIRED = "— not wired yet"` | `"Not wired yet"` | leading dash; the string renders alone in the tile's secondary slot, so a colon would open a sentence with nothing before it |
| `const CHECKIN_RECORDED_TODAY = "— recorded today"` | `"Recorded today"` | leading dash, same reason |
| `const CHECKIN_NO_STORE_SHORT = "— not available on this device"` | `"Not available on this device"` | leading dash, same reason |
| `"Today's target " + lo + "–" + hi + " kcal"` | `"Today's target " + lo + " to " + hi + " kcal"` | range |
| `"Today preview: template slot missing — " + name` | `"... missing: " + name` | label suffix; developer text, but `today-entry.mjs` can put an error message on the last-chance screen, so it is treated as user-facing |

### `today-model.cjs`
| before | after | shape |
|---|---|---|
| `rate.lo.toFixed(2) + "–" + rate.hi.toFixed(2) + " lb/week."` | `... + " to " + ...` | range |

### `checkin-model.mjs`
| before | after | shape |
|---|---|---|
| `"Nothing is recorded yet. Every answer is blank, and blank means unknown — never none, never zero."` | `"... blank means unknown: never none, never zero."` | aside |

### `checkin-app.mjs`
| before | after | shape |
|---|---|---|
| `"Check-in: template slot missing — " + name` | `"... missing: " + name` | label suffix (as above) |

### `gym-app.mjs`
| before | after | shape |
|---|---|---|
| `"Gym card: template slot missing — " + name` | `"... missing: " + name` | label suffix (as above) |

### `design.cjs` (the declared copy lists, kept in step with the strings above)
| before | after |
|---|---|
| `PREVIEW_COPY` `"No — answer it here"` | `"No: answer it here"` |
| `PREVIEW_RUNTIME_COPY` `"Nothing is recorded yet. ... unknown — never none, never zero."` | `"... unknown: never none, never zero."` |
| `PREVIEW_RUNTIME_COPY` `"— recorded today"` | `"Recorded today"` |
| `PREVIEW_RUNTIME_COPY` `"— not available on this device"` | `"Not available on this device"` |

### The three browser checks (expectations, not copy)
`browser-check.mjs`, `gym-check.mjs`, `checkin-check.mjs` assert on the rendered text. Their expectations move with
the strings: `"This morning — not logged yet"` -> `"This morning: not logged yet"` (browser-check 1, gym-check 2),
`"— not wired yet"` -> `"Not wired yet"` (browser-check 1), `"— recorded today"` -> `"Recorded today"`
(checkin-check 3).

### Left alone, on purpose
`console.log` lines in `browser-check.mjs` / `gym-check.mjs` / `checkin-check.mjs` / `serve.mjs`, assertion messages,
code comments and test names keep their dashes. The brief says they are not user-facing and tells the builder not to
churn them. The literal survey after the sweep finds 18 dashed string literals still in `today/**`; every one of them
is a console line or a developer assertion message, and none is in a file the page bundles.

---

## 3. THE DESIGN.CJS TERMS THAT NEEDED NORMALISING (bar item 3)

`design.cjs` harvests the recovery screen's whole vocabulary out of the pinned 2026-09-08 reference at check time
(placeholders, options, labels, legends and the inline choice arrays) and requires every harvested term to be on the
shipped screen verbatim. Where the pinned reference itself spells a term with a dash, that is now compared
**dash-normalised on both sides**, through the same `plainCopy()` the page renders with, documented in one comment
citing DECISIONS:114. Every other harvested term is still compared byte for byte.

Executed against the pinned bytes (`design.assertRecoveryBinding(...).dashNormalised`), the complete list is **one
term**:

| kind | in the approved reference | on the shipped screen |
|---|---|---|
| placeholder | `"—"` (U+2014), the sleep-hours field | `""` |

Harvest sizes are unchanged: 7 placeholders, 12 options, 10 labels, 5 legends, 12 choices.

The normalisation cannot become a hole. `test/checkin.test.mjs` now asserts the list is exactly that one entry, that
the template carries exactly one empty placeholder, and that putting the approved em dash back on the shipped screen
makes `assertRecoveryBinding` throw. The pre-existing red-first mutation loop (drop any one harvested term and the
check must fail) is unchanged and still runs on the other six placeholders and all 39 other terms.

No other declared list needed normalising: none of `APPROVED_COPY`, `RUNTIME_COPY` or `CHECKIN_RUNTIME_COPY` contains
a dash. The four preview-owned strings that did are the page's own and were rewritten (§2), not normalised.

---

## 4. THE TWO REFUSALS, AND WHAT THE NORMALISER ADMITS

`rebuild/m3/w7-preview/today/plain-copy.cjs` is the whole mechanism; `rebuild/engine` is not touched.

**The normaliser** (`plainCopy`) rewrites exactly three shapes and **refuses** everything else with a named
`AI_DASH_IN_UI` error rather than guessing:

| shape | example | result |
|---|---|---|
| aside / label suffix (dash with white space after it) | `spike — damped in trend` | `spike: damped in trend` |
| range between two figures | `60–400 lb`, `1.08–1.26 lb/wk` | `60 to 400 lb`, `1.08 to 1.26 lb/wk` |
| leading or trailing decorative dash | `— recorded today`, `—` | `recorded today`, `` |

A minus sign (U+2212) and a hyphen-minus are not dashes and are never touched.

**The render-time refusal** (P1 amendment): every write into the DOM in `today-app.cjs` (`put`, `tell`, the storage
note, the recovery marker, the weigh-in error, the Why sections, the nutrition rows), `gym-app.mjs` (`put`, `lines`,
the strip cells, the effort choices, the gym error), `checkin-app.mjs` (`put`, the read-back lines, the provenance,
the plan-consequence line, the error) and `today-entry.mjs` (the status line) goes through `plainCopy` first. It is
the only path that admits the frozen sources' prose; a dash in an unhandled shape stops the render with the named
error instead of reaching the athlete.

One deliberate exception, named here because it is a weakening and the reviewer should judge it: `today-entry.mjs`'s
last-chance handler (`boot().catch`). A cause that `plainCopy` refuses is **dropped from the screen** and written to
the console instead, because a blank page would be worse than a nameless failure. The rule still holds on screen.

**The build-time refusal** (P1 amendment): `build.mjs` calls `assertNoAiDashesInAssets` after the three assets are
composed and **before any byte is written**, so a refused build leaves the previous output untouched. What it scans,
and what it deliberately exempts, matters and is stated plainly:

* built HTML and built CSS: **everything outside a comment**, which covers text nodes, `placeholder`, `title`,
  `aria-label` and the tab title;
* built JS: **every string and template literal that came from a module this page owns**
  (`rebuild/m3/w7-preview/today/`), attributed by the `// <path>` banner esbuild writes in front of each bundled
  module. The guard throws `AI_DASH_GUARD_BLIND` rather than passing if it cannot see those banners;
* escapes are decoded first. esbuild writes every non-ASCII character in a literal as `—`, seven ASCII
  characters. A scan that did not decode would report a clean bundle and be wrong about every word the engine wrote;
* **exempt: comments.** The brief exempts them by name and says not to churn them. The bundle is not minified, so
  every comment of every bundled module ships; refusing on those would refuse on `rebuild/engine`'s comments;
* **exempt, and counted: the frozen sources' own prose.** On this build, **904** string literals from
  `rebuild/engine`, `rebuild/client`, `rebuild/m3/w6`, `rebuild/m4` and `rebuild/m3/w7-preview` (outside `today/`)
  carry a dash. This brief does not edit them; `plainCopy` is their only route to the DOM. The number is printed on
  the build line every time, so it can never be waved through in silence.

That is a deliberate reading of bar item 1's "ZERO U+2014/U+2013 in every built HTML/JS/CSS asset". Taken as raw
bytes it is unsatisfiable while `rebuild/engine` is frozen and bundled: at the base commit the built `app.js` already
contained 66 dashes in bundled comments, and `rebuild/engine/today.cjs` alone ships `title: "Nothing to fix — hold
the line"`. The reviewer should decide whether this reading is the right one; it is the one the brief's own "How to
rewrite" clause implies (comments are not user-facing, and engine text is normalised at the render boundary rather
than edited).

### How far the normaliser actually reaches (executed, not assumed)

Every string literal in `rebuild/engine`, `rebuild/client`, `rebuild/m3/w6` and `rebuild/m4/workout` that contains a
dash was run through `plainCopy`, both as written and with its `${...}` holes filled with a figure and with a word:

```
distinct dashed literals: 1226
  normalise as written:            1175
  normalise with figures in holes: 1212
  normalise with words in holes:   1184
  refused in BOTH fillings:          14
```

The 51 that need a hole filled are all `${lo}–${hi}` interpolated ranges, which become figure-dash-figure at run time.
The **14 hard cases** are word-joined dashes with no space on either side, and they are listed here in full because
they are the only place this design can fail loudly:

* 12 in `rebuild/engine/migrate.cjs` (machine setup notes: `endpoints—no bounce`, `pad—do not arch`,
  `fixed—no swing`, `wrists—palms`, `locked—don't`, and seven more of the same shape). `migrate.cjs` is on
  `build.mjs`'s FORBIDDEN list, so it is not in the page at all;
* 2 in `rebuild/engine/sleep.cjs`: `min–max` (a word range, which ": " would misread) and a bare `"—"` used as a
  value inside a long coach-card sentence. `sleep.cjs` IS bundled, but neither string is in a slot Today renders
  (Today reads `nowModel.move.title/body`, `marchingOrder.why/thenText`, `statusFace.cause`, `calorieTarget.why`,
  `proteinTarget.why`, the reading note and the workout title).

If one of those ever does reach a slot, the render boundary refuses by name rather than showing the character or
guessing at the meaning. That is the intended behaviour; it is also the sharpest residual risk in this change and is
called out in §7.

---

## 5. COMMANDS AND COUNTS, BEFORE AND AFTER

All run from the worktree root on the owner's Windows PC, ambient `NODE_ENV=production`. `node --test` prints its
summary with `ℹ`, not `#`; the lines below are copied from the runs verbatim.

### BEFORE, at the base commit 5c6766e, with no edit in the tree

```
> node --test rebuild/m3/w7-preview/today/test/adapter.test.mjs rebuild/m3/w7-preview/today/test/checkin.test.mjs \
    rebuild/m3/w7-preview/today/test/design.test.cjs rebuild/m3/w7-preview/today/test/gym.test.mjs \
    rebuild/m3/w7-preview/today/test/package.test.cjs rebuild/m3/w7-preview/today/test/view.test.mjs
ℹ tests 156
ℹ suites 0
ℹ pass 156
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

per file, run one at a time (this is the brief's "today 64 / gym 64 / checkin 28"):

```
adapter : pass=20 fail=0     design  : pass=11 fail=0     package : pass=10 fail=0     view : pass=23 fail=0
                                                                    -> today   64 pass 0 fail
gym     : pass=64 fail=0     checkin : pass=28 fail=0
```

```
> node rebuild/m4/spec/native-carriers-package.cjs --ci
NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and independent acceptance remain separate
(exit 0)
```

```
> node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
ℹ tests 22
ℹ suites 0
ℹ pass 22
ℹ fail 0
```

`rebuild/m3/w7-preview/today/test/` held six `*.test.*` files at the base; all six are listed above.

### AFTER, at the branch head

```
> node --test rebuild/m3/w7-preview/today/test/adapter.test.mjs rebuild/m3/w7-preview/today/test/checkin.test.mjs \
    rebuild/m3/w7-preview/today/test/copy.test.mjs rebuild/m3/w7-preview/today/test/design.test.cjs \
    rebuild/m3/w7-preview/today/test/gym.test.mjs rebuild/m3/w7-preview/today/test/package.test.cjs \
    rebuild/m3/w7-preview/today/test/view.test.mjs
ℹ tests 189
ℹ pass 189
ℹ fail 0
```

per file:

```
adapter : pass=20 fail=0     design  : pass=11 fail=0     package : pass=10 fail=0     view : pass=23 fail=0
copy    : pass=33 fail=0                                            -> today   64 pass 0 fail, UNCHANGED
                                                                       + copy   33 pass 0 fail, new
gym     : pass=64 fail=0     checkin : pass=28 fail=0                  gym 64 / checkin 28, UNCHANGED
```

```
> node rebuild/m4/spec/native-carriers-package.cjs --ci
NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and independent acceptance remain separate
(exit 0)

> node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
ℹ tests 22
ℹ pass 22
ℹ fail 0
(exit 0)
```

Bar item 2, met: every existing today / gym / check-in test passes with the SAME count as the base
(64 / 64 / 28 = 156); native-carriers `--ci` PASS; A0 host 22/22 unchanged.

### THE BUILD

```
> node rebuild/m3/w7-preview/today/build.mjs
A1 TODAY BUILD PASS: 3 assets; 94 pinned inputs (13 engine, 12 client); approved design pinned; 68 bound classes;
2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference;
no em/en dash in any text the athlete can see (904 frozen-source strings carry one and reach the screen only through
plainCopy; 1 harvested approved term(s) dash-normalised)
```

(93 pinned inputs at the base; the 94th is `plain-copy.cjs`.)

### THE THREE REAL-BROWSER CHECKS, msedge on this PC

`W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, after a build. Each one now sweeps the
rendered DOM (text nodes, `placeholder` / `title` / `aria-label` / `alt` / `value`, and the tab title) at every state
it walks, through `dash-check.mjs`.

```
> node rebuild/m3/w7-preview/today/browser-check.mjs
A1 TODAY BROWSER CHECK PASS — ... no em/en dash in the rendered DOM of 11 screen states (DECISIONS:114):
Today, before a weigh-in, Today, with a reading recorded, Today, reloaded with a reading, Today, with the engine's
spike note beside the reading, the weigh-in sheet, refusing an impossible weight, Today, after a real reload, Today,
on a genuinely new page, Why this plan, the nutrition entry, the coach entry, the recovery check-in
(exit 0)

> node rebuild/m3/w7-preview/today/gym-check.mjs
A2 GYM BROWSER CHECK PASS — TWO TRAINING DAYS across three REAL process kills. ...
No em/en dash in the rendered DOM at any of the 12 states above (DECISIONS:114).
(exit 0)

> node rebuild/m3/w7-preview/today/checkin-check.mjs
A3 CHECK-IN BROWSER CHECK PASS — ... no em/en dash in the rendered DOM at any of the 8 states walked (DECISIONS:114).
(exit 0)
```

31 real-browser screen states in total, all dash-free, all measured in msedge on this PC. Everything those three
checks asserted before this brief they still assert; the only expectation changes are the three swept strings in §2.

One state is deliberately NOT swept, and `browser-check.mjs` says so in a comment: the headline layout sweep writes
the engine's RAW titles into the slot by hand, bypassing the page's own binding in order to measure the worst-case
layout. Four of those 15 engine titles carry a dash. The reloaded page immediately after it IS swept, and
`copy.test.mjs` proves every one of the 15 titles survives `plainCopy` with every word intact.

---

## 6. THE NEW TEST (bar item 1)

`rebuild/m3/w7-preview/today/test/copy.test.mjs`, 33 tests, `node --test`, no browser needed, so it runs on both CI
runners. It proves, in this order:

1. the normaliser on the brief's own worked examples; on text with no dash (returned character for character); on a
   minus sign and a hyphen (untouched); on `null`/`undefined`; and on three shapes it must REFUSE
   (`a—b`, `endpoints—no bounce`, `min–max`) with `AI_DASH_IN_UI` and the slot name;
2. the engine's whole headline vocabulary, read out of `rebuild/engine` at test time: at least four titles really do
   carry a dash, and every title survives `plainCopy` with every word still present;
3. the built page: `scanBuiltAssets` finds zero offences, and independently of the guard the markup and the
   stylesheet outside their comments and the tab title contain zero dashes, while the frozen prose is still in the
   bundle (>100 admitted literals);
4. RED FIRST on the build: a dash planted in `index.shell.html`'s title, and a dash planted in a string
   `today-app.cjs` owns, each stop `buildToday()` with `AI_DASH_IN_BUILD`; the offence names the module; each plant
   is restored byte for byte in a `finally` and the restoration is asserted; the build is clean again afterwards.
   Plus: the guard throws `AI_DASH_GUARD_BLIND` on a bundle it cannot attribute, and it catches an escaped `—`;
5. RED FIRST on the screen sweep itself: a dash planted in a rendered text node, and one planted in a `placeholder`,
   are both caught;
6. every screen state, over the same real stack the other today tests use (the encrypted repository over
   fake-indexeddb, the accepted T2 stage, the accepted host):
   * Today empty; Today with the 191.7 reading whose ENGINE note really is `spike — damped in trend`, asserted to
     land as `spike: damped in trend` with the note still whole; the plan explanation (the engine writing at length,
     >400 characters); the two unwired entries; all five workout states (active, finished, unfinished, refused, no
     host); all four check-in states on Today; the weigh-in sheet and both its refusals; a device with no store;
   * the gym card: the active set with the engine's prescription reason, the effort refusal, every open disclosure,
     the saved set, every remaining set through to the finish screen, the finished workout, and a refusal from the
     accepted layer (`WORKOUT_SPLIT_NOT_IN_FORCE`);
   * the check-in: the blank sheet, the sleep record offered for confirmation, every conditional branch open at once,
     the form bound refusing in words, and the recorded read-back both in place and reopened;
7. that `rebuild/engine` is untouched and still full of dashes, that every word of a dashed sentence survives the
   rewrite, and that exactly one harvested approved term is dash-normalised.

**CI enumeration (bar item 1's escape clause, used).** `.github/workflows/rebuild.yml` is NOT in this brief's custody
and does not glob: its step `A1/A2 — the rebound Today page and the gym card` names five files by hand
(`adapter`, `design`, `gym`, `package`, `view`). `checkin.test.mjs` is already absent from it, which is a
pre-existing residual recorded on the A3/C4 lines and riding the B-NTC re-seal per DECISIONS:117 (4).
`copy.test.mjs` is in the same position: **it needs the next `rebuild.yml` re-seal to be enumerated**, and until then
it is run locally. It was run locally for this report (33/33 above), and the three browser checks that carry the
real-browser half were run locally too. Nothing in `.github` was edited.

---

## 7. WHAT I COULD NOT DO, AND WHAT THE REVIEWER SHOULD PRESS ON

1. **`rebuild.yml` cannot enumerate `copy.test.mjs` from this branch** (custody). Recorded above; it needs the next
   re-seal. Until then the file is green only locally.
2. **The build guard's scope is a reading, not a literal zero.** §4 states exactly what is scanned and what is
   exempt, and why a literal byte-level zero over `app.js` is unsatisfiable while `rebuild/engine` is frozen and
   bundled. If the reviewer reads bar item 1 differently, the guard is one function in `plain-copy.cjs` and the
   change is small; say so.
3. **The empty sleep-hours placeholder** (§2) is a judgement call. It is the one place where a visible mark from the
   approved design disappears rather than being reworded. Disagree if it reads worse.
4. **The render boundary refuses rather than guesses**, and a refusal inside `renderToday` would surface as
   "Today could not open on this device". The evidence that no reachable string can trigger it is in §4 (1226 dashed
   literals surveyed; the 14 hard ones are in `migrate.cjs`, which the build forbids from the bundle, and in two
   `sleep.cjs` coach-card sentences Today does not render). It is evidence, not a proof: a future engine package that
   puts a word-joined dash into `move.title` or `statusFace.cause` would take the screen down. The alternatives were
   (a) silently mangling the engine's meaning or (b) showing the character the owner banned; I chose the loud one,
   and the brief's amendment asks for a refusal. This is the decision most worth a second opinion.
5. **The last-chance boot handler is the one place the refusal is softened** (§4): an unrewritable cause is dropped
   from the screen and logged to the console instead of blanking the page.
6. **`gym-model.mjs` and `checkin-model.mjs` compose text but own no dashed string**, so neither needed a copy edit;
   everything they compose is normalised by the view that renders it. Checked by the literal survey, not assumed.
7. **Not covered by this brief**: `rebuild/slice/pwa` (A5's manifest and shell), `rebuild/lanes/c/dad-first-run`
   (A4 inherits both refusals after rebasing, per DECISIONS:117 (1)), `rebuild/coach`, and every screen outside
   `rebuild/m3/w7-preview/today/**`. No CI run on ubuntu-latest has happened yet: the counts above are Windows only.
   CI green on both runners is the reviewer's and the integrator's gate, not something this report can claim.

---

## 8. RULES OBSERVED

No token or secret printed, logged or committed. Nothing under `ledger/`, `rebuild/conform/private/` or
`src/history.js` was read, copied or printed. No `package-lock.json` change. No merge, no push to `main`. Commits are
on `rebuild/polish-p1` only. `work/t2-client-core-pm` and every other worktree were left untouched; all work happened
in `work/pm-p1`, whose `node_modules` are junctions to the CI-faithful `earned-ci` tree (gitignored;
`git status --porcelain` clean apart from the tracked changes above).
