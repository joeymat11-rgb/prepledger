# P1 REVIEW — NO AI DASHES IN THE UI

FINAL VERDICT: REJECT at f06631b48cd669528cf03811bc5801c21839ca94
**SUPERSEDED BY ROUND 2 (at the end of this file): FINAL VERDICT: ACCEPT at
9dc0bbd296e47803b8e2faaa6a8f5f5f68df9ab6.** Round 1 is kept below exactly as it was written, because the
round-2 obligations only make sense beside the findings that produced them.

Reviewer: independent Opus, did not build this. Authority DECISIONS:114 (1), 116, 117 (1); LANES.md screens tier
(one independent reviewer, author != reviewer, CI green on BOTH runners). Brief `rebuild/slice/P1-NO-DASHES-BRIEF.md`
including its Amendment. The builder's `rebuild/slice/P1-REPORT.md` was read as a hypothesis and every line of the
acceptance bar was executed here, on the owner's Windows PC, in a fresh detached worktree
`work/pm-review-p1` at origin/rebuild/polish-p1, `node_modules` junctioned from `earned-ci` (no install,
no lockfile change, `git status --porcelain` empty before and after every mutant).

**The REJECT is for ONE reason: CI is RED on both runners at this exact head sha, and this branch is what turned it
red.** Everything else in this change is sound, and the substance of the sweep is better evidenced than the report
claims. The finding is Finding 1; Findings 2 and 3 are smaller obligations; 4 to 11 are confirmations and
disagreements that do not block.

---

## THE SUMMARY OF WHAT I RE-RAN

| bar item | result |
|---|---|
| 1. copy.test.mjs exists, builds the page, sweeps every state | PASS, 33/33, re-run here |
| 2. existing counts unchanged; native-carriers --ci; A0 host 22/22 | PASS, all reproduce exactly |
| 3. design.cjs dash-normalised harvest, one term, the rest byte-for-byte | PASS, proved red by two mutants |
| 4. every before -> after string re-read against the code | PASS with two disagreements (Findings 2, 6) |
| 5. nothing outside custody changed | PASS |
| 6. this file | done |
| Amendment 7. build refuses; render boundary refuses | PASS, proved by five mutants |
| Amendment 8. design.cjs harvest is P1's to land | PASS |
| LANES.md tier gate: **CI green both OS** | **FAIL — Finding 1** |

---

## 1. BLOCKING — CI is red on both runners at the head sha, and the base was green

```
> node work/lane-c/tools/ci-status.js rebuild/polish-p1 f06631b48cd669528cf03811bc5801c21839ca94
f06631b rebuild                      completed    failure 34656084030 2026-09-11T22:56:12Z
   job rebuild-public (windows-latest) failure A5 — the PWA shell's lockfile-only suites
   job rebuild-public (ubuntu-latest) failure A5 — the PWA shell's lockfile-only suites
f06631b pipeline                     completed    success 34656084024 2026-09-11T22:56:12Z

> node work/lane-c/tools/ci-status.js rebuild/t2-client-core 5c6766eda6f74f638ff7e3b6f5d71a323341ac27
5c6766e pipeline                     completed    success 34652896905 2026-09-11T22:11:39Z
5c6766e rebuild                      completed    success 34652896956 2026-09-11T22:11:39Z
```

The base this branch declares is GREEN on both workflows. The branch head is RED on `rebuild`, on BOTH runners,
and the failure is caused by this change. Reproduced locally, in my worktree, at the head:

```
> node --test rebuild/slice/pwa/test/pwa.test.cjs rebuild/slice/pwa/test/workflow.test.cjs
EXITCODE=1
not ok 34 - the built page becomes installable: a manifest, an icon, a worker and the preflight
  expected: true
  actual: false
# tests 43
# pass 42
# fail 1

> node --test rebuild/slice/pwa/test/package.test.cjs
EXITCODE=1
not ok 9 - A1's own package is untouched: three assets, its own folder, its own names
  error: '<title>Earned — Today</title>'
# tests 10
# pass 9
# fail 1
```

The cause, read out of the two files:

* `rebuild/slice/pwa/test/pwa.test.cjs:630` — `assert(html.includes("<title>Earned — Today</title>"));`
  in the test "the built page becomes installable...", asserting over A5's `installableHtml(A1_SHELL, ...)`, where
  `A1_SHELL` is read from `rebuild/m3/w7-preview/today/index.shell.html`.
* `rebuild/slice/pwa/test/package.test.cjs:189` — `for (const marker of ["<title>Earned — Today</title>", ...])`
  in the test "A1's own package is untouched...", asserting the same title in A1's built `index.html` AND in A5's
  emitted site.

A5 pins P1's tab title **as a literal, in two places**, precisely to catch an upstream edit to A1's shell — and it
did its job. Two workflow steps go red: `A5 — the PWA shell's lockfile-only suites` and
`A5 — the built deploy folder itself`.

This is not a custody violation: P1 changed no file outside `today/**`. It is a dependency the brief did not
anticipate and the builder did not look for. But the tier gate is CI green on both runners, and it is not met, so
the branch cannot be integrated as it stands and `PR-READY` on the STATUS line is not true.

**PROOF OBLIGATIONS (do not fix in this review; a PM ruling is needed first because the fix is outside P1 custody):**

1. Get a custody ruling for `rebuild/slice/pwa/test/pwa.test.cjs` and `rebuild/slice/pwa/test/package.test.cjs`
   (or hand the two lines to A5's lane), then change both pins from `<title>Earned — Today</title>` to
   `<title>Earned: Today</title>`. Do NOT loosen the assertion to a substring that no longer pins a title — its
   whole purpose is to fail when A1's shell moves.
2. While those two files are open, add to each the same rule this brief lands elsewhere: assert the emitted
   installable HTML carries no U+2013 and no U+2014 outside a comment. A5 ships the same page; the owner's rule
   does not stop at A1's folder. (If that is judged out of scope, say so in the report; do not leave it unsaid.)
3. Re-run and paste, at the new head sha:
   `node --test rebuild/slice/pwa/test/pwa.test.cjs rebuild/slice/pwa/test/workflow.test.cjs` (expect `# fail 0`)
   and `node --test rebuild/slice/pwa/test/package.test.cjs` (expect `# fail 0`).
4. `node work/lane-c/tools/ci-status.js rebuild/polish-p1 <new head sha>` must show BOTH `rebuild` and `pipeline`
   completed/success at that sha before this goes to the integrator.


---

## 2. The sweep introduced a copy defect in the last-chance status line

`today-entry.mjs`, the `boot().catch` handler. Before this brief:

```js
status.textContent = "Today did not open: " + cause + ". Nothing was recorded.";
```

After:

```js
let cause = "";
try { cause = " " + plainCopy(raw, "boot-failure"); } catch (_) { console.error(raw); }
...
if (status) status.textContent = "Today did not open." + cause + " Nothing was recorded.";
```

`cause` already carries its own leading space, so the concatenation runs the cause into the next sentence with no
stop after it. Executed, with the real `plainCopy`:

```
[plain cause]      status : "Today did not open. IDB_OPEN_FAILED Nothing was recorded."
[plain cause]      BEFORE : "Today did not open: IDB_OPEN_FAILED. Nothing was recorded."
[rewritable cause] status : "Today did not open. T2 lease not found: sign in again Nothing was recorded."
[rewritable cause] BEFORE : "Today did not open: T2 lease not found — sign in again. Nothing was recorded."
[refused cause]    status : "Today did not open. Nothing was recorded."
```

That is user-facing text on the one screen an athlete sees when the app will not open, and it reads worse than what
it replaced. The host line (`"...Nothing was changed or recorded." + cause`) is fine; only the status line is wrong.

**PROOF OBLIGATION.** Make the status line punctuate the cause, e.g.

```js
if (status) status.textContent = "Today did not open." + (cause ? cause + "." : "") + " Nothing was recorded.";
```

and prove it with a unit assertion in `copy.test.mjs` over the three cases above (a plain cause, a rewritable cause,
a refused cause), pasting the three resulting strings.

---

## 3. §2 of the report undercounts the dashed literals it says it surveyed

The report: *"The literal survey after the sweep finds 18 dashed string literals still in `today/**`."*

My own survey, running the builder's own `scanJavaScript` over every `.cjs`/`.mjs` under `today/**`:

```
DASHED STRING LITERALS STILL IN today/** SOURCE: 116
```

18 is the count in the NON-TEST modules only (`browser-check.mjs` 5, `gym-check.mjs` 8, `checkin-check.mjs` 4,
`serve.mjs` 1 = 18). The other 98 are in `test/`: test NAMES, assertion messages, and the deliberate dash fixtures
`copy.test.mjs` and `checkin.test.mjs` need to do their job.

The conclusion the report draws is still correct — I read all 116 and **none is user-facing and none is bundled** —
but the number as written is wrong for the scope it names.

**PROOF OBLIGATION.** Correct the sentence in §2 to say "18 in the non-test modules of `today/**` (116 including
`test/`, all of them test names, assertion messages or deliberate dash fixtures)", or re-state the scope.

---

## 4. The rule itself — executed independently, and it holds

**Source.** My own scan of all 30 files under `today/**` found 376 lines carrying U+2013/U+2014. I read every one.
Every single one is a code comment, a `console.log`, an assertion message, a test name, a regex character class
(`plain-copy.cjs`, `dash-check.mjs`, `copy.test.mjs`) or a deliberate test fixture. **Not one user-facing string
literal, and not one dash in rendered markup, survives in `today/**`.**

**Built assets** (`.tmp/w7-today-dist`, after `node rebuild/m3/w7-preview/today/build.mjs`):

```
index.html: bytes=18876   rawDash=2  escapedDash=0     dashOutsideComments=0
styles.css: bytes=175051  rawDash=2  escapedDash=0     dashOutsideComments=0
app.js:     bytes=1339141 rawDash=78 escapedDash=1192  dashOutsideComments=78
```

All 78 raw dashes in `app.js` are in bundled comments (I printed and read all 69 lines that carry them). The 1192
escaped `\u2014`/`\u2013` are inside string literals. I attributed every one of them with the guard's own scanner:

```
banners=101  ownedBanners=15  literals=8937  bareDash=0
359  rebuild/engine/writers.cjs        280  rebuild/engine/sleep.cjs
 68  rebuild/engine/today.cjs           60  rebuild/engine/energy.cjs
 55  rebuild/engine/policy.cjs          21  rebuild/engine/earn.cjs
 19  rebuild/engine/volume.cjs          16  rebuild/engine/constants.cjs
 15  rebuild/engine/progression.cjs      7  rebuild/client/copy.cjs
  3  rebuild/engine/plan.cjs             1  rebuild/m3/w6/local/today-bindings.mjs
dashed literals total=904
```

**Zero of the 904 come from a module `today/` owns.** That matches the build line's `904` exactly, and it is the
independent confirmation the report's §4 needed.

**The three msedge checks and `dash-check.mjs`**, re-run here with
`W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` after a build:

```
browser-check.mjs  EXITCODE=0  "...no em/en dash in the rendered DOM of 11 screen states (DECISIONS:114)..."
gym-check.mjs      EXITCODE=0  "...No em/en dash in the rendered DOM at any of the 12 states above..."
checkin-check.mjs  EXITCODE=0  "...no em/en dash in the rendered DOM at any of the 8 states walked..."
git status --porcelain: (empty)
```

`dash-check.mjs` sweeps text nodes, `placeholder`/`title`/`aria-label`/`alt`/`value`/`aria-description`, and
`document.title`. It does not reach into un-cloned `<template>` content — correctly, because the build-time HTML
scan covers the raw markup including the templates, and the two are complementary rather than redundant.

Cosmetic: `browser-check.mjs`'s PASS line says "11 screen states" and then lists twelve comma-separated names —
one state name ("Today, before a weigh-in") itself contains a comma. The count is right; the list reads as off by
one. Worth a separator that is not a comma. Not an obligation.

---

## 5. The build guard's scope — I judge it satisfies Amendment item 7, and it cannot be silently weakened

The scope: built HTML and CSS **outside comments**; built JS **string and template literals attributed by esbuild's
`// <path>` banner to a module under `rebuild/m3/w7-preview/today/`**; escapes decoded first; regex literals stepped
over; comments and frozen-source prose exempt and the latter counted on the build line.

I accept this reading. A literal byte zero over `app.js` is unsatisfiable while `rebuild/engine` is frozen and
bundled (the base commit's own `app.js` already carried dashes in bundled comments), the brief exempts comments by
name, and the brief's own "How to rewrite" clause says engine prose is normalised at the render boundary rather than
edited. The guard also runs **before any byte is written** — I confirmed that directly: on a refused build the
previous `dist` was left in place untouched.

What I planted, to see whether it can be weakened (every plant restored byte-for-byte, tree clean after each):

* a dash in an OWNED HTML file (`index.shell.html` title) — refused, `AI_DASH_IN_BUILD`, naming `index.html`;
* a dash in an OWNED rendered template string (`today-app.cjs` `NOT_WIRED`) — refused, `AI_DASH_IN_BUILD`, naming
  `a string literal of rebuild/m3/w7-preview/today/today-app.cjs`;
* `OWNED` repointed at a path that does not exist — refused, `AI_DASH_GUARD_BLIND`, exactly as designed. The guard
  cannot be turned off by breaking its attribution; it fails loud.

**The one mutant that survived, and why it is not a hole.** A dash planted in a today-owned literal that is NEVER
RENDERED AND NEVER REFERENCED (`const P1_PROBE_A = "probeA — never rendered";` in `today-model.cjs`) built clean.
I chased it rather than reporting it:

```
CASE A (unreferenced const): build exit=0   probeA in bundle? false
CASE B (exported const):     build exit=1   A1 TODAY BUILD FAIL: AI_DASH_IN_BUILD: 1 em/en dash(es) ...
                                            app.js: a string literal of .../today-model.cjs: "probeB — never rendered"
```

esbuild tree-shakes the unreferenced constant; it never enters the bundle, so there is nothing to catch and nothing
an athlete could ever read. The moment the same literal actually ships (exported), the guard refuses it by name.
The guard is byte-level over every owned literal that ships, rendered or not. Correct as built.

Note for the record: a dash planted in a *rendered text node* of `screens.template.html` is caught by
`COPY-BINDING FAIL` (the design binding) before `AI_DASH_IN_BUILD` gets to it. Still a refused build; the dash guard
is proved on the HTML path by the `index.shell.html` plant instead.

---

## 6. plainCopy fail-closed — reproduced, and NOT blocking, on evidence tighter than the report's

The mechanism is real. I planted a word-joined dash in the frozen engine string the page actually renders
(`rebuild/engine/writers.cjs`, `spike — damped in trend` -> `spike—damped in trend`, 2 occurrences) and ran
`copy.test.mjs`:

```
EXIT 1 -- MUTANT KILLED
  not ok 2 - with a reading whose ENGINE note carries a dash
  error: 'AI_DASH_IN_UI: a dash this page cannot rewrite reached the screen at morning:
           "This morning ✓ 191.7 lb · spike—damped in trend"'
  code: 'AI_DASH_IN_UI'   name: 'AiDashRefused'
  not ok 8 - P1 — Today renders every state it can reach without a dash
  # pass 31   # fail 2
git status: ""
```

That throw is inside `put()` inside `renderToday()`, which `mountToday()` calls on mount, which `boot()` calls, so
in the page it lands in `boot().catch` and the athlete gets "Today could not open on this device." The report is
honest about this; the question the brief puts to me is whether any REACHABLE engine text can trigger it.

**I did not spot-check the 14. I surveyed the bundle.** The builder surveyed 1226 literals across the source tree,
including `rebuild/engine/migrate.cjs`, which `build.mjs` FORBIDS from the graph. The only survey that decides
reachability is over what actually ships, so I ran `plainCopy` over every dashed literal in the built `app.js`, both
as written and with `${...}` holes filled with a figure, a word, a decimal and the empty string:

```
dashed literal occurrences in bundle: 904
distinct dashed (module,text) pairs:  881
REFUSED under every filling:            2
```

**Two**, not fourteen. Both in `rebuild/engine/sleep.cjs`, and I read both in full:

1. the `id: "whoosh"` / `t: "WHOOSH SIGNATURE"` LAB card's long explainer (`sleep.cjs:398`), refused on
   `min–max` (a word range, which ": " would genuinely misread);
2. a template-literal fragment of a coach-card / "the desk's receipts on TRAIN" sentence, where `"—"` is used as a
   VALUE between interpolations.

Neither is in a slot Today renders. Today reads `nowModel.move.title/body`, `marchingOrder.why`,
`statusFace.cause`, `calorieTarget.why`, `proteinTarget.why`, the reading note, and the workout title — I re-read
`renderToday` line by line to confirm the list. Both refused strings belong to the lab/coach shelves, which this
page does not mount.

**So: no reachable path blanks Today at this commit. NOT BLOCKING.** The risk the report names is real but future:
a later engine package that puts a word-joined dash into a rendered slot takes the whole screen down rather than one
line of it.

**Disagreement, non-blocking.** The report says the alternatives were "(a) silently mangling the engine's meaning or
(b) showing the character the owner banned". There is a third the report does not consider: refuse per SLOT, not per
SCREEN — catch `AiDashRefused` in `put()`/`tell()`, write the slot's existing `NOT_AVAILABLE` fallback (or leave it
blank, as `recovery-state` already does), and `console.error` the offending text. The athlete then loses one line
instead of the whole of Today, and the owner's rule still holds on screen because the character never renders. I
would take that trade. This is a judgement call, not a defect: recommended, not required.

---

## 7. design.cjs — the harvest is still enforced byte-for-byte everywhere else

The normalisation is one term, and I proved that number is not a hole by mutating in both directions:

* mutated one harvested LABEL on the shipped screen (`hours asleep, approximately` -> `hours asleep, roughly`):
  `checkin.test.mjs` went red —
  `APPROVED-RECOVERY FAIL: the approved label "hours asleep, approximately" is missing from the shipped screen`;
* reverted the dash-normalised placeholder comparison in `design.cjs` to byte-for-byte:
  `checkin.test.mjs` went red —
  `APPROVED-RECOVERY FAIL: the approved placeholder "—" is missing from the shipped screen`;
* killing `plainCopy` outright produced the SAME `APPROVED-RECOVERY FAIL`, which is the right coupling.

Harvest sizes hold at 7 placeholders / 12 options / 10 labels / 5 legends / 12 choices (`checkin.test.mjs`, 28/28).
The normalisation is applied to the value on BOTH sides of the comparison and only removes a dash, so it cannot let a
different word through. Bar item 3 and Amendment item 8: met.

---

## 8. The softened last-chance boot handler — it hides no refusal the athlete needs

Executed above (Finding 2). When `plainCopy` refuses the cause, the screen still reads "Today could not open on this
device. Nothing was changed or recorded." and the status line still reads "Today did not open. Nothing was
recorded."; only the machine's own sentence is dropped, and it is written to `console.error`. The refusals an athlete
can act on — `RESTORE_REQUIRED (<code>)` and the `failures` list — are written INSIDE `boot()`, not in the catch, so
they are unaffected by the softening. I accept the softening. The only thing wrong here is the punctuation
(Finding 2).

---

## 9. THE MUTANT TABLE

Every mutant applied to a real file in my worktree, run, then restored from the original bytes in a `finally`, with
`git status --porcelain` asserted empty after each one. 13 mutants; 12 killed; the one survivor is explained in
Finding 5 and is correct behaviour.

| # | mutant | command | result | what caught it |
|---|---|---|---|---|
| M1 | kill the normaliser (`plainCopy` returns its input) | `node --test .../copy.test.mjs` | KILLED, exit 1 | `not ok 2/3/4`; also `APPROVED-RECOVERY FAIL` |
| M2 | kill the build guard (`assertNoAiDashesInAssets` -> no-op) | `node --test .../copy.test.mjs` | KILLED, exit 1 | `not ok 4/5/6`, `# fail 3` |
| M3 | kill the render-time refusal in `today-app.put()` | `node --test copy.test.mjs view.test.mjs` | KILLED, exit 1 | `not ok 1/2/3/5` in copy.test; view.test also red |
| M4 | plant a dash in the tab title (`index.shell.html`) | `node .../build.mjs` | KILLED, exit 1 | `AI_DASH_IN_BUILD: ... index.html: markup outside a comment` |
| M5 | plant a dash in a rendered text node (`screens.template.html`) | `node .../build.mjs` | KILLED, exit 1 | `COPY-BINDING FAIL: "No — answer it here" is not in the approved references` |
| M6 | plant a dash in a RENDERED owned literal (`NOT_WIRED`) | `node .../build.mjs` | KILLED, exit 1 | `AI_DASH_IN_BUILD: ... a string literal of .../today-app.cjs: "— not wired yet"` |
| M7 | plant a dash in an owned literal that is never rendered AND never referenced | `node .../build.mjs` | SURVIVED, exit 0 | **correct**: esbuild tree-shakes it, `probeA in bundle? false` |
| M7b | the same literal, EXPORTED so it really ships | `node .../build.mjs` | KILLED, exit 1 | `AI_DASH_IN_BUILD: ... "probeB — never rendered"` |
| M8 | silently weaken the guard scope (`OWNED` points nowhere) | `node .../build.mjs` | KILLED, exit 1 | `AI_DASH_GUARD_BLIND: app.js carries no module banner for ...` |
| M9 | mutate a harvested approved LABEL on the shipped screen | `node --test .../checkin.test.mjs` | KILLED, exit 1 | `APPROVED-RECOVERY FAIL: the approved label "hours asleep, approximately" is missing` |
| M10 | revert the dash-normalised harvest to byte-for-byte | `node --test .../checkin.test.mjs` | KILLED, exit 1 | `APPROVED-RECOVERY FAIL: the approved placeholder "—" is missing` |
| M11 | strip `copy.test.mjs` of every assertion, then plant a rendered dash | `node .../build.mjs` | KILLED, exit 1 | `AI_DASH_IN_BUILD` — the build guard is independent of the new test |
| M12 | word-joined dash in the ENGINE string Today renders (`writers.cjs`) | `node --test .../copy.test.mjs` | KILLED, exit 1 | `AI_DASH_IN_UI ... at morning` (Finding 6) |

`git status --porcelain` after the last mutant: empty. Final rebuild after the battery: `A1 TODAY BUILD PASS`.

M11 is the redundancy check the brief asks for implicitly: with `copy.test.mjs` neutered the build guard still
refuses, and `view.test.mjs` independently asserts the normalised spike note, so the new test is not the single
point of failure for the rule.

---

## 10. COUNTS AND SCOPE — every number in the report reproduces

Scope (bar item 5). `git diff --name-status origin/rebuild/t2-client-core...HEAD` is 20 paths: 18 under
`rebuild/m3/w7-preview/today/**`, plus `rebuild/slice/P1-REPORT.md` (added) and `rebuild/lanes/STATUS.md`
(one line appended, verified by reading the diff hunk: `@@ -67,3 +67,4 @@`, a single `+` line). No engine, no
conform, no m4/spec, no client, no `.github`, no pwa, no lockfile. The declared base
`5c6766eda6f74f638ff7e3b6f5d71a323341ac27` is also the merge-base, so the branch has not drifted. PASS.

Counts, re-run one file at a time with `--test-reporter tap` so the `# pass` / `# fail` lines are verbatim:

```
adapter.test.mjs   # tests 20  # pass 20  # fail 0   EXITCODE=0
checkin.test.mjs   # tests 28  # pass 28  # fail 0   EXITCODE=0
copy.test.mjs      # tests 33  # pass 33  # fail 0   EXITCODE=0
design.test.cjs    # tests 11  # pass 11  # fail 0   EXITCODE=0
gym.test.mjs       # tests 64  # pass 64  # fail 0   EXITCODE=0
package.test.cjs   # tests 10  # pass 10  # fail 0   EXITCODE=0
view.test.mjs      # tests 23  # pass 23  # fail 0   EXITCODE=0
```

today = adapter 20 + design 11 + package 10 + view 23 = **64**, gym **64**, checkin **28** — the base figures the
brief names, unchanged — plus copy **33** new. 189 total, 0 fail. `today/test/` holds exactly seven `*.test.*`
files and all seven are listed. Bar item 2, met.

```
> node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
# tests 22  # pass 22  # fail 0   EXITCODE=0

> node rebuild/m4/spec/native-carriers-package.cjs --ci
EXITCODE=0
NATIVE CARRIERS PUBLIC CI EVIDENCE PASS; the inherited full gate matrix, the private oracle, all FULL gates and
independent acceptance remain separate

> node rebuild/m3/w7-preview/today/build.mjs
EXITCODE=0
A1 TODAY BUILD PASS: 3 assets; 94 pinned inputs (13 engine, 12 client); approved design pinned; 68 bound classes;
2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference;
no em/en dash in any text the athlete can see (904 frozen-source strings carry one and reach the screen only through
plainCopy; 1 harvested approved term(s) dash-normalised)
```

Every figure in §5 of the report reproduces byte for byte on my machine.

**CI enumeration.** `.github/workflows/rebuild.yml:88-89` names five today files by hand
(`adapter`, `design`, `gym`, `package`, `view`). `copy.test.mjs` is NOT among them, and neither is
`checkin.test.mjs`. The report records this accurately and uses bar item 1's escape clause correctly. I record the
consequence plainly: **until the next `rebuild.yml` re-seal, the whole of this brief's new evidence runs nowhere but
a person's laptop.** That is a pre-existing residual (DECISIONS:117 (4)), not a P1 defect, but it means the guarantee
this brief lands is unguarded in CI for now. The build guard in `build.mjs` is the part that does ride CI — through
`package.test.cjs`, which is enumerated — so the build-time half of the Amendment is protected.

---

## 11. EVERY before -> after STRING, re-read against the code

I read all of them in the source, not in the report. The three I disagree with or want on the record:

| file | before -> after | my reading |
|---|---|---|
| `today-entry.mjs` | `"Today did not open: " + cause + ". Nothing was recorded."` -> `"Today did not open." + cause + " Nothing was recorded."` | **DISAGREE — Finding 2.** Reads worse; loses the stop after the cause. Fix as given. |
| `design.cjs` / `screens.template.html` | `No — answer it here` -> `No: answer it here` | **Mild disagreement, non-blocking.** On a button, `No: answer it here` reads like a label with a value. `No, answer it here` is the natural English and is the same length. This string is PREVIEW-owned (checked ABSENT from the approved references), so it is free to reword. Recommended, not required. |
| `screens.template.html` | `placeholder="—"` -> `placeholder=""` | **AGREE, and I pushed on it as the report asked.** There is no word that says "empty number field" without inventing content the design never had, a hyphen would read as a minus in a `type="number"` box, and the field carries its own visible label. The design binding still enforces the other six placeholders byte-for-byte (proved by M9/M10). Keep it. |

Everything else I checked and accept:

* `<title>Earned — Today</title>` -> `<title>Earned: Today</title>` — correct rewrite (and the cause of Finding 1,
  which is A5's pin, not this rewrite).
* `"This morning — not logged yet"` -> `"This morning: not logged yet"` — correct.
* `NOT_WIRED`, `CHECKIN_RECORDED_TODAY`, `CHECKIN_NO_STORE_SHORT`: the leading dash dropped and the word
  capitalised. I verified the claim that each renders ALONE rather than being appended to a label:
  `put(map, name, NOT_WIRED)` for `nutrition-state`/`coach-state` (`today-app.cjs:196` and `:244`) and
  `recoveryState()` returning the string whole (`today-app.cjs:435-439`). Nothing concatenates them, so "Not wired
  yet" / "Recorded today" / "Not available on this device" are correct sentences and read better than the dashed
  fragments. Accept.
* both numeric ranges (`kcal` band, the `lb/week` rate) -> " to " — correct, and `plainCopy` handles the engine's
  interpolated ranges the same way (`+100–150 kcal (~3–5%)` -> `+100 to 150 kcal (~3 to 5%)`, asserted in
  `copy.test.mjs`).
* the three `"...template slot missing — " + name` -> `": " + name` — developer text that can reach the last-chance
  screen; correct to treat as user-facing and correct as rewritten.
* `"...blank means unknown — never none, never zero."` -> `": never none, never zero."` — meaning unchanged.
* the three U+2212 minus signs on the Decrease weight / Decrease reps buttons, deliberately untouched — correct,
  the brief says so explicitly, and `plainCopy` provably leaves U+2212 and hyphen-minus alone.
* the three browser-check expectation updates — they move with the strings and assert nothing less than before.

---

## 12. WHAT WOULD MAKE THIS AN ACCEPT

1. Finding 1 (blocking): the two A5 title pins, the custody ruling to touch them, and `rebuild` + `pipeline` both
   completed/success at the new head sha on both runners.
2. Finding 2 (blocking on quality, trivial to fix): punctuate the last-chance status line, with an assertion.
3. Finding 3 (report only): correct the "18 dashed string literals" sentence.

Nothing else needs to change. The mechanism this brief lands — one normaliser, one build-time refusal, one
render-time refusal, one dash-normalised harvested term, and a real-browser sweep of 31 screen states — is the right
design, is tested red-first, and survived twelve of thirteen mutants for the right reasons. On the substance of the
owner's rule, this is good work; it is the CI gate it trips outside its own custody that sends it back.

---

## RULES OBSERVED

No token or secret printed, logged or committed; `ci-status.js` read the token from the git credential helper and I
never saw or printed it. Nothing under `ledger/`, `rebuild/conform/private/` or `src/history.js` was read, copied or
printed. No `package-lock.json` change, no install. Work confined to `work/pm-review-p1`; no other worktree touched.
Every mutant restored byte-for-byte with `git status --porcelain` asserted empty. This file is the only thing I
commit.

---
---

# ROUND 2 — DELTA REVIEW

FINAL VERDICT: ACCEPT at 9dc0bbd296e47803b8e2faaa6a8f5f5f68df9ab6

Same reviewer, same worktree `work/pm-review-p1`, re-detached onto `origin/rebuild/polish-p1` at 9dc0bbd
(code head 8680e0d). All three round-1 findings are fixed, and fixed better than I asked: the per-slot
containment I offered as a non-binding recommendation was taken as a required change, and the optional copy
note was taken too. Everything below I executed myself.

## R2.1 — Scope of the delta

```
> git log --oneline f06631b..HEAD
9dc0bbd slice + lanes: CI green at the round-2 head, and the STATUS line
8680e0d slice: P1-REPORT.md - Round 2
dd8904a today: fail closed per SLOT, and punctuate the last-chance status line
b54d023 pwa/test: move A5's two title pins to the swept title, and sweep A5's own copy
9bb5620 slice: P1-REVIEW.md - independent review, REJECT at f06631b
```

13 paths touched since f06631b: nine under `rebuild/m3/w7-preview/today/**`, the two A5 TEST files the PM
widened custody to, `rebuild/slice/P1-REPORT.md`, my own `P1-REVIEW.md`, and `rebuild/lanes/STATUS.md`.
Executed, against the base, with everything licensed excluded:

```
> git diff --name-only origin/rebuild/t2-client-core...HEAD -- . \
    ':(exclude)rebuild/m3/w7-preview/today' ':(exclude)rebuild/slice/P1-REPORT.md' \
    ':(exclude)rebuild/slice/P1-REVIEW.md' ':(exclude)rebuild/lanes/STATUS.md' \
    ':(exclude)rebuild/slice/pwa/test/pwa.test.cjs' ':(exclude)rebuild/slice/pwa/test/package.test.cjs'
(no output)
```

Nothing outside the widened custody. No A5 SOURCE file was touched — only A5's two test files, which is exactly
the ruling. PASS.

## R2.2 — Counts

Re-run one file at a time, `--test-reporter tap`, on a clean tree:

```
adapter.test.mjs  # tests 20  # pass 20  # fail 0     design.test.cjs   # tests 11  # pass 11  # fail 0
package.test.cjs  # tests 10  # pass 10  # fail 0     view.test.mjs     # tests 23  # pass 23  # fail 0
                                                  -> today 64, UNCHANGED
gym.test.mjs      # tests 64  # pass 64  # fail 0     checkin.test.mjs  # tests 28  # pass 28  # fail 0
copy.test.mjs     # tests 36  # pass 36  # fail 0  -> 192 total, 0 fail
A0 host           # tests 22  # pass 22  # fail 0
A5 pwa+workflow   # tests 44  # pass 44  # fail 0
A5 built folder   # tests 11  # pass 11  # fail 0
native-carriers --ci   EXITCODE=0   NATIVE CARRIERS PUBLIC CI EVIDENCE PASS
A1 build               EXITCODE=0   A1 TODAY BUILD PASS ... (904 frozen-source strings ...; 1 harvested
                                    approved term(s) dash-normalised)
git status --porcelain: (empty)
```

192 with copy 36, pwa+workflow 44/44, built-folder 11/11, A0 22/22 — every number the coordinator named.

*Reviewer's own error, recorded so nobody chases it.* An earlier pass of mine ran `node --test` with no file
arguments from the repository root (a PowerShell `$args` collision in my harness), which walked the whole
repository and left `rebuild/m4/spec/acceptance-load-writes.json` modified. With that file dirty,
`native-carriers --ci` exits 1 and `copy.test.mjs` reported 9 failures. After `git checkout -- .` and a clean
rebuild, both are green as listed above and the tree stays clean through every later run. Nothing in this
branch caused it. Worth one line for the integrator: these `rebuild/m4/spec/*-load-writes.json` ledgers are
rewritten by a FAILING suite, so a red run can poison the next `native-carriers --ci`; always re-check from a
clean tree.

## R2.3 — The three msedge checks

```
browser-check.mjs   EXITCODE=0  "...no em/en dash in the rendered DOM of 11 screen states (DECISIONS:114)..."
gym-check.mjs       EXITCODE=0  "...No em/en dash in the rendered DOM at any of the 12 states above..."
checkin-check.mjs   EXITCODE=0  "...no em/en dash in the rendered DOM at any of the 8 states walked..."
git status --porcelain: (empty)
```

31 real-browser states, all dash-free, msedge on this PC, after a build.

## R2.4 — The two A5 pins are corrected, NOT loosened (required check 3)

Both are still LITERAL titles. I proved they are still tripwires by restoring the old em-dash title in
`index.shell.html` and running each A5 suite:

| mutant | suite | result |
|---|---|---|
| old `<title>Earned — Today</title>` | `pwa.test.cjs` + `workflow.test.cjs` | **KILLED**, exit 1: `not ok 34 - the built page becomes installable...` AND `not ok 35 - no em dash and no en dash in anything A5 puts on the athlete's screen` (`AI DASH in A1's shell as A5 reads it`) |
| old `<title>Earned — Today</title>` | `package.test.cjs` | **KILLED**, exit 1, and earlier than expected: `AI_DASH_IN_BUILD: 1 em/en dash(es) in text the athlete can see (DECISIONS:114): index.html: markup outside a comment` — A1's own build guard refuses before A5's pin is even reached |

Both plants restored byte-for-byte; tree clean. The builder went further than my obligation 1 asked and also
took obligation 2: each A5 suite now carries its own no-dash sweep over what A5 actually deploys, each with a
RED-FIRST assertion that one more dash would be caught. I have no objection to the `app.js` exemption in those
sweeps — it is A1's bundle, and A1's own build guard already refuses every A1-owned literal in it.

## R2.5 — Fail closed PER SLOT (required check 4)

The mechanism is `plainOrDrop(value, where, fallback = "")` in `plain-copy.cjs`: it catches ONLY
`error.code === "AI_DASH_IN_UI"`, logs the refusal and the text to `console.error`, and returns the fallback;
anything else it rethrows. I verified all four properties directly, against the real module:

```
DIRECT: plainOrDrop(non-dash thrower)   -> TypeError: not a string          (NOT swallowed)
DIRECT: plainOrDrop(word-joined dash)   -> ""   / with fallback "FALLBACK"  (slot dropped)
DIRECT: plainCopy still throws          -> AI_DASH_IN_UI                    (the refusal is intact)
```

Coverage: `plainOrDrop(` appears at **26** call sites across `today-app.cjs` (11), `gym-app.mjs` (7),
`checkin-app.mjs` (6) and `today-entry.mjs` (2), and **zero** bare `plainCopy(` remains in any of the three
view modules. The one remaining bare `plainCopy(` is in `today-entry.mjs`'s last-chance handler, where the
try/catch is written out explicitly. That is the 27 the builder reports, and it is every DOM write.

The planted-dash test reproduces. `copy.test.mjs` poisons the view DTO's `nowModel.move.title` with
`NOTHING TO FIX—HOLD THE LINE` (a word-joined dash, the shape the normaliser refuses) without editing
`rebuild/engine` — which is precisely how a future engine package would arrive — then asserts every other slot
still carries text, that `kcal-note` is bound exactly as before, that the page does NOT say "could not open",
that no dash is on screen, and that exactly one refusal was logged naming the slot (`instruction`). Four
mutants confirm none of that is decorative:

| mutant | result |
|---|---|
| `plainOrDrop` RETHROWS (containment removed) | **KILLED**, exit 1: `not ok 15 - a refused string costs its own slot, never the whole of Today` + `not ok 16` |
| `plainOrDrop` swallows EVERY error | **KILLED**, exit 1: `not ok 16 - plainOrDrop drops only an AI-dash refusal, and rethrows anything else` — `Missing expected exception (TypeError)` |
| `console.error` removed from `plainOrDrop` (a silent refusal) | **KILLED**, exit 1: `not ok 15` |
| the last-chance status line un-punctuated again | **KILLED**, exit 1: `not ok 14 - the last-chance boot screen punctuates the cause it shows` |

All restored byte-for-byte; `git status --porcelain` empty after each; final rebuild exit 0, tree clean.

**Round-1 Finding 6 is now closed, not merely mitigated.** In round 1 the same poisoned engine string took the
whole of Today down; it now costs one line. The residual I flagged is gone.

## R2.6 — The last-chance status line (required check 5, round-1 Finding 2)

`bootFailureCopy` is now exported and asserted. The three cases, plus a fourth the builder added:

```
plain cause      -> "Today did not open: IDB_OPEN_FAILED. Nothing was recorded."
                    "Today could not open on this device. Nothing was changed or recorded. IDB_OPEN_FAILED."
rewritten cause  -> "Today did not open: T2 lease not found: sign in again. Nothing was recorded."
refused cause    -> "Today did not open. Nothing was recorded."
                    "Today could not open on this device. Nothing was changed or recorded."
already stopped  -> "Today did not open: It did not open. Nothing was recorded."   (no second full stop)
```

That is better than the string it replaced in round 1 and better than the pre-brief original. Finding 2 closed.

## R2.7 — Round-1 Finding 3 (the "18 dashed literals" count)

Corrected in the report. Closed.

## R2.8 — A5's two preflight dashes (required check 6): CONFIRMED, and recorded as an A5-lane residual

My own scan of A5's sources, comments stripped:

```
preflight.html: dashes total=4  outside comments=1
    "...<p><strong>Offline launch</strong> — <span data-pwa="state" role="status">checking this device…</span></p>..."
preflight.js:   dashes total=3  outside comments=1
    "...'All ' + status.total + ' files of this build are stored on this device — everything the launch needs is here.'..."
preflight.css:  dashes total=0  outside comments=0
```

**Exactly one user-facing em dash in each**, exactly as the builder states, and the two A5 suites pin the count
at one each so a third would fail. No other A5 source text file carries a dash outside a comment.

**A5-LANE RESIDUAL, for the PM to brief (not P1's to fix, and correctly not fixed here).** Two strings A5 owns
still put an em dash on the athlete's screen, and the owner's rule ("no ai dashes are allowed in the ui") does
not stop at A1's folder:

1. `rebuild/slice/pwa/preflight.html` — `<strong>Offline launch</strong> — <span data-pwa="state">`
   → suggested: `<strong>Offline launch:</strong> <span data-pwa="state">`
2. `rebuild/slice/pwa/preflight.js` — `"...are stored on this device — everything the launch needs is here."`
   → suggested: `"...are stored on this device: everything the launch needs is here."`

When the A5 lane lands those two, the pins in both suites drop from 1 to 0 and the exemption disappears. Until
then they are pinned rather than hidden, which is the right way to carry a known residual.

## R2.9 — CI at the head (required check 7)

```
> node work/lane-c/tools/ci-status.js rebuild/polish-p1 9dc0bbd296e47803b8e2faaa6a8f5f5f68df9ab6
9dc0bbd pipeline   completed  success  34659085148  2026-09-11T23:42:50Z
9dc0bbd rebuild    completed  success  34659085152  2026-09-11T23:42:50Z

> node work/lane-c/tools/ci-status.js rebuild/polish-p1 8680e0d
8680e0d pipeline   completed  success  34658721425  2026-09-11T23:36:51Z
8680e0d rebuild    completed  success  34658721317  2026-09-11T23:36:51Z
```

Both workflows completed/success at BOTH shas, on both runners. The four run ids match the builder's exactly.
The tier gate that failed in round 1 is met. Round-1 Finding 1 closed.

## R2.10 — What still stands from round 1, unchanged and non-blocking

* `copy.test.mjs` and `checkin.test.mjs` are still not enumerated in `.github/workflows/rebuild.yml` (it names
  five today files by hand). Pre-existing, correctly recorded, rides the next B-NTC re-seal per
  DECISIONS:117 (4). The build-time half of the rule DOES ride CI, through the enumerated
  `rebuild/slice/pwa/test/package.test.cjs`, which now fails on any A1-owned dash — so the branch is not
  defenceless in CI in the meantime.
* `browser-check.mjs`'s PASS line still says "11 screen states" over a comma-separated list containing a state
  name with a comma in it. Cosmetic, no obligation.

## R2.11 — VERDICT

**ACCEPT at 9dc0bbd296e47803b8e2faaa6a8f5f5f68df9ab6.** No proof obligations remain against P1. All three
round-1 findings are closed with executed evidence; the per-slot containment closes the one residual risk I
was most worried about; CI is green on both runners at both round-2 shas; and the A5 preflight residual is
pinned, named, and handed to the right lane. Ready for mechanical integration.

Rules observed as in round 1: no secret printed or copied, nothing read under `ledger/`,
`rebuild/conform/private/` or `src/history.js`, no lockfile change, no other worktree touched, every mutant
restored byte-for-byte with the tree asserted clean.
