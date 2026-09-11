# A1 — Today rebound to the approved design, over a real client adapter

Branch `rebuild/slice-a1`, from `rebuild/t2-client-core` @
`fb7a84eba37e8c705374234c8b8c1126b0b6efd6` (A0 host assembly merged, ledger
line 98). Builder: Opus builder (Earned A1). **Candidate, not accepted.** An
independent Opus reviewer plus CI is the acceptance (plumbing/screens tier,
DECISIONS:88). Nothing here is self-accepted.

Node v24.19.0, on Joe's PC. Nothing installed, nothing purchased, no network
use by any test or build. No private folder, no `src/history.js`, no `ledger/`,
no `rebuild/conform/private/` was read. No athlete data printed, no token
printed, nothing deleted. The frozen app is untouched.

`git diff --stat fb7a84e..HEAD` is the whole claim: **A1 adds files and
modifies none.**

---

## 1. What A1 does, in one paragraph

The Today screen now renders the owner-approved 2026-09-08 design, and every
figure on it is either an accepted-engine result or a durable operation in the
real `rebuild/client` log. A morning weigh-in is one all-or-nothing local
transaction (the operation plus its outbox entry); the engine then reads *that
operation* — the accepted `writers.applyRead` replays it onto the synthetic
basis — and the instruction, the calorie band, the protein target, the trend and
the rate all move because the engine moved. Close the page, reload it, reboot
the machine: the reading is still there and the screen is byte-identical. The
gym card, the nutrition detail, the recovery check-in and the coach are entry
points with the approved visuals and a plain "not wired yet" state; they show
no number they cannot source.

---

## 2. Files added

| file | lines | bytes | sha256 |
|---|---:|---:|---|
| `rebuild/m3/w7-preview/today/browser-check.mjs` | 106 | 5585 | `b3e23c2829945bf1ceeb4595e4841f610f1be1bf3337d82d9d9076ba6dd9ad3b` |
| `rebuild/m3/w7-preview/today/build.mjs` | 129 | 6149 | `02e0c4ac51ead69cb51f75ea9d3a3c476f6e3f860faeb44730859048caf85c3c` |
| `rebuild/m3/w7-preview/today/design.cjs` | 118 | 6076 | `a4101333f1925ec5f127581483a39447974a1e55d6ffb0d77247c218df31c3c4` |
| `rebuild/m3/w7-preview/today/index.shell.html` | 30 | 1410 | `6b1d7b5b2b85e6f149eba9b742c543400d18febb1c84e36e2c533300202f0c16` |
| `rebuild/m3/w7-preview/today/preview.css` | 38 | 1635 | `b654b18ac3d1102311477f68204bb685f50cab36922a47bda997d627a449de81` |
| `rebuild/m3/w7-preview/today/screens.template.html` | 142 | 6927 | `8f05f892ea63af71b1ad372b9ee545dc18110af9e2e151445902af8fc87945f2` |
| `rebuild/m3/w7-preview/today/serve.mjs` | 95 | 4646 | `6b6486fd91ad7f33e2eef0a078f905ff0d27643f441a992b0c48f923d5f6ac0d` |
| `rebuild/m3/w7-preview/today/today-app.cjs` | 300 | 14026 | `6319f3e7361c6e29ffebcbea8a5e430c466b70ada6349e86ab8465eead3db539` |
| `rebuild/m3/w7-preview/today/today-engine.cjs` | 39 | 1969 | `c5e3ed2491ccb3fd50d21260879aab4a6bcc736caef687b2cc0d6fa5b5ba5d1c` |
| `rebuild/m3/w7-preview/today/today-entry.mjs` | 16 | 653 | `b0b1b6ba36634ceb4d7b024283e2a8916f8960a62cc43424a1d836c2b8a20a45` |
| `rebuild/m3/w7-preview/today/today-model.cjs` | 288 | 13426 | `cf75e9d8488c8fce5e7e5757ed6b2c8203ef1b6bee60f01612e9b69f68ce2481` |
| `rebuild/m3/w7-preview/today/web-storage-backend.cjs` | 126 | 4978 | `3a80b921f9fd9849286c0e95064e4491e45f67a41222a0317dd8f452f0dcf548` |
| `rebuild/m3/w7-preview/today/test/adapter.test.cjs` | 253 | 11945 | `f6b60306deb61daf8642bfb101bcdbec0769aba27b2b97518fe9f2c119096588` |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | 72 | 3892 | `14f68dc49b2a9bf152078d8a232392428c24b403ed6ebcbeaa5f085188a1c70e` |
| `rebuild/m3/w7-preview/today/test/package.test.cjs` | 138 | 7191 | `53598c1c97e59e67d35cf05fed28d36d20398e62b2751603b89e5d73fbf8a197` |
| `rebuild/m3/w7-preview/today/test/view.test.cjs` | 289 | 14553 | `006344e860f5a17d3eb2ec92ae1f2f1a183172af2a654e2cecda09c968bc1563` |
| `rebuild/slice/A1-REPORT.md` | — | — | this file |

Every other file in the tree — `rebuild/engine/*`, `rebuild/client/*`,
`rebuild/conform/*`, `rebuild/m4/spec/*`, `rebuild/m3/w6/*`,
`rebuild/m3/w7-preview/*` (the existing preview), `rebuild/m1/*`,
`.github/workflows/*` — is **byte-unchanged**. See §8 for the one place that
cost something.

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
restart it.

### What the screen shows with the synthetic fixture

The fixture is `rebuild/m3/w7-preview/fixtures.cjs` — the invented synthetic
athlete the reviewed preview already uses, unchanged, with its reads truncated
at the day before the fixed synthetic day `2030-02-04`. Nothing about it is
Joe's. On a browser profile that has never opened the page:

```
Earned                                   Monday, February 4
Your plan for today
CLOSE THE BOOKS FIRST
The cut is working — this week's drop is real now, not noise.

Eat about
2,300 kcal        Today's target 2,262–2,360 kcal
155 g protein     A floor, not a ceiling — 153 g at least
Your full nutrition plan →

UPPER BODY · TODAY
2 exercises
Your set targets are ready. Logging them is not wired yet.
How are you feeling today? →

This morning   Not logged yet        Weight trend   180.4 lb
Trend down 1.19 lb/week over 28 readings, 2030-01-07 to 2030-02-03.
Why this plan? →

[ Log the scale → ]
one number, fasted — the trend absorbs the noise so a single morning never moves a decision
Ask your coach — Your plan, progress and the reasons behind it. →
```

Tap the black button, type a weight, submit. After a weigh-in of 179.4:

```
NOTHING NEEDS YOU
Eat about 2,300 kcal   Today's target 2,278–2,376 kcal
This morning ✓ 179.4 lb          Weight trend 180.1 lb
Trend down 1.22 lb/week over 28 readings, 2030-01-08 to 2030-02-04.
[ Start UPPER BODY · TODAY → ]   Logging a workout is not wired yet.
```

Reload the page, quit the browser, reboot: the reading and every figure above
come back unchanged. The banner beside the phone says
"Saved on this device. It survives a reload, a restart and a reboot."

Every one of those figures is traced in §5. `CLOSE THE BOOKS FIRST`,
`NOTHING NEEDS YOU`, the explanation sentence, the marching-order line, the band
and the rate are the **engine's own strings**; the adapter reworded none of them.
`2,300` is the engine's own midpoint (2,327) shown to the nearest hundred — it
coincides with the prototype's fictional 2,300 by accident, and §6 explains how
the tests tell the difference.

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
  the stored readings through `applyRead`. There is no trend formula in A1.
* **The bundle is the phone host's bundle.** `build.mjs` produces the page with
  `rebuild/m3/w6/build-browser.mjs` — the same browser build
  `rebuild/m3/w6/host/build-host.mjs` uses for the phone host — so the
  `node:crypto` boundary (`rebuild/m3/w6/node-sha256-browser.mjs`, allowed only
  for `rebuild/client/ops.cjs` and `plan.cjs`), the authority exclusions and the
  pinned input inventory are the accepted ones. That is also why one build
  output can serve the PC preview and A5's phone host unchanged.

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
| sentence under it | `statusFace(state).cause` — the engine's own string |
| `2,300 kcal` | `calorieTarget(state).mid` rounded to the nearest 100 (§7, decision 3) |
| `Today's target 2,262–2,360 kcal` | `calorieTarget(state).lo` / `.hi`, unrounded |
| `155 g protein` | `proteinTarget(state).g` |
| `A floor, not a ceiling — 153 g at least` | `proteinTarget(state).floor` |
| `UPPER BODY · TODAY` | `nowModel(state).workout.title` |
| `2 exercises` | `genSession(state, day, null).ex.length` |
| `This morning ✓ 179.4 lb` | the reading the ENGINE adopted for today (§7, decision 5) |
| `Weight trend 180.1 lb` | `nowModel(state).headed.weight` |
| `Trend down 1.22 lb/week over 28 readings, …` | `currentRate(state)` `.scale` `.n` `.from` `.to` |
| primary button before a weigh-in | `marchingOrder(state).thenText`, first letter capitalised |
| the line under it | `marchingOrder(state).why` |
| Why this plan? sections | `calorieTarget.why`, `proteinTarget.why`, `statusFace.cause` + `move.body`, the stored reading's date + rate span, the rate's own interval |
| Nutrition: Energy, Protein | the same engine targets |
| Nutrition: Carbohydrate, Fat | **"Not prescribed"** — the engine issues no such target |
| everything else | static copy that occurs verbatim in the approved HTML |

There is no other number anywhere. The template file itself carries **no digit
in any text node** and the build fails if one appears.

---

## 6. Verification — commands executed, and their tails

All on the PC, at the branch head.

| command | result |
|---|---|
| `node --test rebuild/m3/w7-preview/test/{model,view,package}.test.cjs` | **19 pass / 0 fail** (the pinned preview, untouched) |
| `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | **22 pass / 0 fail** (A0 still green) |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **`NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`**, exit 0 |
| `node rebuild/m3/w6/test/run-current-head.cjs . --all` | **435 pass / 0 fail**, exit 0 |
| `node rebuild/m3/w7-preview/today/build.mjs` | `A1 TODAY BUILD PASS: 3 assets; 38 pinned inputs (13 engine, 12 client); approved design pinned; 48 bound classes; no literal figure in the template` |
| `node --test rebuild/m3/w7-preview/today/test/{design,adapter,view,package}.test.cjs` | **41 pass / 0 fail** |
| `node rebuild/m3/w7-preview/today/browser-check.mjs` (with `W7_BROWSER_BIN`) | `A1 TODAY BROWSER CHECK PASS — mounted, weighed in (179.4 lb), survived a real reload and a new page; 4 durable local records; no prototype figure on screen` |

### The 41 new tests, by what they actually prove

**`design.test.cjs` (6)** — both approved references pinned by sha256 and read
byte-for-byte; the shipped template binds (48 classes checked); an invented
class, an invented phrase or a copied prototype figure each **fails**; the
template carries no digit; the shipped stylesheet is the approved bytes with the
one accessibility correction after them, and the preview's own CSS introduces no
colour the approved palette does not define.

**`adapter.test.cjs` (15)** — the composed engine's `applyRead` is byte-identical
to the full engine's for seven weights; the screen cannot mint an id; a weigh-in
becomes a real reading operation with a commitment and its outbox entry **in the
same transaction**, and `stateFromOps()` equals the reference engine's
`applyRead` result exactly; the instruction changes because the engine changed;
a reload restores every projection and **writes not one byte**; `restart()` does
the same; an invalid value, a storage failure, an expired lease and a repeat
same-day weigh-in are each refused with the client's own copy, leave storage
byte-identical, and change nothing on screen; an evicted store paints **no
number at all** and reports `RESTORE_REQUIRED`; an empty log produces no morning
reading; every number in the view DTO is reproduced independently from the
engine; the backend is a genuine all-or-nothing store (rollback reverts every
staged write); a Storage that denies writes is reported, not silently downgraded.

**`view.test.cjs` (12)** — Today paints the approved design from engine values
only; the primary action before a weigh-in is the engine's own marching order;
the sheet rebinds every engine-derived value; a refused weigh-in shows the
client's refusal, keeps the sheet open and changes nothing; a page reload
restores the stored weigh-in on screen; Why shows only engine explanations;
every unwired screen says so and shows no invented value (carbohydrate and fat
carry **no digit**); the workout entry point shows the session name and not one
figure; an untrusted record paints no figure anywhere and disables the primary
action; **every text input renders at ≥16px**, computed against the actual
shipped cascade with `el.matches()`, on every screen including the weigh-in
sheet; **every figure on Today equals the reference engine's value slot by
slot**, before and after a weigh-in; and **not one digit appears outside a bound
slot**.

**`package.test.cjs` (8)** — three assets and only three; the approved design
pinned and all seven templates present; the bundle carries the real engine and
the real client and nothing forbidden (and a forbidden input or an unapproved
dependency **fails** the assertion); no athlete data and no credential in the
bundle; an extra asset blocks serving and a rebuild removes exactly it; the
server binds 127.0.0.1 with `connect-src 'none'`, `worker-src 'none'`,
`no-store`, `nosniff`; `/ledger/state.json`, `/src/history.js`, `/src/app.jsx`,
`/package.json`, traversal, encoded traversal and POST are all refused; the
sibling w7-preview package is untouched and owns a different folder.

### A weak test I wrote and then fixed — disclosed

My first view test guarded the prototype's fictional numbers with
`/\b2,300\b/`. On screen the text is `2,300kcal`, and there is no word boundary
between `0` and `k`, so that assertion could never fail — it passed on any
content. The real browser found it (a substring check caught `2,300` and I had
to work out whether it was a prototype leak or a real engine value; it is the
engine's own rounded midpoint). The guard is now (a) substring checks limited to
figures this fixture's engine cannot produce, plus (b) the two strong tests that
replaced it: slot-by-slot equality against the reference engine, and **no digit
outside a bound slot**. Those two are what actually hold the line.

---

## 7. Decisions taken (design ambiguities resolved, per the brief)

1. **Which Today.** Refinement A is the Today plan-first design of record;
   Additions C is "THE authoritative implementation reference" and adds three
   entry points to the same screen. A1 renders **A's Today structure** (intro,
   food, training, evidence grid, one primary action) with **C's added entries**
   (full nutrition plan, "How are you feeling today?", "Ask your coach"). The
   stylesheet is C's bytes then A's bytes, so A wins on the rules the two share.
2. **The engine's words are not reworded.** The headline is `move.title` exactly
   as the engine emits it (`CLOSE THE BOOKS FIRST`), not sentence-cased into the
   prototype's "Keep the plan." The only transformation anywhere is capitalising
   the first letter of the marching order's verb phrase so it can head a button.
3. **"Eat about [N] kcal."** The Refinement A handoff keeps this presentation and
   forbids inventing a tolerance. A1 shows `calorieTarget.mid` to the nearest
   hundred — the same presentation the already-reviewed w7-preview uses — and
   prints the engine's **actual unrounded band** directly underneath, so the
   rounding hides nothing. No allowance is invented.
4. **"About 60 min" is gone.** The prototype's duration has no engine source, so
   it is not shown. `9 exercises` became the real count from `genSession`
   (2 for this fixture).
5. **A repeat same-day weigh-in is refused, not stored.** The accepted writer
   keeps the FIRST reading for a date and ignores a later one. Writing a second
   operation would leave the log and the screen disagreeing. A1 refuses with
   "Today's weigh-in is already recorded on this device. Changing a recorded
   reading needs the correction path, which is not wired yet." The view also
   carries an `unadopted` count so a disagreement could never be silent.
6. **The weigh-in entry screen.** The 2026-09-08 design covers no weigh-in entry
   screen. Rather than importing the old mock's stylesheet (which would fight the
   approved one), A1 builds the sheet from the approved design's **own**
   direct-entry control — `.field` / `.number-control` / `.step` / `.error` /
   `.cta`, Refinement A's performed-entry vocabulary — inside a preview-owned
   `.sheet-panel` that uses only approved tokens. `.sheet-panel` is the single
   named preview-owned class.
7. **The 16px input rule vs the approved CSS.** The approved references set
   13–15px on the check-in follow-ups, the sleep-hours box and the coach
   composer. Safari zooms the page below 16px, which breaks the fixed phone
   layout the design depends on. Per MOCK.md's rule for exactly this case, A1
   corrects only those selectors to 16px, after the approved rules, preserving
   their size, border and colour. It is the only rule A1 overrides.
8. **A fixed synthetic day (2030-02-04).** The fixture's history is anchored
   there. If the page used the device clock, a stored weigh-in would stop being
   "today's" tomorrow and the fixture's 28-day history would be meaningless. The
   page says on screen that it is a synthetic athlete.
9. **A second build, beside the reviewed one, rather than a rebind in place.**
   See §8 — this one is forced, not chosen.

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
   decision, not a screen builder's.** Until then these 41 tests are PC and
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
   the PC at a 390×844 viewport. iOS Safari specifically — the install, the
   zoom behaviour the 16px rule is for, VoiceOver, 200% text — is A5's, untested
   here.
9. **The sheet's minus/plus step is 0.1 lb** and is preview-owned, not an engine
   rule or an admission bound. Unlike the reviewed preview, A1 imposes **no**
   60–400 lb range of its own: the client decides what it will record, and its
   answer is shown verbatim. A weight the engine treats as a spike is labelled by
   the engine, not by the adapter.
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
    invented phrase, a copied figure, a failing backend, an expired lease, an
    evicted store), A1 ran no systematic mutation of its own code.
14. **The A0 host is untouched.** A1 needed no extension under
    `rebuild/m3/w6/host/`, and added none. A0's 22 tests are green at this head,
    unmodified.

---

## 9. What the reviewer should attack first

1. **§8.1** — is a second build beside the reviewed one the right call, or should
   the accepted package be re-sealed and the old preview retired? That is the one
   structural decision A1 could not take.
2. **The class/copy binding in `design.cjs`** — it is the whole guarantee that
   "rebound to the approved design" means something. Try adding a class, a
   sentence, or one of the prototype's figures and confirm the build goes red.
3. **The refusal paths** — kill storage mid-write, expire the lease, wipe `ops`
   while keeping the checkpoint, and confirm the screen never invents a number
   and never claims a save it did not make.
4. **Decision §7.3** — the rounded calorie headline. It is the one presentation
   choice A1 inherited rather than derived, and a reviewer may reasonably want the
   exact midpoint instead.
