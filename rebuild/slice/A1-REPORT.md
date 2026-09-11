# A1 — Today rebound to the approved design, over a real client adapter

Branch `rebuild/slice-a1`, from `rebuild/t2-client-core` @
`fb7a84eba37e8c705374234c8b8c1126b0b6efd6` (A0 host assembly merged, ledger
line 98). Builder: Opus builder (Earned A1). **Candidate, not accepted.** An
independent Opus reviewer plus CI is the acceptance (plumbing/screens tier,
DECISIONS:88). Nothing here is self-accepted.

Node v24.19.0, on Joe's PC. Nothing installed, nothing purchased, no network
use by any test or build — and, after review round 1, none by the page either.
No private folder, no `src/history.js`, no `ledger/`, no
`rebuild/conform/private/` was read. No athlete data printed, no token printed,
nothing deleted. The frozen app is untouched.

`git diff --stat fb7a84e..HEAD` is the whole claim: **A1 adds files and
modifies none.**

---

## 0. Review round 1 — what changed

The independent review of `b7d872a` returned **ACCEPT WITH FIXES (2 blocking)**.
All seven items are applied; both blocking ones are verified in a real browser.

* **F1 (blocking) — the engine's spike label was produced and dropped.** FIXED.
  `applyRead` attaches a note to a reading it damps ("spike — damped in trend",
  "inside your noise — not information"). The adapter carried it; the view never
  rendered it, so 191.7 lb could sit beside a 180.8 lb trend with nothing
  reconciling them. `morningLine()` now prints the engine's note beside the
  reading whenever there is one, verbatim, and prints no separator when there is
  not. Three tests cover it: the view test asserts a spike renders the note and a
  quiet reading renders none (with a control proving the writer really does
  attach one); the adapter test asserts the note reaches the DTO unreworded; the
  browser check asserts it on screen. §8.9 no longer claims the labelling was
  already there — it never was.
* **F2 (blocking) — the single primary action was below the fold.** FIXED.
  Cause: Today was rendering Refinement A's full Today (54px headline, evidence
  grid, bottom note) **plus** Additions C's three entry points. Today now follows
  **Additions C — the authoritative implementation reference — structure for
  structure**: mast, intro, food with the nutrition link, training with the
  recovery link, one trend control, and a bottom with one primary action and the
  coach entry. A's evidence grid and bottom note are gone; they are not in the
  authoritative Today. Measured in Chromium at 390×844:

  | | before the fix | after the fix |
  |---|---|---|
  | pre-weigh-in CTA bottom | 1158 (below the fold) | **798 of 842 — 44px headroom** |
  | post-weigh-in CTA bottom | 1061 (below the fold) | **758 of 842 — 84px headroom** |

  `browser-check.mjs` now asserts the primary action's bounding box is inside the
  scrolling viewport in **both** states and prints the headroom, so a regression
  is a red check and not a judgement call. Nothing was invented: the layout is
  C's, and the two CSS corrections it needs are C's own declared values (§7.10).
* **F5 (non-blocking) — a second vacuous test.** FIXED. The old
  `design.test.cjs:41–45` asserted `changed[0].sha256.length === 64`, which could
  not fail. It is replaced by a test that copies both approved references to a
  temp directory, flips **one byte** ("K"→"k" in "Keep the plan."), and asserts
  `readApproved()` refuses it with `APPROVED-PIN FAIL` — with the untouched copy
  as the control. `readApproved(root)` gained an optional root purely so a test
  can point the real pin at a tampered file.
* **F8 (non-blocking) — impossible weights were recordable.** FIXED.
  `rebuild/client` accepts any finite number as a reading, so 10000, 0 and −5
  were being written as facts and damped into the trend for ever, and the sheet
  showed an empty error because the write had succeeded. The adapter now applies
  an entry-form bound (60–400 lb, one decimal — the same posture and the same
  numbers as the reviewed w7-preview's weigh-in form) and refuses **in words**:
  "A morning weight is recorded between 60 and 400 lb, to one decimal place.
  Nothing was recorded." An empty box still reaches the client so the athlete
  reads the client's own "A weight is required." Nothing is ever refused
  silently, and no entry is ever rounded into range. This is a FORM bound, not a
  new engine or client rule, and §8.9 says so.
* **F9 (non-blocking) — the page fetched Google Fonts.** FIXED. The page now
  references **no remote origin at all**. The two Instrument typefaces are the
  repository's own files, already pinned by sha256 for the phone host in
  `rebuild/m4/workout/fonts/SOURCES.json`, inlined into `styles.css` as
  `@font-face` with `data:` URLs. The font `<link>` is gone; the CSP drops
  `fonts.googleapis.com` and `fonts.gstatic.com` entirely and is now
  `style-src 'self'; font-src data:`. The browser check fails on **any** request
  that is not to the local origin or a `data:` URL, and asserts both faces are
  registered on the document. A5 inherits a page that launches offline.
* **F4 (non-blocking) — the 16px test targeted elements A1 never renders.**
  FIXED, and it was worse than reported: the test's CSS parser did not strip
  comments, so the comment before each `preview.css` rule was swallowed into its
  selector, `el.matches()` threw on the nonsense, the rule was silently skipped,
  and the test was measuring the approved 14px while passing. The parser now
  strips comments first, and an unparseable selector is now an assertion failure
  unless it is a known vendor/pseudo form — a rule can no longer be dropped in
  silence. The test now (a) sweeps every input the page **actually renders** on
  every screen and asserts the one real input (the weigh-in box, 25px) is ≥16px,
  naming it explicitly, and (b) constructs the approved sub-16px fields A3 will
  render (`.followup input`, `.followup select`, `.composer input`, `.hours`,
  `textarea`), asserts the correction raises each to 16px, and asserts with
  `preview.css` removed that the approved reference really does set them below
  16px — so the correction is proved load-bearing.
* **F10 (non-blocking) — "same transaction" claimed more than was proved.**
  FIXED by strengthening the test, not by softening the words. The old assertion
  showed **co-existence** (both records present afterwards) and its message now
  says exactly that. A new test, "the durability rule is all-or-nothing, in both
  directions", executes atomicity: fail the outbox write → **zero** operations
  survive; fail the operation write → zero of both; with no injected failure →
  one of each. §6 states what each proves.
* **F3 (locally tampered op trusted) and F6 (writers-LAST inert)** are left as
  documented limits, at the reviewer's direction — §8.15 and §8.16.

---

## 1. What A1 does, in one paragraph

The Today screen renders the owner-approved 2026-09-08 design, and every figure
on it is either an accepted-engine result or a durable operation in the real
`rebuild/client` log. A morning weigh-in is one all-or-nothing local transaction
(the operation plus its outbox entry); the engine then reads *that operation* —
the accepted `writers.applyRead` replays it onto the synthetic basis — and the
instruction, the calorie band, the protein target and the trend all move because
the engine moved. When the writer damps a reading it says so, and the screen
shows the engine's own words for it. Close the page, reload it, reboot the
machine: the reading is still there and the screen is byte-identical. The gym
card, the nutrition detail, the recovery check-in and the coach are entry points
with the approved visuals and a plain "not wired yet" state; they show no number
they cannot source.

---

## 2. Files added

| file | lines | bytes | sha256 |
|---|---:|---:|---|
| `rebuild/m3/w7-preview/today/browser-check.mjs` | 167 | 9126 | `2d0c845dd28442d8143a7f7e470db316619fb13e421b77fac77d064a23429642` |
| `rebuild/m3/w7-preview/today/build.mjs` | 131 | 6375 | `86857c6c975407daf7f45f997b5ef38a0b4357622ab7950332fa365867872fc0` |
| `rebuild/m3/w7-preview/today/design.cjs` | 172 | 9485 | `ba0ff5e675b9f41f674358a62a44ba62544108c981e270537a46700a7fefc1da` |
| `rebuild/m3/w7-preview/today/index.shell.html` | 32 | 1460 | `e9f22a922022128f6846e00abe8e0fbe087b500567d0747558dffb6ba118b7e5` |
| `rebuild/m3/w7-preview/today/preview.css` | 51 | 2484 | `02efb2c6c12d3399cafd4c7c81de8396d1c2561a1d2af8d6be0982b07f3e6bbd` |
| `rebuild/m3/w7-preview/today/screens.template.html` | 142 | 6982 | `4a743ae345f90f75b375d977410812f774a230daa4dbcc45dbd96736ee53c8bd` |
| `rebuild/m3/w7-preview/today/serve.mjs` | 99 | 4880 | `6483de1d5cf841c1d58bc1f02bea682bf7e03d49fdaff2c1d67075f9b5754174` |
| `rebuild/m3/w7-preview/today/today-app.cjs` | 313 | 14355 | `8ffd6d9976ba3c6bb5c92b60464b4a32afa1c835652f40774f17e02b3eb011b2` |
| `rebuild/m3/w7-preview/today/today-engine.cjs` | 39 | 1969 | `c5e3ed2491ccb3fd50d21260879aab4a6bcc736caef687b2cc0d6fa5b5ba5d1c` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 16 | 653 | `b0b1b6ba36634ceb4d7b024283e2a8916f8960a62cc43424a1d836c2b8a20a45` |
| `rebuild/m3/w7-preview/today/today-model.cjs` | 302 | 14424 | `ba29e631b8b7ff8d249510102f63fd16ca069f033d73db7e9388c7b353ca9346` |
| `rebuild/m3/w7-preview/today/web-storage-backend.cjs` | 126 | 4978 | `3a80b921f9fd9849286c0e95064e4491e45f67a41222a0317dd8f452f0dcf548` |
| `rebuild/m3/w7-preview/today/test/adapter.test.cjs` | 324 | 15693 | `5eff6df05483aa063ed143c693cbaeb7cd800d5959b6be819b6abf7fc662ecc3` |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | 124 | 6789 | `2ef36d9d802f3ba4e5a0ecd0af1abcfcb4ee41c6307c16860f404e44f203331e` |
| `rebuild/m3/w7-preview/today/test/package.test.cjs` | 158 | 8348 | `d1e8b7e51d25569f44a7bed90712f0c46805a08fd5baa41aec3c54d28d230187` |
| `rebuild/m3/w7-preview/today/test/view.test.cjs` | 363 | 18862 | `48e290af4105b01bb700345c720f0c7efa1858801cfc690b26cdb3499a17b9bf` |
| `rebuild/slice/A1-REPORT.md` | — | — | this file |

Every other file in the tree — `rebuild/engine/*`, `rebuild/client/*`,
`rebuild/conform/*`, `rebuild/m4/spec/*`, `rebuild/m4/workout/*`,
`rebuild/m3/w6/*`, `rebuild/m3/w7-preview/*` (the existing preview),
`rebuild/m1/*`, `.github/workflows/*` — is **byte-unchanged**. See §8.2 for the
one place that cost something.

---

## 3. How the PM runs it on the PC

From the worktree root, with Node 24 and the two junctions in place
(root `node_modules`, `rebuild/m3/w6/node_modules`):

```
node rebuild/m3/w7-preview/today/build.mjs
node rebuild/m3/w7-preview/today/serve.mjs
```

Then open **http://127.0.0.1:4178/**. `--port NUMBER` picks a different local
port. Stop with Ctrl+C; the server loads the built files once, so rebuild then
restart it. The page requests nothing over the network, so it also opens with
the machine offline.

### What the screen shows with the synthetic fixture

The fixture is `rebuild/m3/w7-preview/fixtures.cjs` — the invented synthetic
athlete the reviewed preview already uses, unchanged, with its reads truncated
at the day before the fixed synthetic day `2030-02-04`. Nothing about it is
Joe's. On a browser profile that has never opened the page:

```
Earned                                   Monday, February 4

Your plan for today
CLOSE THE BOOKS FIRST
one number, fasted — the trend absorbs the noise so a single
morning never moves a decision

Eat about
2,300 kcal        155 g protein
Today's target 2,262–2,360 kcal
Your full nutrition plan →

UPPER BODY · TODAY
2 exercises · Your set targets are ready
How are you feeling today? →

This morning — not logged yet                             →
Weight trend 180.4 lb · Why this plan?

[ Log the scale                                           → ]
Ask your coach — Your plan, progress and the reasons behind it. →
```

Tap the black button, type a weight, submit. After a weigh-in of 179.4:

```
NOTHING NEEDS YOU
The cut is working — this week's drop is real now, not noise.
Eat about 2,300 kcal · 155 g protein · Today's target 2,278–2,376 kcal
This morning ✓ 179.4 lb
Weight trend 180.1 lb · Why this plan?
[ Start UPPER BODY · TODAY → ]
```

Enter 191.7 instead and the morning line reads
`This morning ✓ 191.7 lb · spike — damped in trend` — the engine's own words for
why the trend barely moved (review F1). Enter 10000 and the sheet stays open
with "A morning weight is recorded between 60 and 400 lb, to one decimal place.
Nothing was recorded." (review F8).

Reload the page, quit the browser, reboot: the reading and every figure above
come back unchanged. The banner beside the phone says "Saved on this device. It
survives a reload, a restart and a reboot."

Every one of those figures is traced in §5. The headline, the explanation
sentence, the marching-order line, the band and the reading note are the
**engine's own strings**; the adapter reworded none of them. `2,300` is the
engine's own midpoint (2,327) shown to the nearest hundred — it coincides with
the prototype's fictional 2,300 by accident, and §6 explains how the tests tell
the difference.

---

## 4. Architecture — what is real, and where each piece came from

```
  athlete taps        rebuild/client                    rebuild/engine
  "Log the scale"  →  createClient(...).weighIn()   →   writers.applyRead()  →  view
                      ONE durable transaction:          replayed over the
                      operation + outbox entry          synthetic basis
                      (or nothing at all)
                            ↓                                 ↓
                      web-storage backend               today/plan/energy/
                      (localStorage)                    progression/sleep/…
                            ↓
                      face().layer1.reads   ← the client's OWN projection of its
                                              reading operations
```

* **Durable local store.** `web-storage-backend.cjs` implements the backend
  interface `rebuild/client/store.cjs` documents — `begin / write / remove /
  commit / rollback / get / keys / clear` — over any synchronous Web Storage. It
  uses the same write-immediately + undo-journal rollback the shipped
  `memoryBackend` uses, which `rebuild/client/README.md` explicitly blesses. On
  the page that storage is `localStorage`; in tests it is an injected equivalent.
  A storage that throws (quota, private browsing) propagates, which is exactly
  how `store.transaction()` detects failure and rolls back.
* **The operation log is the client's, not the adapter's.** The adapter never
  parses the log. It asks `client.face().layer1.reads`, the client's own
  projection of its reading operations (corrections and tombstones included).
* **The engine composition is not a new one.** `today-engine.cjs` takes the
  existing `rebuild/m3/w7-preview/browser-engine.cjs` — the accepted engine's
  unmodified read factories, pinned by that preview's own tests — and registers
  **one** further accepted module on the same table: `rebuild/engine/writers.cjs`,
  registered LAST, exactly the position it holds in `rebuild/engine/index.cjs`
  and in A0's `rebuild/m3/w6/host/engine-runtime-host.cjs`. `seed.cjs`,
  `migrate.cjs`, `merge.cjs` and `index.cjs` stay out, for the reason
  `browser-engine.cjs` already gives. A test asserts `applyRead` on this
  composition is **byte-identical** to `createEngine(...).applyRead` for seven
  weights.
* **The writer does the arithmetic, not the adapter.** The reviewed preview
  recomputed the EWMA trend in adapter code and compared it against the real
  writer in tests. A1 deletes that duplication: the state is built by replaying
  the stored readings through `applyRead`. There is no trend formula in A1, and
  no note text of its own either.
* **The bundle is the phone host's bundle.** `build.mjs` produces the page with
  `rebuild/m3/w6/build-browser.mjs` — the same browser build
  `rebuild/m3/w6/host/build-host.mjs` uses for the phone host — so the
  `node:crypto` boundary (`rebuild/m3/w6/node-sha256-browser.mjs`, allowed only
  for `rebuild/client/ops.cjs` and `plan.cjs`), the authority exclusions and the
  pinned input inventory are the accepted ones. That is also why one build
  output can serve the PC preview and A5's phone host unchanged.
* **The typefaces are the phone host's typefaces.** The two Instrument faces come
  from `rebuild/m4/workout/fonts/`, checked against the same
  `SOURCES.json` sha256/size/`wOF2` pins the W6 browser build enforces, and are
  inlined so the page fetches nothing (review F9).

**Bundle inventory: 38 pinned inputs.** 13 `rebuild/engine` modules (dates,
constants, entered-load, performed, plan, progression, sleep, energy, policy,
today, volume, earn, **writers**), 12 `rebuild/client` modules (the whole core),
the accepted SHA-256 boundary plus `@noble/hashes`, and the 7 A1/preview files.
**Not present:** `seed.cjs`, `migrate.cjs`, `merge.cjs`, `engine/index.cjs`,
`rebuild/engine/test/*`, `rebuild/authority/*` (beyond `canonical.cjs`),
`rebuild/m3/w5/crypto.cjs`, `rebuild/m4/import/*`, `ledger/*`, `src/history.js`.
The build asserts all of that, and asserts that the only third-party code in the
page is `@noble/hashes` — any other dependency fails the build.

---

## 5. Where every figure on the screen comes from

| on screen | source |
|---|---|
| date | the fixed synthetic day, formatted by `Intl` |
| headline instruction | `nowModel(state).move.title` — the engine's own string |
| sentence under it | before a weigh-in `marchingOrder(state).why`, after it `statusFace(state).cause` — both the engine's own strings |
| `2,300` / `kcal` | `calorieTarget(state).mid` rounded to the nearest 100 (§7, decision 3) |
| `Today's target 2,262–2,360 kcal` | `calorieTarget(state).lo` / `.hi`, unrounded |
| `155` / `g protein` | `proteinTarget(state).g` |
| `UPPER BODY · TODAY` | `nowModel(state).workout.title` |
| `2 exercises · Your set targets are ready` | `genSession(state, day, null).ex.length` + approved copy |
| `This morning ✓ 179.4 lb` | the reading the ENGINE adopted for today (§7, decision 5) |
| `· spike — damped in trend` | `state.reads[today].note` — the accepted writer's own note, shown only when there is one (review F1) |
| `Weight trend 180.1 lb` | `nowModel(state).headed.weight` |
| primary button before a weigh-in | `marchingOrder(state).thenText`, first letter capitalised |
| Why this plan? sections | `calorieTarget.why`, `proteinTarget.why`, `statusFace.cause` + `move.body`, the stored reading's date + rate span, the rate's own interval |
| Nutrition: Energy, Protein | the same engine targets |
| Nutrition: Carbohydrate, Fat | **"Not prescribed"** — the engine issues no such target |
| everything else | static copy that occurs verbatim in the approved HTML |

There is no other number anywhere. The template file itself carries **no digit
in any text node** and the build fails if one appears. The weekly rate sentence
that A1 previously showed on Today moved to Why when Today adopted Additions C's
structure (§7.11); it is still engine-sourced and still on screen, one tap away.

---

## 6. Verification — commands executed, and their tails

All on the PC, at the branch head.

| command | result |
|---|---|
| `node --test rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19 pass / 0 fail** (the pinned preview, untouched) |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs …/engine-equivalence.test.cjs` | **22 pass / 0 fail** (A0 still green) |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`**, exit 0 |
| `node rebuild/m3/w6/test/run-current-head.cjs . --all` | **435 pass / 0 fail**, exit 0 |
| `node rebuild/m3/w7-preview/today/build.mjs` | `A1 TODAY BUILD PASS: 3 assets; 38 pinned inputs (13 engine, 12 client); approved design pinned; 40 bound classes; 2 pinned typefaces inlined; no literal figure in the template and no network reference` |
| `node --test rebuild/m3/w7-preview/today/test/{design,adapter,view,package}.test.cjs` | **52 pass / 0 fail** |
| `node rebuild/m3/w7-preview/today/browser-check.mjs` (with `W7_BROWSER_BIN`) | see below |

```
A1 TODAY BROWSER CHECK PASS — mounted, weighed in (This morning ✓ 179.4 lb),
spike note shown, impossible weight refused, survived a real reload and a new
page; primary action inside the 390x844 viewport in both states (bottom 798 and
758 of 842; 44px and 84px of headroom); 4 durable local records; no network
request; no prototype figure on screen
```

### The 52 new tests, by what they actually prove

**`design.test.cjs` (8)** — both approved references pinned by sha256 and read
byte-for-byte, A first and C second; **a one-byte change to a copy of a real
reference fails the pin, with the untouched copy as the control** (review F5);
both typefaces pinned by sha256, size and `wOF2` magic, inlined, with no `http`
anywhere in the shell or the stylesheet; the shipped template and view bind (40
classes); an invented class, an invented phrase, a copied prototype figure, or a
reworded runtime phrase each **fails**; the template carries no digit; the
shipped stylesheet is the approved bytes followed by the three named corrections,
each laid down after the rules it corrects; the preview chrome introduces no
colour and no type size the approved references do not already declare.

**`adapter.test.cjs` (18)** — the composed engine's `applyRead` is byte-identical
to the full engine's for seven weights; the screen cannot mint an id; a weigh-in
becomes a real reading operation with a commitment, and the outbox entry
**co-exists** with it; **the durability rule is all-or-nothing, executed in both
directions** — fail the outbox write and zero operations survive, fail the
operation write and zero of both, with the no-failure control writing one of each
(review F10); `stateFromOps()` equals the reference engine's `applyRead` result
exactly; the instruction changes because the engine changed; a reload restores
every projection and **writes not one byte**; `restart()` does the same; an
invalid value, a storage failure, an expired lease, a repeat same-day weigh-in
and **an impossible weight (10000, 0, −5, 59.9, 400.1, 180.01, 1e12)** are each
refused in words, leave storage byte-identical, and change nothing on screen
(review F8), with 60 lb recorded unchanged as the control that the bound is a
form bound; **the engine's note on a reading reaches the DTO verbatim, and is
absent when the engine attaches none** (review F1); an evicted store paints **no
number at all**; an empty log produces no morning reading; every number in the
view DTO is reproduced independently from the engine; the backend is a genuine
all-or-nothing store; a Storage that denies writes is reported, not silently
downgraded.

**`view.test.cjs` (17)** — Today paints the approved design from engine values
only; the primary action and the sentence under the instruction are the engine's
own marching order; the sheet rebinds every engine-derived value; **a spike
reading renders the engine's note and a quiet reading renders none**, with a
control asserting the writer really does attach one (review F1); `morningLine`
and `trendLine` add no words of their own; **an impossible weight is refused in
words with the sheet left open and nothing recorded**, and an empty box is
refused by the *client* in the client's words (review F8); a refused weigh-in
leaves Today byte-identical; a page reload restores the stored weigh-in; Why
shows only engine explanations; every unwired screen says so and shows no
invented value; the workout entry point shows the session name and not one digit;
an untrusted record paints no figure anywhere and disables the primary action;
**every figure on Today equals the reference engine's value slot by slot**, before
and after a weigh-in; **not one digit appears outside a bound slot**; **every
input the page actually renders is ≥16px**, named explicitly, computed against
the shipped cascade; and **the 16px correction is proved load-bearing** on the
approved fields A3 will render, with the approved-only cascade as the control
(review F4).

**`package.test.cjs` (9)** — three assets and only three; the approved design
pinned and all seven templates present; the bundle carries the real engine and
the real client and nothing forbidden (and a forbidden input or an unapproved
dependency **fails** the assertion); **no shipped asset references a remote
origin and both typefaces are inlined** (review F9); no athlete data and no
credential in the bundle; an extra asset blocks serving and a rebuild removes
exactly it; the server binds 127.0.0.1 with a policy that **names no external
origin at all**, plus `connect-src 'none'`, `worker-src 'none'`, `no-store`,
`nosniff`; `/ledger/state.json`, `/src/history.js`, `/src/app.jsx`,
`/package.json`, traversal, encoded traversal and POST are all refused; the
sibling w7-preview package is untouched and owns a different folder.

### Two weak tests I wrote, and how they were caught

1. **`/\b2,300\b/` against `2,300kcal`** — no word boundary between `0` and `k`,
   so the assertion could never fail. Caught by the real browser in round 0;
   replaced by slot-by-slot equality against the reference engine plus "no digit
   outside a bound slot".
2. **The 16px cascade parser did not strip CSS comments**, so every
   `preview.css` rule was skipped and the test measured the approved 14px while
   passing. Caught by the reviewer's F4 and fixed in round 1; an unparseable
   selector is now an assertion failure rather than a silent skip.

Both are disclosed rather than quietly corrected, because a test that cannot
fail is worse than no test.

---

## 7. Decisions taken (design ambiguities resolved, per the brief)

1. **Which Today — settled by review F2.** Today follows **Additions C**, the
   authoritative implementation reference, structure for structure: it carries
   all four of C's entry points and it is the version that fits one 390×844
   viewport. Refinement A's evidence grid and bottom note are not in the
   authoritative Today and are gone.
2. **The engine's words are not reworded.** The headline is `move.title` exactly
   as the engine emits it (`CLOSE THE BOOKS FIRST`), not sentence-cased into the
   prototype's "Keep the plan." The reading note is the writer's own string. The
   only transformation anywhere is capitalising the first letter of the marching
   order's verb phrase so it can head a button.
3. **"Eat about [N] kcal."** The Refinement A handoff keeps this presentation and
   forbids inventing a tolerance. A1 shows `calorieTarget.mid` to the nearest
   hundred — the same presentation the already-reviewed w7-preview uses — and
   prints the engine's **actual unrounded band** directly underneath, so the
   rounding hides nothing. No allowance is invented.
4. **"About 60 min" is gone.** The prototype's duration has no engine source.
   `9 exercises` became the real count from `genSession` (2 for this fixture).
5. **A repeat same-day weigh-in is refused, not stored.** The accepted writer
   keeps the FIRST reading for a date and ignores a later one. Writing a second
   operation would leave the log and the screen disagreeing. A1 refuses and names
   the correction path as not wired. The view also carries an `unadopted` count
   so a disagreement could never be silent.
6. **The weigh-in entry screen.** The 2026-09-08 design covers no weigh-in entry
   screen. Rather than importing the old mock's stylesheet, A1 builds the sheet
   from Refinement A's **own** direct-entry control — `.field` /
   `.number-control` / `.step` / `.error` / `.cta` — inside a preview-owned
   `.sheet-panel` that uses only approved tokens. `.sheet-panel` is the single
   named preview-owned class.
7. **A 60–400 lb, one-decimal entry bound (review F8).** The client accepts any
   finite number; without a bound a slip of the thumb becomes a permanent fact.
   The bound lives in the adapter, refuses in words, never rounds an entry into
   range, and is a FORM bound — not an engine admission rule and not a new client
   law. Same numbers as the reviewed w7-preview's form.
8. **A fixed synthetic day (2030-02-04).** The fixture's history is anchored
   there. If the page used the device clock, a stored weigh-in would stop being
   "today's" tomorrow and the fixture's 28-day history would be meaningless. The
   page says on screen that it is a synthetic athlete.
9. **The typefaces are inlined, not fetched (review F9).** The pinned local files
   the phone host already uses, as `data:` URLs, so the page has nothing left to
   fetch and A5 inherits an offline-capable launch.
10. **Three CSS corrections, all restating approved values.** `preview.css`
    overrides exactly three things, and each uses a value one of the approved
    references already declares:
    (a) **the iOS zoom rule** — the approved references set 13–15px on the
    check-in follow-ups, the sleep-hours box and the coach composer; Safari zooms
    the page below 16px, which breaks the fixed phone layout the design depends
    on. Corrected to 16px, per MOCK.md's rule for an approved layout that
    conflicts with an accessibility requirement.
    (b) **`.view .intro h1` → C's 47px/1.04/−.025em** — Today follows C, so it
    takes C's headline metric. A's `.intro h1` (54px) is more specific than C's
    `h1` and would otherwise win purely because A's stylesheet is also loaded for
    the weigh-in sheet's controls.
    (c) **`.view .trend .sub` → C's `.coach-entry .sub` values** — C composes "a
    main line with a quieter second line" once, on its coach entry; Today's trend
    control is the same composition, so it gets the same declared values rather
    than a new idea.
    A test asserts the chrome introduces no colour and no type size the approved
    references do not already contain.
11. **The weekly-rate sentence moved from Today to Why.** C's Today has no rate
    line. It is still engine-sourced and still on screen, one tap away, in the
    "The rate itself" section.
12. **A second build, beside the reviewed one, rather than a rebind in place.**
    See §8.1 — this one is forced, not chosen.

---

## 8. LIMITS — in plain language

1. **The rebound Today is a NEW page beside the reviewed preview, not a
   replacement of it.** The accepted M2-NATIVE-CARRIERS package runs
   `rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` and asserts
   `# pass 19`. Those tests assert that the built `index.html` contains the OLD
   mock's T01/T02/T08 templates, that `styles.css` starts with the old mock's
   bytes, that `buildPreview()` returns the old mock's sha256, and that no bundle
   input path matches `node_modules` — which the real client cannot satisfy,
   because `rebuild/client/ops.cjs` needs SHA-256 and the accepted browser
   boundary supplies it from `@noble/hashes`. Rebinding the reviewed build in
   place would fail the accepted package. So A1 keeps that build untouched and
   adds `rebuild/m3/w7-preview/today/` with its own three assets and its own
   port. **The PM should decide** whether to re-seal the package so the old
   preview can be retired; A1 will not re-seal an accepted artifact.
2. **The new tests are NOT in CI.** I added a CI step and had to revert it:
   `.github/workflows/rebuild.yml` is one of the files pinned by
   `acceptance-native-carriers.json`, and editing it turns
   `native-carriers-package.cjs --ci` RED. `design.test.cjs`,
   `adapter.test.cjs` and `view.test.cjs` need nothing but the root lockfile and
   would run in CI unchanged; `package.test.cjs` and `browser-check.mjs` need
   `rebuild/m3/w6`'s own dependencies, exactly as the W6 browser build does, and
   would not. **Adding the step needs the pinned workflow re-sealed — a PM/engine
   decision, not a screen builder's.** Until then these 52 tests are PC and
   reviewer evidence only.
3. **The athlete history is synthetic.** Everything except today's weigh-in comes
   from `fixtures.cjs`: the exercises, the split, the sleep, the food log and the
   28 prior readings. Joe's real history enters only through C2's on-PC port.
   The engine numbers are real; the athlete is not.
4. **The identity, the authority key and the lease are synthetic literals** minted
   in `today-model.cjs` and named `…-not-a-credential`. They authorize nothing
   and reach no server. There is no transport, so the client runs offline and
   never claims a sync. Issuance, admission, currentness and receipts are not
   exercised at all.
5. **Only the weigh-in is wired.** The gym card (A2), the recovery check-in (A3)
   and Dad's first run (A4) are entry points with the approved visuals and an
   explicit "not wired yet". The nutrition detail shows the engine's real energy
   and protein and says **"Not prescribed"** for carbohydrate and fat, because
   the engine issues no such target. The coach screen is a title and a
   disclaimer — no scripted conversation.
6. **No correction, no tombstone, no second reading for a day.** The client
   supports all three; A1 wires none. A repeat weigh-in is refused with that named
   limit (§7.5).
7. **Durability is `localStorage`, which is per-origin and per-browser-profile.**
   It survives reload, quit and reboot, and the real browser check proves all
   three. It does not survive clearing site data, and it is not the encrypted
   IndexedDB repository the W6 host uses. Moving Today onto that repository is a
   real follow-on: it is asynchronous, and `rebuild/client`'s store interface is
   synchronous, so it is not a drop-in.
8. **No phone has opened this.** The real browser check runs headless Chromium on
   the PC at a 390×844 viewport. iOS Safari specifically — the install, the zoom
   behaviour the 16px rule is for, VoiceOver, 200% text — is A5's, untested here.
   The layout headroom is **44px before a weigh-in** and 84px after; an engine
   instruction one line longer than the current worst case would consume it, and
   the browser check is what would catch that.
9. **The entry bound is the adapter's, not the engine's or the client's.**
   60–400 lb with one decimal (§7.7). Below 60 or above 400 is refused by the
   FORM, in words. This is not a claim that the engine would reject such a
   reading — it would accept it — and it is not a new client law. A1 previously
   claimed the engine already labelled implausible readings; that was wrong. The
   engine labels readings it *damps* (spike / inside-your-noise), which is a
   different thing, and those labels are now shown (review F1).
10. **`genSession` is called only for the exercise count and the session name.**
    Prescriptions, loads, effort targets and the debut path are read by A2, not
    here. If `genSession` throws, the card says the exercises are unavailable and
    names the code; it never shows a count it did not get.
11. **`unadopted` is defensive, and currently always 0.** It exists so that a log
    holding a reading the engine did not adopt could never be silent. Nothing in
    A1 can produce that state today.
12. **The `@noble/hashes` dependency is real** and comes from
    `rebuild/m3/w6/package.json`, not the root lockfile. The page's SHA-256 is the
    accepted W6 browser boundary's, unchanged; A1 wrote no crypto. But it does
    mean this build needs W6's dependencies installed, which is why §8.2 stands.
13. **No mutation campaign.** Beyond the negative controls the tests carry (a
    forbidden bundle input, an unapproved dependency, an invented class, an
    invented phrase, a copied figure, a one-byte design tamper, a failing backend
    in two positions, an expired lease, an evicted store, the approved-only
    cascade), A1 ran no systematic mutation of its own code.
14. **The A0 host is untouched.** A1 needed no extension under
    `rebuild/m3/w6/host/`, and added none. A0's 22 tests are green at this head,
    unmodified.
15. **A locally tampered operation is trusted (reviewer F3, left open).** The
    adapter asks the client for its reading projection and shows it. Nothing
    verifies the stored operation's commitment against its bytes on read, so an
    attacker with access to this origin's `localStorage` could change a stored
    weight and the screen would believe it. That is a `rebuild/client` property,
    not an A1 one — the same is true of the reviewed preview and of the W6 host —
    and it is out of this slice's scope. It matters more once Joe's real history
    is on the device (C2/C3).
16. **Registering `writers.cjs` LAST is inert here (reviewer F6, left open).**
    `today-engine.cjs` appends `writers.cjs` in the position `engine/index.cjs`
    and A0's host runtime give it, and a test proves `applyRead` is byte-identical
    to the full engine's. But nothing A1 does would *detect* a wrong position:
    the read modules this screen uses do not call back into the writer. The
    ordering is correct by construction and by parity, not by an executed control
    that would fail if it were moved.

---

## 9. What the reviewer should attack first

1. **§8.1** — is a second build beside the reviewed one the right call, or should
   the accepted package be re-sealed and the old preview retired? That is the one
   structural decision A1 could not take.
2. **The 44px of layout headroom (§8.8)** — is a browser assertion enough, or
   does the headline slot need a bound on how long an engine instruction may be
   before the design breaks?
3. **Decision §7.7** — the 60–400 lb form bound. It is the one place A1 refuses
   something the client would accept. Check the wording, the numbers, and that it
   never silently alters an entry.
4. **The class/copy binding in `design.cjs`** — it is the whole guarantee that
   "rebound to the approved design" means something. Try adding a class, a
   sentence, or one of the prototype's figures and confirm the build goes red.
5. **The refusal paths** — kill storage mid-write in either position, expire the
   lease, wipe `ops` while keeping the checkpoint, and confirm the screen never
   invents a number and never claims a save it did not make.
6. **Decision §7.3** — the rounded calorie headline. It is the one presentation
   choice A1 inherited rather than derived.
